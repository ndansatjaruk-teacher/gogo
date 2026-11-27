/* =========================================================
   ม.1 บทที่ 5 รูปเรขาคณิตสองมิติและสามมิติ — เกม/บอส + เครื่องยนต์ 3 มิติ (v275 · ผู้ใช้ขอ) · prefix s5
   - s5Solid(kind) รูปทรง (จุดยอด V · หน้า F · สัน E) · s5Draw วาดแบบมุมมองเอียง (หน้าไกลก่อน เงาตามทิศ สันที่ถูกบังเป็นเส้นประ)
   - s5View(S) รูปทรงที่ลากหมุนได้ + แตะเลือกจุดยอด/สัน/หน้า · s5Net + s5Fold ภาพคลี่ที่พับได้จริง (บานพับต่อกันเป็นต้นไม้)
   - s5Stack ลูกบาศก์ซ้อน (ภาพด้านหน้า/ข้าง/บน คำนวณจากความสูง) · s5Cut หน้าตัดของระนาบกับรูปทรง
   ========================================================= */
const S5C = { ink: '#2B2550', p: '#E5487A', b: '#3D8FD6', g: '#2FAF7C', o: '#F08A24', v: '#7C5CE0', y: '#F3C548', fade: '#C9C1E3',
  f: ['#8FD3F4', '#FFD27A', '#B9A6F5', '#9EE6C0', '#FFB3C1', '#A7C7FF', '#FFE08A', '#C4E8A0'] };
const s5N = v => Math.round(v * 100) / 100;
const s5R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const s5Pk = a => a[Math.floor(Math.random() * a.length)];
/* ---------- vector helpers ---------- */
const s5Sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], s5Add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], s5Mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const s5Dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], s5Crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const s5Len = a => Math.hypot(a[0], a[1], a[2]), s5Unit = a => s5Mul(a, 1 / (s5Len(a) || 1));
const s5Avg = P => s5Mul(P.reduce((s, p) => s5Add(s, p), [0, 0, 0]), 1 / P.length);
const s5Newell = P => { const n = [0, 0, 0]; P.forEach((p, i) => { const q = P[(i + 1) % P.length]; n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]); }); return n; };
/* view rotation: yaw about the vertical axis, then pitch (positive = look from above) */
const s5Rot = (p, yaw, pit) => { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit), x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy; return [x1, p[1] * cp - z1 * sp, p[1] * sp + z1 * cp]; };
/* rotate p about the axis through A along unit u by th (Rodrigues) */
const s5RotAx = (p, A, u, th) => { const v = s5Sub(p, A), c = Math.cos(th), s = Math.sin(th); return s5Add(A, s5Add(s5Add(s5Mul(v, c), s5Mul(s5Crs(u, v), s)), s5Mul(u, s5Dot(u, v) * (1 - c)))); };

/* ---------- solids ---------- */
const S5_NAME = { cube: 'ลูกบาศก์', cuboid: 'ทรงสี่เหลี่ยมมุมฉาก', prism3: 'ปริซึมสามเหลี่ยม', prism5: 'ปริซึมห้าเหลี่ยม', prism6: 'ปริซึมหกเหลี่ยม', pyr3: 'พีระมิดฐานสามเหลี่ยม', pyr4: 'พีระมิดฐานสี่เหลี่ยม', pyr5: 'พีระมิดฐานห้าเหลี่ยม', pyr6: 'พีระมิดฐานหกเหลี่ยม', cyl: 'ทรงกระบอก', cone: 'กรวย', sph: 'ทรงกลม' };
function s5Solid(k, o = {}) {
  let V = [], F = [], smooth = new Set(); const ring = (n, r, y, a0) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 2 * Math.PI / n; return [r * Math.cos(a), y, r * Math.sin(a)]; });
  const m = /^(prism|pyr)(\d)$/.exec(k);
  if (k === 'cube' || k === 'cuboid') { const [a, b, c] = k === 'cube' ? [o.a || 2, o.a || 2, o.a || 2] : [o.a || 2.8, o.b || 1.6, o.c || 1.5];
    V = [[-a, -b, -c], [a, -b, -c], [a, b, -c], [-a, b, -c], [-a, -b, c], [a, -b, c], [a, b, c], [-a, b, c]].map(p => [p[0] / 2, p[1] / 2, p[2] / 2]);
    F = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [3, 7, 6, 2], [0, 4, 7, 3], [1, 2, 6, 5]]; }
  else if (m || k === 'cyl' || k === 'cone') {
    const n = m ? +m[2] : 40, pr = m ? m[1] === 'prism' : k === 'cyl', r = o.r || (n === 3 ? 1.45 : n === 4 ? 1.35 : 1.25), hgt = o.h || (pr ? 2 : 2.3), a0 = n === 4 ? Math.PI / 4 : n === 3 ? Math.PI / 6 : Math.PI / 2 + Math.PI / n;
    V = ring(n, r, -hgt / 2, a0); F.push([...Array(n).keys()].reverse());
    if (pr) { V.push(...ring(n, r, hgt / 2, a0)); F.push([...Array(n).keys()].map(i => n + i)); for (let i = 0; i < n; i++) { F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]); if (n > 12) smooth.add(F.length - 1); } }
    else { V.push([0, hgt / 2, 0]); for (let i = 0; i < n; i++) { F.push([i, (i + 1) % n, n]); if (n > 12) smooth.add(F.length - 1); } } }
  else if (k === 'sph') { const la = 14, lo = 24, r = o.r || 1.4; V.push([0, -r, 0]); for (let i = 1; i < la; i++) { const t = -Math.PI / 2 + i * Math.PI / la; V.push(...ring(lo, r * Math.cos(t), r * Math.sin(t), 0)); } V.push([0, r, 0]);
    const id = (i, j) => 1 + (i - 1) * lo + (j % lo), top = V.length - 1;
    for (let j = 0; j < lo; j++) { F.push([0, id(1, j), id(1, j + 1)]); F.push([top, id(la - 1, j + 1), id(la - 1, j)]); for (let i = 1; i < la - 1; i++) F.push([id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)]); }
    F.forEach((_, i) => smooth.add(i)); }
  if (o.scale) V = V.map(p => s5Mul(p, o.scale));
  const c = s5Avg(V); F = F.map(f => s5Dot(s5Newell(f.map(i => V[i])), s5Sub(s5Avg(f.map(i => V[i])), c)) < 0 ? f.slice().reverse() : f); /* every face turned outward */
  const E = [], ek = new Map(); F.forEach((f, fi) => f.forEach((a, j) => { const b = f[(j + 1) % f.length], key = a < b ? a + ',' + b : b + ',' + a; if (ek.has(key)) E[ek.get(key)][3] = fi; else { ek.set(key, E.length); E.push([a, b, fi, -1]); } }));
  return { k, V, F, E, smooth, name: S5_NAME[k] || k, fc: o.fc || null }; }
/* counts that children learn (curved solids: faces = flat faces + curved surface) */
const S5_CNT = { cube: [6, 12, 8], cuboid: [6, 12, 8], prism3: [5, 9, 6], prism5: [7, 15, 10], prism6: [8, 18, 12], pyr3: [4, 6, 4], pyr4: [5, 8, 5], pyr5: [6, 10, 6], pyr6: [7, 12, 7] };
const s5Prism = n => [n + 2, 3 * n, 2 * n], s5Pyr = n => [n + 1, 2 * n, n + 1];
const S5_POLY = { 3: 'สามเหลี่ยม', 4: 'สี่เหลี่ยม', 5: 'ห้าเหลี่ยม', 6: 'หกเหลี่ยม', 7: 'เจ็ดเหลี่ยม', 8: 'แปดเหลี่ยม', 9: 'เก้าเหลี่ยม', 10: 'สิบเหลี่ยม' };

/* ---------- drawing ---------- */
const s5Hex = (c, k) => { const n = parseInt(c.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
/* o: yaw pit W H sc cx cy · hid (hidden edges dashed) · xray (back faces faint) · col(i) face colour · mark {v,e,f: Set} · pick ('v'|'e'|'f') · vlab (vertex names) · lw */
function s5Draw(S, o = {}) {
  const W = o.W || 400, H = o.H || 240, sc = o.sc || 52, cx = o.cx ?? W / 2, cy = o.cy ?? H / 2 + 6, yaw = o.yaw ?? .62, pit = o.pit ?? .42, P = S.V.map(p => s5Rot(p, yaw, pit)), X = p => s5N(cx + p[0] * sc), Y = p => s5N(cy - p[1] * sc), L = s5Unit([-.45, .75, .55]), mk = o.mark || {};
  const fs = S.F.map((f, i) => { const Q = f.map(j => P[j]), n = s5Unit(s5Newell(Q)); return { i, f, n, z: s5Avg(Q)[2], front: n[2] > 1e-6 }; }), lw = o.lw || 2.2;
  const col = i => o.col ? o.col(i) : S.fc ? S.fc[i] : S.smooth.has(i) ? S5C.f[0] : S5C.f[(i + 1) % S5C.f.length];
  let s = '';
  fs.filter(F => F.front || o.xray).sort((a, b) => a.z - b.z).forEach(F => { const sh = .62 + .38 * Math.max(0, s5Dot(F.n, L)), c0 = mk.f && mk.f.has(F.i) ? '#FF8FB0' : col(F.i), c = s5Hex(c0, sh), pts = F.f.map(j => X(P[j]) + ',' + Y(P[j])).join(' ');
    s += `<polygon points="${pts}" fill="${c}" ${F.front ? '' : 'fill-opacity=".18" '}stroke="${S.smooth.has(F.i) ? c : 'none'}" stroke-width="${S.smooth.has(F.i) ? .8 : 0}" stroke-linejoin="round"${o.pick === 'f' && F.front ? ` data-f="${F.i}" class="s5hit"` : ''}/>`; });
  const fr = i => i >= 0 && fs[i].front, sm = i => i < 0 || S.smooth.has(i);
  S.E.forEach(([a, b, f1, f2], ei) => { const A = P[a], B = P[b], v1 = fr(f1), v2 = fr(f2), both = sm(f1) && sm(f2), on = mk.e && mk.e.has(ei);
    if (v1 && v2 && both && !on) return; if (!v1 && !v2 && (both || !o.hid) && !on) return;
    const vis = v1 || v2; s += `<line x1="${X(A)}" y1="${Y(A)}" x2="${X(B)}" y2="${Y(B)}" stroke="${on ? S5C.p : S5C.ink}" stroke-width="${on ? lw + 2.6 : vis ? lw : lw * .7}" stroke-linecap="round"${vis ? '' : ' stroke-dasharray="5 4" opacity=".7"'}/>`;
    if (o.pick === 'e' && vis) s += `<line x1="${X(A)}" y1="${Y(A)}" x2="${X(B)}" y2="${Y(B)}" stroke="transparent" stroke-width="18" stroke-linecap="round" data-e="${ei}" class="s5hit"/>`; });
  const vis = S.V.map((_, j) => fs.some(F => F.front && F.f.includes(j)));
  if (o.vtx || mk.v || o.pick === 'v') S.V.forEach((_, j) => { if (!vis[j] && !(mk.v && mk.v.has(j) && o.hid)) return; const on = mk.v && mk.v.has(j); if (!on && !o.vtx && o.pick !== 'v') return;
    s += `<circle cx="${X(P[j])}" cy="${Y(P[j])}" r="${on ? 7 : o.pick === 'v' ? 4.5 : 4}" fill="${on ? S5C.p : '#fff'}" stroke="${on ? '#fff' : S5C.ink}" stroke-width="2"/>`;
    if (o.pick === 'v' && vis[j]) s += `<circle cx="${X(P[j])}" cy="${Y(P[j])}" r="16" fill="transparent" data-v="${j}" class="s5hit"/>`; });
  if (o.vlab) o.vlab.forEach((t, j) => { if (!t || !vis[j]) return; const q = P[j], d = s5Unit([q[0], q[1], 0]); s += `<text x="${s5N(X(q) + d[0] * 15)}" y="${s5N(Y(q) - d[1] * 15 + 6)}" text-anchor="middle" class="s5l">${t}</text>`; });
  return s; }
const s5Svg = (inner, W = 400, H = 240, cls = 's5fig') => `<svg viewBox="0 0 ${W} ${H}" class="${cls}" aria-hidden="true">${inner}</svg>`;
/* a small still picture of a solid (options, story pictures) */
const s5Pic = (k, o = {}) => { const S = typeof k === 'string' ? s5Solid(k, o) : k, W = o.W || 160, H = o.H || 130; return s5Svg(s5Draw(S, { W, H, sc: o.sc || 30, hid: o.hid ?? true, yaw: o.yaw, pit: o.pit, lw: 1.8, ...o }), W, H, o.cls || 's5mini'); };
const s5T = (x, y, t, col = S5C.ink, cls = 's5l', anc = 'middle') => `<text x="${s5N(x)}" y="${s5N(y)}" text-anchor="${anc}" class="${cls}" style="fill:${col}">${t}</text>`;

/* ---------- interactive viewer: drag to turn · tap to pick ---------- */
function s5View(S, o = {}) {
  const W = o.W || 400, H = o.H || 260; let yaw = o.yaw ?? .62, pit = o.pit ?? .42, anim = 0; const mark = o.mark || { v: new Set(), e: new Set(), f: new Set() };
  const el = h('div', { class: 's5v ia' + (o.cls ? ' ' + o.cls : '') });
  const draw = () => { el.innerHTML = s5Svg((o.under ? o.under(yaw, pit) : '') + s5Draw(o.solid ? o.solid() : S, { ...o, W, H, yaw, pit, mark }) + (o.over ? o.over(yaw, pit) : ''), W, H, 's5svg'); };
  let st = null;
  el.addEventListener('pointerdown', e => { if (e.button > 0) return; const t = e.target.closest('[data-v],[data-e],[data-f],[data-grip]'); st = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t, mv: false, grip: t && t.dataset.grip != null }; try { el.setPointerCapture(e.pointerId); } catch (_) { } e.preventDefault(); });
  el.addEventListener('pointermove', e => { if (!st) return; const dx = e.clientX - st.x, dy = e.clientY - st.y; if (!st.mv && Math.hypot(dx, dy) < 6) return; st.mv = true; st.x = e.clientX; st.y = e.clientY;
    if (st.grip && o.onGrip) { o.onGrip(dx, dy, yaw, pit); draw(); return; } if (o.lock) return; cancelAnimationFrame(anim); yaw += dx * .012; pit = Math.max(-1.35, Math.min(1.35, pit + dy * .012)); draw(); if (o.onTurn) o.onTurn(yaw, pit); });
  /* the nearest vertex / edge to the finger wins (not the top-most hit area — edges that cross in the picture overlap) */
  const near = (x, y) => { const svg = el.querySelector('svg'); if (!svg || !o.pick || o.pick === 'f') return null; const m = svg.getScreenCTM(); if (!m) return null; const q = svg.createSVGPoint(); q.x = x; q.y = y; const p = q.matrixTransform(m.inverse()); let best = null, bd = 22;
    svg.querySelectorAll(o.pick === 'v' ? '[data-v]' : '[data-e]').forEach(e => { let d; if (o.pick === 'v') d = Math.hypot(+e.getAttribute('cx') - p.x, +e.getAttribute('cy') - p.y);
      else { const x1 = +e.getAttribute('x1'), y1 = +e.getAttribute('y1'), x2 = +e.getAttribute('x2'), y2 = +e.getAttribute('y2'), L2 = (x2 - x1) ** 2 + (y2 - y1) ** 2 || 1, t = Math.max(0, Math.min(1, ((p.x - x1) * (x2 - x1) + (p.y - y1) * (y2 - y1)) / L2)); d = Math.hypot(x1 + t * (x2 - x1) - p.x, y1 + t * (y2 - y1) - p.y); }
      if (d < bd) { bd = d; best = e; } }); return best; };
  const up = () => { if (st && !st.mv && o.pick) st.t = near(st.x0, st.y0) || st.t; if (st && !st.mv && st.t && o.pick) { const d = st.t.dataset, kind = d.v != null ? 'v' : d.e != null ? 'e' : d.f != null ? 'f' : null, id = +(d.v ?? d.e ?? d.f);
      if (kind && !o.done?.()) { const set = mark[kind]; if (set.has(id)) set.delete(id); else set.add(id); sfx.tap(); draw(); o.onPick && o.onPick(kind, id, mark); } }
    else if (st && !st.mv && o.onTap) o.onTap(); st = null; };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', () => { st = null; });
  Object.assign(el, { draw, mark, get yaw() { return yaw; }, get pit() { return pit; },
    turnTo: (y2, p2, ms = 700) => { cancelAnimationFrame(anim); const y0 = yaw, p0 = pit, t0 = performance.now(), dy = ((y2 - y0 + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      const f = now => { const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; yaw = y0 + dy * e; pit = p0 + (p2 - p0) * e; draw(); if (t < 1) anim = requestAnimationFrame(f); }; anim = requestAnimationFrame(f); } });
  draw(); return el; }

/* ---------- nets that fold: faces in the flat net, each hinged to a parent ---------- */
/* face = { p: [[x, y] …], par, a, b (hinge points), ang (degrees at t = 1), c (colour) } — parents come before children */
function s5Fold(N, t) {
  const M = [], out = [];
  N.forEach((f, i) => { if (f.par == null) { M[i] = p => p; return; }
    const A = [...f.a, 0], u = s5Unit(s5Sub([...f.b, 0], A)), cen = [...f.p.reduce((s, q) => [s[0] + q[0] / f.p.length, s[1] + q[1] / f.p.length], [0, 0]), 0];
    if (f.sg == null) f.sg = s5RotAx(cen, A, u, .1)[2] > 0 ? 1 : -1; const th = f.sg * f.ang * Math.PI / 180 * t, pm = M[f.par]; M[i] = p => pm(s5RotAx(p, A, u, th)); });
  N.forEach((f, i) => out.push(f.p.map(q => M[i]([q[0], q[1], 0])))); return out; }
const s5Ngon = (n, s, cx = 0, cy = 0, a0) => { const r = s / (2 * Math.sin(Math.PI / n)), a = a0 ?? (Math.PI / 2 + Math.PI / n); return Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a + i * 2 * Math.PI / n), cy + r * Math.sin(a + i * 2 * Math.PI / n)]); };
/* grid nets of the cube: cells [[c, r] …] */
function s5NetGrid(cells, a = 1) {
  const N = [], idx = new Map(), key = (c, r) => c + ',' + r; cells.forEach((q, i) => idx.set(key(...q), i));
  const seen = new Set([0]), order = [0], par = { 0: null };
  for (let k = 0; k < order.length; k++) { const [c, r] = cells[order[k]]; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dc, dr]) => { const j = idx.get(key(c + dc, r + dr)); if (j != null && !seen.has(j)) { seen.add(j); order.push(j); par[j] = order[k]; } }); }
  const pos = new Map(order.map((j, k) => [j, k]));
  order.forEach(j => { const [c, r] = cells[j], p = [[c * a, r * a], [(c + 1) * a, r * a], [(c + 1) * a, (r + 1) * a], [c * a, (r + 1) * a]], f = { p, cell: j, c: S5C.f[j % 6] };
    if (par[j] != null) { const [pc, pr] = cells[par[j]]; f.par = pos.get(par[j]); f.ang = 90;
      if (pc !== c) { const x = Math.max(pc, c) * a; f.a = [x, r * a]; f.b = [x, (r + 1) * a]; } else { const y = Math.max(pr, r) * a; f.a = [c * a, y]; f.b = [(c + 1) * a, y]; } }
    N.push(f); }); return N; }
function s5NetCuboid(L = 2.4, Wd = 1.4, H = 1.2) {
  const R = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  return [{ p: R(0, 0, L, Wd), c: S5C.f[1] }, { p: R(0, -H, L, 0), par: 0, a: [0, 0], b: [L, 0], ang: 90, c: S5C.f[0] }, { p: R(0, Wd, L, Wd + H), par: 0, a: [0, Wd], b: [L, Wd], ang: 90, c: S5C.f[0] },
    { p: R(-H, 0, 0, Wd), par: 0, a: [0, 0], b: [0, Wd], ang: 90, c: S5C.f[2] }, { p: R(L, 0, L + H, Wd), par: 0, a: [L, 0], b: [L, Wd], ang: 90, c: S5C.f[2] }, { p: R(0, Wd + H, L, 2 * Wd + H), par: 2, a: [0, Wd + H], b: [L, Wd + H], ang: 90, c: S5C.f[1] }]; }
/* prism: base polygon in the middle, a rectangle on every edge, the top on the first rectangle */
function s5NetPrism(n, s = 1.3, H = 1.5) {
  const B = s5Ngon(n, s), N = [{ p: B, c: S5C.f[1] }];
  for (let i = 0; i < n; i++) { const a = B[i], b = B[(i + 1) % n], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o = s5Unit([c[0], c[1], 0]), d = [o[0] * H, o[1] * H];
    N.push({ p: [a, b, [b[0] + d[0], b[1] + d[1]], [a[0] + d[0], a[1] + d[1]]], par: 0, a, b, ang: 90, c: S5C.f[0] }); }
  const R = N[1].p, a = R[3], b = R[2], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o = s5Unit([m[0], m[1], 0]), ap = s / (2 * Math.tan(Math.PI / n)), C = [m[0] + o[0] * ap, m[1] + o[1] * ap];
  const ang0 = Math.atan2(a[1] - C[1], a[0] - C[0]), r = s / (2 * Math.sin(Math.PI / n)), top = Array.from({ length: n }, (_, i) => [C[0] + r * Math.cos(ang0 - i * 2 * Math.PI / n), C[1] + r * Math.sin(ang0 - i * 2 * Math.PI / n)]);
  N.push({ p: top, par: 1, a, b, ang: 90, c: S5C.f[1] }); return N; }
/* pyramid: base polygon, a triangle on every edge (fold up to meet at the apex) */
function s5NetPyr(n, s = 1.5, h = 1.5) {
  const B = s5Ngon(n, s), ap = s / (2 * Math.tan(Math.PI / n)), sl = Math.hypot(h, ap), ang = 180 - Math.atan2(h, ap) * 180 / Math.PI, N = [{ p: B, c: S5C.f[1] }];
  for (let i = 0; i < n; i++) { const a = B[i], b = B[(i + 1) % n], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o = s5Unit([c[0], c[1], 0]); N.push({ p: [a, b, [c[0] + o[0] * sl, c[1] + o[1] * sl]], par: 0, a, b, ang, c: S5C.f[3] }); }
  return N; }
/* draw a net folded by t (0 = flat, 1 = closed) — flat net lies on the floor, folding lifts faces up */
function s5DrawNet(N, t, o = {}) {
  const W = o.W || 400, H = o.H || 260, Q = s5Fold(N, t).map(f => f.map(p => [p[0], p[2], p[1]])), all = Q.flat(), c = s5Avg(all), mn = [0, 1, 2].map(k => Math.min(...all.map(p => p[k]))), mx = [0, 1, 2].map(k => Math.max(...all.map(p => p[k])));
  const fl = N.flatMap(f => f.p), fw = Math.max(...fl.map(p => p[0])) - Math.min(...fl.map(p => p[0])), fh = Math.max(...fl.map(p => p[1])) - Math.min(...fl.map(p => p[1])); /* one scale for the whole fold (from the flat net), so the picture does not jump */
  const cen = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2], yaw = o.yaw ?? .5, pit = o.pit ?? .75, sc = o.sc || Math.min((W - 30) / fw, (H - 30) / (fh * .8 + .2 * fw)) * .92, L = s5Unit([-.45, .75, .55]);
  const P = Q.map(f => f.map(p => s5Rot(s5Sub(p, cen), yaw, pit))), X = p => s5N(W / 2 + p[0] * sc), Y = p => s5N(H / 2 + 6 - p[1] * sc);
  return P.map((f, i) => ({ f, i, z: s5Avg(f)[2], n: s5Unit(s5Newell(f)) })).sort((a, b) => a.z - b.z).map(F => { const sh = .62 + .38 * Math.abs(s5Dot(F.n, L)), back = F.n[2] < 0;
    return `<polygon points="${F.f.map(p => X(p) + ',' + Y(p)).join(' ')}" fill="${s5Hex(N[F.i].c || S5C.f[0], back ? sh * .86 : sh)}" stroke="${S5C.ink}" stroke-width="2" stroke-linejoin="round"/>` + (N[F.i].lab && !back ? (q => s5T(X(q), Y(q) + 7, N[F.i].lab, S5C.ink, 's5l'))(s5Avg(F.f)) : ''); }).join(''); }
/* a flat net drawn straight from above (pictures for choices) */
function s5NetFlat(N, o = {}) {
  const W = o.W || 160, H = o.H || 120, all = N.flatMap(f => f.p), mn = [Math.min(...all.map(p => p[0])), Math.min(...all.map(p => p[1]))], mx = [Math.max(...all.map(p => p[0])), Math.max(...all.map(p => p[1]))];
  const sc = Math.min((W - 14) / (mx[0] - mn[0]), (H - 14) / (mx[1] - mn[1])), ox = (W - (mx[0] - mn[0]) * sc) / 2, oy = (H - (mx[1] - mn[1]) * sc) / 2, X = p => s5N(ox + (p[0] - mn[0]) * sc), Y = p => s5N(oy + (p[1] - mn[1]) * sc);
  return s5Svg(N.map(f => `<polygon points="${f.p.map(p => X(p) + ',' + Y(p)).join(' ')}" fill="${f.c || S5C.f[0]}" stroke="${S5C.ink}" stroke-width="1.8" stroke-linejoin="round"/>` + (f.lab ? s5T(X(s5Avg(f.p.map(p => [...p, 0]))), Y(s5Avg(f.p.map(p => [...p, 0]))) + 6, f.lab, S5C.ink, 's5l') : '')).join(''), W, H, o.cls || 's5mini'); }
/* cylinder and cone nets (flat pictures) */
const s5NetCyl = (o = {}) => { const W = o.W || 160, H = o.H || 120, r = H * .14, w = 2 * Math.PI * r, x0 = (W - w) / 2, hh = H - 4 * r - 10, y0 = 2 * r + 5;
  return s5Svg(`<rect x="${s5N(x0)}" y="${s5N(y0)}" width="${s5N(w)}" height="${s5N(hh)}" fill="${S5C.f[0]}" stroke="${S5C.ink}" stroke-width="1.8"/><circle cx="${s5N(x0 + w / 2)}" cy="${s5N(y0 - r)}" r="${s5N(r)}" fill="${S5C.f[1]}" stroke="${S5C.ink}" stroke-width="1.8"/><circle cx="${s5N(x0 + w / 2)}" cy="${s5N(y0 + hh + r)}" r="${s5N(r)}" fill="${S5C.f[1]}" stroke="${S5C.ink}" stroke-width="1.8"/>`, W, H, o.cls || 's5mini'); };
const s5NetCone = (o = {}) => { const W = o.W || 160, H = o.H || 120, R = H * .55, r = R * .36, cx = W / 2, cy = 8, a = 2 * Math.PI * r / R, a0 = Math.PI / 2 - a / 2, a1 = a0 + a, P = t => [cx + R * Math.cos(t), cy + R * Math.sin(t)];
  return s5Svg(`<path d="M${cx} ${cy} L${s5N(P(a0)[0])} ${s5N(P(a0)[1])} A${R} ${R} 0 0 1 ${s5N(P(a1)[0])} ${s5N(P(a1)[1])} Z" fill="${S5C.f[0]}" stroke="${S5C.ink}" stroke-width="1.8"/><circle cx="${cx}" cy="${s5N(cy + R + r)}" r="${s5N(r)}" fill="${S5C.f[1]}" stroke="${S5C.ink}" stroke-width="1.8"/>`, W, H, o.cls || 's5mini'); };
/* the 11 nets of a cube, and 6-square shapes that do not fold into a cube */
const S5_CUBE_NETS = [[[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]], [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [0, 2]], [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 2]], [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [1, 2]],
  [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [2, 2]], [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [3, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [1, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]]];
const S5_NOT_NETS = [[[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [1, 0]], [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 0]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [2, 3]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]].map(([c, r]) => r === 3 ? [2, 3] : [c, r]), [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [2, 2]]];
/* fold a 6-square shape for real: returns, for every square (in the given order), the index of the square that ends up opposite — null if two squares land on the same side (not a cube net) */
function s5Opp(cells) {
  if (cells.length !== 6) return null; const N = s5NetGrid(cells), Q = s5Fold(N, 1), C = Q.map(f => s5Avg(f)), M = s5Avg(C), D = C.map(c => s5Sub(c, M).map(v => Math.round(v * 2)));
  if (new Set(D.map(d => d.join())).size !== 6) return null; const opp = new Array(6);
  N.forEach((f, i) => { const j = D.findIndex(d => d.every((v, k) => v === -D[i][k])); opp[f.cell] = N[j].cell; }); return opp; }


/* ---------- cube stacks: heights H[row][col] (row 0 = back) ---------- */
function s5Stack(Hs) {
  const V = [], F = [], fc = [], R = Hs.length, C = Hs[0].length, at = (r, c, k) => r >= 0 && c >= 0 && r < R && c < C && Hs[r][c] > k;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) for (let k = 0; k < Hs[r][c]; k++) {
    const x = c - C / 2, y = k - .9, z = r - R / 2, q = (a, b, cc) => { V.push([x + a, y + b, z + cc]); return V.length - 1; }, face = (pts, col) => { F.push(pts.map(p => q(...p))); fc.push(col); };
    if (k === Hs[r][c] - 1) face([[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], '#FFD27A');
    if (k === 0) face([[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], '#FFD27A');
    if (!at(r + 1, c, k)) face([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], '#8FD3F4');
    if (!at(r - 1, c, k)) face([[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], '#8FD3F4');
    if (!at(r, c + 1, k)) face([[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], '#B9A6F5');
    if (!at(r, c - 1, k)) face([[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]], '#B9A6F5'); }
  return { V, F, fc, H: Hs }; }
/* draw the stack: every visible square face with its own outline (no shared-edge logic) */
function s5DrawStack(T, o = {}) {
  const W = o.W || 400, H = o.H || 240, sc = o.sc || 34, yaw = o.yaw ?? .62, pit = o.pit ?? .5, L = s5Unit([-.45, .75, .55]), P = T.V.map(p => s5Rot(p, yaw, pit)), X = p => s5N((o.cx ?? W / 2) + p[0] * sc), Y = p => s5N((o.cy ?? H / 2 + 10) - p[1] * sc);
  return T.F.map((f, i) => { const Q = f.map(j => P[j]), n = s5Unit(s5Newell(Q)); return { f: Q, i, n, z: s5Avg(Q)[2] + n[2] * .02 }; }).filter(F => F.n[2] > 1e-6).sort((a, b) => a.z - b.z)
    .map(F => `<polygon points="${F.f.map(p => X(p) + ',' + Y(p)).join(' ')}" fill="${s5Hex(T.fc[F.i], .7 + .3 * Math.max(0, s5Dot(F.n, L)))}" stroke="${S5C.ink}" stroke-width="${o.lw || 1.8}" stroke-linejoin="round"/>`).join(''); }
const s5Count = Hs => Hs.flat().reduce((a, b) => a + b, 0);
/* views: front = looking from the front (row R-1 side) · side = from the right · top = from above (rows back→front) */
const s5Views = Hs => { const R = Hs.length, C = Hs[0].length;
  return { front: Array.from({ length: C }, (_, c) => Math.max(...Hs.map(r => r[c]))), side: Array.from({ length: R }, (_, r) => Math.max(...Hs[R - 1 - r])), top: Hs.map(r => r.map(v => v > 0 ? 1 : 0)) }; };
/* a 2-D view as a grid of squares: cols = heights (front/side) or a 0/1 grid (top) */
function s5ViewPic(v, o = {}) {
  const cols = Array.isArray(v[0]) ? null : v, rows = cols ? Math.max(1, ...cols) : v.length, n = cols ? cols.length : v[0].length, W = o.W || 160, H = o.H || 120, a = Math.min((W - 16) / n, (H - 16) / rows, o.max || 30), ox = (W - a * n) / 2, oy = (H - a * rows) / 2;
  let s = ''; for (let c = 0; c < n; c++) for (let r = 0; r < rows; r++) { const on = cols ? cols[c] >= rows - r : v[r][c]; if (on) s += `<rect x="${s5N(ox + c * a)}" y="${s5N(oy + r * a)}" width="${s5N(a)}" height="${s5N(a)}" fill="${o.col || '#8FD3F4'}" stroke="${S5C.ink}" stroke-width="1.8"/>`; }
  return s5Svg(s, W, H, o.cls || 's5mini'); }

/* ---------- a plane cutting a solid: the cross-section polygon (convex solids) ---------- */
function s5Cut(S, n, d) {
  const pts = [], eps = 1e-7, nn = s5Unit(n);
  S.E.forEach(([a, b]) => { const A = S.V[a], B = S.V[b], da = s5Dot(nn, A) - d, db = s5Dot(nn, B) - d; if (Math.abs(da) < eps) pts.push(A); if (Math.abs(db) < eps) pts.push(B); if (da * db < -eps * eps) pts.push(s5Add(A, s5Mul(s5Sub(B, A), da / (da - db)))); });
  const U = []; pts.forEach(p => { if (!U.some(q => s5Len(s5Sub(p, q)) < 1e-5)) U.push(p); }); if (U.length < 3) return null;
  const c = s5Avg(U), u = s5Unit(Math.abs(nn[1]) < .9 ? s5Crs(nn, [0, 1, 0]) : s5Crs(nn, [1, 0, 0])), v = s5Crs(nn, u);
  U.sort((p, q) => Math.atan2(s5Dot(s5Sub(p, c), v), s5Dot(s5Sub(p, c), u)) - Math.atan2(s5Dot(s5Sub(q, c), v), s5Dot(s5Sub(q, c), u)));
  return { P: U, u, v, c, n: nn, flat: U.map(p => [s5Dot(s5Sub(p, c), u), s5Dot(s5Sub(p, c), v)]) }; }
/* the section shape drawn flat (true shape) */
const s5CutPic = (C, o = {}) => { const W = o.W || 160, H = o.H || 120; if (!C) return s5Svg(s5T(W / 2, H / 2 + 6, 'ยังไม่ตัด', S5C.fade), W, H, o.cls || 's5mini');
  const xs = C.flat.map(p => p[0]), ys = C.flat.map(p => p[1]), sc = Math.min((W - 20) / Math.max(.3, Math.max(...xs) - Math.min(...xs)), (H - 20) / Math.max(.3, Math.max(...ys) - Math.min(...ys)), o.max || 60);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  return s5Svg(`<polygon points="${C.flat.map(p => s5N(W / 2 + (p[0] - cx) * sc) + ',' + s5N(H / 2 - (p[1] - cy) * sc)).join(' ')}" fill="#FF8FB0" stroke="${S5C.p}" stroke-width="2.2" stroke-linejoin="round"/>`, W, H, o.cls || 's5mini'); };

/* ---------- flat (2-D) shapes for pictures ---------- */
const S5_SH = { tri: 'รูปสามเหลี่ยม', sq: 'รูปสี่เหลี่ยมจัตุรัส', rect: 'รูปสี่เหลี่ยมผืนผ้า', pent: 'รูปห้าเหลี่ยม', hex: 'รูปหกเหลี่ยม', oct: 'รูปแปดเหลี่ยม', circ: 'รูปวงกลม', ell: 'รูปวงรี', para: 'รูปสี่เหลี่ยมด้านขนาน', trap: 'รูปสี่เหลี่ยมคางหมู', rhom: 'รูปสี่เหลี่ยมขนมเปียกปูน', semi: 'รูปครึ่งวงกลม' };
/* a shape inside the box (x, y, w, h): pts for polygons (vertex list, for labels) */
function s5Sh(k, x = 0, y = 0, w = 100, hh = 80, o = {}) {
  const cx = x + w / 2, cy = y + hh / 2, r = Math.min(w, hh) / 2 * .9, col = o.col || '#A7C7FF', st = `fill="${o.fill === false ? 'none' : col}" stroke="${o.st || S5C.ink}" stroke-width="${o.sw || 2.4}" stroke-linejoin="round"`;
  const poly = P => ({ s: `<polygon points="${P.map(p => s5N(p[0]) + ',' + s5N(p[1])).join(' ')}" ${st}/>`, P }), ng = n => poly(Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n + (n === 4 ? Math.PI / 4 : n === 8 ? Math.PI / 8 : 0); return [cx + r * Math.cos(a), cy + r * Math.sin(a) + (n === 3 ? r * .18 : 0)]; }));
  switch (k) {
    case 'tri': return ng(3); case 'sq': return ng(4); case 'pent': return ng(5); case 'hex': return ng(6); case 'oct': return ng(8); case 'hep': return ng(7);
    case 'rect': return poly([[cx - r * 1.1, cy - r * .62], [cx + r * 1.1, cy - r * .62], [cx + r * 1.1, cy + r * .62], [cx - r * 1.1, cy + r * .62]]);
    case 'para': return poly([[cx - r * .75, cy - r * .55], [cx + r * 1.15, cy - r * .55], [cx + r * .75, cy + r * .55], [cx - r * 1.15, cy + r * .55]]);
    case 'trap': return poly([[cx - r * .55, cy - r * .55], [cx + r * .55, cy - r * .55], [cx + r * 1.1, cy + r * .55], [cx - r * 1.1, cy + r * .55]]);
    case 'rhom': return poly([[cx, cy - r * .95], [cx + r * .72, cy], [cx, cy + r * .95], [cx - r * .72, cy]]);
    case 'circ': return { s: `<circle cx="${s5N(cx)}" cy="${s5N(cy)}" r="${s5N(r)}" ${st}/>`, P: [] };
    case 'ell': return { s: `<ellipse cx="${s5N(cx)}" cy="${s5N(cy)}" rx="${s5N(r * 1.15)}" ry="${s5N(r * .62)}" ${st}/>`, P: [] };
    case 'semi': return { s: `<path d="M${s5N(cx - r)} ${s5N(cy + r * .4)} A${s5N(r)} ${s5N(r)} 0 0 1 ${s5N(cx + r)} ${s5N(cy + r * .4)} Z" ${st}/>`, P: [] };
    case 'open1': return { s: `<polyline points="${[[cx - r, cy + r * .6], [cx - r * .4, cy - r * .7], [cx + r * .3, cy + r * .5], [cx + r, cy - r * .6]].map(p => s5N(p[0]) + ',' + s5N(p[1])).join(' ')}" fill="none" stroke="${S5C.ink}" stroke-width="2.4" stroke-linejoin="round"/>`, P: [] };
    case 'open2': return { s: `<path d="M${s5N(cx - r)} ${s5N(cy + r * .5)} A${s5N(r)} ${s5N(r)} 0 1 1 ${s5N(cx + r * .2)} ${s5N(cy + r * .95)}" fill="none" stroke="${S5C.ink}" stroke-width="2.4"/>`, P: [] };
    case 'open3': return { s: `<polyline points="${[[cx - r * .8, cy - r * .7], [cx - r * .8, cy + r * .7], [cx + r * .8, cy + r * .7], [cx + r * .8, cy - r * .7]].map(p => s5N(p[0]) + ',' + s5N(p[1])).join(' ')}" fill="none" stroke="${S5C.ink}" stroke-width="2.4" stroke-linejoin="round"/>`, P: [] };
    case 'blob': return { s: `<path d="M${s5N(cx - r)} ${s5N(cy)} C${s5N(cx - r)} ${s5N(cy - r * 1.1)} ${s5N(cx + r * .9)} ${s5N(cy - r)} ${s5N(cx + r)} ${s5N(cy)} C${s5N(cx + r * 1.1)} ${s5N(cy + r)} ${s5N(cx - r * .6)} ${s5N(cy + r * .5)} ${s5N(cx - r)} ${s5N(cy)} Z" ${st}/>`, P: [] }; } }
const s5ShPic = (k, o = {}) => s5Svg(s5Sh(k, 8, 6, (o.W || 160) - 16, (o.H || 120) - 12, o).s, o.W || 160, o.H || 120, o.cls || 's5mini');
/* polygon with lettered corners (and diagonals from vertex 0 when asked) */
const s5Poly = (n, o = {}) => { const W = o.W || 300, H = o.H || 200, S = s5Sh(['', '', '', 'tri', 'sq', 'pent', 'hex', 'hep', 'oct'][n] || 'hex', 34, 26, W - 68, H - 52), L = 'ABCDEFGH', c = s5Avg(S.P.map(p => [...p, 0]));
  let s = S.s; if (o.diag) S.P.forEach((p, i) => { if (i > 1 && i < n - 1) s += `<line x1="${s5N(S.P[0][0])}" y1="${s5N(S.P[0][1])}" x2="${s5N(p[0])}" y2="${s5N(p[1])}" stroke="${S5C.p}" stroke-width="2.2" stroke-dasharray="6 4"/>`; });
  if (o.lab !== false) S.P.forEach((p, i) => { const d = s5Unit([p[0] - c[0], p[1] - c[1], 0]); s += s5T(p[0] + d[0] * 16, p[1] + d[1] * 16 + 6, L[i]); });
  return s5Svg(s, W, H, o.cls || 's5fig'); };

/* ---------- question makers (same look as the other ม.1 chapters) ---------- */
const s5Opt = (q, opts, sig, diff, hint, o = {}) => Q.rpOpt({ story: o.story, fig: o.fig, q, opts, right: opts[0], hint, sig, diff });
const s5Num = (q, a, sig, diff, hint, o = {}) => Q.rpNum({ story: o.story, fig: o.fig, q, a, unit: o.unit, hint, sig, diff });
const s5TF = (text, ok, why, diff, sig) => ({ ...rpTF(text, ok, why), __diff: diff, ...(sig ? { __sig: 'rptf ' + sig } : {}) });
const s5Pick = (q, figs, sig, diff, hint, o = {}) => Q.k1Pick({ story: o.story, q, figs, right: 0, hint, sig, diff });
/* turn the solid and tap every vertex / edge / face, then check */
Q.s5Tap = ({ q, k, what = 'v', sig, diff, hint }) => ({ prompt: q, say: rpSaySt('', q), ...rpMeta('s5t', { sig, q, diff }),
  mount(bd, ctx) { const S = s5Solid(k), need = what === 'v' ? S.V.length : what === 'e' ? S.E.length : S.F.length, word = { v: 'จุดยอด', e: 'สัน', f: 'หน้า' }[what];
    let done = false; const cnt = h('div', { class: 's5cnt' }), msg = h('div', { class: 'pad-msg' });
    const V = s5View(S, { W: 400, H: 270, sc: 62, pick: what, hid: true, done: () => done, onPick: (_, __, m) => { cnt.innerHTML = `แตะแล้ว <b>${m[what].size}</b> ${word}`; msg.textContent = ''; } });
    cnt.innerHTML = `แตะแล้ว <b>0</b> ${word}`;
    const chk = h('button', { class: 'btn primary ok2 s5chk', onclick: e => { e.stopPropagation(); if (done) return; const n = V.mark[what].size; if (!n) { msg.textContent = `ลากหมุนรูป แล้วแตะ${word}ก่อนนะ`; return; }
      const ok = n === need; if (ok) { done = true; wrap.classList.add('done'); } ctx.check(ok, ok ? '' : n < need ? `ยังขาดอีก — ${hint || 'ลากหมุนดูด้านหลังด้วย'}` : 'แตะเกินไป — แตะซ้ำที่เดิมเพื่อเอาออก'); } }, icon('check'), h('span', null, 'ตรวจ'));
    const wrap = h('div', { class: 'ans ia s5ans' }, V, h('div', { class: 'rowstack s5bar' }, cnt, chk), msg);
    wrap.reveal = () => { done = true; for (let i = 0; i < need; i++) V.mark[what].add(i); V.draw(); cnt.innerHTML = `ทั้งหมด <b>${need}</b> ${word}`; wrap.classList.add('done', 'revealed'); };
    wrap.ansText = String(need); bd.append(h('div', { class: 'colstack s5row' }, h('div', { class: 's5tip', html: 'ลากเพื่อหมุนรูป · แตะเพื่อทำเครื่องหมาย (แตะซ้ำ = เอาออก)' }), wrap)); } });

/* ---------- helpers for questions ---------- */
/* every cube can be seen or is held up by one that can: heights never grow toward the front (row R−1) or toward the right — the picture is drawn from front-right-above */
const s5Seen = Hs => Hs.every((r, i) => r.every((v, j) => (i + 1 >= Hs.length || Hs[i + 1][j] <= v) && (j + 1 >= r.length || r[j + 1] <= v || (i + 1 < Hs.length && false))));
const s5RandStack = (R = 2, C = 3, mx = 3, min = 4) => { for (let t = 0; ; t++) { const Hs = Array.from({ length: R }, () => Array.from({ length: C }, () => s5R(0, mx))); if (s5Count(Hs) >= min && Hs.every(r => r.some(v => v)) && Hs[0].map((_, c) => Hs.some(r => r[c])).every(Boolean) && (s5Seen(Hs) || t > 4000)) return Hs; } };
const s5StackPic = (Hs, o = {}) => { const W = o.W || 300, H = o.H || 210, mx = Math.max(...Hs.flat()), sc = Math.min(W / (Hs.length + Hs[0].length + 1.4), H / (mx + Hs.length * .55 + 1.7), 46); /* fill the picture whatever the size of the stack */
  return s5Svg(s5DrawStack(s5Stack(Hs), { W, H, sc, yaw: o.yaw ?? .62, pit: o.pit ?? .5, cy: H / 2 + sc * (mx / 2 - .35) }), W, H, o.cls || 's5fig'); };
/* answer picture + 3 different wrong pictures of the same kind */
function s5ViewOpts(Hs, which) {
  const V = s5Views(Hs), key = v => JSON.stringify(v), ans = V[which], out = [ans], add = v => { if (v && (Array.isArray(v[0]) ? v.some(r => r.some(Boolean)) : v.some(Boolean)) && !out.some(w => key(w) === key(v))) out.push(v); };
  if (which === 'top') { const T = ans; add(T.map(r => r.slice().reverse())); add(T.slice().reverse()); add(T[0].map((_, c) => T.map(r => r[c]))); add([V.front.map(v => v ? 1 : 0)]);
    for (let t = 0; out.length < 4 && t < 40; t++) { const M = T.map(r => r.slice()), r = s5R(0, M.length - 1), c = s5R(0, M[0].length - 1); M[r][c] = 1 - M[r][c]; add(M); } }
  else { const v = ans, other = which === 'front' ? V.side : V.front; add(other); add(v.slice().reverse()); for (let t = 0; out.length < 4 && t < 40; t++) { const w = v.slice(), i = s5R(0, w.length - 1); w[i] = Math.max(1, w[i] + (Math.random() < .5 ? 1 : -1)); add(w); } }
  return out.slice(0, 4).map(v => s5ViewPic(v)); }
/* a solid with a cutting plane and the section (still picture) */
function s5CutFig(k, n, d, o = {}) {
  const S = s5Solid(k), W = o.W || 300, H = o.H || 210, sc = o.sc || 56, yaw = o.yaw ?? .55, pit = o.pit ?? .38, C = s5Cut(S, n, d), nn = s5Unit(n), u = s5Unit(Math.abs(nn[1]) < .9 ? s5Crs(nn, [0, 1, 0]) : s5Crs(nn, [1, 0, 0])), v = s5Crs(nn, u), c0 = s5Mul(nn, d), R = 1.95;
  const X = p => s5N(W / 2 + s5Rot(p, yaw, pit)[0] * sc), Y = p => s5N(H / 2 + 6 - s5Rot(p, yaw, pit)[1] * sc), poly = (P, a) => `<polygon points="${P.map(p => X(p) + ',' + Y(p)).join(' ')}" ${a}/>`;
  const quad = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => s5Add(c0, s5Add(s5Mul(u, a * R), s5Mul(v, b * R))));
  return s5Svg(s5Draw(S, { W, H, sc, yaw, pit, hid: true, xray: true }) + poly(quad, `fill="#7C5CE0" fill-opacity=".14" stroke="#7C5CE0" stroke-width="1.6" stroke-dasharray="6 4"`) + (C ? poly(C.P, `fill="#FF8FB0" fill-opacity=".85" stroke="${S5C.p}" stroke-width="2.4" stroke-linejoin="round"`) : ''), W, H, o.cls || 's5fig'); }
const S5_CUTS = { /* [solid, plane normal, offset, Thai direction, section] */
  cuboidH: ['cuboid', [0, 1, 0], .2, 'ขนานกับฐาน', 'รูปสี่เหลี่ยมมุมฉาก'], cuboidV: ['cuboid', [1, 0, 0], .3, 'ตั้งฉากกับฐาน', 'รูปสี่เหลี่ยมมุมฉาก'], cylH: ['cyl', [0, 1, 0], .2, 'ขนานกับฐาน', 'รูปวงกลม'], cylV: ['cyl', [1, 0, 0], .2, 'ตั้งฉากกับฐาน', 'รูปสี่เหลี่ยมมุมฉาก'],
  coneH: ['cone', [0, 1, 0], -.3, 'ขนานกับฐาน', 'รูปวงกลม'], coneV: ['cone', [1, 0, 0], 0, 'ตั้งฉากกับฐานผ่านจุดยอด', 'รูปสามเหลี่ยม'], coneO: ['cone', [.42, 1, 0], -.25, 'เฉียง ไม่ผ่านฐาน', 'รูปวงรี'], sphH: ['sph', [0, 1, 0], .4, 'แนวใดก็ได้', 'รูปวงกลม'],
  pyrH: ['pyr4', [0, 1, 0], -.2, 'ขนานกับฐาน', 'รูปสี่เหลี่ยมจัตุรัส'], pyrV: ['pyr4', [1, 0, 1], 0, 'ตั้งฉากกับฐานผ่านจุดยอด', 'รูปสามเหลี่ยม'], pr3H: ['prism3', [0, 1, 0], .1, 'ขนานกับฐาน', 'รูปสามเหลี่ยม'], pr3V: ['prism3', [0, 0, 1], .1, 'ตั้งฉากกับฐาน', 'รูปสี่เหลี่ยมมุมฉาก'] };
const S5_SECT = ['รูปวงกลม', 'รูปสี่เหลี่ยมมุมฉาก', 'รูปสามเหลี่ยม', 'รูปวงรี', 'รูปสี่เหลี่ยมจัตุรัส', 'รูปห้าเหลี่ยม'];
const s5SectOpts = right => [right, ...shuffle(S5_SECT.filter(x => x !== right && !(right === 'รูปสี่เหลี่ยมจัตุรัส' && x === 'รูปสี่เหลี่ยมมุมฉาก'))).slice(0, 3)];
const s5Wrong = (a, k = 3) => { const o = []; [a + 1, a - 1, a + 2, a * 2, a - 2].forEach(v => { if (v >= 0 && v !== a && !o.includes(v) && o.length < k) o.push(v); }); return o; };
const s5Names = (right, pool) => [right, ...shuffle(pool.filter(x => x !== right)).slice(0, 3)];
const S5_SOLIDS = Object.values(S5_NAME);

const S5L = (no, place, title, short, goal, game) => ({ id: 2500 + no, no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach: [], game });
const S5_OBJ = [['กระป๋องน้ำอัดลม', 'cyl'], ['ลูกเต๋า', 'cube'], ['ลูกฟุตบอล', 'sph'], ['กรวยจราจร', 'cone'], ['กล่องนม', 'cuboid'], ['เต็นท์หลังคาจั่ว', 'prism3'], ['ยอดพีระมิดแก้วกระจก', 'pyr4'], ['ท่อน้ำ', 'cyl'], ['ลูกแก้ว', 'sph'], ['ก้อนอิฐ', 'cuboid']];
const LESSONS_M1C5 = [
  /* ---------- 1 รู้จักรูปเรขาคณิตสองมิติ ---------- */
  S5L(1, 'ท่ารูปแบน', 'รู้จักรูปเรขาคณิตสองมิติ', 'รูปสองมิติ', 'บอกได้ว่ารูปใดเป็นรูปสองมิติ เรียกชื่อรูป แยกรูปปิด–รูปเปิด และรูปที่มีด้านตรง–ด้านโค้ง', () => { const ks = shuffle(['tri', 'sq', 'rect', 'pent', 'hex', 'circ', 'trap', 'para']), N = Object.keys(S5_SH);
    const row = shuffle(['tri', 'circ', 'sq', 'semi', 'hex', 'ell', 'pent', 'rect']).slice(0, 6), straight = row.filter(k => !['circ', 'semi', 'ell'].includes(k)).length;
    return [
      s5Pick('รูปใดเป็นรูปเรขาคณิต<b>สองมิติ</b>', [s5ShPic(s5Pk(['tri', 'sq', 'hex'])), s5Pic('cube'), s5Pic('cyl'), s5Pic('cone')], 'is2d', 1, 'รูปสองมิติแบนราบ มีแค่ความกว้างกับความยาว'),
      s5Opt('รูปนี้ชื่ออะไร', s5Names(S5_SH[ks[0]], N.map(k => S5_SH[k])), `name ${ks[0]}`, 1, 'นับด้านและดูว่ามีมุมฉากไหม', { fig: s5ShPic(ks[0], { W: 220, H: 160, cls: 's5fig' }) }),
      s5Opt('รูปนี้ชื่ออะไร', s5Names(S5_SH[ks[1]], N.map(k => S5_SH[k])), `name ${ks[1]}`, 2, 'นับด้านและดูว่ามีมุมฉากไหม', { fig: s5ShPic(ks[1], { W: 220, H: 160, cls: 's5fig' }) }),
      s5Opt('รูปเรขาคณิตสองมิติมีขนาดในด้านใดบ้าง', ['ความกว้างและความยาว', 'ความกว้าง ความยาว และความสูง', 'ความสูงอย่างเดียว', 'ความหนาอย่างเดียว'], 'dim', 2, 'รูปที่วาดบนกระดาษแบน ๆ'),
      s5Pick('รูปใดเป็น<b>รูปปิด</b>', [s5ShPic(s5Pk(['pent', 'blob', 'trap'])), s5ShPic('open1'), s5ShPic('open2'), s5ShPic('open3')], 'closed', 2, 'รูปปิด = เส้นรอบรูปต่อกันครบ ไม่มีปลายเปิด'),
      s5Pick('รูปใดมี<b>ด้านโค้ง</b>', [s5ShPic(s5Pk(['circ', 'semi', 'ell'])), s5ShPic('tri'), s5ShPic('rect'), s5ShPic('hex')], 'curve', 3, 'ดูเส้นรอบรูปที่ไม่ใช่เส้นตรง'),
      s5Opt('รูปใด<b>ไม่ใช่</b>รูปหลายเหลี่ยม', ['รูปวงกลม', 'รูปสามเหลี่ยม', 'รูปห้าเหลี่ยม', 'รูปสี่เหลี่ยมคางหมู'], 'notpoly', 3, 'รูปหลายเหลี่ยมมีแต่ด้านตรง'),
      s5TF('รูปครึ่งวงกลมมีทั้งด้านตรงและด้านโค้ง', true, 'ขอบล่างเป็นเส้นตรง ขอบบนเป็นเส้นโค้ง', 4, 'semi'),
      s5TF('รูปที่มีปลายเส้นไม่ต่อกันก็นับเป็นรูปปิด', false, 'รูปปิดต้องมีเส้นรอบรูปต่อกันครบ', 4, 'opentf'),
      s5Num('ในภาพ มีรูปที่มี<b>แต่ด้านตรง</b>กี่รูป', straight, `count ${row.join('')}`, 6, 'รูปวงกลม วงรี ครึ่งวงกลม มีด้านโค้ง ไม่นับ', { fig: s5Svg(row.map((k, i) => s5Sh(k, 10 + (i % 3) * 94, 8 + Math.floor(i / 3) * 92, 86, 84).s).join(''), 300, 200, 's5fig'), unit: 'รูป' })]; }),

  /* ---------- 2 ส่วนประกอบของรูปสองมิติ ---------- */
  S5L(2, 'ลานมุมแหลม', 'ส่วนประกอบของรูปเรขาคณิตสองมิติ', 'จุดยอด · ด้าน · มุม', 'บอกจุดยอด ด้าน มุม และเส้นทแยงมุมของรูปหลายเหลี่ยม และเห็นว่าจำนวนด้าน = จำนวนจุดยอด = จำนวนมุม', () => { const n = s5R(4, 7), m = s5R(5, 8), q = s5R(5, 8), t = s5R(6, 10);
    return [
      s5Num('รูปนี้มี<b>จุดยอด</b>กี่จุด', n, `vtx ${n}`, 1, 'จุดยอด = มุมแหลม ๆ ที่ด้านสองด้านมาพบกัน', { fig: s5Poly(n), unit: 'จุด' }),
      s5Num('รูปนี้มี<b>ด้าน</b>กี่ด้าน', m, `side ${m}`, 1, 'นับเส้นตรงรอบรูป', { fig: s5Poly(m), unit: 'ด้าน' }),
      s5Opt('ส่วนของเส้นตรงที่ลากเชื่อม<b>จุดยอดสองจุดที่ไม่อยู่ติดกัน</b>เรียกว่าอะไร', ['เส้นทแยงมุม', 'ด้าน', 'จุดยอด', 'เส้นรอบรูป'], 'diagdef', 2, 'ลากข้ามรูปจากมุมหนึ่งไปอีกมุมหนึ่ง'),
      s5Opt('เส้นทแยงมุมของรูปสี่เหลี่ยม ABCD คือข้อใด', ['AC และ BD', 'AB และ CD', 'AD และ BC', 'AB และ BC'], 'diagq', 2, 'เชื่อมจุดยอดที่ไม่ติดกัน', { fig: s5Poly(4) }),
      s5TF('รูปหลายเหลี่ยมทุกรูปมีจำนวนด้านเท่ากับจำนวนจุดยอด', true, 'เดินรอบรูป: ด้าน–จุดยอด–ด้าน–จุดยอด สลับกันจนครบ', 3, 'same'),
      s5Num(`รูปหลายเหลี่ยมที่มี ${t} ด้าน มี<b>มุม</b>กี่มุม`, t, `rel ${t}`, 3, 'จำนวนมุม = จำนวนด้าน', { unit: 'มุม' }),
      s5Num('รูปสามเหลี่ยมมีเส้นทแยงมุมกี่เส้น', 0, 'tri0', 4, 'จุดยอดทุกจุดของสามเหลี่ยมอยู่ติดกันหมด', { unit: 'เส้น' }),
      s5Num(`จากจุดยอด A ของรูป${S5_POLY[q]}นี้ ลากเส้นทแยงมุมได้กี่เส้น`, q - 3, `dv ${q}`, 5, 'ลากไปจุดยอดอื่นได้ทุกจุด ยกเว้นตัวเองและสองจุดที่อยู่ติดกัน → n − 3', { fig: s5Poly(q, { diag: true }), unit: 'เส้น' }),
      s5Num(`รูป${S5_POLY[q === 8 ? 6 : q + 1] || 'หกเหลี่ยม'}มีเส้นทแยงมุม<b>ทั้งหมด</b>กี่เส้น`, (q === 8 ? 6 : q + 1) * ((q === 8 ? 6 : q + 1) - 3) / 2, `dt ${q === 8 ? 6 : q + 1}`, 7, 'แต่ละจุดยอดลากได้ n − 3 เส้น แต่เส้นหนึ่งถูกนับสองครั้ง → n(n − 3) ÷ 2', { unit: 'เส้น' }),
      s5Opt('รูปหลายเหลี่ยมรูปหนึ่งลากเส้นทแยงมุมจากจุดยอดเดียวได้ 4 เส้น รูปนี้คือรูปใด', ['รูปเจ็ดเหลี่ยม', 'รูปหกเหลี่ยม', 'รูปสี่เหลี่ยม', 'รูปแปดเหลี่ยม'], 'back', 7, 'n − 3 = 4 → n = 7')]; }),

  /* ---------- 3 รูปเรขาคณิตสามมิติคืออะไร ---------- */
  S5L(3, 'ตลาดรูปทรง', 'รูปเรขาคณิตสามมิติคืออะไร', 'รูปสามมิติ', 'บอกความต่างของรูปสองมิติกับสามมิติ เรียกชื่อลูกบาศก์ ทรงสี่เหลี่ยมมุมฉาก ทรงกระบอก กรวย ทรงกลม ปริซึม พีระมิด และจับคู่กับสิ่งของรอบตัว', () => { const ks = shuffle(['cube', 'cuboid', 'cyl', 'cone', 'sph', 'pyr4', 'prism3']), ob = shuffle(S5_OBJ);
    return [
      s5Pick('รูปใดเป็นรูปเรขาคณิต<b>สามมิติ</b>', [s5Pic(s5Pk(['cube', 'cyl', 'cone'])), s5ShPic('sq'), s5ShPic('circ'), s5ShPic('tri')], 'is3d', 1, 'รูปสามมิติมีความหนา (ความสูง) จับต้องได้'),
      s5Opt('รูปทรงนี้ชื่ออะไร', s5Names(S5_NAME[ks[0]], ['ลูกบาศก์', 'ทรงสี่เหลี่ยมมุมฉาก', 'ทรงกระบอก', 'กรวย', 'ทรงกลม', 'พีระมิดฐานสี่เหลี่ยม', 'ปริซึมสามเหลี่ยม']), `nm ${ks[0]}`, 1, 'ดูหน้าและผิวของรูปทรง', { fig: s5Pic(ks[0], { W: 240, H: 190, sc: 44, cls: 's5fig' }) }),
      s5Opt('รูปทรงนี้ชื่ออะไร', s5Names(S5_NAME[ks[1]], ['ลูกบาศก์', 'ทรงสี่เหลี่ยมมุมฉาก', 'ทรงกระบอก', 'กรวย', 'ทรงกลม', 'พีระมิดฐานสี่เหลี่ยม', 'ปริซึมสามเหลี่ยม']), `nm ${ks[1]}`, 2, 'ดูหน้าและผิวของรูปทรง', { fig: s5Pic(ks[1], { W: 240, H: 190, sc: 44, cls: 's5fig' }) }),
      s5Opt('รูปเรขาคณิตสามมิติมีขนาดเพิ่มจากรูปสองมิติในด้านใด', ['ความสูง (ความหนา)', 'ความกว้าง', 'ความยาว', 'ไม่ต่างกัน'], 'dim3', 2, 'กว้าง ยาว และ…'),
      s5Opt(`${ob[0][0]} มีลักษณะคล้ายรูปทรงใด`, s5Names(S5_NAME[ob[0][1]], ['ลูกบาศก์', 'ทรงสี่เหลี่ยมมุมฉาก', 'ทรงกระบอก', 'กรวย', 'ทรงกลม', 'ปริซึมสามเหลี่ยม', 'พีระมิดฐานสี่เหลี่ยม']), `obj ${ob[0][1]}`, 2, 'นึกภาพของจริง แล้วดูหน้าและผิวโค้ง'),
      s5Opt(`${ob[1][0]} มีลักษณะคล้ายรูปทรงใด`, s5Names(S5_NAME[ob[1][1]], ['ลูกบาศก์', 'ทรงสี่เหลี่ยมมุมฉาก', 'ทรงกระบอก', 'กรวย', 'ทรงกลม', 'ปริซึมสามเหลี่ยม', 'พีระมิดฐานสี่เหลี่ยม']), `obj ${ob[1][1]}`, 3, 'นึกภาพของจริง แล้วดูหน้าและผิวโค้ง'),
      s5Opt('ข้อใด<b>ไม่ใช่</b>รูปเรขาคณิตสามมิติ', ['รูปวงกลม', 'ทรงกลม', 'กรวย', 'ปริซึม'], 'not3d', 3, 'คำว่า "รูป…" กับ "ทรง…" ต่างกัน'),
      s5Opt('รูปทรงใด<b>ไม่มีหน้าราบเลย</b>', ['ทรงกลม', 'ทรงกระบอก', 'กรวย', 'ลูกบาศก์'], 'round', 4, 'มีแต่ผิวโค้งทั้งหมด'),
      s5Opt('เหรียญ 1 บาท มีลักษณะคล้ายรูปเรขาคณิตใดมากที่สุด', ['ทรงกระบอก', 'รูปวงกลม', 'ทรงกลม', 'กรวย'], 'coin', 5, 'เหรียญมีความหนา จึงเป็นรูปสามมิติ'),
      s5Opt('ข้อใดกล่าว<b>ถูกต้อง</b>', ['ทรงสี่เหลี่ยมมุมฉากทุกหน้าเป็นรูปสี่เหลี่ยมมุมฉาก', 'กรวยมีหน้าราบ 2 หน้า', 'ทรงกระบอกไม่มีผิวโค้ง', 'พีระมิดทุกหน้าเป็นรูปสามเหลี่ยม'], 'true', 6, 'ตรวจทีละข้อกับรูปทรงจริง')]; }),

  /* ---------- 4 ส่วนประกอบของรูปสามมิติ ---------- */
  S5L(4, 'เกาะหน้า สัน จุดยอด', 'ส่วนประกอบของรูปเรขาคณิตสามมิติ', 'หน้า · สัน · จุดยอด', 'ชี้และนับหน้า สัน จุดยอดของรูปทรง แยกหน้าราบกับผิวโค้ง (หมุนรูปดูด้านที่ถูกบังด้วย)', () => { const k = s5Pk(['cube', 'cuboid', 'prism3', 'pyr4']), k2 = s5Pk(['prism3', 'pyr4', 'pyr3', 'prism5']), c = S5_CNT[k], c2 = S5_CNT[k2];
    return [
      s5Opt('<b>สัน</b>ของรูปทรงคือข้อใด', ['เส้นที่หน้าสองหน้ามาพบกัน', 'จุดที่สันหลายเส้นมาพบกัน', 'พื้นผิวเรียบของรูปทรง', 'ความสูงของรูปทรง'], 'edgedef', 1, 'ขอบที่เหมือนสันหนังสือ'),
      s5Opt('<b>จุดยอด</b>ของรูปทรงคือข้อใด', ['จุดที่สันตั้งแต่สองเส้นขึ้นไปมาพบกัน', 'เส้นที่หน้าสองหน้ามาพบกัน', 'จุดกึ่งกลางของหน้า', 'พื้นผิวโค้ง'], 'vdef', 1, 'มุมแหลม ๆ ของรูปทรง'),
      s5Num(`${S5_NAME[k]}นี้มี<b>หน้า</b>กี่หน้า`, c[0], `f ${k}`, 2, 'เส้นประ = สันด้านหลังที่ถูกบัง อย่าลืมหน้าด้านหลังและด้านล่าง', { fig: s5Pic(k, { W: 240, H: 190, sc: 44, cls: 's5fig' }), unit: 'หน้า' }),
      s5Num(`${S5_NAME[k2]}นี้มี<b>จุดยอด</b>กี่จุด`, c2[2], `v ${k2}`, 3, 'นับทั้งจุดที่ต่อกับเส้นประด้วย', { fig: s5Pic(k2, { W: 240, H: 190, sc: 44, cls: 's5fig' }), unit: 'จุด' }),
      Q.s5Tap({ q: 'ลากหมุนลูกบาศก์ แล้วแตะ<b>จุดยอดทุกจุด</b> (ด้านหลังด้วย) แล้วกดตรวจ', k: 'cube', what: 'v', sig: 'tapv cube', diff: 3, hint: 'ลูกบาศก์มีจุดยอดบน 4 จุด ล่าง 4 จุด' }),
      Q.s5Tap({ q: 'ลากหมุนพีระมิด แล้วแตะ<b>สันทุกเส้น</b> แล้วกดตรวจ', k: 'pyr4', what: 'e', sig: 'tape pyr4', diff: 4, hint: 'สันรอบฐาน 4 เส้น และสันที่ขึ้นไปหายอดอีก 4 เส้น' }),
      s5Num('ทรงกระบอกมี<b>หน้าราบ</b>กี่หน้า', 2, 'cylflat', 4, 'ด้านบนและด้านล่างเป็นวงกลม ส่วนรอบข้างเป็นผิวโค้ง', { fig: s5Pic('cyl', { W: 200, H: 170, sc: 42, cls: 's5fig' }), unit: 'หน้า' }),
      s5Num('กรวยมี<b>จุดยอด</b>กี่จุด', 1, 'conev', 5, 'ปลายแหลมด้านบน', { fig: s5Pic('cone', { W: 200, H: 170, sc: 42, cls: 's5fig' }), unit: 'จุด' }),
      s5TF('ทรงกลมไม่มีหน้าราบ ไม่มีสัน และไม่มีจุดยอด', true, 'มีแต่ผิวโค้งผิวเดียว', 5, 'sph'),
      s5Num(`${S5_NAME[k]}นี้มี<b>สัน</b>กี่เส้น`, c[1], `e ${k}`, 6, 'นับเป็นกลุ่ม: สันรอบบน สันรอบล่าง สันที่เชื่อมบน–ล่าง', { fig: s5Pic(k, { W: 240, H: 190, sc: 44, cls: 's5fig' }), unit: 'เส้น' })]; }),

  /* ---------- 5 รูปสองมิติที่เป็นส่วนประกอบของรูปสามมิติ ---------- */
  S5L(5, 'โรงงานหน้ารูปทรง', 'รูปสองมิติที่เป็นส่วนประกอบของรูปสามมิติ', 'หน้าเป็นรูปอะไร', 'บอกได้ว่าหน้าของรูปทรงแต่ละรูปเป็นรูปสองมิติชนิดใด กี่รูป', () => { const n = s5R(5, 8), p = s5R(5, 8), hk = s5Pk(['prism3', 'pyr4', 'prism5']), hS = s5Solid(hk), hf = hk === 'pyr4' ? s5R(1, 4) : 0, hAns = hk === 'pyr4' ? 'รูปสามเหลี่ยม' : hk === 'prism3' ? 'รูปสามเหลี่ยม' : 'รูปห้าเหลี่ยม';
    return [
      s5Opt('ทุกหน้าของลูกบาศก์เป็นรูปอะไร', ['รูปสี่เหลี่ยมจัตุรัส', 'รูปสี่เหลี่ยมผืนผ้า', 'รูปสามเหลี่ยม', 'รูปวงกลม'], 'cubeface', 1, 'ทุกด้านยาวเท่ากัน', { fig: s5Pic('cube', { W: 200, H: 170, sc: 40, cls: 's5fig' }) }),
      s5Opt('หน้าที่แรเงาเป็นรูปอะไร', s5Names(hAns, ['รูปสามเหลี่ยม', 'รูปสี่เหลี่ยมผืนผ้า', 'รูปห้าเหลี่ยม', 'รูปวงกลม']), `hl ${hk}`, 1, 'นับด้านของหน้าที่เป็นสีชมพู', { fig: s5Svg(s5Draw(hS, { W: 240, H: 190, sc: 44, hid: true, mark: { f: new Set([hf]) } }), 240, 190, 's5fig') }),
      s5Opt('พีระมิดฐานสี่เหลี่ยมประกอบด้วยรูปใดบ้าง', ['สามเหลี่ยม 4 รูป และสี่เหลี่ยม 1 รูป', 'สามเหลี่ยม 3 รูป และสี่เหลี่ยม 1 รูป', 'สามเหลี่ยม 4 รูป และสี่เหลี่ยม 2 รูป', 'สามเหลี่ยม 2 รูป และสี่เหลี่ยม 3 รูป'], 'py4', 2, 'ฐาน 1 รูป + หน้าข้างเท่ากับจำนวนด้านของฐาน'),
      s5Opt('ปริซึมสามเหลี่ยมประกอบด้วยรูปใดบ้าง', ['สามเหลี่ยม 2 รูป และสี่เหลี่ยมผืนผ้า 3 รูป', 'สามเหลี่ยม 3 รูป และสี่เหลี่ยมผืนผ้า 2 รูป', 'สามเหลี่ยม 4 รูป', 'สามเหลี่ยม 2 รูป และสี่เหลี่ยมผืนผ้า 2 รูป'], 'p3', 2, 'ฐานบนและล่าง 2 รูป + หน้าข้างตามจำนวนด้านของฐาน'),
      s5Opt('ทรงสี่เหลี่ยมมุมฉากประกอบด้วยรูปใด', ['สี่เหลี่ยมมุมฉาก 6 รูป', 'สี่เหลี่ยมมุมฉาก 4 รูป', 'สี่เหลี่ยมจัตุรัส 6 รูปเสมอ', 'สามเหลี่ยม 6 รูป'], 'cuboidf', 3, 'กล่องนมมีกี่ด้าน'),
      s5Opt('รูปทรงใดมีหน้าเป็น<b>รูปวงกลม</b>', ['ทรงกระบอก', 'ปริซึมหกเหลี่ยม', 'ลูกบาศก์', 'พีระมิดฐานสามเหลี่ยม'], 'circleface', 3, 'ฐานเป็นวงกลม'),
      s5Num(`ปริซึมฐาน${S5_POLY[n]} มีหน้าที่เป็นรูปสี่เหลี่ยมมุมฉากกี่หน้า`, n, `pr ${n}`, 4, 'หน้าข้างของปริซึมมีเท่ากับจำนวนด้านของฐาน', { unit: 'หน้า' }),
      s5Num(`พีระมิดฐาน${S5_POLY[p]} มีหน้าที่เป็นรูปสามเหลี่ยมกี่หน้า`, p, `py ${p}`, 4, 'หน้าข้างของพีระมิดมีเท่ากับจำนวนด้านของฐาน', { unit: 'หน้า' }),
      s5Opt('รูปทรงใด<b>ไม่มี</b>รูปสี่เหลี่ยมเป็นหน้าเลย', ['พีระมิดฐานสามเหลี่ยม', 'ปริซึมสามเหลี่ยม', 'พีระมิดฐานสี่เหลี่ยม', 'ลูกบาศก์'], 'noquad', 5, 'ฐานสามเหลี่ยม หน้าข้างก็สามเหลี่ยม'),
      s5Opt('รูปทรงที่มีหน้าเป็นรูปหกเหลี่ยม 2 รูป และสี่เหลี่ยมผืนผ้า 6 รูป คือรูปทรงใด', ['ปริซึมหกเหลี่ยม', 'พีระมิดฐานหกเหลี่ยม', 'ปริซึมสี่เหลี่ยม', 'ทรงกระบอก'], 'which6', 6, 'ฐานสองฐานเหมือนกัน + หน้าข้างสี่เหลี่ยม = ปริซึม')]; }),

  /* ---------- 6 ภาพด้านหน้า ด้านข้าง ด้านบน ---------- */
  S5L(6, 'หอมองสามทิศ', 'ภาพด้านหน้า ด้านข้าง และด้านบน', 'ภาพสามทิศ', 'นึกภาพที่เห็นเมื่อมองรูปทรงหรือลูกบาศก์ที่ต่อกันจากด้านหน้า ด้านข้าง (ขวา) และด้านบน', () => { const A = s5RandStack(2, 3, 2, 4), B = s5RandStack(2, 3, 3, 5), Cc = s5RandStack(3, 3, 2, 6);
    return [
      s5Opt('มองทรงกระบอกที่ตั้งอยู่<b>จากด้านบน</b> จะเห็นเป็นรูปใด', ['รูปวงกลม', 'รูปสี่เหลี่ยมมุมฉาก', 'รูปวงรี', 'รูปสามเหลี่ยม'], 'cyltop', 1, 'มองลงมาตรง ๆ เห็นแต่ฝา', { fig: s5Pic('cyl', { W: 200, H: 170, sc: 42, cls: 's5fig' }) }),
      s5Opt('มองกรวยที่ตั้งอยู่<b>จากด้านหน้า</b> จะเห็นเป็นรูปใด', ['รูปสามเหลี่ยม', 'รูปวงกลม', 'รูปสี่เหลี่ยม', 'รูปวงรี'], 'conefront', 1, 'มองตรงระดับสายตา เห็นด้านข้างแหลมขึ้นไป', { fig: s5Pic('cone', { W: 200, H: 170, sc: 42, cls: 's5fig' }) }),
      s5Opt('มองทรงกระบอกที่ตั้งอยู่<b>จากด้านหน้า</b> จะเห็นเป็นรูปใด', ['รูปสี่เหลี่ยมมุมฉาก', 'รูปวงกลม', 'รูปสามเหลี่ยม', 'รูปวงรี'], 'cylfront', 2, 'ด้านข้างตรงขึ้นไป ฝาบนล่างแบน'),
      s5Opt('มองพีระมิดฐานสี่เหลี่ยมจัตุรัส<b>จากด้านบน</b> จะเห็นเป็นรูปใด', ['รูปสี่เหลี่ยมจัตุรัสที่มีเส้นทแยงมุม', 'รูปสามเหลี่ยม', 'รูปวงกลม', 'รูปห้าเหลี่ยม'], 'pyrtop', 3, 'เห็นฐานสี่เหลี่ยม และสันที่ลากขึ้นไปหายอดตรงกลาง', { fig: s5Pic('pyr4', { W: 200, H: 170, sc: 42, cls: 's5fig' }) }),
      s5Pick('ข้อใดเป็น<b>ภาพด้านบน</b>', s5ViewOpts(A, 'top'), `top ${A.flat().join('')}`, 3, 'มองลงมาจากข้างบน: นับเฉพาะช่องที่มีลูกบาศก์ ไม่สนความสูง', { story: s5StackPic(A) }),
      s5Pick('ข้อใดเป็น<b>ภาพด้านหน้า</b>', s5ViewOpts(A, 'front'), `front ${A.flat().join('')}`, 4, 'มองตรงจากด้านหน้า: แต่ละคอลัมน์เห็นความสูงของกองที่สูงที่สุด', { story: s5StackPic(A) }),
      s5Pick('ข้อใดเป็น<b>ภาพด้านข้าง</b> (มองจากด้านขวา)', s5ViewOpts(B, 'side'), `side ${B.flat().join('')}`, 5, 'ยืนทางขวามือแล้วมองเข้าไป: แถวหน้าอยู่ซ้ายมือของภาพ', { story: s5StackPic(B) }),
      s5Num('<b>ภาพด้านหน้า</b>ของลูกบาศก์ชุดนี้มีรูปสี่เหลี่ยมจัตุรัสกี่รูป', s5Views(B).front.reduce((a, b) => a + b, 0), `fcnt ${B.flat().join('')}`, 6, 'แต่ละคอลัมน์นับเท่ากับกองที่สูงที่สุดในคอลัมน์นั้น', { fig: s5StackPic(B), unit: 'รูป' }),
      s5Pick('ข้อใดเป็น<b>ภาพด้านบน</b>', s5ViewOpts(Cc, 'top'), `top3 ${Cc.flat().join('')}`, 6, 'ช่องที่มีลูกบาศก์อย่างน้อย 1 ก้อน', { story: s5StackPic(Cc, { sc: 26 }) }),
      s5TF('ภาพด้านบนของลูกบาศก์ที่วางซ้อนกันบอกจำนวนลูกบาศก์ได้ครบทุกก้อน', false, 'ภาพด้านบนไม่เห็นความสูง ก้อนที่ซ้อนอยู่ข้างใต้มองไม่เห็น', 7, 'topall')]; }),

  /* ---------- 7 ภาพคลี่ ---------- */
  S5L(7, 'ร้านพับกล่อง', 'ภาพคลี่ของรูปเรขาคณิตสามมิติ', 'ภาพคลี่', 'บอกได้ว่าภาพคลี่แต่ละแบบพับแล้วได้รูปทรงใด และภาพคลี่ของรูปทรงประกอบด้วยรูปอะไร', () => { const nets = shuffle([['cube', s5NetFlat(s5NetGrid(s5Pk(S5_CUBE_NETS)), { W: 220, H: 160, cls: 's5fig' })], ['cuboid', s5NetFlat(s5NetCuboid(), { W: 220, H: 160, cls: 's5fig' })], ['prism3', s5NetFlat(s5NetPrism(3), { W: 220, H: 160, cls: 's5fig' })], ['pyr4', s5NetFlat(s5NetPyr(4), { W: 220, H: 160, cls: 's5fig' })], ['cyl', s5NetCyl({ W: 220, H: 160, cls: 's5fig' })], ['cone', s5NetCone({ W: 220, H: 160, cls: 's5fig' })]]);
    const pool = ['ลูกบาศก์', 'ทรงสี่เหลี่ยมมุมฉาก', 'ปริซึมสามเหลี่ยม', 'พีระมิดฐานสี่เหลี่ยม', 'ทรงกระบอก', 'กรวย', 'ปริซึมห้าเหลี่ยม', 'พีระมิดฐานห้าเหลี่ยม'];
    return [
      s5Opt('<b>ภาพคลี่</b>คืออะไร', ['รูปสองมิติที่พับแล้วได้รูปทรงสามมิติ', 'ภาพที่มองจากด้านบน', 'หน้าตัดของรูปทรง', 'รูปทรงที่ถูกตัดครึ่ง'], 'def', 1, 'คลี่กล่องออกแบน ๆ'),
      s5Opt('ภาพคลี่นี้พับแล้วได้รูปทรงใด', s5Names(S5_NAME[nets[0][0]], pool), `net ${nets[0][0]}`, 1, 'ดูรูปที่เป็นฐาน และจำนวนหน้าข้าง', { fig: nets[0][1] }),
      s5Opt('ภาพคลี่นี้พับแล้วได้รูปทรงใด', s5Names(S5_NAME[nets[1][0]], pool), `net ${nets[1][0]}`, 2, 'ดูรูปที่เป็นฐาน และจำนวนหน้าข้าง', { fig: nets[1][1] }),
      s5Opt('ภาพคลี่ของทรงกระบอกประกอบด้วยรูปใด', ['วงกลม 2 รูป และสี่เหลี่ยมผืนผ้า 1 รูป', 'วงกลม 1 รูป และสี่เหลี่ยมผืนผ้า 2 รูป', 'วงกลม 2 รูป และสามเหลี่ยม 1 รูป', 'วงกลม 1 รูป และส่วนของวงกลม 1 รูป'], 'cylnet', 2, 'ฝาบน ฝาล่าง และผิวข้างที่คลี่ออก'),
      s5Opt('ภาพคลี่ของกรวยประกอบด้วยรูปใด', ['วงกลม 1 รูป และส่วนของวงกลม (รูปพัด) 1 รูป', 'วงกลม 2 รูป และสี่เหลี่ยมผืนผ้า 1 รูป', 'สามเหลี่ยม 1 รูป และวงกลม 1 รูป', 'วงกลม 1 รูปเท่านั้น'], 'conenet', 3, 'ผิวข้างของกรวยคลี่ออกเป็นรูปพัด'),
      s5Pick('ภาพคลี่ใดพับเป็น<b>พีระมิดฐานสี่เหลี่ยม</b>ได้', [s5NetFlat(s5NetPyr(4)), s5NetFlat(s5NetPrism(4)), s5NetFlat(s5NetPrism(3)), s5NetFlat(s5NetPyr(3))], 'pickpyr', 3, 'ฐานสี่เหลี่ยม 1 รูป + สามเหลี่ยม 4 รูปรอบฐาน'),
      s5Pick('ภาพคลี่ใดพับเป็น<b>ปริซึมห้าเหลี่ยม</b>ได้', [s5NetFlat(s5NetPrism(5)), s5NetFlat(s5NetPyr(5)), s5NetFlat(s5NetPrism(6)), s5NetFlat(s5NetPrism(4))], 'pickpr5', 4, 'ห้าเหลี่ยม 2 รูป + สี่เหลี่ยม 5 รูป'),
      s5Num('ภาพคลี่ของปริซึมหกเหลี่ยมมีรูปทั้งหมดกี่รูป', 8, 'pr6cnt', 5, 'ฐาน 2 รูป + หน้าข้าง 6 รูป', { unit: 'รูป' }),
      s5Pick('ข้อใดพับเป็น<b>ลูกบาศก์</b>ได้', [s5NetFlat(s5NetGrid(s5Pk(S5_CUBE_NETS))), ...shuffle(S5_NOT_NETS).slice(0, 3).map(c => s5NetFlat(s5NetGrid(c)))], 'cubeok', 6, 'ลองพับในใจ: ห้ามมีสองช่องทับกัน และห้ามมีช่องสี่เหลี่ยม 2×2'),
      s5Opt('ภาพคลี่นี้พับแล้วได้รูปทรงใด', s5Names(S5_NAME[nets[2][0]], pool), `net ${nets[2][0]}`, 6, 'ดูรูปที่เป็นฐาน และจำนวนหน้าข้าง', { fig: nets[2][1] })]; }),

  /* ---------- 8 การประกอบและแยกรูปทรง ---------- */
  S5L(8, 'ลานต่อบล็อก', 'การประกอบและแยกรูปทรงสามมิติ', 'ประกอบ · แยก', 'นับลูกบาศก์ที่ต่อกัน บอกรูปทรงที่ประกอบเป็นสิ่งของ และรูปทรงที่ได้เมื่อแยกหรือต่อรูปทรง', () => { let A; do A = s5RandStack(1, 4, 2, 4); while (s5Count(A) > 7); const B = s5RandStack(2, 3, 2, 5), Cg = [[s5R(1, 3), s5R(1, 3)], [s5R(1, 3), s5R(1, 3)]];
    return [
      s5Num('ภาพนี้มีลูกบาศก์กี่ก้อน', s5Count(A), `cnt ${A.flat().join('')}`, 1, 'นับทีละกอง จากซ้ายไปขวา', { fig: s5StackPic(A), unit: 'ก้อน' }),
      s5Opt('นำลูกบาศก์ขนาดเท่ากัน 2 ก้อนมาต่อกันหน้าชนหน้า จะได้รูปทรงใด', ['ทรงสี่เหลี่ยมมุมฉาก', 'ลูกบาศก์', 'ปริซึมสามเหลี่ยม', 'พีระมิด'], 'two', 2, 'ยาวขึ้นด้านเดียว'),
      s5Opt('ไอศกรีมโคน (ก้อนกลมบนโคน) ประกอบด้วยรูปทรงใด', ['กรวย และครึ่งทรงกลม', 'ทรงกระบอก และทรงกลม', 'พีระมิด และทรงกลม', 'กรวย และทรงกระบอก'], 'ice', 2, 'โคนแหลม + ก้อนไอศกรีมโค้ง'),
      s5Opt('บ้านของเล่นหลังคาจั่ว ประกอบด้วยรูปทรงใด', ['ทรงสี่เหลี่ยมมุมฉาก และปริซึมสามเหลี่ยม', 'ลูกบาศก์ และกรวย', 'ทรงกระบอก และพีระมิด', 'ปริซึมสามเหลี่ยมอย่างเดียว'], 'house', 3, 'ตัวบ้าน + หลังคาที่มีหน้าจั่วสามเหลี่ยมสองด้าน'),
      s5Opt('ตัดทรงสี่เหลี่ยมมุมฉากตามแนวเส้นทแยงมุมของหน้าบน (ตัดลงตรง ๆ) จะได้รูปทรงใด 2 ชิ้น', ['ปริซึมสามเหลี่ยม', 'พีระมิดฐานสามเหลี่ยม', 'ลูกบาศก์', 'กรวย'], 'split', 4, 'หน้าบนกลายเป็นสามเหลี่ยม ส่วนสูงเท่าเดิม'),
      s5Num('ภาพนี้มีลูกบาศก์กี่ก้อน (ไม่มีก้อนลอย ทุกก้อนวางบนพื้นหรือบนก้อนอื่น)', s5Count(B), `cnt2 ${B.flat().join('')}`, 4, 'นับเป็นกอง: กองหนึ่งสูงกี่ชั้น แล้วรวมทุกกอง', { fig: s5StackPic(B), unit: 'ก้อน' }),
      s5Num('ตารางบอกจำนวนลูกบาศก์ที่ซ้อนกันในแต่ละช่อง (มองจากด้านบน) มีลูกบาศก์ทั้งหมดกี่ก้อน', s5Count(Cg), `tab ${Cg.flat().join('')}`, 5, 'บวกตัวเลขทุกช่อง', { fig: s5Svg(Cg.map((r, i) => r.map((v, j) => `<rect x="${60 + j * 60}" y="${20 + i * 60}" width="60" height="60" fill="#FFF6D9" stroke="${S5C.ink}" stroke-width="2"/>` + s5T(90 + j * 60, 60 + i * 60, v, S5C.ink, 's5big')).join('')).join(''), 240, 150, 's5fig'), unit: 'ก้อน' }),
      s5Num('ต้องใช้ลูกบาศก์เล็กกี่ก้อน ต่อเป็นลูกบาศก์ใหญ่ที่ยาวด้านละ 3 ก้อน', 27, 'big3', 6, '3 × 3 × 3', { unit: 'ก้อน' }),
      s5Num(`มีลูกบาศก์ ${s5Count(A)} ก้อนตามภาพ ต้องเพิ่มอีกกี่ก้อนจึงจะเป็นทรงสี่เหลี่ยมมุมฉากขนาด 1 × 4 × 2 (ยาว 4 สูง 2)`, 8 - s5Count(A), `fill ${A.flat().join('')}`, 7, 'ทรงที่ต้องการมี 4 × 2 = 8 ก้อน', { fig: s5StackPic(A), unit: 'ก้อน' }),
      s5Opt('ดินสอที่เหลาแล้ว ประกอบด้วยรูปทรงใด', ['ปริซึมหกเหลี่ยม และกรวย', 'ทรงกระบอก และพีระมิด', 'ลูกบาศก์ และกรวย', 'ปริซึมหกเหลี่ยมอย่างเดียว'], 'pencil', 7, 'แท่งดินสอมีหกด้าน ปลายเหลาแหลม')]; }),

  /* ---------- 9 หน้าตัด ---------- */
  S5L(9, 'โรงเลื่อยหน้าตัด', 'หน้าตัดของรูปเรขาคณิตสามมิติ', 'หน้าตัด', 'บอกรูปของหน้าตัดเมื่อใช้ระนาบตัดรูปทรงในแนวขนานกับฐาน ตั้งฉากกับฐาน และแนวเฉียง', () => { const ks = shuffle(Object.keys(S5_CUTS)), it = k => { const [sk, n, d, dir, ans] = S5_CUTS[k]; return [`ใช้ระนาบตัด${S5_NAME[sk]}ในแนว<b>${dir}</b> หน้าตัดเป็นรูปใด`, s5SectOpts(ans), s5CutFig(sk, n, d)]; };
    const easy = ['cylH', 'cuboidH', 'sphH'], e1 = s5Pk(easy), q1 = it(e1), rest = ks.filter(k => !easy.includes(k)), q2 = it(rest[0]), q3 = it(rest[1]), q4 = it(rest[2]);
    return [
      s5Opt('<b>หน้าตัด</b>คืออะไร', ['รอยที่ระนาบตัดผ่านรูปทรง เป็นรูปสองมิติ', 'ภาพที่มองจากด้านบน', 'ภาพคลี่ของรูปทรง', 'หน้าที่อยู่ด้านล่างของรูปทรง'], 'def', 1, 'เหมือนหั่นแล้วดูรอยที่หั่น'),
      s5Opt(q1[0], q1[1], `cut ${e1}`, 1, 'ดูรูปสีชมพูตรงที่ระนาบตัดผ่าน', { fig: q1[2] }),
      s5Opt(q2[0], q2[1], `cut2 ${rest[0]}`, 2, 'ดูรูปสีชมพูตรงที่ระนาบตัดผ่าน', { fig: q2[2] }),
      s5Opt(q3[0], q3[1], `cut3 ${rest[1]}`, 3, 'ดูรูปสีชมพูตรงที่ระนาบตัดผ่าน', { fig: q3[2] }),
      s5Opt('รูปทรงใดตัดด้วยระนาบ<b>แนวใดก็ตาม</b> หน้าตัดเป็นรูปวงกลมเสมอ', ['ทรงกลม', 'ทรงกระบอก', 'กรวย', 'ลูกบาศก์'], 'sphall', 3, 'ผิวโค้งเท่ากันทุกทิศ'),
      s5Opt('หั่นแตงกวาตามขวาง (ขนานกับปลาย) หน้าตัดเป็นรูปใด', ['รูปวงกลม', 'รูปสี่เหลี่ยมมุมฉาก', 'รูปสามเหลี่ยม', 'รูปห้าเหลี่ยม'], 'cucumber', 4, 'แตงกวาคล้ายทรงกระบอก'),
      s5Opt('หั่นแตงกวาตามยาว (ผ่านปลายทั้งสองข้าง) หน้าตัดคล้ายรูปใด', ['รูปสี่เหลี่ยมผืนผ้า (หัวท้ายมน)', 'รูปวงกลม', 'รูปสามเหลี่ยม', 'รูปหกเหลี่ยม'], 'cucumber2', 5, 'ตัดทรงกระบอกตั้งฉากกับฐาน'),
      s5Opt(q4[0], q4[1], `cut4 ${rest[2]}`, 5, 'ดูรูปสีชมพูตรงที่ระนาบตัดผ่าน', { fig: q4[2] }),
      s5TF('ตัดลูกบาศก์ด้วยระนาบที่ขนานกับหน้าหนึ่ง หน้าตัดเป็นรูปสี่เหลี่ยมจัตุรัสที่เท่ากับหน้าของลูกบาศก์', true, 'ตัดขนานกับหน้า รอยตัดเท่ากับหน้านั้นพอดี', 6, 'cubepar'),
      s5Opt('ตัดกรวยด้วยระนาบที่ขนานกับฐาน รอยตัดยิ่งใกล้ยอดกรวย หน้าตัดจะเป็นอย่างไร', ['เป็นวงกลมที่เล็กลง', 'เป็นวงกลมที่ใหญ่ขึ้น', 'เปลี่ยนเป็นสามเหลี่ยม', 'เป็นวงรี'], 'conesmall', 7, 'กรวยแคบลงเรื่อย ๆ จนเป็นจุดที่ยอด')]; }),

  /* ---------- 10 นับหน้า สัน จุดยอด ---------- */
  S5L(10, 'ด่านนับทรง', 'การนับจำนวนหน้า สัน และจุดยอด', 'นับหน้า สัน จุดยอด', 'นับหน้า สัน จุดยอดของปริซึมและพีระมิดที่มีฐานเป็นรูปหลายเหลี่ยมต่าง ๆ และเปรียบเทียบกัน', () => { const n = s5R(5, 8), m = s5R(5, 8), q = s5R(4, 7), r = s5R(5, 9);
    return [
      s5Num('ลูกบาศก์มี<b>สัน</b>กี่เส้น', 12, 'cubee', 1, 'สันรอบบน 4 + รอบล่าง 4 + เสาตั้ง 4', { fig: s5Pic('cube', { W: 200, H: 170, sc: 40, cls: 's5fig' }), unit: 'เส้น' }),
      s5Num('ปริซึมสามเหลี่ยมมี<b>จุดยอด</b>กี่จุด', 6, 'pr3v', 1, 'ฐานบน 3 จุด + ฐานล่าง 3 จุด', { fig: s5Pic('prism3', { W: 200, H: 170, sc: 40, cls: 's5fig' }), unit: 'จุด' }),
      s5Num(`ปริซึมฐาน${S5_POLY[n]}มี<b>หน้า</b>กี่หน้า`, n + 2, `prf ${n}`, 2, 'หน้าข้างเท่าจำนวนด้านของฐาน + ฐานบนและล่าง 2 หน้า', { unit: 'หน้า' }),
      s5Num(`ปริซึมฐาน${S5_POLY[m]}มี<b>สัน</b>กี่เส้น`, 3 * m, `pre ${m}`, 3, 'สันรอบฐานบน + รอบฐานล่าง + สันข้าง = 3 เท่าของจำนวนด้านของฐาน', { unit: 'เส้น' }),
      s5Num(`พีระมิดฐาน${S5_POLY[q]}มี<b>จุดยอด</b>กี่จุด`, q + 1, `pyv ${q}`, 3, 'จุดยอดรอบฐาน + ยอดแหลมข้างบน 1 จุด', { unit: 'จุด' }),
      s5Num(`พีระมิดฐาน${S5_POLY[r]}มี<b>สัน</b>กี่เส้น`, 2 * r, `pye ${r}`, 4, 'สันรอบฐาน + สันที่ขึ้นไปหายอด = 2 เท่าของจำนวนด้านของฐาน', { unit: 'เส้น' }),
      s5Num('พีระมิดฐานห้าเหลี่ยมนี้มี<b>หน้า</b>กี่หน้า', 6, 'pyr5f', 4, 'ฐาน 1 หน้า + หน้าข้าง 5 หน้า', { fig: s5Pic('pyr5', { W: 220, H: 180, sc: 42, cls: 's5fig' }), unit: 'หน้า' }),
      s5Num(`ปริซึมฐาน${S5_POLY[n]}มีสันมากกว่าพีระมิดฐาน${S5_POLY[n]}กี่เส้น`, n, `cmp ${n}`, 6, `ปริซึม 3 × ${n} พีระมิด 2 × ${n}`, { unit: 'เส้น' }),
      s5Opt('รูปทรงใดมี<b>จุดยอดเท่ากับจำนวนหน้า</b>', ['พีระมิดฐานหกเหลี่ยม', 'ปริซึมหกเหลี่ยม', 'ลูกบาศก์', 'ปริซึมสามเหลี่ยม'], 'vfeq', 6, 'พีระมิดฐาน n เหลี่ยม: หน้า n + 1 จุดยอด n + 1'),
      s5Num(`ปริซึมฐาน${S5_POLY[q]} มีหน้า สัน และจุดยอด<b>รวมกัน</b>เท่าไร`, (q + 2) + 3 * q + 2 * q, `sum ${q}`, 8, 'หน้า n + 2 สัน 3n จุดยอด 2n แล้วรวมกัน')]; }),

  /* ---------- 11 ความสัมพันธ์ขององค์ประกอบ ---------- */
  S5L(11, 'ห้องแล็บออยเลอร์', 'ความสัมพันธ์ขององค์ประกอบในรูปทรง', 'หน้า + จุดยอด − สัน', 'สังเกตแบบรูปของจำนวนหน้า สัน จุดยอดของปริซึมและพีระมิด และพบว่า หน้า + จุดยอด − สัน = 2', () => { const n = s5R(4, 9), m = s5R(4, 9), k = s5Pk(['cube', 'prism3', 'pyr4', 'prism5', 'pyr3']), c = S5_CNT[k];
    return [
      s5Num(`${S5_NAME[k]} มีหน้า ${c[0]} สัน ${c[1]} จุดยอด ${c[2]} ค่าของ หน้า + จุดยอด − สัน เท่ากับเท่าไร`, 2, `euler ${k}`, 1, `${c[0]} + ${c[2]} − ${c[1]}`),
      s5Opt('ปริซึมฐาน n เหลี่ยม มีสันกี่เส้น', ['3n', '2n', 'n + 2', 'n + 1'], 'prform', 2, 'รอบบน n + รอบล่าง n + สันข้าง n'),
      s5Opt('พีระมิดฐาน n เหลี่ยม มีจุดยอดกี่จุด', ['n + 1', '2n', 'n + 2', '3n'], 'pyform', 2, 'รอบฐาน n จุด + ยอด 1 จุด'),
      s5Num(`ตารางปริซึม: ฐาน 3 เหลี่ยม → สัน 9, ฐาน 4 เหลี่ยม → สัน 12, ฐาน 5 เหลี่ยม → สัน 15 ถ้าฐาน ${n} เหลี่ยม สันเป็นเท่าไร`, 3 * n, `pat ${n}`, 3, 'เพิ่มด้านของฐาน 1 ด้าน สันเพิ่ม 3 เส้น'),
      s5Opt('ปริซึมฐาน n เหลี่ยม มีจุดยอดกี่จุด', ['2n', '3n', 'n + 1', 'n + 2'], 'prv', 3, 'ฐานบน n + ฐานล่าง n'),
      s5Opt('พีระมิดฐาน n เหลี่ยม มีหน้ากี่หน้า', ['n + 1', 'n + 2', '2n', 'n'], 'pyf', 3, 'หน้าข้าง n + ฐาน 1'),
      s5Num(`ใช้ หน้า + จุดยอด − สัน = 2 : พีระมิดฐาน${S5_POLY[m]} มีหน้า ${m + 1} จุดยอด ${m + 1} สันมีกี่เส้น`, 2 * m, `use ${m}`, 5, `สัน = หน้า + จุดยอด − 2`, { unit: 'เส้น' }),
      s5TF('ปริซึมทุกรูปมีจำนวนจุดยอดเป็นจำนวนคู่', true, 'จุดยอด = 2n เป็นจำนวนคู่เสมอ', 5, 'even'),
      s5TF('พีระมิดฐาน n เหลี่ยม มีจำนวนสันเป็น 2 เท่าของจำนวนด้านของฐาน', true, 'สันรอบฐาน n + สันข้าง n', 6, 'pyr2n'),
      s5Opt('รูปทรงใดมีจำนวน<b>สันมากที่สุด</b>', ['ปริซึมห้าเหลี่ยม', 'พีระมิดฐานเจ็ดเหลี่ยม', 'ลูกบาศก์', 'พีระมิดฐานหกเหลี่ยม'], 'most', 7, 'ปริซึม 3n พีระมิด 2n: 15, 14, 12, 12')]; }),

  /* ---------- 12 วิเคราะห์ภาพฉาย ---------- */
  S5L(12, 'หอดูภาพฉาย', 'วิเคราะห์ภาพฉายและภาพที่มองเห็น', 'อ่านภาพฉาย', 'ใช้ภาพด้านบนที่เขียนจำนวนลูกบาศก์กำกับ หาภาพด้านหน้า ด้านข้าง จำนวนลูกบาศก์ และเลือกรูปทรงที่ตรงกับภาพฉาย', () => { const A = s5RandStack(2, 3, 3, 6), B = s5RandStack(3, 3, 3, 8), gridFig = Hs => s5Svg(Hs.map((r, i) => r.map((v, j) => `<rect x="${s5N(150 - r.length * 25 + j * 50)}" y="${s5N(10 + i * 50)}" width="50" height="50" fill="${v ? '#FFF6D9' : '#fff'}" stroke="${S5C.ink}" stroke-width="2"/>` + (v ? s5T(150 - r.length * 25 + j * 50 + 25, 10 + i * 50 + 34, v, S5C.ink, 's5big') : '')).join('')).join('') + s5T(150, 30 + Hs.length * 50, '▲ ด้านหน้า', S5C.p, 's5l'), 300, 50 + Hs.length * 50, 's5fig');
    const Vb = s5Views(B), lo = Vb.front.reduce((a, b) => a + b, 0);
    return [
      s5Opt('ภาพด้านหน้าและด้านข้างเป็นรูปสามเหลี่ยม ภาพด้านบนเป็นรูปวงกลม คือรูปทรงใด', ['กรวย', 'ทรงกระบอก', 'พีระมิดฐานสี่เหลี่ยม', 'ทรงกลม'], 'cone3', 1, 'ด้านบนกลม ด้านข้างแหลม'),
      s5Opt('ภาพด้านหน้าและด้านข้างเป็นรูปสี่เหลี่ยมผืนผ้า ภาพด้านบนเป็นรูปวงกลม คือรูปทรงใด', ['ทรงกระบอก', 'กรวย', 'ทรงกลม', 'ทรงสี่เหลี่ยมมุมฉาก'], 'cyl3', 2, 'มองข้างเห็นเป็นแท่ง มองบนเห็นวงกลม'),
      s5Num('ตารางเป็นภาพด้านบน ตัวเลขบอกจำนวนลูกบาศก์ที่ซ้อนในช่องนั้น มีลูกบาศก์ทั้งหมดกี่ก้อน', s5Count(A), `sum ${A.flat().join('')}`, 2, 'บวกทุกช่อง', { fig: gridFig(A), unit: 'ก้อน' }),
      s5Pick('จากตารางภาพด้านบน ข้อใดเป็น<b>ภาพด้านหน้า</b>', s5ViewOpts(A, 'front'), `front ${A.flat().join('')}`, 3, 'แต่ละคอลัมน์ใช้ตัวเลขที่มากที่สุดในคอลัมน์นั้น', { story: gridFig(A) }),
      s5Pick('จากตารางภาพด้านบน ข้อใดเป็น<b>ภาพด้านข้าง</b> (มองจากขวา)', s5ViewOpts(A, 'side'), `side ${A.flat().join('')}`, 4, 'แต่ละแถวใช้ตัวเลขที่มากที่สุดในแถวนั้น แถวหน้าอยู่ซ้ายของภาพ', { story: gridFig(A) }),
      s5Opt('ภาพด้านหน้า ด้านข้าง และด้านบนเป็นรูปสี่เหลี่ยมจัตุรัสเท่ากันทั้งสามภาพ คือรูปทรงใด', ['ลูกบาศก์', 'ทรงกระบอก', 'ทรงสี่เหลี่ยมมุมฉากที่ยาวไม่เท่ากัน', 'พีระมิดฐานสี่เหลี่ยม'], 'cube3', 4, 'ทุกด้านเท่ากัน'),
      s5Pick('จากตารางภาพด้านบน ข้อใดเป็น<b>ภาพด้านหน้า</b>', s5ViewOpts(B, 'front'), `front3 ${B.flat().join('')}`, 5, 'แต่ละคอลัมน์ใช้ตัวเลขที่มากที่สุด', { story: gridFig(B) }),
      s5Num('ภาพด้านบนของลูกบาศก์ชุดหนึ่งมี 4 ช่อง และภาพด้านหน้าสูง 1 ชั้นทุกคอลัมน์ มีลูกบาศก์กี่ก้อน', 4, 'flat4', 6, 'สูงแค่ชั้นเดียว → ช่องละ 1 ก้อน', { unit: 'ก้อน' }),
      s5Num('ภาพด้านหน้ามีสี่เหลี่ยมเรียงกัน 3 ช่อง สูง 1 ชั้น ภาพด้านข้างมี 2 ช่อง สูง 1 ชั้น มีลูกบาศก์<b>มากที่สุด</b>ได้กี่ก้อน', 6, 'max', 7, 'สูงชั้นเดียว พื้นที่ด้านบนมากที่สุด 3 × 2 ช่อง', { unit: 'ก้อน' }),
      s5Num('จากตารางภาพด้านบน ถ้ามองจากด้านหน้า จะเห็นหน้าสี่เหลี่ยมของลูกบาศก์กี่รูป', lo, `look ${B.flat().join('')}`, 8, 'ภาพด้านหน้า = ความสูงที่มากที่สุดของแต่ละคอลัมน์ แล้วรวมกัน', { fig: gridFig(B), unit: 'รูป' })]; }),

  /* ---------- 13 วิเคราะห์ภาพคลี่ ---------- */
  S5L(13, 'ห้องปริศนาลูกเต๋า', 'วิเคราะห์ภาพคลี่', 'พับในใจ', 'เลือกภาพคลี่ที่พับเป็นลูกบาศก์ได้ หาหน้าที่อยู่ตรงข้ามและหน้าที่อยู่ติดกันเมื่อพับ', () => { const L = 'ABCDEF', mk = () => { const cells = s5Pk(S5_CUBE_NETS), opp = s5Opp(cells), lab = shuffle(L.split('')); return { cells, opp, lab, fig: (o = {}) => s5NetFlat(s5NetGrid(cells).map(f => ({ ...f, lab: lab[f.cell], c: '#FFF6D9' })), { W: o.W || 240, H: o.H || 170, cls: 's5fig' }) }; };
    const A = mk(), B = mk(), Cn = mk(), D = mk(), ia = s5R(0, 5), ib = s5R(0, 5), ic = s5R(0, 5), nb = [0, 1, 2, 3, 4, 5].filter(j => j !== ic && j !== Cn.opp[ic]);
    const dice = s5Pk(S5_CUBE_NETS), dOpp = s5Opp(dice), dn = [1, 2, 3, 4, 5, 6], dl = new Array(6); { const pairs = shuffle([[1, 6], [2, 5], [3, 4]]), done = new Set(); let p = 0; for (let j = 0; j < 6; j++) if (!done.has(j)) { const k = dOpp[j], pr = shuffle(pairs[p++]); dl[j] = pr[0]; dl[k] = pr[1]; done.add(j); done.add(k); } }
    const dq = s5R(0, 5);
    return [
      s5Pick('ข้อใดพับเป็น<b>ลูกบาศก์</b>ได้', [s5NetFlat(s5NetGrid(s5Pk(S5_CUBE_NETS))), ...shuffle(S5_NOT_NETS).slice(0, 3).map(c => s5NetFlat(s5NetGrid(c)))], 'ok1', 1, 'ภาพคลี่ที่มีสี่เหลี่ยมจัตุรัส 2×2 หรือมี 5 ช่องเรียงกันจะพับไม่ได้'),
      s5TF('ภาพคลี่ของลูกบาศก์มีได้แบบเดียวเท่านั้น', false, 'มีได้ถึง 11 แบบ', 1, 'onlyone'),
      s5Opt(`พับภาพคลี่เป็นลูกบาศก์ หน้าใดอยู่<b>ตรงข้าม</b>กับหน้า ${A.lab[ia]}`, [A.lab[A.opp[ia]], ...shuffle([0, 1, 2, 3, 4, 5].filter(j => j !== ia && j !== A.opp[ia]).map(j => A.lab[j])).slice(0, 3)], `opp ${A.cells.flat().join('')}${ia}`, 3, 'หน้าที่เว้นไป 1 ช่องในแถวเดียวกันจะอยู่ตรงข้ามกัน', { fig: A.fig() }),
      s5Opt(`พับภาพคลี่เป็นลูกบาศก์ หน้าใดอยู่<b>ตรงข้าม</b>กับหน้า ${B.lab[ib]}`, [B.lab[B.opp[ib]], ...shuffle([0, 1, 2, 3, 4, 5].filter(j => j !== ib && j !== B.opp[ib]).map(j => B.lab[j])).slice(0, 3)], `opp2 ${B.cells.flat().join('')}${ib}`, 4, 'ลองพับในใจทีละหน้า หน้าที่ติดกันจะไม่อยู่ตรงข้าม', { fig: B.fig() }),
      s5Opt(`พับภาพคลี่เป็นลูกบาศก์ หน้าใด<b>ไม่ได้อยู่ติดกับ</b>หน้า ${Cn.lab[ic]}`, [Cn.lab[Cn.opp[ic]], ...shuffle(nb).slice(0, 3).map(j => Cn.lab[j])], `adj ${Cn.cells.flat().join('')}${ic}`, 4, 'หน้าที่ไม่ได้ติดกันมีหน้าเดียว คือหน้าที่อยู่ตรงข้าม', { fig: Cn.fig() }),
      s5Num('ลูกบาศก์ 1 ลูก มีหน้าที่อยู่ติดกับหน้าหนึ่ง ๆ กี่หน้า', 4, 'nadj', 5, 'ทุกหน้ายกเว้นตัวเองและหน้าตรงข้าม', { unit: 'หน้า' }),
      s5Num(`ลูกเต๋าหน้าตรงข้ามรวมกันได้ 7 เสมอ จากภาพคลี่ หน้าตรงข้ามกับหน้า ${dl[dq]} คือหน้าใด`, dl[dOpp[dq]], `dice ${dice.flat().join('')}${dq}`, 6, '7 − ตัวเลขนั้น', { fig: s5NetFlat(s5NetGrid(dice).map(f => ({ ...f, lab: String(dl[f.cell]), c: '#fff' })), { W: 240, H: 170, cls: 's5fig' }) }),
      s5Opt('ภาพคลี่ลูกบาศก์ที่มี 4 หน้าเรียงต่อกันเป็นแถว อีก 2 หน้าต้องอยู่อย่างไร', ['คนละฝั่งของแถว ฝั่งละ 1 หน้า', 'ฝั่งเดียวกันทั้ง 2 หน้า', 'ต่อท้ายแถวทั้ง 2 หน้า', 'วางที่ไหนก็ได้'], 'rule', 6, 'ถ้าอยู่ฝั่งเดียวกันจะพับทับกัน'),
      s5Opt(`พับภาพคลี่เป็นลูกบาศก์ หน้าใดอยู่<b>ตรงข้าม</b>กับหน้า ${D.lab[0]}`, [D.lab[D.opp[0]], ...shuffle([1, 2, 3, 4, 5].filter(j => j !== D.opp[0]).map(j => D.lab[j])).slice(0, 3)], `opp3 ${D.cells.flat().join('')}`, 7, 'พับในใจ: เริ่มจากหน้านั้นเป็นฐาน แล้วยกหน้ารอบ ๆ ขึ้น', { fig: D.fig() }),
      s5Num('มีภาพคลี่ของลูกบาศก์ที่แตกต่างกันทั้งหมดกี่แบบ', 11, 'eleven', 8, 'นับแบบที่พลิกหรือหมุนแล้วซ้ำกันเป็นแบบเดียว', { unit: 'แบบ' })]; }),

  /* ---------- 14 หาค่าที่ไม่ทราบ ---------- */
  S5L(14, 'ถ้ำค่าปริศนา', 'การหาค่าที่ไม่ทราบจากรูปทรง', 'ย้อนหารูปทรง', 'ใช้ความสัมพันธ์ของหน้า สัน จุดยอด หาค่าที่หายไป และย้อนจากจำนวนองค์ประกอบไปหารูปทรง', () => { const n = s5R(5, 9), m = s5R(5, 9), p = s5R(6, 10), q = s5R(5, 8), e = s5R(4, 8);
    return [
      s5Num(`ปริซึมรูปหนึ่งมีสัน ${3 * n} เส้น ฐานของปริซึมเป็นรูปกี่เหลี่ยม`, n, `prE ${n}`, 2, `สัน = 3n → n = ${3 * n} ÷ 3`, { unit: 'เหลี่ยม' }),
      s5Num(`พีระมิดรูปหนึ่งมีจุดยอด ${m + 1} จุด มีหน้ากี่หน้า`, m + 1, `pyV ${m}`, 2, 'พีระมิด: หน้า = จุดยอด = n + 1', { unit: 'หน้า' }),
      s5Num(`พีระมิดรูปหนึ่งมีสัน ${2 * p} เส้น ฐานเป็นรูปกี่เหลี่ยม`, p, `pyE ${p}`, 3, `สัน = 2n → n = ${2 * p} ÷ 2`, { unit: 'เหลี่ยม' }),
      s5Num(`ปริซึมรูปหนึ่งมีจุดยอด ${2 * q} จุด มีหน้ากี่หน้า`, q + 2, `prV ${q}`, 4, `จุดยอด 2n → n = ${q} แล้วหน้า = n + 2`, { unit: 'หน้า' }),
      s5Num('รูปทรงหนึ่งมีหน้า 7 หน้า จุดยอด 10 จุด มีสันกี่เส้น (ใช้ หน้า + จุดยอด − สัน = 2)', 15, 'eulE', 4, '7 + 10 − สัน = 2', { unit: 'เส้น' }),
      s5Num(`รูปทรงหนึ่งมีสัน ${3 * e} เส้น และจุดยอด ${2 * e} จุด มีหน้ากี่หน้า`, e + 2, `eulF ${e}`, 5, `หน้า = 2 + สัน − จุดยอด`, { unit: 'หน้า' }),
      s5Opt('รูปทรงหนึ่งมีหน้า 5 หน้า สัน 8 เส้น จุดยอด 5 จุด คือรูปทรงใด', ['พีระมิดฐานสี่เหลี่ยม', 'ปริซึมสามเหลี่ยม', 'ลูกบาศก์', 'พีระมิดฐานสามเหลี่ยม'], 'which5', 5, 'จุดยอดเท่ากับหน้า → พีระมิด ฐาน 4 เหลี่ยม'),
      s5Opt('รูปทรงหนึ่งมีหน้า 5 หน้า สัน 9 เส้น จุดยอด 6 จุด คือรูปทรงใด', ['ปริซึมสามเหลี่ยม', 'พีระมิดฐานสี่เหลี่ยม', 'ปริซึมสี่เหลี่ยม', 'พีระมิดฐานห้าเหลี่ยม'], 'which9', 6, 'สัน 3n = 9 → ปริซึม ฐาน 3 เหลี่ยม'),
      s5TF('มีปริซึมที่มีสัน 20 เส้น', false, 'สันของปริซึม = 3n ต้องหารด้วย 3 ลงตัว แต่ 20 หารด้วย 3 ไม่ลงตัว', 7, 'no20'),
      s5Num('พีระมิดกับปริซึมมีฐานเป็นรูปหลายเหลี่ยมชนิดเดียวกัน รวมกันมีสัน 40 เส้น ฐานเป็นรูปกี่เหลี่ยม', 8, 'mix', 8, '2n + 3n = 5n = 40', { unit: 'เหลี่ยม' })]; }),

  /* ---------- 15 โจทย์ประยุกต์ ---------- */
  S5L(15, 'ตลาดนักประดิษฐ์', 'โจทย์ประยุกต์รูปเรขาคณิตสองมิติและสามมิติ', 'ประยุกต์', 'วิเคราะห์สิ่งของรอบตัว เลือกรูปทรงให้เหมาะกับงาน และแก้ปัญหาที่ใช้หลายแนวคิด (ภาพคลี่ ภาพฉาย หน้าตัด การนับ)', () => { const k = s5R(4, 6), j = s5R(4, 5);
    return [
      s5Opt('ร้านขนมต้องการกล่องที่วางซ้อนกันได้มั่นคงและไม่เปลืองที่ ควรใช้กล่องทรงใด', ['ทรงสี่เหลี่ยมมุมฉาก', 'ทรงกลม', 'กรวย', 'พีระมิด'], 'box', 1, 'หน้าเรียบ วางชิดกันได้ไม่มีช่องว่าง'),
      s5Opt('ทำไมกระป๋องน้ำอัดลมจึงทำเป็นทรงกระบอก', ['จับถือง่าย ไม่มีมุมแหลม และวางตั้งได้', 'เพราะมีหน้าราบมากที่สุด', 'เพราะซ้อนกันได้ไม่มีช่องว่างเลย', 'เพราะมีจุดยอดมาก'], 'can', 2, 'ผิวข้างโค้งรับมือ ฐานแบนวางตั้งได้'),
      s5Num('ทำกล่องลูกบาศก์ไม่มีฝาด้านบน ต้องตัดกระดาษสี่เหลี่ยมจัตุรัสกี่ชิ้น', 5, 'nolid', 3, 'ลูกบาศก์มี 6 หน้า ไม่มีฝา 1 หน้า', { unit: 'ชิ้น' }),
      s5Num(`ทาสีลูกบาศก์ใหญ่ที่ต่อจากลูกบาศก์เล็ก ${k} × ${k} × ${k} ก้อน แล้วแยกออก ลูกบาศก์เล็กที่ถูกทาสี <b>3 หน้า</b>มีกี่ก้อน`, 8, `paint3 ${k}`, 4, 'อยู่ที่มุมของลูกบาศก์ใหญ่ ซึ่งมี 8 มุมเสมอ', { unit: 'ก้อน' }),
      s5Num(`ทาสีลูกบาศก์ใหญ่ขนาด ${j} × ${j} × ${j} ก้อนเล็ก แล้วแยกออก ก้อนเล็กที่ถูกทาสี <b>2 หน้า</b>มีกี่ก้อน`, 12 * (j - 2), `paint2 ${j}`, 6, `อยู่บนสัน (ไม่รวมมุม) สันละ ${j - 2} ก้อน × 12 สัน`, { unit: 'ก้อน' }),
      s5Num(`ทาสีลูกบาศก์ใหญ่ขนาด ${j} × ${j} × ${j} ก้อนเล็ก แล้วแยกออก ก้อนเล็กที่<b>ไม่ถูกทาสีเลย</b>มีกี่ก้อน`, (j - 2) ** 3, `paint0 ${j}`, 7, `ก้อนข้างในที่ไม่แตะผิวนอก: ${j - 2} × ${j - 2} × ${j - 2}`, { unit: 'ก้อน' }),
      s5Opt('หั่นเค้กทรงกระบอกจากด้านบนลงมาตรง ๆ ผ่านจุดศูนย์กลาง หน้าตัดเป็นรูปใด', ['รูปสี่เหลี่ยมมุมฉาก', 'รูปวงกลม', 'รูปสามเหลี่ยม', 'รูปวงรี'], 'cake', 4, 'ตัดทรงกระบอกในแนวตั้งฉากกับฐาน'),
      s5Opt('ทำโคมกระดาษทรงพีระมิดฐานห้าเหลี่ยม ต้องใช้กระดาษรูปสามเหลี่ยมกี่ชิ้น และรูปห้าเหลี่ยมกี่ชิ้น', ['สามเหลี่ยม 5 ชิ้น ห้าเหลี่ยม 1 ชิ้น', 'สามเหลี่ยม 5 ชิ้น ห้าเหลี่ยม 2 ชิ้น', 'สามเหลี่ยม 6 ชิ้น ห้าเหลี่ยม 1 ชิ้น', 'สามเหลี่ยม 4 ชิ้น ห้าเหลี่ยม 1 ชิ้น'], 'lamp', 5, 'ฐาน 1 + หน้าข้างเท่าจำนวนด้านของฐาน'),
      s5Num('ทำโครงลูกบาศก์ด้วยหลอดดูด (หลอด 1 อัน = สัน 1 เส้น) และใช้ดินน้ำมันเชื่อมที่มุม ต้องใช้หลอดกี่อัน', 12, 'straw', 5, 'จำนวนหลอด = จำนวนสัน', { unit: 'อัน' }),
      s5Num('ทำโครงปริซึมหกเหลี่ยมด้วยหลอดและดินน้ำมัน ต้องใช้ดินน้ำมันกี่ก้อน (1 ก้อนต่อ 1 มุม)', 12, 'clay6', 7, 'จำนวนก้อน = จำนวนจุดยอด = 2 × 6', { unit: 'ก้อน' })]; }),

  /* ---------- 16 ภารกิจสุดท้าย: นักออกแบบรูปทรง ---------- */
  S5L(16, 'สตูดิโอนักออกแบบ', 'ภารกิจสุดท้าย: นักออกแบบรูปทรง', 'นักออกแบบ', 'ออกแบบสิ่งของจากรูปทรงเรขาคณิต บอกส่วนประกอบ เลือกภาพด้านหน้า ด้านข้าง ด้านบน และภาพคลี่ที่ใช้สร้างชิ้นงานได้', () => { const A = s5RandStack(2, 3, 2, 5), B = s5RandStack(3, 2, 3, 6);
    return [
      s5Opt('ออกแบบที่ใส่ดินสอเป็นทรงกระบอกไม่มีฝา ต้องใช้กระดาษรูปใดบ้าง', ['วงกลม 1 รูป และสี่เหลี่ยมผืนผ้า 1 รูป', 'วงกลม 2 รูป และสี่เหลี่ยมผืนผ้า 1 รูป', 'สี่เหลี่ยมผืนผ้า 2 รูป', 'วงกลม 1 รูป และรูปพัด 1 รูป'], 'pencup', 2, 'ทรงกระบอกไม่มีฝาบน'),
      s5Opt('ออกแบบหมวกวันเกิดทรงกรวย (ไม่มีฐาน) ต้องตัดกระดาษเป็นรูปใด', ['รูปพัด (ส่วนของวงกลม)', 'รูปวงกลม', 'รูปสามเหลี่ยม', 'รูปสี่เหลี่ยมผืนผ้า'], 'hat', 2, 'ผิวข้างของกรวยคลี่ออกเป็นรูปพัด'),
      s5Pick('ออกแบบกล่องของขวัญทรงสี่เหลี่ยมมุมฉาก ภาพคลี่ใดใช้ได้', [s5NetFlat(s5NetCuboid()), s5NetFlat(s5NetPrism(3)), s5NetFlat(s5NetPyr(4)), s5NetFlat(s5NetGrid(S5_NOT_NETS[0]))], 'gift', 3, 'สี่เหลี่ยมมุมฉาก 6 รูป และพับแล้วไม่ทับกัน'),
      s5Pick('นักออกแบบวางลูกบาศก์ตามภาพ ข้อใดเป็น<b>ภาพด้านบน</b>', s5ViewOpts(A, 'top'), `dtop ${A.flat().join('')}`, 4, 'ช่องที่มีลูกบาศก์ เมื่อมองลงมาจากข้างบน', { story: s5StackPic(A) }),
      s5Pick('นักออกแบบวางลูกบาศก์ตามภาพ ข้อใดเป็น<b>ภาพด้านหน้า</b>', s5ViewOpts(B, 'front'), `dfront ${B.flat().join('')}`, 5, 'แต่ละคอลัมน์เห็นกองที่สูงที่สุด', { story: s5StackPic(B, { sc: 26 }) }),
      s5Num('ชิ้นงานนี้ใช้ลูกบาศก์กี่ก้อน', s5Count(B), `dcnt ${B.flat().join('')}`, 5, 'นับทีละกอง', { fig: s5StackPic(B, { sc: 26 }), unit: 'ก้อน' }),
      s5Opt('ออกแบบเต็นท์ที่มีพื้นและผนังหน้า–หลังเป็นรูปสามเหลี่ยม ควรเป็นรูปทรงใด', ['ปริซึมสามเหลี่ยม', 'พีระมิดฐานสามเหลี่ยม', 'กรวย', 'ทรงกระบอก'], 'tent', 4, 'ด้านหน้าและด้านหลังเป็นสามเหลี่ยมเหมือนกัน'),
      s5Opt('ต้องการโคมไฟที่ภาพด้านบนเป็นวงกลม และภาพด้านหน้าเป็นสามเหลี่ยม ควรออกแบบเป็นทรงใด', ['กรวย', 'ทรงกระบอก', 'พีระมิด', 'ลูกบาศก์'], 'lampd', 6, 'บนเป็นวงกลม หน้าเป็นสามเหลี่ยม'),
      s5Num('ออกแบบชั้นวางรูปทรงปริซึมห้าเหลี่ยมด้วยไม้ระแนง (สัน 1 เส้น = ไม้ 1 อัน) ต้องใช้ไม้กี่อัน', 15, 'shelf', 6, 'สันปริซึม = 3 × 5', { unit: 'อัน' }),
      s5Opt('ข้อใดอธิบายเหตุผลการออกแบบ "ลูกบอลเป็นทรงกลม" ได้ดีที่สุด', ['กลิ้งได้ทุกทิศทางเท่ากัน', 'วางซ้อนกันได้มั่นคง', 'มีหน้าราบให้วางตั้ง', 'มีสันให้จับ'], 'ball', 7, 'ทรงกลมมีผิวโค้งเท่ากันทุกทิศ')]; })
];

/* ---------- บอส: 20 ข้อ (แนวเดียวกับใบงาน/แบบทดสอบที่ผู้ใช้แนบ — เขียนใหม่ทั้งหมด ข้อมูลสมมติ) ---------- */
const S5_BOSS_NET = [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 2]], S5_BOSS_OPP = s5Opp(S5_BOSS_NET);
const EXAM_M1C5 = xrot([
  { q: 'รูปเรขาคณิตสามมิติต่างจากรูปเรขาคณิตสองมิติในเรื่องใด', opts: ['มีความหนา (ความสูง)', 'มีความกว้าง', 'มีความยาว', 'มีมุม'], a: 0, lv: 2503 },
  { q: 'ข้อใด<b>ไม่ใช่</b>รูปเรขาคณิตสามมิติ', opts: ['รูปสี่เหลี่ยมคางหมู', 'ปริซึมห้าเหลี่ยม', 'ทรงกลม', 'กรวย'], a: 0, lv: 2503 },
  { q: 'รูปหกเหลี่ยมมีเส้นทแยงมุมทั้งหมดกี่เส้น', opts: ['9', '6', '3', '12'], a: 0, lv: 2502 },
  { q: 'รูปทรงนี้ประกอบด้วยรูปสองมิติใดบ้าง', fig: s5Pic('pyr4', { W: 220, H: 180, sc: 42, cls: 's5fig' }), opts: ['สามเหลี่ยม 4 รูป และสี่เหลี่ยม 1 รูป', 'สามเหลี่ยม 3 รูป และสี่เหลี่ยม 1 รูป', 'สามเหลี่ยม 4 รูป และสี่เหลี่ยม 2 รูป', 'สามเหลี่ยม 2 รูป และสี่เหลี่ยม 3 รูป'], a: 0, lv: 2505 },
  { q: 'ทรงกระบอกมีหน้าราบและผิวโค้งอย่างละกี่หน้า', opts: ['หน้าราบ 2 ผิวโค้ง 1', 'หน้าราบ 1 ผิวโค้ง 2', 'หน้าราบ 3 ผิวโค้ง 0', 'หน้าราบ 0 ผิวโค้ง 1'], a: 0, lv: 2504 },
  { q: 'ปริซึมห้าเหลี่ยมมีสันกี่เส้น', fig: s5Pic('prism5', { W: 220, H: 180, sc: 42, cls: 's5fig' }), opts: ['15', '10', '7', '12'], a: 0, lv: 2510 },
  { q: 'พีระมิดฐานแปดเหลี่ยมมีจุดยอดกี่จุด', opts: ['9', '8', '16', '10'], a: 0, lv: 2510 },
  { q: 'ภาพคลี่นี้พับแล้วได้รูปทรงใด', fig: s5NetFlat(s5NetPrism(3), { W: 240, H: 180, cls: 's5fig' }), opts: ['ปริซึมสามเหลี่ยม', 'พีระมิดฐานสามเหลี่ยม', 'ทรงสี่เหลี่ยมมุมฉาก', 'พีระมิดฐานสี่เหลี่ยม'], a: 0, lv: 2507 },
  { q: 'ภาพคลี่ของทรงกระบอกประกอบด้วยรูปใด', opts: ['วงกลม 2 รูป และสี่เหลี่ยมผืนผ้า 1 รูป', 'วงกลม 1 รูป และรูปพัด 1 รูป', 'วงกลม 2 รูป และสามเหลี่ยม 1 รูป', 'สี่เหลี่ยมผืนผ้า 3 รูป'], a: 0, lv: 2507 },
  { q: 'ระนาบตัดกรวยในแนวเฉียงตามภาพ (ไม่ผ่านฐาน) หน้าตัดเป็นรูปใด', fig: s5CutFig('cone', [.42, 1, 0], -.25), opts: ['รูปวงรี', 'รูปวงกลม', 'รูปสามเหลี่ยม', 'รูปสี่เหลี่ยมมุมฉาก'], a: 0, lv: 2509 },
  { q: 'ข้อใดได้หน้าตัด<b>ไม่ใช่</b>รูปวงกลม', opts: ['ตัดทรงกระบอกในแนวตั้งฉากกับฐาน', 'ตัดทรงกลมในแนวใดก็ได้', 'ตัดกรวยในแนวขนานกับฐาน', 'ตัดทรงกระบอกในแนวขนานกับฐาน'], a: 0, lv: 2509 },
  { q: 'มองกรวยที่ตั้งอยู่จากด้านบน จะเห็นเป็นรูปใด', opts: ['วงกลมที่มีจุดตรงกลาง', 'สามเหลี่ยม', 'สี่เหลี่ยมจัตุรัส', 'วงรี'], a: 0, lv: 2506 },
  { q: 'ภาพนี้มีลูกบาศก์กี่ก้อน (ทุกก้อนวางบนพื้นหรือบนก้อนอื่น)', fig: s5StackPic([[3, 2, 1], [2, 1, 0]]), opts: ['9', '8', '6', '10'], a: 0, lv: 2508 },
  { q: 'ภาพด้านบนของลูกบาศก์ชุดนี้มีรูปสี่เหลี่ยมจัตุรัสกี่รูป', fig: s5StackPic([[3, 2, 0], [2, 1, 1]]), opts: ['5', '9', '6', '4'], a: 0, lv: 2506 },
  { q: 'ตารางเป็นภาพด้านบน ตัวเลขคือจำนวนลูกบาศก์ที่ซ้อนในช่องนั้น ภาพด้านหน้าสูงกี่ชั้นในแต่ละคอลัมน์ (ซ้าย → ขวา)', fig: s5Svg([[1, 3, 2], [2, 1, 1]].map((r, i) => r.map((v, j) => `<rect x="${75 + j * 50}" y="${10 + i * 50}" width="50" height="50" fill="#FFF6D9" stroke="${S5C.ink}" stroke-width="2"/>` + s5T(100 + j * 50, 44 + i * 50, v, S5C.ink, 's5big')).join('')).join('') + s5T(150, 132, '▲ ด้านหน้า', S5C.p, 's5l'), 300, 140, 's5fig'), opts: ['2 ชั้น 3 ชั้น 2 ชั้น', '1 ชั้น 3 ชั้น 2 ชั้น', '3 ชั้น 4 ชั้น 3 ชั้น', '2 ชั้น 1 ชั้น 1 ชั้น'], a: 0, lv: 2512 },
  { q: 'พับภาพคลี่เป็นลูกบาศก์ หน้าใดอยู่ตรงข้ามกับหน้า A', fig: s5NetFlat(s5NetGrid(S5_BOSS_NET).map(f => ({ ...f, lab: 'ABCDEF'[f.cell], c: '#FFF6D9' })), { W: 240, H: 170, cls: 's5fig' }), opts: ['ABCDEF'[S5_BOSS_OPP[0]], ...'ABCDEF'.split('').filter((_, j) => j && j !== S5_BOSS_OPP[0]).slice(0, 3)], a: 0, lv: 2513 },
  { q: 'รูปทรงหนึ่งมีหน้า 8 หน้า และจุดยอด 12 จุด มีสันกี่เส้น', opts: ['18', '20', '16', '22'], a: 0, lv: 2514 },
  { q: 'ปริซึมรูปหนึ่งมีสัน 21 เส้น ฐานเป็นรูปกี่เหลี่ยม', opts: ['7', '9', '6', '8'], a: 0, lv: 2514 },
  { q: 'ทาสีลูกบาศก์ใหญ่ที่ต่อจากลูกบาศก์เล็ก 3 × 3 × 3 ก้อน แล้วแยกออก ก้อนเล็กที่ถูกทาสี 2 หน้ามีกี่ก้อน', opts: ['12', '8', '6', '24'], a: 0, lv: 2515 },
  { q: 'ออกแบบกล่องใส่ของทรงสี่เหลี่ยมมุมฉากไม่มีฝา ต้องตัดกระดาษรูปสี่เหลี่ยมมุมฉากกี่ชิ้น', opts: ['5', '6', '4', '8'], a: 0, lv: 2516 }
], 4);
LESSONS_M1C5.push({ id: 2519, boss: true, place: 'วังจระเข้ทรงเรขา', title: 'ด่านบอส: ม.1 บทที่ 5 รูปเรขาคณิตสองมิติและสามมิติ', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'ตอบคำถามเรื่องรูปเรขาคณิตสองมิติและสามมิติ 20 ข้อ ตอบถูก 16 ข้อขึ้นไปเพื่อชนะจระเข้ทรงเรขา',
  exam: EXAM_M1C5, pass: 16, bossName: 'จระเข้ทรงเรขา', bossPal: 'sky', emblem: '⬡', bossKind: 'croc',
  winLine: 'ชนะจระเข้ทรงเรขาแล้ว! มองรูปทรงได้ทุกมุม ทั้งภาพคลี่ ภาพฉาย และหน้าตัด', loseLine: 'จระเข้ทรงเรขายังเฝ้าวังอยู่ ลองทวนหน้า สัน จุดยอด ภาพคลี่ และภาพสามทิศอีกนิดแล้วมาสู้ใหม่นะ!' });
