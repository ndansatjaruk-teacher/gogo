/* =========================================================
   GRADE 4 · CHAPTER 1 — จำนวนนับที่มากกว่า 100,000  (ทะเลทราย)
   ========================================================= */
ROD_NAMES.unshift('ร้อยล้าน', 'สิบล้าน', 'ล้าน');
ROD_COL.unshift(['#F08AA3', '#C2506E'], ['#7FC8F0', '#2F86C2'], ['#5FD3C0', '#1E9C88']);
const P4_PL = ['หลักร้อยล้าน', 'หลักสิบล้าน', 'หลักล้าน', 'หลักแสน', 'หลักหมื่น', 'หลักพัน', 'หลักร้อย', 'หลักสิบ', 'หลักหน่วย'];
const P4_RN = ['หน่วย', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
const p4pl = (n, i) => P4_PL[9 - String(n).length + i];
const p4val = (n, i) => { const s = String(n); return +s[i] * 10 ** (s.length - 1 - i); };
const p4terms = n => [...String(n)].map((d, i) => +d ? p4val(n, i) : 0).filter(Boolean);
const p4expStr = n => p4terms(n).map(fmt).join(' + ');
const p4r = (n, pow) => Math.round(n / 10 ** pow) * 10 ** pow;
const p4th = n => `<span class="thn">${thai(fmt(n))}</span>`;
/* fmt(n) with the idx-th digit (from the left) underlined */
const p4u = (n, idx, cls = '') => { let k = -1; return [...fmt(n)].map(c => /\d/.test(c) && ++k === idx ? `<u class="${cls}">${c}</u>` : c).join(''); };
/* a random k-digit number; each digit after the first is 0 with chance z */
const p4R = (k, z = .25) => +[rnd(1, 9), ...range(1, k - 1).map(() => Math.random() < z ? 0 : rnd(1, 9))].join('');
/* near misses with the same number of digits: moved zero, swapped neighbours, ±1 in one place */
function p4near(n, k = 3) {
  const s = [...String(n)], out = new Set(), L = s.length;
  const add = a => { const v = +a.join(''); if (a[0] !== '0' && v !== n) out.add(v); };
  for (let t = 0; t < 60 && out.size < k * 3; t++) {
    const a = s.slice(), i = rnd(0, L - 2), m = t % 3;
    if (m === 0) { [a[i], a[i + 1]] = [a[i + 1], a[i]]; } else if (m === 1) { const j = rnd(0, L - 1); a[j] = String((+a[j] + (Math.random() < .5 ? 1 : 9)) % 10); } else { const z = a.indexOf('0', 1); if (z > 0) { const j = rnd(1, L - 1); [a[z], a[j]] = [a[j], a[z]]; } else a[rnd(1, L - 1)] = '0'; }
    add(a);
  }
  return shuffle([...out]).slice(0, k);
}

/* ---------- place-value chart (up to hundred-millions), millions/units periods ---------- */
function p4chart(n, o = {}) {
  const s = String(n), k = o.places || s.length, pad = k - s.length, names = P4_PL.slice(-k).map(x => x.replace('หลัก', ''));
  const g = h('div', { class: 'p4c' + (o.sm ? ' sm' : ''), style: { gridTemplateColumns: `repeat(${k},minmax(0,1fr))` } });
  if (k > 6 && o.groups !== false) g.append(h('div', { class: 'p4g m', style: { gridColumn: `span ${k - 6}` } }, 'ชุดล้าน'), h('div', { class: 'p4g u', style: { gridColumn: 'span 6' } }, 'ชุดหน่วย'));
  if (o.names !== false) names.forEach((nm, i) => g.append(h('div', { class: 'p4n' + (k - i > 6 ? ' m' : '') }, nm)));
  range(0, k - 1).forEach(i => g.append(h('div', { class: 'p4d num' + (k - i > 6 ? ' m' : '') + (i < pad ? ' empty' : '') + (o.hi && o.hi.includes(i) ? ' on' : ''), 'data-i': i - pad }, i < pad ? '' : o.q === i - pad ? '?' : s[i - pad])));
  return g;
}
const p4more = (fn, label = 'จำนวนใหม่') => h('button', { class: 'btn sm ia nxp', onclick: e => { e.stopPropagation(); sfx.page(); fn(); } }, icon('undo'), label);

/* read a big number one period at a time: millions period, then units period */
function simReadSplit(nums) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const n = nums[idx], k = String(n).length, m = Math.floor(n / 1e6), r = n % 1e6; box.innerHTML = '';
    const c = p4chart(n), out = h('div', { class: 'p4read' }), note = fNote(), cells = [...c.querySelectorAll('.p4d')]; let st = 0;
    note.innerHTML = 'แบ่งตัวเลขเป็น 2 ชุด แล้วกด<b>อ่านทีละชุด</b>';
    const hi = (a, b) => cells.forEach((x, i) => x.classList.toggle('on', i >= a && i < b));
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; sfx.pop(st);
      if (st === 1) { hi(0, k - 6); note.innerHTML = `ชุดล้าน <b class="num">${fmt(m)}</b> อ่านว่า “${thaiWords(m)}” แล้วต่อด้วยคำว่า <b>ล้าน</b>`; out.innerHTML = `<span class="p4w m">${thaiWords(m)}ล้าน</span>`; say(thaiWords(m) + 'ล้าน', true); }
      else if (st === 2) { hi(k - 6, k); note.innerHTML = r ? `ชุดหน่วย <b class="num">${String(r).padStart(6, '0').replace(/(\d{3})(\d{3})/, '$1,$2')}</b> อ่านว่า “${thaiWords(r)}” (หลักที่เป็น 0 ไม่ต้องอ่าน)` : 'ชุดหน่วยเป็น 0 ทั้งหมด ไม่ต้องอ่าน'; if (r) out.innerHTML += `<span class="p4w u">${thaiWords(r)}</span>`; say(r ? thaiWords(r) : 'ไม่ต้องอ่าน', true); }
      else { hi(-1, -1); note.innerHTML = `อ่านรวมกันว่า <b>${thaiWords(n)}</b><br>ตัวเลขไทย <b class="thn">${thai(fmt(n))}</b>`; btn.remove(); sfx.ok(); say(thaiWords(n), true); }
    } }, icon('right'), 'อ่านทีละชุด');
    box.append(c, out, note, btn, p4more(() => { idx = (idx + 1) % nums.length; draw(); }));
  };
  draw(); return box;
}
/* tap each digit: its place and value; the expanded form builds up */
function simP4Tap(nums) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const n = nums[idx], s = String(n); box.innerHTML = '';
    const c = p4chart(n), note = fNote(), ex = h('div', { class: 'p4exp' }), filled = new Set(), nz = [...s].map((d, i) => +d ? i : -1).filter(i => i >= 0); let doneT = false;
    note.innerHTML = 'แตะเลขโดดทีละตัว';
    /* v112 (ผู้ใช้ขอ): only the term just tapped pops — the others stay still (no re-render) */
    ex.innerHTML = `<b class="num">${fmt(n)}</b> <b class="fop">=</b> ` + nz.map(i => `<span class="p4t" data-i="${i}">?</span>`).join(' <b class="fop">+</b> ');
    const drawEx = i => { const t = i == null ? null : ex.querySelector(`.p4t[data-i="${i}"]`); if (!t) return; t.classList.remove('on'); void t.offsetWidth; t.classList.add('on', 'num'); t.textContent = fmt(p4val(n, i)); };
    c.querySelectorAll('.p4d').forEach(pc => { pc.classList.add('ia'); pc.onclick = e => { e.stopPropagation(); const i = +pc.dataset.i, d = +s[i], v = p4val(n, i), pl = p4pl(n, i);
      c.querySelectorAll('.p4d').forEach(x => x.classList.toggle('on', x === pc));
      note.innerHTML = d ? `${d} อยู่ใน<b>${pl}</b> มีค่า <span class="hl">${fmt(v)}</span>` : `0 อยู่ใน<b>${pl}</b> มีค่า 0 — ไม่ต้องเขียนในรูปกระจาย`;
      if (d) { filled.add(i); drawEx(i); } sfx.pop(i); say(d ? `${WORD[d]} อยู่ใน${pl} มีค่า ${thaiWords(v)}` : `ศูนย์ อยู่ใน${pl} มีค่าศูนย์`, true);
      if (!doneT && nz.every(j => filled.has(j))) { doneT = true; note.innerHTML += '<br>ครบทุกหลักแล้ว! นี่คือ<b>รูปกระจาย</b>'; teachDone(box); } }; });
    box.append(c, note, ex, p4more(() => { idx = (idx + 1) % nums.length; draw(); }));
  };
  draw(); return box;
}
/* compare two numbers: count the digits first, then go left to right */
function simCmpP4(pairs) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const [a, b] = pairs[idx], sa = String(a), sb = String(b), k = Math.max(sa.length, sb.length); box.innerHTML = '';
    const A = p4chart(a, { places: k, groups: false }), B = p4chart(b, { places: k, groups: false, names: false }), note = fNote(), res = h('div', { class: 'fbig' });
    const ca = [...A.querySelectorAll('.p4d')], cb = [...B.querySelectorAll('.p4d')], rel = a > b ? '>' : a < b ? '<' : '=';
    note.innerHTML = 'กด<b>เทียบทีละขั้น</b> — เริ่มจากนับจำนวนหลัก'; let i = -1;
    const end = t => { note.innerHTML = t; res.innerHTML = `<b class="num">${fmt(a)}</b> <b class="fop">${rel}</b> <b class="num">${fmt(b)}</b>`; btn.remove(); sfx.ok(); say(`${thaiWords(a)} ${rel === '>' ? 'มากกว่า' : rel === '<' ? 'น้อยกว่า' : 'เท่ากับ'} ${thaiWords(b)}`, true); };
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation();
      if (i < 0) { if (sa.length !== sb.length) { [ca, cb].forEach(cs => cs.forEach(c => c.classList.toggle('on', !c.classList.contains('empty')))); end(`${fmt(a)} มี ${sa.length} หลัก · ${fmt(b)} มี ${sb.length} หลัก<br>จำนวนที่มี<b>หลักมากกว่า</b>จะมีค่ามากกว่า ดังนั้น`); return; }
        note.innerHTML = `ทั้งสองจำนวนมี <b>${k} หลัก</b>เท่ากัน → เทียบเลขโดดทีละหลักจากซ้ายสุด`; i = 0; sfx.pop(0); return; }
      [ca, cb].forEach(cs => cs.forEach((c, j) => c.classList.toggle('on', j === i)));
      const pl = P4_PL[9 - k + i];
      if (sa[i] !== sb[i]) { end(`${pl}: ${sa[i]} ${sa[i] > sb[i] ? 'มากกว่า' : 'น้อยกว่า'} ${sb[i]} ดังนั้น`); return; }
      if (i === k - 1) { end('เลขโดดทุกหลักเท่ากัน ดังนั้น'); return; }
      note.innerHTML = `${pl}เท่ากัน (${sa[i]} กับ ${sb[i]}) → เทียบหลักถัดไป`; sfx.pop(i); i++; } }, icon('right'), 'เทียบทีละขั้น');
    box.append(h('div', { class: 'p4pair' }, A, B), note, res, btn, p4more(() => { idx = (idx + 1) % pairs.length; draw(); }, 'คู่ใหม่'));
  };
  draw(); return box;
}
/* draggable number line between two neighbouring multiples of 10^pow */
function p4Round(n0, pow, o = {}) {
  let P = pow, u = n0; const wrap = h('div', { class: 'rline ia p4rl' }), bar = h('div', { class: 'rl-bar' }), dot = h('div', { class: 'rl-dot' }, h('span', { class: 'rl-val' })), out = fNote(), big = h('div', { class: 'fbig' });
  const U = () => 10 ** P, res = () => Math.max(1, U() / 100);
  function draw() {
    const lo = Math.floor(u / U()) * U(), hi = lo + U(), mid = lo + U() / 2, up = u >= mid, ans = up ? hi : lo, nm = P4_RN[P];
    bar.innerHTML = ''; bar.append(h('div', { class: 'rl-mid', style: { left: '50%' } }, h('span', null, fmt(mid))));
    for (let k = 0; k <= 10; k++) bar.append(h('span', { class: 'rl-t' + (k % 10 ? ' m' : '') + (k === 5 ? ' h' : ''), style: { left: k * 10 + '%' } }, h('b', null, k % 10 ? '' : fmt(lo + k * U() / 10))));
    bar.append(h('span', { class: 'rl-end' + (ans === lo ? ' on' : ''), style: { left: '0%' } }), h('span', { class: 'rl-end' + (ans === hi ? ' on' : ''), style: { left: '100%' } }));
    dot.style.left = (u - lo) / U() * 100 + '%'; dot.firstChild.textContent = fmt(u); bar.append(dot);
    const ps = (u - lo) / U() * 100, pe = up ? 100 : 0; bar.append(h('span', { class: 'rl-arrow ' + (up ? 'r' : 'l'), style: { left: Math.min(ps, pe) + '%', width: Math.abs(pe - ps) + '%' } }));
    const s = String(u), kd = s.length - P, kdig = kd >= 0 ? +s[kd] : 0;
    big.innerHTML = `<b class="num">${p4u(u, kd, 'rl-key')}</b> <b class="fop">≈</b> <b class="num">${fmt(ans)}</b>`;
    const dl = u - lo, dh = hi - u;
    out.innerHTML = `${fmt(u)} อยู่ระหว่าง ${fmt(lo)} กับ ${fmt(hi)} · ห่าง ${fmt(lo)} อยู่ ${fmt(dl)} · ห่าง ${fmt(hi)} อยู่ ${fmt(dh)}<br>` +
      `ตัวเลขหลัก${P4_RN[P - 1]}คือ <b>${kdig}</b> ` + (dl === dh ? `→ อยู่<b>กึ่งกลางพอดี</b> ใช้จำนวนเต็ม${nm}ที่<b>มากกว่า</b>` : kdig >= 5 ? `≥ 5 → ใกล้ ${fmt(hi)} มากกว่า ใช้จำนวนเต็ม${nm}ที่<b>มากกว่า</b>` : `< 5 → ใกล้ ${fmt(lo)} มากกว่า ใช้จำนวนเต็ม${nm}ที่<b>น้อยกว่า</b>`);
  }
  const setFrom = e => { const r = bar.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), lo = Math.floor(u / U()) * U(), tail = n0 % res(); u = lo + Math.min(U() - res(), Math.round(f * U() / res()) * res()) + (res() > 1 ? tail : 0); draw(); };
  let drag = false;
  bar.addEventListener('pointerdown', e => { drag = true; try { bar.setPointerCapture(e.pointerId); } catch (_) {} setFrom(e); sfx.tap(); });
  bar.addEventListener('pointermove', e => { if (drag) setFrom(e); });
  bar.addEventListener('pointerup', () => { drag = false; sfx.pop(3); say(`${thaiWords(u)} ค่าประมาณเป็นจำนวนเต็ม${P4_RN[P]} คือ ${thaiWords(p4r(u, P))}`, true); }); bar.addEventListener('pointercancel', () => drag = false);
  draw(); wrap.append(bar);
  const st = (lab, f) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); const d = f(); u = Math.max(1, Math.min(999999999, u + d)); sfx.pop(3); draw(); } }, lab);
  const cs = () => U() / 10 > res() ? U() / 10 : U();
  const ctrl = h('div', { class: 'rowstack rl-ctrl' });
  const mkCtrl = () => { ctrl.innerHTML = ''; ctrl.append(st('◀ ' + fmt(cs()), () => -cs()), st('− ' + fmt(res()), () => -res()), st('+ ' + fmt(res()), () => res()), st(fmt(cs()) + ' ▶', () => cs())); };
  mkCtrl();
  const parts = [big, wrap, ctrl, out];
  if (o.pows) { const seg = h('div', { class: 'seg p4seg' }); const bs = o.pows.map(p => h('button', { class: p === P ? 'on' : '', onclick: e => { e.stopPropagation(); P = p; bs.forEach((b, j) => b.classList.toggle('on', o.pows[j] === p)); mkCtrl(); draw(); sfx.tap(); say('ประมาณเป็นจำนวนเต็ม' + P4_RN[p], true); } }, 'เต็ม' + P4_RN[p])); seg.append(...bs); parts.unshift(seg); }
  return h('div', { class: 'colstack' }, ...parts);
}
/* shopping with estimates: pick items and a rounding place, compare estimate with the exact total */
/* v112 (ผู้ใช้ขอ): ของที่เลือกซื้อมีรูป */
const P4_MICRO = `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="55" rx="27" ry="2.6" fill="#2B2550" opacity=".12"/><rect x="5" y="14" width="54" height="38" rx="5" fill="url(#g-white)" stroke="#8C84A8" stroke-width="1.6"/><rect x="10" y="19" width="33" height="28" rx="3" fill="#2B2550" opacity=".85"/><rect x="13" y="22" width="12" height="5" rx="2" fill="#fff" opacity=".25"/><rect x="47" y="19" width="8" height="7" rx="1.5" fill="#7EDDB8"/><circle cx="51" cy="33" r="2.4" fill="#C4B5FD"/><circle cx="51" cy="41" r="2.4" fill="#C4B5FD"/><rect x="40" y="25" width="2" height="16" rx="1" fill="#CFC8E0"/></svg>`;
const p4shopIco = k => k === 'micro' ? P4_MICRO : P2ART[k] ? `<svg viewBox="${p2vb(k).join(' ')}" aria-hidden="true">${P2ART[k]}</svg>` : p4ico(k);
function simEstShop() {
  const ITEMS = [['ตู้เย็น', 8490, 'fridge'], ['ทีวี', 12950, 'tv'], ['พัดลม', 1890, 'fan'], ['หม้อหุงข้าว', 2350, 'ricecook'], ['ไมโครเวฟ', 3640, 'micro']], BUD = 25000;
  const on = new Set([0, 2]); let P = 3; const tb = h('div', { class: 'p4shop' }), out = fNote(), big = h('div', { class: 'fbig p4est' });
  const chips = h('div', { class: 'h6-chips' }), seg = h('div', { class: 'seg p4seg' });
  const draw = () => {
    chips.innerHTML = ''; ITEMS.forEach(([nm, p, k], i) => chips.append(h('button', { class: 'btn sm ia p4chip p4shopc' + (on.has(i) ? ' on' : ''), onclick: e => { e.stopPropagation(); on.has(i) ? on.delete(i) : on.add(i); sfx.pop(i); draw(); } },
      h('span', { class: 'p4shop-ico', html: p4shopIco(k) }), h('span', { class: 'p4shop-nm' }, nm), h('b', { class: 'num' }, `${fmt(p)} บาท`))));
    const sel = ITEMS.filter((_, i) => on.has(i)), est = sel.reduce((t, [, p]) => t + p4r(p, P), 0), ex = sel.reduce((t, [, p]) => t + p, 0);
    tb.innerHTML = sel.length ? sel.map(([nm, p, k]) => `<div><span><i class="p4shop-mini">${p4shopIco(k)}</i>${nm}</span><b class="num">${fmt(p)}</b><i>≈</i><b class="num p4e">${fmt(p4r(p, P))}</b></div>`).join('') : '<div><span>ยังไม่ได้เลือกของ</span></div>';
    big.innerHTML = sel.length ? `ประมาณ <b class="num">${sel.map(([, p]) => fmt(p4r(p, P))).join(' + ')}</b> <b class="fop">=</b> <b class="num">${fmt(est)}</b> บาท` : '';
    out.innerHTML = sel.length ? `ราคาจริงรวม ${fmt(ex)} บาท (ต่างจากค่าประมาณ ${fmt(Math.abs(ex - est))} บาท)<br>มีเงิน ${fmt(BUD)} บาท → ${est <= BUD - 2000 ? '<b>น่าจะพอ</b>' : est <= BUD ? '<b>ค่าประมาณใกล้งบมาก</b> ควรคิดราคาจริง' : '<b>ไม่น่าจะพอ</b>'}` : 'แตะเลือกของที่จะซื้อ';
  };
  seg.append(...[2, 3, 4].map(p => { const b = h('button', { class: p === P ? 'on' : '', onclick: e => { e.stopPropagation(); P = p; seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); sfx.tap(); draw(); } }, 'เต็ม' + P4_RN[p]); return b; }));
  draw();
  return h('div', { class: 'colstack' }, chips, seg, tb, big, out);
}
const p4ex = (rows, fin, say, head) => el => { if (head) el.append(head()); el.append(dcWalk('', rows, fin, say)); };

/* ---------- question types ---------- */
Object.assign(Q, {
  p4Pick({ fig, q, opts, right, hint, say: sy, keep }) {
    return { prompt: q, say: sy || speakText(q), mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q' }, fig ? h('div', { class: 'p4-fig', html: fig }) : null, choices(ctx, (keep ? opts : shuffle(opts)).map(o => ({ value: o, label: o })), right, { hint }))); const sym = opts.every(o => /^(&gt;|&lt;|=|>|<|≠|&ne;)$/.test(String(o).trim())); // v112: > < = buttons as big as in the other games
      bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', sym ? 'sym' : 'txt')); } };
  },
  p4Num({ fig, q, a, hint, say: sy, unit = '' }) {
    return { prompt: q, say: sy || speakText(q), mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q' }, fig ? h('div', { class: 'p4-fig', html: fig }) : null, h('div', { class: 'rowstack' }, answerBox(ctx, String(a), { hint }), unit ? h('span', { class: 'cap', style: { fontSize: '22px' } }, unit) : null))); } };
  }
});
const p4big = html => `<div class="fbig p4big">${html}</div>`;
const p4abQ = (n, rods) => Q.p4Num({ fig: abacusSVG(n, { rods }), q: 'ลูกคิดแสดงจำนวนใด เขียนเป็นตัวเลขฮินดูอารบิก', a: n, hint: 'นับลูกคิดทีละแกน แกนที่ไม่มีลูกคิดเขียน 0' });
const p4abThQ = (n, rods) => Q.p4Pick({ fig: abacusSVG(n, { rods }), q: 'ลูกคิดแสดงจำนวนใด (ตัวเลขไทย)', opts: [n, ...p4near(n)].map(p4th), right: p4th(n), hint: 'นับลูกคิดทีละแกน แล้วเขียนเป็นตัวเลขไทย' });
const p4w2dQ = n => Q.p4Num({ q: `<b>${thaiWords(n)}</b><br>เขียนเป็นตัวเลขฮินดูอารบิกได้อย่างไร`, a: n, hint: 'เขียนทีละหลักจากซ้าย หลักที่ไม่ได้อ่านให้เขียน 0' });
const p4t2dQ = n => Q.p4Num({ fig: p4big(p4th(n)), q: 'ตัวเลขไทยนี้ เขียนเป็นตัวเลขฮินดูอารบิกได้อย่างไร', a: n, hint: '๐=0 ๑=1 ๒=2 ๓=3 ๔=4 ๕=5 ๖=6 ๗=7 ๘=8 ๙=9' });
const p4d2wQ = n => Q.p4Pick({ fig: p4big(`<b class="num">${fmt(n)}</b>`), q: 'จำนวนนี้อ่านว่าอย่างไร', say: 'จำนวนนี้อ่านว่าอย่างไร', opts: [n, ...p4near(n)].map(thaiWords), right: thaiWords(n), hint: n >= 1e6 ? 'อ่านชุดล้านก่อน แล้วต่อด้วย “ล้าน” จากนั้นอ่านชุดหน่วย' : 'อ่านทีละหลักจากซ้าย หลักที่เป็น 0 ไม่ต้องอ่าน' });
const p4w2pQ = (n, pool = []) => { const ds = shuffle(pool.filter(x => x !== n && String(x).length === String(n).length)).slice(0, 2); const opts = [n, ...ds]; p4near(n, 4).forEach(x => { if (opts.length < 4 && !opts.includes(x)) opts.push(x); });
  return Q.p4Pick({ q: `<b>${thaiWords(n)}</b><br>เขียนเป็นตัวเลขใด`, opts: opts.map(fmt), right: fmt(n), hint: 'ชุดล้านอยู่หน้าคำว่า “ล้าน” ส่วนชุดหน่วยต้องมี 6 หลักเสมอ' }); };
const p4digIdx = n => { const s = String(n), c = [...s].map((d, i) => +d ? i : -1).filter(i => i >= 0), u = c.filter(i => s.split(s[i]).length === 2); return pick(u.length ? u : c); };
const p4placeQ = n => { const i = p4digIdx(n), k = 9 - String(n).length + i, near = [k - 2, k - 1, k + 1, k + 2, k + 3].filter(j => j >= 0 && j < 9);
  return Q.p4Pick({ fig: p4big(`<b class="num">${p4u(n, i)}</b>`), q: 'ตัวเลขที่ขีดเส้นใต้อยู่ในหลักใด', opts: [P4_PL[k], ...shuffle(near).slice(0, 3).map(j => P4_PL[j])], right: P4_PL[k], hint: 'นับหลักจากขวา: หน่วย สิบ ร้อย พัน หมื่น แสน ล้าน สิบล้าน ร้อยล้าน' }); };
const p4valQ = n => { const i = p4digIdx(n); return Q.p4Num({ fig: p4big(`<b class="num">${p4u(n, i)}</b>`), q: 'ตัวเลขที่ขีดเส้นใต้มีค่าเท่าใด', a: p4val(n, i), hint: `ตัวเลขที่ขีดเส้นใต้อยู่ใน${p4pl(n, i)} ค่าของตัวเลข = เลขโดด × ค่าประจำหลัก` }); };
function p4expQ(n) {
  const t = p4terms(n), right = t.map(fmt).join(' + '), bad = new Set();
  for (let g = 0; g < 40 && bad.size < 3; g++) { const a = t.slice(), j = rnd(0, a.length - 1), m = g % 3;
    if (m === 0 && a[j] * 10 < 1e9 && !a.includes(a[j] * 10)) a[j] *= 10; else if (m === 1 && a[j] >= 10 && !a.includes(a[j] / 10)) a[j] /= 10; else if (m === 2 && a.length > 3) a.splice(j, 1); else continue;
    const s = a.map(fmt).join(' + '); if (s !== right) bad.add(s); }
  return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(n)}</b>`), q: 'ข้อใดเป็นรูปกระจายของจำนวนนี้', say: 'ข้อใดเป็นรูปกระจายของจำนวนนี้', opts: [right, ...[...bad].slice(0, 3)], right, hint: 'เขียนค่าของเลขโดดทุกตัวที่ไม่ใช่ 0 แล้วนำมาบวกกัน' });
}
const p4fromExpQ = n => Q.p4Num({ q: `<span class="num">${p4expStr(n)}</span><br>เป็นรูปกระจายของจำนวนใด`, a: n, hint: 'นำค่าของแต่ละหลักมารวมกัน หลักที่ไม่มีให้เขียน 0' });
const p4cmpQ = ([a, b]) => Q.p4Pick({ fig: p4big(`<b class="num">${fmt(a)}</b> <span class="fsign">?</span> <b class="num">${fmt(b)}</b>`), q: 'เติมเครื่องหมาย &gt; &lt; หรือ = ให้ถูกต้อง', say: 'เติมเครื่องหมาย มากกว่า น้อยกว่า หรือเท่ากับ', opts: ['&gt;', '&lt;', '='], right: a > b ? '&gt;' : a < b ? '&lt;' : '=', keep: true, hint: 'นับจำนวนหลักก่อน ถ้าเท่ากันให้เทียบเลขโดดจากหลักซ้ายสุด' });
const p4tfQ = ([a, rel, b]) => { const ok = rel === '>' ? a > b : a < b, sa = String(a), sb = String(b); let i = 0; while (sa.length === sb.length && i < sa.length - 1 && sa[i] === sb[i]) i++;
  return Q.hTF({ text: `<b class="num">${fmt(a)} ${rel === '>' ? '&gt;' : '&lt;'} ${fmt(b)}</b>`, ok, why: sa.length !== sb.length ? `${fmt(a)} มี ${sa.length} หลัก ${fmt(b)} มี ${sb.length} หลัก` : `เลขโดดต่างกันครั้งแรกที่${P4_PL[9 - sa.length + i]}: ${sa[i]} กับ ${sb[i]}` }); };
const p4rndQ = (n, pow) => Q.p4Num({ fig: p4big(`<b class="num">${fmt(n)}</b> <b class="fop">≈</b> <span class="fsign">?</span>`), q: `ค่าประมาณเป็นจำนวนเต็ม<span class="hl">${P4_RN[pow]}</span>ของ ${fmt(n)} คือเท่าใด`, say: `ค่าประมาณเป็นจำนวนเต็ม${P4_RN[pow]}ของ ${thaiWords(n)} คือเท่าใด`, a: p4r(n, pow), hint: `ดูตัวเลขหลัก${P4_RN[pow - 1]}: น้อยกว่า 5 ใช้จำนวนเต็ม${P4_RN[pow]}ที่น้อยกว่า · ตั้งแต่ 5 ขึ้นไปใช้จำนวนเต็ม${P4_RN[pow]}ที่มากกว่า` });
function p4whichQ(pow, lo, hi) {
  const U = 10 ** pow, T = rnd(lo, hi) * U, inn = T - U / 2 + rnd(0, U - 1), out = shuffle([T + U / 2 + rnd(0, U / 2 - 1), T - U / 2 - 1 - rnd(0, U / 2 - 1), T + U + rnd(-U / 2, U / 2 - 1), T - U + rnd(-U / 2, U / 2 - 1)]).filter((x, i, A) => p4r(x, pow) !== T && x > 0 && x !== inn && A.indexOf(x) === i).slice(0, 3);
  return Q.p4Pick({ q: `จำนวนใดมีค่าประมาณเป็นจำนวนเต็ม${P4_RN[pow]}เท่ากับ <b class="num">${fmt(T)}</b>`, opts: [inn, ...out].map(fmt), right: fmt(inn), hint: `จำนวนที่ประมาณได้ ${fmt(T)} อยู่ตั้งแต่ ${fmt(T - U / 2)} ถึง ${fmt(T + U / 2 - 1)}` });
}
const p4rTF = (n, pow) => { const r = p4r(n, pow), wrong = Math.random() < .5, shown = wrong ? (r === Math.floor(n / 10 ** pow) * 10 ** pow ? r + 10 ** pow : r - 10 ** pow) : r;
  return Q.hTF({ text: `ค่าประมาณเป็นจำนวนเต็ม${P4_RN[pow]}ของ <b class="num">${fmt(n)}</b> คือ <b class="num">${fmt(shown)}</b>`, ok: !wrong, why: `${fmt(n)} ≈ ${fmt(r)}` }); };

/* ---------- practice data ---------- */
const P4W_3 = [[138148707, 't'], [64500933, 'w'], [205834050, 'd'], [74219278, 't'], [500663491, 'w'], [92347012, 'w'], [804681454, 't'], [33470234, 'd'], [69685769, 'w']];
const P4W_4 = [5753240, 23785100, 28240187, 398913009, 82670231, 30461723, 600439187, 434093974, 12399700, 77213360];
const P4W_4P = [398913009, 12399700, 5753240, 434093974, 77213360, 28240187, 30461823, 30461723, 600439187, 82670231, 23785100, 600430187];
const P4W_PV = [45409858, 121476790, 498000497, 209071743, 647572099];
const P4W_EXP = [64940585, 10334398, 438709220, 938763911, 330329849, 120823415];
const P4W_CMP = [[545045, 538798], [143945, 344905], [238542, 187444], [1140980, 5200000], [9874240, 9874245], [3540054, 3540050], [6179874, 6179800], [9404946, 10000000],
  [184545345, 183078134], [45981204, 450484901], [604983682, 604983683], [500398090, 500398000], [349878241, 349878291], [74955904, 98500553], [90779778, 100000000], [338431142, 338245640]];
const P4W_TF = [[679709, '>', 733987], [605884, '>', 515598], [1244585, '<', 1244584], [2323473, '>', 2451143], [5600801, '<', 4658480], [9988776, '>', 9978755], [7423324, '>', 7423329], [3225417, '<', 3522417],
  [8980004, '>', 8980426], [42264118, '>', 42264107], [40605001, '>', 40405001], [82679912, '>', 82679910], [90244845, '<', 90422845], [104820692, '>', 104280692], [745364749, '>', 745369478]];
const P4W_ASC = [[787347, 749874, 984987, 618973], [439049, 500000, 484738, 499904], [1924808, 2714897, 1268983, 3974839], [6374079, 8263478, 6327898, 3490423], [18409430, 18508373, 18409438, 18409431], [31029840, 10398432, 13984903, 13980293]];
const P4W_DESC = [[397987, 398749, 434198, 324867], [984733, 927984, 904782, 934867], [1479874, 1479870, 1479974, 1470874], [23600018, 23399785, 23375743, 23306874], [66779800, 66979800, 66779890, 66779190], [300449878, 398840938, 397089911, 340878944]];
const P4W_13 = [34800309, 34800359, 148103192, 108981123];
const P4W_R1 = [44, 21, 36, 87, 25, 99, 62, 43, 86, 455, 567, 211, 974, 879, 4185, 2313, 9897, 4266, 7001, 1158];
const P4W_R2 = [79, 734, 487, 751, 674, 148, 414, 348, 901, 3590, 4208, 3661, 7744, 6835, 5365, 2355, 8939, 9273, 7841, 6180];
const P4W_R3 = [7329, 3061, 4984, 5523, 1786, 3102, 6235, 3876, 9480, 1093, 4698, 8965, 17144, 37480, 73265, 62032, 32787, 49489, 58931, 86188];
const P4W_R4 = [48598, 11342, 55677, 65875, 79226, 31884, 36039, 85741, 16753, 23499, 678125, 782379, 591998, 419950, 265501, 377776, 326800, 164446, 819681, 444213];
const P4W_R5 = [84872, 154672, 900093, 460592, 844509, 582411, 750375, 288500, 491822, 171376, 429784, 935807, 611454, 680393];
const P4W_R20 = [4710575, 2837488, 3642098, 9209987, 6432094, 8237562];
const P4W_TOUR = [['เชียงใหม่', 4897984], ['กระบี่', 897489], ['ภูเก็ต', 27480134], ['ชลบุรี', 13418723]];
const p4tourFig = () => `<div class="p4tab"><div class="hd"><span>จังหวัด</span><span>นักท่องเที่ยว (คน)</span></div>${P4W_TOUR.map(([p, n]) => `<div><span>${p}</span><b class="num">${fmt(n)}</b></div>`).join('')}</div>`;
const P4_STORY = [
  { q: 'แม่ซื้อตู้เย็นราคา 8,950 บาท และพัดลมราคา 1,290 บาท ประมาณราคาแต่ละอย่างเป็นจำนวนเต็มพันก่อนบวก แม่จ่ายเงินประมาณกี่บาท', a: 10000, unit: 'บาท', hint: '8,950 ≈ 9,000 · 1,290 ≈ 1,000' },
  { q: 'งานกีฬามีผู้ชมวันเสาร์ 12,480 คน วันอาทิตย์ 17,630 คน ประมาณเป็นจำนวนเต็มพันก่อนบวก มีผู้ชมรวมประมาณกี่คน', a: 30000, unit: 'คน', hint: '12,480 ≈ 12,000 · 17,630 ≈ 18,000' },
  { q: 'ฟาร์มมีไข่ไก่ 48,720 ฟอง ขายไป 21,350 ฟอง ประมาณเป็นจำนวนเต็มหมื่นก่อนลบ เหลือไข่ไก่ประมาณกี่ฟอง', a: 30000, unit: 'ฟอง', hint: '48,720 ≈ 50,000 · 21,350 ≈ 20,000' },
  { q: 'รถบรรทุกขนทราย 3 เที่ยว เที่ยวละ 2,980 กิโลกรัม ประมาณน้ำหนักแต่ละเที่ยวเป็นจำนวนเต็มพัน ขนทรายทั้งหมดประมาณกี่กิโลกรัม', a: 9000, unit: 'กก.', hint: '2,980 ≈ 3,000 แล้วคูณ 3' },
  { q: 'เมืองหนึ่งมีประชากรชาย 1,264,850 คน หญิง 1,318,200 คน ประมาณเป็นจำนวนเต็มแสนก่อนบวก มีประชากรรวมประมาณกี่คน', a: 2600000, unit: 'คน', hint: '1,264,850 ≈ 1,300,000 · 1,318,200 ≈ 1,300,000' },
  { q: 'โรงงานผลิตขวดน้ำได้ 386,400 ขวด ส่งขายไป 215,900 ขวด ประมาณเป็นจำนวนเต็มแสนก่อนลบ เหลือขวดน้ำประมาณกี่ขวด', a: 200000, unit: 'ขวด', hint: '386,400 ≈ 400,000 · 215,900 ≈ 200,000' }
];
const P4_USE = { q: 'สถานการณ์ใดเหมาะกับการใช้ค่าประมาณมากที่สุด', opts: ['บอกจำนวนผู้ชมคอนเสิร์ตในข่าว', 'ทอนเงินให้ลูกค้าที่ร้านค้า', 'กดรหัสเปิดตู้เซฟ', 'บอกเบอร์โทรศัพท์ให้เพื่อน'], right: 'บอกจำนวนผู้ชมคอนเสิร์ตในข่าว', hint: 'ค่าประมาณใช้เมื่อไม่ต้องการตัวเลขที่ถูกต้องทุกหลัก' };

/* ---------- lessons ---------- */
const L4N = (no, place, title, short, goal, teach, game) => ({ id: 400 + no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game });
const p4hop = (start, step, n) => el => el.append(hopStrip(start, step, n));
const LESSONS_P4C1 = [
  L4N(1, 'โอเอซิสหลักแสน', 'การอ่านและเขียนจำนวนนับที่มากกว่า 100,000 แต่ไม่เกิน 1,000,000', 'อ่าน เขียน ไม่เกินล้าน', 'อ่านและเขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือ แสดงจำนวนนับที่มากกว่า 100,000 แต่ไม่เกิน 1,000,000',
    [T('ยินดีต้อนรับสู่ <b>ทะเลทราย ป.4</b>! ลูกคิด 7 แกน — <b>แตะแกน</b>หรือกด + − สร้างจำนวนหลักแสนดูนะ', 'ยินดีต้อนรับสู่ทะเลทราย ป.4 ลูกคิดเจ็ดแกน แตะแกนหรือกดบวกลบ สร้างจำนวนหลักแสนดูนะ', el => el.append(abacusMachine(305240, 7))),
     T('นับเพิ่ม<b>ทีละแสน</b> — สิบแสนเท่ากับ <span class="hl">หนึ่งล้าน</span> (1,000,000)', 'นับเพิ่มทีละแสน สิบแสนเท่ากับหนึ่งล้าน', p4hop(100000, 100000, 10)),
     T('ตัวอย่างทีละขั้น: อ่านและเขียน 708,059', 'ตัวอย่างทีละขั้น อ่านและเขียน เจ็ดแสนแปดพันห้าสิบเก้า', p4ex([['① ดูหลัก', '7 หลักแสน · 0 หลักหมื่น · 8 หลักพัน · 0 หลักร้อย · 5 หลักสิบ · 9 หลักหน่วย'], ['② อ่านทีละหลัก', 'เจ็ดแสน · (หมื่นเป็น 0 ไม่อ่าน) · แปดพัน · (ร้อยเป็น 0 ไม่อ่าน) · ห้าสิบ · เก้า'], ['③ ตัวหนังสือ', 'เจ็ดแสนแปดพันห้าสิบเก้า'], ['④ ตัวเลขไทย', '<span class="thn">๗๐๘,๐๕๙</span>']], '708,059 อ่านว่า <b>เจ็ดแสนแปดพันห้าสิบเก้า</b>', 'เจ็ดแสนแปดพันห้าสิบเก้า', () => p4chart(708059)))],
    () => { const a = p4R(6), b = p4R(6, .35), c = p4R(6, .35), d = p4R(6), e = p4R(6, .3), st = rnd(1, 6) * 100000;
      return [p4abQ(a, 7), p4w2dQ(b), p4d2wQ(c), p4abThQ(d, 7), p4t2dQ(e), Q.p4Num({ fig: p4big(`<b class="num">${fmt(st)} · ${fmt(st + 100000)} · <span class="fsign">?</span> · ${fmt(st + 300000)}</b>`), q: 'นับเพิ่มทีละแสน จำนวนที่หายไปคือเท่าใด', a: st + 200000, hint: 'เพิ่มทีละ 100,000' })]; }),
  L4N(2, 'เนินทรายหลักล้าน', 'การอ่านและเขียนจำนวนนับที่มากกว่า 1,000,000', 'อ่าน เขียน หลักล้าน', 'อ่านและเขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือ แสดงจำนวนนับที่มากกว่า 1,000,000',
    [T('จำนวนหลักล้านแบ่งเป็น 2 ชุด: <b>ชุดล้าน</b> กับ <b>ชุดหน่วย</b> (6 หลัก) กด<b>อ่านทีละชุด</b>', 'จำนวนหลักล้านแบ่งเป็นสองชุด ชุดล้าน กับชุดหน่วย กดอ่านทีละชุด', el => el.append(simReadSplit([27305618, 140000925, 9060300, 315482007]))),
     T('ลูกคิด 9 แกน ถึง<b>หลักร้อยล้าน</b> — ลองสร้างจำนวนดูนะ', 'ลูกคิดเก้าแกน ถึงหลักร้อยล้าน ลองสร้างจำนวนดูนะ', el => el.append(abacusMachine(52407316, 9))),
     T('ตัวอย่างทีละขั้น: เขียน “สามสิบล้านสองหมื่นหกพันเจ็ด” เป็นตัวเลข', 'ตัวอย่างทีละขั้น เขียน สามสิบล้านสองหมื่นหกพันเจ็ด เป็นตัวเลข', p4ex([['① ชุดล้าน', 'หน้าคำว่า “ล้าน” คือ สามสิบ → 30'], ['② ชุดหน่วย', 'สองหมื่นหกพันเจ็ด → ต้องเขียนให้ครบ 6 หลัก: 026,007'], ['③ รวมกัน', '30 ต่อด้วย 026,007 → 30,026,007'], ['④ ตัวเลขไทย', '<span class="thn">๓๐,๐๒๖,๐๐๗</span>']], 'สามสิบล้านสองหมื่นหกพันเจ็ด = <b>30,026,007</b>', 'สามสิบล้านสองหมื่นหกพันเจ็ด เขียนเป็น สามศูนย์ ศูนย์สองหก ศูนย์ศูนย์เจ็ด'))],
    () => { const w3 = pkF(P4W_3, 3).map(([n, k]) => k === 'd' ? p4d2wQ(n) : k === 't' ? p4t2dQ(n) : p4w2dQ(n));
      return [...w3, ...pkF(P4W_4, 3).map(n => p4w2pQ(n, P4W_4P))]; }),
  L4N(3, 'กระโจมค่าประจำหลัก', 'หลัก ค่าประจำหลักและการเขียนตัวเลขแสดงจำนวนในรูปกระจาย', 'หลัก · ค่าประจำหลัก', 'บอกหลัก ค่าประจำหลัก ค่าของเลขโดดในแต่ละหลัก และเขียนตัวเลขแสดงจำนวนในรูปกระจาย',
    [T('<b>แตะเลขโดดทุกตัว</b> — ดูว่าอยู่หลักใด มีค่าเท่าใด แล้วรูปกระจายจะค่อย ๆ ครบ', 'แตะเลขโดดทุกตัว ดูว่าอยู่หลักใด มีค่าเท่าใด แล้วรูปกระจายจะค่อย ๆ ครบ', el => el.append(simP4Tap([52407316, 806150243, 7030900]))),
     T('ตัวอย่างทีละขั้น: เขียน 316,058,204 ในรูปกระจาย', 'ตัวอย่างทีละขั้น เขียนสามร้อยสิบหกล้านห้าหมื่นแปดพันสองร้อยสี่ ในรูปกระจาย', p4ex([['① ชุดล้าน', '3 → 300,000,000 · 1 → 10,000,000 · 6 → 6,000,000'], ['② ชุดหน่วย', '0 หลักแสน (ข้าม) · 5 → 50,000 · 8 → 8,000 · 2 → 200 · 0 หลักสิบ (ข้าม) · 4 → 4'], ['③ นำมาบวกกัน', '300,000,000 + 10,000,000 + 6,000,000 + 50,000 + 8,000 + 200 + 4']], 'รูปกระจายเขียนเฉพาะค่าของเลขโดดที่ไม่ใช่ 0')),
     T('ตัวอย่างทีละขั้น: เลขโดดเดียวกัน ต่างหลัก ค่าไม่เท่ากัน', 'ตัวอย่างทีละขั้น เลขโดดเดียวกัน ต่างหลัก ค่าไม่เท่ากัน', p4ex([['7 ตัวแรก', 'ใน 7,370,000 อยู่หลักล้าน มีค่า 7,000,000'], ['7 ตัวที่สอง', 'อยู่หลักหมื่น มีค่า 70,000'], ['ค่าต่างกัน', '7,000,000 − 70,000 = 6,930,000']], 'เลขโดดเหมือนกัน แต่<b>ค่าประจำหลัก</b>ต่างกัน ค่าจึงต่างกัน', 'เลขโดดเหมือนกัน แต่ค่าประจำหลักต่างกัน ค่าจึงต่างกัน', () => p4chart(7370000)))],
    () => { const pv = pkF(P4W_PV, 4), ex = pkF(P4W_EXP, 2); return [p4placeQ(pv[0]), p4valQ(pv[1]), p4placeQ(pv[2]), p4valQ(pv[3]), p4expQ(ex[0]), p4fromExpQ(ex[1])]; }),
  L4N(4, 'ตลาดอูฐ', 'การเปรียบเทียบและเรียงลำดับ', 'เปรียบเทียบ · เรียงลำดับ', 'เปรียบเทียบและเรียงลำดับจำนวนนับที่มากกว่า 100,000 โดยใช้เครื่องหมาย = ≠ > <',
    [T('เปรียบเทียบจำนวน: นับ<b>จำนวนหลัก</b>ก่อน ถ้าเท่ากันค่อยเทียบ<b>ทีละหลักจากซ้าย</b>', 'เปรียบเทียบจำนวน นับจำนวนหลักก่อน ถ้าเท่ากันค่อยเทียบทีละหลักจากซ้าย', el => el.append(simCmpP4([[3804215, 987654], [56120473, 56102473], [240318500, 240318900]]))),
     T('ตัวอย่างทีละขั้น: เรียงจากน้อยไปมาก', 'ตัวอย่างทีละขั้น เรียงจากน้อยไปมาก', p4ex([['จำนวน', '7,215,300 · 7,251,030 · 725,103 · 72,510,300'], ['① นับหลัก', '725,103 มี 6 หลัก (น้อยที่สุด) · 72,510,300 มี 8 หลัก (มากที่สุด)'], ['② เทียบ 7 หลัก', '7,215,300 กับ 7,251,030: หลักแสน 2 เท่ากัน → หลักหมื่น 1 น้อยกว่า 5'], ['③ เรียง', '725,103 &lt; 7,215,300 &lt; 7,251,030 &lt; 72,510,300']], 'เรียงจากมากไปน้อย ก็แค่กลับลำดับ'))],
    () => [...pkF(P4W_CMP, 2).map(p4cmpQ), p4tfQ(pick(P4W_TF)), Q.order({ nums: pick(P4W_ASC), dir: 'asc' }), Q.order({ nums: pick(P4W_DESC), dir: 'desc' }),
      (k => Q.p4Pick({ q: `จำนวนใด<span class="hl">${k ? 'มากที่สุด' : 'น้อยที่สุด'}</span>`, opts: P4W_13.map(fmt), right: fmt(k ? Math.max(...P4W_13) : Math.min(...P4W_13)), hint: 'นับจำนวนหลักก่อน แล้วเทียบจากหลักซ้ายสุด' }))(rnd(0, 1))]),
  L4N(5, 'ทรายเต็มสิบ', 'ค่าประมาณเป็นจำนวนเต็มสิบ', 'ประมาณเต็มสิบ', 'หาค่าประมาณเป็นจำนวนเต็มสิบ โดยดูตัวเลขในหลักหน่วย',
    [T('<b>ลากจุด</b>บนเส้นจำนวน — จำนวนนี้ใกล้จำนวนเต็มสิบใดมากกว่า?', 'ลากจุดบนเส้นจำนวน จำนวนนี้ใกล้จำนวนเต็มสิบใดมากกว่า', el => el.append(p4Round(364, 1))),
     T('ตัวอย่างทีละขั้น: 5,307 และ 2,465', 'ตัวอย่างทีละขั้น', p4ex([['5,307', 'อยู่ระหว่าง 5,300 กับ 5,310 · หลักหน่วยคือ 7 ≥ 5 → 5,307 ≈ 5,310'], ['2,465', 'อยู่ระหว่าง 2,460 กับ 2,470 · หลักหน่วยคือ 5 อยู่กึ่งกลางพอดี'], ['กึ่งกลาง', 'ใช้จำนวนเต็มสิบที่มากกว่า → 2,465 ≈ 2,470']], 'หลักหน่วย <b>น้อยกว่า 5</b> → ใช้จำนวนเต็มสิบที่น้อยกว่า · <b>ตั้งแต่ 5</b> → ใช้จำนวนเต็มสิบที่มากกว่า'))],
    () => [...pkF(P4W_R1, 4).map(n => p4rndQ(n, 1)), p4whichQ(1, 30, 900), p4rTF(rnd(1001, 9999), 1)]),
  L4N(6, 'ทรายเต็มร้อย', 'ค่าประมาณเป็นจำนวนเต็มร้อย', 'ประมาณเต็มร้อย', 'หาค่าประมาณเป็นจำนวนเต็มร้อย โดยดูตัวเลขในหลักสิบ',
    [T('<b>ลากจุด</b>หรือกดปุ่ม — ดูตัวเลข<b>หลักสิบ</b>เพื่อตัดสินใจ', 'ลากจุดหรือกดปุ่ม ดูตัวเลขหลักสิบเพื่อตัดสินใจ', el => el.append(p4Round(6438, 2))),
     T('ตัวอย่างทีละขั้น: 12,951 เป็นจำนวนเต็มร้อย', 'ตัวอย่างทีละขั้น หนึ่งหมื่นสองพันเก้าร้อยห้าสิบเอ็ด เป็นจำนวนเต็มร้อย', p4ex([['① ระหว่าง', '12,951 อยู่ระหว่าง 12,900 กับ 13,000'], ['② ดูหลักสิบ', 'หลักสิบคือ 5 ตั้งแต่ 5 ขึ้นไป'], ['③ สรุป', 'ใช้จำนวนเต็มร้อยที่มากกว่า → 12,951 ≈ 13,000']], 'ระวัง! 900 ปัดขึ้นเป็น 1,000 จึงต้องเพิ่มหลักพันด้วย'))],
    () => [...pkF(P4W_R2, 4).map(n => p4rndQ(n, 2)), p4whichQ(2, 12, 95), p4rTF(rnd(10001, 99999), 2)]),
  L4N(7, 'ทรายเต็มพัน', 'ค่าประมาณเป็นจำนวนเต็มพัน', 'ประมาณเต็มพัน', 'หาค่าประมาณเป็นจำนวนเต็มพัน โดยดูตัวเลขในหลักร้อย',
    [T('<b>ลากจุด</b>บนเส้นจำนวน — ดูตัวเลข<b>หลักร้อย</b>', 'ลากจุดบนเส้นจำนวน ดูตัวเลขหลักร้อย', el => el.append(p4Round(25716, 3))),
     T('ตัวอย่างทีละขั้น: 499,620 เป็นจำนวนเต็มพัน', 'ตัวอย่างทีละขั้น สี่แสนเก้าหมื่นเก้าพันหกร้อยยี่สิบ เป็นจำนวนเต็มพัน', p4ex([['① ระหว่าง', '499,620 อยู่ระหว่าง 499,000 กับ 500,000'], ['② ดูหลักร้อย', 'หลักร้อยคือ 6 ตั้งแต่ 5 ขึ้นไป'], ['③ สรุป', 'ใช้จำนวนเต็มพันที่มากกว่า → 499,620 ≈ 500,000']], 'ค่าประมาณเป็นจำนวนเต็มพัน หลักร้อย สิบ หน่วย เป็น 0 เสมอ'))],
    () => [...pkF(P4W_R3, 4).map(n => p4rndQ(n, 3)), p4whichQ(3, 12, 95), p4rTF(rnd(100001, 999999), 3)]),
  L4N(8, 'ทรายหมื่นแสนล้าน', 'ค่าประมาณเป็นจำนวนเต็มหมื่น จำนวนเต็มแสน จำนวนเต็มล้าน', 'เต็มหมื่น แสน ล้าน', 'หาค่าประมาณเป็นจำนวนเต็มหมื่น จำนวนเต็มแสน และจำนวนเต็มล้าน',
    [T('เลือก<b>เต็มหมื่น เต็มแสน หรือเต็มล้าน</b> — จำนวนเดียวกันได้ค่าประมาณต่างกัน', 'เลือกเต็มหมื่น เต็มแสน หรือเต็มล้าน จำนวนเดียวกันได้ค่าประมาณต่างกัน', el => el.append(p4Round(3746815, 4, { pows: [4, 5, 6] }))),
     T('ตัวอย่างทีละขั้น: 2,549,300', 'ตัวอย่างทีละขั้น สองล้านห้าแสนสี่หมื่นเก้าพันสามร้อย', p4ex([['เต็มหมื่น', 'ดูหลักพัน 9 ≥ 5 → 2,550,000'], ['เต็มแสน', 'ดูหลักหมื่น 4 &lt; 5 → 2,500,000'], ['เต็มล้าน', 'ดูหลักแสน 5 ≥ 5 → 3,000,000']], 'ดูตัวเลข<b>หลักที่อยู่ทางขวา</b>ของหลักที่ต้องการประมาณเสมอ', '', () => p4chart(2549300)))],
    () => { const mil = () => pick([...P4W_R20, rnd(11, 98) * 100000 + rnd(1, 99999), rnd(101, 980) * 100000 + rnd(1, 99999)]); // v112 (ผู้ใช้ขอ): หมื่น แสน ล้าน สลับกันแบบสุ่ม
      return shuffle([...pkF(P4W_R4, 3).map(n => p4rndQ(n, 4)), ...pkF(P4W_R5, 3).map(n => p4rndQ(n, 5)), ...[mil(), mil(), mil()].map(n => p4rndQ(n, 6))]).map(q => ({ ...q, __diff: Math.random() * 10 })); }),
  L4N(9, 'คาราวานค่าประมาณ', 'การนำค่าประมาณไปใช้', 'ใช้ค่าประมาณ', 'นำค่าประมาณไปใช้ในชีวิตประจำวัน เช่น ประมาณผลบวก ผลลบ และบอกปริมาณ',
    [T('เลือกของที่จะซื้อและวิธีประมาณ — เงิน 25,000 บาท<b>พอไหม</b>?', 'เลือกของที่จะซื้อและวิธีประมาณ เงินสองหมื่นห้าพันบาทพอไหม', el => el.append(simEstShop())),
     T('ตัวอย่างทีละขั้น: ประมาณก่อนบวก', 'ตัวอย่างทีละขั้น ประมาณก่อนบวก', el => { el.append(h('div', { class: 'storybox', html: 'ห้องสมุดมีหนังสือ 38,460 เล่ม ซื้อเพิ่มอีก 9,720 เล่ม รวมมีหนังสือประมาณกี่เล่ม (ประมาณเป็นจำนวนเต็มพัน)' }));
       p4ex([['① ประมาณ', '38,460 ≈ 38,000 · 9,720 ≈ 10,000'], ['② บวก', '38,000 + 10,000 = 48,000'], ['③ ตรวจ', 'ผลบวกจริง 48,180 ใกล้กับ 48,000']], 'มีหนังสือประมาณ <b>48,000 เล่ม</b>', 'มีหนังสือประมาณสี่หมื่นแปดพันเล่ม')(el); })],
    () => { const [a, b] = pkF(P4W_TOUR, 2);
      return [Q.p4Pick({ fig: p4tourFig(), q: 'จังหวัดใดมีนักท่องเที่ยวมากที่สุด', opts: P4W_TOUR.map(x => x[0]), right: 'ภูเก็ต', hint: 'นับจำนวนหลักก่อน' }),
        Q.p4Num({ fig: p4tourFig(), q: `นักท่องเที่ยว${a[0]}ประมาณเป็นจำนวนเต็มล้านได้กี่คน`, a: p4r(a[1], 6), hint: 'ดูตัวเลขหลักแสน' }),
        Q.p4Num({ fig: p4tourFig(), q: `นักท่องเที่ยว${b[0]}ประมาณเป็นจำนวนเต็มล้านได้กี่คน`, a: p4r(b[1], 6), hint: 'ดูตัวเลขหลักแสน' }),
        ...pkF(P4_STORY, 2).map(s => Q.p4Num(s)), Q.p4Pick(P4_USE)]; })
];

/* ---------- boss 419: ข้อสอบท้ายบท — แต่งใหม่ทั้งหมด ---------- */
const P4BOX = '<span class="p4box"></span>';
const EXAM_P4C1 = [
  { q: 'จำนวนใดมีตัวเลข 4 อยู่ในหลักพัน และอ่านว่า เจ็ดแสนสามหมื่นสี่พันหกสิบ', opts: ['734,600', '734,060', '743,060', '730,460'], a: 1 },
  { q: 'ตัวเลข 5 ในข้อใดมีค่าต่างจากข้ออื่น', opts: ['354,120', '851,004', '652,370', '905,211'], a: 3 },
  { q: 'พิจารณาการเขียนในรูปกระจายต่อไปนี้<br>1) 507,040 = 500,000 + 7,000 + 40<br>2) 230,605 = 200,000 + 30,000 + 600 + 5<br>3) 941,300 = 900,000 + 40,000 + 1,000 + 30<br>ข้อใดถูกต้อง', opts: ['1) , 2)', '1) , 3)', '2) , 3)', '1) , 2) , 3)'], a: 0 },
  { q: 'จำนวนใดมีค่ามากกว่า 648,205', opts: ['648,195', '638,205', '684,025', '647,999'], a: 2 },
  { q: 'จำนวนใดมีค่าน้อยกว่า 390,410', opts: ['390,401', '390,500', '391,410', '399,041'], a: 0 },
  { q: 'ตัวเลข 4 ในข้อใดอยู่ในหลักแสนทั้งหมด', opts: ['412,300   480,056   409,999', '341,200   427,800   401,350', '204,113   450,300   432,111', '415,000   344,560   470,002'], a: 0 },
  { q: 'จำนวนในข้อใดมีค่ามากที่สุด', opts: ['805,996', '850,069', '849,999', '805,999'], a: 1 },
  { q: 'จำนวนในข้อใดมีค่าน้อยที่สุด', opts: ['303,030', '330,300', '300,333', '333,000'], a: 2 },
  { q: 'ค่าของตัวเลข 7 สองตัวในจำนวน 704,075 ต่างกันอยู่เท่าไร', opts: ['699,930', '700,070', '699,300', '690,930'], a: 0 },
  { q: '5<u>3</u>6,41<u>3</u> ตัวเลข 3 ที่ขีดเส้นใต้แตกต่างกันในเรื่องใด', opts: ['รูปร่างของตัวเลข', 'ค่าของตัวเลขตามหลัก', 'เป็นจำนวนคู่หรือคี่', 'วิธีอ่านตัวเลขโดด'], a: 1 },
  { q: 'จำนวน 1<u>7</u>4,300 และ 2,9<u>7</u>0,815 ตัวเลข 7 ของทั้งสองจำนวนเหมือนกันในเรื่องใด', opts: ['อยู่ในหลักหมื่นและมีค่า 70,000 เท่ากัน', 'อยู่ในหลักแสนเหมือนกัน', 'อยู่ในหลักพันเหมือนกัน', 'อยู่ในหลักล้านเหมือนกัน'], a: 0 },
  { q: 'ข้อใดใช้เครื่องหมายแสดงการเปรียบเทียบได้ถูกต้อง', opts: ['45,302 > 45,320', '70,118 = 70,181', '62,940 < 62,904', '38,075 ≠ 38,057'], a: 3 },
  { q: `${P4BOX}   524,300   612,850<br>ควรเติมจำนวนใดในช่องว่าง เพื่อให้เรียงจากน้อยไปมาก`, opts: ['498,760', '530,100', '612,900', '700,000'], a: 0 },
  { q: '418,592 ตัวเลข 8 มีค่ามากกว่าตัวเลข 9 เพราะเหตุใด', opts: ['ตัวเลข 8 อยู่ในหลักที่สูงกว่า', 'ตัวเลข 8 เป็นจำนวนคู่', 'ตัวเลข 8 อยู่ทางขวาของตัวเลข 9', 'ตัวเลข 8 มีหลายหลักกว่า'], a: 0 },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['5,204,318 > 5,204,138', '708,990 < 709,000', '2,450,000 = 2,450,000', '1,836,527 < 1,836,507'], a: 3 },
  { q: '360,409 มีค่าเท่ากับข้อใด', opts: ['300,000 + 60,000 + 400 + 90', { html: '<span class="thn">๓๖๐,๔๐๙</span>', say: 'ตัวเลขไทย สามหกศูนย์ สี่ศูนย์เก้า' }, 'สามแสนหกหมื่นสี่พันเก้า', 'สามแสนหกพันสี่ร้อยเก้า'], a: 1 },
  { q: `350   3,500   35,000   ${P4BOX}<br>เติมจำนวนใดลงในช่องว่าง`, opts: ['35,500', '350,000', '353,500', '3,500,000'], a: 1 },
  { q: '74,830   74,730   74,630 ...<br>จำนวนถัดไป 3 จำนวน คือจำนวนใด', opts: ['74,530   74,430   74,330', '74,530   74,630   74,730', '74,620   74,610   74,600', '74,530   74,529   74,528'], a: 0 },
  { q: `620,000   620,250   ${P4BOX}   620,750<br>จำนวนใน ${P4BOX} คือจำนวนใด`, opts: ['620,300', '620,500', '621,000', '620,450'], a: 1 },
  { q: 'ตัวเลข 6 สองตัวของจำนวนในข้อใดมีค่าต่างกัน 59,940', opts: ['616,250', '406,961', '160,006', '265,163'], a: 3 }
];
LESSONS_P4C1.push({ id: 419, boss: true, place: 'รังราชาแมงป่อง', title: 'ด่านบอส: บทที่ 1 จำนวนนับที่มากกว่า 100,000', short: 'ด่านบอส · ข้อสอบ', tone: 'orange',
  goal: 'ตอบคำถามเรื่องจำนวนนับที่มากกว่า 100,000 จำนวน 20 ข้อ ตอบถูก 10 ข้อขึ้นไปเพื่อพิชิตทะเลทราย',
  exam: EXAM_P4C1, pass: 10, bossName: 'ราชาแมงป่อง', bossPal: 'orange', emblem: '1M', bossKind: 'scorp' });
