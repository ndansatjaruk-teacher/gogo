/* =========================================================
   ป.4 บทที่ 8 ทะเลทรายมุม — หน้าสอนและเกมเรียงใหม่ (v253 · ผู้ใช้ขอ) · prefix a4d
   เหมือนบทที่ 9–10 (p4rd.js / p4gd.js): ประเด็นละหน้า ① ดูภาพ (r4vSee) → ② ทำให้ดู (r4dDo: ดินสอวงจุด ลากเส้น วางไม้โพรแทรกเตอร์
   วางมุมกระดาษ เขียนบนกระดาษทด คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อแบบเดียวกับในเกม) · เกมเรียงตามลำดับประเด็น ง่าย → ยาก
   รูปใช้ a4SVG / a4Line / a4Arc / a4Prot ของ p4a.js ในกรอบ 360×240 · วางหลัง p4gd.js ใน order.txt
   ========================================================= */
const a4i = o => a4SVG({ vb: [360, 240], ...o }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const a4dE = (p, r = 15, col = '#E5487A') => `<circle cx="${a4n(p[0])}" cy="${a4n(p[1])}" r="${r}" fill="none" stroke="${col}" stroke-width="2.8"/>`;
const a4dT = (p, t, col = '#2B2550', cls = 'r4d-tx') => r4dTx(p[0], p[1] + 6, t, col, cls);
const a4dRay = (a, b, col = '#2B2550', ext = 30, w = 3.4) => { const d = a4dir(a, b), q = a4P(b, ext, d); return `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(q[0])} ${a4n(q[1])}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>` + a4Arrow(q, d, col); };
const a4dSeg = (a, b, col = '#2B2550', w = 3.4) => `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(b[0])} ${a4n(b[1])}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
const a4dProt = (c, rot, o = {}) => `<g data-grp="1" class="${o.cls || 'r4d-prot'}">${a4Prot(c, rot, o)}</g>`;
const a4dCorner = (V, s = 66, d = 0) => { const a = a4P(V, s, d), c = a4P(a, s, d + 90), b = a4P(V, s, d + 90); return `<path data-pop="1" d="M${a4n(V[0])} ${a4n(V[1])} L${a4n(a[0])} ${a4n(a[1])} L${a4n(c[0])} ${a4n(c[1])} L${a4n(b[0])} ${a4n(b[1])}Z" fill="#FFC24C" fill-opacity=".35" stroke="#E6A21E" stroke-width="2.2" stroke-dasharray="6 4"/>`; };
const a4dSee = (title, cap, list) => sbMark(title, cap, () => list.map(p => ({ W: 360, H: 240, ...p })), T(`<b>ดูภาพ</b> — ${title}`, `ดูภาพ ${r4dTxt(title)}`, el => el.append(r4vSee(cap, list.map(p => ({ W: 360, H: 240, ...p })), list.map(p => p.s.replace(/<br>/g, r4vSep)).join(r4vSep)))));
const a4dTry = (id, mk, title) => g5dTry(id, mk, title);
const a4dD = (q, d, k) => ({ ...q, __diff: d, __kind: 'a4d' + k });
/* question makers (same as the old games) */
const a4dKind = () => Q.a4Kind({ k: pick(['line', 'ray', 'seg']), ab: a4Letters(2, false).join('') });
const a4dDraw = k => { const P = a4ptsRand(4, false), L = Object.keys(P); return Q.a4Draw({ k: k || pick(['line', 'ray', 'seg']), name: shuffle(L).slice(0, 2).join(''), pts: P }); };
const a4dName = mode => Q.a4Name({ nm: a4ang3(), d1: pick([0, 10, 20, 30]), a: rnd(8, 30) * 5, mode });
const a4dCount = n => Q.a4Count({ n, d0: rnd(0, 3) * 5, span: rnd(28, 34) * 5, L: a4Letters(6, false) });
const a4dCmp = f => Q.a4Cmp90({ nm: a4ang3(), d1: pick([0, 10, 20]), a: (f || pick([a4acute, a4obt, () => 90, () => 180]))() });
const a4dTapK = k => Q.a4Tap({ kind: k, A: k === 1 || k === 3 ? shuffle([k === 1 ? 90 : 180, a4acute(), a4obt()]) : a4tapSet(k) });
const a4dCls = f => { const a = f(); return Q.a4Cls({ nm: a4ang3(), d1: a4d1(a), a }); };
const a4dRead = inner => Q.a4Read({ nm: a4ang3(), d1: pick([0, 10, 20, 15]), a: pick([a4acute, a4obt])(), inner });
const a4dCalc = type => type === 'line3' ? (() => { const x = rnd(5, 12) * 5, y = rnd(5, 12) * 5; return Q.a4Calc({ type, x, y, L: a4Letters(5).join('') }); })() : type === 'full' ? Q.a4Calc({ type, x: rnd(14, 26) * 5, y: rnd(12, 24) * 5, L: a4Letters(4).join('') })
  : type === 'part' ? (() => { const x = rnd(3, 12) * 5, y = rnd(4, 18) * 5; return Q.a4Calc({ type, x, y, L: a4Letters(4).join('') }); })() : Q.a4Calc({ type, x: (type === 'right' ? rnd(3, 15) : rnd(7, 31)) * 5, L: a4Letters(4).join('') });
const a4dBuild = (f, left) => { const deg = f(); return { ...Q.a4Build({ nm: a4ang3(), deg, left: !!left }), __sig: 'a4b ' + deg, __dup: 'a4b ' + deg }; };

/* =========================================================
   the lessons
   ========================================================= */
const A4D_TEACH = {
  /* ด่าน 1: ระนาบ → บอกตำแหน่งจุดบนตาราง */
  1461: (() => { const G = { x0: 36, y0: 30, n: 8, m: 5, g: 36 }, gp = (i, j) => [G.x0 + i * G.g, G.y0 + j * G.g], PTS = { K: gp(1, 2), M: gp(5, 3), N: gp(4, 1), R: gp(2, 4) }, base = a4i({ grid: G, pts: PTS, lab: { K: 135, M: 45, N: 45, R: 45 } });
    return [
      a4dSee('ระนาบ', '<b>แตะรูป</b> — ผิวแบบไหนเป็นระนาบ', [
        { t: 'หน้าโต๊ะ', f: on => a4i({ plane: [40, 60, 280, 120] }) + (on ? r4vH([[180, 44, 180, 20], [180, 196, 180, 222], [42, 120, 14, 120], [318, 120, 346, 120]].map(([a, b, c, d]) => r4dArr([a, b], [c, d], '#3C8DDB')).join('') + a4dT([180, 120], 'เรียบ แบน', '#2F6FB5', 'r4v-tx')) : ''), s: 'ผิว<b>เรียบแบน</b><br>แผ่ออกไปทุกทิศทาง' },
        { t: 'ลูกบอล', f: on => `<circle cx="180" cy="120" r="78" fill="#FFD27A" stroke="#C9900F" stroke-width="2"/><path d="M110 92 Q180 140 250 92" fill="none" stroke="#C9900F" stroke-width="2"/>` + (on ? r4vH(a4dT([180, 222], '✗ ผิวโค้ง', '#E5487A', 'r4v-big')) : ''), s: 'ผิว<b>โค้ง</b><br>ไม่ใช่ระนาบ' }]),
      a4dTry(1461, a4PlaneQ, 'ระนาบหรือไม่'),
      a4dSee('จุดบอกตำแหน่ง', '<b>แตะรูป</b> — นับช่องจากจุดหนึ่งไปอีกจุดหนึ่ง', [
        { t: 'จาก A ไป B', f: on => a4i({ grid: G, pts: { A: gp(2, 4), B: gp(5, 2) }, lab: { A: 225, B: 45 } }) + (on ? r4vH(`<path d="M${gp(2, 4)} H${gp(5, 4)[0]} V${gp(5, 2)[1]}" fill="none" stroke="#E5487A" stroke-width="3" stroke-dasharray="7 5"/>` + a4dT([gp(3.5, 4)[0], gp(3.5, 4)[1] + 18], 'ขวา 3', '#E5487A', 'r4v-tx') + a4dT([gp(5, 3)[0] + 30, gp(5, 3)[1]], 'ขึ้น 2', '#E5487A', 'r4v-tx')) : ''), s: 'นับ<b>แนวนอน</b>ก่อน<br>แล้วนับแนวตั้ง' }]),
      r4dShow('หาจุดจากการนับช่อง', { fig: base, q: 'จุดใดอยู่ทางขวาของจุด K 4 ช่อง และลงมา 1 ช่อง',
        steps: [{ ink: a4dE(PTS.K), n: 'เริ่มที่จุด K', at: PTS.K },
          { ink: [1, 2, 3, 4].map(i => `<path d="M${gp(i, 2)[0]} ${gp(i, 2)[1]} Q${gp(i + .5, 2)[0]} ${gp(i, 2)[1] - 20} ${gp(i + 1, 2)[0]} ${gp(i + 1, 2)[1]}" fill="none" stroke="#E5487A" stroke-width="2.6"/>` + a4dT([gp(i + .5, 2)[0], gp(i, 2)[1] - 22], String(i), '#E5487A', 'r4d-sm')).join(''), w: 'ขวา 4 ช่อง', n: 'แนวนอนก่อน' },
          { ink: r4dArr(gp(5, 2), [gp(5, 3)[0], gp(5, 3)[1] - 6], '#3C8DDB'), w: 'ลง 1 ช่อง', n: 'แล้วนับแนวตั้ง' },
          { ink: a4dE(PTS.M, 15, '#1B8862'), w: 'จุด M', n: 'จุดที่ไปถึง', ans: 1 }],
        fin: 'นับ<b>แนวนอน</b>ก่อน แล้วนับ<b>แนวตั้ง</b>', say: 'นับแนวนอนก่อน แล้วนับแนวตั้ง' }),
      a4dTry(1461, () => a4gridQ('find'), 'หาจุดจากการนับช่อง'),
      T('<b>ลองปรับเอง</b> — วางจุดบนระนาบ', 'ลองวางจุดบนระนาบ', el => el.append(simA4Plane())),
      a4dTry(1461, () => a4gridQ('place'), 'วางจุดตามที่บอก')]; })(),

  /* ด่าน 2: เส้นตรง รังสี ส่วนของเส้นตรง → จุดตัด */
  1462: (() => { const Q1 = [70, 170], P1 = [240, 90], G1 = [30, 180], H1 = [330, 80], J1 = [70, 40], K1 = [300, 200], O1 = a4cross(G1, H1, J1, K1), d = a4dir(Q1, P1), ex = a4P(P1, 70, d);
    const three = (k, on) => { const A = [90, 80], B = [270, 80], s = a4i({ vb: [360, 150], pts: { A, B }, lines: [{ a: 'A', b: 'B', k, ext: 44, w: 4 }], lab: { A: 90, B: 90 } });
      return s + (on ? r4vH(k === 'line' ? a4dE([A[0] - 44, 80], 14) + a4dE([B[0] + 44, 80], 14) : k === 'ray' ? a4dE(A, 14, '#1B8862') + a4dE([B[0] + 44, 80], 14) : a4dE(A, 14, '#1B8862') + a4dE(B, 14, '#1B8862')) : ''); };
    return [
      a4dSee('เส้นตรง รังสี ส่วนของเส้นตรง', '<b>แตะรูป</b> — ดูที่ปลายทั้งสองข้าง', [
        { t: `เส้นตรง ${a4Sym('line', 'AB')}`, f: on => three('line', on), H: 150, s: 'หัวลูกศร <b>2 ข้าง</b><br>ไม่มีจุดปลาย' },
        { t: `รังสี ${a4Sym('ray', 'AB')}`, f: on => three('ray', on), H: 150, s: 'จุดเริ่มต้น 1 จุด<br>หัวลูกศร <b>1 ข้าง</b>' },
        { t: `ส่วนของเส้นตรง ${a4Sym('seg', 'AB')}`, f: on => three('seg', on), H: 150, s: 'จุดปลาย <b>2 จุด</b><br>วัดความยาวได้' }]),
      a4dTry(1462, a4dKind, 'เป็นเส้นแบบใด'),
      r4dShow(`วาดรังสี QP`, { fig: a4i({ pts: { Q: Q1, P: P1 }, lab: { Q: 200, P: 70 } }), q: `วาด ${a4Sym('ray', 'QP')}`,
        steps: [{ ink: a4dE(Q1), w: 'เริ่มที่ Q', n: 'ตัวแรกของชื่อ = จุดเริ่มต้น' }, { ink: a4dSeg(Q1, P1), w: 'ลากผ่าน P', n: 'จาก Q ไปทาง P' },
          { ink: a4dSeg(P1, ex) + a4Arrow(ex, d, '#2B2550'), w: 'ต่อไปไม่สิ้นสุด', n: 'หัวลูกศรข้างเดียว' }, { w: `ได้ ${a4Sym('ray', 'QP')}`, n: `ไม่ใช่ ${a4Sym('ray', 'PQ')}`, ans: 1 }],
        fin: `รังสี: <b>เริ่มที่ตัวแรก</b> ของชื่อ ลากผ่านตัวที่สอง`, say: 'รังสีเริ่มที่จุดตัวแรกของชื่อ แล้วลากผ่านจุดตัวที่สอง' }),
      T('<b>ลองปรับเอง</b> — ลากจุดและเปลี่ยนแบบ', 'ลองลากจุดและเปลี่ยนแบบ', el => el.append(simA4Line())),
      a4dTry(1462, () => a4dDraw(), 'วาดตามชื่อ'),
      a4dSee('จุดตัด', '<b>แตะรูป</b> — เส้นตรง 2 เส้นตัดกัน', [
        { t: 'เส้นตรงตัดกัน', f: on => a4i({ pts: { G: G1, H: H1, J: J1, K: K1 }, lines: [{ a: 'G', b: 'H', k: 'line', ext: 10 }, { a: 'J', b: 'K', k: 'line', ext: 10 }] }) + (on ? r4vH(a4dE(O1) + a4dT([O1[0], O1[1] + 30], 'จุดตัด', '#E5487A', 'r4v-tx')) : ''), s: 'จุดที่อยู่บน<b>ทั้งสองเส้น</b><br>มีจุดเดียว' }]),
      r4dShow('หาจุดตัด', { fig: a4i({ pts: { G: G1, H: H1, J: J1, K: K1 } }), q: 'เส้นตรง GH ตัดเส้นตรง JK ที่จุดใด',
        steps: [{ ink: a4Line(G1, H1, 'line', { ext: 10, col: '#EC7F1E' }), w: `ลาก ${a4Sym('line', 'GH')}`, n: 'เส้นแรก' }, { ink: a4Line(J1, K1, 'line', { ext: 10, col: '#3C8DDB' }), w: `ลาก ${a4Sym('line', 'JK')}`, n: 'เส้นที่สอง' },
          { ink: `<circle cx="${a4n(O1[0])}" cy="${a4n(O1[1])}" r="5" fill="#E5487A"/>` + a4dE(O1) + a4dT([O1[0], O1[1] + 30], 'O', '#E5487A', 'r4d-big'), w: 'ตัดกันที่จุด O', n: 'อยู่บนทั้งสองเส้น', ans: 1 }],
        fin: 'เส้นตรง 2 เส้นตัดกันได้ที่<b>จุดเดียว</b>', say: 'เส้นตรงสองเส้นตัดกันได้ที่จุดเดียว' }),
      a4dTry(1462, () => Q.a4Inter({ L: a4Letters(5, false).join('') }), 'จุดตัด')]; })(),

  /* ด่าน 3: มุม → จุดยอด แขน ชื่อมุม → นับมุมที่มีจุดยอดร่วมกัน */
  1463: (() => { const V = [150, 196], A = a4P(V, 150, 20), C = a4P(V, 150, 95), P0 = [180, 210], arms = [12, 55, 110, 162].map(d => a4P(P0, 150, d)), nm = ['Q', 'R', 'S', 'T'];
    const arc = (v, d1, d2, r, col) => a4Arc(v, d1, d2, { r, col, fill: 'rgba(0,0,0,0)', rm: false });
    return [
      a4dSee('มุม', '<b>แตะรูป</b> — มุมเกิดจากอะไร', [
        { t: 'มุม ABC', f: on => a4i({ pts: { A: a4P([150, 190], 160, 10), B: [150, 190], C: a4P([150, 190], 150, 65) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 20 }, { a: 'B', b: 'C', k: 'ray', ext: 20 }], lab: { B: 220 } }) + (on ? r4vH(a4dRay([150, 190], a4P([150, 190], 160, 10), '#EC7F1E', 20, 5) + a4dRay([150, 190], a4P([150, 190], 150, 65), '#3C8DDB', 20, 5) + a4dE([150, 190], 13)) : ''), s: 'รังสี <b>2 เส้น</b><br>ที่มี<b>จุดเริ่มต้นร่วมกัน</b>' }]),
      r4dShow('เรียกชื่อมุม', { fig: a4i({ pts: { ก: A, ข: V, ค: C }, lines: [{ a: 'ข', b: 'ก', k: 'ray', ext: 14 }, { a: 'ข', b: 'ค', k: 'ray', ext: 14 }], lab: { ข: 240 } }), q: 'มุมนี้มีชื่อว่าอะไร',
        steps: [{ ink: a4dE(V, 15), w: 'จุดยอด: ข', n: 'จุดที่แขนทั้งสองเริ่มต้น' },
          { ink: a4dSeg(V, A, '#EC7F1E', 5) + a4dSeg(V, C, '#3C8DDB', 5), w: 'แขน: ขก และ ขค', n: 'รังสี 2 เส้น' },
          { ink: a4Arc(V, 20, 95, { r: 46, col: '#E5487A', fill: 'rgba(229,72,122,.12)' }), w: `มุม ${a4Ang('กขค')}`, n: 'อ่าน ก → ข → ค (ข อยู่กลาง)' },
          { w: `หรือ มุม ${a4Ang('คขก')}`, n: 'อ่านกลับด้านก็ได้', ans: 1 }],
        fin: 'ชื่อมุม: <b>จุดยอดอยู่ตรงกลาง</b>เสมอ', say: 'เรียกชื่อมุม จุดยอดอยู่ตรงกลางเสมอ' }),
      a4dTry(1463, () => a4dName(pick(['name', 'vertex', 'arms'])), 'ชื่อมุม จุดยอด แขน'),
      T('<b>ลองปรับเอง</b> — หมุนแขนของมุม', 'ลองหมุนแขนของมุม', el => el.append(simA4Angle('name'))),
      a4dSee('มุมที่มีจุดยอดร่วมกัน', '<b>แตะรูป</b> — มุมเล็กกับมุมที่รวมกัน', [
        { t: 'แขน 3 เส้น', f: on => { const O = [180, 210], X = [15, 70, 140].map(d => a4P(O, 150, d)); return a4i({ pts: { O, A: X[0], B: X[1], C: X[2] }, lines: ['A', 'B', 'C'].map(z => ({ a: 'O', b: z, k: 'ray', ext: 10 })), lab: { O: 270 } }) + (on ? r4vH(arc(O, 15, 70, 40, '#E5487A') + arc(O, 70, 140, 40, '#3C8DDB') + arc(O, 15, 140, 64, '#1B8862')) : ''); }, s: 'มุมเล็ก 2 มุม<br>+ มุมที่รวมกัน 1 = <b>3 มุม</b>' }]),
      r4dShow('นับมุมจากแขน 4 เส้น', { fig: a4i({ pts: { P: P0, Q: arms[0], R: arms[1], S: arms[2], T: arms[3] }, lines: nm.map(z => ({ a: 'P', b: z, k: 'ray', ext: 8 })), lab: { P: 270 } }), q: 'จากรูป มีมุมที่มีจุด P เป็นจุดยอดกี่มุม',
        steps: [{ ink: arc(P0, 12, 55, 36, '#E5487A') + arc(P0, 55, 110, 36, '#E5487A') + arc(P0, 110, 162, 36, '#E5487A'), w: '3', n: 'มุมเล็กติดกัน' },
          { ink: arc(P0, 12, 110, 60, '#3C8DDB') + arc(P0, 55, 162, 76, '#3C8DDB'), w: '+ 2', wa: 1, n: 'รวม 2 ช่อง' },
          { ink: arc(P0, 12, 162, 98, '#1B8862'), w: '+ 1 = 6', wa: 1, n: 'รวม 3 ช่อง' }, { w: '6 มุม', n: 'นับเล็ก → ใหญ่ ไม่ตกหล่น', ans: 1 }],
        fin: 'นับมุมเล็กก่อน แล้วนับมุมที่<b>รวมกัน</b>', say: 'นับมุมเล็กก่อน แล้วนับมุมที่รวมกัน' }),
      a4dTry(1463, () => a4dCount(rnd(3, 5)), 'นับมุม')]; })(),

  /* ด่าน 4: มุมฉาก → มุมตรง → เทียบกับมุมฉาก */
  1464: (() => { const V = [150, 196], A = a4P(V, 170, 0), C = a4P(V, 150, 115);
    return [
      a4dSee('มุมฉาก', '<b>แตะรูป</b> — มุมฉากมีขนาดเท่าไร', [
        { t: 'มุมฉาก', f: on => a4i({ pts: { A: a4P([130, 200], 170, 0), B: [130, 200], C: a4P([130, 200], 160, 90) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 14 }, { a: 'B', b: 'C', k: 'ray', ext: 14 }], arcs: [{ v: 'B', a: 'A', b: 'C' }], lab: { B: 225 } }) + (on ? r4vH(a4dCorner([130, 200], 70) + a4dT([210, 130], '90°', '#E5487A', 'r4v-big')) : ''), s: 'ขนาด <b>90°</b><br>เท่ามุมของกระดาษ' }]),
      a4dSee('มุมตรง', '<b>แตะรูป</b> — แขนอยู่ในแนวเส้นตรงเดียวกัน', [
        { t: 'มุมตรง', f: on => a4i({ pts: { A: [320, 170], B: [180, 170], C: [40, 170] }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 10 }, { a: 'B', b: 'C', k: 'ray', ext: 10 }], arcs: [{ v: 'B', a: 'A', b: 'C', r: 34 }], lab: { B: 270 } }) + (on ? r4vH(a4dCorner([180, 170], 60, 0) + a4dCorner([180, 170], 60, 90) + a4dT([180, 90], '90° + 90° = 180°', '#E5487A', 'r4v-tx')) : ''), s: 'ขนาด <b>180°</b><br>= มุมฉาก 2 มุม' }]),
      r4dShow('เทียบมุมกับมุมฉาก', { fig: a4i({ pts: { A, B: V, C }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 10 }, { a: 'B', b: 'C', k: 'ray', ext: 10 }], arcs: [{ v: 'B', a: 'A', b: 'C', r: 26 }], lab: { B: 240 } }), q: `${a4Ang('ABC')} ใหญ่กว่า เล็กกว่า หรือเท่ากับมุมฉาก`,
        steps: [{ ink: a4dCorner(V, 80), n: 'วางมุมกระดาษที่จุดยอด B ขอบทับแขน BA', at: [V[0] + 40, V[1] - 80] },
          { ink: a4dSeg(V, C, '#E5487A', 5), w: 'แขน BC อยู่นอกกระดาษ', n: 'เลยมุมกระดาษออกไป' },
          { w: 'ใหญ่กว่ามุมฉาก', n: 'กางกว้างกว่า 90°', ans: 1 }],
        fin: 'วาง<b>มุมกระดาษ</b> แล้วดูว่าแขนอีกข้างอยู่ในหรือนอกกระดาษ', say: 'วางมุมกระดาษ แล้วดูว่าแขนอีกข้างอยู่ในหรือนอกกระดาษ' }),
      a4dTry(1464, () => a4dCmp(), 'เทียบกับมุมฉาก'),
      T('<b>ลองปรับเอง</b> — หมุนแขนเทียบกับมุมกระดาษ', 'ลองหมุนแขนเทียบกับมุมกระดาษ', el => el.append(simA4Angle('cmp'))),
      a4dTry(1464, () => a4dTapK(pick([1, 3])), 'แตะมุมฉาก มุมตรง')]; })(),

  /* ด่าน 5: มุมแหลม มุมป้าน → มุมกลับ → บอกชนิด */
  1465: (() => { const V = [150, 192], P = a4P(V, 170, 15), R = a4P(V, 150, 160), back = a4P(V, 140, 195);
    const ang = (a, c = [150, 190], o = {}) => a4i({ pts: { A: a4P(c, 160, 0), B: c, C: a4P(c, 140, a) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 10 }, { a: 'B', b: 'C', k: 'ray', ext: 10 }], arcs: [{ v: 'B', a: 'A', b: 'C', reflex: a > 180, r: a > 180 ? 24 : 30 }], lab: { B: a > 180 ? a / 2 : a / 2 + 180 }, ...o });
    return [
      a4dSee('มุมแหลม และ มุมป้าน', '<b>แตะรูป</b> — เทียบกับมุมกระดาษ', [
        { t: 'มุมแหลม', f: on => ang(50) + (on ? r4vH(a4dCorner([150, 190], 76) + a4dT([250, 120], '< 90°', '#E5487A', 'r4v-big')) : ''), s: '<b>เล็กกว่า</b>มุมฉาก<br>น้อยกว่า 90°' },
        { t: 'มุมป้าน', f: on => ang(130) + (on ? r4vH(a4dCorner([150, 190], 76) + a4dT([270, 120], '> 90°', '#E5487A', 'r4v-big')) : ''), s: '<b>ใหญ่กว่า</b>มุมฉาก<br>แต่เล็กกว่ามุมตรง' }]),
      a4dSee('มุมกลับ', '<b>แตะรูป</b> — มุมด้านนอกที่ใหญ่กว่ามุมตรง', [
        { t: 'มุมกลับ', f: on => ang(240, [170, 110]) + (on ? r4vH(r4dDash([20, 110], [340, 110], '#9A8FC4', 2.4) + a4dT([260, 70], '> 180°', '#E5487A', 'r4v-big')) : ''), s: '<b>ใหญ่กว่ามุมตรง</b><br>มากกว่า 180° แต่น้อยกว่า 360°' }]),
      r4dShow('บอกชนิดของมุม', { fig: a4i({ pts: { P, Q: V, R }, lines: [{ a: 'Q', b: 'P', k: 'ray', ext: 10 }, { a: 'Q', b: 'R', k: 'ray', ext: 10 }], arcs: [{ v: 'Q', a: 'P', b: 'R', r: 26 }], lab: { Q: 270 } }), q: `${a4Ang('PQR')} เป็นมุมชนิดใด`,
        steps: [{ ink: `<path data-pop="1" d="M${V[0]} ${V[1]} L${a4n(a4P(V, 80, 15)[0])} ${a4n(a4P(V, 80, 15)[1])} L${a4n(a4P(a4P(V, 80, 15), 80, 105)[0])} ${a4n(a4P(a4P(V, 80, 15), 80, 105)[1])} L${a4n(a4P(V, 80, 105)[0])} ${a4n(a4P(V, 80, 105)[1])}Z" fill="#FFC24C" fill-opacity=".35" stroke="#E6A21E" stroke-width="2.2" stroke-dasharray="6 4"/>`, w: 'ใหญ่กว่ามุมฉาก', n: 'แขน QR เลยมุมกระดาษ' },
          { ink: r4dDash(V, back, '#3C8DDB', 3), w: 'เล็กกว่ามุมตรง', n: 'ยังไม่ถึงแนวเส้นตรง' }, { w: 'มุมป้าน', n: 'ระหว่าง 90° กับ 180°', ans: 1 }],
        fin: 'เทียบกับ<b>มุมฉาก</b>ก่อน แล้วเทียบกับ<b>มุมตรง</b>', say: 'เทียบกับมุมฉากก่อน แล้วเทียบกับมุมตรง' }),
      a4dTry(1465, () => a4dCls(pick([a4acute, a4obt, a4refl])), 'บอกชนิดของมุม'),
      T('<b>ลองปรับเอง</b> — หมุนให้ได้มุมครบทุกชนิด', 'ลองหมุนให้ได้มุมครบทุกชนิด', el => el.append(simA4Angle('kind'))),
      a4dTry(1465, a4SortQ, 'จัดมุมลงกล่อง')]; })(),

  /* ด่าน 6: ไม้โพรแทรกเตอร์ → วัดมุม → หามุมบนเส้นตรง (ไม่ใช้ไม้) */
  1466: (() => { const B = [180, 200], A = a4P(B, 145, 0), C = a4P(B, 150, 65), rd = a4P(B, 130 - 21, 65), T0 = [180, 186], S = [26, 186], U = [334, 186], W = a4P(T0, 140, 48);
    return [
      a4dSee('ไม้โพรแทรกเตอร์', '<b>แตะรูป</b> — สเกล 2 วง จุดศูนย์กลาง เส้นฐาน', [
        { t: 'สเกล 2 วง', f: on => a4i({ prot: { c: [180, 200], rot: 0, R: 150 } }) + (on ? r4vH(r4dArr([300, 60], [312, 98], '#1E5FA8') + a4dT([300, 50], 'วงนอก เริ่ม 0 ขวา', '#1E5FA8', 'r4v-sm') + r4dArr([60, 60], [76, 118], '#C2410C') + a4dT([66, 50], 'วงใน เริ่ม 0 ซ้าย', '#C2410C', 'r4v-sm')) : ''), s: 'วงนอกเริ่ม 0 ทางขวา<br>วงในเริ่ม 0 ทางซ้าย' },
        { t: 'จุดศูนย์กลาง · เส้นฐาน', f: on => a4i({ prot: { c: [180, 200], rot: 0, R: 150 } }) + (on ? r4vH(a4dE([180, 200], 12) + `<path d="M24 200 H336" stroke="#E5487A" stroke-width="4" opacity=".7"/>`) : ''), s: 'วาง<b>จุดศูนย์กลาง</b>ที่จุดยอด<br>เส้นฐานทับแขนข้างหนึ่ง' }]),
      r4dShow(`วัด ${a4m('ABC')}`, { fig: a4i({ pts: { A, B, C }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 6 }, { a: 'B', b: 'C', k: 'ray', ext: 6 }], lab: { B: 270 } }), q: `${a4m('ABC')} มีขนาดกี่องศา`,
        steps: [{ ink: a4dProt(B, -20, { R: 130 }), n: 'วางจุดศูนย์กลางที่จุดยอด B', at: [B[0], 70], tmp: 1 },
          { ink: a4dProt(B, 0, { R: 130 }), w: 'เส้นฐานทับแขน BA', n: 'หมุนให้ BA อยู่ที่ 0 ของวงนอก' },
          { ink: a4dE(rd, 11) + a4dSeg(B, a4P(B, 135, 65), '#E5487A', 2.4), w: 'อ่านวงนอก: 65', n: 'นับจาก 0 ของแขน BA' },
          { w: `${a4m('ABC')} = 65°`, n: 'ไม่ใช่ 115 ของวงใน', ans: 1 }],
        fin: 'อ่าน<b>สเกลที่เริ่ม 0</b> จากแขนที่ทับเส้นฐาน', say: 'อ่านสเกลที่เริ่มศูนย์จากแขนที่ทับเส้นฐาน' }),
      T('<b>ลองปรับเอง</b> — ลากและหมุนไม้โพรแทรกเตอร์', 'ลองลากและหมุนไม้โพรแทรกเตอร์', el => el.append(simA4Measure())),
      a4dTry(1466, () => a4dRead(Math.random() < .5), 'อ่านขนาดมุม'),
      a4dSee('หาขนาดมุมโดยไม่ใช้ไม้', '<b>แตะรูป</b> — ใช้ 180° และ 90° ที่รู้อยู่แล้ว', [
        { t: 'บนเส้นตรง', f: on => a4i({ pts: { ง: S, ข: T0, ค: U, ก: a4P(T0, 140, 115) }, lines: [{ a: 'ง', b: 'ค', k: 'line', ext: 4 }, { a: 'ข', b: 'ก', k: 'ray', ext: 8 }], arcs: [{ v: 'ข', a: 'ค', b: 'ก', lab: '115°', r: 30 }], lab: { ข: 270 } }) + (on ? r4vH(a4Arc(T0, 115, 180, { r: 26, col: '#3C8DDB', fill: 'rgba(60,141,219,.15)', lab: '65°' })) : ''), s: 'รวมกันได้ <b>180°</b><br>180° − 115° = 65°' },
        { t: 'ในมุมฉาก', f: on => { const O = [130, 205]; return a4i({ pts: { R: a4P(O, 170, 90), O, V: a4P(O, 180, 0), Q: a4P(O, 175, 35) }, lines: ['R', 'V', 'Q'].map(z => ({ a: 'O', b: z, k: 'ray', ext: 6 })), arcs: [{ v: 'O', a: 'V', b: 'Q', lab: '35°', r: 50 }], lab: { O: 225 } }) + (on ? r4vH(a4Arc(O, 35, 90, { r: 40, col: '#3C8DDB', fill: 'rgba(60,141,219,.15)', lab: '55°' })) : ''); }, s: 'มุมฉาก <b>90°</b><br>90° − 35° = 55°' }]),
      r4dShow('หาขนาดมุมบนเส้นตรง', { fig: a4i({ pts: { S, T: T0, U, W }, lines: [{ a: 'S', b: 'U', k: 'line', ext: 4 }, { a: 'T', b: 'W', k: 'ray', ext: 8 }], arcs: [{ v: 'T', a: 'U', b: 'W', lab: '48°', r: 34 }], lab: { T: 270 } }) + r4dQ(...a4P(T0, 46, 114)), q: `STU เป็นเส้นตรง ${a4m('WTS')} มีขนาดเท่าไร`,
        steps: [{ ink: `<path d="M${T0[0] + 64} ${T0[1]} A64 64 0 0 0 ${T0[0] - 64} ${T0[1]}" fill="none" stroke="#E6A21E" stroke-width="3"/>` + a4dT([T0[0] - 96, T0[1] - 60], '180°', '#C9640E'), w: 'มุมตรง = 180°', n: 'บนเส้นตรงรวมกันได้ 180°' },
          { w: '180° − 48° = 132°', n: 'ลบมุมที่รู้' },
          { off: ['.r4d-q0'], ink: a4Arc(T0, 48, 180, { r: 26, col: '#3C8DDB', fill: 'rgba(60,141,219,.15)' }) + a4dT(a4P(T0, 50, 114), '132°', '#2F6FB5'), w: `${a4m('WTS')} = 132°`, n: 'ตอบ', ans: 1 }],
        fin: 'มุมบนเส้นตรง: <b>180° − มุมที่รู้</b>', say: 'มุมบนเส้นตรง เท่ากับ หนึ่งร้อยแปดสิบองศา ลบมุมที่รู้' }),
      a4dTry(1466, () => a4dCalc('line'), 'มุมบนเส้นตรง'),
      a4dTry(1466, () => a4dCalc('right'), 'มุมในมุมฉาก')]; })(),

  /* ด่าน 7: มุมกลับ = 360° − มุมที่วัดได้ */
  1467: (() => { const Qv = [180, 112], P = a4P(Qv, 160, 0), R = a4P(Qv, 130, 220);
    return [
      a4dSee('มุมกลับกับมุมอีกด้าน', '<b>แตะรูป</b> — รวมกันได้ 1 รอบ', [
        { t: 'รวมกัน 360°', f: on => a4i({ pts: { A: a4P([180, 116], 150, 0), B: [180, 116], C: a4P([180, 116], 110, 250) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 8 }, { a: 'B', b: 'C', k: 'ray', ext: 8 }], arcs: [{ v: 'B', a: 'A', b: 'C', r: 40, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)', lab: '110°' }], lab: { B: 90 } }) + (on ? r4vH(a4Arc([180, 116], 0, 250, { reflex: true, r: 26, lab: '250°' }) + a4dT([290, 40], '110° + 250° = 360°', '#E5487A', 'r4v-tx')) : ''), s: 'มุมกลับ + มุมอีกด้าน<br>= <b>360°</b>' }]),
      r4dShow(`วัดมุมกลับ ${a4Ang('PQR')}`, { fig: a4i({ pts: { P, Q: Qv, R }, lines: [{ a: 'Q', b: 'P', k: 'ray', ext: 8 }, { a: 'Q', b: 'R', k: 'ray', ext: 8 }], lab: { Q: 110 } }), q: `มุมกลับ ${a4Ang('PQR')} มีขนาดกี่องศา`,
        steps: [{ ink: a4dProt(Qv, 0, { flip: true, R: 100, mark: 140 }), w: 'วัดด้านที่เล็กกว่า: 140°', n: 'วางไม้วัดด้านล่าง', tmp: 1 },
          { ink: a4Arc(Qv, 220, 0, { r: 56, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)', lab: '140°' }) + `<circle cx="${Qv[0]}" cy="${Qv[1]}" r="44" fill="none" stroke="#9A8FC4" stroke-width="2.4" stroke-dasharray="6 5"/>` + a4dT([Qv[0] + 70, Qv[1] - 40], '360°', '#7B6FB0'), w: '360° − 140° = 220°', n: 'รอบจุดหนึ่ง = 360°' },
          { ink: a4Arc(Qv, 0, 220, { reflex: true, r: 28, lab: '220°' }), w: `มุมกลับ = 220°`, n: 'มุมด้านที่ใหญ่', ans: 1 }],
        fin: 'มุมกลับ = <b>360° − มุมที่วัดได้</b>', say: 'มุมกลับ เท่ากับ สามร้อยหกสิบองศา ลบมุมที่วัดได้' }),
      a4dTry(1467, () => Q.a4ReadR({ nm: a4ang3(), a: a4refl() }), 'วัดมุมกลับ'),
      T('<b>ลองปรับเอง</b> — หมุนแขนของมุมกลับ', 'ลองหมุนแขนของมุมกลับ', el => el.append(simA4Reflex())),
      a4dTry(1467, () => a4dCalc('full'), 'มุมรอบจุด')]; })(),

  /* ด่าน 8: สร้างมุม → สร้างมุมกลับ */
  1468: (() => { const B = [180, 200], A = a4P(B, 165, 0), C = a4P(B, 160, 40), mk = a4P(B, 134, 40), Y = [180, 104], X = a4P(Y, 160, 0), Z = a4P(Y, 130, 300), mk2 = a4P(Y, 104, -60);
    const st = k => a4i({ pts: k >= 2 ? { A, B, C } : { A, B }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 8 }, ...(k >= 2 ? [{ a: 'B', b: 'C', k: 'ray', ext: 8 }] : [])], prot: k === 1 ? { c: B, rot: 0, R: 130, mark: 40 } : null, arcs: k >= 2 ? [{ v: 'B', a: 'A', b: 'C', lab: '40°' }] : [], lab: { B: 270 } });
    return [
      a4dSee('ขั้นตอนสร้างมุม', '<b>แตะรูปทีละขั้น</b> — สร้างมุม 40°', [
        { t: '① ลากแขน 1 แขน', f: on => on ? r4vH(st(0)) : '', s: 'กำหนดจุดยอด B<br>ลาก BA' },
        { t: '② วางไม้ ทำเครื่องหมาย', f: on => on ? r4vH(st(1)) : st(0), s: 'นับจาก 0 บนแขน BA<br>ทำเครื่องหมายที่ <b>40</b>' },
        { t: '③ ลากแขนอีกแขน', f: on => on ? r4vH(st(2)) : st(0), s: 'ลากผ่านเครื่องหมาย<br>ได้มุม <b>40°</b>' }]),
      r4dShow('สร้างมุม 40°', { fig: '', q: `สร้าง ${a4m('ABC')} = 40°`,
        steps: [{ ink: a4dRay(B, A, '#2B2550', 8) + `<circle cx="${B[0]}" cy="${B[1]}" r="4.5" fill="#2B2550"/>` + a4dT([B[0] - 4, B[1] + 26], 'B', '#3A2F6B') + a4dT([A[0] - 6, A[1] + 26], 'A', '#3A2F6B'), w: 'ลาก BA', n: 'แขนแรก + จุดยอด B' },
          { ink: a4dProt(B, 0, { R: 130 }), w: 'วางไม้ที่จุด B', n: 'เส้นฐานทับ BA' },
          { ink: `<circle cx="${a4n(mk[0])}" cy="${a4n(mk[1])}" r="5" fill="#E5487A"/>` + a4dE(a4P(B, 109, 40), 11), w: 'จุดที่ 40 (วงนอก)', n: 'นับจาก 0 บนแขน BA' },
          { off: ['.r4d-prot'], ink: a4dRay(B, C, '#2B2550', 8) + a4Arc(B, 0, 40, { lab: '40°' }) + a4dT([C[0] + 14, C[1] - 6], 'C', '#3A2F6B'), w: `${a4m('ABC')} = 40°`, n: 'ลากแขนผ่านเครื่องหมาย', ans: 1 }],
        fin: 'แขน → วางไม้ → <b>ทำเครื่องหมาย</b> → ลากแขน', say: 'ลากแขน วางไม้ ทำเครื่องหมาย แล้วลากแขนอีกแขน' }),
      a4dTry(1468, () => a4dBuild(pick([a4acute, a4obt])), 'สร้างมุม'),
      r4dShow('สร้างมุมกลับ 300°', { fig: a4i({ pts: { X, Y }, lines: [{ a: 'Y', b: 'X', k: 'ray', ext: 8 }], lab: { Y: 150 } }), q: `สร้างมุมกลับ ${a4Ang('XYZ')} = 300°`,
        steps: [{ w: '360° − 300° = 60°', n: 'สร้างมุม 60° ด้านล่างแทน' },
          { ink: a4dProt(Y, 0, { flip: true, R: 100, mark: 60 }) + `<circle cx="${a4n(mk2[0])}" cy="${a4n(mk2[1])}" r="5" fill="#E5487A"/>`, w: 'ทำเครื่องหมายที่ 60', n: 'วางไม้ด้านล่าง' },
          { off: ['.r4d-prot'], ink: a4dRay(Y, Z, '#2B2550', 8) + a4Arc(Y, 0, 300, { reflex: true, r: 26, lab: '300°' }) + a4dT([Z[0] + 16, Z[1] + 4], 'Z', '#3A2F6B'), w: 'ได้มุมกลับ 300°', n: 'มุมด้านบนคือมุมกลับ', ans: 1 }],
        fin: 'มุมกลับ: สร้าง <b>360° − ขนาด</b> ที่อีกด้าน', say: 'สร้างมุมกลับ ให้สร้างมุมสามร้อยหกสิบองศาลบขนาดที่อีกด้าน' }),
      a4dTry(1468, () => a4dBuild(a4refl), 'สร้างมุมกลับ'),
      a4dTry(1468, () => a4SeqQ(pick([0, 1])), 'เรียงขั้นตอน')]; })()
};

/* =========================================================
   games: in the order the ideas are taught, easy → hard
   ========================================================= */
const A4D_GAME = {
  1461: () => [a4dD(a4PlaneQ(), 1, 'a'), ...[2, 3, 5, 8].map((d, i) => a4dD(a4gridQ('find'), d, 'f' + i)), ...[4, 6, 7, 9, 10].map((d, i) => a4dD(a4gridQ('place'), d, 'p' + i))],
  1462: () => [a4dD(a4dKind(), 1, 'a'), a4dD(a4dKind(), 2, 'b'), a4dD(a4dKind(), 3, 'c'), a4dD(a4dDraw('seg'), 4, 'd'), a4dD(a4dDraw('ray'), 5, 'e'), a4dD(a4dDraw('line'), 6, 'f'), a4dD(a4TFQ(), 7, 'g'),
    a4dD(Q.a4Inter({ L: a4Letters(5, false).join('') }), 8, 'h'), a4dD(Q.a4Inter({ L: a4Letters(5, false).join('') }), 9, 'i'), a4dD(a4dDraw('ray'), 10, 'j')],
  1463: () => [a4dD(a4dName('name'), 1, 'a'), a4dD(a4dName('vertex'), 2, 'b'), a4dD(a4dName('arms'), 3, 'c'), a4dD(a4dName('name'), 4, 'd'), a4dD(Q.a4DrawAngle(), 5, 'e'), a4dD(Q.a4DrawAngle(), 6, 'f'),
    a4dD(a4dCount(3), 7, 'g'), a4dD(a4dCount(4), 8, 'h'), a4dD(a4dCount(4), 9, 'i'), a4dD(a4dCount(5), 10, 'j')],
  1464: () => [a4dD(a4dCmp(() => 90), 1, 'a'), a4dD(a4dCmp(a4acute), 2, 'b'), a4dD(a4dCmp(a4obt), 3, 'c'), a4dD(a4dTapK(1), 4, 'd'), a4dD(a4dCmp(() => 180), 5, 'e'), a4dD(a4dTapK(3), 6, 'f'),
    a4dD(Q.a4Cls({ nm: a4ang3(), d1: pick([0, 15, 30]), a: 90, show: [1, 3, 0] }), 7, 'g'), a4dD(Q.a4Cls({ nm: a4ang3(), d1: pick([0, 15, 30]), a: 180, show: [1, 3, 0] }), 8, 'h'), a4dD(a4dCmp(), 9, 'i'), a4dD(a4dTapK(pick([1, 3])), 10, 'j')],
  1465: () => [a4dD(a4dCls(a4acute), 1, 'a'), a4dD(a4dCls(a4obt), 2, 'b'), a4dD(a4dTapK(0), 3, 'c'), a4dD(a4dTapK(2), 4, 'd'), a4dD(Q.a4Cls({ nm: a4ang3(), d1: 0, a: a4refl() }), 5, 'e'), a4dD(a4dTapK(4), 6, 'f'),
    a4dD(a4SortQ(), 7, 'g'), a4dD(Q.a4ClsDeg({ nm: a4ang3(), a: pick([a4acute, a4obt])() }), 8, 'h'), a4dD(Q.a4ClsDeg({ nm: a4ang3(), a: a4refl() }), 9, 'i'), a4dD(a4dCls(pick([a4acute, a4obt, a4refl])), 10, 'j')],
  1466: () => [a4dD(a4dRead(false), 1, 'a'), a4dD(a4dRead(false), 2, 'b'), a4dD(a4dRead(true), 3, 'c'), a4dD(a4dRead(true), 4, 'd'), a4dD(Q.a4ClsDeg({ nm: a4ang3(), a: pick([a4acute, a4obt, () => 90, () => 180])() }), 5, 'e'),
    a4dD(a4dCalc('line'), 6, 'f'), a4dD(a4dCalc('line'), 7, 'g'), a4dD(a4dCalc('line'), 8, 'h'), a4dD(a4dCalc('right'), 9, 'i'), a4dD(a4dCalc('right'), 10, 'j'), a4dD(a4dCalc('right'), 11, 'k'), a4dD(a4dCalc('line3'), 12, 'l')],
  1467: () => [a4dD(Q.a4ReadR({ nm: a4ang3(), a: a4refl() }), 1, 'a'), a4dD(Q.a4ReadR({ nm: a4ang3(), a: a4refl() }), 2, 'b'), a4dD(Q.a4Cls({ nm: a4ang3(), d1: 0, a: a4refl() }), 3, 'c'), a4dD(Q.a4ReadR({ nm: a4ang3(), a: a4refl() }), 4, 'd'),
    a4dD(Q.a4ClsDeg({ nm: a4ang3(), a: a4refl() }), 5, 'e'), a4dD(Q.a4Cls({ nm: a4ang3(), d1: 0, a: pick([a4obt, () => 180])() }), 6, 'f'), a4dD(Q.a4ReadR({ nm: a4ang3(), a: a4refl() }), 7, 'g'), a4dD(Q.a4ClsDeg({ nm: a4ang3(), a: a4obt() }), 8, 'h'), a4dD(a4dCalc('full'), 9, 'i'), a4dD(a4dCalc('full'), 10, 'j')],
  1468: () => [a4dD(a4SeqQ(0), 1, 'a'), a4dD(a4dBuild(a4acute), 2, 'b'), a4dD(a4dBuild(a4obt), 3, 'c'), a4dD(a4dBuild(a4acute, true), 4, 'd'), a4dD(a4dBuild(() => rnd(5, 17) * 5 + 3), 5, 'e'), a4dD(a4dBuild(a4obt, true), 6, 'f'),
    a4dD(a4SeqQ(1), 7, 'g'), a4dD(a4dBuild(a4refl), 8, 'h'), a4dD(a4dBuild(a4refl), 9, 'i'), a4dD(a4dCalc('part'), 10, 'j')]
};
LESSONS_P4C8.forEach(L => { if (A4D_TEACH[L.id]) { L.teach = A4D_TEACH[L.id]; L.__pracDone = 1; } if (A4D_GAME[L.id]) { L.game = A4D_GAME[L.id]; L.gameN = L.id === 1466 ? 12 : 10; } });
