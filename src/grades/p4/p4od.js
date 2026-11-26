/* =========================================================
   ป.4 บทที่ 4 ทะเลทรายระคน — หน้าสอนและเกมเรียงใหม่ (v257 · ผู้ใช้ขอ) · prefix o4d
   เหมือนบทที่ 5–10: ประเด็นละหน้า ① ดูภาพ (r4vSee) → (บางประเด็น) ลองปรับเอง → ② ทำให้ดู (r4dDo: ดินสอขีดเส้นใต้ส่วนที่ต้องทำก่อน
   เขียนบรรทัด "= …" ต่อลงมาเหมือนคนทำจริง คิดบนกระดาษทด คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อแบบเดียวกับในเกม)
   ไม่มี stepper ในหน้าสอน: o4dShopPlay (แตะ/ลากเลือกจำนวนของ แทน simPicShop) o4dLevelPlay (ลากเส้นค่าเฉลี่ย)
   เกมด่าน 1–7 10 ข้อเรียงตามประเด็นและง่าย → ยาก (O4D_GAME) · ด่าน 8–14 (โจทย์ปัญหา) ใช้เกมเดิม · วางหลัง p4td.js ใน order.txt
   ========================================================= */
const O4DC = { ink: '#2B2550', p: '#E5487A', b: '#2F7BC0', g: '#1B8862', o: '#EC7F1E', y: '#FFE7A8', sky: '#BFE3F7', fade: '#B7AED3', bad: '#D9534F' };
const o4dTok = e => e.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').replace(/,/g, '').trim().split(/\s+/);
const o4dIsOp = t => /^[+−×÷=]$/.test(t);
const o4dShowT = t => /^\d+$/.test(t) ? fmt(+t) : t;
const o4dTw = (t, fs) => { const s = o4dShowT(t); if (o4dIsOp(s)) return fs * 1.3; if (s === '(' || s === ')') return fs * .48; if (s === '□') return fs * 1.05; if (s === '?') return fs * .8;
  return [...s].reduce((a, c) => a + (c === ',' ? fs * .3 : fs * .6), 0) + fs * .2; };
/* one written line of an expression: every token is its own <text> (the pencil writes them one by one) */
function o4dLine(T, x0, y, fs, o = {}) { let x = x0, s = ''; const xs = [];
  T.forEach((t, i) => { const w = o4dTw(t, fs), c = x + w / 2, col = (o.pk || []).includes(i) ? O4DC.p : o.col || O4DC.ink;
    s += t === '□' ? `<rect x="${a4n(c - fs * .38)}" y="${a4n(y - fs * .76)}" width="${a4n(fs * .76)}" height="${a4n(fs * .84)}" rx="3" fill="#fff" stroke="${col}" stroke-width="2"/>`
      : `<text x="${a4n(c)}" y="${a4n(y)}" class="o4d-e" text-anchor="middle" style="fill:${col};font-size:${a4n(fs)}px">${o4dShowT(t)}</text>`;
    const pad = o4dIsOp(t) ? fs * .3 : 0; xs.push([x + pad, x + w - pad]); x += w; });
  return { s, xs, w: x - x0 }; }
const o4dLw = (T, fs) => T.reduce((a, t) => a + o4dTw(t, fs), 0);
const o4dUnder = (L, lo, hi, y, col = O4DC.p) => { const a = L.xs[lo][0] - 2, b = L.xs[hi][1] + 2; return `<path d="M${a4n(a)} ${a4n(y + 9)} Q${a4n((a + b) / 2)} ${a4n(y + 16)} ${a4n(b)} ${a4n(y + 9)}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`; };
const o4dBox = (L, lo, hi, y, fs, col = '#FFD27A') => { const a = L.xs[lo][0] - 4, b = L.xs[hi][1] + 4; return `<rect x="${a4n(a)}" y="${a4n(y - fs * .9)}" width="${a4n(b - a)}" height="${a4n(fs * 1.22)}" rx="8" fill="${col}" fill-opacity=".55"/>`; };
const o4dEllT = (L, lo, hi, y, fs, col = O4DC.p) => { const a = L.xs[lo][0], b = L.xs[hi][1]; return g5dEll((a + b) / 2, y - fs * .32, (b - a) / 2, fs * .66, col); };
/* the next part to work out, by the rules: innermost brackets → × ÷ left to right → + − left to right */
const O4OP = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };
function o4dNext(T) { let a = 0, b = T.length - 1, br = false;
  for (let i = 0; i < T.length; i++) if (T[i] === '(') { let j = i + 1; while (T[j] !== ')' && T[j] !== '(') j++; if (T[j] === ')') { a = i + 1; b = j - 1; br = true; break; } }
  const ops = []; for (let k = a + 1; k < b; k += 2) ops.push(k);
  const md = ops.find(k => T[k] === '×' || T[k] === '÷'), k = md != null ? md : ops[0], as = ops.some(x => T[x] === '+' || T[x] === '−');
  const why = br ? 'ในวงเล็บก่อน' : md != null && as ? 'คูณ หาร ก่อน บวก ลบ' : ops.length > 1 ? 'ทำจากซ้ายไปขวา' : 'เหลือเครื่องหมายเดียว';
  const v = O4OP[T[k]](+T[k - 1], +T[k + 1]), N = [...T.slice(0, k - 1), String(v), ...T.slice(k + 2)]; let pk = k - 1, lo = k - 1, hi = k + 1;
  if (N[pk - 1] === '(' && N[pk + 1] === ')') { N.splice(pk + 1, 1); N.splice(pk - 1, 1); pk--; lo--; hi++; }
  return { k, lo, hi, v, N, pk, why, part: `${fmt(+T[k - 1])} ${T[k]} ${fmt(+T[k + 1])} = ${fmt(v)}` }; }
/* a worked example done like a person: the problem on top, "= …" lines written under it, the part done next underlined */
function o4dCas(expr, o = {}) { const L = [o4dTok(expr)], P = [];
  while (L[L.length - 1].length > 1) { const st = o4dNext(L[L.length - 1]); P.push(st); L.push(st.N); }
  const n = L.length, fs = Math.min(o.fs || 22, 22 * 312 / o4dLw(L[0], 22)), x0 = (360 - o4dLw(L[0], fs)) / 2 + 9, dy = Math.min(46, 196 / Math.max(1, n - 1)), y0 = (240 - (n - 1) * dy) / 2 + 10, Y = i => y0 + i * dy;
  const eq = i => `<text x="${a4n(x0 - fs * .62)}" y="${a4n(Y(i))}" class="o4d-e" text-anchor="middle" style="font-size:${a4n(fs)}px">=</text>`;
  const lines = L.map((T, i) => o4dLine(T, x0, Y(i), fs, { pk: i ? [P[i - 1].pk] : [] }));
  const steps = P.map((st, i) => ({ ink: (i ? eq(i) + lines[i].s : '') + o4dUnder(lines[i], st.lo, st.hi, Y(i)), w: st.part, n: (o.notes && o.notes[i]) || st.why }));
  steps.push({ ink: eq(n - 1) + lines[n - 1].s, w: o.ans || `ตอบ ${fmt(+L[n - 1][0])}`, n: o.endN || 'เหลือจำนวนเดียว คือคำตอบ', ans: 1 });
  return { fig: lines[0].s, steps, q: o.q, fin: o.fin, say: o.say, dense: P.length > 3 || o.dense }; }
const o4dExpr = (expr, y, o = {}) => { const T = o4dTok(expr), fs = Math.min(o.fs || 22, 22 * (o.wmax || 320) / o4dLw(T, 22)), x0 = o.x0 != null ? o.x0 : (360 - o4dLw(T, fs)) / 2; return { T, fs, y, ...o4dLine(T, x0, y, fs, o) }; };

/* ---------- little pictures ---------- */
const o4dApple = (x, y, r = 9) => `<circle cx="${a4n(x)}" cy="${a4n(y)}" r="${r}" fill="#E5484D" stroke="${O4DC.ink}" stroke-width="1.3"/><path d="M${a4n(x)} ${a4n(y - r + 1)} q1 -5 5 -6" fill="none" stroke="#1B8862" stroke-width="2"/>`;
const o4dBasket = (x, y, n = 4, r = 7) => Array.from({ length: n }, (_, i) => o4dApple(x + 9 + i * (2 * r + 1), y, r)).join('') + `<path d="M${a4n(x)} ${a4n(y + 3)} H${a4n(x + n * (2 * r + 1) + 3)} L${a4n(x + n * (2 * r + 1) - 3)} ${a4n(y + 22)} H${a4n(x + 6)} Z" fill="#E9B872" stroke="${O4DC.ink}" stroke-width="1.5"/><path d="M${a4n(x + 4)} ${a4n(y + 12)} H${a4n(x + n * (2 * r + 1) - 1)}" stroke="#B9873E" stroke-width="1.4"/>`;
const o4dBag = (x, y, lab, col = O4DC.sky) => `<path d="M${x + 4} ${y + 10} Q${x} ${y + 46} ${x + 20} ${y + 46} Q${x + 40} ${y + 46} ${x + 36} ${y + 10} Z" fill="${col}" stroke="${O4DC.ink}" stroke-width="1.6"/><path d="M${x + 10} ${y + 10} L${x + 14} ${y + 2} H${x + 26} L${x + 30} ${y + 10}" fill="#fff" stroke="${O4DC.ink}" stroke-width="1.6"/>` + r4dTx(x + 20, y + 36, lab, O4DC.ink, 'r4d-sm');
const o4dTray = (x, y, lab) => `<rect x="${x}" y="${y}" width="40" height="26" rx="5" fill="#FFE7A8" stroke="${O4DC.ink}" stroke-width="1.5"/>` + [0, 1, 2].map(i => `<ellipse cx="${x + 8 + i * 12}" cy="${y + 9}" rx="4.6" ry="5.4" fill="#fff" stroke="#C9A86A"/>`).join('') + r4dTx(x + 20, y + 23, lab, O4DC.ink, 'r4d-sm');
const o4dBox3 = (x, y, lab, s = 1) => `<rect x="${x}" y="${y}" width="${30 * s}" height="${22 * s}" rx="3" fill="#E9B872" stroke="${O4DC.ink}" stroke-width="1.4"/><path d="M${x + 15 * s} ${y} V${y + 22 * s}" stroke="#B9873E" stroke-width="1.4"/>` + (lab ? r4dTx(x + 15 * s, y + 16 * s, lab, O4DC.ink, 'r4d-sm') : '');
const o4dBook = (x, y) => `<rect x="${x}" y="${y}" width="22" height="28" rx="2" fill="#3C8DDB" stroke="${O4DC.ink}" stroke-width="1.4"/><path d="M${x + 5} ${y} V${y + 28}" stroke="#fff" stroke-width="1.6"/>`;
const o4dMilk = (x, y) => `<path d="M${x} ${y + 8} L${x + 9} ${y} L${x + 18} ${y + 8} V${y + 30} H${x} Z" fill="#fff" stroke="${O4DC.ink}" stroke-width="1.4"/><rect x="${x}" y="${y + 14}" width="18" height="8" fill="#9FD0F0"/>`;
const o4dPurse = (x, y, lab) => { const w = Math.max(74, lab.length * 8.4 + 18); return `<rect x="${x}" y="${y}" width="${a4n(w)}" height="44" rx="12" fill="#F49AB5" stroke="${O4DC.ink}" stroke-width="1.6"/><path d="M${a4n(x + w / 2 - 11)} ${y} Q${a4n(x + w / 2)} ${y - 14} ${a4n(x + w / 2 + 11)} ${y}" fill="none" stroke="${O4DC.ink}" stroke-width="1.6"/>` + r4dTx(x + w / 2, y + 28, lab, O4DC.ink, 'r4d-sm'); };
const o4dCross = (x, y, s = 8, col = O4DC.bad) => `<path d="M${a4n(x - s)} ${a4n(y - s)} L${a4n(x + s)} ${a4n(y + s)} M${a4n(x + s)} ${a4n(y - s)} L${a4n(x - s)} ${a4n(y + s)}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
const o4dArrowD = (x, y1, y2, col = O4DC.p) => r4dArr([x, y1], [x, y2], col);
const o4dSee = (title, cap, list) => a4dSee(title, cap, list);
const o4dTry = (id, mk, title) => g5dTry(id, mk, title);

/* ---------- hands-on (no steppers) ---------- */
/* shop: tap / drag along a row of items to choose how many — the story, the sentence and the change follow */
function o4dShopPlay() { const IT = [['สมุด', 'เล่ม', 35, o4dBook, 11, 14], ['นม', 'กล่อง', 15, o4dMilk, 9, 15]], M = 200, gx = i => 150 + i * 58, gy = j => 34 + j * 104;
  const total = s => IT[0][2] * s.a + IT[1][2] * s.b;
  return tgScene({ W: 560, H: 250, st: { a: 1, b: 0 }, cap: `มีเงิน <b>${M} บาท</b> — <b>แตะหรือลากนิ้ว</b>ไปตามแถว เพื่อเลือกจำนวนของที่ซื้อ (ลากไปซ้ายสุด = ไม่ซื้อ)`,
    missions: [['ซื้อสมุด 3 เล่ม และนม 2 กล่อง', s => s.a === 3 && s.b === 2], ['ซื้อจนเงินทอนเป็น 0 บาทพอดี', s => total(s) === M], ['ลองซื้อจนเงินไม่พอ', s => total(s) > M]],
    svg: s => IT.map(([nm, u, p, art, ox, oy], j) => `<text x="16" y="${gy(j) + 34}" class="g5d-h" style="font-size:18px">${nm}</text><text x="16" y="${gy(j) + 58}" class="g5d-s" style="font-size:14px">${u}ละ ${p} บาท</text>` + Array.from({ length: 6 }, (_, i) => { const on = i < (j ? s.b : s.a);
      return `<rect x="${gx(i)}" y="${gy(j)}" width="52" height="78" rx="10" fill="${on ? '#FFF1C9' : '#fff'}" stroke="${on ? O4DC.o : '#E1DAF2'}" stroke-width="2.4"/>` + `<g opacity="${on ? 1 : .25}" transform="translate(${gx(i) + 26} ${gy(j) + 39}) scale(1.6) translate(${-ox} ${-oy})">${art(0, 0)}</g>`; }).join('') + `<text x="${gx(6) + 6}" y="${gy(j) + 46}" class="g5d-h" style="fill:${O4DC.o};font-size:20px">× ${j ? s.b : s.a}</text>`).join(''),
    drag: (pt, s) => { const j = pt[1] < 125 ? 0 : 1, i = Math.max(0, Math.min(6, Math.floor((pt[0] - gx(0) + 3) / 58) + 1)); if (pt[0] < 100) return null; const k = j ? 'b' : 'a'; if (s[k] === i) return null; sfx.tap(); return { ...s, [k]: i }; },
    info: s => { const t = total(s), A = IT[0][2] * s.a, B = IT[1][2] * s.b; return `${exprHTML(`${M} − ((${s.a} × ${IT[0][2]}) + (${s.b} × ${IT[1][2]}))`)} = □${r4vSep}ราคารวม ${fmt(A)} + ${fmt(B)} = <b>${fmt(t)}</b> บาท${r4vSep}${t > M ? '<b>เงินไม่พอ!</b>' : `เงินทอน ${M} − ${fmt(t)} = <b>${fmt(M - t)}</b> บาท`}`; } }); }
/* mean: drag the level line — the parts above it (too much) must fill the gaps below it (too little) */
function o4dLevelPlay() { const V = [6, 2, 5, 3, 4], m = 4, g = 25, base = 204, bx = i => 130 + i * 72, Y = v => base - v * g;
  const over = lv => V.reduce((a, v) => a + Math.max(0, v - lv), 0), under = lv => V.reduce((a, v) => a + Math.max(0, lv - v), 0);
  return tgScene({ W: 560, H: 250, st: { lv: 1, seen: [] }, cap: 'ส้มของเด็ก 5 คน — <b>ลากจุดสีชมพู</b>ขึ้นลง หาระดับที่ส่วนเกิน (ชมพู) เท่ากับส่วนที่ขาด (ฟ้า)',
    missions: [['ลองระดับที่สูงเกินไป', s => s.seen.includes(-1)], ['ลองระดับที่ต่ำเกินไป', s => s.seen.includes(1)], ['หาระดับที่เกินเท่ากับขาด', s => s.lv === m]],
    svg: s => V.map((v, i) => Array.from({ length: Math.max(v, s.lv) }, (_, j) => { const has = j < v, ab = j >= s.lv; return `<rect x="${bx(i)}" y="${Y(j + 1) + 1}" width="52" height="${g - 2}" rx="4" fill="${has ? (ab ? '#F9B8CC' : '#FFC24C') : '#D6ECFA'}" stroke="${has ? O4DC.ink : '#7FB8E0'}" stroke-width="1.3" ${has ? '' : 'stroke-dasharray="4 3"'}/>`; }).join('') + `<text x="${bx(i) + 26}" y="${base + 18}" class="g5d-s" text-anchor="middle" style="font-size:14px">คนที่ ${i + 1}</text><text x="${bx(i) + 26}" y="${base + 36}" class="g5d-h" text-anchor="middle" style="font-size:15px">${v} ผล</text>`).join('')
      + `<path d="M110 ${Y(s.lv)} H496" stroke="${O4DC.p}" stroke-width="2.6" stroke-dasharray="7 5"/>` + tgHandle(522, Y(s.lv), O4DC.p) + `<text x="30" y="${Y(s.lv) + 6}" class="g5d-h" style="fill:${O4DC.p};font-size:18px">${s.lv} ผล</text>`,
    drag: (pt, s) => { const lv = Math.max(1, Math.min(7, Math.round((base - pt[1]) / g))); if (lv === s.lv) return null; sfx.tap(); const d = Math.sign(over(lv) - under(lv)); return { lv, seen: s.seen.includes(d) ? s.seen : [...s.seen, d] }; },
    info: s => { const a = over(s.lv), b = under(s.lv); return `ระดับ ${s.lv} ผล: เกิน <b>${a}</b> ผล ขาด <b>${b}</b> ผล${r4vSep}${a === b ? `<b>เท่ากันพอดี!</b> ค่าเฉลี่ย = ${s.lv} ผล (รวม 20 ÷ 5 คน = 4)` : a > b ? 'เกินมากกว่าขาด → ยกเส้นขึ้นได้อีก' : 'ขาดมากกว่าเกิน → ลดเส้นลง'}`; } }); }

/* =========================================================
   the lessons
   ========================================================= */
const O4D_TEACH = {
  /* ด่าน 1 มีวงเล็บ 3 จำนวน */
  471: (() => { const E = o4dExpr('400 − (125 + 75)', 46), X = v => 30 + v * .75, E2a = o4dExpr('400 − (125 + 75)', 76, { fs: 22 }), E2b = o4dExpr('400 − 125 + 75', 172, { fs: 22 });
    return [
      o4dSee('วงเล็บ = ทำก่อน', '<b>แตะรูป</b> — มีเงิน 400 บาท ซื้อของ 125 บาท กับ 75 บาท', [
        { t: '400 − (125 + 75)', f: on => o4dBox(E, 2, 6, 46, E.fs) + E.s + `<rect x="${X(0)}" y="112" width="300" height="40" rx="6" fill="#C9F0D9" stroke="${O4DC.ink}" stroke-width="2"/>` + r4dTx(180, 104, '400 บาท', O4DC.ink)
          + (on ? r4vH(`<rect x="${X(200)}" y="112" width="${125 * .75}" height="40" fill="#F9B8CC" stroke="${O4DC.ink}" stroke-width="2"/><rect x="${X(325)}" y="112" width="${75 * .75}" height="40" fill="#FFD27A" stroke="${O4DC.ink}" stroke-width="2"/>` + r4dTx(X(262.5), 138, '125') + r4dTx(X(362.5), 138, '75') + r4dTx(X(100), 138, '200', O4DC.g)
            + `<path d="M${X(200)} 164 V172 H${X(400)} V164" fill="none" stroke="${O4DC.p}" stroke-width="2.4"/>` + r4dTx(X(300), 194, '(125 + 75) = 200 ใช้ไป', O4DC.p) + r4dTx(X(100), 194, 'เหลือ 200', O4DC.g)) : r4dTx(180, 138, '?', O4DC.p, 'r4v-big')),
          s: 'รวมของที่ซื้อ<b>ก่อน</b> (125 + 75) = 200<br>400 − 200 = <b>200</b> บาท' },
        { t: 'มี กับ ไม่มีวงเล็บ', f: on => E2a.s + E2b.s + r4dTx(180, 42, 'มีวงเล็บ', O4DC.b, 'g5d-h') + r4dTx(180, 140, 'ไม่มีวงเล็บ', O4DC.o, 'g5d-h')
          + (on ? r4vH(r4dTx(180, 108, '= 200', O4DC.b, 'r4v-big') + r4dTx(180, 204, '= 350', O4DC.o, 'r4v-big') + r4dTx(180, 232, 'คำตอบไม่เท่ากัน!', O4DC.p)) : r4dTx(180, 108, '= ?', O4DC.fade, 'r4v-big') + r4dTx(180, 204, '= ?', O4DC.fade, 'r4v-big')),
          s: 'วงเล็บเปลี่ยนคำตอบ<br>ต้องทำ<b>ในวงเล็บก่อนเสมอ</b>' }]),
      r4dShow('400 − (125 + 75)', o4dCas('400 − (125 + 75)', { q: 'หาผลลัพธ์ 400 − (125 + 75)', notes: ['ในวงเล็บก่อน (ขีดเส้นใต้)'], fin: 'ทำ<b>ในวงเล็บก่อน</b> แล้วเขียน = บรรทัดใหม่', say: 'ทำในวงเล็บก่อน แล้วเขียนบรรทัดใหม่' })),
      o4dTry(471, () => p4firstQ(pick(P4W4_BR3)), 'ทำส่วนใดก่อน'),
      o4dTry(471, () => p4calcQ(pick(P4W4_BR3.slice(0, 8))), 'คิดทีละขั้น')]; })(),

  /* ด่าน 2 มีวงเล็บ มากกว่า 3 จำนวน */
  472: (() => { const E = o4dExpr('(900 − 150) ÷ (18 + 7)', 60);
    return [
      o4dSee('วงเล็บ 2 คู่', '<b>แตะรูป</b> — มีวงเล็บกี่คู่ ทำทุกคู่ก่อน', [
        { t: '(900 − 150) ÷ (18 + 7)', W: 360, H: 200, f: on => o4dBox(E, 0, 4, 60, E.fs) + o4dBox(E, 6, 10, 60, E.fs, '#BFE3F7') + E.s
          + (on ? r4vH(o4dArrowD((E.xs[0][0] + E.xs[4][1]) / 2, 74, 104) + o4dArrowD((E.xs[6][0] + E.xs[10][1]) / 2, 74, 104) + r4dTx((E.xs[0][0] + E.xs[4][1]) / 2, 130, '750', O4DC.p, 'r4v-big') + r4dTx((E.xs[5][0] + E.xs[5][1]) / 2, 130, '÷', O4DC.ink, 'r4v-big') + r4dTx((E.xs[6][0] + E.xs[10][1]) / 2, 130, '25', O4DC.b, 'r4v-big') + r4dTx(180, 176, '750 ÷ 25 = 30', O4DC.g, 'r4v-big')) : r4dTx(180, 130, '? ÷ ?', O4DC.fade, 'r4v-big')),
          s: 'ทำในวงเล็บ<b>ทั้งสองคู่</b>ก่อน<br>แล้วจึง 750 ÷ 25 = 30' }]),
      r4dShow('(4,800 ÷ 6) + (125 × 8)', o4dCas('(4800 ÷ 6) + (125 × 8)', { q: 'หาผลลัพธ์ (4,800 ÷ 6) + (125 × 8)', notes: ['วงเล็บคู่แรก', 'วงเล็บคู่ที่สอง', 'แล้วจึงบวก'], fin: 'มีวงเล็บหลายคู่ ทำ<b>ทุกคู่ก่อน</b> แล้วจึงทำเครื่องหมายนอกวงเล็บ', say: 'ทำในวงเล็บทุกคู่ก่อน แล้วจึงทำเครื่องหมายนอกวงเล็บ' })),
      o4dTry(472, () => p4firstQ(pick(P4W4_BR1.filter(e => p4nCount(e) > 3))), 'ทำส่วนใดก่อน'),
      o4dTry(472, () => p4calcQ(pick(P4W4_BR1.filter(e => p4nCount(e) > 3))), 'คิดทีละขั้น')]; })(),

  /* ด่าน 3 บวก ลบ ไม่มีวงเล็บ */
  473: (() => { const X = v => 30 + v * .3, ax = `<path d="M20 150 H340" stroke="${O4DC.ink}" stroke-width="2.4"/>` + Array.from({ length: 11 }, (_, i) => `<path d="M${X(i * 100)} 144 V156" stroke="${O4DC.ink}" stroke-width="2"/>` + (i % 2 ? '' : r4dTx(X(i * 100), 176, fmt(i * 100), O4DC.ink, 'r4d-sm'))).join(''),
      hop = (a, b, col, lab, hh = 46) => `<path d="M${X(a)} 146 Q${(X(a) + X(b)) / 2} ${146 - hh * 2} ${X(b)} 146" fill="none" stroke="${col}" stroke-width="2.8"/>` + r4dTx((X(a) + X(b)) / 2, 140 - hh, lab, col) + `<circle cx="${X(b)}" cy="150" r="6" fill="${col}"/>`;
    return [
      o4dSee('บวก ลบ ทำจากซ้ายไปขวา', '<b>แตะรูป</b> — 900 − 300 + 100 เดินบนเส้นจำนวน', [
        { t: 'ซ้ายไปขวา ✓', f: on => r4dTx(180, 36, '900 − 300 + 100', O4DC.ink, 'r4v-big') + ax + `<circle cx="${X(900)}" cy="150" r="6" fill="${O4DC.ink}"/>` + (on ? r4vH(hop(900, 600, O4DC.p, '− 300') + hop(600, 700, O4DC.g, '+ 100', 22) + r4dTx(X(700), 214, '= 700', O4DC.g, 'r4v-big')) : ''), s: 'ถอยไป 300 ก่อน แล้วเดินหน้า 100<br>= <b>700</b>' },
        { t: 'ทำ + ก่อน ✗', f: on => r4dTx(180, 36, '900 − 300 + 100', O4DC.ink, 'r4v-big') + ax + `<circle cx="${X(900)}" cy="150" r="6" fill="${O4DC.ink}"/>` + (on ? r4vH(r4dTx(180, 66, '300 + 100 = 400 ก่อน', O4DC.bad, 'r4d-tx') + hop(900, 500, O4DC.bad, '− 400', 36) + r4dTx(X(500), 214, '= 500 ✗', O4DC.bad, 'r4v-big')) : ''), s: 'ทำ 300 + 100 ก่อน ได้ 500<br><b>ผิด</b> — ต้องทำจากซ้ายไปขวา' }]),
      r4dShow('5,000 − 1,250 + 750', o4dCas('5000 − 1250 + 750', { q: 'หาผลลัพธ์ 5,000 − 1,250 + 750', notes: ['เริ่มทางซ้ายก่อน', 'แล้วทำต่อทางขวา'], fin: 'บวก ลบ ไม่มีวงเล็บ: ทำ<b>จากซ้ายไปขวา</b>', say: 'บวกลบที่ไม่มีวงเล็บ ทำจากซ้ายไปขวา' })),
      o4dTry(473, () => p4calcQ(pick(P4_PM.slice(0, 3))), 'คิดทีละขั้น'),
      o4dTry(473, () => p4tfOrder(pick(O4D_TF_PM)), 'ถูกหรือผิด')]; })(),

  /* ด่าน 4 คูณ หาร ไม่มีวงเล็บ */
  474: (() => { const ball = (x, t, col = O4DC.ink) => `<circle cx="${x}" cy="110" r="26" fill="#fff" stroke="${col}" stroke-width="2.4"/>` + r4dTx(x, 117, t, col, 'r4v-big'), mac = (x, t, col = O4DC.b) => `<rect x="${x - 30}" y="88" width="60" height="44" rx="10" fill="#EAF4FC" stroke="${col}" stroke-width="2.2"/>` + r4dTx(x, 117, t, col, 'r4v-big') + r4dArr([x - 54, 110], [x - 33, 110], col) + r4dArr([x + 32, 110], [x + 53, 110], col);
    return [
      o4dSee('คูณ หาร ทำจากซ้ายไปขวา', '<b>แตะรูป</b> — 600 ÷ 20 × 3 ผ่านเครื่องทีละเครื่อง', [
        { t: 'ซ้ายไปขวา ✓', W: 400, f: on => r4dTx(200, 40, '600 ÷ 20 × 3', O4DC.ink, 'r4v-big') + ball(30, '600') + mac(112, '÷ 20') + ball(194, on ? '30' : '?', on ? O4DC.p : O4DC.fade) + mac(276, '× 3') + ball(358, on ? '90' : '?', on ? O4DC.g : O4DC.fade) + (on ? r4vH(r4dTx(200, 186, '600 ÷ 20 = 30 → 30 × 3 = 90', O4DC.g)) : ''), s: 'หาร 20 ก่อน ได้ 30<br>แล้วคูณ 3 = <b>90</b>' },
        { t: 'ทำ × ก่อน ✗', f: on => r4dTx(180, 40, '600 ÷ 20 × 3', O4DC.ink, 'r4v-big') + (on ? r4vH(r4dTx(180, 96, '20 × 3 = 60 ก่อน', O4DC.bad) + r4dTx(180, 140, '600 ÷ 60 = 10', O4DC.bad, 'r4v-big') + o4dCross(282, 132, 12)) + r4dTx(180, 190, 'ได้ไม่เท่ากับ 90', O4DC.bad) : r4dTx(180, 130, '?', O4DC.fade, 'r4v-big')), s: 'คูณก่อนได้ 10<br><b>ผิด</b> — ต้องทำจากซ้ายไปขวา' }]),
      r4dShow('720 ÷ 8 × 5', o4dCas('720 ÷ 8 × 5', { q: 'หาผลลัพธ์ 720 ÷ 8 × 5', notes: ['เริ่มทางซ้ายก่อน', 'แล้วทำต่อทางขวา'], fin: 'คูณ หาร ไม่มีวงเล็บ: ทำ<b>จากซ้ายไปขวา</b>', say: 'คูณหารที่ไม่มีวงเล็บ ทำจากซ้ายไปขวา' })),
      o4dTry(474, () => p4calcQ(pick(P4_MD.slice(0, 3))), 'คิดทีละขั้น'),
      o4dTry(474, () => p4tfOrder(pick(O4D_TF_MD)), 'ถูกหรือผิด')]; })(),

  /* ด่าน 5 ระคน 3 จำนวน ไม่มีวงเล็บ: คูณ หาร ก่อน บวก ลบ */
  475: (() => { const loose = [0, 1, 2, 3, 4].map(i => o4dApple(34 + (i % 3) * 22, 94 + Math.floor(i / 3) * 24)).join(''), bask = [0, 1, 2].map(i => o4dBasket(142 + i * 70, 96)).join('');
    return [
      o4dSee('คูณ หาร ก่อน บวก ลบ', '<b>แตะรูป</b> — แอปเปิล 5 ผล กับ 3 ตะกร้า ตะกร้าละ 4 ผล', [
        { t: '5 + 3 × 4', f: on => r4dTx(180, 40, '5 + 3 × 4', O4DC.ink, 'r4v-big') + loose + bask + r4dTx(55, 150, '5 ผล', O4DC.ink, 'r4d-sm') + r4dTx(244, 150, '3 ตะกร้า ตะกร้าละ 4', O4DC.ink, 'r4d-sm')
          + (on ? r4vH(`<rect x="134" y="76" width="216" height="52" rx="12" fill="none" stroke="${O4DC.p}" stroke-width="2.6"/>` + r4dTx(244, 176, '3 × 4 = 12', O4DC.p) + r4dTx(180, 214, '5 + 12 = 17 ผล', O4DC.g, 'r4v-big')) : ''), s: '3 ตะกร้า × 4 ผล คิด<b>ก่อน</b> = 12<br>5 + 12 = <b>17</b> ผล' },
        { t: 'บวกก่อน ✗', f: on => r4dTx(180, 40, '5 + 3 × 4', O4DC.ink, 'r4v-big') + (on ? r4vH(r4dTx(180, 84, '5 + 3 = 8 ก่อน แล้ว 8 × 4 = 32', O4DC.bad) + Array.from({ length: 8 }, (_, i) => o4dBasket(14 + (i % 4) * 86, 116 + Math.floor(i / 4) * 44, 4, 6)).join('') + o4dCross(180, 160, 34)) + r4dTx(180, 226, 'กลายเป็น 8 ตะกร้า ไม่ตรงกับภาพ', O4DC.bad) : r4dTx(180, 140, '?', O4DC.fade, 'r4v-big')), s: 'บวกก่อนได้ 32<br><b>ผิด</b> — คูณ หาร ต้องทำก่อน' }]),
      r4dShow('1,000 − 480 ÷ 6', o4dCas('1000 − 480 ÷ 6', { q: 'หาผลลัพธ์ 1,000 − 480 ÷ 6', notes: ['หารก่อน (ถึงจะอยู่ทางขวา)', 'แล้วจึงลบ'], fin: 'ไม่มีวงเล็บ: <b>คูณ หาร ก่อน</b> แล้วจึงบวก ลบ', say: 'ไม่มีวงเล็บ คูณหารก่อน แล้วจึงบวกลบ' })),
      o4dTry(475, () => p4firstQ(pick(P4_MIX3)), 'ทำส่วนใดก่อน'),
      o4dTry(475, () => p4calcQ(pick(P4_MIX3.slice(1, 5))), 'คิดทีละขั้น')]; })(),

  /* ด่าน 6 ระคน มากกว่า 3 จำนวน ไม่มีวงเล็บ */
  476: (() => { const E = o4dExpr('48 ÷ 6 + 9 × 7 − 15', 64), c1 = (E.xs[0][0] + E.xs[2][1]) / 2, c2 = (E.xs[4][0] + E.xs[6][1]) / 2;
    return [
      o4dSee('หลายเครื่องหมาย', '<b>แตะรูป</b> — วงคู่ที่ต้องคูณ หาร ก่อน', [
        { t: '48 ÷ 6 + 9 × 7 − 15', W: 360, H: 220, f: on => E.s + (on ? r4vH(o4dEllT(E, 0, 2, 64, E.fs) + o4dEllT(E, 4, 6, 64, E.fs, O4DC.b) + o4dArrowD(c1, 82, 108) + o4dArrowD(c2, 82, 108, O4DC.b) + r4dTx(c1, 132, '8', O4DC.p, 'r4v-big') + r4dTx(c2, 132, '63', O4DC.b, 'r4v-big')
          + r4dTx(180, 174, '8 + 63 − 15', O4DC.ink, 'r4v-big') + r4dArr([110, 188], [250, 188], O4DC.g) + r4dTx(180, 212, 'ซ้าย → ขวา = 56', O4DC.g)) : r4dTx(180, 140, '?', O4DC.fade, 'r4v-big')),
          s: '① คูณ หาร (ซ้าย → ขวา)<br>② บวก ลบ (ซ้าย → ขวา) = <b>56</b>' }]),
      r4dShow('2,500 + 1,200 ÷ 4 × 3 − 800', o4dCas('2500 + 1200 ÷ 4 × 3 − 800', { q: 'หาผลลัพธ์ 2,500 + 1,200 ÷ 4 × 3 − 800', notes: ['คูณ หาร ก่อน: ÷ อยู่ซ้าย', 'แล้ว × ต่อ', 'บวก ลบ: ซ้ายไปขวา', 'ลบเป็นตัวสุดท้าย'], fin: '<b>คูณ หาร</b> ซ้ายไปขวาก่อน แล้ว<b>บวก ลบ</b> ซ้ายไปขวา', say: 'คูณหารจากซ้ายไปขวาก่อน แล้วบวกลบจากซ้ายไปขวา' })),
      o4dTry(476, () => p4firstQ(pick(O4D_NB_EASY)), 'ทำส่วนใดก่อน'),
      o4dTry(476, () => p4calcQ(pick(O4D_NB_EASY)), 'คิดทีละขั้น')]; })(),

  /* ด่าน 7 มีและไม่มีวงเล็บ → หาจำนวนใน □ */
  477: (() => { const st = (i, lab, ex, col) => `<rect x="${20 + i * 70}" y="${172 - i * 48}" width="${320 - i * 70}" height="46" rx="8" fill="${col}" stroke="${O4DC.ink}" stroke-width="1.6"/>` + r4dTx(34 + i * 70, 201 - i * 48, lab, O4DC.ink, 'r4d-tx', 'start') + r4dTx(330, 201 - i * 48, ex, O4DC.ink, 'r4d-sm', 'end');
    const B = o4dExpr('5 + ( 2 × □ ) = 11', 70), cv = [B.xs[2][0] - 4, B.xs[6][1] + 4], Q2 = o4dExpr('40 − 3 × □ = 28', 52, { fs: 24 });
    return [
      o4dSee('ลำดับการคำนวณ', '<b>แตะรูป</b> — ขึ้นบันไดทีละขั้น', [
        { t: 'บันไดลำดับ', f: on => on ? r4vH(st(0, '① ในวงเล็บ ( )', '(18 + 2)', '#FFE7A8') + st(1, '② × ÷', 'ซ้าย → ขวา', '#BFE3F7') + st(2, '③ + −', 'ซ้าย → ขวา', '#C9F0D9')) : st(0, '①  ?', '', '#fff') + st(1, '②  ?', '', '#fff') + st(2, '③  ?', '', '#fff'),
          s: '① ในวงเล็บ ② คูณ หาร<br>③ บวก ลบ (ซ้าย → ขวา)' }]),
      r4dShow('120 − (18 + 2) × 4', o4dCas('120 − (18 + 2) × 4', { q: 'หาผลลัพธ์ 120 − (18 + 2) × 4', notes: ['① ในวงเล็บก่อน', '② คูณ ก่อนลบ', '③ ลบเป็นตัวสุดท้าย'], fin: '① วงเล็บ → ② คูณ หาร → ③ บวก ลบ', say: 'วงเล็บก่อน แล้วคูณหาร แล้วบวกลบ' })),
      o4dTry(477, () => p4calcQ(pick(P4W4_MATCH.slice(0, 6))), 'คิดทีละขั้น'),
      o4dSee('หาจำนวนใน □', '<b>แตะรูป</b> — ปิดส่วนที่มี □ ไว้ก่อน', [
        { t: '5 + (2 × □) = 11', W: 360, H: 200, f: on => B.s + (on ? r4vH(`<rect x="${a4n(cv[0])}" y="${70 - B.fs * .95}" width="${a4n(cv[1] - cv[0])}" height="${a4n(B.fs * 1.3)}" rx="8" fill="#FFD27A" stroke="${O4DC.o}" stroke-width="2"/>` + r4dTx((cv[0] + cv[1]) / 2, 71, '6', O4DC.p, 'r4v-big')
          + r4dTx(180, 124, '5 + 6 = 11 → ส่วนที่ปิด = 6', O4DC.ink) + r4dTx(180, 164, '2 × □ = 6 → □ = 3', O4DC.g, 'r4v-big')) : ''), s: 'ปิด (2 × □) ไว้ 5 + ? = 11<br>? = 6 แล้ว 2 × □ = 6 → □ = <b>3</b>' }]),
      r4dShow('40 − 3 × □ = 28', { fig: Q2.s, q: 'เติมจำนวนใน □ ให้ถูกต้อง 40 − 3 × □ = 28',
        steps: [{ ink: `<rect x="${a4n(Q2.xs[2][0] - 4)}" y="${a4n(52 - Q2.fs * .95)}" width="${a4n(Q2.xs[4][1] - Q2.xs[2][0] + 8)}" height="${a4n(Q2.fs * 1.3)}" rx="8" fill="#FFD27A" fill-opacity=".9" stroke="${O4DC.o}" stroke-width="2"/>` + r4dTx((Q2.xs[2][0] + Q2.xs[4][1]) / 2, 60, '?', O4DC.p, 'r4d-big'), w: '40 − ? = 28', n: 'ปิด 3 × □ ไว้ (คูณก่อนลบ)' },
          { w: '? = 40 − 28 = 12', n: '40 ลบอะไรเหลือ 28' },
          { ink: o4dExpr('3 × □ = 12', 120, { fs: 24 }).s, w: '3 × □ = 12', n: 'ส่วนที่ปิดไว้ = 12' },
          { w: '□ = 12 ÷ 3 = 4', n: '3 คูณอะไรได้ 12' },
          { ink: o4dExpr('40 − 3 × 4 = 28', 188, { fs: 24, pk: [4] }).s + r4dTx(318, 190, '✓', O4DC.g, 'r4d-big'), w: 'ตอบ □ = 4', n: 'แทนค่ากลับ ตรวจว่าถูก', ans: 1 }],
        dense: true, fin: 'ปิดส่วนที่มี □ → หาส่วนนั้นก่อน → หา □ → <b>แทนค่าตรวจ</b>', say: 'ปิดส่วนที่มีช่องว่าง หาส่วนนั้นก่อน แล้วหาจำนวนในช่อง แล้วแทนค่าตรวจ' }),
      o4dTry(477, () => p4boxQ(pick(O4D_BOX_EASY)), 'เติมจำนวนใน □')]; })(),

  /* ด่าน 8 โจทย์ 2 ขั้น (1) */
  478: (() => { const bags = Array.from({ length: 6 }, (_, i) => o4dBag(26 + i * 52, 34, '20')).join(''), burst = (x, y) => `<path data-pop="1" d="M${x} ${y - 20} L${x + 6} ${y - 7} L${x + 20} ${y - 9} L${x + 9} ${y + 1} L${x + 15} ${y + 15} L${x} ${y + 6} L${x - 15} ${y + 15} L${x - 9} ${y + 1} L${x - 20} ${y - 9} L${x - 6} ${y - 7} Z" fill="#FFD27A" stroke="${O4DC.bad}" stroke-width="2"/>`;
    return [
      o4dSee('โจทย์ 2 ขั้น', '<b>แตะรูป</b> — มีลูกโป่ง 6 ถุง ถุงละ 20 ลูก แตกไป 18 ลูก', [
        { t: 'ขั้นที่ 1 หลายกลุ่มเท่ากัน', f: on => bags + (on ? r4vH(`<rect x="18" y="26" width="324" height="64" rx="12" fill="none" stroke="${O4DC.p}" stroke-width="2.6"/>` + r4dTx(180, 130, '6 × 20 = 120 ลูก', O4DC.p, 'r4v-big') + r4dTx(180, 170, 'หลายกลุ่มเท่ากัน → คูณ', O4DC.ink)) : r4dTx(180, 140, 'ทั้งหมดกี่ลูก?', O4DC.fade, 'r4v-big')), s: 'ขั้นที่ 1 หาทั้งหมด<br>6 × 20 = <b>120</b> ลูก' },
        { t: 'ขั้นที่ 2 เหลือ', f: on => `<rect x="30" y="80" width="300" height="44" rx="6" fill="${O4DC.sky}" stroke="${O4DC.ink}" stroke-width="2"/>` + r4dTx(180, 70, '120 ลูก', O4DC.ink) + (on ? r4vH(`<rect x="${330 - 18 * 2.5}" y="80" width="${18 * 2.5}" height="44" fill="#F9B8CC" stroke="${O4DC.ink}" stroke-width="2"/>` + o4dCross(330 - 22, 102, 10) + r4dTx(330 - 22, 146, 'แตก 18', O4DC.bad) + r4dTx(140, 108, 'เหลือ 102', O4DC.g)
          + r4dTx(180, 196, '120 − 18 = 102 ลูก', O4DC.g, 'r4v-big')) : r4dTx(180, 108, '?', O4DC.p, 'r4v-big')), s: 'ขั้นที่ 2 แตกไป → ลบ<br>120 − 18 = <b>102</b> ลูก' }]),
      r4dShow('ลูกโป่ง', { fig: bags + r4dTx(180, 120, 'แตกไป 18 ลูก', O4DC.bad, 'r4d-tx'), q: 'มีลูกโป่ง 6 ถุง ถุงละ 20 ลูก แตกไป 18 ลูก เหลือลูกโป่งกี่ลูก',
        steps: [{ ink: `<rect x="18" y="26" width="324" height="64" rx="12" fill="none" stroke="${O4DC.p}" stroke-width="2.6"/>` + r4dTx(180, 160, '6 × 20', O4DC.p, 'r4d-big'), w: '(6 × 20)', n: 'หลายถุงเท่ากัน → คูณ (ขั้นแรกใส่วงเล็บ)' },
          { ink: burst(300, 150) + r4dTx(300, 200, '− 18', O4DC.bad, 'r4d-big'), w: '− 18 = □', wa: 1, n: 'แตกไป → ลบ' },
          { ink: r4dTx(180, 204, '= 120', O4DC.p, 'r4d-big'), w: '6 × 20 = 120', n: 'ในวงเล็บก่อน' }, { w: '120 − 18 = 102', n: 'แล้วจึงลบ' }, { w: 'ตอบ 102 ลูก', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'เขียน<b>ประโยคสัญลักษณ์</b> แล้วคิดทีละขั้น', say: 'เขียนประโยคสัญลักษณ์ แล้วคิดทีละขั้น' }),
      o4dTry(478, () => Q.p4Story2(pick(P4S_2A.slice(0, 6))), 'โจทย์ 2 ขั้น')]; })(),

  /* ด่าน 9 โจทย์ 2 ขั้น (2) จำนวนมาก */
  479: (() => { const days = Array.from({ length: 5 }, (_, i) => `<rect x="${22 + i * 64}" y="48" width="56" height="40" rx="6" fill="#EAF4FC" stroke="${O4DC.ink}" stroke-width="1.6"/>` + r4dTx(50 + i * 64, 74, '3,600', O4DC.ink, 'r4d-sm') + r4dTx(50 + i * 64, 40, `วันที่ ${i + 1}`, '#7A70A0', 'r4d-sm')).join('');
    const crate = `<rect x="100" y="52" width="160" height="92" rx="8" fill="#E9B872" stroke="${O4DC.ink}" stroke-width="2"/>` + Array.from({ length: 24 }, (_, i) => `<circle cx="${116 + (i % 8) * 18.5}" cy="${68 + Math.floor(i / 8) * 28}" r="7" fill="#9FD0F0" stroke="${O4DC.ink}" stroke-width="1.2"/>`).join('');
    const shelf = `<rect x="22" y="40" width="120" height="96" rx="6" fill="#F4EEDC" stroke="${O4DC.ink}" stroke-width="2"/>` + [0, 1, 2].map(r => `<path d="M22 ${72 + r * 32} H142" stroke="${O4DC.ink}" stroke-width="1.6"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${28 + i * 12}" y="${48 + r * 32}" width="9" height="22" fill="${['#3C8DDB', '#E5487A', '#1B8862'][(i + r) % 3]}"/>`).join('')).join('') + r4dTx(82, 160, '1,250 เล่ม', O4DC.ink, 'r4d-tx');
    const boxes = Array.from({ length: 30 }, (_, i) => o4dBox3(178 + (i % 6) * 29, 40 + Math.floor(i / 6) * 20, '', .85)).join('') + r4dTx(264, 160, '30 กล่อง กล่องละ 25', O4DC.ink, 'r4d-sm');
    return [
      o4dSee('โจทย์ 2 ขั้น จำนวนมาก', '<b>แตะรูป</b> — ผลิตขวดวันละ 3,600 ขวด 5 วัน บรรจุลังละ 24 ขวด', [
        { t: 'ขั้นที่ 1 รวม 5 วัน', f: on => days + (on ? r4vH(`<path d="M22 100 V110 H342 V100" fill="none" stroke="${O4DC.p}" stroke-width="2.4"/>` + r4dTx(180, 140, '3,600 × 5 = 18,000 ขวด', O4DC.p, 'r4v-big') + r4dTx(180, 178, 'วันละเท่ากัน หลายวัน → คูณ', O4DC.ink)) : r4dTx(180, 150, 'ทั้งหมดกี่ขวด?', O4DC.fade, 'r4v-big')), s: 'ขั้นที่ 1<br>3,600 × 5 = <b>18,000</b> ขวด' },
        { t: 'ขั้นที่ 2 แบ่งใส่ลัง', f: on => crate + r4dTx(180, 40, '1 ลัง = 24 ขวด', O4DC.ink) + (on ? r4vH(r4dTx(180, 180, '18,000 ÷ 24 = 750 ลัง', O4DC.g, 'r4v-big') + r4dTx(180, 214, 'แบ่งเท่า ๆ กัน → หาร', O4DC.ink)) : r4dTx(180, 186, 'ได้กี่ลัง?', O4DC.fade, 'r4v-big')), s: 'ขั้นที่ 2 แบ่งเท่า ๆ กัน → หาร<br>18,000 ÷ 24 = <b>750</b> ลัง' }]),
      r4dShow('ห้องสมุด', { fig: shelf + boxes, q: 'ห้องสมุดมีหนังสือ 1,250 เล่ม ได้รับบริจาค 30 กล่อง กล่องละ 25 เล่ม มีหนังสือกี่เล่ม',
        steps: [{ ink: `<rect x="16" y="34" width="132" height="108" rx="10" fill="none" stroke="${O4DC.b}" stroke-width="2.6"/>`, w: '1,250', n: 'มีอยู่เดิม' },
          { ink: `<rect x="172" y="34" width="180" height="108" rx="10" fill="none" stroke="${O4DC.p}" stroke-width="2.6"/>` + r4dTx(160, 96, '+', O4DC.p, 'r4d-big'), w: '+ (30 × 25) = □', wa: 1, n: 'ได้เพิ่ม → บวก' },
          { ink: r4dTx(264, 196, '30 × 25 = 750', O4DC.p, 'r4d-tx'), w: '30 × 25 = 750', n: 'ในวงเล็บก่อน' }, { ink: r4dTx(180, 228, 'รวม 2,000 เล่ม', O4DC.g, 'r4d-tx'), w: '1,250 + 750 = 2,000', n: 'แล้วจึงบวก' }, { w: 'ตอบ 2,000 เล่ม', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'มีเดิม + ได้เพิ่ม (หลายกล่อง → <b>คูณก่อน</b>)', say: 'มีเดิมบวกที่ได้เพิ่ม หลายกล่องคูณก่อน' }),
      o4dTry(479, () => Q.p4Story2(pick(P4S_2B.slice(0, 6))), 'โจทย์ 2 ขั้น จำนวนมาก')]; })(),

  /* ด่าน 10 แสดงวิธีทำ */
  480: (() => { const trays = Array.from({ length: 12 }, (_, i) => o4dTray(22 + (i % 4) * 48, 34 + Math.floor(i / 4) * 34, '30')).join(''), pan = `<ellipse cx="288" cy="96" rx="48" ry="16" fill="#C9C2DE" stroke="${O4DC.ink}" stroke-width="2"/><path d="M336 96 H356" stroke="${O4DC.ink}" stroke-width="5" stroke-linecap="round"/>` + r4dTx(288, 70, 'ใช้ไป 85 ฟอง', O4DC.bad, 'r4d-sm');
    const ln = (i, t, col) => r4dTx(54, 58 + i * 46, t, col, 'r4v-tx', 'start');
    return [
      o4dSee('การแสดงวิธีทำ', '<b>แตะรูป</b> — เขียนเป็นลำดับ 4 ส่วน', [
        { t: 'แสดงวิธีทำ', f: on => `<rect x="30" y="16" width="300" height="208" rx="12" fill="#FFFDF6" stroke="#EDE6D2" stroke-width="2"/>` + (on ? r4vH(ln(0, '① ประโยคสัญลักษณ์ … = □', O4DC.b) + ln(1, '② วิธีทำ ขั้นที่ 1', O4DC.o) + ln(2, '③ ขั้นที่ 2', O4DC.o) + ln(3, '④ ตอบ … หน่วย', O4DC.g)) : r4dTx(180, 126, '?', O4DC.p, 'r4v-big')), s: 'ประโยคสัญลักษณ์ → วิธีทำทีละขั้น<br>→ <b>ตอบพร้อมหน่วย</b>' }]),
      r4dShow('ไข่ไก่', { fig: trays + pan, q: 'มีไข่ 12 แผง แผงละ 30 ฟอง ทำขนมไป 85 ฟอง เหลือไข่กี่ฟอง',
        steps: [{ w: 'ประโยคสัญลักษณ์ (12 × 30) − 85 = □', n: '① เขียนประโยคก่อน' },
          { ink: `<rect x="16" y="28" width="196" height="110" rx="10" fill="none" stroke="${O4DC.p}" stroke-width="2.6"/>` + r4dTx(114, 166, '360 ฟอง', O4DC.p, 'r4d-tx'), w: 'วิธีทำ ไข่ทั้งหมด 12 × 30 = 360 ฟอง', n: '② ขั้นที่ 1' },
          { ink: o4dCross(288, 96, 12) + r4dTx(180, 214, '360 − 85 = 275', O4DC.g, 'r4d-big'), w: 'เหลือไข่ 360 − 85 = 275 ฟอง', n: '③ ขั้นที่ 2' },
          { w: 'ตอบ <span class="thn">๒๗๕</span> ฟอง', n: '④ ตอบพร้อมหน่วย', ans: 1 }],
        dense: true, fin: 'เขียนให้ครบ: ประโยคสัญลักษณ์ → วิธีทำ → <b>ตอบพร้อมหน่วย</b>', say: 'เขียนประโยคสัญลักษณ์ วิธีทำ แล้วตอบพร้อมหน่วย' }),
      o4dTry(480, () => { const o = pick(P4_SOL2); return Q.p4Seq({ text: o.text, cards: P4_SOLVE(o) }); }, 'เรียงวิธีทำ'),
      o4dTry(480, () => p4ansQ(pick(P4_SOL2)), 'เขียนคำตอบ')]; })(),

  /* ด่าน 11 สร้างโจทย์จากประโยคสัญลักษณ์ */
  481: (() => { const E = o4dExpr('(6 × 25) − 30', 46), m1 = (E.xs[0][0] + E.xs[4][1]) / 2, m2 = (E.xs[5][0] + E.xs[6][1]) / 2, trays = Array.from({ length: 6 }, (_, i) => o4dTray(24 + (i % 3) * 46, 102 + Math.floor(i / 3) * 32, '25')).join('');
    const F = o4dExpr('50 − (3 × 12) + 20', 40, { fs: 22 }), a1 = (F.xs[0][0] + F.xs[0][1]) / 2, a2 = (F.xs[2][0] + F.xs[6][1]) / 2, a3 = (F.xs[7][0] + F.xs[8][1]) / 2;
    const snack = x => `<rect x="${x}" y="122" width="24" height="30" rx="5" fill="#F49AB5" stroke="${O4DC.ink}" stroke-width="1.4"/><path d="M${x} 130 H${x + 24}" stroke="#fff" stroke-width="2"/>`;
    return [
      o4dSee('ประโยค → เรื่อง', '<b>แตะรูป</b> — แต่ละส่วนของประโยคเป็นเรื่องอะไร', [
        { t: '(6 × 25) − 30 = □', f: on => E.s + (on ? r4vH(o4dUnder(E, 0, 4, 46) + o4dUnder(E, 5, 6, 46, O4DC.o) + r4dArr([m1, 66], [100, 94]) + r4dArr([m2, 66], [276, 96], O4DC.o) + trays
          + `<ellipse cx="276" cy="130" rx="44" ry="15" fill="#C9C2DE" stroke="${O4DC.ink}" stroke-width="2"/>` + r4dTx(92, 190, 'ซื้อไข่ 6 แผง แผงละ 25 ฟอง', O4DC.p, 'r4d-sm') + r4dTx(276, 172, 'ทำขนม 30 ฟอง', O4DC.o, 'r4d-sm') + r4dTx(180, 222, 'เหลือไข่กี่ฟอง (□)', O4DC.g)) : r4dTx(180, 140, '?', O4DC.fade, 'r4v-big')),
          s: '(6 × 25) = ไข่ 6 แผง แผงละ 25<br>− 30 = ใช้ไป, □ = <b>คำถาม</b>' }]),
      r4dShow('สร้างโจทย์จาก 50 − (3 × 12) + 20', { fig: F.s + o4dPurse(20, 108, '50 บาท') + [0, 1, 2].map(i => snack(140 + i * 30)).join('') + r4dTx(182, 170, 'ชิ้นละ 12', O4DC.ink, 'r4d-sm') + `<circle cx="300" cy="134" r="20" fill="#FFD27A" stroke="${O4DC.ink}" stroke-width="2"/>` + r4dTx(300, 140, '+20', O4DC.ink, 'r4d-sm'), q: 'สร้างโจทย์ปัญหาจาก 50 − (3 × 12) + 20 = □',
        steps: [{ ink: o4dUnder(F, 0, 0, 40, O4DC.b) + r4dArr([a1, 62], [56, 100], O4DC.b), w: 'มีเงิน 50 บาท', n: '50 = สิ่งที่มีอยู่' },
          { ink: o4dUnder(F, 2, 6, 40) + r4dArr([a2, 62], [182, 114]), w: 'ซื้อขนม 3 ชิ้น ชิ้นละ 12 บาท', n: '(3 × 12) = ขั้นแรก' },
          { ink: o4dUnder(F, 7, 8, 40, O4DC.o) + r4dArr([a3, 62], [298, 110], O4DC.o), w: 'แม่ให้เงินเพิ่ม 20 บาท', n: '+ 20 = ได้เพิ่ม' },
          { ink: r4dTx(180, 214, '= □ ?', O4DC.g, 'r4d-big'), w: 'ตอนนี้มีเงินกี่บาท', n: '□ = คำถาม' },
          { w: 'ตรวจ 50 − 36 + 20 = 34 บาท', n: 'ใช้ทุกจำนวนครบ', ans: 1 }],
        dense: true, fin: 'สิ่งที่มี → <b>ขั้นแรก (ในวงเล็บ)</b> → ขั้นต่อไป → คำถาม', say: 'สิ่งที่มี ขั้นแรกในวงเล็บ ขั้นต่อไป แล้วจบด้วยคำถาม' }),
      o4dTry(481, () => p4s2sQ(pick(P4_S2S2)), 'เลือกโจทย์ที่ตรง'),
      o4dTry(481, () => p4mkStoryQ(pick(P4_S2S2)), 'เรียงเป็นโจทย์')]; })(),

  /* ด่าน 12 สร้างโจทย์จากภาพ */
  482: (() => { const tag = (x, y, art, lab) => `<rect x="${x}" y="${y}" width="120" height="76" rx="12" fill="#fff" stroke="#E1DAF2" stroke-width="2"/>${art}` + r4dTx(x + 78, y + 44, lab, O4DC.ink, 'r4d-sm');
    const fig = tag(24, 28, o4dBook(40, 50), 'เล่มละ 35') + tag(216, 28, o4dMilk(236, 48), 'กล่องละ 15') + o4dPurse(130, 160, 'มี 200 บาท');
    return [
      o4dSee('ภาพ → โจทย์', '<b>แตะรูป</b> — ดูป้ายราคา แล้วแต่งเรื่อง', [
        { t: 'ร้านค้า', f: on => fig + (on ? r4vH(r4dTx(180, 128, 'ซื้อสมุด 3 เล่ม นม 2 กล่อง', O4DC.p) + r4dTx(180, 232, 'จ่าย 200 บาท ได้เงินทอนกี่บาท', O4DC.g)) : ''), s: 'ใช้ราคา<b>จากภาพ</b><br>แต่งเรื่อง แล้วจบด้วยคำถาม' }]),
      r4dPlay('ร้านค้า', 'แตะหรือลากเลือกจำนวนของที่ซื้อ', () => o4dShopPlay()),
      r4dShow('เงินทอน', { fig, q: 'มีเงิน 200 บาท ซื้อสมุด 3 เล่ม และนม 2 กล่อง ได้เงินทอนกี่บาท',
        steps: [{ ink: o4dBook(96, 116) + o4dBook(122, 116) + o4dBook(148, 116) + r4dTx(36, 140, '3 × 35', O4DC.p, 'r4d-tx', 'start'), w: '3 × 35 = 105', n: 'ราคาสมุด 3 เล่ม' },
          { ink: o4dMilk(214, 114) + o4dMilk(238, 114) + r4dTx(330, 140, '2 × 15', O4DC.b, 'r4d-tx', 'end'), w: '2 × 15 = 30', n: 'ราคานม 2 กล่อง' },
          { w: '105 + 30 = 135', n: 'ราคารวม' }, { ink: r4dArr([238, 182], [266, 182], O4DC.g) + r4dTx(304, 188, '− 135', O4DC.g, 'r4d-tx'), w: '200 − 135 = 65', n: 'เงินทอน = เงินที่จ่าย − ราคารวม' }, { w: 'ตอบ 65 บาท', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: `ประโยครวม ${exprHTML('200 − ((3 × 35) + (2 × 15))')} = □`, say: 'หาราคารวมก่อน แล้วนำเงินที่จ่ายลบราคารวม' }),
      o4dTry(482, () => p4shopStoryQ(), 'โจทย์จากภาพ'),
      o4dTry(482, () => p4shopQ('num'), 'หาเงินทอน')]; })(),

  /* ด่าน 13 ค่าเฉลี่ย */
  483: (() => { const V = [12, 7, 9, 14, 8], g = 9, base = 200, bx = i => 44 + i * 62, bar = (v, i, col) => `<rect x="${bx(i)}" y="${base - v * g}" width="44" height="${v * g}" rx="4" fill="${col}" stroke="${O4DC.ink}" stroke-width="1.6"/>`;
    const D = [120, 135, 150, 115], C = j => 105 + j * 70, B0 = 222, k = .8;
    const tab = `<text x="180" y="22" class="g5d-h" text-anchor="middle">ยอดขายน้ำ (ขวด)</text><rect x="10" y="30" width="340" height="28" fill="#EFE9FA"/>` + ['วัน', 'จ.', 'อ.', 'พ.', 'พฤ.'].map((t, j) => `<text x="${j ? C(j - 1) : 40}" y="49" class="g5d-h" text-anchor="middle">${t}</text>`).join('') + `<rect x="10" y="30" width="340" height="56" fill="none" stroke="#B9AFD6" stroke-width="1.4"/><path d="M10 58 H350" stroke="#B9AFD6"/><path d="M70 30 V86" stroke="#B9AFD6"/>` + `<text x="40" y="77" class="g5d-s" text-anchor="middle">ขวด</text>` + D.map((v, j) => `<text x="${C(j)}" y="77" class="g5d-s" text-anchor="middle">${v}</text>`).join('');
    const bars = D.map((v, j) => `<rect x="${C(j) - 18}" y="${B0 - v * k}" width="36" height="${v * k}" rx="3" fill="${O4DC.sky}" stroke="${O4DC.ink}" stroke-width="1.4"/>`).join('') + `<path d="M70 ${B0} H350" stroke="${O4DC.ink}" stroke-width="1.6"/>`;
    return [
      o4dSee('ค่าเฉลี่ย = เกลี่ยให้เท่ากัน', '<b>แตะรูป</b> — ปลาที่จับได้ 5 วัน', [
        { t: 'ปลา 5 วัน', f: on => (on ? r4vH(V.map((v, i) => bar(10, i, '#FFC24C')).join('') + `<path d="M30 ${base - 10 * g} H340" stroke="${O4DC.p}" stroke-width="2.4" stroke-dasharray="7 5"/>` + r4dTx(180, 50, 'ทุกวันเท่ากัน = 10 ตัว', O4DC.p) + r4dTx(180, 76, '(12 + 7 + 9 + 14 + 8) ÷ 5 = 10', O4DC.ink, 'r4d-sm')) : V.map((v, i) => bar(v, i, O4DC.sky)).join('') + `<path d="M30 ${base - 10 * g} H340" stroke="${O4DC.fade}" stroke-width="2" stroke-dasharray="7 5"/>`)
          + V.map((v, i) => r4dTx(bx(i) + 22, 222, ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.'][i] + ' ' + v, O4DC.ink, 'r4d-sm')).join(''), s: 'ส่วนที่สูงเกินเติมส่วนที่ต่ำ<br>เท่ากันที่ <b>10</b> ตัว = ค่าเฉลี่ย' }]),
      r4dPlay('เส้นค่าเฉลี่ย', 'ลากเส้นหาระดับที่ส่วนเกินเท่ากับส่วนขาด', () => o4dLevelPlay()),
      r4dShow('ค่าเฉลี่ยจากตาราง', { fig: tab + bars, q: 'ยอดขายน้ำ 4 วัน ขายได้เฉลี่ยวันละกี่ขวด',
        steps: [{ ink: `<rect x="74" y="62" width="274" height="20" rx="8" fill="none" stroke="${O4DC.p}" stroke-width="2.4"/>`, w: '120 + 135 + 150 + 115 = 520', n: '① รวมทุกวัน' },
          { ink: D.map((v, j) => `<circle cx="${C(j)}" cy="208" r="10" fill="#fff" stroke="${O4DC.o}" stroke-width="2"/>` + r4dTx(C(j), 213, String(j + 1), O4DC.o, 'r4d-sm')).join(''), w: 'มีข้อมูล 4 วัน', n: '② นับจำนวนข้อมูล' },
          { ink: `<path d="M70 ${B0 - 130 * k} H350" stroke="${O4DC.p}" stroke-width="2.6" stroke-dasharray="7 5"/>` + r4dTx(36, B0 - 130 * k + 5, '130', O4DC.p, 'r4d-tx'), w: '520 ÷ 4 = 130', n: '③ แบ่งเท่า ๆ กัน' }, { w: 'ตอบ เฉลี่ยวันละ 130 ขวด', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'ค่าเฉลี่ย = <b>ผลรวม ÷ จำนวนข้อมูล</b>', say: 'ค่าเฉลี่ย เท่ากับ ผลรวมหารด้วยจำนวนข้อมูล' }),
      o4dTry(483, () => p4meanTabQ(), 'ค่าเฉลี่ยจากตาราง'),
      o4dTry(483, () => Q.p4Story2(pick(P4S_MEAN.filter(x => p4meanKind(x) === 'mean'))), 'โจทย์ค่าเฉลี่ย')]; })(),

  /* ด่าน 14 โจทย์ค่าเฉลี่ย 3 แบบ */
  484: (() => { const eq5 = (lab, col = '#FFC24C') => Array.from({ length: 5 }, (_, i) => `<rect x="${30 + i * 62}" y="70" width="50" height="70" rx="4" fill="${col}" stroke="${O4DC.ink}" stroke-width="1.6"/>` + r4dTx(55 + i * 62, 110, lab, O4DC.ink, 'r4d-sm') + r4dTx(55 + i * 62, 160, `วันที่ ${i + 1}`, '#7A70A0', 'r4d-sm')).join('');
    const cutBar = `<rect x="20" y="70" width="320" height="50" rx="6" fill="#C9F0D9" stroke="${O4DC.ink}" stroke-width="2"/>` + r4dTx(180, 60, 'รวม 2,400 บาท', O4DC.ink);
    return [
      o4dSee('ค่าเฉลี่ย ผลรวม จำนวน', '<b>แตะรูป</b> — รู้ 2 อย่าง หาอีกอย่างได้', [
        { t: 'หาผลรวม (เฉลี่ยวันละ 4)', f: on => eq5('4') + (on ? r4vH(`<path d="M30 176 V184 H330 V176" fill="none" stroke="${O4DC.p}" stroke-width="2.4"/>` + r4dTx(180, 212, '4 × 5 = 20 (ผลรวม)', O4DC.p, 'r4v-big')) : r4dTx(180, 212, 'รวม ?', O4DC.fade, 'r4v-big')), s: 'ผลรวม = <b>ค่าเฉลี่ย × จำนวน</b>' },
        { t: 'หาจำนวน', f: on => `<rect x="20" y="70" width="320" height="50" rx="6" fill="#C9F0D9" stroke="${O4DC.ink}" stroke-width="2"/>` + r4dTx(180, 60, 'รวม 20', O4DC.ink) + (on ? r4vH(Array.from({ length: 4 }, (_, i) => `<path d="M${20 + (i + 1) * 64} 64 V126" stroke="${O4DC.p}" stroke-width="2.6"/>`).join('') + Array.from({ length: 5 }, (_, i) => r4dTx(52 + i * 64, 101, '4', O4DC.ink)).join('') + r4dTx(180, 170, '20 ÷ 4 = 5 (จำนวน)', O4DC.p, 'r4v-big')) : r4dTx(180, 101, 'ส่วนละ 4 ได้กี่ส่วน?', O4DC.fade)), s: 'จำนวน = <b>ผลรวม ÷ ค่าเฉลี่ย</b>' }]),
      r4dShow('หาผลรวมจากค่าเฉลี่ย', { fig: eq5('1,850'), q: 'ร้านข้าวมันไก่ขาย 5 วัน ได้เงินเฉลี่ยวันละ 1,850 บาท ห้าวันได้เงินรวมกี่บาท',
        steps: [{ ink: `<path d="M30 176 V184 H330 V176" fill="none" stroke="${O4DC.p}" stroke-width="2.4"/>` + r4dTx(180, 206, '5 วัน', O4DC.p, 'r4d-tx'), w: 'เฉลี่ยวันละ 1,850 บาท 5 วัน', n: 'รู้ค่าเฉลี่ยกับจำนวน' },
          { ink: r4dTx(180, 40, 'รวม = 1,850 × 5', O4DC.g, 'r4d-tx'), w: '1,850 × 5 = 9,250', n: 'ผลรวม = ค่าเฉลี่ย × จำนวน' }, { w: 'ตอบ 9,250 บาท', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'หาผลรวม: <b>ค่าเฉลี่ย × จำนวน</b>', say: 'หาผลรวม ใช้ค่าเฉลี่ยคูณจำนวน' }),
      o4dTry(484, () => Q.p4Story2(pick(P4S_MEAN.filter(x => p4meanKind(x) === 'total'))), 'หาผลรวม'),
      r4dShow('หาจำนวนจากค่าเฉลี่ย', { fig: cutBar, q: 'ขายขนมได้เงิน 2,400 บาท ราคาเฉลี่ยชิ้นละ 30 บาท ขายได้กี่ชิ้น',
        steps: [{ ink: [1, 2, 3].map(i => `<path d="M${20 + i * 28} 64 V126" stroke="${O4DC.p}" stroke-width="2.4"/>`).join('') + [0, 1, 2].map(i => r4dTx(34 + i * 28, 101, '30', O4DC.ink, 'r4d-sm')).join('') + r4dTx(220, 101, '…', O4DC.p, 'r4d-big'), w: 'แบ่งทีละ 30 บาท', n: 'ชิ้นละ 30 → แบ่งเป็นส่วน ๆ' },
          { ink: r4dTx(180, 166, '2,400 ÷ 30 = 80 ชิ้น', O4DC.p, 'r4d-big'), w: '2,400 ÷ 30 = 80', n: 'จำนวน = ผลรวม ÷ ค่าเฉลี่ย' }, { ink: r4dTx(180, 206, '80 × 30 = 2,400 ✓', O4DC.g, 'r4d-tx'), w: 'ตรวจ 80 × 30 = 2,400', n: 'คูณกลับได้ผลรวมพอดี' }, { w: 'ตอบ 80 ชิ้น', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'หาจำนวน: <b>ผลรวม ÷ ค่าเฉลี่ย</b>', say: 'หาจำนวน ใช้ผลรวมหารด้วยค่าเฉลี่ย' }),
      o4dTry(484, () => Q.p4Story2(pick(P4S_MEAN.filter(x => p4meanKind(x) === 'count'))), 'หาจำนวน')]; })()
};

/* ---------- games: 10 items, in the order of the teach pages, easy → hard ---------- */
const O4D_TF_PM = [['845 − 360 + 215', 270], ['50000 − 12500 − 8750', 46250], ['900 − 300 + 100', 500], ['7500 − 2500 + 1250', 3750], ['6000 − 1500 − 500', 5000]];
const O4D_TF_MD = [['480 ÷ 6 × 5', 16], ['72 × 5 ÷ 9', 8], ['600 ÷ 20 × 3', 10], ['840 ÷ 4 × 2', 105], ['3600 ÷ 12 ÷ 5', 1500]];
const O4D_PM = [...P4_PM, '7500 − 2500 + 1250', '3000 + 4500 − 6200', '980 − 450 + 270', '45000 + 15500 − 32000'];
const O4D_MD = [...P4_MD, '840 ÷ 7 × 6', '90 × 4 ÷ 6', '4800 ÷ 8 ÷ 2', '15 × 6 ÷ 9', '7200 ÷ 9 × 4'];
const O4D_MIX3 = [...P4_MIX3, '18 + 6 × 5', '100 − 45 ÷ 5', '640 ÷ 8 − 35', '45 + 120 ÷ 6', '800 − 25 × 12'];
const O4D_NB_EASY = ['12 × 2 + 20 ÷ 4 − 7', '30 ÷ 5 + 7 × 4 − 9', '36 ÷ 4 + 5 × 8 − 20', '60 − 8 × 5 + 42 ÷ 6', '200 + 15 × 4 − 90 ÷ 3'];
const O4D_BOX_EASY = ['7 + 3 × 4 = □', '6 + □ × 4 = 14', '16 ÷ 4 + □ = 8', '□ + 8 ÷ 4 = 8', '5 + ( 2 × □ ) = 11', '20 − ( 4 × □ ) = 8'];
const o4dSize = e => (e.match(/\d/g) || []).length * 2 + (e.match(/[+−×÷]/g) || []).length;
const o4dEasy = a => a.slice().sort((x, y) => o4dSize(x) - o4dSize(y));
/* n items from the pool, spread from the easy end to the hard end */
const o4dSpread = (pool, n, skip = []) => { const P = o4dEasy([...new Set(pool)].filter(e => !skip.includes(e))); if (P.length <= n) return P; return Array.from({ length: n }, (_, i) => { const a = Math.floor(i * P.length / n), b = Math.floor((i + 1) * P.length / n); return P[a + Math.floor(Math.random() * (b - a))]; }); };
const o4dD = (q, d, k) => ({ ...q, __diff: d, __kind: 'o4d' + k });
const o4dSeq = (list, k) => list.map((q, i) => o4dD(q, i + 1, k + (i + 1)));
const O4D_GAME = {
  471: () => { const F = o4dSpread(P4W4_BR3, 3), C = o4dSpread(P4W4_BR3, 7, F); return o4dSeq([...F.map(p4firstQ), ...C.map(p4calcQ)], 'b'); },
  472: () => { const S = P4W4_BR1.filter(e => p4nCount(e) > 3), F = o4dSpread(S, 2), C = o4dSpread(S, 4, F); return o4dSeq([...F.map(p4firstQ), ...C.map(p4calcQ), ...o4dSpread(P4W4_BR2, 4).map(p4calcQ)], 'b'); },
  /* ข้อถูก/ผิด 3 ข้อ เกมรวมเป็นข้อจัดกล่อง 1 ข้อ (ixBundle) วางท้ายเกม → คำนวณ 9 ข้อ + จัดกล่อง 1 ข้อ */
  473: () => o4dSeq([...o4dSpread(O4D_PM, 9).map(p4calcQ), ...pkF(O4D_TF_PM, 3).map(p4tfOrder)], 'p'),
  474: () => o4dSeq([...o4dSpread(O4D_MD, 9).map(p4calcQ), ...pkF(O4D_TF_MD, 3).map(p4tfOrder)], 'm'),
  475: () => { const F = o4dSpread(O4D_MIX3, 3); return o4dSeq([...F.map(p4firstQ), ...o4dSpread(O4D_MIX3, 6, [...F, '25 + 6 × 4', '90 − 36 ÷ 4']).map(p4calcQ), ...[P4_ORDER_TF[2], P4_ORDER_TF[3]].map(p4tfOrder)], 'x'); },
  476: () => { const F = o4dSpread(O4D_NB_EASY, 3), A = [...O4D_NB_EASY, ...P4W4_NB4]; return o4dSeq([...F.map(p4firstQ), ...o4dSpread(A, 7, F).map(p4calcQ)], 'n'); },
  477: () => o4dSeq([...o4dSpread(P4W4_MATCH, 3).map(p4calcQ), ...o4dSpread(P4W4_MIX, 2).map(p4calcQ), ...o4dSpread(P4W4_BOX, 5).map(p4boxQ)], 'q')
};
LESSONS_P4C4.forEach(L => { if (O4D_TEACH[L.id]) { L.teach = O4D_TEACH[L.id]; L.__pracDone = 1; L.learned = true; } if (O4D_GAME[L.id]) { L.game = O4D_GAME[L.id]; L.gameN = 10; } });
