/* =========================================================
   ป.4 บทที่ 5 ทะเลทรายนาฬิกา — หน้าสอนและเกมเรียงใหม่ (v256 · ผู้ใช้ขอ) · prefix t4d
   เหมือนบทที่ 6–10: ประเด็นละหน้า ① ดูภาพ (r4vSee) → (บางประเด็น) ลองปรับเอง → ② ทำให้ดู (r4dDo: ดินสอแบ่งแถบเวลาทีละ 60
   กระโดดบนเส้นเวลาทีละชั่วโมง วงแถวในตาราง เขียนบนกระดาษทด คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อแบบเดียวกับในเกม)
   ไม่มี stepper ในหน้าสอน: t4dLadder (ลากขึ้นลงบันไดหน่วย) t4dMonths (ลากระบายเดือน) t4dCmpPlay (ลากแถบเวลา) แทน simT4Ladder simT4Months simT4Cmp
   เกมด่าน 1–6 10 ข้อเรียงตามประเด็น (f4dGame) · วางหลัง p4fd.js ใน order.txt
   ========================================================= */
const T4DC = { ink: '#2B2550', p: '#E5487A', b: '#2F7BC0', g: '#1B8862', o: '#EC7F1E', bar: '#BFE3F7', bar2: '#FFD27A', fade: '#B7AED3' };
const t4dHM = m => { const [h, mm] = t3clock(m); return `${pad2(h)}.${pad2(mm)}`; };
/* a stopwatch picture placed in the figure */
const t4dWatch = (sec, x, y, s = .6, o = {}) => `<g class="t4-watch" transform="translate(${x} ${y}) scale(${s})">${t4WatchSVG(sec, o).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>`;
/* a bar of a length of time cut into blocks of one bigger unit */
function t4dBlocks(total, unit, o = {}) { const x0 = 24, x1 = 336, y = o.y || 96, hh = 44, k = (x1 - x0) / (o.max || total), X = v => x0 + v * k;
  return { s: `<rect x="${x0}" y="${y}" width="${a4n(total * k)}" height="${hh}" rx="6" fill="${T4DC.bar}" stroke="${T4DC.ink}" stroke-width="2"/>` + r4dTx(X(total / 2), y - 14, `${fmt(total)} ${o.u || ''}`, T4DC.ink), X, y, hh, n: Math.floor(total / unit), r: total % unit,
    cuts: () => Array.from({ length: Math.floor(total / unit) }, (_, j) => `<path d="M${a4n(X((j + 1) * unit))} ${y - 4} V${y + hh + 4}" fill="none" stroke="${T4DC.p}" stroke-width="2.6"/>` + r4dTx(X((j + .5) * unit), y + hh / 2 + 7, String(j + 1), T4DC.ink, 'r4d-sm')).join(''),
    rest: (lab, col = T4DC.o) => `<path data-pop="1" d="M${a4n(X(Math.floor(total / unit) * unit))} ${y + hh + 10} V${y + hh + 18} H${a4n(X(total))} V${y + hh + 10}" fill="none" stroke="${col}" stroke-width="2.4"/>` + r4dTx((X(Math.floor(total / unit) * unit) + X(total)) / 2, y + hh + 40, lab, col, 'r4d-tx') }; }
/* a time line from a to b (minutes, may pass midnight) with hops */
function t4dLine(a, b, o = {}) { if (b < a) b += 1440; const x0 = 34, x1 = 326, y = o.y || 150, X = t => x0 + (t - a) / (b - a) * (x1 - x0);
  const s = `<path d="M${x0 - 10} ${y} H${x1 + 10}" stroke="${T4DC.ink}" stroke-width="2.6"/>` + [[a, 'เริ่ม'], [b, 'ถึง']].map(([t, l]) => `<path d="M${a4n(X(t))} ${y - 9} V${y + 9}" stroke="${T4DC.ink}" stroke-width="2.6"/>` + r4dTx(X(t), y + 30, t4dHM(t), T4DC.ink, 'r4d-tx') + r4dTx(X(t), y + 50, l, '#7A70A0', 'r4d-sm')).join('') + (o.mid || []).map(t => `<path d="M${a4n(X(t))} ${y - 6} V${y + 6}" stroke="${T4DC.fade}" stroke-width="2"/>`).join('');
  const hop = (t1, t2, lab, col = T4DC.p, hi = 34) => { const xa = X(t1), xb = X(t2), m = (xa + xb) / 2, hh = Math.min(hi, 10 + (xb - xa) * .4); return `<path d="M${a4n(xa)} ${y - 4} Q${a4n(m)} ${a4n(y - 4 - hh * 2)} ${a4n(xb)} ${y - 4}" fill="none" stroke="${col}" stroke-width="2.6"/>` + `<path d="M${a4n(xb)} ${y - 4} v-1" stroke="${col}"/>` + r4dTx(m, y - 12 - hh, lab, col, 'r4d-sm') + (t2 === b ? '' : `<path d="M${a4n(xb)} ${y - 9} V${y + 9}" stroke="${col}" stroke-width="2"/>` + r4dTx(xb, y + 30, t4dHM(t2 % 1440), col, 'r4d-sm')); };
  return { s, X, y, hop, a, b }; }
/* a schedule table as svg */
function t4dTab(T, rows, o = {}) { const n = T.head.length, ws = n === 4 ? [44, 128, 70, 70] : n === 3 ? [46, 150, 132] : [160, 170], Wt = ws.reduce((a, b) => a + b, 0), rh = o.rh || 28, x0 = (360 - Wt) / 2, y0 = o.y0 != null ? o.y0 : 34, cx = j => x0 + ws.slice(0, j).reduce((a, b) => a + b, 0) + ws[j] / 2;
  let s = `<text x="180" y="${y0 - 12}" class="g5d-h" text-anchor="middle">${T.title}</text><rect x="${x0}" y="${y0}" width="${Wt}" height="${rh}" fill="#EFE9FA"/>`;
  [T.head, ...rows.map(i => T.rows[i].cells)].forEach((cells, r) => { cells.forEach((c, j) => { s += `<text x="${a4n(cx(j))}" y="${y0 + r * rh + rh / 2 + 5}" class="${r ? 'g5d-s' : 'g5d-h'}" text-anchor="middle">${c}</text>`; }); s += `<path d="M${x0} ${y0 + (r + 1) * rh} H${x0 + Wt}" stroke="#B9AFD6" stroke-width="1.2"/>`; });
  s += `<rect x="${x0}" y="${y0}" width="${Wt}" height="${(rows.length + 1) * rh}" fill="none" stroke="#B9AFD6" stroke-width="1.4"/>`;
  return { s, row: r => `<rect x="${x0 - 3}" y="${y0 + (r + 1) * rh - 2}" width="${Wt + 6}" height="${rh + 4}" rx="6" fill="#FFE7A8" fill-opacity=".55" stroke="${T4DC.o}" stroke-width="2.4"/>`, cell: (r, j) => g5dEll(cx(j), y0 + (r + 1) * rh + rh / 2, ws[j] * .46, rh * .5), x0, y0, rh, Wt, cx }; }
const t4dSee = (title, cap, list) => a4dSee(title, cap, list);

/* hands-on (no steppers) */
function t4dLadder() { const L = [['สัปดาห์', 1], ['วัน', 7], ['ชั่วโมง', 168], ['นาที', 10080], ['วินาที', 604800]], bx = i => 40 + i * 102;
  return tgScene({ W: 560, H: 250, st: { i: 0, seen: [0] }, cap: '<b>ลากจุดสีชมพู</b>ไปตามบันไดหน่วย — 1 สัปดาห์ เท่ากับกี่วัน กี่ชั่วโมง …', missions: [['ไปที่ "ชั่วโมง"', s => s.i === 2], ['ไปที่ "นาที"', s => s.i === 3], ['ไปที่ "วินาที"', s => s.i === 4]],
    svg: s => L.map(([u, v], i) => `<rect x="${bx(i)}" y="${150 - i * 22}" width="88" height="44" rx="10" fill="${i === s.i ? '#FFD45C' : '#F4F0FF'}" stroke="#7E6ED6" stroke-width="2"/><text x="${bx(i) + 44}" y="${178 - i * 22}" class="g5d-h" text-anchor="middle">${u}</text>` + (i ? `<text x="${bx(i) - 7}" y="${140 - i * 22}" class="g5d-s" text-anchor="middle" style="fill:${T4DC.p}">× ${L[i][1] / L[i - 1][1]}</text>` : '')).join('') + tgHandle(bx(s.i) + 44, 216, T4DC.p) + `<path d="M${bx(0) + 44} 216 H${bx(4) + 44}" stroke="#E6E0F2" stroke-width="4"/>`,
    drag: (pt, s) => { const i = Math.max(0, Math.min(4, Math.round((pt[0] - 84) / 102))); if (i === s.i) return null; sfx.tap(); return { i, seen: s.seen.includes(i) ? s.seen : [...s.seen, i] }; },
    info: s => `1 สัปดาห์ = <b>${fmt(L[s.i][1])} ${L[s.i][0]}</b>${r4vSep}${s.i ? `${fmt(L[s.i - 1][1])} × ${L[s.i][1] / L[s.i - 1][1]} = ${fmt(L[s.i][1])}` : 'หน่วยใหญ่ → หน่วยเล็ก: คูณ'}` }); }
function t4dMonths(missions) { const bw = 36, bh = 34, x0 = 64, y0 = 50, box = i => [x0 + (i % 12) * bw, y0 + Math.floor(i / 12) * (bh + 22)];
  return tgScene({ W: 560, H: 250, st: { n: 0 }, cap: '<b>ลากนิ้ว</b>ไปบนช่องเดือน — แถวละ 12 เดือน = 1 ปี', missions: missions.map(([t, n]) => [t, s => s.n === n]),
    svg: s => Array.from({ length: 36 }, (_, i) => { const [x, y] = box(i); return `<rect x="${x + 1}" y="${y}" width="${bw - 2}" height="${bh}" rx="5" fill="${i < s.n ? (Math.floor(i / 12) % 2 ? '#9FD0F0' : '#FFC24C') : '#fff'}" stroke="#B9AFD6"/>` + (i % 12 === 0 ? `<text x="${x - 10}" y="${y + 23}" class="g5d-s" text-anchor="end">ปีที่ ${i / 12 + 1}</text>` : ''); }).join(''),
    drag: (pt, s) => { for (let i = 0; i < 36; i++) { const [x, y] = box(i); if (pt[0] >= x && pt[0] <= x + bw && pt[1] >= y && pt[1] <= y + bh) { if (i + 1 === s.n) return null; sfx.tap(); return { n: i + 1 }; } } return null; },
    info: s => `${s.n} เดือน = <b>${Math.floor(s.n / 12)} ปี ${s.n % 12} เดือน</b>${r4vSep}${s.n} ÷ 12 = ${Math.floor(s.n / 12)} เศษ ${s.n % 12}` }); }
function t4dCmpPlay() { const A = 205, x0 = 60, k = 470 / 300, X = v => x0 + v * k;
  return tgScene({ W: 560, H: 250, st: { b: 120, seen: [] }, cap: '<b>ลากปลายแถบสีส้ม</b> — เทียบกับ 3 ชั่วโมง 25 นาที (= 205 นาที)', missions: [['ทำให้นานกว่า', s => s.b > A], ['ทำให้เท่ากันพอดี', s => s.b === A], ['ทำให้น้อยกว่า', s => s.b < A && s.seen.length > 1]],
    svg: s => `<rect x="${x0}" y="60" width="${a4n(A * k)}" height="44" rx="6" fill="${T4DC.bar}" stroke="${T4DC.ink}" stroke-width="2"/><text x="${x0 + 8}" y="88" class="g5d-h">3 ชั่วโมง 25 นาที</text><rect x="${x0}" y="140" width="${a4n(s.b * k)}" height="44" rx="6" fill="${T4DC.bar2}" stroke="${T4DC.ink}" stroke-width="2"/><text x="${x0 + 8}" y="168" class="g5d-h">${s.b} นาที</text><path d="M${a4n(X(A))} 50 V196" stroke="${T4DC.p}" stroke-width="2" stroke-dasharray="5 4"/>` + tgHandle(X(s.b), 162, T4DC.p),
    drag: (pt, s) => { const b = Math.max(60, Math.min(300, Math.round((pt[0] - x0) / k / 5) * 5)); if (b === s.b) return null; sfx.tap(); return { b, seen: s.seen.includes(b > A ? 1 : b === A ? 0 : -1) ? s.seen : [...s.seen, b > A ? 1 : b === A ? 0 : -1] }; },
    info: s => `3 ชั่วโมง 25 นาที = 3 × 60 + 25 = <b>205 นาที</b>${r4vSep}${s.b} นาที ${s.b > A ? '<b>มากกว่า</b>' : s.b === A ? '<b>เท่ากับ</b>' : '<b>น้อยกว่า</b>'} 205 นาที` }); }

/* =========================================================
   the lessons
   ========================================================= */
const T4D_TEACH = {
  /* ด่าน 1 นาที วินาที */
  491: (() => { const W3 = [0, 1, 2].map(i => t4dWatch(60, 6 + i * 88, 34, .44, { lab: '1:00' })).join('') + t4dWatch(45, 270, 34, .44), B = t4dBlocks(410, 60, { u: 'วินาที' });
    return [
      t4dSee('วินาที กับ นาที', '<b>แตะรูป</b> — เข็มวินาทีเดินครบ 1 รอบ', [
        { t: 'เข็มเดิน 15 ขีด', f: on => t4dWatch(on ? 15 : 0, 105, 14, 1.05), s: '1 ขีด = 1 วินาที<br>15 ขีด = 15 วินาที' },
        { t: 'ครบ 1 รอบ', f: on => t4dWatch(on ? 60 : 30, 105, 14, 1.05, on ? { lab: '1:00' } : {}), s: '60 วินาที<br>= <b>1 นาที</b>' }]),
      r4dShow('3 นาที 45 วินาที เป็นวินาที', { fig: W3, q: '3 นาที 45 วินาที คิดเป็นกี่วินาที',
        steps: [{ ink: [0, 1, 2].map(i => r4dTx(50 + i * 88, 150, '60', T4DC.p, 'r4d-tx')).join(''), w: '3 × 60 = 180', n: '1 นาที = 60 วินาที' }, { ink: r4dTx(314, 150, '45', T4DC.o, 'r4d-tx'), w: '180 + 45 = 225', n: 'บวกวินาทีที่เหลือ' },
          { w: '225 วินาที', n: 'นาที → วินาที คูณ 60', ans: 1 }],
        fin: 'นาที → วินาที: <b>× 60</b> แล้วบวกวินาทีที่เหลือ', say: 'นาทีเป็นวินาที คูณหกสิบ แล้วบวกวินาทีที่เหลือ' }),
      r4dShow('410 วินาที เป็นนาที วินาที', { fig: B.s, q: '410 วินาที คิดเป็นกี่นาที กี่วินาที',
        steps: [{ ink: B.cuts(), w: '60 × 6 = 360', n: 'แบ่งทีละ 60 ได้ 6 ครั้ง (60 × 7 = 420 เกิน)' }, { ink: B.rest('50'), w: '410 − 360 = 50', n: 'ที่เหลือ' },
          { w: '6 นาที 50 วินาที', n: 'วินาที → นาที แบ่งทีละ 60', ans: 1 }],
        fin: 'วินาที → นาที: <b>แบ่งทีละ 60</b> ที่เหลือเป็นวินาที', say: 'วินาทีเป็นนาที แบ่งทีละหกสิบ ที่เหลือเป็นวินาที' }),
      T('<b>ลองปรับเอง</b> — จับเวลาเอง', 'ลองจับเวลาเอง', el => el.append(simT4Watch())),
      a4dTry(491, () => Q.t4Conv(t4SecQ()), 'นาที วินาที'),
      a4dTry(491, () => t4MatchQ(pkF([2, 3, 4, 5, 6, 7, 8, 9, 10], 3).map(m => [`${m} นาที`, `${m * 60} วินาที`])), 'จับคู่ที่เท่ากัน')]; })(),

  /* ด่าน 2 นาที ชั่วโมง วัน → ระยะเวลาจากเวลาเริ่มถึงเวลาสิ้นสุด */
  492: (() => { const B = t4dBlocks(462, 60, { u: 'นาที' }), Ln = t4dLine(T3(16, 40), T3(19, 5), { mid: [T3(17, 40), T3(18, 40)] });
    return [
      t4dSee('นาที ชั่วโมง วัน', '<b>แตะรูป</b> — ขึ้นบันไดหน่วย', [
        { t: 'บันไดหน่วย', W: 560, H: 128, f: on => t4LadderSVG(on ? ['นาที', 'ชั่วโมง', 'วัน'] : []).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''), s: '1 ชั่วโมง = 60 นาที<br>1 วัน = <b>24 ชั่วโมง</b>' }]),
      r4dShow('462 นาที เป็นชั่วโมง นาที', { fig: B.s, q: '462 นาที คิดเป็นกี่ชั่วโมง กี่นาที',
        steps: [{ ink: B.cuts(), w: '60 × 7 = 420', n: 'แบ่งทีละ 60 นาที ได้ 7 ชั่วโมง' }, { ink: B.rest('42'), w: '462 − 420 = 42', n: 'นาทีที่เหลือ' }, { w: '7 ชั่วโมง 42 นาที', n: 'หน่วยเล็ก → ใหญ่: หาร', ans: 1 }],
        fin: `หน่วยใหญ่ → เล็ก <b>คูณ</b>${r4vSep}หน่วยเล็ก → ใหญ่ <b>หาร</b>`, say: 'หน่วยใหญ่เป็นหน่วยเล็กใช้คูณ หน่วยเล็กเป็นหน่วยใหญ่ใช้หาร' }),
      r4dPlay('บันไดหน่วย', 'ลากขึ้นลงบันไดหน่วย', () => t4dLadder()),
      a4dTry(492, () => Q.t4Conv(t4HDQ()), 'เปลี่ยนหน่วยเวลา'),
      t4dSee('ระยะเวลาจากเวลาเริ่มถึงเวลาสิ้นสุด', '<b>แตะรูป</b> — นับทีละชั่วโมง แล้วนับนาที', [
        { t: '16.40 → 19.05', f: on => Ln.s + (on ? r4vH(Ln.hop(T3(16, 40), T3(17, 40), '1 ชม.') + Ln.hop(T3(17, 40), T3(18, 40), '1 ชม.') + Ln.hop(T3(18, 40), T3(19, 5), '25 นาที', T4DC.o)) : ''), s: '2 ชั่วโมง กับ 25 นาที<br>= <b>2 ชั่วโมง 25 นาที</b>' }]),
      r4dShow('16.40 น. ถึง 19.05 น.', { fig: Ln.s, q: 'เริ่มดูภาพยนตร์เวลา 16.40 น. จบเวลา 19.05 น. ใช้เวลานานเท่าใด',
        steps: [{ ink: Ln.hop(T3(16, 40), T3(17, 40), '1 ชม.') + Ln.hop(T3(17, 40), T3(18, 40), '1 ชม.'), w: '16.40 → 18.40 = 2 ชั่วโมง', n: 'นับทีละ 1 ชั่วโมง' },
          { ink: Ln.hop(T3(18, 40), T3(19, 5), '25 นาที', T4DC.o), w: '18.40 → 19.05 = 25 นาที', n: 'นับนาทีที่เหลือ' }, { w: '2 ชั่วโมง 25 นาที', n: 'รวมกัน', ans: 1 }],
        fin: 'นับ<b>ทีละชั่วโมง</b>จากเวลาเริ่ม แล้วนับนาทีที่เหลือ', say: 'นับทีละชั่วโมงจากเวลาเริ่ม แล้วนับนาทีที่เหลือ' }),
      a4dTry(492, () => { const h1 = t4n(6, 20), m1 = pick([5, 10, 20, 35, 40, 45, 50]), d = t4n(70, 300), [h2, m2] = t3clock(T3(h1, m1) + d); return Q.t3Dur({ what: pick(['ดูภาพยนตร์', 'เดินทาง', 'ทำกิจกรรม', 'ซ้อมดนตรี']), h1, m1, h2, m2 }); }, 'หาระยะเวลา'),
      a4dTry(492, () => { const d1 = t4n(1, 20), h1 = t4n(6, 12), d2 = d1 + t4n(1, 4), h2 = h1 + t4n(1, 8), mon = pick(TK_MON); return Q.t4Span({ text: `ค่ายเริ่มวันที่ ${d1} ${mon} เวลา ${pad2(h1)}.00 น. และจบวันที่ ${d2} ${mon} เวลา ${pad2(h2)}.00 น. ค่ายใช้เวลากี่วัน กี่ชั่วโมง`, d1, h1, d2, h2, mon }); }, 'กี่วัน กี่ชั่วโมง')]; })(),

  /* ด่าน 3 สัปดาห์ เดือน ปี */
  493: (() => { const bw = 24, mx = (i, j) => 40 + j * bw, my = i => 40 + i * 48, strip = (rows, n) => Array.from({ length: rows }, (_, i) => Array.from({ length: 12 }, (_, j) => `<rect x="${mx(i, j)}" y="${my(i)}" width="${bw - 2}" height="30" rx="4" fill="${i * 12 + j < n ? (i % 2 ? '#9FD0F0' : '#FFC24C') : '#fff'}" stroke="#B9AFD6"/>`).join('')).join('');
    const yl = (i, t) => r4dTx(mx(i, 12) + 20, my(i) + 21, t, T4DC.p, 'r4d-sm', 'start'), YL = t4dLine(0, 32, { y: 150 });
    return [
      t4dSee('ปี กับ เดือน', '<b>แตะรูป</b> — 1 ปี มี 12 เดือน', [
        { t: '2 ปี 4 เดือน', f: on => strip(3, 28) + (on ? r4vH(yl(0, '12') + yl(1, '12') + yl(2, '4')) : ''), s: '12 + 12 + 4<br>= <b>28 เดือน</b>' },
        { t: '1 สัปดาห์ = 7 วัน', f: on => Array.from({ length: 21 }, (_, i) => `<rect x="${60 + (i % 7) * 34}" y="${50 + Math.floor(i / 7) * 42}" width="30" height="34" rx="5" fill="${on && i < 17 ? '#FFC24C' : '#fff'}" stroke="#B9AFD6"/>`).join('') + (on ? r4vH(r4dTx(180, 200, '2 สัปดาห์ 3 วัน = 17 วัน', T4DC.p, 'r4v-tx')) : ''), s: '2 × 7 + 3<br>= <b>17 วัน</b>' }]),
      r4dShow('2 ปี 4 เดือน เป็นเดือน', { fig: strip(3, 28), q: '2 ปี 4 เดือน คิดเป็นกี่เดือน',
        steps: [{ ink: yl(0, '12 เดือน') + yl(1, '12 เดือน'), w: '2 × 12 = 24', n: '1 ปี = 12 เดือน' }, { ink: yl(2, '4 เดือน'), w: '24 + 4 = 28', n: 'บวกเดือนที่เหลือ' }, { w: '28 เดือน', n: 'ปี → เดือน คูณ 12', ans: 1 }],
        fin: 'ปี → เดือน: <b>× 12</b> แล้วบวกเดือนที่เหลือ', say: 'ปีเป็นเดือน คูณสิบสอง แล้วบวกเดือนที่เหลือ' }),
      r4dPlay('ระบายเดือน', 'ลากระบายเดือน', () => t4dMonths([['ระบาย 18 เดือน', 18], ['ระบาย 2 ปี 5 เดือน', 29], ['ระบาย 3 ปี', 36]])),
      a4dTry(493, () => Q.t4Conv(t4YQ()), 'วัน สัปดาห์ เดือน ปี'),
      r4dShow('นับปีและเดือนจากวันที่', { fig: `<path d="M24 150 H336" stroke="${T4DC.ink}" stroke-width="2.6"/>` + [[56, '1 เม.ย. 2562'], [144, '1 เม.ย. 2563'], [232, '1 เม.ย. 2564'], [314, '1 ธ.ค. 2564']].map(([x, t], i) => `<path d="M${x} 141 V159" stroke="${i === 0 || i === 3 ? T4DC.ink : T4DC.fade}" stroke-width="2.4"/>` + r4dTx(x, 182 + (i % 2) * 18, t, i === 0 || i === 3 ? T4DC.ink : T4DC.fade, 'r4d-sm')).join(''), q: 'เริ่มงาน 1 เมษายน 2562 ลาออก 1 ธันวาคม 2564 ทำงานนานเท่าใด',
        steps: [{ ink: `<path d="M56 146 Q100 96 144 146" fill="none" stroke="${T4DC.p}" stroke-width="2.6"/><path d="M144 146 Q188 96 232 146" fill="none" stroke="${T4DC.p}" stroke-width="2.6"/>` + r4dTx(100, 110, '1 ปี', T4DC.p, 'r4d-sm') + r4dTx(188, 110, '1 ปี', T4DC.p, 'r4d-sm'), w: '2562 → 2564 = 2 ปี', n: 'วันเดือนเดียวกัน นับปีเต็มก่อน' },
          { ink: `<path d="M232 146 Q273 96 314 146" fill="none" stroke="${T4DC.o}" stroke-width="2.6"/>` + r4dTx(273, 110, '8 เดือน', T4DC.o, 'r4d-sm'), w: 'เม.ย. → ธ.ค. = 8 เดือน', n: 'นับเดือนที่เหลือ' }, { w: '2 ปี 8 เดือน', n: 'รวมกัน', ans: 1 }],
        fin: 'นับ<b>ปีเต็ม</b>ก่อน แล้วนับเดือนที่เหลือ', say: 'นับปีเต็มก่อน แล้วนับเดือนที่เหลือ' }),
      a4dTry(493, () => { const y = t4n(2560, 2565), m = t4n(0, 11), dy = t4n(0, 3), dm = t4n(1, 11), M2 = m + dm, a = [1, m, y], b = [1, M2 % 12, y + dy + Math.floor(M2 / 12)], it = pick(['ยาแก้ไอ', 'นมผง', 'อาหารกระป๋อง']); return Q.t4YM({ text: `${it}ผลิตวันที่ ${t4mon(1, a[1], a[2])} หมดอายุวันที่ ${t4mon(1, b[1], b[2])} ${it}มีอายุนานกี่ปี กี่เดือน`, a, b }); }, 'อายุกี่ปี กี่เดือน')]; })(),

  /* ด่าน 4 เปรียบเทียบระยะเวลา */
  494: (() => { const k = 300 / 50, D = (v, y, lab, col) => `<rect x="30" y="${y}" width="${a4n(v * k)}" height="40" rx="6" fill="${col}" stroke="${T4DC.ink}" stroke-width="2"/>` + r4dTx(38, y + 26, lab, T4DC.ink, 'r4d-sm', 'start'), k2 = 300 / 360, E = (v, y, lab, col) => `<rect x="30" y="${y}" width="${a4n(v * k2)}" height="40" rx="6" fill="${col}" stroke="${T4DC.ink}" stroke-width="2"/>` + r4dTx(38, y + 26, lab, T4DC.ink, 'r4d-sm', 'start');
    return [
      t4dSee('เปลี่ยนเป็นหน่วยเดียวกันก่อน', '<b>แตะรูป</b> — หน่วยต่างกันเทียบตรง ๆ ไม่ได้', [
        { t: '200 นาที กับ 3 ชั่วโมง 25 นาที', f: on => E(200, 60, '200 นาที', T4DC.bar2) + E(205, 130, on ? '205 นาที' : '3 ชั่วโมง 25 นาที', T4DC.bar) + (on ? r4vH(r4dTx(180, 210, '200 < 205', T4DC.p, 'r4v-big')) : ''), s: '3 ชั่วโมง 25 นาที = <b>205 นาที</b><br>200 นาที น้อยกว่า' }]),
      r4dShow('6 สัปดาห์ 3 วัน กับ 44 วัน', { fig: D(45, 60, '6 สัปดาห์ 3 วัน', T4DC.bar) + D(44, 130, '44 วัน', T4DC.bar2), q: '6 สัปดาห์ 3 วัน กับ 44 วัน อย่างไหนนานกว่า',
        steps: [{ ink: Array.from({ length: 6 }, (_, j) => `<path d="M${a4n(30 + (j + 1) * 7 * k)} 56 V104" fill="none" stroke="${T4DC.p}" stroke-width="2"/>`).join(''), w: '6 × 7 + 3 = 45 วัน', n: 'เปลี่ยนเป็นวันก่อน' },
          { ink: `<path d="M${a4n(30 + 44 * k)} 120 V180" stroke="${T4DC.p}" stroke-width="2" stroke-dasharray="5 4"/>`, w: '45 > 44', n: 'หน่วยเดียวกัน เทียบตัวเลข' }, { w: '6 สัปดาห์ 3 วัน นานกว่า', n: 'มากกว่า 1 วัน', ans: 1 }],
        fin: 'เปลี่ยนเป็น<b>หน่วยเดียวกัน</b>ก่อนเสมอ', say: 'เปลี่ยนเป็นหน่วยเดียวกันก่อนเสมอ' }),
      r4dPlay('ลากแถบเวลา', 'ลากแถบเวลาเทียบกัน', () => t4dCmpPlay()),
      a4dTry(494, () => Q.t4Cmp(T4_CMP()), 'เปรียบเทียบระยะเวลา'),
      r4dShow('นานกว่ากันเท่าใด', { fig: E(345, 60, '345 นาที', T4DC.bar2) + E(320, 130, '5 ชั่วโมง 20 นาที', T4DC.bar), q: '345 นาที กับ 5 ชั่วโมง 20 นาที ต่างกันเท่าใด',
        steps: [{ w: '5 × 60 + 20 = 320 นาที', n: 'เปลี่ยนเป็นนาที' }, { ink: `<rect x="${a4n(30 + 320 * k2)}" y="56" width="${a4n(25 * k2)}" height="48" fill="${T4DC.p}" fill-opacity=".2" stroke="${T4DC.p}" stroke-width="2.4" stroke-dasharray="5 4"/>` + r4dTx(30 + 332 * k2, 50, '?', T4DC.p, 'r4d-big'), w: '345 − 320 = 25 นาที', n: 'มาก − น้อย', ans: 1 }],
        fin: 'นานกว่า = <b>มาก − น้อย</b> (หน่วยเดียวกัน)', say: 'นานกว่ากันเท่าใด ใช้มากลบน้อย ในหน่วยเดียวกัน' }),
      a4dTry(494, () => Q.t4Diff(t4DiffQ()), 'นานกว่ากันเท่าใด'),
      a4dTry(494, () => t4SortQ(shuffle([`${t4n(2, 3)} ชั่วโมง ${t4n(1, 9) * 5} นาที`, `${t4n(100, 170)} นาที`, `${t4n(4, 6) * 60 + 10} นาที`, `${t4n(1, 2)} ชั่วโมง ${t4n(1, 5)} นาที`])), 'เรียงระยะเวลา')]; })(),

  /* ด่าน 5 ตารางเรียน / ตารางแข่งขัน */
  495: (() => { const TB = t4dTab(T4_SCHOOL, [0, 1, 2, 3, 4, 5, 6], { rh: 26, y0: 28 }), Ln = t4dLine(T3(13, 0), T3(14, 40), { y: 150 }), TM = t4dTab(T4_MATCH, [0, 1, 2, 3, 4, 5], { rh: 28 });
    return [
      t4dSee('อ่านตารางเรียน', '<b>แตะรูป</b> — 1 แถว = 1 คาบ', [
        { t: 'ตารางเรียน', f: on => TB.s + (on ? r4vH(TB.row(1)) : ''), s: 'คาบ 2 คณิตศาสตร์<br>09.20 – 10.10 น. = <b>50 นาที</b>' }]),
      r4dShow('เรียนศิลปะนานเท่าใด', { fig: TB.s, q: 'จากตาราง วิชาศิลปะเรียนนานเท่าใด',
        steps: [{ ink: TB.row(5), w: 'ศิลปะ 13.00 – 14.40 น.', n: 'หาแถวของวิชาก่อน' }, { ink: TB.cell(5, 1), w: '13.00 → 14.00 = 1 ชั่วโมง', n: 'นับทีละชั่วโมง' },
          { w: '14.00 → 14.40 = 40 นาที', n: 'นับนาทีที่เหลือ' }, { w: '1 ชั่วโมง 40 นาที', n: 'รวมกัน', ans: 1 }],
        fin: 'หา<b>แถว</b>ก่อน แล้วอ่านช่องเวลา', say: 'หาแถวก่อน แล้วอ่านช่องเวลา' }),
      a4dTry(495, () => t4TabQs(T4_SCHOOL), 'ตารางเรียน'),
      t4dSee('ตารางแข่งขัน', '<b>แตะรูป</b> — ดูวันที่ก่อน แล้วดูเวลา', [
        { t: 'ตารางแข่งขัน', f: on => TM.s + (on ? r4vH(TM.row(4)) : ''), s: 'ทีมปลา – ทีมม้า<br>วันที่ <b>4 ก.ค.</b> เวลา 10.15 น.' }]),
      T('<b>ลองปรับเอง</b> — แตะแถวในตารางแข่งขัน', 'แตะแถวในตารางแข่งขัน', el => el.append(simT4Tab(T4_MATCH))),
      a4dTry(495, () => t4TabQs(T4_MATCH), 'ตารางแข่งขัน')]; })(),

  /* ด่าน 6 ตารางเวลาในชีวิตประจำวัน (ข้ามเที่ยงคืน) */
  496: (() => { const TR = t4dTab(T4_TRAIN, [0, 1, 2, 3, 4], { rh: 26, y0: 26 }), Ln = t4dLine(T3(15, 10), T3(6, 35), { y: 120, mid: [1440] });
    return [
      t4dSee('ตารางเดินรถ', '<b>แตะรูป</b> — ออก กับ ถึง', [
        { t: 'ตารางรถไฟ', f: on => TR.s + (on ? r4vH(TR.row(0)) : ''), s: 'ขบวน 7 ออก 08.30 ถึง 20.30<br>= <b>12 ชั่วโมง</b>' },
        { t: 'ถึงวันรุ่งขึ้น', f: on => Ln.s + (on ? r4vH(r4dTx(Ln.X(1440), Ln.y - 30, 'เที่ยงคืน', T4DC.b, 'r4v-tx') + `<path d="M${a4n(Ln.X(1440))} ${Ln.y - 20} V${Ln.y + 10}" stroke="${T4DC.b}" stroke-width="3"/>`) : ''), s: 'เวลาถึงน้อยกว่าเวลาออก<br>= <b>ข้ามเที่ยงคืน</b>' }]),
      r4dShow('ขบวน 31 ไปหาดใหญ่', { fig: Ln.s + r4dTx(180, 40, 'ขบวน 31 ออก 15.10 ถึง 06.35', T4DC.ink, 'g5d-h'), q: 'ขบวน 31 ออก 15.10 น. ถึง 06.35 น. (วันรุ่งขึ้น) ใช้เวลาเดินทางเท่าใด',
        steps: [{ ink: Ln.hop(T3(15, 10), 1440, '8 ชม. 50 นาที', T4DC.p, 26), w: '15.10 → 24.00 = 8 ชม. 50 นาที', n: 'ถึงเที่ยงคืนก่อน' },
          { ink: Ln.hop(1440, 1440 + T3(6, 35), '6 ชม. 35 นาที', T4DC.o, 26), w: '00.00 → 06.35 = 6 ชม. 35 นาที', n: 'หลังเที่ยงคืน' },
          { w: '14 ชม. 85 นาที = 15 ชม. 25 นาที', n: '85 นาที = 1 ชม. 25 นาที' }, { w: '15 ชั่วโมง 25 นาที', n: 'คำตอบ', ans: 1 }],
        dense: true, fin: 'ข้ามเที่ยงคืน: นับ<b>ถึงเที่ยงคืน</b> แล้วนับต่อ', say: 'ข้ามเที่ยงคืน นับถึงเที่ยงคืนก่อน แล้วนับต่อ' }),
      a4dTry(496, () => t4TabQs(T4_BUS), 'ตารางเดินรถ'),
      T('<b>ลองปรับเอง</b> — แตะแถวในผังรายการ', 'แตะแถวในผังรายการโทรทัศน์', el => el.append(simT4Tab(T4_TV))),
      a4dTry(496, () => t4TabQs(pick([T4_TV, T4_TRAIN])), 'ผังรายการ / ตารางรถไฟ')]; })(),

  /* ด่าน 7 วิเคราะห์โจทย์ */
  497: (() => { const Ln = t4dLine(T3(7, 45), T3(9, 5), { y: 150, mid: [T3(8, 45)] }), dd = i => 26 + i * 31;
    return [
      t4dSee('เลือกวิธีคิด', '<b>แตะรูป</b> — โจทย์ถามอะไร', [
        { t: 'หาเวลาเสร็จ → บวก', f: on => Ln.s + (on ? r4vH(Ln.hop(T3(7, 45), T3(9, 5), '+ 1 ชม. 20 นาที', T4DC.p, 40)) : ''), s: 'เวลาเริ่ม + เวลาที่ใช้<br>= <b>เวลาเสร็จ</b>' },
        { t: 'ทุกวัน หลายวัน → คูณ', f: on => Array.from({ length: 6 }, (_, i) => `<rect x="${30 + i * 52}" y="80" width="44" height="44" rx="8" fill="${on ? '#FFC24C' : '#fff'}" stroke="#B9AFD6"/>` + r4dTx(52 + i * 52, 108, '45', T4DC.ink, 'r4d-sm')).join('') + (on ? r4vH(r4dTx(180, 180, '45 × 6', T4DC.p, 'r4v-big')) : ''), s: 'วันละ 45 นาที 6 วัน<br>→ <b>คูณ</b>' }]),
      r4dShow('ซักผ้าเสร็จเวลาใด', { fig: Ln.s, q: 'เริ่มซักผ้าเวลา 07.45 น. ใช้เวลา 1 ชั่วโมง 20 นาที ซักผ้าเสร็จเวลาใด',
        steps: [{ w: 'เวลาเริ่ม + เวลาที่ใช้', n: 'หาเวลาเสร็จ → บวก' }, { ink: Ln.hop(T3(7, 45), T3(8, 45), '+ 1 ชม.'), w: '07.45 + 1 ชม. = 08.45', n: 'บวกชั่วโมง' },
          { ink: Ln.hop(T3(8, 45), T3(9, 5), '+ 20 นาที', T4DC.o), w: '08.45 + 20 นาที = 09.05', n: 'บวกนาที (ข้าม 09.00)' }, { w: 'เสร็จเวลา 09.05 น.', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'อ่านว่าโจทย์ถามอะไร แล้ว<b>เลือกวิธีคิด</b>', say: 'อ่านว่าโจทย์ถามอะไร แล้วเลือกวิธีคิด' }),
      r4dShow('ค่าปรับ', { fig: Array.from({ length: 10 }, (_, i) => `<rect x="${dd(i)}" y="96" width="27" height="38" rx="5" fill="${i < 7 ? '#C9F0D9' : '#F9D3E0'}" stroke="#B9AFD6"/>` + r4dTx(dd(i) + 13.5, 121, String(i + 1), T4DC.ink, 'r4d-sm')).join('') + r4dTx(120, 82, 'กำหนด 7 วัน', T4DC.g, 'r4d-sm'), q: 'กำหนดสร้างเสร็จ 7 วัน แต่ใช้จริง 10 วัน ปรับวันละ 15,000 บาท ถูกปรับกี่บาท',
        steps: [{ ink: `<path data-pop="1" d="M${dd(7)} 146 V154 H${dd(9) + 27} V146" fill="none" stroke="${T4DC.p}" stroke-width="2.6"/>` + r4dTx((dd(7) + dd(9) + 27) / 2, 176, '3 วัน', T4DC.p, 'r4d-tx'), w: '10 − 7 = 3 วัน', n: 'ช้ากว่ากำหนด → ลบ' }, { w: '3 × 15,000 = 45,000', n: 'วันละ 15,000 → คูณ' }, { w: 'ค่าปรับ 45,000 บาท', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'โจทย์ 2 ขั้น: หา<b>วันที่ช้า</b>ก่อน แล้วคิดค่าปรับ', say: 'หาวันที่ช้าก่อน แล้วคิดค่าปรับ' }),
      a4dTry(497, () => Q.t4Story(t4StoryGen()), 'โจทย์ปัญหาเวลา')]; })(),

  /* ด่าน 8 แสดงวิธีทำ */
  498: (() => { const cx = [150, 230], R = { h: 40, a: 84, b: 124, ln: 138, r: 174 }, cell = (j, y, t, col = T4DC.ink, cls = 'e4d-dg') => `<text x="${cx[j]}" y="${y}" class="${cls}" text-anchor="middle" style="fill:${col}">${t}</text>`;
    const fig = r4dTx(cx[0], R.h, 'ปี', T4DC.b, 'g5d-h') + r4dTx(cx[1], R.h, 'เดือน', T4DC.b, 'g5d-h') + cell(0, R.a, '47') + cell(1, R.a, '5') + cell(0, R.b, '6') + cell(1, R.b, '8') + r4dTx(96, R.b, '+', T4DC.ink, 'e4d-dg') + `<path d="M90 ${R.ln} H270" stroke="${T4DC.ink}" stroke-width="2.4"/>`;
    return [
      t4dSee('แสดงวิธีทำ 4 บรรทัด', '<b>แตะรูป</b> — บอก → คิด → คำนวณ → ตอบ', [
        { t: 'แสดงวิธีทำ', f: on => `<rect x="30" y="16" width="300" height="208" rx="12" fill="#FFFDF6" stroke="#EDE6D2" stroke-width="2"/>` + (on ? r4vH(['① สิ่งที่โจทย์บอก', '② วิธีคิด', '③ คำนวณ', '④ ตอบ … หน่วย'].map((t, i) => r4dTx(54, 58 + i * 46, t, [T4DC.b, T4DC.o, T4DC.o, T4DC.g][i], 'r4v-tx', 'start')).join('')) : r4dTx(180, 126, '?', T4DC.p, 'r4v-big')), s: 'สิ่งที่โจทย์บอก → วิธีคิด<br>→ คำนวณ → <b>ตอบ</b>' }]),
      r4dShow('อายุของลุง', { fig, q: 'พ่ออายุ 47 ปี 5 เดือน ลุงอายุมากกว่าพ่อ 6 ปี 8 เดือน ลุงอายุเท่าใด',
        steps: [{ w: 'พ่อ 47 ปี 5 เดือน ลุงมากกว่า 6 ปี 8 เดือน', n: 'สิ่งที่โจทย์บอก' }, { ink: cell(1, R.r, '13', T4DC.p), w: '5 + 8 = 13 เดือน', n: 'มากกว่า → บวก เริ่มที่เดือน' },
          { ink: `<path d="M${cx[1] - 18} ${R.r - 6} L${cx[1] + 18} ${R.r - 22}" stroke="${T4DC.o}" stroke-width="2.4"/>` + cell(1, R.r + 34, '1', T4DC.p) + cell(0, 60, '1', T4DC.o, 'e4d-sm'), w: '13 เดือน = 1 ปี 1 เดือน', n: 'ครบ 12 เดือน ทด 1 ปี' },
          { ink: cell(0, R.r + 34, '54', T4DC.p), w: '47 + 6 + 1 = 54 ปี', n: 'บวกปี + ที่ทดมา' }, { w: 'ตอบ ลุงอายุ 54 ปี 1 เดือน', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        dense: true, fin: 'บอก → คิด → คำนวณ → <b>ตอบพร้อมหน่วย</b>', say: 'สิ่งที่โจทย์บอก วิธีคิด คำนวณ แล้วตอบพร้อมหน่วย' }),
      a4dTry(498, t4SeqGen, 'เรียงวิธีทำ'),
      a4dTry(498, () => Q.t4Story(t4StoryGen()), 'โจทย์ปัญหาเวลา')]; })()
};
LESSONS_P4C5.forEach(L => { if (T4D_TEACH[L.id]) { L.teach = T4D_TEACH[L.id]; L.__pracDone = 1; } if (L.id >= 491 && L.id <= 496 && L.game) { L.game = f4dGame(L.game); L.gameN = 10; } });
