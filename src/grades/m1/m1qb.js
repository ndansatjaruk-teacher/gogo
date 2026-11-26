/* =========================================================
   ม.1 บทที่ 6 ลำน้ำสมการ — ด่านพิเศษ 2 ด่าน (v261 · ผู้ใช้ขอ) · prefix qb
   2622 หลังด่าน 13: แก้สมการล้วน 15 ข้อ แบบยาก จำนวนเต็มทั้งหมด (ไม่มีเศษส่วน ไม่มีทศนิยม ทั้งโจทย์และคำตอบ)
   2623 หลังด่าน 15: แก้สมการล้วน 15 ข้อ แบบยาก เน้นเศษส่วนและทศนิยม
   สุ่มใหม่ทุกครั้ง · ทุกข้อเลือกคำตอบ x ก่อน แล้วคำนวณค่าคงตัวให้ได้คำตอบนั้นพอดี · ข้อ 1 → 15 ยากขึ้นเรื่อย ๆ (diff = ลำดับข้อ)
   วางหลัง m1rd.js ใน order.txt (ใช้ lqSolve lqN lqLin จาก m1q.js / m1ql.js และ fqHTML)
   ========================================================= */
const qbR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const qbS = () => (Math.random() < .5 ? -1 : 1);
const qbNZ = (a, b) => qbS() * qbR(a, b);
/* "k(…)" with k = 1 → "(…)", k = −1 → "−(…)" */
const qbK = (k, inner) => `${k === 1 ? '' : k === -1 ? '−' : lqN(k)}(${inner})`;
/* "+ 7" / "− 7" after a term */
const qbPM = n => (n < 0 ? `− ${lqN(-n)}` : `+ ${lqN(n)}`);
/* "b − ax" (a constant first, then the x term) */
const qbCX = (b, a) => `${lqN(b)} ${a < 0 ? '+' : '−'} ${Math.abs(a) === 1 ? '' : lqN(Math.abs(a))}x`;
/* keep trying until the item is valid (whole numbers, not too big) */
const qbTry = mk => { for (let t = 0; t < 3000; t++) { const r = mk(); if (r) return r; } return null; };
const qbOK = (...v) => v.every(n => Number.isInteger(n) && Math.abs(n) <= 200);

/* ---------- 2622: จำนวนเต็มล้วน ---------- */
const QB_INT = [
  /* 1–3 ax + b = c ที่มีจำนวนลบ */
  () => qbTry(() => { const x = qbNZ(2, 12), a = qbNZ(3, 9), b = qbNZ(5, 30), c = a * x + b; return c && { e: `${lqLin(a, b)} = ${lqN(c)}`, x, h: `ย้าย ${lqN(b)} ก่อน แล้วหาร ${lqN(a)}` }; }),
  () => qbTry(() => { const x = qbNZ(2, 12), a = qbR(3, 9), b = qbR(10, 40), c = b - a * x; return c && { e: `${qbCX(b, a)} = ${lqN(c)}`, x, h: `ลบ ${b} ทั้งสองข้าง แล้วหาร −${a}` }; }),
  () => qbTry(() => { const x = qbNZ(2, 9), a = qbR(4, 9), b = qbR(3, 15), c = qbR(2, 9), d = -a * x - b + c; return qbOK(d) && d && { e: `${c} − ${lqLin(a, b).replace(/^/, '(') + ')'} = ${lqN(d)}`, x, h: 'ลบหน้าวงเล็บ เปลี่ยนเครื่องหมายทุกพจน์ในวงเล็บ' }; }),
  /* 4–6 x อยู่ทั้งสองข้าง */
  () => qbTry(() => { const x = qbNZ(2, 12), a = qbR(5, 11), d = qbR(2, a - 2), b = qbNZ(3, 25), e = a * x + b - d * x; return e && qbOK(e) && { e: `${lqLin(a, b)} = ${lqLin(d, e)}`, x, h: `ลบ ${d}x ทั้งสองข้าง แล้วแก้ต่อ` }; }),
  () => qbTry(() => { const x = qbNZ(2, 10), a = qbR(2, 7), d = qbR(2, 7), b = qbR(5, 30), e = b - a * x - d * x; return e && qbOK(e) && { e: `${qbCX(b, a)} = ${lqLin(d, e)}`, x, h: `บวก ${a}x ทั้งสองข้าง ให้ x อยู่ข้างขวา` }; }),
  () => qbTry(() => { const x = qbNZ(2, 10), a = qbNZ(2, 9), d = qbNZ(2, 9), b = qbNZ(3, 20); if (a === d) return null; const e = a * x + b - d * x; return e && qbOK(e) && { e: `${lqLin(a, b)} = ${lqLin(d, e)}`, x, h: 'รวม x ไว้ข้างหนึ่ง ค่าคงตัวไว้อีกข้าง ระวังเครื่องหมายลบ' }; }),
  /* 7–9 มีวงเล็บ */
  () => qbTry(() => { const x = qbNZ(2, 9), k = qbR(2, 5), a = qbR(2, 4), b = qbNZ(2, 9), d = qbR(1, 5); if (k * a === d) return null; const e = k * (a * x + b) - d * x; return e && qbOK(e) && { e: `${qbK(k, lqLin(a, b))} = ${lqLin(d, e)}`, x, h: `แจกแจง ${k} เข้าไปในวงเล็บก่อน` }; }),
  () => qbTry(() => { const x = qbNZ(2, 12), k = qbR(2, 5), b = qbR(2, 9), d = qbR(k + 1, k + 4), e = -k * (x - b) + d * x; return e && qbOK(e) && { e: `${qbK(-k, lqLin(1, -b))} + ${d}x = ${lqN(e)}`, x, h: `−${k} คูณเข้าไป: −${k}x + ${k * b}` }; }),
  () => qbTry(() => { const x = qbNZ(2, 12), k = qbR(3, 6), m = qbR(2, k - 1), b = qbR(1, 9), c = qbR(1, 9), e = k * (x + b) - m * (x - c); return e && qbOK(e) && { e: `${qbK(k, lqLin(1, b))} − ${qbK(m, lqLin(1, -c))} = ${lqN(e)}`, x, h: 'แจกแจงทั้งสองวงเล็บ (ลบหน้าวงเล็บ เปลี่ยนเครื่องหมาย)' }; }),
  /* 10–12 วงเล็บทั้งสองข้าง */
  () => qbTry(() => { const x = qbNZ(2, 12), k = qbR(3, 7), m = qbR(2, 6), b = qbNZ(1, 9); if (k === m) return null; const c = (k * (x - b) - m * x) / m; return qbOK(c) && c && { e: `${qbK(k, lqLin(1, -b))} = ${qbK(m, lqLin(1, c))}`, x, h: 'แจกแจงทั้งสองข้าง แล้วรวม x ไว้ข้างเดียว' }; }),
  () => qbTry(() => { const x = qbNZ(2, 10), k = qbR(2, 4), a = qbR(2, 4), b = qbNZ(1, 6), c = qbNZ(1, 9), m = qbR(2, 5); const L = k * (a * x + b) - (x - c), d = (L - m * x) / m; if (k * a - 1 === m) return null; return qbOK(d) && d && { e: `${qbK(k, lqLin(a, b))} − ${qbK(1, lqLin(1, -c))} = ${qbK(m, lqLin(1, d))}`, x, h: 'แจกแจงทุกวงเล็บ รวมพจน์ที่คล้ายกันก่อน' }; }),
  () => qbTry(() => { const x = qbNZ(2, 9), k = qbR(2, 4), a = qbR(2, 4), b = qbR(1, 9), m = qbR(2, 5), c = qbNZ(1, 9); if (-k * a === m) return null; const e = m * (x + c) + k * (a * x - b); return e && qbOK(e) && { e: `${qbK(-k, lqLin(a, -b))} = ${qbK(m, lqLin(1, c))} ${qbPM(-e)}`, x, h: `−${k} คูณเข้าไปทุกพจน์ แล้วรวม x ไว้ข้างเดียว` }; }),
  /* 13–15 วงเล็บซ้อน / หลายชั้น */
  () => qbTry(() => { const x = qbNZ(2, 9), k = qbR(2, 4), m = qbR(2, 4), b = qbR(1, 8); if (1 - m === 0) return null; const e = k * (x - m * (x - b)); return e && qbOK(e) && { e: `${k}[x − ${qbK(m, lqLin(1, -b))}] = ${lqN(e)}`, x, h: `ทำในวงเล็บเล็กก่อน: x − ${m}x + ${m * b}` }; }),
  () => qbTry(() => { const x = qbNZ(2, 9), a = qbR(5, 20), k = qbR(2, 4), b = qbR(2, 9), c = qbR(2, 5), m = qbR(2, 6); if (k * c === m) return null; const d = (a - k * (b - c * x) - m * x) / m; return qbOK(d) && d && { e: `${a} − ${qbK(k, `${b} − ${c}x`)} = ${qbK(m, lqLin(1, d))}`, x, h: `−${k}(${b} − ${c}x) = −${k * b} + ${k * c}x` }; }),
  () => qbTry(() => { const x = qbNZ(2, 9), k = qbR(2, 3), m = qbR(2, 4), b = qbR(1, 6), c = qbR(1, 6), n = qbR(2, 5); const L = k * (2 * x - m * (x + b)) + c * x, rhs = n * x; if (k * (2 - m) + c === n) return null; const d = L - rhs; return d && qbOK(d) && { e: `${k}[2x − ${qbK(m, lqLin(1, b))}] + ${c}x = ${lqLin(n, d)}`, x, h: 'วงเล็บในก่อน แล้ววงเล็บนอก รวม x ไว้ข้างเดียว' }; })
];
/* v263 (ผู้ใช้ขอ): ด่านพิเศษเหลือ 10 ข้อ — แต่ละกลุ่ม 3 แบบ (ง่าย → ยาก) สุ่มเลือก 2 แบบ ได้ 10 จาก 15 แบบ ยังเรียงง่าย → ยาก */
const qbTen = () => { const drop = new Set([0, 1, 2, 3, 4].map(g => g * 3 + Math.floor(Math.random() * 3))); return i => !drop.has(i); };
function qbIntGame() { const out = [], seen = new Set(), keep = qbTen();
  QB_INT.forEach((mk, i) => { if (!keep(i)) return; let q = null; for (let t = 0; t < 20 && (!q || seen.has(q.e)); t++) q = mk(); if (!q) return; seen.add(q.e); out.push(lqSolve(q.e, q.x, q.h, 'qi' + (i + 1), i + 1)); });
  return out; }

/* ---------- 2623: เศษส่วนและทศนิยม ---------- */
const qbD = v => lqN(Math.round(v * 1000) / 1000); /* a decimal written without float noise */
const qbF = (n, d) => fqHTML(n, d);
const QB_FD = [
  /* 1–5 เศษส่วน */
  () => qbTry(() => { const p = qbR(0, 2), [a, b] = [[2, 3], [3, 4], [2, 5], [4, 6], [3, 5]][qbR(0, 4)], L = a * b / (function g(m, n) { return n ? g(n, m % n) : m; })(a, b), x = L * qbNZ(1, 6), c = x / a + x / b; return Number.isInteger(c) && { e: `${qbF('x', a)} + ${qbF('x', b)} = ${lqN(c)}`, x, h: `คูณทั้งสองข้างด้วย ค.ร.น. ของ ${a} กับ ${b}` }; }),
  () => qbTry(() => { const [a, b] = [[2, 3], [3, 4], [2, 5], [4, 6], [3, 6]][qbR(0, 4)], x = qbNZ(2, 40), c = x / a - x / b; return Number.isInteger(c) && c && { e: `${qbF('x', a)} − ${qbF('x', b)} = ${lqN(c)}`, x, h: 'คูณด้วย ค.ร.น. ของตัวส่วน แล้วรวม x' }; }),
  () => qbTry(() => { const a = qbR(2, 5), b = qbR(1, 9), m = qbR(2, 5), x = qbNZ(1, 20), r = (m * x - b) / a; return Number.isInteger(r) && r && { e: `${qbF(`${m}x − ${b}`, a)} = ${lqN(r)}`, x, h: `คูณ ${a} ทั้งสองข้าง แล้วแก้ ${m}x − ${b}` }; }),
  () => qbTry(() => { const a = qbR(2, 6), b = qbR(2, 6); if (a === b) return null; const p = qbR(1, 6), x = qbNZ(1, 20), q = x - b * (x + p) / a; if (!Number.isInteger(q) || q < 1 || q > 12) return null; return { e: `${qbF(`x + ${p}`, a)} = ${qbF(`x − ${q}`, b)}`, x, h: 'คูณไขว้ แล้วแก้สมการ' }; }),
  () => qbTry(() => { const [a, b] = [[3, 4], [2, 3], [4, 6], [3, 5], [2, 5]][qbR(0, 4)], p = qbR(1, 5), q = qbR(1, 5), x = qbNZ(1, 25), N = (2 * x - p) * b - (x + q) * a, c = N / (a * b); return N % (a * b) === 0 && { e: `${qbF(`2x − ${p}`, a)} − ${qbF(`x + ${q}`, b)} = ${lqN(c)}`, x, h: 'คูณด้วย ค.ร.น. ตัวเศษหลายพจน์ใส่วงเล็บ ระวังลบหน้าวงเล็บ' }; }),
  /* 6–10 ทศนิยม */
  () => qbTry(() => { const a = qbR(2, 9) / 10, b = qbR(1, 30) / 10, x = qbNZ(2, 15), c = Math.round((a * x + b) * 10) / 10; return c && { e: `${qbD(a)}x + ${qbD(b)} = ${qbD(c)}`, x, h: 'คูณ 10 ทุกพจน์ ให้เป็นจำนวนเต็ม' }; }),
  () => qbTry(() => { const a = qbR(3, 9) / 10, d = qbR(1, 2) / 10; if (a <= d) return null; const b = qbR(1, 30) / 10, x = qbNZ(2, 15), e = Math.round((a * x - b - d * x) * 10) / 10; return e && { e: `${qbD(a)}x − ${qbD(b)} = ${qbD(d)}x ${qbPM(e)}`, x, h: 'คูณ 10 ทุกพจน์ แล้วรวม x ไว้ข้างเดียว' }; }),
  () => qbTry(() => { const a = [25, 75, 15, 35, 45][qbR(0, 4)] / 100, d = [5, 10, 20][qbR(0, 2)] / 100, b = qbR(1, 9) / 4, x = 4 * qbNZ(1, 10), e = Math.round((a * x + b - d * x) * 100) / 100; return e && Math.abs(e) < 100 && { e: `${qbD(a)}x + ${qbD(b)} = ${qbD(d)}x ${qbPM(e)}`, x, h: 'ทศนิยม 2 ตำแหน่ง คูณ 100 ทุกพจน์' }; }),
  () => qbTry(() => { const k = qbR(11, 19) / 10, m = qbR(2, 9) / 10, b = qbR(1, 9), x = qbNZ(2, 15), e = Math.round((k * (x - b) - m * x) * 100) / 100; return e && { e: `${qbD(k)}${qbK(1, lqLin(1, -b))} = ${qbD(m)}x ${qbPM(e)}`, x, h: 'แจกแจงก่อน แล้วคูณ 10 (หรือ 100) ทุกพจน์' }; }),
  () => qbTry(() => { const x = qbNZ(1, 12) * 2 + .5 * (qbR(0, 1) ? 1 : 0), a = qbR(2, 8) / 10, b = qbR(1, 9) / 10, c = Math.round((a * x + b) * 100) / 100; return Number.isInteger(c * 100) && c && Math.abs(c) < 50 && { e: `${qbD(a)}x + ${qbD(b)} = ${qbD(c)}`, x, h: 'คูณ 10 หรือ 100 ทุกพจน์ คำตอบอาจเป็นทศนิยม' }; }),
  /* 11–15 ผสมเศษส่วนกับทศนิยม / หลายขั้น */
  () => qbTry(() => { const a = [2, 4, 5][qbR(0, 2)], b = (2 * qbR(0, 4) + 1) / 2, x = a * qbNZ(1, 10), c = x / a + b; return Number.isInteger(c * 10) && { e: `${qbF('x', a)} + ${qbD(b)} = ${qbD(c)}`, x, h: 'เปลี่ยนทศนิยมเป็นเศษส่วน หรือคูณด้วย ค.ร.น. ทุกพจน์' }; }),
  () => qbTry(() => { const x = 6 * qbNZ(1, 8), c = .5 * x + x / 3; return Number.isInteger(c) && { e: `0.5x + ${qbF('x', 3)} = ${lqN(c)}`, x, h: '0.5 = 1/2 แล้วคูณ 6 ทุกพจน์' }; }),
  () => qbTry(() => { const p = qbR(1, 9) / 2, a = [.25, .75][qbR(0, 1)], x = qbNZ(1, 20), c = Math.round(((x + p) / 2 - a * x) * 100) / 100; return c && Number.isInteger(c * 4) && { e: `${qbF(`x + ${qbD(p)}`, 2)} = ${qbD(a)}x ${qbPM(c)}`, x, h: 'คูณ 4 ทุกพจน์ (ทั้งตัวส่วน 2 และทศนิยม .25)' }; }),
  () => qbTry(() => { const k = qbR(2, 5) / 10, m = qbR(2, 6), x = qbNZ(2, 20), c = Math.round((k * (x - 4) + x / m) * 100) / 100; return Number.isInteger(x / m) && c && Number.isInteger(c * 10) && { e: `${qbD(k)}${qbK(1, lqLin(1, -4))} + ${qbF('x', m)} = ${qbD(c)}`, x, h: 'แจกแจงก่อน แล้วคูณด้วยจำนวนที่ทำให้ไม่มีเศษส่วนและทศนิยม' }; }),
  () => qbTry(() => { const a = [3, 4, 6][qbR(0, 2)], b = [2, 3, 5][qbR(0, 2)]; if (a === b || a === 2 * b) return null; /* 2/a − 1/b = 0 → x หายหมด */ const x = qbNZ(1, 30), p = qbR(1, 6), q = qbR(1, 6), d = qbR(1, 4) / 2, c = Math.round(((2 * x + p) / a - (x - q) / b - d) * 1000) / 1000; return Number.isInteger(c) && { e: `${qbF(`2x + ${p}`, a)} − ${qbF(`x − ${q}`, b)} − ${qbD(d)} = ${lqN(c)}`, x, h: 'เปลี่ยน ' + qbD(d) + ' เป็นเศษส่วน คูณด้วย ค.ร.น. ของตัวส่วนทุกตัว' }; })
];
function qbFDGame() { const out = [], seen = new Set(), keep = qbTen();
  QB_FD.forEach((mk, i) => { if (!keep(i)) return; let q = null; for (let t = 0; t < 20 && (!q || seen.has(q.e)); t++) q = mk(); if (!q) return; seen.add(q.e); out.push(lqSolve(q.e, q.x, q.h, 'qf' + (i + 1), i + 1)); });
  return out; }

LESSONS_M1C6.splice(LESSONS_M1C6.findIndex(L => L.id === 2613) + 1, 0, { id: 2622, bonus: true, place: 'แก่งสมการยาก', title: 'ด่านพิเศษ: แก้สมการจำนวนเต็ม 10 ข้อ (ยาก)', short: 'สมการยาก', tone: 'yellow', learned: true, noTeach: true, gameN: 10,
  goal: 'แก้สมการล้วน 10 ข้อ แบบยาก (สุ่มใหม่ทุกครั้ง) ไม่มีเศษส่วนและทศนิยม: มีจำนวนลบ x อยู่ทั้งสองข้าง วงเล็บ และวงเล็บซ้อน', teach: [], game: qbIntGame });
LESSONS_M1C6.splice(LESSONS_M1C6.findIndex(L => L.id === 2615) + 1, 0, { id: 2623, bonus: true, place: 'แก่งเศษทศนิยม', title: 'ด่านพิเศษ: แก้สมการเศษส่วน ทศนิยม 10 ข้อ (ยาก)', short: 'เศษส่วน ทศนิยม', tone: 'yellow', learned: true, noTeach: true, gameN: 10,
  goal: 'แก้สมการล้วน 10 ข้อ แบบยาก (สุ่มใหม่ทุกครั้ง) เน้นเศษส่วนและทศนิยม: กำจัดตัวส่วนด้วย ค.ร.น. คูณ 10 หรือ 100 และโจทย์ที่มีทั้งเศษส่วนกับทศนิยม', teach: [], game: qbFDGame });
