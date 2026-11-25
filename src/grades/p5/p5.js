'use strict';
/* =========================================================
   GRADE 5 · CHAPTER 1 — เศษส่วน (ถ้ำ · บอสหมี)
   Fraction engine · fraction UI · fraction question types · 30 levels
   ========================================================= */

/* ---------- exact fraction maths: { n, d } always reduced, d > 0 ---------- */
const gcdN = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const lcmN = (a, b) => a / gcdN(a, b) * b;
const Rr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcdN(n, d); return { n: n / g, d: d / g }; };
const rAdd = (a, b) => Rr(a.n * b.d + b.n * a.d, a.d * b.d), rSub = (a, b) => Rr(a.n * b.d - b.n * a.d, a.d * b.d);
const rMul = (a, b) => Rr(a.n * b.n, a.d * b.d), rDiv = (a, b) => Rr(a.n * b.d, a.d * b.n);
const rCmp = (a, b) => Math.sign(a.n * b.d - b.n * a.d), rEq = (a, b) => a.n * b.d === b.n * a.d;
const rVal = r => r.n / r.d;
/* literal parsing keeps what is written (6/8 stays 6/8): "2 1/3" · "5/6" · "12" */
const LIT_RE = /^\s*(?:(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)|(\d+))/, DEC_RE = /^\s*(\d*\.\d+)/;
function litParse(s) { const dm = DEC_RE.exec(s); if (dm) return { lit: { w: 0, n: 0, d: 1, dec: dm[1] }, len: dm[0].length };
  const m = LIT_RE.exec(s); if (!m) return null;
  const L = m[1] != null ? { w: +m[1], n: +m[2], d: +m[3] } : m[4] != null ? { w: 0, n: +m[4], d: +m[5] } : { w: +m[6], n: 0, d: 1 };
  return { lit: L, len: m[0].length }; }
const decR = str => { str = String(str).replace(/,/g, ''); const [a, b = ''] = str.split('.'); return Rr(+(a || 0) * 10 ** b.length + +(b || 0), 10 ** b.length); };
const litR = L => L.dec ? decR(L.dec) : Rr(L.w * L.d + L.n, L.d);
const FR = s => litR(litParse(String(s)).lit);
/* decimals: exact string ↔ rational */
function decStr(r) { if (r.d === 1) return String(r.n); let k = 0, p = 1; while (k < 12 && p % r.d) { k++; p *= 10; } if (p % r.d) return (r.n / r.d).toFixed(6).replace(/0+$/, '');
  const v = r.n * (p / r.d), neg = v < 0, a = String(Math.abs(v)).padStart(k + 1, '0'); return (neg ? '-' : '') + (a.slice(0, a.length - k) + '.' + a.slice(a.length - k)).replace(/\.?0+$/, ''); }
const fmtDec = str => { const [a, b] = String(str).split('.'); return (a === '' ? '0' : (+a).toLocaleString('en-US')) + (b != null ? '.' + b : ''); };
const decSay = str => { const [a, b] = String(str).replace(/,/g, '').split('.'); return (a === '' ? '0' : a) + (b != null ? ' จุด ' + b.split('').join(' ') : ''); };
/* HTML for literals and values */
const fqHTML = (n, d) => `<span class="fq"><i>${n}</i><i>${d}</i></span>`;
const litHTML = L => L.dec ? `<span class="fr"><b class="fw">${fmtDec(L.dec)}</b></span>` : L.n ? `<span class="fr">${L.w ? `<b class="fw">${L.w}</b>` : ''}${fqHTML(L.n, L.d)}</span>` : `<span class="fr"><b class="fw">${fmt(L.w)}</b></span>`;
function rHTML(r, mixed = true) { // value → simplest written form (mixed number when > 1)
  if (r.d === 1) return `<span class="fr"><b class="fw">${r.n}</b></span>`;
  const w = Math.floor(r.n / r.d), n = r.n % r.d;
  return mixed && w ? litHTML({ w, n, d: r.d }) : litHTML({ w: 0, n: r.n, d: r.d });
}
const rText = r => { if (r.d === 1) return String(r.n); const w = Math.floor(r.n / r.d), n = r.n % r.d; return w ? `${w} ${n}/${r.d}` : `${n}/${r.d}`; };
/* inline markup for prompts/exams: "[2/3]" "[1 1/2]" → stacked fractions */
const FX = s => String(s).replace(/\[(\d+ )?(\d+)\/(\d+)\]/g, (_, w, n, d) => litHTML({ w: w ? +w : 0, n: +n, d: +d })).replace(/\[(\d+)\]/g, '$1');
/* expressions: "1 2/15 − (3/10 ÷ 1/2)" — literals, + − × ÷ and brackets */
function exprTokens(src) {
  const out = []; let s = src.replace(/-/g, '−').replace(/\*/g, '×');
  while (s.length) { s = s.replace(/^\s+/, ''); if (!s) break;
    if ('+−×÷()'.includes(s[0])) { out.push({ op: s[0] }); s = s.slice(1); continue; }
    const p = litParse(s); if (!p) throw new Error('bad expr ' + src); out.push({ lit: p.lit }); s = s.slice(p.len); }
  return out;
}
const PREC = { '+': 1, '−': 1, '×': 2, '÷': 2 };
function exprEval(src) {
  const t = exprTokens(src), vals = [], ops = [];
  const apply = () => { const o = ops.pop(), b = vals.pop(), a = vals.pop(); vals.push(o === '+' ? rAdd(a, b) : o === '−' ? rSub(a, b) : o === '×' ? rMul(a, b) : rDiv(a, b)); };
  t.forEach(k => { if (k.lit) vals.push(litR(k.lit)); else if (k.op === '(') ops.push('('); else if (k.op === ')') { while (ops[ops.length - 1] !== '(') apply(); ops.pop(); }
    else { while (ops.length && ops[ops.length - 1] !== '(' && PREC[ops[ops.length - 1]] >= PREC[k.op]) apply(); ops.push(k.op); } });
  while (ops.length) apply(); return vals[0];
}
const exprHTML = src => `<span class="fexpr">${exprTokens(src).map(k => k.lit ? litHTML(k.lit) : `<b class="fop${'()'.includes(k.op) ? ' br' : ''}">${k.op}</b>`).join('')}</span>`;
const frSay = L => L.dec ? decSay(L.dec) : (L.w ? `${L.w} ` : '') + (L.n ? `เศษ ${L.n} ส่วน ${L.d}` : '');
const exprSay = src => exprTokens(src).map(k => k.lit ? frSay(k.lit) : { '+': 'บวก', '−': 'ลบ', '×': 'คูณ', '÷': 'หาร', '(': 'วงเล็บเปิด', ')': 'วงเล็บปิด' }[k.op]).join(' ');
const FXsay = s => String(s).replace(/\[(\d+ )?(\d+)\/(\d+)\]/g, (_, w, n, d) => frSay({ w: w ? +w : 0, n: +n, d: +d })).replace(/\[(\d+)\]/g, '$1').replace(/<[^>]+>/g, '');
/* one step of evaluation (for teaching): innermost bracket first, then × ÷ left→right, then + − */
function exprStep(src) {
  const t = exprTokens(src); let lo = 0, hi = t.length;
  for (let i = 0; i < t.length; i++) if (t[i].op === '(') lo = i + 1; else if (t[i].op === ')' && i > lo) { hi = i; break; }
  if (hi === t.length) { const o = t.findIndex(k => k.op === '('); if (o >= 0) { lo = o + 1; hi = t.findIndex((k, j) => j > o && k.op === ')'); } }
  if (hi < t.length && !t.slice(lo, hi).some(k => k.op && '()'.includes(k.op)) && t.slice(lo, hi).length === 1) { // (x) → x
    const nt = [...t.slice(0, lo - 1), t[lo], ...t.slice(hi + 1)]; return { src: tokSrc(nt), from: [lo - 1, hi], val: litR(t[lo].lit) }; }
  let j = -1; for (let i = lo; i < hi; i++) if (t[i].op === '×' || t[i].op === '÷') { j = i; break; }
  if (j < 0) for (let i = lo; i < hi; i++) if (t[i].op === '+' || t[i].op === '−') { j = i; break; }
  if (j < 0) return null;
  const a = litR(t[j - 1].lit), b = litR(t[j + 1].lit), o = t[j].op, v = o === '+' ? rAdd(a, b) : o === '−' ? rSub(a, b) : o === '×' ? rMul(a, b) : rDiv(a, b);
  const dm = t.some(k => k.lit && k.lit.dec), w = Math.floor(v.n / v.d), lit = dm && v.d !== 1 ? { w: 0, n: 0, d: 1, dec: decStr(v) } : v.d === 1 ? { w: v.n, n: 0, d: 1 } : { w, n: v.n % v.d, d: v.d };
  let nt = [...t.slice(0, j - 1), { lit }, ...t.slice(j + 2)];
  const k = j - 1; if (nt[k - 1] && nt[k - 1].op === '(' && nt[k + 1] && nt[k + 1].op === ')') nt = [...nt.slice(0, k - 1), nt[k], ...nt.slice(k + 2)];
  return { src: tokSrc(nt), part: `${tokSrc([t[j - 1]])} ${o} ${tokSrc([t[j + 1]])}`, val: v };
}
const tokSrc = t => t.map(k => k.lit ? k.lit.dec ? k.lit.dec : (k.lit.n ? (k.lit.w ? `${k.lit.w} ${k.lit.n}/${k.lit.d}` : `${k.lit.n}/${k.lit.d}`) : String(k.lit.w)) : k.op).join(' ');

/* ---------- fraction pictures ---------- */
const FR_COLS = { a: ['#6FB2F5', '#2B6FBA'], b: ['#FFC24C', '#C98612'], c: ['#4FD1A1', '#1B8862'], d: ['#FF7B86', '#C23C4B'], p: ['#B9A6F5', '#7E6ED6'] };
/* bar(s) showing n/d (n may exceed d → several whole bars) */
function fracBars(r, o = {}) {
  const d = o.d || r.d, n = o.n != null ? o.n : r.n * (d / r.d), wholes = Math.max(1, Math.ceil(n / d)), [c, ln] = FR_COLS[o.col || 'a'];
  const W = 240, H = 30, w = h('div', { class: 'fbars' + (o.sm ? ' sm' : '') });
  for (let k = 0; k < (o.wholes || wholes); k++) { let s = `<svg viewBox="-2 -2 ${W + 4} ${H + 4}" class="fbar" aria-hidden="true"><rect x="0" y="0" width="${W}" height="${H}" rx="5" fill="#fff" stroke="${ln}" stroke-width="2"/>`;
    for (let i = 0; i < d; i++) { const on = k * d + i < n; s += `<rect x="${i * W / d}" y="0" width="${W / d}" height="${H}" fill="${on ? c : '#fff'}" stroke="${ln}" stroke-width="1.4" ${on ? 'class="on"' : ''}/>`; }
    if (o.half) s += `<path d="M${W / 2} -2 V${H + 2}" stroke="#2B2550" stroke-width="2.4" stroke-dasharray="4 3"/>`;
    w.insertAdjacentHTML('beforeend', s + '</svg>'); }
  if (o.label) w.append(h('div', { class: 'fbl', html: o.label }));
  return w;
}
/* a number line 0..max with fractions marked */
function fracLine(marks, o = {}) {
  const max = o.max || Math.max(1, Math.ceil(Math.max(...marks.map(m => rVal(m.r))))), step = o.step || 4, W = 100;
  const w = h('div', { class: 'fline' }); const bar = h('div', { class: 'fl-bar' }); w.append(bar);
  for (let k = 0; k <= max * step; k++) { const v = k / step; bar.append(h('span', { class: 'fl-t' + (k % step ? ' m' : ''), style: { left: v / max * W + '%' } }, k % step ? (o.halfMark && k * 2 === step ? h('b', { class: 'fl-half', html: fqHTML(1, 2) }) : null) : h('b', null, v))); }
  marks.forEach((m, i) => bar.append(h('span', { class: 'fl-m ' + (m.col || 'a') + (i % 2 ? ' alt' : ''), style: { left: rVal(m.r) / max * W + '%', animationDelay: i * .2 + 's' }, html: `<span class="fl-lab">${m.html || rHTML(m.r)}</span>` })));
  return w;
}
/* area model for a × b (fractions ≤ 1): columns = a, rows = b */
function areaModel(a, b, o = {}) {
  const S = 180, cw = S / a.d, rh = S / b.d; let s = `<svg viewBox="-3 -3 ${S + 6} ${S + 6}" class="farea" aria-hidden="true"><rect x="0" y="0" width="${S}" height="${S}" fill="#fff" stroke="#2B2550" stroke-width="2"/>`;
  for (let i = 0; i < a.d; i++) for (let j = 0; j < b.d; j++) { const A = i < a.n, B = j < b.n; s += `<rect x="${i * cw}" y="${j * rh}" width="${cw}" height="${rh}" fill="${A && B ? '#4FD1A1' : A ? '#BFE0FF' : B ? '#FFE7A3' : '#fff'}" stroke="#B7AFCD" stroke-width="1"/>`; }
  s += `<rect x="0" y="0" width="${S}" height="${S}" fill="none" stroke="#2B2550" stroke-width="2"/></svg>`;
  return h('div', { class: 'fareaw', html: s });
}
/* a set of objects split into d equal groups, n groups lit */
function groupSet(e, total, d, n) {
  const per = total / d, w = h('div', { class: 'fgroups' });
  for (let g = 0; g < d; g++) w.append(h('div', { class: 'fg' + (g < n ? ' on' : '') }, objRow(e, per, { size: 'clamp(16px,2vw,24px)', max: Math.min(5, per) * 26 + 'px' })));
  return w;
}
const frChip = (r, cls = '') => h('span', { class: 'frchip ' + cls, html: rHTML(r) });

/* ---------- answer box for a fraction or mixed number ---------- */
function fracAnswer(ctx, expected, opts = {}) {
  const slots = { w: '', n: '', d: '' }; let cur = 'n';
  const msg = h('div', { class: 'pad-msg' }), wrap = h('div', { class: 'ans fans ia' });
  const sl = k => { const b = h('button', { class: 'fslot ' + k }); b.onclick = e => { e.stopPropagation(); if (wrap.classList.contains('done')) return; cur = k; draw(); }; return b; };
  const S = { w: sl('w'), n: sl('n'), d: sl('d') };
  const hasW = expected.n >= expected.d; // no whole-number slot when the answer is less than 1
  const box = h('div', { class: 'fbox' }, hasW ? S.w : null, h('div', { class: 'fstack' }, S.n, h('i', { class: 'fline-bar' }), S.d));
  function draw() { ['w', 'n', 'd'].forEach(k => { S[k].textContent = slots[k] || (k === cur ? '' : '·'); S[k].classList.toggle('on', k === cur); S[k].classList.toggle('filled', !!slots[k]); }); }
  const press = d => { sfx.tap(); slots[cur] = (slots[cur] + d).slice(0, 4).replace(/^0+(\d)/, '$1'); if (cur === 'n' && slots.n.length >= String(Math.max(expected.n, 9)).length && !slots.d) {} draw(); };
  const kp = h('div', { class: 'keypad' });
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: () => press(d) }, d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: () => { sfx.tap(); slots[cur] = slots[cur].slice(0, -1); draw(); } }, icon('left')), h('button', { class: 'btn', onclick: () => press(0) }, '0'), h('button', { class: 'btn primary', 'aria-label': 'ส่งคำตอบ', onclick: submit }, icon('check')));
  const nav = h('div', { class: 'fnav' }, ...[['w', 'จำนวนเต็ม'], ['n', 'ตัวเศษ'], ['d', 'ตัวส่วน']].filter(([k]) => k !== 'w' || hasW).map(([k, t]) => { const b = h('button', { class: 'btn sm' }, t); b.onclick = e => { e.stopPropagation(); cur = k; draw(); }; return b; }));
  function submit() {
    if (wrap.classList.contains('done')) return;
    const w = +(slots.w || 0), n = slots.n === '' ? null : +slots.n, d = slots.d === '' ? null : +slots.d;
    if (n == null && d == null && !slots.w) { msg.textContent = 'แตะช่อง แล้วกดตัวเลขก่อนนะ'; return; }
    if ((n == null) !== (d == null)) { msg.textContent = n == null ? 'ใส่ตัวเศษด้วยนะ' : 'ใส่ตัวส่วนด้วยนะ'; cur = n == null ? 'n' : 'd'; draw(); return; }
    if (d === 0) { msg.textContent = 'ตัวส่วนเป็น 0 ไม่ได้'; return; }
    const val = n == null ? Rr(w) : Rr(w * d + n, d), same = rEq(val, expected);
    const simplest = n == null || (gcdN(n, d) === 1 && n !== 0 && !(w && n >= d));
    if (same && simplest) { wrap.classList.add('done'); msg.textContent = ''; ctx.check(true); return; }
    /* the value is right but not in lowest terms → tell the child, keep the answer, it is not a wrong try (ผู้ใช้ขอ) */
    if (same) { const t = n >= d && w ? 'ถูกแล้ว! แต่เศษต้องน้อยกว่าส่วน — ทำเป็นจำนวนคละที่ถูกต้องนะ' : n % d === 0 ? 'ถูกแล้ว! เขียนเป็นจำนวนนับได้เลยนะ' : 'ถูกแล้ว! แต่ยังไม่เป็นเศษส่วนอย่างต่ำ — ทำเป็นเศษส่วนอย่างต่ำนะ (หารทั้งเศษและส่วนด้วยตัวเดียวกัน)';
      msg.innerHTML = `<b class="fl-low">${t}</b>`; msg.classList.remove('lowtip'); void msg.offsetWidth; msg.classList.add('lowtip'); sfx.pop(3); if (ctx.say) ctx.say(t); else say(t); return; }
    ctx.check(false, opts.hint); if (!wrap.classList.contains('revealed')) { slots.w = slots.n = slots.d = ''; cur = 'n'; draw(); }
  }
  wrap.reveal = () => { const w = Math.floor(expected.n / expected.d), n = expected.n % expected.d; slots.w = w ? String(w) : ''; slots.n = n ? String(n) : ''; slots.d = n ? String(expected.d) : ''; draw(); wrap.classList.add('done', 'revealed'); };
  draw(); wrap.append(box, nav, kp, msg);
  return wrap;
}
const numOrFrac = (ctx, r, hint) => r.d === 1 ? answerBox(ctx, r.n, { hint }) : fracAnswer(ctx, r, { hint });

/* =========================================================
   QUESTION TYPES (prefix f… to avoid name clashes)
   ========================================================= */
/* ป.5 บทที่ 1 games: no pictures (ผู้ใช้ขอ: ในเกมไม่ต้องมีแผนภาพ) — the question sits big in the middle instead; teaching pages keep their pictures */
const fNoPic = () => { const id = (typeof GAME_LID !== 'undefined' && GAME_LID) || (typeof TEACH_LID !== 'undefined' && TEACH_LID) || 0; return id > 500 && id < 540; }; // games + practice pages (ผู้ใช้ขอ v99)
const SIGN_OPTS = (ctx, rel, onRight, hint) => choices(ctx, ['>', '<', '='].map(x => ({ value: x, label: `<span class="num" style="font-size:1.3em">${x.replace('>', '&gt;').replace('<', '&lt;')}</span>` })), rel, { onRight, hint });
const relOf = (a, b) => ({ 1: '>', '-1': '<', 0: '=' })[rCmp(a, b)];
Object.assign(Q, {
  /* compare a fraction with 1/2 */
  fHalf({ a }) {
    const r = FR(a), rel = relOf(r, Rr(1, 2)), right = { '>': 'มากกว่า', '<': 'น้อยกว่า', '=': 'เท่ากับ' }[rel];
    return { prompt: `${FX(`[${a}]`)} มากกว่า น้อยกว่า หรือเท่ากับ ${FX('[1/2]')}?`, say: `${FXsay(`[${a}]`)} มากกว่า น้อยกว่า หรือเท่ากับ เศษหนึ่งส่วนสอง`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, fNoPic() ? h('div', { class: 'fbig' + (fNoPic() ? ' fq5' : '') }, h('span', { html: litHTML(litParse(a).lit) }), h('span', { class: 'fsign' }, '?'), h('span', { html: fqHTML(1, 2) })) : fracBars(r, { half: true }), choices(ctx, ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'].map(w => ({ value: w, label: `${w} ${fqHTML(1, 2)}` })), right, { hint: `เทียบ 2 × ตัวเศษ (${2 * litParse(a).lit.n}) กับตัวส่วน (${litParse(a).lit.d})` }))); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); } };
  },
  /* compare two fractions / mixed numbers with > < = */
  fCmp({ a, b, bars = false, hint }) {
    const A = FR(a), B = FR(b), rel = relOf(A, B);
    return { prompt: 'เติมเครื่องหมาย &gt; &lt; หรือ = ให้ถูกต้อง', say: `เปรียบเทียบ ${FXsay(`[${a}]`)} กับ ${FXsay(`[${b}]`)}`,
      mount(bd, ctx) { const blank = h('span', { class: 'fsign' }, '?');
        /* ใช้ 1/2 เป็นเกณฑ์ (ผู้ใช้ขอ): optional — beside each fraction the child may first mark “น้อยกว่า ½ / เท่ากับ ½ / มากกว่า ½” (not graded, does not take the answer area) */
        const half = (R, side) => { const v = R.n * 2 - R.d, right = v < 0 ? 0 : v === 0 ? 1 : 2, g = h('div', { class: 'fhalf ' + side });
          ['น้อยกว่า ½', 'เท่ากับ ½', 'มากกว่า ½'].forEach((t, k) => g.append(h('button', { class: 'fhalf-b ia', onclick: e => { e.stopPropagation(); if (g.classList.contains('ok')) return;
            if (k === right) { g.classList.add('ok'); e.currentTarget.classList.add('on'); sfx.pop(4); } else { const b = e.currentTarget; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); sfx.no(); } } }, t))); return g; };
        const H = bars ? [half(A, 'l'), half(B, 'r')] : [null, null];
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'fcmp' + (bars ? ' fcmp-h' : '') }, H[0], h('span', { html: litHTML(litParse(a).lit) }), blank, h('span', { html: litHTML(litParse(b).lit) }), H[1]),

          SIGN_OPTS(ctx, rel, o => { blank.textContent = o.value; blank.classList.add('filled'); }, hint || 'ทำตัวส่วนให้เท่ากัน (หรือคูณไขว้) แล้วเทียบตัวเศษ'))); } };
  },
  /* which is bigger / smaller (choices are fractions) */
  fPick({ q, opts, right, hint }) {
    return { prompt: FX(q), say: FXsay(q), mount(bd, ctx) { bd.append(choices(ctx, opts.map(o => ({ value: o, label: o.includes(' ') && /[+−×÷]/.test(o) ? exprHTML(o) : FX(`[${o}]`).replace(/^\[(\d+)\]$/, '$1') })), right, { hint })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt')); } };
  },
  /* order fraction cards */
  fOrder({ list, dir = 'asc' }) {
    const sorted = [...list].sort((x, y) => (dir === 'asc' ? 1 : -1) * rCmp(FR(x), FR(y)));
    return { prompt: `เรียงลำดับจาก<span class="hl">${dir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}</span> <small>(แตะการ์ดตามลำดับ)</small>`, say: `เรียงลำดับจาก${dir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}`,
      mount(bd, ctx) { const sh = shuffle(list.slice()), board = cvnBoard({ cards: sh.map(v => litHTML(litParse(v).lit)), horiz: true, fits: (k, i) => rEq(FR(sh[k]), FR(sorted[i])), // v119: เส้นทางคาราวาน
          onDone: ok => ok ? ctx.check(true) : ctx.check(false, 'ทำตัวส่วนให้เท่ากันก่อน แล้วเทียบตัวเศษ') });
        ctx.onRight = () => board.reveal();
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'dir' }, dir === 'asc' ? 'น้อย' : 'มาก', h('span', { class: 'ar' }), dir === 'asc' ? 'มาก' : 'น้อย'), board)); } };
  },
  /* calculate an expression → fraction answer (vis: 'bars' for + − pictures, 'area' for ×) */
  fCalc({ expr, vis, hint }) {
    const ans = exprEval(expr), toks = exprTokens(expr), lits = toks.filter(k => k.lit).map(k => litR(k.lit));
    const H = hint || (/[÷]/.test(expr) ? 'หารด้วยเศษส่วน = คูณด้วยส่วนกลับของตัวหาร' : /[×]/.test(expr) && !/[+−]/.test(expr) ? 'เศษคูณเศษ ส่วนคูณส่วน (ตัดทอนก่อนได้)' : /[()]/.test(expr) ? 'ทำในวงเล็บก่อน แล้วคูณ หาร ก่อน บวก ลบ' : /[×÷]/.test(expr) ? 'คูณ หาร ก่อน แล้วค่อยบวก ลบ จากซ้ายไปขวา' : 'ทำตัวส่วนให้เท่ากัน แล้วบวกหรือลบตัวเศษ');
    return { prompt: `หาผลลัพธ์ ${exprHTML(expr)}`, say: `หาผลลัพธ์ ${exprSay(expr)}`,
      mount(bd, ctx) { let pic = null;
        if (fNoPic()) { } else if (vis === 'bars' && lits.length === 2) { const L = lcmN(lits[0].d, lits[1].d); pic = h('div', { class: 'colstack', style: { gap: '4px' } }, fracBars(lits[0], { col: 'a', sm: true }), fracBars(lits[1], { col: 'b', sm: true }), h('div', { class: 'cap' }, `ตัวส่วนไม่เท่ากัน → แบ่งเป็น ${L} ส่วนเท่ากันก่อน`)); }
        if (!fNoPic() && vis === 'area' && lits.length === 2 && lits.every(r => r.n <= r.d)) pic = areaModel(lits[0], lits[1]);
        bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, h('div', { class: 'fbig' + (fNoPic() ? ' fq5' : ''), html: exprHTML(expr) + ' <b class="fop">=</b> <span class="fsign">?</span>' }), pic), numOrFrac(ctx, ans, H)));
        ctx.onRight = () => { const q = bd.querySelector('.fbig .fsign'); if (q) { q.outerHTML = rHTML(ans); } }; } };
  },
  /* n/d of a whole number (answer is a whole number) */
  fOf({ f, n, e = 'coin', unit = '' }) {
    const r = FR(f), ans = rMul(r, Rr(n));
    return { prompt: `${FX(`[${f}]`)} ของ ${n} เท่ากับเท่าไร?`, say: `${FXsay(`[${f}]`)} ของ ${n} เท่ากับเท่าไร`,
      mount(bd, ctx) { bd.append(fNoPic() ? h('div', { class: 'fbig' + (fNoPic() ? ' fq5' : ''), html: `${litHTML(litParse(f).lit)} <b class="fop">ของ</b> <span class="num">${n}</span> <b class="fop">=</b> <span class="fsign">?</span>` }) : n <= 40 && n % r.d === 0 ? groupSet(e, n, r.d, r.n) : '', h('div', { class: 'rowstack' }, numOrFrac(ctx, ans, `แบ่ง ${n} เป็น ${r.d} ส่วนเท่า ๆ กัน (${n} ÷ ${r.d}) แล้วเอามา ${r.n} ส่วน`), unit ? h('span', { class: 'cap', style: { fontSize: '20px' } }, unit) : null)); } };
  },
  /* reciprocal */
  fRecip({ f }) {
    const r = FR(f), ans = Rr(r.d, r.n);
    return { prompt: `ส่วนกลับของ ${FX(`[${f}]`).replace(/^\[(\d+)\]$/, '$1')} คือเท่าไร?`, say: `ส่วนกลับของ ${FXsay(`[${f}]`)} คือเท่าไร`,
      mount(bd, ctx) { bd.append(h('div', { class: 'fbig' + (fNoPic() ? ' fq5' : ''), html: `${litHTML(litParse(f).lit)} <b class="fop">×</b> <span class="fsign">?</span> <b class="fop">=</b> <span class="fr"><b class="fw">1</b></span>` }), fracAnswer(ctx, ans, { hint: litParse(f).lit.w ? 'ทำจำนวนคละเป็นเศษเกินก่อน แล้วสลับตัวเศษกับตัวส่วน' : 'สลับตัวเศษกับตัวส่วน' })); } };
  },
  /* word problem: ① choose the number sentence ② answer */
  fStory({ text, expr, wrong = [], unit = '' }) {
    const ans = exprEval(expr), opts = shuffle([expr, ...wrong].slice(0, 3));
    return { prompt: FX(text), say: FXsay(text),
      mount(bd, ctx) { const step2 = h('div', { class: 'colstack', style: { display: 'none' } });
        const ch = choices({ check: (ok, hint) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; sfx.pop(5); ctx.say('ใช่แล้ว! คำนวณหาคำตอบเลย'); } else ctx.check(false, hint); } }, opts.map(o => ({ value: o, label: exprHTML(o) })), expr, { hint: 'อ่านโจทย์ทีละประโยค: รวม/เพิ่ม ใช้บวก · เหลือ/ต่างกัน ใช้ลบ · “ของ” หรือหลายชุดเท่า ๆ กัน ใช้คูณ · แบ่งเท่า ๆ กัน ใช้หาร' });
        ch.querySelectorAll('.opt').forEach(o => o.classList.add('fopt'));
        step2.append(h('div', { class: 'fbig' + (fNoPic() ? ' fq5' : ''), html: exprHTML(expr) + ' <b class="fop">=</b> <span class="fsign">?</span>' }), h('div', { class: 'rowstack' }, numOrFrac(ctx, ans, /[()]/.test(expr) || /[×÷].*[+−]|[+−].*[×÷]/.test(expr) ? 'ทำในวงเล็บก่อน แล้วคูณ หาร ก่อน บวก ลบ' : 'ดูวิธีคิดจากบทเรียน'), unit ? h('span', { class: 'cap', style: { fontSize: '20px' } }, unit) : null));
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'cap' }, '① เลือกประโยคสัญลักษณ์'), ch, step2)); ctx.onRight = () => { const q = step2.querySelector('.fsign'); if (q) q.outerHTML = rHTML(ans); }; } };
  },
  /* which operation do we do first? */
  fFirst({ expr }) {
    const st = exprStep(expr), right = st.part, toks = exprTokens(expr), parts = [];
    for (let j = 1; j < toks.length - 1; j++) if (toks[j].op && '+−×÷'.includes(toks[j].op) && toks[j - 1].lit && toks[j + 1].lit) parts.push(`${tokSrc([toks[j - 1]])} ${toks[j].op} ${tokSrc([toks[j + 1]])}`);
    const opts = shuffle([...new Set([right, ...parts])]).slice(0, 3); if (!opts.includes(right)) opts[0] = right;
    return { prompt: `${exprHTML(expr)}<br>ต้องคำนวณส่วนใด<span class="hl">ก่อน</span>?`, say: 'ต้องคำนวณส่วนใดก่อน',
      mount(bd, ctx) { bd.append(fNoPic() ? h('div', { class: 'fbig fq5', html: exprHTML(expr) }) : '', choices(ctx, shuffle(opts).map(o => ({ value: o, label: exprHTML(o) })), right, { hint: 'ลำดับ: ในวงเล็บก่อน → คูณ หาร (ซ้ายไปขวา) → บวก ลบ (ซ้ายไปขวา)' })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt')); } };
  },
  /* equivalent fraction: a/b = ?/D  (whole-number answer) */
  fEquiv({ a, D }) {
    const r = FR(a), ans = r.n * D / r.d;
    return { prompt: `${FX(`[${a}]`)} = ${fqHTML('<span class="fq5q">?</span>', D)} เติมตัวเศษ`, say: `${FXsay(`[${a}]`)} เท่ากับ เศษเท่าไร ส่วน ${D}`,
      mount(bd, ctx) { if (fNoPic()) { const ab = answerBox(ctx, ans, { hint: `ตัวส่วน ${litParse(a).lit.d} คูณด้วย ${D / litParse(a).lit.d} ได้ ${D} ตัวเศษก็ต้องคูณด้วย ${D / litParse(a).lit.d}` });
          /* the ? box sits in the fraction on the LEFT, the number keys stay on the RIGHT (ผู้ใช้ขอ) */
          const big = h('div', { class: 'fbig fq5 feq-l', html: `${litHTML(litParse(a).lit)} <b class="fop">=</b> ${fqHTML('<span class="feq-hole"></span>', D)}` }), sl = ab.querySelector('.ans-slot');
          if (sl) big.querySelector('.feq-hole').replaceWith(sl); bd.append(h('div', { class: 'feq-row' }, big, ab)); return; }
        bd.append(h('div', { class: 'colstack' }, fracBars(r, { sm: true }), fracBars(r, { d: D, n: ans, col: 'b', sm: true })), answerBox(ctx, ans, { hint: `ตัวส่วน ${litParse(a).lit.d} คูณด้วย ${D / litParse(a).lit.d} ได้ ${D} ตัวเศษก็ต้องคูณด้วยจำนวนเดียวกัน` })); } };
  }
});

/* =========================================================
   TEACHING SIMULATIONS
   ========================================================= */
const fNote = () => h('div', { class: 'word fnote', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } });
/* v242: หน้าลาก — จองที่ 2 บรรทัด ข้อความยาวขึ้นระหว่างลากแล้วรูปไม่กระโดดหนีนิ้ว */
const fNote2 = () => { const o = fNote(); o.classList.add('fn2'); o.style.minHeight = '2.9em'; return o; };
const stepper = (label, get, set, lo, hi, onChange) => { const v = h('b', { class: 'num' }, get());
  const b = (d, t) => h('button', { class: 'btn icon sm ia ' + (d > 0 ? 'primary' : 'danger'), onclick: e => { e.stopPropagation(); const x = Math.max(lo(), Math.min(hi(), get() + d)); if (x === get()) { sfx.no(); return; } set(x); v.textContent = get(); sfx.pop(get() % 8); onChange(); } }, PM(t));
  const el = h('div', { class: 'fstep' }, h('span', null, label), b(-1, '-'), v, b(1, '+')); el.sync = () => v.textContent = get(); return el; };
/* move numerator / denominator, watch the bar against the ½ line */
function simHalf(n0 = 3, d0 = 8) {
  let n = n0, d = d0; const box = h('div'), out = fNote(), big = h('div', { class: 'fbig' });
  const draw = () => { box.innerHTML = ''; box.append(fracBars(Rr(n, d), { d, n, half: true })); const rel = relOf(Rr(n, d), Rr(1, 2));
    big.innerHTML = `${fqHTML(n, d)} <b class="fop">${rel.replace('>', '&gt;').replace('<', '&lt;')}</b> ${fqHTML(1, 2)}`; out.innerHTML = `เศษ × 2 = <b>${2 * n}</b> · ส่วน = <b>${d}</b> → ${2 * n > d ? '<b>มากกว่า</b> ครึ่งหนึ่ง' : 2 * n < d ? '<b>น้อยกว่า</b> ครึ่งหนึ่ง' : '<b>เท่ากับ</b> ครึ่งหนึ่ง'}`; };
  const sn = stepper('ตัวเศษ', () => n, x => n = x, () => 1, () => d, draw), sd = stepper('ตัวส่วน', () => d, x => { d = x; if (n > d) { n = d; sn.sync(); } }, () => 2, () => 12, draw);
  draw(); return h('div', { class: 'colstack' }, big, box, h('div', { class: 'rowstack' }, sn, sd), out);
}
/* two fractions: re-cut both bars into the same number of parts */
function simCommon(a, b) {
  const A = FR(a), B = FR(b), L = lcmN(A.d, B.d), box = h('div', { class: 'colstack', style: { gap: '6px' } }), big = h('div', { class: 'fbig' }), out = fNote();
  const show = cut => { box.innerHTML = ''; box.append(fracBars(A, { col: 'a', d: cut ? L : A.d, sm: true }), fracBars(B, { col: 'b', d: cut ? L : B.d, sm: true }));
    big.innerHTML = cut ? `${fqHTML(A.n * L / A.d, L)} <b class="fop">${relOf(A, B).replace('>', '&gt;').replace('<', '&lt;')}</b> ${fqHTML(B.n * L / B.d, L)}` : `${litHTML(litParse(a).lit)} <b class="fop">?</b> ${litHTML(litParse(b).lit)}`; };
  show(false); out.textContent = 'ตัวส่วนไม่เท่ากัน เทียบตรง ๆ ยาก';
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); btn.remove(); show(true); box.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 400 }); sfx.ok(); out.innerHTML = `แบ่งทั้งสองแถบเป็น <b>${L}</b> ส่วนเท่ากัน แล้วเทียบตัวเศษ`; say(out.textContent, true); } }, icon('sparkle'), 'ทำตัวส่วนให้เท่ากัน');
  return h('div', { class: 'colstack' }, big, box, btn, out);
}
/* place fractions on a number line, then sort */
function simLine(list, max) {
  const marks = list.map((s, i) => ({ r: FR(s), html: litHTML(litParse(s).lit), col: ['a', 'b', 'c', 'd'][i % 4] })), line = fracLine(marks, { max, step: 4 }), out = fNote();
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); btn.remove(); const s = [...list].sort((x, y) => rCmp(FR(x), FR(y))); out.innerHTML = 'น้อย → มาก: ' + s.map(x => litHTML(litParse(x).lit)).join(' <b class="fop">&lt;</b> '); sfx.ok(); say('ยิ่งอยู่ทางขวาบนเส้นจำนวน ยิ่งมีค่ามาก', true); } }, icon('right'), 'เรียงจากเส้นจำนวน');
  return h('div', { class: 'colstack' }, line, btn, out);
}
/* add / subtract with pictures: cut to common denominator, then combine */
function simAddBars(a, b, op = '+') {
  const A = FR(a), B = FR(b), L = lcmN(A.d, B.d), R = op === '+' ? rAdd(A, B) : rSub(A, B), box = h('div', { class: 'colstack', style: { gap: '6px' } }), big = h('div', { class: 'fbig', html: exprHTML(`${a} ${op} ${b}`) + ' <b class="fop">=</b> <span class="fsign">?</span>' }), out = fNote(); let st = 0;
  const show = () => { box.innerHTML = ''; if (st < 2) box.append(fracBars(A, { col: 'a', d: st ? L : A.d, sm: true }), fracBars(B, { col: 'b', d: st ? L : B.d, sm: true }));
    else box.append(fracBars(R, { col: 'c', d: L, n: R.n * L / R.d, sm: true, label: `${op === '+' ? 'รวม' : 'เหลือ'} ${R.n * L / R.d} ส่วนจาก ${L} ส่วน` })); };
  show(); out.textContent = 'ชิ้นส่วนคนละขนาด รวมกันตรง ๆ ไม่ได้';
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; show(); sfx.pop(st * 3);
    if (st === 1) { out.innerHTML = `แบ่งเป็น <b>${L}</b> ส่วนเท่ากัน: ${fqHTML(A.n * L / A.d, L)} ${op} ${fqHTML(B.n * L / B.d, L)}`; btn.lastChild.textContent = op === '+' ? 'รวมกัน' : 'เอาออก'; }
    else { big.querySelector('.fsign').outerHTML = rHTML(R); out.innerHTML = `${fqHTML(A.n * L / A.d + (op === '+' ? 1 : -1) * B.n * L / B.d, L)} = ${rHTML(R)}`; btn.remove(); sfx.ok(); say('ทำตัวส่วนให้เท่ากัน แล้วบวกหรือลบตัวเศษ', true); } } }, icon('sparkle'), h('span', null, 'แบ่งให้เท่ากัน'));
  return h('div', { class: 'colstack' }, big, box, btn, out);
}
/* show an expression worked out one step at a time */
function simSteps(expr, notes = []) {
  let cur = expr, k = 0; const list = h('div', { class: 'colstack fsteps' }, h('div', { class: 'fbig', html: exprHTML(cur) })), out = fNote();
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const st = exprStep(cur); if (!st) return;
    list.append(h('div', { class: 'fstep-row' }, h('span', { class: 'ms-lab' }, `ขั้นที่ ${++k}`), h('span', { html: `<b class="fop">=</b> ${exprHTML(st.src)}` })));
    out.innerHTML = notes[k - 1] || (st.part ? `คำนวณ ${exprHTML(st.part)} = ${rHTML(st.val)}` : ''); cur = st.src; sfx.pop(k);
    if (!exprStep(cur)) { btn.remove(); sfx.ok(); say(`ได้ผลลัพธ์ ${FXsay(`[${rText(exprEval(expr))}]`)}`, true); } } }, icon('right'), 'ทำขั้นต่อไป');
  return h('div', { class: 'colstack' }, list, btn, out);
}
/* n/d of a set: choose how many groups, light some of them */
function simOfSet(total = 12, e = 'strawberry') {
  const divs = range(2, 12).filter(k => total % k === 0); let d = divs[1] || divs[0], n = 1; const box = h('div'), out = fNote(), big = h('div', { class: 'fbig' });
  const draw = () => { box.innerHTML = ''; box.append(groupSet(e, total, d, n)); big.innerHTML = `${fqHTML(n, d)} ของ ${total} = <b class="fw">${total / d * n}</b>`; out.innerHTML = `แบ่ง ${total} เป็น ${d} กลุ่ม กลุ่มละ ${total / d} · เอามา ${n} กลุ่ม = <b>${total / d * n}</b>`; };
  const sd = stepper('จำนวนกลุ่ม (ส่วน)', () => d, x => { const i = divs.indexOf(d), j = Math.max(0, Math.min(divs.length - 1, i + Math.sign(x - d))); d = divs[j]; if (n > d) n = d; sn.sync(); }, () => 2, () => 12, draw);
  const sn = stepper('เอามา (เศษ)', () => n, x => n = x, () => 1, () => d, draw);
  draw(); setTimeout(() => sd.sync(), 0); return h('div', { class: 'colstack' }, big, box, h('div', { class: 'rowstack' }, sd, sn), out);
}
/* whole × fraction as repeated jumps on a number line */
function simJumps(k = 3, f = '3/4') {
  const r = FR(f), tot = rMul(r, Rr(k)), max = Math.ceil(rVal(tot)) + (rVal(tot) % 1 === 0 ? 0 : 0) || 1, out = fNote(), wrap = h('div'); let j = 0;
  const draw = () => { wrap.innerHTML = ''; wrap.append(fracLine(range(1, j).map(i => ({ r: rMul(r, Rr(i)), html: i === j ? rHTML(rMul(r, Rr(i))) : '', col: 'a' })), { max: Math.max(1, max), step: r.d })); };
  draw();
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (j >= k) return; j++; draw(); sfx.pop(j); out.innerHTML = `${j} × ${fqHTML(r.n, r.d)} = ${rHTML(rMul(r, Rr(j)))}`; if (j >= k) { btn.remove(); say(`${k} คูณ ${FXsay(`[${f}]`)} คือบวก ${FXsay(`[${f}]`)} ${k} ครั้ง`, true); } } }, icon('plus'), `กระโดดทีละ ${r.n}/${r.d}`);
  return h('div', { class: 'colstack' }, h('div', { class: 'fbig', html: exprHTML(`${k} × ${f}`) }), wrap, btn, out);
}
/* fraction × fraction on an area model with steppers */
function simArea(a0 = [2, 3], b0 = [3, 4]) {
  let [an, ad] = a0, [bn, bd] = b0; const box = h('div'), out = fNote(), big = h('div', { class: 'fbig' });
  const draw = () => { box.innerHTML = ''; box.append(areaModel({ n: an, d: ad }, { n: bn, d: bd })); const p = Rr(an * bn, ad * bd);
    big.innerHTML = `${fqHTML(an, ad)} <b class="fop">×</b> ${fqHTML(bn, bd)} <b class="fop">=</b> ${fqHTML(an * bn, ad * bd)}${p.d !== ad * bd ? ` <b class="fop">=</b> ${rHTML(p)}` : ''}`; out.innerHTML = `ช่องสีเขียว <b>${an * bn}</b> ช่อง จากทั้งหมด <b>${ad * bd}</b> ช่อง`; };
  const S = [stepper('เศษ ก', () => an, x => an = x, () => 1, () => ad, draw), stepper('ส่วน ก', () => ad, x => { ad = x; if (an > ad) { an = ad; S[0].sync(); } }, () => 2, () => 8, draw), stepper('เศษ ข', () => bn, x => bn = x, () => 1, () => bd, draw), stepper('ส่วน ข', () => bd, x => { bd = x; if (bn > bd) { bn = bd; S[2].sync(); } }, () => 2, () => 8, draw)];
  draw(); return h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, big, box), h('div', { class: 'colstack', style: { gap: '6px' } }, ...S, out));
}
/* flip a card to find the reciprocal */
function simFlip(list = ['3/4', '5', '2 1/3']) {
  const out = fNote(), row = h('div', { class: 'rowstack' });
  list.forEach(f => { const r = FR(f), card = h('button', { class: 'flipcard ia' }, h('span', { class: 'fc-f', html: litHTML(litParse(f).lit) }), h('span', { class: 'fc-b', html: rHTML(Rr(r.d, r.n), false) }));
    card.onclick = e => { e.stopPropagation(); card.classList.toggle('flip'); sfx.page(); if (card.classList.contains('flip')) { out.innerHTML = `${litHTML(litParse(f).lit)} <b class="fop">×</b> ${rHTML(Rr(r.d, r.n), false)} <b class="fop">=</b> 1 → เป็น<b>ส่วนกลับ</b>กัน`; say('คูณกันได้หนึ่ง เป็นส่วนกลับกัน', true); } }; row.append(card); });
  out.textContent = 'แตะการ์ดเพื่อพลิกดูส่วนกลับ'; return h('div', { class: 'colstack' }, row, out);
}
/* how many pieces of size f fit in a length? */
function simMeasure(whole = 3, f = '3/4') {
  const r = FR(f), q = rDiv(Rr(whole), r), W = whole, wrap = h('div', { class: 'fmeasure' }), out = fNote(); let k = 0;
  const bar = h('div', { class: 'fm-bar' }, ...range(1, W).map(i => h('i', { style: { left: (i - 1) / W * 100 + '%', width: 100 / W + '%' } }, h('b', null, i))));
  wrap.append(bar);
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (k >= Math.floor(rVal(q))) return; const p = h('span', { class: 'fm-piece', style: { left: k * rVal(r) / W * 100 + '%', width: rVal(r) / W * 100 + '%' } }, k + 1); bar.append(p); k++; sfx.pop(k);
    out.innerHTML = `วางได้ ${k} ชิ้น`; if (k >= Math.floor(rVal(q))) { btn.remove(); out.innerHTML = `${W} ÷ ${fqHTML(r.n, r.d)} = <b>${rHTML(q)}</b> → เท่ากับ ${W} × ${fqHTML(r.d, r.n)}`; say(`${W} หาร ${FXsay(`[${f}]`)} เท่ากับ ${FXsay(`[${rText(q)}]`)}`, true); } } }, icon('plus'), `วางชิ้นยาว ${r.n}/${r.d}`);
  return h('div', { class: 'colstack' }, h('div', { class: 'fbig', html: exprHTML(`${W} ÷ ${f}`) + ' <b class="fop">=</b> ?' }), wrap, btn, out);
}
/* a fraction shared equally among k */
function simShare(f = '3/4', k = 3) {
  const r = FR(f), ans = rDiv(r, Rr(k)), out = fNote(), box = h('div'); let st = 0;
  box.append(fracBars(r, { sm: false }));
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; box.innerHTML = ''; box.append(fracBars(ans, { d: r.d * k, n: ans.n * r.d * k / ans.d, col: 'c' })); out.innerHTML = `แบ่ง ${fqHTML(r.n, r.d)} เป็น ${k} ส่วนเท่ากัน ได้ส่วนละ ${rHTML(ans)} = ${fqHTML(r.n, r.d)} × ${fqHTML(1, k)}`; btn.remove(); sfx.ok(); say('หารด้วยจำนวนนับ คือคูณด้วยส่วนกลับของจำนวนนับนั้น', true); } }, icon('sparkle'), `แบ่งให้ ${k} คน`);
  return h('div', { class: 'colstack' }, h('div', { class: 'fbig', html: exprHTML(`${f} ÷ ${k}`) }), box, btn, out);
}
/* the 4 steps of solving a word problem, revealed one by one */
function simStory(text, steps, expr) {
  const list = h('div', { class: 'colstack fstory' }), out = fNote(); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, body] = steps[k]; list.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: FX(body) }))); sfx.pop(k); k++;
    if (k >= steps.length) { btn.remove(); out.innerHTML = expr ? `${exprHTML(expr)} <b class="fop">=</b> ${rHTML(exprEval(expr))}` : ''; sfx.ok(); } } }, icon('right'), 'ขั้นตอนต่อไป');
  return h('div', { class: 'colstack' }, h('div', { class: 'storybox', html: FX(text) }), list, btn, out);
}
/* mixed numbers: wholes + parts */
function simMixed(a, b, op = '+') {
  const A = FR(a), B = FR(b), R = op === '+' ? rAdd(A, B) : rSub(A, B), out = fNote(), box = h('div', { class: 'colstack', style: { gap: '6px' } });
  box.append(fracBars(A, { col: 'a', sm: true, label: litHTML(litParse(a).lit) }), fracBars(B, { col: 'b', sm: true, label: litHTML(litParse(b).lit) }));
  const steps = [`ทำเป็นเศษเกิน: ${rHTML(A, false)} ${op} ${rHTML(B, false)}`, `ทำตัวส่วนให้เท่ากัน (${lcmN(A.d, B.d)}): ${fqHTML(A.n * lcmN(A.d, B.d) / A.d, lcmN(A.d, B.d))} ${op} ${fqHTML(B.n * lcmN(A.d, B.d) / B.d, lcmN(A.d, B.d))}`, `${op === '+' ? 'รวม' : 'ลบ'}ตัวเศษ แล้วทำให้อยู่ในรูปอย่างง่าย = <b>${rHTML(R)}</b>`]; let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); out.innerHTML = steps[k]; k++; sfx.pop(k); if (k >= steps.length) { btn.remove(); sfx.ok(); say(`ได้ ${FXsay(`[${rText(R)}]`)}`, true); } } }, icon('right'), 'ทีละขั้น');
  return h('div', { class: 'colstack' }, h('div', { class: 'fbig', html: exprHTML(`${a} ${op} ${b}`) }), box, btn, out);
}

/* =========================================================
   DATA (workbook ป.5 หน่วยที่ 1 + ข้อสอบ) and LEVELS
   ========================================================= */
const P5_HALF = ['3/8', '5/9', '4/8', '7/12', '6/10', '2/7', '5/6', '4/11', '9/16', '3/6', '7/15', '8/13'];
const P5_BYHALF = [['3/7', '5/8'], ['7/12', '2/5'], ['4/9', '6/10'], ['5/11', '4/7'], ['3/8', '5/6'], ['9/14', '2/9'], ['1/3', '4/5']];
const P5_CMP = [['5/12', '3/8'], ['11/21', '4/7'], ['11/7', '39/21'], ['15/16', '9/4'], ['7/9', '11/18'], ['3/4', '5/6'], ['4/5', '12/15'], ['5/6', '7/9']];
const P5_CMPM = [['8/9', '1 2/3'], ['1 3/7', '16/14'], ['1 3/20', '1 1/4'], ['9/5', '1 7/10'], ['1 3/24', '3 1/6'], ['3 1/2', '14/4'], ['1 5/6', '7/12'], ['7/5', '1 8/20'], ['1 4/15', '2 1/5'], ['3 4/5', '1 7/30'], ['1 12/15', '1 4/5']];
const P5_ORD = [[['5/11', '8/11', '2/11'], 'desc'], [['9/15', '11/15', '4/15'], 'asc'], [['13/17', '11/17', '15/17'], 'asc'], [['7/13', '11/13', '2/13'], 'desc'], [['3/4', '5/6', '2/3'], 'asc'], [['5/8', '1/4', '1/2'], 'desc']];
const P5_ORDM = [[['4/18', '1 1/6', '5/9'], 'asc'], [['2 1/3', '7/6', '1 5/12'], 'asc'], [['2 1/4', '13/8', '15/16'], 'asc'], [['2 4/15', '3 4/5', '1 2/3'], 'asc'], [['1 4/15', '3 2/3', '2 1/5'], 'desc'], [['8/3', '1 5/6', '25/9'], 'desc'], [['2 3/4', '2 5/12', '7/8'], 'desc'], [['1 6/24', '2 4/8', '3 1/3'], 'desc'], [['2 5/9', '1 4/18', '2 1/3'], 'desc']];
const P5_ADDP = ['1/2 + 1/4', '2/3 + 1/6', '1/3 + 1/2', '3/4 − 1/2', '5/6 − 1/3', '2/5 + 3/10', '7/8 − 1/4'];
const P5_ADD = ['4/9 + 2/3', '1/2 + 11/6', '7/12 + 2/3', '3/8 + 3/2', '5/18 − 1/6', '17/21 − 3/7', '5/4 − 5/12', '7/15 + 2/5', '5/6 + 1/18', '4/7 − 4/14', '13/16 − 3/4'];
const P5_MIX = ['8 2/5 − 3 6/10', '2 5/7 + 1 9/14', '1 5/9 − 1 5/27', '3 7/20 + 2 9/10', '2 7/9 + 1 2/3', '4 1/6 − 2 3/4'];
const P5_MIXF = ['5 3/4 − 45/8', '11/5 − 1 2/25', '3/12 + 2 3/4', '19/8 − 1 3/4', '3 3/15 − 9/5', '5/8 + 4 1/2'];
const P5_OF = [['2/3', 12, 'apple'], ['3/4', 20, 'coin'], ['2/5', 15, 'strawberry'], ['5/6', 18, 'cookie'], ['3/8', 24, 'egg'], ['4/7', 21, 'flower']];
const P5_WXF = ['2 × 3/5', '14 × 1/6', '16 × 3/4', '21 × 8/3', '14 × 7/10', '4 × 2/9'];
const P5_FXW = ['5/8 × 12', '5/9 × 6', '2/7 × 50', '5/12 × 5', '8/9 × 6', '3/10 × 15'];
const P5_FXF = ['8/10 × 5/6', '4/7 × 3/5', '2/3 × 5/8', '6/10 × 15/24', '80/45 × 36/48', '22/5 × 20/121', '13/24 × 6/39', '155/29 × 3/31', '6/14 × 7/9', '5/12 × 16/15'];
const P5_MXW = ['12 × 2 6/10', '45 × 1 5/9', '15 × 3 4/10', '10 × 2 3/5', '3 1/8 × 4', '15 × 18 2/3'];
const P5_MXF = ['16/3 × 1 2/5', '4/15 × 1 3/40', '11/12 × 3 1/2', '4 8/10 × 70/12', '2/5 × 3 3/4', '4 5/7 × 1 2/3', '1 9/10 × 1 3/12', '2 1/10 × 3 4/7', '3/8 × 2 2/3', '1 1/4 × 2 2/5', '5/6 × 2 1/10']; /* v205: +3 (สองข้อที่เป็นตัวอย่างในหน้าเรียนไม่ถูกถามในเกม) */
const P5_REC = ['2/3', '5', '7/4', '1/8', '2 1/3', '9/11', '1 4/5', '12'];
const P5_WDF = ['6 ÷ 3/4', '15 ÷ 5/18', '4 ÷ 2/3', '10 ÷ 5/6', '3 ÷ 1/4', '12 ÷ 4/9'];
const P5_FDW = ['4/9 ÷ 16', '21/22 ÷ 7', '9/11 ÷ 6', '2/3 ÷ 4', '9/10 ÷ 3', '8/15 ÷ 12'];
const P5_FDF = ['3/7 ÷ 3/5', '7/2 ÷ 1/2', '5/8 ÷ 7/10', '2/9 ÷ 12/21', '4/5 ÷ 8/10', '9/5 ÷ 63/25', '7/6 ÷ 14/3', '3/5 ÷ 7/9', '3/15 ÷ 21/25', '27/35 ÷ 9/5'];
const P5_MXD = ['6 ÷ 9 3/4', '2/3 ÷ 1 7/9', '1 3/11 ÷ 5 1/2', '48 ÷ 2 2/3', '9/10 ÷ 5 2/5', '4 1/3 ÷ 3 2/8', '3 3/4 ÷ 1 8/12', '11/2 ÷ 3 3/6', '21 ÷ 2 1/3', '2 9/10 ÷ 3'];
const P5_PAR = ['1 2/15 − (3/10 ÷ 1/2)', '(7 2/3 + 3 1/6) ÷ 5/10', '7 × (3/5 − 1/10)', '(2 1/2 − 1/4) × 4', '(4/5 + 3/10) ÷ 4/5', '9 × (3/4 − 5/8)', '(1 3/4 × 1 1/3) ÷ 5/6', '11 ÷ (4 4/5 + 3/20)', '12 × (1/6 + 1 1/24)', '(10/12 ÷ 5) × 3 1/5'];
const P5_NOPAR = ['1 2/15 − 3/10 ÷ 1/2', '7 × 3/5 − 1/10', '2 1/2 − 1/4 × 4', '4/5 + 3/10 ÷ 4/5', '12 × 1/6 + 1 1/24', '3/4 ÷ 3/8 × 1/2', '5/6 − 1/3 × 1/2', '2 + 3/4 × 2/3'];
const SS = (text, expr, wrong, unit) => ({ text, expr, wrong, unit });
const P5_S_ADD = [SS('ฟ้าซื้อมังคุด [2 1/3] กิโลกรัม ซื้อองุ่น [3 5/6] กิโลกรัม ฟ้าซื้อผลไม้รวมกี่กิโลกรัม', '2 1/3 + 3 5/6', ['3 5/6 − 2 1/3', '2 1/3 × 3 5/6'], 'กิโลกรัม'),
  SS('ร้านมีถั่วเขียว [15 3/4] กิโลกรัม ขายไป [7 5/8] กิโลกรัม ร้านเหลือถั่วเขียวกี่กิโลกรัม', '15 3/4 − 7 5/8', ['15 3/4 + 7 5/8', '15 3/4 ÷ 7 5/8'], 'กิโลกรัม'),
  SS('กรองแก้วมีริบบิ้น [5/6] เมตร ตัดไปทำโบ [1/3] เมตร เหลือริบบิ้นเท่าใด', '5/6 − 1/3', ['5/6 + 1/3', '5/6 × 1/3'], 'เมตร'),
  SS('ทับทิมซ้อมเต้นวันแรก [3/5] ชั่วโมง วันที่สอง [3/10] ชั่วโมง รวมสองวันซ้อมกี่ชั่วโมง', '3/5 + 3/10', ['3/5 − 3/10', '3/5 × 3/10'], 'ชั่วโมง'),
  SS('นิดอ่านหนังสือวันแรก [2/7] ของเล่ม วันที่สอง [9/14] ของเล่ม รวมสองวันอ่านไปเศษส่วนเท่าใดของเล่ม', '2/7 + 9/14', ['9/14 − 2/7', '2/7 × 9/14'], ''),
  SS('สวนแห่งหนึ่งปลูกเงาะ [36/40] ของพื้นที่ ที่เหลือปลูกมังคุด ปลูกมังคุดเป็นเศษส่วนเท่าใดของพื้นที่', '1 − 36/40', ['1 + 36/40', '36/40 × 1'], '')];
const P5_S_MUL = [SS('เชือกยาว [20 2/5] เมตร ตัดเป็นเส้นละ [3/5] เมตร จะได้กี่เส้น', '20 2/5 ÷ 3/5', ['20 2/5 × 3/5', '20 2/5 − 3/5'], 'เส้น'),
  SS('วันใหม่มีเงิน 480 บาท ให้น้อง [3/8] ของเงินที่มี วันใหม่ให้เงินน้องกี่บาท', '3/8 × 480', ['480 ÷ 3/8', '480 − 3/8'], 'บาท'),
  SS('แม่มีเงิน 200 บาท ให้ลูกคนละ [1/5] ของเงินที่มี ลูกแต่ละคนได้กี่บาท', '1/5 × 200', ['200 ÷ 1/5', '200 − 1/5'], 'บาท'),
  SS('ยายมีที่นา [12 1/4] ไร่ แบ่งให้ลูก 3 คนเท่า ๆ กัน ลูกได้คนละกี่ไร่', '12 1/4 ÷ 3', ['12 1/4 × 3', '12 1/4 − 3'], 'ไร่'),
  SS('ร้านมีผ้า 18 เมตร ตัดเป็นผืนละ [3/4] เมตร ได้กี่ผืน', '18 ÷ 3/4', ['18 × 3/4', '18 − 3/4'], 'ผืน')];
const P5_S_ADD2 = [SS('ถังน้ำจุ 20 ลิตร มีน้ำอยู่ [6 6/7] ลิตร ต้องเติมอีกกี่ลิตรจึงจะเต็ม', '20 − 6 6/7', ['20 + 6 6/7', '6 6/7 × 20'], 'ลิตร'),
  SS('ผ้าผืนหนึ่งยาว [8 1/2] เมตร ตัดไปใช้ [5 4/10] เมตร เหลือผ้ากี่เมตร', '8 1/2 − 5 4/10', ['8 1/2 + 5 4/10', '8 1/2 × 5 4/10'], 'เมตร'),
  SS('วันแรกเดินได้ [2 3/4] กิโลเมตร วันที่สองเดินได้ [3 5/6] กิโลเมตร รวมกี่กิโลเมตร', '2 3/4 + 3 5/6', ['3 5/6 − 2 3/4', '2 3/4 × 3 5/6'], 'กิโลเมตร'),
  SS('ขวดใหญ่มีนม [4 1/3] ลิตร ขวดเล็กมีนมน้อยกว่าขวดใหญ่ [1 5/6] ลิตร ขวดเล็กมีนมกี่ลิตร', '4 1/3 − 1 5/6', ['4 1/3 + 1 5/6', '4 1/3 × 1 5/6'], 'ลิตร')];
const P5_S_MUL2 = [SS('มีน้ำมัน 6 แกลลอน แกลลอนละ [5 1/3] ลิตร แบ่งใส่ขวด ขวดละ [1 3/5] ลิตร ได้กี่ขวด', '6 × 5 1/3 ÷ 1 3/5', ['6 × 5 1/3 × 1 3/5', '6 + 5 1/3 ÷ 1 3/5'], 'ขวด'),
  SS('นักเรียน 760 คน เป็นนักเรียนชาย [2/5] ของทั้งหมด นักเรียนชายมีกี่คน', '2/5 × 760', ['760 ÷ 2/5', '760 − 2/5'], 'คน'),
  SS('น้ำหวาน [16 1/2] ลิตร แบ่งใส่ขวด ขวดละ [1 1/2] ลิตร ได้กี่ขวด', '16 1/2 ÷ 1 1/2', ['16 1/2 × 1 1/2', '16 1/2 − 1 1/2'], 'ขวด'),
  SS('ถุงหนึ่งหนัก [2 1/4] กิโลกรัม 8 ถุงหนักกี่กิโลกรัม', '8 × 2 1/4', ['8 ÷ 2 1/4', '8 + 2 1/4'], 'กิโลกรัม')];
const P5_S_MIX1 = [SS('โรงเรียนมีนักเรียน 760 คน เป็นชาย [2/5] ของทั้งหมด มีนักเรียนหญิงกี่คน', '760 − 2/5 × 760', ['2/5 × 760', '760 + 2/5 × 760'], 'คน'),
  SS('ต้นมีเงิน 40000 บาท ฝนมีเงิน [2/5] ของต้น สองคนมีเงินรวมกันกี่บาท', '40000 + 2/5 × 40000', ['2/5 × 40000', '40000 − 2/5 × 40000'], 'บาท'),
  SS('อิงฟ้ามีเงิน 1000 บาท ซื้อเสื้อ [2/5] ของเงินที่มี แล้วซื้อกระโปรง [2/5] ของเงินที่เหลือ ซื้อของไปทั้งหมดกี่บาท', '2/5 × 1000 + 2/5 × (1000 − 2/5 × 1000)', ['2/5 × 1000 + 2/5 × 1000', '1000 − 2/5 × 1000'], 'บาท'),
  SS('ยายให้ที่ดินหลานคนโต [3/8] ไร่ หลานคนเล็กได้น้อยกว่าคนโต [1/4] ไร่ ยายแบ่งที่ดินให้หลานทั้งหมดกี่ไร่', '3/8 + (3/8 − 1/4)', ['3/8 + 1/4', '3/8 − 1/4'], 'ไร่'),
  SS('จ๊อบมีเงิน 540 บาท แบ่งให้เจี๊ยบ [1/3] ของเงินที่มี จ๊อบเหลือเงินกี่บาท', '540 − 1/3 × 540', ['1/3 × 540', '540 ÷ 1/3'], 'บาท')];
const P5_S_MIX2 = [SS('แม่ซื้อส้ม [1 1/2] กิโลกรัม กิโลกรัมละ 30 บาท และซื้ออองุ่น [2 1/5] กิโลกรัม กิโลกรัมละ 120 บาท แม่จ่ายเงินทั้งหมดกี่บาท', '1 1/2 × 30 + 2 1/5 × 120', ['(1 1/2 + 2 1/5) × 30', '1 1/2 × 120 + 2 1/5 × 30'], 'บาท'),
  SS('ซื้อแป้งข้าวเจ้า [3/4] กิโลกรัม กิโลกรัมละ 48 บาท แป้งข้าวเหนียว [5/6] กิโลกรัม กิโลกรัมละ 24 บาท จ่ายทั้งหมดกี่บาท', '3/4 × 48 + 5/6 × 24', ['3/4 × 24 + 5/6 × 48', '(3/4 + 5/6) × 48'], 'บาท'),
  SS('แม่ค้ามีมะม่วง 1800 ผล ขายครั้งแรก [2/5] ของทั้งหมด ครั้งที่สองขาย [2/9] ของที่เหลือ เหลือมะม่วงกี่ผล', '1800 − 2/5 × 1800 − 2/9 × (1800 − 2/5 × 1800)', ['1800 − 2/5 × 1800 − 2/9 × 1800', '1800 − 2/5 × 1800'], 'ผล'),
  SS('ลุงมีที่ดิน [41/3] ไร่ ให้ลูก [11/3] ไร่ ที่เหลือขายไร่ละ 50000 บาท ลุงได้เงินกี่บาท', '(41/3 − 11/3) × 50000', ['41/3 − 11/3 × 50000', '(41/3 + 11/3) × 50000'], 'บาท'),
  SS('พุดซื้อส้ม [3 1/2] กิโลกรัม กิโลกรัมละ 28 บาท ซื้อมังคุด [1/2] กิโลกรัม กิโลกรัมละ 30 บาท พุดจ่ายทั้งหมดกี่บาท', '3 1/2 × 28 + 1/2 × 30', ['(3 1/2 + 1/2) × 28', '3 1/2 × 30 + 1/2 × 28'], 'บาท')];
const P5_S_SHOW = [SS('มีน้ำองุ่น [7 3/7] ลิตร เติมน้ำเชื่อม [8/14] ลิตร แล้วแบ่งใส่ขวด ขวดละ [1/4] ลิตร ได้กี่ขวด', '(7 3/7 + 8/14) ÷ 1/4', ['7 3/7 + 8/14 ÷ 1/4', '(7 3/7 − 8/14) ÷ 1/4'], 'ขวด'),
  SS('จงหาค่าของ [2 2/3] + [2/6] + [1 7/12]', '2 2/3 + 2/6 + 1 7/12', ['2 2/3 + 2/6 − 1 7/12', '2 2/3 × 2/6 + 1 7/12'], ''),
  SS('จำนวนหนึ่งเท่ากับ [7/11] ของ 55 จงหาว่า 10 เท่าของจำนวนนี้เท่ากับเท่าใด', '10 × (7/11 × 55)', ['7/11 × 55 + 10', '10 × 7/11 + 55'], ''),
  SS('จงหาค่าของ [9/8] × [10/21] × [14/25]', '9/8 × 10/21 × 14/25', ['9/8 × 10/21 ÷ 14/25', '9/8 + 10/21 × 14/25'], ''),
  SS('บอลมีเงิน 400 บาท บาสมีเงิน [5/8] ของบอล โบ๊ทมีเงิน [3/5] ของบาส ทั้ง 3 คนมีเงินรวมกันกี่บาท', '400 + 5/8 × 400 + 3/5 × (5/8 × 400)', ['400 + 5/8 × 400 + 3/5 × 400', '400 × 5/8 × 3/5'], 'บาท')];
/* v134 (ผู้ใช้ขอ: ไล่ทุกเกม — เกมต้องมีอย่างน้อย 8 ข้อ) — โจทย์แต่งใหม่เพิ่มในแต่ละชุด */
P5_S_ADD.push(SS('น้ำหวานขวดหนึ่งมี [3/4] ลิตร ดื่มไป [1/6] ลิตร เหลือน้ำหวานกี่ลิตร', '3/4 − 1/6', ['3/4 + 1/6', '3/4 × 1/6'], 'ลิตร'),
  SS('ปลายวิ่งรอบแรก [1 2/5] กิโลเมตร รอบที่สอง [2 3/10] กิโลเมตร ปลายวิ่งรวมกี่กิโลเมตร', '1 2/5 + 2 3/10', ['2 3/10 − 1 2/5', '1 2/5 × 2 3/10'], 'กิโลเมตร'),
  SS('แม่มีแป้ง [4 1/2] กิโลกรัม ใช้ทำขนม [1 3/4] กิโลกรัม เหลือแป้งกี่กิโลกรัม', '4 1/2 − 1 3/4', ['4 1/2 + 1 3/4', '4 1/2 ÷ 1 3/4'], 'กิโลกรัม'));
P5_S_MUL.push(SS('ไม้ยาว [7 1/2] เมตร ตัดเป็นท่อนละ [3/4] เมตร ได้กี่ท่อน', '7 1/2 ÷ 3/4', ['7 1/2 × 3/4', '7 1/2 − 3/4'], 'ท่อน'),
  SS('สวนมีต้นไม้ 360 ต้น เป็นต้นมะม่วง [5/9] ของทั้งหมด มีต้นมะม่วงกี่ต้น', '5/9 × 360', ['360 ÷ 5/9', '360 − 5/9'], 'ต้น'),
  SS('น้ำผึ้ง [4 1/2] ลิตร แบ่งใส่ขวด 6 ขวดเท่า ๆ กัน ได้ขวดละกี่ลิตร', '4 1/2 ÷ 6', ['4 1/2 × 6', '4 1/2 − 6'], 'ลิตร'));
P5_S_ADD2.push(SS('ปุ๋ยกระสอบหนึ่งหนัก 25 กิโลกรัม ใช้ไป [12 3/8] กิโลกรัม เหลือปุ๋ยกี่กิโลกรัม', '25 − 12 3/8', ['25 + 12 3/8', '12 3/8 × 25'], 'กิโลกรัม'),
  SS('กล่องแรกหนัก [3 2/3] กิโลกรัม กล่องที่สองหนักกว่ากล่องแรก [1 1/4] กิโลกรัม กล่องที่สองหนักกี่กิโลกรัม', '3 2/3 + 1 1/4', ['3 2/3 − 1 1/4', '3 2/3 × 1 1/4'], 'กิโลกรัม'),
  SS('ถนนยาว [10 1/5] กิโลเมตร ซ่อมไปแล้ว [6 7/10] กิโลเมตร เหลือส่วนที่ยังไม่ได้ซ่อมกี่กิโลเมตร', '10 1/5 − 6 7/10', ['10 1/5 + 6 7/10', '10 1/5 × 6 7/10'], 'กิโลเมตร'),
  SS('ภูมิดื่มน้ำตอนเช้า [1 1/4] ลิตร ตอนบ่าย [1 5/8] ลิตร ภูมิดื่มน้ำรวมกี่ลิตร', '1 1/4 + 1 5/8', ['1 5/8 − 1 1/4', '1 1/4 × 1 5/8'], 'ลิตร'));
P5_S_MUL2.push(SS('ผ้า 1 ผืนยาว [2 2/3] เมตร 9 ผืนยาวกี่เมตร', '9 × 2 2/3', ['9 ÷ 2 2/3', '9 + 2 2/3'], 'เมตร'),
  SS('เชือกยาว [13 1/2] เมตร ตัดเป็นเส้นละ [2 1/4] เมตร ได้กี่เส้น', '13 1/2 ÷ 2 1/4', ['13 1/2 × 2 1/4', '13 1/2 − 2 1/4'], 'เส้น'),
  SS('ชาวนามีข้าว [22 1/2] กระสอบ ขายไป [2/3] ของทั้งหมด ขายข้าวไปกี่กระสอบ', '2/3 × 22 1/2', ['22 1/2 ÷ 2/3', '22 1/2 − 2/3'], 'กระสอบ'),
  SS('น้ำมัน [5 1/4] ลิตร แบ่งใส่ขวด 7 ขวดเท่า ๆ กัน ได้ขวดละกี่ลิตร', '5 1/4 ÷ 7', ['5 1/4 × 7', '5 1/4 − 7'], 'ลิตร'));
P5_S_MIX1.push(SS('ห้องสมุดมีหนังสือ 600 เล่ม เป็นหนังสือนิทาน [3/10] ของทั้งหมด เป็นหนังสืออื่นกี่เล่ม', '600 − 3/10 × 600', ['3/10 × 600', '600 + 3/10 × 600'], 'เล่ม'),
  SS('พี่มีลูกแก้ว 120 ลูก น้องมีลูกแก้ว [3/4] ของพี่ สองคนมีลูกแก้วรวมกันกี่ลูก', '120 + 3/4 × 120', ['3/4 × 120', '120 − 3/4 × 120'], 'ลูก'),
  SS('แม่ซื้อเนื้อหมู [1 1/2] กิโลกรัม ซื้อเนื้อไก่น้อยกว่าเนื้อหมู [3/4] กิโลกรัม แม่ซื้อเนื้อทั้งสองอย่างรวมกี่กิโลกรัม', '1 1/2 + (1 1/2 − 3/4)', ['1 1/2 + 3/4', '1 1/2 − 3/4'], 'กิโลกรัม'));
P5_S_MIX2.push(SS('ซื้อกุ้ง [1 1/4] กิโลกรัม กิโลกรัมละ 320 บาท และปลาหมึก [3/4] กิโลกรัม กิโลกรัมละ 200 บาท จ่ายทั้งหมดกี่บาท', '1 1/4 × 320 + 3/4 × 200', ['(1 1/4 + 3/4) × 320', '1 1/4 × 200 + 3/4 × 320'], 'บาท'),
  SS('ป้ามีเงิน 900 บาท ซื้อผ้า [2 1/2] เมตร เมตรละ 120 บาท ป้าเหลือเงินกี่บาท', '900 − 2 1/2 × 120', ['900 − 2 1/2 + 120', '2 1/2 × 120'], 'บาท'),
  SS('ซื้อข้าวสาร [4 1/2] กิโลกรัม กิโลกรัมละ 32 บาท และน้ำตาล [1 1/2] กิโลกรัม กิโลกรัมละ 26 บาท จ่ายทั้งหมดกี่บาท', '4 1/2 × 32 + 1 1/2 × 26', ['(4 1/2 + 1 1/2) × 32', '4 1/2 × 26 + 1 1/2 × 32'], 'บาท'));
P5_S_SHOW.push(SS('มีน้ำส้ม [5 1/2] ลิตร เติมน้ำเปล่า [1 1/2] ลิตร แล้วแบ่งใส่แก้ว แก้วละ [1/4] ลิตร ได้กี่แก้ว', '(5 1/2 + 1 1/2) ÷ 1/4', ['5 1/2 + 1 1/2 ÷ 1/4', '(5 1/2 − 1 1/2) ÷ 1/4'], 'แก้ว'),
  SS('จงหาค่าของ [3 1/4] − [5/6] + [1 1/3]', '3 1/4 − 5/6 + 1 1/3', ['3 1/4 + 5/6 + 1 1/3', '3 1/4 − 5/6 × 1 1/3'], ''),
  SS('จำนวนหนึ่งเท่ากับ [3/8] ของ 64 จงหาว่า 5 เท่าของจำนวนนี้เท่ากับเท่าใด', '5 × (3/8 × 64)', ['3/8 × 64 + 5', '5 × 3/8 + 64'], ''));
const pkF = (list, k) => shuffle(list).slice(0, k);
const TONES5 = ['lilac', 'sky', 'mint', 'orange', 'coral', 'yellow'];
/* ---------- v99 คูณไขว้: each tap draws one cross and shows its product; the last tap compares (ผู้ใช้ขอ) ---------- */
function simCross(a, b) {
  const pr = t => { const [n, d] = t.split('/').map(Number); return { n, d }; }, A = pr(a), B = pr(b); /* keep 3/6 as written (FR would reduce it) */ let k = 0; const wait = h6wait(), fig = h('div', { class: 'fcross' }), note = h('ul', { class: 's9-notes fcross-n' });
  const X1 = 150, X2 = 370, sgn = A.n * B.d > B.n * A.d ? '&gt;' : A.n * B.d < B.n * A.d ? '&lt;' : '=';
  const draw = () => { const p = A.n * B.d, q = B.n * A.d, c1 = k >= 1, c2 = k >= 2, c3 = k >= 3;
    fig.innerHTML = `<svg viewBox="0 0 520 290" class="fcross-svg" aria-hidden="true">
      <defs><marker id="fxa1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#E5487A"/></marker><marker id="fxa2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#3B7BE0"/></marker></defs>
      ${c1 ? `<path d="M${X1 + 22} 74 L${X2 - 24} 140" stroke="#E5487A" stroke-width="5" stroke-linecap="round" marker-end="url(#fxa1)" class="fx-ln"/>` : ''}
      ${c2 ? `<path d="M${X2 - 22} 74 L${X1 + 24} 140" stroke="#3B7BE0" stroke-width="5" stroke-linecap="round" marker-end="url(#fxa2)" class="fx-ln"/>` : ''}
      <g font-family="inherit" font-weight="800" font-size="56" text-anchor="middle">
        <text x="${X1}" y="80" fill="${c1 ? '#E5487A' : '#2B2550'}">${A.n}</text><rect x="${X1 - 40}" y="98" width="80" height="6" rx="3" fill="#2B2550"/><text x="${X1}" y="160" fill="${c2 ? '#3B7BE0' : '#2B2550'}">${A.d}</text>
        <text x="${X2}" y="80" fill="${c2 ? '#3B7BE0' : '#2B2550'}">${B.n}</text><rect x="${X2 - 40}" y="98" width="80" height="6" rx="3" fill="#2B2550"/><text x="${X2}" y="160" fill="${c1 ? '#E5487A' : '#2B2550'}">${B.d}</text>
        <text x="260" y="120" font-size="54" fill="${c3 ? '#E5487A' : '#B9B4D3'}">${c3 ? sgn : '?'}</text></g>
      <g font-family="inherit" font-weight="800" font-size="30" text-anchor="middle">
        ${c1 ? `<text x="${X1}" y="232" fill="#E5487A" class="fx-pop">${A.n} × ${B.d} = ${p}</text>` : ''}
        ${c2 ? `<text x="${X2}" y="232" fill="#3B7BE0" class="fx-pop">${B.n} × ${A.d} = ${q}</text>` : ''}
        ${c3 ? `<text x="260" y="276" font-size="28" fill="#2B2550" class="fx-pop">${p} ${sgn} ${q}</text>` : ''}</g></svg>`; };
  const L = [() => `<b style="color:#E5487A">ไขว้ที่ 1</b>: ตัวเศษซ้าย × ตัวส่วนขวา = ${A.n} × ${B.d} = <b>${A.n * B.d}</b> (เป็นของ${FX(`[${a}]`)})`,
    () => `<b style="color:#3B7BE0">ไขว้ที่ 2</b>: ตัวเศษขวา × ตัวส่วนซ้าย = ${B.n} × ${A.d} = <b>${B.n * A.d}</b> (เป็นของ${FX(`[${b}]`)})`,
    () => `<b>เทียบ</b>: ${A.n * B.d} ${sgn} ${B.n * A.d} → ${FX(`[${a}]`)} ${sgn} ${FX(`[${b}]`)} — ฝั่งที่ได้ผลคูณมากกว่าคือเศษส่วนที่มากกว่า`];
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (k >= 3) return; note.append(h('li', { html: L[k]() })); k++; sfx.pop(k + 1); draw();
    if (k >= 3) { btn.remove(); sfx.ok(); teachDone(wait); } else btn.lastChild.textContent = ['คูณไขว้ครั้งที่ 1', 'คูณไขว้ครั้งที่ 2', 'เปรียบเทียบ'][k]; } }, icon('right'), h('span', null, 'คูณไขว้ครั้งที่ 1'));
  draw(); return h('div', { class: 'pzs s9s' }, h('div', { class: 'pzs-l' }, fig), h('div', { class: 'pzs-r' }, h('div', { class: 'colstack s9-r' }, wait, btn, note)));
}
/* ---------- v99 ทีละขั้น แบบทำในกระดาษ: each tap writes the next line UNDER the previous one ("= …"), the earlier work stays on the page (ผู้ใช้ขอ: ล้างแบบเดิม) ---------- */
function fWalk(steps, sayEnd) {
  let k = 0; const wait = h6wait(), paper = h('div', { class: 'fw-paper' });
  const row = i => { const [e, c] = steps[i]; return h('div', { class: 'fw-row now' + (i ? '' : ' fw-q') }, h('span', { class: 'fw-eq' + (i ? '' : ' fw-qtag') }, i ? '=' : 'โจทย์'), h('div', { class: 'fw-ex', html: FX(e) }), h('div', { class: 'fw-note', html: c ? FX(c) : '' })); };
  const add = i => { paper.querySelectorAll('.fw-row.now').forEach(r => r.classList.remove('now')); paper.append(row(i)); };
  const btn = h('button', { class: 'btn info ia fw-next', onclick: e => { e.stopPropagation(); if (k >= steps.length - 1) return; k++; sfx.pop(k + 1); add(k); say(String(steps[k][1] || '').replace(/\[(\d+) (\d+)\/(\d+)\]/g, '$1 เศษ $2 ส่วน $3').replace(/\[(\d+)\/(\d+)\]/g, 'เศษ $1 ส่วน $2').replace(/<[^>]+>/g, ''), true);
    if (k >= steps.length - 1) { btn.remove(); paper.lastElementChild.classList.add('last'); setTimeout(() => { sfx.ok(); if (sayEnd) say(sayEnd, true); teachDone(wait); }, 300); } else btn.lastChild.textContent = `ขั้นต่อไป (${k + 1}/${steps.length})`; } },
    icon('right'), h('span', null, `ขั้นต่อไป (1/${steps.length})`));
  add(0);
  return h('div', { class: 'colstack fw' }, wait, paper, btn);
}
const FW = {
  sub7: [['[5/6] − [1/4]', 'ตัวส่วน 6 กับ 4 ไม่เท่ากัน → แบ่งให้เป็น 12 ชิ้นเท่ากัน'], ['[10/12] − [3/12]', '[5/6] = [10/12] (คูณ 2) · [1/4] = [3/12] (คูณ 3)'], ['[7/12]', 'ตัวส่วนเท่ากันแล้ว ลบตัวเศษ 10 − 3 = 7 ตัวส่วนคงเดิม']],
  add8a: [['[7/9] + [2/3]', 'ตัวส่วน 9 กับ 3 ไม่เท่ากัน'], ['[7/9] + [6/9]', 'ทำ [2/3] ให้ตัวส่วนเป็น 9: คูณทั้งเศษและส่วนด้วย 3'], ['[13/9]', 'บวกตัวเศษ 7 + 6 = 13 ตัวส่วนคงเดิม'], ['[1 4/9]', 'เศษเกิน → จำนวนคละ: 13 ÷ 9 = 1 เศษ 4']],
  add8b: [['[3/4] + [5/6]', 'ตัวส่วน 4 กับ 6 → ใช้ 12 (ค.ร.น.)'], ['[9/12] + [10/12]', '[3/4] = [9/12] (คูณ 3) · [5/6] = [10/12] (คูณ 2)'], ['[19/12]', '9 + 10 = 19'], ['[1 7/12]', '19 ÷ 12 = 1 เศษ 7']],
  mix9a: [['[2 1/3] − [1 7/12]', 'มีจำนวนคละ → ทำเป็นเศษเกินก่อน'], ['[7/3] − [19/12]', '2 × 3 + 1 = 7 · 1 × 12 + 7 = 19'], ['[28/12] − [19/12]', 'ทำตัวส่วนเป็น 12: [7/3] = [28/12]'], ['[9/12]', '28 − 19 = 9'], ['[3/4]', 'ทำเป็นเศษส่วนอย่างต่ำ: 9 และ 12 หารด้วย 3']],
  mix9b: [['[1 3/4] + [2 1/2]', 'ทำจำนวนคละเป็นเศษเกิน'], ['[7/4] + [5/2]', '1 × 4 + 3 = 7 · 2 × 2 + 1 = 5'], ['[7/4] + [10/4]', '[5/2] = [10/4]'], ['[17/4]', '7 + 10 = 17'], ['[4 1/4]', '17 ÷ 4 = 4 เศษ 1']],
  mf10a: [['[5/8] + [4 1/2]', 'ทำจำนวนคละเป็นเศษเกิน'], ['[5/8] + [9/2]', '4 × 2 + 1 = 9'], ['[5/8] + [36/8]', '[9/2] = [36/8] (คูณ 4)'], ['[41/8]', '5 + 36 = 41'], ['[5 1/8]', '41 ÷ 8 = 5 เศษ 1']],
  mf10b: [['[17/6] − [1 2/3]', 'ทำจำนวนคละเป็นเศษเกิน'], ['[17/6] − [5/3]', '1 × 3 + 2 = 5'], ['[17/6] − [10/6]', '[5/3] = [10/6]'], ['[7/6]', '17 − 10 = 7'], ['[1 1/6]', '7 ÷ 6 = 1 เศษ 1']],
  of11: [['[2/3] ของ 12', '“ของ” แปลว่า คูณ'], ['[2/3] × 12', 'เขียนเป็นการคูณ'], ['[2/3] × [12/1]', 'เขียน 12 เป็น [12/1]'], ['[24/3]', 'เศษ × เศษ: 2 × 12 = 24 · ส่วน × ส่วน: 3 × 1 = 3'], ['8', '24 ÷ 3 = 8']],
  wf12: [['6 × [2/9]', 'จำนวนนับ × เศษส่วน'], ['[6/1] × [2/9]', 'เขียน 6 เป็น [6/1]'], ['[12/9]', '6 × 2 = 12 · 1 × 9 = 9'], ['[4/3]', 'ทำเป็นเศษส่วนอย่างต่ำ: หารด้วย 3'], ['[1 1/3]', '4 ÷ 3 = 1 เศษ 1']],
  fw13: [['[5/8] × 12', 'เศษส่วน × จำนวนนับ'], ['[5/8] × [12/1]', 'เขียน 12 เป็น [12/1]'], ['[5/2] × [3/1]', 'ตัดทอน 8 กับ 12 ด้วย 4: 8 → 2 · 12 → 3'], ['[15/2]', '5 × 3 = 15 · 2 × 1 = 2'], ['[7 1/2]', '15 ÷ 2 = 7 เศษ 1']],
  ff14: [['[3/4] × [2/9]', 'เศษ × เศษ และ ส่วน × ส่วน — ตัดทอนก่อนได้'], ['[1/2] × [1/3]', 'ตัดทอน: 3 กับ 9 หารด้วย 3 · 2 กับ 4 หารด้วย 2'], ['[1/6]', '1 × 1 = 1 · 2 × 3 = 6']],
  mw15: [['10 × [2 3/5]', 'ทำจำนวนคละเป็นเศษเกิน'], ['10 × [13/5]', '2 × 5 + 3 = 13'], ['[10/1] × [13/5]', 'เขียน 10 เป็น [10/1]'], ['[2/1] × [13/1]', 'ตัดทอน 10 กับ 5 ด้วย 5'], ['26', '2 × 13 = 26']],
  mf16a: [['[11/12] × [3 1/2]', 'ทำจำนวนคละเป็นเศษเกิน'], ['[11/12] × [7/2]', '3 × 2 + 1 = 7'], ['[77/24]', '11 × 7 = 77 · 12 × 2 = 24'], ['[3 5/24]', '77 ÷ 24 = 3 เศษ 5']],
  mf16b: [['[4 5/7] × [1 2/3]', 'ทำเป็นเศษเกินทั้งคู่'], ['[33/7] × [5/3]', '4 × 7 + 5 = 33 · 1 × 3 + 2 = 5'], ['[11/7] × [5/1]', 'ตัดทอน 33 กับ 3 ด้วย 3'], ['[55/7]', '11 × 5 = 55 · 7 × 1 = 7'], ['[7 6/7]', '55 ÷ 7 = 7 เศษ 6']],
  wd18: [['3 ÷ [3/4]', 'หารด้วยเศษส่วน'], ['3 × [4/3]', '= คูณด้วยส่วนกลับ: [3/4] → [4/3]'], ['[3/1] × [4/3]', 'เขียน 3 เป็น [3/1]'], ['[1/1] × [4/1]', 'ตัดทอน 3 กับ 3'], ['4', '1 × 4 = 4']],
  fd19: [['[6/7] ÷ 2', 'หารด้วยจำนวนนับ'], ['[6/7] × [1/2]', 'ส่วนกลับของ 2 คือ [1/2]'], ['[3/7] × [1/1]', 'ตัดทอน 6 กับ 2 ด้วย 2'], ['[3/7]', '3 × 1 = 3 · 7 × 1 = 7']],
  ff20a: [['[3/4] ÷ [3/8]', 'หารเศษส่วนด้วยเศษส่วน'], ['[3/4] × [8/3]', 'ตัวตั้งเท่าเดิม × ส่วนกลับของตัวหาร'], ['[1/1] × [2/1]', 'ตัดทอน 3 กับ 3 · 4 กับ 8 ด้วย 4'], ['2', '1 × 2 = 2']],
  ff20b: [['[5/6] ÷ [2/9]', 'หารเศษส่วนด้วยเศษส่วน'], ['[5/6] × [9/2]', 'คูณด้วยส่วนกลับของ [2/9]'], ['[5/2] × [3/2]', 'ตัดทอน 6 กับ 9 ด้วย 3'], ['[15/4]', '5 × 3 = 15 · 2 × 2 = 4'], ['[3 3/4]', '15 ÷ 4 = 3 เศษ 3']],
  md21a: [['6 ÷ [9 3/4]', 'ทำจำนวนคละเป็นเศษเกิน'], ['6 ÷ [39/4]', '9 × 4 + 3 = 39'], ['6 × [4/39]', 'คูณด้วยส่วนกลับ'], ['[2/1] × [4/13]', 'ตัดทอน 6 กับ 39 ด้วย 3'], ['[8/13]', '2 × 4 = 8 · 1 × 13 = 13']],
  md21b: [['[8/13] × [9 3/4]', 'ตรวจคำตอบ: ผลหาร × ตัวหาร ต้องได้ตัวตั้ง'], ['[8/13] × [39/4]', 'ทำ [9 3/4] เป็น [39/4]'], ['[2/1] × [3/1]', 'ตัดทอน 8 กับ 4 ด้วย 4 · 13 กับ 39 ด้วย 13'], ['6', '2 × 3 = 6 = ตัวตั้ง ✓']]
};

const L5 = (no, place, title, short, goal, teach, game) => ({ id: 500 + no, place, title, short, tone: TONES5[(no - 1) % 6], goal, teach, game });
const T = (t, s, v) => ({ t: FX(t), s, v });
const LESSONS_P5C1 = [
  L5(1, 'ถ้ำครึ่งหนึ่ง', 'การเปรียบเทียบเศษส่วน กับ 1/2', 'เทียบกับ 1/2', 'บอกได้ว่าเศษส่วนมากกว่า น้อยกว่า หรือเท่ากับ 1/2', [
    T('ยินดีต้อนรับสู่ <b>ถ้ำเศษส่วน ป.5</b>! ด่านแรกมาเทียบเศษส่วนกับ <b>ครึ่งหนึ่ง</b> กัน', 'ยินดีต้อนรับสู่ถ้ำเศษส่วน ป ห้า ด่านแรกมาเทียบเศษส่วนกับครึ่งหนึ่งกัน', el => el.append(mascot('wow', 'big'))),
    T('ปรับ<b>ตัวเศษ</b>และ<b>ตัวส่วน</b> ดูว่าแถบสีเลยเส้นครึ่งหรือไม่ · เคล็ดลับ: เทียบ <b>เศษ × 2</b> กับ <b>ส่วน</b>', 'ปรับตัวเศษและตัวส่วน ดูว่าแถบสีเลยเส้นครึ่งหรือไม่ เคล็ดลับ เทียบเศษคูณสองกับส่วน', el => el.append(simHalf(5, 12))),
    T('ตัวอย่างคิดทีละขั้น: [5/8] กับ [1/2]', 'ตัวอย่างคิดทีละขั้น ห้าส่วนแปด กับ หนึ่งส่วนสอง', el => el.append(dcWalk(FX('[5/8] <b class="fop">?</b> [1/2]'), [['① คูณเศษด้วย 2', '5 × 2 = 10'], ['② เทียบกับส่วน', '10 มากกว่าส่วน 8'], ['③ สรุป', '[5/8] <b>มากกว่า</b> [1/2] (เพราะครึ่งหนึ่งของ 8 คือ 4 แต่เรามี 5 ส่วน)']], fracBars(FR('5/8'), { half: true }).outerHTML)))],
    () => [...pkF(P5_HALF, 5).map(a => Q.fHalf({ a })), Q.fPick({ q: 'เศษส่วนใด<span class="hl">มากกว่า</span> [1/2]?', opts: ['3/7', '5/9', '4/10'], right: '5/9', hint: 'เศษ × 2 มากกว่าส่วน → มากกว่าครึ่ง' }), Q.fPick({ q: 'เศษส่วนใด<span class="hl">เท่ากับ</span> [1/2]?', opts: ['6/12', '5/12', '7/12'], right: '6/12', hint: 'เศษ × 2 เท่ากับส่วน → เท่ากับครึ่ง' })]),
  L5(2, 'ถ้ำเกณฑ์กลาง', 'การเปรียบเทียบเศษส่วน โดยใช้ 1/2 เป็นเกณฑ์', 'ใช้ 1/2 เป็นเกณฑ์', 'เปรียบเทียบเศษส่วนสองจำนวนโดยใช้ 1/2 เป็นเกณฑ์', [
    T('ถ้าเศษส่วนหนึ่ง<b>น้อยกว่า [1/2]</b> อีกเศษส่วน<b>มากกว่า [1/2]</b> → ตัวที่มากกว่าครึ่งย่อมมากกว่า', 'ถ้าเศษส่วนหนึ่งน้อยกว่าครึ่ง อีกเศษส่วนมากกว่าครึ่ง ตัวที่มากกว่าครึ่งย่อมมากกว่า', el => el.append(h('div', { class: 'colstack' }, fracBars(FR('2/5'), { half: true, col: 'a', label: FX('[2/5] น้อยกว่าครึ่ง') }), fracBars(FR('5/7'), { half: true, col: 'b', label: FX('[5/7] มากกว่าครึ่ง') }), h('div', { class: 'fbig', html: `${fqHTML(2, 5)} <b class="fop">&lt;</b> ${fqHTML(1, 2)} <b class="fop">&lt;</b> ${fqHTML(5, 7)}` })))),
    T('ลองเอง: ปรับเศษส่วนแล้วดูว่าอยู่ฝั่งไหนของเส้นครึ่ง', 'ลองเอง ปรับเศษส่วนแล้วดูว่าอยู่ฝั่งไหนของเส้นครึ่ง', el => el.append(simHalf(4, 9)))],
    () => [...pkF(P5_BYHALF, 5).map(([a, b]) => Q.fCmp({ a, b, bars: true, hint: 'เทียบแต่ละตัวกับครึ่งหนึ่งก่อน' })), Q.fPick({ q: 'เศษส่วนใด<span class="hl">น้อยที่สุด</span>?', opts: ['3/7', '4/6', '5/8'], right: '3/7', hint: 'ตัวที่น้อยกว่าครึ่งคือตัวที่น้อยที่สุด' })]),
  L5(3, 'ถ้ำส่วนเท่ากัน', 'การเปรียบเทียบเศษส่วนโดยทำตัวส่วนให้เท่ากัน', 'ทำตัวส่วนให้เท่ากัน', 'เปรียบเทียบเศษส่วนโดยทำตัวส่วนให้เท่ากัน หรือคูณไขว้', [
    T('ตัวส่วนไม่เท่ากัน → <b>ทำตัวส่วนให้เท่ากัน</b> แล้วเทียบตัวเศษ — กดปุ่มดูนะ', 'ตัวส่วนไม่เท่ากัน ทำตัวส่วนให้เท่ากัน แล้วเทียบตัวเศษ', el => el.append(simCommon('3/4', '5/7'))),
    T('อีกวิธี: <b>คูณไขว้</b> — กดทีละครั้ง ดูว่าคูณตัวไหนกับตัวไหน', 'อีกวิธี คูณไขว้ กดทีละครั้ง ดูว่าคูณตัวไหนกับตัวไหน', el => el.append(simCross('5/7', '3/6'))),
    T('คูณไขว้อีกตัวอย่าง: [3/8] กับ [2/5]', 'คูณไขว้อีกตัวอย่าง', el => el.append(simCross('3/8', '2/5')))],
    () => [...pkF(P5_CMP, 4).map(([a, b]) => Q.fCmp({ a, b })), Q.fEquiv({ a: '3/4', D: 20 }), Q.fEquiv({ a: '5/6', D: 18 }), Q.fEquiv({ a: '2/9', D: 27 })]),
  L5(4, 'ถ้ำจำนวนคละ', 'การเปรียบเทียบเศษส่วนกับจำนวนคละ', 'เศษส่วนกับจำนวนคละ', 'เปรียบเทียบเศษส่วนกับจำนวนคละ โดยทำให้อยู่ในรูปเดียวกันก่อน', [
    T('<b>จำนวนคละ</b> เช่น [1 1/6] คือ 1 กับอีก [1/6] · เขียนเป็น<b>เศษเกิน</b>ได้: (6 × 1) + 1 = 7 → [7/6]', 'จำนวนคละ เช่น หนึ่งเศษหนึ่งส่วนหก เขียนเป็นเศษเกินได้ เจ็ดส่วนหก', el => el.append(fracBars(FR('1 1/6'), { col: 'a', label: FX('[1 1/6] = [7/6]') }))),
    T('เปรียบเทียบ [5/3] กับ [1 1/6]: ทำเป็นเศษเกิน แล้วทำตัวส่วนให้เท่ากัน', 'เปรียบเทียบ ห้าส่วนสาม กับ หนึ่งเศษหนึ่งส่วนหก ทำเป็นเศษเกิน แล้วทำตัวส่วนให้เท่ากัน', el => el.append(simCommon('5/3', '1 1/6')))],
    () => pkF(P5_CMPM, 7).map(([a, b]) => Q.fCmp({ a, b, hint: 'ทำจำนวนคละเป็นเศษเกินก่อน แล้วทำตัวส่วนให้เท่ากัน' }))),
  L5(5, 'ถ้ำเรียงแถว', 'การเรียงลำดับเศษส่วน', 'เรียงลำดับเศษส่วน', 'เรียงลำดับเศษส่วนจากน้อยไปมาก และจากมากไปน้อย', [
    T('ตัวส่วนเท่ากัน ดูตัวเศษ · ตัวส่วนไม่เท่ากัน ทำให้เท่ากันก่อน — วางบน<b>เส้นจำนวน</b>ดูนะ', 'ตัวส่วนเท่ากัน ดูตัวเศษ ตัวส่วนไม่เท่ากัน ทำให้เท่ากันก่อน วางบนเส้นจำนวนดูนะ', el => el.append(simLine(['3/8', '3/4', '1/2', '1/8'], 1))),
    T('ตัวอย่างเรียงทีละขั้น: [2/3], [3/4], [5/12] จากน้อยไปมาก', 'ตัวอย่างเรียงลำดับทีละขั้น', el => el.append(dcWalk('', [['① หาตัวส่วนร่วม', '3, 4, 12 → ใช้ <b>12</b>'], ['② ทำตัวส่วนเป็น 12', '[2/3] = [8/12] · [3/4] = [9/12] · [5/12] = [5/12]'], ['③ เทียบตัวเศษ', '5 < 8 < 9'], ['④ ตอบ', '[5/12] &lt; [2/3] &lt; [3/4]']], '')))],
    () => P5_ORD.map(([list, dir]) => Q.fOrder({ list, dir }))),
  L5(6, 'ถ้ำเรียงคละ', 'การเรียงลำดับเศษส่วนและจำนวนคละ', 'เรียงเศษส่วนและจำนวนคละ', 'เรียงลำดับเศษส่วนและจำนวนคละ', [
    T('เรียง [3/2], [1 1/3], [5/6]: ทำเป็นเศษเกินที่ตัวส่วนเท่ากัน หรือวางบนเส้นจำนวน', 'เรียงลำดับเศษส่วนและจำนวนคละ ทำเป็นเศษเกินที่ตัวส่วนเท่ากัน หรือวางบนเส้นจำนวน', el => el.append(simLine(['3/2', '1 1/3', '5/6', '2 1/4'], 3))),
    T('ตัวอย่างเรียงทีละขั้น: [1 1/2], [4/3], [1 5/6] จากน้อยไปมาก', 'ตัวอย่างเรียงลำดับทีละขั้น', el => el.append(dcWalk('', [['① ทำเป็นเศษเกิน', '[1 1/2] = [3/2] · [4/3] · [1 5/6] = [11/6]'], ['② ตัวส่วนเป็น 6', '[9/6] · [8/6] · [11/6]'], ['③ เทียบตัวเศษ', '8 < 9 < 11'], ['④ ตอบ', '[4/3] &lt; [1 1/2] &lt; [1 5/6]']], '')))],
    () => pkF(P5_ORDM, 6).map(([list, dir]) => Q.fOrder({ list, dir }))),
  L5(7, 'ถ้ำภาพบวกลบ', 'การบวก การลบเศษส่วนที่ตัวส่วนไม่เท่ากันโดยใช้ภาพ', 'บวกลบด้วยภาพ', 'บวกและลบเศษส่วนที่ตัวส่วนไม่เท่ากันโดยใช้ภาพ', [
    T('[1/3] + [1/4]: ชิ้นคนละขนาด ต้อง<b>แบ่งให้เท่ากัน</b>ก่อน แล้วค่อยรวม', 'หนึ่งส่วนสามบวกหนึ่งส่วนสี่ ชิ้นคนละขนาด ต้องแบ่งให้เท่ากันก่อน แล้วค่อยรวม', el => el.append(simAddBars('1/3', '1/4', '+'))),
    T('ทีละขั้น: [5/6] − [1/4] — กด <b>ขั้นต่อไป</b>', 'ทีละขั้น ห้าส่วนหก ลบ หนึ่งส่วนสี่', el => el.append(fWalk(FW.sub7)))],
    () => pkF(P5_ADDP, 6).map(expr => Q.f4Calc2({ expr, lcm: true }))),
  L5(8, 'ถ้ำบวกลบส่วน', 'การบวก การลบเศษส่วนที่ตัวส่วนไม่เท่ากัน', 'บวกลบตัวส่วนไม่เท่ากัน', 'บวกและลบเศษส่วนที่ตัวส่วนไม่เท่ากัน โดยทำตัวส่วนให้เท่ากัน', [
    T('ทีละขั้น: ① ทำตัวส่วนให้เท่ากัน ② บวก/ลบตัวเศษ ③ ทำเป็นเศษส่วนอย่างต่ำ/จำนวนคละ — กด <b>ขั้นต่อไป</b>', 'ขั้นตอน ทำตัวส่วนให้เท่ากัน บวกหรือลบตัวเศษ ทำให้อยู่ในรูปอย่างง่าย', el => el.append(fWalk(FW.add8a))),
    T('ตัวอย่างที่ 2 (มีทอนเป็นจำนวนคละ): [3/4] + [5/6]', 'ตัวอย่างที่สอง สามส่วนสี่บวกห้าส่วนหก', el => el.append(fWalk(FW.add8b)))],
    () => pkF(P5_ADD, 7).map(expr => Q.f4Calc2({ expr, lcm: true }))),
  L5(9, 'ถ้ำคละบวกลบ', 'การบวก การลบจำนวนคละ', 'บวกลบจำนวนคละ', 'บวกและลบจำนวนคละ', [
    T('[2 1/3] − [1 7/12]: ทำเป็นเศษเกิน → ทำตัวส่วนให้เท่ากัน → ลบ → ทำให้อยู่ในรูปอย่างง่าย', 'สองเศษหนึ่งส่วนสาม ลบ หนึ่งเศษเจ็ดส่วนสิบสอง', el => el.append(fWalk(FW.mix9a))),
    T('การบวก: [1 3/4] + [2 1/2]', 'การบวกจำนวนคละ', el => el.append(fWalk(FW.mix9b)))],
    () => P5_MIX.map(expr => Q.f4Calc2({ expr, lcm: true }))),
  L5(10, 'ถ้ำผสมคละ', 'การบวก การลบเศษส่วนกับจำนวนคละ', 'เศษส่วนกับจำนวนคละ', 'บวกและลบเศษส่วนกับจำนวนคละ', [
    T('ทีละขั้น: [5/8] + [4 1/2] — กด <b>ขั้นต่อไป</b>', 'ห้าส่วนแปด บวก สี่เศษหนึ่งส่วนสอง', el => el.append(fWalk(FW.mf10a))),
    T('ลองเศษเกินลบจำนวนคละ', 'ลองเศษเกินลบจำนวนคละ', el => el.append(fWalk(FW.mf10b)))],
    () => P5_MIXF.map(expr => Q.f4Calc2({ expr, lcm: true }))),
  L5(11, 'ถ้ำของจำนวน', 'ความหมายเศษส่วนของจำนวนนับ', 'เศษส่วนของจำนวนนับ', 'หาเศษส่วนของจำนวนนับ เช่น 2/3 ของ 12', [
    T('<b>[2/3] ของ 12</b> = แบ่ง 12 เป็น 3 กลุ่มเท่า ๆ กัน แล้วเอามา 2 กลุ่ม', 'สองส่วนสามของสิบสอง แบ่งสิบสองเป็นสามกลุ่มเท่า ๆ กัน แล้วเอามาสองกลุ่ม', el => el.append(simOfSet(12, 'strawberry'))),
    T('“ของ” แปลว่า <b>คูณ</b> — ดูทีละขั้น', 'ของ แปลว่าคูณ', el => el.append(fWalk(FW.of11)))],
    () => pkF(P5_OF, 6).map(([f, n, e]) => Q.fOf({ f, n, e }))),
  L5(12, 'ถ้ำนับคูณเศษ', 'การคูณจำนวนนับกับเศษส่วน', 'จำนวนนับ × เศษส่วน', 'คูณจำนวนนับกับเศษส่วน', [
    T('<b>3 × [3/4]</b> = [3/4] + [3/4] + [3/4] — กระโดดบนเส้นจำนวน 3 ครั้ง', 'สามคูณสามส่วนสี่ เท่ากับ บวกสามส่วนสี่ สามครั้ง', el => el.append(simJumps(3, '3/4'))),
    T('ลัด: นำจำนวนนับ<b>คูณตัวเศษ</b> ตัวส่วนคงเดิม — ดูทีละขั้น: 6 × [2/9]', 'ลัด นำจำนวนนับคูณตัวเศษ ตัวส่วนคงเดิม', el => el.append(fWalk(FW.wf12)))],
    () => P5_WXF.map(expr => Q.f4Calc2({ expr }))),
  L5(13, 'ถ้ำเศษคูณนับ', 'การคูณเศษส่วนกับจำนวนนับ', 'เศษส่วน × จำนวนนับ', 'คูณเศษส่วนกับจำนวนนับ (ตัดทอนก่อนคูณ)', [
    T('[5/8] × 12: <b>ตัดทอน</b>ก่อนคูณ — ดูทีละขั้น', 'ห้าส่วนแปด คูณ สิบสอง ตัดทอนก่อนคูณ', el => el.append(fWalk(FW.fw13))),
    T('ดูบนเส้นจำนวน: [2/5] × 4', 'ดูบนเส้นจำนวน', el => el.append(simJumps(4, '2/5')))],
    () => P5_FXW.map(expr => Q.f4Calc2({ expr }))),
  L5(14, 'ถ้ำเศษคูณเศษ', 'การคูณเศษส่วนกับเศษส่วน', 'เศษส่วน × เศษส่วน', 'คูณเศษส่วนกับเศษส่วน: เศษคูณเศษ ส่วนคูณส่วน', [
    T('<b>แบบจำลองพื้นที่</b>: แถบฟ้า = เศษส่วนแรก แถบเหลือง = เศษส่วนที่สอง ช่องเขียว = ผลคูณ — ปรับตัวเลขดู', 'แบบจำลองพื้นที่ ช่องสีเขียวคือผลคูณ ปรับตัวเลขดู', el => el.append(simArea([2, 3], [3, 4]))),
    T('สรุป: <b>เศษ × เศษ</b> และ <b>ส่วน × ส่วน</b> (ตัดทอนก่อนได้)', 'สรุป เศษคูณเศษ และส่วนคูณส่วน', el => el.append(fWalk(FW.ff14)))],
    () => [...pkF(P5_FXF.slice(0, 4), 2).map(expr => Q.f4Calc2({ expr })), ...pkF(P5_FXF.slice(4), 4).map(expr => Q.f4Calc2({ expr }))]),
  L5(15, 'ถ้ำคละคูณนับ', 'การคูณจำนวนคละกับจำนวนนับ', 'จำนวนคละ × จำนวนนับ', 'คูณจำนวนคละกับจำนวนนับ', [
    T('10 × [2 3/5]: ทำเป็นเศษเกินแล้วคูณ — ดูทีละขั้น', 'สิบคูณสองเศษสามส่วนห้า ทำเป็นเศษเกินแล้วคูณ', el => el.append(fWalk(FW.mw15))),
    T('ตรวจคำตอบด้วยการประมาณ: [2 3/5] อยู่ระหว่าง 2 กับ 3 → 10 × [2 3/5] อยู่ระหว่าง 20 กับ 30', 'ตรวจคำตอบด้วยการประมาณ', el => el.append(fracLine([{ r: FR('2 3/5'), col: 'a' }], { max: 3, step: 5 })))],
    () => P5_MXW.map(expr => Q.f4Calc2({ expr }))),
  L5(16, 'ถ้ำคละคูณเศษ', 'การคูณจำนวนคละกับเศษส่วน', 'จำนวนคละ × เศษส่วน', 'คูณจำนวนคละกับเศษส่วน และจำนวนคละกับจำนวนคละ', [
    T('[11/12] × [3 1/2]: ทำเป็นเศษเกินก่อน — ดูทีละขั้น', 'สิบเอ็ดส่วนสิบสอง คูณ สามเศษหนึ่งส่วนสอง', el => el.append(fWalk(FW.mf16a))),
    T('จำนวนคละคูณจำนวนคละ: [4 5/7] × [1 2/3]', 'จำนวนคละคูณจำนวนคละ', el => el.append(fWalk(FW.mf16b)))],
    () => pkF(P5_MXF, 6).map(expr => Q.f4Calc2({ expr }))),
  L5(17, 'ถ้ำส่วนกลับ', 'ส่วนกลับของเศษส่วน', 'ส่วนกลับ', 'บอกส่วนกลับของเศษส่วน จำนวนนับ และจำนวนคละ', [
    T('<b>ส่วนกลับ</b> คือเศษส่วนที่คูณกันแล้วได้ 1 — <b>แตะการ์ดเพื่อพลิก</b>', 'ส่วนกลับ คือเศษส่วนที่คูณกันแล้วได้หนึ่ง แตะการ์ดเพื่อพลิก', el => el.append(simFlip(['3/5', '6', '1 3/4']))),
    T('จำนวนนับ 6 = [6/1] ส่วนกลับคือ [1/6] · จำนวนคละ ทำเป็นเศษเกินก่อนแล้วสลับ', 'จำนวนนับหก ส่วนกลับคือหนึ่งส่วนหก จำนวนคละทำเป็นเศษเกินก่อนแล้วสลับ', el => el.append(h('div', { class: 'fbig', html: `${litHTML({ w: 1, n: 3, d: 4 })} <b class="fop">=</b> ${fqHTML(7, 4)} <b class="fop">→</b> ${fqHTML(4, 7)}` })))],
    () => pkF(P5_REC, 6).map(f => Q.fRecip({ f }))),
  L5(18, 'ถ้ำนับหารเศษ', 'การหารจำนวนนับด้วยเศษส่วน', 'จำนวนนับ ÷ เศษส่วน', 'หารจำนวนนับด้วยเศษส่วน', [
    T('<b>3 ÷ [3/4]</b> = ในความยาว 3 วางชิ้นยาว [3/4] ได้กี่ชิ้น? — กดวางทีละชิ้น', 'สามหารสามส่วนสี่ ในความยาวสาม วางชิ้นยาวสามส่วนสี่ได้กี่ชิ้น', el => el.append(simMeasure(3, '3/4'))),
    T('ลัด: หารด้วยเศษส่วน = <b>คูณด้วยส่วนกลับ</b> — ดูทีละขั้น', 'ลัด หารด้วยเศษส่วน เท่ากับคูณด้วยส่วนกลับ', el => el.append(fWalk(FW.wd18)))],
    () => P5_WDF.map(expr => Q.f4Calc2({ expr }))),
  L5(19, 'ถ้ำเศษหารนับ', 'การหารเศษส่วนด้วยจำนวนนับ', 'เศษส่วน ÷ จำนวนนับ', 'หารเศษส่วนด้วยจำนวนนับ', [
    T('<b>[3/4] ÷ 3</b> = แบ่ง [3/4] ให้ 3 คนเท่า ๆ กัน', 'สามส่วนสี่หารสาม เท่ากับแบ่งสามส่วนสี่ให้สามคนเท่า ๆ กัน', el => el.append(simShare('3/4', 3))),
    T('หารด้วยจำนวนนับ = คูณด้วยส่วนกลับของจำนวนนับนั้น — ดูทีละขั้น', 'หารด้วยจำนวนนับ เท่ากับคูณด้วยส่วนกลับ', el => el.append(fWalk(FW.fd19)))],
    () => P5_FDW.map(expr => Q.f4Calc2({ expr }))),
  L5(20, 'ถ้ำเศษหารเศษ', 'การหารเศษส่วนด้วยเศษส่วน', 'เศษส่วน ÷ เศษส่วน', 'หารเศษส่วนด้วยเศษส่วน', [
    T('[3/4] ÷ [3/8]: [3/8] ใส่ใน [3/4] ได้กี่ครั้ง? — ดูทีละขั้น', 'สามส่วนสี่หารสามส่วนแปด คูณด้วยส่วนกลับ ได้สอง', el => el.append(fWalk(FW.ff20a))),
    T('ขั้นตอน: ตัวตั้งเท่าเดิม × ส่วนกลับของตัวหาร แล้วทำให้อยู่ในรูปอย่างง่าย', 'ตัวตั้งเท่าเดิม คูณ ส่วนกลับของตัวหาร', el => el.append(fWalk(FW.ff20b)))],
    () => pkF(P5_FDF, 7).map(expr => Q.f4Calc2({ expr }))),
  L5(21, 'ถ้ำหารคละ', 'การหารจำนวนคละ', 'การหารจำนวนคละ', 'หารที่มีจำนวนคละ: ทำเป็นเศษเกินก่อน แล้วคูณด้วยส่วนกลับของตัวหาร', [
    T('6 ÷ [9 3/4]: ทำเป็นเศษเกินก่อน แล้วคูณด้วยส่วนกลับ — ดูทีละขั้น', 'หกหารเก้าเศษสามส่วนสี่ ทำเป็นเศษเกินก่อน แล้วคูณด้วยส่วนกลับ', el => el.append(fWalk(FW.md21a))),
    T('ตรวจคำตอบทีละขั้น: ผลหาร × ตัวหาร = ตัวตั้ง', 'ตรวจคำตอบ ผลหารคูณตัวหาร เท่ากับตัวตั้ง', el => el.append(fWalk(FW.md21b)))],
    () => pkF(P5_MXD, 7).map(expr => Q.f4Calc2({ expr }))),
  L5(22, 'ถ้ำโจทย์บวกลบ', 'การวิเคราะห์โจทย์ปัญหาการบวก การลบเศษส่วน', 'วิเคราะห์โจทย์บวกลบ', 'วิเคราะห์โจทย์ปัญหาการบวกและการลบเศษส่วน', [
    T('อ่านโจทย์ แล้วหา <b>สิ่งที่โจทย์กำหนด</b> กับ <b>สิ่งที่โจทย์ถาม</b> — กดทีละขั้น', 'อ่านโจทย์ แล้วหาสิ่งที่โจทย์กำหนดกับสิ่งที่โจทย์ถาม', el => el.append(simStory('แม่ซื้อส้ม [5 7/10] กิโลกรัม ซื้อมะม่วง [4 1/2] กิโลกรัม แม่ซื้อผลไม้ทั้งหมดกี่กิโลกรัม', [['โจทย์กำหนด', 'ส้ม [5 7/10] กก. · มะม่วง [4 1/2] กก.'], ['โจทย์ถาม', 'ผลไม้ทั้งหมด'], ['เลือกวิธี', '“ทั้งหมด” → ใช้การบวก'], ['ประโยคสัญลักษณ์', '[5 7/10] + [4 1/2] = ☐']], '5 7/10 + 4 1/2'))),
    T('ตัวอย่างที่ 2 (การลบ): “เหลือ” ใช้การลบ', 'ตัวอย่างที่สอง เหลือ ใช้การลบ', el => el.append(simStory('มีน้ำ [3 1/2] ลิตร ใช้ไป [1 3/4] ลิตร เหลือน้ำกี่ลิตร', [['โจทย์กำหนด', 'มี [3 1/2] ลิตร · ใช้ไป [1 3/4] ลิตร'], ['เลือกวิธี', '“เหลือ” → ใช้การลบ'], ['ประโยคสัญลักษณ์', '[3 1/2] − [1 3/4] = [14/4] − [7/4] = [7/4] = [1 3/4]']], '3 1/2 − 1 3/4')))],
    () => P5_S_ADD.map(s => Q.p4Story2({ ...s, frac: true }))),
  L5(23, 'ถ้ำโจทย์คูณหาร', 'การวิเคราะห์โจทย์ปัญหาการคูณ การหารเศษส่วน', 'วิเคราะห์โจทย์คูณหาร', 'วิเคราะห์โจทย์ปัญหาการคูณและการหารเศษส่วน', [
    T('“[4/5] <b>ของ</b> 120” → คูณ · “แบ่ง<b>ส่วนละเท่า ๆ กัน</b> ได้กี่ส่วน” → หาร', 'ของ ใช้คูณ แบ่งส่วนละเท่า ๆ กัน ได้กี่ส่วน ใช้หาร', el => el.append(simStory('น้ำหอมเลี้ยงมะม่วง 120 ต้น เป็นมะม่วงตัวผู้ [4/5] ของทั้งหมด มีมะม่วงตัวผู้กี่ต้น', [['โจทย์กำหนด', 'ทั้งหมด 120 ต้น · ตัวผู้ [4/5] ของทั้งหมด'], ['เลือกวิธี', '“ของ” → ใช้การคูณ'], ['ประโยคสัญลักษณ์', '[4/5] × 120 = ☐']], '4/5 × 120'))),
    T('ตัวอย่างที่ 2 (การหาร): ตัดเป็นผืนละเท่า ๆ กัน', 'ตัวอย่างที่สอง การหาร', el => el.append(simStory('ผ้ายาว [7 1/2] เมตร ตัดเป็นผืนละ [3/4] เมตร ได้กี่ผืน', [['โจทย์กำหนด', 'ผ้า [7 1/2] ม. · ผืนละ [3/4] ม.'], ['เลือกวิธี', 'แบ่งส่วนละเท่า ๆ กัน → ใช้การหาร'], ['คำนวณ', '[15/2] ÷ [3/4] = [15/2] × [4/3] = 10 ผืน']], '7 1/2 ÷ 3/4')))],
    () => P5_S_MUL.map(s => Q.p4Story2({ ...s, frac: true }))),
  L5(24, 'ถ้ำวิธีบวกลบ', 'การแสดงวิธีทำโจทย์ปัญหาการบวก การลบเศษส่วน จำนวนคละ', 'แสดงวิธีทำบวกลบ', 'แสดงวิธีทำโจทย์ปัญหาการบวกและการลบเศษส่วน จำนวนคละ', [
    T('แสดงวิธีทำ 4 ขั้น: ① อ่านโจทย์ ② เลือกวิธี ③ เขียนประโยคสัญลักษณ์และหาคำตอบ ④ ตรวจความสมเหตุสมผล', 'แสดงวิธีทำสี่ขั้น', el => el.append(simStory('ถังมีน้ำ [10 1/12] ลิตร ใช้ไป [5 3/4] ลิตร เหลือน้ำกี่ลิตร', [['① โจทย์กำหนด / ถาม', 'มี [10 1/12] ลิตร ใช้ [5 3/4] ลิตร · ถามน้ำที่เหลือ'], ['② วิธี', '“เหลือ” → ใช้การลบ'], ['③ วิธีทำ', '[10 1/12] − [5 3/4] = [121/12] − [69/12] = [52/12] = [4 1/3]'], ['④ ตรวจ', 'มีประมาณ 10 ใช้ประมาณ 6 เหลือประมาณ 4 ✓']], '10 1/12 − 5 3/4'))),
    T('ตัวอย่างที่ 2: แสดงวิธีทำการลบจำนวนคละที่ต้องทำตัวส่วนให้เท่ากัน', 'ตัวอย่างที่สอง แสดงวิธีทำการลบจำนวนคละ', el => el.append(simStory('มีเชือก [12 1/4] เมตร ใช้ไป [4 2/3] เมตร เหลือเชือกกี่เมตร', [['① กำหนด / ถาม', 'มี [12 1/4] ม. ใช้ [4 2/3] ม. · ถามที่เหลือ'], ['② วิธี', '“เหลือ” → ลบ'], ['③ วิธีทำ', '[49/4] − [14/3] = [147/12] − [56/12] = [91/12] = [7 7/12]'], ['④ ตรวจ', 'ประมาณ 12 − 5 = 7 ✓']], '12 1/4 − 4 2/3')))],
    () => P5_S_ADD2.map(s => Q.p4Story2({ ...s, frac: true }))),
  L5(25, 'ถ้ำวิธีคูณหาร', 'การแสดงวิธีทำโจทย์ปัญหาการคูณ การหารเศษส่วน จำนวนคละ', 'แสดงวิธีทำคูณหาร', 'แสดงวิธีทำโจทย์ปัญหาการคูณและการหารเศษส่วน จำนวนคละ', [
    T('ตัวอย่าง: แบ่งน้ำหวานใส่ขวด — ตรวจคำตอบด้วยการคูณกลับ', 'ตัวอย่าง แบ่งน้ำหวานใส่ขวด ตรวจคำตอบด้วยการคูณกลับ', el => el.append(simStory('มีน้ำหวาน [12 1/2] ลิตร แบ่งใส่ขวด ขวดละ [1 1/4] ลิตร ได้กี่ขวด', [['① โจทย์กำหนด / ถาม', 'น้ำหวาน [12 1/2] ลิตร · ขวดละ [1 1/4] ลิตร · ถามจำนวนขวด'], ['② วิธี', 'แบ่งเท่า ๆ กัน → ใช้การหาร'], ['③ วิธีทำ', '[25/2] ÷ [5/4] = [25/2] × [4/5] = 10'], ['④ ตรวจ', '10 × [1 1/4] = [12 1/2] ✓']], '12 1/2 ÷ 1 1/4'))),
    T('ตัวอย่างที่ 2 (การคูณ): หลายถุงเท่า ๆ กัน', 'ตัวอย่างที่สอง การคูณ', el => el.append(simStory('ข้าวสาร 1 ถุงหนัก [2 1/2] กิโลกรัม ซื้อ 6 ถุง หนักทั้งหมดกี่กิโลกรัม', [['① กำหนด / ถาม', 'ถุงละ [2 1/2] กก. · 6 ถุง'], ['② วิธี', 'หลายชุดเท่า ๆ กัน → คูณ'], ['③ วิธีทำ', '6 × [5/2] = 15 กก.'], ['④ ตรวจ', '15 ÷ 6 = [2 1/2] ✓']], '6 × 2 1/2')))],
    () => P5_S_MUL2.map(s => Q.p4Story2({ ...s, frac: true }))),
  L5(26, 'ถ้ำวงเล็บ', 'การหาผลลัพธ์ของการบวก ลบ คูณ หารระคนของเศษส่วน จำนวนคละ 3 จำนวน แบบมีวงเล็บ', 'ระคน มีวงเล็บ', 'หาผลลัพธ์ของการบวก ลบ คูณ หารระคน แบบมีวงเล็บ', [
    T('ทำ<b>ในวงเล็บก่อน</b>เสมอ แล้วค่อยทำส่วนที่เหลือ — กดทีละขั้น', 'ทำในวงเล็บก่อนเสมอ แล้วค่อยทำส่วนที่เหลือ', el => el.append(simSteps('(3 1/6 + 5 1/2) × 4 1/2'))),
    T('ตัวอย่างที่ 2: (บวกในวงเล็บ) แล้วคูณ', 'ตัวอย่างที่สอง บวกในวงเล็บแล้วคูณ', el => el.append(simSteps('(2/3 + 1/6) × 12', ['ในวงเล็บก่อน: [4/6] + [1/6] = [5/6]', '[5/6] × 12 = 10'])))],
    () => [Q.fFirst({ expr: pick(P5_PAR) }), ...pkF(P5_PAR, 5).map(expr => Q.f6Steps({ expr }))]),
  L5(27, 'ถ้ำไร้วงเล็บ', 'การหาผลลัพธ์ของการบวก ลบ คูณ หารระคนของเศษส่วน จำนวนคละ 3 จำนวน แบบไม่มีวงเล็บ', 'ระคน ไม่มีวงเล็บ', 'หาผลลัพธ์ของการบวก ลบ คูณ หารระคน แบบไม่มีวงเล็บ', [
    T('ไม่มีวงเล็บ: ทำ <b>คูณ หาร ก่อน</b> (ซ้ายไปขวา) แล้วค่อย <b>บวก ลบ</b> (ซ้ายไปขวา)', 'ไม่มีวงเล็บ ทำคูณหารก่อน แล้วค่อยบวกลบ', el => el.append(simSteps('2 + 3/4 × 2/3'))),
    T('คูณกับหารอยู่ด้วยกัน ทำจาก<b>ซ้ายไปขวา</b>', 'คูณกับหารอยู่ด้วยกัน ทำจากซ้ายไปขวา', el => el.append(simSteps('5/6 ÷ 5/12 × 1/4')))],
    () => [Q.fFirst({ expr: pick(P5_NOPAR.slice(0, 4)) }), Q.fFirst({ expr: pick(P5_NOPAR.slice(4)) }), ...pkF(P5_NOPAR.filter(e => e !== '2 + 3/4 × 2/3'), 5).map(expr => Q.f6Steps({ expr }))]),
  L5(28, 'ถ้ำโจทย์ระคน 1', 'การวิเคราะห์โจทย์ปัญหาการบวก ลบ คูณ หารระคนเศษส่วน จำนวนคละ (ตอนที่ 1)', 'วิเคราะห์โจทย์ระคน 1', 'วิเคราะห์โจทย์ปัญหาระคนที่ต้องคิดสองขั้น', [
    T('โจทย์สองขั้น: หาสิ่งที่ยังไม่รู้ก่อน แล้วค่อยตอบคำถาม', 'โจทย์สองขั้น หาสิ่งที่ยังไม่รู้ก่อน แล้วค่อยตอบคำถาม', el => el.append(simStory('ข้อมีเงิน 540 บาท แบ่งให้เจี๊ยบ [1/3] ของเงินที่มี ข้อเหลือเงินกี่บาท', [['ขั้นที่ 1', 'หาเงินที่ให้เจี๊ยบ: [1/3] × 540 = 180 บาท (ใช้การคูณ)'], ['ขั้นที่ 2', 'หาเงินที่เหลือ: 540 − 180 = 360 บาท (ใช้การลบ)'], ['ประโยคสัญลักษณ์', '540 − ([1/3] × 540) = ☐']], '540 − 1/3 × 540'))),
    T('ตัวอย่างที่ 2: ใช้เงินไปส่วนหนึ่ง เหลือเท่าไร', 'ตัวอย่างที่สอง ใช้เงินไปส่วนหนึ่ง เหลือเท่าไร', el => el.append(simStory('มีเงิน 600 บาท ซื้อหนังสือ [1/4] ของเงินที่มี เหลือเงินกี่บาท', [['ขั้นที่ 1', 'ค่าหนังสือ [1/4] × 600 = 150 บาท (คูณ)'], ['ขั้นที่ 2', 'เหลือ 600 − 150 = 450 บาท (ลบ)'], ['ประโยคสัญลักษณ์', '600 − ([1/4] × 600) = ☐']], '600 − 1/4 × 600')))],
    () => P5_S_MIX1.map(s => Q.p4Story2({ ...s, frac: true }))),
  L5(29, 'ถ้ำโจทย์ระคน 2', 'การวิเคราะห์โจทย์ปัญหาการบวก ลบ คูณ หารระคนเศษส่วน จำนวนคละ (ตอนที่ 2)', 'วิเคราะห์โจทย์ระคน 2', 'วิเคราะห์โจทย์ปัญหาระคนเกี่ยวกับเงินและราคาสินค้า', [
    T('ราคารวม = (ปริมาณ × ราคาต่อหน่วย) ของแต่ละอย่าง แล้วนำมารวมกัน', 'ราคารวม เท่ากับ ปริมาณคูณราคาต่อหน่วยของแต่ละอย่าง แล้วนำมารวมกัน', el => el.append(simStory('ซื้อเนื้อ [2 1/2] กิโลกรัม กิโลกรัมละ 120 บาท และผัก [3/4] กิโลกรัม กิโลกรัมละ 40 บาท จ่ายทั้งหมดกี่บาท', [['เนื้อ', '[2 1/2] × 120 = 300 บาท'], ['ผัก', '[3/4] × 40 = 30 บาท'], ['รวม', '300 + 30 = 330 บาท']], '2 1/2 × 120 + 3/4 × 40'))),
    T('ตัวอย่างที่ 2: จ่ายเงินแล้วได้เงินทอน', 'ตัวอย่างที่สอง จ่ายเงินแล้วได้เงินทอน', el => el.append(simStory('ซื้อส้ม [1 1/2] กิโลกรัม กิโลกรัมละ 40 บาท ให้เงิน 100 บาท ได้เงินทอนกี่บาท', [['ค่าส้ม', '[1 1/2] × 40 = 60 บาท'], ['เงินทอน', '100 − 60 = 40 บาท']], '100 − 1 1/2 × 40')))],
    () => P5_S_MIX2.map(s => Q.p4Story2({ ...s, frac: true }))),
  L5(30, 'ถ้ำวิธีระคน', 'การแสดงวิธีทำโจทย์ปัญหาการบวก ลบ คูณ หารระคนเศษส่วน จำนวนคละ', 'แสดงวิธีทำระคน', 'แสดงวิธีทำโจทย์ปัญหาระคน และฝึกโจทย์แนวข้อสอบ', [
    T('รวมทุกขั้น: อ่าน → วางแผน → ประโยคสัญลักษณ์ (ใช้วงเล็บให้ถูก) → คำนวณ → ตรวจ', 'รวมทุกขั้น อ่าน วางแผน ประโยคสัญลักษณ์ คำนวณ ตรวจ', el => el.append(simStory('มีแป้ง [5 1/4] กิโลกรัม ซื้อเพิ่ม [2 3/4] กิโลกรัม แล้วแบ่งใส่ถุง ถุงละ [1/2] กิโลกรัม ได้กี่ถุง', [['วางแผน', 'หาแป้งทั้งหมดก่อน (บวก) แล้วแบ่งใส่ถุง (หาร)'], ['ประโยคสัญลักษณ์', '([5 1/4] + [2 3/4]) ÷ [1/2] = ☐'], ['คำนวณ', '8 ÷ [1/2] = 8 × 2 = 16 ถุง'], ['ตรวจ', '16 × [1/2] = 8 = [5 1/4] + [2 3/4] ✓']], '(5 1/4 + 2 3/4) ÷ 1/2'))),
    T('ตัวอย่างที่ 2: ใช้ไปแล้วแบ่งส่วนที่เหลือ', 'ตัวอย่างที่สอง ใช้ไปแล้วแบ่งส่วนที่เหลือ', el => el.append(simStory('มีแป้ง [6 3/4] กิโลกรัม ใช้ทำขนม [2 1/4] กิโลกรัม ที่เหลือแบ่งใส่ถุง ถุงละ [3/4] กิโลกรัม ได้กี่ถุง', [['วางแผน', 'หาแป้งที่เหลือ (ลบ) แล้วแบ่งใส่ถุง (หาร)'], ['ประโยคสัญลักษณ์', '([6 3/4] − [2 1/4]) ÷ [3/4] = ☐'], ['คำนวณ', '[4 1/2] ÷ [3/4] = [9/2] × [4/3] = 6 ถุง'], ['ตรวจ', '6 × [3/4] = [4 1/2] ✓']], '(6 3/4 − 2 1/4) ÷ 3/4')))],
    () => P5_S_SHOW.map(s => Q.p4Story2({ ...s, frac: true })))
];
/* boss 539: ข้อสอบท้ายบท — แต่งใหม่ทั้งหมด (original items) */
const XO = (...o) => o.map(x => ({ html: FX(x), say: FXsay(x) }));
const EXAM_P5C1 = xrot([
  { q: '', opts: ['6', '7', '8', '9'], a: 2 },
  { q: 'ข้อใดเติมเครื่องหมาย &gt; แล้วทำให้ประโยคเป็นจริง', opts: XO('[3/7] ☐ [4/9]', '[7/12] ☐ [5/8]', '[15/14] ☐ [14/15]', '[9/18] ☐ [1/2]'), a: 2 },
  { q: 'ข้อใดเป็นเศษส่วนอย่างต่ำทุกจำนวน', opts: XO('[2/5], [3/7], [4/10]', '[3/4], [5/9], [7/11]', '[2/9], [6/15], [8/13]', '[5/8], [9/12], [11/14]'), a: 1 },
  { q: FX('จงหาผลลัพธ์ของ [1/16] + [2 3/8]'), opts: XO('[2 7/16]', '[2 4/24]', '[3 1/16]', '[2 1/4]'), a: 0 },
  { q: FX('จงหาผลลัพธ์ของ [7 5/12] − [3 3/4]'), opts: XO('[4 1/6]', '[3 2/3]', '[4 2/3]', '[3 1/6]'), a: 1 },
  { q: FX('[1 3/4] ของ [5 1/7] มีค่าเท่าใด'), opts: XO('9', '[9/28]', '[1/9]', '36'), a: 0 },
  { q: `จงหาผลลัพธ์ของ ${exprHTML('3 3/4 ÷ (5 × 3 3/4)')}`, opts: XO('[1/5]', '[1/4]', '[1/3]', '5'), a: 0 },
  { q: `จงหาผลลัพธ์ของ ${exprHTML('3/5 × (1/4 + 5/12)')}`, opts: XO('[2/5]', '[8/15]', '1', '[3/20]'), a: 0 },
  { q: FX('กาละมังจุน้ำได้ 15 ลิตร มีน้ำอยู่ [8 3/5] ลิตร ต้องเติมน้ำอีกเท่าใดจึงจะเต็มพอดี'), opts: XO('[7 2/5] ลิตร', '[6 2/5] ลิตร', '[6 3/5] ลิตร', '[7 3/5] ลิตร'), a: 1 },
  { q: FX('ต้นมีเงิน 480 บาท ฝนมีเงินเป็น [3/4] ของต้น และบีมมีเงินเป็น [2/3] ของฝน ทั้ง 3 คนมีเงินรวมกันเท่าใด'), opts: ['960 บาท', '1,000 บาท', '1,080 บาท', '1,120 บาท'], a: 2 },
  { q: `${exprHTML('3/4 + 1/6')} = ☐ ขั้นแรกควรทำอย่างไร`, opts: ['นำตัวเศษมาบวกกันก่อน', 'ทำตัวส่วนให้เท่ากัน', 'นำตัวส่วนมาบวกกัน', 'ทำตัวเศษให้เท่ากัน'], a: 1 },
  { q: `ข้อใดมีผลลัพธ์เท่ากับ ${exprHTML('5/8 + 6/16')}`, opts: XO('[1/4] + [3/4]', '[2/8] + [4/8]', '[3/16] + [10/16]', '[1/2] + [3/8]'), a: 0 },
  { q: FX('[2/5] ของ [5/6] มีค่าเท่ากับข้อใด'), opts: XO('[2/5] + [5/6]', '[2/5] × [5/6]', '[2/5] ÷ [5/6]', '[5/6] − [2/5]'), a: 1 },
  { q: `${exprHTML('4 × 3/10')} กับ ${exprHTML('2/5 × 3/4')} มีค่าต่างกันเท่าไร`, opts: XO('[9/10]', '[3/10]', '[6/5]', '[3/2]'), a: 0 },
  { q: 'ข้อใดถูกต้อง', opts: XO('[3/4] − [1/2] = [5/8] − [3/8]', '[2/3] + [1/6] = [1/2] + [1/4]', '[7/10] − [1/5] = [3/4] − [1/2]', '[5/9] + [1/3] = [7/12] + [1/6]'), a: 0 },
  { q: `${exprHTML('1 2/3 + 2 1/4')} = ☐ ผลลัพธ์มีค่าเท่าไร`, opts: XO('[3 3/7]', '[3 11/12]', '[4 1/12]', '[3 2/7]'), a: 1 },
  { q: `${exprHTML('1/8 × 6')} กับ ${exprHTML('1/2 ÷ 4')} นำผลลัพธ์มาบวกกันจะเท่ากับข้อใด`, opts: XO('[7/8]', '1', '[5/8]', '[3/4]'), a: 0 },
  { q: `ข้อใดมีค่ามากกว่า ${exprHTML('3/4 ÷ 9/8')}`, opts: XO('[1/2] × [4/5]', '[1/4] + [1/3]', '[1/2] ของ [5/6]', '[5/12] + [1/3]'), a: 3 },
  { q: `${exprHTML('9/10 × (5/6 − 1/3)')} = ☐ มีค่ามากกว่า ${FX('[1/5]')} อยู่เท่าไร`, opts: XO('[1/4]', '[1/5]', '[9/20]', '[7/20]'), a: 0 },
  { q: `ข้อใดมีผลลัพธ์เท่ากับ ${FX('[1/3]')}`, opts: [{ html: exprHTML('(3/4 − 1/2) + 1/12') }, { html: exprHTML('(2/5 × 5/4) − 1/4') }, { html: exprHTML('4/9 × (3/4 − 1/2)') }, { html: exprHTML('(1/2 ÷ 3/4) × 1/3') }], a: 0 },
  { q: FX('[3/4] ของไข่หนึ่งโหล เท่ากับไข่กี่ฟอง'), opts: ['6 ฟอง', '8 ฟอง', '9 ฟอง', '10 ฟอง'], a: 2 },
  { q: FX('พิจารณา 1. [2/5] ของระยะทาง 45 กิโลเมตร 2. [5/6] ของระยะทาง 24 กิโลเมตร ข้อใดถูกต้อง'), opts: ['ข้อ 1 สั้นกว่าข้อ 2 อยู่ 2 กิโลเมตร', 'ข้อ 1 ยาวกว่าข้อ 2 อยู่ 2 กิโลเมตร', 'ข้อ 1 สั้นกว่าข้อ 2 อยู่ 4 กิโลเมตร', 'ทั้งสองข้อยาวเท่ากัน'], a: 0 },
  { q: `พิจารณา 1. ${exprHTML('(1/3 + 1/6) ÷ 1/4')} = 2  2. ${exprHTML('9/4 − (2/3 × 3/8)')} = 2  3. ${exprHTML('(1/5 × 20) ÷ 1/2')} = 6 ข้อใดถูกต้อง`, opts: ['ข้อ 1 เท่านั้น', 'ข้อ 1, 2', 'ข้อ 2, 3', 'ข้อ 1, 2, 3'], a: 1 },
  { q: FX('ริบบิ้น 6 เส้น ยาวเส้นละ [3/4] เมตร นำมาต่อกันจะยาวเท่าไร'), opts: XO('[4 1/2] เมตร', '[4 1/4] เมตร', '[3 1/2] เมตร', '[5 1/4] เมตร'), a: 0 },
  { q: FX('“ต้นมีเงิน 150 บาท ซื้อหนังสือ [2/5] ของเงินที่มี” จากข้อความข้อใดถูกต้อง'), opts: XO('ต้นเหลือเงิน 90 บาท', 'หนังสือราคา 90 บาท', 'ต้นเหลือเงินน้อยกว่า 60 บาท', 'ถ้าซื้อขนม [1/3] ของเงินที่เหลือ จะเหลือเงิน 50 บาท'), a: 0 },
  { q: FX('“ลุงมีถั่วลิสง [21/4] กิโลกรัม แบ่งใส่ถุง ถุงละ [3/4] กิโลกรัม” จากข้อความข้อใดถูกต้อง'), opts: ['แบ่งได้ 6 ถุง', 'ขายถุงละ 30 บาท จะได้เงิน 210 บาท', 'ขายถุงละ 25 บาท จะได้เงิน 150 บาท', 'แบ่งได้ 8 ถุง'], a: 1 },
  { q: FX('พ่อมีเงิน 1,200 บาท ซื้อพัดลม [1/2] ของเงินที่มี และซื้อหลอดไฟอีก [1/8] ของเงินที่มีอยู่เดิม พ่อเหลือเงินกี่บาท'), opts: ['400 บาท', '450 บาท', '500 บาท', '525 บาท'], a: 1 },
  { q: FX('ขนม 1 ถาดมี 360 ชิ้น ขายครั้งแรก [1/4] ของถาด ขายครั้งที่สอง [2/3] ของขนมที่เหลือ เหลือขนมกี่ชิ้น'), opts: ['80 ชิ้น', '90 ชิ้น', '100 ชิ้น', '120 ชิ้น'], a: 1 },
  { q: FX('“ป้ามีสวน 6 แปลง แต่ละแปลงมีพื้นที่ [3/4] ไร่” จากข้อมูลข้อใดถูกต้อง'), opts: XO('ป้ามีสวนทั้งหมด [4 1/2] ไร่', 'ป้ามีสวนทั้งหมด 6 ไร่', 'ถ้าขายแปลงละ 40,000 บาท จะได้เงินไร่ละ 30,000 บาท', 'แบ่งให้ลูก 2 คน คนละเท่า ๆ กัน ได้คนละ 2 ไร่'), a: 0 },
  { q: '“สมใจมีเงิน 600 บาท” จากข้อมูลข้อใดถูกต้อง', opts: XO('ซื้อเสื้อ [2/6] ของเงินที่มี จะเหลือเงิน 400 บาท', 'บริจาค [1/5] ของเงินที่มี เท่ากับบริจาค 100 บาท', 'ซื้อรองเท้า [3/4] ของเงินที่มี จะเหลือเงิน 200 บาท', 'ออม [5/12] ของเงินที่มี เท่ากับออม 200 บาท'), a: 0 }
], 1);
EXAM_P5C1[0].q = `${fqHTML(5, '☐')} = ${fqHTML(45, 72)} จงหาจำนวนมาเติมใน ☐ แล้วทำให้ประโยคเป็นจริง`;
LESSONS_P5C1.push({ id: 539, boss: true, place: 'ถ้ำราชาหมี', title: 'ด่านบอส: บทที่ 1 เศษส่วน', short: 'ด่านบอส · ข้อสอบ', tone: 'orange',
  goal: 'ตอบคำถามเรื่องเศษส่วน 30 ข้อ ตอบถูกอย่างน้อย 15 ข้อเพื่อชนะบอส',
  exam: EXAM_P5C1, pass: 15, bossName: 'ราชาหมีถ้ำมืด', bossPal: 'cookie', emblem: '½', bossKind: 'bear' });
