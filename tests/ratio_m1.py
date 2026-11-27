"""ม.1 บทที่ 7 อัตราส่วน สัดส่วน และร้อยละ (ด่าน 2701–2720) · หน้าสอน v260 (src/grades/m1/m1rd.js) ดูภาพ/ทำให้ดู/ลองทำ ทุกหน้า + ลาก/แตะทุกหน้าลงมือทำจริงจนครบภารกิจ แล้วตรวจว่าปุ่ม "ถัดไป" ปลดล็อก
    python3 tests/ratio_m1.py            เมาส์
    python3 tests/ratio_m1.py --touch    นิ้ว (CDP touch events)
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
    def open_(lid, k):  # k = page number, or a word in the title of a hands-on page ("ลงมือเอง — …") (v260)
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
    # 2701 compare
    def f():
        for b in [6, 8, 12, 2]: drag(390, 300 - 6 * 22 - 6, 390, 300 - b * 22 - 6)
    check('cmp', 2701, 'ลากกองลัง', f)
    def f():
        for i in [5, 5, 6, 7, 8, 0, 1, 2, 3, 4]: tap('.rp-hit', i)
    check('fish', 2702, 'แตะปลา', f)
    def f():
        for r in range(4):
            pg.wait_for_timeout(200); tap('.rp-grp', 1); tap('.rp-grp', 0); pg.wait_for_timeout(1700)
    check('pick', 2703, 'แตะตามลำดับ', f)
    def f():
        for s, w in [(4, 6), (6, 9), (8, 12)]:
            drag(70, 330 - 2 * 25, 70, 330 - s * 25); drag(170, 330 - 3 * 25, 170, 330 - w * 25)
    check('mix', 2704, 'ผสมน้ำหวาน', f)
    def f():
        for i in [2, 0, 4]: tap('.rp-chip', i)
    check('group', 2705, 'แบ่งลูกปัด', f)
    def f():
        U = 17; X0 = 40
        for k1, k2 in [(4, 3), (8, 6)]:
            drag(X0 + 3 * U, 77, X0 + k1 * 3 * U, 77); drag(X0 + 4 * U, 207, X0 + k2 * 4 * U, 207)
    check('chain', 2706, 'รวมสองอัตราส่วน', f)
    def f():
        for _ in range(5): tap('.btn.info.ia'); pg.wait_for_timeout(100)
    check('deal', 2707, 'แจกขนม', f)
    def f():
        for d in [8, 15, 15]:
            drag(50 + 3 * 26, 300, 50 + d * 26, 300); pg.wait_for_timeout(200)
            if pg.evaluate("(() => { const b = document.querySelector('#stage .rp-next'); return b && b.style.visibility === 'visible'; })()"): tap('.rp-next')
    check('balance', 2708, 'ตาชั่งสัดส่วน', f)
    def f():
        tap('.rp-tile', 0); tap('.rp-tile', 3); tap('.rp-tile', 1); tap('.rp-tile', 2)
    check('cross', 2709, 'แตะคู่ทแยง', f)
    def f():
        for n in [3, 6, 10]: drag(60 + 1 * 27, 200, 60 + n * 27, 200)
    check('direct', 2710, 'ซื้อปากกา', f)
    def f():
        for n in [3, 6, 12]: drag(60 + 2 * 24, 200, 60 + n * 24, 200)
    check('inverse', 2712, 'คนกับวัน', f)
    def sortall(lid, k, bins):
        def f():
            for j in range(len(bins)):
                cards = pg.evaluate("[...document.querySelectorAll('#stage .rp-card')].map(c => c.textContent)")
                if not cards: break
                t = cards[0]; tap('.rp-card', 0); tap('.rp-binx', bins[t]) if t in bins else None
        return f
    m13 = {c: b for c, b in pg.evaluate("RP_DI_CARDS.map(c => [c.t, c.bin])")}
    check('sort13', 2713, 'จัดการ์ด', sortall(2713, 0, m13))
    def f():
        for r, c in [(2, 9), (7, 4), (0, 4)]: drag(33, 33, 20 + c * 26 + 13, 20 + r * 26 + 13)
    check('grid', 2714, 'ตาราง 100', f)
    def f():
        for v in [5, 12, 18]: drag(50 + 10 * 26, 120, 50 + v * 26, 120)
    check('conv', 2715, 'จุดเดียว', f)
    def f():
        for q in [10, 25, 75]: drag(40 + 270, 110, 40 + q / 100 * 540, 110)
    check('dnl', 2716, 'เส้นจำนวนคู่', f)
    m17 = {'30% ของ 80 เท่ากับเท่าใด': 0, '12 เป็นกี่เปอร์เซ็นต์ของ 60': 1, '9 เป็น 15% ของจำนวนใด': 2, 'สอบได้ 36 จาก 40 คะแนน คิดเป็นกี่เปอร์เซ็นต์': 1, 'ลดราคา 20% จากราคา 450 บาท ลดกี่บาท': 0, 'มัดจำ 3,000 บาท คิดเป็น 25% ของราคา ราคาเท่าไร': 2}
    check('sort17', 2717, 'จัดการ์ด', sortall(2717, 1, m17))
    def f():
        for q in [125, 80, 150]: drag(70 + 320, 148, 70 + q * 3.2, 148)
    check('change', 2718, 'ราคาเดิม', f)
    def f():
        for s in [360, 270, 450]: drag(80 + 330, 148, 80 + s * 1.1, 148)
    check('profit', 2719, 'ทุน กับ', f)
    m20 = {'แบ่งเงิน 600 บาท ตามอัตราส่วน 1 : 2': 0, 'ไข่ 10 ฟอง 45 บาท 30 ฟองราคาเท่าไร': 1, 'ช่าง 3 คนใช้ 8 วัน ถ้า 6 คนใช้กี่วัน': 2, 'ลดราคา 15% จาก 400 บาท': 3, 'ขับเร็วขึ้นบนทางเดิม ใช้เวลาเท่าไร': 2, 'ทอง : เงิน = 3 : 5 ใช้ทอง 12 กรัม': 0, 'วิ่ง 2 ชม. ได้ 18 กม. 5 ชม. ได้กี่ กม.': 1, 'สอบได้ 45 จาก 60 คะแนน': 3}
    check('sort20', 2720, 'จัดการ์ด', sortall(2720, 0, m20))
    # v260: every "ดูภาพ" (tap all pictures), "ทำให้ดู" (pencil steps to the end) and "ลองทำ" (an item of the game) page
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
    for lid in range(2701, 2721):
        for k in pages(lid, 'ดูภาพ'): check(f'see{lid - 2700}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{lid - 2700}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k); res[f'try{lid - 2700}.{k}'] = 'ok' if pg.evaluate("!!document.querySelector('#stage .prac .qsim')") else 'ERR no practice question'
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
