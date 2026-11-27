"""ม.1 บทที่ 3 เลขยกกำลัง (ด่าน 2301–2314) · หน้าสอน v262 (src/grades/m1/m1ed.js) ดูภาพ/ทำให้ดู/ลองทำ ทุกหน้า + แตะทุกหน้าลงมือทำ (ฉากเดิมของด่าน) จนครบ แล้วตรวจว่าปลดล็อกปุ่มถัดไป และเกมยังมีอย่างน้อย 10 ข้อ
    python3 tests/powers_m1.py            เมาส์
    python3 tests/powers_m1.py --touch    นิ้ว
ต้อง build ก่อน (dist/index.html) · ใช้ CHROME=/path/to/chrome ได้
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
        pg.wait_for_timeout(400); res[name] = ('ok' if (l0 and not locked()) else f'start_locked={l0} end_locked={locked()}') + ' | ' + pg.evaluate("(document.querySelector('#stage .fnote') || {}).textContent || ''")[:70]
    n_ = lambda sel: pg.evaluate(f"document.querySelectorAll('#stage {sel}').length")
    def taps(sel, times):
        def f():
            for _ in range(times):
                if not n_(sel): break
                tap(sel); pg.wait_for_timeout(120)
        return f
    def tapall(sel):
        def f():
            for i in range(n_(sel)): tap(sel, i); pg.wait_for_timeout(120)
        return f
    def tree():
        for _ in range(12):
            if not n_('.e3-chip.comp'): break
            tap('.e3-chip.comp'); pg.wait_for_timeout(120)
    def mul():
        for _ in range(4):
            for i in range(n_('.e3-tile')): tap('.e3-tile', i)
            pg.wait_for_timeout(200)
            if n_('.btn.info.ia'): tap('.btn.info.ia'); pg.wait_for_timeout(200)
    def div():
        for _ in range(4):
            for _ in range(8):
                if not n_('.e3-tile.g1:not(.cut)') or not n_('.e3-tile.g2:not(.cut)'): break
                tap('.e3-tile.g1:not(.cut)')
            pg.wait_for_timeout(200)
            if n_('.btn.info.ia'): tap('.btn.info.ia'); pg.wait_for_timeout(200)
    def find():
        for i in range(n_('.e3-nb')):
            if not locked(): break
            tap('.e3-nb', i); pg.wait_for_timeout(150)
    check('fold', 2301, 'พับกระดาษ', taps('.btn.primary.ia', 6))
    check('part', 2302, 'ฐาน และ', tapall('.e3-pb'))
    check('tree', 2303, 'แยกตัวประกอบ 72', tree)
    check('step', 2304, 'หาค่า 3', taps('.btn.primary.ia', 5))
    check('pair', 2305, 'จับคู่ตัวลบ', tapall('.e3-nb'))
    check('half', 2306, 'คูณด้วย', taps('.btn.primary.ia', 5))
    check('mul', 2307, 'กระจายแล้วนับ', mul)
    check('div', 2308, 'ตัดตัวประกอบ', div)
    check('find', 2311, 'หาค่า x', find)
    check('ten', 2312, 'กำลังของ 10', tapall('.e3-nb'))
    # every "ดูภาพ" (tap all pictures), "ทำให้ดู" (pencil steps to the end) and "ลองทำ" (an item of the game) page
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
        for _ in range(40):
            if not pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): break
            tap('.r4d-nx'); pg.wait_for_timeout(700)
        if pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): raise Exception('steps not finished')
    for lid in range(2301, 2315):
        if pg.evaluate(f"LESSONS.find(L => L.id === {lid}).teach.some(s => /miCards|dcWalk/.test(String(s.v || '')))"): res[f'old{lid - 2300}'] = 'ERR old text cards left'
        for k in pages(lid, 'ดูภาพ'): check(f'see{lid - 2300}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{lid - 2300}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k); res[f'try{lid - 2300}.{k}'] = 'ok' if pg.evaluate("!!document.querySelector('#stage .prac .qsim')") else 'ERR no practice question'
    # the game of every lesson still has at least 10 items after the practice pages
    for lid in range(2301, 2315):
        n = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return Math.min(...[0, 1, 2, 3].map(() => gameSet(L).length)); }})()")
        res[f'game{lid - 2300}'] = ('ok ' if n >= 10 else 'ERR ') + str(n)
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
