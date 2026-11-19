#!/usr/bin/env python3
"""ป.5 construction board — edge cases a real child hits (tilted ruler, finger taps, dragging tools
off the board, three wrong answers, the teach-page "ดูเฉลย" button …). Prints PASS/FAIL per case.

    python3 tests/construction/edge_cases.py            # iPad landscape
    python3 tests/construction/edge_cases.py 820x1180
"""
import sys, math
from playwright.sync_api import sync_playwright
import os, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
HTML = (ROOT / 'dist' / 'index.html').as_uri()  # build first: python3 tools/build.py
def no_fonts(pg):
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=''))
    pg.route('https://fonts.gstatic.com/**', lambda r: r.abort())
VP=[int(x) for x in (sys.argv[1] if len(sys.argv)>1 else '1180x820').split('x')]
os.makedirs('/tmp/cns', exist_ok=True)
D=lambda a:(math.cos(math.radians(a)),math.sin(math.radians(a))); add=lambda p,d,k=1:(p[0]+d[0]*k,p[1]+d[1]*k); angof=lambda a,b: math.degrees(math.atan2(b[1]-a[1],b[0]-a[0]))
res=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME') or None,args=['--no-sandbox']); ctxb=b.new_context(viewport={'width':VP[0],'height':VP[1]},has_touch=True); pg=ctxb.new_page()
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
    no_fonts(pg); pg.goto(HTML); pg.wait_for_timeout(900); J=pg.evaluate
    J("SET.mute=true; window.say=()=>{}; const o=cnsFree; window.cnsFree=(T,cb)=>{ const w=o(T,cb); w.__T=T; return w; }; const g=gameSet; window.gameSet=L=>g(L).filter(q=>q.__kind==='cns'); 0")
    CF="document.querySelector('.cnsf')"
    def fresh(lid=634): J(f"startGame(LESSONS.findIndex(l=>l.id=={lid}))"); pg.wait_for_timeout(400)
    def scr(pt): return J(f"(()=>{{ const w={CF}, sv=w.querySelector('.cns-board svg'), M=sv.getScreenCTM(), q=w._t.X([{pt[0]},{pt[1]}]); return [M.a*q[0]+M.e, M.d*q[1]+M.f]; }})()")
    def drag(pts, steps=5, raw=False):
        pts=[q if raw else scr(q) for q in pts]; pg.mouse.move(*pts[0]); pg.mouse.down()
        for q in pts[1:]: pg.mouse.move(*q, steps=steps)
        pg.mouse.up(); pg.wait_for_timeout(50)
    def tool(k): J(f"{CF}._t.setTool('{k}')"); pg.wait_for_timeout(30)
    def click(pt): pg.mouse.click(*scr(pt)); pg.wait_for_timeout(50)
    def st(): return J(f"(()=>{{const t={CF}._t; return {{R:{{o:t.RUL.o,th:t.RUL.th}}, P:{{c:t.prot.c,rot:t.prot.rot}}, C:t.compPts(), comp:{{c:t.comp.c,r:t.comp.r,phi:t.comp.phi}}, S:t.S(), msg:{CF}.querySelector('.cns-msg').innerText}}}})()")
    def rep(name, ok, detail=''): res.append(ok); print(('PASS ' if ok else 'FAIL ')+name+(' — '+str(detail) if detail else ''))
    def rot_ruler(to):
        s=st(); kn=tuple(J(f"{CF}._t.rulKnob()")); c=tuple(s['R']['o']); rr=math.dist(c,kn); a0=angof(c,kn); dth=((to-s['R']['th']+540)%360)-180
        drag([add(c,D(a0+dth*j/10),rr) for j in range(11)])
    fresh(); k=scr((1,0))[0]-scr((0,0))[0]; print('px/cm',round(k,1))
    # 1 off-board
    tool('ruler'); o=tuple(st()['R']['o']); drag([(o[0]+1.5,o[1]-.7),(o[0]+1.5,-4)])
    vis=J(f"(()=>{{const r={CF}.querySelector('.cns-ruler').getBoundingClientRect(), b={CF}.querySelector('.cns-board svg').getBoundingClientRect(); return Math.max(0, Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top))}})()")
    rep('1 ruler cannot leave the board', vis>15, f'{vis:.0f}px visible')
    tool('prot'); P=st()['P']; drag([add(tuple(P['c']),(0,1),1),(P['c'][0],-4)]); rep('1b protractor stays on board', st()['P']['c'][1]>0, st()['P']['c'])
    tool('comp'); C=st()['C']; drag([tuple(C['c']),(17,5)]); rep('1c compass stays on board', st()['comp']['c'][0]<14.5, st()['comp']['c'])
    # 2 pen start on A with ruler 0 dropped 25px off
    fresh(); tool('point'); A=(3,3); click(A); tool('ruler'); o=tuple(st()['R']['o']); off=25/k; drag([(o[0]+1.5,o[1]-.7),(A[0]+off+1.5,A[1]-.7+ 6/k)])
    o=tuple(st()['R']['o']); print('  ruler 0 at',[round(x,2) for x in o])
    drag([(A[0]+2/k,A[1]+3/k), (A[0]+5,o[1])]); s=st(); sg=s['S']['segs'][-1]; a=s['S']['pts'][sg['a']]; rep('2 pen pressed on A (ruler 0 dropped 25px away) starts at A', math.dist((a['x'],a['y']),A)<.01, (round(a['x'],2),round(a['y'],2)))
    # 2b end snaps to B when ruler 3.5-6° off
    for off_deg in (3.5,6):
        fresh(); tool('point'); click(A); B=(8,3); click(B); tool('ruler'); o=tuple(st()['R']['o']); drag([(o[0]+1.5,o[1]-.7),(A[0]+1.5,A[1]-.7)]); rot_ruler(off_deg)
        s=st(); th=s['R']['th']; o=tuple(s['R']['o']); endp=(B[0]+.1,B[1]+.12); drag([A, add(A,D(th),2.5), endp]); s=st(); sg=s['S']['segs'][-1]; e=s['S']['pts'][sg['b']]
        rep(f'2b ruler {th:.1f}° off, pen dragged to B → line ends at B', math.dist((e['x'],e['y']),B)<.01, (round(e['x'],2),round(e['y'],2)))
    # 3 tap 12px from intersection
    fresh(); tool('ruler'); o=tuple(st()['R']['o']); drag([o, add(o,(1,0),8)]); tool('comp'); C=st()['C']; drag([tuple(C['c']),(4,1.6)]); C=st()['C']; pn=tuple(C['pen']); drag([pn,add((4,1.6),D(angof((4,1.6),pn)),3.6),(4,4.6)])
    C=st()['C']; kn=tuple(C['knob']); c=(4,1.6); rr=math.dist(c,kn); a0=angof(c,kn); drag([add(c,D(a0-i*8),rr) for i in range(14)])
    tool('point'); click((5.5+10/k,1.6+7/k)); click((7-9/k,1.6+8/k)); q=st()['S']['pts'][-1]; rep('3 tap 12px from arc×line intersection lands exactly on it', math.dist((q['x'],q['y']),(7,1.6))<.01, (round(q['x'],3),round(q['y'],3)))
    # 4 compass grab by hinge
    fresh(); tool('comp'); C=st()['C']; h_=tuple(C['hinge']); before=st()['comp']['c']; drag([h_, add(h_,(-1,0),3)]); rep('4 drag compass by its hinge moves it', st()['comp']['c']!=before, st()['comp']['c'])
    mid=((C['c'][0]+C['hinge'][0])/2,(C['c'][1]+C['hinge'][1])/2); C=st()['C']; mid=((C['c'][0]+C['hinge'][0])/2,(C['c'][1]+C['hinge'][1])/2); b2=st()['comp']['c']; drag([mid, add(mid,(0,-1),1)]); rep('4b drag compass by its leg moves it', st()['comp']['c']!=b2)
    # 5 pencil circle draws
    fresh(); tool('comp'); C=st()['C']; c=tuple(C['c']); pn=tuple(C['pen']); r=math.dist(c,pn); a0=angof(c,pn); drag([add(c,D(a0+i*6),r) for i in range(0,14)]); s=st()
    rep('5 drag pencil leg around → arc drawn, radius unchanged', len(s['S']['arcs'])==1 and abs(s['comp']['r']-r)<.05, (len(s['S']['arcs']), s['comp']['r']))
    pn=tuple(st()['C']['pen']); drag([pn, add(c,D(angof(c,pn)),r+1.5)]); s=st(); rep('5b drag pencil outward → radius grows, no extra arc', len(s['S']['arcs'])==1 and abs(s['comp']['r']-(r+1.5))<.15, (len(s['S']['arcs']), s['comp']['r']))
    # 6 ruler tick band grab moves
    fresh(); tool('ruler'); o=tuple(st()['R']['o']); drag([(o[0]+3,o[1]-.25),(o[0]+3,o[1]+2)]); s=st(); rep('6 grab ruler on the tick numbers (0.25cm under edge) moves it', abs(s['R']['o'][1]-(o[1]+2.25))<.05 and not s['S']['segs'], s['R']['o'])
    # 7 parallel snap
    fresh(); tool('ruler'); o=tuple(st()['R']['o']); drag([(o[0]+1.5,o[1]-.7),(2+1.5,2-.7)]); rot_ruler(10); s=st(); print('  ruler th', s['R']['th']); o=tuple(s['R']['o']); drag([o, add(o,D(s['R']['th']),6)])
    drag([(o[0]+1.5*math.cos(math.radians(10))+.12,o[1]-.7+.02),(3+1.5,5-.7)]); s=st(); print('  ruler now',s['R']); rot_ruler(12.2); s=st(); rep('7 ruler snaps parallel to tilted AB (10°)', abs(s['R']['th']-10)<.01 or abs(s['R']['th']-190)<.01, round(s['R']['th'],2))
    # 8 free-end message & ring
    fresh(); tool('point'); click((3,3)); click((8,3)); tool('ruler'); o=tuple(st()['R']['o']); drag([(o[0]+1.5,o[1]-.7),(3+1.5,3-.7)]); drag([(3,3),(7.4,3.0)])
    rep('8 line stopping 0.6cm short of a point → message', 'ยังไม่ถึงจุด' in st()['msg'], st()['msg'][:60]); ring=J(f"{CF}.querySelectorAll('.cg-obj circle[fill=\"#fff\"]').length"); rep('8b open end drawn as hollow ring', ring>=1, ring)
    # 9 wrong flow specific + hint
    fresh(636)
    msgs=[]
    for kk,(w,hh) in enumerate([(5,3),(6,2.5),(4,4)]):
        J(f"(()=>{{const S={CF}._t.S(); S.segs.length=0; S.pts.length=0; [[2,2],[2+{w},2],[2+{w},2+{hh}],[2,2+{hh}]].forEach(p=>S.pts.push({{x:p[0],y:p[1],mark:false,auto:true}})); S.segs.push({{a:0,b:1}},{{a:1,b:2}},{{a:2,b:3}},{{a:3,b:0}}); }})()")
        tool('point'); click((13,8.5)); pg.wait_for_timeout(400); msgs.append(J("document.querySelector('.bsub')?.innerText||''").replace('\n',' '))
    for m_ in msgs: print('   ', m_[:200])
    rep('9 three different wrong shapes → try / hint / reveal', 'ยังไม่ถูก' in msgs[0] and '💡' in msgs[1] and 'เฉลย' in msgs[2])
    pg.wait_for_timeout(500); pg.screenshot(path=f'/tmp/cns/n_reveal_{VP[0]}.png')
    # 10 teach page reveal button
    li=J("LESSONS.findIndex(l=>l.id==634)"); J(f"startTeach({li},2)"); pg.wait_for_timeout(400)
    has=J("!!document.querySelector('.cnsf-r')"); J("document.querySelector('.cnsf-r')?.click()"); pg.wait_for_timeout(300)
    nxt=J("[...document.querySelectorAll('button')].filter(b=>/ถัดไป/.test(b.innerText)).map(b=>b.classList.contains('waiting')).join()")
    rep('10 teach page has ดูเฉลย and it unlocks ถัดไป', has and 'true' not in nxt, nxt); pg.screenshot(path=f'/tmp/cns/n_teach_{VP[0]}.png')
    # 11 labels on top of instruments
    fresh(); tool('point'); click((2,1.6)); top=J(f"(()=>{{const t=[...{CF}.querySelectorAll('.cns-n')]; return t.length && t[0].closest('g').classList.contains('cg-lab')}})()"); rep('11 point names drawn above instruments', top)
    print('ERRS', errs[:3]); print(sum(res),'/',len(res)); sys.exit(0 if all(res) and not errs else 1)
