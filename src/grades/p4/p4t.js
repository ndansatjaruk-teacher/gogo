/* =========================================================
   units live in FAMILIES so every conversion is exact (P4 conventions: 1 เดือน = 30 วัน · 1 ปี = 12 เดือน = 52 สัปดาห์ = 365 วัน)
     short  : วินาที นาที ชั่วโมง วัน สัปดาห์ (base = วินาที)
     ym / yw / md / yd : ปี|เดือน · ปี|สัปดาห์ · เดือน|วัน · ปี|วัน
   reuses P3 time (p3t.js): t3LineSVG · Q.t3Dur · Q.t3End · tkClk · t3dot ; duoInput / answerBox ; Q.p4Seq (เรียงวิธีทำ)
   ========================================================= */
const T4F = [{ 'วินาที': 1, 'นาที': 60, 'ชั่วโมง': 3600, 'วัน': 86400, 'สัปดาห์': 604800 }, { 'เดือน': 1, 'ปี': 12 }, { 'สัปดาห์': 1, 'ปี': 52 }, { 'วัน': 1, 'เดือน': 30 }, { 'วัน': 1, 'ปี': 365 }];
const t4parts = t => { const out = []; String(t).replace(/([\d,]+)\s*(วินาที|นาที|ชั่วโมง|วัน|สัปดาห์|เดือน|ปี)/g, (m, n, u) => { out.push([+n.replace(/,/g, ''), u]); }); return out; };
const t4fam = units => T4F.find(F => units.every(u => u in F));
const t4val = (t, F) => t4parts(t).reduce((a, [n, u]) => a + n * F[u], 0);
const t4txt = (v, units, F) => { const out = []; units.forEach((u, i) => { const k = i === units.length - 1 ? v / F[u] : Math.floor(v / F[u]); v -= k * F[u]; if (k) out.push(`${fmt(k)} ${u}`); }); return out.join(' ') || `0 ${units[units.length - 1]}`; };
const t4split = (v, units, F) => units.map((u, i) => { const k = i === units.length - 1 ? v / F[u] : Math.floor(v / F[u]); v -= k * F[u]; return k; });
const t4hm = m => t3d(m), t4ms = s => t4txt(s, ['นาที', 'วินาที'], T4F[0]);
const T4_HINT = ['1 นาที = 60 วินาที · 1 ชั่วโมง = 60 นาที · 1 วัน = 24 ชั่วโมง · 1 สัปดาห์ = 7 วัน', '1 ปี = 12 เดือน', '1 ปี = 52 สัปดาห์', '1 เดือน = 30 วัน', '1 ปี = 365 วัน'];
/* stopwatch picture with a seconds hand */
function t4WatchSVG(sec, o = {}) { const a = (sec % 60) * 6 - 90, r = 74, c = 100, m = Math.floor(sec / 60) % 30, am = m * 12 - 90;
  let t = ''; for (let i = 0; i < 60; i++) { const g = i * 6 * Math.PI / 180, big = i % 5 === 0; t += `<path d="M${c + Math.sin(g) * (r - (big ? 10 : 5))} ${108 - Math.cos(g) * (r - (big ? 10 : 5))} L${c + Math.sin(g) * r} ${108 - Math.cos(g) * r}" stroke="#4A4560" stroke-width="${big ? 2.4 : 1}"/>`;
    if (big) t += `<text x="${c + Math.sin(g) * (r - 22)}" y="${108 - Math.cos(g) * (r - 22) + 5}" text-anchor="middle" class="t4-wn">${i || 60}</text>`; }
  return `<svg viewBox="0 0 200 200" class="t4-watch" aria-hidden="true"><rect x="88" y="6" width="24" height="16" rx="4" fill="#E5505E"/><circle cx="${c}" cy="108" r="${r + 10}" fill="#FFE3A8" stroke="#E3A21C" stroke-width="5"/><circle cx="${c}" cy="108" r="${r}" fill="#fff"/>${t}
    <circle cx="${c}" cy="140" r="18" fill="#F4F0FF" stroke="#B9A6F5"/><path d="M${c} 140 L${c + 13 * Math.cos(am * Math.PI / 180)} ${140 + 13 * Math.sin(am * Math.PI / 180)}" stroke="#5B9BD5" stroke-width="3" stroke-linecap="round"/><text x="${c}" y="168" text-anchor="middle" class="t4-wn s">นาที</text>
    <path d="M${c} 108 L${c + (r - 8) * Math.cos(a * Math.PI / 180)} ${108 + (r - 8) * Math.sin(a * Math.PI / 180)}" stroke="#E5505E" stroke-width="3" stroke-linecap="round"/><circle cx="${c}" cy="108" r="5" fill="#E5505E"/>${o.lab ? `<rect x="${c - 26}" y="70" width="52" height="20" rx="6" fill="#fff" stroke="#E5505E"/><text x="${c}" y="85" text-anchor="middle" class="t4-wn b">${o.lab}</text>` : ''}</svg>`; }
/* unit ladder picture */
const T4_LAD = [['วินาที', ''], ['นาที', '× 60'], ['ชั่วโมง', '× 60'], ['วัน', '× 24'], ['สัปดาห์', '× 7']];
const t4LadderSVG = (hi = []) => `<svg viewBox="0 0 560 128" class="t4-lad" aria-hidden="true">${T4_LAD.map(([u, f], i) => `<rect x="${8 + i * 110}" y="${80 - i * 14}" width="96" height="40" rx="10" fill="${hi.includes(u) ? '#FFD45C' : '#F4F0FF'}" stroke="#7E6ED6" stroke-width="2"/><text x="${56 + i * 110}" y="${106 - i * 14}" text-anchor="middle" class="t4-lu">${u}</text>${i ? `<text x="${i * 110 - 3}" y="${70 - i * 14}" text-anchor="middle" class="t4-lf">${f.replace('× ', '1 ' + u + ' = ').replace(/= (\d+)/, `= $1 ${T4_LAD[i - 1][0]}`)}</text>` : ''}`).join('')}</svg>`;
/* tables (schedules) */
const t4TabHTML = (title, head, rows, o = {}) => `<div class="mnled t4tab"><div class="mnled-t">${title}</div><table><tr class="hd">${head.map(x => `<td>${x}</td>`).join('')}</tr>${rows.map((r, i) => `<tr${o.hl === i ? ' class="hl"' : ''}>${r.map((c, j) => `<td${o.num && o.num.includes(j) ? ' class="n"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
const t4dot = m => t3dotM(m), t4clk = (h, m) => T3(h, m);
/* months between two dates (same day of month) */
const t4mon = (d, m, y) => `${d} ${TK_MON[m]} ${y}`;

/* ---------- sims ---------- */
function simT4Watch() { // a real stopwatch: start / stop, then read seconds ↔ minutes
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(); let sec = 0, run = 0, n = 0;
  const paint = () => { fig.innerHTML = t4WatchSVG(sec, { lab: `${Math.floor(sec / 60)}:${pad2(sec % 60)}` }); out.innerHTML = `ผ่านไป <b>${fmt(sec)} วินาที</b>` + (sec >= 60 ? ` = <b>${t4ms(sec)}</b><br>เพราะ 1 นาที = 60 วินาที` : '<br>ครบ 60 วินาที = 1 นาที'); };
  const tick = () => { if (!box.isConnected) { clearInterval(run); return; } sec += 5; paint(); };
  const go = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (run) { clearInterval(run); run = 0; go.textContent = '▶ เดินต่อ'; if (sec >= 60 && ++n >= 1) teachDone(box); } else { run = setInterval(tick, 160); go.textContent = '⏸ หยุด'; } sfx.tap(); } }, '▶ เริ่มจับเวลา');
  const jump = (k, lab) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sec = Math.max(0, sec + k); sfx.pop(2); paint(); if (sec >= 60) teachDone(box); } }, lab);
  box.append(fig, h('div', { class: 'rowstack' }, go, jump(60, '+ 1 นาที'), jump(15, '+ 15 วินาที'), jump(-sec, '↺ 0')), out); paint(); return box; }
function simT4Ladder() { // pick a number and a unit, climb up / down the ladder
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set(); let v = 3, ui = 2;
  const paint = () => { const F = T4F[0], s = v * F[T4_LAD[ui][0]]; fig.innerHTML = t4LadderSVG([T4_LAD[ui][0]]);
    out.innerHTML = T4_LAD.map(([u]) => { const x = s / F[u]; return Number.isInteger(x) ? `<span class="${u === T4_LAD[ui][0] ? 'hl' : ''}">${fmt(x)} ${u}</span>` : null; }).filter(Boolean).join(' = ') + '<br>ลงบันได (หน่วยเล็กลง) → <b>คูณ</b> · ขึ้นบันได (หน่วยใหญ่ขึ้น) → <b>หาร</b>'; seen.add(ui); if (seen.size >= 3) teachDone(box); };
  box.append(h('div', { class: 'rowstack' }, stepper('จำนวน', () => v, x => v = x, () => 1, () => 9, paint), ...T4_LAD.slice(1).map(([u], i) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); ui = i + 1; sfx.tap(); paint(); } }, u))), fig, out); paint(); return box; }
function simT4Months() { // years + months on a strip of 12 boxes per year
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(); let y = 1, m = 7, n = 0;
  const paint = () => { const tot = y * 12 + m; let s = ''; for (let i = 0; i < Math.ceil(tot / 12) * 12; i++) { const r = Math.floor(i / 12), c = i % 12; s += `<rect x="${8 + c * 42}" y="${8 + r * 40}" width="38" height="32" rx="6" fill="${i < tot ? (r % 2 ? '#FFD27A' : '#9AD6F5') : '#fff'}" stroke="#8C84A8"/>${c === 0 ? '' : ''}`; }
    fig.innerHTML = `<svg viewBox="0 0 520 ${Math.ceil(tot / 12) * 40 + 12}" class="t4-strip" aria-hidden="true">${s}</svg>`; out.innerHTML = `${y} ปี ${m} เดือน = ${y} × 12 + ${m} = <b>${tot} เดือน</b><br>1 แถว = 12 เดือน = 1 ปี`; if (++n > 3) teachDone(box); };
  box.append(h('div', { class: 'rowstack' }, stepper('ปี', () => y, x => y = x, () => 0, () => 4, paint), stepper('เดือน', () => m, x => m = x, () => 0, () => 11, paint)), fig, out); paint(); n = 0; return box; }
function simT4Cmp() { // two durations in different units → change to the same unit → compare
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(); let a = 200, h1 = 3, m1 = 25, n = 0;
  const paint = () => { const b = h1 * 60 + m1, mx = Math.max(a, b) * 1.1, s = a > b ? '>' : a < b ? '<' : '=';
    fig.innerHTML = `<div class="t4-bars"><div><b>${a} นาที</b><i style="width:${a / mx * 100}%"></i></div><div><b>${h1} ชั่วโมง ${m1} นาที</b><i class="o" style="width:${b / mx * 100}%"></i></div></div>`;
    out.innerHTML = `${h1} ชั่วโมง ${m1} นาที = ${h1} × 60 + ${m1} = <b>${b} นาที</b><br>${a} นาที <b class="f3-sym">${s}</b> ${b} นาที → ${a > b ? 'มากกว่า' : a < b ? 'น้อยกว่า' : 'เท่ากับ'}`; if (++n > 3) teachDone(box); };
  box.append(h('div', { class: 'rowstack' }, stepper('นาที', () => a, x => a = x, () => 30, () => 400, paint), stepper('ชั่วโมง', () => h1, x => h1 = x, () => 0, () => 6, paint), stepper('นาที', () => m1, x => m1 = x, () => 0, () => 55, paint)), fig, out);
  [...box.querySelectorAll('.fstep')][0].querySelectorAll('button').forEach((b, i) => b.onclick = e => { e.stopPropagation(); a = Math.max(30, Math.min(400, a + (i ? 10 : -10))); box.querySelector('.fstep b').textContent = a; sfx.tap(); paint(); });
  paint(); n = 0; return box; }
function simT4Tab(T, ask) { // tap a row → its start, end and duration on the time line
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), line = h('div'), out = fNote(), seen = new Set(); let hl = -1;
  const paint = () => { fig.innerHTML = t4TabHTML(T.title, T.head, T.rows.map(r => r.cells), { hl, num: T.num });
    [...fig.querySelectorAll('tr:not(.hd)')].forEach((tr, i) => { tr.classList.add('ia'); tr.style.cursor = 'pointer'; tr.onclick = e => { e.stopPropagation(); hl = i; sfx.pop(i); seen.add(i); paint(); if (seen.size >= 2) teachDone(box); }; });
    if (hl < 0) { out.innerHTML = 'แตะแถวในตาราง'; line.innerHTML = ''; return; } const r = T.rows[hl]; line.innerHTML = t3LineSVG(r.a, r.b);
    out.innerHTML = `${r.what}: ${t4dot(r.a)} → ${t4dot(r.b)}<br>ใช้เวลา <b>${t4hm((r.b - r.a + 1440) % 1440)}</b>`; };
  box.append(fig, line, out); paint(); return box; }

/* ---------- question types ---------- */
Object.assign(Q, {
  t4Conv({ from, to }) { const units = [...t4parts(from).map(x => x[1]), ...(Array.isArray(to) ? to : [to])], F = t4fam(units), v = t4val(from, F), pair = Array.isArray(to), q = `${from} คิดเป็น${pair ? `กี่${to[0]} กี่${to[1]}` : `กี่${to}`}`;
    const hint = T4_HINT[T4F.indexOf(F)];
    return { prompt: q, say: q, __sig: `t4c ${from}>${to}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: p4big(`<b class="num">${from}</b> = ?`) }),
      pair ? duoInput(ctx, t4split(v, to, F), to, { pre: '', hint }) : h('div', { class: 'rowstack' }, answerBox(ctx, String(v / F[to]), { hint }), h('span', { class: 'cap', style: { fontSize: '22px' } }, to)))); } }; },
  t4Span({ text, d1, h1, d2, h2, mon }) { const D = (d2 - d1) * 24 + (h2 - h1), q = 'ใช้เวลากี่วัน กี่ชั่วโมง';
    return { prompt: q, say: text.replace(/<[^>]+>/g, ''), __sig: `t4s ${d1}.${h1}-${d2}.${h2}`, mount(bd, ctx) {
      const fig = `<div class="tk-rows"><div>เริ่ม <b>${d1} ${mon} เวลา ${pad2(h1)}.00 น.</b></div><div>สิ้นสุด <b>${d2} ${mon} เวลา ${pad2(h2)}.00 น.</b></div></div>`;
      bd.append(h('div', { class: 't6-q p4-q p2q p2st f3-st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text }), h('div', { html: fig })),
        duoInput(ctx, [Math.floor(D / 24), D % 24], ['วัน', 'ชั่วโมง'], { pre: '', hint: `นับวันเต็มจากวันที่ ${d1} ถึงวันที่ ${d2} เวลาเดียวกัน แล้วนับชั่วโมงที่เหลือ` }))); } }; },
  t4YM({ text, a, b }) { const M = (b[2] - a[2]) * 12 + (b[1] - a[1]), q = 'นานกี่ปี กี่เดือน';
    return { prompt: q, say: text.replace(/<[^>]+>/g, ''), __sig: `t4y ${a}-${b}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st f3-st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text })),
        duoInput(ctx, [Math.floor(M / 12), M % 12], ['ปี', 'เดือน'], { pre: '', hint: `จาก ${TK_MON[a[1]]} ${a[2]} ถึง ${TK_MON[b[1]]} ${b[2]}: นับปีเต็มก่อน แล้วนับเดือนที่เหลือ` }))); } }; },
  t4Cmp({ A, B }) { const F = t4fam([...t4parts(A), ...t4parts(B)].map(x => x[1])), va = t4val(A, F), vb = t4val(B, F), right = va > vb ? 'มากกว่า' : va < vb ? 'น้อยกว่า' : 'เท่ากับ', q = 'เติมคำว่า มากกว่า น้อยกว่า หรือ เท่ากับ';
    return { prompt: q, say: `${A} กับ ${B}`, __sig: `t4m ${A}|${B}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: `<div class="t4-cmp"><b>${A}</b><span class="blank">?</span><b>${B}</b></div>` }),
        choices(ctx, ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'].map(v => ({ value: v, label: v })), right, { hint: 'เปลี่ยนเป็นหน่วยเดียวกันก่อน แล้วจึงเปรียบเทียบ' }))); } }; },
  t4Diff({ text, A, B, units }) { const F = t4fam([...t4parts(A), ...t4parts(B), ...units.map(u => [0, u])].map(x => x[1])), d = Math.abs(t4val(A, F) - t4val(B, F)), pair = units.length > 1;
    return { prompt: 'อ่านโจทย์ แล้วหาคำตอบ', say: text.replace(/<[^>]+>/g, ''), __sig: `t4d ${A}|${B}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st f3-st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text })),
        pair ? duoInput(ctx, t4split(d, units, F), units, { pre: 'นานกว่า', hint: 'เปลี่ยนเป็นหน่วยเดียวกัน แล้วลบกัน' }) : h('div', { class: 'rowstack' }, answerBox(ctx, String(d / F[units[0]]), { hint: 'เปลี่ยนเป็นหน่วยเดียวกัน แล้วลบกัน' }), h('span', { class: 'cap', style: { fontSize: '22px' } }, units[0])))); } }; },
  t4Tab({ T, q, opts, right, hint }) { return { ...Q.p4Pick({ fig: `<div class="t4tabw">${t4TabHTML(T.title, T.head, T.rows.map(r => r.cells), { num: T.num })}</div>`, q, opts, right, hint }), __sig: `t4t ${T.title.slice(0, 12)} ${q}` }; },
  t4TabDur({ T, i }) { const r = T.rows[i], d = (r.b - r.a + 1440) % 1440, q = `${r.what} ใช้เวลานานเท่าใด`;
    return { prompt: q, say: q, __sig: `t4u ${T.title.slice(0, 12)} ${i}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: `<div class="t4tabw">${t4TabHTML(T.title, T.head, T.rows.map(x => x.cells), { num: T.num })}</div>` }),
        d % 60 === 0 ? h('div', { class: 'rowstack' }, answerBox(ctx, String(d / 60), { hint: `${t4dot(r.a)} ถึง ${t4dot(r.b)}` }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'ชั่วโมง')) : duoInput(ctx, [Math.floor(d / 60), d % 60], ['ชั่วโมง', 'นาที'], { pre: '', hint: `นับจาก ${t4dot(r.a)} ทีละ 1 ชั่วโมง แล้วนับนาทีที่เหลือ${r.b < r.a ? ' (ข้ามเที่ยงคืน)' : ''}` }))); } }; },
  t4Story({ text, how, opts, ans, units, pre }) {
    return { prompt: 'อ่านโจทย์ แล้วหาคำตอบ', say: text.replace(/<[^>]+>/g, ''), __sig: 't4s ' + text.slice(0, 40), mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st f3-st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text })),
        tkTwoStep(ctx, '① เลือกวิธีคิด', shuffle([how, ...opts]), how, 'อ่านว่าโจทย์ถามอะไร: เวลาสิ้นสุด → บวก · ต่างกัน/เหลือ → ลบ · ทุกวัน หลายครั้ง → คูณ · แบ่งเท่า ๆ กัน → หาร',
          () => units.length > 1 ? duoInput(ctx, ans, units, { pre: pre || '', hint: how }) : h('div', { class: 'rowstack' }, answerBox(ctx, String(ans[0]), { hint: how }), h('span', { class: 'cap', style: { fontSize: '22px' } }, units[0])), `<b>${how}</b> ✓ · ② หาคำตอบ`))); } }; }
});
const t4SortQ = items => ({ ...Q.ixSort({ q: 'เรียงระยะเวลาจาก<b>น้อยไปมาก</b>', items: items.map(s => ({ label: s, v: t4val(s, t4fam(t4parts(s).map(x => x[1]))) })), dir: 'asc', hint: 'เปลี่ยนเป็นหน่วยเดียวกันทั้งหมดก่อน' }), __sig: 't4o ' + items.join() });
const t4MatchQ = P => ({ ...Q.ixMatch({ q: 'จับคู่ระยะเวลาที่เท่ากัน', pairs: P, wide: true, hint: '1 นาที = 60 วินาที · 1 ชั่วโมง = 60 นาที · 1 วัน = 24 ชั่วโมง' }), __sig: 't4x ' + P.map(x => x[0]).join() });

/* ---------- random data (new numbers every game) ---------- */
const t4n = (a, b) => rnd(a, b);
const t4SecQ = () => { const k = rnd(0, 3); if (k === 0) { const m = t4n(2, 15); return { from: `${m} นาที`, to: 'วินาที' }; } if (k === 1) { const m = t4n(2, 20); return { from: `${fmt(m * 60)} วินาที`, to: 'นาที' }; }
  if (k === 2) { const m = t4n(1, 9), s = t4n(5, 55); return { from: `${m} นาที ${s} วินาที`, to: 'วินาที' }; } const v = t4n(65, 900); return v % 60 ? { from: `${fmt(v)} วินาที`, to: ['นาที', 'วินาที'] } : { from: `${fmt(v + 7)} วินาที`, to: ['นาที', 'วินาที'] }; };
const t4HDQ = () => { const k = rnd(0, 4); if (k === 0) { const v = t4n(130, 700); return { from: `${fmt(v)} นาที`, to: ['ชั่วโมง', 'นาที'] }; } if (k === 1) { const h = t4n(2, 9), m = t4n(5, 55); return { from: `${h} ชั่วโมง ${m} นาที`, to: 'นาที' }; }
  if (k === 2) { const d = t4n(2, 6), hh = t4n(1, 23); return { from: `${d} วัน ${hh} ชั่วโมง`, to: 'ชั่วโมง' }; } if (k === 3) { const v = t4n(26, 200); return { from: `${fmt(v)} ชั่วโมง`, to: ['วัน', 'ชั่วโมง'] }; } const d = t4n(2, 5); return { from: `${fmt(d * 1440)} นาที`, to: 'วัน' }; };
const t4YQ = () => { const k = rnd(0, 5); if (k === 0) { const v = t4n(14, 70); return { from: `${v} เดือน`, to: ['ปี', 'เดือน'] }; } if (k === 1) { const y = t4n(1, 6), m = t4n(1, 11); return { from: `${y} ปี ${m} เดือน`, to: 'เดือน' }; }
  if (k === 2) { const v = t4n(9, 60); return { from: `${v} วัน`, to: ['สัปดาห์', 'วัน'] }; } if (k === 3) { const w = t4n(2, 12), d = t4n(1, 6); return { from: `${w} สัปดาห์ ${d} วัน`, to: 'วัน' }; }
  if (k === 4) { const v = t4n(55, 150); return { from: `${v} สัปดาห์`, to: ['ปี', 'สัปดาห์'] }; } const y = t4n(2, 4); return { from: `${y} ปี`, to: 'วัน' }; };
const T4_CMP = () => { const k = rnd(0, 4), z = Math.random() < .15;
  if (k === 0) { const h = t4n(2, 6), m = t4n(5, 55), v = h * 60 + m + (z ? 0 : pick([-1, 1]) * t4n(5, 40)); return { A: `${v} นาที`, B: `${h} ชั่วโมง ${m} นาที` }; }
  if (k === 1) { const m = t4n(2, 9), s = t4n(5, 55), v = m * 60 + s + (z ? 0 : pick([-1, 1]) * t4n(10, 50)); return { A: `${m} นาที ${s} วินาที`, B: `${fmt(v)} วินาที` }; }
  if (k === 2) { const d = t4n(1, 4), hh = t4n(1, 20), v = d * 24 + hh + (z ? 0 : pick([-1, 1]) * t4n(1, 8)); return { A: `${v} ชั่วโมง`, B: `${d} วัน ${hh} ชั่วโมง` }; }
  if (k === 3) { const w = t4n(3, 9), d = t4n(1, 6), v = w * 7 + d + (z ? 0 : pick([-1, 1]) * t4n(1, 5)); return { A: `${w} สัปดาห์ ${d} วัน`, B: `${v} วัน` }; }
  const y = t4n(1, 4), m = t4n(1, 11), v = y * 12 + m + (z ? 0 : pick([-1, 1]) * t4n(1, 6)); return { A: `${v} เดือน`, B: `${y} ปี ${m} เดือน` }; };
const T4_NAMES = ['ต้นข้าว', 'ใบเตย', 'ภูมิ', 'มะปราง', 'นที', 'แพรวา', 'ธาม', 'ขวัญ', 'โอบ', 'ปุยฝ้าย'];
const T4_ACT = ['อ่านหนังสือ', 'ซ้อมดนตรี', 'วาดภาพ', 'ปั่นจักรยาน', 'ทำการบ้าน', 'เล่นเกม', 'ว่ายน้ำ', 'ปลูกผัก'];
const t4DiffQ = () => { const [p, q] = pkF(T4_NAMES, 2), a = pick(T4_ACT), h = t4n(2, 5), m = t4n(5, 55), v = h * 60 + m + pick([-1, 1]) * t4n(12, 50);
  return { text: `${p}${a} ${v} นาที ${q}${a} ${h} ชั่วโมง ${m} นาที ใครใช้เวลานานกว่า และนานกว่ากี่นาที`, A: `${v} นาที`, B: `${h} ชั่วโมง ${m} นาที`, units: ['นาที'] }; };
/* schedules (new data in the practice' style) */
const t4R = (what, h1, m1, h2, m2, cells) => ({ what, a: T3(h1, m1), b: T3(h2, m2), cells });
const T4_SCHOOL = { title: 'ตารางเรียน ชั้น ป.4/2 วันพุธ', head: ['คาบ', 'เวลา', 'วิชา'], num: [], noun: 'วิชา', rows: [
  t4R('คาบ 1 ภาษาไทย', 8, 30, 9, 20, ['1', '08.30 – 09.20 น.', 'ภาษาไทย']), t4R('คาบ 2 คณิตศาสตร์', 9, 20, 10, 10, ['2', '09.20 – 10.10 น.', 'คณิตศาสตร์']), t4R('คาบ 3 วิทยาศาสตร์', 10, 20, 11, 10, ['3', '10.20 – 11.10 น.', 'วิทยาศาสตร์']),
  t4R('พักกลางวัน', 11, 10, 12, 10, ['–', '11.10 – 12.10 น.', 'พักกลางวัน']), t4R('คาบ 4 ภาษาอังกฤษ', 12, 10, 13, 0, ['4', '12.10 – 13.00 น.', 'ภาษาอังกฤษ']), t4R('คาบ 5 ศิลปะ', 13, 0, 14, 40, ['5', '13.00 – 14.40 น.', 'ศิลปะ (2 คาบ)']), t4R('คาบ 6 พลศึกษา', 14, 40, 15, 30, ['6', '14.40 – 15.30 น.', 'พลศึกษา'])] };
const T4_MATCH = { title: 'กำหนดการแข่งขันฟุตซอลนักเรียน', head: ['วันที่', 'เวลา', 'คู่แข่งขัน'], num: [], date: 1, noun: 'การแข่งขันของคู่', rows: [
  t4R('คู่ทีมช้าง – ทีมเสือ', 9, 0, 9, 50, ['3 ก.ค.', '09.00 น.', 'ทีมช้าง – ทีมเสือ']), t4R('คู่ทีมนก – ทีมปลา', 10, 15, 11, 5, ['3 ก.ค.', '10.15 น.', 'ทีมนก – ทีมปลา']), t4R('คู่ทีมม้า – ทีมกวาง', 13, 30, 14, 20, ['3 ก.ค.', '13.30 น.', 'ทีมม้า – ทีมกวาง']),
  t4R('คู่ทีมเสือ – ทีมนก', 9, 0, 9, 50, ['4 ก.ค.', '09.00 น.', 'ทีมเสือ – ทีมนก']), t4R('คู่ทีมปลา – ทีมม้า', 10, 15, 11, 5, ['4 ก.ค.', '10.15 น.', 'ทีมปลา – ทีมม้า']), t4R('คู่ทีมกวาง – ทีมช้าง', 13, 30, 14, 20, ['4 ก.ค.', '13.30 น.', 'ทีมกวาง – ทีมช้าง'])] };
const T4_BUS = { title: 'ตารางเดินรถทัวร์สายเหนือ', head: ['เที่ยว', 'เส้นทาง', 'ออก', 'ถึง'], num: [2, 3], verb: 'ออก', rows: [
  t4R('เที่ยว 11 กรุงเทพฯ – เชียงใหม่', 7, 30, 17, 15, ['11', 'กรุงเทพฯ – เชียงใหม่', '07.30', '17.15']), t4R('เที่ยว 12 กรุงเทพฯ – ลำปาง', 9, 10, 17, 40, ['12', 'กรุงเทพฯ – ลำปาง', '09.10', '17.40']), t4R('เที่ยว 13 กรุงเทพฯ – น่าน', 19, 45, 6, 30, ['13', 'กรุงเทพฯ – น่าน', '19.45', '06.30']),
  t4R('เที่ยว 14 กรุงเทพฯ – พิษณุโลก', 13, 20, 19, 5, ['14', 'กรุงเทพฯ – พิษณุโลก', '13.20', '19.05']), t4R('เที่ยว 15 กรุงเทพฯ – เชียงราย', 20, 30, 8, 0, ['15', 'กรุงเทพฯ – เชียงราย', '20.30', '08.00']), t4R('เที่ยว 16 กรุงเทพฯ – แพร่', 22, 0, 6, 45, ['16', 'กรุงเทพฯ – แพร่', '22.00', '06.45'])] };
const T4_TV = { title: 'ผังรายการโทรทัศน์ช่องเด็ก วันเสาร์', head: ['เวลา', 'รายการ'], num: [], rows: [
  t4R('การ์ตูนยามเช้า', 7, 0, 8, 15, ['07.00 – 08.15 น.', 'การ์ตูนยามเช้า']), t4R('วิทย์สนุก', 8, 15, 9, 0, ['08.15 – 09.00 น.', 'วิทย์สนุก']), t4R('ครัวจิ๋ว', 9, 0, 10, 30, ['09.00 – 10.30 น.', 'ครัวจิ๋ว']),
  t4R('ข่าวเด็ก', 10, 30, 11, 5, ['10.30 – 11.05 น.', 'ข่าวเด็ก']), t4R('ท่องโลกกว้าง', 11, 5, 12, 40, ['11.05 – 12.40 น.', 'ท่องโลกกว้าง']), t4R('เกมตอบปัญหา', 13, 0, 14, 20, ['13.00 – 14.20 น.', 'เกมตอบปัญหา'])] };
const T4_TRAIN = { title: 'ตารางรถไฟ สถานีหัวลำโพง', head: ['ขบวน', 'ปลายทาง', 'ออก', 'ถึง'], num: [2, 3], verb: 'ออก', rows: [
  t4R('ขบวน 7 ไปเชียงใหม่', 8, 30, 20, 30, ['7', 'เชียงใหม่', '08.30', '20.30']), t4R('ขบวน 21 ไปอุบลราชธานี', 5, 45, 14, 25, ['21', 'อุบลราชธานี', '05.45', '14.25']), t4R('ขบวน 31 ไปหาดใหญ่', 15, 10, 6, 35, ['31', 'หาดใหญ่', '15.10', '06.35']),
  t4R('ขบวน 43 ไปสุราษฎร์ธานี', 7, 50, 16, 20, ['43', 'สุราษฎร์ธานี', '07.50', '16.20']), t4R('ขบวน 71 ไปหนองคาย', 18, 30, 6, 5, ['71', 'หนองคาย', '18.30', '06.05'])] };
const t4TabQs = T => { const r = pick(T.rows), k = rnd(0, 2), uniq = A => A.filter((x, i) => A.indexOf(x) === i), w3 = (L, x) => uniq([x, ...shuffle(L.filter(y => y !== x))]).slice(0, 3);
  const at = x => (T.date ? `${x.cells[0]} ` : '') + t4dot(x.a);
  if (k === 0) return Q.t4Tab({ T, q: `${r.what} ${T.verb || 'เริ่ม'}เวลาใด`, opts: w3(T.rows.map(at), at(r)), right: at(r), hint: `หาแถวของรายการนี้ แล้วดูช่อง${T.verb === 'ออก' ? 'เวลาออก' : 'เวลา'}` });
  if (k === 1) return Q.t4Tab({ T, q: T.verb === 'ออก' ? `ข้อใด${T.verb}เวลา ${at(r)}` : `${T.date ? 'วันที่ ' : 'เวลา '}${at(r)} เป็น${T.noun || 'รายการ'}ใด`, opts: w3(T.rows.filter(x => at(x) !== at(r) || x === r).map(x => x.what), r.what), right: r.what, hint: 'หาเวลาในตาราง แล้วอ่านแถวเดียวกัน' });
  return Q.t4TabDur({ T, i: T.rows.indexOf(r) }); };
/* word problems (P4: + − × ÷ with time) */
const T4S = (text, how, opts, ans, units, pre) => ({ text, how, opts, ans, units, pre });
const t4StoryGen = () => { const k = rnd(0, 6), p = pick(T4_NAMES);
  if (k === 0) { const h = t4n(6, 15), m = pick([5, 10, 15, 20, 25, 35, 40, 45, 50]), dh = t4n(1, 3), dm = pick([10, 20, 25, 35, 40, 50]), e = T3(h, m) + dh * 60 + dm, [H, M] = t3clock(e);
    return T4S(`${p}เริ่มทำงานบ้านเวลา ${t3dot(h, m)} ใช้เวลา ${dh} ชั่วโมง ${dm} นาที ${p}ทำงานบ้านเสร็จเวลาใด`, 'เวลาเริ่ม + เวลาที่ใช้', ['เวลาเริ่ม − เวลาที่ใช้', 'เวลาเริ่ม × เวลาที่ใช้'], [H, M], ['นาฬิกา', 'นาที'], 'เสร็จเวลา'); }
  if (k === 1) { const d = t4n(5, 9), r = t4n(10, 25) * 1000, late = t4n(1, 4);
    return T4S(`ผู้รับเหมาตกลงซ่อมถนนให้เสร็จใน ${d} วัน ถ้าเสร็จช้ากว่ากำหนดต้องจ่ายค่าปรับวันละ ${fmt(r)} บาท ผู้รับเหมาใช้เวลาจริง ${d + late} วัน ต้องจ่ายค่าปรับกี่บาท`, '(วันที่ใช้จริง − วันที่กำหนด) × ค่าปรับต่อวัน', ['วันที่ใช้จริง × ค่าปรับต่อวัน', 'วันที่กำหนด + ค่าปรับต่อวัน'], [late * r], ['บาท']); }
  if (k === 2) { const h = t4n(5, 9), m = pick([10, 15, 20, 30, 40, 45]), dd = pick([5, 6, 7]);
    return T4S(`${p}ซ้อมกีฬาวันละ ${h} ชั่วโมง ${m} นาที เป็นเวลา ${dd} วัน ${p}ซ้อมกีฬาทั้งหมดกี่นาที`, `(${h} × 60 + ${m}) × ${dd}`, [`${h} + ${m} + ${dd}`, `(${h} × 60 + ${m}) ÷ ${dd}`], [(h * 60 + m) * dd], ['นาที']); }
  if (k === 3) { const n = pick([6, 8, 9, 10, 12]), each = pick([10, 12, 15, 20]), tot = n * each;
    return T4S(`ข้อสอบมี ${n} ข้อ ให้เวลาทำทั้งหมด ${t4hm(tot)} ถ้าแบ่งเวลาเท่า ๆ กัน จะใช้เวลาทำข้อละกี่นาที`, `${tot} นาที ÷ ${n}`, [`${tot} นาที × ${n}`, `${tot} นาที − ${n}`], [each], ['นาที']); }
  if (k === 4) { const m1 = t4n(20, 45), s1 = t4n(10, 55), dm = t4n(3, 9), ds = t4n(5, 50), a = m1 * 60 + s1, b = a - dm * 60 - ds;
    return T4S(`${p}วิ่งรอบสนามใช้เวลา ${m1} นาที ${s1} วินาที เพื่อนใช้เวลาน้อยกว่า ${p} ${dm} นาที ${ds} วินาที เพื่อนใช้เวลาเท่าใด`, 'เวลาของ' + p + ' − เวลาที่น้อยกว่า', ['เวลาของ' + p + ' + เวลาที่น้อยกว่า', 'เวลาของ' + p + ' × 2'], [Math.floor(b / 60), b % 60], ['นาที', 'วินาที']); }
  if (k === 5) { const mo = t4n(2, 5), d = t4n(5, 25), mo2 = t4n(1, 2), d2 = t4n(10, 28), tot = (mo + mo2) * 30 + d + d2;
    return T4S(`โรงงานใช้เวลาผลิตสินค้าล็อตแรก ${mo} เดือน ${d} วัน ล็อตที่สองใช้เวลา ${mo2} เดือน ${d2} วัน รวมใช้เวลาทั้งหมดกี่เดือน กี่วัน (1 เดือน = 30 วัน)`, 'เวลาล็อตแรก + เวลาล็อตที่สอง', ['เวลาล็อตแรก − เวลาล็อตที่สอง', 'เวลาล็อตแรก × 2'], [Math.floor(tot / 30), tot % 30], ['เดือน', 'วัน']); }
  const km = pick([120, 180, 240, 300, 360]), v = pick([60, 80, 90, 120].filter(x => km % x === 0 || (km * 60 / x) % 1 === 0));
  return T4S(`รถยนต์วิ่งด้วยความเร็ว ${v} กิโลเมตรต่อชั่วโมง ระยะทาง ${km} กิโลเมตร ใช้เวลากี่นาที`, `${km} ÷ ${v} × 60`, [`${km} × ${v}`, `${km} − ${v}`], [km * 60 / v], ['นาที']); };
const t4SeqGen = () => { const h = t4n(7, 10), m = pick([15, 20, 40, 45]), dh = t4n(1, 2), dm = pick([25, 30, 35, 50]), [H, M] = t3clock(T3(h, m) + dh * 60 + dm), p = pick(T4_NAMES);
  return Q.p4Seq({ text: `${p}เริ่มปั่นจักรยานเวลา ${t3dot(h, m)} ปั่นนาน ${dh} ชั่วโมง ${dm} นาที ${p}ปั่นเสร็จเวลาใด`, cards: [`เริ่มปั่นเวลา ${t3dot(h, m)}`, `ปั่นนาน ${dh} ชั่วโมง ${dm} นาที`, `${t3dot(h, m).replace(' น.', '')} + ${dh} ชั่วโมง ${dm} นาที = ${t3dot(H, M)}`, `ตอบ ปั่นเสร็จเวลา ${t3dot(H, M)}`] }); };

/* ---------- lessons ---------- */
const L4T = (no, place, title, short, goal, teach, game) => ({ id: 490 + no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game, learned: true });
const t4N = (k, f) => Array.from({ length: k }, f);
const LESSONS_P4C5 = [
  L4T(1, 'หอนาฬิกาทราย', 'การบอกระยะเวลาเป็นนาที วินาที', 'นาที วินาที', 'บอกระยะเวลาเป็นนาทีและวินาที และเปลี่ยนหน่วยนาที ↔ วินาที (1 นาที = 60 วินาที)',
    [...learnStep('ยินดีต้อนรับสู่ <b>หอนาฬิกาทราย</b>! รู้จัก <b>วินาที</b>', 'ยินดีต้อนรับสู่หอนาฬิกาทราย รู้จักวินาที', [
      { fig: t4WatchSVG(15), name: 'เข็มวินาที', text: 'เข็มสีแดงเดิน 1 ขีด = 1 วินาที' },
      { fig: t4WatchSVG(60, { lab: '1:00' }), name: 'ครบ 1 รอบ', text: '60 วินาที = 1 นาที' },
      { fig: p4big('<b class="num">2 นาที 10 วินาที</b>'), name: 'นาที กับ วินาที', text: '2 × 60 + 10 = 130 วินาที' }], '1 นาที = 60 วินาที'),
     pexStep('ตัวอย่างทีละขั้น: 3 นาที 45 วินาที เป็นกี่วินาที', 'ตัวอย่างทีละขั้น สามนาทีสี่สิบห้าวินาที', [['① นาทีเป็นวินาที', '3 นาที = 3 × 60 = 180 วินาที', t4WatchSVG(180, { lab: '3:00' })], ['② บวกวินาทีที่เหลือ', '180 + 45 = 225 วินาที', t4WatchSVG(225, { lab: '3:45' })]], 'ตอบ <b>225 วินาที</b>'),
     learnStep('เรื่องใหม่: <b>วินาที → นาที วินาที</b>', 'เรื่องใหม่ วินาทีเป็นนาทีกับวินาที', [
       { fig: t4WatchSVG(315, { lab: '5:15' }), name: 'แบ่งทีละ 60', text: '315 วินาที มี 60 ได้ 5 ครั้ง เหลือ 15' }], '315 วินาที = 5 นาที 15 วินาที'),
     pexStep('ตัวอย่างทีละขั้น: 410 วินาที', 'ตัวอย่างทีละขั้น สี่ร้อยสิบวินาที', [['① หาว่ามี 60 กี่ครั้ง', '60 × 6 = 360 (60 × 7 = 420 เกิน)', t4WatchSVG(360, { lab: '6:00' })], ['② ที่เหลือ', '410 − 360 = 50 วินาที', t4WatchSVG(410, { lab: '6:50' })]], 'ตอบ <b>6 นาที 50 วินาที</b>'),
     T('ลองจับเวลาเอง', 'ลองจับเวลาเอง', el => el.append(simT4Watch()))],
    () => [...t4N(5, () => Q.t4Conv(t4SecQ())), t4MatchQ(pkF([2, 3, 4, 5, 6, 7, 8, 9, 10], 3).map(m => [`${m} นาที`, `${m * 60} วินาที`]))]),
  L4T(2, 'บ่อน้ำชั่วโมง', 'การบอกระยะเวลาเป็นนาที ชั่วโมง วัน', 'นาที ชั่วโมง วัน', 'เปลี่ยนหน่วยนาที ชั่วโมง วัน และหาระยะเวลาระหว่างเวลาสองเวลา',
    [...learnStep('<b>นาที ชั่วโมง วัน</b>', 'นาที ชั่วโมง วัน', [
      { fig: t4LadderSVG(['นาที', 'ชั่วโมง']), name: '1 ชั่วโมง = 60 นาที', text: '3 ชั่วโมง = 3 × 60 = 180 นาที' },
      { fig: t4LadderSVG(['ชั่วโมง', 'วัน']), name: '1 วัน = 24 ชั่วโมง', text: '2 วัน 5 ชั่วโมง = 48 + 5 = 53 ชั่วโมง' }], 'หน่วยใหญ่ → หน่วยเล็ก คูณ · หน่วยเล็ก → หน่วยใหญ่ หาร'),
     pexStep('ตัวอย่างทีละขั้น: 462 นาที', 'ตัวอย่างทีละขั้น สี่ร้อยหกสิบสองนาที', [['① มี 60 กี่ครั้ง', '60 × 7 = 420', t4LadderSVG(['นาที', 'ชั่วโมง'])], ['② ที่เหลือ', '462 − 420 = 42 นาที', null]], '462 นาที = <b>7 ชั่วโมง 42 นาที</b>'),
     T('ลองขึ้นลงบันไดหน่วย', 'ลองขึ้นลงบันไดหน่วย', el => el.append(simT4Ladder())),
     learnStep('เรื่องใหม่: <b>ระยะเวลาจากเวลาเริ่มถึงเวลาสิ้นสุด</b>', 'เรื่องใหม่ ระยะเวลาจากเวลาเริ่มถึงเวลาสิ้นสุด', [
       { fig: t3LineSVG(T3(16, 40), T3(19, 5)), name: 'นับทีละชั่วโมง แล้วนับนาที', text: '16.40 → 18.40 = 2 ชั่วโมง · 18.40 → 19.05 = 25 นาที' },
       { fig: t3LineSVG(T3(22, 45), T3(1, 30)), name: 'ข้ามเที่ยงคืน', text: '22.45 → 00.45 → 01.30 = 2 ชั่วโมง 45 นาที' }], 'นับจากเวลาเริ่มทีละ 1 ชั่วโมง แล้วนับนาทีที่เหลือ'),
     pexStep('ตัวอย่างทีละขั้น: วิ่งมาราธอน', 'ตัวอย่างทีละขั้น วิ่งมาราธอน', [['โจทย์', 'เริ่ม 5 เมษายน 10.00 น. ถึง 8 เมษายน 14.00 น.', t3LineSVG(T3(10, 0), T3(14, 0))], ['① นับวันเต็ม', '5 → 8 เมษายน เวลา 10.00 น. = 3 วัน', null], ['② ชั่วโมงที่เหลือ', '10.00 → 14.00 น. = 4 ชั่วโมง', null]], 'ใช้เวลา <b>3 วัน 4 ชั่วโมง</b>')],
    () => [...t4N(3, () => Q.t4Conv(t4HDQ())), ...t4N(2, () => { const h1 = t4n(6, 20), m1 = pick([5, 10, 20, 35, 40, 45, 50]), d = t4n(70, 300), [h2, m2] = t3clock(T3(h1, m1) + d); return Q.t3Dur({ what: pick(['ดูภาพยนตร์', 'เดินทาง', 'ทำกิจกรรม', 'ซ้อมดนตรี']), h1, m1, h2, m2 }); }),
      (() => { const d1 = t4n(1, 20), h1 = t4n(6, 12), d2 = d1 + t4n(1, 4), h2 = h1 + t4n(1, 8), mon = pick(TK_MON); return Q.t4Span({ text: `ค่ายเริ่มวันที่ ${d1} ${mon} เวลา ${pad2(h1)}.00 น. และจบวันที่ ${d2} ${mon} เวลา ${pad2(h2)}.00 น. ค่ายใช้เวลากี่วัน กี่ชั่วโมง`, d1, h1, d2, h2, mon }); })()]),
  L4T(3, 'ปฏิทินผืนทราย', 'การบอกระยะเวลาเป็นนาที ชั่วโมง วัน สัปดาห์ เดือน ปี', 'สัปดาห์ เดือน ปี', 'เปลี่ยนหน่วยวัน สัปดาห์ เดือน ปี และหาระยะเวลาเป็นปีและเดือนจากวันที่',
    [...learnStep('<b>สัปดาห์ เดือน ปี</b>', 'สัปดาห์ เดือน ปี', [
      { fig: p4big('1 สัปดาห์ = 7 วัน'), name: 'สัปดาห์ กับ วัน', text: '5 สัปดาห์ 3 วัน = 35 + 3 = 38 วัน' },
      { fig: p4big('1 ปี = 12 เดือน'), name: 'ปี กับ เดือน', text: '2 ปี 4 เดือน = 24 + 4 = 28 เดือน' },
      { fig: p4big('1 ปี = 52 สัปดาห์ = 365 วัน'), name: 'ปี สัปดาห์ วัน', text: '1 เดือนโดยประมาณ = 30 วัน' }], 'เปลี่ยนเป็นหน่วยเดียวกันโดยใช้ความสัมพันธ์เหล่านี้'),
     pexStep('ตัวอย่างทีละขั้น: 89 สัปดาห์', 'ตัวอย่างทีละขั้น แปดสิบเก้าสัปดาห์', [['① 1 ปี = 52 สัปดาห์', '89 มี 52 ได้ 1 ครั้ง', p4big('89 สัปดาห์')], ['② ที่เหลือ', '89 − 52 = 37 สัปดาห์', null]], '89 สัปดาห์ = <b>1 ปี 37 สัปดาห์</b>'),
     T('ลองปรับปีและเดือน', 'ลองปรับปีและเดือน', el => el.append(simT4Months())),
     learnStep('เรื่องใหม่: <b>นับปีและเดือนจากวันที่</b>', 'เรื่องใหม่ นับปีและเดือนจากวันที่', [
       { fig: p4big('1 ก.ค. 2564 → 1 ก.ค. 2565'), name: 'นับปีเต็มก่อน', text: 'วันที่และเดือนเดียวกัน ปีถัดไป = 1 ปี' },
       { fig: p4big('1 ก.ค. 2565 → 1 ก.พ. 2566'), name: 'แล้วนับเดือนที่เหลือ', text: 'ก.ค. → ก.พ. = 7 เดือน' }], '1 ก.ค. 2564 ถึง 1 ก.พ. 2566 = 1 ปี 7 เดือน'),
     pexStep('ตัวอย่างทีละขั้น: ทำงานนานเท่าไร', 'ตัวอย่างทีละขั้น ทำงานนานเท่าไร', [['โจทย์', 'เริ่มงาน 1 เมษายน 2562 ลาออก 1 ธันวาคม 2564', p4big('1 เม.ย. 2562 → 1 ธ.ค. 2564')], ['① ปีเต็ม', '1 เม.ย. 2562 → 1 เม.ย. 2564 = 2 ปี', null], ['② เดือนที่เหลือ', 'เม.ย. → ธ.ค. = 8 เดือน', null]], 'ทำงาน <b>2 ปี 8 เดือน</b>')],
    () => [...t4N(4, () => Q.t4Conv(t4YQ())), (() => { const y = t4n(2560, 2565), m = t4n(0, 11), dy = t4n(0, 3), dm = t4n(1, 11), M2 = m + dm, a = [1, m, y], b = [1, M2 % 12, y + dy + Math.floor(M2 / 12)], it = pick(['ยาแก้ไอ', 'นมผง', 'อาหารกระป๋อง']);
      return Q.t4YM({ text: `${it}ผลิตวันที่ ${t4mon(1, a[1], a[2])} หมดอายุวันที่ ${t4mon(1, b[1], b[2])} ${it}มีอายุนานกี่ปี กี่เดือน`, a, b }); })()]),
  L4T(4, 'ลานแข่งเวลา', 'การเปรียบเทียบระยะเวลา', 'เปรียบเทียบระยะเวลา', 'เปรียบเทียบระยะเวลาโดยเปลี่ยนเป็นหน่วยเดียวกัน และหาว่านานกว่ากันเท่าใด',
    [...learnStep('<b>เปรียบเทียบระยะเวลา</b>', 'เปรียบเทียบระยะเวลา', [
      { fig: `<div class="t4-cmp"><b>200 นาที</b><span class="blank">?</span><b>3 ชั่วโมง 25 นาที</b></div>`, name: 'หน่วยไม่เหมือนกัน', text: 'เทียบตัวเลขตรง ๆ ไม่ได้' },
      { fig: `<div class="t4-cmp"><b>200 นาที</b><b class="f3-sym">&lt;</b><b>205 นาที</b></div>`, name: 'เปลี่ยนเป็นหน่วยเดียวกัน', text: '3 ชั่วโมง 25 นาที = 205 นาที → 200 นาที น้อยกว่า' }], 'เปลี่ยนเป็นหน่วยเดียวกันก่อนเสมอ'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', '6 สัปดาห์ 3 วัน กับ 44 วัน', `<div class="t4-cmp"><b>6 สัปดาห์ 3 วัน</b><span class="blank">?</span><b>44 วัน</b></div>`], ['① เปลี่ยนหน่วย', '6 × 7 + 3 = 45 วัน', null], ['② เปรียบเทียบ', '45 วัน มากกว่า 44 วัน', `<div class="t4-cmp"><b>45 วัน</b><b class="f3-sym">&gt;</b><b>44 วัน</b></div>`]], '6 สัปดาห์ 3 วัน <b>มากกว่า</b> 44 วัน'),
     T('ลองปรับระยะเวลาสองแบบ', 'ลองปรับระยะเวลาสองแบบ', el => el.append(simT4Cmp())),
     learnStep('เรื่องใหม่: <b>นานกว่ากันเท่าใด</b>', 'เรื่องใหม่ นานกว่ากันเท่าใด', [
       { fig: `<div class="t4-bars"><div><b>345 นาที</b><i style="width:90%"></i></div><div><b>5 ชั่วโมง 20 นาที</b><i class="o" style="width:83%"></i></div></div>`, name: 'เปลี่ยนหน่วยแล้วลบ', text: '5 ชั่วโมง 20 นาที = 320 นาที · 345 − 320 = 25 นาที' }], 'นานกว่า = มาก − น้อย (หน่วยเดียวกัน)')],
    () => [...t4N(4, () => Q.t4Cmp(T4_CMP())), Q.t4Diff(t4DiffQ()), t4SortQ(shuffle([`${t4n(2, 3)} ชั่วโมง ${t4n(1, 9) * 5} นาที`, `${t4n(100, 170)} นาที`, `${t4n(4, 6) * 60 + 10} นาที`, `${t4n(1, 2)} ชั่วโมง ${t4n(1, 5)} นาที`]))]),
  L4T(5, 'กระโจมตารางเรียน', 'การอ่านตารางเรียน/ตารางแข่งขัน', 'ตารางเรียน/แข่งขัน', 'อ่านตารางเรียนและตารางการแข่งขัน บอกเวลาเริ่ม เวลาสิ้นสุด และระยะเวลา',
    [...learnStep('<b>อ่านตารางเรียน</b>', 'อ่านตารางเรียน', [
      { fig: `<div class="t4tabw">${t4TabHTML(T4_SCHOOL.title, T4_SCHOOL.head, T4_SCHOOL.rows.slice(0, 3).map(r => r.cells))}</div>`, name: 'แถว = 1 คาบ', text: 'อ่านจากซ้ายไปขวา: คาบ · เวลา · วิชา' },
      { fig: `<div class="t4tabw">${t4TabHTML(T4_SCHOOL.title, T4_SCHOOL.head, T4_SCHOOL.rows.slice(0, 3).map(r => r.cells), { hl: 1 })}</div>`, name: 'หาระยะเวลา', text: '09.20 – 10.10 น. = 50 นาที' }], 'หาแถวก่อน แล้วอ่านช่องที่ต้องการ'),
     pexStep('ตัวอย่างทีละขั้น: วิชาศิลปะ', 'ตัวอย่างทีละขั้น วิชาศิลปะ', [['① หาแถว', 'ศิลปะ 13.00 – 14.40 น.', `<div class="t4tabw">${t4TabHTML(T4_SCHOOL.title, T4_SCHOOL.head, T4_SCHOOL.rows.map(r => r.cells), { hl: 5 })}</div>`], ['② นับเวลา', '13.00 → 14.00 = 1 ชั่วโมง · 14.00 → 14.40 = 40 นาที', t3LineSVG(T3(13, 0), T3(14, 40))]], 'เรียนศิลปะ <b>1 ชั่วโมง 40 นาที</b>'),
     T('แตะแถวในตารางแข่งขัน', 'แตะแถวในตารางแข่งขัน', el => el.append(simT4Tab(T4_MATCH))),
     learnStep('เรื่องใหม่: <b>ตารางแข่งขัน</b>', 'เรื่องใหม่ ตารางแข่งขัน', [
       { fig: `<div class="t4tabw">${t4TabHTML(T4_MATCH.title, T4_MATCH.head, T4_MATCH.rows.map(r => r.cells), { hl: 4 })}</div>`, name: 'ดูวันที่ก่อน', text: 'ทีมปลา – ทีมม้า แข่งวันที่ 4 ก.ค. เวลา 10.15 น.' }], 'ตารางแข่งขันมีวันที่ เวลา และคู่แข่งขัน')],
    () => [...t4N(3, () => t4TabQs(T4_SCHOOL)), ...t4N(3, () => t4TabQs(T4_MATCH))]),
  L4T(6, 'สถานีคาราวาน', 'การอ่านตารางเวลาในชีวิตประจำวัน', 'ตารางเวลาประจำวัน', 'อ่านตารางเดินรถ ตารางรถไฟ และผังรายการโทรทัศน์ แล้วหาระยะเวลา (รวมการข้ามเที่ยงคืน)',
    [...learnStep('<b>ตารางเดินรถ</b>', 'ตารางเดินรถ', [
      { fig: `<div class="t4tabw">${t4TabHTML(T4_TRAIN.title, T4_TRAIN.head, T4_TRAIN.rows.map(r => r.cells), { num: [2, 3], hl: 0 })}</div>`, name: 'ออก กับ ถึง', text: 'ขบวน 7 ออก 08.30 ถึง 20.30 = 12 ชั่วโมง' },
      { fig: t3LineSVG(T3(15, 10), T3(6, 35)), name: 'เวลาถึงน้อยกว่าเวลาออก', text: 'แปลว่าถึงวันรุ่งขึ้น (ข้ามเที่ยงคืน)' }], 'ระยะเวลา = จากเวลาออกถึงเวลาถึง'),
     pexStep('ตัวอย่างทีละขั้น: ขบวน 31 ไปหาดใหญ่', 'ตัวอย่างทีละขั้น ขบวนสามสิบเอ็ด', [['① อ่านตาราง', 'ออก 15.10 ถึง 06.35 (วันรุ่งขึ้น)', `<div class="t4tabw">${t4TabHTML(T4_TRAIN.title, T4_TRAIN.head, T4_TRAIN.rows.map(r => r.cells), { num: [2, 3], hl: 2 })}</div>`], ['② ถึงเที่ยงคืน', '15.10 → 24.00 = 8 ชั่วโมง 50 นาที', t3LineSVG(T3(15, 10), T3(6, 35))], ['③ หลังเที่ยงคืน', '00.00 → 06.35 = 6 ชั่วโมง 35 นาที · รวม 15 ชั่วโมง 25 นาที', null]], 'ใช้เวลา <b>15 ชั่วโมง 25 นาที</b>'),
     T('แตะแถวในผังรายการโทรทัศน์', 'แตะแถวในผังรายการโทรทัศน์', el => el.append(simT4Tab(T4_TV)))],
    () => [...t4N(3, () => t4TabQs(T4_BUS)), ...t4N(2, () => t4TabQs(T4_TV)), t4TabQs(T4_TRAIN)]),
  L4T(7, 'เนินโจทย์เวลา', 'วิเคราะห์และหาคำตอบโจทย์ปัญหาเกี่ยวกับเวลา', 'วิเคราะห์โจทย์เวลา', 'วิเคราะห์โจทย์ปัญหาเกี่ยวกับเวลา เลือกวิธีคิด (บวก ลบ คูณ หาร) และหาคำตอบ',
    [...learnStep('<b>วิเคราะห์โจทย์เวลา</b>', 'วิเคราะห์โจทย์เวลา', [
      { fig: t3LineSVG(T3(7, 45), T3(9, 5)), name: 'หาเวลาสิ้นสุด → บวก', text: 'เริ่ม 07.45 น. ใช้เวลา 1 ชั่วโมง 20 นาที → 09.05 น.' },
      { fig: p4big('8 ชม. 30 นาที × 7'), name: 'ทุกวัน หลายวัน → คูณ', text: 'วันละ … เป็นเวลา … วัน' },
      { fig: p4big('135 นาที ÷ 9'), name: 'แบ่งเท่า ๆ กัน → หาร', text: 'ข้อละกี่นาที' }], 'อ่านว่าโจทย์ถามอะไร แล้วเลือกวิธีคิด'),
     pexStep('ตัวอย่างทีละขั้น: ค่าปรับ', 'ตัวอย่างทีละขั้น ค่าปรับ', [['โจทย์', 'กำหนดสร้างเสร็จ 7 วัน ใช้จริง 10 วัน ปรับวันละ 15,000 บาท', p4big('10 − 7 = 3 วัน')], ['① ช้ากี่วัน', '10 − 7 = 3 วัน', null], ['② ค่าปรับ', '3 × 15,000 = 45,000 บาท', p4big('3 × 15,000 = 45,000')]], 'ค่าปรับ <b>45,000 บาท</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.t4Story(T4S('ปลาเริ่มซักผ้าเวลา 07.45 น. ใช้เวลา 1 ชั่วโมง 20 นาที ปลาซักผ้าเสร็จเวลาใด', 'เวลาเริ่ม + เวลาที่ใช้', ['เวลาเริ่ม − เวลาที่ใช้', 'เวลาเริ่ม × เวลาที่ใช้'], [9, 5], ['นาฬิกา', 'นาที'], 'เสร็จเวลา')), 'ถูกต้อง!')))],
    () => t4N(5, () => Q.t4Story(t4StoryGen()))),
  L4T(8, 'ผาแสดงวิธีทำ', 'แสดงวิธีทำ การแก้โจทย์ปัญหาเกี่ยวกับเวลา', 'แสดงวิธีทำโจทย์เวลา', 'แสดงวิธีทำโจทย์ปัญหาเกี่ยวกับเวลา: สิ่งที่โจทย์บอก → วิธีคิด → คำนวณ → ตอบพร้อมหน่วย',
    [...learnStep('<b>แสดงวิธีทำ</b> 4 บรรทัด', 'แสดงวิธีทำสี่บรรทัด', [
      { fig: `<div class="storybox">นุชเริ่มทำข้อสอบเวลา 10.30 น. ใช้เวลา 50 นาที นุชทำข้อสอบเสร็จเวลาใด</div>`, name: '① สิ่งที่โจทย์บอก', text: 'เริ่ม 10.30 น. · ใช้เวลา 50 นาที' },
      { fig: t3LineSVG(T3(10, 30), T3(11, 20)), name: '② วิธีคิด และ ③ คำนวณ', text: '10.30 + 50 นาที = 11.20 น.' },
      { fig: p4big('ตอบ 11.20 น.'), name: '④ ตอบพร้อมหน่วย', text: 'อย่าลืม น. นาที วัน …' }], 'บอก → คิด → คำนวณ → ตอบ'),
     pexStep('ตัวอย่างทีละขั้น: อายุของลุง', 'ตัวอย่างทีละขั้น อายุของลุง', [['โจทย์', 'พ่ออายุ 47 ปี 5 เดือน ลุงอายุมากกว่าพ่อ 6 ปี 8 เดือน', p4big('47 ปี 5 เดือน + 6 ปี 8 เดือน')], ['① บวกเดือน', '5 + 8 = 13 เดือน = 1 ปี 1 เดือน', null], ['② บวกปี', '47 + 6 + 1 = 54 ปี', p4big('54 ปี 1 เดือน')]], 'ลุงอายุ <b>54 ปี 1 เดือน</b>'),
     T('ลองเรียงวิธีทำ', 'ลองเรียงวิธีทำ', el => el.append(qSim(Q.p4Seq({ text: 'แม่เริ่มทำขนมเวลา 13.25 น. ใช้เวลา 1 ชั่วโมง 50 นาที แม่ทำขนมเสร็จเวลาใด', cards: ['เริ่มทำขนมเวลา 13.25 น.', 'ใช้เวลา 1 ชั่วโมง 50 นาที', '13.25 + 1 ชั่วโมง 50 นาที = 15.15 น.', 'ตอบ ทำขนมเสร็จเวลา 15.15 น.'] }), 'ถูกต้อง!')))],
    () => [...t4N(2, t4SeqGen), ...t4N(3, () => Q.t4Story(t4StoryGen()))])
];

/* ---------- boss ---------- */
const t4X = (q, opts, lv, fig) => ({ q, fig, opts, a: 0, lv });
const EXAM_P4C5 = d6spread([
  t4X('7 นาที คิดเป็นกี่วินาที', ['420 วินาที', '70 วินาที', '700 วินาที', '367 วินาที'], 491),
  t4X('500 วินาที คิดเป็นกี่นาที กี่วินาที', ['8 นาที 20 วินาที', '5 นาที', '8 นาที 2 วินาที', '50 นาที'], 491),
  t4X('4 นาที 35 วินาที คิดเป็นกี่วินาที', ['275 วินาที', '435 วินาที', '235 วินาที', '275 นาที'], 491),
  t4X('395 นาที คิดเป็นกี่ชั่วโมง กี่นาที', ['6 ชั่วโมง 35 นาที', '3 ชั่วโมง 95 นาที', '6 ชั่วโมง 5 นาที', '5 ชั่วโมง 35 นาที'], 492),
  t4X('3 วัน 9 ชั่วโมง คิดเป็นกี่ชั่วโมง', ['81 ชั่วโมง', '39 ชั่วโมง', '72 ชั่วโมง', '93 ชั่วโมง'], 492),
  t4X('เริ่มเดินทางเวลา 21.40 น. ถึงที่หมายเวลา 02.15 น. ใช้เวลาเดินทางเท่าใด', ['4 ชั่วโมง 35 นาที', '19 ชั่วโมง 25 นาที', '5 ชั่วโมง 35 นาที', '4 ชั่วโมง 25 นาที'], 492),
  t4X('58 เดือน คิดเป็นกี่ปี กี่เดือน', ['4 ปี 10 เดือน', '5 ปี 8 เดือน', '4 ปี 8 เดือน', '5 ปี 10 เดือน'], 493),
  t4X('9 สัปดาห์ 4 วัน คิดเป็นกี่วัน', ['67 วัน', '94 วัน', '63 วัน', '13 วัน'], 493),
  t4X('ขนมผลิตวันที่ 1 มีนาคม 2565 หมดอายุวันที่ 1 ตุลาคม 2566 มีอายุนานเท่าใด', ['1 ปี 7 เดือน', '1 ปี 3 เดือน', '2 ปี 7 เดือน', '7 เดือน'], 493),
  t4X('ข้อใดถูกต้อง', ['250 นาที มากกว่า 4 ชั่วโมง', '250 นาที น้อยกว่า 4 ชั่วโมง', '250 นาที เท่ากับ 4 ชั่วโมง'], 494),
  t4X('ข้อใดใช้เวลานานที่สุด', ['2 วัน 3 ชั่วโมง', '50 ชั่วโมง', '2,900 นาที', '1 วัน 23 ชั่วโมง'], 494),
  t4X('ก้อยอ่านหนังสือ 3 ชั่วโมง 10 นาที บีมอ่าน 175 นาที ใครอ่านนานกว่า และนานกว่ากี่นาที', ['ก้อย นานกว่า 15 นาที', 'บีม นานกว่า 15 นาที', 'ก้อย นานกว่า 25 นาที', 'บีม นานกว่า 5 นาที'], 494),
  t4X('จากตาราง วิชาพลศึกษาเรียนนานเท่าใด', ['50 นาที', '1 ชั่วโมง', '40 นาที', '1 ชั่วโมง 10 นาที'], 495, `<div class="t4tabw">${t4TabHTML(T4_SCHOOL.title, T4_SCHOOL.head, T4_SCHOOL.rows.map(r => r.cells))}</div>`),
  t4X('จากตาราง ทีมกวางแข่งกับทีมช้างวันที่และเวลาใด', ['4 ก.ค. เวลา 13.30 น.', '3 ก.ค. เวลา 13.30 น.', '4 ก.ค. เวลา 09.00 น.', '3 ก.ค. เวลา 09.00 น.'], 495, `<div class="t4tabw">${t4TabHTML(T4_MATCH.title, T4_MATCH.head, T4_MATCH.rows.map(r => r.cells))}</div>`),
  t4X('จากตาราง เที่ยว 15 ไปเชียงรายใช้เวลาเดินทางเท่าใด', ['11 ชั่วโมง 30 นาที', '12 ชั่วโมง 30 นาที', '11 ชั่วโมง', '12 ชั่วโมง 50 นาที'], 496, `<div class="t4tabw">${t4TabHTML(T4_BUS.title, T4_BUS.head, T4_BUS.rows.map(r => r.cells), { num: [2, 3] })}</div>`),
  t4X('จากผังรายการ รายการ “ครัวจิ๋ว” ยาวเท่าใด', ['1 ชั่วโมง 30 นาที', '1 ชั่วโมง', '1 ชั่วโมง 15 นาที', '90 วินาที'], 496, `<div class="t4tabw">${t4TabHTML(T4_TV.title, T4_TV.head, T4_TV.rows.map(r => r.cells))}</div>`),
  t4X('เริ่มทาสีบ้านเวลา 08.50 น. ใช้เวลา 2 ชั่วโมง 45 นาที ทาสีเสร็จเวลาใด', ['11.35 น.', '10.35 น.', '11.95 น.', '06.05 น.'], 497),
  t4X('ซ้อมเปียโนวันละ 45 นาที เป็นเวลา 6 วัน ซ้อมทั้งหมดกี่ชั่วโมง กี่นาที', ['4 ชั่วโมง 30 นาที', '2 ชั่วโมง 70 นาที', '51 นาที', '4 ชั่วโมง 50 นาที'], 497),
  t4X('งานแรกใช้เวลา 2 เดือน 18 วัน งานที่สองใช้เวลา 1 เดือน 20 วัน รวมใช้เวลาเท่าใด (1 เดือน = 30 วัน)', ['4 เดือน 8 วัน', '3 เดือน 38 วัน', '3 เดือน 8 วัน', '4 เดือน 2 วัน'], 498),
  t4X('ข้อใดเรียงขั้นตอนการแสดงวิธีทำได้ถูกต้อง', ['สิ่งที่โจทย์บอก → วิธีคิด → คำนวณ → ตอบพร้อมหน่วย', 'ตอบ → คำนวณ → สิ่งที่โจทย์บอก → วิธีคิด', 'คำนวณ → ตอบ → วิธีคิด → สิ่งที่โจทย์บอก'], 498)]);
LESSONS_P4C5.push({ id: 499, boss: true, place: 'รังแมงป่องนาฬิกา', title: 'ด่านบอส: บทที่ 5 เวลา', short: 'ด่านบอส · ข้อสอบ', tone: 'yellow',
  goal: 'คำถามท้ายบท 20 ข้อ (วินาที นาที ชั่วโมง วัน สัปดาห์ เดือน ปี · เปรียบเทียบระยะเวลา · อ่านตาราง · โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P4C5, pass: 10, bossName: 'แมงป่องนาฬิกาทราย', bossPal: 'sky', emblem: '⏱', bossKind: 'scorp',
  winLine: 'ชนะแมงป่องนาฬิกาทรายแล้ว! เก่งเรื่องเวลามาก', loseLine: 'แมงป่องนาฬิกาทรายยังไม่ยอมแพ้ กลับไปทวนแล้วสู้ใหม่นะ!' });
