/* =========================================================
   v111 (ผู้ใช้ขอ): ทุกเรื่องที่ "ตั้งบวก ตั้งลบ ตั้งคูณ" ใช้กระดานเดียวกับ ป.4 ทศนิยม ด่าน 7
   Q.colW({ nums, op, prompt, say, sig }) — the child works ON the column like on paper:
   · tap a box in the answer row, type the digits (the box moves left by itself), press ✓ ONCE — wrong boxes turn red
   · +  : small box above each column for the carry — tap = +1, keeps cycling back to empty (2 numbers: 1 ↔ empty)
   · −  : tap a top digit to borrow from it (it goes down 1, the column on its right gets 10 more) · “ย้อนการกระจาย”
   · ×  : carry boxes above the multiplicand (tap = +1 … 8, then empty) · 2-digit multiplier: partial-product rows
          (placeholder 0 on the right may be left empty) then the sum row — only the sum row is graded
   · decimals (+ −): numbers with fewer places show an empty dashed box — tap it and the 0 appears
   · zoom 50–200 % (calcZoom finds .p4col)
   ========================================================= */
const CW_PV = { 0: 'หน่วย', 1: 'สิบ', 2: 'ร้อย', 3: 'พัน', 4: 'หมื่น', 5: 'แสน', 6: 'ล้าน', 7: 'สิบล้าน', 8: 'ร้อยล้าน', '-1': 'ส.สิบ', '-2': 'ส.ร้อย', '-3': 'ส.พัน' };
const cwPl = s => (String(s).replace(/,/g, '').split('.')[1] || '').length;
const cwInt = (s, p) => { const [w, f = ''] = String(s).replace(/,/g, '').split('.'); return +((w || '0') + f.padEnd(p, '0')); };
const cwFmt = (v, p) => { const s = String(v).padStart(p + 1, '0'), w = s.slice(0, s.length - p), f = p ? s.slice(-p) : ''; return (+w).toLocaleString('en-US') + (p ? '.' + f : ''); };
/* v187 (ผู้ใช้ขอ: บวกลบน้ำหนักทดเหมือนบทบวกลบ) หน่วยผสม — o.pv(i) ป้ายหลัก · o.grp(n) [[ชื่อกลุ่ม, จำนวนหลัก], …] จากซ้าย ·
   o.split = จำนวนหลักทางขวาที่เป็นหน่วยย่อย (ขีด 1 · กรัม 3) → ระบายสีและมีเส้นแบ่ง · o.eq / o.ans ข้อความโจทย์-คำตอบ · o.nm(i) ชื่อหลักในคำอธิบาย */
function cwTint(grid, n, split) { if (!split) return; let c = 0;
  [...grid.children].forEach(el => { if (el.classList.contains('ln') || el.classList.contains('pgr') || el.classList.contains('pt')) return; const k = c % (n + 1); c++; if (!k) return; const i = n - k;
    if (i < split) el.classList.add('cwu'); if (i === split - 1) el.classList.add('cwdv'); }); }
const cwGrp = (o, n) => o.grp ? '<span class="pgr"></span>' + o.grp(n).map(([t, c, k]) => `<span class="pg pgr ${k || ''}" style="grid-column:span ${c}">${t}</span>`).join('') : '';
function colWork(bd, ctx, o) {
  const op = o.op, nums = o.nums.map(x => String(x).replace(/,/g, '')), p = op === '×' ? 0 : Math.max(...nums.map(cwPl)), V = nums.map(s => cwInt(s, p));
  const R = op === '+' ? V.reduce((x, y) => x + y, 0) : op === '−' ? V[0] - V[1] : V[0] * V[1], len = v => String(v).length, dg = (v, i) => Math.floor(v / 10 ** i) % 10;
  const PL = nums.map(cwPl), shown = j => Math.max(len(V[j]), p + 1), mul = op === '×', mB = mul ? String(V[1]).split('').reverse().map(Number) : [];
  const parts = mul && mB.length > 1 ? mB.map((d, r) => ({ r, v: V[0] * d })) : [];
  const n = Math.max(...V.map((v, j) => shown(j)), len(R), ...parts.map(x => len(x.v) + x.r));
  const rs = String(R).padStart(p + 1, '0'), want = i => i < rs.length ? rs[rs.length - 1 - i] : '';
  const maxC = op === '+' ? Math.max(1, nums.length - 1) : 8, cTop = op === '+' ? n - 1 : len(V[0]);
  const rowsE = [...parts.map(x => 'p' + x.r), 'r'], cellsOf = k => k === 'r' ? n : Math.min(n, len(V[0]) + 1 + parts[+k.slice(1)].r);
  const needZ = op === '×' ? [] : nums.flatMap((s, j) => range(0, n - 1).filter(i => i < shown(j) && i < p - PL[j]).map(i => j + ':' + i));
  const S = { zf: new Set(), carry: {}, cur: range(0, n - 1).map(i => dg(V[0], i)), res: Object.fromEntries(rowsE.map(k => [k, {}])), sel: { k: rowsE[0], i: 0 }, bad: new Set(), ok: false, hist: [] };
  const grid = h('div', { class: 'p4col e4col e4w cw ia' }), info = h('div', { class: 'p4steplab e4w-info' }), msg = h('div', { class: 'pad-msg e4w-msg' });
  let cols = '1.1em'; for (let i = n - 1; i >= 0; i--) cols += ' 1.25em' + (p && i === p ? ' .42em' : ''); grid.style.gridTemplateColumns = cols;
  const span = n + 1 + (p ? 1 : 0), row = (lead, f, pt = '') => { let x = lead; for (let i = n - 1; i >= 0; i--) { x += f(i); if (p && i === p) x += `<span class="pt">${pt}</span>`; } return x; };
  const eq = o.eq || nums.map(s => cwFmt(cwInt(s, p), p)).join(` ${op} `), ans = o.ans || cwFmt(R, p);
  const paint = () => {
    let x = cwGrp(o, n) + row('<span></span>', i => `<span class="pn">${(o.pv ? o.pv(i) : CW_PV[i - p]) || ''}</span>`);
    x += row('<span></span>', i => { if (o.plain) return '<span class="mk"></span>'; if (op === '−') return `<span class="mk">${i < shown(0) && S.cur[i] !== dg(V[0], i) ? S.cur[i] : ''}</span>`;
      return i >= 1 && i <= cTop ? `<span class="mk e4c-k${S.carry[i] ? ' on' : ''}" data-k="c:${i}">${S.carry[i] || ''}</span>` : '<span class="mk"></span>'; });
    nums.forEach((s, j) => { const last = j === nums.length - 1;
      x += row(last ? `<span class="sg">${op}</span>` : '<span></span>', i => { if (i >= shown(j)) return '<span class="dg"></span>'; const pad = i < p - PL[j];
        if (pad && !S.zf.has(j + ':' + i)) return `<span class="dg e4z" data-k="z:${j}:${i}"></span>`;
        const bt = op === '−' && j === 0 && i >= 1 && !o.plain, ch = op === '−' && j === 0 && S.cur[i] !== dg(V[0], i);
        return `<span class="dg${pad ? ' z' : ''}${ch ? ' x' : ''}${bt ? ' e4b' : ''}"${bt ? ` data-k="b:${i}"` : ''}>${dg(V[j], i)}</span>`; }, p ? '.' : ''); });
    x += `<span class="ln" style="grid-column:1 / span ${span}"></span>`;
    const ed = k => i => i >= cellsOf(k) ? '<span class="dg"></span>' : `<span class="dg rs e4r${k !== 'r' ? ' cw-part' : ''}${!S.ok && S.sel.k === k && S.sel.i === i ? ' sel' : ''}${S.bad.has(k + i) ? ' bad' : ''}${S.ok && k === 'r' ? ' ok' : ''}" data-k="r:${k}:${i}">${S.res[k][i] ?? ''}</span>`;
    parts.forEach((pt, r) => { x += row(r === parts.length - 1 ? '<span class="sg">+</span>' : '<span></span>', ed('p' + pt.r)); });
    if (parts.length) x += `<span class="ln" style="grid-column:1 / span ${span}"></span>`;
    x += row('<span></span>', ed('r'), p ? '.' : '');
    grid.innerHTML = x + `<span class="ln dbl" style="grid-column:1 / span ${span}"></span>`; cwTint(grid, n, o.split); };
  const say1 = t => { msg.innerHTML = t; };
  const undo = h('button', { class: 'btn sm ia', style: { display: 'none' }, onclick: e => { e.stopPropagation(); if (S.ok || !S.hist.length) return; const i = S.hist.pop(); S.cur[i]++; S.cur[i - 1] -= 10; if (!S.hist.length) undo.style.display = 'none'; sfx.tap(); paint(); } }, icon('undo'), 'ย้อนการกระจาย');
  grid.addEventListener('click', e => { e.stopPropagation(); if (S.ok) return; const el = e.target.closest('[data-k]'); if (!el) return; const [k, u, v] = el.dataset.k.split(':');
    if (k === 'z') { S.zf.add(u + ':' + v); sfx.pop(2); say1(''); }
    else if (k === 'c') { const i = +u; S.carry[i] = ((S.carry[i] || 0) + 1) % (maxC + 1); sfx.tap(); }
    else if (k === 'r') { S.sel = { k: u, i: +v }; sfx.tap(); }
    else if (k === 'b') { const i = +u; if (i < p - PL[0] && !S.zf.has('0:' + i)) return;
      if (S.cur[i] <= 0) { say1('หลักนี้ไม่มีให้กระจาย — กระจายจากหลักทางซ้ายมาก่อน'); sfx.no(); return; }
      if (S.cur[i - 1] >= 10) { say1('หลักทางขวาได้ 10 เพิ่มแล้ว'); return; }
      S.cur[i]--; S.cur[i - 1] += 10; if (i - 1 < p - PL[0]) S.zf.add('0:' + (i - 1)); S.hist.push(i); undo.style.display = ''; sfx.pop(3);
      say1(`กระจาย 1 จากหลัก${(CW_PV[i - p] || '').replace('ส.', 'ส่วน')} → หลัก${(CW_PV[i - 1 - p] || '').replace('ส.', 'ส่วน')} ได้ ${S.cur[i - 1]}`); }
    paint(); });
  const type = d => { if (S.ok) return; sfx.tap(); const { k, i } = S.sel; S.res[k][i] = String(d); S.bad.delete(k + i); if (i < cellsOf(k) - 1) S.sel = { k, i: i + 1 }; say1(''); paint(); };
  const del = () => { if (S.ok) return; sfx.tap(); const { k } = S.sel; if (S.res[k][S.sel.i] == null && S.sel.i > 0) S.sel = { k, i: S.sel.i - 1 }; delete S.res[k][S.sel.i]; S.bad.delete(k + S.sel.i); paint(); };
  const partOK = (pt, i) => { const got = S.res['p' + pt.r][i] ?? ''; if (got === '') return true; const s = String(pt.v) + '0'.repeat(pt.r), w = i < s.length ? s[s.length - 1 - i] : ''; return got === w; };
  const check = () => { if (S.ok) return; const miss = needZ.filter(z => !S.zf.has(z));
    if (miss.length) { say1('ตำแหน่งยังไม่เท่ากัน — แตะ<b>ช่องว่าง</b>เพื่อเติม 0 ก่อน'); sfx.no(); grid.classList.remove('e4w-zhint'); void grid.offsetWidth; grid.classList.add('e4w-zhint'); return; }
    if (!Object.values(S.res.r).some(v => v !== '')) { say1(parts.length && Object.values(S.res[rowsE[0]]).some(v => v !== '') ? 'อย่าลืมแถวคำตอบ (แถวล่างสุด)' : 'แตะช่องคำตอบ แล้วกดตัวเลขก่อนนะ'); if (parts.length) { S.sel = { k: 'r', i: 0 }; paint(); } return; }
    S.bad = new Set([...range(0, n - 1).filter(i => (S.res.r[i] ?? '') !== want(i) && !(want(i) === '' && S.res.r[i] === '0')).map(i => 'r' + i), /* v179: 0 นำหน้าทางซ้ายของคำตอบไม่ผิด (070 = 70) */ ...parts.flatMap(pt => range(0, cellsOf('p' + pt.r) - 1).filter(i => !partOK(pt, i)).map(i => 'p' + pt.r + i))]);
    if (![...S.bad].some(b => b[0] === 'r')) { S.ok = true; S.bad = new Set(); paint(); say1(''); undo.style.display = 'none'; info.innerHTML = `${eq} = <b>${ans}</b>`; return ctx.check(true); }
    paint(); ctx.check(false, o.hint || (op === '+' ? 'บวกทีละหลักจากขวาไปซ้าย หลักไหนได้ 10 ขึ้นไป เขียนหลักหน่วย แล้วทดไปหลักทางซ้าย' : op === '−' ? 'ลบทีละหลักจากขวาไปซ้าย หลักไหนลบไม่ได้ ให้แตะตัวเลขด้านบนทางซ้ายเพื่อกระจายก่อน'
      : parts.length ? 'คูณด้วยหลักหน่วยก่อน แล้วคูณด้วยหลักสิบ (เติม 0 ทางขวา) แล้วบวกผลคูณย่อย' : 'คูณทีละหลักจากหลักหน่วย ได้ 10 ขึ้นไป เขียนหลักหน่วย แล้วทดไปบวกในหลักถัดไป')); };
  const kp = h('div', { class: 'keypad e4w-kp' }); [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: e => { e.stopPropagation(); type(d); } }, d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: e => { e.stopPropagation(); del(); } }, icon('left')), h('button', { class: 'btn', onclick: e => { e.stopPropagation(); type(0); } }, '0'), h('button', { class: 'btn primary', 'aria-label': 'ตรวจ', onclick: e => { e.stopPropagation(); check(); } }, icon('check')));
  info.innerHTML = o.info || 'แตะช่องคำตอบ แล้วกดตัวเลขทีละหลัก <b>จากขวาไปซ้าย</b> · ทำครบแล้วกด ✓' + (needZ.length ? '<br>ตำแหน่งไม่เท่ากัน → แตะช่องว่างเพื่อเติม 0' : '')
    + (o.note ? '<br>' + o.note : '') + (o.plain ? '' : op === '+' ? '<br>ทด: แตะช่องเล็กเหนือหลัก (แตะอีกครั้งเพื่อเปลี่ยน/ลบ)' : op === '−' ? '<br>ลบไม่ได้ → แตะตัวเลขตัวตั้งทางซ้ายเพื่อกระจาย' : '<br>ทด: แตะช่องเล็กเหนือหลัก (แตะซ้ำ = เพิ่มทีละ 1)')
    + (parts.length ? '<br>แถวผลคูณย่อย: คูณด้วยหลักหน่วย → หลักสิบ (ช่องขวาสุดเป็น 0) → บวกกันในแถวล่าง' : '');
  grid.classList.add('rvl'); grid.ansText = cwFmt(R, p).replace(/,/g, '');
  grid.reveal = () => { needZ.forEach(z => S.zf.add(z));
    if (op === '+') { let c = 0; for (let i = 0; i < n; i++) { const s = V.reduce((t, v) => t + dg(v, i), 0) + c; c = Math.floor(s / 10); if (c && i + 1 <= cTop) S.carry[i + 1] = c; } }
    else if (op === '−') { const t = range(0, n - 1).map(i => dg(V[0], i)); range(0, n - 1).forEach(i => { if (t[i] < dg(V[1], i)) { let j = i + 1; while (t[j] === 0) j++; t[j]--; for (let k = j - 1; k > i; k--) t[k] += 9; t[i] += 10; } }); S.cur = t; }
    else if (!parts.length) { let c = 0; for (let i = 0; i < len(V[0]); i++) { const s = dg(V[0], i) * V[1] + c; c = Math.floor(s / 10); if (c) S.carry[i + 1] = c; } }
    parts.forEach(pt => { const s = String(pt.v) + '0'.repeat(pt.r); range(0, cellsOf('p' + pt.r) - 1).forEach(i => { if (i < s.length) S.res['p' + pt.r][i] = s[s.length - 1 - i]; }); });
    range(0, n - 1).forEach(i => { const w = want(i); if (w === '') delete S.res.r[i]; else S.res.r[i] = w; }); S.bad = new Set(); S.ok = true; undo.style.display = 'none'; info.innerHTML = `${eq} = <b>${ans}</b>`; say1(''); paint(); };
  paint(); bd.append(g4Side(h('div', { class: 'e4w-fig' }, grid), info, kp, msg, undo)); return grid;
}
/* v188: กระดานหน่วยผสมในเกม — keypad ขวา · lab (ถ้ามี) ไว้บนสุดของคอลัมน์ขวา */
function cwMount(el, ctx, o, lab) { el.classList.add('w2cw'); colWork(el, ctx, o); const R = el.querySelector('.g4sd-r'); if (R && lab) R.prepend(lab); return el; }
Object.assign(Q, {
  colW({ nums, op, prompt, say, sig, plain, ...rest }) { /* plain: ไม่มีช่องทด / ไม่ให้กระจาย (ด่านที่ยังไม่เรียนทด) */ const vb = op === '+' ? 'บวก' : op === '−' ? 'ลบ' : 'คูณ', p = op === '×' ? 0 : Math.max(...nums.map(cwPl)), eq = nums.map(s => cwFmt(cwInt(s, p), p)).join(` ${op} `);
    return { prompt: prompt || `ตั้ง${vb} <b class="num">${eq}</b>`, say: say || `ตั้ง${vb} ${eq.replace(/,/g, '')}`, __sig: sig || `cw ${nums.join(op)}`, mount(bd, ctx) { colWork(bd, ctx, { nums, op, plain, ...rest }); } }; }
});

/* =========================================================
   v114 (ผู้ใช้ขอ): ตัวอย่างทีละขั้น “ทีละขั้นจริง ๆ ให้เห็นภาพ” — colWalk(nums, op)
   The same column board, read-only. Every press of “ขั้นต่อไป” does ONE thing on the board:
   align → (fill the 0s) → one column at a time (the column lights up, the digit pops in, the carry appears above /
   the borrow crosses out and rewrites) → (× : one partial-product row at a time, its 0 on the right first) → the sum → the answer.
   “ย้อนขั้น” goes back; the step text stays in a list on the right.
   ========================================================= */
function colWalk(nums0, op, o = {}) {
  const nums = nums0.map(x => String(x).replace(/,/g, '')), p = op === '×' ? 0 : Math.max(...nums.map(cwPl)), V = nums.map(s => cwInt(s, p)), PL = nums.map(cwPl);
  const len = v => String(v).length, dg = (v, i) => Math.floor(v / 10 ** i) % 10, shown = j => Math.max(len(V[j]), p + 1), NM = i => o.nm ? o.nm(i) : 'หลัก' + (CW_PV[i - p] || '').replace('ส.', 'ส่วน');
  const R = op === '+' ? V.reduce((x, y) => x + y, 0) : op === '−' ? V[0] - V[1] : V[0] * V[1], mB = op === '×' ? String(V[1]).split('').reverse().map(Number) : [];
  const parts = op === '×' && mB.length > 1 ? mB.map((d, r) => ({ r, d, v: V[0] * d })) : [];
  const n = Math.max(...V.map((v, j) => shown(j)), len(R), ...parts.map(x => len(x.v) + x.r)), rows = [...parts.map(x => 'p' + x.r), 'r'];
  const pads = op === '×' ? [] : nums.flatMap((s, j) => range(0, n - 1).filter(i => i < shown(j) && i < p - PL[j]).map(i => j + ':' + i));
  const eqTxt = o.eq || nums.map(s => cwFmt(cwInt(s, p), p)).join(` ${op} `), ans = o.ans || cwFmt(R, p);
  /* ---- the steps: each = { t, hl, rowHl, f(S) } ---- */
  const ST = []; const add = (t, hl, f, rowHl, mr) => ST.push({ t, hl, f, rowHl, mr });
  add(op === '×' ? 'ตั้งตัวตั้งไว้บน ตัวคูณไว้ล่าง ให้<b>หลักหน่วยตรงกัน</b>' : p ? 'ตั้งให้<b>จุดทศนิยมตรงกัน</b> หลักเดียวกันอยู่ตรงกัน' : 'ตั้งให้<b>หลักตรงกัน</b> — หลักหน่วยตรงหลักหน่วย', -1, () => {});
  if (pads.length) add('ตำแหน่งทศนิยมไม่เท่ากัน → <b>เติม 0</b> ให้เท่ากัน (ค่าไม่เปลี่ยน)', -1, S => pads.forEach(z => { S.zf.add(z); S.nw.add('z' + z); }));
  const addCols = (vals, target, label) => { let c = 0; const top = Math.max(...vals.map(len)) - 1;
    for (let i = 0; i < n; i++) { const ds = vals.map(v => i < len(v) ? dg(v, i) : null).filter(x => x != null); if (!ds.length && !c) break; const s = ds.reduce((x, y) => x + y, 0) + c, cin = c;
      const last = i >= top; c = Math.floor(s / 10);
      add(`${label || ''}${NM(i)}: ${ds.join(' + ')}${cin ? ` + <b class="cw-c">${cin}</b> (ที่ทด)` : ''} = <b>${s}</b>` + (s >= 10 && !last ? ` → เขียน <b>${s % 10}</b> ทด <b class="cw-c">${c}</b> ไป${NM(i + 1)}` : s >= 10 ? ` → เขียน <b>${s}</b>` : ''), i,
        ((i, s, last, c) => S => { S.res[target][i] = s % 10; S.nw.add(target + i); if (s >= 10 && last) { S.res[target][i + 1] = Math.floor(s / 10); S.nw.add(target + (i + 1)); } else if (s >= 10) { S.carry[i + 1] = c; S.nw.add('c' + (i + 1)); } })(i, s, last, c), target);
      if (last && s >= 10) break; } };
  if (op === '+') addCols(V, 'r');
  else if (op === '−') { const cur = range(0, n - 1).map(i => dg(V[0], i)), rl = len(R) - 1;
    for (let i = 0; i < n; i++) { const bot = i < shown(1) ? dg(V[1], i) : null;
      if (bot != null && cur[i] < bot) { let j = i + 1; while (cur[j] === 0) j++; const thru = j > i + 1, before = cur.slice();
        cur[j]--; for (let k = j - 1; k > i; k--) cur[k] += 9; cur[i] += 10; const after = cur.slice();
        add(`${NM(i)}: ${before[i]} ลบ ${bot} ไม่ได้ → <b>กระจาย 1</b> จาก${NM(j)}` + (thru ? ` (ผ่านหลักที่เป็น 0 → กลายเป็น 9)` : '') + ` → ${NM(i)} ได้ <b>${after[i]}</b>`, i, ((a) => S => { range(0, n - 1).forEach(k => { if (S.cur[k] !== a[k]) S.nw.add('b' + k); }); S.cur = a.slice(); })(after)); }
      if (i > rl && !(cur[i])) continue; const v = cur[i] - (bot || 0);
      add(bot == null ? `${NM(i)}: ไม่มีตัวลบ → เขียน <b>${cur[i]}</b> ลงมา` : `${NM(i)}: ${cur[i]} − ${bot} = <b>${v}</b>`, i, ((i, v) => S => { S.res.r[i] = v; S.nw.add('r' + i); })(i, v), 'r'); } }
  else { const one = (d, r, target) => { let c = 0; const L = len(V[0]);
      for (let i = 0; i < L; i++) { const s = dg(V[0], i) * d + c, cin = c, last = i === L - 1; c = Math.floor(s / 10);
        add(`${parts.length ? `คูณด้วย ${d}: ` : ''}${NM(i)}: ${dg(V[0], i)} × ${d}${cin ? ` + <b class="cw-c">${cin}</b> (ที่ทด)` : ''} = <b>${s}</b>` + (s >= 10 && !last ? ` → เขียน <b>${s % 10}</b> ทด <b class="cw-c">${c}</b>` : s >= 10 ? ` → เขียน <b>${s}</b>` : ''), i + r,
          ((i, s, last, c) => S => { S.res[target][i + r] = s % 10; S.nw.add(target + (i + r)); if (last && s >= 10) { S.res[target][i + r + 1] = Math.floor(s / 10); S.nw.add(target + (i + r + 1)); } else if (s >= 10) { S.carry[i + 1] = c; S.nw.add('c' + (i + 1)); } })(i, s, last, c), target, r); } };
    if (!parts.length) one(V[1], 0, 'r');
    else { parts.forEach(pt => { const k = 'p' + pt.r;
        add(`<b>ผลคูณย่อยแถวที่ ${pt.r + 1}</b>: คูณด้วยเลขโดด${NM(pt.r)} (${pt.d}${pt.r ? ' ซึ่งมีค่า ' + fmt(pt.d * 10 ** pt.r) : ''})` + (pt.r ? ` → เขียน <b>0</b> ไว้ทางขวา ${pt.r} ตัวก่อน` : '') + ' · ล้างตัวทดเดิม', -1, S => { S.carry = {}; for (let z = 0; z < pt.r; z++) { S.res[k][z] = 0; S.nw.add(k + z); } }, k, pt.r);
        one(pt.d, pt.r, k); });
      add('<b>บวกผลคูณย่อย</b>ทุกแถว ทีละหลักจากขวา · ล้างตัวทดเดิม', -1, S => { S.carry = {}; }, 'r');
      addCols(parts.map(x => x.v * 10 ** x.r), 'r', ''); } }
  add(`คำตอบ <b class="num">${eqTxt} = ${ans}</b>`, -1, S => { S.ok = true; });
  /* ---- board ---- */
  const grid = h('div', { class: 'p4col e4col e4w cw cwk' }), cur0 = range(0, n - 1).map(i => dg(V[0], i));
  let cols = '1.1em'; for (let i = n - 1; i >= 0; i--) cols += ' 1.25em' + (p && i === p ? ' .42em' : ''); grid.style.gridTemplateColumns = cols;
  const span = n + 1 + (p ? 1 : 0), row = (lead, f, pt = '') => { let x = lead; for (let i = n - 1; i >= 0; i--) { x += f(i); if (p && i === p) x += `<span class="pt">${pt}</span>`; } return x; };
  const fresh = () => ({ zf: new Set(), carry: {}, cur: cur0.slice(), res: Object.fromEntries(rows.map(k => [k, {}])), nw: new Set(), ok: false });
  let k = 0; const stateAt = m => { const S = fresh(); for (let j = 0; j < m; j++) { S.nw = new Set(); ST[j].f(S); } return S; };
  const paint = () => { const S = stateAt(k), st = k ? ST[k - 1] : null, hl = st ? st.hl : -1, hc = i => i === hl ? ' cw-hl' : '';
    let x = cwGrp(o, n) + row('<span></span>', i => `<span class="pn${hc(i)}">${(o.pv ? o.pv(i) : CW_PV[i - p]) || ''}</span>`);
    x += row('<span></span>', i => op === '−' ? `<span class="mk${hc(i)}${S.nw.has('b' + i) ? ' cw-new' : ''}">${i < shown(0) && S.cur[i] !== cur0[i] ? S.cur[i] : ''}</span>` : `<span class="mk cw-cm${hc(i)}${S.nw.has('c' + i) ? ' cw-new' : ''}">${S.carry[i] || ''}</span>`);
    nums.forEach((s, j) => { const last = j === nums.length - 1;
      x += row(last ? `<span class="sg">${op}</span>` : '<span></span>', i => { if (i >= shown(j)) return `<span class="dg${hc(i)}"></span>`; const pad = i < p - PL[j];
        if (pad && !S.zf.has(j + ':' + i)) return `<span class="dg cw-pad${hc(i)}"></span>`;
        const ch = op === '−' && j === 0 && S.cur[i] !== cur0[i];
        const m2 = op === '×' && j === 1 && st && st.mr === i ? ' cw-hl2' : ''; // the multiplier digit in use
        return `<span class="dg${pad ? ' z' : ''}${ch ? ' x' : ''}${hc(i)}${m2}${S.nw.has('z' + j + ':' + i) ? ' cw-new' : ''}">${dg(V[j], i)}</span>`; }, p ? '.' : ''); });
    x += `<span class="ln" style="grid-column:1 / span ${span}"></span>`;
    const rr = key => i => { const v = S.res[key][i], on = st && st.rowHl === key; return `<span class="dg rs cw-out${hc(i)}${on && v == null ? '' : ''}${S.nw.has(key + i) ? ' cw-new' : ''}${S.ok && key === 'r' ? ' cw-ok' : ''}">${v ?? ''}</span>`; };
    parts.forEach((pt, r) => { x += row(r === parts.length - 1 ? '<span class="sg">+</span>' : '<span></span>', rr('p' + pt.r)); });
    if (parts.length) x += `<span class="ln" style="grid-column:1 / span ${span}"></span>`;
    x += row('<span></span>', rr('r'), p ? '.' : '');
    grid.innerHTML = x + `<span class="ln dbl" style="grid-column:1 / span ${span}"></span>`; cwTint(grid, n, o.split);
    now.innerHTML = st ? `<span class="cwk-n">ขั้นที่ ${k}/${ST.length}</span> ${st.t}` : `โจทย์ <b class="num">${eqTxt} = ?</b><br><small>กด “ขั้นต่อไป” ดูทีละขั้น</small>`;
    log.innerHTML = ST.slice(0, Math.max(0, k - 1)).map((s, j) => `<div class="cwk-li"><i>${j + 1}</i><span>${s.t}</span></div>`).join(''); log.scrollTop = log.scrollHeight;
    nx.disabled = k >= ST.length; bk.disabled = k === 0; nx.lastChild.textContent = k >= ST.length ? 'ครบทุกขั้นแล้ว' : 'ขั้นต่อไป';
    if (k >= ST.length && !done) { done = true; sfx.ok(); teachDone(wait); } };
  let done = false; const wait = h6wait(), now = h('div', { class: 'cwk-now' }), log = h('div', { class: 'cwk-log' });
  const nx = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (k < ST.length) { k++; sfx.pop(k); paint(); } } }, icon('right'), h('span', null, 'ขั้นต่อไป'));
  const bk = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (k > 0) { k--; sfx.tap(); paint(); } } }, icon('left'), 'ย้อนขั้น');
  paint();
  return h('div', { class: 'cwk-wrap' }, wait, g4Side(h('div', { class: 'e4w-fig' }, grid), now, h('div', { class: 'rowstack' }, bk, nx), log));
}
