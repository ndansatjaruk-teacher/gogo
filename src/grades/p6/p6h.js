/* =========================================================
   ป.6 บทที่ 1 ห.ร.ม. และ ค.ร.น. — number engine (factors, primes, HCF/LCM),
   interactive sims, question types (h…), levels 701–714 + boss 719
   ========================================================= */
const h6fac = n => { const a = []; for (let i = 1; i <= n; i++) if (n % i === 0) a.push(i); return a; };
const h6prime = n => n > 1 && h6fac(n).length === 2;
const h6pf = n => { const a = []; let m = n; for (let p = 2; m > 1; p++) while (m % p === 0) { a.push(p); m /= p; } return a; };
const h6g = (a, b) => b ? h6g(b, a % b) : a;
const h6gcd = ns => ns.reduce(h6g);
const h6lcm = ns => ns.reduce((a, b) => a / h6g(a, b) * b);
const h6x = a => a.join(' × ');
const H6SUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };
const h6pow = n => { const c = {}; h6pf(n).forEach(p => c[p] = (c[p] || 0) + 1); return Object.keys(c).map(p => p + (c[p] > 1 ? H6SUP[c[p]] : '')).join(' × '); };
const h6and = ns => ns.length === 2 ? `${fmt(ns[0])} และ ${fmt(ns[1])}` : ns.slice(0, -1).map(fmt).join(', ') + ' และ ' + fmt(ns[ns.length - 1]);
const h6N = n => `<b class="h6n">${fmt(n)}</b>`;
const H6PR = [2, 3, 5, 7, 11, 13, 17, 19];
/* hidden sequence marker: keeps the teaching gate closed until the sim calls teachDone() */
const h6wait = () => h('button', { class: 'btn info h6-wait', tabindex: '-1', 'aria-hidden': 'true', style: { display: 'none' } });

/* ---------- short division plans: pf (one number) / hcf / lcm ---------- */
function h6plan(nums, mode) {
  const rows = []; let cur = nums.slice();
  const ok = (p, c) => mode === 'pf' ? c[0] % p === 0 && !h6prime(c[0]) : mode === 'hcf' ? c.every(x => x % p === 0) : c.filter(x => x % p === 0).length >= 2;
  for (;;) { const p = H6PR.concat([23, 29, 31, 37, 41, 43, 47]).find(q => ok(q, cur)); if (!p) break;
    const nx = cur.map(x => x % p === 0 ? x / p : x); rows.push({ p, nums: cur, next: nx }); cur = nx; }
  return { rows, last: cur, ok };
}
const h6valid = (mode, p, cur) => mode === 'pf' ? cur[0] % p === 0 && cur[0] !== p : mode === 'hcf' ? cur.every(x => x % p === 0) : cur.filter(x => x % p === 0).length >= 2;
const H6MODE = { pf: 'แยกตัวประกอบ', hcf: 'ห.ร.ม.', lcm: 'ค.ร.น.' };
function h6sdBox(nums) {
  const box = h('div', { class: 'h6-sd' }); const head = h('div', { class: 'h6-sd-row' }, h('span', { class: 'd' }), h('span', { class: 'ns' }, ...nums.map(v => h('i', null, fmt(v))))); box.append(head);
  box.add = (p, next) => { const last = box.lastChild; last.querySelector('.d').textContent = p; last.classList.add('cut'); box.append(h('div', { class: 'h6-sd-row' }, h('span', { class: 'd' }), h('span', { class: 'ns' }, ...next.map(v => h('i', null, fmt(v)))))); };
  return box;
}
const h6sdResult = (mode, nums, plan) => {
  const ds = plan.rows.map(r => r.p);
  if (mode === 'pf') { const f = [...ds, plan.last[0]]; return `${h6N(nums[0])} = ${h6x(f)}`; }
  if (mode === 'hcf') return ds.length ? `ห.ร.ม. ของ ${h6and(nums)} = ${h6x(ds)} = <b>${fmt(h6gcd(nums))}</b>` : `ไม่มีจำนวนเฉพาะใดหารทุกจำนวนลงตัว → ห.ร.ม. = <b>1</b>`;
  const rest = plan.last.filter(x => x > 1); return `ค.ร.น. ของ ${h6and(nums)} = ${h6x([...ds, ...rest])} = <b>${fmt(h6lcm(nums))}</b>`;
};
/* worked short division: tap “หารต่อ” one row at a time */
function simShortDiv(nums, mode) {
  const plan = h6plan(nums, mode), box = h6sdBox(nums), out = fNote(); let k = 0;
  const why = r => { if (mode === 'pf') return `${r.p} หาร ${fmt(r.nums[0])} ลงตัว ได้ ${fmt(r.next[0])}`; if (mode === 'hcf') return `${r.p} หาร ${h6and(r.nums)} ลงตัวทุกจำนวน`;
    const y = r.nums.filter(x => x % r.p === 0), n = r.nums.filter(x => x % r.p); return `${r.p} หาร ${y.length > 1 ? h6and(y) : y[0]} ลงตัว${n.length ? ` · ${n.join(', ')} หารไม่ลงตัว ดึงลงมา` : ''}`; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation();
    if (k < plan.rows.length) { const r = plan.rows[k++]; box.add(r.p, r.next); out.innerHTML = why(r); sfx.pop(k); }
    if (k >= plan.rows.length) { btn.remove(); box.classList.add(mode === 'lcm' ? 'fin-l' : 'fin'); out.innerHTML = (mode === 'pf' ? 'ผลหารเป็นจำนวนเฉพาะแล้ว หยุดหาร → ' : mode === 'hcf' ? 'ไม่มีจำนวนเฉพาะใดหารทุกจำนวนลงตัวแล้ว หยุด → ' : 'ไม่มีจำนวนเฉพาะใดหารได้ลงตัว 2 จำนวนแล้ว หยุด → ') + h6sdResult(mode, nums, plan); sfx.ok(); say(speakText(out.innerHTML), true); } } }, icon('right'), 'หารต่อ');
  return h('div', { class: 'colstack' }, h('div', { class: 'cap' }, `ตั้งหารสั้น หา${H6MODE[mode]} ของ ${h6and(nums)}`), box, btn, out);
}
/* try it: the student chooses each prime divisor */
function simShortDivTry(nums, mode) {
  const plan = h6plan(nums, mode), box = h6sdBox(nums), out = fNote(); let cur = nums.slice(), ds = [];
  const pad = h('div', { class: 'h6-prow' });
  const finish = () => { pad.remove(); box.classList.add(mode === 'lcm' ? 'fin-l' : 'fin');
    const res = mode === 'pf' ? `${h6N(nums[0])} = ${h6x([...ds, cur[0]])}` : mode === 'hcf' ? `ห.ร.ม. = ${ds.length ? h6x(ds) + ' = ' : ''}<b>${fmt(h6gcd(nums))}</b>` : `ค.ร.น. = ${h6x([...ds, ...cur.filter(x => x > 1)])} = <b>${fmt(h6lcm(nums))}</b>`;
    out.innerHTML = 'หารต่อไม่ได้แล้ว → ' + res; sfx.ok(); say(speakText(out.innerHTML), true); teachDone(box); };
  [2, 3, 5, 7, 11, 13].forEach(p => pad.append(h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation();
    if (!h6valid(mode, p, cur)) { sfx.no(); out.innerHTML = mode === 'pf' ? `${p} หาร ${fmt(cur[0])} ไม่ลงตัว ลองจำนวนเฉพาะอื่น` : mode === 'hcf' ? `${p} หาร ${h6and(cur)} ไม่ลงตัว<b>ทุกจำนวน</b> ลองตัวอื่น` : `${p} หารลงตัวได้ไม่ถึง 2 จำนวน ลองตัวอื่น`; return; }
    const nx = cur.map(x => x % p === 0 ? x / p : x); box.add(p, nx); ds.push(p); cur = nx; sfx.pop(ds.length); out.innerHTML = `ใช้ ${p} หารได้!`;
    if (!H6PR.some(q => h6valid(mode, q, cur)) || (mode === 'pf' && h6prime(cur[0]))) finish(); } }, String(p))));
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, `เลือกจำนวนเฉพาะมาหาร (หา${H6MODE[mode]} ของ ${h6and(nums)})`), box, pad, out);
}

/* ---------- factor rectangles: arrange n dots in equal rows ---------- */
function simRect(n0 = 18) {
  let n = n0, r = 3; const found = new Set(); const pic = h('div', { class: 'h6-rect' }), big = h('div', { class: 'fbig' }), out = fNote(), chips = h('div', { class: 'h6-found' });
  const draw = () => { const c = Math.ceil(n / r), s = Math.min(22, 520 / Math.max(c, 1)), full = n % r === 0;
    let g = `<svg viewBox="0 0 ${c * s + 8} ${r * s + 8}" class="h6-dots" style="max-height:${Math.min(240, r * s + 8)}px" aria-hidden="true">`;
    for (let i = 0; i < n; i++) { const y = Math.floor(i / c), x = i % c; g += `<circle cx="${4 + x * s + s / 2}" cy="${4 + y * s + s / 2}" r="${s * .36}" fill="${full ? '#4FD1A1' : y === r - 1 && n % c ? '#FF7B86' : '#6FB2F5'}"/>`; }
    pic.innerHTML = g + '</svg>';
    if (full) { found.add(r); found.add(n / r); big.innerHTML = `${h6N(n)} = ${r} × ${n / r}`; out.innerHTML = `จัดได้ ${r} แถว แถวละ ${n / r} พอดี → <b>${r}</b> และ <b>${n / r}</b> เป็นตัวประกอบของ ${n}`; }
    else { big.innerHTML = `${h6N(n)} ÷ ${r} = ${Math.floor(n / r)} เศษ ${n % r}`; out.innerHTML = `จัด ${r} แถวให้เท่ากันไม่ได้ (เหลือเศษ) → ${r} <b>ไม่ใช่</b>ตัวประกอบของ ${n}`; }
    chips.innerHTML = h6fac(n).map(f => `<i class="${found.has(f) ? 'on' : ''}">${f}</i>`).join('');
    if (h6fac(n).every(f => found.has(f))) { out.innerHTML += `<br>ครบแล้ว! ${n} มีตัวประกอบ ${h6fac(n).length} ตัว${h6prime(n) ? ' — จัดได้แบบเดียว (1 แถว หรือ 1 หลัก) จึงเป็น<b>จำนวนเฉพาะ</b>' : ''}`; teachDone(pic); } };
  const sn = stepper('จำนวนจุด', () => n, x => { n = x; found.clear(); if (r > n) { r = n; sr.sync(); } }, () => 2, () => 40, draw), sr = stepper('จำนวนแถว', () => r, x => r = x, () => 1, () => n, draw);
  draw(); return h('div', { class: 'colstack' }, h6wait(), big, pic, h('div', { class: 'rowstack' }, sn, sr), h('div', { class: 'cap' }, 'ตัวประกอบที่พบแล้ว'), chips, out);
}

/* ---------- sieve of Eratosthenes 1–50 ---------- */
function simSieve(max = 50) {
  const cells = [], grid = h('div', { class: 'h6-sieve' }), out = fNote(), P = [2, 3, 5, 7]; let k = 0;
  for (let v = 1; v <= max; v++) { const c = h('button', { class: 'h6-cell ia' + (v === 1 ? ' one' : ''), onclick: e => { e.stopPropagation(); const f = h6fac(v); sfx.pop(v % 8);
    out.innerHTML = v === 1 ? '1 มีตัวประกอบเพียง 1 ตัว → <b>ไม่เป็น</b>ทั้งจำนวนเฉพาะและจำนวนประกอบ' : `${v} มีตัวประกอบ ${f.join(', ')} (${f.length} ตัว) → ${f.length === 2 ? '<b>จำนวนเฉพาะ</b>' : 'จำนวนประกอบ'}`; } }, String(v)); cells.push(c); grid.append(c); }
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const p = P[k++]; cells[p - 1].classList.add('p');
    for (let m = p * 2; m <= max; m += p) { const c = cells[m - 1]; setTimeout(() => c.classList.add('x'), (m / p) * 30); }
    out.innerHTML = `${p} เป็นจำนวนเฉพาะ — ขีดฆ่าพหุคูณของ ${p} (${p * 2}, ${p * 3}, ${p * 4}, …) เพราะมี ${p} เป็นตัวประกอบ`; sfx.pop(k);
    if (k < P.length) btn.lastChild.textContent = `ขีดฆ่าพหุคูณของ ${P[k]}`;
    else { btn.remove(); setTimeout(() => { cells.forEach((c, i) => { if (i && !c.classList.contains('x')) c.classList.add('p'); }); out.innerHTML = `ตัวที่เหลือ (ยกเว้น 1) คือ<b>จำนวนเฉพาะ</b>: ${cells.filter((c, i) => i && !c.classList.contains('x')).map(c => c.textContent).join(', ')}`; sfx.ok(); }, 600); } } }, icon('right'), h('span', null, 'ขีดฆ่าพหุคูณของ 2'));
  return h('div', { class: 'colstack' }, grid, btn, out, h('div', { class: 'cap' }, 'แตะตัวเลขเพื่อดูตัวประกอบ'));
}

/* ---------- factor tree: tap a composite leaf, choose how to split ---------- */
function simTree(list = [72, 60, 90, 48]) {
  let li = 0, root; const wrap = h('div', { class: 'h6-tree' }), pick = h('div', { class: 'h6-prow' }), out = fNote();
  const reset = () => { root = { v: list[li] }; pick.innerHTML = ''; out.innerHTML = 'แตะจำนวนสีฟ้าเพื่อแยกเป็นผลคูณของ 2 จำนวน'; draw(); };
  const leaves = (t, a = []) => { if (t.k) t.k.forEach(c => leaves(c, a)); else a.push(t); return a; };
  const depth = t => t.k ? 1 + Math.max(...t.k.map(depth)) : 0;
  function draw() {
    const L = leaves(root), D = depth(root), W = 100, RH = 62; let slot = 0; wrap.innerHTML = '';
    const pos = (t, d) => { if (t.k) { t.k.forEach(c => pos(c, d + 1)); t.x = (t.k[0].x + t.k[1].x) / 2; } else t.x = (slot++ + .5) / L.length * W; t.y = d * RH + 26; };
    pos(root, 0); wrap.style.height = (D + 1) * RH + 'px';
    let svg = `<svg class="h6-tree-l" viewBox="0 0 100 ${(D + 1) * RH}" preserveAspectRatio="none" aria-hidden="true">`;
    const lines = t => { if (t.k) t.k.forEach(c => { svg += `<line x1="${t.x}" y1="${t.y + 14}" x2="${c.x}" y2="${c.y - 14}" stroke="#9F8FF0" stroke-width="2.4" vector-effect="non-scaling-stroke"/>`; lines(c); }); };
    lines(root); wrap.innerHTML = svg + '</svg>';
    const nodes = t => { const st = { left: t.x + '%', top: t.y + 'px' };
      if (!t.k && !h6prime(t.v)) wrap.append(h('button', { class: 'btn info h6-node', style: st, onclick: e => { e.stopPropagation(); sfx.tap(); choose(t); } }, String(t.v)));
      else wrap.append(h('span', { class: 'h6-node' + (t.k ? '' : ' pr'), style: st }, String(t.v)));
      if (t.k) t.k.forEach(nodes); };
    nodes(root);
    if (L.every(t => h6prime(t.v))) { const f = L.map(t => t.v).sort((a, b) => a - b);
      out.innerHTML = `ปลายกิ่งเป็นจำนวนเฉพาะทั้งหมด → ${h6N(root.v)} = ${h6x(f)}${f.length > new Set(f).size ? ` = ${h6pow(root.v)}` : ''}<br><small>แยกแบบไหนก็ได้ตัวประกอบเฉพาะชุดเดียวกัน</small>`; sfx.ok(); }
  }
  function choose(t) { pick.innerHTML = ''; const pairs = h6fac(t.v).filter(a => a > 1 && a * a <= t.v).map(a => [a, t.v / a]);
    out.innerHTML = `แยก ${t.v} เป็นผลคูณแบบไหนดี?`;
    pairs.forEach(([a, b]) => pick.append(h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); t.k = [{ v: a }, { v: b }]; pick.innerHTML = ''; out.innerHTML = `${t.v} = ${a} × ${b}`; sfx.pop(a % 8); draw(); } }, `${a} × ${b}`))); }
  const again = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.page(); reset(); } }, icon('replay'), 'แยกแบบอื่น');
  const other = h('button', { class: 'btn sm ia nxp', onclick: e => { e.stopPropagation(); sfx.page(); li = (li + 1) % list.length; reset(); } }, 'เปลี่ยนจำนวน');
  reset(); return h('div', { class: 'colstack' }, wrap, pick, out, h('div', { class: 'rowstack' }, again, other));
}

/* ---------- Venn of factors: common factors and the HCF ---------- */
function simVenn(pairs = [[12, 20], [18, 27], [16, 28], [30, 42]]) {
  let pi = 0, st = 0; const pic = h('div', { class: 'h6-venn' }), out = fNote();
  const STEPS = ['เขียนตัวประกอบของจำนวนแรก', 'เขียนตัวประกอบของจำนวนที่สอง', 'ย้ายตัวประกอบร่วมไปตรงกลาง', 'หาตัวประกอบร่วมที่มากที่สุด'];
  const draw = () => { const [a, b] = pairs[pi], A = h6fac(a), B = h6fac(b), C = A.filter(x => B.includes(x)), g = Math.max(...C);
    const place = (arr, x0, cols, cls, sp = 34) => arr.map((v, i) => `<text x="${x0 + (i % cols) * sp}" y="${128 + Math.floor(i / cols) * 34}" class="${cls}${v === g && st >= 4 ? ' g' : ''}" text-anchor="middle">${v}</text>`).join('');
    const Lft = st >= 3 ? A.filter(x => !C.includes(x)) : st >= 1 ? A : [], Rgt = B.filter(x => !C.includes(x)), Mid = st >= 3 ? C : [];
    let s = `<svg viewBox="0 0 520 320" aria-hidden="true"><circle cx="190" cy="170" r="122" fill="#6FB2F5" fill-opacity=".14" stroke="#3F8BDB" stroke-width="2.4"/><circle cx="330" cy="170" r="122" fill="#FFA24C" fill-opacity=".14" stroke="#EC7F1E" stroke-width="2.4"/>`;
    s += `<text x="110" y="30" text-anchor="middle" class="vt" fill="#2B6FBA">ตัวประกอบของ ${a}</text><text x="410" y="30" text-anchor="middle" class="vt" fill="#C96512">ตัวประกอบของ ${b}</text>`;
    if (st >= 3) s += `<path d="M260 282V298" stroke="#1B8862" stroke-width="2"/><text x="260" y="316" text-anchor="middle" class="vt" fill="#1B8862">ตัวประกอบร่วม</text>`;
    s += st >= 3 ? place(Lft, 96, 3, 'va') + place(Rgt, 360, 3, 'vb') + place(Mid, 243, 2, 'vc') : place(Lft, 92, 4, 'va', 32) + (st >= 2 ? place(B, 332, 4, 'vb', 32) : '');
    if (st >= 4) { const i = Mid.indexOf(g); s += `<circle cx="${243 + (i % 2) * 34}" cy="${122 + Math.floor(i / 2) * 34}" r="17" fill="none" stroke="#F5B52E" stroke-width="3.4"/>`; }
    pic.innerHTML = s + '</svg>';
    out.innerHTML = st === 0 ? `หา ห.ร.ม. ของ ${a} และ ${b} — กดทีละขั้น` : st === 1 ? `ตัวประกอบของ ${a}: ${A.join(', ')}` : st === 2 ? `ตัวประกอบของ ${b}: ${B.join(', ')}` : st === 3 ? `ตัวประกอบร่วม (ตัวหารร่วม) ของ ${a} และ ${b}: <b>${C.join(', ')}</b>` : `ตัวประกอบร่วมที่<b>มากที่สุด</b>คือ ${g} → ห.ร.ม. ของ ${a} และ ${b} คือ <b>${g}</b>`;
    btn.style.display = st >= 4 ? 'none' : ''; if (st < 4) btn.lastChild.textContent = STEPS[st]; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; sfx.pop(st); draw(); if (st >= 4) { sfx.ok(); btn.dataset.done = 1; } } }, icon('right'), h('span'));
  const other = h('button', { class: 'btn sm ia nxp', onclick: e => { e.stopPropagation(); sfx.page(); pi = (pi + 1) % pairs.length; st = 0; draw(); } }, 'เปลี่ยนจำนวน');
  draw(); return h('div', { class: 'colstack' }, pic, btn, out, other);
}

/* ---------- prime factors lined up in columns: HCF (common) / LCM (all) ---------- */
function simAlign(sets, mode) { // factors written side by side (as on paper) · matching factors joined by ONE rounded loop (ผู้ใช้ขอ)
  let si = 0, k = 0, uid = 0; const wrap = h('div', { class: 'h6-al2' }), out = fNote();
  const COL = ['#E8590C', '#2F80ED', '#1B9E62', '#9B51E0', '#D6336C', '#0CA5A5'];
  const groups = ns => { const F = ns.map(n => h6pf(n)), G = [];
    [...new Set(F.flat())].sort((a, b) => a - b).forEach(p => { const m = Math.max(...F.map(f => f.filter(q => q === p).length));
      for (let j = 0; j < m; j++) G.push({ p, mem: F.map((f, r) => { let c = -1; for (let t = 0; t < f.length; t++) if (f[t] === p && ++c === j) return [r, t]; return null; }).filter(Boolean) }); });
    return { F, G }; };
  const hullPath = P => { if (P.length === 1) return `M${P[0][0]} ${P[0][1]}h.01`; const S = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = []; S.forEach(q => { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    S.slice().reverse().forEach(q => { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); });
    const H = lo.slice(0, -1).concat(up.slice(0, -1)); return 'M' + H.map(q => q.join(' ')).join('L') + 'Z'; };
  const draw = () => { const ns = sets[si], { F, G } = groups(ns), pick = mode === 'hcf' ? G.filter(g => g.mem.length === ns.length) : G, done = k >= pick.length;
    wrap.innerHTML = ''; const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'h6-al2-svg'); svg.setAttribute('aria-hidden', 'true');
    const rows = ns.map((n, r) => h('div', { class: 'h6-al2-row' }, h('b', { class: 'h6-al2-n' }, fmt(n)), h('span', { class: 'h6-al2-eq' }, '='),
      ...F[r].flatMap((p, t) => [t ? h('span', { class: 'h6-al2-x' }, '×') : null, h('span', { class: 'h6-al2-f', 'data-rt': `${r}-${t}` }, String(p))]).filter(Boolean)));
    wrap.append(svg, ...rows);
    const shown = pick.slice(0, k), got = shown.map(g => g.p), name = mode === 'hcf' ? 'ห.ร.ม.' : 'ค.ร.น.';
    shown.forEach((g, gi) => g.mem.forEach(([r, t]) => { const el = wrap.querySelector(`[data-rt="${r}-${t}"]`); if (el) { el.classList.add('on'); el.style.color = COL[gi % COL.length]; } }));
    const paint = () => { const W = wrap.offsetWidth, H = wrap.offsetHeight; if (!W) return; svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H); let body = '';
      shown.forEach((g, gi) => { const pts = g.mem.map(([r, t]) => { const el = wrap.querySelector(`[data-rt="${r}-${t}"]`); let x = 0, y = 0, e = el; while (e && e !== wrap) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x + el.offsetWidth / 2, y + el.offsetHeight / 2, Math.max(el.offsetWidth, el.offsetHeight)]; });
        const R = Math.max(...pts.map(q => q[2])) / 2 + 7, d = hullPath(pts.map(q => [Math.round(q[0]), Math.round(q[1])])), id = `al${++uid}`, c = COL[gi % COL.length];
        body += `<mask id="${id}"><path d="${d}" fill="#fff" stroke="#fff" stroke-width="${2 * R + 3}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="#000" stroke="#000" stroke-width="${2 * R - 3}" stroke-linejoin="round" stroke-linecap="round"/></mask>`
          + `<path d="${d}" fill="${c}" fill-opacity=".10" stroke="${c}" stroke-opacity=".10" stroke-width="${2 * R}" stroke-linejoin="round" stroke-linecap="round"/><rect width="${W}" height="${H}" fill="${c}" mask="url(#${id})"/>`; });
      svg.innerHTML = body; };
    requestAnimationFrame(paint); if (window.ResizeObserver) { wrap.__ro && wrap.__ro.disconnect(); (wrap.__ro = new ResizeObserver(paint)).observe(wrap); }
    out.innerHTML = !k ? (mode === 'hcf' ? 'แยกตัวประกอบของแต่ละจำนวน เขียนเรียงกันไปตามปกติ — กดปุ่มเพื่อ<b>วงตัวที่เหมือนกันซึ่งมีในทุกจำนวน</b> (วงเดียวครอบทุกตัว แม้ไม่อยู่ตรงกัน)'
        : 'แยกตัวประกอบของแต่ละจำนวน เขียนเรียงกันไปตามปกติ — กดปุ่มเพื่อ<b>วงตัวที่ซ้ำกันด้วยวงเดียว</b> แล้วนับวงละ 1 ตัว · ตัวที่ไม่ซ้ำก็วงและนับด้วย')
      : done ? `${name} ของ ${h6and(ns)} = ${h6x(got)} = <b>${fmt(mode === 'hcf' ? h6gcd(ns) : h6lcm(ns))}</b>` : `นับวงละ 1 ตัว: ${h6x(got)}`;
    btn.style.display = done ? 'none' : ''; if (done) { btn.dataset.done = 1; } };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); k++; sfx.pop(k); draw(); if (btn.dataset.done) sfx.ok(); } }, icon('right'), mode === 'hcf' ? 'วงตัวประกอบร่วมถัดไป' : 'วงตัวประกอบถัดไป');
  const other = h('button', { class: 'btn sm ia nxp', onclick: e => { e.stopPropagation(); sfx.page(); si = (si + 1) % sets.length; k = 0; delete btn.dataset.done; draw(); } }, 'เปลี่ยนจำนวน');
  draw(); return h('div', { class: 'colstack' }, wrap, btn, out, other);
}

/* ---------- hops on number lines: multiples meet at the LCM ---------- */
function simHops(o = {}) {
  let st = o.steps ? o.steps.slice() : [6, 9]; const free = !o.fixed, names = o.names || ['กบเขียว', 'กบส้ม', 'กบม่วง'], unit = o.unit || '', COL = ['#26A97B', '#EC7F1E', '#7E6ED6'];
  const pic = h('div', { class: 'h6-hops' }), out = fNote(); let pos, done;
  const reset = () => { pos = st.map(() => 0); done = false; btn.style.display = ''; delete btn.dataset.done; out.innerHTML = o.intro || `${st.map((s, i) => `${names[i]}กระโดดทีละ ${s}`).join(' · ')} — กด “กระโดด” ไปเรื่อย ๆ`; draw(); };
  const draw = () => { const M = h6lcm(st) + Math.min(...st), W = 600, x0 = 18, sx = (W - 36) / M, RH = 62, Hh = st.length * RH + 20;
    let s = `<svg viewBox="0 0 ${W} ${Hh}" aria-hidden="true">`;
    st.forEach((stp, i) => { const y = 44 + i * RH; s += `<line x1="${x0}" y1="${y}" x2="${W - 14}" y2="${y}" stroke="#B7AFCD" stroke-width="2"/>`;
      const tk = M <= 40 ? 1 : M <= 80 ? 2 : 5; for (let v = 0; v <= M; v += tk) s += `<line x1="${x0 + v * sx}" y1="${y - 4}" x2="${x0 + v * sx}" y2="${y + 4}" stroke="#B7AFCD"/>`;
      for (let v = stp; v <= pos[i]; v += stp) { s += `<path d="M${x0 + (v - stp) * sx} ${y} Q${x0 + (v - stp / 2) * sx} ${y - 30} ${x0 + v * sx} ${y}" fill="none" stroke="${COL[i]}" stroke-width="2.4"/><text x="${x0 + v * sx}" y="${y + 20}" text-anchor="middle" class="hv" fill="${COL[i]}">${v}</text>`; }
      s += `<text x="${x0}" y="${y + 20}" text-anchor="middle" class="hv" fill="#9790B0">0</text><circle cx="${x0 + pos[i] * sx}" cy="${y - 7}" r="8" fill="${COL[i]}" stroke="#fff" stroke-width="2"/>`; });
    if (done) { const v = pos[0]; s += `<rect x="${x0 + v * sx - 16}" y="16" width="32" height="${st.length * RH}" rx="10" fill="#F5B52E" fill-opacity=".22" stroke="#F5B52E" stroke-width="2"/>`; }
    pic.innerHTML = s + '</svg>'; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (done) return; const nx = Math.min(...pos.map((p, i) => p + st[i]));
    pos = pos.map((p, i) => p + st[i] === nx ? nx : p); sfx.pop(nx % 8);
    if (pos.every(p => p === nx)) { done = true; btn.style.display = 'none'; btn.dataset.done = 1; out.innerHTML = o.meet ? o.meet(nx) : `ลงจุดเดียวกันครั้งแรกที่ <b>${nx}</b> → ${nx} เป็นพหุคูณร่วมที่น้อยที่สุด = <b>ค.ร.น.</b> ของ ${h6and(st)}`; sfx.ok(); say(speakText(out.innerHTML), true); }
    else out.innerHTML = `${st.map((s, i) => `${names[i]}อยู่ที่ ${pos[i]}${unit}`).join(' · ')}`; draw(); } }, icon('right'), 'กระโดด');
  const parts = [pic, btn, out];
  if (free) parts.push(h('div', { class: 'rowstack' }, ...st.map((_, i) => stepper(`${names[i]}ทีละ`, () => st[i], x => st[i] = x, () => 2, () => 10, reset))));
  reset(); return h('div', { class: 'colstack' }, ...parts);
}

/* ---------- HCF × LCM = product of the two numbers (prime-factor Venn) ---------- */
function simRel(pairs = [[20, 30], [18, 24], [14, 35], [16, 40]]) {
  let pi = 0, st = 0; const pic = h('div', { class: 'h6-venn' }), out = fNote(), eq = h('div', { class: 'fbig h6-rel' });
  const split = (a, b) => { const A = h6pf(a), B = h6pf(b), M = []; const Bc = B.slice(); A.forEach(p => { const j = Bc.indexOf(p); if (j > -1) { M.push(p); Bc.splice(j, 1); } });
    const Ac = A.slice(); M.forEach(p => Ac.splice(Ac.indexOf(p), 1)); return { L: Ac, M, R: Bc }; };
  const STEPS = ['ใส่ตัวประกอบเฉพาะร่วมไว้ตรงกลาง', 'หา ห.ร.ม. (ตรงกลาง)', 'หา ค.ร.น. (ทุกตัวในภาพ)', 'เทียบผลคูณ'];
  const draw = () => { const [a, b] = pairs[pi], { L, M, R } = split(a, b), g = h6gcd([a, b]), l = h6lcm([a, b]), pr = p => p.length ? h6x(p) : '1';
    const place = (arr, x0, cls) => arr.map((v, i) => `<text x="${x0 + (i % 2) * 34}" y="${118 + Math.floor(i / 2) * 36}" class="${cls}" text-anchor="middle">${v}</text>`).join('');
    let s = `<svg viewBox="0 0 520 320" aria-hidden="true"><circle cx="190" cy="170" r="122" fill="#6FB2F5" fill-opacity="${st >= 3 ? .3 : .14}" stroke="#3F8BDB" stroke-width="2.4"/><circle cx="330" cy="170" r="122" fill="#FFA24C" fill-opacity="${st >= 3 ? .3 : .14}" stroke="#EC7F1E" stroke-width="2.4"/>`;
    if (st >= 2) s += `<path d="M260 38 A122 122 0 0 1 260 242 A122 122 0 0 1 260 38 Z" fill="#4FD1A1" fill-opacity=".4"/>`;
    s += `<text x="120" y="30" text-anchor="middle" class="vt" fill="#2B6FBA">${a} = ${h6x(h6pf(a))}</text><text x="400" y="30" text-anchor="middle" class="vt" fill="#C96512">${b} = ${h6x(h6pf(b))}</text>`;
    s += st >= 1 ? place(L, 104, 'va') + place(M, 243, 'vc') + place(R, 383, 'vb') : place(h6pf(a), 104, 'va') + place(h6pf(b), 383, 'vb');
    pic.innerHTML = s + '</svg>';
    eq.innerHTML = st >= 4 ? `${g} × ${fmt(l)} = <b>${fmt(g * l)}</b> &nbsp;และ&nbsp; ${a} × ${b} = <b>${fmt(a * b)}</b>` : '';
    out.innerHTML = [`แยกตัวประกอบ ${a} และ ${b} — กดทีละขั้น`, `ตัวประกอบเฉพาะที่มีทั้งสองจำนวน (${pr(M)}) ใส่ไว้ตรงกลาง`, `ห.ร.ม. = ตัวที่อยู่ตรงกลาง = ${pr(M)} = <b>${g}</b>`, `ค.ร.น. = ทุกตัวในภาพ = ${h6x([...L, ...M, ...R])} = <b>${fmt(l)}</b>`, `ห.ร.ม. × ค.ร.น. = ผลคูณของสองจำนวน เสมอ! (ตรงกลางถูกนับ 2 ครั้ง เหมือนตอนคูณ ${a} × ${b})`][st];
    btn.style.display = st >= 4 ? 'none' : ''; if (st < 4) btn.lastChild.textContent = STEPS[st]; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; sfx.pop(st); draw(); if (st >= 4) { btn.dataset.done = 1; sfx.ok(); } } }, icon('right'), h('span'));
  const other = h('button', { class: 'btn sm ia nxp', onclick: e => { e.stopPropagation(); sfx.page(); pi = (pi + 1) % pairs.length; st = 0; draw(); } }, 'เปลี่ยนจำนวน');
  draw(); return h('div', { class: 'colstack' }, pic, eq, btn, out, other);
}

/* ---------- cut ribbons into equal pieces: the longest piece is the HCF ---------- */
function simCut(lens = [18, 24, 30], unit = 'ซม.') {
  let L = 4; const pic = h('div', { class: 'h6-cut' }), out = fNote(), best = h6gcd(lens), COL = ['#FF7B86', '#6FB2F5', '#4FD1A1'];
  const draw = () => { const M = Math.max(...lens), W = 600, sx = (W - 80) / M; let s = `<svg viewBox="0 0 ${W} ${lens.length * 54 + 10}" aria-hidden="true">`, ok = true, tot = 0;
    lens.forEach((len, i) => { const y = 14 + i * 54, q = Math.floor(len / L), rem = len % L; if (rem) ok = false; tot += q;
      s += `<text x="4" y="${y + 22}" class="hv" fill="#5A5470">${len}</text>`;
      for (let j = 0; j < q; j++) s += `<rect x="${44 + j * L * sx + 1}" y="${y}" width="${L * sx - 2}" height="30" rx="5" fill="${COL[i % 3]}"/>`;
      if (rem) s += `<rect x="${44 + q * L * sx + 1}" y="${y}" width="${rem * sx - 2}" height="30" rx="5" fill="#fff" stroke="#E5505E" stroke-width="2" stroke-dasharray="5 4"/><text x="${44 + (q * L + rem / 2) * sx}" y="${y + 21}" text-anchor="middle" class="hv" fill="#C23C4B">เศษ ${rem}</text>`; });
    pic.innerHTML = s + '</svg>';
    out.innerHTML = ok ? `ตัดชิ้นละ ${L} ${unit} ได้พอดีทุกเส้น ✓ ได้ ${lens.map(x => x / L).join(' + ')} = ${tot} ชิ้น${L === best ? `<br><b>${L} ยาวที่สุดแล้ว!</b> = ห.ร.ม. ของ ${h6and(lens)}` : ' — ลองให้ยาวกว่านี้ได้ไหม?'}` : `ชิ้นละ ${L} ${unit} มีเส้นที่เหลือเศษ ✗ (${L} หารไม่ลงตัวทุกจำนวน)`;
    if (ok && L === best) teachDone(pic); };
  draw(); return h('div', { class: 'colstack' }, h6wait(), pic, stepper(`ความยาวชิ้น (${unit})`, () => L, x => L = x, () => 1, () => Math.min(...lens), draw), out);
}

/* ---------- square tiles on a floor: two-step HCF problem ---------- */
function simTiles(w = 60, d = 48) {
  let s = 8; const pic = h('div', { class: 'h6-cut' }), out = fNote(), best = h6gcd([w, d]);
  const draw = () => { const K = Math.min(520 / w, 230 / d), cw = Math.floor(w / s), cd = Math.floor(d / s), ok = w % s === 0 && d % s === 0;
    let g = `<svg viewBox="0 0 ${w * K + 40} ${d * K + 20}" style="max-height:260px" aria-hidden="true"><rect x="20" y="10" width="${w * K}" height="${d * K}" fill="#fff" stroke="#2B2550" stroke-width="2"/>`;
    for (let i = 0; i < cw; i++) for (let j = 0; j < cd; j++) g += `<rect x="${20 + i * s * K + 1}" y="${10 + j * s * K + 1}" width="${s * K - 2}" height="${s * K - 2}" rx="3" fill="${(i + j) % 2 ? '#6FB2F5' : '#9FCBF7'}"/>`;
    if (!ok) g += `<rect x="${20 + cw * s * K}" y="10" width="${(w - cw * s) * K}" height="${d * K}" fill="#FF7B86" fill-opacity=".3"/><rect x="20" y="${10 + cd * s * K}" width="${w * K}" height="${(d - cd * s) * K}" fill="#FF7B86" fill-opacity=".3"/>`;
    pic.innerHTML = g + '</svg>';
    out.innerHTML = ok ? `แผ่นละ ${s} × ${s} ซม. ปูพอดี ✓ ใช้ ${cw} × ${cd} = <b>${cw * cd}</b> แผ่น${s === best ? `<br><b>ใหญ่ที่สุดแล้ว!</b> ${s} = ห.ร.ม. ของ ${w} และ ${d}` : ''}` : `แผ่นละ ${s} × ${s} ซม. ปูไม่พอดี ✗ (ส่วนสีแดงต้องตัดกระเบื้อง)`;
    if (ok && s === best) teachDone(pic); };
  draw(); return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, `พื้นกว้าง ${w} ซม. ยาว ${d} ซม. ปูกระเบื้องรูปสี่เหลี่ยมจัตุรัส`), pic, stepper('ด้านกระเบื้อง (ซม.)', () => s, x => s = x, () => 2, () => d, draw), out);
}

/* ---------- which tool? HCF or LCM story cards ---------- */
function simKind(cards) {
  let k = 0; const box = h('div', { class: 'colstack' }), out = fNote();
  const show = () => { box.innerHTML = ''; if (k >= cards.length) { out.innerHTML = 'สรุป: <b>แบ่ง/ตัด/จัดให้เท่ากัน “มากที่สุด”</b> → ห.ร.ม. · <b>พร้อมกันอีกครั้ง / “น้อยที่สุด” ที่หารลงตัว</b> → ค.ร.น.'; sfx.ok(); teachDone(box); return; }
    const [txt, kind, why] = cards[k];
    box.append(h('div', { class: 'storybox', html: `<b>${k + 1}/${cards.length}</b> ${txt}` }), h('div', { class: 'rowstack' }, ...['hcf', 'lcm'].map(x => h('button', { class: 'btn sm ia h6-kind ' + x, onclick: e => { e.stopPropagation();
      const me = e.currentTarget; if (x === kind) { me.classList.add('ok'); sfx.ok(); out.innerHTML = `ถูกต้อง! ${why}`; k++; setTimeout(show, 1100); } else { me.classList.add('bad'); setTimeout(() => me.classList.remove('bad'), 900); sfx.no(); out.innerHTML = `ยังไม่ใช่ — ${why}`; } } }, x === 'hcf' ? 'ใช้ ห.ร.ม.' : 'ใช้ ค.ร.น.')))); };
  show(); return h('div', { class: 'colstack' }, h6wait(), box, out);
}

/* =========================================================
   QUESTION TYPES (prefix h…)
   ========================================================= */
/* multi-select chips + check button */
function h6multi(ctx, items, right, hint) {
  const sel = new Set(), R = new Set(right.map(String)), wrap = h('div', { class: 'colstack' }), chips = h('div', { class: 'h6-chips ia' });
  items.forEach(v => { const b = h('button', { class: 'h6-chip', onclick: e => { e.stopPropagation(); if (wrap.dataset.done) return; sfx.tap(); const k = String(v); sel.has(k) ? sel.delete(k) : sel.add(k); b.classList.toggle('on', sel.has(k)); } }, String(v)); b.dataset.v = v; chips.append(b); });
  const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (wrap.dataset.done) return;
    if (!sel.size) { ctx.say('แตะเลือกคำตอบก่อนนะ'); return; }
    const ok = sel.size === R.size && [...sel].every(x => R.has(x));
    if (ok) { wrap.dataset.done = 1; chips.querySelectorAll('.h6-chip.on').forEach(c => c.classList.add('ok')); chk.remove(); }
    else chips.querySelectorAll('.h6-chip.on').forEach(c => { if (!R.has(c.dataset.v)) { c.classList.remove('bad'); void c.offsetWidth; c.classList.add('bad'); } });
    ctx.check(ok, ok ? '' : `${[...sel].filter(x => !R.has(x)).length ? 'มีตัวที่ไม่ใช่ปนอยู่ · ' : ''}${[...R].filter(x => !sel.has(x)).length ? 'ยังเลือกไม่ครบ · ' : ''}${hint}`); } }, icon('check'), 'ตรวจคำตอบ');
  wrap.append(chips, chk); return wrap;
}
const h6num = (ctx, bd, head, ans, hint) => { bd.append(h('div', { class: 'rowstack' }, head ? h('div', { class: 'fbig h6-q', html: head }) : null, answerBox(ctx, ans, { hint })));
  ctx.onRight = () => { const q = bd.querySelector('.h6-q .fsign'); if (q) q.outerHTML = `<b class="h6n">${fmt(ans)}</b>`; }; };
const H6HOW = {
  cd: 'เขียนตัวประกอบของแต่ละจำนวน หาตัวที่มีเหมือนกันทุกจำนวน แล้วเลือกตัวที่มากที่สุด',
  pf: 'แยกตัวประกอบแต่ละจำนวน แล้วนำตัวประกอบเฉพาะที่มีร่วมกันทุกจำนวนมาคูณกัน',
  div: 'ตั้งหารสั้น หารด้วยจำนวนเฉพาะที่หารทุกจำนวนลงตัว แล้วนำตัวหารทั้งหมดมาคูณกัน',
  cm: 'เขียนพหุคูณของแต่ละจำนวน หาตัวที่มีเหมือนกัน แล้วเลือกตัวที่น้อยที่สุด',
  lpf: 'แยกตัวประกอบ แล้วนำตัวประกอบเฉพาะทุกตัวมาคูณกัน (ตัวที่ซ้ำกันใช้เพียงครั้งเดียว)',
  ldiv: 'ตั้งหารสั้น หารด้วยจำนวนเฉพาะที่หารได้ลงตัวอย่างน้อย 2 จำนวน แล้วนำตัวหารและผลหารสุดท้ายมาคูณกัน'
};
Object.assign(Q, {
  hFac({ n }) {
    const F = h6fac(n), pool = range(2, n - 1).filter(x => n % x), extra = shuffle(pool).slice(0, Math.max(3, Math.min(pool.length, 12 - F.length)));
    return { prompt: `แตะเลือก<span class="hl">ตัวประกอบทั้งหมด</span>ของ ${fmt(n)}`, say: `แตะเลือกตัวประกอบทั้งหมดของ ${n}`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'fbig' }, h('b', { class: 'h6n' }, fmt(n))), h6multi(ctx, [...F, ...extra].sort((a, b) => a - b), F, `ตัวประกอบคือจำนวนที่หาร ${n} ได้ลงตัว (อย่าลืม 1 และ ${n})`))); } };
  },
  hPrime({ nums }) {
    const P = nums.filter(h6prime);
    return { prompt: 'แตะเลือก<span class="hl">จำนวนเฉพาะ</span>ทั้งหมด', say: 'แตะเลือกจำนวนเฉพาะทั้งหมด',
      mount(bd, ctx) { bd.append(h6multi(ctx, nums.slice().sort((a, b) => a - b), P, 'จำนวนเฉพาะมีตัวประกอบเพียง 2 ตัว คือ 1 กับตัวมันเอง (ลองหารด้วย 2, 3, 5, 7)')); } };
  },
  hPFs({ n }) {
    const F = h6fac(n);
    return { prompt: `แตะเลือก<span class="hl">ตัวประกอบเฉพาะ</span>ทั้งหมดของ ${n}`, say: `แตะเลือกตัวประกอบเฉพาะทั้งหมดของ ${n}`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'cap' }, `ตัวประกอบของ ${n} มีดังนี้`), h6multi(ctx, F, F.filter(h6prime), 'ตัวประกอบเฉพาะ = ตัวประกอบที่เป็นจำนวนเฉพาะ (1 ไม่ใช่จำนวนเฉพาะ)'))); } };
  },
  /* build the prime factorisation by tapping primes */
  hPF({ n }) {
    return { prompt: `แยกตัวประกอบของ ${fmt(n)} — แตะจำนวนเฉพาะมาคูณกันให้ได้ ${fmt(n)}`, say: `แยกตัวประกอบของ ${n}`,
      mount(bd, ctx) { const got = [], line = h('div', { class: 'fbig h6-pfl' }), msg = h('div', { class: 'cap' }), pad = h('div', { class: 'h6-prow ia' });
        const prod = () => got.reduce((a, b) => a * b, 1);
        const show = () => { line.innerHTML = `${h6N(n)} = ${got.length ? h6x(got) : '<span class="fsign">?</span>'}`; msg.textContent = got.length ? `ผลคูณตอนนี้ = ${fmt(prod())}${prod() < n ? ` · เหลือ ${fmt(n / prod())}` : ''}` : 'เริ่มจากจำนวนเฉพาะที่หาร ' + n + ' ลงตัว'; };
        H6PR.forEach(p => pad.append(h('button', { class: 'btn', onclick: e => { e.stopPropagation(); if (pad.dataset.done) return; const rest = n / prod();
          if (rest % p) { ctx.check(false, `${p} หาร ${fmt(rest)} ไม่ลงตัว — ลองจำนวนเฉพาะอื่น`); return; }
          got.push(p); sfx.pop(got.length); show(); if (prod() === n) { pad.dataset.done = 1; ctx.onRight = () => { got.sort((a, b) => a - b); line.innerHTML = `${h6N(n)} = ${h6x(got)}`; }; ctx.check(true); } } }, String(p))));
        pad.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: e => { e.stopPropagation(); if (pad.dataset.done) return; got.pop(); sfx.tap(); show(); } }, icon('left')));
        show(); bd.append(h('div', { class: 'colstack' }, line, msg, pad)); } };
  },
  hGcd({ nums, how = 'cd' }) {
    const g = h6gcd(nums);
    return { prompt: `หา <span class="hl">ห.ร.ม.</span> ของ ${h6and(nums)}`, say: `หา หอรอมอ ของ ${nums.join(' และ ')}`,
      mount(bd, ctx) { h6num(ctx, bd, `ห.ร.ม. ของ ${nums.map(fmt).join(', ')} = <span class="fsign">?</span>`, g, H6HOW[how]); } };
  },
  hLcm({ nums, how = 'cm' }) {
    const l = h6lcm(nums);
    return { prompt: `หา <span class="hl">ค.ร.น.</span> ของ ${h6and(nums)}`, say: `หา คอรอนอ ของ ${nums.join(' และ ')}`,
      mount(bd, ctx) { h6num(ctx, bd, `ค.ร.น. ของ ${nums.map(fmt).join(', ')} = <span class="fsign">?</span>`, l, H6HOW[how]); } };
  },
  hCommon({ nums }) {
    const U = [...new Set(nums.flatMap(h6fac))].sort((a, b) => a - b), C = U.filter(x => nums.every(n => n % x === 0));
    return { prompt: `แตะเลือก<span class="hl">ตัวประกอบร่วม</span>ทั้งหมดของ ${h6and(nums)}`, say: `แตะเลือกตัวประกอบร่วมทั้งหมดของ ${nums.join(' และ ')}`,
      mount(bd, ctx) { bd.append(h6multi(ctx, U, C, `ตัวประกอบร่วมต้องหาร${nums.length > 2 ? 'ทุกจำนวน' : 'ทั้งสองจำนวน'}ได้ลงตัว`)); } };
  },
  hCmul({ nums, upto }) {
    const L = range(1, upto).filter(x => nums.some(n => x % n === 0)), C = L.filter(x => nums.every(n => x % n === 0));
    return { prompt: `แตะเลือก<span class="hl">พหุคูณร่วม</span>ของ ${h6and(nums)} ทั้งหมด (ไม่เกิน ${upto})`, say: `แตะเลือกพหุคูณร่วมของ ${nums.join(' และ ')}`,
      mount(bd, ctx) { bd.append(h6multi(ctx, L, C, `พหุคูณร่วมต้องหารด้วย${h6and(nums)}ได้ลงตัวทุกจำนวน`)); } };
  },
  hTF({ text, ok, why }) {
    return { mx: { k: 'tf', text, ok, why }, prompt: `ข้อความนี้<span class="hl">ถูกต้อง</span>หรือไม่`, say: `${speakText(text)} ถูกต้องหรือไม่`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'storybox h6-claim', html: text }), choices(ctx, [{ value: 'y', label: '✓ ถูกต้อง' }, { value: 'n', label: '✗ ไม่ถูกต้อง' }], ok ? 'y' : 'n', { hint: why })));
        bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  hNum({ q, head, a, hint, say: sy }) {
    return { prompt: q, say: sy || speakText(q), mount(bd, ctx) { h6num(ctx, bd, head || '', a, hint); } };
  },
  hKind({ text, kind, why }) {
    return { prompt: 'โจทย์นี้ต้องหาคำตอบด้วยวิธีใด', say: `${speakText(text)} ต้องหาคำตอบด้วยวิธีใด`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'storybox', html: text }), choices(ctx, [{ value: 'hcf', label: 'หา ห.ร.ม.' }, { value: 'lcm', label: 'หา ค.ร.น.' }], kind, { hint: why })));
        bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  /* word problem: ① HCF or LCM? ② the answer */
  hStory({ text, kind, ans, unit = '', ask, why }) {
    return { prompt: text, say: speakText(text),
      mount(bd, ctx) { const step2 = h('div', { class: 'colstack', style: { display: 'none' } }), lab = h('div', { class: 'cap' }, '① ใช้วิธีใด');
        const ch = choices({ check: (ok, hn) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; lab.textContent = `② ใช้ ${kind === 'hcf' ? 'ห.ร.ม.' : 'ค.ร.น.'} หาคำตอบ`; sfx.pop(5); ctx.say(`ใช่แล้ว! ใช้ ${kind === 'hcf' ? 'ห.ร.ม.' : 'ค.ร.น.'} หาคำตอบเลย`); } else ctx.check(false, hn); } },
          [{ value: 'hcf', label: 'หา ห.ร.ม.' }, { value: 'lcm', label: 'หา ค.ร.น.' }], kind, { hint: why || 'แบ่ง/ตัดให้เท่ากันมากที่สุด → ห.ร.ม. · พร้อมกันอีกครั้ง/น้อยที่สุดที่หารลงตัว → ค.ร.น.' });
        ch.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt'));
        step2.append(h('div', { class: 'cap', html: ask || 'คำตอบคือ' }), h('div', { class: 'rowstack' }, answerBox(ctx, ans, { hint: why }), unit ? h('span', { class: 'cap', style: { fontSize: '20px' } }, unit) : null));
        bd.append(h('div', { class: 'colstack' }, lab, ch, step2)); } };
  }
});

/* =========================================================
   LEVELS 701–714
   ========================================================= */
const L6H = (no, vno, place, title, short, goal, teach, game) => ({ id: 700 + no, place, title, short, tone: TONES5[(no + 2) % 6], goal, teach, game });
const H6W_FAC = [19, 6, 12, 32, 25, 44, 75, 82];
const H6W_PFM = [14, 99, 75, 64, 36, 54, 96, 108], H6W_PFD = [10, 33, 42, 50, 66, 105, 20, 81, 104, 132];
/* random composites (2–4 prime factors, ≤ 7 each, up to 150) so the factor game does not run out of new numbers */
const H6_PFR = () => { const out = []; for (let n = 12; n <= 150; n++) { let m = n, k = 0; for (const p of [2, 3, 5, 7]) while (m % p === 0) { m /= p; k++; } if (m === 1 && k >= 2 && k <= 5) out.push(n); } return out; };
const H6W_CD = [[9, 18], [12, 30], [14, 28, 44], [25, 40, 45]];
const H6W_GPF = [[16, 22], [18, 30], [39, 52], [36, 48], [121, 132], [208, 286], [6, 12, 27], [20, 30, 40], [64, 112, 128], [96, 120, 144], [93, 124, 155], [50, 75, 100]];
const H6W_GDV = [[12, 14], [9, 15], [42, 70], [30, 45], [8, 20], [81, 153], [9, 21, 30], [45, 90, 225], [24, 36, 60], [15, 20, 25]];
const H6W_CM = [[8, 24], [20, 25], [4, 6, 8], [5, 10, 15]];
const H6W_LPF = [[21, 42], [28, 32], [36, 80], [18, 36, 44], [40, 50, 70], [55, 66, 82], [24, 48, 120]];
const H6W_LDV = [[2, 6], [33, 39], [25, 175], [78, 195], [2, 5, 6], [14, 42, 84], [15, 30, 39]];
const H6W_TF = [['ห.ร.ม. ของ 24 และ 36 คือ 12', 1], ['ค.ร.น. ของ 16 และ 24 คือ 20', 0], ['ห.ร.ม. ของ 12 และ 18 คือ 6', 1], ['ห.ร.ม. ของ 33 และ 99 คือ 99', 0], ['ค.ร.น. ของ 10 และ 15 คือ 30', 1], ['ค.ร.น. ของ 12 และ 18 คือ 36', 1], ['ห.ร.ม. ของ 36 และ 84 คือ 36', 0], ['ค.ร.น. ของ 25 และ 40 คือ 200', 1], ['ห.ร.ม. ของ 27 และ 45 คือ 9', 1]];
const h6tf = ([t, ok]) => { const [, k, a, b, v] = t.match(/^(ห\.ร\.ม\.|ค\.ร\.น\.) ของ (\d+) และ (\d+) คือ (\d+)$/), r = k === 'ห.ร.ม.' ? h6gcd([+a, +b]) : h6lcm([+a, +b]);
  return Q.hTF({ text: t, ok: +v === r, why: `${k} ของ ${a} และ ${b} คือ ${r}` }); };
const H6_KIND = [
  ['มีเชือก 2 เส้น ยาว 45 เมตร และ 60 เมตร ต้องการตัดเป็นเส้นสั้น ๆ ให้ยาวเท่ากัน<b>ยาวที่สุด</b>โดยไม่เหลือเศษ', 'hcf', 'ตัดให้เท่ากันและยาวที่สุด → ห.ร.ม.'],
  ['ไฟสัญญาณ 2 ดวง กะพริบทุก 6 วินาที และ 10 วินาที ถ้ากะพริบพร้อมกัน อีกกี่วินาทีจะกะพริบ<b>พร้อมกันอีกครั้ง</b>', 'lcm', 'พร้อมกันอีกครั้ง → ค.ร.น.'],
  ['ครูมีสมุด 36 เล่ม ปากกา 54 ด้าม แบ่งให้นักเรียนคนละเท่า ๆ กัน ได้<b>มากที่สุด</b>กี่คน', 'hcf', 'แบ่งเท่า ๆ กันให้ได้มากที่สุด → ห.ร.ม.'],
  ['จำนวนที่<b>น้อยที่สุด</b>ที่หารด้วย 8 และ 12 ได้ลงตัว คือจำนวนใด', 'lcm', 'จำนวนน้อยที่สุดที่หารลงตัว → ค.ร.น.']];
const H6_KINDG = [
  ['แม่ค้ามีมะม่วง 42 ผล ส้ม 56 ผล จัดใส่ถุง ถุงละเท่า ๆ กันโดยไม่ปนกัน และให้แต่ละถุงมีผลไม้<b>มากที่สุด</b>', 'hcf'],
  ['ระฆัง 2 ใบ ตีทุก 9 นาที และ 12 นาที ตีพร้อมกันเมื่อ 10.00 น. จะตี<b>พร้อมกันอีกครั้ง</b>เวลาใด', 'lcm'],
  ['ต้องการตัดผ้า 3 ผืน ยาว 32, 48 และ 64 เซนติเมตร เป็นชิ้นยาวเท่ากัน<b>ยาวที่สุด</b>', 'hcf'],
  ['ต้องการเรียงเหรียญเป็นกองละ 6 เหรียญ หรือกองละ 9 เหรียญได้พอดี ต้องมีเหรียญ<b>อย่างน้อย</b>กี่เหรียญ', 'lcm'],
  ['ที่ดินกว้าง 84 เมตร ยาว 126 เมตร ปักเสารอบที่ดินให้ห่างเท่า ๆ กัน และห่างกัน<b>มากที่สุด</b>', 'hcf'],
  ['นักวิ่ง 2 คนวิ่งรอบสนาม ใช้เวลารอบละ 5 นาที และ 7 นาที ออกพร้อมกัน จะ<b>พบกันที่จุดเริ่มต้นอีกครั้ง</b>เมื่อใด', 'lcm']];
const h6kq = ([text, kind]) => Q.hKind({ text, kind, why: kind === 'hcf' ? 'แบ่ง/ตัด/จัดให้เท่ากัน “มากที่สุด” → ห.ร.ม.' : '“พร้อมกันอีกครั้ง” หรือ “น้อยที่สุด” ที่หารลงตัว → ค.ร.น.' });
const H6_TIME = (h, m) => `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')} น.`;

const LESSONS_P6C1 = [
  L6H(1, 1, 'เชิงเขาตัวประกอบ', 'ตัวประกอบของจำนวนนับ', 'ตัวประกอบ', 'หาตัวประกอบของจำนวนนับได้ — ตัวประกอบคือจำนวนนับที่หารจำนวนนั้นได้ลงตัว', [
    T('ยินดีต้อนรับสู่ <b>ภูเขา ห.ร.ม. ค.ร.น.</b>! ลองจัดจุดเป็นแถวเท่า ๆ กัน — ถ้าจัดได้พอดี จำนวนแถวและจำนวนต่อแถวคือ<b>ตัวประกอบ</b>', 'ยินดีต้อนรับสู่ภูเขา หอรอมอ คอรอนอ ลองจัดจุดเป็นแถวเท่า ๆ กัน ถ้าจัดได้พอดี จำนวนแถวและจำนวนต่อแถวคือตัวประกอบ', el => el.append(simRect(18))),
    T('ตัวอย่างทีละขั้น: หาตัวประกอบของ <b>20</b> โดยการหาร', 'ตัวอย่างทีละขั้น หาตัวประกอบของยี่สิบโดยการหาร', el => el.append(dcWalk('ตัวประกอบของ <b class="h6n">20</b>', [['20 ÷ 1 = 20', 'หารลงตัว → ได้ 1 และ 20'], ['20 ÷ 2 = 10', 'หารลงตัว → ได้ 2 และ 10'], ['20 ÷ 3', '= 6 เศษ 2 หารไม่ลงตัว → 3 ไม่ใช่ตัวประกอบ'], ['20 ÷ 4 = 5', 'หารลงตัว → ได้ 4 และ 5'], ['20 ÷ 5 = 4', 'ซ้ำกับคู่ 4 กับ 5 แล้ว → หยุดได้']], 'ตัวประกอบของ 20 คือ <b>1, 2, 4, 5, 10, 20</b> (6 ตัว)', 'ตัวประกอบของยี่สิบ คือ 1 2 4 5 10 20')))],
    () => [...pkF(H6W_FAC, 4).map(n => Q.hFac({ n })),
      Q.dPick({ q: 'จำนวนใดเป็นตัวประกอบของ 48', opts: ['16', '18', '20'], right: '16', hint: 'ลองหาร 48 ด้วยแต่ละจำนวน' }),
      Q.dPick({ q: 'ข้อใด<b>ไม่ใช่</b>ตัวประกอบของ 56', opts: ['6', '7', '8', '14'], right: '6', hint: '56 ÷ 6 หารไม่ลงตัว' }),
      Q.hNum({ q: '45 มีตัวประกอบทั้งหมดกี่ตัว', head: 'จำนวนตัวประกอบของ 45 = <span class="fsign">?</span>', a: 6, hint: 'ตัวประกอบของ 45 คือ 1, 3, 5, 9, 15, 45' })]),
  L6H(2, 2, 'ลานหินจำนวนเฉพาะ', 'จำนวนเฉพาะ ตัวประกอบเฉพาะ', 'จำนวนเฉพาะ', 'บอกได้ว่าจำนวนใดเป็นจำนวนเฉพาะ (มีตัวประกอบ 2 ตัว คือ 1 และตัวมันเอง) และหาตัวประกอบเฉพาะของจำนวนนับได้', [
    T('ตะแกรงหาจำนวนเฉพาะ: ขีดฆ่า<b>พหุคูณ</b>ของ 2, 3, 5, 7 ไปทีละรอบ — ตัวที่เหลือคือ<b>จำนวนเฉพาะ</b>', 'ตะแกรงหาจำนวนเฉพาะ ขีดฆ่าพหุคูณของ 2 3 5 7 ไปทีละรอบ ตัวที่เหลือคือจำนวนเฉพาะ', el => el.append(simSieve(50))),
    T('ตัวอย่างทีละขั้น: หา<b>ตัวประกอบเฉพาะ</b>ของ 30', 'ตัวอย่างทีละขั้น หาตัวประกอบเฉพาะของสามสิบ', el => el.append(dcWalk('ตัวประกอบเฉพาะของ <b class="h6n">30</b>', [['① ตัวประกอบของ 30', '1, 2, 3, 5, 6, 10, 15, 30'], ['② ตัดตัวที่ไม่ใช่จำนวนเฉพาะ', '1 (ไม่เป็นจำนวนเฉพาะ), 6 = 2 × 3, 10 = 2 × 5, 15 = 3 × 5, 30'], ['③ ที่เหลือ', '2, 3, 5 — มีตัวประกอบ 2 ตัวเท่านั้น']], 'ตัวประกอบเฉพาะของ 30 คือ <b>2, 3 และ 5</b>', 'ตัวประกอบเฉพาะของสามสิบ คือ 2 3 และ 5')))],
    () => [Q.hPrime({ nums: [51, 53, 57, 59, 61, 63, 67, 69] }), Q.hPrime({ nums: [71, 73, 77, 79, 81, 83, 87, 91] }), ...pkF([42, 70, 66, 78, 105], 2).map(n => Q.hPFs({ n })),
      Q.dPick({ q: 'จำนวนเฉพาะที่เป็น<b>จำนวนคู่</b>มีกี่จำนวน', opts: ['1 จำนวน คือ 2', 'ไม่มีเลย', 'มีมากมาย'], right: '1 จำนวน คือ 2', hint: 'จำนวนคู่อื่น ๆ มี 2 เป็นตัวประกอบด้วย' }),
      Q.dPick({ q: '1 เป็นจำนวนเฉพาะหรือไม่', opts: ['ไม่เป็น เพราะมีตัวประกอบเพียง 1 ตัว', 'เป็น เพราะหารด้วย 1 ลงตัว', 'เป็น เพราะเป็นจำนวนคี่'], right: 'ไม่เป็น เพราะมีตัวประกอบเพียง 1 ตัว' }),
      Q.dPick({ q: 'ข้อใดเป็นจำนวนเฉพาะ<b>ทุกจำนวน</b>', opts: ['2, 13, 29', '3, 15, 31', '5, 17, 39'], right: '2, 13, 29', hint: '15 = 3 × 5 และ 39 = 3 × 13' })]),
  L6H(3, 3, 'ต้นสนแยกตัวประกอบ', 'การแยกตัวประกอบ', 'แยกตัวประกอบ', 'แยกตัวประกอบของจำนวนนับ เขียนเป็นผลคูณของตัวประกอบเฉพาะ โดยการคูณ (แผนภาพต้นไม้) และโดยการหาร (ตั้งหารสั้น)', [
    T('<b>แผนภาพต้นไม้</b>: แตะจำนวนสีฟ้า แล้วเลือกว่าจะแยกเป็นผลคูณแบบไหน — แตกกิ่งจนปลายเป็นจำนวนเฉพาะทั้งหมด', 'แผนภาพต้นไม้ แตะจำนวนสีฟ้า แล้วเลือกว่าจะแยกเป็นผลคูณแบบไหน แตกกิ่งจนปลายเป็นจำนวนเฉพาะทั้งหมด', el => el.append(simTree([72, 90, 48, 100]))),
    T('อีกวิธี: <b>ตั้งหารสั้น</b> ด้วยจำนวนเฉพาะ ไปเรื่อย ๆ จนผลหารเป็นจำนวนเฉพาะ', 'อีกวิธี ตั้งหารสั้นด้วยจำนวนเฉพาะไปเรื่อย ๆ จนผลหารเป็นจำนวนเฉพาะ', el => el.append(simShortDiv([84], 'pf')))],
    () => [...pkF(H6_PFR(), 6).map(n => Q.hPF({ n })),
      Q.dPick({ q: 'ข้อใดเป็น<b>การแยกตัวประกอบ</b>ของ 60', opts: ['2 × 2 × 3 × 5', '4 × 3 × 5', '2 × 30'], right: '2 × 2 × 3 × 5', hint: 'การแยกตัวประกอบต้องเป็นผลคูณของตัวประกอบเฉพาะทั้งหมด' }),
      Q.hNum({ q: 'จำนวนใดแยกตัวประกอบได้เป็น 2 × 3 × 3 × 5', head: '2 × 3 × 3 × 5 = <span class="fsign">?</span>', a: 90, hint: 'คูณทีละคู่ 2 × 3 = 6, 6 × 3 = 18, 18 × 5' })]),
  L6H(4, 4, 'หน้าผาตัวหารร่วม', 'การหา ห.ร.ม. โดยการหาตัวหารร่วม', 'ห.ร.ม. (ตัวหารร่วม)', 'หาตัวหารร่วม (ตัวประกอบร่วม) และ ห.ร.ม. — ตัวหารร่วมที่มากที่สุด — ของจำนวนนับ', [
    T('ใส่ตัวประกอบของสองจำนวนลงในวงกลม — ส่วนที่<b>ซ้อนกัน</b>คือตัวประกอบร่วม ตัวที่<b>มากที่สุด</b>คือ ห.ร.ม.', 'ใส่ตัวประกอบของสองจำนวนลงในวงกลม ส่วนที่ซ้อนกันคือตัวประกอบร่วม ตัวที่มากที่สุดคือ หอรอมอ', el => el.append(simVenn())),
    T('ตัวอย่างทีละขั้น: ห.ร.ม. ของ <b>3 จำนวน</b> 16, 24 และ 40', 'ตัวอย่างทีละขั้น หอรอมอ ของสามจำนวน 16 24 และ 40', el => el.append(dcWalk('ห.ร.ม. ของ 16, 24 และ 40', [['ตัวประกอบของ 16', '1, 2, 4, 8, 16'], ['ตัวประกอบของ 24', '1, 2, 3, 4, 6, 8, 12, 24'], ['ตัวประกอบของ 40', '1, 2, 4, 5, 8, 10, 20, 40'], ['ตัวหารร่วม', '<b>1, 2, 4, 8</b> (หารทั้งสามจำนวนลงตัว)'], ['ตัวที่มากที่สุด', '8']], 'ห.ร.ม. ของ 16, 24 และ 40 คือ <b>8</b>', 'หอรอมอ ของ 16 24 และ 40 คือ 8')))],
    () => [Q.hCommon({ nums: H6W_CD[0] }), Q.hCommon({ nums: H6W_CD[1] }), ...H6W_CD.map(nums => Q.hGcd({ nums, how: 'cd' })),
      Q.dPick({ q: 'ห.ร.ม. ย่อมาจากคำว่าอะไร', opts: ['หารร่วมมาก', 'หารรวมมาก', 'หาเรื่องมาก'], right: 'หารร่วมมาก' })]),
  L6H(5, 5, 'บันไดหินแยกตัวประกอบ', 'การหา ห.ร.ม. โดยการแยกตัวประกอบ', 'ห.ร.ม. (แยกตัวประกอบ)', 'หา ห.ร.ม. โดยแยกตัวประกอบ แล้วนำตัวประกอบเฉพาะที่มีร่วมกันทุกจำนวนมาคูณกัน', [
    T('แยกตัวประกอบ แล้วเรียงตัวที่เหมือนกัน<b>ให้ตรงหลักกัน</b> — หลักที่<b>มีครบทุกจำนวน</b>คือตัวประกอบร่วม', 'แยกตัวประกอบ แล้วเรียงตัวที่เหมือนกันให้ตรงหลักกัน หลักที่มีครบทุกจำนวนคือตัวประกอบร่วม', el => el.append(simAlign([[24, 40], [30, 45], [18, 42, 60]], 'hcf'))),
    T('ตัวอย่างทีละขั้น: ห.ร.ม. ของ 42 และ 56', 'ตัวอย่างทีละขั้น หอรอมอ ของ 42 และ 56', el => el.append(dcWalk('ห.ร.ม. ของ 42 และ 56', [['แยกตัวประกอบ 42', '42 = 2 × 3 × 7'], ['แยกตัวประกอบ 56', '56 = 2 × 2 × 2 × 7'], ['ตัวที่มีร่วมกัน', '2 กับ 7 (มีในทั้งสองจำนวน)'], ['นำมาคูณกัน', '2 × 7 = 14']], 'ห.ร.ม. ของ 42 และ 56 คือ <b>14</b>', 'หอรอมอ ของ 42 และ 56 คือ 14')))],
    () => [...pkF(H6W_GPF.slice(0, 6), 4).map(nums => Q.hGcd({ nums, how: 'pf' })), ...pkF(H6W_GPF.slice(6), 2).map(nums => Q.hGcd({ nums, how: 'pf' })),
      Q.dPick({ q: '60 = 2 × 2 × 3 × 5 และ 90 = 2 × 3 × 3 × 5 ห.ร.ม. ตรงกับข้อใด', opts: ['2 × 3 × 5', '2 × 2 × 3 × 3 × 5', '2 × 5'], right: '2 × 3 × 5', hint: 'เลือกตัวที่มีทั้งสองจำนวน: 2 หนึ่งตัว 3 หนึ่งตัว 5 หนึ่งตัว' })]),
  L6H(6, 6, 'ถ้ำน้ำแข็งตั้งหาร', 'การหา ห.ร.ม. โดยการหาร', 'ห.ร.ม. (ตั้งหาร)', 'หา ห.ร.ม. โดยตั้งหารสั้นด้วยจำนวนเฉพาะที่หารทุกจำนวนลงตัว แล้วนำตัวหารมาคูณกัน', [
    T('ลองเอง: เลือกจำนวนเฉพาะที่หาร<b>ทุกจำนวน</b>ลงตัว ตั้งหารไปเรื่อย ๆ', 'ลองเอง เลือกจำนวนเฉพาะที่หารทุกจำนวนลงตัว ตั้งหารไปเรื่อย ๆ', el => el.append(simShortDivTry([36, 54], 'hcf'))),
    T('ตัวอย่างทีละขั้น: ห.ร.ม. ของ 28, 42 และ 70 โดยการหาร', 'ตัวอย่างทีละขั้น หอรอมอ ของ 28 42 และ 70 โดยการหาร', el => el.append(simShortDiv([28, 42, 70], 'hcf')))],
    () => [...pkF(H6W_GDV.slice(0, 6), 4).map(nums => Q.hGcd({ nums, how: 'div' })), ...pkF(H6W_GDV.slice(6), 2).map(nums => Q.hGcd({ nums, how: 'div' })),
      Q.dPick({ q: 'การตั้งหารสั้นเพื่อหา ห.ร.ม. ต้อง<b>หยุดหาร</b>เมื่อใด', opts: ['เมื่อไม่มีจำนวนเฉพาะใดหารทุกจำนวนได้ลงตัว', 'เมื่อหารได้ 2 ครั้ง', 'เมื่อผลหารเป็นเลขคี่'], right: 'เมื่อไม่มีจำนวนเฉพาะใดหารทุกจำนวนได้ลงตัว' })]),
  L6H(7, 7, 'ทางกบกระโดด', 'การหา ค.ร.น. โดยการหาผลคูณร่วม', 'ค.ร.น. (ผลคูณร่วม)', 'หาพหุคูณร่วม และ ค.ร.น. — พหุคูณร่วมที่น้อยที่สุด — ของจำนวนนับ', [
    T('กบ 2 ตัวกระโดดคนละระยะ — จุดที่ลง<b>ตรงกันครั้งแรก</b>คือพหุคูณร่วมที่น้อยที่สุด = <b>ค.ร.น.</b> (ปรับระยะกระโดดได้)', 'กบสองตัวกระโดดคนละระยะ จุดที่ลงตรงกันครั้งแรกคือพหุคูณร่วมที่น้อยที่สุด คือ คอรอนอ', el => el.append(simHops({ steps: [6, 9] }))),
    T('ตัวอย่างทีละขั้น: ค.ร.น. ของ 3, 4 และ 6 โดยเขียนพหุคูณ', 'ตัวอย่างทีละขั้น คอรอนอ ของ 3 4 และ 6 โดยเขียนพหุคูณ', el => el.append(dcWalk('ค.ร.น. ของ 3, 4 และ 6', [['พหุคูณของ 3', '3, 6, 9, <b>12</b>, 15, 18, 21, <b>24</b>, …'], ['พหุคูณของ 4', '4, 8, <b>12</b>, 16, 20, <b>24</b>, …'], ['พหุคูณของ 6', '6, <b>12</b>, 18, <b>24</b>, …'], ['พหุคูณร่วม', '12, 24, 36, … (มีในทั้งสามแถว)'], ['ตัวที่น้อยที่สุด', '12']], 'ค.ร.น. ของ 3, 4 และ 6 คือ <b>12</b>', 'คอรอนอ ของ 3 4 และ 6 คือ 12')))],
    () => [Q.hCmul({ nums: [8, 12], upto: 50 }), Q.hCmul({ nums: [6, 10], upto: 64 }), ...H6W_CM.map(nums => Q.hLcm({ nums, how: 'cm' })),
      Q.dPick({ q: 'ค.ร.น. ย่อมาจากคำว่าอะไร', opts: ['คูณร่วมน้อย', 'คูณรวมน้อย', 'คิดร่วมนาน'], right: 'คูณร่วมน้อย' })]),
  L6H(8, 8, 'สะพานแขวนตัวประกอบ', 'การหา ค.ร.น. โดยการแยกตัวประกอบ', 'ค.ร.น. (แยกตัวประกอบ)', 'หา ค.ร.น. โดยแยกตัวประกอบ แล้วนำตัวประกอบเฉพาะทุกหลักมาคูณกัน (ตัวที่ตรงกันใช้ครั้งเดียว)', [
    T('เรียงตัวประกอบให้ตรงหลัก แล้วเลือก<b>ทุกหลัก หลักละ 1 ตัว</b> มาคูณกัน = ค.ร.น.', 'เรียงตัวประกอบให้ตรงหลัก แล้วเลือกทุกหลัก หลักละหนึ่งตัวมาคูณกัน คือ คอรอนอ', el => el.append(simAlign([[10, 12], [14, 21], [6, 8, 10]], 'lcm'))),
    T('ตัวอย่างทีละขั้น: ค.ร.น. ของ 15, 20 และ 30', 'ตัวอย่างทีละขั้น คอรอนอ ของ 15 20 และ 30', el => el.append(dcWalk('ค.ร.น. ของ 15, 20 และ 30', [['แยกตัวประกอบ', '15 = 3 × 5 · 20 = 2 × 2 × 5 · 30 = 2 × 3 × 5'], ['2 มีมากที่สุดกี่ตัว', '2 ตัว (ใน 20) → 2 × 2'], ['3 มีมากที่สุดกี่ตัว', '1 ตัว → 3'], ['5 มีมากที่สุดกี่ตัว', '1 ตัว → 5'], ['นำมาคูณกัน', '2 × 2 × 3 × 5 = 60']], 'ค.ร.น. ของ 15, 20 และ 30 คือ <b>60</b>', 'คอรอนอ ของ 15 20 และ 30 คือ 60')))],
    () => [...pkF(H6W_LPF.slice(0, 3), 3).map(nums => Q.hLcm({ nums, how: 'lpf' })), ...pkF(H6W_LPF.slice(3), 3).map(nums => Q.hLcm({ nums, how: 'lpf' })),
      Q.dPick({ q: '12 = 2 × 2 × 3 และ 18 = 2 × 3 × 3 ค.ร.น. ตรงกับข้อใด', opts: ['2 × 2 × 3 × 3', '2 × 3', '2 × 2 × 3 × 2 × 3 × 3'], right: '2 × 2 × 3 × 3', hint: 'ตัวที่ตรงกันใช้เพียงครั้งเดียว: 2 สองตัว 3 สองตัว' })]),
  L6H(9, 9, 'ยอดหินตั้งหาร', 'การหา ค.ร.น. โดยการหาร', 'ค.ร.น. (ตั้งหาร)', 'หา ค.ร.น. โดยตั้งหารสั้นด้วยจำนวนเฉพาะที่หารได้ลงตัวอย่างน้อย 2 จำนวน แล้วนำตัวหารและผลหารสุดท้ายมาคูณกัน', [
    T('ลองเอง: เลือกจำนวนเฉพาะมาหาร แล้วนำ<b>ตัวหารทั้งหมด × ผลหารแถวล่าง</b> (รูปตัว L) = ค.ร.น.', 'ลองเอง เลือกจำนวนเฉพาะมาหาร แล้วนำตัวหารทั้งหมดคูณผลหารแถวล่าง เป็นรูปตัวแอล คือ คอรอนอ', el => el.append(simShortDivTry([12, 20], 'lcm'))),
    T('ตัวอย่างทีละขั้น: ค.ร.น. ของ 8, 12 และ 18 — ตัวที่หารไม่ลงตัว<b>ดึงลงมา</b>', 'ตัวอย่างทีละขั้น คอรอนอ ของ 8 12 และ 18 ตัวที่หารไม่ลงตัวให้ดึงลงมา', el => el.append(simShortDiv([8, 12, 18], 'lcm')))],
    () => [...pkF(H6W_LDV.slice(0, 4), 3).map(nums => Q.hLcm({ nums, how: 'ldiv' })), ...pkF(H6W_LDV.slice(4), 3).map(nums => Q.hLcm({ nums, how: 'ldiv' })),
      Q.dPick({ q: 'การตั้งหารหา ค.ร.น. ของ 3 จำนวน ต้องใช้จำนวนเฉพาะที่หารได้ลงตัวอย่างน้อยกี่จำนวน', opts: ['2 จำนวน', '3 จำนวน', '1 จำนวน'], right: '2 จำนวน' })]),
  L6H(10, 10, 'สันเขาสัมพันธ์', 'ความสัมพันธ์ระหว่าง ห.ร.ม. กับ ค.ร.น. ของจำนวนนับ 2 จำนวน', 'ห.ร.ม. × ค.ร.น.', 'ใช้ความสัมพันธ์ ห.ร.ม. × ค.ร.น. = ผลคูณของจำนวนนับ 2 จำนวนนั้น', [
    T('ใส่ตัวประกอบเฉพาะในวงกลม: <b>ตรงกลาง</b> = ห.ร.ม. · <b>ทั้งหมด</b> = ค.ร.น. — แล้วเทียบผลคูณ', 'ใส่ตัวประกอบเฉพาะในวงกลม ตรงกลางคือ หอรอมอ ทั้งหมดคือ คอรอนอ แล้วเทียบผลคูณ', el => el.append(simRel())),
    T('ตัวอย่างทีละขั้น: หาจำนวนที่หายไป', 'ตัวอย่างทีละขั้น หาจำนวนที่หายไป', el => el.append(dcWalk('', [['โจทย์', 'ห.ร.ม. ของสองจำนวนคือ 6 ค.ร.น. คือ 72 จำนวนหนึ่งคือ 18 อีกจำนวนคือเท่าใด'], ['ใช้ความสัมพันธ์', 'ห.ร.ม. × ค.ร.น. = จำนวนที่หนึ่ง × จำนวนที่สอง'], ['แทนค่า', '6 × 72 = 18 × ☐ → 432 = 18 × ☐'], ['หาร', '☐ = 432 ÷ 18 = 24'], ['ตรวจสอบ', 'ห.ร.ม. ของ 18, 24 = 6 ✓ ค.ร.น. = 72 ✓']], 'อีกจำนวนคือ <b>24</b>', 'อีกจำนวนคือ 24')))],
    () => [...pkF(H6W_TF.filter(([t]) => !/24 และ 36|^ห\.ร\.ม\. ของ 12 และ 18/.test(t)), 3).map(h6tf),
      ...pkF([[12, 4, 48, 16], [15, 5, 60, 20], [21, 7, 84, 28], [27, 9, 54, 18]], 2).map(([a, g, l, b]) => Q.hNum({ q: `ห.ร.ม. ของสองจำนวนคือ ${g} ค.ร.น. คือ ${l} จำนวนหนึ่งคือ ${a} อีกจำนวนคือเท่าใด`, head: `${g} × ${l} = ${a} × <span class="fsign">?</span>`, a: b, hint: `${g} × ${l} = ${g * l} แล้วหารด้วย ${a}` })),
      Q.hNum({ q: 'ห.ร.ม. × ค.ร.น. ของ 8 และ 14 เท่ากับเท่าใด', head: 'ห.ร.ม. × ค.ร.น. = <span class="fsign">?</span>', a: 112, hint: 'เท่ากับผลคูณ 8 × 14' }),
      Q.dPick({ q: 'ข้อใดถูกต้องเสมอ สำหรับจำนวนนับ 2 จำนวน', opts: ['ห.ร.ม. × ค.ร.น. = ผลคูณของสองจำนวนนั้น', 'ห.ร.ม. + ค.ร.น. = ผลบวกของสองจำนวนนั้น', 'ค.ร.น. ÷ ห.ร.ม. = 2'], right: 'ห.ร.ม. × ค.ร.น. = ผลคูณของสองจำนวนนั้น' })]),
  L6H(11, 11, 'ลานตัดเชือก', 'โจทย์ปัญหาที่เกี่ยวกับ ห.ร.ม.', 'โจทย์ ห.ร.ม.', 'แก้โจทย์ปัญหาการแบ่ง ตัด หรือจัดของให้เท่ากันมากที่สุด โดยใช้ ห.ร.ม.', [
    T('ตัดริบบิ้น 3 เส้นเป็นชิ้นยาวเท่ากัน <b>ยาวที่สุด</b>โดยไม่เหลือเศษ — ปรับความยาวชิ้นดู', 'ตัดริบบิ้นสามเส้นเป็นชิ้นยาวเท่ากัน ยาวที่สุดโดยไม่เหลือเศษ ปรับความยาวชิ้นดู', el => el.append(simCut([18, 24, 30]))),
    T('ตัวอย่างทีละขั้น: โจทย์ปัญหา ห.ร.ม.', 'ตัวอย่างทีละขั้น โจทย์ปัญหา หอรอมอ', el => el.append(dcStory('ผ้า 3 ผืน ยาว 36, 48 และ 60 เซนติเมตร ตัดเป็นชิ้นยาวเท่ากัน<b>ยาวที่สุด</b>โดยไม่เหลือเศษ จะได้ชิ้นละกี่เซนติเมตร และได้ทั้งหมดกี่ชิ้น', [['① วิเคราะห์', 'ตัดให้เท่ากันและยาวที่สุด → หา ห.ร.ม.'], ['② ห.ร.ม.', 'ห.ร.ม. ของ 36, 48, 60 = 12 → ชิ้นละ 12 ซม.'], ['③ จำนวนชิ้น', '36 ÷ 12 + 48 ÷ 12 + 60 ÷ 12 = 3 + 4 + 5'], ['④ ตอบ', 'ชิ้นละ 12 ซม. ได้ทั้งหมด 12 ชิ้น']], '3 + 4 + 5')))],
    () => [Q.hStory({ text: 'นักกีฬาวิ่ง 24 คน ว่ายน้ำ 64 คน ฟุตบอล 40 คน จะแบ่งขึ้นรถตู้ คันละเท่า ๆ กัน แต่ละคันมีนักกีฬาประเภทเดียว โดยใช้รถ<b>น้อยที่สุด</b> ต้องใช้รถตู้กี่คัน', kind: 'hcf', ans: 16, unit: 'คัน', ask: 'ห.ร.ม. = 8 คนต่อคัน → ใช้รถทั้งหมดกี่คัน', why: 'ห.ร.ม. ของ 24, 64, 40 = 8 → 3 + 8 + 5 = 16 คัน' }),
      ...pkF([
        { text: 'เชือก 2 เส้น ยาว 42 เมตร และ 56 เมตร ตัดเป็นเส้นสั้น ๆ ยาวเท่ากัน<b>ยาวที่สุด</b>โดยไม่เหลือเศษ จะได้เส้นละกี่เมตร', ans: 14, unit: 'เมตร', why: 'ห.ร.ม. ของ 42 และ 56 = 14' },
        { text: 'ดินสอ 45 แท่ง ยางลบ 60 ก้อน แบ่งให้นักเรียนคนละเท่า ๆ กัน ทั้งดินสอและยางลบ ได้<b>มากที่สุด</b>กี่คน', ans: 15, unit: 'คน', why: 'ห.ร.ม. ของ 45 และ 60 = 15' },
        { text: 'ที่ดินกว้าง 54 เมตร ยาว 72 เมตร ปักเสารอบที่ดินให้ห่างเท่า ๆ กัน และห่างกัน<b>มากที่สุด</b> เสาต้นหนึ่งห่างกันกี่เมตร', ans: 18, unit: 'เมตร', why: 'ห.ร.ม. ของ 54 และ 72 = 18' },
        { text: 'ปูกระเบื้องรูปสี่เหลี่ยมจัตุรัสขนาด<b>ใหญ่ที่สุด</b>บนพื้นกว้าง 90 ซม. ยาว 120 ซม. ได้พอดี กระเบื้องยาวด้านละกี่เซนติเมตร', ans: 30, unit: 'ซม.', why: 'ห.ร.ม. ของ 90 และ 120 = 30' },
        { text: 'ส้ม 32 ผล มังคุด 48 ผล จัดใส่ถุงละเท่า ๆ กัน ไม่ปนกัน ให้แต่ละถุงมีผลไม้<b>มากที่สุด</b> ถุงละกี่ผล', ans: 16, unit: 'ผล', why: 'ห.ร.ม. ของ 32 และ 48 = 16' }], 4).map(o => Q.hStory({ ...o, kind: 'hcf' }))]),
  L6H(12, 12, 'หอระฆังบนเขา', 'โจทย์ปัญหาที่เกี่ยวกับ ค.ร.น.', 'โจทย์ ค.ร.น.', 'แก้โจทย์ปัญหาเหตุการณ์ที่เกิดขึ้นพร้อมกันอีกครั้ง หรือหาจำนวนที่น้อยที่สุด โดยใช้ ค.ร.น.', [
    T('รถกระเช้า 2 สาย ออกทุก 10 นาที และ 15 นาที ออกพร้อมกันตอน 0 — กดเดินเวลาไปเรื่อย ๆ จะออก<b>พร้อมกันอีกครั้ง</b>เมื่อใด', 'รถกระเช้าสองสาย ออกทุก 10 นาที และ 15 นาที กดเดินเวลาไปเรื่อย ๆ จะออกพร้อมกันอีกครั้งเมื่อใด', el => el.append(simHops({ steps: [10, 15], fixed: true, names: ['กระเช้าแดง', 'กระเช้าฟ้า'], unit: ' นาที', intro: 'กระเช้าแดงออกทุก 10 นาที · กระเช้าฟ้าออกทุก 15 นาที — กด “กระโดด” เพื่อเดินเวลา', meet: v => `ออกพร้อมกันอีกครั้งในอีก <b>${v} นาที</b> = ค.ร.น. ของ 10 และ 15` }))),
    T('ตัวอย่างทีละขั้น: โจทย์ปัญหา ค.ร.น. เรื่องเวลา', 'ตัวอย่างทีละขั้น โจทย์ปัญหา คอรอนอ เรื่องเวลา', el => el.append(dcStory('ระฆัง 2 ใบ ตีทุก 6 นาที และ 8 นาที ตีพร้อมกันเมื่อเวลา 09.00 น. จะตีพร้อมกัน<b>อีกครั้ง</b>เวลาใด', [['① วิเคราะห์', 'พร้อมกันอีกครั้ง → หา ค.ร.น.'], ['② ค.ร.น.', 'ค.ร.น. ของ 6 และ 8 = 24 → อีก 24 นาที'], ['③ บวกเวลา', '09.00 น. + 24 นาที'], ['④ ตอบ', 'ตีพร้อมกันอีกครั้งเวลา 09.24 น.']], '')))],
    () => [Q.hStory({ text: 'สมชายล้างรถทุก 42 วัน สมหญิงล้างรถทุก 36 วัน ถ้าวันนี้ล้างรถพร้อมกัน อีกกี่วันจะล้างรถ<b>พร้อมกันอีกครั้ง</b>', kind: 'lcm', ans: 252, unit: 'วัน', why: 'ค.ร.น. ของ 42 และ 36 = 252' }),
      Q.dPick({ q: 'ไก่ 3 ตัว ขันทุก 12, 16 และ 24 นาที ขันพร้อมกันเวลา 07.30 น. จะขันพร้อมกัน<b>อีกครั้ง</b>เวลาใด', opts: ['08.18 น.', '08.06 น.', '07.54 น.', '08.42 น.'], right: '08.18 น.', hint: 'ค.ร.น. ของ 12, 16, 24 = 48 นาที → 07.30 + 48 นาที' }),
      ...pkF([
        { text: 'ไฟ 2 ดวง กะพริบทุก 8 วินาที และ 12 วินาที กะพริบพร้อมกันแล้ว อีกกี่วินาทีจะกะพริบ<b>พร้อมกันอีกครั้ง</b>', ans: 24, unit: 'วินาที', why: 'ค.ร.น. ของ 8 และ 12 = 24' },
        { text: 'จำนวนนับที่<b>น้อยที่สุด</b>ที่หารด้วย 6, 8 และ 10 ได้ลงตัว คือจำนวนใด', ans: 120, unit: '', why: 'ค.ร.น. ของ 6, 8, 10 = 120' },
        { text: 'นักวิ่ง 2 คน วิ่งรอบสนามรอบละ 4 นาที และ 6 นาที ออกพร้อมกัน อีกกี่นาทีจะ<b>พบกันที่จุดเริ่มต้น</b>อีกครั้ง', ans: 12, unit: 'นาที', why: 'ค.ร.น. ของ 4 และ 6 = 12' },
        { text: 'แม่ค้าจัดไข่ใส่ถาด ถาดละ 12 ฟอง หรือถาดละ 15 ฟอง ก็ได้พอดี แม่ค้ามีไข่<b>อย่างน้อย</b>กี่ฟอง', ans: 60, unit: 'ฟอง', why: 'ค.ร.น. ของ 12 และ 15 = 60' }], 3).map(o => Q.hStory({ ...o, kind: 'lcm' }))]),
  L6H(13, 13, 'ทางแยกนักวิเคราะห์', 'การวิเคราะห์โจทย์ปัญหา และหาคำตอบ (ตอนที่ 1)', 'วิเคราะห์โจทย์ 1', 'วิเคราะห์โจทย์ปัญหาว่าต้องใช้ ห.ร.ม. หรือ ค.ร.น. แล้วหาคำตอบพร้อมตรวจสอบ', [
    T('อ่านโจทย์แล้วเลือกเครื่องมือ: <b>ห.ร.ม.</b> หรือ <b>ค.ร.น.</b>?', 'อ่านโจทย์แล้วเลือกเครื่องมือ หอรอมอ หรือ คอรอนอ', el => el.append(simKind(H6_KIND))),
    T('ตัวอย่างทีละขั้น: วิเคราะห์โจทย์ 4 ขั้น', 'ตัวอย่างทีละขั้น วิเคราะห์โจทย์สี่ขั้น', el => el.append(dcStory('มีส้ม 48 ผล มังคุด 36 ผล จัดใส่ถุง ถุงละเท่า ๆ กัน แต่ละถุงมีผลไม้ชนิดเดียว และมีจำนวน<b>มากที่สุด</b> จะได้ทั้งหมดกี่ถุง', [['① โจทย์ถามอะไร', 'จำนวนถุงทั้งหมด'], ['② โจทย์บอกอะไร', 'ส้ม 48 มังคุด 36 ถุงละเท่ากันมากที่สุด'], ['③ วางแผน', 'มากที่สุดที่แบ่งได้พอดี → ห.ร.ม. ของ 48, 36 = 12 ผลต่อถุง'], ['④ คำนวณ', '48 ÷ 12 + 36 ÷ 12 = 4 + 3 = 7 ถุง'], ['⑤ ตรวจสอบ', '7 ถุง × 12 ผล = 84 = 48 + 36 ✓']], '4 + 3')))],
    () => [...pkF(H6_KINDG, 4).map(h6kq),
      Q.hStory({ text: 'แม่ค้ามีมะม่วง 42 ผล ส้ม 56 ผล จัดใส่ถุงละเท่า ๆ กัน ไม่ปนกัน และให้แต่ละถุงมีผลไม้<b>มากที่สุด</b> จะได้ทั้งหมดกี่ถุง', kind: 'hcf', ans: 7, unit: 'ถุง', ask: 'ห.ร.ม. = 14 ผลต่อถุง → ได้กี่ถุง', why: 'ห.ร.ม. ของ 42 และ 56 = 14 → 3 + 4 = 7 ถุง' }),
      Q.dPick({ q: 'ระฆัง 2 ใบ ตีทุก 9 นาที และ 12 นาที ตีพร้อมกันเมื่อ 10.00 น. จะตีพร้อมกันอีกครั้งเวลาใด', opts: ['10.36 น.', '10.21 น.', '10.18 น.', '11.08 น.'], right: '10.36 น.', hint: 'ค.ร.น. ของ 9 และ 12 = 36 นาที' })]),
  L6H(14, 14, 'ทางขึ้นยอดเขา', 'การวิเคราะห์โจทย์ปัญหา และหาคำตอบ (ตอนที่ 2)', 'วิเคราะห์โจทย์ 2', 'แก้โจทย์ปัญหาหลายขั้นตอนที่ใช้ ห.ร.ม. และ ค.ร.น. เช่น จำนวนแผ่น จำนวนชิ้น หรือเหลือเศษเท่ากัน', [
    T('ปูกระเบื้องจัตุรัสให้<b>พอดี</b>และ<b>ใหญ่ที่สุด</b> — ปรับขนาดกระเบื้อง แล้วนับจำนวนแผ่น (ใช้ 2 ขั้นตอน)', 'ปูกระเบื้องจัตุรัสให้พอดีและใหญ่ที่สุด ปรับขนาดกระเบื้อง แล้วนับจำนวนแผ่น', el => el.append(simTiles(60, 48))),
    T('ตัวอย่างทีละขั้น: โจทย์ “<b>เหลือเศษเท่ากัน</b>”', 'ตัวอย่างทีละขั้น โจทย์เหลือเศษเท่ากัน', el => el.append(dcStory('จำนวนนับที่<b>น้อยที่สุด</b> ซึ่งหารด้วย 6, 8 และ 12 แล้ว<b>เหลือเศษ 5</b> ทุกครั้ง คือจำนวนใด', [['① คิดย้อน', 'ถ้าเอาเศษ 5 ออก จำนวนนั้นจะหารด้วย 6, 8, 12 ลงตัว'], ['② ค.ร.น.', 'ค.ร.น. ของ 6, 8, 12 = 24'], ['③ บวกเศษกลับ', '24 + 5 = 29'], ['④ ตรวจสอบ', '29 ÷ 6 = 4 เศษ 5 · 29 ÷ 8 = 3 เศษ 5 · 29 ÷ 12 = 2 เศษ 5 ✓']], '24 + 5')))],
    () => [Q.hNum({ q: 'จำนวนนับที่<b>น้อยที่สุด</b> ซึ่งหารด้วย 4, 6 และ 9 แล้วเหลือเศษ 1 ทุกครั้ง คือจำนวนใด', head: '<span class="fsign">?</span>', a: 37, hint: 'ค.ร.น. ของ 4, 6, 9 = 36 แล้วบวกเศษ 1' }),
      Q.hNum({ q: 'จำนวนนับที่<b>มากที่สุด</b> ซึ่งหาร 38 และ 50 แล้วเหลือเศษ 2 เท่ากัน คือจำนวนใด', head: '<span class="fsign">?</span>', a: 12, hint: 'เอาเศษออกก่อน: 36 และ 48 แล้วหา ห.ร.ม.' }),
      Q.hStory({ text: 'ปูกระเบื้องจัตุรัสขนาด<b>ใหญ่ที่สุด</b>บนพื้นกว้าง 120 ซม. ยาว 150 ซม. ได้พอดี ต้องใช้กระเบื้องกี่แผ่น', kind: 'hcf', ans: 20, unit: 'แผ่น', ask: 'กระเบื้องด้านละ 30 ซม. → ใช้กี่แผ่น', why: 'ห.ร.ม. ของ 120 และ 150 = 30 → 4 × 5 = 20 แผ่น' }),
      Q.hStory({ text: 'ริบบิ้น 3 ม้วน ยาว 30, 45 และ 60 เมตร ตัดเป็นเส้นยาวเท่ากัน<b>ยาวที่สุด</b>โดยไม่เหลือเศษ จะได้ทั้งหมดกี่เส้น', kind: 'hcf', ans: 9, unit: 'เส้น', ask: 'เส้นละ 15 เมตร → ได้ทั้งหมดกี่เส้น', why: 'ห.ร.ม. = 15 → 2 + 3 + 4 = 9 เส้น' }),
      Q.hStory({ text: 'จัดนักเรียนเข้าแถว แถวละ 6, 8 หรือ 9 คน ก็ได้พอดีทุกครั้ง นักเรียนมี<b>อย่างน้อย</b>กี่คน', kind: 'lcm', ans: 72, unit: 'คน', why: 'ค.ร.น. ของ 6, 8, 9 = 72' }),
      Q.dPick({ q: 'รถ 2 สาย ออกจากสถานีทุก 15 นาที และ 20 นาที ออกพร้อมกันเวลา 06.00 น. จะออกพร้อมกันอีกครั้งเวลาใด', opts: ['07.00 น.', '06.35 น.', '06.30 น.', '07.20 น.'], right: '07.00 น.', hint: 'ค.ร.น. ของ 15 และ 20 = 60 นาที' })])
];

/* =========================================================
   BOSS 719 — ข้อสอบท้ายบท แต่งใหม่ทั้งหมด (original items)
   ========================================================= */
const EXAM_P6C1 = xrot([
  { q: '84 แยกตัวประกอบได้ตามข้อใด', opts: ['2 × 42', '4 × 3 × 7', '2 × 2 × 3 × 7', '2 × 6 × 7'], a: 2 },
  { q: '2³ × 3² × 5 เป็นการแยกตัวประกอบของจำนวนใด', opts: ['240', '300', '360', '450'], a: 2 },
  { q: 'พิจารณาการแยกตัวประกอบของจำนวนต่อไปนี้<br>36 = 2 × 2 × 3 × 3<br>48 = 2 × 2 × 2 × 2 × 3<br>60 = 2 × 2 × 3 × 5<br>ห.ร.ม. ตรงกับข้อใด', opts: ['2 × 3', '2 × 2 × 3', '2 × 2 × 2 × 3', '2 × 2 × 2 × 2 × 3 × 3 × 5'], a: 1 },
  { q: 'ไฟกะพริบ 3 ดวง กะพริบทุก 6 วินาที 8 วินาที และ 10 วินาที ถ้าต้องการรู้ว่าจะกะพริบพร้อมกันอีกครั้งเมื่อใด ควรหาคำตอบด้วยวิธีใด', opts: ['ห.ร.ม.', 'ค.ร.น.', 'การบวกทั้งสามจำนวน', 'การหาตัวประกอบของ 6'], a: 1 },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['3 มีตัวประกอบ 2 ตัว คือ 1 และ 3', '11 มีตัวประกอบ 2 ตัว คือ 1 และ 11', '13 มีตัวประกอบ 2 ตัว คือ 1 และ 13', '15 มีตัวประกอบ 2 ตัว คือ 1 และ 15'], a: 3 },
  { q: 'จำนวนใดบ้างเป็นตัวประกอบเฉพาะของ 30', opts: ['1, 2, 3', '2, 3, 5', '2, 5, 6', '3, 5, 15'], a: 1 },
  { q: 'พิจารณาข้อความต่อไปนี้<br>1. 72 แยกตัวประกอบได้เป็น 2³ × 3²<br>2. 100 แยกตัวประกอบได้เป็น 2² × 5²<br>3. 54 แยกตัวประกอบได้เป็น 2² × 3³<br>ข้อใดถูกต้อง', opts: ['ข้อ 1 เท่านั้น', 'ข้อ 1 และ 2', 'ข้อ 2 และ 3', 'ข้อ 1, 2 และ 3'], a: 1 },
  { q: 'ห.ร.ม. ของ 16 40 และ 56 คือจำนวนใด', opts: ['2', '4', '8', '16'], a: 2 },
  { q: 'ข้อใด<b>ไม่มี</b> ห.ร.ม. เท่ากับ 12', opts: ['24 36', '48 60', '36 84', '30 72'], a: 3 },
  { q: '12, 18, 30 มี ห.ร.ม. และ ค.ร.น. ต่างกันเท่าใด', opts: ['174', '180', '186', '168'], a: 0 },
  { q: 'ค.ร.น. ของ 12 16 และ 24 คือข้อใด', opts: ['24', '48', '96', '192'], a: 1 },
  { q: '36, 54, 90 ค.ร.น. มีค่ามากกว่า ห.ร.ม. กี่เท่า', opts: ['15 เท่า', '20 เท่า', '30 เท่า', '45 เท่า'], a: 2 },
  { q: 'ตัวประกอบร่วมของ 18 และ 27 คือข้อใด', opts: ['1, 3', '1, 3, 9', '1, 2, 3, 9', '3, 9, 27'], a: 1 },
  { q: `${FX('[1/4] + [1/6] + [1/10]')} ถ้าใช้ ค.ร.น. ช่วยทำตัวส่วนให้เท่ากัน จะได้ตัวส่วนที่น้อยที่สุดเท่ากับเท่าใด`, opts: ['20', '30', '60', '240'], a: 2 },
  { q: 'จำนวนคู่ใดมี ค.ร.น. เป็น 84', opts: ['12, 14', '8, 21', '6, 16', '14, 18'], a: 0 },
  { q: '14 เป็น ห.ร.ม. ของ 98, ☐, 154 ควรเติมจำนวนใดลงในช่องว่าง', opts: ['120', '132', '182', '212'], a: 2 },
  { q: 'ครูต้องมีดินสออย่างน้อยกี่แท่ง จึงจะแบ่งเป็นกอง กองละ 8 แท่ง หรือ 12 แท่ง หรือ 15 แท่ง ได้พอดีทุกครั้งโดยไม่เหลือเศษ', opts: ['60 แท่ง', '120 แท่ง', '240 แท่ง', '360 แท่ง'], a: 1 },
  { q: 'เครื่องจักร 3 เครื่องต้องตรวจเช็กทุก 5 วัน 6 วัน และ 9 วัน ถ้าวันนี้ตรวจพร้อมกัน อีกกี่วันจึงจะตรวจพร้อมกันอีกครั้ง', opts: ['30 วัน', '45 วัน', '90 วัน', '270 วัน'], a: 2 },
  { q: 'ผ้า 3 ผืนยาว 36, 60 และ 84 เซนติเมตร ตัดเป็นชิ้นยาวเท่า ๆ กันให้ยาวที่สุดโดยไม่เหลือเศษ จะได้ชิ้นยาวชิ้นละกี่เซนติเมตร และได้ทั้งหมดกี่ชิ้น', opts: ['ยาว 12 ซม. ได้ 15 ชิ้น', 'ยาว 6 ซม. ได้ 30 ชิ้น', 'ยาว 12 ซม. ได้ 14 ชิ้น', 'ยาว 4 ซม. ได้ 45 ชิ้น'], a: 0 },
  { q: 'รถเมล์ 3 สายออกจากท่าทุก 10 นาที 15 นาที และ 25 นาที ถ้าออกพร้อมกันเวลา 6.00 น. จะออกพร้อมกันอีกครั้งเวลาใด', opts: ['7.15 น.', '7.30 น.', '8.30 น.', '9.00 น.'], a: 2 }
], 2);
LESSONS_P6C1.push({ id: 719, boss: true, place: 'ยอดเขาราชาเยติ', title: 'ด่านบอส: บทที่ 1 ห.ร.ม. และ ค.ร.น.', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'ตอบคำถามเรื่องตัวประกอบ 20 ข้อ (ห.ร.ม. ค.ร.น. การแยกตัวประกอบ และโจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อพิชิตยอดเขา',
  exam: EXAM_P6C1, pass: 10, bossName: 'ราชาเยติ', bossPal: 'grey', emblem: '÷', bossKind: 'yeti' });
