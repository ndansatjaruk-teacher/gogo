/* =========================================================
   ป.4 บทที่ 3 ทะเลทรายคูณหาร — หน้าสอนและเกมเรียงใหม่ (v258 · ผู้ใช้ขอ) · prefix m4d
   เหมือนบทที่ 4–10: ประเด็นละหน้า ① ดูภาพ (r4vSee) → (บางประเด็น) ลองปรับเอง → ② ทำให้ดู (r4dDo: ดินสอตั้งคูณทีละหลักพร้อมตัวทด
   ตั้งหารยาว/หารสั้นทีละหลัก ลองผลหารแล้วลบทิ้งเมื่อเกิน เขียนบนกระดาษทด คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อแบบเดียวกับในเกม)
   ไม่มี stepper ในหน้าสอน: m4dArrayPlay (ลากมุมแถวลูกแก้ว แทน simFact) m4dNearPlay (ลากบนเส้นจำนวน แทน simNear) · ตัด simMulZeros simPatMul ออก
   เกมด่าน 1–17 เรียงตามประเด็น ง่าย → ยาก (M4D_GAME) · ด่าน 18–20 (โจทย์ปัญหา) ใช้เกมเดิม · วางหลัง p4od.js ใน order.txt
   ========================================================= */
const M4C = { ink: '#2B2550', p: '#E5487A', b: '#2F7BC0', g: '#1B8862', o: '#EC7F1E', fade: '#B7AED3', bad: '#D9534F', sky: '#BFE3F7', y: '#FFE7A8' };
const m4dT = (x, y, t, col = M4C.ink, cls = 'e4d-dg', anc = 'middle') => r4dTx(x, y, t, col, cls, anc);
const m4dLn = (x1, x2, y, col = M4C.ink, sw = 2.4) => `<path d="M${a4n(x1)} ${a4n(y)} H${a4n(x2)}" fill="none" stroke="${col}" stroke-width="${sw}"/>`;
const m4dFinal = o => o.fig + o.steps.filter(s => !s.tmp).map(s => s.ink || '').join('');
/* a number written char by char (commas narrower) — returns the svg and the centre of every char, so zeros can be ringed */
function m4dChars(str, x0, y, fs = 26, col = M4C.ink, colAt = () => null, anc = 'start') { const ca = colAt || (() => null), wd = c => c === ',' ? fs * .3 : c === ' ' ? fs * .32 : /[×÷=+−]/.test(c) ? fs * .9 : fs * .6, Wt = [...str].reduce((a, c) => a + wd(c), 0); let x = anc === 'middle' ? x0 - Wt / 2 : x0, s = ''; const xs = [];
  [...str].forEach((c, i) => { const w = wd(c), cx = x + w / 2; xs.push(cx); if (c !== ' ') s += `<text x="${a4n(cx)}" y="${a4n(y)}" class="m4d-c" text-anchor="middle" style="fill:${ca(i, c) || col};font-size:${fs}px">${c}</text>`; x += w; }); return { s, xs, w: Wt, x1: x }; }
const m4dZeroCol = (str, z, col = M4C.p) => { const idx = []; for (let i = str.length - 1, k = 0; i >= 0 && k < z; i--) if (/\d/.test(str[i])) { idx.push(i); k++; } return (i) => idx.includes(i) ? col : null; };
const m4dRing = (xs, i0, i1, y, fs = 26, col = M4C.o) => { const a = xs[i0] - fs * .36, b = xs[i1] + fs * .36; return g5dEll((a + b) / 2, y - fs * .34, (b - a) / 2 + 3, fs * .62, col); };
const m4dTz = n => (String(n).match(/0*$/) || [''])[0].length;

/* ---------- column multiplication done by the pencil: one digit at a time (× 1 digit, with carries) or one row at a time (× 2–3 digits) ---------- */
function m4dMul(a, b, o = {}) {
  const R = a * b, multi = b > 9, parts = p4mulParts(a, b), n = Math.max(String(R).length, String(a).length, String(b).length + 1) + 1, cw = 27, rh = 34, W = 360;
  const x0 = (W + (n - 1) * cw) / 2 + 8, X = p => x0 - p * cw, yc = 30, ya = 62, yb = ya + rh, yl = yb + 11, Y = r => yl + 31 + r * rh;
  const dig = (v, p0, y, col = M4C.ink) => p4D(v).map((d, i) => m4dT(X(p0 + i), y, String(d), col)).join('');
  const line = y => m4dLn(X(n - 1) - cw / 2, X(0) + cw / 2, y), last = multi && parts.length > 1 ? Y(parts.length - 1) + 11 + 31 : Y(0), H = Math.max(240, last + 18);
  const fig = dig(a, 0, ya) + m4dT(X(n - 1), yb, '×') + dig(b, 0, yb) + line(yl), steps = [];
  if (!multi) p4mul1Plan(a, b).forEach((s, i) => steps.push({ ink: (s.last ? dig(s.s, s.p, Y(0), M4C.b) : m4dT(X(s.p), Y(0), String(s.out), M4C.b)) + (!s.last && s.carry ? m4dT(X(s.p + 1), yc, String(s.carry), M4C.p, 'e4d-sm') : ''),
    w: `${s.d} × ${b}${s.c ? ` + ${s.c}` : ''} = ${s.s}`, n: (i ? '' : 'หลักหน่วย: ') + (s.last ? `เขียน ${s.s}` : s.carry ? `เขียน ${s.out} ทด ${s.carry}` : `เขียน ${s.out}`) }));
  else { parts.forEach((x, r) => steps.push({ ink: Array.from({ length: x.j }, (_, i) => m4dT(X(i), Y(r), '0', M4C.p)).join('') + dig(a * x.d, x.j, Y(r), M4C.b), w: `${fmt(a)} × ${fmt(x.d * 10 ** x.j)} = ${fmt(x.v)}`,
      n: ['คูณหลักหน่วย', 'คูณหลักสิบ: เติม 0 ก่อน', 'คูณหลักร้อย: เติม 0 สองตัว', 'คูณหลักพัน: เติม 0 สามตัว'][x.j] }));
    if (parts.length > 1) { const yL = Y(parts.length - 1) + 11; steps.push({ ink: m4dT(X(n - 1), Y(parts.length - 1), '+') + line(yL) + dig(R, 0, yL + 31, M4C.g), w: parts.length === 2 ? `${fmt(parts[0].v)} + ${fmt(parts[1].v)} = ${fmt(R)}` : `บวก ${parts.length} แถว = ${fmt(R)}`, n: 'บวกผลคูณย่อย' }); } }
  steps.push({ w: `${fmt(a)} × ${fmt(b)} = ${fmt(R)}`, n: o.endN || 'ผลคูณ', ans: 1 });
  return { W, H, fig, steps, q: o.q || `หาผลคูณ ${fmt(a)} × ${fmt(b)}`, fin: o.fin, say: o.say, dense: steps.length > 4 }; }

/* ---------- long division (ตั้งหารยาว): quotient above the bar · each step = write the quotient digit, multiply, subtract, bring the next digit down ---------- */
function m4dDiv(D, k, o = {}) {
  const P = p4ldivPlan(D, k), nd = P.digs.length, first = Math.max(0, P.steps.findIndex(s => !s.quiet)), cw = 26, rh = 31, NQ = P.steps.filter((s, i) => i >= first && !s.quiet).length;
  const W = 360, kw = String(k).length * 16 + 4, blk = kw + 16 + nd * cw, L = (W - blk) / 2, xd = i => L + kw + 16 + i * cw + cw / 2, yQ = 38, yD = 74, Y = r => yD + (r + 1) * rh + (r % 2 ? 6 : 0), H = Math.max(240, Y(2 * NQ - 1) + 16);
  const dg = (v, i, y, col) => p4D(v).map((d, j) => m4dT(xd(i - j), y, String(d), col)).join('');
  const fig = m4dT(L + kw, yD, String(k), M4C.b, 'e4d-dg', 'end') + `<path d="M${a4n(L + kw + 5)} ${yD - 25} Q${a4n(L + kw + 15)} ${yD - 8} ${a4n(L + kw + 5)} ${yD + 8}" fill="none" stroke="${M4C.ink}" stroke-width="2.4"/>` + m4dLn(L + kw + 7, xd(nd - 1) + cw / 2 + 4, yD - 27) + P.digs.map((d, i) => m4dT(xd(i), yD, String(d))).join('');
  const steps = []; let r = 0;
  for (let i = first; i < nd; i++) { const s = P.steps[i], nxt = i + 1 < nd;
    if (s.quiet) { if (i === first) continue; steps.push({ ink: m4dT(xd(i), yQ, '0', M4C.p) + (nxt ? m4dT(xd(i + 1), Y(r - 1), String(P.digs[i + 1]), M4C.o) : ''), w: `${fmt(s.cur)} ÷ ${fmt(k)} ไม่ได้`, n: nxt ? `ใส่ 0 แล้วดึง ${P.digs[i + 1]} ลงมา` : 'ใส่ 0 ที่เหลือเป็นเศษ' }); continue; }
    const yP = Y(r), yR = Y(r + 1), lo = i - String(s.prod).length + 1;
    if (o.trial && k >= 10) { const g = Math.min(9, Math.floor(s.cur / p4lead(k))); if (g >= 1 && g !== s.q) steps.push({ ink: m4dT(xd(i), yQ, String(g), M4C.o) + dg(g * k, i, yP, M4C.o) + (g > s.q ? o4dCross(xd(i) + cw * .9, yP - 9, 9) : ''),
      w: `ลอง ${g}: ${g} × ${fmt(k)} = ${fmt(g * k)}`, n: g > s.q ? `เกิน ${fmt(s.cur)} → ลดเป็น ${s.q}` : `เหลือ ${fmt(s.cur - g * k)} ไม่น้อยกว่า ${fmt(k)} → เพิ่มเป็น ${s.q}`, tmp: 1 }); }
    steps.push({ ink: (i === first && first > 0 ? `<path d="M${a4n(xd(0) - cw / 2 + 3)} ${yD + 8} Q${a4n((xd(0) + xd(first)) / 2)} ${yD + 15} ${a4n(xd(first) + cw / 2 - 3)} ${yD + 8}" fill="none" stroke="${M4C.p}" stroke-width="2.2"/>` : '')
        + m4dT(xd(i), yQ, String(s.q), M4C.p) + dg(s.prod, i, yP, M4C.ink) + m4dLn(xd(lo) - cw / 2, xd(i) + cw / 2, yP + 9) + (s.rem || !nxt ? dg(s.rem, i, yR, M4C.ink) : '') + (nxt ? m4dT(xd(i + 1), yR, String(P.digs[i + 1]), M4C.o) : ''),
      w: `${fmt(s.cur)} ÷ ${fmt(k)} ได้ ${s.q}`, n: (o.ten && k % 10 === 0 ? `คิด ${fmt(Math.floor(s.cur / 10))} ÷ ${k / 10}: ` : '') + `${s.q} × ${fmt(k)} = ${fmt(s.prod)} เหลือ ${fmt(s.rem)}` });
    r += 2; }
  steps.push({ w: `${fmt(D)} ÷ ${fmt(k)} = ${fmt(P.q)}${P.rem ? ` เศษ ${fmt(P.rem)}` : ''}`, n: P.rem ? `เศษ ${fmt(P.rem)} น้อยกว่า ${fmt(k)}` : 'หารลงตัว', ans: 1 });
  return { W, H, fig, steps, q: o.q || `หาผลหาร${P.rem ? 'และเศษ' : ''} ${fmt(D)} ÷ ${fmt(k)}`, fin: o.fin, say: o.say, dense: true }; }

/* ---------- short division (หารสั้น): quotient under the line, each remainder written small in front of the next digit ---------- */
function m4dSDiv(D, k, o = {}) {
  const P = p4ldivPlan(D, k), nd = P.digs.length, first = Math.max(0, P.steps.findIndex(s => !s.quiet)), cw = 34, W = 360, kw = 22, L = (W - (kw + 18 + nd * cw)) / 2, xd = i => L + kw + 18 + i * cw + cw / 2, yD = 96, yQ = 150;
  const fig = m4dT(L + kw, yD, String(k), M4C.b, 'e4d-dg', 'end') + `<path d="M${a4n(L + kw + 6)} ${yD - 25} Q${a4n(L + kw + 16)} ${yD - 8} ${a4n(L + kw + 6)} ${yD + 8}" fill="none" stroke="${M4C.ink}" stroke-width="2.4"/>` + m4dLn(L + kw + 12, xd(nd - 1) + cw / 2, yD + 14) + P.digs.map((d, i) => m4dT(xd(i), yD, String(d))).join('');
  const steps = [];
  for (let i = first; i < nd; i++) { const s = P.steps[i], nxt = i + 1 < nd;
    steps.push({ ink: (i === first && first > 0 ? `<path d="M${a4n(xd(0) - cw / 2 + 4)} ${yD - 30} Q${a4n((xd(0) + xd(first)) / 2)} ${yD - 38} ${a4n(xd(first) + cw / 2 - 4)} ${yD - 30}" fill="none" stroke="${M4C.p}" stroke-width="2.2"/>` : '') + m4dT(xd(i), yQ, String(s.q), M4C.b) + (nxt && s.rem ? m4dT(xd(i + 1) - 14, yD - 15, String(s.rem), M4C.p, 'e4d-sm') : ''),
      w: `${fmt(s.cur)} ÷ ${k} ได้ ${s.q}${s.rem ? ` เศษ ${s.rem}` : ''}`, n: s.quiet ? 'หารไม่ได้ ใส่ 0' : nxt ? (s.rem ? `เขียน ${s.rem} ตัวเล็กหน้า ${P.digs[i + 1]}` : 'ลงตัว ไปหลักถัดไป') : (s.rem ? 'เหลือเป็นเศษ' : 'ลงตัว') }); }
  steps.push({ w: `${fmt(D)} ÷ ${k} = ${fmt(P.q)}${P.rem ? ` เศษ ${P.rem}` : ''}`, n: 'ผลหารอยู่ใต้เส้น', ans: 1 });
  return { W, H: 240, fig, steps, q: o.q || `หารสั้น ${fmt(D)} ÷ ${k}`, fin: o.fin, say: o.say, dense: steps.length > 5 }; }

/* ---------- × with zeros at the end: ring the zeros, multiply the rest, put the zeros back ---------- */
function m4dZero(a, b, o = {}) { const za = m4dTz(a), zb = m4dTz(b), a1 = a / 10 ** za, b1 = b / 10 ** zb, p1 = a1 * b1, z = za + zb, sa = fmt(a), sb = fmt(b), sR = fmt(a * b);
  const L1 = m4dChars(`${sa} × ${sb}`, 180, 62, 30, M4C.ink, null, 'middle'), off = sa.length + 3, r1 = za ? m4dRing(L1.xs, [...sa].length - (za + Math.floor((za - 1) / 3)), sa.length - 1, 62, 30) : '', r2 = zb ? m4dRing(L1.xs, off + sb.length - (zb + Math.floor((zb - 1) / 3)), off + sb.length - 1, 62, 30) : '';
  return { fig: L1.s, q: o.q || `หาผลคูณ ${sa} × ${sb}`,
    steps: [{ ink: r1 + r2, w: `ปิด 0 ไว้ ${z} ตัว`, n: za && zb ? `ท้าย ${sa} มี ${za} ตัว ท้าย ${sb} มี ${zb} ตัว` : 'นับ 0 ท้ายจำนวน' },
      { ink: m4dChars(`${fmt(a1)} × ${fmt(b1)} = ${fmt(p1)}`, 180, 132, 28, M4C.b, null, 'middle').s, w: `${fmt(a1)} × ${fmt(b1)} = ${fmt(p1)}`, n: b1 < 10 ? 'คูณตัวเลขหน้า 0 (ตั้งคูณในใจ)' : 'คูณตัวเลขหน้า 0' },
      { ink: m4dChars(`= ${sR}`, 180, 200, 30, M4C.g, m4dZeroCol(`= ${sR}`, z), 'middle').s, w: `เติม 0 คืน ${z} ตัว`, n: `ต่อท้าย ${fmt(p1)}` },
      { w: `${sa} × ${sb} = ${sR}`, n: 'ผลคูณ', ans: 1 }],
    fin: o.fin || 'ปิด 0 ท้ายไว้ → <b>คูณตัวเลขหน้า 0</b> → เติม 0 คืนให้ครบ', say: o.say || 'ปิดศูนย์ท้ายไว้ คูณตัวเลขหน้าศูนย์ แล้วเติมศูนย์คืนให้ครบ' }; }
/* ---------- ÷ in the head: ring the zeros that are not needed, divide, put them back ---------- */
function m4dDM(D, k) { let z = m4dTz(D), c = D / 10 ** z; while (c < k && z > 0) { c *= 10; z--; } const q = c / k, sD = fmt(D), sR = fmt(D / k);
  const L1 = m4dChars(`${sD} ÷ ${k}`, 180, 62, 30, M4C.ink, null, 'middle'), j1 = sD.length - 1; let j0 = j1, cnt = 0; while (cnt < z) { if (/\d/.test(sD[j0])) cnt++; if (cnt < z) j0--; }
  return { fig: L1.s, q: `หาผลหาร ${sD} ÷ ${k} (คิดในใจ)`,
    steps: [{ ink: m4dRing(L1.xs, j0, j1, 62, 30), w: `ปิด 0 ไว้ ${z} ตัว`, n: `เหลือ ${c} ÷ ${k}` }, { ink: m4dChars(`${c} ÷ ${k} = ${q}`, 180, 132, 28, M4C.b, null, 'middle').s, w: `${c} ÷ ${k} = ${q}`, n: 'สูตรคูณ' },
      { ink: m4dChars(`= ${sR}`, 180, 200, 30, M4C.g, m4dZeroCol(`= ${sR}`, z), 'middle').s, w: `เติม 0 คืน ${z} ตัว`, n: `ต่อท้าย ${q}` }, { w: `${sD} ÷ ${k} = ${sR}`, n: 'ผลหาร', ans: 1 }],
    fin: 'ปิด 0 ที่ไม่ต้องใช้ → <b>หารด้วยสูตรคูณ</b> → เติม 0 คืน', say: 'ปิดศูนย์ที่ไม่ต้องใช้ หารด้วยสูตรคูณ แล้วเติมศูนย์คืน' }; }

/* ---------- pictures ---------- */
const m4dSee = (title, cap, list) => a4dSee(title, cap, list);
const m4dTry = (id, mk, title) => g5dTry(id, mk, title);
const m4dDot = (x, y, r = 6, col = '#FFC24C') => `<circle cx="${a4n(x)}" cy="${a4n(y)}" r="${r}" fill="${col}" stroke="${M4C.ink}" stroke-width="1.2"/>`;
/* an area model: a rectangle of width ∝ a cut into strips for each place of b */
function m4dArea(a, b, on) { const P = p4D(b).map((d, j) => d * 10 ** j).filter(Boolean).reverse(), tot = P.reduce((s, v) => s + v, 0), x0 = 70, y0 = 46, Wd = 270, Hh = 150 - 30 * (P.length - 1); let y = y0, s = r4dTx(x0 + Wd / 2, 34, fmt(a), M4C.ink, 'r4v-tx');
  const cols = ['#BFE3F7', '#FFE7A8', '#C9F0D9'];
  P.forEach((v, i) => { const hh = Math.max(26, Hh * v / tot); s += `<rect x="${x0}" y="${a4n(y)}" width="${Wd}" height="${a4n(hh)}" fill="${cols[i % 3]}" stroke="${M4C.ink}" stroke-width="1.8"/>` + r4dTx(x0 - 8, y + hh / 2 + 5, fmt(v), M4C.ink, 'r4v-tx', 'end') + (on ? r4dTx(x0 + Wd / 2, y + hh / 2 + 6, `${fmt(a)} × ${fmt(v)} = ${fmt(a * v)}`, M4C.b, 'r4v-tx') : ''); y += hh; });
  return s + (on ? r4dTx(x0 + Wd / 2, y + 26, `รวม ${fmt(a * b)}`, M4C.g, 'r4v-big') : r4dTx(x0 + Wd / 2, y + 26, `${fmt(a)} × ${fmt(b)} = ?`, M4C.fade, 'r4v-big')); }
/* a bar split into equal parts (for the unknown in × and ÷) */
const m4dBar = (n, lab, tot, x0 = 30, y = 120, w = 300, col = '#C9F0D9') => `<rect x="${x0}" y="${y}" width="${w}" height="40" rx="6" fill="${col}" stroke="${M4C.ink}" stroke-width="2"/>` + Array.from({ length: n - 1 }, (_, i) => `<path d="M${a4n(x0 + (i + 1) * w / n)} ${y} V${y + 40}" stroke="${M4C.ink}" stroke-width="1.6"/>`).join('') + Array.from({ length: n }, (_, i) => `<text x="${a4n(x0 + (i + .5) * w / n)}" y="${y + 25}" text-anchor="middle" class="g5d-s" style="font-size:${Math.min(14, w / n / lab.length * 1.5)}px">${lab}</text>`).join('') + `<path d="M${x0} ${y - 10} V${y - 16} H${x0 + w} V${y - 10}" fill="none" stroke="${M4C.p}" stroke-width="2"/>` + r4dTx(x0 + w / 2, y - 24, tot, M4C.p, 'r4v-tx');

/* ---------- hands-on (no steppers) ---------- */
/* an array of marbles: drag the corner — one picture gives 2 multiplication and 2 division sentences */
function m4dArrayPlay() { const g = 30, x0 = 60, y0 = 26;
  return tgScene({ W: 560, H: 250, st: { r: 3, c: 4, seen: [] }, cap: '<b>ลากจุดสีชมพู</b> (มุมขวาล่าง) เพื่อเปลี่ยนจำนวนแถวและจำนวนต่อแถว',
    missions: [['ทำ 4 แถว แถวละ 6', s => s.r === 4 && s.c === 6], ['ทำ 6 แถว แถวละ 4', s => s.r === 6 && s.c === 4], ['ทำให้มี 12 ลูก แบบอื่น', s => s.r * s.c === 12 && s.seen.some(x => x === `${s.r}x${s.c}`) && !(s.r === 3 && s.c === 4)]],
    svg: s => Array.from({ length: s.r * s.c }, (_, i) => m4dDot(x0 + (i % s.c) * g + g / 2, y0 + Math.floor(i / s.c) * g + g / 2, 9, i < s.c ? '#FFC24C' : '#9FD0F0')).join('') + `<rect x="${x0}" y="${y0}" width="${s.c * g}" height="${s.r * g}" rx="8" fill="none" stroke="#C9C1E4" stroke-width="2" stroke-dasharray="5 4"/>` + tgHandle(x0 + s.c * g, y0 + s.r * g, M4C.p)
      + `<text x="${x0 + 8 * g + 40}" y="70" class="g5d-h" style="font-size:20px">${s.r} × ${s.c} = ${s.r * s.c}</text><text x="${x0 + 8 * g + 40}" y="102" class="g5d-h" style="font-size:20px">${s.c} × ${s.r} = ${s.r * s.c}</text><text x="${x0 + 8 * g + 40}" y="146" class="g5d-h" style="font-size:20px;fill:${M4C.b}">${s.r * s.c} ÷ ${s.r} = ${s.c}</text><text x="${x0 + 8 * g + 40}" y="178" class="g5d-h" style="font-size:20px;fill:${M4C.b}">${s.r * s.c} ÷ ${s.c} = ${s.r}</text>`,
    drag: (pt, s) => { const c = Math.max(1, Math.min(8, Math.round((pt[0] - x0) / g))), r = Math.max(1, Math.min(7, Math.round((pt[1] - y0) / g))); if (c === s.c && r === s.r) return null; sfx.tap(); return { r, c, seen: [...s.seen, `${r}x${c}`].slice(-30) }; },
    info: s => `${s.r} แถว แถวละ ${s.c} ลูก = <b>${s.r * s.c}</b> ลูก${r4vSep}ภาพเดียวกัน: คูณ 2 ประโยค หาร 2 ประโยค` }); }
/* near: slide along the multiples of 54 and watch how far each one is from 4,000 */
function m4dNearPlay() { const d = 54, T = 4000, n0 = 70, n1 = 79, X = n => 50 + (n - n0) * 50;
  return tgScene({ W: 560, H: 250, st: { n: 71, seen: [] }, cap: `<b>ลากจุดสีชมพู</b>ไปตามจำนวนที่คูณกับ ${d} — ผลคูณใดใกล้ ${fmt(T)} ที่สุด`,
    missions: [['ลองผลคูณที่น้อยกว่า 4,000', s => s.seen.some(n => n * d < T)], ['ลองผลคูณที่มากกว่า 4,000', s => s.seen.some(n => n * d > T)], ['หาผลคูณที่ใกล้ที่สุด', s => s.n === p4bestN(d, T)]],
    svg: s => `<path d="M30 150 H530" stroke="${M4C.ink}" stroke-width="2.4"/>` + Array.from({ length: n1 - n0 + 1 }, (_, i) => { const n = n0 + i, on = n === s.n; return `<path d="M${X(n)} 142 V158" stroke="${M4C.ink}" stroke-width="2"/><text x="${X(n)}" y="182" class="g5d-s" text-anchor="middle" style="font-size:14px">${n}</text><text x="${X(n)}" y="${i % 2 ? 132 : 116}" class="g5d-s" text-anchor="middle" style="font-size:12px;fill:${on ? M4C.p : '#8A80B0'}">${fmt(n * d)}</text>`; }).join('')
      + `<path d="M${a4n(X(n0) + (T - n0 * d) / d * 50)} 60 V170" stroke="${M4C.g}" stroke-width="2.6" stroke-dasharray="6 4"/><text x="${a4n(X(n0) + (T - n0 * d) / d * 50)}" y="52" class="g5d-h" text-anchor="middle" style="fill:${M4C.g};font-size:16px">${fmt(T)}</text>` + tgHandle(X(s.n), 150, M4C.p) + `<text x="280" y="226" class="g5d-h" text-anchor="middle" style="font-size:18px">${s.n} × ${d} = ${fmt(s.n * d)} (ห่าง ${fmt(Math.abs(s.n * d - T))})</text>`,
    drag: (pt, s) => { const n = Math.max(n0, Math.min(n1, Math.round((pt[0] - 50) / 50) + n0)); if (n === s.n) return null; sfx.tap(); return { n, seen: s.seen.includes(n) ? s.seen : [...s.seen, n] }; },
    info: s => `${s.n} × ${d} = <b>${fmt(s.n * d)}</b>${r4vSep}${s.n * d === T ? 'เท่ากับ' : s.n * d < T ? 'น้อยกว่า' : 'มากกว่า'} ${fmt(T)} อยู่ ${fmt(Math.abs(s.n * d - T))}` }); }

/* =========================================================
   the lessons
   ========================================================= */
const M4D_TEACH = {
  /* ด่าน 1 คูณด้วย 1 หลัก (ทด) */
  441: (() => { const dots = Array.from({ length: 32 }, (_, i) => m4dDot(56 + (i % 4) * 22 + Math.floor(i / 16) * 104, 50 + Math.floor((i % 16) / 4) * 22 + 0, 7)).join('');
    const tens = [0, 1, 2].map(r => Array.from({ length: 10 }, (_, i) => m4dDot(40 + i * 18, 60 + r * 30, 7, '#9FD0F0')).join('') + `<rect x="30" y="${50 + r * 30}" width="180" height="20" rx="10" fill="none" stroke="${M4C.b}" stroke-width="2"/>`).join('') + [0, 1].map(i => m4dDot(250 + i * 22, 90, 7)).join('');
    return [
      m4dSee('การทด', '<b>แตะรูป</b> — 8 × 4 = 32 ครบสิบ ทดไปหลักสิบ', [
        { t: '8 × 4 = 32', f: on => on ? r4vH(tens + r4dTx(120, 168, '3 สิบ', M4C.b, 'r4v-big') + r4dTx(261, 168, '2 หน่วย', M4C.o, 'r4v-big') + r4dTx(180, 214, 'เขียน 2 ทด 3 ไปหลักสิบ', M4C.p, 'r4v-tx')) : dots + r4dTx(180, 214, '4 ลูก 8 กลุ่ม = ?', M4C.fade, 'r4v-big'), s: '32 = 3 สิบ กับ 2 หน่วย<br>เขียน <b>2</b> ทด <b>3</b>' }]),
      r4dShow('63,857 × 4', m4dMul(63857, 4, { fin: 'คูณทีละหลัก<b>จากหลักหน่วย</b> ครบสิบทดไปหลักถัดไป แล้ว<b>บวกตัวทด</b>', say: 'คูณทีละหลักจากหลักหน่วย ครบสิบทดไปหลักถัดไป แล้วบวกตัวทด' })),
      m4dTry(441, () => p4mulQ(...pick(P4W3_M1.slice(0, 6))), 'ตั้งคูณ')]; })(),

  /* ด่าน 2 คูณด้วย 2 หลัก */
  442: [
    m4dSee('คูณด้วย 2 หลัก', '<b>แตะรูป</b> — 47 = 40 + 7 แยกคูณทีละส่วน', [{ t: '2,318 × 47', f: on => m4dArea(2318, 47, on), s: 'คูณ 7 กับคูณ 40 แยกกัน<br>แล้ว<b>บวกกัน</b>' }]),
    r4dShow('552 × 40', m4dZero(552, 40)),
    m4dTry(442, () => p4zQ2(...pick(P4W3_M10)), 'คูณด้วยพหุคูณของ 10'),
    r4dShow('2,318 × 47', m4dMul(2318, 47, { fin: 'คูณหลักหน่วย → คูณหลักสิบ (<b>เติม 0 ก่อน</b>) → บวกผลคูณย่อย', say: 'คูณหลักหน่วย คูณหลักสิบโดยเติมศูนย์ก่อน แล้วบวกผลคูณย่อย' })),
    m4dTry(442, () => p4mulQ(...pick(P4W3_M2.filter(([a]) => a < 10000))), 'ตั้งคูณ 2 หลัก')],

  /* ด่าน 3 คูณด้วยพหุคูณของ 100 1,000 10,000 */
  443: (() => { const PV = ['ล้าน', 'แสน', 'หมื่น', 'พัน', 'ร้อย', 'สิบ', 'หน่วย'], cx = i => 48 + i * 44, row = (v, y, z) => p4D(v).map((d, j) => r4dTx(cx(6 - j), y, String(d), j < z ? M4C.p : M4C.ink, 'r4v-big')).join('');
    const chart = PV.map((t, i) => `<rect x="${cx(i) - 21}" y="40" width="42" height="150" fill="${i % 2 ? '#F7F4FF' : '#fff'}" stroke="#E1DAF2"/>` + r4dTx(cx(i), 58, t, '#7A70A0', 'r4d-sm')).join('');
    return [
      m4dSee('× 1,000 = เลื่อนไป 3 หลัก', '<b>แตะรูป</b> — 1,234 × 3 = 3,702 แล้วคูณ 1,000', [
        { t: '3,702 × 1,000', f: on => chart + row(3702, 100, 0) + (on ? r4vH(row(3702000, 160, 3) + r4dArr([cx(3), 108], [cx(0), 140], M4C.p)) + r4dTx(180, 224, 'ทุกหลักเลื่อนไปทางซ้าย 3 หลัก เติม 0 สามตัว', M4C.p, 'r4d-sm') : r4dTx(180, 224, '× 1,000 = ?', M4C.fade, 'r4v-big')), s: 'คูณ 1,000 = ต่อ <b>0 สามตัว</b><br>3,702 × 1,000 = 3,702,000' }]),
      r4dShow('1,234 × 3,000', m4dZero(1234, 3000)),
      m4dTry(443, () => p4zQ2(...pick(P4W3_MZ.filter(([a, b]) => !(m4dTz(a) && m4dTz(b))))), 'คูณพหุคูณของ 100'),
      r4dShow('2,500 × 300 (มี 0 ทั้งสองจำนวน)', m4dZero(2500, 300)),
      m4dTry(443, () => p4zQ2(...pick([[2500, 4000], [1200, 300], [7080, 500], [450, 6000]])), 'มี 0 ทั้งสองจำนวน')]; })(),

  /* ด่าน 4 คูณหลายหลัก */
  444: [
    m4dSee('ตัวคูณ 3 หลัก = 3 แถว', '<b>แตะรูป</b> — 253 = 200 + 50 + 3', [{ t: '614 × 253', f: on => m4dArea(614, 253, on), s: 'ผลคูณย่อย <b>3 แถว</b><br>แล้วบวกกัน' }]),
    r4dShow('614 × 253', m4dMul(614, 253, { fin: 'ตัวคูณ 3 หลัก ได้ผลคูณย่อย <b>3 แถว</b> (เติม 0 ตามหลัก) แล้วบวกกัน', say: 'ตัวคูณสามหลัก ได้ผลคูณย่อยสามแถว เติมศูนย์ตามหลัก แล้วบวกกัน' })),
    m4dTry(444, () => p4mulQ(...pick(P4W3_MB.slice(0, 8))), 'ตั้งคูณหลายหลัก')],

  /* ด่าน 5 ผลคูณสมเหตุสมผล */
  445: (() => { const X = v => 30 + (v - 5000) * .15, ax = `<path d="M24 140 H336" stroke="${M4C.ink}" stroke-width="2.4"/>` + [5000, 5500, 6000, 6500, 7000].map(v => `<path d="M${X(v)} 132 V148" stroke="${M4C.ink}" stroke-width="2"/>` + r4dTx(X(v), 170, fmt(v), M4C.ink, 'r4d-sm')).join('');
    const card = (x, t, col) => `<rect x="${x}" y="108" width="100" height="44" rx="10" fill="#fff" stroke="${col}" stroke-width="2.4"/>` + r4dTx(x + 50, 137, t, col, 'r4v-tx');
    return [
      m4dSee('ประมาณก่อนคูณ', '<b>แตะรูป</b> — ปัดเป็นหลักสูงสุด', [
        { t: '5,986 ≈ ?', f: on => ax + `<circle cx="${X(5986)}" cy="140" r="7" fill="${M4C.p}"/>` + r4dTx(X(5986), 116, '5,986', M4C.p, 'r4v-tx') + (on ? r4vH(r4dArr([X(5986) - 4, 196], [X(6000) - 1, 196], M4C.g) + r4dTx(X(6000), 222, '≈ 6,000', M4C.g, 'r4v-big')) : ''), s: '5,986 ใกล้ <b>6,000</b><br>31 ใกล้ 30' },
        { t: 'ผลคูณประมาณ', f: on => r4dTx(180, 60, '6,000 × 30 = 180,000', M4C.ink, 'r4v-big') + card(10, '18,566', M4C.fade) + card(130, '185,566', M4C.fade) + card(250, '1,855,660', M4C.fade) + (on ? r4vH(card(130, '185,566', M4C.g) + o4dCross(60, 130, 12) + o4dCross(300, 130, 12) + r4dTx(180, 196, 'ใกล้ 180,000 = สมเหตุสมผล', M4C.g, 'r4v-tx')) : ''), s: 'เลือกคำตอบที่<b>ใกล้ค่าประมาณ</b>' }]),
      r4dShow('ผลคูณนี้ถูกไหม?', { fig: m4dChars('5,986 × 31', 110, 56, 28, M4C.ink, null, 'middle').s + r4dTx(270, 40, 'เพื่อนได้', '#7A70A0', 'r4d-sm') + r4dTx(270, 66, '18,566', M4C.o, 'r4d-big'), q: 'เพื่อนคิด 5,986 × 31 ได้ 18,566 สมเหตุสมผลไหม',
        steps: [{ ink: r4dArr([70, 74], [70, 104], M4C.p) + r4dArr([150, 74], [150, 104], M4C.p) + m4dChars('6,000 × 30', 110, 128, 28, M4C.p, null, 'middle').s, w: '5,986 ≈ 6,000 และ 31 ≈ 30', n: 'ปัดเป็นหลักสูงสุด' },
          { ink: m4dChars('= 180,000', 110, 176, 28, M4C.b, null, 'middle').s, w: '6,000 × 30 = 180,000', n: 'คิดในใจ (ปิด 0)' }, { ink: o4dCross(270, 58, 16), w: '18,566 น้อยกว่ามาก', n: 'ไม่สมเหตุสมผล (ลืมเติม 0)' },
          { ink: r4dTx(270, 214, '185,566 ✓', M4C.g, 'r4d-big'), w: 'คิดใหม่ = 185,566', n: 'ใกล้ 180,000', ans: 1 }],
        fin: 'ค่าประมาณบอกว่าผลคูณ<b>ใหญ่ประมาณเท่าไร</b>', say: 'ค่าประมาณบอกว่าผลคูณใหญ่ประมาณเท่าไร' }),
      m4dTry(445, () => p4estMulQ(pick(P4W3_M2)), 'ผลคูณที่สมเหตุสมผล')]; })(),

  /* ด่าน 6 หารยาว ตัวหาร 1 หลัก → หารในใจ */
  446: (() => { const node = (x, y, t, col) => `<circle cx="${x}" cy="${y}" r="34" fill="#fff" stroke="${col}" stroke-width="2.6"/>` + r4dTx(x, y + 7, t, col, 'r4v-big'), C = [[180, 50], [290, 120], [180, 190], [70, 120]], lab = ['① หาร', '② คูณ', '③ ลบ', '④ ดึงลง'], col = [M4C.p, M4C.b, M4C.g, M4C.o];
    return [
      m4dSee('หารยาว 4 ขั้น', '<b>แตะรูป</b> — ทำซ้ำทีละหลัก', [
        { t: 'หาร คูณ ลบ ดึง', f: on => (on ? r4vH(C.map((p, i) => r4dArr([p[0] + (C[(i + 1) % 4][0] - p[0]) * .32, p[1] + (C[(i + 1) % 4][1] - p[1]) * .32], [p[0] + (C[(i + 1) % 4][0] - p[0]) * .68, p[1] + (C[(i + 1) % 4][1] - p[1]) * .68], '#B7AED3')).join('') + C.map((p, i) => node(p[0], p[1], lab[i], col[i])).join('')) : C.map(p => node(p[0], p[1], '?', M4C.fade)).join('')),
          s: 'หาร → คูณ → ลบ → <b>ดึงหลักถัดไปลงมา</b><br>วนจนครบทุกหลัก' }]),
      r4dShow('37,509 ÷ 6', m4dDiv(37509, 6, { fin: `เริ่มจากหลักซ้ายที่หารได้${r4vSep}หาร คูณ ลบ <b>ดึงหลักถัดไปลงมา</b>`, say: 'เริ่มจากหลักซ้ายที่หารได้ หาร คูณ ลบ แล้วดึงหลักถัดไปลงมา' })),
      m4dTry(446, () => { const [D, k] = pick(P4W3_DL.slice(0, 8)); return Q.p4Div({ D, k }); }, 'หารยาว'),
      r4dShow('360,000 ÷ 9 (คิดในใจ)', m4dDM(360000, 9)),
      m4dTry(446, () => m4dDMQ(pick(P4W3_DM)), 'หารในใจ')]; })(),

  /* ด่าน 7 หารสั้น */
  447: [
    m4dSee('หารยาว กับ หารสั้น', '<b>แตะรูป</b> — 9,384 ÷ 4 สองแบบ', [
      { t: 'หารยาว', W: 360, H: m4dDiv(9384, 4).H, f: on => on ? m4dFinal(m4dDiv(9384, 4)) : m4dDiv(9384, 4).fig, s: 'เขียนผลคูณและการลบ<br>ทุกขั้น' },
      { t: 'หารสั้น', f: on => on ? m4dFinal(m4dSDiv(9384, 4)) : m4dSDiv(9384, 4).fig, s: 'คิดในใจ เขียน<b>เศษตัวเล็ก</b><br>หน้าหลักถัดไป' }]),
    r4dShow('74,368 ÷ 3', m4dSDiv(74368, 3, { fin: 'หารทีละหลัก เศษเขียน<b>ตัวเล็กหน้าหลักถัดไป</b> ผลหารอยู่ใต้เส้น', say: 'หารทีละหลัก เศษเขียนตัวเล็กหน้าหลักถัดไป ผลหารอยู่ใต้เส้น' })),
    m4dTry(447, () => { const [D, k] = pick(P4W3_DS.slice(0, 6)); return Q.p4Div({ D, k, label: 'หารสั้น' }); }, 'หารสั้น')],

  /* ด่าน 8 ตัวหารเป็นพหุคูณของ 10 */
  448: (() => { const E = m4dChars('186 ÷ 50', 180, 80, 34, M4C.ink, null, 'middle');
    return [
      m4dSee('ตัวหารลงท้ายด้วย 0', '<b>แตะรูป</b> — 186 ÷ 50 คิดจาก 18 ÷ 5', [
        { t: '186 ÷ 50', f: on => E.s + (on ? r4vH(m4dRing(E.xs, 2, 2, 80, 34, M4C.fade) + m4dRing(E.xs, 7, 7, 80, 34, M4C.fade) + r4dTx(180, 140, '18 ÷ 5 ได้ 3', M4C.p, 'r4v-big') + r4dTx(180, 186, '3 × 50 = 150 ไม่เกิน 186 ✓', M4C.g, 'r4v-tx')) : ''), s: 'ปิดหลักหน่วยไว้ คิด <b>18 ÷ 5</b><br>ช่วยเดาผลหารได้เร็ว' }]),
      r4dShow('18,650 ÷ 50', m4dDiv(18650, 50, { ten: 1, fin: 'ตัวหารเป็นพหุคูณของ 10: <b>คิดจากเลขหน้า 0</b> ช่วยเดาผลหาร', say: 'ตัวหารเป็นพหุคูณของสิบ คิดจากเลขหน้าศูนย์ช่วยเดาผลหาร' })),
      m4dTry(448, () => { const [D, k] = pick(P4_D10.slice(0, 4)); return Q.p4Div({ D, k }); }, 'หารยาว')]; })(),

  /* ด่าน 9 ตัวหาร 2 หลัก ลองผลหาร */
  449: (() => { const X = v => 40 + (v - 30) * 28;
    return [
      m4dSee('ลองผลหาร', '<b>แตะรูป</b> — ปัดตัวหาร เดา แล้วตรวจ', [
        { t: '38 ≈ ?', f: on => `<path d="M24 120 H336" stroke="${M4C.ink}" stroke-width="2.4"/>` + [30, 35, 40].map(v => `<path d="M${X(v)} 112 V128" stroke="${M4C.ink}" stroke-width="2"/>` + r4dTx(X(v), 152, String(v), M4C.ink, 'r4v-tx')).join('') + `<circle cx="${X(38)}" cy="120" r="7" fill="${M4C.p}"/>` + r4dTx(X(38), 98, '38', M4C.p, 'r4v-tx') + (on ? r4vH(r4dArr([X(38), 176], [X(40), 176], M4C.g) + r4dTx(X(40) - 30, 208, '38 ≈ 40 ใช้เดาผลหาร', M4C.g, 'r4v-tx')) : ''), s: '38 ใกล้ <b>40</b><br>304 ÷ 40 → ลอง 7' },
        { t: 'ตรวจ 2 ข้อ', f: on => r4dTx(180, 70, 'ผลคูณ ต้องไม่เกิน ตัวตั้ง', M4C.ink, 'r4v-tx') + r4dTx(180, 130, 'เศษ ต้องน้อยกว่า ตัวหาร', M4C.ink, 'r4v-tx') + (on ? r4vH(r4dTx(180, 96, 'เกิน → ลดผลหาร', M4C.bad, 'r4d-sm') + r4dTx(180, 156, 'เศษมากไป → เพิ่มผลหาร', M4C.o, 'r4d-sm') + r4dTx(180, 204, 'ผ่านทั้ง 2 ข้อ ✓', M4C.g, 'r4v-big')) : ''), s: 'เกิน → ลด<br>เศษมากไป → เพิ่ม' }]),
      r4dShow('6,384 ÷ 38', m4dDiv(6384, 38, { trial: 1, fin: '<b>ประมาณตัวหาร</b> เดาผลหาร แล้วปรับ: ผลคูณไม่เกิน เศษน้อยกว่าตัวหาร', say: 'ประมาณตัวหาร เดาผลหาร แล้วปรับ ผลคูณต้องไม่เกิน และเศษต้องน้อยกว่าตัวหาร' })),
      m4dTry(449, () => { const [D, k] = pick(P4_D2S.slice(0, 4)); return Q.p4Div({ D, k }); }, 'หารยาว ตัวหาร 2 หลัก')]; })(),

  /* ด่าน 10 ตัวหาร 2 หลัก ตัวตั้งมากกว่า 4 หลัก (ใส่ 0 ในผลหาร) */
  450: [
    m4dSee('ใส่ 0 ในผลหาร', '<b>แตะรูป</b> — ดึงลงมาแล้วยังหารไม่ได้', [
      { t: '84,775 ÷ 41', W: 360, H: m4dDiv(84775, 41).H, f: on => m4dFinal(m4dDiv(84775, 41)) + (on ? r4vH(g5dEll(m4dDivX(84775, 41, 2), 38 - 9, 13, 17, M4C.p) + r4dTx(300, 120, '27 ÷ 41 ไม่ได้', M4C.p, 'r4d-sm') + r4dTx(300, 140, '→ ใส่ 0', M4C.p, 'r4d-sm')) : ''), s: '27 หาร 41 ไม่ได้<br>ใส่ <b>0</b> ในผลหาร แล้วดึงหลักถัดไป' }]),
    r4dShow('84,775 ÷ 41', m4dDiv(84775, 41, { fin: 'ดึงลงมาแล้ว<b>ยังหารไม่ได้</b> ใส่ 0 ในผลหาร แล้วดึงหลักถัดไป', say: 'ดึงลงมาแล้วยังหารไม่ได้ ใส่ศูนย์ในผลหาร แล้วดึงหลักถัดไป' })),
    m4dTry(450, () => { const [D, k] = pick(P4W3_D2.filter(x => x[0] < 1e5)); return Q.p4Div({ D, k }); }, 'หารยาว ตัวหาร 2 หลัก')],

  /* ด่าน 11 ตัวหาร 3 หลัก ตัวตั้งไม่เกิน 4 หลัก */
  451: (() => { const X = v => 40 + (v - 100) * 2.6;
    return [
      m4dSee('ตัวหาร 3 หลัก', '<b>แตะรูป</b> — ปัดตัวหารเป็นหลักร้อย', [
        { t: '215 ≈ ?', f: on => `<path d="M24 120 H336" stroke="${M4C.ink}" stroke-width="2.4"/>` + [100, 150, 200].map(v => `<path d="M${X(v)} 112 V128" stroke="${M4C.ink}" stroke-width="2"/>` + r4dTx(X(v), 152, String(v), M4C.ink, 'r4v-tx')).join('') + `<circle cx="${X(215)}" cy="120" r="7" fill="${M4C.p}"/>` + r4dTx(X(215), 98, '215', M4C.p, 'r4v-tx') + (on ? r4vH(r4dArr([X(215), 176], [X(200) + 2, 176], M4C.g) + r4dTx(180, 208, '215 ≈ 200 → 847 ÷ 200 ลอง 4', M4C.g, 'r4v-tx')) : ''), s: '215 ใกล้ <b>200</b><br>คิดจาก 8 ÷ 2 ช่วยเดา' }]),
      r4dShow('8,475 ÷ 215', m4dDiv(8475, 215, { trial: 1, fin: 'ตัวหาร 3 หลัก: <b>ปัดเป็นหลักร้อย</b> เดาผลหาร ถ้าเกินให้ลด', say: 'ตัวหารสามหลัก ปัดเป็นหลักร้อย เดาผลหาร ถ้าเกินให้ลด' })),
      m4dTry(451, () => { const [D, k] = pick(P4_D3S); return Q.p4Div({ D, k }); }, 'หารยาว ตัวหาร 3 หลัก')]; })(),

  /* ด่าน 12 ตัวหาร 3 หลัก ตัวตั้งมากกว่า 4 หลัก */
  452: (() => { const E = m4dChars('563850 ÷ 245', 180, 70, 30, M4C.ink, null, 'middle');
    return [
      m4dSee('เริ่มหารที่หลักใด', '<b>แตะรูป</b> — ตัวหาร 3 หลัก ดู 3 หลักแรก', [
        { t: '563850 ÷ 245', f: on => E.s + (on ? r4vH(`<path d="M${a4n(E.xs[0] - 9)} 82 Q${a4n(E.xs[1])} 96 ${a4n(E.xs[1] + 9)} 82" fill="none" stroke="${M4C.bad}" stroke-width="2.4"/>` + r4dTx(E.xs[0] + 20, 124, '56 < 245 ✗', M4C.bad, 'r4v-tx')
          + `<path d="M${a4n(E.xs[0] - 9)} 134 Q${a4n(E.xs[1])} 150 ${a4n(E.xs[2] + 9)} 134" fill="none" stroke="${M4C.g}" stroke-width="2.4"/>` + r4dTx(E.xs[1] + 30, 180, '563 ≥ 245 ✓ เริ่มตรงนี้', M4C.g, 'r4v-tx')) : ''), s: '56 หาร 245 ไม่ได้<br>เริ่มที่ <b>563</b>' }]),
      r4dShow('563,850 ÷ 245', m4dDiv(563850, 245, { trial: 1, fin: `เริ่มจากหลักที่<b>หารได้</b>${r4vSep}หาร คูณ ลบ ดึง${r4vSep}หารไม่ได้ใส่ 0`, say: 'เริ่มจากหลักที่หารได้ หาร คูณ ลบ ดึง หารไม่ได้ใส่ศูนย์' })),
      m4dTry(452, () => { const [D, k] = pick([...P4W3_D3.filter(x => x[0] > 9999), [96300, 450]]); return Q.p4Div({ D, k }); }, 'หารยาว ตัวหาร 3 หลัก')]; })(),

  /* ด่าน 13 ความสัมพันธ์คูณ ↔ หาร · ตรวจการหารด้วยการคูณ */
  453: [
    m4dSee('ภาพเดียว 4 ประโยค', '<b>แตะรูป</b> — 4 แถว แถวละ 6', [
      { t: '24 ลูก', f: on => Array.from({ length: 24 }, (_, i) => m4dDot(40 + (i % 6) * 26, 50 + Math.floor(i / 6) * 26, 9, '#9FD0F0')).join('') + (on ? r4vH([['4 × 6 = 24', M4C.ink], ['6 × 4 = 24', M4C.ink], ['24 ÷ 4 = 6', M4C.b], ['24 ÷ 6 = 4', M4C.b]].map(([t, c], i) => r4dTx(270, 62 + i * 34, t, c, 'r4v-tx')).join('')) : r4dTx(270, 112, '?', M4C.fade, 'r4v-big')) + r4dTx(105, 186, '4 แถว แถวละ 6', '#7A70A0', 'r4d-sm'), s: 'คูณ 2 ประโยค หาร 2 ประโยค<br>มาจาก<b>ภาพเดียวกัน</b>' }]),
    r4dPlay('แถวลูกแก้ว', 'ลากมุมเปลี่ยนจำนวนแถว ดูประโยคคูณและหาร', () => m4dArrayPlay()),
    m4dTry(453, () => p4factQ(pick(P4_FACT)), 'คูณ ↔ หาร'),
    r4dShow('ตรวจการหารด้วยการคูณ', { fig: m4dChars('45,817 ÷ 6 = 7,636 เศษ 1', 180, 50, 24, M4C.ink, null, 'middle').s, q: 'ตรวจคำตอบ 45,817 ÷ 6 = 7,636 เศษ 1',
      steps: [{ ink: m4dChars('7,636 × 6 = 45,816', 180, 112, 26, M4C.b, null, 'middle').s, w: '7,636 × 6 = 45,816', n: 'ผลหาร × ตัวหาร' }, { ink: m4dChars('45,816 + 1 = 45,817', 180, 166, 26, M4C.o, null, 'middle').s, w: '45,816 + 1 = 45,817', n: '+ เศษ' },
        { ink: r4dTx(180, 214, '= ตัวตั้ง ✓', M4C.g, 'r4d-big'), w: 'เท่ากับตัวตั้ง', n: 'คำตอบถูกต้อง', ans: 1 }],
      fin: '<b>ผลหาร × ตัวหาร + เศษ = ตัวตั้ง</b>', say: 'ผลหารคูณตัวหาร บวกเศษ เท่ากับตัวตั้ง' }),
    m4dTry(453, () => p4chkQ(pick(P4W3_DL.filter(([D, k]) => D % k))), 'ตรวจด้วยการคูณ')],

  /* ด่าน 14 ตัวไม่ทราบค่า (คูณ) */
  454: [
    m4dSee('□ ในการคูณ', '<b>แตะรูป</b> — □ × 6 = 15,432', [
      { t: '□ × 6 = 15,432', f: on => r4dTx(180, 50, '□ × 6 = 15,432', M4C.ink, 'r4v-big') + m4dBar(6, '□', '15,432') + (on ? r4vH(r4dTx(180, 200, '□ = 15,432 ÷ 6', M4C.g, 'r4v-big')) : r4dTx(180, 200, '□ = ?', M4C.fade, 'r4v-big')), s: '6 ส่วนเท่ากัน รวม 15,432<br>□ = <b>15,432 ÷ 6</b>' }]),
    r4dShow('125 × □ = 47,000', { fig: m4dChars('125 × □ = 47,000', 180, 52, 28, M4C.ink, null, 'middle').s, q: 'หาค่าของ □ ใน 125 × □ = 47,000',
      steps: [{ ink: m4dChars('□ = 47,000 ÷ 125', 180, 112, 28, M4C.p, null, 'middle').s, w: '□ = 47,000 ÷ 125', n: 'ตัวคูณ = ผลคูณ ÷ ตัวตั้ง' }, { ink: m4dChars('□ = 376', 180, 166, 28, M4C.b, null, 'middle').s, w: '47,000 ÷ 125 = 376', n: 'หารยาว' },
        { ink: r4dTx(180, 214, '125 × 376 = 47,000 ✓', M4C.g, 'r4d-tx'), w: 'ตรวจ 125 × 376 = 47,000', n: 'แทนค่ากลับ' }, { w: 'ตอบ □ = 376', n: 'ตัวไม่ทราบค่า', ans: 1 }],
      fin: 'หา □ ในการคูณ: <b>ผลคูณ ÷ จำนวนที่รู้</b>', say: 'หาตัวไม่ทราบค่าในการคูณ ใช้ผลคูณหารด้วยจำนวนที่รู้' }),
    m4dTry(454, () => Q.p4UnkM(pick(P4W3_UNK_M.filter(t => p4umWork(p4uSolveM(t))))), 'หาค่า □')],

  /* ด่าน 15 ตัวไม่ทราบค่า (หาร) */
  455: [
    m4dSee('□ ในการหาร', '<b>แตะรูป</b> — 2 แบบ', [
      { t: '□ ÷ 7 = 4,526', f: on => r4dTx(180, 50, '□ ÷ 7 = 4,526', M4C.ink, 'r4v-big') + m4dBar(7, '4,526', '□', 20, 120, 320) + (on ? r4vH(r4dTx(180, 204, '□ = 4,526 × 7', M4C.g, 'r4v-big')) : r4dTx(180, 204, '□ = ?', M4C.fade, 'r4v-big')), s: 'ไม่รู้ตัวตั้ง<br>□ = <b>ผลหาร × ตัวหาร</b>' },
      { t: '58,320 ÷ □ = 8', f: on => r4dTx(180, 50, '58,320 ÷ □ = 8', M4C.ink, 'r4v-big') + m4dBar(8, '□', '58,320', 20, 120, 320) + (on ? r4vH(r4dTx(180, 204, '□ = 58,320 ÷ 8', M4C.g, 'r4v-big')) : r4dTx(180, 204, '□ = ?', M4C.fade, 'r4v-big')), s: 'ไม่รู้ตัวหาร<br>□ = <b>ตัวตั้ง ÷ ผลหาร</b>' }]),
    r4dShow('96,000 ÷ □ = 240', { fig: m4dChars('96,000 ÷ □ = 240', 180, 52, 28, M4C.ink, null, 'middle').s, q: 'หาค่าของ □ ใน 96,000 ÷ □ = 240',
      steps: [{ ink: m4dChars('□ = 96,000 ÷ 240', 180, 112, 28, M4C.p, null, 'middle').s, w: '□ = 96,000 ÷ 240', n: 'ตัวหาร = ตัวตั้ง ÷ ผลหาร' }, { ink: m4dChars('□ = 400', 180, 166, 28, M4C.b, null, 'middle').s, w: '9,600 ÷ 24 = 400', n: 'ปิด 0 แล้วหาร' },
        { ink: r4dTx(180, 214, '96,000 ÷ 400 = 240 ✓', M4C.g, 'r4d-tx'), w: 'ตรวจ 96,000 ÷ 400 = 240', n: 'แทนค่ากลับ' }, { w: 'ตอบ □ = 400', n: 'ตัวไม่ทราบค่า', ans: 1 }],
      fin: `ไม่รู้ตัวตั้ง → <b>คูณ</b>${r4vSep}ไม่รู้ตัวหาร → <b>หาร</b>`, say: 'ไม่รู้ตัวตั้งใช้คูณ ไม่รู้ตัวหารใช้หาร' }),
    m4dTry(455, () => Q.p4UnkM(pick(P4W3_UNK_D.filter(t => p4umWork(p4uSolveM(t))))), 'หาค่า □')],

  /* ด่าน 16 ผลคูณใกล้เคียง */
  456: (() => { const X = v => 30 + (v - 3900) * 1.5, ax = `<path d="M20 130 H340" stroke="${M4C.ink}" stroke-width="2.4"/>` + [3942, 3996, 4050].map((v, i) => `<path d="M${X(v)} 122 V138" stroke="${M4C.b}" stroke-width="2.4"/>` + r4dTx(X(v), 160, fmt(v), M4C.b, 'r4d-sm') + r4dTx(X(v), 112, `${73 + i} × 54`, '#7A70A0', 'r4d-sm')).join('') + `<path d="M${X(4000)} 70 V140" stroke="${M4C.g}" stroke-width="2.4" stroke-dasharray="6 4"/>` + r4dTx(X(4000), 62, '4,000', M4C.g, 'r4d-tx');
    return [
      m4dSee('ผลคูณใกล้เคียง', '<b>แตะรูป</b> — ผลคูณของ 54 ที่อยู่ใกล้ 4,000', [
        { t: '? × 54 ≈ 4,000', f: on => ax + (on ? r4vH(`<path d="M${X(3996)} 182 H${X(4000)}" stroke="${M4C.p}" stroke-width="4"/>` + r4dTx(X(3996) - 10, 206, 'ห่าง 4', M4C.p, 'r4d-tx') + `<path d="M${X(4000)} 190 H${X(4050)}" stroke="${M4C.o}" stroke-width="4"/>` + r4dTx(X(4050), 222, 'ห่าง 50', M4C.o, 'r4d-tx')) : ''), s: '74 × 54 = 3,996 ห่างแค่ 4<br>ใกล้ที่สุดคือ <b>74</b>' }]),
      r4dPlay('เส้นจำนวน', 'ลากหาผลคูณที่ใกล้ที่สุด', () => m4dNearPlay()),
      r4dShow('ใกล้ 4,000 ที่สุด', { fig: ax, q: 'จำนวนใดคูณ 54 แล้วได้ผลคูณใกล้เคียง 4,000 มากที่สุด',
        steps: [{ w: '4,000 ÷ 54 ได้ 74 เศษ 4', n: 'หารเพื่อหาจำนวนโดยประมาณ' }, { ink: `<circle cx="${X(3996)}" cy="130" r="8" fill="none" stroke="${M4C.p}" stroke-width="2.6"/>` + r4dTx(X(3996) - 6, 200, 'ห่าง 4', M4C.p, 'r4d-tx'), w: '74 × 54 = 3,996 ห่าง 4', n: 'ไม่เกิน 4,000' },
          { ink: `<circle cx="${X(4050)}" cy="130" r="8" fill="none" stroke="${M4C.o}" stroke-width="2.6"/>` + r4dTx(X(4050), 200, 'ห่าง 50', M4C.o, 'r4d-tx'), w: '75 × 54 = 4,050 ห่าง 50', n: 'เกิน 4,000' }, { w: 'ตอบ 74', n: 'ห่างน้อยกว่า', ans: 1 }],
        fin: `หารหาจำนวนโดยประมาณ แล้ว<b>เทียบคู่ที่ติดกัน</b>${r4vSep}ถ้าโจทย์บอก "ไม่เกิน" เลือกตัวที่ไม่เกิน`, say: 'หารหาจำนวนโดยประมาณ แล้วเทียบคู่ที่ติดกัน ถ้าโจทย์บอกไม่เกิน เลือกตัวที่ไม่เกิน' }),
      m4dTry(456, () => p4nearQ(pick(P4_NEAR.filter(x => x[2] === 'near'))), 'ผลคูณใกล้เคียง'),
      m4dTry(456, () => p4nearQ(pick(P4_NEAR.filter(x => x[2] === 'max'))), 'ผลคูณไม่เกิน')]; })(),

  /* ด่าน 17 แบบรูปคูณ หาร */
  457: (() => { const S = [5, 20, 80, 320, 1280], bx = i => 14 + i * 68, box = (i, t, col = M4C.ink, f = '#fff') => `<rect x="${bx(i)}" y="100" width="60" height="46" rx="10" fill="${f}" stroke="${col}" stroke-width="2.2"/>` + r4dTx(bx(i) + 30, 130, t, col, 'r4v-tx'), arc = (i, lab, col = M4C.p) => `<path d="M${bx(i) + 34} 96 Q${bx(i) + 64} 62 ${bx(i) + 94} 96" fill="none" stroke="${col}" stroke-width="2.4"/>` + r4dTx(bx(i) + 64, 66, lab, col, 'r4d-tx');
    const base = S.map((v, i) => i === 2 ? box(i, '?', M4C.p, '#FFF1C9') : box(i, fmt(v))).join('');
    return [
      m4dSee('แบบรูปการคูณ', '<b>แตะรูป</b> — จำนวนถัดไปได้จากอะไร', [
        { t: '6, 60, 600, …', f: on => [6, 60, 600, 6000, 60000].map((v, i) => box(i, fmt(v))).join('') + (on ? r4vH([0, 1, 2, 3].map(i => arc(i, '× 10')).join('') + r4dTx(180, 196, 'คูณด้วย 10 ทุกครั้ง', M4C.p, 'r4v-tx')) : ''), s: 'จำนวนถัดไป = <b>× 10</b>' },
        { t: '3,125, 625, 125, …', f: on => [3125, 625, 125, 25, 5].map((v, i) => box(i, fmt(v))).join('') + (on ? r4vH([0, 1, 2, 3].map(i => arc(i, '÷ 5', M4C.b)).join('') + r4dTx(180, 196, 'หารด้วย 5 ทุกครั้ง', M4C.b, 'r4v-tx')) : ''), s: 'จำนวนถัดไป = <b>÷ 5</b>' }]),
      r4dShow('5, 20, ?, 320, 1,280', { fig: base, q: 'หาจำนวนที่หายไป 5, 20, ?, 320, 1,280',
        steps: [{ ink: arc(0, '× 4'), w: '20 ÷ 5 = 4', n: 'หาความสัมพันธ์: คูณ 4' }, { ink: arc(3, '× 4'), w: '1,280 ÷ 320 = 4', n: 'ตรวจอีกคู่' }, { ink: arc(1, '× 4', M4C.g) + r4dTx(bx(2) + 30, 176, '80', M4C.g, 'r4d-big'), w: '20 × 4 = 80', n: 'หาจำนวนที่หายไป' },
          { ink: arc(2, '× 4', M4C.g) + r4dTx(180, 220, '80 × 4 = 320 ✓', M4C.g, 'r4d-tx'), w: 'ตรวจ 80 × 4 = 320', n: 'ถูกต้อง' }, { w: 'ตอบ 80', n: 'จำนวนที่หายไป', ans: 1 }],
        fin: 'หา<b>ความสัมพันธ์</b> (× หรือ ÷ เท่าไร) แล้วใช้หาจำนวนที่หายไป', say: 'หาความสัมพันธ์ว่าคูณหรือหารเท่าไร แล้วใช้หาจำนวนที่หายไป' }),
      m4dTry(457, () => p4patQ(pick(P4W3_PAT.slice(0, 6))), 'แบบรูป')]; })(),

  /* ด่าน 18 โจทย์คูณ หาร */
  458: (() => { const trees = Array.from({ length: 24 }, (_, i) => `<path d="M${30 + (i % 8) * 24} ${48 + Math.floor(i / 8) * 34} l8 16 h-16 z" fill="#5BBF7A" stroke="${M4C.ink}" stroke-width="1.2"/>`).join('') + r4dTx(126, 160, '156 แถว แถวละ 245 ต้น', M4C.ink, 'r4d-sm'), camels = Array.from({ length: 6 }, (_, i) => `<rect x="${24 + i * 54}" y="120" width="44" height="40" rx="8" fill="#F4E1C1" stroke="${M4C.ink}" stroke-width="1.6"/>` + r4dTx(46 + i * 54, 145, '?', M4C.p, 'r4d-tx')).join('');
    return [
      m4dSee('คูณ หรือ หาร', '<b>แตะรูป</b> — ดูว่าโจทย์บอกอะไร ถามอะไร', [
        { t: 'หลายแถว แถวละเท่ากัน', f: on => trees + (on ? r4vH(r4dTx(290, 90, '× คูณ', M4C.p, 'r4v-big') + r4dTx(180, 206, '245 × 156 = □ ต้น', M4C.p, 'r4v-tx')) : r4dTx(290, 90, '?', M4C.fade, 'r4v-big')), s: 'รู้แถวละเท่าไร หลายแถว<br>หาทั้งหมด → <b>คูณ</b>' },
        { t: 'แบ่งเท่า ๆ กัน', f: on => r4dTx(180, 60, 'อินทผลัม 23,040 ผล', M4C.ink, 'r4v-tx') + r4dTx(180, 90, 'อูฐ 48 ตัว ตัวละเท่ากัน', M4C.ink, 'r4d-sm') + camels + (on ? r4vH(r4dTx(180, 206, '23,040 ÷ 48 = □ ผล', M4C.b, 'r4v-tx')) : ''), s: 'รู้ทั้งหมด แบ่งเท่า ๆ กัน<br>หาส่วนละเท่าไร → <b>หาร</b>' }]),
      r4dShow('โจทย์การคูณ', { fig: trees, q: 'ปลูกต้นอินทผลัม 156 แถว แถวละ 245 ต้น มีกี่ต้น',
        steps: [{ ink: `<rect x="18" y="38" width="210" height="104" rx="10" fill="none" stroke="${M4C.p}" stroke-width="2.6"/>`, w: 'ถาม: ต้นทั้งหมด', n: 'โจทย์ถามอะไร' }, { ink: r4dTx(296, 90, '×', M4C.p, 'r4d-big'), w: '245 × 156 = □', n: 'แถวละเท่ากัน หลายแถว → คูณ' },
          { ink: r4dTx(180, 206, '= 38,220 ต้น', M4C.g, 'r4d-big'), w: '245 × 156 = 38,220', n: 'ตั้งคูณ' }, { w: 'ตอบ 38,220 ต้น', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'หลายกลุ่ม กลุ่มละเท่ากัน หาทั้งหมด → <b>คูณ</b>', say: 'หลายกลุ่ม กลุ่มละเท่ากัน หาทั้งหมด ใช้การคูณ' }),
      m4dTry(458, () => p4stMD(pick(P4S_MD.filter(s => s.expr.includes('×')))), 'โจทย์การคูณ'),
      r4dShow('โจทย์การหาร', { fig: r4dTx(180, 60, 'อินทผลัม 23,040 ผล', M4C.ink, 'r4v-tx') + camels, q: 'อูฐ 48 ตัว แบกอินทผลัมตัวละเท่า ๆ กัน รวม 23,040 ผล แต่ละตัวแบกกี่ผล',
        steps: [{ ink: `<rect x="16" y="112" width="328" height="56" rx="10" fill="none" stroke="${M4C.p}" stroke-width="2.6"/>`, w: 'ถาม: ตัวละกี่ผล', n: 'แต่ละส่วนเท่าไร' }, { ink: r4dTx(180, 100, '÷ 48', M4C.p, 'r4d-big'), w: '23,040 ÷ 48 = □', n: 'แบ่งเท่า ๆ กัน → หาร' },
          { ink: Array.from({ length: 6 }, (_, i) => r4dTx(46 + i * 54, 190, '480', M4C.g, 'r4d-sm')).join(''), w: '23,040 ÷ 48 = 480', n: 'หารยาว' }, { w: 'ตอบ 480 ผล', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'รู้ทั้งหมด แบ่งเท่า ๆ กัน → <b>หาร</b>', say: 'รู้ทั้งหมด แบ่งเท่า ๆ กัน ใช้การหาร' }),
      m4dTry(458, () => p4stMD(pick(P4S_MD.filter(s => s.expr.includes('÷')))), 'โจทย์การหาร')]; })(),

  /* ด่าน 19 แสดงวิธีทำ */
  459: (() => { const ln = (i, t, col) => r4dTx(54, 58 + i * 46, t, col, 'r4v-tx', 'start');
    return [
      m4dSee('การแสดงวิธีทำ', '<b>แตะรูป</b> — เขียนเป็นลำดับ', [
        { t: 'แสดงวิธีทำ', f: on => `<rect x="30" y="16" width="300" height="208" rx="12" fill="#FFFDF6" stroke="#EDE6D2" stroke-width="2"/>` + (on ? r4vH(ln(0, '① ประโยคสัญลักษณ์ … = □', M4C.b) + ln(1, '② วิธีทำ สิ่งที่โจทย์บอก', M4C.o) + ln(2, '③ คำนวณ … = … หน่วย', M4C.o) + ln(3, '④ ตอบ … หน่วย', M4C.g)) : r4dTx(180, 126, '?', M4C.p, 'r4v-big')), s: 'ประโยค → วิธีทำ → คำนวณ<br>→ <b>ตอบพร้อมหน่วย</b>' }]),
      r4dShow('พัดลม', { fig: Array.from({ length: 6 }, (_, i) => `<circle cx="${50 + i * 52}" cy="100" r="20" fill="#EAF4FC" stroke="${M4C.ink}" stroke-width="2"/><path d="M${50 + i * 52} 120 V150" stroke="${M4C.ink}" stroke-width="3"/>` + r4dTx(50 + i * 52, 174, '1,200', M4C.ink, 'r4d-sm')).join('') + r4dTx(180, 50, 'มีเงิน 52,800 บาท', M4C.ink, 'r4v-tx'), q: 'มีเงิน 52,800 บาท ซื้อพัดลมเครื่องละ 1,200 บาท ได้กี่เครื่อง',
        steps: [{ w: 'ประโยคสัญลักษณ์ 52,800 ÷ 1,200 = □', n: '① แบ่งทีละ 1,200 → หาร' }, { w: 'วิธีทำ มี 52,800 บาท เครื่องละ 1,200', n: '② สิ่งที่โจทย์บอก' },
          { ink: r4dTx(180, 214, '528 ÷ 12 = 44', M4C.g, 'r4d-big'), w: 'ซื้อได้ 52,800 ÷ 1,200 = 44 เครื่อง', n: '③ ปิด 0 แล้วหาร' }, { w: 'ตอบ <span class="thn">๔๔</span> เครื่อง', n: '④ ตอบพร้อมหน่วย', ans: 1 }],
        dense: true, fin: 'ประโยคสัญลักษณ์ → วิธีทำ → คำนวณ → <b>ตอบพร้อมหน่วย</b>', say: 'ประโยคสัญลักษณ์ วิธีทำ คำนวณ แล้วตอบพร้อมหน่วย' }),
      m4dTry(459, () => { const o = pick(P4_SOLM); return Q.p4Seq({ text: o.text, cards: P4_SOLVE(o) }); }, 'เรียงวิธีทำ')]; })(),

  /* ด่าน 20 สร้างโจทย์ */
  460: (() => { const bags = (n, lab, x0 = 26, y = 96) => Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * 62}" y="${y}" width="52" height="44" rx="8" fill="#FFE7A8" stroke="${M4C.ink}" stroke-width="1.6"/>` + `<text x="${x0 + 26 + i * 62}" y="${y + 28}" text-anchor="middle" class="g5d-s" style="font-size:13px">${lab}</text>`).join('');
    return [
      m4dSee('เรื่องของการคูณ และการหาร', '<b>แตะรูป</b> — เครื่องหมายบอกว่าเป็นเรื่องแบบไหน', [
        { t: 'คูณ', f: on => bags(5, '1,650') + (on ? r4vH(r4dTx(180, 70, 'วันละ 1,650 ฟอง 12 วัน', M4C.ink, 'r4v-tx') + r4dTx(180, 186, '1,650 × 12 = □ (ทั้งหมด)', M4C.p, 'r4v-tx')) : ''), s: 'หลายกลุ่ม กลุ่มละเท่ากัน<br>หา<b>ทั้งหมด</b>' },
        { t: 'หาร: ส่วนละเท่าไร', f: on => bags(5, '?') + (on ? r4vH(r4dTx(180, 70, '19,800 ฟอง แบ่ง 12 ร้าน', M4C.ink, 'r4v-tx') + r4dTx(180, 186, '19,800 ÷ 12 = □ (ร้านละ)', M4C.b, 'r4v-tx')) : ''), s: 'แบ่งให้เท่า ๆ กัน<br>หา<b>ส่วนละเท่าไร</b>' }]),
      r4dShow('สร้างโจทย์จาก 2,245 ÷ 5 = □', { fig: m4dChars('2,245 ÷ 5 = □', 180, 54, 30, M4C.ink, null, 'middle').s, q: 'สร้างโจทย์ปัญหาจาก 2,245 ÷ 5 = □',
        steps: [{ ink: r4dTx(180, 96, '÷ = แบ่งเท่า ๆ กัน', M4C.p, 'r4d-tx'), w: 'มีดินสอ 2,245 แท่ง', n: 'สิ่งที่มีทั้งหมด' }, { ink: bags(5, '5', 26, 116), w: 'แบ่งใส่กล่อง กล่องละ 5 แท่ง', n: 'แบ่งเท่า ๆ กัน' },
          { ink: r4dTx(180, 200, 'ได้กี่กล่อง? = □', M4C.g, 'r4d-tx'), w: 'ได้ดินสอกี่กล่อง', n: 'จบด้วยคำถาม' }, { w: 'ตรวจ 2,245 ÷ 5 = 449 กล่อง', n: 'ใช้ทุกจำนวน', ans: 1 }],
        fin: 'ดูเครื่องหมาย → <b>เลือกเรื่อง</b> → ใส่ข้อมูลครบ → จบด้วยคำถาม', say: 'ดูเครื่องหมาย เลือกเรื่อง ใส่ข้อมูลครบ แล้วจบด้วยคำถาม' }),
      m4dTry(460, () => p4s2sQ(pick(M4D_S2S)), 'เลือกโจทย์ที่ตรง'),
      m4dTry(460, () => p4st2sM(pick(M4D_S2S)), 'เลือกประโยคสัญลักษณ์')]; })()
};
/* x of the quotient digit of step i (for marking a 0 in the quotient on a finished long division) */
const m4dDivX = (D, k, i) => { const nd = String(D).length, cw = 26, kw = String(k).length * 16 + 4, L = (360 - (kw + 16 + nd * cw)) / 2; return L + kw + 16 + i * cw + cw / 2; };
/* mental division item (same as the game's) */
const m4dDMQ = ([D, k]) => Q.p4Num({ fig: p4big(`<b class="num">${fmt(D)} ÷ ${k}</b> <b class="fop">=</b> <span class="fsign">?</span>`), q: 'หาผลหาร (คิดในใจ)', a: D / k, hint: `คิดจาก ${fmt(D / 10 ** ((String(D).match(/0*$/) || [''])[0].length))} ÷ ${k} แล้วเติม 0` });

/* ---------- games: in the order of the teach pages, easy → hard ---------- */
const m4dD = (q, d, k) => ({ ...q, __diff: d, __kind: 'm4d' + k });
const m4dSeq = (list, k) => list.map((q, i) => m4dD(q, i + 1, k + (i + 1)));
const m4dSz = x => Array.isArray(x) ? String(x[0]).length * 3 + String(x[1]).length * 4 + (x[0] % 10) / 10 : String(x).length;
/* n items spread from easy to hard, no repeats (pool of [a, b] pairs) */
const m4dSpread = (pool, n, skip = []) => { const S = JSON.stringify, sk = skip.map(S), P = pool.filter(x => !sk.includes(S(x))).sort((a, b) => m4dSz(a) - m4dSz(b)); if (P.length <= n) return P; return Array.from({ length: n }, (_, i) => { const a = Math.floor(i * P.length / n), b = Math.floor((i + 1) * P.length / n); return P[a + Math.floor(Math.random() * (b - a))]; }); };
/* random pairs for long pools: × 1 digit and ÷ 1 digit (short) */
const m4dRndM1 = d => [rnd(d < 5 ? 10000 : 100000, d < 5 ? 99999 : 999999), d < 3 ? rnd(2, 5) : rnd(4, 9)];
const m4dRndD1 = d => { const k = d < 4 ? rnd(2, 5) : rnd(4, 9); return [rnd(d < 7 ? 10000 : 100000, d < 7 ? 99999 : 999999), k]; };
const M4D_GAME = {
  441: () => m4dSeq([...m4dSpread(P4W3_M1, 6), ...[7, 8, 9, 10].map(m4dRndM1)].sort((a, b) => m4dSz(a) - m4dSz(b)).map(([a, b]) => p4mulQ(a, b)), 'm'),
  442: () => m4dSeq([...m4dSpread(P4W3_M10, 2).map(([a, b]) => p4zQ2(a, b)), ...m4dSpread(P4W3_M2, 8).map(([a, b]) => p4mulQ(a, b))], 'm'),
  443: () => m4dSeq(m4dSpread([...P4W3_MZ, [4507, 300], [62, 7000], [813, 20000], [2500, 4000], [1200, 300], [345, 600], [7080, 500], [36, 90000]], 10).map(([a, b]) => p4zQ2(a, b)), 'z'),
  444: () => m4dSeq(m4dSpread(P4W3_MB, 10).map(([a, b]) => p4mulQ(a, b)), 'm'),
  445: () => { const E = m4dSpread([...P4W3_MB, ...P4W3_M2], 7); return m4dSeq([...E.map(p4estMulQ), ...m4dSpread(P4W3_MB, 3, E).map(([a, b]) => p4mulQ(a, b))], 'e'); },
  446: () => m4dSeq([...m4dSpread([...P4W3_DL, [45317, 4], [93052, 8]], 8).map(([D, k]) => Q.p4Div({ D, k })), ...m4dSpread(P4W3_DM, 2).map(m4dDMQ)], 'd'),
  447: () => m4dSeq([...P4W3_DS, ...[9, 10].map(m4dRndD1)].sort((a, b) => m4dSz(a) - m4dSz(b)).map(([D, k]) => Q.p4Div({ D, k, label: 'หารสั้น' })), 's'),
  448: () => m4dSeq(m4dSpread([...P4_D10, [8640, 30], [5280, 40]], 8).map(([D, k]) => Q.p4Div({ D, k })), 't'),
  449: () => m4dSeq(m4dSpread([...P4_D2S, [4368, 21], [7125, 57]], 8).map(([D, k]) => Q.p4Div({ D, k })), 't'),
  450: () => m4dSeq(m4dSpread([...P4W3_D2.filter(x => x[0] < 1e6), [84530, 41], [97165, 32], [67890, 64]], 8).map(([D, k]) => Q.p4Div({ D, k })), 't'),
  451: () => m4dSeq(m4dSpread([...P4_D3S, [9520, 525], [4725, 175], [8064, 192]], 8).map(([D, k]) => Q.p4Div({ D, k })), 't'),
  452: () => m4dSeq(m4dSpread([...P4W3_D3.filter(x => x[0] > 9999), ...P4_D3B, [72500, 125], [48360, 312], [135000, 270]], 8).map(([D, k]) => Q.p4Div({ D, k })), 't'),
  453: () => m4dSeq([...m4dSpread([...P4_FACT, [1736, 42], [5208, 19]], 5).map(p4factQ), ...m4dSpread([...P4W3_DL, [45317, 4], [93052, 8]].filter(([D, k]) => D % k), 5).map(p4chkQ)], 'f'),
  454: () => { const S = P4W3_UNK_M.slice().sort((a, b) => a.length - b.length), A = S.filter(t => p4umWork(p4uSolveM(t))), B = S.filter(t => !A.slice(0, 5).includes(t)); return m4dSeq([...pkF(A, 5).sort((a, b) => a.length - b.length).map(t => Q.p4UnkM(t)), ...pkF(B.length >= 3 ? B : S, 3).map(p4unkMQ)], 'u'); },
  455: () => { const S = P4W3_UNK_D.slice().sort((a, b) => a.length - b.length), A = S.filter(t => p4umWork(p4uSolveM(t))), B = S.filter(t => !A.slice(0, 5).includes(t)); return m4dSeq([...pkF(A, 5).sort((a, b) => a.length - b.length).map(t => Q.p4UnkM(t)), ...pkF(B.length >= 3 ? B : S, 3).map(p4unkMQ)], 'u'); },
  456: () => m4dSeq([...m4dSpread([...P4_NEAR.filter(x => x[2] === 'near'), [29, 800, 'near'], [32, 900, 'near'], [45, 3000, 'near'], [72, 5000, 'near']].map(x => [x[1], x[0], x]), 7).map(x => x[2]).sort((a, b) => a[1] - b[1]), ...[...P4_NEAR.filter(x => x[2] === 'max'), [42, 3000, 'max']].sort((a, b) => a[1] - b[1])].map(p4nearQ), 'n'),
  457: () => m4dSeq(m4dSpread(P4W3_PAT.map(([s, bl]) => [s, bl]), 10).sort((a, b) => Math.max(...a[0]) - Math.max(...b[0])).map(p4patQ), 'p')
};
/* ด่าน 20: โจทย์จากประโยคสัญลักษณ์ให้ครบ 8 ข้อ (เดิม 5 ข้อ) */
const M4D_S2S = [...P4_S2SM,
  { s: '4800 ÷ 16', ok: 'มีน้ำดื่ม 4,800 ขวด จัดใส่ลัง ลังละ 16 ขวด ได้กี่ลัง', bad: ['มีน้ำดื่ม 4,800 ลัง ลังละ 16 ขวด มีน้ำดื่มทั้งหมดกี่ขวด', 'มีน้ำดื่ม 4,800 ขวด ขายไป 16 ขวด เหลือกี่ขวด'] },
  { s: '125 × 48', ok: 'ห้องประชุมมีเก้าอี้ 48 แถว แถวละ 125 ตัว มีเก้าอี้ทั้งหมดกี่ตัว', bad: ['ห้องประชุมมีเก้าอี้ 125 ตัว จัดเป็น 48 แถว แถวละเท่า ๆ กัน ได้แถวละกี่ตัว', 'ห้องประชุมมีเก้าอี้ 125 ตัว ยกมาเพิ่ม 48 ตัว มีเก้าอี้กี่ตัว'] },
  { s: '36500 ÷ 365', ok: 'โรงงานผลิตตุ๊กตาได้ 36,500 ตัว ใน 365 วัน วันละเท่า ๆ กัน ผลิตได้วันละกี่ตัว', bad: ['โรงงานผลิตตุ๊กตาวันละ 36,500 ตัว 365 วันผลิตได้กี่ตัว', 'โรงงานผลิตตุ๊กตา 36,500 ตัว ขายไป 365 ตัว เหลือกี่ตัว'] }];
M4D_GAME[460] = () => { const S = shuffle(M4D_S2S.slice()); return [...S.slice(0, 4).map(p4s2sQ), ...S.slice(4).map(p4st2sM)]; };
LESSONS_P4C3.forEach(L => { if (M4D_TEACH[L.id]) { L.teach = M4D_TEACH[L.id]; L.__pracDone = 1; L.learned = true; } if (M4D_GAME[L.id]) { L.game = M4D_GAME[L.id]; L.gameN = L.id >= 448 && L.id <= 452 || L.id === 454 || L.id === 455 || L.id === 460 ? 8 : 10; } });
