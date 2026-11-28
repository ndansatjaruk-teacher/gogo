"""ป.3 บทที่ 3 เวลา (ด่าน 1201–1211 · v298: หน้าลงมือเอง (ลาก/แตะ) ที่คงไว้ หาหน้าจากชื่อ "ลงมือเอง"): ลาก/แตะทุกหน้าลงมือทำจริงจนครบภารกิจ แล้วตรวจว่าปุ่ม "ถัดไป" ปลดล็อก
    python3 tests/time_p3.py            เมาส์
    python3 tests/time_p3.py --touch    นิ้ว (CDP touch events)
ต้อง build ก่อน (dist/index.html) · ใช้ CHROME=/path/to/chrome ได้
"""
import os, sys, pathlib
from playwright.sync_api import sync_playwright
TOUCH = '--touch' in sys.argv
def run():
  with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {})); ctx = br.new_context(viewport={'width': 1180, 'height': 820}, has_touch=TOUCH); pg = ctx.new_page(); cdp = ctx.new_cdp_session(pg)
    pg.goto((pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800); pg.evaluate("SET.mute = true; window.say = () => {}; 0")
    locked = lambda: pg.evaluate("!!document.querySelector('.btn.primary.waiting')")
    def open_(lid, k):
        li = pg.evaluate(f"LESSONS.findIndex(L=>L.id==={lid})"); k = pg.evaluate(f"(() => {{ const i = LESSONS[{li}].teach.findIndex(s => (s.t || '').includes('ลงมือเอง')); return i < 0 ? {k} : i; }})()"); pg.evaluate(f"startTeach({li},{k})"); pg.wait_for_timeout(600)
    def cpt(x, y):
        return pg.evaluate(f"(() => {{ const s = document.querySelector('#stage .tg-board svg'), m = s.getScreenCTM(), q = s.createSVGPoint(); q.x = {x}; q.y = {y}; const r = q.matrixTransform(m); return [r.x, r.y]; }})()")
    def drag(x0, y0, x1, y1):
        a = cpt(x0, y0); b = cpt(x1, y1)
        if TOUCH:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]})
            for i in range(1, 9): cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a[0] + (b[0] - a[0]) * i / 8, 'y': a[1] + (b[1] - a[1]) * i / 8}]}); pg.wait_for_timeout(20)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else:
            pg.mouse.move(*a); pg.mouse.down(); pg.mouse.move(*b, steps=8); pg.mouse.up()
        pg.wait_for_timeout(120)
    def tapel(js):  # js = expression giving an element
        r = pg.evaluate(f"(() => {{ const e = {js}; if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }})()")
        if not r: raise Exception('missing ' + js)
        if TOUCH: pg.touchscreen.tap(*r)
        else: pg.mouse.click(*r)
        pg.wait_for_timeout(120)
    def tapsel(sel, i=0): tapel(f"document.querySelectorAll('#stage {sel}')[{i}]")
    def taptext(sel, t): tapel(f"[...document.querySelectorAll('#stage {sel}')].find(b => b.textContent.trim().startsWith({t!r}))")
    def item(side, kind): tapel(f"document.querySelector('#stage .lq-it[data-s=\"{side}\"][data-k=\"{kind}\"]')")
    def sortall():
        for _ in range(12):
            n = pg.evaluate("document.querySelectorAll('#stage .rp-card').length")
            if not n: return
            nb = pg.evaluate("document.querySelectorAll('#stage .rp-binx').length")
            for j in range(nb):
                tapsel('.rp-card', 0); tapsel('.rp-binx', j)
                if pg.evaluate("document.querySelectorAll('#stage .rp-card').length") < n: break
    import math
    def arc(m0, m1, t0=None):  # drag the minute hand clockwise from minute m0 to m1 on the clock (centre 150,150 · r 74 × 1.25)
        C, R = (150, 150), 74 * 260 / 208; n = (m1 - m0) % 60 or 60
        pts = [cpt(C[0] + R * math.sin((m0 + n * i / max(8, n)) * 6 * math.pi / 180), C[1] - R * math.cos((m0 + n * i / max(8, n)) * 6 * math.pi / 180)) for i in range(max(8, n) + 1)]
        if TOUCH:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': pts[0][0], 'y': pts[0][1]}]})
            for q in pts[1:]: cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': q[0], 'y': q[1]}]}); pg.wait_for_timeout(18)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else:
            pg.mouse.move(*pts[0]); pg.mouse.down()
            for q in pts[1:]: pg.mouse.move(*q); pg.wait_for_timeout(18)
            pg.mouse.up()
        pg.wait_for_timeout(150)
    res = {}
    def check(name, lid, k, fn):
        open_(lid, k); l0 = locked()
        try: fn()
        except Exception as e: res[name] = 'ERR ' + str(e)[:90]; return
        pg.wait_for_timeout(400); res[name] = ('ok' if (l0 and not locked()) else f'start_locked={l0} end_locked={locked()} | ' + pg.evaluate("(document.querySelector('#stage .fnote') || {}).textContent || ''")[:60])
    check('clock1', 1201, 0, lambda: (arc(0, 47), arc(47, 15), arc(15, 2)))
    check('clock2', 1202, 0, lambda: (arc(50, 4), arc(4, 30), arc(30, 0)))
    def line(start_d, ds, mx, y=150):
        for d in ds: drag(40 + start_d / mx * 520, y, 40 + d / mx * 520, y); start_d = d
    check('line60', 1203, 0, lambda: line(120, [180, 300, 420], 480))
    check('line1', 1204, 0, lambda: line(2, [23, 35, 42], 60))
    check('line5', 1205, 0, lambda: line(10, [155, 80, 225], 240))
    def f():
        n0 = 50
        for n in [135, 160, 300]: drag(30 + n0 * 1.8, 82, 30 + n * 1.8, 82); n0 = n
    check('unit', 1206, 0, f)
    def f():
        b0 = 40; U = 440 / 160
        for b in [80, 95, 130]: drag(120 + b0 * U, 125, 120 + b * U, 125); b0 = b
    check('cmp', 1207, 0, f)
    def f():
        for i in range(5): tapsel('.t3m-row', i)
    check('rec', 1208, 0, f)
    def f():
        U = 540 / 150; drag(30 + 40 + 50 * U - 6, 130, 30 + 95 * U + 25 * U, 60)
    check('add', 1209, 0, f)
    check('sort10', 1210, 2, sortall)
    def f():
        X = lambda t: 30 + (t - 720) / 420 * 540; s0 = 735
        for st in [810, 960, 765]: drag(X(s0 + 50), 110, X(st + 50), 110); s0 = st
    check('block', 1211, 0, f)
    for k, v in res.items(): print(f'{k:8s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
