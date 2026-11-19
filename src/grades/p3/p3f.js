/* =========================================================
   GRADE 3 · CHAPTER 6 — เศษส่วน  (ป่าดิบชื้น · ภาคเรียนที่ 1 · เมือง 61 · ด่าน 1361–1370 · บอส 1379)
   P3 fractions are NOT reduced (2/4 stays 2/4) → own stacked answer box f3Input (exact numerator/denominator)
   pictures: f3Fig(n, d, kind) pie / bar / grid / polygon / triangle, unequal cuts for "แบ่งเท่า ๆ กันไหม",
   tap-to-shade (f3ShadeEl), compare & add/subtract on bars that move as the numbers change
   ========================================================= */
const f3W = (n, d) => `เศษ${thaiWords(n)}ส่วน${thaiWords(d)}`, f3T = (n, d) => FX(`[${n}/${d}]`), f3S = (n, d) => `${n}/${d}`;
const F3C = ['#5B9BD5', '#2FA36B', '#EC7F1E', '#E5505E', '#8E6CE0', '#E3A21C'];
/* ---------- pictures (100×100 box; parts listed so they can be tapped) ---------- */
function f3Parts(d, kind) { const P = [], c = 50, R = 46;
  if (kind === 'pie') for (let i = 0; i < d; i++) { const a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d, x0 = c + R * Math.cos(a0), y0 = c + R * Math.sin(a0), x1 = c + R * Math.cos(a1), y1 = c + R * Math.sin(a1);
    P.push(d === 1 ? `M${c - R} ${c} A${R} ${R} 0 1 1 ${c + R} ${c} A${R} ${R} 0 1 1 ${c - R} ${c} Z` : `M${c} ${c} L${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`); }
  else if (kind === 'bar') { const w = 96 / d; for (let i = 0; i < d; i++) P.push(`M${2 + i * w} 34 h${w} v32 h${-w} Z`); }
  else if (kind === 'grid') { const [r, k] = { 4: [2, 2], 6: [2, 3], 8: [2, 4], 9: [3, 3], 10: [2, 5], 12: [3, 4], 16: [4, 4] }[d] || [1, d], w = 92 / k, hh = Math.min(92 / r, 70 / r);
    for (let i = 0; i < r; i++) for (let j = 0; j < k; j++) P.push(`M${4 + j * w} ${50 - r * hh / 2 + i * hh} h${w} v${hh} h${-w} Z`); }
  else if (kind === 'poly') for (let i = 0; i < d; i++) { const a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d; P.push(`M${c} ${c} L${(c + R * Math.cos(a0)).toFixed(2)} ${(c + R * Math.sin(a0)).toFixed(2)} L${(c + R * Math.cos(a1)).toFixed(2)} ${(c + R * Math.sin(a1)).toFixed(2)} Z`); }
  else if (kind === 'tri') { const n = d === 9 ? 3 : 2, s = 92 / n, H = s * .866, top = 50 - n * H / 2; // rows of small triangles
    for (let r = 0; r < n; r++) for (let j = 0; j < 2 * r + 1; j++) { const x = 50 - r * s / 2 + Math.floor(j / 2) * s, y = top + r * H; P.push(j % 2 === 0 ? `M${x} ${y} L${x + s / 2} ${y + H} L${x - s / 2} ${y + H} Z` : `M${x - s / 2 + s / 2} ${y} L${x + s} ${y} L${x + s / 2} ${y + H} Z`); } }
  return P; }
const f3Kinds = d => ['pie', 'bar', ...(d in { 4: 1, 6: 1, 8: 1, 9: 1, 10: 1, 12: 1 } ? ['grid'] : []), ...(d >= 5 && d <= 8 ? ['poly'] : []), ...(d === 4 || d === 9 ? ['tri'] : [])];
function f3Fig(n, d, kind, o = {}) { kind = kind || pick(f3Kinds(d)); const col = o.col || pick(F3C), on = o.on || Array.from({ length: d }, (_, i) => i < n);
  const parts = f3Parts(d, kind).map((p, i) => `<path class="f3p${on[i] ? ' on' : ''}" data-i="${i}" d="${p}" fill="${on[i] ? col : '#fff'}" stroke="#2D2A40" stroke-width="1.6" stroke-linejoin="round"/>`).join('');
  return kind === 'bar' ? `<svg viewBox="-2 32 104 36" class="${o.cls || 'f3-bar-svg'}" aria-hidden="true">${parts}</svg>` : `<svg viewBox="-2 -2 104 104" class="${o.cls || 'f3-svg'}" aria-hidden="true">${parts}</svg>`; }
/* unequal cuts (for "แบ่งเท่า ๆ กันหรือไม่") */
const F3_UNEQ = [`<rect x="4" y="30" width="92" height="40" fill="#fff" stroke="#2D2A40" stroke-width="1.6"/><path d="M30 30 V70 M58 30 V70" stroke="#2D2A40" stroke-width="1.6"/>`,
  `<circle cx="50" cy="50" r="46" fill="#fff" stroke="#2D2A40" stroke-width="1.6"/><path d="M20 15 L80 85" stroke="#2D2A40" stroke-width="1.6"/>`,
  `<path d="M50 6 L94 90 H6 Z" fill="#fff" stroke="#2D2A40" stroke-width="1.6" stroke-linejoin="round"/><path d="M50 6 L28 90" stroke="#2D2A40" stroke-width="1.6"/>`,
  `<rect x="10" y="10" width="80" height="80" fill="#fff" stroke="#2D2A40" stroke-width="1.6"/><path d="M10 38 H90 M50 38 V90" stroke="#2D2A40" stroke-width="1.6"/>`,
  `<circle cx="50" cy="50" r="46" fill="#fff" stroke="#2D2A40" stroke-width="1.6"/><path d="M50 4 V96 M50 50 L94 62" stroke="#2D2A40" stroke-width="1.6"/>`,
  `<rect x="4" y="30" width="92" height="40" fill="#fff" stroke="#2D2A40" stroke-width="1.6"/><path d="M20 30 V70 M42 30 V70 M75 30 V70" stroke="#2D2A40" stroke-width="1.6"/>`,
  `<path d="M50 4 L96 50 L50 96 L4 50 Z" fill="#fff" stroke="#2D2A40" stroke-width="1.6"/><path d="M4 50 H96 M50 50 L50 96" stroke="#2D2A40" stroke-width="1.6"/>`,
  `<rect x="10" y="10" width="80" height="80" fill="#fff" stroke="#2D2A40" stroke-width="1.6"/><path d="M10 10 L90 90 M50 10 V50" stroke="#2D2A40" stroke-width="1.6"/>`];
const f3Uneq = i => `<svg viewBox="-2 -2 104 104" class="f3-svg" aria-hidden="true">${F3_UNEQ[i]}</svg>`;
function f3ShadeEl(d, kind, o = {}) { const on = Array(d).fill(false), col = o.col || pick(F3C), el = h('div', { class: 'f3-shade ia' });
  const draw = () => { el.innerHTML = f3Fig(0, d, kind, { on, col }); };
  el.addEventListener('click', e => { const p = e.target.closest('.f3p'); if (!p || el.dataset.done) return; e.stopPropagation(); const i = +p.dataset.i; on[i] = !on[i]; sfx.pop(on.filter(Boolean).length); draw(); o.onChange && o.onChange(on.filter(Boolean).length); });
  draw(); el.count = () => on.filter(Boolean).length; el.fill = n => { on.fill(false); for (let i = 0; i < n; i++) on[i] = true; draw(); }; return el; }
/* stacked answer: numerator over denominator, one keypad */
function f3Input(ctx, n, d, o = {}) { const val = ['', '']; let cur = o.only === 'den' ? 1 : 0, done = false; const lock = o.give; // give: 'den' → denominator shown
  if (lock === 'den') val[1] = String(d); if (lock === 'num') val[0] = String(n);
  const slots = [0, 1].map(i => h('button', { class: 'mc-slot f3-slot' + (lock === (i ? 'den' : 'num') ? ' given' : ''), onclick: e => { e.stopPropagation(); if (!done && lock !== (i ? 'den' : 'num')) { cur = i; paint(); } } }, '?'));
  const msg = h('div', { class: 'pad-msg' });
  const paint = () => slots.forEach((s, i) => { s.textContent = val[i] === '' ? '?' : val[i]; s.classList.toggle('on', i === cur && !done); s.classList.toggle('filled', val[i] !== ''); });
  const type = dg => { if (done) return; sfx.tap(); msg.textContent = ''; val[cur] = (val[cur] + dg).slice(-3).replace(/^0+(\d)/, '$1'); paint(); };
  const ok = () => { if (done) return; if (val[cur] === '') { msg.textContent = cur ? 'กดตัวส่วน (จำนวนส่วนทั้งหมด)' : 'กดตัวเศษ'; return; }
    const other = 1 - cur; if (val[other] === '') { cur = other; paint(); msg.textContent = cur ? 'ต่อไปกดตัวส่วน' : 'ต่อไปกดตัวเศษ'; return; }
    const good = +val[0] === n && +val[1] === d; if (good) { done = true; wrap.classList.add('done'); }
    if (!good) { if (lock !== 'num') val[0] = ''; if (lock !== 'den') val[1] = ''; cur = lock === 'num' ? 1 : 0; paint(); } ctx.check(good, o.hint); };
  const kp = h('div', { class: 'keypad' }); [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(k => kp.append(h('button', { class: 'btn', onclick: () => type(k) }, k)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: () => { sfx.tap(); if (lock !== (cur ? 'den' : 'num')) val[cur] = val[cur].slice(0, -1); paint(); } }, icon('left')), h('button', { class: 'btn', onclick: () => type(0) }, '0'), h('button', { class: 'btn primary', 'aria-label': 'ตกลง', onclick: ok }, icon('check')));
  const wrap = h('div', { class: 'ans mc-ans ia f3-ans' }, h('div', { class: 'f3-stack' }, o.pre ? h('span', { class: 'mc-u', html: o.pre }) : null, h('div', { class: 'f3-col' }, slots[0], h('i', { class: 'f3-bar' }), slots[1]), o.unit ? h('span', { class: 'mc-u' }, o.unit) : null), kp, msg);
  wrap.reveal = () => { val[0] = String(n); val[1] = String(d); done = true; paint(); wrap.classList.add('done', 'revealed'); }; wrap.ansText = [String(n), String(d), `${n}/${d}`];
  paint(); return wrap; }
/* two bars for comparing */
const f3Pair = (A, B, o = {}) => `<div class="f3-pair">${[A, B].map(([n, d], i) => `<div class="f3-pr"><span class="f3-lab">${f3T(n, d)}</span>${f3Fig(n, d, 'bar', { col: F3C[(o.c || 0) + i * 2], cls: 'f3-bar-svg' })}</div>`).join('')}</div>`;

/* ---------- teaching sims ---------- */
function simF3Cut() { // choose how many equal parts, tap to colour → the fraction is written live
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set(); let d = 4, kind = 'pie', sh = null;
  const show = () => { sh = f3ShadeEl(d, kind, { col: '#EC7F1E', onChange: k => { out.innerHTML = k ? `ระบาย <b>${k}</b> ส่วน จาก <b>${d}</b> ส่วนเท่า ๆ กัน = <span class="f3-big">${f3T(k, d)}</span><br>อ่านว่า ${f3W(k, d)}` : 'แตะชิ้นส่วนเพื่อระบายสี'; if (k) seen.add(d + ':' + k); if (seen.size >= 3) teachDone(box); } }); fig.innerHTML = ''; fig.append(sh); out.innerHTML = `แบ่งเป็น <b>${d}</b> ส่วนเท่า ๆ กัน · แตะชิ้นส่วนเพื่อระบายสี`; };
  const st = h('div', { class: 'rowstack' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); d = Math.max(2, d - 1); sfx.tap(); show(); } }, '− ส่วน'), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); d = Math.min(12, d + 1); sfx.tap(); show(); } }, '+ ส่วน'),
    ...[['pie', 'วงกลม'], ['bar', 'แถบ']].map(([k, lab]) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); kind = k; sfx.tap(); show(); } }, lab)));
  show(); box.append(st, fig, out); return box; }
function simF3Cmp(mode) { // 'den' = same denominator (move numerators) · 'num' = same numerator (move denominators)
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set(); let A = mode === 'den' ? [2, 6] : [1, 3], B = mode === 'den' ? [5, 6] : [1, 6];
  const draw = () => { fig.innerHTML = f3Pair(A, B); const va = A[0] / A[1], vb = B[0] / B[1], s = va > vb ? '>' : va < vb ? '<' : '=';
    out.innerHTML = `${f3T(...A)} <b class="f3-sym">${s}</b> ${f3T(...B)}<br>${mode === 'den' ? 'ตัวส่วนเท่ากัน → ตัวเศษมากกว่า มีค่ามากกว่า' : 'ตัวเศษเท่ากัน → ตัวส่วนน้อยกว่า ชิ้นใหญ่กว่า มีค่ามากกว่า'}`; seen.add(s); if (seen.size >= 2) teachDone(box); };
  const ctl = (lab, f) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); f(); sfx.tap(); draw(); } }, lab);
  const k = mode === 'den' ? 0 : 1, lim = mode === 'den' ? x => Math.max(0, Math.min(A[1], x)) : x => Math.max(1, Math.min(10, x));
  const row = h('div', { class: 'rowstack' }, ctl(`บน ${mode === 'den' ? 'ตัวเศษ' : 'ตัวส่วน'} −`, () => { A[k] = lim(A[k] - 1); if (mode === 'num' && A[1] < A[0]) A[1] = A[0]; }), ctl('+', () => { A[k] = lim(A[k] + 1); }), ctl(`ล่าง ${mode === 'den' ? 'ตัวเศษ' : 'ตัวส่วน'} −`, () => { B[k] = lim(B[k] - 1); if (mode === 'num' && B[1] < B[0]) B[1] = B[0]; }), ctl('+', () => { B[k] = lim(B[k] + 1); }));
  draw(); box.append(row, fig, out); return box; }
function simF3Add(op) { // colour the first part, then add (or cross out) the second
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(); let d = 8, a = op === '+' ? 3 : 7, b = op === '+' ? 2 : 3, step = 0, n = 0;
  const draw = () => { const on = Array.from({ length: d }, (_, i) => op === '+' ? i < a + (step ? b : 0) : i < a - (step ? b : 0)), cols = Array.from({ length: d }, (_, i) => op === '+' && i >= a ? '#E3A21C' : '#5B9BD5');
    fig.innerHTML = `<svg viewBox="-2 32 104 36" class="f3-bar-svg big" aria-hidden="true">${f3Parts(d, 'bar').map((p, i) => `<path d="${p}" fill="${on[i] ? cols[i] : '#fff'}" stroke="#2D2A40" stroke-width="1.4"/>${op === '−' && step && i >= a - b && i < a ? `<path d="${p}" fill="none" stroke="#E5505E" stroke-width="2"/><text x="${2 + (i + .5) * 96 / d}" y="56" text-anchor="middle" font-size="12" fill="#E5505E" font-weight="900">✕</text>` : ''}`).join('')}</svg>`;
    out.innerHTML = step ? `${f3T(a, d)} ${op} ${f3T(b, d)} = <b>${f3T(op === '+' ? a + b : a - b, d)}</b><br>ตัวส่วนเท่ากัน → ${op === '+' ? 'บวก' : 'ลบ'}เฉพาะตัวเศษ ตัวส่วนคงเดิม` : `มี ${f3T(a, d)} (สีฟ้า) · กด <b>${op === '+' ? 'เพิ่ม' : 'เอาออก'}</b> ${f3T(b, d)}`; };
  const go = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.pop(4); step = 1; draw(); n++; if (n >= 2) teachDone(box); } }, op === '+' ? 'เพิ่ม' : 'เอาออก');
  const nx = h('button', { class: 'btn sm ia nxp', onclick: e => { e.stopPropagation(); d = pick([5, 6, 7, 8, 9, 10]); a = op === '+' ? rnd(1, d - 2) : rnd(3, d); b = op === '+' ? rnd(1, d - a - 1) : rnd(1, a - 1); step = 0; sfx.tap(); draw(); } }, 'โจทย์ใหม่');
  draw(); box.append(fig, h('div', { class: 'rowstack' }, go, nx), out); return box; }

/* ---------- question types ---------- */
const f3SymOpts = (a, b) => { const va = a[0] / a[1], vb = b[0] / b[1]; return va > vb ? '>' : va < vb ? '<' : '='; };
Object.assign(Q, {
  f3Equal({ i, eq, d }) { const q = 'รูปนี้แบ่งเป็นส่วนเท่า ๆ กันหรือไม่';
    return { prompt: q, say: q, __sig: `f3e ${eq ? 'e' + d : 'u' + i}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: eq ? f3Fig(0, d) : f3Uneq(i) }),
      choices(ctx, [{ value: 1, label: 'แบ่งเท่า ๆ กัน' }, { value: 0, label: 'แบ่งไม่เท่ากัน' }], eq ? 1 : 0, { hint: 'ดูว่าทุกชิ้นมีขนาดและรูปร่างเท่ากันไหม' }))); } }; },
  f3Write({ n, d, kind }) { const q = 'เขียนเศษส่วนแสดงส่วนที่ระบายสี';
    return { prompt: q, say: q, __sig: `f3w ${n}/${d}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: f3Fig(n, d, kind) }), f3Input(ctx, n, d, { hint: 'ตัวเศษ = จำนวนส่วนที่ระบาย · ตัวส่วน = จำนวนส่วนทั้งหมดที่แบ่งเท่า ๆ กัน' }))); } }; },
  f3Shade({ n, d, kind }) { const q = `ระบายสีให้ได้ ${f3T(n, d)} ของรูป`;
    return { prompt: q + ' <small>(แตะชิ้นส่วน)</small>', say: `ระบายสีให้ได้ ${f3W(n, d)} ของรูป`, __sig: `f3s ${n}/${d}`, mount(bd, ctx) { const sh = f3ShadeEl(d, kind || pick(f3Kinds(d)));
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig' }, sh), checkButton('ตรวจคำตอบ', () => { const ok = sh.count() === n; if (ok) sh.dataset.done = 1; ctx.check(ok, `ตัวเศษ ${n} = ระบาย ${n} ส่วน จากทั้งหมด ${d} ส่วน`); }))); } }; },
  f3Read({ n, d, to }) { const right = to === 'word' ? f3W(n, d) : f3S(n, d), wrong = to === 'word' ? [f3W(d, n), f3W(n, d + 1), f3W(n + 1, d)] : [f3S(d, n), f3S(n, d + 1), f3S(n + 1, d)], q = to === 'word' ? 'เศษส่วนนี้อ่านว่าอย่างไร' : `“${f3W(n, d)}” เขียนเป็นเศษส่วนได้อย่างไร`;
    const opts = [right, ...wrong.filter(x => x !== right && !(to !== 'word' && +x.split('/')[0] > +x.split('/')[1]) ).slice(0, 2)];
    return { prompt: q, say: q, __sig: `f3r ${to} ${n}/${d}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: to === 'word' ? `<div class="f3-big">${f3T(n, d)}</div>` : `<div class="f3-word">${f3W(n, d)}</div>` }),
      choices(ctx, shuffle(opts).map(v => ({ value: v, label: to === 'word' ? v : f3T(...v.split('/').map(Number)) })), right, { hint: 'อ่านตัวเศษ (บน) ก่อน แล้วอ่านตัวส่วน (ล่าง): เศษ… ส่วน…' }))); } }; },
  f3Part({ n, d, ask }) { const q = `${f3T(n, d)} มี${ask === 'num' ? 'ตัวเศษ' : 'ตัวส่วน'}เป็นเท่าใด`;
    return { prompt: q, say: `${f3W(n, d)} มี${ask === 'num' ? 'ตัวเศษ' : 'ตัวส่วน'}เป็นเท่าใด`, __sig: `f3p ${ask} ${n}/${d}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: f3Fig(n, d) }), answerBox(ctx, String(ask === 'num' ? n : d), { hint: 'ตัวเศษอยู่ข้างบน (ส่วนที่ระบาย) · ตัวส่วนอยู่ข้างล่าง (ส่วนทั้งหมด)' }))); } }; },
  f3Cmp({ a, b, pic }) { const right = f3SymOpts(a, b), q = `เติมเครื่องหมาย > < หรือ =`;
    return { prompt: q, say: `เปรียบเทียบ ${f3W(...a)} กับ ${f3W(...b)}`, __sig: `f3c ${a}|${b}|${pic}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: (pic ? f3Pair(a, b) : '') + `<div class="f3-eq">${f3T(...a)} <span class="blank">?</span> ${f3T(...b)}</div>` }),
      choices(ctx, ['>', '<', '='].map(v => ({ value: v, label: v })), right, { hint: a[1] === b[1] ? 'ตัวส่วนเท่ากัน: ดูตัวเศษ ตัวเศษมากกว่ามีค่ามากกว่า' : 'ตัวเศษเท่ากัน: ตัวส่วนน้อยกว่า (แบ่งน้อยชิ้น ชิ้นใหญ่) มีค่ามากกว่า' }))); } }; },
  f3Calc({ a, b, op, d, w }) { const r = op === '+' ? a + b : (w ? d : a) - b, q = 'หาผลลัพธ์', ex = `${w ? '1' : f3T(a, d)} ${op} ${f3T(b, d)}`;
    return { prompt: q, say: `${w ? 'หนึ่ง' : f3W(a, d)} ${op === '+' ? 'บวก' : 'ลบ'} ${f3W(b, d)}`, __sig: `f3x ${w ? 1 : a}${op}${b}/${d}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: `<div class="f3-eq">${ex} = ?</div>` }),
      f3Input(ctx, r, d, { hint: w ? `1 = ${f3S(d, d)} แล้วลบตัวเศษ` : `ตัวส่วนเท่ากัน → ${op === '+' ? 'บวก' : 'ลบ'}ตัวเศษ ตัวส่วนคงเดิม` }))); } }; },
  f3Story({ text, sent, wrong, n, d, unit }) {
    return { prompt: 'อ่านโจทย์ แล้วหาคำตอบ', say: FXsay(text), __sig: 'f3t ' + text.slice(0, 40), mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st f3-st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: FX(text) })),
        tkTwoStep(ctx, '① เลือกประโยคสัญลักษณ์', [sent, ...wrong].map(FX), FX(sent), 'คำว่า รวม/ทั้งหมด/เพิ่ม → บวก · เหลือ/มากกว่า/น้อยกว่า → ลบ', () => f3Input(ctx, n, d, { unit, hint: 'ตัวส่วนเท่ากัน คิดเฉพาะตัวเศษ' }), `<b>${FX(sent)}</b> ✓ · ② หาคำตอบ`))); } }; }
});
const f3SortQ = (F, dir) => ({ ...Q.ixSort({ q: `เรียงเศษส่วนจาก<b>${dir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}</b>`, items: F.map(([n, d]) => ({ label: f3T(n, d), v: n / d })), dir, slotLabels: F.map((_, i) => i ? '' : dir === 'asc' ? 'น้อยที่สุด' : 'มากที่สุด') }), __sig: `f3o ${dir} ${F.map(x => x.join('/')).join()}` });
const f3MatchQ = P => ({ ...Q.ixMatch({ q: 'จับคู่รูปกับเศษส่วน', pairs: P.map(([n, d]) => [`<span class="f3-mini">${f3Fig(n, d, 'bar', { cls: 'f3-bar-svg' })}</span>`, f3T(n, d)]) }), __sig: 'f3m ' + P.map(x => x.join('/')).join() });

const f3CalcMatch = op => { const d = rnd(5, 13), seen = new Set(), P = []; let g = 0;
  while (P.length < 3 && g++ < 200) { const a = op === '+' ? rnd(1, d - 2) : rnd(3, d), b = op === '+' ? rnd(1, d - a - 1) : rnd(1, a - 1), r = op === '+' ? a + b : a - b; if (seen.has(r)) continue; seen.add(r); P.push([`${f3T(a, d)} ${op} ${f3T(b, d)}`, f3T(r, d), `${a}${op}${b}`]); }
  return { ...Q.ixMatch({ q: `จับคู่โจทย์${op === '+' ? 'การบวก' : 'การลบ'}กับผลลัพธ์`, pairs: P.map(x => x.slice(0, 2)), wide: true, hint: 'ตัวส่วนเท่ากัน คิดเฉพาะตัวเศษ' }), __sig: `f3cm ${op}${d} ` + P.map(x => x[2]).join() }; };
/* ---------- random data in range (every game is new) ---------- */
const f3Prop = (dMax = 12) => { const d = rnd(3, dMax), n = rnd(1, d - 1); return [n, d]; };
const f3SameD = () => { const d = rnd(4, 15); let a = rnd(1, d), b = rnd(1, d); if (Math.random() < .15) b = a; return [[a, d], [b, d]]; };
const f3SameN = () => { const n = rnd(1, 6); let p = rnd(n + 1, 12), q = rnd(n + 1, 12); if (Math.random() < .12) q = p; return [[n, p], [n, q]]; };
const f3ListD = () => { const d = rnd(6, 15), N = shuffle(range(1, d)).slice(0, 4); return N.map(n => [n, d]); };
const f3ListN = () => { const n = rnd(1, 5), D = shuffle(range(n + 1, 14)).slice(0, 4); return D.map(d => [n, d]); };
const F3S = (text, sent, wrong, n, d, unit) => ({ text, sent, wrong, n, d, unit });
const F3_ST1 = [F3S('แม่ซื้อพิซซ่า 1 ถาด แบ่งเป็น 8 ชิ้นเท่า ๆ กัน แก้วกิน [3/8] ถาด ต้นกิน [2/8] ถาด ทั้งสองคนกินพิซซ่ารวมกันเท่าไร', '[3/8] + [2/8]', ['[3/8] − [2/8]'], 5, 8, 'ถาด'),
  F3S('ป้ามีผ้า [7/10] เมตร ใช้ตัดเสื้อไป [4/10] เมตร ป้าเหลือผ้าเท่าไร', '[7/10] − [4/10]', ['[7/10] + [4/10]'], 3, 10, 'เมตร'),
  F3S('วันจันทร์นิดอ่านหนังสือได้ [2/9] เล่ม วันอังคารอ่านอีก [5/9] เล่ม นิดอ่านหนังสือไปทั้งหมดเท่าไร', '[2/9] + [5/9]', ['[5/9] − [2/9]'], 7, 9, 'เล่ม'),
  F3S('แม่แบ่งเค้กให้ลูก [5/12] ก้อน และให้หลาน [4/12] ก้อน แม่แบ่งเค้กไปทั้งหมดเท่าไร', '[5/12] + [4/12]', ['[5/12] − [4/12]'], 9, 12, 'ก้อน'),
  F3S('ขวดมีน้ำ [6/7] ลิตร ดื่มไป [2/7] ลิตร เหลือน้ำเท่าไร', '[6/7] − [2/7]', ['[6/7] + [2/7]'], 4, 7, 'ลิตร'),
  F3S('สวนผักปลูกผักกาด [3/10] ของสวน และปลูกผักบุ้ง [4/10] ของสวน ปลูกผักสองชนิดรวมกันเท่าไรของสวน', '[3/10] + [4/10]', ['[4/10] − [3/10]'], 7, 10, 'ของสวน'),
  F3S('มีเชือกยาว [11/12] เมตร ตัดไปผูกของ [5/12] เมตร เหลือเชือกเท่าไร', '[11/12] − [5/12]', ['[11/12] + [5/12]'], 6, 12, 'เมตร'),
  F3S('ชาวนาเกี่ยวข้าวได้ [3/8] ของนาเมื่อวาน วันนี้เกี่ยวอีก [4/8] ของนา รวมเกี่ยวข้าวได้เท่าไรของนา', '[3/8] + [4/8]', ['[4/8] − [3/8]'], 7, 8, 'ของนา'),
  F3S('ฟ้าเดินไปโรงเรียน [3/7] กิโลเมตร แล้วเดินต่อไปตลาดอีก [3/7] กิโลเมตร ฟ้าเดินทั้งหมดเท่าไร', '[3/7] + [3/7]', ['[3/7] − [3/7]'], 6, 7, 'กิโลเมตร'),
  F3S('เหยือกมีนม [9/11] ลิตร เทใส่แก้วไป [5/11] ลิตร เหลือนมเท่าไร', '[9/11] − [5/11]', ['[9/11] + [5/11]'], 4, 11, 'ลิตร')];
const F3_ST2 = [F3S('น้ำตาล 1 ถุง แม่ใช้ทำขนมไป [3/5] ถุง เหลือน้ำตาลเท่าไร', '1 − [3/5]', ['1 + [3/5]'], 2, 5, 'ถุง'),
  F3S('แตงโม 1 ผล ผ่าเป็น 6 ชิ้นเท่า ๆ กัน กินไป 4 ชิ้น เหลือแตงโมเท่าไรของผล', '1 − [4/6]', ['1 + [4/6]'], 2, 6, 'ของผล'),
  F3S('ต้นวิ่งได้ [7/8] กิโลเมตร ฝนวิ่งได้ [5/8] กิโลเมตร ต้นวิ่งได้มากกว่าฝนเท่าไร', '[7/8] − [5/8]', ['[7/8] + [5/8]'], 2, 8, 'กิโลเมตร'),
  F3S('ทาสีรั้วตอนเช้า [2/11] ของรั้ว ตอนบ่ายทาอีก [6/11] ของรั้ว ยังเหลือรั้วที่ไม่ได้ทาสีเท่าไร', '1 − ([2/11] + [6/11])', ['[2/11] + [6/11]', '[6/11] − [2/11]'], 3, 11, 'ของรั้ว'),
  F3S('ถังมีน้ำ [9/10] ถัง ใช้รดต้นไม้ [3/10] ถัง ใช้ล้างรถ [4/10] ถัง เหลือน้ำเท่าไร', '[9/10] − [3/10] − [4/10]', ['[9/10] + [3/10] + [4/10]'], 2, 10, 'ถัง'),
  F3S('มะลิทำงานบ้านได้ [4/9] ของงาน พี่ช่วยทำอีก [3/9] ของงาน ยังเหลืองานอีกเท่าไร', '1 − ([4/9] + [3/9])', ['[4/9] + [3/9]', '[4/9] − [3/9]'], 2, 9, 'ของงาน'),
  F3S('เอกกินขนมปัง [5/12] แถว ทิวกินน้อยกว่าเอก [2/12] แถว ทิวกินขนมปังเท่าไร', '[5/12] − [2/12]', ['[5/12] + [2/12]'], 3, 12, 'แถว'),
  F3S('ส้มตำจานหนึ่ง พ่อกิน [2/7] จาน แม่กินมากกว่าพ่อ [3/7] จาน แม่กินส้มตำเท่าไร', '[2/7] + [3/7]', ['[3/7] − [2/7]'], 5, 7, 'จาน'),
  F3S('เชือก 1 เส้น ตัดไปใช้ [5/8] เส้น แล้วตัดไปอีก [1/8] เส้น เหลือเชือกเท่าไร', '1 − [5/8] − [1/8]', ['[5/8] + [1/8]', '1 + [5/8] + [1/8]'], 2, 8, 'เส้น'),
  F3S('นาแปลงหนึ่งปลูกข้าวโพด [4/10] ของนา ปลูกถั่วน้อยกว่าข้าวโพด [1/10] ของนา ปลูกถั่วเท่าไรของนา', '[4/10] − [1/10]', ['[4/10] + [1/10]'], 3, 10, 'ของนา')];

/* ---------- lessons ---------- */
const L3F = (no, place, title, short, goal, teach, game) => ({ id: 1360 + no, no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game, learned: true });
const f3N = (k, f) => Array.from({ length: k }, f);
const LESSONS_P3C6 = [
  L3F(1, 'ป่าแบ่งครึ่ง', 'การอ่านและการเขียนเศษส่วน (1)', 'เศษส่วน (1)', 'รู้จักการแบ่งเท่า ๆ กัน และอ่าน เขียนเศษส่วนที่ระบาย 1 ส่วน',
    [...learnStep('ยินดีต้อนรับสู่ <b>ป่าแบ่งครึ่ง</b>! รู้จัก<b>เศษส่วน</b>', 'ยินดีต้อนรับสู่ป่าแบ่งครึ่ง รู้จักเศษส่วน', [
      { fig: `<div class="f3-row">${f3Fig(0, 4, 'pie')}${f3Uneq(1)}</div>`, name: 'แบ่งเท่า ๆ กัน', text: 'เศษส่วนใช้กับสิ่งที่แบ่งเป็นส่วนเท่า ๆ กันเท่านั้น<br>รูปขวาแบ่งไม่เท่ากัน' },
      { fig: f3Fig(1, 2, 'pie', { col: '#EC7F1E' }), name: 'ครึ่งหนึ่ง', text: '1 ส่วน จาก 2 ส่วนเท่า ๆ กัน = ½<br>อ่านว่า เศษหนึ่งส่วนสอง' },
      { fig: f3Fig(1, 4, 'bar', { col: '#5B9BD5' }), name: '1 ใน 4 ส่วน', text: `เขียน ${f3T(1, 4)} อ่านว่า เศษหนึ่งส่วนสี่` }], 'ตัวส่วน = จำนวนส่วนเท่า ๆ กันทั้งหมด'),
     pexStep('ตัวอย่างทีละขั้น: เขียนเศษส่วน', 'ตัวอย่างทีละขั้น', [['① ดูการแบ่ง', 'แบ่งเป็น 6 ส่วนเท่า ๆ กัน', f3Fig(0, 6, 'poly')], ['② ดูส่วนที่ระบาย', 'ระบาย 1 ส่วน', f3Fig(1, 6, 'poly', { col: '#2FA36B' })], ['③ เขียน', `ระบาย 1 ส่วน จาก 6 ส่วน = ${f3T(1, 6)}`, null]], `อ่านว่า <b>เศษหนึ่งส่วนหก</b>`),
     T('ลองแบ่งแล้วระบายสี', 'ลองแบ่งแล้วระบายสี', el => el.append(simF3Cut()))],
    () => [...f3N(2, () => Math.random() < .5 ? Q.f3Equal({ i: rnd(0, F3_UNEQ.length - 1), eq: false }) : Q.f3Equal({ d: rnd(3, 10), eq: true })), ...f3N(2, () => { const d = rnd(2, 12); return Q.f3Write({ n: 1, d }); }), Q.f3Read({ n: 1, d: rnd(2, 12), to: pick(['word', 'frac']) }), Q.f3Shade({ n: 1, d: rnd(3, 9) })]),
  L3F(2, 'ป่าตัวเศษ', 'การอ่านและการเขียนเศษส่วน (2)', 'เศษส่วน (2)', 'อ่าน เขียน และบอกตัวเศษ ตัวส่วนของเศษส่วนที่ระบายหลายส่วน',
    [...learnStep('<b>ตัวเศษ</b> กับ <b>ตัวส่วน</b>', 'ตัวเศษ กับ ตัวส่วน', [
      { fig: f3Fig(3, 5, 'bar', { col: '#8E6CE0' }), name: 'ตัวเศษ = ส่วนที่ระบาย', text: 'ระบาย 3 ส่วน → ตัวเศษคือ 3' },
      { fig: `<div class="f3-big">${f3T(3, 5)}</div>`, name: 'ตัวส่วน = ส่วนทั้งหมด', text: 'แบ่ง 5 ส่วนเท่า ๆ กัน → ตัวส่วนคือ 5<br>อ่านว่า เศษสามส่วนห้า' },
      { fig: f3Fig(4, 4, 'grid', { col: '#2FA36B' }), name: 'ระบายครบทุกส่วน', text: `${f3T(4, 4)} = 1 (เต็มรูป)` }], 'ตัวเศษอยู่บน · ตัวส่วนอยู่ล่าง'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['① นับส่วนทั้งหมด', 'แบ่งเป็น 8 ส่วนเท่า ๆ กัน → ตัวส่วน 8', f3Fig(0, 8, 'pie')], ['② นับส่วนที่ระบาย', 'ระบาย 5 ส่วน → ตัวเศษ 5', f3Fig(5, 8, 'pie', { col: '#E5505E' })], ['③ เขียนและอ่าน', `${f3T(5, 8)} อ่านว่า เศษห้าส่วนแปด`, null]], 'ได้ <b>เศษห้าส่วนแปด</b>'),
     T('ลองระบายตามเศษส่วน', 'ลองระบายตามเศษส่วน', el => el.append(qSim(Q.f3Shade({ n: 3, d: 8, kind: 'bar' }), 'ถูกต้อง!')))],
    () => [...f3N(2, () => { const [n, d] = f3Prop(12); return Q.f3Write({ n, d }); }), (([n, d]) => Q.f3Read({ n, d, to: 'word' }))(f3Prop()), (([n, d]) => Q.f3Read({ n, d, to: 'frac' }))(f3Prop()), (([n, d]) => Q.f3Part({ n, d, ask: pick(['num', 'den']) }))(f3Prop()), (([n, d]) => Q.f3Shade({ n, d }))(f3Prop(10)), f3MatchQ(f3N(3, () => f3Prop(8)).filter((x, i, A) => A.findIndex(y => y.join() === x.join()) === i))]),
  L3F(3, 'ป่าเทียบส่วนเท่า', 'การเปรียบเทียบเศษส่วนที่ตัวส่วนเท่ากัน', 'เทียบ (ตัวส่วนเท่ากัน)', 'เปรียบเทียบเศษส่วนที่มีตัวส่วนเท่ากัน',
    [...learnStep('เปรียบเทียบ <b>ตัวส่วนเท่ากัน</b>', 'เปรียบเทียบเศษส่วนที่ตัวส่วนเท่ากัน', [
      { fig: f3Pair([2, 5], [4, 5]), name: 'ชิ้นขนาดเท่ากัน', text: 'แบ่ง 5 ส่วนเท่ากันทั้งคู่ → ชิ้นขนาดเท่ากัน' },
      { fig: `<div class="f3-eq">${f3T(2, 5)} <b>&lt;</b> ${f3T(4, 5)}</div>`, name: 'ดูตัวเศษ', text: 'ตัวเศษ 2 น้อยกว่า 4 → เศษสองส่วนห้าน้อยกว่า' },
      { fig: `<div class="f3-eq">${f3T(3, 7)} <b>=</b> ${f3T(3, 7)}</div>`, name: 'เท่ากัน', text: 'ตัวเศษเท่ากันและตัวส่วนเท่ากัน → เท่ากัน' }], 'ตัวส่วนเท่ากัน → ตัวเศษมากกว่า มีค่ามากกว่า'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['① ดูตัวส่วน', `${f3T(7, 9)} กับ ${f3T(4, 9)} ตัวส่วนเท่ากัน (9)`, f3Pair([7, 9], [4, 9])], ['② เทียบตัวเศษ', '7 มากกว่า 4', null]], `${f3T(7, 9)} <b>&gt;</b> ${f3T(4, 9)}`),
     T('ลองเปลี่ยนตัวเศษแล้วเทียบ', 'ลองเปลี่ยนตัวเศษแล้วเทียบ', el => el.append(simF3Cmp('den')))],
    () => f3N(6, (_, i) => { const [a, b] = f3SameD(); return Q.f3Cmp({ a, b, pic: i < 2 }); })),
  L3F(4, 'ป่าเรียงส่วนเท่า', 'การเรียงลำดับเศษส่วนที่ตัวส่วนเท่ากัน', 'เรียง (ตัวส่วนเท่ากัน)', 'เรียงลำดับเศษส่วนที่มีตัวส่วนเท่ากัน',
    [...learnStep('<b>เรียงลำดับ</b> ตัวส่วนเท่ากัน', 'เรียงลำดับเศษส่วนที่ตัวส่วนเท่ากัน', [
      { fig: `<div class="f3-col3">${[[1, 6], [3, 6], [5, 6]].map(([n, d]) => f3Fig(n, d, 'bar', { col: '#5B9BD5', cls: 'f3-bar-svg' })).join('')}</div>`, name: 'ดูตัวเศษ', text: 'ตัวส่วนเท่ากัน → เรียงตามตัวเศษ' },
      { fig: `<div class="f3-eq">${f3T(1, 6)} , ${f3T(3, 6)} , ${f3T(5, 6)}</div>`, name: 'น้อยไปมาก', text: 'ตัวเศษ 1, 3, 5' },
      { fig: `<div class="f3-eq">${f3T(5, 6)} , ${f3T(3, 6)} , ${f3T(1, 6)}</div>`, name: 'มากไปน้อย', text: 'กลับลำดับ' }], 'เรียงตัวเศษ แล้วเขียนตัวส่วนเดิม'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['① ตัวส่วนเท่ากัน', `${f3T(8, 11)} ${f3T(2, 11)} ${f3T(5, 11)} ตัวส่วน 11`, `<div class="f3-eq">${f3T(8, 11)} ${f3T(2, 11)} ${f3T(5, 11)}</div>`], ['② เรียงตัวเศษ', '2, 5, 8', null]], `น้อยไปมาก: ${f3T(2, 11)} , ${f3T(5, 11)} , ${f3T(8, 11)}`),
     T('ลองเรียงเอง', 'ลองเรียงเอง', el => el.append(qSim(f3SortQ([[4, 9], [1, 9], [7, 9]], 'asc'), 'ถูกต้อง!')))],
    () => [...f3N(4, () => f3SortQ(f3ListD(), pick(['asc', 'desc']))), ...f3N(2, () => { const [a, b] = f3SameD(); return Q.f3Cmp({ a, b }); })]),
  L3F(5, 'ป่าเทียบเศษเท่า', 'การเปรียบเทียบเศษส่วนที่ตัวเศษเท่ากัน', 'เทียบ (ตัวเศษเท่ากัน)', 'เปรียบเทียบเศษส่วนที่มีตัวเศษเท่ากัน',
    [...learnStep('เปรียบเทียบ <b>ตัวเศษเท่ากัน</b>', 'เปรียบเทียบเศษส่วนที่ตัวเศษเท่ากัน', [
      { fig: `<div class="f3-row">${f3Fig(1, 2, 'pie', { col: '#EC7F1E' })}${f3Fig(1, 6, 'pie', { col: '#EC7F1E' })}</div>`, name: 'แบ่งน้อยชิ้น ชิ้นใหญ่', text: `${f3T(1, 2)} ชิ้นใหญ่กว่า ${f3T(1, 6)}` },
      { fig: f3Pair([3, 4], [3, 8]), name: 'จำนวนชิ้นเท่ากัน', text: 'ได้ 3 ชิ้นเท่ากัน แต่ชิ้นของ 4 ส่วนใหญ่กว่า' },
      { fig: `<div class="f3-eq">${f3T(3, 4)} <b>&gt;</b> ${f3T(3, 8)}</div>`, name: 'ดูตัวส่วน', text: 'ตัวส่วนน้อยกว่า → มีค่ามากกว่า' }], 'ตัวเศษเท่ากัน → ตัวส่วนน้อยกว่า มีค่ามากกว่า'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['① ดูตัวเศษ', `${f3T(2, 5)} กับ ${f3T(2, 9)} ตัวเศษเท่ากัน (2)`, f3Pair([2, 5], [2, 9])], ['② เทียบตัวส่วน', '5 น้อยกว่า 9 → ชิ้นใหญ่กว่า', null]], `${f3T(2, 5)} <b>&gt;</b> ${f3T(2, 9)}`),
     T('ลองเปลี่ยนตัวส่วนแล้วเทียบ', 'ลองเปลี่ยนตัวส่วนแล้วเทียบ', el => el.append(simF3Cmp('num')))],
    () => f3N(6, (_, i) => { const [a, b] = f3SameN(); return Q.f3Cmp({ a, b, pic: i < 2 }); })),
  L3F(6, 'ป่าเรียงเศษเท่า', 'การเรียงลำดับเศษส่วนที่ตัวเศษเท่ากัน', 'เรียง (ตัวเศษเท่ากัน)', 'เรียงลำดับเศษส่วนที่มีตัวเศษเท่ากัน',
    [...learnStep('<b>เรียงลำดับ</b> ตัวเศษเท่ากัน', 'เรียงลำดับเศษส่วนที่ตัวเศษเท่ากัน', [
      { fig: `<div class="f3-col3">${[[1, 3], [1, 5], [1, 8]].map(([n, d]) => f3Fig(n, d, 'bar', { col: '#2FA36B', cls: 'f3-bar-svg' })).join('')}</div>`, name: 'ตัวส่วนยิ่งมาก ยิ่งเล็ก', text: 'แบ่งมากชิ้น ชิ้นยิ่งเล็ก' },
      { fig: `<div class="f3-eq">${f3T(1, 8)} , ${f3T(1, 5)} , ${f3T(1, 3)}</div>`, name: 'น้อยไปมาก', text: 'ตัวส่วนจากมากไปน้อย 8, 5, 3' },
      { fig: `<div class="f3-eq">${f3T(1, 3)} , ${f3T(1, 5)} , ${f3T(1, 8)}</div>`, name: 'มากไปน้อย', text: 'ตัวส่วนจากน้อยไปมาก 3, 5, 8' }], 'ตัวเศษเท่ากัน → เรียงกลับกับตัวส่วน'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['① ตัวเศษเท่ากัน', `${f3T(3, 7)} ${f3T(3, 4)} ${f3T(3, 10)}`, `<div class="f3-eq">${f3T(3, 7)} ${f3T(3, 4)} ${f3T(3, 10)}</div>`], ['② ตัวส่วนน้อยที่สุดมีค่ามากที่สุด', '4 < 7 < 10', null]], `มากไปน้อย: ${f3T(3, 4)} , ${f3T(3, 7)} , ${f3T(3, 10)}`),
     T('ลองเรียงเอง', 'ลองเรียงเอง', el => el.append(qSim(f3SortQ([[2, 9], [2, 3], [2, 6]], 'desc'), 'ถูกต้อง!')))],
    () => [...f3N(4, () => f3SortQ(f3ListN(), pick(['asc', 'desc']))), ...f3N(2, () => { const [a, b] = f3SameN(); return Q.f3Cmp({ a, b }); })]),
  L3F(7, 'ป่าบวกเศษส่วน', 'การบวกเศษส่วนที่ตัวส่วนเท่ากัน', 'บวกเศษส่วน', 'บวกเศษส่วนที่มีตัวส่วนเท่ากัน',
    [...learnStep('<b>บวก</b>เศษส่วนตัวส่วนเท่ากัน', 'บวกเศษส่วนที่ตัวส่วนเท่ากัน', [
      { fig: f3Fig(5, 8, 'bar', { on: [1, 1, 1, 1, 1, 0, 0, 0], col: '#5B9BD5' }), name: 'นำมารวมกัน', text: `${f3T(3, 8)} + ${f3T(2, 8)} → ชิ้นขนาดเดียวกันมารวมกัน` },
      { fig: `<div class="f3-eq">${f3T(3, 8)} + ${f3T(2, 8)} = ${f3T(5, 8)}</div>`, name: 'บวกตัวเศษ', text: '3 + 2 = 5 ตัวส่วนคงเดิม 8' },
      { fig: `<div class="f3-eq">${f3T(2, 5)} + ${f3T(3, 5)} = ${f3T(5, 5)} = 1</div>`, name: 'ครบทุกส่วน = 1', text: 'ได้เต็มรูปพอดี' }], 'บวกตัวเศษ · ตัวส่วนเท่าเดิม'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['① ดูตัวส่วน', `${f3T(4, 10)} + ${f3T(3, 10)} ตัวส่วนเท่ากัน`, f3Fig(4, 10, 'bar', { col: '#5B9BD5' })], ['② บวกตัวเศษ', '4 + 3 = 7', f3Fig(7, 10, 'bar', { col: '#5B9BD5' })]], `${f3T(4, 10)} + ${f3T(3, 10)} = <b>${f3T(7, 10)}</b>`),
     T('ลองเพิ่มส่วน', 'ลองเพิ่มส่วน', el => el.append(simF3Add('+')))],
    () => [...f3N(5, () => { const d = rnd(4, 15), a = rnd(1, d - 2), b = rnd(1, d - a - 1); return Q.f3Calc({ a, b, op: '+', d }); }), f3CalcMatch('+')]),
  L3F(8, 'ป่าลบเศษส่วน', 'การลบเศษส่วนที่ตัวส่วนเท่ากัน', 'ลบเศษส่วน', 'ลบเศษส่วนที่มีตัวส่วนเท่ากัน และ 1 ลบเศษส่วน',
    [...learnStep('<b>ลบ</b>เศษส่วนตัวส่วนเท่ากัน', 'ลบเศษส่วนที่ตัวส่วนเท่ากัน', [
      { fig: f3Fig(6, 9, 'bar', { col: '#E5505E' }), name: 'เอาออก', text: `${f3T(6, 9)} เอาออก ${f3T(2, 9)}` },
      { fig: `<div class="f3-eq">${f3T(6, 9)} − ${f3T(2, 9)} = ${f3T(4, 9)}</div>`, name: 'ลบตัวเศษ', text: '6 − 2 = 4 ตัวส่วนคงเดิม' },
      { fig: `<div class="f3-eq">1 − ${f3T(3, 8)} = ${f3T(8, 8)} − ${f3T(3, 8)} = ${f3T(5, 8)}</div>`, name: '1 ลบเศษส่วน', text: '1 เขียนเป็นเศษส่วนที่ตัวเศษเท่ากับตัวส่วน' }], 'ลบตัวเศษ · ตัวส่วนเท่าเดิม'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['① เปลี่ยน 1', `1 = ${f3T(6, 6)}`, f3Fig(6, 6, 'poly', { col: '#2FA36B' })], ['② ลบตัวเศษ', `${f3T(6, 6)} − ${f3T(2, 6)} → 6 − 2 = 4`, f3Fig(4, 6, 'poly', { col: '#2FA36B' })]], `1 − ${f3T(2, 6)} = <b>${f3T(4, 6)}</b>`),
     T('ลองเอาส่วนออก', 'ลองเอาส่วนออก', el => el.append(simF3Add('−')))],
    () => [...f3N(4, () => { const d = rnd(4, 15), a = rnd(3, d), b = rnd(1, a - 1); return Q.f3Calc({ a, b, op: '−', d }); }), ...f3N(2, () => { const d = rnd(3, 12), b = rnd(1, d - 1); return Q.f3Calc({ b, op: '−', d, w: true }); }), f3CalcMatch('−')]),
  L3F(9, 'ป่าโจทย์เศษส่วน', 'โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบเศษส่วนที่มีตัวส่วนเท่ากัน (1)', 'โจทย์ปัญหา (1)', 'แก้โจทย์ปัญหาการบวกและการลบเศษส่วนที่ตัวส่วนเท่ากัน',
    [...learnStep('<b>โจทย์ปัญหา</b>เศษส่วน', 'โจทย์ปัญหาเศษส่วน', [
      { fig: `<div class="storybox">${FX('แม่กินพิซซ่า [2/8] ถาด พ่อกิน [3/8] ถาด รวมกันกินเท่าไร')}</div>`, name: '① โจทย์ถามอะไร', text: 'ถามว่ารวมกันเท่าไร → บวก' },
      { fig: `<div class="f3-eq">${f3T(2, 8)} + ${f3T(3, 8)} = ?</div>`, name: '② เขียนประโยคสัญลักษณ์', text: 'เขียนจากข้อมูลที่โจทย์บอก' },
      { fig: f3Fig(5, 8, 'pie', { col: '#EC7F1E' }), name: '③ หาคำตอบ', text: `= ${f3T(5, 8)} ถาด` }], 'รวม/ทั้งหมด → บวก · เหลือ/มากกว่า → ลบ'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', FX('ขวดมีน้ำ [8/10] ลิตร ดื่มไป [3/10] ลิตร เหลือน้ำเท่าไร'), f3Fig(8, 10, 'bar', { col: '#5B9BD5' })], ['① ประโยคสัญลักษณ์', `${f3T(8, 10)} − ${f3T(3, 10)} = ?`, null], ['② ลบตัวเศษ', '8 − 3 = 5', f3Fig(5, 10, 'bar', { col: '#5B9BD5' })]], `เหลือน้ำ <b>${f3T(5, 10)}</b> ลิตร`),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.f3Story(F3S('พี่ทาสีห้อง [2/6] ของห้อง น้องทาอีก [3/6] ของห้อง ทาสีไปรวมเท่าไรของห้อง', '[2/6] + [3/6]', ['[3/6] − [2/6]'], 5, 6, 'ของห้อง')), 'ถูกต้อง!')))],
    () => pkF(F3_ST1, 5).map(s => Q.f3Story(s))),
  L3F(10, 'ป่าโจทย์เศษส่วนยาก', 'โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบเศษส่วนที่มีตัวส่วนเท่ากัน (2)', 'โจทย์ปัญหา (2)', 'แก้โจทย์ปัญหาเศษส่วนที่มีการลบจาก 1 และโจทย์ 2 ขั้นตอน',
    [...learnStep('โจทย์<b>เหลือจากทั้งหมด</b>', 'โจทย์เหลือจากทั้งหมด', [
      { fig: f3Fig(5, 5, 'pie', { col: '#8E6CE0' }), name: 'ทั้งหมด = 1', text: `ของทั้งหมด 1 ชิ้น = ${f3T(5, 5)}` },
      { fig: `<div class="f3-eq">1 − ${f3T(2, 5)} = ${f3T(3, 5)}</div>`, name: 'ใช้ไปแล้วเหลือ', text: 'ลบจาก 1' },
      { fig: `<div class="f3-eq">1 − (${f3T(1, 7)} + ${f3T(4, 7)}) = ${f3T(2, 7)}</div>`, name: '2 ขั้นตอน', text: 'รวมส่วนที่ใช้ก่อน แล้วลบจาก 1' }], 'อ่านโจทย์ให้ครบ ทำทีละขั้น'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', FX('ทาสีกำแพงเช้า [3/9] บ่าย [2/9] ของกำแพง เหลือที่ยังไม่ทาเท่าไร'), f3Fig(0, 9, 'grid')], ['① รวมที่ทาแล้ว', `${f3T(3, 9)} + ${f3T(2, 9)} = ${f3T(5, 9)}`, f3Fig(5, 9, 'grid', { col: '#EC7F1E' })], ['② ลบจาก 1', `${f3T(9, 9)} − ${f3T(5, 9)} = ${f3T(4, 9)}`, null]], `เหลือ <b>${f3T(4, 9)}</b> ของกำแพง`),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.f3Story(F3S('ขนมปัง 1 แถว กินไป [5/9] แถว เหลือขนมปังเท่าไร', '1 − [5/9]', ['1 + [5/9]'], 4, 9, 'แถว')), 'ถูกต้อง!')))],
    () => pkF(F3_ST2, 5).map(s => Q.f3Story(s)))
];

/* ---------- boss ---------- */
const f3X = (q, fig, opts, lv) => ({ q, fig, opts, a: 0, lv });
const f3O = (n, d) => ({ html: f3T(n, d), say: f3W(n, d) });
const EXAM_P3C6 = d6spread([
  f3X('รูปใดแบ่งเป็นส่วนเท่า ๆ กัน', null, [{ html: `<span class="f3-mini">${f3Fig(0, 5, 'pie')}</span>`, say: 'วงกลมแบ่ง 5 ส่วนเท่ากัน' }, { html: `<span class="f3-mini">${f3Uneq(2)}</span>`, say: 'สามเหลี่ยมแบ่งไม่เท่ากัน' }, { html: `<span class="f3-mini">${f3Uneq(5)}</span>`, say: 'แถบแบ่งไม่เท่ากัน' }], 1361),
  f3X('ส่วนที่ระบายสีเขียนเป็นเศษส่วนได้อย่างไร', f3Fig(1, 7, 'poly', { col: '#2FA36B' }), [f3O(1, 7), f3O(7, 1), f3O(1, 6), f3O(6, 7)], 1361),
  f3X('“เศษหนึ่งส่วนเก้า” เขียนเป็นเศษส่วนได้อย่างไร', null, [f3O(1, 9), f3O(9, 1), f3O(1, 8)], 1361),
  f3X('ส่วนที่ระบายสีเขียนเป็นเศษส่วนได้อย่างไร', f3Fig(5, 12, 'grid', { col: '#E5505E' }), [f3O(5, 12), f3O(7, 12), f3O(12, 5), f3O(5, 7)], 1362),
  f3X(`${f3T(4, 11)} อ่านว่าอย่างไร`, null, ['เศษสี่ส่วนสิบเอ็ด', 'เศษสิบเอ็ดส่วนสี่', 'สี่ส่วนสิบเอ็ด'], 1362),
  f3X(`${f3T(6, 13)} มีตัวส่วนเป็นเท่าใด`, null, ['13', '6', '19', '7'], 1362),
  f3X(`ข้อใดถูกต้อง`, null, [{ html: `${f3T(5, 9)} &gt; ${f3T(2, 9)}`, say: 'เศษห้าส่วนเก้า มากกว่า เศษสองส่วนเก้า' }, { html: `${f3T(5, 9)} &lt; ${f3T(2, 9)}`, say: 'เศษห้าส่วนเก้า น้อยกว่า เศษสองส่วนเก้า' }, { html: `${f3T(5, 9)} = ${f3T(2, 9)}`, say: 'เท่ากับ' }], 1363),
  f3X(`${f3T(8, 14)} ☐ ${f3T(11, 14)} ควรเติมเครื่องหมายใด`, null, ['<', '>', '='], 1363),
  f3X('เศษส่วนใดมีค่ามากที่สุด', null, [f3O(9, 10), f3O(3, 10), f3O(7, 10), f3O(1, 10)], 1364),
  f3X('ข้อใดเรียงจากน้อยไปมาก', null, [{ html: `${f3T(2, 13)} , ${f3T(6, 13)} , ${f3T(10, 13)}`, say: 'สอง หก สิบ ส่วนสิบสาม' }, { html: `${f3T(10, 13)} , ${f3T(6, 13)} , ${f3T(2, 13)}`, say: 'สิบ หก สอง ส่วนสิบสาม' }, { html: `${f3T(6, 13)} , ${f3T(2, 13)} , ${f3T(10, 13)}`, say: 'หก สอง สิบ ส่วนสิบสาม' }], 1364),
  f3X(`${f3T(3, 5)} ☐ ${f3T(3, 11)} ควรเติมเครื่องหมายใด`, f3Pair([3, 5], [3, 11]), ['>', '<', '='], 1365),
  f3X('เศษส่วนใดมีค่าน้อยที่สุด', null, [f3O(1, 12), f3O(1, 3), f3O(1, 7), f3O(1, 9)], 1366),
  f3X('ข้อใดเรียงจากมากไปน้อย', null, [{ html: `${f3T(4, 5)} , ${f3T(4, 9)} , ${f3T(4, 13)}`, say: 'สี่ส่วนห้า สี่ส่วนเก้า สี่ส่วนสิบสาม' }, { html: `${f3T(4, 13)} , ${f3T(4, 9)} , ${f3T(4, 5)}`, say: 'สี่ส่วนสิบสาม สี่ส่วนเก้า สี่ส่วนห้า' }, { html: `${f3T(4, 9)} , ${f3T(4, 5)} , ${f3T(4, 13)}`, say: 'สี่ส่วนเก้า สี่ส่วนห้า สี่ส่วนสิบสาม' }], 1366),
  f3X(`${f3T(4, 13)} + ${f3T(7, 13)} = ?`, null, [f3O(11, 13), f3O(11, 26), f3O(3, 13), f3O(28, 13)], 1367),
  f3X(`${f3T(2, 9)} + ${f3T(7, 9)} = ?`, null, ['1', f3O(9, 18), f3O(5, 9)], 1367),
  f3X(`${f3T(13, 15)} − ${f3T(6, 15)} = ?`, null, [f3O(7, 15), f3O(7, 0), f3O(19, 15), f3O(6, 15)], 1368),
  f3X(`1 − ${f3T(4, 7)} = ?`, null, [f3O(3, 7), f3O(4, 7), f3O(1, 7), f3O(3, 0)], 1368),
  f3X(FX('น้องกินส้ม [3/10] ผล พี่กิน [4/10] ผล สองคนกินส้มรวมกันเท่าไร'), null, [{ html: FX('[7/10] ผล'), say: 'เจ็ดส่วนสิบ ผล' }, { html: FX('[1/10] ผล'), say: 'หนึ่งส่วนสิบ ผล' }, { html: FX('[7/20] ผล'), say: 'เจ็ดส่วนยี่สิบ ผล' }], 1369),
  f3X(FX('ถุงมีถั่ว [11/13] กิโลกรัม แบ่งให้เพื่อน [4/13] กิโลกรัม เหลือถั่วเท่าไร'), null, [{ html: FX('[7/13] กิโลกรัม'), say: 'เจ็ดส่วนสิบสาม' }, { html: FX('[15/13] กิโลกรัม'), say: 'สิบห้าส่วนสิบสาม' }, { html: FX('[7/26] กิโลกรัม'), say: 'เจ็ดส่วนยี่สิบหก' }], 1369),
  f3X(FX('ขนมปัง 1 ก้อน กินเช้า [2/12] ก้อน กินเย็น [5/12] ก้อน เหลือขนมปังเท่าไร'), null, [{ html: FX('[5/12] ก้อน'), say: 'ห้าส่วนสิบสอง' }, { html: FX('[7/12] ก้อน'), say: 'เจ็ดส่วนสิบสอง' }, { html: FX('[3/12] ก้อน'), say: 'สามส่วนสิบสอง' }], 1370)].map(x => ({ ...x, opts: x.opts.map(o => typeof o === 'object' && o.html && /\/0\]|<i>0<\/i>/.test(o.html) ? null : o).filter(Boolean) })));
LESSONS_P3C6.push({ id: 1379, boss: true, place: 'ป่าพิซซ่ายักษ์', title: 'ด่านบอส: ป.3 บทที่ 6 เศษส่วน', short: 'ด่านบอส · ข้อสอบ', tone: 'yellow',
  goal: 'คำถามท้ายบท 20 ข้อ (อ่านและเขียนเศษส่วน · เปรียบเทียบและเรียงลำดับ · บวก ลบ · โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P3C6, pass: 10, bossName: 'งูยักษ์เศษส่วน', bossPal: 'coral', emblem: '½', bossKind: 'snake',
  winLine: 'ชนะงูยักษ์เศษส่วนแล้ว! เก่งเรื่องเศษส่วนมาก', loseLine: 'งูยักษ์เศษส่วนยังไม่ยอมแพ้ กลับไปทวนแล้วสู้ใหม่นะ!' });
