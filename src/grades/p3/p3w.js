/* =========================================================
   GRADE 3 · CHAPTER 10 — การวัดน้ำหนัก  (ป่าดิบชื้น · ภาคเรียนที่ 2 · เมือง 52 · ด่าน 1241–1252 · บอส 1259)
   builds on the ป.2 weight engine (p2w.js: w2DialSVG / w2Dial / w2Read / w2Set / w2Body / simW2Weigh / simW2Units / p2cmpWord)
   new for ป.3: ตัน · พิกัดของเครื่องชั่ง · คาดคะเน + ความคลาดเคลื่อน · บวก ลบ คูณ หาร กับหน่วยคู่ (ตัน|กิโลกรัม, กิโลกรัม|กรัม, กิโลกรัม|ขีด)
   ========================================================= */
/* every weight in GRAMS · unit pairs: kg = กิโลกรัม|กรัม (×1000) · kd = กิโลกรัม|ขีด (×10, small unit 100 g) · tk = ตัน|กิโลกรัม (×1000, small unit 1000 g) */
const W3P = { kg: { U: ['กิโลกรัม', 'กรัม'], R: 1000, s: 1 }, kd: { U: ['กิโลกรัม', 'ขีด'], R: 10, s: 100 }, tk: { U: ['ตัน', 'กิโลกรัม'], R: 1000, s: 1000 } };
const w3split = (g, m) => { const P = W3P[m], n = Math.round(g / P.s); return [Math.floor(n / P.R), n % P.R]; };
const w3t = (g, m) => { const [a, b] = w3split(g, m), U = W3P[m].U; return a && b ? `${fmt(a)} ${U[0]} ${fmt(b)} ${U[1]}` : a ? `${fmt(a)} ${U[0]}` : `${fmt(b)} ${U[1]}`; };
const W3U = { 'ตัน': 1e6, 'กิโลกรัม': 1000, 'ขีด': 100, 'กรัม': 1 };
const w3p = s => { let g = 0; s.replace(/([\d,.]+)\s*(ตัน|กิโลกรัม|กก\.|ขีด|กรัม|ก\.)/g, (m, n, u) => { g += parseFloat(n.replace(/,/g, '')) * W3U[u === 'กก.' ? 'กิโลกรัม' : u === 'ก.' ? 'กรัม' : u]; }); return Math.round(g); }; /* v138: อ่านตัวย่อ กก. ก. ได้ (เดิมโจทย์ปัญหาส่วนใหญ่จึงไม่ได้คิดในตาราง) */
const w3one = (g, u) => `${fmt(g / W3U[u])} ${u}`;
/* digital kitchen scale + capacity table */
const w3DigSVG = (txt, unit = 'kg', col = '#5B6170') => `<svg viewBox="0 0 160 110" class="w3dig" aria-hidden="true"><ellipse cx="80" cy="34" rx="62" ry="16" fill="#D7DCE6" stroke="#8A93A6" stroke-width="2"/><path d="M14 52 h132 l-10 44 q-2 6 -8 6 h-96 q-6 0 -8 -6 z" fill="${col}"/>
  <rect x="36" y="62" width="88" height="26" rx="5" fill="#B9F3E4" stroke="#1F7A62" stroke-width="2"/><text x="80" y="82" text-anchor="middle" font-size="19" font-weight="800" font-family="Nunito,sans-serif" fill="#1F4F44">${txt} ${unit}</text></svg>`;
const W3_TOOL = { spring: [W2_TOOL.spring[0], 60, W2_TOOL.spring[1]], body: [W2_TOOL.body[0], 100, W2_TOOL.body[1]],
  digital: ['เครื่องชั่งแบบใช้ตัวเลข', 5, `<ellipse cx="32" cy="22" rx="24" ry="7" fill="#D7DCE6" stroke="#8A93A6" stroke-width="1.6"/><path d="M8 30 h48 l-4 22 q-1 4 -5 4 h-30 q-4 0 -5 -4 z" fill="#5B6170"/><rect x="18" y="36" width="28" height="10" rx="2" fill="#B9F3E4"/>`],
  hang: ['เครื่องชั่งแบบแขวน', 2000, W2_TOOL.hang[1]] };
const w3ToolCard = (k, on) => `<span class="p2tl w3tl${on ? ' on' : ''}" data-k="${k}"><svg viewBox="0 0 64 64" width="56" height="56">${W3_TOOL[k][2]}</svg><b>${W3_TOOL[k][0]}</b><small>พิกัด ${fmt(W3_TOOL[k][1])} กก.</small></span>`;
const w3bestTool = kg => Object.keys(W3_TOOL).filter(k => W3_TOOL[k][1] >= kg).sort((a, b) => W3_TOOL[a][1] - W3_TOOL[b][1])[0];
/* column table for a unit pair (+ − ×) */
function w3ColHTML(a, b, op, m, o = {}) { const U = W3P[m].U, A = w3split(a, m), r = op === '+' ? a + b : op === '−' ? a - b : a * b, Rr = w3split(r, m);
  const cell = v => `<td>${v === '' ? '' : fmt(v)}</td>`, B = op === '×' ? ['', b] : w3split(b, m);
  return `<table class="w2col"><tr class="hd"><td></td><td>${U[0]}</td><td>${U[1]}</td></tr><tr><td></td>${cell(A[0])}${cell(A[1])}</tr>
    <tr><td class="op">${op}</td>${op === '×' ? `<td></td>${cell(b)}` : cell(B[0]) + cell(B[1])}</tr><tr class="res"><td></td>${o.q ? '<td>?</td><td>?</td>' : cell(Rr[0]) + cell(Rr[1])}</tr></table>`; }

/* ---------- v137 (ผู้ใช้ขอ: ให้เด็กตั้งบวก ลบ คูณ เองจริง ๆ) — ตารางตั้งหน่วยคู่ที่เด็กเติมเองทีละช่อง ----------
   + : บวกหน่วยเล็ก → (ครบ R ทด 1) → บวกหน่วยใหญ่ (+ ที่ทด) · − : (ไม่พอ → กระจาย) → ลบหน่วยเล็ก → ลบหน่วยใหญ่ · × : คูณหน่วยเล็ก → (ทด) → คูณหน่วยใหญ่ + ที่ทด
   คำตอบเขียนลงช่องในตารางเอง ผิดแต่ละขั้นบอกเหตุผล · เฉลยเติมตารางครบ · ใช้ทั้งบทน้ำหนักและบทความยาว */
function w3Work(a, b, op, m, ctx, o = {}) {
  const P = W3P[m], U = P.U, R = P.R, A = w3split(a, m), B = op === '×' ? [0, b] : w3split(b, m), res = w3split(op === '+' ? a + b : op === '−' ? a - b : a * b, m);
  const T = []; let carry = 0, borrow = false;
  if (op === '+') { const s1 = A[1] + B[1]; T.push({ t: 'n1', v: s1, lab: `บวก${U[1]}: <b>${fmt(A[1])} + ${fmt(B[1])}</b> = ?`, why: v => `${fmt(A[1])} + ${fmt(B[1])} ไม่เท่ากับ ${fmt(v)}` });
    if (s1 >= R) { carry = 1; T.push({ t: 'c1', v: s1 - R, lab: `${fmt(s1)} ${U[1]} ครบ ${fmt(R)} → ทด <b>1 ${U[0]}</b> เหลือกี่${U[1]}`, why: v => `${fmt(R)} ${U[1]} = 1 ${U[0]} · ${fmt(s1)} − ${fmt(R)} ไม่เท่ากับ ${fmt(v)}` }); }
    T.push({ t: 'n0', v: A[0] + B[0] + carry, lab: `บวก${U[0]}: <b>${fmt(A[0])} + ${fmt(B[0])}${carry ? ' + 1 (ที่ทด)' : ''}</b> = ?`, why: v => carry && v === A[0] + B[0] ? `อย่าลืมบวก 1 ${U[0]} ที่ทดมา` : `${fmt(A[0])} + ${fmt(B[0])}${carry ? ' + 1' : ''} ไม่เท่ากับ ${fmt(v)}` }); }
  else if (op === '−') { let a1 = A[1], a0 = A[0];
    if (A[1] < B[1]) { borrow = true; a1 = A[1] + R; a0 = A[0] - 1; T.push({ t: 'br', v: a1, lab: `${fmt(A[1])} − ${fmt(B[1])} ไม่พอ → กระจาย 1 ${U[0]} = ${fmt(R)} ${U[1]}: <b>${fmt(A[1])} + ${fmt(R)}</b> = ?`, why: v => `1 ${U[0]} = ${fmt(R)} ${U[1]} → ${fmt(A[1])} + ${fmt(R)} ไม่เท่ากับ ${fmt(v)}` }); }
    T.push({ t: 'n1', v: a1 - B[1], lab: `ลบ${U[1]}: <b>${fmt(a1)} − ${fmt(B[1])}</b> = ?`, why: v => `${fmt(a1)} − ${fmt(B[1])} ไม่เท่ากับ ${fmt(v)}` });
    T.push({ t: 'n0', v: a0 - B[0], lab: `ลบ${U[0]}: <b>${fmt(a0)} − ${fmt(B[0])}</b> = ?${borrow ? ` <small>(กระจายไปแล้ว ${fmt(A[0])} เหลือ ${fmt(a0)})</small>` : ''}`, why: v => borrow && v === A[0] - B[0] ? `กระจายไปแล้ว 1 ${U[0]} — ${fmt(A[0])} เหลือ ${fmt(a0)}` : `${fmt(a0)} − ${fmt(B[0])} ไม่เท่ากับ ${fmt(v)}` }); }
  else { const p1 = A[1] * b; T.push({ t: 'n1', v: p1, lab: `คูณ${U[1]}: <b>${fmt(A[1])} × ${b}</b> = ?`, why: v => `${fmt(A[1])} × ${b} ไม่เท่ากับ ${fmt(v)}` });
    if (p1 >= R) { carry = Math.floor(p1 / R); T.push({ t: 'c1', v: p1 % R, lab: `${fmt(p1)} ${U[1]} = <b>${carry} ${U[0]}</b> กับอีกกี่${U[1]}`, why: v => `${carry} ${U[0]} = ${fmt(carry * R)} ${U[1]} · ${fmt(p1)} − ${fmt(carry * R)} ไม่เท่ากับ ${fmt(v)}` }); }
    T.push({ t: 'n0', v: A[0] * b + carry, lab: `คูณ${U[0]}: <b>${fmt(A[0])} × ${b}${carry ? ` + ${carry} (ที่ทด)` : ''}</b> = ?`, why: v => carry && v === A[0] * b ? `อย่าลืมบวก ${carry} ${U[0]} ที่ทดมา` : `${fmt(A[0])} × ${b}${carry ? ` + ${carry}` : ''} ไม่เท่ากับ ${fmt(v)}` }); }
  let at = 0, typed = '', fin = false, hadWrong = false;
  const fig = h('div', { class: 'w2colwrap w3wfig' }), lab = h('div', { class: 'p4steplab d3lab' }), kp = h('div', { class: 'keypad' });
  const done = t => T.some((x, j) => x.t === t && (j < at || fin));
  const paint = () => { const cur = fin ? {} : T[at] || {}, ask = v => `<span class="d3ask">${typed || '?'}</span>`, c = (v, cls = '') => `<td class="${cls}">${v}</td>`;
    const r1 = done('c1') ? fmt(res[1]) : T.some(x => x.t === 'c1') ? (cur.t === 'c1' ? `<s class="w3tmp">${fmt(T.find(x => x.t === 'n1').v)}</s> ${ask()}` : (cur.t === 'n1' ? ask() : '')) : done('n1') ? fmt(res[1]) : cur.t === 'n1' ? ask() : '';
    const r0 = done('n0') ? fmt(res[0]) : cur.t === 'n0' ? ask() : '';
    const top0 = op === '−' ? (done('br') ? `<b class="w3new">${fmt(A[0] - 1)}</b>` : '') : (carry && done('c1') ? `<b class="w3cy">${carry}</b>` : '');
    const top1 = op === '−' && T.some(x => x.t === 'br') ? (done('br') ? `<b class="w3new">${fmt(A[1] + R)}</b>` : cur.t === 'br' ? ask() : '') : '';
    const sA0 = op === '−' && done('br') ? `<s>${fmt(A[0])}</s>` : fmt(A[0]), sA1 = op === '−' && done('br') ? `<s>${fmt(A[1])}</s>` : fmt(A[1]);
    fig.innerHTML = `<table class="w2col w3w"><tr class="hd"><td></td><td>${U[0]}</td><td>${U[1]}</td></tr><tr class="cy"><td></td>${c(top0)}${c(top1)}</tr><tr><td></td>${c(sA0)}${c(sA1)}</tr>
      <tr><td class="op">${op}</td>${op === '×' ? `<td></td>${c(b)}` : c(fmt(B[0])) + c(fmt(B[1]))}</tr><tr class="res"><td></td>${c(r0, cur.t === 'n0' ? 'on' : '')}${c(r1, cur.t === 'n1' || cur.t === 'c1' ? 'on' : '')}</tr></table>`;
    kp.classList.toggle('d3off', fin);
    lab.innerHTML = fin ? `= <b>${w3t(op === '+' ? a + b : op === '−' ? a - b : a * b, m)}</b>${shown ? '' : ' ✓'}` : cur.lab; };
  let shown = false;
  const next = () => { typed = ''; at++; sfx.pop(at + 2); if (hadWrong && ctx && ctx.say) { ctx.say('ถูกแล้ว ทำช่องต่อไปได้เลย'); hadWrong = false; } if (at >= T.length) { fin = true; paint(); if (o.demo) { o.onDone && o.onDone(); } else ctx.check(true); return; } paint(); };
  const enter = v => { const cur = T[at]; if (fin || !cur) return; if (v === cur.v) return next(); hadWrong = true; typed = ''; paint(); ctx.check(false, cur.why(v)); };
  const key = d => h('button', { class: 'btn', onclick: e => { e.stopPropagation(); if (fin) return; sfx.tap(); typed = (typed + d).slice(-7).replace(/^0+(\d)/, '$1'); paint(); } }, d);
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(key(d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: e => { e.stopPropagation(); typed = typed.slice(0, -1); paint(); } }, icon('left')), key(0),
    h('button', { class: 'btn primary', 'aria-label': 'ตกลง', onclick: e => { e.stopPropagation(); if (typed !== '') enter(+typed); } }, icon('check')));
  const panel = h('div', { class: 'ans ia d3ans' }, lab, kp); panel.reveal = () => { if (fin) return; fin = true; shown = true; at = T.length; paint(); };
  /* v138 o.demo: ตัวอย่างทีละขั้น — กด “ขั้นต่อไป” แล้วเขียนให้ดูทีละช่อง (แป้นกระพริบตามตัวเลข) */
  let busy = false, queued = 0; const step = () => { if (fin) return; if (busy) { queued = Math.min(queued + 1, 3); return; } const cur = T[at]; if (!cur) return; busy = true; const str = String(cur.v); let j = 0;
    const tick = () => { if (j < str.length) { typed += str[j]; const b = [...kp.children].find(x => x.textContent === str[j]); if (b) { b.classList.add('d3key'); setTimeout(() => b.classList.remove('d3key'), 220); } j++; paint(); setTimeout(tick, 230); } else setTimeout(() => { busy = false; next(); if (queued > 0 && !fin) { queued--; setTimeout(step, 60); } }, 420); }; tick(); };
  if (o.demo) kp.classList.add('d3demo');
  paint(); const W = h('div', { class: 't6-q p4-q d3wq w3wq' }, fig, panel); W.step = step; W.panel = panel; return W;
}
function w3demo(a, b, op, m) { return el => { let W; const btn = h('button', { class: 'btn info d3nx', onclick: e => { e.stopPropagation(); W.step(); } }, icon('right'), h('span', null, 'ขั้นต่อไป'));
  W = w3Work(a, b, op, m, null, { demo: true, onDone: () => { btn.remove(); teachDone(el); } }); W.panel.insertBefore(btn, W.panel.querySelector('.keypad')); el.append(h('div', { class: 'colstack prac prac-game d3demo-p' }, W)); }; }
/* ÷ หน่วยคู่ (ผู้ใช้ขอ: ใช้หารยาวที่เพิ่งเรียน): ① เปลี่ยนเป็นหน่วยเล็ก ② หารยาวเองบนกระดาน ③ เปลี่ยนกลับเป็นหน่วยคู่ */
function w3DivWork(a, b, m, ctx) { const P = W3P[m], U = P.U, n = Math.round(a / P.s), q = Math.round(n / b), lab = h('div', { class: 'p4steplab' }), slot = h('div', { class: 'colstack w3dslot' });
  const sub = f => ({ check: (ok, hn) => { if (!ok) return ctx.check(false, hn); f(); }, say: t => ctx.say && ctx.say(t) });
  const s3 = () => { lab.innerHTML = `ขั้นที่ 3: ${fmt(q)} ${U[1]} = กี่${U[0]} กี่${U[1]}`; slot.innerHTML = ''; slot.append(duoInput(ctx, w3split(q * P.s, m), U, { pre: '', hint: `${fmt(P.R)} ${U[1]} = 1 ${U[0]}` })); };
  const s2 = () => { sfx.pop(4); ctx.say && ctx.say('ถูกแล้ว! หารยาวต่อเลย'); lab.innerHTML = `ขั้นที่ 2: หารยาว <b>${fmt(n)} ÷ ${b}</b>`; slot.innerHTML = ''; const W = d3Work(n, b, ctx, { final: false, short: n > 9999, onDone: () => setTimeout(s3, 500) }); slot.append(W); };
  lab.innerHTML = `ขั้นที่ 1: เปลี่ยนตัวตั้งให้เป็น<b>${U[1]}</b>ทั้งหมด`;
  slot.append(h('div', { class: 'rowstack' }, answerBox(sub(s2), String(n), { hint: `1 ${U[0]} = ${fmt(P.R)} ${U[1]} → ${fmt(w3split(a, m)[0])} × ${fmt(P.R)} + ${fmt(w3split(a, m)[1])}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, U[1])));
  return h('div', { class: 'colstack w3dq' }, lab, slot); } /* โจทย์อยู่ในกรอบคำพูดแล้ว ไม่พิมพ์ซ้ำ */
/* v137 โจทย์ปัญหา: ตัวเลือกวิธีคิดครบ 3 ข้อ · แยกตัวเลขจากประโยคสัญลักษณ์เพื่อให้คิดในตาราง (ถ้าแยกไม่ได้ใช้ช่องตอบแบบเดิม) */
const w3StoryOpts = (sent, wrong) => { const out = [...wrong], ops = [' + ', ' − ', ' × ', ' ÷ '], op = ops.find(o => sent.includes(o));
  if (op) ops.filter(o => o !== op && !((op === ' + ' || op === ' − ') && (o === ' × ' || o === ' ÷ ')) && !((op === ' × ' || op === ' ÷ ') && o === ' − ')).forEach(o => { const t = sent.replace(op, o); if (out.length < 2 && t !== sent && !out.includes(t)) out.push(t); });
  if ((op === ' − ' || op === ' + ') && out.length < 2) { const [x, y] = sent.split(op); [`${y} − ${x}`, `${x} − ${y}`].forEach(t => { if (out.length < 2 && t !== sent && !out.includes(t)) out.push(t); }); }
  return out.slice(0, 2); };
const w3StoryJob = (sent, g, m) => { if (!m) return null; const op = ['+', '−', '×', '÷'].find(o => sent.includes(` ${o} `)); if (!op) return null;
  const [L, R] = sent.split(` ${op} `), pv = t => { let v = 0; if (m === 'bs') { try { return /บาท|สตางค์/.test(t) ? mnp(t) : Math.round(parseFloat(t.replace(/,/g, '')) * 100); } catch (_) { return 0; } } /* v141: เงินเขียนแบบใช้จุด */ if (m === 'lm') { try { return v3p(t); } catch (_) { return 0; } } try { v = l3p(t); } catch (_) { /* p3l ยังไม่โหลด (เรียกตอนสร้างบทเรียน) */ } return v || w3p(t); }, a = pv(L), b = op === '×' || op === '÷' ? +R.replace(/,/g, '') : pv(R);
  if (!a || !b || !Number.isFinite(b)) return null; const r = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b; return r === g ? { a, b, op } : null; };
/* ---------- teaching sims ---------- */
function simW3Tool(items) { // tap a thing, then tap the most suitable scale
  const box = h('div', { class: 'colstack' }, h6wait()), row = h('div', { class: 'rowstack w3items ia' }), tools = h('div', { class: 'rowstack w3tools ia', html: Object.keys(W3_TOOL).map(k => w3ToolCard(k)).join('') }), out = fNote(); let cur = null, good = 0;
  items.forEach(it => row.append(h('button', { class: 'btn sm', onclick: e => { e.stopPropagation(); cur = it; row.querySelectorAll('.btn').forEach(b => b.classList.toggle('on', b === e.currentTarget)); sfx.tap(); out.innerHTML = `${it[0]} หนักประมาณ ${fmt(it[1])} กิโลกรัม<br>แตะเครื่องชั่งที่เหมาะสม`; } }, it[0])));
  tools.addEventListener('click', e => { const t = e.target.closest('.w3tl'); if (!t || !cur) return; e.stopPropagation(); const k = t.dataset.k, cap = W3_TOOL[k][1], best = w3bestTool(cur[1]);
    if (cap < cur[1]) { sfx.no(); out.innerHTML = `${W3_TOOL[k][0]} พิกัด ${fmt(cap)} กก.<br><b>ชั่งไม่ได้</b> เพราะ${cur[0]}หนักเกินพิกัด`; return; }
    if (k !== best) { sfx.no(); out.innerHTML = `ชั่งได้ แต่พิกัดใหญ่เกินไป อ่านค่าละเอียดไม่ได้<br>ลองเลือกเครื่องที่พิกัดใกล้กว่านี้`; return; }
    sfx.ok(); good++; out.innerHTML = `ใช่! <b>${W3_TOOL[k][0]}</b> พิกัด ${fmt(cap)} กก.<br>ชั่งได้และพิกัดใกล้กับน้ำหนักที่สุด`; if (good >= 2) teachDone(box); });
  out.innerHTML = 'แตะสิ่งของ แล้วแตะเครื่องชั่งที่เหมาะสม<br>(พิกัด = น้ำหนักมากที่สุดที่เครื่องชั่งได้)'; box.append(row, tools, out); return box; }
function simW3Guess(it, unit = 'kg') { // guess first, then weigh
  const g = it[2], step = unit === 'kg' ? 1000 : 100, U = unit === 'kg' ? 'กิโลกรัม' : 'ขีด'; let guess = step * 2;
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), lab = h('div', { class: 'fbig' }), out = fNote();
  const draw = () => { lab.innerHTML = `คาดคะเน: <b class="num">${fmt(guess / step)} ${U}</b>`; };
  const ctl = h('div', { class: 'rowstack ia' }, h('button', { class: 'btn sm', onclick: e => { e.stopPropagation(); guess = Math.max(step, guess - step); sfx.tap(); draw(); } }, '−'), lab, h('button', { class: 'btn sm', onclick: e => { e.stopPropagation(); guess += step; sfx.tap(); draw(); } }, '+'));
  const go = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); go.remove(); fig.innerHTML = w2DialSVG(g, unit === 'kg' ? 'kd' : 'g', { items: [it[3]], col: 'mint' }); const err = Math.abs(guess - g) / step;
    out.innerHTML = `ชั่งจริง <b>${fmt(g / step)} ${U}</b><br>ความคลาดเคลื่อน = ${fmt(Math.max(guess, g) / step)} − ${fmt(Math.min(guess, g) / step)} = <b>${fmt(err)} ${U}</b>${err <= 1 ? '<br>คาดคะเนได้ใกล้มาก!' : ''}`; sfx.ok(); teachDone(box); } }, icon('check'), 'ชั่งดู');
  fig.innerHTML = `<div class="w3obj">${objRow(it[3], 1, { size: '96px' }).outerHTML}<b>${it[0]}</b></div>`; draw(); out.innerHTML = `เปรียบเทียบกับ${unit === 'kg' ? 'ถุงน้ำตาล 1 กิโลกรัม' : 'เนย 1 ก้อน (1 ขีด)'} แล้วคาดคะเน`;
  box.append(fig, ctl, go, out); return box; }
function simW3Chain() { // ตัน → กิโลกรัม → ขีด → กรัม : tap a unit to see how many of the next
  const box = h('div', { class: 'colstack' }, h6wait()), lad = h('div', { class: 'w3chain ia' }), out = fNote(), seen = new Set();
  const L = [['ตัน', '1 ตัน = 1,000 กิโลกรัม', 'รถยนต์ 1 คัน ช้าง 1 ตัว'], ['กิโลกรัม', '1 กิโลกรัม = 10 ขีด = 1,000 กรัม', 'ถุงน้ำตาล ถุงข้าว'], ['ขีด', '1 ขีด = 100 กรัม', 'เนย 1 ก้อน'], ['กรัม', 'หน่วยเล็กที่สุด', 'ยางลบ เหรียญ']];
  L.forEach(([u, t, ex], i) => lad.append(h('button', { class: 'w3u u' + i, onclick: e => { e.stopPropagation(); sfx.pop(i + 2); seen.add(i); lad.querySelectorAll('.w3u').forEach((b, j) => b.classList.toggle('on', j === i)); out.innerHTML = `<b>${t}</b><br>เช่น ${ex}`; if (seen.size >= 3) teachDone(box); } }, u)));
  out.innerHTML = 'แตะหน่วยน้ำหนักจากใหญ่ไปเล็ก'; box.append(lad, out); return box; }

/* ---------- question types ---------- */
Object.assign(Q, {
  /* digital / body scale → two-slot answer */
  w3Dig({ g, m = 'kg', name, e }) { const q = `${name || 'ของ'}หนักเท่าไร`, txt = (g / 1000).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    return { prompt: q + ' <small>(ตัวเลขหลังจุด 3 ตำแหน่ง = กรัม)</small>', say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'w2fig w3digfig', html: (e ? `<div class="w3digob">${objRow(e, 1, { size: '84px' }).outerHTML}</div>` : '') + w3DigSVG(txt) }),
      duoInput(ctx, w3split(g, m), W3P[m].U, { pre: '', hint: `${txt} kg → หน้าจุด = กิโลกรัม · หลังจุด = กรัม${m === 'kd' ? ' (100 กรัม = 1 ขีด)' : ''}` }))); } };
  },
  /* pick the right scale */
  w3Tool({ name, kg, e }) { const q = `ชั่ง${name} หนัก ${fmt(kg)} กิโลกรัม ควรเลือกเครื่องชั่งใด`, best = w3bestTool(kg);
    return { prompt: q, say: q, mount(bd, ctx) { if (e) bd.append(h('div', { class: 'w3obj w3toolob', html: objRow(e, 1, { size: '80px' }).outerHTML + `<b>${name} ${fmt(kg)} กก.</b>` })); const c = choices(ctx, Object.keys(W3_TOOL).map(k => ({ value: k, label: w3ToolCard(k) })), best, { hint: `เลือกเครื่องชั่งที่พิกัดมากกว่า ${fmt(kg)} กก. และใกล้ที่สุด` }); c.classList.add('w3toolopts'); bd.append(c); } };
  },
  /* fill the unit in a sentence */
  w3Unit({ text, right }) { const q = 'เติมหน่วยน้ำหนักให้เหมาะสม';
    return { prompt: q, say: text.replace('…', 'อะไร'), mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?'), [a, b] = text.split('…');
      bd.append(h('div', { class: 'colstack' }, h('div', { class: 'sentence' }, h('span', { class: 'lab' }, a), blank, b ? h('span', { class: 'lab' }, b) : null), wordChoices(ctx, right, blank, 'นึกถึงของจริง: เนย 1 ก้อน = 1 ขีด · ถุงน้ำตาล = 1 กิโลกรัม · รถ = ตัน', ['กรัม', 'ขีด', 'กิโลกรัม', 'ตัน']))); } };
  },
  /* convert: from text → answer either one unit (to = 'กรัม' | 'ขีด' | 'กิโลกรัม' | 'ตัน') or a pair (to = 'kg' | 'kd' | 'tk') */
  w3Conv({ from, to }) { const g = w3p(from), pair = !!W3P[to], q = `${from} เท่ากับ${pair ? `กี่${W3P[to].U[0]} กี่${W3P[to].U[1]}` : `กี่${to}`}`;
    const hint = '1 ตัน = 1,000 กิโลกรัม · 1 กิโลกรัม = 10 ขีด = 1,000 กรัม · 1 ขีด = 100 กรัม';
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q' }, h('div', { class: 'p4-fig', html: `<div class="fbig p4big"><b class="num">${from}</b> <span class="fop">=</span> <span class="fsign">?</span></div>` }),
      pair ? duoInput(ctx, w3split(g, to), W3P[to].U, { pre: '', hint }) : h('div', { class: 'rowstack' }, answerBox(ctx, String(g / W3U[to]), { hint }), h('span', { class: 'cap', style: { fontSize: '20px' } }, to)))); } };
  },
  /* + − × ÷ with a unit pair */
  w3Calc({ a, b, op, m }) { const r = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b, U = W3P[m].U;
    const q = op === '÷' ? `${w3t(a, m)} ÷ ${b} = ?` : op === '×' ? `${w3t(a, m)} × ${b} = ?` : `${w3t(a, m)} ${op} ${w3t(b, m)} = ?`;
    const hint = op === '÷' ? `เปลี่ยนเป็น${U[1]}ก่อน: ${fmt(a / W3P[m].s)} ${U[1]} ÷ ${b} แล้วเปลี่ยนกลับ` : op === '×' ? `คูณ${U[1]}ก่อน ครบ ${fmt(W3P[m].R)} ${U[1]} ทดเป็น 1 ${U[0]}` : op === '+' ? `บวก${U[1]}ก่อน ครบ ${fmt(W3P[m].R)} ${U[1]} ทด 1 ${U[0]}` : `ลบ${U[1]}ก่อน ไม่พอให้กระจาย 1 ${U[0]} = ${fmt(W3P[m].R)} ${U[1]}`;
    return { prompt: op === '÷' ? `${q} <small>(เปลี่ยนหน่วย → หารยาว → เปลี่ยนกลับ)</small>` : `${q} <small>(เติมคำตอบลงในตารางทีละช่อง)</small>`, say: q, mount(bd, ctx) { /* v137: เด็กทำเองในตาราง / หารยาวเอง */
      bd.append(op === '÷' ? w3DivWork(a, b, m, ctx) : w3Work(a, b, op, m, ctx)); void hint; } };
  },
  /* story: ① choose the way ② answer in the unit pair (or one unit) */
  w3Story({ text, sent, wrong, g, m, unit }) { /* v137: ตัวเลือกวิธีคิด 3 ข้อ (เดิม 2 ข้อ เดาถูกครึ่งหนึ่ง) · ขั้นที่ 2 ตั้งในตาราง/หารยาวเอง */
    const W = w3StoryOpts(sent, wrong), job = w3StoryJob(sent, g, m);
    return { prompt: 'อ่านโจทย์ เลือกวิธีคิด แล้วหาคำตอบ', say: text, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st w3st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text })),
        tkTwoStep(ctx, 'ขั้นที่ 1: เลือก<b>วิธีคิด</b>', [sent, ...W], sent, 'รวม/เพิ่ม/ยาวกว่า → บวก · เหลือ/ต่างกัน/สั้นกว่า → ลบ · หลายชิ้นเท่า ๆ กัน → คูณ · แบ่งเท่า ๆ กัน → หาร',
          () => job ? (job.op === '÷' ? w3DivWork(job.a, job.b, m, ctx) : w3Work(job.a, job.b, job.op, m, ctx)) : m ? duoInput(ctx, w3split(g, m), W3P[m].U, { pre: '' }) : h('div', { class: 'rowstack' }, answerBox(ctx, String(g / W3U[unit]), {}), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit)),
          `<b>${sent}</b> ✓ · ขั้นที่ 2: ${job && job.op === '÷' ? 'เปลี่ยนหน่วย หารยาว แล้วตอบ' : job ? 'คิดในตารางทีละช่อง' : 'หาคำตอบ'}`))); } };
  }
});
const W3W = ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'];
const w3CmpQ = ([A, B]) => { const a = w3p(A), b = w3p(B); return Q.p2cmpWord({ a: ['', A, a], b: ['', B, b], words: W3W, hint: 'เปลี่ยนเป็นหน่วยเดียวกันก่อน แล้วเปรียบเทียบ' }); };
const w3SortQ = (items, q) => Q.ixSort({ q: q || 'เรียงจากเบาที่สุดไปหนักที่สุด', items: items.map(([n, s]) => ({ label: `${n} ${s}`, v: w3p(s) })), dir: 'asc' });
const w3EstRef = (e, unit) => `<div class="l3est">${objRow(e, 1, { size: '92px' }).outerHTML}<div class="l3kid">${objRow(unit === 'kd' ? 'butter' : 'kg1', 1, { size: unit === 'kd' ? '54px' : '64px' }).outerHTML}<small>${unit === 'kd' ? 'เนย 1 ก้อน = 1 ขีด' : 'ถุงน้ำตาล 1 กิโลกรัม'}</small></div></div>`; /* v138: มีของ 1 หน่วยวางเทียบ */
const w3EstQ = ([name, e, right, wrong, unit]) => Q.p4Pick({ fig: w3EstRef(e, unit || (/ขีด/.test(right) ? 'kd' : 'kg')), q: `${name}หนักประมาณเท่าไร`, opts: [right, ...wrong], right, hint: 'เทียบกับถุงน้ำตาล 1 กิโลกรัม หรือเนย 1 ก้อน (1 ขีด)' });

/* ---------- data: ป.3 บทที่ 10 การวัดน้ำหนัก V2 — หน้าปัดวาดใหม่ ค่าที่อ่านจากรูปใช้ค่าใกล้เคียงต้นฉบับ ---------- */
const W3W_DIAL = [['cabbage', 'กะหล่ำปลี', 1500, 'kd', 'kd'], ['carrot', 'แคร์รอต', 800, 'g', 'g'], ['pineapple', 'สับปะรด', 3800, 'kg', 'kd'], ['orange', 'ส้ม', 400, 'g', 'kd'], ['pumpkin', 'ฟักทอง', 2000, 'd', 'kd'], ['mangosteen', 'มังคุด', 3500, 'kg', 'kd'], ['banana', 'กล้วย', 3600, 'kd', 'kd']]; // 
const W3W_DIG = [[1300, 'ตุ๊กตาหมี', 'teddy'], [2450, 'ไก่สด', 'chicken'], [4080, 'ปลา', 'fish']]; const W3W_BODY = ['54.8', '21.9', '36.5'];
const W3W_TOOL = [['ปลาทูน่า 1 ตัว', 36, 'fish'], ['นักเรียน', 35, 'kid1'], ['น้ำตาลทราย 2 ถุง', 2, 'kg1'], ['ไก่สด 10 ตัว', 25, 'chicken'], ['ผลไม้ในร้านขายส่ง', 1200], ['เหล็กเส้น', 1800], ['แป้ง', 3], ['ข้าวสาร 1 กระสอบ', 50]]; // 
const W3W_UNIT = [['หมึก 1 ตัวหนัก 300 …', 'กรัม'], ['แคร์รอต 2 หัวหนัก 4 …', 'ขีด'], ['เนย 1 ก้อนหนัก 100 …', 'กรัม'], ['มะเขือเทศ 4 ลูกหนัก 5 …', 'ขีด'], ['ข้าว 1 ถุงหนัก 2 …', 'กิโลกรัม'], ['กล้วยหนัก 8 …', 'ขีด'], ['กระเทียมหนัก 120 …', 'กรัม'], ['รถหนัก 1 … 200 กิโลกรัม', 'ตัน']]; // 
const W3_EST_KG = [['แตงโม 1 ลูก', 'watermelon', '3 กิโลกรัม', ['30 กิโลกรัม', '3 ขีด']], ['ทุเรียน 1 ลูก', 'durian', '3 กิโลกรัม', ['30 กิโลกรัม', '3 ขีด']], ['ฟักทอง 1 ลูก', 'pumpkin', '2 กิโลกรัม', ['20 กิโลกรัม', '2 ขีด']], ['แมว 1 ตัว', 'cat', '4 กิโลกรัม', ['40 กิโลกรัม', '4 ขีด']], ['สับปะรด 1 ลูก', 'pineapple', '1 กิโลกรัม', ['10 กิโลกรัม', '1 ขีด']]];
const W3_EST_KD = [['ส้ม 1 ผล', 'orange', '2 ขีด', ['2 กิโลกรัม', '20 ขีด']], ['กล้วย 1 ผล', 'banana', '1 ขีด', ['1 กิโลกรัม', '10 ขีด']], ['ไข่ 1 ฟอง', 'egg', 'ครึ่งขีด', ['5 ขีด', '1 กิโลกรัม']], ['แอปเปิล 1 ผล', 'apple', '2 ขีด', ['2 กิโลกรัม', '20 กรัม']], ['มะม่วง 1 ผล', 'mango', '3 ขีด', ['3 กิโลกรัม', '3 กรัม']]];
const W3W_CONV1 = [['7 กิโลกรัม', 'กรัม'], ['500 กรัม', 'ขีด'], ['43 ขีด', 'kg'], ['18,000 ขีด', 'กิโลกรัม'], ['1 กิโลกรัม 7 ขีด', 'kg'], ['11,900 กรัม', 'kd'], ['7 กิโลกรัม 4 ขีด', 'kg'], ['84,200 กรัม', 'kd'], ['777 ขีด', 'kg'], ['42,000 กิโลกรัม', 'ตัน'], ['9 ตัน', 'กิโลกรัม'], ['53 ขีด', 'กรัม']]; // 
const W3W_CONV2 = [['4 กิโลกรัม 450 กรัม', 'กรัม'], ['23,500 กรัม', 'kd'], ['562 ขีด', 'kg'], ['17,900 ขีด', 'กิโลกรัม'], ['3 กิโลกรัม 4 ขีด', 'กรัม'], ['67,900 กรัม', 'kd'], ['56,498 ขีด', 'kg'], ['6 ตัน 40 กิโลกรัม', 'กิโลกรัม'], ['4 กิโลกรัม 800 กรัม', 'ขีด'], ['14 กิโลกรัม', 'กรัม'], ['345 กิโลกรัม', 'ขีด'], ['16 ตัน', 'กิโลกรัม']]; // 
const W3W_SORT = [[['เนื้อไก่', '4 กิโลกรัม 3 ขีด'], ['ปลา', '4 กิโลกรัม 400 กรัม'], ['กุ้ง', '6 กิโลกรัม 8 ขีด']], [['แซลมอน', '3 กิโลกรัม 9 ขีด'], ['หมึก', '3 กิโลกรัม 100 กรัม'], ['หมู', '3 กิโลกรัม 500 กรัม']],
  [['เนื้อหมู', '1,500 กรัม'], ['เนื้อไก่', '2,200 กรัม'], ['เนื้อวัว', '1 กิโลกรัม']], [['ส้มโอ', '1 กิโลกรัม 200 กรัม'], ['สับปะรด', '1 กิโลกรัม 5 ขีด'], ['แตงโม', '3,500 กรัม']], [['รถกระบะ', '2 ตัน'], ['รถเก๋ง', '1 ตัน 498 กิโลกรัม'], ['รถตู้', '1 ตัน 702 กิโลกรัม']]]; // 
const W3W_CMP = [['40 กิโลกรัม 350 กรัม', '40 กิโลกรัม 3 ขีด'], ['8,320 กรัม', '83 ขีด'], ['13 กิโลกรัม 230 กรัม', '13 กิโลกรัม 2 ขีด'], ['34,900 กรัม', '34 กิโลกรัม 9 ขีด'], ['2,500 กิโลกรัม', '2 ตัน 15 กิโลกรัม'], ['5 กิโลกรัม 300 กรัม', '51 ขีด'],
  ['16 ตัน 840 กิโลกรัม', '16,900 กิโลกรัม'], ['451 ขีด', '45 กิโลกรัม'], ['9,560 กิโลกรัม', '9 ตัน 506 กิโลกรัม'], ['3,000 กิโลกรัม', '3 ตัน 560 กิโลกรัม'], ['7 ตัน 320 กิโลกรัม', '7,320 กิโลกรัม']]; // 
const W3_KG = (k, g) => k * 1000 + g, W3_KD = (k, d) => k * 1000 + d * 100, W3_TK = (t, k) => (t * 1000 + k) * 1000;
const W3W_ADD = [[W3_KG(12, 400), W3_KG(6, 812), 'kg'], [W3_KD(25, 5), W3_KD(23, 9), 'kd'], [W3_TK(3, 479), W3_TK(3, 652), 'tk'], [W3_KG(49, 569), W3_KG(34, 484), 'kg'], [W3_KG(76, 653), W3_KG(5, 650), 'kg'], [W3_KD(56, 5), W3_KD(37, 7), 'kd'], [W3_TK(22, 734), W3_TK(22, 338), 'tk'], [W3_KG(75, 199), W3_KG(28, 994), 'kg']]; // 
const W3W_SUB = [[W3_KG(30, 400), W3_KG(24, 812), 'kg'], [W3_KD(78, 8), W3_KD(35, 9), 'kd'], [W3_KG(65, 959), W3_KG(39, 464), 'kg'], [W3_KD(82, 4), W3_KD(26, 3), 'kd']]; // 
const W3W_MUL = [[W3_KG(4, 653), 4, 'kg'], [W3_KD(7, 4), 5, 'kd'], [W3_TK(13, 178), 7, 'tk'], [W3_KG(65, 842), 3, 'kg'], [W3_TK(23, 273), 6, 'tk'], [W3_KD(26, 9), 9, 'kd']]; // 
const W3W_DIV = [[W3_KG(4, 800), 3, 'kg'], [W3_KG(6, 524), 4, 'kg'], [W3_TK(8, 435), 5, 'tk'], [W3_KD(89, 4), 2, 'kd'], [W3_KD(52, 8), 8, 'kd'], [W3_TK(5, 112), 8, 'tk'], [W3_KG(9, 135), 5, 'kg']]; /* v138: ป.3 ตัวตั้งไม่เกิน 4 หลักเมื่อเปลี่ยนเป็นหน่วยเล็ก */ // 
const W3S = (text, sent, wrong, g, m, unit) => ({ text, sent, wrong, g, m, unit });
const W3W_ST1 = [W3S('ป้าซื้อกุ้ง 3 กิโลกรัม 8 ขีด ซื้อปลาหมึก 4 กิโลกรัม 4 ขีด ป้าซื้ออาหารทะเลรวมกันหนักเท่าไร', '3 กก. 8 ขีด + 4 กก. 4 ขีด', ['4 กก. 4 ขีด − 3 กก. 8 ขีด'], W3_KD(8, 2), 'kd'),
  W3S('เป้เปล่าหนัก 3 กิโลกรัม 300 กรัม ใส่หนังสือลงไปแล้วชั่งได้ 6,700 กรัม หนังสือหนักเท่าไร', '6,700 กรัม − 3,300 กรัม', ['6,700 กรัม + 3,300 กรัม'], 3400, 'kg'),
  W3S('ภูถือถังมือขวาหนัก 1 กิโลกรัม 500 กรัม ถือถังมือซ้ายหนัก 1 กิโลกรัม 700 กรัม ภูถือถังรวมหนักเท่าไร', '1 กก. 500 ก. + 1 กก. 700 ก.', ['1 กก. 700 ก. − 1 กก. 500 ก.'], W3_KG(3, 200), 'kg'),
  W3S('แม่ค้ามีมะนาว 15 กิโลกรัม 200 กรัม ขายไป 8 กิโลกรัม 750 กรัม แม่ค้าเหลือมะนาวเท่าไร', '15 กก. 200 ก. − 8 กก. 750 ก.', ['15 กก. 200 ก. + 8 กก. 750 ก.'], W3_KG(6, 450), 'kg')]; // แต่งเพิ่ม
const W3W_ST2 = [W3S('สหกรณ์รับซื้อข้าวโพด 12 ตัน 450 กิโลกรัม รับซื้อมันสำปะหลังมากกว่าข้าวโพด 2,580 กิโลกรัม รับซื้อมันสำปะหลังเท่าไร', '12 ตัน 450 กก. + 2,580 กก.', ['12 ตัน 450 กก. − 2,580 กก.'], W3_TK(15, 30), 'tk'),
  W3S('แม่ทำขนมใช้น้ำตาลทราย 1 กิโลกรัม 350 กรัม ใช้แป้งข้าวเจ้า 1 กิโลกรัม 5 ขีด ใช้แป้งข้าวเจ้ามากกว่าน้ำตาลกี่กรัม', '1,500 กรัม − 1,350 กรัม', ['1,500 กรัม + 1,350 กรัม'], 150, null, 'กรัม'),
  W3S('ลูกหมีหนัก 43 กิโลกรัม 2 ขีด ลูกเสือหนักน้อยกว่าลูกหมี 600 กรัม ลูกเสือหนักเท่าไร', '43 กก. 2 ขีด − 6 ขีด', ['43 กก. 2 ขีด + 6 ขีด'], W3_KD(42, 6), 'kd'),
  W3S('รถบรรทุกคันแรกขนข้าวได้ 4 ตัน 600 กิโลกรัม คันที่สองขนได้น้อยกว่าคันแรก 850 กิโลกรัม คันที่สองขนข้าวได้เท่าไร', '4 ตัน 600 กก. − 850 กก.', ['4 ตัน 600 กก. + 850 กก.'], W3_TK(3, 750), 'tk')]; // แต่งเพิ่ม
const W3W_ST3 = [W3S('ขนมไข่หนึ่งชิ้นใช้แป้ง 25 กรัม ถ้าทำขนมไข่ 4 ชิ้น จะใช้แป้งทั้งหมดกี่กรัม', '25 × 4', ['25 + 4', '25 ÷ 4'], 100, null, 'กรัม'),
  W3S('ในหนึ่งสัปดาห์ฟาร์มเก็บเห็ดได้ 8 กิโลกรัม 750 กรัม ถ้าเก็บได้เท่ากันทุกวัน ฟาร์มเก็บเห็ดได้วันละเท่าไร', '8,750 กรัม ÷ 7', ['8,750 กรัม × 7', '8,750 กรัม − 7'], 1250, 'kg'),
  W3S('ค่ายลูกเสือมีเด็ก 35 คน แต่ละคนได้ข้าวกล่องหนัก 400 กรัม ต้องเตรียมข้าวกล่องรวมหนักเท่าไร', '400 กรัม × 35', ['400 กรัม ÷ 35', '400 กรัม + 35'], 14000, 'kg'),
  W3S('กุ้งหนักรวม 84 ขีด แบ่งให้ญาติ 3 บ้าน บ้านละเท่า ๆ กัน แต่ละบ้านได้กุ้งหนักเท่าไร', '84 ขีด ÷ 3', ['84 ขีด × 3', '84 ขีด − 3'], 2800, 'kd'),
  W3S('ข้าวสาร 1 ถุงหนัก 5 กิโลกรัม 200 กรัม ซื้อ 6 ถุง หนักรวมเท่าไร', '5 กก. 200 ก. × 6', ['5 กก. 200 ก. ÷ 6', '5 กก. 200 ก. + 6'], W3_KG(31, 200), 'kg')]; // แต่งเพิ่ม

/* v138 คำถามสั้นให้เกมหลากหลาย */
const W3_CAPQ = [Q.p4Pick({ fig: `<div class="rowstack w3tools">${w3ToolCard('spring')}</div>`, q: 'เครื่องชั่งนี้ชั่งสิ่งใด<b>ไม่ได้</b>', opts: ['ลูกหมูหนัก 75 กิโลกรัม', 'แตงโมหนัก 4 กิโลกรัม', 'ข้าวสารหนัก 50 กิโลกรัม'], right: 'ลูกหมูหนัก 75 กิโลกรัม', hint: 'พิกัด 60 กก. ชั่งของที่หนักเกิน 60 กก. ไม่ได้' }),
  Q.p4Pick({ fig: `<div class="rowstack w3tools">${w3ToolCard('hang')}</div>`, q: 'ทำไมไม่ควรใช้เครื่องชั่งนี้ชั่ง<b>แตงโม 1 ลูก</b>', opts: ['พิกัดมากเกินไป อ่านค่าไม่ละเอียด', 'พิกัดน้อยเกินไป ชั่งไม่ได้', 'ชั่งได้พอดี'], right: 'พิกัดมากเกินไป อ่านค่าไม่ละเอียด', hint: 'แตงโมหนักประมาณ 3 กก. แต่เครื่องนี้ชั่งได้ถึง 2,000 กก.' }),
  Q.p4Pick({ fig: `<div class="rowstack w3tools">${w3ToolCard('digital')}</div>`, q: 'พิกัด 5 กิโลกรัม หมายความว่าอย่างไร', opts: ['ชั่งได้หนักที่สุด 5 กิโลกรัม', 'ชั่งได้เบาที่สุด 5 กิโลกรัม', 'ชั่งได้ครั้งละ 5 ชิ้น'], right: 'ชั่งได้หนักที่สุด 5 กิโลกรัม' }),
  Q.p4Pick({ fig: `<div class="rowstack w3tools">${w3ToolCard('body')}</div>`, q: 'เครื่องชั่งน้ำหนักตัวนี้ชั่งสิ่งใดได้', opts: ['คุณพ่อหนัก 72 กิโลกรัม', 'รถจักรยานยนต์หนัก 110 กิโลกรัม', 'วัวหนัก 400 กิโลกรัม'], right: 'คุณพ่อหนัก 72 กิโลกรัม', hint: 'พิกัด 100 กิโลกรัม' })];
const w3StepQ = (a, b, k) => Q.p4Pick({ fig: lbig(`${a} → ${b}`), q: `เปลี่ยน${a}เป็น${b} ต้องทำอย่างไร`, opts: [`× ${fmt(k)}`, `÷ ${fmt(k)}`, `× ${fmt(k === 10 ? 100 : 10)}`], right: `× ${fmt(k)}`, hint: `1 ${a} = ${fmt(k)} ${b} · หน่วยใหญ่ → หน่วยเล็ก ใช้คูณ` });
const w3StepBackQ = (a, b, k) => Q.p4Pick({ fig: lbig(`${b} → ${a}`), q: `เปลี่ยน${b}เป็น${a} ต้องทำอย่างไร`, opts: [`÷ ${fmt(k)}`, `× ${fmt(k)}`, `÷ ${fmt(k === 10 ? 100 : 10)}`], right: `÷ ${fmt(k)}`, hint: `1 ${a} = ${fmt(k)} ${b} · หน่วยเล็ก → หน่วยใหญ่ ใช้หาร` });
const W3_STEPQ = [w3StepQ('ตัน', 'กิโลกรัม', 1000), w3StepQ('กิโลกรัม', 'ขีด', 10), w3StepQ('ขีด', 'กรัม', 100), w3StepBackQ('กิโลกรัม', 'กรัม', 1000), w3StepBackQ('กิโลกรัม', 'ขีด', 10)];
const W3_MATCH = [['2 กก. 300 ก. × 3', '6 กก. 900 ก.'], ['1 กก. 500 ก. × 4', '6 กก.'], ['4 กก. 800 ก. ÷ 3', '1 กก. 600 ก.'], ['8 กก. 4 ขีด ÷ 2', '4 กก. 2 ขีด'], ['3 ตัน 250 กก. × 2', '6 ตัน 500 กก.'], ['9 กก. 6 ขีด ÷ 4', '2 กก. 4 ขีด']];
const W3_DIAGQ = [Q.p4Pick({ fig: p4cmpSVG({ big: 5200, small: 3650, unk: 'diff', nb: 'แตงโม', ns: 'ฟักทอง', fv: g => w2t(g, 'g', 1) }), q: 'จากแผนภาพ ต้องหาส่วนที่เป็น ? อย่างไร', opts: ['5,200 − 3,650', '5,200 + 3,650', '3,650 − 5,200'], right: '5,200 − 3,650', hint: 'ไม่รู้ผลต่าง → มาก − น้อย' }),
  Q.p4Pick({ fig: p4cmpSVG({ big: 3150, small: 2300, unk: 'big', nb: 'ถุงน้ำตาล', ns: 'ถุงแป้ง', fv: g => w2t(g, 'g', 1) }), q: 'จากแผนภาพ ต้องหาส่วนที่เป็น ? อย่างไร', opts: ['2,300 + 850', '2,300 − 850', '850 − 2,300'], right: '2,300 + 850', hint: 'ไม่รู้จำนวนที่มาก → น้อย + ผลต่าง' }),
  Q.p4Pick({ fig: p4cmpSVG({ big: 52400, small: 24750, unk: 'small', nb: 'ยาย', ns: 'หลาน', fv: g => w2t(g, 'g', 1) }), q: 'จากแผนภาพ ต้องหาส่วนที่เป็น ? อย่างไร', opts: ['52,400 − 27,650', '52,400 + 27,650', '27,650 − 52,400'], right: '52,400 − 27,650', hint: 'ไม่รู้จำนวนที่น้อย → มาก − ผลต่าง' })];

/* ---------- lessons (① รู้จัก → ② ตัวอย่างมีรูป → ③ ลองทำ → เกม) ---------- */
const L3W = (no, place, title, short, goal, teach, game) => ({ id: 1240 + no, no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game, learned: true });
const w3fig = (g, kind, e, col = 'mint') => `<div class="w2fig">${w2DialSVG(g, kind, { items: e ? [e] : null, col })}</div>`;
const LESSONS_P3C10 = [
  L3W(1, 'ป่าตาชั่ง', 'การวัดน้ำหนักเป็นกิโลกรัมและขีด กิโลกรัมและกรัม (1)', 'กิโลกรัม ขีด กรัม', 'อ่านน้ำหนักจากเครื่องชั่งเป็นกิโลกรัมและขีด กิโลกรัมและกรัม',
    [...learnStep('ยินดีต้อนรับสู่ <b>ป่าตาชั่ง</b>! อ่านน้ำหนักจากเครื่องชั่ง', 'ยินดีต้อนรับสู่ป่าตาชั่ง อ่านน้ำหนักจากเครื่องชั่ง', [
      { fig: w3fig(2300, 'kd', 'pineapple'), name: 'เครื่องชั่งสปริง', text: 'ตัวเลขใหญ่ = กิโลกรัม<br>ขีดเล็ก 1 ช่อง = 1 ขีด = 100 กรัม' },
      { fig: lbig('2 กก. 3 ขีด = 2 กก. 300 ก.'), name: 'อ่านได้ 2 แบบ', text: '2 กิโลกรัม 3 ขีด<br>หรือ 2 กิโลกรัม 300 กรัม' }, /* v139: ไม่ซ้ำรูปเครื่องชั่งเดิม */
      { fig: w3DigSVG('1.300'), carry: false, name: 'เครื่องชั่งแบบตัวเลข', /* v139: เครื่องชั่งแบบใหม่ เริ่มกระดานใหม่ (เดิมรูปเล็กลงเรื่อย ๆ) */ text: '1.300 kg = 1 กิโลกรัม 300 กรัม<br>หลังจุด 3 ตำแหน่ง = กรัม' },
      { fig: w2BodySVG('54.8'), name: 'เครื่องชั่งน้ำหนักตัว', text: '54.8 = 54 กิโลกรัม 8 ขีด<br>หลังจุด 1 ตำแหน่ง = ขีด' }], '1 กิโลกรัม = 10 ขีด = 1,000 กรัม · 1 ขีด = 100 กรัม'),
     pexStep('ตัวอย่างทีละขั้น: อ่านน้ำหนักแตงโม', 'ตัวอย่างทีละขั้น', [['① ตัวเลขที่เข็มผ่านมา', 'เลย 4 มาแล้ว → 4 กิโลกรัม', w3fig(4700, 'kd', 'watermelon')], ['② นับขีดเล็ก', 'เลย 4 มา 7 ช่อง → 7 ขีด', null], ['③ เขียน 2 แบบ', '4 กิโลกรัม 7 ขีด = 4 กิโลกรัม 700 กรัม', null]], 'แตงโมหนัก <b>4 กิโลกรัม 7 ขีด</b>'),
     T('ลองวางของบนตาชั่ง', 'ลองวางของบนตาชั่ง', el => el.append(simW2Weigh([['durian', 'ทุเรียน', 2600], ['coconut', 'มะพร้าว', 1300], ['cabbage', 'กะหล่ำปลี', 900]], 'kd')))],
    () => [...pkF(W3W_DIAL.filter(x => x[3] !== 'd'), 2).map(([e, name, g, m, kind]) => Q.w2Read({ e, name, g, kind, m })), (([g, name, e]) => Q.w3Dig({ g, name, e, m: 'kg' }))(pick(W3W_DIG)), Q.w2Body({ txt: pick(W3W_BODY) }), Q.w2Set({ e: 'pumpkin', name: 'ฟักทอง', g: pick([2700, 3400, 5200]), kind: 'kd' })]),
  L3W(2, 'ป่าเลือกตาชั่ง', 'การเลือกเครื่องชั่งที่เหมาะสม', 'เลือกเครื่องชั่ง', 'เลือกเครื่องชั่งที่เหมาะสมกับน้ำหนักของสิ่งที่จะชั่ง โดยดูพิกัดของเครื่องชั่ง',
    [...learnStep('รู้จัก<b>พิกัด</b>ของเครื่องชั่ง', 'รู้จักพิกัดของเครื่องชั่ง', [
      { fig: `<div class="rowstack">${w3ToolCard('spring')}</div>`, name: 'พิกัด = น้ำหนักมากที่สุดที่ชั่งได้', text: 'เครื่องชั่งสปริงนี้ชั่งได้ไม่เกิน 60 กิโลกรัม' },
      { fig: `<div class="rowstack w3tools">${Object.keys(W3_TOOL).map(k => w3ToolCard(k)).join('')}</div>`, carry: false, name: 'เครื่องชั่งแต่ละแบบพิกัดต่างกัน', text: 'ตัวเลข 5 · สปริง 60 · น้ำหนักตัว 100 · แขวน 2,000 กิโลกรัม' },
      { fig: `<div class="w3fit"><div class="w3obj">${objRow('watermelon', 1, { size: '70px' }).outerHTML}<b>แตงโม 3 กก.</b></div><div class="rowstack w3tools">${w3ToolCard('digital', 1)}${w3ToolCard('hang')}</div><div class="w3fitl"><span class="ok">พิกัด 5 กก. ✓ พอดี</span><span class="no">พิกัด 2,000 กก. ✗ ละเอียดน้อย</span></div></div>`, carry: false, name: 'เลือกให้เหมาะสม: พิกัด ≥ น้ำหนัก และใกล้ที่สุด', text: 'พิกัดน้อยไป → ชั่งไม่ได้<br>พิกัดมากไป → อ่านค่าไม่ละเอียด' }], 'เลือกเครื่องชั่งที่พิกัดมากกว่าน้ำหนัก และใกล้ที่สุด'),
     pexStep('ตัวอย่างทีละขั้น: ชั่งปลาหนัก 36 กิโลกรัม', 'ตัวอย่างทีละขั้น', [['① ตัดเครื่องที่พิกัดน้อยไป', 'แบบตัวเลข พิกัด 5 กก. → ชั่งไม่ได้', `<div class="rowstack w3tools">${w3ToolCard('digital')}</div>`], ['② เครื่องที่ชั่งได้', 'สปริง 60 · น้ำหนักตัว 100 · แขวน 2,000', `<div class="rowstack w3tools">${['spring', 'body', 'hang'].map(k => w3ToolCard(k)).join('')}</div>`], ['③ เลือกพิกัดใกล้ที่สุด', '60 ใกล้ 36 ที่สุด', `<div class="rowstack w3tools">${w3ToolCard('spring', 1)}</div>`]], 'ควรใช้<b>เครื่องชั่งสปริง</b>'),
     T('ลองเลือกเครื่องชั่งเอง', 'ลองเลือกเครื่องชั่งเอง', el => el.append(simW3Tool([['แตงโม', 4], ['ลูกหมู', 45], ['ปุ๋ย 30 กระสอบ', 1500], ['คุณครู', 70]])))],
    () => [...pkF(W3W_TOOL, 5).map(([name, kg, e]) => Q.w3Tool({ name, kg, e })), ...pkF(W3_CAPQ, 3)]), /* v138: เลือกเครื่องชั่ง 5 · เข้าใจพิกัด 3 */
  L3W(3, 'ป่าคาดกิโล', 'การคาดคะเนน้ำหนักเป็นกิโลกรัม', 'คาดคะเน (กิโลกรัม)', 'คาดคะเนน้ำหนักเป็นกิโลกรัม และหาความคลาดเคลื่อนเมื่อชั่งจริง',
    [...learnStep('<b>คาดคะเน</b>น้ำหนักเป็นกิโลกรัม', 'คาดคะเนน้ำหนักเป็นกิโลกรัม', [
      { fig: `<div class="w3obj">${objRow('kg1', 1, { size: '92px' }).outerHTML}<b>ถุงน้ำตาล 1 กิโลกรัม</b></div>`, name: 'จำความหนักของ 1 กิโลกรัม', text: 'ยกถุงน้ำตาล 1 กิโลกรัมให้รู้สึก' },
      { fig: `<div class="w3obj">${objRow('watermelon', 1, { size: '92px' }).outerHTML}<b>แตงโม</b></div>`, name: 'เทียบกับ 1 กิโลกรัม', text: 'หนักประมาณ 3 ถุง → ประมาณ 3 กิโลกรัม' },
      { fig: lbig('คาด 3 · จริง 4 → คลาด 1 กิโลกรัม'), name: 'ความคลาดเคลื่อน', text: 'จำนวนมาก − จำนวนน้อย<br>ยิ่งน้อย ยิ่งคาดคะเนได้ดี' }], 'เทียบกับ 1 กิโลกรัม · ชั่งจริงแล้วหาความคลาดเคลื่อน'),
     pexStep('ตัวอย่างทีละขั้น: คาดคะเนทุเรียน', 'ตัวอย่างทีละขั้น', [['① คาดคะเน', 'หนักประมาณ 2 ถุงน้ำตาล → 2 กิโลกรัม', `<div class="w3obj">${objRow('durian', 1, { size: '84px' }).outerHTML}</div>`], ['② ชั่งจริง', '3 กิโลกรัม', w3fig(3000, 'kd', 'durian')], ['③ ความคลาดเคลื่อน', '3 − 2 = 1 กิโลกรัม', null]], 'คลาดเคลื่อน <b>1 กิโลกรัม</b>'),
     T('ลองคาดคะเนแล้วชั่ง', 'ลองคาดคะเนแล้วชั่ง', el => el.append(simW3Guess(['ฟักทอง', 0, 4000, 'pumpkin'], 'kg')))],
    () => [...pkF(W3_EST_KG, 3).map(w3EstQ), ...pkF([[2, 4, 'watermelon', 'แตงโม'], [3, 2, 'pumpkin', 'ฟักทอง'], [1, 3, 'durian', 'ทุเรียน'], [5, 3, 'pumpkin', 'ฟักทองลูกใหญ่'], [4, 6, 'watermelon', 'แตงโมลูกใหญ่']], 3).map(([a, b, e, nm]) => Q.p4Num({ fig: `<div class="w3errfig"><div class="p4steplab">คาดคะเนว่า${nm}หนัก <b>${a} กิโลกรัม</b> · ชั่งจริงได้ดังรูป</div>${w3fig(b * 1000, 'kd', e)}</div>`, q: `อ่านเครื่องชั่ง แล้วหาความคลาดเคลื่อน`, a: Math.abs(a - b), unit: 'กิโลกรัม', hint: `อ่านเครื่องชั่งได้ ${b} กิโลกรัม · จำนวนมาก − จำนวนน้อย`, say: `คาดคะเนว่า${nm}หนัก ${a} กิโลกรัม ชั่งจริงได้เท่าไร คลาดเคลื่อนกี่กิโลกรัม` })), ...pkF(W3_EST_KG.filter(x => x[1] !== 'durian'), 2).map(w3EstQ)]), /* v138: อ่านเครื่องชั่งจริงก่อนหาความคลาดเคลื่อน */
  L3W(4, 'ป่าคาดขีด', 'การคาดคะเนน้ำหนักเป็นขีด', 'คาดคะเน (ขีด)', 'คาดคะเนน้ำหนักเป็นขีด และเลือกหน่วยน้ำหนักให้เหมาะสม',
    [...learnStep('<b>คาดคะเน</b>น้ำหนักเป็นขีด', 'คาดคะเนน้ำหนักเป็นขีด', [
      { fig: lbig('เนย 1 ก้อน = 1 ขีด = 100 กรัม'), name: 'จำความหนักของ 1 ขีด', text: 'ของเบา ๆ ใช้ขีดหรือกรัม' },
      { fig: `<div class="w3obj">${objRow('orange', 2, { size: '72px' }).outerHTML}<b>ส้ม 2 ผล</b></div>`, name: 'ส้ม 1 ผลหนักประมาณ 2 ขีด', text: 'ส้ม 2 ผล ประมาณ 4 ขีด' },
      { fig: `<div class="w3chain">${['ตัน', 'กิโลกรัม', 'ขีด', 'กรัม'].map((u, i) => `<span class="w3u u${i}">${u}</span>`).join('')}</div>`, name: 'เลือกหน่วยให้เหมาะ', text: 'รถ → ตัน · ข้าวสาร → กิโลกรัม · ผลไม้ → ขีด · ยางลบ → กรัม' }], 'ของเบาใช้ขีดหรือกรัม · ของหนักมากใช้ตัน'),
     pexStep('ตัวอย่างทีละขั้น: คาดคะเนมะม่วง', 'ตัวอย่างทีละขั้น', [['① เทียบ', 'หนักกว่าเนย 1 ก้อนประมาณ 3 เท่า', `<div class="w3obj">${objRow('mango', 1, { size: '84px' }).outerHTML}</div>`], ['② คาดคะเน', 'ประมาณ 3 ขีด', null], ['③ ชั่งจริง', '350 กรัม = 3 ขีดครึ่ง', w3fig(350, 'g', 'mango')]], 'คลาดเคลื่อนเพียง <b>ครึ่งขีด</b>'),
     T('ลองคาดคะเนแล้วชั่ง', 'ลองคาดคะเนแล้วชั่ง', el => el.append(simW3Guess(['แอปเปิล', 0, 300, 'apple'], 'kd')))],
    () => [...pkF(W3_EST_KD, 2).map(w3EstQ), ...pkF(W3W_UNIT, 3).map(([text, right]) => Q.w3Unit({ text, right }))]),
  L3W(5, 'ป่าหน่วยน้ำหนัก', 'ความสัมพันธ์ระหว่างหน่วยน้ำหนัก (1)', 'หน่วยน้ำหนัก (1)', 'บอกความสัมพันธ์ระหว่างกิโลกรัม ขีด กรัม และตัน และเปลี่ยนหน่วย',
    [...learnStep('<b>หน่วยน้ำหนัก</b>สัมพันธ์กัน', 'หน่วยน้ำหนักสัมพันธ์กัน', [
      { fig: `<div class="w3obj"><svg viewBox="0 -110 130 120" width="150">${JG.elephant}</svg><b>ช้าง 1 ตัว ≈ 3 ตัน</b></div>`, name: '1 ตัน = 1,000 กิโลกรัม', text: 'ใช้กับของที่หนักมาก เช่น รถ ช้าง' },
      { fig: lbig('1 กิโลกรัม = 10 ขีด = 1,000 กรัม'), name: 'กิโลกรัม ขีด กรัม', text: '1 ขีด = 100 กรัม' },
      { fig: lbig('ตัน <small>×1,000</small>→ กก. <small>×10</small>→ ขีด <small>×100</small>→ กรัม'), name: 'หน่วยใหญ่ → หน่วยเล็ก = คูณ', text: 'หน่วยเล็ก → หน่วยใหญ่ = หาร' }], 'ใหญ่ → เล็ก คูณ · เล็ก → ใหญ่ หาร'),
     pexStep('ตัวอย่างทีละขั้น: 43 ขีด = ? กิโลกรัม ? กรัม', 'ตัวอย่างทีละขั้น', [['① 10 ขีด = 1 กิโลกรัม', '43 ขีด = 40 ขีด + 3 ขีด', lbig('43 = 40 + 3')], ['② 40 ขีด', '= 4 กิโลกรัม', null], ['③ 3 ขีด', '= 300 กรัม', null]], '43 ขีด = <b>4 กิโลกรัม 300 กรัม</b>'),
     T('ลองแตะบันไดหน่วยน้ำหนัก', 'ลองแตะบันไดหน่วยน้ำหนัก', el => el.append(simUnitStair(['ตัน', 'กิโลกรัม', 'ขีด', 'กรัม'], ['', 'กก.', 'ขีด', 'ก.'], [1000, 10, 100])))],
    () => [...pkF(W3W_CONV1, 5).map(([from, to]) => Q.w3Conv({ from, to })), ...pkF(W3_STEPQ, 3)]), /* v138 */
  L3W(6, 'ป่าแปลงหน่วย', 'ความสัมพันธ์ระหว่างหน่วยน้ำหนัก (2)', 'หน่วยน้ำหนัก (2)', 'เปลี่ยนหน่วยน้ำหนักที่มีหลายหน่วยปนกัน รวมทั้งตัน',
    [...learnStep('เปลี่ยน<b>หลายหน่วยปนกัน</b>', 'เปลี่ยนหลายหน่วยปนกัน', [
      { fig: lbig('4 กก. 450 ก. = 4,000 + 450 = 4,450 กรัม'), name: 'เปลี่ยนทีละส่วนแล้วรวม', text: 'เปลี่ยนกิโลกรัมเป็นกรัมก่อน แล้วบวกกรัมที่เหลือ' },
      { fig: lbig('23,500 ก. = 23 กก. 500 ก. = 23 กก. 5 ขีด'), name: 'แยกหลักพันออกมาเป็นกิโลกรัม', text: 'ทุก 1,000 กรัม = 1 กิโลกรัม' },
      { fig: lbig('6 ตัน 40 กก. = 6,000 + 40 = 6,040 กก.'), name: 'ตัน → กิโลกรัม', text: '1 ตัน = 1,000 กิโลกรัม' }], 'เปลี่ยนแต่ละส่วนเป็นหน่วยเดียวกัน แล้วรวม'),
     pexStep('ตัวอย่างทีละขั้น: 3 กิโลกรัม 4 ขีด = ? กรัม', 'ตัวอย่างทีละขั้น', [['① กิโลกรัม → กรัม', '3 × 1,000 = 3,000 กรัม', lbig('3 กก. = 3,000 ก.')], ['② ขีด → กรัม', '4 × 100 = 400 กรัม', lbig('4 ขีด = 400 ก.')], ['③ รวมกัน', '3,000 + 400 = 3,400 กรัม', lbig('3,000 + 400 = 3,400 ก.')]], '3 กิโลกรัม 4 ขีด = <b>3,400 กรัม</b>'),
     T('ลองดูหน่วยกับตาชั่ง', 'ลองดูหน่วยกับตาชั่ง', el => el.append(simW2Units()))],
    () => [...pkF(W3W_CONV2, 5).map(([from, to]) => Q.w3Conv({ from, to })), ...pkF(W3W_CMP, 2).map(w3CmpQ), w3SortQ(pick(W3W_SORT))]), /* v138 */
  L3W(7, 'ป่าเทียบน้ำหนัก', 'การเปรียบเทียบน้ำหนัก', 'เปรียบเทียบน้ำหนัก', 'เปรียบเทียบน้ำหนักที่มีหน่วยต่างกัน และเรียงลำดับน้ำหนัก',
    [...learnStep('<b>เปรียบเทียบ</b>น้ำหนัก', 'เปรียบเทียบน้ำหนัก', [
      { fig: lpair(w3fig(4300, 'kd', 'chicken', 'coral'), w3fig(4400, 'kd', 'fish', 'sky')), name: '4 กก. 3 ขีด กับ 4 กก. 400 กรัม', text: 'ปลาหนักกว่า' },
      { fig: lbig('4 กก. 3 ขีด = 4 กก. 300 ก.'), name: 'เปลี่ยนเป็นหน่วยเดียวกันก่อน', text: '300 กรัม น้อยกว่า 400 กรัม' },
      { fig: lbig('กิโลกรัมเท่ากัน → ดูกรัม'), name: 'เทียบหน่วยใหญ่ก่อน', text: 'ถ้าหน่วยใหญ่เท่ากัน จึงดูหน่วยเล็ก' }], 'เปลี่ยนเป็นหน่วยเดียวกัน · เทียบหน่วยใหญ่ก่อน'),
     pexStep('ตัวอย่างทีละขั้น: 2,500 กก. กับ 2 ตัน 15 กก.', 'ตัวอย่างทีละขั้น', [['① เปลี่ยนเป็นกิโลกรัม', '2 ตัน 15 กก. = 2,015 กก.', lbig('2 ตัน 15 กก. = 2,000 + 15 = 2,015 กก.')], ['② เปรียบเทียบ', '2,500 กับ 2,015', lbig('2,500 > 2,015')]], '2,500 กก. <b>มากกว่า</b> 2 ตัน 15 กก.'),
     T('ลองแตะตาชั่ง 2 เครื่อง', 'ลองแตะตาชั่ง 2 เครื่อง', el => el.append(simW2Cmp([['durian', 'ทุเรียน', 3200], ['pineapple', 'สับปะรด', 2700], ['watermelon', 'แตงโม', 4100]])))],
    () => [...pkF(W3W_CMP, 3).map(w3CmpQ), ...pkF(W3W_SORT, 2).map(it => w3SortQ(it))]),
  L3W(8, 'ป่าบวกลบน้ำหนัก', 'การบวกและการลบเกี่ยวกับน้ำหนัก', 'บวก ลบ น้ำหนัก', 'บวกและลบน้ำหนักที่มีหน่วยเป็นตันกับกิโลกรัม กิโลกรัมกับกรัม กิโลกรัมกับขีด',
    [...learnStep('<b>บวก ลบ</b>น้ำหนัก', 'บวก ลบ น้ำหนัก', [
      { fig: w3ColHTML(W3_KG(12, 400), W3_KG(6, 812), '+', 'kg', { q: true }), name: 'ตั้งหน่วยให้ตรงกัน', text: 'กิโลกรัมตรงกิโลกรัม · กรัมตรงกรัม' },
      { fig: lbig('400 + 812 = 1,212 ก. → ทด 1 กก.'), name: 'ครบ 1,000 กรัม ทด 1 กิโลกรัม', text: 'ขีดครบ 10 ทด 1 กิโลกรัม · กิโลกรัมครบ 1,000 ทด 1 ตัน' },
      { fig: w3ColHTML(W3_KG(30, 400), W3_KG(24, 812), '−', 'kg', { q: true }), name: 'ลบไม่พอ → กระจาย 1 กก. = 1,000 ก.', text: '400 − 812 ไม่ได้ → 1,400 − 812 = 588 กรัม · กิโลกรัมเหลือ 29' }], 'เริ่มที่หน่วยเล็ก · ครบแล้วทด · ไม่พอกระจาย'),
     T('ตัวอย่างทีละขั้น: 12 กก. 400 ก. + 6 กก. 812 ก.', 'ตัวอย่างทีละขั้น', w3demo(W3_KG(12, 400), W3_KG(6, 812), '+', 'kg')),
     T('ตัวอย่างทีละขั้น: 30 กก. 400 ก. − 24 กก. 812 ก.', 'ตัวอย่างทีละขั้น การลบที่ต้องกระจาย', w3demo(W3_KG(30, 400), W3_KG(24, 812), '−', 'kg')),
     T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.w3Calc({ a: W3_KD(18, 7), b: W3_KD(9, 6), op: '+', m: 'kd' }), '', 'ลองทำเอง'))],
    () => [...pkF(W3W_ADD, 3).map(([a, b, m]) => Q.w3Calc({ a, b, op: '+', m })), ...pkF(W3W_SUB, 3).map(([a, b, m]) => Q.w3Calc({ a, b, op: '−', m })), l3CarryQ(pick(['kg', 'kd', 'tk'])), l3BorrowQ(pick(['kg', 'kd', 'tk']))]), /* v138 */
  L3W(9, 'ป่าคูณหารน้ำหนัก', 'การคูณและการหารเกี่ยวกับน้ำหนัก', 'คูณ หาร น้ำหนัก', 'คูณและหารน้ำหนักที่มีหน่วยเป็นตันกับกิโลกรัม กิโลกรัมกับกรัม กิโลกรัมกับขีด',
    [...learnStep('<b>คูณ หาร</b>น้ำหนัก', 'คูณ หาร น้ำหนัก', [
      { fig: w3ColHTML(W3_KG(4, 653), 4, '×', 'kg', { q: true }), name: 'คูณ: เริ่มที่หน่วยเล็ก', text: '653 × 4 = 2,612 กรัม = 2 กก. 612 ก.' },
      { fig: lbig('4 × 4 + 2 = 18 กิโลกรัม'), name: 'คูณหน่วยใหญ่ แล้วบวกที่ทดมา', text: 'ได้ 18 กิโลกรัม 612 กรัม' },
      { fig: lbig('4 กก. 800 ก. = 4,800 ก. → ÷ 3 = 1,600 ก.'), name: 'หาร: เปลี่ยนเป็นหน่วยเล็กก่อน แล้วหารยาว', text: '1,600 กรัม = 1 กิโลกรัม 600 กรัม' }], 'คูณ: เล็กก่อน แล้วทด · หาร: เปลี่ยนเป็นหน่วยเล็ก แล้วเปลี่ยนกลับ'),
     pexStep('ตัวอย่างทีละขั้น: 89 กก. 4 ขีด ÷ 2', 'ตัวอย่างทีละขั้น', [['① เปลี่ยนเป็นขีด', '89 กก. 4 ขีด = 894 ขีด', lbig('89 × 10 + 4 = 894 ขีด')], ['② หารยาว', '894 ÷ 2 = 447 ขีด', `<div class="d3fig">${d3BoardHTML(894, 2, 99, 'q')}</div>`], ['③ เปลี่ยนกลับ', '447 ขีด = 44 กก. 7 ขีด', lbig('447 ขีด = 440 + 7 = 44 กก. 7 ขีด')]], '= <b>44 กิโลกรัม 7 ขีด</b>'),
     T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.w3Calc({ a: W3_KD(6, 3), b: 4, op: '×', m: 'kd' }), '', 'ลองทำเอง'))],
    () => [...pkF(W3W_MUL, 3).map(([a, b, m]) => Q.w3Calc({ a, b, op: '×', m })), ...pkF(W3W_DIV, 2).map(([a, b, m]) => Q.w3Calc({ a, b, op: '÷', m })), l3DivFirstQ(pick(W3W_DIV)), l3CarryQ(pick(['kg', 'kd'])), Q.ixMatch({ q: 'จับคู่โจทย์กับผลลัพธ์', pairs: pkF(W3_MATCH, 3) })]), /* v138 */
  L3W(10, 'ป่าโจทย์รวม', 'โจทย์ปัญหาเกี่ยวกับน้ำหนัก (1)', 'โจทย์ปัญหา (1)', 'แก้โจทย์ปัญหาการบวกและการลบเกี่ยวกับน้ำหนัก',
    [...learnStep('ขั้นตอน<b>แก้โจทย์ปัญหาน้ำหนัก</b>', 'ขั้นตอนแก้โจทย์ปัญหาน้ำหนัก', [
      { fig: lbig('ถาม? บอก? หน่วยอะไร?'), name: '① อ่านโจทย์', text: 'ดูหน่วยให้ดี ถ้าต่างกันต้องเปลี่ยนก่อน' },
      { fig: p4pwSVG({ w: 4400, p1: 1600, p2: 2800, unk: 'w', l1: 'หมู', l2: 'วัว', lw: 'รวม', fv: g => w2t(g, 'kd', 1) }), name: '② แผนภาพ', text: 'รวมกัน → บวก · เหลือ → ลบ' },
      { fig: lbig('ตอบพร้อมหน่วย'), name: '③ คำนวณแล้วตอบ', text: 'เช่น 4 กิโลกรัม 4 ขีด' }], 'ถาม → บอก → เลือกวิธี → คำนวณ → ตอบพร้อมหน่วย'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'กระเป๋าหนัก 3 กก. 300 ก. ใส่ของแล้วหนัก 6,700 ก. ของหนักเท่าไร', p4pwSVG({ w: 6700, p1: 3300, p2: 3400, unk: '2', l1: 'กระเป๋า', l2: 'ของ', lw: 'รวม', fv: g => w2t(g, 'g', 1) })], ['① เปลี่ยนหน่วย', '3 กก. 300 ก. = 3,300 กรัม', null], ['② ลบ', '6,700 − 3,300 = 3,400 กรัม', null]], 'ตอบ <b>3 กิโลกรัม 400 กรัม</b>'),
     T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.w3Story({ text: 'แม่ซื้อปลา 2 กิโลกรัม 3 ขีด ซื้อกุ้ง 1 กิโลกรัม 5 ขีด แม่ซื้อปลาและกุ้งรวมกันหนักเท่าไร', sent: '2 กก. 3 ขีด + 1 กก. 5 ขีด', wrong: ['2 กก. 3 ขีด − 1 กก. 5 ขีด'], g: W3_KD(3, 8), m: 'kd' }), '', 'ลองทำเอง'))],
    () => { const S = pkF(W3W_ST1, 6); return [...S.slice(0, 4).map(s => Q.w3Story(s)), ...S.slice(4).map(l3SentQ), l3CarryQ(pick(['kg', 'kd'])), l3BorrowQ(pick(['kg', 'tk']))]; }), /* v138 */
  L3W(11, 'ป่าโจทย์เทียบ', 'โจทย์ปัญหาเกี่ยวกับน้ำหนัก (2)', 'โจทย์ปัญหา (2)', 'แก้โจทย์ปัญหาการเปรียบเทียบน้ำหนัก (มากกว่า น้อยกว่า)',
    [...learnStep('โจทย์<b>เปรียบเทียบน้ำหนัก</b>', 'โจทย์เปรียบเทียบน้ำหนัก', [
      { fig: p4cmpSVG({ big: 15030, small: 12450, unk: 'big', nb: 'มะม่วง', ns: 'ลำไย', fv: v => fmt(v) + ' กก.' }), name: 'ไม่รู้จำนวนที่มาก → บวก', text: 'น้อย + ผลต่าง' },
      { fig: p4cmpSVG({ big: 43200, small: 42600, unk: 'small', nb: 'ลูกหมี', ns: 'ลูกเสือ', fv: g => w2t(g, 'kd', 1) }), name: 'ไม่รู้จำนวนที่น้อย → ลบ', text: 'มาก − ผลต่าง' },
      { fig: p4cmpSVG({ big: 1500, small: 1350, unk: 'diff', nb: 'อเนกประสงค์', ns: 'แป้งสาลี', fv: g => fmt(g) + ' ก.' }), name: 'ไม่รู้ผลต่าง → ลบ', text: 'มาก − น้อย' }], 'ดูว่าไม่รู้ส่วนไหน แล้วเลือกบวกหรือลบ'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'ลูกหมีหนัก 43 กก. 2 ขีด ลูกเสือหนักน้อยกว่าลูกหมี 600 กรัม ลูกเสือหนักเท่าไร', p4cmpSVG({ big: 43200, small: 42600, unk: 'small', nb: 'ลูกหมี', ns: 'ลูกเสือ', fv: g => w2t(g, 'kd', 1) })], ['① เปลี่ยนหน่วย', '600 กรัม = 6 ขีด', null], ['② ลบ', '43 กก. 2 ขีด − 6 ขีด = 42 กก. 6 ขีด', null]], 'ตอบ <b>42 กิโลกรัม 6 ขีด</b>'),
     T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.w3Story({ text: 'ส้มหนัก 2 กิโลกรัม 400 กรัม มะม่วงหนักกว่าส้ม 800 กรัม มะม่วงหนักเท่าไร', sent: '2 กก. 400 ก. + 800 ก.', wrong: ['2 กก. 400 ก. − 800 ก.'], g: W3_KG(3, 200), m: 'kg' }), '', 'ลองทำเอง'))],
    () => { const S = pkF(W3W_ST2, 6); return [...S.slice(0, 4).map(s => Q.w3Story(s)), ...S.slice(4).map(l3SentQ), ...pkF(W3_DIAGQ, 2)]; }), /* v138 */
  L3W(12, 'ป่าโจทย์คูณหาร', 'โจทย์ปัญหาเกี่ยวกับน้ำหนัก (3)', 'โจทย์ปัญหา (3)', 'แก้โจทย์ปัญหาการคูณและการหารเกี่ยวกับน้ำหนัก',
    [...learnStep('โจทย์<b>คูณ หาร</b>น้ำหนัก', 'โจทย์คูณ หาร น้ำหนัก', [
      { fig: mtGroupsSVG(4, 1, 'cookie', { box: 'plate', size: 22 }), name: 'หลายชิ้น ชิ้นละเท่ากัน → คูณ', text: 'คุกกี้ 4 ชิ้น ชิ้นละ 25 กรัม → 25 × 4 = 100 กรัม' },
      { fig: mtGroupsSVG(3, 2, 'fish', { box: 'plate', size: 18 }), name: 'แบ่งเท่า ๆ กัน → หาร', text: 'ปลา 84 ขีด แบ่ง 3 คน → 84 ÷ 3 = 28 ขีด' },
      { fig: lbig('28 ขีด = 2 กก. 8 ขีด'), name: 'เปลี่ยนหน่วยให้ตรงกับที่โจทย์ถาม', text: 'ตอบพร้อมหน่วย' }], 'หลายชุดเท่ากัน → คูณ · แบ่งเท่า ๆ กัน → หาร'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'นักเรียน 35 คน ได้อาหารคนละ 450 กรัม ต้องเตรียมอาหารเท่าไร', lbig('35 คน · คนละ 450 กรัม')], ['① วิธีคิด', '450 × 35', null], ['② คำนวณ', '450 × 35 = 15,750 กรัม', null], ['③ เปลี่ยนหน่วย', '15,750 กรัม = 15 กก. 750 ก.', null]], 'ตอบ <b>15 กิโลกรัม 750 กรัม</b>'),
     T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.w3Story({ text: 'มะม่วง 3 ลูกหนักลูกละ 400 กรัม มะม่วงทั้งหมดหนักเท่าไร', sent: '400 × 3', wrong: ['400 ÷ 3', '400 + 3'], g: 1200, m: 'kg' }), '', 'ลองทำเอง'))],
    () => { const S = pkF(W3W_ST3, 6); return [...S.slice(0, 4).map(s => Q.w3Story(s)), ...S.slice(4).map(l3SentQ), l3DivFirstQ(pick(W3W_DIV)), l3CarryQ('kg')]; })
];

/* ---------- boss: built from our own practice items — d6spread · every item tagged with its level (lv) ---------- */
const w3X = (q, g, m, extra, lv, fig) => { const out = [g]; [...extra, g + W3P[m].s * 10, g - W3P[m].s * 10, g + W3P[m].s * W3P[m].R].forEach(x => { if (out.length < (fig ? 3 : 4) && x > 0 && !out.includes(x)) out.push(x); }); return { q, fig, opts: out.map(v => w3t(v, m)), a: 0, lv }; };
const EXAM_P3C10 = d6spread([
  w3X('จากภาพ แตงโมหนักเท่าไร', 4700, 'kd', [3700, 4600], 1241, `<div class="p4-fig">${w2DialSVG(4700, 'kd', { items: ['watermelon'], col: 'coral' })}</div>`),
  { q: 'เครื่องชั่งแบบตัวเลขแสดง 1.300 kg หมายถึงข้อใด', opts: ['1 กิโลกรัม 300 กรัม', '1 กิโลกรัม 3 กรัม', '13 กิโลกรัม', '1,300 กิโลกรัม'], a: 0, lv: 1241 },
  { q: 'ชั่งปลาหนัก 36 กิโลกรัม ควรใช้เครื่องชั่งใด', opts: ['เครื่องชั่งสปริง พิกัด 60 กิโลกรัม', 'เครื่องชั่งแบบใช้ตัวเลข พิกัด 5 กิโลกรัม', 'เครื่องชั่งแบบแขวน พิกัด 2,000 กิโลกรัม', 'เครื่องชั่งน้ำหนักตัว พิกัด 100 กิโลกรัม'], a: 0, lv: 1242 },
  { q: 'ชั่งเหล็กเส้นหนัก 1,800 กิโลกรัม ควรใช้เครื่องชั่งใด', opts: ['เครื่องชั่งแบบแขวน พิกัด 2,000 กิโลกรัม', 'เครื่องชั่งน้ำหนักตัว พิกัด 100 กิโลกรัม', 'เครื่องชั่งสปริง พิกัด 60 กิโลกรัม', 'เครื่องชั่งแบบใช้ตัวเลข พิกัด 5 กิโลกรัม'], a: 0, lv: 1242 },
  { q: 'แตงโม 1 ลูก หนักประมาณเท่าไร', opts: ['3 กิโลกรัม', '30 กิโลกรัม', '3 ขีด', '3 ตัน'], a: 0, lv: 1243 },
  { q: 'คาดคะเนน้ำหนักได้ 5 กิโลกรัม ชั่งจริง 7 กิโลกรัม ความคลาดเคลื่อนเท่าไร', opts: ['2 กิโลกรัม', '12 กิโลกรัม', '5 กิโลกรัม', '7 กิโลกรัม'], a: 0, lv: 1243 },
  { q: 'เนย 1 ก้อนหนัก 100 … ควรเติมหน่วยใด', opts: ['กรัม', 'กิโลกรัม', 'ตัน', 'ขีด'], a: 0, lv: 1244 },
  { q: 'รถยนต์ 1 คันหนักประมาณเท่าไร', opts: ['1 ตัน', '1 กิโลกรัม', '1 ขีด', '100 กรัม'], a: 0, lv: 1244 },
  { q: '7 กิโลกรัม เท่ากับกี่กรัม', opts: ['7,000 กรัม', '700 กรัม', '70 กรัม', '70,000 กรัม'], a: 0, lv: 1245 },
  { q: '42,000 กิโลกรัม เท่ากับกี่ตัน', opts: ['42 ตัน', '420 ตัน', '4 ตัน 2 กิโลกรัม', '4,200 ตัน'], a: 0, lv: 1245 },
  w3X('562 ขีด เท่ากับเท่าไร', W3_KG(56, 200), 'kg', [W3_KG(5, 620), W3_KG(56, 20)], 1246),
  { q: '6 ตัน 40 กิโลกรัม เท่ากับกี่กิโลกรัม', opts: ['6,040 กิโลกรัม', '6,400 กิโลกรัม', '6,004 กิโลกรัม', '10,000 กิโลกรัม'], a: 0, lv: 1246 },
  { q: '13 กิโลกรัม 230 กรัม … 13 กิโลกรัม 2 ขีด ควรเติมคำใด', opts: ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'], a: 0, lv: 1247 },
  { q: 'สิ่งใดเบาที่สุด: รถกระบะ 2 ตัน · รถเก๋ง 1 ตัน 498 กิโลกรัม · รถตู้ 1 ตัน 702 กิโลกรัม', opts: ['รถเก๋ง', 'รถตู้', 'รถกระบะ'], a: 0, lv: 1247 },
  w3X('12 กิโลกรัม 400 กรัม + 6 กิโลกรัม 812 กรัม = ?', W3_KG(19, 212), 'kg', [W3_KG(18, 212), W3_KG(18, 1212)], 1248),
  w3X('78 กิโลกรัม 8 ขีด − 35 กิโลกรัม 9 ขีด = ?', W3_KD(42, 9), 'kd', [W3_KD(43, 1), W3_KD(43, 9)], 1248),
  w3X('7 กิโลกรัม 4 ขีด × 5 = ?', W3_KD(37, 0), 'kd', [W3_KD(35, 20 - 10), W3_KD(35, 4)], 1249),
  w3X('89 กิโลกรัม 4 ขีด ÷ 2 = ?', W3_KD(44, 7), 'kd', [W3_KD(44, 2), W3_KD(45, 7)], 1249),
  w3X('ป้าซื้อกุ้ง 1 กิโลกรัม 6 ขีด ซื้อปลาหมึก 2 กิโลกรัม 8 ขีด รวมกันหนักเท่าไร', W3_KD(4, 4), 'kd', [W3_KD(3, 14 - 10), W3_KD(1, 2)], 1250),
  w3X('ปลาหนักรวม 84 ขีด แบ่งให้ 3 คน คนละเท่า ๆ กัน แต่ละคนได้ปลาหนักเท่าไร', W3_KD(2, 8), 'kd', [W3_KD(28, 0), W3_KD(25, 2)], 1252)]);
LESSONS_P3C10.push({ id: 1259, boss: true, place: 'ป่าตาชั่งยักษ์', title: 'ด่านบอส: ป.3 บทที่ 10 การวัดน้ำหนัก', short: 'ด่านบอส · ข้อสอบ', tone: 'jade',
  goal: 'คำถามท้ายบท 20 ข้อ (อ่านน้ำหนัก เลือกเครื่องชั่ง คาดคะเน หน่วยน้ำหนัก เปรียบเทียบ บวก ลบ คูณ หาร โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P3C10, pass: 10, bossName: 'งูยักษ์ตาชั่ง', bossPal: 'coral', emblem: 'กก.', bossKind: 'snake',
  winLine: 'ชนะงูยักษ์ตาชั่งแล้ว! ชั่งน้ำหนักได้แม่นยำมาก', loseLine: 'งูยักษ์ตาชั่งยังหนักแน่นอยู่ กลับไปทวนแล้วสู้ใหม่นะ!' });
