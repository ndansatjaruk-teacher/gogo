/* =========================================================
   ป.5 บทที่ 2 ทศนิยม — decimal helpers, answer pad, question types (d…),
   interactive simulations and levels 541–562 + boss 569
   (builds on the exact-rational engine in p5.js: Rr, decR, decStr, exprEval …)
   ========================================================= */
const DQ = s => decR(String(s));                                   // "2.75" → exact rational
const dPl = s => (String(s).split('.')[1] || '').length;            // decimal places written
const dTxt = r => fmtDec(decStr(r));                                // rational → "1,234.5"
const dH = r => `<span class="fr"><b class="fw">${dTxt(r)}</b></span>`;
const dFix = (r, p) => { const m = 10 ** p, q = Math.floor((2 * r.n * m + r.d) / (2 * r.d)), s = String(q).padStart(p + 1, '0'); return p ? s.slice(0, -p) + '.' + s.slice(-p) : s; }; // round half-up, p places
const PLACE_TH = ['จำนวนเต็มหน่วย', 'ทศนิยม 1 ตำแหน่ง', 'ทศนิยม 2 ตำแหน่ง', 'ทศนิยม 3 ตำแหน่ง'];
const PV_NAME = { 4: 'หมื่น', 3: 'พัน', 2: 'ร้อย', 1: 'สิบ', 0: 'หน่วย', '-1': 'ส่วนสิบ', '-2': 'ส่วนร้อย', '-3': 'ส่วนพัน', '-4': 'ส่วนหมื่น' };
const DCOL = ['#6FB2F5', '#FFC24C', '#4FD1A1', '#FF7B86', '#B9A6F5', '#7FD3E6', '#F7A8D8', '#A8D86F'];
const dExprSay = e => exprSay(e);

/* ---------- place-value chart ---------- */
function pvDigits(str) { const [a, b = ''] = String(str).replace(/,/g, '').split('.'), o = {}; [...a].reverse().forEach((c, i) => o[i] = c); [...b].forEach((c, i) => o[-(i + 1)] = c); return o; }
function pvChart(str, o = {}) {
  const dg = pvDigits(str), ks = Object.keys(dg).map(Number), hi = Math.max(o.hi != null ? o.hi : 0, ...ks), lo = Math.min(o.lo != null ? o.lo : -1, ...ks), t = h('div', { class: 'pvc' });
  for (let e = hi; e >= lo; e--) {
    t.append(h('div', { class: 'pv-col' + (e < 0 ? ' dec' : '') + ((o.mark || []).includes(e) ? ' mark' : '') }, h('span', { class: 'pv-h' }, PV_NAME[e]), h('b', { class: 'pv-d', style: { animationDelay: (hi - e) * .08 + 's' } }, dg[e] != null ? dg[e] : '0')));
    if (e === 0) t.append(h('div', { class: 'pv-pt' }, h('span', { class: 'pv-h' }, ' '), h('b', null, '.')));
  }
  return t;
}

/* ---------- base-ten squares: 1 square = 1 whole, columns = tenths, cells = hundredths ---------- */
function decSquares(n, unit, o = {}) {
  const wholes = Math.max(o.min || 1, Math.ceil(n / unit)), w = h('div', { class: 'dsq-row' + (o.sm ? ' sm' : '') });
  for (let k = 0; k < wholes; k++) {
    let s = `<svg viewBox="-1.5 -1.5 103 103" class="dsq" data-k="${k}" aria-hidden="true">`;
    for (let i = 0; i < unit; i++) {
      const idx = k * unit + i, on = idx < n, x = unit === 10 ? i * 10 : Math.floor(i / 10) * 10, y = unit === 10 ? 0 : (i % 10) * 10, hh = unit === 10 ? 100 : 10;
      s += `<rect data-i="${idx}" x="${x}" y="${y}" width="10" height="${hh}" fill="${on ? (o.col ? o.col(idx) : DCOL[0]) : '#fff'}" stroke="${unit === 10 ? '#8F86B3' : '#C9C2DD'}" stroke-width="${unit === 10 ? .9 : .6}"/>`;
    }
    if (unit === 100) for (let c = 1; c < 10; c++) s += `<path d="M${c * 10} 0 V100" stroke="#8F86B3" stroke-width=".9"/>`;
    w.insertAdjacentHTML('beforeend', s + `<rect x="0" y="0" width="100" height="100" fill="none" stroke="#2B2550" stroke-width="1.8" rx="1"/></svg>`);
  }
  return w;
}

/* ---------- decimal answer pad (keypad with a decimal point) ---------- */
function decAnswer(ctx, exp, opts = {}) {
  let v = ''; const slot = h('div', { class: 'ans-slot dslot' }, '?'), msg = h('div', { class: 'pad-msg' }), wrap = h('div', { class: 'ans dans ia' });
  const show = () => { slot.textContent = v === '' ? '?' : fmtDec(v); slot.classList.toggle('filled', v !== ''); };
  const press = c => { if (wrap.classList.contains('done')) return; sfx.tap(); msg.textContent = '';
    if (c === '.') { if (v.includes('.')) return; v = (v === '' ? '0' : v) + '.'; }
    else { if (v.replace('.', '').length >= 9) return; v = v === '0' ? String(c) : v + c; }
    show(); };
  const back = () => { sfx.tap(); v = v.slice(0, -1); show(); };
  function submit() {
    if (wrap.classList.contains('done')) return;
    if (v === '' || v === '0.') { msg.textContent = 'กดตัวเลขก่อนนะ'; return; }
    const val = DQ(v.endsWith('.') ? v.slice(0, -1) : v), same = rEq(val, exp);
    if (same && opts.places != null && dPl(v.replace(/\.$/, '')) !== opts.places) { ctx.check(false, opts.places ? `ค่าถูกแล้ว แต่ต้องเขียนให้มีทศนิยม ${opts.places} ตำแหน่ง (เติม 0 ได้)` : 'ค่าถูกแล้ว แต่ต้องตอบเป็นจำนวนเต็มหน่วย ไม่ต้องมีจุดทศนิยม'); return; }
    if (same) { wrap.classList.add('done'); msg.textContent = ''; ctx.check(true); return; }
    ctx.check(false, opts.hint); if (!wrap.classList.contains('revealed')) { v = ''; show(); } // 3rd miss: the correct answer stays in the ? slot
  }
  const kp = h('div', { class: 'keypad' });
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: () => press(d) }, d)));
  kp.append(h('button', { class: 'btn kdot', 'aria-label': 'จุดทศนิยม', onclick: () => press('.') }, '.'), h('button', { class: 'btn', onclick: () => press(0) }, '0'), h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: back }, icon('left')),
    h('button', { class: 'btn primary ok', 'aria-label': 'ส่งคำตอบ', onclick: submit }, icon('check')));
  const key = e => { if (!wrap.isConnected) { removeEventListener('keydown', key); return; } if (e.target.closest && e.target.closest('input,textarea')) return;
    if (/^[0-9]$/.test(e.key)) press(+e.key); else if (e.key === '.' || e.key === ',') press('.'); else if (e.key === 'Backspace') back(); else if (e.key === 'Enter') { e.preventDefault(); submit(); } };
  addEventListener('keydown', key);
  wrap.reveal = () => { v = opts.places != null ? dFix(exp, opts.places) : decStr(exp); show(); wrap.classList.add('done', 'revealed'); }; wrap.ansText = decStr(exp);
  show(); wrap.append(slot, kp, msg);
  return opts.unit ? h('div', { class: 'rowstack' }, wrap, h('span', { class: 'cap', style: { fontSize: '20px' } }, opts.unit)) : wrap;
}
const dOps = expr => /÷/.test(expr) && /×/.test(expr) || /[+−]/.test(expr) && /[×÷]/.test(expr) ? 'ทำในวงเล็บก่อน แล้วคูณ หาร ก่อน บวก ลบ (ซ้ายไปขวา)'
  : /÷ (10|100|1000)\b/.test(expr) ? 'หารด้วย 10 100 1,000 → เลื่อนจุดทศนิยมไปทางซ้าย 1 2 3 ตำแหน่ง'
  : /× (10|100|1000)\b|\b(10|100|1000) ×/.test(expr) ? 'คูณด้วย 10 100 1,000 → เลื่อนจุดทศนิยมไปทางขวา 1 2 3 ตำแหน่ง'
  : /÷/.test(expr) ? 'ตั้งหารเหมือนจำนวนนับ ใส่จุดทศนิยมของผลหารให้ตรงกับตัวตั้ง (ถ้าหารไม่ลงตัว เติม 0 ต่อท้ายแล้วหารต่อ)'
  : 'คูณแบบจำนวนนับ แล้วนับตำแหน่งทศนิยมของตัวตั้งกับตัวคูณรวมกัน ใส่จุดในผลคูณ';

/* =========================================================
   QUESTION TYPES (prefix d…)
   ========================================================= */
Object.assign(Q, {
  /* fraction → decimal */
  dFrac({ f }) {
    const L = litParse(f).lit, r = FR(f), T = [10, 100, 1000].find(t => t % L.d === 0), T2 = [10, 100, 1000].find(t => t % r.d === 0);
    const hint = T ? (L.d === T ? `ตัวส่วนเป็น ${fmt(T)} → ทศนิยม ${String(T).length - 1} ตำแหน่ง` : `ทำตัวส่วนเป็น ${fmt(T)}: คูณทั้งตัวเศษและตัวส่วนด้วย ${T / L.d}`) : `ทำเป็นเศษส่วนอย่างต่ำก่อน แล้วทำตัวส่วนเป็น ${fmt(T2)}`;
    return { prompt: `เขียน ${FX(`[${f}]`)} ให้อยู่ในรูป<span class="hl">ทศนิยม</span>`, say: `เขียน ${FXsay(`[${f}]`)} ให้อยู่ในรูปทศนิยม`,
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'fbig', html: `${litHTML(L)} <b class="fop">=</b> <span class="fsign">?</span>` }), decAnswer(ctx, r, { hint })));
        ctx.onRight = () => { const q = bd.querySelector('.fbig .fsign'); if (q) q.outerHTML = dH(r); }; } };
  },
  /* match fractions with decimals */
  dMatch({ pairs }) {
    return { prompt: 'จับคู่<span class="hl">เศษส่วน</span>กับ<span class="hl">ทศนิยม</span>ที่มีค่าเท่ากัน', say: 'จับคู่เศษส่วนกับทศนิยมที่มีค่าเท่ากัน',
      mount(bd, ctx) { bd.append(matchBoard(ctx, shuffle(pairs.map(([f], i) => ({ key: i, label: FX(`[${f}]`) }))), shuffle(pairs.map(([, d], i) => ({ key: i, label: `<b class="dnum">${fmtDec(d)}</b>` }))), { hint: 'ทำตัวส่วนเป็น 10, 100 หรือ 1,000 ก่อน แล้วเขียนเป็นทศนิยม' }));
        bd.querySelectorAll('.mi').forEach(m => m.classList.add('fopt')); } };
  },
  /* rounding */
  dRound({ x, p, line = false }) {
    const r = DQ(x), ans = dFix(r, p), names = ['ส่วนสิบ', 'ส่วนร้อย', 'ส่วนพัน'];
    return { prompt: `ค่าประมาณของ <b class="dnum">${fmtDec(x)}</b> เป็น<span class="hl">${PLACE_TH[p]}</span> คือเท่าไร?`, say: `ค่าประมาณของ ${decSay(x)} เป็น${PLACE_TH[p]} คือเท่าไร`,
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, line ? roundLine(x, p, { still: true }) : h('div', { class: 'fbig', html: `<b class="dnum">${fmtDec(x)}</b> <b class="fop">≈</b> <span class="fsign">?</span>` }),
        decAnswer(ctx, DQ(ans), { places: p, hint: `ดูตัวเลขหลัก${names[p]}: ตั้งแต่ 5 ขึ้นไป ปัดขึ้น · น้อยกว่า 5 ปัดทิ้ง` })));
        ctx.onRight = () => { const q = bd.querySelector('.fbig .fsign'); if (q) q.outerHTML = `<b class="dnum">${fmtDec(ans)}</b>`; }; } };
  },
  /* pick one option (labels may be expressions) */
  dPick({ q, opts, right, hint, say: sy, keep }) {
    const lab = o => /^[\d.,\s+−×÷()]+$/.test(o) && /[+−×÷]/.test(o) ? exprHTML(o) : /^\[/.test(o) ? FX(o) : `<span class="dtxt">${FX(o)}</span>`;
    return { prompt: FX(q), say: sy || FXsay(q), mount(bd, ctx) { bd.append(choices(ctx, (keep ? opts : shuffle(opts)).map(o => ({ value: o, label: lab(o) })), right, { hint })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  /* calculate */
  dCalc({ expr, hint }) {
    const ans = exprEval(expr);
    return { prompt: `หาผลลัพธ์ ${exprHTML(expr)}`, say: `หาผลลัพธ์ ${exprSay(expr)}`,
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'fbig', html: exprHTML(expr) + ' <b class="fop">=</b> <span class="fsign">?</span>' }), decAnswer(ctx, ans, { hint: hint || dOps(expr) })));
        ctx.onRight = () => { const q = bd.querySelector('.fbig .fsign'); if (q) q.outerHTML = dH(ans); }; } };
  },
  /* where does the decimal point go in the product? */
  dPoint({ a, b }) {
    const pl = dPl(a) + dPl(b), P = String(+a.replace('.', '') * +b.replace('.', '')).padStart(pl + 1, '0'), right = P.length - pl, ans = exprEval(`${a} × ${b}`);
    return { prompt: `${exprHTML(`${a} × ${b}`)} คูณแบบจำนวนนับได้ <b class="dnum">${P}</b><br>แตะช่องที่ต้อง<span class="hl">ใส่จุดทศนิยม</span>`, say: `${decSay(a)} คูณ ${decSay(b)} แตะช่องที่ต้องใส่จุดทศนิยม`,
      mount(bd, ctx) { const row = h('div', { class: 'dpt ia' });
        [...P].forEach((c, i) => { if (i) { const g = h('button', { class: 'dpt-gap', 'aria-label': 'ใส่จุดตรงนี้' }); g.onclick = e => { e.stopPropagation(); if (row.dataset.done) return;
          if (i === right) { row.dataset.done = 1; g.classList.add('on'); sfx.ok(); ctx.check(true); } else { g.classList.remove('bad'); void g.offsetWidth; g.classList.add('bad'); ctx.check(false, `${fmtDec(a)} มีทศนิยม ${dPl(a)} ตำแหน่ง · ${fmtDec(b)} มีทศนิยม ${dPl(b)} ตำแหน่ง → ผลคูณมีทศนิยม ${pl} ตำแหน่ง (นับจากขวา)`); } }; row.append(g); }
          row.append(h('b', { class: 'dpt-d' }, c)); });
        bd.append(h('div', { class: 'colstack' }, row, h('div', { class: 'cap' }, 'แตะช่องว่างระหว่างตัวเลข')));
        ctx.onRight = () => row.after(h('div', { class: 'fbig', html: `${exprHTML(`${a} × ${b}`)} <b class="fop">=</b> ${dH(ans)}` })); } };
  },
  /* compare two expressions / numbers */
  dCmp({ l, r, hint }) {
    const A = exprEval(l), B = exprEval(r), rel = relOf(A, B);
    return { prompt: 'เติมเครื่องหมาย &gt; &lt; หรือ = ให้ถูกต้อง', say: `เปรียบเทียบ ${exprSay(l)} กับ ${exprSay(r)}`,
      mount(bd, ctx) { const blank = h('span', { class: 'fsign' }, '?');
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'fcmp dcmp' }, h('span', { html: exprHTML(l) }), blank, h('span', { html: exprHTML(r) })),
          SIGN_OPTS(ctx, rel, o => { blank.textContent = o.value; blank.classList.add('filled'); }, hint || 'หาผลลัพธ์ทั้งสองข้างก่อน หรือดูว่าตัวคูณข้างไหนมากกว่า'))); } };
  },
  /* a × ☐ = res  (☐ is 10, 100 or 1,000) */
  dMiss({ a, res, op = '×' }) {
    const k = op === '×' ? rDiv(DQ(res), DQ(a)) : rDiv(DQ(a), DQ(res)), right = decStr(k);
    return { prompt: `${op === '×' ? 'คูณ' : 'หาร'}ด้วยจำนวนใด จึงได้ผลลัพธ์ตามนี้?`, say: `${decSay(a)} ${op === '×' ? 'คูณ' : 'หาร'} อะไร ได้ ${decSay(res)}`,
      mount(bd, ctx) { bd.append(h('div', { class: 'fbig', html: `<b class="dnum">${fmtDec(a)}</b> <b class="fop">${op}</b> <span class="fsign">?</span> <b class="fop">=</b> <b class="dnum">${fmtDec(res)}</b>` }));
        ctx.onRight = () => { const q = bd.querySelector('.fbig .fsign'); if (q) q.outerHTML = `<b class="dnum">${fmt(+right)}</b>`; };
        bd.append(choices(ctx, ['10', '100', '1000'].map(x => ({ value: x, label: `<span class="num">${fmt(+x)}</span>` })), right, { hint: 'นับว่าจุดทศนิยมเลื่อนไปกี่ตำแหน่ง: 1 ตำแหน่ง = 10 · 2 ตำแหน่ง = 100 · 3 ตำแหน่ง = 1,000' })); } };
  },
  /* fill in a number (unit conversions etc.) */
  dFill({ q, a, hint, say: sy }) {
    const ans = DQ(a);
    return { prompt: 'เติมตัวเลขแทน <span class="fsign sm">?</span> ให้ถูกต้อง', say: sy || q.replace(/☐/g, 'เท่าไร').replace(/<[^>]+>/g, ''),
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'fbig dfill', html: q.replace('☐', '<span class="fsign">?</span>') }), decAnswer(ctx, ans, { hint })));
        ctx.onRight = () => { const s = bd.querySelector('.fbig .fsign'); if (s) s.outerHTML = `<b class="dnum">${dTxt(ans)}</b>`; }; } };
  },
  /* word problem: ① choose the number sentence ② compute (decimal answer) */
  dStory({ text, expr, wrong = [], unit = '' }) {
    const ans = exprEval(expr), opts = shuffle([expr, ...wrong].slice(0, 3));
    /* the story sits once, in the card — the bubble only says what to do (ผู้ใช้เจอโจทย์ซ้ำ 2 ครั้งในหน้าเดียว) */
    return { prompt: 'อ่านโจทย์ แล้วเลือก<b>ประโยคสัญลักษณ์</b>', say: text.replace(/<[^>]+>/g, ''), story: text,
      mount(bd, ctx) { const step2 = h('div', { class: 'colstack', style: { display: 'none' } });
        const ch = choices({ check: (ok, hint) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; sfx.pop(5); ctx.say('ใช่แล้ว! คำนวณหาคำตอบเลย'); } else ctx.check(false, hint); } }, opts.map(o => ({ value: o, label: exprHTML(o) })), expr, { hint: 'อ่านทีละประโยค: รวม/เพิ่ม → บวก · เหลือ/ต่างกัน → ลบ · หลายชุดเท่า ๆ กัน → คูณ · แบ่งเท่า ๆ กัน/เฉลี่ย → หาร' });
        ch.querySelectorAll('.opt').forEach(o => o.classList.add('fopt'));
        step2.append(h('div', { class: 'fbig one-line', html: exprHTML(expr) + ' <b class="fop">=</b> <span class="fsign">?</span>' }), decAnswer(ctx, ans, { hint: dOps(expr), unit }));
        const cap = h('div', { class: 'cap' }, '① เลือกประโยคสัญลักษณ์'); ch.addEventListener('click', () => setTimeout(() => { if (step2.style.display !== 'none') cap.style.display = 'none'; }), true);
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'storybox dsbox', html: text }), cap, ch, step2)); ctx.onRight = () => { const q = step2.querySelector('.fsign'); if (q) q.outerHTML = dH(ans); }; } };
  }
});

/* =========================================================
   TEACHING SIMULATIONS (decimals)
   ========================================================= */
/* build a decimal on base-ten squares: steppers for ones / tenths / hundredths, or tap a cell */
function simDecGrid({ unit = 100, w = 0, t = 2, hh = 5 } = {}) {
  let W = w, Tn = t, Hn = unit === 100 ? hh : 0; const box = h('div', { class: 'ia dsq-ia' }), big = h('div', { class: 'fbig' }), pv = h('div'), out = fNote();
  const total = () => W * unit + Tn * (unit / 10) + Hn;
  const draw = () => { box.innerHTML = ''; box.append(decSquares(total(), unit, { min: 2, col: i => i < W * unit ? '#9F8FF0' : DCOL[0] }));
    big.innerHTML = `${W ? `<span class="fr"><b class="fw">${W}</b>${fqHTML(total() - W * unit, unit)}</span>` : fqHTML(total(), unit)} <b class="fop">=</b> <b class="dnum">${unit === 100 ? `${W}.${Tn}${Hn}` : `${W}.${Tn}`}</b>`;
    pv.innerHTML = ''; pv.append(pvChart(unit === 100 ? `${W}.${Tn}${Hn}` : `${W}.${Tn}`, { lo: unit === 100 ? -2 : -1 }));
    out.innerHTML = unit === 100 ? `${W ? `${W} หน่วย · ` : ''}${Tn} แถบ (ส่วนสิบ) · ${Hn} ช่อง (ส่วนร้อย) → 1 ช่อง = ${fqHTML(1, 100)} = 0.01` : `${W ? `${W} หน่วย · ` : ''}${Tn} แถบ → 1 แถบ = ${fqHTML(1, 10)} = 0.1`; };
  box.addEventListener('click', e => { const c = e.target.closest('rect[data-i]'); if (!c) return; e.stopPropagation(); const i = Math.min(+c.dataset.i + 1, 2 * unit - 1); W = Math.floor(i / unit); const rest = i - W * unit; Tn = Math.floor(rest / (unit / 10)); Hn = unit === 100 ? rest % 10 : 0; if (unit === 10 && Tn === 10) { W++; Tn = 0; } S.forEach(s => s.sync()); sfx.pop(i % 8); draw(); });
  const S = [stepper('หน่วย', () => W, x => W = x, () => 0, () => 1, draw), stepper('ส่วนสิบ', () => Tn, x => Tn = x, () => 0, () => 9, draw)];
  if (unit === 100) S.push(stepper('ส่วนร้อย', () => Hn, x => Hn = x, () => 0, () => 9, draw));
  draw(); return h('div', { class: 'colstack' }, big, box, h('div', { class: 'rowstack' }, ...S), pv, out);
}
/* fraction → decimal: multiply to a denominator of 10 / 100 / 1,000, then read the decimal */
function simDecFrac(f) {
  const L = litParse(f).lit, d = L.d, T = [10, 100, 1000].find(t => t % d === 0), k = T / d, n = L.n * k, dec = decStr(FR(f)), out = fNote(), big = h('div', { class: 'fbig' }), pic = h('div', { class: 'colstack' }); let st = d === T ? 1 : 0;
  const wl = L.w ? `<b class="fw">${L.w}</b>` : '';
  const head = () => `${litHTML(L)}`;
  big.innerHTML = `${head()} <b class="fop">=</b> <span class="fsign">?</span>`;
  out.innerHTML = d === T ? `ตัวส่วนเป็น ${fmt(T)} อยู่แล้ว → อ่านเป็นทศนิยมได้เลย` : `ตัวส่วน ${d} ยังไม่ใช่ 10, 100 หรือ 1,000 — ต้องทำให้เป็นก่อน`;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; sfx.pop(st * 2);
    if (st === 1) { big.innerHTML = `${head()} <b class="fop">=</b> <span class="fr">${wl}${fqHTML(`${L.n}<em>×${k}</em>`, `${d}<em>×${k}</em>`)}</span> <b class="fop">=</b> <span class="fr">${wl}${fqHTML(n, T)}</span>`;
      out.innerHTML = `คูณทั้ง<b>ตัวเศษ</b>และ<b>ตัวส่วน</b>ด้วย <b>${k}</b> ได้ตัวส่วน ${fmt(T)}`; if (T <= 100) { pic.innerHTML = ''; pic.append(decSquares(L.w * T + n, T, { sm: true, col: i => i < L.w * T ? '#9F8FF0' : DCOL[0] })); } btn.lastChild.textContent = 'เขียนเป็นทศนิยม'; return; }
    big.innerHTML = `${head()} <b class="fop">=</b> <span class="fr">${wl}${fqHTML(n, T)}</span> <b class="fop">=</b> <b class="dnum pop">${fmtDec(dec)}</b>`; pic.append(pvChart(dec, { lo: -String(T).length + 1, mark: [-String(T).length + 1] }));
    out.innerHTML = `ตัวส่วน ${fmt(T)} → ทศนิยม <b>${String(T).length - 1}</b> ตำแหน่ง · ตัวเลขสุดท้ายอยู่หลัก<b>${PV_NAME[-String(T).length + 1]}</b>`; btn.remove(); sfx.ok(); say(`${FXsay(`[${f}]`)} เท่ากับ ${decSay(dec)}`, true); } },
    icon('sparkle'), h('span', null, d === T ? 'เขียนเป็นทศนิยม' : `คูณให้ตัวส่วนเป็น ${fmt(T)}`));
  if (d === T && T <= 100) pic.append(decSquares(L.w * T + n, T, { sm: true }));
  return h('div', { class: 'colstack' }, big, pic, btn, out);
}
/* rounding on a zoomed number line — drag the dot (or use the steppers) */
function roundLine(x0, p, o = {}) {
  const U = 1000 / 10 ** p, res = Math.max(1, U / 100); let u = Math.round(rVal(DQ(x0)) * 1000), lo = Math.floor(u / U) * U;
  const wrap = h('div', { class: 'rline' + (o.still ? ' still' : ' ia') }), bar = h('div', { class: 'rl-bar' }), dot = h('div', { class: 'rl-dot' }, h('span', { class: 'rl-val' })), out = o.still ? null : fNote(), big = o.still ? null : h('div', { class: 'fbig' });
  const fx = (k, q) => fmtDec(dFix(Rr(k, 1000), q));
  const shown = () => { const s = decStr(Rr(u, 1000)); return dPl(s) < p + 1 ? dFix(Rr(u, 1000), p + 1) : s; };
  function draw() {
    lo = Math.floor(u / U) * U; const hi = lo + U, mid = lo + U / 2, up = u >= mid, ans = up ? hi : lo;
    bar.innerHTML = ''; bar.append(h('div', { class: 'rl-mid', style: { left: '50%' } }, h('span', null, 'ครึ่งทาง')));
    for (let k = 0; k <= 10; k++) bar.append(h('span', { class: 'rl-t' + (k % 10 ? ' m' : '') + (k === 5 ? ' h' : ''), style: { left: k * 10 + '%' } }, h('b', null, k % 10 && o.still ? '' : fx(lo + k * U / 10, k % 10 ? p + 1 : p))));
    bar.append(h('span', { class: 'rl-end' + (ans === lo && !o.still ? ' on' : ''), style: { left: '0%' } }), h('span', { class: 'rl-end' + (ans === hi && !o.still ? ' on' : ''), style: { left: '100%' } }));
    dot.style.left = (u - lo) / U * 100 + '%'; dot.firstChild.textContent = fmtDec(shown()); bar.append(dot);
    if (!o.still) { const ps = (u - lo) / U * 100, pe = up ? 100 : 0; bar.append(h('span', { class: 'rl-arrow ' + (up ? 'r' : 'l'), style: { left: Math.min(ps, pe) + '%', width: Math.abs(pe - ps) + '%' } }));
      const s = shown(), dg = s.split('.')[1] || '', nd = dg[p] || '0';
      big.innerHTML = `<b class="dnum">${fmtDec(s.split('.')[0])}${p ? '.' + dg.slice(0, p) : '.'}<u class="rl-key">${nd}</u>${dg.slice(p + 1)}</b> <b class="fop">≈</b> <b class="dnum">${fmtDec(dFix(Rr(ans, 1000), p))}</b>`;
      out.innerHTML = `ตัวเลขหลัก${['ส่วนสิบ', 'ส่วนร้อย', 'ส่วนพัน'][p]} คือ <b>${nd}</b> ${+nd >= 5 ? '≥ 5 → <b>ปัดขึ้น</b> ไปทาง ' + fx(hi, p) : '< 5 → <b>ปัดทิ้ง</b> กลับไปที่ ' + fx(lo, p)} · ${u === mid ? 'อยู่ตรง<b>ครึ่งทาง</b>พอดี → ตามหลักให้ปัดขึ้น' : `อยู่ใกล้ <b>${fx(ans, p)}</b> มากกว่า`}`; }
  }
  if (!o.still) {
    const setFrom = e => { const r = bar.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); u = lo + Math.min(U - res, Math.round(f * U / res) * res); draw(); };
    let drag = false;
    bar.addEventListener('pointerdown', e => { drag = true; try { bar.setPointerCapture(e.pointerId); } catch (_) {} setFrom(e); sfx.tap(); });
    bar.addEventListener('pointermove', e => { if (drag) setFrom(e); });
    bar.addEventListener('pointerup', () => { drag = false; sfx.pop(3); }); bar.addEventListener('pointercancel', () => drag = false);
  }
  draw(); wrap.append(bar);
  if (o.still) return wrap;
  const st = (lab, dlt) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); u = Math.max(0, u + dlt); sfx.pop(Math.abs(dlt) % 8); draw(); } }, lab);
  const fmtStep = k => fmtDec(decStr(Rr(k, 1000))), cs = U / 10 > res ? U / 10 : U;
  return h('div', { class: 'colstack' }, big, wrap, h('div', { class: 'rowstack rl-ctrl' }, st('◀ ' + fmtStep(cs), -cs), st('− ' + fmtStep(res), -res), st('+ ' + fmtStep(res), res), st(fmtStep(cs) + ' ▶', cs)), out);
}
const simRound = (x, p) => roundLine(x, p);
/* k × x as repeated addition on base-ten squares */
function simRepeat(k, x) {
  const pl = dPl(x), unit = 10 ** Math.max(1, pl), per = Math.round(rVal(DQ(x)) * unit), box = h('div'), out = fNote(), big = h('div', { class: 'fbig', html: exprHTML(`${k} × ${x}`) + ' <b class="fop">=</b> <span class="fsign">?</span>' }); let j = 0;
  const draw = () => { box.innerHTML = ''; box.append(decSquares(j * per, unit, { min: Math.ceil(k * per / unit), col: i => DCOL[Math.floor(i / per) % DCOL.length], sm: unit === 100 && k * per > 200 })); };
  draw(); out.innerHTML = `${k} × ${fmtDec(x)} คือการบวก ${fmtDec(x)} ซ้ำกัน ${k} ครั้ง`;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (j >= k) return; j++; draw(); sfx.pop(j);
    out.innerHTML = Array(j).fill(fmtDec(x)).join(' + ') + ` = <b>${dTxt(rMul(DQ(x), Rr(j)))}</b>`;
    if (j >= k) { btn.remove(); big.querySelector('.fsign').outerHTML = dH(rMul(DQ(x), Rr(k))); sfx.ok(); say(`${k} คูณ ${decSay(x)} เท่ากับ ${decSay(decStr(rMul(DQ(x), Rr(k))))}`, true); } } }, icon('plus'), `บวกอีก ${fmtDec(x)}`);
  return h('div', { class: 'colstack' }, big, box, btn, out);
}
/* a list of worked steps revealed one at a time */
function dcWalk(headHTML, rows, finalHTML, sayEnd) {
  window.__lastWalk = rows.map(r => [r[0], r[1]]);
  const list = h('div', { class: 'colstack fstory' }), out = fNote(); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, body] = rows[k]; list.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: FX(body) }))); sfx.pop(k); k++;
    if (k >= rows.length) { btn.remove(); out.innerHTML = finalHTML || ''; sfx.ok(); if (sayEnd) say(sayEnd, true); } } }, icon('right'), 'ขั้นต่อไป');
  return h('div', { class: 'colstack' }, headHTML ? h('div', { class: 'fbig', html: headHTML }) : null, list, btn, out);
}
const dcStory = (text, rows, expr) => { const el = dcWalk('', rows, expr ? `${exprHTML(expr)} <b class="fop">=</b> ${dH(exprEval(expr))}` : ''); el.prepend(h('div', { class: 'storybox', html: FX(text) })); return el; };
/* tenths × tenths on a 10×10 grid (area model) */
function simDecArea(a0 = 6, b0 = 4) {
  let a = a0, b = b0; const box = h('div', { class: 'dsq-row' }), big = h('div', { class: 'fbig' }), out = fNote();
  const draw = () => { let s = '<svg viewBox="-1.5 -1.5 103 103" class="dsq big" aria-hidden="true">';
    for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) { const A = i < a, B = j < b; s += `<rect x="${i * 10}" y="${j * 10}" width="10" height="10" fill="${A && B ? '#4FD1A1' : A ? '#BFE0FF' : B ? '#FFE7A3' : '#fff'}" stroke="#C9C2DD" stroke-width=".6"/>`; }
    s += `<rect x="0" y="0" width="100" height="100" fill="none" stroke="#2B2550" stroke-width="1.8"/></svg>`; box.innerHTML = s;
    big.innerHTML = `${exprHTML(`0.${a} × 0.${b}`.replace(/0\.10/g, '1'))} <b class="fop">=</b> ${fqHTML(a, 10)} <b class="fop">×</b> ${fqHTML(b, 10)} <b class="fop">=</b> ${fqHTML(a * b, 100)} <b class="fop">=</b> ${dH(Rr(a * b, 100))}`;
    out.innerHTML = `แถบฟ้า ${a} แถบ (0.${a}) · แถบเหลือง ${b} แถบ (0.${b}) · ช่องเขียวที่ซ้อนกัน <b>${a * b}</b> ช่องจาก 100 ช่อง`.replace(/0\.10/g, '1'); };
  const S = [stepper('ตัวตั้ง (ส่วนสิบ)', () => a, x => a = x, () => 1, () => 10, draw), stepper('ตัวคูณ (ส่วนสิบ)', () => b, x => b = x, () => 1, () => 10, draw)];
  draw(); return h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, big, box), h('div', { class: 'colstack', style: { gap: '6px' } }, ...S, out));
}
/* vertical (column) multiplication with the decimal point placed at the end */
function simColMul(a, b) {
  const pa = dPl(a), pb = dPl(b), pl = pa + pb, Ai = +a.replace('.', ''), Bd = String(+b.replace('.', '')), prodI = String(Ai * +Bd), P = prodI.padStart(pl + 1, '0');
  const partials = Bd.length > 1 ? [...Bd].reverse().map((c, i) => ({ s: String(Ai * +c), sh: i })) : [];
  const digs = s => ({ c: [...s.replace('.', '')], pt: s.includes('.') ? s.indexOf('.') - 1 : -1 });
  const rows = [{ ...digs(a), cls: 'a' }, { ...digs(b), cls: 'b', sign: '×' }, ...partials.map(p => ({ c: [...p.s], pt: -1, sh: p.sh, cls: 'pp', sign: p.sh === partials.length - 1 && partials.length ? '+' : '' })), { c: [...P], pt: -1, cls: 'prod' }];
  const W = Math.max(...rows.map(r => r.c.length + (r.sh || 0))) + 1, grid = h('div', { class: 'cmul', style: { gridTemplateColumns: `repeat(${W}, var(--cmw))` } });
  const cells = []; rows.forEach((r, ri) => { const lead = W - r.c.length - (r.sh || 0);
    for (let col = 0; col < W; col++) { const k = col - lead, ch = col === 0 && r.sign ? r.sign : k >= 0 && k < r.c.length ? r.c[k] : '';
      const c = h('span', { class: 'cm-c ' + r.cls + (r.pt >= 0 && k === r.pt ? ' pt' : '') + (ri === 1 || (partials.length && ri === rows.length - 2) ? ' ul' : '') + (col === 0 && r.sign ? ' sg' : '') }, ch);
      c.dataset.k = k; c.dataset.r = ri; c.dataset.n = r.c.length; grid.append(c); cells.push(c); } });
  const hidden = cells.filter(c => /pp|prod/.test(c.className)); hidden.forEach(c => c.classList.add('hide'));
  const out = fNote(), big = h('div', { class: 'fbig', html: exprHTML(`${a} × ${b}`) + ' <b class="fop">=</b> <span class="fsign">?</span>' }); let st = 0;
  out.innerHTML = 'ขั้นแรก: คูณเหมือน<b>จำนวนนับ</b> (ยังไม่สนใจจุดทศนิยม)';
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; sfx.pop(st * 2);
    if (st === 1) { hidden.forEach((c, i) => { c.style.animationDelay = (+c.dataset.r - 2) * .25 + 's'; c.classList.remove('hide'); c.classList.add('in'); }); out.innerHTML = `${Ai} × ${Bd} = <b>${fmt(+prodI)}</b>`; btn.lastChild.textContent = 'นับตำแหน่งทศนิยม'; return; }
    if (st === 2) { cells.forEach(c => { const n = +c.dataset.n, k = +c.dataset.k, r = +c.dataset.r; if (r === 0 && k >= n - pa && pa) c.classList.add('ca'); if (r === 1 && k >= n - pb && pb) c.classList.add('cb'); if (r === rows.length - 1 && k >= n - pl && pl) c.classList.add('cp'); });
      out.innerHTML = `${fmtDec(a)} มีทศนิยม <b class="ka">${pa}</b> ตำแหน่ง · ${fmtDec(b)} มีทศนิยม <b class="kb">${pb}</b> ตำแหน่ง → ผลคูณต้องมีทศนิยม <b class="kp">${pa} + ${pb} = ${pl}</b> ตำแหน่ง`; btn.lastChild.textContent = 'ใส่จุดทศนิยม'; return; }
    const pc = cells.find(c => +c.dataset.r === rows.length - 1 && +c.dataset.k === P.length - pl - 1); if (pc && pl) pc.classList.add('pt', 'drop');
    const ans = exprEval(`${a} × ${b}`); big.querySelector('.fsign').outerHTML = dH(ans); out.innerHTML = `นับจากขวามา ${pl} ตำแหน่ง แล้วใส่จุด → <b>${dTxt(ans)}</b>`; btn.remove(); sfx.ok(); say(`${decSay(a)} คูณ ${decSay(b)} เท่ากับ ${decSay(decStr(ans))}`, true); } }, icon('right'), h('span', null, 'คูณแบบจำนวนนับ'));
  return h('div', { class: 'colstack' }, big, grid, btn, out);
}
/* × / ÷ by 10, 100, 1,000 — digits slide across a place-value chart */
function simShift(x0, mode = 'both') {
  const E = [4, 3, 2, 1, 0, -1, -2, -3], N = E.length + .5, pos = e => { const i = E.indexOf(e); return (i + (e < 0 ? .5 : 0)) / N * 100; };
  const s0 = String(x0), [ip, fp = ''] = s0.split('.'), chips = [];
  const ipS = ip.replace(/^0+/, ''); [...ipS].forEach((c, i) => chips.push({ c, e: ipS.length - 1 - i })); [...fp].forEach((c, i) => chips.push({ c, e: -(i + 1) }));
  while (chips.length && chips[chips.length - 1].c === '0' && chips[chips.length - 1].e < 0) chips.pop();
  let sh = 0, val = DQ(x0); const wrap = h('div', { class: 'shf' }), head = h('div', { class: 'shf-h' }), track = h('div', { class: 'shf-t' }), out = fNote(), big = h('div', { class: 'fbig' });
  E.forEach(e => head.append(h('span', { style: { left: pos(e) + '%', width: 100 / N + '%' } }, PV_NAME[e])));
  track.append(h('span', { class: 'shf-pt', style: { left: (E.indexOf(0) + 1) / N * 100 + '%', width: 50 / N + '%' } }, '.'));
  E.forEach(e => track.append(h('span', { class: 'shf-cell' + (e < 0 ? ' dec' : ''), style: { left: pos(e) + '%', width: 100 / N + '%' } })));
  const els = chips.map(ch => { const el = h('b', { class: 'shf-d' }, ch.c); track.append(el); return el; }); const zs = h('div', { class: 'shf-z' }); track.append(zs);
  function draw(anim) {
    chips.forEach((ch, i) => { els[i].style.left = pos(ch.e + sh) + '%'; els[i].style.width = 100 / N + '%'; });
    const es = chips.map(c => c.e + sh), top = Math.max(0, ...es), bot = Math.min(0, ...es); zs.innerHTML = '';
    for (let e = top; e >= bot; e--) if (!es.includes(e) && E.includes(e)) zs.append(h('b', { class: 'shf-d z', style: { left: pos(e) + '%', width: 100 / N + '%', animationDelay: anim ? '.45s' : '0s' } }, '0'));
    big.innerHTML = `<b class="dnum">${dTxt(val)}</b>`;
  }
  const hist = h('div', { class: 'shf-hist' });
  const op = (sym, k) => h('button', { class: 'btn sm ia shf-op ' + (sym === '×' ? 'mul' : 'div'), onclick: e => { e.stopPropagation(); const d = (sym === '×' ? 1 : -1) * k, es = chips.map(c => c.e + sh + d);
    if (Math.max(...es) > E[0] || Math.min(...es) < E[E.length - 1]) { sfx.no(); out.innerHTML = 'ตัวเลขจะเลื่อนออกนอกตาราง ลองอีกปุ่มนะ'; return; }
    const prev = val; sh += d; val = sym === '×' ? rMul(val, Rr(10 ** k)) : rDiv(val, Rr(10 ** k)); draw(true); sfx.pop(k * 2);
    hist.prepend(h('div', { class: 'fst-row', html: `${dTxt(prev)} <b class="fop">${sym}</b> ${fmt(10 ** k)} <b class="fop">=</b> <b>${dTxt(val)}</b>` })); while (hist.children.length > 3) hist.lastChild.remove();
    out.innerHTML = `${sym} ${fmt(10 ** k)} → ตัวเลขทุกตัวเลื่อนไปทาง<b>${sym === '×' ? 'ซ้าย' : 'ขวา'}</b> ${k} หลัก (เหมือนจุดทศนิยมเลื่อนไปทาง${sym === '×' ? 'ขวา' : 'ซ้าย'} ${k} ตำแหน่ง)`; } }, `${sym} ${fmt(10 ** k)}`);
  const ops = h('div', { class: 'rowstack shf-ops' }, ...(mode !== 'div' ? [1, 2, 3].map(k => op('×', k)) : []), ...(mode !== 'mul' ? [1, 2, 3].map(k => op('÷', k)) : []));
  wrap.append(head, track); draw(false); out.innerHTML = 'กดปุ่มคูณหรือหาร แล้วดูตัวเลขเลื่อนหลัก';
  return h('div', { class: 'colstack' }, big, wrap, ops, hist, out);
}
/* decimal ÷ whole number by sharing tenths / hundredths */
function simShareDec(x, k) {
  const pl = Math.max(1, dPl(x)), unit = 10 ** pl, n = Math.round(rVal(DQ(x)) * unit), each = n / k, box = h('div'), out = fNote(), big = h('div', { class: 'fbig', html: exprHTML(`${x} ÷ ${k}`) + ' <b class="fop">=</b> <span class="fsign">?</span>' }); let st = 0;
  box.append(decSquares(n, unit)); out.innerHTML = `${fmtDec(x)} = ${n} ${unit === 10 ? 'แถบ (ส่วนสิบ)' : 'ช่อง (ส่วนร้อย)'}`;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; sfx.pop(st * 3); box.innerHTML = '';
    if (st === 1) { box.append(decSquares(n, unit, { col: i => DCOL[i % k] })); out.innerHTML = `แจกให้ ${k} คน ทีละชิ้น (สีละคน) → ได้คนละ <b>${each}</b> ${unit === 10 ? 'แถบ' : 'ช่อง'}`; btn.lastChild.textContent = 'ดูส่วนของแต่ละคน'; return; }
    const row = h('div', { class: 'rowstack' }); for (let p = 0; p < k; p++) row.append(decSquares(each, unit, { sm: true, col: () => DCOL[p] })); box.append(row);
    const ans = rDiv(DQ(x), Rr(k)); big.querySelector('.fsign').outerHTML = dH(ans); out.innerHTML = `คนละ ${each} ${unit === 10 ? 'ส่วนสิบ' : 'ส่วนร้อย'} = ${fqHTML(each, unit)} = <b>${dTxt(ans)}</b>`; btn.remove(); sfx.ok(); say(`${decSay(x)} หาร ${k} เท่ากับ ${decSay(decStr(ans))}`, true); } }, icon('sparkle'), h('span', null, `แบ่งให้ ${k} คน`));
  return h('div', { class: 'colstack' }, big, box, btn, out);
}
/* long division (ตั้งหาร) step by step — adds zeros after the point when needed */
function longDivPlan(D, k, maxDec = 3) {
  const [ip, fp = ''] = String(D).split('.'), digs = [...ip, ...fp].map(Number), pointAt = ip.length, origLen = digs.length, steps = []; let cur = 0, started = false;
  for (let i = 0; i < 40; i++) {
    if (i >= digs.length) { if (cur === 0 || digs.length - pointAt >= maxDec) break; digs.push(0); }
    cur = cur * 10 + digs[i]; const q = Math.floor(cur / k);
    if (q > 0) { started = true; steps.push({ i, q, cur, prod: q * k, rem: cur - q * k }); cur -= q * k; } else steps.push({ i, q: 0, cur, prod: null, rem: cur, quiet: true });
    if (i >= digs.length - 1 && cur === 0 && i >= origLen - 1) break;
  }
  return { digs, pointAt, origLen, steps, started };
}
function simLongDiv(D, k) {
  const P = longDivPlan(D, k), nd = P.digs.length, hasPt = nd > P.pointAt, col = i => 2 + i + (hasPt && i >= P.pointAt ? 1 : 0), W = 1 + nd + (hasPt ? 1 : 0);
  const grid = h('div', { class: 'ldiv', style: { gridTemplateColumns: `auto ${Array.from({ length: W - 1 }, (_, c) => hasPt && c === P.pointAt ? 'var(--ldp)' : 'var(--ldw)').join(' ')}` } }), out = fNote(), big = h('div', { class: 'fbig', html: exprHTML(`${D} ÷ ${k}`) + ' <b class="fop">=</b> <span class="fsign">?</span>' });
  const put = (r, c, txt, cls = '') => { const el = h('span', { class: 'ld-c ' + cls, style: { gridRow: r, gridColumn: c } }, txt); grid.append(el); return el; };
  const firstQ = Math.min(P.pointAt - 1, ...P.steps.filter(s => !s.quiet).map(s => s.i));
  const qEls = P.steps.map(s => s.i >= firstQ ? put(1, col(s.i), String(s.q), 'q hide') : null), qPt = hasPt ? put(1, 2 + P.pointAt, '.', 'q pt hide') : null;
  put(2, 1, String(k), 'dv');
  P.digs.forEach((d, i) => put(2, col(i), String(d), 'dd' + (i >= P.origLen ? ' add hide' : '')));
  const dPt = hasPt ? put(2, 2 + P.pointAt, '.', 'dd pt' + (P.origLen > P.pointAt ? '' : ' add hide')) : null;
  let row = 3; const shown = [], real = P.steps.filter(s => !s.quiet);
  real.forEach((s, j) => { const els = [], ps = String(s.prod), next = real[j + 1], remV = next ? next.cur : s.rem, remEnd = next ? next.i : s.i, rs = String(remV);
    els.push(put(row, 1, '−', 'sg hide')); [...ps].forEach((c, t) => els.push(put(row, col(s.i - ps.length + 1 + t), c, 'pr ul hide'))); row++;
    [...rs].forEach((c, t) => els.push(put(row, col(remEnd - rs.length + 1 + t), c, 'rm hide' + (next ? '' : ' last')))); row++;
    shown.push({ s, els, next }); });
  let j = 0; out.innerHTML = `ตั้งหาร ${fmtDec(D)} ÷ ${k} — หารทีละหลักจากซ้ายไปขวา`;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const { s, els, next } = shown[j];
    qEls.forEach((q, t) => { if (q && P.steps[t].i <= s.i) q.classList.remove('hide'); }); if (qPt && s.i >= P.pointAt) qPt.classList.remove('hide');
    els.forEach((el, t) => { el.style.animationDelay = t * .06 + 's'; el.classList.remove('hide'); el.classList.add('in'); });
    const upto = next ? next.i : s.i; grid.querySelectorAll('.add.hide').forEach(el => { const c = +el.style.gridColumnStart; if (c <= col(upto)) el.classList.remove('hide'); }); if (dPt && upto >= P.pointAt) dPt.classList.remove('hide');
    const added = next && next.i >= P.origLen; sfx.pop(j + 1);
    out.innerHTML = `${s.cur} ÷ ${k} ได้ <b>${s.q}</b> · ${s.q} × ${k} = ${s.prod} · ${s.cur} − ${s.prod} = ${s.rem}` + (next ? ` · ดึง${added ? '<b>เลข 0 ที่เติมหลังจุด</b>' : 'หลักถัดไป'}ลงมา` : '');
    j++; if (j >= shown.length) { qEls.forEach(q => q && q.classList.remove('hide')); qPt && P.steps.some(s2 => s2.i >= P.pointAt && qEls[P.steps.indexOf(s2)]) && qPt.classList.remove('hide');
      const ans = rDiv(DQ(D), Rr(k)); big.querySelector('.fsign').outerHTML = dH(ans); out.innerHTML += `<br>เหลือเศษ 0 → ${fmtDec(D)} ÷ ${k} = <b>${dTxt(ans)}</b>` + (P.origLen < nd ? ' (เติม 0 หลังจุดทศนิยมได้ ค่าไม่เปลี่ยน)' : ''); btn.remove(); sfx.ok(); say(`${decSay(D)} หาร ${k} เท่ากับ ${decSay(decStr(ans))}`, true); } } }, icon('right'), 'หารขั้นต่อไป');
  return h('div', { class: 'colstack' }, big, grid, btn, out);
}
/* measurement conversions: drag / slide a quantity, read it in both units */
function simConv({ big: BU, small: SU, ratio, max, start, pic = 'bar', steps }) {
  let v = start; const Mx = max * ratio, stp = steps || (ratio === 10 ? [1] : ratio === 100 ? [1, 10] : [10, 100]);
  const view = h('div', { class: 'cv-pic ' + pic }), read = h('div', { class: 'fbig cv-read' }), out = fNote();
  const range = h('input', { type: 'range', min: 0, max: Mx, step: stp[0], value: v, class: 'cv-range ia', 'aria-label': 'ปรับปริมาณ' });
  range.addEventListener('input', () => { v = +range.value; draw(); });
  range.addEventListener('change', () => sfx.pop(3)); range.addEventListener('click', e => e.stopPropagation());
  const svgBar = () => { const W = 600, H = 92, x = q => 20 + q / Mx * (W - 40), tk = Math.max(1, ratio / 10); let s = `<svg viewBox="0 0 ${W} ${H}" class="cv-svg" aria-hidden="true">`;
    if (pic === 'ruler') s += `<rect x="6" y="30" width="${W - 12}" height="56" rx="6" fill="#FFE7A3" stroke="#C98612" stroke-width="2"/>`;
    else if (pic === 'tape') s += `<rect x="6" y="30" width="${W - 12}" height="56" rx="6" fill="#FFF6D6" stroke="#E2B53C" stroke-width="2"/>`;
    else s += `<rect x="6" y="46" width="${W - 12}" height="24" rx="12" fill="#5B5670"/><path d="M14 58 H${W - 14}" stroke="#fff" stroke-width="2.5" stroke-dasharray="14 12"/>`;
    for (let q = 0; q <= Mx; q += tk) { const major = q % ratio === 0, half = !major && q % (ratio / 2) === 0; s += `<path d="M${x(q)} ${pic === 'road' ? 46 : 30} v${major ? 22 : half ? 15 : 9}" stroke="${pic === 'road' ? '#fff' : '#2B2550'}" stroke-width="${major ? 2.2 : 1.1}"/>`;
      if (major) s += `<text x="${x(q)}" y="${pic === 'road' ? 40 : 84}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="15" fill="#2B2550">${q / ratio}</text>`; }
    if (pic === 'road') s += `<g transform="translate(${x(v)} 30)"><circle r="11" fill="#FF7B86" stroke="#fff" stroke-width="3"/><path d="M0 11 v10" stroke="#FF7B86" stroke-width="3"/></g><path d="M${x(0)} 80 H${x(v)}" stroke="#4FD1A1" stroke-width="6" stroke-linecap="round"/>`;
    else s += `<rect x="${x(0)}" y="8" width="${Math.max(0, x(v) - x(0))}" height="16" rx="8" fill="${pic === 'ruler' ? '#FF7B86' : '#6FB2F5'}"/><circle cx="${x(v)}" cy="16" r="10" fill="#fff" stroke="#2B2550" stroke-width="2.5"/>`;
    return s + '</svg>'; };
  const svgScale = () => { const a = -150 + v / Mx * 300, tk = ratio / 10; let s = `<svg viewBox="-110 -110 220 220" class="cv-svg dial" aria-hidden="true"><circle r="104" fill="#F1EFF7" stroke="#5A45A6" stroke-width="6"/><circle r="92" fill="#fff"/>`;
    for (let q = 0; q <= Mx; q += tk) { const an = (-150 + q / Mx * 300 - 90) * Math.PI / 180, major = q % ratio === 0, r1 = major ? 70 : q % (ratio / 2) === 0 ? 78 : 83; s += `<path d="M${Math.cos(an) * 90} ${Math.sin(an) * 90} L${Math.cos(an) * r1} ${Math.sin(an) * r1}" stroke="#2B2550" stroke-width="${major ? 2.6 : 1.2}"/>`;
      if (major) s += `<text x="${Math.cos(an) * 56}" y="${Math.sin(an) * 56 + 6}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="17" fill="#2B2550">${q / ratio}</text>`; }
    s += `<text y="40" text-anchor="middle" font-size="13" font-weight="700" fill="#7E6ED6">${BU}</text><g style="transform:rotate(${a}deg);transition:transform .25s"><path d="M-4 10 L0 -86 L4 10 Z" fill="#E5505E"/></g><circle r="9" fill="#2B2550"/></svg>`; return s; };
  const svgJug = () => { const H = 200, y = q => 210 - q / Mx * H, tk = ratio / 10; let s = `<svg viewBox="0 0 220 240" class="cv-svg jug" aria-hidden="true"><path d="M40 6 H170 L176 222 Q176 232 166 232 H44 Q34 232 34 222 Z" fill="#F4FAFF" stroke="#3F8BDB" stroke-width="4"/>`;
    s += `<clipPath id="cvj"><path d="M40 6 H170 L176 222 Q176 232 166 232 H44 Q34 232 34 222 Z"/></clipPath><rect clip-path="url(#cvj)" x="30" y="${y(v)}" width="150" height="${232 - y(v)}" fill="#6FB2F5" opacity=".75" style="transition:all .25s"/>`;
    for (let q = tk; q <= Mx; q += tk) { const major = q % ratio === 0, half = q % (ratio / 2) === 0; s += `<path d="M40 ${y(q)} h${major ? 30 : half ? 22 : 12}" stroke="#2B2550" stroke-width="${major ? 2.4 : 1.2}"/>`;
      if (half) s += `<text x="${major ? 76 : 68}" y="${y(q) + 5}" font-family="Nunito,sans-serif" font-weight="800" font-size="${major ? 15 : 12}" fill="#2B2550">${major ? q / ratio + ' L' : fmt(q) + ' mL'}</text>`; }
    return s + '</svg>'; };
  function draw() {
    view.innerHTML = pic === 'scale' ? svgScale() : pic === 'jug' ? svgJug() : svgBar();
    const A = Math.floor(v / ratio), B = v % ratio, dec = decStr(Rr(v, ratio));
    read.innerHTML = `<span class="cv-u">${A ? `${fmt(A)} ${BU}` : ''}${A && B ? ' ' : ''}${B || !A ? `${fmt(B)} ${SU}` : ''}</span> <b class="fop">=</b> <span class="cv-u"><b class="dnum">${fmtDec(dec)}</b> ${BU}</span> <b class="fop">=</b> <span class="cv-u"><b class="dnum">${fmt(v)}</b> ${SU}</span>`;
    out.innerHTML = `1 ${BU} = ${fmt(ratio)} ${SU} → 1 ${SU} = ${fqHTML(1, fmt(ratio))} ${BU} = ${decStr(Rr(1, ratio))} ${BU}`; range.value = v;
  }
  if (pic !== 'scale' && pic !== 'jug') { let drag = false; const setFrom = e => { const sv = view.querySelector('svg'), r = sv.getBoundingClientRect(), f = Math.max(0, Math.min(1, ((e.clientX - r.left) / r.width * 600 - 20) / 560)); v = Math.round(f * Mx / stp[0]) * stp[0]; draw(); };
    view.classList.add('ia'); view.addEventListener('pointerdown', e => { drag = true; try { view.setPointerCapture(e.pointerId); } catch (_) {} setFrom(e); }); view.addEventListener('pointermove', e => drag && setFrom(e)); view.addEventListener('pointerup', () => { drag = false; sfx.pop(2); }); view.addEventListener('pointercancel', () => drag = false); }
  const btns = stp.flatMap(d => [h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); v = Math.max(0, v - d); sfx.pop(2); draw(); } }, `− ${fmt(d)} ${SU}`), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); v = Math.min(Mx, v + d); sfx.pop(4); draw(); } }, `+ ${fmt(d)} ${SU}`)]);
  draw(); return h('div', { class: 'colstack' }, read, view, range, h('div', { class: 'rowstack cv-btns' }, ...btns), out);
}

/* =========================================================
   DATA (workbook ป.5 เทอม 1 บทที่ 2 + ข้อสอบ) and LEVELS
   ========================================================= */
const P5D_F10 = ['5/10', '51/10', '108/10', '70/10', '3/2', '1/5', '2/5', '33/5', '7/2', '9/5', '4 1/2', '13/10'];
const P5D_F100 = ['11/100', '172/100', '43/100', '3/4', '1/4', '3/20', '17/20', '17/25', '23/4', '56/25', '2 19/25', '51/4', '47/25', '6/50'];
const P5D_F1000 = ['657/1000', '2369/1000', '66/1000', '75/1000', '91/500', '5/8', '16/125', '121/125', '67/40', '43/8', '27/40', '1540/1000', '239/125', '2 64/125'];
const P5D_MATCH10 = [['1/2', '0.5'], ['3/5', '0.6'], ['12/10', '1.2'], ['4/5', '0.8'], ['5/2', '2.5'], ['9/10', '0.9']];
const P5D_MATCH100 = [['3/25', '0.12'], ['9/50', '0.18'], ['1 1/4', '1.25'], ['7/20', '0.35'], ['2 3/50', '2.06'], ['33/100', '0.33']];
const P5D_MATCH = [['2 3/4', '2.75'], ['1 21/25', '1.84'], ['12/60', '0.2'], ['7/8', '0.875'], ['6/50', '0.12'], ['239/125', '1.912'], ['2 64/125', '2.512'], ['27/2', '13.5'], ['47/25', '1.88'], ['3 1/25', '3.04']];
const P5D_R0 = ['4.4', '6.02', '3.502', '5.22', '9.4', '8.1', '2.69', '9.495', '5.793', '6.743', '6.49', '7.518', '3.8', '9.831', '1.382', '9.042'];
const P5D_R1 = ['8.05', '0.03', '5.72', '6.49', '2.147', '5.695', '4.72', '0.218', '2.009', '3.46', '9.084', '7.813', '2.37', '6.432', '8.205'];
const P5D_R2 = ['3.092', '2.157', '8.082', '5.259', '1.261', '4.504', '0.118', '0.863', '0.196', '7.003', '8.995'];
const P5D_REP = ['4 × 0.3', '6 × 1.2', '5 × 0.2', '3 × 0.7', '2 × 0.45', '7 × 0.3', '4 × 0.25', '8 × 0.6'];
const P5D_MF = ['0.51 × 23', '0.08 × 7', '1.06 × 9', '3.4 × 6', '0.125 × 8', '2.05 × 4', '0.7 × 13'];
const P5D_MV = ['5.96 × 37', '7.6 × 5', '4.25 × 18', '12.3 × 24', '0.236 × 15', '9.5 × 46'];
const P5D_M10 = ['1.08 × 1000', '9.082 × 100', '8.073 × 100', '10 × 2.15', '0.924 × 1000', '4.57 × 100', '0.174 × 10', '100 × 0.653', '0.06 × 1000', '2.386 × 10'];
const P5D_MDF = ['0.8 × 0.7', '0.12 × 0.9', '2.9 × 3.7', '5.12 × 0.8', '0.6 × 0.5', '1.2 × 0.4', '0.03 × 0.7'];
const P5D_MDV = ['4.3 × 2.6', '0.58 × 9.5', '1.25 × 0.32', '6.4 × 0.15', '3.07 × 1.8', '12.5 × 0.24'];
const P5D_CMP1 = [['2.9 × 3', '2.9 × 5'], ['0.99 × 9', '1.00 × 9'], ['8.8 × 10', '8.8 × 100'], ['9.34 × 10', '9.34 × 1.0'], ['2.48 × 10', '2.48 × 1.0']];
const P5D_CMP2 = [['0.8 × 0.7', '0.8 × 0.5'], ['0.12 × 0.9', '0.012 × 9'], ['7.6 × 5', '76 × 0.5'], ['2.9 × 3.7', '9.2 × 3.7'], ['5.12 × 0.8', '5.12 × 0.7']];
const P5D_DF = ['2.4 ÷ 6', '0.36 ÷ 4', '4.8 ÷ 6', '0.45 ÷ 9', '3.6 ÷ 12', '7.25 ÷ 5', '0.064 ÷ 8'];
const P5D_DV = ['99.68 ÷ 8', '31.5 ÷ 9', '449.8 ÷ 5', '3.9 ÷ 30', '8.4 ÷ 7', '16.25 ÷ 13', '0.728 ÷ 4'];
const P5D_DW = ['48 ÷ 60', '1650 ÷ 300', '7 ÷ 4', '21 ÷ 8', '45 ÷ 12', '3 ÷ 8', '13 ÷ 20', '9 ÷ 2'];
const P5D_D10 = ['3.7 ÷ 10', '0.64 ÷ 10', '4.6 ÷ 100', '11.8 ÷ 10', '3 ÷ 1000', '0.51 ÷ 10', '1.5 ÷ 100', '265 ÷ 1000', '40.8 ÷ 100'];
const UF = (q, a, hint) => ({ q, a, hint });
const P5D_LEN = [UF('38.6 กิโลเมตร = ☐ เมตร', '38600', '1 กิโลเมตร = 1,000 เมตร → คูณด้วย 1,000'), UF('12.45 เมตร = ☐ เซนติเมตร', '1245', '1 เมตร = 100 เซนติเมตร → คูณด้วย 100'), UF('0.8 เซนติเมตร = ☐ มิลลิเมตร', '8', '1 เซนติเมตร = 10 มิลลิเมตร → คูณด้วย 10'),
  UF('178 เซนติเมตร = ☐ เมตร', '1.78', '100 เซนติเมตร = 1 เมตร → หารด้วย 100'), UF('1 เมตร 80 เซนติเมตร = ☐ เมตร', '1.8', '80 เซนติเมตร = 0.80 เมตร แล้วบวก 1 เมตร'), UF('34 มิลลิเมตร = ☐ เซนติเมตร', '3.4', '10 มิลลิเมตร = 1 เซนติเมตร → หารด้วย 10'),
  UF('2,565 เมตร = ☐ กิโลเมตร', '2.565', '1,000 เมตร = 1 กิโลเมตร → หารด้วย 1,000'), UF('13,761 เมตร = ☐ กิโลเมตร', '13.761', '1,000 เมตร = 1 กิโลเมตร → หารด้วย 1,000')];
const P5D_WT = [UF('3,215 กรัม = ☐ กิโลกรัม', '3.215', '1,000 กรัม = 1 กิโลกรัม → หารด้วย 1,000'), UF('9 ตัน = ☐ กิโลกรัม', '9000', '1 ตัน = 1,000 กิโลกรัม'), UF('2 ตัน 800 กิโลกรัม = ☐ กิโลกรัม', '2800', '2 ตัน = 2,000 กิโลกรัม แล้วบวก 800'),
  UF('3,850 กิโลกรัม = ☐ ตัน', '3.85', '1,000 กิโลกรัม = 1 ตัน → หารด้วย 1,000'), UF('5 กิโลกรัม 300 กรัม = ☐ กรัม', '5300', '5 กิโลกรัม = 5,000 กรัม แล้วบวก 300'), UF('600 กรัม = ☐ กิโลกรัม', '0.6', '1,000 กรัม = 1 กิโลกรัม → หารด้วย 1,000'),
  UF('5,098 กิโลกรัม = ☐ ตัน', '5.098', '1,000 กิโลกรัม = 1 ตัน'), UF('3 ตัน 400 กิโลกรัม = ☐ ตัน', '3.4', '400 กิโลกรัม = 0.400 ตัน แล้วบวก 3 ตัน'), UF('2.593 กิโลกรัม = ☐ กรัม', '2593', '1 กิโลกรัม = 1,000 กรัม → คูณด้วย 1,000')];
const P5D_VOL = [UF('5,000 มิลลิลิตร = ☐ ลิตร', '5', '1,000 มิลลิลิตร = 1 ลิตร'), UF('7 ลิตร = ☐ มิลลิลิตร', '7000', '1 ลิตร = 1,000 มิลลิลิตร'), UF('2,468 มิลลิลิตร = ☐ ลิตร', '2.468', '1,000 มิลลิลิตร = 1 ลิตร → หารด้วย 1,000'),
  UF('12 ลิตร 200 มิลลิลิตร = ☐ มิลลิลิตร', '12200', '12 ลิตร = 12,000 มิลลิลิตร แล้วบวก 200'), UF('4.5 ลิตร = ☐ มิลลิลิตร', '4500', '1 ลิตร = 1,000 มิลลิลิตร → คูณด้วย 1,000'), UF('25.36 ลิตร = ☐ มิลลิลิตร', '25360', 'คูณด้วย 1,000 → จุดเลื่อนไปทางขวา 3 ตำแหน่ง'),
  UF('600 มิลลิลิตร = ☐ ลิตร', '0.6', 'หารด้วย 1,000'), UF('11 ลิตร 420 มิลลิลิตร = ☐ ลิตร', '11.42', '420 มิลลิลิตร = 0.420 ลิตร แล้วบวก 11 ลิตร')];
const DS = (text, expr, wrong, unit) => ({ text, expr, wrong, unit });
const P5D_S1 = [DS('ครอบครัวของภูขับรถจากบ้านไปทะเลระยะทาง 420.9 กิโลเมตร ใช้เวลา 3 ชั่วโมง ขับได้เฉลี่ยชั่วโมงละกี่กิโลเมตร', '420.9 ÷ 3', ['420.9 × 3', '420.9 − 3'], 'กิโลเมตร'),
  DS('ชุดนักเรียนหนึ่งชุดใช้ผ้า 2.0 เมตร ถ้าตัดชุดแบบเดียวกัน 6 ชุด ต้องใช้ผ้าอย่างน้อยกี่เมตร', '2.0 × 6', ['2.0 ÷ 6', '2.0 + 6'], 'เมตร'),
  DS('แชมพู 920 มิลลิลิตร ใช้สระผมครั้งละเท่า ๆ กันได้ 25 ครั้ง ใช้แชมพูครั้งละกี่มิลลิลิตร', '920 ÷ 25', ['920 × 25', '920 − 25'], 'มิลลิลิตร'),
  DS('ป้าปลูกถั่วเหลือง 23.7 ไร่ ใช้เมล็ดพันธุ์เฉลี่ยไร่ละ 18.7 กิโลกรัม ป้าต้องใช้เมล็ดพันธุ์กี่กิโลกรัม', '23.7 × 18.7', ['23.7 + 18.7', '23.7 − 18.7'], 'กิโลกรัม'),
  DS('รถกระบะใช้น้ำมัน 5 ลิตร แล่นได้ 67.45 กิโลเมตร น้ำมัน 1 ลิตรแล่นได้เฉลี่ยกี่กิโลเมตร', '67.45 ÷ 5', ['67.45 × 5', '67.45 − 5'], 'กิโลเมตร'),
  DS('ร้านซื้อแป้งสาลี 10.3 กิโลกรัม กิโลกรัมละ 15.50 บาท ร้านต้องจ่ายเงินเท่าใด', '10.3 × 15.50', ['15.50 ÷ 10.3', '10.3 + 15.50'], 'บาท'),
  DS('ข้อสอบฉบับหนึ่งมี 60 ข้อ ปิติใช้เวลาทำข้อสอบฉบับนี้ 48 นาที ปิติทำข้อสอบเฉลี่ยข้อละกี่นาที', '48 ÷ 60', ['60 ÷ 48', '60 − 48'], 'นาที'),
  DS('น้ำชา 1 ลิตร ใช้ผงชา 0.58 กรัม ถ้าต้องการทำน้ำชา 9.5 ลิตร ต้องใช้ผงชากี่กรัม', '0.58 × 9.5', ['9.5 ÷ 0.58', '0.58 + 9.5'], 'กรัม'),
  DS('ขนมเค้กแท่งยาว 34.8 เซนติเมตร ตัดเป็น 6 ชิ้นเท่า ๆ กัน แต่ละชิ้นหนากี่เซนติเมตร', '34.8 ÷ 6', ['34.8 × 6', '34.8 − 6'], 'เซนติเมตร'),
  DS('ทำน้ำยาถูพื้น 20 ลิตร ต้องใช้หัวเชื้อ 3.2 กิโลกรัม ถ้าทำน้ำยาถูพื้นเพียง 1 ลิตร ต้องใช้หัวเชื้อกี่กิโลกรัม', '3.2 ÷ 20', ['20 ÷ 3.2', '3.2 × 20'], 'กิโลกรัม'),
  DS('โรงสีแบ่งข้าวเปลือก 1,550 กิโลกรัม ใส่กระสอบเท่า ๆ กัน ได้ 200 กระสอบ กระสอบละกี่กิโลกรัม', '1550 ÷ 200', ['1550 − 200', '200 ÷ 1550'], 'กิโลกรัม')];
const P5D_S2 = [DS('ครูซื้อปากกา 10 กล่อง จ่ายเงิน 546 บาท กล่องหนึ่งมีปากกา 15 ด้าม ปากกาด้ามละกี่บาท', '546 ÷ 10 ÷ 15', ['546 ÷ 10 × 15', '546 ÷ (10 + 15)'], 'บาท'),
  DS('ยายแบ่งสวน 12.9 ไร่ ให้ลูก 2 คนเท่า ๆ กัน ลูกคนเล็กซื้อที่เพิ่มอีก 4.4 ไร่ ลูกคนเล็กมีที่ดินทั้งหมดกี่ไร่', '12.9 ÷ 2 + 4.4', ['12.9 + 4.4 ÷ 2', '12.9 ÷ 2 − 4.4'], 'ไร่'),
  DS('แท็งก์มีน้ำ 1,700 ลิตร ลุงล้างรถ 5 ครั้ง เหลือน้ำ 213.3 ลิตร ลุงใช้น้ำล้างรถเฉลี่ยครั้งละกี่ลิตร', '(1700 − 213.3) ÷ 5', ['1700 − 213.3 ÷ 5', '(1700 + 213.3) ÷ 5'], 'ลิตร'),
  DS('ร้านขายเชือกเมตรละ 65 บาท ได้เงิน 5,772 บาท และเหลือเชือก 13.20 เมตร ตอนแรกร้านมีเชือกกี่เมตร', '5772 ÷ 65 + 13.20', ['5772 ÷ 65 − 13.20', '5772 + 65 + 13.20'], 'เมตร'),
  DS('ชาวสวนบรรจุมะม่วงใส่ลัง ลังละ 0.05 ตัน ได้ 250 ลัง ยังเหลือมะม่วงอีก 2.46 ตัน มะม่วงทั้งหมดมีกี่ตัน', '0.05 × 250 + 2.46', ['0.05 × 250 − 2.46', '250 ÷ 0.05 + 2.46'], 'ตัน'),
  DS('ทางจากบ้านไปภูเขาไกล 535 กิโลเมตร พ่อขับรถเฉลี่ยชั่วโมงละ 60.65 กิโลเมตร ขับไปแล้ว 3 ชั่วโมง เหลือทางอีกกี่กิโลเมตร', '535 − 3 × 60.65', ['535 − 60.65 − 3', '(535 − 3) × 60.65'], 'กิโลเมตร'),
  DS('ร้านซื้อนมกล่อง 100 กล่อง เป็นเงิน 790 บาท นำมาขายโดยบวกเพิ่มกล่องละ 7.10 บาท ร้านขายนมกล่องละเท่าไร', '790 ÷ 100 + 7.10', ['790 + 7.10 ÷ 100', '790 ÷ 100 − 7.10'], 'บาท'),
  DS('เดือนเมษายนบ้านของภูใช้น้ำ 3,560.20 ลิตร เดือนต่อมาใช้น้ำ 3,977.1 ลิตร สองเดือนนี้บ้านของภูใช้น้ำเฉลี่ยเดือนละเท่าใด', '(3560.20 + 3977.1) ÷ 2', ['3560.20 + 3977.1 ÷ 2', '(3977.1 − 3560.20) ÷ 2'], 'ลิตร')];
const P5D_S3 = [DS('ร้านบุฟเฟต์คิดคนละ 798 บาท ถ้ามา 2 คน คิดเงินเพียง 6 คน ภู ฝน บีม และปิ่นมากินด้วยกัน ต้องจ่ายคนละเท่าใด', '798 × 6 ÷ 2', ['798 × 2 ÷ 6', '798 × 6 × 2'], 'บาท'),
  DS('ร้านแบ่งน้ำตาลใส่ถุง ถุงละ 7.3 กิโลกรัม ขายได้ 17 ถุง ถ้าน้ำตาล 1 กระสอบหนัก 10 กิโลกรัม ร้านขายน้ำตาลไปกี่กระสอบ', '17 × 7.3 ÷ 10', ['17 × 7.3 × 10', '(17 + 7.3) ÷ 10'], 'กระสอบ'),
  DS('ผ้าม้วนหนึ่งยาว 42.25 เมตร ตัดเป็นผ้าเช็ดตัวยาวเท่า ๆ กัน 28 ผืน เหลือผ้า 0.25 เมตร ผ้าเช็ดตัวยาวผืนละกี่เมตร', '(42.25 − 0.25) ÷ 28', ['42.25 − 0.25 ÷ 28', '(42.25 + 0.25) ÷ 28'], 'เมตร'),
  DS('ร้านขายข้าวมันไก่กล่องละ 62.75 บาท ขายน้ำสมุนไพรขวดละ 60 บาท ขายได้อย่างละ 28 ชิ้น ร้านได้เงินรวมเท่าใด', '28 × 62.75 + 28 × 60', ['28 × 62.75 + 60', '28 × 60 − 28 × 62.75'], 'บาท'),
  DS('ร้านบรรจุอาหารแมวได้ 14 ถุง ถุงละ 1.9 กิโลกรัม เหลืออาหารแมวอีก 4.4 กิโลกรัม ตอนแรกร้านมีอาหารแมวกี่กิโลกรัม', '14 × 1.9 + 4.4', ['14 × 1.9 − 4.4', '14 + 1.9 + 4.4'], 'กิโลกรัม'),
  DS('ปลูกข้าวโพด 1 ไร่ ต้องใช้เมล็ดพันธุ์ 33.7 กิโลกรัม ลุงจะปลูก 25 ไร่ ตอนนี้มีเมล็ดพันธุ์ 653.78 กิโลกรัม จะต้องซื้อเมล็ดพันธุ์เพิ่มอย่างน้อยเท่าใด', '25 × 33.7 − 653.78', ['25 × 33.7 + 653.78', '653.78 − 33.7'], 'กิโลกรัม'),
  DS('ใน 8 วัน ระดับน้ำในอ่างเก็บน้ำเพิ่มจาก 205 เมตร เป็น 206.36 เมตร ระดับน้ำเพิ่มขึ้นเฉลี่ยวันละกี่เซนติเมตร', '(206.36 − 205) ÷ 8 × 100', ['(206.36 − 205) × 8', '206.36 ÷ 8 × 100'], 'เซนติเมตร'),
  DS('น้ำมันงา 1 ขวดมีปริมาตร 740 มิลลิลิตร ซื้อ 1 โหล (12 ขวด) จะได้น้ำมันงากี่ลิตร', '740 × 12 ÷ 1000', ['740 × 12', '740 ÷ 12 ÷ 1000'], 'ลิตร'),
  DS('น้ำมะพร้าว 13.3 ลิตร บรรจุขวดเท่า ๆ กันได้ 14 ขวด แต่ละขวดมีน้ำมะพร้าวกี่มิลลิลิตร', '13.3 ÷ 14 × 1000', ['13.3 × 14 × 1000', '13.3 ÷ 14'], 'มิลลิลิตร'),
  DS('น้ำเกลือ 1 ลิตรมีเกลือ 223.0 กรัม ถ้าต้องการทำน้ำเกลือ 40 ลิตร ต้องใช้เกลือกี่กิโลกรัม', '223.0 × 40 ÷ 1000', ['223.0 × 40', '223.0 ÷ 40 ÷ 1000'], 'กิโลกรัม')];
const P5D_FIRST = ['785 − 6 × 74.25', '16.6 ÷ 4 + 3.7', '0.04 × 350 + 1.97', '36 × 65.75 + 36 × 90', '4642 ÷ 88 + 12.25'];

/* v164 (ผู้ใช้ขอ: ทำตามวิธีของด่าน) — คูณ/หารทศนิยมทีละขั้นด้วยจำนวนนับ
   frac: เขียนเป็นเศษส่วนส่วน 10/100/1,000 → คูณ/หารตัวเศษ → เขียนกลับเป็นทศนิยม
   col: คูณ/หารแบบจำนวนนับบนกระดาน (ตั้งคูณ colW · หารยาว d3Work) → ใส่จุดทศนิยม (เดิม Q.dCalc พิมพ์ผลอย่างเดียว) */
const d5int = x => +String(x).replace('.', ''), d5p10 = k => 10 ** k;
Object.assign(Q, {
  d5Work({ expr, mode = 'col' }) { const [a, op, b] = expr.split(' '), R = exprEval(expr), pa = dPl(a), pb = dPl(b), A = d5int(a), B = d5int(b);
    let k = pa, Ak = A; if (op === '÷') { while (k < 6 && (Ak % B)) { k++; Ak *= 10; } }
    const p = op === '×' ? pa + pb : k, fq = (n, d) => d === 1 ? `<b class="num">${typeof n === 'number' ? fmt(n) : n}</b>` : fqHTML(typeof n === 'number' ? fmt(n) : n, fmt(d));
    return { prompt: `หาผลลัพธ์ ${exprHTML(expr)} — ${mode === 'col' ? (op === '×' ? 'ตั้งคูณ' : 'ตั้งหาร') : 'ใช้ความสัมพันธ์กับเศษส่วน'}`, say: `หาผลลัพธ์ ${exprSay(expr)}`, __sig: 'd5w ' + expr, mount(bd, ctx) {
      const top = h('div', { class: 'fbig d6top', html: `${exprHTML(expr)} <b class="fop">=</b> <span class="fsign">?</span>` }), rows = h('div', { class: 'colstack f4wrows' }), lab = h('div', { class: 'p4steplab' }), slot = h('div', { class: 'colstack d6slot' });
      const sub = f => ({ check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(4); f(); }, say: ctx.say });
      const fin = () => { slot.innerHTML = ''; lab.innerHTML = mode === 'frac' ? `เขียน ${fq(op === '×' ? A * B : Ak / B, d5p10(p))} เป็น<b>ทศนิยม</b>` : `<b>ใส่จุดทศนิยม</b> — ${op === '×' ? 'ผลคูณมีทศนิยมเท่ากับจำนวนตำแหน่งของตัวตั้งและตัวคูณรวมกัน' : 'จุดของผลหารตรงกับจุดของตัวตั้ง'}`;
        slot.append(decAnswer(ctx, R, { hint: op === '×' ? `ทศนิยม ${pa} + ${pb} = ${p} ตำแหน่ง` : `ทศนิยม ${p} ตำแหน่ง` })); ctx.onRight = () => { const q = top.querySelector('.fsign'); if (q) q.outerHTML = dH(R); }; };
      const done = html => () => { rows.append(h('div', { class: 'f3-eq f4wrow', html: html + ' <span class="f4ok">✓</span>' })); fin(); };
      if (mode === 'frac') { const lhs = op === '×' ? `${fq(A, d5p10(pa))} <b class="fop">×</b> ${fq(B, d5p10(pb))}` : `${fq(Ak, d5p10(k))} <b class="fop">÷</b> ${fmt(B)}`, ans = op === '×' ? A * B : Ak / B;
        lab.innerHTML = `${exprHTML(expr)} = ${lhs}${k > pa ? ` <small>(เติม 0 ท้ายตัวตั้งให้หารลงตัว)</small>` : ''} — ${op === '×' ? 'เศษคูณเศษ ส่วนคูณส่วน' : 'หารตัวเศษ'}`;
        slot.append(h('div', { class: 'f3-eq f4-fill', html: `${lhs} = ${fq(P4BOX, d5p10(p))}` }), answerBox(sub(done(`${lhs} = ${fq(ans, d5p10(p))}`)), String(ans), { hint: op === '×' ? `${fmt(A)} × ${fmt(B)}` : `${fmt(Ak)} ÷ ${fmt(B)}` })); }
      else if (op === '×') { lab.innerHTML = `คูณแบบ<b>จำนวนนับ</b>ก่อน: ${fmt(A)} × ${fmt(B)} <small>(ยังไม่ต้องสนใจจุด)</small>`; const w = h('div', { class: 'k3stcol' }); Q.colW({ nums: [A, B], op: '×' }).mount(w, sub(done(`${fmt(A)} × ${fmt(B)} = ${fmt(A * B)}`))); slot.append(w); }
      else { lab.innerHTML = `หารแบบ<b>จำนวนนับ</b>: ${fmt(Ak)} ÷ ${fmt(B)}${k > pa ? ` <small>(${fmtDec(a)} = ${fmtDec((Ak / d5p10(k)).toFixed(k))} เติม 0 ให้หารลงตัว)</small>` : ''}`;
        slot.append(B <= 999 && Ak <= 9999999 ? d3Work(Ak, B, sub(done(`${fmt(Ak)} ÷ ${fmt(B)} = ${fmt(Ak / B)}`)), {}) : answerBox(sub(done(`${fmt(Ak)} ÷ ${fmt(B)} = ${fmt(Ak / B)}`)), String(Ak / B), { hint: 'หารยาว' })); }
      bd.append(h('div', { class: 'colstack d6divq' }, top, rows, lab, slot)); } }; }
});
const L5D = (no, vno, place, title, short, goal, teach, game) => ({ id: 540 + no, place, title, short, tone: TONES5[(no + 2) % 6], goal, teach, game });
const LESSONS_P5C2 = [
  L5D(1, 31, 'ถ้ำส่วนสิบ', 'การเขียนเศษส่วนที่ตัวส่วนเป็นตัวประกอบของ 10 ให้อยู่ในรูปทศนิยม', 'เศษส่วน → ทศนิยม (10)', 'เขียนเศษส่วนที่ตัวส่วนเป็น 2, 5 หรือ 10 ให้อยู่ในรูปทศนิยม', [
    T('ยินดีต้อนรับสู่ <b>ถ้ำทศนิยม</b>! คริสตัล 1 แผ่น แบ่งเป็น <b>10 แถบ</b> เท่า ๆ กัน — 1 แถบ คือ [1/10] หรือ <b>0.1</b> ลองกดปรับ หรือแตะแถบดูนะ', 'ยินดีต้อนรับสู่ถ้ำทศนิยม คริสตัลหนึ่งแผ่นแบ่งเป็นสิบแถบ หนึ่งแถบคือหนึ่งส่วนสิบ หรือศูนย์จุดหนึ่ง', el => el.append(simDecGrid({ unit: 10, t: 3 }))),
    T('[1/2] ตัวส่วนยังไม่ใช่ 10 → <b>คูณทั้งเศษและส่วนด้วย 5</b> ให้ตัวส่วนเป็น 10 แล้วเขียนเป็นทศนิยม', 'หนึ่งส่วนสอง คูณทั้งเศษและส่วนด้วยห้า ให้ตัวส่วนเป็นสิบ แล้วเขียนเป็นทศนิยม', el => el.append(simDecFrac('1/2'))),
    T('จำนวนคละก็ทำได้: จำนวนเต็มอยู่หน้าจุด เศษส่วนอยู่หลังจุด', 'จำนวนคละ จำนวนเต็มอยู่หน้าจุด เศษส่วนอยู่หลังจุด', el => el.append(simDecFrac('3 4/5')))],
    () => [...pkF(P5D_F10, 6).map(f => Q.dFrac({ f })), Q.dMatch({ pairs: pkF(P5D_MATCH10, 4) })]),
  L5D(2, 32, 'ถ้ำส่วนร้อย', 'การเขียนเศษส่วนที่ตัวส่วนเป็นตัวประกอบของ 100 ให้อยู่ในรูปทศนิยม', 'เศษส่วน → ทศนิยม (100)', 'เขียนเศษส่วนที่ตัวส่วนเป็น 4, 20, 25, 50 หรือ 100 ให้อยู่ในรูปทศนิยม', [
    T('แบ่งคริสตัลเป็น <b>100 ช่อง</b> — 1 ช่อง = [1/100] = <b>0.01</b> · 10 ช่อง = 1 แถบ = 0.1 · ลองแตะช่อง หรือกดปรับดูนะ', 'แบ่งคริสตัลเป็นร้อยช่อง หนึ่งช่องคือหนึ่งส่วนร้อย หรือศูนย์จุดศูนย์หนึ่ง', el => el.append(simDecGrid({ unit: 100, t: 2, hh: 7 }))),
    T('[9/20]: คูณทั้งเศษและส่วนด้วย 5 ให้ตัวส่วนเป็น 100', 'เก้าส่วนยี่สิบ คูณทั้งเศษและส่วนด้วยห้า ให้ตัวส่วนเป็นหนึ่งร้อย', el => el.append(simDecFrac('9/20'))),
    T('จำนวนคละ [1 7/25] → [1 28/100] = 1.28', 'หนึ่งเศษเจ็ดส่วนยี่สิบห้า เท่ากับ หนึ่งจุดสองแปด', el => el.append(simDecFrac('1 7/25')))],
    () => [...pkF(P5D_F100, 6).map(f => Q.dFrac({ f })), Q.dMatch({ pairs: pkF(P5D_MATCH100, 4) })]),
  L5D(3, 33, 'ถ้ำส่วนพัน', 'การเขียนเศษส่วนที่ตัวส่วนเป็นตัวประกอบของ 1,000 ให้อยู่ในรูปทศนิยม', 'เศษส่วน → ทศนิยม (1,000)', 'เขียนเศษส่วนที่ตัวส่วนเป็น 8, 40, 125, 200, 250, 500 หรือ 1,000 ให้อยู่ในรูปทศนิยม', [
    T('ทศนิยม <b>3 ตำแหน่ง</b>: หลักหลังจุดคือ <b>ส่วนสิบ · ส่วนร้อย · ส่วนพัน</b> เช่น 4.125 = 4 + [125/1000]', 'ทศนิยมสามตำแหน่ง หลักหลังจุดคือ ส่วนสิบ ส่วนร้อย ส่วนพัน', el => el.append(pvChart('4.125', { lo: -3 }), h('div', { class: 'fbig', html: `<span class="fr"><b class="fw">4</b>${fqHTML(125, 1000)}</span> <b class="fop">=</b> <b class="dnum">4.125</b>` }))),
    T('[3/8]: 8 × 125 = 1,000 → คูณทั้งเศษและส่วนด้วย 125', 'สามส่วนแปด คูณทั้งเศษและส่วนด้วยหนึ่งร้อยยี่สิบห้า', el => el.append(simDecFrac('3/8'))),
    T('ระวัง! [13/250] = [52/1000] = <b>0.052</b> ต้องเติม 0 ในหลักส่วนสิบ', 'สิบสามส่วนสองร้อยห้าสิบ เท่ากับ ศูนย์จุดศูนย์ห้าสอง ต้องเติมศูนย์ในหลักส่วนสิบ', el => el.append(simDecFrac('13/250')))],
    () => [...pkF(P5D_F1000, 6).map(f => Q.dFrac({ f })), Q.dMatch({ pairs: pkF(P5D_MATCH, 4) })]),
  L5D(4, 34, 'ถ้ำปัดหน่วย', 'การหาค่าประมาณของทศนิยมที่เป็นจำนวนเต็มหน่วย', 'ค่าประมาณ จำนวนเต็มหน่วย', 'หาค่าประมาณของทศนิยมให้เป็นจำนวนเต็มหน่วย', [
    T('<b>ลากจุดสีแดง</b>บนเส้นจำนวน — จุดอยู่ใกล้จำนวนเต็มตัวไหนมากกว่า ค่าประมาณก็เป็นตัวนั้น', 'ลากจุดสีแดงบนเส้นจำนวน จุดอยู่ใกล้จำนวนเต็มตัวไหนมากกว่า ค่าประมาณก็เป็นตัวนั้น', el => el.append(simRound('3.62', 0))),
    T('กฎลัด: ดูตัวเลข<b>หลักส่วนสิบ</b> · ตั้งแต่ <b>5</b> ขึ้นไป ปัดขึ้น · น้อยกว่า 5 ปัดทิ้ง (ลองให้จุดอยู่ตรง<b>ครึ่งทาง</b>พอดีดูนะ)', 'กฎลัด ดูตัวเลขหลักส่วนสิบ ตั้งแต่ห้าขึ้นไปปัดขึ้น น้อยกว่าห้าปัดทิ้ง', el => el.append(simRound('12.47', 0)))],
    () => [...pkF(P5D_R0, 6).map((x, i) => Q.dRound({ x, p: 0, line: i < 2 })), Q.dPick({ q: 'ทศนิยมใดมีค่าประมาณเป็นจำนวนเต็มหน่วยเท่ากับ <b>7</b>', opts: ['6.49', '7.518', '7.61'], right: '7.518', hint: 'ดูหลักส่วนสิบของแต่ละจำนวน' })]),
  L5D(5, 35, 'ถ้ำปัดส่วนสิบ', 'การหาค่าประมาณของทศนิยมที่เป็นทศนิยม 1 ตำแหน่ง', 'ค่าประมาณ ทศนิยม 1 ตำแหน่ง', 'หาค่าประมาณของทศนิยมให้เป็นทศนิยม 1 ตำแหน่ง', [
    T('ซูมเส้นจำนวนระหว่าง 4.3 กับ 4.4 — ลากจุดดูว่าใกล้ตัวไหนมากกว่า', 'ซูมเส้นจำนวนระหว่างสี่จุดสามกับสี่จุดสี่ ลากจุดดูว่าใกล้ตัวไหนมากกว่า', el => el.append(simRound('4.36', 1))),
    T('ดูตัวเลข<b>หลักส่วนร้อย</b> · ถ้าปัดขึ้นแล้วหลักส่วนสิบเป็น 10 ต้อง<b>ทด</b>ไปหลักหน่วย เช่น 0.96 ≈ 1.0', 'ดูตัวเลขหลักส่วนร้อย ถ้าปัดขึ้นแล้วหลักส่วนสิบเป็นสิบ ต้องทดไปหลักหน่วย', el => el.append(simRound('0.96', 1)))],
    () => [...pkF(P5D_R1, 6).map((x, i) => Q.dRound({ x, p: 1, line: i < 1 })), Q.dPick({ q: 'ข้อใดหาค่าประมาณเป็นทศนิยม 1 ตำแหน่ง<span class="hl">ไม่ถูกต้อง</span>', opts: ['2.147 ≈ 2.1', '5.695 ≈ 5.6', '8.205 ≈ 8.2', '9.084 ≈ 9.1'], right: '5.695 ≈ 5.6', hint: 'ดูหลักส่วนร้อยของแต่ละข้อ' })]),
  L5D(6, 36, 'ถ้ำปัดส่วนร้อย', 'การหาค่าประมาณของทศนิยมที่เป็นทศนิยม 2 ตำแหน่ง', 'ค่าประมาณ ทศนิยม 2 ตำแหน่ง', 'หาค่าประมาณของทศนิยมให้เป็นทศนิยม 2 ตำแหน่ง', [
    T('ซูมอีกขั้น! ระหว่าง 1.73 กับ 1.74 — ลากจุดดู', 'ซูมอีกขั้น ระหว่างหนึ่งจุดเจ็ดสามกับหนึ่งจุดเจ็ดสี่', el => el.append(simRound('1.736', 2))),
    T('ดูตัวเลข<b>หลักส่วนพัน</b> · 2.998 ≈ <b>3.00</b> (ต้องเขียน 0 ให้ครบ 2 ตำแหน่ง)', 'ดูตัวเลขหลักส่วนพัน สองจุดเก้าเก้าแปด ประมาณ สามจุดศูนย์ศูนย์', el => el.append(simRound('2.998', 2)))],
    () => [...pkF(P5D_R2, 6).map((x, i) => Q.dRound({ x, p: 2, line: i < 1 })), Q.dPick({ q: 'ข้อใดหาค่าประมาณเป็นทศนิยม 2 ตำแหน่ง<span class="hl">ไม่ถูกต้อง</span>', opts: ['5.259 ≈ 5.26', '0.196 ≈ 0.20', '8.082 ≈ 8.09', '4.504 ≈ 4.50'], right: '8.082 ≈ 8.09', hint: 'ดูหลักส่วนพันของแต่ละข้อ' })]),
  L5D(7, 37, 'ถ้ำบวกซ้ำ', 'ความหมายของการคูณทศนิยมกับจำนวนนับ', 'ความหมายการคูณ', 'เข้าใจว่าการคูณทศนิยมกับจำนวนนับ คือการบวกทศนิยมนั้นซ้ำ ๆ', [
    T('<b>3 × 0.4</b> = 0.4 + 0.4 + 0.4 — กดเพิ่มทีละกลุ่ม ดูแถบรวมกันจนเต็ม 1 แผ่น', 'สามคูณศูนย์จุดสี่ เท่ากับ ศูนย์จุดสี่ บวกกันสามครั้ง', el => el.append(simRepeat(3, '0.4'))),
    T('ทศนิยม 2 ตำแหน่งก็เหมือนกัน: <b>5 × 0.16</b>', 'ทศนิยมสองตำแหน่งก็เหมือนกัน ห้าคูณศูนย์จุดหนึ่งหก', el => el.append(simRepeat(5, '0.16')))],
    () => [...pkF(P5D_REP, 5).map(expr => Q.dCalc({ expr, hint: 'บวกทศนิยมนั้นซ้ำ ๆ ตามจำนวนครั้ง หรือคูณแบบจำนวนนับแล้วใส่จุด' })),
      Q.dPick({ q: '0.6 + 0.6 + 0.6 + 0.6 เขียนเป็นการคูณได้ตามข้อใด', opts: ['4 × 0.6', '0.6 × 0.6', '4 + 0.6'], right: '4 × 0.6', hint: 'บวก 0.6 ซ้ำกันกี่ครั้ง?' }),
      Q.dPick({ q: '6 × 0.25 มีความหมายตรงกับข้อใด', opts: ['0.25 + 0.25 + 0.25 + 0.25 + 0.25 + 0.25', '6 + 0.25', '0.25 + 6 + 0.25'], right: '0.25 + 0.25 + 0.25 + 0.25 + 0.25 + 0.25', hint: '6 × 0.25 คือบวก 0.25 ซ้ำ 6 ครั้ง' })]),
  L5D(8, 38, 'ถ้ำคูณด้วยเศษส่วน', 'การหาผลคูณของทศนิยมกับจำนวนนับ โดยใช้ความสัมพันธ์กับเศษส่วน', 'คูณ (ใช้เศษส่วน)', 'หาผลคูณของทศนิยมกับจำนวนนับ โดยเขียนทศนิยมเป็นเศษส่วนก่อน', [
    T('<b>1.25 × 7</b>: เขียน 1.25 เป็นเศษส่วน แล้วคูณ — กดทีละขั้น', 'หนึ่งจุดสองห้าคูณเจ็ด เขียนเป็นเศษส่วนก่อนแล้วคูณ', el => el.append(dcWalk(exprHTML('1.25 × 7'), [['① เป็นเศษส่วน', '1.25 = [125/100]'], ['② คูณ', '[125/100] × 7 = [875/100]'], ['③ เป็นทศนิยม', '[875/100] = <b>8.75</b>']], `${exprHTML('1.25 × 7')} <b class="fop">=</b> ${dH(DQ('8.75'))} → ตัวตั้งมีทศนิยม 2 ตำแหน่ง ผลคูณก็มี 2 ตำแหน่ง`, 'หนึ่งจุดสองห้าคูณเจ็ด เท่ากับ แปดจุดเจ็ดห้า'))),
    T('ข้อสังเกต: <b>0.004 × 9</b> = [4/1000] × 9 = [36/1000] = <b>0.036</b> — ทศนิยมกี่ตำแหน่ง ผลคูณก็กี่ตำแหน่ง', 'ทศนิยมกี่ตำแหน่ง ผลคูณก็มีทศนิยมเท่านั้น', el => el.append(dcWalk(exprHTML('0.004 × 9'), [['① เป็นเศษส่วน', '0.004 = [4/1000]'], ['② คูณ', '[4/1000] × 9 = [36/1000]'], ['③ เป็นทศนิยม', '[36/1000] = <b>0.036</b> (เติม 0 ในหลักส่วนสิบ)']], `ผลคูณมีทศนิยม 3 ตำแหน่ง เท่ากับตัวตั้ง`)))],
    () => [...pkF(P5D_MF, 5).map(expr => Q.d5Work({ expr, mode: 'frac' })), Q.dPoint({ a: '0.26', b: '8' }), Q.dPoint({ a: '3.15', b: '12' })]),
  L5D(9, 39, 'ถ้ำตั้งคูณ', 'การหาผลคูณของทศนิยมกับจำนวนนับ โดยการตั้งคูณ', 'ตั้งคูณ (× จำนวนนับ)', 'หาผลคูณของทศนิยมกับจำนวนนับโดยการตั้งคูณ', [
    T('<b>ตั้งคูณ 3.48 × 26</b>: ① คูณแบบจำนวนนับ ② นับตำแหน่งทศนิยม ③ ใส่จุด — กดทีละขั้น', 'ตั้งคูณ สามจุดสี่แปด คูณ ยี่สิบหก คูณแบบจำนวนนับ นับตำแหน่งทศนิยม แล้วใส่จุด', el => el.append(simColMul('3.48', '26'))),
    T('ลองอีกข้อ: <b>2.07 × 15</b>', 'ลองอีกข้อ สองจุดศูนย์เจ็ด คูณ สิบห้า', el => el.append(simColMul('2.07', '15')))],
    () => [...pkF(P5D_MV, 4).map(expr => Q.d5Work({ expr, mode: 'col' })), Q.dPoint({ a: '6.75', b: '14' }), ...pkF([...P5D_CMP1.slice(0, 2), ['2.5 × 4', '5 × 2'], ['1.5 × 6', '3 × 3']], 2).map(([l, r]) => Math.random() < .5 ? Q.dCmp({ l, r }) : Q.dCmp({ l: r, r: l }))]),
  L5D(10, 40, 'ถ้ำเลื่อนหลัก', 'การคูณทศนิยมด้วย 10 100 1,000', '× 10, 100, 1,000', 'คูณทศนิยมด้วย 10, 100, 1,000 โดยการเลื่อนจุดทศนิยม', [
    T('กดปุ่ม <b>× 10 · × 100 · × 1,000</b> แล้วดูตัวเลขทุกตัว<b>เลื่อนไปทางซ้าย</b> 1, 2, 3 หลัก', 'กดปุ่ม คูณสิบ คูณร้อย คูณพัน แล้วดูตัวเลขทุกตัวเลื่อนไปทางซ้าย', el => el.append(simShift('2.475', 'mul'))),
    T('สรุป: คูณด้วย 10 · 100 · 1,000 → <b>จุดทศนิยมเลื่อนไปทางขวา</b> 1 · 2 · 3 ตำแหน่ง (ถ้าตัวเลขไม่พอ เติม 0) — ลองกับ 0.36', 'คูณด้วยสิบ ร้อย พัน จุดทศนิยมเลื่อนไปทางขวา หนึ่ง สอง สาม ตำแหน่ง', el => el.append(simShift('0.36', 'mul')))],
    () => [...pkF(P5D_M10, 5).map(expr => Q.dCalc({ expr })), Q.dMiss({ a: '1.12', res: '112' }), Q.dMiss({ a: '0.08', res: '80' }), Q.dCmp({ l: '8.8 × 10', r: '8.8 × 100' })]),
  L5D(11, 41, 'ถ้ำตารางคูณ', 'การหาผลคูณของทศนิยมกับทศนิยม โดยใช้ความสัมพันธ์กับเศษส่วน', 'ทศนิยม × ทศนิยม (เศษส่วน)', 'หาผลคูณของทศนิยมกับทศนิยม โดยเขียนเป็นเศษส่วนก่อน', [
    T('<b>แบบจำลองพื้นที่</b>: แถบฟ้า = ตัวตั้ง · แถบเหลือง = ตัวคูณ · ช่องเขียว = ผลคูณ (ส่วนร้อย) — ปรับตัวเลขดู', 'แบบจำลองพื้นที่ ช่องสีเขียวคือผลคูณ เป็นส่วนร้อย ปรับตัวเลขดู', el => el.append(simDecArea(6, 4))),
    T('<b>1.3 × 2.4</b> = [13/10] × [24/10] = [312/100] = 3.12 · ส่วนสิบ × ส่วนสิบ = <b>ส่วนร้อย</b>', 'ส่วนสิบคูณส่วนสิบ ได้ส่วนร้อย', el => el.append(dcWalk(exprHTML('1.3 × 2.4'), [['① เป็นเศษส่วน', '1.3 = [13/10] · 2.4 = [24/10]'], ['② คูณ', '[13/10] × [24/10] = [312/100]'], ['③ เป็นทศนิยม', '[312/100] = <b>3.12</b>']], `ทศนิยม 1 ตำแหน่ง × ทศนิยม 1 ตำแหน่ง → ผลคูณมีทศนิยม <b>2</b> ตำแหน่ง`)))],
    () => [...pkF(P5D_MDF, 5).map(expr => Q.d5Work({ expr, mode: 'frac' })), ...pkF(P5D_CMP2, 2).map(([l, r]) => Q.dCmp({ l, r }))]),
  L5D(12, 42, 'ถ้ำตั้งคูณทศนิยม', 'การหาผลคูณของทศนิยมกับทศนิยม โดยการตั้งคูณ', 'ตั้งคูณ (ทศนิยม × ทศนิยม)', 'หาผลคูณของทศนิยมกับทศนิยมโดยการตั้งคูณ', [
    T('<b>ตั้งคูณ 2.35 × 1.4</b>: ทศนิยม 2 ตำแหน่ง + 1 ตำแหน่ง = ผลคูณมี 3 ตำแหน่ง', 'ตั้งคูณ สองจุดสามห้า คูณ หนึ่งจุดสี่ ทศนิยมสองตำแหน่งบวกหนึ่งตำแหน่ง ผลคูณมีสามตำแหน่ง', el => el.append(simColMul('2.35', '1.4'))),
    T('ถ้าตัวเลขไม่พอ ให้<b>เติม 0 ข้างหน้า</b>: 0.26 × 0.3', 'ถ้าตัวเลขไม่พอ ให้เติมศูนย์ข้างหน้า', el => el.append(simColMul('0.26', '0.3')))],
    () => [...pkF(P5D_MDV, 4).map(expr => Q.d5Work({ expr, mode: 'col' })), Q.dPoint({ a: '4.8', b: '0.35' }), Q.dPoint({ a: '0.12', b: '0.4' }), Q.dCmp(pick(P5D_CMP2.map(([l, r]) => ({ l, r }))))]),
  L5D(13, 43, 'ถ้ำแบ่งคริสตัล', 'การหารทศนิยมด้วยจำนวนนับ โดยใช้ความสัมพันธ์กับเศษส่วน', 'หาร (ใช้เศษส่วน)', 'หารทศนิยมด้วยจำนวนนับ โดยใช้ความสัมพันธ์กับเศษส่วน', [
    T('<b>1.2 ÷ 3</b> = แบ่ง 12 แถบ (ส่วนสิบ) ให้ 3 คนเท่า ๆ กัน — กดแบ่งดูนะ', 'หนึ่งจุดสองหารสาม คือแบ่งสิบสองแถบให้สามคนเท่า ๆ กัน', el => el.append(simShareDec('1.2', 3))),
    T('ใช้เศษส่วน: <b>0.375 ÷ 15</b> = [375/1000] × [1/15] = [25/1000] = 0.025', 'ใช้เศษส่วน หารด้วยจำนวนนับ คือคูณด้วยส่วนกลับ', el => el.append(dcWalk(exprHTML('0.375 ÷ 15'), [['① เป็นเศษส่วน', '0.375 = [375/1000]'], ['② หาร', '[375/1000] ÷ 15 = [375/1000] × [1/15] = [25/1000]'], ['③ เป็นทศนิยม', '[25/1000] = <b>0.025</b>']], `ตรวจ: 0.025 × 15 = 0.375 ✓`)))],
    () => pkF(P5D_DF, 6).map(expr => Q.d5Work({ expr, mode: 'frac' }))), /* v164 */
  L5D(14, 44, 'ถ้ำตั้งหาร', 'การหารทศนิยมด้วยจำนวนนับ โดยการตั้งหาร', 'ตั้งหาร', 'หารทศนิยมด้วยจำนวนนับโดยการตั้งหาร', [
    T('<b>ตั้งหาร 61.25 ÷ 5</b>: หารทีละหลักเหมือนจำนวนนับ และใส่จุดของผลหาร<b>ตรงกับ</b>จุดของตัวตั้ง', 'ตั้งหาร หกสิบเอ็ดจุดสองห้า หารห้า หารทีละหลัก ใส่จุดของผลหารตรงกับตัวตั้ง', el => el.append(simLongDiv('61.25', 5))),
    T('ถ้าหลักแรกหารไม่ได้ ผลหารหลักหน่วยเป็น <b>0</b>: 3.024 ÷ 4', 'ถ้าหลักแรกหารไม่ได้ ผลหารหลักหน่วยเป็นศูนย์', el => el.append(simLongDiv('3.024', 4)))],
    () => pkF(P5D_DV, 6).map(expr => Q.d5Work({ expr, mode: 'col' }))), /* v164 */
  L5D(15, 45, 'ถ้ำหารเติมศูนย์', 'การหารจำนวนนับด้วยจำนวนนับ ที่มีผลหารเป็นทศนิยม', 'ผลหารเป็นทศนิยม', 'หารจำนวนนับด้วยจำนวนนับที่ผลหารเป็นทศนิยม โดยเติม 0 หลังจุด', [
    T('<b>25 ÷ 8</b> หารไม่ลงตัว → เขียน 25 เป็น 25.000 แล้ว<b>หารต่อ</b>จนลงตัว', 'ยี่สิบห้าหารแปด หารไม่ลงตัว เขียนเป็นยี่สิบห้าจุดศูนย์ศูนย์ศูนย์ แล้วหารต่อจนลงตัว', el => el.append(simLongDiv('25', 8))),
    T('ตัวตั้งน้อยกว่าตัวหาร: <b>3 ÷ 4</b> = 0.75', 'ตัวตั้งน้อยกว่าตัวหาร สามหารสี่ เท่ากับศูนย์จุดเจ็ดห้า', el => el.append(simLongDiv('3', 4)))],
    () => pkF(P5D_DW, 6).map(expr => Q.d5Work({ expr, mode: 'col' }))), /* v164 */
  L5D(16, 46, 'ถ้ำเลื่อนกลับ', 'การหารทศนิยมด้วย 10 100 1,000', '÷ 10, 100, 1,000', 'หารทศนิยมด้วย 10, 100, 1,000 โดยการเลื่อนจุดทศนิยม', [
    T('กดปุ่ม <b>÷ 10 · ÷ 100 · ÷ 1,000</b> — ตัวเลขทุกตัว<b>เลื่อนไปทางขวา</b> (จุดเลื่อนไปทางซ้าย)', 'กดปุ่มหาร ตัวเลขทุกตัวเลื่อนไปทางขวา จุดทศนิยมเลื่อนไปทางซ้าย', el => el.append(simShift('58.4', 'div'))),
    T('คูณกับหารเป็น<b>การกระทำตรงข้าม</b>กัน — ลองกดสลับกันดูนะ', 'คูณกับหารเป็นการกระทำตรงข้ามกัน ลองกดสลับกันดู', el => el.append(simShift('7.2')))],
    () => [...pkF(P5D_D10, 6).map(expr => Q.dCalc({ expr })), Q.dFill({ q: '☐ ÷ 100 = 1.125', a: '112.5', hint: 'ย้อนกลับด้วยการคูณ: 1.125 × 100' }), Q.dMiss({ a: '45.6', res: '0.456', op: '÷' })]),
  L5D(17, 47, 'ถ้ำวัดความยาว', 'ทศนิยมกับการวัดความยาว', 'ทศนิยมกับความยาว', 'เขียนความยาวในรูปทศนิยม และเปลี่ยนหน่วยความยาว', [
    T('<b>ไม้บรรทัด</b>: 1 ซม. มี 10 มม. → 1 มม. = 0.1 ซม. · ลากแถบสีแดงดูนะ', 'หนึ่งเซนติเมตรมีสิบมิลลิเมตร หนึ่งมิลลิเมตรเท่ากับศูนย์จุดหนึ่งเซนติเมตร', el => el.append(simConv({ big: 'เซนติเมตร', small: 'มิลลิเมตร', ratio: 10, max: 12, start: 46, pic: 'ruler' }))),
    T('<b>สายวัด</b>: 1 ม. มี 100 ซม. → 1 ซม. = 0.01 ม.', 'หนึ่งเมตรมีหนึ่งร้อยเซนติเมตร หนึ่งเซนติเมตรเท่ากับศูนย์จุดศูนย์หนึ่งเมตร', el => el.append(simConv({ big: 'เมตร', small: 'เซนติเมตร', ratio: 100, max: 3, start: 154, pic: 'tape' }))),
    T('<b>ถนน</b>: 1 กม. มี 1,000 ม. → 1 ม. = 0.001 กม.', 'หนึ่งกิโลเมตรมีหนึ่งพันเมตร หนึ่งเมตรเท่ากับศูนย์จุดศูนย์ศูนย์หนึ่งกิโลเมตร', el => el.append(simConv({ big: 'กิโลเมตร', small: 'เมตร', ratio: 1000, max: 3, start: 1250, pic: 'road' })))],
    () => pkF(P5D_LEN, 6).map(u => Q.dFill(u))),
  L5D(18, 48, 'ถ้ำชั่งน้ำหนัก', 'ทศนิยมกับการชั่งน้ำหนัก', 'ทศนิยมกับน้ำหนัก', 'เขียนน้ำหนักในรูปทศนิยม และเปลี่ยนหน่วยน้ำหนัก', [
    T('<b>เครื่องชั่ง</b>: 1 กก. มี 1,000 ก. → 100 ก. = 0.1 กก. · เลื่อนแถบใต้เครื่องชั่งดูนะ', 'หนึ่งกิโลกรัมมีหนึ่งพันกรัม หนึ่งร้อยกรัมเท่ากับศูนย์จุดหนึ่งกิโลกรัม', el => el.append(simConv({ big: 'กิโลกรัม', small: 'กรัม', ratio: 1000, max: 3, start: 1700, pic: 'scale' }))),
    T('<b>ของหนักมาก</b> ใช้ตัน: 1 ตัน = 1,000 กก. เช่น 2,350 กก. = 2.35 ตัน', 'หนึ่งตันเท่ากับหนึ่งพันกิโลกรัม', el => el.append(simConv({ big: 'ตัน', small: 'กิโลกรัม', ratio: 1000, max: 4, start: 2350, pic: 'tape' })))],
    () => pkF(P5D_WT, 6).map(u => Q.dFill(u))),
  L5D(19, 49, 'ถ้ำตวงน้ำ', 'ทศนิยมกับการตวงปริมาตร', 'ทศนิยมกับปริมาตร', 'เขียนปริมาตรในรูปทศนิยม และเปลี่ยนหน่วยลิตรกับมิลลิลิตร', [
    T('<b>เหยือกตวง</b>: 1 ลิตร มี 1,000 มล. → เติมน้ำโดยเลื่อนแถบ แล้วอ่านเป็นลิตร', 'หนึ่งลิตรมีหนึ่งพันมิลลิลิตร เติมน้ำโดยเลื่อนแถบ แล้วอ่านเป็นลิตร', el => el.append(simConv({ big: 'ลิตร', small: 'มิลลิลิตร', ratio: 1000, max: 2, start: 750, pic: 'jug', steps: [50, 250] }))),
    T('อ่านปริมาตรเป็นทศนิยม: 1 ลิตร 350 มล. = <b>1.35 ลิตร</b> = 1,350 มล.', 'หนึ่งลิตรสามร้อยห้าสิบมิลลิลิตร เท่ากับ หนึ่งจุดสามห้าลิตร', el => el.append(simConv({ big: 'ลิตร', small: 'มิลลิลิตร', ratio: 1000, max: 2, start: 1350, pic: 'jug', steps: [10, 100] })))],
    () => pkF(P5D_VOL, 6).map(u => Q.dFill(u))),
  L5D(20, 50, 'ถ้ำโจทย์ขั้นเดียว', 'การวิเคราะห์โจทย์ปัญหา 1 ขั้นตอน', 'วิเคราะห์โจทย์ 1 ขั้นตอน', 'วิเคราะห์และแก้โจทย์ปัญหาการคูณ การหารทศนิยม 1 ขั้นตอน', [
    T('อ่านโจทย์ → หา<b>สิ่งที่กำหนด</b> · <b>สิ่งที่ถาม</b> → เลือกวิธี → ตรวจคำตอบ', 'อ่านโจทย์ หาสิ่งที่กำหนด สิ่งที่ถาม เลือกวิธี แล้วตรวจคำตอบ', el => el.append(dcStory('นมกล่องหนึ่งมีปริมาตร 0.33 ลิตร ถ้ามีนม 20 กล่อง จะมีนมรวมกี่ลิตร', [['โจทย์กำหนด', 'กระป๋องละ 0.33 ลิตร · 20 กระป๋อง'], ['โจทย์ถาม', 'น้ำผลไม้ทั้งหมดกี่ลิตร'], ['เลือกวิธี', 'หลายชุดเท่า ๆ กัน → <b>คูณ</b>: 0.33 × 20'], ['ตรวจ', '6.6 ÷ 20 = 0.33 ✓']], '0.33 × 20'))),
    T('“แบ่งเท่า ๆ กัน” → <b>หาร</b>', 'แบ่งเท่า ๆ กัน ใช้การหาร', el => el.append(dcStory('ท่อน้ำยาว 61.25 เมตร ตัดเป็น 5 ท่อนเท่า ๆ กัน แต่ละท่อนยาวเท่าไร', [['โจทย์กำหนด', 'ลวด 61.25 เมตร · ตัด 5 เส้นเท่า ๆ กัน'], ['เลือกวิธี', 'แบ่งเท่า ๆ กัน → <b>หาร</b>: 61.25 ÷ 5'], ['ตรวจ', '12.25 × 5 = 61.25 ✓']], '61.25 ÷ 5')))],
    () => pkF(P5D_S1, 6).map(s => Q.p4Story2({ ...s, dec: true }))),
  L5D(21, 51, 'ถ้ำโจทย์สองขั้น', 'การวิเคราะห์โจทย์ปัญหา 2 ขั้นตอน', 'วิเคราะห์โจทย์ 2 ขั้นตอน', 'วิเคราะห์โจทย์ปัญหาการบวก ลบ คูณ หารทศนิยม 2 ขั้นตอน', [
    T('โจทย์ 2 ขั้นตอน: หา<b>สิ่งที่ยังไม่รู้</b>ก่อน แล้วค่อยตอบคำถาม', 'โจทย์สองขั้นตอน หาสิ่งที่ยังไม่รู้ก่อน แล้วค่อยตอบคำถาม', el => el.append(dcStory('ยายมีถั่วเขียว 40.5 ลิตร ใช้วันละ 1.25 ลิตร ติดต่อกัน 2 สัปดาห์ ยายเหลือถั่วเขียวกี่ลิตร', [['ขั้นที่ 1', '2 สัปดาห์ = 2 × 7 = 14 วัน'], ['ขั้นที่ 2', 'ใช้ไปทั้งหมด 14 × 1.25 = 17.5 ลิตร'], ['ขั้นที่ 3', 'เหลือ 40.5 − 17.5 = 23 ลิตร'], ['ประโยคสัญลักษณ์', '40.5 − 14 × 1.25 = ☐ (คูณก่อน แล้วค่อยลบ)']], '40.5 − 14 × 1.25'))),
    T('ตัวอย่างที่ 2: ซื้อของ 2 อย่าง — คูณก่อน แล้วค่อยบวก', 'ตัวอย่างที่สอง ซื้อของสองอย่าง คูณก่อนแล้วค่อยบวก', el => el.append(dcStory('ซื้อดินสอ 6 แท่ง แท่งละ 4.50 บาท และยางลบ 1 ก้อน ราคา 7.25 บาท จ่ายทั้งหมดกี่บาท', [['ขั้นที่ 1', 'ค่าดินสอ 6 × 4.50 = 27 บาท'], ['ขั้นที่ 2', 'รวมยางลบ 27 + 7.25 = 34.25 บาท'], ['ประโยคสัญลักษณ์', '6 × 4.50 + 7.25 = ☐']], '6 × 4.50 + 7.25')))],
    () => [Q.fFirst({ expr: pick(P5D_FIRST) }), ...pkF(P5D_S2, 6).map(s => Q.p4Story2({ ...s, dec: true }))]),
  L5D(22, 52, 'ถ้ำแสดงวิธีทำ', 'การแสดงวิธีทำโจทย์ปัญหา 2 ขั้นตอน', 'แสดงวิธีทำโจทย์ 2 ขั้นตอน', 'แสดงวิธีทำโจทย์ปัญหาทศนิยม 2 ขั้นตอน รวมการเปลี่ยนหน่วย', [
    T('แสดงวิธีทำ 4 ขั้น: ① อ่าน ② วางแผน ③ เขียนประโยคสัญลักษณ์และคำนวณ ④ ตรวจ', 'แสดงวิธีทำสี่ขั้น อ่าน วางแผน เขียนประโยคสัญลักษณ์และคำนวณ ตรวจ', el => el.append(dcStory('ซื้อผ้า 3.5 เมตร ราคาเมตรละ 48.50 บาท จ่ายด้วยธนบัตร 500 บาท จะได้เงินทอนกี่บาท', [['① อ่าน', 'ผ้า 3.5 ม. · เมตรละ 48.50 บาท · จ่าย 500 บาท · ถามเงินทอน'], ['② วางแผน', 'หาราคาผ้า (คูณ) แล้วหาเงินทอน (ลบ)'], ['③ คำนวณ', '3.5 × 48.50 = 169.75 → 500 − 169.75 = 330.25 บาท'], ['④ ตรวจ', '330.25 + 169.75 = 500 ✓']], '500 − 3.5 × 48.50'))),
    T('ระวัง<b>หน่วย</b>! ถ้าโจทย์ถามคนละหน่วย ต้องเปลี่ยนหน่วยด้วย (× หรือ ÷ 10, 100, 1,000)', 'ระวังหน่วย ถ้าโจทย์ถามคนละหน่วย ต้องเปลี่ยนหน่วยด้วย', el => el.append(dcStory('ยา 1 เม็ด มีตัวยา 0.425 กรัม โรงงานผลิตยา 400,000 เม็ด ต้องใช้ตัวยากี่กิโลกรัม', [['ขั้นที่ 1', '0.425 × 400,000 = 170,000 กรัม'], ['ขั้นที่ 2', '170,000 ÷ 1,000 = 170 กิโลกรัม'], ['ประโยคสัญลักษณ์', '0.425 × 400000 ÷ 1000 = ☐']], '0.425 × 400000 ÷ 1000')))],
    () => pkF(P5D_S3, 7).map(s => Q.p4Story2({ ...s, dec: true })))
];
/* boss 569: ข้อสอบท้ายบท — แต่งใหม่ทั้งหมด (original items) */
const XE = (...o) => o.map(x => ({ html: exprHTML(x), say: exprSay(x) }));
const EXAM_P5C2 = xrot([
  { q: `${FX('[2 9/250]')} เขียนให้อยู่ในรูปทศนิยมได้ตามข้อใด`, opts: ['2.36', '2.036', '2.0036', '0.236'], a: 1 },
  { q: '7.482 หาค่าประมาณเป็นจำนวนเต็มหน่วยได้ตรงกับข้อใด', opts: ['7', '8', '7.5', '7.4'], a: 0 },
  { q: 'ข้อใดหาค่าประมาณเป็นทศนิยม 1 ตำแหน่ง<b>ไม่ถูกต้อง</b>', opts: ['3.46 ≈ 3.5', '8.04 ≈ 8.0', '5.95 ≈ 5.9', '0.72 ≈ 0.7'], a: 2 },
  { q: `${exprHTML('0.326 × 15')} = ☐`, opts: ['4.89', '3.26', '4.98', '48.9'], a: 0 },
  { q: 'ข้อใดมีผลคูณน้อยที่สุด', opts: XE('0.4 × 2', '3 × 0.25', '0.7 × 0.7', '6 × 0.15'), a: 2 },
  { q: `${exprHTML('18.36 ÷ 4')} = ☐`, opts: ['4.59', '4.509', '4.95', '5.49'], a: 0 },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['7.25 ÷ 5 = 1.45', '3.6 ÷ 8 = 0.45', '11 ÷ 4 = 2.75', '15 ÷ 8 = 1.85'], a: 3 },
  { q: 'สมมติว่าเงิน 1 ยูโร แลกเป็นเงินไทยได้ 37.46 บาท พลอยมีเงิน 120 ยูโร จะแลกเป็นเงินไทยได้กี่บาท', opts: ['4,495.20 บาท', '4,459.20 บาท', '4,495.02 บาท', '449.52 บาท'], a: 0 },
  { q: 'ภูมิปั่นจักรยานจากบ้านถึงตลาด 3.8 กิโลเมตร แล้วปั่นต่ออีก 1,600 เมตรถึงโรงเรียน ใช้เวลาทั้งหมด 2 ชั่วโมง ภูมิปั่นเฉลี่ยชั่วโมงละกี่กิโลเมตร', opts: ['2.7 กิโลเมตร', '2.4 กิโลเมตร', '3.2 กิโลเมตร', '5.4 กิโลเมตร'], a: 0 },
  { q: 'ปลาวิ่งรอบสนาม 15 รอบ ได้ระยะทาง 6 กิโลเมตร สนามนี้ยาวรอบละกี่เมตร', opts: ['300 เมตร', '400 เมตร', '450 เมตร', '40 เมตร'], a: 1 },
  { q: 'ข้อใดมีค่าเท่ากันทั้งหมด', opts: XO('[3/5], 0.6, 0.06', '[6/25], 0.24, 0.240', '[1/4], 0.4, 0.25', '[7/10], 0.07, 0.70'), a: 1 },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: XO('[1 3/4] = 1.75', '[4 1/8] = 4.125', '[9/20] = 0.45', '[2 3/25] = 2.3'), a: 3 },
  { q: '1 กิโลกรัม มี 1,000 กรัม น้ำตาล 250 กรัม เขียนเป็นทศนิยมในหน่วยกิโลกรัมได้อย่างไร', opts: ['0.025 กิโลกรัม', '0.25 กิโลกรัม', '2.5 กิโลกรัม', '0.205 กิโลกรัม'], a: 1 },
  { q: `ข้อใดมีค่ามากกว่า ${FX('[7/20]')}`, opts: XO('0.305', '[1/4]', '0.4', '[3/10]'), a: 2 },
  { q: 'ผลลัพธ์ในข้อใดมีค่าน้อยกว่า 30.5', opts: XE('6.2 × 5', '4.15 × 8', '7.4 × 4.1', '5.5 × 5.6'), a: 2 },
  { q: `ทศนิยมใดลบด้วย 9.65 แล้วมีค่าเท่ากับ ${exprHTML('4.2 × 3.5')}`, opts: ['23.35', '24.35', '25.35', '5.05'], a: 1 },
  { q: 'พิจารณา 1) 46.38 + 27.94 = 74.32 2) 90.05 − 38.67 = 51.48 3) 3.75 × 12 = 45.00 4) 6.4 × 8.5 = 54.4 ข้อใดถูกต้อง', opts: ['ข้อ 1, 2, 3', 'ข้อ 1, 3, 4', 'ข้อ 2, 3, 4', 'ข้อ 1, 2, 3, 4'], a: 1 },
  { q: '91.2 เป็นผลลัพธ์ของข้อใด', opts: XE('15.2 × 6', '22.6 × 4', '9.5 × 9.4', '12.5 × 7.4'), a: 0 },
  { q: `${exprHTML('52.4 + (3.5 × 6.2)')} มีผลลัพธ์เท่ากับข้อใด`, opts: XE('24.7 × 3', '98.6 − 25.4', '36.85 + 38.15', '12.3 × 6'), a: 0 },
  { q: 'ผลลัพธ์ในข้อใดมีค่ามากกว่า 40', opts: XE('2.5 × (18.4 − 3.6)', '(25.6 − 17.3) × 4', '19.8 + (4.5 × 4.6)', '(3.2 × 6.5) + 18.4'), a: 2 },
  { q: '“ป้าซื้อปลา 4 ตัว รวมน้ำหนัก 5.6 กิโลกรัม” จากข้อมูลข้อใดถูกต้อง', opts: ['ปลาหนักเฉลี่ยตัวละ 1.4 กิโลกรัม', 'ถ้าซื้อปลากิโลกรัมละ 80 บาท ป้าจ่ายเงิน 428 บาท', 'ถ้าปลา 3 ตัวหนักรวม 4.3 กิโลกรัม ตัวที่เหลือหนัก 1.5 กิโลกรัม', 'ปลาทั้งหมดหนัก 5,060 กรัม'], a: 0 },
  { q: 'ฟ้าซื้อปากกาด้ามละ 8.75 บาท 4 ด้าม และดินสอแท่งละ 4.50 บาท 6 แท่ง ให้ธนบัตรฉบับละ 100 บาท 1 ฉบับ จะได้รับเงินทอนกี่บาท', opts: ['38 บาท', '62 บาท', '37.50 บาท', '48 บาท'], a: 0 }
], 2);
LESSONS_P5C2.push({ id: 569, boss: true, place: 'ถ้ำราชาหมีคริสตัล', title: 'ด่านบอส: บทที่ 2 ทศนิยม', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'ตอบคำถามเรื่องทศนิยม 22 ข้อ ตอบถูกอย่างน้อย 11 ข้อเพื่อชนะบอส',
  exam: EXAM_P5C2, pass: 11, bossName: 'ราชาหมีคริสตัล', bossPal: 'grey', emblem: '0.1', bossKind: 'bear' });
