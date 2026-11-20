/* =========================================================
   GRADE 4 · CHAPTER 3 — การคูณและการหารจำนวนนับ  (ทะเลทราย)
   ========================================================= */
/* ---------- generic right-aligned digit stack (rows of digits on a place grid) ---------- */
function p4stackHTML(rows, n, o = {}) {
  let s = `<div class="p4col${o.sm ? ' sm' : ''}" style="grid-template-columns:1.1em repeat(${n},1.25em)">`;
  rows.forEach(r => {
    if (r.line) { s += `<span class="ln${r.dbl ? ' dbl' : ''}" style="grid-column:1 / span ${n + 1}"></span>`; return; }
    s += `<span class="${r.s ? 'sg' : ''}">${r.s || ''}</span>`;
    const t = String(r.t == null ? '' : r.t).padStart(n, ' ').slice(-n);
    for (let c = 0; c < n; c++) { const p = n - 1 - c, ch = t[c]; s += `<span class="${r.cls || 'dg'}${r.z && p < r.z ? ' z' : ''}${o.hi === p ? ' hi' : ''}">${ch === ' ' ? '' : ch}</span>`; }
  });
  return s + '</div>';
}
const p4step = (l, g, s, lo, hi) => stepper(l, g, s, lo, hi, () => {});
const p4wrap = html => h('div', { class: 'p4colwrap', html });
const p4ld = n => String(n).length;

/* ---------- × one digit, with carries ---------- */
function p4mul1Plan(a, m) {
  const A = p4D(a), steps = []; let c = 0;
  A.forEach((d, p) => { const s = d * m + c; steps.push({ p, d, s, c, out: s % 10, carry: Math.floor(s / 10), last: p === A.length - 1 }); c = Math.floor(s / 10); });
  return steps;
}
const p4mul1Rows = (a, m) => p4mul1Plan(a, m).map(s => [P4_SN[8 - s.p], `${s.d} × ${m}${s.c ? ` + ${s.c} (ที่ทดมา)` : ''} = ${s.s}` + (s.last ? ` → เขียน ${s.s}` : s.carry ? ` → เขียน ${s.out} ทด ${s.carry}` : '')]);
function simMul1(list) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const [a, m] = list[idx], r = a * m, n = p4ld(r), plan = p4mul1Plan(a, m); box.innerHTML = '';
    const fig = h('div', { class: 'p4colwrap' }), note = fNote(), fin = h('div', { class: 'fbig p4est' }); let k = 0, res = '', car = ' '.repeat(n), hi = -1;
    const paint = () => fig.innerHTML = p4stackHTML([{ t: car, cls: 'mk' }, { t: a }, { s: '×', t: m }, { line: true }, { t: res, cls: 'dg rs' }, { line: true, dbl: true }], n, { hi });
    note.innerHTML = 'คูณทีละหลักจาก<b>หลักหน่วย</b> ผลคูณครบ 10 ให้ทดไปหลักทางซ้าย';
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const s = plan[k++]; hi = s.p;
      res = (s.last ? String(s.s) : String(s.out)) + res; if (!s.last && s.carry) { const ca = car.split(''); ca[n - 2 - s.p] = String(s.carry); car = ca.join(''); }
      note.innerHTML = `หลัก${P4_SN[8 - s.p]}: ${s.d} × ${m}${s.c ? ` + ${s.c} (ที่ทดมา)` : ''} = ${s.s}` + (s.last ? ` → เขียน ${s.s}` : s.carry ? ` → เขียน ${s.out} <b>ทด ${s.carry}</b>` : ''); sfx.pop(k);
      if (k >= plan.length) { hi = -1; btn.remove(); fin.innerHTML = `${fmt(a)} × ${m} = <b class="num">${fmt(r)}</b>`; sfx.ok(); say(`${thaiWords(a)} คูณ ${m} เท่ากับ ${thaiWords(r)}`, true); }
      paint(); } }, icon('right'), 'คูณหลักต่อไป');
    paint(); box.append(fig, note, btn, fin, p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'โจทย์ใหม่'));
  };
  draw(); return box;
}
/* ---------- long multiplication: partial products, then add ---------- */
function p4mulParts(a, b) { return p4D(b).map((d, j) => ({ j, d, v: a * d * 10 ** j })).filter(x => x.d); }
function simMulLong(list) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const [a, b] = list[idx], r = a * b, parts = p4mulParts(a, b), n = Math.max(p4ld(r), ...parts.map(x => p4ld(x.v))); box.innerHTML = '';
    const fig = h('div', { class: 'p4colwrap' }), note = fNote(), fin = h('div', { class: 'fbig p4est' }); let k = 0;
    const paint = () => { const rows = [{ t: a }, { s: '×', t: b }, { line: true }, ...parts.slice(0, k).map((x, i) => ({ s: i === parts.length - 1 && k > parts.length ? '+' : '', t: x.v, z: x.j }))];
      if (k > parts.length) rows.push({ line: true }, { t: r, cls: 'dg rs' }, { line: true, dbl: true }); fig.innerHTML = p4stackHTML(rows, n); };
    note.innerHTML = 'คูณ<b>ทีละหลักของตัวคูณ</b> ได้ผลคูณย่อย แล้วนำมาบวกกัน';
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); k++;
      if (k <= parts.length) { const x = parts[k - 1]; note.innerHTML = `คูณด้วยหลัก${P4_SN[8 - x.j]}: ${fmt(a)} × ${fmt(x.d * 10 ** x.j)} → ${fmt(a)} × ${x.d} = ${fmt(a * x.d)}` + (x.j ? ` แล้วเติม 0 อีก ${x.j} ตัว = <b>${fmt(x.v)}</b>` : ` = <b>${fmt(x.v)}</b>`); }
      else { note.innerHTML = `นำผลคูณย่อยมาบวกกัน: ${parts.map(x => fmt(x.v)).join(' + ')} = <b>${fmt(r)}</b>`; btn.remove(); fin.innerHTML = `${fmt(a)} × ${fmt(b)} = <b class="num">${fmt(r)}</b>`; sfx.ok(); say(`${thaiWords(a)} คูณ ${thaiWords(b)} เท่ากับ ${thaiWords(r)}`, true); }
      sfx.pop(k); paint(); } }, icon('right'), 'ขั้นต่อไป');
    paint(); box.append(fig, note, btn, fin, p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'โจทย์ใหม่'));
  };
  draw(); return box;
}
const p4mulLongRows = (a, b) => [...p4mulParts(a, b).map(x => [`× ${fmt(x.d * 10 ** x.j)}`, `${fmt(a)} × ${x.d} = ${fmt(a * x.d)}${x.j ? ` เติม 0 อีก ${x.j} ตัว → ${fmt(x.v)}` : ''}`]), ['บวก', `${p4mulParts(a, b).map(x => fmt(x.v)).join(' + ')} = ${fmt(a * b)}`]];
const p4mulFig = (a, b, sm) => p4stackHTML([{ t: a }, { s: '×', t: b }, { line: true }], Math.max(p4ld(a), p4ld(b)) + 1, { sm });
/* ---------- × multiples of 100 / 1,000 / 10,000 ---------- */
function simMulZeros(bases) {
  let bi = 0, d = 4, z = 2; const out = h('div', { class: 'colstack' }), eqs = h('div', { class: 'colstack fstory' }), note = fNote();
  const paint = () => { const a = bases[bi], m = d * 10 ** z, p = a * d, r = a * m, zs = '0'.repeat(z);
    eqs.innerHTML = `<div class="fst-row"><b>① คูณตัวเลขหน้า 0</b><span class="num">${fmt(a)} × ${d} = ${fmt(p)}</span></div><div class="fst-row"><b>② เติม 0 อีก ${z} ตัว</b><span class="num">${fmt(p)} → ${fmt(r).replace(new RegExp(`(${'0,?'.repeat(z).replace(/,\?$/, '')})$`), '<u class="p4z">$1</u>')}</span></div>`;
    note.innerHTML = `<b class="num">${fmt(a)} × ${fmt(m)} = ${fmt(r)}</b><br>${fmt(m)} = ${d} × ${fmt(10 ** z)} → มี 0 อยู่ ${z} ตัว`; };
  const st = (lab, get, set, lo, hi) => p4step(lab, get, v => { set(v); paint(); }, () => lo, () => hi);
  out.append(h('div', { class: 'rowstack' }, st('ตัวคูณ', () => d, v => d = v, 1, 9), st('จำนวน 0', () => z, v => z = v, 2, 4)), eqs, note, p4more(() => { bi = (bi + 1) % bases.length; paint(); }, 'ตัวตั้งใหม่'));
  paint(); return out;
}
/* v114 (ผู้ใช้ขอ): ผาเลขศูนย์ — หน้าแรก: โจทย์ → ดูรูปแบบทีละแถว → วิธีคิด · ตัวอย่างทีละขั้น: เห็นภาพทุกครั้งที่กด */
const p4zSplit = n => { const z = (String(n).match(/0*$/) || [''])[0].length; return { core: n / 10 ** z, z }; };
const p4zNum = (n, zc, cls = 'p4z0') => { const s = fmt(n), z = (String(n).match(/0*$/) || [''])[0].length; let k = 0, out = ''; for (let i = s.length - 1; i >= 0; i--) { const ch = s[i]; if (ch !== ',' && k < Math.min(z, zc ?? z)) { out = `<span class="${cls}">${ch}</span>` + out; k++; } else out = (ch === ',' && k < Math.min(z, zc ?? z) ? `<span class="${cls}">,</span>` : ch) + out; } return `<span class="p4zn">${out}</span>`; };
function simZeroIntro(a = 1234, d = 3) {
  const wait = h6wait(), tab = h('div', { class: 'p4zt' }), how = h('div', { class: 'fnote p4zhow', hidden: true }); let k = 0;
  const rowsN = [0, 1, 2, 3], paint = () => { tab.innerHTML = rowsN.slice(0, k).map(z => { const m = d * 10 ** z; return `<div class="p4zr${z === k - 1 ? ' nw' : ''}"><b class="num">${fmt(a)} × ${p4zNum(m)}</b><i>=</i><b class="num">${p4zNum(a * m, z)}</b><span class="p4zc">${z ? `0 ${z} ตัว → 0 ${z} ตัว` : 'ไม่มี 0'}</span></div>`; }).join(''); };
  const btn = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (k < rowsN.length) { k++; sfx.pop(k); paint(); }
    if (k >= rowsN.length) { btn.remove(); how.hidden = false; sfx.ok(); teachDone(wait); } } }, icon('right'), 'ดูแถวต่อไป');
  how.innerHTML = `<b>วิธีคิด</b> คูณกับพหุคูณของ 10, 100, 1,000<br>① คูณ<b>เลขที่ไม่ใช่ 0</b> ก่อน: ${fmt(a)} × ${d} = ${fmt(a * d)}<br>② <b>นับ 0</b> ท้ายตัวคูณ (และตัวตั้ง): ${fmt(d * 1000)} มี 0 อยู่ <b>3 ตัว</b><br>③ <b>เติม 0</b> จำนวนเท่านั้นท้ายผลคูณ: ${fmt(a * d)} → <b class="num">${p4zNum(a * d * 1000, 3)}</b>`;
  return h('div', { class: 'colstack' }, wait, h('div', { class: 'storybox', html: `<b>โจทย์</b> <b class="num">${fmt(a)} × ${fmt(d * 1000)} = ?</b> — ลองดูรูปแบบก่อน: ตัวคูณมี 0 เพิ่มขึ้น ผลคูณเปลี่ยนอย่างไร` }), tab, btn, how);
}
function zeroWalk(a, b) {
  const A = p4zSplit(a), B = p4zSplit(b), Z = A.z + B.z, core = A.core * B.core, r = a * b, wait = h6wait(), scene = h('div', { class: 'p4zw' }), now = h('div', { class: 'cwk-now' }); let k = 0;
  const zs = n => `<span class="p4z0">${'0'.repeat(n)}</span>`, part = (S, hi) => `<span class="p4zn"><span class="${hi ? 'p4zcore' : ''}">${fmt(S.core)}</span>${S.z ? zs(S.z) : ''}</span>`;
  const ST = [
    { t: 'โจทย์: หาผลคูณ', v: () => `<div class="p4zeq num">${fmt(a)} <i>×</i> ${fmt(b)} <i>=</i> <span class="fsign">?</span></div>` },
    { t: `<b>แยก 0 ท้ายจำนวน</b>ออกมาก่อน — ${fmt(b)} = ${fmt(B.core)} × ${fmt(10 ** B.z)}` + (A.z ? ` และ ${fmt(a)} = ${fmt(A.core)} × ${fmt(10 ** A.z)}` : ''), v: () => `<div class="p4zeq num">${part(A, 1)} <i>×</i> ${part(B, 1)} <i>=</i> <span class="fsign">?</span></div><div class="p4zsplit num">${fmt(b)} = <span class="p4zcore">${fmt(B.core)}</span> × ${1}${zs(B.z)}${A.z ? ` · ${fmt(a)} = <span class="p4zcore">${fmt(A.core)}</span> × 1${zs(A.z)}` : ''}</div>` },
    { t: `<b>นับ 0</b> ที่แยกออกมา: มีทั้งหมด <b>${Z} ตัว</b> — พักไว้ก่อน`, v: () => `<div class="p4zeq num"><span class="p4zcore">${fmt(A.core)}</span> <i>×</i> <span class="p4zcore">${fmt(B.core)}</span> <i>=</i> <span class="fsign">?</span></div><div class="p4ztray">พัก 0 ไว้ ${'<span class="p4zchip">0</span>'.repeat(Z)} <b>${Z} ตัว</b></div>` },
    { t: `<b>คูณเลขที่ไม่ใช่ 0</b>: ${fmt(A.core)} × ${fmt(B.core)} = <b>${fmt(core)}</b>`, v: () => `<div class="p4zeq num"><span class="p4zcore">${fmt(A.core)}</span> <i>×</i> <span class="p4zcore">${fmt(B.core)}</span> <i>=</i> <b class="p4zres nw">${fmt(core)}</b></div><div class="p4ztray">พัก 0 ไว้ ${'<span class="p4zchip">0</span>'.repeat(Z)} <b>${Z} ตัว</b></div>` },
    { t: `<b>เติม 0</b> ที่พักไว้ ${Z} ตัว ต่อท้ายผลคูณ: ${fmt(core)} → <b>${fmt(r)}</b>`, v: () => `<div class="p4zeq num"><b class="p4zres">${fmt(core)}</b><span class="p4zfly">${'<span class="p4zchip">0</span>'.repeat(Z)}</span> <i>→</i> <b class="p4zres nw">${p4zNum(r, Z)}</b></div>` },
    { t: `คำตอบ <b class="num">${fmt(a)} × ${fmt(b)} = ${fmt(r)}</b> — 0 ในโจทย์ ${Z} ตัว ผลคูณก็มี 0 ท้าย ${Z} ตัวเพิ่มจาก ${fmt(core)}`, v: () => `<div class="p4zeq num">${p4zNum(a, A.z)} <i>×</i> ${p4zNum(b, B.z)} <i>=</i> <b class="p4zres ok">${p4zNum(r, Z)}</b></div>` }];
  const paint = () => { const st = ST[k]; scene.innerHTML = st.v(); now.innerHTML = `<span class="cwk-n">ขั้นที่ ${k + 1}/${ST.length}</span> ${st.t}`; nx.disabled = k >= ST.length - 1; bk.disabled = k === 0; nx.lastChild.textContent = k >= ST.length - 1 ? 'ครบทุกขั้นแล้ว' : 'ขั้นต่อไป';
    if (k >= ST.length - 1 && !done) { done = true; sfx.ok(); teachDone(wait); } };
  let done = false;
  const nx = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (k < ST.length - 1) { k++; sfx.pop(k); paint(); } } }, icon('right'), h('span', null, 'ขั้นต่อไป'));
  const bk = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (k > 0) { k--; sfx.tap(); paint(); } } }, icon('left'), 'ย้อนขั้น');
  paint(); return h('div', { class: 'colstack cwk-wrap' }, wait, scene, now, h('div', { class: 'rowstack' }, bk, nx));
}
/* ---------- estimate a product ---------- */
const p4lead = n => p4r(n, p4ld(n) - 1);
function simEstMul(items) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const [a, b] = items[idx], ra = p4lead(a), rb = p4lead(b), E = ra * rb, r = a * b; box.innerHTML = '';
    const tb = h('div', { class: 'p4shop', html: [[a, ra], [b, rb]].map(([x, rx]) => `<div><span>ประมาณ</span><b class="num">${fmt(x)}</b><i>≈</i><b class="num p4e">${fmt(rx)}</b></div>`).join('') });
    const out = fNote(), cand = shuffle([r, r * 10, Math.round(r / 10), r + p4lead(r)].filter((x, i, A) => A.indexOf(x) === i)); let found = false;
    out.innerHTML = `ค่าประมาณ ${fmt(ra)} × ${fmt(rb)} = <b>${fmt(E)}</b> — แตะคำตอบที่<b>สมเหตุสมผล</b>`;
    const opts = h('div', { class: 'h6-chips' }, ...cand.map(x => h('button', { class: 'btn sm ia', onclick: ev => { ev.stopPropagation(); if (found) return;
      if (x === r) { found = true; ev.currentTarget.classList.add('p4ok'); out.innerHTML = `ถูกต้อง! ${fmt(r)} ใกล้ค่าประมาณ ${fmt(E)} ที่สุด`; sfx.ok(); }
      else { sfx.no(); out.innerHTML = `${fmt(x)} ห่างจากค่าประมาณ ${fmt(E)} มากเกินไป ลองใหม่`; } } }, fmt(x))));
    box.append(h('div', { class: 'fbig p4big' }, `${fmt(a)} × ${fmt(b)} = ?`), tb, opts, out, p4more(() => { idx = (idx + 1) % items.length; draw(); }, 'โจทย์ใหม่'));
  };
  draw(); return box;
}

/* ---------- long division (integer, with remainder) ---------- */
function p4ldivPlan(D, k) {
  const digs = [...String(D)].map(Number), steps = []; let cur = 0;
  digs.forEach((d, i) => { cur = cur * 10 + d; const q = Math.floor(cur / k); steps.push({ i, cur, q, prod: q * k, rem: cur - q * k, quiet: q === 0 }); cur -= q * k; });
  return { digs, steps, rem: cur, q: Math.floor(D / k) };
}
const p4est1 = (cur, k) => { if (k < 10) return null; const rk = p4lead(k); return { rk, g: Math.max(0, Math.min(9, Math.floor(cur / rk))) }; };
function simLongDiv4(list, o = {}) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const [D, k] = list[idx], P = p4ldivPlan(D, k), nd = P.digs.length, real = P.steps.filter(s => !s.quiet); box.innerHTML = '';
    const grid = h('div', { class: 'ldiv', style: { gridTemplateColumns: `auto repeat(${nd},var(--ldw))` } }), out = fNote(), fin = h('div', { class: 'fbig p4est' }), trial = h('div', { class: 'colstack' });
    const put = (r, c, txt, cls = '') => { const el = h('span', { class: 'ld-c ' + cls, style: { gridRow: r, gridColumn: c } }, txt); grid.append(el); return el; };
    const firstQ = real.length ? real[0].i : nd - 1;
    const qEls = P.steps.map(s => s.i >= firstQ ? put(1, 2 + s.i, String(s.q), 'q hide') : null);
    put(2, 1, fmt(k), 'dv'); P.digs.forEach((d, i) => put(2, 2 + i, String(d), 'dd'));
    let row = 3; const shown = real.map((s, j) => { const els = [], ps = String(s.prod), next = real[j + 1], remV = next ? next.cur : P.rem, remEnd = next ? next.i : nd - 1, rs = String(remV);
      els.push(put(row, 1, '−', 'sg hide')); [...ps].forEach((c, t) => els.push(put(row, 2 + s.i - ps.length + 1 + t, c, 'pr ul hide'))); row++;
      [...rs].forEach((c, t) => els.push(put(row, 2 + remEnd - rs.length + 1 + t, c, 'rm hide' + (next ? '' : ' last')))); row++;
      const gap = next ? P.steps.filter(x => x.i > s.i && x.i < next.i).length : P.steps.filter(x => x.i > s.i).length;
      return { s, els, next, gap }; });
    let j = 0; out.innerHTML = `ตั้งหาร ${fmt(D)} ÷ ${fmt(k)} — เริ่มจากหลักซ้ายที่มีค่า<b>ไม่น้อยกว่าตัวหาร</b>`;
    const reveal = () => { const { s, els, next, gap } = shown[j];
      qEls.forEach((q, t) => { if (q && P.steps[t].i <= (next ? next.i - 1 : nd - 1) && P.steps[t].i <= s.i + gap) q.classList.remove('hide'); });
      els.forEach((el, t) => { el.style.animationDelay = t * .05 + 's'; el.classList.remove('hide'); el.classList.add('in'); });
      out.innerHTML = `${fmt(s.cur)} ÷ ${fmt(k)} ได้ <b>${s.q}</b> · ${s.q} × ${fmt(k)} = ${fmt(s.prod)} · ${fmt(s.cur)} − ${fmt(s.prod)} = ${fmt(s.rem)}` + (gap ? ` · ดึงลงมาแล้วยังหารไม่ได้ ใส่ <b>0</b> ในผลหาร${gap > 1 ? ` ${gap} ตัว` : ''}` : '') + (next ? ' · ดึงหลักถัดไปลงมา' : '');
      sfx.pop(j + 1); j++;
      if (j >= shown.length) { qEls.forEach(q => q && q.classList.remove('hide')); btn.remove(); trial.innerHTML = ''; fin.innerHTML = `${fmt(D)} ÷ ${fmt(k)} = <b class="num">${fmt(P.q)}</b>` + (P.rem ? ` เศษ <b class="num">${fmt(P.rem)}</b>` : ''); sfx.ok(); teachDone(box);
        say(`${thaiWords(D)} หาร ${thaiWords(k)} ได้ ${thaiWords(P.q)}${P.rem ? ' เศษ ' + thaiWords(P.rem) : ''}`, true); }
      else if (o.trial) setTrial(); };
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); reveal(); } }, icon('right'), 'หารขั้นต่อไป');
    function setTrial() { const { s } = shown[j], E = p4est1(s.cur, k); let g = E ? E.g : 1; trial.innerHTML = '';
      const v = h('div', { class: 'cap' }), msg = h('div', { class: 'cap' });
      const show = () => { v.innerHTML = `ลองผลหาร <b>${g}</b> → ${g} × ${fmt(k)} = <b>${fmt(g * k)}</b> (ต้องไม่เกิน ${fmt(s.cur)})`; };
      trial.append(h('div', { class: 'cap', html: `หา ${fmt(s.cur)} ÷ ${fmt(k)}` + (E ? ` · ประมาณ ${fmt(k)} ≈ ${fmt(E.rk)} → ${fmt(s.cur)} ÷ ${fmt(E.rk)} ≈ ${E.g}` : '') }),
        h('div', { class: 'rowstack' }, p4step('ผลหาร', () => g, x => { g = x; show(); msg.textContent = ''; }, () => 0, () => 9), h('button', { class: 'btn sm primary ia', onclick: ev => { ev.stopPropagation();
          if (g * k > s.cur) { sfx.no(); msg.innerHTML = `${fmt(g * k)} มากกว่า ${fmt(s.cur)} → <b>ลดผลหารลง</b>`; } else if (s.cur - g * k >= k) { sfx.no(); msg.innerHTML = `เหลือ ${fmt(s.cur - g * k)} ซึ่งยังไม่น้อยกว่าตัวหาร → <b>เพิ่มผลหาร</b>`; } else { sfx.ok(); reveal(); } } }, icon('check'), 'ใช้ค่านี้')), v, msg); show(); }
    if (o.trial) { box.append(h6wait(), h('div', { class: 'p4calrow' }, grid, h('div', { class: 'colstack p4trial' }, trial, out))); setTrial(); } else box.append(grid, out, btn);
    box.append(fin, p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'โจทย์ใหม่'));
  };
  draw(); return box;
}
const p4ldivRows = (D, k) => { const P = p4ldivPlan(D, k); return P.steps.filter(s => !s.quiet || s.i >= P.steps.findIndex(x => !x.quiet)).map(s => [s.quiet ? 'ใส่ 0' : `${fmt(s.cur)} ÷ ${fmt(k)}`, s.quiet ? `${fmt(s.cur)} หาร ${fmt(k)} ไม่ได้ → ผลหารหลักนี้เป็น 0` : `ได้ ${s.q} · ${s.q} × ${fmt(k)} = ${fmt(s.prod)} · เหลือ ${fmt(s.rem)}`]); };
const p4divFig = (D, k) => `<div class="ldiv sm" style="grid-template-columns:auto repeat(${p4ld(D)},var(--ldw))"><span class="ld-c dv" style="grid-row:2;grid-column:1">${fmt(k)}</span>${[...String(D)].map((d, i) => `<span class="ld-c dd" style="grid-row:2;grid-column:${2 + i}">${d}</span>`).join('')}<span class="ld-c" style="grid-row:1;grid-column:2"></span></div>`;
/* ---------- short division (หารสั้น) ---------- */
function p4sdivHTML(D, k, upto = -1) {
  const P = p4ldivPlan(D, k), nd = P.digs.length, first = P.steps.findIndex(s => !s.quiet), rems = P.steps.map(s => s.rem);
  let s = `<div class="p4sd" style="grid-template-columns:auto repeat(${nd},1.2em)"><span class="dv">${k}</span>`;
  P.digs.forEach((d, i) => { const r = i > 0 && i <= upto + 1 && rems[i - 1] ? `<sup>${rems[i - 1]}</sup>` : ''; s += `<span class="dd${i === upto ? ' hi' : ''}">${r}${d}</span>`; });
  s += '<span></span>'; P.steps.forEach((st, i) => { s += `<span class="qq${i === upto ? ' hi' : ''}">${i <= upto && (i >= first || first < 0 && i === nd - 1) ? st.q : ''}</span>`; });
  return s + '</div>';
}
function simShortDiv4(list) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const [D, k] = list[idx], P = p4ldivPlan(D, k), fig = h('div', { class: 'p4colwrap' }), note = fNote(), fin = h('div', { class: 'fbig p4est' }); let u = -1; box.innerHTML = '';
    const paint = () => fig.innerHTML = p4sdivHTML(D, k, u);
    note.innerHTML = 'หารสั้น: หารทีละหลักจากซ้าย <b>เศษ</b>ที่เหลือเขียนตัวเล็กไว้หน้าหลักถัดไป';
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); u++; const s = P.steps[u];
      note.innerHTML = `${fmt(s.cur)} ÷ ${k} = <b>${s.q}</b>` + (s.rem ? ` เศษ ${s.rem}` : '') + (u < P.steps.length - 1 ? (s.rem ? ` → เขียน ${s.rem} ตัวเล็กหน้าหลักถัดไป (รวมเป็น ${s.rem * 10 + P.digs[u + 1]})` : '') : '');
      sfx.pop(u + 1); paint();
      if (u >= P.steps.length - 1) { btn.remove(); fin.innerHTML = `${fmt(D)} ÷ ${k} = <b class="num">${fmt(P.q)}</b>` + (P.rem ? ` เศษ <b class="num">${P.rem}</b>` : ''); sfx.ok(); say(`${thaiWords(D)} หาร ${k} ได้ ${thaiWords(P.q)}${P.rem ? ' เศษ ' + thaiWords(P.rem) : ''}`, true); } } }, icon('right'), 'หารหลักต่อไป');
    paint(); box.append(fig, note, btn, fin, p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'โจทย์ใหม่'));
  };
  draw(); return box;
}
/* ---------- × and ÷ are inverses: an array of dots ---------- */
function simFact() {
  let r = 4, c = 6; const dots = h('div', { class: 'p4arr' }), eqs = h('div', { class: 'p4facts' });
  const paint = () => { dots.style.gridTemplateColumns = `repeat(${c},1fr)`; dots.innerHTML = Array.from({ length: r * c }, () => '<i></i>').join(''); const p = r * c;
    eqs.innerHTML = [`${r} × ${c} = ${p}`, `${c} × ${r} = ${p}`, `${p} ÷ ${r} = ${c}`, `${p} ÷ ${c} = ${r}`].map((t, i) => `<b class="num ${i < 2 ? 'm' : 'd'}">${t}</b>`).join(''); };
  paint();
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, p4step('แถว', () => r, v => { r = v; paint(); }, () => 2, () => 9), p4step('แถวละ', () => c, v => { c = v; paint(); }, () => 2, () => 10)), dots, eqs,
    h('div', { class: 'cap', html: 'การคูณและการหารเป็น<b>การดำเนินการผกผัน</b> — รู้ประโยคการคูณ 1 ประโยค เขียนประโยคการหารได้ 2 ประโยค' }));
}
/* ---------- unknowns in × / ÷ ---------- */
function p4uSolveM(s) {
  const [x, op, y, , z] = s.split(' '), U = v => v === '□', X0 = +x, Y0 = +y, Z = +z; let ans, expr, rel;
  if (op === '×') { if (U(x)) { ans = Z / Y0; expr = `${z} ÷ ${y}`; rel = 'ตัวตั้ง = ผลคูณ ÷ ตัวคูณ'; } else { ans = Z / X0; expr = `${z} ÷ ${x}`; rel = 'ตัวคูณ = ผลคูณ ÷ ตัวตั้ง'; } }
  else { if (U(x)) { ans = Z * Y0; expr = `${z} × ${y}`; rel = 'ตัวตั้ง = ผลหาร × ตัวหาร'; } else { ans = X0 / Z; expr = `${x} ÷ ${z}`; rel = 'ตัวหาร = ตัวตั้ง ÷ ผลหาร'; } }
  const X = U(x) ? ans : X0, Y = U(y) ? ans : Y0;
  return { op, ans, expr, rel, X, Y, Z, check: op === '×' ? `${fmt(X)} × ${fmt(Y)} = ${fmt(X * Y)}` : `${fmt(X)} ÷ ${fmt(Y)} = ${fmt(X / Y)}` };
}
function p4grpSVG(total, n, per, unk) { // total split into n equal groups of `per`
  const W = 520, x0 = 16, L = W - 32, show = Math.min(n, 8), w = L / show, lab = (v, u) => u ? '?' : fmt(v);
  let s = `<svg viewBox="0 0 ${W} 132" class="p4bar" aria-hidden="true"><path d="M${x0} 46 v-8 q0 -8 8 -8 H${W / 2 - 10} l10 -10 l10 10 H${W - x0 - 8} q8 0 8 8 v8" fill="none" stroke="#8B6A3E" stroke-width="2.4"/>
    <text x="${W / 2}" y="16" text-anchor="middle" class="p4bt${unk === 't' ? ' q' : ''}">ทั้งหมด ${lab(total, unk === 't')}</text>`;
  for (let i = 0; i < show; i++) { const gap = n > show && i === show - 2; s += `<rect x="${x0 + i * w}" y="54" width="${w}" height="42" rx="6" fill="${gap ? '#fff' : unk === 'p' && i === 0 ? '#FFF3B0' : '#CFE6FF'}" stroke="${unk === 'p' && i === 0 ? '#E3A21C' : '#5B9BD5'}" stroke-width="2" ${gap ? 'stroke-dasharray="5 4"' : ''}/>`;
    if (i === 0 || gap) s += `<text x="${x0 + i * w + w / 2}" y="81" text-anchor="middle" class="p4bt${unk === 'p' && i === 0 ? ' q' : ''}" style="font-size:${gap ? 18 : 15}px">${gap ? '…' : lab(per, unk === 'p')}</text>`; }
  return s + `<text x="${W / 2}" y="122" text-anchor="middle" class="p4bl">${unk === 'n' ? '? กลุ่ม' : `${fmt(n)} กลุ่ม`} กลุ่มละเท่า ๆ กัน</text></svg>`;
}
function simBarUnknownM(list) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => {
    const s = list[idx], S = p4uSolveM(s); box.innerHTML = '';
    const grp = S.op === '×' ? { t: S.Z, n: S.X, p: S.Y, u: s.startsWith('□') ? 'n' : 'p' } : { t: S.X, n: S.Y, p: S.Z, u: s.startsWith('□') ? 't' : 'n' };
    const sen = h('div', { class: 'fbig p4big', html: p4uHTML(s) }), fig = h('div', { class: 'p4-fig', html: p4grpSVG(grp.t, grp.n, grp.p, grp.u) }), log = h('div', { class: 'colstack fstory' }), out = fNote(); let k = 0;
    const rows = [['① ความสัมพันธ์', `<b>${S.rel}</b>`], ['② เขียนประโยคใหม่', `□ = ${p4ex2(S.expr)}`], ['③ คำนวณ', `□ = <b>${fmt(S.ans)}</b>`], ['④ ตรวจคำตอบ', `${S.check} ✓`]];
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [l, t] = rows[k++]; log.append(h('div', { class: 'fst-row' }, h('b', null, l), h('span', { html: t }))); sfx.pop(k);
      if (k === 3) { sen.innerHTML = p4uHTML(s, S.ans); fig.innerHTML = p4grpSVG(grp.t, grp.n, grp.p, ''); }
      if (k >= rows.length) { btn.remove(); out.innerHTML = `ตัวไม่ทราบค่า คือ <b>${fmt(S.ans)}</b>`; sfx.ok(); say('ตัวไม่ทราบค่า คือ ' + thaiWords(S.ans), true); } } }, icon('right'), 'ขั้นต่อไป');
    box.append(sen, fig, log, btn, out, p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'ข้อใหม่'));
  };
  draw(); return box;
}
/* ---------- product closest to a target ---------- */
function simNear(d, T) {
  let n = Math.max(1, Math.floor(T / d) - 6); const fig = h('div', { class: 'p4near' }), out = fNote(), big = h('div', { class: 'fbig p4est' });
  const best = [Math.floor(T / d), Math.floor(T / d) + 1].sort((a, b) => Math.abs(a * d - T) - Math.abs(b * d - T))[0];
  const paint = () => { const p = n * d, mx = T * 1.25, f = x => Math.min(100, x / mx * 100);
    fig.innerHTML = `<div class="tr"><i style="width:${f(p)}%" class="${p > T ? 'over' : ''}"></i><b style="left:${f(T)}%"></b></div><div class="lb"><span style="left:${f(T)}%">เป้าหมาย ${fmt(T)}</span></div>`;
    big.innerHTML = `${n} × ${d} = <b class="num">${fmt(p)}</b>`; out.innerHTML = `ห่างจาก ${fmt(T)} อยู่ <b>${fmt(Math.abs(T - p))}</b> ${p > T ? '(เกิน)' : '(ยังไม่ถึง)'}` + (n === best ? '<br><b>ใกล้ที่สุดแล้ว!</b> ลอง ±1 ดูว่าห่างมากขึ้น' : ''); };
  paint();
  return h('div', { class: 'colstack' }, big, fig, h('div', { class: 'rowstack' }, ...[[-10, '− 10'], [-1, '− 1'], [1, '+ 1'], [10, '+ 10']].map(([dd, t]) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); n = Math.max(1, n + dd); sfx.pop(3); paint(); } }, t))), out,
    h('div', { class: 'cap', html: `ทางลัด: ${fmt(T)} ÷ ${d} ≈ ${fmt(Math.floor(T / d))} แล้วลองจำนวนที่อยู่ติดกัน` }));
}
const p4bestN = (d, T) => [Math.floor(T / d), Math.floor(T / d) + 1].sort((a, b) => Math.abs(a * d - T) - Math.abs(b * d - T))[0];
/* ---------- multiplication / division patterns ---------- */
function simPatMul() {
  let k = 3, b = 2, op = '×'; const row = h('div', { class: 'p4pat' }), out = fNote(), seg = h('div', { class: 'seg p4seg' });
  const paint = () => { const v = range(0, 4).map(i => b * k ** i), seq = op === '×' ? v : v.slice().reverse();
    row.innerHTML = seq.map((x, i) => `${i ? `<i>${op}${k}</i>` : ''}<b class="num">${fmt(x)}</b>`).join('');
    out.innerHTML = `แต่ละจำนวน${op === '×' ? 'คูณ' : 'หาร'}ด้วย <b>${k}</b> ได้จำนวนถัดไป · ตรวจได้ด้วย ${fmt(seq[1])} ${op} ${k} = ${fmt(seq[2])}`;
    seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.textContent.includes(op))); };
  seg.append(...['×', '÷'].map(o => h('button', { class: 'ia', onclick: e => { e.stopPropagation(); op = o; sfx.tap(); paint(); } }, `แบบรูป${o === '×' ? 'การคูณ' : 'การหาร'} ${o}`)));
  paint();
  return h('div', { class: 'colstack' }, seg, h('div', { class: 'rowstack' }, p4step('คูณ/หารด้วย', () => k, v => { k = v; paint(); }, () => 2, () => 9), p4step('เริ่ม', () => b, v => { b = v; paint(); }, () => 1, () => 9)), row, out);
}
const p4patHTML = (seq, blank) => `<div class="p4pat">${seq.map((x, i) => i === blank ? `<b class="bl">?</b>` : `<b class="num">${fmt(x)}</b>`).join('<i></i>')}</div>`;

/* ---------- question helpers ---------- */
const p4mulQ = (a, b) => Q.colW({ nums: [a, b], op: '×', prompt: `หาผลคูณ <b class="num">${fmt(a)} × ${fmt(b)}</b> โดยการตั้งคูณ`, say: `หาผลคูณ ${thaiWords(a)} คูณ ${thaiWords(b)}`, sig: `p4mq ${a}x${b}` }); // v111: shared column board
const p4zQ = (a, b) => Q.p4Num({ fig: p4big(`<b class="num">${fmt(a)} × ${fmt(b)}</b> <b class="fop">=</b> <span class="fsign">?</span>`), q: 'หาผลคูณ (คูณตัวเลขที่ไม่ใช่ 0 ก่อน แล้วเติม 0)', a: a * b, hint: (() => { const z = x => (String(x).match(/0*$/) || [''])[0].length, za = z(a), zb = z(b); return `${fmt(a / 10 ** za)} × ${fmt(b / 10 ** zb)} = ${fmt(a * b / 10 ** (za + zb))} แล้วเติม 0 อีก ${za + zb} ตัว`; })() });
Object.assign(Q, {
  p4Div({ D, k, fig, label }) {
    const P = p4ldivPlan(D, k), ex = !P.rem;
    return { prompt: `${ex ? 'หาผลหาร' : 'หาผลหารและเศษ'} <b class="num">${fmt(D)} ÷ ${fmt(k)}</b>${label ? ` <small>(${label})</small>` : ''}`, say: `${ex ? 'หาผลหาร' : 'หาผลหารและเศษ'} ${thaiWords(D)} หาร ${thaiWords(k)}`,
      mount(bd, ctx) { const hint = k < 10 ? 'หารทีละหลักจากซ้าย ถ้าหารไม่ได้ใส่ 0 ในผลหาร แล้วดึงหลักถัดไปลงมา' : `ประมาณตัวหาร ${fmt(k)} ≈ ${fmt(p4lead(k))} เพื่อเดาผลหารทีละหลัก แล้วตรวจว่าเศษน้อยกว่าตัวหาร`;
        bd.append(h('div', { class: 't6-q p4-q' }, h('div', { class: 'p4-fig', html: fig || p4divFig(D, k) }), ex ? answerBox(ctx, String(P.q), { hint }) : p4two(ctx, P, D, k, hint))); } };
  }
});
function p4two(ctx, P, D, k, hint) { // quotient first, then remainder — the label sits right above the answer slot
  const lab = h('div', { class: 'p4steplab' }), slot = h('div'); let st = 0;
  const sub = { check: (ok, hn) => { if (ok) { st = 1; sfx.pop(4); run(); } else ctx.check(false, hn); } };
  const run = () => { slot.innerHTML = ''; lab.innerHTML = st ? `ผลหาร <b class="num">${fmt(P.q)}</b> ✓ · ขั้นที่ 2: พิมพ์ <b>เศษ</b>` : 'ขั้นที่ 1: พิมพ์ <b>ผลหาร</b>';
    slot.append(st ? answerBox(ctx, String(P.rem), { hint: `เศษ = ${fmt(D)} − (${fmt(P.q)} × ${fmt(k)}) และต้องน้อยกว่า ${fmt(k)}` }) : answerBox(sub, String(P.q), { hint })); };
  run(); return h('div', { class: 'colstack' }, lab, slot);
}
const p4unkMQ = s => { const S = p4uSolveM(s); return Q.p4Num({ fig: p4big(p4uHTML(s)), q: 'หาค่าของตัวไม่ทราบค่าใน □', say: 'หาค่าของตัวไม่ทราบค่า', a: S.ans, hint: `${S.rel} → □ = ${p4ex2(S.expr)}` }); };
const p4patQ = ([seq, blank]) => { const r = seq[1] > seq[0] ? `× ${seq[1] / seq[0]}` : `÷ ${seq[0] / seq[1]}`; return Q.p4Num({ fig: p4patHTML(seq, blank), q: 'จำนวนที่หายไปในแบบรูปคือเท่าใด', a: seq[blank], hint: `ดูว่าจำนวนถัดไปได้จากการคูณหรือหาร: แบบรูปนี้ ${r}` }); };
const p4nearQ = ([d, T, kind]) => kind === 'max' ? Q.p4Num({ fig: p4big(`<span class="fsign">?</span> <b class="fop">×</b> <b class="num">${d}</b> ≤ <b class="num">${fmt(T)}</b>`), q: `จำนวนนับที่มากที่สุดที่คูณกับ ${d} แล้วได้ผลคูณ<span class="hl">ไม่เกิน</span> ${fmt(T)} คือเท่าใด`, a: Math.floor(T / d), hint: `${fmt(T)} ÷ ${d} ได้ ${fmt(Math.floor(T / d))} เศษ ${T % d}` })
  : Q.p4Num({ fig: p4big(`<span class="fsign">?</span> <b class="fop">×</b> <b class="num">${d}</b> ≈ <b class="num">${fmt(T)}</b>`), q: `จำนวนนับใดคูณกับ ${d} แล้วได้ผลคูณใกล้เคียง ${fmt(T)} มากที่สุด`, a: p4bestN(d, T), hint: `${fmt(T)} ÷ ${d} ≈ ${fmt(Math.floor(T / d))} แล้วเทียบ ${fmt(Math.floor(T / d))} × ${d} กับ ${fmt(Math.floor(T / d) + 1)} × ${d} ว่าอันไหนใกล้ ${fmt(T)} กว่า` });
const p4factQ = ([a, b]) => { const p = a * b, ok = `${fmt(p)} ÷ ${fmt(b)} = ${fmt(a)}`;
  return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(a)} × ${fmt(b)} = ${fmt(p)}</b>`), q: 'จากประโยคการคูณนี้ ข้อใด<span class="hl">ถูกต้อง</span>', say: 'จากประโยคการคูณนี้ ข้อใดถูกต้อง', opts: [ok, `${fmt(a)} ÷ ${fmt(b)} = ${fmt(p)}`, `${fmt(p)} ÷ ${fmt(a)} = ${fmt(p)}`, `${fmt(b)} ÷ ${fmt(p)} = ${fmt(a)}`], right: ok, hint: 'ผลคูณ ÷ ตัวคูณ = ตัวตั้ง' }); };
const p4chkQ = ([D, k]) => { const P = p4ldivPlan(D, k); return Q.p4Num({ fig: p4big(`<b class="num">${fmt(D)} ÷ ${k} = ${fmt(P.q)}${P.rem ? ` เศษ ${P.rem}` : ''}</b>`), q: `ตรวจคำตอบด้วยการคูณ: ${fmt(P.q)} × ${k}${P.rem ? ` + ${P.rem}` : ''} = ?`, a: P.q * k + P.rem, hint: 'ผลหาร × ตัวหาร + เศษ = ตัวตั้ง' }); };
const p4estMulQ = ([a, b]) => { const r = a * b, L = p4lead(r), cand = [r * 10, Math.round(r / 10), r + L, r - L].filter(x => x > 0 && x !== r);
  return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(a)} × ${fmt(b)}</b>`), q: 'ใช้ค่าประมาณตรวจ: ข้อใดเป็นผลคูณที่<span class="hl">สมเหตุสมผล</span>', say: 'ใช้ค่าประมาณตรวจ ข้อใดเป็นผลคูณที่สมเหตุสมผล', opts: [r, ...shuffle(cand).slice(0, 3)].map(fmt), right: fmt(r), hint: `ประมาณ ${fmt(a)} ≈ ${fmt(p4lead(a))} · ${fmt(b)} ≈ ${fmt(p4lead(b))} → ผลคูณประมาณ ${fmt(p4lead(a) * p4lead(b))}` }); };
const p4st2sM = o => { const t = o.s.split(' '), sw = `${t[0]} ${t[1] === '×' ? '÷' : '×'} ${t[2]}`, ad = `${t[0]} + ${t[2]}`, opts = [o.s, sw, ad].map(e => p4ex2(e) + ' = □');
  return Q.p4Pick({ fig: `<div class="storybox">${o.ok}</div>`, q: 'ข้อใดเป็นประโยคสัญลักษณ์ของโจทย์นี้', say: `${o.ok} ข้อใดเป็นประโยคสัญลักษณ์ของโจทย์นี้`, opts, right: opts[0], hint: 'หลายกลุ่มกลุ่มละเท่ากัน หาทั้งหมด → คูณ · แบ่งเท่า ๆ กัน หรือหาว่าได้กี่กลุ่ม → หาร' }); };

/* ---------- practice data ---------- */
const P4W3_M1 = [[34984, 4], [32561, 9], [74378, 5], [58365, 6], [115432, 7], [263576, 3], [45941, 2], [12354, 7], [75845, 5], [98475, 3], [137023, 4], [237438, 2]];
const P4W3_M10 = [[640, 30], [20, 5238], [70, 9805], [552, 40], [34738, 90], [115649, 50]];
const P4W3_M2 = [[32156, 23], [60497, 46], [173234, 16], [326583, 29]];
const P4W3_MZ = [[3981, 400], [300, 8655], [8000, 568], [224, 40000], [6125, 9000], [25132, 6000]];
const P4W3_MB = [[345, 728], [549, 244], [888, 631], [459, 946], [491, 378], [329, 236], [655, 673], [930, 658], [5409, 145], [4381, 572], [885, 9932], [19639, 929]];
const P4W3_DM = [[10000, 5], [5000, 2], [80000, 5], [150000, 3], [27000, 9], [360000, 9], [4900000, 7], [360000, 6], [480000, 4], [98000, 7]];
const P4W3_DL = [[54321, 3], [87655, 7], [76024, 9], [80415, 6], [59668, 2], [37426, 5]];
const P4W3_DS = [[12345, 5], [67890, 3], [23456, 6], [54862, 9], [45738, 7], [38965, 8], [65734, 4], [83429, 5]];
const P4W3_D2 = [[78450, 15], [54862, 12], [64892, 14], [8239279, 86], [3873484, 45], [1320897, 62], [8297400, 92]];
const P4W3_D3 = [[34560, 256], [144144, 144], [9520, 525], [10654, 683]];
const P4_D10 = [[78960, 40], [93450, 30], [56780, 60], [125640, 80], [47350, 50], [264180, 70]];
const P4_D2S = [[8736, 24], [5291, 37], [9452, 68], [6875, 25], [3946, 52], [7815, 43]];
const P4_D3S = [[8925, 125], [6912, 288], [9999, 101], [7350, 245], [5408, 312]];
const P4_D3B = [[258750, 125], [1234567, 321], [96300, 450]];
const P4W3_UNK = ['□ × 37 = 777', '24685 ÷ □ = 4937', '475 ÷ □ = 19', '□ ÷ 225 = 64', '□ × 500 = 2293500', '242 × □ = 24200', '□ × 27 = 14985', '33075 ÷ □ = 3675', '2145600 ÷ □ = 44700', '□ × 99 = 14850',
  '24888 ÷ □ = 3111', '22987 × □ = 367792', '13013 ÷ □ = 169', '□ × 5042 = 1512600', '□ ÷ 80 = 800', '999 × □ = 33966', '□ × 98 = 3920000', '98879 ÷ □ = 89', '59994 ÷ □ = 9999', '□ × 99 = 219978'];
const P4W3_UNK_M = P4W3_UNK.filter(s => s.includes('×')), P4W3_UNK_D = P4W3_UNK.filter(s => s.includes('÷'));
const P4W3_PAT = [[[6, 60, 600, 6000, 60000], 2], [[3125, 625, 125, 25, 5], 1], [[8, 64, 512, 4096, 32768], 4], [[16384, 4096, 1024, 256, 64], 0], [[65610, 7290, 810, 90, 10], 2], [[11, 121, 1331, 14641, 161051], 1], [[56, 504, 4536, 40824, 367416], 2],
  [[32, 64, 128, 256, 512], 4], [[7776, 1296, 216, 36, 6], 1], [[100, 800, 6400, 51200, 409600], 3], [[78125, 15625, 3125, 625, 125], 0], [[12, 144, 1728, 20736, 248832], 3], [[21, 147, 1029, 7203, 50421], 0], [[3240, 1080, 360, 120, 40], 2]];
const P4_NEAR = [[38, 1500, 'near'], [25, 5000, 'near'], [47, 2000, 'near'], [63, 10000, 'near'], [125, 40000, 'near'], [24, 1000, 'max'], [36, 2500, 'max'], [85, 12000, 'max'], [216, 50000, 'max']];
const P4_FACT = [[2345, 26], [418, 307], [12500, 48], [906, 75], [3125, 32]];
const P4S_MD = [
  D6S('โรงเรียนสั่งซื้อดินสอ 100 กล่อง กล่องละ 40 แท่ง โรงเรียนจะได้ดินสอทั้งหมดกี่แท่ง', '100 × 40', ['100 ÷ 40', '100 + 40'], 'แท่ง'),
  D6S('เรือ 7 ลำ ขนกระสอบข้าวรวม 219,513 กระสอบ ทุกลำขนเท่ากัน เรือแต่ละลำขนกระสอบข้าวกี่กระสอบ', '219513 ÷ 7', ['219513 × 7', '219513 − 7'], 'กระสอบ'),
  D6S('ครูมีงบ 1,470 บาท ซื้อหนังสือนิทานเล่มละ 35 บาท ครูซื้อหนังสือได้กี่เล่ม', '1470 ÷ 35', ['1470 × 35', '1470 − 35'], 'เล่ม'),
  D6S('สำนักพิมพ์ขายพจนานุกรม 18,780 เล่ม ราคาเล่มละ 59 บาท จะได้เงินรวมเท่าไร', '18780 × 59', ['18780 ÷ 59', '18780 + 59'], 'บาท'),
  D6S('โรงงานบรรจุน้ำดื่มลังละ 24 ขวด จำนวน 3,650 ลัง มีน้ำดื่มทั้งหมดกี่ขวด', '3650 × 24', ['3650 ÷ 24', '3650 + 24'], 'ขวด'),
  D6S('แบ่งอินทผลัม 45,360 ผล ใส่กล่อง กล่องละ 72 ผล ได้กี่กล่อง', '45360 ÷ 72', ['45360 × 72', '45360 − 72'], 'กล่อง'),
  D6S('ตั๋วชมการแสดงราคาใบละ 1,250 บาท ขายได้ 4,368 ใบ ได้เงินทั้งหมดกี่บาท', '1250 × 4368', ['4368 ÷ 1250', '4368 + 1250'], 'บาท'),
  D6S('ฟาร์มมีไข่ไก่ 98,496 ฟอง บรรจุแผงละ 24 ฟอง จะได้ไข่ไก่กี่แผง', '98496 ÷ 24', ['98496 × 24', '98496 − 24'], 'แผง'),
  D6S('บริษัทเช่าโกดังปีละ 186,500 บาท เช่าเป็นเวลา 12 ปี ต้องจ่ายค่าเช่าทั้งหมดกี่บาท', '186500 × 12', ['186500 ÷ 12', '186500 + 12'], 'บาท'),
  D6S('โรงเรียน 8 แห่งได้รับงบประมาณรวม 3,456,000 บาท แบ่งเท่า ๆ กัน จะได้แห่งละกี่บาท', '3456000 ÷ 8', ['3456000 × 8', '3456000 − 8'], 'บาท')];
const P4_SOLM = [
  { text: 'คาราวานมีอูฐ 36 ตัว แต่ละตัวบรรทุกน้ำ 1,250 ลิตร คาราวานบรรทุกน้ำทั้งหมดกี่ลิตร', expr: '1250 × 36', giv: 'อูฐ 36 ตัว · บรรทุกตัวละ 1,250 ลิตร', lab: 'บรรทุกน้ำทั้งหมด', unit: 'ลิตร', wrongUnit: 'ตัว' },
  { text: 'มีลูกปัด 18,720 เม็ด ร้อยเป็นสร้อยเส้นละ 48 เม็ด ได้สร้อยกี่เส้น', expr: '18720 ÷ 48', giv: 'ลูกปัด 18,720 เม็ด · เส้นละ 48 เม็ด', lab: 'ได้สร้อย', unit: 'เส้น', wrongUnit: 'เม็ด' },
  { text: 'โรงงานผลิตเสื้อวันละ 4,650 ตัว 28 วันผลิตเสื้อได้กี่ตัว', expr: '4650 × 28', giv: 'ผลิตวันละ 4,650 ตัว · 28 วัน', lab: 'ผลิตเสื้อได้', unit: 'ตัว', wrongUnit: 'วัน' },
  { text: 'แบ่งเงิน 2,575,000 บาท ให้หมู่บ้าน 25 แห่ง แห่งละเท่า ๆ กัน ได้แห่งละกี่บาท', expr: '2575000 ÷ 25', giv: 'เงิน 2,575,000 บาท · 25 แห่ง แห่งละเท่ากัน', lab: 'ได้แห่งละ', unit: 'บาท', wrongUnit: 'แห่ง' },
  { text: 'สนามกีฬามีที่นั่ง 125 แถว แถวละ 360 ที่ มีที่นั่งทั้งหมดกี่ที่', expr: '125 × 360', giv: 'ที่นั่ง 125 แถว · แถวละ 360 ที่', lab: 'มีที่นั่งทั้งหมด', unit: 'ที่', wrongUnit: 'แถว' }];
const P4_S2SM = [
  { s: '240 × 282', ok: 'ร้านค้าขายไข่ไก่ได้ 240 แผง แผงละ 282 บาท ได้เงินทั้งหมดกี่บาท', bad: ['ร้านค้ามีเงิน 240 บาท ซื้อไข่ไก่แผงละ 282 บาท ได้กี่แผง', 'ร้านค้าขายไข่ไก่วันแรก 240 แผง วันที่สอง 282 แผง ขายได้รวมกี่แผง'] },
  { s: '2245 ÷ 5', ok: 'มีลูกอม 2,245 เม็ด แบ่งใส่ถุง ถุงละ 5 เม็ด ได้กี่ถุง', bad: ['มีลูกอม 2,245 ถุง ถุงละ 5 เม็ด มีลูกอมทั้งหมดกี่เม็ด', 'มีลูกอม 2,245 เม็ด กินไป 5 เม็ด เหลือกี่เม็ด'] },
  { s: '1250 × 36', ok: 'ซื้อพัดลม 36 เครื่อง ราคาเครื่องละ 1,250 บาท ต้องจ่ายเงินกี่บาท', bad: ['มีเงิน 1,250 บาท แบ่งให้เด็ก 36 คน คนละเท่า ๆ กัน ได้คนละกี่บาท', 'ซื้อพัดลมราคา 1,250 บาท และไม้แขวนเสื้อราคา 36 บาท จ่ายเงินทั้งหมดกี่บาท'] },
  { s: '86400 ÷ 24', ok: 'วันหนึ่งมี 24 ชั่วโมง หรือ 86,400 วินาที หนึ่งชั่วโมงมีกี่วินาที', bad: ['หนึ่งชั่วโมงมี 86,400 วินาที 24 ชั่วโมงมีกี่วินาที', 'มีเวลา 86,400 วินาที ใช้ไป 24 วินาที เหลือเวลากี่วินาที'] },
  { s: '365 × 12', ok: 'ร้านขายหนังสือพิมพ์ได้วันละ 365 ฉบับ 12 วัน ขายได้กี่ฉบับ', bad: ['ร้านมีหนังสือพิมพ์ 365 ฉบับ แบ่งเป็น 12 กอง กองละเท่า ๆ กัน ได้กองละกี่ฉบับ', 'ร้านขายหนังสือพิมพ์ 365 ฉบับ และนิตยสาร 12 เล่ม ขายได้รวมกี่เล่ม'] }];

/* ---------- lessons ---------- */
const L4M = (no, place, title, short, goal, teach, game) => ({ id: 440 + no, place, title, short, tone: TONES5[(no + 4) % 6], goal, teach, game });
const p4ldR = (D, k) => { const P = p4ldivPlan(D, k); return `${fmt(D)} ÷ ${fmt(k)} = <b>${fmt(P.q)}</b>${P.rem ? ` เศษ <b>${fmt(P.rem)}</b>` : ''}`; };
const p4ldEx = (D, k, title) => T(`ตัวอย่างทีละขั้น: ${fmt(D)} ÷ ${fmt(k)}`, `ตัวอย่างทีละขั้น ${thaiWords(D)} หาร ${thaiWords(k)}`, p4ex(p4ldivRows(D, k), p4ldR(D, k) + (title || ''), '', () => h('div', { class: 'p4-fig', html: p4divFig(D, k) })));
const p4divGame = list => list.map(([D, k]) => Q.p4Div({ D, k }));
const LESSONS_P4C3 = [
  L4M(1, 'บ่อน้ำคูณทด', 'การคูณจำนวน 1 หลัก กับจำนวนมากกว่า 4 หลัก', 'คูณด้วย 1 หลัก', 'หาผลคูณของจำนวนหนึ่งหลักกับจำนวนที่มากกว่าสี่หลัก โดยการตั้งคูณ',
    [T('ยินดีต้อนรับสู่ <b>ทะเลทรายคูณหาร</b>! กด<b>คูณหลักต่อไป</b> — สังเกตตัวเลขที่ทด', 'ยินดีต้อนรับสู่ทะเลทรายคูณหาร กดคูณหลักต่อไป สังเกตตัวเลขที่ทด', el => el.append(simMul1([[26738, 6], [408159, 7], [57964, 8]]))),
     T('ตัวอย่างทีละขั้น: 63,857 × 4', 'ตัวอย่างทีละขั้น หกหมื่นสามพันแปดร้อยห้าสิบเจ็ด คูณ สี่', p4ex(p4mul1Rows(63857, 4), `63,857 × 4 = <b>${fmt(63857 * 4)}</b>`, '', () => p4wrap(p4mulFig(63857, 4))))],
    () => pkF(P4W3_M1, 6).map(([a, b]) => p4mulQ(a, b))),
  L4M(2, 'เนินทรายคูณสองหลัก', 'การคูณจำนวน 2 หลัก กับจำนวนมากกว่า 2 หลัก', 'คูณด้วย 2 หลัก', 'หาผลคูณของจำนวนสองหลักกับจำนวนที่มากกว่าสองหลัก โดยหาผลคูณย่อยแล้วนำมาบวกกัน',
    [T('กด<b>ขั้นต่อไป</b> — คูณหลักหน่วย คูณหลักสิบ (เติม 0) แล้วบวกกัน', 'กดขั้นต่อไป คูณหลักหน่วย คูณหลักสิบ เติมศูนย์ แล้วบวกกัน', el => el.append(simMulLong([[4726, 38], [21045, 63]]))),
     T('ตัวอย่างทีละขั้น: 2,318 × 47', 'ตัวอย่างทีละขั้น', p4ex(p4mulLongRows(2318, 47), `2,318 × 47 = <b>${fmt(2318 * 47)}</b>`, '', () => p4wrap(p4mulFig(2318, 47))))],
    () => [...pkF(P4W3_M10, 3).map(([a, b]) => p4zQ(a, b)), ...pkF(P4W3_M2, 3).map(([a, b]) => p4mulQ(a, b))]),
  L4M(3, 'ผาเลขศูนย์', 'การคูณจำนวนนับกับพหุคูณของ 100 1,000 หรือ 10,000', 'คูณพหุคูณของ 100', 'หาผลคูณของจำนวนนับกับพหุคูณของ 100 1,000 หรือ 10,000 โดยคูณตัวเลขที่ไม่ใช่ 0 แล้วเติม 0',
    [T('<b>โจทย์</b> 1,234 × 3,000 — กด<b>ดูแถวต่อไป</b> สังเกตเลข 0 แล้วอ่านวิธีคิด', 'โจทย์ หนึ่งพันสองร้อยสามสิบสี่ คูณ สามพัน กดดูแถวต่อไป สังเกตเลขศูนย์ แล้วอ่านวิธีคิด', el => el.append(simZeroIntro(1234, 3))),
     T('ตัวอย่างทีละขั้น: 1,234 × 3,000', 'ตัวอย่างทีละขั้น หนึ่งพันสองร้อยสามสิบสี่ คูณ สามพัน', el => el.append(zeroWalk(1234, 3000))),
     T('ตัวอย่างทีละขั้น: 2,500 × 300 (มี 0 ทั้งสองจำนวน)', 'ตัวอย่างทีละขั้น สองพันห้าร้อย คูณ สามร้อย', el => el.append(zeroWalk(2500, 300))),
     T('ลองปรับ<b>ตัวคูณ</b>และ<b>จำนวน 0</b> เอง — ดูว่าผลคูณเปลี่ยนอย่างไร', 'ลองปรับตัวคูณและจำนวนศูนย์เอง ดูว่าผลคูณเปลี่ยนอย่างไร', el => el.append(simMulZeros([2457, 386, 13509])))],
    () => [...P4W3_MZ.slice(), ...pkF(P4W3_M10, 1)].sort(() => Math.random() - .5).slice(0, 6).map(([a, b]) => p4zQ(a, b))),
  L4M(4, 'ทุ่งคูณยาว', 'การคูณจำนวนมากกว่า 2 หลัก กับจำนวนมากกว่า 2 หลัก', 'คูณหลายหลัก', 'หาผลคูณของจำนวนที่มากกว่าสองหลักกับจำนวนที่มากกว่าสองหลัก',
    [T('ตัวคูณ 3 หลัก = ผลคูณย่อย <b>3 แถว</b> กด<b>ขั้นต่อไป</b>', 'ตัวคูณสามหลัก ได้ผลคูณย่อยสามแถว กดขั้นต่อไป', el => el.append(simMulLong([[427, 356], [3208, 215]]))),
     T('ตัวอย่างทีละขั้น: 614 × 253', 'ตัวอย่างทีละขั้น', p4ex(p4mulLongRows(614, 253), `614 × 253 = <b>${fmt(614 * 253)}</b>`, '', () => p4wrap(p4mulFig(614, 253))))],
    () => pkF(P4W3_MB, 6).map(([a, b]) => p4mulQ(a, b))),
  L4M(5, 'ลมทรายตรวจผลคูณ', 'การหาผลคูณ และตรวจสอบความสมเหตุสมผลของผลคูณที่ได้', 'ผลคูณสมเหตุสมผล', 'หาผลคูณ และใช้ค่าประมาณตรวจสอบความสมเหตุสมผลของผลคูณ',
    [T('ประมาณแต่ละจำนวนเป็น<b>หลักสูงสุด</b> แล้วแตะคำตอบที่สมเหตุสมผล', 'ประมาณแต่ละจำนวนเป็นหลักสูงสุด แล้วแตะคำตอบที่สมเหตุสมผล', el => el.append(simEstMul([[3890, 42], [612, 487], [48205, 9]]))),
     T('ตัวอย่างทีละขั้น: ผลคูณนี้ถูกไหม?', 'ตัวอย่างทีละขั้น ผลคูณนี้ถูกไหม', p4ex([['โจทย์', 'เพื่อนคิด 5,986 × 31 ได้ 18,566'], ['① ประมาณ', '5,986 ≈ 6,000 · 31 ≈ 30'], ['② คิดในใจ', '6,000 × 30 = 180,000'], ['③ เทียบ', '18,566 น้อยกว่า 180,000 มาก → <b>ไม่สมเหตุสมผล</b> (ลืมเติม 0 ในผลคูณย่อย)'], ['④ คิดใหม่', `5,986 × 31 = ${fmt(5986 * 31)}`]], 'ค่าประมาณบอกได้ว่าผลคูณ<b>ใหญ่ประมาณเท่าไร</b>'))],
    () => [...pkF([...P4W3_MB, ...P4W3_M2], 4).map(p4estMulQ), ...pkF(P4W3_MB, 2).map(([a, b]) => p4mulQ(a, b))]),
  L4M(6, 'เต็นท์หารยาว', 'การหารที่ตัวตั้งมีมากกว่า 4 หลัก และตัวหารมี 1 หลัก ด้วยการหารยาว', 'หารยาว ตัวหาร 1 หลัก', 'หาผลหารและเศษ เมื่อตัวตั้งมากกว่าสี่หลักและตัวหารมีหนึ่งหลัก ด้วยการหารยาว',
    [T('กด<b>หารขั้นต่อไป</b> — หาร คูณ ลบ ดึงหลักถัดไปลงมา', 'กดหารขั้นต่อไป หาร คูณ ลบ ดึงหลักถัดไปลงมา', el => el.append(simLongDiv4([[48275, 5], [63018, 7], [90521, 4]]))), p4ldEx(37509, 6)],
    () => [...pkF(P4W3_DL, 4).map(([D, k]) => Q.p4Div({ D, k })), ...pkF(P4W3_DM, 2).map(([D, k]) => Q.p4Num({ fig: p4big(`<b class="num">${fmt(D)} ÷ ${k}</b> <b class="fop">=</b> <span class="fsign">?</span>`), q: 'หาผลหาร (คิดในใจ)', a: D / k, hint: `คิดจาก ${fmt(D / 10 ** ((String(D).match(/0*$/) || [''])[0].length))} ÷ ${k} แล้วเติม 0` }))]),
  L4M(7, 'เต็นท์หารสั้น', 'การหารที่ตัวตั้งมีมากกว่า 4 หลัก และตัวหารมี 1 หลัก ด้วยการหารสั้น', 'หารสั้น', 'หาผลหารและเศษ ด้วยการหารสั้น เมื่อตัวหารมีหนึ่งหลัก',
    [T('กด<b>หารหลักต่อไป</b> — เศษเขียนตัวเล็กไว้หน้าหลักถัดไป', 'กดหารหลักต่อไป เศษเขียนตัวเล็กไว้หน้าหลักถัดไป', el => el.append(simShortDiv4([[48756, 4], [92385, 7], [61209, 8]]))),
     T('ตัวอย่างทีละขั้น: 74,368 ÷ 3', 'ตัวอย่างทีละขั้น', p4ex(p4ldivRows(74368, 3), p4ldR(74368, 3), '', () => p4wrap(p4sdivHTML(74368, 3, 4))))],
    () => pkF(P4W3_DS, 6).map(([D, k]) => Q.p4Div({ D, k, fig: p4sdivHTML(D, k), label: 'หารสั้น' }))),
  L4M(8, 'บ่อน้ำหารสิบ', 'การหารที่ตัวหารมี 2 หลัก และเป็นพหุคูณของ 10 ด้วยการหารยาว', 'ตัวหารพหุคูณของ 10', 'หาผลหารและเศษ เมื่อตัวหารเป็นพหุคูณของ 10 ด้วยการหารยาว',
    [T('ตัวหารเป็นพหุคูณของ 10 — <b>คิดจากเลขหน้า 0</b> ช่วยเดาผลหาร', 'ตัวหารเป็นพหุคูณของสิบ คิดจากเลขหน้าศูนย์ช่วยเดาผลหาร', el => el.append(simLongDiv4([[45680, 20], [93870, 70]]))), p4ldEx(18650, 50, '<br>เช่น 186 ÷ 50 คิดจาก 18 ÷ 5 ได้ 3')],
    () => p4divGame(pkF(P4_D10, 6))),
  L4M(9, 'โอเอซิสลองหาร', 'การหารที่ตัวตั้งไม่เกิน 4 หลัก ตัวหารมี 2 หลัก ด้วยการหารยาว', 'ตัวหาร 2 หลัก (≤ 4 หลัก)', 'หาผลหารและเศษ โดยประมาณตัวหารเพื่อเดาผลหารแต่ละหลัก แล้วปรับให้ถูกต้อง',
    [T('<b>ลองผลหารเอง</b>: ประมาณตัวหาร เดา แล้วปรับ — ผลคูณต้องไม่เกิน และเศษต้องน้อยกว่าตัวหาร', 'ลองผลหารเอง ประมาณตัวหาร เดา แล้วปรับ', el => el.append(simLongDiv4([[7452, 27], [9315, 46]], { trial: true }))), p4ldEx(6384, 38)],
    () => p4divGame(pkF(P4_D2S, 6))),
  L4M(10, 'คาราวานหารสองหลัก', 'การหารที่ตัวตั้งมากกว่า 4 หลัก ตัวหารมี 2 หลัก ด้วยการหารยาว', 'ตัวหาร 2 หลัก (> 4 หลัก)', 'หาผลหารและเศษ เมื่อตัวตั้งมากกว่าสี่หลักและตัวหารมีสองหลัก',
    [T('กด<b>หารขั้นต่อไป</b> — ถ้าดึงลงมาแล้วยังหารไม่ได้ ต้องใส่ 0 ในผลหาร', 'กดหารขั้นต่อไป ถ้าดึงลงมาแล้วยังหารไม่ได้ ต้องใส่ศูนย์ในผลหาร', el => el.append(simLongDiv4([[389754, 26], [1452816, 48]]))), p4ldEx(96525, 75)],
    () => p4divGame(pkF(P4W3_D2, 5))),
  L4M(11, 'ผาหารสามหลัก', 'การหารที่ตัวตั้งไม่เกิน 4 หลัก ตัวหารมี 3 หลัก ด้วยการหารยาว', 'ตัวหาร 3 หลัก (≤ 4 หลัก)', 'หาผลหารและเศษ เมื่อตัวหารมีสามหลัก โดยประมาณตัวหารช่วยเดาผลหาร',
    [T('<b>ลองผลหารเอง</b> กับตัวหาร 3 หลัก', 'ลองผลหารเองกับตัวหารสามหลัก', el => el.append(simLongDiv4([[8475, 215], [6138, 341]], { trial: true }))), p4ldEx(9384, 136)],
    () => p4divGame([...pkF(P4_D3S, 4), [9520, 525]])),
  L4M(12, 'หุบเขาหารยาว', 'การหารที่ตัวตั้งมากกว่า 4 หลัก ตัวหารมี 3 หลัก ด้วยการหารยาว', 'ตัวหาร 3 หลัก (> 4 หลัก)', 'หาผลหารและเศษ เมื่อตัวตั้งมากกว่าสี่หลักและตัวหารมีสามหลัก',
    [T('กด<b>หารขั้นต่อไป</b> — ตัวหาร 3 หลัก', 'กดหารขั้นต่อไป ตัวหารสามหลัก', el => el.append(simLongDiv4([[475632, 128], [2086560, 415]]))), p4ldEx(563850, 245)],
    () => p4divGame([...pkF(P4W3_D3.filter(x => x[0] > 9999), 3), ...pkF(P4_D3B, 2)])),
  L4M(13, 'กระโจมคู่ผกผัน', 'ความสัมพันธ์ระหว่างการคูณกับการหาร', 'คูณ ↔ หาร', 'บอกความสัมพันธ์ระหว่างการคูณกับการหาร และตรวจคำตอบการหารด้วยการคูณ',
    [T('ปรับจำนวนแถว — ประโยคการคูณ 2 ประโยค และการหาร 2 ประโยคมาจาก<b>ภาพเดียวกัน</b>', 'ปรับจำนวนแถว ประโยคการคูณสองประโยค และการหารสองประโยคมาจากภาพเดียวกัน', el => el.append(simFact())),
     T('ตัวอย่างทีละขั้น: ตรวจการหารด้วยการคูณ', 'ตัวอย่างทีละขั้น ตรวจการหารด้วยการคูณ', p4ex([['การหาร', '45,817 ÷ 6 = 7,636 เศษ 1'], ['① คูณกลับ', '7,636 × 6 = 45,816'], ['② บวกเศษ', '45,816 + 1 = 45,817'], ['③ เทียบ', 'เท่ากับตัวตั้ง → คำตอบถูกต้อง ✓']], '<b>ผลหาร × ตัวหาร + เศษ = ตัวตั้ง</b>'))],
    () => [...pkF([...P4_FACT, [1736, 42], [5208, 19]], 5).map(p4factQ), ...pkF([...P4W3_DL, [45317, 4], [93052, 8]].filter(([D, k]) => D % k), 5).map(p4chkQ)] /* v134: ≥ 8 ข้อ */),
  L4M(14, 'โอเอซิสหาค่าคูณ', 'การหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การคูณ', 'ตัวไม่ทราบค่า (คูณ)', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์แสดงการคูณ โดยใช้ความสัมพันธ์ของการคูณและการหาร',
    [T('แผนภาพ<b>กลุ่มละเท่า ๆ กัน</b> — กด<b>ขั้นต่อไป</b>', 'แผนภาพกลุ่มละเท่า ๆ กัน กดขั้นต่อไป', el => el.append(simBarUnknownM(['□ × 6 = 15432', '8 × □ = 23720', '□ × 25 = 9375']))),
     T('ตัวอย่างทีละขั้น: 125 × □ = 47,000', 'ตัวอย่างทีละขั้น', p4ex([['① ความสัมพันธ์', 'ตัวคูณ = ผลคูณ ÷ ตัวตั้ง'], ['② เขียนใหม่', '□ = 47,000 ÷ 125'], ['③ คำนวณ', '□ = 376'], ['④ ตรวจ', '125 × 376 = 47,000 ✓']], 'ตัวไม่ทราบค่า คือ <b>376</b>'))],
    () => pkF(P4W3_UNK_M, 6).map(p4unkMQ)),
  L4M(15, 'โอเอซิสหาค่าหาร', 'การหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การหาร', 'ตัวไม่ทราบค่า (หาร)', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์แสดงการหาร โดยใช้ความสัมพันธ์ของการคูณและการหาร',
    [T('แผนภาพ<b>แบ่งเท่า ๆ กัน</b> — กด<b>ขั้นต่อไป</b>', 'แผนภาพแบ่งเท่า ๆ กัน กดขั้นต่อไป', el => el.append(simBarUnknownM(['□ ÷ 7 = 4526', '58320 ÷ □ = 8', '□ ÷ 12 = 3075']))),
     T('ตัวอย่างทีละขั้น: 96,000 ÷ □ = 240', 'ตัวอย่างทีละขั้น', p4ex([['① ความสัมพันธ์', 'ตัวหาร = ตัวตั้ง ÷ ผลหาร'], ['② เขียนใหม่', '□ = 96,000 ÷ 240'], ['③ คำนวณ', '□ = 400'], ['④ ตรวจ', '96,000 ÷ 400 = 240 ✓']], 'ตัวไม่ทราบค่า คือ <b>400</b>'))],
    () => pkF(P4W3_UNK_D, 6).map(p4unkMQ)),
  L4M(16, 'เนินทรายใกล้เคียง', 'การหาผลคูณที่ใกล้เคียงกับจำนวนที่กำหนดให้', 'ผลคูณใกล้เคียง', 'หาจำนวนที่คูณกับจำนวนที่กำหนดแล้วได้ผลคูณใกล้เคียงหรือไม่เกินจำนวนที่กำหนด',
    [T('กดปุ่มเปลี่ยนจำนวน — ผลคูณ<b>ใกล้เป้าหมาย</b>ที่สุดเมื่อไร?', 'กดปุ่มเปลี่ยนจำนวน ผลคูณใกล้เป้าหมายที่สุดเมื่อไร', el => el.append(simNear(46, 3000))),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'จำนวนใดคูณ 54 แล้วได้ผลคูณใกล้เคียง 4,000 มากที่สุด'], ['① ประมาณ', '4,000 ÷ 54 ได้ 74 เศษ 4'], ['② ลองคู่ติดกัน', `74 × 54 = ${fmt(74 * 54)} (ห่าง ${4000 - 74 * 54}) · 75 × 54 = ${fmt(75 * 54)} (ห่าง ${75 * 54 - 4000})`], ['③ เลือก', `ห่างน้อยกว่าคือ <b>${p4bestN(54, 4000)}</b>`]], 'ถ้าโจทย์บอก “ไม่เกิน” ให้เลือกจำนวนที่ผลคูณไม่เกินเป้าหมาย'))],
    () => pkF(P4_NEAR, 6).map(p4nearQ)),
  L4M(17, 'ลายเมฆแบบรูป', 'แบบรูปของการคูณและการหาร', 'แบบรูปคูณ หาร', 'หาจำนวนที่หายไปในแบบรูปที่เกิดจากการคูณหรือการหาร',
    [T('เลือก<b>คูณ/หาร</b> ปรับตัวเลข — ดูแบบรูปเปลี่ยน', 'เลือกคูณหรือหาร ปรับตัวเลข ดูแบบรูปเปลี่ยน', el => el.append(simPatMul())),
     T('ตัวอย่างทีละขั้น: 5, 20, ?, 320, 1,280', 'ตัวอย่างทีละขั้น', p4ex([['① หาความสัมพันธ์', '20 ÷ 5 = 4 · 1,280 ÷ 320 = 4 → คูณด้วย 4'], ['② หาจำนวนที่หายไป', '20 × 4 = 80'], ['③ ตรวจ', '80 × 4 = 320 ✓']], 'จำนวนที่หายไปคือ <b>80</b>'))],
    () => pkF(P4W3_PAT, 6).map(p4patQ)),
  L4M(18, 'ตลาดคูณหาร', 'การวิเคราะห์ และแก้โจทย์ปัญหาการคูณและโจทย์ปัญหาการหาร', 'โจทย์คูณ หาร', 'วิเคราะห์โจทย์ปัญหา เขียนประโยคสัญลักษณ์การคูณหรือการหาร และหาคำตอบ',
    [T('อ่านโจทย์ ดูแผนภาพ แล้ว<b>เลือกประโยคสัญลักษณ์</b>', 'อ่านโจทย์ ดูแผนภาพ แล้วเลือกประโยคสัญลักษณ์', p4story('อูฐ <b>48</b> ตัว แบกอินทผลัมตัวละเท่า ๆ กัน รวม <b>23,040</b> ผล อูฐแต่ละตัวแบกกี่ผล', p4grpSVG(23040, 48, 480, 'p'),
       [{ q: 'แบ่งเท่า ๆ กัน → เลือกประโยคสัญลักษณ์', opts: ['23040 ÷ 48', '23040 × 48', '23040 − 48'], right: '23040 ÷ 48', lab: 'แต่ละตัวแบก', unit: 'ผล', why: 'แบ่งทั้งหมดให้เท่า ๆ กัน → หาร' }], 'ตอบ <b>480 ผล</b>')),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'ปลูกต้นอินทผลัม 156 แถว แถวละ 245 ต้น มีกี่ต้น'], ['① ถามอะไร', 'จำนวนต้นทั้งหมด'], ['② บอกอะไร', '156 แถว · แถวละ 245 ต้น (กลุ่มละเท่ากัน)'], ['③ วางแผน', 'หาทั้งหมดจากกลุ่มเท่า ๆ กัน → คูณ: 245 × 156 = □'], ['④ คำนวณ', `= ${fmt(245 * 156)}`]], `ตอบ <b>${fmt(245 * 156)} ต้น</b>`))],
    () => pkF(P4S_MD, 5).map(s => Q.dStory(s))),
  L4M(19, 'กระดานวิธีทำคูณหาร', 'การแสดงวิธีทำ โจทย์ปัญหาการคูณและโจทย์ปัญหาการหาร', 'แสดงวิธีทำ คูณ หาร', 'เขียนแสดงวิธีทำโจทย์ปัญหาการคูณและการหารอย่างเป็นลำดับ พร้อมคำตอบและหน่วย',
    [T('เรียง<b>การแสดงวิธีทำ</b>ให้ถูกลำดับ', 'เรียงการแสดงวิธีทำให้ถูกลำดับ', el => el.append(simSeqSolve({ text: 'ร้านค้าซื้อน้ำส้ม 85 ลัง ลังละ 24 กล่อง ร้านค้าซื้อน้ำส้มกี่กล่อง', expr: '85 × 24', giv: 'น้ำส้ม 85 ลัง · ลังละ 24 กล่อง', lab: 'ซื้อน้ำส้มทั้งหมด', unit: 'กล่อง' }))),
     T('ตัวอย่าง: การแสดงวิธีทำที่สมบูรณ์', 'ตัวอย่าง การแสดงวิธีทำที่สมบูรณ์', p4ex([['โจทย์', 'มีเงิน 52,800 บาท ซื้อพัดลมเครื่องละ 1,200 บาท ได้กี่เครื่อง'], ['ประโยคสัญลักษณ์', '52,800 ÷ 1,200 = □'], ['วิธีทำ', 'มีเงิน 52,800 บาท · ราคาเครื่องละ 1,200 บาท'], ['คำนวณ', 'ซื้อพัดลมได้ 52,800 ÷ 1,200 = 44 เครื่อง'], ['ตอบ', '<span class="thn">๔๔</span> เครื่อง']], 'คำตอบต้องมี<b>หน่วย</b>เสมอ'))],
    () => { const S = shuffle(P4_SOLM.slice()); return [...S.slice(0, 3).map(o => Q.p4Seq({ text: o.text, cards: P4_SOLVE(o) })), ...S.slice(3).map(o => { const a = p4ev(o.expr), right = `ตอบ ${fmt(a)} ${o.unit}`;
      return Q.p4Pick({ fig: `<div class="storybox">${o.text}</div>`, q: 'ข้อใดเขียน<span class="hl">คำตอบ</span>ของโจทย์นี้ได้ถูกต้อง', say: `${o.text} ข้อใดเขียนคำตอบได้ถูกต้อง`, opts: [right, `ตอบ ${fmt(a)}`, `ตอบ ${fmt(a * 10)} ${o.unit}`, `ตอบ ${fmt(a)} ${o.wrongUnit}`], right, hint: 'คำนวณให้ถูก และเขียนหน่วยให้ตรงกับสิ่งที่โจทย์ถาม' }); })]; }),
  L4M(20, 'ผาสร้างโจทย์คูณหาร', 'การสร้างโจทย์ปัญหาการคูณ และโจทย์ปัญหาการหาร', 'สร้างโจทย์ คูณ หาร', 'สร้างโจทย์ปัญหาการคูณและการหารให้สอดคล้องกับประโยคสัญลักษณ์ พร้อมหาคำตอบ',
    [T('<b>คูณ</b> = หลายกลุ่ม กลุ่มละเท่ากัน · <b>หาร</b> = แบ่งเท่า ๆ กัน — แตะดูโจทย์', 'คูณ คือหลายกลุ่ม กลุ่มละเท่ากัน หาร คือแบ่งเท่า ๆ กัน แตะดูโจทย์', el => { const seg = h('div', { class: 'seg p4seg' }), st = h('div', { class: 'storybox' }), out = fNote(), sen = h('div', { class: 'fbig p4big' });
       const K = { m: ['1650 × 12', 'ฟาร์มส่งไข่ไก่วันละ <b>1,650</b> ฟอง <b>12</b> วัน ส่งไข่ไก่ทั้งหมดกี่ฟอง', 'หลายวัน วันละเท่ากัน → หาทั้งหมด'], d1: ['19800 ÷ 12', 'มีไข่ไก่ <b>19,800</b> ฟอง แบ่งให้ร้านค้า <b>12</b> ร้าน ร้านละเท่า ๆ กัน ได้ร้านละกี่ฟอง', 'แบ่งให้เท่า ๆ กัน → หาส่วนละเท่าไร'], d2: ['19800 ÷ 1650', 'มีไข่ไก่ <b>19,800</b> ฟอง ส่งวันละ <b>1,650</b> ฟอง ส่งได้กี่วัน', 'จัดเป็นกลุ่มละเท่ากัน → หาว่าได้กี่กลุ่ม'] };
       const set = k => { const [e, t, w] = K[k]; sen.innerHTML = `<b class="num">${p4ex2(e)} = </b>${P4BOX}`; st.innerHTML = t; out.innerHTML = `${w} · คำตอบ <b>${fmt(p4ev(e))}</b>`; seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === k)); sfx.tap(); };
       seg.append(...[['m', 'การคูณ'], ['d1', 'หาร: ส่วนละเท่าไร'], ['d2', 'หาร: ได้กี่กลุ่ม']].map(([k, t]) => h('button', { 'data-k': k, class: 'ia', onclick: e => { e.stopPropagation(); set(k); } }, t)));
       el.append(h('div', { class: 'colstack' }, seg, sen, st, out)); set('m'); }),
     T('ตัวอย่างทีละขั้น: สร้างโจทย์จาก 2,245 ÷ 5 = □', 'ตัวอย่างทีละขั้น สร้างโจทย์จากประโยคสัญลักษณ์', p4ex([['① ดูเครื่องหมาย', '÷ → เรื่องการแบ่งเท่า ๆ กัน'], ['② เลือกเรื่อง', 'มีดินสอ 2,245 แท่ง แบ่งใส่กล่อง กล่องละ 5 แท่ง'], ['③ แต่งคำถาม', 'ได้ดินสอกี่กล่อง'], ['④ หาคำตอบ', `2,245 ÷ 5 = ${fmt(2245 / 5)} กล่อง`]], 'โจทย์ต้องมี<b>ข้อมูลครบ</b>และ<b>คำถาม</b>'))],
    () => { const S = shuffle(P4_S2SM.slice()); return [...S.slice(0, 3).map(p4s2sQ), ...S.slice(3).map(p4st2sM)]; })
];

/* ---------- boss: built from our own practice items (no official test supplied) — options rotated with d6spread ---------- */
const p4xNum = (q, r, extra = []) => { const L = Math.max(10, p4lead(r) / 10), out = [r]; [...extra, r + L, r - L, r * 10].forEach(x => { if (out.length < 4 && x > 0 && !out.includes(x)) out.push(x); }); return { q, opts: out.map(fmt), a: 0 }; };
const p4xDiv = (D, k) => { const P = p4ldivPlan(D, k), f = (q, r) => `${fmt(q)}${r ? ` เศษ ${fmt(r)}` : ''}`, alt = [[P.q + 1, P.rem], [P.q, P.rem + 1], [Math.floor(P.q / 10), P.rem], [P.q * 10 + 1, 0]];
  const out = [f(P.q, P.rem)]; alt.forEach(([q, r]) => { const s = f(q, r); if (out.length < 4 && !out.includes(s)) out.push(s); }); return { q: `${fmt(D)} ÷ ${fmt(k)} ได้ผลหารและเศษเท่าใด`, opts: out, a: 0 }; };
const p4xMul1 = (a, b) => { const r = a * b, slip = +p4D(a).map(d => (d * b) % 10).reverse().join(''); return p4xNum(`${fmt(a)} × ${fmt(b)} มีค่าเท่าใด`, r, [slip]); };
const EXAM_P4C3 = d6spread([
  p4xMul1(34984, 4), p4xMul1(115432, 7), p4xNum('3,981 × 400 มีค่าเท่าใด', 3981 * 400, [3981 * 40, 3981 * 4000]), p4xNum('32,156 × 23 มีค่าเท่าใด', 32156 * 23, [32156 * 2 + 32156 * 3 * 10, 32156 * 5]), p4xNum('345 × 728 มีค่าเท่าใด', 345 * 728),
  (() => { const r = 4381 * 572; return { q: '4,381 × 572 ข้อใดเป็นผลคูณที่สมเหตุสมผล (ใช้ค่าประมาณตรวจ)', opts: [r, Math.round(r / 10), r * 10, Math.round(r / 100)].map(fmt), a: 0 }; })(),
  p4xDiv(54321, 3), p4xDiv(76024, 9), p4xNum('4,900,000 ÷ 7 มีค่าเท่าใด', 700000, [70000, 7000000]),
  p4xDiv(78450, 15), p4xDiv(3873484, 45), p4xDiv(34560, 256),
  { q: 'จาก 87,655 ÷ 7 = 12,522 เศษ 1 ข้อใดใช้ตรวจคำตอบได้ถูกต้อง', opts: ['12,522 × 7 + 1 = 87,655', '12,522 × 7 − 1 = 87,655', '12,522 + 7 + 1 = 87,655', '87,655 × 7 + 1 = 12,522'], a: 0 },
  p4xNum(`${p4uHTML('□ × 27 = 14985')}<br>จำนวนใน □ คือข้อใด`, 555, [14985 - 27, 5550]), p4xNum(`${p4uHTML('2145600 ÷ □ = 44700')}<br>จำนวนใน □ คือข้อใด`, 48, [480, 49]),
  p4xNum('จำนวนนับใดคูณกับ 38 แล้วได้ผลคูณใกล้เคียง 1,500 มากที่สุด', p4bestN(38, 1500), [40, 38]),
  p4xNum(`${p4patHTML([100, 800, 6400, 51200, 409600], 3)}จำนวนที่หายไปในแบบรูปคือข้อใด`, 51200, [12800, 6408, 409600 - 800]),
  p4xNum('โรงเรียนสั่งซื้อดินสอ 110 กล่อง กล่องละ 70 แท่ง โรงเรียนจะได้ดินสอทั้งหมดกี่แท่ง', 7700, [180, 2300]),
  p4xNum('ครูมีงบ 1,440 บาท ซื้อหนังสือนิทานเล่มละ 45 บาท ครูซื้อหนังสือได้กี่เล่ม', 32, [64800, 1395]),
  { q: 'ข้อใดเป็นโจทย์ปัญหาที่สร้างจากประโยคสัญลักษณ์ 2,245 ÷ 5 = □ ได้ถูกต้อง', opts: ['มีลูกอม 2,245 เม็ด แบ่งใส่ถุง ถุงละ 5 เม็ด ได้กี่ถุง', 'มีลูกอม 2,245 ถุง ถุงละ 5 เม็ด มีลูกอมกี่เม็ด', 'มีลูกอม 2,245 เม็ด กินไป 5 เม็ด เหลือกี่เม็ด', 'มีลูกอม 2,245 เม็ด ซื้อเพิ่ม 5 เม็ด มีกี่เม็ด'], a: 0 }
]);
LESSONS_P4C3.push({ id: 469, boss: true, place: 'รังแมงป่องคูณหาร', title: 'ด่านบอส: บทที่ 3 การคูณและการหารจำนวนนับ', short: 'ด่านบอส · ข้อสอบ', tone: 'coral',
  goal: 'คำถามท้ายบท 20 ข้อ (การคูณ การหาร ความสัมพันธ์ ตัวไม่ทราบค่า ผลคูณใกล้เคียง แบบรูป และโจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อพิชิตทะเลทราย',
  exam: EXAM_P4C3, pass: 10, bossName: 'แมงป่องเพลิง', bossPal: 'coral', emblem: '×÷', bossKind: 'scorp' });
