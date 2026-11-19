#!/usr/bin/env python3
"""ป.5 ถ้ำสี่เหลี่ยม — a simulated child builds every construction question in the real game screen
with the on-screen ruler, protractor, compass and point tool (mouse drags, like a real player).

    python3 tests/construction/solve_all.py                       # iPad landscape, lessons 634–639
    python3 tests/construction/solve_all.py 820x1180 634,636 2     # viewport, lesson ids, games per lesson

Each line prints whether the shape was finished ("done": true). Screenshots go to /tmp/cns/.
"""
import sys, math, json, time
from playwright.sync_api import sync_playwright
import os, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
HTML = (ROOT / 'dist' / 'index.html').as_uri()  # build first: python3 tools/build.py
def no_fonts(pg):
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=''))
    pg.route('https://fonts.gstatic.com/**', lambda r: r.abort())
VP=[int(x) for x in (sys.argv[1] if len(sys.argv)>1 else '1180x820').split('x')]; LIDS=[int(x) for x in (sys.argv[2] if len(sys.argv)>2 else '634,635,636,637,638,639').split(',')]; REP=int(sys.argv[3]) if len(sys.argv)>3 else 1
os.makedirs('/tmp/cns', exist_ok=True)
D=lambda a:(math.cos(math.radians(a)),math.sin(math.radians(a))); add=lambda p,d,k=1:(p[0]+d[0]*k,p[1]+d[1]*k)
angof=lambda a,b: math.degrees(math.atan2(b[1]-a[1],b[0]-a[0]))
log=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME') or None,args=['--no-sandbox']); pg=b.new_page(viewport={'width':VP[0],'height':VP[1]})
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
    no_fonts(pg); pg.goto(HTML); pg.wait_for_timeout(900)
    pg.evaluate("SET.mute=true; window.say=()=>{}; const o=cnsFree; window.cnsFree=(T,cb)=>{ const w=o(T,cb); w.__T=T; return w; }; const g=gameSet; window.gameSet=L=>g(L).filter(q=>q.__kind==='cns'); 0")
    J=pg.evaluate
    def CF(): return "document.querySelector('.qbody .cnsf, .cnsf')"
    def scr(pt): return J(f"(()=>{{ const w={CF()}, sv=w.querySelector('.cns-board svg'), M=sv.getScreenCTM(), q=w._t.X([{pt[0]},{pt[1]}]); return [M.a*q[0]+M.e, M.d*q[1]+M.f]; }})()")
    def onb(pt): return 0.3<pt[0]<14.2 and 0.3<pt[1]<9.25
    def drag(pts, steps=4):
        pg.mouse.move(*scr(pts[0])); pg.mouse.down()
        for q in pts[1:]: pg.mouse.move(*scr(q), steps=steps)
        pg.mouse.up(); pg.wait_for_timeout(40)
    def tool(k): J(f"{CF()}._t.setTool('{k}')"); pg.wait_for_timeout(30)
    def click(pt): pg.mouse.click(*scr(pt)); pg.wait_for_timeout(50)
    def arcpath(c,r,a0,a1,n=12): return [add(c,D(a0+(a1-a0)*i/n),r) for i in range(n+1)]
    def R(): return J(f"(()=>{{const t={CF()}._t; return {{o:t.RUL.o, th:t.RUL.th, len:t.RUL.len}}}})()")
    def ruler_place(o, th):
        tool('ruler'); r=R(); u=D(r['th']); nn=(-u[1],u[0])
        ts=[t for t in [1.5,2.5,3.5,1,4.5,5.5,0.6] if onb(add(add(tuple(r['o']),u,t),nn,-0.7))]
        if not ts: return None
        t=ts[0]; drag([add(add(tuple(r['o']),u,t),nn,-0.7), add(add(o,u,t),nn,-0.7)])
        r=R(); kn=tuple(J(f"{CF()}._t.rulKnob()")); c=tuple(r['o']); rr=math.dist(c,kn); a0=angof(c,kn); dth=((th-r['th']+540)%360)-180
        if abs(dth)>0.01: drag(arcpath(c,rr,a0,a0+dth,max(4,int(abs(dth)/8))))
        return R()
    def pen(o,th,L): u=D(th); drag([o,add(o,u,L/2),add(o,u,L)],steps=6)
    def ruler(p0,p1):
        th=angof(p0,p1); r=ruler_place(p0,th)
        if not r: return 'ruler-grab-fail'
        bad = math.dist(r['o'],p0)>.05 or abs(((r['th']-th+540)%360)-180)>.3
        pen(tuple(r['o']),r['th'],math.dist(p0,p1)); return 'ruler-misplaced %s→%s got %s %.1f'%(p0,p1,r['o'],r['th']) if bad else None
    def prot(c,rot,deg):
        tool('prot'); P=J(f"({{c:{CF()}._t.prot.c, rot:{CF()}._t.prot.rot}})"); g=add(tuple(P['c']),D(P['rot']+90),1.0); drag([g,add(c,D(P['rot']+90),1.0)])
        P=J(f"({{c:{CF()}._t.prot.c, rot:{CF()}._t.prot.rot}})"); kn=tuple(J(f"{CF()}._t.protKnob()")); cc=tuple(P['c']); rr=math.dist(cc,kn); a0=angof(cc,kn); dth=((rot-P['rot']+540)%360)-180
        if abs(dth)>0.01: drag(arcpath(cc,rr,a0,a0+dth))
        click(add(c,D(rot+deg),2.45))
    def comp(c,r,ta):
        tool('comp'); C=J(f"{CF()}._t.compPts()"); drag([tuple(C['c']),c])
        C=J(f"{CF()}._t.compPts()"); pn=tuple(C['pen']); ph=angof(c,pn); drag([pn,add(c,D(ph),math.dist(c,pn)+1.2),add(c,D(ta-40),r)])
        C=J(f"{CF()}._t.compPts()"); kn=tuple(C['knob']); rr=math.dist(c,kn); a0=angof(c,kn); drag(arcpath(c,rr,a0,a0+80,16))
    def pt(q,off=(.1,.08)): tool('point'); click((q[0]+off[0],q[1]+off[1]))
    def solve():
        T=J(f"(()=>{{const T={CF()}.__T; return {{name:T.name, fit:T.fit, steps:T.steps.map(s=>Object.fromEntries(Object.entries(s).filter(([k,v])=>typeof v!=='function'))), line:T.lineThru}}}})()")
        F={k:tuple(v) for k,v in T['fit'].items()}; xs=[v[0] for v in F.values()]; ys=[v[1] for v in F.values()]
        off=((14.5-max(xs)-min(xs))/2,(9.5-max(ys)-min(ys))/2); P={k:(v[0]+off[0],v[1]+off[1]) for k,v in F.items()}; issues=[]
        for s in T['steps']:
            t=s['t']
            if t=='seg': e=ruler(P[s['a']],P[s['b']]); e and issues.append(e)
            elif t=='ang':
                A=P[s['at']]; rot=angof(A,P[s['from']]); tgt=angof(A,P[s['to']]); deg=((tgt-rot)%360)
                if deg>180: rot=rot; deg=deg  # shouldn't happen
                prot(A,rot,deg)
                if s.get('line'):
                    r_=ruler_place(A,tgt); r_ and pen(tuple(r_['o']),r_['th'],math.dist(A,P['D'])+1)
                    r_=ruler_place(A,tgt+180); r_ and pen(tuple(r_['o']),r_['th'],math.dist(A,P['B'])+1)
            elif t=='arc':
                tg=(s['tgtE'][0]+off[0],s['tgtE'][1]+off[1]); comp(P[s['c']],s['r'],angof(P[s['c']],tg))
            elif t=='tap': pt(P[s['name']])
            elif t=='mark':
                a,c=P[s['on'][0]],P[s['on'][1]]; r_=ruler_place(a,angof(a,c)); tool('point'); click(add(P[s['name']],(0,1),.12))
            elif t=='join':
                for a,c in s['pairs']: e=ruler(P[a],P[c]); e and issues.append(e)
        return T['name'], issues
    for lid in LIDS:
      for rep in range(REP):
        J(f"startGame(LESSONS.findIndex(l=>l.id=={lid}))"); pg.wait_for_timeout(500)
        n=J("document.querySelectorAll('.cnsf').length"); qi=0
        while True:
            if not J(f"!!{CF()}"): break
            prompt=J("document.querySelector('.bubble, .bub, .say')?.innerText||''")[:90]
            t0=time.time(); name,iss=solve(); pg.wait_for_timeout(1300)
            okmsg=J(f"{CF()}?.querySelector('.cns-msg')?.innerText||'(gone)'")
            st=J(f"!!({CF()}&&{CF()}._t.done())")
            hint=''
            if not st: J(f"{CF()}.querySelector('.cnsf-h').click()"); pg.wait_for_timeout(60); hint=J(f"{CF()}.querySelector('.cns-msg').innerText")
            pg.screenshot(path=f'/tmp/cns/{lid}_{rep}_{qi}_{VP[0]}.png')
            log.append(dict(lid=lid,q=qi,prompt=prompt,name=name,done=st,issues=iss,msg=okmsg[:80],hint=hint[:80],sec=round(time.time()-t0,1)))
            print(json.dumps(log[-1],ensure_ascii=False))
            # go next
            pg.wait_for_timeout(400); nx=pg.query_selector('button:has-text("ข้อต่อไป"), button:has-text("ดูผล")')
            if nx: nx.click(); pg.wait_for_timeout(500)
            else: break
            qi+=1
            if qi>4: break
    print('ERRS',errs[:5])
    bad=[l for l in log if not l['done']]
    print(f"{len(log)-len(bad)}/{len(log)} constructions finished"); sys.exit(1 if bad or errs else 0)
