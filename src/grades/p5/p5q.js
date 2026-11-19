/* =========================================================
   ป.5 บทที่ 7 รูปสี่เหลี่ยม (ภาคเรียนที่ 2) — quadrilateral classifier (drag the corners), diagonals,
   constructions (sides/angles, diagonals), base & height, area of parallelogram / rhombus / trapezoid / polygons,
   perimeter & area word problems.   Levels 631–650 + boss 659   (prefix q5; uses polySVG/polyBoard from p6k)
   ========================================================= */
const Q5N = { sq: 'รูปสี่เหลี่ยมจัตุรัส', rect: 'รูปสี่เหลี่ยมผืนผ้า', rhom: 'รูปสี่เหลี่ยมขนมเปียกปูน', para: 'รูปสี่เหลี่ยมด้านขนาน', trap: 'รูปสี่เหลี่ยมคางหมู', kite: 'รูปสี่เหลี่ยมรูปว่าว', any: 'รูปสี่เหลี่ยมใด ๆ' };
const Q5P = { sq: 'มุมทุกมุมเป็นมุมฉาก ด้านทุกด้านยาวเท่ากัน ด้านตรงข้ามขนานกัน 2 คู่', rect: 'มุมทุกมุมเป็นมุมฉาก ด้านตรงข้ามยาวเท่ากันและขนานกัน 2 คู่ ด้านที่อยู่ติดกันยาวไม่เท่ากัน', rhom: 'มุมไม่เป็นมุมฉาก มุมตรงข้ามเท่ากัน ด้านทุกด้านยาวเท่ากัน ด้านตรงข้ามขนานกัน 2 คู่',
  para: 'มุมไม่เป็นมุมฉาก มุมตรงข้ามเท่ากัน ด้านตรงข้ามยาวเท่ากันและขนานกัน 2 คู่ ด้านที่อยู่ติดกันยาวไม่เท่ากัน', trap: 'มีด้านคู่ตรงข้ามขนานกันเพียง 1 คู่', kite: 'ด้านที่อยู่ติดกันยาวเท่ากัน 2 คู่ มุมที่อยู่ตรงข้ามกันเท่ากัน 1 คู่', any: 'ไม่มีลักษณะพิเศษข้างต้น' };
const Q5D = { sq: 'ยาวเท่ากัน · แบ่งครึ่งซึ่งกันและกัน · ตั้งฉากกัน', rect: 'ยาวเท่ากัน · แบ่งครึ่งซึ่งกันและกัน', rhom: 'แบ่งครึ่งซึ่งกันและกัน · ตั้งฉากกัน', para: 'แบ่งครึ่งซึ่งกันและกัน', trap: 'ไม่มีสมบัติพิเศษ', kite: 'ตั้งฉากกัน · เส้นหนึ่งถูกแบ่งครึ่งด้วยอีกเส้นหนึ่ง', any: 'ไม่มีสมบัติพิเศษ' };
const q5v = (a, b) => [b[0] - a[0], b[1] - a[1]], q5len = v => Math.hypot(v[0], v[1]);
function q5info(p) {
  const S = [0, 1, 2, 3].map(i => q5v(p[i], p[(i + 1) % 4])), L = S.map(q5len), mx = Math.max(...L), eq = (a, b) => Math.abs(a - b) <= mx * .006 + .01;
  const par = (u, v) => Math.abs(u[0] * v[1] - u[1] * v[0]) / (q5len(u) * q5len(v)) < .006, perp = (u, v) => Math.abs(u[0] * v[0] + u[1] * v[1]) / (q5len(u) * q5len(v)) < .006;
  const p02 = par(S[0], S[2]), p13 = par(S[1], S[3]), pc = (p02 ? 1 : 0) + (p13 ? 1 : 0), right = [0, 1, 2, 3].every(i => perp(S[i], S[(i + 1) % 4])), all = L.every(l => eq(l, L[0]));
  const kiteA = eq(L[0], L[1]) && eq(L[2], L[3]), kiteB = eq(L[1], L[2]) && eq(L[3], L[0]);
  const kind = right && all ? 'sq' : right ? 'rect' : pc === 2 && all ? 'rhom' : pc === 2 ? 'para' : pc === 1 ? 'trap' : kiteA || kiteB ? 'kite' : 'any';
  const ticks = [0, 0, 0, 0]; if (all) ticks.fill(1); else if (pc === 2) { ticks[0] = ticks[2] = 1; ticks[1] = ticks[3] = 2; } else if (kiteA) { ticks[0] = ticks[1] = 1; ticks[2] = ticks[3] = 2; } else if (kiteB) { ticks[1] = ticks[2] = 1; ticks[3] = ticks[0] = 2; }
  const parm = {}; if (p02) { parm[0] = 1; parm[2] = 1; } if (p13) { parm[1] = 1; parm[3] = 1; }
  // diagonals
  const d1 = q5v(p[0], p[2]), d2 = q5v(p[1], p[3]), den = d1[0] * d2[1] - d1[1] * d2[0];
  let dg = null; if (Math.abs(den) > 1e-9) { const w = q5v(p[0], p[1]), t = (w[0] * d2[1] - w[1] * d2[0]) / den, u = (w[0] * d1[1] - w[1] * d1[0]) / den;
    if (t > 0 && t < 1 && u > 0 && u < 1) { const l1 = q5len(d1), l2 = q5len(d2), m = Math.max(l1, l2), close = (a, b) => Math.abs(a - b) <= m * .006 + .01;
      dg = { eq: close(l1, l2), b1: Math.abs(t - .5) < .008, b2: Math.abs(u - .5) < .008, perp: perp(d1, d2), O: [p[0][0] + d1[0] * t, p[0][1] + d1[1] * t], l1, l2 }; } }
  return { kind, L, pc, right, all, ticks, par: parm, dg };
}
const Q5_PRE = { sq: [[130, 60], [270, 60], [270, 200], [130, 200]], rect: [[80, 70], [320, 70], [320, 200], [80, 200]], rhom: [[200, 50], [320, 130], [200, 210], [80, 130]], para: [[120, 70], [330, 70], [280, 200], [70, 200]],
  trap: [[150, 70], [260, 70], [330, 200], [70, 200]], kite: [[200, 40], [280, 110], [200, 230], [120, 110]], any: [[100, 80], [300, 50], [330, 210], [130, 190]] };
const q5names = ['A', 'B', 'C', 'D'];
/* ---------- L1–L3: drag a quadrilateral, see its name, marks, properties, diagonals ---------- */
function simQuadKind(mode = 'kind') {
  const tag = h('div', { class: 't6-tags' }), out = fNote(), list = h('div', { class: 'colstack fstory q5-props' });
  const brd = polyBoard(Q5_PRE.para, { render: p => { const I = q5info(p); return { names: q5names, ticks: I.ticks, par: I.par, diags: mode === 'diag' ? [[0, 2], [1, 3]] : [], fill: '#FFD27A',
      extra: mode === 'diag' && I.dg ? `<circle cx="${I.dg.O[0]}" cy="${I.dg.O[1]}" r="4" fill="#E5487A"/>` + (I.dg.perp ? (() => { const d1 = q5v(p[0], p[2]), u = d1.map(v => v / q5len(d1)), d2 = q5v(p[1], p[3]), w = d2.map(v => v / q5len(d2)), O = I.dg.O, q = 10; return `<path d="M${O[0] + u[0] * q} ${O[1] + u[1] * q} l${w[0] * q} ${w[1] * q} l${-u[0] * q} ${-u[1] * q}" fill="none" stroke="#E5487A" stroke-width="1.8"/>`; })() : '') : '' }; },
    onChange: p => { const I = q5info(p); tag.innerHTML = `<span class="t6-tag a">${Q5N[I.kind]}</span>`;
      if (mode === 'diag') { const d = I.dg; list.innerHTML = d ? [['ยาวเท่ากัน', d.eq], ['แบ่งครึ่งซึ่งกันและกัน', d.b1 && d.b2], ['เส้นหนึ่งแบ่งครึ่งอีกเส้น', d.b1 !== d.b2], ['ตั้งฉากกัน', d.perp]].map(([t, ok]) => `<div class="fst-row ${ok ? 'q5-ok' : 'q5-no'}"><b>${ok ? '✓' : '✗'}</b><span>${t}</span></div>`).join('') : ''; out.innerHTML = `เส้นทแยงมุม AC ≈ ${(d ? d.l1 / 40 : 0).toFixed(1)} ซม. · BD ≈ ${(d ? d.l2 / 40 : 0).toFixed(1)} ซม.`; }
      else { const L = I.L.map(l => (l / 40).toFixed(1)); list.innerHTML = [['ด้านขนาน', I.pc === 2 ? 'ขนานกัน 2 คู่ (ลูกศร)' : I.pc === 1 ? 'ขนานกัน 1 คู่' : 'ไม่มีด้านขนานกัน'], ['ความยาวด้าน', `AB ${L[0]} · BC ${L[1]} · CD ${L[2]} · DA ${L[3]} ซม.`], ['มุม', I.right ? 'มุมฉากทุกมุม' : 'มีมุมที่ไม่ใช่มุมฉาก']].map(([a, b]) => `<div class="fst-row"><b>${a}</b><span>${b}</span></div>`).join('');
        out.innerHTML = mode === 'prop' ? `<b>${Q5N[I.kind]}</b>: ${Q5P[I.kind]}` : `ขีดเล็ก = ด้านยาวเท่ากัน · ลูกศร = ด้านขนานกัน`; } } });
  const keys = ['sq', 'rect', 'rhom', 'para', 'trap', 'kite'];
  const pre = h('div', { class: 'rowstack' }, ...keys.map(k => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.page(); brd.set(Q5_PRE[k]); } }, Q5N[k].replace('รูปสี่เหลี่ยม', ''))));
  return h('div', { class: 'gside' }, h('div', { class: 'colstack' }, tag, brd, h('div', { class: 'cap' }, 'ลากจุดสีม่วงเปลี่ยนรูป · หรือกดเลือกชนิด')), h('div', { class: 'colstack gside-r' }, pre, list, out));
}
/* ---------- v126 (ผู้ใช้ขอ) L1–L3: รูปสี่เหลี่ยมทีละชนิด คนละหน้า ----------
   • ลากจุดสีม่วงปรับขนาดได้ แต่ “ยังเป็นชนิดเดิมเสมอ” (มีเงื่อนไขกันไม่ให้กลายเป็นชนิดอื่น เช่น ผืนผ้าด้านไม่เท่ากัน · ด้านขนานไม่มีมุมฉาก)
   • กด “ขั้นต่อไป” ทีละขั้น: รายละเอียดขึ้นทีละข้อ และขึ้นบนรูปด้วย (ความยาวด้าน · ขีดด้านเท่า · ลูกศรขนาน · มุม · เส้นทแยงมุม) ส่วนที่กำลังพูดถึงเป็นสี
   mode: 'kind' (ด่าน 1 ชนิด) · 'diag' (ด่าน 2 เส้นทแยงมุม) · 'prop' (ด่าน 3 สมบัติและความสัมพันธ์) */
const Q5G = { // พารามิเตอร์ (ซม.) · จุด A B C D (ทวนเข็ม เริ่มล่างซ้าย) · จุดที่ลากได้ → อัปเดตพารามิเตอร์ · แก้ให้ยังเป็นชนิดเดิม
  sq: { v: { s: 5 }, pts: ({ s }) => [[-s / 2, -s / 2], [s / 2, -s / 2], [s / 2, s / 2], [-s / 2, s / 2]], drag: { 2: (v, x, y) => { v.s = Math.max(Math.abs(x), Math.abs(y)) * 2; } }, lim: { s: [2, 7] } },
  rect: { v: { w: 8, h: 4.5 }, pts: ({ w, h }) => [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], drag: { 2: (v, x, y) => { v.w = Math.abs(x) * 2; v.h = Math.abs(y) * 2; } }, lim: { w: [2, 10], h: [1.5, 7.5] },
    fix: v => { if (Math.abs(v.w - v.h) < .25) v.h = v.h > 2 ? v.w - .5 : v.w + .5; } },
  rhom: { v: { d1: 8, d2: 5.5 }, pts: ({ d1, d2 }) => [[0, -d2 / 2], [d1 / 2, 0], [0, d2 / 2], [-d1 / 2, 0]], drag: { 1: (v, x) => { v.d1 = Math.abs(x) * 2; }, 2: (v, x, y) => { v.d2 = Math.abs(y) * 2; } }, lim: { d1: [3, 10], d2: [2, 7] },
    fix: v => { if (Math.abs(v.d1 - v.d2) < .25) v.d2 = v.d2 > 2.5 ? v.d1 - .5 : v.d1 + .5; } },
  para: { v: { b: 6.5, h: 4, o: 2 }, pts: ({ b, h, o }) => [[-b / 2 - o / 2, -h / 2], [b / 2 - o / 2, -h / 2], [b / 2 + o / 2, h / 2], [-b / 2 + o / 2, h / 2]],
    drag: { 1: (v, x) => { v.b = 2 * x + v.o; }, 3: (v, x, y) => { v.h = Math.abs(y) * 2; v.o = 2 * x + v.b; } }, lim: { b: [3, 8], h: [1.5, 6], o: [-3, 3] },
    fix: v => { if (Math.abs(v.o) < .25) v.o = .5; if (Math.abs(Math.hypot(v.o, v.h) - v.b) < .15) v.o += v.o > 0 ? .5 : -.5; } },
  trap: { v: { b: 8.5, t: 4.5, h: 4, o: .5 }, pts: ({ b, t, h, o }) => [[-b / 2, -h / 2], [b / 2, -h / 2], [o + t / 2, h / 2], [o - t / 2, h / 2]],
    drag: { 1: (v, x) => { v.b = Math.abs(x) * 2; }, 2: (v, x, y) => { const l = v.o - v.t / 2; v.t = x - l; v.o = l + v.t / 2; v.h = Math.abs(y) * 2; }, 3: (v, x, y) => { const r = v.o + v.t / 2; v.t = r - x; v.o = r - v.t / 2; v.h = Math.abs(y) * 2; } }, lim: { b: [4, 10], t: [1.5, 8.5], h: [1.5, 6], o: [-2.5, 2.5] },
    fix: v => { if (v.t > v.b - 1) v.t = v.b - 1; } },
  kite: { v: { w: 3, a: 1.5, c: 4.5 }, pts: ({ w, a, c }) => [[0, -c], [w, 0], [0, a], [-w, 0]], drag: { 0: (v, x, y) => { v.c = Math.abs(y); }, 1: (v, x) => { v.w = Math.abs(x); }, 2: (v, x, y) => { v.a = Math.abs(y); } }, lim: { w: [1, 4], a: [.5, 3], c: [1.5, 5] },
    fix: v => { if (Math.abs(v.a - v.c) < .25) v.c = v.a + .5 <= 5 ? v.a + 1 : v.a - 1; } } };
const Q5NM = ['A', 'B', 'C', 'D'], q5r = x => Math.round(x * 2) / 2;
const q5cm = x => (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, '');
function q5geo(kind, v) { const P = Q5G[kind].pts(v), K = 31, X = q => [220 + q[0] * K, 150 - q[1] * K], p = P.map(X);
  const L = [0, 1, 2, 3].map(i => Math.hypot(P[(i + 1) % 4][0] - P[i][0], P[(i + 1) % 4][1] - P[i][1])); return { P, p, L, K }; }
function simQuadType(kind, mode = 'kind') {
  const G = Q5G[kind], v = Object.assign({}, G.v); let k = 0, drag = null;
  const fig = h('div', { class: 't6-board ia q5t-board' }), list = h('div', { class: 'colstack fstory q5-props q5t-list' }), out = h('div', { class: 'q5t-sum' });
  const SC = ['#E5487A', '#3D8BD9'], N = Q5N[kind];
  const ang = g => k7round(k7raw(g.p)), eqA = (a, b) => Math.abs(a - b) < .6;
  const D = g => { const I = q5info(g.p), d = I.dg, dl = [Math.hypot(g.P[2][0] - g.P[0][0], g.P[2][1] - g.P[0][1]), Math.hypot(g.P[3][0] - g.P[1][0], g.P[3][1] - g.P[1][1])]; return { I, d, dl }; };
  const S = {
    kind: { sq: [['ด้าน', g => `ด้านทั้ง 4 ยาวเท่ากัน (${q5cm(g.L[0])} ซม.)`, { lens: 1, ticks: 1, hl: [[0, 1, 2, 3]] }], ['มุม', () => 'มุมทั้ง 4 เป็น<b>มุมฉาก</b> (90°)', { right: 1, angles: 1 }], ['ด้านขนาน', () => 'ด้านตรงข้ามขนานกัน <b>2 คู่</b> (AB ∥ DC · AD ∥ BC)', { par: 1, hl: [[0, 2], [1, 3]] }]],
      rect: [['ด้าน', g => `ด้านตรงข้ามยาวเท่ากัน (AB = DC = ${q5cm(g.L[0])} ซม. · AD = BC = ${q5cm(g.L[1])} ซม.) แต่ด้านติดกันยาว<b>ไม่เท่ากัน</b>`, { lens: 1, ticks: 1, hl: [[0, 2], [1, 3]] }], ['มุม', () => 'มุมทั้ง 4 เป็น<b>มุมฉาก</b> (90°)', { right: 1, angles: 1 }], ['ด้านขนาน', () => 'ด้านตรงข้ามขนานกัน <b>2 คู่</b>', { par: 1, hl: [[0, 2], [1, 3]] }]],
      rhom: [['ด้าน', g => `ด้านทั้ง 4 ยาวเท่ากัน (${q5cm(g.L[0])} ซม.)`, { lens: 1, ticks: 1, hl: [[0, 1, 2, 3]] }], ['มุม', g => { const A = ang(g); return `<b>ไม่มีมุมฉาก</b> · มุมตรงข้ามเท่ากัน (มุม A = มุม C = ${A[0]}° · มุม B = มุม D = ${A[1]}°)`; }, { angles: 1 }], ['ด้านขนาน', () => 'ด้านตรงข้ามขนานกัน <b>2 คู่</b>', { par: 1, hl: [[0, 2], [1, 3]] }]],
      para: [['ด้าน', g => `ด้านตรงข้ามยาวเท่ากัน (AB = DC = ${q5cm(g.L[0])} ซม. · AD = BC = ${q5cm(g.L[1])} ซม.)`, { lens: 1, ticks: 1, hl: [[0, 2], [1, 3]] }], ['มุม', g => { const A = ang(g); return `<b>ไม่มีมุมฉาก</b> · มุมตรงข้ามเท่ากัน (มุม A = มุม C = ${A[0]}° · มุม B = มุม D = ${A[1]}°)`; }, { angles: 1 }], ['ด้านขนาน', () => 'ด้านตรงข้ามขนานกัน <b>2 คู่</b>', { par: 1, hl: [[0, 2], [1, 3]] }]],
      trap: [['ด้านขนาน', () => 'มีด้านขนานกัน<b>เพียง 1 คู่</b> (AB ∥ DC) อีกคู่ไม่ขนาน', { par: 1, hl: [[0, 2]] }], ['ด้าน', g => `ด้านที่ขนานกันยาว<b>ไม่เท่ากัน</b> (AB = ${q5cm(g.L[0])} ซม. · DC = ${q5cm(g.L[2])} ซม.)`, { lens: 1, hl: [[0], [2]] }], ['มุม', () => 'มุมเป็นขนาดใดก็ได้ (มีมุมฉากหรือไม่มีก็ได้)', { angles: 1, right: 1 }]],
      kite: [['ด้าน', g => `ด้านที่<b>อยู่ติดกัน</b>ยาวเท่ากัน 2 คู่ (AB = AD = ${q5cm(g.L[0])} ซม. · CB = CD = ${q5cm(g.L[1])} ซม.)`, { lens: 1, ticks: 1, hl: [[0, 3], [1, 2]] }], ['มุม', g => { const A = ang(g); return `มุมที่อยู่ตรงข้ามกัน<b>คู่หนึ่งเท่ากัน</b> (มุม B = มุม D = ${A[1]}°)`; }, { angles: 1 }], ['ด้านขนาน', () => '<b>ไม่มี</b>ด้านขนานกันเลย', { par: 1 }]] } };
  const diagSteps = [['เส้นทแยงมุม', () => 'ลากเส้นทแยงมุม <b>AC</b> และ <b>BD</b> (เชื่อมจุดยอดที่ไม่อยู่ติดกัน) — มี 2 เส้น', { diags: 1 }],
    ['ยาวเท่ากันไหม?', g => { const { dl } = D(g), ok = Math.abs(dl[0] - dl[1]) < .05; return `AC = ${q5cm(dl[0])} ซม. · BD = ${q5cm(dl[1])} ซม. → ${ok ? '<b class="q5y">ยาวเท่ากัน ✓</b>' : '<b class="q5n">ยาวไม่เท่ากัน ✗</b>'}`; }, { diags: 1, dlen: 1 }],
    ['แบ่งครึ่งกันไหม?', g => { const { d } = D(g); if (!d) return ''; return d.b1 && d.b2 ? '<b class="q5y">แบ่งครึ่งซึ่งกันและกัน ✓</b> (AO = OC · BO = OD)' : d.b1 || d.b2 ? `<b class="q5y">เส้นหนึ่งแบ่งครึ่งอีกเส้น</b> (${d.b2 ? 'BO = OD' : 'AO = OC'}) แต่ไม่แบ่งครึ่งซึ่งกันและกัน` : '<b class="q5n">ไม่แบ่งครึ่งกัน ✗</b>'; }, { diags: 1, dhalf: 1 }],
    ['ตั้งฉากไหม?', g => { const { d } = D(g); return d && d.perp ? '<b class="q5y">ตั้งฉากกัน ✓</b> (มุมที่จุดตัด 90°)' : '<b class="q5n">ไม่ตั้งฉากกัน ✗</b>'; }, { diags: 1, dperp: 1 }]];
  const REL = { sq: 'เป็นทั้ง<b>ผืนผ้า</b> (มุมฉากทุกมุม) และ<b>ขนมเปียกปูน</b> (ด้านเท่ากันหมด) และเป็น<b>ด้านขนาน</b>ด้วย', rect: 'เป็น<b>ด้านขนาน</b>ชนิดหนึ่งที่มีมุมฉาก · ถ้าด้านเท่ากันหมดจะกลายเป็นจัตุรัส', rhom: 'เป็น<b>ด้านขนาน</b>ชนิดหนึ่งที่ด้านเท่ากันหมด · ถ้ามีมุมฉากจะกลายเป็นจัตุรัส',
    para: 'ถ้ามีมุมฉาก → <b>ผืนผ้า</b> · ถ้าด้านเท่ากันหมด → <b>ขนมเปียกปูน</b> · ถ้าทั้งสองอย่าง → <b>จัตุรัส</b>', trap: 'ขนานกัน<b>เพียง 1 คู่</b> จึง<b>ไม่ใช่</b>ด้านขนาน', kite: 'ถ้าด้านทั้ง 4 ยาวเท่ากัน จะกลายเป็น<b>ขนมเปียกปูน</b>' };
  const steps = mode === 'diag' ? diagSteps : mode === 'prop' ? [...S.kind[kind], ['ความสัมพันธ์', () => REL[kind], {}]] : S.kind[kind];
  const render = () => { const g = q5geo(kind, v), I = q5info(g.p), on = {}; steps.slice(0, k).forEach(st => Object.assign(on, st[2], { hl: null })); const cur = k ? steps[k - 1][2] : {};
    const segs = []; (cur.hl || []).forEach((grp, gi) => grp.forEach(i => segs.push({ a: g.p[i], b: g.p[(i + 1) % 4], col: SC[gi % 2], w: 6, solid: true })));
    let extra = ''; const { d, dl } = D(g);
    if (on.diags && d) { extra += `<circle cx="${d.O[0]}" cy="${d.O[1]}" r="4.5" fill="#E5487A"/><text x="${d.O[0] + 9}" y="${d.O[1] - 8}" class="g6l">O</text>`;
      if (on.dhalf) { const mk = (a, b, n, col) => { const M = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]; let s2 = ''; for (let j = 0; j < n; j++) { const c = [M[0] + u[0] * (j - (n - 1) / 2) * 6, M[1] + u[1] * (j - (n - 1) / 2) * 6]; s2 += `<path d="M${c[0] - u[1] * 7} ${c[1] + u[0] * 7} L${c[0] + u[1] * 7} ${c[1] - u[0] * 7}" stroke="${col}" stroke-width="2.4"/>`; } return s2; };
        if (d.b1) extra += mk(g.p[0], d.O, 1, '#E5487A') + mk(d.O, g.p[2], 1, '#E5487A'); if (d.b2) extra += mk(g.p[1], d.O, 2, '#3D8BD9') + mk(d.O, g.p[3], 2, '#3D8BD9'); }
      if (on.dperp) { if (d.perp) { const d1 = q5v(g.p[0], g.p[2]), u = d1.map(x => x / q5len(d1)), d2 = q5v(g.p[1], g.p[3]), w = d2.map(x => x / q5len(d2)), q = 12; extra += `<path d="M${d.O[0] + u[0] * q} ${d.O[1] + u[1] * q} l${w[0] * q} ${w[1] * q} l${-u[0] * q} ${-u[1] * q}" fill="none" stroke="#E5487A" stroke-width="2.2"/>`; }
        else { const d1 = q5v(d.O, g.p[2]), d2 = q5v(d.O, g.p[3]), a1 = Math.atan2(d1[1], d1[0]), a2 = Math.atan2(d2[1], d2[0]), r = 18, deg = Math.round(Math.abs(((a2 - a1) * 180 / Math.PI + 540) % 360 - 180)); extra += `<path d="M${d.O[0] + r * Math.cos(a1)} ${d.O[1] + r * Math.sin(a1)} A${r} ${r} 0 0 0 ${d.O[0] + r * Math.cos(a2)} ${d.O[1] + r * Math.sin(a2)}" fill="none" stroke="#C98612" stroke-width="2.4"/><text x="${d.O[0] + 30 * Math.cos((a1 + a2) / 2)}" y="${d.O[1] + 30 * Math.sin((a1 + a2) / 2) + 5}" text-anchor="middle" class="t6-av">${deg}°</text>`; } } }
    const dsegs = on.dlen && d ? [{ a: g.p[0], b: d.O, col: '#7E6ED6', w: 0.01, label: `AC = ${q5cm(dl[0])}`, off: 14 }, { a: d.O, b: g.p[3], col: '#3D8BD9', w: 0.01, label: `BD = ${q5cm(dl[1])}`, off: 14 }] : [];
    const handles = Object.keys(G.drag).map(i => `<circle class="t6-h drag q5t-h" data-i="${i}" cx="${g.p[i][0]}" cy="${g.p[i][1]}" r="12" fill="#7E6ED6" fill-opacity=".85" stroke="#fff" stroke-width="2.6"/>`).join('');
    fig.innerHTML = polySVG(g.p, { W: 440, H: 300, names: Q5NM, fill: '#FFD27A', ticks: on.ticks ? I.ticks : null, par: on.par ? I.par : null, rightMarks: !!on.right, angles: on.angles ? [true, true, true, true] : null, sides: on.lens ? g.L.map(l => `${q5cm(l)} ซม.`) : null,
      diags: on.diags ? [[0, 2], [1, 3]] : [], segs: [...segs, ...dsegs], extra: extra + handles });
    // v128 (ผู้ใช้ขอ): จองที่ไว้ครบทุกขั้นตั้งแต่แรก (แถวที่ยังไม่ถึงมองไม่เห็น) — ปุ่ม “ขั้นต่อไป” อยู่กับที่ด้านล่างเสมอ
    list.innerHTML = steps.map((st, i) => `<div class="fst-row${i === k - 1 ? ' cur' : ''}${i >= k ? ' q5t-ghost' : ''}"><b>${st[0]}</b><span>${st[1](g)}</span></div>`).join('');
    out.innerHTML = mode === 'diag' ? `<b>${N}</b>: เส้นทแยงมุม${Q5D[kind]}` : `ครบทุกข้อ → เป็น<b>${N}</b>`; out.classList.toggle('q5t-ghost', k < steps.length); };
  const pt = e => { const svg = fig.querySelector('svg'), m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m); return [(r.x - 220) / 31, (150 - r.y) / 31]; };
  const clampV = () => { Object.entries(G.lim).forEach(([key, [a, b]]) => { v[key] = Math.max(a, Math.min(b, q5r(v[key]))); }); G.fix && G.fix(v); Object.entries(G.lim).forEach(([key, [a, b]]) => { v[key] = Math.max(a, Math.min(b, v[key])); }); G.fix && G.fix(v); };
  fig.addEventListener('pointerdown', e => { const hd = e.target.closest('.q5t-h'); if (!hd) return; e.preventDefault(); e.stopPropagation(); drag = +hd.dataset.i; try { fig.setPointerCapture(e.pointerId); } catch (_) { } });
  fig.addEventListener('pointermove', e => { if (drag == null) return; const [x, y] = pt(e), old = JSON.stringify(v), g0 = q5geo(kind, v); G.drag[drag](v, x, y, g0); clampV(); if (JSON.stringify(v) !== old) { render(); sfx.tap && sfx.tap(); } });
  const end = () => { drag = null; }; fig.addEventListener('pointerup', end); fig.addEventListener('pointercancel', end); fig.addEventListener('lostpointercapture', end); fig.addEventListener('click', e => e.stopPropagation());
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); k++; sfx.pop(k * 2); render(); if (k >= steps.length) { btn.dataset.done = 1; btn.style.visibility = 'hidden'; sfx.ok(); say(mode === 'diag' ? `${N} เส้นทแยงมุม ${Q5D[kind].replace(/·/g, ' ')}` : `นี่คือ ${N}`, true); } else btn.lastChild.textContent = `ขั้นที่ ${k + 1}: ${steps[k][0]}`; } }, icon('right'), h('span', null, `ขั้นที่ 1: ${steps[0][0]}`));
  render();
  return h('div', { class: 'gside q5t' }, h('div', { class: 'colstack' }, h('div', { class: 't6-tags', html: `<span class="t6-tag a">${N}</span>` }), fig, h('div', { class: 'cap' }, `ลากจุดสีม่วงปรับขนาด — ยังเป็น${N.replace('รูปสี่เหลี่ยม', 'รูปสี่เหลี่ยม')}เสมอ`)), h('div', { class: 'colstack gside-r q5t-r' }, list, out, btn));
}
const Q5ORD = ['sq', 'rect', 'rhom', 'para', 'trap', 'kite'];
const q5typePages = mode => Q5ORD.map((kd, i) => T(`${i + 1}/6 <b>${Q5N[kd]}</b> — กดทีละขั้น · ลากจุดสีม่วงปรับขนาดได้`, `${Q5N[kd]} กดทีละขั้น ลากจุดสีม่วงปรับขนาดได้`, el => el.append(simQuadType(kd, mode))));
/* ---------- L4–L9: build from parameters (sides/angle, kite, trapezoid, diagonals) ---------- */
function q5build(kind, v) {
  const r = Math.PI / 180;
  if (kind === 'para') { const [a, b, ang] = v, d = [b * Math.cos(ang * r), b * Math.sin(ang * r)]; return [[0, 0], [a, 0], [a + d[0], d[1]], [d[0], d[1]]]; }
  if (kind === 'kite') { const [a, b, ang] = v, w = a * Math.sin(ang * r / 2), y = a * Math.cos(ang * r / 2); if (b <= w + .05) return null; const yb = y + Math.sqrt(b * b - w * w); return [[0, 0], [w, -y], [0, -yb], [-w, -y]]; }
  if (kind === 'trap') { const [bt, tp, hh, s] = v; return [[0, 0], [bt, 0], [s + tp, hh], [s, hh]]; }
  const [d1, d2, ang, t, u] = v, c = Math.cos(ang * r), sn = Math.sin(ang * r); // diagonals: AC along x, BD at angle
  return [[-t * d1, 0], [-u * d2 * c, -u * d2 * sn], [(1 - t) * d1, 0], [(1 - u) * d2 * c, (1 - u) * d2 * sn]].map(q => [q[0], q[1]]).sort(() => 0);
}
function simQuadBuild(kind) {
  const C = { para: { lab: ['ด้าน AB (ซม.)', 'ด้าน AD (ซม.)', 'มุม A (°)'], v: [5, 3, 60], rng: [[2, 7], [2, 7], [30, 150]], st: [1, 1, 15] },
    kite: { lab: ['ด้านสั้น (ซม.)', 'ด้านยาว (ซม.)', 'มุมยอด (°)'], v: [3, 5, 100], rng: [[2, 5], [2, 7], [40, 160]], st: [1, 1, 10] },
    trap: { lab: ['ฐานล่าง', 'ด้านบน', 'สูง', 'เลื่อนด้านบน'], v: [6, 3, 3, 1], rng: [[3, 8], [1, 8], [1, 4], [-2, 5]], st: [1, 1, 1, 1] },
    dEq: { lab: ['เส้นทแยงมุม (ซม.)', 'มุมที่จุดตัด (°)'], v: [6, 60], rng: [[3, 8], [30, 150]], st: [1, 15] },
    dBis: { lab: ['AC (ซม.)', 'BD (ซม.)', 'มุมที่จุดตัด (°)'], v: [7, 4, 50], rng: [[3, 8], [2, 8], [30, 150]], st: [1, 1, 10] },
    dPerp: { lab: ['AC (ซม.)', 'BD (ซม.)', 'จุดตัดห่างจาก A'], v: [6, 4, 2], rng: [[3, 8], [2, 8], [1, 7]], st: [1, 1, 1] } }[kind];
  const v = C.v.slice(), fig = h('div', { class: 't6-board' }), tag = h('div', { class: 't6-tags' }), out = fNote();
  const pts = () => kind === 'dEq' ? q5build('d', [v[0], v[0], v[1], .5, .5]) : kind === 'dBis' ? q5build('d', [v[0], v[1], v[2], .5, .5]) : kind === 'dPerp' ? q5build('d', [v[0], v[1], 90, Math.min(v[2], v[0] - 1) / v[0], .5]) : q5build(kind, v);
  const draw = () => { const p = pts(); if (!p) { fig.innerHTML = '<div class="t6-no">✗</div>'; tag.innerHTML = ''; out.innerHTML = 'สร้างไม่ได้: ด้านยาวต้องยาวพอให้ส่วนโค้งตัดกัน'; return; }
    const I = q5info(p), dg = kind[0] === 'd', fig2 = polySVG(p, { fit: true, W: 400, H: 260, k: 32, names: q5names, ticks: I.ticks, par: I.par, fill: '#FFD27A', diags: dg ? [[0, 2], [1, 3]] : [], rightMarks: !dg || I.right,
      sides: kind === 'para' ? [`${v[0]} ซม.`, null, null, `${v[1]} ซม.`] : kind === 'trap' ? [`${v[0]}`, null, `${v[1]}`, null] : null, angles: kind === 'para' ? [v[2], null, null, null] : kind === 'kite' ? [v[2], null, null, null] : null, arcs: kind === 'para' || kind === 'kite' ? false : undefined });
    fig.innerHTML = fig2; tag.innerHTML = `<span class="t6-tag a">${Q5N[I.kind]}</span>`;
    out.innerHTML = kind === 'para' ? `ลาก AB → วัดมุม A ${v[2]}° ลาก AD → ลากเส้นขนานจาก D และ B ตัดกันที่ C${v[2] === 90 ? ' · มุมฉาก → ' + (v[0] === v[1] ? 'จัตุรัส' : 'ผืนผ้า') : v[0] === v[1] ? ' · ด้านเท่ากันทุกด้าน → ขนมเปียกปูน' : ''}`
      : kind === 'kite' ? 'ด้านสั้น 2 ด้านยาวเท่ากัน ด้านยาว 2 ด้านยาวเท่ากัน — ใช้วงเวียนเขียนส่วนโค้งตัดกันที่จุดล่าง'
      : kind === 'trap' ? (I.kind === 'trap' ? 'ด้านบนขนานกับฐานล่าง แต่ยาวไม่เท่ากัน → คางหมู' : `ด้านบนยาวเท่าฐาน → ${Q5N[I.kind]}`)
      : `เส้นทแยงมุม: ${Q5D[I.kind]} → ได้<b>${Q5N[I.kind]}</b>`; };
  const S = v.map((_, i) => stepper(C.lab[i], () => v[i], x => { v[i] = Math.max(C.rng[i][0], Math.min(C.rng[i][1], v[i] + Math.sign(x - v[i]) * C.st[i])); }, () => -99, () => 999, () => { S[i].sync(); draw(); }));
  draw(); return h('div', { class: 'colstack' }, tag, fig, h('div', { class: 'rowstack' }, ...S), out);
}
/* construction step pictures (simLayers, 600×300) */
const q5L = (P, Q, c = '#2B2550', w = 3, ex = '') => `<path d="M${P} L${Q}" stroke="${c}" stroke-width="${w}" ${ex}/>`;
const q5Pt = (P, t, dx = 8, dy = -8) => `<circle cx="${P[0]}" cy="${P[1]}" r="4.5" fill="#E5487A"/><text x="${P[0] + dx}" y="${P[1] + dy}" class="g6l">${t}</text>`;
const q5Arc = (C, R, a1, a2) => { const r = Math.PI / 180; return `<path d="M${C[0] + R * Math.cos(a1 * r)} ${C[1] - R * Math.sin(a1 * r)} A${R} ${R} 0 0 0 ${C[0] + R * Math.cos(a2 * r)} ${C[1] - R * Math.sin(a2 * r)}" fill="none" stroke="#7E6ED6" stroke-width="2.4" stroke-dasharray="6 4"/>`; };
const q5Prot = P => `<path d="M${P[0] - 55} ${P[1]} A55 55 0 0 1 ${P[0] + 55} ${P[1]} Z" fill="#FFE7A3" fill-opacity=".5" stroke="#C98612" stroke-width="1.6"/>`;
const q5Dash = (P, Q) => q5L(P, Q, '#9790B0', 2, 'stroke-dasharray="6 5"');
const Q5C = {
  para: (() => { const A = [150, 250], B = [350, 250], D = [210, 146.1], C = [410, 146.1]; return [q5L(A, B) + q5Pt(A, 'A', -18, 18) + q5Pt(B, 'B', 4, 18), [
    ['① ลากฐาน', 'ลาก AB ยาว 5 ซม.', ''], ['② สร้างมุม A = 60°', 'วางไม้โปรแทรกเตอร์ที่ A ลากแขนของมุม แล้ววัด AD ยาว 3 ซม.', q5Prot(A) + q5Dash(A, [270, 42.2]) + q5Pt(D, 'D', -18, -6) + q5L(A, D, '#E5487A')],
    ['③ เขียนส่วนโค้ง 2 ครั้ง', 'กางวงเวียน 5 ซม. จาก D และ 3 ซม. จาก B ตัดกันที่ C', q5Arc(D, 200, -10, 20) + q5Arc(B, 120, 45, 75) + q5Pt(C, 'C', 6, -6)], ['④ ลากเส้น', 'ลาก DC และ BC ได้รูปสี่เหลี่ยมด้านขนาน ABCD', q5L(D, C) + q5L(B, C)]], 'ด้านตรงข้ามยาวเท่ากันและขนานกัน 2 คู่ → <b>รูปสี่เหลี่ยมด้านขนาน</b>']; })(),
  kite: (() => { const A = [300, 40], B = [231.1, 97.9], D = [368.9, 97.9], C = [300, 231.1]; return [q5Pt(A, 'A', 8, -2), [
    ['① ด้านสั้นด้านแรก', 'ลาก AB ยาว 3 ซม.', q5L(A, B) + q5Pt(B, 'B', -20, 0)], ['② สร้างมุม A = 100°', 'วัดมุม 100° ที่ A ลาก AD ยาว 3 ซม.', q5L(A, D) + q5Pt(D, 'D', 8, 0)],
    ['③ ส่วนโค้งรัศมี 5 ซม.', 'จุดปลายเหล็กที่ B และ D เขียนส่วนโค้งรัศมี 5 ซม. ตัดกันที่ C', q5Arc(B, 150, -70, -40) + q5Arc(D, 150, -140, -110) + q5Pt(C, 'C', 8, 14)], ['④ ลากเส้น', 'ลาก BC และ DC ได้รูปว่าว ABCD', q5L(B, C) + q5L(D, C)]], 'AB = AD และ CB = CD → <b>รูปสี่เหลี่ยมรูปว่าว</b>']; })(),
  trap: (() => { const A = [120, 250], B = [360, 250], D = [180, 146.1], C = [300, 146.1]; return [q5L(A, B) + q5Pt(A, 'A', -18, 18) + q5Pt(B, 'B', 4, 18), [
    ['① ลากฐาน', 'ลาก AB ยาว 6 ซม.', ''], ['② สร้างมุม A = 60°', 'วัดมุม 60° ที่ A ลาก AD ยาว 3 ซม.', q5Prot(A) + q5L(A, D, '#E5487A') + q5Pt(D, 'D', -18, -6)],
    ['③ ลากเส้นขนาน', 'ผ่านจุด D ลากเส้นขนานกับ AB แล้ววัด DC ยาว 3 ซม.', q5Dash([140, 146.1], [470, 146.1]) + q5Pt(C, 'C', 6, -8)], ['④ ลากเส้น', 'ลาก BC ได้รูปสี่เหลี่ยมคางหมู ABCD', q5L(D, C) + q5L(B, C)]], 'DC ขนานกับ AB เพียง 1 คู่ → <b>รูปสี่เหลี่ยมคางหมู</b>']; })(),
  dEq: (() => { const O = [300, 160], A = [180, 160], C = [420, 160], B = [240, 263.9], D = [360, 56.1]; return [q5L(A, C) + q5Pt(A, 'A', -20, 6) + q5Pt(C, 'C', 6, 6), [
    ['① ลากเส้นทแยงมุม AC', 'ยาว 6 ซม.', ''], ['② หาจุดกึ่งกลาง O', 'แบ่งครึ่ง AC: AO = OC = 3 ซม.', q5Pt(O, 'O', 6, 18)],
    ['③ ลาก BD ผ่าน O', 'ทำมุม 60° กับ AC ยาว 6 ซม. ให้ OB = OD = 3 ซม.', q5L(B, D, '#E5487A') + q5Pt(B, 'B', -18, 14) + q5Pt(D, 'D', 6, -6)], ['④ ลากเส้นรอบรูป', 'ลาก AB BC CD DA', q5L(A, B) + q5L(B, C) + q5L(C, D) + q5L(D, A)]], 'เส้นทแยงมุมยาวเท่ากันและแบ่งครึ่งซึ่งกันและกัน → <b>รูปสี่เหลี่ยมผืนผ้า</b> (ถ้าตั้งฉากด้วย → จัตุรัส)']; })(),
  dBis: (() => { const O = [300, 160], A = [160, 160], C = [440, 160], r = Math.PI / 180, B = [O[0] - 80 * Math.cos(50 * r), O[1] + 80 * Math.sin(50 * r)], D = [O[0] + 80 * Math.cos(50 * r), O[1] - 80 * Math.sin(50 * r)]; return [q5L(A, C) + q5Pt(A, 'A', -20, 6) + q5Pt(C, 'C', 6, 6), [
    ['① ลาก AC', 'ยาว 7 ซม.', ''], ['② จุดกึ่งกลาง O', 'AO = OC = 3.5 ซม.', q5Pt(O, 'O', 6, 18)], ['③ ลาก BD ผ่าน O', 'ทำมุม 50° ยาว 4 ซม. ให้ OB = OD = 2 ซม.', q5L(B, D, '#E5487A') + q5Pt(B, 'B', -18, 14) + q5Pt(D, 'D', 6, -6)],
    ['④ ลากเส้นรอบรูป', 'ลาก AB BC CD DA', q5L(A, B) + q5L(B, C) + q5L(C, D) + q5L(D, A)]], 'เส้นทแยงมุมแบ่งครึ่งซึ่งกันและกัน → <b>รูปสี่เหลี่ยมด้านขนาน</b>']; })(),
  dPerp: (() => { const A = [300, 30], C = [300, 270], O = [300, 110], B = [220, 110], D = [380, 110]; return [q5L(A, C) + q5Pt(A, 'A', 8, 0) + q5Pt(C, 'C', 8, 6), [
    ['① ลาก AC', 'ยาว 6 ซม.', ''], ['② จุด O บน AC', 'วัดจาก A 2 ซม. ได้จุด O', q5Pt(O, 'O', 8, 18)], ['③ ลาก BD ตั้งฉากกับ AC ที่ O', 'ยาว 4 ซม. ให้ OB = OD = 2 ซม.', q5L(B, D, '#E5487A') + SQ6(300, 110, 12, -12) + q5Pt(B, 'B', -18, -6) + q5Pt(D, 'D', 6, -6)],
    ['④ ลากเส้นรอบรูป', 'ลาก AB BC CD DA', q5L(A, B) + q5L(B, C) + q5L(C, D) + q5L(D, A)]], 'เส้นทแยงมุมตั้งฉากกัน และ BD ถูกแบ่งครึ่ง → <b>รูปสี่เหลี่ยมรูปว่าว</b>']; })()
};
const q5cons = k => c8col(simLayers(...Q5C[k]));

/* ---------- L10–L12: parallelogram base & height, area ---------- */
function simParaBase() {
  let base = 0; const P = [[0, 0], [6, 0], [9, 4], [3, 4]], out = fNote(), fig = h('div', { class: 't6-board' }), H = [4, 4.8];
  const draw = () => { const k = base === 0 ? 0 : 1, A = P[k], B = P[k + 1], v = (k + 2) % 4, d = q5v(A, B), L = q5len(d), u = d.map(x => x / L), w = q5v(A, P[v]), t = w[0] * u[0] + w[1] * u[1], F = [A[0] + u[0] * t, A[1] + u[1] * t];
    const ext = t > L ? [{ a: B, b: F, col: '#9790B0', w: 1.6 }] : t < 0 ? [{ a: A, b: F, col: '#9790B0', w: 1.6 }] : [];
    fig.innerHTML = polySVG(P, { fit: true, W: 440, H: 270, pad: 52, fitPts: [F], names: ['A', 'B', 'C', 'D'], fill: '#C4B5FD', par: { 0: 1, 1: 1, 2: 1, 3: 1 }, sides: base === 0 ? ['ฐาน 6 ซม.', '5 ซม.', null, null] : ['6 ซม.', 'ฐาน 5 ซม.', null, null],
      segs: [...ext, { a: P[v], b: F, label: `สูง ${H[base]}`, off: 20, col: '#E5487A' }], rms: [[P[v], F, t > L ? A : B]], rightMarks: false });
    out.innerHTML = `ฐาน ${base === 0 ? 'AB = 6' : 'BC = 5'} ซม. · ความสูง = ระยะห่างระหว่าง<b>ฐานกับด้านที่ขนานกับฐาน</b> = ${H[base]} ซม.${base === 1 ? ' (ต่อฐานออกไป)' : ''} → ${base === 0 ? 6 : 5} × ${H[base]} = <b>24 ตร.ซม.</b> เท่ากันทั้งสองแบบ`; };
  const btn = [0, 1].map(b => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); base = b; sfx.pop(b + 1); draw(); } }, b ? 'ใช้ BC เป็นฐาน' : 'ใช้ AB เป็นฐาน'));
  draw(); return h('div', { class: 'colstack' }, fig, h('div', { class: 'rowstack' }, ...btn), out);
}
function simParaArea(rhomb) {
  let b = 6, hh = 3, off = 2, cut = false; const fig = h('div', { class: 't6-board' }), big = h('div', { class: 'fbig t6-ar' }), out = fNote();
  const draw = () => { if (rhomb) { off = Math.sqrt(Math.max(0, b * b - hh * hh)); } const P = [[0, 0], [b, 0], [b + off, hh], [off, hh]], o = { fit: true, W: 460, H: 250, k: 34, fitPts: [[b + off, 0]], rightMarks: false };
    fig.innerHTML = cut ? polySVG([[off, 0], [b + off, 0], [b + off, hh], [off, hh]], { ...o, fill: '#7EDDB8', polys: [{ pts: [[0, 0], [off, 0], [off, hh]], fill: 'none', dash: true }], over: [{ pts: [[b, 0], [b + off, 0], [b + off, hh]], fill: '#FFB38A' }], sides: [`ฐาน ${b}`, `สูง ${hh}`, null, null], rms: [[[off, hh], [off, 0], [b, 0]]] })
      : polySVG(P, { ...o, fill: rhomb ? '#F9A8D4' : '#7EDDB8', ticks: rhomb ? [1, 1, 1, 1] : null, par: { 0: 1, 2: 1 }, sides: [`ฐาน ${b}`, rhomb ? `${b}` : null, null, null], over: [{ pts: [[0, 0], [off, 0], [off, hh]], fill: '#FFB38A' }], segs: [{ a: [off, hh], b: [off, 0], label: `สูง ${hh}`, off: 14, col: '#E5487A' }], rms: [[[off, hh], [off, 0], [b, 0]]] });
    big.innerHTML = `ฐาน × สูง = ${b} × ${hh} = <b>${b * hh}</b> ตร.ซม.`;
    out.innerHTML = cut ? 'ย้ายสามเหลี่ยมสีส้มไปต่ออีกข้าง ได้<b>รูปสี่เหลี่ยมผืนผ้า</b> ฐานและสูงเท่าเดิม → พื้นที่เท่ากัน' : rhomb ? 'รูปสี่เหลี่ยมขนมเปียกปูนเป็นรูปสี่เหลี่ยมด้านขนานชนิดหนึ่ง → พื้นที่ = ฐาน × สูง' : 'ตัดสามเหลี่ยมสีส้มออก แล้วย้ายไปต่ออีกข้างหนึ่ง'; };
  const bt = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); cut = !cut; sfx.ok(); bt.lastChild.textContent = cut ? 'ย้ายกลับ' : 'ตัดแล้วย้าย'; draw(); } }, icon('right'), 'ตัดแล้วย้าย');
  const S = [stepper(rhomb ? 'ด้าน (ซม.)' : 'ฐาน (ซม.)', () => b, x => { b = x; if (rhomb && hh > b) hh = b; }, () => 2, () => 8, draw), stepper('สูง (ซม.)', () => hh, x => hh = x, () => 1, () => rhomb ? b : 5, draw)];
  if (!rhomb) S.push(stepper('เอียง', () => off, x => off = x, () => 0, () => 4, draw));
  draw(); return h('div', { class: 'colstack' }, fig, big, h('div', { class: 'rowstack' }, ...S, bt), out);
}

/* =========================================================
   ========================================================= */
const q5rot = (p, deg) => { const r = deg * Math.PI / 180, c = [p.reduce((s, q) => s + q[0], 0) / 4, p.reduce((s, q) => s + q[1], 0) / 4]; return p.map(q => [c[0] + (q[0] - c[0]) * Math.cos(r) - (q[1] - c[1]) * Math.sin(r), c[1] + (q[0] - c[0]) * Math.sin(r) + (q[1] - c[1]) * Math.cos(r)]); };
const Q5_GAME = { sq: [[0, 0], [4, 0], [4, 4], [0, 4]], rect: [[0, 0], [6, 0], [6, 3], [0, 3]], rhom: [[0, 0], [5, 0], [8, 4], [3, 4]], para: [[0, 0], [6, 0], [8, 3], [2, 3]], trap: [[0, 0], [7, 0], [5, 3], [1, 3]], kite: [[0, 0], [2, -2], [0, -6], [-2, -2]], trap2: [[0, 0], [6, 0], [6, 3], [2, 3]], kite2: [[0, 0], [3, -1], [0, -5], [-3, -1]] };
const q5fig = (p, o = {}) => { const I = q5info(p); return polySVG(p, { fit: true, W: 380, H: 240, names: o.names, ticks: o.noMarks ? null : I.ticks, par: o.noMarks ? null : I.par, fill: o.fill || '#FFD27A', diags: o.diags ? [[0, 2], [1, 3]] : [], ...o.svg }); };
const q5clsQ = (key, rot) => { const p = q5rot(Q5_GAME[key], rot), k = q5info(p).kind, opts = [k, ...shuffle(Object.keys(Q5N).filter(x => x !== k && x !== 'any')).slice(0, 2)].map(x => Q5N[x]);
  return Q.c8Pick({ fig: q5fig(p), q: 'รูปนี้เป็นรูปสี่เหลี่ยมชนิดใด (ขีด = ยาวเท่ากัน · ลูกศร = ขนานกัน)', opts, right: Q5N[k], hint: Q5P[k] }); };
const Q5_TF = [['รูปสี่เหลี่ยมคางหมู เป็นรูปสี่เหลี่ยมที่มีด้านขนานกัน 2 คู่', 0, 'คางหมูมีด้านขนานกันเพียง 1 คู่'], ['รูปสี่เหลี่ยมด้านขนาน มีมุมที่อยู่ตรงข้ามกันมีขนาดเท่ากัน ด้านตรงข้ามยาวเท่ากันและขนานกัน 2 คู่', 1, 'ถูกต้อง'],
  ['รูปสี่เหลี่ยมจัตุรัส มีมุมทุกมุมเป็นมุมฉาก ด้านสองด้านยาวไม่เท่ากัน', 0, 'จัตุรัสมีด้านทุกด้านยาวเท่ากัน'], ['รูปสี่เหลี่ยมผืนผ้า มีมุมทุกมุมเป็นมุมฉาก ด้านตรงข้ามยาวเท่ากันและขนานกัน 2 คู่ ด้านที่อยู่ติดกันยาวไม่เท่ากัน', 1, 'ถูกต้อง'],
  ['รูปสี่เหลี่ยมรูปว่าว มีมุมที่อยู่ตรงข้ามกันมีขนาดเท่ากัน 2 คู่', 0, 'รูปว่าวมีมุมตรงข้ามเท่ากันเพียง 1 คู่'], ['รูปสี่เหลี่ยมขนมเปียกปูน มีมุมทุกมุมไม่เป็นมุมฉาก ด้านทุกด้านยาวเท่ากัน ด้านตรงข้ามขนานกัน 2 คู่', 1, 'ถูกต้อง'],
  // v130: เพิ่มข้อความใหม่ — เกมเดียวกันไม่ถามข้อความซ้ำ
  ['รูปสี่เหลี่ยมจัตุรัสทุกรูป เป็นรูปสี่เหลี่ยมผืนผ้า', 1, 'จัตุรัสมีมุมฉากทุกมุมและด้านตรงข้ามขนานกัน จึงเป็นผืนผ้าชนิดหนึ่ง'], ['รูปสี่เหลี่ยมผืนผ้าทุกรูป เป็นรูปสี่เหลี่ยมจัตุรัส', 0, 'ผืนผ้าที่ด้านติดกันยาวไม่เท่ากันไม่ใช่จัตุรัส'],
  ['รูปสี่เหลี่ยมขนมเปียกปูน เป็นรูปสี่เหลี่ยมด้านขนานชนิดหนึ่ง', 1, 'มีด้านตรงข้ามขนานกัน 2 คู่'], ['รูปสี่เหลี่ยมคางหมู มีด้านทุกด้านยาวเท่ากัน', 0, 'คางหมูมีด้านขนานกัน 1 คู่ ซึ่งยาวไม่เท่ากัน'],
  ['รูปสี่เหลี่ยมรูปว่าว มีด้านที่อยู่ติดกันยาวเท่ากัน 2 คู่', 1, 'เป็นสมบัติของรูปว่าว'], ['รูปสี่เหลี่ยมด้านขนาน มีมุมทุกมุมเป็นมุมฉาก', 0, 'ถ้ามุมทุกมุมเป็นมุมฉากจะเป็นผืนผ้า ด้านขนานทั่วไปไม่มีมุมฉาก'],
  ['รูปสี่เหลี่ยมจัตุรัส เป็นรูปสี่เหลี่ยมขนมเปียกปูนที่มีมุมฉาก', 1, 'ด้านเท่ากันทุกด้าน และมุมทุกมุมเป็นมุมฉาก'], ['รูปสี่เหลี่ยมรูปว่าว มีด้านขนานกัน 1 คู่', 0, 'รูปว่าวไม่มีด้านขนานกันเลย'],
  ['มุมที่อยู่ติดกันของรูปสี่เหลี่ยมด้านขนาน รวมกันได้ 180°', 1, 'เพราะด้านตรงข้ามขนานกัน'], ['รูปสี่เหลี่ยมผืนผ้า มีด้านทุกด้านยาวเท่ากัน', 0, 'ผืนผ้ามีด้านตรงข้ามยาวเท่ากัน แต่ด้านติดกันยาวไม่เท่ากัน']];
const q5tf = ([text, ok, why]) => Q.hTF({ text, ok: !!ok, why });
const q5diagQ = key => { const p = q5rot(Q5_GAME[key], pick([-15, 10, 20])), k = q5info(p).kind, opts = shuffle(Object.keys(Q5D).filter(x => x !== 'any' && x !== 'trap' && Q5D[x] !== Q5D[k])).slice(0, 2).map(x => Q5D[x]);
  return Q.c8Pick({ fig: q5fig(p, { diags: true }), q: `${Q5N[k]}นี้ เส้นทแยงมุมมีสมบัติอย่างไร`, opts: [Q5D[k], ...opts], right: Q5D[k] }); };
/* parallelogram figures: b (base), h, off, labels {b, h, s} */
const q5para = (b, hh, off, lab, o = {}) => polySVG([[0, 0], [b, 0], [b + off, hh], [off, hh]], { fit: true, W: 400, H: 240, fill: o.fill || '#9BE3E0', names: o.names, ticks: o.rhom ? [1, 1, 1, 1] : null, sides: [lab.b, lab.s || null, null, null],
  segs: [{ a: [off + (o.hx || 0), hh], b: [off + (o.hx || 0), 0], label: lab.h, off: 16, col: '#E5487A' }], rms: [[[off + (o.hx || 0), hh], [off + (o.hx || 0), 0], [b, 0]]], rightMarks: false });
const Q5W_PARA = [
  { fig: q5para(6, 2.5, 1.5, { b: '6 ซม.', h: '2.5 ซม.', s: '2.9 ซม.' }, { names: ['D', 'C', 'B', 'A'] }), a: '15', unit: 'ตร.ซม.', hint: '6 × 2.5 (ด้านเอียง 2.9 ซม. ไม่ใช้)' },
  { fig: q5para(7.5, 3.4, 1.6, { b: '7.5 ม.', h: '3.4 ม.' }), a: '25.5', unit: 'ตร.ม.', hint: '7.5 × 3.4' },
  { fig: q5para(5, 7, 3, { b: '5 ซม.', h: '7 ซม.', s: '7.6 ซม.' }, { names: ['U', 'V', 'T', 'S'] }), a: '35', unit: 'ตร.ซม.', hint: 'ฐาน 5 สูง 7 → 5 × 7' },
  { fig: q5para(7.2, 2.5, 2.4, { b: '7.2 ม.', h: '2.5 ม.', s: '3.5 ม.' }), a: '18', unit: 'ตร.ม.', hint: '7.2 × 2.5' },
  { fig: q5para(4.5, 2.6, 1.3, { b: '4.5 ซม.', h: '2.6 ซม.' }), a: '11.7', unit: 'ตร.ซม.', hint: '4.5 × 2.6' },
  { fig: q5para(3.6, 4.2, 1.1, { b: '3.6 วา', h: '4.2 วา' }), a: '15.12', unit: 'ตร.วา', hint: '3.6 × 4.2' },
  { fig: q5para(3.5, 1.8, 0.9, { b: '3.5 ม.', h: '1.8 ม.' }), a: '6.3', unit: 'ตร.ม.', hint: '3.5 × 1.8' },
  { fig: q5para(5.8, 3.5, 2, { b: '5.8 วา', h: '3.5 วา' }), a: '20.3', unit: 'ตร.วา', hint: '5.8 × 3.5' },
  { fig: q5para(4.5, 1.6, 1.4, { b: '4.5 ซม.', h: '1.6 ซม.' }), a: '7.2', unit: 'ตร.ซม.', hint: '4.5 × 1.6' },
  { fig: q5para(2.4, 3.5, 0.9, { b: '2.4 ม.', h: '3.5 ม.' }), a: '8.4', unit: 'ตร.ม.', hint: '2.4 × 3.5' }];
const q5rh = (s, hh) => { const off = Math.sqrt(s * s - hh * hh); return { off, fig: (lab, names) => q5para(s, hh, off, lab, { rhom: 1, fill: '#F9A8D4', names }) }; };
const Q5W_RHOM = [
  [5.5, 4.2, 'ซม.'], [4.8, 3.5, 'ม.'], [6.5, 4.4, 'ซม.'], [8.5, 7.2, 'ม.'], [3.6, 2.5, 'ซม.'], [3.2, 2.8, 'วา'], [3.5, 2.1, 'วา'], [7.5, 5.4, 'ซม.'], [7.2, 3.5, 'ม.'], [6.8, 5.5, 'ม.']].map(([s, hh, u]) => ({ fig: q5rh(s, hh).fig({ b: `${s} ${u}`, h: `${hh} ${u}` }), a: String(Math.round(s * hh * 10000) / 10000), unit: 'ตร.' + u, hint: `${s} × ${hh}` }));
const q5trap = (a, b, hh, off, u) => polySVG([[0, 0], [b, 0], [off + a, hh], [off, hh]], { fit: true, W: 400, H: 240, fill: '#FFD27A', par: { 0: 1, 2: 1 }, sides: [`${b} ${u}`, null, `${a} ${u}`, null], segs: [{ a: [off + a * .4, hh], b: [off + a * .4, 0], label: `สูง ${hh} ${u}`, off: 16, col: '#E5487A' }], rms: [[[off + a * .4, hh], [off + a * .4, 0], [b, 0]]], rightMarks: false });
const Q5W_TRAP = [[3, 8, 4, 2, 'ซม.'], [6, 10, 3, 2, 'ม.'], [3.5, 7.5, 4, 1.5, 'ซม.'], [5, 11, 6, 3, 'ม.']].map(([a, b, hh, off, u]) => ({ fig: q5trap(a, b, hh, off, u), a: String((a + b) * hh / 2), unit: 'ตร.' + u, hint: `½ × (${a} + ${b}) × ${hh}` }));
const Q5W_COMP = [
  { fig: polySVG([[0, 0], [8, 0], [8, 3], [11, 6], [3, 6], [0, 3]], { fit: true, W: 400, H: 240, fill: '#9BE3E0', sides: ['8 ม.', '3 ม.', null, '8 ม.', null, '3 ม.'], segs: [{ a: [0, 3], b: [8, 3], col: '#9790B0', w: 1.6 }, { a: [3, 6], b: [3, 3], label: '3 ม.', off: -16, col: '#E5487A' }] }), a: '48', unit: 'ตร.ม.', hint: 'ผืนผ้า 8 × 3 + ด้านขนาน 8 × 3' },
  { fig: polySVG([[0, 0], [10, 0], [10, 6], [0, 6]], { fit: true, W: 400, H: 240, fill: '#7EDDB8', sides: ['10 ม.', '6 ม.', null, null], over: [{ pts: [[2, 2], [6, 2], [8, 4], [4, 4]], fill: '#FFFFFF' }], texts: [[[5, 1.4], 'บ่อ: ฐาน 4 สูง 2']] }), q: 'หาพื้นที่ส่วนที่ระบายสี (ไม่รวมบ่อรูปสี่เหลี่ยมด้านขนาน)', a: '52', unit: 'ตร.ม.', hint: '10 × 6 − 4 × 2' },
  { fig: polySVG([[0, 0], [12, 0], [9, 4], [3, 4]], { fit: true, W: 400, H: 240, fill: '#C4B5FD', sides: ['12 ซม.', null, '6 ซม.', null], segs: [{ a: [3, 4], b: [3, 0], col: '#9790B0', w: 1.6 }, { a: [9, 4], b: [9, 0], label: 'สูง 4 ซม.', off: -18, col: '#E5487A' }] }), a: '36', unit: 'ตร.ซม.', hint: 'คางหมู ½ × (12 + 6) × 4 หรือ ผืนผ้า 6 × 4 + สามเหลี่ยม 2 รูป' },
  { fig: polySVG([[0, 0], [5, 0], [5, 2], [9, 2], [9, 6], [0, 6]], { fit: true, W: 400, H: 240, fill: '#FFB38A', sides: ['5 ซม.', '2 ซม.', '4 ซม.', '4 ซม.', '9 ซม.', '6 ซม.'] }), a: '46', unit: 'ตร.ซม.', hint: '9 × 6 − 4 × 2' }];
const Q5S = [ // โจทย์ปัญหา
  D6S('ลุงล้อมรั้วรอบแปลงผักรูปสี่เหลี่ยมจัตุรัสที่มีความยาวรอบรูป 62 เมตร แปลงผักยาวด้านละกี่เมตร', '62 ÷ 4', ['62 × 4', '62 ÷ 2'], 'เมตร'),
  D6S('ลานกีฬารูปสี่เหลี่ยมมุมฉากยาวรอบรูป 590 เมตร กว้าง 100 เมตร ลานกีฬานี้ยาวกี่เมตร', '590 ÷ 2 − 100', ['590 − 100', '590 ÷ 4'], 'เมตร'),
  D6S('เฟื่องฟ้าจะผูกเชือกรอบรูปสี่เหลี่ยมผืนผ้ายาว 10.5 เมตร และ 28 เมตร เชือกราคาเมตรละ 7.2 บาท เฟื่องฟ้าเสียเงินซื้อเชือกกี่บาท', '(10.5 + 28) × 2 × 7.2', ['(10.5 + 28) × 7.2', '10.5 × 28 × 7.2'], 'บาท'),
  D6S('แปลงดอกไม้รูปสี่เหลี่ยมขนมเปียกปูนยาวด้านละ 6.5 เมตร (650 ซม.) ปักหลักไม้รอบแปลงทุก ๆ 50 เซนติเมตร ปักได้กี่หลัก', '650 × 4 ÷ 50', ['650 ÷ 50', '650 × 4 × 50'], 'หลัก'),
  D6S('ผ้าเช็ดหน้ารูปสี่เหลี่ยมผืนผ้ากว้าง 30 เซนติเมตร ยาว 90 เซนติเมตร มีพื้นที่กี่ตารางเซนติเมตร', '30 × 90', ['(30 + 90) × 2', '30 + 90'], 'ตารางเซนติเมตร'),
  D6S('แผ่นยางรูปสี่เหลี่ยมขนมเปียกปูนยาวด้านละ 3 เมตร ด้านคู่ขนานห่างกัน 2 เมตร มีพื้นที่กี่ตารางเมตร', '3 × 2', ['3 × 4', '3 × 3'], 'ตารางเมตร'),
  D6S('กระเบื้องรูปสี่เหลี่ยมด้านขนาน ฐาน 30 ซม. สูง 8 ซม. ปูห้องขนาด 400 × 600 ซม. แผ่นละ 8.5 บาท ต้องจ่ายอย่างน้อยกี่บาท', '400 × 600 ÷ (30 × 8) × 8.5', ['400 × 600 ÷ 30 × 8.5', '(400 + 600) ÷ (30 × 8) × 8.5'], 'บาท'),
  D6S('ป้ายรูปสี่เหลี่ยมขนมเปียกปูนยาวรอบรูป 102 เซนติเมตร ระยะห่างระหว่างด้านคู่ขนานเท่ากับ 20 เซนติเมตร ป้ายมีพื้นที่กี่ตารางเซนติเมตร', '102 ÷ 4 × 20', ['102 × 20', '102 ÷ 2 × 20'], 'ตารางเซนติเมตร'),
  D6S('แผ่นไม้รูปสี่เหลี่ยมด้านขนาน ด้านหนึ่งยาว 20 ซม. ยาวรอบรูป 110 ซม. ระยะห่างระหว่างด้านยาวคู่ขนานคือ 16 ซม. มีพื้นที่กี่ตารางเซนติเมตร', '(110 ÷ 2 − 20) × 16', ['20 × 16', '110 ÷ 4 × 16'], 'ตารางเซนติเมตร'),
  D6S('แผ่นกระเบื้องสี่เหลี่ยมจัตุรัสยาวด้านละ 25 เซนติเมตร ปูพื้นระเบียงได้ 90 แผ่นพอดี ระเบียงนี้มีพื้นที่กี่ตารางเซนติเมตร', '25 × 25 × 90', ['25 × 4 × 90', '25 × 90'], 'ตารางเซนติเมตร'),
  D6S('สนามหน้าบ้านรูปสี่เหลี่ยมผืนผ้ามีพื้นที่ 65 ตารางเมตร ยาว 13 เมตร สนามกว้างกี่เมตร', '65 ÷ 13', ['65 − 13', '65 ÷ 2 − 13'], 'เมตร'),
  D6S('สวนผักรูปสี่เหลี่ยมผืนผ้ากว้าง 30 วา ยาวรอบรูป 170 วา สวนนี้มีพื้นที่กี่ตารางวา', '(170 ÷ 2 − 30) × 30', ['170 × 30', '(170 − 30) × 30'], 'ตารางวา'),
  D6S('แปลงหญ้ารูปตัว L ประกอบด้วยสี่เหลี่ยมผืนผ้า 10 × 6 เมตร และ 7 × 2 เมตร ค่าปูหญ้าตารางเมตรละ 55 บาท ต้องจ่ายกี่บาท', '(10 × 6 + 7 × 2) × 55', ['10 × 6 × 55', '(10 + 6 + 7 + 2) × 55'], 'บาท'),
  D6S('สวนรูปสี่เหลี่ยมคางหมู ด้านคู่ขนานยาว 12 ม. และ 18 ม. สูง 10 ม. ปลูกผักตารางเมตรละ 3 ต้น ปลูกได้กี่ต้น', '1/2 × (12 + 18) × 10 × 3', ['(12 + 18) × 10 × 3', '12 × 18 × 3'], 'ต้น'),
  D6S('ผนังรูปสี่เหลี่ยมผืนผ้ากว้าง 6 เมตร สูง 3 เมตร มีหน้าต่างรูปสี่เหลี่ยมด้านขนานฐาน 2 เมตร สูง 1.5 เมตร ทาสีผนังส่วนที่เหลือกี่ตารางเมตร', '6 × 3 − 2 × 1.5', ['6 × 3', '6 × 3 + 2 × 1.5'], 'ตารางเมตร'),
  D6S('ลานรูปสี่เหลี่ยมจัตุรัสยาวด้านละ 25 เมตร ค่ารั้วเมตรละ 120 บาท ค่าปูหญ้าตารางเมตรละ 30 บาท ต้องจ่ายรวมกี่บาท', '25 × 4 × 120 + 25 × 25 × 30', ['25 × 4 × 120', '25 × 25 × 120 + 25 × 4 × 30'], 'บาท'),
  D6S('ผนังห้องสูง 2.8 เมตร ยาว 6 เมตร ต้องการทาสีผนังทั้ง 2 ด้าน ต้องทาสีกี่ตารางเมตร', '2.8 × 6 × 2', ['2.8 × 6', '(2.8 + 6) × 2'], 'ตารางเมตร'),
  D6S('ลานประกอบด้วยผืนผ้า 10 × 6 ม. และด้านขนานฐาน 10 ม. สูง 4 ม. ปูกระเบื้องตารางเมตรละ 250 บาท ต้องจ่ายกี่บาท', '(10 × 6 + 10 × 4) × 250', ['10 × 6 × 250', '(10 × 6 + 1/2 × 10 × 4) × 250'], 'บาท')];
const q5num = (o, q = 'หาพื้นที่ของรูป') => Q.t6Num({ fig: o.fig, q: o.q || q, a: o.a, unit: o.unit, hint: o.hint });

/* =========================================================
   LEVELS 631–650
   ========================================================= */
const L5Q = (no, place, title, short, goal, teach, game) => ({ id: 630 + no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game });
/* ---------- v127 (ผู้ใช้ขอ: เกมสร้างรูปต้อง “สร้างจริง”) — กระดานสร้างรูปเรขาคณิต: ไม้บรรทัด · ไม้โปรแทรกเตอร์ · วงเวียน ----------
   ทำทีละขั้นเหมือนในหนังสือ: ลากเส้นตามความยาว (ไม้บรรทัดเลื่อนตาม) → วัดมุม (ไม้โปรแทรกเตอร์วางที่จุดยอด) → กางวงเวียนตามรัศมี แล้วหมุนเขียนส่วนโค้ง
   → แตะจุดที่ส่วนโค้งตัดกัน → ลากเส้นเชื่อม · ผิด 3 ครั้งในขั้นเดียว → ทำให้ดู · ข้อมูลหน่วยเป็น ซม. (แกน y ชี้ขึ้น)
   ขั้น: seg (a→b ยาว len ทิศ dir°) · ang (มุมที่ at วัดจาก from ไป deg° ทวนเข็ม · line = ลากเส้นยาวทั้งสองข้าง) · arc (วงเวียนจุดศูนย์กลาง c รัศมี r ให้ผ่านจุด tgt) · tap (แตะจุดตัด) · mark (ทำเครื่องหมายบนส่วนของเส้นตรง) · join (ลากเส้นเชื่อมจุด) */
const CNS_K = 44, cnsDir = d => [Math.cos(d * Math.PI / 180), Math.sin(d * Math.PI / 180)], cnsAng = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
const cnsAdd = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k], cnsDist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]), cnsF = x => (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, '');
function cnsBoard(T, onDone) { // T: { pts, steps, poly, kind, fit }
  const W = 640, H = 420, K = CNS_K; let ox = 1, oy = 1;
  { const all = Object.values(T.fit || T.pts), xs = all.map(p => p[0]), ys = all.map(p => p[1]); ox = (W / K - (Math.max(...xs) - Math.min(...xs))) / 2 - Math.min(...xs); oy = (H / K - (Math.max(...ys) - Math.min(...ys))) / 2 - Math.min(...ys); }
  const X = p => [(p[0] + ox) * K, H - (p[1] + oy) * K], U = (x, y) => [x / K - ox, (H - y) / K - oy];
  const P = Object.fromEntries(Object.entries(T.pts).map(([k, v]) => [k, v.slice()])), DIR = {}, segs = [], rays = [], arcs = []; let k = 0, st = null, miss = 0, drag = false, done = false;
  const svgBox = h('div', { class: 'cns-board ia' }), head = h('div', { class: 'cns-head' }), msg = h('div', { class: 'cns-msg' }), tool = h('div', { class: 'cns-tool' });
  const val = v => typeof v === 'function' ? v(P, DIR) : v;
  const TOOLN = { seg: ['ruler', 'ไม้บรรทัด'], ang: ['prot', 'ไม้โปรแทรกเตอร์'], arc: ['compass', 'วงเวียน'], tap: ['tap', 'แตะจุด'], mark: ['ruler', 'ไม้บรรทัด'], join: ['ruler', 'ไม้บรรทัด'] };
  const begin = () => { if (k >= T.steps.length) { finish(); return; } const s = T.steps[k]; miss = 0;
    st = { s, len: .5, ang: 20, r: 1, ph: 0, sw: null, phi: 0, pi: 0, end: null };
    if (s.t === 'arc') st.phi = cnsAng(P[s.c], val(s.tgt)) - 40; if (s.t === 'join') { st.pi = 0; } if (s.t === 'mark') st.len = .5;
    head.innerHTML = `<b>ขั้นที่ ${k + 1}/${T.steps.length}</b> ${s.say}`; tool.innerHTML = `<span class="cns-ti ${TOOLN[s.t][0]}"></span>${TOOLN[s.t][1]}`; msg.innerHTML = s.t === 'arc' ? 'ลากปลายดินสอของวงเวียน (จุดสีม่วง) ให้กางออกตามรัศมี' : s.t === 'ang' ? 'ลากจุดสีม่วงบนขอบไม้โปรแทรกเตอร์ไปที่มุมที่ต้องการ' : s.t === 'tap' ? 'แตะตรงจุดที่ส่วนโค้งตัดกัน' : 'ลากจุดสีม่วง'; draw(); };
  const fail = t => { miss++; sfx.no(); msg.innerHTML = t + (miss >= 3 ? '' : miss === 2 ? ' — ลองอีกครั้ง (ครั้งหน้าครูจะทำให้ดู)' : ''); svgBox.classList.remove('shake'); void svgBox.offsetWidth; svgBox.classList.add('shake'); if (miss >= 3) { auto(); msg.innerHTML = 'ดูนะ ทำแบบนี้ 👀'; } };
  const good = () => { sfx.pop(k + 2); k++; begin(); };
  const apply = () => { const s = st.s; // ทำขั้นให้เสร็จด้วยค่าที่ถูกต้อง
    if (s.t === 'seg') { const d = val(s.dir); P[s.b] = cnsAdd(P[s.a], cnsDir(d), s.len); segs.push([s.a, s.b]); DIR[s.b] = d; }
    else if (s.t === 'ang') { const d = cnsAng(P[s.at], P[s.from]) + s.deg; DIR[s.key || s.at] = d; rays.push({ at: s.at, d, line: s.line }); }
    else if (s.t === 'arc') { const a = cnsAng(P[s.c], val(s.tgt)); arcs.push({ c: s.c, r: s.r, a0: a - 22, a1: a + 22 }); }
    else if (s.t === 'tap') P[s.name] = val(s.at);
    else if (s.t === 'mark') P[s.name] = cnsAdd(P[s.on[0]], cnsDir(cnsAng(P[s.on[0]], P[s.on[1]])), s.d);
    else if (s.t === 'join') s.pairs.slice(st.pi).forEach(pr => segs.push(pr)); };
  const auto = () => { apply(); draw(); setTimeout(() => { k++; begin(); }, 900); };
  const finish = () => { done = true; st = null; head.innerHTML = `<b>สร้างเสร็จแล้ว!</b> ได้${T.name}`; tool.innerHTML = ''; msg.innerHTML = T.check ? T.check(P) : ''; draw(); sfx.ok(); onDone && onDone(); try { teachDone(box); } catch (_) { } };
  /* ---------- drawing ---------- */
  const ruler = (a, d, L) => { const u = cnsDir(d), n = [-u[1], u[0]], q = (t, o) => X(cnsAdd(cnsAdd(a, u, t), n, o)), len = Math.max(L + 1.2, 4); let s = `<g class="cns-ruler"><path d="M${q(-.4, -.08)} L${q(len, -.08)} L${q(len, -.75)} L${q(-.4, -.75)} Z" fill="#FFE9A8" fill-opacity=".85" stroke="#C98612" stroke-width="1.5"/>`;
    for (let t = 0; t <= len; t += .5) s += `<path d="M${q(t, -.08)} L${q(t, t % 1 ? -.28 : -.4)}" stroke="#8A5A1E" stroke-width="1.3"/>` + (t % 1 ? '' : `<text x="${q(t, -.58)[0]}" y="${q(t, -.58)[1] + 4}" text-anchor="middle" class="cns-rt">${t}</text>`);
    return s + '</g>'; };
  const prot = (c, base, cur) => { const R = 2.6, q = (deg, r) => X(cnsAdd(P[c], cnsDir(base + deg), r)); let s = `<g class="cns-prot"><path d="M${q(0, R)} A${R * K} ${R * K} 0 0 0 ${q(180, R)} Z" fill="#CFE6FF" fill-opacity=".55" stroke="#3D8BD9" stroke-width="1.6"/>`;
    for (let a = 0; a <= 180; a += 10) s += `<path d="M${q(a, R)} L${q(a, R - (a % 30 ? .18 : .32))}" stroke="#2B6FB8" stroke-width="1.2"/>` + (a % 30 ? '' : `<text x="${q(a, R - .55)[0]}" y="${q(a, R - .55)[1] + 4}" text-anchor="middle" class="cns-pt">${a}</text>`);
    return s + `<path d="M${X(P[c])} L${q(cur, R + .6)}" stroke="#E5487A" stroke-width="2.2"/></g>`; };
  const compass = (c, r, phi) => { const C = X(P[c]), Pn = X(cnsAdd(P[c], cnsDir(phi), r)), M = [(C[0] + Pn[0]) / 2, (C[1] + Pn[1]) / 2], L = Math.hypot(Pn[0] - C[0], Pn[1] - C[1]) || 1, n = [-(Pn[1] - C[1]) / L, (Pn[0] - C[0]) / L], up = n[1] < 0 ? n : [-n[0], -n[1]], hh = Math.max(30, 80 - L * .15), Hn = [M[0] + up[0] * hh, M[1] + up[1] * hh];
    return `<g class="cns-comp"><path d="M${C} L${Hn} L${Pn}" fill="none" stroke="#5B5F7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${Hn[0]}" cy="${Hn[1]}" r="7" fill="#7E6ED6"/><path d="M${Hn} l${up[0] * 14} ${up[1] * 14}" stroke="#7E6ED6" stroke-width="5" stroke-linecap="round"/><circle cx="${C[0]}" cy="${C[1]}" r="3" fill="#2B2550"/><circle cx="${Pn[0]}" cy="${Pn[1]}" r="4" fill="#E5487A"/></g>`; };
  const arcPath = (c, r, a0, a1) => { const A = X(cnsAdd(P[c], cnsDir(a0), r)), B = X(cnsAdd(P[c], cnsDir(a1), r)); return `<path d="M${A} A${r * K} ${r * K} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${B}" fill="none" stroke="#7E6ED6" stroke-width="2.2"/>`; };
  const hd = p => `<circle class="cns-h" cx="${p[0]}" cy="${p[1]}" r="13" fill="#7E6ED6" fill-opacity=".9" stroke="#fff" stroke-width="3"/>`;
  const draw = () => { let s = `<svg viewBox="0 0 ${W} ${H}" class="cns-svg" aria-hidden="true">`;
    for (let x = 0; x <= W; x += K / 2) for (let y = H % (K / 2); y <= H; y += K / 2) s += `<circle cx="${x}" cy="${y}" r="${(x / (K / 2)) % 2 || ((H - y) / (K / 2)) % 2 ? .9 : 1.6}" fill="#D9D3EE"/>`;
    if (done && T.poly) s += `<path d="M${T.poly.map(n => X(P[n])).join(' L')} Z" fill="#FFD27A" fill-opacity=".6" stroke="none"/>`;
    rays.forEach(r => { const a = r.line ? cnsAdd(P[r.at], cnsDir(r.d), -5) : P[r.at], b = cnsAdd(P[r.at], cnsDir(r.d), 5.5); s += `<path d="M${X(a)} L${X(b)}" stroke="#9A93C4" stroke-width="1.6" stroke-dasharray="6 5"/>`; });
    arcs.forEach(a => { s += arcPath(a.c, a.r, a.a0, a.a1); });
    segs.forEach(([a, b]) => { s += `<path d="M${X(P[a])} L${X(P[b])}" stroke="#2B2550" stroke-width="3" stroke-linecap="round"/>`; });
    if (st) { const s0 = st.s;
      if (s0.t === 'seg') { const d = val(s0.dir), E = cnsAdd(P[s0.a], cnsDir(d), st.len); s += ruler(P[s0.a], d, s0.len) + `<path d="M${X(P[s0.a])} L${X(E)}" stroke="#E5487A" stroke-width="3" stroke-linecap="round"/>` + hd(X(E)) + `<text x="${X(E)[0] + 14}" y="${X(E)[1] - 16}" class="cns-read">${cnsF(st.len)} ซม.</text>`; }
      if (s0.t === 'mark') { const a = P[s0.on[0]], d = cnsAng(a, P[s0.on[1]]), E = cnsAdd(a, cnsDir(d), st.len); s += ruler(a, d, cnsDist(a, P[s0.on[1]])) + hd(X(E)) + `<text x="${X(E)[0] + 12}" y="${X(E)[1] - 18}" class="cns-read">${s0.on[0]}${s0.name} = ${cnsF(st.len)} ซม.</text>`; }
      if (s0.t === 'ang') { const base = cnsAng(P[s0.at], P[s0.from]), E = X(cnsAdd(P[s0.at], cnsDir(base + st.ang), 2.6)); s += prot(s0.at, base, st.ang) + hd(E) + `<text x="${E[0] + 14}" y="${E[1] - 14}" class="cns-read">${Math.round(st.ang)}°</text>`; }
      if (s0.t === 'arc') { if (st.ph === 1 && st.sw) s += arcPath(s0.c, s0.r, st.sw[0], st.sw[1]); const r = st.ph ? s0.r : st.r; s += compass(s0.c, r, st.phi) + hd(X(cnsAdd(P[s0.c], cnsDir(st.phi), r))) + (st.ph ? '' : `<text x="${X(P[s0.c])[0] - 20}" y="${X(P[s0.c])[1] + 30}" class="cns-read">รัศมี ${cnsF(st.r)} ซม.</text>`); }
      if (s0.t === 'join') { const pr = s0.pairs[st.pi], a = P[pr[0]], E = st.end || a; s += `<path d="M${X(a)} L${X(E)}" stroke="#E5487A" stroke-width="3" stroke-dasharray="${st.end ? 0 : 4}"/>` + hd(X(E)); } }
    Object.entries(P).forEach(([n, p]) => { if (n.startsWith('_')) return; const q = X(p); s += `<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="#E5487A"/><text x="${q[0] - 14}" y="${q[1] - 10}" class="cns-n">${n}</text>`; });
    svgBox.innerHTML = s + '</svg>'; };
  /* ---------- pointer ---------- */
  const at = e => { const sv = svgBox.querySelector('svg'), m = sv.getScreenCTM().inverse(), q = sv.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m); return U(r.x, r.y); };
  svgBox.addEventListener('pointerdown', e => { if (!st || done) return; e.preventDefault(); e.stopPropagation(); const p = at(e), s = st.s;
    if (s.t === 'tap') { const T0 = val(s.at); if (cnsDist(p, T0) < .45) { P[s.name] = T0; draw(); good(); } else fail('ยังไม่ใช่ — แตะตรงจุดที่ส่วนโค้ง 2 เส้นตัดกัน'); return; }
    drag = true; try { svgBox.setPointerCapture(e.pointerId); } catch (_) { } move(p); });
  const move = p => { const s = st.s;
    if (s.t === 'seg' || s.t === 'mark') { const a = s.t === 'seg' ? P[s.a] : P[s.on[0]], d = s.t === 'seg' ? val(s.dir) : cnsAng(a, P[s.on[1]]), u = cnsDir(d), L = (p[0] - a[0]) * u[0] + (p[1] - a[1]) * u[1]; st.len = Math.max(.3, Math.min(s.t === 'mark' ? cnsDist(a, P[s.on[1]]) : 12, Math.round(L * 10) / 10)); }
    else if (s.t === 'ang') { const base = cnsAng(P[s.at], P[s.from]); let a = cnsAng(P[s.at], p) - base; a = ((a % 360) + 360) % 360; if (a > 270) a = 0; st.ang = Math.max(0, Math.min(180, Math.round(a))); }
    else if (s.t === 'arc') { const c = P[s.c], phi = cnsAng(c, p); if (st.ph === 0) { st.r = Math.max(.5, Math.round(cnsDist(c, p) * 10) / 10); st.phi = phi; } else { let d = phi - st.phi; d = ((d + 540) % 360) - 180; st.phi += d; st.sw = st.sw ? [Math.min(st.sw[0], st.phi), Math.max(st.sw[1], st.phi)] : [st.phi, st.phi]; } }
    else if (s.t === 'join') { const pr = s.pairs[st.pi], tg = P[pr[1]]; st.end = cnsDist(p, tg) < .45 ? tg : p; }
    draw(); };
  svgBox.addEventListener('pointermove', e => { if (!drag || !st) return; move(at(e)); });
  const up = () => { if (!drag || !st) return; drag = false; const s = st.s;
    if (s.t === 'seg') { if (Math.abs(st.len - s.len) <= .15) { apply(); good(); } else fail(`ยาว ${cnsF(st.len)} ซม. — ต้องยาว <b>${cnsF(s.len)} ซม.</b>`); }
    else if (s.t === 'mark') { if (Math.abs(st.len - s.d) <= .15) { apply(); good(); } else fail(`${s.on[0]}${s.name} ยาว ${cnsF(st.len)} ซม. — ต้องยาว <b>${cnsF(s.d)} ซม.</b>`); }
    else if (s.t === 'ang') { if (Math.abs(st.ang - s.deg) <= 1) { apply(); good(); } else fail(`ได้ ${Math.round(st.ang)}° — ต้องการ <b>${s.deg}°</b> (เริ่มนับ 0 จากด้าน ${s.at}${s.from})`); }
    else if (s.t === 'arc') { if (st.ph === 0) { if (Math.abs(st.r - s.r) <= .15) { st.ph = 1; st.sw = null; sfx.pop(3); msg.innerHTML = `กางวงเวียน ${cnsF(s.r)} ซม. แล้ว — <b>ลากดินสอหมุนรอบจุด ${s.c}</b> เขียนส่วนโค้ง`; draw(); } else fail(`กางได้ ${cnsF(st.r)} ซม. — ต้องกาง <b>${cnsF(s.r)} ซม.</b>`); }
      else { const a = cnsAng(P[s.c], val(s.tgt)), n = x => { let d = x - a; d = ((d + 540) % 360) - 180; return d; }; const lo = n(st.sw[0]), hi = lo + (st.sw[1] - st.sw[0]);
        if (st.sw && lo <= -6 && hi >= 6) { arcs.push({ c: s.c, r: s.r, a0: st.sw[0], a1: st.sw[1] }); good(); } else if (st.sw && st.sw[1] - st.sw[0] > 3) { st.sw = null; fail('ส่วนโค้งยังไม่ผ่านบริเวณที่จะเกิดจุดใหม่ — ลองหมุนดินสอให้ผ่าน' + (s.hint ? ` (${s.hint})` : '')); } } }
    else if (s.t === 'join') { const pr = s.pairs[st.pi]; if (st.end && cnsDist(st.end, P[pr[1]]) < .01) { segs.push(pr); st.pi++; st.end = null; sfx.pop(st.pi); if (st.pi >= s.pairs.length) good(); else { const n2 = s.pairs[st.pi]; msg.innerHTML = `ต่อไปลาก ${n2[0]} → ${n2[1]}`; draw(); } } else { st.end = null; draw(); fail(`ลากจาก ${pr[0]} ไปให้ถึงจุด ${pr[1]}`); } } };
  svgBox.addEventListener('pointerup', up); svgBox.addEventListener('pointercancel', up); svgBox.addEventListener('click', e => e.stopPropagation());
  const box = h('div', { class: 'cns rvl' }, h('div', { class: 'cns-side' }, head, tool, msg), svgBox);
  box._t = { st: () => st, P, X, val, done: () => done }; // ใช้ทดสอบอัตโนมัติ
  box.reveal = () => { while (!done && st) { apply(); k++; if (k >= T.steps.length) { finish(); break; } begin(); } };
  begin(); return box;
}
/* ---------- ชุดงานสร้าง ---------- */
function cnsPara(a, b, th, name) { const C = cnsAdd([a, 0], cnsDir(th), b);
  return { name, poly: ['A', 'B', 'C', 'D'], pts: { A: [0, 0] }, fit: { A: [0, 0], B: [a, 0], C, D: cnsDir(th).map(x => x * b) },
    steps: [{ t: 'seg', a: 'A', b: 'B', len: a, dir: 0, say: `ลาก <b>AB ยาว ${cnsF(a)} ซม.</b>` }, { t: 'ang', at: 'A', from: 'B', to: 'D', deg: th, key: 'A', say: `ที่จุด A วัด<b>มุม ${th}°</b>` },
      { t: 'seg', a: 'A', b: 'D', len: b, dir: (P, D) => D.A, say: `ลาก <b>AD ยาว ${cnsF(b)} ซม.</b> ตามแนวมุม` },
      { t: 'arc', c: 'B', r: b, tgt: P => cnsAdd(P.B, cnsAdd(P.D, P.A, -1)), say: `กางวงเวียน<b>ยาวเท่า AD (${cnsF(b)} ซม.)</b> จุดที่ B เขียนส่วนโค้ง`, hint: 'เหนือจุด B' },
      { t: 'arc', c: 'D', r: a, tgt: P => cnsAdd(P.B, cnsAdd(P.D, P.A, -1)), say: `กางวงเวียน<b>ยาวเท่า AB (${cnsF(a)} ซม.)</b> จุดที่ D เขียนส่วนโค้ง`, hint: 'ทางขวาของจุด D' },
      { t: 'tap', name: 'C', at: P => cnsAdd(P.B, cnsAdd(P.D, P.A, -1)), say: 'แตะ<b>จุดที่ส่วนโค้งตัดกัน</b> ตั้งชื่อว่า C' },
      { t: 'join', pairs: [['B', 'C'], ['D', 'C']], say: 'ลากเส้น <b>BC</b> และ <b>DC</b>' }] }; }
function cnsKite(s, L, th) { const B = [s, 0], D = cnsDir(th).map(x => x * s), M = [(B[0] + D[0]) / 2, (B[1] + D[1]) / 2], half = cnsDist(B, D) / 2, hgt = Math.sqrt(L * L - half * half), u = cnsDir(th / 2), C = cnsAdd(M, u, hgt);
  return { name: 'รูปสี่เหลี่ยมรูปว่าว', poly: ['A', 'B', 'C', 'D'], pts: { A: [0, 0] }, fit: { A: [0, 0], B, C, D },
    steps: [{ t: 'seg', a: 'A', b: 'B', len: s, dir: 0, say: `ลากด้านสั้น <b>AB ยาว ${cnsF(s)} ซม.</b>` }, { t: 'ang', at: 'A', from: 'B', to: 'D', deg: th, key: 'A', say: `ที่จุด A วัด<b>มุมยอด ${th}°</b>` },
      { t: 'seg', a: 'A', b: 'D', len: s, dir: (P, Dd) => Dd.A, say: `ลาก <b>AD ยาว ${cnsF(s)} ซม.</b> (เท่ากับ AB)` },
      { t: 'arc', c: 'B', r: L, tgt: () => C, say: `กางวงเวียน<b>ยาวเท่าด้านยาว ${cnsF(L)} ซม.</b> จุดที่ B เขียนส่วนโค้ง` }, { t: 'arc', c: 'D', r: L, tgt: () => C, say: `กางวงเวียน <b>${cnsF(L)} ซม.</b> เท่าเดิม จุดที่ D เขียนส่วนโค้ง` },
      { t: 'tap', name: 'C', at: () => C, say: 'แตะ<b>จุดที่ส่วนโค้งตัดกัน</b> ตั้งชื่อว่า C' }, { t: 'join', pairs: [['B', 'C'], ['D', 'C']], say: 'ลากเส้น <b>BC</b> และ <b>DC</b>' }] }; }
function cnsTrap(b, th, sd, tp) { const D = cnsDir(th).map(x => x * sd), C = [D[0] + tp, D[1]];
  return { name: 'รูปสี่เหลี่ยมคางหมู', poly: ['A', 'B', 'C', 'D'], pts: { A: [0, 0] }, fit: { A: [0, 0], B: [b, 0], C, D },
    steps: [{ t: 'seg', a: 'A', b: 'B', len: b, dir: 0, say: `ลากฐาน <b>AB ยาว ${cnsF(b)} ซม.</b>` }, { t: 'ang', at: 'A', from: 'B', to: 'D', deg: th, key: 'A', say: `ที่จุด A วัด<b>มุม ${th}°</b>` },
      { t: 'seg', a: 'A', b: 'D', len: sd, dir: (P, Dd) => Dd.A, say: `ลาก <b>AD ยาว ${cnsF(sd)} ซม.</b>` },
      { t: 'seg', a: 'D', b: 'C', len: tp, dir: 0, say: `ลากเส้นจาก D <b>ขนานกับ AB</b> ยาว <b>${cnsF(tp)} ซม.</b> (ไม้บรรทัดวางขนานฐาน)` }, { t: 'join', pairs: [['B', 'C']], say: 'ลากเส้น <b>BC</b>' }] }; }
function cnsDiag(d1, d2, th, t, name) { // AC แนวนอน · O ห่างจาก A = t · เส้น BD ทำมุม th กับ OC · OB = OD = d2/2 (ถ้า t ไม่ใช่กึ่งกลาง → ว่าว)
  const O = [t, 0], r = d2 / 2, Dp = cnsAdd(O, cnsDir(th), r), Bp = cnsAdd(O, cnsDir(th), -r), half = Math.abs(t - d1 / 2) < .01;
  return { name, poly: ['A', 'B', 'C', 'D'], pts: { A: [0, 0] }, fit: { A: [0, 0], C: [d1, 0], B: Bp, D: Dp, O }, lineThru: ['O', th],
    steps: [{ t: 'seg', a: 'A', b: 'C', len: d1, dir: 0, say: `ลากเส้นทแยงมุม <b>AC ยาว ${cnsF(d1)} ซม.</b>` },
      { t: 'mark', on: ['A', 'C'], name: 'O', d: t, say: half ? `ทำเครื่องหมาย<b>จุดกึ่งกลาง O</b> ของ AC (AO = ${cnsF(t)} ซม.)` : `ทำเครื่องหมายจุด O บน AC ให้ <b>AO = ${cnsF(t)} ซม.</b>` },
      { t: 'ang', at: 'O', from: 'C', to: 'D', deg: th, key: 'O', line: true, say: `ที่จุด O วัด<b>มุม ${th}°</b> แล้วลากเส้นผ่าน O` },
      { t: 'arc', c: 'O', r, tgt: () => Dp, say: `กางวงเวียน <b>${cnsF(r)} ซม.</b> (ครึ่งหนึ่งของ BD) จุดที่ O เขียนส่วนโค้ง<b>ตัดเส้นด้านบน</b>` },
      { t: 'arc', c: 'O', r, tgt: () => Bp, say: `วงเวียน <b>${cnsF(r)} ซม.</b> เท่าเดิม เขียนส่วนโค้ง<b>ตัดเส้นด้านล่าง</b>` },
      { t: 'tap', name: 'D', at: () => Dp, say: 'แตะจุดตัด<b>ด้านบน</b> ตั้งชื่อว่า D' }, { t: 'tap', name: 'B', at: () => Bp, say: 'แตะจุดตัด<b>ด้านล่าง</b> ตั้งชื่อว่า B' },
      { t: 'join', pairs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], say: 'ลากเส้นต่อจุด <b>A → B → C → D → A</b>' }] }; }
/* ---------- v131 (ผู้ใช้ขอ): สร้างรูปแบบ “ทำเองทั้งหมด” — ไม่บอกขั้นตอน เด็กหยิบอุปกรณ์เอง ----------
   เครื่องมือ: จุด (แตะวางจุด) · ไม้บรรทัด (ลากเส้น มีขีด ซม.) · ไม้โปรแทรกเตอร์ (ลากมาวางที่จุด · หมุนเองด้วยปุ่มหมุน · แตะที่ขอบเพื่อทำเครื่องหมายมุม)
   · วงเวียน (ลากขาเข็มไปวางที่จุด · ลากขาดินสอกางรัศมี · จับหัววงเวียนหมุนเขียนส่วนโค้ง) · ย้อนกลับ · คำใบ้ (ขึ้น 3 วินาที: ขั้นต่อไปควรทำอะไร)
   จุดดูดติดแม่น: จุดตัดของเส้น/ส่วนโค้ง → จุดเดิม → บนเส้น/ส่วนโค้ง → กริด 0.1 ซม. (รัศมีดูด 0.6 ซม.) · ตั้งชื่อจุดอัตโนมัติตามตำแหน่งที่ควรเป็นในแผนการสร้าง
   ตรวจผล: เมื่อด้านทั้งสี่ของรูปครบ เทียบตำแหน่งจุดยอดกับแผน (ยอมรับทั้งแบบกลับด้าน) — ถูก → สำเร็จ · ผิด → บอกด้านที่ยาว/มุมที่ไม่ตรง */
function cnsFree(T, cb = {}) { // v133 (ผู้ใช้ให้ไล่หาข้อผิดพลาด แล้ว “แก้”) — ต่อจาก v132
  /* หลักการ: SVG เดียวไม่ถูกแทนที่ · กริดวาดครั้งเดียว · วาดใหม่ผ่าน requestAnimationFrame · ตรวจการแตะด้วยระยะบนจอ (px)
     v133: ปลายเส้นดูดเข้าจุดที่อยู่ใกล้ (ไม้บรรทัดหมุน/เลื่อนตามให้) · อุปกรณ์ออกนอกกระดานไม่ได้ · จับวงเวียนตรงไหนก็ย้ายได้ · ลากขาดินสอวน = เขียนส่วนโค้ง
     ไม้บรรทัด: แถบขีดตัวเลข = จับย้าย · ขอบบน = ลากเส้น · ดูดขนานกับเส้นเดิม · ผิดแล้วบอกด้าน/มุมที่ไม่ตรง + ขั้นต่อไป · เฉลย/สำเร็จแสดงความยาวและมุม */
  const W = 640, H = 420, K = CNS_K, BW = W / K, BH = H / K, plan = T.steps, E0 = Object.assign({}, T.fit), n0 = plan[0].a, n1 = plan[0].b, L0 = plan[0].len, NS = 'http://www.w3.org/2000/svg', teach = !cb.onOK;
  const X = p => [p[0] * K, H - p[1] * K], U = (x, y) => [x / K, (H - y) / K];
  let S = { pts: [], segs: [], arcs: [] }, hist = [], tool = 'ruler', act = null, hover = null, done = false, solved = null, hintT = 0, raf = 0; const seenCyc = new Set();
  const R0 = { o: [1.2, 1.6], th: 0 }, P0 = { c: [11, 1.2], rot: 0 }, C0 = { c: [11.8, 2.6], r: 2, phi: 35 };
  const RUL = { o: R0.o.slice(), th: 0, len: 10, out: true }, prot = { c: P0.c.slice(), rot: 0, out: false }, comp = { c: C0.c.slice(), r: 2, phi: 35, out: false };
  const wrap = h('div', { class: 'cnsf rvl' + (teach ? ' teach' : '') }), board = h('div', { class: 'cns-board ia' }), msg = h('div', { class: 'cns-msg' }), tbar = h('div', { class: 'cnsf-tools' });
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'cns-svg'); svg.setAttribute('aria-hidden', 'true');
  const layer = c => { const g = document.createElementNS(NS, 'g'); g.setAttribute('class', c); svg.append(g); return g; };
  const gGrid = layer('cg-grid'), gFill = layer('cg-fill'), gObj = layer('cg-obj'), gTool = layer('cg-tool'), gLab = layer('cg-lab'), gUI = layer('cg-ui'); board.append(svg);
  { let s = ''; for (let x = 0; x <= W; x += K / 2) for (let y = H % (K / 2); y <= H; y += K / 2) s += `<circle cx="${x}" cy="${y}" r="${(x / (K / 2)) % 2 || ((H - y) / (K / 2)) % 2 ? .9 : 1.6}" fill="#D9D3EE"/>`; gGrid.innerHTML = s; }
  const save = () => { hist.push(JSON.stringify(S)); if (hist.length > 80) hist.shift(); };
  const say2 = (t, ms = 0) => { msg.innerHTML = t; msg.classList.toggle('hint', !!ms); clearTimeout(hintT); if (ms) hintT = setTimeout(() => { msg.innerHTML = ''; msg.classList.remove('hint'); }, ms); };
  /* ---------- geometry ---------- */
  const D = cnsDist, ang = cnsAng, dir = cnsDir, nrm = a => ((a % 360) + 360) % 360, adiff = (a, b) => Math.abs(((a - b) % 360 + 540) % 360 - 180), wrapD = d => ((d % 360) + 540) % 360 - 180;
  const clampB = (p, m = .25) => [Math.max(m, Math.min(BW - m, p[0])), Math.max(m, Math.min(BH - m, p[1]))], inB = (p, m = .1) => p[0] > m && p[1] > m && p[0] < BW - m && p[1] < BH - m;
  const P_ = i => [S.pts[i].x, S.pts[i].y], segPts = s => [P_(s.a), P_(s.b)];
  const onArc = (a, p) => { if (a.a1 - a.a0 >= 359) return true; return nrm(ang(P_(a.c), p) - a.a0) <= nrm(a.a1 - a.a0) + .05; };
  const projSeg = ([a, b], p) => { const v = [b[0] - a[0], b[1] - a[1]], L2 = v[0] ** 2 + v[1] ** 2 || 1, t = Math.max(0, Math.min(1, ((p[0] - a[0]) * v[0] + (p[1] - a[1]) * v[1]) / L2)); return [a[0] + v[0] * t, a[1] + v[1] * t]; };
  const xSS = ([a, b], [c, d]) => { const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0]; if (Math.abs(den) < 1e-9) return []; const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den; return t > -1e-6 && t < 1 + 1e-6 && u > -1e-6 && u < 1 + 1e-6 ? [[a[0] + r[0] * t, a[1] + r[1] * t]] : []; };
  const xCC = (c1, r1, c2, r2) => { const d = D(c1, c2); if (d < 1e-6 || d > r1 + r2 + 1e-6 || d < Math.abs(r1 - r2) - 1e-6) return []; const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r1 * r1 - a * a)), m = [c1[0] + a * (c2[0] - c1[0]) / d, c1[1] + a * (c2[1] - c1[1]) / d]; return [[m[0] + hh * (c2[1] - c1[1]) / d, m[1] - hh * (c2[0] - c1[0]) / d], [m[0] - hh * (c2[1] - c1[1]) / d, m[1] + hh * (c2[0] - c1[0]) / d]]; };
  const xSC = ([a, b], c, r) => { const v = [b[0] - a[0], b[1] - a[1]], f = [a[0] - c[0], a[1] - c[1]], A = v[0] ** 2 + v[1] ** 2, B = 2 * (f[0] * v[0] + f[1] * v[1]), C = f[0] ** 2 + f[1] ** 2 - r * r, disc = B * B - 4 * A * C; if (disc < 0 || A < 1e-9) return []; const sq = Math.sqrt(disc); return [(-B - sq) / (2 * A), (-B + sq) / (2 * A)].filter(t => t > -1e-6 && t < 1 + 1e-6).map(t => [a[0] + v[0] * t, a[1] + v[1] * t]); };
  const inters = () => { const out = [], sg = S.segs.map(segPts), ac = S.arcs.map(a => ({ a, c: P_(a.c) }));
    for (let i = 0; i < sg.length; i++) for (let j = i + 1; j < sg.length; j++) out.push(...xSS(sg[i], sg[j]));
    for (let i = 0; i < ac.length; i++) for (let j = i + 1; j < ac.length; j++) out.push(...xCC(ac[i].c, ac[i].a.r, ac[j].c, ac[j].a.r).filter(p => onArc(ac[i].a, p) && onArc(ac[j].a, p)));
    sg.forEach(s => ac.forEach(o => out.push(...xSC(s, o.c, o.a.r).filter(p => onArc(o.a, p))))); return out; };
  const realPts = () => S.pts.filter(q => !q.mark).map(q => [q.x, q.y]);
  let pxcm = K; // px บนจอต่อ 1 ซม.
  const at = e => { const m = svg.getScreenCTM(); pxcm = K * (m ? Math.hypot(m.a, m.b) : 1); const q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m.inverse()); return U(r.x, r.y); };
  const cm = px => px / pxcm;
  /* จุดดูด (เฉพาะเมื่อใกล้): จุดตัด → จุดเดิม → ขอบไม้บรรทัด (ปัดตามขีด 0.1) → บนเส้น — ไม่ปัดกริด */
  const magnet = (p, o = {}) => { const R1 = cm(o.px || 16);
    let best = null, bd = R1; inters().forEach(q => { const d = D(p, q); if (d < bd) { bd = d; best = { p: q, k: 'x' }; } }); if (best) return best;
    S.pts.forEach((q, i) => { if (q.mark && !o.marks) return; const d = D(p, [q.x, q.y]); if (d < bd) { bd = d; best = { p: [q.x, q.y], k: 'pt', i }; } }); if (best) return best;
    if (o.ruler !== false && RUL.out) { const u = dir(RUL.th), t = (p[0] - RUL.o[0]) * u[0] + (p[1] - RUL.o[1]) * u[1], q = cnsAdd(RUL.o, u, t), d = D(p, q); if (t > -.05 && t < RUL.len + .05 && d < cm(12)) { const tr = Math.round(t * 10) / 10; return { p: cnsAdd(RUL.o, u, tr), k: 'rul', t: tr }; } }
    if (o.curve !== false) { let b2 = cm(9); S.segs.forEach(s => { const q = projSeg(segPts(s), p), d = D(p, q); if (d < b2) { b2 = d; best = { p: q, k: 'on' }; } }); if (best) return best; }
    return null; };
  const ptAt = (p, mark = false, auto = false) => { const i = S.pts.findIndex(q => !q.mark && D(p, [q.x, q.y]) < .03); if (i >= 0 && !mark) { if (!auto) S.pts[i].auto = false; return i; } S.pts.push({ x: p[0], y: p[1], mark, auto }); return S.pts.length - 1; };
  /* ---------- plan frame: ชื่อจุด · คำใบ้ · ตรวจผล ---------- */
  const frames = () => { const fr = []; S.segs.forEach(s => { const P = segPts(s); if (Math.abs(D(P[0], P[1]) - L0) > .16) return; [[0, 1], [1, 0]].forEach(([i, j]) => [1, -1].forEach(sg => { const o = P[i], u = [(P[j][0] - o[0]) / D(o, P[j]), (P[j][1] - o[1]) / D(o, P[j])], v = [-u[1] * sg, u[0] * sg]; fr.push({ o, u, v, map: e => [o[0] + u[0] * e[0] + v[0] * e[1], o[1] + u[1] * e[0] + v[1] * e[1]] }); })); }); return fr; };
  const score = f => { let n = 0; Object.values(E0).forEach(e => { const q = f.map(e); if (S.pts.some(p => D([p.x, p.y], q) < .25)) n += 2; }); S.arcs.forEach(a => { Object.values(E0).forEach(e => { if (D(P_(a.c), f.map(e)) < .2) n++; }); }); S.pts.forEach(p => { if (p.mark) Object.values(E0).forEach(e => { if (adiff(ang(f.o, [p.x, p.y]), ang(f.o, f.map(e))) < 1.5) n += .5; }); }); return n; };
  const frame = () => { const fr = frames(); if (!fr.length) return null; return fr.reduce((a, b) => score(b) > score(a) ? b : a); };
  const names = F => { const nm = S.pts.map(() => null), used = new Set();
    if (solved) { Object.keys(E0).forEach(n => { const q = solved(n); let bi = -1, bd = .25; S.pts.forEach((p, i) => { if (p.mark || nm[i]) return; const d = D([p.x, p.y], q); if (d < bd) { bd = d; bi = i; } }); if (bi >= 0) nm[bi] = n; }); return nm; }
    if (F) Object.entries(E0).forEach(([n, e]) => { const q = F.map(e); let bi = -1, bd = .25; S.pts.forEach((p, i) => { if (p.mark || nm[i]) return; const d = D([p.x, p.y], q); if (d < bd) { bd = d; bi = i; } }); if (bi >= 0) { nm[bi] = n; used.add(n); } });
    else { const real = S.pts.map((p, i) => i).filter(i => !S.pts[i].mark); if (real[0] != null) { nm[real[0]] = n0; used.add(n0); } if (real[1] != null) { nm[real[1]] = n1; used.add(n1); } }
    const pool = 'EFGHIJKLMNPQRSTUVWXYZ'.split('').filter(c => !used.has(c) && !(c in E0)); S.pts.forEach((p, i) => { if (!p.mark && !nm[i] && !p.auto) nm[i] = pool.shift() || '?'; }); return nm; };
  const hasSeg = (p, q) => S.segs.some(s => { const P = segPts(s); return D(projSeg(P, p), p) < .06 && D(projSeg(P, q), q) < .06; });
  const kp = (F, n) => { if (!F || !E0[n]) return null; const q = F.map(E0[n]), p = S.pts.find(x => !x.mark && D([x.x, x.y], q) < .25); return p ? [p.x, p.y] : null; };
  plan.forEach(s => { if (s.t === 'arc') { s.tgtE = s.tgt(E0, {}); s.tgtN = Object.keys(E0).find(n => D(E0[n], s.tgtE) < .01); } });
  const stepOk = (F, s) => { if (!F) return false; const P = n => kp(F, n);
    if (s.t === 'seg') return !!(P(s.a) && P(s.b) && hasSeg(P(s.a), P(s.b)));
    if (s.t === 'ang') { const a = P(s.at); if (!a || !P(s.from)) return false; const tgt = ang(a, F.map(E0[s.to] || E0[s.from])); return S.pts.some(p => D([p.x, p.y], a) > .5 && adiff(ang(a, [p.x, p.y]), tgt) < 1.6) || S.segs.some(sg => { const Q = segPts(sg); return (D(Q[0], a) < .06 && adiff(ang(a, Q[1]), tgt) < 1.6) || (D(Q[1], a) < .06 && adiff(ang(a, Q[0]), tgt) < 1.6); }); }
    if (s.t === 'arc') { const c = P(s.c); if (!c) return false; const tg = F.map(s.tgtE); return S.arcs.some(a => D(P_(a.c), c) < .2 && Math.abs(a.r - s.r) < .16 && onArc(a, cnsAdd(c, dir(ang(c, tg)), a.r))); }
    if (s.t === 'tap' || s.t === 'mark') return !!P(s.name);
    if (s.t === 'join') return s.pairs.every(([a, b]) => P(a) && P(b) && hasSeg(P(a), P(b)));
    return false; };
  const nextSay = () => { const F = frame(), s = plan.find(st => !stepOk(F, st)) || plan[plan.length - 1]; return s.say.replace(/ตั้งชื่อว่า [A-Z]/, ''); };
  const finish = map => { solved = map; RUL.out = prot.out = comp.out = false; tool = 'point'; act = null; hover = null; tbar.querySelectorAll('.cnsf-t').forEach(x => x.classList.toggle('on', x.dataset.k === 'point')); };
  /* อธิบายว่ารูปที่ได้ผิดตรงไหน (เทียบกับโจทย์ทุกแบบที่หมุน/กลับด้านได้) */
  const whyWrong = (Q, nm) => { const PL = T.poly.map(n => E0[n]), side = (A, i) => D(A[i], A[(i + 1) % 4]), angAt = (A, i) => adiff(ang(A[i], A[(i + 3) % 4]), ang(A[i], A[(i + 1) % 4]));
    let best = null; for (let s0 = 0; s0 < 4; s0++) for (const rv of [1, -1]) { const ord = [0, 1, 2, 3].map(k => (s0 + rv * k + 8) % 4), A = ord.map(i => Q[i]); let e = 0; for (let i = 0; i < 4; i++) e += Math.abs(side(A, i) - side(PL, i)) + Math.abs(angAt(A, i) - angAt(PL, i)) / 20; if (!best || e < best.e) best = { e, A, ord }; }
    const A = best.A, nmOf = i => nm[best.ord[i]] || T.poly[i];
    if (T.lineThru) { const d1 = D(A[0], A[2]), d2 = D(A[1], A[3]), p1 = D(PL[0], PL[2]), p2 = D(PL[1], PL[3]); if (Math.abs(d1 - p1) > .2) return `เส้นทแยงมุม ${nmOf(0)}${nmOf(2)} ยาว ${cnsF(d1)} ซม. แต่โจทย์ต้องการ ${cnsF(p1)} ซม.`; if (Math.abs(d2 - p2) > .2) return `เส้นทแยงมุม ${nmOf(1)}${nmOf(3)} ยาว ${cnsF(d2)} ซม. แต่โจทย์ต้องการ ${cnsF(p2)} ซม.`;
      const g = adiff(ang(A[0], A[2]), ang(A[1], A[3])), pg = adiff(ang(PL[0], PL[2]), ang(PL[1], PL[3])), gg = Math.min(g, 180 - g), pp = Math.min(pg, 180 - pg); if (Math.abs(gg - pp) > 3) return `เส้นทแยงมุมตัดกันเป็นมุม ${Math.round(gg)}° แต่โจทย์ต้องการ ${Math.round(pp)}°`; }
    const ai = T.poly.indexOf(plan.find(s => s.t === 'ang')?.at || 'A'); if (ai >= 0 && Math.abs(angAt(A, ai) - angAt(PL, ai)) > 3) return `มุม ${nmOf(ai)} ได้ ${Math.round(angAt(A, ai))}° แต่โจทย์ต้องการ ${Math.round(angAt(PL, ai))}°`;
    for (let i = 0; i < 4; i++) if (Math.abs(side(A, i) - side(PL, i)) > .2) return `ด้าน ${nmOf(i)}${nmOf((i + 1) % 4)} ยาว ${cnsF(side(A, i))} ซม. แต่ควรยาว ${cnsF(side(PL, i))} ซม.`;
    for (let i = 0; i < 4; i++) if (Math.abs(angAt(A, i) - angAt(PL, i)) > 3) return `มุม ${nmOf(i)} ได้ ${Math.round(angAt(A, i))}° แต่ควรเป็น ${Math.round(angAt(PL, i))}°`;
    return 'รูปที่ได้ยังไม่ตรงกับโจทย์'; };
  const check = () => { if (done) return; const F = frame(), poly = T.poly, ok = F && poly.every((n, i) => { const a = kp(F, n), b = kp(F, poly[(i + 1) % 4]); return a && b && hasSeg(a, b); });
    if (ok) { done = true; finish(n => kp(F, n) || F.map(E0[n])); req(); say2(`<b>สร้างเสร็จแล้ว!</b> ได้${T.name} 🎉`); sfx.ok(); cb.onOK && cb.onOK(); try { teachDone(wrap); } catch (_) { } return; }
    const real = S.pts.map((p, i) => i).filter(i => !S.pts[i].mark), adj = i => real.filter(j => j !== i && hasSeg(P_(i), P_(j))), cyc = [], keys = new Set();
    for (const a of real) for (const b of adj(a)) for (const c of adj(b)) { if (c === a) continue; for (const d of adj(c)) { if (d === a || d === b || !adj(d).includes(a)) continue; const ks = [a, b, c, d].slice().sort((x, y) => x - y).join(','); if (keys.has(ks)) continue; keys.add(ks); const Q = [a, b, c, d].map(P_), turn = i => adiff(ang(Q[i], Q[(i + 3) % 4]), ang(Q[i], Q[(i + 1) % 4])); if ([0, 1, 2, 3].every(i => turn(i) > 6 && turn(i) < 174)) cyc.push([a, b, c, d]); } }
    const keyOf = cy => cy.map(i => P_(i).map(v => Math.round(v * 10)).join(':')).sort().join('|'), nw = cyc.find(cy => !seenCyc.has(keyOf(cy))); if (!nw) return; seenCyc.add(keyOf(nw));
    const nm = names(F); let cy = nw; { const k0 = cy.findIndex(i => nm[i] === n0); if (k0 > 0) cy = [...cy.slice(k0), ...cy.slice(0, k0)]; }
    const why = whyWrong(cy.map(P_), cy.map(i => nm[i])) + ' — 💡 ' + nextSay();
    sfx.no(); board.classList.remove('shake'); void board.offsetWidth; board.classList.add('shake'); say2(why); cb.onWrong && cb.onWrong(why); };
  const hint = () => { say2('💡 ' + nextSay(), 3000); sfx.pop(2); };
  /* ---------- drawing ---------- */
  const arcP = (c, r, a0, a1, cls = '') => { if (a1 - a0 >= 359.5) return `<circle cx="${X(c)[0]}" cy="${X(c)[1]}" r="${r * K}" fill="none" stroke="#7E6ED6" stroke-width="2.2" class="${cls}"/>`; const A = X(cnsAdd(c, dir(a0), r)), B = X(cnsAdd(c, dir(a1), r)); return `<path d="M${A} A${r * K} ${r * K} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${B}" fill="none" stroke="#7E6ED6" stroke-width="2.2" class="${cls}"/>`; };
  const rulKT = () => { const u = dir(RUL.th), n = [-u[1], u[0]]; for (let t = RUL.len + .05; t > 1; t -= .25) { const q = cnsAdd(cnsAdd(RUL.o, u, t), n, -.55); if (inB(q, .35)) return t; } return 1.2; }; // ปุ่มหมุนอยู่ในกระดานเสมอ
  const rulVis = () => { const u = dir(RUL.th), n = [-u[1], u[0]]; let c = 0; for (let t = 0; t <= RUL.len; t += .5) if (inB(cnsAdd(cnsAdd(RUL.o, u, t), n, -.55), .2)) c++; return c >= 4; }; // เห็นบนกระดานอย่างน้อย ~2 ซม.
  const rulerG = on => { const u = dir(RUL.th), n = [-u[1], u[0]], q = (t, o) => X(cnsAdd(cnsAdd(RUL.o, u, t), n, o)); let s = `<g class="cns-ruler ${on ? 'on' : 'off'}"><path d="M${q(-.4, 0)} L${q(RUL.len + .4, 0)} L${q(RUL.len + .4, -1.1)} L${q(-.4, -1.1)} Z" fill="#FFE9A8" fill-opacity=".88" stroke="#C98612" stroke-width="1.5"/>`;
    for (let t = 0; t <= RUL.len + 1e-9; t += .1) { const tt = Math.round(t * 10), L = tt % 10 === 0 ? -.42 : tt % 5 === 0 ? -.3 : -.18; s += `<path d="M${q(t, 0)} L${q(t, L)}" stroke="#8A5A1E" stroke-width="${tt % 10 ? .7 : 1.3}"/>`; if (tt % 10 === 0) s += `<text x="${q(t, -.66)[0]}" y="${q(t, -.66)[1] + 4}" text-anchor="middle" class="cns-rt">${tt / 10}</text>`; }
    const kb = q(rulKT(), -.55); return s + (on ? `<circle cx="${kb[0]}" cy="${kb[1]}" r="13" fill="#C98612"/><text x="${kb[0]}" y="${kb[1] + 5}" text-anchor="middle" class="cns-ico">⟳</text>` : '') + '</g>'; };
  const protG = on => { const R = 2.7, q = (deg, r) => X(cnsAdd(prot.c, dir(prot.rot + deg), r)); let s = `<g class="cns-prot ${on ? 'on' : 'off'}"><path d="M${q(0, R)} A${R * K} ${R * K} 0 0 0 ${q(180, R)} Z" fill="#CFE6FF" fill-opacity=".55" stroke="#3D8BD9" stroke-width="1.6"/><path d="M${q(0, R)} L${q(180, R)}" stroke="#3D8BD9" stroke-width="1.6"/>`;
    for (let a = 0; a <= 180; a += 5) s += `<path d="M${q(a, R)} L${q(a, R - (a % 10 ? .14 : a % 30 ? .22 : .34))}" stroke="#2B6FB8" stroke-width="1.1"/>`;
    for (let a = 0; a <= 180; a += 30) s += `<text x="${q(a, R - .55)[0]}" y="${q(a, R - .55)[1] + 4}" text-anchor="middle" class="cns-pt">${a}</text><text x="${q(a, R - 1.05)[0]}" y="${q(a, R - 1.05)[1] + 4}" text-anchor="middle" class="cns-pt in">${180 - a}</text>`;
    const C = X(prot.c), RK = q(0, R + .55); return s + `<circle cx="${C[0]}" cy="${C[1]}" r="4" fill="#2B6FB8"/>` + (on ? `<circle cx="${RK[0]}" cy="${RK[1]}" r="13" fill="#3D8BD9"/><text x="${RK[0]}" y="${RK[1] + 5}" text-anchor="middle" class="cns-ico">⟳</text>` : '') + '</g>'; };
  const compGeo = () => { const C = X(comp.c), Pn = X(cnsAdd(comp.c, dir(comp.phi), comp.r)), M = [(C[0] + Pn[0]) / 2, (C[1] + Pn[1]) / 2], L = Math.hypot(Pn[0] - C[0], Pn[1] - C[1]) || 1, n = [-(Pn[1] - C[1]) / L, (Pn[0] - C[0]) / L], hh = Math.max(34, 90 - L * .15);
    let up = n[1] < 0 ? n : [-n[0], -n[1]]; const ok = u => { const k = [M[0] + u[0] * (hh + 24), M[1] + u[1] * (hh + 24)]; return k[0] > 16 && k[1] > 16 && k[0] < W - 16 && k[1] < H - 16; }; if (!ok(up) && ok([-up[0], -up[1]])) up = [-up[0], -up[1]]; // หัววงเวียนไม่ล้นกระดาน
    const Hn = [M[0] + up[0] * hh, M[1] + up[1] * hh], Kn = [Hn[0] + up[0] * 24, Hn[1] + up[1] * 24]; return { C, Pn, Hn, Kn }; };
  const compG = on => { const { C, Pn, Hn, Kn } = compGeo(); return `<g class="cns-comp ${on ? 'on' : 'off'}"><path d="M${C} L${Hn} L${Pn}" fill="none" stroke="#5B5F7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${Hn[0]}" cy="${Hn[1]}" r="6" fill="#7E6ED6"/><path d="M${Hn} L${Kn}" stroke="#7E6ED6" stroke-width="6" stroke-linecap="round"/><circle cx="${C[0]}" cy="${C[1]}" r="3.5" fill="#2B2550"/><circle cx="${Pn[0]}" cy="${Pn[1]}" r="${on ? 7 : 4.5}" fill="#E5487A"/>`
      + (on ? `<circle cx="${Kn[0]}" cy="${Kn[1]}" r="14" fill="#7E6ED6"/><text x="${Kn[0]}" y="${Kn[1] + 5}" text-anchor="middle" class="cns-ico">⟳</text><text x="${Pn[0] + 14}" y="${Pn[1] + 24}" class="cns-read">รัศมี ${cnsF(comp.r)} ซม.</text>` : '') + '</g>'; };
  /* ความยาวด้าน/มุมตามโจทย์ (แสดงตอนสร้างเสร็จและตอนเฉลย) */
  const measG = mp => { const cen = T.poly.map(mp).reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4], [0, 0]), seen = new Set(); let s = '';
    const side = (a, b, len, flip) => { const k = [a, b].sort().join(''); if (seen.has(k) || !E0[a] || !E0[b]) return; seen.add(k); const A = mp(a), B = mp(b), u = dir(ang(A, B)); let m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; if (Object.keys(E0).some(n => D(mp(n), m) < .3)) m = [A[0] * .72 + B[0] * .28, A[1] * .72 + B[1] * .28]; /* กลางเส้นชนจุด O → เลื่อนป้าย */ let nv = [-u[1], u[0]]; if ((m[0] - cen[0]) * nv[0] + (m[1] - cen[1]) * nv[1] < 0) nv = [-nv[0], -nv[1]]; if (D(m, cen) < .05) nv = [-u[1], u[0]]; if (flip) nv = [-nv[0], -nv[1]]; const q = X(cnsAdd(m, nv, .42)); s += `<text x="${q[0]}" y="${q[1] + 5}" text-anchor="middle" class="cns-len">${cnsF(len ?? D(E0[a], E0[b]))} ซม.</text>`; };
    plan.forEach(st => { if (st.t === 'seg') side(st.a, st.b, st.len); if (st.t === 'arc' && st.tgtN) side(st.c, st.tgtN, st.r); if (st.t === 'mark') side(st.on[0], st.name, st.d, true);
      if (st.t === 'ang') { const A = mp(st.at), a0 = ang(A, mp(st.from)), a1 = ang(A, mp(st.to)); let lo = a0, sw = nrm(a1 - a0); if (sw > 180) { lo = a1; sw = 360 - sw; } const r = .7, P1 = X(cnsAdd(A, dir(lo), r)), P2 = X(cnsAdd(A, dir(lo + sw), r)), tq = X(cnsAdd(A, dir(lo + sw / 2), 1.2));
        s += `<path d="M${P1} A${r * K} ${r * K} 0 0 0 ${P2}" fill="none" stroke="#C25B00" stroke-width="2"/><text x="${tq[0]}" y="${tq[1] + 5}" text-anchor="middle" class="cns-deg">${st.deg}°</text>`; } });
    return s; };
  const render = () => { raf = 0; const F = solved ? null : frame(), nm = names(F);
    gFill.innerHTML = solved ? `<path d="M${T.poly.map(n => X(solved(n))).join(' L')} Z" fill="#FFD27A" fill-opacity=".6"/>` : '';
    const deg = S.pts.map(() => 0); S.segs.forEach(sg => { deg[sg.a]++; deg[sg.b]++; }); S.arcs.forEach(a => { deg[a.c] += 2; });
    let s = ''; S.arcs.forEach(a => { s += arcP(P_(a.c), a.r, a.a0, a.a1); }); S.segs.forEach(sg => { const P = segPts(sg); s += `<path d="M${X(P[0])} L${X(P[1])}" stroke="#2B2550" stroke-width="3" stroke-linecap="round"/>`; });
    if (act && act.t === 'pen') s += `<path d="M${X(act.a)} L${X(act.e)}" stroke="#E5487A" stroke-width="3" stroke-linecap="round"/>`;
    if (act && act.t === 'sweep') s += arcP(comp.c, comp.r, Math.min(act.a0, act.a1), Math.max(act.a0, act.a1), 'cns-live');
    let lab = '';
    S.pts.forEach((p, i) => { const q = X([p.x, p.y]); if (p.mark) { s += `<path d="M${q[0] - 5} ${q[1] - 5} l10 10 M${q[0] + 5} ${q[1] - 5} l-10 10" stroke="#E5487A" stroke-width="2.4"/>`; return; }
      if (nm[i]) { s += `<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="#E5487A"/>`; lab += `<text x="${q[0] - 15}" y="${q[1] - 10}" class="cns-n">${nm[i]}</text>`; }
      else s += deg[i] >= 2 || solved ? `<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="#9A93C4"/>` : `<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#fff" stroke="#9A93C4" stroke-width="2"/>`; }); // วงกลวง = ปลายเส้นที่ยังไม่ต่อกับอะไร
    gObj.innerHTML = s;
    gTool.innerHTML = (RUL.out || tool === 'ruler' ? rulerG(tool === 'ruler') : '') + (prot.out || tool === 'prot' ? protG(tool === 'prot') : '') + (comp.out || tool === 'comp' ? compG(tool === 'comp') : '');
    gLab.innerHTML = lab + (solved ? measG(solved) : '');
    let u = ''; if (act && act.t === 'pen') { const e = X(act.e); u += `<text x="${e[0] + 12}" y="${e[1] - 16}" class="cns-read">${cnsF(D(act.a, act.e))} ซม.</text>`; if (act.snapE) u += `<circle cx="${e[0]}" cy="${e[1]}" r="11" fill="none" stroke="#E5487A" stroke-width="2" stroke-dasharray="3 3"/>`; if (act.snapA) { const a = X(act.a); u += `<circle cx="${a[0]}" cy="${a[1]}" r="11" fill="none" stroke="#E5487A" stroke-width="2" stroke-dasharray="3 3"/>`; } }
    if (hover && !act && tool === 'point' && !done) { const q = X(hover.p); u += hover.k ? `<circle cx="${q[0]}" cy="${q[1]}" r="11" fill="none" stroke="#E5487A" stroke-width="2" stroke-dasharray="3 3"/>` : ''; u += `<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#E5487A" fill-opacity=".45"/>`; }
    gUI.innerHTML = u; };
  const req = () => { if (!raf) raf = requestAnimationFrame(render); };
  /* ---------- hit tests (ระยะบนจอ) ---------- */
  const near = (p, q, px) => D(p, q) <= cm(px);
  const rulLocal = p => { const u = dir(RUL.th), v = [p[0] - RUL.o[0], p[1] - RUL.o[1]]; return { t: v[0] * u[0] + v[1] * u[1], n: v[0] * -u[1] + v[1] * u[0] }; };
  const rulKnob = () => { const u = dir(RUL.th), n = [-u[1], u[0]]; return cnsAdd(cnsAdd(RUL.o, u, rulKT()), n, -.55); };
  const protKnob = () => cnsAdd(prot.c, dir(prot.rot), 3.25);
  const compPts = () => { const g = compGeo(); return { c: comp.c, pen: cnsAdd(comp.c, dir(comp.phi), comp.r), hinge: U(g.Hn[0], g.Hn[1]), knob: U(g.Kn[0], g.Kn[1]) }; };
  const dSeg = (p, a, b) => D(p, projSeg([a, b], p));
  /* ไม้บรรทัด: เริ่ม/จบเส้นที่จุดใกล้ ๆ ได้แม้ไม้บรรทัดวางเบี้ยวเล็กน้อย — ไม้บรรทัดเลื่อน/หมุนตามให้ผ่านจุดนั้น */
  const penStart = p => { const u = dir(RUL.th), nv = [-u[1], u[0]], L = rulLocal(p); let best = null, bd = cm(20);
    [...realPts(), ...inters()].forEach(q => { const Lq = rulLocal(q); if (Math.abs(Lq.n) > .4 || Lq.t < -.7 || Lq.t > RUL.len + .05) return; const d = D(p, q); if (d < bd) { bd = d; best = { q, Lq }; } });
    if (best) { if (Math.abs(best.Lq.n) > 1e-4) RUL.o = cnsAdd(RUL.o, nv, best.Lq.n); let t = best.Lq.t; if (t < 0) { RUL.o = cnsAdd(RUL.o, u, t); t = 0; } return { p: best.q, t, snap: true }; } // จุดอยู่เลยขีด 0 ไปนิด → เลื่อนขีด 0 มาที่จุด
    const t = Math.max(0, Math.min(RUL.len, Math.round(L.t * 10) / 10)); return { p: cnsAdd(RUL.o, u, t), t, snap: false }; };
  const penMove = p => { const a = act; RUL.o = a.o0.slice(); RUL.th = a.th0; const u = dir(RUL.th), L = rulLocal(p);
    let best = null, bd = cm(20); [...realPts(), ...inters()].forEach(q => { if (D(q, a.a) < .3) return; const d = D(p, q); if (d >= bd) return; const th = ang(a.a, q), tq = a.ta + D(a.a, q); if (adiff(th, a.th0) > 10 || tq > RUL.len + .05) return; bd = d; best = { q, th }; });
    if (best) { RUL.th = best.th; RUL.o = cnsAdd(a.a, dir(best.th), -a.ta); a.e = best.q; a.snapE = true; return; }
    let t = Math.max(0, Math.min(RUL.len, Math.round(L.t * 10) / 10)); a.e = cnsAdd(RUL.o, u, t); a.snapE = false; };
  const align = (c, th) => { let best = th, bd = 3.5; [...S.pts.map(q => [q.x, q.y]), ...inters()].forEach(q => { if (D(q, c) < .8) return; const a = ang(c, q); if (adiff(a, th) < bd) { bd = adiff(a, th); best = a; } }); if (best !== th) return best;
    bd = 2.5; S.segs.forEach(sg => { const P = segPts(sg), a = ang(P[0], P[1]); [a, a + 180].forEach(x => { if (adiff(x, th) < bd) { bd = adiff(x, th); best = nrm(x); } }); }); // ขนานกับเส้นที่มีอยู่
    [0, 90, 180, 270].forEach(a => { if (adiff(a, best) < 1.5) best = a; }); return best; };
  const resetIfLost = k => { if (k === 'ruler' && !rulVis()) { RUL.o = R0.o.slice(); RUL.th = 0; } if (k === 'prot' && !inB(prot.c, .2)) { prot.c = P0.c.slice(); prot.rot = 0; } if (k === 'comp' && !inB(comp.c, .2)) { comp.c = C0.c.slice(); comp.r = C0.r; comp.phi = C0.phi; } };
  /* ---------- pointer ---------- */
  svg.addEventListener('pointerdown', e => { if (done) return; e.preventDefault(); e.stopPropagation(); const p = at(e); try { svg.setPointerCapture(e.pointerId); } catch (_) { } const sx = e.clientX, sy = e.clientY;
    if (tool === 'ruler') { RUL.out = true; const L = rulLocal(p);
      if (near(p, rulKnob(), 26)) { act = { t: 'rrot', last: ang(RUL.o, p), th0: RUL.th, o0: RUL.o.slice() }; return; }
      if (L.t > -.5 && L.t < RUL.len + .5 && L.n > -1.1 - cm(8) && L.n < cm(26)) { if (L.n > -cm(6)) { // ขอบบน (และเหนือขอบ) = ลากปากกาตามขอบไม้บรรทัด · แถบขีดตัวเลขลงไป = จับย้าย
          const o0 = RUL.o.slice(), st = penStart(p); act = { t: 'pen', a: st.p, ta: st.t, e: st.p, snapA: st.snap, snapE: false, o0: RUL.o.slice(), th0: RUL.th, oBefore: o0 }; req(); return; }
        act = { t: 'rmove', d: [p[0] - RUL.o[0], p[1] - RUL.o[1]] }; return; }
      return; }
    if (tool === 'prot') { prot.out = true;
      if (near(p, protKnob(), 26)) { act = { t: 'prot', last: ang(prot.c, p) }; return; }
      const r = D(prot.c, p), a = nrm(ang(prot.c, p) - prot.rot); if (r < 3 && (a <= 180 || r < cm(18))) { act = { t: 'pdown', p, sx, sy, d: [p[0] - prot.c[0], p[1] - prot.c[1]] }; return; }
      return; }
    if (tool === 'comp') { comp.out = true; const K3 = compPts();
      if (near(p, K3.knob, 24) && D(p, K3.knob) < D(p, K3.hinge)) { act = { t: 'sweep', a0: comp.phi, a1: comp.phi, last: ang(comp.c, p) }; return; }
      if (near(p, K3.pen, 26)) { act = { t: 'cpen', sp: p, r0: comp.r, phi0: comp.phi, mode: null }; return; }
      if (near(p, K3.c, 26) || dSeg(p, K3.c, K3.hinge) < cm(18) || dSeg(p, K3.hinge, K3.pen) < cm(18) || near(p, K3.hinge, 22)) { act = { t: 'cmove', d: [p[0] - comp.c[0], p[1] - comp.c[1]], body: !near(p, K3.c, 26) }; return; } // จับเข็มหรือตัววงเวียน = ย้ายทั้งอัน
      return; }
    if (tool === 'point') { act = { t: 'tap', sx, sy }; } });
  svg.addEventListener('pointermove', e => { const p = at(e);
    if (!act) { if (tool === 'point' && !done) { const m = magnet(p, { marks: false }); hover = m ? { p: m.p, k: m.k } : { p, k: null }; req(); } return; }
    if (act.t === 'pen') { penMove(p); req(); return; }
    if (act.t === 'rmove') { const pc = clampB(p, .15); let o = [pc[0] - act.d[0], pc[1] - act.d[1]]; const m = magnet(o, { px: 24, marks: true, ruler: false, curve: false }); if (m) o = m.p; RUL.o = o; req(); return; }
    if (act.t === 'rrot') { const now = ang(RUL.o, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; act.raw = (act.raw ?? RUL.th) + d; const prev = RUL.th; RUL.th = align(RUL.o, act.raw); if (!rulVis()) RUL.th = prev; req(); return; }
    if (act.t === 'pdown') { if (Math.hypot(e.clientX - act.sx, e.clientY - act.sy) > 7) act = { t: 'pmove', d: act.d }; else return; }
    if (act.t === 'pmove') { const pc = clampB(p, .15); let c = clampB([pc[0] - act.d[0], pc[1] - act.d[1]], .2); const m = magnet(c, { px: 22, marks: false, ruler: false, curve: false }); if (m) c = m.p; prot.c = c; req(); return; }
    if (act.t === 'prot') { const now = ang(prot.c, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; act.raw = (act.raw ?? prot.rot) + d; let r = act.raw, bd = 3; S.segs.forEach(sg => { const P = segPts(sg); [0, 1].forEach(i => { if (D(P[i], prot.c) < .06) { const dq = ang(prot.c, P[1 - i]); if (adiff(r, dq) < bd) { bd = adiff(r, dq); r = dq; } } }); }); [0, 90, 180, 270].forEach(dq => { if (adiff(r, dq) < 1.2) r = dq; }); prot.rot = r; req(); return; }
    if (act.t === 'cmove') { const pc = clampB(p, .15); let c = clampB([pc[0] - act.d[0], pc[1] - act.d[1]], .2); const m = magnet(c, { px: act.body ? 26 : 22, marks: false, ruler: false, curve: false }); if (m) c = m.p; comp.c = c; const pn = cnsAdd(comp.c, dir(comp.phi), comp.r); if (!inB(pn, .4)) comp.phi = ang(comp.c, [BW / 2, BH / 2]); req(); return; }
    if (act.t === 'cpen') { if (!act.mode) { if (D(p, act.sp) < cm(14)) return; const dr = Math.abs(D(comp.c, p) - act.r0); act.mode = dr < cm(4) && act.r0 >= .8 ? 'draw' : 'rad'; if (act.mode === 'draw') { act = { t: 'sweep', a0: act.phi0, a1: act.phi0, last: act.phi0 }; } } // ลากขาดินสอวน = เขียนส่วนโค้ง · ลากเข้า/ออก = กางรัศมี
      if (act.t === 'cpen') { const r = Math.round(D(comp.c, p) * 10) / 10; comp.r = Math.max(.5, Math.min(8, r)); comp.phi = ang(comp.c, p); req(); return; } }
    if (act.t === 'sweep') { if (D(comp.c, p) < cm(20)) return; const now = ang(comp.c, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; comp.phi += d; act.a1 = comp.phi; req(); } });
  const up = e => { if (!act) return; const a = act; act = null; const p = e && e.clientX != null ? at(e) : null;
    if (a.t === 'pen') { if (D(a.a, a.e) >= .2) { save(); const i = ptAt(a.a, false, true), j = ptAt(a.e, false, true); S.segs.push({ a: i, b: j }); sfx.pop(5);
        if (!a.snapE) { const nb = realPts().filter(q => D(q, a.e) > .03 && D(q, a.a) > .3).map(q => D(q, a.e)).sort((x, y) => x - y)[0]; if (nb != null && nb < .9) say2('ปลายเส้นยังไม่ถึงจุด (วงกลมกลวง) — กดย้อนกลับแล้วลากให้ปลายเส้นไปถึงจุดนะ', 3500); } }
      else { RUL.o = a.oBefore || RUL.o; } req(); check(); return; }
    if (a.t === 'sweep') { const lo = Math.min(a.a0, a.a1), hi = Math.max(a.a0, a.a1); if (hi - lo > 3) { save(); const ci = S.pts.findIndex(q => !q.mark && D([q.x, q.y], comp.c) < .03), c = ci >= 0 ? ci : ptAt(comp.c, false, true); S.arcs.push({ c, r: comp.r, a0: lo, a1: Math.min(lo + 360, hi) }); sfx.pop(6); } req(); check(); return; }
    if (a.t === 'pdown' && p) { const r = D(prot.c, p), ag = nrm(ang(prot.c, p) - prot.rot); if (r > 1.5 && r < 3.2 && ag <= 181) { save(); const deg = Math.round(Math.min(180, ag)); S.pts.push({ x: prot.c[0] + Math.cos((prot.rot + deg) * Math.PI / 180) * 2.7, y: prot.c[1] + Math.sin((prot.rot + deg) * Math.PI / 180) * 2.7, mark: true, deg }); sfx.pop(4); say2(`ทำเครื่องหมายที่ ${deg}°`, 2000); } req(); return; }
    if (a.t === 'tap' && p && e && Math.hypot(e.clientX - a.sx, e.clientY - a.sy) < 10) { const m = magnet(p, { marks: false }); save(); ptAt(m ? m.p : p); sfx.pop(3); hover = null; req(); check(); return; }
    req(); };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', () => { if (act && act.t === 'pen') { RUL.o = act.oBefore || RUL.o; RUL.th = act.th0; } act = null; req(); }); svg.addEventListener('pointerleave', () => { if (!act) { hover = null; req(); } }); svg.addEventListener('click', e => e.stopPropagation());
  /* ---------- tools ---------- */
  const TIPS = { point: 'แตะตรงไหนก็ได้จุดตรงนั้น (ใกล้จุดตัดจะดูดติดให้)', ruler: 'จับไม้บรรทัด (แถบตัวเลข) ลากเพื่อย้าย · ปุ่ม ⟳ หมุน · ลากตามขอบบน = ลากเส้น', prot: 'ลากไม้โปรแทรกเตอร์ไปวางที่จุดยอด · ปุ่ม ⟳ หมุน · แตะที่ขอบเพื่อทำเครื่องหมายมุม', comp: 'จับตัววงเวียนลากไปวางเข็มที่จุด · ลากขาดินสอเข้า-ออก = กางรัศมี · ลากขาดินสอวน (หรือหัว ⟳) = เขียนส่วนโค้ง' };
  const tb = (key, ic, lab) => h('button', { class: 'btn sm ia cnsf-t' + (tool === key ? ' on' : ''), 'data-k': key, onclick: e => { e.stopPropagation(); if (done) return; tool = key; if (key === 'prot') prot.out = true; if (key === 'comp') comp.out = true; if (key === 'ruler') RUL.out = true; resetIfLost(key); tbar.querySelectorAll('.cnsf-t').forEach(x => x.classList.toggle('on', x.dataset.k === key)); say2(TIPS[key]); req(); } }, h('span', { class: 'cns-ti ' + ic }), h('span', null, lab));
  const put = h('button', { class: 'btn sm ia cnsf-p', onclick: e => { e.stopPropagation(); if (tool === 'ruler') RUL.out = false; if (tool === 'prot') prot.out = false; if (tool === 'comp') comp.out = false; tool = 'point'; tbar.querySelectorAll('.cnsf-t').forEach(x => x.classList.toggle('on', x.dataset.k === 'point')); req(); } }, icon('check'), h('span', null, 'เก็บอุปกรณ์'));
  tbar.append(tb('point', 'tap', 'จุด'), tb('ruler', 'ruler', 'ไม้บรรทัด'), tb('prot', 'prot', 'โปรแทรกเตอร์'), tb('comp', 'compass', 'วงเวียน'), put,
    h('button', { class: 'btn sm ia cnsf-u', onclick: e => { e.stopPropagation(); if (done || !hist.length) return; S = JSON.parse(hist.pop()); sfx.page(); req(); } }, icon('undo'), h('span', null, 'ย้อนกลับ')),
    h('button', { class: 'btn sm ia cnsf-h', onclick: e => { e.stopPropagation(); if (!done) hint(); } }, icon('sparkle'), h('span', null, 'คำใบ้')));
  if (teach) tbar.append(h('button', { class: 'btn sm ia cnsf-r', onclick: e => { e.stopPropagation(); if (done) return; wrap.reveal(); try { teachDone(wrap); } catch (_) { } } }, icon('eye'), h('span', null, 'ดูเฉลย'))); // หน้าบทเรียน: ทำไม่ได้ก็ดูเฉลยแล้วไปต่อได้
  wrap.append(h('div', { class: 'cns-side' }, tbar, msg), board);
  wrap.reveal = () => { if (done) return; const xs = Object.values(E0).map(p => p[0]), ys = Object.values(E0).map(p => p[1]), off = [(BW - Math.max(...xs) - Math.min(...xs)) / 2, (BH - Math.max(...ys) - Math.min(...ys)) / 2], M = e => [e[0] + off[0], e[1] + off[1]];
    S = { pts: [], segs: [], arcs: [] }; const id = {}; Object.entries(E0).forEach(([n, e]) => { id[n] = ptAt(M(e)); });
    plan.forEach(s => { if (s.t === 'seg' && id[s.a] != null && id[s.b] != null) S.segs.push({ a: id[s.a], b: id[s.b] }); if (s.t === 'join') s.pairs.forEach(([a, b]) => S.segs.push({ a: id[a], b: id[b] })); if (s.t === 'arc') { const c = M(E0[s.c]), d = ang(c, M(s.tgtE)); S.arcs.push({ c: id[s.c], r: s.r, a0: d - 20, a1: d + 20 }); } });
    if (T.lineThru) { const [o, d] = T.lineThru, O = M(E0[o]); S.segs.push({ a: ptAt(cnsAdd(O, dir(d), D(E0.O, E0.D) + .8), false, true), b: ptAt(cnsAdd(O, dir(d), -D(E0.O, E0.B) - .8), false, true) }); }
    done = true; finish(n => M(E0[n])); req(); say2(`ดูเฉลยการสร้าง${T.name} — ตัวเลขสีส้มคือความยาวและมุมตามโจทย์`); };
  wrap._t = { S: () => S, RUL, prot, comp, X, U, frame, setTool: k => tbar.querySelector(`[data-k="${k}"]`).click(), done: () => done, rulKnob, protKnob, compPts, render };
  render(); say2('เลือกอุปกรณ์ แล้วลงมือสร้างได้เลย'); return wrap;
}
Q.cnsQ = (T, q) => ({ prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `cns ${q}`, __diff: 60, __kind: 'cns', __base: 'cns', __baseCap: 2, __baseHard: true, // งานสร้างใช้เวลานาน — ไม่เกิน 2 ข้อต่อเกม
  mount(bd, ctx) { bd.append(h('div', { class: 'colstack cns-q' }, cnsFree(T, { onOK: () => setTimeout(() => ctx.check(true), 900), onWrong: why => ctx.check(false, why) }))); } }); // v131: ทำเองทั้งหมด
const cnsPick = a => a[Math.floor(Math.random() * a.length)];
const cnsGen = {
  para: () => { const a = cnsPick([5, 6, 5.5, 6.5]), b = cnsPick([3, 3.5, 4]), th = cnsPick([60, 70, 50, 120, 110]); return Q.cnsQ(cnsPara(a, b, th, 'รูปสี่เหลี่ยมด้านขนาน'), `สร้างรูปสี่เหลี่ยมด้านขนาน ABCD ให้ AB = ${cnsF(a)} ซม. มุม A = ${th}° และ AD = ${cnsF(b)} ซม.`); },
  rect: () => { const a = cnsPick([5, 6, 5.5]), b = cnsPick([3, 3.5, 4]); return Q.cnsQ(cnsPara(a, b, 90, 'รูปสี่เหลี่ยมผืนผ้า'), `สร้างรูปสี่เหลี่ยมผืนผ้า ABCD ให้ AB = ${cnsF(a)} ซม. และ AD = ${cnsF(b)} ซม.`); },
  sq: () => { const a = cnsPick([4, 4.5, 5]); return Q.cnsQ(cnsPara(a, a, 90, 'รูปสี่เหลี่ยมจัตุรัส'), `สร้างรูปสี่เหลี่ยมจัตุรัส ABCD ยาวด้านละ ${cnsF(a)} ซม.`); },
  rhom: () => { const a = cnsPick([4, 4.5, 5]), th = cnsPick([60, 70, 120]); return Q.cnsQ(cnsPara(a, a, th, 'รูปสี่เหลี่ยมขนมเปียกปูน'), `สร้างรูปสี่เหลี่ยมขนมเปียกปูน ABCD ยาวด้านละ ${cnsF(a)} ซม. และมุม A = ${th}°`); },
  kite: () => { const s = cnsPick([3, 3.5]), L = cnsPick([5, 5.5, 6]), th = cnsPick([90, 100, 80]); return Q.cnsQ(cnsKite(s, L, th), `สร้างรูปว่าว ABCD ให้ AB = AD = ${cnsF(s)} ซม. มุม A = ${th}° และ CB = CD = ${cnsF(L)} ซม.`); },
  trap: () => { const b = cnsPick([7, 7.5, 8]), th = cnsPick([60, 70, 75]), sd = cnsPick([3.5, 4]), tp = cnsPick([3, 3.5, 4]); return Q.cnsQ(cnsTrap(b, th, sd, tp), `สร้างรูปสี่เหลี่ยมคางหมู ABCD ให้ AB = ${cnsF(b)} ซม. มุม A = ${th}° AD = ${cnsF(sd)} ซม. และ DC ขนานกับ AB ยาว ${cnsF(tp)} ซม.`); },
  dRect: () => { const d = cnsPick([6, 7]), th = cnsPick([50, 60, 120]); return Q.cnsQ(cnsDiag(d, d, th, d / 2, 'รูปสี่เหลี่ยมผืนผ้า'), `สร้างรูปสี่เหลี่ยมที่มีเส้นทแยงมุมยาว ${d} ซม. เท่ากัน แบ่งครึ่งซึ่งกันและกัน และตัดกันเป็นมุม ${th}°`); },
  dSq: () => { const d = cnsPick([6, 7]); return Q.cnsQ(cnsDiag(d, d, 90, d / 2, 'รูปสี่เหลี่ยมจัตุรัส'), `สร้างรูปสี่เหลี่ยมที่มีเส้นทแยงมุมยาว ${d} ซม. เท่ากัน แบ่งครึ่งซึ่งกันและกัน และตั้งฉากกัน`); },
  dPara: () => { const d1 = cnsPick([7, 8]), d2 = cnsPick([4, 5]), th = cnsPick([45, 60, 120]); return Q.cnsQ(cnsDiag(d1, d2, th, d1 / 2, 'รูปสี่เหลี่ยมด้านขนาน'), `สร้างรูปสี่เหลี่ยมที่มีเส้นทแยงมุม AC = ${d1} ซม. และ BD = ${d2} ซม. แบ่งครึ่งซึ่งกันและกัน ตัดกันเป็นมุม ${th}°`); },
  dRhom: () => { const d1 = cnsPick([7, 8]), d2 = cnsPick([4, 5]); return Q.cnsQ(cnsDiag(d1, d2, 90, d1 / 2, 'รูปสี่เหลี่ยมขนมเปียกปูน'), `สร้างรูปสี่เหลี่ยมที่มีเส้นทแยงมุม AC = ${d1} ซม. และ BD = ${d2} ซม. แบ่งครึ่งซึ่งกันและกันและตั้งฉากกัน`); },
  dKite: () => { const d1 = cnsPick([7, 8]), d2 = cnsPick([4, 5]), t = cnsPick([2, 2.5]); return Q.cnsQ(cnsDiag(d1, d2, 90, t, 'รูปสี่เหลี่ยมรูปว่าว'), `สร้างรูปสี่เหลี่ยมที่มีเส้นทแยงมุม AC = ${d1} ซม. และ BD = ${d2} ซม. ตั้งฉากกันที่จุด O โดย AO = ${cnsF(t)} ซม. และ O แบ่งครึ่ง BD`); } };
const q5ex = (rows, fin, say) => el => el.append(dcWalk('', rows, fin, say));
const LESSONS_P5C7 = [
  L5Q(1, 'ถ้ำสี่เหลี่ยม', 'ชนิดของรูปสี่เหลี่ยม', 'ชนิดของรูปสี่เหลี่ยม', 'จำแนกรูปสี่เหลี่ยมชนิดต่าง ๆ: จัตุรัส ผืนผ้า ขนมเปียกปูน ด้านขนาน คางหมู รูปว่าว โดยดูมุม ความยาวด้าน และการขนานกันของด้าน', [
    ...q5typePages('kind'), // v126: ทีละชนิด คนละหน้า (เดิม: ลากเปลี่ยนรูปอิสระ)
    T('ตัวอย่างทีละขั้น: ถามตัวเองทีละข้อ', 'ตัวอย่างทีละขั้น ถามตัวเองทีละข้อ', q5ex([['① ด้านขนานกันกี่คู่?', '2 คู่ → กลุ่มด้านขนาน · 1 คู่ → คางหมู · 0 คู่ → ดูข้อ ④'], ['② มุมฉากทุกมุม?', 'ใช่ → จัตุรัส (ด้านเท่ากันหมด) หรือ ผืนผ้า'], ['③ ไม่มีมุมฉาก', 'ด้านเท่ากันหมด → ขนมเปียกปูน · ไม่เท่า → ด้านขนาน'], ['④ ไม่มีด้านขนาน', 'ด้านติดกันยาวเท่ากัน 2 คู่ → รูปว่าว']], 'ดู <b>ด้านขนาน → มุมฉาก → ความยาวด้าน</b>', 'ดูด้านขนาน มุมฉาก และความยาวด้าน'))],
    () => [...['sq', 'rect', 'rhom', 'para', 'trap', 'kite'].sort(() => Math.random() - .5).slice(0, 4).map(k => q5clsQ(k, pick([-20, -10, 15, 25]))), ...pkF(Q5_TF, 2).map(q5tf)]),
  L5Q(2, 'ถ้ำเส้นทแยง', 'เส้นทแยงมุมของรูปสี่เหลี่ยม', 'เส้นทแยงมุม', 'บอกสมบัติของเส้นทแยงมุมของรูปสี่เหลี่ยมชนิดต่าง ๆ: ยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน ตั้งฉากกัน', [
    ...q5typePages('diag'), // v126: ทีละชนิด คนละหน้า (เดิม: ลากเปลี่ยนรูปอิสระ)
    T('ตัวอย่างทีละขั้น: สรุปสมบัติ', 'ตัวอย่างทีละขั้น สรุปสมบัติ', q5ex([['ผืนผ้า', Q5D.rect], ['จัตุรัส', Q5D.sq], ['ขนมเปียกปูน', Q5D.rhom], ['ด้านขนาน', Q5D.para], ['รูปว่าว', Q5D.kite]], 'เส้นทแยงมุม = ส่วนของเส้นตรงที่เชื่อมจุดยอดที่ไม่อยู่ติดกัน (มี 2 เส้น)', 'รูปสี่เหลี่ยมมีเส้นทแยงมุมสองเส้น'))],
    () => [...['rect', 'sq', 'rhom', 'para', 'kite'].sort(() => Math.random() - .5).slice(0, 4).map(q5diagQ), Q.dPick({ q: 'รูปสี่เหลี่ยมมีเส้นทแยงมุมกี่เส้น', opts: ['2 เส้น', '4 เส้น', '1 เส้น'], right: '2 เส้น' }),
      Q.dPick({ q: 'รูปสี่เหลี่ยมใดมีเส้นทแยงมุม<b>ยาวเท่ากัน</b>และ<b>ตั้งฉากกัน</b>', opts: ['รูปสี่เหลี่ยมจัตุรัส', 'รูปสี่เหลี่ยมผืนผ้า', 'รูปสี่เหลี่ยมด้านขนาน'], right: 'รูปสี่เหลี่ยมจัตุรัส' })]),
  L5Q(3, 'ถ้ำสมบัติ', 'สมบัติของรูปสี่เหลี่ยมชนิดต่าง ๆ', 'สมบัติรูปสี่เหลี่ยม', 'บอกสมบัติของรูปสี่เหลี่ยมแต่ละชนิด และเห็นความสัมพันธ์ เช่น จัตุรัสเป็นทั้งผืนผ้าและขนมเปียกปูน', [
    ...q5typePages('prop'), // v126: ทีละชนิด คนละหน้า (เดิม: ลากเปลี่ยนรูปอิสระ)
    T('ตัวอย่างทีละขั้น: ความสัมพันธ์', 'ตัวอย่างทีละขั้น ความสัมพันธ์', q5ex([['ด้านขนาน', 'ด้านตรงข้ามขนานกันและยาวเท่ากัน 2 คู่ มุมตรงข้ามเท่ากัน'], ['+ มุมฉาก', 'กลายเป็นผืนผ้า'], ['+ ด้านเท่ากันหมด', 'กลายเป็นขนมเปียกปูน'], ['+ ทั้งสองอย่าง', 'กลายเป็นจัตุรัส']], 'จัตุรัส ผืนผ้า ขนมเปียกปูน เป็นรูปสี่เหลี่ยมด้านขนานทั้งหมด', 'จัตุรัส ผืนผ้า ขนมเปียกปูน เป็นรูปสี่เหลี่ยมด้านขนาน'))],
    () => [...pkF(Q5_TF, 4).map(q5tf), Q.dPick({ q: 'รูปสี่เหลี่ยมชนิดใดมีมุมทุกมุมเป็นมุมฉาก', opts: ['สี่เหลี่ยมผืนผ้า สี่เหลี่ยมจัตุรัส', 'สี่เหลี่ยมจัตุรัส สี่เหลี่ยมขนมเปียกปูน', 'สี่เหลี่ยมคางหมู สี่เหลี่ยมผืนผ้า'], right: 'สี่เหลี่ยมผืนผ้า สี่เหลี่ยมจัตุรัส' }),
      Q.dPick({ q: 'รูปสี่เหลี่ยมชนิดใดมีด้านทุกด้านยาวเท่ากัน', opts: ['สี่เหลี่ยมขนมเปียกปูน สี่เหลี่ยมจัตุรัส', 'สี่เหลี่ยมผืนผ้า สี่เหลี่ยมขนมเปียกปูน', 'สี่เหลี่ยมด้านขนาน สี่เหลี่ยมจัตุรัส'], right: 'สี่เหลี่ยมขนมเปียกปูน สี่เหลี่ยมจัตุรัส' })]),
  L5Q(4, 'ถ้ำสร้างด้านขนาน', 'การสร้างรูปสี่เหลี่ยมด้านขนานชนิดต่าง ๆ เมื่อกำหนดความยาวของด้านและขนาดของมุม', 'สร้างด้านขนาน', 'สร้างรูปสี่เหลี่ยมด้านขนาน ผืนผ้า จัตุรัส ขนมเปียกปูน เมื่อกำหนดความยาวของด้านและขนาดของมุม', [
    T('ปรับความยาวด้านและมุม A — มุม 90° หรือด้านเท่ากันจะได้รูปอะไร?', 'ปรับความยาวด้านและมุมเอ มุมเก้าสิบองศาหรือด้านเท่ากันจะได้รูปอะไร', el => el.append(simQuadBuild('para'))),
    T('ขั้นตอนการสร้าง (AB 5 ซม. · มุม A 60° · AD 3 ซม.)', 'ขั้นตอนการสร้าง', el => el.append(q5cons('para'))),
    T('<b>ลองสร้างจริง</b>: สร้างรูปสี่เหลี่ยมด้านขนาน ABCD ให้ AB = 5 ซม. มุม A = 60° และ AD = 3 ซม. — เลือกอุปกรณ์เอง ติดตรงไหนกด <b>คำใบ้</b>', 'ลองสร้างจริง สร้างรูปสี่เหลี่ยมด้านขนาน เอบีซีดี ให้ เอบี ยาวห้าเซนติเมตร มุมเอ หกสิบองศา และ เอดี ยาวสามเซนติเมตร เลือกอุปกรณ์เอง ติดตรงไหนกดคำใบ้', el => el.append(cnsFree(cnsPara(5, 3, 60, 'รูปสี่เหลี่ยมด้านขนาน'))))],
    () => [...([Q.hNum({ q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มีมุมหนึ่งขนาด 135° มุมที่อยู่ติดกันมีขนาดกี่องศา', head: '<span class="fsign">?</span> องศา', a: 45, hint: 'มุมที่อยู่ติดกันรวมกัน 180°' }),
      Q.hNum({ q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มีมุม A = 70° มุม C มีขนาดกี่องศา', head: '<span class="fsign">?</span> องศา', a: 70, hint: 'มุมตรงข้ามเท่ากัน' }),
      Q.dPick({ q: 'สร้างรูปสี่เหลี่ยมมุมฉาก ABCD ยาวด้านละ 3.8 ซม. จะได้รูปใด', opts: ['รูปสี่เหลี่ยมจัตุรัส', 'รูปสี่เหลี่ยมผืนผ้า', 'รูปสี่เหลี่ยมขนมเปียกปูน'], right: 'รูปสี่เหลี่ยมจัตุรัส' }),
      Q.t6Num({ q: 'รูปสี่เหลี่ยมขนมเปียกปูนยาวด้านละ 4.2 ซม. ด้านที่อยู่ตรงข้ามกันห่างกัน 2.8 ซม. มีพื้นที่กี่ตารางเซนติเมตร', a: '11.76', unit: 'ตร.ซม.', hint: '4.2 × 2.8' }),
      Q.dPick({ q: 'การสร้างรูปสี่เหลี่ยมด้านขนาน หลังลากด้าน AB และ AD แล้ว ขั้นต่อไปคือข้อใด', opts: ['เขียนส่วนโค้งจาก D และ B ให้ตัดกันที่ C', 'วัดมุม 90° ที่ B', 'ลากเส้นทแยงมุม BD'], right: 'เขียนส่วนโค้งจาก D และ B ให้ตัดกันที่ C' })]), cnsGen.para(), cnsGen.rect(), cnsGen.sq(), cnsGen.rhom()]), // v127: สร้างจริงด้วยไม้บรรทัด ไม้โปรแทรกเตอร์ วงเวียน
  L5Q(5, 'ถ้ำว่าว', 'การสร้างรูปสี่เหลี่ยมรูปว่าว เมื่อกำหนดความยาวของด้านและขนาดของมุม', 'สร้างรูปว่าว', 'สร้างรูปสี่เหลี่ยมรูปว่าวเมื่อกำหนดความยาวด้านสั้น ด้านยาว และขนาดของมุมยอด', [
    T('ปรับด้านสั้น ด้านยาว และมุมยอด — ถ้าด้านยาวสั้นเกินไปจะสร้างได้ไหม?', 'ปรับด้านสั้น ด้านยาว และมุมยอด ถ้าด้านยาวสั้นเกินไปจะสร้างได้ไหม', el => el.append(simQuadBuild('kite'))),
    T('ขั้นตอนการสร้าง (AB = AD = 3 ซม. · มุม A 100° · CB = CD = 5 ซม.)', 'ขั้นตอนการสร้าง', el => el.append(q5cons('kite'))),
    T('<b>ลองสร้างจริง</b>: รูปว่าว ABCD ให้ AB = AD = 3 ซม. มุม A = 100° และ CB = CD = 5 ซม. — ติดตรงไหนกด <b>คำใบ้</b>', 'ลองสร้างรูปว่าวจริง ติดตรงไหนกดคำใบ้', el => el.append(cnsFree(cnsKite(3, 5, 100))))],
    () => [...([Q.dPick({ q: 'รูปว่าวมีด้านที่ยาวเท่ากันอย่างไร', opts: ['ด้านที่อยู่ติดกันยาวเท่ากัน 2 คู่', 'ด้านตรงข้ามยาวเท่ากัน 2 คู่', 'ด้านทุกด้านยาวเท่ากัน'], right: 'ด้านที่อยู่ติดกันยาวเท่ากัน 2 คู่' }),
      Q.dPick({ q: 'สร้างรูปว่าว ABCD ที่ AB = AD = 4 ซม. และ CB = CD = 4 ซม. จะได้รูปใด', opts: ['รูปสี่เหลี่ยมขนมเปียกปูน (หรือจัตุรัส)', 'รูปสี่เหลี่ยมคางหมู', 'รูปสี่เหลี่ยมผืนผ้า'], right: 'รูปสี่เหลี่ยมขนมเปียกปูน (หรือจัตุรัส)', hint: 'ด้านทุกด้านยาวเท่ากัน' }),
      Q.dPick({ q: 'การสร้างรูปว่าว หาจุดยอดสุดท้ายด้วยอุปกรณ์ใด', opts: ['วงเวียน', 'ไม้ฉาก', 'ไม้โปรแทรกเตอร์'], right: 'วงเวียน' }),
      q5clsQ('kite', 15), q5clsQ('kite2', -10), Q.t6Num({ q: 'รูปว่าว ABCD มี AB = AD = 3 ซม. และ CB = CD = 5 ซม. ความยาวรอบรูปเท่ากับกี่เซนติเมตร', a: '16', unit: 'ซม.', hint: '3 + 3 + 5 + 5' })]), cnsGen.kite(), cnsGen.kite()]), // v127: สร้างจริงด้วยไม้บรรทัด ไม้โปรแทรกเตอร์ วงเวียน
  L5Q(6, 'ถ้ำคางหมู', 'การสร้างรูปสี่เหลี่ยมคางหมู และรูปสี่เหลี่ยมใด ๆ เมื่อกำหนดความยาวของด้านและขนาดของมุม', 'สร้างคางหมู', 'สร้างรูปสี่เหลี่ยมคางหมูและรูปสี่เหลี่ยมใด ๆ เมื่อกำหนดความยาวของด้านและขนาดของมุม', [
    T('ปรับฐาน ด้านบน ความสูง และตำแหน่งด้านบน — ด้านบนยาวเท่าฐานจะเป็นอะไร?', 'ปรับฐาน ด้านบน ความสูง และตำแหน่งด้านบน ด้านบนยาวเท่าฐานจะเป็นอะไร', el => el.append(simQuadBuild('trap'))),
    T('ขั้นตอนการสร้าง (AB 6 ซม. · มุม A 60° · AD 3 ซม. · DC 3 ซม. ขนานกับ AB)', 'ขั้นตอนการสร้าง', el => el.append(q5cons('trap'))),
    T('<b>ลองสร้างจริง</b>: คางหมู ABCD ให้ AB = 7 ซม. มุม A = 65° AD = 4 ซม. และ DC ขนานกับ AB ยาว 3.5 ซม. — ติดตรงไหนกด <b>คำใบ้</b>', 'ลองสร้างคางหมูจริง ติดตรงไหนกดคำใบ้', el => el.append(cnsFree(cnsTrap(7, 65, 4, 3.5))))],
    () => [...([Q.hNum({ q: 'รูปสี่เหลี่ยมคางหมู OPQR มีด้านขนาน OP ยาว 5 ซม. และ RQ ยาวกว่า OP อยู่ 3 ซม. RQ ยาวกี่เซนติเมตร', head: '<span class="fsign">?</span> ซม.', a: 8 }),
      Q.dPick({ q: 'การสร้างรูปสี่เหลี่ยมคางหมู ต้องลากเส้นใดให้ขนานกับฐาน', opts: ['ด้านบน (ด้านตรงข้ามฐาน)', 'เส้นทแยงมุม', 'ด้านเอียง'], right: 'ด้านบน (ด้านตรงข้ามฐาน)' }),
      q5clsQ('trap', 0), q5clsQ('trap2', 20), q5clsQ('para', -15), Q.t6Num({ q: 'รูปสี่เหลี่ยมคางหมู ABCD มี AB ขนานกับ DC และมุม A = 65° มุม D มีขนาดกี่องศา', a: '115', unit: 'องศา', hint: 'มุม A + มุม D = 180°' })]), cnsGen.trap(), cnsGen.trap()]), // v127: สร้างจริงด้วยไม้บรรทัด ไม้โปรแทรกเตอร์ วงเวียน
  L5Q(7, 'ถ้ำทแยงเท่ากัน', 'การสร้างรูปสี่เหลี่ยมที่กำหนดความยาวของเส้นทแยงมุม เส้นทแยงมุมยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน', 'ทแยงยาวเท่า แบ่งครึ่ง', 'สร้างรูปสี่เหลี่ยมจากเส้นทแยงมุมที่ยาวเท่ากันและแบ่งครึ่งซึ่งกันและกัน (ได้ผืนผ้าหรือจัตุรัส)', [
    T('ปรับความยาวเส้นทแยงมุมและมุมที่จุดตัด — มุม 90° จะได้รูปอะไร?', 'ปรับความยาวเส้นทแยงมุมและมุมที่จุดตัด มุมเก้าสิบองศาจะได้รูปอะไร', el => el.append(simQuadBuild('dEq'))),
    T('ขั้นตอนการสร้าง (เส้นทแยงมุมยาว 6 ซม. ทำมุม 60°)', 'ขั้นตอนการสร้าง', el => el.append(q5cons('dEq'))),
    T('<b>ลองสร้างจริง</b>: เส้นทแยงมุม AC = BD = 6 ซม. แบ่งครึ่งซึ่งกันและกัน ตัดกันเป็นมุม 60° — ติดตรงไหนกด <b>คำใบ้</b>', 'ลองสร้างจริง เส้นทแยงมุมยาวหกเซนติเมตรเท่ากัน แบ่งครึ่งซึ่งกันและกัน ตัดกันเป็นมุมหกสิบองศา', el => el.append(cnsFree(cnsDiag(6, 6, 60, 3, 'รูปสี่เหลี่ยมผืนผ้า'))))],
    () => [...([Q.dPick({ q: 'เส้นทแยงมุมยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน แต่ไม่ตั้งฉากกัน จะได้รูปใด', opts: ['รูปสี่เหลี่ยมผืนผ้า', 'รูปสี่เหลี่ยมจัตุรัส', 'รูปสี่เหลี่ยมรูปว่าว'], right: 'รูปสี่เหลี่ยมผืนผ้า' }),
      Q.dPick({ q: 'เส้นทแยงมุมยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน และตั้งฉากกัน จะได้รูปใด', opts: ['รูปสี่เหลี่ยมจัตุรัส', 'รูปสี่เหลี่ยมผืนผ้า', 'รูปสี่เหลี่ยมขนมเปียกปูน'], right: 'รูปสี่เหลี่ยมจัตุรัส' }),
      Q.t6Num({ q: 'สร้างรูปสี่เหลี่ยมผืนผ้าที่มีเส้นทแยงมุมยาว 7 ซม. จุดตัดของเส้นทแยงมุมอยู่ห่างจากจุดยอดแต่ละจุดกี่เซนติเมตร', a: '3.5', unit: 'ซม.', hint: 'แบ่งครึ่ง 7 ÷ 2' }),
      Q.dPick({ q: 'รูปสี่เหลี่ยมจัตุรัสที่มีเส้นทแยงมุมยาว 6 ซม. เส้นทแยงมุมอีกเส้นยาวเท่าใด', opts: ['6 ซม.', '3 ซม.', '12 ซม.'], right: '6 ซม.' })]), cnsGen.dRect(), cnsGen.dSq()]), // v127: สร้างจริงด้วยไม้บรรทัด ไม้โปรแทรกเตอร์ วงเวียน
  L5Q(8, 'ถ้ำแบ่งครึ่ง', 'การสร้างรูปสี่เหลี่ยมที่กำหนดความยาวของเส้นทแยงมุม เส้นทแยงมุมแบ่งครึ่งซึ่งกันและกัน', 'ทแยงแบ่งครึ่งกัน', 'สร้างรูปสี่เหลี่ยมจากเส้นทแยงมุมที่แบ่งครึ่งซึ่งกันและกัน (ได้รูปสี่เหลี่ยมด้านขนาน)', [
    T('ปรับ AC, BD และมุม — แบ่งครึ่งกันเสมอ ได้รูปอะไรบ้าง?', 'ปรับเอซี บีดี และมุม แบ่งครึ่งกันเสมอ ได้รูปอะไรบ้าง', el => el.append(simQuadBuild('dBis'))),
    T('ขั้นตอนการสร้าง (AC 7 ซม. · BD 4 ซม. · มุม 50°)', 'ขั้นตอนการสร้าง', el => el.append(q5cons('dBis'))),
    T('<b>ลองสร้างจริง</b>: เส้นทแยงมุม AC = 7 ซม. BD = 4 ซม. แบ่งครึ่งซึ่งกันและกัน ตัดกันเป็นมุม 60° — ติดตรงไหนกด <b>คำใบ้</b>', 'ลองสร้างจริง เส้นทแยงมุมแบ่งครึ่งซึ่งกันและกัน', el => el.append(cnsFree(cnsDiag(7, 4, 60, 3.5, 'รูปสี่เหลี่ยมด้านขนาน'))))],
    () => [...([Q.t6Num({ q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มีเส้นทแยงมุมยาว 5.5 ซม. และ 10.1 ซม. ตัดกันที่ O ส่วนที่สั้นที่สุดจาก O ถึงจุดยอดยาวกี่เซนติเมตร', a: '2.75', unit: 'ซม.', hint: '5.5 ÷ 2' }),
      Q.hNum({ q: 'รูปสี่เหลี่ยมด้านขนาน OPQR มีมุมที่จุดตัดของเส้นทแยงมุมมุมหนึ่งขนาด 73° มุมที่อยู่ติดกันที่จุดตัดมีขนาดกี่องศา', head: '<span class="fsign">?</span> องศา', a: 107, hint: '180 − 73' }),
      Q.dPick({ q: 'เส้นทแยงมุมแบ่งครึ่งซึ่งกันและกัน และตั้งฉากกัน แต่ยาวไม่เท่ากัน จะได้รูปใด', opts: ['รูปสี่เหลี่ยมขนมเปียกปูน', 'รูปสี่เหลี่ยมผืนผ้า', 'รูปสี่เหลี่ยมคางหมู'], right: 'รูปสี่เหลี่ยมขนมเปียกปูน' }),
      Q.dPick({ q: 'เส้นทแยงมุมแบ่งครึ่งซึ่งกันและกัน ยาวไม่เท่ากัน ไม่ตั้งฉาก จะได้รูปใด', opts: ['รูปสี่เหลี่ยมด้านขนาน', 'รูปสี่เหลี่ยมรูปว่าว', 'รูปสี่เหลี่ยมจัตุรัส'], right: 'รูปสี่เหลี่ยมด้านขนาน' })]), cnsGen.dPara(), cnsGen.dPara()]), // v127: สร้างจริงด้วยไม้บรรทัด ไม้โปรแทรกเตอร์ วงเวียน
  L5Q(9, 'ถ้ำตั้งฉาก', 'การสร้างรูปสี่เหลี่ยมที่กำหนดความยาวของเส้นทแยงมุม โดยเส้นทแยงมุมตัดกันเป็นมุมฉาก', 'ทแยงตั้งฉาก', 'สร้างรูปสี่เหลี่ยมจากเส้นทแยงมุมที่ตัดกันเป็นมุมฉาก (ได้รูปว่าว ขนมเปียกปูน หรือจัตุรัส)', [
    T('เส้นทแยงมุมตั้งฉากเสมอ — เลื่อนจุดตัดบน AC ดูว่าได้รูปอะไร', 'เส้นทแยงมุมตั้งฉากเสมอ เลื่อนจุดตัดบนเอซี ดูว่าได้รูปอะไร', el => el.append(simQuadBuild('dPerp'))),
    T('ขั้นตอนการสร้าง (AC 6 ซม. · BD 4 ซม. ตั้งฉากที่ O ห่าง A 2 ซม.)', 'ขั้นตอนการสร้าง', el => el.append(q5cons('dPerp'))),
    T('<b>ลองสร้างจริง</b>: เส้นทแยงมุม AC = 7 ซม. BD = 4 ซม. ตั้งฉากกันที่ O โดย AO = 2 ซม. และ O แบ่งครึ่ง BD — ติดตรงไหนกด <b>คำใบ้</b>', 'ลองสร้างจริง เส้นทแยงมุมตั้งฉากกัน', el => el.append(cnsFree(cnsDiag(7, 4, 90, 2, 'รูปสี่เหลี่ยมรูปว่าว'))))],
    () => [...([Q.dPick({ q: 'เส้นทแยงมุมตั้งฉากกัน BD ถูกแบ่งครึ่ง แต่ AC ไม่ถูกแบ่งครึ่ง จะได้รูปใด', opts: ['รูปสี่เหลี่ยมรูปว่าว', 'รูปสี่เหลี่ยมขนมเปียกปูน', 'รูปสี่เหลี่ยมด้านขนาน'], right: 'รูปสี่เหลี่ยมรูปว่าว' }),
      Q.dPick({ q: 'รูปว่าว ABCD มีเส้นทแยงมุมยาว 8 ซม. และ 8.7 ซม. เส้นทแยงมุมทั้งสองตัดกันเป็นมุมกี่องศา', opts: ['90°', '36°', '180°'], right: '90°' }),
      Q.dPick({ q: 'เลื่อนจุดตัดให้อยู่กึ่งกลางของเส้นทแยงมุมทั้งสอง (ยาวไม่เท่ากัน) จะได้รูปใด', opts: ['รูปสี่เหลี่ยมขนมเปียกปูน', 'รูปสี่เหลี่ยมรูปว่าว', 'รูปสี่เหลี่ยมผืนผ้า'], right: 'รูปสี่เหลี่ยมขนมเปียกปูน' }),
      q5diagQ('kite'), q5diagQ('rhom')]), cnsGen.dKite(), cnsGen.dRhom()]), // v127: สร้างจริงด้วยไม้บรรทัด ไม้โปรแทรกเตอร์ วงเวียน
  L5Q(10, 'ถ้ำฐานและสูง', 'ความยาวของฐานและความสูงของรูปสี่เหลี่ยมด้านขนาน', 'ฐานและความสูง', 'บอกฐานและความสูงที่คู่กันของรูปสี่เหลี่ยมด้านขนาน (ความสูงต้องตั้งฉากกับฐาน)', [
    T('เลือกด้านที่จะใช้เป็นฐาน — ความสูงที่คู่กันเปลี่ยนไป แต่พื้นที่เท่าเดิม', 'เลือกด้านที่จะใช้เป็นฐาน ความสูงที่คู่กันเปลี่ยนไป แต่พื้นที่เท่าเดิม', el => el.append(simParaBase())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', q5ex([['① เลือกฐาน', 'ด้านใดก็ได้ เช่น ด้านล่างยาว 8 ซม.'], ['② ความสูง', 'ระยะตั้งฉากระหว่างฐานกับด้านที่ขนานกับฐาน = 3 ซม.'], ['③ ด้านเอียง', 'ยาว 4 ซม. — ไม่ใช่ความสูง เพราะไม่ตั้งฉากกับฐาน']], 'ฐาน 8 ซม. คู่กับความสูง 3 ซม.', 'ฐานแปดเซนติเมตร คู่กับความสูงสามเซนติเมตร'))],
    () => [Q.c8Pick({ fig: Q5W_PARA[0].fig, q: 'ความสูงที่คู่กับฐาน DC ยาวเท่าใด', opts: ['2.5 ซม.', '2.9 ซม.', '6 ซม.'], right: '2.5 ซม.', hint: 'ความสูงต้องตั้งฉากกับฐาน' }),
      Q.c8Pick({ fig: Q5W_PARA[2].fig, q: 'ฐาน UV ยาวเท่าใด และความสูงที่คู่กันยาวเท่าใด', opts: ['ฐาน 5 ซม. สูง 7 ซม.', 'ฐาน 5 ซม. สูง 7.6 ซม.', 'ฐาน 7 ซม. สูง 5 ซม.'], right: 'ฐาน 5 ซม. สูง 7 ซม.' }),
      Q.c8Pick({ fig: Q5W_PARA[3].fig, q: 'ความสูงที่คู่กับฐานยาว 7.2 ม. ยาวเท่าใด', opts: ['2.5 ม.', '3.5 ม.', '7.2 ม.'], right: '2.5 ม.' }),
      Q.dPick({ q: 'ความสูงของรูปสี่เหลี่ยมด้านขนาน คือข้อใด', opts: ['ระยะห่างตั้งฉากระหว่างฐานกับด้านที่ขนานกับฐาน', 'ความยาวของด้านเอียง', 'ความยาวของเส้นทแยงมุม'], right: 'ระยะห่างตั้งฉากระหว่างฐานกับด้านที่ขนานกับฐาน' }),
      Q.dPick({ q: 'รูปสี่เหลี่ยมด้านขนาน 1 รูป เลือกด้านเป็นฐานแล้วได้ความสูงต่างกันได้กี่แบบ', opts: ['2 แบบ', '1 แบบ', '4 แบบ'], right: '2 แบบ', hint: 'ด้านตรงข้ามขนานกัน 2 คู่' })]),
  L5Q(11, 'ถ้ำตัดต่อ', 'สูตรการหาพื้นที่ของรูปสี่เหลี่ยมด้านขนาน', 'สูตรพื้นที่ด้านขนาน', 'หาสูตรพื้นที่รูปสี่เหลี่ยมด้านขนาน = ฐาน × สูง โดยตัดและย้ายส่วนสามเหลี่ยมให้เป็นรูปสี่เหลี่ยมผืนผ้า', [
    T('ปรับฐาน สูง ความเอียง แล้วกด<b>ตัดแล้วย้าย</b>', 'ปรับฐาน สูง ความเอียง แล้วกดตัดแล้วย้าย', el => el.append(simParaArea())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', q5ex([['① ตัด', 'ตัดสามเหลี่ยมตามแนวความสูง'], ['② ย้าย', 'นำไปต่ออีกด้านหนึ่ง ได้รูปสี่เหลี่ยมผืนผ้า'], ['③ เทียบ', 'ด้านยาวของผืนผ้า = ฐาน · ด้านกว้าง = ความสูง'], ['④ สูตร', 'พื้นที่ = ฐาน × สูง เช่น 7 × 4 = 28 ตร.ซม.']], 'พื้นที่รูปสี่เหลี่ยมด้านขนาน = <b>ฐาน × สูง</b>', 'พื้นที่เท่ากับฐานคูณสูง'))],
    () => [...Q5W_PARA.slice(0, 4).map(o => q5num(o, 'หาพื้นที่ของรูปสี่เหลี่ยมด้านขนาน')), Q.dPick({ q: 'สูตรพื้นที่ของรูปสี่เหลี่ยมด้านขนานคือข้อใด', opts: ['ฐาน × สูง', 'ฐาน × ด้านเอียง', '½ × ฐาน × สูง'], right: 'ฐาน × สูง' })]),
  L5Q(12, 'ถ้ำพื้นที่ขนาน', 'การหาพื้นที่ของรูปสี่เหลี่ยมด้านขนาน', 'พื้นที่ด้านขนาน', 'หาพื้นที่ของรูปสี่เหลี่ยมด้านขนานจากฐานและความสูงที่คู่กัน (รวมกรณีความสูงอยู่นอกรูป) และหาฐานหรือความสูงเมื่อรู้พื้นที่', [
    T('ปรับรูปและดูว่าพื้นที่ขึ้นกับอะไร (ความเอียงไม่มีผล)', 'ปรับรูปและดูว่าพื้นที่ขึ้นกับอะไร ความเอียงไม่มีผล', el => el.append(simParaArea())),
    T('ตัวอย่างทีละขั้น: หาความสูงจากพื้นที่', 'ตัวอย่างทีละขั้น หาความสูงจากพื้นที่', q5ex([['โจทย์', 'รูปสี่เหลี่ยมด้านขนานมีพื้นที่ 42 ตร.ซม. ฐานยาว 7 ซม. สูงเท่าใด'], ['① สูตร', 'ฐาน × สูง = 42'], ['② หาร', 'สูง = 42 ÷ 7 = 6']], 'สูง <b>6 ซม.</b>', 'สูงหกเซนติเมตร'))],
    () => [...Q5W_PARA.slice(4).map(o => q5num(o, 'หาพื้นที่ของรูปสี่เหลี่ยมด้านขนาน'))]),
  L5Q(13, 'ถ้ำขนมเปียกปูน', 'การหาพื้นที่ของรูปสี่เหลี่ยมขนมเปียกปูน โดยใช้ความรู้เรื่องพื้นที่ของรูปสี่เหลี่ยมด้านขนาน', 'พื้นที่ขนมเปียกปูน', 'หาพื้นที่ของรูปสี่เหลี่ยมขนมเปียกปูน = ฐาน × สูง (เพราะเป็นรูปสี่เหลี่ยมด้านขนาน)', [
    T('ปรับความยาวด้านและความสูง — ตัดแล้วย้ายได้ผืนผ้าเหมือนกัน', 'ปรับความยาวด้านและความสูง ตัดแล้วย้ายได้ผืนผ้าเหมือนกัน', el => el.append(simParaArea(true))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', q5ex([['① ฐาน', 'ด้านทุกด้านยาว 5 ซม. → ฐาน 5 ซม.'], ['② ความสูง', 'ระยะห่างระหว่างด้านที่ขนานกัน 4 ซม.'], ['③ พื้นที่', '5 × 4 = 20 ตร.ซม.']], 'พื้นที่ขนมเปียกปูน = ฐาน × สูง', 'พื้นที่เท่ากับฐานคูณสูง'))],
    () => pkF(Q5W_RHOM, 6).map(o => q5num(o, 'หาพื้นที่ของรูปสี่เหลี่ยมขนมเปียกปูน'))),
  L5Q(14, 'ถ้ำคางหมูคู่', 'การหาพื้นที่ของรูปสี่เหลี่ยมคางหมูโดยใช้ความรู้เรื่องพื้นที่ของรูปสี่เหลี่ยมด้านขนาน', 'พื้นที่คางหมู', 'หาพื้นที่รูปสี่เหลี่ยมคางหมู: นำ 2 รูปมาต่อกันเป็นรูปสี่เหลี่ยมด้านขนาน → ½ × (ผลบวกด้านคู่ขนาน) × สูง', [
    T('ปรับด้านคู่ขนานและความสูง แล้วหมุนอีกรูปมาต่อ', 'ปรับด้านคู่ขนานและความสูง แล้วหมุนอีกรูปมาต่อ', el => el.append(simTrap())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', q5ex([['① ต่อ 2 รูป', 'ได้รูปสี่เหลี่ยมด้านขนาน ฐาน = 3 + 9 = 12 ซม. สูง 5 ซม.'], ['② พื้นที่ 2 รูป', '12 × 5 = 60 ตร.ซม.'], ['③ 1 รูป', '60 ÷ 2 = 30 ตร.ซม.']], 'คางหมู = ½ × (ด้านบน + ด้านล่าง) × สูง', 'ครึ่งหนึ่งของผลบวกด้านคู่ขนานคูณสูง'))],
    () => [...Q5W_TRAP.map(o => q5num(o, 'หาพื้นที่ของรูปสี่เหลี่ยมคางหมู')), Q.dPick({ q: 'นำรูปสี่เหลี่ยมคางหมูที่เท่ากัน 2 รูปมาต่อกัน จะได้รูปใด', opts: ['รูปสี่เหลี่ยมด้านขนาน', 'รูปสี่เหลี่ยมรูปว่าว', 'รูปสามเหลี่ยม'], right: 'รูปสี่เหลี่ยมด้านขนาน' })]),
  L5Q(15, 'ถ้ำรูปประกอบ', 'การหาพื้นที่ของรูปหลายเหลี่ยมโดยใช้ความรู้เรื่องพื้นที่ของรูปสี่เหลี่ยมด้านขนาน', 'พื้นที่รูปหลายเหลี่ยม', 'หาพื้นที่ของรูปหลายเหลี่ยมโดยแบ่งเป็นรูปสี่เหลี่ยมผืนผ้าและรูปสี่เหลี่ยมด้านขนาน หรือเติมแล้วลบ', [
    T('ลองแบ่งรูปเดียวกัน <b>3 วิธี</b> — ได้พื้นที่เท่ากัน', 'ลองแบ่งรูปเดียวกันสามวิธี ได้พื้นที่เท่ากัน', el => el.append(simCompose())),
    T('ตัวอย่างทีละขั้น: ผืนผ้า + ด้านขนาน', 'ตัวอย่างทีละขั้น', el => el.append(h('div', { class: 'colstack' }, h('div', { class: 't6-board sm', html: polySVG([[0, 0], [6, 0], [6, 2], [9, 5], [3, 5], [0, 2]], { fit: true, W: 380, H: 220, fill: '#9BE3E0', sides: ['6 ซม.', '2 ซม.', null, '6 ซม.', null, '2 ซม.'], segs: [{ a: [0, 2], b: [6, 2], col: '#9790B0', w: 1.6 }, { a: [3, 5], b: [3, 2], label: '3 ซม.', off: -16, col: '#E5487A' }] }) }),
      dcWalk('', [['① ผืนผ้าล่าง', '6 × 2 = 12'], ['② ด้านขนานบน', 'ฐาน 6 สูง 3 → 6 × 3 = 18'], ['③ รวม', '12 + 18 = 30']], 'พื้นที่ = <b>30 ตร.ซม.</b>', 'สามสิบตารางเซนติเมตร'))))],
    () => Q5W_COMP.map(o => q5num(o))),
  L5Q(16, 'ฐานโจทย์รอบรูป', 'การแก้โจทย์ปัญหาเกี่ยวกับความยาวรอบรูปของรูปสี่เหลี่ยม', 'โจทย์รอบรูป', 'แก้โจทย์ปัญหาความยาวรอบรูปของรูปสี่เหลี่ยม เช่น ล้อมรั้ว หาความยาวด้าน คิดราคา', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('ลานรูปสี่เหลี่ยมด้านขนาน มีด้านยาว 15 เมตร และ 9 เมตร ติดไฟรอบลาน 2 รอบ ต้องใช้สายไฟกี่เมตร', [{ q: 'ความยาวรอบรูป', opts: ['(15 + 9) × 2', '15 × 9', '15 + 9'], right: '(15 + 9) × 2', unit: 'เมตร', why: 'ด้านตรงข้ามยาวเท่ากัน' }, { q: 'ติด 2 รอบ', opts: ['48 × 2', '48 + 2', '48 ÷ 2'], right: '48 × 2', unit: 'เมตร', why: 'รอบละ 48 เมตร' }], 'ตอบ <b>96</b> เมตร'))),
    T('ตัวอย่างทีละขั้น: หาความยาวด้าน', 'ตัวอย่างทีละขั้น หาความยาวด้าน', el => el.append(dcStory('รูปสี่เหลี่ยมผืนผ้ายาวรอบรูป 50 เซนติเมตร กว้าง 9 เซนติเมตร ยาวกี่เซนติเมตร', [['① ครึ่งรอบ', '50 ÷ 2 = 25 = กว้าง + ยาว'], ['② ยาว', '25 − 9']], '50 ÷ 2 − 9')))],
    () => [0, 1, 2, 3].map(i => Q.dStory(Q5S[i]))),
  L5Q(17, 'ฐานโจทย์ด้านขนาน', 'การแก้โจทย์ปัญหาเกี่ยวกับพื้นที่ของรูปสี่เหลี่ยมด้านขนาน', 'โจทย์พื้นที่ด้านขนาน', 'แก้โจทย์ปัญหาพื้นที่ของรูปสี่เหลี่ยมด้านขนานและขนมเปียกปูน รวมถึงหาจำนวนกระเบื้องและค่าใช้จ่าย', [
    T('วางแผนทีละขั้น: กระเบื้องกี่แผ่น', 'วางแผนทีละขั้น กระเบื้องกี่แผ่น', el => el.append(simStepPick('แผ่นปูพื้นรูปสี่เหลี่ยมด้านขนาน ฐาน 25 ซม. สูง 10 ซม. ปูพื้นขนาด 200 × 300 ซม. ต้องใช้อย่างน้อยกี่แผ่น', [{ q: 'พื้นที่พื้น', opts: ['200 × 300', '(200 + 300) × 2', '200 + 300'], right: '200 × 300', unit: 'ตร.ซม.', why: 'ผืนผ้า = กว้าง × ยาว' }, { q: 'พื้นที่กระเบื้อง 1 แผ่น', opts: ['25 × 10', '25 + 10', '1/2 × 25 × 10'], right: '25 × 10', unit: 'ตร.ซม.', why: 'ด้านขนาน = ฐาน × สูง' }, { q: 'จำนวนแผ่น', opts: ['60000 ÷ 250', '60000 × 250', '60000 − 250'], right: '60000 ÷ 250', unit: 'แผ่น', why: 'พื้นที่พื้น ÷ พื้นที่ 1 แผ่น' }], 'ตอบ <b>240</b> แผ่น'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('ป้ายรูปสี่เหลี่ยมขนมเปียกปูนยาวด้านละ 60 ซม. ระยะห่างระหว่างด้านคู่ขนาน 45 ซม. ค่าทาสีตารางเซนติเมตรละ 0.2 บาท ต้องจ่ายค่าทาสีกี่บาท', [['① พื้นที่', '60 × 45 = 2,700 ตร.ซม.'], ['② ค่าสี', '2,700 × 0.2']], '60 × 45 × 0.2')))],
    () => [4, 5, 6, 7, 8].map(i => Q.dStory(Q5S[i]))),
  L5Q(18, 'ฐานโจทย์หลายเหลี่ยม', 'การแก้โจทย์ปัญหาเกี่ยวกับพื้นที่ของรูปหลายเหลี่ยม', 'โจทย์พื้นที่หลายเหลี่ยม', 'แก้โจทย์ปัญหาพื้นที่ของรูปหลายเหลี่ยม โดยแบ่งเป็นรูปสี่เหลี่ยมหรือเติมแล้วลบ', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('แปลงผักรูปตัว L ประกอบด้วยสี่เหลี่ยมผืนผ้า 10 × 4 เมตร และ 3 × 5 เมตร ค่าปูหญ้าตารางเมตรละ 40 บาท ต้องจ่ายกี่บาท', [{ q: 'พื้นที่รวม', opts: ['10 × 4 + 3 × 5', '10 × 4 × 3 × 5', '(10 + 4 + 3 + 5) × 2'], right: '10 × 4 + 3 × 5', unit: 'ตร.ม.', why: 'แบ่งเป็น 2 ผืนผ้าแล้วรวม' }, { q: 'ค่าหญ้า', opts: ['55 × 40', '55 + 40', '55 ÷ 40'], right: '55 × 40', unit: 'บาท', why: 'ตารางเมตรละ 40 บาท' }], 'ตอบ <b>2,200</b> บาท'))),
    T('ตัวอย่างทีละขั้น: เติมแล้วลบ', 'ตัวอย่างทีละขั้น เติมแล้วลบ', el => el.append(dcStory('แผ่นไม้รูปสี่เหลี่ยมผืนผ้า 12 × 8 ซม. เจาะรูรูปสี่เหลี่ยมด้านขนานฐาน 4 ซม. สูง 3 ซม. เหลือไม้กี่ตารางเซนติเมตร', [['① ผืนผ้าเต็ม', '12 × 8 = 96'], ['② รูที่เจาะ', '4 × 3 = 12'], ['③ ลบ', '96 − 12']], '12 × 8 − 4 × 3')))],
    () => [12, 13, 14].map(i => Q.dStory(Q5S[i])).concat([q5num(Q5W_COMP[1]), q5num(Q5W_COMP[3])])),
  L5Q(19, 'ฐานรอบรูปและพื้นที่', 'การแก้โจทย์ปัญหาเกี่ยวกับความยาวรอบรูปและพื้นที่ของรูปสี่เหลี่ยม', 'รอบรูปและพื้นที่', 'แก้โจทย์ปัญหาที่ใช้ทั้งความยาวรอบรูปและพื้นที่ของรูปสี่เหลี่ยม เช่น รู้รอบรูปแล้วหาพื้นที่', [
    T('วางแผนทีละขั้น: รู้รอบรูป → หาพื้นที่', 'วางแผนทีละขั้น รู้รอบรูป หาพื้นที่', el => el.append(simStepPick('โปสเตอร์รูปสี่เหลี่ยมขนมเปียกปูนยาวรอบรูป 96 ซม. ด้านที่ขนานกันห่างกัน 18 ซม. มีพื้นที่เท่าใด', [{ q: 'ยาวด้านละ', opts: ['96 ÷ 4', '96 ÷ 2', '96 × 4'], right: '96 ÷ 4', unit: 'ซม.', why: 'ขนมเปียกปูนมีด้านเท่ากัน 4 ด้าน' }, { q: 'พื้นที่', opts: ['24 × 18', '24 + 18', '1/2 × 24 × 18'], right: '24 × 18', unit: 'ตร.ซม.', why: 'ฐาน × สูง' }], 'ตอบ <b>432</b> ตร.ซม.'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('สนามรูปสี่เหลี่ยมผืนผ้ายาวรอบรูป 70 เมตร ยาว 20 เมตร สนามมีพื้นที่กี่ตารางเมตร', [['① ครึ่งรอบ', '70 ÷ 2 = 35'], ['② กว้าง', '35 − 20 = 15'], ['③ พื้นที่', '20 × 15']], '(70 ÷ 2 − 20) × 20')))],
    () => [9, 10, 11, 15].map(i => Q.dStory(Q5S[i])).concat([Q.dStory(Q5S[7])])),
  L5Q(20, 'ยอดถ้ำสี่เหลี่ยม', 'การแก้โจทย์ปัญหาเกี่ยวกับความยาวรอบรูปและพื้นที่ของรูปหลายเหลี่ยม', 'รอบรูปและพื้นที่ (หลายเหลี่ยม)', 'แก้โจทย์ปัญหาความยาวรอบรูปและพื้นที่ของรูปหลายเหลี่ยมที่ประกอบด้วยรูปสี่เหลี่ยม', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('ลานรูปตัว L: ด้านยาว 10, 6, 4, 3, 6, 9 เมตร (รูปผืนผ้า 10 × 9 ตัดมุม 4 × 3 ออก) ล้อมรั้วรอบลาน และปูหญ้าทั้งลาน ใช้รั้วกี่เมตร และหญ้ากี่ตารางเมตร', [{ q: 'รั้ว = รอบรูป', opts: ['10 + 6 + 4 + 3 + 6 + 9', '10 × 9', '(10 + 9) × 4'], right: '10 + 6 + 4 + 3 + 6 + 9', unit: 'เมตร', why: 'บวกทุกด้าน' }, { q: 'หญ้า = พื้นที่', opts: ['10 × 9 − 4 × 3', '10 × 9', '10 × 9 + 4 × 3'], right: '10 × 9 − 4 × 3', unit: 'ตร.ม.', why: 'เติมเป็นผืนผ้าแล้วลบมุมที่ขาด' }], 'ตอบ รั้ว <b>38</b> เมตร · หญ้า <b>78</b> ตร.ม.'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('ผนังห้องสูง 3 เมตร ยาว 5 เมตร มีประตูกว้าง 1 เมตร สูง 2 เมตร ทาสีผนังส่วนที่เหลือตารางเมตรละ 80 บาท ค่าทาสีกี่บาท', [['① ผนัง', '3 × 5 = 15'], ['② ประตู', '1 × 2 = 2'], ['③ ทาสี', '(15 − 2) × 80']], '(3 × 5 − 1 × 2) × 80')))],
    () => [15, 16, 17, 14].map(i => Q.dStory(Q5S[i])).concat([q5num(Q5W_COMP[0])]))
];

/* =========================================================
   BOSS 659 — ข้อสอบท้ายบท รูปสี่เหลี่ยม แต่งใหม่ทั้งหมด (original items)
   ========================================================= */
const EXAM_P5C7 = xrot([
  { q: 'รูปสี่เหลี่ยมชนิดใดมีด้านตรงข้ามขนานกันทั้งสองคู่', opts: ['สี่เหลี่ยมคางหมู สี่เหลี่ยมรูปว่าว', 'สี่เหลี่ยมด้านขนาน สี่เหลี่ยมขนมเปียกปูน', 'สี่เหลี่ยมรูปว่าว สี่เหลี่ยมผืนผ้า', 'สี่เหลี่ยมคางหมู สี่เหลี่ยมจัตุรัส'], a: 1 },
  { q: 'รูปสี่เหลี่ยมจัตุรัสยาวด้านละ 17 เซนติเมตร มีความยาวรอบรูปเท่าใด', opts: ['34 เซนติเมตร', '51 เซนติเมตร', '68 เซนติเมตร', '289 เซนติเมตร'], a: 2 },
  { q: 'รูปสี่เหลี่ยมผืนผ้ารูปหนึ่งมีด้านยาวเป็นสามเท่าของด้านกว้าง ถ้าด้านกว้างยาว 6 เซนติเมตร รูปนี้มีพื้นที่เท่าใด', opts: ['36 ตารางเซนติเมตร', '72 ตารางเซนติเมตร', '108 ตารางเซนติเมตร', '144 ตารางเซนติเมตร'], a: 2 },
  { q: 'รูปสี่เหลี่ยมผืนผ้ากว้าง 12 ซม. ยาว 30 ซม. มีความยาวรอบรูปเท่าใด', opts: ['42 ซม.', '84 ซม.', '360 ซม.', '72 ซม.'], a: 1 },
  { q: 'รูปสี่เหลี่ยมจัตุรัสมีความยาวรอบรูป 52 ซม. แต่ละด้านยาวเท่าใด', opts: ['12 ซม.', '13 ซม.', '14 ซม.', '26 ซม.'], a: 1 },
  { q: 'ผ้าเช็ดหน้ารูปสี่เหลี่ยมมุมฉาก กว้าง 24 ซม. ยาว 30 ซม. มีพื้นที่เท่าใด', opts: ['108 ตารางเซนติเมตร', '540 ตารางเซนติเมตร', '720 ตารางเซนติเมตร', '800 ตารางเซนติเมตร'], a: 2 },
  { q: 'รูปสี่เหลี่ยมชนิดใดมีเส้นทแยงมุมตัดกันเป็นมุมฉาก', opts: ['สี่เหลี่ยมผืนผ้า สี่เหลี่ยมด้านขนาน', 'สี่เหลี่ยมขนมเปียกปูน สี่เหลี่ยมรูปว่าว', 'สี่เหลี่ยมคางหมู สี่เหลี่ยมผืนผ้า', 'สี่เหลี่ยมด้านขนาน สี่เหลี่ยมคางหมู'], a: 1 },
  { q: 'พื้นห้องรูปสี่เหลี่ยมผืนผ้ากว้าง 3.5 เมตร ยาว 4 เมตร ต้องการปูกระเบื้อง 2 ห้องที่มีขนาดเท่ากัน ต้องปูเป็นพื้นที่ทั้งหมดเท่าใด', opts: ['14 ตารางเมตร', '15 ตารางเมตร', '28 ตารางเมตร', '30 ตารางเมตร'], a: 2 },
  { q: 'รูปสี่เหลี่ยมจัตุรัส ABCD มีพื้นที่ 64 ตารางเซนติเมตร มีความยาวรอบรูปเท่าใด', fig: polySVG([[0, 0], [4, 0], [4, 4], [0, 4]], { fit: true, W: 300, H: 200, names: ['D', 'C', 'B', 'A'], ticks: [1, 1, 1, 1], fill: '#9FE3C9' }), opts: ['16 เซนติเมตร', '24 เซนติเมตร', '32 เซนติเมตร', '64 เซนติเมตร'], a: 2 },
  { q: 'รูปนี้เป็นรูปสี่เหลี่ยมชนิดใด', fig: q5fig(q5rot(Q5_GAME.trap, -15)), opts: ['รูปสี่เหลี่ยมคางหมู', 'รูปสี่เหลี่ยมด้านขนาน', 'รูปสี่เหลี่ยมรูปว่าว', 'รูปสี่เหลี่ยมขนมเปียกปูน'], a: 0 },
  { q: 'รูปสี่เหลี่ยมใดมีเส้นทแยงมุมยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน และตั้งฉากกัน', opts: ['รูปสี่เหลี่ยมผืนผ้า', 'รูปสี่เหลี่ยมจัตุรัส', 'รูปสี่เหลี่ยมขนมเปียกปูน', 'รูปสี่เหลี่ยมรูปว่าว'], a: 1 },
  { q: 'ข้อความใด<b>ถูกต้อง</b>', opts: ['รูปสี่เหลี่ยมรูปว่าวมีด้านยาวเท่ากันทุกด้าน', 'รูปสี่เหลี่ยมผืนผ้ามีเส้นทแยงมุมยาวเท่ากัน', 'รูปสี่เหลี่ยมคางหมูมีมุมฉากทุกมุม', 'รูปสี่เหลี่ยมขนมเปียกปูนมีเส้นทแยงมุมยาวเท่ากันเสมอ'], a: 1 },
  { q: 'รูปสี่เหลี่ยมด้านขนานมีมุมหนึ่งขนาด 70° มุมที่อยู่ตรงข้ามกับมุมนี้มีขนาดเท่าใด', opts: ['20°', '70°', '110°', '290°'], a: 1 },
  { q: 'รูปสี่เหลี่ยมด้านขนานมีฐานยาว 7.5 ซม. สูง 4 ซม. มีพื้นที่เท่าใด', opts: ['15 ตร.ซม.', '23 ตร.ซม.', '30 ตร.ซม.', '34 ตร.ซม.'], a: 2 },
  { q: 'แปลงดอกไม้รูปสี่เหลี่ยมด้านขนานมีฐานยาว 6.4 ม. สูง 2.5 ม. มีพื้นที่เท่าใด', opts: ['8 ตร.ม.', '16 ตร.ม.', '17.8 ตร.ม.', '32 ตร.ม.'], a: 1 },
  { q: 'รูปสี่เหลี่ยมขนมเปียกปูนมีเส้นทแยงมุมยาว 9 ซม. และ 5.2 ซม. มีพื้นที่เท่าใด', opts: ['23.4 ตร.ซม.', '46.8 ตร.ซม.', '14.2 ตร.ซม.', '28.4 ตร.ซม.'], a: 0 },
  { q: 'สวนรูปสี่เหลี่ยมจัตุรัสยาวด้านละ 7.5 เมตร ปักเสารอบสวนทุก ๆ 1.5 เมตร โดยมีเสาที่มุมทุกมุม ปักเสาได้กี่ต้น', opts: ['5 ต้น', '15 ต้น', '20 ต้น', '30 ต้น'], a: 2 },
  { q: 'แม่ทำรั้วรอบแปลงผักรูปสี่เหลี่ยมผืนผ้ากว้าง 4.5 เมตร ยาว 12 เมตร ค่ารั้วเมตรละ 85 บาท แม่เสียเงินกี่บาท', opts: ['1,402.50 บาท', '2,805 บาท', '4,590 บาท', '2,650 บาท'], a: 1 },
  { q: 'ป้ายรูปสี่เหลี่ยมขนมเปียกปูนยาวรอบรูป 96 ซม. ด้านคู่ที่ขนานกันห่างกัน 18 ซม. มีพื้นที่เท่าใด', opts: ['432 ตร.ซม.', '1,728 ตร.ซม.', '864 ตร.ซม.', '216 ตร.ซม.'], a: 0 },
  { q: 'ที่ดินรูปสี่เหลี่ยมผืนผ้ากว้าง 25 วา ยาวรอบรูป 170 วา มีพื้นที่เท่าใด', opts: ['1,500 ตร.วา', '2,125 ตร.วา', '4,250 ตร.วา', '625 ตร.วา'], a: 0 }
], 1);
LESSONS_P5C7.push({ id: 659, boss: true, place: 'ถ้ำราชาหมีสี่เหลี่ยม', title: 'ด่านบอส: บทที่ 7 รูปสี่เหลี่ยม', short: 'ด่านบอส · ข้อสอบ', tone: 'jade',
  goal: 'ตอบคำถามเรื่องรูปสี่เหลี่ยม 20 ข้อ ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P5C7, pass: 10, bossName: 'ราชาหมีสี่เหลี่ยม', bossPal: 'jade', emblem: '▱', bossKind: 'bear' });
