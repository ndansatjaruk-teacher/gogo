"""ม.1 บทที่ 5 รูปเรขาคณิตสองมิติและสามมิติ (ด่าน 2501–2516 + บอส 2519) · v275 (src/grades/m1/m1s.js เกม/เครื่องยนต์ 3 มิติ · m1sd.js หน้าสอน)
ดูภาพ = กระดาน (กด Space / แตะจนครบ) · ทำให้ดู (ดินสอจนจบ) · ลองทำ · ลงมือเอง ทำภารกิจจนครบแล้วปุ่มถัดไปเปิด:
แตะรูปที่มีด้านโค้ง · หมุนรูปทรง 3 รูป · แตะนับจุดยอด/สัน/หน้า (ต้องหมุนไปดูด้านหลัง) · มองสามทิศ · พับภาพคลี่ 3 แบบ · ต่อบล็อกตามภารกิจ · ตัดด้วยระนาบ (ลากจุดม่วง) · หาหน้าตรงข้าม
เกมด่านละ ≥ 10 ข้อ · ตัวเลือกไม่ซ้ำ · ข้อแตะนับ (Q.s5Tap) ตอบครบจึงถูก · พับภาพคลี่ปิดสนิท · บอส 20 ข้อ
    python3 tests/solids_m1.py [--touch]
"""
import os, sys, json, pathlib, math
from playwright.sync_api import sync_playwright
TOUCH = '--touch' in sys.argv
def run():
  with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {})); ctx = br.new_context(viewport={'width': 1180, 'height': 820}, has_touch=TOUCH); pg = ctx.new_page()
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    cdp = ctx.new_cdp_session(pg); pg.goto((pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800); pg.evaluate("SET.mute = true; window.say = () => {}; window.__D1B_FAST = 0.06; 0")
    locked = lambda: pg.evaluate("!!document.querySelector('.btn.primary.waiting')")
    def open_(lid, k):
        li = pg.evaluate(f"LESSONS.findIndex(L=>L.id==={lid})")
        if isinstance(k, str): k = pg.evaluate(f"LESSONS[{li}].teach.findIndex(s => (s.t || '').includes('ลงมือเอง') && (s.t || '').includes({k!r}))")
        if k < 0: raise Exception('page not found')
        pg.evaluate(f"startTeach({li},{k})"); pg.wait_for_timeout(700)
    def tap_at(x, y):
        if TOUCH:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]}); cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else: pg.mouse.click(x, y)
        pg.wait_for_timeout(90)
    def drag(a, b, n=10):
        if TOUCH:
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]})
            for i in range(1, n + 1): cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a[0] + (b[0] - a[0]) * i / n, 'y': a[1] + (b[1] - a[1]) * i / n}]}); pg.wait_for_timeout(16)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        else: pg.mouse.move(*a); pg.mouse.down(); pg.mouse.move(*b, steps=n); pg.mouse.up()
        pg.wait_for_timeout(120)
    def center(sel):
        return pg.evaluate(f"(() => {{ const e = document.querySelector('#stage {sel}'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }})()")
    def click(sel, i=0):
        c = pg.evaluate(f"(() => {{ const e = document.querySelectorAll('#stage {sel}')[{i}]; if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }})()")
        if not c: raise Exception('no ' + sel)
        tap_at(*c)
    res = {}
    def check(name, lid, k, fn):
        try: open_(lid, k); l0 = locked(); fn()
        except Exception as e: res[name] = 'ERR ' + str(e)[:90]; return
        pg.wait_for_timeout(500); res[name] = 'ok' if (l0 and not locked()) else f'start_locked={l0} end_locked={locked()}'
    pages = lambda lid, word: pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return L.teach.map((s, i) => (s.t || '').includes('{word}') ? i : -1).filter(i => i >= 0); }})()")
    def see():
        nb = pg.evaluate("document.querySelectorAll('#stage .d1b-dots i').length")
        if nb < 2: raise Exception('board has fewer than 2 steps')
        pg.wait_for_timeout(300)
        if not locked(): raise Exception('Next is open before the board has finished')
        for j in range(nb * 2 + 2):
            if not locked(): break
            if j % 2: pg.evaluate("document.querySelector('#stage .d1b-bd').dispatchEvent(new MouseEvent('click', { bubbles: true }))")
            else: pg.keyboard.press('Space')
            pg.wait_for_timeout(140)
    def show():
        for _ in range(40):
            if not pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): break
            pg.evaluate("document.querySelector('#stage .r4d-nx').click()"); pg.wait_for_timeout(700)
        if pg.evaluate("!!document.querySelector('#stage .r4d-nx')"): raise Exception('steps not finished')
    for lid in ([] if '--hands' in sys.argv else range(2501, 2517)):
        n = lid - 2500
        for k in pages(lid, 'ดูภาพ'): check(f'see{n}.{k}', lid, k, see)
        for k in pages(lid, 'ทำให้ดู'): check(f'show{n}.{k}', lid, k, show)
        for k in pages(lid, 'ลองทำ'):
            open_(lid, k); res[f'try{n}.{k}'] = 'ok' if pg.evaluate("!!document.querySelector('#stage .prac .qsim, #stage .prac .ans, #stage .prac .opts')") else 'ERR no practice question'
        g = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {lid}); return Math.min(...[0, 1, 2, 3].map(() => gameSet(L).length)); }})()")
        res[f'game{n}'] = ('ok ' if g >= 10 else 'ERR ') + str(g)
        bad = pg.evaluate(rf"""(() => {{ const L = LESSONS.find(L => L.id === {lid}), out = []; for (let t = 0; t < 6; t++) L.game().forEach(q => {{ const d = document.createElement('div'); q.mount(d, {{ check() {{}} }});
          const a = d.querySelector('.mi-ans'); if (a) {{ const txt = a.ansText; if (!/^−?[\d,]+(\.\d+)?$|^−?\d+\/\d+$/.test(txt)) out.push(q.__sig + ' key ' + txt); }}
          const o = d.querySelectorAll('.opt'); if (o.length) {{ const tx = [...o].map(x => x.textContent.trim()); if (new Set(tx).size !== tx.length) out.push(q.__sig + ' same options'); if (o.length < 2) out.push(q.__sig + ' one option'); }}
          d.querySelectorAll('.k1pk svg').forEach(s => {{ if (!s.innerHTML.trim()) out.push(q.__sig + ' empty picture'); }}); }}); return [...new Set(out)]; }})()""")
        res[f'keys{n}'] = 'ok' if not bad else 'ERR ' + '; '.join(bad)[:140]
    # picture options must differ (same-looking svgs would be unfair)
    same = pg.evaluate("""(() => { const out = []; LESSONS.filter(L => L.id > 2500 && L.id < 2520 && L.game).forEach(L => { for (let t = 0; t < 8; t++) L.game().forEach(q => { if (!/^k1k/.test(q.__sig || '')) return; const d = document.createElement('div'); q.mount(d, { check() {} }); const s = [...d.querySelectorAll('.k1pk svg')].map(x => x.innerHTML); if (new Set(s).size !== s.length) out.push(q.__sig); }); }); return [...new Set(out)]; })()""")
    res['pics'] = 'ok' if not same else 'ERR same pictures: ' + ', '.join(same)[:120]
    # nets close up: every cube net folds into 8 corners, prisms / pyramids into the right number
    fold = pg.evaluate("""(() => { const U = P => { const u = []; P.forEach(p => { if (!u.some(q => s5Len(s5Sub(p, q)) < 1e-6)) u.push(p); }); return u.length; };
      return [S5_CUBE_NETS.every(c => U(s5Fold(s5NetGrid(c), 1).flat()) === 8 && s5Opp(c)), S5_NOT_NETS.every(c => !s5Opp(c)), [3, 4, 5, 6].every(n => U(s5Fold(s5NetPrism(n), 1).flat()) === 2 * n && U(s5Fold(s5NetPyr(n), 1).flat()) === n + 1), U(s5Fold(s5NetCuboid(), 1).flat()) === 8]; })()""")
    res['fold'] = 'ok' if all(fold) else f'ERR {fold}'
    # hands-on pages
    def tapset():
        cards = pg.evaluate("[...document.querySelectorAll('#stage .s5card')].map(c => !c.innerHTML.includes('<polygon'))")
        for i, ok in enumerate(cards):
            if ok: click('.s5card', i)
    check('hand1', 2501, 'แตะรูป', tapset)
    def spin():
        for i in range(3):
            click('.s5chip', i); c = center('.s5v'); drag([c[0] - 120, c[1]], [c[0] + 140, c[1]], 12); drag([c[0] + 120, c[1]], [c[0] - 140, c[1]], 12)
    check('hand3', 2503, 'หมุนดู', spin)
    rot = [0]
    def count():
        for _ in range(80):
            if not locked(): return
            if not pg.evaluate("!!document.querySelector('#stage .s5v')"): pg.wait_for_timeout(300); continue
            kind = pg.evaluate("(() => { const e = document.querySelector('#stage .s5v [data-v], #stage .s5v [data-e], #stage .s5v [data-f]'); return e ? (e.dataset.v != null ? 'v' : e.dataset.e != null ? 'e' : 'f') : null; })()")
            if not kind: pg.wait_for_timeout(300); continue
            pts = pg.evaluate(f"""(() => {{ const V = document.querySelector('#stage .s5v'), m = V.mark['{kind}'], out = []; V.querySelectorAll('[data-{kind}]').forEach(e => {{ const id = +e.dataset['{kind}']; if (m.has(id)) return;
              let x, y; if (e.tagName === 'line') {{ const s = e.ownerSVGElement, M = s.getScreenCTM(), q = s.createSVGPoint(); q.x = (+e.getAttribute('x1') + +e.getAttribute('x2')) / 2; q.y = (+e.getAttribute('y1') + +e.getAttribute('y2')) / 2; const r = q.matrixTransform(M); x = r.x; y = r.y; }}
              else if (e.tagName === 'polygon') {{ const s = e.ownerSVGElement, M = s.getScreenCTM(), P = e.getAttribute('points').split(' ').map(t => t.split(',').map(Number)), q = s.createSVGPoint(); q.x = P.reduce((a, p) => a + p[0], 0) / P.length; q.y = P.reduce((a, p) => a + p[1], 0) / P.length; const r = q.matrixTransform(M); x = r.x; y = r.y; }}
              else {{ const r = e.getBoundingClientRect(); x = r.x + r.width / 2; y = r.y + r.height / 2; }} out.push([x, y]); }}); return out; }})()""")
            if os.environ.get('DBG'): print(kind, len(pts), pg.evaluate("document.querySelector('#stage .s5cnt').textContent"), flush=True)
            for x, y in pts: tap_at(x, y)
            if not pts:
                rot[0] += 1; c = center('.s5v')
                if not c: pg.wait_for_timeout(300); continue
                dy = 70 if rot[0] % 3 == 1 else -110; drag([c[0] - 90, c[1] - dy / 2], [c[0] + 50, c[1] + dy / 2], 10)
            pg.wait_for_timeout(150)
        raise Exception('missions not finished')
    check('hand4', 2504, 'แตะนับ', count)
    def views():
        for i in range(3): click('.s5chip', i); pg.wait_for_timeout(900)
    check('hand6', 2506, 'มองจาก', views)
    def fold_():
        for i in (0, 2, 4):
            click('.s5chip', i); pg.wait_for_timeout(200); click('.s5go', 0); pg.wait_for_timeout(2000)
        c = center('.s5v'); drag([c[0] - 80, c[1]], [c[0] + 80, c[1] + 20])
    check('hand7', 2507, 'พับภาพคลี่', fold_)
    def build8():
        cells = lambda: pg.evaluate("document.querySelectorAll('#stage .s5cell').length")
        for _ in range(3): click('.s5cell', 0)
        for _ in range(2): click('.s5cell', 1)
        pg.wait_for_timeout(300)
        for i in (0, 1, 3, 4):
            for _ in range(2): click('.s5cell', i)
    check('hand8', 2508, 'ต่อบล็อก', build8)
    def cut():
        sol = lambda i: click('.s5chips:not(.s5dir) .s5chip', i); dr = lambda i: click('.s5dir .s5chip', i)
        sol(1); pg.wait_for_timeout(200)                     # cylinder, parallel → circle
        sol(0); pg.wait_for_timeout(200)                     # cuboid → rectangle
        dr(1); sol(2); pg.wait_for_timeout(200)              # cone, through the apex → triangle
        dr(2); pg.wait_for_timeout(200)                      # cone, slanted → ellipse
        g = center('.s5grip'); d0 = pg.evaluate("document.querySelector('#stage .s5vpic').textContent")
        drag(g, [g[0], g[1] + 60]); d1 = pg.evaluate("document.querySelector('#stage .s5vpic').textContent")
        if not g: raise Exception('no handle')
    check('hand9', 2509, 'ตัดรูปทรง', cut)
    def opp():
        for _ in range(3):
            info = pg.evaluate("""(() => { const t = document.querySelector('#stage .s5tip').textContent.match(/หน้า ([A-F])/); return t ? t[1] : null; })()""")
            nets = pg.evaluate("[S5_CUBE_NETS[0], S5_CUBE_NETS[6], S5_CUBE_NETS[10]].map(c => s5Opp(c))")
            step = pg.evaluate("[...document.querySelectorAll('#stage .s5mis span')].findIndex(s => s.className === 'now')")
            if step < 0: return
            a = 'ABCDEF'.index(info); want = 'ABCDEF'[nets[step][a]]
            xy = pg.evaluate(f"""(() => {{ const t = [...document.querySelectorAll('#stage .s5netw text')].find(t => t.textContent === '{want}'); const r = t.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }})()""")
            tap_at(*xy); pg.wait_for_timeout(3400)
    check('hand13', 2513, 'ตรงข้าม', opp)
    def build16():
        tgt = [[0, 2, 1], [1, 3, 1], [1, 1, 0]]
        for r in range(3):
            for c in range(3):
                for _ in range(tgt[r][c]): click('.s5cell', r * 3 + c)
    check('hand16', 2516, 'ตามแบบ', build16)
    # the tap-to-count game question: wrong count refused, full reveal accepted
    r = pg.evaluate("""(() => { const q = Q.s5Tap({ q: 't', k: 'cube', what: 'v', sig: 'tapv x', diff: 1 }), d = document.createElement('div'); document.body.append(d); const got = []; q.mount(d, { check(ok) { got.push(ok); } });
      d.querySelector('.s5chk').click(); d.querySelector('.s5ans').reveal(); const n = d.querySelector('.s5v').mark.v.size; d.remove(); return [got.length, n]; })()""")
    res['s5tap'] = 'ok' if r == [0, 8] else f'ERR {r}'
    ex = pg.evaluate("(() => { const B = LESSONS.find(L => L.id === 2519); return { n: B.exam.length, pass: B.pass, rightOk: B.exam.every(q => q.a >= 0 && q.a < q.opts.length), uniq: B.exam.every(q => new Set(q.opts.map(o => typeof o === 'string' ? o : o.html)).size === q.opts.length) }; })()")
    res['boss'] = 'ok' if ex['n'] == 20 and ex['pass'] == 16 and ex['rightOk'] and ex['uniq'] else 'ERR ' + str(ex)
    res['jserr'] = 'ok' if not errs else 'ERR ' + errs[0][:120]
    for k, v in res.items(): print(f'{k:9s} {v}')
    bad = [k for k, v in res.items() if not v.startswith('ok')]
    print(f'{len(res) - len(bad)} / {len(res)} pages work as intended' + (' ✓' if not bad else f' ✗ {bad}')); sys.exit(1 if bad else 0)
run()
