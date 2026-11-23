#!/usr/bin/env python3
"""Play-through audit: plays every game question in the real game screen like a student and checks
every teach page. Slower and stricter than smoke.py.

    python3 tests/audit.py --grade 5             # one grade (run grades in parallel to go faster)
    python3 tests/audit.py --lesson 634 635
    python3 tests/audit.py --json out.json       # save every finding

For each GAME question (shown alone in the real game screen, iPad 1180×820):
  • fit      — the question needs scrolling (the body gets class .tall)
  • answer   — the bot answers keypad (answerBox) and multiple-choice (choices) widgets with the right
               answer; it must end with the "correct" sheet. Questions with other widgets are counted
               as "not auto-answerable" (they are only checked for errors and fit).
  • choice   — a multiple-choice widget with no correct option, or a keypad answer the keypad cannot type
For each TEACH page:
  • fit      — the page needs scrolling
  • clip     — something visible sticks out of the card (checked again after animations settle)
  • gate     — after pressing Space / tapping the example, "ถัดไป" is still locked
Plus: JS errors anywhere, games with fewer than 8 questions.
"""
import argparse, json, os, pathlib, sys, time
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'dist' / 'index.html'

HOOKS = r"""
SET.mute = true; window.say = () => {};
{ const oA = answerBox; window.answerBox = function (ctx, expected, opts) { const w = oA(ctx, expected, opts); w.__exp = String(expected); return w; }; }
{ const oC = choices; window.choices = function (ctx, options, correct, opts) { const w = oC(ctx, options, correct, opts);
    const lab = o => (o.node ? o.node.textContent : String(o.label ?? '').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim(), seen = new Set(), ci = options.findIndex(o => o.value === correct);
    if (ci >= 0) seen.add(lab(options[ci]));
    const kept = options.filter((o, i) => { if (i === ci) return true; if (o.value === correct) return false; const k = lab(o); if (k && seen.has(k)) return false; seen.add(k); return true; });
    w.__ci = kept.findIndex(o => o.value === correct); return w; }; } /* same filter as choices() → index of the right button */
window.__qs = null; { const g = gameSet; window.__gameSetOrig = g; window.gameSet = (L, N) => window.__qs ? window.__qs : g(L, N); }
0
"""

# Answer whatever answerable widget is still open; returns a status string.
SOLVE = r"""async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const ok = () => !!document.querySelector('.sheet .ok');
  for (let step = 0; step < 8; step++) {
    if (ok()) return 'ok';
    const box = document.querySelector('.qbody'); if (!box) return 'no-body';
    const ab = [...box.querySelectorAll('.ans')].find(w => w.__exp != null && !w.classList.contains('done') && w.offsetParent !== null);
    const ch = [...box.querySelectorAll('.opts')].find(w => !w.dataset.done && w.offsetParent !== null);
    if (ab) {
      const e = ab.__exp, kp = ab.querySelector('.keypad');
      if (!kp) return 'answerBox-no-keypad';
      if (!/^\d+$/.test(e)) return 'keypad-cannot-type:' + e;
      const keys = {}; kp.querySelectorAll('button').forEach(b => { const t = b.textContent.trim(); if (/^\d$/.test(t)) keys[t] = b; });
      for (const d of e) keys[d].click();
      const slot = (ab.querySelector('.ans-slot') || {}).textContent?.replace(/,/g, '') ?? e;
      if (slot !== e) return `keypad-typed-${slot}-wanted-${e}`;
      kp.querySelector('.btn.primary').click(); await sleep(120);
      if (!ab.classList.contains('done') && !ok()) return 'keypad-right-answer-rejected:' + e;
      continue;
    }
    if (ch) {
      if (ch.__ci == null) return 'manual';
      if (ch.__ci < 0) return 'choices-no-correct-option';
      const b = ch.children[ch.__ci], want = (ch.ansText || '').trim();
      if (!b) return 'choices-correct-option-not-found:' + want;
      b.click(); await sleep(120);
      if (!ch.dataset.done && !ok()) return 'choice-right-answer-rejected:' + want;
      continue;
    }
    return step ? 'partial' : 'manual';
  }
  return ok() ? 'ok' : 'stuck';
}"""

# something visible sticks out of the main card (cut off at the screen edge) — teach and game
CLIP = r"""() => { const card = document.querySelector('.stage-card'); if (!card) return '';
  const cb = card.getBoundingClientRect(), H = innerHeight, W = innerWidth;
  const bad = [...card.querySelectorAll('button, .opt, .ans, svg, img, canvas, .keypad, b, span, p, td')].find(e => { if (e.closest('svg') && e.tagName !== 'svg') return false;
    const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const st = getComputedStyle(e); if (st.visibility === 'hidden' || +st.opacity === 0) return false;
    const sc = e.closest('.qbody, .visual'); if (sc && sc.classList.contains('tall')) return false;
    return r.bottom > Math.min(cb.bottom, H) + 8 || r.right > Math.min(cb.right, W) + 8 || r.left < Math.max(cb.left, 0) - 8; });
  return bad ? (bad.tagName + '.' + (bad.getAttribute('class') || '') + ' ' + (bad.textContent || '').trim().slice(0, 30)) : ''; }"""

TEACH_PLAY = r"""async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const next = () => [...document.querySelectorAll('button')].find(b => /ถัดไป|เล่นเกม|เริ่มเกม|ไปเล่น/.test(b.textContent) && b.offsetParent !== null);
  const locked = () => { const n = next(); return !!(n && n.classList.contains('waiting')); };
  const vis = document.querySelector('.visual');
  for (let i = 0; i < 30 && locked(); i++) { document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true })); await sleep(90); }
  if (locked() && vis) { const els = [...vis.querySelectorAll('.ia, .tappable, button:not(.restart)')].filter(e => e.offsetParent !== null).slice(0, 12);
    for (const e of els) { e.dispatchEvent(new MouseEvent('click', { bubbles: true })); await sleep(60); if (!locked()) break; } }
  return locked();
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--grade', type=int, nargs='*')
    ap.add_argument('--lesson', type=int, nargs='*')
    ap.add_argument('--json')
    ap.add_argument('--no-teach', action='store_true')
    ap.add_argument('--no-game', action='store_true')
    a = ap.parse_args()
    if not HTML.exists():
        sys.exit('Build first: python3 tools/build.py')
    out, stats, t0 = [], {'q': 0, 'answered': 0, 'manual': 0, 'pages': 0}, time.time()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'])
        pg = b.new_page(viewport={'width': 1180, 'height': 820})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e).splitlines()[0]))
        pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=''))
        pg.route('https://fonts.gstatic.com/**', lambda r: r.abort())
        pg.goto(HTML.as_uri()); pg.wait_for_timeout(800); pg.evaluate(HOOKS)
        lessons = pg.evaluate('LESSONS.map((L, i) => ({ i, id: L.id, title: L.title, grade: (CITIES.find(c => c.lessons.includes(L)) || {}).grade || 1, pages: (L.teach || []).length, boss: !!L.boss }))')
        if a.grade: lessons = [L for L in lessons if L['grade'] in a.grade]
        if a.lesson: lessons = [L for L in lessons if L['id'] in a.lesson]
        def add(L, where, kind, detail=''):
            out.append({'grade': L['grade'], 'id': L['id'], 'title': L['title'], 'where': where, 'kind': kind, 'detail': detail})
        for k, L in enumerate(lessons):
            if L['boss']:
                continue
            if not a.no_teach:
                for i in range(L['pages']):
                    errs.clear()
                    try:
                        pg.evaluate(f"startTeach({L['i']}, {i})"); pg.wait_for_timeout(120)
                        if pg.evaluate("!!document.querySelector('.visual.tall, .tall')"): add(L, f'teach {i + 1}', 'fit', 'needs scrolling')
                        c = pg.evaluate(CLIP)
                        if c: pg.wait_for_timeout(700); c = pg.evaluate(CLIP)  # slide-in animations settle first
                        if c: add(L, f'teach {i + 1}', 'clip', c)
                        if pg.evaluate(TEACH_PLAY): add(L, f'teach {i + 1}', 'gate', 'still locked after Space + taps')
                    except Exception as e:
                        errs.append(str(e).splitlines()[0])
                    stats['pages'] += 1
                    for e in errs: add(L, f'teach {i + 1}', 'error', e)
            if a.no_game: continue
            n = pg.evaluate(f"(window.__qs = null, window.__all = __gameSetOrig(LESSONS[{L['i']}]), __all.length)")
            if n < (10 if L['grade'] == 1 else 8): add(L, 'game', 'count', f'{n} questions')
            for qi in range(n):
                errs.clear(); stats['q'] += 1
                try:
                    pr = pg.evaluate(f"(window.__qs = [__all[{qi}]], startGame({L['i']}), String(__all[{qi}].prompt || '').replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 70))")
                    pg.wait_for_timeout(110)
                    if pg.evaluate("!!document.querySelector('.qbody.tall')"): add(L, f'q{qi + 1}', 'fit', pr)
                    c = pg.evaluate(CLIP)
                    if c: pg.wait_for_timeout(700); c = pg.evaluate(CLIP)
                    if c: add(L, f'q{qi + 1}', 'clip', f'{c} · {pr}')
                    r = pg.evaluate(SOLVE)
                    if r == 'ok': stats['answered'] += 1
                    elif r == 'manual': stats['manual'] += 1
                    else: add(L, f'q{qi + 1}', 'answer', f'{r} · {pr}')
                except Exception as e:
                    errs.append(str(e).splitlines()[0])
                for e in errs: add(L, f'q{qi + 1}', 'error', e)
            pg.evaluate('window.__qs = null')
            if (k + 1) % 25 == 0: print(f'  … {k + 1}/{len(lessons)}', flush=True)
        b.close()
    kinds = {}
    for f in out: kinds[f['kind']] = kinds.get(f['kind'], 0) + 1
    print(f"{len(lessons)} lessons · {stats['pages']} teach pages · {stats['q']} questions "
          f"({stats['answered']} answered by the bot, {stats['manual']} need hands-on widgets) · {time.time() - t0:.0f}s")
    print('findings:', kinds or 'none')
    for f in out: print(f"  ✗ {'ป.%d' % f['grade'] if f['grade'] <= 6 else 'ม.%d' % (f['grade'] - 6)} #{f['id']} {f['where']} [{f['kind']}] {f['detail']}")
    if a.json: pathlib.Path(a.json).write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
    sys.exit(1 if any(f['kind'] in ('error', 'answer') for f in out) else 0)


if __name__ == '__main__':
    main()
