/* =========================================================
   ป.4 บทที่ 9 รูปสี่เหลี่ยมมุมฉาก (ทะเลทรายสี่เหลี่ยม) — หน้าสอนและเกมเรียบเรียงใหม่แบบ ม.ต้น (v249 · ผู้ใช้ขอ) · prefix r4v
   ด่าน 1481–1494 คงเดิม (id ลำดับ ชื่อด่าน บอส) — เปลี่ยนหน้าสอนและเกม:
   หน้าสอน: ย้ายไป p4rd.js (v251 · ผู้ใช้ขอ: ประเด็นละหน้า → ทำให้ดูแบบมือเขียน → ลองทำข้อแบบเกม) — ไฟล์นี้เก็บฉากลาก/แตะ (r4v*) รูปหน้าดูภาพ (R4V_SEE) และเกม (R4V_GAME)
   เกม 10 ข้อ เรียงง่าย → ยาก (__diff) แต่ละข้อเป็นคนละแบบ (__kind) · ข้อท้าย ๆ เป็นโจทย์คิด 2 ขั้น / ย้อนกลับ / ข้อผิดพลาดที่พบบ่อย
   ไม่มีปุ่มเพิ่ม/ลด (stepper) — ทุกอย่างลากหรือแตะ · เกมมีข้อลากปรับรูป (r4vAdj) · วางหลัง p3tm.js ใน order.txt เพราะใช้ tgScene / rpWalk / rpSort / g4FigStory
   ========================================================= */
const r4vSep = '<span class="rp-sep"></span>';
/* game helpers: every item its own kind (so the game keeps all 10 planned items) and its own place easy → hard */
const r4vD = (q, d, k) => ({ ...q, __diff: d, __kind: 'r4v' + k });
const r4vP = (sig, d, o) => ({ ...Q.p4Pick(o), __sig: 'r4v' + sig, __diff: d, __kind: 'r4v' + String(sig).split(' ')[0] });
const r4vN = (sig, d, o) => ({ ...Q.p4Num(o), __sig: 'r4v' + sig, __diff: d, __kind: 'r4v' + String(sig).split(' ')[0] });
const r4vNm = () => pick(['ปุ้ม', 'มะลิ', 'ต้นข้าว', 'ก้อง', 'ใบเตย', 'ภูผา', 'ป้าศรี', 'ลุงชัย', 'น้ำฝน', 'ดาวเหนือ']);

/* =========================================================
   hands-on scenes (one draggable thing each · missions on top)
   ========================================================= */
/* ① grid rectangle: drag the pink corner C — the rectangle grows on the grid */
function r4vBox(o) {
  const g = o.g || 34, x0 = o.x0 || 50, y0 = o.y0 || 34, N = o.N || 10, M = o.M || 6, W = x0 + N * g + (o.padR || 50), H = y0 + M * g + (o.padB || 36);
  return tgScene({ W, H, st: { w: o.w0 || 3, h: o.h0 || 2, seen: [] }, cap: o.cap, missions: o.missions,
    svg: s => { const X = x0 + s.w * g, Y = y0 + s.h * g; return r4gridS(x0, y0, N, M, g) + o.body(s, { x0, y0, g, X, Y, P: [[x0, y0], [X, y0], [X, Y], [x0, Y]] }) + tgHandle(X, Y, '#E5487A'); },
    drag: (p, s) => { let w, hh; if (o.sq) { w = hh = Math.max(1, Math.min(N, M, Math.round(((p[0] - x0) + (p[1] - y0)) / 2 / g))); } else { w = Math.max(1, Math.min(N, Math.round((p[0] - x0) / g))); hh = Math.max(1, Math.min(M, Math.round((p[1] - y0) / g))); }
      if (w === s.w && hh === s.h) return null; const k = w + 'x' + hh; sfx.tap(); return { w, h: hh, seen: s.seen.includes(k) ? s.seen : [...s.seen, k] }; },
    info: o.info });
}
const r4vTiles = (s, G, cols = ['#FFC24C', '#FFD27A']) => { let t = ''; for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) t += `<rect x="${G.x0 + i * G.g + 1.5}" y="${G.y0 + j * G.g + 1.5}" width="${G.g - 3}" height="${G.g - 3}" rx="3" fill="${cols[(i + j) % 2]}"/>`; return t; };
const r4vArea12 = s => s.seen.filter(k => { const [a, b] = k.split('x').map(Number); return a * b === 12; }).length >= 2;

/* ② diagonals of a rectangle that you resize */
const r4vDiagBody = (s, G) => { const [A, B, C, D] = G.P, O = r4mid(A, C), sq = s.w === s.h; let t = r4PolyS(G.P, { fill: sq ? '#DDEFFB' : '#FFF1CC', names: 'ABCD' }) + `<path d="M${A.join(' ')} L${C.join(' ')}" stroke="#3C8DDB" stroke-width="4"/><path d="M${B.join(' ')} L${D.join(' ')}" stroke="#1B8862" stroke-width="4"/>`;
  [[A, O], [O, C], [B, O], [O, D]].forEach(([p, q]) => { const m = r4mid(p, q), L = r4len(p, q) || 1, n = [(q[1] - p[1]) / L * 8, -(q[0] - p[0]) / L * 8]; t += `<path d="M${a4n(m[0] - n[0])} ${a4n(m[1] - n[1])} L${a4n(m[0] + n[0])} ${a4n(m[1] + n[1])}" stroke="#E5487A" stroke-width="3"/>`; });
  if (sq) { const u = [(B[0] - O[0]) / r4len(B, O) * 13, (B[1] - O[1]) / r4len(B, O) * 13], v = [(C[0] - O[0]) / r4len(C, O) * 13, (C[1] - O[1]) / r4len(C, O) * 13]; t += `<path d="M${a4n(O[0] + u[0])} ${a4n(O[1] + u[1])} L${a4n(O[0] + u[0] + v[0])} ${a4n(O[1] + u[1] + v[1])} L${a4n(O[0] + v[0])} ${a4n(O[1] + v[1])}" fill="none" stroke="#E5487A" stroke-width="2.4"/>`; }
  return t + `<circle cx="${O[0]}" cy="${O[1]}" r="5.5" fill="#E5487A"/><text x="${O[0] - 16}" y="${O[1] + 6}" class="r4-nm" text-anchor="middle">O</text>`; };

/* ③ the camel walks along the sides — drag it side by side (no jumping across the field) */
function r4vWalk(U, unit, missions, cap) {
  const F = r4Fit(U, 560, 300, 64), P = F.P, n = P.length, Lu = U.map((p, i) => r4len(p, U[(i + 1) % n])), cum = [0]; Lu.forEach((l, i) => cum.push(cum[i] + l)); const T = cum[n];
  const at = d => { let i = 0; while (i < n - 1 && d > cum[i + 1]) i++; const f = Lu[i] ? (d - cum[i]) / Lu[i] : 0, a = P[i], b = P[(i + 1) % n]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; };
  return tgScene({ W: 560, H: 300, st: { d: 0 }, cap, missions,
    svg: s => { let t = r4PolyS(P, { fill: '#FFF1CC', names: 'ABCDEFGH'.slice(0, n), labs: Lu.map(l => r4f(l) + ' ' + unit) }); const pts = [P[0]]; let i = 0; for (; i < n && cum[i + 1] <= s.d; i++) pts.push(P[(i + 1) % n]); const q = at(s.d); if (i < n) pts.push(q);
      if (s.d) t += `<path d="M${pts.map(p => p.map(a4n).join(' ')).join(' L')}" fill="none" stroke="#E5487A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>`;
      return t + tgHandle(q[0], q[1], '#E5487A') + `<g transform="translate(${a4n(q[0])} ${a4n(q[1] - 4)}) scale(1.35)">${r4camel()}</g>`; },
    drag: (p, s) => { let best = null; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n], vx = b[0] - a[0], vy = b[1] - a[1], f = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy))), dd = Math.hypot(a[0] + vx * f - p[0], a[1] + vy * f - p[1]); if (!best || dd < best.dd) best = { dd, v: cum[i] + f * Lu[i] }; }
      const v = Math.round(best.v), c = [v, v + T, v - T].filter(x => x >= 0 && x <= T).sort((x, y) => Math.abs(x - s.d) - Math.abs(y - s.d))[0];
      if (c == null || c === s.d || Math.abs(c - s.d) > T / 3) return null; sfx.tap(); return { d: c }; },
    info: s => { const done = []; for (let i = 0; i < n && cum[i + 1] <= s.d; i++) done.push(r4f(Lu[i]));
      if (!s.d) return 'ลากอูฐเดินไปตามด้านของแปลง — เริ่มที่มุม A'; if (s.d === T) return `${done.join(' + ')} = <b>${r4f(T)} ${unit}</b>${r4vSep}เดินครบรอบ → <b>ความยาวรอบรูป ${r4f(T)} ${unit}</b>`;
      return `เดินแล้ว <b>${r4f(s.d)} ${unit}</b>` + (done.length ? `${r4vSep}${done.join(' + ')}${s.d > cum[done.length] ? ' + …' : ''}` : ''); } });
}

/* ④ staircase: push the steps out to the corner — the perimeter stays the same as the big rectangle */
function r4vStair() {
  const U0 = t => [[0, 0], [3 + 4 * t, 0], [3 + 4 * t, 1 - t], [5 + 2 * t, 1 - t], [5 + 2 * t, 3 - 3 * t], [7, 3 - 3 * t], [7, 5], [0, 5]], F = r4Fit([[0, 0], [7, 0], [7, 5], [0, 5]], 560, 320, 58), k = F.k, mp = ([x, y]) => [F.ox + x * k, F.oy + y * k];
  const H0 = mp([5, 1]), H1 = mp([7, 0]);
  return tgScene({ W: 560, H: 320, st: { t: 0, b: 0 }, cap: '<b>ลากจุดสีชมพู</b> ดันขั้นบันไดออกไปที่มุมขวาบน — ความยาวรอบรูปเปลี่ยนไหม?',
    missions: [['ดันขั้นบันไดออกจนเป็นรูปสี่เหลี่ยมผืนผ้า', s => s.t === 1], ['ดึงกลับเป็นขั้นบันไดเหมือนเดิม', s => s.t === 0 && s.b]],
    svg: s => { const Q = U0(s.t).map(mp), seg = (i, col) => `<path d="M${Q[i].map(a4n).join(' ')} L${Q[(i + 1) % 8].map(a4n).join(' ')}" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`;
      const lab = (i, txt, dx, dy, col = '#2B2550') => { const m = r4mid(Q[i], Q[(i + 1) % 8]); return `<text x="${a4n(m[0] + dx)}" y="${a4n(m[1] + dy)}" class="r4-lab" text-anchor="middle" style="fill:${col}">${txt}</text>`; };
      let t = `<path d="M${mp([0, 0]).join(' ')} H${H1[0]} V${mp([7, 5])[1]}" fill="none" stroke="#B7AED3" stroke-width="2" stroke-dasharray="6 6"/><path d="M${Q.map(q => q.map(a4n).join(' ')).join(' L')}Z" fill="#FFE7A8"/>` + [0, 2, 4].map(i => seg(i, '#EC7F1E')).join('') + [1, 3, 5].map(i => seg(i, '#3C8DDB')).join('') + seg(6, '#2B2550') + seg(7, '#2B2550') + lab(6, '7 ม.', 0, 30) + lab(7, '5 ม.', -34, 6);
      if (s.t === 0) t += lab(0, '3 ม.', 0, -12, '#C9640E') + lab(2, '2 ม.', 0, 28, '#C9640E') + lab(4, '2 ม.', 0, 28, '#C9640E') + lab(1, '1 ม.', 32, 7, '#2F7BC0') + lab(3, '2 ม.', 32, 7, '#2F7BC0') + lab(5, '2 ม.', 32, 7, '#2F7BC0');
      if (s.t === 1) t += lab(0, '7 ม.', 0, -12, '#C9640E') + lab(5, '5 ม.', 32, 6, '#2F7BC0');
      const hp = mp([5 + 2 * s.t, 1 - s.t]); return t + tgHandle(hp[0], hp[1], '#E5487A'); },
    drag: (p, s) => { const vx = H1[0] - H0[0], vy = H1[1] - H0[1], f = Math.max(0, Math.min(1, ((p[0] - H0[0]) * vx + (p[1] - H0[1]) * vy) / (vx * vx + vy * vy))), t = Math.round(f * 10) / 10; if (t === s.t) return null; sfx.tap(); return { t, b: s.b || t === 1 ? 1 : 0 }; },
    info: s => (s.t === 0 ? 'รอบรูป = 3 + 1 + 2 + 2 + 2 + 2 + 7 + 5 = <b>24 ม.</b>' : `ด้านสีส้มรวมกันยาว <b>7 ม.</b> เท่าด้านล่าง${r4vSep}ด้านสีฟ้ารวมกันยาว <b>5 ม.</b> เท่าด้านซ้าย`) + `${r4vSep}${s.t === 1 ? 'เป็นรูปสี่เหลี่ยมผืนผ้า: 2 × (7 + 5) = <b>24 ม.</b> เท่าเดิม' : 'ความยาวรอบรูปยังเป็น <b>24 ม.</b>'}` });
}

/* ⑤ paint every piece of the pond: full cell 1 · half cell ½ */
function r4vPond(S) {
  const g = 50, x0 = 24, y0 = 20, W = x0 * 2 + S.W * g, H = y0 * 2 + S.H * g, all = r4estVal(S), cnt = (s, k) => S.cells.filter((c, i) => s.m[i] && c[2] === k).length;
  return tgScene({ W, H, st: { m: S.cells.map(() => 0) }, cap: '<b>ลากระบาย</b>ทุกชิ้นของสระน้ำ — ช่องเต็มนับ 1 · ครึ่งช่อง 2 ชิ้นนับเป็น 1',
    missions: [[`ระบายช่องเต็มครบ ${all.f} ช่อง`, s => cnt(s, 'f') === all.f], [`ระบายครึ่งช่องครบ ${all.hf} ชิ้น`, s => cnt(s, 'h') === all.hf]],
    svg: s => { let t = r4gridS(x0, y0, S.W, S.H, g); S.cells.forEach(([x, y, k, d], i) => { const X = x0 + x * g, Y = y0 + y * g, col = s.m[i] ? (k === 'f' ? '#7FCF9E' : '#FFD27A') : '#9FD0F0';
        t += k === 'f' ? `<rect x="${X}" y="${Y}" width="${g}" height="${g}" fill="${col}" stroke="#4C83B8" stroke-width="1"/>` : `<path d="M${r4triPts(X, Y, g, d).map(p => p.join(' ')).join(' L')}Z" fill="${col}" stroke="#4C83B8" stroke-width="1"/>`;
        if (s.m[i]) t += `<text x="${X + g / 2 + (k === 'h' ? [-9, -9, 9, 9][d] : 0)}" y="${Y + g / 2 + 6 + (k === 'h' ? [9, -9, -9, 9][d] : 0)}" class="r4-mk" text-anchor="middle">${k === 'f' ? '1' : '½'}</text>`; }); return t; },
    drag: (p, s) => { const x = Math.floor((p[0] - x0) / g), y = Math.floor((p[1] - y0) / g), i = S.cells.findIndex(c => c[0] === x && c[1] === y); if (i < 0 || s.m[i]) return null; const m = s.m.slice(); m[i] = 1; sfx.pop(2); return { m }; },
    info: s => { const f = cnt(s, 'f'), hf = cnt(s, 'h'); return `เต็ม <b>${f}</b> ช่อง${r4vSep}ครึ่งช่อง <b>${hf}</b> ชิ้น = ${hf} ÷ 2 = ${r4f(hf / 2)} ช่อง${r4vSep}ประมาณ ${f} + ${r4f(hf / 2)} = <b>${r4f(f + hf / 2)} ตารางหน่วย</b>`; } });
}

/* ⑥ cut the L-shaped room: drag the cut line — two rectangles, or big minus the missing corner */
function r4vCut() {
  const U = R4SH.L(8, 6, 3, 2), F = r4Fit([[0, 0], [8, 0], [8, 6], [0, 6]], 560, 330, 62), k = F.k, mp = ([x, y]) => [F.ox + x * k, F.oy + y * k], LB = ['5 ม.', '2 ม.', '3 ม.', '4 ม.', '8 ม.', '6 ม.'];
  const txt = (x, y, t) => { const q = mp([x, y]); return `<text x="${a4n(q[0])}" y="${a4n(q[1]) + 6}" class="r4-lab" text-anchor="middle">${t}</text>`; };
  const rect = (x1, y1, x2, y2, col) => r4PolyS([[x1, y1], [x2, y1], [x2, y2], [x1, y2]].map(mp), { fill: col, rm: false, sw: 2 }) + (x2 - x1 >= 3 ? txt((x1 + x2) / 2, (y1 + y2) / 2, `${x2 - x1} × ${y2 - y1} = ${(x2 - x1) * (y2 - y1)}`) : '');
  const poly = Pu => r4PolyS(Pu.map(mp), { fill: '#E9E4F5', rm: false, sw: 2 });
  return tgScene({ W: 560, H: 330, st: { x: 2 }, cap: '<b>ลากเส้นตัด</b> (จุดสีชมพู) ไปทางซ้าย–ขวา — ตัดตรงไหนจึงได้<b>รูปสี่เหลี่ยมมุมฉาก</b>ทั้ง 2 ชิ้น',
    missions: [['ตัดแล้วได้รูปสี่เหลี่ยมมุมฉาก 2 ชิ้น', s => s.x === 5], ['ลากไปขวาสุด: เติมเป็นสี่เหลี่ยมใหญ่', s => s.x === 8]],
    svg: s => { const x = s.x; let t = '';
      if (x === 8) { const a = mp([5, 0]), b = mp([8, 2]); t += rect(0, 0, 8, 6, '#FFD27A') + `<rect x="${a[0]}" y="${a[1]}" width="${b[0] - a[0]}" height="${b[1] - a[1]}" fill="#fff" stroke="#E5487A" stroke-width="2.5" stroke-dasharray="7 5"/>` + txt(6.5, 1, '3 × 2 = 6'); }
      else t += (x > 5 ? poly([[0, 0], [5, 0], [5, 2], [x, 2], [x, 6], [0, 6]]) : rect(0, 0, x, 6, '#BFE3F7')) + (x < 5 ? poly([[x, 0], [5, 0], [5, 2], [8, 2], [8, 6], [x, 6]]) : rect(x, 2, 8, 6, '#C9F0D9'));
      t += r4PolyS(U.map(mp), { fill: 'none', labs: LB, rm: false });
      const top = mp([x, x <= 5 ? 0 : 2]), bot = mp([x, 6]); if (x < 8) t += `<path d="M${top.join(' ')} L${bot.join(' ')}" stroke="#E5487A" stroke-width="3.5" stroke-dasharray="9 6"/>`;
      return t + tgHandle(bot[0], bot[1] + 24, '#E5487A'); },
    drag: (p, s) => { const x = Math.max(1, Math.min(8, Math.round((p[0] - F.ox) / k))); if (x === s.x) return null; sfx.tap(); return { x }; },
    info: s => s.x === 5 ? `5 × 6 = 30 และ 3 × 4 = 12${r4vSep}รวม 30 + 12 = <b>42 ตร.ม.</b>` : s.x === 8 ? `สี่เหลี่ยมใหญ่ 8 × 6 = 48${r4vSep}ลบส่วนที่ขาด 3 × 2 = 6${r4vSep}48 − 6 = <b>42 ตร.ม.</b> เท่ากัน` : `ชิ้นสีม่วงยังเป็นรูปตัว L — ใช้ กว้าง × ยาว ไม่ได้${r4vSep}ลากเส้นตัดไปที่อื่น` });
}

/* ⑦ the same fence (20 m), another shape: drag the corner along the dashed line */
function r4vFence() {
  const g = 26, x0 = 46, y0 = 34, N = 10, M = 9, W = x0 + N * g + 74, H = y0 + M * g + 30;
  return tgScene({ W, H, st: { w: 2 }, cap: 'รั้วยาว <b>20 ม.</b> เท่าเดิม — <b>ลากมุมสีชมพู</b>เปลี่ยนรูปแปลง (1 ช่อง = 1 ม.)',
    missions: [['แปลงกว้าง 1 ม.', s => s.w === 1], ['แปลงมีพื้นที่ 24 ตร.ม.', s => s.w * (10 - s.w) === 24], ['แปลงที่มีพื้นที่มากที่สุด', s => s.w === 5]],
    svg: s => { const l = 10 - s.w, X = x0 + l * g, Y = y0 + s.w * g;
      return r4gridS(x0, y0, N, M, g, '#EAE4F4') + `<path d="M${x0 + 9 * g} ${y0 + g} L${x0 + g} ${y0 + 9 * g}" stroke="#E5487A" stroke-width="2" stroke-dasharray="5 6" opacity=".5"/>` + r4grass(x0, y0, l * g, s.w * g, 'r4vfg') + `<rect x="${x0}" y="${y0}" width="${l * g}" height="${s.w * g}" fill="none" stroke="#8A5A1E" stroke-width="5" stroke-dasharray="3 5"/>` +
        `<text x="${x0 + l * g / 2}" y="${y0 - 10}" class="r4-lab" text-anchor="middle">${l} ม.</text><text x="${x0 - 10}" y="${y0 + s.w * g / 2 + 6}" class="r4-lab" text-anchor="end">${s.w} ม.</text>` + tgHandle(X, Y, '#E5487A'); },
    drag: (p, s) => { const u = (p[0] - x0) / g, v = (p[1] - y0) / g, w = Math.max(1, Math.min(9, Math.round((10 - u + v) / 2))); if (w === s.w) return null; sfx.tap(); return { w }; },
    info: s => { const l = 10 - s.w; return `รั้ว 2 × (${l} + ${s.w}) = <b>20 ม.</b> เท่าเดิม${r4vSep}พื้นที่ ${s.w} × ${l} = <b>${s.w * l} ตร.ม.</b>` + (s.w === 5 ? `${r4vSep}เป็นรูปจัตุรัส ได้พื้นที่<b>มากที่สุด</b>` : ''); } });
}

/* ⑧ a garden 10 m long: drag the bottom edge — how much fence? (and back: fence → width) */
function r4vGarden() {
  const g = 23, x0 = 50, y0 = 36, L = 10, N = 12, M = 10, W = x0 + N * g + 40, H = y0 + M * g + 40;
  return tgScene({ W, H, st: { w: 1 }, cap: 'สวนยาว <b>10 ม.</b> — <b>ลากขอบล่าง</b> (จุดสีชมพู) เปลี่ยนความกว้าง แล้วดูว่าต้องใช้รั้วกี่เมตร',
    missions: [['ใช้รั้วพอดี 30 ม.', s => s.w === 5], ['ใช้รั้วพอดี 40 ม.', s => s.w === 10], ['ใช้รั้วพอดี 26 ม.', s => s.w === 3]],
    svg: s => { const Y = y0 + s.w * g; return r4gridS(x0, y0, N, M, g, '#EAE4F4') + r4grass(x0, y0, L * g, s.w * g, 'r4vgg') + `<rect x="${x0}" y="${y0}" width="${L * g}" height="${s.w * g}" fill="none" stroke="#8A5A1E" stroke-width="5" stroke-dasharray="3 5"/>` +
      `<text x="${x0 + L * g / 2}" y="${y0 - 10}" class="r4-lab" text-anchor="middle">10 ม.</text><text x="${x0 + L * g + 10}" y="${y0 + s.w * g / 2 + 6}" class="r4-lab">${s.w} ม.</text>` + tgHandle(x0 + L * g / 2, Y, '#E5487A'); },
    drag: (p, s) => { const w = Math.max(1, Math.min(M, Math.round((p[1] - y0) / g))); if (w === s.w) return null; sfx.tap(); return { w }; },
    info: s => { const P = 2 * (10 + s.w); return `รั้ว = 2 × (10 + ${s.w}) = 2 × ${10 + s.w} = <b>${P} ม.</b>${r4vSep}ย้อนกลับ: ${P} ÷ 2 = ${10 + s.w} → ${10 + s.w} − 10 = กว้าง <b>${s.w} ม.</b>` + (s.w === 10 ? `${r4vSep}กว้างเท่ายาว → <b>รูปสี่เหลี่ยมจัตุรัส</b> 4 × 10 = 40` : ''); } });
}

/* ⑨ lay the carpet row by row: area so far and the price */
function r4vCarpet() {
  const g = 44, x0 = 56, y0 = 40, Wd = 8, Hd = 5, W = x0 + Wd * g + 40, H = y0 + Hd * g + 46;
  return tgScene({ W, H, st: { r: 0 }, cap: 'ห้องยาว <b>8 ม.</b> กว้าง <b>5 ม.</b> พรม<b>ตารางเมตรละ 150 บาท</b> — <b>ลากม้วนพรม</b>ลงมาปูทีละแถว',
    missions: [['ค่าพรม 1,200 บาท', s => s.r === 1], ['ปูพรม 24 ตร.ม.', s => s.r === 3], ['ปูพรมเต็มห้อง', s => s.r === 5]],
    svg: s => { let t = `<rect x="${x0}" y="${y0}" width="${Wd * g}" height="${Hd * g}" fill="#F3E3C3"/>`; for (let j = 0; j < s.r; j++) for (let i = 0; i < Wd; i++) t += `<rect x="${x0 + i * g + 1.5}" y="${y0 + j * g + 1.5}" width="${g - 3}" height="${g - 3}" rx="3" fill="${(i + j) % 2 ? '#E77FA2' : '#D9668D'}"/>`;
      t += r4gridS(x0, y0, Wd, Hd, g, 'rgba(43,37,80,.25)') + `<rect x="${x0}" y="${y0}" width="${Wd * g}" height="${Hd * g}" fill="none" stroke="#2B2550" stroke-width="3"/>`;
      const Y = y0 + s.r * g; t += `<rect x="${x0 - 8}" y="${Y - 11}" width="${Wd * g + 16}" height="22" rx="11" fill="#B84D76" stroke="#7E2E50" stroke-width="2"/>`;
      return t + `<text x="${x0 + Wd * g / 2}" y="${y0 + Hd * g + 30}" class="r4-lab" text-anchor="middle">8 ม.</text><text x="${x0 - 14}" y="${y0 + Hd * g / 2 + 6}" class="r4-lab" text-anchor="end">5 ม.</text>` + tgHandle(x0 + Wd * g / 2, Y, '#E5487A'); },
    drag: (p, s) => { const r = Math.max(0, Math.min(Hd, Math.round((p[1] - y0) / g))); if (r === s.r) return null; sfx.tap(); return { r }; },
    info: s => s.r ? `ปูแล้ว ${s.r} แถว แถวละ 8 ตร.ม. → ${s.r} × 8 = <b>${8 * s.r} ตร.ม.</b>${r4vSep}ค่าพรม ${8 * s.r} × 150 = <b>${fmt(1200 * s.r)} บาท</b>` + (s.r === 5 ? `${r4vSep}เต็มห้อง = 5 × 8 = 40 ตร.ม.` : '') : 'ลากม้วนพรมลงมา' });
}

/* small pictures for examples and game items */
const r4vGridFig = (cells, o = {}) => { const g = o.g || 30, W = o.W || 7, H = o.H || 5, x0 = 20, y0 = 16; let s = r4gridS(x0, y0, W, H, g); cells.forEach(([x, y, k, d]) => { const X = x0 + x * g, Y = y0 + y * g; s += k === 'h' ? `<path d="M${r4triPts(X, Y, g, d).map(p => p.join(' ')).join(' L')}Z" fill="${o.col || '#9FD0F0'}" stroke="#4C83B8"/>` : `<rect x="${X}" y="${Y}" width="${g}" height="${g}" fill="${o.col || '#9FD0F0'}" stroke="#4C83B8"/>`; });
  return r4svg(x0 * 2 + W * g, y0 * 2 + H * g, s + (o.extra || '')); };
const r4vRectCells = (w, hh, ox = 1, oy = 1) => { const c = []; for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) c.push([ox + x, oy + y]); return c; };
const r4vTwo = (A, B) => { const g = 22, f = (C, x0, nm, col) => { const W = Math.max(...C.map(c => c[0])) + 1, H = Math.max(...C.map(c => c[1])) + 1; return { W, s: r4gridS(x0, 30, W, H, g) + C.map(([x, y]) => `<rect x="${x0 + x * g}" y="${30 + y * g}" width="${g}" height="${g}" fill="${col}" stroke="#4C83B8"/>`).join('') + `<text x="${x0 + W * g / 2}" y="20" class="r4-nm" text-anchor="middle">รูป ${nm}</text>`, H }; };
  const a = f(A, 16, 'ก', '#9FD0F0'), b = f(B, 16 + a.W * g + 36, 'ข', '#FFD27A'); return r4svg(16 + a.W * g + 36 + b.W * g + 16, 30 + Math.max(a.H, b.H) * g + 14, a.s + b.s); };
/* two ponds side by side in ONE picture (so the question keeps the picture-left / keypad-right layout) */
const r4vEst2 = (A, B) => { const g = 24, part = (S, ox, nm) => { const inner = r4EstSVG(S, {}, { g }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''); return `<g transform="translate(${ox} 22)">${inner}</g><text x="${ox + 24 + S.W * g / 2}" y="18" class="r4-nm" text-anchor="middle">บ่อ ${nm}</text>`; };
  const wA = 48 + A.W * g, wB = 48 + B.W * g; return r4svg(wA + wB + 10, 22 + 40 + Math.max(A.H, B.H) * g, part(A, 0, 'ก') + part(B, wA + 10, 'ข')); };
const r4vStairU = (a, b, c, d, e) => { const W = a + c + e, H = b + d + rnd(2, 4); return { U: [[0, 0], [a, 0], [a, b], [a + c, b], [a + c, b + d], [W, b + d], [W, H], [0, H]], W, H }; };

/* =========================================================
   v250 (ผู้ใช้ขอ: "สอนให้เห็นภาพก่อน แล้วมีเกมให้ปรับ · ใช้รูป ไม่เอาแฟลชการ์ดที่มีแค่ตัวอักษร")
   หน้าแรกของทุกด่าน = ดูภาพ: แตะรูปทีละรูป รูปจะเปลี่ยนให้เห็นหลักการ (มุมฉากขึ้น ด้านเปลี่ยนสี กระเบื้องปูเต็ม ด้านยืดต่อกัน)
   ========================================================= */
const R4VC = { o: '#EC7F1E', b: '#3C8DDB', g: '#1B8862', p: '#E5487A', y: '#FFD27A', sky: '#BFE3F7', sand: '#FFE7A8', mint: '#C9F0D9', ink: '#2B2550', wood: '#8A5A1E' };
const r4vH = s => `<g class="r4v-hl">${s}</g>`;
const r4vR = (x, y, w, hh) => [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]];
const r4vMk = P => r4PolyS(P, { fill: 'none', stroke: 'none', sw: 0 });
const r4vSd = (P, cols, sw = 6) => P.map((p, i) => { const q = P[(i + 1) % P.length]; return cols[i] ? `<path d="M${a4n(p[0])} ${a4n(p[1])} L${a4n(q[0])} ${a4n(q[1])}" stroke="${cols[i]}" stroke-width="${sw}" stroke-linecap="round"/>` : ''; }).join('');
const r4vT = (x, y, t, col = R4VC.ink, cls = 'r4v-tx', anc = 'middle') => `<text x="${a4n(x)}" y="${a4n(y)}" class="${cls}" text-anchor="${anc}" style="fill:${col}">${t}</text>`;
const r4vRect = (x, y, w, hh, fill = 'none', st = R4VC.ink, sw = 2.6, dash = '') => `<rect x="${a4n(x)}" y="${a4n(y)}" width="${a4n(w)}" height="${a4n(hh)}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const r4vLn = (a, b, col = R4VC.ink, sw = 3, dash = '') => `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(b[0])} ${a4n(b[1])}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const r4vDot = (p, col = R4VC.p, r = 5) => `<circle cx="${a4n(p[0])}" cy="${a4n(p[1])}" r="${r}" fill="${col}" stroke="#fff" stroke-width="1.5"/>`;
/* unit tiles: n across, m down (cols = list or (i, j) => colour) · num = write 1, 2, 3 … in the tiles */
const r4vTl = (x, y, g, n, m, cols = ['#FFC24C', '#FFD27A'], num) => { let s = ''; for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) { s += `<rect x="${a4n(x + i * g + 1.2)}" y="${a4n(y + j * g + 1.2)}" width="${a4n(g - 2.4)}" height="${a4n(g - 2.4)}" rx="2.5" fill="${typeof cols === 'function' ? cols(i, j) : cols[(i + j) % cols.length]}"/>`; if (num) s += r4vT(x + i * g + g / 2, y + j * g + g / 2 + 4.5, j * n + i + 1, R4VC.ink, 'r4v-sm'); } return s; };
/* a bar made of the sides laid end to end (perimeter "unrolled") */
const r4vStrip = (x, y, u, parts, hh = 24) => { let s = '', X = x; parts.forEach(([L, col, lab]) => { s += `<rect x="${a4n(X)}" y="${y}" width="${a4n(L * u)}" height="${hh}" rx="4" fill="${col}" stroke="#fff" stroke-width="2"/>` + (lab ? r4vT(X + L * u / 2, y + hh / 2 + 5, lab, '#fff', 'r4v-bar') : ''); X += L * u; }); return s; };
/* a rectilinear shape given in grid units, fitted into a box of the panel */
const r4vFitU = (U, x, y, w, hh, pad = 16) => { const F = r4Fit(U, w, hh, pad); return { P: F.P.map(([a, b]) => [a + x, b + y]), k: F.k, mp: ([a, b]) => [F.ox + a * F.k + x, F.oy + b * F.k + y] }; };
const r4vKid = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-104" r="12" fill="#FFD9B3" stroke="${R4VC.ink}" stroke-width="2"/><path d="M0 -92 V-46 M0 -80 L-16 -62 M0 -80 L16 -62 M0 -46 L-12 0 M0 -46 L12 0" stroke="${R4VC.ink}" stroke-width="4" stroke-linecap="round" fill="none"/></g>`;
const r4vHouse = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-16 0 V-18 H16 V0 Z" fill="#FFF3D6" stroke="${R4VC.ink}" stroke-width="1.6"/><path d="M-20 -17 L0 -32 L20 -17 Z" fill="#D9534F" stroke="${R4VC.ink}" stroke-width="1.6"/><rect x="-4" y="-10" width="8" height="10" fill="#8A5A1E"/></g>`;
const r4vTree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2.5" y="-6" width="5" height="10" fill="#8A5A1E"/><circle cx="0" cy="-13" r="10" fill="#3FA35B" stroke="#2C7A42" stroke-width="1.4"/></g>`;

/* the page: a row of pictures — tap one, it changes to show the idea (every picture must be tapped) */
function r4vSee(cap, list, fin) {
  const wrap = tgWrap(), out = fNote2(), row = h('div', { class: 'r4v-see', 'data-n': list.length }); let left = list.length;
  list.forEach((p, i) => { const W = p.W || 240, H = p.H || 170, pic = on => `<svg viewBox="0 0 ${W} ${H}" class="r4v-ps" aria-hidden="true">${p.f(on)}</svg>`;
    const b = h('button', { class: 'r4v-pan ia', html: `<span class="r4v-pt">${p.t}</span>${pic(false)}<span class="r4v-pl">แตะดูรูป 👆</span>` });
    b.onclick = e => { e.stopPropagation(); if (b.dataset.tapped) return; b.dataset.tapped = 1; b.classList.add('on'); b.innerHTML = `<span class="r4v-pt">${p.t}</span>${pic(true)}<span class="r4v-pl">${p.s}</span>`; left--; sfx.pop(list.length - left + 1);
      say(p.s.replace(/<br>/g, ' ').replace(/<[^>]+>/g, ''), true); out.innerHTML = left ? `แตะรูปที่เหลืออีก <b>${left}</b> รูป` : fin; if (!left) { sfx.ok(); teachDone(wrap); } };
    row.append(b); });
  out.innerHTML = `แตะรูปทีละรูป ดูว่ารูปเปลี่ยนอย่างไร (${list.length} รูป)`;
  wrap.append(h('div', { class: 'cap', html: cap }), row, out); return wrap;
}

/* pictures of each lesson: f(on) draws the panel before (false) and after the tap (true) */
const R4V_SEE = {
  1481: () => { const R = r4vR(40, 40, 160, 90), S = r4vR(74, 32, 96, 96), D = [[120, 24], [178, 82], [120, 140], [62, 82]], Pg = [[74, 40], [210, 40], [166, 128], [30, 128]];
    return [
      { t: 'รูปสี่เหลี่ยมผืนผ้า', f: on => r4PolyS(R, { fill: R4VC.sand, rm: false }) + (on ? r4vH(r4vSd(R, [R4VC.o, R4VC.b, R4VC.o, R4VC.b]) + r4vMk(R) + r4vT(120, 31, '8', R4VC.o) + r4vT(120, 151, '8', R4VC.o) + r4vT(27, 91, '5', R4VC.b) + r4vT(213, 91, '5', R4VC.b)) : ''), s: 'มุมฉาก <b>4 มุม</b><br>ด้านตรงข้ามยาวเท่ากัน' },
      { t: 'รูปสี่เหลี่ยมจัตุรัส', f: on => r4PolyS(S, { fill: R4VC.sky, rm: false }) + (on ? r4vH(r4vSd(S, [R4VC.g, R4VC.g, R4VC.g, R4VC.g]) + r4vMk(S) + r4vT(122, 24, '6', R4VC.g) + r4vT(122, 148, '6', R4VC.g) + r4vT(60, 86, '6', R4VC.g) + r4vT(184, 86, '6', R4VC.g)) : ''), s: 'มุมฉาก <b>4 มุม</b><br>ยาวเท่ากันทุกด้าน' },
      { t: 'วางเอียง', f: on => r4PolyS(D, { fill: R4VC.sky, rm: false }) + (on ? r4vH(r4vSd(D, [R4VC.g, R4VC.g, R4VC.g, R4VC.g]) + r4vMk(D)) : ''), s: 'มุมฉาก 4 มุม ด้านเท่ากัน<br>ยังเป็น<b>จัตุรัส</b>' },
      { t: 'ด้านตรงข้ามเท่ากัน', f: on => r4PolyS(Pg, { fill: '#F9D3E0', rm: false }) + (on ? r4vH(r4vSd(Pg, [R4VC.o, R4VC.b, R4VC.o, R4VC.b], 5) + Pg.map(([x, y], i) => r4vT(x + [16, -18, -14, 18][i], y + [20, 20, -8, -8][i], '✗', R4VC.p, 'r4v-big')).join('') + r4vT(120, 160, 'ไม่มีมุมฉาก', R4VC.p)) : ''), s: 'มุมไม่ใช่มุมฉาก<br>→ <b>ไม่ใช่</b>สี่เหลี่ยมมุมฉาก' }]; },
  1482: () => { const R = r4vR(50, 38, 140, 86), S = r4vR(72, 30, 96, 96), base = P => r4PolyS(P, { fill: R4VC.sand, names: 'ABCD', rm: false });
    return [
      { t: 'เส้นทแยงมุม', f: on => base(R) + (on ? r4vH(r4vLn(R[0], R[2], R4VC.b, 4.5) + r4vLn(R[1], R[3], R4VC.g, 4.5) + r4vT(86, 78, 'AC', R4VC.b) + r4vT(154, 78, 'BD', R4VC.g)) : ''), s: 'เชื่อมจุดยอดที่<b>ไม่อยู่ติดกัน</b><br>มี 2 เส้น: AC กับ BD' },
      { t: 'ด้าน', f: on => base(R) + (on ? r4vH(r4vSd(R, [R4VC.o, R4VC.o, R4VC.o, R4VC.o], 6) + r4vT(120, 86, 'AB BC CD DA', R4VC.o)) : ''), s: 'จุดยอดที่<b>อยู่ติดกัน</b><br>เป็นด้าน ไม่ใช่เส้นทแยงมุม' },
      { t: 'ของรูปผืนผ้า', f: on => on ? r4vDiagBody({ w: 2, h: 1 }, { P: R }) : base(R) + r4vLn(R[0], R[2], '#B7AED3', 2, '5 5') + r4vLn(R[1], R[3], '#B7AED3', 2, '5 5'), s: 'ยาวเท่ากัน<br>และ<b>แบ่งครึ่ง</b>ซึ่งกันและกัน' },
      { t: 'ของรูปจัตุรัส', f: on => on ? r4vDiagBody({ w: 1, h: 1 }, { P: S }) : r4PolyS(S, { fill: R4VC.sky, names: 'ABCD', rm: false }) + r4vLn(S[0], S[2], '#B7AED3', 2, '5 5') + r4vLn(S[1], S[3], '#B7AED3', 2, '5 5'), s: 'ยาวเท่ากัน แบ่งครึ่งกัน<br>และ<b>ตั้งฉากกัน</b>ที่จุด O' }]; },
  1483: () => { const A = [50, 124], B = [190, 124], D = [50, 56], C = [190, 56];
    const ruler = `<rect x="34" y="132" width="172" height="20" rx="3" fill="#FFF3C4" stroke="${R4VC.wood}" stroke-width="1.6"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${50 + i * 140 / 6} 132 v8" stroke="${R4VC.wood}" stroke-width="1.4"/>`).join('');
    const s1 = r4vLn(A, B, R4VC.ink, 3.5) + r4vDot(A) + r4vDot(B) + r4vT(38, 120, 'A', R4VC.ink, 'r4v-nm') + r4vT(202, 120, 'B', R4VC.ink, 'r4v-nm') + r4vT(120, 116, '6 ซม.');
    const s2 = r4vLn(A, [50, 22], R4VC.b, 2.4, '6 5') + r4vLn(B, [190, 22], R4VC.b, 2.4, '6 5') + `<path d="M50 110 h14 v14 M190 110 h-14 v14" fill="none" stroke="${R4VC.p}" stroke-width="2.4"/>` + r4vT(82, 104, '90°', R4VC.p) + r4vT(158, 104, '90°', R4VC.p);
    const s3 = r4vDot(D, R4VC.g, 6) + r4vDot(C, R4VC.g, 6) + r4vT(28, 94, '3 ซม.', R4VC.g) + r4vT(212, 94, '3 ซม.', R4VC.g);
    const s4 = `<path d="M${A} L${B} L${C} L${D} Z" fill="${R4VC.sand}" opacity=".75"/>` + r4vLn(D, C, R4VC.ink, 3.5) + r4vLn(A, D, R4VC.ink, 3.5) + r4vLn(B, C, R4VC.ink, 3.5) + r4vT(38, 50, 'D', R4VC.ink, 'r4v-nm') + r4vT(202, 50, 'C', R4VC.ink, 'r4v-nm');
    return [
      { t: '① ลากด้านแรก', f: on => ruler + (on ? r4vH(s1) : ''), s: 'ใช้ไม้บรรทัด<br>ลาก AB ยาว 6 ซม.' },
      { t: '② สร้างมุมฉาก', f: on => s1 + (on ? r4vH(s2) : ''), s: 'สร้างมุม <b>90°</b><br>ที่จุด A และจุด B' },
      { t: '③ วัดด้านที่ตั้งฉาก', f: on => s1 + s2 + (on ? r4vH(s3) : ''), s: 'วัดขึ้นไป 3 ซม.<br>ทำจุด D และ C' },
      { t: '④ ลากเชื่อม', f: on => (on ? r4vH(s4) : '') + s1 + s2 + s3, s: 'ลาก DC<br>ได้รูปสี่เหลี่ยมผืนผ้า <b>ABCD</b>' }]; },
  1484: () => { const R = r4vR(40, 38, 160, 84), R2 = r4vR(64, 24, 112, 50), S = r4vR(90, 22, 60, 60);
    const tri = (x, y, d) => { const P = { r: [[x - 6, y - 7], [x + 6, y], [x - 6, y + 7]], d: [[x - 7, y - 6], [x + 7, y - 6], [x, y + 6]], l: [[x + 6, y - 7], [x - 6, y], [x + 6, y + 7]], u: [[x - 7, y + 6], [x + 7, y + 6], [x, y - 6]] }[d]; return `<path d="M${P.join(' L')}Z" fill="${R4VC.p}"/>`; };
    return [
      { t: 'เดินรอบ 1 รอบ', f: on => r4PolyS(R, { fill: R4VC.sand, rm: false }) + r4vT(120, 30, '9 ม.') + r4vT(20, 85, '4 ม.') + (on ? r4vH(`<path d="M48 46 H192 V114 H48 Z" fill="none" stroke="${R4VC.p}" stroke-width="3.5" stroke-dasharray="8 6"/>` + tri(120, 46, 'r') + tri(192, 80, 'd') + tri(120, 114, 'l') + tri(48, 80, 'u') + r4vT(120, 86, 'รอบรูป 26 ม.', R4VC.p) + `<g transform="translate(40 34) scale(1.2)">${r4camel()}</g>`) : ''), s: 'เดินรอบ 1 รอบ = <b>ความยาวรอบรูป</b><br>9 + 4 + 9 + 4 = 26 ม.' },
      { t: 'ผืนผ้า: ยืดด้านต่อกัน', f: on => r4PolyS(R2, { fill: R4VC.sand, rm: false }) + r4vSd(R2, [R4VC.o, R4VC.b, R4VC.o, R4VC.b], 5) + r4vT(120, 17, '9', R4VC.o) + r4vT(120, 92, '9', R4VC.o) + r4vT(52, 54, '4', R4VC.b) + r4vT(188, 54, '4', R4VC.b) + (on ? r4vH(r4vStrip(16, 106, 8, [[9, R4VC.o, '9'], [4, R4VC.b, '4'], [9, R4VC.o, '9'], [4, R4VC.b, '4']]) + r4vT(120, 156, '2 × (9 + 4) = 26')) : ''), s: 'ด้านต่อกัน 9 + 4 + 9 + 4 = <b>26</b><br>= 2 × (กว้าง + ยาว)' },
      { t: 'จัตุรัส: ยืดด้านต่อกัน', f: on => r4PolyS(S, { fill: R4VC.sky, rm: false }) + r4vSd(S, [R4VC.g, R4VC.g, R4VC.g, R4VC.g], 5) + r4vT(120, 15, '5', R4VC.g) + r4vT(120, 98, '5', R4VC.g) + r4vT(78, 57, '5', R4VC.g) + r4vT(162, 57, '5', R4VC.g) + (on ? r4vH(r4vStrip(20, 106, 10, [[5, R4VC.g, '5'], [5, '#3FA37A', '5'], [5, R4VC.g, '5'], [5, '#3FA37A', '5']]) + r4vT(120, 156, '4 × 5 = 20')) : ''), s: 'ยาวเท่ากัน 4 ด้าน<br>→ <b>4 × ด้าน</b>' }]; },
  1485: () => { const L = r4vFitU(R4SH.L(9, 7, 4, 3), 0, 0, 240, 170, 30), ST = r4vFitU([[0, 0], [3, 0], [3, 1], [5, 1], [5, 3], [7, 3], [7, 5], [0, 5]], 0, 0, 240, 170, 24), U = r4vFitU(R4SH.U(8, 5, 2, 3, 3), 0, 0, 240, 170, 26);
    const ed = (F, i, col, sw = 6) => r4vLn(F.P[i], F.P[(i + 1) % F.P.length], col, sw);
    return [
      { t: 'ด้านที่ไม่บอก', f: on => r4PolyS(L.P, { fill: R4VC.sand, rm: false, labs: ['5', '3', '4', '?', '9', '7'] }) + (on ? r4vH(ed(L, 3, R4VC.p) + ed(L, 1, R4VC.o) + ed(L, 5, R4VC.b) + r4vT(...L.mp([6.4, 5.4]), '7 − 3 = 4', R4VC.p)) : ''), s: 'ด้านขวาล่าง = 7 − 3 = <b>4</b><br>(ดูจากด้านที่ขนานกัน)' },
      { t: 'ขั้นบันได', f: on => r4PolyS(ST.P, { fill: R4VC.sand, rm: false }) + (on ? r4vH(`<path d="M${ST.mp([0, 0])} H${ST.mp([7, 0])[0]} V${ST.mp([7, 5])[1]}" fill="none" stroke="#9A8FC4" stroke-width="2.4" stroke-dasharray="6 5"/>` + [0, 2, 4].map(i => ed(ST, i, R4VC.o, 5)).join('') + [1, 3, 5].map(i => ed(ST, i, R4VC.b, 5)).join('') + ed(ST, 6, R4VC.o, 5) + ed(ST, 7, R4VC.b, 5)) : ''), s: 'ดันขั้นออกไป = สี่เหลี่ยมที่ล้อมรอบ<br>รอบรูป<b>เท่ากัน</b>' },
      { t: 'รูปตัว U', f: on => r4PolyS(U.P, { fill: R4VC.sand, rm: false }) + (on ? r4vH(r4vLn(U.mp([3, 0]), U.mp([5, 0]), '#9A8FC4', 2.4, '6 5') + ed(U, 1, R4VC.p, 6) + ed(U, 3, R4VC.p, 6) + r4vT(...U.mp([4, 4.3]), '+ 2 ด้าน', R4VC.p)) : ''), s: 'ร่องเว้า: เดินเพิ่ม 2 ด้าน<br>รอบรูป<b>มากกว่า</b>สี่เหลี่ยมล้อมรอบ' }]; },
  1486: () => [
    { t: 'พื้นที่', f: on => (on ? r4vH(r4vRect(40, 30, 160, 100, '#FFC24C', 'none', 0) + r4vT(120, 86, 'ผิวข้างใน', R4VC.ink, 'r4v-big')) : r4vRect(40, 30, 160, 100, '#fff', 'none', 0)) + r4vRect(40, 30, 160, 100), s: '<b>พื้นที่</b> = ขนาดของผิวข้างในรูป<br>(ส่วนที่ทาสีได้เต็ม)' },
    { t: 'ช่องละ 1 ตารางหน่วย', f: on => (on ? r4vH(r4vTl(45, 30, 30, 5, 3, undefined, true)) : r4vTl(45, 30, 30, 1, 1, ['#FFC24C'])) + r4gridS(45, 30, 5, 3, 30, '#B7AED3') + r4vRect(45, 30, 150, 90), s: 'นับได้ 15 ช่อง<br>= <b>15 ตารางหน่วย</b>' },
    { t: 'ครึ่งช่อง', f: on => on ? r4vH(`<path d="M92 50 L148 106 L92 106 Z" fill="#FFD27A"/><path d="M92 50 L148 50 L148 106 Z" fill="#FFB84C"/>` + r4vRect(92, 50, 56, 56) + r4vT(120, 140, '= 1 ตารางหน่วย', R4VC.g)) : r4vRect(30, 50, 56, 56, 'none', '#B7AED3', 1.6, '4 4') + r4vRect(154, 50, 56, 56, 'none', '#B7AED3', 1.6, '4 4') + `<path d="M30 50 L86 106 L30 106 Z" fill="#FFD27A" stroke="${R4VC.ink}" stroke-width="2"/><path d="M154 50 L210 50 L210 106 Z" fill="#FFB84C" stroke="${R4VC.ink}" stroke-width="2"/>` + r4vT(46, 96, '½') + r4vT(194, 70, '½'), s: 'ครึ่งช่อง 2 ชิ้นต่อกัน<br>= <b>1</b> ตารางหน่วย' },
    { t: 'รูปต่างกัน', f: on => (on ? r4vH(r4vTl(14, 56, 16, 6, 2) + r4vTl(150, 44, 16, 4, 3, ['#9FD0F0', '#BFE3F7']) + r4vT(62, 112, '12 ช่อง', R4VC.o) + r4vT(182, 116, '12 ช่อง', R4VC.b)) : '') + r4gridS(14, 56, 6, 2, 16, '#B7AED3') + r4vRect(14, 56, 96, 32) + r4gridS(150, 44, 4, 3, 16, '#B7AED3') + r4vRect(150, 44, 64, 48), s: '6 × 2 กับ 4 × 3<br>พื้นที่<b>เท่ากัน</b> 12 ช่อง' }],
  1487: () => { const perf = (x, y, w, hh) => { let s = r4vRect(x, y, w, hh, '#FFF', R4VC.p, 2); for (let i = 0; i <= w; i += 10) s += `<circle cx="${x + i}" cy="${y}" r="2.6" fill="#F3EFFA"/><circle cx="${x + i}" cy="${y + hh}" r="2.6" fill="#F3EFFA"/>`; for (let j = 10; j < hh; j += 10) s += `<circle cx="${x}" cy="${y + j}" r="2.6" fill="#F3EFFA"/><circle cx="${x + w}" cy="${y + j}" r="2.6" fill="#F3EFFA"/>`; return s + `<path d="M${x + w / 2} ${y + hh * .7} C${x + 4} ${y + hh * .45} ${x + w / 2 - 6} ${y + hh * .2} ${x + w / 2} ${y + hh * .38} C${x + w / 2 + 6} ${y + hh * .2} ${x + w - 4} ${y + hh * .45} ${x + w / 2} ${y + hh * .7}Z" fill="${R4VC.p}"/>`; };
    return [
      { t: 'ตารางเซนติเมตร', f: on => perf(40, 30, 60, 80) + r4vRect(162, 80, 20, 20, R4VC.y) + r4vT(172, 120, '1 ซม.', R4VC.ink, 'r4v-sm') + (on ? r4vH(r4gridS(40, 30, 3, 4, 20, 'rgba(43,37,80,.55)') + r4vT(70, 136, '12 ตร.ซม.', R4VC.p) + r4vT(172, 70, '1 ตร.ซม.', R4VC.o, 'r4v-sm')) : ''), s: 'ของชิ้นเล็ก เช่น แสตมป์<br>→ <b>ตารางเซนติเมตร</b>' },
      { t: 'ตารางเมตร', f: on => r4vRect(36, 50, 96, 96, on ? '#FFC24C' : '#FFF6E0') + r4vT(84, 42, '1 ม.') + r4vT(20, 102, '1 ม.') + r4vKid(186, 146, .95) + (on ? r4vH(r4vT(84, 104, '1 ตร.ม.', R4VC.ink, 'r4v-big')) : ''), s: 'จัตุรัสด้านละ 1 เมตร = <b>1 ตร.ม.</b><br>ใช้กับห้อง สนาม' },
      { t: 'ตารางวา', f: on => r4grass(64, 30, 112, 112, 'r4vsg') + r4vT(120, 22, '1 วา = 2 ม.') + (on ? r4vH(r4gridS(64, 30, 2, 2, 56, '#2B2550') + [[92, 64], [148, 64], [92, 120], [148, 120]].map(([x, y]) => r4vT(x, y, '1 ตร.ม.', R4VC.ink, 'r4v-sm')).join('') + r4vT(120, 162, '= 4 ตร.ม.', R4VC.p)) : ''), s: '1 ตารางวา = 2 ม. × 2 ม.<br>= <b>4 ตร.ม.</b>' },
      { t: 'ที่ดิน', f: on => r4grass(35, 34, 170, 102, 'r4vld') + r4vHouse(120, 104, 1.3) + (on ? r4vH(r4gridS(35, 34, 5, 3, 34, 'rgba(43,37,80,.6)') + r4vT(120, 160, '15 ตารางวา', R4VC.p)) : ''), s: 'ที่ดินวัดเป็น<b>ตารางวา</b>' }]; },
  1488: () => { const S = r4EstShape(0), V = r4estVal(S), g = 22, x0 = (240 - S.W * g) / 2, y0 = 18;
    const pond = (F, Hh) => { let s = r4gridS(x0, y0, S.W, S.H, g); S.cells.forEach(([x, y, k, d]) => { const X = x0 + x * g, Y = y0 + y * g, on = k === 'f' ? F : Hh, col = on ? (k === 'f' ? '#7FCF9E' : '#FFD27A') : '#9FD0F0';
      s += k === 'f' ? `<rect x="${X}" y="${Y}" width="${g}" height="${g}" fill="${col}" stroke="#4C83B8" stroke-width=".8"/>` : `<path d="M${r4triPts(X, Y, g, d).map(p => p.join(' ')).join(' L')}Z" fill="${col}" stroke="#4C83B8" stroke-width=".8"/>`;
      if (on) s += r4vT(X + g / 2 + (k === 'h' ? [-4, -4, 4, 4][d] : 0), Y + g / 2 + 4 + (k === 'h' ? [4, -4, -4, 4][d] : 0), k === 'f' ? '1' : '½', R4VC.ink, 'r4v-sm'); }); return s; };
    return [
      { t: 'ช่องเต็ม', f: on => pond(on, false), s: `ช่องเต็ม <b>${V.f}</b> ช่อง<br>นับช่องละ 1` },
      { t: 'ครึ่งช่อง', f: on => pond(false, on), s: `ครึ่งช่อง ${V.hf} ชิ้น<br>= ${V.hf} ÷ 2 = <b>${V.hf / 2}</b> ช่อง` },
      { t: 'รวมกัน', f: on => pond(on, on) + (on ? r4vH(r4vT(120, 160, `${V.f} + ${V.hf / 2} = ${V.v}`, R4VC.p)) : ''), s: `พื้นที่<b>ประมาณ ${V.v}</b> ตารางหน่วย` }]; },
  1489: () => [
    { t: 'นับเป็นแถว', f: on => (on ? r4vH(r4vTl(60, 28, 30, 5, 3, (i, j) => ['#FFB84C', '#7FCF9E', '#9FD0F0'][j]) + [0, 1, 2].map(j => r4vT(40, 28 + j * 30 + 20, `แถว ${j + 1}`, R4VC.ink, 'r4v-sm')).join('') + r4vT(135, 140, 'แถวละ 5 ช่อง')) : r4vTl(60, 28, 30, 5, 3, ['#FFD27A'])) + r4gridS(60, 28, 5, 3, 30, '#E0B45E') + r4vRect(60, 28, 150, 90), s: '3 แถว แถวละ 5 ช่อง<br>3 × 5 = <b>15</b>' },
    { t: 'กว้าง × ยาว', f: on => r4vRect(60, 34, 150, 90, R4VC.sand) + r4vT(135, 26, '5 ซม.') + r4vT(34, 84, '3 ซม.') + (on ? r4vH(r4gridS(60, 34, 5, 3, 30, '#E0B45E') + r4vRect(60, 34, 150, 90) + r4vT(135, 152, '3 × 5 = 15 ตร.ซม.', R4VC.p)) : ''), s: 'พื้นที่ = กว้าง × ยาว<br>= <b>15 ตร.ซม.</b>' },
    { t: 'หาด้านที่หายไป', f: on => r4vRect(60, 34, 150, 100, R4VC.sand) + r4vT(40, 90, '4') + (on ? r4vH(r4gridS(60, 34, 6, 4, 25, '#E0B45E') + r4vRect(60, 34, 150, 100) + r4vT(135, 26, '6', R4VC.p, 'r4v-big') + r4vT(135, 158, '24 ÷ 4 = 6', R4VC.p)) : r4vT(135, 26, '?', R4VC.p, 'r4v-big') + r4vT(135, 90, 'พื้นที่ 24')), s: 'พื้นที่ ÷ ด้านที่รู้<br>24 ÷ 4 = <b>6</b>' }],
  1490: () => [
    { t: 'ด้าน × ด้าน', f: on => (on ? r4vH(r4vTl(64, 20, 28, 4, 4, ['#9FD0F0', '#BFE3F7']) + r4vT(120, 160, '4 × 4 = 16', R4VC.b)) : '') + r4gridS(64, 20, 4, 4, 28, '#B7AED3') + r4vRect(64, 20, 112, 112) + r4vT(120, 14, '4') + r4vT(50, 82, '4'), s: 'จัตุรัส: พื้นที่ = <b>ด้าน × ด้าน</b>' },
    { t: 'ระวัง! 4 × ด้าน', f: on => r4vTl(70, 16, 20, 5, 5, on ? ['#9FD0F0', '#BFE3F7'] : ['#EEEAF6']) + r4vRect(70, 16, 100, 100, 'none', on ? R4VC.p : R4VC.ink, on ? 6 : 2.6) + r4vT(120, 12 + 0, '') + (on ? r4vH(r4vT(120, 140, 'เส้นรอบ 4 × 5 = 20', R4VC.p) + r4vT(120, 162, 'ข้างใน 5 × 5 = 25', R4VC.b)) : r4vT(120, 140, 'ด้านละ 5')), s: '4 × ด้าน = <b>รอบรูป</b> (เส้น)<br>ด้าน × ด้าน = <b>พื้นที่</b> (ข้างใน)' },
    { t: 'ย้อนกลับ', f: on => on ? r4vH(r4vTl(64, 20, 16, 7, 7, ['#FFC24C', '#FFD27A']) + r4gridS(64, 20, 7, 7, 16, '#E0B45E') + r4vRect(64, 20, 112, 112) + r4vT(120, 14, '7', R4VC.p, 'r4v-big') + r4vT(50, 82, '7', R4VC.p, 'r4v-big') + r4vT(120, 160, '7 × 7 = 49', R4VC.p)) : r4vRect(64, 20, 112, 112, R4VC.sand) + r4vT(120, 14, '?', R4VC.p, 'r4v-big') + r4vT(50, 82, '?', R4VC.p, 'r4v-big') + r4vT(120, 82, 'พื้นที่ 49'), s: 'จำนวนใดคูณตัวเองได้ 49?<br>7 × 7 = 49 → ด้านละ <b>7</b>' }],
  1491: () => { const F = r4vFitU(R4SH.L(8, 6, 3, 2), 0, 0, 240, 170, 26), labs = ['5', '2', '3', '4', '8', '6'], ru = (x1, y1, x2, y2, col) => r4PolyS([[x1, y1], [x2, y1], [x2, y2], [x1, y2]].map(F.mp), { fill: col, rm: false, sw: 1.2 }), T2 = (x, y, t, col = R4VC.ink) => r4vT(...F.mp([x, y]), t, col, 'r4v-big');
    const base = r4PolyS(F.P, { fill: R4VC.sand, labs, rm: false }), edge = r4PolyS(F.P, { fill: 'none', labs, rm: false });
    return [
      { t: 'ตัดแนวตั้ง', f: on => on ? r4vH(ru(0, 0, 5, 6, R4VC.sky) + ru(5, 2, 8, 6, R4VC.mint) + r4vLn(F.mp([5, 2]), F.mp([5, 6]), R4VC.p, 3, '7 5') + edge + T2(2.5, 3.4, '30') + T2(6.5, 4.4, '12')) : base, s: '5 × 6 + 3 × 4<br>= 30 + 12 = <b>42</b>' },
      { t: 'ตัดแนวนอน', f: on => on ? r4vH(ru(0, 0, 5, 2, R4VC.y) + ru(0, 2, 8, 6, R4VC.sky) + r4vLn(F.mp([0, 2]), F.mp([5, 2]), R4VC.p, 3, '7 5') + edge + T2(2.5, 1.4, '10') + T2(4, 4.4, '32')) : base, s: '5 × 2 + 8 × 4<br>= 10 + 32 = <b>42</b>' },
      { t: 'ใหญ่ลบเล็ก', f: on => on ? r4vH(ru(0, 0, 8, 6, R4VC.sand) + `<path d="M${F.mp([5, 0])} L${F.mp([8, 0])} L${F.mp([8, 2])} L${F.mp([5, 2])} Z" fill="#F9D3E0" stroke="${R4VC.p}" stroke-width="2.4" stroke-dasharray="6 4"/>` + T2(6.5, 1.4, '6', R4VC.p) + T2(3, 3.6, '48') + r4PolyS(F.P, { fill: 'none', labs: ['5', '', '', '4', '8', '6'], rm: false })) : base, s: '8 × 6 − 3 × 2<br>= 48 − 6 = <b>42</b>' }]; },
  1492: () => { const fence = (x, y, w, hh) => r4vRect(x, y, w, hh, 'none', R4VC.wood, 4.5, '3 5'), plot = (x, y, g, n, m, on, cols) => (on ? r4vTl(x, y, g, n, m, cols) : '') + r4gridS(x, y, n, m, g, '#D8CDB8');
    return [
      { t: 'ล้อมรั้ว', f: on => r4vRect(40, 30, 160, 100, '#F3E3C3', 'none', 0) + (on ? r4vH(fence(40, 30, 160, 100) + [[40, 30], [120, 30], [200, 30], [200, 80], [200, 130], [120, 130], [40, 130], [40, 80]].map(p => r4vDot(p, R4VC.wood, 5)).join('') + r4vT(120, 156, 'ไปตามขอบ', R4VC.wood)) : r4vRect(40, 30, 160, 100, 'none', '#B7AED3', 1.6, '4 4')), s: 'ล้อมรั้ว = ไปตาม<b>ขอบ</b><br>→ ความยาวรอบรูป' },
      { t: 'ปูหญ้า', f: on => (on ? r4vH(r4grass(40, 30, 160, 100, 'r4vgr') + r4vT(120, 156, 'เต็มผิว', R4VC.g)) : r4vRect(40, 30, 160, 100, '#F3E3C3', '#B7AED3', 1.6, '4 4')), s: 'ปูหญ้า = <b>เต็มผิว</b><br>→ พื้นที่' },
      { t: 'รั้วยาวเท่ากัน', f: on => plot(8, 84, 13, 9, 1, on, ['#A8DC8E', '#BDE6A6']) + fence(8, 84, 117, 13) + plot(160, 40, 13, 5, 5, on, ['#A8DC8E', '#BDE6A6']) + fence(160, 40, 65, 65) + r4vT(66, 74, 'รั้ว 20 ม.', R4VC.wood, 'r4v-sm') + r4vT(192, 32, 'รั้ว 20 ม.', R4VC.wood, 'r4v-sm') + (on ? r4vH(r4vT(66, 124, 'พื้นที่ 9', R4VC.g) + r4vT(192, 132, 'พื้นที่ 25', R4VC.g)) : ''), s: 'รั้ว 20 ม. เท่ากัน<br>แต่<b>พื้นที่ไม่เท่ากัน</b>' },
      { t: 'พื้นที่เท่ากัน', f: on => r4vTl(8, 70, 14, 8, 2, ['#A8DC8E', '#BDE6A6']) + r4vTl(164, 46, 14, 4, 4, ['#A8DC8E', '#BDE6A6']) + r4vT(64, 60, 'พื้นที่ 16', R4VC.g, 'r4v-sm') + r4vT(192, 38, 'พื้นที่ 16', R4VC.g, 'r4v-sm') + (on ? r4vH(r4vRect(8, 70, 112, 28, 'none', R4VC.p, 4) + r4vRect(164, 46, 56, 56, 'none', R4VC.p, 4) + r4vT(64, 124, 'รั้ว 20 ม.', R4VC.p) + r4vT(192, 128, 'รั้ว 16 ม.', R4VC.p)) : ''), s: 'พื้นที่เท่ากัน<br>แต่<b>รั้วยาวไม่เท่ากัน</b>' }]; },
  1493: () => [
    { t: 'กรอบรูป', f: on => r4vRect(56, 22, 128, 104, '#C98A4B', R4VC.wood, 2) + r4vRect(70, 36, 100, 76, '#DDEFFB', R4VC.wood, 2) + `<circle cx="150" cy="56" r="9" fill="#FFC24C"/><path d="M70 112 L102 72 L124 96 L140 80 L170 112 Z" fill="#7FCF9E"/>` + (on ? r4vH(r4vRect(56, 22, 128, 104, 'none', R4VC.p, 6) + r4vT(120, 154, 'กรอบ = รอบรูป', R4VC.p)) : ''), s: 'กรอบ รั้ว เทปรอบ วิ่งรอบ<br>→ <b>ความยาวรอบรูป</b>' },
    { t: 'รู้รอบรูป หาความกว้าง', f: on => r4vRect(60, 22, 120, 50, R4VC.sand) + r4vT(120, 16, 'ยาว 12 ม.') + r4vT(42, 52, '?', R4VC.p, 'r4v-big') + (on ? r4vH(r4vStrip(18, 92, 6, [[12, R4VC.o, 'ยาว 12'], [5, R4VC.b, '5'], [17, '#C9C1E0', 'อีกครึ่ง 17']]) + r4vT(120, 140, '34 ÷ 2 = 17') + r4vT(120, 162, '17 − 12 = กว้าง 5', R4VC.b)) : r4vStrip(18, 92, 6, [[34, R4VC.p, 'รอบรูป 34 ม.']])), s: 'รอบรูป ÷ 2 = กว้าง + ยาว<br>17 − 12 = กว้าง <b>5 ม.</b>' },
    { t: 'จัตุรัส: หาด้าน', f: on => r4vRect(95, 14, 50, 50, R4VC.sky) + r4vT(120, 82, '?', R4VC.p, 'r4v-big') + (on ? r4vH(r4vStrip(12, 96, 6, [[9, R4VC.g, '9'], [9, '#3FA37A', '9'], [9, R4VC.g, '9'], [9, '#3FA37A', '9']]) + r4vT(120, 150, '36 ÷ 4 = 9', R4VC.g)) : r4vStrip(12, 96, 6, [[36, R4VC.p, 'รอบรูป 36 ซม.']])), s: 'จัตุรัส: ด้าน = รอบรูป ÷ 4<br>36 ÷ 4 = <b>9 ซม.</b>' }],
  1494: () => [
    { t: 'ปูกระเบื้อง', f: on => r4vRect(56, 18, 128, 96, '#F3E3C3', 'none', 0) + (on ? r4vH(r4vTl(56, 18, 32, 4, 3, ['#E77FA2', '#D9668D'])) : '') + r4gridS(56, 18, 4, 3, 32, 'rgba(43,37,80,.25)') + r4vRect(56, 18, 128, 96) + r4vT(120, 136, '4 ม.') + r4vT(36, 72, '3 ม.') + (on ? r4vH(r4vT(120, 160, '4 × 3 = 12 ตร.ม.', R4VC.p)) : ''), s: 'ปู<b>เต็มผิว</b> = พื้นที่<br>4 × 3 = 12 ตร.ม.' },
    { t: 'คิดราคา', f: on => r4vTl(56, 18, 32, 4, 3, ['#E77FA2', '#D9668D']) + r4gridS(56, 18, 4, 3, 32, 'rgba(43,37,80,.25)') + r4vRect(56, 18, 128, 96) + (on ? r4vH(Array.from({ length: 12 }, (_, i) => `<circle cx="${72 + (i % 4) * 32}" cy="${34 + Math.floor(i / 4) * 32}" r="11" fill="#FFC24C" stroke="#C98A1E" stroke-width="1.6"/><text x="${72 + (i % 4) * 32}" y="${38.5 + Math.floor(i / 4) * 32}" class="r4v-sm" text-anchor="middle" style="fill:#7A4B00">฿</text>`).join('') + r4vT(120, 140, 'ตร.ม. ละ 150 บาท') + r4vT(120, 162, '12 × 150 = 1,800 บาท', R4VC.p)) : r4vT(120, 140, '12 ตร.ม.')), s: 'ราคา = พื้นที่ × ราคาต่อ ตร.ม.<br>= <b>1,800 บาท</b>' },
    { t: 'เว้นที่ปลูกต้นไม้', f: on => r4vRect(48, 16, 144, 96, '#F3E3C3', 'none', 0) + (on ? r4vH(r4vTl(48, 16, 24, 6, 4, (i, j) => i >= 1 && i <= 2 && j >= 1 && j <= 2 ? 'transparent' : ((i + j) % 2 ? '#D9775A' : '#C9654A'))) : '') + r4vRect(72, 40, 48, 48, '#BDE6A6', R4VC.g, 2) + r4vTree(96, 74, 1.6) + r4vRect(48, 16, 144, 96) + (on ? r4vH(r4vT(120, 136, '6 × 4 − 2 × 2') + r4vT(120, 160, '24 − 4 = 20 ตร.ม.', R4VC.p)) : r4vT(120, 136, 'ลาน 6 × 4 เว้น 2 × 2')), s: 'ปูอิฐ = ทั้งหมด − ที่เว้นไว้<br>= <b>20 ตร.ม.</b>' }]
};


/* ---------- game: drag the pink corner to make the rectangle the question asks for (เกมให้ปรับ) ---------- */
function r4vAdj(o) {
  const N = o.N || 10, M = o.M || 7, g = 32, x0 = 70, y0 = 40, u = o.u ? ' ' + o.u : '', t = o.t, au = o.au || 'ตารางหน่วย', fix = t === 'fixA' || t === 'fixP', fence = /per|maxA|fixP/.test(t) || o.fence;
  const ok = (w, hh) => ({ wh: (w === o.w && hh === o.h) || (w === o.h && hh === o.w), sq: w === hh && w === o.s, area: w * hh === o.n && (!o.notSq || w !== hh), per: 2 * (w + hh) === o.p, both: w * hh === o.n && 2 * (w + hh) === o.p,
    sqA: w === hh && w * w === o.n, sqP: w === hh && 4 * w === o.p, maxA: 2 * (w + hh) === o.p && w === hh, fixA: w * hh === o.n, fixP: 2 * (w + hh) === o.p })[t];
  const q = o.q || ({ wh: `ลากมุมสีชมพู ทำ<b>รูปสี่เหลี่ยมผืนผ้า</b> กว้าง ${o.h}${u} ยาว ${o.w}${u}`, sq: `ลากมุมสีชมพู ทำ<b>รูปสี่เหลี่ยมจัตุรัส</b> ยาวด้านละ ${o.s}${u}`, area: `ลากมุมสีชมพู ทำรูปสี่เหลี่ยมมุมฉากที่มี<b>พื้นที่ ${o.n} ${au}</b>${o.notSq ? ' (ไม่ใช่จัตุรัส)' : ''}`,
    per: `ลากมุมสีชมพู ทำแปลงที่ใช้<b>รั้วยาว ${o.p}${u}</b> พอดี`, both: `ลากมุมสีชมพู ทำรูปที่มี<b>พื้นที่ ${o.n} ${au}</b> และ<b>ความยาวรอบรูป ${o.p}${u}</b>`, sqA: `ลากมุมสีชมพู ทำ<b>รูปสี่เหลี่ยมจัตุรัส</b>ที่มีพื้นที่ ${o.n} ${au}`,
    sqP: `ลากมุมสีชมพู ทำ<b>รูปสี่เหลี่ยมจัตุรัส</b>ที่มีความยาวรอบรูป ${o.p}${u}`, maxA: `มีรั้วยาว <b>${o.p}${u}</b> — ลากมุมทำแปลงที่ได้<b>พื้นที่มากที่สุด</b>`, fixA: `แปลงกว้าง ${o.h}${u} (ล็อกไว้) — ลากให้ยาวพอดี จนมี<b>พื้นที่ ${o.n} ${au}</b>`, fixP: `แปลงกว้าง ${o.h}${u} (ล็อกไว้) — ลากให้ยาวพอดี จนใช้<b>รั้ว ${o.p}${u}</b>` })[t];
  const why = (w, hh) => { const A = w * hh, P = 2 * (w + hh);
    if (t === 'wh') return `ตอนนี้กว้าง ${hh} ยาว ${w} — ต้องการกว้าง ${o.h} ยาว ${o.w}`;
    if (t === 'sq' || t === 'sqA' || t === 'sqP') { if (w !== hh) return `ตอนนี้ ${hh} กับ ${w} ยังไม่เท่ากัน — จัตุรัสต้องยาวเท่ากันทุกด้าน`; return t === 'sq' ? `ตอนนี้ด้านละ ${w} — ต้องการด้านละ ${o.s}` : t === 'sqA' ? `ตอนนี้ ${w} × ${w} = ${A} — ต้องการพื้นที่ ${o.n}` : `ตอนนี้รอบรูป 4 × ${w} = ${4 * w} — ต้องการ ${o.p}`; }
    if (t === 'area' || t === 'fixA') return A === o.n ? 'พื้นที่ถูกแล้ว แต่โจทย์ไม่เอารูปสี่เหลี่ยมจัตุรัส — ลองแบบอื่น' : `ตอนนี้ ${hh} × ${w} = ${A} ${au} — ต้องการ ${o.n}`;
    if (t === 'per' || t === 'fixP') return `ตอนนี้รั้ว 2 × (${w} + ${hh}) = ${P}${u} — ต้องการ ${o.p}${u}`;
    if (t === 'both') return A !== o.n ? `ตอนนี้พื้นที่ ${hh} × ${w} = ${A} — ต้องการ ${o.n}` : `พื้นที่ถูกแล้ว แต่รอบรูป 2 × (${w} + ${hh}) = ${P} — ต้องการ ${o.p}`;
    if (t === 'maxA') return P !== o.p ? `ตอนนี้รั้ว 2 × (${w} + ${hh}) = ${P}${u} — ต้องใช้รั้ว ${o.p}${u} พอดี` : `รั้วพอดีแล้ว ได้พื้นที่ ${A} — ลองให้กว้างกับยาวใกล้กันมากขึ้น พื้นที่จะมากขึ้น`; };
  const sol = () => { const all = []; for (let hh = 1; hh <= M; hh++) for (let w = 1; w <= N; w++) if ((!fix || hh === o.h) && ok(w, hh)) all.push([w, hh]); return all.find(([w, hh]) => w > hh) || all[0]; };
  let w0 = o.w0 || 2, h0 = fix ? o.h : (o.h0 || 2); if (ok(w0, h0)) { w0 = w0 + 1 <= N ? w0 + 1 : w0 - 1; if (ok(w0, h0)) h0 = h0 + 1 <= M ? h0 + 1 : h0 - 1; }
  return { prompt: q, say: q.replace(/<[^>]+>/g, '').replace('—', ' '), __sig: `r4va ${t} ${o.w || ''} ${o.h || ''} ${o.s || ''} ${o.n || ''} ${o.p || ''}`,
    mount(bd, ctx) { let w = w0, hh = h0, done = false; const fig = h('div', { class: 'r4-board ia rvl r4v-adj' }), info = h('div', { class: 'p4steplab' });
      const draw = () => { const X = x0 + w * g, Y = y0 + hh * g; let s = r4gridS(x0, y0, N, M, g);
        s += fence ? r4grass(x0, y0, w * g, hh * g, 'r4vadj') + `<rect x="${x0}" y="${y0}" width="${w * g}" height="${hh * g}" fill="none" stroke="${R4VC.wood}" stroke-width="5" stroke-dasharray="3 5"/>` : r4vTl(x0, y0, g, w, hh, o.cols || ['#FFC24C', '#FFD27A']) + r4PolyS(r4vR(x0, y0, w * g, hh * g), { fill: 'none', rm: !o.noRm });
        s += `<text x="${x0 + w * g / 2}" y="${y0 - 12}" class="r4-lab" text-anchor="middle">${w}${u}</text><text x="${x0 - 12}" y="${y0 + hh * g / 2 + 6}" class="r4-lab" text-anchor="end">${fix ? '🔒 ' : ''}${hh}${u}</text>`;
        fig.innerHTML = r4svg(x0 + N * g + 30, y0 + M * g + 24, s + (done ? '' : tgHandle(X, Y, R4VC.p)), 'tg-scene');
        info.innerHTML = `กว้าง <b>${hh}</b>${u}&emsp;ยาว <b>${w}</b>${u}` + (o.show === 'area' ? `<br>พื้นที่ ${hh} × ${w} = <b>${w * hh}</b>` : ''); };
      tgDrag(fig, p => { if (done) return; const nw = Math.max(1, Math.min(N, Math.round((p[0] - x0) / g))), nh = fix ? hh : Math.max(1, Math.min(M, Math.round((p[1] - y0) / g))); if (nw === w && nh === hh) return; w = nw; hh = nh; sfx.tap(); draw(); });
      const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (done) return; if (ok(w, hh)) { done = true; draw(); ctx.check(true); } else ctx.check(false, why(w, hh)); } }, icon('check'), 'ตรวจ');
      fig.reveal = () => { const s = sol(); if (s) { [w, hh] = s; } done = true; draw(); };
      draw(); bd.append(h('div', { class: 't6-q p4-q r4-bq' }, fig, h('div', { class: 'colstack' }, info, chk))); } };
}
const r4vA = (sig, d, o) => ({ ...r4vAdj(o), __diff: d, __kind: 'r4v' + sig });

/* ---------- pictures for word problems ---------- */
/* a plan of a rectangle (readable shape) with labels · inner = a square left out (pond, tree) · mid = text inside */
function r4vPlan(L, W, o = {}) { const r = Math.max(.36, Math.min(1, W / L)), bw = r < 1 ? 220 : 150, bh = r < 1 ? Math.max(72, bw * r) : 150, VW = 320, VH = 200, x = (VW - bw) / 2, y = (VH - bh) / 2 + 4, P = r4vR(x, y, bw, bh), u = o.u ? ' ' + o.u : '';
  let s = o.grass ? r4grass(x, y, bw, bh, 'r4vpl' + (o.id || '')) : '';
  if (o.tiles) { const n = o.tiles[0], m = o.tiles[1]; s += r4vTl(x, y, bw / n, n, m, ['#E77FA2', '#D9668D']).replace(/rx="2.5"/g, 'rx="1"'); }
  s += r4PolyS(P, { fill: o.grass || o.tiles ? 'none' : (o.fill || R4VC.sand), labs: o.labs || [r4f(L) + u, '', '', r4f(W) + u] });
  if (o.inner) { const a = Math.max(24, Math.min(bh - 24, o.inner / L * bw)), ix = x + bw - a - 14, iy = y + bh - a - 12; s += `<rect x="${a4n(ix)}" y="${a4n(iy)}" width="${a4n(a)}" height="${a4n(a)}" fill="${o.innerFill || '#9FD0F0'}" stroke="${R4VC.ink}" stroke-width="2"/>` + (o.innerLab ? `<text x="${a4n(ix - 6)}" y="${a4n(iy + a / 2 + 6)}" class="r4-lab" text-anchor="end">${o.innerLab}</text>` : ''); }
  if (o.mid) s += `<text x="${x + bw / 2}" y="${y + bh / 2 + 6}" class="r4-lab r4v-st" text-anchor="middle">${o.mid}</text>`;
  if (o.fence) s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="none" stroke="${R4VC.wood}" stroke-width="5" stroke-dasharray="3 5"/>`;
  if (o.posts) { for (let i = 0; i <= 6; i++) s += r4vDot([x + bw * i / 6, y], R4VC.wood, 4.5) + r4vDot([x + bw * i / 6, y + bh], R4VC.wood, 4.5); for (let j = 1; j < 3; j++) s += r4vDot([x, y + bh * j / 3], R4VC.wood, 4.5) + r4vDot([x + bw, y + bh * j / 3], R4VC.wood, 4.5); }
  if (o.track) s += `<rect x="${x - 10}" y="${y - 10}" width="${bw + 20}" height="${bh + 20}" rx="14" fill="none" stroke="${R4VC.p}" stroke-width="3" stroke-dasharray="8 6"/>`;
  return r4svg(VW, VH, s); }
/* two rectangles side by side at the same scale */
function r4vPair(A, B, o = {}) { const u = o.u ? ' ' + o.u : '', k = Math.min(120 / Math.max(A[0], B[0]), 110 / Math.max(A[1], B[1])), mk = (R, x, nm, col) => { const w = Math.max(14, R[0] * k), hh = Math.max(14, R[1] * k), y = 34 + (120 - hh) / 2; return r4PolyS(r4vR(x + (150 - w) / 2, y, w, hh), { fill: col, labs: R[2] || [r4f(R[0]) + u, '', '', r4f(R[1]) + u] }) + `<text x="${x + 75}" y="20" class="r4-nm" text-anchor="middle">${nm}</text>`; };
  return r4svg(330, 180, mk(A, 10, o.na || 'รูป ก', o.ca || R4VC.sand) + mk(B, 170, o.nb || 'รูป ข', o.cb || R4VC.sky)); }
/* n half cells in two rows (for "ครึ่งช่อง n ชิ้น") */
const r4vHalves = n => { const g = 34, per = Math.ceil(n / 2), W = per * (g + 10) + 20; let s = ''; for (let i = 0; i < n; i++) { const r = i < per ? 0 : 1, c = r ? i - per : i, x = 14 + c * (g + 10), y = 14 + r * (g + 14); s += `<rect x="${x}" y="${y}" width="${g}" height="${g}" fill="none" stroke="#B7AED3" stroke-dasharray="3 3"/><path d="M${x} ${y} L${x + g} ${y + g} L${x} ${y + g} Z" fill="#FFD27A" stroke="#2B2550" stroke-width="1.6"/>`; } return r4svg(Math.max(W, 120), 28 + 2 * (g + 14), s); };
/* the same L-shaped room cut two ways (picture for "ตัดต่างกัน พื้นที่รวมเป็นอย่างไร") */
const r4vCut2 = () => { const one = (ox, cut) => { const F = r4vFitU(R4SH.L(8, 6, 3, 2), ox, 0, 160, 150, 18), ru = (x1, y1, x2, y2, col) => r4PolyS([[x1, y1], [x2, y1], [x2, y2], [x1, y2]].map(F.mp), { fill: col, rm: false, sw: 1 });
  return (cut ? ru(0, 0, 5, 6, '#BFE3F7') + ru(5, 2, 8, 6, '#C9F0D9') : ru(0, 0, 5, 2, '#FFD27A') + ru(0, 2, 8, 6, '#BFE3F7')) + r4PolyS(F.P, { fill: 'none', rm: false }); };
  return r4svg(330, 150, one(0, true) + one(170, false)); };
/* a word problem with its picture on the left (② think step by step stays the same) */
const r4vSF = (sig, d, fig, D) => ({ ...g4FigStory(fig, D.text, D.expr, D.wrong, D.unit), __diff: d, __kind: 'r4v' + sig });


/* =========================================================
   games: 10 questions, easy → hard (d = place in the game)
   ========================================================= */
const R4V_GAME = {
  1481: () => { const w = rnd(5, 9), hh = rnd(2, w - 2), s = rnd(3, 8), a = rnd(4, 9), b = rnd(10, 16);
    return [
      r4vA('1a', 1, { t: 'wh', w: rnd(5, 8), h: rnd(2, 4) }),
      r4vD(Q.r4Kind({ k: 'rect', nm: r4nm(), w, hh }), 2, '1b'),
      r4vD(Q.r4Kind({ k: 'sq', nm: r4nm(), w: s, hh: s }), 3, '1c'),
      r4vD(Q.r4Kind({ k: 'para', nm: r4nm(), w: rnd(4, 7), hh: rnd(2, 3) }), 4, '1d'),
      r4vD(Q.r4Pick({ ks: r4qkSet('rect'), want: 'rect' }), 5, '1e'),
      r4vN('1f ' + b + ' ' + a, 6, { fig: r4Rect(b, a, { unit: 'ซม.', names: 'ABCD', labs: [`${b} ซม.`, `${a} ซม.`, '?', ''] }), q: 'ABCD เป็นรูปสี่เหลี่ยมผืนผ้า ด้าน CD ยาวกี่เซนติเมตร', a: b, unit: 'ซม.', hint: 'ด้านตรงข้ามของรูปสี่เหลี่ยมผืนผ้ายาวเท่ากัน — CD อยู่ตรงข้ามกับ AB' }),
      r4vD(Q.r4Pick({ ks: r4qkSet('sq'), want: 'sq' }), 7, '1g'),
      r4vD(r4TF(R4_PROP, 'p'), 8, '1h'),
      r4vP('1i ' + a, 9, { fig: r4Rect(a, a, { names: 'PQRS', sq: true, labs: [`${a} ซม.`, `${a} ซม.`, '', ''] }), q: `รูปสี่เหลี่ยม PQRS มีมุมฉาก 4 มุม ด้าน PQ ยาว ${a} ซม. ด้าน QR ยาว ${a} ซม. รูปนี้เป็นรูปชนิดใด`, opts: ['รูปสี่เหลี่ยมจัตุรัส', 'รูปสี่เหลี่ยมผืนผ้า', 'ไม่ใช่รูปสี่เหลี่ยมมุมฉาก'], right: 'รูปสี่เหลี่ยมจัตุรัส', hint: 'PQ กับ QR อยู่ติดกันและยาวเท่ากัน และด้านตรงข้ามยาวเท่ากัน → ทุกด้านยาวเท่ากัน' }),
      r4vP('1j ' + a + ' ' + b, 10, { fig: r4Rect(a, b, { labs: [`${a} ซม.`, `${b} ซม.`, '?', '?'] }), q: `รูปสี่เหลี่ยมผืนผ้ารูปหนึ่ง ด้านหนึ่งยาว ${a} ซม. ด้านที่อยู่ติดกันยาว ${b} ซม. อีก 2 ด้านที่เหลือยาวเท่าใด`, opts: [`${a} ซม. และ ${b} ซม.`, `${b} ซม. และ ${b} ซม.`, `${a} ซม. และ ${a} ซม.`], right: `${a} ซม. และ ${b} ซม.`, hint: 'ด้านตรงข้ามยาวเท่ากัน — แต่ละด้านมีคู่ของมัน' })]; },
  1482: () => { const d = rnd(6, 25) * 2, h2 = rnd(4, 15), nm = pick(['ABCD', 'EFGH', 'KLMN', 'WXYZ']), [A, B, C, D] = [...nm];
    return [
      r4vP('2a', 1, { fig: r4Rect(7, 4, { labs: ['', '', '', ''], names: 'ABCD' }), q: 'รูปสี่เหลี่ยม 1 รูป มีเส้นทแยงมุมกี่เส้น', opts: ['2 เส้น', '4 เส้น', '1 เส้น'], right: '2 เส้น', hint: 'จากจุดยอดหนึ่ง มีจุดยอดที่ไม่อยู่ติดกันเพียงจุดเดียว' }),
      r4vD(Q.r4DrawDiag({ k: pick(['rect', 'sq']), nm: r4nm() }), 2, '2b'),
      r4vP('2c ' + nm, 3, { q: `ข้อใดเป็น<b>เส้นทแยงมุม</b>ของรูปสี่เหลี่ยม ${nm}`, fig: r4Rect(7, 4, { labs: ['', '', '', ''], names: nm }), opts: [`${A}${C}`, `${A}${B}`, `${B}${C}`], right: `${A}${C}`, hint: 'เส้นทแยงมุมเชื่อมจุดยอดที่ไม่อยู่ติดกัน' }),
      r4vD(Q.r4TapDiag({ k: pick(['para', 'trap', 'kite']), nm: r4nm() }), 4, '2d'),
      r4vD(Q.r4DiagNum({ nm: pick(['ABCD', 'PQRS', 'EFGH']), d, ask: 'other' }), 5, '2e'),
      r4vD(Q.r4DrawDiag({ k: pick(['para', 'trap', 'kite']), nm: r4nm() }), 6, '2f'),
      r4vD(Q.r4DiagNum({ nm: pick(['KLMN', 'WXYZ']), d: rnd(6, 25) * 2, ask: 'half' }), 7, '2g'),
      r4vD(r4TF(R4_DPROP, 'd'), 8, '2h'),
      r4vN('2i', 9, { q: 'รูปสี่เหลี่ยมจัตุรัส ABCD มีเส้นทแยงมุมตัดกันที่จุด O มุม AOB กางกี่องศา', fig: r4Rect(5, 5, { labs: ['', '', '', ''], names: 'ABCD', diag: 1, sq: true, W: 300, H: 200, extra: '<circle cx="150" cy="100" r="4.5" fill="#E5487A"/><text x="150" y="88" class="r4-nm" text-anchor="middle">O</text>' }), a: 90, unit: 'องศา', hint: 'เส้นทแยงมุมของรูปสี่เหลี่ยมจัตุรัสตั้งฉากกัน' }),
      r4vN('2j ' + h2, 10, { fig: r4Rect(8, 4, { labs: ['', '', '', ''], names: nm, diag: 1, extra: `<circle cx="170" cy="105" r="5" fill="#E5487A"/><text x="170" y="92" class="r4-nm" text-anchor="middle">O</text><text x="106" y="70" class="r4-lab q" text-anchor="end">${h2} ซม.</text>` }), q: `${nm} เป็นรูปสี่เหลี่ยมผืนผ้า เส้นทแยงมุมตัดกันที่ O ถ้า ${A}O ยาว ${h2} ซม. เส้นทแยงมุมทั้งสองเส้นยาวรวมกันกี่เซนติเมตร`, a: 4 * h2, unit: 'ซม.', hint: `${A}O เป็นครึ่งหนึ่งของ ${A}${C} → ${A}${C} = ${h2} × 2 และ ${B}${D} ยาวเท่ากับ ${A}${C}` })]; },
  /* ผู้ใช้ขอ (ก่อน v249): เกมต้องสร้างรูปเองตั้งแต่ด้านแรก (ง่าย → ยาก) · แบบลากหมุดเดิมอยู่ท้าย ๆ เท่านั้น */
  1483: () => { const s = rnd(4, 9), w = rnd(3, 5);
    return [
      r4vP('3a', 1, { fig: r4svg(300, 170, `<path d="M60 130 H240" stroke="#2B2550" stroke-width="3.5"/><path d="M60 130 V30" stroke="#3C8DDB" stroke-width="2.6" stroke-dasharray="6 5"/><path d="M82 130 A22 22 0 0 0 60 108" fill="none" stroke="#E5487A" stroke-width="2.4"/><text x="96" y="104" class="r4-lab q">?°</text><text x="48" y="150" class="r4-nm">A</text><text x="244" y="150" class="r4-nm">B</text>`), q: 'สร้างรูปสี่เหลี่ยมผืนผ้า ต้องสร้างมุมกี่องศาที่ปลายด้านแรก', opts: ['90°', '60°', '180°'], right: '90°', hint: 'รูปสี่เหลี่ยมมุมฉากทุกมุมเป็นมุมฉาก' }),
      r4vD(Q.r4Build({ kind: 'sq', w: rnd(2, 3), nm: r4nm() }), 2, '3b'),
      r4vD(Q.r4Build({ kind: 'rect', w, hh: rnd(2, w - 1), nm: r4nm() }), 3, '3c'),
      r4vP('3d ' + s, 4, { fig: r4svg(300, 170, `<path d="M70 140 H230" stroke="#2B2550" stroke-width="3.5"/><path d="M70 140 V30" stroke="#3C8DDB" stroke-width="2.6" stroke-dasharray="6 5"/><path d="M70 126 h14 v14" fill="none" stroke="#E5487A" stroke-width="2"/><text x="150" y="162" class="r4-lab" text-anchor="middle">${s} ซม.</text><text x="58" y="88" class="r4-lab q" text-anchor="end">?</text>`), q: `สร้างรูปสี่เหลี่ยมจัตุรัสยาวด้านละ ${s} ซม. ลากด้านแรก ${s} ซม. แล้ว ด้านที่ตั้งฉากต้องยาวเท่าใด`, opts: [`${s} ซม.`, `${s * 2} ซม.`, `${s + 1} ซม.`], right: `${s} ซม.`, hint: 'จัตุรัสทุกด้านยาวเท่ากัน' }),
      r4vD(Q.r4Build({ kind: 'sq', w: rnd(4, 6), nm: r4nm() }), 5, '3e'),
      r4vD(r4SeqQ(), 6, '3f'),
      r4vD((() => { const ww = rnd(6, 8); return Q.r4Build({ kind: 'rect', w: ww, hh: rnd(3, Math.min(6, ww - 1)), nm: r4nm() }); })(), 7, '3g'),
      r4vD((() => { const sq = Math.random() < .45, ww = rnd(3, 7); return Q.r4Geo({ kind: sq ? 'sq' : 'rect', w: sq ? Math.min(ww, 5) : ww, hh: sq ? Math.min(ww, 5) : rnd(1, Math.min(5, ww - 1)) || 1, nm: r4nm() }); })(), 8, '3h'),
      r4vP('3i', 9, { fig: r4svg(300, 190, r4PolyS([[70, 80], [230, 40], [230, 160], [70, 160]], { fill: '#FFE7A8', names: 'DCBA', labs: ['', '4 ซม.', '6 ซม.', '3 ซม.'] })), q: 'แก้วสร้างรูป ABCD: ลาก AB ยาว 6 ซม. สร้างมุมฉากที่ A และ B แต่วัด AD ยาว 3 ซม. และ BC ยาว 4 ซม. แล้วลากเชื่อม D กับ C ได้รูปอะไร', opts: ['ไม่ใช่รูปสี่เหลี่ยมผืนผ้า เพราะ AD กับ BC ยาวไม่เท่ากัน', 'รูปสี่เหลี่ยมผืนผ้า เพราะมีมุมฉากที่ A และ B', 'รูปสี่เหลี่ยมจัตุรัส'], right: 'ไม่ใช่รูปสี่เหลี่ยมผืนผ้า เพราะ AD กับ BC ยาวไม่เท่ากัน', hint: 'ด้านตรงข้ามของรูปสี่เหลี่ยมผืนผ้าต้องยาวเท่ากัน — มุม C และ D จะไม่เป็นมุมฉาก' }),
      r4vD(Q.r4Pick({ ks: r4qkSet('rect'), want: 'rect' }), 10, '3j')]; },
  1484: () => { const s = rnd(4, 9), w2 = rnd(5, 9), m = rnd(2, 4), c = rnd(30, 80);
    return [
      r4vD(r4walkRect(), 1, '4a'),
      r4vD(r4walkRect(), 2, '4b'),
      r4vA('4c', 3, { t: 'per', p: 2 * (rnd(2, 4) + rnd(5, 8)), u: 'ม.' }),
      r4vD(r4perFormula(), 4, '4d'),
      r4vA('4e', 5, { t: 'sqP', p: 4 * rnd(3, 6), u: 'ม.' }),
      r4vD(r4duelQ('per'), 6, '4f'),
      r4vN('4g ' + s, 7, { q: `นำรูปสี่เหลี่ยมจัตุรัสยาวด้านละ ${s} ซม. 2 รูป มาวางต่อกันเป็นรูปสี่เหลี่ยมผืนผ้า รูปใหม่มีความยาวรอบรูปกี่เซนติเมตร`, fig: r4ex([[0, 0], [2 * s, 0], [2 * s, s], [0, s]], ['', '', '', `${s} ซม.`], { rm: false, W: 320, H: 170, extra: F => `<path d="M${F.ox + s * F.k} ${F.oy} V${F.oy + s * F.k}" stroke="#2B2550" stroke-width="3" stroke-dasharray="6 5"/><text x="${F.ox + s * F.k / 2}" y="${F.oy - 10}" class="r4-lab" text-anchor="middle">${s} ซม.</text>` }), a: 6 * s, unit: 'ซม.', hint: `รูปใหม่ยาว ${s} + ${s} = ${2 * s} ซม. กว้าง ${s} ซม. · ด้านที่ต่อกันอยู่ข้างใน ไม่นับ` }),
      r4vN('4h ' + w2 + ' ' + m, 8, { fig: r4vPlan(w2 * m, w2, { labs: ['ยาว ? ซม.', '', '', `${w2} ซม.`], mid: `ยาว ${m} เท่าของกว้าง` }), q: `รูปสี่เหลี่ยมผืนผ้ากว้าง ${w2} ซม. ยาวเป็น ${m} เท่าของความกว้าง มีความยาวรอบรูปกี่เซนติเมตร`, a: 2 * (w2 + m * w2), unit: 'ซม.', hint: `หาความยาวก่อน: ${w2} × ${m} = ${w2 * m} ซม. แล้วใช้ 2 × (กว้าง + ยาว)` }),
      r4vN('4i ' + c, 9, { fig: r4vPlan(200, c, { labs: ['2 ม.', '', '', `${c} ซม.`] }), q: `รูปสี่เหลี่ยมผืนผ้ายาว 2 ม. กว้าง ${c} ซม. มีความยาวรอบรูปกี่เซนติเมตร`, a: 2 * (200 + c), unit: 'ซม.', hint: 'เปลี่ยนเป็นหน่วยเดียวกันก่อน: 2 ม. = 200 ซม.' }),
      r4vN('4j ' + s, 10, { fig: r4vPair([s + 4, s], [s + 2, s + 2, ['? ซม.', '', '', '']], { u: 'ซม.', na: 'ผืนผ้า', nb: 'จัตุรัส' }), q: `รูปสี่เหลี่ยมจัตุรัสมีความยาวรอบรูปเท่ากับรูปสี่เหลี่ยมผืนผ้ากว้าง ${s} ซม. ยาว ${s + 4} ซม. รูปสี่เหลี่ยมจัตุรัสยาวด้านละกี่เซนติเมตร`, a: s + 2, unit: 'ซม.', hint: `รอบรูปผืนผ้า = 2 × (${s} + ${s + 4}) = ${4 * s + 8} → จัตุรัสด้านละ ${4 * s + 8} ÷ 4` })]; },
  1485: () => { const a = rnd(2, 4), b = rnd(1, 2), c = rnd(2, 3), d = rnd(1, 2), e = rnd(2, 3), S = r4vStairU(a, b, c, d, e), k = pick([1, 2, 5]), u = pick(['ม.', 'ซม.']);
    const Wu = rnd(8, 12), Hu = rnd(5, 8), na = rnd(2, 4), nb = rnd(2, Hu - 2), nc = rnd(2, Wu - na - 2);
    return [
      r4vP('5a', 1, { fig: r4ex(R4SH.L(9, 7, 4, 3), ['5 ม.', '3 ม.', '4 ม.', '4 ม.', '9 ม.', '7 ม.'], { rm: false }), q: 'ความยาวรอบรูปของรูปหลายเหลี่ยมหาได้อย่างไร', opts: ['บวกความยาวทุกด้าน', 'คูณด้านที่ยาวที่สุดกับด้านที่สั้นที่สุด', 'บวกเฉพาะด้านที่บอกความยาว'], right: 'บวกความยาวทุกด้าน', hint: 'ความยาวรอบรูป = ผลรวมความยาวของทุกด้าน' }),
      r4vD(r4walkPoly(), 2, '5b'),
      r4vD(r4walkPoly(), 3, '5c'),
      r4vN('5d ' + S.W + ' ' + S.H + ' ' + k, 4, { q: 'รูปนี้มีความยาวรอบรูปเท่าใด', fig: r4ex(S.U, S.U.map((p, i) => r4f(r4len(p, S.U[(i + 1) % 8]) * k) + ' ' + u), { rm: false, W: 340, H: 220 }), a: 2 * (S.W + S.H) * k, unit: u, hint: 'บวกความยาวทุกด้าน (8 ด้าน)' }),
      r4vD(r4walkPoly(), 5, '5e'),
      r4vP('5f', 6, { fig: r4ex(R4SH.U(8, 5, 2, 3, 3), [], { rm: false, extra: F => `<path d="M${F.P[1]} L${F.P[4]}" stroke="#9A8FC4" stroke-width="2.4" stroke-dasharray="6 5"/>` }), q: 'รูปตัว U ที่มีร่องเว้าเข้าไป มีความยาวรอบรูปเป็นอย่างไรเมื่อเทียบกับรูปสี่เหลี่ยมผืนผ้าที่ล้อมรอบ', opts: ['มากกว่า', 'เท่ากัน', 'น้อยกว่า'], right: 'มากกว่า', hint: 'ด้านข้างของร่องทั้ง 2 ด้านเป็นระยะที่ต้องเดินเพิ่ม' }),
      r4vN('5g ' + S.W + ' ' + S.H + ' ' + k + 'x', 8, { q: 'รูปขั้นบันไดนี้มีความยาวรอบรูปเท่าใด', fig: r4ex(S.U, ['', '', '', '', '', '', r4f(S.W * k) + ' ' + u, r4f(S.H * k) + ' ' + u], { rm: false, W: 340, H: 220 }), a: 2 * (S.W + S.H) * k, unit: u, hint: 'ด้านนอนด้านบนรวมกันเท่าด้านล่าง ด้านตั้งด้านขวารวมกันเท่าด้านซ้าย' }),
      r4vN('5h ' + Wu + ' ' + Hu + ' ' + nb, 10, { q: 'รูปนี้มีความยาวรอบรูปกี่เมตร', fig: r4ex(R4SH.U(Wu, Hu, na, nb, nc), ['', `${nb} ม.`, '', '', '', '', `${Wu} ม.`, `${Hu} ม.`], { rm: false, W: 340, H: 220 }), a: 2 * (Wu + Hu) + 2 * nb, unit: 'ม.', hint: `ด้านบนรวมกัน = ${Wu} ม. · ด้านขวา = ${Hu} ม. · ร่องลึก ${nb} ม. มี 2 ด้าน` }),
      r4vD(r4walkPoly(), 7, '5i'),
      r4vN('5j ' + S.W + ' ' + S.H, 9, { fig: r4ex(S.U, ['', '', '', '', '', '', `${S.W * 3} ซม.`, `${S.H * 3} ซม.`], { rm: false }), q: `รูปขั้นบันไดมีด้านล่างยาว ${S.W * 3} ซม. ด้านซ้ายยาว ${S.H * 3} ซม. มีความยาวรอบรูปกี่เซนติเมตร`, a: 2 * (S.W + S.H) * 3, unit: 'ซม.', hint: 'รอบรูปขั้นบันไดเท่ากับรูปสี่เหลี่ยมผืนผ้าที่ล้อมรอบ = 2 × (ด้านล่าง + ด้านซ้าย)' })]; },
  1486: () => { const A = r4cells(), sA = r4vRectCells(rnd(2, 4), rnd(2, 3), 0, 0), sB = (() => { for (;;) { const c = r4vRectCells(rnd(2, 3), rnd(2, 4), 0, 0); c.push([c[c.length - 1][0] + 1, c[c.length - 1][1]]); if (c.length !== sA.length) return c; } })(), E = r4EstMake(...(() => { const G = r4EstGen(); return [G.W, G.H, G.c]; })()), Ev = r4estVal(E);
    return [
      r4vA('6a', 1, { t: 'area', n: pick([6, 8, 10, 12]) }),
      r4vD(Q.r4Count({ ...A, unit: 'ตารางหน่วย' }), 2, '6b'),
      r4vD(Q.r4Paint({ n: rnd(5, 12), rect: false }), 3, '6c'),
      r4vD(Q.r4Count({ ...r4cells(), unit: 'ตารางหน่วย' }), 4, '6d'),
      r4vD(Q.r4Paint({ n: pick([6, 8, 10, 12, 15, 16, 18, 20]), rect: true }), 5, '6e'),
      r4vD(r4duelQ('area'), 6, '6f'),
      r4vN('6g ' + sA.length + ' ' + sB.length, 7, { q: 'รูป ก กับ รูป ข มีพื้นที่ต่างกันกี่ตารางหน่วย', fig: r4vTwo(sA, sB), a: Math.abs(sA.length - sB.length), unit: 'ตารางหน่วย', hint: 'นับช่องของแต่ละรูป แล้วลบกัน' }),
      r4vN('6h ' + Ev.v + ' ' + E.W + E.H, 8, { q: 'รูปนี้มีพื้นที่กี่ตารางหน่วย <small>(ครึ่งช่อง 2 ชิ้น = 1 ตารางหน่วย)</small>', fig: r4EstSVG(E, {}, { g: 28 }), a: Ev.v, unit: 'ตารางหน่วย', hint: `ช่องเต็ม ${Ev.f} ช่อง · ครึ่งช่อง ${Ev.hf} ชิ้น = ${Ev.hf / 2} ช่อง` }),
      r4vP('6i', 9, { fig: r4vTwo(r4vRectCells(6, 2, 0, 0), r4vRectCells(4, 3, 0, 0)), q: 'รูปที่มีพื้นที่ 12 ตารางหน่วย ข้อใดถูก', opts: ['มีได้หลายรูปร่าง', 'ต้องเป็นรูปสี่เหลี่ยมจัตุรัสเท่านั้น', 'ต้องยาว 12 หน่วย'], right: 'มีได้หลายรูปร่าง', hint: 'เช่น 2 แถว แถวละ 6 ช่อง หรือ 3 แถว แถวละ 4 ช่อง' }),
      r4vN('6j ' + sA.length, 10, { q: `รูป ก มีพื้นที่ ${sA.length} ตารางหน่วย ต้องเติมอีกกี่ช่องจึงจะมีพื้นที่ ${sA.length * 2} ตารางหน่วย`, fig: r4vGridFig(sA.map(([x, y]) => [x + 1, y + 1]), { W: 7, H: 5, g: 26 }), a: sA.length, unit: 'ช่อง', hint: `ต้องการ ${sA.length * 2} ช่อง มีแล้ว ${sA.length} ช่อง` })]; },
  1487: () => { const v = rnd(3, 12), m = rnd(3, 15) * 4, w = rnd(3, 6), hh = rnd(2, 4), x = rnd(15, 30), y = 4 * x + pick([-6, -4, 4, 6]);
    return [
      r4vP('7a', 1, { fig: r4svg(200, 150, `<rect x="70" y="20" width="60" height="80" fill="#fff" stroke="#E5487A" stroke-width="2.4" stroke-dasharray="4 3"/><path d="M100 80 C80 66 86 44 100 56 C114 44 120 66 100 80Z" fill="#E5487A"/><text x="100" y="128" class="r4-lab" text-anchor="middle">แสตมป์</text>`), q: 'ควรใช้หน่วยใดวัดพื้นที่ของแสตมป์', opts: ['ตารางเซนติเมตร', 'ตารางเมตร', 'ตารางวา'], right: 'ตารางเซนติเมตร', hint: 'ของชิ้นเล็กใช้ตารางเซนติเมตร' }),
      r4vD(Q.r4Count({ ...r4cells(), unit: 'ตารางเซนติเมตร' }), 2, '7b'),
      (() => { const n = rnd(4, 12); return r4vA('7c', 3, { t: 'area', n, au: 'ตารางวา', fence: true, q: `ที่ดิน <b>${4 * n} ตร.ม.</b> — ลากมุมทำที่ดินให้ได้พอดี <small>(1 ช่อง = 1 ตารางวา = 4 ตร.ม.)</small>` }); })(),
      r4vD(Q.r4Count({ ...r4cells(), unit: 'ตารางวา' }), 4, '7d'),
      r4vD(r4UnitQ(), 5, '7e'),
      r4vN('7f ' + v, 6, { q: `${v} ตารางวา เท่ากับกี่ตารางเมตร`, a: 4 * v, unit: 'ตร.ม.', hint: '1 ตารางวา = 4 ตารางเมตร → คูณ 4' }),
      r4vD(Q.r4Paint({ n: rnd(6, 16), rect: Math.random() < .5 }), 7, '7g'),
      r4vN('7h ' + m, 8, { q: `ที่ดิน ${m} ตารางเมตร เท่ากับกี่ตารางวา`, a: m / 4, unit: 'ตารางวา', hint: 'ทุก 4 ตารางเมตร เป็น 1 ตารางวา → หารด้วย 4' }),
      r4vP('7i ' + x + ' ' + y, 9, { q: `ที่ดินแปลง ก มีพื้นที่ ${x} ตารางวา แปลง ข มีพื้นที่ ${y} ตารางเมตร แปลงใดใหญ่กว่า`, opts: ['แปลง ก', 'แปลง ข', 'เท่ากัน'], right: 4 * x > y ? 'แปลง ก' : 'แปลง ข', hint: `เปลี่ยนเป็นหน่วยเดียวกันก่อน: ${x} ตารางวา = ${x} × 4 = ${4 * x} ตร.ม.` }),
      r4vN('7j ' + w + ' ' + hh, 10, { q: 'ที่ดินนี้มีพื้นที่กี่ตารางเมตร <small>(1 ช่อง = 1 ตารางวา)</small>', fig: r4vGridFig(r4vRectCells(w, hh), { W: 8, H: 6, g: 26, col: '#A8DC8E' }), a: 4 * w * hh, unit: 'ตร.ม.', hint: `นับได้ ${w * hh} ตารางวา แล้วเปลี่ยนเป็นตารางเมตร (× 4)` })]; },
  1488: () => { const G = [r4EstGen(), r4EstGen(), r4EstGen()], f = rnd(8, 16), hf = rnd(2, 6) * 2, E = r4EstMake(...(() => { const X = r4EstGen(); return [X.W, X.H, X.c]; })()), Ev = r4estVal(E), E2 = r4EstMake(...(() => { const X = r4EstGen(); return [X.W, X.H, X.c]; })()), Ev2 = r4estVal(E2);
    return [
      r4vP('8a ' + hf, 1, { fig: r4vHalves(hf), q: `ครึ่งช่อง ${hf} ชิ้น รวมเป็นกี่ตารางหน่วย`, opts: [String(hf / 2), String(hf), String(hf * 2)], right: String(hf / 2), hint: 'ครึ่งช่อง 2 ชิ้น = 1 ตารางหน่วย → หารด้วย 2' }),
      r4vN('8b ' + f + ' ' + hf, 2, { q: `รูปหนึ่งมีช่องเต็ม ${f} ช่อง และครึ่งช่อง ${hf} ชิ้น มีพื้นที่ประมาณกี่ตารางหน่วย`, a: f + hf / 2, unit: 'ตารางหน่วย', hint: `${f} + (${hf} ÷ 2)` }),
      r4vD(Q.r4Est(G[0]), 3, '8c'),
      r4vD(Q.r4Est(G[1]), 4, '8d'),
      r4vP('8e ' + Ev.v + ' ' + E.W + E.H, 5, { q: 'ข้อใดเป็นพื้นที่โดยประมาณของรูปนี้', fig: r4EstSVG(E, {}, { g: 28 }), opts: [`${Ev.v} ตารางหน่วย`, `${Ev.f + Ev.hf} ตารางหน่วย`, `${Ev.f} ตารางหน่วย`], right: `${Ev.v} ตารางหน่วย`, hint: 'ครึ่งช่องนับ 2 ชิ้นเป็น 1 ช่อง ไม่ใช่ชิ้นละ 1 ช่อง' }),
      r4vD(Q.r4Est(G[2]), 6, '8f'),
      r4vP('8g', 7, { fig: r4EstSVG(r4EstShape(1), {}, { g: 28 }), q: 'ทำไมพื้นที่ของสระน้ำรูปโค้งจึงเป็น "พื้นที่โดยประมาณ"', opts: ['เพราะสระน้ำไม่พอดีกับตาราง', 'เพราะสระน้ำมีน้ำ', 'เพราะนับช่องไม่ได้'], right: 'เพราะสระน้ำไม่พอดีกับตาราง', hint: 'ขอบโค้งทำให้ช่องบางช่องไม่เต็ม' }),
      r4vN('8h ' + Ev2.v, 8, { q: 'ถ้า 1 ช่องแทนพื้นที่จริง 2 ตารางเมตร สระน้ำนี้มีพื้นที่จริงประมาณกี่ตารางเมตร', fig: r4EstSVG(E2, {}, { g: 28 }), a: Ev2.v * 2, unit: 'ตร.ม.', hint: `หาพื้นที่โดยประมาณเป็นช่องก่อน (${Ev2.f} + ${Ev2.hf} ÷ 2) แล้วคูณ 2` }),
      r4vN('8i ' + f + ' ' + hf + 'x', 9, { q: `สระ ก มีช่องเต็ม ${f} ช่อง ครึ่งช่อง ${hf} ชิ้น สระ ข มีพื้นที่ประมาณ ${f + hf} ตารางหน่วย สระ ข ใหญ่กว่าสระ ก ประมาณกี่ตารางหน่วย`, a: hf / 2, unit: 'ตารางหน่วย', hint: `สระ ก ≈ ${f} + ${hf / 2} = ${f + hf / 2} ตารางหน่วย` }),
      r4vN('8j ' + Ev.v + ' ' + Ev2.v, 10, { q: 'บ่อปลา 2 บ่อมีพื้นที่ประมาณเท่าใดรวมกัน (ตารางหน่วย)', fig: r4vEst2(E, E2), a: Ev.v + Ev2.v, unit: 'ตารางหน่วย', hint: 'หาพื้นที่โดยประมาณของแต่ละบ่อ แล้วบวกกัน' })]; },
  /* ผู้ใช้ขอ (ก่อน v249): ด่าน 9 มีปูทุ่งหญ้า 4 ข้อ และไม่มีเกมปูกระเบื้อง */
  1489: () => { const w = rnd(3, 7), m = rnd(2, 4), L = rnd(8, 15), add = rnd(2, 4), r = rnd(3, 5), c = rnd(4, 7), G = r4grassQs();
    return [
      r4vN('9a ' + r + ' ' + c, 1, { q: 'รูปนี้มีพื้นที่กี่ตารางหน่วย <small>(นับเป็นแถว)</small>', fig: r4vGridFig(r4vRectCells(c, r), { W: c + 2, H: r + 2, g: 24, col: '#FFC24C' }), a: r * c, unit: 'ตารางหน่วย', hint: `${r} แถว แถวละ ${c} ช่อง → ${r} × ${c}` }),
      r4vA('9b', 2, { t: 'area', n: pick([12, 15, 18, 20, 24]), notSq: true }),
      r4vD(r4areaFormula(false), 3, '9c'),
      ...G.map((q, i) => r4vD(q, 4 + i, '9g' + i)),
      (() => { const hh = rnd(3, 5); return r4vA('9d', 8, { t: 'fixA', h: hh, n: hh * rnd(5, 9), u: 'ซม.', au: 'ตร.ซม.' }); })(),
      r4vN('9e ' + w + ' ' + m, 9, { fig: r4vPlan(w * m, w, { labs: ['ยาว ? ม.', '', '', `${w} ม.`], mid: `ยาว ${m} เท่าของกว้าง` }), q: `รูปสี่เหลี่ยมผืนผ้ากว้าง ${w} ม. ยาวเป็น ${m} เท่าของความกว้าง มีพื้นที่กี่ตารางเมตร`, a: w * w * m, unit: 'ตร.ม.', hint: `ยาว = ${w} × ${m} = ${w * m} ม. แล้วพื้นที่ = กว้าง × ยาว` }),
      r4vN('9f ' + L + ' ' + w + 'p', 10, { fig: r4vPlan(L, w, { labs: [`${L} ซม.`, '', '', '? ซม.'], mid: `รอบรูป ${2 * (L + w)} ซม.` }), q: `รูปสี่เหลี่ยมผืนผ้ามีความยาวรอบรูป ${2 * (L + w)} ซม. ยาว ${L} ซม. มีพื้นที่กี่ตารางเซนติเมตร`, a: L * w, unit: 'ตร.ซม.', hint: `หาความกว้างก่อน: (${2 * (L + w)} ÷ 2) − ${L} = ${w} ซม.` }),
      r4vN('9h ' + L + ' ' + w + ' ' + add, 10, { fig: r4vPlan(L, w, { labs: [`${L} ซม.`, '', '', `${w} ซม.`], mid: `เพิ่มความกว้างอีก ${add} ซม.` }), q: `รูปสี่เหลี่ยมผืนผ้ายาว ${L} ซม. กว้าง ${w} ซม. ถ้าเพิ่มความกว้างอีก ${add} ซม. พื้นที่จะเพิ่มขึ้นกี่ตารางเซนติเมตร`, a: L * add, unit: 'ตร.ซม.', hint: `ส่วนที่เพิ่มเป็นแถบยาว ${L} ซม. กว้าง ${add} ซม.` })]; },
  /* ผู้ใช้ขอ (ก่อน v249): ด่าน 10 ไม่มีเกมปูกระเบื้อง และไม่ซ้ำแบบเดิมเกิน 3 ข้อ */
  1490: () => { const s = rnd(4, 9), s2 = rnd(5, 9), s3 = rnd(3, 8), n = rnd(6, 12), a = rnd(2, 4);
    return [
      r4vN('10a ' + s3, 1, { q: 'รูปสี่เหลี่ยมจัตุรัสนี้มีพื้นที่กี่ตารางหน่วย', fig: r4vGridFig(r4vRectCells(s3, s3, 1, 0), { W: s3 + 2, H: s3, g: Math.min(26, Math.floor(180 / s3)), col: '#9FD0F0' }), a: s3 * s3, unit: 'ตารางหน่วย', hint: `${s3} แถว แถวละ ${s3} ช่อง` }),
      r4vA('10b', 2, { t: 'sqA', n: pick([9, 16, 25, 36]) }),
      r4vD(r4areaFormula(true), 3, '10c'),
      r4vD(r4areaFormula(true), 4, '10d'),
      r4vN('10e ' + s2, 5, { q: `รูปสี่เหลี่ยมจัตุรัสมีพื้นที่ ${s2 * s2} ตร.ซม. ยาวด้านละกี่เซนติเมตร`, fig: p4big(`<span class="fsign">?</span> <b class="fop">×</b> <span class="fsign">?</span> <b class="fop">=</b> <b class="num">${s2 * s2}</b>`), a: s2, unit: 'ซม.', hint: `หาจำนวนที่คูณตัวเองแล้วได้ ${s2 * s2}` }),
      r4vD(r4duelQ('area'), 6, '10f'),
      r4vP('10g ' + s, 7, { fig: r4vPair([2 * s, 2 * s], [4 * s, s], { u: 'ซม.', na: 'จัตุรัส', nb: 'ผืนผ้า' }), q: `รูปสี่เหลี่ยมจัตุรัสยาวด้านละ ${2 * s} ซม. กับรูปสี่เหลี่ยมผืนผ้ากว้าง ${s} ซม. ยาว ${4 * s} ซม. รูปใดมีพื้นที่มากกว่า`, opts: ['เท่ากัน', 'รูปสี่เหลี่ยมจัตุรัส', 'รูปสี่เหลี่ยมผืนผ้า'], right: 'เท่ากัน', hint: `จัตุรัส ${2 * s} × ${2 * s} = ${4 * s * s} · ผืนผ้า ${s} × ${4 * s} = ${4 * s * s}` }),
      r4vN('10h ' + s, 8, { fig: r4vPlan(s, s, { labs: ['? ซม.', '', '', ''], fill: '#BFE3F7', mid: `รอบรูป ${4 * s} ซม.` }), q: `รูปสี่เหลี่ยมจัตุรัสมีความยาวรอบรูป ${4 * s} ซม. มีพื้นที่กี่ตารางเซนติเมตร`, a: s * s, unit: 'ตร.ซม.', hint: `หาความยาวด้านก่อน: ${4 * s} ÷ 4 = ${s} ซม.` }),
      r4vN('10i ' + n + ' ' + s3, 9, { fig: r4vPair([n, n], [n - 2, n - 2], { u: 'ซม.' }), q: `รูปสี่เหลี่ยมจัตุรัส ก ยาวด้านละ ${n} ซม. รูป ข ยาวด้านละ ${n - 2} ซม. พื้นที่ต่างกันกี่ตารางเซนติเมตร`, a: n * n - (n - 2) * (n - 2), unit: 'ตร.ซม.', hint: `${n} × ${n} − ${n - 2} × ${n - 2} (ไม่ใช่ 2 × 2)` }),
      r4vN('10j ' + a, 10, { fig: r4vPair([a, a], [2 * a, 2 * a, ['? ซม.', '', '', '']], { u: 'ซม.', na: 'เดิม', nb: 'ด้านยาว 2 เท่า' }), q: `รูปสี่เหลี่ยมจัตุรัสยาวด้านละ ${a} ซม. ถ้าขยายให้ด้านยาวขึ้นเป็น 2 เท่า พื้นที่ใหม่เป็นกี่ตารางเซนติเมตร`, a: 4 * a * a, unit: 'ตร.ซม.', hint: `ด้านใหม่ ${a} × 2 = ${2 * a} ซม. → ${2 * a} × ${2 * a} (ไม่ใช่แค่ 2 เท่าของพื้นที่เดิม)` })]; },
  1491: () => { const W = rnd(7, 10), H = rnd(5, 7), a = rnd(2, 4), b = rnd(2, H - 2), Wu = rnd(8, 11), Hu = rnd(5, 7), na = rnd(2, 4), nb = rnd(2, Hu - 2), nc = rnd(2, Wu - na - 2), fo = rnd(8, 12), fi = fo - 2 * rnd(1, 2), gw = rnd(5, 9), gl = rnd(gw + 2, 14);
    const LU = R4SH.L(W, H, a, b), LL = [`${W - a} ม.`, `${b} ม.`, `${a} ม.`, `${H - b} ม.`, `${W} ม.`, `${H} ม.`];
    return [
      r4vN('11a ' + W + H + a + b, 1, { q: 'รูปนี้แบ่งเป็น 2 ส่วนแล้ว มีพื้นที่รวมกี่ตารางเมตร', fig: r4ex(LU, LL, { rm: false, W: 340, H: 220, extra: F => `<path d="M${F.ox + (W - a) * F.k} ${F.oy + b * F.k} V${F.oy + H * F.k}" stroke="#E5487A" stroke-width="3" stroke-dasharray="7 6"/>` }), a: W * H - a * b, unit: 'ตร.ม.', hint: `ส่วนซ้าย ${W - a} × ${H} · ส่วนขวา ${a} × ${H - b}` }),
      r4vP('11b ' + W + H + a + b, 2, { q: 'ข้อใดเป็นวิธีหาพื้นที่ของรูปนี้ได้ถูกต้อง', fig: r4ex(LU, LL, { rm: false, W: 340, H: 220 }), opts: [`${W} × ${H} − ${a} × ${b}`, `${W} × ${H} + ${a} × ${b}`, `${W} × ${H}`], right: `${W} × ${H} − ${a} × ${b}`, hint: 'เติมเป็นสี่เหลี่ยมใหญ่ แล้วลบส่วนที่ขาด' }),
      r4vD(r4cutQ(), 3, '11c'),
      r4vP('11d', 4, { fig: r4vCut2(), q: 'ตัดรูปหลายเหลี่ยมเป็นรูปสี่เหลี่ยมมุมฉากด้วยวิธีต่างกัน พื้นที่รวมเป็นอย่างไร', opts: ['เท่ากันเสมอ', 'ตัดแนวตั้งได้มากกว่า', 'ตัดแนวนอนได้มากกว่า'], right: 'เท่ากันเสมอ', hint: 'รูปเดิมไม่ได้เปลี่ยน แค่แบ่งต่างกัน' }),
      r4vD(r4cutQ(), 5, '11e'),
      r4vD(r4cutQ(), 6, '11f'),
      r4vN('11g ' + Wu + Hu + na + nb, 7, { q: 'รูปนี้มีพื้นที่กี่ตารางเมตร', fig: r4ex(R4SH.U(Wu, Hu, na, nb, nc), ['', `${nb} ม.`, `${na} ม.`, '', '', '', `${Wu} ม.`, `${Hu} ม.`], { rm: false, W: 340, H: 220 }), a: Wu * Hu - na * nb, unit: 'ตร.ม.', hint: `สี่เหลี่ยมใหญ่ ${Wu} × ${Hu} ลบร่อง ${na} × ${nb}` }),
      r4vN('11h ' + fo + ' ' + fi, 8, { q: `กรอบรูปจัตุรัส ด้านนอกยาวด้านละ ${fo} ซม. ช่องใส่รูปข้างในยาวด้านละ ${fi} ซม. เนื้อกรอบมีพื้นที่กี่ตารางเซนติเมตร`, fig: r4svg(240, 222, `<rect x="30" y="10" width="180" height="180" fill="#D9A55B" stroke="#2B2550" stroke-width="3"/><rect x="${120 - 90 * fi / fo}" y="${100 - 90 * fi / fo}" width="${180 * fi / fo}" height="${180 * fi / fo}" fill="#fff" stroke="#2B2550" stroke-width="2.5"/><text x="120" y="105" class="r4-lab" text-anchor="middle">${fi} ซม.</text><text x="120" y="212" class="r4-lab" text-anchor="middle">${fo} ซม.</text>`), a: fo * fo - fi * fi, unit: 'ตร.ซม.', hint: `${fo} × ${fo} − ${fi} × ${fi}` }),
      r4vN('11i ' + gw + ' ' + gl, 9, { fig: r4svg(320, 200, `<rect x="30" y="24" width="260" height="150" fill="#E0C9A6" stroke="#2B2550" stroke-width="2.4"/>` + r4grass(52, 46, 216, 106, 'r4vwk') + `<text x="160" y="104" class="r4-lab r4v-st" text-anchor="middle">สวน ${gl} ม. × ${gw} ม.</text><text x="160" y="40" class="r4-lab" text-anchor="middle">ทางเดินกว้าง 1 ม.</text>`), q: `สวนรูปสี่เหลี่ยมผืนผ้ากว้าง ${gw} ม. ยาว ${gl} ม. ทำทางเดินกว้าง 1 ม. รอบสวน (อยู่นอกสวน) ทางเดินมีพื้นที่กี่ตารางเมตร`, a: (gw + 2) * (gl + 2) - gw * gl, unit: 'ตร.ม.', hint: `รวมทางเดินแล้วกว้าง ${gw + 2} ม. ยาว ${gl + 2} ม. · ใหญ่ลบเล็ก` }),
      r4vD(r4cutQ(), 10, '11j')]; },
  1492: () => { const s = rnd(5, 10), P = 2 * rnd(6, 9);
    const best = Math.floor(P / 4), o3 = [best, best - 1, 1].filter((x, i, A) => x >= 1 && A.indexOf(x) === i);
    return [
      r4vD(r4WhichQ(), 1, '12a'),
      r4vA('12b', 2, { t: 'per', p: 2 * (rnd(2, 4) + rnd(5, 8)), u: 'ม.' }),
      r4vD(r4areaFormula(false), 3, '12c'),
      r4vD(r4fenceQ('P'), 4, '12d'),
      r4vD(r4fenceQ('A'), 5, '12e'),
      r4vD(r4duelQ(pick(['area', 'per'])), 6, '12f'),
      r4vP('12g', 7, { fig: r4vPair([12, 3], [6, 6], { u: 'ม.', na: 'แปลง ก', nb: 'แปลง ข', ca: '#A8DC8E', cb: '#A8DC8E' }), q: 'แปลง ก ขนาด 3 ม. × 12 ม. กับแปลง ข ขนาด 6 ม. × 6 ม. ข้อใดถูก', opts: ['พื้นที่เท่ากัน แต่แปลง ก ใช้รั้วยาวกว่า', 'ใช้รั้วยาวเท่ากัน และพื้นที่เท่ากัน', 'แปลง ข มีพื้นที่มากกว่า'], right: 'พื้นที่เท่ากัน แต่แปลง ก ใช้รั้วยาวกว่า', hint: 'พื้นที่ 3 × 12 = 36 และ 6 × 6 = 36 · รั้ว 2 × (3 + 12) = 30 และ 4 × 6 = 24' }),
      r4vD(r4fenceQ('PA'), 8, '12h'),
      r4vN('12i ' + s, 9, { fig: r4vPlan(s, s, { labs: ['? ม.', '', '', ''], grass: true, fence: true, id: 'i12', mid: `รั้ว ${4 * s} ม.` }), q: `แปลงผักรูปสี่เหลี่ยมจัตุรัสใช้รั้วล้อมยาว ${4 * s} ม. แปลงนี้มีพื้นที่กี่ตารางเมตร`, a: s * s, unit: 'ตร.ม.', hint: `ด้านละ ${4 * s} ÷ 4 = ${s} ม. แล้วหาพื้นที่` }),
      r4vA('12j', 10, { t: 'maxA', p: 4 * rnd(3, 4), u: 'ม.' })]; },
  1493: () => { const n = r4vNm(), l = rnd(20, 40), w = rnd(8, l - 4), p = pick([30, 40, 50, 60]), q = rnd(12, 25) * 2, r = q - 2 * rnd(3, 8);
    const w1 = rnd(8, 30), l1 = rnd(w1 + 2, 60), w2 = rnd(15, 40), l2 = rnd(w2 + 3, 60), s3 = rnd(40, 150), l4 = rnd(100, 200), w4 = rnd(50, l4 - 10), s5 = rnd(20, 95), w6 = rnd(10, 25), l6 = rnd(w6 + 2, 40), k6 = pick([2, 3]);
    return [
      r4vD(r4walkRect(), 1, '13a'),
      r4vSF('13b', 2, r4vPlan(l1, w1, { u: 'ม.', grass: true, fence: true, id: 'b' }), D6S(`สวนสาธารณะเป็นรูปสี่เหลี่ยมผืนผ้า ยาว ${l1} เมตร กว้าง ${w1} เมตร ต้องการล้อมรั้วรอบสวน จะใช้รั้วกี่เมตร`, `2 × (${l1} + ${w1})`, [`${l1} × ${w1}`, `${l1} + ${w1}`], 'เมตร')),
      r4vSF('13c', 3, r4vPlan(s3, s3, { u: 'ซม.', fill: '#2F6F57', labs: [`${s3} ซม.`, '', '', ''], track: true }), D6S(`ครูติดเทปสีรอบกระดานรูปสี่เหลี่ยมจัตุรัส ยาวด้านละ ${s3} เซนติเมตร ต้องใช้เทปกี่เซนติเมตร`, `4 × ${s3}`, [`${s3} × ${s3}`, `2 × ${s3}`], 'เซนติเมตร')),
      r4vSF('13d', 4, r4vPlan(l2, w2, { u: 'ซม.', fill: '#C98A4B' }), D6S(`${n}ทำกรอบรูปรูปสี่เหลี่ยมผืนผ้า ยาว ${l2} เซนติเมตร กว้าง ${w2} เซนติเมตร ต้องใช้ไม้ยาวกี่เซนติเมตร`, `2 × (${l2} + ${w2})`, [`${l2} × ${w2}`, `${l2} + ${w2}`], 'เซนติเมตร')),
      r4vSF('13e', 5, r4vPlan(s5, s5, { labs: ['? ซม.', '', '', ''], grass: true, id: 'e', mid: `รอบแปลง ${4 * s5} ซม.` }), D6S(`แปลงผักรูปสี่เหลี่ยมจัตุรัสมีความยาวรอบแปลง ${4 * s5} เซนติเมตร ยาวด้านละกี่เซนติเมตร`, `${4 * s5} ÷ 4`, [`${4 * s5} ÷ 2`, `${4 * s5} − 4`], 'เซนติเมตร')),
      r4vD(r4sideFromP(), 6, '13f'),
      r4vSF('13g', 7, r4vPlan(l4, w4, { labs: [`${l4} ซม.`, '', '', '? ซม.'], fill: '#E6C79C', mid: `รอบรูป ${2 * (l4 + w4)} ซม.` }), D6S(`โต๊ะรูปสี่เหลี่ยมผืนผ้ายาว ${l4} เซนติเมตร มีความยาวรอบรูป ${2 * (l4 + w4)} เซนติเมตร โต๊ะกว้างกี่เซนติเมตร`, `(${2 * (l4 + w4)} ÷ 2) − ${l4}`, [`${2 * (l4 + w4)} − ${l4}`, `${2 * (l4 + w4)} ÷ 4`], 'เซนติเมตร')),
      r4vSF('13h', 8, r4vPlan(l6, w6, { u: 'ม.', grass: true, track: true, id: 'h' }), D6S(`${n}วิ่งรอบสนามรูปสี่เหลี่ยมผืนผ้ายาว ${l6} เมตร กว้าง ${w6} เมตร จำนวน ${k6} รอบ วิ่งได้ระยะทางกี่เมตร`, `2 × (${l6} + ${w6}) × ${k6}`, [`(${l6} + ${w6}) × ${k6}`, `${l6} × ${w6} × ${k6}`], 'เมตร')),
      r4vSF('13i', 9, r4vPlan(l, w, { u: 'ม.', grass: true, fence: true, id: 'i', mid: `รั้วเมตรละ ${p} บาท` }), D6S(`${n}ล้อมรั้วรอบสวนรูปสี่เหลี่ยมผืนผ้ายาว ${l} เมตร กว้าง ${w} เมตร ค่ารั้วเมตรละ ${p} บาท ต้องจ่ายกี่บาท`, `2 × (${l} + ${w}) × ${p}`, [`${l} × ${w} × ${p}`, `(${l} + ${w}) × ${p}`], 'บาท')),
      r4vSF('13j', 10, r4vPlan(q, r, { u: 'ม.', grass: true, posts: true, id: 'j' }), D6S(`สนามรูปสี่เหลี่ยมผืนผ้ายาว ${q} เมตร กว้าง ${r} เมตร ปักเสารอบสนามห่างกันต้นละ 2 เมตร ต้องใช้เสากี่ต้น`, `2 × (${q} + ${r}) ÷ 2`, [`${q} × ${r} ÷ 2`, `(${q} + ${r}) ÷ 2`], 'ต้น'))]; },
  1494: () => { const n = r4vNm(), a1 = rnd(3, 6), b1 = rnd(4, 8), a2 = rnd(2, 5), b2 = rnd(3, 7), wA = rnd(6, 9), lA = rnd(8, 14), hA = rnd(3, 5);
    const w0 = rnd(3, 12), l0 = rnd(w0 + 1, 20), w1 = rnd(8, 15), l1 = rnd(w1 + 2, 25), w2 = rnd(20, 40), l2 = rnd(w2 + 5, 60), w4 = rnd(4, 12), l4 = rnd(w4 + 1, 18), p4 = pick([150, 200, 250, 300, 450]), w5 = rnd(8, 15), l5 = rnd(w5 + 2, 24), s5 = rnd(1, 3), w6 = rnd(10, 20), l6 = rnd(w6 + 2, 30), a6 = rnd(2, 6);
    return [
      r4vSF('14a', 1, r4vPlan(l0, w0, { u: 'ม.', grass: true, id: 'a' }), D6S(`แปลงนารูปสี่เหลี่ยมมุมฉากกว้าง ${w0} เมตร ยาว ${l0} เมตร มีพื้นที่กี่ตารางเมตร`, `${w0} × ${l0}`, [`2 × (${w0} + ${l0})`, `${w0} + ${l0}`], 'ตารางเมตร')),
      r4vSF('14b', 2, r4vPlan(l1, w1, { u: 'ซม.', fill: '#FFF6E0' }), D6S(`ซองจดหมายกว้าง ${w1} เซนติเมตร ยาว ${l1} เซนติเมตร มีพื้นที่กี่ตารางเซนติเมตร`, `${w1} × ${l1}`, [`2 × (${w1} + ${l1})`, `${w1} + ${l1}`], 'ตารางเซนติเมตร')),
      r4vSF('14c', 3, r4vPlan(l2, w2, { u: 'วา', grass: true, id: 'c' }), D6S(`ที่ดินรูปสี่เหลี่ยมมุมฉากยาว ${l2} วา กว้าง ${w2} วา ปลูกหญ้าเต็มพื้นที่ จะปลูกหญ้ากี่ตารางวา`, `${l2} × ${w2}`, [`2 × (${l2} + ${w2})`, `${l2} + ${w2}`], 'ตารางวา')),
      (() => { const N = hA * rnd(4, 9); return r4vA('14d', 4, { t: 'fixA', h: hA, n: N, u: 'ม.', au: 'ตร.ม.', cols: ['#E77FA2', '#D9668D'], q: `ห้องกว้าง ${hA} ม. (ล็อกไว้) — ลากให้ยาวพอดี จนปูพรมได้ <b>${N} ตร.ม.</b>` }); })(),
      r4vSF('14e', 5, r4vPlan(l6, w6, { u: 'ม.', grass: true, id: 'e', inner: a6, innerLab: `${a6} ม.` }), D6S(`สนามหญ้ากว้าง ${w6} เมตร ยาว ${l6} เมตร ขุดบ่อรูปสี่เหลี่ยมจัตุรัสด้านละ ${a6} เมตร เหลือพื้นที่หญ้ากี่ตารางเมตร`, `${w6} × ${l6} − ${a6} × ${a6}`, [`(${w6} + ${l6}) × 2 − ${a6} × ${a6}`, `${w6} × ${l6} + ${a6} × ${a6}`], 'ตารางเมตร')),
      r4vSF('14f', 6, r4vPlan(l4, w4, { u: 'ม.', fill: '#E77FA2', mid: `ตร.ม.ละ ${p4} บาท` }), D6S(`ร้านปูพรมคิดราคาตารางเมตรละ ${p4} บาท ห้องยาว ${l4} เมตร กว้าง ${w4} เมตร ปูพรมเต็มห้องต้องจ่ายกี่บาท`, `${l4} × ${w4} × ${p4}`, [`2 × (${l4} + ${w4}) × ${p4}`, `(${l4} + ${w4}) × ${p4}`], 'บาท')),
      r4vSF('14g', 7, r4vPlan(l5, w5, { u: 'ม.', fill: '#E7A58F', inner: s5, innerLab: `${s5} ม.`, innerFill: '#BDE6A6' }), D6S(`${n}มีลานรูปสี่เหลี่ยมผืนผ้ายาว ${l5} เมตร กว้าง ${w5} เมตร เว้นที่รูปสี่เหลี่ยมจัตุรัสยาวด้านละ ${s5} เมตรไว้ปลูกต้นไม้ ลานที่เหลือมีพื้นที่กี่ตารางเมตร`, `${l5} × ${w5} − ${s5} × ${s5}`, [`${l5} × ${w5} + ${s5} × ${s5}`, `${l5} × ${w5} − ${s5} × 4`], 'ตารางเมตร')),
      r4vSF('14h', 8, r4vPair([b1, a1], [b2, a2], { u: 'ม.', na: 'แปลงแรก', nb: 'แปลงที่สอง', ca: '#A8DC8E', cb: '#A8DC8E' }), D6S(`${n}มีแปลงผัก 2 แปลง แปลงแรกกว้าง ${a1} เมตร ยาว ${b1} เมตร แปลงที่สองกว้าง ${a2} เมตร ยาว ${b2} เมตร รวมพื้นที่กี่ตารางเมตร`, `${a1} × ${b1} + ${a2} × ${b2}`, [`(${a1} + ${a2}) × (${b1} + ${b2})`, `${a1} + ${b1} + ${a2} + ${b2}`], 'ตารางเมตร')),
      r4vD(r4cutQ(), 9, '14i'),
      r4vSF('14j', 10, r4vPlan(lA, wA, { labs: ['? ม.', '', '', `${wA} ม.`], grass: true, fence: true, id: 'j', mid: `พื้นที่ ${wA * lA} ตร.ม.` }), D6S(`ที่ดินรูปสี่เหลี่ยมผืนผ้ามีพื้นที่ ${wA * lA} ตารางเมตร กว้าง ${wA} เมตร ต้องการล้อมรั้วรอบที่ดิน ต้องใช้รั้วกี่เมตร`, `2 × (${wA * lA} ÷ ${wA} + ${wA})`, [`${wA * lA} ÷ ${wA}`, `2 × (${wA * lA} + ${wA})`], 'เมตร'))]; }
};
LESSONS_P4C9.forEach(L => { if (R4V_GAME[L.id]) { L.game = R4V_GAME[L.id]; L.gameN = 10; } }); /* หน้าสอน: p4rd.js (v251) */
