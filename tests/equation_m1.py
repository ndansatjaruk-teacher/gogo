"""ม.1 บทที่ 6 สมการเชิงเส้นตัวแปรเดียว (ด่าน 2601–2620): ลาก/แตะทุกหน้าลงมือทำจริงจนครบภารกิจ แล้วตรวจว่าปุ่ม "ถัดไป" ปลดล็อก
    python3 tests/equation_m1.py            เมาส์
    python3 tests/equation_m1.py --touch    นิ้ว (CDP touch events)
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
        li = pg.evaluate(f"LESSONS.findIndex(L=>L.id==={lid})"); pg.evaluate(f"startTeach({li},{k})"); pg.wait_for_timeout(600)
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
    res = {}
    def check(name, lid, k, fn):
        open_(lid, k); l0 = locked()
        try: fn()
        except Exception as e: res[name] = 'ERR ' + str(e)[:90]; return
        pg.wait_for_timeout(400); res[name] = ('ok' if (l0 and not locked()) else f'start_locked={l0} end_locked={locked()}')
    def f():
        n = pg.evaluate("document.querySelectorAll('#stage .mi-sgc').length")
        for i in range(n): tapsel('.mi-sgc', i)
    check('signs', 2601, 1, f)
    def f():
        for b in [5, 2, 6]: drag(30 + 4 * 40, 172, 30 + b * 40, 172)
    check('dist', 2602, 0, f)
    def f():
        SX = 540 / 13
        for x in [4, -2, 0]: drag(40 + 6 * SX, 120, 40 + (x + 5) * SX, 120)
    check('sub', 2603, 0, f)
    check('sort4', 2604, 0, sortall); check('sort5', 2605, 0, sortall); check('sort6', 2606, 0, sortall)
    def f():
        for x in [0, 9, 5]: drag(40 + 1 * 45, 220, 40 + (x + 2) * 45, 220)
    check('try', 2607, 0, f)
    def f():
        for _ in range(3): item('L', 'u'); item('R', 'u')
        taptext('.rp-next', 'ข้อต่อไป'); item('L', 'u'); item('R', 'u'); taptext('.lq-act .btn', 'แบ่ง')
    check('bal8', 2608, 0, f)
    def f():
        for _ in range(6): item('L', 'u'); item('R', 'u')
    check('bal9', 2609, 0, f)
    def f(): taptext('.lq-act .btn', 'แบ่ง')
    check('bal10', 2610, 0, f)
    def f():
        taptext('.rp-chip', '+ 4'); taptext('.rp-chip', '÷ 3'); pg.wait_for_timeout(2000); taptext('.rp-chip', '− 5'); taptext('.rp-chip', '× 2'); pg.wait_for_timeout(2000)
    check('machine', 2611, 0, f)
    def f():
        item('L', 'x'); item('R', 'x'); item('L', 'u'); item('R', 'u'); taptext('.lq-act .btn', 'แบ่ง')
    check('bal12', 2612, 0, f)
    def f(): taptext('.rp-chip', '× 2'); taptext('.rp-chip', '× 6')
    check('clear', 2614, 0, f)
    check('sort16', 2616, 0, sortall)
    def f():
        for n in [15, 21, 10]: drag(30 + 4 * 19, 110, 30 + (n - 1) * 19, 110)
    check('consec', 2617, 0, f)
    def f():
        for t in [5, 10, -4]: drag(60 + 10 * 21, 210, 60 + (t + 10) * 21, 210)
    check('age', 2618, 0, f)
    def f():
        for w in [3, 5, 8]: drag(30 + 6 * 29, 40 + 2 * 29, 30 + (w + 4) * 29, 40 + w * 29)
    check('rect', 2619, 0, f)
    for k, v in res.items(): print(f'{k:8s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
