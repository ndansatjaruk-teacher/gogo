/* =========================================================
   ป.5 บทที่ 6 เส้นขนาน (ภาคเรียนที่ 2) — geometry figure engine (lines, transversal, 8 angles),
   draggable sims, constructions, question types (l…), levels 621–628 + boss 629
   ========================================================= */
const g6r = d => d * Math.PI / 180;
/* geometry of N lines cut by one transversal. lines pass through (W/2, y) with tilt t (deg, ccw);
   transversal passes through (x0, lines[0].y) with direction phi (deg, ccw, pointing up). */
function transGeom(o) {
  const W = o.W || 600, H = o.H || 330, phi = o.phi != null ? o.phi : 60, L = o.lines || [{ y: 115, t: 0 }, { y: 225, t: 0 }], x0 = o.x0 != null ? o.x0 : W / 2;
  const u = [Math.cos(g6r(phi)), -Math.sin(g6r(phi))], P0 = [x0, L[0].y];
  const X = L.map(l => { const c = [W / 2, l.y], d = [Math.cos(g6r(l.t || 0)), -Math.sin(g6r(l.t || 0))], det = -u[0] * d[1] + u[1] * d[0], bx = c[0] - P0[0], by = c[1] - P0[1];
    const s = (-bx * d[1] + by * d[0]) / det; return { p: [P0[0] + s * u[0], P0[1] + s * u[1]], c, d, t: l.t || 0 }; });
  const regs = []; X.forEach((x, i) => { const t = x.t; [[phi, t + 180], [t, phi], [t + 180, phi + 180], [phi + 180, t + 360]].forEach(([a1, a2], q) => regs.push({ k: i * 4 + q + 1, i, a1, a2, v: Math.round((a2 - a1) * 10) / 10 })); });
  return { W, H, phi, L, u, X, regs };
}
const g6pt = (c, r, a) => [c[0] + r * Math.cos(g6r(a)), c[1] - r * Math.sin(g6r(a))];
const G6COL = { a: '#E5487A', b: '#3F8BDB', c: '#1B8862', d: '#C98612', p: '#7E6ED6' };
function transFig(o = {}) {
  const G = transGeom(o), { W, H, u, X, regs } = G, hl = o.hl || {}, vals = o.vals || {}, arcs = o.arcs || Object.keys({ ...hl, ...vals }).map(Number);
  let s = `<svg viewBox="0 0 ${W} ${H}" class="g6-svg${o.tap ? ' tapf' : ''}" aria-hidden="true"><defs><marker id="g6ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9 Z" fill="#2B2550"/></marker></defs>`;
  // wedges (tap targets)
  if (o.tap) regs.forEach(r => { const c = X[r.i].p, p1 = g6pt(c, 46, r.a1), p2 = g6pt(c, 46, r.a2); s += `<path class="g6w${hl[r.k] ? ' on' : ''}" data-k="${r.k}" d="M${c[0]} ${c[1]} L${p1[0]} ${p1[1]} A46 46 0 0 0 ${p2[0]} ${p2[1]} Z"/>`; });
  // lines
  X.forEach((x, i) => { const len = o.len || W / 2 - 28, e1 = [x.c[0] - x.d[0] * len, x.c[1] - x.d[1] * len], e2 = [x.c[0] + x.d[0] * len, x.c[1] + x.d[1] * len], col = (o.lineCol || [])[i] || '#2B2550';
    s += `<path d="M${e1[0]} ${e1[1]} L${e2[0]} ${e2[1]}" stroke="${col}" stroke-width="3" ${o.noArrow ? '' : 'marker-start="url(#g6ar)" marker-end="url(#g6ar)"'}/>`;
    const nm = (o.names || [])[i]; if (nm) s += `<text x="${e1[0] + 6}" y="${e1[1] - 9}" class="g6l">${nm[0]}</text><text x="${e2[0] - 18}" y="${e2[1] - 9}" class="g6l">${nm[1]}</text>`;
    if (o.par) { const m = [x.c[0] + x.d[0] * (len * .62), x.c[1] + x.d[1] * (len * .62)]; for (let q = 0; q < (o.par === 2 && i ? 2 : 1); q++) { const mm = [m[0] + x.d[0] * q * 10, m[1] + x.d[1] * q * 10], n = [-x.d[1], x.d[0]];
      s += `<path d="M${mm[0] - x.d[0] * 7 + n[0] * 6} ${mm[1] - x.d[1] * 7 + n[1] * 6} L${mm[0]} ${mm[1]} L${mm[0] - x.d[0] * 7 - n[0] * 6} ${mm[1] - x.d[1] * 7 - n[1] * 6}" fill="none" stroke="#E5487A" stroke-width="2.6"/>`; } } });
  // transversal
  if (!o.noTrans) { const a = X[0].p, b = X[X.length - 1].p, top = [a[0] + u[0] * 75, a[1] + u[1] * 75], bot = [b[0] - u[0] * 75, b[1] - u[1] * 75];
    s += `<path d="M${top[0]} ${top[1]} L${bot[0]} ${bot[1]}" stroke="${o.tCol || '#7E6ED6'}" stroke-width="3" marker-start="url(#g6ar)" marker-end="url(#g6ar)"/>`;
    if (o.tn) s += `<text x="${top[0] + 8}" y="${top[1] + 4}" class="g6l">${o.tn[0]}</text><text x="${bot[0] + 8}" y="${bot[1] + 4}" class="g6l">${o.tn[1]}</text>`;
    if (o.handle) s += `<circle class="g6h" data-h="t" cx="${top[0]}" cy="${top[1]}" r="13"/>`; }
  if (o.handle) X.forEach((x, i) => { if (i && o.handle === 'both') { const e = [x.c[0] + x.d[0] * (W / 2 - 50), x.c[1] + x.d[1] * (W / 2 - 50)]; s += `<circle class="g6h l" data-h="l${i}" cx="${e[0]}" cy="${e[1]}" r="13"/>`; } });
  // distance markers (perpendicular to line 0)
  (o.dist || []).forEach(dx => { const x0 = X[0], x1 = X[1], px = W / 2 + dx, y0 = x0.c[1] - Math.tan(g6r(x0.t)) * dx, y1 = x1.c[1] - Math.tan(g6r(x1.t)) * dx;
    s += `<path d="M${px} ${y0} V${y1}" stroke="#E5487A" stroke-width="2.4" stroke-dasharray="5 4"/><path d="M${px} ${y0 + 10} h10 v-10" fill="none" stroke="#E5487A" stroke-width="1.6"/><g transform="translate(${px + 6} ${(y0 + y1) / 2 - 12})"><rect width="58" height="24" rx="8" fill="#fff" stroke="#E5487A"/><text x="29" y="17" text-anchor="middle" class="g6d">${(Math.abs(y1 - y0) / 40).toFixed(1)} ซม.</text></g>`; });
  // angle arcs, numbers, values
  regs.forEach(r => { const c = X[r.i].p, on = arcs.includes(r.k), col = G6COL[hl[r.k]] || '#E5487A';
    if (on) { if (Math.abs(r.v - 90) < .6) { const p1 = g6pt(c, 16, r.a1), p2 = g6pt(c, 16, r.a2), p3 = g6pt(c, 16 * Math.SQRT2, (r.a1 + r.a2) / 2); s += `<path d="M${p1[0]} ${p1[1]} L${p3[0]} ${p3[1]} L${p2[0]} ${p2[1]}" fill="none" stroke="${col}" stroke-width="2.4"/>`; }
      else { const rr = 24 + (r.k % 2) * 4, p1 = g6pt(c, rr, r.a1), p2 = g6pt(c, rr, r.a2); s += `<path d="M${c[0]} ${c[1]} L${p1[0]} ${p1[1]} A${rr} ${rr} 0 0 0 ${p2[0]} ${p2[1]} Z" fill="${col}" fill-opacity="${hl[r.k] ? .28 : .12}" stroke="${col}" stroke-width="2.2"/>`; } }
    const m = (r.a1 + r.a2) / 2;
    if (o.nums) { const p = g6pt(c, 15, m); s += `<text x="${p[0]}" y="${p[1] + 4.5}" text-anchor="middle" class="g6n${hl[r.k] ? ' on' : ''}">${r.k}</text>`; }
    if (vals[r.k] != null) { const p = g6pt(c, 50, m), t = vals[r.k] === true ? `${Math.round(r.v)}°` : vals[r.k]; s += `<g transform="translate(${p[0]} ${p[1]})"><rect x="${-t.length * 5 - 6}" y="-13" width="${t.length * 10 + 12}" height="24" rx="8" fill="#fff" stroke="${col}" stroke-width="1.6"/><text y="5" text-anchor="middle" class="g6v" fill="${col}">${t}</text></g>`; } });
  (o.pn || []).forEach((n, i) => { if (!n || !X[i]) return; const p = X[i].p; s += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#2B2550"/><text x="${p[0] - 20}" y="${p[1] + 20}" class="g6l">${n}</text>`; });
  return s + '</svg>';
}
/* simple point/segment figure: { pts:{name:[x,y]}, segs:[['A','B'], …], right:[['A','B','C']] (right angle at B), par:[['A','B'],…], vb } */
function segFig(o) {
  const P = o.pts; let s = `<svg viewBox="${o.vb || '0 0 300 200'}" class="g6-svg sm" aria-hidden="true">`;
  (o.segs || []).forEach(([a, b]) => s += `<path d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}" stroke="#2B2550" stroke-width="2.6"/>`);
  (o.right || []).forEach(([a, b, c]) => { const v = (p, q) => { const dx = P[q][0] - P[p][0], dy = P[q][1] - P[p][1], l = Math.hypot(dx, dy); return [dx / l * 11, dy / l * 11]; }, u1 = v(b, a), u2 = v(b, c), B = P[b];
    s += `<path d="M${B[0] + u1[0]} ${B[1] + u1[1]} l${u2[0]} ${u2[1]} l${-u1[0]} ${-u1[1]}" fill="none" stroke="#2B2550" stroke-width="1.6"/>`; });
  (o.par || []).forEach(([a, b]) => { const m = [(P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2], dx = P[b][0] - P[a][0], dy = P[b][1] - P[a][1], l = Math.hypot(dx, dy), d = [dx / l, dy / l], n = [-d[1], d[0]];
    s += `<path d="M${m[0] - d[0] * 6 + n[0] * 5} ${m[1] - d[1] * 6 + n[1] * 5} L${m[0]} ${m[1]} L${m[0] - d[0] * 6 - n[0] * 5} ${m[1] - d[1] * 6 - n[1] * 5}" fill="none" stroke="#E5487A" stroke-width="2.2"/>`; });
  Object.entries(P).forEach(([n, [x, y]]) => { if (n.startsWith('_')) return; s += `<circle cx="${x}" cy="${y}" r="3.4" fill="#2B2550"/><text x="${x + (o.lab && o.lab[n] ? o.lab[n][0] : -6)}" y="${y + (o.lab && o.lab[n] ? o.lab[n][1] : -9)}" class="g6l">${n}</text>`; });
  return s + '</svg>';
}
/* angle relations (2 lines, numbering 1 2 / 3 4 on the first line, 5 6 / 7 8 on the second) */
const G6_INT = [3, 4, 5, 6], G6_GRP = k => [2, 3, 6, 7].includes(k) ? 'A' : 'B';
const G6_REL = { alt: [[3, 6], [4, 5]], altx: [[1, 8], [2, 7]], side: [[3, 5], [4, 6]], sidex: [[1, 7], [2, 8]], corr: [[1, 5], [2, 6], [3, 7], [4, 8]], vert: [[1, 4], [2, 3], [5, 8], [6, 7]] };
const G6_NAME = { alt: 'มุมแย้ง', altx: 'มุมแย้งภายนอก', side: 'มุมภายในที่อยู่บนข้างเดียวกันของเส้นตัด', sidex: 'มุมภายนอกที่อยู่บนข้างเดียวกันของเส้นตัด', corr: 'มุมภายนอกและมุมภายในที่อยู่ตรงข้ามบนข้างเดียวกัน', vert: 'มุมตรงข้าม' };
const g6rel = (a, b) => Object.keys(G6_REL).find(k => G6_REL[k].some(([x, y]) => (x === a && y === b) || (x === b && y === a)));
const g6partner = (k, rel) => { const p = G6_REL[rel].find(pr => pr.includes(k)); return p ? p[0] === k ? p[1] : p[0] : null; };

/* draggable figure: drag the purple handle (transversal) or the blue handle (second line) */
function dragFig(state, render, o = {}) {
  const box = h('div', { class: 'g6-fig ia' }); let drag = null;
  const draw = () => { box.innerHTML = transFig({ ...state, ...render(state) }); };
  const pt = e => { const sv = box.firstChild, r = sv.getBoundingClientRect(), W = state.W || 600, H = state.H || 330; return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  box.addEventListener('pointerdown', e => { const hd = e.target.closest('.g6h'); if (!hd) return; e.preventDefault(); drag = hd.dataset.h; try { box.setPointerCapture(e.pointerId); } catch (_) {} sfx.tap(); });
  box.addEventListener('pointermove', e => { if (!drag) return; const [x, y] = pt(e), G = transGeom(state);
    if (drag === 't') { const c = G.X[0].p; let a = Math.atan2(c[1] - y, x - c[0]) * 180 / Math.PI; if (a < 0) a += 180; state.phi = Math.max(o.minPhi || 25, Math.min(o.maxPhi || 155, Math.round(a))); }
    else { const i = +drag.slice(1), c = [((state.W || 600) / 2), state.lines[i].y]; let a = Math.atan2(c[1] - y, x - c[0]) * 180 / Math.PI; a = Math.max(-18, Math.min(18, Math.round(a))); if (Math.abs(a) <= 1) a = 0; state.lines[i].t = a; }
    draw(); o.onChange && o.onChange(state); });
  const up = () => { if (drag) sfx.pop(3); drag = null; }; box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  box.draw = draw; draw(); return box;
}
const g6step = (lab, get, set, lo, hi, after) => stepper(lab, get, set, () => lo, () => hi, after);

/* =========================================================
   TEACHING SIMULATIONS
   ========================================================= */
/* perpendicular: rotate a line across another, watch the 4 angles */
function simPerp() {
  const st = { lines: [{ y: 175, t: 0 }], phi: 60, x0: 300, H: 330, names: [['A', 'B']], tn: ['C', 'D'], handle: true };
  const big = h('div', { class: 'fbig g6big' }), out = fNote();
  const fig = dragFig(st, s => ({ arcs: [1, 2, 3, 4], vals: { 1: true, 2: true, 3: true, 4: true }, hl: s.phi === 90 ? { 1: 'c', 2: 'c', 3: 'c', 4: 'c' } : { 2: 'a', 3: 'a', 1: 'b', 4: 'b' } }), { onChange: () => { info(); syncAll(); } });
  const info = () => { const p = st.phi; big.innerHTML = p === 90 ? '<b class="g6ok">AB ⊥ CD</b> (ตั้งฉากกัน)' : `มุมที่เกิดขึ้น ${p}° และ ${180 - p}°`;
    out.innerHTML = p === 90 ? 'มุมทั้ง 4 มุมเป็น<b>มุมฉาก (90°)</b> → เส้นตรงสองเส้น<b>ตั้งฉากกัน</b> เขียน AB ⊥ CD' : `ยังไม่ตั้งฉาก — มุมคู่ที่อยู่ติดกันรวมกันได้ 180° (${p} + ${180 - p}) ลาก<b>จุดสีม่วง</b>ให้ได้ 90°`; };
  const sp = g6step('มุม (องศา)', () => st.phi, x => st.phi = x, 25, 155, () => { fig.draw(); info(); });
  const syncAll = () => sp.sync(); info();
  return h('div', { class: 'colstack' }, big, fig, sp, out);
}
/* parallel lines: tilt the second line, compare distances at three places */
function simParLines() {
  const st = { lines: [{ y: 110, t: 0 }, { y: 230, t: 7 }], phi: 90, noTrans: true, names: [['A', 'B'], ['C', 'D']], handle: 'both', dist: [-200, 0, 200] };
  const big = h('div', { class: 'fbig g6big' }), out = fNote();
  const fig = dragFig(st, s => ({ par: s.lines[1].t === 0 }), { onChange: () => { info(); syncAll(); } });
  const info = () => { const t = st.lines[1].t; big.innerHTML = t === 0 ? '<b class="g6ok">AB // CD</b> (ขนานกัน)' : 'AB กับ CD <b>ไม่ขนานกัน</b>';
    out.innerHTML = t === 0 ? 'ระยะห่างทุกที่<b>เท่ากัน</b> → ลากต่อออกไปเท่าไรก็<b>ไม่ตัดกัน</b> = เส้นขนาน (สัญลักษณ์ //) · ระยะห่างวัดตาม<b>แนวตั้งฉาก</b>' : 'ระยะห่างแต่ละที่<b>ไม่เท่ากัน</b> ถ้าลากต่อออกไปจะตัดกัน — ลาก<b>จุดสีฟ้า</b>ให้ระยะห่างเท่ากันทุกที่'; };
  const sp = g6step('เอียงเส้น CD', () => st.lines[1].t, x => st.lines[1].t = x, -15, 15, () => { fig.draw(); info(); });
  const syncAll = () => sp.sync(); info();
  return h('div', { class: 'colstack' }, big, fig, sp, out);
}
/* the 8 angles: highlight groups, tap an angle to read its name */
function simAngles8(groups = ['int', 'ext', 'alt', 'side']) {
  const st = { lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi: 62, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], nums: true, tap: true };
  let hl = {}; const box = h('div', { class: 'g6-fig ia' }), out = fNote();
  const draw = () => { box.innerHTML = transFig({ ...st, hl, arcs: Object.keys(hl).map(Number) }); };
  const G = { int: ['มุมภายใน', () => { hl = {}; G6_INT.forEach(k => hl[k] = 'b'); return 'มุม 3 4 5 6 อยู่<b>ระหว่าง</b>เส้น AB กับ CD = <b>มุมภายใน</b>'; }],
    ext: ['มุมภายนอก', () => { hl = {}; [1, 2, 7, 8].forEach(k => hl[k] = 'd'); return 'มุม 1 2 7 8 อยู่<b>นอก</b>เส้นคู่นั้น = <b>มุมภายนอก</b>'; }],
    alt: ['มุมแย้ง', () => { hl = { 3: 'a', 6: 'a', 4: 'c', 5: 'c' }; return '<b>มุมแย้ง</b> = มุมภายในที่อยู่<b>คนละข้าง</b>ของเส้นตัด และอยู่คนละเส้น (รูปตัว Z): <b>3 กับ 6</b> · <b>4 กับ 5</b>'; }],
    side: ['มุมภายในบนข้างเดียวกัน', () => { hl = { 3: 'a', 5: 'a', 4: 'c', 6: 'c' }; return '<b>มุมภายในที่อยู่บนข้างเดียวกันของเส้นตัด</b> (รูปตัว C/U): <b>3 กับ 5</b> · <b>4 กับ 6</b>'; }],
    corr: ['มุมภายนอก-ภายในตรงข้าม', () => { hl = { 1: 'a', 5: 'a', 4: 'c', 8: 'c' }; return '<b>มุมภายนอกและมุมภายในที่อยู่ตรงข้ามบนข้างเดียวกันของเส้นตัด</b> (รูปตัว F): 1 กับ 5 · 4 กับ 8'; }] };
  box.addEventListener('click', e => { const w = e.target.closest('.g6w'); if (!w) return; e.stopPropagation(); const k = +w.dataset.k, nm = G6_INT.includes(k) ? 'มุมภายใน' : 'มุมภายนอก', a = g6partner(k, 'alt'), s2 = g6partner(k, 'side');
    hl = { [k]: 'a' }; if (a) hl[a] = 'c'; if (s2) hl[s2] = 'b'; draw(); sfx.pop(k);
    out.innerHTML = `มุม ${k} เป็น<b>${nm}</b>` + (a ? ` · มุมแย้งของมุม ${k} คือ <b style="color:${G6COL.c}">มุม ${a}</b> · มุมภายในบนข้างเดียวกันคือ <b style="color:${G6COL.b}">มุม ${s2}</b>` : ` · มุมตรงข้ามของมุม ${k} คือมุม ${g6partner(k, 'vert')}`); });
  const btns = h('div', { class: 'rowstack' }, ...groups.map(g => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); out.innerHTML = G[g][1](); draw(); sfx.page(); } }, G[g][0])));
  draw(); out.innerHTML = 'เส้น EF <b>ตัดขวาง</b>เส้น AB และ CD เกิดมุม <b>8 มุม</b> · กดปุ่มดูกลุ่มมุม หรือ<b>แตะมุม</b>ที่อยากรู้';
  return h('div', { class: 'colstack' }, box, btns, out);
}
/* property sim: drag until parallel; watch interior same-side sum or alternate angles */
function simProp(kind = 'side') {
  const st = { lines: [{ y: 110, t: 0 }, { y: 225, t: -8 }], phi: 64, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], handle: 'both' };
  const pair = kind === 'side' ? [3, 5] : [3, 6], pair2 = kind === 'side' ? [4, 6] : [4, 5], big = h('div', { class: 'fbig g6big' }), out = fNote();
  const fig = dragFig(st, s => ({ hl: { [pair[0]]: 'a', [pair[1]]: 'a', [pair2[0]]: 'c', [pair2[1]]: 'c' }, vals: { [pair[0]]: true, [pair[1]]: true, [pair2[0]]: true, [pair2[1]]: true }, par: s.lines[1].t === 0 }), { onChange: () => { info(); syncAll(); } });
  const info = () => { const R = transGeom(st).regs, v = k => Math.round(R[k - 1].v), par = st.lines[1].t === 0;
    big.innerHTML = kind === 'side' ? `∠${pair[0]} + ∠${pair[1]} = ${v(pair[0])}° + ${v(pair[1])}° = <b class="${v(pair[0]) + v(pair[1]) === 180 ? 'g6ok' : ''}">${v(pair[0]) + v(pair[1])}°</b>` : `∠${pair[0]} = ${v(pair[0])}° · ∠${pair[1]} = ${v(pair[1])}° ${v(pair[0]) === v(pair[1]) ? '<b class="g6ok">เท่ากัน</b>' : '(ไม่เท่ากัน)'}`;
    out.innerHTML = par ? (kind === 'side' ? '<b>AB // CD</b> → มุมภายในที่อยู่บนข้างเดียวกันของเส้นตัด<b>รวมกันได้ 180°</b> เสมอ (ลองลากเส้นตัดดู ผลรวมยังเป็น 180°)' : '<b>AB // CD</b> → <b>มุมแย้งมีขนาดเท่ากัน</b> เสมอ (ลองลากเส้นตัดดู มุมแย้งยังเท่ากัน)') : 'AB กับ CD ยังไม่ขนานกัน — ลาก<b>จุดสีฟ้า</b>หรือกดปรับ จนเส้นขนานกัน แล้วสังเกตมุม'; };
  const sp = g6step('เอียงเส้น CD', () => st.lines[1].t, x => st.lines[1].t = x, -15, 15, () => { fig.draw(); info(); }), sp2 = g6step('มุมเส้นตัด', () => st.phi, x => st.phi = x, 35, 145, () => { fig.draw(); info(); });
  const syncAll = () => { sp.sync(); sp2.sync(); }; info();
  return h('div', { class: 'colstack' }, big, fig, h('div', { class: 'rowstack' }, sp, sp2), out);
}
/* a construction drawn one step at a time */
function simLayers(base, steps, final) {
  const fig = h('div', { class: 'g6-fig' }), list = h('div', { class: 'colstack fstory' }), out = fNote(); let k = 0;
  const draw = () => { fig.innerHTML = `<svg viewBox="0 0 600 300" class="g6-svg" aria-hidden="true"><defs><marker id="g6ar2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9 Z" fill="#2B2550"/></marker></defs>${base}${steps.slice(0, k).map((s, i) => `<g class="g6lay${i === k - 1 ? ' new' : ''}">${s[2]}</g>`).join('')}</svg>`; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, body] = steps[k]; k++; list.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: body }))); draw(); sfx.pop(k);
    if (k >= steps.length) { btn.remove(); out.innerHTML = final || ''; sfx.ok(); } } }, icon('right'), 'ขั้นต่อไป');
  draw(); return h('div', { class: 'gside' }, fig, h('div', { class: 'colstack gside-r' }, list, btn, out));
}
const L6 = (x1, y1, x2, y2, c = '#2B2550', w = 3, extra = '') => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="${w}" ${extra}/>`;
const T6 = (x, y, t, c = '#2B2550') => `<text x="${x}" y="${y}" class="g6l" fill="${c}">${t}</text>`;
const P6 = (x, y, t) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#E5487A"/>${T6(x + 8, y - 8, t)}`;
const SQ6 = (x, y, w, hh) => `<path d="M${x} ${y} l${w} 0 l0 ${hh}" fill="none" stroke="#7E6ED6" stroke-width="2"/>`;
const ARR = 'marker-start="url(#g6ar2)" marker-end="url(#g6ar2)"';
const PERP_BASE = L6(40, 220, 560, 220, '#2B2550', 3, ARR) + T6(44, 210, 'A') + T6(546, 210, 'B') + P6(300, 220, 'P');
const PERP_STEPS = [['① วางไม้ฉาก', 'วางขอบไม้ฉากด้านหนึ่งให้ทับเส้น AB และให้มุมฉากอยู่ที่จุด P', `<path d="M300 220 L300 90 L430 220 Z" fill="#B9A6F5" fill-opacity=".35" stroke="#7E6ED6" stroke-width="2.5"/>${SQ6(300, 206, 14, 14).replace('l14 0 l0 14', 'l14 0 l0 14')}`],
  ['② ลากเส้น', 'ลากเส้นตามขอบตั้งของไม้ฉากผ่านจุด P', L6(300, 220, 300, 50, '#E5487A', 3.4)],
  ['③ ตั้งชื่อ', 'ได้เส้น PQ ตั้งฉากกับ AB เขียน PQ ⊥ AB', `${T6(308, 62, 'Q')}<path d="M300 206 h14 v14" fill="none" stroke="#1B8862" stroke-width="2.6"/>`]];
const PERP_STEPS2 = [['① วางไม้โปรแทรกเตอร์', 'วางจุดศูนย์กลางของไม้โปรแทรกเตอร์ที่จุด P เส้นฐานทับ AB', `<path d="M180 220 A120 120 0 0 1 420 220 Z" fill="#FFE7A3" fill-opacity=".55" stroke="#C98612" stroke-width="2"/>${[0, 30, 60, 90, 120, 150, 180].map(a => { const x = 300 + Math.cos(g6r(a)) * 120, y = 220 - Math.sin(g6r(a)) * 120, x2 = 300 + Math.cos(g6r(a)) * 104, y2 = 220 - Math.sin(g6r(a)) * 104; return L6(x, y, x2, y2, '#C98612', 2) + `<text x="${300 + Math.cos(g6r(a)) * 92}" y="${224 - Math.sin(g6r(a)) * 92}" text-anchor="middle" class="g6d">${a}</text>`; }).join('')}`],
  ['② ทำจุดที่ 90°', 'ทำจุด Q ตรงขีด 90°', P6(300, 100, 'Q')], ['③ ลากเส้น', 'ลากเส้นผ่าน P กับ Q ได้ PQ ⊥ AB', `${L6(300, 230, 300, 40, '#E5487A', 3.4)}<path d="M300 206 h14 v14" fill="none" stroke="#1B8862" stroke-width="2.6"/>`]];
const PAR_BASE = L6(40, 230, 560, 230, '#2B2550', 3, ARR) + T6(44, 220, 'พ') + T6(546, 220, 'ฟ') + P6(200, 110, 'ผ');
const PAR_STEPS = [['① วัดระยะที่จุด ผ', 'ใช้ไม้ฉากวัดระยะตั้งฉากจากเส้น พฟ ถึงจุด ผ ได้ <b>3 ซม.</b>', `${L6(200, 110, 200, 230, '#E5487A', 2.4, 'stroke-dasharray="6 5"')}${SQ6(200, 216, 14, 14)}${T6(208, 175, '3 ซม.', '#E5487A')}`],
  ['② วัดระยะเท่ากันอีกที่', 'เลื่อนไม้ฉากไปทางขวา วัดระยะ <b>3 ซม.</b> เท่ากัน แล้วทำจุด ฝ', `${L6(430, 110, 430, 230, '#E5487A', 2.4, 'stroke-dasharray="6 5"')}${SQ6(430, 216, 14, 14)}${T6(438, 175, '3 ซม.', '#E5487A')}${P6(430, 110, 'ฝ')}`],
  ['③ ลากเส้นผ่าน ผ และ ฝ', 'ได้ ผฝ // พฟ เพราะระยะห่างเท่ากันทุกที่', `${L6(40, 110, 560, 110, '#1B8862', 3.4, ARR)}<path d="M330 104 l8 6 l-8 6 M330 224 l8 6 l-8 6" fill="none" stroke="#E5487A" stroke-width="2.4"/>`]];
const ANG_BASE = L6(40, 230, 560, 230, '#2B2550', 3, ARR) + T6(44, 220, 'A') + T6(546, 220, 'B') + P6(330, 90, 'P');
const ANG_STEPS = [['① ลากเส้นตัด', 'ลากเส้นผ่านจุด P ตัด AB ที่จุด Q', `${L6(372, 30, 230, 290, '#7E6ED6', 3)}${T6(268, 252, 'Q')}`],
  ['② วัดมุมที่ Q', 'วัดขนาดของมุม PQB ได้ <b>61°</b>', `<path d="M297 230 L327 230 A30 30 0 0 0 312 204 Z" fill="#E5487A" fill-opacity=".25" stroke="#E5487A" stroke-width="2"/>${T6(328, 218, '61°', '#E5487A')}`],
  ['③ สร้างมุมแย้งที่ P', 'ที่จุด P สร้างมุมขนาด <b>61°</b> ให้อยู่<b>คนละข้าง</b>ของเส้นตัด (มุมแย้ง)', `<path d="M330 90 L300 90 A30 30 0 0 0 315 116 Z" fill="#1B8862" fill-opacity=".25" stroke="#1B8862" stroke-width="2"/>${T6(262, 112, '61°', '#1B8862')}`],
  ['④ ลากเส้นผ่าน P', 'ลากเส้นต่อจากด้านของมุมผ่าน P ได้เส้นที่<b>ขนาน</b>กับ AB (มุมแย้งเท่ากัน)', L6(40, 90, 560, 90, '#1B8862', 3.4, ARR)]];

/* =========================================================
   QUESTION TYPES (prefix l…)
   ========================================================= */
const G6_VALS = [52, 73, 85, 106, 96, 75, 65, 109, 123, 105, 131, 60, 45, 55, 95, 84, 68, 100, 53, 118, 127, 140, 38];
const g6phiFor = (k, v) => G6_GRP(k) === 'A' ? v : 180 - v;
Object.assign(Q, {
  /* tap the angle that has the asked relation with angle k */
  lTap({ k, rel }) {
    const st = { lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi: pick([58, 64, 118, 124]), names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], nums: true, tap: true }, right = g6partner(k, rel);
    return { prompt: `แตะมุมที่เป็น<span class="hl">${G6_NAME[rel]}</span>กับมุม ${k}`, say: `แตะมุมที่เป็น${G6_NAME[rel]}กับมุม ${k}`,
      mount(bd, ctx) { const box = h('div', { class: 'g6-fig ia' }); let done = false; const draw = (hl = { [k]: 'a' }) => box.innerHTML = transFig({ ...st, hl, arcs: Object.keys(hl).map(Number) }); draw();
        box.addEventListener('click', e => { const w = e.target.closest('.g6w'); if (!w || done) return; e.stopPropagation(); const j = +w.dataset.k; if (j === k) return;
          if (j === right) { done = true; draw({ [k]: 'a', [j]: 'c' }); ctx.check(true); } else { draw({ [k]: 'a', [j]: 'd' }); ctx.check(false, rel === 'alt' ? 'มุมแย้ง: มุมภายใน คนละข้างของเส้นตัด คนละเส้น (รูปตัว Z)' : rel === 'side' ? 'มุมภายในบนข้างเดียวกัน: มุมภายใน ข้างเดียวกันของเส้นตัด คนละเส้น (รูปตัว C)' : rel === 'vert' ? 'มุมตรงข้าม: อยู่ที่จุดตัดเดียวกัน หันหน้าเข้าหากัน' : 'มุมภายนอกบนข้างเดียวกัน: อยู่นอกเส้นคู่นั้น ข้างเดียวกันของเส้นตัด'); setTimeout(() => !done && draw(), 900); } });
        bd.append(h('div', { class: 'colstack' }, box, h('div', { class: 'cap' }, 'แตะที่มุมในรูป'))); } };
  },
  /* name the relation of a highlighted pair */
  lName({ a, b }) {
    const rel = g6rel(a, b), st = { lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi: pick([60, 66, 116, 122]), nums: true, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'] }, right = G6_NAME[rel];
    const opts = shuffle([right, ...shuffle(['alt', 'side', 'sidex', 'vert'].filter(x => x !== rel)).slice(0, 2).map(x => G6_NAME[x])]);
    return { prompt: `มุม ${a} กับมุม ${b} เป็นมุมชนิดใด`, say: `มุม ${a} กับมุม ${b} เป็นมุมชนิดใด`,
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'g6-fig', html: transFig({ ...st, hl: { [a]: 'a', [b]: 'c' } }) }), choices(ctx, opts.map(x => ({ value: x, label: x })), right, { hint: 'ดูว่าเป็นมุมภายในหรือภายนอก แล้วดูว่าอยู่ข้างเดียวกันหรือคนละข้างของเส้นตัด' }))); bd.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); } };
  },
  /* interior or exterior? */
  lCls({ k }) {
    const right = G6_INT.includes(k) ? 'มุมภายใน' : 'มุมภายนอก', st = { lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi: pick([60, 120]), nums: true, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'] };
    return { prompt: `มุม ${k} เป็นมุมภายในหรือมุมภายนอก`, say: `มุม ${k} เป็นมุมภายในหรือมุมภายนอก`,
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'g6-fig', html: transFig({ ...st, hl: { [k]: 'a' } }) }), choices(ctx, ['มุมภายใน', 'มุมภายนอก'].map(x => ({ value: x, label: x })), right, { hint: 'มุมภายในอยู่ระหว่างเส้น AB กับ CD' }))); bd.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); } };
  },
  /* find x with parallel lines */
  lFind({ k, v, j }) {
    const phi = g6phiFor(k, v), ans = G6_GRP(k) === G6_GRP(j) ? v : 180 - v, rel = g6rel(k, j);
    const st = { lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], par: true, hl: { [k]: 'a', [j]: 'c' }, vals: { [k]: `${v}°`, [j]: 'x' } };
    const hint = rel === 'side' ? 'มุมภายในที่อยู่บนข้างเดียวกันของเส้นตัด รวมกันได้ 180°' : rel === 'alt' ? 'มุมแย้งมีขนาดเท่ากัน' : rel === 'vert' ? 'มุมตรงข้ามมีขนาดเท่ากัน' : rel === 'corr' ? 'มุมภายนอกและมุมภายในที่อยู่ตรงข้ามบนข้างเดียวกันมีขนาดเท่ากัน' : ans === v ? 'สองมุมนี้มีขนาดเท่ากัน' : 'มุมที่อยู่บนเส้นตรงเดียวกันรวมกันได้ 180°';
    return { prompt: `AB // CD จงหาค่าของ x`, say: 'เอบีขนานกับซีดี จงหาค่าของเอ็กซ์',
      mount(bd, ctx) { const f = h('div', { class: 'g6-fig', html: transFig(st) }); bd.append(h('div', { class: 'rowstack' }, f, decAnswer(ctx, Rr(ans), { hint, unit: 'องศา' })));
        ctx.onRight = () => { f.innerHTML = transFig({ ...st, vals: { [k]: `${v}°`, [j]: `x = ${ans}°` } }); }; } };
  },
  /* are the lines parallel? */
  lIsPar({ a, va, b, vb }) {
    const rel = g6rel(a, b), par = rel === 'side' ? va + vb === 180 : va === vb, tau = rel === 'side' ? va + vb - 180 : va - vb;
    const st = { lines: [{ y: 110, t: 0 }, { y: 220, t: Math.max(-15, Math.min(15, tau)) }], phi: g6phiFor(a, va), names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], hl: { [a]: 'a', [b]: 'c' }, vals: { [a]: `${va}°`, [b]: `${vb}°` } };
    const right = par ? 'AB ขนานกับ CD' : 'AB ไม่ขนานกับ CD';
    return { prompt: 'จากขนาดของมุม เส้น AB กับ CD ขนานกันหรือไม่', say: 'จากขนาดของมุม เส้นเอบีกับซีดีขนานกันหรือไม่',
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'g6-fig', html: transFig(st) }), choices(ctx, ['AB ขนานกับ CD', 'AB ไม่ขนานกับ CD'].map(x => ({ value: x, label: x })), right, { hint: rel === 'side' ? `มุมภายในบนข้างเดียวกัน: ${va} + ${vb} = ${va + vb} ต้องได้ 180 จึงขนาน` : `มุมแย้ง ${va}° กับ ${vb}° ต้องเท่ากันจึงขนาน` }))); bd.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); } };
  },
  /* pick a figure */
  lFig({ q, figs, right, hint }) {
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { const ch = choices(ctx, figs.map((f, i) => ({ value: i, node: h('div', { class: 'g6-opt', html: f }) })), right, { hint }); ch.classList.add('g6-opts'); bd.append(ch); } };
  }
});
/* small figures */
const twoSeg = (a, b, la, lb) => segFig({ vb: '0 0 220 130', pts: { [la[0]]: a[0], [la[1]]: a[1], [lb[0]]: b[0], [lb[1]]: b[1] }, segs: [la, lb] });
const perpOpt = (phi, val) => transFig({ W: 300, H: 220, lines: [{ y: 120, t: 0 }], phi, x0: 150, len: 120, vals: { 2: `${val}°` }, arcs: [2], hl: { 2: 'a' }, noArrow: true });
const parOpt = (t, vals) => transFig({ W: 320, H: 220, lines: [{ y: 70, t: 0 }, { y: 160, t }], phi: vals.phi, len: 140, noArrow: true, vals: vals.v, hl: Object.fromEntries(Object.keys(vals.v).map(k => [k, 'a'])) });
const PAR_COUNT = [['รูปสี่เหลี่ยมผืนผ้า', 2], ['รูปสามเหลี่ยม', 0], ['รูปสี่เหลี่ยมคางหมู', 1], ['รูปสี่เหลี่ยมด้านขนาน', 2], ['รูปหกเหลี่ยมด้านเท่า', 3], ['รูปสี่เหลี่ยมรูปว่าว', 0]];
const shapeFig = n => n === 'รูปสี่เหลี่ยมผืนผ้า' ? segFig({ vb: '0 0 240 160', pts: { A: [30, 30], B: [210, 30], C: [210, 130], D: [30, 130] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], right: [['D', 'A', 'B'], ['A', 'B', 'C'], ['B', 'C', 'D'], ['C', 'D', 'A']], lab: { C: [6, 16], D: [-14, 16] } })
  : n === 'รูปสามเหลี่ยม' ? segFig({ vb: '0 0 240 160', pts: { A: [120, 22], B: [30, 135], C: [215, 135] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'A']], lab: { B: [-14, 16], C: [6, 16] } })
  : n === 'รูปสี่เหลี่ยมคางหมู' ? segFig({ vb: '0 0 240 160', pts: { A: [70, 30], B: [170, 30], C: [215, 130], D: [25, 130] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], lab: { C: [6, 16], D: [-14, 16] } })
  : n === 'รูปสี่เหลี่ยมด้านขนาน' ? segFig({ vb: '0 0 240 160', pts: { A: [70, 30], B: [215, 30], C: [170, 130], D: [25, 130] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], lab: { C: [6, 16], D: [-14, 16] } })
  : n === 'รูปหกเหลี่ยมด้านเท่า' ? segFig({ vb: '0 0 240 170', pts: { A: [80, 20], B: [160, 20], C: [200, 85], D: [160, 150], E: [80, 150], F: [40, 85] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['F', 'A']], lab: { C: [8, 4], D: [6, 16], E: [-14, 16], F: [-18, 4] } })
  : segFig({ vb: '0 0 240 170', pts: { A: [120, 15], B: [190, 70], C: [120, 160], D: [50, 70] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], lab: { B: [8, 4], C: [6, 16], D: [-18, 4] } });

const L5G = (no, vno, place, title, short, goal, teach, game) => ({ id: 620 + no, place, title, short, tone: TONES5[(no + 5) % 6], goal, teach, game });
const G6PAIRS = rel => G6_REL[rel].flatMap(([a, b]) => [[a, b], [b, a]]);
const LESSONS_P5C6 = [
  L5G(1, 21, 'ถ้ำมุมฉาก', 'เส้นตั้งฉากและการสร้างเส้นตั้งฉาก', 'เส้นตั้งฉาก', 'บอกได้ว่าเส้นตรงคู่ใดตั้งฉากกัน ใช้สัญลักษณ์ ⊥ และสร้างเส้นตั้งฉากด้วยไม้ฉากหรือไม้โปรแทรกเตอร์', [
    T('ยินดีต้อนรับสู่ <b>ถ้ำเส้นขนาน</b>! ลาก<b>จุดสีม่วง</b>หมุนเส้น CD — เมื่อทุกมุมเป็น <b>90°</b> เส้นทั้งสองจะ<b>ตั้งฉากกัน</b>', 'ยินดีต้อนรับสู่ถ้ำเส้นขนาน ลากจุดสีม่วงหมุนเส้น เมื่อทุกมุมเป็นเก้าสิบองศา เส้นทั้งสองจะตั้งฉากกัน', el => el.append(simPerp())),
    T('สร้างเส้นตั้งฉากด้วย<b>ไม้ฉาก</b> — กดทีละขั้น', 'สร้างเส้นตั้งฉากด้วยไม้ฉาก กดทีละขั้น', el => el.append(simLayers(PERP_BASE, PERP_STEPS, 'มุมที่เกิดขึ้นทั้ง 4 มุมเป็นมุมฉาก'))),
    T('อีกวิธี: ใช้<b>ไม้โปรแทรกเตอร์</b> วัดมุม 90°', 'อีกวิธี ใช้ไม้โปรแทรกเตอร์วัดมุมเก้าสิบองศา', el => el.append(simLayers(PERP_BASE, PERP_STEPS2, 'PQ ⊥ AB')))],
    () => { const ord = shuffle([90, 70, 110]); return [Q.lFig({ q: 'รูปใดแสดง<span class="hl">เส้นตั้งฉาก</span>', figs: ord.map(p => perpOpt(p, p)), right: ord.indexOf(90), hint: 'เส้นตั้งฉากทำมุม 90°' }),
      Q.dPick({ q: 'เส้นตรงสองเส้นที่<b>ตั้งฉาก</b>กัน ทำมุมกันกี่องศา', opts: ['90 องศา', '180 องศา', '45 องศา'], right: '90 องศา' }),
      Q.dPick({ q: 'สัญลักษณ์ “AB ⊥ CD” อ่านว่าอย่างไร', opts: ['AB ตั้งฉากกับ CD', 'AB ขนานกับ CD', 'AB ยาวเท่ากับ CD'], right: 'AB ตั้งฉากกับ CD' }),
      Q.dPick({ q: 'ถ้า AB ⊥ CD ที่จุด O มุมที่เกิดขึ้นที่จุด O มีกี่มุมที่เป็นมุมฉาก', opts: ['4 มุม', '2 มุม', '1 มุม'], right: '4 มุม', hint: 'เส้นตั้งฉากทำให้เกิดมุมฉาก 4 มุม' }),
      Q.dPick({ q: 'เครื่องมือใด<b>ไม่ใช้</b>ในการสร้างเส้นตั้งฉาก', opts: ['วงเวียนอย่างเดียว ไม่มีไม้บรรทัด', 'ไม้ฉาก', 'ไม้โปรแทรกเตอร์และไม้บรรทัด'], right: 'วงเวียนอย่างเดียว ไม่มีไม้บรรทัด' }),
      Q.dFill({ q: 'เส้นตรงตัดกัน ทำมุมหนึ่ง 90° อีกมุมที่อยู่ติดกันมีขนาด ☐ องศา', a: '90', hint: 'มุมที่อยู่ติดกันบนเส้นตรงรวมกันได้ 180°' }),
      Q.dPick({ q: 'ถ้าเส้นตรง PQ ตั้งฉากกับเส้นตรง RS เขียนแทนด้วยสัญลักษณ์อย่างไร', opts: ['PQ ⊥ RS', 'PQ ∥ RS', 'PQ = RS'], right: 'PQ ⊥ RS' }),
      Q.dPick({ q: 'สร้างเส้นตั้งฉากด้วย<b>ไม้ฉาก</b> ต้องวางไม้ฉากอย่างไร', opts: ['วางขอบหนึ่งทับเส้นตรงเดิม แล้วลากเส้นตามอีกขอบหนึ่ง', 'วางมุมแหลมของไม้ฉากที่จุดใดก็ได้', 'วางไม้ฉากเอียงทำมุม 45° กับเส้นเดิม'], right: 'วางขอบหนึ่งทับเส้นตรงเดิม แล้วลากเส้นตามอีกขอบหนึ่ง' })]; } /* v134: ≥ 8 ข้อ */),
  L5G(2, 22, 'ถ้ำเส้นคู่', 'เส้นขนานและระยะห่างระหว่างเส้นขนาน', 'เส้นขนานและระยะห่าง', 'บอกได้ว่าเส้นตรงคู่ใดขนานกัน ใช้สัญลักษณ์ // และรู้ว่าระยะห่างระหว่างเส้นขนานเท่ากันเสมอ', [
    T('ลาก<b>จุดสีฟ้า</b>เอียงเส้น CD — ดูระยะห่าง 3 ที่ ถ้า<b>เท่ากันทุกที่</b> = ขนานกัน', 'ลากจุดสีฟ้าเอียงเส้นซีดี ดูระยะห่างสามที่ ถ้าเท่ากันทุกที่คือขนานกัน', el => el.append(simParLines())),
    T('ตัวอย่างในรูปเรขาคณิต: ด้านคู่ไหนขนานกัน — กดทีละขั้น', 'ตัวอย่างในรูปเรขาคณิต ด้านคู่ไหนขนานกัน', el => el.append(dcWalk('', [['สี่เหลี่ยมผืนผ้า', 'AB // DC และ AD // BC → <b>2 คู่</b>'], ['สี่เหลี่ยมคางหมู', 'มีด้านขนานกัน <b>1 คู่</b>'], ['สามเหลี่ยม', 'ไม่มีด้านใดขนานกัน (ทุกด้านตัดกัน)'], ['ระยะห่าง', 'วัดตาม<b>แนวตั้งฉาก</b> และยาวเท่ากันทุกที่']], `<div class="rowstack">${shapeFig('รูปสี่เหลี่ยมผืนผ้า')}${shapeFig('รูปสี่เหลี่ยมคางหมู')}</div>`)))],
    () => [Q.lFig({ q: 'ส่วนของเส้นตรงคู่ใด<span class="hl">ขนานกัน</span>', figs: [twoSeg([[30, 40], [190, 20]], [[30, 100], [190, 100]], 'กข', 'คง'), twoSeg([[30, 30], [190, 60]], [[30, 100], [190, 100]], 'จฉ', 'ชซ'), twoSeg([[30, 40], [190, 40]], [[30, 100], [190, 100]], 'ฌญ', 'ฎฏ')], right: 2, hint: 'ระยะห่างต้องเท่ากันทุกที่' }),
      ...pkF(PAR_COUNT, 3).map(([n, c]) => Q.dPick({ q: `<div class="g6-inl">${shapeFig(n)}</div>${n}มีด้านที่ขนานกันกี่คู่`, opts: ['0 คู่', '1 คู่', '2 คู่', '3 คู่'], right: `${c} คู่`, hint: 'ดูด้านที่หันไปทางเดียวกันและห่างเท่ากันตลอด' })),
      Q.dPick({ q: 'ข้อใด<b>ไม่ใช่</b>สมบัติของเส้นขนาน', opts: ['ความยาวของเส้นทั้งสองเท่ากัน', 'เส้นขนานทั้งสองไม่ตัดกัน', 'ระยะห่างระหว่างเส้นทั้งสองเท่ากันตลอด'], right: 'ความยาวของเส้นทั้งสองเท่ากัน' }),
      Q.dPick({ q: 'ถ้า AB // CD วัดระยะห่างที่จุดหนึ่งได้ 3 ซม. วัดที่จุดอื่นจะได้กี่ซม.', opts: ['3 ซม.', 'มากกว่า 3 ซม.', 'น้อยกว่า 3 ซม.'], right: '3 ซม.' })]),
  L5G(3, 23, 'ถ้ำแปดมุม', 'เส้นตัดขวางและมุมที่เกิดจากเส้นตัดขวางตัดเส้นตรงคู่หนึ่ง', 'เส้นตัดขวางและ 8 มุม', 'บอกเส้นตัดขวาง และบอกมุมภายใน มุมภายนอกที่เกิดจากเส้นตัดขวางตัดเส้นตรงคู่หนึ่ง', [
    T('เส้น EF <b>ตัดขวาง</b>เส้นตรงคู่หนึ่ง เกิด <b>8 มุม</b> — กดปุ่มดูมุมภายใน/ภายนอก หรือแตะมุม', 'เส้นอีเอฟตัดขวางเส้นตรงคู่หนึ่ง เกิดแปดมุม กดปุ่มดูมุมภายในภายนอก หรือแตะมุม', el => el.append(simAngles8(['int', 'ext']))),
    T('ตัวอย่างทีละขั้น: แยก<b>มุมภายใน</b>กับ<b>มุมภายนอก</b>', 'ตัวอย่างทีละขั้น แยกมุมภายในกับมุมภายนอก', el => el.append(dcWalk(transFig({ lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi: 116, nums: true, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], hl: { 3: 'b', 4: 'b', 5: 'b', 6: 'b' } }), [['① หาเส้นตัดขวาง', 'EF ตัดทั้ง AB และ CD'], ['② มุมภายใน', 'มุมที่อยู่ระหว่าง AB กับ CD: มุม 3, 4, 5, 6'], ['③ มุมภายนอก', 'มุมที่อยู่ด้านนอก: มุม 1, 2, 7, 8']], 'ทั้งหมด 8 มุม: ภายใน 4 มุม ภายนอก 4 มุม')))],
    () => [...pkF([1, 2, 3, 4, 5, 6, 7, 8], 4).map(k => Q.lCls({ k })), Q.dPick({ q: 'เส้นตรงเส้นหนึ่งตัดเส้นตรงคู่หนึ่ง เกิดมุมทั้งหมดกี่มุม', opts: ['8 มุม', '4 มุม', '6 มุม'], right: '8 มุม' }), Q.dPick({ q: 'มุมภายในมีกี่มุม', opts: ['4 มุม', '2 มุม', '8 มุม'], right: '4 มุม' })]),
  L5G(4, 24, 'ถ้ำมุมแย้ง', 'มุมแย้งและมุมภายในที่อยู่บนข้างเดียวกันของเส้นตัดขวาง', 'มุมแย้ง · มุมบนข้างเดียวกัน', 'บอกมุมแย้ง และมุมภายในที่อยู่บนข้างเดียวกันของเส้นตัดขวาง', [
    T('กดปุ่ม <b>มุมแย้ง</b> (รูปตัว Z) และ <b>มุมภายในบนข้างเดียวกัน</b> (รูปตัว C) — หรือแตะมุมดูคู่ของมัน', 'กดปุ่มมุมแย้ง รูปตัวแซด และมุมภายในบนข้างเดียวกัน รูปตัวซี หรือแตะมุมดูคู่ของมัน', el => el.append(simAngles8(['alt', 'side', 'corr']))),
    T('ตัวอย่างหาคู่มุมทีละขั้น', 'ตัวอย่างหาคู่มุมทีละขั้น', el => el.append(dcWalk(transFig({ lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi: 62, nums: true, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], hl: { 4: 'a', 5: 'c' } }), [['เริ่มที่มุม 4', 'มุม 4 เป็นมุมภายใน อยู่<b>ขวา</b>ของเส้นตัด ใต้เส้น AB'], ['มุมแย้งของ 4', 'มุมภายใน <b>ซ้าย</b>ของเส้นตัด บนเส้น CD = <b>มุม 5</b>'], ['มุมภายในข้างเดียวกันของ 4', 'มุมภายใน <b>ขวา</b>ของเส้นตัด บนเส้น CD = <b>มุม 6</b>']], 'มุมแย้ง: คนละข้าง · ข้างเดียวกัน: ฝั่งเดียวกันของเส้นตัด')))],
    () => [...pkF(G6PAIRS('alt'), 2).map(([k]) => Q.lTap({ k, rel: 'alt' })), ...pkF(G6PAIRS('side'), 2).map(([k]) => Q.lTap({ k, rel: 'side' })), ...pkF([[3, 6], [4, 6], [5, 4], [3, 5], [2, 3]], 3).map(([a, b]) => Q.lName({ a, b }))]),
  L5G(5, 25, 'ถ้ำรวม 180', 'สมบัติของเส้นขนานที่เกี่ยวกับมุมภายในบนข้างเดียวกันของเส้นตัดขวาง', 'มุมภายในข้างเดียวกันรวม 180°', 'ใช้สมบัติ: ถ้าเส้นขนานกัน มุมภายในที่อยู่บนข้างเดียวกันของเส้นตัดรวมกันได้ 180° (และกลับกัน)', [
    T('ลาก<b>จุดสีฟ้า</b>ทำให้ AB // CD แล้วดูผลรวมของมุมภายในบนข้างเดียวกัน', 'ลากจุดสีฟ้าทำให้เอบีขนานกับซีดี แล้วดูผลรวมของมุมภายในบนข้างเดียวกัน', el => el.append(simProp('side'))),
    T('ตัวอย่างหาค่า x ทีละขั้น', 'ตัวอย่างหาค่าเอ็กซ์ทีละขั้น', el => el.append(dcWalk(transFig({ lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi: 74, par: true, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], hl: { 4: 'a', 6: 'c' }, vals: { 4: '106°', 6: 'x' } }), [['① ดูความสัมพันธ์', 'มุม 106° กับ x เป็นมุมภายใน<b>บนข้างเดียวกัน</b>ของเส้นตัด'], ['② ใช้สมบัติ', 'AB // CD → รวมกันได้ 180°: 106° + x = 180°'], ['③ หาค่า', 'x = 180° − 106° = <b>74°</b>']], 'กลับกัน: ถ้ามุมภายในข้างเดียวกันรวม 180° แล้ว เส้นคู่นั้น<b>ขนานกัน</b>')))],
    () => [...pkF(G6PAIRS('side'), 4).map(([k, j]) => Q.lFind({ k, v: pick(G6_VALS), j })), Q.lIsPar({ a: 3, va: 73, b: 5, vb: 107 }), Q.lIsPar({ a: 4, va: 96, b: 6, vb: 96 }), Q.lIsPar({ a: 4, va: 106, b: 6, vb: 74 })]),
  L5G(6, 26, 'ถ้ำแย้งเท่ากัน', 'สมบัติของเส้นขนานเกี่ยวกับมุมแย้ง', 'มุมแย้งเท่ากัน', 'ใช้สมบัติ: ถ้าเส้นขนานกัน มุมแย้งมีขนาดเท่ากัน (และกลับกัน) หาขนาดของมุม', [
    T('ลาก<b>จุดสีฟ้า</b>ทำให้ AB // CD แล้วเปรียบเทียบ<b>มุมแย้ง</b>', 'ลากจุดสีฟ้าทำให้เอบีขนานกับซีดี แล้วเปรียบเทียบมุมแย้ง', el => el.append(simProp('alt'))),
    T('ตัวอย่างหาค่า x ทีละขั้น (ใช้หลายสมบัติต่อกัน)', 'ตัวอย่างหาค่าเอ็กซ์ทีละขั้น', el => el.append(dcWalk(transFig({ lines: [{ y: 110, t: 0 }, { y: 220, t: 0 }], phi: 65, par: true, names: [['A', 'B'], ['C', 'D']], tn: ['E', 'F'], hl: { 1: 'a', 6: 'c' }, vals: { 1: '115°', 6: 'x' } }), [['① มุม 115°', 'อยู่บนเส้น AB ด้านบนซ้ายของเส้นตัด'], ['② มุมตรงข้าม', 'มุมตรงข้ามของมุม 115° (ใต้ AB ด้านขวา) ก็เท่ากับ <b>115°</b>'], ['③ มุมแย้ง?', 'แต่ x เป็นมุมแย้งกับมุมใต้ AB ด้านซ้าย = 180° − 115° = 65°'], ['④ ตอบ', 'AB // CD → มุมแย้งเท่ากัน: <b>x = 65°</b>']], 'คิดเป็นขั้น: หามุมที่ช่วยเชื่อม แล้วใช้สมบัติ')))],
    () => [...pkF(G6PAIRS('alt'), 3).map(([k, j]) => Q.lFind({ k, v: pick(G6_VALS), j })), ...pkF(G6PAIRS('vert'), 1).map(([k, j]) => Q.lFind({ k, v: pick(G6_VALS), j })), Q.lIsPar({ a: 3, va: 52, b: 6, vb: 52 }), Q.lIsPar({ a: 4, va: 87, b: 5, vb: 106 }), Q.lTap({ k: pick([3, 4, 5, 6]), rel: 'alt' })]),
  L5G(7, 27, 'ถ้ำสร้างระยะเท่า', 'การสร้างเส้นขนานให้ผ่านจุดโดยการสร้างให้มีระยะห่างเท่ากัน', 'สร้างเส้นขนาน (ระยะเท่า)', 'สร้างเส้นขนานให้ผ่านจุดที่กำหนด โดยวัดระยะห่างตั้งฉากให้เท่ากัน', [
    T('สร้าง ผฝ ให้ขนานกับ พฟ และผ่านจุด ผ — <b>วัดระยะตั้งฉากให้เท่ากัน 2 ที่</b>', 'สร้างเส้นขนานผ่านจุด วัดระยะตั้งฉากให้เท่ากันสองที่', el => el.append(simLayers(PAR_BASE, PAR_STEPS, 'ตรวจ: วัดระยะห่างที่ไหนก็ได้ 3 ซม. เท่ากัน ✓'))),
    T('ลองเองว่าทำไมต้องวัด<b>ตั้งฉาก</b> — ระยะห่างต้องเท่ากันทุกที่จึงขนาน', 'ลองเองว่าทำไมต้องวัดตั้งฉาก ระยะห่างต้องเท่ากันทุกที่จึงขนาน', el => el.append(simParLines()))],
    () => [Q.dPick({ q: 'ถ้าต้องการสร้างเส้นตรงให้ผ่านจุด 1 จุด และขนานกับเส้นตรง 1 เส้นที่กำหนดให้ จะสร้างได้กี่เส้น', opts: ['1 เส้น', '2 เส้น', 'นับไม่ถ้วน'], right: '1 เส้น' }),
      Q.dPick({ q: 'สร้าง ผฝ // พฟ ผ่านจุด ผ: (1) วัดระยะตั้งฉากจาก พฟ ถึงจุด ผ (2) ลาก ผฝ (3) เลื่อนไม้ฉากไปอีกที่ ทำจุด ฝ ให้ห่างเท่ากัน — ลำดับใดถูก', opts: ['(1) (3) (2)', '(1) (2) (3)', '(2) (3) (1)'], right: '(1) (3) (2)' }),
      Q.dPick({ q: 'การวัดระยะห่างระหว่างเส้นขนาน ต้องวัดอย่างไร', opts: ['วัดตามแนวที่ตั้งฉากกับเส้นทั้งสอง', 'วัดตามแนวเฉียงก็ได้', 'วัดจากปลายเส้นถึงปลายเส้น'], right: 'วัดตามแนวที่ตั้งฉากกับเส้นทั้งสอง' }),
      Q.dPick({ q: 'สร้าง QR ให้ขนานกับ OP และอยู่สูงจาก OP 1.8 ซม. ต้องวัดระยะตั้งฉากกี่ครั้งอย่างน้อย', opts: ['2 ครั้ง (2 ที่)', '1 ครั้ง', '4 ครั้ง'], right: '2 ครั้ง (2 ที่)', hint: 'ต้องมี 2 จุดที่ห่างเท่ากัน จึงลากเส้นตรงได้' }),
      Q.lFig({ q: 'รูปใดแสดงเส้นที่<span class="hl">ขนานกัน</span> (ดูระยะห่าง)', figs: [transFig({ W: 320, H: 200, lines: [{ y: 60, t: 0 }, { y: 150, t: 6 }], noTrans: true, dist: [-100, 100], len: 140, noArrow: true }), transFig({ W: 320, H: 200, lines: [{ y: 60, t: 0 }, { y: 150, t: 0 }], noTrans: true, dist: [-100, 100], len: 140, noArrow: true })], right: 1, hint: 'ระยะห่างต้องเท่ากัน' })]),
  L5G(8, 28, 'ถ้ำสร้างด้วยมุม', 'การสร้างเส้นขนานเมื่อกำหนดขนาดมุมภายในบนข้างเดียวกันของเส้นตัดขวางหรือกำหนดขนาดมุมแย้ง', 'สร้างเส้นขนาน (ใช้มุม)', 'สร้างเส้นขนานโดยใช้มุมแย้งเท่ากัน หรือมุมภายในบนข้างเดียวกันรวมกัน 180°', [
    T('สร้างเส้นขนานผ่านจุด P โดยใช้<b>มุมแย้ง</b> — กดทีละขั้น', 'สร้างเส้นขนานผ่านจุดพี โดยใช้มุมแย้ง', el => el.append(simLayers(ANG_BASE, ANG_STEPS, 'ถ้าใช้มุมภายในบนข้างเดียวกัน ต้องสร้างมุม 180° − 61° = <b>119°</b> ข้างเดียวกันของเส้นตัด'))),
    T('ลองเอง: ปรับเส้น CD จนมุมแย้ง<b>เท่ากัน</b> — เส้นจะขนานกันพอดี', 'ลองเอง ปรับเส้นซีดีจนมุมแย้งเท่ากัน เส้นจะขนานกันพอดี', el => el.append(simProp('alt')))],
    () => [Q.dFill({ q: 'สร้างเส้นขนานโดยใช้มุมแย้ง ถ้ามุมที่วัดได้ 80° ต้องสร้างมุมแย้งขนาด ☐ องศา', a: '80', hint: 'มุมแย้งเท่ากัน' }), Q.dFill({ q: 'สร้างเส้นขนานโดยใช้มุมภายในบนข้างเดียวกัน ถ้ามุมที่วัดได้ 45° ต้องสร้างอีกมุมขนาด ☐ องศา', a: '135', hint: 'รวมกันได้ 180°' }),
      Q.dFill({ q: 'สร้างเส้นขนานโดยใช้มุมภายในบนข้างเดียวกัน ถ้ามุมที่วัดได้ 35° ต้องสร้างอีกมุมขนาด ☐ องศา', a: '145', hint: 'รวมกันได้ 180°' }),
      ...pkF([...G6PAIRS('alt'), ...G6PAIRS('side'), ...G6PAIRS('corr')], 3).map(([k, j]) => Q.lFind({ k, v: pick(G6_VALS), j })), Q.lIsPar({ a: 3, va: 118, b: 5, vb: 62 })])
];

/* boss 629: ข้อสอบท้ายบท — แต่งใหม่ทั้งหมด (รูปวาดใหม่) */
const X6 = f => ({ html: `<span class="g6-xo">${f}</span>` });
const EX6_3LINES = transFig({ W: 460, H: 330, lines: [{ y: 70, t: 0 }, { y: 165, t: 0 }, { y: 260, t: 0 }], phi: 65, x0: 240, nums: true, names: [['P', 'Q'], ['R', 'S'], ['T', 'U']], tn: ['M', 'N'], len: 200 });
const EXAM_P5C6 = xrot([
  { q: 'ข้อใดเป็นสมบัติของเส้นขนาน', opts: ['เส้นขนานต้องยาวเท่ากันเสมอ', 'ระยะห่างระหว่างเส้นขนานเท่ากันทุกจุด', 'เส้นขนานต่อออกไปจะตัดกันที่จุดหนึ่ง', 'เส้นขนานต้องอยู่ในแนวนอนเท่านั้น'], a: 1 },
  { q: 'รูปใดมีด้านที่ขนานกันอย่างน้อย 1 คู่', opts: ['รูปสามเหลี่ยมหน้าจั่ว', 'รูปสี่เหลี่ยมคางหมู', 'รูปสามเหลี่ยมมุมแหลม', 'รูปสี่เหลี่ยมรูปว่าว'], a: 1 },
  { q: 'จงพิจารณาว่าส่วนของเส้นตรงคู่ใดขนานกัน', opts: [X6(twoSeg([[30, 30], [190, 30]], [[30, 90], [190, 115]], 'กข', 'คง')), X6(twoSeg([[30, 25], [150, 65]], [[70, 80], [190, 120]], 'จฉ', 'ชซ')), X6(twoSeg([[40, 20], [100, 120]], [[125, 20], [190, 110]], 'ดต', 'ถท')), X6(twoSeg([[30, 65], [105, 65]], [[125, 15], [180, 115]], 'บป', 'ผฝ'))], a: 1 },
  { q: 'จากรูป ส่วนของเส้นตรงคู่ใดขนานกัน', fig: segFig({ vb: '0 0 260 200', pts: { 'ก': [40, 40], 'ข': [220, 40], 'ค': [180, 165], 'ง': [70, 165] }, segs: [['ก', 'ข'], ['ข', 'ค'], ['ค', 'ง'], ['ง', 'ก']], lab: { 'ค': [6, 16], 'ง': [-18, 16] } }), opts: ['กข // งค', 'กง // ขค', 'กข // ขค', 'กง // งค'], a: 0 },
  { q: 'จากรูปหกเหลี่ยมด้านเท่ามุมเท่า มีส่วนของเส้นตรงที่ขนานกันกี่คู่', fig: segFig({ vb: '0 0 220 170', pts: { _a: [175, 85], _b: [142.5, 141.3], _c: [77.5, 141.3], _d: [45, 85], _e: [77.5, 28.7], _f: [142.5, 28.7] }, segs: [['_a', '_b'], ['_b', '_c'], ['_c', '_d'], ['_d', '_e'], ['_e', '_f'], ['_f', '_a']] }), opts: ['2 คู่', '3 คู่', '4 คู่', '6 คู่'], a: 1 },
  { q: 'จากรูป (กข // คง) ส่วนของเส้นตรงใดแสดงระยะห่างระหว่าง กข และ คง', fig: segFig({ vb: '0 0 420 190', pts: { 'ก': [30, 40], 'จ': [80, 40], 'ช': [150, 40], 'ด': [260, 40], 'ถ': [330, 40], 'ข': [390, 40], 'ค': [30, 150], 'ฉ': [80, 150], 'ซ': [200, 150], 'ต': [260, 150], 'ท': [300, 150], 'ง': [390, 150] }, segs: [['ก', 'ข'], ['ค', 'ง'], ['จ', 'ฉ'], ['ช', 'ซ'], ['ด', 'ต'], ['ถ', 'ท']], right: [['ข', 'จ', 'ฉ'], ['ข', 'ด', 'ต']], lab: { 'ค': [-6, 22], 'ฉ': [-6, 22], 'ซ': [-6, 22], 'ต': [-6, 22], 'ท': [-6, 22], 'ง': [-6, 22] } }), opts: ['จฉ และ ดต', 'ชซ และ ถท', 'จฉ และ ชซ', 'ดต และ ถท'], a: 0 },
  { q: 'กำหนดเส้นตรง AB และจุด P ที่ไม่อยู่บน AB จะลากเส้นตรงผ่านจุด P ให้ขนานกับ AB ได้กี่เส้น', opts: ['ไม่มีเลย', '1 เส้น', '2 เส้น', 'นับไม่ถ้วน'], a: 1 },
  { q: 'การสร้างเส้นตรงผ่านจุด ร ให้ขนานกับ กข โดยใช้ไม้ฉากกับไม้บรรทัด ควรทำขั้นใดเป็นขั้นแรก', opts: ['วางขอบไม้ฉากทาบ กข แล้ววางไม้บรรทัดชิดขอบอีกด้านของไม้ฉาก', 'ลากเส้นผ่านจุด ร ได้ทันที', 'วัดความยาวของ กข', 'แบ่งครึ่ง กข ก่อน'], a: 0 },
  { q: 'จากรูป มุมคู่ใดเป็นมุมภายนอกและมุมภายในที่อยู่ตรงข้ามบนข้างเดียวกันของเส้นตัด', fig: EX6_3LINES, opts: ['∠2 , ∠6', '∠2 , ∠5', '∠2 , ∠3', '∠2 , ∠8'], a: 0 },
  { q: 'จากรูป (PQ // RS // TU) ถ้า ∠7 มีขนาด 65 องศา แล้ว ∠2 มีขนาดเท่าใด', fig: EX6_3LINES, opts: ['25 องศา', '65 องศา', '115 องศา', '180 องศา'], a: 1 },
  { q: 'จากรูป มุมคู่ใดเป็นมุมภายในที่อยู่บนข้างเดียวกันของเส้นตัด', fig: EX6_3LINES, opts: ['∠8 , ∠10', '∠8 , ∠9', '∠6 , ∠7', '∠4 , ∠5'], a: 0 },
  { q: 'เส้นตรงเส้นหนึ่งตัดเส้นขนานคู่หนึ่ง มุมแย้งที่เกิดขึ้นมีขนาดเป็นอย่างไร', opts: ['รวมกันได้ 90 องศา', 'เท่ากัน', 'รวมกันได้ 180 องศา', 'รวมกันได้ 360 องศา'], a: 1 },
  { q: 'เส้นตรงเส้นหนึ่งตัดเส้นตรงคู่หนึ่ง ทำให้มุมภายในที่อยู่บนข้างเดียวกันของเส้นตัดรวมกันได้ 180 องศา เส้นตรงคู่นั้นเป็นอย่างไร', opts: ['ตั้งฉากกัน', 'ตัดกัน', 'ขนานกัน', 'ยาวเท่ากัน'], a: 2 },
  { q: 'จากรูป □PQRS เป็นรูปสี่เหลี่ยมด้านขนาน (PQ // SR และ PS // QR) ข้อใดถูกต้อง', fig: segFig({ vb: '0 0 280 190', pts: { P: [70, 30], Q: [240, 30], R: [205, 160], S: [35, 160] }, segs: [['P', 'Q'], ['Q', 'R'], ['R', 'S'], ['S', 'P']], par: [['P', 'Q'], ['S', 'R']], lab: { R: [6, 16], S: [-14, 16] } }), opts: ['∠SPQ + ∠PQR = 180°', '∠SPQ + ∠PSR = 90°', '∠PQR + ∠QRS = 360°', '∠PSR = ∠SRQ'], a: 0 },
  { q: 'ส่วนของเส้นตรงในข้อใดขนานกัน', opts: [X6(parOpt(0, { phi: 55, v: { 4: '125°', 6: '55°' } })), X6(parOpt(-6, { phi: 65, v: { 4: '115°', 6: '60°' } })), X6(parOpt(7, { phi: 40, v: { 2: '140°', 3: '140°' } })), X6(parOpt(-5, { phi: 120, v: { 1: '60°', 5: '55°' } }))], a: 0 }
], 2);
LESSONS_P5C6.push({ id: 629, boss: true, place: 'ถ้ำราชาหมีเส้นขนาน', title: 'ด่านบอส: บทที่ 6 เส้นขนาน', short: 'ด่านบอส · ข้อสอบ', tone: 'lilac',
  goal: 'ตอบคำถามเรื่องเส้นขนาน 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส',
  exam: EXAM_P5C6, pass: 8, bossName: 'ราชาหมีเส้นขนาน', bossPal: 'lilac', emblem: '//', bossKind: 'bear' });
