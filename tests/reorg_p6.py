"""ป.6 จัดเรียงหน้าสอนใหม่ทีละบท (v279 ขึ้นไป · src/grades/p6/p6*d.js): ทุกหน้าดูภาพเป็นกระดานครู (กดทีละขั้นจนครบ) ทำให้ดู (ดินสอทีละขั้นจนจบ)
ลองทำ (ข้อแบบเดียวกับเกม) ปลดล็อกปุ่มถัดไป · ไม่เหลือการ์ดรู้จัก ตัวอย่างตัวหนังสือ หรือหน้าปุ่ม + − / กดทีละขั้น · หน้าลงมือเอง (แตะชิป ลากระบาย
แตะเครื่องหมาย) ทำงาน · เกมแต่ละด่าน ≥ 8 ข้อ เรียงง่าย → ยาก (บทที่ 1 ใช้ tests/hcf_p6.py)
    python3 tests/reorg_p6.py --ch 2 [--touch]
    python3 tests/reorg_p6.py --p5 1 [--touch]   (ป.5 บทที่ 1)
"""
import os, sys, pathlib
from playwright.sync_api import sync_playwright
TOUCH = '--touch' in sys.argv
CH = int(sys.argv[sys.argv.index('--ch') + 1]) if '--ch' in sys.argv else 2
if '--p5' in sys.argv: CH = 50 + int(sys.argv[sys.argv.index('--p5') + 1])  # ป.5 บทที่ n (v288 ขึ้นไป · src/grades/p5/p5*d.js)
RANGE = {2: (731, 742), 3: (751, 760), 4: (771, 785), 5: (791, 795), 6: (801, 815), 7: (821, 832), 8: (841, 852), 9: (861, 868), 10: (871, 876), 51: (501, 530), 52: (541, 562), 53: (571, 582)}
OLD = r"lrnBoard|dcWalk|dcStory|picWalk|simSteps|simStory|simFrac2|simImproper|simMixParts|simLine\(|simBar|simFracDec|simLongDiv|simPointShift|simShiftDiv|simFx|simPctOf|simPctGrid|simProfit|simDiscount|simRatioMix|simEqRatio|simRatioBar|simRule3\(|simSeqHop|simFigPat|simDiffs|simSeqMul|simBuild3|simPerim|simAreaRect|simConstruct|simPolyMake|simAngles7|simFan|simPolyPer|simTrap|simDiagQuad|simQuadSplit|simCircParts|simCompass|simRoll|simCircum|simSectors|simCircArea|simRing|simTank|picWalk|fWalk|fracBars|simHalf|simOfSet|simArea\(|simDecGrid|simDecArea|pvChart|gWalk|stepper"
if CH > 50: OLD = OLD.replace(r'simLine\(|', '').replace('simLongDiv|', '')  # ป.5 คงหน้าลากบนเส้นจำนวน simLine
def run():
  with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {})); ctx = br.new_context(viewport={'width': 1180, 'height': 820}, has_touch=TOUCH); pg = ctx.new_page()
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:120]))
    pg.goto((pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800); pg.evaluate("SET.mute = true; window.say = () => {}; window.__D1B_FAST = .1; 0")
    locked = lambda: pg.evaluate("!!document.querySelector('.btn.primary.waiting')")
    def open_(lid, k):
        li = pg.evaluate(f"LESSONS.findIndex(L=>L.id==={lid})")
        if isinstance(k, str): k = pg.evaluate(f"LESSONS[{li}].teach.findIndex(s => (s.t || '').includes('ลงมือเอง') && (s.t || '').replace(/<[^>]+>/g, '').includes({k!r}))")
        if k < 0: raise Exception('page not found')
        pg.evaluate(f"startTeach({li},{k})"); pg.wait_for_timeout(600)
    def tapq(sel, i=0):
        el = pg.locator(f'#stage {sel}').nth(i)
        if TOUCH: el.tap()
        else: el.click()
        pg.wait_for_timeout(150)
    def tapsvg(x, y, sel='#stage .tg-board svg'):
        r = pg.evaluate(f"(() => {{ const s = document.querySelector('{sel}'), m = s.getScreenCTM(), q = s.createSVGPoint(); q.x = {x}; q.y = {y}; const r = q.matrixTransform(m); return [r.x, r.y]; }})()")
        if TOUCH: pg.touchscreen.tap(*r)
        else: pg.mouse.click(*r)
        pg.wait_for_timeout(200)
    res = {}
    def check(name, lid, k, fn):
        try: open_(lid, k); l0 = locked(); fn()
        except Exception as e: res[name] = 'ERR ' + str(e)[:80]; return
        pg.wait_for_timeout(400); res[name] = ('ok' if (l0 and not locked()) else f'start_locked={l0} end_locked={locked()}')
    pages = lambda lid, word: pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return L.teach.map((s, i) => (s.t || '').includes('{word}') ? i : -1).filter(i => i >= 0); }})()")
    def see():
        if not pg.evaluate("!!document.querySelector('#stage .d1b')"): raise Exception('no board')
        nb = pg.evaluate("document.querySelectorAll('#stage .d1b-dots i').length")
        if nb < 2: raise Exception('board has fewer than 2 steps')
        for j in range(nb * 2 + 2):
            if not pg.evaluate("!!document.querySelector('#stage .d1b.ia')"): break
            if j % 2 and TOUCH: pg.locator('#stage .d1b-bd').tap()
            elif j % 2: pg.evaluate("document.querySelector('#stage .d1b-bd').dispatchEvent(new MouseEvent('click', { bubbles: true }))")
            else: pg.keyboard.press('Space')
            pg.wait_for_timeout(160)
        pg.wait_for_timeout(500)
        if pg.evaluate("document.querySelectorAll('#stage .d1b-dots i.on').length") != nb: raise Exception('not every step was shown')
    def show():
        for _ in range(40):
            if not pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): break
            tapq('.r4d-nx'); pg.wait_for_timeout(600)
        if pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): raise Exception('steps not finished')
    lo, hi = RANGE[CH]
    for lid in range(lo, hi + 1):
        n = lid - lo + 1
        bad = pg.evaluate(f"LESSONS.find(L => L.id === {lid}).teach.filter(s => new RegExp({OLD!r}).test(String(s.v || ''))).length")
        res[f'old{n}'] = 'ok' if not bad else f'ERR {bad} old pages left'
        for k in pages(lid, 'ดูภาพ'): check(f'see{n}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{n}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k); res[f'try{n}.{k}'] = 'ok' if pg.evaluate("!!document.querySelector('#stage .prac .qsim')") else 'ERR no practice question'
        g = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return [0, 1, 2, 3].map(() => {{ const s = gameSet(L); return [s.length, s.every((q, i) => !i || qDiff(s[i - 1]) <= qDiff(q))]; }}); }})()")
        m = min(x[0] for x in g)
        res[f'game{n}'] = ('ok ' if m >= 8 and all(x[1] for x in g) else 'ERR ') + str(m)
    def chips(best):  # a wrong chip keeps the page locked, the best one unlocks it
        vals = pg.evaluate("[...document.querySelectorAll('#stage .h6d-chips .h6-chip')].map(b => +b.dataset.v)")
        if best not in vals: raise Exception('no chips')
        tapq('.h6d-chips .h6-chip', vals.index([v for v in vals if v != best][0]))
        if not locked(): raise Exception('unlocked by a wrong chip')
        tapq('.h6d-chips .h6-chip', vals.index(best))
    if CH == 2:
        check('hand1', 731, 'ส่วนเท่ากัน', lambda: chips(12))
        def paint():  # 3 parts a bar: tap the 7th, 8th, then 5th part (7/3, 2 2/3, 5/3)
            for x, y in ((140, 167), (280, 167), (280, 103)): tapsvg(x, y)
        check('hand3', 733, 'ลากระบาย', paint)
        for lid in (737, 738, 739):
            try: open_(lid, {737: 'แตะเครื่องหมาย', 738: 'ไม่มีวงเล็บ', 739: 'วงเล็บซ้อน'}[lid]); res[f'kept{lid - 730}'] = 'ok' if pg.evaluate("document.querySelectorAll('#stage .f6-op').length >= 2") else 'ERR no operators'
            except Exception as e: res[f'kept{lid - 730}'] = 'ERR ' + str(e)[:60]
    if CH == 3:
        check('hand1', 751, 'ตัวคูณ', lambda: chips(25))
        check('hand7', 757, '× หรือ ÷', lambda: chips(710))
        for lid in (754, 755, 756):
            try: open_(lid, 'จุด'); res[f'kept{lid - 750}'] = 'ok' if pg.evaluate("document.querySelectorAll('#stage .dpt-gap').length >= 2") else 'ERR no gaps'
            except Exception as e: res[f'kept{lid - 750}'] = 'ERR ' + str(e)[:60]
        for lid in (758, 759, 760):
            try: open_(lid, 'ประโยคสัญลักษณ์'); res[f'kept{lid - 750}'] = 'ok' if pg.evaluate("document.querySelectorAll('#stage .d6-pick').length >= 2") else 'ERR no choices'
            except Exception as e: res[f'kept{lid - 750}'] = 'ERR ' + str(e)[:60]
    if CH == 4:
        for lid, word, sel in ((772, 'ลองเลือกเอง', '.btn.info'), (776, 'ลองเลือกเอง', '.btn.info'), (773, 'วางแผน', '.d6-pick'), (777, 'วางแผน', '.d6-pick'), (778, 'วางแผน', '.d6-pick'), (779, 'วางแผน', '.d6-pick'), (783, 'แผนผัง', '.p6-pl'), (784, 'มาตราส่วน', '.p6-seg'), (785, 'เส้นทาง', '.p6-seg')):
            try: open_(lid, word); res[f'kept{lid - 770}'] = 'ok' if pg.evaluate(f"document.querySelectorAll('#stage {sel}').length >= 2") else 'ERR nothing to tap'
            except Exception as e: res[f'kept{lid - 770}'] = 'ERR ' + str(e)[:60]
    if CH == 5:
        def three():  # three different figures: still locked after two, unlocked after the third
            tapq('.h6d-chips .h6-chip', 0); tapq('.h6d-chips .h6-chip', 1)
            if not locked(): raise Exception('unlocked too early')
            tapq('.h6d-chips .h6-chip', 3)
        check('hand1', 791, 'รูปที่ n', three)
        check('hand5', 795, 'จำนวนโต๊ะ', three)
        try: open_(794, 'วางแผน'); res['kept4'] = 'ok' if pg.evaluate("document.querySelectorAll('#stage .d6-pick').length >= 2") else 'ERR no choices'
        except Exception as e: res['kept4'] = 'ERR ' + str(e)[:60]
    if CH == 6:
        def side3():  # an impossible side keeps the page locked, a possible one too, both → unlocked
            vals = pg.evaluate("[...document.querySelectorAll('#stage .h6d-chips .h6-chip')].map(b => +b.dataset.v)")
            tapq('.h6d-chips .h6-chip', vals.index(2))
            if not locked(): raise Exception('unlocked too early')
            tapq('.h6d-chips .h6-chip', vals.index(5))
        check('hand7', 807, 'ด้านที่สาม', side3)
        for lid, word, sel in ((801, 'ลาก', '.t6-h'), (804, 'แตะ', '.t6-side'), (805, 'ส่วนสูง', '.t6-side'), (806, 'ฉีก', '.t6-h'), (812, 'ฐาน', '.t6-side'), (813, 'วางแผน', '.d6-pick'), (814, 'วางแผน', '.d6-pick')):
            try: open_(lid, word); res[f'kept{lid - 800}'] = 'ok' if pg.evaluate(f"document.querySelectorAll('#stage {sel}').length >= 2") else 'ERR nothing to drag or tap'
            except Exception as e: res[f'kept{lid - 800}'] = 'ERR ' + str(e)[:60]
    if CH == 7:
        def three():  # three different side counts: still locked after two, unlocked after the third
            tapq('.h6d-chips .h6-chip', 0); tapq('.h6d-chips .h6-chip', 1)
            if not locked(): raise Exception('unlocked too early')
            tapq('.h6d-chips .h6-chip', 3)
        check('hand1', 821, 'จำนวนด้าน', three)
        check('hand3', 823, 'จำนวนด้าน', three)
        for lid, word, sel in ((821, 'รูปไหน', '.k7-card'), (829, '3 วิธี', '.btn'), (830, 'วางแผน', '.d6-pick'), (831, 'วางแผน', '.d6-pick'), (832, 'วางแผน', '.d6-pick')):
            try: open_(lid, word); res[f'kept{lid - 820}'] = 'ok' if pg.evaluate(f"document.querySelectorAll('#stage {sel}').length >= 2") else 'ERR nothing to tap'
            except Exception as e: res[f'kept{lid - 820}'] = 'ERR ' + str(e)[:60]
    if CH == 8:
        def three():  # three different chips: still locked after two, unlocked after the third
            tapq('.h6d-chips .h6-chip', 0); tapq('.h6d-chips .h6-chip', 1)
            if not locked(): raise Exception('unlocked too early')
            tapq('.h6d-chips .h6-chip', 3)
        for lid, word in ((841, 'รัศมี'), (843, 'กางวงเวียน'), (844, 'ขนาดล้อ'), (845, 'รัศมี'), (846, 'จำนวนชิ้น'), (847, 'รัศมี'), (848, 'วงเล็ก')): check(f'hand{lid - 840}', lid, word, three)
        for lid, word, sel in ((842, 'แตะเส้น', '.c8-hit'), (849, 'วางแผน', '.d6-pick'), (850, 'วางแผน', '.d6-pick'), (851, 'วางแผน', '.d6-pick'), (852, 'วางแผน', '.d6-pick')):
            try: open_(lid, word); res[f'kept{lid - 840}'] = 'ok' if pg.evaluate(f"document.querySelectorAll('#stage {sel}').length >= 2") else 'ERR nothing to tap'
            except Exception as e: res[f'kept{lid - 840}'] = 'ERR ' + str(e)[:60]
    if CH == 9:
        def three():  # three different thicknesses: still locked after two, unlocked after the third
            tapq('.h6d-chips .h6-chip', 0); tapq('.h6d-chips .h6-chip', 1)
            if not locked(): raise Exception('unlocked too early')
            tapq('.h6d-chips .h6-chip', 3)
        check('hand6', 866, 'ความหนา', three)
        for lid, word, sel in ((861, 'ปริซึม', '.s9-view'), (862, 'สิ่งของ', '.s9o-card'), (863, 'รูปคลี่ของพีระมิด', '.s9-view'), (864, 'พับ', '.s9-view'), (865, 'แบ่ง', '.s9-view'), (867, 'วางแผน', '.d6-pick'), (868, 'วางแผน', '.d6-pick')):
            try: open_(lid, word); res[f'kept{lid - 860}'] = 'ok' if pg.evaluate(f"document.querySelectorAll('#stage {sel}, #stage .btn.ia').length >= 2") else 'ERR nothing to tap'
            except Exception as e: res[f'kept{lid - 860}'] = 'ERR ' + str(e)[:60]
    if CH == 10:
        for lid, word, sel in ((871, 'ลากจุด', '.pz-h'), (871, 'กะพริบ', '.pz-sec'), (872, 'เปรียบ', '.pz-sec'), (873, 'ทีละส่วน', '.pz-sec'), (874, '12,000', '.pz-sec'), (874, 'วางแผน', '.d6-pick'), (875, 'วางแผน', '.d6-pick'), (876, 'วางแผน', '.d6-pick')):
            try: open_(lid, word); res[f'kept{lid - 870}{sel}'] = 'ok' if pg.evaluate(f"document.querySelectorAll('#stage {sel}').length >= 2") else 'ERR nothing to tap'
            except Exception as e: res[f'kept{lid - 870}{sel}'] = 'ERR ' + str(e)[:60]
    if CH == 51:
        def three():  # three different chips: still locked after two, unlocked after the third
            tapq('.h6d-chips .h6-chip', 0); tapq('.h6d-chips .h6-chip', 1)
            if not locked(): raise Exception('unlocked too early')
            tapq('.h6d-chips .h6-chip', 3)
        for lid, word in ((501, 'เกินครึ่ง'), (511, 'ของ 15'), (514, 'ทับกัน')): check(f'hand{lid - 500}', lid, word, three)
        for lid in (503, 504, 506, 507, 512, 513, 517, 518, 519):
            try: open_(lid, ''); res[f'kept{lid - 500}'] = 'ok' if pg.evaluate("document.querySelectorAll('#stage .ia').length >= 1") else 'ERR nothing to tap'
            except Exception as e: res[f'kept{lid - 500}'] = 'ERR ' + str(e)[:60]
    if CH == 52:
        def three():
            tapq('.h6d-chips .h6-chip', 0); tapq('.h6d-chips .h6-chip', 1)
            if not locked(): raise Exception('unlocked too early')
            tapq('.h6d-chips .h6-chip', 3)
        for lid, word in ((541, 'จำนวนส่วน'), (551, 'ตัวคูณ')): check(f'hand{lid - 540}', lid, word, three)
        for lid in (541, 542, 543, 544, 545, 546, 547, 549, 550, 552, 553, 554, 555, 556, 557, 558, 559):
            try: open_(lid, '' if lid != 541 else 'คูณทั้ง'); res[f'kept{lid - 540}'] = 'ok' if pg.evaluate("document.querySelectorAll('#stage .ia').length >= 1") else 'ERR nothing to tap'
            except Exception as e: res[f'kept{lid - 540}'] = 'ERR ' + str(e)[:60]
    if CH == 53:
        for lid in range(571, 583):
            try: open_(lid, ''); res[f'kept{lid - 570}'] = 'ok' if pg.evaluate("document.querySelectorAll('#stage .ia, #stage .gbar, #stage .gpt').length >= 1") else 'ERR nothing to tap'
            except Exception as e: res[f'kept{lid - 570}'] = 'ERR ' + str(e)[:60]
    res['jserr'] = 'ok' if not errs else 'ERR ' + errs[0]
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
