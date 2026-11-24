/* ม.1 บทที่ 2 ลำน้ำเรขา — งานสร้าง mgT.* (โจทย์ + เฉลย + goal) */
/* =========================================================
   งานสร้าง (tasks) — พิกัดเป็น ซม. บนกระดาษ 14.5 × 9.5 · ทุกงานมีเฉลยทีละขั้น (sol) ที่ใช้ทั้งตัวอย่างและดูเฉลย
   ========================================================= */
const mgCov = (a, deg) => a.a1 - a.a0 >= 359 || mgNrm(deg - a.a0 + 3) <= a.a1 - a.a0 + 6; /* ส่วนโค้งผ่านทิศ deg (เผื่อปลาย 3°) */
const mgEqPair = (L1, L2, rmin = 0) => L1.some(a => L2.some(b => Math.abs(a.r - b.r) < .12 && a.r > rmin));
const mgT = {
  /* ลอกส่วนของเส้นตรง: บนรังสี CX สร้าง CD ให้ยาวเท่ากับ AB */
  copySeg(L = 4.3) { const A = [1.6, 7.4], B = [1.6 + L, 7.4], C = [2.2, 2.6], X = [9.8, 2.6], Q = mgP(C, 0, L);
    return { title: `บนรังสี CX สร้าง <b>CD ให้ยาวเท่ากับ AB</b> ด้วยวงเวียน`, given: { pts: { A, B, C, X }, segs: [['A', 'B']], rays: [['C', 'X']] }, compC: [11.4, 5.6],
      sol: [{ say: 'วางเข็มวงเวียนที่ <b>A</b> กางขาดินสอไปที่ <b>B</b> — รัศมีวงเวียนจึงยาวเท่ากับ AB', ops: [{ t: 'arc', c: A, r: L, a0: -10, a1: 10 }] },
        { say: 'ยกวงเวียนไปวางเข็มที่ <b>C</b> (อย่าเปลี่ยนรัศมี) เขียนส่วนโค้งตัดรังสี CX', ops: [{ t: 'arc', c: C, r: L, a0: -22, a1: 22 }] },
        { say: 'จุดที่ส่วนโค้งตัดรังสี คือ <b>D</b> → CD = AB', ops: [{ t: 'pt', p: Q, name: 'D' }, { t: 'away' }] }],
      marks: [{ p: Q, name: 'D' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> CD ยาวเท่ากับ AB 🎉',
      goal: G => { const a = G.arcAt(C); if (!a.length) return { ok: false, why: 'ยังไม่ได้วางเข็มวงเวียนที่จุด C แล้วเขียนส่วนโค้ง' }; return a.some(x => Math.abs(x.r - L) < .12 && mgCov(x, 0)) ? { ok: true } : { ok: false, why: a.some(x => Math.abs(x.r - L) < .12) ? 'ส่วนโค้งยังไม่ตัดรังสี CX' : `รัศมีวงเวียน ${mgF(a[a.length - 1].r)} ซม. ยังไม่เท่ากับ AB (ลองวางเข็มที่ A แล้วลากขาดินสอไปที่ B)` }; } }; },
  /* ผลบวกของความยาว: บนรังสี PX สร้าง PR = AB + CD */
  sumSeg(a = 3.1, b = 2.4) { const A = [1.4, 8], B = [1.4 + a, 8], C = [7.6, 8], Dd = [7.6 + b, 8], P = [1.8, 3], X = [13, 3], Q = mgP(P, 0, a), R = mgP(P, 0, a + b);
    return { title: 'บนรังสี PX สร้าง <b>PR = AB + CD</b> ด้วยวงเวียน', given: { pts: { A, B, C, D: Dd, P, X }, segs: [['A', 'B'], ['C', 'D']], rays: [['P', 'X']] }, compC: [12, 5.6], newNames: 'QRSTUVW',
      sol: [{ say: 'กางวงเวียนยาวเท่า AB วางเข็มที่ P เขียนส่วนโค้งตัดรังสี ได้จุด Q', ops: [{ t: 'arc', c: A, r: a, a0: -10, a1: 10 }, { t: 'arc', c: P, r: a, a0: -20, a1: 20 }, { t: 'pt', p: Q, name: 'Q' }] },
        { say: 'กางวงเวียนยาวเท่า CD วางเข็มที่ <b>Q</b> เขียนส่วนโค้งตัดรังสีต่อไป ได้จุด R', ops: [{ t: 'arc', c: C, r: b, a0: -10, a1: 10 }, { t: 'arc', c: Q, r: b, a0: -20, a1: 20 }, { t: 'pt', p: R, name: 'R' }, { t: 'away' }] }],
      marks: [{ p: Q, name: 'Q' }, { p: R, name: 'R' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> PR = AB + CD 🎉',
      goal: G => { const q = G.arcAt(P).some(x => Math.abs(x.r - a) < .12 && mgCov(x, 0)), r = G.arcAt(Q).some(x => Math.abs(x.r - b) < .12 && mgCov(x, 0)); return q && r ? { ok: true } : { ok: false, why: !q ? 'ขั้นแรก: ลอก AB จากจุด P ลงบนรังสีก่อน' : 'ต่อไปลอก CD โดยวางเข็มที่จุดปลายของส่วนแรก' }; } }; },
  /* แบ่งครึ่งส่วนของเส้นตรง AB (เส้นแบ่งครึ่งตั้งฉาก) */
  bisSeg(L = 7) { const A = [7.25 - L / 2, 4.6], B = [7.25 + L / 2, 4.6], M = mgMid(A, B), r = L / 2 + 1.2, hh = Math.sqrt(r * r - L * L / 4), Pu = [M[0], M[1] + hh], Pd = [M[0], M[1] - hh], ta = mgA(A, Pu);
    return { title: '<b>แบ่งครึ่ง AB</b>: สร้างเส้นแบ่งครึ่งตั้งฉาก แล้วหาจุดกึ่งกลาง M', given: { pts: { A, B }, segs: [['A', 'B']] }, compC: [11.8, 6.6], newNames: 'MPQRS',
      sol: [{ say: 'กางวงเวียน<b>เกินครึ่งของ AB</b> วางเข็มที่ A เขียนส่วนโค้งทั้งด้านบนและด้านล่างของ AB', ops: [{ t: 'arc', c: A, r, a0: -ta - 14, a1: ta + 14 }] },
        { say: 'ใช้<b>รัศมีเดิม</b> วางเข็มที่ B เขียนส่วนโค้งตัดกับส่วนโค้งแรกทั้งสองจุด', ops: [{ t: 'arc', c: B, r, a0: 180 - ta - 14, a1: 180 + ta + 14 }] },
        { say: 'ใช้สันตรงลากเส้นผ่านจุดตัดทั้งสองจุด — เส้นนี้ตั้งฉากกับ AB และตัด AB ที่จุดกึ่งกลาง <b>M</b>', ops: [{ t: 'seg', a: mgP(Pu, 90, .5), b: mgP(Pd, -90, .5) }, { t: 'pt', p: M, name: 'M' }, { t: 'away' }] }],
      marks: [{ p: M, name: 'M' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> AM = MB และเส้นที่ลากตั้งฉากกับ AB 🎉',
      measure: (G, X) => { const a = X(M); return `<text x="${a[0] + 8}" y="${a[1] + 26}" class="cns-len">AM = MB = ${mgF(L / 2)} ซม.</text>`; },
      goal: G => { const pr = mgEqPair(G.arcAt(A), G.arcAt(B), L / 2 + .05), ln = G.lineAt(M, 90); return pr && ln ? { ok: true } : { ok: false, why: !pr ? 'เขียนส่วนโค้งจาก A และจาก B ด้วยรัศมีเท่ากัน ที่ยาวเกินครึ่งของ AB' : 'ลากเส้นตรงผ่านจุดตัดของส่วนโค้งทั้งสองจุด' }; } }; },
  /* ลอกมุม: ที่จุด O สร้าง ∠XOY ให้เท่ากับ ∠ABC */
  copyAng(deg = 50) { const B = [1.4, 4.8], A = mgP(B, 0, 4.2), C = mgP(B, deg, 4.2), O = [7.2, 1.3], Xx = [11, 1.3], r = 2.3, P1 = mgP(B, 0, r), P2 = mgP(B, deg, r), Q1 = mgP(O, 0, r), Q2 = mgP(O, deg, r), c = mgD(P1, P2), Y = mgP(O, deg, 5.6);
    return { title: `ที่จุด O สร้าง <b>∠XOY ให้เท่ากับ ∠ABC</b> (ลอกมุมด้วยวงเวียน)`, given: { pts: { A, B, C, O, X: Xx }, rays: [['B', 'A'], ['B', 'C'], ['O', 'X']] }, compC: [11.8, 5.6], newNames: 'YPQRS',
      sol: [{ say: 'วางเข็มที่ <b>B</b> เขียนส่วนโค้งตัดแขนมุมทั้งสอง', ops: [{ t: 'arc', c: B, r, a0: -12, a1: deg + 12 }] },
        { say: '<b>รัศมีเดิม</b> วางเข็มที่ <b>O</b> เขียนส่วนโค้งยาว ๆ ตัดรังสี OX', ops: [{ t: 'arc', c: O, r, a0: -12, a1: deg + 22 }] },
        { say: 'กางวงเวียนให้ยาวเท่า<b>ระยะระหว่างจุดตัดสองจุดบนมุม ABC</b>', ops: [{ t: 'arc', c: P1, r: c, a0: mgA(P1, P2) - 12, a1: mgA(P1, P2) + 12 }] },
        { say: 'วางเข็มที่จุดตัดบน OX เขียนส่วนโค้งตัดส่วนโค้งเดิม', ops: [{ t: 'arc', c: Q1, r: c, a0: mgA(Q1, Q2) - 14, a1: mgA(Q1, Q2) + 14 }] },
        { say: 'ลากรังสีจาก O ผ่านจุดตัดนั้น ได้ <b>∠XOY = ∠ABC</b>', ops: [{ t: 'seg', a: O, b: Y }, { t: 'pt', p: Y, name: 'Y' }, { t: 'away' }] }],
      marks: [{ p: Y, name: 'Y' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠XOY = ∠ABC = ${deg}° 🎉`,
      goal: G => { const ray = G.rayAt(O, deg) || G.rayAt(O, -deg), pr = mgEqPair(G.arcAt(B), G.arcAt(O)); return ray && pr ? { ok: true } : { ok: false, why: !pr ? 'เขียนส่วนโค้งรัศมีเท่ากันจากจุด B และจากจุด O ก่อน' : 'ยังไม่ได้ลากรังสีจาก O ผ่านจุดตัดที่ทำให้มุมเท่ากัน' }; } }; },
  /* แบ่งครึ่งมุม */
  bisAng(deg = 76) { const V = [3, 1.4], A = mgP(V, 0, 7), B = mgP(V, deg, 7.2), r = 2.6, P1 = mgP(V, 0, r), P2 = mgP(V, deg, r), r2 = Math.max(2.4, mgD(P1, P2) / 2 + .9), R = mgXCC(P1, r2, P2, r2).sort((a, b) => mgD(V, b) - mgD(V, a))[0], Z = mgP(V, deg / 2, 7.4);
    return { title: `<b>แบ่งครึ่ง ∠AOB</b> ด้วยวงเวียนและสันตรง`, given: { pts: { O: V, A, B }, rays: [['O', 'A'], ['O', 'B']] }, compC: [11.8, 5.4], newNames: 'CDEFGH',
      sol: [{ say: 'วางเข็มที่จุดยอด <b>O</b> เขียนส่วนโค้งตัดแขนมุมทั้งสอง', ops: [{ t: 'arc', c: V, r, a0: -10, a1: deg + 10 }] },
        { say: 'วางเข็มที่จุดตัดบน OA เขียนส่วนโค้งในมุม', ops: [{ t: 'arc', c: P1, r: r2, a0: mgA(P1, R) - 16, a1: mgA(P1, R) + 16 }] },
        { say: '<b>รัศมีเดิม</b> วางเข็มที่จุดตัดบน OB เขียนส่วนโค้งตัดกัน', ops: [{ t: 'arc', c: P2, r: r2, a0: mgA(P2, R) - 16, a1: mgA(P2, R) + 16 }] },
        { say: 'ลากรังสีจาก O ผ่านจุดตัดนั้น เป็น<b>เส้นแบ่งครึ่งมุม</b>', ops: [{ t: 'seg', a: V, b: Z }, { t: 'pt', p: Z, name: 'C' }, { t: 'away' }] }],
      marks: [{ p: Z, name: 'C' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠AOC = ∠COB = ${mgF(deg / 2)}° 🎉`,
      goal: G => { const ray = G.rayAt(V, deg / 2), pr = G.arcAt(V).some(a => mgEqPair(G.arcAt(mgP(V, 0, a.r), .18), G.arcAt(mgP(V, deg, a.r), .18))); return ray && pr ? { ok: true } : { ok: false, why: !G.arcAt(V).length ? 'เริ่มจากวางเข็มที่จุดยอด O เขียนส่วนโค้งตัดแขนมุมทั้งสอง' : !pr ? 'เขียนส่วนโค้งรัศมีเท่ากันจากจุดตัดบน OA และบน OB' : 'ลากรังสีจาก O ผ่านจุดตัดของส่วนโค้งทั้งสอง' }; } }; },
  /* เส้นตั้งฉากที่จุด P บนเส้นตรง */
  perpAt() { const A = [1, 2.6], B = [13, 2.6], P = [7.2, 2.6], r = 2.1, Q1 = mgP(P, 180, r), Q2 = mgP(P, 0, r), r2 = 3.3, R = [P[0], P[1] + Math.sqrt(r2 * r2 - r * r)], Top = [P[0], 8.4];
    return { title: 'สร้างเส้นตรงที่<b>ตั้งฉากกับ AB ที่จุด P</b>', given: { pts: { A, B, P }, lines: [['A', 'B']] }, compC: [11.8, 5.8], newNames: 'QRSTU',
      sol: [{ say: 'วางเข็มที่ <b>P</b> เขียนส่วนโค้งตัด AB ทั้งสองข้างของ P', ops: [{ t: 'arc', c: P, r, a0: 160, a1: 200 }, { t: 'arc', c: P, r, a0: -20, a1: 20 }] },
        { say: 'กางวงเวียน<b>ให้ยาวขึ้น</b> วางเข็มที่จุดตัดทั้งสองข้าง เขียนส่วนโค้งตัดกันเหนือ P', ops: [{ t: 'arc', c: Q1, r: r2, a0: mgA(Q1, R) - 14, a1: mgA(Q1, R) + 14 }, { t: 'arc', c: Q2, r: r2, a0: mgA(Q2, R) - 14, a1: mgA(Q2, R) + 14 }] },
        { say: 'ลากเส้นจาก P ผ่านจุดตัดนั้น ได้ <b>PQ ⊥ AB</b>', ops: [{ t: 'seg', a: P, b: Top }, { t: 'pt', p: Top, name: 'Q' }, { t: 'away' }] }],
      marks: [{ p: Top, name: 'Q' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> เส้นที่ได้ตั้งฉากกับ AB (มุม 90°) 🎉',
      goal: G => { const ln = G.lineAt(P, 90), pr = G.arcAt(P).some(a => mgEqPair(G.arcAt(mgP(P, 0, a.r), .18), G.arcAt(mgP(P, 180, a.r), .18), a.r)); return ln && pr ? { ok: true } : { ok: false, why: !G.arcAt(P).length ? 'เริ่มจากวางเข็มที่ P เขียนส่วนโค้งตัด AB สองข้าง' : !pr ? 'เขียนส่วนโค้งรัศมีเท่ากัน (ยาวกว่าเดิม) จากจุดตัดทั้งสองข้าง' : 'ลากเส้นจาก P ผ่านจุดตัดของส่วนโค้ง' }; } }; },
  /* เส้นตั้งฉากจากจุด P ภายนอกเส้นตรง */
  perpFrom() { const A = [1, 2.3], B = [13, 2.3], P = [6.6, 6.5], r = 5, dd = Math.sqrt(r * r - (P[1] - A[1]) ** 2), C1 = [P[0] - dd, A[1]], C2 = [P[0] + dd, A[1]], r2 = 3.7, R = [P[0], A[1] + Math.sqrt(r2 * r2 - dd * dd)], F = [P[0], A[1]];
    return { title: 'สร้างเส้นตรงจากจุด P ให้<b>ตั้งฉากกับ AB</b>', given: { pts: { A, B, P }, lines: [['A', 'B']] }, compC: [11.6, 5.4], newNames: 'QRSTU',
      sol: [{ say: 'วางเข็มที่ <b>P</b> กางให้ยาวพอ เขียนส่วนโค้งตัด AB สองจุด', ops: [{ t: 'arc', c: P, r, a0: mgA(P, C1) - 8, a1: mgA(P, C2) + 8 }] },
        { say: 'วางเข็มที่จุดตัดทั้งสอง เขียนส่วนโค้ง<b>รัศมีเท่ากัน</b>ตัดกัน', ops: [{ t: 'arc', c: C1, r: r2, a0: mgA(C1, R) - 14, a1: mgA(C1, R) + 14 }, { t: 'arc', c: C2, r: r2, a0: mgA(C2, R) - 14, a1: mgA(C2, R) + 14 }] },
        { say: 'ลากเส้นจาก P ผ่านจุดตัดนั้นลงมาถึง AB ที่จุด <b>Q</b> → PQ ⊥ AB', ops: [{ t: 'seg', a: P, b: F }, { t: 'pt', p: F, name: 'Q' }, { t: 'away' }] }],
      marks: [{ p: F, name: 'Q' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> PQ ตั้งฉากกับ AB — PQ เป็นระยะที่สั้นที่สุดจาก P ถึง AB 🎉',
      goal: G => { const ln = G.lineAt(P, 90) && G.segs().some(s => mgDseg(s, P) < .14 && mgDseg(s, F) < .2), pr = G.arcAt(P).some(a => { const xs = mgXLC(A, 0, P, a.r); return xs.length === 2 && mgEqPair(G.arcAt(xs[0], .18), G.arcAt(xs[1], .18)); }); return ln && pr ? { ok: true } : { ok: false, why: !G.arcAt(P).length ? 'เริ่มจากวางเข็มที่ P เขียนส่วนโค้งตัด AB สองจุด' : !pr ? 'เขียนส่วนโค้งรัศมีเท่ากันจากจุดตัดทั้งสองบน AB' : 'ลากเส้นจาก P ผ่านจุดตัดของส่วนโค้งให้ถึง AB' }; } }; },
  /* มุมขนาดต่าง ๆ ด้วยวงเวียนและสันตรง (0 กับ 180 อยู่บนเส้นตรง · 60/120 จากรูปสามเหลี่ยมด้านเท่า · ที่เหลือแบ่งครึ่ง) */
  angle(deg) { const O = [7.25, 1.3], A = [12.6, 1.3], R0 = 3, Pt = d => mgP(O, d, R0), sol = [], have = new Set([0, 180]);
    const BIS = { 90: [0, 180], 30: [0, 60], 150: [120, 180], 45: [0, 90], 135: [90, 180], 75: [60, 90], 105: [90, 120], 15: [0, 30], 165: [150, 180], 22.5: [0, 45] };
    sol.push({ say: 'วางเข็มที่ <b>O</b> เขียนครึ่งวงกลมตัดเส้นตรงทั้งสองข้าง', ops: [{ t: 'arc', c: O, r: R0, a0: 0, a1: 180 }] });
    const make = (d, last) => { if (have.has(d)) return; if (d === 60 || d === 120) { const c = d === 60 ? Pt(0) : Pt(180), dd = mgA(c, Pt(d)); sol.push({ say: `<b>รัศมีเดิม</b> วางเข็มที่จุดตัด${d === 60 ? 'ทางขวา' : 'ทางซ้าย'} เขียนส่วนโค้งตัดครึ่งวงกลม → ได้มุม ${d}° (รูปสามเหลี่ยมด้านเท่า)`, ops: [{ t: 'arc', c, r: R0, a0: dd - 14, a1: dd + 14 }] }); have.add(d); if (!last) sol.push({ say: `ลากรังสีจาก O ผ่านจุดตัดนั้น (มุม ${d}°)`, ops: [{ t: 'seg', a: O, b: mgP(O, d, 6.4) }] }); return; }
      const [a, b] = BIS[d]; make(a); make(b); const c1 = Pt(a), c2 = Pt(b), r2 = Math.max(2.4, mgD(c1, c2) / 2 + .9), R = mgXCC(c1, r2, c2, r2).sort((x, y) => mgD(O, y) - mgD(O, x))[0];
      sol.push({ say: `แบ่งครึ่งมุมระหว่าง ${a}° กับ ${b}°: วางเข็มที่จุดบนครึ่งวงกลมทั้งสอง เขียนส่วนโค้งรัศมีเท่ากันตัดกัน`, ops: [{ t: 'arc', c: c1, r: r2, a0: mgA(c1, R) - 13, a1: mgA(c1, R) + 13 }, { t: 'arc', c: c2, r: r2, a0: mgA(c2, R) - 13, a1: mgA(c2, R) + 13 }] }); have.add(d);
      if (!last) sol.push({ say: `ลากรังสีจาก O ผ่านจุดตัด ได้มุม ${d}°`, ops: [{ t: 'seg', a: O, b: mgP(O, d, 6.4) }] }); };
    make(deg, true); const Bp = mgP(O, deg, 6.6); sol.push({ say: `ลากรังสี OB ผ่านจุดตัดสุดท้าย ได้ <b>∠AOB = ${deg}°</b>`, ops: [{ t: 'seg', a: O, b: Bp }, { t: 'pt', p: Bp, name: 'B' }, { t: 'away' }] });
    return { title: `สร้าง <b>∠AOB = ${deg}°</b> ด้วยวงเวียนและสันตรง (ไม่ใช้ครึ่งวงกลม)`, given: { pts: { O, A }, lines: [['O', 'A']] }, compC: [2.6, 5.4], rulO: [1, 8.2], newNames: 'BCDEFGH',
      sol, marks: [{ p: Bp, name: 'B' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠AOB = ${deg}° 🎉`,
      measure: (G, X) => { const a = X(mgP(O, deg / 2, 1.5)); return `<text x="${a[0]}" y="${a[1]}" text-anchor="middle" class="cns-deg">${deg}°</text>`; },
      goal: G => { const ray = G.rayAt(O, deg, 1.4), n = G.nArcs() >= 2; return ray && n ? { ok: true } : { ok: false, why: !n ? 'ต้องใช้วงเวียนสร้าง (ยังเขียนส่วนโค้งไม่พอ)' : `ยังไม่มีรังสีจาก O ที่ทำมุม ${deg}° กับ OA` }; } }; },
  /* ครึ่งวงกลม (โปรแทรกเตอร์): สร้างมุมตามขนาดที่กำหนด */
  protAng(deg) { const O = [3.6, 1.6], A = [9.5, 1.6], Bp = mgP(O, deg, 6);
    return { title: `ใช้<b>ครึ่งวงกลม</b>สร้าง <b>∠AOB = ${deg}°</b>`, given: { pts: { O, A }, rays: [['O', 'A']] }, tools: ['point', 'ruler', 'prot'], tool0: 'prot', protC: [11, 6.2], rulO: [1, 8.2], newNames: 'BCDE',
      sol: [{ say: 'วางจุดศูนย์กลางครึ่งวงกลมที่ <b>O</b> ให้เส้นฐาน (0°) ทับรังสี OA', ops: [{ t: 'prot', c: O, rot: 0 }] },
        { say: `อ่านสเกลที่เริ่มจาก 0 ตรง OA ไปถึง <b>${deg}</b> แล้วทำเครื่องหมาย ✕`, ops: [{ t: 'mark', c: O, rot: 0, deg }] },
        { say: 'ใช้สันตรงลากรังสีจาก O ผ่านเครื่องหมาย ✕', ops: [{ t: 'seg', a: O, b: Bp }, { t: 'pt', p: Bp, name: 'B' }, { t: 'away' }] }],
      marks: [{ p: Bp, name: 'B' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠AOB = ${deg}° 🎉`,
      measure: (G, X) => { const a = X(mgP(O, deg / 2, 1.3)); return `<text x="${a[0]}" y="${a[1]}" text-anchor="middle" class="cns-deg">${deg}°</text>`; },
      goal: G => G.rayAt(O, deg, 1.2) ? { ok: true } : { ok: false, why: `ยังไม่มีรังสีจาก O ที่ทำมุม ${deg}° กับ OA` } }; },
  /* เส้นขนานผ่านจุด P (ลอกมุมแย้ง/มุมภายนอกและภายในข้างเดียวกัน) */
  parallel() { const A = [1, 2], B = [13, 2], P = [8.4, 6.2], Q = [5.4, 2], th = mgA(Q, P), r = 1.9, Q1 = mgP(Q, 0, r), Q2 = mgP(Q, th, r), P1 = mgP(P, 0, r), P2 = mgP(P, th, r), c = mgD(Q1, Q2), E1 = [2.6, P[1]], E2 = [13.2, P[1]];
    return { title: 'สร้างเส้นตรงผ่านจุด P ให้<b>ขนานกับ AB</b>', given: { pts: { A, B, P }, lines: [['A', 'B']] }, compC: [2.6, 5.6], newNames: 'QRSTUV',
      sol: [{ say: 'ลากเส้นผ่าน P ตัด AB ที่จุด <b>Q</b> (เส้นตัด)', ops: [{ t: 'seg', a: mgP(Q, th + 180, .6), b: mgP(P, th, 2.4) }, { t: 'pt', p: Q, name: 'Q' }] },
        { say: 'วางเข็มที่ <b>Q</b> เขียนส่วนโค้งตัด QB และ QP', ops: [{ t: 'arc', c: Q, r, a0: -10, a1: th + 10 }] },
        { say: '<b>รัศมีเดิม</b> วางเข็มที่ <b>P</b> เขียนส่วนโค้งแบบเดียวกัน', ops: [{ t: 'arc', c: P, r, a0: -14, a1: th + 10 }] },
        { say: 'กางวงเวียนยาวเท่าระยะระหว่างจุดตัดสองจุดที่ Q แล้วไปเขียนตัดที่ P', ops: [{ t: 'arc', c: Q2, r: c, a0: mgA(Q2, Q1) - 10, a1: mgA(Q2, Q1) + 10 }, { t: 'arc', c: P2, r: c, a0: mgA(P2, P1) - 13, a1: mgA(P2, P1) + 13 }] },
        { say: 'ลากเส้นผ่าน P กับจุดตัดนั้น → มุมที่ P เท่ากับมุมที่ Q (มุมภายนอกและภายในข้างเดียวกันของเส้นตัด) จึง<b>ขนานกับ AB</b>', ops: [{ t: 'seg', a: E1, b: E2 }, { t: 'away' }] }],
      okMsg: '<b>สร้างเสร็จแล้ว!</b> เส้นที่ผ่าน P ขนานกับ AB 🎉',
      goal: G => { const ln = G.lineAt(P, 0, 1.3), tr = G.segs().some(s => mgDseg(s, P) < .15 && mgLd(mgA(s[0], s[1]), 0) > 15 && Math.min(s[0][1], s[1][1]) < A[1] + .12), n = G.nArcs() >= 3; return ln && tr && n ? { ok: true } : { ok: false, why: !tr ? 'เริ่มจากลากเส้นตัดผ่าน P ไปตัด AB' : !n ? 'ลอกมุมที่จุดตัดบน AB ไปไว้ที่ P ด้วยวงเวียน' : 'ลากเส้นผ่าน P ที่ทำมุมเท่ากับมุมที่ Q' }; } }; },
  /* รูปสามเหลี่ยม ABC: ฐาน AB บนรังสีที่กำหนด · kind 'sss' | 'sas' | 'asa' */
  tri(kind, o) { const A = [2.4, 1.5], Xx = [13.2, 1.5]; let B, C, sol = [], title, tools = ['point', 'ruler', 'comp'];
    if (kind === 'sss') { const { c, b, a } = o; B = mgP(A, 0, c); C = mgXCC(A, b, B, a).sort((p, q) => q[1] - p[1])[0];
      title = `สร้าง<b>รูปสามเหลี่ยม ABC</b> ให้ AB = ${c} ซม. BC = ${a} ซม. และ CA = ${b} ซม.`;
      sol = [{ say: `วัดจาก A ไปตามรังสี ${c} ซม. ได้จุด <b>B</b> (ใช้ไม้บรรทัด หรือกางวงเวียน ${c} ซม.)`, ops: [{ t: 'arc', c: A, r: c, a0: -12, a1: 12 }, { t: 'pt', p: B, name: 'B' }] },
        { say: `กางวงเวียน ${b} ซม. วางเข็มที่ <b>A</b> เขียนส่วนโค้งด้านบน`, ops: [{ t: 'arc', c: A, r: b, a0: mgA(A, C) - 16, a1: mgA(A, C) + 16 }] },
        { say: `กางวงเวียน ${a} ซม. วางเข็มที่ <b>B</b> เขียนส่วนโค้งตัดกัน ได้จุด <b>C</b>`, ops: [{ t: 'arc', c: B, r: a, a0: mgA(B, C) - 16, a1: mgA(B, C) + 16 }, { t: 'pt', p: C, name: 'C' }] },
        { say: 'ลาก AC และ BC', ops: [{ t: 'seg', a: A, b: C }, { t: 'seg', a: B, b: C }, { t: 'away' }] }]; }
    else if (kind === 'sas') { const { c, b, A: dA } = o; B = mgP(A, 0, c); C = mgP(A, dA, b); tools = ['point', 'ruler', 'comp', 'prot'];
      title = `สร้าง<b>รูปสามเหลี่ยม ABC</b> ให้ AB = ${c} ซม. ∠A = ${dA}° และ AC = ${b} ซม.`;
      sol = [{ say: `วัดจาก A ไปตามรังสี ${c} ซม. ได้จุด <b>B</b>`, ops: [{ t: 'arc', c: A, r: c, a0: -12, a1: 12 }, { t: 'pt', p: B, name: 'B' }] },
        { say: `วางครึ่งวงกลมที่ A ทำเครื่องหมายที่ ${dA}° แล้วลากรังสีผ่านเครื่องหมาย`, ops: [{ t: 'prot', c: A, rot: 0 }, { t: 'mark', c: A, rot: 0, deg: dA }, { t: 'seg', a: A, b: mgP(A, dA, b + 1.2) }] },
        { say: `กางวงเวียน ${b} ซม. วางเข็มที่ A เขียนส่วนโค้งตัดรังสี ได้จุด <b>C</b>`, ops: [{ t: 'arc', c: A, r: b, a0: dA - 12, a1: dA + 12 }, { t: 'pt', p: C, name: 'C' }] },
        { say: 'ลาก BC', ops: [{ t: 'seg', a: B, b: C }, { t: 'away' }] }]; }
    else { const { c, A: dA, B: dB } = o; B = mgP(A, 0, c); const sA = Math.sin(dB * Math.PI / 180) / Math.sin((180 - dA - dB) * Math.PI / 180) * c; C = mgP(A, dA, sA); tools = ['point', 'ruler', 'comp', 'prot'];
      title = `สร้าง<b>รูปสามเหลี่ยม ABC</b> ให้ AB = ${c} ซม. ∠A = ${dA}° และ ∠B = ${dB}°`;
      sol = [{ say: `วัดจาก A ไปตามรังสี ${c} ซม. ได้จุด <b>B</b>`, ops: [{ t: 'arc', c: A, r: c, a0: -12, a1: 12 }, { t: 'pt', p: B, name: 'B' }] },
        { say: `ที่ A ทำมุม ${dA}° แล้วลากรังสี`, ops: [{ t: 'prot', c: A, rot: 0 }, { t: 'mark', c: A, rot: 0, deg: dA }, { t: 'seg', a: A, b: mgP(A, dA, sA + 1) }] },
        { say: `ที่ B ทำมุม ${dB}° (วัดจาก BA) แล้วลากรังสีตัดกัน ได้จุด <b>C</b>`, ops: [{ t: 'prot', c: B, rot: 0 }, { t: 'mark', c: B, rot: 0, deg: 180 - dB }, { t: 'seg', a: B, b: mgP(B, 180 - dB, mgD(B, C) + 1) }, { t: 'pt', p: C, name: 'C' }, { t: 'away' }] }]; }
    const L = [mgD(A, B), mgD(B, C), mgD(C, A)].sort((x, y) => x - y);
    return { title, given: { pts: { A, X: Xx }, rays: [['A', 'X']] }, tools, compC: [11.8, 5.6], protC: [11.2, 6], rulO: [1, 8.3], newNames: 'BCDEFGH', sol, marks: [{ p: B, name: 'B' }, { p: C, name: 'C' }],
      okMsg: '<b>สร้างเสร็จแล้ว!</b> ได้รูปสามเหลี่ยม ABC ตามโจทย์ 🎉',
      measure: (G, X) => { let s = ''; [[A, B], [B, C], [C, A]].forEach(([p, q]) => { const m = X(mgMid(p, q)), d = mgA(p, q), n = mgU(d - 90), off = [n[0] * 18, -n[1] * 18]; s += `<text x="${m[0] + off[0]}" y="${m[1] + off[1] + 5}" text-anchor="middle" class="cns-len">${mgF(mgD(p, q))}</text>`; }); return s; },
      goal: G => { const t = G.tris().find(tr => { const l = [mgD(tr[0], tr[1]), mgD(tr[1], tr[2]), mgD(tr[2], tr[0])].sort((x, y) => x - y); return l.every((v, i) => Math.abs(v - L[i]) < .18); });
        if (t) return { ok: true }; const any = G.tris()[0]; return { ok: false, why: any ? `รูปสามเหลี่ยมที่ได้มีด้านยาว ${[mgD(any[0], any[1]), mgD(any[1], any[2]), mgD(any[2], any[0])].map(mgF).join(', ')} ซม. ยังไม่ตรงโจทย์` : 'ยังไม่ได้รูปสามเหลี่ยมที่มีด้านครบ 3 ด้าน' }; } }; }
};

/* =========================================================
   v231 — งานสร้างเพิ่ม (ใช้กับบทเรียน 12 ด่านชุดใหม่)
   ========================================================= */
Object.assign(mgT, {
  /* สร้างส่วนของเส้นตรงตามความยาวที่กำหนด (ไม้บรรทัดหรือวงเวียน) */
  segLen(L = 5) { const P = [2, 3], X = [12.8, 3], Q = mgP(P, 0, L);
    return { title: `บนรังสี PX สร้าง <b>PQ ยาว ${mgF(L)} ซม.</b>`, given: { pts: { P, X }, rays: [['P', 'X']] }, compC: [11.6, 6.4], rulO: [1, 7.6], newNames: 'QRST',
      sol: [{ say: `กางวงเวียนบนไม้บรรทัดให้ยาว <b>${mgF(L)} ซม.</b> แล้ววางเข็มที่ <b>P</b> เขียนส่วนโค้งตัดรังสี`, ops: [{ t: 'arc', c: P, r: L, a0: -14, a1: 14 }] },
        { say: 'จุดที่ส่วนโค้งตัดรังสีคือ <b>Q</b> → PQ ยาวตามที่กำหนด', ops: [{ t: 'pt', p: Q, name: 'Q' }, { t: 'away' }] }],
      marks: [{ p: Q, name: 'Q' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> PQ ยาว ${mgF(L)} ซม. 🎉`,
      goal: G => G.arcAt(P).some(x => Math.abs(x.r - L) < .12 && mgCov(x, 0)) || G.hasPt(Q, .12) ? { ok: true } : { ok: false, why: `วางเข็มที่ P กางวงเวียน ${mgF(L)} ซม. (เทียบกับไม้บรรทัด) แล้วเขียนส่วนโค้งตัดรังสี` } }; },
  /* ผลต่างของความยาว: PR = AB − CD */
  diffSeg(a = 5.2, b = 2.1) { const A = [1.4, 8], B = [1.4 + a, 8], C = [8.4, 8], Dd = [8.4 + b, 8], P = [1.8, 3], X = [13, 3], Q = mgP(P, 0, a), R = mgP(P, 0, a - b);
    return { title: 'บนรังสี PX สร้าง <b>PR = AB − CD</b> ด้วยวงเวียน', given: { pts: { A, B, C, D: Dd, P, X }, segs: [['A', 'B'], ['C', 'D']], rays: [['P', 'X']] }, compC: [12, 5.6], newNames: 'QRSTUVW',
      sol: [{ say: 'ลอก AB จาก P ลงบนรังสี ได้จุด <b>Q</b> (PQ = AB)', ops: [{ t: 'arc', c: A, r: a, a0: -10, a1: 10 }, { t: 'arc', c: P, r: a, a0: -16, a1: 16 }, { t: 'pt', p: Q, name: 'Q' }] },
        { say: 'กางวงเวียนยาวเท่า CD วางเข็มที่ <b>Q</b> เขียนส่วนโค้ง<b>ย้อนกลับ</b>มาทาง P ได้จุด <b>R</b>', ops: [{ t: 'arc', c: C, r: b, a0: -10, a1: 10 }, { t: 'arc', c: Q, r: b, a0: 162, a1: 198 }, { t: 'pt', p: R, name: 'R' }, { t: 'away' }] }],
      marks: [{ p: Q, name: 'Q' }, { p: R, name: 'R' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> PR = AB − CD 🎉',
      goal: G => { const q = G.arcAt(P).some(x => Math.abs(x.r - a) < .12 && mgCov(x, 0)), r = G.arcAt(Q).some(x => Math.abs(x.r - b) < .12 && mgCov(x, 180)); return q && r ? { ok: true } : { ok: false, why: !q ? 'ขั้นแรก: ลอก AB จากจุด P ลงบนรังสีก่อน' : 'ต่อไปลอก CD จากจุดปลาย Q ย้อนกลับมาทาง P' }; } }; },
  /* k เท่าของความยาว: PR = k × AB */
  kSeg(a = 2.4, k = 3) { const A = [1.4, 8], B = [1.4 + a, 8], P = [1.8, 3], X = [13, 3], pts = Array.from({ length: k + 1 }, (_, i) => mgP(P, 0, a * i)), nm = 'QRSTU';
    const sol = [{ say: 'กางวงเวียนยาวเท่า <b>AB</b>', ops: [{ t: 'arc', c: A, r: a, a0: -10, a1: 10 }] }];
    for (let i = 0; i < k; i++) sol.push({ say: `วางเข็มที่${i ? `จุด <b>${nm[i - 1]}</b>` : ' <b>P</b>'} เขียนส่วนโค้งตัดรังสี ได้จุด <b>${nm[i]}</b>`, ops: [{ t: 'arc', c: pts[i], r: a, a0: -16, a1: 16 }, { t: 'pt', p: pts[i + 1], name: nm[i] }, ...(i === k - 1 ? [{ t: 'away' }] : [])] });
    return { title: `บนรังสี PX สร้างส่วนของเส้นตรงยาว <b>${k} เท่าของ AB</b>`, given: { pts: { A, B, P, X }, segs: [['A', 'B']], rays: [['P', 'X']] }, compC: [12, 5.6], newNames: 'QRSTUVW',
      sol, marks: pts.slice(1).map((p, i) => ({ p, name: nm[i] })), okMsg: `<b>สร้างเสร็จแล้ว!</b> ยาว ${k} × AB = ${mgF(a * k)} ซม. 🎉`,
      goal: G => { const bad = pts.slice(0, k).findIndex(p => !G.arcAt(p).some(x => Math.abs(x.r - a) < .12 && mgCov(x, 0))); return bad < 0 ? { ok: true } : { ok: false, why: bad === 0 ? 'เริ่มจากลอก AB จากจุด P' : `ลอก AB ต่อจากจุดปลายที่ได้ (ครั้งที่ ${bad + 1})` }; } }; },
  /* แบ่งส่วนของเส้นตรงเป็น 4 ส่วนเท่ากัน (แบ่งครึ่งซ้ำ) */
  quartSeg(L = 9.6) { const A = [7.25 - L / 2, 4.4], B = [7.25 + L / 2, 4.4], M = mgMid(A, B), Q1 = mgMid(A, M), Q3 = mgMid(M, B), sol = [];
    const bis = (p, q, nmM, last) => { const l = mgD(p, q), r = l / 2 + .9, hh = Math.sqrt(r * r - l * l / 4), m = mgMid(p, q), ta = Math.atan2(hh, l / 2) * 180 / Math.PI;
      sol.push({ say: `แบ่งครึ่ง ${nmM[0]}: วางเข็มที่ปลายทั้งสอง เขียนส่วนโค้งรัศมีเท่ากัน (เกินครึ่ง) ตัดกันสองจุด`, ops: [{ t: 'arc', c: p, r, a0: -ta - 12, a1: ta + 12 }, { t: 'arc', c: q, r, a0: 180 - ta - 12, a1: 180 + ta + 12 }] });
      sol.push({ say: `ลากเส้นผ่านจุดตัดทั้งสอง ได้จุดกึ่งกลาง <b>${nmM[1]}</b>`, ops: [{ t: 'seg', a: [m[0], m[1] + hh + .4], b: [m[0], m[1] - hh - .4] }, { t: 'pt', p: m, name: nmM[1] }, ...(last ? [{ t: 'away' }] : [])] }); };
    bis(A, B, ['AB', 'M']); bis(A, M, ['AM', 'C']); bis(M, B, ['MB', 'D'], true);
    return { title: '<b>แบ่ง AB เป็น 4 ส่วนเท่ากัน</b> (แบ่งครึ่ง แล้วแบ่งครึ่งอีกครั้ง)', given: { pts: { A, B }, segs: [['A', 'B']] }, compC: [13, 6], newNames: 'MCDEFGH', sol,
      marks: [{ p: M, name: 'M' }, { p: Q1, name: 'C' }, { p: Q3, name: 'D' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> AC = CM = MD = DB = ${mgF(L / 4)} ซม. 🎉`,
      goal: G => { const a = G.lineAt(M, 90), b = G.lineAt(Q1, 90), c = G.lineAt(Q3, 90); return a && b && c ? { ok: true } : { ok: false, why: !a ? 'แบ่งครึ่ง AB ก่อน (ได้จุดกึ่งกลาง M)' : 'แบ่งครึ่ง AM และ MB อีกครั้ง' }; } }; },
  /* เขียนวงกลม: จุดศูนย์กลาง O รัศมี r */
  circ(r = 3) { const O = [6, 4.7];
    return { title: `เขียน<b>วงกลม</b> จุดศูนย์กลาง O รัศมี ${mgF(r)} ซม.`, given: { pts: { O } }, compC: [11.8, 6], rulO: [1, .9], newNames: 'ABC',
      sol: [{ say: `กางวงเวียนบนไม้บรรทัดให้ห่าง <b>${mgF(r)} ซม.</b> (ระยะนี้คือ<b>รัศมี</b>)`, ops: [{ t: 'arc', c: O, r, a0: 0, a1: 20 }] }, { say: 'วางเข็มที่จุดศูนย์กลาง <b>O</b> แล้วหมุนวงเวียนรอบเดียว', ops: [{ t: 'arc', c: O, r, a0: 0, a1: 360 }, { t: 'away' }] }],
      okMsg: `<b>เขียนเสร็จแล้ว!</b> ทุกจุดบนวงกลมห่างจาก O เท่ากัน = ${mgF(r)} ซม. 🎉`,
      goal: G => G.arcAt(O).some(x => Math.abs(x.r - r) < .12 && x.a1 - x.a0 >= 300) ? { ok: true } : { ok: false, why: G.arcAt(O).some(x => Math.abs(x.r - r) < .12) ? 'หมุนวงเวียนต่อให้ครบรอบ' : `วางเข็มที่ O และกางวงเวียนให้ยาว ${mgF(r)} ซม.` } }; },
  /* จุดตัดของส่วนโค้ง: หาจุด C ที่ห่างจาก A และ B ตามที่กำหนด */
  meet(ra = 4, rb = 3, d = 5) { const A = [4.2, 2.4], B = [4.2 + d, 2.4], C = mgXCC(A, ra, B, rb).sort((p, q) => q[1] - p[1])[0];
    return { title: `หาจุด C ที่ห่างจาก A <b>${mgF(ra)} ซม.</b> และห่างจาก B <b>${mgF(rb)} ซม.</b> (อยู่เหนือ AB)`, given: { pts: { A, B }, segs: [['A', 'B']] }, compC: [11.2, 6], rulO: [.8, 8.4], newNames: 'CDE',
      sol: [{ say: `กางวงเวียน ${mgF(ra)} ซม. วางเข็มที่ <b>A</b> เขียนส่วนโค้ง — ทุกจุดบนส่วนโค้งนี้ห่างจาก A ${mgF(ra)} ซม.`, ops: [{ t: 'arc', c: A, r: ra, a0: mgA(A, C) - 22, a1: mgA(A, C) + 22 }] },
        { say: `กางวงเวียน ${mgF(rb)} ซม. วางเข็มที่ <b>B</b> เขียนส่วนโค้งตัดกัน — <b>จุดตัด</b>ห่างจากทั้งสองจุดตามที่ต้องการ`, ops: [{ t: 'arc', c: B, r: rb, a0: mgA(B, C) - 22, a1: mgA(B, C) + 22 }, { t: 'pt', p: C, name: 'C' }, { t: 'away' }] }],
      marks: [{ p: C, name: 'C' }], okMsg: `<b>หาจุด C ได้แล้ว!</b> CA = ${mgF(ra)} ซม. และ CB = ${mgF(rb)} ซม. 🎉`,
      goal: G => { const a = G.arcAt(A).some(x => Math.abs(x.r - ra) < .12 && mgCov(x, mgA(A, C))), b = G.arcAt(B).some(x => Math.abs(x.r - rb) < .12 && mgCov(x, mgA(B, C))); return a && b ? { ok: true } : { ok: false, why: !a ? `เขียนส่วนโค้งรัศมี ${mgF(ra)} ซม. จากจุด A ให้ผ่านด้านบนของ AB` : `เขียนส่วนโค้งรัศมี ${mgF(rb)} ซม. จากจุด B ให้ตัดส่วนโค้งแรก` }; } }; },
  /* ผลบวกของมุม: ที่ O สร้าง ∠XOZ = ∠ABC + ∠DEF */
  sumAng(a = 40, b = 35) { const Bv = [1.2, 6.2], Ev = [6, 6.2], O = [2.6, 1.2], Xx = [12.6, 1.2], r = 1.6, sol = [];
    const A1 = mgP(Bv, 0, 3), C1 = mgP(Bv, a, 3), D1 = mgP(Ev, 0, 3), F1 = mgP(Ev, b, 3);
    const copy = (V, deg, base, nm, last) => { const P1 = mgP(V, 0, r), P2 = mgP(V, deg, r), Q1 = mgP(O, base, r), Q2 = mgP(O, base + deg, r), c = mgD(P1, P2), Y = mgP(O, base + deg, 6.2);
      sol.push({ say: `วางเข็มที่จุดยอดของมุม${base ? 'ที่สอง' : 'แรก'} เขียนส่วนโค้งตัดแขนทั้งสอง แล้วใช้<b>รัศมีเดิม</b>เขียนส่วนโค้งที่ O`, ops: [{ t: 'arc', c: V, r, a0: -12, a1: deg + 12 }, { t: 'arc', c: O, r, a0: base - 8, a1: base + deg + 20 }] });
      sol.push({ say: 'กางวงเวียนเท่าระยะระหว่างจุดตัดบนมุมเดิม ไปเขียนตัดที่ส่วนโค้งของ O', ops: [{ t: 'arc', c: P1, r: c, a0: mgA(P1, P2) - 12, a1: mgA(P1, P2) + 12 }, { t: 'arc', c: Q1, r: c, a0: mgA(Q1, Q2) - 14, a1: mgA(Q1, Q2) + 14 }] });
      sol.push({ say: `ลากรังสีจาก O ผ่านจุดตัด ได้รังสี <b>O${nm}</b>`, ops: [{ t: 'seg', a: O, b: Y }, { t: 'pt', p: Y, name: nm }, ...(last ? [{ t: 'away' }] : [])] }); };
    copy(Bv, a, 0, 'Y'); copy(Ev, b, a, 'Z', true);
    return { title: `ที่จุด O สร้าง <b>∠XOZ = ∠ABC + ∠DEF</b>`, given: { pts: { A: A1, B: Bv, C: C1, D: D1, E: Ev, F: F1, O, X: Xx }, segs: [['B', 'A'], ['B', 'C'], ['E', 'D'], ['E', 'F']], rays: [['O', 'X']] }, compC: [12.2, 6.6], newNames: 'YZPQRS', sol,
      marks: [{ p: mgP(O, a, 6.2), name: 'Y' }, { p: mgP(O, a + b, 6.2), name: 'Z' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠XOZ = ${a}° + ${b}° = ${a + b}° 🎉`,
      goal: G => { const r1 = G.rayAt(O, a), r2 = G.rayAt(O, a + b); return r1 && r2 && G.nArcs() >= 4 ? { ok: true } : { ok: false, why: !r1 ? 'ลอก ∠ABC ไปไว้ที่ O บนรังสี OX ก่อน' : 'ลอก ∠DEF ต่อจากรังสีใหม่ที่ได้' }; } }; },
  /* เส้นขนานโดยอาศัยเส้นตั้งฉากสองครั้ง */
  parPerp() { const A = [1, 2], B = [13, 2], P = [7, 6], r = 5, dd = Math.sqrt(r * r - 16), C1 = [P[0] - dd, 2], C2 = [P[0] + dd, 2], r2 = 3.6, R = [P[0], 2 + Math.sqrt(r2 * r2 - dd * dd)], F = [P[0], 2], s = 1.3, U1 = [P[0], P[1] + s], U2 = [P[0], P[1] - s], r3 = 2.1, hx = Math.sqrt(r3 * r3 - s * s);
    return { title: 'สร้างเส้นผ่าน P ให้<b>ขนานกับ AB</b> โดยใช้<b>เส้นตั้งฉากสองครั้ง</b>', given: { pts: { A, B, P }, lines: [['A', 'B']] }, compC: [2.4, 7.4], newNames: 'QRSTUV',
      sol: [{ say: '① สร้างเส้นตั้งฉากจาก P ไปยัง AB: วางเข็มที่ P เขียนส่วนโค้งตัด AB สองจุด', ops: [{ t: 'arc', c: P, r, a0: mgA(P, C1) - 8, a1: mgA(P, C2) + 8 }] },
        { say: 'วางเข็มที่จุดตัดทั้งสอง เขียนส่วนโค้งรัศมีเท่ากันตัดกัน', ops: [{ t: 'arc', c: C1, r: r2, a0: mgA(C1, R) - 14, a1: mgA(C1, R) + 14 }, { t: 'arc', c: C2, r: r2, a0: mgA(C2, R) - 14, a1: mgA(C2, R) + 14 }] },
        { say: 'ลากเส้นผ่าน P กับจุดตัด ลงถึง AB ที่ <b>Q</b> → PQ ⊥ AB', ops: [{ t: 'seg', a: [P[0], 8.6], b: F }, { t: 'pt', p: F, name: 'Q' }] },
        { say: '② สร้างเส้นตั้งฉากกับ PQ ที่จุด P: วางเข็มที่ P เขียนส่วนโค้งตัด PQ สองข้างของ P', ops: [{ t: 'arc', c: P, r: s, a0: 70, a1: 110 }, { t: 'arc', c: P, r: s, a0: 250, a1: 290 }] },
        { say: 'กางวงเวียนให้ยาวขึ้น วางเข็มที่จุดตัดทั้งสองข้าง เขียนส่วนโค้งตัดกันทางขวาของ P', ops: [{ t: 'arc', c: U1, r: r3, a0: mgA(U1, [P[0] + hx, P[1]]) - 12, a1: mgA(U1, [P[0] + hx, P[1]]) + 12 }, { t: 'arc', c: U2, r: r3, a0: mgA(U2, [P[0] + hx, P[1]]) - 12, a1: mgA(U2, [P[0] + hx, P[1]]) + 12 }] },
        { say: 'ลากเส้นผ่าน P กับจุดตัด → ตั้งฉากกับ PQ จึง<b>ขนานกับ AB</b>', ops: [{ t: 'seg', a: [1.4, P[1]], b: [13, P[1]] }, { t: 'away' }] }],
      okMsg: '<b>สร้างเสร็จแล้ว!</b> เส้นที่ผ่าน P ตั้งฉากกับ PQ เหมือน AB จึงขนานกับ AB 🎉',
      goal: G => { const v = G.lineAt(P, 90), hz = G.lineAt(P, 0, 1.3); return v && hz && G.nArcs() >= 4 ? { ok: true } : { ok: false, why: !v ? 'ขั้นแรก: สร้างเส้นตั้งฉากจาก P ไปยัง AB' : 'ต่อไป: สร้างเส้นตั้งฉากกับเส้นนั้นที่จุด P' }; } }; },
  /* ส่วนสูงของรูปสามเหลี่ยม: เส้นตั้งฉากจากจุดยอด C ไปยังฐาน AB */
  altitude() { const A = [1.4, 2.6], B = [12.6, 2.6], C = [5.2, 7.8], r = 5.8, dd = Math.sqrt(r * r - (C[1] - A[1]) ** 2), C1 = [C[0] - dd, A[1]], C2 = [C[0] + dd, A[1]], r2 = 3.2, R = [C[0], A[1] - Math.sqrt(r2 * r2 - dd * dd)], F = [C[0], A[1]];
    return { title: 'สร้าง<b>ส่วนสูง</b>ของรูปสามเหลี่ยม ABC จากจุดยอด C ไปยังฐาน AB', given: { pts: { A, B, C }, segs: [['A', 'B'], ['B', 'C'], ['C', 'A']] }, compC: [11.4, 6.2], newNames: 'DEFGH',
      sol: [{ say: 'วางเข็มที่ <b>C</b> เขียนส่วนโค้งตัดฐาน AB สองจุด', ops: [{ t: 'arc', c: C, r, a0: mgA(C, C1) - 6, a1: mgA(C, C2) + 6 }] },
        { say: 'วางเข็มที่จุดตัดทั้งสอง เขียนส่วนโค้งรัศมีเท่ากันตัดกัน<b>ใต้ฐาน</b>', ops: [{ t: 'arc', c: C1, r: r2, a0: mgA(C1, R) - 14, a1: mgA(C1, R) + 14 }, { t: 'arc', c: C2, r: r2, a0: mgA(C2, R) - 14, a1: mgA(C2, R) + 14 }] },
        { say: 'ลากเส้นจาก C ไปยังจุดตัดนั้น ตัด AB ที่ <b>D</b> → CD คือส่วนสูง (CD ⊥ AB)', ops: [{ t: 'seg', a: C, b: [C[0], R[1] - .3] }, { t: 'pt', p: F, name: 'D' }, { t: 'away' }] }],
      marks: [{ p: F, name: 'D' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> CD ตั้งฉากกับ AB — เป็นส่วนสูงของรูปสามเหลี่ยม 🎉',
      goal: G => { const ln = G.lineAt(C, 90) && G.segs().some(s => mgDseg(s, C) < .14 && mgDseg(s, F) < .2); return ln && G.nArcs() >= 3 ? { ok: true } : { ok: false, why: !G.arcAt(C).length ? 'เริ่มจากวางเข็มที่ C เขียนส่วนโค้งตัด AB สองจุด' : G.nArcs() < 3 ? 'เขียนส่วนโค้งรัศมีเท่ากันจากจุดตัดทั้งสองบน AB' : 'ลากเส้นจาก C ผ่านจุดตัดของส่วนโค้งให้ถึง AB' }; } }; },
  /* รูปหกเหลี่ยมด้านเท่ามุมเท่า: วงกลมแล้วก้าวรัศมีเดิมรอบวง */
  hexagon(r = 3) { const O = [7.25, 4.75], V = [0, 60, 120, 180, 240, 300].map(d => mgP(O, d, r)), nm = 'ABCDEF', sol = [{ say: `เขียนวงกลมจุดศูนย์กลาง O รัศมี ${mgF(r)} ซม. แล้วทำจุด <b>A</b> บนวงกลม`, ops: [{ t: 'arc', c: O, r, a0: 0, a1: 360 }, { t: 'pt', p: V[0], name: 'A' }] }];
    for (let i = 0; i < 5; i++) sol.push({ say: `<b>รัศมีเดิม</b> วางเข็มที่ ${nm[i]} เขียนส่วนโค้งตัดวงกลม ได้จุด <b>${nm[i + 1]}</b>`, ops: [{ t: 'arc', c: V[i], r, a0: 60 * i + 105, a1: 60 * i + 135 }, { t: 'pt', p: V[i + 1], name: nm[i + 1] }] });
    sol.push({ say: 'ลากส่วนของเส้นตรงเชื่อมจุดทั้งหกตามลำดับ', ops: [...V.map((p, i) => ({ t: 'seg', a: p, b: V[(i + 1) % 6] })), { t: 'away' }] });
    return { title: `สร้าง<b>รูปหกเหลี่ยมด้านเท่ามุมเท่า</b> ด้านยาว ${mgF(r)} ซม.`, given: { pts: { O } }, compC: [12.6, 6.2], newNames: 'ABCDEFG', sol,
      okMsg: `<b>สร้างเสร็จแล้ว!</b> ทุกด้านยาวเท่ารัศมี = ${mgF(r)} ซม. 🎉`,
      goal: G => G.arcAt(O).some(x => Math.abs(x.r - r) < .12) && G.nSegs() >= 6 ? { ok: true } : { ok: false, why: 'เขียนวงกลม แล้วก้าววงเวียนรัศมีเดิมรอบวง ลากเส้นเชื่อม 6 จุด' } }; }
});
