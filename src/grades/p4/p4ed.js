/* =========================================================
   ป.4 บทที่ 7 ทะเลทรายทศนิยม — หน้าสอนและเกมเรียงใหม่ (v254 · ผู้ใช้ขอ) · prefix e4d
   เหมือนบทที่ 8–10: ประเด็นละหน้า ① ดูภาพ (r4vSee) → (บางประเด็น) ลองปรับเอง → ② ทำให้ดู (r4dDo: ดินสอนับแถบ/ช่อง เขียนเลขลงตารางหลัก
   ตั้งบวก/ลบทีละหลัก ทด กระจาย เขียนบนกระดาษทด คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อแบบเดียวกับในเกม) · ด่าน 1–5 เกม 10 ข้อเรียงตามประเด็น
   ไม่มี stepper ในหน้าสอน: หน้าปรับเองใหม่ e4dPaint (ลากระบายแถบ/ช่อง) และ e4dPv (ลากเลขโดดขึ้นลงในตารางหลัก) แทน simDecGrid / simE4Place
   วางหลัง p4ad.js ใน order.txt
   ========================================================= */
const E4DC = { w: '#9F8FF0', t: '#6FB2F5', hu: '#FFC24C', ink: '#2B2550', p: '#E5487A', g: '#1B8862', o: '#EC7F1E', b: '#2F7BC0', fade: '#B7AED3' };
/* base-ten squares as svg: 1 square = 1 whole · unit 10 → strips · unit 100 → cells (column by column) */
function e4dSq(n, unit, o = {}) { const S = o.S || 92, gap = o.gap || 16, wholes = Math.max(o.min || 1, Math.ceil(n / unit)), W = o.W || 360, H = o.H || 240, x0 = (W - (wholes * S + (wholes - 1) * gap)) / 2, y0 = o.y0 != null ? o.y0 : (H - S) / 2;
  const sqX = k => x0 + k * (S + gap), piece = i => { const k = Math.floor(i / unit), j = i % unit, X = sqX(k); return unit === 10 ? [X + j * S / 10, y0, S / 10, S] : [X + Math.floor(j / 10) * S / 10, y0 + (j % 10) * S / 10, S / 10, S / 10]; };
  let s = ''; for (let k = 0; k < wholes; k++) { const X = sqX(k); for (let i = 0; i < unit; i++) { const idx = k * unit + i, [x, y, w, hh] = piece(idx), on = idx < n && !o.empty; s += `<rect x="${a4n(x)}" y="${a4n(y)}" width="${a4n(w)}" height="${a4n(hh)}" fill="${on ? (o.col ? o.col(idx) : (Math.floor(idx / unit) < Math.floor(n / unit) ? E4DC.w : E4DC.t)) : '#fff'}" stroke="${unit === 10 ? '#8F86B3' : '#D3CCE6'}" stroke-width="${unit === 10 ? 1 : .7}"/>`; }
    if (unit === 100) for (let c = 1; c < 10; c++) s += `<path d="M${a4n(X + c * S / 10)} ${y0} V${y0 + S}" stroke="#8F86B3" stroke-width="1"/>`;
    s += `<rect x="${a4n(X)}" y="${y0}" width="${S}" height="${S}" fill="none" stroke="${E4DC.ink}" stroke-width="2"/>`; }
  return { s, piece, sqX, S, y0, wholes }; }
/* place-value chart as svg: columns hi … lo with the point between หน่วย and ส่วนสิบ */
function e4dPvS(str, o = {}) { const dg = pvDigits(str), ks = Object.keys(dg).map(Number), hi = Math.max(o.hi != null ? o.hi : 0, ...ks), lo = Math.min(o.lo != null ? o.lo : -1, ...ks), cw = o.cw || 56, pg = 16, n = hi - lo + 1, Wt = n * cw + pg, x0 = ((o.W || 360) - Wt) / 2, y0 = o.y0 != null ? o.y0 : 40, hh = 34, dh = 56;
  const cx = e => x0 + (hi - e) * cw + (e < 0 ? pg : 0) + cw / 2; let s = '';
  for (let e = hi; e >= lo; e--) { const x = cx(e) - cw / 2; s += `<rect x="${a4n(x)}" y="${y0}" width="${cw}" height="${hh}" fill="${e < 0 ? '#E6F1FD' : '#FFF1D6'}" stroke="#B9AFD6" stroke-width="1.2"/><rect x="${a4n(x)}" y="${y0 + hh}" width="${cw}" height="${dh}" fill="#fff" stroke="#B9AFD6" stroke-width="1.2"/><text x="${a4n(cx(e))}" y="${y0 + 22}" class="${(PV_NAME[e] || '').length > 5 ? 'g5d-s' : 'g5d-h'}" text-anchor="middle">${PV_NAME[e]}</text>`;
    if (!o.blank && dg[e] != null) s += `<text x="${a4n(cx(e))}" y="${y0 + hh + 39}" class="e4d-dg" text-anchor="middle">${dg[e]}</text>`; }
  s += `<text x="${a4n(cx(0) + cw / 2 + pg / 2)}" y="${y0 + hh + 40}" class="e4d-dg" text-anchor="middle">.</text>`;
  return { s, cx, yD: y0 + hh + 39, yH: y0 + 22, y0, hh, dh, cw, dg }; }
/* column add / subtract as svg (uses e4Plan) */
function e4dColS(a, b, op, o = {}) { const P = e4Plan(a, b, op), { p, n } = P, pa = dPl(a), pb = dPl(b), cw = o.cw || 36, pg = 14, Wt = (n + 1) * cw + (p ? pg : 0), x0 = ((o.W || 360) - Wt) / 2 + cw;
  const X = i => x0 + (n - 1 - i) * cw + (p && i < p ? pg : 0) + cw / 2, Y = { nm: 20, mk2: 42, mk: 62, a: 98, b: 136, ln: 150, r: 186, ln2: 198 }, ptX = X(p - 1) - cw / 2 - pg / 2;
  const show = (x, i) => i < String(x).length || i <= p, dig = (x, i) => Math.floor(x / 10 ** i) % 10;
  let s = ''; for (let i = n - 1; i >= 0; i--) s += `<text x="${a4n(X(i))}" y="${Y.nm}" class="e4d-nm" text-anchor="middle">${(PV_NAME[i - p] || '').replace('ส่วน', 'ส.')}</text>`;
  const pad = []; [[P.A, pa, Y.a], [P.B, pb, Y.b]].forEach(([x, pl, y], r) => { for (let i = n - 1; i >= 0; i--) if (show(x, i)) { const z = i < p - pl; if (z) { pad.push([i, y]); if (!o.padShown) continue; } s += `<text x="${a4n(X(i))}" y="${y}" class="e4d-dg${z ? ' z' : ''}" text-anchor="middle">${dig(x, i)}</text>`; }
    if (p) s += `<text x="${a4n(ptX)}" y="${y}" class="e4d-dg" text-anchor="middle">.</text>`; });
  s += `<text x="${a4n(X(n - 1) - cw)}" y="${Y.b}" class="e4d-dg" text-anchor="middle">${op}</text><path d="M${a4n(X(n - 1) - cw * 1.5)} ${Y.ln} H${a4n(X(0) + cw / 2)}" stroke="${E4DC.ink}" stroke-width="2.4"/>`;
  return { s, P, X, Y, ptX, pad, cw, dig }; }
/* worked column sum: the pencil does one column at a time */
function e4dColDo(a, b, op, o = {}) { const C = e4dColS(a, b, op), { P, X, Y } = C, { p } = P, marked = {}, nm = i => 'หลัก' + (PV_NAME[i - p] || ''), steps = [], R = e4s(P.R, P.p);
  const col = i => `<rect class="r4d-colhl" data-pop="1" x="${a4n(X(i) - C.cw / 2 + 2)}" y="${Y.mk2 - 16}" width="${C.cw - 4}" height="${Y.r - Y.mk2 + 26}" rx="6" fill="#FFE7A8" fill-opacity=".55"/>`, tx = (i, y, t, col2 = E4DC.p, cls = 'e4d-dg') => `<text x="${a4n(X(i))}" y="${y}" class="${cls}" text-anchor="middle" style="fill:${col2}">${t}</text>`;
  steps.push({ ink: C.pad.map(([i, y]) => tx(i, y, '0', E4DC.fade)).join('') + `<path d="M${a4n(C.ptX)} ${Y.mk - 6} V${Y.ln2}" fill="none" stroke="${E4DC.b}" stroke-width="2" stroke-dasharray="5 4"/>`, n: C.pad.length ? 'จุดตรงกัน เติม 0 ให้ตำแหน่งเท่ากัน' : 'ตั้งให้จุดตรงกัน', at: [C.ptX, Y.r + 26] });
  P.steps.forEach(s => { if (op === '−' && s.auto) return; let ink = col(s.i), w, n;
    if (op === '+') { if (s.auto) { ink += tx(s.i, Y.r, String(s.out)); w = 'ทด 1 ลงมา'; n = 'หลักซ้ายสุด'; }
      else { ink += tx(s.i, Y.r, String(s.out)) + (s.carry ? tx(s.i + 1, Y.mk, '1', E4DC.o, 'e4d-sm') : ''); w = `${s.d1} + ${s.d2}${s.c ? ' + 1' : ''} = ${s.s}`; n = nm(s.i) + (s.carry ? ` เขียน ${s.out} ทด 1` : ''); } }
    else { Object.entries(s.cross).forEach(([j, v]) => { const x = X(+j); if (marked[j]) ink += `<path d="M${a4n(x - 9)} ${Y.mk - 5} H${a4n(x + 9)}" fill="none" stroke="${E4DC.o}" stroke-width="2"/>` + tx(+j, Y.mk2, String(v), E4DC.o, 'e4d-sm'); else ink += `<path d="M${a4n(x - 10)} ${Y.a - 4} L${a4n(x + 10)} ${Y.a - 20}" fill="none" stroke="${E4DC.o}" stroke-width="2.4"/>` + tx(+j, Y.mk, String(v), E4DC.o, 'e4d-sm'); marked[j] = 1; });
      ink += tx(s.i, Y.r, String(s.out)); w = `${s.d1} − ${s.d2} = ${s.s}`; n = s.borrow != null ? `${s.d0} ลบ ${s.d2} ไม่ได้ → กระจาย` : nm(s.i); }
    if (p && s.i === p - 1) ink += `<text x="${a4n(C.ptX)}" y="${Y.r}" class="e4d-dg" text-anchor="middle" style="fill:${E4DC.p}">.</text>`;
    steps.push({ off: ['.r4d-colhl'], ink, w, n }); });
  steps.push({ off: ['.r4d-colhl'], ink: `<path d="M${a4n(X(P.n - 1) - C.cw * 1.5)} ${Y.ln2} H${a4n(X(0) + C.cw / 2)}" stroke="${E4DC.ink}" stroke-width="2.4"/>`, w: `${fmtDec(a)} ${op} ${fmtDec(b)} = ${fmtDec(R)}`, n: 'ใส่จุดให้ตรงกัน', ans: 1 });
  return r4dDo({ fig: C.s, q: o.q || `หาผล${op === '+' ? 'บวก' : 'ลบ'} ${fmtDec(a)} ${op} ${fmtDec(b)}`, steps, dense: steps.length > 5, fin: o.fin || `ตั้งให้<b>จุดตรงกัน</b> แล้ว${op === '+' ? 'บวก' : 'ลบ'}จากหลักขวาสุด`, say: o.say || `${fmtDec(a)} ${op === '+' ? 'บวก' : 'ลบ'} ${fmtDec(b)} เท่ากับ ${fmtDec(R)}` }); }

/* hands-on (no steppers): drag across the squares to paint · drag a digit up or down in the place-value chart */
function e4dPaint(unit, missions, n0 = 0) { const D = e4dSq(0, unit, { min: unit === 10 ? 3 : 2, empty: true, S: unit === 10 ? 110 : 140, gap: 20, W: 560, H: 250 }), tot = D.wholes * unit, val = n => unit === 10 ? decStr(DQ(e4s(n, 1))) : decStr(DQ(e4s(n, 2)));
  return tgScene({ W: 560, H: 250, st: { n: n0 }, cap: `<b>ลากนิ้ว</b>ไปบนตาราง เพื่อระบาย — 1 ${unit === 10 ? 'แถบ = 0.1' : 'ช่องเล็ก = 0.01 · 1 แถบ = 0.1'}`, missions: missions.map(([t, v]) => [t, s => val(s.n) === v]),
    svg: s => e4dSq(s.n, unit, { min: D.wholes, S: D.S, gap: 20, W: 560, H: 250 }).s,
    drag: (pt, s) => { let best = -1; for (let i = 0; i < tot; i++) { const [x, y, w, hh] = D.piece(i); if (pt[0] >= x && pt[0] <= x + w + .5 && pt[1] >= y && pt[1] <= y + hh + .5) { best = i; break; } } if (best < 0) return null; const n = best + 1; if (n === s.n) return null; sfx.tap(); return { n }; },
    info: s => { const v = val(s.n), w = Math.floor(s.n / unit), r = s.n % unit; return `ระบาย ${w ? `${w} รูปเต็ม + ` : ''}${unit === 10 ? `${r} แถบ` : `${Math.floor(r / 10)} แถบ ${r % 10} ช่อง`} = <b>${v}</b>${r4vSep}อ่านว่า ${e4Words(v)}`; } }); }
function e4dPv(missions) { const S0 = { 1: 1, 0: 2, '-1': 3, '-2': 4, '-3': 5 }, E = [1, 0, -1, -2, -3], str = d => `${d[1] ? d[1] : ''}${d[0]}.${d[-1]}${d[-2]}${d[-3]}`, cw = 84, x0 = 40, top = 30, bot = 230;
  const cx = e => x0 + (1 - e) * cw + (e < 0 ? 24 : 0) + cw / 2, yOf = v => bot - 16 - v * ((bot - top - 40) / 9);
  return tgScene({ W: 560, H: 250, st: { ...S0 }, cap: '<b>ลากเลขโดด</b>ขึ้นหรือลงในแต่ละหลัก — ดูว่าค่าและรูปกระจายเปลี่ยนอย่างไร', missions: missions.map(([t, v]) => [t, s => str(s) === v]),
    svg: s => E.map(e => `<rect x="${cx(e) - cw / 2 + 4}" y="${top}" width="${cw - 8}" height="${bot - top}" rx="10" fill="${e < 0 ? '#E6F1FD' : '#FFF1D6'}" stroke="#B9AFD6"/><text x="${cx(e)}" y="${top + 20}" class="g5d-h" text-anchor="middle">${PV_NAME[e]}</text>` + Array.from({ length: 10 }, (_, v) => `<circle cx="${cx(e)}" cy="${a4n(yOf(v))}" r="2.2" fill="#C9C2DD"/>`).join('') + `<circle cx="${cx(e)}" cy="${a4n(yOf(s[e]))}" r="21" fill="#fff" stroke="${E4DC.p}" stroke-width="2.6"/><text x="${cx(e)}" y="${a4n(yOf(s[e]) + 9)}" class="e4d-dg" text-anchor="middle">${s[e]}</text>`).join('') + `<text x="${cx(0) + cw / 2 + 12}" y="${bot - 30}" class="e4d-dg" text-anchor="middle">.</text>`,
    drag: (pt, s) => { const e = E.find(k => Math.abs(pt[0] - cx(k)) < cw / 2); if (e == null) return null; const v = Math.max(0, Math.min(9, Math.round((bot - 16 - pt[1]) / ((bot - top - 40) / 9)))); if (v === s[e]) return null; sfx.tap(); return { ...s, [e]: v }; },
    info: s => { const v = str(s), parts = E.filter(e => +s[e]).map(e => e4val(s[e], e)); return `<b>${fmtDec(v)}</b> อ่านว่า ${e4Words(v)}${r4vSep}รูปกระจาย ${parts.join(' + ') || '0'}`; } }); }

const e4dSee = (title, cap, list) => a4dSee(title, cap, list);
const e4dT = (x, y, t, col = E4DC.ink, cls = 'r4d-tx', anc = 'middle') => r4dTx(x, y, t, col, cls, anc);
const e4dD = (q, d, k) => ({ ...q, __diff: d, __kind: 'e4d' + k });
/* a bar model for a story: bars with values, a "?" bracket */
const e4dBars = (rows, o = {}) => { const mx = Math.max(...rows.map(r => r[1])), x0 = 96, W = 230, y0 = o.y0 || 50; let s = '';
  rows.forEach(([lab, v, col], i) => { const y = y0 + i * 62; s += `<text x="${x0 - 10}" y="${y + 24}" class="g5d-h" text-anchor="end">${lab}</text><rect x="${x0}" y="${y}" width="${a4n(v / mx * W)}" height="34" rx="6" fill="${col}" stroke="${E4DC.ink}" stroke-width="1.6"/>` + (o.noval && o.noval.includes(i) ? '' : `<text x="${a4n(x0 + v / mx * W / 2)}" y="${y + 23}" class="e4d-sm" text-anchor="middle">${fmtDec(String(v))}</text>`); });
  return { s, x: v => x0 + v / mx * W, y: i => y0 + i * 62, x0 }; };

/* =========================================================
   the lessons
   ========================================================= */
const E4D_TEACH = {
  /* ด่าน 1 ทศนิยม 1 ตำแหน่ง: ส่วนสิบ → เศษส่วน → อ่าน */
  1441: (() => { const D = e4dSq(26, 10, { min: 3 }), F = e4dSq(0, 10, { min: 3, empty: true });
    return [
      e4dSee('ส่วนสิบ', '<b>แตะรูป</b> — แบ่ง 1 ออกเป็น 10 ส่วนเท่า ๆ กัน', [
        { t: '1 รูปเต็ม แบ่ง 10 แถบ', f: on => e4dSq(on ? 3 : 0, 10, { empty: !on }).s + (on ? r4vH(e4dT(180, 40, '3/10 = 0.3', E4DC.p, 'r4v-big')) : ''), s: 'ระบาย 3 แถบ = <b>3/10</b><br>เขียนเป็น <b>0.3</b>' },
        { t: 'มากกว่า 1', f: on => e4dSq(on ? 17 : 10, 10, { min: 2 }).s + (on ? r4vH(e4dT(180, 40, '1 กับ 7/10 = 1.7', E4DC.p, 'r4v-big')) : ''), s: '1 รูปเต็ม กับ 7 แถบ<br>= <b>1.7</b>' }]),
      r4dShow('เขียนทศนิยมจากรูป', { fig: D.s, q: 'เขียนทศนิยมแสดงส่วนที่ระบายสี',
        steps: [{ ink: [0, 1].map(k => e4dT(D.sqX(k) + D.S / 2, D.y0 + D.S / 2 + 10, String(k + 1), '#fff', 'r4d-big')).join(''), w: '2 รูปเต็ม → 2', n: 'นับรูปเต็มก่อน' },
          { ink: (() => { const [x1, y1] = D.piece(20), [x2, , w2] = D.piece(25), yb = y1 + D.S + 8; return `<path d="M${a4n(x1)} ${yb} V${yb + 8} H${a4n(x2 + w2)} V${yb}" fill="none" stroke="${E4DC.p}" stroke-width="2.6"/>` + e4dT((x1 + x2 + w2) / 2, yb + 30, '6 แถบ', E4DC.p, 'r4d-sm'); })(), w: '6 แถบ → 0.6', n: '1 แถบ = 0.1' },
          { w: '2 + 0.6 = 2.6', n: 'อ่านว่า สองจุดหก', ans: 1 }],
        fin: 'รูปเต็มอยู่<b>หน้าจุด</b><span class="rp-sep"></span>แถบ (ส่วนสิบ) อยู่<b>หลังจุด</b>', say: 'รูปเต็มอยู่หน้าจุด แถบอยู่หลังจุด' }),
      a4dTry(1441, () => Q.e4Pic({ n: e4pic10(), unit: 10 }), 'ทศนิยมจากรูป'),
      r4dPlay('ระบายแถบ', 'ลากระบายแถบ', () => e4dPaint(10, [['ระบายให้ได้ 0.7', '0.7'], ['ระบายให้ได้ 1.4', '1.4'], ['ระบายให้ได้ 2.9', '2.9']])),
      e4dSee('เศษส่วน ↔ ทศนิยม', '<b>แตะรูป</b> — ตัวส่วนเป็น 10 เขียนเป็นทศนิยม 1 ตำแหน่ง', [
        { t: '23/10', f: on => e4dSq(on ? 23 : 0, 10, { min: 3, empty: !on }).s + r4dTx(180, 40, on ? '23/10 = 2.3' : '23/10 = ?', E4DC.p, 'r4v-big'), s: '23 แถบ = 2 รูปเต็ม กับ 3 แถบ<br>= <b>2.3</b>' }]),
      r4dShow('เขียนเศษส่วนเป็นทศนิยม', { fig: F.s, q: '23/10 เขียนเป็นทศนิยมได้อย่างไร',
        steps: [{ ink: Array.from({ length: 23 }, (_, i) => { const [x, y, w, hh] = D.piece(i); return `<rect x="${a4n(x)}" y="${a4n(y)}" width="${a4n(w)}" height="${a4n(hh)}" fill="${i < 20 ? E4DC.w : E4DC.t}" stroke="#8F86B3"/>`; }).join(''), w: 'ระบาย 23 แถบ', n: '23/10 = 23 ส่วน ส่วนละ 1/10' },
          { w: '= 2 รูปเต็ม กับ 3 แถบ', n: 'ครบ 10 แถบ = 1 รูปเต็ม' }, { w: '23/10 = 2.3', n: 'ตัวส่วน 10 → 1 ตำแหน่ง', ans: 1 }],
        fin: 'ตัวส่วน 10 → ทศนิยม <b>1 ตำแหน่ง</b>', say: 'ตัวส่วนสิบ เขียนเป็นทศนิยมหนึ่งตำแหน่ง' }),
      a4dTry(1441, () => Q.e4Frac({ s: e4nz(0, 30, 1) }), 'เศษส่วนเป็นทศนิยม'),
      a4dTry(1441, () => Q.e4Read({ s: e4nz(1, 99, 1), to: pick(['word', 'num']) }), 'อ่านและเขียนทศนิยม')]; })(),

  /* ด่าน 2 ทศนิยม 2 ตำแหน่ง */
  1442: (() => { const D = e4dSq(142, 100, { min: 2, S: 110, gap: 24 });
    return [
      e4dSee('ส่วนร้อย', '<b>แตะรูป</b> — แบ่ง 1 ออกเป็น 100 ช่อง', [
        { t: '1 ช่องเล็ก', f: on => e4dSq(on ? 7 : 0, 100, { empty: !on, S: 130 }).s + (on ? r4vH(e4dT(180, 30, '7/100 = 0.07', E4DC.p, 'r4v-big')) : ''), s: '1 ช่อง = <b>0.01</b><br>7 ช่อง = 0.07' },
        { t: '1 แถบ = 10 ช่อง', f: on => e4dSq(on ? 35 : 0, 100, { empty: !on, S: 130 }).s + (on ? r4vH(e4dT(180, 30, '35/100 = 0.35', E4DC.p, 'r4v-big')) : ''), s: '3 แถบ 5 ช่อง<br>= <b>0.35</b>' }]),
      r4dShow('เขียนทศนิยมจากรูป', { fig: D.s, q: 'เขียนทศนิยมแสดงส่วนที่ระบายสี',
        steps: [{ ink: e4dT(D.sqX(0) + D.S / 2, D.y0 + D.S / 2 + 10, '1', '#fff', 'r4d-big'), w: '1 รูปเต็ม → 1', n: 'นับรูปเต็มก่อน' },
          { ink: (() => { const [x1] = D.piece(100), [x2] = D.piece(130), yt = D.y0 - 8; return `<path d="M${a4n(x1)} ${yt} V${yt - 8} H${a4n(x2 + D.S / 10)} V${yt}" fill="none" stroke="${E4DC.p}" stroke-width="2.6"/>` + e4dT((x1 + x2 + D.S / 10) / 2, yt - 16, '4 แถบ', E4DC.p, 'r4d-sm'); })(), w: '4 แถบ → 0.4', n: '1 แถบ = 0.1' },
          { ink: [0, 1].map(j => { const [x, y] = D.piece(140 + j); return `<circle cx="${a4n(x + D.S / 20)}" cy="${a4n(y + D.S / 20)}" r="8" fill="none" stroke="${E4DC.p}" stroke-width="2"/>`; }).join(''), w: '2 ช่อง → 0.02', n: '1 ช่อง = 0.01' },
          { w: '1 + 0.4 + 0.02 = 1.42', n: 'อ่านว่า หนึ่งจุดสี่สอง', ans: 1 }],
        fin: 'แถบ = <b>ส่วนสิบ</b><span class="rp-sep"></span>ช่องเล็ก = <b>ส่วนร้อย</b>', say: 'แถบเป็นส่วนสิบ ช่องเล็กเป็นส่วนร้อย' }),
      a4dTry(1442, () => Q.e4Pic({ n: e4pic100(), unit: 100 }), 'ทศนิยมจากรูป'),
      r4dPlay('ระบายช่อง', 'ลากระบายช่อง', () => e4dPaint(100, [['ระบายให้ได้ 0.25', '0.25'], ['ระบายให้ได้ 0.6', '0.6'], ['ระบายให้ได้ 1.08', '1.08']])),
      r4dShow('เขียนเศษส่วนเป็นทศนิยม', { fig: e4dPvS('1.35', { lo: -2, blank: true, y0: 70 }).s, q: '135/100 เขียนเป็นทศนิยมได้อย่างไร',
        steps: [{ w: 'ตัวส่วน 100 → 2 ตำแหน่ง', n: 'ส่วนร้อย = 2 หลักหลังจุด' }, { ink: (() => { const V = e4dPvS('1.35', { lo: -2, y0: 70 }); return [0, -1, -2].map(e => `<text x="${a4n(V.cx(e))}" y="${V.yD}" class="e4d-dg" text-anchor="middle" style="fill:${E4DC.p}">${V.dg[e]}</text>`).join(''); })(), w: 'เขียน 135 ให้ 5 อยู่หลักส่วนร้อย', n: 'นับจากขวา 2 หลัก ใส่จุด' },
          { w: '135/100 = 1.35', n: 'อ่านว่า หนึ่งจุดสามห้า', ans: 1 }],
        fin: 'ตัวส่วน 100 → ทศนิยม <b>2 ตำแหน่ง</b>', say: 'ตัวส่วนหนึ่งร้อย เขียนเป็นทศนิยมสองตำแหน่ง' }),
      a4dTry(1442, () => Q.e4Frac({ s: e4nz(0, 99, 2) }), 'เศษส่วนเป็นทศนิยม'),
      a4dTry(1442, () => Q.e4Read({ s: e4nz(1, 99, 2), to: pick(['word', 'num']) }), 'อ่านและเขียนทศนิยม')]; })(),

  /* ด่าน 3 ทศนิยม 3 ตำแหน่ง → ทศนิยมที่เท่ากัน */
  1443: (() => { const V = e4dPvS('3.487', { lo: -3, y0: 70 }), Vb = e4dPvS('3.487', { lo: -3, y0: 70, blank: true });
    return [
      e4dSee('ส่วนพัน', '<b>แตะรูป</b> — หลักที่ 3 หลังจุด', [
        { t: '0.005', f: on => e4dPvS('0.005', { lo: -3, y0: 60 }).s + (on ? r4vH(r4dTx(e4dPvS('0.005', { lo: -3, y0: 60 }).cx(-3), 200, '5/1000', E4DC.p, 'r4v-big')) : ''), s: '5 ส่วนพัน = <b>0.005</b><br>ศูนย์จุดศูนย์ศูนย์ห้า' },
        { t: '45.862', f: on => e4dPvS('45.862', { lo: -3, y0: 60 }).s + (on ? r4vH(r4dTx(180, 200, 'สี่สิบห้า จุด แปด หก สอง', E4DC.p, 'r4v-tx')) : ''), s: 'หลังจุด <b>อ่านทีละตัว</b><br>สี่สิบห้าจุดแปดหกสอง' }]),
      r4dShow('เขียนเศษส่วนเป็นทศนิยม 3 ตำแหน่ง', { fig: Vb.s, q: '3487/1000 เขียนเป็นทศนิยมได้อย่างไร',
        steps: [{ w: 'ตัวส่วน 1,000 → 3 ตำแหน่ง', n: 'ส่วนพัน = 3 หลักหลังจุด' }, { ink: [-1, -2, -3].map(e => `<text x="${a4n(V.cx(e))}" y="${V.yD}" class="e4d-dg" text-anchor="middle" style="fill:${E4DC.p}">${V.dg[e]}</text>`).join(''), w: '487 อยู่หลังจุด', n: 'นับจากขวา 3 หลัก' },
          { ink: `<text x="${a4n(V.cx(0))}" y="${V.yD}" class="e4d-dg" text-anchor="middle" style="fill:${E4DC.p}">3</text>`, w: '3 อยู่หน้าจุด', n: '3,000/1,000 = 3' }, { w: '3487/1000 = 3.487', n: 'สามจุดสี่แปดเจ็ด', ans: 1 }],
        fin: 'ตัวส่วน 1,000 → ทศนิยม <b>3 ตำแหน่ง</b>', say: 'ตัวส่วนหนึ่งพัน เขียนเป็นทศนิยมสามตำแหน่ง' }),
      a4dTry(1443, () => Q.e4Frac({ s: e4nz(0, 99, 3) }), 'เศษส่วนเป็นทศนิยม'),
      a4dTry(1443, () => Q.e4Read({ s: e4nz(1, 999, 3), to: pick(['word', 'num']) }), 'อ่านและเขียนทศนิยม'),
      e4dSee('ทศนิยมที่เท่ากัน', '<b>แตะรูป</b> — ระบายเท่ากันไหม', [
        { t: '0.6 กับ 0.60', f: on => e4dSq(on ? 60 : 0, 100, { empty: !on, S: 130 }).s + (on ? r4vH(e4dT(180, 30, '6 แถบ = 60 ช่อง', E4DC.p, 'r4v-big')) : ''), s: '0.6 = <b>0.60</b><br>เติม 0 ท้ายทศนิยม ค่าไม่เปลี่ยน' }]),
      r4dShow('0.4 กับ 0.40', { fig: e4dSq(0, 10, { empty: true, S: 120, W: 180 }).s + `<g transform="translate(180 0)">${e4dSq(0, 100, { empty: true, S: 120, W: 180 }).s}</g>`, q: '0.4 กับ 0.40 เท่ากันหรือไม่',
        steps: [{ ink: Array.from({ length: 4 }, (_, i) => { const [x, y, w, hh] = e4dSq(0, 10, { S: 120, W: 180 }).piece(i); return `<rect x="${a4n(x)}" y="${a4n(y)}" width="${a4n(w)}" height="${a4n(hh)}" fill="${E4DC.t}" stroke="#8F86B3"/>`; }).join(''), w: '0.4 = 4 แถบ', n: '4 ส่วนสิบ' },
          { ink: `<g transform="translate(180 0)">${Array.from({ length: 40 }, (_, i) => { const [x, y, w, hh] = e4dSq(0, 100, { S: 120, W: 180 }).piece(i); return `<rect x="${a4n(x)}" y="${a4n(y)}" width="${a4n(w)}" height="${a4n(hh)}" fill="${E4DC.hu}" stroke="#D3CCE6"/>`; }).join('')}</g>`, w: '0.40 = 40 ช่อง', n: '40 ส่วนร้อย' },
          { w: '0.4 = 0.40', n: 'ระบายเท่ากัน', ans: 1 }],
        fin: 'เติม <b>0 ท้ายทศนิยม</b> ค่าไม่เปลี่ยน', say: 'เติมศูนย์ท้ายทศนิยม ค่าไม่เปลี่ยน' }),
      a4dTry(1443, () => e4Eq(e4nz(1, 99, rnd(1, 2))), 'ทศนิยมที่เท่ากัน')]; })(),

  /* ด่าน 4 หลัก ค่าประจำหลัก → รูปกระจาย */
  1444: (() => { const V = e4dPvS('15.467', { lo: -3, y0: 50 }), W = e4dPvS('376.802', { lo: -3, y0: 40, cw: 48 });
    return [
      e4dSee('หลักของทศนิยม', '<b>แตะรูป</b> — หลักทางขวาของจุด', [
        { t: '43.139', f: on => e4dPvS('43.139', { lo: -3, y0: 60 }).s + (on ? r4vH([-1, -2, -3].map(e => r4dTx(e4dPvS('43.139', { lo: -3, y0: 60 }).cx(e), 196, ['0.1', '0.01', '0.001'][-e - 1], E4DC.p, 'r4v-tx')).join('')) : ''), s: 'ส่วนสิบ 0.1<span class="rp-sep"></span>ส่วนร้อย 0.01<br>ส่วนพัน <b>0.001</b>' }]),
      r4dShow('ค่าของเลขโดด', { fig: V.s, q: 'ใน 15.467 เลขโดด 4 อยู่หลักใด มีค่าเท่าใด',
        steps: [{ ink: `<circle cx="${a4n(V.cx(-1))}" cy="${V.yD - 12}" r="20" fill="none" stroke="${E4DC.p}" stroke-width="2.6"/>`, n: 'หาเลข 4', at: [V.cx(-1), V.yD - 20] },
          { ink: `<rect x="${a4n(V.cx(-1) - V.cw / 2 + 2)}" y="${V.y0 + 2}" width="${V.cw - 4}" height="${V.hh - 4}" rx="6" fill="none" stroke="${E4DC.b}" stroke-width="2.6"/>`, w: 'หลักส่วนสิบ', n: 'ตัวแรกหลังจุด' },
          { ink: r4dArr([V.cx(-1), V.yD + 14], [V.cx(-1), V.yD + 44], E4DC.p) + e4dT(V.cx(-1), V.yD + 66, '0.4', E4DC.p), w: '4 × 0.1 = 0.4', n: 'เลขโดด × ค่าประจำหลัก', ans: 1 }],
        fin: 'ค่าของเลขโดด = <b>เลขโดด × ค่าประจำหลัก</b>', say: 'ค่าของเลขโดด เท่ากับ เลขโดดคูณค่าประจำหลัก' }),
      a4dTry(1444, () => { const s = e4nz(10, 999, 3), ds = s.replace('.', ''); let pos; do pos = rnd(0, ds.length - 1); while (ds[pos] === '0'); return Q.e4Place({ s, pos }); }, 'หลักและค่าของเลขโดด'),
      r4dPlay('ลากเลขโดดในตารางหลัก', 'ลากเลขโดดขึ้นลงในแต่ละหลัก', () => e4dPv([['ทำให้เป็น 24.107', '24.107'], ['ทำให้เป็น 30.508', '30.508'], ['ทำให้เป็น 6.025', '6.025']])),
      e4dSee('รูปกระจาย', '<b>แตะรูป</b> — แยกค่าทีละหลักแล้วบวกกัน', [
        { t: '12.75', f: on => e4dPvS('12.75', { lo: -2, y0: 50 }).s + (on ? r4vH(r4dTx(180, 200, '10 + 2 + 0.7 + 0.05', E4DC.p, 'r4v-big')) : ''), s: '12.75 = 10 + 2 + 0.7 + 0.05<br>หลักที่เป็น 0 ไม่ต้องเขียน' }]),
      r4dShow('เขียนในรูปกระจาย', { fig: W.s, q: '376.802 เขียนในรูปกระจายได้อย่างไร',
        steps: [{ ink: [2, 1, 0].map(e => e4dT(W.cx(e), W.yD + 50, ['6', '70', '300'][e], E4DC.p, 'r4d-sm')).join(''), w: '300 + 70 + 6', n: 'จำนวนนับหน้าจุด' },
          { ink: e4dT(W.cx(-1), W.yD + 50, '0.8', E4DC.p, 'r4d-sm') + `<path d="M${a4n(W.cx(-2) - 12)} ${W.yD - 30} L${a4n(W.cx(-2) + 12)} ${W.yD + 4}" stroke="${E4DC.fade}" stroke-width="2.6" fill="none"/>` + e4dT(W.cx(-3), W.yD + 50, '0.002', E4DC.p, 'r4d-sm'), w: '+ 0.8 + 0.002', wa: 1, n: '0 ในหลักส่วนร้อย ไม่ต้องเขียน' },
          { w: '376.802 = 300 + 70 + 6 + 0.8 + 0.002', n: 'บวกกันได้จำนวนเดิม', ans: 1 }],
        dense: true, fin: 'รูปกระจาย = <b>ผลบวกของค่าเลขโดดทุกหลัก</b>', say: 'รูปกระจาย คือผลบวกของค่าเลขโดดทุกหลัก' }),
      a4dTry(1444, () => Q.e4Exp({ s: e4nz(10, 999, rnd(2, 3)) }), 'รูปกระจาย')]; })(),

  /* ด่าน 5 เปรียบเทียบ (เทียบจากหลักซ้าย<span class="rp-sep"></span>เติม 0) → เรียงลำดับ */
  1445: (() => { const A = e4dPvS('65.47', { lo: -2, y0: 20 }), B = e4dPvS('65.45', { lo: -2, y0: 112 }), cmpFig = A.s + B.s.replace(/<rect[^>]*?fill="#E6F1FD"[^>]*?\/>|<rect[^>]*?fill="#FFF1D6"[^>]*?\/>|<text[^>]*?class="g5d-[hs]"[^>]*?>[^<]*<\/text>/g, '');
    const rows = ['5.74', '5.6', '5.844'], RY = i => 70 + i * 52, RX = 120, cwd = 30, digx = (s, k) => RX + k * cwd;
    const rowTxt = (s, i, full) => { const t = full ? s.padEnd(5, '0') : s; return [...t].map((c, k) => `<text x="${digx(s, k)}" y="${RY(i)}" class="e4d-dg${k >= s.length ? ' z' : ''}" text-anchor="middle">${c}</text>`).join(''); };
    return [
      e4dSee('เทียบจากหลักซ้าย', '<b>แตะรูป</b> — เทียบทีละหลักจากซ้ายไปขวา', [
        { t: '65.47 กับ 65.45', f: on => cmpFig + (on ? r4vH([2, 1, 0, -1].map(e => r4dTx(A.cx(e), 214, '=', E4DC.g, 'r4v-big')).join('') + r4dTx(A.cx(-2), 214, '7 > 5', E4DC.p, 'r4v-tx')) : ''), s: 'เท่ากันจนถึงหลักส่วนร้อย<br>7 &gt; 5 → <b>65.47 &gt; 65.45</b>' }]),
      r4dShow('เปรียบเทียบทศนิยม', { fig: cmpFig, q: '65.47 กับ 65.45 จำนวนใดมากกว่า',
        steps: [{ ink: [1, 0, -1].map(e => e4dT(A.cx(e), 214, '=', E4DC.g, 'r4d-big')).join(''), w: '6 = 6 , 5 = 5 , 4 = 4', n: 'เทียบจากหลักซ้าย' },
          { ink: `<rect x="${a4n(A.cx(-2) - 22)}" y="${A.yD - 40}" width="44" height="${B.yD - A.yD + 56}" rx="10" fill="none" stroke="${E4DC.p}" stroke-width="2.6"/>` + e4dT(A.cx(-2), 214, '7 > 5', E4DC.p), w: 'ส่วนร้อย 7 > 5', n: 'หลักแรกที่ต่างกัน' },
          { w: '65.47 > 65.45', n: 'ตัดสินจากหลักนี้เลย', ans: 1 }],
        fin: 'เทียบ<b>จากหลักซ้าย</b> หลักแรกที่ต่างกันตัดสิน', say: 'เทียบจากหลักซ้าย หลักแรกที่ต่างกันเป็นตัวตัดสิน' }),
      T('<b>ลองปรับเอง</b> — เทียบทีละหลัก', 'ลองเทียบทีละหลัก', el => el.append(simE4Cmp())),
      a4dTry(1445, () => e4Cmp(e4cmpPair()), 'เปรียบเทียบ'),
      e4dSee('ตำแหน่งไม่เท่ากัน', '<b>แตะรูป</b> — เติม 0 ให้ตำแหน่งเท่ากันก่อน', [
        { t: '56.8 กับ 56.792', f: on => rowTxt('56.8', 0, on) + rowTxt('56.792', 1, false) + (on ? r4vH(r4dTx(180, 200, '56.800 > 56.792', E4DC.p, 'r4v-big')) : ''), s: '56.8 = <b>56.800</b><br>ส่วนสิบ 8 &gt; 7' }]),
      r4dShow('เรียงจากมากไปน้อย', { fig: rows.map((s, i) => rowTxt(s, i, false)).join(''), q: 'เรียง 5.74 , 5.6 , 5.844 จากมากไปน้อย',
        steps: [{ ink: rows.map((s, i) => [...s.padEnd(5, '0')].map((c, k) => k >= s.length ? `<text x="${digx(s, k)}" y="${RY(i)}" class="e4d-dg" text-anchor="middle" style="fill:${E4DC.fade}">${c}</text>` : '').join('')).join(''), w: '5.740 , 5.600 , 5.844', n: 'เติม 0 ให้ครบ 3 ตำแหน่ง' },
          { ink: `<rect x="${digx('', 2) - 16}" y="${RY(0) - 34}" width="32" height="${RY(2) - RY(0) + 46}" rx="10" fill="none" stroke="${E4DC.p}" stroke-width="2.6"/>`, w: 'ส่วนสิบ 8 > 7 > 6', n: 'หน่วยเท่ากัน ดูส่วนสิบ' },
          { ink: [[2, '1'], [0, '2'], [1, '3']].map(([i, t]) => e4dT(RX - 46, RY(i), t, E4DC.p, 'r4d-big')).join(''), w: '5.844 , 5.74 , 5.6', n: 'มากไปน้อย', ans: 1 }],
        fin: 'ทำให้<b>ตำแหน่งเท่ากัน</b>ก่อน แล้วจึงเรียง', say: 'ทำให้ตำแหน่งเท่ากันก่อน แล้วจึงเรียง' }),
      a4dTry(1445, () => e4Sort(e4SortSet(), pick(['asc', 'desc'])), 'เรียงลำดับ')]; })(),

  /* ด่าน 6–10 ตั้งบวก/ลบ: ดูภาพ → ทำให้ดู (ทีละหลัก) → กดทำเองทีละหลัก → ลองทำ */
  1446: [e4dSee('ตั้งให้จุดตรงกัน', '<b>แตะรูป</b> — หลักเดียวกันต้องอยู่ตรงกัน', [{ t: '12.14 + 35.44', f: on => e4dColS('12.14', '35.44', '+').s + (on ? r4vH(`<path d="M${a4n(e4dColS('12.14', '35.44', '+').ptX)} 40 V200" stroke="${E4DC.b}" stroke-width="2.4" stroke-dasharray="5 4"/>`) : ''), s: 'จุดอยู่<b>แนวเดียวกัน</b><br>หลักเดียวกันอยู่ตรงกัน' }]),
    r4dShow('23.41 + 15.36', { mk: 1 }), T('<b>ลองปรับเอง</b> — กดบวกทีละหลัก', 'ลองกดบวกทีละหลัก', el => el.append(simE4Col([['4.5', '32.24', '+'], ['60.07', '18.6', '+'], ['51.3', '7.25', '+']]))),
    a4dTry(1446, () => { const [a, b] = e4pair('+', 2, false); return Q.e4Col({ a, b, op: '+' }); }, 'บวกทศนิยม')],
  1447: [e4dSee('ครบ 10 ทดไปหลักซ้าย', '<b>แตะรูป</b> — ทดข้ามจุดได้', [{ t: '32.09 + 78.74', f: on => e4dColS('32.09', '78.74', '+').s + (on ? r4vH(`<text x="${a4n(e4dColS('32.09', '78.74', '+').X(1))}" y="62" class="e4d-sm" text-anchor="middle" style="fill:${E4DC.o}">1</text><text x="${a4n(e4dColS('32.09', '78.74', '+').X(0))}" y="186" class="e4d-dg" text-anchor="middle" style="fill:${E4DC.p}">3</text>`) : ''), s: '9 + 4 = 13<br>เขียน 3 <b>ทด 1</b>' }]),
    r4dShow('32.09 + 78.74', { mk: 1 }), T('<b>ลองปรับเอง</b> — กดบวกทีละหลัก', 'ลองกดบวกทีละหลัก', el => el.append(simE4Col([['86.75', '44.95', '+'], ['49.58', '24.6', '+'], ['7.86', '5.47', '+']]))),
    a4dTry(1447, () => { const [a, b] = e4pair('+', 2, true); return Q.e4Col({ a, b, op: '+' }); }, 'บวกมีทด')],
  1448: [e4dSee('ตำแหน่งไม่เท่ากัน', '<b>แตะรูป</b> — เติม 0 ให้ตำแหน่งเท่ากัน', [{ t: '24.81 + 35.114', f: on => e4dColS('24.81', '35.114', '+', { padShown: on }).s, s: '24.81 = <b>24.810</b><br>0 ที่เติม ค่าไม่เปลี่ยน' }]),
    r4dShow('24.81 + 35.114', { mk: 1 }), T('<b>ลองปรับเอง</b> — กดบวกทีละหลัก', 'ลองกดบวกทีละหลัก', el => el.append(simE4Col([['40.089', '93.68', '+'], ['94.98', '49', '+'], ['8.6', '2.475', '+']]))),
    a4dTry(1448, () => { const [a, b] = e4pair('+', 3); return Q.e4Col({ a, b, op: '+' }); }, 'บวก 3 ตำแหน่ง')],
  1449: [e4dSee('ตั้งลบทศนิยม', '<b>แตะรูป</b> — จุดตรงกัน เติม 0', [{ t: '88.465 − 74.23', f: on => e4dColS('88.465', '74.23', '−', { padShown: on }).s, s: '74.23 = <b>74.230</b><br>แล้วลบจากขวาไปซ้าย' }]),
    r4dShow('88.465 − 74.23', { mk: 1 }), T('<b>ลองปรับเอง</b> — กดลบทีละหลัก', 'ลองกดลบทีละหลัก', el => el.append(simE4Col([['94.377', '3.2', '−'], ['74.487', '21.055', '−'], ['6.95', '2.4', '−']]))),
    a4dTry(1449, () => { const [a, b] = e4pair('−', 3, false); return Q.e4Col({ a, b, op: '−' }); }, 'ลบทศนิยม')],
  1450: [e4dSee('ลบไม่ได้ ต้องกระจาย', '<b>แตะรูป</b> — ขอยืม 1 จากหลักทางซ้าย', [{ t: '5.42 − 1.68', f: on => e4dColS('5.42', '1.68', '−').s + (on ? r4vH((() => { const C = e4dColS('5.42', '1.68', '−'); return `<path d="M${a4n(C.X(1) - 10)} 94 L${a4n(C.X(1) + 10)} 78" stroke="${E4DC.o}" stroke-width="2.4"/><text x="${a4n(C.X(1))}" y="62" class="e4d-sm" text-anchor="middle" style="fill:${E4DC.o}">3</text><text x="${a4n(C.X(0))}" y="62" class="e4d-sm" text-anchor="middle" style="fill:${E4DC.o}">12</text>`; })()) : ''), s: '2 ลบ 8 ไม่ได้<br>กระจาย 1 → <b>12 − 8</b>' }]),
    r4dShow('5.42 − 1.68', { mk: 1 }), r4dShow('6.003 − 2.47 (กระจายผ่าน 0)', { mk: 1 }), T('<b>ลองปรับเอง</b> — กดลบทีละหลัก', 'ลองกดลบทีละหลัก', el => el.append(simE4Col([['6.003', '2.47', '−'], ['52.35', '27.8', '−'], ['40.5', '18.763', '−']]))),
    a4dTry(1450, () => { const [a, b] = e4pair('−', 3, true); return Q.e4Col({ a, b, op: '−' }); }, 'ลบมีกระจาย')],

  /* ด่าน 11 บวก ลบระคน: ทำจากซ้ายไปขวา */
  1451: (() => { const ex = '30 − 12.75 − 6.4', cw = 15.5, x0 = 70, tw = s => s.length * cw;
    return [
      e4dSee('ทำจากซ้ายไปขวา', '<b>แตะรูป</b> — ไม่มีวงเล็บ ทำคู่ซ้ายก่อน', [
        { t: '12.5 + 3.75 − 8.2', f: on => `<text x="${x0}" y="80" class="e4d-ex">12.5 + 3.75 − 8.2</text>` + (on ? r4vH(`<path d="M${x0} 92 H${x0 + tw('12.5 + 3.75')}" stroke="${E4DC.p}" stroke-width="3"/>` + `<text x="${x0}" y="140" class="e4d-ex" style="fill:${E4DC.p}">16.25 − 8.2 = 8.05</text>`) : ''), s: 'ทำ 12.5 + 3.75 ก่อน<br>แล้วนำผลไปทำต่อ' }]),
      r4dShow('30 − 12.75 − 6.4', { fig: `<text x="${x0}" y="70" class="e4d-ex">${ex}</text>`, q: `หาผลลัพธ์ ${ex}`,
        steps: [{ ink: `<path d="M${x0} 82 H${x0 + tw('30 − 12.75')}" fill="none" stroke="${E4DC.p}" stroke-width="3"/>`, n: 'ทำคู่ซ้ายก่อน', at: [x0 + tw('30 − 12.75') / 2, 96] },
          { ink: `<text x="${x0}" y="130" class="e4d-ex" style="fill:${E4DC.p}">17.25</text>`, w: '30 − 12.75 = 17.25', n: 'ตั้งลบให้จุดตรงกัน' },
          { ink: `<text x="${x0 + tw('17.25 ')}" y="130" class="e4d-ex">− 6.4</text><path d="M${x0} 142 H${x0 + tw('17.25 − 6.4')}" fill="none" stroke="${E4DC.b}" stroke-width="3"/>`, w: '17.25 − 6.4 = 10.85', n: 'นำผลมาทำต่อ' },
          { ink: `<text x="${x0}" y="190" class="e4d-ex" style="fill:${E4DC.p}">= 10.85</text>`, w: `${ex} = 10.85`, n: 'คำตอบ', ans: 1 }],
        dense: true, fin: 'บวก ลบระคน: ทำ<b>จากซ้ายไปขวา</b>ทีละคู่', say: 'บวกลบระคน ทำจากซ้ายไปขวาทีละคู่' }),
      a4dTry(1451, () => Q.e4Mix({ expr: e4three() }), 'บวก ลบระคน')]; })(),

  /* ด่าน 12 โจทย์ 1 ขั้นตอน: แผนภาพแท่ง → เลือกบวกหรือลบ */
  1452: (() => { const Bm = e4dBars([['ตัวแรก', 2.6, '#9FD0F0'], ['ตัวที่สอง', 1.85, '#FFD27A']], { y0: 70 });
    return [
      e4dSee('รวมหรือต่างกัน', '<b>แตะรูป</b> — ดูว่าโจทย์ถามอะไร', [
        { t: 'รวมกัน → บวก', f: on => e4dBars([['ผ้าแดง', 3.75, '#F7A8B8'], ['ผ้าฟ้า', 2.4, '#9FD0F0']], { y0: 60 }).s + (on ? r4vH(r4dTx(180, 210, 'รวม = 3.75 + 2.4', E4DC.p, 'r4v-big')) : ''), s: 'รวม เพิ่ม ทั้งหมด<br>→ <b>บวก</b>' },
        { t: 'ต่างกัน → ลบ', f: on => Bm.s + (on ? r4vH(`<rect x="${a4n(Bm.x(1.85))}" y="${Bm.y(1)}" width="${a4n(Bm.x(2.6) - Bm.x(1.85))}" height="34" fill="none" stroke="${E4DC.p}" stroke-width="2.6" stroke-dasharray="5 4"/>` + r4dTx(180, 210, 'ต่าง = 2.6 − 1.85', E4DC.p, 'r4v-big')) : ''), s: 'เหลือ มากกว่ากี่ หนักกว่ากี่<br>→ <b>ลบ</b>' }]),
      r4dShow('ปลาตัวไหนหนักกว่า', { fig: Bm.s, q: 'ปลาตัวแรกหนัก 2.6 กก. ตัวที่สองหนัก 1.85 กก. ตัวแรกหนักกว่ากี่กิโลกรัม',
        steps: [{ ink: `<rect x="${a4n(Bm.x(1.85))}" y="${Bm.y(1)}" width="${a4n(Bm.x(2.6) - Bm.x(1.85))}" height="34" fill="${E4DC.p}" fill-opacity=".18" stroke="${E4DC.p}" stroke-width="2.6" stroke-dasharray="5 4"/>` + e4dT((Bm.x(1.85) + Bm.x(2.6)) / 2, Bm.y(1) + 24, '?', E4DC.p, 'r4d-big'), n: 'ส่วนที่หนักกว่า', at: [(Bm.x(1.85) + Bm.x(2.6)) / 2, Bm.y(1) + 50] },
          { w: '2.6 − 1.85 = □', n: 'หนักกว่ากี่ → ลบ' }, { w: '2.60 − 1.85 = 0.75', n: 'ตั้งลบ จุดตรงกัน' }, { w: 'ตอบ 0.75 กิโลกรัม', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'อ่านคำถาม → <b>เลือกบวกหรือลบ</b> → ตอบพร้อมหน่วย', say: 'อ่านคำถาม เลือกบวกหรือลบ แล้วตอบพร้อมหน่วย' }),
      a4dTry(1452, e4StGen1, 'โจทย์ปัญหาทศนิยม')]; })(),

  /* ด่าน 13 แสดงวิธีทำ 1 ขั้นตอน */
  1453: (() => { const C = e4dColS('9.5', '3.75', '−', { padShown: true });
    return [
      e4dSee('เขียนแสดงวิธีทำ', '<b>แตะรูป</b> — เขียน 3 ส่วน', [
        { t: 'แสดงวิธีทำ', f: on => `<rect x="40" y="20" width="280" height="200" rx="12" fill="#FFFDF6" stroke="#EDE6D2" stroke-width="2"/>` + (on ? r4vH(['① ประโยคสัญลักษณ์', '② วิธีทำ (ตั้งบวก/ลบ)', '③ ตอบ … หน่วย'].map((t, i) => r4dTx(64, 70 + i * 56, t, [E4DC.b, E4DC.o, E4DC.g][i], 'r4v-tx', 'start')).join('')) : r4dTx(180, 126, '?', E4DC.p, 'r4v-big')), s: 'ประโยคสัญลักษณ์ → วิธีทำ<br>→ <b>ตอบพร้อมหน่วย</b>' }]),
      r4dShow('แสดงวิธีทำ', { fig: C.s, q: 'น้ำแข็งหนัก 9.5 กก. ละลายไป 3.75 กก. เหลือน้ำแข็งกี่กิโลกรัม',
        steps: [{ w: 'ประโยคสัญลักษณ์ 9.5 − 3.75 = □', n: 'ละลายไป → ลบ' },
          { ink: (() => { const R = e4s(C.P.R, C.P.p); let s = ''; C.P.steps.forEach(st => { if (!st.auto) s += `<text x="${a4n(C.X(st.i))}" y="${C.Y.r}" class="e4d-dg" text-anchor="middle" style="fill:${E4DC.p}">${st.out}</text>`; Object.entries(st.cross).forEach(([j, v]) => { s += `<text x="${a4n(C.X(+j))}" y="${C.Y.mk}" class="e4d-sm" text-anchor="middle" style="fill:${E4DC.o}">${v}</text>`; }); }); return s + `<text x="${a4n(C.ptX)}" y="${C.Y.r}" class="e4d-dg" text-anchor="middle" style="fill:${E4DC.p}">.</text>`; })(), w: 'วิธีทำ 9.50 − 3.75 = 5.75', n: 'ตั้งลบ จุดตรงกัน' },
          { w: 'ตอบ 5.75 กิโลกรัม', n: 'อย่าลืมหน่วย', ans: 1 }],
        dense: true, fin: 'ประโยคสัญลักษณ์ → วิธีทำ → <b>ตอบพร้อมหน่วย</b>', say: 'เขียนประโยคสัญลักษณ์ วิธีทำ แล้วตอบพร้อมหน่วย' }),
      a4dTry(1453, () => e4SeqGen(pick(E4_ST1)), 'เรียงวิธีทำ'),
      a4dTry(1453, () => e4Story(pick(E4_ST1)), 'โจทย์ปัญหา')]; })(),

  /* ด่าน 14 โจทย์ 2 ขั้นตอน */
  1454: (() => { const Bm = e4dBars([['มีอยู่', 5.5, '#FFD27A'], ['เติมแล้ว', 7.75, '#9FD0F0'], ['ใช้ไป', 4.6, '#F7A8B8']], { y0: 36 });
    return [
      e4dSee('โจทย์ 2 ขั้นตอน', '<b>แตะรูป</b> — แยกเป็น 2 ขั้น', [
        { t: 'ทีละขั้น', f: on => e4dT(180, 60, '200 − 35.50 − 24.75', E4DC.ink, 'r4v-big') + (on ? r4vH(r4dTx(180, 120, 'ขั้นที่ 1: 200 − 35.50 = 164.50', E4DC.b, 'r4v-tx') + r4dTx(180, 170, 'ขั้นที่ 2: 164.50 − 24.75 = 139.75', E4DC.o, 'r4v-tx')) : ''), s: 'ทำขั้นที่ 1 ก่อน<br>นำผลไปทำ<b>ขั้นที่ 2</b>' }]),
      r4dShow('ทรายเหลือเท่าไร', { fig: Bm.s, q: 'มีทราย 5.5 กก. เติมอีก 2.25 กก. ใช้ไป 4.6 กก. เหลือทรายกี่กิโลกรัม',
        steps: [{ ink: `<rect x="${a4n(Bm.x(5.5))}" y="${Bm.y(1)}" width="${a4n(Bm.x(7.75) - Bm.x(5.5))}" height="34" fill="none" stroke="${E4DC.b}" stroke-width="2.6" stroke-dasharray="5 4"/>`, w: 'ขั้นที่ 1: 5.5 + 2.25 = 7.75', n: 'เติม → บวก' },
          { ink: `<rect x="${a4n(Bm.x(4.6))}" y="${Bm.y(2)}" width="${a4n(Bm.x(7.75) - Bm.x(4.6))}" height="34" fill="${E4DC.p}" fill-opacity=".15" stroke="${E4DC.p}" stroke-width="2.6" stroke-dasharray="5 4"/>` + e4dT((Bm.x(4.6) + Bm.x(7.75)) / 2, Bm.y(2) + 24, '?', E4DC.p, 'r4d-big'), w: 'ขั้นที่ 2: 7.75 − 4.6 = 3.15', n: 'ใช้ไป → ลบ' },
          { w: 'ตอบ 3.15 กิโลกรัม', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'โจทย์ 2 ขั้นตอน: ทำ<b>ทีละขั้น</b> นำผลขั้นที่ 1 ไปใช้', say: 'โจทย์สองขั้นตอน ทำทีละขั้น นำผลขั้นที่หนึ่งไปใช้ต่อ' }),
      a4dTry(1454, e4StGen2, 'โจทย์ 2 ขั้นตอน')]; })(),

  /* ด่าน 15 แสดงวิธีทำ 2 ขั้นตอน */
  1455: [
    e4dSee('แสดงวิธีทำ 2 ขั้นตอน', '<b>แตะรูป</b> — เขียน 4 บรรทัด', [
      { t: 'แสดงวิธีทำ', f: on => `<rect x="30" y="16" width="300" height="208" rx="12" fill="#FFFDF6" stroke="#EDE6D2" stroke-width="2"/>` + (on ? r4vH(['① ประโยคสัญลักษณ์', '② ขั้นที่ 1', '③ ขั้นที่ 2', '④ ตอบ … หน่วย'].map((t, i) => r4dTx(54, 58 + i * 46, t, [E4DC.b, E4DC.o, E4DC.o, E4DC.g][i], 'r4v-tx', 'start')).join('')) : r4dTx(180, 126, '?', E4DC.p, 'r4v-big')), s: 'ประโยคสัญลักษณ์ → ขั้นที่ 1<br>→ ขั้นที่ 2 → <b>ตอบ</b>' }]),
    r4dShow('แสดงวิธีทำ 2 ขั้นตอน', { fig: e4dBars([['แป้ง', 4.5, '#FFD27A'], ['ซื้อเพิ่ม', 1.75, '#9FD0F0'], ['ใช้ไป', 3.125, '#F7A8B8']], { y0: 36 }).s, q: 'แป้ง 4.5 กก. ซื้อเพิ่ม 1.75 กก. ใช้ไป 3.125 กก. เหลือแป้งกี่กิโลกรัม',
      steps: [{ w: '4.5 + 1.75 − 3.125 = □', n: 'ประโยคสัญลักษณ์' }, { w: 'ขั้นที่ 1: 4.5 + 1.75 = 6.25', n: 'ซื้อเพิ่ม → บวก' }, { w: 'ขั้นที่ 2: 6.25 − 3.125 = 3.125', n: 'ใช้ไป → ลบ' }, { w: 'ตอบ 3.125 กิโลกรัม', n: 'ตอบพร้อมหน่วย', ans: 1 }],
      dense: true, fin: 'เขียนครบ <b>4 บรรทัด</b>', say: 'เขียนครบสี่บรรทัด' }),
    a4dTry(1455, () => e4SeqGen2(pick(E4_ST2)), 'เรียงวิธีทำ 2 ขั้นตอน'),
    a4dTry(1455, () => e4Story(pick(E4_ST2)), 'โจทย์ปัญหา 2 ขั้นตอน')]
};
/* column-sum worked examples are built when shown (r4dShow placeholder { mk }) */
const E4D_COL = { 1446: [['23.41', '15.36', '+']], 1447: [['32.09', '78.74', '+']], 1448: [['24.81', '35.114', '+']], 1449: [['88.465', '74.23', '−']], 1450: [['5.42', '1.68', '−'], ['6.003', '2.47', '−']] };
Object.keys(E4D_COL).forEach(id => { let k = 0; E4D_TEACH[id] = E4D_TEACH[id].map(pg => { if (!/ทำให้ดู/.test(pg.t) || !/\d/.test(pg.t)) return pg; const [a, b, op] = E4D_COL[id][k++]; return T(`<b>ทำให้ดู</b> — ${fmtDec(a)} ${op} ${fmtDec(b)}`, `ทำให้ดู ${fmtDec(a)} ${op === '+' ? 'บวก' : 'ลบ'} ${fmtDec(b)}`, el => el.append(e4dColDo(a, b, op))); }); });

/* =========================================================
   games of lessons 1–5: 10 questions in the order the ideas are taught
   ========================================================= */
const E4D_GAME = {
  1441: () => [...[1, 2, 3, 4].map(d => e4dD(Q.e4Pic({ n: d < 3 ? rnd(1, 9) : e4pic10(), unit: 10 }), d, 'p' + d)), ...[5, 6, 7].map(d => e4dD(Q.e4Frac({ s: e4nz(0, d < 6 ? 1 : 30, 1) }), d, 'f' + d)), e4dD(Q.e4Read({ s: e4nz(1, 9, 1), to: 'word' }), 8, 'r8'), e4dD(Q.e4Read({ s: e4nz(10, 99, 1), to: 'num' }), 9, 'r9'), e4dD(Q.e4Read({ s: e4nz(1, 99, 1), to: pick(['word', 'num']) }), 10, 'r10')],
  1442: () => [...[1, 2, 3, 4].map(d => e4dD(Q.e4Pic({ n: d < 3 ? rnd(11, 99) : e4pic100(), unit: 100 }), d, 'p' + d)), ...[5, 6, 7].map(d => e4dD(Q.e4Frac({ s: e4nz(0, d < 6 ? 1 : 99, 2) }), d, 'f' + d)), e4dD(Q.e4Read({ s: e4nz(1, 9, 2), to: 'word' }), 8, 'r8'), e4dD(Q.e4Read({ s: e4nz(10, 99, 2), to: 'num' }), 9, 'r9'), e4dD(Q.e4Read({ s: e4nz(1, 99, 2), to: pick(['word', 'num']) }), 10, 'r10')],
  1443: () => [...[1, 2, 3].map(d => e4dD(Q.e4Frac({ s: e4nz(0, d < 3 ? 9 : 99, 3) }), d, 'f' + d)), e4dD(Q.e4Read({ s: e4nz(1, 99, 3), to: 'word' }), 4, 'r4'), e4dD(Q.e4Read({ s: e4nz(1, 999, 3), to: 'num' }), 5, 'r5'), e4dD(Q.e4Read({ s: e4nz(1, 999, 3), to: pick(['word', 'num']) }), 6, 'r6'),
    ...[7, 8, 9, 10].map(d => e4dD(e4Eq(e4nz(1, 99, d < 9 ? 1 : 2)), d, 'e' + d))],
  1444: () => [...[1, 2, 3, 4, 5].map(d => e4dD((() => { const s = e4nz(10, 999, d < 3 ? 2 : 3), ds = s.replace('.', ''); let pos; do pos = rnd(0, ds.length - 1); while (ds[pos] === '0'); return Q.e4Place({ s, pos }); })(), d, 'p' + d)), ...[6, 7, 8, 9, 10].map(d => e4dD(Q.e4Exp({ s: e4nz(10, 999, d < 8 ? 2 : 3) }), d, 'x' + d))],
  1445: () => [...[1, 2, 3, 4, 5, 6].map(d => e4dD(e4Cmp(e4cmpPair()), d, 'c' + d)), e4dD(e4Sort(e4SortSet(), 'asc'), 7, 's7'), e4dD(e4Sort(e4SortSet(), 'desc'), 8, 's8'), e4dD(e4Sort(e4SortSet(), 'asc'), 9, 's9'), e4dD(e4Sort(e4SortSet(), 'desc'), 10, 's10')]
};
LESSONS_P4C7.forEach(L => { if (E4D_TEACH[L.id]) { L.teach = E4D_TEACH[L.id]; L.__pracDone = 1; } if (E4D_GAME[L.id]) { L.game = E4D_GAME[L.id]; L.gameN = 10; } });
