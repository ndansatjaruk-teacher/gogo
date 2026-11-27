"""ม.1 บทที่ 1 จำนวนเต็ม (แม่น้ำจำนวนเต็ม ด่าน 2001–2015) — หน้าสอนเรียงใหม่ v276 (src/grades/m1/m1id.js · ของเดิม m1i.js)
ดูภาพ = กระดาน (กด Space / แตะจนครบ) · ทำให้ดู (ดินสอจนจบ) · ลองทำ (ข้อแบบเดียวกับเกม) · ลงมือเอง (ของเดิม) เปิดได้ไม่มีข้อผิดพลาด
ไม่มีหน้าตัวอย่างแบบตัวหนังสือเหลือ (dcWalk dcStory miTwoWalk miCards miSignTable miSameSim/Try) · เกมด่านละ ≥ 10 ข้อ เรียงง่าย → ยาก
    python3 tests/integers_m1.py [--touch]
"""
import os, sys, json, pathlib
from playwright.sync_api import sync_playwright
TOUCH = '--touch' in sys.argv
def run():
  with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {})); ctx = br.new_context(viewport={'width': 1180, 'height': 820}, has_touch=TOUCH); pg = ctx.new_page()
    cdp = ctx.new_cdp_session(pg); pg.goto((pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800); pg.evaluate("SET.mute = true; window.say = () => {}; window.__D1B_FAST = 0.06; 0")
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
    def see():  # v272: the board waits for the child — step it with Space / tap until every step is shown and Next opens
        if not pg.evaluate("!!document.querySelector('#stage .d1b')"): raise Exception('no board')
        nb = pg.evaluate("document.querySelectorAll('#stage .d1b-dots i').length")
        if nb < 2: raise Exception('board has fewer than 2 steps')
        pg.wait_for_timeout(400)
        if not locked(): raise Exception('Next is open before the board has finished')
        for j in range(nb * 2 + 2):
            if not locked(): break
            if j % 2: pg.evaluate("document.querySelector('#stage .d1b-bd').dispatchEvent(new MouseEvent('click', { bubbles: true }))")
            else: pg.keyboard.press('Space')
            pg.wait_for_timeout(130)
        pg.wait_for_timeout(500)
        if pg.evaluate("document.querySelectorAll('#stage .d1b-dots i.on').length") != nb: raise Exception('not every step was shown')
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
    def tapsvg(x, y, sel):
        a = cpt(x, y, sel)
        if TOUCH:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]}); cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else: pg.mouse.click(*a)
        pg.wait_for_timeout(120)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    for lid in range(2001, 2016):
        n = lid - 2000
        res[f'old{n}'] = 'ERR text pages left' if pg.evaluate(f"LESSONS.find(L => L.id === {lid}).teach.some(s => /dcWalk|dcStory|miTwoWalk|miCards|miSignTable|miSameSim|miSameTry/.test(String(s.v || '')))") else 'ok'
        kinds = pg.evaluate(f"LESSONS.find(L => L.id === {lid}).teach.map(s => (s.t || '').replace(/<[^>]+>/g, '').split(' — ')[0])")
        res[f'order{n}'] = 'ok' if kinds and kinds[0].startswith('ดูภาพ') and kinds[-1].startswith('ลองทำ') else f'ERR {kinds}'
        for k in pages(lid, 'ดูภาพ'): check(f'see{n}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{n}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k); res[f'try{n}.{k}'] = 'ok' if pg.evaluate("!!document.querySelector('#stage .prac .qsim, #stage .prac .ans, #stage .prac .opts')") else 'ERR no practice question'
        for k in pages(lid, 'ลงมือเอง'):
            errs.clear(); open_(lid, k); res[f'hand{n}.{k}'] = 'ok' if not errs and pg.evaluate("document.querySelector('#stage .visual').children.length > 0") else 'ERR ' + (errs[0][:80] if errs else 'empty')
        g = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return Math.min(...[0, 1, 2, 3].map(() => gameSet(L).length)); }})()")
        res[f'game{n}'] = ('ok ' if g >= 10 else 'ERR ') + str(g)
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
