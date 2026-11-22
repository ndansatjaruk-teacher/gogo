'use strict';
/* =========================================================
   COMPONENTS: reusable visuals and interactions.
   Every lesson builds from these so all levels look and
   behave the same.
   ========================================================= */
function mascot(mood = 'happy', cls = '') { return h('div', { class: 'mascot ' + cls, html: mascotSVG(mood) }); }
function setMood(el, mood) { const m = el.querySelector('.mascot'); if (m && mood) m.innerHTML = mascotSVG(mood); }
function react(el, kind) { const m = el.querySelector('.mascot') || el; m.classList.remove('react-hop', 'react-no'); void m.offsetWidth; m.classList.add(kind === 'no' ? 'react-no' : 'react-hop'); }

/* tutor dock: mascot + speech card + replay-voice button */
function bubbleRow(html, opts = {}) {
  const txt = h('div', { class: 'txt', html });
  const b = h('div', { class: 'speech' }, txt, h('button', { class: 'spk ia', 'aria-label': 'ฟังอีกครั้ง', onclick: e => { e.stopPropagation(); say(opts.speak || txt.innerHTML, 'listen'); } }, icon('sound')));
  const row = h('div', { class: 'tutor' }, mascot(opts.mood), b);
  row.set = (html2, kind, mood) => {
    txt.innerHTML = html2; b.classList.remove('bad', 'good'); void b.offsetWidth; if (kind) b.classList.add(kind); setMood(row, mood);
    if (kind === 'good') react(row, 'hop'); if (kind === 'bad') react(row, 'no');
  };
  return row;
}

/* v189 (ผู้ใช้ขอ): คำแนะนำ (กรอบเหลือง เช่น วิธีใช้กระดานทด) ไม่วางบนจอ — ย้ายไปไว้ในปุ่ม ? มุมขวาล่าง กดถามได้เมื่องง
   ทุก 30 วินาที (ถ้ายังไม่ตอบ) ขึ้นคำพูด “มีอะไรถามมั้ย?” ข้างปุ่ม — ปิดได้ในตั้งค่า (SET.askNudge) · ตอบเสร็จแล้วคืนกรอบเดิมกลับที่ (แสดงคำตอบ)
   คำสั่งที่จำเป็น (ขั้นที่ 1: เลือก… · ให้เข็มชี้ …) ยังอยู่บนจอ · ใส่ class "qhelp" ให้กล่องใดก็ได้ที่เป็นคำแนะนำ หรือ q.help (HTML) */
const QHELP_SEL = '.e4w-info, .qhelp';
function qHelp(body, q, isDone, o = {}) {
  document.querySelectorAll('.qh').forEach(x => x.done ? x.done() : x.remove());
  const nodes = [...body.querySelectorAll(QHELP_SEL)].map(n => ({ n, p: n.parentNode, nx: n.nextSibling }));
  const store = h('div', { class: 'qh-store' }); nodes.forEach(x => store.append(x.n));
  const has = nodes.length || q.help;
  const pop = h('div', { class: 'qh-pop', hidden: true }, h('div', { class: 'qh-h' }, 'คำแนะนำ'), store, q.help ? h('div', { class: 'qh-x', html: q.help }) : null,
    has ? null : h('div', { class: 'qh-x', html: 'อ่านโจทย์ด้านบนอีกครั้ง หรือกดปุ่มลำโพงเพื่อฟังโจทย์<br>ลองทำดูก่อน — ถ้าตอบผิด ไก่น้อยจะบอกใบ้ให้' }));
  const btn = h('button', { class: 'qh-btn ia', 'aria-label': 'ขอคำแนะนำ', 'aria-expanded': 'false' }, '?'), ask = h('div', { class: 'qh-ask', 'aria-live': 'polite' }, 'มีอะไรถามมั้ย? กด ? ได้เลย');
  const wrap = h('div', { class: 'qh' + (o.teach ? ' qh-teach' : '') }, pop, ask, btn);
  const close = () => { pop.hidden = true; btn.classList.remove('on'); btn.setAttribute('aria-expanded', 'false'); };
  btn.onclick = e => { e.stopPropagation(); sfx.tap(); ask.classList.remove('on'); btn.classList.remove('wig');
    if (!pop.hidden) { close(); return; } pop.hidden = false; btn.classList.add('on'); btn.setAttribute('aria-expanded', 'true'); say(pop.innerText.replace(/^คำแนะนำ\s*/, '').replace(/[✓→·]/g, ' '), true); };
  pop.addEventListener('click', e => { e.stopPropagation(); close(); });
  let sec = 0; const t = setInterval(() => { if (!wrap.isConnected) { clearInterval(t); return; } if (!body.isConnected || isDone()) { wrap.done(); return; }
    if (++sec % 30 || SET.askNudge === false || !pop.hidden) return; ask.classList.add('on'); btn.classList.add('wig'); setTimeout(() => { ask.classList.remove('on'); btn.classList.remove('wig'); }, 4500); }, 1000);
  wrap.done = () => { clearInterval(t); nodes.forEach(x => { if (x.p && x.p.isConnected) x.p.insertBefore(x.n, x.nx && x.nx.parentNode === x.p ? x.nx : null); }); wrap.remove(); };
  document.body.append(wrap); return wrap;
}

/* v190 (ผู้ใช้ขอ): ลูกโป่งตอบถูก → แตกเป็นกระดาษสีชิ้นเล็ก ๆ (ตอบผิดไม่แตก) */
function popConfetti(el, n = 22) {
  if (REDUCED() || !el) return; const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .42, cols = ['#F5B52E', '#FF6F7D', '#4C9BF0', '#2FBF8C', '#8E7CF0', '#FFD76A'];
  for (let i = 0; i < n; i++) { const s = h('span', { class: 'pcf' }), a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 60, w = 5 + Math.random() * 5;
    Object.assign(s.style, { left: cx + 'px', top: cy + 'px', width: w + 'px', height: (i % 3 ? w : w * 1.8) + 'px', background: cols[i % cols.length], borderRadius: i % 3 === 1 ? '50%' : '2px' }); document.body.append(s);
    s.animate([{ transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 10}px) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${Math.cos(a) * d * 1.15}px,${Math.sin(a) * d + 50}px) rotate(${Math.random() * 540}deg)`, opacity: 0 }], { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.4,1)' }).onfinish = () => s.remove(); }
}

/* ---------- object displays ---------- */
function objRow(e, n, opts = {}) {
  const w = h('div', { class: 'objs', style: opts.size ? { '--os': opts.size } : null });
  for (let i = 0; i < n; i++) { const o = h('span', { class: 'obj' + (opts.pop ? ' pop' : '') }, art(e)); if (opts.pop) o.style.animationDelay = (opts.delay0 || 0) + i * .09 + 's'; w.append(o); }
  if (opts.max) w.style.maxWidth = opts.max;
  return w;
}
/* tap-to-count: each tap marks the object with its count number and says it aloud */
function makeCountable(container, onAll) {
  const objs = [...container.querySelectorAll('.obj')]; let c = 0;
  objs.forEach(o => {
    o.classList.add('tappable', 'ia');
    o.addEventListener('click', e => {
      e.stopPropagation(); if (o.dataset.c) return;
      c++; o.dataset.c = c; o.classList.add('counted'); o.append(h('span', { class: 'badge' }, c));
      sfx.pop(c); say(WORD[c], true);
      if (c === objs.length && onAll) onAll(c);
    });
  });
  container.resetCount = () => { c = 0; objs.forEach(o => { delete o.dataset.c; o.classList.remove('counted'); o.querySelector('.badge')?.remove(); }); };
  return container;
}
/* scattered objects in a field (harder to count => teaches marking) */
function objField(e, n, opts = {}) {
  const f = h('div', { class: 'field' });
  const cols = n > 6 ? 4 : 3, rows = n > 8 ? 3 : n > 3 ? 3 : 2;
  const cells = shuffle(range(0, cols * rows - 1)).slice(0, n);
  cells.forEach((c, i) => {
    const cx = (c % cols + .5) / cols * 100 + (Math.random() * 10 - 5) * (opts.jitter ?? 1), cy = (Math.floor(c / cols) + .5) / rows * 100 + (Math.random() * 10 - 5) * (opts.jitter ?? 1);
    f.append(h('span', { class: 'obj pop', style: { left: cx + '%', top: cy + '%', animationDelay: i * .06 + 's' } }, art(e)));
  });
  return f;
}
function tenFrame(n, opts = {}) {
  const f = h('div', { class: 'tf', style: opts.w ? { '--tfw': opts.w } : null });
  for (let i = 0; i < 10; i++) {
    const cell = h('span'); f.append(cell);
    if (i < n) { const d = h('i', { class: 'dot ' + (opts.color && opts.color(i) || '') + (opts.pop && i >= (opts.from || 0) ? ' pop' : '') }); if (opts.pop) d.style.animationDelay = (i - (opts.from || 0)) * .1 + 's'; cell.append(d); }
  }
  return f;
}
const DICE = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
function dice(n, w) {
  const d = h('div', { class: 'dice', style: w ? { '--dw': w } : null });
  for (let i = 0; i < 9; i++) d.append(h('span', null, DICE[n].includes(i) ? h('i', { class: 'dot' }) : null));
  return d;
}
function stairs(from, to, opts = {}) {
  const s = h('div', { class: 'stairs' });
  for (let n = from; n <= to; n++) {
    const col = h('div', { class: 'col' }, h('b', null, n));
    for (let i = 0; i < n; i++) col.append(h('i', { class: 'dot ' + (opts.colors ? ['', 'b', 'y', 'g'][n % 4] : '') + ' pop', style: { animationDelay: (n - from) * .15 + i * .04 + 's' } }));
    if (n === 0) col.append(h('i', { class: 'dot', style: { visibility: 'hidden' } }));
    s.append(col);
  }
  return s;
}
function plate(e, n) { const p = h('div', { class: 'plate' }); for (let i = 0; i < n; i++) p.append(h('span', { class: 'obj' }, art(e))); return p; }
function bigNum(n, cls = '') { return h('div', { class: 'bignum ' + cls }, String(n)); }
function triple(n) {
  const f = (cls, head, v) => h('div', { class: 'f ' + cls }, h('div', { class: 'h' }, head), h('div', { class: 'v' }, v));
  return h('div', { class: 'forms' }, f('a', 'ตัวเลขฮินดูอารบิก', String(n)), f('t', 'ตัวเลขไทย', thai(n)), f('w', 'ตัวหนังสือ', WORD[n]));
}
function numTable(nums) {
  return h('table', { class: 'tbl' }, h('tr', null, h('th', null, 'จำนวน'), h('th', null, 'ฮินดูอารบิก'), h('th', null, 'ไทย'), h('th', null, 'ตัวหนังสือ')),
    nums.map(n => h('tr', null, h('td', { class: 'dots' }, n ? '●'.repeat(n) : '–'), h('td', null, h('b', null, n)), h('td', null, thai(n)), h('td', null, WORD[n]))));
}
function numberLine(from, to, opts = {}) {
  const nl = h('div', { class: 'nl' + (to - from > 12 || opts.compact ? ' long' : '') });
  for (let n = from; n <= to; n++) {
    const blank = opts.blank && opts.blank.includes(n);
    const t = h('div', { class: 'tick' + ((opts.hi || []).includes(n) ? ' hi' : '') + ((opts.hi2 || []).includes(n) ? ' hi2' : '') + (blank ? ' blank' : '') }, h('i'), h('b', null, blank ? '?' : n));
    nl.append(t);
  }
  return nl;
}
/* part–whole diagram (ส่วนย่อย–ส่วนรวม) */
function partWhole(whole, a, b, opts = {}) {
  const q = opts.q; // which is hidden: 'whole' | 'a' | 'b'
  const el = h('div', { class: 'pw', style: opts.w ? { '--pww': opts.w } : null },
    h('div', { html: '<svg viewBox="0 0 100 87" preserveAspectRatio="none"><path d="M50 21 L22 64 M50 21 L78 64" stroke="#C9C3D8" stroke-width="3" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"/></svg>', style: { position: 'absolute', inset: 0 } }));
  const mk = (cls, v, key) => h('div', { class: 'c ' + cls + (q === key ? ' q' : '') }, q === key ? '?' : String(v));
  const W = mk('whole', whole, 'whole'), A = mk('a', a, 'a'), B = mk('b', b, 'b');
  el.append(W, A, B);
  if (opts.labels !== false) el.append(h('div', { class: 'lbl', style: { left: '50%', top: '-2%' } }, 'ส่วนรวม'), h('div', { class: 'lbl', style: { left: '22%', top: '97%' } }, 'ส่วนย่อย'), h('div', { class: 'lbl', style: { left: '78%', top: '97%' } }, 'ส่วนย่อย'));
  el.set = (w2, a2, b2) => { W.textContent = w2; A.textContent = a2; B.textContent = b2; };
  el.fill = v => { const t = q === 'whole' ? W : q === 'a' ? A : B; t.textContent = v; t.classList.add('filled'); };
  return el;
}
/* interactive splitter: tap counters to move between two parts (live simulation) */
function splitter(n, onChange, opts = {}) {
  const wrap = h('div', { class: 'counters ia' });
  const state = Array.from({ length: n }, (_, i) => i < (opts.a ?? n) ? 0 : 1);
  state.forEach((s, i) => {
    const c = h('button', { class: 'counter tap' + (s ? ' b' : ''), 'aria-label': 'ตัวนับ' });
    c.onclick = e => { e.stopPropagation(); state[i] ^= 1; c.classList.toggle('b', !!state[i]); sfx.pop(i); const a = state.filter(x => !x).length; onChange && onChange(a, n - a); };
    wrap.append(c);
  });
  wrap.parts = () => { const a = state.filter(x => !x).length; return [a, n - a]; };
  return wrap;
}
const HEART = on => `<svg viewBox="0 0 24 22"><path d="M12 20.5 C5 15 1.5 11.5 1.5 7 A5 5 0 0 1 12 4.5 A5 5 0 0 1 22.5 7 C22.5 11.5 19 15 12 20.5Z" ${on ? 'fill="url(#g-coral)" stroke="#C23C4B"' : 'fill="#F1EBDF" stroke="#DCD3C2"'} stroke-width="1.2" stroke-linejoin="round"/>${on ? '<ellipse cx="7" cy="7.5" rx="2.2" ry="1.4" transform="rotate(-35 7 7.5)" fill="#fff" opacity=".6"/>' : ''}</svg>`;

/* ---------- answer box: keypad OR handwriting ---------- */
function answerBox(ctx, expected, opts = {}) {
  expected = String(expected);
  const big = expected.length > 2, huge = expected.length > 3, maxLen = huge ? (expected.length > 6 ? 10 : 6) : big ? 4 : 2;
  const cands = opts.candidates || (huge ? 'any' : big ? range(0, 1000).map(String) : +expected > 10 ? range(0, 99).map(String) : range(0, 10).map(String));
  let mode = opts.mode || (opts.preferPen ? 'pen' : 'keypad'), value = '', pad = null, timer = null; // v113 (ผู้ใช้ขอ): ตอบด้วยการกดตัวเลขอย่างเดียว
  const slot = h('div', { class: 'ans-slot' }, '?');
  const msg = h('div', { class: 'pad-msg' });
  const body = h('div');
  const bK = h('button', { onclick: () => setMode('keypad') }, icon('keypad'), 'กดตัวเลข'), bP = h('button', { onclick: () => setMode('pen') }, icon('write'), 'เขียนเอง');
  const wrap = h('div', { class: 'ans ia' }, slot, opts.preferPen || opts.mode === 'pen' ? h('div', { class: 'seg' }, bK, bP) : null, body, msg); // the keypad / pen switch only on handwriting tasks
  function setVal(v) { value = v; slot.textContent = v === '' ? '?' : v.length > 3 ? fmt(+v) : v; slot.classList.toggle('filled', v !== ''); }
  function submit() {
    if (wrap.classList.contains('done')) return;
    if (value === '') { msg.textContent = mode === 'pen' ? 'เขียนตัวเลขในกรอบก่อนนะ' : 'กดตัวเลขก่อนนะ'; return; }
    const ok = value === expected;
    if (ok) { wrap.classList.add('done'); msg.textContent = ''; }
    ctx.check(ok, opts.hint);
    if (!ok && mode === 'keypad' && !wrap.classList.contains('revealed')) setVal(''); // 3rd miss: keep the revealed answer in the slot
  }
  function setMode(m) {
    mode = m; if (!opts.preferPen) { SET.input = m; persist(); }
    bK.classList.toggle('on', m === 'keypad'); bP.classList.toggle('on', m === 'pen');
    body.innerHTML = ''; msg.textContent = ''; setVal(''); pad && pad.destroy(); pad = null;
    if (m === 'keypad') {
      const kp = h('div', { class: 'keypad' });
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: () => { sfx.tap(); setVal((value + d).slice(-maxLen).replace(/^0+(\d)/, '$1')); } }, d)));
      kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: () => { sfx.tap(); setVal(value.slice(0, -1)); } }, icon('left')),
        h('button', { class: 'btn', onclick: () => { sfx.tap(); setVal((value + '0').slice(-maxLen).replace(/^0+(\d)/, '$1')); } }, '0'),
        h('button', { class: 'btn primary', 'aria-label': 'ส่งคำตอบ', onclick: submit }, icon('check')));
      body.append(kp);
    } else {
      const W = Math.min(huge ? 560 : big ? 400 : 320, innerWidth * .86), H = Math.min(200, Math.max(150, innerHeight * .26));
      const cv = h('canvas', { class: 'pad', style: { width: W + 'px', height: H + 'px' } });
      body.append(cv, h('div', { class: 'pad-tools', style: { marginTop: '12px' } },
        h('button', { class: 'btn sm icon', 'aria-label': 'ย้อน', onclick: () => { pad.undo(); recog(); } }, icon('undo')),
        h('button', { class: 'btn sm', onclick: () => { pad.clear(); setVal(''); msg.textContent = ''; } }, icon('eraser'), 'ล้าง'),
        h('button', { class: 'btn sm primary', onclick: () => { clearTimeout(timer); recog(); submit(); } }, icon('check'), 'ส่งคำตอบ')));
      pad = new InkPad(cv, {
        width: Math.max(6, H * .05),
        drawBg(x, w, hh) { x.save(); x.strokeStyle = '#ECE5D6'; x.lineWidth = 2; x.setLineDash([6, 8]); x.beginPath(); x.moveTo(10, hh * .15); x.lineTo(w - 10, hh * .15); x.moveTo(10, hh * .85); x.lineTo(w - 10, hh * .85); x.stroke(); x.restore(); },
        onStart() { clearTimeout(timer); },
        onStroke() { clearTimeout(timer); timer = setTimeout(recog, 450); }
      });
      msg.textContent = 'เขียนตัวเลขฮินดูอารบิกในกรอบ';
    }
  }
  function recog() {
    if (!pad || !pad.strokes.length) { setVal(''); return; }
    const r = recognizeNumber(pad.strokes, cands);
    if (r && r.score < .2) { setVal(r.value); msg.innerHTML = r.confident ? `อ่านได้ว่า <b>${r.value}</b>` : `อ่านได้ว่า <b>${r.value}</b> ใช่ไหม? ถ้าไม่ใช่ กด “ล้าง” แล้วเขียนใหม่`; }
    else { setVal(''); msg.textContent = 'ยังอ่านไม่ออก ลองเขียนให้ใหญ่และชัดขึ้นนะ'; }
  }
  setMode(mode);
  wrap.reveal = () => { setVal(expected); wrap.classList.add('done', 'revealed'); }; wrap.ansText = expected;
  return wrap;
}

/* ---------- multiple choice ---------- */
function choices(ctx, options, correct, opts = {}) {
  { /* safety: never show two options that look the same (a distractor equal to the answer, or two equal distractors) */
    const lab = o => (o.node ? o.node.textContent : String(o.label ?? '').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim(), seen = new Set(), ci = options.findIndex(o => o.value === correct);
    if (ci >= 0) seen.add(lab(options[ci]));
    options = options.filter((o, i) => { if (i === ci) return true; if (o.value === correct) return false; const k = lab(o); if (k && seen.has(k)) return false; seen.add(k); return true; }); }
  const longest = Math.max(0, ...options.map(o => (o.node ? o.node.textContent : String(o.label || '').replace(/<[^>]*>/g, '')).length));
  const wrap = h('div', { class: 'opts ia' + (longest <= 12 ? ' short' : ''), 'data-n': options.length });
  options.forEach(o => {
    const b = h('button', { class: 'opt' + (o.group ? ' group' : '') + (/^[\d,]+$/.test(o.label || '') ? ' n' : '') });
    if (o.node) b.append(o.node); else b.innerHTML = o.label;
    b.onclick = e => {
      e.stopPropagation(); if (wrap.dataset.done) return;
      const ok = o.value === correct;
      if (ok) { b.classList.add('right'); wrap.dataset.done = 1; opts.onRight && opts.onRight(o); }
      else { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); ctx.__pick = (o.node ? o.node.textContent : String(o.label ?? '').replace(/<[^>]*>/g, '')).trim(); }
      ctx.check(ok, typeof opts.hint === 'function' ? opts.hint(o) : opts.hint);
    };
    wrap.append(b);
  });
  const ci = options.findIndex(o => o.value === correct), co = options[ci];
  wrap.ansText = co ? (co.node ? co.node.textContent : String(co.label || '').replace(/<[^>]*>/g, '')).trim() : '';
  wrap.reveal = () => { const b = wrap.children[ci]; if (b) b.classList.add('right', 'reveal'); wrap.dataset.done = 1; opts.onRight && opts.onRight(co); };
  return wrap;
}
function checkButton(label, fn) { return h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); fn(); } }, icon('check'), label || 'ตรวจคำตอบ'); }

/* ---------- matching with lines (tap–tap or drag) ---------- */
/* =========================================================
   Linker — smooth drag-to-connect with magnetic snapping
   used by matchBoard (left ↔ right) and pairRows (top ↔ bottom)
   ========================================================= */
const SVGNS = 'http://www.w3.org/2000/svg';
function linker(wrap, svg, o) {
  // o: { sel: css for items, dir: 'h'|'v', anchor(el) → [x,y] in wrap coords, canLink(a,b), onLink(a,b) → true (ok) | false (wrong) }
  const mk = (t, at) => { const e = document.createElementNS(SVGNS, t); for (const k in at) e.setAttribute(k, at[k]); return e; };
  const curve = (p, q) => { if (o.dir === 'v') { const d = Math.max(24, Math.abs(q[1] - p[1]) * .45) * (q[1] >= p[1] ? 1 : -1); return `M${p[0]} ${p[1]} C${p[0]} ${p[1] + d} ${q[0]} ${q[1] - d} ${q[0]} ${q[1]}`; }
    const d = Math.max(24, Math.abs(q[0] - p[0]) * .45) * (q[0] >= p[0] ? 1 : -1); return `M${p[0]} ${p[1]} C${p[0] + d} ${p[1]} ${q[0] - d} ${q[1]} ${q[0]} ${q[1]}`; };
  const links = []; // { a, b, path }
  const live = mk('path', { class: 'lk-live', fill: 'none' }), dot = mk('circle', { class: 'lk-dot', r: 9 });
  let drag = null, raf = 0, sel = null;
  /* everything is kept in the board's OWN css pixels (what the svg draws in). getBoundingClientRect gives on-screen pixels, which differ
     whenever the page or the question is zoomed — so divide by the current on-screen scale of the board */
  const sc = () => { const w = wrap.offsetWidth; return w ? wrap.getBoundingClientRect().width / w || 1 : 1; };
  const anchor = el => { const k = sc(), p = o.anchor(el); return [p[0] / k, p[1] / k]; };
  const relayout = () => { if (!wrap.isConnected) return; links.forEach(L => L.path.setAttribute('d', curve(anchor(L.a), anchor(L.b)))); };
  let rq = 0; const later = () => { if (!wrap.isConnected) { removeEventListener('resize', later); removeEventListener('layoutzoom', later); return; } if (!rq) rq = requestAnimationFrame(() => { rq = 0; relayout(); }); };
  const ro = new ResizeObserver(later); ro.observe(wrap); [...wrap.querySelectorAll(o.sel)].forEach(x => ro.observe(x));
  addEventListener('resize', later); addEventListener('layoutzoom', later); setTimeout(later, 400);
  const settle = (a, b) => { // permanent link that draws itself in
    const path = mk('path', { class: 'lk-done', fill: 'none', d: curve(anchor(a), anchor(b)), pathLength: 1 });
    svg.append(path); links.push({ a, b, path });
  };
  const retract = (from, to, cls, ms = 260) => new Promise(res => { // animate live end back to its start
    live.setAttribute('class', 'lk-live ' + (cls || '')); const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3), x = to[0] + (from[0] - to[0]) * e, y = to[1] + (from[1] - to[1]) * e;
      live.setAttribute('d', curve(from, [x, y])); dot.setAttribute('cx', x); dot.setAttribute('cy', y);
      if (k < 1) requestAnimationFrame(step); else { live.remove(); dot.remove(); live.setAttribute('class', 'lk-live'); res(); } };
    requestAnimationFrame(step); });
  const shoot = (from, to, ms = 220) => new Promise(res => { // tap-tap: line flies to its target
    svg.append(live, dot); const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3), x = from[0] + (to[0] - from[0]) * e, y = from[1] + (to[1] - from[1]) * e;
      live.setAttribute('d', curve(from, [x, y])); dot.setAttribute('cx', x); dot.setAttribute('cy', y); if (k < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step); });
  async function finish(a, b, start, end) {
    a.classList.remove('sel'); b.classList.remove('hover');
    const ok = o.onLink(a, b);
    if (ok) { live.remove(); dot.remove(); settle(a, b); [a, b].forEach(x => { x.classList.remove('snap'); void x.offsetWidth; x.classList.add('snap'); }); navigator.vibrate && navigator.vibrate(12); }
    else await retract(start, end, 'bad', 340);
  }
  const free = el => !el.classList.contains('paired');
  wrap.addEventListener('pointerdown', async e => {
    const it = e.target.closest(o.sel); if (!it || !free(it) || drag) return;
    e.preventDefault(); e.stopPropagation();
    if (sel && sel !== it && o.canLink(sel, it)) { const a = sel; sel = null; const p = anchor(a), q = anchor(it); it.classList.add('hover'); await shoot(p, q); finish(a, it, p, q); return; }
    sel && sel.classList.remove('sel'); sel = it; it.classList.add('sel'); sfx.tap();
    try { wrap.setPointerCapture(e.pointerId); } catch (_) {}
    const wr = wrap.getBoundingClientRect(), k = sc(), start = anchor(it);
    const targets = [...wrap.querySelectorAll(o.sel)].filter(t => t !== it && free(t) && o.canLink(it, t)).map(t => { const r = t.getBoundingClientRect(); return { t, x0: (r.left - wr.left) / k, y0: (r.top - wr.top) / k, x1: (r.right - wr.left) / k, y1: (r.bottom - wr.top) / k, at: anchor(t) }; });
    drag = { it, start, wr, k, targets, snap: null, moved: false, pt: [(e.clientX - wr.left) / k, (e.clientY - wr.top) / k], id: e.pointerId, cur: start };
    live.setAttribute('d', curve(start, start)); dot.setAttribute('cx', start[0]); dot.setAttribute('cy', start[1]);
  });
  const near = (p) => { // magnet: inside an item (+pad) or close to its anchor
    let best = null, bd = 1e9; const pad = 34, R = 96;
    for (const T of drag.targets) { const inside = p[0] > T.x0 - pad && p[0] < T.x1 + pad && p[1] > T.y0 - pad && p[1] < T.y1 + pad;
      const d = Math.hypot(p[0] - T.at[0], p[1] - T.at[1]); const score = inside ? d * .4 : d; if ((inside || d < R) && score < bd) { bd = score; best = T; } }
    // hysteresis: keep the current target unless another is clearly better
    if (drag.snap && best !== drag.snap) { const T = drag.snap, d = Math.hypot(p[0] - T.at[0], p[1] - T.at[1]), inside = p[0] > T.x0 - pad - 14 && p[0] < T.x1 + pad + 14 && p[1] > T.y0 - pad - 14 && p[1] < T.y1 + pad + 14; if ((inside || d < R + 24) && (!best || bd > (inside ? d * .4 : d) * .7)) best = T; }
    return best;
  };
  /* render loop runs every frame while dragging: the line end follows the finger with a short spring,
     and is pulled smoothly into a target's dot when it is close enough (no teleporting) */
  const frame = t => { if (!drag) { raf = 0; return; }
    const dt = Math.min(48, t - (drag.t || t)) || 16; drag.t = t;
    const p = drag.pt, T = drag.moved ? near(p) : null;
    if (T !== drag.snap) { drag.snap && drag.snap.t.classList.remove('hover'); if (T) { T.t.classList.add('hover'); sfx.tap(); navigator.vibrate && navigator.vibrate(6); } drag.snap = T; }
    const goal = T ? [T.at[0] + (p[0] - T.at[0]) * .12, T.at[1] + (p[1] - T.at[1]) * .12] : p; // a little give toward the finger
    const k = 1 - Math.exp(-dt / (T ? 55 : 28)), c = drag.cur || drag.start;
    drag.cur = [c[0] + (goal[0] - c[0]) * k, c[1] + (goal[1] - c[1]) * k]; drag.end = T ? T.at : drag.cur;
    live.setAttribute('class', 'lk-live' + (T ? ' on' : '')); live.setAttribute('d', curve(drag.start, drag.cur)); dot.setAttribute('cx', drag.cur[0]); dot.setAttribute('cy', drag.cur[1]);
    raf = requestAnimationFrame(frame); };
  wrap.addEventListener('pointermove', e => { if (!drag || e.pointerId !== drag.id) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null, last = evs && evs.length ? evs[evs.length - 1] : e;
    drag.pt = [(last.clientX - drag.wr.left) / drag.k, (last.clientY - drag.wr.top) / drag.k];
    if (!drag.moved && Math.hypot(drag.pt[0] - drag.start[0], drag.pt[1] - drag.start[1]) > 3) { drag.moved = true; svg.append(live, dot); }
    if (drag.moved && !raf) raf = requestAnimationFrame(frame); }, { passive: true });
  const end = async e => { if (!drag || e.pointerId !== drag.id) return; const d = drag; drag = null; cancelAnimationFrame(raf); raf = 0;
    if (!d.moved) return; // a tap: stay selected for tap-tap mode
    if (d.snap) { sel = null; const from = d.cur || d.snap.at; await new Promise(res => { const t0 = performance.now(); const st = t => { const k = Math.min(1, (t - t0) / 90), x = from[0] + (d.snap.at[0] - from[0]) * k, y = from[1] + (d.snap.at[1] - from[1]) * k; live.setAttribute('d', curve(d.start, [x, y])); dot.setAttribute('cx', x); dot.setAttribute('cy', y); k < 1 ? requestAnimationFrame(st) : res(); }; requestAnimationFrame(st); });
      await finish(d.it, d.snap.t, d.start, d.snap.at); }
    else { const to = d.cur || d.pt; await retract(d.start, to); } };
  wrap.addEventListener('pointerup', end); wrap.addEventListener('pointercancel', end);
  return { settle, links };
}
function matchBoard(ctx, left, right, opts = {}) {
  // left/right: [{key, node|label}]
  const wrap = h('div', { class: 'match ia' + (opts.rows ? ' mrows' : '') }); /* v187 rows: การ์ดซ้ายเป็นแถวบน การ์ดขวาเป็นแถวล่าง */
  const svg = document.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'lines');
  const L = h('div', { class: 'colm l' }), R = h('div', { class: 'colm r' });
  const make = (it, side) => { const d = h('div', { class: 'mi', 'data-key': it.key, 'data-side': side }); if (it.node) d.append(it.node); else d.innerHTML = /^\d+$/.test(it.label) ? `<span class="num">${it.label}</span>` : it.label; return d; };
  left.forEach(it => L.append(make(it, 'l'))); right.forEach(it => R.append(make(it, 'r')));
  wrap.append(svg, L, R);
  let done = 0;
  linker(wrap, svg, {
    sel: '.mi', dir: opts.rows ? 'v' : 'h',
    anchor: el => { const wr = wrap.getBoundingClientRect(), r = el.getBoundingClientRect(); if (opts.rows) return [r.left + r.width / 2 - wr.left, el.dataset.side === 'l' ? r.bottom - wr.top : r.top - wr.top]; return el.dataset.side === 'l' ? [r.right - wr.left, r.top + r.height / 2 - wr.top] : [r.left - wr.left, r.top + r.height / 2 - wr.top]; },
    canLink: (a, b) => a.dataset.side !== b.dataset.side,
    onLink: (a, b) => {
      const [l, r] = a.dataset.side === 'l' ? [a, b] : [b, a];
      if (l.dataset.key === r.dataset.key) {
        l.classList.add('paired'); r.classList.add('paired'); sfx.pop(done); done++;
        if (done === left.length) ctx.check(true); else ctx.progress && ctx.progress();
        return true;
      }
      [l, r].forEach(x => { x.classList.remove('wrong'); void x.offsetWidth; x.classList.add('wrong'); }); ctx.check(false, opts.hint); return false;
    }
  });
  wrap.addEventListener('click', e => e.stopPropagation());
  return wrap;
}

/* ---------- one-to-one pairing of two rows (comparison) ---------- */
function pairRows(ea, a, eb, b, opts = {}) {
  const wrap = h('div', { class: 'pairs ia' });
  const svg = document.createElementNS(SVGNS, 'svg');
  const rowA = h('div', { class: 'rowp' }), rowB = h('div', { class: 'rowp' });
  for (let i = 0; i < a; i++) rowA.append(h('span', { class: 'pi', 'data-r': 'a' }, art(ea)));
  for (let i = 0; i < b; i++) rowB.append(h('span', { class: 'pi', 'data-r': 'b' }, art(eb)));
  wrap.append(svg, rowA, rowB);
  let n = 0;
  const free = r => [...wrap.querySelectorAll(`.pi[data-r="${r}"]:not(.paired)`)];
  const ctr = el => { const wr = wrap.getBoundingClientRect(), r = el.getBoundingClientRect(); return [r.left + r.width / 2 - wr.left, el.dataset.r === 'a' ? r.bottom - wr.top : r.top - wr.top]; };
  const mark = (x, y) => { x.classList.add('paired'); y.classList.add('paired'); x.classList.remove('sel'); y.classList.remove('sel'); n++; sfx.pop(n);
    if (n === Math.min(a, b)) { [...free('a'), ...free('b')].forEach(el => el.classList.add('left')); opts.onDone && opts.onDone(); } return true; };
  const lk = linker(wrap, svg, { sel: '.pi', dir: 'v', anchor: ctr, canLink: (x, y) => opts.interactive && x.dataset.r !== y.dataset.r, onLink: mark });
  wrap.autoPair = async (delay = 450) => { const A = free('a'), B = free('b'); for (let i = 0; i < Math.min(A.length, B.length); i++) { await sleep(delay); if (!wrap.isConnected) return; mark(A[i], B[i]); lk.settle(A[i], B[i]); } };
  if (!opts.interactive) wrap.style.pointerEvents = 'none';
  wrap.addEventListener('click', e => e.stopPropagation());
  wrap.isDone = () => n === Math.min(a, b);
  return wrap;
}

/* ---------- tracing pad ---------- */
function tracePad(guide, opts = {}) {
  const wide = guide.kind === 'text' && guide.text.length > 2;
  const H = Math.min(opts.h || 300, innerHeight * .4), W = Math.min(wide ? H * 2.1 : H * 1.05, innerWidth * .82);
  const cv = h('canvas', { class: 'pad', style: { width: W + 'px', height: H + 'px' } });
  const msg = h('div', { class: 'pad-msg' }, opts.msg || 'เขียนตามรอยเส้นประนะ');
  let stopAnim = null;
  const pad = new InkPad(cv, { width: Math.max(7, H * .045), color: '#FF6F7D', drawBg: (x, w, hh) => drawGuide(x, w, hh, guide, 'show', opts.level || 0) });
  const tools = h('div', { class: 'pad-tools' },
    guide.kind === 'digit' ? h('button', { class: 'btn sm info', onclick: () => demo() }, icon('play'), 'ดูวิธีเขียน') : null,
    h('button', { class: 'btn sm icon', 'aria-label': 'ย้อน', onclick: () => pad.undo() }, icon('undo')),
    h('button', { class: 'btn sm', onclick: () => { pad.clear(); msg.textContent = 'เขียนตามรอยเส้นประนะ'; } }, icon('eraser'), 'ล้าง'),
    opts.onCheck ? h('button', { class: 'btn sm primary', onclick: () => check() }, icon('check'), 'เสร็จแล้ว') : null);
  const wrap = h('div', { class: 'trace ia' }, cv, tools, msg);
  function demo() {
    pad.clear(); stopAnim && stopAnim(); pad.o.disabled = true;
    stopAnim = animateDigit(cv, guide.d, { onDone: () => { setTimeout(() => { pad.o.disabled = false; pad.resize(); }, 500); } });
  }
  function check() {
    if (!pad.strokes.length) { msg.textContent = 'ลองเขียนก่อนนะ'; return; }
    const r = scoreTrace(pad, guide);
    if (r.pass) msg.textContent = 'สวยมาก!'; else if (r.coverage < .7) msg.textContent = 'เขียนให้ครบทุกเส้นนะ'; else msg.textContent = 'ระวังอย่าออกนอกเส้นประนะ';
    opts.onCheck(r.pass, r);
  }
  wrap.pad = pad;
  return wrap;
}
/* animated writing demo (stroke order) */
function writeDemo(d, size = 220) {
  const cv = h('canvas', { class: 'demo', style: { width: size * .85 + 'px', height: size + 'px' } });
  const btn = h('button', { class: 'btn sm info ia', onclick: e => { e.stopPropagation(); go(); } }, icon('replay'), 'ดูอีกครั้ง');
  let stop = null; const go = () => { stop && stop(); stop = animateDigit(cv, d); };
  requestAnimationFrame(() => setTimeout(go, 300));
  return h('div', { class: 'trace' }, cv, btn);
}

/* =========================================================
   CHAPTER 2 COMPONENTS (addition)
   ========================================================= */
/* number sentence: tokens like [2,'+',3,'=','?'] — '?' becomes a blank slot */
function eqRow(tokens, opts = {}) {
  const el = h('div', { class: 'eq' + (opts.sm ? ' sm' : '') });
  const blanks = [];
  tokens.forEach((t, i) => {
    if (t === '?') { const b = h('span', { class: 'eqb' }, '?'); blanks.push(b); el.append(b); }
    else if (['+', '=', '>', '<', '≠', '−'].includes(t)) el.append(h('span', { class: 'eqo' + (t === '+' ? ' plus' : t === '−' ? ' minus' : '') }, t));
    else el.append(h('span', { class: 'eqn' + (opts.hi && opts.hi.includes(i) ? ' hi' : '') }, String(t)));
  });
  if (opts.labels) { // ตัวตั้ง ตัวบวก/ตัวลบ ผลบวก/ผลลบ
    const sub = opts.labels === 'sub';
    const wrap = h('div', { class: 'eq-wrap' }, el, h('div', { class: 'eq-labels' + (sub ? ' sub' : '') }, h('span', null, 'ตัวตั้ง'), h('span'), h('span', null, sub ? 'ตัวลบ' : 'ตัวบวก'), h('span'), h('span', null, sub ? 'ผลลบ' : 'ผลบวก')));
    wrap.blanks = blanks; wrap.fill = (v, k = 0) => { blanks[k].textContent = v; blanks[k].classList.add('filled'); }; return wrap;
  }
  el.blanks = blanks; el.fill = (v, k = 0) => { blanks[k].textContent = v; blanks[k].classList.add('filled'); };
  return el;
}
/* vertical (ตั้งบวก) layout */
function vertical(a, b, ans, op = '+') {
  return h('div', { class: 'vert' }, h('div', { class: 'vr' }, h('span'), h('span', { class: 'num' }, a)), h('div', { class: 'vr' }, h('span', { class: 'op' + (op === '−' ? ' minus' : '') }, op), h('span', { class: 'num' }, b)),
    h('div', { class: 'vline' }), h('div', { class: 'vr' }, h('span'), h('span', { class: 'num ans' }, ans ?? '?')));
}
/* tile builder: tap tiles to fill slots, e.g. build "1 + 4 = 5" */
function sentenceBuilder(ctx, target, pool, hint) {
  const slots = h('div', { class: 'eq build' }), tiles = h('div', { class: 'tiles' }); const placed = [];
  const S = target.map(() => { const s = h('button', { class: 'eqb tslot' }, ''); slots.append(s); return s; });
  const render = () => S.forEach((s, i) => { s.textContent = placed[i] ? placed[i].v : ''; s.classList.toggle('filled', !!placed[i]); s.classList.toggle('op', !!placed[i] && /[+=−]/.test(placed[i].v)); });
  S.forEach((s, i) => s.onclick = e => { e.stopPropagation(); if (!placed[i] || slots.dataset.done) return; placed[i].c.classList.remove('used'); placed.splice(i, 1); render(); });
  shuffle(pool).forEach(v => {
    const c = h('button', { class: 'tile' + (/[+=−]/.test(v) ? ' op' : '') }, String(v));
    c.onclick = e => { e.stopPropagation(); if (c.classList.contains('used') || placed.length >= target.length) return; placed.push({ v: String(v), c }); c.classList.add('used'); sfx.pop(placed.length); render();
      if (placed.length === target.length) { const ok = placed.every((p, i) => p.v === String(target[i])); if (ok) { slots.dataset.done = 1; ctx.check(true); } else { ctx.check(false, hint); setTimeout(() => { placed.splice(0).forEach(p => p.c.classList.remove('used')); render(); }, 900); } } };
    tiles.append(c);
  });
  return h('div', { class: 'colstack ia' }, slots, tiles);
}
/* domino with pip patterns for 0..9 */
const PIPS = { 0: [], 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8], 7: [0, 2, 3, 4, 5, 6, 8], 8: [0, 1, 2, 3, 5, 6, 7, 8], 9: [0, 1, 2, 3, 4, 5, 6, 7, 8] };
function domino(a, b, opts = {}) {
  const half = (n, c) => { const d = h('div', { class: 'dh' }); for (let i = 0; i < 9; i++) d.append(h('span', null, PIPS[n].includes(i) ? h('i', { class: 'dot ' + c }) : null)); return d; };
  const el = h('div', { class: 'domino' + (opts.v ? ' v' : '') }, half(a, ''), h('div', { class: 'dbar' }), half(b, 'b'));
  return el;
}
/* two-colour ten frame: first a red, then b blue */
function tenFrame2(a, b, opts = {}) { return tenFrame(a + b, { ...opts, color: i => i < a ? '' : 'b' }); }
/* tap cells to place counters (used for "draw the sum") */
function tenToggle(onChange, max = 10) {
  const on = Array(max).fill(false), f = h('div', { class: 'tf tap ia', style: { '--tfw': 'clamp(220px,30vw,320px)' } });
  on.forEach((_, i) => { const c = h('button', { class: 'cell' }); c.onclick = e => { e.stopPropagation(); on[i] = !on[i]; c.innerHTML = on[i] ? '<i class="dot pop"></i>' : ''; sfx.pop(on.filter(Boolean).length); onChange && onChange(on.filter(Boolean).length); }; f.append(c); });
  f.count = () => on.filter(Boolean).length; return f;
}
/* a group in a soft box with caption */
function groupBox(e, n, cap, opts = {}) { const o = objRow(e, n, { pop: opts.pop !== false, max: opts.max || '260px', size: opts.size || 'clamp(40px,5.2vw,62px)', delay0: opts.delay0 }); if (opts.count) makeCountable(o); return h('div', { class: 'box gbox' + (opts.cls ? ' ' + opts.cls : '') }, o, cap ? h('div', { class: 'cap' }, cap) : null); }
/* story strip: [group] → action → [group] */
function storyStrip(e1, a, verb, e2, b) {
  return h('div', { class: 'story' }, groupBox(e1, a, null, { count: true }), h('div', { class: 'verb' }, icon('plus'), h('span', null, verb)), groupBox(e2 || e1, b, null, { count: true, delay0: .5, cls: 'arrive' }));
}

/* ---------- writing practice: several rounds, guide fades each round, last round has no guide ---------- */
function linesBg(x, w, hh) { x.save(); x.strokeStyle = '#ECE5D6'; x.lineWidth = 2; x.setLineDash([6, 8]); x.beginPath(); x.moveTo(10, hh * .14); x.lineTo(w - 10, hh * .14); x.moveTo(10, hh * .86); x.lineTo(w - 10, hh * .86); x.stroke(); x.restore(); }
function practicePad(guide, opts = {}) {
  const rounds = opts.rounds || 4, kindFree = guide.kind === 'digit' ? 'digit' : opts.free; // 'thai' | 'word'
  const target = guide.kind === 'digit' ? guide.d : guide.text;
  const wide = guide.kind === 'text' && guide.text.length > 2;
  const H = Math.min(opts.h || 290, innerHeight * .4), W = Math.min(wide ? H * 2.1 : H * 1.05, innerWidth * .8);
  let r = 0, fails = 0;
  const cv = h('canvas', { class: 'pad', style: { width: W + 'px', height: H + 'px' } });
  const dots = h('div', { class: 'rounds' });
  const msg = h('div', { class: 'pad-msg' });
  const label = h('div', { class: 'round-label' });
  const pad = new InkPad(cv, { width: Math.max(7, H * .045), color: '#FF6F7D', drawBg: (x, w, hh) => { linesBg(x, w, hh); if (r < rounds - 1 && r < 3) drawGuide(x, w, hh, guide, 'show', Math.min(r, 2)); } });
  const ref = h('div', { class: 'ref', style: { display: 'none' } });
  function render() {
    dots.innerHTML = ''; for (let k = 0; k < rounds; k++) dots.append(h('i', { class: k < r ? 'done' : k === r ? 'on' : '' }, k < r ? icon('check') : String(k + 1)));
    const free = r >= rounds - 1;
    label.textContent = r >= rounds ? 'ฝึกครบแล้ว เก่งมาก!' : free ? `ครั้งที่ ${r + 1}: เขียนเองไม่มีเส้นนำ` : `ครั้งที่ ${r + 1}: เขียนตามเส้นประ${r ? (r === 1 ? ' (จางลง)' : ' (จางมาก)') : ''}`;
    msg.textContent = ''; ref.style.display = 'none'; pad.clear();
  }
  function check() {
    if (r >= rounds) return;
    if (!pad.strokes.length) { msg.textContent = 'ลองเขียนก่อนนะ'; return; }
    const free = r >= rounds - 1;
    const ok = free ? freeWriteCheck(pad.strokes, target, kindFree).ok : scoreTrace(pad, guide).pass;
    if (ok) { fails = 0; sfx.ok(); r++; say(r >= rounds ? 'ฝึกครบแล้ว เก่งมาก' : 'เยี่ยม ครั้งต่อไป', true); setTimeout(render, 450); msg.textContent = 'สวยมาก!'; if (r >= rounds) confetti(14); }
    else { fails++; sfx.no(); msg.textContent = free ? 'ยังไม่ค่อยเหมือน ลองเขียนใหม่นะ' : 'เขียนให้ทับเส้นประให้ครบนะ'; if (free && fails >= 2) { ref.textContent = target; ref.style.display = ''; } }
  }
  const tools = h('div', { class: 'pad-tools' },
    guide.kind === 'digit' ? h('button', { class: 'btn sm info', onclick: () => { pad.clear(); pad.o.disabled = true; animateDigit(cv, guide.d, { onDone: () => setTimeout(() => { pad.o.disabled = false; pad.resize(); }, 500) }); } }, icon('play'), 'ดูวิธีเขียน') : null,
    h('button', { class: 'btn sm icon', 'aria-label': 'ย้อน', onclick: () => pad.undo() }, icon('undo')),
    h('button', { class: 'btn sm', onclick: () => { pad.clear(); msg.textContent = ''; } }, icon('eraser'), 'ล้าง'),
    h('button', { class: 'btn sm primary', onclick: check }, icon('check'), 'เสร็จแล้ว'),
    h('button', { class: 'btn sm', onclick: () => { r = 0; fails = 0; render(); } }, icon('replay'), 'ฝึกใหม่'));
  render();
  const wrap = h('div', { class: 'trace practice ia' }, h('div', { class: 'rowstack', style: { gap: '12px' } }, dots, label), h('div', { class: 'pad-holder' }, cv, ref), tools, msg);
  wrap.pad = pad; return wrap;
}
/* ---------- free writing pad (exam): no guide at all ---------- */
function freePad(ctx, target, kind, opts = {}) {
  const wide = kind === 'word' && String(target).length > 2, two = kind !== 'word' && String(target).length > 1;
  const H = Math.min(opts.h || 260, innerHeight * .38), W = Math.min(wide ? H * 2.1 : two ? H * 1.6 : H * 1.15, innerWidth * .8);
  const cv = h('canvas', { class: 'pad', style: { width: W + 'px', height: H + 'px' } });
  const msg = h('div', { class: 'pad-msg' }, 'เขียนในกรอบได้เลย');
  const pad = new InkPad(cv, { width: Math.max(7, H * .045), color: '#2B2550', drawBg: linesBg });
  let fails = 0;
  const ref = h('div', { class: 'ref', style: { display: 'none' } });
  function submit() {
    if (!pad.strokes.length) { msg.textContent = 'เขียนในกรอบก่อนนะ'; return; }
    const r = freeWriteCheck(pad.strokes, String(target), kind);
    if (r.ok) { msg.textContent = 'ถูกต้อง สวยมาก!'; wrap.classList.add('done'); pad.o.disabled = true; ctx.check(true); }
    else {
      fails++; ctx.check(false, opts.hint || 'ลองเขียนใหม่ให้ชัดขึ้นนะ');
      msg.textContent = kind === 'digit' && r.read ? `อ่านได้ว่า ${r.read} ลองใหม่นะ` : 'ยังไม่ค่อยเหมือน ลองเขียนใหม่นะ';
      if (fails >= 2) { ref.textContent = String(target); ref.style.display = ''; msg.textContent = 'ดูตัวอย่างด้านขวา แล้วเขียนใหม่เองนะ'; }
      setTimeout(() => pad.clear(), 700);
    }
  }
  const wrap = h('div', { class: 'trace ia' }, h('div', { class: 'pad-holder' }, cv, ref),
    h('div', { class: 'pad-tools' },
      h('button', { class: 'btn sm icon', 'aria-label': 'ย้อน', onclick: () => pad.undo() }, icon('undo')),
      h('button', { class: 'btn sm', onclick: () => { pad.clear(); msg.textContent = ''; } }, icon('eraser'), 'ล้าง'),
      h('button', { class: 'btn sm primary', onclick: submit }, icon('check'), 'ส่งคำตอบ')), msg);
  return wrap;
}

/* =========================================================
   CHAPTER 3 COMPONENTS (subtraction)
   ========================================================= */
/* a row where the last b items are already crossed out */
function crossedRow(e, a, b, opts = {}) {
  const o = objRow(e, a, { pop: true, max: '460px', size: opts.size || (a <= 6 ? 'clamp(48px,6.4vw,76px)' : 'clamp(40px,5.2vw,62px)') });
  [...o.children].slice(a - b).forEach((x, i) => { x.classList.add('gone'); x.style.animationDelay = (.3 + i * .12) + 's'; });
  return h('div', { class: 'box gbox' }, o);
}
/* tap to take away (cross out) exactly b items */
function removableRow(e, a, b, onStep, onDone) {
  const o = objRow(e, a, { pop: true, max: a > 10 ? '520px' : '460px', size: a <= 6 ? 'clamp(52px,7vw,84px)' : a > 10 ? 'clamp(32px,4vw,48px)' : 'clamp(44px,5.6vw,66px)' }); let k = 0;
  [...o.children].forEach(x => { x.classList.add('tappable', 'ia'); x.onclick = ev => { ev.stopPropagation(); if (x.classList.contains('gone') || k >= b) return; x.classList.add('gone', 'now'); k++; sfx.pop(k); onStep && onStep(k); if (k === b) { setTimeout(() => onDone && onDone(), 350); } }; });
  return h('div', { class: 'box gbox ia' }, o);
}
/* ten frame with the last b of a counters crossed */
function tenCrossed(a, b, w) {
  const f = tenFrame(a, { w: w || 'clamp(200px,26vw,280px)' });
  [...f.querySelectorAll('.dot')].slice(a - b).forEach(d => d.classList.add('x'));
  return f;
}
/* ten frame: tap counters to cross out b */
function tenTapCross(a, b, onDone) {
  const f = tenFrame(a, { w: 'clamp(220px,30vw,320px)' }); f.classList.add('ia'); let k = 0;
  f.querySelectorAll('.dot').forEach(d => { d.parentNode.style.cursor = 'pointer'; d.parentNode.onclick = ev => { ev.stopPropagation(); if (d.classList.contains('x') || k >= b) return; d.classList.add('x'); k++; sfx.pop(k); if (k === b) onDone && onDone(); }; });
  return f;
}

/* =========================================================
   GRADE 2 COMPONENTS — numbers to 1,000
   ========================================================= */
/* base-ten blocks: flats (100), rods (10), cubes (1) — same art style */
const FLAT_SVG = `<svg viewBox="0 0 60 60" class="blk-svg"><rect x="2" y="2" width="56" height="56" rx="3" fill="url(#l-yellow)" stroke="${PAL.yellow[3]}" stroke-width="1.6"/><path d="${[...Array(9)].map((_, i) => `M${2 + (i + 1) * 5.6} 2V58M2 ${2 + (i + 1) * 5.6}H58`).join('')}" stroke="${PAL.yellow[3]}" stroke-width=".7" opacity=".7"/></svg>`;
const ROD_SVG = `<svg viewBox="0 0 8 60" class="blk-svg"><rect x="1" y="2" width="6" height="56" rx="1.5" fill="url(#l-sky)" stroke="${PAL.sky[3]}" stroke-width="1.2"/><path d="${[...Array(9)].map((_, i) => `M1 ${2 + (i + 1) * 5.6}H7`).join('')}" stroke="${PAL.sky[3]}" stroke-width=".7" opacity=".8"/></svg>`;
const CUBE_SVG = `<svg viewBox="0 0 8 8" class="blk-svg"><rect x="1" y="1" width="6" height="6" rx="1.4" fill="url(#g-coral)" stroke="${PAL.coral[3]}" stroke-width="1"/></svg>`;
function baseBlocks(n, opts = {}) {
  const hd = Math.floor(n / 100), t = Math.floor(n / 10) % 10, u = n % 10, th = n >= 1000 ? 1 : 0;
  const w = h('div', { class: 'blocks' + (opts.sm ? ' sm' : '') });
  const grp = (cls, k, svg, lab) => k ? h('div', { class: 'bg ' + cls }, h('div', { class: 'bi' }, [...Array(k)].map((_, i) => h('span', { class: 'b', style: { animationDelay: i * .05 + 's' }, html: svg }))), opts.labels ? h('div', { class: 'cap' }, lab) : null) : null;
  if (th) w.append(h('div', { class: 'bg flat' }, h('div', { class: 'bi' }, [...Array(10)].map(() => h('span', { class: 'b', html: FLAT_SVG }))), opts.labels ? h('div', { class: 'cap' }, '10 ร้อย = 1 พัน') : null));
  else w.append(grp('flat', hd, FLAT_SVG, `${hd} ร้อย`) || '', grp('rod', t, ROD_SVG, `${t} สิบ`) || '', grp('cube', u, CUBE_SVG, `${u} หน่วย`) || '');
  return w;
}
/* place value chart */
function placeChart(n, opts = {}) {
  const k = opts.places || Math.max(3, String(n).length), ds = String(n).padStart(k, '0').split('');
  const names = ['หลักแสน', 'หลักหมื่น', 'หลักพัน', 'หลักร้อย', 'หลักสิบ', 'หลักหน่วย'].slice(-k), cls = ['ht', 'tt', 'th', 'h', 't', 'u'].slice(-k);
  const t = h('div', { class: 'pchart' + (opts.q != null ? ' q' : '') + (k > 3 ? ' p' + k : ''), style: { gridTemplateColumns: `repeat(${k},auto)` } });
  ds.forEach((d, i) => t.append(h('div', { class: 'pc ' + cls[i] + (opts.hi === i || (opts.hi && opts.hi.includes && opts.hi.includes(i)) ? ' on' : '') }, h('div', { class: 'pn' }, names[i]), h('div', { class: 'pd num' }, opts.q === i ? '?' : d), opts.values ? h('div', { class: 'pv num' }, fmt(d * 10 ** (k - 1 - i))) : null)));
  return t;
}
/* objects arranged in circled groups of `step` (skip counting) */
function skipGroups(e, n, step, opts = {}) {
  const w = h('div', { class: 'sgroups' }); const groups = Math.ceil(n / step);
  for (let g = 0; g < groups; g++) {
    const k = Math.min(step, n - g * step), box = h('div', { class: 'sg', 'data-g': g }, objRow(e, k, { size: opts.size || (step >= 10 ? 'clamp(20px,2.3vw,28px)' : 'clamp(26px,3vw,36px)'), max: step >= 10 ? '170px' : step >= 5 ? '150px' : '80px' }));
    if (opts.labels) box.append(h('span', { class: 'sgl num' }, (g + 1) * step));
    w.append(box);
  }
  return w;
}
/* number strip for patterns: values with one or more blanks */
function numStrip(vals, blanks = [], opts = {}) {
  const w = h('div', { class: 'nstrip' });
  vals.forEach((v, i) => w.append(h('div', { class: 'ns' + (blanks.includes(i) ? ' blank' : '') + (opts.hi && opts.hi.includes(i) ? ' hi' : '') }, blanks.includes(i) ? '?' : fmt(v))));
  if (opts.step) w.append(h('div', { class: 'nsstep' }, (opts.step > 0 ? 'เพิ่มขึ้นทีละ ' : 'ลดลงทีละ ') + fmt(Math.abs(opts.step))));
  return w;
}
/* tap-to-sort chips into two bins (even / odd …) */
function sortBins(ctx, items, binA, binB, isA, hint) {
  let sel = null; const placed = new Map();
  const pool = h('div', { class: 'chips pool' }), A = h('div', { class: 'bin' }, h('div', { class: 'bt' }, binA), h('div', { class: 'bc' })), B = h('div', { class: 'bin b' }, h('div', { class: 'bt' }, binB), h('div', { class: 'bc' }));
  const chips = items.map(v => { const c = h('button', { class: 'nchip num' }, fmt(v)); c.onclick = e => { e.stopPropagation(); if (placed.has(v)) { placed.delete(v); pool.append(c); c.classList.remove('sel'); return; } pool.querySelectorAll('.nchip').forEach(x => x.classList.remove('sel')); sel = sel === c ? null : c; c.classList.toggle('sel', !!sel); sfx.tap(); }; pool.append(c); return c; });
  const drop = (bin, a) => e => { e.stopPropagation(); if (!sel) return; const v = +sel.textContent.replace(',', ''); placed.set(v, a); bin.querySelector('.bc').append(sel); sel.classList.remove('sel'); sel = null; sfx.pop(placed.size); };
  A.onclick = drop(A, true); B.onclick = drop(B, false);
  const check = checkButton('ตรวจคำตอบ', () => {
    if (placed.size < items.length) { ctx.check(false, 'ย้ายให้ครบทุกจำนวนก่อนนะ'); return; }
    const wrong = items.filter(v => placed.get(v) !== isA(v));
    if (!wrong.length) ctx.check(true); else { ctx.check(false, hint); wrong.forEach(v => { const c = chips[items.indexOf(v)]; placed.delete(v); pool.append(c); c.classList.add('wrong'); setTimeout(() => c.classList.remove('wrong'), 500); }); }
  });
  return h('div', { class: 'colstack ia' }, h('div', { class: 'cap' }, 'แตะจำนวน แล้วแตะตะกร้า'), pool, h('div', { class: 'rowstack' }, A, B), check);
}

/* =========================================================
   GRADE 3 — ลูกคิด (abacus) for numbers up to 100,000
   ========================================================= */
const ROD_NAMES = ['แสน', 'หมื่น', 'พัน', 'ร้อย', 'สิบ', 'หน่วย'];
const ROD_COL = [['#B9A6F5', '#7E6ED6'], ['#57C27A', '#2E8F4E'], ['#C4E05A', '#8DAA22'], ['#FFD15C', '#D9A21C'], ['#FF9D52', '#D9701E'], ['#FF6F6F', '#C9413F']];
function abacusSVG(n, opts = {}) {
  const k = opts.rods || Math.max(4, String(n).length), ds = String(n).padStart(k, '0').slice(-k).split('').map(Number);
  const cw = 34, W = k * cw + 24, H = 170, base = 132, bh = 11.2, names = ROD_NAMES.slice(-k), cols = ROD_COL.slice(-k);
  let s = `<svg viewBox="0 0 ${W} ${H}" class="abacus-svg" aria-hidden="true"><ellipse cx="${W / 2}" cy="${H - 4}" rx="${W * .46}" ry="4" fill="#2B2550" opacity=".1"/>`;
  ds.forEach((d, i) => {
    const x = 12 + cw * i + cw / 2, [c, c2] = cols[i], hi = opts.hi === i;
    s += `<g class="rod" data-i="${i}">${hi ? `<rect x="${x - 16}" y="6" width="32" height="${base - 2}" rx="12" fill="#FFF3B0" opacity=".9"/>` : ''}<rect x="${x - 16}" y="4" width="32" height="${base}" fill="transparent"/>
      <rect x="${x - 1.8}" y="12" width="3.6" height="${base - 12}" rx="1.8" fill="#CDBB9A"/><circle cx="${x}" cy="12" r="3.4" fill="#E3D3B4"/>`;
    const pv = opts.prev ? opts.prev[i] : null; // v112 (ผู้ใช้ขอ): with opts.prev only the beads that came or went move — the rest stay still
    for (let b = 0; b < Math.max(d, pv ?? 0); b++) { const y = base - 3 - (b + 1) * bh, bc = pv == null ? '' : b >= d ? ' gone' : b >= pv ? ' fresh' : ' still'; s += `<g class="bead${bc}" data-b="${b}" style="animation-delay:${pv == null ? (i * 9 + b) * 18 : (b - Math.min(d, pv)) * 40}ms"><rect x="${x - 13}" y="${y}" width="26" height="${bh - 1}" rx="${(bh - 1) / 2}" fill="${c}"/><rect x="${x - 13}" y="${y + bh * .55}" width="26" height="${bh * .45 - 1}" rx="3" fill="${c2}" opacity=".45"/><rect x="${x - 9}" y="${y + 1.6}" width="12" height="2.6" rx="1.3" fill="#fff" opacity=".55"/></g>`; }
    s += `</g>`;
  });
  s += `<rect x="4" y="${base}" width="${W - 8}" height="30" rx="9" fill="#F6E7C4"/><rect x="4" y="${base}" width="${W - 8}" height="5" rx="2.5" fill="#E9D3A6"/>`;
  if (opts.labels !== false) names.forEach((nm, i) => { s += `<text x="${12 + cw * i + cw / 2}" y="${base + 21}" text-anchor="middle" font-family="'IBM Plex Sans Thai Looped',sans-serif" font-weight="600" font-size="${nm.length > 5 ? 8 : nm.length > 3 ? 9.5 : 11}" fill="#6B5A3A">${nm}</text>`; });
  return s + '</svg>';
}
function abacus(n, opts = {}) { return h('div', { class: 'abacus' + (opts.sm ? ' sm' : ''), html: abacusSVG(n, opts) }); }

/* =========================================================
   GRADE 1 · CHAPTER 4 — 11 to 20 (two ten frames, bundles of sticks)
   ========================================================= */
function twoFrames(n, opts = {}) {
  const w = opts.w || 'clamp(170px,22vw,250px)';
  return h('div', { class: 'tf2' }, tenFrame(Math.min(n, 10), { w, pop: opts.pop }), tenFrame(Math.max(0, n - 10), { w, pop: opts.pop, from: 0, color: () => 'b' }));
}
/* tap any cell: below the count removes the last dot, above it adds one — always fills the first frame first */
function frameBuilder(n0 = 0, opts = {}) {
  let n = n0; const max = opts.max || 20, w = opts.w || 'clamp(170px,22vw,250px)';
  const frames = [h('div', { class: 'tf ia', style: { '--tfw': w } }), h('div', { class: 'tf ia', style: { '--tfw': w } })];
  const cells = [];
  frames.forEach((f, k) => { for (let i = 0; i < 10; i++) { const c = h('button', { class: 'tfc', 'aria-label': 'ช่อง' }); c.onclick = e => { e.stopPropagation(); set(k * 10 + i < n ? n - 1 : n + 1); }; f.append(c); cells.push(c); } });
  const icon = opts.icon ? HEART(true) : null;
  function draw() { cells.forEach((c, i) => { const on = i < n; if (on !== !!c.firstChild) { c.innerHTML = ''; if (on) c.append(icon ? h('i', { class: 'hrt', html: icon }) : h('i', { class: 'dot pop' + (i >= 10 ? ' b' : '') })); } }); }
  function set(v) { v = Math.max(0, Math.min(max, v)); if (v === n) { sfx.no(); return; } n = v; draw(); sfx.pop(n); opts.onChange && opts.onChange(n); }
  draw();
  const el = h('div', { class: 'tf2' }, ...frames); el.set = set; el.value = () => n;
  return el;
}
/* bundles of ten sticks (มัดไม้) + loose sticks */
const STICK = (x, c = '#E7B57F', c2 = '#C98E55') => `<rect x="${x}" y="4" width="7" height="72" rx="3.5" fill="${c}"/><rect x="${x + 4.4}" y="4" width="2.6" height="72" rx="1.3" fill="${c2}" opacity=".6"/><ellipse cx="${x + 3.5}" cy="5" rx="3.5" ry="2" fill="#F8E0C2"/>`;
function bundleSVG() { let s = ''; for (let i = 0; i < 10; i++) s += STICK(6 + i * 6.2); return `<svg viewBox="0 0 76 80" class="bundle">${s}<rect x="2" y="34" width="72" height="11" rx="5.5" fill="url(#g-coral)"/><path d="M38 34 l-8 -8 M38 34 l8 -8" stroke="#E5505E" stroke-width="3" stroke-linecap="round"/></svg>`; }
function sticks(n, opts = {}) {
  const w = h('div', { class: 'sticks' + (opts.sm ? ' sm' : '') });
  const b = Math.floor(n / 10), u = n % 10;
  for (let i = 0; i < b; i++) w.append(h('span', { class: 'bd', html: bundleSVG() }));
  if (u) w.append(h('span', { class: 'loose', html: `<svg viewBox="0 0 ${u * 13 + 4} 80">${range(0, u - 1).map(i => STICK(4 + i * 13)).join('')}</svg>` }));
  if (opts.labels) w.append(h('div', { class: 'cap' }, b && u ? `${b} มัด กับ ${u} อัน` : b ? `${b} มัด` : `${u} อัน`));
  return w;
}
function table20(nums = range(11, 20), opts = {}) {
  return h('table', { class: 'tbl t20' }, h('tr', null, h('th', null, 'ฮินดูอารบิก'), h('th', null, 'ตัวเลขไทย'), h('th', null, 'ตัวหนังสือ')),
    nums.map((n, i) => h('tr', { class: opts.hi === n ? 'hi' : '', style: { animation: `rise .35s var(--ease) ${i * .05}s both` } }, h('td', null, h('b', null, n)), h('td', null, thai(n)), h('td', null, WORD[n]))));
}

/* =========================================================
   GRADE 1 · CHAPTER 6 — picture graphs and tally marks
   data = [{ label, e, n }] · e is an ART key
   ========================================================= */
/* picture graph: horizontal rows (default) or vertical columns */
function pictoChart(data, opts = {}) {
  const v = opts.orient === 'v', max = opts.max || Math.max(...data.map(d => d.n), 1), keyE = opts.keyE || (new Set(data.map(d => d.e)).size === 1 ? data[0].e : null);
  const w = h('div', { class: 'pchartx' + (v ? ' v' : ' hz') + (opts.sm ? ' sm' : '') });
  if (opts.title) w.append(h('div', { class: 'pc-title' }, opts.title));
  const grid = h('div', { class: 'pc-grid', style: v ? { gridTemplateColumns: `repeat(${data.length},1fr)` } : null });
  data.forEach((d, i) => {
    const cells = h('div', { class: 'pc-cells' + (opts.hl && opts.hl.includes(i) ? ' hl' : ''), style: { '--max': max } });
    for (let k = 0; k < (opts.slots ? max : d.n); k++) cells.append(h('span', { class: 'pc-ic' + (k >= d.n ? ' off' : ''), style: { animationDelay: (opts.anim === false ? 0 : (i * .12 + k * .04)) + 's' } }, art(d.e)));
    const lab = h('div', { class: 'pc-lab' }, d.label);
    const row = h('div', { class: 'pc-row', 'data-i': i }, ...(v ? [cells, lab] : [lab, cells]));
    if (opts.counts) row.append(h('b', { class: 'pc-n num' }, d.n));
    grid.append(row);
  });
  w.append(grid);
  if (opts.key !== false) w.append(h('div', { class: 'pc-key' }, 'กำหนดให้ ', keyE ? h('span', { class: 'pc-ic k' }, art(keyE)) : '1 รูป', ` แทนจำนวน${opts.unitName || ''} 1 ${opts.unit || 'ชิ้น'}`));
  w.rows = [...grid.children];
  return w;
}
/* mixed pictures scattered in a box practice; tap marks a picture as counted */
function mixField(data, opts = {}) {
  const items = shuffle(data.flatMap(d => range(1, d.n).map(() => d.e))), n = items.length;
  const cols = Math.ceil(Math.sqrt(n * 2)), rows = Math.ceil(n / cols);
  const f = h('div', { class: 'mixfield' + (opts.tap ? ' ia' : ''), style: { gridTemplateColumns: `repeat(${cols},1fr)` } });
  items.forEach((e, i) => { const o = h('span', { class: 'mf-ic pop', style: { animationDelay: i * .03 + 's', transform: `translate(${rnd(-6, 6)}px,${rnd(-6, 6)}px) rotate(${rnd(-12, 12)}deg)` } }, art(e)); o.dataset.e = e;
    if (opts.tap) o.onclick = ev => { ev.stopPropagation(); o.classList.toggle('done'); sfx.tap(); opts.onTap && opts.onTap(e, o.classList.contains('done')); };
    f.append(o); });
  return f;
}
/* tally marks: groups of five (four bars + one across) */
function tallySVG(n, opts = {}) {
  const groups = Math.floor(n / 5), rest = n % 5, gw = 46, H = 40; let x = 4, s = '';
  const bar = (x0) => `<path d="M${x0} 6 v28" stroke="#2B2550" stroke-width="3.2" stroke-linecap="round"/>`;
  for (let g = 0; g < groups; g++) { for (let k = 0; k < 4; k++) s += bar(x + 6 + k * 8); s += `<path d="M${x} 28 L${x + 38} 10" stroke="#FF6F7D" stroke-width="3.2" stroke-linecap="round"/>`; x += gw + 6; }
  for (let k = 0; k < rest; k++) s += bar(x + 6 + k * 8);
  const W = Math.max(30, x + (rest ? rest * 8 + 8 : 0));
  return `<svg viewBox="0 0 ${W} ${H}" class="tally" style="width:${W * (opts.scale || 1)}px" aria-hidden="true">${s}</svg>`;
}
function tally(n, opts = {}) { return h('span', { class: 'tallyw', html: tallySVG(n, opts) }); }
/* tap-to-add tally builder */
function tallyBuilder(onChange, opts = {}) {
  let n = opts.start || 0; const vis = h('div', { class: 'tb-vis' }), cnt = h('b', { class: 'num tb-n' }, n);
  const draw = () => { vis.innerHTML = tallySVG(n, { scale: 1.3 }); cnt.textContent = n; };
  const add = d => { const v = Math.max(0, Math.min(opts.max || 25, n + d)); if (v === n) return; n = v; draw(); sfx.pop(n); if (d > 0 && n % 5 === 0) say(`ครบ ${WORD[n]} ขีดฆ่าเป็นกลุ่มละห้า`, true); onChange && onChange(n); };
  draw();
  const el = h('div', { class: 'tb ia' }, h('div', { class: 'tb-box' }, vis), h('div', { class: 'rowstack' }, h('button', { class: 'btn icon sm ia', 'aria-label': 'ลบขีด', onclick: e => { e.stopPropagation(); add(-1); } }, PM_('-')), h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); add(1); } }, PM_('+'), 'ขีดเพิ่ม'), opts.showCount ? cnt : null));
  el.value = () => n; return el;
}
const PM_ = k => h('span', { html: `<svg viewBox="0 0 24 24" class="ic" style="width:24px;height:24px;stroke-width:3"><path d="M5 12h14${k === '+' ? 'M12 5v14' : ''}"/></svg>` });
/* tap-to-colour picture graph builder practice */
function pictoBuilder(data, opts = {}) {
  const max = opts.max || Math.max(...data.map(d => d.n)) + 1, st = data.map(() => 0);
  const w = h('div', { class: 'pchartx build ' + (opts.orient === 'v' ? 'v' : 'hz') });
  if (opts.title) w.append(h('div', { class: 'pc-title' }, opts.title));
  const grid = h('div', { class: 'pc-grid', style: opts.orient === 'v' ? { gridTemplateColumns: `repeat(${data.length},1fr)` } : null });
  data.forEach((d, i) => {
    const cells = h('div', { class: 'pc-cells', style: { '--max': max } }), cs = [];
    for (let k = 0; k < max; k++) { const c = h('button', { class: 'pc-ic slot', 'aria-label': d.label }, art(d.e)); c.onclick = e => { e.stopPropagation(); st[i] = k < st[i] ? k : k + 1; cs.forEach((x, j) => x.classList.toggle('on', j < st[i])); sfx.pop(st[i]); opts.onChange && opts.onChange(i, st[i]); }; cells.append(c); cs.push(c); }
    const lab = h('div', { class: 'pc-lab' }, d.label);
    grid.append(h('div', { class: 'pc-row' }, ...(opts.orient === 'v' ? [cells, lab] : [lab, cells])));
  });
  w.append(grid, h('div', { class: 'cap' }, 'แตะช่อง = ระบายสีถึงช่องนั้น · แตะช่องที่ระบายแล้ว = ลดลง'));
  w.values = () => [...st]; return w;
}

/* =========================================================
   GRADE 1 · CHAPTER 7 — weight: pan balance + spring scales
   ========================================================= */
/* pan balance. side = { e: art key, n: count }; tilt follows wL vs wR (heavier side goes down) */
function balance(L, R, opts = {}) {
  const el = h('div', { class: 'bal' + (opts.sm ? ' sm' : '') });
  const beam = h('div', { class: 'bal-beam' }), pl = h('div', { class: 'bal-pan l' }), pr = h('div', { class: 'bal-pan r' });
  const fill = (pan, side) => { pan.querySelector('.bal-items')?.remove(); const it = h('div', { class: 'bal-items' }); (side.list || range(1, side.n || 0).map(() => side.e)).forEach((e, i) => { const a = h('span', { class: 'bal-it', style: { animationDelay: i * .04 + 's' } }, art(e)); it.append(a); }); pan.prepend(it); };
  pl.append(h('i', { class: 'dish' })); pr.append(h('i', { class: 'dish' }));
  beam.append(pl, pr);
  el.append(h('div', { class: 'bal-base', html: `<svg viewBox="0 0 120 92" aria-hidden="true"><path d="M60 6 L112 86 H8 Z" fill="url(#g-yellow)" stroke="${PAL.yellow[3]}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="60" cy="20" r="7" fill="#fff" stroke="${PAL.yellow[3]}" stroke-width="2.4"/><circle cx="50" cy="58" r="3" fill="#2B2550"/><circle cx="70" cy="58" r="3" fill="#2B2550"/><path d="M56 66 q4 4 8 0" fill="none" stroke="#2B2550" stroke-width="2" stroke-linecap="round"/><ellipse cx="42" cy="66" rx="4" ry="2.4" fill="#FF8FA3" opacity=".55"/><ellipse cx="78" cy="66" rx="4" ry="2.4" fill="#FF8FA3" opacity=".55"/></svg>` }), beam);
  if (opts.labels) el.append(h('div', { class: 'bal-lab l' }, opts.labels[0]), h('div', { class: 'bal-lab r' }, opts.labels[1]));
  el.set = (l, r, wl, wr) => { fill(pl, l); fill(pr, r); const d = (wr ?? (r.w ?? r.n)) - (wl ?? (l.w ?? l.n)), t = d === 0 ? 0 : Math.sign(d) * Math.min(13, 5 + Math.abs(d) * 2); el.style.setProperty('--tilt', t + 'deg'); };
  el.set(L, R, opts.wl, opts.wr);
  return el;
}
/* spring scale (เครื่องชั่งสปริง). unit 'kg': one turn = 8 kg (0–7 labelled) · unit 'kd' (ขีด): one turn = 4 kg = 40 ขีด, labels 0–3 kg with 10 ขีด ticks between */
/* rotate an svg needle with the SVG transform attribute (same pivot in every browser — CSS transform-origin on svg differs on iPad Safari) */
function needleTo(g, a0, a1, cx, cy, ms = 600) { if (!g) return; const set = a => g.setAttribute('transform', `rotate(${a} ${cx} ${cy})`);
  if (g.__raf) cancelAnimationFrame(g.__raf); if (ms <= 0 || REDUCED() || a0 === a1) { set(a1); return; }
  const t0 = performance.now(), over = a1 + (a1 >= a0 ? 5 : -5), step = t => { const k = Math.min(1, (t - t0) / ms);
    set(k < .7 ? a0 + (over - a0) * (1 - Math.pow(1 - k / .7, 2)) : over + (a1 - over) * ((k - .7) / .3)); if (k < 1) g.__raf = requestAnimationFrame(step); };
  g.__raf = requestAnimationFrame(step); }
function scaleSVG(v, unit = 'kg', col = 'sky') {
  const kd = unit === 'kd', full = kd ? 40 : 8, sub = kd ? 1 : 2, cx = 60, cy = 92, R = 36, ticks = [];
  for (let j = 0; j < full * sub; j++) { const i = j / sub, a = i / full * Math.PI * 2 - Math.PI / 2, major = kd ? j % 10 === 0 : j % sub === 0, mid = kd ? j % 5 === 0 && !major : false, r1 = R - (major ? 7 : mid ? 5 : 3.2);
    ticks.push(`<line x1="${(cx + Math.cos(a) * r1).toFixed(2)}" y1="${(cy + Math.sin(a) * r1).toFixed(2)}" x2="${(cx + Math.cos(a) * (R - 1)).toFixed(2)}" y2="${(cy + Math.sin(a) * (R - 1)).toFixed(2)}" stroke="#2B2550" stroke-width="${major ? 1.8 : mid ? 1.3 : .9}" stroke-linecap="round"/>`);
    if (major) { const lab = kd ? j / 10 : i, rr = R - 14; ticks.push(`<text x="${(cx + Math.cos(a) * rr).toFixed(2)}" y="${(cy + Math.sin(a) * rr + 3.4).toFixed(2)}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="${kd ? 9.5 : 8.5}" fill="#2B2550">${lab}</text>`); } }
  const ang = (v % full) / full * 360;
  return `<svg viewBox="0 0 120 150" class="scale-svg" aria-hidden="true"><ellipse cx="60" cy="146" rx="40" ry="3.5" fill="#2B2550" opacity=".1"/>
    <path d="M34 128 h52 l8 16 h-68 z" fill="url(#g-${col})" stroke="${PAL[col][3]}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="52" y="44" width="16" height="14" rx="3" fill="url(#g-${col})" stroke="${PAL[col][3]}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${R + 8}" fill="url(#g-${col})" stroke="${PAL[col][3]}" stroke-width="2.2"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="#FFFEFB" stroke="${PAL[col][3]}" stroke-width="1.4"/>
    <text x="${cx}" y="${cy + 13}" text-anchor="middle" font-family="IBM Plex Sans Thai Looped,sans-serif" font-weight="700" font-size="5" fill="#8A84A3">กิโลกรัม</text>
    ${ticks.join('')}
    <g class="needle" transform="rotate(${ang} ${cx} ${cy})"><path d="M${cx} ${cy + 6} L${cx - 2.4} ${cy} L${cx} ${cy - R + 6} L${cx + 2.4} ${cy} Z" fill="#E5505E"/></g>
    <circle cx="${cx}" cy="${cy}" r="3.6" fill="#2B2550"/>
    <rect x="18" y="36" width="84" height="9" rx="4.5" fill="url(#g-${col})" stroke="${PAL[col][3]}" stroke-width="2"/></svg>`;
}
/* scale with objects on the plate. o = { v, unit, e, n, col, interactive, onSet } */
function springScale(o) {
  const el = h('div', { class: 'sscale' + (o.sm ? ' sm' : '') + (o.interactive ? ' ia' : '') });
  const top = h('div', { class: 'ss-top' }), dial = h('div', { class: 'ss-dial', html: scaleSVG(o.v || 0, o.unit, o.col || 'sky') });
  const items = o.list || range(1, o.n || 0).map(() => o.e);
  items.forEach((e, i) => top.append(h('span', { class: 'ss-it', style: { animationDelay: i * .05 + 's' } }, art(e))));
  el.append(top, dial); if (o.label) el.append(h('div', { class: 'ss-lab' }, o.label));
  const needle = () => dial.querySelector('.needle'), full = o.unit === 'kd' ? 40 : 8;
  let cur = o.v || 0;
  el.setValue = (v, anim = true) => { const prev = cur; cur = v; needleTo(needle(), (prev % full) / full * 360, (v % full) / full * 360, 60, 92, anim ? 650 : 0); };
  el.setItems = list => { top.innerHTML = ''; list.forEach(e => top.append(h('span', { class: 'ss-it' }, art(e)))); };
  el.value = () => cur;
  if (o.interactive) { // drag / tap the dial to set the needle
    const svgEl = dial.querySelector('svg'); let down = false;
    const pick = e => { const r = svgEl.getBoundingClientRect(), sx = r.width / 120, x = (e.clientX - r.left) / sx - 60, y = (e.clientY - r.top) / sx - 92;
      let a = Math.atan2(y, x) + Math.PI / 2; if (a < 0) a += Math.PI * 2; const v = Math.round(a / (Math.PI * 2) * full) % full;
      if (v !== cur) { el.setValue(v, false); sfx.tap(); o.onSet && o.onSet(v); } };
    svgEl.style.touchAction = 'none'; svgEl.style.cursor = 'pointer';
    svgEl.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); down = true; try { svgEl.setPointerCapture(e.pointerId); } catch (_) {} pick(e); });
    svgEl.addEventListener('pointermove', e => { if (down) pick(e); });
    svgEl.addEventListener('pointerup', () => { down = false; }); svgEl.addEventListener('pointercancel', () => { down = false; });
  }
  return el;
}
const kdText = n => n >= 10 ? `${Math.floor(n / 10)} กิโลกรัม${n % 10 ? ` ${n % 10} ขีด` : ''}` : `${n} ขีด`;

/* =========================================================
   GRADE 1 · CHAPTER 8 — position & order
   ========================================================= */
/* a row of kids with name tags (viewer's left → right) */
function lineup(names, opts = {}) {
  const w = h('div', { class: 'lineup' + (opts.sm ? ' sm' : '') });
  names.forEach((nm, i) => { const k = h('div', { class: 'lu-kid' + (opts.hl && opts.hl.includes(i) ? ' on' : ''), 'data-i': i }, h('span', { class: 'lu-fig' }, art('kid' + ((opts.looks ? opts.looks[i] : i) % 12))), h('b', { class: 'lu-tag' }, nm));
    if (opts.badge) k.append(h('i', { class: 'lu-badge' }, opts.badge(i))); w.append(k); });
  w.kids = [...w.children]; return w;
}
/* 3×3 class photo: row 0 = back (top of picture), row 2 = front */
function kidGrid(rows, opts = {}) {
  const w = h('div', { class: 'kgrid' });
  rows.forEach((r, ri) => r.forEach((nm, ci) => w.append(h('div', { class: 'lu-kid' + (opts.hl && opts.hl.includes(nm) ? ' on' : ''), 'data-n': nm }, h('span', { class: 'lu-fig' }, art('kid' + ((ri * 3 + ci + (opts.shift || 0)) % 12))), h('b', { class: 'lu-tag' }, nm)))));
  return h('div', { class: 'kgrid-wrap' }, h('div', { class: 'kg-dir back' }, 'ข้างหลัง'), w, h('div', { class: 'kg-dir front' }, 'ข้างหน้า'));
}
/* shelf: rows from the bottom (ชั้นที่ 1 = bottom), 3 columns ซ้าย กลาง ขวา */
function shelf(rows, opts = {}) {
  const w = h('div', { class: 'shelf' });
  [...rows].reverse().forEach((r, k) => { const ri = rows.length - 1 - k;
    w.append(h('div', { class: 'sh-lab' }, `ชั้นที่ ${ri + 1}`), ...r.map((e, ci) => h('div', { class: 'sh-cell' + (opts.hl && opts.hl[0] === ri && opts.hl[1] === ci ? ' on' : ''), 'data-r': ri, 'data-c': ci }, art(e)))); });
  return h('div', { class: 'shelf-wrap' }, w, h('div', { class: 'sh-cols' }, h('span'), h('span', null, 'ข้างซ้าย'), h('span', null, 'ตรงกลาง'), h('span', null, 'ข้างขวา')));
}
/* race lanes: racers [{ name, e, pos (0..1) }] — finish line on the right */
function raceTrack(racers, opts = {}) {
  const w = h('div', { class: 'race' + (opts.sm ? ' sm' : '') });
  racers.forEach((r, i) => w.append(h('div', { class: 'rc-lane' }, h('b', { class: 'rc-no num' }, i + 1), h('div', { class: 'rc-run', style: { '--x': (r.pos ?? 0) } }, h('span', { class: 'rc-fig' }, art(r.e)), h('b', { class: 'rc-name' }, r.name)))));
  w.append(h('div', { class: 'rc-finish' }));
  w.runners = [...w.querySelectorAll('.rc-run')]; return w;
}
const ORD = n => `อันดับที่ ${n}`;

/* =========================================================
   GRADE 1 · CHAPTER 9 — solids, shapes, tracing, repeating patterns
   ========================================================= */
function solidEl(v, cls = '') { return h('span', { class: 'solid ' + cls, 'data-v': v, html: `<svg viewBox="0 0 64 64" aria-hidden="true">${solidSVG(v)}</svg>` }); }
function shapeEl(v, o = {}) { return h('span', { class: 'shp ' + (o.cls || ''), 'data-v': v, html: `<svg viewBox="0 0 64 64" aria-hidden="true">${shapeSVG(v, o.p, o)}</svg>` }); }
/* pattern token: "<kind>[.<colour>][.s]" — kinds: sq ci tri el rect (shapes) or any ART key; ".s" = small */
const TOK_SHAPE = { sq: 'square', ci: 'circle', tri: 'tri', el: 'ellipse', rect: 'rect' };
function tokEl(t) {
  const [k, c, sz] = t.split('.'), small = c === 's' || sz === 's', col = c && c !== 's' ? c : null;
  const svg = TOK_SHAPE[k] ? shapeSVG(TOK_SHAPE[k], col || 'sky') : (ART[k] || ART.star);
  return h('span', { class: 'tok' + (small ? ' s' : ''), 'data-t': t, html: `<svg viewBox="0 0 64 64" aria-hidden="true">${svg}</svg>` });
}
function patStrip(toks, o = {}) {
  const w = h('div', { class: 'pstrip' + (o.sm ? ' sm' : '') });
  toks.forEach((t, i) => w.append(o.blank && o.blank.includes(i) ? h('span', { class: 'tok blank' }, '?') : tokEl(t)));
  return w;
}
/* smallest repeating unit of a sequence */
function patUnit(seq) { for (let L = 1; L <= seq.length / 2; L++) if (seq.every((t, i) => t === seq[i % L])) return seq.slice(0, L); return seq; }
/* scene of scattered solids or shapes; items: [{ v, x, y, s, rot }] (percent positions) */
function scatterScene(items, o = {}) {
  const w = h('div', { class: 'scene' + (o.cls ? ' ' + o.cls : ''), style: { aspectRatio: o.ratio || '16 / 9' } });
  items.forEach((it, i) => { const el = o.kind === 'shape' ? shapeEl(it.v, { rot: it.rot, outline: o.outline, p: it.p }) : o.kind === 'art' ? h('span', { class: 'solid', html: artHTML(it.v) }) : solidEl(it.v);
    el.classList.add('sc-it'); el.dataset.i = i; Object.assign(el.style, { left: it.x + '%', top: it.y + '%', width: (it.s || 14) + '%' }); if (o.outline && o.kind !== 'shape') el.classList.add('ghost'); w.append(el); });
  return w;
}
/* tracing pad: trace around a shape template (dotted) or an object placed on the paper */
function traceBoard(v, o = {}) {
  const box = h('div', { class: 'tracebox' }), cv = h('canvas', { class: 'pad trace' });
  const W = () => cv.getBoundingClientRect().width, H = () => cv.getBoundingClientRect().height;
  const geo = () => { const S = Math.min(W(), H()) * .82 / 64; return { S, ox: (W() - 64 * S) / 2, oy: (H() - 64 * S) / 2 }; };
  const toPx = ([x, y]) => { const g = geo(); return { x: g.ox + x * g.S, y: g.oy + y * g.S }; };
  let objLayer = null;
  if (o.obj) { objLayer = h('span', { class: 'tr-obj', style: { width: `calc(82% * ${o.sc || 1})` }, html: artHTML(o.obj) }); box.append(objLayer); }
  box.append(cv);
  const pad = new InkPad(cv, { width: 6, color: o.color || PAL.sky[3],
    drawBg(x, w, hh) { if (o.obj && !box.classList.contains('lifted')) return; const g = geo(); x.save(); x.translate(g.ox, g.oy); x.scale(g.S, g.S);
      const p = new Path2D(shapeOutline(v)); x.lineWidth = 2.2 / g.S * 1.4; x.strokeStyle = box.classList.contains('lifted') ? 'rgba(43,37,80,.35)' : '#B7AFCD'; x.setLineDash([5 / g.S * 1.4, 6 / g.S * 1.4]); x.lineCap = 'round'; x.stroke(p); x.restore(); },
    onStroke: () => o.onStroke && o.onStroke() });
  box.pad = pad;
  box.score = () => {
    const S = geo().S, tol = Math.max(16, 7 * S), ref = shapePoints(v, 64).map(toPx), dense = shapePoints(v, 200).map(toPx);
    const pts = pad.strokes.flatMap(s => s.pts); if (pts.length < 8) return { cov: 0, prec: 0 };
    const near = (p, set, t) => set.some(q => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < t * t);
    const cov = ref.filter(r => near(r, pts, tol)).length / ref.length, prec = pts.filter(p => near(p, dense, tol * 1.6)).length / pts.length;
    return { cov, prec };
  };
  box.lift = () => { box.classList.add('lifted'); pad.redraw(); };
  box.demo = async () => { // animated pencil drawing the outline (teaching)
    const ref = shapePoints(v, 90).map(toPx); ref.push(ref[0]); pad.clear(); const s = { pts: [], color: o.color || PAL.coral[2], width: 6 }; pad.strokes.push(s);
    for (let i = 0; i < ref.length; i++) { s.pts.push(ref[i]); pad.redraw(); if (i % 2) await sleep(16); }
  };
  return box;
}
/* sides and corners of a polygon: tap each side / corner to count it */
function sideCounter(v, o = {}) {
  const P = SHAPE_PTS[v], k = SHAPE_KIND(v), col = PAL[o.p || mixCol()];
  const svg = `<svg viewBox="-6 -6 76 76" class="sidec" aria-hidden="true"><path d="${shapeOutline(v)}" fill="${col[0]}" stroke="none"/>` +
    (P ? P.map((p, i) => { const q = P[(i + 1) % P.length]; return `<line class="sd" data-i="${i}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/><line class="sdhit" data-i="${i}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`; }).join('') + P.map((p, i) => `<circle class="cn" data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="1.5"/><circle class="cnhit" data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="9"/>`).join('')
       : `<path d="${shapeOutline(v)}" fill="none" stroke="${col[3]}" stroke-width="2.4"/>`) + '</svg>';
  const w = h('div', { class: 'sidew ia', html: svg }), out = h('div', { class: 'sidecount' }, h('span', null, 'ด้าน ', h('b', { class: 'num' }, '0')), h('span', null, 'มุม ', h('b', { class: 'num' }, '0')));
  let ns = 0, nc = 0; const [bs, bc] = out.querySelectorAll('b');
  w.querySelectorAll('.sdhit').forEach(l => l.addEventListener('click', e => { e.stopPropagation(); const sd = w.querySelector(`.sd[data-i="${l.dataset.i}"]`); if (sd.classList.contains('on')) return; sd.classList.add('on'); ns++; bs.textContent = ns; sfx.pop(ns); say(`ด้านที่ ${WORD[ns]}`, true); o.onChange && o.onChange(ns, nc); }));
  w.querySelectorAll('.cnhit').forEach(c => c.addEventListener('click', e => { e.stopPropagation(); const cn = w.querySelector(`.cn[data-i="${c.dataset.i}"]`); if (cn.classList.contains('on')) return; cn.classList.add('on'); nc++; bc.textContent = nc; sfx.pop(nc + 3); say(`มุมที่ ${WORD[nc]}`, true); o.onChange && o.onChange(ns, nc); }));
  w.counts = () => [ns, nc];
  return h('div', { class: 'colstack' }, w, P ? out : h('div', { class: 'cap' }, 'ขอบโค้งรอบรูป ไม่มีด้านตรง ไม่มีมุม'));
}

/* =========================================================
   GRADE 1 · CHAPTER 10 — tens rods + unit cubes, hundred chart
   ========================================================= */
/* P1 base-ten picture: only rods (tens) and cubes — 100 = ten rods */
function tensOnes(n, o = {}) {
  const t = Math.floor(n / 10), u = n % 10, w = h('div', { class: 'blocks p1' + (o.sm ? ' sm' : '') });
  if (t) w.append(h('div', { class: 'bg rod' }, h('div', { class: 'bi' }, [...Array(t)].map((_, i) => h('span', { class: 'b', style: { animationDelay: i * .04 + 's' }, html: ROD_SVG }))), o.labels ? h('div', { class: 'cap' }, `${t} สิบ`) : null));
  if (u) w.append(h('div', { class: 'bg cube' }, h('div', { class: 'bi' }, [...Array(u)].map((_, i) => h('span', { class: 'b', style: { animationDelay: (t + i) * .04 + 's' }, html: CUBE_SVG }))), o.labels ? h('div', { class: 'cap' }, `${u} หน่วย`) : null));
  return w;
}
/* baskets of ten practice */
function baskets(e, n, o = {}) {
  const w = h('div', { class: 'baskets' }), full = Math.floor(n / 10), rest = n % 10;
  for (let k = 0; k < full + (rest ? 1 : 0); k++) { const m = k < full ? 10 : rest; w.append(h('div', { class: 'bskt' }, objRow(e, m, { size: o.size || 'clamp(14px,1.8vw,22px)', max: '120px' }), h('span', { class: 'bs-base' }), o.labels && m === 10 ? h('i', { class: 'bs-lab num' }, (k + 1) * 10) : null)); }
  return w;
}
/* 1–100 table; o.only = list of cells shown (others blank) · o.q = cell with ? · o.hi = highlighted cells */
function hundredGrid(o = {}) {
  const w = h('div', { class: 'h100' + (o.sm ? ' sm' : '') });
  for (let n = 1; n <= 100; n++) { const show = !o.only || o.only.includes(n), c = h('span', { class: 'hc' + (o.hi && o.hi.includes(n) ? ' on' : '') + (show ? '' : ' off') + (o.q === n ? ' q' : ''), 'data-n': n }, o.q === n ? '?' : show && !(o.blank && o.blank.includes(n)) ? n : ''); w.append(c); }
  return w;
}
/* a fragment of the hundred table practice: cells = list of numbers forming a shape; show = given numbers; q = asked cell */
function hundredPiece(cells, show, q) {
  const rows = cells.map(n => Math.floor((n - 1) / 10)), cols = cells.map(n => (n - 1) % 10), r0 = Math.min(...rows), c0 = Math.min(...cols);
  const w = h('div', { class: 'hpiece', style: { gridTemplateColumns: `repeat(${Math.max(...cols) - c0 + 1}, var(--hp,52px))`, gridTemplateRows: `repeat(${Math.max(...rows) - r0 + 1}, var(--hp,52px))` } });
  cells.forEach((n, i) => w.append(h('span', { class: 'hp' + (n === q ? ' q' : show.includes(n) ? ' given' : ''), style: { gridRow: rows[i] - r0 + 1, gridColumn: cols[i] - c0 + 1 } }, n === q ? '?' : show.includes(n) ? n : '')));
  return w;
}

/* =========================================================
   GRADE 1 · CHAPTER 11 — length: long objects, rulers, unit rows, height boards
   Long objects are drawn to any length L (in units) in a viewBox L*20 × 26.
   ========================================================= */
function longSVG(kind, L, col = 'yellow') {
  const W = L * 20, c = PAL[col] || PAL.yellow, ln = c[3];
  const box = (x, y, w, hh, f, r = 3) => `<rect x="${x}" y="${y}" width="${Math.max(0, w)}" height="${hh}" rx="${r}" fill="${f}" stroke="${ln}" stroke-width="1.4"/>`;
  let s = '';
  switch (kind) {
    case 'pencil': s = box(1, 5, 9, 16, PAL.pink[1], 3) + `<rect x="9" y="5" width="6" height="16" fill="${PAL.lilac[2]}" stroke="${ln}" stroke-width="1.2"/>` + `<path d="M15 5 H${W - 16} L${W - 1} 13 L${W - 16} 21 H15 Z" fill="url(#l-${col})" stroke="${ln}" stroke-width="1.4" stroke-linejoin="round"/><path d="M${W - 16} 5 L${W - 1} 13 L${W - 16} 21 Z" fill="${PAL.tan[0]}" stroke="${ln}" stroke-width="1.2" stroke-linejoin="round"/><path d="M${W - 6} 10.3 L${W - 1} 13 L${W - 6} 15.7 Z" fill="#2B2550"/><path d="M17 9 H${W - 20}" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>`; break;
    case 'pen': s = `<path d="M2 8 H${W - 18} L${W - 2} 13 L${W - 18} 18 H2 Z" fill="url(#l-sky)" stroke="${PAL.sky[3]}" stroke-width="1.4" stroke-linejoin="round"/><rect x="${W * .55}" y="5" width="${W * .3}" height="4" rx="2" fill="${PAL.sky[3]}"/><path d="M${W - 6} 11.8 L${W - 2} 13 L${W - 6} 14.2 Z" fill="#2B2550"/>`; break;
    case 'straw': s = box(1, 9, W - 2, 8, `url(#l-${col})`, 4) + `<path d="M4 11.5 H${W - 6}" stroke="#fff" stroke-width="1.6" opacity=".55" stroke-linecap="round"/>`; break;
    case 'crayonbox': s = box(1, 3, W - 2, 21, PAL.cookie[1], 3) + range(0, Math.max(2, Math.floor(W / 9)) - 1).map(i => `<rect x="${5 + i * 9}" y="6" width="6" height="15" rx="2" fill="${PAL[['red', 'orange', 'yellow', 'green', 'sky', 'lilac', 'pink'][i % 7]][1]}"/>`).join(''); break;
    case 'pencilcase': s = `<rect x="1" y="4" width="${W - 2}" height="19" rx="7" fill="url(#l-orange)" stroke="${PAL.orange[3]}" stroke-width="1.4"/><path d="M4 8 H${W - 6}" stroke="${PAL.red[2]}" stroke-width="2.4"/><rect x="${W - 9}" y="5" width="4" height="9" rx="2" fill="#B7AFCD"/>`; break;
    case 'brush': s = `<path d="M2 11 Q2 8 6 8 H${W * .7} V18 H6 Q2 18 2 15 Z" fill="url(#l-yellow)" stroke="${PAL.yellow[3]}" stroke-width="1.3"/><rect x="${W * .7}" y="9" width="${W * .1}" height="8" fill="#C9C4DA" stroke="#9790B0" stroke-width="1.2"/><path d="M${W * .8} 8 Q${W - 6} 6 ${W - 1} 13 Q${W - 6} 20 ${W * .8} 18 Z" fill="${PAL.cookie[2]}" stroke="${PAL.cookie[3]}" stroke-width="1.2"/>`; break;
    case 'spatula': s = `<rect x="1" y="9" width="${W * .45}" height="9" rx="4.5" fill="#fff" stroke="#2B2550" stroke-width="1.4"/><path d="M${W * .45} 11 H${W * .7} V16 H${W * .45}" fill="#fff" stroke="#2B2550" stroke-width="1.4"/><path d="M${W * .7} 4 H${W - 6} Q${W - 1} 4 ${W - 1} 9 V18 Q${W - 1} 23 ${W - 6} 23 H${W * .7} Z" fill="#fff" stroke="#2B2550" stroke-width="1.4"/><path d="M${W * .74} 9 H${W - 6} M${W * .74} 13.5 H${W - 6} M${W * .74} 18 H${W - 6}" stroke="#2B2550" stroke-width="1.6" stroke-linecap="round"/>`; break;
    case 'pan': s = `<rect x="1" y="5" width="${W * .3}" height="5" rx="2.5" fill="#fff" stroke="#2B2550" stroke-width="1.4"/><path d="M${W * .28} 4 H${W - 2} Q${W - 6} 22 ${(W * .28 + W) / 2} 22 Q${W * .32} 22 ${W * .28} 4 Z" fill="#fff" stroke="#2B2550" stroke-width="1.4"/>`; break;
    case 'knife': s = `<rect x="1" y="5" width="${W * .22}" height="7" rx="3.5" fill="#fff" stroke="#2B2550" stroke-width="1.4"/><path d="M${W * .22} 3 H${W - 4} Q${W - 1} 3 ${W - 1} 6 V22 H${W * .26} Q${W * .22} 22 ${W * .22} 18 Z" fill="#fff" stroke="#2B2550" stroke-width="1.4"/>`; break;
    case 'spoon': s = `<path d="M2 12 Q2 9 6 9.5 L${W * .7} 11 V15 L6 16.5 Q2 17 2 14 Z" fill="#fff" stroke="#2B2550" stroke-width="1.4"/><ellipse cx="${W * .7 + (W * .3) / 2}" cy="13" rx="${W * .15 - 1}" ry="8" fill="#fff" stroke="#2B2550" stroke-width="1.4"/>`; break;
    case 'ribbon': s = box(1, 7, W - 2, 12, `url(#l-${col})`, 2); break;
    default: s = box(1, 6, W - 2, 14, `url(#l-${col})`, 6);
  }
  return `<svg viewBox="0 0 ${W} 26" preserveAspectRatio="none" class="longsvg" aria-hidden="true">${s}</svg>`;
}
const CLIP_SVG = `<svg viewBox="0 0 40 16" aria-hidden="true"><path d="M8 3 H32 Q38 3 38 8 Q38 13 32 13 H10 Q6 13 6 9.5 Q6 6.5 10 6.5 H30 Q33 6.5 33 8.5 Q33 10 30 10 H12" fill="none" stroke="#6B6488" stroke-width="2" stroke-linecap="round"/></svg>`;
/* horizontal length board: rows of objects starting at the same line, with a ruler or unit row */
function lenBoard(items, o = {}) {
  const max = o.max || Math.max(...items.map(i => i.len)) + 1, w = h('div', { class: 'lenb' + (o.sm ? ' sm' : ''), style: { '--n': max } });
  items.forEach((it, i) => { const row = h('div', { class: 'lb-row', 'data-i': i }, h('div', { class: 'lb-obj', style: { width: `calc(var(--u) * ${it.len})`, marginLeft: `calc(var(--u) * ${it.start || 0})` }, html: longSVG(it.kind, it.len, it.col) }));
    if (o.unit === 'clip' || o.unit === 'cube') row.append(h('div', { class: 'lb-units ' + o.unit, style: { marginLeft: `calc(var(--u) * ${it.start || 0})` } }, ...range(1, it.len).map(() => o.unit === 'clip' ? h('span', { class: 'clip', html: CLIP_SVG }) : h('span', { class: 'cubeu' }))));
    if (it.name && o.names !== false) row.append(h('span', { class: 'lb-name' }, it.name));
    w.append(row); });
  if (o.unit === 'cm') w.append(ruler(max));
  if (o.guides) items.forEach(it => w.append(h('i', { class: 'lb-guide', style: { left: `calc(var(--u) * ${(it.start || 0) + it.len})` } })));
  return w;
}
function ruler(max, o = {}) {
  return h('div', { class: 'ruler', style: { width: `calc(var(--u) * ${max})` } }, ...range(0, max).map(k => h('b', { class: 'rl', style: { left: `calc(var(--u) * ${k})` } }, k)), h('small', null, 'เซนติเมตร'));
}
/* standing things measured in stacked units or a vertical cm ruler: items [{ e | bottle, h, name, col }] */
function heightBoard(items, o = {}) {
  const max = o.max || Math.max(...items.map(i => i.h)) + 1, w = h('div', { class: 'hgtb u-' + (o.unit || 'box'), style: { '--n': max } });
  w.append(h('div', { class: 'hb-scale' }, ...range(1, max).map(k => h('span', { class: 'hb-u' }, o.unit === 'cm' ? h('b', null, k) : null)), o.unit === 'cm' ? h('b', { class: 'hb-0' }, 0) : null));
  items.forEach((it, i) => { const fig = it.bottle ? h('span', { class: 'hb-fig bottle', style: { height: `calc(var(--u) * ${it.h})` }, html: bottleSVG(it.col) }) : h('span', { class: 'hb-fig', style: { height: `calc(var(--u) * ${it.h})` }, html: `<svg viewBox="${it.vb || '8 6 48 56'}" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${ART[it.e] || SCENERY[it.e] || ''}</svg>` });
    w.append(h('div', { class: 'hb-col', 'data-i': i }, fig, h('span', { class: 'hb-name' }, it.name))); if (o.guides) w.append(h('i', { class: 'hb-guide', style: { bottom: `calc(var(--u) * ${it.h} + var(--hb-base))` } })); });
  return w;
}
function bottleSVG(col) { const c = PAL[col]; return `<svg viewBox="0 0 30 100" preserveAspectRatio="none" aria-hidden="true"><rect x="10" y="0" width="10" height="8" rx="2" fill="${PAL.cookie[2]}"/><path d="M11 8 H19 V18 Q27 24 27 36 V94 Q27 99 22 99 H8 Q3 99 3 94 V36 Q3 24 11 18 Z" fill="${c[1]}" stroke="${c[3]}" stroke-width="1.4"/><path d="M7 40 V90" stroke="#fff" stroke-width="2.4" opacity=".55" stroke-linecap="round"/></svg>`; }

/* =========================================================
   GRADE 1 · CHAPTER 12 — addition to 100 (blocks, vertical form, step-by-step)
   ========================================================= */
/* rods t + cubes u (u may be ≥ 10 before regrouping) */
function blocksTU(t, u, o = {}) {
  const w = h('div', { class: 'blocks p1' + (o.sm ? ' sm' : '') });
  const xT = o.xT || 0, xU = o.xU || 0; // crossed-out (taken away) rods / cubes at the end
  if (t) w.append(h('div', { class: 'bg rod' + (o.hiT ? ' hi' : '') }, h('div', { class: 'bi' }, [...Array(t)].map((_, i) => h('span', { class: 'b' + (i >= t - xT ? ' gone' : ''), html: ROD_SVG }))), o.labels ? h('div', { class: 'cap' }, `${t} สิบ`) : null));
  if (u) w.append(h('div', { class: 'bg cube' + (u >= 10 ? ' over' : '') + (o.hiU ? ' hi' : '') }, h('div', { class: 'bi' }, [...Array(u)].map((_, i) => h('span', { class: 'b' + (u >= 10 && i < 10 && !o.sub ? ' ten' : '') + (i >= u - xU ? ' gone' : ''), html: CUBE_SVG }))), o.labels ? h('div', { class: 'cap' }, `${u} หน่วย`) : null));
  return w;
}
/* vertical addition layout: show = { ones, tens, carry } · q = 'ones' | 'tens' marks the asked cell */
function vertLayout(a, b, o = {}) {
  const d = n => [Math.floor(n / 10) % 10 || (n >= 10 ? 0 : ''), n % 10], s = a + b, carry = (a % 10 + b % 10) >= 10, show = o.show || {};
  const [ta, ua] = d(a), [tb, ub] = d(b), hund = s >= 100 ? 1 : '', ts = Math.floor(s / 10) % 10, us = s % 10;
  const cell = (v, cls = '') => h('span', { class: 'vc ' + cls }, v === '' || v == null ? '' : String(v));
  const g = h('div', { class: 'vadd' + (s >= 100 ? ' h3' : '') }), add = (...xs) => g.append(...xs.filter(Boolean));
  add(cell('', 'hd'), s >= 100 ? cell('ร้อย', 'hd') : null, cell('สิบ', 'hd t'), cell('หน่วย', 'hd u'));
  add(cell(''), s >= 100 ? cell('') : null, cell(carry && show.carry ? '1' : '', 'carry'), cell(''));
  add(cell(''), s >= 100 ? cell('') : null, cell(a >= 10 ? ta : ''), cell(ua));
  add(cell('+', 'op'), s >= 100 ? cell('') : null, cell(b >= 10 ? tb : ''), cell(ub));
  add(h('i', { class: 'vline' }));
  add(cell(''), s >= 100 ? cell(show.tens ? hund : o.q === 'tens' ? '?' : '', 'res' + (o.q === 'tens' ? ' q' : '')) : null, cell(show.tens ? (s >= 10 ? ts : '') : o.q === 'tens' ? '?' : '', 'res' + (o.q === 'tens' ? ' q' : '')), cell(show.ones ? us : o.q === 'ones' ? '?' : '', 'res' + (o.q === 'ones' ? ' q' : '')));
  return g;
}
/* several equation steps answered one after another with one answer box */
function multiStep(ctx, steps, o = {}) {
  const rows = steps.map((st, i) => { const e = eqRow(st.toks, { sm: true }); const r = h('div', { class: 'ms-row' + (i ? ' wait' : ' on') }, st.label ? h('span', { class: 'ms-lab' }, st.label) : null, e); r.e = e; return r; });
  const box = h('div', { class: 'ms-box' }); let k = 0;
  const next = () => { box.innerHTML = ''; const st = steps[k];
    const sub = k < steps.length - 1 ? { check: (ok, hint) => { if (ok) { rows[k].e.fill(st.ans); rows[k].classList.remove('on'); rows[k].classList.add('done'); sfx.pop(k + 3); k++; rows[k].classList.remove('wait'); rows[k].classList.add('on'); ctx.say && ctx.say(steps[k].say || 'ถูกต้อง ทำขั้นต่อไป'); next(); } else ctx.check(false, hint); } } : ctx;
    box.append(answerBox(sub, st.ans, { hint: st.hint })); };
  next(); ctx.onRight = () => { rows[k].e.fill(steps[k].ans); rows[k].classList.add('done'); };
  return h('div', { class: 'rowstack ms' }, h('div', { class: 'colstack ms-rows' }, ...rows), box);
}

/* =========================================================
   GRADE 1 · CHAPTER 13 — subtraction to 100 (regrouping = การกระจาย)
   ========================================================= */
function vertSubLayout(a, b, o = {}) {
  const show = o.show || {}, ta = Math.floor(a / 10), ua = a % 10, tb = Math.floor(b / 10), ub = b % 10, borrow = ua < ub, d = a - b;
  const cell = (v, cls = '') => h('span', { class: 'vc ' + cls }, v === '' || v == null ? '' : String(v));
  const g = h('div', { class: 'vadd sub' }), add = (...xs) => g.append(...xs.filter(Boolean));
  add(cell('', 'hd'), cell('สิบ', 'hd t'), cell('หน่วย', 'hd u'));
  add(cell(''), cell(borrow && show.borrow ? ta - 1 : '', 'carry'), cell(borrow && show.borrow ? ua + 10 : '', 'carry'));
  add(cell(''), cell(ta || '', borrow && show.borrow ? 'struck' : ''), cell(ua, borrow && show.borrow ? 'struck' : ''));
  add(cell('−', 'op'), cell(b >= 10 ? tb : ''), cell(ub));
  add(h('i', { class: 'vline' }));
  add(cell(''), cell(show.tens ? (d >= 10 ? Math.floor(d / 10) : '') : o.q === 'tens' ? '?' : '', 'res' + (o.q === 'tens' ? ' q' : '')), cell(show.ones ? d % 10 : o.q === 'ones' ? '?' : '', 'res' + (o.q === 'ones' ? ' q' : '')));
  return g;
}
/* =========================================================
   GRADE 1 · CHAPTER 14 — bar model for word problems (part–part–whole / compare)
   ========================================================= */
function barModel(o) { // o: { whole, parts: [a, b], labels: [la, lb], wl, q: 'whole' | 0 | 1, compare }
  const W = o.whole || (o.parts[0] + o.parts[1]), pct = v => Math.max(12, v / W * 100) + '%', lab = (v, k) => (o.q === k ? '?' : v);
  const w = h('div', { class: 'barm' + (o.compare ? ' cmp' : '') });
  if (o.compare) { // two bars, the difference shown dashed
    const [A, B] = o.parts, big = Math.max(A, B);
    w.append(h('div', { class: 'bm-row' }, h('span', { class: 'bm-l' }, o.labels[0]), h('span', { class: 'bm-bar a', style: { width: A / big * 100 + '%' } }, lab(A, 0))),
      h('div', { class: 'bm-row' }, h('span', { class: 'bm-l' }, o.labels[1]), h('span', { class: 'bm-bar b', style: { width: B / big * 100 + '%' } }, lab(B, 1)), h('span', { class: 'bm-diff', style: { width: (big - Math.min(A, B)) / big * 100 + '%' } }, o.q === 'diff' ? '?' : big - Math.min(A, B))));
    return w;
  }
  w.append(h('div', { class: 'bm-whole' }, h('span', null, o.wl ? `${o.wl} ` : '', h('b', null, lab(W, 'whole')))),
    h('div', { class: 'bm-parts' }, h('span', { class: 'bm-bar a', style: { width: pct(o.parts[0]) } }, h('small', null, o.labels[0]), h('b', null, lab(o.parts[0], 0))), h('span', { class: 'bm-bar b', style: { width: pct(o.parts[1]) } }, h('small', null, o.labels[1]), h('b', null, lab(o.parts[1], 1)))));
  return w;
}
/* bar model that fits a story: put together / take away / compare ("กว่า") */
function storyModel(st) {
  const ans = st.op === '+' ? st.a + st.b : st.a - st.b, cmp = /กว่า/.test(st.text), orig = /เดิม/.test(st.text);
  if (st.op === '+') return cmp ? barModel({ compare: true, parts: [st.a, ans], labels: ['', ''], q: 1 }) : barModel({ parts: [st.a, st.b], labels: ['', ''], q: 'whole' });
  return cmp ? barModel({ compare: true, parts: [st.a, st.b], labels: ['', ''], q: 'diff' }) : barModel({ whole: st.a, parts: orig ? [ans, st.b] : [st.b, ans], labels: ['', ''], q: orig ? 0 : 1 });
}

/* v112 (ผู้ใช้ขอ): แตะแล้วลากนิ้วผ่านลูกคิด — เม็ดที่นิ้วอยู่ยกขึ้นนิดหนึ่ง พอนิ้วผ่านไปก็วางลง (ช่วยนับทีละเม็ด) */
(() => { let cur = null, on = false;
  const drop = () => { if (cur) cur.classList.remove('lift'); cur = null; };
  const at = e => { const el = document.elementFromPoint(e.clientX, e.clientY), b = el && el.closest && el.closest('.abacus-svg .bead:not(.gone)'); if (b === cur) return; drop(); if (b) { cur = b; b.classList.add('lift'); try { sfx.tap(); } catch (_) {} } };
  document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('.abacus-svg')) { on = true; at(e); } }, true);
  document.addEventListener('pointermove', e => { if (on) at(e); }, true);
  ['pointerup', 'pointercancel'].forEach(t => document.addEventListener(t, () => { on = false; drop(); }, true)); })();

/* v113 (ผู้ใช้ขอ): ประโยคสัญลักษณ์ / สมการ อยู่ในบรรทัดเดียว — `.one-line` ไม่ตัดบรรทัด ถ้ายาวเกินจะย่อฟอนต์ลงเอง (ไม่ต่ำกว่า 55 %) */
const fitOneLine = el => { if (!el.isConnected) return; el.style.fontSize = ''; const jc = el.style.justifyContent; el.style.justifyContent = 'flex-start'; const w = el.clientWidth; if (!w) { el.style.justifyContent = jc; return; } const sw = el.scrollWidth; try {
  if (sw <= w + 1) return; const fs0 = parseFloat(getComputedStyle(el).fontSize) || 16; let fs = fs0;
  for (let g = 0; g < 6 && el.scrollWidth > el.clientWidth + 1 && fs > fs0 * .55; g++) { fs = Math.max(fs0 * .55, fs * el.clientWidth / el.scrollWidth - .5); el.style.fontSize = fs + 'px'; } } finally { el.style.justifyContent = jc; } };
/* v116 (ผู้ใช้ขอ): ทุกที่ที่เป็นประโยคสัญลักษณ์ล้วน (.fbig ที่มี .fexpr และไม่มีตัวหนังสือไทย) ให้อยู่บรรทัดเดียวอัตโนมัติ */
const autoOneLine = el => { if (el.classList.contains('one-line') || el.classList.contains('no-one-line') || !el.querySelector('.fexpr,.fop') || el.querySelector('svg,table,.storybox,.colw,.cwk,br,input,.ansbox') || /[\u0E01-\u0E4F]/.test(el.textContent)) return; el.classList.add('one-line'); };
(() => { const RO = new ResizeObserver(es => es.forEach(e => fitOneLine(e.target))), seen = new WeakSet();
  const hook = el => { if (!seen.has(el)) { seen.add(el); RO.observe(el); } requestAnimationFrame(() => fitOneLine(el)); };
  new MutationObserver(ms => ms.forEach(m => { const t = m.target.nodeType === 1 ? m.target : m.target.parentElement, o = t && t.closest && t.closest('.one-line'); if (o) hook(o);
    m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.matches('.fbig')) autoOneLine(n); n.querySelectorAll('.fbig').forEach(autoOneLine); if (n.matches('.one-line')) hook(n); n.querySelectorAll('.one-line').forEach(hook); }); })).observe(document.body, { childList: true, subtree: true, characterData: true }); })();

/* v118/v119 (ผู้ใช้เลือกแบบ ง. แล้วขอให้ใช้กับทุกเกมเรียงลำดับ): “เส้นทางคาราวาน”
   หิน 1 → 2 → … → โอเอซิส · แตะการ์ดที่ถูกตำแหน่งถัดไป → การ์ดไปวางที่หินก้อนนั้น อูฐเดินตาม · แตะผิด → การ์ดสั่น onDone(false, k) (ของที่วางแล้วไม่หาย)
   o: { cards: [html], fits(k, n) → การ์ด k วางที่ตำแหน่ง n ได้ไหม, n (จำนวนหิน, ค่าเริ่ม = จำนวนการ์ด), labels: [ป้ายใต้หิน], horiz (แถวแนวนอน: ค่าเริ่ม = การ์ดสั้นทุกใบ), onDone(ok) }
   คืนค่า element .cvn.rvl ที่มี .reveal() (วางที่เหลือให้ครบตอนเฉลย) */
/* v119 (ผู้ใช้ขอ): เส้นทางเปลี่ยนตามธีมของแต่ละโลก/ระดับชั้น (document.body.dataset.world) — ตัวเดิน · หิน · เส้นทาง · จุดหมาย */
const CVN_TH = {
  desert: { who: 'อูฐ', go: 'เดิน', by: 'ก้อน', to: 'โอเอซิส', walker: () => SCENERY.camel, goal: () => SCENERY.palm, hop: 12 },
  beach: { who: 'ปู', go: 'เดิน', by: 'ก้อน', to: 'ร่มชายหาด', walker: () => ART.crab, goal: () => SCENERY.umbrella, hop: 8 },
  jungle: { who: 'กบ', go: 'กระโดด', by: 'ใบบัว', to: 'ดอกไม้', walker: () => SCENERY.frog, goal: () => SCENERY.heliconia, hop: 30 },
  mountain: { who: 'แพะภูเขา', go: 'ปีน', by: 'ก้อน', to: 'ยอดเขา', walker: () => SCENERY.goat, goal: () => SCENERY.sumflag, hop: 18 },
  cave: { who: 'ค้างคาว', go: 'บิน', by: 'ก้อน', to: 'คริสตัล', walker: () => SCENERY.bat, goal: () => SCENERY.crystal, hop: 26 },
  city: { who: 'ลูกเจี๊ยบ', go: 'เดิน', by: 'ก้อน', to: 'บ้าน', walker: () => ART.chick, goal: () => SCENERY.house, hop: 10 }
};
const cvnTheme = () => { const w = document.body.dataset.world; return Object.assign({ key: CVN_TH[w] ? w : 'desert' }, CVN_TH[w] || CVN_TH.desert); };
const cvnHint = () => { const t = cvnTheme(); return `${t.who}จะ${t.go}ไปทีละ${t.by}จนถึง${t.to}`; };
function cvnBoard(o) {
  const TH = cvnTheme();
  const cards = o.cards, N = o.n || cards.length, plain = x => String(x).replace(/<[^>]+>/g, '').trim();
  const horiz = o.horiz != null ? o.horiz : cards.every(c => plain(c).length <= 14) && N <= 6;
  let n = 0; const camel = h('span', { class: 'cvn-camel', html: `<svg viewBox="0 0 64 64" aria-hidden="true">${TH.walker()}</svg>` });
  const ghost = cards.reduce((m, c) => plain(c).length > plain(m).length ? c : m, ''); // v123: จองที่ในป้ายใต้หินเท่าการ์ดที่ยาวที่สุด — วางการ์ดแล้วไม่มีอะไรขยับ
  const steps = range(0, N - 1).map(i => h('div', { class: 'cvn-st' }, h('b', { class: 'cvn-stone' }, i + 1), h('span', { class: 'cvn-tag', html: `<span class="cvn-ghost" aria-hidden="true">${ghost}</span>` }), o.labels && o.labels[i] ? h('small', { class: 'cvn-lab' }, o.labels[i]) : null));
  const goal = h('div', { class: 'cvn-st cvn-goal' }, h('b', { class: 'cvn-stone', html: `<svg viewBox="0 0 64 64" aria-hidden="true">${TH.goal()}</svg>` }), h('span', { class: 'cvn-tag cvn-gtag' }, horiz ? 'ถึงแล้ว!' : `ถึง${TH.to}แล้ว!`));
  const path = h('div', { class: 'cvn-path' }, ...steps, goal), pool = h('div', { class: 'cvn-pool' }), btns = [];
  const walk = (to, first) => { const r0 = first ? null : camel.getBoundingClientRect(); to.querySelector('.cvn-stone').after(camel);
    if (r0 && r0.width && camel.animate) { const r1 = camel.getBoundingClientRect(), dx = r0.left - r1.left, dy = r0.top - r1.top; camel.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: `translate(${dx / 2}px,${dy / 2 - TH.hop}px)`, offset: .5 }, { transform: 'none' }], { duration: 650, easing: 'ease-in-out' }); } };
  const put = k => { const st = steps[n], b = btns[k]; st.querySelector('.cvn-tag').innerHTML = cards[k]; st.classList.add('on'); st.classList.remove('next'); b.classList.add('used'); n++;
    if (n < N) { steps[n].classList.add('next'); walk(steps[n]); } else { walk(goal); goal.classList.add('on'); path.dataset.done = 1; } };
  shuffle(cards.map((_, k) => k)).forEach(k => { const b = h('button', { class: 'cvn-card ia', html: cards[k], onclick: e => { e.stopPropagation(); if (b.classList.contains('used') || path.dataset.done) return;
    if (!o.fits(k, n)) { sfx.no(); b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 650); o.onDone && o.onDone(false, k); return; }
    sfx.pop(n + 1); put(k); if (path.dataset.done) { setTimeout(() => sfx.ok && sfx.ok(), 450); o.onDone && o.onDone(true); } } }); btns[k] = b; pool.append(b); });
  steps[0].classList.add('next'); walk(steps[0], true);
  const box = h('div', { class: 'cvn rvl' + (horiz ? ' h' : ''), 'data-th': TH.key }, path, pool);
  box.reveal = () => { let g = 0; while (n < N && g++ < 50) { const k = cards.findIndex((_, j) => !btns[j].classList.contains('used') && o.fits(j, n)); if (k < 0) break; put(k); } };
  return box;
}
