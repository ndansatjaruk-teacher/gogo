/* =========================================================
   ป.6 บทที่ 7 รูปหลายเหลี่ยม (ภาคเรียนที่ 2) — polygon engine (draggable, interior angles incl. reflex),
   triangulation, perimeter, areas of trapezoid / kite / perpendicular-diagonal quads / split quads / composite figures.
   Levels 821–832 + boss 839   (prefix k7)
   ========================================================= */
const K7_TH = { 3: 'สาม', 4: 'สี่', 5: 'ห้า', 6: 'หก', 7: 'เจ็ด', 8: 'แปด', 9: 'เก้า', 10: 'สิบ', 11: 'สิบเอ็ด', 12: 'สิบสอง' };
const K7N = n => `รูป${K7_TH[n]}เหลี่ยม`;
const k7sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const k7area2 = p => p.reduce((s, q, i) => { const r = p[(i + 1) % p.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0);
/* raw interior angles (deg) of a simple polygon, concave allowed */
function k7raw(p) {
  const n = p.length, t = p.map((P, i) => { const e1 = k7sub(P, p[(i + n - 1) % n]), e2 = k7sub(p[(i + 1) % n], P); return Math.atan2(e1[0] * e2[1] - e1[1] * e2[0], e1[0] * e2[0] + e1[1] * e2[1]); });
  const s = Math.sign(t.reduce((a, b) => a + b, 0)) || 1; return t.map(x => 180 - x * 180 / Math.PI * s);
}
const k7round = raw => { const A = raw.map(Math.round), tot = (raw.length - 2) * 180; A[A.length - 1] = tot - A.slice(0, -1).reduce((a, b) => a + b, 0); return A; };
const k7pip = (P, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > P[1]) !== (yj > P[1]) && P[0] < (xj - xi) * (P[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const k7cross = (a, b, c, d) => { const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
const k7simple = p => { const n = p.length; for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) { if (i === 0 && j === n - 1) continue; if (k7cross(p[i], p[(i + 1) % n], p[j], p[(j + 1) % n])) return false; } return true; };
/* regular-ish polygon (jitter = list of radius factors) */
function k7reg(n, o = {}) { const cx = o.cx || 200, cy = o.cy || 135, r = o.r || 105, rot = (o.rot ?? -90) * Math.PI / 180, J = o.jit || [1];
  return Array.from({ length: n }, (_, i) => { const a = rot + i * 2 * Math.PI / n, rr = r * J[i % J.length]; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; }); }
const K7J = [1, .78, .96, .82, 1, .74, .92, .86, .98, .8];
const K7COL = ['#FF9AA5', '#8EC5FA', '#7EDDB8', '#FFD27A', '#C4B5FD', '#FFB38A', '#9BE3E0', '#F9A8D4'];
/* fit unit coords (y up) into the box; fixed k keeps scale while centring */
function k7fit(pts, W, H, pad = 34, k0) {
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), mnx = Math.min(...xs), mxx = Math.max(...xs), mny = Math.min(...ys), mxy = Math.max(...ys);
  const k = k0 || Math.min((W - 2 * pad) / ((mxx - mnx) || 1), (H - 2 * pad) / ((mxy - mny) || 1)), ox = (W - (mxx - mnx) * k) / 2, oy = (H - (mxy - mny) * k) / 2;
  const f = q => [ox + (q[0] - mnx) * k, H - oy - (q[1] - mny) * k]; f.k = k; return f;
}
/* polygon SVG. o.fit → p and every point option are in unit coords (y up) */
function polySVG(p0, o = {}) {
  const W = o.W || 400, H = o.H || 260, f = o.fit ? k7fit([...p0, ...(o.fitPts || [])], W, H, o.pad || 36, o.k) : q => q, p = p0.map(f), n = p.length;
  const raw = k7raw(p), A = k7round(raw), C = { b: '#E5487A', g: '#C98612', v: '#7E6ED6' };
  const side = k => [p[k], p[(k + 1) % n]], out = (M, nrm, d) => { const t = [M[0] + nrm[0] * 3, M[1] + nrm[1] * 3]; return k7pip(t, p) ? [M[0] - nrm[0] * d, M[1] - nrm[1] * d] : [M[0] + nrm[0] * d, M[1] + nrm[1] * d]; };
  let s = `<svg viewBox="0 0 ${W} ${H}" class="t6-svg k7-svg" aria-hidden="true">`;
  if (o.grid) { const g = o.grid; for (let x = 0; x <= W; x += g) s += `<path d="M${x} 0 V${H}" stroke="#E6E1F2" stroke-width="1"/>`; for (let y = 0; y <= H; y += g) s += `<path d="M0 ${y} H${W}" stroke="#E6E1F2" stroke-width="1"/>`; }
  (o.polys || []).forEach(q => { s += `<path d="M${q.pts.map(f).join(' L')} Z" fill="${q.fill || 'none'}" fill-opacity="${q.op ?? .75}" stroke="${q.stroke || '#2B2550'}" stroke-width="${q.w || 1.6}" ${q.dash ? 'stroke-dasharray="7 5"' : ''}/>`; });
  s += `<path d="M${p.join(' L')} Z" fill="${o.fill || '#CFE6FF'}" fill-opacity="${o.fillOp ?? .55}" stroke="#2B2550" stroke-width="2.6" stroke-linejoin="round"/>`;
  (o.over || []).forEach(q => { s += `<path d="M${q.pts.map(f).join(' L')} Z" fill="${q.fill || 'none'}" fill-opacity="${q.op ?? 1}" stroke="${q.stroke || '#2B2550'}" stroke-width="${q.w || 2}"/>`; });
  (o.tris || []).forEach(([i, j, k, col], m) => { s += `<path d="M${p[i]} L${p[j]} L${p[k]} Z" fill="${col || K7COL[m % K7COL.length]}" fill-opacity=".7" stroke="#2B2550" stroke-width="1.6"/>`;
    if (o.triNums) { const c = [(p[i][0] + p[j][0] + p[k][0]) / 3, (p[i][1] + p[j][1] + p[k][1]) / 3]; s += `<text x="${c[0]}" y="${c[1] + 6}" text-anchor="middle" class="t6-n">${m + 1}</text>`; } });
  (o.diags || []).forEach(([i, j]) => { s += `<path d="M${p[i]} L${p[j]}" stroke="#7E6ED6" stroke-width="2.4" stroke-dasharray="7 5"/>`; });
  (o.segs || []).forEach(g => { const a = f(g.a), b = f(g.b); s += `<path d="M${a} L${b}" stroke="${g.col || C.v}" stroke-width="${g.w || 2.6}" ${g.solid ? '' : 'stroke-dasharray="7 5"'}/>`;
    if (g.label) { const M = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nr = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L], d = g.off ?? 14; s += `<text x="${M[0] + nr[0] * d}" y="${M[1] + nr[1] * d + 5}" text-anchor="middle" class="t6-sv" fill="${g.col || C.v}">${g.label}</text>`; } });
  (o.rms || []).forEach(([P0, Q0, R0]) => { const P = f(P0), Q = f(Q0), R = f(R0), u = k7sub(P, Q), v = k7sub(R, Q), lu = Math.hypot(...u) || 1, lv = Math.hypot(...v) || 1, q = 10;
    s += `<path d="M${Q[0] + u[0] / lu * q} ${Q[1] + u[1] / lu * q} l${v[0] / lv * q} ${v[1] / lv * q} l${-u[0] / lu * q} ${-u[1] / lu * q}" fill="none" stroke="#2B2550" stroke-width="1.8"/>`; });
  p.forEach((P, i) => { const Pa = p[(i + n - 1) % n], Pb = p[(i + 1) % n], th = raw[i], a1 = Math.atan2(Pa[1] - P[1], Pa[0] - P[0]), a2 = Math.atan2(Pb[1] - P[1], Pb[0] - P[0]);
    const md = x => ((x % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI, dir = Math.abs(md(a1 + th * Math.PI / 180 - a2)) < .05 ? 1 : -1, show = o.angles && o.angles[i] != null && o.angles[i] !== false;
    const lmin = Math.min(Math.hypot(...k7sub(Pa, P)), Math.hypot(...k7sub(Pb, P))), r = Math.min(o.arcR || 18, lmin * .35);
    if (o.rightMarks !== false && Math.abs(th - 90) < .6) { const q = 11, u1 = [Math.cos(a1), Math.sin(a1)], u2 = [Math.cos(a2), Math.sin(a2)]; s += `<path d="M${P[0] + u1[0] * q} ${P[1] + u1[1] * q} l${u2[0] * q} ${u2[1] * q} l${-u1[0] * q} ${-u1[1] * q}" fill="none" stroke="#2B2550" stroke-width="1.8"/>`; }
    else if (show || o.arcs) { const e = a1 + dir * th * Math.PI / 180; s += `<path d="M${P[0] + r * Math.cos(a1)} ${P[1] + r * Math.sin(a1)} A${r} ${r} 0 ${th > 180 ? 1 : 0} ${dir > 0 ? 1 : 0} ${P[0] + r * Math.cos(e)} ${P[1] + r * Math.sin(e)}" fill="none" stroke="${(o.arcCol && o.arcCol[i]) || C.g}" stroke-width="2.4"/>`; }
    if (show) { const m = a1 + dir * th * Math.PI / 360, R = r + 17, t = o.angles[i] === true ? A[i] + '°' : typeof o.angles[i] === 'number' ? o.angles[i] + '°' : o.angles[i];
      s += `<text x="${P[0] + R * Math.cos(m)}" y="${P[1] + R * Math.sin(m) + 5}" text-anchor="middle" class="t6-av">${t}</text>`; }
    if (o.names) { const u1 = k7sub(Pa, P), u2 = k7sub(Pb, P), l1 = Math.hypot(...u1) || 1, l2 = Math.hypot(...u2) || 1; let b = [u1[0] / l1 + u2[0] / l2, u1[1] / l1 + u2[1] / l2]; const lb = Math.hypot(...b); b = lb < .05 ? [-u1[1] / l1, u1[0] / l1] : [b[0] / lb, b[1] / lb];
      const q = out(P, b, 16); s += `<text x="${q[0]}" y="${q[1] + 6}" text-anchor="middle" class="t6-n">${o.names[i]}</text>`; } });
  for (let k = 0; k < n; k++) { const [a, b] = side(k), M = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nr = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L], u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    const tk = o.ticks ? o.ticks[k] : 0; for (let j = 0; j < tk; j++) { const off = (j - (tk - 1) / 2) * 6, c = [M[0] + u[0] * off, M[1] + u[1] * off]; s += `<path d="M${c[0] - u[1] * 7} ${c[1] + u[0] * 7} L${c[0] + u[1] * 7} ${c[1] - u[0] * 7}" stroke="#2B2550" stroke-width="2"/>`; }
    if (o.par && o.par[k]) { const c = [M[0] + u[0] * 14, M[1] + u[1] * 14]; s += `<path d="M${c[0] - u[0] * 7 - u[1] * 5} ${c[1] - u[1] * 7 + u[0] * 5} L${c[0]} ${c[1]} L${c[0] - u[0] * 7 + u[1] * 5} ${c[1] - u[1] * 7 - u[0] * 5}" fill="none" stroke="#2B2550" stroke-width="2"/>`; }
    if (o.sides && o.sides[k] != null) { const q = out(M, nr, 17); s += `<text x="${q[0]}" y="${q[1] + 5}" text-anchor="middle" class="t6-sv">${o.sides[k]}</text>`; } }
  (o.texts || []).forEach(([P0, t, cls]) => { const P = f(P0); s += `<text x="${P[0]}" y="${P[1] + 5}" text-anchor="middle" class="${cls || 't6-sv'}">${t}</text>`; });
  (o.handles ? p : []).forEach((P, i) => { s += `<circle class="t6-h drag" data-i="${i}" cx="${P[0]}" cy="${P[1]}" r="11" fill="#7E6ED6" fill-opacity=".85" stroke="#fff" stroke-width="2.4"/>`; });
  return s + (o.extra || '') + '</svg>';
}
/* draggable polygon board */
function polyBoard(p0, o) {
  let p = p0.map(q => q.slice()), drag = null; const box = h('div', { class: 't6-board ia' }), W = o.W || 400, H = o.H || 270, g = 10;
  const draw = () => { const r = o.render(p); box.innerHTML = polySVG(p, { W, H, handles: true, grid: o.showGrid ? 20 : 0, ...r }); o.onChange && o.onChange(p, { raw: k7raw(p), A: k7round(k7raw(p)) }); };
  const pt = e => { const svg = box.querySelector('svg'), m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m); return [Math.round(Math.max(14, Math.min(W - 14, r.x)) / g) * g, Math.round(Math.max(14, Math.min(H - 14, r.y)) / g) * g]; };
  box.addEventListener('pointerdown', e => { const hd = e.target.closest('.t6-h'); if (!hd) return; e.preventDefault(); drag = +hd.dataset.i; try { box.setPointerCapture(e.pointerId); } catch (_) { } });
  box.addEventListener('pointermove', e => { if (drag == null) return; const q = pt(e), np = p.map((v, i) => i === drag ? q : v); if (Math.abs(k7area2(np)) < 3000 || !k7simple(np)) return; p = np; draw(); });
  box.addEventListener('pointerup', () => { if (drag != null) sfx.tap(); drag = null; });
  box.set = np => { p = np.map(q => q.slice()); draw(); }; box.get = () => p; box.redraw = draw;
  draw(); return box;
}
const k7walk = (text, rows, fin, say) => { const el = dcWalk('', rows, fin, say); el.prepend(h('div', { class: 'storybox', html: text })); return el; };
const k7mini = (svgInner, vb = '0 0 120 90') => `<svg viewBox="${vb}" class="k7-mini" aria-hidden="true">${svgInner}</svg>`;
const k7path = (pts, fill = '#CFE6FF') => `<path d="M${pts.join(' L')} Z" fill="${fill}" stroke="#2B2550" stroke-width="2.6" stroke-linejoin="round"/>`;

/* ---------- polygon maker: number of sides + drag ---------- */
function simPolyMake() {
  let n = 5; const out = fNote(), tag = h('div', { class: 't6-tags' });
  const brd = polyBoard(k7reg(5), { render: p => { const L = p.map((q, i) => Math.hypot(...k7sub(p[(i + 1) % p.length], q))), eq = Math.max(...L) - Math.min(...L) < 2; return { names: p.map((_, i) => 'ABCDEFGHIJ'[i]), ticks: eq ? p.map(() => 1) : null }; },
    onChange: (p, inf) => { const L = p.map((q, i) => Math.hypot(...k7sub(p[(i + 1) % p.length], q))), eqS = Math.max(...L) - Math.min(...L) < 2, eqA = Math.max(...inf.raw) - Math.min(...inf.raw) < 1.2, cc = inf.raw.some(a => a > 180);
      tag.innerHTML = `<span class="t6-tag a">${K7N(p.length)}</span>` + (eqS && eqA ? '<span class="t6-tag s">ด้านเท่ามุมเท่า</span>' : '') + (cc ? '<span class="t6-tag c">มีมุมเว้าเข้าไป</span>' : '');
      out.innerHTML = `มีด้าน <b>${p.length}</b> ด้าน · มีมุม <b>${p.length}</b> มุม · มีจุดยอด <b>${p.length}</b> จุด — ทุกด้านเป็น<b>ส่วนของเส้นตรง</b> และเป็น<b>รูปปิด</b>`; } });
  const st = stepper('จำนวนด้าน', () => n, x => n = x, () => 3, () => 10, () => brd.set(k7reg(n)));
  return h('div', { class: 'colstack' }, tag, brd, h('div', { class: 'cap' }, 'เปลี่ยนจำนวนด้าน · ลากจุดสีม่วงให้รูปบิดหรือเว้าได้'), st, out);
}
/* ---------- is it a polygon? tap each card ---------- */
const K7_CARDS = [
  { s: k7mini(k7path([[60, 10], [105, 42], [88, 82], [32, 82], [15, 42]])), ok: 1, why: 'รูปปิด ทุกด้านเป็นส่วนของเส้นตรง → รูปห้าเหลี่ยม' },
  { s: k7mini('<path d="M20 75 L20 25 L70 25 A30 25 0 0 1 70 75 Z" fill="#CFE6FF" stroke="#2B2550" stroke-width="2.6"/>'), ok: 0, why: 'มี<b>เส้นโค้ง</b>เป็นส่วนประกอบ' },
  { s: k7mini('<path d="M20 70 L45 20 L75 70 L100 20" fill="none" stroke="#2B2550" stroke-width="2.6" stroke-linejoin="round"/>'), ok: 0, why: 'ไม่ใช่<b>รูปปิด</b>' },
  { s: k7mini(k7path(k7reg(10, { cx: 60, cy: 47, r: 42, jit: [1, .48] }))), ok: 1, why: 'รูปปิด ด้านตรง 10 ด้าน → รูปสิบเหลี่ยม (รูปดาว)' },
  { s: k7mini('<ellipse cx="60" cy="46" rx="44" ry="32" fill="#CFE6FF" stroke="#2B2550" stroke-width="2.6"/>'), ok: 0, why: 'วงรีมีแต่<b>เส้นโค้ง</b>' },
  { s: k7mini(k7path([[15, 20], [70, 20], [105, 46], [70, 72], [15, 72], [45, 46]])), ok: 1, why: 'รูปปิด ด้านตรง 6 ด้าน → รูปหกเหลี่ยม' }];
function simIsPoly() {
  const out = fNote(), wrap = h('div', { class: 'k7-cards' }), w8 = h6wait(); let left = K7_CARDS.length;
  K7_CARDS.forEach(c => { const b = h('button', { class: 'k7-card ia', html: c.s + '<span class="k7-q">?</span>', onclick: e => { e.stopPropagation(); if (b.dataset.on) return; b.dataset.on = 1; b.classList.add(c.ok ? 'yes' : 'no'); b.querySelector('.k7-q').innerHTML = c.ok ? '✓ เป็น' : '✗ ไม่เป็น'; out.innerHTML = c.why; c.ok ? sfx.ok() : sfx.pop(2); if (--left === 0) { out.innerHTML += ' · ครบแล้ว!'; teachDone(wrap); } } }); wrap.append(b); });
  return h('div', { class: 'colstack' }, w8, h('div', { class: 'cap' }, 'แตะแต่ละรูป: เป็นรูปหลายเหลี่ยมหรือไม่'), wrap, out);
}
/* ---------- interior angles: drag, angles measured live, sum stays ---------- */
function simAngles7() {
  let n = 5; const out = fNote(), big = h('div', { class: 'fbig t6-ar' }), mk = k => k7reg(k, { jit: K7J, rot: -80 });
  const brd = polyBoard(mk(5), { render: p => ({ angles: p.map(() => true), arcs: true }), onChange: (p, inf) => { big.innerHTML = `${inf.A.join(' + ')} = <b>${(p.length - 2) * 180}°</b>`; out.innerHTML = `ลากจุดอย่างไร ผลบวกของมุมภายใน${K7N(p.length)}ก็ยังเป็น <b>${(p.length - 2) * 180}°</b>${inf.raw.some(a => a > 180) ? ' (มุมที่เว้าเข้าไปมีขนาดมากกว่า 180°)' : ''}`; } });
  return h('div', { class: 'colstack' }, brd, big, stepper('จำนวนด้าน', () => n, x => n = x, () => 4, () => 7, () => brd.set(mk(n))), out);
}
/* ---------- split into triangles from one vertex ---------- */
function simFan() {
  let n = 6, v = 0; const fig = h('div', { class: 't6-board' }), out = fNote(), big = h('div', { class: 'fbig t6-ar' });
  const draw = () => { const p = k7reg(n, { jit: [1, .92, .97, .9], rot: -90 + 180 / n }), tris = []; for (let k = 1; k < n - 1; k++) tris.push([v, (v + k) % n, (v + k + 1) % n]);
    fig.innerHTML = polySVG(p, { W: 400, H: 270, tris, triNums: true, names: p.map((_, i) => 'ABCDEFGHIJ'[i]) });
    big.innerHTML = `${n - 2} × 180° = <b>${(n - 2) * 180}°</b>`;
    const each = (n - 2) * 180 / n; out.innerHTML = `${K7N(n)} ลากเส้นทแยงมุมจากจุดยอด ${'ABCDEFGHIJ'[v]} ได้ <b>${n - 3}</b> เส้น แบ่งเป็นรูปสามเหลี่ยม <b>${n - 2}</b> รูป (จำนวนด้าน − 2) · ผลบวกของมุมภายใน = ${n - 2} × 180° = <b>${fmt((n - 2) * 180)}°</b>`; };
  draw(); return h('div', { class: 'colstack' }, fig, big, h('div', { class: 'rowstack' }, stepper('จำนวนด้าน', () => n, x => { n = x; v = 0; }, () => 3, () => 10, draw), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); v = (v + 1) % n; sfx.pop(v); draw(); } }, 'เปลี่ยนจุดยอด')), out);
}
/* ---------- perimeter of an equal-sided polygon, unrolled ---------- */
function simPolyPer() {
  let n = 6, a = 4; const fig = h('div', { class: 't6-board' }), strip = h('div', { class: 't6-line' }), out = fNote(), COL = K7COL;
  const draw = () => { const p = k7reg(n, { r: 40 + a * 8, rot: -90 + 180 / n }); fig.innerHTML = polySVG(p, { W: 400, H: 270, ticks: p.map(() => 1), sides: p.map((_, i) => i === Math.floor(n / 2) ? `${a} ซม.` : null) });
    const tot = n * a, k = 330 / Math.max(tot, 20); let x = 15, s = `<svg viewBox="0 0 360 60" aria-hidden="true">`;
    for (let i = 0; i < n; i++) { s += `<path d="M${x} 24 h${a * k - 2}" stroke="${COL[i % COL.length]}" stroke-width="8" stroke-linecap="round"/>`; x += a * k; }
    strip.innerHTML = s + `<text x="15" y="50" class="t6-sv">${n} ด้าน × ${a} ซม. = ${tot} ซม.</text></svg>`; out.innerHTML = `${K7N(n)}ด้านเท่า: ความยาวรอบรูป = จำนวนด้าน × ความยาวด้าน = <b>${tot} ซม.</b>`; };
  draw(); return h('div', { class: 'colstack' }, fig, strip, h('div', { class: 'rowstack' }, stepper('จำนวนด้าน', () => n, x => n = x, () => 3, () => 10, draw), stepper('ยาวด้านละ (ซม.)', () => a, x => a = x, () => 1, () => 8, draw)), out);
}
/* ---------- trapezoid: two copies make a parallelogram ---------- */
function simTrap() {
  let a = 4, b = 8, hh = 4, two = false; const off = 1.5, fig = h('div', { class: 't6-board' }), big = h('div', { class: 'fbig t6-ar' }), out = fNote();
  const draw = () => { const P = [[0, 0], [b, 0], [off + a, hh], [off, hh]], M = [(b + off + a) / 2, hh / 2], Q = P.map(q => [2 * M[0] - q[0], 2 * M[1] - q[1]]), U = Math.min(24, 360 / (b + off + a + .01));
    fig.innerHTML = polySVG(P, { W: 420, H: 230, fit: true, k: U, fitPts: two ? Q : [[b + off + a, hh]], fill: '#7EDDB8', grid: 0, par: { 0: 1, 2: 1 }, sides: { 0: `${b} ซม.`, 2: `${a} ซม.` },
      polys: two ? [{ pts: Q, fill: '#FF9AA5', op: .5, dash: true }] : [], segs: [{ a: [off, hh], b: [off, 0], label: `สูง ${hh}`, off: -26 }], rms: [[[off, hh], [off, 0], [b, 0]]],
      texts: two ? [[[(b + off + a) / 2, hh + 0.8], `ฐานรวม ${a} + ${b} = ${a + b} ซม.`]] : [] });
    big.innerHTML = `${fqHTML(1, 2)} × (${a} + ${b}) × ${hh} = <b>${(a + b) * hh / 2}</b> ตร.ซม.`;
    out.innerHTML = two ? `สองรูปต่อกันเป็นรูปสี่เหลี่ยมด้านขนาน ฐาน ${a + b} สูง ${hh} → ${(a + b) * hh} ตร.ซม. · รูปคางหมู 1 รูป = <b>ครึ่งหนึ่ง</b>` : 'ด้านคู่ขนาน (ลูกศร) ยาว a และ b · ส่วนสูง = ระยะห่างระหว่างด้านคู่ขนาน'; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); two = true; btn.remove(); sfx.ok(); draw(); } }, icon('right'), 'หมุนอีกรูปมาต่อกัน');
  draw(); return h('div', { class: 'colstack' }, fig, big, btn, h('div', { class: 'rowstack' }, stepper('ด้านบน a', () => a, x => a = x, () => 1, () => 8, draw), stepper('ด้านล่าง b', () => b, x => b = x, () => 3, () => 10, draw), stepper('สูง', () => hh, x => hh = x, () => 2, () => 6, draw)), out);
}
/* ---------- quadrilaterals with perpendicular diagonals (kite / rhombus / square / any) ---------- */
function simDiagQuad(mode = 'kite') {
  let v = 8, u = 6, t = mode === 'kite' ? 3 : 4, s = 3; const fig = h('div', { class: 't6-board' }), big = h('div', { class: 'fbig t6-ar' }), out = fNote(), tag = h('div', { class: 't6-tags' });
  const draw = () => { if (mode === 'kite') s = u / 2; t = Math.min(t, v - 1); s = mode === 'kite' ? u / 2 : Math.min(s, u - 1);
    const Pt = [s, v], Pb = [s, 0], Pl = [0, v - t], Pr = [u, v - t], P = [Pt, Pr, Pb, Pl], O = [s, v - t];
    fig.innerHTML = polySVG(P, { W: 400, H: 280, fit: true, k: 24, fitPts: [[0, 0], [u, v]], fill: '#FF9AA5', fillOp: .6, rightMarks: false, polys: [{ pts: [[0, 0], [u, 0], [u, v], [0, v]], fill: '#FFE7A3', op: .35, dash: true, stroke: '#C98612' }],
      segs: [{ a: Pt, b: Pb, label: `${v}`, off: 14, col: '#3F8BDB' }, { a: Pl, b: Pr, label: `${u}`, off: -14, col: '#1B8862' }], rms: [[Pt, O, Pr]] });
    const kind = t * 2 === v && s * 2 === u ? (u === v ? 'รูปสี่เหลี่ยมจัตุรัส' : 'รูปสี่เหลี่ยมขนมเปียกปูน') : (t * 2 === v || s * 2 === u) ? 'รูปสี่เหลี่ยมรูปว่าว' : 'รูปสี่เหลี่ยมที่เส้นทแยงมุมตั้งฉากกัน';
    tag.innerHTML = `<span class="t6-tag a">${kind}</span>`; big.innerHTML = `${fqHTML(1, 2)} × ${v} × ${u} = <b>${v * u / 2}</b> ตร.ซม.`;
    out.innerHTML = `สี่เหลี่ยมผืนผ้าที่ล้อมรอบ = ${v} × ${u} = ${v * u} ตร.ซม. · รูปที่เส้นทแยงมุมตั้งฉากกันมีพื้นที่<b>ครึ่งหนึ่ง</b> = ½ × ผลคูณของเส้นทแยงมุม — เลื่อนจุดตัด พื้นที่ไม่เปลี่ยน`; };
  const S = [stepper('ทแยง (ตั้ง)', () => v, x => v = x, () => 2, () => 9, draw), stepper('ทแยง (นอน)', () => u, x => u = x, () => 2, () => 10, draw), stepper('จุดตัด ↕', () => t, x => t = x, () => 1, () => v - 1, draw)];
  if (mode !== 'kite') S.push(stepper('จุดตัด ↔', () => s, x => s = x, () => 1, () => u - 1, draw));
  draw(); return h('div', { class: 'colstack' }, tag, fig, big, h('div', { class: 'rowstack' }, ...S), out);
}
/* ---------- any quadrilateral = two triangles on one diagonal ---------- */
function simQuadSplit() {
  let L = 9, h1 = 3, h2 = 4; const fig = h('div', { class: 't6-board' }), big = h('div', { class: 'fbig t6-ar' }), out = fNote();
  const draw = () => { const A = [0, 0], C = [L, 0], B = [L * .62, h1], D = [L * .3, -h2];
    fig.innerHTML = polySVG([A, B, C, D], { W: 420, H: 290, fit: true, k: 26, fitPts: [[0, 6], [12, -6]], names: ['A', 'B', 'C', 'D'], polys: [{ pts: [A, B, C], fill: '#8EC5FA', op: .55 }, { pts: [A, C, D], fill: '#FFD27A', op: .55 }], fillOp: 0, rightMarks: false,
      segs: [{ a: A, b: C, label: `AC ${L}`, off: 14, col: '#2B2550', solid: true, w: 2 }, { a: B, b: [B[0], 0], label: `${h1}`, off: -12 }, { a: D, b: [D[0], 0], label: `${h2}`, off: 12, col: '#C98612' }], rms: [[B, [B[0], 0], C], [D, [D[0], 0], C]] });
    big.innerHTML = `${fqHTML(1, 2)} × ${L} × ${h1} + ${fqHTML(1, 2)} × ${L} × ${h2} = <b>${L * (h1 + h2) / 2}</b>`;
    out.innerHTML = `เส้นทแยงมุม AC แบ่งรูปเป็นสามเหลี่ยม 2 รูปที่มี AC เป็นฐานร่วม → พื้นที่ = ${L * h1 / 2} + ${L * h2 / 2} = <b>${L * (h1 + h2) / 2} ตร.ซม.</b>`; };
  draw(); return h('div', { class: 'colstack' }, fig, big, h('div', { class: 'rowstack' }, stepper('AC', () => L, x => L = x, () => 4, () => 12, draw), stepper('สูงบน', () => h1, x => h1 = x, () => 1, () => 5, draw), stepper('สูงล่าง', () => h2, x => h2 = x, () => 1, () => 5, draw)), out);
}
/* ---------- composite polygon: split three ways, same area ---------- */
function simCompose() {
  const P = [[0, 0], [9, 0], [9, 4], [5, 4], [5, 7], [0, 7]], fig = h('div', { class: 't6-board' }), rows = h('div', { class: 'colstack fstory' }), out = fNote();
  const WAYS = [
    { lab: 'แบ่งแนวนอน', polys: [[[0, 0], [9, 0], [9, 4], [0, 4]], [[0, 4], [5, 4], [5, 7], [0, 7]]], calc: ['9 × 4 = 36', '5 × 3 = 15', '36 + 15 = 51'] },
    { lab: 'แบ่งแนวตั้ง', polys: [[[0, 0], [5, 0], [5, 7], [0, 7]], [[5, 0], [9, 0], [9, 4], [5, 4]]], calc: ['5 × 7 = 35', '4 × 4 = 16', '35 + 16 = 51'] },
    { lab: 'เติมเต็มแล้วลบออก', polys: [[[0, 0], [9, 0], [9, 7], [0, 7]], [[5, 4], [9, 4], [9, 7], [5, 7]]], calc: ['9 × 7 = 63', 'ส่วนที่เติม 4 × 3 = 12', '63 − 12 = 51'], sub: 1 }];
  const draw = w => { fig.innerHTML = polySVG(P, { W: 400, H: 260, fit: true, fillOp: w ? 0 : .55, sides: ['9 ม.', '4 ม.', '4 ม.', '3 ม.', '5 ม.', '7 ม.'], grid: 0,
    polys: w ? w.polys.map((q, i) => ({ pts: q, fill: w.sub && i ? '#FFFFFF' : K7COL[i + 1], op: w.sub && i ? .9 : .6, dash: !!(w.sub && i) })) : [] }); };
  const btns = WAYS.map(w => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.page(); draw(w); rows.innerHTML = ''; w.calc.forEach((c, i) => rows.append(h('div', { class: 'fst-row' }, h('b', null, i < 2 ? `ชิ้นที่ ${i + 1}` : 'รวม'), h('span', null, c + ' ตร.ม.')))); out.innerHTML = `วิธี “${w.lab}” ได้ <b>51 ตร.ม.</b> — ทุกวิธีได้เท่ากัน`; } }, w.lab));
  draw(null); return h('div', { class: 'gside' }, fig, h('div', { class: 'colstack gside-r' }, h('div', { class: 'cap' }, 'เลือกวิธีแบ่งรูป'), h('div', { class: 'rowstack' }, ...btns), rows, out));
}

/* =========================================================
   QUESTION TYPES
   ========================================================= */
const K7_SHAPES = {
  hept: k7reg(7, { r: 95, rot: -90 + 180 / 7 }),
  arrow2: [[0, 3], [3, 0], [3, 1.6], [9, 1.6], [9, 0], [12, 3], [9, 6], [9, 4.4], [3, 4.4], [3, 6]],
  star12: k7reg(12, { r: 100, jit: [1, .58] }),
  step8: [[2, 0], [6, 0], [6, 2], [4, 2], [4, 4], [0, 4], [0, 2], [2, 2]],
  hex: k7reg(6, { r: 95 }), oct: k7reg(8, { r: 100, rot: -90 + 22.5 }), pentI: [[1, 0], [6, 0], [7, 3], [4, 6], [0, 4]],
  arrow6: [[0, 0], [5, 0], [8, 3], [5, 6], [0, 6], [3, 3]], nona: k7reg(9, { r: 100, jit: K7J }), quadC: [[0, 0], [6, 0], [3, 2], [3, 6]]
};
const k7shape = k => { const q = K7_SHAPES[k], unit = q.some(v => v[0] < 20); return polySVG(q, { fit: unit, W: 400, H: 260, fill: '#FFD27A' }); };
Object.assign(Q, {
  k7Is({ fig, kind }) {
    const opts = ['เป็นรูปหลายเหลี่ยม', 'ไม่เป็น เพราะมีเส้นโค้ง', 'ไม่เป็น เพราะไม่ใช่รูปปิด'], right = opts[{ yes: 0, curve: 1, open: 2 }[kind]];
    return { prompt: 'รูปนี้เป็นรูปหลายเหลี่ยมหรือไม่', say: 'รูปนี้เป็นรูปหลายเหลี่ยมหรือไม่', mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, h('div', { class: 't6-board sm', html: fig }), choices(ctx, opts.map(o => ({ value: o, label: o })), right, { hint: 'รูปหลายเหลี่ยม = รูปปิด ทุกด้านเป็นส่วนของเส้นตรง' }))); bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  k7Name({ shape }) {
    const n = K7_SHAPES[shape].length, near = [n - 2, n - 1, n + 1, n + 2].filter(k => K7_TH[k]), opts = shuffle([n, ...shuffle(near).slice(0, 2)]).map(K7N);
    return { __sig: 'k7n ' + shape,  prompt: 'รูปนี้คือรูปอะไร', say: 'รูปนี้คือรูปอะไร', mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, h('div', { class: 't6-board sm', html: k7shape(shape) }), choices(ctx, opts.map(o => ({ value: o, label: o })), K7N(n), { hint: 'นับจำนวนด้าน (หรือจำนวนมุม)' }))); bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  k7Count({ shape, ask = 'ด้าน' }) {
    const n = K7_SHAPES[shape].length;
    return { prompt: `รูปนี้มี${ask}กี่${ask === 'ด้าน' ? 'ด้าน' : 'มุม'}`, say: `รูปนี้มี${ask}กี่${ask === 'ด้าน' ? 'ด้าน' : 'มุม'}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, h('div', { class: 't6-board sm', html: k7shape(shape) }), answerBox(ctx, n, { hint: 'แตะนับทีละด้านรอบรูป จำนวนด้าน = จำนวนมุม' }))); } };
  },
  k7Ang({ fig, a, q = 'หาผลบวกของขนาดของมุมภายในของรูปหลายเหลี่ยม', hint }) {
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, h('div', { class: 't6-board sm', html: fig }), h('div', { class: 'rowstack' }, answerBox(ctx, a, { hint }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'องศา')))); } };
  }
});
/* ---------- figures from the practice (values are labels) ---------- */
const K7F_IS = [
  [polySVG(k7reg(5, { r: 90, jit: K7J }), { fill: '#FFD27A' }), 'yes'],
  [polySVG(K7_SHAPES.arrow6, { fit: true, fill: '#FFD27A' }), 'yes'],
  ['<svg viewBox="0 0 400 260" class="t6-svg"><path d="M110 210 L110 60 L230 60 Q330 80 300 210 Z" fill="#FFD27A" fill-opacity=".55" stroke="#2B2550" stroke-width="2.6"/></svg>', 'curve'],
  ['<svg viewBox="0 0 400 260" class="t6-svg"><path d="M200 225 C80 150 70 50 150 50 C185 50 200 80 200 95 C200 80 215 50 250 50 C330 50 320 150 200 225 Z" fill="#FFD27A" fill-opacity=".55" stroke="#2B2550" stroke-width="2.6"/></svg>', 'curve'],
  ['<svg viewBox="0 0 400 260" class="t6-svg"><path d="M90 200 L130 60 L250 50 L320 140 L250 220" fill="none" stroke="#2B2550" stroke-width="2.6" stroke-linejoin="round"/></svg>', 'open'],
  ['<svg viewBox="0 0 400 260" class="t6-svg"><path d="M200 60 L320 120 L280 220 L120 220 L80 120" fill="none" stroke="#2B2550" stroke-width="2.6" stroke-linejoin="round"/></svg>', 'open']];
const K7F_ANG = [ // 
  { fig: polySVG(k7reg(7, { r: 115, rot: -90 - 180 / 7 }), { angles: [138, 147, 121, 116, 139, 111, 128], arcs: true }), a: 900 },
  { fig: polySVG([[90, 45], [240, 60], [330, 205], [110, 225]], { angles: [79, 128, 72, 81], arcs: true, rightMarks: false }), a: 360 },
  { fig: polySVG([[170, 25], [260, 25], [205, 130], [290, 235], [110, 240], [60, 150]], { angles: [121, 70, 229, 63, 104, 133], arcs: true }), a: 720 },
  { fig: polySVG([[80, 40], [230, 40], [330, 150], [210, 230], [80, 170]], { angles: [90, 138, 81, 104, 127], arcs: true, rightMarks: false }), a: 540 }];
const K7F_MISS = [
  { fig: polySVG([[80, 50], [300, 40], [340, 200], [200, 230], [60, 180]], { angles: [100, 85, 110, 125, '?'], arcs: true, rightMarks: false }), a: 120, hint: '540 − 100 − 85 − 110 − 125' },
  { fig: polySVG([[90, 60], [300, 40], [330, 220], [70, 200]], { angles: [95, 80, '?', 105], arcs: true, rightMarks: false }), a: 80, hint: '360 − 95 − 80 − 105' }];
const K7F_PER = [ // 
  { fig: polySVG([[130, 40], [330, 40], [270, 105], [265, 165], [185, 215], [105, 200], [60, 120], [130, 120]], { sides: ['52.6 ม.', '25.8 ม.', '23.4 ม.', '28.9 ม.', '19.7 ม.', '16 ม.', '21.3 ม.', '18.5 ม.'], rightMarks: false }), a: '206.2', unit: 'ม.' },
  { fig: polySVG([[60, 80], [150, 50], [165, 95], [235, 85], [240, 40], [320, 60], [330, 190], [100, 210]], { sides: ['19.6 วา', '15 วา', '18 วา', '16.5 วา', '28 วา', '47.8 วา', '68 วา', '34 วา'], rightMarks: false }), a: '246.9', unit: 'วา' },
  { fig: polySVG([[150, 30], [215, 40], [230, 150], [300, 165], [255, 235], [185, 235], [130, 210], [110, 190]], { sides: ['25 ม.', '36 ม.', '27.4 ม.', '39 ม.', '22 ม.', '24 ม.', '10.6 ม.', '37.5 ม.'], rightMarks: false }), a: '221.5', unit: 'ม.' },
  { fig: polySVG([[120, 60], [165, 40], [195, 70], [340, 215], [205, 185], [60, 232], [115, 140]], { sides: ['15 ม.', '17 ม.', '45.5 ม.', '41.6 ม.', '38 ม.', '36 ม.', '19.2 ม.'], rightMarks: false }), a: '212.3', unit: 'ม.' },
  { fig: polySVG(k7reg(7, { r: 112, jit: K7J, rot: -60 }), { sides: ['48 มม.', '45 มม.', '28 มม.', '32 มม.', '55.6 มม.', '49 มม.', '34.4 มม.'], rightMarks: false }), a: '292', unit: 'มม.' }];
/* trapezoid figure: bottom b, top a (offset off), height hh, rotation rot° */
function k7trapFig(o) {
  const { a, b, hh, off = 0, rot = 0, lab = {} } = o, r = rot * Math.PI / 180, R = q => [q[0] * Math.cos(r) - q[1] * Math.sin(r), q[0] * Math.sin(r) + q[1] * Math.cos(r)];
  const P = [[0, 0], [b, 0], [off + a, hh], [off, hh]].map(R), hx = o.hAt ?? off + a * .35, H0 = R([hx, hh]), H1 = R([hx, 0]);
  const ext = hx < off ? [{ a: H0, b: P[3], col: '#9790B0', w: 1.6 }] : [];
  return polySVG(P, { fit: true, W: 400, H: 250, names: o.names, sides: [lab.b, lab.r, lab.a, lab.l], par: { 0: 1, 2: 1 }, segs: lab.h ? [...ext, { a: H0, b: H1, label: lab.h, off: -16 }] : [], rms: lab.h ? [[H0, H1, P[1]]] : [], fill: '#7EDDB8' });
}
const K7F_TRAP = [ // 
  { fig: polySVG([[0, 5.5], [8.2, 5.5], [4.8, 0], [0, 0]], { fit: true, W: 400, H: 250, names: ['C', 'A', 'B', 'D'], sides: ['8.2 ซม.', null, '4.8 ซม.', '5.5 ซม.'], fill: '#7EDDB8' }), a: '35.75', unit: 'ตร.ซม.', hint: '½ × (8.2 + 4.8) × 5.5' },
  { fig: k7trapFig({ a: 48, b: 106, hh: 42, off: 4.5, hAt: 0, names: ['ค', 'ง', 'ข', 'ก'], lab: { a: '48 ม.', b: '106 ม.', r: '68 ม.', h: '42 ม.' } }), a: '3234', unit: 'ตร.ม.', hint: '½ × (48 + 106) × 42 (ด้านเอียงไม่ใช้)' },
  { fig: k7trapFig({ a: 5.2, b: 8.4, hh: 3.2, off: 1.2, rot: 170, names: ['ข', 'ก', 'ค', 'ง'], lab: { a: '5.2 ซม.', b: '8.4 ซม.', h: '3.2 ซม.' } }), a: '21.76', unit: 'ตร.ซม.', hint: '½ × (8.4 + 5.2) × 3.2' },
  { fig: k7trapFig({ a: 3.8, b: 6.9, hh: 4.5, off: 1.6, rot: 6, names: ['G', 'R', 'L', 'I'], lab: { a: '3.8 ซม.', b: '6.9 ซม.', h: '4.5 ซม.' } }), a: '24.075', unit: 'ตร.ซม.', hint: '½ × (3.8 + 6.9) × 4.5' }];
/* quadrilateral with perpendicular diagonals: lengths v (vertical), u (horizontal), crossing t from top, s from left */
function k7dqFig(o) {
  const V = 6, U = Math.max(4.4, Math.min(6.4, o.u / o.v * 6)), t = (o.t ?? o.v / 2) / o.v * V, s = (o.s ?? o.u / 2) / o.u * U, { names, lv, lu } = o, P = [[s, V], [U, V - t], [s, 0], [0, V - t]], O = [s, V - t];
  return polySVG(P, { fit: true, W: 400, H: 260, names, rightMarks: false, ticks: o.ticks, fill: o.fill || '#FF9AA5', segs: [{ a: P[0], b: P[2], col: '#3F8BDB' }, { a: P[3], b: P[1], col: '#1B8862' }], rms: [[P[0], O, P[1]]],
    texts: [[[s + .25, (V - t) / 2], lv, 't6-sv k7-l k7-lv'], [[s + (U - s) / 2 + .1, V - t + .45], lu, 't6-sv k7-l k7-lu']].filter(x => x[1]) });
}
const K7F_KITE = [ // 
  { fig: k7dqFig({ v: 108, u: 56, t: 28, names: ['ข', 'ค', 'ก', 'ง'], lv: '108 ม.', lu: '56 ม.' }), a: '3024', unit: 'ตร.ม.', hint: '½ × 108 × 56' },
  { fig: k7dqFig({ v: 84, u: 26, t: 28, names: ['B', 'C', 'D', 'A'], lv: '84 ม.', lu: '26 ม.' }), a: '1092', unit: 'ตร.ม.', hint: '½ × 84 × 26' },
  { fig: k7dqFig({ v: 24, u: 7, t: 8, names: ['Q', 'R', 'S', 'T'], lv: 'QS 24 ซม.', lu: 'RT 7 ซม.' }), a: '84', unit: 'ตร.ซม.', hint: '½ × 24 × 7' },
  { fig: k7dqFig({ v: 52, u: 15, t: 36, names: ['น', 'ท', 'อ', 'ผ'], lv: 'นอ 52 ม.', lu: 'ทผ 15 ม.' }), a: '390', unit: 'ตร.ม.', hint: '½ × 52 × 15' },
  { fig: k7dqFig({ v: 66.9, u: 29.2, t: 8.5, names: ['ค', 'ง', 'ก', 'ข'], lv: 'กจ 58.4 ม. จค 8.5 ม.', lu: 'ขจ = จง 14.6' }), a: '976.74', unit: 'ตร.ม.', hint: 'กค = 58.4 + 8.5 = 66.9 · ขง = 14.6 × 2 = 29.2 → ½ × 66.9 × 29.2' }];
const K7F_RHOM = [ // 
  { fig: k7dqFig({ v: 90, u: 90, names: ['A', 'B', 'C', 'D'], lv: '90 ม.', lu: '', ticks: [1, 1, 1, 1], fill: '#8EC5FA' }), q: 'รูปสี่เหลี่ยมจัตุรัส ABCD มีเส้นทแยงมุมยาว 90 เมตร หาพื้นที่', a: '4050', unit: 'ตร.ม.', hint: '½ × 90 × 90' },
  { fig: k7dqFig({ v: 8, u: 8, names: ['ก', 'ข', 'ค', 'ง'], lv: 'ครึ่งหนึ่ง = 4 ซม.', lu: '', ticks: [1, 1, 1, 1], fill: '#8EC5FA' }), q: 'รูปสี่เหลี่ยมจัตุรัส ครึ่งหนึ่งของเส้นทแยงมุมยาว 4 ซม. หาพื้นที่', a: '32', unit: 'ตร.ซม.', hint: 'เส้นทแยงมุมยาว 8 ซม. → ½ × 8 × 8' },
  { fig: k7dqFig({ v: 25, u: 25, names: ['จ', 'ช', 'ฉ', 'ซ'], lv: '25 วา', lu: '', ticks: [1, 1, 1, 1], fill: '#8EC5FA' }), q: 'สี่เหลี่ยมจัตุรัสรูปหนึ่งมีเส้นทแยงมุมยาว 25 วา จงหาพื้นที่', a: '312.5', unit: 'ตร.วา', hint: '½ × 25 × 25' },
  { fig: k7dqFig({ v: 48, u: 30, names: ['A', 'B', 'C', 'D'], lv: 'BD 48 นิ้ว', lu: 'AC 30 นิ้ว', ticks: [1, 1, 1, 1], fill: '#C4B5FD' }), q: 'รูปสี่เหลี่ยมขนมเปียกปูน ABCD มี BD ยาว 48 นิ้ว AC ยาว 30 นิ้ว หาพื้นที่', a: '720', unit: 'ตร.นิ้ว', hint: '½ × 48 × 30' },
  { fig: k7dqFig({ v: 44, u: 36, names: ['M', 'O', 'P', 'Q'], lv: 'MP 44 ม.', lu: 'OQ 36 ม.', ticks: [1, 1, 1, 1], fill: '#C4B5FD' }), q: 'รูปสี่เหลี่ยมขนมเปียกปูน MOPQ มี MP ยาว 44 เมตร OQ ยาว 36 เมตร หาพื้นที่', a: '792', unit: 'ตร.ม.', hint: '½ × 44 × 36' },
  { fig: k7dqFig({ v: 29, u: 15, names: ['ข', 'ค', 'ง', 'ก'], lv: 'ขง 29 ซม.', lu: 'กค 15 ซม.', ticks: [1, 1, 1, 1], fill: '#C4B5FD' }), q: 'รูปสี่เหลี่ยมขนมเปียกปูน มีเส้นทแยงมุมยาว 15 ซม. และ 29 ซม. หาพื้นที่', a: '217.5', unit: 'ตร.ซม.', hint: '½ × 15 × 29' },
  { fig: k7dqFig({ v: 36, u: 26, names: ['พ', 'ฟ', 'ภ', 'ร'], lv: 'รฟ 36 ม.', lu: 'พภ 26 ม.', ticks: [1, 1, 1, 1], fill: '#C4B5FD' }), q: 'รูปสี่เหลี่ยมขนมเปียกปูน มีเส้นทแยงมุมยาว 26 เมตร และ 36 เมตร หาพื้นที่', a: '468', unit: 'ตร.ม.', hint: '½ × 26 × 36' }];
/* quadrilateral split on diagonal */
function k7splitFig(o) {
  const { L, h1, h2, f1 = .65, f2 = .3, lab } = o, A = [0, 0], C = [L, 0], B = [L * f1, h1], D = [L * f2, -h2];
  return polySVG([A, B, C, D], { fit: true, W: 400, H: 260, names: o.names || ['A', 'B', 'C', 'D'], rightMarks: false, fill: '#FFD27A', segs: [{ a: A, b: C, label: lab[0], col: '#2B2550', w: 2, off: 16 }, { a: B, b: [B[0], 0], label: lab[1], off: -14 }, { a: D, b: [D[0], 0], label: lab[2], off: 14 }], rms: [[B, [B[0], 0], C], [D, [D[0], 0], C]] });
}
const K7F_SPLIT = [
  { fig: k7splitFig({ L: 44, h1: 22, h2: 12, f1: .72, f2: .25, lab: ['AC 44 ซม.', '22 ซม.', '12 ซม.'], names: ['A', 'B', 'C', 'D'] }), a: '748', unit: 'ตร.ซม.', hint: '½ × 44 × 22 + ½ × 44 × 12' },
  { fig: k7splitFig({ L: 18, h1: 8, h2: 6, lab: ['18 ม.', '8 ม.', '6 ม.'], names: ['ก', 'ข', 'ค', 'ง'] }), a: '126', unit: 'ตร.ม.', hint: '½ × 18 × (8 + 6)' },
  { fig: k7splitFig({ L: 26, h1: 8.5, h2: 5, f1: .4, f2: .7, lab: ['26 ซม.', '8.5 ซม.', '5 ซม.'], names: ['P', 'Q', 'R', 'S'] }), a: '175.5', unit: 'ตร.ซม.', hint: '½ × 26 × 8.5 + ½ × 26 × 5' }];
const K7F_COMP = [
  { fig: polySVG([[0, 0], [10, 0], [10, 5], [4, 5], [4, 8], [0, 8]], { fit: true, W: 400, H: 250, fill: '#9BE3E0', sides: ['10 ม.', '5 ม.', '6 ม.', '3 ม.', '4 ม.', '8 ม.'] }), a: '62', unit: 'ตร.ม.', hint: '10 × 5 + 4 × 3' },
  { fig: polySVG([[0, 0], [8, 0], [8, 5], [4, 8], [0, 5]], { fit: true, W: 400, H: 250, fill: '#9BE3E0', sides: ['8 ม.', '5 ม.', null, null, '5 ม.'], segs: [{ a: [4, 8], b: [4, 5], label: '3 ม.', off: -14 }, { a: [0, 5], b: [8, 5], solid: false, col: '#9790B0', w: 1.6 }], rms: [[[4, 8], [4, 5], [8, 5]]] }), a: '52', unit: 'ตร.ม.', hint: '8 × 5 + ½ × 8 × 3' },
  { fig: polySVG([[0, 0], [12, 0], [12, 4], [9, 6], [3, 6], [0, 4]], { fit: true, W: 400, H: 250, fill: '#9BE3E0', sides: ['12 ซม.', '4 ซม.', null, '6 ซม.', null, '4 ซม.'], segs: [{ a: [6, 6], b: [6, 0], label: '6 ซม.', off: -16 }, { a: [0, 4], b: [12, 4], col: '#9790B0', w: 1.6 }] }), a: '66', unit: 'ตร.ซม.', hint: '12 × 4 + ½ × (12 + 6) × 2' },
  { fig: polySVG([[0, 0], [14, 0], [14, 10], [0, 10]], { fit: true, W: 400, H: 250, fill: '#9BE3E0', sides: ['14 ม.', '10 ม.', null, null], over: [{ pts: [[4, 3], [10, 3], [10, 7], [4, 7]], fill: '#FFFFFF' }], texts: [[[7, 5], 'บ่อ 6 × 4 ม.']] }), q: 'หาพื้นที่ส่วนที่ระบายสี (ไม่รวมบ่อ)', a: '116', unit: 'ตร.ม.', hint: '14 × 10 − 6 × 4' }];
const K7S = [ // โจทย์เพิ่มเติม
  D6S('กายวิ่งรอบสนามรูปห้าเหลี่ยมด้านเท่า ยาวด้านละ 12 เมตร ทั้งหมด 12 รอบ กายวิ่งได้ระยะทางทั้งหมดกี่เมตร', '5 × 12 × 12', ['5 × 12', '12 × 12'], 'เมตร'),
  D6S('สนามบาสเกตบอลรูปสี่เหลี่ยมผืนผ้ายาว 20 เมตร กว้าง 16 เมตร ติดไฟประดับรอบสนาม 4 รอบ ต้องใช้ไฟประดับยาวกี่เมตร', '(16 + 20) × 2 × 4', ['(16 + 20) × 2', '16 × 20 × 4'], 'เมตร'),
  D6S('สร้างทางเดินรอบอาคารรูปสี่เหลี่ยมผืนผ้ายาว 30 เมตร กว้าง 20 เมตร 1 รอบ ค่าติดตั้งเมตรละ 150 บาท ค่าติดตั้งทั้งหมดกี่บาท', '(30 + 20) × 2 × 150', ['30 × 20 × 150', '(30 + 20) × 150'], 'บาท'),
  D6S('ล้อมรั้วสวนรูปหกเหลี่ยมด้านเท่า ยาวด้านละ 8.5 เมตร เว้นประตูกว้าง 2 เมตร ต้องใช้รั้วกี่เมตร', '6 × 8.5 − 2', ['6 × 8.5', '6 × 8.5 + 2'], 'เมตร'),
  D6S('ป้ายรูปแปดเหลี่ยมด้านเท่า ยาวด้านละ 35 เซนติเมตร ติดเทปรอบป้าย 4 ป้าย ใช้เทปกี่เซนติเมตร', '8 × 35 × 4', ['8 × 35', '8 + 35 × 4'], 'เซนติเมตร'),
  D6S('สนามเด็กเล่นรูปสี่เหลี่ยมคางหมู ด้านคู่ขนานยาว 6 เมตร และ 12 เมตร สูง 27 เมตร ปูหญ้าเทียมเต็มสนาม ใช้หญ้าเทียมกี่ตารางเมตร', '1/2 × (6 + 12) × 27', ['(6 + 12) × 27', '6 × 12 × 27'], 'ตารางเมตร'),
  D6S('ลานขายของรูปว่าว เส้นทแยงมุมยาว 7 เมตร และ 14 เมตร ค่าเช่าตารางเมตรละ 1,250 บาท ต่อเดือน ป้านิดจ่ายค่าเช่า 1 เดือนกี่บาท', '1/2 × 7 × 14 × 1250', ['7 × 14 × 1250', '1/2 × 7 × 14'], 'บาท'),
  D6S('แปลงผักรูปสี่เหลี่ยมคางหมู ด้านคู่ขนานยาว 9 เมตร และ 15 เมตร สูง 8 เมตร ปลูกผักตารางเมตรละ 4 ต้น ปลูกได้กี่ต้น', '1/2 × (9 + 15) × 8 × 4', ['(9 + 15) × 8 × 4', '1/2 × 9 × 15 × 4'], 'ต้น'),
  D6S('ว่าวมีเส้นทแยงมุมยาว 60 เซนติเมตร และ 45 เซนติเมตร ใช้กระดาษกี่ตารางเซนติเมตร', '1/2 × 60 × 45', ['60 × 45', '60 + 45'], 'ตารางเซนติเมตร'),
  D6S('แผ่นกระจกรูปสี่เหลี่ยมขนมเปียกปูนมีเส้นทแยงมุมยาว 1.2 เมตร และ 0.8 เมตร ราคาตารางเมตรละ 950 บาท กระจกแผ่นนี้ราคากี่บาท', '1/2 × 1.2 × 0.8 × 950', ['1.2 × 0.8 × 950', '(1.2 + 0.8) × 950'], 'บาท'),
  D6S('ปูกระเบื้องสี่เหลี่ยมจัตุรัสยาวด้านละ 20 เซนติเมตร บนลานยาว 8 เมตร (800 ซม.) กว้าง 6 เมตร (600 ซม.) ต้องใช้กระเบื้องกี่แผ่น', '800 × 600 ÷ (20 × 20)', ['800 × 600 ÷ 20', '8 × 6 ÷ 20'], 'แผ่น'),
  D6S('ลานรูปสี่เหลี่ยมผืนผ้ายาว 15 เมตร กว้าง 10 เมตร ตรงกลางมีบ่อรูปสี่เหลี่ยมจัตุรัสยาวด้านละ 2 เมตร ปูหญ้าส่วนที่เหลือได้กี่ตารางเมตร', '15 × 10 − 2 × 2', ['15 × 10 − 2', '15 × 10 + 2 × 2'], 'ตารางเมตร'),
  D6S('ผนังรูปห้าเหลี่ยม ส่วนล่างเป็นสี่เหลี่ยมผืนผ้ากว้าง 8 ม. สูง 3 ม. ส่วนบนเป็นสามเหลี่ยมฐาน 8 ม. สูง 2 ม. ทาสีตารางเมตรละ 60 บาท ค่าทาสีกี่บาท', '(8 × 3 + 1/2 × 8 × 2) × 60', ['(8 × 3 + 8 × 2) × 60', '8 × 3 × 60'], 'บาท'),
  D6S('ที่ดินรูปสี่เหลี่ยม มีเส้นทแยงมุมยาว 40 เมตร ส่วนสูงของรูปสามเหลี่ยมสองรูปที่ตั้งฉากกับเส้นทแยงมุมนี้ยาว 12 เมตร และ 18 เมตร ที่ดินมีพื้นที่กี่ตารางเมตร', '1/2 × 40 × (12 + 18)', ['40 × (12 + 18)', '1/2 × 40 × 12'], 'ตารางเมตร'),
  D6S('สวนรูปว่าว เส้นทแยงมุมยาว 30 เมตร และ 16 เมตร ใส่ปุ๋ยตารางเมตรละ 2 กิโลกรัม ต้องใช้ปุ๋ยกี่กิโลกรัม', '1/2 × 30 × 16 × 2', ['30 × 16 × 2', '1/2 × 30 × 16'], 'กิโลกรัม')];
const k7num = (o, q = 'หาพื้นที่ของรูป') => Q.t6Num({ fig: o.fig, q: o.q || q, a: o.a, unit: o.unit, hint: o.hint });

/* =========================================================
   LEVELS 821–832
   ========================================================= */
const L6K = (no, place, title, short, goal, teach, game) => ({ id: 820 + no, place, title, short, tone: TONES5[(no + 2) % 6], goal, teach, game });
const LESSONS_P6C7 = [
  L6K(1, 'ลานหลายเหลี่ยม', 'ลักษณะของรูปหลายเหลี่ยม', 'ลักษณะรูปหลายเหลี่ยม', 'บอกลักษณะของรูปหลายเหลี่ยม (รูปปิด ทุกด้านเป็นส่วนของเส้นตรง) เรียกชื่อตามจำนวนด้าน และบอกจำนวนด้าน มุม จุดยอด', [
    T('ยินดีต้อนรับสู่ <b>ภูเขาหลายเหลี่ยม</b>! เปลี่ยนจำนวนด้าน และ<b>ลากจุดสีม่วง</b> — ชื่อรูปเปลี่ยนตามจำนวนด้าน', 'ยินดีต้อนรับสู่ภูเขาหลายเหลี่ยม เปลี่ยนจำนวนด้าน และลากจุดสีม่วง ชื่อรูปเปลี่ยนตามจำนวนด้าน', el => el.append(simPolyMake())),
    T('รูปไหน<b>เป็น</b>รูปหลายเหลี่ยม? แตะให้ครบทุกรูป', 'รูปไหนเป็นรูปหลายเหลี่ยม แตะให้ครบทุกรูป', el => el.append(simIsPoly())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['① รูปปิด', 'เส้นรอบรูปต้องบรรจบกัน ไม่มีช่องเปิด'], ['② ด้านตรง', 'ทุกด้านเป็นส่วนของเส้นตรง ไม่มีเส้นโค้ง'], ['③ เรียกชื่อ', 'นับจำนวนด้าน: 5 ด้าน → รูปห้าเหลี่ยม · 8 ด้าน → รูปแปดเหลี่ยม'], ['④ ด้านเท่ามุมเท่า', 'ทุกด้านยาวเท่ากัน และทุกมุมเท่ากัน เช่น รูปหกเหลี่ยมด้านเท่ามุมเท่า']], 'จำนวนด้าน = จำนวนมุม = จำนวนจุดยอด', 'จำนวนด้านเท่ากับจำนวนมุมเท่ากับจำนวนจุดยอด')))],
    () => [...pkF(K7F_IS, 3).map(([fig, kind]) => Q.k7Is({ fig, kind })), ...pkF(['hept', 'arrow2', 'star12', 'step8', 'oct', 'pentI'], 2).map(shape => Q.k7Name({ shape })), Q.k7Count({ shape: pick(['arrow2', 'star12', 'step8']) })]),
  L6K(2, 'จุดวัดมุมภูเขา', 'มุมภายในของรูปหลายเหลี่ยมโดยใช้การวัดขนาดของมุม', 'มุมภายใน (วัด)', 'วัดขนาดของมุมภายในของรูปหลายเหลี่ยมและหาผลบวก — สังเกตว่าผลบวกคงที่ตามจำนวนด้าน', [
    T('ลากจุดสีม่วง — มุมภายในถูกวัดให้ทันที ผลบวกเปลี่ยนไหม?', 'ลากจุดสีม่วง มุมภายในถูกวัดให้ทันที ผลบวกเปลี่ยนไหม', el => el.append(simAngles7())),
    T('ตัวอย่างทีละขั้น: รวมมุมที่วัดได้', 'ตัวอย่างทีละขั้น รวมมุมที่วัดได้', el => el.append(k7walk('รูปหกเหลี่ยมวัดมุมได้ 130°, 115°, 120°, 125°, 105°, 125°', [['① บวกทีละคู่', '130 + 115 = 245 · 120 + 125 = 245 · 105 + 125 = 230'], ['② รวม', '245 + 245 + 230 = 720'], ['③ สังเกต', 'รูปหกเหลี่ยมทุกรูปมีผลบวกของมุมภายใน 720°']], 'ผลบวก = <b>720°</b>', 'ผลบวกเจ็ดร้อยยี่สิบองศา')))],
    () => [...K7F_ANG.map(o => Q.k7Ang({ fig: o.fig, a: o.a, hint: 'บวกขนาดของมุมทุกมุม' })), ...K7F_MISS.map(o => Q.k7Ang({ fig: o.fig, a: o.a, q: 'หาขนาดของมุมที่ไม่ทราบค่า', hint: o.hint }))]),
  L6K(3, 'หน้าผาสามเหลี่ยมซ้อน', 'การหาผลบวกของขนาดของมุมภายในของรูปหลายเหลี่ยมโดยใช้ขนาดของมุมภายในของรูปสามเหลี่ยม', 'มุมภายใน (แบ่งสามเหลี่ยม)', 'หาผลบวกของมุมภายในโดยแบ่งเป็นรูปสามเหลี่ยม: (จำนวนด้าน − 2) × 180° และหามุมแต่ละมุมของรูปหลายเหลี่ยมด้านเท่ามุมเท่า', [
    T('ลากเส้นทแยงมุมจากจุดยอดเดียว — นับรูปสามเหลี่ยม', 'ลากเส้นทแยงมุมจากจุดยอดเดียว นับรูปสามเหลี่ยม', el => el.append(simFan())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['รูปสี่เหลี่ยม', '2 รูปสามเหลี่ยม → 2 × 180° = 360°'], ['รูปห้าเหลี่ยม', '3 รูปสามเหลี่ยม → 3 × 180° = 540°'], ['รูปเก้าเหลี่ยม', '9 − 2 = 7 รูป → 7 × 180° = 1,260°'], ['ด้านเท่ามุมเท่า', 'รูปเก้าเหลี่ยมด้านเท่ามุมเท่า แต่ละมุม = 1,260 ÷ 9 = 140°']], 'ผลบวก = (จำนวนด้าน − 2) × 180°', 'ผลบวกเท่ากับจำนวนด้านลบสอง คูณร้อยแปดสิบองศา')))],
    () => [Q.hNum({ q: 'รูปแปดเหลี่ยมมีผลบวกของขนาดของมุมภายในกี่องศา', head: '<span class="fsign">?</span> องศา', a: 1080, hint: '(8 − 2) × 180' }),
      Q.hNum({ q: 'รูปสิบเหลี่ยมมีผลบวกของขนาดของมุมภายในกี่องศา', head: '<span class="fsign">?</span> องศา', a: 1440, hint: '(10 − 2) × 180' }),
      Q.hNum({ q: 'รูปหกเหลี่ยมด้านเท่ามุมเท่า มีมุมภายในแต่ละมุมกี่องศา', head: '<span class="fsign">?</span> องศา', a: 120, hint: '720 ÷ 6' }),
      Q.hNum({ q: 'รูปแปดเหลี่ยมด้านเท่ามุมเท่า มีมุมภายในแต่ละมุมกี่องศา', head: '<span class="fsign">?</span> องศา', a: 135, hint: '1,080 ÷ 8' }),
      Q.dPick({ q: 'ลากเส้นทแยงมุมจากจุดยอดเดียวของรูปเจ็ดเหลี่ยม จะแบ่งเป็นรูปสามเหลี่ยมได้กี่รูป', opts: ['5 รูป', '7 รูป', '4 รูป'], right: '5 รูป', hint: 'จำนวนด้าน − 2' }),
      Q.dPick({ q: 'รูปหลายเหลี่ยมที่มีผลบวกของมุมภายใน 1,800° คือรูปอะไร', opts: ['รูปสิบสองเหลี่ยม', 'รูปสิบเหลี่ยม', 'รูปสิบเอ็ดเหลี่ยม'], right: 'รูปสิบสองเหลี่ยม', hint: '1,800 ÷ 180 = 10 รูปสามเหลี่ยม → 10 + 2 ด้าน' })]),
  L6K(4, 'เส้นทางรอบหลายเหลี่ยม', 'การหาความยาวรอบรูปของรูปหลายเหลี่ยม', 'ความยาวรอบรูป', 'หาความยาวรอบรูปของรูปหลายเหลี่ยม = ผลบวกของความยาวทุกด้าน (ด้านเท่า: จำนวนด้าน × ความยาวด้าน)', [
    T('ปรับจำนวนด้านและความยาว — ดูเส้นรอบรูปถูกคลี่ออก', 'ปรับจำนวนด้านและความยาว ดูเส้นรอบรูปถูกคลี่ออก', el => el.append(simPolyPer())),
    T('ตัวอย่างทีละขั้น: รูปที่ด้านไม่เท่า', 'ตัวอย่างทีละขั้น รูปที่ด้านไม่เท่า', el => el.append(k7walk('รูปห้าเหลี่ยมมีด้านยาว 4.5, 6, 3.8, 5.2 และ 7 ซม.', [['① จับคู่บวกง่าย', '4.5 + 5.2 = 9.7 · 6 + 7 = 13'], ['② บวกที่เหลือ', '9.7 + 13 + 3.8 = 26.5'], ['③ ตรวจ', 'นับด้านครบ 5 ด้าน ✓']], 'ความยาวรอบรูป = <b>26.5 ซม.</b>', 'ยี่สิบหกจุดห้าเซนติเมตร')))],
    () => [...pkF(K7F_PER, 4).map(o => Q.t6Num({ fig: o.fig, q: 'หาความยาวรอบรูปของรูปหลายเหลี่ยม', a: o.a, unit: o.unit, hint: 'บวกความยาวทุกด้าน' })),
      Q.hNum({ q: 'รูปเก้าเหลี่ยมด้านเท่า ยาวด้านละ 14 ซม. มีความยาวรอบรูปกี่เซนติเมตร', head: '<span class="fsign">?</span> ซม.', a: 126, hint: '9 × 14' })]),
  L6K(5, 'ลานคางหมู', 'การหาพื้นที่ของรูปสี่เหลี่ยมคางหมู', 'พื้นที่คางหมู', 'หาพื้นที่รูปสี่เหลี่ยมคางหมู = ½ × ผลบวกความยาวของด้านคู่ขนาน × สูง', [
    T('ปรับด้านคู่ขนานและความสูง แล้ว<b>หมุนอีกรูปมาต่อ</b> — ได้รูปสี่เหลี่ยมด้านขนาน', 'ปรับด้านคู่ขนานและความสูง แล้วหมุนอีกรูปมาต่อ ได้รูปสี่เหลี่ยมด้านขนาน', el => el.append(simTrap())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(k7walk('คางหมูมีด้านคู่ขนานยาว 5 ซม. และ 9 ซม. สูง 4 ซม. ด้านเอียงยาว 4.5 ซม.', [['① หาด้านคู่ขนาน', '5 และ 9 (ด้านเอียง 4.5 ไม่ใช้)'], ['② บวกกัน', '5 + 9 = 14'], ['③ คูณสูงแล้วหารสอง', '½ × 14 × 4 = 28']], 'พื้นที่ = <b>28 ตร.ซม.</b>', 'ยี่สิบแปดตารางเซนติเมตร')))],
    () => [Q.dPick({ q: 'รูปสี่เหลี่ยมคางหมูมีด้านคู่ขนานยาว 4.1 ซม. และ 5.9 ซม. สูง 3.5 ซม. ข้อใดหาพื้นที่ได้ถูกต้อง', opts: ['½ × (4.1 + 5.9) × 3.5', '4.1 × 5.9 × 3.5', '(4.1 + 5.9) × 3.5'], right: '½ × (4.1 + 5.9) × 3.5' }),
      Q.dPick({ q: 'ความสูงของรูปสี่เหลี่ยมคางหมู คือข้อใด', opts: ['ระยะห่างระหว่างด้านคู่ขนาน', 'ความยาวของด้านเอียง', 'ความยาวของด้านที่ยาวที่สุด'], right: 'ระยะห่างระหว่างด้านคู่ขนาน' }),
      ...K7F_TRAP.map(o => k7num(o)), Q.t6Num({ q: 'คางหมูมีด้านคู่ขนาน 3.3 ซม. และ 6.3 ซม. สูง 3.8 ซม. มีพื้นที่กี่ตารางเซนติเมตร', a: '18.24', unit: 'ตร.ซม.', hint: '½ × (3.3 + 6.3) × 3.8' })]),
  L6K(6, 'ทุ่งว่าวลม', 'การหาพื้นที่ของรูปสี่เหลี่ยมรูปว่าว', 'พื้นที่รูปว่าว', 'หาพื้นที่รูปว่าว = ½ × ผลคูณของความยาวเส้นทแยงมุม', [
    T('ปรับเส้นทแยงมุมและจุดตัด — รูปว่าวเป็น<b>ครึ่งหนึ่ง</b>ของสี่เหลี่ยมผืนผ้าที่ล้อมรอบเสมอ', 'ปรับเส้นทแยงมุมและจุดตัด รูปว่าวเป็นครึ่งหนึ่งของสี่เหลี่ยมผืนผ้าที่ล้อมรอบเสมอ', el => el.append(simDiagQuad('kite'))),
    T('ตัวอย่างทีละขั้น: ส่วนของเส้นทแยงมุม', 'ตัวอย่างทีละขั้น ส่วนของเส้นทแยงมุม', el => el.append(k7walk('รูปว่าว ABCD: AO = 4 ซม. OC = 10 ซม. BO = OD = 3.5 ซม.', [['① เส้นทแยงมุม AC', '4 + 10 = 14 ซม.'], ['② เส้นทแยงมุม BD', '3.5 × 2 = 7 ซม.'], ['③ พื้นที่', '½ × 14 × 7 = 49']], 'พื้นที่ = <b>49 ตร.ซม.</b>', 'สี่สิบเก้าตารางเซนติเมตร')))],
    () => [...K7F_KITE.map(o => k7num(o, 'หาพื้นที่ของรูปว่าว')), Q.dPick({ q: 'พื้นที่ของรูปว่าว หาได้จากข้อใด', opts: ['½ × ผลคูณของความยาวเส้นทแยงมุม', 'ผลคูณของความยาวเส้นทแยงมุม', 'ผลบวกของความยาวเส้นทแยงมุม'], right: '½ × ผลคูณของความยาวเส้นทแยงมุม' })]),
  L6K(7, 'ลานทแยงตั้งฉาก', 'การหาพื้นที่ของรูปสี่เหลี่ยมที่เส้นทแยงมุมตัดกันเป็นมุมฉาก', 'ทแยงมุมตั้งฉาก', 'หาพื้นที่รูปสี่เหลี่ยมจัตุรัส ขนมเปียกปูน และรูปว่าว ด้วย ½ × ผลคูณของเส้นทแยงมุม', [
    T('เลื่อนจุดตัดทั้งสองแนว — ได้จัตุรัส ขนมเปียกปูน รูปว่าว แต่สูตรเดียวกัน', 'เลื่อนจุดตัดทั้งสองแนว ได้จัตุรัส ขนมเปียกปูน รูปว่าว แต่สูตรเดียวกัน', el => el.append(simDiagQuad('any'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['จัตุรัส', 'เส้นทแยงมุมยาวเท่ากัน 8 ซม. → ½ × 8 × 8 = 32 ตร.ซม.'], ['ขนมเปียกปูน', 'เส้นทแยงมุม 10 และ 6 ซม. → ½ × 10 × 6 = 30 ตร.ซม.'], ['จัตุรัส (ครึ่งเส้นทแยง)', 'ครึ่งหนึ่งยาว 5 ซม. → เส้นทแยงมุม 10 → ½ × 10 × 10 = 50 ตร.ซม.']], 'เส้นทแยงมุมตั้งฉากกัน → พื้นที่ = ½ × ทแยง × ทแยง', 'พื้นที่เท่ากับครึ่งหนึ่งของผลคูณเส้นทแยงมุม')))],
    () => pkF(K7F_RHOM, 6).map(o => k7num(o))),
  L6K(8, 'ฐานแบ่งสามเหลี่ยม', 'การหาพื้นที่ของรูปสี่เหลี่ยมโดยแบ่งเป็นรูปสามเหลี่ยม', 'สี่เหลี่ยม → สามเหลี่ยม', 'หาพื้นที่รูปสี่เหลี่ยมใด ๆ โดยลากเส้นทแยงมุมแบ่งเป็นรูปสามเหลี่ยม 2 รูป แล้วรวมพื้นที่', [
    T('ปรับเส้นทแยงมุมและส่วนสูงทั้งสอง — พื้นที่ = สามเหลี่ยมบน + สามเหลี่ยมล่าง', 'ปรับเส้นทแยงมุมและส่วนสูงทั้งสอง พื้นที่เท่ากับสามเหลี่ยมบนบวกสามเหลี่ยมล่าง', el => el.append(simQuadSplit())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(k7walk('รูปสี่เหลี่ยม PQRS มีเส้นทแยงมุม PR ยาว 18 ซม. ส่วนสูงที่ลากจาก Q และ S มาตั้งฉากกับ PR ยาว 6 ซม. และ 4 ซม.', [['① △PQR', '½ × 18 × 6 = 54'], ['② △PSR', '½ × 18 × 4 = 36'], ['③ รวม', '54 + 36 = 90']], 'พื้นที่ = <b>90 ตร.ซม.</b>', 'เก้าสิบตารางเซนติเมตร')))],
    () => [...K7F_SPLIT.map(o => k7num(o)), k7num(K7F_KITE[4], 'หาพื้นที่ของรูปสี่เหลี่ยม'), Q.dPick({ q: 'ลากเส้นทแยงมุม 1 เส้นในรูปสี่เหลี่ยม จะแบ่งเป็นรูปสามเหลี่ยมได้กี่รูป', opts: ['2 รูป', '3 รูป', '4 รูป'], right: '2 รูป' })]),
  L6K(9, 'หมู่บ้านรูปประกอบ', 'การหาพื้นที่ของรูปหลายเหลี่ยมโดยแบ่งเป็นรูปสามเหลี่ยม หรือรูปสี่เหลี่ยม', 'แบ่งรูปหาพื้นที่', 'หาพื้นที่ของรูปหลายเหลี่ยมโดยแบ่งเป็นรูปสามเหลี่ยมหรือรูปสี่เหลี่ยม หรือเติมให้เต็มแล้วลบออก', [
    T('ลองแบ่งรูปเดียวกัน <b>3 วิธี</b> — ได้พื้นที่เท่ากัน', 'ลองแบ่งรูปเดียวกันสามวิธี ได้พื้นที่เท่ากัน', el => el.append(simCompose())),
    T('ตัวอย่างทีละขั้น: บ้าน = สี่เหลี่ยม + สามเหลี่ยม', 'ตัวอย่างทีละขั้น บ้านเท่ากับสี่เหลี่ยมบวกสามเหลี่ยม', el => el.append(k7walk('ผนังรูปห้าเหลี่ยม: ส่วนล่างกว้าง 6 ม. สูง 4 ม. หลังคาสามเหลี่ยมฐาน 6 ม. สูง 2.5 ม.', [['① สี่เหลี่ยมผืนผ้า', '6 × 4 = 24'], ['② สามเหลี่ยม', '½ × 6 × 2.5 = 7.5'], ['③ รวม', '24 + 7.5 = 31.5']], 'พื้นที่ = <b>31.5 ตร.ม.</b>', 'สามสิบเอ็ดจุดห้าตารางเมตร')))],
    () => [...K7F_COMP.map(o => k7num(o)), Q.dPick({ q: 'รูปตัว L หาพื้นที่โดย “เติมให้เต็มเป็นสี่เหลี่ยมผืนผ้าแล้วลบส่วนที่เติม” ได้หรือไม่', opts: ['ได้ ได้คำตอบเท่ากับการแบ่ง', 'ไม่ได้ ต้องแบ่งเท่านั้น', 'ได้ แต่คำตอบมากกว่าเสมอ'], right: 'ได้ ได้คำตอบเท่ากับการแบ่ง' })]),
  L6K(10, 'ฐานโจทย์รอบรูป', 'การแก้โจทย์ปัญหาเกี่ยวกับความยาวรอบรูปของรูปหลายเหลี่ยม', 'โจทย์รอบรูป', 'แก้โจทย์ปัญหาความยาวรอบรูปของรูปหลายเหลี่ยม เช่น วิ่งหลายรอบ ล้อมรั้ว คิดค่าใช้จ่าย', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('ศาลารูปหกเหลี่ยมด้านเท่า ยาวด้านละ 3.5 เมตร ทำรางน้ำรอบหลังคา ค่าแรงเมตรละ 320 บาท ต้องจ่ายค่าแรงกี่บาท', [{ q: 'หาความยาวรอบรูป', opts: ['6 × 3.5', '6 + 3.5', '3.5 × 3.5'], right: '6 × 3.5', unit: 'เมตร', why: 'หกเหลี่ยมด้านเท่า = 6 ด้านยาวเท่ากัน' }, { q: 'คิดค่าแรง', opts: ['21 × 320', '21 + 320', '320 ÷ 21'], right: '21 × 320', unit: 'บาท', why: 'เมตรละ 320 บาท → คูณ' }], 'ตอบ ค่าแรง <b>6,720</b> บาท'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('ลานรูปห้าเหลี่ยมมีด้านยาว 12, 15, 9, 10 และ 14 เมตร เดินรอบลาน 4 รอบ เดินได้ระยะทางกี่เมตร', [['① รอบรูป', '12 + 15 + 9 + 10 + 14 = 60 เมตร'], ['② 4 รอบ', '60 × 4']], '(12 + 15 + 9 + 10 + 14) × 4')))],
    () => [...[0, 1, 2, 3, 4].map(i => p6st(K7S[i])), ...[ /* v161 เพิ่ม — เกมต้องมี ≥ 8 ข้อไม่ซ้ำ */
      D6S('ลานจอดรถรูปสี่เหลี่ยมผืนผ้ายาว 45 เมตร กว้าง 28 เมตร ล้อมรั้ว 3 ชั้น ต้องใช้รั้วกี่เมตร', '(45 + 28) × 2 × 3', ['45 × 28 × 3', '(45 + 28) × 3'], 'เมตร'),
      D6S('แปลงผักรูปสามเหลี่ยมด้านเท่า ยาวด้านละ 7.5 เมตร ล้อมลวดหนาม 4 รอบ ใช้ลวดหนามกี่เมตร', '3 × 7.5 × 4', ['3 × 7.5', '7.5 × 4'], 'เมตร'),
      D6S('สระว่ายน้ำรูปสี่เหลี่ยมจัตุรัสยาวด้านละ 25 เมตร ปูกระเบื้องขอบสระ ค่าปูเมตรละ 120 บาท ค่าปูทั้งหมดกี่บาท', '4 × 25 × 120', ['25 × 25 × 120', '25 × 120'], 'บาท'),
      D6S('ห้องรูปสี่เหลี่ยมผืนผ้ายาว 6.5 เมตร กว้าง 4 เมตร ติดบัวรอบห้อง เว้นประตูกว้าง 1 เมตร ใช้บัวกี่เมตร', '(6.5 + 4) × 2 − 1', ['(6.5 + 4) × 2', '6.5 × 4 − 1'], 'เมตร')].map(p6st)]),
  L6K(11, 'ฐานโจทย์พื้นที่ 1', 'โจทย์ปัญหาเกี่ยวกับพื้นที่ของรูปหลายเหลี่ยม (ตอนที่ 1)', 'โจทย์พื้นที่ 1', 'แก้โจทย์ปัญหาพื้นที่ของรูปสี่เหลี่ยมคางหมู รูปว่าว และรูปขนมเปียกปูน รวมถึงคิดค่าใช้จ่าย', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('บ่อปลารูปสี่เหลี่ยมคางหมู ด้านคู่ขนานยาว 10 เมตร และ 16 เมตร สูง 7 เมตร ปล่อยปลาตารางเมตรละ 5 ตัว ปล่อยปลาได้กี่ตัว', [{ q: 'หาพื้นที่บ่อ', opts: ['1/2 × (10 + 16) × 7', '(10 + 16) × 7', '10 × 16 × 7'], right: '1/2 × (10 + 16) × 7', unit: 'ตร.ม.', why: 'คางหมู = ½ × ผลบวกด้านคู่ขนาน × สูง' }, { q: 'หาจำนวนปลา', opts: ['91 × 5', '91 + 5', '91 ÷ 5'], right: '91 × 5', unit: 'ตัว', why: 'ตารางเมตรละ 5 ตัว → คูณ' }], 'ตอบ ปล่อยปลาได้ <b>455</b> ตัว'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('ป้ายรูปขนมเปียกปูนมีเส้นทแยงมุมยาว 80 ซม. และ 50 ซม. ทาสีป้ายทั้งสองด้าน ต้องทาสีกี่ตารางเซนติเมตร', [['① พื้นที่ 1 ด้าน', '½ × 80 × 50 = 2,000 ตร.ซม.'], ['② ทา 2 ด้าน', '2,000 × 2']], '1/2 × 80 × 50 × 2')))],
    () => [...[5, 6, 7, 8, 9].map(i => p6st(K7S[i])), ...[D6S('สวนรูปสี่เหลี่ยมคางหมู ด้านคู่ขนานยาว 10 เมตร และ 14 เมตร สูง 6 เมตร สวนมีพื้นที่กี่ตารางเมตร', '1/2 × (10 + 14) × 6', ['(10 + 14) × 6', '1/2 × 10 × 14 × 6'], 'ตารางเมตร'),
      D6S('ป้ายรูปสี่เหลี่ยมขนมเปียกปูน เส้นทแยงมุมยาว 50 เซนติเมตร และ 30 เซนติเมตร ทาสีตารางเซนติเมตรละ 2 บาท ค่าสีกี่บาท', '1/2 × 50 × 30 × 2', ['50 × 30 × 2', '1/2 × 50 × 30 + 2'], 'บาท'),
      D6S('ที่ดินรูปสี่เหลี่ยมคางหมู ด้านคู่ขนานยาว 18 เมตร และ 26 เมตร สูง 12 เมตร ขายตารางเมตรละ 500 บาท ได้เงินกี่บาท', '1/2 × (18 + 26) × 12 × 500', ['(18 + 26) × 12 × 500', '1/2 × 18 × 26 × 500'], 'บาท')].map(o => p6st(o))] /* v134: ≥ 8 ข้อ */),
  L6K(12, 'ยอดเขาหลายเหลี่ยม', 'โจทย์ปัญหาเกี่ยวกับพื้นที่ของรูปหลายเหลี่ยม (ตอนที่ 2)', 'โจทย์พื้นที่ 2', 'แก้โจทย์ปัญหาพื้นที่ของรูปหลายเหลี่ยมที่ต้องแบ่งรูป เติมแล้วลบ หรือหาจำนวนกระเบื้อง', [
    T('วางแผนทีละขั้น: หาจำนวนกระเบื้อง', 'วางแผนทีละขั้น หาจำนวนกระเบื้อง', el => el.append(simStepPick('ระเบียงรูปสี่เหลี่ยมผืนผ้ากว้าง 300 ซม. ยาว 450 ซม. ปูกระเบื้องสี่เหลี่ยมจัตุรัสยาวด้านละ 30 ซม. ต้องใช้กระเบื้องกี่แผ่น', [{ q: 'พื้นที่ห้อง', opts: ['300 × 450', '300 + 450', '(300 + 450) × 2'], right: '300 × 450', unit: 'ตร.ซม.', why: 'สี่เหลี่ยมผืนผ้า = กว้าง × ยาว' }, { q: 'พื้นที่กระเบื้อง 1 แผ่น', opts: ['30 × 30', '30 × 4', '30 + 30'], right: '30 × 30', unit: 'ตร.ซม.', why: 'จัตุรัส = ด้าน × ด้าน' }, { q: 'จำนวนแผ่น', opts: ['135000 ÷ 900', '135000 × 900', '135000 − 900'], right: '135000 ÷ 900', unit: 'แผ่น', why: 'พื้นที่ห้อง ÷ พื้นที่ 1 แผ่น' }], 'ตอบ ใช้กระเบื้อง <b>150</b> แผ่น'))),
    T('ตัวอย่างทีละขั้น: เติมแล้วลบ', 'ตัวอย่างทีละขั้น เติมแล้วลบ', el => el.append(dcStory('แผ่นไม้รูปสี่เหลี่ยมจัตุรัสยาวด้านละ 9 เมตร ตัดมุมทั้งสี่ออกเป็นสามเหลี่ยมมุมฉากที่มีด้านประกอบมุมฉากยาว 2 เมตร ได้รูปแปดเหลี่ยม มีพื้นที่กี่ตารางเมตร', [['① จัตุรัสเต็ม', '9 × 9 = 81'], ['② มุมที่ตัด 4 มุม', '4 × ½ × 2 × 2 = 8'], ['③ ลบออก', '81 − 8']], '9 × 9 − 4 × 1/2 × 2 × 2')))],
    () => [...[10, 11, 12, 13, 14].map(i => p6st(K7S[i])), ...[D6S('ลานรูปสี่เหลี่ยมผืนผ้ายาว 12 เมตร กว้าง 8 เมตร มีแปลงดอกไม้รูปสามเหลี่ยมฐาน 4 เมตร สูง 3 เมตร อยู่บนลาน พื้นที่ส่วนที่ไม่ใช่แปลงดอกไม้มีกี่ตารางเมตร', '12 × 8 − 1/2 × 4 × 3', ['12 × 8 + 1/2 × 4 × 3', '12 × 8 − 4 × 3'], 'ตารางเมตร'),
      D6S('ปูกระเบื้องสี่เหลี่ยมจัตุรัสยาวด้านละ 50 เซนติเมตร บนพื้นห้องยาว 5 เมตร (500 ซม.) กว้าง 4 เมตร (400 ซม.) ต้องใช้กระเบื้องกี่แผ่น', '(500 × 400) ÷ (50 × 50)', ['500 × 400 ÷ 50', '(500 + 400) ÷ 50'], 'แผ่น'),
      D6S('รูปหกเหลี่ยมประกอบด้วยสี่เหลี่ยมผืนผ้ากว้าง 6 เมตร ยาว 10 เมตร และรูปสามเหลี่ยม 2 รูป แต่ละรูปฐาน 6 เมตร สูง 4 เมตร รูปหกเหลี่ยมมีพื้นที่กี่ตารางเมตร', '6 × 10 + 2 × (1/2 × 6 × 4)', ['6 × 10 + 1/2 × 6 × 4', '6 × 10 × 2'], 'ตารางเมตร')].map(o => p6st(o))] /* v134: ≥ 8 ข้อ */)
];

/* =========================================================
   BOSS 839 — ข้อสอบท้ายบท แต่งใหม่ทั้งหมด (original items)
   ========================================================= */
const k7o = (svg, say) => ({ html: svg, say });
const K7X = {
  q1: [k7o(k7mini('<rect x="22" y="12" width="76" height="66" rx="16" fill="#AEE2B3" stroke="#2B2550" stroke-width="2.4"/>'), 'รูปสี่เหลี่ยมมุมมน'),
    k7o(k7mini(k7path([[48, 12], [78, 12], [52, 45], [78, 78], [48, 78], [22, 45]], '#FBC02D')), 'รูปลูกศรหักมุม'),
    k7o(k7mini(k7path(k7reg(5, { cx: 60, cy: 48, r: 38 }), '#C39BD3')), 'รูปห้าเหลี่ยม'),
    k7o(k7mini(k7path([[12, 15], [60, 45], [108, 15], [64, 80]], '#F48FB1')), 'รูปสี่เหลี่ยมเว้า')],
  oct8: polySVG(k7reg(8, { r: 105, rot: -67.5 }), { W: 400, H: 250, fill: '#5DB8E8' }),
  non9: polySVG(k7reg(9, { r: 100, cy: 122, rot: -90 }), { W: 400, H: 250, fill: '#A8D820', ticks: Array(9).fill(2), sides: ['14.5 ซม.', null, null, null, null, null, null, null, null] }),
  hex6: polySVG([[0, 3], [2.4, 4.6], [5.2, 3.8], [6, 1.2], [3.6, 0], [0.8, 0.4]], { fit: true, W: 400, H: 240, names: ['A', 'B', 'C', 'D', 'E', 'F'], fill: '#F3F17A', rightMarks: false, sides: ['2.6 ม.', '3.15 ม.', '1.95 ม.', '3.5 ม.', '2.4 ม.', '2.85 ม.'] }),
  trap4: polySVG([[0, 0], [1.5, 3], [5.5, 3], [6.5, 0]], { fit: true, W: 400, H: 230, names: ['A', 'B', 'C', 'D'], fill: '#5FC9B8', sides: ['3.4 ซม.', '4 ซม.', '3.2 ซม.', '6.5 ซม.'], par: { 1: 1, 3: 1 }, segs: [{ a: [4.5, 3], b: [4.5, 0], label: '2.8 ซม.', off: -18 }], rms: [[[4.5, 3], [4.5, 0], [6.5, 0]]] }),
  kite4: polySVG([[3, 6], [5.5, 4.4], [3, 0], [0.5, 4.4]], { fit: true, W: 380, H: 250, names: ['A', 'B', 'C', 'D'], fill: '#F0627E', rightMarks: false, ticks: [2, 1, 1, 2], segs: [{ a: [3, 6], b: [3, 0], col: '#2B2550', w: 1.6 }, { a: [0.5, 4.4], b: [5.5, 4.4], col: '#2B2550', w: 1.6 }] }),
  house5: polySVG([[3, 5], [6, 3], [6, 0], [0, 0], [0, 3]], { fit: true, W: 380, H: 250, names: ['A', 'B', 'C', 'D', 'E'], fill: '#B98ACD', rightMarks: false, segs: [{ a: [0, 3], b: [6, 3], col: '#2B2550', w: 1.6 }] }),
  star10: polySVG(k7reg(10, { r: 110, jit: [1, .42] }), { W: 400, H: 250, fill: '#FFE27A', fillOp: 1 })
};
const EXAM_P6C7 = xrot([
  { q: 'รูปใด<b>ไม่ใช่</b>รูปหลายเหลี่ยม', opts: K7X.q1, a: 0 },
  { q: 'รูปแปดเหลี่ยมด้านเท่ามุมเท่ามีผลบวกของขนาดของมุมภายในเป็น 1,080° มุมภายในแต่ละมุมมีขนาดกี่องศา', fig: K7X.oct8, opts: ['120°', '135°', '140°', '150°'], a: 1 },
  { q: 'รูปหกเหลี่ยม ABCDEF มีความยาวรอบรูปเท่าใด', fig: K7X.hex6, opts: ['15.45 เมตร', '16.45 เมตร', '17.35 เมตร', '16.25 เมตร'], a: 1 },
  { q: 'จากรูป รูปเก้าเหลี่ยมด้านเท่ามีความยาวรอบรูปเท่าใด', fig: K7X.non9, opts: ['116 เซนติเมตร', '130.5 เซนติเมตร', '145 เซนติเมตร', '126.5 เซนติเมตร'], a: 1 },
  { q: 'พื้นที่ของรูปสี่เหลี่ยมคางหมู ABCD (BC // AD) เท่ากับเท่าใด', fig: K7X.trap4, opts: ['14.7 ตารางเซนติเมตร', '29.4 ตารางเซนติเมตร', '18.2 ตารางเซนติเมตร', '12.6 ตารางเซนติเมตร'], a: 0 },
  { q: 'รูปว่าว ABCD มีเส้นทแยงมุม AC ยาว 8 เซนติเมตร และ BD ยาว 5.5 เซนติเมตร มีพื้นที่เท่าใด', fig: K7X.kite4, opts: ['22 ตารางเซนติเมตร', '44 ตารางเซนติเมตร', '13.5 ตารางเซนติเมตร', '27.5 ตารางเซนติเมตร'], a: 0 },
  { q: 'รูปห้าเหลี่ยม ABCDE ประกอบด้วยรูปสามเหลี่ยม ABE ที่มีฐาน BE ยาว 6 เซนติเมตร สูง 2 เซนติเมตร และรูปสี่เหลี่ยมผืนผ้า BCDE กว้าง 3 เซนติเมตร ยาว 6 เซนติเมตร รูปห้าเหลี่ยมนี้มีพื้นที่เท่าใด', fig: K7X.house5, opts: ['24 ตารางเซนติเมตร', '21 ตารางเซนติเมตร', '30 ตารางเซนติเมตร', '27 ตารางเซนติเมตร'], a: 0 },
  { q: 'หลังคาศาลาเป็นรูปหกเหลี่ยมด้านเท่า ยาวด้านละ 3.2 เมตร ต้องการติดไฟประดับรอบหลังคา ไฟประดับราคาเมตรละ 45 บาท ต้องจ่ายเงินกี่บาท', opts: ['864 บาท', '720 บาท', '144 บาท', '960 บาท'], a: 0 },
  { q: 'ป้ายรูปดาวแต่ละป้ายมี 10 ด้าน ยาวด้านละ 40 เซนติเมตร ต้องการติดแถบไฟรอบป้าย 3 ป้าย ต้องใช้แถบไฟยาวกี่เมตร', fig: K7X.star10, opts: ['12 เมตร', '4 เมตร', '120 เมตร', '6 เมตร'], a: 0 },
  { q: 'ลานรูปสี่เหลี่ยมจัตุรัสยาวด้านละ 12 เมตร ตรงกลางมีบ่อน้ำรูปสี่เหลี่ยมจัตุรัสยาวด้านละ 4 เมตร ต้องการปูหญ้าส่วนที่เหลือ ค่าปูหญ้าตารางเมตรละ 60 บาท เสียเงินกี่บาท', opts: ['7,680 บาท', '8,640 บาท', '960 บาท', '7,860 บาท'], a: 0 },
  { q: 'รูปหกเหลี่ยมใด ๆ มีผลบวกของขนาดของมุมภายในเท่าใด', opts: ['540°', '720°', '900°', '1,080°'], a: 1 },
  { q: 'รูปสิบเหลี่ยมด้านเท่ามุมเท่า มีมุมภายในแต่ละมุมกี่องศา', opts: ['144°', '150°', '1,440°', '36°'], a: 0 },
  { q: 'รูปห้าเหลี่ยมมีด้านยาว 18.5 ม. 22 ม. 30.4 ม. 25 ม. และ 27.6 ม. มีความยาวรอบรูปเท่าใด', opts: ['123.5 ม.', '113.5 ม.', '133.5 ม.', '121.5 ม.'], a: 0 },
  { q: 'รูปสี่เหลี่ยมคางหมูมีด้านคู่ขนานยาว 7.5 ซม. และ 10.5 ซม. สูง 4 ซม. มีพื้นที่เท่าใด', opts: ['36 ตร.ซม.', '72 ตร.ซม.', '18 ตร.ซม.', '42 ตร.ซม.'], a: 0 },
  { q: 'รูปสี่เหลี่ยมขนมเปียกปูนมีเส้นทแยงมุมยาว 46 นิ้ว และ 28 นิ้ว มีพื้นที่เท่าใด', opts: ['644 ตร.นิ้ว', '1,288 ตร.นิ้ว', '74 ตร.นิ้ว', '322 ตร.นิ้ว'], a: 0 },
  { q: 'รูปสี่เหลี่ยมจัตุรัสมีเส้นทแยงมุมยาว 18 เมตร มีพื้นที่เท่าใด', opts: ['162 ตร.ม.', '324 ตร.ม.', '72 ตร.ม.', '81 ตร.ม.'], a: 0 },
  { q: 'รูปสี่เหลี่ยม ABCD มีเส้นทแยงมุม AC ยาว 40 ซม. แบ่งรูปเป็นรูปสามเหลี่ยม 2 รูป ส่วนสูงจากจุด B และจุด D ถึง AC ยาว 15 ซม. และ 20 ซม. รูปนี้มีพื้นที่เท่าใด', opts: ['700 ตร.ซม.', '1,400 ตร.ซม.', '350 ตร.ซม.', '600 ตร.ซม.'], a: 0 },
  { q: 'ต้นวิ่งรอบสนามรูปหกเหลี่ยมด้านเท่า ยาวด้านละ 15 เมตร ทั้งหมด 9 รอบ ต้นวิ่งได้ระยะทางทั้งหมดเท่าไร', opts: ['810 เมตร', '720 เมตร', '135 เมตร', '900 เมตร'], a: 0 },
  { q: 'ล้อมรั้วรอบแปลงผักรูปสี่เหลี่ยมผืนผ้ายาว 25 เมตร กว้าง 14 เมตร 1 รอบ ค่ารั้วเมตรละ 120 บาท เสียเงินกี่บาท', opts: ['9,360 บาท', '4,680 บาท', '42,000 บาท', '9,630 บาท'], a: 0 },
  { q: 'ป้ายรูปว่าวมีเส้นทแยงมุมยาว 1.2 เมตร และ 0.8 เมตร ค่าทาสีตารางเมตรละ 150 บาท ถ้าทาสีป้าย 5 ป้าย เสียเงินกี่บาท', opts: ['360 บาท', '720 บาท', '72 บาท', '180 บาท'], a: 0 }
], 1);
LESSONS_P6C7.push({ id: 839, boss: true, place: 'ยอดเขาเยติหลายเหลี่ยม', title: 'ด่านบอส: บทที่ 7 รูปหลายเหลี่ยม', short: 'ด่านบอส · ข้อสอบ', tone: 'jade',
  goal: 'ตอบคำถามเรื่องรูปหลายเหลี่ยม 20 ข้อ ตอบถูก 10 ข้อขึ้นไปเพื่อพิชิตยอดเขา',
  exam: EXAM_P6C7, pass: 10, bossName: 'เยติหลายเหลี่ยม', bossPal: 'jade', emblem: '⬠', bossKind: 'yeti' });
