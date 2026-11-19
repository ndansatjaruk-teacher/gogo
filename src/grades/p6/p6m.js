/* =========================================================
   ป.6 บทที่ 9 รูปเรขาคณิตสามมิติ (ภาคเรียนที่ 2) — tiny 3D engine (rotate by dragging), solids,
   folding nets (prism / pyramid / cube), composite cuboids (volume), containers (capacity).
   Levels 861–868 + boss 869   (prefix s9)
   ========================================================= */
const S9C = { a: '#8EC5FA', b: '#FFB38A', c: '#7EDDB8', d: '#C4B5FD', e: '#FFD27A', f: '#F9A8D4', g: '#9BE3E0' };
const s9rot = (p, yaw, pitch) => { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy;
  return [x, p[1] * cp - z * sp, p[1] * sp + z * cp]; };
const s9sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], s9dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const s9cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const s9newell = P => { const n = [0, 0, 0]; P.forEach((p, i) => { const q = P[(i + 1) % P.length]; n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]); }); return n; };
const s9mean = P => P.reduce((s, p) => [s[0] + p[0] / P.length, s[1] + p[1] / P.length, s[2] + p[2] / P.length], [0, 0, 0]);
function s9shade(hex, f) { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(Math.min(255, v * f))); return `rgb(${c})`; }
/* ---------- meshes ---------- */
const s9ngon = (n, r, y, rot = 0) => Array.from({ length: n }, (_, i) => { const a = rot + i * 2 * Math.PI / n; return [r * Math.cos(a), y, r * Math.sin(a)]; });
const s9rotN = n => Math.PI / 2 + Math.PI / n; // a side faces the viewer
function s9prism(n, r, H, o = {}) { const soft = n > 16, b = s9ngon(n, r, -H / 2, o.rot ?? s9rotN(n)), t = s9ngon(n, r, H / 2, o.rot ?? s9rotN(n)), V = [...b, ...t];
  const F = [{ v: b.map((_, i) => i), col: o.base || S9C.b, hard: true, kind: 'base' }, { v: t.map((_, i) => n + i), col: o.base || S9C.b, hard: true, kind: 'base' }];
  for (let i = 0; i < n; i++) F.push({ v: [i, (i + 1) % n, n + (i + 1) % n, n + i], col: o.side || S9C.a, hard: !soft, kind: 'side' });
  return { V, F, C: [0, 0, 0] }; }
function s9pyr(n, r, H, o = {}) { const soft = n > 16, b = s9ngon(n, r, -H / 2, o.rot ?? s9rotN(n)), V = [...b, [0, H / 2, 0]];
  const F = [{ v: b.map((_, i) => i), col: o.base || S9C.b, hard: true, kind: 'base' }];
  for (let i = 0; i < n; i++) F.push({ v: [i, (i + 1) % n, n], col: o.side || S9C.c, hard: !soft, kind: 'side' });
  return { V, F, C: [0, -H / 4, 0] }; }
function s9box(x, y, z, w, hh, d, col = S9C.a, name) { const V = [[x, y, z], [x + w, y, z], [x + w, y, z + d], [x, y, z + d], [x, y + hh, z], [x + w, y + hh, z], [x + w, y + hh, z + d], [x, y + hh, z + d]];
  const F = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [3, 0, 4, 7]].map(v => ({ v, col, hard: true }));
  return { V, F, C: [x + w / 2, y + hh / 2, z + d / 2], name }; }
const s9glass = m => { m.F.forEach(f => { f.op = .22; f.col = '#BFDDF7'; }); m.glass = 1; return m; };
const s9cube = (s = 2) => { const m = s9box(-s / 2, -s / 2, -s / 2, s, s, s, S9C.d); return m; };
/* ---------- render: o.yaw o.pitch o.W o.H o.k o.hidden o.labels [{a,b,t}] o.sphere {r} o.center ---------- */
function s9render(meshes, o = {}) {
  const W = o.W || 400, H = o.H || 270, yaw = o.yaw ?? .6, pitch = o.pitch ?? .45, AV = meshes.flatMap(m => m.V);
  const cen = o.center || (AV.length ? [0, 1, 2].map(i => (Math.min(...AV.map(v => v[i])) + Math.max(...AV.map(v => v[i]))) / 2) : [0, 0, 0]);
  let R0 = .01; meshes.forEach(m => m.V.forEach(p => { R0 = Math.max(R0, Math.hypot(...s9sub(p, cen))); })); if (o.sphere) R0 = Math.max(R0, o.sphere.r);
  let k = o.k || Math.min(W, H) / 2.25 / R0, cx = W / 2, cy = H / 2 + (o.dy || 0);
  if (o.fit !== false && !o.k && AV.length) { const Q = AV.map(p => s9rot(s9sub(p, cen), yaw, pitch)), xs = Q.map(q => q[0]), ys = Q.map(q => q[1]), pad = o.pad ?? 40, bw = Math.max(...xs) - Math.min(...xs) || 1, bh = Math.max(...ys) - Math.min(...ys) || 1;
    k = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh, (o.sphere ? Math.min(W, H) / 2.4 / o.sphere.r : 1e9)); cx = W / 2 - (Math.max(...xs) + Math.min(...xs)) / 2 * k; cy = H / 2 + (Math.max(...ys) + Math.min(...ys)) / 2 * k; }
  const pr = p => { const q = s9rot(s9sub(p, cen), yaw, pitch); return [cx + q[0] * k, cy - q[1] * k, q[2]]; };
  const L = [-.35, .75, .55], ln = Math.hypot(...L), Ln = L.map(v => v / ln);
  let back = '', polys = [], marks = '';
  meshes.forEach(m => { const P = m.V.map(pr), Cr = s9rot(s9sub(m.C, cen), yaw, pitch), E = {};
    m.F.forEach((f, fi) => { const Q3 = f.v.map(i => { const q = s9rot(s9sub(m.V[i], cen), yaw, pitch); return q; }); let n = s9newell(Q3); const fc = s9mean(Q3); if (s9dot(n, s9sub(fc, Cr)) < 0) n = n.map(v => -v);
      const nl = Math.hypot(...n) || 1; f._front = n[2] / nl > 1e-6; f._lum = .72 + .34 * Math.max(0, s9dot(n.map(v => v / nl), Ln)); f._z = fc[2];
      f.v.forEach((a, i) => { const b = f.v[(i + 1) % f.v.length], key = a < b ? a + '-' + b : b + '-' + a; (E[key] = E[key] || []).push(fi); }); });
    const edgeOK = (a, b, f) => { const key = a < b ? a + '-' + b : b + '-' + a, fs = (E[key] || []).map(i => m.F[i]); return fs.some(g => g.hard) || fs.some(g => !g._front) || fs.length < 2; };
    if (o.hidden) Object.entries(E).forEach(([key, fs]) => { if (fs.every(i => !m.F[i]._front) && fs.some(i => m.F[i].hard)) { const [a, b] = key.split('-').map(Number); back += `<path d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}" stroke="#7E78A0" stroke-width="1.4" stroke-dasharray="5 4"/>`; } });
    m.F.forEach(f => { if (!f._front) return; let edges = ''; f.v.forEach((a, i) => { const b = f.v[(i + 1) % f.v.length]; if (edgeOK(a, b, f)) edges += `<path d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}" stroke="#2B2550" stroke-width="2" stroke-linecap="round"/>`; });
      const col = f.hl || f.col; polys.push({ z: f._z, s: `<path d="M${f.v.map(i => P[i][0] + ' ' + P[i][1]).join(' L')} Z" fill="${s9shade(col, f._lum)}" fill-opacity="${f.op ?? 1}" stroke="${f.op ? 'none' : s9shade(col, f._lum)}" stroke-width=".8" stroke-linejoin="round"/>${edges}` }); });
    /* o.markEdges / o.markVerts: every edge / vertex in colour (hidden ones dashed / hollow) — for counting สัน and จุดยอด */
    if (o.markEdges || o.markVerts) { const vis = new Set(), used = new Set();
      Object.entries(E).forEach(([key, fs]) => { if (!fs.some(i => m.F[i].hard)) return; const [a, b] = key.split('-').map(Number), front = fs.some(i => m.F[i]._front); used.add(a); used.add(b); if (front) { vis.add(a); vis.add(b); }
        if (o.markEdges) marks += `<path d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}" stroke="#E5487A" stroke-width="${front ? 5 : 3.2}" ${front ? '' : 'stroke-dasharray="7 5" opacity=".8"'} stroke-linecap="round"/>`; });
      if (o.markVerts) used.forEach(i => { marks += `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="${vis.has(i) ? 7 : 6}" fill="${vis.has(i) ? '#7C3AED' : '#fff'}" stroke="#7C3AED" stroke-width="3"/>`; }); } });
  /* v110 o.pick (หน้า สัน จุดยอด ทีละส่วน): { edges:[[a,b]], verts:[i], nums:true, call:{edge:[a,b]|vert:i|face:fi, t} } on the first mesh — drawn on top, with a pointer label */
  if (o.pick && meshes[0]) { const m = meshes[0], P = m.V.map(pr), K = o.pick; let s2 = '';
    if (K.nums) m.F.forEach((f, fi) => { if (!f._front) return; const c = s9mean(f.v.map(i => P[i])); s2 += `<circle cx="${c[0]}" cy="${c[1]}" r="13" fill="#fff" stroke="#2B2550" stroke-width="2"/><text x="${c[0]}" y="${c[1] + 5}" text-anchor="middle" class="s9-num">${fi + 1}</text>`; });
    (K.edges || []).forEach(([a, b]) => { s2 += `<path d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}" stroke="#fff" stroke-width="11" stroke-linecap="round" opacity=".8"/><path d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}" stroke="#E5487A" stroke-width="7" stroke-linecap="round"/>`; });
    (K.verts || []).forEach(i => { s2 += `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="10" fill="#7C3AED" stroke="#fff" stroke-width="3.5"/>`; });
    if (K.call) { const C = K.call, tg = C.edge ? [(P[C.edge[0]][0] + P[C.edge[1]][0]) / 2, (P[C.edge[0]][1] + P[C.edge[1]][1]) / 2] : C.vert != null ? P[C.vert] : s9mean(m.F[C.face].v.map(i => P[i]));
      let dx = tg[0] - W / 2, dy = tg[1] - H / 2; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl; if (Math.abs(dy) < .25) dy = -.5;
      const tw = String(C.t).length * 9.5 + 24, lx = Math.max(tw / 2 + 4, Math.min(W - tw / 2 - 4, tg[0] + dx * 92)), ly = Math.max(22, Math.min(H - 22, tg[1] + dy * 70));
      s2 += `<path d="M${lx} ${ly} L${tg[0]} ${tg[1]}" stroke="#2B2550" stroke-width="2.4"/><circle cx="${tg[0]}" cy="${tg[1]}" r="4" fill="#2B2550"/><rect x="${lx - tw / 2}" y="${ly - 16}" width="${tw}" height="32" rx="16" fill="#FFF3B0" stroke="#2B2550" stroke-width="2"/><text x="${lx}" y="${ly + 6}" text-anchor="middle" class="s9-call">${C.t}</text>`; }
    marks += s2; }
  polys.sort((a, b) => a.z - b.z);
  let s = `<svg viewBox="0 0 ${W} ${H}" class="t6-svg s9-svg" aria-hidden="true">${o.under || ''}${polys.map(p => p.s).join('')}${back}${marks}`;
  if (o.sphere) { const c = pr(o.sphere.c || [0, 0, 0]), r = o.sphere.r * k, ry = r * Math.abs(Math.sin(pitch));
    s += `<defs><radialGradient id="s9sg" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="${o.sphere.col || '#FFB38A'}"/><stop offset="1" stop-color="${s9shade(o.sphere.col || '#FFB38A', .7)}"/></radialGradient></defs>
      <circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="url(#s9sg)" stroke="#2B2550" stroke-width="2"/><path d="M${c[0] - r} ${c[1]} A${r} ${ry} 0 0 0 ${c[0] + r} ${c[1]}" fill="none" stroke="#2B2550" stroke-width="1.4"/><path d="M${c[0] - r} ${c[1]} A${r} ${ry} 0 0 1 ${c[0] + r} ${c[1]}" fill="none" stroke="#7E78A0" stroke-width="1.2" stroke-dasharray="5 4"/>`;
    if (o.sphereR) s += `<path d="M${c[0]} ${c[1]} L${c[0] + r} ${c[1]}" stroke="#E5487A" stroke-width="2.4"/><circle cx="${c[0]}" cy="${c[1]}" r="3.5" fill="#E5487A"/>`; }
  (o.labels || []).forEach(g => { const A = pr(g.a), B = pr(g.b), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = [M[0] - cx, M[1] - cy], dl = Math.hypot(...d) || 1, off = g.off ?? 16;
    s += `<text x="${M[0] + d[0] / dl * off}" y="${M[1] + d[1] / dl * off + 5}" text-anchor="middle" class="t6-sv s9-l">${g.t}</text>`; });
  return s + (o.extra || '') + '</svg>';
}
/* drag-to-rotate viewer */
function s9viewer(get, o = {}) {
  let yaw = o.yaw ?? .6, pitch = o.pitch ?? .45, drag = null; const box = h('div', { class: 't6-board ia drag s9-view' });
  const draw = () => { box.innerHTML = s9render(get(), { fit: false, ...o, ...(o.opts ? o.opts() : {}), yaw, pitch }); };
  box.addEventListener('pointerdown', e => { e.preventDefault(); drag = [e.clientX, e.clientY, yaw, pitch]; try { box.setPointerCapture(e.pointerId); } catch (_) { } });
  box.addEventListener('pointermove', e => { if (!drag) return; yaw = drag[2] + (e.clientX - drag[0]) * .012; pitch = Math.max(-.2, Math.min(1.45, drag[3] + (e.clientY - drag[1]) * .01)); draw(); });
  box.addEventListener('pointerup', () => { if (drag) sfx.tap(); drag = null; });
  box.redraw = draw; box.view = (y, p) => { yaw = y; pitch = p; draw(); }; draw(); return box;
}
const s9fig = (meshes, o = {}) => s9render(meshes, { W: 400, H: 260, ...o });

/* ---------- solid catalogue ---------- */
const S9_TH = { 3: 'สามเหลี่ยม', 4: 'สี่เหลี่ยม', 5: 'ห้าเหลี่ยม', 6: 'หกเหลี่ยม', 7: 'เจ็ดเหลี่ยม', 8: 'แปดเหลี่ยม' };
const S9_SOL = {
  prism: n => ({ m: [s9prism(n, 1.25, 2.2)], name: `ปริซึม${S9_TH[n]}`, faces: n + 2, edges: 3 * n, verts: 2 * n, base: `รูป${S9_TH[n]}`, side: 'รูปสี่เหลี่ยมมุมฉาก', nb: 2 }),
  pyr: n => ({ m: [s9pyr(n, 1.35, 2.3)], name: `พีระมิดฐาน${S9_TH[n]}`, faces: n + 1, edges: 2 * n, verts: n + 1, base: `รูป${S9_TH[n]}`, side: 'รูปสามเหลี่ยม', nb: 1 }),
  cyl: () => ({ m: [s9prism(48, 1.2, 2.3, { base: S9C.e, side: S9C.e })], name: 'ทรงกระบอก', base: 'วงกลม', nb: 2 }),
  cone: () => ({ m: [s9pyr(48, 1.35, 2.4, { base: S9C.f, side: S9C.f })], name: 'กรวย', base: 'วงกลม', nb: 1 }),
  sph: () => ({ m: [], sphere: { r: 1.5, col: '#FFB38A' }, name: 'ทรงกลม', nb: 0 }),
  cuboid: () => ({ m: [s9box(-1.6, -.9, -1, 3.2, 1.8, 2, S9C.a)], name: 'ทรงสี่เหลี่ยมมุมฉาก (ปริซึมสี่เหลี่ยม)', faces: 6, edges: 12, verts: 8 }),
  cube: () => ({ m: [s9cube(2.2)], name: 'ลูกบาศก์', faces: 6, edges: 12, verts: 8 })
};
const s9solFig = (kind, n, o = {}) => { const S = S9_SOL[kind](n); return s9fig(S.m, { sphere: S.sphere, ...o }); };

/* ---------- L1/L2 sim: pick a solid, drag to rotate, highlight bases ---------- */
function simSolid(group = 'pp') {
  let kind = group === 'pp' ? 'prism' : 'cyl', n = 5, hl = 'none'; const info = fNote(), tag = h('div', { class: 't6-tags' });
  const cur = () => { const S = S9_SOL[kind](n); S.m.forEach(m => m.F.forEach(f => { f.hl = hl === 'base' && f.kind === 'base' ? '#E5487A' : hl === 'side' && f.kind === 'side' ? '#1B8862' : null; })); return S; };
  const view = s9viewer(() => cur().m, { opts: () => ({ sphere: cur().sphere, hidden: hl !== 'none' && kind !== 'sph' }), W: 400, H: 280 });
  const upd = () => { const S = cur(); view.redraw(); tag.innerHTML = `<span class="t6-tag a">${S.name}</span>`;
    info.innerHTML = kind === 'prism' ? `<b style="color:#E5487A">หน้าตัด/ฐาน</b> เป็น${S.base} 2 หน้า (เท่ากันทุกประการ ขนานกัน) · <b style="color:#1B8862">หน้าข้าง</b> เป็น${S.side} ${n} หน้า · มี ${S.faces} หน้า ${S.edges} สัน ${S.verts} จุดยอด`
      : kind === 'pyr' ? `<b style="color:#E5487A">ฐาน</b> เป็น${S.base} 1 หน้า · <b style="color:#1B8862">หน้าข้าง</b> เป็น${S.side} ${n} หน้า มาพบกันที่<b>ยอดแหลม</b> · มี ${S.faces} หน้า ${S.edges} สัน ${S.verts} จุดยอด`
      : kind === 'cyl' ? 'ทรงกระบอก: ฐานเป็น<b>วงกลม</b> 2 ฐาน ขนานกัน เท่ากันทุกประการ · มี<b>ผิวโค้ง</b>เชื่อมขอบฐาน' : kind === 'cone' ? 'กรวย: ฐานเป็น<b>วงกลม</b> 1 ฐาน · มี<b>ผิวโค้ง</b>ไปพบกันที่<b>ยอดแหลม</b>' : 'ทรงกลม: มีผิวโค้งเรียบ <b>ไม่มีฐาน</b> ทุกจุดบนผิวห่างจากจุดศูนย์กลางเท่ากัน'; };
  const kinds = group === 'pp' ? [['prism', 'ปริซึม'], ['pyr', 'พีระมิด']] : [['cyl', 'ทรงกระบอก'], ['cone', 'กรวย'], ['sph', 'ทรงกลม']];
  const kb = h('div', { class: 'rowstack' }, ...kinds.map(([k, l]) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); kind = k; sfx.page(); upd(); } }, l)));
  const hb = h('div', { class: 'rowstack' }, ...[['base', 'ระบายฐาน'], ['side', 'ระบายหน้าข้าง'], ['none', 'ไม่ระบาย']].map(([k, l]) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); hl = k; sfx.pop(2); upd(); } }, l)));
  const extra = group === 'pp' ? [stepper('ฐานมีกี่ด้าน', () => n, x => n = x, () => 3, () => 8, upd)] : [];
  upd(); return h('div', { class: 'colstack' }, tag, view, h('div', { class: 'cap' }, 'ลากบนรูปเพื่อหมุนดูรอบด้าน'), kb, h('div', { class: 'rowstack' }, ...extra), hb, info);
}

/* ---------- nets that fold ---------- */
const s9rodr = (p, a, u, th) => { const v = s9sub(p, a), c = Math.cos(th), s = Math.sin(th), x = s9cross(u, v), d = s9dot(u, v); return [a[0] + v[0] * c + x[0] * s + u[0] * d * (1 - c), a[1] + v[1] * c + x[1] * s + u[1] * d * (1 - c), a[2] + v[2] * c + x[2] * s + u[2] * d * (1 - c)]; };
/* net = [{ p: [[u,v],...], parent, hinge: [[u,v],[u,v]], ang, col, lab }] ; returns 3D faces at fold t (0 folded … 1 flat) */
function s9fold(net, t) {
  const W3 = q => [q[0], 0, q[1]], memo = {};
  const T = i => { if (memo[i]) return memo[i]; const f = net[i]; if (f.parent == null) return memo[i] = p => p;
    const a = W3(f.hinge[0]), b = W3(f.hinge[1]), u0 = s9sub(b, a), ul = Math.hypot(...u0), u = u0.map(v => v / ul), c = W3(f.p.reduce((s, q) => [s[0] + q[0] / f.p.length, s[1] + q[1] / f.p.length], [0, 0]));
    const sg = s9rodr(c, a, u, .1)[1] > 0 ? 1 : -1, th = sg * (1 - t) * f.ang, Tp = T(f.parent); return memo[i] = p => Tp(s9rodr(p, a, u, th)); };
  return net.map((f, i) => ({ P: f.p.map(q => T(i)(W3(q))), col: f.col, lab: f.lab }));
}
function s9faces(F, o = {}) { // two-sided polygons, painter
  const W = o.W || 400, H = o.H || 280, yaw = o.yaw ?? .5, pitch = o.pitch ?? .9; const all = F.flatMap(f => f.P), cen = o.center || s9mean(all);
  let R0 = .01; all.forEach(p => R0 = Math.max(R0, Math.hypot(...s9sub(p, cen)))); const k = o.k || Math.min(W, H) / 2.3 / R0, L = [-.3, .8, .5];
  const items = F.map(f => { const Q = f.P.map(p => s9rot(s9sub(p, cen), yaw, pitch)), n = s9newell(Q), nl = Math.hypot(...n) || 1, lum = .7 + .3 * Math.abs(s9dot(n, L) / nl / Math.hypot(...L)), z = s9mean(Q)[2];
    const S = Q.map(q => [W / 2 + q[0] * k, H / 2 - q[1] * k]), c = s9mean(Q); return { z, s: `<path d="M${S.map(p => p.join(' ')).join(' L')} Z" fill="${s9shade(f.col, lum)}" stroke="#2B2550" stroke-width="1.8" stroke-linejoin="round"/>` + (f.lab && n[2] / nl > .25 ? `<text x="${W / 2 + c[0] * k}" y="${H / 2 - c[1] * k + 6}" text-anchor="middle" class="t6-n">${f.lab}</text>` : '') }; });
  items.sort((a, b) => a.z - b.z); return `<svg viewBox="0 0 ${W} ${H}" class="t6-svg s9-svg" aria-hidden="true">${items.map(i => i.s).join('')}</svg>`;
}
const s9poly2 = (n, s) => { const r = s / (2 * Math.sin(Math.PI / n)), a0 = -Math.PI / 2 - Math.PI / n; return Array.from({ length: n }, (_, i) => [r * Math.cos(a0 + i * 2 * Math.PI / n), r * Math.sin(a0 + i * 2 * Math.PI / n)]); };
const s9out = (A, B) => { const d = [B[0] - A[0], B[1] - A[1]], l = Math.hypot(...d); return [d[1] / l, -d[0] / l]; }; // outward normal for CCW?…
function s9netPrism(n, s = 1.2, Hh = 1.8) {
  const B = s9poly2(n, s), cen = [0, 0], net = [{ p: B, parent: null, col: S9C.b }];
  const outN = (A, C) => { let o = s9out(A, C); const m = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2]; if ((m[0] + o[0] - cen[0]) ** 2 + (m[1] + o[1] - cen[1]) ** 2 < m[0] ** 2 + m[1] ** 2) o = o.map(v => -v); return o; };
  for (let i = 0; i < n; i++) { const A = B[i], C = B[(i + 1) % n], o = outN(A, C), A2 = [A[0] + o[0] * Hh, A[1] + o[1] * Hh], C2 = [C[0] + o[0] * Hh, C[1] + o[1] * Hh]; net.push({ p: [A, C, C2, A2], parent: 0, hinge: [A, C], ang: Math.PI / 2, col: S9C.a }); }
  const R0 = net[1], A2 = R0.p[3], C2 = R0.p[2], m = [(A2[0] + C2[0]) / 2 - (R0.p[0][0] + R0.p[1][0]) / 2, (A2[1] + C2[1]) / 2 - (R0.p[0][1] + R0.p[1][1]) / 2], ml = Math.hypot(...m), u = m.map(v => v / ml);
  const refl = q => { const d = (q[0] - (R0.p[0][0] + A2[0]) / 2) * u[0] + (q[1] - (R0.p[0][1] + A2[1]) / 2) * u[1]; return [q[0] - 2 * d * u[0], q[1] - 2 * d * u[1]]; };
  net.push({ p: B.map(refl), parent: 1, hinge: [C2, A2], ang: Math.PI / 2, col: S9C.b }); return net;
}
function s9netPyr(n, s = 1.4, Hh = 1.6) {
  const B = s9poly2(n, s), a = s / (2 * Math.tan(Math.PI / n)), sl = Math.hypot(Hh, a), ang = Math.PI - Math.atan2(Hh, a), net = [{ p: B, parent: null, col: S9C.b }];
  for (let i = 0; i < n; i++) { const A = B[i], C = B[(i + 1) % n], m = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], ml = Math.hypot(...m), u = [m[0] / ml, m[1] / ml]; net.push({ p: [A, C, [m[0] + u[0] * sl, m[1] + u[1] * sl]], parent: 0, hinge: [A, C], ang, col: S9C.c }); }
  return net;
}
/* cube net from grid cells [[col,row],...] (+ optional labels) */
function s9netCube(cells, labs) {
  const key = c => c.join(','), idx = {}; cells.forEach((c, i) => idx[key(c)] = i); const par = { 0: null }, order = [0], hinge = {};
  for (let q = 0; q < order.length; q++) { const i = order[q], [x, y] = cells[i]; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const j = idx[key([x + dx, y + dy])]; if (j == null || j in par) return; par[j] = i; order.push(j);
    hinge[j] = dx === 1 ? [[x + 1, y], [x + 1, y + 1]] : dx === -1 ? [[x, y], [x, y + 1]] : dy === 1 ? [[x, y + 1], [x + 1, y + 1]] : [[x, y], [x + 1, y]]; }); }
  const COL = [S9C.a, S9C.b, S9C.c, S9C.d, S9C.e, S9C.f, S9C.g];
  return cells.map(([x, y], i) => ({ p: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]], parent: par[i] ?? null, hinge: hinge[i], ang: Math.PI / 2, col: COL[i % COL.length], lab: labs ? labs[i] : null }));
}
const s9isCube = net => { const F = s9fold(net, 0), cs = new Set(F.map(f => s9mean(f.P).map(v => Math.round(v * 100) / 100).join(','))); return net.length === 6 && cs.size === 6; };
const s9opp = (net, i) => { const F = s9fold(net, 0), C = F.map(f => s9mean(f.P)); let best = -1, bd = -1; C.forEach((c, j) => { const d = Math.hypot(...s9sub(c, C[i])); if (d > bd) { bd = d; best = j; } }); return best; };
const S9_CUBENETS = { // valid: 11 shapes (sample) / invalid
  t1: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], t2: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], t3: [[1, 0], [1, 1], [0, 1], [2, 1], [3, 1], [2, 2]], t4: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]],
  t5: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], t6: [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]], t7: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 0]],
  x1: [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1], [2, 1]], x2: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]], x3: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]], x4: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]].slice(0, 5).concat([[2, 2]])
};
/* net (flat, top view) as a plain 2D SVG for questions */
function s9netSVG(net, o = {}) { const all = net.flatMap(f => f.p), xs = all.map(p => p[0]), ys = all.map(p => p[1]), W = o.W || 400, H = o.H || 260, mnx = Math.min(...xs), mny = Math.min(...ys), k = Math.min((W - 40) / (Math.max(...xs) - mnx), (H - 40) / (Math.max(...ys) - mny)), ox = (W - (Math.max(...xs) - mnx) * k) / 2, oy = (H - (Math.max(...ys) - mny) * k) / 2;
  const f2 = p => [ox + (p[0] - mnx) * k, oy + (p[1] - mny) * k];
  return `<svg viewBox="0 0 ${W} ${H}" class="t6-svg s9-svg" aria-hidden="true">${net.map(f => { const P = f.p.map(f2), c = P.reduce((s, p) => [s[0] + p[0] / P.length, s[1] + p[1] / P.length], [0, 0]); return `<path d="M${P.map(p => p.join(' ')).join(' L')} Z" fill="${o.mono ? '#FFF3C4' : f.col}" stroke="#2B2550" stroke-width="2" stroke-linejoin="round"/>` + (f.lab ? `<text x="${c[0]}" y="${c[1] + 6}" text-anchor="middle" class="t6-n">${f.lab}</text>` : ''); }).join('')}${o.extra || ''}</svg>`; }
const S9_CYLNET = `<svg viewBox="0 0 400 260" class="t6-svg s9-svg" aria-hidden="true"><rect x="80" y="85" width="240" height="90" fill="${S9C.e}" stroke="#2B2550" stroke-width="2"/><circle cx="200" cy="47" r="38" fill="${S9C.b}" stroke="#2B2550" stroke-width="2"/><circle cx="200" cy="213" r="38" fill="${S9C.b}" stroke="#2B2550" stroke-width="2"/></svg>`;
const S9_CONENET = `<svg viewBox="0 0 400 260" class="t6-svg s9-svg" aria-hidden="true"><path d="M200 20 L${200 + 150 * Math.sin(-1.1)} ${20 + 150 * Math.cos(1.1)} A150 150 0 0 0 ${200 + 150 * Math.sin(1.1)} ${20 + 150 * Math.cos(1.1)} Z" fill="${S9C.f}" stroke="#2B2550" stroke-width="2"/><circle cx="200" cy="${20 + 150 + 42}" r="42" fill="${S9C.b}" stroke="#2B2550" stroke-width="2"/></svg>`;

function simNetFold(mode = 'pp') {
  let kind = mode === 'cube' ? 't1' : 'prism', n = 4, t = 0, raf = 0, yaw = .5, pitch = .95, drag = null; const fig = h('div', { class: 't6-board ia drag s9-view' }), out = fNote(), tag = h('div', { class: 't6-tags' });
  const net = () => mode === 'cube' ? s9netCube(S9_CUBENETS[kind]) : kind === 'prism' ? s9netPrism(n) : s9netPyr(n);
  const draw = () => { const N = net(); fig.innerHTML = s9faces(s9fold(N, t), { yaw, pitch, W: 420, H: 290, center: mode === 'cube' ? null : null });
    if (mode === 'cube') { const ok = s9isCube(N); tag.innerHTML = t < .02 ? `<span class="t6-tag ${ok ? 's' : 'c'}">${ok ? 'เป็นลูกบาศก์ ✓' : 'พับแล้วไม่เป็นลูกบาศก์ ✗'}</span>` : '<span class="t6-tag a">รูปคลี่</span>';
      out.innerHTML = t < .02 ? (ok ? 'พับได้ลูกบาศก์ ทุกหน้าไม่ซ้อนกัน — รูปคลี่นี้<b>ใช้ได้</b>' : 'มีหน้า<b>ซ้อนกัน</b> และมีด้านที่ไม่มีหน้าปิด — รูปคลี่นี้<b>ใช้ไม่ได้</b>') : 'กด “พับ” เพื่อดูว่าประกอบเป็นลูกบาศก์ได้หรือไม่'; }
    else { tag.innerHTML = `<span class="t6-tag a">รูปคลี่ของ${kind === 'prism' ? 'ปริซึม' : 'พีระมิดฐาน'}${S9_TH[n]}</span>`;
      out.innerHTML = kind === 'prism' ? `ฐาน 2 หน้าเป็นรูป${S9_TH[n]} + หน้าข้างเป็นรูปสี่เหลี่ยม ${n} หน้า` : `ฐาน 1 หน้าเป็นรูป${S9_TH[n]} + หน้าข้างเป็นรูปสามเหลี่ยม ${n} หน้า ปลายแหลมมาพบกันเป็นยอด`; } };
  const anim = to => { cancelAnimationFrame(raf); const t0 = performance.now(), from = t; const f = x => { const q = Math.min(1, (x - t0) / 1300); t = from + (to - from) * (q < .5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2); draw(); if (q < 1) raf = requestAnimationFrame(f); else if (to === 0) sfx.ok(); }; raf = requestAnimationFrame(f); };
  fig.addEventListener('pointerdown', e => { e.preventDefault(); drag = [e.clientX, e.clientY, yaw, pitch]; try { fig.setPointerCapture(e.pointerId); } catch (_) { } });
  fig.addEventListener('pointermove', e => { if (!drag) return; yaw = drag[2] + (e.clientX - drag[0]) * .012; pitch = Math.max(-.2, Math.min(1.5, drag[3] + (e.clientY - drag[1]) * .01)); draw(); });
  fig.addEventListener('pointerup', () => { drag = null; });
  const ctl = h('div', { class: 'rowstack' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.tap(); anim(1); } }, 'คลี่ออก'), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.tap(); anim(0); } }, 'พับ'));
  let pick;
  if (mode === 'cube') { const keys = ['t1', 't2', 't5', 't6', 'x1', 'x3']; pick = h('div', { class: 'k7-cards s9-netpick' }, ...keys.map((k, i) => h('button', { class: 'k7-card ia', html: s9netSVG(s9netCube(S9_CUBENETS[k]), { W: 200, H: 130, mono: true }) + `<span class="k7-q">แบบ ${i + 1}</span>`, onclick: e => { e.stopPropagation(); kind = k; t = 1; sfx.page(); draw(); } }))); t = 1; }
  else pick = h('div', { class: 'rowstack' }, ...[['prism', 'ปริซึม'], ['pyr', 'พีระมิด']].map(([k, l]) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); kind = k; sfx.page(); draw(); } }, l)), stepper('ฐานมีกี่ด้าน', () => n, x => n = x, () => 3, () => 6, draw));
  draw(); if (mode !== 'cube') setTimeout(() => anim(1), 400);
  return h('div', { class: 'colstack' }, tag, fig, h('div', { class: 'cap' }, 'ลากบนรูปเพื่อหมุน · กดคลี่ออก/พับ'), ctl, pick, out);
}

/* ---------- composite cuboids: volume ---------- */
function simCompVol() {
  let a = 8, b = 3, c = 3, hb = 4, d = 4, way = 0, view; const big = h('div', { class: 'fbig t6-ar' }), out = fNote();
  // A: a × b (height) × d at bottom; B: c × hb × d on top-left
  const meshes = () => way === 0 ? [s9box(0, 0, 0, a, b, d, S9C.a, 'A'), s9box(0, b, 0, c, hb, d, S9C.b, 'B')] : [s9box(0, 0, 0, c, b + hb, d, S9C.c, 'A'), s9box(c, 0, 0, a - c, b, d, S9C.d, 'B')];
  const labels = () => [{ a: [0, 0, d], b: [a, 0, d], t: `${a}` }, { a: [a, 0, d], b: [a, b, d], t: `${b}` }, { a: [0, b + hb, d], b: [c, b + hb, d], t: `${c}` }, { a: [0, b, d], b: [0, b + hb, d], t: `${hb}` }, { a: [a, 0, 0], b: [a, 0, d], t: `${d}` }];
  view = s9viewer(() => meshes(), { opts: () => ({ labels: labels() }), W: 420, H: 280, yaw: .55, pitch: .4 });
  const upd = () => { view.redraw(); const V = a * b * d + c * hb * d;
    big.innerHTML = way === 0 ? `(${a} × ${b} × ${d}) + (${c} × ${hb} × ${d}) = ${a * b * d} + ${c * hb * d} = <b>${V}</b>` : `(${c} × ${b + hb} × ${d}) + (${a - c} × ${b} × ${d}) = ${c * (b + hb) * d} + ${(a - c) * b * d} = <b>${V}</b>`;
    out.innerHTML = `แบ่งเป็นทรงสี่เหลี่ยมมุมฉาก 2 ชิ้น หาปริมาตรแต่ละชิ้น (กว้าง × ยาว × สูง) แล้วรวมกัน = <b>${V} ลูกบาศก์เซนติเมตร</b> — แบ่งวิธีไหนก็ได้เท่ากัน`; };
  const S = [stepper('ยาวล่าง', () => a, x => { a = x; if (c >= a) c = a - 1; }, () => 4, () => 10, upd), stepper('สูงล่าง', () => b, x => b = x, () => 1, () => 5, upd), stepper('ยาวบน', () => c, x => c = x, () => 1, () => a - 1, upd), stepper('สูงบน', () => hb, x => hb = x, () => 1, () => 5, upd), stepper('กว้าง', () => d, x => d = x, () => 2, () => 6, upd)];
  upd(); return h('div', { class: 'colstack' }, view, h('div', { class: 'rowstack' }, ...[['แบ่งแนวนอน', 0], ['แบ่งแนวตั้ง', 1]].map(([l, w]) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); way = w; sfx.pop(w + 1); upd(); } }, l))), big, h('div', { class: 'rowstack' }, ...S), out);
}
/* ---------- container: wall thickness → inner size, water level ---------- */
function simTank() {
  let L = 50, Wd = 30, Ht = 30, th = 5, w = 15; const out = fNote(), big = h('div', { class: 'fbig t6-ar' });
  const meshes = () => { const iL = L - 2 * th, iW = Wd - 2 * th, iH = Ht - th, s = .1, M = [];
    M.push(s9glass(s9box(0, 0, 0, L * s, Ht * s, Wd * s)));
    if (w > 0) M.push(s9box(th * s, th * s, th * s, iL * s, Math.min(w, iH) * s, iW * s, '#6FB2F5')); return M; };
  const view = s9viewer(() => meshes(), { opts: () => ({ hidden: true, labels: [{ a: [0, 0, Wd * .1], b: [L * .1, 0, Wd * .1], t: `${L} ซม.` }, { a: [L * .1, 0, 0], b: [L * .1, 0, Wd * .1], t: `${Wd}` }, { a: [L * .1, 0, Wd * .1], b: [L * .1, Ht * .1, Wd * .1], t: `${Ht}` }] }), W: 420, H: 280, yaw: .5, pitch: .4 });
  const upd = () => { view.redraw(); const iL = L - 2 * th, iW = Wd - 2 * th, iH = Ht - th, cap = iL * iW * iH, wv = iL * iW * Math.min(w, iH);
    big.innerHTML = `ความจุ = ${iL} × ${iW} × ${iH} = <b>${cap.toLocaleString('en-US')}</b> ลบ.ซม. = <b>${fmtDec(String(cap / 1000))}</b> ลิตร`;
    out.innerHTML = `ขนาด<b>ภายใน</b> = ภายนอก − ความหนา (ด้านข้างหัก 2 ข้าง ${th} + ${th} · ก้นหัก 1 ชั้น ${th}) · น้ำสูง ${Math.min(w, iH)} ซม. = ${iL} × ${iW} × ${Math.min(w, iH)} = ${wv.toLocaleString('en-US')} ลบ.ซม. = ${fmtDec(String(wv / 1000))} ลิตร (1,000 ลบ.ซม. = 1 ลิตร)`; };
  upd(); return h('div', { class: 'colstack' }, view, big, h('div', { class: 'rowstack' }, stepper('ความหนา (ซม.)', () => th, x => th = x, () => 0, () => 5, upd), stepper('ระดับน้ำ (ซม.)', () => w, x => w = x, () => 0, () => Ht - th, upd)), out);
}

/* =========================================================
   v96 (ผู้ใช้ขอ) — แยกรูปคนละหน้า · ข้อมูลขึ้นเมื่อกดระบาย (และไม่หายเมื่อกดไม่ระบาย) · ตัวอย่างทีละขั้นแรเงาส่วนที่กำลังพูด
   หน้าและสันไว้ท้าย · ไม่มีปุ่มปรับค่า (ค่าอื่นเป็นหน้าตัวอย่างเพิ่ม) · รูปซ้าย ส่วนอื่นขวา
   ========================================================= */
const s9Side = (L, R) => h('div', { class: 'pzs s9s' }, h('div', { class: 'pzs-l' }, L), h('div', { class: 'pzs-r' }, R));
/* bullet notes that only grow (a line never disappears) */
function s9Notes(ph = 'กดปุ่มด้านบน — ข้อมูลจะขึ้นที่นี่') { const ul = h('ul', { class: 's9-notes' }), hint = h('div', { class: 's9-ph' }, ph), have = new Set();
  const box = h('div', { class: 'colstack s9-nbox' }, hint, ul);
  box.add = (k, html) => { if (have.has(k)) { const li = ul.querySelector(`[data-k="${k}"]`); if (li) li.animate([{ background: '#FFE7A3' }, { background: '#FFF9E0' }], { duration: 700 }); return false; }
    have.add(k); hint.remove(); ul.append(h('li', { 'data-k': k, html })); return true; };
  box.has = k => have.has(k); box.count = () => have.size; return box; }
const S9_HL = { base: '#E5487A', side: '#1B8862' };
const s9paint = (S, mode) => { S.m.forEach(m => m.F.forEach(f => { f.hl = (mode === 'base' || mode === 'all') && f.kind === 'base' ? S9_HL.base : (mode === 'side' || mode === 'all') && f.kind === 'side' ? S9_HL.side : null; })); return S; };
/* one solid: drag to rotate · ระบายฐาน / ระบายหน้าข้าง / ไม่ระบาย · notes appear on the first press of each and stay */
const S9_INFO = {
  prism: n => ({ base: `<b style="color:#E5487A">หน้าตัด (ฐาน)</b> เป็นรูป${S9_TH[n]} <b>2 หน้า</b> เท่ากันทุกประการ และอยู่บนระนาบที่ขนานกัน`, side: `<b style="color:#1B8862">หน้าข้าง</b> เป็นรูปสี่เหลี่ยมมุมฉาก <b>${n} หน้า</b>` }),
  pyr: n => ({ base: `<b style="color:#E5487A">ฐาน</b> เป็นรูป${S9_TH[n]} <b>1 หน้า</b>`, side: `<b style="color:#1B8862">หน้าข้าง</b> เป็นรูปสามเหลี่ยม <b>${n} หน้า</b> มาพบกันที่<b>ยอดแหลม</b>` }),
  cyl: () => ({ base: '<b style="color:#E5487A">ฐาน</b> เป็นรูปวงกลม <b>2 ฐาน</b> เท่ากันทุกประการ และขนานกัน', side: '<b style="color:#1B8862">ผิวโค้ง</b> เชื่อมขอบของฐานทั้งสอง' }),
  cone: () => ({ base: '<b style="color:#E5487A">ฐาน</b> เป็นรูปวงกลม <b>1 ฐาน</b>', side: '<b style="color:#1B8862">ผิวโค้ง</b> จากขอบฐานไปพบกันที่<b>ยอดแหลม</b>' }),
  sph: () => ({ side: '<b style="color:#1B8862">ผิวโค้ง</b>เรียบทั้งหมด — ไม่มีฐาน ไม่มีสัน ไม่มีจุดยอด', base: 'ทุกจุดบนผิวห่างจาก<b>จุดศูนย์กลาง</b>เท่ากัน ระยะนี้เรียกว่า<b>รัศมี</b>' })
};
function simSolidOne(kind, n) {
  let hl = 'none'; const wait = h6wait(), notes = s9Notes(), info = S9_INFO[kind](n), sph = kind === 'sph';
  const cur = () => s9paint(S9_SOL[kind](n), hl);
  const view = s9viewer(() => cur().m, { opts: () => ({ sphere: sph ? { r: 1.5, col: hl === 'side' ? '#7EDDB8' : '#FFB38A' } : cur().sphere, sphereR: sph && notes.has('base'), hidden: hl !== 'none' && !sph }), W: 420, H: 300 });
  const B = sph ? [['side', 'ระบายผิวโค้ง'], ['base', 'แสดงรัศมี'], ['none', 'ไม่ระบาย']] : [['base', 'ระบายฐาน'], ['side', kind === 'cyl' || kind === 'cone' ? 'ระบายผิวโค้ง' : 'ระบายหน้าข้าง'], ['none', 'ไม่ระบาย']];
  const bs = h('div', { class: 'rowstack s9-btns' }, ...B.map(([k, l]) => h('button', { class: 'btn sm ia' + (k === 'none' ? '' : ' s9b-' + k), onclick: e => { e.stopPropagation(); hl = k; sfx.pop(2);
    if (k !== 'none' && notes.add(k, info[k]) && ['base', 'side'].every(x => notes.has(x))) { sfx.ok(); teachDone(wait); } view.redraw(); } }, l)));
  return s9Side(h('div', { class: 'colstack' }, view, h('div', { class: 'cap' }, 'ลากบนรูปเพื่อหมุนดูรอบด้าน')), h('div', { class: 'colstack s9-r' }, wait, bs, notes));
}
/* shaded figure for the step-by-step pages */
const s9shadeFig = (kind, n, mode, o = {}) => { const S = s9paint(S9_SOL[kind](n), mode);
  return s9fig(S.m, { sphere: S.sphere, hidden: true, markEdges: mode === 'edges', markVerts: mode === 'verts', yaw: .62, pitch: kind === 'pyr' ? .52 : .42, W: 400, H: 280, ...o }); };
const s9walkPrism = n => { const T3 = S9_TH[n], F = m => s9shadeFig('prism', n, m);
  return [['① หน้าตัด (ฐาน)', `ส่วนที่ระบายสีชมพู: รูป${T3} 2 หน้า เท่ากันทุกประการ อยู่บนระนาบที่ขนานกัน`, F('base')],
    ['② หน้าข้าง', `ส่วนที่ระบายสีเขียว: รูปสี่เหลี่ยมมุมฉาก ${n} หน้า`, F('side')],
    ['③ เรียกชื่อ', `หน้าตัดเป็นรูป${T3} → <b>ปริซึม${T3}</b>`, F('base')],
    ['④ นับหน้า', `หน้าตัด 2 + หน้าข้าง ${n} = <b>${n + 2} หน้า</b>`, F('all')],
    ['⑤ นับสัน', `สันรอบฐานล่าง ${n} + ฐานบน ${n} + สันข้าง ${n} = <b>${3 * n} สัน</b>`, F('edges')],
    ['⑥ นับจุดยอด', `ฐานล่าง ${n} + ฐานบน ${n} = <b>${2 * n} จุดยอด</b>`, F('verts')]]; };
const s9walkPyr = n => { const T3 = S9_TH[n], F = m => s9shadeFig('pyr', n, m);
  return [['① ฐาน', `ส่วนที่ระบายสีชมพู: รูป${T3} 1 หน้า`, F('base')],
    ['② หน้าข้าง', `ส่วนที่ระบายสีเขียว: รูปสามเหลี่ยม ${n} หน้า มาพบกันที่ยอดแหลม`, F('side')],
    ['③ เรียกชื่อ', `ฐานเป็นรูป${T3} → <b>พีระมิดฐาน${T3}</b>`, F('base')],
    ['④ นับหน้า', `ฐาน 1 + หน้าข้าง ${n} = <b>${n + 1} หน้า</b>`, F('all')],
    ['⑤ นับสัน', `สันรอบฐาน ${n} + สันที่ไปยอดแหลม ${n} = <b>${2 * n} สัน</b>`, F('edges')],
    ['⑥ นับจุดยอด', `มุมของฐาน ${n} + ยอดแหลม 1 = <b>${n + 1} จุดยอด</b>`, F('verts')]]; };

/* v110 (ผู้ใช้ขอ): หน้า · สัน · จุดยอด ทีละส่วน — ชี้ตัวอย่าง 1 อันให้ชัดก่อน แล้วจึงแสดงทั้งหมดและนับ (ลากหมุนได้ตลอด) */
function simHFV(kind, n) {
  const S0 = S9_SOL[kind](n), wait = h6wait(), notes = s9Notes('กด “ต่อไป” ดูทีละส่วน'); let st = -1;
  const m0 = () => S9_SOL[kind](n).m[0], yaw0 = .62, pitch0 = kind === 'pyr' ? .52 : .42;
  /* the example face / edge / vertex nearest the viewer at the start (so the pointer is on something the child can see) */
  const M = m0(), cen = s9mean(M.V), R = p => s9rot(s9sub(p, cen), yaw0, pitch0), Ek = {};
  M.F.forEach((f, fi) => { if (f.hard === false) return; f.v.forEach((a, i) => { const b = f.v[(i + 1) % f.v.length], k = a < b ? a + '-' + b : b + '-' + a; (Ek[k] = Ek[k] || []).push(fi); }); });
  const side = M.F.map((f, i) => i).filter(i => M.F[i].kind !== 'base'), fz = i => { const c = R(s9mean(M.F[i].v.map(j => M.V[j]))); return c[2] - Math.abs(c[1]) * .3; };
  const face = (side.length ? side : M.F.map((f, i) => i)).sort((a, b) => fz(b) - fz(a))[0];
  const edges = Object.keys(Ek).map(k => k.split('-').map(Number)), ez = ([a, b]) => { const p = R(M.V[a]), q = R(M.V[b]); return (p[2] + q[2]) / 2 + Math.abs(p[1] - q[1]) * .6; };
  const edge = edges.slice().sort((x, y) => ez(y) - ez(x))[0], adj = Ek[edge[0] < edge[1] ? edge.join('-') : [edge[1], edge[0]].join('-')] || [];
  const vert = M.V.map((v, i) => i).sort((a, b) => { const p = R(M.V[a]), q = R(M.V[b]); return (q[1] + q[2]) - (p[1] + p[2]); })[0], vEdges = edges.filter(e => e.includes(vert));
  const PAL = ['#FFB38A', '#8EC5FA', '#7EDDB8', '#C4B5FD', '#FFD27A', '#F9A8D4', '#A7F3D0', '#FDBA74', '#93C5FD', '#FCA5A5'];
  const cur = () => { const m = m0(); m.F.forEach((f, i) => { f.hl = st === 0 && i === face ? '#FFD27A' : st === 1 ? PAL[i % PAL.length] : st === 2 && adj.includes(i) ? '#BFE3FF' : null; }); return [m]; };
  const opts = () => st === 0 ? { pick: { call: { face, t: 'หน้า 1 หน้า' } } } : st === 1 ? { pick: { nums: true }, hidden: true } : st === 2 ? { hidden: true, pick: { edges: [edge], call: { edge, t: 'สัน 1 สัน' } } } : st === 3 ? { hidden: true, markEdges: true }
    : st === 4 ? { hidden: true, pick: { edges: vEdges, verts: [vert], call: { vert, t: 'จุดยอด 1 จุด' } } } : st === 5 ? { hidden: true, markVerts: true } : { hidden: false };
  const view = s9viewer(cur, { yaw: yaw0, pitch: pitch0, W: 420, H: 300, opts });
  const nE = vEdges.length, TXT = [
    ['f1', '<b>หน้า</b> คือ <b>ผิวแบนเรียบ</b>ที่ล้อมรอบรูป — ส่วนสีเหลืองคือ <b>1 หน้า</b>'],
    ['f2', `ระบายทุกหน้าคนละสี (เลขบนหน้า) — หมุนดูหน้าที่อยู่ด้านหลังด้วย · ${S0.name}มี <b>${S0.faces} หน้า</b>`],
    ['e1', '<b>สัน</b> คือ <b>เส้นที่หน้า 2 หน้ามาพบกัน</b> — เส้นสีชมพูหนาคือ <b>1 สัน</b> (ขอบที่หน้าสีฟ้า 2 หน้ามาชนกัน)'],
    ['e2', `สันทั้งหมด (เส้นประ = สันด้านหลัง) · ${S0.name}มี <b>${S0.edges} สัน</b>`],
    ['v1', `<b>จุดยอด</b> คือ <b>จุดที่สันมาพบกัน</b> — จุดสีม่วงคือ <b>1 จุดยอด</b> (สัน ${nE} เส้นมาพบกันที่นี่)`],
    ['v2', `จุดยอดทั้งหมด (จุดกลวง = ด้านหลัง) · ${S0.name}มี <b>${S0.verts} จุดยอด</b>`]];
  const LAB = ['① หน้า: ชี้ 1 หน้า', '① หน้า: ดูทุกหน้า', '② สัน: ชี้ 1 สัน', '② สัน: ดูทุกสัน', '③ จุดยอด: ชี้ 1 จุด', '③ จุดยอด: ดูทุกจุด'];
  const btn = h('button', { class: 'btn info ia s9-next', onclick: e => { e.stopPropagation(); if (st >= 5) return; st++; sfx.pop(st); notes.add(TXT[st][0], TXT[st][1]); view.redraw();
    if (st >= 5) { btn.remove(); sfx.ok(); teachDone(wait); } else btn.lastChild.textContent = LAB[st + 1]; } }, icon('right'), h('span', null, LAB[0]));
  return s9Side(h('div', { class: 'colstack s9-lc' }, h('div', { class: 't6-tags' }, h('span', { class: 't6-tag a' }, S0.name)), view), h('div', { class: 'colstack s9-r' }, wait, btn, notes));
}

/* ---------- real things that look like solids ---------- */
const S9_OBJ = {
  cake: ['เค้กก้อนนี้', 'cyl', `<ellipse cx="100" cy="150" rx="70" ry="18" fill="#C98E55"/><rect x="30" y="92" width="140" height="58" fill="#F7C9A8"/><rect x="30" y="112" width="140" height="10" fill="#F28CA8"/><ellipse cx="100" cy="92" rx="70" ry="18" fill="#FFF3E6" stroke="#E8CDB6" stroke-width="2"/><path d="M30 92 q10 22 20 6 q10 20 20 4 q10 22 20 5 q10 20 20 4 q10 22 20 5 q10 20 20 4 q10 18 20 2" fill="#FFF3E6"/><circle cx="85" cy="86" r="8" fill="#E5487A"/><circle cx="112" cy="90" r="8" fill="#E5487A"/><rect x="97" y="52" width="6" height="30" rx="2" fill="#7EB6F5"/><path d="M100 38 q6 8 0 14 q-6 -6 0 -14" fill="#FFB020"/>`],
  can: ['กระป๋องน้ำอัดลมนี้', 'cyl', `<rect x="62" y="44" width="76" height="118" fill="#E5505E"/><ellipse cx="100" cy="162" rx="38" ry="10" fill="#B83A47"/><rect x="62" y="80" width="76" height="40" fill="#fff" opacity=".9"/><path d="M62 100 q38 -16 76 0" stroke="#E5505E" stroke-width="6" fill="none"/><ellipse cx="100" cy="44" rx="38" ry="10" fill="#D5D9E0" stroke="#A9AEB6" stroke-width="2"/><ellipse cx="108" cy="44" rx="9" ry="3" fill="#A9AEB6"/><rect x="70" y="50" width="6" height="104" fill="#fff" opacity=".25"/>`],
  drum: ['กลองใบนี้', 'cyl', `<ellipse cx="100" cy="150" rx="66" ry="16" fill="#8E3B2B"/><rect x="34" y="70" width="132" height="80" fill="#C2543D"/><path d="M34 74 L66 146 L100 74 L134 146 L166 74" stroke="#FFD27A" stroke-width="4" fill="none"/><rect x="34" y="70" width="132" height="8" fill="#FFD27A"/><rect x="34" y="142" width="132" height="8" fill="#FFD27A"/><ellipse cx="100" cy="70" rx="66" ry="16" fill="#FFF4DD" stroke="#D9C7A8" stroke-width="3"/><path d="M128 30 L102 66" stroke="#8B5E34" stroke-width="5" stroke-linecap="round"/><circle cx="128" cy="30" r="6" fill="#8B5E34"/>`],
  tcone: ['กรวยจราจรนี้', 'cone', `<rect x="34" y="150" width="132" height="16" rx="3" fill="#2B2550"/><path d="M100 28 L150 152 L50 152 Z" fill="#FF7A1A"/><path d="M84 68 L116 68 L124 88 L76 88 Z" fill="#fff"/><path d="M68 108 L132 108 L140 128 L60 128 Z" fill="#fff"/><path d="M100 28 L106 44 L94 44 Z" fill="#FF9C4F"/>`],
  icecream: ['โคนไอศกรีมนี้ (ส่วนที่เป็นแป้ง)', 'cone', `<path d="M60 84 L140 84 L100 176 Z" fill="#E8A95B"/><path d="M68 96 L132 96 M74 112 L126 112 M82 130 L118 130 M90 148 L110 148 M72 88 L112 170 M128 88 L88 170" stroke="#C98436" stroke-width="2.5"/><circle cx="100" cy="64" r="36" fill="#F9A8D4"/><circle cx="76" cy="80" r="14" fill="#F9A8D4"/><circle cx="124" cy="80" r="14" fill="#F9A8D4"/><circle cx="90" cy="52" r="4" fill="#fff" opacity=".7"/><circle cx="100" cy="26" r="7" fill="#E5487A"/>`],
  hat: ['หมวกปาร์ตี้ใบนี้', 'cone', `<path d="M100 26 L148 162 L52 162 Z" fill="#8EC5FA"/><path d="M84 72 L116 72 M74 102 L126 102 M64 132 L136 132" stroke="#FFD27A" stroke-width="8"/><ellipse cx="100" cy="162" rx="48" ry="9" fill="#5B8FD6"/><circle cx="100" cy="24" r="12" fill="#FFD27A"/><path d="M90 16 L110 32 M110 16 L90 32" stroke="#F59E0B" stroke-width="3"/>`],
  ball: ['ลูกบอลนี้', 'sph', `<circle cx="100" cy="100" r="68" fill="#fff" stroke="#2B2550" stroke-width="3"/><path d="M100 72 L126 90 L116 120 L84 120 L74 90 Z" fill="#2B2550"/><path d="M100 72 L100 34 M126 90 L160 78 M116 120 L136 152 M84 120 L64 152 M74 90 L40 78" stroke="#2B2550" stroke-width="3"/><path d="M84 34 L116 34 L124 44 M160 78 L166 104 M136 152 L112 166 M64 152 L88 166 M40 78 L34 104" stroke="#2B2550" stroke-width="3" fill="none"/><circle cx="76" cy="66" r="10" fill="#fff" opacity=".6"/>`],
  orange: ['ผลส้มนี้', 'sph', `<circle cx="100" cy="106" r="64" fill="#FF9F2E"/><circle cx="78" cy="84" r="16" fill="#FFC27A" opacity=".6"/><g fill="#E07F12" opacity=".5"><circle cx="120" cy="120" r="2.5"/><circle cx="104" cy="140" r="2.5"/><circle cx="136" cy="96" r="2.5"/><circle cx="86" cy="128" r="2.5"/><circle cx="70" cy="110" r="2.5"/></g><path d="M100 44 q4 -10 2 -16" stroke="#6B4A2A" stroke-width="4" fill="none"/><path d="M102 34 q22 -14 36 0 q-18 12 -36 0" fill="#4FAE52"/>`],
  globe: ['ลูกโลกจำลองนี้', 'sph', `<rect x="90" y="166" width="20" height="12" fill="#8B5E34"/><ellipse cx="100" cy="180" rx="34" ry="7" fill="#8B5E34"/><path d="M36 92 A66 66 0 0 0 158 140" stroke="#B98654" stroke-width="5" fill="none"/><circle cx="96" cy="96" r="60" fill="#6FB2F5"/><path d="M70 62 q16 -8 26 4 q-4 14 10 18 q6 14 -10 22 q-12 -2 -18 -14 q-12 -6 -8 -30 Z M112 108 q16 -6 24 8 q-4 18 -18 22 q-10 -12 -6 -30 Z M104 46 q12 -2 18 6 q-10 6 -18 -6 Z" fill="#7FD07A"/><circle cx="76" cy="70" r="12" fill="#fff" opacity=".25"/>`]
};
const S9_OBJN = { cyl: 'ทรงกระบอก', cone: 'กรวย', sph: 'ทรงกลม' };
const s9objSVG = k => `<svg viewBox="0 0 200 200" class="t6-svg s9-svg s9-obj" aria-hidden="true">${S9_OBJ[k][2]}</svg>`;
const s9objQ = k => { const [name, kind] = S9_OBJ[k]; return Q.c8Pick({ fig: s9objSVG(k), q: `${name}มีลักษณะคล้ายรูปเรขาคณิตสามมิติใด`, opts: ['ทรงกระบอก', 'กรวย', 'ทรงกลม'], right: S9_OBJN[kind], keep: true,
  hint: 'ฐานวงกลม 2 ฐาน = ทรงกระบอก · ฐานวงกลม 1 ฐานกับยอดแหลม = กรวย · ไม่มีฐาน กลมทั้งลูก = ทรงกลม' }); };
function simObjects(keys = ['cake', 'tcone', 'ball']) { const wait = h6wait(), seen = new Set();
  const cards = keys.map(k => { const [name, kind] = S9_OBJ[k], lab = h('div', { class: 's9o-lab' }, 'แตะเพื่อดู'), c = h('button', { class: 's9o-card ia', onclick: e => { e.stopPropagation(); if (seen.has(k)) return; seen.add(k); sfx.pop(seen.size);
      lab.innerHTML = `<b>${S9_OBJN[kind]}</b>`; c.classList.add('on'); c.querySelector('.s9o-mini').innerHTML = s9solFig(kind, 0, { W: 160, H: 110, pad: 14 }); if (seen.size === keys.length) { sfx.ok(); teachDone(wait); } } },
    h('div', { class: 's9o-pic', html: s9objSVG(k) }), h('div', { class: 's9o-name' }, name.replace(/นี้$|ใบนี้$|ก้อนนี้$|ลูกนี้$/, '').replace(/\s*\(.*\)$/, '')), h('div', { class: 's9o-mini' }), lab); return c; });
  return h('div', { class: 'colstack' }, wait, h('div', { class: 's9o-row' }, ...cards)); }

/* ---------- nets: one solid per page, no stepper ---------- */
function simNetOne(kind, n) { // prism | pyr
  let t = 0, raf = 0, yaw = .5, pitch = .95, drag = null, opened = 0, folded = 0; const wait = h6wait(), fig = h('div', { class: 't6-board ia drag s9-view' }), notes = s9Notes('กด “คลี่ออก” แล้วดูว่ามีรูปอะไรบ้าง');
  const N = kind === 'prism' ? s9netPrism(n) : s9netPyr(n), T3 = S9_TH[n];
  const draw = () => { fig.innerHTML = s9faces(s9fold(N, t), { yaw, pitch, W: 420, H: 300 }); };
  const anim = (to, then) => { cancelAnimationFrame(raf); const t0 = performance.now(), from = t; const f = x => { const q = Math.min(1, (x - t0) / 1300); t = from + (to - from) * (q < .5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2); draw(); if (q < 1) raf = requestAnimationFrame(f); else then && then(); }; raf = requestAnimationFrame(f); };
  fig.addEventListener('pointerdown', e => { e.preventDefault(); drag = [e.clientX, e.clientY, yaw, pitch]; try { fig.setPointerCapture(e.pointerId); } catch (_) { } });
  fig.addEventListener('pointermove', e => { if (!drag) return; yaw = drag[2] + (e.clientX - drag[0]) * .012; pitch = Math.max(-.2, Math.min(1.5, drag[3] + (e.clientY - drag[1]) * .01)); draw(); });
  fig.addEventListener('pointerup', () => { drag = null; });
  const fin = () => { if (opened && folded) teachDone(wait); };
  const ctl = h('div', { class: 'rowstack s9-btns' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.tap(); anim(1, () => { opened = 1;
      if (kind === 'prism') { notes.add('b', `<b style="color:#C46A2A">รูป${T3} 2 รูป</b> — หน้าตัด (ฐาน)`); notes.add('s', `<b style="color:#3B7BC4">รูปสี่เหลี่ยม ${n} รูป</b> — หน้าข้าง`); }
      else { notes.add('b', `<b style="color:#C46A2A">รูป${T3} 1 รูป</b> — ฐาน`); notes.add('s', `<b style="color:#1B8862">รูปสามเหลี่ยม ${n} รูป</b> — หน้าข้าง`); } fin(); }); } }, 'คลี่ออก'),
    h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.tap(); anim(0, () => { folded = 1; sfx.ok(); notes.add('f', `พับแล้วได้ <b>${kind === 'prism' ? 'ปริซึม' + T3 : 'พีระมิดฐาน' + T3}</b>`); fin(); }); } }, 'พับ'));
  draw(); return s9Side(h('div', { class: 'colstack' }, fig, h('div', { class: 'cap' }, 'ลากบนรูปเพื่อหมุนได้')), h('div', { class: 'colstack s9-r' }, wait, h('div', { class: 't6-tags', html: `<span class="t6-tag a">${kind === 'prism' ? 'ปริซึม' + T3 : 'พีระมิดฐาน' + T3}</span>` }), ctl, notes));
}
function simNetRound(kind) { // cyl | cone: the solid ↔ its net
  let open = false, did = new Set(); const wait = h6wait(), pane = h('div', { class: 't6-board s9-view s9-swap' }), notes = s9Notes('กด “คลี่ออก” แล้วดูว่ามีรูปอะไรบ้าง');
  const solid = s9solFig(kind, 0, { W: 400, H: 260 }), net = kind === 'cyl' ? S9_CYLNET : S9_CONENET;
  const show = () => { pane.innerHTML = open ? net : solid; pane.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' }); };
  const go = o => { open = o; did.add(o ? 'o' : 'c'); sfx.tap(); show();
    if (o) { if (kind === 'cyl') { notes.add('b', '<b style="color:#C46A2A">วงกลม 2 รูป</b> — ฐาน'); notes.add('s', '<b style="color:#B98A12">รูปสี่เหลี่ยมมุมฉาก 1 รูป</b> — ผิวโค้งที่คลี่ออก ด้านยาวยาวเท่ากับความยาวรอบวงกลม'); }
      else { notes.add('b', '<b style="color:#C46A2A">วงกลม 1 รูป</b> — ฐาน'); notes.add('s', '<b style="color:#C2408A">รูปเสี้ยววงกลม 1 รูป</b> — ผิวโค้งที่คลี่ออก'); } }
    else notes.add('f', `พับแล้วได้ <b>${S9_OBJN[kind]}</b>`);
    if (did.size === 2) { sfx.ok(); teachDone(wait); } };
  show(); return s9Side(pane, h('div', { class: 'colstack s9-r' }, wait, h('div', { class: 't6-tags', html: `<span class="t6-tag a">${S9_OBJN[kind]}</span>` }),
    h('div', { class: 'rowstack s9-btns' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); go(true); } }, 'คลี่ออก'), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); go(false); } }, 'พับ')), notes));
}
/* cube nets: picture left · the rest right · a net that is not a cube shakes and opens again — it cannot be folded (ผู้ใช้ขอ) */
function simCubeNet() {
  let kind = 't1', t = 1, raf = 0, yaw = .5, pitch = .95, drag = null, busy = false; const wait = h6wait(), fig = h('div', { class: 't6-board ia drag s9-view' }), out = h('div', { class: 's9-res' }), tried = new Set();
  const net = () => s9netCube(S9_CUBENETS[kind]);
  const draw = () => { fig.innerHTML = s9faces(s9fold(net(), t), { yaw, pitch, W: 420, H: 300 }); };
  const anim = (to, ms, then) => { cancelAnimationFrame(raf); const t0 = performance.now(), from = t; const f = x => { const q = Math.min(1, (x - t0) / ms); t = from + (to - from) * (q < .5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2); draw(); if (q < 1) raf = requestAnimationFrame(f); else then && then(); }; raf = requestAnimationFrame(f); };
  fig.addEventListener('pointerdown', e => { e.preventDefault(); drag = [e.clientX, e.clientY, yaw, pitch]; try { fig.setPointerCapture(e.pointerId); } catch (_) { } });
  fig.addEventListener('pointermove', e => { if (!drag) return; yaw = drag[2] + (e.clientX - drag[0]) * .012; pitch = Math.max(-.2, Math.min(1.5, drag[3] + (e.clientY - drag[1]) * .01)); draw(); });
  fig.addEventListener('pointerup', () => { drag = null; });
  const res = (ok, html) => { out.className = 's9-res ' + (ok ? 'ok' : 'bad'); out.innerHTML = html; };
  const fold = () => { if (busy) return; busy = true; const ok = s9isCube(net());
    if (ok) anim(0, 1300, () => { busy = false; sfx.ok(); res(true, '✓ พับได้<b>ลูกบาศก์</b> — ทุกหน้าไม่ซ้อนกัน รูปคลี่นี้<b>ใช้ได้</b>'); tried.add(kind); done(); });
    else anim(.42, 900, () => { sfx.no(); fig.classList.remove('s9-shake'); void fig.offsetWidth; fig.classList.add('s9-shake');
      res(false, '✗ <b>พับไม่ได้</b> — มีหน้าชนกัน/ซ้อนกัน และมีด้านที่ไม่มีหน้าปิด รูปคลี่นี้<b>ใช้ไม่ได้</b>');
      setTimeout(() => anim(1, 700, () => { busy = false; fig.classList.remove('s9-shake'); tried.add(kind); done(); }), 650); }); };
  const done = () => { if ([...tried].some(k => s9isCube(s9netCube(S9_CUBENETS[k]))) && [...tried].some(k => !s9isCube(s9netCube(S9_CUBENETS[k])))) teachDone(wait); };
  const keys = ['t1', 't2', 't5', 't6', 'x1', 'x3'];
  const pick = h('div', { class: 'k7-cards s9-netpick' }, ...keys.map((k, i) => h('button', { class: 'k7-card ia' + (k === kind ? ' on' : ''), html: s9netSVG(s9netCube(S9_CUBENETS[k]), { W: 200, H: 130, mono: true }) + `<span class="k7-q">แบบ ${i + 1}</span>`,
    onclick: e => { e.stopPropagation(); if (busy) return; kind = k; t = 1; sfx.page(); pick.querySelectorAll('.k7-card').forEach(c => c.classList.toggle('on', c === e.currentTarget)); res(true, ''); out.className = 's9-res'; draw(); } })));
  draw(); res(true, ''); out.className = 's9-res'; out.textContent = 'เลือกรูปคลี่ แล้วกด “พับ”';
  return s9Side(h('div', { class: 'colstack' }, fig, h('div', { class: 'cap' }, 'ลากบนรูปเพื่อหมุนได้')),
    h('div', { class: 'colstack s9-r' }, wait, pick, h('div', { class: 'rowstack s9-btns' }, h('button', { class: 'btn sm ia primary', onclick: e => { e.stopPropagation(); sfx.tap(); fold(); } }, 'พับ'), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (busy) return; sfx.tap(); anim(1, 900); } }, 'คลี่ออก')), out));
}

/* ---------- composite cuboids: preset sizes, tap to split — no steppers ---------- */
const S9_CV = [{ a: 8, b: 3, c: 3, hb: 4, d: 4 }, { a: 10, b: 2, c: 4, hb: 5, d: 3 }, { a: 6, b: 4, c: 2, hb: 3, d: 5 }];
function simCompOne(P) { const { a, b, c, hb, d } = P; let way = -1; const wait = h6wait(), notes = s9Notes('กดเลือกวิธีแบ่ง — ข้อมูลจะขึ้นที่นี่'), did = new Set();
  const meshes = () => way === 0 ? [s9box(0, 0, 0, a, b, d, S9C.a, 'A'), s9box(0, b, 0, c, hb, d, S9C.b, 'B')] : way === 1 ? [s9box(0, 0, 0, c, b + hb, d, S9C.c, 'A'), s9box(c, 0, 0, a - c, b, d, S9C.d, 'B')] : [s9box(0, 0, 0, a, b, d, '#C9D3E8'), s9box(0, b, 0, c, hb, d, '#C9D3E8')];
  const labels = () => [{ a: [0, 0, d], b: [a, 0, d], t: `${a}` }, { a: [a, 0, d], b: [a, b, d], t: `${b}` }, { a: [0, b + hb, d], b: [c, b + hb, d], t: `${c}` }, { a: [0, b, d], b: [0, b + hb, d], t: `${hb}` }, { a: [a, 0, 0], b: [a, 0, d], t: `${d}` }];
  const view = s9viewer(() => meshes(), { opts: () => ({ labels: labels() }), W: 420, H: 290, yaw: .55, pitch: .4 });
  const V = a * b * d + c * hb * d;
  const sel = w => { way = w; did.add(w); sfx.pop(w + 2); view.redraw();
    if (w === 0) notes.add('h', `<b>แบ่งแนวนอน</b>: ชิ้นล่าง ${a} × ${b} × ${d} = ${a * b * d} · ชิ้นบน ${c} × ${hb} × ${d} = ${c * hb * d} → รวม <b>${V}</b>`);
    else notes.add('v', `<b>แบ่งแนวตั้ง</b>: ชิ้นซ้าย ${c} × ${b + hb} × ${d} = ${c * (b + hb) * d} · ชิ้นขวา ${a - c} × ${b} × ${d} = ${(a - c) * b * d} → รวม <b>${V}</b>`);
    if (did.size === 2) { notes.add('s', `แบ่งแบบไหนก็ได้ปริมาตรเท่ากัน = <b>${V} ลูกบาศก์เซนติเมตร</b>`); sfx.ok(); teachDone(wait); } };
  return s9Side(h('div', { class: 'colstack' }, view, h('div', { class: 'cap' }, 'หน่วยเป็นเซนติเมตร · ลากบนรูปเพื่อหมุนได้')),
    h('div', { class: 'colstack s9-r' }, wait, h('div', { class: 'rowstack s9-btns' }, ...[['แบ่งแนวนอน', 0], ['แบ่งแนวตั้ง', 1]].map(([l, w]) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sel(w); } }, l))), notes));
}
const s9compWalk = () => { const A = [0, 0, 0, 9, 3, 5], B = [0, 3, 0, 3, 6, 5], lab = [{ a: [0, 0, 5], b: [9, 0, 5], t: '9' }, { a: [9, 0, 5], b: [9, 3, 5], t: '3' }, { a: [0, 9, 5], b: [3, 9, 5], t: '3' }, { a: [3, 3, 5], b: [3, 9, 5], t: '6' }, { a: [9, 0, 0], b: [9, 0, 5], t: '5' }];
  const F = (ca, cb) => s9fig([s9B(...A, ca), s9B(...B, cb)], { labels: lab, yaw: .55, pitch: .42 });
  return [['① แบ่งเป็น 2 ชิ้น', 'ชิ้น A (ล่าง) กับชิ้น B (บน) — หน่วยเป็นเซนติเมตร', F(S9C.a, S9C.b)], ['② ชิ้น A', '9 × 3 × 5 = <b>135</b>', F(S9C.a, '#E4E7EF')], ['③ ชิ้น B', '3 × 6 × 5 = <b>90</b>', F('#E4E7EF', S9C.b)], ['④ รวมกัน', '135 + 90 = <b>225</b>', F(S9C.a, S9C.b)]]; };

/* =========================================================
   QUESTIONS & DATA
   ========================================================= */
Object.assign(Q, {
  s9Num({ fig, q, a, unit = '', hint }) {
    return { prompt: q, say: speakText(q), mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, fig ? h('div', { class: 't6-board sm', html: fig }) : null, h('div', { class: 'rowstack' }, answerBox(ctx, a, { hint }), unit ? h('span', { class: 'cap', style: { fontSize: '22px' } }, unit) : null))); } };
  }
});
const s9solQ = (kind, n) => { const S = S9_SOL[kind](n), fig = s9solFig(kind, n, { yaw: .5 + (n || 0) * .07 });
  const pool = kind === 'prism' || kind === 'pyr' ? [3, 4, 5, 6, 8].filter(k => k !== n).slice(0, 2).map(k => S9_SOL[kind](k).name).concat([S9_SOL[kind === 'prism' ? 'pyr' : 'prism'](n).name]) : ['ทรงกระบอก', 'กรวย', 'ทรงกลม', 'พีระมิดฐานสี่เหลี่ยม'].filter(x => x !== S.name).slice(0, 3);
  return Q.c8Pick({ fig, q: 'รูปเรขาคณิตสามมิตินี้ชื่ออะไร', opts: [S.name, ...shuffle(pool).slice(0, 2)], right: S.name, hint: 'ปริซึมมีฐาน 2 ฐาน หน้าข้างเป็นสี่เหลี่ยม · พีระมิดมีฐาน 1 ฐาน หน้าข้างเป็นสามเหลี่ยม' }); };
const s9cntQ = (kind, n, what) => { const S = S9_SOL[kind](n), W = { faces: ['หน้า', S.faces], edges: ['สัน', S.edges], verts: ['จุดยอด', S.verts] }[what];
  return Q.s9Num({ fig: s9solFig(kind, n, { hidden: true }), q: `${S.name}นี้มี${W[0]}ทั้งหมดกี่${W[0] === 'จุดยอด' ? 'จุด' : W[0]}`, a: W[1], hint: kind === 'prism' ? `ปริซึมฐาน ${n} เหลี่ยม: ${n + 2} หน้า ${3 * n} สัน ${2 * n} จุดยอด` : `พีระมิดฐาน ${n} เหลี่ยม: ${n + 1} หน้า ${2 * n} สัน ${n + 1} จุดยอด` }); };
const S9_TF = [['ปริซึมสามเหลี่ยมมีหน้าข้างแต่ละหน้าเป็นรูปสามเหลี่ยม', 0, 'หน้าข้างของปริซึมเป็นรูปสี่เหลี่ยม'], ['กรวยและพีระมิดมียอดแหลมที่ไม่อยู่บนระนาบเดียวกับฐาน', 1, 'ถูกต้อง'], ['ทรงกลมมีฐานเป็นวงกลม', 0, 'ทรงกลมมีผิวโค้งเรียบ ไม่มีฐาน'],
  ['พีระมิดฐานแปดเหลี่ยมมีหน้าทั้งหมด 8 หน้า', 0, 'มีฐาน 1 หน้า และหน้าข้าง 8 หน้า รวม 9 หน้า'], ['พีระมิดฐานหกเหลี่ยมมีหน้าข้าง 6 หน้า แต่ละหน้าเป็นรูปสามเหลี่ยม', 1, 'ถูกต้อง'], ['ทรงกระบอกมีฐานเป็นวงกลม 2 ฐาน ที่เท่ากันทุกประการและขนานกัน', 1, 'ถูกต้อง'],
  ['ปริซึมทุกชนิดมีหน้าตัด 2 หน้าที่เท่ากันทุกประการ', 1, 'ถูกต้อง'], ['กรวยมีฐาน 2 ฐาน', 0, 'กรวยมีฐานเป็นวงกลม 1 ฐาน']];
const s9tf = ([text, ok, why]) => Q.hTF({ text, ok: !!ok, why });
/* composite figures (unit = ซม. unless stated) */
const s9B = (x, y, z, w, hh, d, c) => s9box(x, y, z, w, hh, d, c);
const S9_COMP = [
  { m: () => [s9B(0, 0, 0, 10, 3, 5, S9C.a), s9B(0, 3, 0, 4, 5, 5, S9C.b)], lab: [[[0, 0, 5], [10, 0, 5], '10 ซม.'], [[10, 0, 5], [10, 3, 5], '3 ซม.'], [[0, 8, 5], [4, 8, 5], '4 ซม.'], [[0, 3, 5], [0, 8, 5], '5 ซม.'], [[10, 3, 0], [10, 3, 5], '5 ซม.']], a: 250, hint: '10 × 3 × 5 + 4 × 5 × 5' },
  { m: () => [s9B(0, 0, 0, 12, 2, 6, S9C.c), s9B(0, 2, 0, 8, 2, 6, S9C.d), s9B(0, 4, 0, 4, 2, 6, S9C.e)], lab: [[[0, 0, 6], [12, 0, 6], '12 ซม.'], [[0, 4, 6], [8, 4, 6], '8 ซม.'], [[0, 6, 6], [4, 6, 6], '4 ซม.'], [[0, 0, 6], [0, 6, 6], 'สูงชั้นละ 2 ซม.', 46], [[12, 2, 0], [12, 2, 6], '6 ซม.']], a: 288, hint: '12 × 2 × 6 + 8 × 2 × 6 + 4 × 2 × 6' },
  { m: () => [s9B(0, 0, 0, 12, 3, 4, S9C.a), s9B(4, 3, 0, 4, 6, 4, S9C.f)], lab: [[[0, 0, 4], [12, 0, 4], '12 ม.'], [[12, 0, 4], [12, 3, 4], '3 ม.'], [[4, 9, 4], [8, 9, 4], '4 ม.'], [[8, 3, 4], [8, 9, 4], '6 ม.'], [[12, 3, 0], [12, 3, 4], '4 ม.']], a: 240, unit: 'ลบ.ม.', hint: '12 × 3 × 4 + 4 × 6 × 4' },
  { m: () => [s9B(0, 0, 0, 10, 2, 4, S9C.g), s9B(0, 2, 0, 2, 5, 4, S9C.b), s9B(8, 2, 0, 2, 5, 4, S9C.b)], lab: [[[0, 0, 4], [10, 0, 4], '10 ซม.'], [[10, 0, 4], [10, 2, 4], '2 ซม.'], [[10, 2, 4], [10, 7, 4], '5 ซม.'], [[8, 7, 4], [10, 7, 4], '2 ซม.'], [[0, 7, 4], [2, 7, 4], '2 ซม.'], [[10, 2, 0], [10, 2, 4], '4 ซม.']], a: 160, hint: '10 × 2 × 4 + 2 × (2 × 5 × 4)' },
  { m: () => [s9B(0, 0, 0, 9, 4, 6, S9C.d), s9B(0, 4, 0, 9, 3, 2, S9C.c)], lab: [[[0, 0, 6], [9, 0, 6], '9 ซม.'], [[9, 0, 6], [9, 4, 6], '4 ซม.'], [[9, 4, 2], [9, 7, 2], '3 ซม.'], [[9, 0, 0], [9, 0, 6], '6 ซม.'], [[9, 7, 0], [9, 7, 2], '2 ซม.']], a: 270, hint: '9 × 4 × 6 + 9 × 3 × 2' }];
const s9compFig = c => s9fig(c.m(), { labels: c.lab.map(([a, b, t, off]) => ({ a, b, t, off })), yaw: .55, pitch: .42 });
const S9_COMPQ = ['หาปริมาตรของรูปเรขาคณิตสามมิติที่ประกอบด้วยทรงสี่เหลี่ยมมุมฉากนี้', 'บันไดปูน 3 ชั้นนี้มีปริมาตรเท่าใด', 'อาคารจำลองนี้มีปริมาตรเท่าใด', 'แท่นรูปตัว U นี้มีปริมาตรเท่าใด', 'บล็อกไม้ 2 ชั้นนี้มีปริมาตรเท่าใด'];
const s9compQ = c => Q.s9Num({ fig: s9compFig(c), q: S9_COMPQ[S9_COMP.indexOf(c)] || S9_COMPQ[0], a: c.a, unit: c.unit || 'ลบ.ซม.', hint: c.hint });
const S9_TANKS = [
  { m: () => [s9glass(s9B(0, 0, 0, 4, 2.5, 3)), s9B(0, 0, 0, 4, 1.9, 3, '#6FB2F5')], lab: [[[0, 0, 3], [4, 0, 3], '40 ซม.'], [[4, 0, 0], [4, 0, 3], '30 ซม.'], [[4, 0, 3], [4, 2.5, 3], '25 ซม.']], q: 'ตู้ปลาวัดขนาดภายในได้ดังรูป มีความจุกี่ลิตร', a: 30, unit: 'ลิตร', hint: '40 × 30 × 25 = 30,000 ลบ.ซม. = 30 ลิตร' },
  { m: () => [s9glass(s9B(0, 0, 0, 5, 4, 3)), s9B(0, 0, 0, 5, 2, 3, '#6FB2F5')], lab: [[[0, 0, 3], [5, 0, 3], '50 ซม.'], [[5, 0, 0], [5, 0, 3], '30 ซม.'], [[5, 0, 3], [5, 2, 3], 'น้ำสูง 20 ซม.']], q: 'อ่างวัดขนาดภายในได้ดังรูป มีน้ำอยู่กี่ลิตร', a: 30, unit: 'ลิตร', hint: '50 × 30 × 20 = 30,000 ลบ.ซม.' },
  { m: () => [s9B(0, 0, 0, 5, 3, 4, '#D9C7A8'), s9B(.5, .5, .5, 4, 2.51, 3, '#FFF7E8')], lab: [[[0, 0, 4], [5, 0, 4], '50 ซม.'], [[5, 0, 0], [5, 0, 4], '40 ซม.'], [[5, 0, 4], [5, 3, 4], '30 ซม.']], q: 'กล่องวัดขนาดภายนอกได้ดังรูป ผนังและก้นหนา 5 ซม. มีความจุกี่ลูกบาศก์เซนติเมตร', a: 30000, unit: 'ลบ.ซม.', hint: '(50 − 10) × (40 − 10) × (30 − 5)' },
  { m: () => [s9glass(s9B(0, 0, 0, 7, 2.5, 3)), s9glass(s9B(0, 2.5, 0, 3, 2.5, 3))], lab: [[[0, 0, 3], [7, 0, 3], '70 ซม.'], [[7, 0, 3], [7, 2.5, 3], '25 ซม.'], [[0, 5, 3], [3, 5, 3], '30 ซม.'], [[3, 2.5, 3], [3, 5, 3], '25 ซม.'], [[7, 0, 0], [7, 0, 3], '30 ซม.']], q: 'แบบหล่อวัดขนาดภายในได้ดังรูป มีความจุกี่ลูกบาศก์เซนติเมตร', a: 75000, unit: 'ลบ.ซม.', hint: '70 × 25 × 30 + 30 × 25 × 30' }];
const s9tankQ = c => Q.s9Num({ fig: s9fig(c.m(), { labels: c.lab.map(([a, b, t]) => ({ a, b, t })), hidden: true, yaw: .5, pitch: .4 }), q: c.q, a: c.a, unit: c.unit, hint: c.hint });
const S9S = [ // โจทย์ปัญหา (แต่งตามแนวแบบฝึกหัด 9.4)
  D6S('โต๊ะหินอ่อน: แผ่นบนยาว 140 ซม. กว้าง 30 ซม. หนา 4 ซม. ขา 3 ชิ้น ชิ้นละ 14,600 ลบ.ซม. ใช้หินอ่อนรวมกี่ลูกบาศก์เซนติเมตร', '140 × 30 × 4 + 3 × 14600', ['140 × 30 × 4 + 14600', '140 × 30 + 3 × 14600'], 'ลูกบาศก์เซนติเมตร'),
  D6S('ลานบ้านประกอบด้วยสี่เหลี่ยมผืนผ้า 8 × 6 เมตร และ 4 × 3 เมตร เทปูนหนา 0.1 เมตร ใช้ปูนกี่ลูกบาศก์เมตร', '(8 × 6 + 4 × 3) × 0.1', ['8 × 6 + 4 × 3', '(8 × 6 + 4 × 3) × 10'], 'ลูกบาศก์เมตร'),
  D6S('เสาปูนทรงสี่เหลี่ยมมุมฉากกว้าง 25 ซม. สูง 30 ซม. มีปริมาตร 16,200 ลูกบาศก์เซนติเมตร เสาปูนยาวกี่เซนติเมตร', '16200 ÷ (25 × 30)', ['16200 ÷ 25 × 30', '16200 − 25 × 30'], 'เซนติเมตร'),
  D6S('บันได 3 ขั้น กว้าง 100 ซม. แต่ละขั้นสูง 20 ซม. ขั้นล่างลึก 90 ซม. ขั้นกลางลึก 60 ซม. ขั้นบนลึก 30 ซม. ใช้คอนกรีตกี่ลูกบาศก์เซนติเมตร', '100 × 20 × (90 + 60 + 30)', ['100 × 20 × 90', '100 × 60 × 90'], 'ลูกบาศก์เซนติเมตร'),
  D6S('เทปูน 8,000 ลูกบาศก์เซนติเมตรลงในแบบพิมพ์แผ่นปูทางเดินกว้าง 40 ซม. ยาว 50 ซม. ได้ 1 แผ่นพอดี แผ่นปูทางเดินหนากี่เซนติเมตร', '8000 ÷ (40 × 50)', ['8000 ÷ 40 + 50', '8000 − 40 × 50'], 'เซนติเมตร'),
  D6S('กระบะปลูกผักวัดภายนอก ยาว 70 กว้าง 60 สูง 30 ซม. ขอบและก้นหนา 7 ซม. จุดินได้กี่ลูกบาศก์เซนติเมตร', '(70 − 10) × (60 − 10) × (30 − 7)', ['70 × 60 × 30', '(70 − 7) × (60 − 7) × (30 − 7)'], 'ลูกบาศก์เซนติเมตร'),
  D6S('ตู้ปลามีฐานภายในยาว 50 ซม. กว้าง 30 ซม. มีน้ำ 22.5 ลิตร (22,500 ลบ.ซม.) ระดับน้ำต่ำกว่าขอบตู้ 1.5 ซม. ตู้ปลาสูงกี่เซนติเมตร', '22500 ÷ (50 × 30) + 1.5', ['22500 ÷ (50 × 30)', '22500 ÷ (50 × 30) − 1.5'], 'เซนติเมตร'),
  D6S('สระน้ำวัดภายในยาว 10 ม. กว้าง 5 ม. ลึก 2 ม. เทปูนที่ก้นสระหนา 0.3 ม. สระนี้จุน้ำได้กี่ลิตร (1 ลบ.ม. = 1,000 ลิตร)', '10 × 5 × (2 − 0.3) × 1000', ['10 × 5 × 2 × 1000', '10 × 5 × (2 + 0.3) × 1000'], 'ลิตร'),
  D6S('โหลมีฐานภายในยาว 40 ซม. กว้าง 30 ซม. มีน้ำ 30,000 ลบ.ซม. ระดับน้ำต่ำกว่าขอบโหล 5 ซม. โหลสูงกี่เซนติเมตร', '30000 ÷ (40 × 30) + 5', ['30000 ÷ (40 × 30)', '30000 ÷ 40 ÷ 30 − 5'], 'เซนติเมตร'),
  D6S('แปลงผักมีพื้นที่ฐาน 10 ตารางเมตร พ่อใส่ดินสูง 12 ซม. (0.12 ม.) ทั่วแปลง ต้องใช้ดินกี่ลูกบาศก์เมตร', '10 × 0.12', ['10 × 12', '10 + 0.12'], 'ลูกบาศก์เมตร'),
  D6S('พิมพ์ขนมชั้นจุ 60 ลบ.ซม. ทำขนม 50 ชิ้น แต่ละชิ้นมี 3 สี สีละเท่า ๆ กัน ขนมแต่ละสีมีปริมาตรรวมกี่ลิตร (1,000 ลบ.ซม. = 1 ลิตร)', '60 × 50 ÷ 3 ÷ 1000', ['60 × 50 ÷ 1000', '60 ÷ 3 ÷ 1000'], 'ลิตร')];

/* v96: games without look-alike questions (ผู้ใช้เจอข้อซ้ำ) — every question has its own wording; practice takes the easiest, the game the rest */
const s9nameQ = (kind, n, q) => { const S = S9_SOL[kind](n), other = kind === 'prism' ? 'pyr' : 'prism', alt = [3, 4, 5, 6].filter(k => k !== n);
  return Q.c8Pick({ fig: s9solFig(kind, n, { yaw: .5 + n * .07 }), q, opts: [S.name, S9_SOL[other](n).name, S9_SOL[kind](pick(alt)).name], right: S.name, hint: 'ปริซึมมีหน้าตัด 2 หน้า หน้าข้างเป็นสี่เหลี่ยม · พีระมิดมีฐาน 1 หน้า หน้าข้างเป็นสามเหลี่ยม · ชื่อบอกรูปของฐาน' }); };
function s9gameP1() {
  const sol = shuffle([['prism', 3], ['prism', 4], ['prism', 5], ['prism', 6], ['pyr', 3], ['pyr', 4], ['pyr', 5], ['pyr', 6]]);
  const P = sol.find(x => x[0] === 'prism'), Y = sol.find(x => x[0] === 'pyr'), cnt = shuffle([['prism', pick([4, 6, 7, 8]), pick(['faces', 'edges', 'verts'])], ['pyr', pick([3, 5, 7, 8]), pick(['faces', 'edges', 'verts'])]]);
  const bk = pick(['prism', 'pyr']), bn = pick([5, 6, 7, 8]);
  return [s9nameQ(P[0], P[1], 'รูปเรขาคณิตสามมิตินี้ชื่ออะไร'), s9nameQ(Y[0], Y[1], 'รูปนี้เรียกว่าอะไร'),
    Q.dPick({ q: `${S9_SOL[bk](bn).name} มี${bk === 'prism' ? 'หน้าตัด' : 'ฐาน'}เป็นรูปอะไร`, opts: [`รูป${S9_TH[bn]}`, `รูป${S9_TH[bn - 1]}`, 'รูปสี่เหลี่ยมมุมฉาก'], right: `รูป${S9_TH[bn]}` }),
    pick([Q.dPick({ q: 'หน้าข้างของพีระมิดเป็นรูปอะไร', opts: ['รูปสามเหลี่ยม', 'รูปสี่เหลี่ยม', 'รูปวงกลม'], right: 'รูปสามเหลี่ยม' }), Q.dPick({ q: 'หน้าข้างของปริซึมเป็นรูปอะไร', opts: ['รูปสี่เหลี่ยม', 'รูปสามเหลี่ยม', 'รูปวงกลม'], right: 'รูปสี่เหลี่ยม' })]),
    ...cnt.map(([k, n, w]) => s9cntQ(k, n, w)), ...pkF([S9_TF[0], S9_TF[3], S9_TF[4], S9_TF[6]], 2).map(s9tf)];
}
function s9gameP2() {
  const objs = shuffle(Object.keys(S9_OBJ)), by = k => objs.filter(o => S9_OBJ[o][1] === k);
  const take = [by('cyl')[0], by('cone')[0], by('sph')[0], ...shuffle([by('cyl')[1], by('cone')[1], by('sph')[1]]).slice(0, 2)];
  return [...take.map(s9objQ), ...pkF([S9_TF[1], S9_TF[2], S9_TF[5], S9_TF[7]], 2).map(s9tf), Q.dPick({ q: 'รูปเรขาคณิตสามมิติใด<b>ไม่มี</b>ฐาน', opts: ['ทรงกลม', 'กรวย', 'ทรงกระบอก'], right: 'ทรงกลม' })];
}
const S9_NETQ = ['รูปคลี่นี้ประกอบเป็นรูปใด', 'พับรูปคลี่นี้แล้วจะได้รูปเรขาคณิตสามมิติใด', 'รูปนี้เป็นรูปคลี่ของรูปเรขาคณิตสามมิติใด', 'เมื่อพับตามรอยต่อ จะได้รูปใด'];
function s9gameP3() {
  const sol = shuffle([['prism', 3], ['prism', 4], ['prism', 5], ['prism', 6], ['pyr', 3], ['pyr', 4], ['pyr', 5], ['pyr', 6]]).slice(0, 4), Qs = shuffle(S9_NETQ);
  const netQ = ([k, n], i) => { const S = S9_SOL[k](n), o = k === 'prism' ? 'pyr' : 'prism', alt = [3, 4, 5, 6].filter(x => x !== n);
    return Q.c8Pick({ fig: s9netSVG(k === 'prism' ? s9netPrism(n) : s9netPyr(n)), q: Qs[i], opts: [S.name, S9_SOL[o](n).name, S9_SOL[k](pick(alt)).name], right: S.name, hint: 'นับรูปที่เป็นฐานก่อน: 2 รูป = ปริซึม · 1 รูปกับสามเหลี่ยมรอบ ๆ = พีระมิด' }); };
  const pn = pick([5, 6, 7, 8]), yn = pick([5, 6, 7, 8]);
  return [...sol.map(netQ), pick([Q.c8Pick({ fig: S9_CYLNET, q: 'รูปคลี่ที่มีวงกลม 2 รูปกับสี่เหลี่ยมนี้ประกอบเป็นรูปใด', opts: ['ทรงกระบอก', 'กรวย', 'ปริซึมสี่เหลี่ยม'], right: 'ทรงกระบอก' }), Q.c8Pick({ fig: S9_CONENET, q: 'รูปคลี่ที่มีวงกลมกับเสี้ยววงกลมนี้ประกอบเป็นรูปใด', opts: ['กรวย', 'ทรงกระบอก', 'พีระมิดฐานสามเหลี่ยม'], right: 'กรวย' })]),
    Q.s9Num({ q: `รูปคลี่ของปริซึม${S9_TH[pn]} มีรูปสี่เหลี่ยมกี่รูป`, a: pn, unit: 'รูป', hint: 'หน้าข้างของปริซึมมีเท่ากับจำนวนด้านของหน้าตัด' }),
    Q.s9Num({ q: `รูปคลี่ของพีระมิดฐาน${S9_TH[yn]} มีรูปสามเหลี่ยมกี่รูป`, a: yn, unit: 'รูป', hint: 'หน้าข้างของพีระมิดมีเท่ากับจำนวนด้านของฐาน' }),
    Q.dPick({ q: 'รูปคลี่ของปริซึมทุกแบบ มีรูปที่เป็นหน้าตัดกี่รูป', opts: ['2 รูป', '1 รูป', '3 รูป'], right: '2 รูป' })];
}
const S9_CUBEQ = ['รูปคลี่นี้พับเป็นลูกบาศก์ได้หรือไม่', 'ถ้าพับรูปคลี่นี้ จะได้ลูกบาศก์หรือไม่', 'รูปคลี่นี้ใช้ทำกล่องลูกบาศก์ได้หรือไม่'];
function s9gameP4() { const L = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ'], ks = shuffle(['t1', 't3', 't5', 't6', 'x1', 'x2', 'x3']), yes = ks.filter(k => s9isCube(s9netCube(S9_CUBENETS[k]))), no = ks.filter(k => !s9isCube(s9netCube(S9_CUBENETS[k]))), Qs = shuffle(S9_CUBEQ);
  const qs = shuffle([yes[0], no[0], pick([yes[1], no[1]])]).map((k, i) => { const ok = s9isCube(s9netCube(S9_CUBENETS[k])); return Q.c8Pick({ fig: s9netSVG(s9netCube(S9_CUBENETS[k]), { mono: true }), q: Qs[i], opts: ['ได้', 'ไม่ได้'], right: ok ? 'ได้' : 'ไม่ได้', keep: true, hint: 'ลองนึกพับ: มีหน้าซ้อนกันไหม' }); });
  const used = new Set(); shuffle(['t1', 't2', 't3', 't4', 't5', 't7']).slice(0, 3).forEach(k => { const N = s9netCube(S9_CUBENETS[k], L); let i = rnd(0, 5); while (used.has(i)) i = (i + 1) % 6; used.add(i); const j = s9opp(N, i); qs.push(Q.c8Pick({ fig: s9netSVG(N, { mono: true }), q: `เมื่อพับเป็นลูกบาศก์ หน้าใดอยู่ตรงข้ามกับหน้า ${L[i]}`, opts: shuffle(L.filter((_, x) => x !== i && x !== j)).slice(0, 2).concat([L[j]]), right: L[j], hint: 'หน้าที่ห่างกัน 1 ช่องในแถวเดียวกันอยู่ตรงข้ามกัน' })); });
  qs.push(Q.dPick({ q: 'ลูกบาศก์มีหน้าที่อยู่ตรงข้ามกันกี่คู่', opts: ['3 คู่', '2 คู่', '6 คู่'], right: '3 คู่' }));
  qs.push(Q.dPick({ q: 'รูปคลี่ของลูกบาศก์ ประกอบด้วยรูปสี่เหลี่ยมจัตุรัสกี่รูป', opts: ['6 รูป', '4 รูป', '8 รูป'], right: '6 รูป' }));
  return qs; }

/* =========================================================
   LEVELS 861–868
   ========================================================= */
const L6M = (no, place, title, short, goal, teach, game) => ({ id: 860 + no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game });
const LESSONS_P6C9 = [
  L6M(1, 'ลานปริซึมพีระมิด', 'ลักษณะและส่วนต่าง ๆ ของรูปเรขาคณิตสามมิติ ปริซึมและพีระมิด', 'ปริซึมและพีระมิด', 'บอกลักษณะและส่วนต่าง ๆ ของปริซึมและพีระมิด: หน้าตัด/ฐาน หน้าข้าง สัน จุดยอด และเรียกชื่อตามรูปของฐาน', [
    T('ยินดีต้อนรับสู่ <b>ภูเขาสามมิติ</b>! นี่คือ<b>ปริซึม</b> — ลากบนรูปเพื่อหมุน แล้วกด<b>ระบายฐาน</b>และ<b>ระบายหน้าข้าง</b>', 'ยินดีต้อนรับสู่ภูเขาสามมิติ นี่คือปริซึม ลากบนรูปเพื่อหมุน แล้วกดระบายฐานและระบายหน้าข้าง', el => el.append(simSolidOne('prism', 5))),
    T('ปริซึมอีกแบบ: หน้าตัดเป็น<b>รูปสามเหลี่ยม</b> — กดระบายดู', 'ปริซึมอีกแบบ หน้าตัดเป็นรูปสามเหลี่ยม กดระบายดู', el => el.append(simSolidOne('prism', 3))),
    T('ปริซึมอีกแบบ: หน้าตัดเป็น<b>รูปหกเหลี่ยม</b> — กดระบายดู', 'ปริซึมอีกแบบ หน้าตัดเป็นรูปหกเหลี่ยม กดระบายดู', el => el.append(simSolidOne('prism', 6))),
    T('ส่วนต่าง ๆ: <b>หน้า สัน จุดยอด</b> — กด “ต่อไป” ดูทีละส่วน', 'ส่วนต่าง ๆ หน้า สัน จุดยอด กดต่อไปดูทีละส่วน', el => el.append(simHFV('prism', 5))),
    pexStep('ตัวอย่างทีละขั้น: <b>ปริซึม</b>', 'ตัวอย่างทีละขั้น ปริซึม', s9walkPrism(5), 'ปริซึมห้าเหลี่ยม: <b>7 หน้า 15 สัน 10 จุดยอด</b> — ชื่อปริซึมบอกรูปของหน้าตัด', 'ปริซึมห้าเหลี่ยม มีเจ็ดหน้า สิบห้าสัน สิบจุดยอด', s9shadeFig('prism', 5, 'none')),
    T('เรื่องใหม่: <b>พีระมิด</b> — ลากบนรูปเพื่อหมุน แล้วกด<b>ระบายฐาน</b>และ<b>ระบายหน้าข้าง</b>', 'เรื่องใหม่ พีระมิด ลากบนรูปเพื่อหมุน แล้วกดระบายฐานและระบายหน้าข้าง', el => el.append(simSolidOne('pyr', 4))),
    T('พีระมิดอีกแบบ: ฐานเป็น<b>รูปสามเหลี่ยม</b> — กดระบายดู', 'พีระมิดอีกแบบ ฐานเป็นรูปสามเหลี่ยม กดระบายดู', el => el.append(simSolidOne('pyr', 3))),
    T('พีระมิดอีกแบบ: ฐานเป็น<b>รูปหกเหลี่ยม</b> — กดระบายดู', 'พีระมิดอีกแบบ ฐานเป็นรูปหกเหลี่ยม กดระบายดู', el => el.append(simSolidOne('pyr', 6))),
    T('ส่วนต่าง ๆ ของพีระมิด: <b>หน้า สัน จุดยอด</b> — กด “ต่อไป” ดูทีละส่วน', 'ส่วนต่าง ๆ ของพีระมิด หน้า สัน จุดยอด กดต่อไปดูทีละส่วน', el => el.append(simHFV('pyr', 4))),
    pexStep('ตัวอย่างทีละขั้น: <b>พีระมิด</b>', 'ตัวอย่างทีละขั้น พีระมิด', s9walkPyr(5), 'พีระมิดฐานห้าเหลี่ยม: <b>6 หน้า 10 สัน 6 จุดยอด</b> — ต่างจากปริซึม: ฐานเดียว หน้าข้างเป็นสามเหลี่ยม', 'พีระมิดฐานห้าเหลี่ยม มีหกหน้า สิบสัน หกจุดยอด', s9shadeFig('pyr', 5, 'none'))],
    () => s9gameP1()),
  L6M(2, 'ทุ่งทรงกลม', 'ลักษณะและส่วนต่าง ๆ ของรูปเรขาคณิตสามมิติ ทรงกระบอก กรวย และทรงกลม', 'ทรงกระบอก กรวย ทรงกลม', 'บอกลักษณะของทรงกระบอก กรวย และทรงกลม: ฐานเป็นวงกลม ผิวโค้ง ยอดแหลม', [
    T('นี่คือ<b>ทรงกระบอก</b> — หมุนดู แล้วกด<b>ระบายฐาน</b>และ<b>ระบายผิวโค้ง</b>', 'นี่คือทรงกระบอก หมุนดู แล้วกดระบายฐานและระบายผิวโค้ง', el => el.append(simSolidOne('cyl'))),
    T('นี่คือ<b>กรวย</b> — หมุนดู แล้วกด<b>ระบายฐาน</b>และ<b>ระบายผิวโค้ง</b>', 'นี่คือกรวย หมุนดู แล้วกดระบายฐานและระบายผิวโค้ง', el => el.append(simSolidOne('cone'))),
    T('นี่คือ<b>ทรงกลม</b> — หมุนดู แล้วกด<b>ระบายผิวโค้ง</b>และ<b>แสดงรัศมี</b>', 'นี่คือทรงกลม หมุนดู แล้วกดระบายผิวโค้งและแสดงรัศมี', el => el.append(simSolidOne('sph'))),
    T('สิ่งของรอบตัว — <b>แตะ</b>ดูว่าคล้ายรูปเรขาคณิตสามมิติใด', 'สิ่งของรอบตัว แตะดูว่าคล้ายรูปเรขาคณิตสามมิติใด', el => el.append(simObjects())),
    pexStep('ตัวอย่างทีละขั้น: เปรียบเทียบ', 'ตัวอย่างทีละขั้น เปรียบเทียบ', [['ทรงกระบอก', 'ฐานวงกลม 2 ฐาน ขนานกัน เท่ากันทุกประการ + ผิวโค้ง (คล้ายปริซึม)', s9shadeFig('cyl', 0, 'base')], ['กรวย', 'ฐานวงกลม 1 ฐาน + ผิวโค้ง + ยอดแหลม (คล้ายพีระมิด)', s9shadeFig('cone', 0, 'base')], ['ทรงกลม', 'ผิวโค้งเรียบทั้งหมด ไม่มีฐาน ไม่มีสัน ไม่มีจุดยอด', s9solFig('sph', 0)]], 'ทรงกระบอก <b>2 ฐาน</b> · กรวย <b>1 ฐาน</b> · ทรงกลม <b>ไม่มีฐาน</b>', 'ทรงกระบอกสองฐาน กรวยหนึ่งฐาน ทรงกลมไม่มีฐาน')],
    () => s9gameP2()),
  L6M(3, 'ลานพับกล่อง', 'รูปคลี่ของปริซึมและพีระมิด', 'รูปคลี่ปริซึม พีระมิด', 'บอกรูปเรขาคณิตสามมิติที่ประกอบจากรูปคลี่ และบอกรูปคลี่ของปริซึม พีระมิด ทรงกระบอก และกรวย', [
    T('รูปคลี่ของ<b>ปริซึม</b> — กด <b>คลี่ออก</b> และ <b>พับ</b>', 'รูปคลี่ของปริซึม กดคลี่ออกและพับ', el => el.append(simNetOne('prism', 4))),
    T('รูปคลี่ของปริซึมอีกแบบ: <b>ปริซึมสามเหลี่ยม</b>', 'รูปคลี่ของปริซึมสามเหลี่ยม', el => el.append(simNetOne('prism', 3))),
    T('รูปคลี่ของปริซึมอีกแบบ: <b>ปริซึมหกเหลี่ยม</b>', 'รูปคลี่ของปริซึมหกเหลี่ยม', el => el.append(simNetOne('prism', 6))),
    T('เรื่องใหม่: รูปคลี่ของ<b>พีระมิด</b> — กด <b>คลี่ออก</b> และ <b>พับ</b>', 'เรื่องใหม่ รูปคลี่ของพีระมิด กดคลี่ออกและพับ', el => el.append(simNetOne('pyr', 4))),
    T('รูปคลี่ของพีระมิดอีกแบบ: <b>ฐานสามเหลี่ยม</b>', 'รูปคลี่ของพีระมิดฐานสามเหลี่ยม', el => el.append(simNetOne('pyr', 3))),
    T('รูปคลี่ของพีระมิดอีกแบบ: <b>ฐานหกเหลี่ยม</b>', 'รูปคลี่ของพีระมิดฐานหกเหลี่ยม', el => el.append(simNetOne('pyr', 6))),
    T('เรื่องใหม่: รูปคลี่ของ<b>ทรงกระบอก</b>', 'เรื่องใหม่ รูปคลี่ของทรงกระบอก', el => el.append(simNetRound('cyl'))),
    T('รูปคลี่ของ<b>กรวย</b>', 'รูปคลี่ของกรวย', el => el.append(simNetRound('cone'))),
    pexStep('ตัวอย่างทีละขั้น: ดูรูปคลี่แล้วบอกชื่อ', 'ตัวอย่างทีละขั้น ดูรูปคลี่แล้วบอกชื่อ', [['① นับรูปที่เป็นฐาน', 'มีรูปหกเหลี่ยม <b>2 รูป</b> → เป็นปริซึม (ถ้ามีรูปเดียวและที่เหลือเป็นสามเหลี่ยม → พีระมิด)', s9netSVG(s9netPrism(6))], ['② ดูหน้าข้าง', 'รูปสี่เหลี่ยม 6 รูป → หน้าข้างของปริซึม', s9netSVG(s9netPrism(6))], ['③ เรียกชื่อ', 'ฐานเป็นรูปหกเหลี่ยม → <b>ปริซึมหกเหลี่ยม</b>', s9solFig('prism', 6, { W: 400, H: 260 })]], 'รูปคลี่นี้ประกอบเป็น <b>ปริซึมหกเหลี่ยม</b>', 'รูปคลี่นี้ประกอบเป็นปริซึมหกเหลี่ยม', s9netSVG(s9netPrism(6)))],
    () => s9gameP3()),
  L6M(4, 'ลานลูกเต๋า', 'รูปคลี่ของลูกบาศก์', 'รูปคลี่ลูกบาศก์', 'บอกได้ว่ารูปคลี่ใดพับเป็นลูกบาศก์ได้ และหาหน้าที่อยู่ตรงข้ามกันเมื่อพับ', [
    T('เลือกรูปคลี่ แล้วกด <b>พับ</b> — แบบไหนพับเป็นลูกบาศก์ได้?', 'เลือกรูปคลี่ แล้วกดพับ แบบไหนพับเป็นลูกบาศก์ได้', el => el.append(simCubeNet())),
    T('ตัวอย่างทีละขั้น: หาหน้าตรงข้าม', 'ตัวอย่างทีละขั้น หาหน้าตรงข้าม', el => el.append(s9Side(h('div', { class: 't6-board', html: s9netSVG(s9netCube(S9_CUBENETS.t1, ['1', '2', '3', '4', '5', '6']), { W: 360, H: 240 }) }), dcWalk('', [['① แถวยาว 4 หน้า', 'หน้า 2, 3, 4, 5 เรียงกัน → หน้าที่ห่างกัน 1 ช่องเป็นคู่ตรงข้าม: 2 กับ 4 และ 3 กับ 5'], ['② หน้าบนและล่าง', 'หน้า 1 (บน) กับหน้า 6 (ล่าง) อยู่ตรงข้ามกัน']], 'ลูกบาศก์มีหน้าตรงข้าม <b>3 คู่</b>: 2–4, 3–5, 1–6', 'ลูกบาศก์มีหน้าตรงข้ามสามคู่'))))],
    () => s9gameP4()),
  L6M(5, 'ฐานบล็อกซ้อน', 'การหาปริมาตรของรูปเรขาคณิตสามมิติที่แบ่งเป็นทรงสี่เหลี่ยมมุมฉาก', 'ปริมาตรรูปประกอบ', 'หาปริมาตรของรูปเรขาคณิตสามมิติที่ประกอบด้วยทรงสี่เหลี่ยมมุมฉาก โดยแบ่งเป็นส่วน ๆ แล้วรวมกัน', [
    T('รูปนี้ประกอบด้วยทรงสี่เหลี่ยมมุมฉาก 2 ก้อน — กด<b>แบ่งแนวนอน</b>และ<b>แบ่งแนวตั้ง</b>', 'รูปนี้ประกอบด้วยทรงสี่เหลี่ยมมุมฉากสองก้อน กดแบ่งแนวนอนและแบ่งแนวตั้ง', el => el.append(simCompOne(S9_CV[0]))),
    T('รูปอีกขนาดหนึ่ง — ลองแบ่งทั้ง 2 แบบ', 'รูปอีกขนาดหนึ่ง ลองแบ่งทั้งสองแบบ', el => el.append(simCompOne(S9_CV[1]))),
    T('รูปอีกขนาดหนึ่ง — ลองแบ่งทั้ง 2 แบบ', 'รูปอีกขนาดหนึ่ง ลองแบ่งทั้งสองแบบ', el => el.append(simCompOne(S9_CV[2]))),
    pexStep('ตัวอย่างทีละขั้น: หาปริมาตร', 'ตัวอย่างทีละขั้น หาปริมาตร', s9compWalk(), 'ปริมาตร = <b>225 ลบ.ซม.</b>', 'ปริมาตรเท่ากับสองร้อยยี่สิบห้าลูกบาศก์เซนติเมตร', s9fig([s9B(0, 0, 0, 9, 3, 5, '#C9D3E8'), s9B(0, 3, 0, 3, 6, 5, '#C9D3E8')], { labels: [{ a: [0, 0, 5], b: [9, 0, 5], t: '9' }, { a: [9, 0, 5], b: [9, 3, 5], t: '3' }, { a: [0, 9, 5], b: [3, 9, 5], t: '3' }, { a: [3, 3, 5], b: [3, 9, 5], t: '6' }, { a: [9, 0, 0], b: [9, 0, 5], t: '5' }], yaw: .55, pitch: .42 }))],
    () => pkF(S9_COMP, 4).map(s9compQ).concat([Q.dPick({ q: 'ปริมาตรของทรงสี่เหลี่ยมมุมฉากหาได้จากข้อใด', opts: ['กว้าง × ยาว × สูง', 'กว้าง + ยาว + สูง', '(กว้าง + ยาว) × 2'], right: 'กว้าง × ยาว × สูง' })])),
  L6M(6, 'บ่อน้ำภูเขา', 'การหาความจุของรูปเรขาคณิตสามมิติที่ประกอบด้วยทรงสี่เหลี่ยมมุมฉาก', 'ความจุ', 'หาความจุของภาชนะที่ประกอบด้วยทรงสี่เหลี่ยมมุมฉาก โดยใช้ขนาดภายใน และเปลี่ยนหน่วยลูกบาศก์เซนติเมตรเป็นลิตร', [
    T('ปรับความหนาของผนังและระดับน้ำ — ความจุใช้<b>ขนาดภายใน</b> (ลากเพื่อหมุนได้)', 'ปรับความหนาของผนังและระดับน้ำ ความจุใช้ขนาดภายใน', el => el.append(simTank())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['โจทย์', 'กล่องวัดภายนอกยาว 40 กว้าง 30 สูง 25 ซม. ผนังและก้นหนา 2 ซม.'], ['① ขนาดภายใน', 'ยาว 40 − 4 = 36 · กว้าง 30 − 4 = 26 · สูง 25 − 2 = 23'], ['② ความจุ', '36 × 26 × 23 = 21,528 ลบ.ซม.'], ['③ เป็นลิตร', '21,528 ÷ 1,000 = 21.528 ลิตร']], 'ความจุ ≈ <b>21.5 ลิตร</b>', 'ประมาณยี่สิบเอ็ดจุดห้าลิตร')))],
    () => [...S9_TANKS.map(s9tankQ), Q.dPick({ q: '1 ลิตร เท่ากับกี่ลูกบาศก์เซนติเมตร', opts: ['1,000', '100', '10'], right: '1,000' }), Q.dPick({ q: 'การหาความจุของภาชนะ ต้องใช้ขนาดใด', opts: ['ขนาดภายใน', 'ขนาดภายนอก', 'ความหนาของผนัง'], right: 'ขนาดภายใน' })]),
  L6M(7, 'ฐานโจทย์ปริมาตร', 'การแก้โจทย์ปัญหาปริมาตรที่ใช้ความรู้เกี่ยวกับปริมาตรของทรงสี่เหลี่ยมมุมฉาก', 'โจทย์ปริมาตร', 'แก้โจทย์ปัญหาปริมาตรของรูปที่ประกอบด้วยทรงสี่เหลี่ยมมุมฉาก รวมถึงหาความยาวหรือความหนาจากปริมาตร', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('ม้านั่งตัวหนึ่งมีปริมาตร 13,200 ลบ.ซม. ประกอบด้วยแผ่นที่นั่งหนา 3 ซม. และขา 2 ชิ้น ชิ้นละ 3,000 ลบ.ซม. แผ่นที่นั่งมีพื้นที่กี่ตารางเซนติเมตร', [{ q: 'ปริมาตรแผ่นที่นั่ง', opts: ['13200 − 2 × 3000', '13200 + 2 × 3000', '13200 ÷ 2'], right: '13200 − 2 × 3000', unit: 'ลบ.ซม.', why: 'ปริมาตรทั้งหมดลบปริมาตรขา' }, { q: 'พื้นที่ = ปริมาตร ÷ ความหนา', opts: ['7200 ÷ 3', '7200 × 3', '7200 − 3'], right: '7200 ÷ 3', unit: 'ตร.ซม.', why: 'ปริมาตร = พื้นที่ฐาน × ความหนา' }], 'ตอบ พื้นที่ที่นั่ง <b>2,400</b> ตร.ซม.'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('อิฐบล็อก 4 ก้อนวางเรียงกันยาว 2.4 เมตร (240 ซม.) พอดี แต่ละก้อนกว้าง 15 ซม. สูง 12 ซม. อิฐ 1 ก้อนมีปริมาตรกี่ลูกบาศก์เซนติเมตร', [['① ยาว 1 แท่ง', '240 ÷ 4 = 60 ซม.'], ['② ปริมาตร', '60 × 15 × 12']], '240 ÷ 4 × 15 × 12')))],
    () => [0, 1, 2, 3, 4].map(i => Q.dStory(S9S[i]))),
  L6M(8, 'ยอดเขาสามมิติ', 'การแก้โจทย์ปัญหาความจุที่ใช้ความรู้เกี่ยวกับความจุของทรงสี่เหลี่ยมมุมฉาก', 'โจทย์ความจุ', 'แก้โจทย์ปัญหาความจุของภาชนะทรงสี่เหลี่ยมมุมฉาก รวมถึงหาความสูงจากปริมาตรน้ำ และเปลี่ยนหน่วยเป็นลิตร', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('สระว่ายน้ำวัดภายในยาว 12 ม. กว้าง 6 ม. ลึก 1.5 ม. สระนี้จุน้ำได้มากที่สุดกี่ลิตร (1 ลบ.ม. = 1,000 ลิตร)', [{ q: 'ความจุเป็นลูกบาศก์เมตร', opts: ['12 × 6 × 1.5', '12 + 6 + 1.5', '12 × 6'], right: '12 × 6 × 1.5', unit: 'ลบ.ม.', why: 'ความจุ = ยาว × กว้าง × ลึก (ขนาดภายใน)' }, { q: 'เปลี่ยนเป็นลิตร', opts: ['108 × 1000', '108 ÷ 1000', '108 × 100'], right: '108 × 1000', unit: 'ลิตร', why: '1 ลบ.ม. = 1,000 ลิตร' }], 'ตอบ <b>108,000</b> ลิตร'))),
    T('ตัวอย่างทีละขั้น: หาความสูง', 'ตัวอย่างทีละขั้น หาความสูง', el => el.append(dcStory('ตู้ปลามีฐานภายในยาว 60 ซม. กว้าง 25 ซม. มีน้ำ 30 ลิตร (30,000 ลบ.ซม.) ระดับน้ำต่ำกว่าขอบ 4 ซม. ตู้ปลาสูงกี่เซนติเมตร', [['① ระดับน้ำ', '30,000 ÷ (60 × 25) = 20 ซม.'], ['② บวกส่วนที่เหลือถึงขอบ', '20 + 4']], '30000 ÷ (60 × 25) + 4')))],
    () => [5, 6, 7, 8, 9, 10].map(i => Q.dStory(S9S[i])))
];

/* =========================================================
   ========================================================= */
const EXAM_P6C9 = d6spread([
  { q: 'รูปเรขาคณิตสามมิตินี้ชื่ออะไร', fig: s9solFig('prism', 6), opts: ['ปริซึมหกเหลี่ยม', 'พีระมิดฐานหกเหลี่ยม', 'ปริซึมห้าเหลี่ยม', 'ทรงกระบอก'], a: 0 },
  { q: 'รูปเรขาคณิตสามมิตินี้ชื่ออะไร', fig: s9solFig('pyr', 3), opts: ['พีระมิดฐานสามเหลี่ยม', 'ปริซึมสามเหลี่ยม', 'พีระมิดฐานสี่เหลี่ยม', 'กรวย'], a: 0 },
  { q: 'พีระมิดฐานแปดเหลี่ยมมีหน้าทั้งหมดกี่หน้า', opts: ['9 หน้า', '8 หน้า', '10 หน้า', '16 หน้า'], a: 0 },
  { q: 'ปริซึมห้าเหลี่ยมมีสันทั้งหมดกี่สัน', opts: ['15 สัน', '10 สัน', '7 สัน', '12 สัน'], a: 0 },
  { q: 'ข้อใดกล่าว<b>ถูกต้อง</b>', opts: ['ปริซึมมีหน้าตัด 2 หน้าที่เท่ากันทุกประการและขนานกัน', 'ทรงกลมมีฐานเป็นวงกลม', 'กรวยมีฐาน 2 ฐาน', 'หน้าข้างของปริซึมเป็นรูปสามเหลี่ยม'], a: 0 },
  { q: 'รูปเรขาคณิตสามมิติใดมีฐานเป็นวงกลม 1 ฐานและมียอดแหลม', opts: ['กรวย', 'ทรงกระบอก', 'ทรงกลม', 'พีระมิดฐานสี่เหลี่ยม'], a: 0 },
  { q: 'รูปคลี่นี้ประกอบเป็นรูปใด', fig: s9netSVG(s9netPrism(4)), opts: ['ปริซึมสี่เหลี่ยม', 'พีระมิดฐานสี่เหลี่ยม', 'ปริซึมสามเหลี่ยม', 'ลูกบาศก์'], a: 0 },
  { q: 'รูปคลี่นี้ประกอบเป็นรูปใด', fig: s9netSVG(s9netPyr(5)), opts: ['พีระมิดฐานห้าเหลี่ยม', 'ปริซึมห้าเหลี่ยม', 'พีระมิดฐานหกเหลี่ยม', 'กรวย'], a: 0 },
  { q: 'รูปคลี่นี้ประกอบเป็นรูปใด', fig: S9_CYLNET, opts: ['ทรงกระบอก', 'กรวย', 'ทรงกลม', 'ปริซึมสี่เหลี่ยม'], a: 0 },
  { q: 'รูปคลี่นี้พับเป็นลูกบาศก์ได้หรือไม่', fig: s9netSVG(s9netCube(S9_CUBENETS.x1), { mono: true }), opts: ['ไม่ได้ เพราะมีหน้าซ้อนกัน', 'ได้', 'ได้เป็นปริซึมสามเหลี่ยม', 'ได้เป็นพีระมิดฐานสี่เหลี่ยม'], a: 0 },
  { q: 'หาปริมาตรของรูปเรขาคณิตสามมิตินี้', fig: s9compFig(S9_COMP[0]), opts: ['250 ลบ.ซม.', '150 ลบ.ซม.', '400 ลบ.ซม.', '300 ลบ.ซม.'], a: 0 },
  { q: 'หาปริมาตรของรูปเรขาคณิตสามมิตินี้', fig: s9compFig(S9_COMP[1]), opts: ['288 ลบ.ซม.', '144 ลบ.ซม.', '432 ลบ.ซม.', '240 ลบ.ซม.'], a: 0 },
  { q: 'กล่องวัดขนาดภายนอกยาว 50 ซม. กว้าง 40 ซม. สูง 30 ซม. ผนังและก้นหนา 5 ซม. มีความจุเท่าใด', opts: ['30,000 ลบ.ซม.', '60,000 ลบ.ซม.', '42,000 ลบ.ซม.', '24,000 ลบ.ซม.'], a: 0 },
  { q: 'ตู้ปลาวัดขนาดภายในยาว 40 ซม. กว้าง 30 ซม. สูง 25 ซม. มีความจุกี่ลิตร', opts: ['30 ลิตร', '300 ลิตร', '3 ลิตร', '95 ลิตร'], a: 0 },
  { q: 'ม้านั่งมีที่นั่งยาว 120 ซม. กว้าง 40 ซม. หนา 5 ซม. และขา 2 ชิ้น ชิ้นละ 16,000 ลบ.ซม. ม้านั่งมีปริมาตรเท่าใด', opts: ['56,000 ลบ.ซม.', '40,000 ลบ.ซม.', '24,000 ลบ.ซม.', '72,000 ลบ.ซม.'], a: 0 },
  { q: 'แท่นปูนกว้าง 20 ซม. สูง 40 ซม. มีปริมาตร 23,600 ลบ.ซม. แท่นปูนยาวเท่าใด', opts: ['29.5 ซม.', '59 ซม.', '25 ซม.', '39.5 ซม.'], a: 0 },
  { q: 'อ่างน้ำวัดภายนอกยาว 80 ซม. กว้าง 50 ซม. สูง 40 ซม. ขอบและก้นหนา 5 ซม. มีความจุเท่าใด', opts: ['98,000 ลบ.ซม.', '160,000 ลบ.ซม.', '118,125 ลบ.ซม.', '84,000 ลบ.ซม.'], a: 0 },
  { q: 'ตู้ปลามีฐานภายในยาว 50 ซม. กว้าง 30 ซม. มีน้ำ 22.5 ลิตร ระดับน้ำต่ำกว่าขอบ 1.5 ซม. ตู้ปลาสูงเท่าใด', opts: ['16.5 ซม.', '15 ซม.', '13.5 ซม.', '18 ซม.'], a: 0 },
  { q: 'สระน้ำวัดภายในยาว 10 ม. กว้าง 5 ม. ลึก 2 ม. เทปูนที่ก้นหนา 0.3 ม. จุน้ำได้กี่ลิตร', opts: ['85,000 ลิตร', '100,000 ลิตร', '115,000 ลิตร', '8,500 ลิตร'], a: 0 },
  { q: 'แปลงผักมีพื้นที่ฐาน 10 ตารางเมตร ใส่ดินสูง 12 ซม. ทั่วแปลง ต้องใช้ดินกี่ลูกบาศก์เมตร', opts: ['1.2 ลบ.ม.', '120 ลบ.ม.', '12 ลบ.ม.', '0.12 ลบ.ม.'], a: 0 }
]);
LESSONS_P6C9.push({ id: 869, boss: true, place: 'ยอดเขาเยติสามมิติ', title: 'ด่านบอส: บทที่ 9 รูปเรขาคณิตสามมิติ', short: 'ด่านบอส · ข้อสอบ', tone: 'orange',
  goal: 'คำถามท้ายบท 20 ข้อ (ปริซึม พีระมิด ทรงกระบอก กรวย ทรงกลม รูปคลี่ ปริมาตร ความจุ และโจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อพิชิตยอดเขา',
  exam: EXAM_P6C9, pass: 10, bossName: 'เยติสามมิติ', bossPal: 'orange', emblem: '⬢', bossKind: 'yeti' });
/* v110: the “หมุนฉันสิ!” bubble (CSS ::after on .s9-view.drag) goes away once the child has turned the figure */
document.addEventListener('pointerdown', e => { const v = e.target && e.target.closest && e.target.closest('.s9-view.drag'); if (v) v.classList.add('spun'); }, true);
