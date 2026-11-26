/* =========================================================
   ม.3 บทที่ 11 ลำน้ำตรีโกณ (อัตราส่วนตรีโกณมิติ 4101–4118) — หน้าสอนเรียงใหม่ (v264 · ผู้ใช้ขอ) · prefix t3d
   แบบเดียวกับ ม.1 (m1qd m1rd m1ed m1gd): ประเด็นละหน้า ① ดูภาพ (สามเหลี่ยมระบายสีด้าน ข้าม ชิด ฉาก แตะแล้วเห็นส่วนสำคัญ)
   → ลงมือเอง (หน้าลาก/แตะเดิมของด่าน) → ② ทำให้ดู (ดินสอขีดทับด้านบนรูป เขียนค่าลงบนรูป และเขียนสมการทีละบรรทัดบนกระดาษ
   คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อจากเกมของด่านนั้นเอง เลือกด้วย sig)
   ตัดการ์ดข้อความ (miCards) ตัวอย่างตัวหนังสือ (dcWalk) และหน้าปุ่มอ่านข้อความ (s2Explore ของด่าน 7) ออก · เกมคงเดิม
   วางท้าย order.txt (ใช้ r4dShow e1dEq e1dSee จากไฟล์ ป.4/ม.1 และ tgTriSVG tgScn จาก m3t.js)
   ========================================================= */
const t3dIn = s => String(s).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const T3K = { AB: ['A', 'B'], BC: ['B', 'C'], AC: ['A', 'C'] };
/* a right triangle (right angle at C) drawn by tgTriSVG into a 360 × 240 picture, with helpers that know where every side is:
   hi(role) thick colour over a side · lab(role, text) a length beside it · chip(role) the ข้าม/ชิด/ฉาก tag · arc(V) an angle mark */
function t3dTri(o) { let S = null; const W = o.W || 360, H = o.H || 240, ref = o.ref === undefined ? 'A' : o.ref;
  const svg = tgTriSVG({ pad: 44, ...o, W, H, extra: s => { S = s; return o.extra ? o.extra(s) : ''; } }), G = [(S.A[0] + S.B[0] + S.C[0]) / 3, (S.A[1] + S.B[1] + S.C[1]) / 3];
  const key = r => ['AB', 'BC', 'AC'].includes(r) ? r : tgKeyOf(r, ref || 'A'), role = r => ['AB', 'BC', 'AC'].includes(r) ? tgRole(r, ref || 'A') : r;
  const mid = (r, off = 24) => { const [p, q] = T3K[key(r)], M = [(S[p][0] + S[q][0]) / 2, (S[p][1] + S[q][1]) / 2], L = Math.hypot(M[0] - G[0], M[1] - G[1]) || 1; return [M[0] + (M[0] - G[0]) / L * off, M[1] + (M[1] - G[1]) / L * off]; };
  const hi = (r, col = TG_COL[role(r)], w = 8) => { const [p, q] = T3K[key(r)]; return `<path d="M${a4n(S[p][0])} ${a4n(S[p][1])} L${a4n(S[q][0])} ${a4n(S[q][1])}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity=".85"/>`; };
  const lab = (r, t, col = '#2B2550', off = 24, cls = '') => { const m = mid(r, off); return `<text x="${a4n(m[0])}" y="${a4n(m[1] + 7)}" text-anchor="middle" class="tg-sv ${cls}" style="fill:${col}">${t}</text>`; };
  const chip = (r, off = 54, t) => { const ro = role(r), m = mid(r, off); return `<g class="tg-chip"><rect x="${a4n(m[0] - 27)}" y="${a4n(m[1] - 15)}" width="54" height="28" rx="14" fill="${TG_COL[ro]}"/><text x="${a4n(m[0])}" y="${a4n(m[1] + 6)}" text-anchor="middle">${t || TG_TH[ro]}</text></g>`; };
  const arc = (V, col = '#F08A24', lb = '', r = 30) => { const oth = ['A', 'B', 'C'].filter(k => k !== V), u = q => { const d = Math.hypot(S[q][0] - S[V][0], S[q][1] - S[V][1]); return [(S[q][0] - S[V][0]) / d, (S[q][1] - S[V][1]) / d]; }, a = u(oth[0]), b = u(oth[1]), cr = a[0] * b[1] - a[1] * b[0], bis = [a[0] + b[0], a[1] + b[1]], bl = Math.hypot(...bis);
    return `<path d="M${a4n(S[V][0] + a[0] * r)} ${a4n(S[V][1] + a[1] * r)} A${r} ${r} 0 0 ${cr > 0 ? 1 : 0} ${a4n(S[V][0] + b[0] * r)} ${a4n(S[V][1] + b[1] * r)}" fill="none" stroke="${col}" stroke-width="3"/>` + (lb ? `<text x="${a4n(S[V][0] + bis[0] / bl * (r + 18))}" y="${a4n(S[V][1] + bis[1] / bl * (r + 18) + 7)}" text-anchor="middle" class="tg-ang" style="fill:${col}">${lb}</text>` : ''); };
  const at = (V, dx, dy, t, col = '#2B2550', cls = 'tg-sv') => `<text x="${a4n(S[V][0] + dx)}" y="${a4n(S[V][1] + dy)}" text-anchor="middle" class="${cls}" style="fill:${col}">${t}</text>`;
  return { s: t3dIn(svg), S, G, mid, hi, lab, chip, arc, at, W, H }; }
/* a story picture (tgScn, 440 × 282) used as the figure of a worked example */
const t3dScn = (kind, o) => t3dIn(tgScn(kind, o));
const t3dTx = (x, y, t, col = '#2B2550', cls = 'tg-sv', anc = 'middle') => `<text x="${a4n(x)}" y="${a4n(y)}" text-anchor="${anc}" class="${cls}" style="fill:${col}">${t}</text>`;
const t3dLine = (a, b, col, w = 7) => `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(b[0])} ${a4n(b[1])}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity=".8"/>`;
const t3dChipAt = (x, y, role) => `<g class="tg-chip"><rect x="${a4n(x - 27)}" y="${a4n(y - 15)}" width="54" height="28" rx="14" fill="${TG_COL[role]}"/><text x="${a4n(x)}" y="${a4n(y + 6)}" text-anchor="middle">${TG_TH[role]}</text></g>`;
/* where things are in a tgScn picture (same numbers as tgScn) */
const T3G = 230;
const t3dKite = deg => { const r = deg * TG_RAD, A = [90, T3G - 20], K = [A[0] + 240 * Math.cos(r), A[1] - 240 * Math.sin(r)]; return { A, K, F: [K[0], A[1]] }; };
const t3dRamp = deg => { const r = deg * TG_RAD, F = [330, T3G], A = [F[0] - 210 * Math.cos(r), T3G], B = [F[0], T3G - 210 * Math.sin(r)]; return { A, B, F }; };
const t3dTower = (deg, eye) => { const r = deg * TG_RAD, ex = 70, ey = T3G - (eye ? 26 : 0), X = Math.min(380, ex + Math.max(120, 150 / Math.tan(r))), top = Math.max(26, ey - (X - ex) * Math.tan(r)); return { E: [ex, ey], T: [X, top], F: [X, ey], G: [X, T3G] }; };
const t3dCliff = (deg, deg2 = 30) => { const tx = 80, ty = 48, r = deg * TG_RAD, r2 = deg2 * TG_RAD; return { T: [tx, ty], F: [tx, T3G], B1: [tx + Math.min(330, (T3G - ty) / Math.tan(r)), T3G], B2: [tx + Math.min(350, (T3G - ty) / Math.tan(r2)), T3G] }; };
const t3dTwo = (deg, deg2) => { const T = [380, 40], HT = T3G - T[1]; return { T, F: [T[0], T3G], A: [T[0] - HT / Math.tan(deg * TG_RAD), T3G], B: [T[0] - HT / Math.tan(deg2 * TG_RAD), T3G] }; };
const t3dSee = (title, cap, list) => e1dSee(title, cap, list);
/* ③ an item of this lesson's own game, chosen by the 2nd word of its sig */
const t3dTry = (id, keys, title) => g5dTry(id, () => { const L = LESSONS.find(x => x.id === id), qs = L.game().filter(q => q && q.__sig && keys.includes(q.__sig.split(' ')[1])); if (!qs.length) return null; const q = pick(qs); return { ...q, __sig: q.__sig + ' ลองทำ' }; }, title);
const t3dOld = p => p ? { ...p, t: `<b>ลงมือเอง</b> — ${String(p.t || '').replace(/<[^>]+>/g, '')}` } : null;
const t3dShow = (title, o) => r4dShow(title, o);

const T3D_TEACH = {
  /* ด่าน 1 ทบทวนสามเหลี่ยมมุมฉาก */
  4101: L => { const O = L.teach.slice(), T = t3dTri({ o: 2.8, a: 4, ref: null, names: true }), T2 = t3dTri({ o: 2.8, a: 4, ref: null, names: true, ang: { A: '35°' } });
    return [
      t3dSee('สามเหลี่ยมมุมฉาก', '<b>แตะรูป</b> — มุมฉากอยู่ไหน ด้านไหนยาวที่สุด', [
        { t: 'มุมฉาก และ ด้านที่ยาวที่สุด', f: on => T.s + (on ? r4vH(`<circle cx="${a4n(T.S.C[0])}" cy="${a4n(T.S.C[1])}" r="22" fill="none" stroke="${G1C.p}" stroke-width="3"/>` + T.at('C', -34, -24, '90°', G1C.p) + T.hi('AB', TG_COL.hyp) + T.lab('AB', 'ยาวที่สุด', TG_COL.hyp, 30)) : ''), s: 'มุม C เป็น<b>มุมฉาก</b> (มีเครื่องหมาย ∟)<br>ด้าน AB ตรงข้ามมุมฉาก <b>ยาวที่สุด</b>' },
        { t: 'มุมแหลมสองมุม', f: on => T2.s + (on ? r4vH(T2.arc('B', '#5A6A8A', '55°', 24) + t3dTx(110, 40, '35° + 55° = 90°', G1C.g, 'tg-sv', 'middle')) : T2.at('B', -26, 10, '?', '#5A6A8A')), s: 'มุมทั้งสามรวม 180° มุมฉากใช้ไป 90°<br>มุม A + มุม B = <b>90°</b>' }]),
      t3dOld(O[0]),
      t3dTry(4101, ['r1', 'r6', 'r9', 'r4'], 'มุมฉาก และ ด้านตรงข้ามมุมฉาก'),
      t3dShow('หาขนาดมุมที่เหลือ', { fig: T2.s + T2.at('B', -26, 10, '?', '#5A6A8A', 'tg-sv t3-q'), q: 'สามเหลี่ยม ABC มีมุม C เป็นมุมฉาก มุม A = 35° มุม B มีขนาดเท่าใด',
        steps: [{ ink: `<circle cx="${a4n(T2.S.C[0])}" cy="${a4n(T2.S.C[1])}" r="22" fill="none" stroke="${G1C.p}" stroke-width="3"/>` + T2.at('C', -34, -24, '90°', G1C.p), w: 'มุม C = 90°', n: 'มีเครื่องหมายมุมฉาก' },
          { w: 'มุม A + มุม B = 90°', n: 'มุมแหลมสองมุมรวมกัน 90°' },
          { ink: T2.arc('B', G1C.g, '', 24) + T2.at('B', -30, 10, '55°', G1C.g), off: ['.t3-q'], w: 'มุม B = 90° − 35° = 55°', n: 'ลบมุมที่รู้ออกจาก 90°', ans: 1 }],
        fin: `มุมแหลมสองมุมของสามเหลี่ยมมุมฉาก<b>รวมกัน 90°</b>`, say: 'มุมแหลมสองมุมของสามเหลี่ยมมุมฉากรวมกันเก้าสิบองศา' }),
      t3dTry(4101, ['r0', 'r2', 'r3', 'r5', 'r7', 'r8'], 'หาขนาดมุม')]; },

  /* ด่าน 2 ข้าม ชิด ฉาก */
  4102: L => { const O = L.teach.slice(), TA = t3dTri({ o: 3, a: 4, ref: 'A', names: true }), TB = t3dTri({ o: 3, a: 4, ref: 'B', names: true });
    const TR = t3dTri({ o: 3, a: 4, ref: 'A', names: ['P', 'Q', 'R'], refLab: 'θ', rot: 150 });
    return [
      t3dSee('ชื่อของด้าน เทียบกับมุม θ', '<b>แตะรูป</b> — ด้านไหนข้าม ด้านไหนชิด ด้านไหนฉาก', [
        { t: 'θ อยู่ที่ A', f: on => TA.s + (on ? r4vH(TA.hi('opp') + TA.hi('adj') + TA.hi('hyp') + TA.chip('opp', 34) + TA.chip('adj', 34) + TA.chip('hyp', 34)) : ''), s: '<b>ข้าม</b> = ด้านที่ไม่แตะมุม θ<br><b>ชิด</b> = ด้านที่แตะ θ แต่ไม่ใช่ฉาก<br><b>ฉาก</b> = ด้านตรงข้ามมุมฉาก (ยาวที่สุด)' },
        { t: 'θ ย้ายไปที่ B', f: on => TB.s + (on ? r4vH(TB.hi('opp') + TB.hi('adj') + TB.hi('hyp') + TB.chip('opp', 34) + TB.chip('adj', 34) + TB.chip('hyp', 34)) : ''), s: 'ย้ายมุม θ แล้ว ข้ามกับชิด<b>สลับกัน</b><br>ฉากเป็นด้านเดิมเสมอ' }]),
      t3dOld(O[1]),
      t3dTry(4102, ['s1', 's5'], 'ข้าม ชิด ฉาก'),
      t3dShow('รูปที่หมุนอยู่', { fig: TR.s, q: 'เทียบกับมุม θ (ที่จุด P) ด้านใดเป็นข้าม ชิด และฉาก',
        steps: [{ ink: `<circle cx="${a4n(TR.S.C[0])}" cy="${a4n(TR.S.C[1])}" r="20" fill="none" stroke="${TG_COL.hyp}" stroke-width="3"/>` + TR.hi('hyp') + TR.chip('hyp', 32), w: 'ฉาก = PQ', n: 'หามุมฉาก (R) ก่อน ด้านตรงข้ามมุมฉากคือฉาก' },
          { ink: TR.hi('opp') + TR.chip('opp', 32), w: 'ข้าม = QR', n: 'ด้านที่ไม่แตะจุด P' },
          { ink: TR.hi('adj') + TR.chip('adj', 32), w: 'ชิด = PR', n: 'ด้านที่เหลือ แตะ P', ans: 1 }],
        fin: `หา<b>มุมฉาก</b>ก่อนเสมอ${r4vSep}แล้วดูว่าด้านไหนแตะมุม θ`, say: 'หามุมฉากก่อนเสมอ แล้วดูว่าด้านไหนแตะมุมทีตา' }),
      t3dTry(4102, ['s2', 's3', 's4'], 'รูปที่หมุน')]; },

  /* ด่าน 3 พีทาโกรัส */
  4103: L => { const O = L.teach.slice(), u = 22, A = [120, 146], C = [120 + 4 * u, 146], B = [120 + 4 * u, 146 - 3 * u], sq = (p, q, col, n) => { const v = [q[0] - p[0], q[1] - p[1]], nrm = [v[1], -v[0]], P = [p, q, [q[0] + nrm[0], q[1] + nrm[1]], [p[0] + nrm[0], p[1] + nrm[1]]];
      let s = `<path d="M${P.map(a => a.map(a4n).join(' ')).join(' L')} Z" fill="${col}" fill-opacity=".25" stroke="${col}" stroke-width="2"/>`; for (let i = 1; i < n; i++) { const t = i / n; s += g1dL([p[0] + v[0] * t, p[1] + v[1] * t], [p[0] + v[0] * t + nrm[0], p[1] + v[1] * t + nrm[1]], col, 1) + g1dL([p[0] + nrm[0] * t, p[1] + nrm[1] * t], [q[0] + nrm[0] * t, q[1] + nrm[1] * t], col, 1); } return s; };
    const T6 = t3dTri({ o: 6, a: 8, ref: null, sides: { BC: '6', AC: '8' } }), T5 = t3dTri({ o: 5, a: 12, ref: null, sides: { BC: '5', AB: '13' } });
    return [
      t3dSee('ทฤษฎีบทพีทาโกรัส', '<b>แตะรูป</b> — นับช่องของสี่เหลี่ยมบนแต่ละด้าน', [
        { t: '3, 4, 5', f: on => g1dPoly([A, C, B], '#2B2550', '#E8F4FD', 3) + (on ? r4vH(sq(C, A, TG_COL.adj, 4) + sq(B, C, TG_COL.opp, 3) + sq(A, B, TG_COL.hyp, 5) + t3dTx(300, 60, '9 + 16 = 25', G1C.g)) : t3dTx(222, 120, '3', TG_COL.opp) + t3dTx(164, 170, '4', TG_COL.adj)), s: 'สี่เหลี่ยมบนด้าน 3 กับ 4 มี 9 + 16 = 25 ช่อง<br>เท่ากับสี่เหลี่ยมบนด้านตรงข้ามมุมฉาก<br><b>a² + b² = c²</b>' }]),
      t3dOld(O[0]),
      t3dShow('หาด้านตรงข้ามมุมฉาก', { fig: T6.s + T6.lab('AB', 'c', TG_COL.hyp, 24, 't3-q'), q: 'สามเหลี่ยมมุมฉากมีด้านประกอบมุมฉากยาว 6 และ 8 หน่วย ด้านตรงข้ามมุมฉาก c ยาวเท่าใด',
        steps: [{ ink: T6.hi('AB', TG_COL.hyp), w: 'c² = 6² + 8²', n: 'ฉาก² = ผลบวกกำลังสองของอีกสองด้าน' }, { w: 'c² = 36 + 64 = 100', n: 'ยกกำลังสองแล้วบวก' },
          { ink: T6.lab('AB', 'c = 10', G1C.g, 30), off: ['.t3-q'], w: 'c = √100 = 10', n: 'ถอดรากที่สอง', ans: 1 }],
        fin: `ฉาก² = ด้าน² + ด้าน²${r4vSep}c = √(a² + b²)`, say: 'ด้านตรงข้ามมุมฉากยกกำลังสอง เท่ากับผลบวกกำลังสองของอีกสองด้าน' }),
      t3dTry(4103, ['p1', 'p4', 'p5'], 'หาด้านตรงข้ามมุมฉาก'),
      t3dShow('หาด้านประกอบมุมฉาก', { fig: T5.s + T5.lab('AC', 'b', TG_COL.adj, 24, 't3-q'), q: 'ด้านตรงข้ามมุมฉากยาว 13 หน่วย อีกด้านยาว 5 หน่วย ด้าน b ยาวเท่าใด',
        steps: [{ ink: T5.hi('AC', TG_COL.adj), w: 'b² = 13² − 5²', n: 'ด้านประกอบ² = ฉาก² ลบอีกด้าน²' }, { w: 'b² = 169 − 25 = 144', n: 'ลบ ไม่ใช่บวก' },
          { ink: T5.lab('AC', 'b = 12', G1C.g, 30), off: ['.t3-q'], w: 'b = √144 = 12', n: 'ถอดรากที่สอง', ans: 1 }],
        fin: `หาด้านประกอบมุมฉาก: <b>ฉาก² − ด้าน²</b>`, say: 'หาด้านประกอบมุมฉาก ใช้ฉากยกกำลังสองลบด้านที่รู้ยกกำลังสอง' }),
      t3dTry(4103, ['p2', 'p3', 'p6', 'p7', 'p8'], 'หาด้านประกอบมุมฉาก และ โจทย์')]; },

  /* ด่าน 4 แนวคิด */
  4104: L => { const O = L.teach.slice(), A = [40, 200], tri = (k, col) => { const B = [40 + 4 * k, 200 - 3 * k], C = [40 + 4 * k, 200]; return { s: g1dPoly([A, C, B], col, 'none', 3), B, C }; }, s1 = tri(28, TG_COL.hyp), s2 = tri(56, '#2B2550');
    const T1 = t3dTri({ o: 3, a: 4, ref: 'A', W: 170, H: 140, pad: 26, sides: { opp: '3', hyp: '5' } }), Tb = t3dTri({ o: 9, a: 12, ref: 'A', W: 200, H: 170, pad: 28, sides: { hyp: '15' } });
    return [
      t3dSee('มุมเท่ากัน อัตราส่วนเท่ากัน', '<b>แตะรูป</b> — ขยายสามเหลี่ยม อัตราส่วนเปลี่ยนไหม', [
        { t: 'สามเหลี่ยมคล้าย', f: on => s2.s + s1.s + tgArc(A, 0, Math.atan2(3, 4), 34, '#F08A24') + t3dTx(s1.C[0] + 14, 186, '3', TG_COL.opp, 'tg-sv', 'start') + t3dTx(s2.C[0] + 14, 140, '6', TG_COL.opp, 'tg-sv', 'start') + t3dTx(120, 160, '5', TG_COL.hyp) + t3dTx(160, 92, '10', '#2B2550')
          + (on ? r4vH(t3dTx(180, 30, '3/5 = 6/10 = 0.6', G1C.g, 'tg-sv')) : ''), s: 'มุม θ เท่ากัน = สามเหลี่ยมคล้าย<br>ข้าม/ฉาก = 3/5 = 6/10 <b>เท่าเดิม</b>' },
        { t: 'มุมต่างกัน', f: on => [20, 50].map((d, i) => { const V = [40 + i * 170, 200], P = [V[0] + 130 * Math.cos(d * TG_RAD), 200 - 130 * Math.sin(d * TG_RAD)]; return g1dPoly([V, [P[0], 200], P], '#2B2550', '#E8F4FD', 2.6) + tgArc(V, 0, d * TG_RAD, 26, '#F08A24') + t3dTx(V[0] + 40, 192, d + '°', '#F08A24', 'tg-ang', 'start') + (on ? t3dLine([P[0], 200], P, TG_COL.opp, 6) + t3dTx(P[0] + 8, (200 + P[1]) / 2, ['0.34', '0.77'][i], TG_COL.opp, 'tg-sv', 'start') : ''); }).join(''), s: 'ฉากยาวเท่ากัน แต่มุมต่างกัน<br>ข้าม/ฉาก <b>ต่างกัน</b> → อัตราส่วนบอกขนาดของมุมได้' }]),
      t3dOld(O[0]),
      t3dTry(4104, ['c1', 'c2', 'c3', 'c7'], 'สามเหลี่ยมคล้าย'),
      t3dShow('สามเหลี่ยมคล้ายสองรูป', { fig: T1.s + `<g transform="translate(160 60)">${Tb.s}${Tb.lab('opp', 'x', TG_COL.opp, -22, 't3-q')}</g>`, q: 'สองรูปมีมุม θ เท่ากัน รูปเล็ก ข้าม 3 ฉาก 5 รูปใหญ่ ฉาก 15 หา x',
        steps: [{ ink: T1.hi('opp') + T1.hi('hyp') + `<g transform="translate(160 60)">${Tb.hi('opp')}${Tb.hi('hyp')}</g>`, w: 'ข้าม/ฉาก เท่ากัน', n: 'มุม θ เท่ากัน' }, { w: '3/5 = x/15', n: 'ตั้งสัดส่วน' },
          { ink: `<g transform="translate(160 60)">${Tb.lab('opp', 'x = 9', G1C.g, -40)}</g>`, off: ['.t3-q'], w: 'x = 15 × 3/5 = 9', n: 'คูณทั้งสองข้างด้วย 15', ans: 1 }],
        fin: `มุมเท่ากัน → <b>อัตราส่วนของด้านเท่ากัน</b> ไม่ว่ารูปเล็กหรือใหญ่`, say: 'มุมเท่ากัน อัตราส่วนของด้านเท่ากัน ไม่ว่ารูปเล็กหรือใหญ่', W: 360, H: 240 }),
      t3dTry(4104, ['c4', 'c5', 'c6'], 'ใช้อัตราส่วนหาด้าน')]; },

  /* ด่าน 5 sin cos */
  4105: L => { const O = L.teach.slice(), T = t3dTri({ o: 3, a: 4, ref: 'A', names: true }), F = t3dTri({ o: 5, a: 12, ref: 'A', names: true, sides: { opp: '5', adj: '12', hyp: '13' } });
    return [
      t3dSee('sin θ และ cos θ', '<b>แตะรูป</b> — ใช้ด้านไหนหารด้านไหน', [
        { t: 'sin θ', f: on => T.s + (on ? r4vH(T.hi('opp') + T.hi('hyp') + T.chip('opp', 34) + T.chip('hyp', 34) + t3dTx(110, 36, 'sin θ = ข้าม/ฉาก', TG_COL.opp, 'tg-sv')) : ''), s: '<b>sin θ = ข้าม ÷ ฉาก</b>' },
        { t: 'cos θ', f: on => T.s + (on ? r4vH(T.hi('adj') + T.hi('hyp') + T.chip('adj', 34) + T.chip('hyp', 34) + t3dTx(110, 36, 'cos θ = ชิด/ฉาก', TG_COL.adj, 'tg-sv')) : ''), s: '<b>cos θ = ชิด ÷ ฉาก</b>' }]),
      t3dOld(O[0]), t3dOld(O[1]),
      t3dTry(4105, ['def'], 'ความหมาย'),
      t3dShow('หา sin และ cos ของมุมทั้งสอง', { fig: F.s, q: 'สามเหลี่ยม ABC มุม C เป็นมุมฉาก หา sin และ cos ของมุม A และมุม B',
        steps: [{ ink: F.hi('opp') + F.hi('hyp'), w: `sin A = ${tgF(5, 13)}`, n: 'ข้าม ÷ ฉาก' },
          { ink: F.hi('adj'), w: `cos A = ${tgF(12, 13)}`, n: 'ชิด ÷ ฉาก' },
          { ink: F.arc('B', G1C.g, '', 26), w: `sin B = ${tgF(12, 13)}   cos B = ${tgF(5, 13)}`, n: 'มองจากมุม B ข้ามกับชิดสลับกัน', ans: 1 }],
        fin: `sin A = cos B เพราะ<b>ข้ามของ A คือชิดของ B</b>`, say: 'ไซน์เอเท่ากับโคไซน์บี เพราะข้ามของเอคือชิดของบี' }),
      t3dTry(4105, ['qn', 'qo', 'sd'], 'หา sin cos จากรูป'),
      t3dTry(4105, ['sl', 'qr'], 'sin cos แบบยาก')]; },

  /* ด่าน 6 tan */
  4106: L => { const O = L.teach.slice(), T = t3dTri({ o: 3, a: 4, ref: 'A', names: true }), F = t3dTri({ o: 7, a: 24, ref: 'A', names: ['D', 'E', 'F'], sides: { opp: '7', adj: '24', hyp: '25' }, H: 200 });
    const ramp = (x0, h, col, lab) => g1dPoly([[x0, 200], [x0 + 140, 200], [x0 + 140, 200 - h]], '#2B2550', '#F4FAFF', 2.6) + t3dLine([x0 + 140, 200], [x0 + 140, 200 - h], TG_COL.opp, 5) + t3dLine([x0, 200], [x0 + 140, 200], TG_COL.adj, 5) + t3dTx(x0 + 70, 226, lab, col, 'tg-sv');
    return [
      t3dSee('tan θ', '<b>แตะรูป</b> — ใช้ข้ามกับชิด (ไม่ใช้ฉาก)', [
        { t: 'tan θ', f: on => T.s + (on ? r4vH(T.hi('opp') + T.hi('adj') + T.chip('opp', 34) + T.chip('adj', 34) + t3dTx(110, 36, 'tan θ = ข้าม/ชิด', G1C.g, 'tg-sv')) : ''), s: '<b>tan θ = ข้าม ÷ ชิด</b>' },
        { t: 'ทางลาดชัน', f: on => ramp(20, 70, '#2B2550', on ? 'tan = 0.5' : '') + ramp(190, 140, '#2B2550', on ? 'tan = 1' : ''), s: 'ทางลาด<b>ชันกว่า</b> tan มากกว่า<br>tan θ = สูง ÷ ระยะตามแนวราบ' }]),
      t3dOld(O[0]), t3dOld(O[1]),
      t3dTry(4106, ['def', 'tc'], 'tan'),
      t3dShow('tan ของมุมทั้งสอง', { fig: F.s, H: 200, q: 'สามเหลี่ยม DEF มุม F เป็นมุมฉาก หา tan D และ tan E',
        steps: [{ ink: F.hi('opp') + F.hi('adj'), w: `tan D = ${tgF(7, 24)}`, n: 'ข้าม ÷ ชิด ของมุม D' },
          { ink: F.arc('B', G1C.g, '', 24), w: `tan E = ${tgF(24, 7)}`, n: 'มองจากมุม E ข้ามกับชิดสลับกัน' },
          { w: `${tgF(7, 24)} × ${tgF(24, 7)} = 1`, n: 'tan D กับ tan E เป็นส่วนกลับกัน', ans: 1 }],
        fin: `tan ไม่ใช้ฉาก${r4vSep}tan มากกว่า 1 ได้`, say: 'แทนเจนต์ไม่ใช้ฉาก และมากกว่าหนึ่งได้' }),
      t3dTry(4106, ['qn', 'qo', 'qr'], 'หา tan จากรูป'),
      t3dTry(4106, ['tr', 'tk'], 'tan ในชีวิตจริง')]; },

  /* ด่าน 7 ความสัมพันธ์ */
  4107: L => { const O = L.teach.slice(), T = t3dTri({ o: 8, a: 15, ref: 'A', names: true, sides: { opp: '8', adj: '15', hyp: '17' } }), K = t3dTri({ o: 5, a: 12, ref: 'A', names: true, refLab: 'θ' });
    return [
      t3dSee('tan θ = sin θ ÷ cos θ', '<b>แตะรูป</b> — ฉากตัดกันหมด', [
        { t: 'sin ÷ cos', f: on => (() => { const Lq = w1dCL('{ข้าม|ฉาก} ÷ {ชิด|ฉาก}', 180, 86, 30), cut = i => { const c = (Lq.xs[i][0] + Lq.xs[i][1]) / 2, y = Lq.y + Lq.fs * .5 - 8; return `<path d="M${a4n(c - 22)} ${a4n(y + 10)} L${a4n(c + 22)} ${a4n(y - 12)}" stroke="${G1C.p}" stroke-width="3"/>`; }; return Lq.s + (on ? r4vH(cut(0) + cut(2) + w1dC('= {ข้าม|ชิด} = tan~θ', 180, 176, 30, G1C.g)) : ''); })(), s: 'sin θ ÷ cos θ<br>= (ข้าม/ฉาก) ÷ (ชิด/ฉาก) = ข้าม/ชิด = <b>tan θ</b>' }]),
      t3dSee('sin²θ + cos²θ = 1 และ sin θ = cos (90° − θ)', '<b>แตะรูป</b> — ใช้สามเหลี่ยมเดียวกัน', [
        { t: 'sin² + cos²', f: on => T.s + (on ? r4vH(t3dTx(130, 30, '64/289 + 225/289 = 1', G1C.g, 'r4d-tx')) : ''), s: '(8/17)² + (15/17)² = (64 + 225)/289 = 1<br>มาจากพีทาโกรัส 8² + 15² = 17²' },
        { t: 'sin A = cos B', f: on => K.s + (on ? r4vH(K.hi('opp') + K.hi('hyp') + K.arc('B', G1C.g, '90° − θ', 26) + t3dTx(110, 30, 'sin A = cos B', G1C.g, 'tg-sv')) : ''), s: 'ข้ามของ A คือชิดของ B<br>sin θ = <b>cos (90° − θ)</b>' }]),
      t3dTry(4107, ['y3', 'y8'], 'ความสัมพันธ์'),
      t3dTry(4107, ['y4', 'y5', 'y7'], 'sin θ = cos (90° − θ)'),
      t3dShow('รู้ sin หา cos และ tan', { fig: '', q: 'sin θ = 5/13 เมื่อ θ เป็นมุมแหลม หา cos θ และ tan θ',
        steps: [{ ink: K.s + K.lab('opp', '5', TG_COL.opp) + K.lab('hyp', '13', TG_COL.hyp), w: 'ข้าม = 5   ฉาก = 13', n: 'วาดสามเหลี่ยมจาก sin = ข้าม/ฉาก' },
          { ink: K.hi('adj') + K.lab('adj', '12', TG_COL.adj), w: 'ชิด = √(169 − 25) = 12', n: 'พีทาโกรัสหาด้านที่เหลือ' },
          { w: `cos θ = ${tgF(12, 13)}`, n: 'ชิด ÷ ฉาก' }, { w: `tan θ = ${tgF(5, 12)}`, n: 'ข้าม ÷ ชิด', ans: 1 }],
        fin: `รู้อัตราส่วนหนึ่ง → <b>วาดสามเหลี่ยม</b> หาด้านที่สาม แล้วหาอัตราส่วนอื่น`, say: 'รู้อัตราส่วนหนึ่ง วาดสามเหลี่ยม หาด้านที่สาม แล้วหาอัตราส่วนอื่น' }),
      t3dTry(4107, ['y1', 'y2', 'y6'], 'รู้ค่าหนึ่ง หาค่าอื่น')]; },

  /* ด่าน 12 คำนวณจากด้าน */
  4112: L => { const O = L.teach.slice(), T = t3dTri({ o: 9, a: 40, ref: 'A', sides: { opp: '9', adj: '40' }, H: 170 }), R = t3dTri({ o: 2, a: Math.sqrt(5), ref: 'A', sides: { opp: '2', hyp: '3' } });
    return [
      t3dOld(O[0]),
      t3dSee('ด้านไม่ครบ หาด้านที่สามก่อน', '<b>แตะรูป</b> — ใช้พีทาโกรัส', [
        { t: 'ไม่รู้ฉาก', f: on => T.s + (on ? r4vH(T.hi('hyp') + t3dTx(150, 60, 'ฉาก = √(81 + 1600) = 41', G1C.g, 'r4d-tx')) : T.lab('hyp', '?', TG_COL.hyp)), s: 'ต้องรู้ครบสามด้านก่อน<br>ฉาก = √(9² + 40²) = <b>41</b>' }]),
      t3dShow('ต้องหาด้านที่สามก่อน', { fig: T.s + T.lab('hyp', '?', TG_COL.hyp, 24, 't3-q'), H: 170, q: 'หา sin θ cos θ และ tan θ',
        steps: [{ ink: T.hi('hyp') + T.lab('hyp', '41', G1C.g, 26), off: ['.t3-q'], w: 'ฉาก = √(9² + 40²) = 41', n: 'พีทาโกรัสก่อน' },
          { w: `sin θ = ${tgF(9, 41)}`, n: 'ข้าม ÷ ฉาก' }, { w: `cos θ = ${tgF(40, 41)}`, n: 'ชิด ÷ ฉาก' }, { w: `tan θ = ${tgF(9, 40)}`, n: 'ข้าม ÷ ชิด', ans: 1 }],
        fin: `ด้านไม่ครบ → <b>พีทาโกรัส</b>ก่อน แล้วจึงหาอัตราส่วน`, say: 'ด้านไม่ครบ ใช้พีทาโกรัสก่อน แล้วจึงหาอัตราส่วน' }),
      t3dTry(4112, ['qn', 'qo', 'k1'], 'คำนวณจากด้าน'),
      t3dShow('คำตอบติดราก', { fig: R.s + R.lab('adj', '?', TG_COL.adj, 24, 't3-q'), q: 'ข้าม 2 ฉาก 3 หา cos θ และ tan θ',
        steps: [{ ink: R.hi('adj') + R.lab('adj', '√5', G1C.g, 26), off: ['.t3-q'], w: 'ชิด = √(3² − 2²) = √5', n: 'ถอดรากไม่ลงตัว ก็ใช้ √5 ได้เลย' },
          { w: `cos θ = ${tgF(tgRt(5), 3)}`, n: 'ชิด ÷ ฉาก' }, { w: `tan θ = ${tgF(2, tgRt(5))}`, n: 'ข้าม ÷ ชิด', ans: 1 }],
        fin: `ด้านที่หาได้อาจ<b>ติดราก</b> ใช้ค่านั้นในอัตราส่วนได้เลย`, say: 'ด้านที่หาได้อาจติดราก ใช้ค่านั้นในอัตราส่วนได้เลย' }),
      t3dTry(4112, ['qr', 'k2'], 'อัตราส่วนติดราก')]; },

  /* ด่าน 13 มุมพิเศษ */
  4113: L => { const O = L.teach.slice(), Q = t3dTri({ o: 1, a: 1, ref: 'A', refLab: '45°', ang: { B: '45°' }, sides: { opp: '1', adj: '1' } }), H = t3dTri({ o: 1, a: Math.sqrt(3), ref: 'A', refLab: '30°', ang: { B: '60°' }, sides: { opp: '1', hyp: '2' } });
    return [
      t3dSee('สามเหลี่ยมมุมพิเศษ', '<b>แตะรูป</b> — ความยาวด้านที่จำง่าย', [
        { t: '45°', f: on => Q.s + (on ? r4vH(Q.hi('hyp') + Q.lab('hyp', '√2', G1C.g, 28)) : Q.lab('hyp', '?', TG_COL.hyp)), s: 'มุมฉากหน้าจั่ว ด้าน 1, 1<br>ฉาก = <b>√2</b> → sin 45° = cos 45° = 1/√2' },
        { t: '30° และ 60°', f: on => H.s + (on ? r4vH(H.hi('adj') + H.lab('adj', '√3', G1C.g, 26)) : H.lab('adj', '?', TG_COL.adj)), s: 'ครึ่งของสามเหลี่ยมด้านเท่า ด้าน 1, √3, 2<br>sin 30° = <b>1/2</b> cos 30° = <b>√3/2</b>' }]),
      t3dOld(O[0]), t3dOld(O[1]),
      t3dTry(4113, ['sp1', 'sp4'], 'ค่าของมุมพิเศษ'),
      r4dShow('sin 30° + cos 60°', e1dEq([{ e: 'sin~30° + cos~60°' }, { e: '= !{1|2} + !{1|2}', w: `sin 30° = ${tgF(1, 2)} และ cos 60° = ${tgF(1, 2)}`, n: 'แทนค่าจากสามเหลี่ยมพิเศษ' }, { e: '= *1', w: 'ตอบ 1', n: 'บวกเศษส่วน', ans: 1 }],
        { q: 'หาค่า sin 30° + cos 60°', fin: `แทนค่ามุมพิเศษ แล้ว<b>คิดเลขตามปกติ</b>`, say: 'แทนค่ามุมพิเศษ แล้วคิดเลขตามปกติ' })),
      t3dTry(4113, ['sp2', 'sp3'], 'แทนค่ามุมพิเศษ'),
      t3dOld(O[2]),
      t3dTry(4113, ['sp5', 'sp6'], 'ใช้ตาราง')]; },

  /* ด่าน 14 หาความยาวด้าน */
  4114: L => { const O = L.teach.slice(), T = t3dTri({ o: 3, a: 4, ref: 'A', names: false }), S30 = t3dTri({ o: 1, a: Math.sqrt(3), ref: 'A', refLab: '30°', sides: { hyp: '12' } }), S25 = t3dTri({ o: .466, a: 1, ref: 'A', refLab: '25°', sides: { adj: '20' }, H: 170 });
    return [
      t3dSee('เลือก sin cos หรือ tan', '<b>แตะรูป</b> — ดูด้านที่รู้ (✓) กับด้านที่หา (?)', [
        { t: 'รู้ฉาก หาข้าม', f: on => T.s + T.lab('hyp', '✓', TG_COL.hyp) + T.lab('opp', '?', TG_COL.opp) + (on ? r4vH(T.hi('opp') + T.hi('hyp') + t3dTx(110, 36, 'ใช้ sin', G1C.g, 'tg-sv')) : ''), s: 'ข้ามกับฉาก → <b>sin</b>' },
        { t: 'รู้ชิด หาข้าม', f: on => T.s + T.lab('adj', '✓', TG_COL.adj) + T.lab('opp', '?', TG_COL.opp) + (on ? r4vH(T.hi('opp') + T.hi('adj') + t3dTx(110, 36, 'ใช้ tan', G1C.g, 'tg-sv')) : ''), s: 'ข้ามกับชิด → <b>tan</b>' },
        { t: 'รู้ฉาก หาชิด', f: on => T.s + T.lab('hyp', '✓', TG_COL.hyp) + T.lab('adj', '?', TG_COL.adj) + (on ? r4vH(T.hi('adj') + T.hi('hyp') + t3dTx(110, 36, 'ใช้ cos', G1C.g, 'tg-sv')) : ''), s: 'ชิดกับฉาก → <b>cos</b>' }]),
      t3dOld(O[0]),
      t3dTry(4114, ['h1'], 'เลือกอัตราส่วน'),
      t3dShow('มุมพิเศษ', { fig: S30.s + S30.lab('opp', 'x', TG_COL.opp, 24, 't3-x') + S30.lab('adj', 'y', TG_COL.adj, 24, 't3-y'), q: 'ฉากยาว 12 มุม 30° หา x (ข้าม) และ y (ชิด)',
        steps: [{ ink: S30.hi('opp') + S30.hi('hyp'), w: 'sin 30° = x/12', n: 'ข้ามกับฉาก ใช้ sin' }, { ink: S30.lab('opp', 'x = 6', G1C.g, -44), off: ['.t3-x'], w: `x = 12 × ${tgF(1, 2)} = 6`, n: 'ตัวไม่รู้อยู่ตัวเศษ คูณ' },
          { ink: S30.hi('adj'), w: 'cos 30° = y/12', n: 'ชิดกับฉาก ใช้ cos' }, { ink: S30.lab('adj', 'y = 6√3', G1C.g, 30), off: ['.t3-y'], w: `y = 12 × ${tgF(tgRt(3), 2)} = 6√3`, n: 'แทนค่ามุมพิเศษ', ans: 1 }],
        fin: `รู้ฉาก → <b>sin</b> หาข้าม <b>cos</b> หาชิด`, say: 'รู้ฉาก ใช้ไซน์หาข้าม ใช้โคไซน์หาชิด' }),
      t3dTry(4114, ['h2', 'h3', 'h4', 'h5'], 'หาด้าน (มุมพิเศษ)'),
      t3dShow('ใช้ค่าจากตาราง', { fig: S25.s + S25.lab('opp', 'x', TG_COL.opp, 24, 't3-q'), H: 170, q: 'ชิดยาว 20 มุม 25° หา x (tan 25° ≈ 0.466)',
        steps: [{ ink: S25.hi('opp') + S25.hi('adj'), w: 'tan 25° = x/20', n: 'รู้ชิด หาข้าม ใช้ tan' }, { ink: S25.lab('opp', 'x ≈ 9.32', G1C.g, 30), off: ['.t3-q'], w: `x = 20 × ${tgV3('tan', 25)} ≈ ${tgN(20 * tgV('tan', 25))}`, n: 'แทนค่าจากตาราง', ans: 1 }],
        fin: `ตัวไม่รู้อยู่ตัวเศษ → <b>คูณ</b>${r4vSep}อยู่ตัวส่วน → <b>หาร</b>`, say: 'ตัวไม่รู้อยู่ตัวเศษคูณ อยู่ตัวส่วนหาร' }),
      t3dTry(4114, ['h6', 'h7', 'h8', 'h9'], 'หาด้าน (ใช้ตาราง)')]; },

  /* ด่าน 15 โจทย์ปัญหา */
  4115: L => { const O = L.teach.slice(), k = t3dKite(30), r = t3dRamp(20);
    return [
      t3dSee('จากเรื่องเป็นรูป', '<b>แตะรูป</b> — อะไรเป็นข้าม ชิด ฉาก', [
        { t: 'ว่าว', f: on => { const q = t3dKite(35); return `<g transform="scale(${360 / 440})">` + t3dScn('kite', { deg: 35, L: '', hgt: '' }) + (on ? r4vH(t3dLine(q.A, q.K, TG_COL.hyp) + t3dLine(q.K, q.F, TG_COL.opp) + t3dChipAt((q.A[0] + q.K[0]) / 2 - 20, (q.A[1] + q.K[1]) / 2 - 26, 'hyp') + t3dChipAt(q.K[0] + 42, (q.K[1] + q.F[1]) / 2, 'opp')) : '') + '</g>'; }, s: 'สายว่าว = <b>ฉาก</b><br>ความสูงของว่าว = <b>ข้าม</b>' },
        { t: 'บันได', f: on => { const q = t3dRamp(55); return `<g transform="scale(${360 / 440})">` + t3dScn('ladder', { deg: 55, L: '', hgt: '', d: '' }) + (on ? r4vH(t3dLine(q.A, q.B, TG_COL.hyp) + t3dLine(q.A, q.F, TG_COL.adj) + t3dChipAt((q.A[0] + q.B[0]) / 2 - 40, (q.A[1] + q.B[1]) / 2, 'hyp') + t3dChipAt((q.A[0] + q.F[0]) / 2, T3G + 26, 'adj')) : '') + '</g>'; }, s: 'บันได = <b>ฉาก</b><br>ระยะเชิงบันไดถึงกำแพง = <b>ชิด</b>' },
        { t: 'หอ', f: on => { const q = t3dTower(40); return `<g transform="scale(${360 / 440})">` + t3dScn('tower', { deg: 40, d: '', hgt: '' }) + (on ? r4vH(t3dLine(q.E, q.F, TG_COL.adj) + t3dLine(q.F, q.T, TG_COL.opp) + t3dChipAt((q.E[0] + q.F[0]) / 2, T3G - 22, 'adj') + t3dChipAt(q.T[0] - 44, (q.T[1] + q.F[1]) / 2, 'opp')) : '') + '</g>'; }, s: 'ระยะบนพื้น = <b>ชิด</b><br>ความสูงของหอ = <b>ข้าม</b>' }]),
      t3dTry(4115, ['w1'], 'เลือกอัตราส่วน'),
      t3dShow('ว่าว', { W: 440, H: 282, fig: t3dScn('kite', { deg: 30, L: '50 ม.', hgt: '' }) + t3dTx(k.K[0] + 14, (k.K[1] + k.F[1]) / 2, 'h', '#B5462F', 'tg-sv t3-q', 'start'), q: 'สายว่าวยาว 50 เมตร ทำมุม 30° กับแนวระดับ ว่าวอยู่สูงจากระดับมือกี่เมตร',
        steps: [{ ink: t3dLine(k.A, k.K, TG_COL.hyp) + t3dChipAt((k.A[0] + k.K[0]) / 2 + 30, (k.A[1] + k.K[1]) / 2 + 26, 'hyp') + t3dLine(k.K, k.F, TG_COL.opp) + t3dChipAt(k.K[0] + 40, (k.K[1] + k.F[1]) / 2 + 30, 'opp'), w: 'สาย = ฉาก   h = ข้าม', n: 'วาดสามเหลี่ยมในรูป' },
          { w: 'sin 30° = h/50', n: 'ข้ามกับฉาก ใช้ sin' }, { ink: t3dTx(k.K[0] + 14, (k.K[1] + k.F[1]) / 2, 'h = 25 ม.', G1C.g, 'tg-sv', 'start'), off: ['.t3-q'], w: `h = 50 × ${tgF(1, 2)} = 25 เมตร`, n: 'แทนค่า sin 30°', ans: 1 }],
        fin: `เรื่อง → <b>รูปสามเหลี่ยม</b> → เลือกอัตราส่วน → คำนวณ`, say: 'เปลี่ยนเรื่องเป็นรูปสามเหลี่ยม เลือกอัตราส่วน แล้วคำนวณ' }),
      t3dTry(4115, ['w2', 'w3', 'w5'], 'โจทย์มุมพิเศษ'),
      t3dShow('ทางลาด', { W: 440, H: 282, fig: t3dScn('ramp', { deg: 20, L: '4 ม.', hgt: '' }) + t3dTx(r.F[0] + 10, (r.B[1] + r.F[1]) / 2 + 6, 'h', '#B5462F', 'tg-sv t3-q', 'start'), q: 'ทางลาดยาว 4 เมตร ทำมุม 20° กับพื้น ปลายทางลาดสูงกี่เมตร (sin 20° ≈ 0.342)',
        steps: [{ ink: t3dLine(r.A, r.B, TG_COL.hyp) + t3dLine(r.B, r.F, TG_COL.opp) + t3dChipAt(r.F[0] + 42, (r.B[1] + r.F[1]) / 2 - 24, 'opp'), w: 'ทางลาด = ฉาก   h = ข้าม', n: 'ความสูงอยู่ตรงข้ามมุม 20°' },
          { w: 'sin 20° = h/4', n: 'ข้ามกับฉาก ใช้ sin' }, { ink: t3dTx(r.F[0] + 10, (r.B[1] + r.F[1]) / 2 + 32, `≈ ${tgN(4 * tgV('sin', 20), 2)} ม.`, G1C.g, 'tg-sv', 'start'), off: ['.t3-q'], w: `h = 4 × ${tgV3('sin', 20)} ≈ ${tgN(4 * tgV('sin', 20), 2)} เมตร`, n: 'แทนค่าจากตาราง', ans: 1 }],
        fin: `มุมไม่พิเศษ → ใช้ค่าจาก<b>ตาราง</b> ได้คำตอบโดยประมาณ`, say: 'มุมไม่พิเศษ ใช้ค่าจากตาราง ได้คำตอบโดยประมาณ' }),
      t3dTry(4115, ['w4', 'w6', 'w7', 'w8'], 'โจทย์ใช้ตาราง')]; },

  /* ด่าน 16 มุมเงย มุมก้ม */
  4116: L => { const O = L.teach.slice(), tw = t3dTower(60), sc = 360 / 440, z = s => `<g transform="scale(${sc})">${s}</g>`;
    return [
      t3dSee('มุมเงย และ มุมก้ม', '<b>แตะรูป</b> — วัดจากแนวระดับเสมอ', [
        { t: 'มุมเงย', f: on => z(t3dScn('tower', { deg: 40, d: '', hgt: '' }) + (on ? r4vH(t3dTx(150, 40, 'มองขึ้น = มุมเงย', '#2FB5A3', 'tg-sv')) : '')), s: '<b>มุมเงย</b>: มองขึ้น<br>มุมระหว่างแนวสายตากับแนวระดับ' },
        { t: 'มุมก้ม', f: on => z(t3dScn('cliff', { deg: 30, hgt: '', d: '' }) + (on ? r4vH(t3dTx(300, 30, 'มองลง = มุมก้ม', '#E36A8C', 'tg-sv')) : '')), s: '<b>มุมก้ม</b>: มองลง<br>มุมระหว่างแนวสายตากับแนวระดับ (เส้นประบน)' }]),
      t3dOld(O[0]),
      t3dTry(4116, ['e1', 'e2'], 'มุมเงย หรือ มุมก้ม'),
      t3dShow('หาความสูงของหอ', { W: 440, H: 282, fig: t3dScn('tower', { deg: 60, d: '30 ม.', hgt: '' }) + t3dTx(tw.T[0] + 22, (tw.T[1] + tw.F[1]) / 2, 'h', '#B5462F', 'tg-sv t3-q', 'start'), q: 'ยืนห่างหอ 30 เมตร มองเห็นยอดหอเป็นมุมเงย 60° หอสูงเท่าใด',
        steps: [{ ink: t3dLine(tw.E, tw.F, TG_COL.adj) + t3dChipAt((tw.E[0] + tw.F[0]) / 2, tw.F[1] - 22, 'adj') + t3dLine(tw.F, tw.T, TG_COL.opp) + t3dChipAt(tw.T[0] - 44, (tw.T[1] + tw.F[1]) / 2, 'opp'), w: 'ระยะ 30 = ชิด   h = ข้าม', n: 'มุมเงยอยู่ที่ตาของเรา' },
          { w: 'tan 60° = h/30', n: 'ข้ามกับชิด ใช้ tan' }, { ink: t3dTx(tw.T[0] + 22, (tw.T[1] + tw.F[1]) / 2 + 28, '= 30√3 ม.', G1C.g, 'tg-sv', 'start'), w: 'h = 30 × √3 = 30√3 ≈ 51.96 เมตร', n: 'tan 60° = √3', ans: 1 }],
        fin: `รู้ระยะบนพื้น หาความสูง → <b>tan</b>`, say: 'รู้ระยะบนพื้น หาความสูง ใช้แทนเจนต์' }),
      t3dTry(4116, ['e3', 'e4', 'e5', 'e6', 'e7'], 'มุมเงย มุมก้ม')]; },

  /* ด่าน 17 ความสูงและระยะทาง */
  4117: L => { const O = L.teach.slice(), tr = t3dTower(45, true), cl = t3dCliff(30);
    return [
      t3dOld(O[0]),
      t3dTry(4117, ['f3', 'f4'], 'เงา'),
      t3dShow('อย่าลืมความสูงของตา', { W: 440, H: 282, fig: t3dScn('tree', { deg: 45, d: '20 ม.', hgt: '', eye: '1.5 ม.' }), q: 'ยืนห่างต้นไม้ 20 เมตร มองยอดเป็นมุมเงย 45° ตาสูงจากพื้น 1.5 เมตร ต้นไม้สูงเท่าใด',
        steps: [{ ink: t3dLine(tr.E, tr.F, TG_COL.adj) + t3dLine(tr.F, tr.T, TG_COL.opp) + t3dTx(tr.T[0] + 26, (tr.T[1] + tr.F[1]) / 2, 'h', TG_COL.opp, 'tg-sv', 'start'), w: 'tan 45° = h/20 → h = 20', n: 'ส่วนที่อยู่เหนือระดับตา' },
          { ink: t3dLine(tr.F, tr.G, G1C.o) + t3dTx(tr.G[0] + 26, tr.G[1] - 8, '1.5', G1C.o, 'tg-sv', 'start'), w: 'ต้นไม้สูง 20 + 1.5 = 21.5 เมตร', n: 'บวกความสูงของตา', ans: 1 }],
        fin: `มุมเงยวัดจาก<b>ระดับสายตา</b> ต้องบวกความสูงของตา`, say: 'มุมเงยวัดจากระดับสายตา ต้องบวกความสูงของตาด้วย' }),
      t3dTry(4117, ['f1', 'f2', 'f7'], 'ความสูง'),
      t3dShow('มุมก้มจากประภาคาร', { W: 440, H: 282, fig: t3dScn('cliff', { deg: 30, hgt: '40 ม.', d: '' }) + t3dTx((cl.F[0] + cl.B1[0]) / 2, T3G + 30, 'x', '#2B2550', 'tg-sv t3-q'), q: 'จากยอดประภาคารสูง 40 เมตร มองเห็นเรือเป็นมุมก้ม 30° เรืออยู่ห่างเท่าใด',
        steps: [{ ink: tgArc(cl.B1, Math.PI - Math.atan2(T3G - cl.T[1], cl.B1[0] - cl.T[0]), Math.PI, 40, '#E36A8C') + t3dTx(cl.B1[0] - 60, T3G - 12, '30°', '#E36A8C', 'tg-sv'), w: 'มุมที่เรือ = 30°', n: 'มุมก้ม = มุมเงยจากเรือ (มุมแย้ง)' },
          { ink: t3dLine(cl.F, cl.B1, TG_COL.adj), w: `tan 30° = 40/x`, n: 'ข้าม = 40 ชิด = x' },
          { ink: t3dTx((cl.F[0] + cl.B1[0]) / 2, T3G + 30, 'x = 40√3', G1C.g, 'tg-sv'), off: ['.t3-q'], w: `x = 40 ÷ ${tgF(1, tgRt(3))} = 40√3 ≈ 69.28 เมตร`, n: 'ตัวไม่รู้อยู่ตัวส่วน → หาร', ans: 1 }],
        fin: `มุมก้มจากบน = <b>มุมเงย</b>จากล่าง`, say: 'มุมก้มจากข้างบน เท่ากับมุมเงยจากข้างล่าง' }),
      t3dTry(4117, ['f5', 'f6'], 'ระยะทาง')]; },

  /* ด่าน 18 หลายขั้นตอน */
  4118: L => { const O = L.teach.slice(), tw = t3dTwo(30, 60), bt = t3dCliff(60, 30);
    return [
      t3dOld(O[0]),
      t3dTry(4118, ['m7', 'm2'], 'มุมเงยจากสองจุด'),
      t3dShow('มุมเงยจากสองจุด', { W: 440, H: 282, fig: t3dScn('two', { deg: 30, deg2: 60, d: '20 ม.', hgt: '' }) + t3dTx(tw.T[0] - 24, (tw.T[1] + T3G) / 2, 'h', '#B5462F', 'tg-sv t3-q', 'end'), q: 'จาก A มองยอดหอเป็นมุมเงย 30° เดินเข้าไป 20 เมตรถึง B มุมเงยเป็น 60° หอสูงเท่าใด',
        steps: [{ ink: t3dLine(tw.B, tw.F, TG_COL.adj) + t3dTx((tw.B[0] + tw.F[0]) / 2, T3G + 30, 'x', TG_COL.adj, 'tg-sv'), w: 'ที่ B: h = x × tan 60° = x√3', n: 'สามเหลี่ยมเล็ก' },
          { ink: t3dLine(tw.A, tw.B, G1C.o, 5), w: `ที่ A: h = (x + 20) × ${tgF(1, tgRt(3))}`, n: 'สามเหลี่ยมใหญ่ ใช้ h ร่วมกัน' },
          { w: 'x√3 = (x + 20) ÷ √3', n: 'h เท่ากัน ตั้งสมการ' }, { w: '3x = x + 20 → x = 10', n: 'คูณ √3 ทั้งสองข้าง แล้วแก้สมการ' },
          { ink: t3dTx(tw.T[0] - 24, (tw.T[1] + T3G) / 2 + 28, '10√3', G1C.g, 'tg-sv', 'end'), off: ['.t3-q'], w: 'h = 10√3 ≈ 17.32 เมตร', n: 'แทน x = 10', ans: 1 }],
        fin: `สองจุด สองสามเหลี่ยม ใช้<b>ความสูงที่เป็นด้านร่วม</b>เชื่อมกัน`, say: 'สองจุด สองสามเหลี่ยม ใช้ความสูงที่เป็นด้านร่วมเชื่อมกัน' }),
      t3dTry(4118, ['m1', 'm6'], 'หลายขั้นตอน'),
      t3dShow('เรือสองลำ', { W: 440, H: 282, fig: t3dScn('boats', { deg: 60, deg2: 30, hgt: '30 ม.', d2: '' }), q: 'จากยอดหน้าผาสูง 30 เมตร มองเรือสองลำเป็นมุมก้ม 60° และ 30° เรือสองลำห่างกันเท่าใด',
        steps: [{ ink: t3dLine(bt.F, bt.B1, TG_COL.adj, 6), w: 'เรือใกล้: 30 ÷ √3 = 10√3', n: 'มุม 60° tan 60° = 30/ระยะ' },
          { ink: t3dLine(bt.F, bt.B2, '#7C5CE0', 3), w: 'เรือไกล: 30 × √3 = 30√3', n: 'มุม 30° tan 30° = 30/ระยะ' },
          { ink: t3dLine(bt.B1, bt.B2, G1C.g, 7) + t3dTx((bt.B1[0] + bt.B2[0]) / 2, T3G + 30, '20√3', G1C.g, 'tg-sv'), w: '30√3 − 10√3 = 20√3 ≈ 34.64 เมตร', n: 'นำระยะมาลบกัน', ans: 1 }],
        fin: `หาระยะของ<b>แต่ละลำ</b>จากเชิงหน้าผา แล้วนำมาลบกัน`, say: 'หาระยะของแต่ละลำ แล้วนำมาลบกัน' }),
      t3dTry(4118, ['m3', 'm4', 'm5'], 'โจทย์ประยุกต์')]; }
};
/* ด่าน 8–10 cosec sec cot (สร้างจากรูปแบบเดียวกัน) และ ด่าน 11 ครบหกตัว */
['cosec', 'sec', 'cot'].forEach((fn, j) => { const base = TG_INV[fn], ex = [[2, 7], [3, 8], [4, 9]][j];
  T3D_TEACH[4108 + j] = L => { const O = L.teach.slice(), T = t3dTri({ o: 3, a: 4, ref: 'A', names: true, pad: 64 }), [bn, bd] = TG_FN[base].map(r => TG_TH[r]);
    return [
      t3dSee(`${fn} คือส่วนกลับของ ${base}`, '<b>แตะรูป</b> — กลับเศษเป็นส่วน', [
        { t: `${base} → ${fn}`, f: on => T.s + T.hi(TG_FN[base][0]) + T.hi(TG_FN[base][1]) + w1dC(`${base}~θ = {${bn}|${bd}}`, 92, 34, 20) + (on ? r4vH(w1dC(`${fn}~θ = {${bd}|${bn}}`, 272, 34, 20, G1C.g) + `<path d="M176 30 L198 30" stroke="${G1C.g}" stroke-width="3"/>` + g1dAh([176, 30], [200, 30], G1C.g)) : ''), s: `${fn} θ = 1 ÷ ${base} θ = <b>${bd}/${bn}</b><br>${base} θ × ${fn} θ = 1 (เนื้อหาเสริม)` }]),
      t3dTry(4108 + j, ['def', 'rc5'], `ความหมายของ ${fn}`),
      t3dOld(O[1]),
      t3dTry(4108 + j, ['qn', 'qo', 'qr'], `${fn} จากรูป`),
      r4dShow(`รู้ ${base} หา ${fn}`, e1dEq([{ e: `${base}~θ = {${ex[0]}|${ex[1]}}` }, { e: `${fn}~θ = {1|${base}~θ}`, w: `${fn} θ = 1 ÷ ${base} θ`, n: 'เป็นส่วนกลับกัน' }, { e: `= !{${ex[1]}|${ex[0]}}`, w: 'กลับเศษเป็นส่วน', n: `1 ÷ ${ex[0]}/${ex[1]} = ${ex[1]}/${ex[0]}` },
        { e: `{${ex[0]}|${ex[1]}} × {${ex[1]}|${ex[0]}} = *1`, w: 'ตรวจ: คูณกันได้ 1 ✓', n: 'ส่วนกลับคูณกันได้ 1', ans: 1 }], { q: `${base} θ = ${ex[0]}/${ex[1]} หา ${fn} θ`, fin: `${base} θ × ${fn} θ = <b>1</b> เสมอ`, say: `${TG_SAYFN[base]} คูณ ${TG_SAYFN[fn]} เท่ากับหนึ่ง` })),
      t3dTry(4108 + j, ['rc1', 'rc2', 'rc3', 'rc4', 'rc6'], `รู้ ${base} หา ${fn}`)]; }; });
T3D_TEACH[4111] = L => { const O = L.teach.slice(), T = t3dTri({ o: 8, a: 15, ref: 'A', names: true });
  const pair = (y, a, b, col) => e1dChip(40, y, 110, a, col) + e1dChip(210, y, 110, b, col) + g1dL([156, y + 19], [204, y + 19], col, 2) + g1dAh([170, y + 19], [204, y + 19], col) + g1dAh([190, y + 19], [156, y + 19], col);
  return [
    t3dOld(O[0]),
    t3dSee('คู่ส่วนกลับ', '<b>แตะรูป</b> — จับคู่ที่คูณกันได้ 1', [
      { t: 'สามคู่', f: on => pair(40, 'sin θ', on ? 'cosec θ' : '?', TG_COL.opp) + pair(110, 'cos θ', on ? 'sec θ' : '?', TG_COL.adj) + pair(180, 'tan θ', on ? 'cot θ' : '?', G1C.g), s: 'sin ↔ <b>cosec</b>   cos ↔ <b>sec</b><br>tan ↔ <b>cot</b> (คูณกันได้ 1)' }]),
    t3dTry(4111, ['x1', 'x2', 'x3', 'x8'], 'คู่ส่วนกลับ'),
    t3dShow('รู้ tan หาครบ 6 ตัว', { fig: '', q: 'tan θ = 8/15 เมื่อ θ เป็นมุมแหลม หาอัตราส่วนตรีโกณมิติทั้ง 6 ตัว',
      steps: [{ ink: T.s + T.lab('opp', '8', TG_COL.opp) + T.lab('adj', '15', TG_COL.adj), w: 'ข้าม = 8   ชิด = 15', n: 'วาดสามเหลี่ยมจาก tan = ข้าม/ชิด' },
        { ink: T.hi('hyp') + T.lab('hyp', '17', TG_COL.hyp), w: 'ฉาก = √(64 + 225) = 17', n: 'พีทาโกรัส' },
        { w: `sin = ${tgF(8, 17)}  cos = ${tgF(15, 17)}  tan = ${tgF(8, 15)}`, n: 'สามตัวหลัก' },
        { w: `cosec = ${tgF(17, 8)}  sec = ${tgF(17, 15)}  cot = ${tgF(15, 8)}`, n: 'กลับเศษเป็นส่วน', ans: 1 }],
      fin: `วาดสามเหลี่ยม → หาด้านที่สาม → <b>sin cos tan</b> → กลับเป็น <b>cosec sec cot</b>`, say: 'วาดสามเหลี่ยม หาด้านที่สาม หาไซน์โคไซน์แทนเจนต์ แล้วกลับเศษเป็นส่วน' }),
    t3dTry(4111, ['x4', 'x5', 'x6', 'x7'], 'หาครบ 6 ตัว')]; };
LESSONS_M3C11.forEach(L => { const f = T3D_TEACH[L.id]; if (f) { L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true; } });
