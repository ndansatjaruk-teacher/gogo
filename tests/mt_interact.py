#!/usr/bin/env python3
"""ม.ต้น: every drag page does what it is meant to do (v242).

Each case drives a teach page with real input — mouse or finger (CDP touch) — and checks the
*purpose* of the page (the value the child should discover shows up, the gate opens), not only
that something moved.

  python3 tests/mt_interact.py                 # mouse, normal Chrome
  python3 tests/mt_interact.py --touch         # finger
  python3 tests/mt_interact.py --legacy        # Safari-like legacy CSS zoom + hit-test CTM, page zoomed
  python3 tests/mt_interact.py --only seaSim,boxBuild
"""
import argparse, math, os, pathlib, re, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser(); ap.add_argument('--touch', action='store_true'); ap.add_argument('--legacy', action='store_true'); ap.add_argument('--only', default='')
A = ap.parse_args(); ONLY = set(x for x in A.only.split(',') if x)
R = math.pi / 180

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'] + (['--disable-blink-features=StandardizedBrowserZoom'] if A.legacy else []))
    ctx = b.new_context(viewport={'width': 1000, 'height': 700} if A.legacy else {'width': 1180, 'height': 820}, has_touch=A.touch); pg = ctx.new_page()
    if A.legacy: pg.add_init_script('window.ZF_FORCE_HIT = true')
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
    pg.goto((ROOT / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800)
    pg.evaluate("SET.mute = true; window.say = () => {}; window.__td = 0; document.addEventListener('teachdone', () => window.__td++, true); 0")
    cdp = ctx.new_cdp_session(pg) if A.touch else None

    def open_page(lid, t):
        pg.evaluate(f"startTeach(LESSONS.findIndex(L => L.id === {lid}), {t}); window.__td = 0"); pg.wait_for_timeout(700)
    def scr(sel, x, y):  # svg user point → screen point (same matrix the page uses)
        return pg.evaluate(f"(() => {{ const s = document.querySelector('#stage {sel}'), m = s.getScreenCTM(), q = s.createSVGPoint(); q.x = {x}; q.y = {y}; const r = q.matrixTransform(m); return [r.x, r.y]; }})()")
    def drag_screen(pts, steps=10):
        a = pts[0]
        if cdp:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]}); cur = a
            for t in pts[1:]:
                for k in range(1, steps + 1): cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': cur[0] + (t[0] - cur[0]) * k / steps, 'y': cur[1] + (t[1] - cur[1]) * k / steps}]}); pg.wait_for_timeout(8)
                cur = t
            pg.wait_for_timeout(60); cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else:
            pg.mouse.move(*a); pg.mouse.down()
            for t in pts[1:]: pg.mouse.move(*t, steps=steps); pg.wait_for_timeout(10)
            pg.wait_for_timeout(60); pg.mouse.up()
        pg.wait_for_timeout(160)
    def drag(sel, pts, steps=10): drag_screen([scr(sel, *q) for q in pts], steps)
    def click(sel):
        r = pg.evaluate(f"(() => {{ const e = document.querySelector('#stage {sel}'); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }})()")
        if not r: return False
        if cdp: cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': r[0], 'y': r[1]}]}); cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else: pg.mouse.click(*r)
        pg.wait_for_timeout(200); return True
    out = lambda: pg.evaluate("(document.querySelector('#stage .fnote') || {}).textContent || ''")
    gate = lambda: pg.evaluate("window.__td") > 0
    results = []
    def check(name, ok, why=''):
        results.append((name, ok)); print(f"{'✓' if ok else '✗'} {name:12s} {why}", flush=True)

    # ---------- ม.1 จำนวนเต็ม ----------
    def seaSim():
        open_page(2001, 0); sel = '.mi-seabox svg'; Y = lambda v: 20 + (10 - v) * 13; seen = []
        for v in [7, -4, 0]:
            drag(sel, [(240, Y(v) + (30 if v > 0 else -30)), (240, Y(v))]); seen.append(out())
        ok = '7' in seen[0] and 'เหนือ' in seen[0] and '4' in seen[1] and 'ใต้' in seen[1] and 'พอดี' in seen[2] and gate()
        check('seaSim', ok, ' | '.join(s[:28] for s in seen))
    def oppSim():
        open_page(2003, 0)
        xs = pg.evaluate("(() => { const el = document.querySelector('#stage .mi-nl'), s = el.querySelector('svg'), m = s.getScreenCTM(), o = {}; for (let v = el.lo; v <= el.hi; v++) { const q = s.createSVGPoint(); q.x = el.X(v); q.y = el.y0; const r = q.matrixTransform(m); o[miN(v)] = [r.x, r.y]; } return o; })()")
        got = []
        for n in ['5', '−3', '2']:
            if n not in xs: check('oppSim', False, 'no tick ' + n); return
            a = xs[n]; drag_screen([[a[0] - 30, a[1]], a]); got.append(out())
        ok = 'ตรงข้ามของ 5' in got[0] and '−5' in got[0] and '|−3| = 3' in got[1] and gate()
        check('oppSim', ok, ' | '.join(g[:30] for g in got))
    # ---------- ม.1 ลำน้ำเรขา ----------
    def angType():
        open_page(2201, 2); sel = 'svg.mg-sum'; O = (280, 170); P = lambda d, r=130: (O[0] + r * math.cos(d * R), O[1] - r * math.sin(d * R))
        path = [P(50)] + [P(d) for d in range(55, 256, 5)]; seen = []
        for stop in [40, 90, 135, 180, 250]:
            cur = pg.evaluate("+((document.querySelector('#stage .fnote').textContent.match(/= (\\d+)°/) || [])[1] || 0)")
            pts = [P(cur)] + [P(cur + (stop - cur) * k / 12) for k in range(1, 13)]
            drag(sel, pts, 3); seen.append(out()[:24])
        ok = all(f'= {d}°' in s for d, s in zip([40, 90, 135, 180, 250], seen)) and 'ครบทั้ง 5' in out() and gate()
        check('angType', ok, ' | '.join(seen))
    def equiSeg():
        open_page(2204, 3); sel = 'svg.mg-sum'; good = 0
        for y in [70, 140, 210]:
            drag(sel, [(200, y + 20), (284, y)]); good += 'PA = PB' in out()
        check('equiSeg', good == 3 and gate(), out()[:60])
    def equiAng():
        open_page(2206, 1); sel = 'svg.mg-sum'; V = (70, 280); good = 0
        for r in [150, 260, 370]:
            q = (V[0] + r * math.cos(33 * R), V[1] - r * math.sin(33 * R)); drag(sel, [(q[0] + 30, q[1] + 30), q]); good += 'เท่ากัน' in out()
        check('equiAng', good == 3 and gate(), out()[:60])
    def dist():
        open_page(2208, 3); sel = 'svg.mg-sum'
        drag(sel, [(110, 250), (200, 250)]); o1 = out(); drag(sel, [(200, 250), (306, 250)]); o2 = out()
        check('distSim', '⊥' not in o1 and '⊥' in o2 and gate(), o1[:20] + ' → ' + o2[:30])
    def trans():
        open_page(2209, 1); sel = 'svg.mg-trans'
        for k in range(3): click(f'.mg-set:nth-child({k + 1})')
        o1 = out(); P = lambda d: (330 + 90 * math.cos(d * R), 110 - 90 * math.sin(d * R))
        drag(sel, [P(60)] + [P(60 + 40 * k / 10) for k in range(1, 11)], 3); o2 = out()
        a1 = re.findall(r'(\d+)°', o1)[:2]; a2 = re.findall(r'(\d+)°', o2)[:2]
        check('transSim', gate() and a1 != a2 and len(a2) == 2 and int(a2[0]) + int(a2[1]) == 180, f'{a1} → {a2}')
    def sumSim():
        open_page(2211, 2); sel = 'svg.mg-sum'; sums = []; c = (230, 70)
        for t in [(120, 120), (400, 60), (300, 200)]:
            drag(sel, [c, t]); c = t; sums.append(re.findall(r'(\d+)°', out())[:4])
        ok = all(len(s) == 4 and int(s[0]) + int(s[1]) + int(s[2]) == 180 for s in sums) and len(set(tuple(s) for s in sums)) == 3 and gate()
        check('sumSim', ok, str(sums))
    # ---------- ม.3 สถิติ ----------
    def boxBuild():
        open_page(3608, 3); sel = 'svg.m3-build'
        info = pg.evaluate("(() => { const d = [...document.querySelectorAll('#stage .m3-datab .m3-t')].map(t => +t.textContent.replace(/[^0-9.]/g, '')); const F = m3Five(d), ax = m3Axis(F); return { F, ax }; })()")
        F, ax = info['F'], info['ax']; X = lambda v: 44 + (v - ax['lo']) / (ax['hi'] - ax['lo']) * (640 - 88)
        lab = {'min': 'ค่าต่ำสุด', 'q1': 'Q₁', 'q2': 'Q₂', 'q3': 'Q₃', 'max': 'ค่าสูงสุด'}
        def cur():
            o = {}
            for t in pg.evaluate("[...document.querySelectorAll('#stage svg.m3-build text.m3-lb')].map(t => t.textContent)"):
                for k, n in lab.items():
                    if t.startswith(n + ' '): o[k] = float(t.split(' ')[-1].replace(',', ''))
            return o
        order = ['max', 'q3', 'q2', 'q1', 'min'] if F['max'] > cur()['max'] else ['min', 'q1', 'q2', 'q3', 'max']
        for k in order:
            c = cur(); drag(sel, [(X(c[k]), 70), (X(F[k]), 70)], 8)
        click('.m3-bb .btn.primary'); o = out()
        check('boxBuild', 'ถูกต้อง' in o and gate(), o[:50] + ' ' + str(cur()))
    def techSim():
        open_page(3614, 0); sel = 'svg.m3-tech'; t0 = pg.evaluate("document.querySelector('#stage .m3-out').textContent")
        xs = pg.evaluate("[...document.querySelectorAll('#stage svg.m3-tech circle[data-i]')].map(c => [+c.getAttribute('cx'), +c.getAttribute('cy')])")
        for (x, y), dx in zip([xs[0], xs[len(xs) // 2], xs[-1]], [-40, 60, 200]):
            drag(sel, [(x, y), (min(620, max(20, x + dx)), y)])
        t1 = pg.evaluate("document.querySelector('#stage .m3-out').textContent")
        check('techSim', t0 != t1 and gate(), t1[:70])
    # ---------- ม.3 ตรีโกณ ----------
    def trig():
        cases = {'right': (4101, [[(250, 80), (340, 100)], [(340, 100), (340, 170)]]), 'scale': (4104, [[(114, 198), (198, 135)], [(198, 135), (226, 114)], [(226, 114), (366, 30)], [(366, 30), (142, 198)]]),
                 'ladder': (4105, [[(330, 100), (330, 250 - 200 * math.sin(30 * R))], [(330, 150), (330, 250 - 200 * math.sin(60 * R))], [(330, 80), (330, 250 - 200 * math.sin(45 * R))]]),
                 'ramp': (4106, [[(280, 214), (280, 262 - 5 * 12)], [(280, 200), (280, 262 - 10 * 12)], [(280, 140), (280, 8)]]),
                 'shadow': (4117, [[(400, 100), (410, 64)], [(400, 60), (330 + 50, 144 - 50 * math.tan(60 * R))], [(380, 60), (410, 144 - 80 * math.tan(30 * R))]]),
                 'elev': (4116, [[(360, 50), (260, 130 - 150 * math.tan(30 * R))], [(260, 43), (260, 130 + 150 * math.tan(40 * R))], [(260, 250), (360, 130 + 250 * math.tan(20 * R))]]),
                 'walk': (4118, [[(120, 250), (420 - 42.6 / math.tan(30 * R) * 4.6, 250)], [(80, 250), (420 - 42.6 / math.tan(60 * R) * 4.6, 250)]])}
        for name, (lid, paths) in cases.items():
            open_page(lid, 0)
            for path in paths: drag('.tg-board svg', path)
            mis = pg.evaluate("[...document.querySelectorAll('#stage .tg-mi')].every(e => e.classList.contains('ok'))")
            check('tg-' + name, mis and gate(), out()[:40])

    CASES = {'seaSim': seaSim, 'oppSim': oppSim, 'angType': angType, 'equiSeg': equiSeg, 'equiAng': equiAng, 'distSim': dist, 'transSim': trans, 'sumSim': sumSim, 'boxBuild': boxBuild, 'techSim': techSim, 'trig': trig}
    for k, f in CASES.items():
        if ONLY and k not in ONLY: continue
        try: f()
        except Exception as e: check(k, False, 'EXC ' + str(e)[:120])
    bad = [n for n, ok in results if not ok]
    print(f"{len(results) - len(bad)} / {len(results)} pages work as intended" + (f" — not: {', '.join(bad)}" if bad else ' ✓'), '| errors:', errs[:3])
    sys.exit(1 if bad or errs else 0)
