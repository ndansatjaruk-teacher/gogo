/* =========================================================
   ป.4 บทที่ 1 ทะเลทรายจำนวนนับ (ด่าน 401–409) — หน้าสอนและเกมเรียงใหม่ (v266 · ผู้ใช้ขอ) · prefix n4d
   เหมือนบทที่ 2–10 ของ ป.4: ประเด็นละหน้า ① ดูภาพ (ลูกคิด ตารางหลักแบ่งชุดล้าน/ชุดหน่วย กองแสนสิบกอง เส้นจำนวนจุดกึ่งกลาง …)
   → ลงมือเอง (แตะเลขโดด ลากจุดบนเส้นจำนวน เลือกของ) → ② ทำให้ดู (ดินสอระบายหลัก เขียนเลขลงช่องทีละหลัก เติม 0
   ขีดเลขโดดที่ต่างกันครั้งแรก วงหลักที่ใช้ตัดสิน ลากลูกศรไปจำนวนเต็มที่ใกล้กว่า + เขียนบนกระดาษทีละบรรทัด) → ③ ลองทำ (ข้อแบบเดียวกับในเกม)
   ตัดการ์ด "รู้จัก" ตัวอย่างตัวหนังสือ (p4ex) และหน้ากดปุ่มทีละขั้น/ปุ่ม + − (abacusMachine hopStrip simReadSplit simCmpP4 และปุ่ม ◀ − + ▶ ของ p4Round)
   เกมด่าน 1–7 และ 9 เรียงตามประเด็น ง่าย → ยาก (n4dOrd) · ด่าน 8 คงสุ่มสลับ หมื่น แสน ล้าน (ผู้ใช้เคยขอ) · วางท้าย order.txt
   ========================================================= */
const N4C = { ink: '#2B2550', p: '#E5487A', b: '#2F7BC0', g: '#1B8862', o: '#EC7F1E', fade: '#B7AED3', y: '#FFE7A8', sky: '#DCEBFA', m: '#FDE2EA', bad: '#D9534F' };
const n4dT = (x, y, t, col = N4C.ink, cls = 'r4d-tx', anc = 'middle') => r4dTx(x, y, t, col, cls, anc);
const n4dIn = s => String(s).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const n4dSee = (title, cap, list) => a4dSee(title, cap, list);
const n4dTry = (id, mk, title) => g5dTry(id, mk, title);
const n4dOld = (title, f) => T(`<b>ลงมือเอง</b> — ${title}`, `ลงมือเอง ${title}`, f);
const N4_NM = ['ร้อยล้าน', 'สิบล้าน', 'ล้าน', 'แสน', 'หมื่น', 'พัน', 'ร้อย', 'สิบ', 'หน่วย'];
/* a place-value chart in svg: k columns (ร้อยล้าน … หน่วย), the ชุดล้าน / ชุดหน่วย brackets, the digits of str (optional) */
function n4dChart(str, o = {}) { const k = o.places || str.length, cw = Math.min(38, 324 / k), x0 = 180 - k * cw / 2, X = i => x0 + i * cw + cw / 2, nm = N4_NM.slice(9 - k), y0 = o.y0 || 44, pad = k - str.length;
  let s = '';
  if (k > 6 && o.groups !== false) s += `<rect x="${a4n(x0)}" y="${y0 - 34}" width="${a4n((k - 6) * cw - 2)}" height="18" rx="5" fill="${N4C.m}"/><rect x="${a4n(x0 + (k - 6) * cw)}" y="${y0 - 34}" width="${a4n(6 * cw)}" height="18" rx="5" fill="${N4C.sky}"/>` + n4dT(x0 + (k - 6) * cw / 2, y0 - 21, 'ชุดล้าน', N4C.p, 'e4d-nm') + n4dT(x0 + (k - 3) * cw, y0 - 21, 'ชุดหน่วย', N4C.b, 'e4d-nm');
  nm.forEach((t, i) => { s += n4dT(X(i), y0, t, k - i > 6 ? N4C.p : '#7A70A0', 'e4d-nm') + `<rect x="${a4n(x0 + i * cw + 1.5)}" y="${y0 + 8}" width="${a4n(cw - 3)}" height="44" rx="6" fill="${o.hi && o.hi.includes(i) ? N4C.y : '#fff'}" stroke="${N4C.fade}" stroke-width="1.3"/>`; });
  if (o.digits !== false) [...str].forEach((d, j) => { s += n4dT(X(pad + j), y0 + 40, d, o.col ? o.col(pad + j, d) || N4C.ink : N4C.ink, 'e4d-dg'); });
  return { s, X, cw, x0, k, yD: y0 + 40, yB: y0 + 52, y0, pad }; }
const n4dCell = (C, i, col = N4C.y, d) => `<rect x="${a4n(C.x0 + i * C.cw + 1.5)}" y="${C.y0 + 8}" width="${a4n(C.cw - 3)}" height="44" rx="6" fill="${col}" stroke="${N4C.fade}" stroke-width="1.3" data-pop="1"/>` + (d != null ? n4dT(C.X(i), C.yD, d, N4C.ink, 'e4d-dg') : '');
const n4dDig = (C, i, d, col = N4C.b) => n4dT(C.X(i), C.yD, d, col, 'e4d-dg');
/* a number line between two multiples of 10^pow, with the point n */
function n4dLine(n, pow, o = {}) { const U = 10 ** pow, lo = Math.floor(n / U) * U, hi = lo + U, mid = lo + U / 2, x0 = 58, x1 = 302, X = v => x0 + (v - lo) / U * (x1 - x0), y = o.y || 120;
  let s = `<path d="M${x0 - 12} ${y} H${x1 + 12}" stroke="${N4C.ink}" stroke-width="2.6"/>`;
  for (let j = 0; j <= 10; j++) s += `<path d="M${a4n(x0 + j * (x1 - x0) / 10)} ${y - (j % 5 ? 6 : 12)} V${y + (j % 5 ? 6 : 12)}" stroke="${j === 5 ? N4C.p : N4C.ink}" stroke-width="${j % 5 ? 1.4 : 2.4}"/>`;
  s += n4dT(x0, y + 34, fmt(lo), N4C.ink, 'r4d-sm') + n4dT(x1, y + 34, fmt(hi), N4C.ink, 'r4d-sm') + n4dT((x0 + x1) / 2, y + 34, fmt(mid), N4C.p, 'r4d-sm');
  const dot = `<circle cx="${a4n(X(n))}" cy="${y}" r="8" fill="#3BA5E6" stroke="#fff" stroke-width="2.4"/>` + n4dT(X(n), y - 22, fmt(n), '#2F86C2', 'r4d-tx');
  const r = n >= mid ? hi : lo, arrow = `<path d="M${a4n(X(n))} ${y + 14} Q${a4n((X(n) + X(r)) / 2)} ${y + 40} ${a4n(X(r))} ${y + 14}" fill="none" stroke="${N4C.g}" stroke-width="3"/>` + `<circle cx="${a4n(X(r))}" cy="${y}" r="9" fill="none" stroke="${N4C.g}" stroke-width="3"/>`;
  return { s, dot, arrow, X, lo, hi, mid, r, y }; }
/* digit index (from the left) of the place that decides rounding to 10^pow */
const n4dKey = (n, pow) => String(n).length - pow;
const n4dRing = (x, y, r = 16, col = N4C.o) => `<circle cx="${a4n(x)}" cy="${a4n(y)}" r="${r}" fill="none" stroke="${col}" stroke-width="2.6"/>`;
/* game order: the lesson's own order (one point after another, easy → hard) */
const n4dOrd = (L, order) => { const g = L.game; L.game = () => { const qs = g(); return (order ? order.map(i => qs[i]).filter(Boolean) : qs).map((q, i) => ({ ...q, __diff: i, __tier: 0 })); }; };

/* ---------- worked examples ---------- */
/* read a number: shade each group, write its words on the paper */
function n4dRead(n, title) { const s = String(n), k = s.length, C = n4dChart(s), m = Math.floor(n / 1e6), r = n % 1e6, steps = [];
  if (k > 6) { steps.push({ ink: Array.from({ length: k - 6 }, (_, i) => n4dCell(C, i, N4C.m, s[i])).join('') + n4dT(C.X(0) + (k - 7) * C.cw / 2, C.yB + 30, thaiWords(m) + 'ล้าน', N4C.p, 'r4d-sm'), w: thaiWords(m) + 'ล้าน', n: 'ชุดล้าน อ่านแล้วต่อด้วย “ล้าน”', tmp: 0 });
    steps.push({ ink: Array.from({ length: 6 }, (_, i) => n4dCell(C, k - 6 + i, N4C.sky, s[k - 6 + i])).join('') + (r ? n4dT(C.X(k - 3) - C.cw / 2, C.yB + 30, thaiWords(r), N4C.b, 'r4d-sm') : ''), w: r ? thaiWords(r) : '(ไม่ต้องอ่าน)', wa: 1, n: r ? 'ชุดหน่วย อ่านเหมือนจำนวนไม่เกินแสน' : 'ชุดหน่วยเป็น 0 ทั้งหมด' }); }
  else [...s].forEach((d, i) => { if (+d) steps.push({ ink: n4dCell(C, i, N4C.y, d), w: thaiWords(+d * 10 ** (k - 1 - i)).replace(/^หนึ่ง(?=สิบ)/, '').replace(/^สอง(?=สิบ)/, 'ยี่').replace(/^หนึ่ง$/, i === k - 1 && k > 1 ? 'เอ็ด' : 'หนึ่ง'), wa: steps.length ? 1 : 0, n: `${N4_NM[9 - k + i]} ${d}` }); });
  steps.push({ w: thaiWords(n), n: 'หลักที่เป็น 0 ไม่ต้องอ่าน', ans: 1 });
  return r4dShow(title, { fig: C.s, q: `อ่าน ${fmt(n)}`, steps, dense: steps.length > 4, fin: `อ่านจาก<b>หลักซ้ายสุด</b> หลักที่เป็น 0 ไม่ต้องอ่าน`, say: 'อ่านจากหลักซ้ายสุด หลักที่เป็นศูนย์ไม่ต้องอ่าน' }); }
/* write a number from words: fill the chart group by group, zeros last */
function n4dWrite(n, words, title) { const s = String(n), k = s.length, C = n4dChart(s, { digits: false }), m = Math.floor(n / 1e6), r = n % 1e6, steps = [];
  const fill = (a, b) => Array.from({ length: b - a }, (_, j) => a + j).filter(i => s[i] !== '0').map(i => n4dDig(C, i, s[i])).join('');
  if (k > 6) { steps.push({ ink: Array.from({ length: k - 6 }, (_, i) => n4dCell(C, i, N4C.m)).join('') + fill(0, k - 6), w: `ชุดล้าน ${thaiWords(m)} → ${m}`, n: 'คำหน้า “ล้าน”' });
    steps.push({ ink: fill(k - 6, k), w: `ชุดหน่วย ${thaiWords(r)}`, n: 'ใส่ทีละหลักตามคำอ่าน' }); }
  else steps.push({ ink: fill(0, k), w: words, n: 'ใส่ทีละหลักตามคำอ่าน' });
  steps.push({ ink: [...s].map((d, i) => d === '0' ? n4dDig(C, i, '0', N4C.p) : '').join(''), w: 'ช่องว่างเติม 0', n: 'หลักที่ไม่ได้อ่าน เติม 0' });
  steps.push({ w: `= ${fmt(n)}`, n: 'ใส่จุลภาคทุก 3 หลักจากขวา', ans: 1 });
  return r4dShow(title, { fig: C.s, q: `เขียน “${words}” เป็นตัวเลขฮินดูอารบิก`, steps, fin: `ใส่เลขตามหลัก แล้ว<b>เติม 0</b> ในหลักที่ไม่ได้อ่าน`, say: 'ใส่เลขตามหลัก แล้วเติมศูนย์ในหลักที่ไม่ได้อ่าน' }); }
/* round n to 10^pow on the number line, the pencil rings the deciding digit */
function n4dRound(n, pow, title) { const Ln = n4dLine(n, pow, { y: 150 }), s = String(n), kd = n4dKey(n, pow), cw = 19, str = fmt(n);
  let x = 180 - [...str].reduce((t, c) => t + (c === ',' ? 8 : cw), 0) / 2, xs = [], top = ''; [...str].forEach(c => { const w = c === ',' ? 8 : cw; if (/\d/.test(c)) xs.push(x + w / 2); top += n4dT(x + w / 2, 52, c, N4C.ink, 'e4d-dg'); x += w; });
  const dig = +s[kd];
  return r4dShow(title, { fig: top + Ln.s, q: `ค่าประมาณเป็นจำนวนเต็ม${P4_RN[pow]}ของ ${str}`,
    steps: [{ ink: Ln.dot, w: `อยู่ระหว่าง ${fmt(Ln.lo)} กับ ${fmt(Ln.hi)}`, n: `หาจำนวนเต็ม${P4_RN[pow]}สองข้าง` },
      { ink: n4dRing(xs[kd], 44, 15), w: `หลัก${P4_RN[pow - 1]}คือ ${dig}`, n: dig >= 5 ? '5 ขึ้นไป → ปัดขึ้น' : 'น้อยกว่า 5 → ปัดลง' },
      { ink: Ln.arrow, w: `${str} ≈ ${fmt(Ln.r)}`, n: dig === 5 && n % 10 ** (pow - 1) === 0 ? 'กึ่งกลางพอดี ใช้จำนวนที่มากกว่า' : 'ใกล้จำนวนนี้มากกว่า', ans: 1 }],
    fin: `ดูหลัก<b>ถัดลงมา</b>หนึ่งหลัก: 5 ขึ้นไปปัดขึ้น${r4vSep}น้อยกว่า 5 ปัดลง`, say: 'ดูหลักถัดลงมาหนึ่งหลัก ห้าขึ้นไปปัดขึ้น น้อยกว่าห้าปัดลง' }); }
/* the "see" pages of the rounding lessons */
const n4dRoundSee = (pow, a, b) => n4dSee(`ใกล้จำนวนเต็ม${P4_RN[pow]}ไหนมากกว่า`, '<b>แตะรูป</b> — ดูจุดกึ่งกลาง', [a, b].map(n => { const Ln = n4dLine(n, pow); return {
  t: fmt(n), f: on => Ln.s + Ln.dot + (on ? r4vH(Ln.arrow + n4dT(180, 214, `${fmt(n)} ≈ ${fmt(Ln.r)}`, N4C.g, 'r4v-big')) : ''),
  s: n === Ln.mid ? `อยู่<b>กึ่งกลางพอดี</b><br>ใช้จำนวนที่มากกว่า → ${fmt(Ln.r)}` : `${n >= Ln.mid ? 'เลยจุดกึ่งกลาง → ปัด<b>ขึ้น</b>' : 'ยังไม่ถึงจุดกึ่งกลาง → ปัด<b>ลง</b>'}<br>${fmt(n)} ≈ ${fmt(Ln.r)}` }; }));
const n4dRoundTry = (id, pool, pow, lo, hi, tl) => [n4dTry(id, () => p4rndQ(pick(pool), pow), `หาค่าประมาณเป็นจำนวนเต็ม${P4_RN[pow]}`), n4dTry(id, () => p4lineQ(pick(pool), pow), 'ใกล้จำนวนไหนมากกว่า'),
  n4dTry(id, () => Math.random() < .5 ? p4whichQ(pow, lo, hi) : p4rTF(rnd(tl[0], tl[1]), pow), 'จำนวนใดประมาณได้เท่านี้')];

const N4D_TEACH = {
  /* ด่าน 1 อ่าน เขียน ไม่เกินล้าน */
  401: L => { const AB = n => `<g transform="translate(${180 - (7 * 34 + 24) * 1.12 / 2} 0) scale(1.12)">${n4dIn(abacusSVG(n, { rods: 7 }))}</g>`, TH = '๐๑๒๓๔๕๖๗๘๙';
    return [
      n4dSee('ลูกคิด 7 แกน', '<b>แตะรูป</b> — นับลูกคิดในแต่ละแกน', [
        { t: '305,240', f: on => AB(305240) + (on ? r4vH(n4dT(180, 228, '305,240', N4C.b, 'r4v-big')) : n4dT(180, 228, '?', N4C.fade, 'r4v-big')), s: 'แกนหลักแสนมี 3 ลูก แกนหลักหมื่นไม่มี (0)<br>อ่านว่า <b>สามแสนห้าพันสองร้อยสี่สิบ</b>' }]),
      n4dTry(401, () => p4abQ(p4R(6), 7), 'ลูกคิดแสดงจำนวนใด'),
      n4dSee('สิบแสน เท่ากับ หนึ่งล้าน', '<b>แตะรูป</b> — นับกองละแสน', [
        { t: 'ทีละแสน', f: on => Array.from({ length: 10 }, (_, i) => `<rect x="${24 + i * 32}" y="${on ? 70 : 80}" width="26" height="70" rx="5" fill="${i < 9 || on ? '#FFC24C' : '#fff'}" stroke="${N4C.ink}" stroke-width="1.4"/>` + n4dT(37 + i * 32, 162, String(i + 1), '#7A70A0', 'r4d-sm')).join('') + n4dT(180, 50, '100,000 · 200,000 · … · ?', N4C.ink, 'r4d-tx')
          + (on ? r4vH(`<path d="M24 196 V206 H340 V196" fill="none" stroke="${N4C.p}" stroke-width="2.6"/>` + n4dT(180, 230, '10 แสน = 1,000,000 (หนึ่งล้าน)', N4C.p, 'r4v-tx')) : ''), s: 'นับเพิ่มทีละ 100,000<br>สิบแสน = <b>1,000,000</b> หนึ่งล้าน' }]),
      n4dTry(401, () => { const st = rnd(1, 6) * 100000; return Q.p4Num({ fig: p4big(`<b class="num">${fmt(st)} · ${fmt(st + 100000)} · <span class="fsign">?</span> · ${fmt(st + 300000)}</b>`), q: 'นับเพิ่มทีละแสน จำนวนที่หายไปคือเท่าใด', a: st + 200000, hint: 'เพิ่มทีละ 100,000' }); }, 'นับทีละแสน'),
      n4dRead(708059, 'อ่าน 708,059'),
      n4dTry(401, () => p4d2wQ(p4R(6, .35)), 'อ่านจำนวน'),
      n4dWrite(406207, 'สี่แสนหกพันสองร้อยเจ็ด', 'เขียน “สี่แสนหกพันสองร้อยเจ็ด”'),
      n4dTry(401, () => p4w2dQ(p4R(6, .35)), 'เขียนเป็นตัวเลข'),
      n4dSee('ตัวเลขไทย', '<b>แตะรูป</b> — จับคู่ตัวเลขฮินดูอารบิกกับตัวเลขไทย', [
        { t: '0–9', f: on => Array.from({ length: 10 }, (_, i) => n4dT(36 + i * 32, 80, String(i), N4C.ink, 'e4d-dg') + (on ? r4vH(n4dT(36 + i * 32, 140, TH[i], N4C.p, 'e4d-dg')) : '')).join('') + (on ? r4vH(n4dT(180, 210, '708,059 = ๗๐๘,๐๕๙', N4C.g, 'r4v-tx')) : ''), s: 'เปลี่ยนเลขโดดทีละตัว<br>จุลภาคอยู่ที่เดิม' }]),
      n4dTry(401, () => Math.random() < .5 ? p4t2dQ(p4R(6, .3)) : p4abThQ(p4R(6), 7), 'ตัวเลขไทย')]; },

  /* ด่าน 2 หลักล้าน */
  402: L => { const C = n4dChart('27305618');
    return [
      n4dSee('จำนวนหลักล้าน แบ่งเป็นสองชุด', '<b>แตะรูป</b> — ชุดล้าน กับ ชุดหน่วย', [
        { t: '27,305,618', f: on => C.s + (on ? r4vH(Array.from({ length: 2 }, (_, i) => n4dCell(C, i, N4C.m)).join('') + Array.from({ length: 6 }, (_, i) => n4dCell(C, 2 + i, N4C.sky)).join('') + C.s.replace(/<rect[^>]*>/g, '') + n4dT(C.X(0) + C.cw / 2, 140, 'ยี่สิบเจ็ด ล้าน', N4C.p, 'r4d-tx') + n4dT(C.X(5), 170, 'สามแสนห้าพันหกร้อยสิบแปด', N4C.b, 'r4d-sm')) : ''), s: 'นับ 6 หลักจากขวาเป็น<b>ชุดหน่วย</b> ที่เหลือเป็น<b>ชุดล้าน</b><br>อ่านชุดล้านแล้วต่อด้วย “ล้าน”' }]),
      n4dRead(140000925, 'อ่าน 140,000,925'),
      n4dTry(402, () => p4d2wQ(pick(P4W_3.filter(x => x[1] === 'd'))[0]), 'อ่านจำนวนหลักล้าน'),
      n4dWrite(30026007, 'สามสิบล้านสองหมื่นหกพันเจ็ด', 'เขียน “สามสิบล้านสองหมื่นหกพันเจ็ด”'),
      n4dTry(402, () => { const [n, k] = pick(P4W_3.filter(x => x[1] !== 'd')); return k === 't' ? p4t2dQ(n) : p4w2dQ(n); }, 'เขียนเป็นตัวเลข'),
      n4dTry(402, () => p4w2pQ(pick(P4W_4), P4W_4P), 'เลือกตัวเลขที่ตรงกับคำอ่าน')]; },

  /* ด่าน 3 หลัก ค่าประจำหลัก รูปกระจาย */
  403: L => { const C = n4dChart('52407316'), D = n4dChart('7370000');
    return [
      n4dSee('หลัก และ ค่าของเลขโดด', '<b>แตะรูป</b> — เลขโดดอยู่หลักไหน มีค่าเท่าไร', [
        { t: '52,407,316', f: on => C.s + (on ? r4vH(n4dCell(C, 2, N4C.y, '4') + `<path d="M${a4n(C.X(2))} 104 V146" stroke="${N4C.o}" stroke-width="2.4"/>` + n4dT(C.X(2) + 40, 172, '4 อยู่หลักแสน มีค่า 400,000', N4C.o, 'r4v-tx')) : ''), s: 'เลข 4 อยู่<b>หลักแสน</b><br>มีค่า <b>400,000</b>' },
        { t: '7 สองตัว ค่าต่างกัน', f: on => D.s + (on ? r4vH( n4dCell(D, 0, N4C.m, '7') + n4dCell(D, 2, N4C.y, '7') + n4dT(D.X(0), 152, '7,000,000', N4C.p, 'r4d-tx') + n4dT(D.X(2) + 30, 182, '70,000', N4C.o, 'r4d-tx')) : ''), s: 'เลขโดดเดียวกัน อยู่<b>คนละหลัก</b><br>มีค่าไม่เท่ากัน' }]),
      n4dOld('แตะเลขโดดทุกตัว ดูว่าอยู่หลักใด มีค่าเท่าใด', el => el.append(simP4Tap([52407316, 806150243, 7030900]))),
      n4dTry(403, () => p4placeQ(pick(P4W_PV)), 'อยู่หลักใด'),
      n4dTry(403, () => p4valQ(pick(P4W_PV)), 'มีค่าเท่าใด'),
      (() => { const n = 316058204, s = String(n), E = n4dChart(s), terms = [...s].map((d, i) => +d ? [i, +d * 10 ** (8 - i)] : null).filter(Boolean);
        return r4dShow('เขียน 316,058,204 ในรูปกระจาย', { fig: E.s, q: 'เขียน 316,058,204 ในรูปกระจาย',
          steps: [{ ink: terms.filter(([i]) => i < 2).map(([i]) => n4dCell(E, i, N4C.m, s[i])).join(''), w: '300,000,000 + 10,000,000', n: 'ค่าของแต่ละหลัก' },
            { ink: n4dCell(E, 2, N4C.m, s[2]), w: '+ 6,000,000', n: 'ครบชุดล้าน' },
            { ink: [...s].map((d, i) => d === '0' ? n4dRing(E.X(i), E.yD - 9, 15, N4C.fade) : '').join(''), w: '(หลักที่เป็น 0 ข้าม)', n: 'หลักแสน หลักสิบ เป็น 0' },
            { ink: terms.filter(([i]) => i >= 3).map(([i]) => n4dCell(E, i, N4C.sky, s[i])).join(''), w: '+ 50,000 + 8,000 + 200 + 4', n: 'ชุดหน่วย' }, { w: 'ผลบวกได้ 316,058,204 ✓', n: 'ตรวจ', ans: 1 }], dense: true,
          fin: `รูปกระจาย = <b>ค่าของเลขโดดทุกหลัก</b>บวกกัน (ข้ามหลักที่เป็น 0)`, say: 'รูปกระจายคือค่าของเลขโดดทุกหลักบวกกัน ข้ามหลักที่เป็นศูนย์' }); })(),
      n4dTry(403, () => p4expQ(pick(P4W_EXP)), 'เขียนในรูปกระจาย'),
      n4dTry(403, () => p4fromExpQ(pick(P4W_EXP)), 'จากรูปกระจายเป็นจำนวน')]; },

  /* ด่าน 4 เปรียบเทียบ เรียงลำดับ */
  404: L => { const A = n4dChart('3804215', { places: 7, groups: false }), B = n4dChart('987654', { places: 7, groups: false, y0: 124 });
    const P = n4dChart('56120473', { groups: false }), Q2 = n4dChart('56102473', { groups: false, y0: 124 });
    const R1 = n4dChart('240318500', { groups: false, y0: 30 }), R2 = n4dChart('240318900', { groups: false, y0: 120 });
    return [
      n4dSee('นับจำนวนหลักก่อน', '<b>แตะรูป</b> — จำนวนที่มีหลักมากกว่า มีค่ามากกว่า', [
        { t: '3,804,215 กับ 987,654', f: on => A.s + B.s.replace(/<text[^>]*class="e4d-nm"[^>]*>[^<]*<\/text>/g, '') + (on ? r4vH(n4dT(318, 88, '7 หลัก', N4C.g, 'r4d-sm', 'start') + n4dT(318, 168, '6 หลัก', N4C.p, 'r4d-sm', 'start') + n4dT(180, 228, '3,804,215 > 987,654', N4C.g, 'r4v-tx')) : ''), s: '7 หลัก มากกว่า 6 หลัก<br>3,804,215 <b>&gt;</b> 987,654' },
        { t: 'หลักเท่ากัน', f: on => P.s + Q2.s.replace(/<text[^>]*class="e4d-nm"[^>]*>[^<]*<\/text>/g, '') + (on ? r4vH([0, 1, 2].map(i => n4dCell(P, i, '#D4F1E2') + n4dCell(Q2, i, '#D4F1E2')).join('') + n4dCell(P, 3, N4C.y) + n4dCell(Q2, 3, N4C.y) + P.s.replace(/<rect[^>]*>/g, '') + Q2.s.replace(/<rect[^>]*>/g, '').replace(/<text[^>]*class="e4d-nm"[^>]*>[^<]*<\/text>/g, '') + n4dT(180, 228, 'หลักแสน 1 > 0', N4C.o, 'r4v-tx')) : ''), s: 'หลักเท่ากัน เทียบ<b>ทีละหลักจากซ้าย</b><br>ต่างกันครั้งแรกที่หลักแสน 1 &gt; 0' }]),
      r4dShow('เปรียบเทียบ 240,318,500 กับ 240,318,900', { fig: R1.s + R2.s.replace(/<text[^>]*class="e4d-nm"[^>]*>[^<]*<\/text>/g, ''), q: 'เติม > หรือ < : 240,318,500 ◯ 240,318,900',
        steps: [{ w: '9 หลัก เท่ากัน', n: 'นับจำนวนหลักก่อน' }, { ink: [0, 1, 2, 3, 4, 5].map(i => n4dCell(R1, i, '#D4F1E2') + n4dCell(R2, i, '#D4F1E2')).join('') + R1.s.replace(/<rect[^>]*>/g, '') + R2.s.replace(/<rect[^>]*>/g, '').replace(/<text[^>]*class="e4d-nm"[^>]*>[^<]*<\/text>/g, ''), w: '240,318 เท่ากัน', n: 'เทียบจากซ้ายทีละหลัก' },
          { ink: n4dRing(R1.X(6), R1.yD - 9) + n4dRing(R2.X(6), R2.yD - 9), w: 'หลักร้อย 5 < 9', n: 'ต่างกันครั้งแรก ตัดสินที่หลักนี้' }, { ink: n4dT(180, 230, '240,318,500 < 240,318,900', N4C.g, 'r4v-tx'), w: '240,318,500 < 240,318,900', n: 'ไม่ต้องดูหลักที่เหลือ', ans: 1 }],
        fin: `นับหลัก → เท่ากันจึง<b>เทียบจากซ้าย</b> → ตัดสินที่หลักแรกที่ต่างกัน`, say: 'นับหลักก่อน ถ้าเท่ากันเทียบจากซ้าย ตัดสินที่หลักแรกที่ต่างกัน' }),
      n4dTry(404, () => p4cmpQ(pick(P4W_CMP)), 'เติม > < ='),
      n4dTry(404, () => p4tfQ(pick(P4W_TF)), 'ถูกหรือผิด'),
      (() => { const N = [7215300, 7251030, 725103, 72510300], xs = [52, 140, 228, 316], card = (i, x, y, col = N4C.ink) => `<rect x="${x - 42}" y="${y}" width="84" height="36" rx="8" fill="#fff" stroke="${col}" stroke-width="2"/>` + n4dT(x, y + 24, fmt(N[i]), col, 'r4d-sm');
        return r4dShow('เรียงจากน้อยไปมาก', { fig: N.map((_, i) => card(i, xs[i], 30)).join(''), q: 'เรียง 7,215,300 · 7,251,030 · 725,103 · 72,510,300 จากน้อยไปมาก',
          steps: [{ ink: card(2, xs[0], 150, N4C.b) + n4dT(xs[0], 136, 'น้อยสุด', N4C.b, 'r4d-sm'), w: '725,103 มี 6 หลัก น้อยที่สุด', n: 'นับจำนวนหลัก' },
            { ink: card(3, xs[3], 150, N4C.p) + n4dT(xs[3], 136, 'มากสุด', N4C.p, 'r4d-sm'), w: '72,510,300 มี 8 หลัก มากที่สุด', n: 'หลักมากที่สุด' },
            { ink: card(0, xs[1], 150) + card(1, xs[2], 150), w: '7,215,300 < 7,251,030', n: '7 หลักเท่ากัน หลักหมื่น 1 < 5' },
            { ink: `<path d="M${xs[0] + 46} 168 H${xs[1] - 46} M${xs[1] + 46} 168 H${xs[2] - 46} M${xs[2] + 46} 168 H${xs[3] - 46}" stroke="${N4C.g}" stroke-width="2.4"/>` + n4dT(180, 220, 'น้อย → มาก', N4C.g, 'r4v-tx'), w: '725,103 < 7,215,300 <', n: 'เรียงแล้ว' }, { w: '7,251,030 < 72,510,300', n: 'น้อย → มาก', ans: 1 }],
          dense: true, fin: `เรียงลำดับ: <b>นับหลัก</b>ก่อน แล้วเทียบจำนวนที่มีหลักเท่ากัน`, say: 'เรียงลำดับ นับหลักก่อน แล้วเทียบจำนวนที่มีหลักเท่ากัน' }); })(),
      n4dTry(404, () => Math.random() < .5 ? Q.order({ nums: pick(P4W_ASC), dir: 'asc' }) : Q.order({ nums: pick(P4W_DESC), dir: 'desc' }), 'เรียงลำดับ'),
      n4dTry(404, () => { const k = rnd(0, 1); return Q.p4Pick({ q: `จำนวนใด<span class="hl">${k ? 'มากที่สุด' : 'น้อยที่สุด'}</span>`, opts: P4W_13.map(fmt), right: fmt(k ? Math.max(...P4W_13) : Math.min(...P4W_13)), hint: 'นับจำนวนหลักก่อน แล้วเทียบจากหลักซ้ายสุด' }); }, 'มากที่สุด น้อยที่สุด')]; },

  /* ด่าน 5–7 ค่าประมาณเป็นจำนวนเต็มสิบ ร้อย พัน */
  405: L => [n4dRoundSee(1, 364, 365), n4dOld('ลากจุดบนเส้นจำนวน ใกล้จำนวนเต็มสิบใดมากกว่า', el => el.append(p4Round(364, 1, { noStep: 1 }))), n4dRound(5307, 1, '5,307 ประมาณเป็นจำนวนเต็มสิบ'), ...n4dRoundTry(405, P4W_R1, 1, 30, 900, [1001, 9999])],
  406: L => [n4dRoundSee(2, 6438, 6450), n4dOld('ลากจุดบนเส้นจำนวน ดูตัวเลขหลักสิบ', el => el.append(p4Round(6438, 2, { noStep: 1 }))), n4dRound(12951, 2, '12,951 ประมาณเป็นจำนวนเต็มร้อย'), ...n4dRoundTry(406, P4W_R2, 2, 12, 95, [10001, 99999])],
  407: L => [n4dRoundSee(3, 25716, 25300), n4dOld('ลากจุดบนเส้นจำนวน ดูตัวเลขหลักร้อย', el => el.append(p4Round(25716, 3, { noStep: 1 }))), n4dRound(499620, 3, '499,620 ประมาณเป็นจำนวนเต็มพัน'), ...n4dRoundTry(407, P4W_R3, 3, 12, 95, [100001, 999999])],

  /* ด่าน 8 หมื่น แสน ล้าน */
  408: L => [
    n4dSee('จำนวนเดียวกัน ประมาณได้ต่างกัน', '<b>แตะรูป</b> — ดูหลักถัดลงมาของแต่ละแบบ', [4, 5, 6].map(p => { const Ln = n4dLine(2549300, p); return { t: `เต็ม${P4_RN[p]}`, f: on => Ln.s + Ln.dot + (on ? r4vH(Ln.arrow + n4dT(180, 214, `≈ ${fmt(Ln.r)}`, N4C.g, 'r4v-big')) : ''), s: `เต็ม${P4_RN[p]}: ดูหลัก${P4_RN[p - 1]}<br>2,549,300 ≈ <b>${fmt(Ln.r)}</b>` }; })),
    n4dOld('เลือกเต็มหมื่น เต็มแสน หรือเต็มล้าน แล้วลากจุด', el => el.append(p4Round(3746815, 4, { pows: [4, 5, 6], noStep: 1 }))),
    n4dRound(2549300, 5, '2,549,300 ประมาณเป็นจำนวนเต็มแสน'),
    n4dTry(408, () => p4rndQ(pick(P4W_R4), 4), 'เต็มหมื่น'), n4dTry(408, () => p4rndQ(pick(P4W_R5), 5), 'เต็มแสน'), n4dTry(408, () => p4rndQ(pick(P4W_R20), 6), 'เต็มล้าน'),
    n4dTry(408, () => Math.random() < .5 ? p4lineQ(pick(P4W_R4), 4) : p4rTF(rnd(1000001, 9999999), 5), 'ใกล้จำนวนไหน')],

  /* ด่าน 9 ใช้ค่าประมาณ */
  409: L => { const [a, b] = [P4W_TOUR[0], P4W_TOUR[1]];
    return [
      n4dSee('ใช้ค่าประมาณเมื่อไร', '<b>แตะรูป</b> — ไม่ต้องรู้ค่าที่แน่นอน', [
        { t: 'เงินพอไหม', f: on => `<rect x="40" y="40" width="120" height="60" rx="10" fill="#FFF3D6" stroke="${N4C.ink}" stroke-width="1.6"/>` + n4dT(100, 66, 'ตู้เย็น', N4C.ink, 'r4d-sm') + n4dT(100, 90, '8,490', N4C.o, 'r4d-tx') + `<rect x="200" y="40" width="120" height="60" rx="10" fill="#FFF3D6" stroke="${N4C.ink}" stroke-width="1.6"/>` + n4dT(260, 66, 'พัดลม', N4C.ink, 'r4d-sm') + n4dT(260, 90, '1,890', N4C.o, 'r4d-tx')
          + (on ? r4vH(n4dT(180, 150, '≈ 8,000 + 2,000 = 10,000', N4C.b, 'r4v-tx') + n4dT(180, 200, 'มี 12,000 บาท พอ ✓', N4C.g, 'r4v-tx')) : ''), s: 'ประมาณราคาเป็นเต็มพันแล้วบวกในใจ<br>รู้เร็วว่า<b>เงินพอไหม</b>' },
        { t: 'บอกจำนวนคร่าว ๆ', f: on => Array.from({ length: 40 }, (_, i) => `<circle cx="${40 + (i % 10) * 31}" cy="${50 + Math.floor(i / 10) * 30}" r="9" fill="#9FD0F0"/>`).join('') + (on ? r4vH(n4dT(180, 200, 'ผู้ชมประมาณ 50,000 คน', N4C.g, 'r4v-tx')) : ''), s: 'ข่าว รายงาน บอกจำนวนคร่าว ๆ<br>ใช้<b>ค่าประมาณ</b> (ทอนเงิน ต้องใช้ค่าจริง)' }]),
      n4dTry(409, () => Q.p4Pick(P4_USE), 'สถานการณ์ที่ใช้ค่าประมาณ'),
      n4dOld('เลือกของที่จะซื้อและวิธีประมาณ เงิน 25,000 บาทพอไหม', el => el.append(simEstShop())),
      r4dShow('ประมาณก่อนบวก', e1dEq([{ e: '38,460 + 9,720' }, { e: '≈ !38,000 + !10,000', w: '38,460 → 38,000  9,720 → 10,000', n: 'ประมาณเป็นจำนวนเต็มพัน' }, { e: '= *48,000', w: 'มีหนังสือประมาณ 48,000 เล่ม', n: 'บวกในใจ (จริง 48,180)', ans: 1 }],
        { q: 'ห้องสมุดมีหนังสือ 38,460 เล่ม ซื้อเพิ่ม 9,720 เล่ม ประมาณเป็นจำนวนเต็มพัน รวมมีหนังสือประมาณกี่เล่ม', fin: `<b>ประมาณแต่ละจำนวนก่อน</b> แล้วจึงบวกหรือลบ`, say: 'ประมาณแต่ละจำนวนก่อน แล้วจึงบวกหรือลบ' })),
      n4dTry(409, () => Q.p4Num(pick(P4_STORY)), 'ประมาณก่อนคำนวณ'),
      n4dTry(409, () => Math.random() < .5 ? Q.p4Pick({ fig: p4tourFig(), q: 'สถานที่ใดมีผู้มาเที่ยวมากที่สุด', opts: P4W_TOUR.map(x => x[0]), right: 'ตลาดน้ำทะเลทราย', hint: 'นับจำนวนหลักก่อน' }) : Q.p4Num({ fig: p4tourFig(), q: `ผู้มาเที่ยว${a[0]}ประมาณเป็นจำนวนเต็มล้านได้กี่คน`, a: p4r(a[1], 6), hint: 'ดูตัวเลขหลักแสน' }), 'อ่านตาราง')]; }
};
/* games: the lesson's own order follows the teaching order (ด่าน 8 stays mixed) */
const N4D_ORD = { 401: [0, 5, 2, 1, 4, 3], 402: null, 403: null, 404: null, 405: null, 406: null, 407: null, 409: [5, 3, 4, 0, 1, 2] };
LESSONS_P4C1.forEach(L => { const f = N4D_TEACH[L.id]; if (f) { L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true; } if (L.id in N4D_ORD) n4dOrd(L, N4D_ORD[L.id]); });
