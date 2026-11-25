#!/usr/bin/env python3
"""ม.1 ลำน้ำเรขา: "เด็กจำลอง" ใช้นิ้วสร้างตามเฉลยของทุกงาน mgT.* บนกระดานจริง (src/grades/m1/geo/)

ทำแบบเด็ก: ลากเข็มวงเวียนไปวาง (มือคลาดได้) · ลากขาดินสอกางรัศมี (ลอกความยาวโดยลากไปที่จุด) · แตะบนวงเส้นประแล้วลากไปตามวง
· ย้าย/หมุนไม้บรรทัดคลาดเล็กน้อยแล้วลากเส้น (ลากเลยจุดได้) · ย้าย/หมุนครึ่งวงกลม แตะสเกลทำเครื่องหมาย · แตะจุด
แล้วดูว่ากระดานรับว่าสร้างเสร็จ (goal) หรือไม่

  python3 tests/geo_m1.py                    ทุกงาน 2 รอบ มือสั่นปกติ
  python3 tests/geo_m1.py --n 4 --noise 1.5  มือสั่นมากขึ้น
  python3 tests/geo_m1.py --tasks "mgT.bisAng(76);mgT.perpAt()"
  DBG=1 TR=0 python3 tests/geo_m1.py --tasks "mgT.bisAng(76)"   พิมพ์สถานะทีละขั้น (รอบที่ 0)
CHROME=/path/to/chrome ใช้เบราว์เซอร์นั้น · ต้อง build ก่อน (python3 tools/build.py)
"""
import argparse, json, math, os, pathlib, random, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
TASKS = ("mgT.copySeg(4.7);mgT.sumSeg(3.3,2.4);mgT.bisSeg(6.6);mgT.copyAng(55);mgT.bisAng(88);mgT.bisAng(50);mgT.perpAt();mgT.perpFrom();"
         "mgT.angle(60);mgT.angle(90);mgT.angle(120);mgT.angle(45);mgT.angle(135);mgT.angle(150);mgT.angle(30);mgT.protAng(80);"
         "mgT.parallel();mgT.tri('sss',{c:7,b:5,a:4});mgT.tri('asa',{c:6,A:50,B:60});mgT.tri('sas',{c:6,b:4,A:50});mgT.segLen(5.5);"
         "mgT.diffSeg(5.6);mgT.kSeg(2.4,3);mgT.quartSeg(9.6);mgT.circ(3.5);mgT.meet(4,3,5);mgT.sumAng(45,30);mgT.parPerp();mgT.altitude();mgT.hexagon(3)")
ap = argparse.ArgumentParser(); ap.add_argument('--tasks', default=TASKS); ap.add_argument('--n', type=int, default=2); ap.add_argument('--noise', type=float, default=1.0)
ap.add_argument('--touch', action='store_true', help='drive with finger (touch) events instead of the mouse')
ap.add_argument('--legacy', action='store_true', help='Safari-like legacy CSS zoom: board zoomed .85 and the hit-test CTM path forced')
A = ap.parse_args(); A_ZOOM = '.85' if A.legacy else '1'; tasks = A.tasks.split(';'); N = A.n; noise = A.noise; DBG = os.environ.get('DBG'); TR = os.environ.get('TR')
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'] + (['--disable-blink-features=StandardizedBrowserZoom'] if A.legacy else [])); ctx = b.new_context(viewport={'width': 1180, 'height': 820}, has_touch=A.touch); pg = ctx.new_page()
    if A.legacy: pg.add_init_script('window.ZF_FORCE_HIT = true')
    cdp = ctx.new_cdp_session(pg) if A.touch else None
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((ROOT / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800)
    pg.evaluate("SET.mute = true; window.say = () => {}; 0")
    pg.add_script_tag(content="""
      window.__w = () => document.querySelector('#kidbox .mgb');
      window.__scr = p => { const w = __w(), t = w._t, svg = w.querySelector('.cns-svg'), q = t.X(p), m = svg.getScreenCTM(); return [q[0] * m.a + m.e, q[1] * m.d + m.f]; };""")
    tot = {}
    for task in tasks:
        ok = 0
        for trial in range(N):
            if TR and str(trial) != TR: continue
            rnd = random.Random(trial * 7 + 1)
            ops = pg.evaluate(f"(() => {{ const T = {task}; window.__T = T; document.getElementById('kidbox')?.remove(); const box = h('div', {{ id: 'kidbox', class: 'stage-card', style: {{ position: 'fixed', left: '20px', top: '20px', width: '1120px', height: '700px', zIndex: 999, zoom: '{A_ZOOM}', background: '#fff', display: 'flex', containerType: 'size' }} }}); document.body.append(box); const w = mgBoard(T, {{ onOK: () => {{}} }}); box.append(w); return T.sol.flatMap(s => s.ops || []); }})()")
            pg.wait_for_timeout(300)
            s0 = pg.evaluate("__scr([0,0])"); s1 = pg.evaluate("__scr([1,0])"); PX = s1[0] - s0[0]
            def scr(pt): return pg.evaluate(f"__scr({json.dumps(pt)})")
            def jit(px): return [rnd.uniform(-px, px) * noise, rnd.uniform(-px, px) * noise]
            def drag(pts, steps=5, jpx=0):
                a = scr(pts[0])
                if cdp:
                    cur = a; cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]})
                    for q in pts[1:]:
                        s = scr(q); j = jit(jpx); t = [s[0] + j[0], s[1] + j[1]]
                        for k in range(1, steps + 1): cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': cur[0] + (t[0] - cur[0]) * k / steps, 'y': cur[1] + (t[1] - cur[1]) * k / steps}]})
                        cur = t
                    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); pg.wait_for_timeout(40); return
                pg.mouse.move(*a); pg.mouse.down()
                for q in pts[1:]:
                    s = scr(q); j = jit(jpx); pg.mouse.move(s[0] + j[0], s[1] + j[1], steps=steps)
                pg.mouse.up(); pg.wait_for_timeout(40)
            def cmpx(pt, px): return [pt[0] + rnd.uniform(-px, px) * noise / PX, pt[1] + rnd.uniform(-px, px) * noise / PX]
            def tool(k): pg.evaluate(f"__w()._t.setTool('{k}')"); pg.wait_for_timeout(40)
            def comp(): return pg.evaluate("__w()._t.compPts()")
            def pol(c, r, d): return [c[0] + r * math.cos(math.radians(d)), c[1] + r * math.sin(math.radians(d))]
            def setr(c, r):   # pull the pen out/in; rotate only as much as needed to stay on the paper
                k = comp(); ph = math.degrees(math.atan2(k['pen'][1] - c[1], k['pen'][0] - c[0])); cur = math.hypot(k['pen'][0] - c[0], k['pen'][1] - c[1])
                ok = lambda q: .3 < q[0] < 14.2 and .3 < q[1] < 9.2
                tg = next((ph + d for d in sorted(range(-180, 181, 10), key=abs) if ok(pol(c, r, ph + d))), ph) + rnd.uniform(-20, 20) * noise * .5
                # copying a length: if a point lies at that distance from the needle, the kid pulls the pen onto it
                cand = pg.evaluate(f"(() => {{ const G = __w()._t.G, c = {json.dumps(c)}; return [...G.pts(), ...G.xs()].filter(q => Math.abs(Math.hypot(q[0] - c[0], q[1] - c[1]) - {r}) < .12 && Math.hypot(q[0] - c[0], q[1] - c[1]) > .5); }})()")
                n = 8; path = [cmpx(k['pen'], 6)] + [pol(c, cur + (r - cur) * i / n, ph + (tg - ph) * i / n) for i in range(1, n + 1)]
                if cand:
                    q = min(cand, key=lambda q: abs(math.hypot(q[0] - c[0], q[1] - c[1]) - r)); ra = math.degrees(math.atan2(q[1] - c[1], q[0] - c[0]))
                    path = [cmpx(k['pen'], 6)] + [pol(c, cur + (r - cur) * i / n, ph + (((ra - ph + 540) % 360) - 180) * i / n) for i in range(1, n)] + [cmpx(q, 6)]
                drag(path, steps=2, jpx=1)
            def sweep(c, r, a0, a1, style):
                k = comp(); st = cmpx(k['pen'], 7); n = int(abs(a1 - a0) / 6) + 2
                pn = k['pen']; s0 = a0 + rnd.uniform(-4, 4) * noise
                for _ in range(12):   # the pen tip is a radius handle: start tracing on the ring just beside it
                    if math.hypot(*[(pol(c, r, s0)[i] - pn[i]) * PX for i in (0, 1)]) > 40: break
                    s0 -= 6 if a1 >= a0 else -6
                if DBG: print('     sweep s0', round(s0, 1), 'a0', round(a0, 1), 'a1', round(a1, 1), 'pen', [round(v, 2) for v in pn], 'r', r, flush=True)
                if style == 'chord':
                    m0 = max(1, int(abs(a0 - s0) / 6)); pts = [pol(c, r + rnd.uniform(-.15, .15) * noise, s0 + (a0 - s0) * i / m0) for i in range(0, m0 + 1)]
                    pts += [pol(c, r + rnd.uniform(-.15, .15) * noise, a0 + (a1 - a0) * i / n) for i in range(1, n + 1)]   # press on the dashed ring, trace along
                else:
                    ph = math.degrees(math.atan2(k['pen'][1] - c[1], k['pen'][0] - c[0])); dd = ((a0 - ph + 540) % 360) - 180; m = max(1, int(abs(dd) / 8))
                    pts = [st] + [pol(c, r + rnd.uniform(-.15, .15) * noise, ph + dd * i / m) for i in range(1, m + 1)] + [pol(c, r + rnd.uniform(-.15, .15) * noise, a0 + (a1 - a0) * i / n) for i in range(1, n + 1)]
                drag(pts, steps=3, jpx=3)
            LAST = {'r': None}
            def setr2(c, r, amid):   # kid pulls the pen toward where the arc will go
                k = comp(); drag([cmpx(k['pen'], 6), pol(c, (r + math.hypot(k['pen'][0] - c[0], k['pen'][1] - c[1])) / 2, amid), pol(c, r, amid)], steps=6, jpx=1)
            def arc(c, r, a0, a1):
                tool('comp'); k = comp()
                if math.hypot(k['c'][0] - c[0], k['c'][1] - c[1]) > .05: drag([cmpx(k['c'], 6), cmpx(c, 14)])
                cur = pg.evaluate("__w()._t.comp.r")
                if LAST['r'] is None or abs(LAST['r'] - r) > .01:
                    if abs(cur - r) > .05: setr(c, r)
                LAST['r'] = r
                sweep(c, r, a0, a1, 'chord')
            def line(p1, p2):
                tool('ruler'); R = pg.evaluate("__w()._t.RUL"); o = R['o']; th0 = R['th']
                u = [math.cos(math.radians(th0)), math.sin(math.radians(th0))]; nv = [-u[1], u[0]]
                grab = [o[0] + u[0] * 2 + nv[0] * -.8, o[1] + u[1] * 2 + nv[1] * -.8]
                q = cmpx(p1, 8); drag([grab, [q[0] + (grab[0] - o[0]), q[1] + (grab[1] - o[1])]], steps=10)
                th = math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0])) + rnd.uniform(-5, 5) * noise
                R = pg.evaluate("__w()._t.RUL"); o = R['o']; kn = pg.evaluate("__w()._t.rulKnob()")
                rr = math.hypot(kn[0] - o[0], kn[1] - o[1]); a0 = math.degrees(math.atan2(kn[1] - o[1], kn[0] - o[0])); dth = ((th - R['th'] + 540) % 360) - 180
                nn = max(4, int(abs(dth) / 8)); drag([kn] + [pol(o, rr, a0 + dth * i / nn) for i in range(1, nn + 1)], steps=2)
                R = pg.evaluate("__w()._t.RUL"); u = [math.cos(math.radians(R['th'])), math.sin(math.radians(R['th']))]; nv = [-u[1], u[0]]
                q1 = cmpx([p1[0] + nv[0] * .12, p1[1] + nv[1] * .12], 8); q2 = cmpx([p2[0] + nv[0] * .12, p2[1] + nv[1] * .12], 8)
                drag([q1, q2], steps=12)
            def protTo(c, rot):
                tool('prot'); P0 = pg.evaluate("__w()._t.prot"); pc = P0['c']; ins = [pc[0] - .3, pc[1] + .7]
                drag([cmpx(ins, 5), cmpx([c[0] - .3, c[1] + .7], 14)], steps=8)
                P0 = pg.evaluate("__w()._t.prot")
                if abs(((P0['rot'] - rot + 540) % 360) - 180) > .5:
                    kn = pg.evaluate("__w()._t.protKnob()"); o = P0['c']; rr = math.hypot(kn[0] - o[0], kn[1] - o[1]); a0 = math.degrees(math.atan2(kn[1] - o[1], kn[0] - o[0])); dth = ((rot + rnd.uniform(-2, 2) - P0['rot'] + 540) % 360) - 180
                    nn = max(4, int(abs(dth) / 8)); drag([kn] + [pol(o, rr, a0 + dth * i / nn) for i in range(1, nn + 1)], steps=2)
            def mark(c, rot, deg):
                tool('prot'); P0 = pg.evaluate("__w()._t.prot"); o = P0['c']; th = P0['rot'] + deg
                drag([pol(o, 2.6 + rnd.uniform(-.3, .3) * noise, th + rnd.uniform(-4, 4) * noise), pol(o, 2.6, th)], steps=6)
            def tap(pt): tool('point'); a = scr(cmpx(pt, 8)); (cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1]}]}), cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})) if cdp else pg.mouse.click(*a); pg.wait_for_timeout(60)
            lost = False
            for op in ops:
                if not pg.evaluate("!!__w()"): lost = True; print('   lost before op', op['t'], ops.index(op), flush=True); break
                if pg.evaluate("__w()._t.done()"): break
                t = op['t']
                if t == 'arc': arc(op['c'], op['r'], op['a0'], op['a1'])
                elif t == 'seg': line(op['a'], op['b'])
                elif t == 'pt': tap(op['p'])
                elif t == 'prot': protTo(op['c'], op.get('rot', 0))
                elif t == 'mark': mark(op['c'], op['rot'], op['deg'])
                if DBG: print('    op', ops.index(op), t, json.dumps(op.get('c') or op.get('a')), pg.evaluate("JSON.stringify(__w()._t.comp)"), flush=True)
            pg.wait_for_timeout(100)
            if lost or not pg.evaluate("!!__w()"): print('  lost board', task, trial, flush=True); continue
            d = pg.evaluate("__w()._t.done()")
            if not d: pg.evaluate("__w().querySelector('.mg-chk')?.click()"); pg.wait_for_timeout(100); d = pg.evaluate("__w()._t.done()")
            if not d: print('   FAIL', task, trial, pg.evaluate("(() => { const S = __w()._t.S(); return __w().querySelector('.cns-msg').textContent.slice(0, 90) + ' | arcs ' + S.arcs.map(a => S.pts[a.c].x.toFixed(1) + ',' + S.pts[a.c].y.toFixed(1) + ' r' + a.r + ' ' + Math.round(a.a0) + '..' + Math.round(a.a1)).join(' ; ') + ' | segs ' + S.segs.filter(x => !x.given).map(x => [S.pts[x.a], S.pts[x.b]].map(q => q.x.toFixed(2) + ',' + q.y.toFixed(2)).join('→')).join(' ; ') + ' | marks ' + S.pts.filter(q => q.mark).map(q => q.deg + '@' + q.x.toFixed(2) + ',' + q.y.toFixed(2)).join(',') + ' | prot ' + JSON.stringify(__w()._t.prot) })()"), flush=True)
            
            ok += d
        tot[task] = ok; print(f'{task:44s} {ok} / {N}', flush=True)
    bad = [t for t, k in tot.items() if k < N]
    print('errors:', errs[:3]) if errs else None
    print('all good ✓' if not bad and not errs else f'not passed: {len(bad)} task(s)'); sys.exit(1 if bad or errs else 0)
