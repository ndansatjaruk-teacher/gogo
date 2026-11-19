/* =========================================================
   GRADE 4 · CHAPTER 2 — การบวกและการลบจำนวนนับที่มากกว่า 100,000  (ทะเลทราย)
   ========================================================= */
const P4_SN = ['ร้อยล้าน', 'สิบล้าน', 'ล้าน', 'แสน', 'หมื่น', 'พัน', 'ร้อย', 'สิบ', 'หน่วย'];
const p4D = n => String(n).split('').reverse().map(Number);           // digits from the units place
const p4ev = e => Number(dTxt(exprEval(e)).replace(/,/g, ''));      // exact value of an expression
const p4ex2 = e => e.replace(/\d+/g, d => fmt(+d));                  // "1250600 − 875450" → with commas

/* ---------- column layout (ตั้งบวก/ตั้งลบ) ---------- */
function p4colHTML(a, b, op, st = {}, o = {}) {
  const A = p4D(a), B = p4D(b), r = op === '+' ? a + b : a - b, n = Math.max(A.length, B.length, String(r).length);
  const cell = (p, cls, v) => `<span class="${cls}${st.hi === p ? ' hi' : ''}">${v}</span>`;
  const row = f => { let t = ''; for (let p = n - 1; p >= 0; p--) t += f(p); return t; };
  let s = `<div class="p4col${o.sm ? ' sm' : ''}" style="grid-template-columns:1.1em repeat(${n},1.25em)">`;
  if (o.names !== false) s += '<span></span>' + row(p => cell(p, 'pn', P4_SN[8 - p]));
  if (!o.still) s += '<span></span>' + row(p => cell(p, 'mk', st.carry && st.carry[p] ? '1' : st.nv && st.nv[p] != null ? st.nv[p] : ''));
  s += '<span></span>' + row(p => cell(p, 'dg' + (st.cross && st.cross[p] ? ' x' : ''), A[p] != null ? A[p] : ''));
  s += `<span class="sg">${op}</span>` + row(p => cell(p, 'dg', B[p] != null ? B[p] : ''));
  s += `<span class="ln" style="grid-column:1 / span ${n + 1}"></span>`;
  if (o.nores) return s + '</div>';
  s += '<span></span>' + row(p => cell(p, 'dg rs', st.res && st.res[p] != null ? st.res[p] : ''));
  return s + `<span class="ln dbl" style="grid-column:1 / span ${n + 1}"></span></div>`;
}
/* the column-by-column plan: what happens in each place (used by the sim and the worked examples) */
function p4colPlan(a, b, op) {
  const A = p4D(a), B = p4D(b), L = Math.max(A.length, B.length), T = A.slice(), R = String(op === '+' ? a + b : a - b).length, steps = []; let c = 0;
  for (let p = 0; p < L; p++) {
    const nm = 'หลัก' + P4_SN[8 - p], st = { p, carry: {}, nv: {}, cross: {} };
    if (op === '+') { const da = A[p] || 0, db = B[p] || 0, s = da + db + c;
      st.text = `${nm}: ${da} + ${db}${c ? ' + 1 (ที่ทดมา)' : ''} = ${s}` + (s >= 10 ? ` → เขียน ${s % 10} <b>ทด 1</b> ไปหลัก${P4_SN[7 - p] || 'ถัดไป'}` : '');
      st.res = s % 10; c = s >= 10 ? 1 : 0; if (c) st.carry[p + 1] = 1; if (c && p === L - 1) st.extra = 1; }
    else { const db = B[p] || 0, t0 = T[p];
      if (T[p] < db) { let j = p + 1; while (T[j] === 0) j++;
        T[j]--; st.cross[j] = 1; st.nv[j] = T[j]; for (let m = j - 1; m > p; m--) { T[m] = 9; st.cross[m] = 1; st.nv[m] = 9; }
        T[p] += 10; st.cross[p] = 1; st.nv[p] = T[p];
        st.text = `${nm}: ${t0} ลบ ${db} ไม่ได้ → <b>กระจาย</b>จากหลัก${P4_SN[8 - j]}${j > p + 1 ? ' (หลักที่เป็น 0 ระหว่างทางกลายเป็น 9)' : ''} → ${T[p]} − ${db} = ${T[p] - db}`; }
      else st.text = `${nm}: ${t0} − ${db} = ${t0 - db}`;
      st.res = T[p] - db; st.lead = p >= R; }
    steps.push(st);
  }
  return steps;
}
const p4colRows = (a, b, op) => p4colPlan(a, b, op).map(s => [P4_SN[8 - s.p], s.text.replace(/^หลัก[^:]+: /, '')]);
/* step through ตั้งบวก / ตั้งลบ one place at a time */
function simColumn(list, op) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const [a, b] = list[idx], r = op === '+' ? a + b : a - b, plan = p4colPlan(a, b, op); box.innerHTML = '';
    const st = { carry: {}, nv: {}, cross: {}, res: {}, hi: -1 }, fig = h('div', { class: 'p4colwrap' }), note = fNote(), fin = h('div', { class: 'fbig p4est' }); let k = 0;
    const paint = () => fig.innerHTML = p4colHTML(a, b, op, st);
    note.innerHTML = `ตั้งหลักให้ตรงกัน แล้ว${op === '+' ? 'บวก' : 'ลบ'}จาก<b>หลักหน่วย</b>ไปทางซ้าย`;
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const s = plan[k++];
      st.hi = s.p; Object.assign(st.carry, s.carry); Object.assign(st.nv, s.nv); Object.assign(st.cross, s.cross); if (!s.lead) st.res[s.p] = s.res; if (s.extra) st.res[s.p + 1] = 1;
      note.innerHTML = s.text; sfx.pop(k);
      if (k >= plan.length) { st.hi = -1; btn.remove(); fin.innerHTML = `${fmt(a)} ${op} ${fmt(b)} = <b class="num">${fmt(r)}</b>`; sfx.ok(); say(`${thaiWords(a)} ${op === '+' ? 'บวก' : 'ลบ'} ${thaiWords(b)} เท่ากับ ${thaiWords(r)}`, true); }
      paint(); } }, icon('right'), 'ทำหลักต่อไป');
    paint(); box.append(fig, note, btn, fin, p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'โจทย์ใหม่'));
  };
  draw(); return box;
}

/* ---------- estimation ---------- */
function simEstCalc(items) {
  let idx = 0, P = 5; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const [a, op, b] = items[idx], r = op === '+' ? a + b : a - b; box.innerHTML = '';
    const seg = h('div', { class: 'seg p4seg' }), tb = h('div', { class: 'p4shop' }), big = h('div', { class: 'fbig p4est' }), out = fNote();
    const paint = () => { const ra = p4r(a, P), rb = p4r(b, P), E = op === '+' ? ra + rb : ra - rb;
      tb.innerHTML = [[a, ra], [b, rb]].map(([x, rx]) => `<div><span>ประมาณ</span><b class="num">${fmt(x)}</b><i>≈</i><b class="num p4e">${fmt(rx)}</b></div>`).join('');
      big.innerHTML = `ค่าประมาณ <b class="num">${fmt(ra)} ${op} ${fmt(rb)}</b> <b class="fop">=</b> <b class="num">${fmt(E)}</b>`;
      out.innerHTML = `ผลลัพธ์จริง ${fmt(a)} ${op} ${fmt(b)} = <b>${fmt(r)}</b> · ต่างจากค่าประมาณ ${fmt(Math.abs(r - E))}<br>ประมาณเป็นหลักที่<b>ใหญ่ขึ้น</b> → คิดในใจง่ายขึ้น แต่คลาดเคลื่อนมากขึ้น`; };
    seg.append(...[3, 4, 5, 6].map(p => { const bt = h('button', { class: p === P ? 'on' : '', onclick: e => { e.stopPropagation(); P = p; seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === bt)); sfx.tap(); paint(); } }, 'เต็ม' + P4_RN[p]); return bt; }));
    paint(); box.append(h('div', { class: 'fbig p4big' }, `${fmt(a)} ${op} ${fmt(b)}`), seg, tb, big, out, p4more(() => { idx = (idx + 1) % items.length; draw(); }, 'โจทย์ใหม่'));
  };
  draw(); return box;
}

/* ---------- calculator (immediate execution, like a basic school calculator) ---------- */
const p4cf = s => { const neg = s.startsWith('-'); const [i, d] = s.replace('-', '').split('.'); return (neg ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d != null ? '.' + d : ''); };
function p4calc(o = {}) {
  let disp = '0', acc = null, op = null, fresh = true, err = false;
  const scr = h('div', { class: 'p4cal-scr num' }), tape = h('div', { class: 'p4cal-tape' });
  const ap = (x, k, y) => k === '+' ? x + y : k === '−' ? x - y : k === '×' ? x * y : y === 0 ? NaN : x / y;
  const setRes = v => { if (!isFinite(v) || Math.abs(v) >= 1e13) { err = true; disp = '0'; return; } disp = String(Math.round(v * 1e4) / 1e4); };
  const show = () => { scr.textContent = err ? 'Error' : p4cf(disp); tape.textContent = acc != null && op ? `${p4cf(String(acc))} ${op}` : ''; o.onChange && o.onChange(+disp, err); };
  const press = k => { sfx.tap();
    if (/^\d$/.test(k)) { if (fresh || err) { disp = k; fresh = false; err = false; } else if (disp.replace(/[-.]/g, '').length < 12) disp = disp === '0' ? k : disp + k; }
    else if (k === 'C') { disp = '0'; acc = null; op = null; fresh = true; err = false; }
    else if (k === '⌫') { if (!fresh) disp = disp.length > 1 ? disp.slice(0, -1) : '0'; }
    else if (k === '=') { if (op != null && acc != null) { setRes(ap(acc, op, +disp)); acc = null; op = null; } fresh = true; }
    else { if (op != null && !fresh) { setRes(ap(acc, op, +disp)); acc = +disp; } else acc = +disp; op = k; fresh = true; }
    show(); };
  const keys = h('div', { class: 'p4cal-keys' });
  [['C', 'fn'], ['⌫', 'fn'], ['÷', 'op'], ['×', 'op'], ['7'], ['8'], ['9'], ['−', 'op'], ['4'], ['5'], ['6'], ['+', 'op'], ['1'], ['2'], ['3'], ['=', 'eq'], ['0', 'zero']].forEach(([k, c]) =>
    keys.append(h('button', { class: 'p4k ia' + (c ? ' ' + c : ''), 'aria-label': k, onclick: e => { e.stopPropagation(); press(k); } }, k)));
  const el = h('div', { class: 'p4cal' }, h('div', { class: 'p4cal-disp' }, tape, scr), keys, o.foot || null);
  el.value = () => err ? NaN : +disp; el.reset = () => press('C'); show();
  return el;
}
const P4_CT = ['2457300 + 1863950', '9000000 − 3486275', '(125000 + 87500) ÷ 5'];
function simCalcTasks(tasks) {
  let k = 0; const list = h('div', { class: 'p4tasks' }), note = fNote(); let doneT = false;
  const paint = () => { list.innerHTML = tasks.map((t, i) => `<div class="${i < k ? 'ok' : i === k ? 'on' : ''}"><b>${i < k ? '✓' : i + 1}</b> <span class="num">${p4ex2(t)}</span>${i < k ? ` = <b class="num">${fmt(p4ev(t))}</b>` : ''}</div>`).join(''); };
  const cal = p4calc({ onChange: v => { if (k < tasks.length && v === p4ev(tasks[k])) { k++; sfx.ok(); paint(); note.innerHTML = k < tasks.length ? 'ถูกต้อง! ทำภารกิจต่อไป' : 'ครบทุกภารกิจแล้ว!'; if (k >= tasks.length && !doneT) { doneT = true; teachDone(list); } } } });
  note.innerHTML = 'กดเครื่องคิดเลขให้ได้ผลลัพธ์ของภารกิจที่กำลังทำ — โจทย์มีวงเล็บให้คิดในวงเล็บก่อน แล้วกด =';
  paint(); return h('div', { class: 'p4calrow' }, h('div', { class: 'colstack' }, h6wait(), list, note), cal);
}

/* ---------- bar models ---------- */
function p4pwSVG(o) { // part–whole: whole w = p1 + p2
  const W = 520, x0 = 16, L = W - 32, f = Math.min(.74, Math.max(.26, o.p1 / (o.p1 + o.p2))), w1 = L * f, lab = (v, u) => u ? '?' : o.fv ? o.fv(v) : fmt(v);
  const box = (x, w, v, u, c, s) => `<rect x="${x}" y="58" width="${w}" height="46" rx="8" fill="${u ? '#FFF3B0' : c}" stroke="${u ? '#E3A21C' : s}" stroke-width="2" ${u ? 'stroke-dasharray="7 5"' : ''}/><text x="${x + w / 2}" y="88" text-anchor="middle" class="p4bt${u ? ' q' : ''}">${lab(v, u)}</text>`;
  return `<svg viewBox="0 0 ${W} 140" class="p4bar" aria-hidden="true">
    <path d="M${x0} 50 v-8 q0 -8 8 -8 H${W / 2 - 10} l10 -10 l10 10 H${W - x0 - 8} q8 0 8 8 v8" fill="none" stroke="#8B6A3E" stroke-width="2.4"/>
    <text x="${W / 2}" y="18" text-anchor="middle" class="p4bt${o.unk === 'w' ? ' q' : ''}">${o.lw ? o.lw + ' ' : ''}${lab(o.w, o.unk === 'w')}</text>
    ${box(x0, w1, o.p1, o.unk === '1', '#CFE6FF', '#5B9BD5')}${box(x0 + w1, L - w1, o.p2, o.unk === '2', '#FFD9AE', '#EC7F1E')}
    <text x="${x0 + w1 / 2}" y="128" text-anchor="middle" class="p4bl">${o.l1 || ''}</text><text x="${x0 + w1 + (L - w1) / 2}" y="128" text-anchor="middle" class="p4bl">${o.l2 || ''}</text></svg>`;
}
function p4cmpSVG(o) { // compare: big vs small, the difference hangs off the small bar
  const W = 520, x0 = 118, L = W - x0 - 14, ws = L * Math.min(.76, Math.max(.3, o.small / o.big)), lab = (v, u) => u ? '?' : o.fv ? o.fv(v) : fmt(v);
  const bar = (y, w, v, u, c, s) => `<rect x="${x0}" y="${y}" width="${w}" height="40" rx="8" fill="${u ? '#FFF3B0' : c}" stroke="${u ? '#E3A21C' : s}" stroke-width="2" ${u ? 'stroke-dasharray="7 5"' : ''}/><text x="${x0 + w / 2}" y="${y + 27}" text-anchor="middle" class="p4bt${u ? ' q' : ''}">${lab(v, u)}</text>`;
  const du = o.unk === 'diff';
  return `<svg viewBox="0 0 ${W} 172" class="p4bar" aria-hidden="true">
    <text x="${x0 - 10}" y="37" text-anchor="end" class="p4bl">${o.nb}</text><text x="${x0 - 10}" y="99" text-anchor="end" class="p4bl">${o.ns}</text>
    ${bar(10, L, o.big, o.unk === 'big', '#CFE6FF', '#5B9BD5')}${bar(72, ws, o.small, o.unk === 'small', '#FFD9AE', '#EC7F1E')}
    <rect x="${x0 + ws}" y="72" width="${L - ws}" height="40" rx="8" fill="${du ? '#FFF3B0' : '#fff'}" stroke="${du ? '#E3A21C' : '#B9A6F5'}" stroke-width="2" stroke-dasharray="7 5"/>
    <path d="M${x0 + ws + 2} 122 q0 10 10 10 H${x0 + (ws + L) / 2 - 8} l8 10 l8 -10 H${x0 + L - 12} q10 0 10 -10" fill="none" stroke="#8B6A3E" stroke-width="2.2"/>
    <text x="${x0 + (ws + L) / 2}" y="164" text-anchor="middle" class="p4bt${du ? ' q' : ''}">${o.ld ? o.ld + ' ' : ''}${lab(o.big - o.small, du)}</text></svg>`;
}

/* ---------- unknowns:  "430393 + □ = 643743" ---------- */
function p4uSolve(s) {
  const [x, op, y, , z] = s.split(' '), U = v => v === '□', X0 = +x, Y0 = +y, Z0 = +z; let ans, expr, rel;
  if (op === '+') { if (U(x)) { ans = Z0 - Y0; expr = `${z} − ${y}`; rel = 'ตัวตั้ง = ผลบวก − ตัวบวก'; } else { ans = Z0 - X0; expr = `${z} − ${x}`; rel = 'ตัวบวก = ผลบวก − ตัวตั้ง'; } }
  else { if (U(x)) { ans = Z0 + Y0; expr = `${z} + ${y}`; rel = 'ตัวตั้ง = ผลลบ + ตัวลบ'; } else { ans = X0 - Z0; expr = `${x} − ${z}`; rel = 'ตัวลบ = ตัวตั้ง − ผลลบ'; } }
  const X = U(x) ? ans : X0, Y = U(y) ? ans : Y0, Z = Z0;
  const bar = op === '+' ? { w: Z, p1: X, p2: Y, unk: U(x) ? '1' : '2', l1: 'ตัวตั้ง', l2: 'ตัวบวก', lw: 'ผลบวก' } : { w: X, p1: Y, p2: Z, unk: U(x) ? 'w' : '1', l1: 'ตัวลบ', l2: 'ผลลบ', lw: 'ตัวตั้ง' };
  return { op, ans, expr, rel, X, Y, Z, bar };
}
const p4uHTML = (s, fill) => s.split(' ').map(k => k === '□' ? (fill != null ? `<b class="num p4fill">${fmt(fill)}</b>` : P4BOX) : /^\d+$/.test(k) ? `<b class="num">${fmt(+k)}</b>` : `<b class="fop">${k}</b>`).join(' ');
function simBarUnknown(list) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const s = list[idx], S = p4uSolve(s); box.innerHTML = '';
    const sen = h('div', { class: 'fbig p4big one-line', html: p4uHTML(s) }), fig = h('div', { class: 'p4-fig', html: p4pwSVG(S.bar) }), log = h('div', { class: 'colstack fstory' }), out = fNote(); let k = 0;
    const rows = [['① ความสัมพันธ์', `จากแผนภาพ: <b>${S.rel}</b>`], ['② เขียนประโยคใหม่', `□ = ${p4ex2(S.expr)}`], ['③ คำนวณ', `□ = <b>${fmt(S.ans)}</b>`],
      ['④ ตรวจคำตอบ', `แทน □ ด้วย ${fmt(S.ans)}: ${fmt(S.X)} ${S.op} ${fmt(S.Y)} = ${fmt(S.op === '+' ? S.X + S.Y : S.X - S.Y)} ✓`]];
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [l, t] = rows[k++]; log.append(h('div', { class: 'fst-row one-line' }, h('b', null, l), h('span', { html: t }))); sfx.pop(k);
      if (k === 3) { sen.innerHTML = p4uHTML(s, S.ans); fig.innerHTML = p4pwSVG({ ...S.bar, unk: '' }); }
      if (k >= rows.length) { btn.remove(); out.innerHTML = `ตัวไม่ทราบค่า คือ <b>${fmt(S.ans)}</b>`; sfx.ok(); say('ตัวไม่ทราบค่า คือ ' + thaiWords(S.ans), true); } } }, icon('right'), 'ขั้นต่อไป');
    box.append(sen, fig, log, btn, out, p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'ข้อใหม่'));
  };
  draw(); return box;
}
/* ---------- "มากกว่า / น้อยกว่า" — which part is unknown decides + or − ---------- */
function simCmpBar(sc) {
  const box = h('div', { class: 'colstack' }), fig = h('div', { class: 'p4-fig' }), q = h('div', { class: 'storybox' }), out = fNote(), seg = h('div', { class: 'seg p4seg' });
  const set = u => { fig.innerHTML = p4cmpSVG({ ...sc, unk: u }); q.innerHTML = sc.q[u];
    const d = sc.big - sc.small, e = u === 'big' ? `${fmt(sc.small)} + ${fmt(d)} = ${fmt(sc.big)}` : u === 'small' ? `${fmt(sc.big)} − ${fmt(d)} = ${fmt(sc.small)}` : `${fmt(sc.big)} − ${fmt(sc.small)} = ${fmt(d)}`;
    out.innerHTML = (u === 'big' ? 'ไม่รู้<b>จำนวนที่มาก</b> → ส่วนน้อย + ผลต่าง = ใช้<b>การบวก</b>' : u === 'small' ? 'ไม่รู้<b>จำนวนที่น้อย</b> → ส่วนมาก − ผลต่าง = ใช้<b>การลบ</b>' : 'ไม่รู้<b>ผลต่าง</b> → ส่วนมาก − ส่วนน้อย = ใช้<b>การลบ</b>') + `<br><span class="num">${e}</span>`;
    seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.u === u)); sfx.tap(); };
  seg.append(...[['big', 'ไม่รู้จำนวนที่มาก'], ['small', 'ไม่รู้จำนวนที่น้อย'], ['diff', 'ไม่รู้ผลต่าง']].map(([u, t]) => h('button', { 'data-u': u, class: 'ia', onclick: e => { e.stopPropagation(); set(u); } }, t)));
  set('diff'); box.append(seg, q, fig, out); return box;
}
const p4story = (text, fig, steps, fin) => el => { const s = simStepPick(text, steps, fin); s.children[1].after(h('div', { class: 'p4-fig', html: fig })); el.append(s); };

/* ---------- writing a solution: tap the lines in order ---------- */
/* v118 เส้นทางคาราวาน — ตัวกลางอยู่ที่ cvnBoard (components.js) */
const p4seqBoard = (cards, o = {}) => cvnBoard({ cards, fits: (k, n) => k === n, onDone: o.onDone });
const P4_SOLVE = o => { const a = p4ev(o.expr); return [`ประโยคสัญลักษณ์ <b class="num">${p4ex2(o.expr)} = □</b>`, `วิธีทำ ${o.giv}`, `${o.lab} <span class="num">${p4ex2(o.expr)} = ${fmt(a)}</span> ${o.unit}`, `ตอบ <span class="thn">${thai(fmt(a))}</span> ${o.unit}`]; };
function simSeqSolve(o) {
  const note = fNote(), w = h('div', { class: 'colstack' }); note.innerHTML = 'แตะบรรทัดของการแสดงวิธีทำ<b>ตามลำดับ</b> — ' + cvnHint();
  const b = p4seqBoard(P4_SOLVE(o), { onDone: ok => { if (ok) { note.innerHTML = 'เรียงถูกต้อง! ประโยคสัญลักษณ์ → วิธีทำ → คำนวณ → ตอบ (พร้อมหน่วย)'; sfx.ok(); teachDone(w); } else { sfx.no(); note.innerHTML = 'ยังไม่ถูก — เริ่มจากประโยคสัญลักษณ์ และจบด้วยคำตอบ'; } } });
  w.append(h6wait(), h('div', { class: 'storybox', html: o.text }), b, note); return w;
}
/* ---------- make up a story from a number sentence ---------- */
const P4_CTX = [{ n: 'เงินออม', who: 'พ่อ', thing: 'เงินออม', unit: 'บาท', lose: 'ใช้ซื้อรถจักรยานยนต์ไป', gain: 'ได้รับโบนัสอีก' }, { n: 'สวนผลไม้', who: 'สวนผลไม้', thing: 'มะม่วง', unit: 'ผล', lose: 'ส่งขายไป', gain: 'เก็บเพิ่มได้อีก' }, { n: 'โรงงาน', who: 'โรงงาน', thing: 'กล่องนม', unit: 'กล่อง', lose: 'ส่งให้ร้านค้าไป', gain: 'ผลิตเพิ่มอีก' }];
function simMakeStory(a, b) {
  let C = 0, op = '−'; const sen = h('div', { class: 'fbig p4big' }), st = h('div', { class: 'storybox' }), out = fNote(), cs = h('div', { class: 'seg p4seg' }), os = h('div', { class: 'seg p4seg' });
  const paint = () => { const c = P4_CTX[C], r = op === '+' ? a + b : a - b;
    sen.innerHTML = `<b class="num">${fmt(a)}</b> <b class="fop">${op}</b> <b class="num">${fmt(b)}</b> <b class="fop">=</b> ${P4BOX}`;
    st.innerHTML = op === '−' ? `${c.who}มี${c.thing} <b>${fmt(a)}</b> ${c.unit} ${c.lose} <b>${fmt(b)}</b> ${c.unit} <u>เหลือ${c.thing}กี่${c.unit}</u>` : `${c.who}มี${c.thing} <b>${fmt(a)}</b> ${c.unit} ${c.gain} <b>${fmt(b)}</b> ${c.unit} <u>มี${c.thing}ทั้งหมดกี่${c.unit}</u>`;
    out.innerHTML = `เครื่องหมาย ${op === '−' ? '− → เรื่อง “เอาออก / เหลือ”' : '+ → เรื่อง “เพิ่ม / รวมกัน”'} · คำตอบ ${fmt(r)} ${c.unit}`;
    cs.querySelectorAll('button').forEach((x, i) => x.classList.toggle('on', i === C)); os.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.textContent.includes(op))); };
  cs.append(...P4_CTX.map((c, i) => h('button', { class: 'ia', onclick: e => { e.stopPropagation(); C = i; sfx.tap(); paint(); } }, c.n)));
  os.append(...['+', '−'].map(k => h('button', { class: 'ia', onclick: e => { e.stopPropagation(); op = k; sfx.tap(); paint(); } }, `เครื่องหมาย ${k}`)));
  paint(); return h('div', { class: 'colstack' }, os, sen, cs, st, out);
}
/* ---------- pictures with price tags ---------- */
const P4ART = {
  truck: `<ellipse cx="32" cy="55" rx="26" ry="2.6" fill="#2B2550" opacity=".12"/><rect x="5" y="26" width="31" height="19" rx="3" fill="url(#g-coral)" stroke="#C23C4B" stroke-width="1.4"/><path d="M36 30 h12 l9 9 v6 h-21 z" fill="url(#g-sky)" stroke="#2F6FB0" stroke-width="1.4" stroke-linejoin="round"/><rect x="40" y="32" width="7" height="6" rx="1" fill="#E8F6FF"/><circle cx="16" cy="47" r="6" fill="#3A3458"/><circle cx="16" cy="47" r="2.4" fill="#D8D2E8"/><circle cx="46" cy="47" r="6" fill="#3A3458"/><circle cx="46" cy="47" r="2.4" fill="#D8D2E8"/>`,
  plane: `<path d="M6 34 Q6 27 16 27 H48 Q58 27 60 33 Q58 38 48 38 H16 Q6 38 6 34 Z" fill="url(#g-white)" stroke="#8C84A8" stroke-width="1.4"/><path d="M28 28 L20 10 h7 l14 18 Z M28 37 L22 52 h6 l12 -15 Z M9 29 L5 18 h5 l7 10 Z" fill="url(#g-sky)" stroke="#2F6FB0" stroke-width="1.2" stroke-linejoin="round"/><g fill="#7FC8F0">${[22, 29, 36, 43].map(x => `<circle cx="${x}" cy="32" r="2"/>`).join('')}</g><path d="M52 30 q5 1 6 3" stroke="#2F6FB0" stroke-width="2" fill="none"/>`
};
const p4ico = k => P4ART[k] ? `<svg viewBox="0 0 64 64" aria-hidden="true">${P4ART[k]}</svg>` : ART[k] ? artHTML(k) : sceneryHTML(k);
const p4picHTML = items => `<div class="p4pic">${items.map(([k, nm, p]) => `<div class="it">${p4ico(k)}<span>${nm}</span><b class="num">${fmt(p)} บาท</b></div>`).join('')}</div>`;
function simPicStory(items, budget) {
  const [[, na, a], [, nb, b]] = items, big = Math.max(a, b), sm = Math.min(a, b), nbg = a >= b ? na : nb, nsm = a >= b ? nb : na;
  const K = { sum: [`ซื้อ${na}และ${nb} ต้องจ่ายเงินทั้งหมดกี่บาท`, `${a} + ${b}`], diff: [`${nbg}ราคาแพงกว่า${nsm}กี่บาท`, `${big} − ${sm}`], left: [`มีเงิน ${fmt(budget)} บาท ซื้อ${na} 1 ${items[0][3] || 'หลัง'} เหลือเงินกี่บาท`, `${budget} − ${a}`] };
  const seg = h('div', { class: 'seg p4seg' }), st = h('div', { class: 'storybox' }), out = fNote();
  const set = k => { const [t, e] = K[k]; st.innerHTML = t; out.innerHTML = `ประโยคสัญลักษณ์ <b class="num">${p4ex2(e)} = □</b> · คำตอบ <b>${fmt(p4ev(e))}</b> บาท`; seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === k)); sfx.tap(); };
  seg.append(...[['sum', 'รวมกัน'], ['diff', 'ต่างกัน'], ['left', 'เงินเหลือ']].map(([k, t]) => h('button', { 'data-k': k, class: 'ia', onclick: e => { e.stopPropagation(); set(k); } }, t)));
  const el = h('div', { class: 'colstack' }, h('div', { class: 'p4-fig', html: p4picHTML(items) }), seg, st, out); set('sum'); return el;
}

/* ---------- question helpers ---------- */
const p4colQ = (a, b, op) => Q.colW({ nums: [a, b], op, prompt: `${op === '+' ? 'หาผลบวก' : 'หาผลลบ'} <b class="num">${fmt(a)} ${op} ${fmt(b)}</b> โดยการตั้ง${op === '+' ? 'บวก' : 'ลบ'}`, say: `หาผล${op === '+' ? 'บวก' : 'ลบ'}ของ ${thaiWords(a)} ${op === '+' ? 'บวก' : 'ลบ'} ${thaiWords(b)}`, sig: `p4cq ${a}${op}${b}` }); // v111: shared column board
const p4estQ = ([a, op, b, pow]) => Q.p4Num({ fig: p4big(`<b class="num">${fmt(a)} ${op} ${fmt(b)}</b> <b class="fop">≈</b> <span class="fsign">?</span>`), q: `ประมาณแต่ละจำนวนเป็นจำนวนเต็ม${P4_RN[pow]}ก่อน แล้วหาผลลัพธ์โดยประมาณ`, a: op === '+' ? p4r(a, pow) + p4r(b, pow) : p4r(a, pow) - p4r(b, pow), hint: `${fmt(a)} ≈ ${fmt(p4r(a, pow))} · ${fmt(b)} ≈ ${fmt(p4r(b, pow))}` });
function p4estPick(a, op, b) {
  const r = op === '+' ? a + b : a - b, L = 10 ** (String(r).length - 1), cand = [r + L, r - L, r * 10, Math.floor(r / 10), r + 2 * L].filter(x => x > 0 && x !== r);
  return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(a)} ${op} ${fmt(b)}</b>`), q: 'ใช้ค่าประมาณตรวจ: ข้อใดเป็นผลลัพธ์ที่<span class="hl">สมเหตุสมผล</span>', say: 'ใช้ค่าประมาณตรวจ ข้อใดเป็นผลลัพธ์ที่สมเหตุสมผล', opts: [r, ...shuffle(cand).slice(0, 3)].map(fmt), right: fmt(r), hint: 'ประมาณแต่ละจำนวนเป็นหลักสูงสุดก่อน แล้วเลือกคำตอบที่ใกล้ค่าประมาณที่สุด' });
}
Object.assign(Q, {
  p4Calc({ expr }) {
    const ans = p4ev(expr);
    return { prompt: 'ใช้เครื่องคิดเลขหาผลลัพธ์ แล้วกด<b>ส่งคำตอบ</b>', say: 'ใช้เครื่องคิดเลขหาผลลัพธ์ แล้วกดส่งคำตอบ', mount(bd, ctx) {
      const hint = /\(/.test(expr) ? 'คิดในวงเล็บก่อน กด = แล้วจึงกดเครื่องหมายและตัวเลขที่เหลือ' : 'กดตัวเลข → เครื่องหมาย → ตัวเลข แล้วกด =';
      let cal; const sub = h('button', { class: 'btn primary ia p4cal-go', onclick: e => { e.stopPropagation(); if (sub.dataset.done) return; const ok = cal.value() === ans; if (ok) sub.dataset.done = 1; ctx.check(ok, hint); } }, icon('check'), 'ส่งคำตอบ');
      cal = p4calc({ foot: sub });
      bd.append(h('div', { class: 't6-q p4-q' }, h('div', { class: 'fbig p4big', html: exprHTML(expr) + ' <b class="fop">=</b> <span class="fsign">?</span>' }), cal)); } };
  },
  p4Seq({ text, cards }) {
    return { prompt: 'แตะบรรทัดของการแสดงวิธีทำ<span class="hl">ตามลำดับ</span>', say: `${text.replace(/<[^>]+>/g, '')} แตะบรรทัดของการแสดงวิธีทำตามลำดับ`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q' }, h('div', { class: 'storybox', html: text }), p4seqBoard(cards, { onDone: ok => ctx.check(ok, 'เริ่มจากประโยคสัญลักษณ์ → วิธีทำ (สิ่งที่โจทย์บอก) → การคำนวณ → ตอบพร้อมหน่วย') }))); } };
  }
});
const p4unkQ = s => { const S = p4uSolve(s); return Q.p4Num({ fig: `<div class="fbig p4big one-line">${p4uHTML(s)}</div>`, q: 'หาค่าของตัวไม่ทราบค่าใน □', say: 'หาค่าของตัวไม่ทราบค่า', a: S.ans, hint: `${S.rel} → □ = ${p4ex2(S.expr)}` }); };
const p4ansQ = o => { const a = p4ev(o.expr), sw = o.expr.includes('+') ? o.expr.replace('+', '−') : o.expr.replace('−', '+'), b = Math.abs(p4ev(sw.replace(/(\d+) − (\d+)/, (m, x, y) => +x >= +y ? m : `${y} − ${x}`)));
  const right = `ตอบ ${fmt(a)} ${o.unit}`, opts = [right, `ตอบ ${fmt(a)}`, `ตอบ ${fmt(b)} ${o.unit}`, `ตอบ ${fmt(a)} ${o.wrongUnit}`];
  return Q.p4Pick({ fig: `<div class="storybox">${o.text}</div>`, q: 'ข้อใดเขียน<span class="hl">คำตอบ</span>ของโจทย์นี้ได้ถูกต้อง', say: `${o.text} ข้อใดเขียนคำตอบได้ถูกต้อง`, opts, right, hint: 'คำนวณให้ถูก และเขียนหน่วยให้ตรงกับสิ่งที่โจทย์ถาม' }); };

/* ---------- practice data ---------- */
const P4W2_ADD0 = [[34900, 265000], [212476, 434423], [5701357, 117210], [7133474, 2034123], [10231634, 12155212], [245804535, 500093100], [1347890, 3012101], [1004004, 6304915], [31248490, 221301], [61046438, 28721101], [70000000, 512760384], [483472135, 210013134]];
const P4W2_ADD1 = [[437119, 127656], [623574, 234764], [8278985, 346784], [4710048, 3129574], [19083194, 12765231], [387391849, 523272074], [575798, 12798133], [8409853, 1377442], [1947979, 6327643], [81439810, 2165323], [76348647, 100348647], [213217863, 513935005], [4264123, 6348974], [2367431, 2105786], [36398781, 1230657], [82766364, 13799542], [872446763, 26175644], [532673011, 472755312]];
const P4W2_SUB0 = [[849850, 424340], [939870, 327650], [8678985, 346784], [8508084, 3305074], [34994985, 2452741], [504787837, 301537626], [4428744, 2215713], [7466786, 2343000], [48643698, 2132445], [54029845, 22016743], [93948918, 93236704], [849021329, 419011211]];
const P4W2_SUB1 = [[569579, 327644], [475954, 237641], [3017656, 1387237], [4568602, 2343835], [41776840, 40654453], [563076079, 423564326], [459795, 343476], [1494750, 465724], [30915409, 1749843], [23549093, 21236353], [679480911, 43878459], [435098095, 265764341], [8480943, 3763318], [15786477, 13347341], [78476810, 21657324], [50346848, 46117690], [758892392, 126375135], [630746876, 233534149]];
const P4W2_SUB2 = [[980000, 376002], [6300000, 748600], [51000000, 10275760], [60000000, 12300020], [900000000, 723780009], [509000003, 370009000]];
const P4W2_EST = [[928700, '−', 23800, 4], [11429395, '+', 3489032, 6], [55205664, '+', 20116824, 6], [123874363, '−', 12376513, 6]];
const P4W2_CALC = ['39443450 − 14784674', '82540990 + 263753987', '35587401 × 12', '(27654 ÷ 22) + 8843815', '4 × (991099 − 276434)', '2095713 ÷ 81', '(509090 + 998332) ÷ 2', '77610921 − 15320129', '54 × 94265365', '(4989045 ÷ 5) × 14',
  '982784 + 378607842', '34710951 − 23673263', '2007883 × 3', '64450 ÷ 25', '(1938722 × 7) + 237009732', '(23986 ÷ 2) − (2309 + 2376)', '1608904 + 950953809', '10 × (409992823 − 406643434)', '532098 − 38764', '(11809902 ÷ 46) − 3632'];
const P4W2_UNK = ['430393 + □ = 643743', '□ − 438790 = 1456230', '12030393 − □ = 7643743',
  '900000 − □ = 40000', '173530 + □ = 393530', '□ − 382431 = 143245', '□ + 2376586 = 5367203', '997954 − □ = 389843', '□ − 3782431 = 143245', '700183 + □ = 868420', '□ + 2917234 = 5378638', '□ − 6152367 = 1269870', '1155782 − □ = 450567',
  '595000 − □ = 255000', '□ + 560098 = 943245', '4604445 − □ = 3930413', '□ − 15208658 = 5665698', '1384984 + □ = 9278634', '□ − 2360587 = 8763299', '5858632 + □ = 26872234', '□ + 16637085 = 84753472', '100000000 − □ = 32678349', '□ + 237660381 = 327968321'];
const P4W2_UNK_SUB = P4W2_UNK.filter(s => s.includes('−')), P4W2_UNK_ADD = P4W2_UNK.filter(s => s.includes('+'));
const P4S_SIMPLE = [
  D6S('ฟาร์มกุ้งมีกุ้ง 1,039,384 ตัว ปล่อยลูกกุ้งเพิ่ม 848,990 ตัว ฟาร์มนี้มีกุ้งทั้งหมดกี่ตัว', '1039384 + 848990', ['848990 − 1039384'], 'ตัว'),
  D6S('จังหวัดแรกปลูกยางพารา 3,675,030 ต้น จังหวัดที่สองปลูก 6,045,537 ต้น สองจังหวัดปลูกยางพารารวมกี่ต้น', '3675030 + 6045537', ['6045537 − 3675030'], 'ต้น'),
  D6S('ฟาร์มไก่มีไข่ 1,250,600 ฟอง ส่งขายไป 875,450 ฟอง ฟาร์มเหลือไข่กี่ฟอง', '1250600 − 875450', ['1250600 + 875450'], 'ฟอง'),
  D6S('สนามกีฬามีผู้ชมรอบเช้า 245,380 คน รอบบ่าย 318,960 คน สองรอบมีผู้ชมรวมกี่คน', '245380 + 318960', ['318960 − 245380'], 'คน'),
  D6S('โรงงานผลิตขวดน้ำ 3,600,000 ขวด ขายไปแล้ว 2,184,575 ขวด ยังเหลือขวดน้ำกี่ขวด', '3600000 − 2184575', ['3600000 + 2184575'], 'ขวด'),
  D6S('เมืองหนึ่งมีต้นไม้ 506,890 ต้น ปลูกเพิ่มอีก 98,750 ต้น เมืองนี้มีต้นไม้ทั้งหมดกี่ต้น', '506890 + 98750', ['506890 − 98750'], 'ต้น')];
const P4S_MORE = [
  D6S('บริษัท ก มีรายได้ 15,474,789 บาท บริษัท ข มีรายได้ 10,401,240 บาท บริษัท ก มีรายได้มากกว่ากี่บาท', '15474789 − 10401240', ['15474789 + 10401240'], 'บาท'),
  D6S('บ่อปลา ก มีปลา 456,300 ตัว บ่อปลา ข มีปลามากกว่าบ่อ ก 128,900 ตัว บ่อปลา ข มีปลากี่ตัว', '456300 + 128900', ['456300 − 128900'], 'ตัว'),
  D6S('ปีนี้ร้านขายน้ำดื่มได้ 2,340,500 ขวด ซึ่งมากกว่าปีที่แล้ว 465,800 ขวด ปีที่แล้วร้านขายน้ำดื่มได้กี่ขวด', '2340500 − 465800', ['2340500 + 465800'], 'ขวด'),
  D6S('หมู่บ้าน ก มีประชากร 785,000 คน หมู่บ้าน ข มีประชากร 612,450 คน หมู่บ้าน ก มีประชากรมากกว่าหมู่บ้าน ข กี่คน', '785000 − 612450', ['785000 + 612450'], 'คน'),
  D6S('คาราวาน ก ขนอินทผลัม 1,256,000 ผล คาราวาน ข ขนได้มากกว่าคาราวาน ก 349,500 ผล คาราวาน ข ขนอินทผลัมกี่ผล', '1256000 + 349500', ['1256000 − 349500'], 'ผล'),
  D6S('สวนทุเรียนขายได้ 8,450,000 บาท ซึ่งมากกว่าสวนมังคุด 2,975,600 บาท สวนมังคุดขายได้กี่บาท', '8450000 − 2975600', ['8450000 + 2975600'], 'บาท')];
const P4S_LESS = [
  D6S('จังหวัด ก มีประชากร 3,997,768 คน จังหวัด ข มีประชากร 1,285,149 คน จังหวัด ข มีประชากรน้อยกว่าจังหวัด ก กี่คน', '3997768 − 1285149', ['3997768 + 1285149'], 'คน'),
  D6S('ห้องสมุด ก มีหนังสือ 345,600 เล่ม ห้องสมุด ข มีหนังสือน้อยกว่าห้องสมุด ก 78,450 เล่ม ห้องสมุด ข มีหนังสือกี่เล่ม', '345600 − 78450', ['345600 + 78450'], 'เล่ม'),
  D6S('เดือนมกราคมบริษัทมีรายได้ 4,280,000 บาท ซึ่งน้อยกว่าเดือนกุมภาพันธ์ 615,300 บาท เดือนกุมภาพันธ์บริษัทมีรายได้กี่บาท', '4280000 + 615300', ['4280000 − 615300'], 'บาท'),
  D6S('ฟาร์ม ก เก็บข้าวโพดได้ 925,400 ฝัก ฟาร์ม ข เก็บได้ 1,140,250 ฝัก ฟาร์ม ก เก็บได้น้อยกว่าฟาร์ม ข กี่ฝัก', '1140250 − 925400', ['1140250 + 925400'], 'ฝัก'),
  D6S('โรงเรียนเก็บขวดพลาสติกได้ 186,750 ขวด ซึ่งน้อยกว่าเป้าหมาย 63,250 ขวด เป้าหมายคือกี่ขวด', '186750 + 63250', ['186750 − 63250'], 'ขวด'),
  D6S('เมือง ก มีรถยนต์ 2,500,000 คัน เมือง ข มีรถยนต์น้อยกว่าเมือง ก 845,600 คัน เมือง ข มีรถยนต์กี่คัน', '2500000 − 845600', ['2500000 + 845600'], 'คัน')];
const P4S_TWO = [
  D6S('แม่มีเงิน 1,500,000 บาท ซื้อรถยนต์ 789,000 บาท และซื้อเฟอร์นิเจอร์ 245,500 บาท แม่เหลือเงินกี่บาท', '1500000 − 789000 − 245500', ['1500000 − 789000 + 245500', '1500000 + 789000 − 245500'], 'บาท'),
  D6S('ฟาร์มมีไก่ 356,800 ตัว ขายไป 128,450 ตัว แล้วซื้อมาเพิ่ม 95,300 ตัว ตอนนี้ฟาร์มมีไก่กี่ตัว', '356800 − 128450 + 95300', ['356800 + 128450 − 95300', '356800 − 128450 − 95300'], 'ตัว'),
  D6S('ร้านค้าขายได้วันจันทร์ 425,600 บาท วันอังคาร 386,250 บาท จ่ายค่าสินค้า 512,000 บาท ร้านค้าเหลือเงินกี่บาท', '425600 + 386250 − 512000', ['425600 − 386250 + 512000', '425600 + 386250 + 512000'], 'บาท'),
  D6S('เมืองหนึ่งมีประชากร 2,350,000 คน ย้ายออก 148,700 คน และย้ายเข้า 236,900 คน ตอนนี้เมืองนี้มีประชากรกี่คน', '2350000 − 148700 + 236900', ['2350000 + 148700 − 236900', '2350000 − 148700 − 236900'], 'คน'),
  D6S('สวนมีมะม่วง 980,000 ผล ส่งตลาด ก 345,600 ผล ส่งตลาด ข 412,800 ผล สวนเหลือมะม่วงกี่ผล', '980000 − 345600 − 412800', ['980000 − 345600 + 412800', '980000 + 345600 − 412800'], 'ผล'),
  D6S('โรงงานผลิตเสื้อเดือนแรก 1,245,000 ตัว เดือนที่สองผลิตมากกว่าเดือนแรก 186,500 ตัว สองเดือนผลิตเสื้อรวมกี่ตัว', '1245000 + 1245000 + 186500', ['1245000 + 186500', '1245000 + 1245000 − 186500'], 'ตัว')];
const P4_SOL = [
  { text: 'ร้านอาหารขายข้าวกล่องเดือนแรกได้ 186,450 กล่อง เดือนที่สองขายได้ 203,780 กล่อง สองเดือนขายได้รวมกี่กล่อง', expr: '186450 + 203780', giv: 'เดือนแรกขายได้ 186,450 กล่อง · เดือนที่สองขายได้ 203,780 กล่อง', lab: 'สองเดือนขายได้รวม', unit: 'กล่อง', wrongUnit: 'บาท' },
  { text: 'เขื่อนมีน้ำ 8,750,000 ลูกบาศก์เมตร ปล่อยน้ำออกไป 2,368,400 ลูกบาศก์เมตร เขื่อนเหลือน้ำกี่ลูกบาศก์เมตร', expr: '8750000 − 2368400', giv: 'เขื่อนมีน้ำ 8,750,000 ลบ.ม. · ปล่อยออกไป 2,368,400 ลบ.ม.', lab: 'เขื่อนเหลือน้ำ', unit: 'ลูกบาศก์เมตร', wrongUnit: 'ลิตร' },
  { text: 'ปีนี้สวนสัตว์มีผู้เข้าชม 1,084,250 คน น้อยกว่าปีที่แล้ว 97,800 คน ปีที่แล้วมีผู้เข้าชมกี่คน', expr: '1084250 + 97800', giv: 'ปีนี้มีผู้เข้าชม 1,084,250 คน · น้อยกว่าปีที่แล้ว 97,800 คน', lab: 'ปีที่แล้วมีผู้เข้าชม', unit: 'คน', wrongUnit: 'ตัว' },
  { text: 'บริษัทตั้งเป้าขายสินค้า 5,000,000 บาท ขายได้แล้ว 3,276,500 บาท ต้องขายอีกกี่บาท', expr: '5000000 − 3276500', giv: 'ตั้งเป้าขาย 5,000,000 บาท · ขายได้แล้ว 3,276,500 บาท', lab: 'ต้องขายอีก', unit: 'บาท', wrongUnit: 'ชิ้น' },
  { text: 'ไร่อ้อยปลูกอ้อยได้ 2,465,300 ต้น ไร่ข้าวโพดปลูกได้มากกว่าไร่อ้อย 534,700 ต้น ไร่ข้าวโพดปลูกได้กี่ต้น', expr: '2465300 + 534700', giv: 'ไร่อ้อยปลูกได้ 2,465,300 ต้น · ไร่ข้าวโพดปลูกได้มากกว่า 534,700 ต้น', lab: 'ไร่ข้าวโพดปลูกได้', unit: 'ต้น', wrongUnit: 'ไร่' }];
const P4_S2S = [
  { s: '2345000 + 1287500', ok: 'ร้านค้าขายของได้เดือนแรก 2,345,000 บาท เดือนที่สอง 1,287,500 บาท สองเดือนขายได้รวมกี่บาท', bad: ['ร้านค้าขายของได้ 2,345,000 บาท จ่ายค่าเช่าไป 1,287,500 บาท เหลือเงินกี่บาท', 'ร้านค้าตั้งเป้าขาย 2,345,000 บาท ขายได้แล้ว 1,287,500 บาท ต้องขายอีกกี่บาท'] },
  { s: '905400 − 367250', ok: 'โรงงานผลิตแก้ว 905,400 ใบ ส่งขายไป 367,250 ใบ โรงงานเหลือแก้วกี่ใบ', bad: ['โรงงานผลิตแก้วรอบแรก 905,400 ใบ รอบที่สอง 367,250 ใบ ผลิตรวมกี่ใบ', 'โรงงานมีแก้ว 367,250 ใบ ผลิตเพิ่มอีก 905,400 ใบ มีแก้วทั้งหมดกี่ใบ'] },
  { s: '4780000 − 3925600', ok: 'เมือง ก มีประชากร 4,780,000 คน เมือง ข มีประชากร 3,925,600 คน เมือง ก มีประชากรมากกว่าเมือง ข กี่คน', bad: ['เมือง ก มีประชากร 4,780,000 คน เมือง ข มีประชากรมากกว่าเมือง ก 3,925,600 คน เมือง ข มีประชากรกี่คน', 'เมือง ก มีประชากร 4,780,000 คน เมือง ข มี 3,925,600 คน สองเมืองมีประชากรรวมกี่คน'] },
  { s: '658900 + 241100', ok: 'สหกรณ์มีข้าวสาร 658,900 กิโลกรัม ซึ่งน้อยกว่าโกดัง 241,100 กิโลกรัม โกดังมีข้าวสารกี่กิโลกรัม', bad: ['สหกรณ์มีข้าวสาร 658,900 กิโลกรัม ขายไป 241,100 กิโลกรัม เหลือข้าวสารกี่กิโลกรัม', 'โกดังมีข้าวสาร 658,900 กิโลกรัม สหกรณ์มีน้อยกว่าโกดัง 241,100 กิโลกรัม สหกรณ์มีข้าวสารกี่กิโลกรัม'] },
  { s: '12500000 − 8645300', ok: 'บริษัทกู้เงินมา 12,500,000 บาท ใช้หนี้ไปแล้ว 8,645,300 บาท ยังเหลือหนี้อีกกี่บาท', bad: ['บริษัทกู้เงินมาสองครั้ง ครั้งแรก 12,500,000 บาท ครั้งที่สอง 8,645,300 บาท รวมกู้เงินกี่บาท', 'บริษัทมีเงิน 8,645,300 บาท ได้รับเพิ่มอีก 12,500,000 บาท มีเงินทั้งหมดกี่บาท'] }];
const p4s2sQ = o => Q.p4Pick({ fig: p4big(`<b class="num">${p4ex2(o.s)} = </b>${P4BOX}`), q: 'ประโยคสัญลักษณ์นี้ตรงกับโจทย์ปัญหาข้อใด', say: 'ประโยคสัญลักษณ์นี้ ตรงกับโจทย์ปัญหาข้อใด', opts: [o.ok, ...o.bad], right: o.ok, hint: 'ดูเครื่องหมาย + คือรวม/เพิ่ม/หาจำนวนที่มาก · − คือเหลือ/ต่างกัน/หาจำนวนที่น้อย' });
const p4st2sQ = o => { const sw = o.s.includes('+') ? o.s.replace('+', '−').replace(/(\d+) − (\d+)/, (m, x, y) => +x >= +y ? m : `${y} − ${x}`) : o.s.replace('−', '+'), op = o.s.split(' ');
  const opts = [o.s, sw, ...(op[1] === '−' ? [`${op[2]} ${op[1]} ${op[0]}`] : [])].filter((x, i, a) => a.indexOf(x) === i).map(e => p4ex2(e) + ' = □');
  return Q.p4Pick({ fig: `<div class="storybox">${o.ok}</div>`, q: 'ข้อใดเป็นประโยคสัญลักษณ์ของโจทย์นี้', say: `${o.ok} ข้อใดเป็นประโยคสัญลักษณ์ของโจทย์นี้`, opts, right: p4ex2(o.s) + ' = □', hint: 'โจทย์ถามอะไร? หาส่วนรวม → บวก · หาส่วนที่เหลือหรือผลต่าง → ลบ (เอาจำนวนมากตั้ง)' }); };
const P4_PICS = [[['truck', 'รถกระบะ', 1890000], ['plane', 'เครื่องบิน', 39990000]], [['camel', 'อูฐ', 185000], ['car', 'รถยนต์', 1265000]], [['tent', 'กระโจม', 245000], ['oasis', 'ที่ดินโอเอซิส', 8750000]]];
function p4picQ(items, kind) {
  const [[, na, a], [, nb, b]] = items, big = Math.max(a, b), sm = Math.min(a, b), nbg = a >= b ? na : nb, nsm = a >= b ? nb : na, fig = p4picHTML(items);
  if (kind === 'sum') return Q.p4Num({ fig, q: `ซื้อ${na}และ${nb} ต้องจ่ายเงินทั้งหมดกี่บาท`, a: a + b, unit: 'บาท', hint: 'รวมราคาสองอย่าง → บวก' });
  if (kind === 'diff') return Q.p4Num({ fig, q: `${nbg}ราคาแพงกว่า${nsm}กี่บาท`, a: big - sm, unit: 'บาท', hint: 'หาผลต่าง → เอาราคาที่มากลบด้วยราคาที่น้อย' });
  const ok = `${nbg}ราคา ${fmt(big)} บาท ${nsm}ราคา ${fmt(sm)} บาท ${nbg}แพงกว่า${nsm}กี่บาท`;
  return Q.p4Pick({ fig, q: 'ข้อใดเป็น<span class="hl">โจทย์ปัญหาการลบ</span>ที่สร้างจากภาพนี้ได้ถูกต้อง', say: 'ข้อใดเป็นโจทย์ปัญหาการลบที่สร้างจากภาพนี้ได้ถูกต้อง', opts: [ok, `ซื้อ${na}และ${nb} ต้องจ่ายเงินทั้งหมดกี่บาท`, `${nbg}ราคา ${fmt(big + (big < 1000 ? 100 : 100000))} บาท ${nsm}ราคา ${fmt(sm)} บาท ${nbg}แพงกว่า${nsm}กี่บาท`], right: ok, hint: 'ใช้ราคาให้ตรงกับภาพ และถามหาผลต่าง/ส่วนที่เหลือ' });
}

/* ---------- lessons ---------- */
const L4B = (no, place, title, short, goal, teach, game) => ({ id: 420 + no, place, title, short, tone: TONES5[(no + 3) % 6], goal, teach, game });
const LESSONS_P4C2 = [
  L4B(1, 'บ่อน้ำบวกทด', 'การบวกจำนวนนับ โดยการตั้งบวก', 'ตั้งบวก', 'หาผลบวกของจำนวนนับที่มากกว่า 100,000 โดยการตั้งบวก ทั้งไม่มีทดและมีทด',
    [T('ยินดีต้อนรับสู่ <b>ทะเลทรายบวกลบ</b>! กด<b>ทำหลักต่อไป</b> — บวกทีละหลักจากหลักหน่วย ครบ 10 ต้องทด', 'ยินดีต้อนรับสู่ทะเลทรายบวกลบ กดทำหลักต่อไป บวกทีละหลักจากหลักหน่วย ครบสิบต้องทด', el => el.append(simColumn([[2457368, 1586745], [64905873, 28376459], [508760, 491240]], '+'))),
     T('ตัวอย่างทีละขั้น: 3,689,457 + 2,546,785', 'ตัวอย่างทีละขั้น', p4ex(p4colRows(3689457, 2546785, '+'), `3,689,457 + 2,546,785 = <b>${fmt(3689457 + 2546785)}</b>`, '', () => h('div', { class: 'p4colwrap', html: p4colHTML(3689457, 2546785, '+', {}, { still: true }) })))],
    () => [...pkF(P4W2_ADD0, 2), ...pkF(P4W2_ADD1, 4)].map(([a, b]) => p4colQ(a, b, '+'))),
  L4B(2, 'เนินทรายกระจาย', 'การลบจำนวนนับ โดยการตั้งลบ', 'ตั้งลบ', 'หาผลลบของจำนวนนับที่มากกว่า 100,000 โดยการตั้งลบ ทั้งไม่มีการกระจายและมีการกระจาย',
    [T('กด<b>ทำหลักต่อไป</b> — ลบทีละหลัก ถ้าลบไม่ได้ต้อง<b>กระจาย</b>จากหลักทางซ้าย', 'กดทำหลักต่อไป ลบทีละหลัก ถ้าลบไม่ได้ต้องกระจายจากหลักทางซ้าย', el => el.append(simColumn([[7004206, 2358479], [86532410, 32418230], [5310000, 1846250]], '−'))),
     T('ตัวอย่างทีละขั้น: 6,000,000 − 2,473,815 (กระจายผ่านหลักที่เป็น 0)', 'ตัวอย่างทีละขั้น หกล้าน ลบ สองล้านสี่แสนเจ็ดหมื่นสามพันแปดร้อยสิบห้า', p4ex(p4colRows(6000000, 2473815, '−'), `6,000,000 − 2,473,815 = <b>${fmt(6000000 - 2473815)}</b>`, '', () => h('div', { class: 'p4colwrap', html: p4colHTML(6000000, 2473815, '−', {}, { still: true }) })))],
    () => [...pkF(P4W2_SUB0, 2), ...pkF(P4W2_SUB1, 2), ...pkF(P4W2_SUB2, 2)].map(([a, b]) => p4colQ(a, b, '−'))),
  L4B(3, 'ลมทรายประมาณ', 'การหาผลบวก ผลลบ โดยใช้ค่าประมาณ', 'บวก ลบ ด้วยค่าประมาณ', 'หาผลบวก ผลลบโดยประมาณ และใช้ค่าประมาณตรวจความสมเหตุสมผลของคำตอบ',
    [T('เลือกประมาณเป็น<b>เต็มพัน หมื่น แสน หรือล้าน</b> — ค่าประมาณใกล้คำตอบจริงแค่ไหน?', 'เลือกประมาณเป็นเต็มพัน หมื่น แสน หรือล้าน ค่าประมาณใกล้คำตอบจริงแค่ไหน', el => el.append(simEstCalc([[4817250, '+', 2395680], [9046300, '−', 3758920], [612480, '+', 287390]]))),
     T('ตัวอย่างทีละขั้น: ใช้ค่าประมาณตรวจคำตอบ', 'ตัวอย่างทีละขั้น ใช้ค่าประมาณตรวจคำตอบ', p4ex([['โจทย์', 'เพื่อนคิด 5,284,600 − 1,906,350 ได้ 4,378,250 ถูกไหม?'], ['① ประมาณ', 'เป็นจำนวนเต็มล้าน: 5,284,600 ≈ 5,000,000 · 1,906,350 ≈ 2,000,000'], ['② คิดในใจ', '5,000,000 − 2,000,000 = 3,000,000'], ['③ เทียบ', '4,378,250 ห่างจาก 3,000,000 มาก → <b>น่าจะผิด</b> · คิดใหม่ได้ 3,378,250']], 'ค่าประมาณช่วย<b>ตรวจ</b>ว่าคำตอบสมเหตุสมผลหรือไม่'))],
    () => [...pkF(P4W2_EST, 3).map(p4estQ), ...pkF([...P4W2_ADD1, ...P4W2_SUB1], 3).map(([a, b], i) => p4estPick(a, i % 2 ? '−' : '+', b))]),
  L4B(4, 'กระโจมเครื่องคิดเลข', 'การคำนวณโดยใช้เครื่องคิดเลข', 'เครื่องคิดเลข', 'ใช้เครื่องคิดเลขหาผลบวก ผลลบ ผลคูณ ผลหาร และคำนวณที่มีวงเล็บ',
    [T('ภารกิจเครื่องคิดเลข: กดให้ได้คำตอบของ<b>ทุกภารกิจ</b>', 'ภารกิจเครื่องคิดเลข กดให้ได้คำตอบของทุกภารกิจ', el => el.append(simCalcTasks(P4_CT))),
     T('ตัวอย่างทีละขั้น: ลำดับการกดปุ่ม', 'ตัวอย่างทีละขั้น ลำดับการกดปุ่ม', p4ex([['(48,600 + 25,350) ÷ 3', 'กด 48600 + 25350 = ได้ 73,950'], ['ต่อ', 'กด ÷ 3 = ได้ 24,650'], ['7 × (3,250,000 − 1,875,400)', 'คิดในวงเล็บก่อน: กด 3250000 − 1875400 = ได้ 1,374,600'], ['ต่อ', 'กด × 7 = ได้ 9,622,200 (การคูณสลับที่ได้)']], 'มีวงเล็บ → <b>คิดในวงเล็บก่อน</b> แล้วจึงกดต่อ · กด C เพื่อเริ่มใหม่'))],
    () => pkF(P4W2_CALC, 6).map(expr => Q.p4Calc({ expr }))),
  L4B(5, 'โอเอซิสหาค่าลบ', 'การหาค่าของตัวไม่ทราบค่าจากประโยคสัญลักษณ์การลบ', 'ตัวไม่ทราบค่า (ลบ)', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์แสดงการลบ โดยใช้ความสัมพันธ์ของการบวกและการลบ',
    [T('ดูแผนภาพ <b>ตัวตั้ง = ตัวลบ + ผลลบ</b> แล้วกด<b>ขั้นต่อไป</b>', 'ดูแผนภาพ ตัวตั้งเท่ากับตัวลบบวกผลลบ แล้วกดขั้นต่อไป', el => el.append(simBarUnknown(['□ − 186450 = 520300', '903500 − □ = 418250', '□ − 2750000 = 1495600']))),
     T('ตัวอย่างทีละขั้น: 8,000,000 − □ = 3,264,500', 'ตัวอย่างทีละขั้น', p4ex([['① ความสัมพันธ์', 'ตัวลบ = ตัวตั้ง − ผลลบ'], ['② เขียนใหม่', '□ = 8,000,000 − 3,264,500'], ['③ คำนวณ', '□ = 4,735,500'], ['④ ตรวจ', '8,000,000 − 4,735,500 = 3,264,500 ✓']], 'ตัวไม่ทราบค่า คือ <b>4,735,500</b>'))],
    () => pkF(P4W2_UNK_SUB, 6).map(p4unkQ)),
  L4B(6, 'โอเอซิสหาค่าบวก', 'การหาค่าของตัวไม่ทราบค่าจากประโยคสัญลักษณ์การบวก', 'ตัวไม่ทราบค่า (บวก)', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์แสดงการบวก โดยใช้ความสัมพันธ์ของการบวกและการลบ',
    [T('ดูแผนภาพ <b>ผลบวก = ตัวตั้ง + ตัวบวก</b> แล้วกด<b>ขั้นต่อไป</b>', 'ดูแผนภาพ ผลบวกเท่ากับตัวตั้งบวกตัวบวก แล้วกดขั้นต่อไป', el => el.append(simBarUnknown(['245000 + □ = 612380', '□ + 1375400 = 4020000', '6080500 + □ = 9512000']))),
     T('ตัวอย่างทีละขั้น: □ + 2,486,700 = 5,000,000', 'ตัวอย่างทีละขั้น', p4ex([['① ความสัมพันธ์', 'ตัวตั้ง = ผลบวก − ตัวบวก'], ['② เขียนใหม่', '□ = 5,000,000 − 2,486,700'], ['③ คำนวณ', '□ = 2,513,300'], ['④ ตรวจ', '2,513,300 + 2,486,700 = 5,000,000 ✓']], 'ตัวไม่ทราบค่า คือ <b>2,513,300</b>'))],
    () => pkF(P4W2_UNK_ADD, 6).map(p4unkQ)),
  L4B(7, 'คาราวานโจทย์', 'การวิเคราะห์และแก้โจทย์ปัญหาการบวก โจทย์ปัญหาการลบ อย่างง่าย', 'โจทย์ปัญหาอย่างง่าย', 'วิเคราะห์โจทย์ (โจทย์ถามอะไร โจทย์บอกอะไร) เขียนประโยคสัญลักษณ์ และหาคำตอบ',
    [T('อ่านโจทย์ ดูแผนภาพ แล้ว<b>เลือกประโยคสัญลักษณ์</b>', 'อ่านโจทย์ ดูแผนภาพ แล้วเลือกประโยคสัญลักษณ์', p4story('คาราวานอูฐขนน้ำมาจากโอเอซิส <b>1,450,000</b> ลิตร แจกจ่ายให้หมู่บ้านไป <b>876,500</b> ลิตร เหลือน้ำกี่ลิตร', p4pwSVG({ w: 1450000, p1: 876500, p2: 573500, unk: '2', lw: 'น้ำทั้งหมด', l1: 'แจกไป', l2: 'เหลือ' }),
       [{ q: 'โจทย์ถามจำนวนที่เหลือ เลือกประโยคสัญลักษณ์', opts: ['1450000 − 876500', '1450000 + 876500', '876500 − 573500'], right: '1450000 − 876500', lab: 'เหลือน้ำ', unit: 'ลิตร', why: 'แจกออกไป → เหลือ = ทั้งหมด − ที่แจก' }], 'ตอบ <b>573,500 ลิตร</b>')),
     T('ตัวอย่างทีละขั้น: 4 ขั้นของการแก้โจทย์', 'ตัวอย่างทีละขั้น สี่ขั้นของการแก้โจทย์', p4ex([['โจทย์', 'สวนมีต้นปาล์ม 238,600 ต้น ปลูกเพิ่ม 95,750 ต้น มีต้นปาล์มทั้งหมดกี่ต้น'], ['① ถามอะไร', 'จำนวนต้นปาล์มทั้งหมด'], ['② บอกอะไร', 'มีอยู่ 238,600 ต้น · ปลูกเพิ่ม 95,750 ต้น'], ['③ วางแผน', 'รวม → บวก: 238,600 + 95,750 = □'], ['④ คำนวณ+ตรวจ', '= 334,350 · ตรวจ: 334,350 − 95,750 = 238,600 ✓']], 'ตอบ <b>334,350 ต้น</b>'))],
    () => pkF(P4S_SIMPLE, 5).map(s => Q.dStory(s))),
  L4B(8, 'ตลาดมากกว่า', 'การวิเคราะห์และแก้โจทย์ปัญหาการบวก โจทย์ปัญหาการลบ ที่มีคำว่า “มากกว่า” ซึ่งอาจจะใช้วิธีการบวก หรือ วิธีการลบ', 'โจทย์ “มากกว่า”', 'แก้โจทย์ปัญหาที่มีคำว่า “มากกว่า” โดยดูว่าไม่รู้จำนวนที่มาก จำนวนที่น้อย หรือผลต่าง',
    [T('คำว่า “มากกว่า” <b>ไม่ได้แปลว่าบวกเสมอ</b> — แตะดูว่าไม่รู้ส่วนไหน', 'คำว่ามากกว่า ไม่ได้แปลว่าบวกเสมอ แตะดูว่าไม่รู้ส่วนไหน', el => el.append(simCmpBar({ big: 1620000, small: 1385500, nb: 'อูฐ ก', ns: 'อูฐ ข', q: { big: 'อูฐ ข แบกน้ำ 1,385,500 มล. อูฐ ก แบกได้<b>มากกว่า</b>อูฐ ข 234,500 มล. อูฐ ก แบกน้ำกี่มล.', small: 'อูฐ ก แบกน้ำ 1,620,000 มล. ซึ่ง<b>มากกว่า</b>อูฐ ข 234,500 มล. อูฐ ข แบกน้ำกี่มล.', diff: 'อูฐ ก แบกน้ำ 1,620,000 มล. อูฐ ข แบก 1,385,500 มล. อูฐ ก แบก<b>มากกว่า</b>อูฐ ข กี่มล.' } }))),
     T('ตัวอย่าง: เลือกวิธีคิดเอง', 'ตัวอย่าง เลือกวิธีคิดเอง', p4story('ปีนี้ตลาดขายพรมได้ <b>2,860,000</b> บาท ซึ่ง<b>มากกว่า</b>ปีที่แล้ว <b>475,000</b> บาท ปีที่แล้วขายพรมได้กี่บาท', p4cmpSVG({ big: 2860000, small: 2385000, nb: 'ปีนี้', ns: 'ปีที่แล้ว', unk: 'small' }),
       [{ q: 'ไม่รู้จำนวนที่น้อย (ปีที่แล้ว) เลือกประโยคสัญลักษณ์', opts: ['2860000 − 475000', '2860000 + 475000'], right: '2860000 − 475000', lab: 'ปีที่แล้วขายได้', unit: 'บาท', why: 'ปีที่แล้วน้อยกว่า → เอาปีนี้ลบด้วยผลต่าง' }], 'ตอบ <b>2,385,000 บาท</b> — มีคำว่า “มากกว่า” แต่ใช้<b>การลบ</b>'))],
    () => [...pkF(P4S_MORE, 5).map(s => Q.dStory(s)), Q.hTF({ text: 'โจทย์ที่มีคำว่า <b>“มากกว่า”</b> ต้องใช้การบวกเสมอ', ok: false, why: 'ถ้าไม่รู้จำนวนที่น้อย หรือไม่รู้ผลต่าง ต้องใช้การลบ' })]),
  L4B(9, 'ตลาดน้อยกว่า', 'การวิเคราะห์และแก้โจทย์ปัญหาการบวก โจทย์ปัญหาการลบ ที่มีคำว่า “น้อยกว่า” ซึ่งอาจจะใช้วิธีการบวก หรือ วิธีการลบ', 'โจทย์ “น้อยกว่า”', 'แก้โจทย์ปัญหาที่มีคำว่า “น้อยกว่า” โดยดูว่าไม่รู้จำนวนที่มาก จำนวนที่น้อย หรือผลต่าง',
    [T('คำว่า “น้อยกว่า” <b>ไม่ได้แปลว่าลบเสมอ</b> — แตะดูว่าไม่รู้ส่วนไหน', 'คำว่าน้อยกว่า ไม่ได้แปลว่าลบเสมอ แตะดูว่าไม่รู้ส่วนไหน', el => el.append(simCmpBar({ big: 3450000, small: 2780600, nb: 'เมืองทราย', ns: 'เมืองผา', q: { big: 'เมืองผามีต้นอินทผลัม 2,780,600 ต้น ซึ่ง<b>น้อยกว่า</b>เมืองทราย 669,400 ต้น เมืองทรายมีกี่ต้น', small: 'เมืองทรายมีต้นอินทผลัม 3,450,000 ต้น เมืองผามี<b>น้อยกว่า</b>เมืองทราย 669,400 ต้น เมืองผามีกี่ต้น', diff: 'เมืองทรายมี 3,450,000 ต้น เมืองผามี 2,780,600 ต้น เมืองผามี<b>น้อยกว่า</b>เมืองทรายกี่ต้น' } }))),
     T('ตัวอย่าง: เลือกวิธีคิดเอง', 'ตัวอย่าง เลือกวิธีคิดเอง', p4story('ร้านเครื่องเทศขายได้ <b>724,800</b> บาท ซึ่ง<b>น้อยกว่า</b>ร้านผ้า <b>138,500</b> บาท ร้านผ้าขายได้กี่บาท', p4cmpSVG({ big: 863300, small: 724800, nb: 'ร้านผ้า', ns: 'ร้านเครื่องเทศ', unk: 'big' }),
       [{ q: 'ไม่รู้จำนวนที่มาก (ร้านผ้า) เลือกประโยคสัญลักษณ์', opts: ['724800 + 138500', '724800 − 138500'], right: '724800 + 138500', lab: 'ร้านผ้าขายได้', unit: 'บาท', why: 'ร้านผ้าขายได้มากกว่า → เอาร้านเครื่องเทศบวกผลต่าง' }], 'ตอบ <b>863,300 บาท</b> — มีคำว่า “น้อยกว่า” แต่ใช้<b>การบวก</b>'))],
    () => [...pkF(P4S_LESS, 5).map(s => Q.dStory(s)), Q.hTF({ text: 'โจทย์ที่มีคำว่า <b>“น้อยกว่า”</b> อาจต้องใช้การบวก', ok: true, why: 'ถ้าไม่รู้จำนวนที่มาก ต้องเอาจำนวนที่น้อยบวกผลต่าง' })]),
  L4B(10, 'เส้นทางสองขั้น', 'การวิเคราะห์และแก้โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ', 'โจทย์บวกและลบ', 'แก้โจทย์ปัญหาที่ต้องบวกและลบหลายขั้นตอน',
    [T('โจทย์ 2 ขั้น: <b>เลือกทีละขั้น</b>', 'โจทย์สองขั้น เลือกทีละขั้น', el => el.append(simStepPick('คลังมีอินทผลัม <b>2,400,000</b> ผล ส่งออกไป <b>965,300</b> ผล แล้วรับเข้ามาอีก <b>418,750</b> ผล คลังมีอินทผลัมกี่ผล',
       [{ q: 'ส่งออกไป → เหลือเท่าไร', opts: ['2400000 − 965300', '2400000 + 965300'], right: '2400000 − 965300', lab: 'หลังส่งออก', unit: 'ผล' }, { q: 'รับเข้ามาอีก → มีเท่าไร', opts: ['1434700 + 418750', '1434700 − 418750'], right: '1434700 + 418750', lab: 'หลังรับเข้า', unit: 'ผล' }], 'ตอบ <b>1,853,450 ผล</b> · เขียนรวมได้ 2,400,000 − 965,300 + 418,750 = □'))),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'พ่อมีเงิน 3,000,000 บาท ซื้อที่ดิน 1,850,000 บาท ซื้อรถไถ 675,400 บาท พ่อเหลือเงินกี่บาท'], ['ขั้นที่ 1', '3,000,000 − 1,850,000 = 1,150,000'], ['ขั้นที่ 2', '1,150,000 − 675,400 = 474,600'], ['ประโยครวม', '3,000,000 − 1,850,000 − 675,400 = □']], 'ตอบ <b>474,600 บาท</b>'))],
    () => pkF(P4S_TWO, 5).map(s => Q.dStory(s))),
  L4B(11, 'กระดานแสดงวิธีทำ', 'การแสดงวิธีทำ โจทย์ปัญหาการบวก โจทย์ปัญหาการลบ', 'แสดงวิธีทำ', 'เขียนแสดงวิธีทำโจทย์ปัญหาการบวกและการลบอย่างเป็นลำดับ พร้อมคำตอบและหน่วย',
    [T('เรียง<b>การแสดงวิธีทำ</b>ให้ถูกลำดับ', 'เรียงการแสดงวิธีทำให้ถูกลำดับ', el => el.append(simSeqSolve({ text: 'ฟาร์มมีวัว 125,600 ตัว ขายไป 48,750 ตัว ฟาร์มเหลือวัวกี่ตัว', expr: '125600 − 48750', giv: 'ฟาร์มมีวัว 125,600 ตัว · ขายไป 48,750 ตัว', lab: 'ฟาร์มเหลือวัว', unit: 'ตัว' }))),
     T('ตัวอย่าง: การแสดงวิธีทำที่สมบูรณ์', 'ตัวอย่าง การแสดงวิธีทำที่สมบูรณ์', p4ex([['โจทย์', 'จังหวัดหนึ่งปลูกข้าว 1,450,000 ไร่ ปลูกอ้อย 865,300 ไร่ ปลูกข้าวมากกว่าอ้อยกี่ไร่'], ['ประโยคสัญลักษณ์', '1,450,000 − 865,300 = □'], ['วิธีทำ', 'ปลูกข้าว 1,450,000 ไร่ · ปลูกอ้อย 865,300 ไร่'], ['คำนวณ', 'ปลูกข้าวมากกว่าอ้อย 1,450,000 − 865,300 = 584,700 ไร่'], ['ตอบ', '<span class="thn">๕๘๔,๗๐๐</span> ไร่']], 'คำตอบต้องมี<b>หน่วย</b>เสมอ'))],
    () => { const S = shuffle(P4_SOL.slice()); return [...S.slice(0, 3).map(o => Q.p4Seq({ text: o.text, cards: P4_SOLVE(o) })), ...S.slice(3).map(p4ansQ)]; }),
  L4B(12, 'ผาประโยคสัญลักษณ์', 'การสร้างโจทย์ปัญหาจากประโยคสัญลักษณ์', 'สร้างโจทย์จากประโยค', 'สร้างโจทย์ปัญหาการบวกและการลบให้สอดคล้องกับประโยคสัญลักษณ์ที่กำหนด',
    [T('เลือกเครื่องหมายและเรื่อง — ดูว่าโจทย์เปลี่ยนไปอย่างไร', 'เลือกเครื่องหมายและเรื่อง ดูว่าโจทย์เปลี่ยนไปอย่างไร', el => el.append(simMakeStory(1250000, 487600))),
     T('ตัวอย่างทีละขั้น: สร้างโจทย์จาก 3,700,000 − 1,265,800 = □', 'ตัวอย่างทีละขั้น สร้างโจทย์จากประโยคสัญลักษณ์', p4ex([['① ดูเครื่องหมาย', '− → เรื่องการเอาออก เหลือ หรือเปรียบเทียบ'], ['② เลือกเรื่อง', 'เงินในบัญชี 3,700,000 บาท ถอนออก 1,265,800 บาท'], ['③ แต่งคำถาม', 'เหลือเงินในบัญชีกี่บาท'], ['④ ตรวจ', 'แก้โจทย์แล้วได้ประโยค 3,700,000 − 1,265,800 = □ ✓']], 'โจทย์ที่ดีต้องมี<b>ข้อมูลครบ</b>และ<b>คำถาม</b>'))],
    () => { const S = shuffle(P4_S2S.slice()); return [...S.slice(0, 3).map(p4s2sQ), ...S.slice(3).map(p4st2sQ)]; }),
  L4B(13, 'ภาพลวงตาโจทย์', 'การสร้างโจทย์ปัญหาจากภาพ', 'สร้างโจทย์จากภาพ', 'สร้างโจทย์ปัญหาการบวกและการลบจากภาพ และหาคำตอบ',
    [T('แตะเลือกชนิดโจทย์ — สร้างโจทย์จากภาพป้ายราคา', 'แตะเลือกชนิดโจทย์ สร้างโจทย์จากภาพป้ายราคา', el => el.append(simPicStory([['house', 'บ้าน', 3450000], ['car', 'รถยนต์', 899000]], 5000000))),
     T('ตัวอย่างทีละขั้น: สร้างโจทย์จากภาพ', 'ตัวอย่างทีละขั้น สร้างโจทย์จากภาพ', p4ex([['① ดูภาพ', 'บ้านราคา 3,450,000 บาท · รถยนต์ราคา 899,000 บาท'], ['② โจทย์การบวก', 'ซื้อบ้านและรถยนต์ ต้องจ่ายทั้งหมดกี่บาท → 3,450,000 + 899,000 = 4,349,000'], ['③ โจทย์การลบ', 'บ้านแพงกว่ารถยนต์กี่บาท → 3,450,000 − 899,000 = 2,551,000']], 'ใช้<b>ตัวเลขจากภาพ</b>ให้ถูก และตั้งคำถามให้ชัด', '', () => h('div', { class: 'p4-fig', html: p4picHTML([['house', 'บ้าน', 3450000], ['car', 'รถยนต์', 899000]]) })))],
    () => { const [p1, p2, p3] = P4_PICS; return [p4picQ(p1, 'sub'), p4picQ(p1, 'sum'), p4picQ(p2, 'diff'), p4picQ(p3, 'sub'), p4picQ(shuffle([p2, p3])[0], 'sum')]; })
];

/* ---------- boss: built from our own practice items (no official test supplied) — options rotated with d6spread ---------- */
function p4xArith(a, b, op) { // the right answer + typical slips: no carrying/borrowing, a place shifted
  const r = op === '+' ? a + b : a - b, A = p4D(a), B = p4D(b), L = Math.max(A.length, B.length);
  const slip = +range(0, L - 1).map(p => op === '+' ? ((A[p] || 0) + (B[p] || 0)) % 10 : Math.abs((A[p] || 0) - (B[p] || 0))).reverse().join('');
  const k = 10 ** Math.max(2, String(r).length - 3), out = [r];
  [slip, r + k, r - k, r + 10 * k].forEach(x => { if (out.length < 4 && x > 0 && !out.includes(x)) out.push(x); });
  return { q: `${fmt(a)} ${op} ${fmt(b)} มีค่าเท่าใด`, opts: out.map(fmt), a: 0 };
}
const p4xStory = (s, n) => { const r = p4ev(s.expr), w = p4ev(s.wrong[0]); const out = [r, w, r + 10 ** Math.max(3, String(r).length - 3), Math.abs(r - 10 ** Math.max(3, String(r).length - 3))].filter((x, i, a) => x > 0 && a.indexOf(x) === i).slice(0, 4);
  return { q: s.text, opts: out.map(x => `${fmt(x)} ${s.unit}`), a: 0 }; };
const p4xUnk = s => { const S = p4uSolve(s); return { q: `${p4uHTML(s)}<br>จำนวนใน □ คือข้อใด`, opts: [S.ans, S.op === '+' ? S.Z + (s.startsWith('□') ? S.Y : S.X) : S.X + S.Z, S.ans + 100000, Math.abs(S.ans - 10000)].filter((x, i, a) => x > 0 && a.indexOf(x) === i).slice(0, 4).map(fmt), a: 0 }; };
const EXAM_P4C2 = d6spread([
  p4xArith(437119, 127656, '+'), p4xArith(8278985, 346784, '+'), p4xArith(61046438, 28721101, '+'), p4xArith(387391849, 523272074, '+'),
  p4xArith(569579, 327644, '−'), p4xArith(4568602, 2343835, '−'), p4xArith(51000000, 10275760, '−'), p4xArith(900000000, 723780009, '−'),
  { q: '11,429,395 + 3,489,032 ประมาณเป็นจำนวนเต็มล้านก่อนบวก ได้ผลบวกประมาณเท่าใด', opts: ['14,000,000', '15,000,000', '13,000,000', '14,900,000'], a: 0 },
  { q: '123,874,363 − 12,376,513 ประมาณเป็นจำนวนเต็มล้านก่อนลบ ได้ผลลบประมาณเท่าใด', opts: ['112,000,000', '111,000,000', '110,000,000', '136,000,000'], a: 0 },
  { q: 'ใช้เครื่องคิดเลขหาผลลัพธ์ของ (27,654 ÷ 22) + 8,843,815', opts: ['8,845,072', '8,871,469', '8,845,702', '1,257'], a: 0 },
  { q: 'ใช้เครื่องคิดเลขหาผลลัพธ์ของ 10 × (409,992,823 − 406,643,434)', opts: ['33,493,890', '33,493,199', '3,349,389', '334,938,900'], a: 0 },
  p4xUnk('430393 + □ = 643743'), p4xUnk('□ − 382431 = 143245'), p4xUnk('100000000 − □ = 32678349'),
  p4xStory(P4S_MORE[0]), p4xStory(P4S_SIMPLE[0]), p4xStory(P4S_SIMPLE[1]), p4xStory(P4S_LESS[0]),
  { q: 'เรือยอชต์ราคา 1,890,000 บาท เครื่องบินเล็กราคา 39,990,000 บาท ข้อใดเป็นโจทย์ปัญหาการลบที่สร้างจากข้อมูลนี้ได้ถูกต้อง', opts: ['เครื่องบินราคาแพงกว่ารถกระบะกี่บาท', 'ซื้อรถกระบะและเครื่องบินต้องจ่ายเงินทั้งหมดกี่บาท', 'ซื้อรถกระบะ 2 คัน ต้องจ่ายเงินกี่บาท', 'เครื่องบินมีกี่ที่นั่ง'], a: 0 }
]);
LESSONS_P4C2.push({ id: 439, boss: true, place: 'รังแมงป่องบวกลบ', title: 'ด่านบอส: บทที่ 2 การบวกและการลบจำนวนนับที่มากกว่า 100,000', short: 'ด่านบอส · ข้อสอบ', tone: 'yellow',
  goal: 'คำถามท้ายบท 20 ข้อ (ตั้งบวก ตั้งลบ ค่าประมาณ เครื่องคิดเลข ตัวไม่ทราบค่า และโจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อพิชิตทะเลทราย',
  exam: EXAM_P4C2, pass: 10, bossName: 'แมงป่องทองคำ', bossPal: 'yellow', emblem: '±', bossKind: 'scorp' });
