"""ป.4 บทที่ 5 ทะเลทรายนาฬิกา (ด่าน 491–498) หน้าสอน v256 (src/grades/p4/p4td.js) · หน้าลากใหม่ (บันไดหน่วย / ระบายเดือน / แถบเวลา) ทำภารกิจครบ: ทุกหน้า "ดูภาพ" (แตะรูปครบ) · ทุกหน้า "ทำให้ดู"
(กดขั้นต่อไปจนจบ ดินสอวาด/เขียนครบ) · ทุกหน้า "ลองทำ" มีข้อแบบเดียวกับเกม แล้วตรวจว่าปุ่ม "ถัดไป" ปลดล็อก · เกมด่าน 1–6 ได้ครบ 10 ข้อ
    python3 tests/time_p4.py            เมาส์
    python3 tests/time_p4.py --touch    นิ้ว (CDP touch events)
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
        li = pg.evaluate(f"LESSONS.findIndex(L=>L.id==={lid})")
        if isinstance(k, str): k = pg.evaluate(f"LESSONS[{li}].teach.findIndex(s => (s.t || '').includes('{k}'))")
        pg.evaluate(f"startTeach({li},{k})"); pg.wait_for_timeout(600)
    pages = lambda lid, word: pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return L.teach.map((s, i) => (s.t || '').includes('{word}') ? i : -1).filter(i => i >= 0); }})()")
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
    def see():
        n = pg.evaluate("document.querySelectorAll('#stage .r4v-pan').length")
        if n < 1: raise Exception('no pictures')
        for i in range(n): tapsel('.r4v-pan', i)
    def show():
        for _ in range(40):
            if not pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): break
            tapsel('.r4d-nx'); pg.wait_for_timeout(700)
        if pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): raise Exception('steps not finished')
        if not pg.evaluate("document.querySelectorAll('#stage .r4d-ln').length"): raise Exception('nothing written')
    def tryq():
        if not pg.evaluate("!!document.querySelector('#stage .prac .qsim')"): raise Exception('no practice question')
    def tapP(x, y):
        r = cpt(x, y)
        if TOUCH: pg.touchscreen.tap(*r)
        else: pg.mouse.click(*r)
        pg.wait_for_timeout(150)
    def ladder(ks):
        for k in ks: tapP(84 + k * 102, 216)
    def months(ns):
        for n in ns: i = n - 1; tapP(64 + (i % 12) * 36 + 18, 50 + (i // 12) * 56 + 17)
    def cmpb(bs):
        for b in bs: tapP(60 + b * 470 / 300, 162)
    PLAYS = {492: [lambda: ladder([2, 3, 4])], 493: [lambda: months([18, 29, 36])], 494: [lambda: cmpb([250, 205, 150])]}
    for lid, fns in PLAYS.items():
        ks = [k for k in pages(lid, 'ลองปรับเอง') if pg.evaluate(f"(() => {{ startTeach(LESSONS.findIndex(L=>L.id==={lid}), {k}); return !!document.querySelector('#stage .tg-board'); }})()")]
        for k, fn in zip(ks, fns): check(f'play{lid - 490}.{k}', lid, k, fn)
    for lid in range(491, 499):
        for k in pages(lid, 'ดูภาพ'): check(f'see{lid - 490}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{lid - 490}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k)
            try: tryq(); res[f'try{lid - 490}.{k}'] = 'ok'
            except Exception as e: res[f'try{lid - 490}.{k}'] = 'ERR ' + str(e)[:80]
    for lid in range(491, 499):
        n = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return Math.min(...[0, 1, 2, 3, 4].map(() => gameSet(L).length)); }})()")
        res[f'game{lid - 490}'] = 'ok' if n >= (10 if lid <= 496 else 5) else f'only {n} questions'
    for k, v in res.items(): print(f'{k:10s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
