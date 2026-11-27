"""ม.1 บทที่ 9 สถิติ (1) (ด่าน 2901–2912 + บอส 2919) · v277 (src/grades/m1/m1t.js เกม/บอส/ชุดวาดแผนภูมิ · m1td.js หน้าสอน)
ดูภาพ = กระดาน (กด Space / แตะจนครบ) · ทำให้ดู (ดินสอจนจบ) · ลองทำ · ลงมือเอง ทำภารกิจจนปุ่มถัดไปเปิด:
แตะแยกการ์ด 2 หน้า · ขีดรอยขีด · วาดแผนภูมิรูปภาพ (รูปครึ่ง) · ลากแท่ง · แตะส่วนของวงกลม · สลับจุดเริ่มแกน · เกมด่านละ ≥ 10 ข้อ · บอส 20 ข้อ
    python3 tests/stats_m1.py [--touch]
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
    for lid in range(2901, 2913):
        n = lid - 2900
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
    def tap(sel, i=0):
        c = pg.evaluate(f"(() => {{ const e = document.querySelectorAll('#stage {sel}')[{i}]; if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }})()")
        if not c: raise Exception('no ' + sel)
        if TOUCH: cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': c[0], 'y': c[1]}]}); cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else: pg.mouse.click(*c)
        pg.wait_for_timeout(70)
    def sort_cards(word):
        def f():
            ok = pg.evaluate("[...document.querySelectorAll('#stage .s5card')].map(c => c.textContent)")
            want = {'ปริมาณ': ['น้ำหนัก', 'อายุ', 'เวลานอน'], 'สถิติ': ['ผลไม้อะไร', 'รถกี่คัน', 'ตื่นนอน']}[word]
            for i, t in enumerate(ok):
                if any(w in t for w in want): tap('.s5card', i)
        return f
    check('sortA', 2901, 'ข้อมูลเชิงปริมาณ', sort_cards('ปริมาณ'))
    check('sortB', 2902, 'คำถามทางสถิติ', sort_cards('สถิติ'))
    def tally():
        n = pg.evaluate("document.querySelectorAll('#stage .t9chip').length")
        for i in range(n): tap('.t9chip', i)
    check('tally', 2904, 'รอยขีด', tally)
    def tap_row(i):
        c = pg.evaluate(f"(() => {{ const e = document.querySelectorAll('#stage [data-row]')[{i}], r = e.getBoundingClientRect(); return [r.right - 12, r.y + r.height / 2]; }})()")
        if TOUCH: cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': c[0], 'y': c[1]}]}); cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else: pg.mouse.click(*c)
        pg.wait_for_timeout(70)
    def picto():
        vals, key = [6, 9, 4, 7], 2
        for i, v in enumerate(vals):
            full = int(v // key); half = (v % key) != 0
            for _ in range(full + (1 if half else 0)): tap_row(i)
            if half:
                j = full; tap(f'[data-ico="{i}"][data-j="{j}"] rect')
    check('picto', 2905, 'แผนภูมิรูปภาพ', picto)
    def bars():
        vals = [12, 6, 16, 8]
        for i, v in enumerate(vals):
            a = pg.evaluate(f"(() => {{ const g = document.querySelector('#stage [data-bar=\"{i}\"]'), r = g.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }})()")
            b = pg.evaluate(f"(() => {{ const svg = document.querySelector('#stage .t9bars svg'), m = svg.getScreenCTM(), A = t9Axes(['ส้ม', 'องุ่น', 'มังคุด', 'ลำไย'], 20, {{ w: 310, h: 176, step: 2, yt: 'จำนวน' }}), q = svg.createSVGPoint(); q.x = A.X({i}); q.y = A.Y({v}); const r = q.matrixTransform(m); return [r.x, r.y]; }})()")
            if TOUCH:
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]})
                for k in range(1, 11): cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a[0], 'y': a[1] + (b[1] - a[1]) * k / 10}]}); pg.wait_for_timeout(15)
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else: pg.mouse.move(*a); pg.mouse.down(); pg.mouse.move(a[0], b[1], steps=10); pg.mouse.up()
            pg.wait_for_timeout(120)
    check('bars', 2906, 'ลากแท่ง', bars)
    def pie():
        n = pg.evaluate("document.querySelectorAll('#stage .t9pie [data-part]').length")
        for i in range(n):
            c = pg.evaluate(rf"(() => {{ const p = document.querySelector('#stage .t9pie [data-part=\"{i}\"]'), b = p.getBBox(), svg = p.ownerSVGElement, m = svg.getScreenCTM(), q = svg.createSVGPoint(), d = p.getAttribute('d') || ''; const mm = d.match(/M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) A[\d.]+ [\d.]+ 0 \d 1 ([\d.]+) ([\d.]+)/); if (mm) {{ const cx = +mm[1], cy = +mm[2], a0 = Math.atan2(+mm[4] - cy, +mm[3] - cx); let a1 = Math.atan2(+mm[6] - cy, +mm[5] - cx); if (a1 < a0) a1 += 2 * Math.PI; const t = (a0 + a1) / 2; q.x = cx + 60 * Math.cos(t); q.y = cy + 60 * Math.sin(t); }} else {{ q.x = b.x + b.width / 2; q.y = b.y + b.height / 2; }} const r = q.matrixTransform(m); return [r.x, r.y]; }})()")
            if TOUCH: cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': c[0], 'y': c[1]}]}); cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else: pg.mouse.click(*c)
            pg.wait_for_timeout(90)
    check('pie', 2909, 'วงกลม', pie)
    def axis(): tap('.s5chip', 1); tap('.s5chip', 0)
    check('axis', 2911, 'แกนตั้ง', axis)
    ex = pg.evaluate("(() => { const B = LESSONS.find(L => L.id === 2919); return { n: B.exam.length, pass: B.pass, rightOk: B.exam.every(q => q.a >= 0 && q.a < q.opts.length), uniq: B.exam.every(q => new Set(q.opts.map(o => typeof o === 'string' ? o : o.html)).size === q.opts.length) }; })()")
    res['boss'] = 'ok' if ex['n'] == 20 and ex['pass'] == 16 and ex['rightOk'] and ex['uniq'] else 'ERR ' + str(ex)
    res['jserr'] = 'ok' if not errs else 'ERR ' + errs[0][:100]
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
