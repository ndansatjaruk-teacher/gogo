"""v263 ขีดซ้ำเพื่อลบ (scratch-to-erase แบบ Goodnotes) บนกระดาษทดและช่องเขียนคำตอบ
    python3 tests/scrub_erase.py
ตรวจ: ขีดไปมาทับรอยเขียน → ลบเฉพาะเส้นที่อยู่ใต้รอยขีด · เส้นข้าง ๆ ยังอยู่ · มีสัญญาณระหว่างขีด · ย้อน/ทำซ้ำได้
      ลายมือปกติ (ตัวเลข 2 3 8 คำว่า ม w เส้นซิกแซกช้า ๆ) ไม่ลบอะไร · ขีดไปมาบนที่ว่าง = หมึกธรรมดา · ปิดในตั้งค่าได้ · ความไว ต่ำ/ปกติ/สูง
ต้อง build ก่อน (dist/index.html) · ใช้ CHROME=/path/to/chrome ได้
"""
import os, sys, math, pathlib
from playwright.sync_api import sync_playwright
def run():
  with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {})); pg = br.new_page(viewport={'width': 1180, 'height': 820})
    pg.goto((pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800); pg.evaluate("SET.mute = true; window.say = () => {}; 0")
    pg.evaluate("startTeach(LESSONS.findIndex(L => L.id === 2301), 0); Scratch.toggle(true)"); pg.wait_for_timeout(500)
    res = {}
    # speed: a busy test machine moves the mouse slower than a hand — check the shape rules here with a low speed floor,
    # and the speed rule itself with the slow zig-zag below (load only makes it slower)
    fast_floor = "SCRUB.minSpeed = 0; delete SCRUB_LV.low.minSpeed; delete SCRUB_LV.high.minSpeed; 0"; pg.evaluate(fast_floor)
    def path(pts, slow=0):
        pg.mouse.move(*pts[0]); pg.mouse.down()
        for q in pts[1:]:
            pg.mouse.move(*q)
            if slow: pg.wait_for_timeout(slow)
        pg.mouse.up(); pg.wait_for_timeout(60)
    def word(x, y, w=70):  # a hand-written looking curve + a short bar (two strokes)
        path([(x + w * t, y + 18 * math.sin(t * 6.3)) for t in [i / 24 for i in range(25)]], 4)
        path([(x, y + 34), (x + w, y + 34)], 4)
    def scribble(x0, y0, w, h, legs=8, live=None):
        pts = []
        for i in range(legs + 1):
            pts.append((x0 + (w if i % 2 else 0), y0 + h * i / legs))
        dense = []
        for a, b in zip(pts, pts[1:]):
            for k in range(6): dense.append((a[0] + (b[0] - a[0]) * k / 6, a[1] + (b[1] - a[1]) * k / 6))
        dense.append(pts[-1])
        pg.mouse.move(*dense[0]); pg.mouse.down()
        for q in dense[1:]: pg.mouse.move(*q)
        if live is not None: live.append(pg.evaluate("!!(Scratch.cur && Scratch.cur.__scrub && Scratch.cur.__scrub.length)"))
        pg.mouse.up(); pg.wait_for_timeout(60)
    n = lambda: pg.evaluate("Scratch.strokes.length")
    reset = lambda: pg.evaluate("Scratch.clear(); 0")
    ok = lambda c, msg='': 'ok' if c else 'FAIL ' + msg
    # 1 scratch over a word removes only that word
    reset(); word(300, 300); word(300, 420); a = n(); live = []
    scribble(295, 285, 80, 60, 8, live)
    res['erase-word'] = ok(n() == 2, f'{a} → {n()}')
    res['live-hint'] = ok(live == [True], str(live))
    res['kept-nearby'] = ok(pg.evaluate("Scratch.strokes.every(s => s.pts[0].y > 400)"))
    pg.evaluate("Scratch.undo()"); res['undo'] = ok(n() == 4, str(n()))
    pg.evaluate("Scratch.redo()"); res['redo'] = ok(n() == 2, str(n()))
    pg.evaluate("Scratch.undo(); Scratch.undo()"); res['undo-twice'] = ok(n() == 3, str(n()))
    # 2 normal hand-writing over / next to ink never erases
    def digit(name, x, y, fast=False):
        P = {'2': [(0, 10), (10, 0), (30, 0), (40, 12), (30, 30), (0, 60), (40, 60)], '3': [(0, 5), (30, 0), (38, 15), (15, 30), (38, 45), (30, 60), (0, 55)],
             '8': [(20, 30), (0, 15), (20, 0), (40, 15), (20, 30), (0, 45), (20, 60), (40, 45), (20, 30)], 'm': [(0, 40), (0, 10), (8, 0), (16, 10), (16, 40), (16, 10), (24, 0), (32, 10), (32, 40)],
             'w': [(0, 0), (10, 40), (20, 10), (30, 40), (40, 0)], 'zig': [(0, 0), (60, 15), (0, 30), (60, 45), (0, 60), (60, 75)]}[name]
        dense = []
        for a2, b2 in zip(P, P[1:]):
            for k in range(5): dense.append((x + a2[0] + (b2[0] - a2[0]) * k / 5, y + a2[1] + (b2[1] - a2[1]) * k / 5))
        dense.append((x + P[-1][0], y + P[-1][1])); path(dense, 0 if fast else 75 if name == "zig" else 6)
    for d in ['2', '3', '8', 'm', 'w', 'zig']:
        if d == 'zig': pg.evaluate("SCRUB.minSpeed = .25")  # a slow, careful zig-zag is a drawing, not a scratch
        reset(); word(500, 300); b = n(); digit(d, 505, 290); res[f'hand-{d}'] = ok(n() == b + 1, f'{b} → {n()}')
    pg.evaluate(fast_floor)
    for d in ['2', '3', '8', 'm', 'w']:  # written fast too (speed alone must not decide)
        reset(); word(500, 300); b = n(); digit(d, 505, 290, True); res[f'fast-{d}'] = ok(n() == b + 1, f'{b} → {n()}')
    # 3 scribble on empty paper is just ink
    reset(); scribble(700, 300, 80, 60); res['empty-scribble-stays'] = ok(n() == 1, str(n()))
    # 4 a long line crossed only at one end is kept
    reset(); path([(200, 600), (800, 600)], 3); scribble(190, 580, 50, 40); res['long-line-kept'] = ok(n() == 2, str(n()))
    # 5 switched off in settings
    pg.evaluate("SET.scrubErase = false"); reset(); word(300, 300); scribble(295, 285, 80, 60); res['setting-off'] = ok(n() == 3, str(n())); pg.evaluate("SET.scrubErase = true")
    # 6 sensitivity: a 3-reversal scratch counts only on "สูง"
    for lv, want in [('low', 3), ('normal', 3), ('high', 0)]:
        pg.evaluate(f"SET.scrubLv = '{lv}'"); reset(); word(300, 300); scribble(295, 285, 80, 60, 4); res[f'level-{lv}'] = ok(n() == want, str(n()))
    pg.evaluate("SET.scrubLv = 'normal'")
    # 6b Apple Pencil / stylus (pointerType pen, via CDP)
    cdp = pg.context.new_cdp_session(pg)
    def pen(pts):
        cdp.send('Input.dispatchMouseEvent', {'type': 'mousePressed', 'x': pts[0][0], 'y': pts[0][1], 'button': 'left', 'clickCount': 1, 'pointerType': 'pen'})
        for q in pts[1:]: cdp.send('Input.dispatchMouseEvent', {'type': 'mouseMoved', 'x': q[0], 'y': q[1], 'button': 'left', 'buttons': 1, 'pointerType': 'pen'})
        cdp.send('Input.dispatchMouseEvent', {'type': 'mouseReleased', 'x': pts[-1][0], 'y': pts[-1][1], 'button': 'left', 'clickCount': 1, 'pointerType': 'pen'}); pg.wait_for_timeout(80)
    reset(); word(300, 300); word(300, 420)
    zz = []
    for i in range(8):
        a2, b2 = (295 + (80 if i % 2 else 0), 285 + 60 * i / 8), (295 + (0 if i % 2 else 80), 285 + 60 * (i + 1) / 8)
        zz += [(a2[0] + (b2[0] - a2[0]) * k / 6, a2[1] + (b2[1] - a2[1]) * k / 6) for k in range(6)]
    pen(zz); res['pen-erase'] = ok(n() == 2 and pg.evaluate("Scratch.strokes.every(s => s.pts[0].y > 400)"), str(n()))
    # 7 the answer pad (InkPad): scratch erases there too, undo brings it back, recognition is told
    pg.evaluate("Scratch.toggle(false); Scratch.clear(); window.__pd = (() => { const c = document.createElement('canvas'); Object.assign(c.style, { position: 'fixed', left: '200px', top: '200px', width: '500px', height: '300px', zIndex: 9999, background: '#fff' }); document.body.append(c); window.__calls = 0; return new InkPad(c, { onStroke: () => window.__calls++ }); })(); 0")
    pg.wait_for_timeout(200)
    word(300, 300); word(500, 300); c0 = pg.evaluate("__calls"); scribble(295, 285, 80, 60)
    res['pad-erase'] = ok(pg.evaluate("__pd.strokes.length") == 2 and pg.evaluate("__calls") == c0 + 1, str(pg.evaluate("__pd.strokes.length")))
    pg.evaluate("__pd.undo()"); res['pad-undo'] = ok(pg.evaluate("__pd.strokes.length") == 4)
    for k, v in res.items(): print(f'{k:22s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} checks pass' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
