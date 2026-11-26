/* =========================================================
   ม.1 บทที่ 2 ลำน้ำเรขา — หน้าสอนเรียงใหม่ (v263 · ผู้ใช้ขอ) · prefix g1d
   แบบเดียวกับบทที่ 3 6 7: ประเด็นละหน้า ① ดูภาพ (รูปเรขาคณิตนิ่ง แตะแล้วเห็นส่วนสำคัญ) → ลงมือเอง (หน้าลากสำรวจเดิม)
   → ② ทำให้ดู (กระดานสร้างรูปเดิม mgDemo: วงเวียน/สันตรง/ครึ่งวงกลมขยับเองทีละขั้น + คำอธิบายสั้น ๆ ขึ้นข้าง ๆ บนกระดาน)
   → ลองสร้างเอง (mgTry เดิม) → ③ ลองทำ (ข้อจากเกมของด่านนั้นตาม sig)
   ตัดการ์ดข้อความ (mgCards miCards) ออก · เกมคงเดิม · วางท้าย order.txt (หลัง m1ed.js) ใช้ e1dSee/e1dTx จาก m1qd.js
   ========================================================= */
const G1C = E1C;
const g1dL = (a, b, col = G1C.ink, w = 3, dash) => `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(b[0])} ${a4n(b[1])}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const g1dAh = (a, b, col = G1C.ink) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], v = [-u[1], u[0]]; return `<path d="M${a4n(b[0])} ${a4n(b[1])} L${a4n(b[0] - u[0] * 13 + v[0] * 6)} ${a4n(b[1] - u[1] * 13 + v[1] * 6)} L${a4n(b[0] - u[0] * 13 - v[0] * 6)} ${a4n(b[1] - u[1] * 13 - v[1] * 6)} Z" fill="${col}"/>`; };
const g1dP = (p, lab, col = G1C.ink, dx = 0, dy = -14) => `<circle cx="${a4n(p[0])}" cy="${a4n(p[1])}" r="5" fill="${col}"/>` + (lab ? e1dTx(p[0] + dx, p[1] + dy, lab, col, 'r4v-tx') : '');
/* a point at angle a (degrees, counter-clockwise, y up on screen) and distance r from c */
const g1dAt = (c, a, r) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
const g1dArc = (c, r, a0, a1, col = G1C.p, w = 2.6) => { const p = g1dAt(c, a0, r), q = g1dAt(c, a1, r), big = Math.abs(a1 - a0) > 180 ? 1 : 0; return `<path d="M${a4n(p[0])} ${a4n(p[1])} A${r} ${r} 0 ${big} ${a1 > a0 ? 0 : 1} ${a4n(q[0])} ${a4n(q[1])}" fill="none" stroke="${col}" stroke-width="${w}"/>`; };
const g1dRA = (c, a, k = 14, col = G1C.p) => { const p = g1dAt(c, a, k), q = g1dAt(c, a + 90, k), m = g1dAt(c, a + 45, k * Math.SQRT2); return `<path d="M${a4n(p[0])} ${a4n(p[1])} L${a4n(m[0])} ${a4n(m[1])} L${a4n(q[0])} ${a4n(q[1])}" fill="none" stroke="${col}" stroke-width="2.4"/>`; };
const g1dTk = (a, b, n = 1, col = G1C.p) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], v = [-u[1], u[0]]; let s = '';
  for (let j = 0; j < n; j++) { const c = [m[0] + u[0] * (j - (n - 1) / 2) * 7, m[1] + u[1] * (j - (n - 1) / 2) * 7]; s += g1dL([c[0] - v[0] * 8, c[1] - v[1] * 8], [c[0] + v[0] * 8, c[1] + v[1] * 8], col, 2.6); } return s; };
/* the symbol AB with its mark above: line ↔ · segment ― · ray → */
const g1dSym = (k, cx, y, t = 'AB', col = G1C.b) => { const a = [cx - 24, y - 25], b = [cx + 24, y - 25]; return e1dTx(cx, y, t, col, 'r4v-big') + g1dL(a, b, col, 2.4) + (k === 'line' ? g1dAh(b, a, col) + g1dAh(a, b, col) : k === 'ray' ? g1dAh(a, b, col) : ''); };
const g1dPoly = (P, col = G1C.ink, fill = 'none', w = 3) => `<path d="M${P.map(p => `${a4n(p[0])} ${a4n(p[1])}`).join(' L')} Z" fill="${fill}" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/>`;
const g1dSee = (title, cap, list) => e1dSee(title, cap, list);
/* ③ an item of this lesson's own game: key = the 2nd word of its sig, or "@mgm" = every item whose sig starts with mgm */
const g1dTry = (id, keys, title) => g5dTry(id, () => { const L = LESSONS.find(x => x.id === id), qs = L.game().filter(q => q && q.__sig && keys.some(k => k[0] === '@' ? q.__sig.startsWith(k.slice(1) + ' ') : q.__sig.split(' ')[1] === k)); if (!qs.length) return null; const q = pick(qs); return { ...q, __sig: q.__sig + ' ลองทำ' }; }, title);
/* an old page kept as it is · worked examples get the "ทำให้ดู" name, hands-on pages "ลงมือเอง" */
const g1dOld = (p, kind) => { if (!p) return null; const t = String(p.t || '').replace(/^ตัวอย่างทีละขั้น:\s*/, '').replace(/^<b>ลอง(สร้าง|หา)เอง<\/b>:\s*/, '');
  return kind === 'do' ? { ...p, t: `<b>ทำให้ดู</b> — ${t.replace(/<\/?b>/g, '')}` } : kind === 'hand' ? { ...p, t: `<b>ลงมือเอง</b> — ${t.replace(/<[^>]+>/g, '')}` } : p; };

/* ---------- pictures used on several pages ---------- */
const g1dCompass = (hinge, needle, pen, col = '#7E6ED6') => g1dL(hinge, needle, '#5B5470', 5) + g1dL(hinge, pen, col, 5) + `<circle cx="${hinge[0]}" cy="${hinge[1]}" r="7" fill="#5B5470"/>` + `<circle cx="${a4n(pen[0])}" cy="${a4n(pen[1])}" r="5" fill="${G1C.p}"/>`;
const g1dRuler = (x, y, w, ticks = 10) => `<rect x="${x}" y="${y}" width="${w}" height="30" rx="4" fill="#FFE9A8" stroke="#C98612" stroke-width="2"/>` + Array.from({ length: ticks + 1 }, (_, i) => `<path d="M${a4n(x + 8 + i * (w - 16) / ticks)} ${y} V${y + (i % 5 ? 9 : 15)}" stroke="#8A5A00" stroke-width="1.4"/>`).join('');
const g1dProt = (c, r, on) => `<path d="M${c[0] - r} ${c[1]} A${r} ${r} 0 0 1 ${c[0] + r} ${c[1]} Z" fill="#DCEBFA" fill-opacity=".8" stroke="#2F7BC0" stroke-width="2"/>` + Array.from({ length: 19 }, (_, i) => { const p = g1dAt(c, i * 10, r), q = g1dAt(c, i * 10, r - (i % 3 ? 8 : 14)); return g1dL(p, q, '#2F7BC0', 1.4); }).join('') + [0, 30, 60, 90, 120, 150, 180].map(d => { const p = g1dAt(c, d, r - 26); return e1dTx(p[0], p[1] + 5, String(d), '#2F7BC0', 'r4d-sm'); }).join('') + `<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="#2F7BC0"/>`;
/* two parallel lines cut by a transversal: centres of the crossings and the 8 angle numbers */
const G1T = (() => { const t = 62, A = [190, 80], B = [190 - 90 / Math.tan(t * Math.PI / 180), 170], u = [Math.cos(t * Math.PI / 180), -Math.sin(t * Math.PI / 180)]; return { t, A, B, u, SEC: [[0, t], [t, 180], [180, 180 + t], [180 + t, 360]] }; })();
/* angle n (numbered like the game MG_PAIR: 1 upper right, 2 upper left, 3 lower left, 4 lower right · 5–8 the same at m): its arc, and a label (number or text) */
const g1dTA = (n, col, lab, r = 22) => { const c = n <= 4 ? G1T.A : G1T.B, [a0, a1] = G1T.SEC[(n - 1) % 4], m = g1dAt(c, (a0 + a1) / 2, lab && lab.length > 2 ? 44 : 38); return (col ? g1dArc(c, r, a0, a1, col, 5) : '') + e1dTx(m[0], m[1] + 6, lab || String(n), col || G1C.fade, 'r4d-tx'); };
const g1dTAp = (n, r = 38) => { const c = n <= 4 ? G1T.A : G1T.B, [a0, a1] = G1T.SEC[(n - 1) % 4]; return g1dAt(c, (a0 + a1) / 2, r); };
const g1dTArc = (n, col) => { const c = n <= 4 ? G1T.A : G1T.B, [a0, a1] = G1T.SEC[(n - 1) % 4]; return g1dArc(c, 22, a0, a1, col, 5); };
const g1dTrans = (hl, labs = {}) => { const { A, B, u } = G1T; let s = g1dL([20, 80], [340, 80]) + g1dL([20, 170], [340, 170]) + g1dL([B[0] - u[0] * 70, B[1] - u[1] * 70], [A[0] + u[0] * 70, A[1] + u[1] * 70], G1C.o) + e1dTx(334, 70, 'ℓ', G1C.ink, 'r4d-tx') + e1dTx(334, 160, 'm', G1C.ink, 'r4d-tx');
  for (let n = 1; n <= 8; n++) if (!labs.skip || !labs.skip.includes(n)) s += g1dTA(n, hl && hl[n], labs[n]); return s; };
const G1D_TEACH = {
  /* ด่าน 1 รูปพื้นฐาน */
  2201: L => { const O = L.teach.slice(), A = [130, 110], B = [230, 110], V = [110, 175], Bp = [310, 175], Cp = g1dAt(V, 55, 190);
    return [
      g1dSee('จุด และ เส้นตรง', '<b>แตะรูป</b> — ดูว่าแต่ละอย่างหยุดตรงไหน', [
        { t: 'จุด', f: on => g1dP([180, 110], 'A', G1C.ink, 0, -16) + (on ? r4vH(e1dTx(180, 180, 'จุด A', G1C.b, 'r4v-big')) : ''), s: 'จุดบอก<b>ตำแหน่ง</b> ไม่มีความกว้าง ความยาว<br>ตั้งชื่อด้วยตัวอักษร เช่น จุด A' },
        { t: 'เส้นตรง', f: on => g1dL([60, 110], [300, 110]) + g1dAh([200, 110], [300, 110]) + g1dAh([160, 110], [60, 110]) + g1dP(A, 'A') + g1dP(B, 'B') + (on ? r4vH(g1dL([300, 110], [350, 110], G1C.p, 3, '6 6') + g1dL([60, 110], [10, 110], G1C.p, 3, '6 6') + e1dTx(180, 150, 'ยาวไปไม่สิ้นสุดทั้งสองทาง', G1C.p, 'r4d-sm') + g1dSym('line', 180, 216)) : ''), s: 'ยาว<b>ไม่สิ้นสุดทั้งสองทาง</b><br>เขียน AB มีลูกศรสองหัวอยู่ข้างบน' }]),
      g1dSee('ส่วนของเส้นตรง และ รังสี', '<b>แตะรูป</b> — นับจุดปลาย', [
        { t: 'ส่วนของเส้นตรง', f: on => g1dL([90, 110], [270, 110]) + g1dP([90, 110], 'A') + g1dP([270, 110], 'B') + (on ? r4vH(g1dRuler(80, 124, 200) + e1dTx(180, 172, 'วัดได้ 5 ซม.', G1C.o, 'r4d-sm') + g1dSym('seg', 180, 222)) : ''), s: 'มีจุดปลาย <b>2</b> จุด วัดความยาวได้<br>เขียน AB มีขีดอยู่ข้างบน' },
        { t: 'รังสี', f: on => g1dL([70, 110], [300, 110]) + g1dAh([200, 110], [300, 110]) + g1dP([70, 110], 'A') + g1dP([200, 110], 'B') + (on ? r4vH(g1dL([300, 110], [350, 110], G1C.p, 3, '6 6') + `<circle cx="70" cy="110" r="12" fill="none" stroke="${G1C.g}" stroke-width="2.4"/>` + e1dTx(70, 150, 'จุดเริ่ม', G1C.g, 'r4d-sm') + g1dSym('ray', 180, 216)) : ''), s: 'มีจุดปลาย <b>1</b> จุด (จุดเริ่ม A) ยาวไปทางเดียว<br>เขียน AB มีลูกศรหัวเดียว จุดเริ่มเขียนก่อน' }]),
      g1dTry(2201, ['kind', 'sym'], 'จุด เส้น รังสี'),
      g1dSee('มุม: จุดยอดและแขน', '<b>แตะรูป</b> — จุดยอดอยู่ตรงไหนในชื่อมุม', [
        { t: '∠BAC', f: on => g1dL(V, Bp) + g1dL(V, Cp) + g1dP(V, 'A', G1C.ink, -14, 6) + g1dP(Bp, 'B', G1C.ink, 0, 26) + g1dP(Cp, 'C', G1C.ink, 14, 0) + g1dArc(V, 30, 0, 55, G1C.o)
          + (on ? r4vH(`<circle cx="${V[0]}" cy="${V[1]}" r="14" fill="none" stroke="${G1C.p}" stroke-width="2.6"/>` + e1dTx(V[0], V[1] + 34, 'จุดยอด', G1C.p, 'r4d-sm') + g1dL(V, Bp, G1C.b, 5) + g1dL(V, Cp, G1C.b, 5) + e1dTx(250, 162, 'แขน AB', G1C.b, 'r4d-sm') + e1dTx(150, 92, 'แขน AC', G1C.b, 'r4d-sm', 'end') + e1dTx(250, 60, '∠BAC', G1C.ink, 'r4v-big')) : ''), s: 'จุดยอด A อยู่<b>ตรงกลาง</b>ของชื่อ<br>∠BAC หรือ ∠CAB<br>แขนของมุมคือ AB และ AC' }]),
      g1dTry(2201, ['partv', 'parta'], 'จุดยอดและแขน'),
      g1dOld(O[2], 'hand'),
      g1dTry(2201, ['angk'], 'ชนิดของมุม'),
      g1dSee('เส้นตรงสองเส้น', '<b>แตะรูป</b> — ตัดกันหรือไม่ ตัดกันแบบไหน', [
        { t: 'ขนานกัน', f: on => g1dL([40, 80], [320, 80]) + g1dL([40, 170], [320, 170]) + e1dTx(332, 86, 'ℓ', G1C.ink, 'r4d-tx') + e1dTx(332, 176, 'm', G1C.ink, 'r4d-tx') + (on ? r4vH([90, 180, 270].map(x => g1dL([x, 84], [x, 166], G1C.b, 2.4, '5 5')).join('') + e1dTx(180, 222, 'ℓ ∥ m', G1C.b, 'r4v-big')) : ''), s: 'ห่างเท่ากันตลอด <b>ไม่ตัดกัน</b><br>เขียน ℓ ∥ m' },
        { t: 'ตั้งฉาก', f: on => g1dL([60, 150], [300, 150]) + g1dL([180, 40], [180, 200]) + g1dP([60, 150], 'A', G1C.ink, 0, -12) + g1dP([300, 150], 'B', G1C.ink, 0, -12) + g1dP([180, 40], 'C', G1C.ink, 14, 4) + g1dP([180, 200], 'D', G1C.ink, 14, 4) + (on ? r4vH(g1dRA([180, 150], 0, 16) + e1dTx(270, 220, 'AB ⊥ CD', G1C.p, 'r4v-big')) : ''), s: 'ตัดกันเป็น<b>มุมฉาก</b> (90°)<br>เขียน AB ⊥ CD' },
        { t: 'ตัดกัน', f: on => g1dL([50, 60], [310, 190]) + g1dL([50, 190], [310, 60]) + (on ? r4vH(g1dP([180, 125], 'O', G1C.p, 0, -14) + e1dTx(180, 222, 'ตัดกันที่จุด O จุดเดียว', G1C.p, 'r4d-sm')) : ''), s: 'มีจุดร่วม<b>จุดเดียว</b><br>เรียกว่าจุดตัด' }]),
      g1dTry(2201, ['relpar', 'relperp', 'relcut', 'prop1'], 'เส้นตรงสองเส้น')]; },

  /* ด่าน 2 เครื่องมือ */
  2202: L => { const O = L.teach.slice(), c = [180, 125];
    return [
      g1dSee('เครื่องมือ', '<b>แตะรูป</b> — แต่ละอย่างใช้ทำอะไร', [
        { t: 'วงเวียน', f: on => `<circle cx="180" cy="160" r="60" fill="none" stroke="${G1C.fade}" stroke-width="2" stroke-dasharray="5 6"/>` + g1dCompass([200, 40], [180, 160], g1dAt([180, 160], 20, 60)) + (on ? r4vH(g1dArc([180, 160], 60, -40, 200, G1C.p, 3) + e1dTx(180, 232, 'เขียนวงกลม ส่วนโค้ง ลอกความยาว', G1C.p, 'r4d-sm')) : ''), s: '<b>วงเวียน</b>: เขียนวงกลม ส่วนโค้ง<br>และลอกความยาว' },
        { t: 'สันตรง', f: on => g1dRuler(50, 110, 260) + (on ? r4vH(g1dL([58, 104], [302, 104], G1C.p, 3.5) + e1dTx(180, 182, 'ลากเส้นตรงตามขอบ', G1C.p, 'r4d-sm')) : ''), s: '<b>สันตรง</b> (ไม้บรรทัด): ลากเส้นตรง<br>ในการสร้าง ไม่ใช้ตัวเลขบนไม้บรรทัด' },
        { t: 'โพรแทรกเตอร์', f: on => g1dProt([180, 190], 140) + (on ? r4vH(g1dL([180, 190], g1dAt([180, 190], 60, 150), G1C.p, 3.5) + g1dL([180, 190], [330, 190], G1C.p, 3.5) + e1dTx(240, 120, '60°', G1C.p, 'r4v-big')) : ''), s: '<b>โพรแทรกเตอร์</b> (ครึ่งวงกลม): วัดมุม<br>และสร้างมุมตามองศาที่กำหนด' }]),
      g1dTry(2202, ['tool0', 'tool1', 'tool2', 'tool3', 'tool4', 'tool5'], 'เลือกเครื่องมือ'),
      g1dSee('การวัด กับ การสร้าง', '<b>แตะรูป</b> — ใช้ตัวเลขหรือไม่', [
        { t: 'การวัด', f: on => g1dL([80, 100], [280, 100]) + g1dP([80, 100], 'A') + g1dP([280, 100], 'B') + g1dRuler(72, 106, 216) + (on ? r4vH(e1dTx(180, 186, 'อ่านตัวเลข: AB = 5 ซม.', G1C.o, 'r4v-tx')) : ''), s: '<b>วัด</b> = อ่านตัวเลขจากเครื่องมือ<br>AB ยาว 5 ซม.' },
        { t: 'การสร้าง', f: on => g1dL([60, 70], [200, 70]) + g1dP([60, 70], 'A') + g1dP([200, 70], 'B') + g1dL([60, 180], [320, 180]) + g1dP([60, 180], 'C', G1C.ink, 0, 22) + g1dAh([260, 180], [320, 180]) + (on ? r4vH(g1dCompass([130, 30], [60, 70], [200, 70]) + g1dArc([60, 180], 140, -14, 14, G1C.p, 3) + g1dP([200, 180], 'D', G1C.p, 0, 24)) : ''), s: '<b>สร้าง</b> = ใช้วงเวียนกับสันตรง<br>กางวงเวียนเท่า AB แล้วไปเขียนที่ C ได้ CD = AB<br>ไม่ต้องอ่านตัวเลข' }]),
      g1dTry(2202, ['cons'], 'การวัด กับ การสร้าง'),
      g1dSee('จุดศูนย์กลาง และ รัศมี', '<b>แตะรูป</b> — วัดจาก O ไปที่ขอบวงกลม', [
        { t: 'วงกลม', f: on => `<circle cx="${c[0]}" cy="${c[1]}" r="85" fill="none" stroke="${G1C.ink}" stroke-width="3"/>` + g1dP(c, 'O', G1C.ink, -12, -8) + (on ? r4vH([30, 110, 200, 300].map(a => g1dL(c, g1dAt(c, a, 85), G1C.b, 2.6) + e1dTx(...g1dAt(c, a, 48), 'r', G1C.b, 'r4d-tx')).join('') + g1dL(g1dAt(c, 250, 85), g1dAt(c, 70, 85), G1C.p, 3, '6 5') + e1dTx(180, 232, 'เส้นผ่านศูนย์กลาง = 2r', G1C.p, 'r4d-sm')) : ''), s: 'ทุกจุดบนวงกลมห่างจาก O เท่ากัน = <b>รัศมี</b><br>เส้นผ่านศูนย์กลาง = 2 × รัศมี' }]),
      g1dOld(O[1], 'do'), O[2],
      g1dTry(2202, ['diam'], 'รัศมี'),
      g1dSee('จุดตัดของส่วนโค้ง', '<b>แตะรูป</b> — จุดที่ห่างจาก A และ B ตามที่กำหนด', [
        { t: 'A 4 ซม. B 3 ซม.', f: on => { const A = [90, 180], B = [270, 180], P = [210, 66]; return g1dL(A, B) + g1dP(A, 'A', G1C.ink, 0, 26) + g1dP(B, 'B', G1C.ink, 0, 26) + (on ? r4vH(g1dArc(A, Math.hypot(P[0] - A[0], P[1] - A[1]), 30, 75, G1C.b, 3) + g1dArc(B, Math.hypot(P[0] - B[0], P[1] - B[1]), 95, 140, G1C.o, 3) + g1dL(A, P, G1C.b, 2, '5 5') + g1dL(B, P, G1C.o, 2, '5 5') + g1dP(P, 'P', G1C.p, 0, -14) + e1dTx(128, 116, '4 ซม.', G1C.b, 'r4d-sm', 'end') + e1dTx(252, 116, '3 ซม.', G1C.o, 'r4d-sm', 'start')) : ''); }, s: 'ส่วนโค้งจาก A รัศมี 4 ซม. กับจาก B รัศมี 3 ซม.<br>ตัดกันที่ P → <b>PA = 4 ซม. PB = 3 ซม.</b>' }]),
      O[3],
      g1dOld(O[4], 'do'),
      g1dTry(2202, ['@mgm'], 'วัดมุม')]; },

  /* ด่าน 3 ลอกความยาว */
  2203: L => { const O = L.teach.slice();
    return [
      g1dSee('ลอกความยาวด้วยวงเวียน', '<b>แตะรูป</b> — ระยะกางวงเวียนคือความยาวที่ลอก', [
        { t: 'ลอก AB', f: on => g1dL([60, 70], [200, 70]) + g1dP([60, 70], 'A') + g1dP([200, 70], 'B') + g1dL([60, 180], [330, 180]) + g1dP([60, 180], 'C', G1C.ink, 0, 22) + g1dCompass([130, 28], [60, 70], [200, 70]) + (on ? r4vH(g1dArc([60, 180], 140, -14, 14, G1C.p, 3) + g1dP([200, 180], 'D', G1C.p, 0, 24) + g1dTk([60, 70], [200, 70], 1) + g1dTk([60, 180], [200, 180], 1)) : ''), s: 'กางวงเวียนจาก A ถึง B แล้ว<b>ห้ามเปลี่ยนรัศมี</b><br>ยกไปวางที่ C เขียนส่วนโค้ง ได้ CD = AB' }]),
      g1dOld(O[0], 'do'), O[1],
      g1dTry(2203, ['cpstep', 'trace'], 'ลอกความยาว'),
      g1dSee('บวก ลบ ความยาว', '<b>แตะรูป</b> — ต่อกัน หรือ ย้อนกลับ', [
        { t: 'AB + CD', f: on => `<rect x="40" y="50" width="150" height="22" fill="#9FD0F0" stroke="${G1C.ink}"/><rect x="200" y="50" width="90" height="22" fill="#FFC24C" stroke="${G1C.ink}"/>` + e1dTx(115, 44, 'AB', G1C.b, 'r4d-sm') + e1dTx(245, 44, 'CD', G1C.o, 'r4d-sm')
          + (on ? r4vH(`<rect x="40" y="130" width="150" height="22" fill="#9FD0F0" stroke="${G1C.ink}"/><rect x="190" y="130" width="90" height="22" fill="#FFC24C" stroke="${G1C.ink}"/>` + g1dP([40, 175], 'P', G1C.ink, 0, 22) + g1dP([280, 175], 'R', G1C.ink, 0, 22) + g1dL([40, 175], [280, 175], G1C.g, 3) + e1dTx(160, 220, 'PR = AB + CD (ต่อออกไป)', G1C.g, 'r4d-sm')) : ''), s: '<b>บวก</b>: ลอก AB แล้วลอก CD ต่อ<b>ออกไป</b>ข้างหน้า' },
        { t: 'AB − CD', f: on => `<rect x="40" y="50" width="200" height="22" fill="#9FD0F0" stroke="${G1C.ink}"/><rect x="250" y="50" width="80" height="22" fill="#FFC24C" stroke="${G1C.ink}"/>` + e1dTx(140, 44, 'AB', G1C.b, 'r4d-sm') + e1dTx(290, 44, 'CD', G1C.o, 'r4d-sm')
          + (on ? r4vH(`<rect x="40" y="130" width="200" height="22" fill="#9FD0F0" stroke="${G1C.ink}"/><rect x="160" y="130" width="80" height="22" fill="#FFC24C" fill-opacity=".85" stroke="${G1C.ink}"/>` + g1dP([40, 175], 'P', G1C.ink, 0, 22) + g1dP([160, 175], 'R', G1C.ink, 0, 22) + g1dL([40, 175], [160, 175], G1C.g, 3) + e1dTx(180, 220, 'PR = AB − CD (ย้อนกลับเข้ามา)', G1C.g, 'r4d-sm')) : ''), s: '<b>ลบ</b>: ลอก AB แล้วลอก CD <b>ย้อนกลับ</b>เข้ามา' }]),
      g1dOld(O[2], 'do'), O[3], g1dOld(O[4], 'do'), O[5],
      g1dTry(2203, ['segadd', 'segsub', 'dfstep'], 'บวก ลบ ความยาว'),
      O[6],
      g1dTry(2203, ['segtwo', 'segmix'], 'หลายเท่าของความยาว')]; },

  /* ด่าน 4 จุดกึ่งกลาง */
  2204: L => { const O = L.teach.slice(), A = [60, 130], B = [300, 130], M = [180, 130];
    return [
      g1dSee('จุดกึ่งกลาง', '<b>แตะรูป</b> — M แบ่ง AB ออกเป็นสองส่วนเท่ากัน', [
        { t: 'M กึ่งกลาง AB', f: on => g1dL(A, B) + g1dP(A, 'A') + g1dP(B, 'B') + (on ? r4vH(g1dP(M, 'M', G1C.p) + g1dTk(A, M, 1) + g1dTk(M, B, 1) + e1dTx(180, 190, 'AM = MB = AB ÷ 2', G1C.p, 'r4v-tx')) : e1dTx(180, 190, 'M อยู่ตรงไหน', G1C.fade, 'r4v-tx')), s: 'M อยู่บน AB และ <b>AM = MB</b><br>แต่ละส่วนยาวครึ่งหนึ่งของ AB' },
        { t: 'เส้นตั้งฉากแบ่งครึ่ง', f: on => g1dL(A, B) + g1dP(A, 'A') + g1dP(B, 'B') + (on ? r4vH(g1dArc(A, 150, -40, 40, G1C.b, 2.4) + g1dArc(B, 150, 140, 220, G1C.b, 2.4) + g1dL([180, 20], [180, 230], G1C.p, 3) + g1dRA(M, 0, 14) + g1dP(M, 'M', G1C.p, 14, -10)) : ''), s: 'ส่วนโค้งจาก A และ B (รัศมีเท่ากัน ยาวกว่าครึ่ง AB)<br>ตัดกันสองจุด ลากเส้นผ่านได้<b>เส้นตั้งฉากแบ่งครึ่ง</b>' }]),
      g1dTry(2204, ['half'], 'จุดกึ่งกลาง'),
      g1dOld(O[1], 'do'), O[2],
      g1dTry(2204, ['bisr', 'bisa', 'trace'], 'การแบ่งครึ่ง'),
      g1dOld(O[3], 'hand'),
      g1dTry(2204, ['pbeq'], 'จุดบนเส้นตั้งฉากแบ่งครึ่ง'),
      O[4],
      g1dTry(2204, ['quart'], 'แบ่ง 4 ส่วน')]; },

  /* ด่าน 5 สร้างมุม ลอกมุม */
  2205: L => { const O = L.teach.slice(), V = [70, 190];
    return [
      g1dSee('ขนาดของมุม', '<b>แตะรูป</b> — แขนยาวหรือสั้น มุมเท่าเดิมไหม', [
        { t: 'แขนสั้น กับ แขนยาว', f: on => { const V2 = [200, 190]; return g1dL(V, g1dAt(V, 0, 90)) + g1dL(V, g1dAt(V, 50, 90)) + g1dL(V2, g1dAt(V2, 0, 150)) + g1dL(V2, g1dAt(V2, 50, 170)) + g1dArc(V, 26, 0, 50, G1C.o) + g1dArc(V2, 26, 0, 50, G1C.o) + (on ? r4vH(e1dTx(115, 222, '50°', G1C.p, 'r4v-big') + e1dTx(270, 222, '50°', G1C.p, 'r4v-big')) : ''); }, s: 'ขนาดของมุมขึ้นกับ<b>การกางแขน</b><br>ไม่ขึ้นกับความยาวของแขน' },
        { t: 'วัดด้วยโพรแทรกเตอร์', f: on => g1dProt([180, 200], 140) + g1dL([180, 200], [340, 200], G1C.ink, 3) + g1dL([180, 200], g1dAt([180, 200], 65, 160), G1C.ink, 3) + (on ? r4vH(`<circle cx="180" cy="200" r="10" fill="none" stroke="${G1C.p}" stroke-width="2.6"/>` + g1dArc([180, 200], 140, 0, 65, G1C.p, 5) + e1dTx(270, 90, '65°', G1C.p, 'r4v-big')) : ''), s: 'วางจุดศูนย์กลางที่<b>จุดยอด</b> ให้ 0° ทับแขนหนึ่ง<br>อ่านที่อีกแขน (นับจาก 0° ฝั่งเดียวกัน)' }]),
      g1dTry(2205, ['partv', 'parta', 'protc', 'armlen'], 'ส่วนประกอบของมุม'),
      g1dTry(2205, ['@mgm'], 'วัดมุม'),
      g1dOld(O[0], 'do'), O[1],
      g1dSee('ลอกมุม', '<b>แตะรูป</b> — ใช้รัศมีเดิมสองครั้ง', [
        { t: 'ลอก ∠ABC', f: on => { const B = [50, 150], D = [210, 150], a = 48; return g1dL(B, g1dAt(B, 0, 130)) + g1dL(B, g1dAt(B, a, 130)) + g1dP(B, 'B', G1C.ink, -10, 18) + g1dL(D, g1dAt(D, 0, 130)) + g1dP(D, 'O', G1C.ink, -10, 18) + g1dArc(B, 60, -5, a + 8, G1C.b) + g1dArc(D, 60, -5, a + 8, G1C.b)
          + (on ? r4vH(g1dL(g1dAt(B, 0, 60), g1dAt(B, a, 60), G1C.p, 2.4, '4 4') + g1dArc(g1dAt(D, 0, 60), Math.hypot(...[0, 1].map(i => g1dAt(B, 0, 60)[i] - g1dAt(B, a, 60)[i])), 70, 110, G1C.p, 2.6) + g1dL(D, g1dAt(D, a, 140), G1C.g, 3) + e1dTx(180, 220, '∠XOY = ∠ABC', G1C.g, 'r4v-tx')) : ''); }, s: 'โค้งรัศมีเดียวกันที่มุมเดิมและที่ O<br>กางวงเวียนเท่า<b>ระยะระหว่างจุดตัด</b>บนมุมเดิม แล้วตัดซ้ำ<br>ลากผ่านจุดตัด ได้มุมเท่ากัน' }]),
      g1dOld(O[2], 'do'), O[3],
      g1dTry(2205, ['cpang'], 'ลอกมุม')]; },

  /* ด่าน 6 แบ่งครึ่งมุม */
  2206: L => { const O = L.teach.slice(), V = [70, 200];
    return [
      g1dSee('เส้นแบ่งครึ่งมุม', '<b>แตะรูป</b> — แบ่งมุมออกเป็นสองมุมเท่ากัน', [
        { t: '∠AOB = 80°', f: on => g1dL(V, g1dAt(V, 0, 260)) + g1dL(V, g1dAt(V, 80, 190)) + g1dP(V, 'O', G1C.ink, -12, 16) + g1dP(g1dAt(V, 0, 240), 'A', G1C.ink, 0, 24) + g1dP(g1dAt(V, 80, 180), 'B', G1C.ink, 14, 6) + g1dArc(V, 30, 0, 80, G1C.o)
          + (on ? r4vH(g1dL(V, g1dAt(V, 40, 270), G1C.p, 3.5) + g1dP(g1dAt(V, 40, 250), 'C', G1C.p, 10, -6) + g1dArc(V, 48, 0, 40, G1C.b, 4) + g1dArc(V, 58, 40, 80, G1C.g, 4) + e1dTx(...g1dAt(V, 20, 90), '40°', G1C.b, 'r4d-tx') + e1dTx(...g1dAt(V, 62, 92), '40°', G1C.g, 'r4d-tx')) : e1dTx(...g1dAt(V, 40, 70), '80°', G1C.o, 'r4d-tx')), s: 'OC แบ่งครึ่ง ∠AOB<br>∠AOC = ∠COB = 80° ÷ 2 = <b>40°</b>' }]),
      g1dTry(2206, ['bisn', 'bisrev', 'bis2'], 'ขนาดมุมที่แบ่งครึ่ง'),
      g1dOld(O[0], 'do'),
      g1dTry(2206, ['bisstep', 'trace'], 'ขั้นตอนการแบ่งครึ่งมุม'),
      g1dOld(O[1], 'hand'),
      g1dTry(2206, ['bisprop'], 'จุดบนเส้นแบ่งครึ่งมุม'),
      O[2]]; },

  /* ด่าน 7 มุมขนาดต่าง ๆ */
  2207: L => { const O = L.teach.slice(), A = [90, 200], B = [270, 200], C = [180, 200 - 180 * Math.sqrt(3) / 2];
    const chip = (x, y, t, col, w = 68) => e1dChip(x - w / 2, y - 24, w, t, col);
    return [
      g1dSee('มุม 60° มาจากสามเหลี่ยมด้านเท่า', '<b>แตะรูป</b> — รัศมีเท่ากันทุกครั้ง', [
        { t: 'มุม 60°', f: on => g1dL(A, [330, 200]) + g1dP(A, 'O', G1C.ink, -12, 18) + g1dArc(A, 180, 0, 70, G1C.b, 2.4) + (on ? r4vH(g1dArc(B, 180, 110, 130, G1C.o, 2.6) + g1dP(B, '', G1C.ink) + g1dP(C, '', G1C.p) + g1dL(A, g1dAt(A, 60, 230), G1C.p, 3.5) + g1dL(B, C, G1C.fade, 2, '5 5') + g1dTk(A, B, 1, G1C.b) + g1dTk(B, C, 1, G1C.b) + g1dTk(A, C, 1, G1C.b) + g1dArc(A, 34, 0, 60, G1C.p) + e1dTx(140, 186, '60°', G1C.p, 'r4d-tx')) : ''), s: 'โค้งจาก O แล้วโค้งจากจุดตัด<b>รัศมีเดิม</b><br>ได้สามเหลี่ยมด้านเท่า มุมละ <b>60°</b>' }]),
      g1dOld(O[1], 'do'), O[2],
      g1dSee('มุมอื่น ๆ ได้จากแบ่งครึ่งและรวมมุม', '<b>แตะรูป</b> — เริ่มจาก 60° และ 90°', [
        { t: 'แบ่งครึ่ง', f: on => chip(70, 60, '60°', G1C.b) + chip(70, 160, '90°', G1C.o) + (on ? r4vH(g1dL([106, 60], [146, 60], G1C.ink, 2) + g1dAh([106, 60], [150, 60]) + chip(186, 60, '30°', G1C.b) + g1dL([222, 60], [262, 60], G1C.ink, 2) + g1dAh([222, 60], [266, 60]) + chip(300, 60, '15°', G1C.b) + g1dL([106, 160], [146, 160], G1C.ink, 2) + g1dAh([106, 160], [150, 160]) + chip(186, 160, '45°', G1C.o) + g1dL([222, 160], [262, 160], G1C.ink, 2) + g1dAh([222, 160], [266, 160]) + chip(300, 160, '22.5°', G1C.o) + e1dTx(180, 112, 'แบ่งครึ่ง', G1C.p, 'r4d-sm')) : ''), s: 'แบ่งครึ่ง 60° ได้ 30° แล้ว 15°<br>แบ่งครึ่ง 90° ได้ 45°' },
        { t: 'รวม และ มุมบนเส้นตรง', f: on => chip(80, 60, '60° + 45°', G1C.g, 120) + chip(80, 160, '180° − 30°', G1C.g, 120) + (on ? r4vH(g1dL([146, 60], [200, 60], G1C.ink, 2) + g1dAh([146, 60], [204, 60]) + chip(250, 60, '105°', G1C.p) + g1dL([146, 160], [200, 160], G1C.ink, 2) + g1dAh([146, 160], [204, 160]) + chip(250, 160, '150°', G1C.p)) : ''), s: 'นำมุมมาต่อกัน: 60° + 45° = 105°<br>มุมบนเส้นตรง: 180° − 30° = 150°' }]),
      g1dTry(2207, ['cant', 'a75', 'a150', 'a90'], 'สร้างมุมได้อย่างไร'),
      g1dOld(O[3], 'do'), O[4],
      g1dTry(2207, ['a225', 'a6030', 'a105'], 'แบ่งครึ่ง และ รวมมุม'),
      g1dOld(O[5], 'do'), O[6],
      g1dTry(2207, ['adiff', 'trace'], 'รวม ลบ มุม'),
      O[7]]; },

  /* ด่าน 8 เส้นตั้งฉาก */
  2208: L => { const O = L.teach.slice(), P = [180, 50], F = [180, 190];
    return [
      g1dSee('เส้นตั้งฉากที่จุดบนเส้นตรง', '<b>แตะรูป</b> — จุดตัดของส่วนโค้งสองจุดอยู่ห่าง P เท่ากัน', [
        { t: 'ที่จุด P', f: on => g1dL([30, 190], [330, 190]) + g1dP(F, 'P', G1C.ink, 0, 24) + (on ? r4vH(g1dArc(F, 80, 165, 195, G1C.b) + g1dArc(F, 80, -15, 15, G1C.b) + g1dP([100, 190], '', G1C.b) + g1dP([260, 190], '', G1C.b) + g1dArc([100, 190], 130, 50, 75, G1C.o) + g1dArc([260, 190], 130, 105, 130, G1C.o) + g1dL(F, [180, 30], G1C.p, 3.5) + g1dRA(F, 0, 16)) : ''), s: 'โค้งจาก P ตัดเส้นสองข้าง (ห่าง P เท่ากัน)<br>แล้วโค้งจากสองจุดนั้น ตัดกันด้านบน<br>ลากผ่าน P ได้<b>มุมฉาก</b>' }]),
      g1dOld(O[0], 'do'), O[1],
      g1dTry(2208, ['perpn', 'perpsym'], 'เส้นตั้งฉาก'),
      g1dSee('ระยะห่างจากจุดถึงเส้นตรง', '<b>แตะรูป</b> — เส้นไหนสั้นที่สุด', [
        { t: 'จาก P ถึง AB', f: on => g1dL([30, 190], [330, 190]) + g1dP(P, 'P', G1C.ink, 0, -12) + [60, 110, 250, 310].map(x => g1dL(P, [x, 190], G1C.fade, 2.4)).join('') + (on ? r4vH(g1dL(P, F, G1C.p, 4) + g1dRA(F, 0, 14) + e1dTx(212, 130, 'สั้นที่สุด', G1C.p, 'r4d-sm', 'start')) : ''), s: 'เส้นที่<b>ตั้งฉาก</b>กับ AB สั้นที่สุด<br>ความยาวนี้คือระยะห่างระหว่างจุด P กับเส้นตรง' }]),
      g1dOld(O[3], 'hand'),
      g1dTry(2208, ['dist', 'distn'], 'ระยะห่าง'),
      g1dOld(O[2], 'do'), O[4]]; },

  /* ด่าน 9 เส้นขนานและเส้นตัด */
  2209: L => { const O = L.teach.slice();
    return [
      g1dSee('มุมสมนัย และ มุมแย้ง', '<b>แตะรูป</b> — ดูตำแหน่งของคู่มุม', [
        { t: 'มุมสมนัย', f: on => g1dTrans(on ? { 1: G1C.b, 5: G1C.b } : null), s: '<b>มุมสมนัย</b> (เช่น 1 กับ 5)<br>อยู่ตำแหน่งเดียวกันที่จุดตัดแต่ละจุด<br>ถ้า ℓ ∥ m จะเท่ากัน' },
        { t: 'มุมแย้ง', f: on => g1dTrans(on ? { 3: G1C.p, 5: G1C.p } : null), s: '<b>มุมแย้ง</b> (เช่น 3 กับ 5)<br>อยู่ระหว่างเส้นขนาน คนละข้างของเส้นตัด<br>ถ้า ℓ ∥ m จะเท่ากัน' }]),
      g1dSee('มุมภายในบนข้างเดียวกัน', '<b>แตะรูป</b> — มุมคู่นี้รวมกันได้เท่าไร', [
        { t: 'มุมภายในข้างเดียวกัน', f: on => g1dTrans(on ? { 3: G1C.g, 6: G1C.g } : null) + (on ? r4vH(e1dTx(260, 228, '∠3 + ∠6 = 180°', G1C.g, 'r4v-tx')) : ''), s: '<b>มุมภายในบนข้างเดียวกัน</b> (เช่น 3 กับ 6)<br>ถ้า ℓ ∥ m รวมกันได้ <b>180°</b>' }]),
      g1dOld(O[1], 'hand'),
      g1dTry(2209, ['paircorr', 'pairalt', 'pairco', 'pairvert'], 'ชื่อคู่มุม'),
      r4dShow('หาขนาดของมุมเมื่อเส้นขนานกัน', { fig: g1dTrans({ 1: G1C.b }, { 1: '62°', skip: [5, 6] }) + g1dTA(5, null, 'x') + g1dTA(6, null, 'y'), q: 'ℓ ∥ m และ ∠1 = 62° หาค่า x และ y',
        steps: [{ ink: g1dTArc(5, G1C.b) + e1dTx(g1dTAp(5)[0] + 12, g1dTAp(5)[1] + 6, '= 62°', G1C.b, 'r4d-tx', 'start'), w: 'x = 62°', n: '∠1 กับ ∠5 เป็นมุมสมนัย เท่ากัน' },
          { ink: g1dL([20, 170], [340, 170], G1C.g, 4) + g1dTArc(6, G1C.p), w: 'x + y = 180°', n: '∠5 กับ ∠6 อยู่บนเส้นตรง m' },
          { w: 'y = 180° − 62° = 118°', n: 'ลบ 62° ออกจาก 180°', ink: e1dTx(g1dTAp(6)[0] - 12, g1dTAp(6)[1] + 6, '118° =', G1C.p, 'r4d-tx', 'end') },
          { w: 'x = 62° และ y = 118°', n: 'ตรวจ: 62° + 118° = 180° ✓', ans: 1 }],
        fin: `มุมสมนัย มุมแย้ง <b>เท่ากัน</b>${r4vSep}มุมบนเส้นตรง และมุมภายในข้างเดียวกัน รวม <b>180°</b>`, say: 'มุมสมนัยและมุมแย้งเท่ากัน มุมบนเส้นตรงรวมกันได้หนึ่งร้อยแปดสิบองศา' }),
      g1dTry(2209, ['pairncorr', 'pairnalt', 'pairnco', 'par'], 'หาขนาดมุม'),
      g1dTry(2209, ['sum180', 'conv'], 'เส้นขนานหรือไม่')]; },

  /* ด่าน 10 สร้างเส้นขนาน */
  2210: L => { const O = L.teach.slice();
    return [
      g1dSee('สร้างเส้นขนานได้สองวิธี', '<b>แตะรูป</b> — ใช้มุมที่เท่ากัน หรือใช้เส้นตั้งฉาก', [
        { t: 'มุมสมนัยเท่ากัน', f: on => { const Q = [110, 190], P = g1dAt(Q, 60, 140); return g1dL([20, 190], [340, 190]) + e1dTx(30, 182, 'A', G1C.ink, 'r4d-tx') + e1dTx(330, 182, 'B', G1C.ink, 'r4d-tx') + g1dL(g1dAt(Q, 240, 30), g1dAt(Q, 60, 190), G1C.o) + g1dP(P, 'P', G1C.ink, -14, -4) + g1dArc(Q, 30, 0, 60, G1C.b, 3)
          + (on ? r4vH(g1dArc(P, 30, 0, 60, G1C.b, 3) + g1dL([20, P[1]], [340, P[1]], G1C.p, 3.5) + e1dTx(300, P[1] - 10, 'ขนาน AB', G1C.p, 'r4d-sm')) : ''); }, s: 'ลากเส้นตัดผ่าน P แล้ว<b>ลอกมุม</b>ที่ P ให้เท่ากับมุมที่ Q<br>มุมสมนัยเท่ากัน → เส้นที่ได้ขนานกับ AB' },
        { t: 'ตั้งฉากสองครั้ง', f: on => { const P = [180, 70]; return g1dL([20, 190], [340, 190]) + g1dP(P, 'P', G1C.ink, 14, -6) + (on ? r4vH(g1dL(P, [180, 190], G1C.b, 3) + g1dRA([180, 190], 0, 14, G1C.b) + g1dL([30, 70], [330, 70], G1C.p, 3.5) + g1dRA(P, 270, 14, G1C.p)) : ''); }, s: 'ลากเส้นจาก P <b>ตั้งฉาก</b>กับ AB<br>แล้วสร้างเส้นตั้งฉากกับเส้นนั้นที่ P อีกครั้ง<br>ตั้งฉากกับเส้นเดียวกัน → ขนานกัน' }]),
      g1dOld(O[0], 'do'), O[3],
      g1dTry(2210, ['pprop', 'pairncorr', 'pairnco', 'co70'], 'มุมกับเส้นขนาน'),
      g1dOld(O[1], 'do'), O[2],
      g1dTry(2210, ['pperp', 'pdist', 'trace'], 'เส้นขนานจากเส้นตั้งฉาก')]; },

  /* ด่าน 11 สามเหลี่ยม */
  2211: L => { const O = L.teach.slice(), tri = (P, ticks, lab, fill) => g1dPoly(P, G1C.ink, fill) + (ticks || []).map(([i, n]) => g1dTk(P[i], P[(i + 1) % 3], n, G1C.p)).join('') + (lab ? e1dTx(180, 228, lab, G1C.p, 'r4d-sm') : '');
    const E = [[110, 190], [250, 190], [180, 190 - 140 * Math.sqrt(3) / 2]], I = [[100, 190], [260, 190], [180, 40]], S = [[70, 190], [300, 190], [130, 70]];
    return [
      g1dSee('ชนิดของสามเหลี่ยมตามด้าน', '<b>แตะรูป</b> — ขีดเท่ากัน = ด้านยาวเท่ากัน', [
        { t: 'ด้านเท่า', f: on => tri(E, on && [[0, 1], [1, 1], [2, 1]], on && 'ยาวเท่ากันทั้ง 3 ด้าน', '#DCEBFA'), s: '<b>ด้านเท่า</b>: ยาวเท่ากันทั้งสามด้าน' },
        { t: 'หน้าจั่ว', f: on => tri(I, on && [[1, 2], [2, 2]], on && 'ยาวเท่ากัน 2 ด้าน', '#FFE3A3'), s: '<b>หน้าจั่ว</b>: ยาวเท่ากันสองด้าน' },
        { t: 'ด้านไม่เท่า', f: on => tri(S, on && [[0, 1], [1, 2], [2, 3]], on && 'ยาวไม่เท่ากันเลย', '#D4F1E2'), s: '<b>ด้านไม่เท่า</b>: ไม่มีด้านใดยาวเท่ากัน' }]),
      g1dSee('ชนิดของสามเหลี่ยมตามมุม', '<b>แตะรูป</b> — ดูมุมที่ใหญ่ที่สุด', [
        { t: 'มุมแหลม', f: on => tri(I, null, on && 'ทุกมุมเล็กกว่า 90°', '#DCEBFA') + (on ? r4vH([0, 1, 2].map(i => `<circle cx="${I[i][0]}" cy="${I[i][1]}" r="16" fill="none" stroke="${G1C.b}" stroke-width="2.4"/>`).join('')) : ''), s: '<b>มุมแหลม</b>: ทุกมุมเล็กกว่า 90°' },
        { t: 'มุมฉาก', f: on => { const R = [[90, 190], [290, 190], [90, 60]]; return tri(R, null, on && 'มีมุมฉาก 1 มุม', '#FFE3A3') + (on ? r4vH(g1dRA(R[0], 0, 16)) : ''); }, s: '<b>มุมฉาก</b>: มีมุมหนึ่งเป็น 90°' },
        { t: 'มุมป้าน', f: on => { const R = [[60, 190], [300, 190], [110, 110]]; return tri(R, null, on && 'มีมุมป้าน 1 มุม', '#D4F1E2') + (on ? r4vH(g1dArc(R[2], 22, 210, 360 - 28, G1C.p, 3)) : ''); }, s: '<b>มุมป้าน</b>: มีมุมหนึ่งใหญ่กว่า 90°' }]),
      g1dTry(2211, ['triS', 'triA'], 'ชนิดของสามเหลี่ยม'),
      g1dOld(O[1], 'hand'),
      g1dTry(2211, ['ineq', 'rng'], 'ด้านประกอบเป็นสามเหลี่ยมได้ไหม'),
      g1dOld(O[2], 'hand'),
      g1dTry(2211, ['third', 'ext'], 'มุมของสามเหลี่ยม'),
      g1dOld(O[3], 'do'), O[4], O[5],
      g1dTry(2211, ['tri11'], 'สร้างสามเหลี่ยม'),
      g1dOld(O[6], 'do'), O[7]]; },

  /* ด่าน 12 สี่เหลี่ยมและโจทย์ประยุกต์ */
  2212: L => { const O = L.teach.slice(), q = (P, extra, fill, lab) => g1dPoly(P, G1C.ink, fill) + (extra || '') + (lab ? e1dTx(180, 228, lab, G1C.p, 'r4d-sm') : '');
    const PA = [[70, 180], [250, 180], [300, 70], [120, 70]], RE = [[70, 180], [290, 180], [290, 70], [70, 70]], SQ = [[115, 190], [245, 190], [245, 60], [115, 60]], RH = [[180, 40], [280, 125], [180, 210], [80, 125]], KI = [[180, 40], [250, 100], [180, 210], [110, 100]];
    return [
      g1dSee('สี่เหลี่ยมด้านขนาน ผืนผ้า จัตุรัส', '<b>แตะรูป</b> — ดูด้านที่ขนานและมุม', [
        { t: 'ด้านขนาน', f: on => q(PA, on && g1dTk(PA[0], PA[1], 1) + g1dTk(PA[3], PA[2], 1) + g1dTk(PA[1], PA[2], 2) + g1dTk(PA[0], PA[3], 2), '#DCEBFA', on && 'ด้านตรงข้ามขนานและยาวเท่ากัน'), s: '<b>ด้านขนาน</b>: ด้านตรงข้ามขนานกันและยาวเท่ากัน' },
        { t: 'ผืนผ้า', f: on => q(RE, on && RE.map((p, i) => g1dRA(p, [0, 90, 180, 270][i], 14)).join(''), '#FFE3A3', on && 'มุมฉากทั้ง 4 มุม'), s: '<b>ผืนผ้า</b>: ด้านขนาน + มุมฉากทุกมุม' },
        { t: 'จัตุรัส', f: on => q(SQ, on && SQ.map((p, i) => g1dRA(p, [0, 90, 180, 270][i], 12) + g1dTk(p, SQ[(i + 1) % 4], 1)).join(''), '#D4F1E2', on && 'มุมฉากทุกมุม ด้านยาวเท่ากันทุกด้าน'), s: '<b>จัตุรัส</b>: มุมฉากทุกมุม และด้านยาวเท่ากันทุกด้าน' }]),
      g1dSee('ขนมเปียกปูน และ ว่าว', '<b>แตะรูป</b> — ดูด้านที่ยาวเท่ากันและเส้นทแยงมุม', [
        { t: 'ขนมเปียกปูน', f: on => q(RH, on && RH.map((p, i) => g1dTk(p, RH[(i + 1) % 4], 1)).join('') + g1dL(RH[0], RH[2], G1C.b, 2, '5 5') + g1dL(RH[1], RH[3], G1C.b, 2, '5 5') + g1dRA([180, 125], 0, 12, G1C.b), '#F7D7E3', on && 'ด้านเท่ากันทุกด้าน ทแยงมุมตั้งฉาก'), s: '<b>ขนมเปียกปูน</b>: ด้านยาวเท่ากันทุกด้าน<br>เส้นทแยงมุมตั้งฉากและแบ่งครึ่งกัน' },
        { t: 'ว่าว', f: on => q(KI, on && g1dTk(KI[0], KI[1], 1) + g1dTk(KI[3], KI[0], 1) + g1dTk(KI[1], KI[2], 2) + g1dTk(KI[2], KI[3], 2) + g1dL(KI[0], KI[2], G1C.b, 2, '5 5') + g1dL(KI[1], KI[3], G1C.b, 2, '5 5') + g1dRA([180, 100], 0, 12, G1C.b), '#E8E1FA', on && 'ด้านประชิดเท่ากันสองคู่'), s: '<b>ว่าว</b>: ด้านประชิดยาวเท่ากันสองคู่<br>เส้นทแยงมุมตั้งฉากกัน' }]),
      g1dTry(2212, ['q4rect', 'q4para', 'q4rh', 'q4diag'], 'สมบัติของสี่เหลี่ยม'),
      g1dTry(2212, ['q4ang', 'q4per', 'q4kite', 'q4cd'], 'หาขนาดมุมและความยาว'),
      (() => { const A = [60, 190], B = [260, 190], D = g1dAt(A, 60, 120), C = [D[0] + 200, D[1]], E = [A[0] + 80, 190], F = g1dAt(A, 60, 80);
        return r4dShow('สร้างรูปสี่เหลี่ยมด้านขนาน', { fig: '', q: 'สร้างรูปสี่เหลี่ยมด้านขนาน ABCD ให้ AB = 5 ซม. ∠A = 60° และ AD = 3 ซม.',
          steps: [{ ink: g1dL(A, B, G1C.ink, 3) + g1dP(A, 'A', G1C.ink, -10, 20) + g1dP(B, 'B', G1C.ink, 10, 20), w: 'AB = 5 ซม.', n: 'สร้างฐานก่อน' },
            { ink: g1dArc(A, 80, -4, 72, G1C.b, 2.2) + g1dArc(E, 80, 106, 132, G1C.b, 2.2) + g1dL(A, g1dAt(A, 60, 175), G1C.ink, 2.6), w: '∠A = 60°', n: 'รัศมีเดิมสองครั้ง ได้มุม 60°' },
            { ink: g1dArc(A, 120, 50, 70, G1C.o, 2.6) + g1dP(D, 'D', G1C.o, -14, -4), w: 'AD = 3 ซม.', n: 'กางวงเวียน 3 ซม. ตัดแขนของมุม' },
            { ink: g1dArc(D, 200, -9, 9, G1C.p, 2.6) + g1dArc(B, 120, 50, 70, G1C.p, 2.6) + g1dP(C, 'C', G1C.p, 14, -6), w: 'หาจุด C', n: 'จาก D รัศมีเท่า AB และจาก B รัศมีเท่า AD' },
            { ink: g1dL(B, C, G1C.g, 3) + g1dL(D, C, G1C.g, 3) + g1dTk(A, B, 1) + g1dTk(D, C, 1) + g1dTk(A, D, 2) + g1dTk(B, C, 2), w: 'ลาก BC และ DC', n: 'ด้านตรงข้ามยาวเท่ากัน ได้ ABCD', ans: 1 }],
          fin: `ด้านตรงข้าม<b>ยาวเท่ากัน</b>${r4vSep}จึงขนานกัน ได้รูปสี่เหลี่ยมด้านขนาน`, say: 'ด้านตรงข้ามยาวเท่ากัน จึงขนานกัน ได้รูปสี่เหลี่ยมด้านขนาน' }); })(), O[2],
      g1dOld(O[3], 'do'), O[4],
      g1dTry(2212, ['hex'], 'โจทย์หลายขั้นตอน')]; }
};
LESSONS_M1C2.forEach(L => { const f = G1D_TEACH[L.id]; if (f) { L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true; } });
