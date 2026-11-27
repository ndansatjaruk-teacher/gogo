"""ป.6 บทที่ 1 ห.ร.ม. และ ค.ร.น. (ด่าน 701–714) · หน้าสอน v278 (src/grades/p6/p6hd.js): ทุกหน้าดูภาพเป็นกระดานครู (กดทีละขั้นจนครบ)
ทำให้ดู (ดินสอทำทีละขั้นจนจบ) ลองทำ (ข้อแบบเดียวกับเกม) ปลดล็อกปุ่มถัดไป · ไม่เหลือการ์ดรู้จัก ตัวอย่างตัวหนังสือ หรือหน้ากดปุ่มทีละขั้น/ปุ่ม + −
(lrnBoard dcWalk dcStory picWalk simSieve simShortDiv( simVenn simAlign simHops simRel simRect simCut simTiles stepper) · หน้าลงมือเอง
แบบแตะชิป (18 จุด ริบบิ้น กระเบื้อง) ปลดล็อกเมื่อเจอคำตอบที่ดีที่สุด · เกมแต่ละด่าน ≥ 8 ข้อ เรียงง่าย → ยาก
    python3 tests/hcf_p6.py [--touch]
"""
import os, sys, pathlib
from playwright.sync_api import sync_playwright
TOUCH = '--touch' in sys.argv
def run():
  with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {})); ctx = br.new_context(viewport={'width': 1180, 'height': 820}, has_touch=TOUCH); pg = ctx.new_page()
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:120]))
    pg.goto((pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800); pg.evaluate("SET.mute = true; window.say = () => {}; window.__D1B_FAST = .1; 0")
    locked = lambda: pg.evaluate("!!document.querySelector('.btn.primary.waiting')")
    def open_(lid, k):
        li = pg.evaluate(f"LESSONS.findIndex(L=>L.id==={lid})")
        if isinstance(k, str): k = pg.evaluate(f"LESSONS[{li}].teach.findIndex(s => (s.t || '').includes('ลงมือเอง') && (s.t || '').includes({k!r}))")
        if k < 0: raise Exception('page not found')
        pg.evaluate(f"startTeach({li},{k})"); pg.wait_for_timeout(600)
    def tapq(sel, i=0):
        el = pg.locator(f'#stage {sel}').nth(i)
        if TOUCH: el.tap()
        else: el.click()
        pg.wait_for_timeout(150)
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
    OLD = r"lrnBoard|dcWalk|dcStory|picWalk|simSieve|simShortDiv\(|simVenn|simAlign|simHops|simRel|simRect|simCut|simTiles|stepper"
    for lid in range(701, 715):
        n = lid - 700
        bad = pg.evaluate(f"LESSONS.find(L => L.id === {lid}).teach.filter(s => new RegExp({OLD!r}).test(String(s.v || ''))).length")
        res[f'old{n}'] = 'ok' if not bad else f'ERR {bad} old pages left'
        for k in pages(lid, 'ดูภาพ'): check(f'see{n}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{n}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k); res[f'try{n}.{k}'] = 'ok' if pg.evaluate("!!document.querySelector('#stage .prac .qsim')") else 'ERR no practice question'
        g = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return [0, 1, 2, 3].map(() => {{ const s = gameSet(L); return [s.length, s.every((q, i) => !i || qDiff(s[i - 1]) <= qDiff(q))]; }}); }})()")
        m = min(x[0] for x in g)
        res[f'game{n}'] = ('ok ' if m >= 8 and all(x[1] for x in g) else 'ERR ') + str(m)
    def chips(best):  # tap a wrong chip (stays locked), then the best one (unlocks)
        vals = pg.evaluate("[...document.querySelectorAll('#stage .h6d-chips .h6-chip')].map(b => +b.dataset.v)")
        if best not in vals: raise Exception('no chips')
        wrong = [v for v in vals if v != best][0]
        tapq('.h6d-chips .h6-chip', vals.index(wrong))
        if not locked(): raise Exception('unlocked by a wrong chip')
        tapq('.h6d-chips .h6-chip', vals.index(best))
    def chips18():
        vals = pg.evaluate("[...document.querySelectorAll('#stage .h6d-chips .h6-chip')].map(b => +b.dataset.v)")
        for v in (4, 2):  # 4 is not a factor · 2 gives 2 and 9 — not every factor yet
            tapq('.h6d-chips .h6-chip', vals.index(v))
        if not locked(): raise Exception('unlocked before every factor was found')
        tapq('.h6d-chips .h6-chip', vals.index(3))  # 3 gives 3 and 6 → 1, 2, 3, 6, 9, 18 found
    check('hand1', 701, '18 จุด', chips18)
    check('hand11', 711, 'ริบบิ้น', lambda: chips(4))
    check('hand14', 714, 'กระเบื้อง', lambda: chips(12))
    for lid, word in ((703, 'แผนภาพต้นไม้'), (706, 'จำนวนเฉพาะ'), (709, 'จำนวนเฉพาะ'), (713, 'เลือกเครื่องมือ')):
        try: open_(lid, word); res[f'kept{lid - 700}'] = 'ok' if pg.evaluate("document.querySelector('#stage .vis, #stage .visual, #stage') && document.querySelectorAll('#stage button').length > 2") else 'ERR empty'
        except Exception as e: res[f'kept{lid - 700}'] = 'ERR ' + str(e)[:60]
    res['jserr'] = 'ok' if not errs else 'ERR ' + errs[0]
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
