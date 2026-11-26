"""ป.4 บทที่ 1 ทะเลทรายจำนวนนับ (ด่าน 401–409) · หน้าสอน v266 (src/grades/p4/p4nd.js): ทุกหน้าดูภาพ (แตะครบ) ทำให้ดู (ดินสอทำทีละขั้นจนจบ)
ลองทำ (ข้อจากเกม) ปลดล็อกปุ่มถัดไป · ไม่เหลือตัวอย่างตัวหนังสือหรือหน้ากดปุ่มทีละขั้น (ลูกคิดปุ่ม + − นับกระโดด อ่านทีละชุด ปุ่ม ◀ − + ▶) · หน้าลงมือเอง (แตะเลขโดด ลากจุด เลือกของ) ปลดล็อกเมื่อทำครบ · เกมแต่ละด่าน ≥ 6 ข้อ  
    python3 tests/wholenum_p4.py [--touch]
"""
import os, sys, json, pathlib
from playwright.sync_api import sync_playwright
TOUCH = '--touch' in sys.argv
def run():
  with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {})); ctx = br.new_context(viewport={'width': 1180, 'height': 820}, has_touch=TOUCH); pg = ctx.new_page()
    cdp = ctx.new_cdp_session(pg); pg.goto((pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800); pg.evaluate("SET.mute = true; window.say = () => {}; 0")
    locked = lambda: pg.evaluate("!!document.querySelector('.btn.primary.waiting')")
    def open_(lid, k):  # k = page number, or a word in the title of a hands-on page ("ลงมือเอง — …") (v262)
        li = pg.evaluate(f"LESSONS.findIndex(L=>L.id==={lid})")
        if isinstance(k, str): k = pg.evaluate(f"LESSONS[{li}].teach.findIndex(s => (s.t || '').includes('ลงมือเอง') && (s.t || '').includes({k!r}))")
        if k < 0: raise Exception('page not found')
        pg.evaluate(f"startTeach({li},{k})"); pg.wait_for_timeout(600)
    def cpt(x, y, sel='#stage .tg-board svg'):
        return pg.evaluate(f"(() => {{ const s = document.querySelector('{sel}'), m = s.getScreenCTM(), q = s.createSVGPoint(); q.x = {x}; q.y = {y}; const r = q.matrixTransform(m); return [r.x, r.y]; }})()")
    def drag(x0, y0, x1, y1, sel='#stage .tg-board svg'):
        a = cpt(x0, y0, sel); b = cpt(x1, y1, sel)
        if TOUCH:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]})
            for i in range(1, 9): cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a[0] + (b[0] - a[0]) * i / 8, 'y': a[1] + (b[1] - a[1]) * i / 8}]}); pg.wait_for_timeout(20)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else:
            pg.mouse.move(*a); pg.mouse.down(); pg.mouse.move(*b, steps=8); pg.mouse.up()
        pg.wait_for_timeout(120)
    def tap(sel, i=0):
        pg.evaluate(f"document.querySelectorAll('#stage {sel}')[{i}].dispatchEvent(new MouseEvent('click', {{ bubbles: true }}))"); pg.wait_for_timeout(80)
    res = {}
    def check(name, lid, k, fn):
        try: open_(lid, k); l0 = locked(); fn()
        except Exception as e: res[name] = 'ERR ' + str(e)[:80]; return
        pg.wait_for_timeout(400); res[name] = ('ok' if (l0 and not locked()) else f'start_locked={l0} end_locked={locked()}')
    pages = lambda lid, word: pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return L.teach.map((s, i) => (s.t || '').includes('{word}') ? i : -1).filter(i => i >= 0); }})()")
    def see():
        n = pg.evaluate("document.querySelectorAll('#stage .r4v-pan').length")
        if n < 1: raise Exception('no pictures')
        for i in range(n): tap('.r4v-pan', i)
    def show():
        if pg.evaluate("!!document.querySelector('#stage .mgb.demo')"):  # the construction board plays itself step by step, with a note beside each step
            for _ in range(20):
                if not pg.evaluate("!!document.querySelector('#stage .mg-next')"): break
                pg.wait_for_function("!document.querySelector('#stage .mg-next') || !document.querySelector('#stage .mg-next').disabled", timeout=15000)
                if not pg.evaluate("!!document.querySelector('#stage .mg-next')"): break
                tap('.mg-next'); pg.wait_for_timeout(300)
                if not pg.evaluate("(() => { const b = document.querySelector('#stage .mg-bub'); return !!b && b.textContent.length > 3; })()"): raise Exception('no note beside the step')
            pg.wait_for_function("!document.querySelector('#stage .mg-next')", timeout=20000); pg.wait_for_timeout(500); return
        for _ in range(40):
            if not pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): break
            tap('.r4d-nx'); pg.wait_for_timeout(700)
        if pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): raise Exception('steps not finished')
    for lid in range(401, 410):
        if pg.evaluate(f"LESSONS.find(L => L.id === {lid}).teach.some(s => /p4ex|abacusMachine|hopStrip|simReadSplit|simCmpP4|miCards|dcWalk/.test(String(s.v || '')))"): res[f'old{lid - 400}'] = 'ERR text/stepper pages left'
        else: res[f'old{lid - 400}'] = 'ok'
        for k in pages(lid, 'ดูภาพ'): check(f'see{lid - 400}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{lid - 400}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k); res[f'try{lid - 400}.{k}'] = 'ok' if pg.evaluate("!!document.querySelector('#stage .prac .qsim')") else 'ERR no practice question'
        n = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return Math.min(...[0, 1, 2, 3].map(() => gameSet(L).length)); }})()")
        res[f'game{lid - 400}'] = ('ok ' if n >= 6 else 'ERR ') + str(n)
    def tapall():  # 403: tap every digit → the expanded form fills in and the page unlocks
        n = pg.evaluate("document.querySelectorAll('#stage .p4d').length")
        if n < 7: raise Exception('no digits')
        for i in range(n): tap('.p4d', i)
    def rdrag():  # 405–408: drag the dot along the bar · no ◀ − + ▶ stepper, no ขั้นต่อไป button
        if pg.evaluate("!!document.querySelector('#stage .rl-ctrl, #stage .stg-next')"): raise Exception('stepper buttons left')
        r = pg.evaluate("(() => { const b = document.querySelector('#stage .rl-bar').getBoundingClientRect(); return [b.left, b.top + b.height / 2, b.width]; })()")
        a = (r[0] + r[2] * .2, r[1]); b = (r[0] + r[2] * .8, r[1])
        if TOUCH:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]})
            for i in range(1, 9): cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a[0] + (b[0] - a[0]) * i / 8, 'y': a[1]}]}); pg.wait_for_timeout(30)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else: pg.mouse.move(*a); pg.mouse.down(); pg.mouse.move(*b, steps=8); pg.mouse.up()
        pg.wait_for_timeout(300)
        v = pg.evaluate("document.querySelector('#stage .rl-val').textContent")
        if not v: raise Exception('dot did not move')
    check('tap3', 403, 'แตะเลขโดด', tapall)
    for lid in (405, 406, 407, 408):
        try: open_(lid, 'ลากจุด'); rdrag(); res[f'drag{lid - 400}'] = 'ok'
        except Exception as e: res[f'drag{lid - 400}'] = 'ERR ' + str(e)[:80]
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
