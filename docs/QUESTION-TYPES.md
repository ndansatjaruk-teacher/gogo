# ชนิดคำถาม (Question types)

สร้างอัตโนมัติด้วย `python3 tools/catalog.py` — อย่าแก้ไฟล์นี้ด้วยมือ (generated; do not edit by hand).

ทุกชนิดคืนค่าเป็น object คำถาม `{ prompt, say, mount(bd, ctx) … }` ใช้ในฟังก์ชัน `game` ของด่าน · ก่อนสร้างชนิดใหม่ ให้หาในตารางนี้ก่อนว่ามีของเดิมใช้ได้ไหม

461 types

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
| `Q.abacusRead` | `{ n, ask = 'digit', rods }` | [`engine/questions.js:694`](../src/engine/questions.js#L694) |
| `Q.add100` | `{ a, b, blocks = false }` | [`engine/questions.js:1410`](../src/engine/questions.js#L1410) |
| `Q.addFact` | `{ a, b, frame = false, pen, vert = false }` | [`engine/questions.js:283`](../src/engine/questions.js#L283) |
| `Q.addSteps` | `{ a, b }` | [`engine/questions.js:1416`](../src/engine/questions.js#L1416) |
| `Q.arrange` | `{ clues, answer, slotLabel }` | [`engine/questions.js:1163`](../src/engine/questions.js#L1163) |
| `Q.b3Story` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p3/p3b.js:23`](../src/grades/p3/p3b.js#L23) |
| `Q.b3Unk` | `st` | [`grades/p3/p3b.js:28`](../src/grades/p3/p3b.js#L28) |
| `Q.balanceCmp` | `{ a, b, rel }` | [`engine/questions.js:1056`](../src/engine/questions.js#L1056) |
| `Q.basketCount` | `{ e, name, n, unit = 'ผล' }` | [`engine/questions.js:1299`](../src/engine/questions.js#L1299) |
| `Q.between` | `{ lo, hi }` | [`engine/questions.js:787`](../src/engine/questions.js#L787) |
| `Q.blocksRead` | `{ n, ask = 'digit' }` | [`engine/questions.js:592`](../src/engine/questions.js#L592) |
| `Q.buildChart` | `{ chart: c, from = 'mix' }` | [`engine/questions.js:1030`](../src/engine/questions.js#L1030) |
| `Q.busAsk` | `{ names, k }` | [`engine/questions.js:1149`](../src/engine/questions.js#L1149) |
| `Q.c8Pick` | `{ fig, q, opts, right, hint, keep }` | [`grades/p6/p6o.js:138`](../src/grades/p6/p6o.js#L138) |
| `Q.chartAsk` | `{ chart: c, ask, a = 0, b = 1, k = 3 }` | [`engine/questions.js:994`](../src/engine/questions.js#L994) |
| `Q.cmp2` | `{ a, b: bb, blocks = false }` | [`engine/questions.js:1321`](../src/engine/questions.js#L1321) |
| `Q.cmpDiff` | `{ a, b, unit = 'cm' }` | [`app/lessons.js:1809`](../src/app/lessons.js#L1809) |
| `Q.cnsQ` | `T, q` | [`grades/p5/p5q.js:571`](../src/grades/p5/p5q.js#L571) |
| `Q.colW` | `{ nums, op, prompt, say, sig, plain, ...rest }` | [`engine/colw.js:91`](../src/engine/colw.js#L91) |
| `Q.compare5` | `{ a, b: bb, ea, eb, eq = true }` | [`engine/questions.js:776`](../src/engine/questions.js#L776) |
| `Q.compareSym` | `{ a, b: bb, blocks = false }` | [`engine/questions.js:643`](../src/engine/questions.js#L643) |
| `Q.countFrom` | `{ a, b }` | [`engine/questions.js:921`](../src/engine/questions.js#L921) |
| `Q.countKind` | `{ items, kind, mode = 'solid', art: isArt }` | [`engine/questions.js:1210`](../src/engine/questions.js#L1210) |
| `Q.countOnAdd` | `{ a, b }` | [`engine/questions.js:858`](../src/engine/questions.js#L858) |
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
| `Q.digitPlace` | `{ n, i }` | [`engine/questions.js:749`](../src/engine/questions.js#L749) |
| `Q.digitValue` | `{ n, i, underline = false }` | [`engine/questions.js:739`](../src/engine/questions.js#L739) |
| `Q.dMatch` | `{ pairs }` | [`grades/p5/p5d.js:89`](../src/grades/p5/p5d.js#L89) |
| `Q.dMiss` | `{ a, res, op = '×' }` | [`grades/p5/p5d.js:134`](../src/grades/p5/p5d.js#L134) |
| `Q.dPick` | `{ q, opts, right, hint, say: sy, keep }` | [`grades/p5/p5d.js:103`](../src/grades/p5/p5d.js#L103) |
| `Q.dPoint` | `{ a, b }` | [`grades/p5/p5d.js:115`](../src/grades/p5/p5d.js#L115) |
| `Q.drawSum` | `{ a, b }` | [`engine/questions.js:273`](../src/engine/questions.js#L273) |
| `Q.dRound` | `{ x, p, line = false }` | [`grades/p5/p5d.js:95`](../src/grades/p5/p5d.js#L95) |
| `Q.dStory` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p5/p5d.js:149`](../src/grades/p5/p5d.js#L149) |
| `Q.dvCmp` | `{ l, r }` | [`grades/p2/p2d.js:177`](../src/grades/p2/p2d.js#L177) |
| `Q.dvCtr` | `{ n, d }` | [`grades/p2/p2d.js:141`](../src/grades/p2/p2d.js#L141) |
| `Q.dvExactPic` | `{ n, d }` | [`grades/p2/p2d.js:200`](../src/grades/p2/p2d.js#L200) |
| `Q.dvFact` | `{ n, d }` | [`grades/p2/p2d.js:147`](../src/grades/p2/p2d.js#L147) |
| `Q.dvFam` | `{ a, b }` | [`grades/p2/p2d.js:154`](../src/grades/p2/p2d.js#L154) |
| `Q.dvPic` | `{ n, d, e, what, box, unit, mode }` | [`grades/p2/p2d.js:135`](../src/grades/p2/p2d.js#L135) |
| `Q.dvPop` | `{ facts }` | [`grades/p2/p2d.js:161`](../src/grades/p2/p2d.js#L161) |
| `Q.dvRem` | `{ n, d, e }` | [`grades/p2/p2d.js:172`](../src/grades/p2/p2d.js#L172) |
| `Q.dvStory` | `{ text, n, d, unit, unit2, fig }` | [`grades/p2/p2d.js:192`](../src/grades/p2/p2d.js#L192) |
| `Q.dvUnk` | `{ a, b, c, pos }` | [`grades/p2/p2d.js:183`](../src/grades/p2/p2d.js#L183) |
| `Q.e3N` | `{ q, expr, a, unit, hint, sig, base, diff }` | [`grades/m1/m1e.js:22`](../src/grades/m1/m1e.js#L22) |
| `Q.e3O` | `{ q, expr, opts, right, hint, sig, base, diff }` | [`grades/m1/m1e.js:25`](../src/grades/m1/m1e.js#L25) |
| `Q.e4Col` | `{ a, b, op }` | [`grades/p4/p4e.js:100`](../src/grades/p4/p4e.js#L100) |
| `Q.e4Exp` | `{ s }` | [`grades/p4/p4e.js:131`](../src/grades/p4/p4e.js#L131) |
| `Q.e4Frac` | `{ s }` | [`grades/p4/p4e.js:118`](../src/grades/p4/p4e.js#L118) |
| `Q.e4Mix` | `{ expr }` | [`grades/p4/p4e.js:103`](../src/grades/p4/p4e.js#L103) |
| `Q.e4Pic` | `{ n, unit }` | [`grades/p4/p4e.js:115`](../src/grades/p4/p4e.js#L115) |
| `Q.e4Place` | `{ s, pos }` | [`grades/p4/p4e.js:127`](../src/grades/p4/p4e.js#L127) |
| `Q.e4Read` | `{ s, to }` | [`grades/p4/p4e.js:121`](../src/grades/p4/p4e.js#L121) |
| `Q.estimate1kg` | `{ a, heavy }` | [`engine/questions.js:1068`](../src/engine/questions.js#L1068) |
| `Q.evenOdd` | `{ n }` | [`engine/questions.js:655`](../src/engine/questions.js#L655) |
| `Q.expand20` | `{ n, miss = 'u' }` | [`engine/questions.js:832`](../src/engine/questions.js#L832) |
| `Q.expanded5` | `{ n, miss }` | [`engine/questions.js:756`](../src/engine/questions.js#L756) |
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
| `Q.family` | `{ a, b }` | [`engine/questions.js:467`](../src/engine/questions.js#L467) |
| `Q.fCalc` | `{ expr, vis, hint }` | [`grades/p5/p5.js:190`](../src/grades/p5/p5.js#L190) |
| `Q.fCmp` | `{ a, b, bars = false, hint }` | [`grades/p5/p5.js:163`](../src/grades/p5/p5.js#L163) |
| `Q.fEquiv` | `{ a, D }` | [`grades/p5/p5.js:231`](../src/grades/p5/p5.js#L231) |
| `Q.fFirst` | `{ expr }` | [`grades/p5/p5.js:223`](../src/grades/p5/p5.js#L223) |
| `Q.fHalf` | `{ a }` | [`grades/p5/p5.js:157`](../src/grades/p5/p5.js#L157) |
| `Q.fillFrames` | `{ n }` | [`engine/questions.js:822`](../src/engine/questions.js#L822) |
| `Q.findDiff` | `{ n = 2 } = {}` | [`engine/questions.js:522`](../src/engine/questions.js#L522) |
| `Q.findTens` | | [`engine/questions.js:319`](../src/engine/questions.js#L319) |
| `Q.findX` | `{ toks }` | [`engine/questions.js:1484`](../src/engine/questions.js#L1484) |
| `Q.fOf` | `{ f, n, e = 'coin', unit = '' }` | [`grades/p5/p5.js:201`](../src/grades/p5/p5.js#L201) |
| `Q.fOrder` | `{ list, dir = 'asc' }` | [`grades/p5/p5.js:181`](../src/grades/p5/p5.js#L181) |
| `Q.fPick` | `{ q, opts, right, hint }` | [`grades/p5/p5.js:177`](../src/grades/p5/p5.js#L177) |
| `Q.frames20` | `{ n, pen }` | [`engine/questions.js:817`](../src/engine/questions.js#L817) |
| `Q.fRecip` | `{ f }` | [`grades/p5/p5.js:207`](../src/grades/p5/p5.js#L207) |
| `Q.fromExpanded` | `{ n }` | [`engine/questions.js:770`](../src/engine/questions.js#L770) |
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
| `Q.gridAsk` | `{ rows, ask, of }` | [`engine/questions.js:1124`](../src/engine/questions.js#L1124) |
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
| `Q.hundredFill` | `{ cells, show, q }` | [`engine/questions.js:1343`](../src/engine/questions.js#L1343) |
| `Q.isAddition` | | [`engine/questions.js:380`](../src/engine/questions.js#L380) |
| `Q.isSubtraction` | | [`engine/questions.js:540`](../src/engine/questions.js#L540) |
| `Q.ixGroup` | `{ q, say: sy, bins, items, hint }` | [`engine/ix.js:45`](../src/engine/ix.js#L45) |
| `Q.ixMatch` | `{ q, say: sy, pairs, hint, wide, rows }` | [`engine/ix.js:11`](../src/engine/ix.js#L11) |
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
| `Q.lenDiff` | `{ a, b, unit = 'cm', vis = 'none', word }` | [`engine/questions.js:1374`](../src/engine/questions.js#L1374) |
| `Q.lenExtreme` | `{ items, ask, unit, vis = 'len', max }` | [`engine/questions.js:1356`](../src/engine/questions.js#L1356) |
| `Q.lenGuess` | `{ e, name, cm, opts }` | [`app/lessons.js:1791`](../src/app/lessons.js#L1791) |
| `Q.lFig` | `{ q, figs, right, hint }` | [`grades/p5/p5g.js:210`](../src/grades/p5/p5g.js#L210) |
| `Q.lFind` | `{ k, v, j }` | [`grades/p5/p5g.js:193`](../src/grades/p5/p5g.js#L193) |
| `Q.lineAsk` | `{ names, ask, of, of2 }` | [`engine/questions.js:1115`](../src/engine/questions.js#L1115) |
| `Q.lineCalc` | `{ a, b, op = '+' }` | [`engine/questions.js:866`](../src/engine/questions.js#L866) |
| `Q.lineCompare` | `{ a, b: bb }` | [`engine/questions.js:843`](../src/engine/questions.js#L843) |
| `Q.lineRead` | `{ a, b, op = '+' }` | [`engine/questions.js:943`](../src/engine/questions.js#L943) |
| `Q.lineSub` | `{ a, b }` | [`engine/questions.js:485`](../src/engine/questions.js#L485) |
| `Q.lIsPar` | `{ a, va, b, vb }` | [`grades/p5/p5g.js:202`](../src/grades/p5/p5g.js#L202) |
| `Q.lName` | `{ a, b }` | [`grades/p5/p5g.js:180`](../src/grades/p5/p5g.js#L180) |
| `Q.lTap` | `{ k, rel }` | [`grades/p5/p5g.js:171`](../src/grades/p5/p5g.js#L171) |
| `Q.m3Build` | `data` | [`grades/m3/m3s.js:350`](../src/grades/m3/m3s.js#L350) |
| `Q.m3FenceQ` | `data, side` | [`grades/m3/m3s.js:392`](../src/grades/m3/m3s.js#L392) |
| `Q.m3FreqQ` | `pairs, key` | [`grades/m3/m3s.js:383`](../src/grades/m3/m3s.js#L383) |
| `Q.m3HalfN` | `n` | [`grades/m3/m3s.js:366`](../src/grades/m3/m3s.js#L366) |
| `Q.m3HalfPick` | `data, up` | [`grades/m3/m3s.js:367`](../src/grades/m3/m3s.js#L367) |
| `Q.m3IqrQ` | `data, sorted` | [`grades/m3/m3s.js:388`](../src/grades/m3/m3s.js#L388) |
| `Q.m3Num` | `{ q, fig, tiles, sortFirst, a, unit, hint, sig, base, diff }` | [`grades/m3/m3s.js:358`](../src/grades/m3/m3s.js#L358) |
| `Q.m3Opt` | `{ q, fig, tiles, sortFirst, opts, right, hint, sig, base, diff }` | [`grades/m3/m3s.js:353`](../src/grades/m3/m3s.js#L353) |
| `Q.m3OutPick` | `data` | [`grades/m3/m3s.js:394`](../src/grades/m3/m3s.js#L394) |
| `Q.m3Pick` | `data` | [`grades/m3/m3s.js:345`](../src/grades/m3/m3s.js#L345) |
| `Q.m3PickT` | `F` | [`grades/m3/m3s.js:412`](../src/grades/m3/m3s.js#L412) |
| `Q.m3PosQ` | `n, k` | [`grades/m3/m3s.js:370`](../src/grades/m3/m3s.js#L370) |
| `Q.m3Q` | `{ data, k, sorted, med, ctx: tx }` | [`grades/m3/m3s.js:330`](../src/grades/m3/m3s.js#L330) |
| `Q.m3Read` | `{ F, ask, ctx: tx, vert }` | [`grades/m3/m3s.js:340`](../src/grades/m3/m3s.js#L340) |
| `Q.m3StemQ` | `data, key` | [`grades/m3/m3s.js:380`](../src/grades/m3/m3s.js#L380) |
| `Q.m3Tap` | `data, keys` | [`grades/m3/m3s.js:337`](../src/grades/m3/m3s.js#L337) |
| `Q.m3XQ` | `key` | [`grades/m3/m3s.js:376`](../src/grades/m3/m3s.js#L376) |
| `Q.makeTen` | `{ a }` | [`engine/questions.js:312`](../src/engine/questions.js#L312) |
| `Q.makeTen20` | `{ a, b }` | [`engine/questions.js:877`](../src/engine/questions.js#L877) |
| `Q.marbles` | `{ a, n }` | [`engine/questions.js:1063`](../src/engine/questions.js#L1063) |
| `Q.match1000` | `{ nums }` | [`engine/questions.js:611`](../src/engine/questions.js#L611) |
| `Q.match5` | `{ nums }` | [`engine/questions.js:730`](../src/engine/questions.js#L730) |
| `Q.matchDiffs` | `{ k = 3 } = {}` | [`engine/questions.js:535`](../src/engine/questions.js#L535) |
| `Q.matchFrames` | `{ nums }` | [`engine/questions.js:827`](../src/engine/questions.js#L827) |
| `Q.matchSums` | `{ n = 3 } = {}` | [`engine/questions.js:333`](../src/engine/questions.js#L333) |
| `Q.meterJudge` | `{ e, name, more }` | [`engine/questions.js:1394`](../src/engine/questions.js#L1394) |
| `Q.mgBuild` | `T, q` | [`grades/m1/geo/mg-quest.js:5`](../src/grades/m1/geo/mg-quest.js#L5) |
| `Q.mgFigs` | `{ q, figs, right, hint, sig }` | [`grades/m1/geo/mg-quest.js:15`](../src/grades/m1/geo/mg-quest.js#L15) |
| `Q.mgMeasure` | `{ deg, rot` | [`grades/m1/geo/mg-quest.js:8`](../src/grades/m1/geo/mg-quest.js#L8) |
| `Q.mgNum` | `{ q, fig, a, unit, hint, sig }` | [`grades/m1/geo/mg-quest.js:18`](../src/grades/m1/geo/mg-quest.js#L18) |
| `Q.mgPick` | `{ q, fig, opts, right, hint, sig }` | [`grades/m1/geo/mg-quest.js:12`](../src/grades/m1/geo/mg-quest.js#L12) |
| `Q.miAvg` | `{ text, nums, unit }` | [`grades/m1/m1i.js:388`](../src/grades/m1/m1i.js#L388) |
| `Q.miCalc` | `{ expr, hint, fig, q, unit }` | [`grades/m1/m1i.js:367`](../src/grades/m1/m1i.js#L367) |
| `Q.miChipQ` | `{ a, b }` | [`grades/m1/m1i.js:410`](../src/grades/m1/m1i.js#L410) |
| `Q.miCmp` | `{ a, b, la, lb }` | [`grades/m1/m1i.js:343`](../src/grades/m1/m1i.js#L343) |
| `Q.miCtx` | `{ text, a }` | [`grades/m1/m1i.js:327`](../src/grades/m1/m1i.js#L327) |
| `Q.miExt` | `{ nums, max = true, ctx: what }` | [`grades/m1/m1i.js:349`](../src/grades/m1/m1i.js#L349) |
| `Q.miGapQ` | `{ a, b, lo = -10, hi = 10 }` | [`grades/m1/m1i.js:402`](../src/grades/m1/m1i.js#L402) |
| `Q.miHopQ` | `{ a, b }` | [`grades/m1/m1i.js:382`](../src/grades/m1/m1i.js#L382) |
| `Q.miKind` | `{ n, lab }` | [`grades/m1/m1i.js:321`](../src/grades/m1/m1i.js#L321) |
| `Q.miMiss` | `{ expr, a, hint }` | [`grades/m1/m1i.js:421`](../src/grades/m1/m1i.js#L421) |
| `Q.miOpp` | `{ n }` | [`grades/m1/m1i.js:364`](../src/grades/m1/m1i.js#L364) |
| `Q.miOrder` | `{ nums, asc = true }` | [`grades/m1/m1i.js:355`](../src/grades/m1/m1i.js#L355) |
| `Q.miPick` | `{ q, opts, right, hint }` | [`grades/m1/m1i.js:416`](../src/grades/m1/m1i.js#L416) |
| `Q.miPlace` | `{ n, lo = -10, hi = 10 }` | [`grades/m1/m1i.js:337`](../src/grades/m1/m1i.js#L337) |
| `Q.miRead` | `{ n, lo = -10, hi = 10 }` | [`grades/m1/m1i.js:332`](../src/grades/m1/m1i.js#L332) |
| `Q.miSignQ` | `{ expr }` | [`grades/m1/m1i.js:426`](../src/grades/m1/m1i.js#L426) |
| `Q.miStory` | `{ text, expr, wrong, unit, hint }` | [`grades/m1/m1i.js:373`](../src/grades/m1/m1i.js#L373) |
| `Q.mJudge` | `{ e, name, cm, ori }` | [`app/lessons.js:1804`](../src/app/lessons.js#L1804) |
| `Q.mnCount` | `{ list }` | [`grades/p3/p3m.js:66`](../src/grades/p3/p3m.js#L66) |
| `Q.mnExch` | `{ text, a, unit, fig }` | [`grades/p3/p3m.js:85`](../src/grades/p3/p3m.js#L85) |
| `Q.mnFromDot` | `{ s, e }` | [`grades/p3/p3m.js:82`](../src/grades/p3/p3m.js#L82) |
| `Q.mnPay` | `{ s, e, name }` | [`grades/p3/p3m.js:71`](../src/grades/p3/p3m.js#L71) |
| `Q.mnToDot` | `{ s }` | [`grades/p3/p3m.js:78`](../src/grades/p3/p3m.js#L78) |
| `Q.mtArr` | `{ r, c }` | [`grades/p2/p2x.js:197`](../src/grades/p2/p2x.js#L197) |
| `Q.mtCmp` | `{ l, r }` | [`grades/p2/p2x.js:271`](../src/grades/p2/p2x.js#L271) |
| `Q.mtCol` | `{ a, b }` | [`grades/p2/p2x.js:268`](../src/grades/p2/p2x.js#L268) |
| `Q.mtFact` | `{ a, b, e }` | [`grades/p2/p2x.js:215`](../src/grades/p2/p2x.js#L215) |
| `Q.mtFill` | `{ n, ks, blanks }` | [`grades/p2/p2x.js:223`](../src/grades/p2/p2x.js#L223) |
| `Q.mtOne` | `{ a, b }` | [`grades/p2/p2x.js:243`](../src/grades/p2/p2x.js#L243) |
| `Q.mtPic` | `{ g, s, e, what, grp, unit }` | [`grades/p2/p2x.js:186`](../src/grades/p2/p2x.js#L186) |
| `Q.mtPop` | `{ facts }` | [`grades/p2/p2x.js:231`](../src/grades/p2/p2x.js#L231) |
| `Q.mtRep` | `{ n, k }` | [`grades/p2/p2x.js:191`](../src/grades/p2/p2x.js#L191) |
| `Q.mtRowTap` | `{ r, c }` | [`grades/p2/p2x.js:202`](../src/grades/p2/p2x.js#L202) |
| `Q.mtSkip` | `{ n, k = 8, blanks }` | [`grades/p2/p2x.js:256`](../src/grades/p2/p2x.js#L256) |
| `Q.mtStory` | `{ text, a, b, unit, fig }` | [`grades/p2/p2x.js:282`](../src/grades/p2/p2x.js#L282) |
| `Q.mtSwap` | `{ a, b }` | [`grades/p2/p2x.js:210`](../src/grades/p2/p2x.js#L210) |
| `Q.mtTens` | `{ a, t }` | [`grades/p2/p2x.js:263`](../src/grades/p2/p2x.js#L263) |
| `Q.mtUnk` | `{ a, b, pos }` | [`grades/p2/p2x.js:277`](../src/grades/p2/p2x.js#L277) |
| `Q.mUnit` | `{ e, name, cm, ori, m }` | [`app/lessons.js:1806`](../src/app/lessons.js#L1806) |
| `Q.numToWord` | `{ n, from = 'digit' }` | [`engine/questions.js:607`](../src/engine/questions.js#L607) |
| `Q.objSolid` | `{ obj, kind, name }` | [`engine/questions.js:1216`](../src/engine/questions.js#L1216) |
| `Q.p2build` | `{ cm }` | [`grades/p2/p2l.js:308`](../src/grades/p2/p2l.js#L308) |
| `Q.p2cmpWord` | `{ a, b, words, pre = '', hint }` | [`grades/p2/p2l.js:320`](../src/grades/p2/p2l.js#L320) |
| `Q.p2conv` | `{ cm, to }` | [`grades/p2/p2l.js:314`](../src/grades/p2/p2l.js#L314) |
| `Q.p2mapQ` | `{ M, q, a, opts }` | [`grades/p2/p2l.js:327`](../src/grades/p2/p2l.js#L327) |
| `Q.p2mcCol` | `{ a, b, op, text }` | [`grades/p2/p2l.js:332`](../src/grades/p2/p2l.js#L332) |
| `Q.p2mcStory` | `{ text, a, b, op, fig, why }` | [`grades/p2/p2l.js:336`](../src/grades/p2/p2l.js#L336) |
| `Q.p2rulCmp` | `{ a, b, max }` | [`grades/p2/p2l.js:279`](../src/grades/p2/p2l.js#L279) |
| `Q.p2rulLen` | `{ it, max }` | [`grades/p2/p2l.js:274`](../src/grades/p2/p2l.js#L274) |
| `Q.p2tool` | `{ task, ok, opts }` | [`grades/p2/p2l.js:270`](../src/grades/p2/p2l.js#L270) |
| `Q.p2wall` | `{ items, o, i, j, ask = 'h', words }` | [`grades/p2/p2l.js:287`](../src/grades/p2/p2l.js#L287) |
| `Q.p2wallTap` | `{ items, o, ask }` | [`grades/p2/p2l.js:298`](../src/grades/p2/p2l.js#L298) |
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
| `Q.patMake` | `{ unit, reps = 2, show = 1, palette }` | [`engine/questions.js:1268`](../src/engine/questions.js#L1268) |
| `Q.patMissing` | `{ seq, blank }` | [`engine/questions.js:1262`](../src/engine/questions.js#L1262) |
| `Q.patRule2` | `{ vals }` | [`engine/questions.js:1330`](../src/engine/questions.js#L1330) |
| `Q.pattern` | `{ start, step, len = 5, blank, hi = 1000 }` | [`engine/questions.js:662`](../src/engine/questions.js#L662) |
| `Q.patternRule` | `{ start, step, len = 4, hi = 1000 }` | [`engine/questions.js:667`](../src/engine/questions.js#L667) |
| `Q.patUnit` | `{ seq }` | [`engine/questions.js:1254`](../src/engine/questions.js#L1254) |
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
| `Q.pickExpand2` | `{ n }` | [`engine/questions.js:1316`](../src/engine/questions.js#L1316) |
| `Q.pickExpand20` | `{ n }` | [`engine/questions.js:837`](../src/engine/questions.js#L837) |
| `Q.pickExpanded` | `{ n }` | [`engine/questions.js:636`](../src/engine/questions.js#L636) |
| `Q.pickExpanded5` | `{ n }` | [`engine/questions.js:762`](../src/engine/questions.js#L762) |
| `Q.pickStory` | `{ a, b, op, stories }` | [`engine/questions.js:979`](../src/engine/questions.js#L979) |
| `Q.place2` | `{ n, pos }` | [`engine/questions.js:1304`](../src/engine/questions.js#L1304) |
| `Q.pOf` | `{ p, n, text, unit = '' }` | [`grades/p5/p5p.js:81`](../src/grades/p5/p5p.js#L81) |
| `Q.ppBuild` | `{ D }` | [`grades/p2/p2c.js:70`](../src/grades/p2/p2c.js#L70) |
| `Q.ppChoose` | `{ D, q, opts, right, hint }` | [`grades/p2/p2c.js:66`](../src/grades/p2/p2c.js#L66) |
| `Q.pPL` | `{ text, cost, sell }` | [`grades/p5/p5p.js:95`](../src/grades/p5/p5p.js#L95) |
| `Q.ppNum` | `{ D, q, a, hint, unit }` | [`grades/p2/p2c.js:54`](../src/grades/p2/p2c.js#L54) |
| `Q.ppRead` | `{ D, i, q }` | [`grades/p2/p2c.js:49`](../src/grades/p2/p2c.js#L49) |
| `Q.ppTap` | `{ D, ask }` | [`grades/p2/p2c.js:59`](../src/grades/p2/p2c.js#L59) |
| `Q.r4Build` | `{ kind, w, hh, nm }` | [`grades/p4/p4r.js:171`](../src/grades/p4/p4r.js#L171) |
| `Q.r4Count` | `{ cells, unit, W, H }` | [`grades/p4/p4r.js:266`](../src/grades/p4/p4r.js#L266) |
| `Q.r4Cut` | `{ k, Wd, Hd, a, b, c, u }` | [`grades/p4/p4r.js:296`](../src/grades/p4/p4r.js#L296) |
| `Q.r4DiagNum` | `{ nm, d, ask }` | [`grades/p4/p4r.js:162`](../src/grades/p4/p4r.js#L162) |
| `Q.r4DrawDiag` | `{ k, nm }` | [`grades/p4/p4r.js:143`](../src/grades/p4/p4r.js#L143) |
| `Q.r4Duel` | `{ a, b, ask }` | [`grades/p4/p4r.js:292`](../src/grades/p4/p4r.js#L292) |
| `Q.r4Est` | `{ W, H, c }` | [`grades/p4/p4r.js:286`](../src/grades/p4/p4r.js#L286) |
| `Q.r4Fence` | `{ P, A, u = 'ม.', place = '' }` | [`grades/p4/p4r.js:252`](../src/grades/p4/p4r.js#L252) |
| `Q.r4Geo` | `{ kind, w, hh, nm }` | [`grades/p4/p4r.js:219`](../src/grades/p4/p4r.js#L219) |
| `Q.r4Kind` | `{ k, nm, w, hh }` | [`grades/p4/p4r.js:130`](../src/grades/p4/p4r.js#L130) |
| `Q.r4Paint` | `{ n, rect }` | [`grades/p4/p4r.js:273`](../src/grades/p4/p4r.js#L273) |
| `Q.r4Pick` | `{ ks, want }` | [`grades/p4/p4r.js:119`](../src/grades/p4/p4r.js#L119) |
| `Q.r4TapDiag` | `{ k, nm }` | [`grades/p4/p4r.js:135`](../src/grades/p4/p4r.js#L135) |
| `Q.r4Walk` | `{ U, L, u, sig }` | [`grades/p4/p4r.js:237`](../src/grades/p4/p4r.js#L237) |
| `Q.raceAsk` | `{ racers, ask, k, who }` | [`engine/questions.js:1141`](../src/engine/questions.js#L1141) |
| `Q.rankAsk` | `{ items, unit, ask, k, who, pic }` | [`engine/questions.js:1154`](../src/engine/questions.js#L1154) |
| `Q.readScale` | `{ a, v, unit = 'kg', col }` | [`engine/questions.js:1075`](../src/engine/questions.js#L1075) |
| `Q.readWords` | `{ n, from = 'digit' }` | [`engine/questions.js:712`](../src/engine/questions.js#L712) |
| `Q.robotCount` | `{ kind }` | [`engine/questions.js:1249`](../src/engine/questions.js#L1249) |
| `Q.rpNum` | `{ story, q, fig, a, unit, hint, sig, base, cap, diff }` | [`grades/m1/m1r.js:78`](../src/grades/m1/m1r.js#L78) |
| `Q.rpOpt` | `{ story, q, fig, opts, right, hint, sig, base, cap, diff }` | [`grades/m1/m1r.js:75`](../src/grades/m1/m1r.js#L75) |
| `Q.rpRat` | `{ story, q, fig, a, mode, pre, hint, sig, base, cap, diff }` | [`grades/m1/m1r.js:80`](../src/grades/m1/m1r.js#L80) |
| `Q.rulDraw` | `{ len, k = 'straw', col = 'mint', name = 'หลอด', max = 12 }` | [`app/lessons.js:1781`](../src/app/lessons.js#L1781) |
| `Q.rulerSet` | `{ len, col = 'mint', kind = 'straw', max = 10 }` | [`engine/questions.js:1381`](../src/engine/questions.js#L1381) |
| `Q.s2build` | `{ text, nums, res }` | [`grades/p2/p2m.js:47`](../src/grades/p2/p2m.js#L47) |
| `Q.s2Num` | `{ q, fig, tiles, a, unit, hint, sig, base, diff }` | [`grades/m2/m2s.js:210`](../src/grades/m2/m2s.js#L210) |
| `Q.s2Opt` | `{ q, fig, tiles, opts, right, hint, sig, base, diff }` | [`grades/m2/m2s.js:207`](../src/grades/m2/m2s.js#L207) |
| `Q.s2two` | `{ expr }` | [`grades/p2/p2m.js:43`](../src/grades/p2/p2m.js#L43) |
| `Q.s6Next` | `{ seq, hint }` | [`grades/p6/p6s.js:91`](../src/grades/p6/p6s.js#L91) |
| `Q.s6PatN` | `{ kind, n }` | [`grades/p6/p6s.js:97`](../src/grades/p6/p6s.js#L97) |
| `Q.s6Seq` | `{ seq, blanks, hint }` | [`grades/p6/p6s.js:81`](../src/grades/p6/p6s.js#L81) |
| `Q.s9Num` | `{ fig, q, a, unit = '', hint }` | [`grades/p6/p6m.js:388`](../src/grades/p6/p6m.js#L388) |
| `Q.sameSum` | `{ a, b }` | [`engine/questions.js:353`](../src/engine/questions.js#L353) |
| `Q.scalesCmp` | `{ a, b, va, vb, unit = 'kg', diff = false }` | [`engine/questions.js:1088`](../src/engine/questions.js#L1088) |
| `Q.scalesExtreme` | `{ items, unit = 'kg', which = 'max' }` | [`engine/questions.js:1098`](../src/engine/questions.js#L1098) |
| `Q.seqBlank` | `{ vals, blank }` | [`engine/questions.js:1337`](../src/engine/questions.js#L1337) |
| `Q.seqFill` | `{ vals, blank, step }` | [`engine/questions.js:794`](../src/engine/questions.js#L794) |
| `Q.seqRule` | `{ vals }` | [`engine/questions.js:799`](../src/engine/questions.js#L799) |
| `Q.setScale` | `{ a, v, unit = 'kg' }` | [`engine/questions.js:1081`](../src/engine/questions.js#L1081) |
| `Q.shapeClue` | `{ clue, kind }` | [`engine/questions.js:1232`](../src/engine/questions.js#L1232) |
| `Q.shapeName` | `{ v, rot = 0 }` | [`engine/questions.js:1221`](../src/engine/questions.js#L1221) |
| `Q.shelfAsk` | `{ rows, names, ask, r, c }` | [`engine/questions.js:1132`](../src/engine/questions.js#L1132) |
| `Q.sidesCorners` | `{ v, ask = 'sides', rot = 0 }` | [`engine/questions.js:1226`](../src/engine/questions.js#L1226) |
| `Q.solidName` | `{ v }` | [`engine/questions.js:1187`](../src/engine/questions.js#L1187) |
| `Q.sortEvenOdd` | `{ k = 6 } = {}` | [`engine/questions.js:658`](../src/engine/questions.js#L658) |
| `Q.story` | `{ text, a, b, unit, art: ar = 'apple', art2, ask, op = '+', pic = 'join' }` | [`engine/questions.js:358`](../src/engine/questions.js#L358) |
| `Q.story100` | `{ text, a, b, op, unit, bar, lab }` | [`engine/questions.js:1497`](../src/engine/questions.js#L1497) |
| `Q.story20` | `{ text, a, b, op, unit }` | [`engine/questions.js:969`](../src/engine/questions.js#L969) |
| `Q.storyFor` | `{ a, b, op, stories }` | [`engine/questions.js:1509`](../src/engine/questions.js#L1509) |
| `Q.sub100` | `{ a, b, blocks = false }` | [`engine/questions.js:1446`](../src/engine/questions.js#L1446) |
| `Q.subCountOn` | `{ a, b }` | [`engine/questions.js:897`](../src/engine/questions.js#L897) |
| `Q.subFact` | `{ a, b, frame = false, vert = false, pen }` | [`engine/questions.js:435`](../src/engine/questions.js#L435) |
| `Q.subFrom` | `{ a, b }` | [`engine/questions.js:933`](../src/engine/questions.js#L933) |
| `Q.subSteps` | `{ a, b }` | [`engine/questions.js:1453`](../src/engine/questions.js#L1453) |
| `Q.swap` | `{ a, b }` | [`engine/questions.js:347`](../src/engine/questions.js#L347) |
| `Q.syCount` | `{ f }` | [`grades/p3/p3s.js:181`](../src/grades/p3/p3s.js#L181) |
| `Q.syCut` | `{ c, rot = 0 }` | [`grades/p3/p3s.js:220`](../src/grades/p3/p3s.js#L220) |
| `Q.syDraw` | `D` | [`grades/p3/p3s.js:197`](../src/grades/p3/p3s.js#L197) |
| `Q.syFind` | `{ f }` | [`grades/p3/p3s.js:186`](../src/grades/p3/p3s.js#L186) |
| `Q.syIs` | `{ f, a }` | [`grades/p3/p3s.js:176`](../src/grades/p3/p3s.js#L176) |
| `Q.syPaint` | `D` | [`grades/p3/p3s.js:212`](../src/grades/p3/p3s.js#L212) |
| `Q.syPick` | `{ c, rot = 0 }` | [`grades/p3/p3s.js:194`](../src/grades/p3/p3s.js#L194) |
| `Q.syWhich` | `{ items, not }` | [`grades/p3/p3s.js:179`](../src/grades/p3/p3s.js#L179) |
| `Q.t3Conv` | `{ from, to }` | [`grades/p3/p3t.js:49`](../src/grades/p3/p3t.js#L49) |
| `Q.t3Dot` | `{ h: H, m, sep = '.' }` | [`grades/p3/p3t.js:35`](../src/grades/p3/p3t.js#L35) |
| `Q.t3DotPick` | `{ h: H, m, sep = '.' }` | [`grades/p3/p3t.js:38`](../src/grades/p3/p3t.js#L38) |
| `Q.t3Dur` | `{ what, h1, m1, h2, m2 }` | [`grades/p3/p3t.js:40`](../src/grades/p3/p3t.js#L40) |
| `Q.t3End` | `{ text, h1, m1, add, back }` | [`grades/p3/p3t.js:45`](../src/grades/p3/p3t.js#L45) |
| `Q.t3Read` | `{ h: H, m }` | [`grades/p3/p3t.js:28`](../src/grades/p3/p3t.js#L28) |
| `Q.t3Set` | `{ h: H, m }` | [`grades/p3/p3t.js:31`](../src/grades/p3/p3t.js#L31) |
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
| `Q.tallerWord` | `{ a, b }` | [`engine/questions.js:1363`](../src/engine/questions.js#L1363) |
| `Q.tallyMake` | `{ n, label }` | [`engine/questions.js:1042`](../src/engine/questions.js#L1042) |
| `Q.tallyRead` | `{ n, label }` | [`engine/questions.js:1038`](../src/engine/questions.js#L1038) |
| `Q.tapKind` | `{ items, kind, mode = 'solid' }` | [`engine/questions.js:1193`](../src/engine/questions.js#L1193) |
| `Q.tCan` | `{ text, can, why }` | [`grades/p5/p5r.js:146`](../src/grades/p5/p5r.js#L146) |
| `Q.tCheaper` | `{ item, unit, A, B, nA = 'ร้านขายดี', nB = 'ร้านสะดวกซื้อ' }` | [`grades/p5/p5r.js:153`](../src/grades/p5/p5r.js#L153) |
| `Q.teamRank` | `{ teams, ask, k, who }` | [`app/lessons.js:1207`](../src/app/lessons.js#L1207) |
| `Q.teamSum` | `{ teams, i }` | [`app/lessons.js:1205`](../src/app/lessons.js#L1205) |
| `Q.tenEq` | `{ a, b }` | [`engine/questions.js:914`](../src/engine/questions.js#L914) |
| `Q.tenSplit` | `{ a, b }` | [`engine/questions.js:904`](../src/engine/questions.js#L904) |
| `Q.tensRead` | `{ n, ask = 'digit' }` | [`engine/questions.js:1291`](../src/engine/questions.js#L1291) |
| `Q.tenSub` | `{ a, b }` | [`engine/questions.js:502`](../src/engine/questions.js#L502) |
| `Q.tgNum` | `{ story, q, fig, a, unit, hint, sig, base, cap, diff }` | [`grades/m3/m3t.js:322`](../src/grades/m3/m3t.js#L322) |
| `Q.tgOpt` | `{ story, q, fig, opts, right, hint, sig, base, cap, diff }` | [`grades/m3/m3t.js:319`](../src/grades/m3/m3t.js#L319) |
| `Q.tgSide` | `{ q, tri, ask, hint, sig, diff }` | [`grades/m3/m3t.js:325`](../src/grades/m3/m3t.js#L325) |
| `Q.three` | `{ nums, op = '+' }` | [`engine/questions.js:890`](../src/engine/questions.js#L890) |
| `Q.tkCalQ` | `{ m, y, marks, q, a, opts, num, unit = '', hint }` | [`grades/p2/p2t.js:194`](../src/grades/p2/p2t.js#L194) |
| `Q.tkDigPick` | `{ h: H, m }` | [`grades/p2/p2t.js:225`](../src/grades/p2/p2t.js#L225) |
| `Q.tkDigRead` | `{ h: H, m }` | [`grades/p2/p2t.js:220`](../src/grades/p2/p2t.js#L220) |
| `Q.tkElapsed` | `{ h1, m1 = 0, h2, m2 = 0, mode, what, clocks = true }` | [`grades/p2/p2t.js:231`](../src/grades/p2/p2t.js#L231) |
| `Q.tkEnd` | `{ text, h1, m1 = 0, add }` | [`grades/p2/p2t.js:239`](../src/grades/p2/p2t.js#L239) |
| `Q.tkRead` | `{ h: H, m = 0, ask = 'hm', sky = true }` | [`grades/p2/p2t.js:201`](../src/grades/p2/p2t.js#L201) |
| `Q.tkSet` | `{ h: H, m = 0 }` | [`grades/p2/p2t.js:212`](../src/grades/p2/p2t.js#L212) |
| `Q.tkStory` | `{ text, sent, wrong, a, unit, duo }` | [`grades/p2/p2t.js:245`](../src/grades/p2/p2t.js#L245) |
| `Q.tkTwoNames` | `{ k }` | [`grades/p2/p2t.js:207`](../src/grades/p2/p2t.js#L207) |
| `Q.tMoreLess` | `{ r1, r2, v, unit, more }` | [`grades/p5/p5r.js:137`](../src/grades/p5/p5r.js#L137) |
| `Q.toThai` | `{ n }` | [`engine/questions.js:719`](../src/engine/questions.js#L719) |
| `Q.traceShape` | `{ v, obj, name, lab }` | [`engine/questions.js:1236`](../src/engine/questions.js#L1236) |
| `Q.traceWhat` | `{ obj, name, kind }` | [`engine/questions.js:1244`](../src/engine/questions.js#L1244) |
| `Q.truth` | `{ text, ok, hint }` | [`engine/questions.js:725`](../src/engine/questions.js#L725) |
| `Q.tSolve` | `{ text, a, b, c, unit, round, plain }` | [`grades/p5/p5r.js:116`](../src/grades/p5/p5r.js#L116) |
| `Q.tTable` | `{ k1, u1, k2, u2, a, b, c }` | [`grades/p5/p5r.js:129`](../src/grades/p5/p5r.js#L129) |
| `Q.unitCount` | `{ item, unit, vis = 'len', max }` | [`engine/questions.js:1369`](../src/engine/questions.js#L1369) |
| `Q.unitPick` | `{ name, e, m }` | [`engine/questions.js:1399`](../src/engine/questions.js#L1399) |
| `Q.unk1` | `s` | [`app/lessons.js:2081`](../src/app/lessons.js#L2081) |
| `Q.unknown20` | `{ t }` | [`engine/questions.js:960`](../src/engine/questions.js#L960) |
| `Q.v3Conv` | `{ from, to }` | [`grades/p3/p3v.js:93`](../src/grades/p3/p3v.js#L93) |
| `Q.v3Read` | `{ cap, ml, col = 'water', name, kind = 'jug' }` | [`grades/p3/p3v.js:78`](../src/grades/p3/p3v.js#L78) |
| `Q.v3Set` | `{ cap, ml, col = 'water', name }` | [`grades/p3/p3v.js:82`](../src/grades/p3/p3v.js#L82) |
| `Q.v3Tool` | `{ name, ml }` | [`grades/p3/p3v.js:86`](../src/grades/p3/p3v.js#L86) |
| `Q.v3Unit` | `{ text, right }` | [`grades/p3/p3v.js:89`](../src/grades/p3/p3v.js#L89) |
| `Q.vertAdd` | `{ a, b }` | [`engine/questions.js:1428`](../src/engine/questions.js#L1428) |
| `Q.vertSub` | `{ a, b }` | [`engine/questions.js:1466`](../src/engine/questions.js#L1466) |
| `Q.vFill` | `{ kind, cap, target, name, col }` | [`grades/p2/p2v.js:106`](../src/grades/p2/p2v.js#L106) |
| `Q.vPour` | `{ src, srcName, n, cup, cupName, col, dry }` | [`grades/p2/p2v.js:95`](../src/grades/p2/p2v.js#L95) |
| `Q.vRead` | `{ kind, cap, v, name, col }` | [`grades/p2/p2v.js:101`](../src/grades/p2/p2v.js#L101) |
| `Q.vWord` | `{ text, right, fig }` | [`grades/p2/p2v.js:114`](../src/grades/p2/p2v.js#L114) |
| `Q.w2Body` | `{ txt }` | [`grades/p2/p2w.js:174`](../src/grades/p2/p2w.js#L174) |
| `Q.w2Calc` | `{ a, b, op, m = 'kd', text }` | [`grades/p2/p2w.js:184`](../src/grades/p2/p2w.js#L184) |
| `Q.w2Conv` | `{ g, from, to, name }` | [`grades/p2/p2w.js:178`](../src/grades/p2/p2w.js#L178) |
| `Q.w2Read` | `{ e, name, g, kind = 'kd', m }` | [`grades/p2/p2w.js:164`](../src/grades/p2/p2w.js#L164) |
| `Q.w2Set` | `{ e, name, g, kind = 'kd', m }` | [`grades/p2/p2w.js:170`](../src/grades/p2/p2w.js#L170) |
| `Q.w2Story` | `{ text, a, b, op, m = 'kd', why }` | [`grades/p2/p2w.js:188`](../src/grades/p2/p2w.js#L188) |
| `Q.w3Calc` | `{ a, b, op, m }` | [`grades/p3/p3w.js:135`](../src/grades/p3/p3w.js#L135) |
| `Q.w3Conv` | `{ from, to }` | [`grades/p3/p3w.js:129`](../src/grades/p3/p3w.js#L129) |
| `Q.w3Dig` | `{ g, m = 'kg', name, e }` | [`grades/p3/p3w.js:115`](../src/grades/p3/p3w.js#L115) |
| `Q.w3Story` | `{ text, sent, wrong, g, m, unit }` | [`grades/p3/p3w.js:142`](../src/grades/p3/p3w.js#L142) |
| `Q.w3Tool` | `{ name, kg, e }` | [`grades/p3/p3w.js:120`](../src/grades/p3/p3w.js#L120) |
| `Q.w3Unit` | `{ text, right }` | [`grades/p3/p3w.js:124`](../src/grades/p3/p3w.js#L124) |
| `Q.whichPlace` | `{ n }` | [`engine/questions.js:626`](../src/engine/questions.js#L626) |
| `Q.wordToNum` | `{ n }` | [`engine/questions.js:604`](../src/engine/questions.js#L604) |
| `Q.writeDigits` | `{ n, from = 'word' }` | [`engine/questions.js:706`](../src/engine/questions.js#L706) |
| `Q.x3Cmp` | `{ L, R }` | [`grades/p3/p3x.js:48`](../src/grades/p3/p3x.js#L48) |
| `Q.x3Fill` | `{ tpl, res, pool }` | [`grades/p3/p3x.js:46`](../src/grades/p3/p3x.js#L46) |
| `Q.x3Make` | `{ s, parts, ask }` | [`grades/p3/p3x.js:51`](../src/grades/p3/p3x.js#L51) |
| `Q.x3Story` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p3/p3x.js:70`](../src/grades/p3/p3x.js#L70) |
