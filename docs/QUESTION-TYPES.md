# ชนิดคำถาม (Question types)

สร้างอัตโนมัติด้วย `python3 tools/catalog.py` — อย่าแก้ไฟล์นี้ด้วยมือ (generated; do not edit by hand).

ทุกชนิดคืนค่าเป็น object คำถาม `{ prompt, say, mount(bd, ctx) … }` ใช้ในฟังก์ชัน `game` ของด่าน · ก่อนสร้างชนิดใหม่ ให้หาในตารางนี้ก่อนว่ามีของเดิมใช้ได้ไหม

396 types

| ชนิด | พารามิเตอร์ | ไฟล์ |
|---|---|---|
| `Q.a4Build` | `{ nm, deg, left }` | [`grades/p4/p4a.js:301`](../src/grades/p4/p4a.js#L301) |
| `Q.a4Calc` | `{ type, x, y, L }` | [`grades/p4/p4a.js:284`](../src/grades/p4/p4a.js#L284) |
| `Q.a4Cls` | `{ nm, d1, a, show }` | [`grades/p4/p4a.js:251`](../src/grades/p4/p4a.js#L251) |
| `Q.a4ClsDeg` | `{ nm, a }` | [`grades/p4/p4a.js:256`](../src/grades/p4/p4a.js#L256) |
| `Q.a4Cmp90` | `{ nm, d1, a }` | [`grades/p4/p4a.js:243`](../src/grades/p4/p4a.js#L243) |
| `Q.a4Count` | `{ n, d0, span, L }` | [`grades/p4/p4a.js:238`](../src/grades/p4/p4a.js#L238) |
| `Q.a4Draw` | `{ k, name, pts }` | [`grades/p4/p4a.js:215`](../src/grades/p4/p4a.js#L215) |
| `Q.a4DrawAngle` | | [`grades/p4/p4a.js:456`](../src/grades/p4/p4a.js#L456) |
| `Q.a4Grid` | `{ mode, pts, ref, dx, dy, nm }` | [`grades/p4/p4a.js:188`](../src/grades/p4/p4a.js#L188) |
| `Q.a4Inter` | `{ L }` | [`grades/p4/p4a.js:229`](../src/grades/p4/p4a.js#L229) |
| `Q.a4Kind` | `{ k, ab }` | [`grades/p4/p4a.js:209`](../src/grades/p4/p4a.js#L209) |
| `Q.a4Name` | `{ nm, d1, a, mode }` | [`grades/p4/p4a.js:233`](../src/grades/p4/p4a.js#L233) |
| `Q.a4Read` | `{ nm, d1, a, inner }` | [`grades/p4/p4a.js:268`](../src/grades/p4/p4a.js#L268) |
| `Q.a4ReadR` | `{ nm, a }` | [`grades/p4/p4a.js:274`](../src/grades/p4/p4a.js#L274) |
| `Q.a4Tap` | `{ kind, A }` | [`grades/p4/p4a.js:259`](../src/grades/p4/p4a.js#L259) |
| `Q.abacusRead` | `{ n, ask = 'digit', rods }` | [`engine/questions.js:672`](../src/engine/questions.js#L672) |
| `Q.add100` | `{ a, b, blocks = false }` | [`engine/questions.js:1330`](../src/engine/questions.js#L1330) |
| `Q.addFact` | `{ a, b, frame = false, pen, vert = false }` | [`engine/questions.js:283`](../src/engine/questions.js#L283) |
| `Q.addSteps` | `{ a, b }` | [`engine/questions.js:1336`](../src/engine/questions.js#L1336) |
| `Q.arrange` | `{ clues, answer, slotLabel }` | [`engine/questions.js:1084`](../src/engine/questions.js#L1084) |
| `Q.b3Story` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p3/p3b.js:23`](../src/grades/p3/p3b.js#L23) |
| `Q.b3Unk` | `st` | [`grades/p3/p3b.js:28`](../src/grades/p3/p3b.js#L28) |
| `Q.balanceCmp` | `{ a, b, rel }` | [`engine/questions.js:977`](../src/engine/questions.js#L977) |
| `Q.basketCount` | `{ e, name, n, unit = 'ผล' }` | [`engine/questions.js:1219`](../src/engine/questions.js#L1219) |
| `Q.between` | `{ lo, hi }` | [`engine/questions.js:765`](../src/engine/questions.js#L765) |
| `Q.blocksRead` | `{ n, ask = 'digit' }` | [`engine/questions.js:570`](../src/engine/questions.js#L570) |
| `Q.buildChart` | `{ chart: c, from = 'mix' }` | [`engine/questions.js:951`](../src/engine/questions.js#L951) |
| `Q.busAsk` | `{ names, k }` | [`engine/questions.js:1070`](../src/engine/questions.js#L1070) |
| `Q.c8Pick` | `{ fig, q, opts, right, hint, keep }` | [`grades/p6/p6o.js:138`](../src/grades/p6/p6o.js#L138) |
| `Q.chartAsk` | `{ chart: c, ask, a = 0, b = 1, k = 3 }` | [`engine/questions.js:915`](../src/engine/questions.js#L915) |
| `Q.cmp2` | `{ a, b: bb, blocks = false }` | [`engine/questions.js:1241`](../src/engine/questions.js#L1241) |
| `Q.cnsQ` | `T, q` | [`grades/p5/p5q.js:571`](../src/grades/p5/p5q.js#L571) |
| `Q.colW` | `{ nums, op, prompt, say, sig, plain }` | [`engine/colw.js:83`](../src/engine/colw.js#L83) |
| `Q.compare5` | `{ a, b: bb, ea, eb, eq = true }` | [`engine/questions.js:754`](../src/engine/questions.js#L754) |
| `Q.compareSym` | `{ a, b: bb, blocks = false }` | [`engine/questions.js:621`](../src/engine/questions.js#L621) |
| `Q.countKind` | `{ items, kind, mode = 'solid', art: isArt }` | [`engine/questions.js:1130`](../src/engine/questions.js#L1130) |
| `Q.countOnAdd` | `{ a, b }` | [`engine/questions.js:836`](../src/engine/questions.js#L836) |
| `Q.d3Long` | `{ D, k, guide }` | [`grades/p3/p3d.js:134`](../src/grades/p3/p3d.js#L134) |
| `Q.d3Short` | `{ D, k, guide }` | [`grades/p3/p3d.js:136`](../src/grades/p3/p3d.js#L136) |
| `Q.d3Story` | `{ text, n, d, unit, unit2 }` | [`grades/p3/p3d.js:139`](../src/grades/p3/p3d.js#L139) |
| `Q.d3Unk` | `{ a, b, c, pos }` | [`grades/p3/p3d.js:150`](../src/grades/p3/p3d.js#L150) |
| `Q.d5Work` | `{ expr, mode = 'col' }` | [`grades/p5/p5d.js:458`](../src/grades/p5/p5d.js#L458) |
| `Q.d6Div` | `{ expr, mode = 'long' }` | [`grades/p6/p6d.js:110`](../src/grades/p6/p6d.js#L110) |
| `Q.d6ToFrac` | `{ x }` | [`grades/p6/p6d.js:98`](../src/grades/p6/p6d.js#L98) |
| `Q.dCalc` | `{ expr, hint }` | [`grades/p5/p5d.js:108`](../src/grades/p5/p5d.js#L108) |
| `Q.dCmp` | `{ l, r, hint }` | [`grades/p5/p5d.js:126`](../src/grades/p5/p5d.js#L126) |
| `Q.dFill` | `{ q, a, hint, say: sy }` | [`grades/p5/p5d.js:142`](../src/grades/p5/p5d.js#L142) |
| `Q.dFrac` | `{ f }` | [`grades/p5/p5d.js:81`](../src/grades/p5/p5d.js#L81) |
| `Q.digitPlace` | `{ n, i }` | [`engine/questions.js:727`](../src/engine/questions.js#L727) |
| `Q.digitValue` | `{ n, i, underline = false }` | [`engine/questions.js:717`](../src/engine/questions.js#L717) |
| `Q.dMatch` | `{ pairs }` | [`grades/p5/p5d.js:89`](../src/grades/p5/p5d.js#L89) |
| `Q.dMiss` | `{ a, res, op = '×' }` | [`grades/p5/p5d.js:134`](../src/grades/p5/p5d.js#L134) |
| `Q.dPick` | `{ q, opts, right, hint, say: sy, keep }` | [`grades/p5/p5d.js:103`](../src/grades/p5/p5d.js#L103) |
| `Q.dPoint` | `{ a, b }` | [`grades/p5/p5d.js:115`](../src/grades/p5/p5d.js#L115) |
| `Q.drawSum` | `{ a, b }` | [`engine/questions.js:273`](../src/engine/questions.js#L273) |
| `Q.dRound` | `{ x, p, line = false }` | [`grades/p5/p5d.js:95`](../src/grades/p5/p5d.js#L95) |
| `Q.dStory` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p5/p5d.js:149`](../src/grades/p5/p5d.js#L149) |
| `Q.dvCmp` | `{ l, r }` | [`grades/p2/p2d.js:142`](../src/grades/p2/p2d.js#L142) |
| `Q.dvCtr` | `{ n, d }` | [`grades/p2/p2d.js:106`](../src/grades/p2/p2d.js#L106) |
| `Q.dvFact` | `{ n, d }` | [`grades/p2/p2d.js:112`](../src/grades/p2/p2d.js#L112) |
| `Q.dvFam` | `{ a, b }` | [`grades/p2/p2d.js:119`](../src/grades/p2/p2d.js#L119) |
| `Q.dvPic` | `{ n, d, e, what, box, unit, mode }` | [`grades/p2/p2d.js:100`](../src/grades/p2/p2d.js#L100) |
| `Q.dvPop` | `{ facts }` | [`grades/p2/p2d.js:126`](../src/grades/p2/p2d.js#L126) |
| `Q.dvRem` | `{ n, d, e }` | [`grades/p2/p2d.js:137`](../src/grades/p2/p2d.js#L137) |
| `Q.dvStory` | `{ text, n, d, unit, unit2, fig }` | [`grades/p2/p2d.js:157`](../src/grades/p2/p2d.js#L157) |
| `Q.dvUnk` | `{ a, b, c, pos }` | [`grades/p2/p2d.js:148`](../src/grades/p2/p2d.js#L148) |
| `Q.e4Col` | `{ a, b, op }` | [`grades/p4/p4e.js:100`](../src/grades/p4/p4e.js#L100) |
| `Q.e4Exp` | `{ s }` | [`grades/p4/p4e.js:131`](../src/grades/p4/p4e.js#L131) |
| `Q.e4Frac` | `{ s }` | [`grades/p4/p4e.js:118`](../src/grades/p4/p4e.js#L118) |
| `Q.e4Mix` | `{ expr }` | [`grades/p4/p4e.js:103`](../src/grades/p4/p4e.js#L103) |
| `Q.e4Pic` | `{ n, unit }` | [`grades/p4/p4e.js:115`](../src/grades/p4/p4e.js#L115) |
| `Q.e4Place` | `{ s, pos }` | [`grades/p4/p4e.js:127`](../src/grades/p4/p4e.js#L127) |
| `Q.e4Read` | `{ s, to }` | [`grades/p4/p4e.js:121`](../src/grades/p4/p4e.js#L121) |
| `Q.estimate1kg` | `{ a, heavy }` | [`engine/questions.js:989`](../src/engine/questions.js#L989) |
| `Q.evenOdd` | `{ n }` | [`engine/questions.js:633`](../src/engine/questions.js#L633) |
| `Q.expand20` | `{ n, miss = 'u' }` | [`engine/questions.js:810`](../src/engine/questions.js#L810) |
| `Q.expanded5` | `{ n, miss }` | [`engine/questions.js:734`](../src/engine/questions.js#L734) |
| `Q.f3Calc` | `{ a, b, op, d, w }` | [`grades/p3/p3f.js:101`](../src/grades/p3/p3f.js#L101) |
| `Q.f3Cmp` | `{ a, b, pic }` | [`grades/p3/p3f.js:98`](../src/grades/p3/p3f.js#L98) |
| `Q.f3Equal` | `{ i, eq, d }` | [`grades/p3/p3f.js:84`](../src/grades/p3/p3f.js#L84) |
| `Q.f3Part` | `{ n, d, ask }` | [`grades/p3/p3f.js:96`](../src/grades/p3/p3f.js#L96) |
| `Q.f3Read` | `{ n, d, to }` | [`grades/p3/p3f.js:92`](../src/grades/p3/p3f.js#L92) |
| `Q.f3Shade` | `{ n, d, kind }` | [`grades/p3/p3f.js:89`](../src/grades/p3/p3f.js#L89) |
| `Q.f3Story` | `{ text, sent, wrong, n, d, unit }` | [`grades/p3/p3f.js:105`](../src/grades/p3/p3f.js#L105) |
| `Q.f3Write` | `{ n, d, kind }` | [`grades/p3/p3f.js:87`](../src/grades/p3/p3f.js#L87) |
| `Q.f4Calc2` | `{ expr, bars, lcm }` | [`grades/p4/p4f.js:128`](../src/grades/p4/p4f.js#L128) |
| `Q.f4Eq` | `{ n, d, k, mode, ask }` | [`grades/p4/p4f.js:69`](../src/grades/p4/p4f.js#L69) |
| `Q.f4Fill` | `{ tpl, ans, hint }` | [`grades/p4/p4f.js:63`](../src/grades/p4/p4f.js#L63) |
| `Q.f4MixPic` | `{ w, n, d }` | [`grades/p4/p4f.js:59`](../src/grades/p4/p4f.js#L59) |
| `Q.f4Pic` | `{ n, d, kind }` | [`grades/p4/p4f.js:57`](../src/grades/p4/p4f.js#L57) |
| `Q.f4Set` | `{ d, per, n }` | [`grades/p4/p4f.js:61`](../src/grades/p4/p4f.js#L61) |
| `Q.f4Simp` | `{ n, d }` | [`grades/p4/p4f.js:71`](../src/grades/p4/p4f.js#L71) |
| `Q.f4Story2` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p4/p4f.js:131`](../src/grades/p4/p4f.js#L131) |
| `Q.f4ToImp` | `{ w, n, d }` | [`grades/p4/p4f.js:65`](../src/grades/p4/p4f.js#L65) |
| `Q.f4ToMix` | `{ n, d }` | [`grades/p4/p4f.js:67`](../src/grades/p4/p4f.js#L67) |
| `Q.f6Mix` | `{ f }` | [`grades/p6/p6f.js:122`](../src/grades/p6/p6f.js#L122) |
| `Q.f6Steps` | `{ expr }` | [`grades/p4/p4o.js:75`](../src/grades/p4/p4o.js#L75) |
| `Q.family` | `{ a, b }` | [`engine/questions.js:456`](../src/engine/questions.js#L456) |
| `Q.fCalc` | `{ expr, vis, hint }` | [`grades/p5/p5.js:190`](../src/grades/p5/p5.js#L190) |
| `Q.fCmp` | `{ a, b, bars = false, hint }` | [`grades/p5/p5.js:163`](../src/grades/p5/p5.js#L163) |
| `Q.fEquiv` | `{ a, D }` | [`grades/p5/p5.js:231`](../src/grades/p5/p5.js#L231) |
| `Q.fFirst` | `{ expr }` | [`grades/p5/p5.js:223`](../src/grades/p5/p5.js#L223) |
| `Q.fHalf` | `{ a }` | [`grades/p5/p5.js:157`](../src/grades/p5/p5.js#L157) |
| `Q.fillFrames` | `{ n }` | [`engine/questions.js:800`](../src/engine/questions.js#L800) |
| `Q.findDiff` | `{ n = 2 } = {}` | [`engine/questions.js:511`](../src/engine/questions.js#L511) |
| `Q.findTens` | | [`engine/questions.js:319`](../src/engine/questions.js#L319) |
| `Q.findX` | `{ toks }` | [`engine/questions.js:1404`](../src/engine/questions.js#L1404) |
| `Q.fOf` | `{ f, n, e = 'coin', unit = '' }` | [`grades/p5/p5.js:201`](../src/grades/p5/p5.js#L201) |
| `Q.fOrder` | `{ list, dir = 'asc' }` | [`grades/p5/p5.js:181`](../src/grades/p5/p5.js#L181) |
| `Q.fPick` | `{ q, opts, right, hint }` | [`grades/p5/p5.js:177`](../src/grades/p5/p5.js#L177) |
| `Q.frames20` | `{ n, pen }` | [`engine/questions.js:795`](../src/engine/questions.js#L795) |
| `Q.fRecip` | `{ f }` | [`grades/p5/p5.js:207`](../src/grades/p5/p5.js#L207) |
| `Q.fromExpanded` | `{ n }` | [`engine/questions.js:748`](../src/engine/questions.js#L748) |
| `Q.fStory` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p5/p5.js:213`](../src/grades/p5/p5.js#L213) |
| `Q.g2count` | `{ fig, q, a, hint }` | [`grades/p2/p2g.js:132`](../src/grades/p2/p2g.js#L132) |
| `Q.g2draw` | `{ n }` | [`grades/p2/p2g.js:137`](../src/grades/p2/p2g.js#L137) |
| `Q.g2name` | `{ c, opts, q = 'รูปนี้คือรูปเรขาคณิตใด', hint }` | [`grades/p2/p2g.js:116`](../src/grades/p2/p2g.js#L116) |
| `Q.g2sides` | `{ v, ask = 'ด้าน' }` | [`grades/p2/p2g.js:127`](../src/grades/p2/p2g.js#L127) |
| `Q.g2tapAll` | `{ q, cards, ok, hint }` | [`grades/p2/p2g.js:120`](../src/grades/p2/p2g.js#L120) |
| `Q.g4Hidden` | `{ C, i }` | [`grades/p4/p4g.js:117`](../src/grades/p4/p4g.js#L117) |
| `Q.g4Rank` | `{ C, dir }` | [`grades/p4/p4g.js:108`](../src/grades/p4/p4g.js#L108) |
| `Q.g4Scale` | `{ C }` | [`grades/p4/p4g.js:131`](../src/grades/p4/p4g.js#L131) |
| `Q.g4Spot` | `{ C, i, wrong }` | [`grades/p4/p4g.js:124`](../src/grades/p4/p4g.js#L124) |
| `Q.g4TapBar` | `{ C, want }` | [`grades/p4/p4g.js:102`](../src/grades/p4/p4g.js#L102) |
| `Q.g4TwAsk` | `{ T, q, a, hint, sig }` | [`grades/p4/p4g.js:100`](../src/grades/p4/p4g.js#L100) |
| `Q.g4TwFill` | `{ T, blanks }` | [`grades/p4/p4g.js:84`](../src/grades/p4/p4g.js#L84) |
| `Q.g4TwTally` | `{ S, give }` | [`grades/p4/p4g.js:78`](../src/grades/p4/p4g.js#L78) |
| `Q.g4TwTap` | `{ T, ask }` | [`grades/p4/p4g.js:89`](../src/grades/p4/p4g.js#L89) |
| `Q.gAsk` | `{ chart, q, a, unit = '', hint, say: sy }` | [`grades/p5/p5c.js:110`](../src/grades/p5/p5c.js#L110) |
| `Q.gBuild` | `{ chart }` | [`grades/p5/p5c.js:121`](../src/grades/p5/p5c.js#L121) |
| `Q.gPick` | `{ chart, q, opts, right, hint, say: sy }` | [`grades/p5/p5c.js:115`](../src/grades/p5/p5c.js#L115) |
| `Q.gridAsk` | `{ rows, ask, of }` | [`engine/questions.js:1045`](../src/engine/questions.js#L1045) |
| `Q.hCmul` | `{ nums, upto }` | [`grades/p6/p6h.js:370`](../src/grades/p6/p6h.js#L370) |
| `Q.hCommon` | `{ nums }` | [`grades/p6/p6h.js:365`](../src/grades/p6/p6h.js#L365) |
| `Q.hFac` | `{ n }` | [`grades/p6/p6h.js:328`](../src/grades/p6/p6h.js#L328) |
| `Q.hGcd` | `{ nums, how = 'cd' }` | [`grades/p6/p6h.js:355`](../src/grades/p6/p6h.js#L355) |
| `Q.hKind` | `{ text, kind, why }` | [`grades/p6/p6h.js:383`](../src/grades/p6/p6h.js#L383) |
| `Q.hLadder` | `{ nums, mode }` | [`grades/p6/p6h.js:322`](../src/grades/p6/p6h.js#L322) |
| `Q.hLcm` | `{ nums, how = 'cm' }` | [`grades/p6/p6h.js:360`](../src/grades/p6/p6h.js#L360) |
| `Q.hNum` | `{ q, head, a, hint, say: sy }` | [`grades/p6/p6h.js:380`](../src/grades/p6/p6h.js#L380) |
| `Q.hPF` | `{ n }` | [`grades/p6/p6h.js:344`](../src/grades/p6/p6h.js#L344) |
| `Q.hPFs` | `{ n }` | [`grades/p6/p6h.js:338`](../src/grades/p6/p6h.js#L338) |
| `Q.hPFWork` | `{ nums, mode }` | [`grades/p6/p6h.js:324`](../src/grades/p6/p6h.js#L324) |
| `Q.hPrime` | `{ nums }` | [`grades/p6/p6h.js:333`](../src/grades/p6/p6h.js#L333) |
| `Q.hStory` | `{ text, kind, ans, unit = '', ask, why }` | [`grades/p6/p6h.js:389`](../src/grades/p6/p6h.js#L389) |
| `Q.hTF` | `{ text, ok, why }` | [`grades/p6/p6h.js:375`](../src/grades/p6/p6h.js#L375) |
| `Q.hundredFill` | `{ cells, show, q }` | [`engine/questions.js:1263`](../src/engine/questions.js#L1263) |
| `Q.isAddition` | | [`engine/questions.js:380`](../src/engine/questions.js#L380) |
| `Q.isSubtraction` | | [`engine/questions.js:529`](../src/engine/questions.js#L529) |
| `Q.ixGroup` | `{ q, say: sy, bins, items, hint }` | [`engine/ix.js:45`](../src/engine/ix.js#L45) |
| `Q.ixMatch` | `{ q, say: sy, pairs, hint, wide }` | [`engine/ix.js:11`](../src/engine/ix.js#L11) |
| `Q.ixSort` | `{ q, say: sy, items, dir = 'asc', k, slotLabels, hint, fig, side }` | [`engine/ix.js:19`](../src/engine/ix.js#L19) |
| `Q.ixTF` | `{ q, say: sy, bins, items, hint }` | [`engine/ix.js:30`](../src/engine/ix.js#L30) |
| `Q.k3Cmp` | `{ L, R }` | [`grades/p3/p3k.js:59`](../src/grades/p3/p3k.js#L59) |
| `Q.k3Col` | `{ a, m, flip }` | [`grades/p3/p3k.js:43`](../src/grades/p3/p3k.js#L43) |
| `Q.k3Groups` | `{ g, m, z }` | [`grades/p3/p3k.js:57`](../src/grades/p3/p3k.js#L57) |
| `Q.k3Long` | `{ a, b }` | [`grades/p3/p3k.js:45`](../src/grades/p3/p3k.js#L45) |
| `Q.k3Story` | `{ text, a, b, unit, wrong }` | [`grades/p3/p3k.js:68`](../src/grades/p3/p3k.js#L68) |
| `Q.k3Unk` | `{ k, x, pos }` | [`grades/p3/p3k.js:63`](../src/grades/p3/p3k.js#L63) |
| `Q.k3Zero` | `{ a, b }` | [`grades/p3/p3k.js:47`](../src/grades/p3/p3k.js#L47) |
| `Q.k7Ang` | `{ fig, a, q = 'หาผลบวกของขนาดของมุมภายในของรูปหลายเหลี่ยม', hint }` | [`grades/p6/p6k.js:200`](../src/grades/p6/p6k.js#L200) |
| `Q.k7Count` | `{ shape, ask = 'ด้าน' }` | [`grades/p6/p6k.js:196`](../src/grades/p6/p6k.js#L196) |
| `Q.k7Is` | `{ fig, kind }` | [`grades/p6/p6k.js:188`](../src/grades/p6/p6k.js#L188) |
| `Q.k7Name` | `{ shape }` | [`grades/p6/p6k.js:192`](../src/grades/p6/p6k.js#L192) |
| `Q.l3Conv` | `{ from, to }` | [`grades/p3/p3l.js:69`](../src/grades/p3/p3l.js#L69) |
| `Q.l3Map` | `{ M, q, e, as }` | [`grades/p3/p3l.js:73`](../src/grades/p3/p3l.js#L73) |
| `Q.l3Place` | `{ it }` | [`grades/p3/p3l.js:87`](../src/grades/p3/p3l.js#L87) |
| `Q.l3Read` | `{ it }` | [`grades/p3/p3l.js:63`](../src/grades/p3/p3l.js#L63) |
| `Q.l3Set` | `{ it, mm }` | [`grades/p3/p3l.js:66`](../src/grades/p3/p3l.js#L66) |
| `Q.lCls` | `{ k }` | [`grades/p5/p5g.js:187`](../src/grades/p5/p5g.js#L187) |
| `Q.lenDiff` | `{ a, b, unit = 'cm', vis = 'none', word }` | [`engine/questions.js:1294`](../src/engine/questions.js#L1294) |
| `Q.lenExtreme` | `{ items, ask, unit, vis = 'len', max }` | [`engine/questions.js:1276`](../src/engine/questions.js#L1276) |
| `Q.lFig` | `{ q, figs, right, hint }` | [`grades/p5/p5g.js:210`](../src/grades/p5/p5g.js#L210) |
| `Q.lFind` | `{ k, v, j }` | [`grades/p5/p5g.js:193`](../src/grades/p5/p5g.js#L193) |
| `Q.lineAsk` | `{ names, ask, of, of2 }` | [`engine/questions.js:1036`](../src/engine/questions.js#L1036) |
| `Q.lineCalc` | `{ a, b, op = '+' }` | [`engine/questions.js:844`](../src/engine/questions.js#L844) |
| `Q.lineCompare` | `{ a, b: bb }` | [`engine/questions.js:821`](../src/engine/questions.js#L821) |
| `Q.lineSub` | `{ a, b }` | [`engine/questions.js:474`](../src/engine/questions.js#L474) |
| `Q.lIsPar` | `{ a, va, b, vb }` | [`grades/p5/p5g.js:202`](../src/grades/p5/p5g.js#L202) |
| `Q.lName` | `{ a, b }` | [`grades/p5/p5g.js:180`](../src/grades/p5/p5g.js#L180) |
| `Q.lTap` | `{ k, rel }` | [`grades/p5/p5g.js:171`](../src/grades/p5/p5g.js#L171) |
| `Q.makeTen` | `{ a }` | [`engine/questions.js:312`](../src/engine/questions.js#L312) |
| `Q.makeTen20` | `{ a, b }` | [`engine/questions.js:855`](../src/engine/questions.js#L855) |
| `Q.marbles` | `{ a, n }` | [`engine/questions.js:984`](../src/engine/questions.js#L984) |
| `Q.match1000` | `{ nums }` | [`engine/questions.js:589`](../src/engine/questions.js#L589) |
| `Q.match5` | `{ nums }` | [`engine/questions.js:708`](../src/engine/questions.js#L708) |
| `Q.matchDiffs` | `{ k = 3 } = {}` | [`engine/questions.js:524`](../src/engine/questions.js#L524) |
| `Q.matchFrames` | `{ nums }` | [`engine/questions.js:805`](../src/engine/questions.js#L805) |
| `Q.matchSums` | `{ n = 3 } = {}` | [`engine/questions.js:333`](../src/engine/questions.js#L333) |
| `Q.meterJudge` | `{ e, name, more }` | [`engine/questions.js:1314`](../src/engine/questions.js#L1314) |
| `Q.mnCount` | `{ list }` | [`grades/p3/p3m.js:66`](../src/grades/p3/p3m.js#L66) |
| `Q.mnExch` | `{ text, a, unit, fig }` | [`grades/p3/p3m.js:85`](../src/grades/p3/p3m.js#L85) |
| `Q.mnFromDot` | `{ s, e }` | [`grades/p3/p3m.js:82`](../src/grades/p3/p3m.js#L82) |
| `Q.mnPay` | `{ s, e, name }` | [`grades/p3/p3m.js:71`](../src/grades/p3/p3m.js#L71) |
| `Q.mnToDot` | `{ s }` | [`grades/p3/p3m.js:78`](../src/grades/p3/p3m.js#L78) |
| `Q.mtArr` | `{ r, c }` | [`grades/p2/p2x.js:156`](../src/grades/p2/p2x.js#L156) |
| `Q.mtCmp` | `{ l, r }` | [`grades/p2/p2x.js:208`](../src/grades/p2/p2x.js#L208) |
| `Q.mtCol` | `{ a, b }` | [`grades/p2/p2x.js:205`](../src/grades/p2/p2x.js#L205) |
| `Q.mtFact` | `{ a, b, e }` | [`grades/p2/p2x.js:165`](../src/grades/p2/p2x.js#L165) |
| `Q.mtFill` | `{ n, ks, blanks }` | [`grades/p2/p2x.js:173`](../src/grades/p2/p2x.js#L173) |
| `Q.mtPic` | `{ g, s, e, what, grp, unit }` | [`grades/p2/p2x.js:145`](../src/grades/p2/p2x.js#L145) |
| `Q.mtPop` | `{ facts }` | [`grades/p2/p2x.js:181`](../src/grades/p2/p2x.js#L181) |
| `Q.mtRep` | `{ n, k }` | [`grades/p2/p2x.js:150`](../src/grades/p2/p2x.js#L150) |
| `Q.mtSkip` | `{ n, k = 8, blanks }` | [`grades/p2/p2x.js:193`](../src/grades/p2/p2x.js#L193) |
| `Q.mtStory` | `{ text, a, b, unit, fig }` | [`grades/p2/p2x.js:219`](../src/grades/p2/p2x.js#L219) |
| `Q.mtSwap` | `{ a, b }` | [`grades/p2/p2x.js:160`](../src/grades/p2/p2x.js#L160) |
| `Q.mtTens` | `{ a, t }` | [`grades/p2/p2x.js:200`](../src/grades/p2/p2x.js#L200) |
| `Q.mtUnk` | `{ a, b, pos }` | [`grades/p2/p2x.js:214`](../src/grades/p2/p2x.js#L214) |
| `Q.numToWord` | `{ n, from = 'digit' }` | [`engine/questions.js:585`](../src/engine/questions.js#L585) |
| `Q.objSolid` | `{ obj, kind, name }` | [`engine/questions.js:1136`](../src/engine/questions.js#L1136) |
| `Q.p2build` | `{ cm }` | [`grades/p2/p2l.js:287`](../src/grades/p2/p2l.js#L287) |
| `Q.p2cmpWord` | `{ a, b, words, pre = '', hint }` | [`grades/p2/p2l.js:299`](../src/grades/p2/p2l.js#L299) |
| `Q.p2conv` | `{ cm, to }` | [`grades/p2/p2l.js:293`](../src/grades/p2/p2l.js#L293) |
| `Q.p2mapQ` | `{ M, q, a, opts }` | [`grades/p2/p2l.js:306`](../src/grades/p2/p2l.js#L306) |
| `Q.p2mcCol` | `{ a, b, op, text }` | [`grades/p2/p2l.js:311`](../src/grades/p2/p2l.js#L311) |
| `Q.p2mcStory` | `{ text, a, b, op, fig, why }` | [`grades/p2/p2l.js:317`](../src/grades/p2/p2l.js#L317) |
| `Q.p2rulCmp` | `{ a, b }` | [`grades/p2/p2l.js:258`](../src/grades/p2/p2l.js#L258) |
| `Q.p2rulLen` | `{ it }` | [`grades/p2/p2l.js:253`](../src/grades/p2/p2l.js#L253) |
| `Q.p2tool` | `{ task, ok, opts }` | [`grades/p2/p2l.js:249`](../src/grades/p2/p2l.js#L249) |
| `Q.p2wall` | `{ items, o, i, j, ask = 'h', words }` | [`grades/p2/p2l.js:266`](../src/grades/p2/p2l.js#L266) |
| `Q.p2wallTap` | `{ items, o, ask }` | [`grades/p2/p2l.js:277`](../src/grades/p2/p2l.js#L277) |
| `Q.p3colFill` | `{ a, b, op }` | [`grades/p3/p3b.js:16`](../src/grades/p3/p3b.js#L16) |
| `Q.p4Calc` | `{ expr }` | [`grades/p4/p4b.js:213`](../src/grades/p4/p4b.js#L213) |
| `Q.p4Div` | `{ D, k, fig, label }` | [`grades/p4/p4m.js:251`](../src/grades/p4/p4m.js#L251) |
| `Q.p4Num` | `{ fig, q, a, hint, say: sy, unit = '' }` | [`grades/p4/p4n.js:158`](../src/grades/p4/p4n.js#L158) |
| `Q.p4Pick` | `{ fig, q, opts, right, hint, say: sy, keep }` | [`grades/p4/p4n.js:154`](../src/grades/p4/p4n.js#L154) |
| `Q.p4Seq` | `{ text, cards }` | [`grades/p4/p4b.js:221`](../src/grades/p4/p4b.js#L221) |
| `Q.p4Steps` | `{ expr }` | [`grades/p4/p4o.js:65`](../src/grades/p4/p4o.js#L65) |
| `Q.p4StM` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p4/p4m.js:287`](../src/grades/p4/p4m.js#L287) |
| `Q.p4Story2` | `{ text, expr, wrong = [], unit = '', frac = false, dec = false }` | [`grades/p4/p4o.js:67`](../src/grades/p4/p4o.js#L67) |
| `Q.p4UnkM` | `st` | [`grades/p4/p4m.js:282`](../src/grades/p4/p4m.js#L282) |
| `Q.p6Fig` | `{ fig, q, opts, right, hint, say: sy }` | [`grades/p6/p6p.js:96`](../src/grades/p6/p6p.js#L96) |
| `Q.p6Num` | `{ q, a, unit = '', hint }` | [`grades/p6/p6p.js:93`](../src/grades/p6/p6p.js#L93) |
| `Q.patMake` | `{ unit, reps = 2, show = 1, palette }` | [`engine/questions.js:1188`](../src/engine/questions.js#L1188) |
| `Q.patMissing` | `{ seq, blank }` | [`engine/questions.js:1182`](../src/engine/questions.js#L1182) |
| `Q.patRule2` | `{ vals }` | [`engine/questions.js:1250`](../src/engine/questions.js#L1250) |
| `Q.pattern` | `{ start, step, len = 5, blank, hi = 1000 }` | [`engine/questions.js:640`](../src/engine/questions.js#L640) |
| `Q.patternRule` | `{ start, step, len = 4, hi = 1000 }` | [`engine/questions.js:645`](../src/engine/questions.js#L645) |
| `Q.patUnit` | `{ seq }` | [`engine/questions.js:1174`](../src/engine/questions.js#L1174) |
| `Q.pc3Count` | `{ S, c }` | [`grades/p3/p3c.js:51`](../src/grades/p3/p3c.js#L51) |
| `Q.pc3Tally` | `{ n, what }` | [`grades/p3/p3c.js:54`](../src/grades/p3/p3c.js#L54) |
| `Q.pc3TallyPick` | `{ n }` | [`grades/p3/p3c.js:56`](../src/grades/p3/p3c.js#L56) |
| `Q.pc3TFill` | `{ T, src, give = [] }` | [`grades/p3/p3c.js:66`](../src/grades/p3/p3c.js#L66) |
| `Q.pc3TNum` | `{ T, q, a, hint, unit, key }` | [`grades/p3/p3c.js:60`](../src/grades/p3/p3c.js#L60) |
| `Q.pc3TRead` | `{ T, i }` | [`grades/p3/p3c.js:58`](../src/grades/p3/p3c.js#L58) |
| `Q.pc3TTap` | `{ T, ask }` | [`grades/p3/p3c.js:62`](../src/grades/p3/p3c.js#L62) |
| `Q.pConv` | `{ kind, v, d = 100 }` | [`grades/p5/p5p.js:66`](../src/grades/p5/p5p.js#L66) |
| `Q.pFind` | `{ part, whole, text }` | [`grades/p5/p5p.js:88`](../src/grades/p5/p5p.js#L88) |
| `Q.pGrid` | `{ n }` | [`grades/p5/p5p.js:76`](../src/grades/p5/p5p.js#L76) |
| `Q.pickExpand2` | `{ n }` | [`engine/questions.js:1236`](../src/engine/questions.js#L1236) |
| `Q.pickExpand20` | `{ n }` | [`engine/questions.js:815`](../src/engine/questions.js#L815) |
| `Q.pickExpanded` | `{ n }` | [`engine/questions.js:614`](../src/engine/questions.js#L614) |
| `Q.pickExpanded5` | `{ n }` | [`engine/questions.js:740`](../src/engine/questions.js#L740) |
| `Q.pickStory` | `{ a, b, op, stories }` | [`engine/questions.js:900`](../src/engine/questions.js#L900) |
| `Q.place2` | `{ n, pos }` | [`engine/questions.js:1224`](../src/engine/questions.js#L1224) |
| `Q.pOf` | `{ p, n, text, unit = '' }` | [`grades/p5/p5p.js:81`](../src/grades/p5/p5p.js#L81) |
| `Q.ppBuild` | `{ D }` | [`grades/p2/p2c.js:70`](../src/grades/p2/p2c.js#L70) |
| `Q.ppChoose` | `{ D, q, opts, right, hint }` | [`grades/p2/p2c.js:66`](../src/grades/p2/p2c.js#L66) |
| `Q.pPL` | `{ text, cost, sell }` | [`grades/p5/p5p.js:95`](../src/grades/p5/p5p.js#L95) |
| `Q.ppNum` | `{ D, q, a, hint, unit }` | [`grades/p2/p2c.js:54`](../src/grades/p2/p2c.js#L54) |
| `Q.ppRead` | `{ D, i, q }` | [`grades/p2/p2c.js:49`](../src/grades/p2/p2c.js#L49) |
| `Q.ppTap` | `{ D, ask }` | [`grades/p2/p2c.js:59`](../src/grades/p2/p2c.js#L59) |
| `Q.r4Build` | `{ kind, w, hh, nm }` | [`grades/p4/p4r.js:224`](../src/grades/p4/p4r.js#L224) |
| `Q.r4Count` | `{ cells, unit, W, H }` | [`grades/p4/p4r.js:319`](../src/grades/p4/p4r.js#L319) |
| `Q.r4Cut` | `{ k, Wd, Hd, a, b, c, u }` | [`grades/p4/p4r.js:349`](../src/grades/p4/p4r.js#L349) |
| `Q.r4DiagNum` | `{ nm, d, ask }` | [`grades/p4/p4r.js:215`](../src/grades/p4/p4r.js#L215) |
| `Q.r4DrawDiag` | `{ k, nm }` | [`grades/p4/p4r.js:196`](../src/grades/p4/p4r.js#L196) |
| `Q.r4Duel` | `{ a, b, ask }` | [`grades/p4/p4r.js:345`](../src/grades/p4/p4r.js#L345) |
| `Q.r4Est` | `{ W, H, c }` | [`grades/p4/p4r.js:339`](../src/grades/p4/p4r.js#L339) |
| `Q.r4Fence` | `{ P, A, u = 'ม.', place = '' }` | [`grades/p4/p4r.js:305`](../src/grades/p4/p4r.js#L305) |
| `Q.r4Geo` | `{ kind, w, hh, nm }` | [`grades/p4/p4r.js:272`](../src/grades/p4/p4r.js#L272) |
| `Q.r4Kind` | `{ k, nm, w, hh }` | [`grades/p4/p4r.js:183`](../src/grades/p4/p4r.js#L183) |
| `Q.r4Paint` | `{ n, rect }` | [`grades/p4/p4r.js:326`](../src/grades/p4/p4r.js#L326) |
| `Q.r4Pick` | `{ ks, want }` | [`grades/p4/p4r.js:172`](../src/grades/p4/p4r.js#L172) |
| `Q.r4TapDiag` | `{ k, nm }` | [`grades/p4/p4r.js:188`](../src/grades/p4/p4r.js#L188) |
| `Q.r4Walk` | `{ U, L, u, sig }` | [`grades/p4/p4r.js:290`](../src/grades/p4/p4r.js#L290) |
| `Q.raceAsk` | `{ racers, ask, k, who }` | [`engine/questions.js:1062`](../src/engine/questions.js#L1062) |
| `Q.rankAsk` | `{ items, unit, ask, k, who, pic }` | [`engine/questions.js:1075`](../src/engine/questions.js#L1075) |
| `Q.readScale` | `{ a, v, unit = 'kg', col }` | [`engine/questions.js:996`](../src/engine/questions.js#L996) |
| `Q.readWords` | `{ n, from = 'digit' }` | [`engine/questions.js:690`](../src/engine/questions.js#L690) |
| `Q.robotCount` | `{ kind }` | [`engine/questions.js:1169`](../src/engine/questions.js#L1169) |
| `Q.rulerSet` | `{ len, col = 'mint', kind = 'straw', max = 10 }` | [`engine/questions.js:1301`](../src/engine/questions.js#L1301) |
| `Q.s2build` | `{ text, nums, res }` | [`grades/p2/p2m.js:47`](../src/grades/p2/p2m.js#L47) |
| `Q.s2two` | `{ expr }` | [`grades/p2/p2m.js:43`](../src/grades/p2/p2m.js#L43) |
| `Q.s6Next` | `{ seq, hint }` | [`grades/p6/p6s.js:91`](../src/grades/p6/p6s.js#L91) |
| `Q.s6PatN` | `{ kind, n }` | [`grades/p6/p6s.js:97`](../src/grades/p6/p6s.js#L97) |
| `Q.s6Seq` | `{ seq, blanks, hint }` | [`grades/p6/p6s.js:81`](../src/grades/p6/p6s.js#L81) |
| `Q.s9Num` | `{ fig, q, a, unit = '', hint }` | [`grades/p6/p6m.js:388`](../src/grades/p6/p6m.js#L388) |
| `Q.sameSum` | `{ a, b }` | [`engine/questions.js:353`](../src/engine/questions.js#L353) |
| `Q.scalesCmp` | `{ a, b, va, vb, unit = 'kg', diff = false }` | [`engine/questions.js:1009`](../src/engine/questions.js#L1009) |
| `Q.scalesExtreme` | `{ items, unit = 'kg', which = 'max' }` | [`engine/questions.js:1019`](../src/engine/questions.js#L1019) |
| `Q.seqBlank` | `{ vals, blank }` | [`engine/questions.js:1257`](../src/engine/questions.js#L1257) |
| `Q.seqFill` | `{ vals, blank, step }` | [`engine/questions.js:772`](../src/engine/questions.js#L772) |
| `Q.seqRule` | `{ vals }` | [`engine/questions.js:777`](../src/engine/questions.js#L777) |
| `Q.setScale` | `{ a, v, unit = 'kg' }` | [`engine/questions.js:1002`](../src/engine/questions.js#L1002) |
| `Q.shapeClue` | `{ clue, kind }` | [`engine/questions.js:1152`](../src/engine/questions.js#L1152) |
| `Q.shapeName` | `{ v, rot = 0 }` | [`engine/questions.js:1141`](../src/engine/questions.js#L1141) |
| `Q.shelfAsk` | `{ rows, names, ask, r, c }` | [`engine/questions.js:1053`](../src/engine/questions.js#L1053) |
| `Q.sidesCorners` | `{ v, ask = 'sides', rot = 0 }` | [`engine/questions.js:1146`](../src/engine/questions.js#L1146) |
| `Q.solidName` | `{ v }` | [`engine/questions.js:1107`](../src/engine/questions.js#L1107) |
| `Q.sortEvenOdd` | `{ k = 6 } = {}` | [`engine/questions.js:636`](../src/engine/questions.js#L636) |
| `Q.story` | `{ text, a, b, unit, art: ar = 'apple', art2, ask, op = '+', pic = 'join' }` | [`engine/questions.js:358`](../src/engine/questions.js#L358) |
| `Q.story100` | `{ text, a, b, op, unit, bar }` | [`engine/questions.js:1417`](../src/engine/questions.js#L1417) |
| `Q.story20` | `{ text, a, b, op, unit }` | [`engine/questions.js:890`](../src/engine/questions.js#L890) |
| `Q.storyFor` | `{ a, b, op, stories }` | [`engine/questions.js:1429`](../src/engine/questions.js#L1429) |
| `Q.sub100` | `{ a, b, blocks = false }` | [`engine/questions.js:1366`](../src/engine/questions.js#L1366) |
| `Q.subCountOn` | `{ a, b }` | [`engine/questions.js:875`](../src/engine/questions.js#L875) |
| `Q.subFact` | `{ a, b, frame = false, vert = false, pen }` | [`engine/questions.js:424`](../src/engine/questions.js#L424) |
| `Q.subSteps` | `{ a, b }` | [`engine/questions.js:1373`](../src/engine/questions.js#L1373) |
| `Q.swap` | `{ a, b }` | [`engine/questions.js:347`](../src/engine/questions.js#L347) |
| `Q.syCount` | `{ f }` | [`grades/p3/p3s.js:181`](../src/grades/p3/p3s.js#L181) |
| `Q.syCut` | `{ c, rot = 0 }` | [`grades/p3/p3s.js:220`](../src/grades/p3/p3s.js#L220) |
| `Q.syDraw` | `D` | [`grades/p3/p3s.js:197`](../src/grades/p3/p3s.js#L197) |
| `Q.syFind` | `{ f }` | [`grades/p3/p3s.js:186`](../src/grades/p3/p3s.js#L186) |
| `Q.syIs` | `{ f, a }` | [`grades/p3/p3s.js:176`](../src/grades/p3/p3s.js#L176) |
| `Q.syPaint` | `D` | [`grades/p3/p3s.js:212`](../src/grades/p3/p3s.js#L212) |
| `Q.syPick` | `{ c, rot = 0 }` | [`grades/p3/p3s.js:194`](../src/grades/p3/p3s.js#L194) |
| `Q.syWhich` | `{ items, not }` | [`grades/p3/p3s.js:179`](../src/grades/p3/p3s.js#L179) |
| `Q.t3Conv` | `{ from, to }` | [`grades/p3/p3t.js:60`](../src/grades/p3/p3t.js#L60) |
| `Q.t3Dot` | `{ h: H, m, sep = '.' }` | [`grades/p3/p3t.js:46`](../src/grades/p3/p3t.js#L46) |
| `Q.t3DotPick` | `{ h: H, m, sep = '.' }` | [`grades/p3/p3t.js:49`](../src/grades/p3/p3t.js#L49) |
| `Q.t3Dur` | `{ what, h1, m1, h2, m2 }` | [`grades/p3/p3t.js:51`](../src/grades/p3/p3t.js#L51) |
| `Q.t3End` | `{ text, h1, m1, add, back }` | [`grades/p3/p3t.js:56`](../src/grades/p3/p3t.js#L56) |
| `Q.t3Read` | `{ h: H, m }` | [`grades/p3/p3t.js:39`](../src/grades/p3/p3t.js#L39) |
| `Q.t3Set` | `{ h: H, m }` | [`grades/p3/p3t.js:42`](../src/grades/p3/p3t.js#L42) |
| `Q.t4Cmp` | `{ A, B }` | [`grades/p4/p4t.js:92`](../src/grades/p4/p4t.js#L92) |
| `Q.t4Conv` | `{ from, to }` | [`grades/p4/p4t.js:76`](../src/grades/p4/p4t.js#L76) |
| `Q.t4Diff` | `{ text, A, B, units }` | [`grades/p4/p4t.js:96`](../src/grades/p4/p4t.js#L96) |
| `Q.t4Span` | `{ text, d1, h1, d2, h2, mon }` | [`grades/p4/p4t.js:83`](../src/grades/p4/p4t.js#L83) |
| `Q.t4Story` | `{ text, how, opts, ans, units, pre, work }` | [`grades/p4/p4t.js:105`](../src/grades/p4/p4t.js#L105) |
| `Q.t4Tab` | `{ T, q, opts, right, hint }` | [`grades/p4/p4t.js:100`](../src/grades/p4/p4t.js#L100) |
| `Q.t4TabDur` | `{ T, i }` | [`grades/p4/p4t.js:101`](../src/grades/p4/p4t.js#L101) |
| `Q.t4YM` | `{ text, a, b }` | [`grades/p4/p4t.js:88`](../src/grades/p4/p4t.js#L88) |
| `Q.t6Cls` | `{ B, C, by }` | [`grades/p6/p6t.js:235`](../src/grades/p6/p6t.js#L235) |
| `Q.t6Con` | `{ kind, v }` | [`grades/p6/p6t.js:158`](../src/grades/p6/p6t.js#L158) |
| `Q.t6Find` | `{ B, C, ask = 0, names = ['ก', 'ข', 'ค'] }` | [`grades/p6/p6t.js:251`](../src/grades/p6/p6t.js#L251) |
| `Q.t6Num` | `{ fig, q, a, unit, hint }` | [`grades/p6/p6t.js:257`](../src/grades/p6/p6t.js#L257) |
| `Q.t6Part` | `{ B, C, base, ask }` | [`grades/p6/p6t.js:242`](../src/grades/p6/p6t.js#L242) |
| `Q.tallerWord` | `{ a, b }` | [`engine/questions.js:1283`](../src/engine/questions.js#L1283) |
| `Q.tallyMake` | `{ n, label }` | [`engine/questions.js:963`](../src/engine/questions.js#L963) |
| `Q.tallyRead` | `{ n, label }` | [`engine/questions.js:959`](../src/engine/questions.js#L959) |
| `Q.tapKind` | `{ items, kind, mode = 'solid' }` | [`engine/questions.js:1113`](../src/engine/questions.js#L1113) |
| `Q.tCan` | `{ text, can, why }` | [`grades/p5/p5r.js:146`](../src/grades/p5/p5r.js#L146) |
| `Q.tCheaper` | `{ item, unit, A, B, nA = 'ร้านขายดี', nB = 'ร้านสะดวกซื้อ' }` | [`grades/p5/p5r.js:153`](../src/grades/p5/p5r.js#L153) |
| `Q.tensRead` | `{ n, ask = 'digit' }` | [`engine/questions.js:1211`](../src/engine/questions.js#L1211) |
| `Q.tenSub` | `{ a, b }` | [`engine/questions.js:491`](../src/engine/questions.js#L491) |
| `Q.three` | `{ nums, op = '+' }` | [`engine/questions.js:868`](../src/engine/questions.js#L868) |
| `Q.tkCalQ` | `{ m, y, marks, q, a, opts, num, unit = '', hint }` | [`grades/p2/p2t.js:152`](../src/grades/p2/p2t.js#L152) |
| `Q.tkDigPick` | `{ h: H, m }` | [`grades/p2/p2t.js:182`](../src/grades/p2/p2t.js#L182) |
| `Q.tkDigRead` | `{ h: H, m }` | [`grades/p2/p2t.js:177`](../src/grades/p2/p2t.js#L177) |
| `Q.tkElapsed` | `{ h1, m1 = 0, h2, m2 = 0, mode, what, clocks = true }` | [`grades/p2/p2t.js:188`](../src/grades/p2/p2t.js#L188) |
| `Q.tkEnd` | `{ text, h1, m1 = 0, add }` | [`grades/p2/p2t.js:196`](../src/grades/p2/p2t.js#L196) |
| `Q.tkRead` | `{ h: H, m = 0, ask = 'hm', sky = true }` | [`grades/p2/p2t.js:158`](../src/grades/p2/p2t.js#L158) |
| `Q.tkSet` | `{ h: H, m = 0 }` | [`grades/p2/p2t.js:169`](../src/grades/p2/p2t.js#L169) |
| `Q.tkStory` | `{ text, sent, wrong, a, unit, duo }` | [`grades/p2/p2t.js:202`](../src/grades/p2/p2t.js#L202) |
| `Q.tkTwoNames` | `{ k }` | [`grades/p2/p2t.js:164`](../src/grades/p2/p2t.js#L164) |
| `Q.tMoreLess` | `{ r1, r2, v, unit, more }` | [`grades/p5/p5r.js:137`](../src/grades/p5/p5r.js#L137) |
| `Q.toThai` | `{ n }` | [`engine/questions.js:697`](../src/engine/questions.js#L697) |
| `Q.traceShape` | `{ v, obj, name }` | [`engine/questions.js:1156`](../src/engine/questions.js#L1156) |
| `Q.traceWhat` | `{ obj, name, kind }` | [`engine/questions.js:1164`](../src/engine/questions.js#L1164) |
| `Q.truth` | `{ text, ok, hint }` | [`engine/questions.js:703`](../src/engine/questions.js#L703) |
| `Q.tSolve` | `{ text, a, b, c, unit, round, plain }` | [`grades/p5/p5r.js:116`](../src/grades/p5/p5r.js#L116) |
| `Q.tTable` | `{ k1, u1, k2, u2, a, b, c }` | [`grades/p5/p5r.js:129`](../src/grades/p5/p5r.js#L129) |
| `Q.unitCount` | `{ item, unit, vis = 'len', max }` | [`engine/questions.js:1289`](../src/engine/questions.js#L1289) |
| `Q.unitPick` | `{ name, e, m }` | [`engine/questions.js:1319`](../src/engine/questions.js#L1319) |
| `Q.unknown20` | `{ t }` | [`engine/questions.js:881`](../src/engine/questions.js#L881) |
| `Q.v3Conv` | `{ from, to }` | [`grades/p3/p3v.js:93`](../src/grades/p3/p3v.js#L93) |
| `Q.v3Read` | `{ cap, ml, col = 'water', name, kind = 'jug' }` | [`grades/p3/p3v.js:78`](../src/grades/p3/p3v.js#L78) |
| `Q.v3Set` | `{ cap, ml, col = 'water', name }` | [`grades/p3/p3v.js:82`](../src/grades/p3/p3v.js#L82) |
| `Q.v3Tool` | `{ name, ml }` | [`grades/p3/p3v.js:86`](../src/grades/p3/p3v.js#L86) |
| `Q.v3Unit` | `{ text, right }` | [`grades/p3/p3v.js:89`](../src/grades/p3/p3v.js#L89) |
| `Q.vertAdd` | `{ a, b }` | [`engine/questions.js:1348`](../src/engine/questions.js#L1348) |
| `Q.vertSub` | `{ a, b }` | [`engine/questions.js:1386`](../src/engine/questions.js#L1386) |
| `Q.vFill` | `{ kind, cap, target, name, col }` | [`grades/p2/p2v.js:106`](../src/grades/p2/p2v.js#L106) |
| `Q.vPour` | `{ src, srcName, n, cup, cupName, col, dry }` | [`grades/p2/p2v.js:95`](../src/grades/p2/p2v.js#L95) |
| `Q.vRead` | `{ kind, cap, v, name, col }` | [`grades/p2/p2v.js:101`](../src/grades/p2/p2v.js#L101) |
| `Q.vWord` | `{ text, right, fig }` | [`grades/p2/p2v.js:114`](../src/grades/p2/p2v.js#L114) |
| `Q.w2Body` | `{ txt }` | [`grades/p2/p2w.js:147`](../src/grades/p2/p2w.js#L147) |
| `Q.w2Calc` | `{ a, b, op, m = 'kd', text }` | [`grades/p2/p2w.js:157`](../src/grades/p2/p2w.js#L157) |
| `Q.w2Conv` | `{ g, from, to, name }` | [`grades/p2/p2w.js:151`](../src/grades/p2/p2w.js#L151) |
| `Q.w2Read` | `{ e, name, g, kind = 'kd', m }` | [`grades/p2/p2w.js:137`](../src/grades/p2/p2w.js#L137) |
| `Q.w2Set` | `{ e, name, g, kind = 'kd', m }` | [`grades/p2/p2w.js:143`](../src/grades/p2/p2w.js#L143) |
| `Q.w2Story` | `{ text, a, b, op, m = 'kd', why }` | [`grades/p2/p2w.js:162`](../src/grades/p2/p2w.js#L162) |
| `Q.w3Calc` | `{ a, b, op, m }` | [`grades/p3/p3w.js:135`](../src/grades/p3/p3w.js#L135) |
| `Q.w3Conv` | `{ from, to }` | [`grades/p3/p3w.js:129`](../src/grades/p3/p3w.js#L129) |
| `Q.w3Dig` | `{ g, m = 'kg', name, e }` | [`grades/p3/p3w.js:115`](../src/grades/p3/p3w.js#L115) |
| `Q.w3Story` | `{ text, sent, wrong, g, m, unit }` | [`grades/p3/p3w.js:142`](../src/grades/p3/p3w.js#L142) |
| `Q.w3Tool` | `{ name, kg, e }` | [`grades/p3/p3w.js:120`](../src/grades/p3/p3w.js#L120) |
| `Q.w3Unit` | `{ text, right }` | [`grades/p3/p3w.js:124`](../src/grades/p3/p3w.js#L124) |
| `Q.whichPlace` | `{ n }` | [`engine/questions.js:604`](../src/engine/questions.js#L604) |
| `Q.wordToNum` | `{ n }` | [`engine/questions.js:582`](../src/engine/questions.js#L582) |
| `Q.writeDigits` | `{ n, from = 'word' }` | [`engine/questions.js:684`](../src/engine/questions.js#L684) |
| `Q.x3Cmp` | `{ L, R }` | [`grades/p3/p3x.js:48`](../src/grades/p3/p3x.js#L48) |
| `Q.x3Fill` | `{ tpl, res, pool }` | [`grades/p3/p3x.js:46`](../src/grades/p3/p3x.js#L46) |
| `Q.x3Make` | `{ s, parts, ask }` | [`grades/p3/p3x.js:51`](../src/grades/p3/p3x.js#L51) |
| `Q.x3Story` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p3/p3x.js:70`](../src/grades/p3/p3x.js#L70) |
