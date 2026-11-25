"""ป.4 บทที่ 9 รูปสี่เหลี่ยมมุมฉาก (ด่าน 1481–1494): หน้า ① ดูภาพ (v250 แตะรูปครบ) และหน้า ② ลาก/แตะลงมือทำจริงจนครบภารกิจ แล้วตรวจว่าปุ่ม "ถัดไป" ปลดล็อก
    python3 tests/rect_p4.py            เมาส์
    python3 tests/rect_p4.py --touch    นิ้ว (CDP touch events)
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
    def cpt(x, y, sel='#stage .tg-board svg'):
        return pg.evaluate(f"(() => {{ const s = document.querySelector('{sel}'), m = s.getScreenCTM(), q = s.createSVGPoint(); q.x = {x}; q.y = {y}; const r = q.matrixTransform(m); return [r.x, r.y]; }})()")
    def path(pts):  # drag through svg points
        P = [cpt(*q) for q in pts]
        if TOUCH:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': P[0][0], 'y': P[0][1]}]})
            for a, b in zip(P, P[1:]):
                for i in range(1, 7): cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a[0] + (b[0] - a[0]) * i / 6, 'y': a[1] + (b[1] - a[1]) * i / 6}]}); pg.wait_for_timeout(18)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else:
            pg.mouse.move(*P[0]); pg.mouse.down()
            for a, b in zip(P, P[1:]): pg.mouse.move(*b, steps=6); pg.wait_for_timeout(18)
            pg.mouse.up()
        pg.wait_for_timeout(150)
    def drag(x0, y0, x1, y1): path([(x0, y0), (x1, y1)])
    def tap(x, y, sel):
        r = cpt(x, y, sel)
        if TOUCH: pg.touchscreen.tap(*r)
        else: pg.mouse.click(*r)
        pg.wait_for_timeout(120)
    def tapel(js):
        r = pg.evaluate(f"(() => {{ const e = {js}; if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }})()")
        if not r: raise Exception('missing ' + js)
        if TOUCH: pg.touchscreen.tap(*r)
        else: pg.mouse.click(*r)
        pg.wait_for_timeout(120)
    def tapsel(sel, i=0): tapel(f"document.querySelectorAll('#stage {sel}')[{i}]")
    def sortall():
        for _ in range(14):
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
        pg.wait_for_timeout(400); res[name] = ('ok' if (l0 and not locked()) else f'start_locked={l0} end_locked={locked()} | ' + pg.evaluate("(document.querySelector('#stage .fnote') || {}).textContent || ''")[:70])
    def box(cells, x0=50, y0=34, g=34, start=(3, 2)):
        c = start
        for w, h in cells: drag(x0 + c[0] * g, y0 + c[1] * g, x0 + w * g, y0 + h * g); c = (w, h)
    check('kind', 1481, 1, lambda: box([(6, 2), (4, 4), (3, 5)]))
    check('diag', 1482, 1, lambda: box([(4, 4), (8, 2), (3, 5)], start=(6, 3)))
    def build():
        sel = '#stage .r4-build svg'
        for x, y in [(1, 1), (6, 1), (6, 4), (1, 4), (1, 1)]: tap(22 + x * 34, 22 + y * 34, sel)
        tapel("[...document.querySelectorAll('#stage .r4-bq button')].find(b => /ตรวจ/.test(b.textContent))")
    check('build', 1483, 1, build)
    def walk():  # A(129.5,64) B(430.5,64) C(430.5,236) D(129.5,236), 1 m = 43
        pts = [(129.5 + 43 * i, 64) for i in range(8)] + [(430.5, 64 + 43 * i) for i in range(1, 5)] + [(430.5 - 43 * i, 236) for i in range(1, 8)] + [(129.5, 236 - 43 * i) for i in range(1, 5)]
        path(pts)
    check('walk', 1484, 1, walk)
    check('stair', 1485, 1, lambda: (drag(341.2, 98.8, 425, 57), drag(422.8, 58, 338, 100)))
    check('tiles', 1486, 1, lambda: box([(3, 2), (4, 3), (6, 2)], start=(2, 2)))
    check('land', 1487, 1, lambda: box([(3, 2), (5, 2), (3, 3)], start=(2, 2)))
    def pond():
        for y in range(5): path([(24 + 5, 20 + y * 50 + 25), (24 + 5 * 50 - 5, 20 + y * 50 + 25)])
    check('pond', 1488, 1, pond)
    check('rows', 1489, 1, lambda: box([(7, 3), (5, 4), (6, 3)], x0=62, start=(4, 2)))
    def sq():
        c = 2
        for s in [5, 3, 6]: drag(120 + c * 40, 34 + c * 40, 120 + s * 40, 34 + s * 40); c = s
    check('square', 1490, 1, sq)
    def cut():
        X = lambda x: 142.7 + x * 34.3; Y = 62 + 6 * 34.3 + 24
        drag(X(2), Y, X(5), Y); drag(X(5), Y, X(8), Y)
    check('cut', 1491, 1, cut)
    def fence():
        P = lambda w: (46 + (10 - w) * 26, 34 + w * 26); c = 2
        for w in [1, 4, 5]: drag(*P(c), *P(w)); c = w
    check('fence', 1492, 1, fence)
    def garden():
        c = 1
        for w in [5, 10, 3]: drag(165, 36 + c * 23, 165, 36 + w * 23); c = w
    check('garden', 1493, 1, garden)
    def carpet():
        c = 0
        for r in [1, 3, 5]: drag(232, 40 + c * 44, 232, 40 + r * 44); c = r
    check('carpet', 1494, 1, carpet)
    def see():
        n = pg.evaluate("document.querySelectorAll('#stage .r4v-pan').length")
        if n < 3: raise Exception(f'only {n} pictures')
        for i in range(n): tapsel('.r4v-pan', i)
    for lid in range(1481, 1495): check(f'see{lid - 1480}', lid, 0, see)
    for nm, lid, k in [('sort1', 1481, 3), ('sort2', 1482, 3), ('sort3', 1483, 3), ('sort7', 1487, 2), ('sort12', 1492, 2)]: check(nm, lid, k, sortall)
    for k, v in res.items(): print(f'{k:8s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
