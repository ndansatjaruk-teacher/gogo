/* =========================================================
   reuses the P5 decimal kit (p5d: decSquares pvChart decAnswer simDecGrid Q.dCmp/dCalc/dStory · exprEval exact) and p4story / Q.p4Seq
   NEW: e4Plan + e4ColHTML — ตั้งบวก/ตั้งลบทศนิยมที่เด็กทำเองทีละหลัก (เติม 0 ให้ตำแหน่งเท่ากัน · ทดและกระจายผ่าน 0 ให้เห็น) · Q.e4Col · simE4Col
        simE4Place (ปรับเลขโดดทีละหลัก → อ่าน · รูปกระจาย) · simE4Cmp · e4Words (อ่านทศนิยมแบบไทย)
   ========================================================= */
const E4D = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const e4Words = s => { const [a, b = ''] = String(s).replace(/,/g, '').split('.'); return (+a ? thaiWords(+a) : 'ศูนย์') + (b ? 'จุด' + [...b].map(c => E4D[+c]).join('') : ''); };
const e4n = (lo, hi, p) => { const k = rnd(Math.round(lo * 10 ** p), Math.round(hi * 10 ** p)); return e4s(k, p); };          // random decimal with exactly p places
const e4s = (k, p) => { const s = String(k).padStart(p + 1, '0'); return p ? `${s.slice(0, -p)}.${s.slice(-p)}` : s; };
const e4int = (s, p) => { const [a, b = ''] = String(s).split('.'); return +(a + b.padEnd(p, '0')); };
const e4nz = (lo, hi, p) => { for (;;) { const x = e4n(lo, hi, p); if (!p || !/0$/.test(x)) return x; } };      // last decimal digit ≠ 0
const e4val = (dg, e) => e >= 0 ? String(dg * 10 ** e) : e4s(dg, -e);                                // value of digit dg in place 10^e
const E4_NM = ['ปุ้ม', 'ต้นข้าว', 'มะลิ', 'ภูผา', 'น้ำใส', 'ก้อง', 'ใบเตย', 'ธันวา', 'แพรวา', 'ชาติชาย', 'กานดา', 'วายุ'];
const e4H = s => `<b class="dnum">${fmtDec(s)}</b>`;
/* ---------- column add / subtract with decimals ---------- */
// plan: columns i = 0 (right-most decimal place) … n-1; the point sits left of column p-1
function e4Plan(a, b, op) { const p = Math.max(dPl(a), dPl(b)), A = e4int(a, p), B = e4int(b, p), R = op === '+' ? A + B : A - B;
  const len = x => Math.max(String(x).length, p + 1), top = Math.max(len(A), len(B)), n = Math.max(top, len(R));
  const dig = x => String(x).padStart(n, '0').split('').reverse().map(Number), t = dig(A), bb = dig(B), steps = []; let c = 0;
  for (let i = 0; i < n; i++) {
    if (op === '+') { if (i >= top) { steps.push({ i, auto: true, s: c, out: c, c }); break; } const s = t[i] + bb[i] + c; steps.push({ i, s, out: s % 10, carry: s >= 10 ? 1 : 0, c, d1: t[i], d2: bb[i] }); c = s >= 10 ? 1 : 0; }
    else { const st = { i, cross: {}, d0: t[i], d2: bb[i] }; if (t[i] < bb[i]) { let j = i + 1; while (t[j] === 0) j++; t[j]--; st.cross[j] = t[j]; for (let k = j - 1; k > i; k--) { t[k] = 9; st.cross[k] = 9; } t[i] += 10; st.cross[i] = t[i]; st.borrow = j; }
      st.d1 = t[i]; st.s = t[i] - bb[i]; st.out = st.s; st.auto = i >= len(R); steps.push(st); } }
  return { p, A, B, R, n, top, steps }; }
const e4nm = (P, i) => 'หลัก' + PV_NAME[i - P.p];
function e4Apply(P, op, st, s) { st.hi = s.i;
  if (op === '+') { st.res[s.i] = String(s.out); if (s.carry) st.mk[s.i + 1] = '1'; }
  else { Object.entries(s.cross).forEach(([j, v]) => { st.cross[j] = v; st.mk[j] = String(v); }); st.res[s.i] = s.auto ? '' : String(s.out); } }
function e4Txt(P, op, s) { if (op === '+') return s.auto ? `ทด 1 ลงมาเขียนใน${e4nm(P, s.i)}` : `${e4nm(P, s.i)}: ${s.d1} + ${s.d2}${s.c ? ' + 1 (ที่ทดมา)' : ''} = ${s.s}` + (s.carry ? ` → เขียน ${s.out} <b>ทด 1</b>` : '');
  if (s.auto) return `${e4nm(P, s.i)}: ${s.d1} − ${s.d2} = 0 (ไม่ต้องเขียน 0 ข้างหน้า)`;
  return `${e4nm(P, s.i)}: ` + (s.borrow != null ? `${s.d0} ลบ ${s.d2} ไม่ได้ → <b>กระจาย</b>จาก${e4nm(P, s.borrow)}${s.borrow > s.i + 1 ? ' (0 ระหว่างทางเป็น 9)' : ''} → ` : '') + `${s.d1} − ${s.d2} = ${s.s}`; }
function e4ColHTML(P, op, st = {}, o = {}) { const { p, n } = P, pa = st.a != null ? dPl(st.a) : p, pb = st.b != null ? dPl(st.b) : p, mk = st.mk || {}, res = st.res || {}, cr = st.cross || {};
  const cell = (i, cls, v) => `<span class="${cls}${st.hi === i ? ' hi' : ''}">${v}</span>`;
  const row = (lead, f, pt) => { let s = lead; for (let i = n - 1; i >= 0; i--) { s += f(i); if (p && i === p) s += `<span class="pt">${pt}</span>`; } return s; };
  const D = (x, pl, cross) => i => (i < String(x).length || i <= p) ? cell(i, 'dg' + (i < p - pl ? ' z' : '') + (cross && cross[i] != null ? ' x' : ''), Math.floor(x / 10 ** i) % 10) : cell(i, 'dg', '');
  let cols = '1.1em'; for (let i = n - 1; i >= 0; i--) cols += ' 1.2em' + (p && i === p ? ' .42em' : '');
  const span = n + 1 + (p ? 1 : 0);
  let s = `<div class="p4col e4col${o.sm ? ' sm' : ''}" style="grid-template-columns:${cols}">`;
  if (o.names !== false) s += row('<span></span>', i => cell(i, 'pn', (PV_NAME[i - p] || '').replace('ส่วน', 'ส.')), '');
  s += row('<span></span>', i => cell(i, 'mk', mk[i] != null ? mk[i] : ''), '');
  s += row('<span></span>', D(P.A, pa, cr), '.');
  s += row(`<span class="sg">${op}</span>`, D(P.B, pb), '.');
  s += `<span class="ln" style="grid-column:1 / span ${span}"></span>`;
  s += row('<span></span>', i => cell(i, 'dg rs', res[i] != null ? res[i] : ''), res[p - 1] != null && res[p - 1] !== '' ? '.' : '');
  return s + `<span class="ln dbl" style="grid-column:1 / span ${span}"></span></div>`; }
const e4Fig = (a, b, op, k = 99, o = {}) => { const P = e4Plan(a, b, op), st = { a, b, mk: {}, res: {}, cross: {}, hi: -1 }; P.steps.slice(0, k).forEach(s => e4Apply(P, op, st, s)); if (k >= P.steps.length || !k) st.hi = -1; return e4ColHTML(P, op, st, o); };
const e4Res = (a, b, op) => { const P = e4Plan(a, b, op); return e4s(P.R, P.p); };
// worked example: one row per column (picture after that column)
const e4Pex = (a, b, op, t) => { const P = e4Plan(a, b, op), N = ['①', '②', '③', '④', '⑤', '⑥', '⑦'], rows = [['① ตั้งให้จุดตรงกัน', dPl(a) !== dPl(b) ? 'เติม 0 ให้ตำแหน่งเท่ากัน (0 สีจาง)' : 'หลักเดียวกันอยู่ตรงกัน', e4Fig(a, b, op, 0)]];
  P.steps.forEach((s, k) => { if (op === '−' && s.auto) return; rows.push([`${N[rows.length] || '•'} ${e4nm(P, s.i)}`, e4Txt(P, op, s).replace(/^หลัก\S+: /, ''), e4Fig(a, b, op, k + 1)]); });
  return pexStep(t, 'ตัวอย่างทีละขั้น', rows, `${fmtDec(a)} ${op} ${fmtDec(b)} = <b>${fmtDec(e4Res(a, b, op))}</b>`); };
function simE4Col(list) { // press to do one column at a time
  let idx = 0, shown = 0; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'k3-fig' }), note = fNote(), fin = h('div', { class: 'fbig p4est' }), ctl = h('div', { class: 'rowstack' });
  const draw = () => { const [a, b, op] = list[idx], P = e4Plan(a, b, op), st = { a, b, mk: {}, res: {}, cross: {}, hi: -1 }; let k = 0; fin.innerHTML = '';
    const paint = () => fig.innerHTML = e4ColHTML(P, op, st);
    note.innerHTML = `ตั้งให้<b>จุดตรงกัน</b>${dPl(a) !== dPl(b) ? ' เติม 0 ให้ตำแหน่งเท่ากัน' : ''} แล้ว${op === '+' ? 'บวก' : 'ลบ'}จากหลักขวาสุด`;
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const s = P.steps[k++]; e4Apply(P, op, st, s); note.innerHTML = e4Txt(P, op, s); sfx.pop(k);
      if (k >= P.steps.length) { st.hi = -1; btn.remove(); fin.innerHTML = `${fmtDec(a)} ${op} ${fmtDec(b)} = ${e4H(e4s(P.R, P.p))}`; sfx.ok(); if (++shown >= 1) teachDone(box); } paint(); } }, icon('right'), 'ทำหลักต่อไป');
    ctl.innerHTML = ''; ctl.append(btn, p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'โจทย์ใหม่')); paint(); };
  box.append(fig, note, ctl, fin); draw(); return box; }
function simE4Place() { // change each digit → number, words and expanded form update
  const box = h('div', { class: 'colstack' }, h6wait()), pv = h('div'), out = fNote(), d = { 1: 2, 0: 4, '-1': 1, '-2': 0, '-3': 7 }; let moves = -1;
  const str = () => `${d[1] ? d[1] : ''}${d[0]}.${d[-1]}${d[-2]}${d[-3]}`;
  const paint = () => { const s = str(); pv.innerHTML = ''; pv.append(pvChart(s, { lo: -3 }));
    const parts = [1, 0, -1, -2, -3].filter(e => +d[e]).map(e => e4val(d[e], e));
    out.innerHTML = `${e4H(s)} อ่านว่า <b>${e4Words(s)}</b><br>รูปกระจาย ${fmtDec(s)} = ${parts.join(' + ') || '0'}`; if (++moves >= 3) teachDone(box); };
  box.append(h('div', { class: 'rowstack' }, ...[[1, 'สิบ'], [0, 'หน่วย'], [-1, 'ส่วนสิบ'], [-2, 'ส่วนร้อย'], [-3, 'ส่วนพัน']].map(([e, lab]) => stepper(lab, () => d[e], x => d[e] = x, () => 0, () => 9, paint))), pv, out);
  paint(); return box; }
// a pair of decimals to compare (one digit differs · or one is cut shorter · or equal with a trailing 0)
const e4cmpPair = () => { const k = Math.random(), p = rnd(1, 3), a = e4nz(10, 999, p);
  if (k < .15) return [a, a + '0'];
  if (k < .35 && p > 1) return Math.random() < .5 ? [a, a.slice(0, -1).replace(/\.$/, '')] : [a.slice(0, -1).replace(/\.$/, ''), a];
  for (;;) { const ds = a.split(''), pos = rnd(0, ds.length - 1); if (ds[pos] === '.') continue; ds[pos] = String((+ds[pos] + rnd(1, 9)) % 10); const b = ds.join(''); if (b[0] === '0' || /\.\d*0$/.test(b)) continue; return [a, b]; } };
function simE4Cmp() { // v108 (ผู้ใช้ขอ: เดิมไม่รู้ว่าต้องทำอะไร) — the child presses “เทียบหลักต่อไป” column by column from the left, then picks > or <
  const box = h('div', { class: 'colstack' }, h6wait()), how = h('div', { class: 'p4steplab' }), tab = h('div', { class: 'e4cmp' }), out = fNote(), ctl = h('div', { class: 'rowstack' }); let n = 0;
  const show = () => { let [a, b] = e4cmpPair(); for (let g = 0; g < 4 && +a === +b; g++) [a, b] = e4cmpPair(); if (+a === +b) [a, b] = ['65.47', '65.45'];
    const P = Math.max(dPl(a), dPl(b)), I = Math.max(a.split('.')[0].length, b.split('.')[0].length), cell = (x, k) => { const [w, f = ''] = x.split('.'); const W = w.padStart(I, ' '), F = f.padEnd(P, '·'); return (W + F)[k]; };
    const cols = I + P, name = k => PV_NAME[k < I ? I - 1 - k : -(k - I + 1)]; let k = -1, done = false;
    const paint = () => { const hd = range(0, cols - 1).map(c => `<th class="${c === k ? 'cq-cur' : ''}">${name(c).replace('ส่วน', 'ส.')}</th>`).join(''), pt = c => c === I - 1 && P ? '<td class="pt">.</td>' : '', pth = c => c === I - 1 && P ? '<th></th>' : '';
      const tr = x => '<tr>' + range(0, cols - 1).map(c => { const ch = cell(x, c), z = ch === '·'; return `<td class="${c < k ? 'cq-eq' : c === k ? 'cq-cur' : ''}${z ? ' cq-z' : ''}">${ch === ' ' ? '' : z ? (c <= k ? '0' : '') : ch}</td>` + pt(c); }).join('') + '</tr>';
      const mid = '<tr class="e4cmp-m">' + range(0, cols - 1).map(c => `<td>${c < k ? '=' : c === k ? (cell(a, c).replace('·', '0').replace(' ', '0') === cell(b, c).replace('·', '0').replace(' ', '0') ? '=' : '≠') : ''}</td>` + pt(c).replace('.', '')).join('') + '</tr>';
      tab.innerHTML = `<table><tr>${range(0, cols - 1).map(c => `<th class="${c === k ? 'cq-cur' : ''}">${name(c).replace('ส่วน', 'ส.')}</th>` + pth(c)).join('')}</tr>${tr(a)}${mid}${tr(b)}</table>`; };
    const dig = (x, c) => { const ch = cell(x, c); return ch === ' ' || ch === '·' ? 0 : +ch; };
    const next = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (done) return; k++; sfx.pop(k); const da = dig(a, k), db = dig(b, k); paint();
      if (da === db) { out.innerHTML = `${'หลัก' + name(k)}: ${da} = ${db} <b>เท่ากัน</b> → เทียบหลักต่อไป` + (cell(a, k) === '·' || cell(b, k) === '·' ? '<br><small>(ช่องที่ว่างหลังจุด เติม 0 ได้ ค่าไม่เปลี่ยน)</small>' : ''); if (k >= cols - 1) { done = true; next.remove(); out.innerHTML += '<br>เท่ากันทุกหลัก'; ask(true); } return; }
      done = true; next.remove(); out.innerHTML = `${'หลัก' + name(k)}: ${da} กับ ${db} <b>ต่างกัน</b> — หลักนี้ตัดสินได้เลย`; ask(false); } }, icon('right'), 'เทียบหลักต่อไป');
    const ask = eq => { const right = eq ? '=' : +a > +b ? '>' : '<';
      ctl.append(h('div', { class: 'cap', html: `${e4H(a)} <b>?</b> ${e4H(b)} เลือกเครื่องหมาย` }), choices({ check: ok => { if (ok) { sfx.ok(); out.innerHTML += `<br>${e4H(a)} <b class="f3-sym">${right === '>' ? '&gt;' : right === '<' ? '&lt;' : '='}</b> ${e4H(b)}`; ctl.innerHTML = ''; if (++n >= 2) teachDone(box); ctl.append(p4more(show, 'คู่ใหม่')); } else { sfx.no(); out.innerHTML += '<br><small>ยังไม่ใช่ — ดูหลักที่ตัวเลขต่างกัน ตัวไหนมากกว่า</small>'; } }, say() {} },
        ['>', '<', '='].map(v => ({ value: v, label: v === '>' ? '&gt;' : v === '<' ? '&lt;' : '=' })), right)); };
    how.innerHTML = 'เทียบทีละหลัก<b>จากซ้ายไปขวา</b> · กด “เทียบหลักต่อไป” จนเจอหลักที่ตัวเลข<b>ต่างกัน</b> แล้วเลือก &gt; &lt; หรือ =';
    out.innerHTML = 'จุดทศนิยมตรงกัน หลักเดียวกันอยู่ตรงกัน'; ctl.innerHTML = ''; ctl.append(next); paint(); };
  box.append(how, tab, out, ctl); show(); return box; }

/* ---------- question types ---------- */
Object.assign(Q, {
  /* column add / subtract: the child types each column's result (the game writes carries / borrows) */
  /* v108 (ผู้ใช้ขอ): the child works ON the column like on paper — tap a result box and type the digits (right → left), check ONCE at the end ·
     different numbers of places: tap the empty box to put the 0 there yourself · + : tap the small box above a column to write the carry (1 → 0 → 1 …) ·
     − : tap a top digit to borrow from it (it goes down 1, the column on its right gets 10 more) · − / + zoom 50–200 % (calcZoom) */
  e4Col({ a, b, op }) { const eq = `${fmtDec(a)} ${op} ${fmtDec(b)}`, vb = op === '+' ? 'บวก' : 'ลบ'; // v111: the shared column board (colw.js)
    return Q.colW({ nums: [a, b], op, prompt: `ตั้ง${vb} ${eq}`, say: `${e4Words(a)} ${vb} ${e4Words(b)} ตั้ง${vb}ให้จุดตรงกัน`, sig: `e4c ${a}${op}${b}` }); },
  /* mixed + / − : step 1 then step 2 */
  e4Mix({ expr }) { const T = expr.split(' '), e1 = T.slice(0, 3).join(' '), r1 = exprEval(e1), r = exprEval(expr), e2 = `${decStr(r1)} ${T[3]} ${T[4]}`;
    const me = { prompt: `หาผลลัพธ์ ${exprHTML(expr)} <small>(ทำจากซ้ายไปขวา)</small>`, say: `หาผลลัพธ์ ${exprSay(expr)} ทำจากซ้ายไปขวา`, __sig: `e4k ${expr}`, mount(bd, ctx) {
      const log = h('div', { class: 'colstack' }), lab = h('div', { class: 'p4steplab' }), slot = h('div', { class: 'colstack' });
      const row = (n, e, v) => h('div', { class: 'fbig', html: `<small>ขั้นที่ ${n}</small> ${exprHTML(e)} <b class="fop">=</b> ${v != null ? dH(v) : '<span class="fsign">?</span>'}` });
      me.reveal = () => { log.innerHTML = ''; log.append(row(1, e1, r1), row(2, e2, r)); lab.innerHTML = ''; slot.innerHTML = ''; };
      const s2 = () => { log.append(row(2, e2)); lab.innerHTML = 'ขั้นที่ 2: นำผลจากขั้นที่ 1 ไปทำต่อ'; slot.innerHTML = ''; slot.append(decAnswer(ctx, r, { hint: 'ตั้งให้จุดตรงกัน' })); ctx.onRight = () => me.reveal(); };
      log.append(row(1, e1)); lab.innerHTML = 'ขั้นที่ 1: ทำคู่ซ้ายสุดก่อน';
      slot.append(decAnswer({ ...ctx, check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(4); log.lastChild.remove(); log.append(row(1, e1, r1)); s2(); } }, r1, { hint: 'ตั้งให้จุดตรงกัน เติม 0 ให้ตำแหน่งเท่ากัน' }));
      bd.append(h('div', { class: 't6-q p4-q' }, h('div', { class: 'p4-fig' }, log), h('div', { class: 'colstack' }, lab, slot))); } };
    return me; },
  e4Pic({ n, unit }) { const p = unit === 10 ? 1 : 2, r = DQ(e4s(n, p)), q = 'เขียนทศนิยมแสดงส่วนที่ระบายสี';
    return { prompt: q + ' <small>(1 รูปใหญ่ = 1)</small>', say: q, __sig: `e4p ${n}/${unit}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig' }, decSquares(n, unit, { sm: n > unit * 2 })),
      decAnswer(ctx, r, { places: p, hint: unit === 10 ? '1 แถบ = 0.1 (หนึ่งส่วนสิบ)' : '1 แถบ = 0.1 · 1 ช่องเล็ก = 0.01' }))); } }; },
  e4Frac({ s }) { const p = dPl(s), [a, b] = s.split('.'), mix = +a > 0 && Math.random() < .5, f = mix ? `${+a} ${+b}/${10 ** p}` : `${e4int(s, p)}/${10 ** p}`;
    return { prompt: 'เขียนให้อยู่ในรูป<span class="hl">ทศนิยม</span>', say: `เขียน ${FXsay(`[${f}]`)} ให้อยู่ในรูปทศนิยม`, __sig: `e4f ${f}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: p4big(FX(`[${f}]`)) }),
      decAnswer(ctx, DQ(s), { places: p, hint: `ตัวส่วน ${fmt(10 ** p)} → ทศนิยม ${p} ตำแหน่ง` }))); } }; },
  e4Read({ s, to }) { const [a, b] = s.split('.'), p = b.length, I = e4int(s, p);
    const nums = [...new Set([e4s(I, p < 3 ? p + 1 : p - 1), p < 3 ? `${a}.0${b}` : `${a}.${b.slice(1)}${b[0]}`, p > 1 ? e4s(I, p - 1) : `${a}${b}.${rnd(1, 9)}`])].filter(x => +x !== +s);
    const hint = 'อ่านจำนวนหน้าจุดแบบจำนวนนับ แล้วอ่าน “จุด” ตามด้วยตัวเลขหลังจุดทีละตัว';
    if (to === 'word') { const right = e4Words(s), W = [...new Set([(+a ? thaiWords(+a) : 'ศูนย์') + 'จุด' + thaiWords(+b), ...nums.map(e4Words)])].filter(x => x !== right).slice(0, 2);
      return { ...Q.p4Pick({ fig: p4big(e4H(s)), q: 'ทศนิยมนี้<span class="hl">อ่านว่า</span>อย่างไร', opts: [right, ...W], right, hint }), __sig: `e4r w ${s}` }; }
    return { ...Q.p4Pick({ fig: p4big(e4Words(s)), q: 'เขียนเป็น<span class="hl">ตัวเลข</span>ได้อย่างไร', say: `${e4Words(s)} เขียนเป็นตัวเลขได้อย่างไร`, opts: [s, ...nums.slice(0, 2)].map(fmtDec), right: fmtDec(s), hint }), __sig: `e4r n ${s}` }; },
  e4Place({ s, pos }) { const [a, b] = s.split('.'), ds = a + b, dg = +ds[pos], e = a.length - 1 - pos, L = x => `หลัก${PV_NAME[x]} มีค่า ${fmtDec(e4val(dg, x))}`, right = L(e);
    const W = [...new Set([L(e + 1), e - 1 >= -3 ? L(e - 1) : `หลัก${PV_NAME[e]} มีค่า ${dg}`, e < 0 ? `หลัก${PV_NAME[e]} มีค่า ${dg}` : `หลัก${PV_NAME[e]} มีค่า ${fmtDec(e4val(dg, e - 1))}`])].filter(x => x !== right).slice(0, 2);
    const html = [...ds].map((c, i) => (i === a.length ? '.' : '') + (i === pos ? `<u>${c}</u>` : c)).join('');
    return { ...Q.p4Pick({ fig: p4big(`<b class="dnum">${html}</b>`), q: 'เลขโดดที่<span class="hl">ขีดเส้นใต้</span>อยู่หลักใด และมีค่าเท่าใด', say: `${e4Words(s)} เลขโดด ${dg} ที่ขีดเส้นใต้อยู่หลักใด มีค่าเท่าใด`, opts: [right, ...W], right, hint: 'นับจากจุดทศนิยม: ทางซ้าย หน่วย สิบ ร้อย · ทางขวา ส่วนสิบ ส่วนร้อย ส่วนพัน' }), __sig: `e4l ${s} ${pos}` }; },
  e4Exp({ s }) { const [a, b] = s.split('.'), parts = [...a].map((c, i) => +c ? e4val(+c, a.length - 1 - i) : null).concat([...b].map((c, i) => +c ? e4val(+c, -(i + 1)) : null)).filter(Boolean), miss = rnd(0, parts.length - 1);
    return { ...Q.dFill({ q: `<b class="dnum">${fmtDec(s)}</b> = ${parts.map((x, i) => i === miss ? '☐' : fmtDec(x)).join(' + ')}`, a: parts[miss], hint: 'แยกค่าของเลขโดดทีละหลัก (เลขโดด × ค่าประจำหลัก)' }), __sig: `e4x ${s} ${miss}` }; }
});
const e4Cmp = ([l, r]) => ({ ...Q.dCmp({ l, r, hint: 'เทียบจากหลักซ้ายสุด (เติม 0 ท้ายทศนิยมให้ตำแหน่งเท่ากันได้)' }), __sig: `e4m ${l}|${r}` });
const e4Sort = (L, dir) => ({ ...Q.ixSort({ q: `เรียงทศนิยมจาก<span class="hl">${dir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}</span>`, items: L.map(s => ({ label: e4H(s), v: +s })), dir, slotLabels: L.map((_, i) => i ? '' : dir === 'asc' ? 'น้อยที่สุด' : 'มากที่สุด') }), __sig: `e4o ${dir} ${L.join()}` });
const e4SortSet = () => { const base = rnd(2, 700), S = new Map(); while (S.size < 4) { const w = base + (Math.random() < .2 ? 1 : 0), x = `${w}.${e4nz(0, .999, rnd(1, 3)).split('.')[1]}`; if (![...S.values()].some(v => +v === +x)) S.set(x, x); } return [...S.keys()]; };
const e4Calc = expr => ({ ...Q.dCalc({ expr, hint: 'ทำจากซ้ายไปขวา ตั้งให้จุดตรงกัน' }), __sig: `e4a ${expr}` });
const e4Story = s => ({ ...Q.dStory(s), __sig: 'e4t ' + s.text.slice(0, 48) });
const e4Eq = s => { const p = dPl(s), more = s + '0'.repeat(rnd(1, 2));
  return { ...Q.p4Pick({ fig: p4big(e4H(s)), q: 'ข้อใด<span class="hl">มีค่าเท่ากับ</span>ทศนิยมนี้', opts: [more, e4s(e4int(s, p), p + 1), s.replace('.', '.0')].map(fmtDec), right: fmtDec(more), hint: 'เติม 0 ต่อท้ายทศนิยม ค่าไม่เปลี่ยน' }), __sig: `e4q ${s}` }; };

/* ---------- random data ---------- */
const e4pair = (op, P, carry) => { for (let g = 0; g < 400; g++) { const pa = rnd(1, P), pb = P === 3 && pa < 3 ? 3 : rnd(1, P), a = e4nz(op === '+' ? 1 : 10, op === '+' ? 400 : 900, pa), b = e4nz(1, op === '+' ? 400 : 300, pb);
    if (op === '−' && +b >= +a) continue; const S = e4Plan(a, b, op).steps, k = op === '+' ? S.filter(s => s.carry).length : S.filter(s => s.borrow != null).length;
    if (carry === false && k) continue; if (carry === true && !k) continue; return Math.random() < .5 || op === '−' ? [a, b] : [b, a]; } return op === '+' ? ['12.4', '3.5'] : ['8.7', '2.3']; };
const e4three = () => { for (;;) { const a = e4nz(10, 200, rnd(1, 3)), b = e4nz(2, 90, rnd(1, 3)), c = e4nz(1, 60, rnd(1, 3)), o1 = pick(['+', '−']), o2 = pick(['+', '−']), e = `${a} ${o1} ${b} ${o2} ${c}`;
  if (o1 === '+' && o2 === '+') continue; const r1 = exprEval(`${a} ${o1} ${b}`), r = exprEval(e); if (r1.n <= 0 || r.n <= 0) continue; return e; } };
const D4S = (text, expr, wrong, unit) => ({ text, expr, wrong, unit });
/* 1-step stories: random numbers on fixed templates (lesson 12) */
const E4_T1 = [
  [(n, a, b) => `${n}มีเชือกยาว ${a} เมตร ตัดไปใช้ ${b} เมตร เหลือเชือกกี่เมตร`, '−', 'เมตร', [5, 30, 2], [1, 4, 2]],
  [(n, a, b) => `แม่ซื้อเนื้อหมู ${a} กิโลกรัม ซื้อเนื้อไก่ ${b} กิโลกรัม แม่ซื้อเนื้อสัตว์รวมกี่กิโลกรัม`, '+', 'กิโลกรัม', [1, 5, 3], [1, 4, 2]],
  [(n, a, b) => `${n}สูง ${a} เมตร น้องสูง ${b} เมตร ${n}สูงกว่าน้องกี่เมตร`, '−', 'เมตร', [1.3, 1.6, 2], [.9, 1.25, 2]],
  [(n, a, b) => `ถังใบแรกจุน้ำ ${a} ลิตร ถังใบที่สองจุน้ำ ${b} ลิตร ถังสองใบจุน้ำรวมกี่ลิตร`, '+', 'ลิตร', [10, 40, 1], [5, 30, 2]],
  [(n, a, b) => `${n}วิ่งได้ ${a} กิโลเมตร เพื่อนวิ่งได้มากกว่า${n} ${b} กิโลเมตร เพื่อนวิ่งได้กี่กิโลเมตร`, '+', 'กิโลเมตร', [1, 5, 3], [0, 2, 2]],
  [(n, a, b) => `กระสอบข้าวหนัก ${a} กิโลกรัม ตักออกไป ${b} กิโลกรัม เหลือข้าวกี่กิโลกรัม`, '−', 'กิโลกรัม', [15, 50, 1], [1, 9, 3]],
  [(n, a, b) => `${n}มีเงิน ${a} บาท ซื้อขนม ${b} บาท เหลือเงินกี่บาท`, '−', 'บาท', [50, 300, 0], [10, 49, 2]],
  [(n, a, b) => `ระยะทางจากบ้านไปวัด ${a} กิโลเมตร จากวัดไปตลาด ${b} กิโลเมตร รวมระยะทางกี่กิโลเมตร`, '+', 'กิโลเมตร', [1, 9, 2], [1, 6, 3]],
  [(n, a, b) => `กล่องใบแรกหนัก ${a} กิโลกรัม กล่องใบที่สองหนัก ${b} กิโลกรัม กล่องใบแรกหนักกว่ากี่กิโลกรัม`, '−', 'กิโลกรัม', [5, 12, 3], [1, 4.9, 2]],
  [(n, a, b) => `${n}ดื่มนม ${a} ลิตร น้องดื่มนม ${b} ลิตร ทั้งสองคนดื่มนมรวมกี่ลิตร`, '+', 'ลิตร', [.2, .9, 2], [.1, .8, 3]]];
const e4StGen1 = () => { const [f, op, u, A, B] = pick(E4_T1), n = pick(E4_NM); let a, b; do { a = e4nz(A[0], A[1], A[2]); b = e4nz(B[0], B[1], B[2]); } while (op === '−' && +b >= +a);
  return e4Story(D4S(f(n, fmtDec(a), fmtDec(b)), `${a} ${op} ${b}`, op === '+' ? [`${a} − ${b}`] : [`${a} + ${b}`, `${b} + ${b}`], u)); };
/* 2-step stories (lesson 14) */
const E4_T2 = [
  [(n, a, b, c) => `${n}มีเงิน ${a} บาท ซื้อสมุด ${b} บาท ซื้อดินสอ ${c} บาท เหลือเงินกี่บาท`, '− −', 'บาท', [100, 500, 0], [20, 90, 2], [5, 19, 2]],
  [(n, a, b, c) => `ถังมีน้ำ ${a} ลิตร เติมน้ำอีก ${b} ลิตร แล้วใช้ไป ${c} ลิตร เหลือน้ำกี่ลิตร`, '+ −', 'ลิตร', [10, 30, 1], [5, 20, 2], [3, 15, 3]],
  [(n, a, b, c) => `เชือกยาว ${a} เมตร ตัดไป ${b} เมตร แล้วนำเชือกยาว ${c} เมตรมาต่อ เชือกยาวกี่เมตร`, '− +', 'เมตร', [8, 20, 1], [1, 7, 2], [1, 5, 3]],
  [(n, a, b, c) => `ร้านขายน้ำตาลวันแรก ${a} กิโลกรัม วันที่สอง ${b} กิโลกรัม วันที่สาม ${c} กิโลกรัม รวมขายน้ำตาลกี่กิโลกรัม`, '+ +', 'กิโลกรัม', [10, 40, 2], [5, 30, 1], [2, 20, 3]],
  [(n, a, b, c) => `${n}เดินทาง ${a} กิโลเมตร แล้วเดินทางต่ออีก ${b} กิโลเมตร ระยะทางทั้งหมด ${c} กิโลเมตร เหลือระยะทางอีกกี่กิโลเมตร`, '+ swap', 'กิโลเมตร', [5, 20, 2], [3, 15, 1], [40, 60, 1]],
  [(n, a, b, c) => `ผ้ายาว ${a} เมตร ตัดไปทำเสื้อ ${b} เมตร ทำกระโปรง ${c} เมตร เหลือผ้ากี่เมตร`, '− −', 'เมตร', [10, 25, 1], [1, 4, 2], [1, 3, 2]]];
const e4StGen2 = () => { for (;;) { const [f, ops, u, A, B, C] = pick(E4_T2), n = pick(E4_NM), a = e4nz(...A), b = e4nz(...B), c = e4nz(...C); let expr, wrong;
    if (ops === '+ swap') { expr = `${c} − ${a} − ${b}`; wrong = [`${a} + ${b} + ${c}`, `${c} − ${a} + ${b}`]; }
    else { const [o1, o2] = ops.split(' '), fl = o => o === '+' ? '−' : '+'; expr = `${a} ${o1} ${b} ${o2} ${c}`; wrong = [`${a} ${o1} ${b} ${fl(o2)} ${c}`, `${a} ${fl(o1)} ${b} ${o2} ${c}`]; }
    const r = exprEval(expr), r1 = exprEval(expr.split(' ').slice(0, 3).join(' ')); if (r.n <= 0 || r1.n <= 0) continue;
    return e4Story(D4S(f(n, fmtDec(a), fmtDec(b), fmtDec(c)), expr, wrong, u)); } };
/* fixed stories for the show-your-working lessons (13, 15) */
const E4_ST1 = [D4S('ต้นข้าวหนัก 32.5 กิโลกรัม น้องหนัก 24.8 กิโลกรัม ต้นข้าวหนักกว่าน้องกี่กิโลกรัม', '32.5 − 24.8', ['32.5 + 24.8'], 'กิโลกรัม'),
  D4S('แม่ซื้อผ้าสีแดง 3.75 เมตร ผ้าสีฟ้า 2.4 เมตร รวมซื้อผ้ากี่เมตร', '3.75 + 2.4', ['3.75 − 2.4'], 'เมตร'),
  D4S('น้ำในโอ่งมี 48.25 ลิตร ใช้ไป 19.6 ลิตร เหลือน้ำกี่ลิตร', '48.25 − 19.6', ['48.25 + 19.6'], 'ลิตร'),
  D4S('ต้นมะม่วงสูง 4.35 เมตร ต้นขนุนสูงกว่าต้นมะม่วง 1.8 เมตร ต้นขนุนสูงกี่เมตร', '4.35 + 1.8', ['4.35 − 1.8'], 'เมตร'),
  D4S('มะลิวิ่งวันแรก 2.375 กิโลเมตร วันที่สอง 3.25 กิโลเมตร รวมวิ่งกี่กิโลเมตร', '2.375 + 3.25', ['3.25 − 2.375'], 'กิโลเมตร'),
  D4S('ถุงข้าวหนัก 15 กิโลกรัม แบ่งไปหุง 2.75 กิโลกรัม เหลือข้าวกี่กิโลกรัม', '15 − 2.75', ['15 + 2.75'], 'กิโลกรัม'),
  D4S('ลวดยาว 12.6 เมตร ตัดไปทำรั้ว 7.85 เมตร เหลือลวดกี่เมตร', '12.6 − 7.85', ['12.6 + 7.85'], 'เมตร'),
  D4S('ฝนตกวันจันทร์ 18.45 มิลลิเมตร วันอังคาร 23.7 มิลลิเมตร ฝนตกรวมกี่มิลลิเมตร', '18.45 + 23.7', ['23.7 − 18.45'], 'มิลลิเมตร'),
  D4S('มะม่วงถุงแรกหนัก 1.350 กิโลกรัม ถุงที่สองหนัก 1.81 กิโลกรัม ถุงที่สองหนักกว่าถุงแรกกี่กิโลกรัม', '1.81 − 1.350', ['1.81 + 1.350'], 'กิโลกรัม'),
  D4S('จากบ้านถึงตลาด 3.4 กิโลเมตร จากตลาดถึงโรงเรียน 1.95 กิโลเมตร รวมระยะทางกี่กิโลเมตร', '3.4 + 1.95', ['3.4 − 1.95'], 'กิโลเมตร'),
  D4S('ขวดใหญ่มีน้ำมัน 1.5 ลิตร ขวดเล็กมีน้ำมัน 0.625 ลิตร ขวดใหญ่มีมากกว่ากี่ลิตร', '1.5 − 0.625', ['1.5 + 0.625'], 'ลิตร'),
  D4S('ภูผาเก็บมะขามได้ 6.8 กิโลกรัม ก้องเก็บได้ 5.45 กิโลกรัม รวมเก็บได้กี่กิโลกรัม', '6.8 + 5.45', ['6.8 − 5.45'], 'กิโลกรัม')];
const E4_ST2 = [D4S('มีเงิน 500 บาท ซื้อหนังสือ 125.50 บาท ซื้อปากกา 38.75 บาท เหลือเงินกี่บาท', '500 − 125.50 − 38.75', ['500 − 125.50 + 38.75', '125.50 + 38.75'], 'บาท'),
  D4S('น้ำผลไม้ขวดแรก 1.25 ลิตร ขวดที่สอง 0.75 ลิตร ดื่มไป 1.6 ลิตร เหลือกี่ลิตร', '1.25 + 0.75 − 1.6', ['1.25 + 0.75 + 1.6', '1.25 − 0.75 + 1.6'], 'ลิตร'),
  D4S('ผ้ายาว 20 เมตร ตัดชุดแรก 4.85 เมตร ชุดที่สอง 6.3 เมตร เหลือผ้ากี่เมตร', '20 − 4.85 − 6.3', ['20 − 4.85 + 6.3', '4.85 + 6.3'], 'เมตร'),
  D4S('วายุหนัก 35.6 กิโลกรัม ชาติชายหนักกว่าวายุ 2.75 กิโลกรัม ทั้งสองคนหนักรวมกันกี่กิโลกรัม', '35.6 + 35.6 + 2.75', ['35.6 + 2.75', '35.6 − 2.75'], 'กิโลกรัม'),
  D4S('รถวิ่ง 45.5 กิโลเมตร แล้ววิ่งต่ออีก 38.25 กิโลเมตร ยังเหลืออีก 16.4 กิโลเมตรจึงถึง ระยะทางทั้งหมดกี่กิโลเมตร', '45.5 + 38.25 + 16.4', ['45.5 + 38.25 − 16.4', '45.5 − 38.25 + 16.4'], 'กิโลเมตร'),
  D4S('แม่มีน้ำตาล 3.5 กิโลกรัม ซื้อเพิ่ม 1.25 กิโลกรัม ใช้ทำขนม 2.875 กิโลกรัม เหลือน้ำตาลกี่กิโลกรัม', '3.5 + 1.25 − 2.875', ['3.5 − 1.25 − 2.875', '3.5 + 1.25 + 2.875'], 'กิโลกรัม'),
  D4S('ไม้ยาว 6.4 เมตร ตัดออก 1.75 เมตร แล้วต่อไม้อีกท่อนยาว 2.3 เมตร ไม้ยาวกี่เมตร', '6.4 − 1.75 + 2.3', ['6.4 + 1.75 + 2.3', '6.4 − 1.75 − 2.3'], 'เมตร'),
  D4S('ถังมีน้ำ 25.5 ลิตร เติมอีก 12.75 ลิตร ใช้ล้างรถ 18.4 ลิตร เหลือน้ำกี่ลิตร', '25.5 + 12.75 − 18.4', ['25.5 + 12.75 + 18.4', '25.5 − 12.75 − 18.4'], 'ลิตร'),
  D4S('ส้มหนัก 2.45 กิโลกรัม มังคุดหนักน้อยกว่าส้ม 0.8 กิโลกรัม ผลไม้ทั้งสองอย่างหนักรวมกี่กิโลกรัม', '2.45 + 2.45 − 0.8', ['2.45 − 0.8', '2.45 + 0.8'], 'กิโลกรัม'),
  D4S('มีเงิน 250 บาท ได้ค่าขนมเพิ่ม 75.50 บาท ซื้อของเล่น 189.25 บาท เหลือเงินกี่บาท', '250 + 75.50 − 189.25', ['250 − 75.50 − 189.25', '250 + 75.50 + 189.25'], 'บาท'),
  D4S('แพรวามีริบบิ้น 8.6 เมตร ใช้ผูกของขวัญ 2.45 เมตร และ 3.125 เมตร เหลือริบบิ้นกี่เมตร', '8.6 − 2.45 − 3.125', ['8.6 − 2.45 + 3.125', '2.45 + 3.125'], 'เมตร'),
  D4S('กานดาซื้อแตงโม 3.25 กิโลกรัม สับปะรด 1.8 กิโลกรัม แล้วแบ่งให้เพื่อน 2.375 กิโลกรัม เหลือผลไม้กี่กิโลกรัม', '3.25 + 1.8 − 2.375', ['3.25 + 1.8 + 2.375', '3.25 − 1.8 − 2.375'], 'กิโลกรัม')];
const e4SeqGen = S => { const [x, op, y] = S.expr.split(' '), r = dTxt(exprEval(S.expr));
  return { ...Q.p4Seq({ text: S.text, cards: [`ประโยคสัญลักษณ์ ${fmtDec(x)} ${op} ${fmtDec(y)} = □`, `วิธีทำ ตั้ง${op === '+' ? 'บวก' : 'ลบ'}ให้จุดตรงกัน`, `${fmtDec(x)} ${op} ${fmtDec(y)} = ${r}`, `ตอบ ${r} ${S.unit}`] }), __sig: 'e4s ' + S.text.slice(0, 48) }; };
const e4SeqGen2 = S => { const T = S.expr.split(' '), r1 = dTxt(exprEval(T.slice(0, 3).join(' '))), r = dTxt(exprEval(S.expr));
  return { ...Q.p4Seq({ text: S.text, cards: [`ประโยคสัญลักษณ์ ${T.map(x => /\d/.test(x) ? fmtDec(x) : x).join(' ')} = □`, `ขั้นที่ 1: ${fmtDec(T[0])} ${T[1]} ${fmtDec(T[2])} = ${r1}`, `ขั้นที่ 2: ${r1} ${T[3]} ${fmtDec(T[4])} = ${r}`, `ตอบ ${r} ${S.unit}`] }), __sig: 'e4u ' + S.text.slice(0, 48) }; };
const e4Split = (pool, nSeq, nStory, seq) => { const S = pkF(pool, nSeq + nStory); return [...S.slice(0, nSeq).map(seq), ...S.slice(nSeq).map(e4Story)]; };

/* ---------- lessons ---------- */
const L4E = (no, place, title, short, goal, teach, game) => ({ id: 1440 + no, place, title, short, tone: TONES5[(no + 4) % 6], goal, teach, game, learned: true });
const e4N = (k, f) => Array.from({ length: k }, f);
const e4fig = (s, lo, mark) => { const w = h('div'); w.append(pvChart(s, { lo: lo || -dPl(s), mark })); return w.innerHTML; };
const e4sq = (n, unit, o = {}) => decSquares(n, unit, o).outerHTML;
const e4sb = t => `<div class="storybox">${t}</div>`;
const e4pic10 = () => { const n = rnd(1, 29); return n % 10 ? n : n + 3; }, e4pic100 = () => { const n = rnd(3, 199); return n % 10 ? n : n + 7; };
const LESSONS_P4C7 = [
  L4E(1, 'บ่อส่วนสิบ', 'การอ่านและการเขียนทศนิยม 1 ตำแหน่งแสดงปริมาณของสิ่งต่างๆ', 'ทศนิยม 1 ตำแหน่ง', 'อ่านและเขียนทศนิยม 1 ตำแหน่ง จากรูปและจากเศษส่วนที่มีตัวส่วนเป็น 10',
    [...learnStep('ยินดีต้อนรับสู่ <b>ทะเลทรายทศนิยม</b>!', 'ยินดีต้อนรับสู่ทะเลทรายทศนิยม', [
      { fig: e4sq(3, 10), name: 'ส่วนสิบ', text: 'แบ่ง 1 เป็น 10 ส่วนเท่า ๆ กัน ระบาย 3 ส่วน = [3/10] เขียนเป็นทศนิยม 0.3' },
      { fig: p4big('0.3'), name: 'จุดทศนิยม', text: 'อ่านว่า ศูนย์จุดสาม · ตัวเลขหลังจุด 1 ตัว = ทศนิยม 1 ตำแหน่ง' },
      { fig: e4sq(17, 10), name: 'มากกว่า 1', text: '1 รูปเต็ม กับ [7/10] = 1.7 อ่านว่า หนึ่งจุดเจ็ด' }], 'ส่วนสิบ เขียนเป็นทศนิยม 1 ตำแหน่ง'),
     pexStep('ตัวอย่างทีละขั้น: ส่วนที่ระบายสี', 'ตัวอย่างทีละขั้น', [['① นับรูปเต็ม', '2 รูปเต็ม → 2', e4sq(20, 10)], ['② นับแถบ', 'อีก 6 แถบ → [6/10] = 0.6', e4sq(26, 10)], ['③ เขียนรวม', '[2 6/10] = 2.6', p4big(FX('[2 6/10]') + ' = 2.6')]], '<b>2.6</b> อ่านว่า สองจุดหก'),
     T('ลองปรับหน่วยและส่วนสิบ', 'ลองปรับหน่วยและส่วนสิบ', el => el.append(simDecGrid({ unit: 10, w: 1, t: 4 })))],
    () => [...e4N(2, () => Q.e4Pic({ n: e4pic10(), unit: 10 })), ...e4N(2, () => Q.e4Frac({ s: e4nz(0, 30, 1) })), Q.e4Read({ s: e4nz(1, 99, 1), to: pick(['word', 'num']) })]),
  L4E(2, 'บ่อส่วนร้อย', 'การอ่านและการเขียนทศนิยม 2 ตำแหน่งแสดงปริมาณของสิ่งต่างๆ', 'ทศนิยม 2 ตำแหน่ง', 'อ่านและเขียนทศนิยม 2 ตำแหน่ง จากรูปและจากเศษส่วนที่มีตัวส่วนเป็น 100',
    [...learnStep('<b>ส่วนร้อย</b>', 'ส่วนร้อย', [
      { fig: e4sq(7, 100), name: '1 ช่องเล็ก = 0.01', text: 'แบ่ง 1 เป็น 100 ช่อง ระบาย 7 ช่อง = [7/100] = 0.07' },
      { fig: e4sq(35, 100), name: '3 แถบ 5 ช่อง', text: '[35/100] = 0.35 อ่านว่า ศูนย์จุดสามห้า' }], 'ส่วนร้อย เขียนเป็นทศนิยม 2 ตำแหน่ง'),
     pexStep('ตัวอย่างทีละขั้น: ส่วนที่ระบายสี', 'ตัวอย่างทีละขั้น', [['① รูปเต็ม', '1 รูปเต็ม → 1', e4sq(100, 100)], ['② แถบ', '4 แถบ = 0.4', e4sq(140, 100)], ['③ ช่องเล็ก', '2 ช่อง = 0.02', e4sq(142, 100)]], 'รวม <b>1.42</b> อ่านว่า หนึ่งจุดสี่สอง'),
     T('ลองปรับหน่วย ส่วนสิบ ส่วนร้อย', 'ลองปรับหน่วย ส่วนสิบ ส่วนร้อย', el => el.append(simDecGrid({ unit: 100, w: 0, t: 3, hh: 5 })))],
    () => [...e4N(2, () => Q.e4Pic({ n: e4pic100(), unit: 100 })), ...e4N(2, () => Q.e4Frac({ s: e4nz(0, 99, 2) })), Q.e4Read({ s: e4nz(1, 99, 2), to: pick(['word', 'num']) })]),
  L4E(3, 'บ่อส่วนพัน', 'การอ่านและการเขียนทศนิยมไม่เกิน 3 ตำแหน่งแสดงปริมาณของสิ่งต่างๆ', 'ทศนิยม 3 ตำแหน่ง', 'อ่านและเขียนทศนิยมไม่เกิน 3 ตำแหน่ง และรู้ว่าเติม 0 ต่อท้ายทศนิยมค่าไม่เปลี่ยน',
    [...learnStep('<b>ส่วนพัน</b>', 'ส่วนพัน', [
      { fig: e4fig('0.005', -3), name: 'ทศนิยม 3 ตำแหน่ง', text: '[5/1000] = 0.005 อ่านว่า ศูนย์จุดศูนย์ศูนย์ห้า' },
      { fig: e4fig('45.862', -3), name: 'อ่านทีละตัวหลังจุด', text: '45.862 อ่านว่า สี่สิบห้าจุดแปดหกสอง' }], 'ส่วนพัน เขียนเป็นทศนิยม 3 ตำแหน่ง'),
     pexStep('ตัวอย่างทีละขั้น: 3487/1000', 'ตัวอย่างทีละขั้น', [['① ดูตัวส่วน', 'ตัวส่วน 1,000 → ทศนิยม 3 ตำแหน่ง', p4big(FX('[3487/1000]'))], ['② เขียน', '[3487/1000] = [3 487/1000] = 3.487', e4fig('3.487', -3)]], '<b>3.487</b> อ่านว่า สามจุดสี่แปดเจ็ด'),
     T('ลองปรับเลขโดดทีละหลัก', 'ลองปรับเลขโดดทีละหลัก', el => el.append(simE4Place())),
     learnStep('เรื่องใหม่: <b>ทศนิยมที่เท่ากัน</b>', 'เรื่องใหม่ ทศนิยมที่เท่ากัน', [
       { fig: e4sq(60, 100), name: '0.6 = 0.60', text: '6 แถบ ระบายเท่ากับ 60 ช่องเล็ก' },
       { fig: p4big('1.6 = 1.60 = 1.600'), name: 'เติม 0 ต่อท้าย', text: 'เติม 0 ท้ายทศนิยม ค่าไม่เปลี่ยน' }], 'เติม 0 ท้ายทศนิยม ได้ทศนิยมที่เท่ากัน'),
     pexStep('ตัวอย่างทีละขั้น: 0.4 กับ 0.40', 'ตัวอย่างทีละขั้น ทศนิยมที่เท่ากัน', [['① 0.4', '4 ส่วนสิบ = 4 แถบ', e4sq(4, 10)], ['② 0.40', '40 ส่วนร้อย = 40 ช่องเล็ก', e4sq(40, 100)]], 'ระบายเท่ากัน → <b>0.4 = 0.40</b>')],
    () => [...e4N(2, () => Q.e4Frac({ s: e4nz(0, 99, 3) })), ...e4N(2, () => Q.e4Read({ s: e4nz(1, 999, 3), to: pick(['word', 'num']) })), e4Eq(e4nz(1, 99, rnd(1, 2)))]),
  L4E(4, 'หอคอยค่าประจำหลัก', 'หลัก ค่าประจำหลัก และการเขียนทศนิยมในรูปกระจาย', 'หลักและรูปกระจาย', 'บอกหลัก ค่าประจำหลัก ค่าของเลขโดด และเขียนทศนิยมในรูปกระจาย',
    [...learnStep('<b>หลักของทศนิยม</b>', 'หลักของทศนิยม', [
      { fig: e4fig('43.139', -3, [-1, -2, -3]), name: 'ทางขวาของจุด', text: 'ส่วนสิบ (0.1) · ส่วนร้อย (0.01) · ส่วนพัน (0.001)' },
      { fig: e4fig('43.139', -3, [-3]), name: 'ค่าของเลขโดด', text: '9 ในหลักส่วนพัน มีค่า 0.009' }], 'ค่าของเลขโดด = เลขโดด × ค่าประจำหลัก'),
     pexStep('ตัวอย่างทีละขั้น: เลข 4 ใน 15.467', 'ตัวอย่างทีละขั้น', [['① หาหลัก', 'ตัวแรกหลังจุด → หลักส่วนสิบ', e4fig('15.467', -3, [-1])], ['② หาค่า', '4 × 0.1 = 0.4', p4big('4 → 0.4')]], 'เลข 4 อยู่หลักส่วนสิบ มีค่า <b>0.4</b>'),
     learnStep('เรื่องใหม่: <b>รูปกระจาย</b>', 'เรื่องใหม่ รูปกระจาย', [
       { fig: e4fig('12.75', -2), name: 'แยกค่าทีละหลัก', text: '12.75 = 10 + 2 + 0.7 + 0.05' },
       { fig: p4big('0 ไม่ต้องเขียน'), name: 'หลักที่เป็น 0', text: '30.08 = 30 + 0.08' }], 'รูปกระจาย = ผลบวกของค่าเลขโดดทุกหลัก'),
     pexStep('ตัวอย่างทีละขั้น: รูปกระจาย 376.802', 'ตัวอย่างทีละขั้น รูปกระจาย', [['① จำนวนนับ', '300 + 70 + 6', e4fig('376.802', -3, [2, 1, 0])], ['② ทศนิยม', '0.8 + 0.002 (0 ในหลักส่วนร้อยไม่ต้องเขียน)', e4fig('376.802', -3, [-1, -3])]], '376.802 = 300 + 70 + 6 + 0.8 + 0.002'),
     T('ลองปรับเลขโดดทีละหลัก', 'ลองปรับเลขโดดทีละหลัก', el => el.append(simE4Place()))],
    () => [...e4N(3, () => { const s = e4nz(10, 999, 3), ds = s.replace('.', ''); let pos; do pos = rnd(0, ds.length - 1); while (ds[pos] === '0'); return Q.e4Place({ s, pos }); }), ...e4N(3, () => Q.e4Exp({ s: e4nz(10, 999, rnd(2, 3)) }))]),
  L4E(5, 'ลานตาชั่งทศนิยม', 'การเปรียบเทียบทศนิยม และใช้เครื่องหมาย < หรือ > แสดงการเปรียบเทียบ การเรียงลำดับทศนิยมไม่เกิน 3 ตำแหน่ง', 'เปรียบเทียบ เรียงลำดับ', 'เปรียบเทียบและเรียงลำดับทศนิยมไม่เกิน 3 ตำแหน่ง',
    [...learnStep('<b>เปรียบเทียบทศนิยม</b>', 'เปรียบเทียบทศนิยม', [
      { fig: `<div class="colstack">${e4fig('65.47', -2, [-2])}${e4fig('65.45', -2, [-2])}</div>`, name: 'เทียบจากหลักซ้าย', text: '6 = 6 · 5 = 5 · 4 = 4 · 7 &gt; 5 → 65.47 &gt; 65.45' },
      { fig: p4big('56.8 → 56.800'), name: 'เติม 0 ให้ตำแหน่งเท่ากัน', text: '56.800 &gt; 56.792' }], 'เทียบจำนวนนับก่อน แล้วเทียบทีละหลักจากซ้าย'),
     pexStep('ตัวอย่างทีละขั้น: 13.93 กับ 13.930', 'ตัวอย่างทีละขั้น', [['① เติม 0', '13.93 = 13.930', e4fig('13.930', -3)], ['② เทียบทุกหลัก', 'เท่ากันทุกหลัก', p4big('13.93 = 13.930')]], '13.93 <b>=</b> 13.930'),
     T('ลองเทียบทีละหลัก', 'ลองเทียบทีละหลัก', el => el.append(simE4Cmp())),
     learnStep('เรื่องใหม่: <b>เรียงลำดับทศนิยม</b>', 'เรื่องใหม่ เรียงลำดับทศนิยม', [
       { fig: p4big('83.401 · 83.27 · 83.376 · 83.2'), name: 'เติม 0 ให้ครบ 3 ตำแหน่ง', text: '83.401 · 83.270 · 83.376 · 83.200' },
       { fig: p4big('83.2 &lt; 83.27 &lt; 83.376 &lt; 83.401'), name: 'แล้วเรียง', text: 'จากน้อยไปมาก' }], 'ทำให้ตำแหน่งเท่ากันก่อน แล้วจึงเรียง'),
     pexStep('ตัวอย่างทีละขั้น: เรียงจากมากไปน้อย', 'ตัวอย่างทีละขั้น เรียงจากมากไปน้อย', [['① เติม 0', '5.74 → 5.740 · 5.6 → 5.600', p4big('5.740 · 5.600 · 5.844')], ['② เรียง', 'ส่วนสิบ 8 &gt; 7 &gt; 6', p4big('5.844 &gt; 5.74 &gt; 5.6')]], 'มากไปน้อย: <b>5.844 , 5.74 , 5.6</b>')],
    () => [...e4N(4, () => e4Cmp(e4cmpPair())), e4Sort(e4SortSet(), pick(['asc', 'desc']))]),
  L4E(6, 'บ่อบวกไม่ทด', 'การบวกทศนิยมไม่เกิน 2 ตำแหน่งที่ไม่มีการทด', 'บวก (ไม่ทด)', 'บวกทศนิยมไม่เกิน 2 ตำแหน่งที่ไม่มีการทด โดยตั้งให้จุดตรงกัน',
    [...learnStep('<b>ตั้งบวกทศนิยม</b>', 'ตั้งบวกทศนิยม', [
      { fig: e4Fig('12.14', '35.44', '+', 0), name: 'จุดตรงกัน', text: 'หลักเดียวกันอยู่ตรงกัน' },
      { fig: e4Fig('12.14', '35.44', '+'), name: 'บวกจากขวาไปซ้าย', text: '12.14 + 35.44 = 47.58 ใส่จุดให้ตรงกัน' }], 'ตั้งให้จุดตรงกัน แล้วบวกเหมือนจำนวนนับ'),
     e4Pex('23.41', '15.36', '+', 'ตัวอย่างทีละขั้น: 23.41 + 15.36'),
     T('ลองกดบวกทีละหลัก', 'ลองกดบวกทีละหลัก', el => el.append(simE4Col([['4.5', '32.24', '+'], ['60.07', '18.6', '+'], ['51.3', '7.25', '+']]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.e4Col({ a: '31.25', b: '46.4', op: '+' }), 'ถูกต้อง!')))],
    () => e4N(5, () => { const [a, b] = e4pair('+', 2, false); return Q.e4Col({ a, b, op: '+' }); })),
  L4E(7, 'บ่อบวกมีทด', 'การบวกทศนิยมไม่เกิน 2 ตำแหน่งที่มีการทด', 'บวก (มีทด)', 'บวกทศนิยมไม่เกิน 2 ตำแหน่งที่มีการทด',
    [...learnStep('<b>บวกมีทด</b>', 'บวกมีทด', [
      { fig: e4Fig('32.09', '78.74', '+', 1), name: 'ครบ 10 ทดไปหลักซ้าย', text: '9 + 4 = 13 → เขียน 3 ทด 1' },
      { fig: e4Fig('32.09', '78.74', '+'), name: 'ทดข้ามจุดได้', text: '32.09 + 78.74 = 110.83' }], 'ทดเหมือนจำนวนนับ ทดข้ามจุดทศนิยมได้'),
     e4Pex('3.9', '3.3', '+', 'ตัวอย่างทีละขั้น: 3.9 + 3.3'),
     T('ลองกดบวกทีละหลัก', 'ลองกดบวกทีละหลัก', el => el.append(simE4Col([['86.75', '44.95', '+'], ['49.58', '24.6', '+'], ['7.86', '5.47', '+']]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.e4Col({ a: '57.68', b: '28.45', op: '+' }), 'ถูกต้อง!')))],
    () => e4N(5, () => { const [a, b] = e4pair('+', 2, true); return Q.e4Col({ a, b, op: '+' }); })),
  L4E(8, 'บ่อบวกสามตำแหน่ง', 'การบวกทศนิยมไม่เกิน 3 ตำแหน่ง', 'บวก 3 ตำแหน่ง', 'บวกทศนิยมไม่เกิน 3 ตำแหน่ง เติม 0 ให้ตำแหน่งเท่ากัน',
    [...learnStep('ตำแหน่ง<b>ไม่เท่ากัน</b>', 'ตำแหน่งไม่เท่ากัน', [
      { fig: e4Fig('24.81', '35.114', '+', 0), name: 'เติม 0 ให้เท่ากัน', text: '24.81 = 24.810 (0 ที่เติมเป็นสีจาง)' },
      { fig: e4Fig('24.81', '35.114', '+'), name: 'แล้วบวก', text: '24.810 + 35.114 = 59.924' }], 'จุดตรงกัน เติม 0 ให้ตำแหน่งเท่ากัน'),
     e4Pex('3.409', '48.478', '+', 'ตัวอย่างทีละขั้น: 3.409 + 48.478'),
     T('ลองกดบวกทีละหลัก', 'ลองกดบวกทีละหลัก', el => el.append(simE4Col([['40.089', '93.68', '+'], ['94.98', '49', '+'], ['8.6', '2.475', '+']]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.e4Col({ a: '62.728', b: '24.55', op: '+' }), 'ถูกต้อง!')))],
    () => e4N(5, () => { const [a, b] = e4pair('+', 3); return Q.e4Col({ a, b, op: '+' }); })),
  L4E(9, 'บ่อลบไม่กระจาย', 'การลบทศนิยมไม่เกิน 3 ตำแหน่งที่ไม่มีการกระจาย', 'ลบ (ไม่กระจาย)', 'ลบทศนิยมไม่เกิน 3 ตำแหน่งที่ไม่มีการกระจาย',
    [...learnStep('<b>ตั้งลบทศนิยม</b>', 'ตั้งลบทศนิยม', [
      { fig: e4Fig('88.465', '74.23', '−', 0), name: 'จุดตรงกัน เติม 0', text: '74.23 = 74.230' },
      { fig: e4Fig('88.465', '74.23', '−'), name: 'ลบจากขวาไปซ้าย', text: '88.465 − 74.230 = 14.235' }], 'ตั้งให้จุดตรงกัน แล้วลบเหมือนจำนวนนับ'),
     e4Pex('9.86', '4.53', '−', 'ตัวอย่างทีละขั้น: 9.86 − 4.53'),
     T('ลองกดลบทีละหลัก', 'ลองกดลบทีละหลัก', el => el.append(simE4Col([['94.377', '3.2', '−'], ['74.487', '21.055', '−'], ['6.95', '2.4', '−']]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.e4Col({ a: '57.869', b: '23.45', op: '−' }), 'ถูกต้อง!')))],
    () => e4N(5, () => { const [a, b] = e4pair('−', 3, false); return Q.e4Col({ a, b, op: '−' }); })),
  L4E(10, 'บ่อลบกระจาย', 'การลบทศนิยมไม่เกิน 3 ตำแหน่งที่มีการกระจาย', 'ลบ (มีกระจาย)', 'ลบทศนิยมไม่เกิน 3 ตำแหน่งที่มีการกระจาย (รวมการกระจายผ่าน 0)',
    [...learnStep('<b>ลบมีกระจาย</b>', 'ลบมีกระจาย', [
      { fig: e4Fig('5.42', '1.68', '−', 1), name: 'ลบไม่ได้ ต้องกระจาย', text: '2 − 8 ไม่ได้ → กระจาย 1 จากหลักส่วนสิบ: 12 − 8 = 4' },
      { fig: e4Fig('6.003', '2.47', '−', 2), name: 'กระจายผ่าน 0', text: 'หลักที่เป็น 0 ระหว่างทางกลายเป็น 9' }], 'ลบไม่ได้ → กระจาย 1 จากหลักทางซ้าย'),
     e4Pex('5.42', '1.68', '−', 'ตัวอย่างทีละขั้น: 5.42 − 1.68'),
     T('ลองกดลบทีละหลัก', 'ลองกดลบทีละหลัก', el => el.append(simE4Col([['6.003', '2.47', '−'], ['52.35', '27.8', '−'], ['40.5', '18.763', '−']]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.e4Col({ a: '73.204', b: '35.68', op: '−' }), 'ถูกต้อง!')))],
    () => e4N(5, () => { const [a, b] = e4pair('−', 3, true); return Q.e4Col({ a, b, op: '−' }); })),
  L4E(11, 'ลานระคน', 'การบวก ลบระคนทศนิยมไม่เกิน 3 ตำแหน่ง', 'บวก ลบระคน', 'หาผลลัพธ์ของการบวก ลบระคนทศนิยม โดยทำจากซ้ายไปขวา',
    [...learnStep('<b>บวก ลบระคน</b>', 'บวก ลบระคน', [
      { fig: p4big('12.5 + 3.75 − 8.2'), name: 'ทำจากซ้ายไปขวา', text: 'ทำ 12.5 + 3.75 = 16.25 ก่อน' },
      { fig: p4big('16.25 − 8.2 = 8.05'), name: 'แล้วทำต่อ', text: 'ตั้งให้จุดตรงกันทุกครั้ง' }], 'ไม่มีวงเล็บ ทำจากซ้ายไปขวา'),
     pexStep('ตัวอย่างทีละขั้น: 30 − 12.75 − 6.4', 'ตัวอย่างทีละขั้น', [['① ซ้ายสุดก่อน', '30 − 12.75 = 17.25', e4Fig('30', '12.75', '−')], ['② ทำต่อ', '17.25 − 6.4 = 10.85', e4Fig('17.25', '6.4', '−')]], '30 − 12.75 − 6.4 = <b>10.85</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.e4Mix({ expr: '8.5 + 2.75 − 4.125' }), 'ถูกต้อง!')))],
    () => [...e4N(3, () => Q.e4Mix({ expr: e4three() })), ...e4N(2, () => e4Calc(e4three()))]),
  L4E(12, 'เนินโจทย์ทศนิยม', 'การแก้โจทย์ปัญหาการบวก โจทย์ปัญหาการลบของทศนิยมไม่เกิน 3 ตำแหน่ง (1 ขั้นตอน)', 'โจทย์ 1 ขั้นตอน', 'วิเคราะห์โจทย์ปัญหาการบวกและการลบทศนิยม 1 ขั้นตอน เขียนประโยคสัญลักษณ์และหาคำตอบ',
    [...learnStep('<b>โจทย์ปัญหาทศนิยม</b>', 'โจทย์ปัญหาทศนิยม', [
      { fig: e4sb('ปลาตัวแรกหนัก 2.6 กิโลกรัม ตัวที่สองหนัก 1.85 กิโลกรัม ตัวแรกหนักกว่ากี่กิโลกรัม'), name: 'โจทย์ถามอะไร', text: 'หนักกว่ากี่กิโลกรัม → ใช้การลบ' },
      { fig: p4big('2.6 − 1.85 = 0.75'), name: 'ประโยคสัญลักษณ์', text: 'ตอบ 0.75 กิโลกรัม' }], 'รวม เพิ่ม → บวก · เหลือ มากกว่ากี่ → ลบ'),
     pexStep('ตัวอย่างทีละขั้น: โจทย์การบวก', 'ตัวอย่างทีละขั้น', [['① อ่านโจทย์', 'ข้าวเหนียว 1.25 กก. ข้าวเจ้า 3.5 กก. รวมกี่กิโลกรัม → บวก', e4sb('ข้าวเหนียว 1.25 กิโลกรัม ข้าวเจ้า 3.5 กิโลกรัม รวมกี่กิโลกรัม')], ['② ประโยคสัญลักษณ์', '1.25 + 3.5 = □', p4big('1.25 + 3.5 = □')], ['③ หาคำตอบ', 'ตั้งบวกให้จุดตรงกัน', e4Fig('1.25', '3.5', '+')]], 'ตอบ <b>4.75</b> กิโลกรัม'),
     T('ลองทำเอง', 'ลองทำเอง', p4story('แตงโมหนัก 4.3 กิโลกรัม ฟักทองหนัก 2.65 กิโลกรัม แตงโมหนักกว่าฟักทองกี่กิโลกรัม', e4sq(43, 10, { sm: true }), [{ q: 'เลือกประโยคสัญลักษณ์', opts: ['4.3 − 2.65', '4.3 + 2.65', '2.65 − 4.3'], right: '4.3 − 2.65', unit: 'กิโลกรัม', why: 'หนักกว่ากี่กิโลกรัม → ลบ' }], 'แตงโมหนักกว่า <b>1.65</b> กิโลกรัม'))],
    () => e4N(5, e4StGen1)),
  L4E(13, 'เนินแสดงวิธีทำ', 'การแสดงวิธีทำโจทย์ปัญหาการบวก โจทย์ปัญหาการลบของทศนิยมไม่เกิน 3 ตำแหน่ง', 'แสดงวิธีทำ 1 ขั้นตอน', 'แสดงวิธีทำโจทย์ปัญหาการบวกและการลบทศนิยม 1 ขั้นตอน',
    [...learnStep('<b>แสดงวิธีทำ</b>', 'แสดงวิธีทำ', [
      { fig: p4big('ประโยคสัญลักษณ์'), name: '① เขียนประโยคสัญลักษณ์', text: 'จากสิ่งที่โจทย์บอกและสิ่งที่โจทย์ถาม' },
      { fig: p4big('วิธีทำ'), name: '② วิธีทำ', text: 'ตั้งบวกหรือตั้งลบ ให้จุดตรงกัน' },
      { fig: p4big('ตอบ … หน่วย'), name: '③ ตอบพร้อมหน่วย', text: 'อย่าลืมหน่วย' }], 'ประโยคสัญลักษณ์ → วิธีทำ → ตอบพร้อมหน่วย'),
     pexStep('ตัวอย่างทีละขั้น: แสดงวิธีทำ', 'ตัวอย่างทีละขั้น', [['① โจทย์', 'น้ำแข็ง 9.5 กก. ละลายไป 3.75 กก. เหลือกี่กิโลกรัม', e4sb('น้ำแข็งหนัก 9.5 กิโลกรัม ละลายไป 3.75 กิโลกรัม เหลือน้ำแข็งกี่กิโลกรัม')], ['② ประโยคสัญลักษณ์', '9.5 − 3.75 = □', p4big('9.5 − 3.75 = □')], ['③ วิธีทำ', 'ตั้งลบให้จุดตรงกัน', e4Fig('9.5', '3.75', '−')], ['④ ตอบ', 'ตอบ 5.75 กิโลกรัม', p4big('ตอบ 5.75 กิโลกรัม')]], 'เขียนครบ 4 บรรทัด'),
     T('ลองเรียงวิธีทำ', 'ลองเรียงวิธีทำ', el => el.append(qSim(e4SeqGen(D4S('เชือกยาว 7.2 เมตร ใช้ไป 2.85 เมตร เหลือเชือกกี่เมตร', '7.2 − 2.85', [], 'เมตร')), 'ถูกต้อง!')))],
    () => e4Split(E4_ST1, 2, 3, e4SeqGen)),
  L4E(14, 'ยอดเนินสองขั้น', 'การแก้โจทย์ปัญหาการบวก โจทย์ปัญหาการลบของทศนิยมไม่เกิน 3 ตำแหน่ง (2 ขั้นตอน)', 'โจทย์ 2 ขั้นตอน', 'วิเคราะห์โจทย์ปัญหาการบวกและการลบทศนิยม 2 ขั้นตอน',
    [...learnStep('โจทย์ <b>2 ขั้นตอน</b>', 'โจทย์สองขั้นตอน', [
      { fig: e4sb('มีเงิน 200 บาท ซื้อนม 35.50 บาท ซื้อขนมปัง 24.75 บาท เหลือเงินกี่บาท'), name: 'ขั้นที่ 1', text: '200 − 35.50 = 164.50' },
      { fig: p4big('164.50 − 24.75 = 139.75'), name: 'ขั้นที่ 2', text: 'ตอบ 139.75 บาท' }], 'แยกเป็น 2 ขั้น แล้วทำทีละขั้น'),
     pexStep('ตัวอย่างทีละขั้น: โจทย์ 2 ขั้นตอน', 'ตัวอย่างทีละขั้น', [['① อ่านโจทย์', 'ทราย 5.5 กก. เติม 2.25 กก. ใช้ไป 4.6 กก.', e4sb('มีทราย 5.5 กิโลกรัม เติมอีก 2.25 กิโลกรัม ใช้ไป 4.6 กิโลกรัม เหลือทรายกี่กิโลกรัม')], ['② ขั้นที่ 1', '5.5 + 2.25 = 7.75', e4Fig('5.5', '2.25', '+')], ['③ ขั้นที่ 2', '7.75 − 4.6 = 3.15', e4Fig('7.75', '4.6', '−')]], 'เหลือทราย <b>3.15</b> กิโลกรัม'),
     T('ลองทำเอง', 'ลองทำเอง', p4story('ผ้ายาว 18 เมตร ตัดชุดแรก 3.65 เมตร ชุดที่สอง 5.2 เมตร เหลือผ้ากี่เมตร', p4big('18 ม.'), [{ q: 'ขั้นที่ 1: ตัดชุดแรกแล้วเหลือ', opts: ['18 − 3.65', '18 + 3.65', '3.65 − 18'], right: '18 − 3.65', unit: 'เมตร', why: 'ตัดออก → ลบ' }, { q: 'ขั้นที่ 2: ตัดชุดที่สองแล้วเหลือ', opts: ['14.35 − 5.2', '14.35 + 5.2', '18 − 5.2'], right: '14.35 − 5.2', unit: 'เมตร', why: 'ใช้ผลจากขั้นที่ 1' }], 'เหลือผ้า <b>9.15</b> เมตร'))],
    () => e4N(5, e4StGen2)),
  L4E(15, 'ผาแสดงวิธีทำสองขั้น', 'การแสดงวิธีทำโจทย์ปัญหาการบวก โจทย์ปัญหาการลบของทศนิยมไม่เกิน 3 ตำแหน่ง (2 ขั้นตอน)', 'แสดงวิธีทำ 2 ขั้นตอน', 'แสดงวิธีทำโจทย์ปัญหาการบวกและการลบทศนิยม 2 ขั้นตอน',
    [...learnStep('แสดงวิธีทำ <b>2 ขั้นตอน</b>', 'แสดงวิธีทำสองขั้นตอน', [
      { fig: p4big('ประโยคสัญลักษณ์'), name: '① ประโยคสัญลักษณ์', text: 'เขียนทั้งสองขั้นในประโยคเดียว' },
      { fig: p4big('ขั้นที่ 1 → ขั้นที่ 2'), name: '② วิธีทำทีละขั้น', text: 'นำผลขั้นที่ 1 ไปทำขั้นที่ 2' },
      { fig: p4big('ตอบ … หน่วย'), name: '③ ตอบพร้อมหน่วย', text: '' }], 'ประโยคสัญลักษณ์ → ขั้นที่ 1 → ขั้นที่ 2 → ตอบ'),
     pexStep('ตัวอย่างทีละขั้น: แสดงวิธีทำ 2 ขั้นตอน', 'ตัวอย่างทีละขั้น', [['① ประโยคสัญลักษณ์', 'แป้ง 4.5 กก. ซื้อเพิ่ม 1.75 กก. ใช้ไป 3.125 กก.', p4big('4.5 + 1.75 − 3.125 = □')], ['② ขั้นที่ 1', '4.5 + 1.75 = 6.25', e4Fig('4.5', '1.75', '+')], ['③ ขั้นที่ 2', '6.25 − 3.125 = 3.125', e4Fig('6.25', '3.125', '−')], ['④ ตอบ', 'ตอบ 3.125 กิโลกรัม', p4big('ตอบ 3.125 กิโลกรัม')]], 'เหลือแป้ง <b>3.125</b> กิโลกรัม'),
     T('ลองเรียงวิธีทำ', 'ลองเรียงวิธีทำ', el => el.append(qSim(e4SeqGen2(D4S('มีเงิน 150 บาท ซื้อสมุด 42.50 บาท ซื้อปากกา 18.25 บาท เหลือเงินกี่บาท', '150 − 42.50 − 18.25', [], 'บาท')), 'ถูกต้อง!')))],
    () => e4Split(E4_ST2, 2, 3, e4SeqGen2))
];

/* ---------- boss ---------- */
const e4X = (q, opts, lv, fig) => ({ q, fig, opts, a: 0, lv });
const EXAM_P4C7 = d6spread([
  e4X('ส่วนที่ระบายสีเขียนเป็นทศนิยมได้อย่างไร', ['1.4', '0.14', '14', '4.1'], 1441, e4sq(14, 10, { sm: true })),
  e4X(`${FX('[67/100]')} เขียนเป็นทศนิยมได้อย่างไร`, ['0.67', '6.7', '0.067', '67.0'], 1442),
  e4X('“สิบสองจุดศูนย์สี่ห้า” เขียนเป็นตัวเลขได้อย่างไร', ['12.045', '12.45', '12.405', '120.45'], 1443),
  e4X('ข้อใดมีค่าเท่ากับ 3.7', ['3.700', '3.07', '0.37', '3.007'], 1443),
  e4X('ใน 58.396 เลขโดด 9 อยู่ในหลักใด และมีค่าเท่าใด', ['หลักส่วนร้อย มีค่า 0.09', 'หลักส่วนสิบ มีค่า 0.9', 'หลักส่วนพัน มีค่า 0.009', 'หลักส่วนร้อย มีค่า 9'], 1444),
  e4X('204.507 เขียนในรูปกระจายได้อย่างไร', ['200 + 4 + 0.5 + 0.007', '200 + 4 + 0.5 + 0.07', '200 + 40 + 0.5 + 0.007', '20 + 4 + 0.5 + 0.007'], 1444),
  e4X('ข้อใดถูกต้อง', ['72.48 > 72.408', '72.48 < 72.408', '72.48 = 72.408'], 1445),
  e4X('ข้อใดเรียงจากน้อยไปมาก', ['9.08 , 9.8 , 9.86', '9.8 , 9.08 , 9.86', '9.86 , 9.8 , 9.08'], 1445),
  e4X('42.15 + 36.42 = ?', ['78.57', '78.75', '77.57', '68.57'], 1446),
  e4X('57.86 + 26.75 = ?', ['84.61', '83.61', '84.51', '73.61'], 1447),
  e4X('38.6 + 145.275 = ?', ['183.875', '183.275', '531.275', '184.875'], 1448),
  e4X('68.749 − 25.3 = ?', ['43.449', '68.496', '43.719', '41.449'], 1449),
  e4X('70.4 − 26.875 = ?', ['43.525', '44.525', '43.535', '56.471'], 1450),
  e4X('15.6 + 8.25 − 9.475 = ?', ['14.375', '33.325', '14.475', '15.375'], 1451),
  e4X('มีน้ำ 12.5 ลิตร ใช้ไป 4.75 ลิตร เหลือน้ำกี่ลิตร', ['7.75 ลิตร', '8.75 ลิตร', '17.25 ลิตร', '7.25 ลิตร'], 1452),
  e4X('ต้นสักสูง 6.85 เมตร ต้นยางสูงกว่าต้นสัก 2.4 เมตร ต้นยางสูงกี่เมตร', ['9.25 เมตร', '4.45 เมตร', '8.25 เมตร', '9.09 เมตร'], 1452),
  e4X('ข้อใดเป็นประโยคสัญลักษณ์ของโจทย์ “ถุงแรกหนัก 2.5 กก. ถุงที่สองหนัก 3.75 กก. รวมหนักเท่าไร”', ['2.5 + 3.75 = □', '3.75 − 2.5 = □', '2.5 + 2.5 = □'], 1453),
  e4X('มีเงิน 300 บาท ซื้อขนม 45.50 บาท ซื้อนม 28.75 บาท เหลือเงินกี่บาท', ['225.75 บาท', '254.50 บาท', '74.25 บาท', '226.75 บาท'], 1454),
  e4X('ข้าวสาร 8.5 กก. ซื้อเพิ่ม 2.25 กก. หุงไป 3.125 กก. เหลือข้าวสารกี่กิโลกรัม', ['7.625 กิโลกรัม', '13.875 กิโลกรัม', '3.125 กิโลกรัม', '6.625 กิโลกรัม'], 1454),
  e4X('การแสดงวิธีทำโจทย์ 2 ขั้นตอน ควรเรียงอย่างไร', ['ประโยคสัญลักษณ์ → ขั้นที่ 1 → ขั้นที่ 2 → ตอบ', 'ตอบ → ขั้นที่ 2 → ขั้นที่ 1', 'ขั้นที่ 2 → ประโยคสัญลักษณ์ → ตอบ'], 1455)]);
LESSONS_P4C7.push({ id: 1459, boss: true, place: 'รังแมงป่องทศนิยม', title: 'ด่านบอส: บทที่ 7 ทศนิยม', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'คำถามท้ายบท 20 ข้อ (อ่าน เขียน หลัก รูปกระจาย · เปรียบเทียบ เรียงลำดับ · บวก ลบ · โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P4C7, pass: 10, bossName: 'แมงป่องทศนิยม', bossPal: 'mint', emblem: '0.1', bossKind: 'scorp',
  winLine: 'ชนะแมงป่องทศนิยมแล้ว! เก่งเรื่องทศนิยมมาก', loseLine: 'แมงป่องทศนิยมยังไม่ยอมแพ้ กลับไปทวนแล้วสู้ใหม่นะ!' });
