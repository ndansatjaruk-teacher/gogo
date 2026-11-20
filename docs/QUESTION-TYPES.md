# ชนิดคำถาม (Question types)

สร้างอัตโนมัติด้วย `python3 tools/catalog.py` — อย่าแก้ไฟล์นี้ด้วยมือ (generated; do not edit by hand).

ทุกชนิดคืนค่าเป็น object คำถาม `{ prompt, say, mount(bd, ctx) … }` ใช้ในฟังก์ชัน `game` ของด่าน · ก่อนสร้างชนิดใหม่ ให้หาในตารางนี้ก่อนว่ามีของเดิมใช้ได้ไหม

383 types

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
| `Q.abacusRead` | `{ n, ask = 'digit', rods }` | [`engine/questions.js:657`](../src/engine/questions.js#L657) |
| `Q.add100` | `{ a, b, blocks = false }` | [`engine/questions.js:1313`](../src/engine/questions.js#L1313) |
| `Q.addFact` | `{ a, b, frame = false, pen, vert = false }` | [`engine/questions.js:274`](../src/engine/questions.js#L274) |
| `Q.addSteps` | `{ a, b }` | [`engine/questions.js:1319`](../src/engine/questions.js#L1319) |
| `Q.arrange` | `{ clues, answer, slotLabel }` | [`engine/questions.js:1067`](../src/engine/questions.js#L1067) |
| `Q.b3Story` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p3/p3b.js:23`](../src/grades/p3/p3b.js#L23) |
| `Q.b3Unk` | `st` | [`grades/p3/p3b.js:28`](../src/grades/p3/p3b.js#L28) |
| `Q.balanceCmp` | `{ a, b, rel }` | [`engine/questions.js:960`](../src/engine/questions.js#L960) |
| `Q.basketCount` | `{ e, name, n, unit = 'ผล' }` | [`engine/questions.js:1202`](../src/engine/questions.js#L1202) |
| `Q.between` | `{ lo, hi }` | [`engine/questions.js:750`](../src/engine/questions.js#L750) |
| `Q.blocksRead` | `{ n, ask = 'digit' }` | [`engine/questions.js:555`](../src/engine/questions.js#L555) |
| `Q.buildChart` | `{ chart: c, from = 'mix' }` | [`engine/questions.js:934`](../src/engine/questions.js#L934) |
| `Q.busAsk` | `{ names, k }` | [`engine/questions.js:1053`](../src/engine/questions.js#L1053) |
| `Q.c8Pick` | `{ fig, q, opts, right, hint, keep }` | [`grades/p6/p6o.js:138`](../src/grades/p6/p6o.js#L138) |
| `Q.chartAsk` | `{ chart: c, ask, a = 0, b = 1, k = 3 }` | [`engine/questions.js:898`](../src/engine/questions.js#L898) |
| `Q.cmp2` | `{ a, b: bb, blocks = false }` | [`engine/questions.js:1224`](../src/engine/questions.js#L1224) |
| `Q.cnsQ` | `T, q` | [`grades/p5/p5q.js:571`](../src/grades/p5/p5q.js#L571) |
| `Q.colW` | `{ nums, op, prompt, say, sig }` | [`engine/colw.js:83`](../src/engine/colw.js#L83) |
| `Q.compare5` | `{ a, b: bb, ea, eb, eq = true }` | [`engine/questions.js:739`](../src/engine/questions.js#L739) |
| `Q.compareSym` | `{ a, b: bb, blocks = false }` | [`engine/questions.js:606`](../src/engine/questions.js#L606) |
| `Q.countKind` | `{ items, kind, mode = 'solid', art: isArt }` | [`engine/questions.js:1113`](../src/engine/questions.js#L1113) |
| `Q.countOnAdd` | `{ a, b }` | [`engine/questions.js:821`](../src/engine/questions.js#L821) |
| `Q.d3Long` | `{ D, k, guide }` | [`grades/p3/p3d.js:134`](../src/grades/p3/p3d.js#L134) |
| `Q.d3Short` | `{ D, k, guide }` | [`grades/p3/p3d.js:136`](../src/grades/p3/p3d.js#L136) |
| `Q.d3Story` | `{ text, n, d, unit, unit2 }` | [`grades/p3/p3d.js:139`](../src/grades/p3/p3d.js#L139) |
| `Q.d3Unk` | `{ a, b, c, pos }` | [`grades/p3/p3d.js:150`](../src/grades/p3/p3d.js#L150) |
| `Q.d6ToFrac` | `{ x }` | [`grades/p6/p6d.js:98`](../src/grades/p6/p6d.js#L98) |
| `Q.dCalc` | `{ expr, hint }` | [`grades/p5/p5d.js:108`](../src/grades/p5/p5d.js#L108) |
| `Q.dCmp` | `{ l, r, hint }` | [`grades/p5/p5d.js:126`](../src/grades/p5/p5d.js#L126) |
| `Q.dFill` | `{ q, a, hint, say: sy }` | [`grades/p5/p5d.js:142`](../src/grades/p5/p5d.js#L142) |
| `Q.dFrac` | `{ f }` | [`grades/p5/p5d.js:81`](../src/grades/p5/p5d.js#L81) |
| `Q.digitPlace` | `{ n, i }` | [`engine/questions.js:712`](../src/engine/questions.js#L712) |
| `Q.digitValue` | `{ n, i, underline = false }` | [`engine/questions.js:702`](../src/engine/questions.js#L702) |
| `Q.dMatch` | `{ pairs }` | [`grades/p5/p5d.js:89`](../src/grades/p5/p5d.js#L89) |
| `Q.dMiss` | `{ a, res, op = '×' }` | [`grades/p5/p5d.js:134`](../src/grades/p5/p5d.js#L134) |
| `Q.dPick` | `{ q, opts, right, hint, say: sy, keep }` | [`grades/p5/p5d.js:103`](../src/grades/p5/p5d.js#L103) |
| `Q.dPoint` | `{ a, b }` | [`grades/p5/p5d.js:115`](../src/grades/p5/p5d.js#L115) |
| `Q.drawSum` | `{ a, b }` | [`engine/questions.js:264`](../src/engine/questions.js#L264) |
| `Q.dRound` | `{ x, p, line = false }` | [`grades/p5/p5d.js:95`](../src/grades/p5/p5d.js#L95) |
| `Q.dStory` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p5/p5d.js:149`](../src/grades/p5/p5d.js#L149) |
| `Q.dvCmp` | `{ l, r }` | [`grades/p2/p2d.js:141`](../src/grades/p2/p2d.js#L141) |
| `Q.dvCtr` | `{ n, d }` | [`grades/p2/p2d.js:106`](../src/grades/p2/p2d.js#L106) |
| `Q.dvFact` | `{ n, d }` | [`grades/p2/p2d.js:111`](../src/grades/p2/p2d.js#L111) |
| `Q.dvFam` | `{ a, b }` | [`grades/p2/p2d.js:118`](../src/grades/p2/p2d.js#L118) |
| `Q.dvPic` | `{ n, d, e, what, box, unit, mode }` | [`grades/p2/p2d.js:100`](../src/grades/p2/p2d.js#L100) |
| `Q.dvPop` | `{ facts }` | [`grades/p2/p2d.js:125`](../src/grades/p2/p2d.js#L125) |
| `Q.dvRem` | `{ n, d, e }` | [`grades/p2/p2d.js:136`](../src/grades/p2/p2d.js#L136) |
| `Q.dvStory` | `{ text, n, d, unit, unit2, fig }` | [`grades/p2/p2d.js:153`](../src/grades/p2/p2d.js#L153) |
| `Q.dvUnk` | `{ a, b, c, pos }` | [`grades/p2/p2d.js:147`](../src/grades/p2/p2d.js#L147) |
| `Q.e4Col` | `{ a, b, op }` | [`grades/p4/p4e.js:100`](../src/grades/p4/p4e.js#L100) |
| `Q.e4Exp` | `{ s }` | [`grades/p4/p4e.js:129`](../src/grades/p4/p4e.js#L129) |
| `Q.e4Frac` | `{ s }` | [`grades/p4/p4e.js:116`](../src/grades/p4/p4e.js#L116) |
| `Q.e4Mix` | `{ expr }` | [`grades/p4/p4e.js:103`](../src/grades/p4/p4e.js#L103) |
| `Q.e4Pic` | `{ n, unit }` | [`grades/p4/p4e.js:113`](../src/grades/p4/p4e.js#L113) |
| `Q.e4Place` | `{ s, pos }` | [`grades/p4/p4e.js:125`](../src/grades/p4/p4e.js#L125) |
| `Q.e4Read` | `{ s, to }` | [`grades/p4/p4e.js:119`](../src/grades/p4/p4e.js#L119) |
| `Q.estimate1kg` | `{ a, heavy }` | [`engine/questions.js:972`](../src/engine/questions.js#L972) |
| `Q.evenOdd` | `{ n }` | [`engine/questions.js:618`](../src/engine/questions.js#L618) |
| `Q.expand20` | `{ n, miss = 'u' }` | [`engine/questions.js:795`](../src/engine/questions.js#L795) |
| `Q.expanded5` | `{ n, miss }` | [`engine/questions.js:719`](../src/engine/questions.js#L719) |
| `Q.f3Calc` | `{ a, b, op, d, w }` | [`grades/p3/p3f.js:101`](../src/grades/p3/p3f.js#L101) |
| `Q.f3Cmp` | `{ a, b, pic }` | [`grades/p3/p3f.js:98`](../src/grades/p3/p3f.js#L98) |
| `Q.f3Equal` | `{ i, eq, d }` | [`grades/p3/p3f.js:84`](../src/grades/p3/p3f.js#L84) |
| `Q.f3Part` | `{ n, d, ask }` | [`grades/p3/p3f.js:96`](../src/grades/p3/p3f.js#L96) |
| `Q.f3Read` | `{ n, d, to }` | [`grades/p3/p3f.js:92`](../src/grades/p3/p3f.js#L92) |
| `Q.f3Shade` | `{ n, d, kind }` | [`grades/p3/p3f.js:89`](../src/grades/p3/p3f.js#L89) |
| `Q.f3Story` | `{ text, sent, wrong, n, d, unit }` | [`grades/p3/p3f.js:105`](../src/grades/p3/p3f.js#L105) |
| `Q.f3Write` | `{ n, d, kind }` | [`grades/p3/p3f.js:87`](../src/grades/p3/p3f.js#L87) |
| `Q.f4Eq` | `{ n, d, k, mode, ask }` | [`grades/p4/p4f.js:69`](../src/grades/p4/p4f.js#L69) |
| `Q.f4Fill` | `{ tpl, ans, hint }` | [`grades/p4/p4f.js:63`](../src/grades/p4/p4f.js#L63) |
| `Q.f4MixPic` | `{ w, n, d }` | [`grades/p4/p4f.js:59`](../src/grades/p4/p4f.js#L59) |
| `Q.f4Pic` | `{ n, d, kind }` | [`grades/p4/p4f.js:57`](../src/grades/p4/p4f.js#L57) |
| `Q.f4Set` | `{ d, per, n }` | [`grades/p4/p4f.js:61`](../src/grades/p4/p4f.js#L61) |
| `Q.f4Simp` | `{ n, d }` | [`grades/p4/p4f.js:71`](../src/grades/p4/p4f.js#L71) |
| `Q.f4ToImp` | `{ w, n, d }` | [`grades/p4/p4f.js:65`](../src/grades/p4/p4f.js#L65) |
| `Q.f4ToMix` | `{ n, d }` | [`grades/p4/p4f.js:67`](../src/grades/p4/p4f.js#L67) |
| `Q.f6Mix` | `{ f }` | [`grades/p6/p6f.js:122`](../src/grades/p6/p6f.js#L122) |
| `Q.family` | `{ a, b }` | [`engine/questions.js:447`](../src/engine/questions.js#L447) |
| `Q.fCalc` | `{ expr, vis, hint }` | [`grades/p5/p5.js:190`](../src/grades/p5/p5.js#L190) |
| `Q.fCmp` | `{ a, b, bars = false, hint }` | [`grades/p5/p5.js:163`](../src/grades/p5/p5.js#L163) |
| `Q.fEquiv` | `{ a, D }` | [`grades/p5/p5.js:231`](../src/grades/p5/p5.js#L231) |
| `Q.fFirst` | `{ expr }` | [`grades/p5/p5.js:223`](../src/grades/p5/p5.js#L223) |
| `Q.fHalf` | `{ a }` | [`grades/p5/p5.js:157`](../src/grades/p5/p5.js#L157) |
| `Q.fillFrames` | `{ n }` | [`engine/questions.js:785`](../src/engine/questions.js#L785) |
| `Q.findDiff` | `{ n = 2 } = {}` | [`engine/questions.js:496`](../src/engine/questions.js#L496) |
| `Q.findTens` | | [`engine/questions.js:310`](../src/engine/questions.js#L310) |
| `Q.findX` | `{ toks }` | [`engine/questions.js:1387`](../src/engine/questions.js#L1387) |
| `Q.fOf` | `{ f, n, e = 'coin', unit = '' }` | [`grades/p5/p5.js:201`](../src/grades/p5/p5.js#L201) |
| `Q.fOrder` | `{ list, dir = 'asc' }` | [`grades/p5/p5.js:181`](../src/grades/p5/p5.js#L181) |
| `Q.fPick` | `{ q, opts, right, hint }` | [`grades/p5/p5.js:177`](../src/grades/p5/p5.js#L177) |
| `Q.frames20` | `{ n, pen }` | [`engine/questions.js:780`](../src/engine/questions.js#L780) |
| `Q.fRecip` | `{ f }` | [`grades/p5/p5.js:207`](../src/grades/p5/p5.js#L207) |
| `Q.fromExpanded` | `{ n }` | [`engine/questions.js:733`](../src/engine/questions.js#L733) |
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
| `Q.gridAsk` | `{ rows, ask, of }` | [`engine/questions.js:1028`](../src/engine/questions.js#L1028) |
| `Q.hCmul` | `{ nums, upto }` | [`grades/p6/p6h.js:325`](../src/grades/p6/p6h.js#L325) |
| `Q.hCommon` | `{ nums }` | [`grades/p6/p6h.js:320`](../src/grades/p6/p6h.js#L320) |
| `Q.hFac` | `{ n }` | [`grades/p6/p6h.js:283`](../src/grades/p6/p6h.js#L283) |
| `Q.hGcd` | `{ nums, how = 'cd' }` | [`grades/p6/p6h.js:310`](../src/grades/p6/p6h.js#L310) |
| `Q.hKind` | `{ text, kind, why }` | [`grades/p6/p6h.js:338`](../src/grades/p6/p6h.js#L338) |
| `Q.hLcm` | `{ nums, how = 'cm' }` | [`grades/p6/p6h.js:315`](../src/grades/p6/p6h.js#L315) |
| `Q.hNum` | `{ q, head, a, hint, say: sy }` | [`grades/p6/p6h.js:335`](../src/grades/p6/p6h.js#L335) |
| `Q.hPF` | `{ n }` | [`grades/p6/p6h.js:299`](../src/grades/p6/p6h.js#L299) |
| `Q.hPFs` | `{ n }` | [`grades/p6/p6h.js:293`](../src/grades/p6/p6h.js#L293) |
| `Q.hPrime` | `{ nums }` | [`grades/p6/p6h.js:288`](../src/grades/p6/p6h.js#L288) |
| `Q.hStory` | `{ text, kind, ans, unit = '', ask, why }` | [`grades/p6/p6h.js:344`](../src/grades/p6/p6h.js#L344) |
| `Q.hTF` | `{ text, ok, why }` | [`grades/p6/p6h.js:330`](../src/grades/p6/p6h.js#L330) |
| `Q.hundredFill` | `{ cells, show, q }` | [`engine/questions.js:1246`](../src/engine/questions.js#L1246) |
| `Q.isAddition` | | [`engine/questions.js:371`](../src/engine/questions.js#L371) |
| `Q.isSubtraction` | | [`engine/questions.js:514`](../src/engine/questions.js#L514) |
| `Q.ixGroup` | `{ q, say: sy, bins, items, hint }` | [`engine/ix.js:44`](../src/engine/ix.js#L44) |
| `Q.ixMatch` | `{ q, say: sy, pairs, hint, wide }` | [`engine/ix.js:11`](../src/engine/ix.js#L11) |
| `Q.ixSort` | `{ q, say: sy, items, dir = 'asc', k, slotLabels, hint, fig }` | [`engine/ix.js:19`](../src/engine/ix.js#L19) |
| `Q.ixTF` | `{ q, say: sy, bins, items, hint }` | [`engine/ix.js:29`](../src/engine/ix.js#L29) |
| `Q.k3Cmp` | `{ L, R }` | [`grades/p3/p3k.js:59`](../src/grades/p3/p3k.js#L59) |
| `Q.k3Col` | `{ a, m, flip }` | [`grades/p3/p3k.js:43`](../src/grades/p3/p3k.js#L43) |
| `Q.k3Groups` | `{ g, m, z }` | [`grades/p3/p3k.js:57`](../src/grades/p3/p3k.js#L57) |
| `Q.k3Long` | `{ a, b }` | [`grades/p3/p3k.js:45`](../src/grades/p3/p3k.js#L45) |
| `Q.k3Story` | `{ text, a, b, unit, wrong }` | [`grades/p3/p3k.js:66`](../src/grades/p3/p3k.js#L66) |
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
| `Q.lenDiff` | `{ a, b, unit = 'cm', vis = 'none', word }` | [`engine/questions.js:1277`](../src/engine/questions.js#L1277) |
| `Q.lenExtreme` | `{ items, ask, unit, vis = 'len', max }` | [`engine/questions.js:1259`](../src/engine/questions.js#L1259) |
| `Q.lFig` | `{ q, figs, right, hint }` | [`grades/p5/p5g.js:210`](../src/grades/p5/p5g.js#L210) |
| `Q.lFind` | `{ k, v, j }` | [`grades/p5/p5g.js:193`](../src/grades/p5/p5g.js#L193) |
| `Q.lineAsk` | `{ names, ask, of, of2 }` | [`engine/questions.js:1019`](../src/engine/questions.js#L1019) |
| `Q.lineCalc` | `{ a, b, op = '+' }` | [`engine/questions.js:829`](../src/engine/questions.js#L829) |
| `Q.lineCompare` | `{ a, b: bb }` | [`engine/questions.js:806`](../src/engine/questions.js#L806) |
| `Q.lineSub` | `{ a, b }` | [`engine/questions.js:465`](../src/engine/questions.js#L465) |
| `Q.lIsPar` | `{ a, va, b, vb }` | [`grades/p5/p5g.js:202`](../src/grades/p5/p5g.js#L202) |
| `Q.lName` | `{ a, b }` | [`grades/p5/p5g.js:180`](../src/grades/p5/p5g.js#L180) |
| `Q.lTap` | `{ k, rel }` | [`grades/p5/p5g.js:171`](../src/grades/p5/p5g.js#L171) |
| `Q.makeTen` | `{ a }` | [`engine/questions.js:303`](../src/engine/questions.js#L303) |
| `Q.makeTen20` | `{ a, b, ask = 'sum' }` | [`engine/questions.js:843`](../src/engine/questions.js#L843) |
| `Q.marbles` | `{ a, n }` | [`engine/questions.js:967`](../src/engine/questions.js#L967) |
| `Q.match1000` | `{ nums }` | [`engine/questions.js:574`](../src/engine/questions.js#L574) |
| `Q.match5` | `{ nums }` | [`engine/questions.js:693`](../src/engine/questions.js#L693) |
| `Q.matchDiffs` | `{ k = 3 } = {}` | [`engine/questions.js:509`](../src/engine/questions.js#L509) |
| `Q.matchFrames` | `{ nums }` | [`engine/questions.js:790`](../src/engine/questions.js#L790) |
| `Q.matchSums` | `{ n = 3 } = {}` | [`engine/questions.js:324`](../src/engine/questions.js#L324) |
| `Q.meterJudge` | `{ e, name, more }` | [`engine/questions.js:1297`](../src/engine/questions.js#L1297) |
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
| `Q.numToWord` | `{ n, from = 'digit' }` | [`engine/questions.js:570`](../src/engine/questions.js#L570) |
| `Q.objSolid` | `{ obj, kind, name }` | [`engine/questions.js:1119`](../src/engine/questions.js#L1119) |
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
| `Q.p6Fig` | `{ fig, q, opts, right, hint, say: sy }` | [`grades/p6/p6p.js:96`](../src/grades/p6/p6p.js#L96) |
| `Q.p6Num` | `{ q, a, unit = '', hint }` | [`grades/p6/p6p.js:93`](../src/grades/p6/p6p.js#L93) |
| `Q.patMake` | `{ unit, reps = 2, show = 1, palette }` | [`engine/questions.js:1171`](../src/engine/questions.js#L1171) |
| `Q.patMissing` | `{ seq, blank }` | [`engine/questions.js:1165`](../src/engine/questions.js#L1165) |
| `Q.patRule2` | `{ vals }` | [`engine/questions.js:1233`](../src/engine/questions.js#L1233) |
| `Q.pattern` | `{ start, step, len = 5, blank, hi = 1000 }` | [`engine/questions.js:625`](../src/engine/questions.js#L625) |
| `Q.patternRule` | `{ start, step, len = 4, hi = 1000 }` | [`engine/questions.js:630`](../src/engine/questions.js#L630) |
| `Q.patUnit` | `{ seq }` | [`engine/questions.js:1157`](../src/engine/questions.js#L1157) |
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
| `Q.pickExpand2` | `{ n }` | [`engine/questions.js:1219`](../src/engine/questions.js#L1219) |
| `Q.pickExpand20` | `{ n }` | [`engine/questions.js:800`](../src/engine/questions.js#L800) |
| `Q.pickExpanded` | `{ n }` | [`engine/questions.js:599`](../src/engine/questions.js#L599) |
| `Q.pickExpanded5` | `{ n }` | [`engine/questions.js:725`](../src/engine/questions.js#L725) |
| `Q.pickStory` | `{ a, b, op, stories }` | [`engine/questions.js:883`](../src/engine/questions.js#L883) |
| `Q.place2` | `{ n, pos }` | [`engine/questions.js:1207`](../src/engine/questions.js#L1207) |
| `Q.pOf` | `{ p, n, text, unit = '' }` | [`grades/p5/p5p.js:81`](../src/grades/p5/p5p.js#L81) |
| `Q.ppBuild` | `{ D }` | [`grades/p2/p2c.js:61`](../src/grades/p2/p2c.js#L61) |
| `Q.pPL` | `{ text, cost, sell }` | [`grades/p5/p5p.js:95`](../src/grades/p5/p5p.js#L95) |
| `Q.ppNum` | `{ D, q, a, hint, unit }` | [`grades/p2/p2c.js:50`](../src/grades/p2/p2c.js#L50) |
| `Q.ppRead` | `{ D, i, q }` | [`grades/p2/p2c.js:45`](../src/grades/p2/p2c.js#L45) |
| `Q.ppTap` | `{ D, ask }` | [`grades/p2/p2c.js:55`](../src/grades/p2/p2c.js#L55) |
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
| `Q.raceAsk` | `{ racers, ask, k, who }` | [`engine/questions.js:1045`](../src/engine/questions.js#L1045) |
| `Q.rankAsk` | `{ items, unit, ask, k, who, pic }` | [`engine/questions.js:1058`](../src/engine/questions.js#L1058) |
| `Q.readScale` | `{ a, v, unit = 'kg', col }` | [`engine/questions.js:979`](../src/engine/questions.js#L979) |
| `Q.readWords` | `{ n, from = 'digit' }` | [`engine/questions.js:675`](../src/engine/questions.js#L675) |
| `Q.robotCount` | `{ kind }` | [`engine/questions.js:1152`](../src/engine/questions.js#L1152) |
| `Q.rulerSet` | `{ len, col = 'mint', kind = 'straw', max = 10 }` | [`engine/questions.js:1284`](../src/engine/questions.js#L1284) |
| `Q.s2build` | `{ text, nums, res }` | [`grades/p2/p2m.js:47`](../src/grades/p2/p2m.js#L47) |
| `Q.s2two` | `{ expr }` | [`grades/p2/p2m.js:43`](../src/grades/p2/p2m.js#L43) |
| `Q.s6Next` | `{ seq, hint }` | [`grades/p6/p6s.js:91`](../src/grades/p6/p6s.js#L91) |
| `Q.s6PatN` | `{ kind, n }` | [`grades/p6/p6s.js:97`](../src/grades/p6/p6s.js#L97) |
| `Q.s6Seq` | `{ seq, blanks, hint }` | [`grades/p6/p6s.js:81`](../src/grades/p6/p6s.js#L81) |
| `Q.s9Num` | `{ fig, q, a, unit = '', hint }` | [`grades/p6/p6m.js:388`](../src/grades/p6/p6m.js#L388) |
| `Q.sameSum` | `{ a, b }` | [`engine/questions.js:344`](../src/engine/questions.js#L344) |
| `Q.scalesCmp` | `{ a, b, va, vb, unit = 'kg', diff = false }` | [`engine/questions.js:992`](../src/engine/questions.js#L992) |
| `Q.scalesExtreme` | `{ items, unit = 'kg', which = 'max' }` | [`engine/questions.js:1002`](../src/engine/questions.js#L1002) |
| `Q.seqBlank` | `{ vals, blank }` | [`engine/questions.js:1240`](../src/engine/questions.js#L1240) |
| `Q.seqFill` | `{ vals, blank, step }` | [`engine/questions.js:757`](../src/engine/questions.js#L757) |
| `Q.seqRule` | `{ vals }` | [`engine/questions.js:762`](../src/engine/questions.js#L762) |
| `Q.setScale` | `{ a, v, unit = 'kg' }` | [`engine/questions.js:985`](../src/engine/questions.js#L985) |
| `Q.shapeClue` | `{ clue, kind }` | [`engine/questions.js:1135`](../src/engine/questions.js#L1135) |
| `Q.shapeName` | `{ v, rot = 0 }` | [`engine/questions.js:1124`](../src/engine/questions.js#L1124) |
| `Q.shelfAsk` | `{ rows, names, ask, r, c }` | [`engine/questions.js:1036`](../src/engine/questions.js#L1036) |
| `Q.sidesCorners` | `{ v, ask = 'sides', rot = 0 }` | [`engine/questions.js:1129`](../src/engine/questions.js#L1129) |
| `Q.solidName` | `{ v }` | [`engine/questions.js:1090`](../src/engine/questions.js#L1090) |
| `Q.sortEvenOdd` | `{ k = 6 } = {}` | [`engine/questions.js:621`](../src/engine/questions.js#L621) |
| `Q.story` | `{ text, a, b, unit, art: ar = 'apple', art2, ask, op = '+', pic = 'join' }` | [`engine/questions.js:349`](../src/engine/questions.js#L349) |
| `Q.story100` | `{ text, a, b, op, unit, bar }` | [`engine/questions.js:1400`](../src/engine/questions.js#L1400) |
| `Q.story20` | `{ text, a, b, op, unit }` | [`engine/questions.js:873`](../src/engine/questions.js#L873) |
| `Q.storyFor` | `{ a, b, op, stories }` | [`engine/questions.js:1412`](../src/engine/questions.js#L1412) |
| `Q.sub100` | `{ a, b, blocks = false }` | [`engine/questions.js:1349`](../src/engine/questions.js#L1349) |
| `Q.subCountOn` | `{ a, b }` | [`engine/questions.js:858`](../src/engine/questions.js#L858) |
| `Q.subFact` | `{ a, b, frame = false, vert = false, pen }` | [`engine/questions.js:415`](../src/engine/questions.js#L415) |
| `Q.subSteps` | `{ a, b }` | [`engine/questions.js:1356`](../src/engine/questions.js#L1356) |
| `Q.swap` | `{ a, b }` | [`engine/questions.js:338`](../src/engine/questions.js#L338) |
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
| `Q.t4Cmp` | `{ A, B }` | [`grades/p4/p4t.js:80`](../src/grades/p4/p4t.js#L80) |
| `Q.t4Conv` | `{ from, to }` | [`grades/p4/p4t.js:67`](../src/grades/p4/p4t.js#L67) |
| `Q.t4Diff` | `{ text, A, B, units }` | [`grades/p4/p4t.js:84`](../src/grades/p4/p4t.js#L84) |
| `Q.t4Span` | `{ text, d1, h1, d2, h2, mon }` | [`grades/p4/p4t.js:71`](../src/grades/p4/p4t.js#L71) |
| `Q.t4Story` | `{ text, how, opts, ans, units, pre }` | [`grades/p4/p4t.js:93`](../src/grades/p4/p4t.js#L93) |
| `Q.t4Tab` | `{ T, q, opts, right, hint }` | [`grades/p4/p4t.js:88`](../src/grades/p4/p4t.js#L88) |
| `Q.t4TabDur` | `{ T, i }` | [`grades/p4/p4t.js:89`](../src/grades/p4/p4t.js#L89) |
| `Q.t4YM` | `{ text, a, b }` | [`grades/p4/p4t.js:76`](../src/grades/p4/p4t.js#L76) |
| `Q.t6Cls` | `{ B, C, by }` | [`grades/p6/p6t.js:207`](../src/grades/p6/p6t.js#L207) |
| `Q.t6Find` | `{ B, C, ask = 0, names = ['ก', 'ข', 'ค'] }` | [`grades/p6/p6t.js:223`](../src/grades/p6/p6t.js#L223) |
| `Q.t6Num` | `{ fig, q, a, unit, hint }` | [`grades/p6/p6t.js:229`](../src/grades/p6/p6t.js#L229) |
| `Q.t6Part` | `{ B, C, base, ask }` | [`grades/p6/p6t.js:214`](../src/grades/p6/p6t.js#L214) |
| `Q.tallerWord` | `{ a, b }` | [`engine/questions.js:1266`](../src/engine/questions.js#L1266) |
| `Q.tallyMake` | `{ n, label }` | [`engine/questions.js:946`](../src/engine/questions.js#L946) |
| `Q.tallyRead` | `{ n, label }` | [`engine/questions.js:942`](../src/engine/questions.js#L942) |
| `Q.tapKind` | `{ items, kind, mode = 'solid' }` | [`engine/questions.js:1096`](../src/engine/questions.js#L1096) |
| `Q.tCan` | `{ text, can, why }` | [`grades/p5/p5r.js:145`](../src/grades/p5/p5r.js#L145) |
| `Q.tCheaper` | `{ item, unit, A, B, nA = 'ร้านขายดี', nB = 'ร้านสะดวกซื้อ' }` | [`grades/p5/p5r.js:152`](../src/grades/p5/p5r.js#L152) |
| `Q.tensRead` | `{ n, ask = 'digit' }` | [`engine/questions.js:1194`](../src/engine/questions.js#L1194) |
| `Q.tenSub` | `{ a, b }` | [`engine/questions.js:476`](../src/engine/questions.js#L476) |
| `Q.three` | `{ nums, op = '+' }` | [`engine/questions.js:851`](../src/engine/questions.js#L851) |
| `Q.tkCalQ` | `{ m, y, marks, q, a, opts, num, unit = '', hint }` | [`grades/p2/p2t.js:152`](../src/grades/p2/p2t.js#L152) |
| `Q.tkDigPick` | `{ h: H, m }` | [`grades/p2/p2t.js:182`](../src/grades/p2/p2t.js#L182) |
| `Q.tkDigRead` | `{ h: H, m }` | [`grades/p2/p2t.js:177`](../src/grades/p2/p2t.js#L177) |
| `Q.tkElapsed` | `{ h1, m1 = 0, h2, m2 = 0, mode, what, clocks = true }` | [`grades/p2/p2t.js:188`](../src/grades/p2/p2t.js#L188) |
| `Q.tkEnd` | `{ text, h1, m1 = 0, add }` | [`grades/p2/p2t.js:196`](../src/grades/p2/p2t.js#L196) |
| `Q.tkRead` | `{ h: H, m = 0, ask = 'hm', sky = true }` | [`grades/p2/p2t.js:158`](../src/grades/p2/p2t.js#L158) |
| `Q.tkSet` | `{ h: H, m = 0 }` | [`grades/p2/p2t.js:169`](../src/grades/p2/p2t.js#L169) |
| `Q.tkStory` | `{ text, sent, wrong, a, unit, duo }` | [`grades/p2/p2t.js:202`](../src/grades/p2/p2t.js#L202) |
| `Q.tkTwoNames` | `{ k }` | [`grades/p2/p2t.js:164`](../src/grades/p2/p2t.js#L164) |
| `Q.tMoreLess` | `{ r1, r2, v, unit, more }` | [`grades/p5/p5r.js:136`](../src/grades/p5/p5r.js#L136) |
| `Q.toThai` | `{ n }` | [`engine/questions.js:682`](../src/engine/questions.js#L682) |
| `Q.traceShape` | `{ v, obj, name }` | [`engine/questions.js:1139`](../src/engine/questions.js#L1139) |
| `Q.traceWhat` | `{ obj, name, kind }` | [`engine/questions.js:1147`](../src/engine/questions.js#L1147) |
| `Q.truth` | `{ text, ok, hint }` | [`engine/questions.js:688`](../src/engine/questions.js#L688) |
| `Q.tSolve` | `{ text, a, b, c, unit, round, plain }` | [`grades/p5/p5r.js:116`](../src/grades/p5/p5r.js#L116) |
| `Q.tTable` | `{ k1, u1, k2, u2, a, b, c }` | [`grades/p5/p5r.js:128`](../src/grades/p5/p5r.js#L128) |
| `Q.unitCount` | `{ item, unit, vis = 'len', max }` | [`engine/questions.js:1272`](../src/engine/questions.js#L1272) |
| `Q.unitPick` | `{ name, e, m }` | [`engine/questions.js:1302`](../src/engine/questions.js#L1302) |
| `Q.unknown20` | `{ t }` | [`engine/questions.js:864`](../src/engine/questions.js#L864) |
| `Q.v3Conv` | `{ from, to }` | [`grades/p3/p3v.js:93`](../src/grades/p3/p3v.js#L93) |
| `Q.v3Read` | `{ cap, ml, col = 'water', name, kind = 'jug' }` | [`grades/p3/p3v.js:78`](../src/grades/p3/p3v.js#L78) |
| `Q.v3Set` | `{ cap, ml, col = 'water', name }` | [`grades/p3/p3v.js:82`](../src/grades/p3/p3v.js#L82) |
| `Q.v3Tool` | `{ name, ml }` | [`grades/p3/p3v.js:86`](../src/grades/p3/p3v.js#L86) |
| `Q.v3Unit` | `{ text, right }` | [`grades/p3/p3v.js:89`](../src/grades/p3/p3v.js#L89) |
| `Q.vertAdd` | `{ a, b }` | [`engine/questions.js:1331`](../src/engine/questions.js#L1331) |
| `Q.vertSub` | `{ a, b }` | [`engine/questions.js:1369`](../src/engine/questions.js#L1369) |
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
| `Q.whichPlace` | `{ n }` | [`engine/questions.js:589`](../src/engine/questions.js#L589) |
| `Q.wordToNum` | `{ n }` | [`engine/questions.js:567`](../src/engine/questions.js#L567) |
| `Q.writeDigits` | `{ n, from = 'word' }` | [`engine/questions.js:669`](../src/engine/questions.js#L669) |
| `Q.x3Cmp` | `{ L, R }` | [`grades/p3/p3x.js:48`](../src/grades/p3/p3x.js#L48) |
| `Q.x3Fill` | `{ tpl, res, pool }` | [`grades/p3/p3x.js:46`](../src/grades/p3/p3x.js#L46) |
| `Q.x3Make` | `{ s, parts, ask }` | [`grades/p3/p3x.js:51`](../src/grades/p3/p3x.js#L51) |
| `Q.x3Story` | `{ text, expr, wrong = [], unit = '' }` | [`grades/p3/p3x.js:61`](../src/grades/p3/p3x.js#L61) |
