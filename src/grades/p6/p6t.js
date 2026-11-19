/* =========================================================
   ป.6 บทที่ 6 รูปสามเหลี่ยม (ภาคเรียนที่ 2) — triangle engine (draggable, angles, sides, heights),
   classification, parts, interior angles, constructions, perimeter, area, word problems.
   Levels 801–815 + boss 819
   ========================================================= */
const T6PX = 40; // 40 px = 1 cm
const t6d = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
const t6ang = (P, Q, R) => { const a = [P[0] - Q[0], P[1] - Q[1]], b = [R[0] - Q[0], R[1] - Q[1]]; return Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b))))) * 180 / Math.PI; };
const t6area2 = p => Math.abs((p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[2][0] - p[0][0]) * (p[1][1] - p[0][1]));
/* rounded info: integer angles that sum to 180, side lengths (cm, 1 dp) */
function t6info(p) {
  const raw = [0, 1, 2].map(i => t6ang(p[(i + 2) % 3], p[i], p[(i + 1) % 3])), A = raw.map(Math.round); A[2] = 180 - A[0] - A[1];
  const L = [0, 1, 2].map(k => t6d(p[k], p[(k + 1) % 3]) / T6PX); // side k = p[k]–p[k+1]
  [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => { if (Math.abs(L[i] - L[j]) < .05) L[j] = L[i]; });
  const S = L.map(x => Math.round(x * 10) / 10);
  const byA = raw.some(a => Math.abs(a - 90) < .6) ? 'right' : raw.some(a => a > 90) ? 'obtuse' : 'acute';
  const eq = [S[0] === S[1], S[1] === S[2], S[2] === S[0]], byS = eq.every(Boolean) ? 'equi' : eq.some(Boolean) ? 'iso' : 'scal';
  return { raw, A, S, byA, byS, eq };
}
const T6_A = { acute: 'รูปสามเหลี่ยมมุมแหลม', right: 'รูปสามเหลี่ยมมุมฉาก', obtuse: 'รูปสามเหลี่ยมมุมป้าน' };
const T6_S = { equi: 'รูปสามเหลี่ยมด้านเท่า', iso: 'รูปสามเหลี่ยมหน้าจั่ว', scal: 'รูปสามเหลี่ยมด้านไม่เท่า' };
const T6_AW = { acute: 'มีมุมแหลมทั้ง 3 มุม', right: 'มีมุมฉาก 1 มุม', obtuse: 'มีมุมป้าน 1 มุม' };
const T6_SW = { equi: 'ด้านยาวเท่ากันทั้ง 3 ด้าน', iso: 'มีด้านยาวเท่ากัน 2 ด้าน', scal: 'ด้านยาวไม่เท่ากันเลย' };
/* triangle from base angles B, C: returns [A, B, C] fitted into W×H */
function t6fromAngles(B, C, W = 340, H = 220, pad = 34) {
  const r = Math.PI / 180, Bp = [0, 0], Cp = [1, 0], t = Math.sin(C * r) / Math.sin((180 - B - C) * r), Ap = [t * Math.cos(B * r), t * Math.sin(B * r)];
  const xs = [Ap[0], 0, 1], ys = [Ap[1], 0, 0], mnx = Math.min(...xs), mxx = Math.max(...xs), mxy = Math.max(...ys), k = Math.min((W - 2 * pad) / (mxx - mnx), (H - 2 * pad) / (mxy || 1));
  const f = q => [pad + (q[0] - mnx) * k + ((W - 2 * pad) - (mxx - mnx) * k) / 2, H - pad - q[1] * k];
  return [f(Ap), f(Bp), f(Cp)];
}
const t6foot = (P, A, B) => { const d = [B[0] - A[0], B[1] - A[1]], t = ((P[0] - A[0]) * d[0] + (P[1] - A[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return { F: [A[0] + t * d[0], A[1] + t * d[1]], t }; };
/* SVG of a triangle with optional labels, arcs, ticks, base, height */
function triSVG(p, o = {}) {
  const W = o.W || 360, H = o.H || 240, G = [(p[0][0] + p[1][0] + p[2][0]) / 3, (p[0][1] + p[1][1] + p[2][1]) / 3], inf = t6info(p), C = { a: '#3F8BDB', b: '#E5487A', c: '#1B8862', g: '#C98612' };
  let s = `<svg viewBox="0 0 ${W} ${H}" class="t6-svg" aria-hidden="true">`;
  if (o.grid) { for (let x = 0; x <= W; x += o.grid) s += `<path d="M${x} 0 V${H}" stroke="#E6E1F2" stroke-width="1"/>`; for (let y = 0; y <= H; y += o.grid) s += `<path d="M0 ${y} H${W}" stroke="#E6E1F2" stroke-width="1"/>`; }
  if (o.rect) s += `<rect x="${o.rect[0]}" y="${o.rect[1]}" width="${o.rect[2]}" height="${o.rect[3]}" fill="#FFE7A3" fill-opacity=".45" stroke="#C98612" stroke-width="2" stroke-dasharray="6 4"/>`;
  s += `<path d="M${p[0]} L${p[1]} L${p[2]} Z" fill="${o.fill || '#CFE6FF'}" fill-opacity="${o.fillOp ?? .55}" stroke="#2B2550" stroke-width="2.6" stroke-linejoin="round"/>`;
  if (o.base != null) { const k = o.base; s += `<path d="M${p[k]} L${p[(k + 1) % 3]}" stroke="${C.b}" stroke-width="6" stroke-linecap="round"/>`; }
  (o.hlSides || []).forEach(k => { s += `<path d="M${p[k]} L${p[(k + 1) % 3]}" stroke="${C.c}" stroke-width="5" stroke-linecap="round"/>`; });
  if (o.height) { const { v, k } = o.height, A = p[(k) % 3], B = p[(k + 1) % 3], { F, t } = t6foot(p[v], A, B);
    if (t < 0 || t > 1) s += `<path d="M${t < 0 ? A : B} L${F}" stroke="#7E6ED6" stroke-width="2" stroke-dasharray="5 4"/>`;
    s += `<path d="M${p[v]} L${F}" stroke="#7E6ED6" stroke-width="3" stroke-dasharray="7 5"/>`;
    const u = [(B[0] - A[0]) / t6d(A, B), (B[1] - A[1]) / t6d(A, B)], n = [(p[v][0] - F[0]) / (t6d(p[v], F) || 1), (p[v][1] - F[1]) / (t6d(p[v], F) || 1)], q = 10, sg = t > .5 ? -1 : 1;
    s += `<path d="M${F[0] + sg * u[0] * q} ${F[1] + sg * u[1] * q} l${n[0] * q} ${n[1] * q} l${-sg * u[0] * q} ${-sg * u[1] * q}" fill="none" stroke="#7E6ED6" stroke-width="2"/>`;
    if (o.footName) s += `<text x="${F[0] + (F[0] - G[0]) * .12}" y="${F[1] + 18}" text-anchor="middle" class="t6-n">${o.footName}</text>`;
    if (o.hLabel) s += `<text x="${(p[v][0] + F[0]) / 2 + 8}" y="${(p[v][1] + F[1]) / 2}" class="t6-sv" fill="#7E6ED6">${o.hLabel}</text>`; }
  [0, 1, 2].forEach(i => { const P = p[i], Pa = p[(i + 2) % 3], Pb = p[(i + 1) % 3], a1 = Math.atan2(Pa[1] - P[1], Pa[0] - P[0]), a2 = Math.atan2(Pb[1] - P[1], Pb[0] - P[0]);
    const show = o.angles && o.angles[i] != null && o.angles[i] !== false, rightMark = (o.rightMarks !== false && Math.abs(inf.raw[i] - 90) < .6) || (o.angles && o.angles[i] === 90);
    if (rightMark) { const q = 13, u1 = [Math.cos(a1), Math.sin(a1)], u2 = [Math.cos(a2), Math.sin(a2)]; s += `<path d="M${P[0] + u1[0] * q} ${P[1] + u1[1] * q} l${u2[0] * q} ${u2[1] * q} l${-u1[0] * q} ${-u1[1] * q}" fill="none" stroke="#2B2550" stroke-width="1.8"/>`; }
    else if (show || (o.arcs || []).includes(i)) { const r = 20, sweep = ((a2 - a1 + 2 * Math.PI) % (2 * Math.PI)) > Math.PI ? 0 : 1; s += `<path d="M${P[0] + r * Math.cos(a1)} ${P[1] + r * Math.sin(a1)} A${r} ${r} 0 0 ${sweep} ${P[0] + r * Math.cos(a2)} ${P[1] + r * Math.sin(a2)}" fill="none" stroke="${(o.arcCol && o.arcCol[i]) || C.g}" stroke-width="2.6"/>`; }
    if (show) { let mid = (a1 + a2) / 2; if (Math.abs(a2 - a1) > Math.PI) mid += Math.PI; const t = o.angles[i] === true ? inf.A[i] + '°' : typeof o.angles[i] === 'number' ? o.angles[i] + '°' : o.angles[i];
      s += `<text x="${P[0] + 36 * Math.cos(mid)}" y="${P[1] + 36 * Math.sin(mid) + 5}" text-anchor="middle" class="t6-av">${t}</text>`; }
    if (o.names) { const d = [P[0] - G[0], P[1] - G[1]], L = Math.hypot(...d) || 1; s += `<text x="${P[0] + d[0] / L * 16}" y="${P[1] + d[1] / L * 16 + 5}" text-anchor="middle" class="t6-n${(o.hlV || []).includes(i) ? ' hl' : ''}">${o.names[i]}</text>`; } });
  [0, 1, 2].forEach(k => { const A = p[k], B = p[(k + 1) % 3], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = [M[0] - G[0], M[1] - G[1]], L = Math.hypot(...d) || 1, u = [(B[0] - A[0]) / t6d(A, B), (B[1] - A[1]) / t6d(A, B)];
    const tk = o.ticks ? o.ticks[k] : 0; for (let j = 0; j < tk; j++) { const off = (j - (tk - 1) / 2) * 6, c = [M[0] + u[0] * off, M[1] + u[1] * off]; s += `<path d="M${c[0] - u[1] * 7} ${c[1] + u[0] * 7} L${c[0] + u[1] * 7} ${c[1] - u[0] * 7}" stroke="#2B2550" stroke-width="2"/>`; }
    if (o.sides && o.sides[k] != null) s += `<text x="${M[0] + d[0] / L * 24}" y="${M[1] + d[1] / L * 24 + 5}" text-anchor="middle" class="t6-sv">${o.sides[k] === true ? inf.S[k] + ' ซม.' : o.sides[k]}</text>`; });
  (o.sideHit ? [0, 1, 2] : []).forEach(k => { s += `<path class="t6-side" data-k="${k}" d="M${p[k]} L${p[(k + 1) % 3]}" stroke="transparent" stroke-width="26"/>`; });
  (o.handles ? [0, 1, 2] : []).forEach(i => { s += `<circle class="t6-h drag" data-i="${i}" cx="${p[i][0]}" cy="${p[i][1]}" r="11" fill="#7E6ED6" fill-opacity=".85" stroke="#fff" stroke-width="2.4"/>`; });
  return s + (o.extra || '') + '</svg>';
}
const t6tick = inf => { const t = [0, 0, 0]; if (inf.byS === 'equi') return [1, 1, 1]; inf.eq.forEach((e, j) => { if (e) { t[j] = 1; t[(j + 1) % 3] = 1; } }); return t; };
/* draggable board: o.render(p) → { svg options } ; o.onChange(p, info) */
function triBoard(p0, o) {
  let p = p0.map(q => q.slice()), drag = null; const box = h('div', { class: 't6-board ia' }), W = o.W || 360, H = o.H || 240, grid = o.grid || 10;
  const draw = () => { box.innerHTML = triSVG(p, { W, H, handles: true, grid: o.showGrid ? T6PX / 2 : 0, ...o.render(p) }); o.onChange && o.onChange(p, t6info(p)); };
  const pt = e => { const svg = box.querySelector('svg'), m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m); return [Math.round(Math.max(14, Math.min(W - 14, r.x)) / grid) * grid, Math.round(Math.max(14, Math.min(H - 14, r.y)) / grid) * grid]; };
  box.addEventListener('pointerdown', e => { const hd = e.target.closest('.t6-h'); if (!hd) return; e.preventDefault(); drag = +hd.dataset.i; try { box.setPointerCapture(e.pointerId); } catch (_) { } });
  box.addEventListener('pointermove', e => { if (drag == null) return; const q = pt(e), np = p.map((v, i) => i === drag ? q : v); if (t6area2(np) < 900) return; p = np; draw(); });
  box.addEventListener('pointerup', () => { if (drag != null) sfx.tap(); drag = null; });
  box.addEventListener('click', e => { const sd = e.target.closest('.t6-side'); if (sd && o.onSide) { e.stopPropagation(); o.onSide(+sd.dataset.k); draw(); } });
  box.set = np => { p = np.map(q => q.slice()); draw(); }; box.get = () => p; box.redraw = draw;
  draw(); return box;
}
const T6_PRE = { acute: [[180, 40], [60, 200], [290, 200]], right: [[80, 50], [80, 200], [300, 200]], obtuse: [[100, 110], [40, 200], [320, 200]], equi: [[180, 60.8], [100, 200], [260, 200]], iso: [[180, 40], [110, 200], [250, 200]], scal: [[240, 50], [50, 200], [320, 200]] };

/* ---------- classify by angles / sides / both (drag the corners) ---------- */
function simTriDrag(mode = 'angle') {
  const out = fNote(), tag = h('div', { class: 't6-tags' });
  const brd = triBoard(T6_PRE[mode === 'side' ? 'iso' : 'acute'], { showGrid: true, render: p => { const inf = t6info(p); return { names: ['A', 'B', 'C'], angles: mode !== 'side' ? [true, true, true] : null, sides: mode !== 'angle' ? [true, true, true] : null, ticks: mode !== 'angle' ? t6tick(inf) : null }; },
    onChange: (p, inf) => { tag.innerHTML = (mode !== 'side' ? `<span class="t6-tag a">${T6_A[inf.byA]}</span>` : '') + (mode !== 'angle' ? `<span class="t6-tag s">${T6_S[inf.byS]}</span>` : '');
      out.innerHTML = (mode !== 'side' ? `มุม ${inf.A.join('° + ')}° = 180° · ${T6_AW[inf.byA]}` : '') + (mode === 'both' ? '<br>' : '') + (mode !== 'angle' ? `ด้าน ${inf.S.join(', ')} ซม. · ${T6_SW[inf.byS]}` : ''); } });
  const keys = mode === 'angle' ? ['acute', 'right', 'obtuse'] : mode === 'side' ? ['equi', 'iso', 'scal'] : ['acute', 'right', 'obtuse', 'equi', 'iso', 'scal'];
  const pre = h('div', { class: 'rowstack' }, ...keys.map(k => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.page(); brd.set(T6_PRE[k]); } }, (T6_A[k] || T6_S[k]).replace('รูปสามเหลี่ยม', ''))));
  return h('div', { class: 'colstack' }, tag, brd, h('div', { class: 'cap' }, 'ลากจุดสีม่วงเพื่อเปลี่ยนรูป · หรือกดเลือกแบบ'), pre, out);
}
/* ---------- base, base angles, apex angle, apex sides (tap a side to make it the base) ---------- */
function simTriParts() {
  let base = 1; const N = ['A', 'B', 'C'], out = fNote();
  const brd = triBoard([[200, 40], [60, 200], [310, 200]], { sideHit: true, onSide: k => { base = k; sfx.pop(k * 2); },
    render: () => { const ap = (base + 2) % 3; return { names: N, base, sideHit: true, arcs: [0, 1, 2], arcCol: { [base]: '#3F8BDB', [(base + 1) % 3]: '#3F8BDB', [ap]: '#E5487A' }, hlSides: [(base + 1) % 3, ap], hlV: [ap] }; },
    onChange: () => { const b1 = base, b2 = (base + 1) % 3, ap = (base + 2) % 3;
      out.innerHTML = `<b style="color:#E5487A">ฐาน</b> ${N[b1]}${N[b2]} · <b style="color:#3F8BDB">มุมที่ฐาน</b> ∠${N[b1]} และ ∠${N[b2]} · <b>มุมยอด</b> ∠${N[ap]} · <b style="color:#1B8862">ด้านประกอบมุมยอด</b> ${N[ap]}${N[b1]} และ ${N[ap]}${N[b2]}`; } });
  return h('div', { class: 'colstack' }, brd, h('div', { class: 'cap' }, 'แตะด้านใดก็ได้ให้เป็น “ฐาน” · ลากจุดสีม่วงเปลี่ยนรูป'), out);
}
/* ---------- heights: choose a base, see the height from the apex (outside for obtuse) ---------- */
function simHeight() {
  let base = 1; const N = ['A', 'B', 'C'], out = fNote();
  const brd = triBoard([[110, 50], [40, 200], [250, 200]], { sideHit: true, onSide: k => { base = k; sfx.pop(k * 2); }, showGrid: true,
    render: p => { const ap = (base + 2) % 3; return { names: N, base, sideHit: true, height: { v: ap, k: base }, footName: 'D' }; },
    onChange: p => { const ap = (base + 2) % 3, A = p[base], B = p[(base + 1) % 3], { F, t } = t6foot(p[ap], A, B), hcm = Math.round(t6d(p[ap], F) / T6PX * 10) / 10;
      out.innerHTML = `ฐาน ${N[base]}${N[(base + 1) % 3]} → ส่วนสูงคือ ${N[ap]}D (ลากจากมุมยอดมาตั้งฉากกับฐาน) ยาว <b>${hcm} ซม.</b>${t < 0 || t > 1 ? ' · ฐานต้อง<b>ต่อออกไป</b> เพราะส่วนสูงอยู่นอกรูป' : ''}`; } });
  return h('div', { class: 'colstack' }, brd, h('div', { class: 'cap' }, 'แตะด้านที่จะเป็นฐาน · ลากจุดยอดดูว่าส่วนสูงอยู่ตรงไหน'), out);
}
/* ---------- angle sum: tear off the three angles and line them up ---------- */
function simAngleSum() {
  const out = fNote(), line = h('div', { class: 't6-line' }); let shown = false;
  const COL = ['#FF7B86', '#6FB2F5', '#4FD1A1'];
  const brd = triBoard([[150, 40], [50, 190], [320, 190]], { render: () => ({ names: ['A', 'B', 'C'], angles: [true, true, true], arcs: [0, 1, 2], arcCol: COL }), onChange: (p, inf) => { out.innerHTML = `${inf.A[0]}° + ${inf.A[1]}° + ${inf.A[2]}° = <b>180°</b>`; if (shown) drawLine(inf); } });
  const drawLine = inf => { const cx = 180, cy = 90, r = 70; let a = 180, s = `<svg viewBox="0 0 360 110" aria-hidden="true"><path d="M20 ${cy} H340" stroke="#2B2550" stroke-width="2.4"/>`;
    inf.A.forEach((v, i) => { const a2 = a - v, p1 = [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)], p2 = [cx + r * Math.cos(a2 * Math.PI / 180), cy - r * Math.sin(a2 * Math.PI / 180)];
      s += `<path d="M${cx} ${cy} L${p1} A${r} ${r} 0 0 1 ${p2} Z" fill="${COL[i]}" fill-opacity=".8" stroke="#2B2550" stroke-width="1.4"/>`; const m = (a + a2) / 2; s += `<text x="${cx + r * .62 * Math.cos(m * Math.PI / 180)}" y="${cy - r * .62 * Math.sin(m * Math.PI / 180) + 5}" text-anchor="middle" class="t6-av">${v}°</text>`; a = a2; });
    line.innerHTML = s + `<text x="180" y="106" text-anchor="middle" class="t6-sv">รวมกันเป็นเส้นตรง = 180°</text></svg>`; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); shown = true; btn.remove(); sfx.ok(); drawLine(t6info(brd.get())); } }, icon('right'), 'ฉีกมุมทั้งสามมาเรียงต่อกัน');
  return h('div', { class: 'colstack' }, brd, btn, line, out);
}
/* ---------- constructions (SSS / SAS / ASA): steppers draw the triangle live ---------- */
function t6build(kind, v) { // returns pts or null, with cm values
  const r = Math.PI / 180; let A;
  if (kind === 'SSS') { const [a, b, c] = v; if (a + b <= c || a + c <= b || b + c <= a) return null; const x = (c * c - b * b + a * a) / (2 * a); A = [x, Math.sqrt(Math.max(0, c * c - x * x))]; return { B: [0, 0], C: [a, 0], A }; }
  if (kind === 'SAS') { const [c, B, a] = v; A = [c * Math.cos(B * r), c * Math.sin(B * r)]; return { B: [0, 0], C: [a, 0], A }; }
  const [a, B, C] = v; if (B + C >= 180) return null; const c = a * Math.sin(C * r) / Math.sin((180 - B - C) * r); A = [c * Math.cos(B * r), c * Math.sin(B * r)]; return { B: [0, 0], C: [a, 0], A };
}
function t6fit(T, W = 360, H = 230, pad = 36) {
  const xs = [T.A[0], 0, T.C[0]], mn = Math.min(...xs), mx = Math.max(...xs), my = Math.max(T.A[1], .1), k = Math.min(T6PX, (W - 2 * pad) / (mx - mn), (H - 2 * pad) / my);
  const f = q => [pad + (q[0] - mn) * k + ((W - 2 * pad) - (mx - mn) * k) / 2, H - pad - q[1] * k]; return [f(T.A), f(T.B), f(T.C)];
}
function simBuild3(kind, v0) {
  const v = v0.slice(), fig = h('div', { class: 't6-board' }), out = fNote();
  const lab = kind === 'SSS' ? ['BC (ซม.)', 'CA (ซม.)', 'AB (ซม.)'] : kind === 'SAS' ? ['AB (ซม.)', 'มุม B (°)', 'BC (ซม.)'] : ['BC (ซม.)', 'มุม B (°)', 'มุม C (°)'];
  const rng = kind === 'SSS' ? [[2, 10], [2, 10], [2, 10]] : kind === 'SAS' ? [[2, 9], [20, 150], [2, 9]] : [[3, 9], [20, 140], [20, 140]];
  const step = kind === 'SSS' ? [1, 1, 1] : kind === 'SAS' ? [1, 10, 1] : [1, 10, 10];
  const draw = () => { const T = t6build(kind, v);
    if (!T) { fig.innerHTML = '<div class="t6-no">✗</div>'; out.innerHTML = kind === 'SSS' ? `สร้างไม่ได้! ด้านสองด้านรวมกันต้อง<b>ยาวกว่า</b>ด้านที่เหลือเสมอ (${[...v].sort((a, b) => a - b).slice(0, 2).join(' + ')} = ${[...v].sort((a, b) => a - b).slice(0, 2).reduce((a, b) => a + b)} ≤ ${Math.max(...v)})` : `สร้างไม่ได้! มุม B + มุม C = ${v[1] + v[2]}° ต้องน้อยกว่า 180°`; return; }
    const p = t6fit(T), inf = t6info(p), sc = Math.round(Math.hypot(T.A[0], T.A[1]) * 10) / 10, sb = Math.round(Math.hypot(T.A[0] - T.C[0], T.A[1]) * 10) / 10;
    fig.innerHTML = triSVG(p, { names: ['A', 'B', 'C'], sides: kind === 'SSS' ? [`${v[2]} ซม.`, `${v[0]} ซม.`, `${v[1]} ซม.`] : kind === 'SAS' ? [`${v[0]} ซม.`, `${v[2]} ซม.`, `${sb} ซม.`] : [`${sc} ซม.`, `${v[0]} ซม.`, `${sb} ซม.`],
      angles: kind === 'SSS' ? [true, true, true] : kind === 'SAS' ? [true, v[1], true] : [true, v[1], v[2]], ticks: t6tick(inf) });
    out.innerHTML = `${T6_A[inf.byA]} · ${T6_S[inf.byS]}${kind !== 'SSS' ? ` · ${kind === 'SAS' ? `ได้ CA ≈ ${sb} ซม.` : `ได้มุม A = ${180 - v[1] - v[2]}°`}` : ''}`; };
  const S = v.map((_, i) => stepper(lab[i], () => v[i], x => { const d = Math.sign(x - v[i]) * step[i]; v[i] = Math.max(rng[i][0], Math.min(rng[i][1], v[i] + d)); }, () => rng[i][0] - 1, () => rng[i][1] + 1, () => { S[i].sync(); draw(); }));
  draw(); return h('div', { class: 'colstack' }, fig, h('div', { class: 'rowstack' }, ...S), out);
}
/* step-by-step construction pictures */
function simConstruct(kind) {
  const W = 420, H = 250, B = [70, 205], C = [70 + 6 * 45, 205], k = 45, r = Math.PI / 180;
  const A = kind === 'SSS' ? (() => { const a = 6, b = 4.5, c = 5, x = (c * c - b * b + a * a) / (2 * a); return [B[0] + x * k, B[1] - Math.sqrt(c * c - x * x) * k]; })() : kind === 'SAS' ? [B[0] + 5 * k * Math.cos(50 * r), B[1] - 5 * k * Math.sin(50 * r)] : (() => { const c = 6 * Math.sin(65 * r) / Math.sin(75 * r); return [B[0] + c * k * Math.cos(40 * r), B[1] - c * k * Math.sin(40 * r)]; })();
  const ln = (P, Q, c = '#2B2550', w = 3, ex = '') => `<path d="M${P} L${Q}" stroke="${c}" stroke-width="${w}" ${ex}/>`, dot = (P, t) => `<circle cx="${P[0]}" cy="${P[1]}" r="4.5" fill="#E5487A"/><text x="${P[0] - 6}" y="${P[1] + (t === 'A' ? -12 : 22)}" class="t6-n">${t}</text>`;
  const arc = (P, R, a1, a2, c = '#7E6ED6') => `<path d="M${P[0] + R * Math.cos(a1 * r)} ${P[1] - R * Math.sin(a1 * r)} A${R} ${R} 0 0 0 ${P[0] + R * Math.cos(a2 * r)} ${P[1] - R * Math.sin(a2 * r)}" fill="none" stroke="${c}" stroke-width="2.4" stroke-dasharray="6 4"/>`;
  const prot = (P, flip) => `<path d="M${P[0] - 60} ${P[1]} A60 60 0 0 1 ${P[0] + 60} ${P[1]} Z" fill="#FFE7A3" fill-opacity=".5" stroke="#C98612" stroke-width="1.6"/>`;
  const ray = (P, ang, L = 260) => ln(P, [P[0] + L * Math.cos(ang * r), P[1] - L * Math.sin(ang * r)], '#9790B0', 2, 'stroke-dasharray="6 5"');
  const STEPS = kind === 'SSS' ? [
    ['① ลากฐาน', 'ลาก BC ยาว 6 ซม.', ln(B, C) + dot(B, 'B') + dot(C, 'C')],
    ['② กางวงเวียน 5 ซม.', 'จุดปลายเหล็กที่ B เขียนส่วนโค้งรัศมี 5 ซม. (AB)', arc(B, 5 * k, 36, 60)],
    ['③ กางวงเวียน 4.5 ซม.', 'จุดปลายเหล็กที่ C เขียนส่วนโค้งรัศมี 4.5 ซม. (AC) ตัดส่วนโค้งแรกที่จุด A', arc(C, 4.5 * k, 108, 142)],
    ['④ ลากเส้น', 'ลาก AB และ AC ได้ △ABC', ln(A, B) + ln(A, C) + dot(A, 'A')]]
    : kind === 'SAS' ? [
      ['① ลากฐาน', 'ลาก BC ยาว 6 ซม.', ln(B, C) + dot(B, 'B') + dot(C, 'C')],
      ['② วัดมุม 50°', 'วางไม้โปรแทรกเตอร์ที่ B ทำมุม 50°', prot(B) + ray(B, 50)],
      ['③ วัดความยาว 5 ซม.', 'บนแขนของมุม วัดจาก B ยาว 5 ซม. ได้จุด A', dot(A, 'A') + ln(B, A, '#E5487A', 3)],
      ['④ ลากเส้น', 'ลาก AC ได้ △ABC', ln(A, C)]]
      : [
        ['① ลากฐาน', 'ลาก BC ยาว 6 ซม.', ln(B, C) + dot(B, 'B') + dot(C, 'C')],
        ['② สร้างมุม B = 40°', 'วางไม้โปรแทรกเตอร์ที่ B สร้างมุม 40° ลากแขนของมุม', prot(B) + ray(B, 40)],
        ['③ สร้างมุม C = 65°', 'วางไม้โปรแทรกเตอร์ที่ C สร้างมุม 65° (เปิดไปทาง B)', prot(C) + ray(C, 180 - 65)],
        ['④ จุดตัด A', 'แขนของมุมทั้งสองตัดกันที่ A ได้ △ABC (มุม A = 75°)', dot(A, 'A') + ln(A, B) + ln(A, C)]];
  let kk = 0; const fig = h('div', { class: 't6-board' }), list = h('div', { class: 'colstack fstory' }), out = fNote();
  const draw = () => { fig.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="t6-svg" aria-hidden="true">${STEPS.slice(0, kk).map(s => s[2]).join('')}</svg>`; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [l, b] = STEPS[kk]; kk++; list.append(h('div', { class: 'fst-row' }, h('b', null, l), h('span', null, b))); draw(); sfx.pop(kk);
    if (kk >= STEPS.length) { btn.remove(); out.innerHTML = 'สร้างเสร็จ! ตรวจสอบโดยวัดความยาวด้านและขนาดมุมอีกครั้ง'; sfx.ok(); } } }, icon('right'), 'ขั้นต่อไป');
  draw(); return h('div', { class: 'gside' }, fig, h('div', { class: 'colstack gside-r' }, list, btn, out));
}
/* ---------- perimeter: unroll the three sides onto a line ---------- */
function simPerim() {
  const v = [6, 5, 4], fig = h('div', { class: 't6-board' }), strip = h('div', { class: 't6-line' }), out = fNote(), COL = ['#3F8BDB', '#E5487A', '#1B8862'];
  const draw = () => { const T = t6build('SSS', v); if (!T) { fig.innerHTML = '<div class="t6-no">✗</div>'; strip.innerHTML = ''; out.innerHTML = 'ด้านสองด้านรวมกันต้องยาวกว่าด้านที่เหลือ'; return; }
    const p = t6fit(T); fig.innerHTML = triSVG(p, { names: ['A', 'B', 'C'], sides: [`${v[2]} ซม.`, `${v[0]} ซม.`, `${v[1]} ซม.`], hlSides: [] });
    const tot = v[0] + v[1] + v[2], k = 330 / Math.max(tot, 12); let x = 15, s = `<svg viewBox="0 0 360 60" aria-hidden="true">`;
    [v[0], v[1], v[2]].forEach((L, i) => { s += `<path d="M${x} 24 h${L * k}" stroke="${COL[i]}" stroke-width="8" stroke-linecap="round"/><text x="${x + L * k / 2}" y="16" text-anchor="middle" class="t6-sv">${L}</text>`; x += L * k; });
    strip.innerHTML = s + `<text x="15" y="50" class="t6-sv">ความยาวรอบรูป = ${v[0]} + ${v[1]} + ${v[2]} = ${tot} ซม.</text></svg>`; out.innerHTML = `ความยาวรอบรูป = ผลบวกความยาวของด้านทั้งสาม = <b>${tot} ซม.</b>`; };
  const S = ['BC', 'CA', 'AB'].map((n, i) => stepper(`${n} (ซม.)`, () => v[i], x => v[i] = x, () => 2, () => 10, draw));
  draw(); return h('div', { class: 'colstack' }, fig, strip, h('div', { class: 'rowstack' }, ...S), out);
}
/* ---------- area: a triangle is half of a rectangle (base, height, apex position) ---------- */
function simAreaRect(per) {
  let b = 6, hh = 4, s = 2; const fig = h('div', { class: 't6-board' }), big = h('div', { class: 'fbig t6-ar' }), out = fNote(), U = 36;
  const draw = () => { const ox = 30, oy = 30 + hh * U, B = [ox, oy], C = [ox + b * U, oy], A = [ox + s * U, oy - hh * U];
    fig.innerHTML = triSVG([A, B, C], { W: 30 * 2 + 10 * U, H: 60 + 6 * U, grid: U, rect: [ox, oy - hh * U, b * U, hh * U], names: ['A', 'B', 'C'], height: { v: 0, k: 1 }, sides: [null, `ฐาน ${b} ซม.`, null], hLabel: `สูง ${hh}`, fill: '#4FD1A1', rightMarks: false });
    big.innerHTML = `[1/2] × ${b} × ${hh} = <b>${b * hh / 2}</b> ตร.ซม.`.replace('[1/2]', fqHTML(1, 2));
    out.innerHTML = `สี่เหลี่ยมผืนผ้า ${b} × ${hh} = ${b * hh} ตร.ซม. · สามเหลี่ยมใช้พื้นที่<b>ครึ่งหนึ่ง</b>เสมอ (ส่วนที่ไม่ระบาย 2 ชิ้น ประกอบเป็นสามเหลี่ยมได้อีกรูป) — เลื่อนจุดยอดไป พื้นที่ไม่เปลี่ยน`;
    if (per) { const ab = Math.hypot(s, hh), ac = Math.hypot(b - s, hh), P = Math.round((b + ab + ac) * 10) / 10; out.innerHTML = `พื้นที่ = ${b * hh / 2} ตร.ซม. (เท่าเดิมเมื่อเลื่อนจุดยอด) · ความยาวรอบรูป ≈ ${b} + ${ab.toFixed(1)} + ${ac.toFixed(1)} ≈ <b>${P} ซม.</b> (เปลี่ยนไป!)`; } };
  draw(); return h('div', { class: 'colstack' }, fig, big, h('div', { class: 'rowstack' }, stepper('ฐาน (ซม.)', () => b, x => { b = x; if (s > b) s = b; }, () => 2, () => 10, draw), stepper('ส่วนสูง (ซม.)', () => hh, x => hh = x, () => 1, () => 6, draw), stepper('ตำแหน่งจุดยอด', () => s, x => s = x, () => 0, () => b, draw)), out);
}
/* ---------- area formula: any side can be the base ---------- */
function simAreaAny() {
  let base = 1; const out = fNote(), N = ['A', 'B', 'C'];
  const brd = triBoard([[120, 40], [40, 200], [280, 200]], { sideHit: true, showGrid: true, onSide: k => { base = k; sfx.pop(k * 2); },
    render: () => ({ names: N, base, sideHit: true, height: { v: (base + 2) % 3, k: base } }),
    onChange: p => { const A = p[base], B = p[(base + 1) % 3], { F } = t6foot(p[(base + 2) % 3], A, B), bl = t6d(A, B) / T6PX, hl = t6d(p[(base + 2) % 3], F) / T6PX, ar = t6area2(p) / 2 / T6PX / T6PX;
      out.innerHTML = `ฐาน ${N[base]}${N[(base + 1) % 3]} ≈ ${bl.toFixed(1)} ซม. · สูง ≈ ${hl.toFixed(1)} ซม. → [1/2] × ${bl.toFixed(1)} × ${hl.toFixed(1)} ≈ <b>${ar.toFixed(1)} ตร.ซม.</b> — เปลี่ยนฐาน พื้นที่ยังเท่าเดิม`.replace('[1/2]', '½'); } });
  return h('div', { class: 'colstack' }, brd, h('div', { class: 'cap' }, 'แตะด้านที่จะใช้เป็นฐาน · ลากจุดสีม่วงเปลี่ยนรูป'), out);
}

/* =========================================================
   QUESTION TYPES (prefix t6…)
   ========================================================= */
const T6_GAME = { acute: [[70, 60], [55, 65], [75, 50]], right: [[90, 35], [60, 90], [90, 45]], obtuse: [[110, 40], [25, 125], [35, 100]], equi: [[60, 60]], iso: [[70, 70], [40, 40], [30, 30], [45, 45]], scal: [[50, 75], [35, 70], [25, 60]] };
Object.assign(Q, {
  t6Cls({ B, C, by }) {
    const p = t6fromAngles(B, C), inf = t6info(p), right = by === 'angle' ? T6_A[inf.byA] : T6_S[inf.byS], opts = Object.values(by === 'angle' ? T6_A : T6_S);
    const fig = triSVG(p, { names: ['ก', 'ข', 'ค'], angles: by === 'angle' ? [true, true, true] : null, sides: by === 'side' ? [true, true, true] : null, ticks: by === 'side' ? t6tick(inf) : null });
    return { prompt: `รูปสามเหลี่ยมนี้เป็นรูปสามเหลี่ยมชนิดใด (พิจารณา<span class="hl">${by === 'angle' ? 'ขนาดของมุม' : 'ความยาวของด้าน'}</span>)`, say: `รูปสามเหลี่ยมนี้เป็นรูปสามเหลี่ยมชนิดใด พิจารณา${by === 'angle' ? 'ขนาดของมุม' : 'ความยาวของด้าน'}`,
      mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, h('div', { class: 't6-board sm', html: fig }), choices(ctx, opts.map(o => ({ value: o, label: o })), right, { hint: by === 'angle' ? 'มีมุมฉาก → มุมฉาก · มีมุมป้าน → มุมป้าน · มุมแหลมทั้งหมด → มุมแหลม' : 'ยาวเท่ากัน 3 ด้าน → ด้านเท่า · 2 ด้าน → หน้าจั่ว · ไม่เท่าเลย → ด้านไม่เท่า' })));
        bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  t6Part({ B, C, base, ask }) {
    const N = ['ก', 'ข', 'ค'], p = t6fromAngles(B, C), ap = (base + 2) % 3, b1 = base, b2 = (base + 1) % 3, fig = triSVG(p, { names: N, base, sides: { [base]: 'ฐาน' } });
    const right = ask === 'apex' ? `มุม ${N[ap]}` : ask === 'bases' ? `มุม ${N[b1]} และมุม ${N[b2]}` : `${N[ap]}${N[b1]} และ ${N[ap]}${N[b2]}`;
    const opts = ask === 'apex' ? N.map(n => `มุม ${n}`) : ask === 'bases' ? [`มุม ${N[b1]} และมุม ${N[b2]}`, `มุม ${N[ap]} และมุม ${N[b1]}`, `มุม ${N[ap]} และมุม ${N[b2]}`] : [`${N[ap]}${N[b1]} และ ${N[ap]}${N[b2]}`, `${N[b1]}${N[b2]} และ ${N[ap]}${N[b1]}`, `${N[b1]}${N[b2]} และ ${N[ap]}${N[b2]}`];
    const q = ask === 'apex' ? 'มุมยอด' : ask === 'bases' ? 'มุมที่ฐาน' : 'ด้านประกอบมุมยอด';
    return { prompt: `จากรูป ถ้า ${N[b1]}${N[b2]} เป็นฐาน <span class="hl">${q}</span>คือข้อใด`, say: `จากรูป ถ้า ${N[b1]}${N[b2]} เป็นฐาน ${q}คือข้อใด`,
      mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, h('div', { class: 't6-board sm', html: fig }), choices(ctx, shuffle(opts).map(o => ({ value: o, label: o })), right, { hint: 'มุมยอดอยู่ตรงข้ามฐาน · มุมที่ฐานคือมุมที่ปลายทั้งสองของฐาน · ด้านประกอบมุมยอดคือด้านที่ไม่ใช่ฐาน' })));
        bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  t6Find({ B, C, ask = 0, names = ['ก', 'ข', 'ค'] }) {
    const p = t6fromAngles(B, C), inf = t6info(p), ans = inf.A[ask], ang = inf.A.map((a, i) => i === ask ? '?' : a + '°');
    const fig = triSVG(p, { names, angles: ang });
    return { prompt: `หาขนาดของมุม ${names[ask]}`, say: `หาขนาดของมุม ${names[ask]}`,
      mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, h('div', { class: 't6-board sm', html: fig }), h('div', { class: 'rowstack' }, answerBox(ctx, ans, { hint: `มุมภายในรวมกัน 180° → 180 − ${inf.A.filter((_, i) => i !== ask).join(' − ')}` }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'องศา')))); } };
  },
  t6Num({ fig, q, a, unit, hint }) {
    return { prompt: q, say: speakText(q), mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, fig ? h('div', { class: 't6-board sm', html: fig }) : null, decAnswer(ctx, DQ(a), { hint, unit }))); } };
  }
});
/* practice figures drawn to look like the sheet; values are labels */
const T6F = (pts, sides, o = {}) => triSVG(pts, { sides, rightMarks: true, ...o });
const T6W_PER = [
  { fig: T6F([[130, 50], [40, 190], [320, 190]], ['3.7 ซม.', '5 ซม.', '2.6 ซม.']), a: '11.3', unit: 'ซม.' },
  { fig: T6F([[180, 68.8], [110, 190], [250, 190]], [null, '4 วา', null], { ticks: [1, 1, 1] }), a: '12', unit: 'วา' },
  { fig: T6F([[60, 120], [260, 40], [260, 200]], ['5 ซม.', '4 ซม.', null], { ticks: [1, 0, 1] }), a: '14', unit: 'ซม.' },
  { fig: T6F([[260, 40], [60, 200], [260, 200]], ['17.4 ม.', '13 ม.', '11.6 ม.']), a: '42', unit: 'ม.' },
  { fig: T6F([[40, 60], [320, 60], [180, 200]], ['34.6 ม.', null, '20 ม.'], { ticks: [0, 1, 1] }), a: '74.6', unit: 'ม.' }];
/* area figures drawn TO SCALE from the numbers (ผู้ใช้แจ้ง: รูปเดิมไม่ได้สัดส่วน ตัวเลขทับเส้น) — base A(0,0)–B(b,0), apex C(off,h) */
function t6AreaSVG({ b, h: H, off, unit: u, flip, sides = {}, noH }) {
  const mnx = Math.min(0, off), mxx = Math.max(b, off), w = mxx - mnx, s = Math.min(300 / w, 170 / H), px = 62, py = 34;
  const X = x => +(px + (x - mnx) * s).toFixed(1), Y = y => +(flip ? py + y * s : py + (H - y) * s).toFixed(1), W = +(w * s + 2 * px).toFixed(1), Hh = +(H * s + 2 * py).toFixed(1);
  const A = [X(0), Y(0)], B = [X(b), Y(0)], C = [X(off), Y(H)], F = [X(off), Y(0)], dn = flip ? -1 : 1, t = (x, y, txt, a = 'middle', c = 't6-al') => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}">${txt}</text>`;
  const len = (p, q) => +Math.hypot(p[0] - q[0], p[1] - q[1]).toFixed(1), lab = v => typeof v === 'string' ? v : `${fmtDec(String(v))} ${u}`;
  let g = `<polygon points="${A} ${B} ${C}" fill="#E3F0FF" stroke="#2D2A40" stroke-width="2.6" stroke-linejoin="round"/>`;
  g += t((A[0] + B[0]) / 2, A[1] + 22 * dn + (flip ? 0 : 4), `${fmtDec(String(b))} ${u}`);
  const onSide = Math.abs(off) < 1e-9 || Math.abs(off - b) < 1e-9;
  if (!onSide && !noH) { g += `<line x1="${C[0]}" y1="${C[1]}" x2="${F[0]}" y2="${F[1]}" stroke="#7A5AF8" stroke-width="2.4" stroke-dasharray="7 5"/>`;
    if (off < 0 || off > b) g += `<line x1="${off < 0 ? A[0] : B[0]}" y1="${A[1]}" x2="${F[0]}" y2="${F[1]}" stroke="#7A5AF8" stroke-width="2" stroke-dasharray="4 5"/>`; }
  if (!noH) {
  const sq = 9, sx = (off >= b || (off > 0 && off > b / 2)) ? -1 : 1; g += `<path d="M${F[0] + sx * sq} ${F[1]} v${-dn * sq} h${-sx * sq}" fill="none" stroke="#2D2A40" stroke-width="1.6"/>`;
  // height label: outside the triangle when the height is on/outside a side, else on the roomier side
  const hy = Y(H * (onSide || off < 0 || off > b ? .5 : .3)), leftRoom = off <= 0 ? 999 : off * s * .7, rightRoom = off >= b ? 999 : (b - off) * s * .7, side = off <= 0 ? -1 : off >= b ? 1 : leftRoom >= rightRoom ? -1 : 1;
  g += t(F[0] + side * 9, hy + 5, `${fmtDec(String(H))} ${u}`, side < 0 ? 'end' : 'start', 't6-al h');
  }
  const sl = (p, q, v) => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, cx = (A[0] + B[0] + C[0]) / 3, cy = (A[1] + B[1] + C[1]) / 3; let nx = -(q[1] - p[1]), ny = q[0] - p[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L; if (nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
    return t(mx + nx * 18, my + ny * 18 + 5, v, nx > .35 ? 'start' : nx < -.35 ? 'end' : 'middle'); };
  if (sides.ac) g += sl(A, C, sides.ac === true ? lab(+Math.hypot(off, H).toFixed(1)) : sides.ac);
  if (sides.bc) g += sl(B, C, sides.bc === true ? lab(+Math.hypot(b - off, H).toFixed(1)) : sides.bc);
  return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" class="t6-svg t6-area" aria-hidden="true">${g}</svg>`; }
const t6AreaHint = (b, H, u) => `ใช้ฐาน ${fmtDec(String(b))} ${u} คู่กับส่วนสูง ${fmtDec(String(H))} ${u} ที่ตั้งฉากกับฐาน → ½ × ฐาน × สูง`;
const t6AreaA = (b, H) => decStr(Rr(Math.round(b * 10) * Math.round(H * 10), 200));
const T6A = (b, H, off, u, o = {}) => ({ fig: t6AreaSVG({ b, h: H, off, unit: u, ...o }), a: t6AreaA(b, H), unit: 'ตร.' + u, hint: t6AreaHint(b, H, u), key: `${b}|${H}|${u}` });
const T6W_AREA = [T6A(3, 4, 3, 'ม.', { sides: { ac: '5 ม.' } }), T6A(28, 24.2, 14, 'นิ้ว'), T6A(25, 3, -9.87, 'ซม.', { sides: { bc: '35 ซม.' } }),
  T6A(112, 27.3, 34.9, 'ม.', { sides: { ac: '44.3 ม.', bc: '81.7 ม.' } }), T6A(15, 8.5, 3.5, 'ม.', { flip: true })]; // — วาดตามสัดส่วนจริง
/* fresh triangles every game: acute / right / obtuse (height outside), sometimes with the slanted sides as distractors */
function t6AreaGen(used = new Set()) { for (let k = 0; k < 60; k++) {
  const u = pick(['ซม.', 'ซม.', 'ม.', 'นิ้ว']), b = rnd(5, 30), H = rnd(3, 22); if (H / b < .3 || H / b > 1.5) continue;
  const kind = pick(['acute', 'acute', 'right', 'obtuse']), off = kind === 'right' ? pick([0, b]) : kind === 'acute' ? Math.round(b * (.2 + Math.random() * .6)) : pick([-1, 1]) * Math.round(b * (.2 + Math.random() * .4)) + (Math.random() < .5 ? 0 : b) * 0;
  const o2 = kind === 'obtuse' && off > 0 ? b + off : off, key = `${b}|${H}|${u}`; if (used.has(key)) continue; used.add(key);
  const sides = Math.random() < .6 ? { ac: (kind === 'right' && o2 === 0) || o2 < 0 ? undefined : true, bc: (kind === 'right' && o2 === b) || o2 > b ? undefined : true } : {};
  return { ...T6A(b, H, o2, u, { sides, flip: Math.random() < .2 }), key }; } return T6W_AREA[0]; }
const t6AreaQ = o => ({ ...Q.t6Num({ fig: o.fig, q: 'หาพื้นที่ของรูปสามเหลี่ยม', a: o.a, unit: o.unit, hint: o.hint }), __sig: 't6area ' + o.key });
const t6AreaGenQs = n => { const used = new Set(); return Array.from({ length: n }, () => t6AreaQ(t6AreaGen(used))); };
const T6W_STORY = [
  D6S('สวนสาธารณะมีแปลงหญ้ารูปสามเหลี่ยม ด้านยาว 5 เมตร 8 เมตร และ 12 เมตร แปลงหญ้านี้ยาวรอบรูปกี่เมตร', '5 + 8 + 12', ['5 × 8 × 12', '1/2 × 5 × 7'], 'เมตร'),
  D6S('ต้อมทาสีรั้วรอบสวนสามเหลี่ยม ด้านยาว 16, 20 และ 24 เมตร ทารั้วยาว 10 เมตรใช้สี 1 ถัง ต้อมต้องใช้สีกี่ถัง', '(16 + 20 + 24) ÷ 10', ['16 + 20 + 24', '(16 + 20 + 24) × 10'], 'ถัง'),
  D6S('สนามเด็กเล่นสร้างพื้นที่เล่นทรายรูปสามเหลี่ยม ฐานยาว 10 เมตร สูง 6 เมตร พื้นที่เล่นทรายเป็นกี่ตารางเมตร', '1/2 × 10 × 6', ['10 × 6', '10 + 6'], 'ตารางเมตร'),
  D6S('สระบัวรูปสามเหลี่ยมมีด้านหนึ่งยาว 5 เมตร อีกด้านยาว 6 เมตร ยาวรอบรูป 20 เมตร ด้านที่สามยาวกี่เมตร', '20 − 5 − 6', ['20 − 5 + 6', '5 + 6'], 'เมตร'),
  D6S('แปลงผักรูปสามเหลี่ยม ฐานยาว 12 เมตร ส่วนสูง 8 เมตร แปลงผักมีพื้นที่กี่ตารางเมตร', '1/2 × 12 × 8', ['12 × 8', '12 + 8'], 'ตารางเมตร'),
  D6S('สามเหลี่ยม ABC มีพื้นที่ 900 ตารางเซนติเมตร ฐาน AB ยาว 15 เซนติเมตร ส่วนสูงยาวกี่เซนติเมตร', '900 × 2 ÷ 15', ['900 ÷ 15', '900 × 15'], 'เซนติเมตร'),
  D6S('เต็นท์สามเหลี่ยมมีด้านยาว 10, 14 และ 18 เมตร ต้องใช้ด้ายยาวเท่ากับความยาวรอบรูป ต้องใช้ด้ายกี่เมตร', '10 + 14 + 18', ['10 × 14 × 18', '1/2 × 18 × 14'], 'เมตร'),
  D6S('ธงสามเหลี่ยมผืนใหญ่มีฐานยาว 18 เมตร สูง 8 เมตร มีพื้นที่กี่ตารางเมตร', '1/2 × 18 × 8', ['18 × 8', '18 + 8 + 8'], 'ตารางเมตร'),
  D6S('ตัดกระดาษรูปสามเหลี่ยมสูง 12 เซนติเมตร ฐานยาวเป็น 3 เท่าของความสูง กระดาษมีพื้นที่กี่ตารางเซนติเมตร', '1/2 × 36 × 12', ['36 × 12', '1/2 × 12 × 3'], 'ตารางเซนติเมตร'),
  D6S('ที่ดินสี่เหลี่ยมผืนผ้ายาว 15 เมตร กว้าง 10 เมตร แบ่งด้วยเส้นทแยงมุมเป็น 2 รูปสามเหลี่ยม แต่ละรูปมีพื้นที่กี่ตารางเมตร', '1/2 × 15 × 10', ['15 × 10', '15 + 10'], 'ตารางเมตร'),
  D6S('แผ่นโลหะสามเหลี่ยมมุมฉาก 2 ชิ้น มีด้านยาว 15, 40 และ 43 เซนติเมตร นำมาวางชิดกันที่ด้าน 15 ซม. เป็นสามเหลี่ยมหน้าจั่ว ความยาวรอบรูปใหม่เป็นกี่เซนติเมตร', '43 + 43 + 40 + 40', ['15 + 40 + 43', '(15 + 40 + 43) × 2'], 'เซนติเมตร')];
const T6W_TF = [['สามเหลี่ยมที่มีมุม 65° 80° และ 35° เป็นรูปสามเหลี่ยมมุมแหลม เพราะมีมุมทุกมุมเป็นมุมแหลม', 1], ['รูปสามเหลี่ยมที่มีมุม 20° 80° และ 80° เป็นรูปสามเหลี่ยมมุมแหลม', 1], ['สามเหลี่ยมที่มีมุม 50° 90° และ 40° เป็นรูปสามเหลี่ยมมุมแหลม เพราะมีมุมแหลม 2 มุม', 0], ['รูปสามเหลี่ยมที่มีมุม 25° 25° และ 130° เป็นรูปสามเหลี่ยมมุมป้าน เพราะมีมุมป้าน 1 มุม', 1], ['สามเหลี่ยมที่มีมุม 30° 60° และ 90° เป็นรูปสามเหลี่ยมมุมฉาก เพราะมีมุมฉาก 1 มุม', 1]];
const T6W_TFS = [['รูปสามเหลี่ยมที่มีด้านยาว 11 ซม. 8.5 ซม. และ 5.2 ซม. เป็นรูปสามเหลี่ยมด้านไม่เท่า', 1], ['สามเหลี่ยมที่มีด้านยาว 9 ซม. 5 ซม. และ 9 ซม. เป็นรูปสามเหลี่ยมด้านเท่า เพราะมีด้านยาวเท่ากัน 2 ด้าน', 0], ['สามเหลี่ยมที่มีด้านยาว 6 ซม. 6 ซม. และ 9 ซม. เป็นรูปสามเหลี่ยมด้านเท่า เพราะมีด้านยาวเท่ากัน', 0], ['สามเหลี่ยมที่มีด้านยาว 10 ซม. 10 ซม. และ 7 ซม. เป็นรูปสามเหลี่ยมหน้าจั่ว เพราะมีด้านยาวเท่ากัน 2 ด้าน', 1], ['รูปสามเหลี่ยมที่มีด้านยาว 7.5 ซม. เท่ากันทุกด้าน เป็นรูปสามเหลี่ยมด้านเท่า', 1], ['สามเหลี่ยมที่ด้านทั้ง 3 ด้านยาวไม่เท่ากันเลย เป็นรูปสามเหลี่ยมด้านไม่เท่า', 1]];
const t6tf = ([text, ok]) => Q.hTF({ text, ok: !!ok, why: ok ? 'ข้อความนี้ถูกต้อง' : 'ดูชนิดตามนิยาม: มุมฉาก/ป้าน/แหลม · ด้านเท่า (3 ด้าน) · หน้าจั่ว (2 ด้าน)' });
const t6cls = (by, keys, k) => pkF(keys.flatMap(t => T6_GAME[t]), k).map(([B, C]) => Q.t6Cls({ B, C, by }));

/* =========================================================
   LEVELS 801–815
   ========================================================= */
const L6T = (no, place, title, short, goal, teach, game) => ({ id: 800 + no, place, title, short, tone: TONES5[(no + 5) % 6], goal, teach, game });
const LESSONS_P6C6 = [
  L6T(1, 'ลานมุมสามแบบ', 'การจำแนกรูปสามเหลี่ยมโดยพิจารณาขนาดของมุม', 'จำแนกตามมุม', 'จำแนกรูปสามเหลี่ยมตามขนาดของมุม: มุมแหลม มุมฉาก มุมป้าน', [
    T('ยินดีต้อนรับสู่ <b>ภูเขาสามเหลี่ยม</b>! <b>ลากจุดสีม่วง</b>เปลี่ยนรูป — ดูขนาดมุมและชนิดของรูปสามเหลี่ยม', 'ยินดีต้อนรับสู่ภูเขาสามเหลี่ยม ลากจุดสีม่วงเปลี่ยนรูป ดูขนาดมุมและชนิดของรูปสามเหลี่ยม', el => el.append(simTriDrag('angle'))),
    T('ตัวอย่างทีละขั้น: ดูมุมที่<b>ใหญ่ที่สุด</b>ก็พอ', 'ตัวอย่างทีละขั้น ดูมุมที่ใหญ่ที่สุดก็พอ', el => el.append(dcWalk('', [['มุม 65°, 55°, 60°', 'มุมใหญ่สุด 65° เป็นมุมแหลม → <b>มุมแหลม</b>'], ['มุม 90°, 30°, 60°', 'มีมุม 90° → <b>มุมฉาก</b>'], ['มุม 120°, 35°, 25°', 'มีมุม 120° (มากกว่า 90°) → <b>มุมป้าน</b>'], ['สังเกต', 'รูปสามเหลี่ยมมีมุมฉากหรือมุมป้านได้<b>อย่างมาก 1 มุม</b>']], 'ดูมุมที่ใหญ่ที่สุด: < 90° แหลม · = 90° ฉาก · > 90° ป้าน', 'ดูมุมที่ใหญ่ที่สุด')))],
    () => [...t6cls('angle', ['acute', 'right', 'obtuse'], 4), ...pkF(T6W_TF, 2).map(t6tf)]),
  L6T(2, 'บันไดด้านเท่า', 'การจำแนกรูปสามเหลี่ยมโดยพิจารณาความยาวของด้าน', 'จำแนกตามด้าน', 'จำแนกรูปสามเหลี่ยมตามความยาวของด้าน: ด้านเท่า หน้าจั่ว ด้านไม่เท่า', [
    T('ลากจุดสีม่วง — ดูความยาวด้าน (ขีดเล็ก ๆ บอกด้านที่ยาวเท่ากัน)', 'ลากจุดสีม่วง ดูความยาวด้าน ขีดเล็ก ๆ บอกด้านที่ยาวเท่ากัน', el => el.append(simTriDrag('side'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['ด้าน 6, 6, 6 ซม.', 'ยาวเท่ากันทั้ง 3 ด้าน → <b>ด้านเท่า</b>'], ['ด้าน 7, 7, 4 ซม.', 'ยาวเท่ากัน 2 ด้าน → <b>หน้าจั่ว</b>'], ['ด้าน 5, 6, 8 ซม.', 'ไม่เท่ากันเลย → <b>ด้านไม่เท่า</b>'], ['สังเกต', 'ขีดที่ด้านเหมือนกัน = ยาวเท่ากัน']], 'นับว่ามีด้านยาวเท่ากันกี่ด้าน', 'นับว่ามีด้านยาวเท่ากันกี่ด้าน')))],
    () => [...t6cls('side', ['equi', 'iso', 'scal'], 4), ...pkF(T6W_TFS, 2).map(t6tf)]),
  L6T(3, 'ทางแยกลักษณะ', 'ลักษณะของรูปสามเหลี่ยม', 'ลักษณะรูปสามเหลี่ยม', 'บอกลักษณะของรูปสามเหลี่ยมทั้งตามมุมและตามด้าน เช่น มุมฉากหน้าจั่ว และรู้ว่าแบบใดเป็นไปไม่ได้', [
    T('รูปเดียวบอกได้ <b>2 แบบ</b>: ตามมุม และตามด้าน — ลองทำ “มุมฉาก + หน้าจั่ว”', 'รูปเดียวบอกได้สองแบบ ตามมุมและตามด้าน ลองทำมุมฉากหน้าจั่ว', el => el.append(simTriDrag('both'))),
    T('ตัวอย่างทีละขั้น: แบบไหนเป็นไปได้?', 'ตัวอย่างทีละขั้น แบบไหนเป็นไปได้', el => el.append(dcWalk('', [['ด้านเท่า', 'มุมทุกมุม 60° → เป็นมุมแหลมเสมอ'], ['มุมฉาก + หน้าจั่ว', 'เป็นไปได้: มุม 90°, 45°, 45°'], ['มุมป้าน + ด้านเท่า', '<b>เป็นไปไม่ได้</b> เพราะด้านเท่ามีมุม 60° ทุกมุม'], ['หน้าจั่ว', 'มุมที่ฐานเท่ากัน 2 มุม']], 'บอกชนิดได้ทั้งตามมุมและตามด้าน', 'บอกชนิดได้ทั้งตามมุมและตามด้าน')))],
    () => [...t6cls('angle', ['iso', 'scal'], 2), ...t6cls('side', ['right', 'obtuse', 'acute'], 2),
      Q.dPick({ q: 'ข้อใด<b>เป็นไปไม่ได้</b>', opts: ['รูปสามเหลี่ยมมุมป้านด้านเท่า', 'รูปสามเหลี่ยมมุมฉากหน้าจั่ว', 'รูปสามเหลี่ยมมุมป้านหน้าจั่ว'], right: 'รูปสามเหลี่ยมมุมป้านด้านเท่า', hint: 'ด้านเท่ามีมุม 60° ทุกมุม' }),
      Q.dPick({ q: 'รูปสามเหลี่ยมด้านเท่ามีมุมแต่ละมุมขนาดเท่าใด', opts: ['60°', '90°', '45°'], right: '60°' })]),
  L6T(4, 'หน้าผาฐานและยอด', 'แนะนำ ฐาน มุมที่ฐาน มุมยอด และด้านประกอบมุมยอดของรูปสามเหลี่ยม', 'ฐาน · มุมยอด', 'บอกฐาน มุมที่ฐาน มุมยอด และด้านประกอบมุมยอดของรูปสามเหลี่ยม (ด้านใดก็เป็นฐานได้)', [
    T('<b>แตะด้าน</b>ใดก็ได้ให้เป็นฐาน — ส่วนอื่น ๆ จะเปลี่ยนตาม', 'แตะด้านใดก็ได้ให้เป็นฐาน ส่วนอื่น ๆ จะเปลี่ยนตาม', el => el.append(simTriParts())),
    T('ตัวอย่างทีละขั้น: △PQR ที่มี QR เป็นฐาน', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['ฐาน', 'QR'], ['มุมที่ฐาน', 'มุมที่ปลายทั้งสองของฐาน: ∠Q และ ∠R'], ['มุมยอด', 'มุมตรงข้ามฐาน: ∠P'], ['ด้านประกอบมุมยอด', 'ด้านที่ไม่ใช่ฐาน: PQ และ PR']], 'ถ้าเปลี่ยนฐาน มุมยอดก็เปลี่ยนตาม', 'ถ้าเปลี่ยนฐาน มุมยอดก็เปลี่ยนตาม')))],
    () => [[60, 70, 1, 'apex'], [50, 80, 0, 'bases'], [65, 45, 2, 'sides'], [70, 50, 1, 'bases'], [40, 100, 0, 'apex'], [55, 75, 1, 'sides']].map(([B, C, base, ask]) => Q.t6Part({ B, C, base, ask }))),
  L6T(5, 'จุดวัดความสูง', 'ส่วนสูงของรูปสามเหลี่ยม', 'ส่วนสูง', 'บอกส่วนสูงของรูปสามเหลี่ยม: ส่วนของเส้นตรงที่ลากจากมุมยอดมาตั้งฉากกับฐาน (หรือส่วนต่อของฐาน)', [
    T('เลือกฐาน แล้วดู<b>ส่วนสูง</b> — ลากจุดยอดออกไปด้านข้าง ส่วนสูงอาจอยู่<b>นอกรูป</b>', 'เลือกฐาน แล้วดูส่วนสูง ลากจุดยอดออกไปด้านข้าง ส่วนสูงอาจอยู่นอกรูป', el => el.append(simHeight())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['นิยาม', 'ส่วนสูง = ส่วนของเส้นตรงที่ลากจาก<b>มุมยอด</b>มา<b>ตั้งฉาก</b>กับฐาน'], ['ความสูง', 'ความยาวของส่วนสูง'], ['มุมฉาก', 'ด้านประกอบมุมฉากเป็นส่วนสูงของอีกด้านได้เลย'], ['มุมป้าน', 'ถ้าใช้ด้านประกอบมุมป้านเป็นฐาน ต้องต่อฐานออกไป ส่วนสูงอยู่นอกรูป'], ['สรุป', 'รูปสามเหลี่ยมหนึ่งรูปมีส่วนสูง 3 เส้น (ตามฐาน 3 ด้าน)']], 'ส่วนสูงต้องตั้งฉากกับฐานเสมอ', 'ส่วนสูงต้องตั้งฉากกับฐานเสมอ')))],
    () => [Q.dPick({ q: 'ส่วนสูงของรูปสามเหลี่ยมคืออะไร', opts: ['ส่วนของเส้นตรงที่ลากจากมุมยอดมาตั้งฉากกับฐาน', 'ด้านที่ยาวที่สุด', 'เส้นที่ลากจากมุมยอดไปจุดกึ่งกลางฐานเสมอ'], right: 'ส่วนของเส้นตรงที่ลากจากมุมยอดมาตั้งฉากกับฐาน' }),
      Q.dPick({ q: 'รูปสามเหลี่ยม 1 รูป มีส่วนสูงได้กี่เส้น', opts: ['3 เส้น', '1 เส้น', '2 เส้น'], right: '3 เส้น', hint: 'ด้านใดก็เป็นฐานได้' }),
      Q.dPick({ q: 'รูปสามเหลี่ยมมุมฉาก ABC มุม B เป็นมุมฉาก ถ้า BC เป็นฐาน ส่วนสูงคือข้อใด', opts: ['AB', 'AC', 'BC'], right: 'AB', hint: 'AB ตั้งฉากกับ BC อยู่แล้ว' }),
      Q.dPick({ q: 'รูปสามเหลี่ยมใดที่อาจมีส่วนสูงอยู่<b>นอก</b>รูป', opts: ['รูปสามเหลี่ยมมุมป้าน', 'รูปสามเหลี่ยมด้านเท่า', 'รูปสามเหลี่ยมมุมแหลม'], right: 'รูปสามเหลี่ยมมุมป้าน' }),
      Q.dPick({ q: 'ความสูงของรูปสามเหลี่ยม หมายถึงข้อใด', opts: ['ความยาวของส่วนสูง', 'ความยาวของฐาน', 'ผลบวกของด้านทั้งสาม'], right: 'ความยาวของส่วนสูง' })]),
  L6T(6, 'ลานมุมรวม 180', 'มุมภายในของรูปสามเหลี่ยม', 'มุมภายในรวม 180°', 'รู้ว่ามุมภายในทั้งสามของรูปสามเหลี่ยมรวมกันเป็น 180° และหาขนาดของมุมที่ไม่ทราบค่า', [
    T('ลากจุดสีม่วงให้รูปเปลี่ยน แล้ว<b>ฉีกมุมทั้งสาม</b>มาเรียงต่อกัน — ได้เส้นตรงทุกครั้ง', 'ลากจุดสีม่วงให้รูปเปลี่ยน แล้วฉีกมุมทั้งสามมาเรียงต่อกัน ได้เส้นตรงทุกครั้ง', el => el.append(simAngleSum())),
    T('ตัวอย่างทีละขั้น: หาขนาดมุมที่หายไป', 'ตัวอย่างทีละขั้น หาขนาดมุมที่หายไป', el => el.append(dcWalk('', [['โจทย์', '△ABC มี ∠A = 48° และ ∠B = 67° ∠C เท่าไร'], ['มุมรวม 180°', '∠C = 180° − 48° − 67°'], ['คำนวณ', '= 180° − 115° = 65°'], ['ตรวจสอบ', '48° + 67° + 65° = 180° ✓']], '∠C = <b>65°</b>', 'มุมซีเท่ากับหกสิบห้าองศา')))],
    () => [Q.t6Find({ B: 82, C: 53, ask: 0 }), Q.t6Find({ B: 50, C: 50, ask: 2, names: ['A', 'B', 'C'] }), Q.t6Find({ B: 90, C: 33, ask: 2, names: ['ร', 'ล', 'ย'] }), ...pkF([[44, 71], [38, 104], [62, 58], [27, 90]], 2).map(([B, C]) => Q.t6Find({ B, C, ask: pick([0, 1, 2]) })),
      Q.hNum({ q: 'รูปสามเหลี่ยมหน้าจั่วมีมุมยอด 40° มุมที่ฐานแต่ละมุมมีขนาดกี่องศา', head: '<span class="fsign">?</span> องศา', a: 70, hint: '(180 − 40) ÷ 2' })]),
  L6T(7, 'ค่ายวงเวียน', 'การสร้างรูปสามเหลี่ยมเมื่อกำหนดความยาวด้านทั้ง 3 ด้าน', 'สร้าง (ด้าน ด้าน ด้าน)', 'สร้างรูปสามเหลี่ยมเมื่อกำหนดความยาวด้านทั้งสามด้าน โดยใช้ไม้บรรทัดและวงเวียน และรู้ว่าด้านสองด้านรวมกันต้องยาวกว่าด้านที่สาม', [
    T('ปรับความยาวด้านทั้ง 3 — ลองให้ด้านหนึ่งยาวมาก ๆ ดูว่ายังสร้างได้ไหม', 'ปรับความยาวด้านทั้งสาม ลองให้ด้านหนึ่งยาวมาก ๆ ดูว่ายังสร้างได้ไหม', el => el.append(simBuild3('SSS', [6, 4, 5]))),
    T('ขั้นตอนการสร้างด้วย<b>วงเวียน</b> (BC 6 ซม. · AB 5 ซม. · AC 4.5 ซม.)', 'ขั้นตอนการสร้างด้วยวงเวียน', el => el.append(simConstruct('SSS')))],
    () => [Q.dPick({ q: 'ด้านยาว 3, 4 และ 8 เซนติเมตร สร้างรูปสามเหลี่ยมได้หรือไม่', opts: ['ไม่ได้ เพราะ 3 + 4 น้อยกว่า 8', 'ได้ เพราะเป็นจำนวนนับ', 'ได้ เพราะมี 3 ด้าน'], right: 'ไม่ได้ เพราะ 3 + 4 น้อยกว่า 8' }),
      Q.dPick({ q: 'ด้านชุดใดสร้างรูปสามเหลี่ยมได้', opts: ['6.3, 7.2, 9.4 ซม.', '2, 3, 6 ซม.', '4, 4, 9 ซม.'], right: '6.3, 7.2, 9.4 ซม.', hint: 'ด้านสั้นสองด้านรวมกันต้องยาวกว่าด้านยาวที่สุด' }),
      Q.dPick({ q: 'สร้าง △PQR ที่มีด้านยาวด้านละ 5.8 ซม. จะได้รูปสามเหลี่ยมชนิดใด', opts: ['รูปสามเหลี่ยมด้านเท่า', 'รูปสามเหลี่ยมหน้าจั่วมุมฉาก', 'รูปสามเหลี่ยมด้านไม่เท่า'], right: 'รูปสามเหลี่ยมด้านเท่า' }),
      Q.dPick({ q: 'การสร้างรูปสามเหลี่ยมเมื่อกำหนดด้าน 3 ด้าน ต้องใช้อุปกรณ์ใด', opts: ['ไม้บรรทัดและวงเวียน', 'ไม้โปรแทรกเตอร์อย่างเดียว', 'ไม้ฉากอย่างเดียว'], right: 'ไม้บรรทัดและวงเวียน' }),
      Q.dPick({ q: 'ลำดับการสร้าง △ABC (ด้าน 3 ด้าน) ข้อใดถูกต้อง', opts: ['ลากฐาน → เขียนส่วนโค้งจากปลายทั้งสอง → ลากเส้นไปจุดตัด', 'เขียนส่วนโค้ง → วัดมุม → ลากฐาน', 'วัดมุม → ลากฐาน → เขียนส่วนโค้ง'], right: 'ลากฐาน → เขียนส่วนโค้งจากปลายทั้งสอง → ลากเส้นไปจุดตัด' })]),
  L6T(8, 'ค่ายโปรแทรกเตอร์', 'การสร้างรูปสามเหลี่ยมเมื่อกำหนดความยาวด้าน 2 ด้านและขนาดของมุม 1 มุม', 'สร้าง (ด้าน มุม ด้าน)', 'สร้างรูปสามเหลี่ยมเมื่อกำหนดความยาวด้าน 2 ด้านและขนาดของมุมระหว่างด้านทั้งสอง', [
    T('ปรับ AB, มุม B และ BC — รูปสามเหลี่ยมถูกกำหนดได้รูปเดียว', 'ปรับเอบี มุมบี และบีซี รูปสามเหลี่ยมถูกกำหนดได้รูปเดียว', el => el.append(simBuild3('SAS', [5, 50, 6]))),
    T('ขั้นตอนการสร้าง (BC 6 ซม. · ∠B 50° · AB 5 ซม.)', 'ขั้นตอนการสร้าง', el => el.append(simConstruct('SAS')))],
    () => [Q.dPick({ q: 'สร้าง △ABC ที่ AB ยาว 6 ซม. BC ยาว 8 ซม. และ ∠ABC = 45° ขั้นแรกควรทำอย่างไร', opts: ['ลาก BC (หรือ AB) ยาวตามกำหนด', 'วัดมุม 90°', 'กางวงเวียน 45 ซม.'], right: 'ลาก BC (หรือ AB) ยาวตามกำหนด' }),
      Q.dPick({ q: 'สร้าง △DEF ฐาน DE ยาว 7 ซม. ∠DEF = 110° และ EF ยาว 5 ซม. จะได้รูปสามเหลี่ยมชนิดใด (ตามมุม)', opts: ['รูปสามเหลี่ยมมุมป้าน', 'รูปสามเหลี่ยมมุมแหลม', 'รูปสามเหลี่ยมมุมฉาก'], right: 'รูปสามเหลี่ยมมุมป้าน' }),
      Q.dPick({ q: 'สร้าง △ABC ที่ AB = BC = 5 ซม. และ ∠B = 90° จะได้รูปสามเหลี่ยมชนิดใด', opts: ['มุมฉาก และหน้าจั่ว', 'มุมแหลม และด้านเท่า', 'มุมป้าน และหน้าจั่ว'], right: 'มุมฉาก และหน้าจั่ว' }),
      Q.dPick({ q: 'การสร้างแบบ “ด้าน มุม ด้าน” มุมที่กำหนดต้องอยู่ที่ใด', opts: ['ระหว่างด้านทั้งสองที่กำหนด', 'ตรงข้ามด้านที่ยาวที่สุดเสมอ', 'ที่ใดก็ได้'], right: 'ระหว่างด้านทั้งสองที่กำหนด' }),
      Q.dPick({ q: 'อุปกรณ์ที่ใช้วัดและสร้างมุมคือข้อใด', opts: ['ไม้โปรแทรกเตอร์', 'วงเวียน', 'ไม้ฉาก'], right: 'ไม้โปรแทรกเตอร์' })]),
  L6T(9, 'ค่ายสองมุม', 'การสร้างรูปสามเหลี่ยมเมื่อกำหนดความยาวด้าน 1 ด้านและขนาดของมุม 2 มุม', 'สร้าง (มุม ด้าน มุม)', 'สร้างรูปสามเหลี่ยมเมื่อกำหนดความยาวด้าน 1 ด้านและขนาดของมุมที่ปลายทั้งสองของด้านนั้น', [
    T('ปรับ BC และมุมที่ปลายทั้งสอง — ถ้ามุม B + มุม C ถึง 180° จะสร้างไม่ได้', 'ปรับบีซีและมุมที่ปลายทั้งสอง ถ้ามุมบีบวกมุมซีถึงร้อยแปดสิบองศาจะสร้างไม่ได้', el => el.append(simBuild3('ASA', [6, 40, 70]))),
    T('ขั้นตอนการสร้าง (BC 6 ซม. · ∠B 40° · ∠C 65°)', 'ขั้นตอนการสร้าง', el => el.append(simConstruct('ASA')))],
    () => [Q.dPick({ q: 'สร้าง △ABC ฐาน BC ยาว 6 ซม. ∠B = 40° ∠C = 65° มุม A มีขนาดเท่าใด', opts: ['75°', '105°', '65°'], right: '75°', hint: '180 − 40 − 65' }),
      Q.dPick({ q: 'กำหนด ∠B = 100° และ ∠C = 85° สร้างรูปสามเหลี่ยมได้หรือไม่', opts: ['ไม่ได้ เพราะมุมสองมุมรวมกันเกิน 180°', 'ได้', 'ได้ เป็นรูปสามเหลี่ยมมุมป้าน'], right: 'ไม่ได้ เพราะมุมสองมุมรวมกันเกิน 180°' }),
      Q.dPick({ q: 'สร้าง △PQR ฐาน QR ยาว 5 ซม. ∠Q = ∠R = 60° จะได้รูปสามเหลี่ยมชนิดใด', opts: ['รูปสามเหลี่ยมด้านเท่า', 'รูปสามเหลี่ยมมุมฉาก', 'รูปสามเหลี่ยมด้านไม่เท่า'], right: 'รูปสามเหลี่ยมด้านเท่า', hint: 'มุมทุกมุม 60°' }),
      Q.dPick({ q: 'สร้างรูปสามเหลี่ยมที่มุมที่ฐานทั้งสองเท่ากัน 50° จะได้รูปสามเหลี่ยมชนิดใด (ตามด้าน)', opts: ['รูปสามเหลี่ยมหน้าจั่ว', 'รูปสามเหลี่ยมด้านเท่า', 'รูปสามเหลี่ยมด้านไม่เท่า'], right: 'รูปสามเหลี่ยมหน้าจั่ว' }),
      Q.t6Find({ B: 35, C: 75, ask: 0, names: ['A', 'B', 'C'] })]),
  L6T(10, 'เส้นทางรอบเขา', 'ความยาวรอบรูปของรูปสามเหลี่ยม', 'ความยาวรอบรูป', 'หาความยาวรอบรูปของรูปสามเหลี่ยม = ผลบวกความยาวของด้านทั้งสาม', [
    T('ปรับความยาวด้าน — ดูเส้นรอบรูปถูก<b>คลี่</b>ออกมาเป็นเส้นตรง', 'ปรับความยาวด้าน ดูเส้นรอบรูปถูกคลี่ออกมาเป็นเส้นตรง', el => el.append(simPerim())),
    T('ตัวอย่างทีละขั้น: ใช้สมบัติของรูปช่วย', 'ตัวอย่างทีละขั้น ใช้สมบัติของรูปช่วย', el => el.append(dcWalk('', [['หน้าจั่ว', 'ด้านยาว 9 ซม. 2 ด้าน และฐาน 6 ซม. → 9 + 9 + 6 = 24 ซม.'], ['ด้านเท่า', 'ด้านละ 7 ม. → 3 × 7 = 21 ม.'], ['ด้านไม่เท่า', '4.5 + 6 + 7.5 = 18 ซม.']], 'ความยาวรอบรูป = ด้าน + ด้าน + ด้าน', 'ความยาวรอบรูปเท่ากับผลบวกด้านทั้งสาม')))],
    () => T6W_PER.map(o => Q.t6Num({ fig: o.fig, q: 'หาความยาวรอบรูปของรูปสามเหลี่ยม', a: o.a, unit: o.unit, hint: 'บวกความยาวด้านทั้งสาม (ขีดเหมือนกัน = ยาวเท่ากัน)' }))),
  L6T(11, 'ลานสี่เหลี่ยมครึ่งหนึ่ง', 'การหาพื้นที่ของรูปสามเหลี่ยมโดยการสร้างให้เป็นรูปสี่เหลี่ยม', 'พื้นที่ (สร้างสี่เหลี่ยม)', 'หาพื้นที่ของรูปสามเหลี่ยมโดยสร้างรูปสี่เหลี่ยมผืนผ้าล้อมรอบ — พื้นที่สามเหลี่ยมเป็นครึ่งหนึ่งของสี่เหลี่ยมผืนผ้าที่มีฐานและความสูงเท่ากัน', [
    T('ปรับฐาน ส่วนสูง และตำแหน่งจุดยอด — พื้นที่สามเหลี่ยม<b>เป็นครึ่งหนึ่ง</b>ของสี่เหลี่ยมผืนผ้าเสมอ', 'ปรับฐาน ส่วนสูง และตำแหน่งจุดยอด พื้นที่สามเหลี่ยมเป็นครึ่งหนึ่งของสี่เหลี่ยมผืนผ้าเสมอ', el => el.append(simAreaRect())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['① สร้างสี่เหลี่ยมผืนผ้า', 'ฐาน 8 ซม. สูง 5 ซม. → 8 × 5 = 40 ตร.ซม.'], ['② ลากส่วนสูง', 'แบ่งเป็นสี่เหลี่ยมเล็ก 2 รูป แต่ละรูปถูกเส้นทแยงแบ่งครึ่ง'], ['③ สามเหลี่ยมได้ครึ่งหนึ่ง', '40 ÷ 2 = 20 ตร.ซม.']], 'พื้นที่ = [1/2] × ฐาน × สูง = 20 ตร.ซม.'.replace('[1/2]', '½'), 'พื้นที่ยี่สิบตารางเซนติเมตร')))],
    () => [...t6AreaGenQs(2),
      Q.dPick({ q: 'สามเหลี่ยมที่มีฐาน 10 ซม. สูง 6 ซม. มีพื้นที่เป็นกี่เท่าของสี่เหลี่ยมผืนผ้าที่กว้าง 6 ซม. ยาว 10 ซม.', opts: ['ครึ่งหนึ่ง', 'เท่ากัน', '2 เท่า'], right: 'ครึ่งหนึ่ง' }),
      Q.hNum({ q: 'สี่เหลี่ยมผืนผ้ายาว 12 ซม. กว้าง 7 ซม. ลากเส้นทแยงมุม ได้รูปสามเหลี่ยม 1 รูป มีพื้นที่กี่ตารางเซนติเมตร', head: '<span class="fsign">?</span> ตร.ซม.', a: 42, hint: '12 × 7 ÷ 2' })]),
  L6T(12, 'ยอดสูตรพื้นที่', 'การหาพื้นที่ของรูปสามเหลี่ยมโดยใช้สูตร', 'พื้นที่ (สูตร)', 'หาพื้นที่ของรูปสามเหลี่ยมโดยใช้สูตร ½ × ฐาน × สูง (ส่วนสูงต้องคู่กับฐาน)', [
    T('เลือกฐานใดก็ได้ — ใช้ส่วนสูงที่คู่กับฐานนั้น พื้นที่ได้เท่าเดิม', 'เลือกฐานใดก็ได้ ใช้ส่วนสูงที่คู่กับฐานนั้น พื้นที่ได้เท่าเดิม', el => el.append(simAreaAny())),
    T('ตัวอย่างทีละขั้น: ระวังเลือกตัวเลขให้ถูก', 'ตัวอย่างทีละขั้น ระวังเลือกตัวเลขให้ถูก', el => el.append(dcWalk('', [['โจทย์', 'สามเหลี่ยมมีด้าน 13, 14, 15 ซม. ส่วนสูงที่ลากมาตั้งฉากกับด้าน 14 ซม. ยาว 12 ซม.'], ['เลือกคู่', 'ฐาน 14 ซม. คู่กับส่วนสูง 12 ซม. (ไม่ใช้ 13 และ 15)'], ['คำนวณ', '½ × 14 × 12 = 84 ตร.ซม.']], 'ฐานต้อง<b>คู่</b>กับส่วนสูงที่ตั้งฉากกับมัน', 'ฐานต้องคู่กับส่วนสูงที่ตั้งฉากกับมัน')))],
    () => [...pkF(T6W_AREA.slice(1, 4), 2).map(t6AreaQ), ...t6AreaGenQs(4)]),
  L6T(13, 'ฐานโจทย์รอบรูป', 'การแก้โจทย์ปัญหาเกี่ยวกับความยาวรอบรูปของรูปสามเหลี่ยม', 'โจทย์ความยาวรอบรูป', 'แก้โจทย์ปัญหาความยาวรอบรูปของรูปสามเหลี่ยม เช่น ล้อมรั้ว หาด้านที่หายไป', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('สวนรูปสามเหลี่ยมหน้าจั่ว ด้านที่เท่ากันยาวด้านละ 25 เมตร ฐานยาว 30 เมตร ล้อมรั้ว 3 รอบ ต้องใช้ลวดกี่เมตร', [{ q: 'ความยาวรอบรูป', opts: ['25 + 25 + 30', '25 + 30', '25 × 30'], right: '25 + 25 + 30', unit: 'เมตร', why: 'หน้าจั่วมีด้านยาว 25 ม. 2 ด้าน' }, { q: 'ล้อม 3 รอบ', opts: ['80 × 3', '80 + 3', '80 ÷ 3'], right: '80 × 3', unit: 'เมตร', why: 'รอบละ 80 เมตร 3 รอบ → คูณ' }], 'ตอบ ใช้ลวด <b>240</b> เมตร'))),
    T('ตัวอย่างทีละขั้น: หาด้านที่หายไป', 'ตัวอย่างทีละขั้น หาด้านที่หายไป', el => el.append(dcStory('รูปสามเหลี่ยมมีความยาวรอบรูป 36 ซม. ด้านหนึ่งยาว 10 ซม. อีกด้านยาว 15 ซม. ด้านที่สามยาวกี่ซม.', [['① รู้อะไร', 'รอบรูป 36 = 10 + 15 + ☐'], ['② ลบออก', '36 − 10 − 15'], ['③ ตรวจสอบ', '10 + 15 + 11 = 36 ✓']], '36 − 10 − 15')))],
    () => [...[0, 1, 3, 6, 10].map(i => Q.dStory(T6W_STORY[i]))]),
  L6T(14, 'ฐานโจทย์พื้นที่', 'การแก้โจทย์ปัญหาเกี่ยวกับการหาพื้นที่ของรูปสามเหลี่ยม', 'โจทย์พื้นที่', 'แก้โจทย์ปัญหาพื้นที่ของรูปสามเหลี่ยม เช่น หาพื้นที่จากฐานและความสูง หาความสูงจากพื้นที่', [
    T('วางแผนทีละขั้น: หาความสูงจากพื้นที่', 'วางแผนทีละขั้น หาความสูงจากพื้นที่', el => el.append(simStepPick('ธงสามเหลี่ยมมีพื้นที่ 450 ตารางเซนติเมตร ฐานยาว 30 เซนติเมตร ธงสูงกี่เซนติเมตร', [{ q: 'พื้นที่ × 2 (ได้ ฐาน × สูง)', opts: ['450 × 2', '450 ÷ 2', '450 + 2'], right: '450 × 2', unit: 'ตร.ซม.', why: 'พื้นที่ = ½ × ฐาน × สูง → ฐาน × สูง = พื้นที่ × 2' }, { q: 'หารด้วยฐาน', opts: ['900 ÷ 30', '900 × 30', '900 − 30'], right: '900 ÷ 30', unit: 'ซม.', why: 'ฐาน × สูง = 900 → สูง = 900 ÷ ฐาน' }], 'ตอบ ธงสูง <b>30</b> ซม.'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('ป้ายสามเหลี่ยมมีฐานยาว 1.2 เมตร สูง 0.9 เมตร ทาสีทั้ง 2 ด้าน ต้องทาสีพื้นที่รวมกี่ตารางเมตร', [['① พื้นที่ 1 ด้าน', '½ × 1.2 × 0.9 = 0.54 ตร.ม.'], ['② ทา 2 ด้าน', '0.54 × 2 = 1.08 ตร.ม.']], '1/2 × 1.2 × 0.9 × 2')))],
    () => [...[2, 4, 5, 8, 9].map(i => Q.dStory(T6W_STORY[i]))]),
  L6T(15, 'ยอดเขาสามเหลี่ยม', 'การแก้โจทย์ปัญหาเกี่ยวกับพื้นที่และความยาวรอบรูปของรูปสามเหลี่ยม', 'โจทย์พื้นที่และรอบรูป', 'แก้โจทย์ปัญหาที่ต้องใช้ทั้งพื้นที่และความยาวรอบรูปของรูปสามเหลี่ยม', [
    T('ปรับฐาน ส่วนสูง และจุดยอด — สังเกตว่า<b>พื้นที่เท่าเดิม</b> แต่ความยาวรอบรูปเปลี่ยนได้', 'ปรับฐาน ส่วนสูง และจุดยอด สังเกตว่าพื้นที่เท่าเดิม แต่ความยาวรอบรูปเปลี่ยนได้', el => el.append(simAreaRect(true))),
    T('ตัวอย่างทีละขั้น: ใช้ทั้งรอบรูปและพื้นที่', 'ตัวอย่างทีละขั้น ใช้ทั้งรอบรูปและพื้นที่', el => el.append(dcStory('แปลงหญ้ารูปสามเหลี่ยมมุมฉาก ด้านประกอบมุมฉากยาว 6 ม. และ 8 ม. ด้านตรงข้ามมุมฉากยาว 10 ม. ล้อมรั้วรอบแปลงและปูหญ้าเต็มแปลง ต้องใช้รั้วกี่เมตร และหญ้ากี่ตารางเมตร', [['① รั้ว = รอบรูป', '6 + 8 + 10 = 24 เมตร'], ['② หญ้า = พื้นที่', 'มุมฉาก: ฐาน 8 สูง 6 → ½ × 8 × 6 = 24 ตร.ม.'], ['③ ตอบ', 'รั้ว 24 เมตร · หญ้า 24 ตารางเมตร']], '')))],
    () => [...[6, 7, 2, 3, 10].map(i => Q.dStory(T6W_STORY[i])), ...t6AreaGenQs(1)])
];

/* =========================================================
   ========================================================= */
const t6xf = (B, C, o) => triSVG(t6fromAngles(B, C, 300, 180, 28), o);
const EXAM_P6C6 = d6spread([
  { q: 'รูปสามเหลี่ยมที่มีมุม 45° 90° และ 45° เป็นรูปสามเหลี่ยมชนิดใด (พิจารณาขนาดของมุม)', opts: ['รูปสามเหลี่ยมมุมฉาก', 'รูปสามเหลี่ยมมุมแหลม', 'รูปสามเหลี่ยมมุมป้าน', 'รูปสามเหลี่ยมด้านเท่า'], a: 0 },
  { q: 'รูปสามเหลี่ยมที่มีมุม 20° 20° และ 140° เป็นรูปสามเหลี่ยมชนิดใด', opts: ['รูปสามเหลี่ยมมุมป้าน', 'รูปสามเหลี่ยมมุมแหลม', 'รูปสามเหลี่ยมมุมฉาก', 'รูปสามเหลี่ยมด้านเท่า'], a: 0 },
  { q: 'รูปสามเหลี่ยมที่มีด้านยาว 7 ซม. 11 ซม. และ 7 ซม. เป็นรูปสามเหลี่ยมชนิดใด', opts: ['รูปสามเหลี่ยมหน้าจั่ว', 'รูปสามเหลี่ยมด้านเท่า', 'รูปสามเหลี่ยมด้านไม่เท่า', 'รูปสามเหลี่ยมมุมฉาก'], a: 0 },
  { q: 'รูปสามเหลี่ยมที่มีด้านยาวด้านละ 8 ซม. เป็นรูปสามเหลี่ยมชนิดใด', opts: ['รูปสามเหลี่ยมด้านเท่า', 'รูปสามเหลี่ยมด้านไม่เท่า', 'รูปสามเหลี่ยมมุมฉาก', 'รูปสามเหลี่ยมมุมป้าน'], a: 0 },
  { q: 'ข้อใด<b>เป็นไปไม่ได้</b>', opts: ['รูปสามเหลี่ยมมุมป้านด้านเท่า', 'รูปสามเหลี่ยมมุมฉากหน้าจั่ว', 'รูปสามเหลี่ยมมุมแหลมด้านเท่า', 'รูปสามเหลี่ยมมุมป้านหน้าจั่ว'], a: 0 },
  { q: 'จากรูป ถ้า ขค เป็นฐาน มุมยอดคือข้อใด', fig: t6xf(60, 70, { names: ['ก', 'ข', 'ค'], base: 1 }), opts: ['มุม ก', 'มุม ข', 'มุม ค', 'มุม ข และมุม ค'], a: 0 },
  { q: 'ส่วนสูงของรูปสามเหลี่ยมคือข้อใด', opts: ['ส่วนของเส้นตรงที่ลากจากมุมยอดมาตั้งฉากกับฐาน', 'ด้านที่ยาวที่สุดของรูป', 'ส่วนของเส้นตรงที่ลากจากมุมยอดไปกลางฐานเสมอ', 'ผลบวกของด้านทั้งสาม'], a: 0 },
  { q: 'จากรูป มุม ก มีขนาดกี่องศา', fig: t6xf(82, 53, { names: ['ก', 'ข', 'ค'], angles: ['?', 82, 53] }), opts: ['45°', '35°', '55°', '135°'], a: 0 },
  { q: 'รูปสามเหลี่ยม ABC มี ∠A = 80° และ ∠B = 50° ∠C มีขนาดเท่าใด', opts: ['50°', '60°', '40°', '130°'], a: 0 },
  { q: 'รูปสามเหลี่ยมมุมฉาก มีมุมหนึ่งขนาด 57° มุมที่เหลือมีขนาดเท่าใด', opts: ['33°', '43°', '23°', '123°'], a: 0 },
  { q: 'ด้านชุดใด<b>สร้างรูปสามเหลี่ยมไม่ได้</b>', opts: ['3, 4, 8 ซม.', '6.3, 7.2, 9.4 ซม.', '5, 5, 5 ซม.', '6, 8, 10 ซม.'], a: 0 },
  { q: 'สร้าง △DEF ฐานยาว 7 ซม. ∠DEF = 110° และ EF ยาว 5 ซม. จะได้รูปสามเหลี่ยมชนิดใด', opts: ['รูปสามเหลี่ยมมุมป้าน', 'รูปสามเหลี่ยมมุมแหลม', 'รูปสามเหลี่ยมมุมฉาก', 'รูปสามเหลี่ยมด้านเท่า'], a: 0 },
  { q: 'หาความยาวรอบรูปของรูปสามเหลี่ยม', fig: T6W_PER[0].fig, opts: ['11.3 ซม.', '10.3 ซม.', '12.3 ซม.', '8.7 ซม.'], a: 0 },
  { q: 'หาความยาวรอบรูปของรูปสามเหลี่ยม', fig: T6W_PER[4].fig, opts: ['74.6 ม.', '54.6 ม.', '94.6 ม.', '69.2 ม.'], a: 0 },
  { q: 'หาพื้นที่ของรูปสามเหลี่ยม', fig: T6W_AREA[0].fig, opts: ['6 ตร.ม.', '12 ตร.ม.', '10 ตร.ม.', '7.5 ตร.ม.'], a: 0 },
  { q: 'หาพื้นที่ของรูปสามเหลี่ยม', fig: T6W_AREA[4].fig, opts: ['63.75 ตร.ม.', '127.5 ตร.ม.', '23.5 ตร.ม.', '31.88 ตร.ม.'], a: 0 },
  { q: 'สนามเด็กเล่นมีพื้นที่เล่นทรายรูปสามเหลี่ยม ฐานยาว 10 เมตร สูง 6 เมตร มีพื้นที่กี่ตารางเมตร', opts: ['30 ตร.ม.', '60 ตร.ม.', '16 ตร.ม.', '32 ตร.ม.'], a: 0 },
  { q: 'บ่อน้ำรูปสามเหลี่ยม มีด้านหนึ่งยาว 7 เมตร อีกด้านยาว 9 เมตร ความยาวรอบรูป 25 เมตร ด้านที่สามยาวกี่เมตร', opts: ['9 เมตร', '16 เมตร', '41 เมตร', '8 เมตร'], a: 0 },
  { q: 'สามเหลี่ยม ABC มีพื้นที่ 800 ตารางเซนติเมตร ฐาน AB ยาว 20 เซนติเมตร ส่วนสูงยาวกี่เซนติเมตร', opts: ['80 ซม.', '40 ซม.', '160 ซม.', '20 ซม.'], a: 0 },
  { q: 'ต้อมทาสีรั้วรอบสวนสามเหลี่ยมด้านยาว 16, 20 และ 24 เมตร ทารั้วยาว 10 เมตร ใช้สี 1 ถัง ต้องใช้สีกี่ถัง', opts: ['6 ถัง', '60 ถัง', '5 ถัง', '8 ถัง'], a: 0 }
]);
LESSONS_P6C6.push({ id: 819, boss: true, place: 'ยอดเขาเยติสามเหลี่ยม', title: 'ด่านบอส: บทที่ 6 รูปสามเหลี่ยม', short: 'ด่านบอส · ข้อสอบ', tone: 'coral',
  goal: 'คำถามท้ายบท 20 ข้อ (ชนิดของรูปสามเหลี่ยม ส่วนต่าง ๆ มุมภายใน การสร้าง ความยาวรอบรูป และพื้นที่) ตอบถูก 10 ข้อขึ้นไปเพื่อพิชิตยอดเขา',
  exam: EXAM_P6C6, pass: 10, bossName: 'เยติสามเหลี่ยม', bossPal: 'coral', emblem: '△', bossKind: 'yeti' });
