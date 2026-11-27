/* =========================================================
   ป.6 บทที่ 1 ห.ร.ม. และ ค.ร.น. (ภูเขา ห.ร.ม. ด่าน 701–714) — หน้าสอนและเกมเรียงใหม่ (v278 · ผู้ใช้ขอ) · prefix h6d
   ประเด็นละหน้า: ① ดูภาพ (กระดานครู d1dBoard ขึ้นทีละขั้น รอแตะ/Space: จุดเรียงแถว ตะแกรง แผนภาพต้นไม้ วงกลมซ้อน
   ตั้งหารสั้น กบกระโดด ริบบิ้น รถกระเช้า กระเบื้อง) → ลงมือเอง (แตะแยกกิ่ง แตะจำนวนเฉพาะตั้งหาร แตะเลือก ห.ร.ม./ค.ร.น.
   และแตะชิปเลือกจำนวน แทนปุ่ม + −) → ② ทำให้ดู (ดินสอเขียนทีละขั้น r4dShow + โน้ตข้าง ๆ) → ③ ลองทำ (ข้อแบบเดียวกับเกม ตัวเลขใหม่)
   ตัดการ์ด "รู้จัก" (lrnBoard) ตัวอย่างตัวหนังสือ (dcWalk dcStory picWalk) และหน้ากดปุ่มทีละขั้น/ปุ่ม + −
   (simSieve simShortDiv simVenn simAlign simHops simRel simRect simCut simTiles)
   เกมเรียงตามประเด็น ง่าย → ยาก (h6dOrd) · ไฟล์นี้วางหลัง app/xtra.js (XG/XA ของด่าน 704 707 711 712 714 ต้องเสร็จก่อน)
   ========================================================= */
const H6C = { ink: '#2B2550', p: '#E5487A', b: '#2F7BC0', g: '#1B8862', o: '#EC7F1E', v: '#7C5CE0', fade: '#B7AED3', y: '#FFE7A8', sky: '#DCEBFA', m: '#FDE2EA', bad: '#D9534F', mint: '#DDF5EA' };
const h6dT = (x, y, t, col = H6C.ink, cls = 'r4d-tx', anc = 'middle') => r4dTx(x, y, t, col, cls, anc);
const h6dB = (title, beats, fin, o = {}) => d1dBoard(title, { W: o.W || 400, H: o.H || 240, fig: o.fig || '', beats, fin });
const h6dTry = (id, mk, title) => g5dTry(id, mk, title);
const h6dDot = (x, y, col = H6C.b, r = 8) => `<circle cx="${a4n(x)}" cy="${a4n(y)}" r="${r}" fill="${col}" stroke="#fff" stroke-width="2"/>`;
const h6dDots = (x0, y0, rows, cols, g = 24, col = H6C.b, r = 8) => { let s = ''; for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) s += h6dDot(x0 + j * g, y0 + i * g, col, r); return s; };
const h6dX = (x, y, r = 13, col = H6C.p) => `<path d="M${a4n(x - r)} ${a4n(y - r)} L${a4n(x + r)} ${a4n(y + r)} M${a4n(x + r)} ${a4n(y - r)} L${a4n(x - r)} ${a4n(y + r)}" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;
const h6dO = (x, y, r = 16, col = H6C.g) => `<circle cx="${a4n(x)}" cy="${a4n(y)}" r="${r}" fill="none" stroke="${col}" stroke-width="2.6"/>`;
const h6dChipS = (x, y, t, fill = '#fff', col = H6C.ink, w = 38) => `<rect x="${a4n(x - w / 2)}" y="${a4n(y - 17)}" width="${w}" height="30" rx="9" fill="${fill}" stroke="${H6C.fade}" stroke-width="1.4"/>` + h6dT(x, y + 5, t, col, 'r4d-tx');
const h6dArc = (x1, x2, y, hgt, col = H6C.b) => `<path d="M${a4n(x1)} ${y} Q${a4n((x1 + x2) / 2)} ${a4n(y - hgt * 2)} ${a4n(x2)} ${y}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;
/* the hands-on pages already in the lesson (tap to split a tree, tap a prime to divide, tap ห.ร.ม./ค.ร.น.) — kept, renamed "ลงมือเอง" */
const h6dHands = (L, re) => (L.__old || []).filter(s => re.test(String(s.v))).map(s => ({ ...s, t: `<b>ลงมือเอง</b> — ${String(s.t).replace(/^(ลองเอง|อีกวิธี|ตัวอย่างทีละขั้น):\s*/, '')}`, s: `ลงมือเอง ${r4dTxt(s.t)}` }));
const h6dOld = (title, f) => T(`<b>ลงมือเอง</b> — ${title}`, `ลงมือเอง ${r4dTxt(title)}`, f);
/* a hands-on picture driven by a row of number chips (instead of + − buttons): draw(v) → { s, H, note, ok, done } */
function h6dChip(cap, vals, draw, o = {}) {
  const pic = h('div', { class: 'h6d-pic' }), out = fNote(), row = h('div', { class: 'h6d-chips ia' }); let done = false;
  const paint = r => { pic.innerHTML = `<svg viewBox="0 0 400 ${r.H || 200}" class="r4d-svg" aria-hidden="true">${r.s}</svg>`; out.innerHTML = r.note || ''; };
  const pick = v => { row.querySelectorAll('.h6-chip').forEach(b => b.classList.toggle('on', +b.dataset.v === v)); const r = draw(v); paint(r); if (r.ok) sfx.ok(); else sfx.no(); if (r.done && !done) { done = true; teachDone(pic); } };
  vals.forEach(v => row.append(h('button', { class: 'h6-chip', 'data-v': v, onclick: e => { e.stopPropagation(); pick(v); } }, o.lab ? o.lab(v) : String(v))));
  paint(draw(null)); return h('div', { class: 'colstack h6d-hand' }, h6wait(), h('div', { class: 'cap', html: cap }), pic, row, out); }
/* short division as on paper: divisor at the left, a line under each row · in ค.ร.น. the numbers that are not divided come down (orange) */
function h6dLad(nums, divs, o = {}) {
  const n = nums.length, cw = o.cw || 58, cx = o.cx || 210, x0 = cx - (n - 1) * cw / 2, X = i => x0 + i * cw, dx = x0 - cw / 2 - 18, y0 = o.y0 || 44, rh = o.rh || 36, Y = k => y0 + k * rh, cls = o.cls || 'r4d-big';
  const rows = [nums.slice()]; divs.forEach(p => { const r = rows[rows.length - 1]; rows.push(r.map(v => v % p ? v : v / p)); });
  const num = k => rows[k].map((v, i) => h6dT(X(i), Y(k) + 8, fmt(v), k && rows[k - 1][i] % divs[k - 1] ? H6C.o : H6C.ink, cls)).join('');
  const bar = k => h6dT(dx, Y(k) + 8, String(divs[k]), H6C.p, cls) + `<path d="M${a4n(dx + 15)} ${Y(k) - 16} V${Y(k) + 14} H${a4n(X(n - 1) + cw / 2 - 6)}" fill="none" stroke="${H6C.ink}" stroke-width="2"/>`;
  const ring = () => `<rect x="${a4n(dx - 15)}" y="${Y(0) - 18}" width="30" height="${(divs.length - 1) * rh + 34}" rx="13" fill="none" stroke="${H6C.g}" stroke-width="2.8"/>`;
  const ell = () => `<path d="M${a4n(dx - 16)} ${Y(0) - 18} V${Y(divs.length) + 18} H${a4n(X(n - 1) + cw / 2)} V${Y(divs.length) - 16} H${a4n(dx + 16)} V${Y(0) - 18} Z" fill="none" stroke="${H6C.g}" stroke-width="2.8" stroke-linejoin="round"/>`;
  return { rows, num, bar, ring, ell, X, Y, dx, k: divs.length }; }
/* prime factors written side by side, the same primes in the same column (as on paper) */
function h6dAl(rows, o = {}) {
  const cols = []; [...new Set(rows.flatMap(r => r[1]))].sort((a, b) => a - b).forEach(p => { const m = Math.max(...rows.map(r => r[1].filter(x => x === p).length)); for (let j = 0; j < m; j++) cols.push(p); });
  const cw = o.cw || 50, x0 = o.x0 || 140, X = c => x0 + c * cw, y0 = o.y0 || 56, rh = o.rh || 46, Y = k => y0 + k * rh;
  const has = (k, c) => { const p = cols[c], j = cols.slice(0, c).filter(x => x === p).length; return rows[k][1].filter(x => x === p).length > j; };
  const row = k => { const cs = cols.map((_, c) => c).filter(c => has(k, c)); let s = h6dT(x0 - 26, Y(k) + 8, `${fmt(rows[k][0])} =`, H6C.ink, 'r4d-big', 'end'); cs.forEach((c, i) => { s += h6dT(X(c), Y(k) + 8, String(cols[c]), H6C.ink, 'r4d-big'); if (i) s += h6dT(X(cs[i - 1]) + cw / 2, Y(k) + 7, '×', '#8E86B0', 'r4d-tx'); }); /* × อยู่ถัดจากตัวซ้าย ไม่ถูกวงทับ */ return s; };
  const loop = (c, col = H6C.g) => `<rect x="${a4n(X(c) - 18)}" y="${Y(0) - 20}" width="36" height="${(rows.length - 1) * rh + 40}" rx="17" fill="none" stroke="${col}" stroke-width="2.8"/>`;
  const all = c => rows.every((_, k) => has(k, c));
  return { cols, X, Y, has, row, loop, all, n: rows.length }; }
/* rows of numbers lined up by value (factors or multiples): the same number in the same column */
function h6dCols(rows, o = {}) {
  const vals = [...new Set(rows.flatMap(r => r[1]))].sort((a, b) => a - b), x0 = o.x0 || 78, x1 = o.x1 || 382, cw = (x1 - x0) / Math.max(1, vals.length - 1), X = v => x0 + vals.indexOf(v) * cw, y0 = o.y0 || 50, rh = o.rh || 44, Y = k => y0 + k * rh;
  const row = k => h6dT(o.lx || 36, Y(k) + 6, String(rows[k][0]), H6C.p, 'r4d-tx') + rows[k][1].map(v => h6dT(X(v), Y(k) + 6, String(v), H6C.ink, 'r4d-sm')).join('');
  const col = (v, c = H6C.g) => `<rect x="${a4n(X(v) - Math.min(14, cw / 2 - 1))}" y="${Y(0) - 16}" width="${a4n(Math.min(28, cw - 2))}" height="${(rows.length - 1) * rh + 30}" rx="10" fill="none" stroke="${c}" stroke-width="2.6"/>`;
  return { vals, X, Y, row, col, all: v => rows.every(r => r[1].includes(v)) }; }
/* factor tree, one branch-pair at a time (preorder): t = [v, left, right], a leaf is a number */
function h6dTree(t, o = {}) {
  const y0 = o.y0 || 34, dy = o.dy || 54, ex = [], val = nd => Array.isArray(nd) ? nd[0] : nd;
  const nT = (v, x, y) => h6dT(x, y + 8, fmt(v), h6prime(v) ? H6C.g : H6C.ink, 'r4d-big') + (h6prime(v) ? h6dO(x, y, v > 9 ? 19 : 16) : '');
  const go = (nd, x, sp, d) => { if (!Array.isArray(nd)) return; const y = y0 + d * dy; let s = '';
    [[nd[1], x - sp], [nd[2], x + sp]].forEach(([c, xc]) => { s += `<path d="M${a4n(x + (xc - x) * .2)} ${y + 15} L${a4n(xc - (xc - x) * .12)} ${y + dy - 19}" stroke="#9C93C4" stroke-width="2.4" stroke-linecap="round"/>` + nT(val(c), xc, y + dy); });
    ex.push({ v: nd[0], a: val(nd[1]), b: val(nd[2]), s }); go(nd[1], x - sp, sp / 2, d + 1); go(nd[2], x + sp, sp / 2, d + 1); };
  const x = o.x || 200; go(t, x, o.sp || 70, 0); return { root: nT(val(t), x, y0), ex }; }
/* game order: ranks from the prompt (a list of patterns, or a function) · same rank → fewer numbers, smaller numbers first · __diff is absolute (gameSet mixes several L.game() calls) */
const h6dTx = q => String(q.prompt || '').replace(/<[^>]+>/g, '');
const h6dOrd = (L, rk) => { const f = L.game, R = typeof rk === 'function' ? rk : t => { const i = rk.findIndex(re => re.test(t)); return i < 0 ? rk.length : i; };
  L.game = () => f().map((q, i) => { const t = h6dTx(q), ns = (t.replace(/\d+\.\d+\s*น\./g, ' ').match(/\d+/g) || []).map(Number); return { q, r: R(t), c: ns.length, b: Math.max(0, ...ns), i }; })
    .sort((a, b) => a.r - b.r || a.c - b.c || a.b - b.b || a.i - b.i).map((x, j) => Object.assign(x.q, { __diff: x.r * 1e4 + x.c * 1e3 + Math.min(x.b, 999) + j / 100, __tier: 0 }, /\d/.test(h6dTx(x.q)) && !x.q.__dup ? { __dup: 'h6d ' + h6dTx(x.q) } : {})); }; /* โจทย์เดียวกัน (ตัวเลขเดียวกัน) ไม่ซ้ำในเกม แม้ตัวเลือกสุ่มต่างกัน */
/* question makers for the "ลองทำ" pages (same kinds as the game, new numbers) */
const h6dPFPick = n => { const F = h6pf(n), a = h6x(F), b = h6x([F[0] * F[1], ...F.slice(2)].sort((x, y) => x - y)), c = h6x(n % 2 ? [3, n / 3] : [2, n / 2]);
  return Q.dPick({ q: `ข้อใดเป็น<b>การแยกตัวประกอบ</b>ของ ${n}`, opts: shuffle([...new Set([a, b, c])]), right: a, hint: 'ต้องเป็นผลคูณของ<b>จำนวนเฉพาะ</b>ทุกตัว' }); };
const h6dCommon = (A, B) => { const b = B.slice(); return A.filter(p => { const i = b.indexOf(p); if (i < 0) return false; b.splice(i, 1); return true; }); };
const h6dUnion = (A, B) => { const b = B.slice(); A.forEach(p => { const i = b.indexOf(p); if (i >= 0) b.splice(i, 1); }); return [...A, ...b].sort((x, y) => x - y); };
const h6dPFOpt = (x, y, mode) => { const A = h6pf(x), B = h6pf(y), C = h6dCommon(A, B), U = h6dUnion(A, B), M = mode === 'hcf' ? 'ห.ร.ม.' : 'ค.ร.น.', right = h6x(mode === 'hcf' ? C : U);
  const wr = mode === 'hcf' ? [h6x(U), h6x(C.length > 1 ? C.slice(1) : [...C, C[0]])] : [h6x(C), h6x([...A, ...B].sort((p, q) => p - q))];
  return Q.dPick({ q: `${x} = ${h6x(A)} และ ${y} = ${h6x(B)} ${M} ตรงกับข้อใด`, opts: shuffle([...new Set([right, ...wr])]), right, hint: mode === 'hcf' ? 'เลือกตัวที่<b>มีในทั้งสองจำนวน</b> ตัวละครั้ง' : 'เลือก<b>ทุกตัว</b> ตัวที่ตรงกันใช้ครั้งเดียว' }); };
const h6dRem = (a, b, r) => Q.hNum({ q: `จำนวนนับที่<b>น้อยที่สุด</b> ซึ่งหารด้วย ${a} และ ${b} แล้วเหลือเศษ ${r} ทุกครั้ง คือจำนวนใด`, head: '<span class="fsign">?</span>', a: h6lcm([a, b]) + r, hint: `ค.ร.น. ของ ${a} และ ${b} = ${h6lcm([a, b])} แล้วบวกเศษ ${r}` });

const H6D_TEACH = {
  /* ด่าน 1 ตัวประกอบ */
  701: L => [
    h6dB('จัด 12 จุดเป็นแถวเท่า ๆ กัน', [
      [h6dDots(98, 50, 1, 12) + h6dT(48, 56, '1 × 12', H6C.p, 'r4d-tx'), '12 จุด เรียงเป็น <b>1 แถว แถวละ 12</b> จุด'],
      [h6dDots(64, 104, 2, 6) + h6dT(124, 176, '2 × 6', H6C.p, 'r4d-tx'), 'จัดเป็น <b>2 แถว แถวละ 6</b> จุด ได้พอดี'],
      [h6dDots(262, 96, 3, 4, 24, H6C.o) + h6dT(298, 176, '3 × 4', H6C.p, 'r4d-tx'), 'จัดเป็น <b>3 แถว แถวละ 4</b> จุด ได้พอดี'],
      [h6dT(200, 220, 'ตัวประกอบของ 12: 1, 2, 3, 4, 6, 12', H6C.g, 'r4d-tx'), 'จำนวนแถวและจำนวนต่อแถว คือ<b>ตัวประกอบของ 12</b>']],
      'ตัวประกอบของ 12 คือ 1, 2, 3, 4, 6 และ 12 ทุกตัวหาร 12 ได้ลงตัว'),
    h6dB('หารไม่ลงตัว ไม่ใช่ตัวประกอบ', [
      [h6dDots(140, 64, 2, 5, 30, H6C.b, 10) + h6dT(200, 34, 'แถวละ 5', H6C.b, 'r4d-tx'), 'จัด 12 จุด <b>แถวละ 5</b> จุด ได้ 2 แถวเต็ม'],
      [h6dDots(140, 124, 1, 2, 30, H6C.bad, 10) + [200, 230, 260].map(x => `<circle cx="${x}" cy="124" r="10" fill="none" stroke="${H6C.fade}" stroke-width="2" stroke-dasharray="4 3"/>`).join(''), 'เหลืออีก <b>2 จุด</b> ไม่ครบแถว'],
      [h6dT(200, 184, '12 ÷ 5 = 2 เศษ 2', H6C.bad, 'r4d-big') + h6dT(200, 220, '5 ไม่ใช่ตัวประกอบของ 12', H6C.bad, 'r4d-tx'), 'หารไม่ลงตัว → <b>5 ไม่ใช่ตัวประกอบ</b>ของ 12']],
      'ตัวประกอบของจำนวนใด ต้อง<b>หารจำนวนนั้นได้ลงตัว</b>'),
    h6dOld('แตะเลือกจำนวนจุดต่อแถว จัด 18 จุดให้เป็นแถวเท่า ๆ กัน', el => { const n = 18, found = new Set();
      el.append(h6dChip('จัด <b>18 จุด</b> แถวละกี่จุด จึงได้พอดี — แตะเลือกจำนวน', [2, 3, 4, 5, 6, 7, 8, 9], c => {
        if (c == null) return { s: h6dDots(30, 100, 1, 18, 20, H6C.b, 7), H: 200, note: 'แตะจำนวนจุดต่อแถวด้านล่าง' };
        const full = Math.floor(n / c), rem = n % c, g = Math.min(34, 180 / Math.max(full + (rem ? 1 : 0), 1)), x0 = 200 - (c - 1) * g / 2, y0 = 24;
        let s = h6dDots(x0, y0, full, c, g, H6C.b, Math.min(9, g * .34)) + (rem ? h6dDots(x0, y0 + full * g, 1, rem, g, H6C.bad, Math.min(9, g * .34)) : '');
        if (!rem) { found.add(c); found.add(n / c); }
        const fs = [...found].sort((a, b) => a - b), all = [2, 3, 6, 9].every(x => found.has(x));
        return { s, H: 200, ok: !rem, done: all, note: rem ? `แถวละ ${c} ได้ ${full} แถว <b>เหลือ ${rem}</b> → ${c} ไม่ใช่ตัวประกอบของ 18` : `${full} แถว แถวละ ${c} พอดี → ${c} และ ${full} เป็นตัวประกอบ${all ? ' ครบแล้ว! ตัวประกอบของ 18 คือ 1, 2, 3, 6, 9, 18' : ` (พบแล้ว ${fs.join(', ')})`}` }; })); }),
    r4dShow('หาตัวประกอบของ 20 โดยการหาร', { W: 400, H: 240, q: 'หาตัวประกอบทั้งหมดของ 20', fig: h6dT(200, 30, 'ตัวประกอบของ 20', H6C.fade, 'r4d-tx'),
      steps: (() => { const X = v => ({ 1: 50, 2: 110, 4: 170, 5: 230, 10: 290, 20: 350 })[v], y = 206, num = v => h6dT(X(v), y + 8, String(v), H6C.ink, 'r4d-big'), arc = (a, b, c) => h6dArc(X(a), X(b), y - 16, (X(b) - X(a)) * .26, c);
        return [{ ink: num(1) + num(20) + arc(1, 20, H6C.b), w: '20 ÷ 1 = 20', n: 'หารลงตัว ได้คู่ 1 กับ 20' }, { ink: num(2) + num(10) + arc(2, 10, H6C.o), w: '20 ÷ 2 = 10', n: 'ได้คู่ 2 กับ 10' },
          { ink: h6dT(200, 70, '20 ÷ 3 เหลือเศษ 2 ✗', H6C.bad, 'r4d-tx'), w: '20 ÷ 3 = 6 เศษ 2', n: 'หารไม่ลงตัว 3 ไม่ใช่ตัวประกอบ' }, { ink: num(4) + num(5) + arc(4, 5, H6C.p), w: '20 ÷ 4 = 5', n: 'ได้คู่ 4 กับ 5 ถัดไป 20 ÷ 5 ซ้ำคู่เดิม จึงหยุด' },
          { ink: `<rect x="24" y="${y - 18}" width="352" height="36" rx="12" fill="none" stroke="${H6C.g}" stroke-width="2.6"/>`, w: 'ได้ 1, 2, 4, 5, 10, 20', n: 'ตัวประกอบของ 20 มี 6 ตัว', ans: 1 }]; })(),
      fin: 'หารทีละจำนวน 1, 2, 3, … ได้ลงตัวเมื่อไร ได้ตัวประกอบ<b>เป็นคู่</b> หยุดเมื่อคู่เริ่มซ้ำ', say: 'หารทีละจำนวน ได้ลงตัวเมื่อไร ได้ตัวประกอบเป็นคู่ หยุดเมื่อคู่เริ่มซ้ำ' }),
    h6dTry(701, () => Q.hFac({ n: pick([18, 28, 30, 40, 42]) }), 'แตะเลือกตัวประกอบทั้งหมด'),
    h6dTry(701, () => { const [n, r, w] = pick([[36, '9', ['8', '10']], [54, '6', ['4', '8']], [60, '15', ['8', '25']], [42, '7', ['4', '8']]]); return Q.dPick({ q: `จำนวนใดเป็นตัวประกอบของ ${n}`, opts: shuffle([r, ...w]), right: r, hint: `ลองหาร ${n} ด้วยแต่ละจำนวน` }); }, 'จำนวนใดเป็นตัวประกอบ')],

  /* ด่าน 2 จำนวนเฉพาะ ตัวประกอบเฉพาะ */
  702: L => { const SX = i => 47 + (i % 10) * 34, SY = i => 58 + Math.floor(i / 10) * 50, XS = ns => ns.map(v => h6dX(SX(v - 1), SY(v - 1) - 6, 12, H6C.p)).join(''), OS = ns => ns.map(v => h6dO(SX(v - 1), SY(v - 1) - 6, 15)).join('');
    const F30 = [1, 2, 3, 5, 6, 10, 15, 30], F42 = [1, 2, 3, 6, 7, 14, 21, 42], FX_ = i => 39 + i * 46;
    return [
      h6dB('จำนวนเฉพาะ มีตัวประกอบ 2 ตัว', [
        [h6dDots(122, 54, 1, 7, 26, H6C.b, 9) + h6dT(56, 60, '7', H6C.p, 'r4d-big') + h6dT(200, 96, 'จัดได้แบบเดียว ตัวประกอบ 1, 7', H6C.b, 'r4d-sm'), 'จัด 7 จุดเป็นแถวเท่า ๆ กัน ได้<b>แบบเดียว</b> คือ 1 แถว แถวละ 7'],
        [h6dDots(161, 126, 2, 4, 26, H6C.o, 9) + h6dT(56, 146, '8', H6C.p, 'r4d-big') + h6dT(200, 192, 'จัดได้ 2 × 4 อีกแบบ ตัวประกอบ 1, 2, 4, 8', H6C.o, 'r4d-sm'), 'แต่ 8 จุด จัดเป็น <b>2 แถว แถวละ 4</b> ได้อีกแบบ'],
        [h6dT(200, 226, '7 เป็นจำนวนเฉพาะ   8 ไม่เป็น', H6C.g, 'r4d-tx'), '7 มีตัวประกอบ<b>เพียง 2 ตัว</b> คือ 1 กับตัวมันเอง จึงเป็น<b>จำนวนเฉพาะ</b>']],
        '1 มีตัวประกอบตัวเดียว จึงไม่ใช่จำนวนเฉพาะ และ 2 เป็นจำนวนเฉพาะที่เป็นจำนวนคู่เพียงตัวเดียว'),
      h6dB('ตะแกรงหาจำนวนเฉพาะ 1 ถึง 30', [
        [h6dX(SX(0), SY(0) - 6, 12, H6C.fade), '1 ไม่ใช่จำนวนเฉพาะ ขีดฆ่าออก'],
        [OS([2]) + XS([4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]), 'วง 2 ไว้ แล้วขีดฆ่า<b>พหุคูณของ 2</b> (4, 6, 8, …)'],
        [OS([3]) + XS([9, 15, 21, 27]), 'วง 3 แล้วขีดฆ่าพหุคูณของ 3 ที่ยังเหลือ (9, 15, 21, 27)'],
        [OS([5]) + XS([25]), 'วง 5 แล้วขีดฆ่า 25'],
        [OS([7, 11, 13, 17, 19, 23, 29]) + h6dT(200, 222, '2, 3, 5, 7, 11, 13, 17, 19, 23, 29', H6C.g, 'r4d-tx'), 'ตัวที่ไม่ถูกขีดฆ่า คือ<b>จำนวนเฉพาะ</b>']],
        'จำนวนเฉพาะที่ไม่เกิน 30 มีทั้งหมด 10 จำนวน', { fig: Array.from({ length: 30 }, (_, i) => `<rect x="${SX(i) - 16}" y="${SY(i) - 25}" width="32" height="38" rx="7" fill="#F7F4FF"/>` + h6dT(SX(i), SY(i), String(i + 1), H6C.ink, 'r4d-tx')).join('') }),
      h6dB('ตัวประกอบเฉพาะของ 30', [
        [F30.map((v, i) => h6dChipS(FX_(i), 84, String(v))).join(''), 'ตัวประกอบของ 30 มี 8 ตัว'],
        [[0, 4, 5, 6, 7].map(i => h6dX(FX_(i), 80, 13)).join('') + [[4, '2×3'], [5, '2×5'], [6, '3×5'], [7, '2×3×5']].map(([i, t]) => h6dT(FX_(i), 124, t, '#8E86B0', 'r4d-sm')).join(''), 'ตัดตัวที่<b>ไม่ใช่จำนวนเฉพาะ</b>ออก (1 และตัวที่แยกเป็นผลคูณได้)'],
        [[1, 2, 3].map(i => h6dO(FX_(i), 80, 20)).join('') + h6dT(200, 196, 'ตัวประกอบเฉพาะของ 30: 2, 3, 5', H6C.g, 'r4d-tx'), 'เหลือ 2, 3, 5 คือ<b>ตัวประกอบเฉพาะ</b>ของ 30']],
        'ตัวประกอบเฉพาะ คือ ตัวประกอบที่เป็นจำนวนเฉพาะ'),
      r4dShow('หาตัวประกอบเฉพาะของ 42', { W: 400, H: 200, q: 'หาตัวประกอบเฉพาะของ 42', fig: '',
        steps: [{ ink: F42.map((v, i) => h6dChipS(FX_(i), 70, String(v))).join(''), w: '1, 2, 3, 6, 7, 14, 21, 42', n: 'ตัวประกอบทั้งหมดของ 42' },
          { ink: [0, 3, 5, 6, 7].map(i => h6dX(FX_(i), 66, 13)).join(''), w: 'ตัด 1, 6, 14, 21, 42', n: 'ไม่ใช่จำนวนเฉพาะ' },
          { ink: [1, 2, 4].map(i => h6dO(FX_(i), 66, 20)).join('') + h6dT(200, 150, '2, 3, 7', H6C.g, 'r4d-big'), w: 'ตัวประกอบเฉพาะ: 2, 3, 7', n: 'เป็นจำนวนเฉพาะ', ans: 1 }],
        fin: 'หาตัวประกอบทั้งหมด แล้วเลือกเฉพาะตัวที่เป็น<b>จำนวนเฉพาะ</b>', say: 'หาตัวประกอบทั้งหมด แล้วเลือกเฉพาะตัวที่เป็นจำนวนเฉพาะ' }),
      h6dTry(702, () => Q.hPrime({ nums: pick([[31, 33, 35, 37, 39, 41, 43, 45], [20, 21, 23, 25, 27, 29, 31, 33], [41, 43, 45, 47, 49, 51, 53, 55]]) }), 'แตะเลือกจำนวนเฉพาะ'),
      h6dTry(702, () => Q.hPFs({ n: pick([60, 84, 90, 110]) }), 'แตะเลือกตัวประกอบเฉพาะ')]; },

  /* ด่าน 3 การแยกตัวประกอบ */
  703: L => { const A = h6dTree([60, [6, 2, 3], [10, 2, 5]], { sp: 66, dy: 58 }), B = h6dTree([60, [4, 2, 2], [15, 3, 5]], { sp: 66, dy: 58 }), D = h6dLad([60], [2, 2, 3], { cx: 214 });
    const T72 = h6dTree([72, [8, 2, [4, 2, 2]], [9, 3, 3]], { sp: 80, dy: 54 }), D90 = h6dLad([90], [2, 3, 3], { cx: 150 });
    return [
      h6dB('แผนภาพต้นไม้ของ 60', [[A.root, 'เริ่มที่ <b>60</b>'], [A.ex[0].s, '60 = 6 × 10'], [A.ex[1].s, '6 = 2 × 3 ทั้งคู่เป็นจำนวนเฉพาะ วงไว้'], [A.ex[2].s, '10 = 2 × 5'],
        [h6dT(200, 222, '60 = 2 × 2 × 3 × 5', H6C.g, 'r4d-big'), 'นำ<b>ปลายกิ่ง</b>ทุกกิ่งมาคูณกัน']],
        'แยกตัวประกอบ คือ เขียนจำนวนเป็น<b>ผลคูณของตัวประกอบเฉพาะ</b>'),
      h6dB('แยกแบบอื่น ได้ผลเหมือนเดิม', [[B.root + B.ex[0].s, 'ลองเริ่ม 60 = 4 × 15'], [B.ex[1].s, '4 = 2 × 2'], [B.ex[2].s, '15 = 3 × 5'],
        [h6dT(200, 222, '60 = 2 × 2 × 3 × 5 = 2² × 3 × 5', H6C.g, 'r4d-tx'), 'ได้ <b>2 × 2 × 3 × 5</b> เหมือนเดิม เขียนสั้น ๆ ได้ 2² × 3 × 5']],
        'จะแยกแบบใดก่อน ผลการแยกตัวประกอบก็เหมือนกันเสมอ'),
      h6dB('แยกตัวประกอบโดยการตั้งหารสั้น', [[D.num(0) + D.bar(0), '2 หาร 60 ลงตัว'], [D.num(1) + D.bar(1), '60 ÷ 2 = 30 แล้ว 2 หาร 30 ลงตัว'], [D.num(2) + D.bar(2), '30 ÷ 2 = 15 แล้ว 3 หาร 15 ลงตัว'],
        [D.num(3) + h6dT(300, 160, '← จำนวนเฉพาะ หยุด', H6C.o, 'r4d-sm'), '15 ÷ 3 = 5 ผลหารเป็น<b>จำนวนเฉพาะ</b> หยุดหาร'],
        [D.ring() + h6dO(D.X(0), D.Y(3), 17) + h6dT(200, 226, '60 = 2 × 2 × 3 × 5', H6C.g, 'r4d-big'), 'นำ<b>ตัวหารทุกตัว</b>คูณกับผลหารสุดท้าย']],
        'ตั้งหารด้วยจำนวนเฉพาะไปเรื่อย ๆ จนผลหารเป็นจำนวนเฉพาะ'),
      ...h6dHands(L, /simTree/),
      r4dShow('แยกตัวประกอบของ 72 ด้วยแผนภาพต้นไม้', { W: 400, H: 230, q: 'แยกตัวประกอบของ 72', fig: T72.root,
        steps: [{ ink: T72.ex[0].s, w: '72 = 8 × 9', n: 'เริ่มจากผลคูณที่รู้' }, { ink: T72.ex[1].s, w: '8 = 2 × 4', n: '2 เป็นจำนวนเฉพาะ วงไว้' }, { ink: T72.ex[2].s, w: '4 = 2 × 2', n: '' }, { ink: T72.ex[3].s, w: '9 = 3 × 3', n: '' },
          { ink: '', w: '72 = 2 × 2 × 2 × 3 × 3', n: 'หรือ 2³ × 3²', ans: 1 }],
        fin: 'แตกกิ่งจน<b>ปลายทุกกิ่งเป็นจำนวนเฉพาะ</b> แล้วนำมาคูณกัน', say: 'แตกกิ่งจนปลายทุกกิ่งเป็นจำนวนเฉพาะ แล้วนำมาคูณกัน' }),
      r4dShow('แยกตัวประกอบของ 90 โดยการตั้งหาร', { W: 300, H: 200, q: 'แยกตัวประกอบของ 90 โดยการตั้งหาร', fig: D90.num(0),
        steps: [{ ink: D90.bar(0) + D90.num(1), w: '90 ÷ 2 = 45', n: '2 หาร 90 ลงตัว' }, { ink: D90.bar(1) + D90.num(2), w: '45 ÷ 3 = 15', n: '2 หาร 45 ไม่ลงตัว ลอง 3' }, { ink: D90.bar(2) + D90.num(3), w: '15 ÷ 3 = 5', n: '5 เป็นจำนวนเฉพาะ หยุด' },
          { ink: D90.ring(), w: '90 = 2 × 3 × 3 × 5', n: 'ตัวหารทุกตัว × ผลหารสุดท้าย', ans: 1 }],
        fin: 'ตั้งหารด้วยจำนวนเฉพาะ<b>จากน้อยไปมาก</b> จนผลหารเป็นจำนวนเฉพาะ', say: 'ตั้งหารด้วยจำนวนเฉพาะจากน้อยไปมาก จนผลหารเป็นจำนวนเฉพาะ' }),
      h6dTry(703, () => Q.hPF({ n: pick(H6_PFR().filter(n => n >= 40 && n !== 60 && n !== 72 && n !== 90)) }), 'แยกตัวประกอบ'),
      h6dTry(703, () => h6dPFPick(pick([84, 126, 150, 132])), 'ข้อใดเป็นการแยกตัวประกอบ')]; },

  /* ด่าน 4 ห.ร.ม. โดยการหาตัวหารร่วม */
  704: L => { const V = `<circle cx="150" cy="128" r="88" fill="#FDE2EA" fill-opacity=".55" stroke="${H6C.p}" stroke-width="2.4"/><circle cx="250" cy="128" r="88" fill="#DCEBFA" fill-opacity=".55" stroke="${H6C.b}" stroke-width="2.4"/>`,
      col = (ns, x, y0, g, c) => ns.map((v, i) => h6dT(x, y0 + i * g, String(v), c, 'r4d-big')).join(''), G = h6dCols([[16, [1, 2, 4, 8, 16]], [24, [1, 2, 3, 4, 6, 8, 12, 24]], [40, [1, 2, 4, 5, 8, 10, 20, 40]]], { x0: 74, x1: 384, y0: 54 });
    return [
      h6dB('ตัวหารร่วมของ 12 และ 18', [[V + h6dT(104, 26, 'ตัวประกอบของ 12', H6C.p, 'r4d-sm') + h6dT(296, 26, 'ตัวประกอบของ 18', H6C.b, 'r4d-sm'), 'วงซ้าย: ตัวประกอบของ 12 วงขวา: ตัวประกอบของ 18'],
        [col([1, 2, 3, 6], 200, 82, 34, H6C.g), 'ตัวที่<b>หารทั้ง 12 และ 18 ลงตัว</b> อยู่ตรงกลาง: 1, 2, 3, 6'],
        [col([4, 12], 104, 118, 40, H6C.p) + col([9, 18], 296, 118, 40, H6C.b), 'ตัวที่เหลือ อยู่ในวงของตัวเอง'],
        [h6dO(200, 176, 19, H6C.o) + h6dT(200, 236, 'ห.ร.ม. ของ 12 และ 18 = 6', H6C.o, 'r4d-tx'), 'ตัวหารร่วมที่<b>มากที่สุด</b> คือ 6 จึงเป็น <b>ห.ร.ม.</b>']],
        'ห.ร.ม. ย่อมาจาก หารร่วมมาก คือ ตัวหารร่วมที่มากที่สุด', { H: 244 }),
      r4dShow('ห.ร.ม. ของ 16, 24 และ 40', { W: 400, H: 230, q: 'หา ห.ร.ม. ของ 16, 24 และ 40 โดยการหาตัวหารร่วม', fig: '',
        steps: [{ ink: G.row(0), w: '16: 1, 2, 4, 8, 16', n: 'ตัวประกอบของ 16' }, { ink: G.row(1), w: '24: 1, 2, 3, 4, 6, 8, 12, 24', n: 'เขียนตัวเดียวกันให้ตรงกัน' }, { ink: G.row(2), w: '40: 1, 2, 4, 5, 8, 10, 20, 40', n: '' },
          { ink: [1, 2, 4, 8].map(v => G.col(v)).join(''), w: 'ตัวหารร่วม: 1, 2, 4, 8', n: 'มีครบทั้งสามแถว' },
          { ink: G.col(8, H6C.o) + h6dT(200, 210, 'ห.ร.ม. = 8', H6C.o, 'r4d-big'), w: 'ห.ร.ม. = 8', n: 'ตัวหารร่วมที่มากที่สุด', ans: 1 }],
        fin: 'เขียนตัวประกอบของทุกจำนวน หาตัวที่มี<b>ครบทุกจำนวน</b> แล้วเลือกตัวที่มากที่สุด', say: 'เขียนตัวประกอบของทุกจำนวน หาตัวที่มีครบทุกจำนวน แล้วเลือกตัวที่มากที่สุด' }),
      h6dTry(704, () => Q.hCommon({ nums: pick([[8, 20], [15, 25], [12, 16], [14, 21]]) }), 'แตะเลือกตัวประกอบร่วม'),
      h6dTry(704, () => Q.hGcd({ nums: pick([[20, 36], [14, 21, 35], [27, 45], [24, 32]]), how: 'cd' }), 'หา ห.ร.ม.')]; },

  /* ด่าน 5 ห.ร.ม. โดยการแยกตัวประกอบ */
  705: L => { const A = h6dAl([[42, [2, 3, 7]], [56, [2, 2, 2, 7]]], { y0: 60, rh: 52 }), B = h6dAl([[36, [2, 2, 3, 3]], [60, [2, 2, 3, 5]]], { y0: 56, rh: 52 });
    return [
      h6dB('ห.ร.ม. ของ 42 และ 56', [[A.row(0), 'แยกตัวประกอบ 42 = 2 × 3 × 7'], [A.row(1), '56 = 2 × 2 × 2 × 7 เขียนตัวที่เหมือนกัน<b>ให้ตรงกัน</b>'],
        [A.loop(0) + A.loop(4), 'หลักที่มี<b>ทั้งสองจำนวน</b> คือ 2 และ 7'],
        [h6dT(200, 206, 'ห.ร.ม. = 2 × 7 = 14', H6C.g, 'r4d-big'), 'นำตัวประกอบร่วมมาคูณกัน ห.ร.ม. = <b>14</b>']],
        'ห.ร.ม. = ผลคูณของตัวประกอบเฉพาะที่<b>มีร่วมกันทุกจำนวน</b>'),
      r4dShow('ห.ร.ม. ของ 36 และ 60 โดยการแยกตัวประกอบ', { W: 400, H: 220, q: 'หา ห.ร.ม. ของ 36 และ 60 โดยการแยกตัวประกอบ', fig: '',
        steps: [{ ink: B.row(0), w: '36 = 2 × 2 × 3 × 3', n: 'แยกตัวประกอบ' }, { ink: B.row(1), w: '60 = 2 × 2 × 3 × 5', n: 'ตัวที่เหมือนกันตรงกัน' }, { ink: B.loop(0) + B.loop(1) + B.loop(2), w: 'ตัวที่มีร่วมกัน: 2, 2, 3', n: 'มีทั้งสองแถว' },
          { ink: h6dT(200, 200, '2 × 2 × 3 = 12', H6C.g, 'r4d-big'), w: 'ห.ร.ม. = 2 × 2 × 3 = 12', n: '', ans: 1 }],
        fin: 'คูณเฉพาะหลักที่มี<b>ครบทุกจำนวน</b>', say: 'คูณเฉพาะหลักที่มีครบทุกจำนวน' }),
      h6dTry(705, () => Q.hPFWork({ nums: pick([[24, 40], [30, 45], [28, 42], [20, 32]]), mode: 'hcf' }), 'หา ห.ร.ม. โดยการแยกตัวประกอบ'),
      h6dTry(705, () => { const [x, y] = pick([[24, 40], [30, 42], [28, 70], [45, 60]]); return h6dPFOpt(x, y, 'hcf'); }, 'ห.ร.ม. ตรงกับข้อใด')]; },

  /* ด่าน 6 ห.ร.ม. โดยการหาร */
  706: L => { const D = h6dLad([28, 42, 70], [2, 7], { y0: 46, rh: 40 }), E = h6dLad([48, 72], [2, 2, 2, 3], { cx: 170, y0: 34, rh: 34, cls: 'r4d-tx' });
    return [
      h6dB('ห.ร.ม. ของ 28, 42, 70 โดยการตั้งหาร', [[D.num(0) + D.bar(0), '2 หาร 28, 42, 70 ลงตัว<b>ทุกจำนวน</b>'], [D.num(1), 'เขียนผลหาร 14, 21, 35'], [D.bar(1) + D.num(2), '7 หาร 14, 21, 35 ลงตัว ได้ 2, 3, 5'],
        [h6dT(210, 172, 'ไม่มีตัวหารร่วมแล้ว หยุด', H6C.o, 'r4d-sm'), '2, 3, 5 ไม่มีจำนวนเฉพาะใดหารลงตัว<b>ทุกจำนวน</b> จึงหยุด'],
        [D.ring() + h6dT(200, 222, 'ห.ร.ม. = 2 × 7 = 14', H6C.g, 'r4d-big'), 'นำ<b>ตัวหารทางซ้าย</b>มาคูณกัน']],
        'ห.ร.ม. โดยการหาร = ผลคูณของตัวหารทางซ้ายทั้งหมด'),
      ...h6dHands(L, /simShortDivTry/),
      r4dShow('ห.ร.ม. ของ 48 และ 72 โดยการหาร', { W: 320, H: 220, q: 'หา ห.ร.ม. ของ 48 และ 72 โดยการตั้งหารสั้น', fig: E.num(0),
        steps: [{ ink: E.bar(0) + E.num(1), w: '÷ 2 ได้ 24, 36', n: '2 หารทั้งสองจำนวนลงตัว' }, { ink: E.bar(1) + E.num(2), w: '÷ 2 ได้ 12, 18', n: '' }, { ink: E.bar(2) + E.num(3), w: '÷ 2 ได้ 6, 9', n: '' }, { ink: E.bar(3) + E.num(4), w: '÷ 3 ได้ 2, 3', n: '2 กับ 3 ไม่มีตัวหารร่วม หยุด' },
          { ink: E.ring(), w: '2 × 2 × 2 × 3 = 24', n: 'ห.ร.ม. = คูณตัวหารทางซ้าย', ans: 1 }],
        fin: 'หารด้วยจำนวนเฉพาะที่หาร<b>ทุกจำนวน</b>ลงตัว จนหารร่วมกันไม่ได้', say: 'หารด้วยจำนวนเฉพาะที่หารทุกจำนวนลงตัว จนหารร่วมกันไม่ได้' }),
      h6dTry(706, () => Q.hLadder({ nums: pick([[18, 30], [20, 50], [16, 40], [36, 54]]), mode: 'hcf' }), 'หา ห.ร.ม. โดยการตั้งหารสั้น')]; },

  /* ด่าน 7 ค.ร.น. โดยการหาผลคูณร่วม */
  707: L => { const X = v => 34 + v * 11.1, yA = 92, yB = 184, line = y => `<path d="M${X(0) - 8} ${y} H${X(30) + 12}" stroke="${H6C.ink}" stroke-width="2.4"/>` + Array.from({ length: 31 }, (_, v) => `<path d="M${a4n(X(v))} ${y - 4} V${y + 4}" stroke="${H6C.ink}" stroke-width="1.4"/>`).join('');
    const hops = (s, y, col) => Array.from({ length: 30 / s }, (_, j) => h6dArc(X(j * s), X(j * s + s), y - 6, s * 3, col) + h6dDot(X(j * s + s), y, col, 6) + h6dT(X(j * s + s), y + 24, String(j * s + s), col, 'r4d-sm')).join('');
    const G = h6dCols([[3, [3, 6, 9, 12, 15, 18, 21, 24]], [4, [4, 8, 12, 16, 20, 24]], [6, [6, 12, 18, 24]]], { x0: 74, x1: 384, y0: 54 });
    return [
      h6dB('กบ 2 ตัว กระโดดทีละ 3 และทีละ 5', [[line(yA) + line(yB) + h6dT(X(0), yA + 24, '0', H6C.ink, 'r4d-sm') + h6dT(X(0), yB + 24, '0', H6C.ink, 'r4d-sm') + h6dT(30, 40, 'กบเขียว ทีละ 3', H6C.b, 'r4d-sm', 'start') + h6dT(30, 134, 'กบส้ม ทีละ 5', H6C.o, 'r4d-sm', 'start'), 'กบ 2 ตัวเริ่มที่ 0 ตัวหนึ่งกระโดดทีละ 3 อีกตัวทีละ 5'],
        [hops(3, yA, H6C.b), 'กบเขียวลงที่ 3, 6, 9, 12, 15, … คือ<b>พหุคูณของ 3</b>'], [hops(5, yB, H6C.o), 'กบส้มลงที่ 5, 10, 15, 20, … คือ<b>พหุคูณของ 5</b>'],
        [[15, 30].map(v => `<path d="M${a4n(X(v))} ${yA + 32} V${yB - 10}" stroke="${H6C.g}" stroke-width="2.4" stroke-dasharray="5 4"/>`).join(''), 'ลงที่เดียวกันที่ 15 และ 30 คือ<b>พหุคูณร่วม</b>'],
        [h6dO(X(15), (yA + yB) / 2 + 10, 20, H6C.p) + h6dT(X(15), (yA + yB) / 2 + 17, '15', H6C.p, 'r4d-big') + h6dT(300, 236, 'ค.ร.น. = 15', H6C.p, 'r4d-big'), 'ตรงกัน<b>ครั้งแรก</b>ที่ 15 จึงได้ ค.ร.น. ของ 3 และ 5 = 15']],
        'ค.ร.น. ย่อมาจาก คูณร่วมน้อย คือ พหุคูณร่วมที่น้อยที่สุด', { H: 244 }),
      r4dShow('ค.ร.น. ของ 3, 4 และ 6', { W: 400, H: 230, q: 'หา ค.ร.น. ของ 3, 4 และ 6 โดยการหาพหุคูณร่วม', fig: '',
        steps: [{ ink: G.row(0), w: '3: 3, 6, 9, 12, 15, 18, 21, 24', n: 'พหุคูณของ 3' }, { ink: G.row(1), w: '4: 4, 8, 12, 16, 20, 24', n: 'ตัวเดียวกันตรงกัน' }, { ink: G.row(2), w: '6: 6, 12, 18, 24', n: '' },
          { ink: G.col(12) + G.col(24), w: 'พหุคูณร่วม: 12, 24, …', n: 'มีครบทั้งสามแถว' }, { ink: G.col(12, H6C.p) + h6dT(200, 210, 'ค.ร.น. = 12', H6C.p, 'r4d-big'), w: 'ค.ร.น. = 12', n: 'พหุคูณร่วมที่น้อยที่สุด', ans: 1 }],
        fin: 'เขียนพหุคูณของทุกจำนวน หาตัวที่มี<b>ครบทุกจำนวน</b> แล้วเลือกตัวที่น้อยที่สุด', say: 'เขียนพหุคูณของทุกจำนวน หาตัวที่มีครบทุกจำนวน แล้วเลือกตัวที่น้อยที่สุด' }),
      h6dTry(707, () => { const [a, b, u] = pick([[6, 9, 60], [4, 10, 50], [6, 8, 60], [5, 15, 60]]); return Q.hCmul({ nums: [a, b], upto: u }); }, 'แตะเลือกพหุคูณร่วม'),
      h6dTry(707, () => Q.hLcm({ nums: pick([[6, 9], [4, 10], [2, 3, 5], [8, 10]]), how: 'cm' }), 'หา ค.ร.น.')]; },

  /* ด่าน 8 ค.ร.น. โดยการแยกตัวประกอบ */
  708: L => { const A = h6dAl([[15, [3, 5]], [20, [2, 2, 5]], [30, [2, 3, 5]]], { y0: 44, rh: 44, x0: 150, cw: 56 }), B = h6dAl([[8, [2, 2, 2]], [12, [2, 2, 3]]], { y0: 56, rh: 52 });
    const down = (P, y) => P.cols.map((p, c) => `<path d="M${a4n(P.X(c))} ${P.Y(P.n - 1) + 18} V${y - 24}" stroke="${H6C.o}" stroke-width="2" stroke-dasharray="4 3"/>` + h6dT(P.X(c), y, String(p), H6C.o, 'r4d-big')).join('');
    return [
      h6dB('ค.ร.น. ของ 15, 20 และ 30', [[A.row(0) + A.row(1) + A.row(2), 'แยกตัวประกอบ เขียนตัวที่เหมือนกัน<b>ให้ตรงกัน</b>'],
        [down(A, 196), 'ดึงลงมา<b>ทุกหลัก หลักละ 1 ตัว</b>: 2, 2, 3, 5'],
        [h6dT(200, 232, 'ค.ร.น. = 2 × 2 × 3 × 5 = 60', H6C.g, 'r4d-tx'), 'นำมาคูณกัน ค.ร.น. = <b>60</b>']],
        'ค.ร.น. = ผลคูณของตัวประกอบเฉพาะ<b>ทุกตัว</b> ตัวที่ตรงกันใช้ครั้งเดียว', { H: 244 }),
      r4dShow('ค.ร.น. ของ 8 และ 12 โดยการแยกตัวประกอบ', { W: 400, H: 230, q: 'หา ค.ร.น. ของ 8 และ 12 โดยการแยกตัวประกอบ', fig: '',
        steps: [{ ink: B.row(0), w: '8 = 2 × 2 × 2', n: 'แยกตัวประกอบ' }, { ink: B.row(1), w: '12 = 2 × 2 × 3', n: 'ตัวที่เหมือนกันตรงกัน' }, { ink: down(B, 192), w: 'ทุกหลัก: 2, 2, 2, 3', n: 'หลักละ 1 ตัว' },
          { ink: '', w: '2 × 2 × 2 × 3 = 24', n: 'ค.ร.น. ของ 8 และ 12', ans: 1 }],
        fin: 'ค.ร.น. ใช้<b>ทุกหลัก</b> ส่วน ห.ร.ม. ใช้เฉพาะหลักที่มีครบ', say: 'คอรอนอ ใช้ทุกหลัก ส่วน หอรอมอ ใช้เฉพาะหลักที่มีครบ' }),
      h6dTry(708, () => Q.hPFWork({ nums: pick([[10, 12], [9, 15], [14, 21], [12, 20]]), mode: 'lcm' }), 'หา ค.ร.น. โดยการแยกตัวประกอบ'),
      h6dTry(708, () => { const [x, y] = pick([[10, 12], [9, 15], [20, 30], [14, 21]]); return h6dPFOpt(x, y, 'lcm'); }, 'ค.ร.น. ตรงกับข้อใด')]; },

  /* ด่าน 9 ค.ร.น. โดยการหาร */
  709: L => { const D = h6dLad([8, 12, 18], [2, 2, 3], { y0: 40, rh: 38 }), E = h6dLad([6, 10, 15], [2, 3, 5], { cx: 190, y0: 36, rh: 38 });
    return [
      h6dB('ค.ร.น. ของ 8, 12, 18 โดยการตั้งหาร', [[D.num(0) + D.bar(0) + D.num(1), '2 หาร 8, 12, 18 ลงตัว ได้ 4, 6, 9'],
        [D.bar(1) + D.num(2), '2 หาร 4 กับ 6 ลงตัว ส่วน 9 หารไม่ลงตัว <b>ดึงลงมา</b>'], [D.bar(2) + D.num(3), '3 หาร 3 กับ 9 ลงตัว ส่วน 2 ดึงลงมา'],
        [h6dT(210, 196, 'หารลงตัวไม่ถึง 2 จำนวน หยุด', H6C.o, 'r4d-sm'), 'ไม่มีจำนวนเฉพาะใดหารลงตัว<b>อย่างน้อย 2 จำนวน</b> จึงหยุด'],
        [D.ell() + h6dT(200, 232, 'ค.ร.น. = 2 × 2 × 3 × 2 × 1 × 3 = 72', H6C.g, 'r4d-tx'), 'คูณ<b>รูปตัว L</b>: ตัวหารทางซ้าย × ผลหารแถวล่าง']],
        'ค.ร.น. โดยการหาร = ตัวหารทั้งหมด × ผลหารแถวล่าง', { H: 244 }),
      ...h6dHands(L, /simShortDivTry/),
      r4dShow('ค.ร.น. ของ 6, 10 และ 15 โดยการหาร', { W: 340, H: 230, q: 'หา ค.ร.น. ของ 6, 10 และ 15 โดยการตั้งหารสั้น', fig: E.num(0),
        steps: [{ ink: E.bar(0) + E.num(1), w: '÷ 2 ได้ 3, 5 ดึง 15 ลงมา', n: '2 หาร 6 กับ 10 ลงตัว' }, { ink: E.bar(1) + E.num(2), w: '÷ 3 ได้ 1, 5 ดึง 5 ลงมา', n: '3 หาร 3 กับ 15 ลงตัว' }, { ink: E.bar(2) + E.num(3), w: '÷ 5 ได้ 1, 1, 1', n: 'หยุด' },
          { ink: E.ell(), w: '2 × 3 × 5 × 1 × 1 × 1 = 30', n: 'ค.ร.น. = คูณรูปตัว L', ans: 1 }],
        fin: 'หารด้วยจำนวนเฉพาะที่หารลงตัว<b>อย่างน้อย 2 จำนวน</b> ตัวที่หารไม่ลงตัวดึงลงมา', say: 'หารด้วยจำนวนเฉพาะที่หารลงตัวอย่างน้อยสองจำนวน ตัวที่หารไม่ลงตัวดึงลงมา' }),
      h6dTry(709, () => Q.hLadder({ nums: pick([[4, 10], [6, 8, 9], [9, 12], [10, 15]]), mode: 'lcm' }), 'หา ค.ร.น. โดยการตั้งหารสั้น')]; },

  /* ด่าน 10 ความสัมพันธ์ ห.ร.ม. × ค.ร.น. */
  710: L => { const V = `<circle cx="160" cy="126" r="74" fill="#FDE2EA" fill-opacity=".55" stroke="${H6C.p}" stroke-width="2.4"/><circle cx="240" cy="126" r="74" fill="#DCEBFA" fill-opacity=".55" stroke="${H6C.b}" stroke-width="2.4"/>`;
    return [
      h6dB('ห.ร.ม. × ค.ร.น. ของ 12 และ 18', [[V + h6dT(110, 34, '12 = 2 × 2 × 3', H6C.p, 'r4d-tx') + h6dT(290, 34, '18 = 2 × 3 × 3', H6C.b, 'r4d-tx'), 'แยกตัวประกอบ 12 = 2 × 2 × 3 และ 18 = 2 × 3 × 3'],
        [h6dT(200, 114, '2', H6C.g, 'r4d-big') + h6dT(200, 152, '3', H6C.g, 'r4d-big') + h6dT(128, 134, '2', H6C.p, 'r4d-big') + h6dT(272, 134, '3', H6C.b, 'r4d-big'), 'ตัวที่มีร่วมกัน (2 กับ 3) อยู่ตรงกลาง ที่เหลืออยู่ในวงของตัวเอง'],
        [`<rect x="182" y="88" width="36" height="74" rx="16" fill="none" stroke="${H6C.g}" stroke-width="2.6"/>` + h6dT(200, 226, 'ห.ร.ม. = 2 × 3 = 6', H6C.g, 'r4d-tx'), '<b>ตรงกลาง</b>คูณกัน = ห.ร.ม. = 6'],
        [h6dT(200, 254, 'ค.ร.น. = 2 × 2 × 3 × 3 = 36', H6C.o, 'r4d-tx'), '<b>ทุกตัว</b>ในสองวงคูณกัน = ค.ร.น. = 36'],
        [h6dT(200, 288, '6 × 36 = 216 = 12 × 18', H6C.v, 'r4d-big'), 'ห.ร.ม. × ค.ร.น. = 216 เท่ากับ 12 × 18 พอดี']],
        'จำนวนนับ 2 จำนวน: ห.ร.ม. × ค.ร.น. = ผลคูณของสองจำนวนนั้น', { H: 300 }),
      r4dShow('หาจำนวนที่หายไป', e1dEq([{ e: '6 × 72 = 18 × □', w: 'ห.ร.ม. × ค.ร.น. = 18 × □', n: 'แทนค่า ห.ร.ม. 6 ค.ร.น. 72' }, { e: '432 = 18 × □', w: '6 × 72 = 432', n: '' }, { e: '□ = 432 ÷ 18', w: 'หารด้วย 18', n: '' }, { e: '□ = *24', w: 'อีกจำนวนคือ 24', n: 'ตรวจ: ห.ร.ม. ของ 18, 24 = 6', ans: 1 }],
        { q: 'ห.ร.ม. ของสองจำนวนคือ 6 ค.ร.น. คือ 72 จำนวนหนึ่งคือ 18 อีกจำนวนคือเท่าใด', fin: 'อีกจำนวน = ห.ร.ม. × ค.ร.น. ÷ จำนวนที่รู้', say: 'อีกจำนวน เท่ากับ หอรอมอ คูณ คอรอนอ หารด้วยจำนวนที่รู้' })),
      h6dTry(710, () => { const [a, g, l, b] = pick([[10, 2, 60, 12], [14, 7, 42, 21], [20, 4, 40, 8], [9, 3, 36, 12]]); return Q.hNum({ q: `ห.ร.ม. ของสองจำนวนคือ ${g} ค.ร.น. คือ ${l} จำนวนหนึ่งคือ ${a} อีกจำนวนคือเท่าใด`, head: `${g} × ${l} = ${a} × <span class="fsign">?</span>`, a: b, hint: `${g} × ${l} = ${g * l} แล้วหารด้วย ${a}` }); }, 'หาจำนวนที่หายไป'),
      h6dTry(710, () => h6tf(pick([['ห.ร.ม. ของ 8 และ 20 คือ 4', 1], ['ค.ร.น. ของ 6 และ 15 คือ 90', 0], ['ห.ร.ม. ของ 9 และ 27 คือ 3', 0], ['ค.ร.น. ของ 4 และ 14 คือ 28', 1]])), 'ถูกหรือผิด')]; },

  /* ด่าน 11 โจทย์ปัญหา ห.ร.ม. */
  711: L => { const LN = [18, 24, 30], CO = ['#FF7B86', '#6FB2F5', '#4FD1A1'], bx = 82, sx = 9.6, by = i => 40 + i * 50;
    const bars = LN.map((n, i) => h6dT(bx - 10, by(i) + 19, `${n} ซม.`, H6C.ink, 'r4d-sm', 'end') + `<rect x="${bx}" y="${by(i)}" width="${n * sx}" height="28" rx="5" fill="${CO[i]}" fill-opacity=".35" stroke="${CO[i]}" stroke-width="1.6"/>`).join('');
    const cut = c => LN.map((n, i) => { let s = ''; for (let v = c; v < n; v += c) s += `<path d="M${a4n(bx + v * sx)} ${by(i) - 4} V${by(i) + 32}" stroke="${H6C.ink}" stroke-width="2.2"/>`; const r = n % c; if (r) s += `<rect x="${a4n(bx + (n - r) * sx)}" y="${by(i)}" width="${a4n(r * sx)}" height="28" rx="4" fill="#fff" stroke="${H6C.bad}" stroke-width="2" stroke-dasharray="4 3"/>` + h6dT(bx + (n - r / 2) * sx, by(i) - 8, `เศษ ${r}`, H6C.bad, 'r4d-sm'); else s += h6dT(bx + n * sx + 16, by(i) + 19, '✓', H6C.g, 'r4d-tx'); return s; }).join('');
    const D = h6dLad([36, 48, 60], [2, 2, 3], { cx: 150, y0: 34, rh: 36, cw: 50, cls: 'r4d-tx' });
    return [
      h6dB('ตัดริบบิ้นให้ยาวเท่ากัน ยาวที่สุด', [{ ink: cut(4), t: 'ลองตัดชิ้นละ 4 ซม. เส้น 18 กับ 30 <b>เหลือเศษ</b> ✗' }, { ink: cut(6), t: 'ลองชิ้นละ 6 ซม. ตัดได้<b>พอดีทุกเส้น</b> ✓', clear: 1 },
        { ink: h6dT(200, 210, 'ห.ร.ม. ของ 18, 24, 30 = 6', H6C.g, 'r4d-tx'), t: 'ยาวที่สุดที่ตัดได้พอดีทุกเส้น คือ <b>ห.ร.ม.</b> = 6 ซม.' }, { ink: h6dT(200, 236, 'ได้ 3 + 4 + 5 = 12 ชิ้น', H6C.o, 'r4d-tx'), t: 'นับชิ้น 18 ÷ 6 + 24 ÷ 6 + 30 ÷ 6 = 12 ชิ้น' }],
        'โจทย์ แบ่ง ตัด จัดให้เท่ากัน มากที่สุด หรือ ยาวที่สุด ใช้ ห.ร.ม.', { fig: bars, H: 246 }),
      h6dOld('แตะเลือกความยาวชิ้น ตัดริบบิ้น 12, 20, 28 ซม. ให้พอดีและยาวที่สุด', el => { const lens = [12, 20, 28], best = 4;
        el.append(h6dChip('ตัดริบบิ้นยาว <b>12, 20, 28 ซม.</b> เป็นชิ้นยาวเท่ากัน — แตะเลือกความยาวชิ้น', [2, 3, 4, 5, 6], c => { const sx2 = 11, y = i => 26 + i * 52;
          let s = lens.map((n, i) => h6dT(72, y(i) + 19, `${n}`, H6C.ink, 'r4d-sm', 'end') + `<rect x="80" y="${y(i)}" width="${n * sx2}" height="28" rx="5" fill="${CO[i]}" fill-opacity=".35" stroke="${CO[i]}" stroke-width="1.6"/>`).join('');
          if (c == null) return { s, H: 180, note: 'แตะความยาวชิ้นด้านล่าง' };
          let ok = true, tot = 0; lens.forEach((n, i) => { for (let v = c; v < n; v += c) s += `<path d="M${80 + v * sx2} ${y(i) - 4} V${y(i) + 32}" stroke="${H6C.ink}" stroke-width="2.2"/>`; const r = n % c; tot += Math.floor(n / c); if (r) { ok = false; s += `<rect x="${80 + (n - r) * sx2}" y="${y(i)}" width="${r * sx2}" height="28" rx="4" fill="#fff" stroke="${H6C.bad}" stroke-width="2" stroke-dasharray="4 3"/>`; } });
          return { s, H: 180, ok, done: ok && c === best, note: !ok ? `ชิ้นละ ${c} ซม. มีเส้นที่<b>เหลือเศษ</b> ✗` : c === best ? `ชิ้นละ 4 ซม. พอดีทุกเส้น และ<b>ยาวที่สุด</b> = ห.ร.ม. ของ 12, 20, 28 ได้ ${tot} ชิ้น` : `ชิ้นละ ${c} ซม. พอดี ✓ ลองให้ยาวกว่านี้ได้ไหม` }; }, { lab: v => `${v} ซม.` })); }),
      r4dShow('โจทย์ ห.ร.ม. ผ้า 3 ผืน', { W: 360, H: 220, q: 'ผ้า 3 ผืน ยาว 36, 48 และ 60 เซนติเมตร ตัดเป็นชิ้นยาวเท่ากัน<b>ยาวที่สุด</b>โดยไม่เหลือเศษ ได้ชิ้นละกี่เซนติเมตร และได้ทั้งหมดกี่ชิ้น', fig: D.num(0),
        steps: [{ ink: '', w: 'ยาวที่สุด → ห.ร.ม.', n: 'ตัดให้ยาวเท่ากัน คำสำคัญ “ยาวที่สุด”' }, { ink: D.bar(0) + D.num(1) + D.bar(1) + D.num(2) + D.bar(2) + D.num(3), w: 'ตั้งหาร 36, 48, 60', n: 'หารด้วย 2, 2, 3' },
          { ink: D.ring(), w: 'ห.ร.ม. = 2 × 2 × 3 = 12', n: 'ชิ้นละ 12 ซม.' }, { ink: `<rect x="${a4n(D.X(0) - 22)}" y="${D.Y(3) - 18}" width="${a4n(D.X(2) - D.X(0) + 44)}" height="34" rx="12" fill="none" stroke="${H6C.o}" stroke-width="2.6"/>`, w: '3 + 4 + 5 = 12 ชิ้น', n: 'แถวล่างคือจำนวนชิ้นของแต่ละผืน', ans: 1 }],
        fin: 'ห.ร.ม. บอกขนาดชิ้น ผลหารแถวล่างบอกจำนวนชิ้น', say: 'หอรอมอ บอกขนาดชิ้น ผลหารแถวล่างบอกจำนวนชิ้น' }),
      h6dTry(711, () => Q.hStory(pick([{ text: 'ริบบิ้น 2 เส้น ยาว 24 และ 40 เซนติเมตร ตัดเป็นชิ้นยาวเท่ากัน<b>ยาวที่สุด</b>โดยไม่เหลือเศษ ได้ชิ้นละกี่เซนติเมตร', kind: 'hcf', ans: 8, unit: 'ซม.', why: 'ห.ร.ม. ของ 24 และ 40 = 8' },
        { text: 'ขนม 27 ชิ้น นม 36 กล่อง แบ่งให้เด็กคนละเท่า ๆ กัน ได้เด็ก<b>มากที่สุด</b>กี่คน', kind: 'hcf', ans: 9, unit: 'คน', why: 'ห.ร.ม. ของ 27 และ 36 = 9' },
        { text: 'ลวด 2 เส้น ยาว 35 และ 49 เมตร ตัดเป็นเส้นยาวเท่ากัน<b>ยาวที่สุด</b>โดยไม่เหลือเศษ ได้เส้นละกี่เมตร', kind: 'hcf', ans: 7, unit: 'เมตร', why: 'ห.ร.ม. ของ 35 และ 49 = 7' }])), 'โจทย์ ห.ร.ม.')]; },

  /* ด่าน 12 โจทย์ปัญหา ค.ร.น. */
  712: L => { const X = m => 56 + m * 5.2, yA = 86, yB = 164, car = (m, y, col) => `<rect x="${a4n(X(m) - 9)}" y="${y - 22}" width="18" height="16" rx="4" fill="${col}"/><path d="M${a4n(X(m))} ${y - 22} V${y - 30}" stroke="${col}" stroke-width="2"/>` + h6dT(X(m), y + 22, String(m), col, 'r4d-sm');
    const axis = y => `<path d="M${X(0)} ${y} H${X(60) + 8}" stroke="${H6C.ink}" stroke-width="2.2"/>` + Array.from({ length: 13 }, (_, j) => `<path d="M${a4n(X(j * 5))} ${y - 4} V${y + 4}" stroke="${H6C.ink}" stroke-width="1.4"/>`).join('');
    const D = h6dLad([6, 8], [2], { cx: 160, y0: 60, rh: 40 });
    return [
      h6dB('รถกระเช้า 2 สาย ออกพร้อมกันอีกครั้งเมื่อใด', [[axis(yA) + axis(yB) + h6dT(14, yA + 6, 'สาย ก', H6C.b, 'r4d-sm', 'start') + h6dT(14, yB + 6, 'สาย ข', H6C.o, 'r4d-sm', 'start') + h6dT(X(0), yA + 22, '0', H6C.ink, 'r4d-sm') + h6dT(X(0), yB + 22, '0', H6C.ink, 'r4d-sm') + h6dT(200, 30, 'นาทีหลัง 08.00 น.', '#8E86B0', 'r4d-sm'), 'รถกระเช้า 2 สาย ออกพร้อมกันเวลา 08.00 น.'],
        [[10, 20, 30, 40, 50, 60].map(m => car(m, yA, H6C.b)).join(''), 'สาย ก ออก<b>ทุก 10 นาที</b>: 10, 20, 30, …'], [[15, 30, 45, 60].map(m => car(m, yB, H6C.o)).join(''), 'สาย ข ออก<b>ทุก 15 นาที</b>: 15, 30, 45, …'],
        [`<path d="M${X(30)} ${yA + 30} V${yB - 34}" stroke="${H6C.g}" stroke-width="2.6" stroke-dasharray="5 4"/>` + h6dO(X(30), (yA + yB) / 2 - 2, 15, H6C.p), 'ออกพร้อมกันครั้งแรกอีกทีที่ <b>30 นาที</b> = ค.ร.น. ของ 10 และ 15'],
        [h6dT(200, 222, '08.00 น. + 30 นาที = 08.30 น.', H6C.g, 'r4d-tx'), 'จึงออกพร้อมกันอีกครั้งเวลา <b>08.30 น.</b>']],
        'โจทย์ พร้อมกันอีกครั้ง หรือ น้อยที่สุดที่หารลงตัว ใช้ ค.ร.น.'),
      r4dShow('โจทย์ ค.ร.น. ระฆัง 2 ใบ', { W: 340, H: 200, q: 'ระฆัง 2 ใบ ตีทุก 6 นาที และ 8 นาที ตีพร้อมกันเวลา 09.00 น. จะตีพร้อมกัน<b>อีกครั้ง</b>เวลาใด', fig: '',
        steps: [{ ink: '', w: 'พร้อมกันอีกครั้ง → ค.ร.น.', n: 'คำสำคัญ “พร้อมกันอีกครั้ง”' }, { ink: D.num(0) + D.bar(0) + D.num(1), w: 'ตั้งหาร 6 และ 8', n: '2 หารทั้งคู่ ได้ 3, 4' },
          { ink: D.ell(), w: 'ค.ร.น. = 24 นาที', n: 'คูณรูปตัว L: 2 × 3 × 4' }, { ink: h6dT(170, 186, '09.00 + 24 นาที', H6C.g, 'r4d-tx'), w: 'ตอบ 09.24 น.', n: '09.00 น. + 24 นาที', ans: 1 }],
        fin: 'หา ค.ร.น. ได้กี่นาที แล้ว<b>บวกเวลาเริ่ม</b>', say: 'หา คอรอนอ ได้กี่นาที แล้วบวกเวลาเริ่ม' }),
      h6dTry(712, () => Q.hStory(pick([{ text: 'ไฟ 2 ดวง กะพริบทุก 6 วินาที และ 9 วินาที กะพริบพร้อมกันแล้ว อีกกี่วินาทีจะกะพริบ<b>พร้อมกันอีกครั้ง</b>', kind: 'lcm', ans: 18, unit: 'วินาที', why: 'ค.ร.น. ของ 6 และ 9 = 18' },
        { text: 'ต้นไม้ 2 ต้น รดน้ำทุก 3 วัน และ 4 วัน วันนี้รดพร้อมกัน อีกกี่วันจะรดน้ำ<b>พร้อมกันอีกครั้ง</b>', kind: 'lcm', ans: 12, unit: 'วัน', why: 'ค.ร.น. ของ 3 และ 4 = 12' },
        { text: 'จัดลูกปิงปองใส่กล่อง กล่องละ 8 ลูก หรือกล่องละ 10 ลูก ก็ได้พอดี ต้องมีลูกปิงปอง<b>อย่างน้อย</b>กี่ลูก', kind: 'lcm', ans: 40, unit: 'ลูก', why: 'ค.ร.น. ของ 8 และ 10 = 40' }])), 'โจทย์ ค.ร.น.')]; },

  /* ด่าน 13 วิเคราะห์โจทย์ (ตอนที่ 1) */
  713: L => { const D = h6dLad([48, 36], [2, 2, 3], { cx: 112, y0: 40, rh: 34, cw: 46, cls: 'r4d-tx' }), bag = (x, y, col) => `<path d="M${x - 14} ${y - 8} Q${x - 18} ${y + 18} ${x} ${y + 18} Q${x + 18} ${y + 18} ${x + 14} ${y - 8} Z" fill="${col}" stroke="${H6C.ink}" stroke-width="1.4"/>` + h6dT(x, y + 10, '12', '#fff', 'r4d-sm');
    return [
      h6dB('ห.ร.ม. หรือ ค.ร.น.', [[`<rect x="14" y="16" width="180" height="200" rx="14" fill="${H6C.m}"/>` + h6dT(104, 46, 'ห.ร.ม.', H6C.p, 'r4d-big') + h6dT(104, 82, 'แบ่ง ตัด จัด ให้เท่ากัน', H6C.ink, 'r4d-sm') + h6dT(104, 108, 'มากที่สุด ยาวที่สุด', H6C.ink, 'r4d-sm') + h6dT(104, 134, 'ใหญ่ที่สุด', H6C.ink, 'r4d-sm'), 'คำว่า แบ่ง ตัด จัดให้เท่ากัน “มากที่สุด” → <b>ห.ร.ม.</b>'],
        [`<rect x="206" y="16" width="180" height="200" rx="14" fill="${H6C.sky}"/>` + h6dT(296, 46, 'ค.ร.น.', H6C.b, 'r4d-big') + h6dT(296, 82, 'พร้อมกันอีกครั้ง', H6C.ink, 'r4d-sm') + h6dT(296, 108, 'น้อยที่สุดที่หารลงตัว', H6C.ink, 'r4d-sm') + h6dT(296, 134, 'อย่างน้อย', H6C.ink, 'r4d-sm'), 'คำว่า พร้อมกันอีกครั้ง “น้อยที่สุด” ที่หารลงตัว → <b>ค.ร.น.</b>'],
        [h6dT(104, 180, 'คำตอบ ≤ จำนวนที่น้อยสุด', H6C.p, 'r4d-sm') + h6dT(296, 180, 'คำตอบ ≥ จำนวนที่มากสุด', H6C.b, 'r4d-sm'), 'ตรวจคำตอบ: ห.ร.ม. <b>ไม่เกิน</b>จำนวนที่น้อยที่สุด ค.ร.น. <b>ไม่น้อยกว่า</b>จำนวนที่มากที่สุด']],
        'อ่านโจทย์ หาคำสำคัญ แล้วเลือกเครื่องมือก่อนคำนวณ', { H: 232 }),
      ...h6dHands(L, /simKind/),
      r4dShow('วิเคราะห์โจทย์ 4 ขั้น', { W: 400, H: 210, q: 'มีส้ม 48 ผล มังคุด 36 ผล จัดใส่ถุง ถุงละเท่า ๆ กัน แต่ละถุงมีผลไม้ชนิดเดียว และมีจำนวน<b>มากที่สุด</b> จะได้ทั้งหมดกี่ถุง', fig: '',
        steps: [{ ink: '', w: '① ถาม: ได้ทั้งหมดกี่ถุง', n: 'อ่านให้รู้ว่าโจทย์ถามอะไร' }, { ink: '', w: '② มากที่สุด → ห.ร.ม.', n: 'ถุงละเท่ากัน คำสำคัญ “มากที่สุด”' },
          { ink: D.num(0) + D.bar(0) + D.num(1) + D.bar(1) + D.num(2) + D.bar(2) + D.num(3) + D.ring(), w: '③ ห.ร.ม. ของ 48, 36 = 12', n: 'ถุงละ 12 ผล' },
          { ink: [0, 1, 2, 3].map(i => bag(236 + i * 40, 70, H6C.o)).join('') + [0, 1, 2].map(i => bag(256 + i * 40, 140, H6C.v)).join(''), w: '④ 4 + 3 = 7 ถุง', n: 'ส้ม 48 ÷ 12 = 4 มังคุด 36 ÷ 12 = 3', ans: 1 }],
        fin: 'ถามอะไร บอกอะไร ใช้วิธีใด แล้วคำนวณและตรวจคำตอบ', say: 'ถามอะไร บอกอะไร ใช้วิธีใด แล้วคำนวณและตรวจคำตอบ' }),
      h6dTry(713, () => h6kq(pick([['ต้องการตัดไม้ยาว 40 และ 56 เซนติเมตร เป็นท่อนยาวเท่ากัน<b>ยาวที่สุด</b>โดยไม่เหลือเศษ', 'hcf'], ['นาฬิกาปลุก 2 เรือน ดังทุก 20 นาที และ 30 นาที ดังพร้อมกันแล้ว จะดัง<b>พร้อมกันอีกครั้ง</b>เมื่อใด', 'lcm'],
        ['ครูมีลูกอม 45 เม็ด ช็อกโกแลต 60 ชิ้น แบ่งให้นักเรียนคนละเท่า ๆ กัน ได้นักเรียน<b>มากที่สุด</b>กี่คน', 'hcf'], ['จำนวนที่<b>น้อยที่สุด</b>ที่หารด้วย 9 และ 15 ได้ลงตัว', 'lcm']])), 'ใช้วิธีใด'),
      h6dTry(713, () => Q.hStory({ text: 'มีดินสอ 30 แท่ง ปากกา 45 ด้าม จัดใส่กล่องละเท่า ๆ กัน กล่องละชนิดเดียว ให้แต่ละกล่องมีของ<b>มากที่สุด</b> จะได้ทั้งหมดกี่กล่อง', kind: 'hcf', ans: 5, unit: 'กล่อง', why: 'ห.ร.ม. ของ 30, 45 = 15 → 2 + 3 = 5 กล่อง' }), 'โจทย์ปัญหา')]; },

  /* ด่าน 14 วิเคราะห์โจทย์ (ตอนที่ 2) */
  714: L => { const K = 2.9, fx = 34, fy = 40, flo = `<rect x="${fx}" y="${fy}" width="${60 * K}" height="${48 * K}" fill="#fff" stroke="${H6C.ink}" stroke-width="2.4"/>` + h6dT(fx + 30 * K, fy - 10, '60 ซม.', H6C.ink, 'r4d-sm') + h6dT(fx - 8, fy + 24 * K + 4, '48', H6C.ink, 'r4d-sm', 'end');
    let tl = ''; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) tl += `<rect x="${a4n(fx + i * 12 * K + 1.5)}" y="${a4n(fy + j * 12 * K + 1.5)}" width="${a4n(12 * K - 3)}" height="${a4n(12 * K - 3)}" rx="3" fill="${(i + j) % 2 ? '#6FB2F5' : '#9FCBF7'}"/>`;
    const D = h6dLad([6, 8, 12], [2, 2, 3], { cx: 170, y0: 34, rh: 36, cw: 50, cls: 'r4d-tx' });
    return [
      h6dB('ปูกระเบื้อง 2 ขั้นตอน', [[flo, 'พื้นกว้าง 48 ซม. ยาว 60 ซม. ปูกระเบื้องจัตุรัส<b>ใหญ่ที่สุด</b>ให้พอดี'],
        [tl + h6dT(300, 70, '① ด้าน = ห.ร.ม.', H6C.b, 'r4d-sm') + h6dT(300, 96, 'ของ 60 กับ 48', H6C.b, 'r4d-sm') + h6dT(300, 124, '= 12 ซม.', H6C.b, 'r4d-tx'), '① ด้านกระเบื้อง = ห.ร.ม. ของ 60 และ 48 = <b>12 ซม.</b>'],
        [h6dT(300, 160, '② 60 ÷ 12 = 5', H6C.o, 'r4d-sm') + h6dT(300, 184, '48 ÷ 12 = 4', H6C.o, 'r4d-sm'), '② ด้านยาววางได้ 5 แผ่น ด้านกว้างวางได้ 4 แผ่น'],
        [h6dT(200, 226, 'ใช้กระเบื้อง 5 × 4 = 20 แผ่น', H6C.g, 'r4d-tx'), 'ใช้กระเบื้องทั้งหมด 5 × 4 = <b>20 แผ่น</b>']],
        'โจทย์หลายขั้นตอน หา ห.ร.ม. หรือ ค.ร.น. ก่อน แล้วนำไปคำนวณต่อ'),
      h6dOld('แตะเลือกขนาดกระเบื้อง ปูพื้น 36 × 24 ซม. ให้พอดีและใหญ่ที่สุด', el => { const w = 36, d = 24, best = 12, K2 = 6.2, x0 = 88, y0 = 14;
        el.append(h6dChip('พื้นกว้าง <b>24 ซม.</b> ยาว <b>36 ซม.</b> ปูกระเบื้องจัตุรัส — แตะเลือกความยาวด้าน', [3, 4, 6, 8, 12], s => { let g = `<rect x="${x0}" y="${y0}" width="${w * K2}" height="${d * K2}" fill="#fff" stroke="${H6C.ink}" stroke-width="2"/>`;
          if (s == null) return { s: g, H: 170, note: 'แตะขนาดกระเบื้องด้านล่าง' };
          const cw = Math.floor(w / s), cd = Math.floor(d / s), ok = !(w % s) && !(d % s);
          for (let i = 0; i < cw; i++) for (let j = 0; j < cd; j++) g += `<rect x="${a4n(x0 + i * s * K2 + 1)}" y="${a4n(y0 + j * s * K2 + 1)}" width="${a4n(s * K2 - 2)}" height="${a4n(s * K2 - 2)}" rx="3" fill="${(i + j) % 2 ? '#6FB2F5' : '#9FCBF7'}"/>`;
          if (!ok) g += `<rect x="${a4n(x0 + cw * s * K2)}" y="${y0}" width="${a4n((w - cw * s) * K2)}" height="${d * K2}" fill="#FF7B86" fill-opacity=".35"/><rect x="${x0}" y="${a4n(y0 + cd * s * K2)}" width="${w * K2}" height="${a4n((d - cd * s) * K2)}" fill="#FF7B86" fill-opacity=".35"/>`;
          return { s: g, H: 170, ok, done: ok && s === best, note: !ok ? `แผ่นละ ${s} × ${s} ซม. ปู<b>ไม่พอดี</b> ✗ (ส่วนสีแดงต้องตัด)` : s === best ? `แผ่นละ 12 ซม. พอดีและ<b>ใหญ่ที่สุด</b> = ห.ร.ม. ของ 36 และ 24 ใช้ ${cw} × ${cd} = ${cw * cd} แผ่น` : `แผ่นละ ${s} ซม. พอดี ✓ ใช้ ${cw * cd} แผ่น ลองให้ใหญ่กว่านี้ได้ไหม` }; }, { lab: v => `${v} ซม.` })); }),
      r4dShow('โจทย์ เหลือเศษเท่ากัน', { W: 360, H: 200, q: 'จำนวนนับที่<b>น้อยที่สุด</b> ซึ่งหารด้วย 6, 8 และ 12 แล้ว<b>เหลือเศษ 5</b> ทุกครั้ง คือจำนวนใด', fig: '',
        steps: [{ ink: '', w: 'เอาเศษ 5 ออกก่อน', n: 'คิดย้อนกลับ จะหารด้วย 6, 8, 12 ลงตัว' }, { ink: D.num(0) + D.bar(0) + D.num(1) + D.bar(1) + D.num(2) + D.bar(2) + D.num(3), w: 'ตั้งหาร 6, 8, 12', n: '' },
          { ink: D.ell(), w: 'ค.ร.น. = 24', n: 'คูณรูปตัว L: 2 × 2 × 3 × 1 × 2 × 1' }, { ink: h6dT(310, 100, '24 + 5', H6C.g, 'r4d-big') + h6dT(310, 136, '= 29', H6C.g, 'r4d-big'), w: '24 + 5 = 29', n: 'บวกเศษกลับ ตรวจ 29 ÷ 8 = 3 เศษ 5', ans: 1 }],
        fin: 'เหลือเศษเท่ากัน: หา ค.ร.น. แล้ว<b>บวกเศษ</b>', say: 'เหลือเศษเท่ากัน หา คอรอนอ แล้วบวกเศษ' }),
      h6dTry(714, () => { const [a, b, r] = pick([[4, 6, 3], [5, 6, 2], [8, 12, 5], [6, 10, 4]]); return h6dRem(a, b, r); }, 'เหลือเศษเท่ากัน'),
      h6dTry(714, () => Q.hStory(pick([{ text: 'ปูกระเบื้องรูปสี่เหลี่ยมจัตุรัสขนาด<b>ใหญ่ที่สุด</b>บนพื้นกว้าง 30 ซม. ยาว 45 ซม. ได้พอดี ต้องใช้กระเบื้องกี่แผ่น', kind: 'hcf', ans: 6, unit: 'แผ่น', why: 'ห.ร.ม. ของ 30, 45 = 15 → 2 × 3 = 6 แผ่น' },
        { text: 'ปูกระเบื้องรูปสี่เหลี่ยมจัตุรัสขนาด<b>ใหญ่ที่สุด</b>บนพื้นกว้าง 40 ซม. ยาว 56 ซม. ได้พอดี ต้องใช้กระเบื้องกี่แผ่น', kind: 'hcf', ans: 35, unit: 'แผ่น', why: 'ห.ร.ม. ของ 40, 56 = 8 → 5 × 7 = 35 แผ่น' }])), 'โจทย์ 2 ขั้นตอน')]; }
};
/* games: easy → hard by point (ranks from the prompt); same rank → fewer and smaller numbers first */
const H6D_ORD = {
  701: [/ตัวประกอบทั้งหมดของ/, /จำนวนใดเป็นตัวประกอบ/, /ไม่ใช่ ?ตัวประกอบ/, /กี่ตัว/],
  702: [/^1 เป็นจำนวนเฉพาะ/, /จำนวนคู่/, /แตะเลือก ?จำนวนเฉพาะ/, /ตัวประกอบเฉพาะ/, /ทุกจำนวน/],
  703: [/ข้อใดเป็น/, /^แยกตัวประกอบของ/, /แยกตัวประกอบได้เป็น/],
  704: [/ย่อมาจาก/, /ตัวประกอบร่วม/, /ห\.ร\.ม\./],
  705: [/ตรงกับข้อใด/, /โดยการแยกตัวประกอบ/, /ห\.ร\.ม\./],
  706: [/หยุดหาร/, /ตั้งหารสั้น/],
  707: [/ย่อมาจาก/, /พหุคูณร่วม/, /ค\.ร\.น\./],
  708: [/ตรงกับข้อใด/, /โดยการแยกตัวประกอบ/, /ค\.ร\.น\./],
  709: [/อย่างน้อย/, /ตั้งหารสั้น/],
  710: [/ถูกต้องเสมอ/, /ถูกต้องหรือไม่/, /ห\.ร\.ม\. × ค\.ร\.น\./, /อีกจำนวน/],
  711: t => /\d+, \d+ และ \d+|\d+ คน.*\d+ คน.*\d+ คน/.test(t) ? 1 : 0,
  712: t => /เวลาใด|\d+, \d+ และ \d+/.test(t) ? 1 : 0,
  713: [/วิธีใด/, /ถุง/, /เวลาใด/],
  714: t => /เหลือเศษ \d|เหลือเศษเท่ากัน/.test(t) ? 2 : /เวลาใด/.test(t) ? 1 : 0
};
/* ด่าน 10: more items with new numbers (3 ข้อถูก/ผิดรวมเป็นข้อเดียวในเกม จึงต้องมีข้ออื่นพอ) */
{ const L = LESSONS_P6C1.find(x => x.id === 710), g0 = L.game; L.game = () => [...g0(), ...pkF([[16, 8, 48, 24], [20, 10, 60, 30], [25, 5, 75, 15], [18, 6, 36, 12]], 2).map(([a, g, l, b]) => Q.hNum({ q: `ห.ร.ม. ของสองจำนวนคือ ${g} ค.ร.น. คือ ${l} จำนวนหนึ่งคือ ${a} อีกจำนวนคือเท่าใด`, head: `${g} × ${l} = ${a} × <span class="fsign">?</span>`, a: b, hint: `${g} × ${l} = ${g * l} แล้วหารด้วย ${a}` })),
  ...pkF([[9, 15], [6, 10], [12, 20]], 1).map(([a, b]) => Q.hNum({ q: `ห.ร.ม. × ค.ร.น. ของ ${a} และ ${b} เท่ากับเท่าใด`, head: 'ห.ร.ม. × ค.ร.น. = <span class="fsign">?</span>', a: a * b, hint: `เท่ากับผลคูณ ${a} × ${b}` }))]; }
LESSONS_P6C1.forEach(L => { const f = H6D_TEACH[L.id]; if (f) { L.__old = L.teach; L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true; } if (H6D_ORD[L.id]) h6dOrd(L, H6D_ORD[L.id]); });
