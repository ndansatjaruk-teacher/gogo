"""UX audit of a whole grade: opens every teach page (boards stepped to the end), every game question
(also with the answer revealed) and every boss question at iPad size, and measures the screen:

  scroll  the page or a box inside it needs scrolling (rule: every screen fits 1180×820)
  cut     text partly hidden by a box edge or the screen edge (Thai vowels cut off, labels clipped)
  overlap two pieces of text drawn on top of each other
  tap     a button / option / handle smaller than 36 px after the screen zooms to fit (WCAG 2.2 AA asks ≥ 24 px; Apple 44 pt —
          new buttons should be ≥ 44 px before zoom)
  small   text smaller than 13 px (iPad held at arm's length / projector)
  split   a minus sign or a pair (x, y) broken over two lines
  faint   text colour too close to its background (contrast below WCAG AA)

    python3 tests/ux_audit.py --grade 7 [--touch] [--size 1180x820] [--lesson 2801 2802] [--shots /tmp/ux]
Exits 1 when any screen has a problem; prints one line per problem kind and lesson.
"""
import argparse, json, os, pathlib, sys, time, collections
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIT = r"""() => {
  const W = innerWidth, H = innerHeight, out = [];
  const name = el => { let s = el.tagName.toLowerCase(); const c = (el.getAttribute && el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2); if (c.length) s += '.' + c.join('.'); return s; };
  const txt = el => (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  const opa = new Map();
  const flip = el => { for (let e = el, k = 0; e && e.nodeType === 1 && k < 6; e = e.parentElement, k++) if (getComputedStyle(e).backfaceVisibility === 'hidden') return true; return false; };
  const shown = el => { /* effective visibility: display, visibility, opacity of every ancestor */
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (opa.has(e)) { if (!opa.get(e)) return false; continue; }
      const cs = getComputedStyle(e); const ok = cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05; opa.set(e, ok); if (!ok) return false; }
    return true; };
  const clipOf = new Map();
  const clipRect = el => { /* the part of the screen this element can be seen through (overflow-clipping ancestors) */
    if (clipOf.has(el)) return clipOf.get(el);
    let r = { l: 0, t: 0, r: W, b: H };
    const p = el.parentElement;
    if (p) { r = { ...clipRect(p) }; const cs = getComputedStyle(p);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') { const q = p.getBoundingClientRect();
        if (cs.overflowX !== 'visible') { r.l = Math.max(r.l, q.left); r.r = Math.min(r.r, q.right); }
        if (cs.overflowY !== 'visible') { r.t = Math.max(r.t, q.top); r.b = Math.min(r.b, q.bottom); } }
      if (cs.position === 'fixed') r = { l: 0, t: 0, r: W, b: H }; }
    clipOf.set(el, r); return r; };
  const stage = document.querySelector('#app') || document.body;
  const se = document.scrollingElement; if (se.scrollHeight > H + 2 || se.scrollWidth > W + 2) out.push({ k: 'scroll', w: 'page', d: se.scrollWidth + '×' + se.scrollHeight });
  const all = [...stage.querySelectorAll('*')].filter(el => !el.closest('.d1rm'));
  for (const el of all) {
    if (el instanceof SVGElement) continue;
    const cs = getComputedStyle(el);
    if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 4 && shown(el)) out.push({ k: 'scroll', w: name(el), d: `${el.clientHeight}→${el.scrollHeight}px` });
    if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 4 && shown(el)) out.push({ k: 'scroll', w: name(el), d: `x ${el.clientWidth}→${el.scrollWidth}px` });
  }
  /* text: every text node, line by line */
  const lines = [];
  const tw = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const s = n.nodeValue; if (!s.trim()) continue; const el = n.parentElement; if (!el || el.closest('svg, script, style, .d1rm, title')) continue;
    if (!shown(el)) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()].filter(r => r.width > 1 && r.height > 1); if (!rs.length) continue;
    const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
    const ell = cs.textOverflow === 'ellipsis', c = ell ? clipRect(n) : clipRect(el); /* a long title that ends in … is cut on purpose: only its visible part counts */
    for (const r of rs) {
      const vw = Math.min(r.right, c.r) - Math.max(r.left, c.l), vh = Math.min(r.bottom, c.b) - Math.max(r.top, c.t);
      const a = Math.max(0, vw) * Math.max(0, vh) / (r.width * r.height);
      if (a > 0.05 && a < 0.9 && !ell) out.push({ k: 'cut', w: name(el), d: `"${s.trim().slice(0, 30)}" ${Math.round(a * 100)}% seen` });
      if (a >= 0.9 || (ell && a > 0.05)) { const L = Math.max(r.left, c.l), R = Math.min(r.right, c.r), T = Math.max(r.top, c.t), B = Math.min(r.bottom, c.b); lines.push({ r: { left: L, right: R, top: T, bottom: B, width: R - L, height: B - T }, el, s: s.trim() }); } /* only the part that is not clipped (a long title ends in … before the buttons) */
    }
    if (fs < 13 && s.trim().length > 1) out.push({ k: 'small', w: name(el), d: `${fs}px "${s.trim().slice(0, 24)}"` });
    /* a minus or a pair (x, y) broken over two lines */
    const re = /[−-]\s?\d|\(\s*[−-]?[\d.\/]+\s*,\s*[−-]?[\d.\/]+\s*\)/g; let m;
    while ((m = re.exec(s))) { const r2 = document.createRange(); r2.setStart(n, m.index); r2.setEnd(n, m.index + m[0].length); const q = [...r2.getClientRects()].filter(r => r.width > 0.5);
      if (q.length > 1 && Math.abs(q[0].top - q[q.length - 1].top) > fs * 0.6) out.push({ k: 'split', w: name(el), d: `"${m[0]}"` }); }
    /* contrast against the first solid background behind the text */
    const lum = c3 => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c3[0]) + 0.7152 * f(c3[1]) + 0.0722 * f(c3[2]); };
    const rgba = v => { const m2 = v.match(/rgba?\(([^)]+)\)/); if (!m2) return null; const p = m2[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; };
    const fg = rgba(cs.color); let bg = null, unknown = false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const ec = getComputedStyle(e); if (ec.backgroundImage && ec.backgroundImage !== 'none') { unknown = true; break; } const b = rgba(ec.backgroundColor); if (b && b[3] > 0.6) { bg = b; break; } }
    if (fg && bg && !unknown && fg[3] > 0.5 && !(el.matches('.ans-slot, .slot, .blank, .ix-dz, b.num') && s.trim() === '?') && !el.matches('.mg-bi')) { /* the empty-box "?" is a placeholder */ const L1 = lum(fg), L2 = lum(bg), cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05), big = fs >= 24 || (fs >= 18.6 && +cs.fontWeight >= 700);
      if (cr < (big ? 3 : 4.5)) out.push({ k: 'faint', w: name(el), d: `${cr.toFixed(1)}:1 "${s.trim().slice(0, 20)}"` }); }
  }
  /* svg labels: tiny, cut, or on top of each other */
  for (const t of stage.querySelectorAll('svg text')) {
    if (!t.textContent.trim() || !shown(t)) continue; const r = t.getBoundingClientRect(); if (r.width < 1) continue;
    const c = clipRect(t.closest('svg')); const svgR = t.ownerSVGElement && t.ownerSVGElement.getBoundingClientRect();
    if (r.height < 11) out.push({ k: 'small', w: 'svg text', d: `${r.height.toFixed(0)}px "${t.textContent.trim().slice(0, 16)}"` });
    const vw = Math.min(r.right, c.r, svgR ? svgR.right + 1 : W) - Math.max(r.left, c.l, svgR ? svgR.left - 1 : 0), vh = Math.min(r.bottom, c.b, svgR ? svgR.bottom + 1 : H) - Math.max(r.top, c.t, svgR ? svgR.top - 1 : 0);
    const a = Math.max(0, vw) * Math.max(0, vh) / (r.width * r.height);
    if (a < 0.85 && a > 0.02) out.push({ k: 'cut', w: 'svg text', d: `"${t.textContent.trim().slice(0, 20)}" ${Math.round(a * 100)}% seen` });
    lines.push({ r, el: t, s: t.textContent.trim(), svg: 1 });
  }
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
    const A = lines[i], B = lines[j]; if (A.el === B.el || A.el.contains(B.el) || B.el.contains(A.el)) continue;
    if (A.s === B.s && Math.abs(A.r.left - B.r.left) < 3 && Math.abs(A.r.top - B.r.top) < 3) continue; /* the same text drawn twice on the same spot looks like one */
    if (flip(A.el) || flip(B.el)) continue; /* two faces of a flip card: one face is turned away */
    const ow = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left), oh = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top); if (ow <= 0 || oh <= 0) continue;
    const sh = A.svg || B.svg ? 0.62 : 0.7; /* svg text boxes include the font's empty top and bottom */
    const ar = (ow * oh) / Math.min(A.r.width * A.r.height * sh * sh, B.r.width * B.r.height * sh * sh);
    if (ar > 0.25 && oh > Math.min(A.r.height, B.r.height) * (1 - sh)) out.push({ k: 'overlap', w: name(A.el) + ' × ' + name(B.el), d: `"${A.s.slice(0, 14)}" × "${B.s.slice(0, 14)}"` });
  }
  /* finger targets */
  const seen = new Set();
  for (const el of stage.querySelectorAll('button, a[href], input, select, [role=button], .opt, [onclick], .tg-board [data-drag], .k1brd, *')) {
    if (seen.has(el)) continue;
    const cs = getComputedStyle(el); const act = el.matches('button, a[href], input, select, [role=button], .opt') || cs.cursor === 'pointer' || cs.cursor === 'grab' || cs.cursor === 'move';
    if (!act) continue; const pc = el.parentElement && getComputedStyle(el.parentElement).cursor; if (!el.matches('button, a[href], input, .opt') && (pc === 'pointer' || pc === 'grab' || pc === 'move')) continue;
    seen.add(el); if (!shown(el) || el.disabled || el.closest('.d1b-bd')) continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const m = Math.min(r.width, r.height); if (m < 36) out.push({ k: 'tap', w: name(el), d: `${r.width.toFixed(0)}×${r.height.toFixed(0)} "${txt(el).slice(0, 18)}"` });
  }
  /* things drawn off the screen */
  for (const el of stage.querySelectorAll('button, .opt, .card, svg')) { if (!shown(el)) continue; const r = el.getBoundingClientRect(); if (r.width < 2) continue; const c = clipRect(el);
    if ((r.right > W + 2 || r.bottom > H + 2) && c.r >= W - 1) out.push({ k: 'scroll', w: name(el), d: `goes off screen to ${r.right.toFixed(0)}×${r.bottom.toFixed(0)}` }); }
  const key = o => o.k + '|' + o.w + '|' + o.d; const u = new Map(); out.forEach(o => u.set(key(o), o)); return [...u.values()];
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--grade', type=int, default=7)
    ap.add_argument('--lesson', type=int, nargs='*')
    ap.add_argument('--touch', action='store_true')
    ap.add_argument('--size', default='1180x820')
    ap.add_argument('--shots')
    ap.add_argument('--json')
    ap.add_argument('--only', help='comma list of kinds to report')
    ap.add_argument('--part', default='1/1', help='k/n: only every n-th lesson starting at k (run several at once)')
    a = ap.parse_args()
    w, h = map(int, a.size.split('x'))
    probs, t0, nscr, tim, shotted = [], time.time(), 0, [0], set()
    with sync_playwright() as p:
        br = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {}))
        ctx = br.new_context(viewport={'width': w, 'height': h}, has_touch=a.touch, is_mobile=False); pg = ctx.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=''))
        pg.route('https://fonts.gstatic.com/**', lambda r: r.abort())
        pg.goto((ROOT / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(900)
        pg.evaluate("SET.mute = true; window.say = () => {}; window.__D1B_FAST = 0.02; window.confetti = () => {}; 0")
        Ls = pg.evaluate(f"LESSONS.map((L, i) => ({{ i, id: L.id, title: L.title, boss: !!L.boss, pages: (L.teach || []).map(s => s.t || ''), grade: (CITIES.find(c => c.lessons.includes(L)) || {{}}).grade }})).filter(L => L.grade === {a.grade})")
        if a.lesson: Ls = [L for L in Ls if L['id'] in a.lesson]
        pk, pn = map(int, a.part.split('/')); Ls = Ls[pk - 1::pn]
        locked = lambda: pg.evaluate("!!document.querySelector('.btn.primary.waiting')")

        def audit(where, shot):
            nonlocal nscr
            nscr += 1; t1 = time.time()
            # the screen re-fits itself (zoom to fit) up to ~0.5 s after it opens: wait until nothing moves any more
            pg.evaluate("new Promise(ok => { let last = '', same = 0, t = 0; const tick = () => { const s = [...document.querySelectorAll('#stage, #stage .qbody, #stage .visual, #stage [style*=zoom]')].map(e => { const r = e.getBoundingClientRect(); return e.className + r.width.toFixed(0) + 'x' + r.height.toFixed(0) + (e.style.zoom || ''); }).join('|'); if (s === last) same++; else { same = 0; last = s; } if ((same >= 4 && t > 550) || t > 2000) ok(); else { t += 50; setTimeout(tick, 50); } }; tick(); })")
            tim[0] += time.time() - t1; r = pg.evaluate(AUDIT)
            if a.only: r = [o for o in r if o['k'] in a.only.split(',')]
            for o in r: o['at'] = where; probs.append(o)
            new = {(shot.split('_')[0], o['k'], o['w']) for o in r} - shotted
            if new and a.shots:  # one picture per lesson and problem kind
                shotted.update(new); pathlib.Path(a.shots).mkdir(parents=True, exist_ok=True); pg.screenshot(path=f"{a.shots}/{shot}.png")
                for o in r: o['shot'] = shot
            if errs: probs.append({'k': 'error', 'w': 'js', 'd': errs[0][:120], 'at': where}); errs.clear()

        def step_board():  # step the board to its last step (stop there: one more Space would open the next page)
            for _ in range(40):
                if pg.evaluate("(() => { const a = document.querySelector('#stage .d1b-again'); return !a || a.style.display !== 'none'; })()"): break
                pg.keyboard.press('Space'); pg.wait_for_timeout(90)
            pg.wait_for_timeout(250)

        def step_show():
            for _ in range(40):
                if not pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): break
                pg.evaluate("document.querySelector('#stage .r4d-nx').click()"); pg.wait_for_timeout(260)

        for k, L in enumerate(Ls):
            if L['boss']:
                n = pg.evaluate(f"LESSONS[{L['i']}].exam.length")
                for j in range(n):
                    pg.evaluate(f"(() => {{ const L = LESSONS[{L['i']}]; L.__ex = L.__ex || L.exam; L.__ps = L.__ps || L.pass; L.exam = [L.__ex[{j}]]; L.pass = 1; startBoss({L['i']}); L.exam = L.__ex; L.pass = L.__ps; }})()")
                    pg.wait_for_timeout(250); audit(f"{L['id']} บอส ข้อ {j + 1}", f"{L['id']}_boss{j + 1}")
                continue
            for i, t in enumerate(L['pages']):
                pg.evaluate(f"startTeach({L['i']}, {i})"); pg.wait_for_timeout(250)
                audit(f"{L['id']} หน้า {i + 1} {t[:24]} (เริ่ม)", f"{L['id']}_t{i}a")
                if pg.evaluate("!!document.querySelector('#stage .d1b')"): step_board(); audit(f"{L['id']} หน้า {i + 1} {t[:24]} (ครบ)", f"{L['id']}_t{i}b")
                elif pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): step_show(); audit(f"{L['id']} หน้า {i + 1} {t[:24]} (ครบ)", f"{L['id']}_t{i}b")
            nq = pg.evaluate(f"(() => {{ window.__qs = gameSet(LESSONS[{L['i']}]); return __qs.length; }})()")
            for j in range(nq):
                pg.evaluate(f"(() => {{ const q = __qs[{j}], g = window.gameSet; window.gameSet = () => [q]; try {{ startGame({L['i']}); }} finally {{ window.gameSet = g; }} }})()")
                pg.wait_for_timeout(200); sig = pg.evaluate(f"__qs[{j}].__sig || ''")
                audit(f"{L['id']} เกม ข้อ {j + 1} [{sig[:30]}]", f"{L['id']}_g{j + 1}")
                pg.evaluate(f"(() => {{ const b = document.querySelector('#stage .qbody'); if (b) revealAll(b, {{ check() {{}}, say() {{}}, why() {{}}, progress() {{}} }}, __qs[{j}]); }})()")
                pg.wait_for_timeout(150); audit(f"{L['id']} เกม ข้อ {j + 1} เฉลย [{sig[:30]}]", f"{L['id']}_g{j + 1}r")
            print(f"  … {k + 1}/{len(Ls)} {L['id']} {L['title'][:30]} · {len(probs)} problems so far", flush=True)
        br.close()
    print(f"{len(Ls)} lessons · {nscr} screens · {time.time() - t0:.0f}s (waiting for the screen to settle {tim[0]:.0f}s)")
    if a.json: pathlib.Path(a.json).write_text(json.dumps(probs, ensure_ascii=False, indent=1))
    agg = collections.OrderedDict()
    for o in probs: agg.setdefault((o['k'], o['w'], o['d']), []).append(o['at'])
    for (k, w_, d), ats in sorted(agg.items(), key=lambda x: (x[0][0], -len(x[1]))):
        print(f"  ✗ {k:7s} {w_[:40]:40s} {d[:60]:60s} ×{len(ats)}  e.g. {ats[0]}")
    print(f"{len(probs)} problem(s)" if probs else 'all good ✓'); sys.exit(1 if probs else 0)


if __name__ == '__main__':
    main()
