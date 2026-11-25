"""ม.2 บทที่ 5 สมบัติของเลขยกกำลัง (ด่าน 8501–8518): ทำหน้าลงมือทำที่บอทของ audit ทำไม่ได้ (แตะนับ/ตัดตัวประกอบ จัดการ์ด ลาก) จนปุ่ม "ถัดไป" ปลดล็อก
    python3 tests/powers_m2.py            เมาส์
    python3 tests/powers_m2.py --touch    นิ้ว (CDP touch events)
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
    def tapall():
        for _ in range(80):
            if not locked(): return
            ok = pg.evaluate("""(() => { const c = ([...document.querySelectorAll('#stage .btn.info')].find(b => b.offsetParent !== null && !b.disabled) || [...document.querySelectorAll('#stage .e3-tile:not(.cut):not([data-n]), #stage .e3-chip.comp')].find(b => b.offsetParent !== null && !b.disabled)); return !!c; })()""")
            if not ok: return
            tapel("([...document.querySelectorAll('#stage .btn.info')].find(b => b.offsetParent !== null && !b.disabled) || [...document.querySelectorAll('#stage .e3-tile:not(.cut):not([data-n]), #stage .e3-chip.comp')].find(b => b.offsetParent !== null && !b.disabled))")
            pg.wait_for_timeout(60)
    check('mul', 8504, 0, tapall); check('div', 8505, 0, tapall); check('tree', 8516, 0, tapall)
    check('sort6', 8506, 1, sortall); check('sort13', 8513, 0, sortall); check('sort18', 8518, 1, sortall)
    def f():
        for e in [0, -2, -4]: drag(40 + 7 * 70, 150, 40 + (e + 4) * 70, 150)
    check('ladder', 8510, 0, f)
    def f():
        for t in [3, 6]: drag(50, 220, 50 + t * 85, 220)
    check('grow', 8517, 0, f)
    for k, v in res.items(): print(f'{k:8s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
