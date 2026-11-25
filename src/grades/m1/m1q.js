/* =========================================================
   ม.1 บทที่ 6 สมการเชิงเส้นตัวแปรเดียว (v245) — prefix lq<span class="rp-sep"></span>ตัวช่วยและหน้าลงมือทำ
   บทเรียนอยู่ใน m1ql.js (ด่าน 1–10) และ m1ql2.js (ด่าน 11–20 + บอส)<span class="rp-sep"></span>ใช้ Q.rpOpt / Q.rpNum / rpTF / rpSort / rpWalk ของบทที่ 7
   หัวใจของบท: ตาชั่งสมดุล (lqBalance) — เอาของออกข้างหนึ่ง ตาชั่งเอียง ต้องเอาของชนิดเดียวกันออกอีกข้างด้วย
   → เด็กเห็นเองว่า "ย้ายข้างแล้วเปลี่ยนเครื่องหมาย" มาจากการทำสิ่งเดียวกันทั้งสองข้าง
   ========================================================= */
const lqN = n => n < 0 ? '−' + rpN(-n) : rpN(n);
const lqP = n => n < 0 ? `(${lqN(n)})` : lqN(n);
const lqT = (a, v = 'x') => a === 1 ? v : a === -1 ? '−' + v : lqN(a) + v;
const lqLin = (a, b, v = 'x') => { if (!a) return lqN(b); let s = lqT(a, v); if (b > 0) s += ' + ' + rpN(b); else if (b < 0) s += ' − ' + rpN(-b); return s; };
const lqE = s => `<span class="num lq-e">${s}</span>`;
const lqSide = o => o.x && o.u ? `${lqT(o.x)} + ${o.u}` : o.x ? lqT(o.x) : String(o.u);
const LQ_C = { x: '#7C5CE0', u: '#F08A24' };
/* static balanced scale for game pictures: L/R = { x, u } */
const lqBalSVG = (L, R) => { const it = (o, cx) => { let s = '', k = 0; const put = (kind) => { const c = k % 5, r = Math.floor(k / 5), x = cx - 80 + c * 40, y = 118 - r * 40; s += kind === 'x' ? `<rect x="${x}" y="${y - 34}" width="34" height="34" rx="6" fill="${LQ_C.x}"/><text x="${x + 17}" y="${y - 10}" class="lq-it-t" text-anchor="middle">x</text>` : `<circle cx="${x + 17}" cy="${y - 16}" r="15" fill="${LQ_C.u}"/><text x="${x + 17}" y="${y - 10}" class="lq-it-t" text-anchor="middle">1</text>`; k++; };
    for (let i = 0; i < o.x; i++) put('x'); for (let i = 0; i < o.u; i++) put('u'); return s; };
  return `<svg viewBox="0 0 520 210" class="lq-bs" aria-hidden="true"><path d="M260 150 L236 200 h48 z" fill="#CFC7E6"/><path d="M60 150 H460" stroke="#2B2550" stroke-width="6" stroke-linecap="round"/><path d="M40 122 h200 l-12 20 h-176 z M280 122 h200 l-12 20 h-176 z" fill="#FFF6D6" stroke="#2B2550" stroke-width="2.5"/>${it(L, 140)}${it(R, 380)}</svg>`; };

/* =========================================================
   ตาชั่งสมดุล: แตะของบนจานเพื่อเอาออก<span class="rp-sep"></span>rounds = [{ L: { x, u }, R: { x, u }, sol }]
   ========================================================= */
function lqBalance(rounds, cap) {
  const wrap = tgWrap(), fig = h('div', { class: 'tg-board lq-bal' }), out = fNote2(), eqEl = h('div', { class: 'lq-eqnow' });
  const mis = tgMission(rounds.map((R, i) => [`${lqSide(R.L)} = ${lqSide(R.R)}`, s => s.done > i]), wrap); let r = 0, S, pend = null, done = 0;
  const act = h('div', { class: 'rp-chips lq-act' }), nm = k => k === 'x' ? 'กล่อง x' : 'ก้อน 1';
  const solved = () => (S.L.x === 1 && !S.L.u && !S.R.x) || (S.R.x === 1 && !S.R.u && !S.L.x);
  const load = () => { const R = rounds[r]; S = { L: { ...R.L }, R: { ...R.R } }; pend = null; act.innerHTML = ''; draw(); out.innerHTML = 'แตะ<b>กล่อง x</b> หรือ<b>ก้อน 1</b> บนจานเพื่อเอาออก — ทำให้เหลือ x อยู่ข้างเดียว'; after(); };
  const after = () => { act.innerHTML = '';
    if (!pend && solved()) { const v = S.L.x ? S.R.u : S.L.u; out.innerHTML = `<b>x = ${v}</b> ✓ ตรวจ: แทน x = ${v} ในสมการเดิม ${lqSide(rounds[r].L)} = ${lqSide(rounds[r].R)} ได้ ${rounds[r].L.x * v + rounds[r].L.u} = ${rounds[r].R.x * v + rounds[r].R.u}`; done = Math.max(done, r + 1); sfx.ok(); mis.check({ done });
      if (r < rounds.length - 1) act.append(h('button', { class: 'btn sm rp-next', onclick: e => { e.stopPropagation(); r++; load(); } }, 'ข้อต่อไป')); return; }
    if (!pend) { const sx = S.L.x > 1 && !S.L.u && !S.R.x ? 'L' : S.R.x > 1 && !S.R.u && !S.L.x ? 'R' : null;
      if (sx) { const k = S[sx].x, o = sx === 'L' ? 'R' : 'L'; act.append(h('button', { class: 'btn sm', onclick: e => { e.stopPropagation(); if (S[o].u % k) { out.innerHTML = 'แบ่งไม่ลงตัว'; return; } S[sx].x = 1; S[o].u /= k; sfx.pop(4); draw(); after(); } }, `แบ่งทั้งสองข้างเป็น ${k} ส่วนเท่ากัน`)); out.innerHTML = `เหลือ ${lqT(k)} = ${S[o].u} — <b>ทั้งสองข้างหารด้วย ${k}</b> (แบ่งเป็น ${k} ส่วนเท่า ๆ กัน)`; } } };
  const take = (side, kind) => { const o = side === 'L' ? 'R' : 'L';
    if (pend) { if (side === pend.side) { sfx.no(); out.innerHTML = `ตาชั่งเอียงอยู่ — ต้องเอา<b>${nm(pend.kind)}</b>ออกจาก<b>อีกข้าง</b>ก่อน`; return; }
      if (kind !== pend.kind) { sfx.no(); out.innerHTML = `ต้องเอาของ<b>ชนิดเดียวกัน</b> (${nm(pend.kind)}) ออกจากอีกข้าง ตาชั่งจึงจะสมดุล`; return; }
      S[side][kind]--; pend = null; sfx.pop(3); draw(); out.innerHTML = `สมดุลอีกครั้ง! เอา${nm(kind)}ออก<b>ทั้งสองข้าง</b> → ${lqSide(S.L)} = ${lqSide(S.R)}`; after(); return; }
    if (!S[o][kind]) { sfx.no(); out.innerHTML = `อีกข้างไม่มี${nm(kind)}ให้เอาออกด้วย — ลองเอาของอย่างอื่นออก`; return; }
    S[side][kind]--; pend = { side, kind }; sfx.pop(1); draw(); out.innerHTML = `ตาชั่ง<b>เอียง</b>! เอา${nm(kind)}ออกจากอีกข้างด้วย`; act.innerHTML = ''; };
  const draw = () => { const R = rounds[r], wL = S.L.x * R.sol + S.L.u, wR = S.R.x * R.sol + S.R.u, t = Math.max(-12, Math.min(12, (wR - wL) * 4)) * Math.PI / 180, cx = 320, cy = 250, A = 200;
    const ex = (sd) => [cx + sd * A * Math.cos(t), cy + sd * A * Math.sin(t)];
    const pan = (side, sd) => { const [px, py] = ex(sd), o = S[side]; let s = `<path d="M${px - 104} ${py - 4} h208 l-14 22 h-180 z" fill="#FFF6D6" stroke="#2B2550" stroke-width="2.5"/>`, k = 0;
      const put = kind => { const c = k % 5, row = Math.floor(k / 5), x = px - 96 + c * 40, y = py - 8 - row * 40; s += `<g class="lq-it rp-hit" data-s="${side}" data-k="${kind}">${kind === 'x' ? `<rect x="${x}" y="${y - 34}" width="34" height="34" rx="6" fill="${LQ_C.x}"/><text x="${x + 17}" y="${y - 10}" class="lq-it-t" text-anchor="middle">x</text>` : `<circle cx="${x + 17}" cy="${y - 16}" r="16" fill="${LQ_C.u}"/><text x="${x + 17}" y="${y - 10}" class="lq-it-t" text-anchor="middle">1</text>`}</g>`; k++; };
      for (let i = 0; i < o.x; i++) put('x'); for (let i = 0; i < o.u; i++) put('u'); return s; };
    fig.innerHTML = `<svg viewBox="50 96 540 232" class="tg-scene" aria-hidden="true"><path d="M${cx} ${cy} L${cx - 30} 322 h60 z" fill="#CFC7E6"/><path d="M${ex(-1)[0]} ${ex(-1)[1]} L${ex(1)[0]} ${ex(1)[1]}" stroke="#2B2550" stroke-width="7" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="7" fill="#2B2550"/>${pan('L', -1)}${pan('R', 1)}</svg>`;
    fig.querySelectorAll('.lq-it').forEach(g => g.onclick = e => { e.stopPropagation(); if (!pend && solved()) return; take(g.dataset.s, g.dataset.k); });
    eqEl.innerHTML = pend ? `<span class="lq-tilt">ไม่สมดุล</span>` : lqE(`${lqSide(S.L)} = ${lqSide(S.R)}`); };
  load(); wrap.append(h('div', { class: 'cap', html: cap || '<b>ตาชั่งสมดุล</b> = สมการ<span class="rp-sep"></span>กล่อง x ทุกกล่องหนักเท่ากัน ก้อน 1 หนัก 1 หน่วย' }), mis.el, eqEl, fig, act, out); return wrap;
}
/* substitute and check: drag x on the number line, the scale tips until both sides are equal */
function lqSimTry(a, b, c, lo = -2, hi = 10) {
  const W = 620, H = 270, X0 = 40, SX = (W - 80) / (hi - lo), Y = 220, sol = (c - b) / a, ex = x => `${a === 1 ? '' : a === -1 ? '−' : lqN(a)}${a === 1 || a === -1 ? lqP(x) : `(${lqN(x)})`}${b ? (b > 0 ? ' + ' + b : ' − ' + -b) : ''}`;
  return tgScene({ W, H, st: { x: lo + 1, lo: false, hi: false }, cap: `สมการ ${lqE(`${lqLin(a, b)} = ${lqN(c)}`)} — <b>ลากจุดบนเส้นจำนวน</b> เพื่อลองแทนค่า x`,
    missions: [['ลองค่าที่ทำให้ข้างซ้ายน้อยไป', s => s.lo], ['ลองค่าที่ทำให้ข้างซ้ายมากไป', s => s.hi], ['หาคำตอบของสมการ', s => s.x === sol]],
    svg: s => { const v = a * s.x + b, t = Math.max(-10, Math.min(10, (c - v) * 1.5)) * Math.PI / 180, cx = 310, cy = 80, A = 170;
      let g = `<path d="M${cx} ${cy} L${cx - 20} ${cy + 60} h40 z" fill="#CFC7E6"/><path d="M${cx - A * Math.cos(t)} ${cy - A * Math.sin(t)} L${cx + A * Math.cos(t)} ${cy + A * Math.sin(t)}" stroke="#2B2550" stroke-width="6" stroke-linecap="round"/>`;
      g += `<text x="${cx - A * Math.cos(t)}" y="${cy - A * Math.sin(t) - 14}" class="rp-sv" text-anchor="middle">${rpN(v)}</text><text x="${cx + A * Math.cos(t)}" y="${cy + A * Math.sin(t) - 14}" class="rp-sv" text-anchor="middle">${rpN(c)}</text>`;
      g += `<path d="M${X0} ${Y} h${SX * (hi - lo)}" stroke="#2B2550" stroke-width="2"/>`; for (let i = lo; i <= hi; i++) g += `<path d="M${X0 + (i - lo) * SX} ${Y - 6} v12" stroke="#2B2550" stroke-width="1.5"/><text x="${X0 + (i - lo) * SX}" y="${Y + 26}" class="rp-sm" text-anchor="middle">${lqN(i)}</text>`;
      return g + tgHandle(X0 + (s.x - lo) * SX, Y, RP_C.o); },
    drag: (p, s) => { const x = Math.max(lo, Math.min(hi, Math.round((p[0] - X0) / SX) + lo)), v = a * x + b; return { x, lo: s.lo || v < c, hi: s.hi || v > c }; },
    info: s => { const v = a * s.x + b; return `แทน x = ${lqN(s.x)}: ${ex(s.x)} = <b>${lqN(v)}</b> ${v === c ? '=' : v < c ? '&lt;' : '&gt;'} ${lqN(c)} → ${v === c ? '<b>เป็นคำตอบ</b> ✓ ทั้งสองข้างเท่ากัน' : 'ยังไม่ใช่คำตอบ'}`; } });
}
/* value of an expression: drag x on the number line */
function lqSimSub(a, b, xs = [4, -2, 0], lo = -5, hi = 8) {
  const W = 620, H = 200, X0 = 40, SX = (W - 80) / (hi - lo), Y = 120, ex = x => `${a === 1 ? '' : lqN(a) + ' × '}${lqP(x)}${b > 0 ? ' + ' + b : b < 0 ? ' − ' + -b : ''}`;
  return tgScene({ W, H, st: { x: 1 }, cap: `นิพจน์ ${lqE(lqLin(a, b))} — <b>ลากจุดบนเส้นจำนวน</b> เพื่อเปลี่ยนค่าของ x`,
    missions: xs.map(x => [`ทำให้ค่าเป็น ${lqN(a * x + b)}`, s => s.x === x]),
    svg: s => { let g = `<path d="M${X0} ${Y} h${SX * (hi - lo)}" stroke="#2B2550" stroke-width="2"/>`; for (let i = lo; i <= hi; i++) g += `<path d="M${X0 + (i - lo) * SX} ${Y - 6} v12" stroke="#2B2550" stroke-width="1.5"/><text x="${X0 + (i - lo) * SX}" y="${Y + 26}" class="rp-sm" text-anchor="middle">${lqN(i)}</text>`;
      return g + `<text x="${X0 + (s.x - lo) * SX}" y="${Y - 30}" class="rp-sv" text-anchor="middle" style="fill:${LQ_C.x}">x = ${lqN(s.x)}</text>` + tgHandle(X0 + (s.x - lo) * SX, Y, RP_C.o); },
    drag: p => ({ x: Math.max(lo, Math.min(hi, Math.round((p[0] - X0) / SX) + lo)) }),
    info: s => `เมื่อ x = ${lqN(s.x)}: ${lqLin(a, b)} = ${ex(s.x)} = <b class="num">${lqN(a * s.x + b)}</b>` });
}
/* distributive property: drag the divider of a rows × cols rectangle */
function lqSimDist(rows = 3, cols = 8, picks = [5, 2, 6]) {
  const C = 40, X0 = 30, Y0 = 30, W = X0 * 2 + cols * C, H = Y0 + rows * C + 40;
  return tgScene({ W, H, st: { b: 4 }, cap: `สี่เหลี่ยม ${rows} แถว แถวละ ${cols} ช่อง — <b>ลากเส้นแบ่งสีส้ม</b> แบ่งเป็นสองส่วน แล้วนับทีละส่วน`,
    missions: picks.map(b => [`${cols} = ${b} + ${cols - b}`, s => s.b === b]),
    svg: s => { let g = ''; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) g += `<rect x="${X0 + c * C + 2}" y="${Y0 + r * C + 2}" width="${C - 4}" height="${C - 4}" rx="5" fill="${c < s.b ? '#BFE0FF' : '#FFE1C2'}"/>`;
      const x = X0 + s.b * C; return g + `<path d="M${x} ${Y0 - 14} V${Y0 + rows * C + 14}" stroke="${RP_C.o}" stroke-width="4"/>` + tgHandle(x, Y0 + rows * C + 22, RP_C.o) + `<text x="${X0 + s.b * C / 2}" y="${Y0 - 10}" class="rp-sv" text-anchor="middle">${s.b}</text><text x="${x + (cols - s.b) * C / 2}" y="${Y0 - 10}" class="rp-sv" text-anchor="middle">${cols - s.b}</text>`; },
    drag: p => ({ b: Math.max(1, Math.min(cols - 1, Math.round((p[0] - X0) / C))) }),
    info: s => `${rows} × (${s.b} + ${cols - s.b}) = ${rows} × ${s.b} + ${rows} × ${cols - s.b} = ${rows * s.b} + ${rows * (cols - s.b)} = <b>${rows * cols}</b>` });
}
/* undo machine: tap the inverse operations in the right order (last operation first) */
function lqSimMachine(rounds) {
  const wrap = tgWrap(), chain = h('div', { class: 'lq-chain' }), back = h('div', { class: 'lq-chain back' }), chips = h('div', { class: 'rp-chips' }), out = fNote2(), dots = h('div', { class: 'tg-mis' }, ...rounds.map((_, i) => h('span', { class: 'tg-mi' }, 'ข้อ ' + (i + 1)))); let r = 0, k = 0, val = 0;
  const inv = ([o, n]) => [{ '×': '÷', '÷': '×', '+': '−', '−': '+' }[o], n], run = (v, [o, n]) => o === '×' ? v * n : o === '÷' ? v / n : o === '+' ? v + n : v - n;
  const show = () => { const R = rounds[r]; k = 0; val = R.out; chain.innerHTML = `<span class="lq-box x">x</span><span class="lq-to">→</span>${R.ops.map(([o, n]) => `<span class="lq-arr">${o} ${n}</span>`).join('<span class="lq-to">→</span>')}<span class="lq-to">→</span><span class="lq-box">${R.out}</span>`; back.innerHTML = `<span class="lq-box">${R.out}</span>`;
    const opts = shuffle([...R.ops.map(inv), ...R.ops]); chips.innerHTML = ''; opts.forEach(op => chips.append(h('button', { class: 'btn sm rp-chip', onclick: e => { e.stopPropagation(); step(op, e.currentTarget); } }, `${op[0]} ${op[1]}`)));
    out.innerHTML = 'ย้อนกลับจากผลลัพธ์: แตะ<b>การดำเนินการที่ทำกลับ</b> ของขั้น<b>สุดท้าย</b>ก่อน'; };
  const step = (op, b) => { const R = rounds[r], want = inv(R.ops[R.ops.length - 1 - k]);
    if (op[0] !== want[0] || op[1] !== want[1]) { sfx.no(); out.innerHTML = R.ops.some(x => x[0] === op[0] && x[1] === op[1]) ? 'นั่นคือขั้นเดิม — ต้องทำ<b>ตรงข้าม</b>เพื่อย้อนกลับ' : `ยังไม่ใช่ — ย้อนขั้น <b>${R.ops[R.ops.length - 1 - k].join(' ')}</b> ก่อน`; return; }
    val = run(val, op); k++; b.disabled = true; sfx.pop(k + 2); back.innerHTML += `<span class="lq-arr">${op[0]} ${op[1]}</span><span class="lq-to">→</span><span class="lq-box${k === R.ops.length ? ' x' : ''}">${rpN(val)}</span>`;
    if (k === R.ops.length) { dots.children[r].classList.add('ok'); sfx.ok(); out.innerHTML = `<b>x = ${rpN(val)}</b> — ตรวจ: ${rpN(val)} ${R.ops.map(o => o.join(' ')).join(' ')} = ${R.out} ✓`; chips.innerHTML = '';
      setTimeout(() => { r++; if (r < rounds.length) show(); else { out.innerHTML += '<span class="rp-sep"></span>แก้สมการ = ย้อนกลับทีละขั้นจากขั้นสุดท้าย'; teachDone(wrap); } }, 1800); } };
  show(); wrap.append(h('div', { class: 'cap', html: '<b>เครื่องแปลงจำนวน</b>: x ผ่านเครื่องแล้วได้ผลลัพธ์ — ย้อนกลับเพื่อหา x' }), dots, chain, chips, back, out); return wrap;
}
/* clearing fractions: tap a number to multiply both sides — only a common multiple of the denominators clears them all */
function lqSimClear(d1 = 2, d2 = 3, rhs = 5, cands = [2, 3, 5, 6]) {
  const wrap = tgWrap(), out = fNote2(), eq = h('div', { class: 'fbig lq-big', html: `${fqHTML('x', d1)} + ${fqHTML('x', d2)} = ${rhs}` }), L = rpLcm(d1, d2), st = { bad: false, ok: false };
  const mis = tgMission([['ลองจำนวนที่ยังเหลือเศษส่วน', s => s.bad], [`คูณด้วย ค.ร.น. ของ ${d1} กับ ${d2}`, s => s.ok]], wrap);
  const chips = h('div', { class: 'rp-chips' }, ...cands.map(m => h('button', { class: 'btn sm rp-chip', onclick: e => { e.stopPropagation(); chips.querySelectorAll('.rp-chip').forEach(c => c.classList.toggle('on', c === e.currentTarget));
    const t = d => m % d === 0 ? lqT(m / d) : `${fqHTML(m + 'x', d)}`, a = m / d1 + m / d2;
    eq.innerHTML = `${m} × ${fqHTML('x', d1)} + ${m} × ${fqHTML('x', d2)} = ${m} × ${rhs} <br>${t(d1)} + ${t(d2)} = ${m * rhs}`;
    if (m % d1 || m % d2) { st.bad = true; sfx.no(); out.innerHTML = `คูณด้วย ${m} แล้ว<b>ยังมีเศษส่วนเหลือ</b> — ต้องเป็นจำนวนที่ทั้ง ${d1} และ ${d2} หารลงตัว`; }
    else { st.ok = st.ok || m === L; sfx.pop(3); out.innerHTML = `เศษส่วนหายหมด → ${lqT(a)} = ${m * rhs} → <b>x = ${rpN(m * rhs / a)}</b>${m === L ? `<span class="rp-sep"></span>${L} คือ ค.ร.น. — ตัวเลขเล็กที่สุดที่ใช้ได้` : ''}`; }
    mis.check(st); } }, `× ${m}`)));
  out.innerHTML = '<b>แตะจำนวน</b> เพื่อคูณทั้งสองข้างของสมการ'; wrap.append(h('div', { class: 'cap', html: 'กำจัดตัวส่วน: คูณ<b>ทั้งสองข้าง</b>ด้วยจำนวนเดียวกัน' }), mis.el, eq, chips, out); return wrap;
}
/* consecutive numbers: drag n, see n, n + 1, n + 2 and their sum */
function lqSimConsec(targets = [48, 66, 33]) {
  const W = 620, H = 190, X0 = 30, SX = 19, Y = 110;
  return tgScene({ W, H, st: { n: 5 }, cap: '<b>ลากจุด</b> เลือกจำนวนแรก n — จำนวนเรียงกันสามจำนวนคือ n, n + 1, n + 2',
    missions: targets.map(t => [`ผลบวกเป็น ${t}`, s => 3 * s.n + 3 === t]),
    svg: s => { let g = `<path d="M${X0} ${Y} h${SX * 29}" stroke="#2B2550" stroke-width="2"/>`; for (let i = 1; i <= 30; i++) g += `<path d="M${X0 + (i - 1) * SX} ${Y - 5} v10" stroke="#2B2550" stroke-width="1.3"/>${i % 5 === 0 || i === 1 ? `<text x="${X0 + (i - 1) * SX}" y="${Y + 26}" class="rp-sm" text-anchor="middle">${i}</text>` : ''}`;
      [0, 1, 2].forEach(k => { if (s.n + k <= 30) g += `<circle cx="${X0 + (s.n + k - 1) * SX}" cy="${Y}" r="9" fill="${[RP_C.o, RP_C.b, RP_C.g][k]}"/><text x="${X0 + (s.n + k - 1) * SX}" y="${Y - 20 - k * 18}" class="rp-sv" text-anchor="middle">${s.n + k}</text>`; }); return g + tgHandle(X0 + (s.n - 1) * SX, Y, RP_C.o); },
    drag: p => ({ n: Math.max(1, Math.min(28, Math.round((p[0] - X0) / SX) + 1)) }),
    info: s => `${s.n} + ${s.n + 1} + ${s.n + 2} = <b>${3 * s.n + 3}</b><span class="rp-sep"></span>เขียนเป็นนิพจน์: n + (n + 1) + (n + 2) = <b>3n + 3</b>` });
}
/* ages over time: drag the year — the difference never changes, the "times" does */
function lqSimAge(f0 = 40, c0 = 10, missions) {
  const W = 620, H = 250, X0 = 60, SX = 21, Y = 210, lo = -10, hi = 15, U = 2.6;
  return tgScene({ W, H, st: { t: 0 }, cap: `ตอนนี้พ่ออายุ ${f0} ปี ลูกอายุ ${c0} ปี — <b>ลากจุดบนเส้นเวลา</b> ไปอดีต (ซ้าย) หรืออนาคต (ขวา)`,
    missions: missions || [['พ่ออายุเป็น 3 เท่าของลูก', s => f0 + s.t === 3 * (c0 + s.t)], ['อายุรวมกัน 70 ปี', s => f0 + c0 + 2 * s.t === 70], ['พ่ออายุเป็น 6 เท่าของลูก', s => f0 + s.t === 6 * (c0 + s.t)]],
    svg: s => { const fa = f0 + s.t, ca = c0 + s.t; let g = `<rect x="${X0}" y="30" width="${fa * U * 2}" height="34" rx="6" fill="${RP_C.b}" fill-opacity=".8"/><text x="${X0 - 8}" y="53" class="rp-sv" text-anchor="end">พ่อ</text><text x="${X0 + fa * U * 2 + 8}" y="53" class="rp-sv">${fa} ปี</text>`;
      g += `<rect x="${X0}" y="80" width="${Math.max(0, ca) * U * 2}" height="34" rx="6" fill="${RP_C.o}" fill-opacity=".85"/><text x="${X0 - 8}" y="103" class="rp-sv" text-anchor="end">ลูก</text><text x="${X0 + Math.max(0, ca) * U * 2 + 8}" y="103" class="rp-sv">${ca} ปี</text>`;
      g += `<path d="M${X0} ${Y} h${SX * (hi - lo)}" stroke="#2B2550" stroke-width="2"/>`; for (let i = lo; i <= hi; i += 5) g += `<path d="M${X0 + (i - lo) * SX} ${Y - 6} v12" stroke="#2B2550" stroke-width="1.5"/><text x="${X0 + (i - lo) * SX}" y="${Y + 26}" class="rp-sm" text-anchor="middle">${i === 0 ? 'ตอนนี้' : i > 0 ? `อีก ${i} ปี` : `${-i} ปีก่อน`}</text>`;
      return g + tgHandle(X0 + (s.t - lo) * SX, Y, RP_C.o); },
    drag: p => ({ t: Math.max(lo, Math.min(hi, Math.round((p[0] - X0) / SX) + lo)) }),
    info: s => { const fa = f0 + s.t, ca = c0 + s.t; return s.t === 0 ? `ตอนนี้: พ่อ ${fa} ปี<span class="rp-sep"></span>ลูก ${ca} ปี<span class="rp-sep"></span>อายุต่างกัน ${fa - ca} ปี<span class="rp-sep"></span>พ่อเป็น ${rpN(fa / ca)} เท่าของลูก` : `${s.t > 0 ? `อีก ${s.t} ปี` : `${-s.t} ปีก่อน`}: พ่อ ${f0} ${s.t >= 0 ? '+' : '−'} ${Math.abs(s.t)} = ${fa}<span class="rp-sep"></span>ลูก ${c0} ${s.t >= 0 ? '+' : '−'} ${Math.abs(s.t)} = ${ca}<span class="rp-sep"></span>อายุต่างกัน ${fa - ca} ปีเสมอ<span class="rp-sep"></span>พ่อเป็น ${rpN(fa / ca)} เท่าของลูก`; } });
}
/* rectangle: drag the width, length = width + d, see the perimeter */
function lqSimRect(d = 4, targets = [20, 28, 40]) {
  const W = 620, H = 360, X0 = 30, Y0 = 40, U = 29;
  return tgScene({ W, H, st: { w: 4 }, cap: `สี่เหลี่ยมผืนผ้ามีความยาว<b>มากกว่า</b>ความกว้าง ${d} หน่วย — <b>ลากมุมขวาล่าง</b>เพื่อเปลี่ยนความกว้าง`,
    missions: targets.map(t => [`ความยาวรอบรูป ${t} หน่วย`, s => 2 * (2 * s.w + d) === t]),
    svg: s => { const L = s.w + d; return `<rect x="${X0}" y="${Y0}" width="${L * U}" height="${s.w * U}" fill="${RP_C.g}" fill-opacity=".18" stroke="${RP_C.g}" stroke-width="3"/><text x="${X0 + L * U / 2}" y="${Y0 - 10}" class="rp-sv" text-anchor="middle">ยาว x + ${d} = ${L}</text><text x="${X0 + L * U + 10}" y="${Y0 + s.w * U / 2 + 6}" class="rp-sv">กว้าง x = ${s.w}</text>` + tgHandle(X0 + L * U, Y0 + s.w * U, RP_C.o); },
    drag: p => ({ w: Math.max(1, Math.min(10, Math.round((p[1] - Y0) / U))) }),
    info: s => `ความยาวรอบรูป = 2 × (กว้าง + ยาว) = 2 × (${s.w} + ${s.w + d}) = <b>${2 * (2 * s.w + d)}</b><span class="rp-sep"></span>เป็นนิพจน์: 2(x + x + ${d}) = <b>4x + ${2 * d}</b>` });
}
