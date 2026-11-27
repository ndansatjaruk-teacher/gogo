"""ป.4 บทที่ 2 ทะเลทรายบวกลบ (ด่าน 421–433) · หน้าสอน v265 (src/grades/p4/p4bd.js): ทุกหน้าดูภาพ (แตะครบ) ทำให้ดู (ดินสอทำทีละขั้นจนจบ)
ลองทำ (ข้อจากเกม) ปลดล็อกปุ่มถัดไป · ไม่เหลือการ์ดข้อความ/ตัวอย่างตัวหนังสือ · เกมแต่ละด่าน ≥ 8 ข้อ  
    python3 tests/addsub_p4.py [--touch]
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
        # v271: "ดูภาพ" is a board now — step it by hand (Space / tap) until every step is shown and Next opens
        if not pg.evaluate("!!document.querySelector('#stage .d1b')"): raise Exception('no board')
        nb = pg.evaluate("document.querySelectorAll('#stage .d1b-dots i').length")
        if nb < 2: raise Exception('board has fewer than 2 steps')
        for j in range(nb * 2 + 2):
            if pg.evaluate("!!document.querySelector('#stage .d1b.ia')") is False and not pg.evaluate("!!document.querySelector('.btn.primary.waiting')"): break
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
    for lid in range(421, 434):
        if pg.evaluate(f"LESSONS.find(L => L.id === {lid}).teach.some(s => /miCards|dcWalk|s2Explore/.test(String(s.v || '')))"): res[f'old{lid - 420}'] = 'ERR text cards left'
        for k in pages(lid, 'ดูภาพ'): check(f'see{lid - 420}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{lid - 420}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k); res[f'try{lid - 420}.{k}'] = 'ok' if pg.evaluate("!!document.querySelector('#stage .prac .qsim')") else 'ERR no practice question'
        n = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return Math.min(...[0, 1, 2, 3].map(() => gameSet(L).length)); }})()")
        res[f'game{lid - 420}'] = ('ok ' if n >= 8 else 'ERR ') + str(n)
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
