/* =========================================================
   ป.6 บทที่ 8 วงกลม (ภาคเรียนที่ 2) — circle parts, naming, compass construction, π (rolling wheel),
   circumference, area (sectors → rectangle), shaded regions, word problems.   Levels 841–852 + boss 859  (prefix c8)
   ========================================================= */
const C8PI = { f: '22/7', d: '3.14' };
const c8n = x => { const r = Math.round(x * 100) / 100; return Math.abs(r - x) < 1e-9 ? fmtDec(String(r)) : '≈ ' + fmtDec(r.toFixed(2)); };
const c8xy = (c, r, deg) => [c[0] + r * Math.cos(deg * Math.PI / 180), c[1] - r * Math.sin(deg * Math.PI / 180)];
/* circle figure: o.circles [{c, r, fill, op, dash, w}] · o.ring {c, R, r, fill} · o.segs [{a, b, label, col, dash, w, off}] · o.pts [{p, name, c (centre for outward label), dot}] · o.texts [[p, t, cls]] · o.raw */
function circSVG(o) {
  const W = o.W || 400, H = o.H || 260; let s = `<svg viewBox="0 0 ${W} ${H}" class="t6-svg c8-svg" aria-hidden="true">`;
  if (o.under) s += o.under;
  (o.rings || []).forEach(g => { const { c, R, r } = g, oc = g.oc || c; s += `<path d="M${c[0] - R} ${c[1]} a${R} ${R} 0 1 0 ${2 * R} 0 a${R} ${R} 0 1 0 ${-2 * R} 0 Z M${oc[0] - r} ${oc[1]} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z" fill="${g.fill || '#FFD27A'}" fill-rule="evenodd" stroke="#2B2550" stroke-width="2.4"/>`; });
  (o.circles || []).forEach(g => { s += `<circle cx="${g.c[0]}" cy="${g.c[1]}" r="${g.r}" fill="${g.fill || 'none'}" fill-opacity="${g.op ?? 1}" stroke="${g.stroke || '#2B2550'}" stroke-width="${g.w || 2.6}" ${g.dash ? 'stroke-dasharray="7 5"' : ''}/>`; });
  if (o.raw) s += o.raw;
  (o.segs || []).forEach(g => { s += `<path d="M${g.a} L${g.b}" stroke="${g.col || '#2B2550'}" stroke-width="${g.w || 2.4}" ${g.dash ? 'stroke-dasharray="7 5"' : ''} stroke-linecap="round"/>`;
    if (g.label) { const M = [(g.a[0] + g.b[0]) / 2, (g.a[1] + g.b[1]) / 2], L = Math.hypot(g.b[0] - g.a[0], g.b[1] - g.a[1]) || 1, n = [-(g.b[1] - g.a[1]) / L, (g.b[0] - g.a[0]) / L], d = g.off ?? -13, f = g.at ?? .5, P = [g.a[0] + (g.b[0] - g.a[0]) * f, g.a[1] + (g.b[1] - g.a[1]) * f];
      s += `<text x="${(g.at != null ? P : M)[0] + n[0] * d}" y="${(g.at != null ? P : M)[1] + n[1] * d + 5}" text-anchor="middle" class="t6-sv" fill="${g.lcol || g.col || '#2B2550'}">${g.label}</text>`; } });
  (o.pts || []).forEach(g => { const p = g.p; if (g.dot !== false) s += `<circle cx="${p[0]}" cy="${p[1]}" r="${g.big ? 5 : 3.8}" fill="${g.col || '#2B2550'}"/>`;
    if (g.name) { let d = [0, -1]; if (g.c) { const v = [p[0] - g.c[0], p[1] - g.c[1]], L = Math.hypot(...v); d = L > 1 ? [v[0] / L, v[1] / L] : (g.dir || [.7, -.7]); } else if (g.dir) d = g.dir; s += `<text x="${p[0] + d[0] * 16}" y="${p[1] + d[1] * 16 + 6}" text-anchor="middle" class="t6-n">${g.name}</text>`; } });
  (o.texts || []).forEach(([p, t, cls]) => { s += `<text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" class="${cls || 't6-sv'}">${t}</text>`; });
  return s + (o.extra || '') + '</svg>';
}
const c8pt = e => { const svg = e.currentTarget.querySelector('svg'), m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m); return [r.x, r.y]; };

/* ---------- parts: drag a point on the circle, add radii / a diameter ---------- */
function simCircParts() {
  let r = 3, ang = 35, radii = [], diam = null, drag = false; const U = 32, C = [200, 140], fig = h('div', { class: 't6-board ia' }), out = fNote();
  const draw = () => { const R = r * U, P = c8xy(C, R, ang), segs = radii.map(a => ({ a: C, b: c8xy(C, R, a), col: '#3F8BDB', w: 3, label: `${r} ซม.`, lcol: '#3F8BDB' }));
    if (diam != null) segs.push({ a: c8xy(C, R, diam), b: c8xy(C, R, diam + 180), col: '#E5487A', w: 3.4, label: `${2 * r} ซม.`, off: 14, at: .25 });
    segs.push({ a: C, b: P, col: '#7E6ED6', dash: true });
    fig.innerHTML = circSVG({ W: 400, H: 280, circles: [{ c: C, r: R, fill: '#CFE6FF', op: .45 }], segs, pts: [{ p: C, name: 'O', dir: [-.8, .7], big: 1, col: '#E5487A' }],
      extra: `<circle class="c8-h drag" cx="${P[0]}" cy="${P[1]}" r="12" fill="#7E6ED6" fill-opacity=".85" stroke="#fff" stroke-width="2.4"/>` });
    out.innerHTML = `<b style="color:#E5487A">O</b> = จุดศูนย์กลาง · <b style="color:#3F8BDB">รัศมี</b> ${radii.length} เส้น ยาวเท่ากันทุกเส้น = ${r} ซม.${diam != null ? ` · <b style="color:#E5487A">เส้นผ่านศูนย์กลาง</b> = 2 × ${r} = ${2 * r} ซม.` : ''} · เส้นรอบวง = เส้นโค้งรอบวงกลม`; };
  fig.addEventListener('pointerdown', e => { if (!e.target.closest('.c8-h')) return; e.preventDefault(); drag = true; try { fig.setPointerCapture(e.pointerId); } catch (_) { } });
  fig.addEventListener('pointermove', e => { if (!drag) return; const p = c8pt(e); ang = Math.round(Math.atan2(C[1] - p[1], p[0] - C[0]) * 180 / Math.PI); draw(); });
  fig.addEventListener('pointerup', () => { if (drag) sfx.tap(); drag = false; });
  const bR = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (radii.length < 8) radii.push(ang); sfx.pop(radii.length); draw(); } }, 'ลากรัศมีตรงจุดม่วง');
  const bD = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); diam = ang; sfx.pop(5); draw(); } }, 'ลากเส้นผ่านศูนย์กลาง');
  draw(); return h('div', { class: 'colstack' }, fig, h('div', { class: 'cap' }, 'ลากจุดสีม่วงไปรอบวง แล้วกดลากรัศมี/เส้นผ่านศูนย์กลาง'), h('div', { class: 'rowstack' }, bR, bD, stepper('รัศมี (ซม.)', () => r, x => r = x, () => 1, () => 4, draw)), out);
}
/* ---------- naming: tap each segment of circle O ---------- */
function simNameTap() {
  const C = [200, 135], R = 105, P = { A: c8xy(C, R, 150), B: c8xy(C, R, 40), D: c8xy(C, R, 100), E: c8xy(C, R, 280), F: c8xy(C, R, 205), G: c8xy(C, R, 320) };
  const SEG = [{ k: 'OA', a: C, b: P.A, t: '<b>รัศมี OA</b> — ปลายข้างหนึ่งอยู่ที่จุดศูนย์กลาง O อีกข้างอยู่บนวงกลม' }, { k: 'OB', a: C, b: P.B, t: '<b>รัศมี OB</b> — ยาวเท่ากับ OA' },
    { k: 'DE', a: P.D, b: P.E, t: '<b>เส้นผ่านศูนย์กลาง DE</b> — ผ่านจุด O ปลายทั้งสองอยู่บนวงกลม' }, { k: 'FG', a: P.F, b: P.G, t: '<b>FG ไม่ใช่</b>เส้นผ่านศูนย์กลาง เพราะไม่ผ่านจุดศูนย์กลาง' }];
  const fig = h('div', { class: 't6-board ia' }), log = h('div', { class: 'colstack fstory' }), w8 = h6wait(), seen = new Set();
  const draw = () => { fig.innerHTML = circSVG({ W: 400, H: 270, circles: [{ c: C, r: R, fill: '#FFF3C4', op: .6 }], segs: SEG.map(g => ({ a: g.a, b: g.b, col: seen.has(g.k) ? (g.k === 'FG' ? '#9790B0' : g.k === 'DE' ? '#E5487A' : '#3F8BDB') : '#2B2550', w: 3 })),
    pts: [{ p: C, name: 'O', dir: [.75, .75], big: 1, col: '#E5487A' }, ...Object.entries(P).map(([n, p]) => ({ p, name: n, c: C }))],
    extra: SEG.map(g => `<path class="c8-hit" data-k="${g.k}" d="M${g.a} L${g.b}" stroke="transparent" stroke-width="24"/>`).join('') }); };
  fig.addEventListener('click', e => { const t = e.target.closest('.c8-hit'); if (!t) return; e.stopPropagation(); const g = SEG.find(x => x.k === t.dataset.k); if (seen.has(g.k)) return; seen.add(g.k); sfx.pop(seen.size);
    log.append(h('div', { class: 'fst-row' }, h('b', null, g.k), h('span', { html: g.t }))); draw(); if (seen.size === SEG.length) { log.append(h('div', { class: 'fst-row' }, h('b', null, 'ชื่อ'), h('span', null, 'เรียกว่า “วงกลม O” ตามชื่อจุดศูนย์กลาง'))); sfx.ok(); teachDone(fig); } });
  draw(); return h('div', { class: 'gside' }, fig, h('div', { class: 'colstack gside-r' }, w8, h('div', { class: 'cap' }, 'แตะเส้นแต่ละเส้นในรูป'), log));
}
/* ---------- compass: set the opening, spin ---------- */
function simCompass() {
  let r = 2.5, prog = 1, raf = 0; const U = 40, C = [170, 150], fig = h('div', { class: 't6-board' }), out = fNote();
  const draw = () => { const R = r * U, a = 360 * prog, E = c8xy(C, R, a), M = [(C[0] + E[0]) / 2, (C[1] + E[1]) / 2], u = [(E[0] - C[0]) / R, (E[1] - C[1]) / R], Lg = 130, hh = Math.sqrt(Math.max(0, Lg * Lg - R * R / 4)), top = [M[0] + u[1] * hh, M[1] - u[0] * hh];
    const arc = prog >= 1 ? `<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#3F8BDB" stroke-width="3"/>` : prog > 0 ? `<path d="M${C[0] + R} ${C[1]} A${R} ${R} 0 ${prog > .5 ? 1 : 0} 0 ${E[0]} ${E[1]}" fill="none" stroke="#3F8BDB" stroke-width="3"/>` : '';
    const ruler = `<rect x="${C[0] - 10}" y="${C[1] + 130}" width="${6 * U + 20}" height="26" rx="4" fill="#FFE7A3" stroke="#C98612"/>` + Array.from({ length: 13 }, (_, i) => `<path d="M${C[0] + i * U / 2} ${C[1] + 130} v${i % 2 ? 7 : 12}" stroke="#9A6406" stroke-width="1.4"/>${i % 2 ? '' : `<text x="${C[0] + i * U / 2}" y="${C[1] + 152}" text-anchor="middle" class="c8-tk">${i / 2}</text>`}`).join('');
    fig.innerHTML = circSVG({ W: 460, H: 320, raw: arc + `<path d="M${C[0]} ${C[1]} L${C[0] + R} ${C[1]}" stroke="#E5487A" stroke-width="2.4" stroke-dasharray="6 4"/>` + `<path d="M${C[0]} ${C[1] + 130} v-130 M${C[0] + R} ${C[1] + 130} v-130" stroke="#C98612" stroke-width="1" stroke-dasharray="3 4"/>` + ruler,
      pts: [{ p: C, name: 'O', dir: [-.7, .8], big: 1, col: '#E5487A' }], texts: [[[C[0] + R / 2, C[1] - 12], `${fmtDec(String(r))} ซม.`]],
      extra: `<path d="M${C[0]} ${C[1]} L${top[0]} ${top[1]} L${E[0]} ${E[1]}" fill="none" stroke="#6B6489" stroke-width="5" stroke-linecap="round"/><circle cx="${top[0]}" cy="${top[1]}" r="7" fill="#7E6ED6"/><circle cx="${E[0]}" cy="${E[1]}" r="4" fill="#3F8BDB"/>` });
    out.innerHTML = `กางวงเวียนกว้าง = รัศมี = <b>${fmtDec(String(r))} ซม.</b> · ได้วงกลม O ที่มีเส้นผ่านศูนย์กลาง ${fmtDec(String(r * 2))} ซม.`; };
  const spin = () => { cancelAnimationFrame(raf); const t0 = performance.now(); const f = t => { prog = Math.min(1, (t - t0) / 1400); draw(); if (prog < 1) raf = requestAnimationFrame(f); else sfx.ok(); }; raf = requestAnimationFrame(f); };
  const st = stepper('กางวงเวียน (ซม.)', () => r, x => { r = Math.max(1, Math.min(3, Math.round((r + Math.sign(x - r) * .5) * 2) / 2)); prog = 0; }, () => 0, () => 4, () => { st.sync(); draw(); });
  draw(); return h('div', { class: 'colstack' }, fig, h('div', { class: 'rowstack' }, st, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.tap(); prog = 0; spin(); } }, icon('replay'), 'หมุนวงเวียน')), out);
}
const c8col = el => { el.className = 'colstack c8-layers'; return el; };
const c8C = (cx, cy, r, c = '#3F8BDB') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="3"/>`;
/* ---------- π: roll a wheel one turn ---------- */
function simRoll() {
  let d = 2, t = 0, raf = 0; const U = 36, y0 = 200, x0 = 30, fig = h('div', { class: 't6-board wide' }), tb = h('div', { class: 'colstack fstory' }), out = fNote(), done = new Set();
  const draw = () => { const R = d * U / 2, Cl = Math.PI * d * U, x = x0 + Cl * t, a = -360 * t, cy = y0 - R, mk = c8xy([x, cy], R, -90 + a);
    let s = `<path d="M14 ${y0} H586" stroke="#2B2550" stroke-width="2.4"/><path d="M${x0} ${y0} H${x}" stroke="#E5487A" stroke-width="6" stroke-linecap="round"/>`;
    for (let i = 0; i <= Math.floor(Math.PI * d) + 1; i++) s += `<path d="M${x0 + i * d * U} ${y0 + 4} v10" stroke="#9790B0" stroke-width="1.6"/>`;
    s += `<circle cx="${x}" cy="${cy}" r="${R}" fill="#CFE6FF" fill-opacity=".7" stroke="#2B2550" stroke-width="2.6"/><path d="M${x} ${cy} L${mk[0]} ${mk[1]}" stroke="#E5487A" stroke-width="3"/><circle cx="${mk[0]}" cy="${mk[1]}" r="5" fill="#E5487A"/>
      <path d="M${x - R} ${cy} H${x + R}" stroke="#3F8BDB" stroke-width="2" stroke-dasharray="5 4"/><text x="${x}" y="${cy - 8}" text-anchor="middle" class="t6-sv" fill="#3F8BDB">${d}</text>`;
    if (t >= 1) s += `<text x="${x0 + Cl / 2}" y="${y0 + 32}" text-anchor="middle" class="t6-sv" fill="#E5487A">เส้นรอบวง ≈ ${(Math.PI * d).toFixed(2)} ซม. (ยาวกว่า 3 เท่าของ ${d} เล็กน้อย)</text>`;
    fig.innerHTML = `<svg viewBox="0 0 600 250" class="t6-svg" aria-hidden="true">${s}</svg>`; };
  const roll = () => { cancelAnimationFrame(raf); const t0 = performance.now(); const f = n => { t = Math.min(1, (n - t0) / 1800); draw(); if (t < 1) raf = requestAnimationFrame(f); else { sfx.ok();
    if (!done.has(d)) { done.add(d); tb.append(h('div', { class: 'fst-row' }, h('b', null, `d = ${d} ซม.`), h('span', null, `เส้นรอบวง ≈ ${(Math.PI * d).toFixed(2)} · ÷ ${d} ≈ 3.14`))); }
    out.innerHTML = `วงกลมทุกขนาด: เส้นรอบวง ÷ เส้นผ่านศูนย์กลาง ≈ <b>3.14</b> เรียกค่านี้ว่า <b>π (พาย)</b> ใช้ประมาณ ${fqHTML(22, 7)} หรือ 3.14`; } }; raf = requestAnimationFrame(f); };
  draw(); return h('div', { class: 'colstack' }, fig, h('div', { class: 'rowstack' }, stepper('เส้นผ่านศูนย์กลาง (ซม.)', () => d, x => { d = x; t = 0; }, () => 1, () => 4, draw), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.tap(); t = 0; roll(); } }, icon('play'), 'กลิ้ง 1 รอบ')), tb, out);
}
/* ---------- circumference: 2πr with π = 22/7 or 3.14, unrolled ---------- */
function simCircum() {
  let r = 7, pi = 'f'; const fig = h('div', { class: 't6-board' }), big = h('div', { class: 'fbig t6-ar' }), out = fNote();
  const draw = () => { const U = 10, R = r * U, C = [115, 118], Cv = 2 * (pi === 'f' ? 22 / 7 : 3.14) * r, k = 300 / (2 * 3.2 * 10), L = Cv * k;
    fig.innerHTML = circSVG({ W: 460, H: 250, circles: [{ c: C, r: R, fill: '#CFE6FF', op: .5, stroke: '#E5487A', w: 3.4 }], segs: [{ a: C, b: [C[0] + R, C[1]], col: '#3F8BDB', label: `r = ${r}` }],
      pts: [{ p: C, big: 1 }], raw: `<path d="M140 232 h${L}" stroke="#E5487A" stroke-width="6" stroke-linecap="round"/><text x="${140 + L / 2}" y="222" text-anchor="middle" class="t6-sv" fill="#E5487A">คลี่เส้นรอบวงออก</text>` });
    big.innerHTML = `2 × ${pi === 'f' ? fqHTML(22, 7) : '3.14'} × ${r} = <b>${c8n(Cv)}</b> ซม.`;
    out.innerHTML = `เส้นรอบวง = 2 × π × รัศมี = π × เส้นผ่านศูนย์กลาง · ใช้ ${fqHTML(22, 7)} สะดวกเมื่อรัศมีหารด้วย 7 ลงตัว`; };
  const bp = h('div', { class: 'rowstack' }, ...['f', 'd'].map(k => h('button', { class: 'btn sm ia', html: 'π = ' + (k === 'f' ? fqHTML(22, 7) : '3.14'), onclick: e => { e.stopPropagation(); pi = k; sfx.pop(k === 'f' ? 1 : 3); draw(); } })));
  draw(); return h('div', { class: 'colstack' }, fig, big, h('div', { class: 'rowstack' }, stepper('รัศมี (ซม.)', () => r, x => r = x, () => 1, () => 10, draw), bp), out);
}
/* ---------- area: cut into sectors, rearrange into a near-rectangle ---------- */
function simSectors() {
  const NS = [4, 6, 8, 12, 16, 24, 36]; let ni = 2; const fig = h('div', { class: 't6-board wide' }), out = fNote();
  const draw = () => { const n = NS[ni], R = 70, C = [95, 125], th = 2 * Math.PI / n, hs = R * Math.sin(th / 2), hc = R * Math.cos(th / 2), A = '#6FB2F5', B = '#FFB38A';
    let s = ''; for (let i = 0; i < n; i++) { const a1 = i * th, a2 = (i + 1) * th, p1 = [C[0] + R * Math.cos(a1), C[1] - R * Math.sin(a1)], p2 = [C[0] + R * Math.cos(a2), C[1] - R * Math.sin(a2)];
      s += `<path d="M${C} L${p1} A${R} ${R} 0 0 0 ${p2} Z" fill="${i < n / 2 ? A : B}" stroke="#2B2550" stroke-width="1.2"/>`; }
    const x0 = 200, yb = 195, yt = yb - hc; let sx = x0;
    for (let i = 0; i < n / 2; i++) { const x = x0 + i * 2 * hs + hs; s += `<path d="M${x - hs} ${yt} A${R} ${R} 0 0 1 ${x + hs} ${yt} L${x} ${yb} Z" fill="${A}" stroke="#2B2550" stroke-width="1.2" transform="translate(0 0)"/>`;
      // pointing down sectors between ups
      const xd = x + hs; if (i < n / 2) s += `<path d="M${xd - hs} ${yb} A${R} ${R} 0 0 0 ${xd + hs} ${yb} L${xd} ${yt} Z" fill="${B}" stroke="#2B2550" stroke-width="1.2"/>`; sx = xd + hs; }
    const wv = sx - x0 - hs;
    s += `<path d="M${x0 + hs} ${yb + 16} h${wv}" stroke="#E5487A" stroke-width="2"/><text x="${x0 + hs + wv / 2}" y="${yb + 34}" text-anchor="middle" class="t6-sv" fill="#E5487A">≈ ครึ่งหนึ่งของเส้นรอบวง = πr</text>
      <path d="M${x0 - 10} ${yb} v${-R}" stroke="#3F8BDB" stroke-width="2"/><text x="${x0 - 16}" y="${yb - R / 2}" text-anchor="end" class="t6-sv" fill="#3F8BDB">r</text>`;
    fig.innerHTML = `<svg viewBox="0 0 560 250" class="t6-svg" aria-hidden="true">${s}</svg>`;
    out.innerHTML = `ตัดเป็น <b>${n}</b> ชิ้นแล้วเรียงสลับ — ยิ่งตัดมาก ยิ่งใกล้<b>รูปสี่เหลี่ยมผืนผ้า</b> ยาว πr กว้าง r → พื้นที่วงกลม = πr × r = <b>πr²</b>`; };
  const st = stepper('จำนวนชิ้น', () => NS[ni], x => { ni = Math.max(0, Math.min(NS.length - 1, ni + Math.sign(x - NS[ni]))); }, () => 3, () => 37, () => { st.sync(); draw(); });
  draw(); return h('div', { class: 'colstack' }, fig, st, out);
}
/* ---------- area: πr² compared with r × r squares ---------- */
function simCircArea() {
  let r = 7, pi = 'f'; const fig = h('div', { class: 't6-board' }), big = h('div', { class: 'fbig t6-ar' }), out = fNote();
  const draw = () => { const U = 15, R = r * U, C = [200, 130], A = (pi === 'f' ? 22 / 7 : 3.14) * r * r;
    fig.innerHTML = circSVG({ W: 400, H: 260, raw: `<rect x="${C[0] - R}" y="${C[1] - R}" width="${2 * R}" height="${2 * R}" fill="none" stroke="#C98612" stroke-width="1.6" stroke-dasharray="6 4"/><path d="M${C[0]} ${C[1] - R} V${C[1] + R} M${C[0] - R} ${C[1]} H${C[0] + R}" stroke="#C98612" stroke-width="1.2" stroke-dasharray="4 4"/><rect x="${C[0]}" y="${C[1] - R}" width="${R}" height="${R}" fill="#FFE7A3" fill-opacity=".7"/>`,
      circles: [{ c: C, r: R, fill: '#7EDDB8', op: .55 }], segs: [{ a: C, b: [C[0] - R, C[1]], col: '#3F8BDB', label: `r = ${r}`, off: 13 }], texts: [[[C[0] + R / 2, C[1] - R / 2], 'r × r']] });
    big.innerHTML = `${pi === 'f' ? fqHTML(22, 7) : '3.14'} × ${r} × ${r} = <b>${c8n(A)}</b> ตร.ซม.`;
    out.innerHTML = `สี่เหลี่ยมจัตุรัส r × r = ${r * r} ตร.ซม. · วงกลมใหญ่กว่าประมาณ <b>3.14 เท่า</b> (ไม่ถึง 4 ช่อง) → พื้นที่ = π × r × r`; };
  const bp = h('div', { class: 'rowstack' }, ...['f', 'd'].map(k => h('button', { class: 'btn sm ia', html: 'π = ' + (k === 'f' ? fqHTML(22, 7) : '3.14'), onclick: e => { e.stopPropagation(); pi = k; sfx.pop(k === 'f' ? 1 : 3); draw(); } })));
  draw(); return h('div', { class: 'colstack' }, fig, big, h('div', { class: 'rowstack' }, stepper('รัศมี (ซม.)', () => r, x => r = x, () => 1, () => 8, draw), bp), out);
}
/* ---------- shaded ring ---------- */
function simRing() {
  let R = 7, r = 3; const fig = h('div', { class: 't6-board' }), big = h('div', { class: 'fbig t6-ar' }), out = fNote();
  const draw = () => { const U = 15, C = [200, 128];
    fig.innerHTML = circSVG({ W: 400, H: 256, rings: [{ c: C, R: R * U, r: r * U, fill: '#FFD27A' }], segs: [{ a: C, b: c8xy(C, R * U, 20), col: '#E5487A', label: `${R}`, at: .8 }, { a: C, b: c8xy(C, r * U, 200), col: '#3F8BDB', label: `${r}`, off: 12 }], pts: [{ p: C }] });
    big.innerHTML = `3.14 × ${R} × ${R} − 3.14 × ${r} × ${r} = <b>${c8n(3.14 * (R * R - r * r))}</b> ตร.ซม.`;
    out.innerHTML = `พื้นที่ส่วนที่ระบายสี = พื้นที่วงกลมใหญ่ − พื้นที่วงกลมเล็ก = ${c8n(3.14 * R * R)} − ${c8n(3.14 * r * r)}`; };
  draw(); return h('div', { class: 'colstack' }, fig, big, h('div', { class: 'rowstack' }, stepper('รัศมีวงใหญ่', () => R, x => { R = x; if (r >= R) r = R - 1; }, () => 2, () => 8, draw), stepper('รัศมีวงเล็ก', () => r, x => r = x, () => 1, () => R - 1, draw)), out);
}

/* =========================================================
   ========================================================= */
Object.assign(Q, {
  c8Pick({ fig, q, opts, right, hint, keep }) {
    return { prompt: q, say: speakText(q), mount(bd, ctx) { bd.append(h('div', { class: 't6-q' }, fig ? h('div', { class: 't6-board sm', html: fig }) : null, choices(ctx, (keep ? opts : shuffle(opts)).map(o => ({ value: o, label: o })), right, { hint }))); bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  }
});
const C8_W2a = (() => { const C = [200, 130], R = 105, P = { A: c8xy(C, R, 180), C: c8xy(C, R, -2), D: c8xy(C, R, 90), E: c8xy(C, R, 270), F: c8xy(C, R, 205), G: c8xy(C, R, 25) };
  return circSVG({ circles: [{ c: C, r: R }], segs: [{ a: P.A, b: P.C }, { a: P.D, b: P.E }, { a: P.F, b: P.G }], pts: [{ p: C, name: 'B', dir: [.3, -.9] }, ...['A', 'C', 'D', 'E', 'F', 'G'].map(n => ({ p: P[n], name: n, c: C, dot: false }))] }); })();
const C8_W2b = (() => { const C = [200, 130], R = 105, P = { ก: c8xy(C, R, 90), ข: c8xy(C, R, 270), ช: c8xy(C, R, 340), ค: c8xy(C, R, 195), ง: c8xy(C, R, 305) };
  return circSVG({ circles: [{ c: C, r: R }], segs: [{ a: P.ก, b: P.ข }, { a: C, b: P.ช }, { a: P.ค, b: P.ง }], pts: [{ p: C, name: 'ฉ', dir: [.8, -.4] }, ...Object.keys(P).map(n => ({ p: P[n], name: n, c: C, dot: false }))] }); })();
const C8_W3 = [ // 
  { fig: circSVG({ circles: [{ c: [200, 130], r: 100 }], segs: [{ a: c8xy([200, 130], 100, 192), b: c8xy([200, 130], 100, 12), label: '10 ซม.' }], pts: [{ p: [200, 130], name: 'P', dir: [0, 1] }, { p: c8xy([200, 130], 100, 192), name: 'O', c: [200, 130], dot: false }, { p: c8xy([200, 130], 100, 12), name: 'Q', c: [200, 130], dot: false }] }), q: 'วงกลม P มีรัศมียาวกี่เซนติเมตร', a: '5', unit: 'ซม.', hint: 'OQ เป็นเส้นผ่านศูนย์กลาง → 10 ÷ 2' },
  { fig: circSVG({ circles: [{ c: [200, 130], r: 100 }], segs: [{ a: c8xy([200, 130], 100, 130), b: c8xy([200, 130], 100, 310) }], pts: [{ p: [200, 130], name: 'S', dir: [1, 0] }, { p: c8xy([200, 130], 100, 130), name: 'R', c: [200, 130], dot: false }, { p: c8xy([200, 130], 100, 310), name: 'T', c: [200, 130], dot: false }], texts: [[[150, 120], '15 ซม.']] }), q: 'วงกลม S มีรัศมี RS ยาว 15 ซม. เส้นผ่านศูนย์กลางยาวกี่เซนติเมตร', a: '30', unit: 'ซม.', hint: 'เส้นผ่านศูนย์กลาง = 2 × รัศมี' },
  { fig: circSVG({ circles: [{ c: [200, 135], r: 115 }, { c: [200, 82], r: 58 }], segs: [{ a: [142, 82], b: [258, 82], label: '8 ซม.' }, { a: [200, 135], b: [200, 250], label: '7 ซม.', off: -22 }], pts: [{ p: [200, 82], name: 'A', dir: [0, 1] }, { p: [200, 135], name: 'B', dir: [.8, -.4] }] }), q: 'วงกลม B มีเส้นผ่านศูนย์กลางยาวกี่เซนติเมตร', a: '14', unit: 'ซม.', hint: 'รัศมีวงกลม B ยาว 7 ซม. → 2 × 7' },
  { fig: circSVG({ circles: [{ c: [200, 135], r: 115 }, { c: [200, 82], r: 58 }], segs: [{ a: [142, 82], b: [258, 82], label: '8 ซม.' }, { a: [200, 135], b: [200, 250], label: '7 ซม.', off: -22 }], pts: [{ p: [200, 82], name: 'A', dir: [0, 1] }, { p: [200, 135], name: 'B', dir: [.8, -.4] }] }), q: 'วงกลม A มีรัศมียาวกี่เซนติเมตร', a: '4', unit: 'ซม.', hint: 'เส้นผ่านศูนย์กลางวงกลม A ยาว 8 ซม. → 8 ÷ 2' },
  { fig: circSVG({ circles: [{ c: [205, 130], r: 112 }, { c: [180, 130], r: 75 }], segs: [{ a: [180, 55], b: [180, 205] }, { a: [205, 130], b: [317, 130], label: '9 ซม.' }], pts: [{ p: [180, 130], name: 'ก', dir: [-1, 0] }, { p: [205, 130], name: 'ข', dir: [0, -1] }], texts: [[[150, 168], '10 ซม.']] }), q: 'วงกลม ข มีเส้นผ่านศูนย์กลางยาวกี่เซนติเมตร', a: '18', unit: 'ซม.', hint: 'รัศมี 9 ซม. → 2 × 9' }];
const c8r = (lab, kind = 'r', unit = 'ซม.') => { const C = [200, 130], R = 100; return circSVG({ circles: [{ c: C, r: R, fill: '#CFE6FF', op: .45 }], segs: kind === 'r' ? [{ a: C, b: c8xy(C, R, 30), label: lab }] : [{ a: c8xy(C, R, 210), b: c8xy(C, R, 30), label: lab }], pts: [{ p: C }] }); };
const C8_CIR = [ // 
  { fig: c8r('28 ซม.'), q: 'หาความยาวของเส้นรอบวง (π = 22/7)', a: '176', unit: 'ซม.', hint: '2 × 22/7 × 28' },
  { fig: c8r('98 ซม.', 'd'), q: 'หาความยาวของเส้นรอบวง (π = 22/7)', a: '308', unit: 'ซม.', hint: '22/7 × 98' },
  { fig: c8r('3.5 ม.'), q: 'หาความยาวของเส้นรอบวง (π = 22/7)', a: '22', unit: 'ม.', hint: '2 × 22/7 × 3.5' },
  { fig: c8r('2 ม.'), q: 'หาความยาวของเส้นรอบวง (π = 3.14)', a: '12.56', unit: 'ม.', hint: '2 × 3.14 × 2' },
  { fig: c8r('48 ซม.', 'd'), q: 'หาความยาวของเส้นรอบวง (π = 3.14)', a: '150.72', unit: 'ซม.', hint: '3.14 × 48' },
  { fig: c8r('20 ม.'), q: 'หาความยาวของเส้นรอบวง (π = 3.14)', a: '125.6', unit: 'ม.', hint: '2 × 3.14 × 20' }];
const C8_AREA = [
  { fig: c8r('14 ซม.'), q: 'หาพื้นที่ของวงกลม (π = 22/7)', a: '616', unit: 'ตร.ซม.', hint: '22/7 × 14 × 14' },
  { fig: c8r('20 ซม.', 'd'), q: 'หาพื้นที่ของวงกลม (π = 3.14)', a: '314', unit: 'ตร.ซม.', hint: 'รัศมี 10 → 3.14 × 10 × 10' },
  { fig: c8r('3.5 ม.'), q: 'หาพื้นที่ของวงกลม (π = 22/7)', a: '38.5', unit: 'ตร.ม.', hint: '22/7 × 3.5 × 3.5' },
  { fig: c8r('2.8 ม.', 'd'), q: 'หาพื้นที่ของวงกลม (π = 22/7)', a: '6.16', unit: 'ตร.ม.', hint: 'รัศมี 1.4 → 22/7 × 1.4 × 1.4' }];
const C8_SHADE = [ // แบบฝึกทักษะ
  { fig: circSVG({ rings: [{ c: [200, 130], R: 112, r: 32, fill: '#FFD27A' }], segs: [{ a: [200, 130], b: c8xy([200, 130], 112, -8), label: '7 ซม.', at: .75 }, { a: [200, 130], b: c8xy([200, 130], 32, 130), label: '2', off: 12 }], pts: [{ p: [200, 130] }] }), q: 'หาพื้นที่ส่วนที่ระบายสี (π = 3.14)', a: '141.3', unit: 'ตร.ซม.', hint: '3.14 × 7 × 7 − 3.14 × 2 × 2' },
  { fig: circSVG({ rings: [{ c: [200, 120], R: 100, r: 60, oc: [200, 160], fill: '#FFD27A' }], segs: [{ a: [200, 120], b: c8xy([200, 120], 100, 50), label: '5 ซม.', at: .7 }, { a: [200, 160], b: c8xy([200, 160], 60, 200), label: '3 ซม.', off: 12 }], pts: [{ p: [200, 120] }, { p: [200, 160] }] }), q: 'หาพื้นที่ส่วนที่ระบายสี (π = 3.14)', a: '50.24', unit: 'ตร.ซม.', hint: '3.14 × 5 × 5 − 3.14 × 3 × 3' },
  { fig: circSVG({ under: '<rect x="90" y="20" width="220" height="220" fill="#FFD27A" stroke="#2B2550" stroke-width="2.4"/>', circles: [{ c: [200, 130], r: 110, fill: '#FFFFFF' }], texts: [[[200, 258 - 4], '14 ซม.']] , W: 400, H: 270 }), q: 'ตัดวงกลมใหญ่ที่สุดจากกระดาษสี่เหลี่ยมจัตุรัสยาวด้านละ 14 ซม. เหลือเศษกระดาษ (ส่วนที่ระบายสี) กี่ตารางเซนติเมตร (π = 22/7)', a: '42', unit: 'ตร.ซม.', hint: '14 × 14 − 22/7 × 7 × 7' },
  { fig: circSVG({ raw: '<rect x="80" y="20" width="240" height="240" fill="#7EDDB8" stroke="#2B2550" stroke-width="2.4"/><path d="M120 260 A80 80 0 0 1 280 260 Z" fill="#FFFFFF" stroke="#2B2550" stroke-width="2.4"/>', texts: [[[200, 12], '6 ม.'], [[200, 248], '4 ม.']], segs: [{ a: [120, 256], b: [280, 256], col: '#E5487A', w: 2 }], W: 400, H: 270 }), q: 'แปลงหญ้ารูปสี่เหลี่ยมจัตุรัสยาวด้านละ 6 เมตร ขุดหญ้าออกเป็นรูปครึ่งวงกลมเส้นผ่านศูนย์กลาง 4 เมตร เหลือหญ้า (ส่วนที่ระบายสี) กี่ตารางเมตร (π = 3.14)', a: '29.72', unit: 'ตร.ม.', hint: '6 × 6 − 1/2 × 3.14 × 2 × 2' }];
const C8S = [ // โจทย์ปัญหา
  D6S('โดนัทล้อมรั้วรอบสนามหญ้ารูปครึ่งวงกลมรัศมี 7 เมตร (ทั้งส่วนโค้งและเส้นผ่านศูนย์กลาง) ต้องใช้รั้วยาวกี่เมตร (π = 22/7)', '1/2 × 2 × 22/7 × 7 + 2 × 7', ['2 × 22/7 × 7', '1/2 × 2 × 22/7 × 7'], 'เมตร'),
  D6S('โต๊ะกลมเส้นผ่านศูนย์กลาง 280 เซนติเมตร ติดหมุดรอบขอบทุก ๆ 40 เซนติเมตร หนึ่งรอบติดหมุดได้กี่ตัว (π = 22/7)', '22/7 × 280 ÷ 40', ['22/7 × 280', '22/7 × 140 ÷ 40'], 'ตัว'),
  D6S('พันริบบิ้นรอบโปสเตอร์ม้วนเป็นทรงกระบอกเส้นผ่านศูนย์กลาง 14 เซนติเมตร 1 รอบ และเหลือไว้ผูกโบว์อีก 15 เซนติเมตร ต้องใช้ริบบิ้นกี่เซนติเมตร (π = 22/7)', '22/7 × 14 + 15', ['22/7 × 14', '22/7 × 7 × 7 + 15'], 'เซนติเมตร'),
  D6S('ปลูกดอกบานชื่นรอบสระน้ำวงกลมเส้นผ่านศูนย์กลาง 4.2 เมตร (420 ซม.) เว้นระยะ 20 เซนติเมตรต่อ 1 ต้น ปลูกได้กี่ต้น (π = 22/7)', '22/7 × 420 ÷ 20', ['22/7 × 4.2 ÷ 20', '22/7 × 210 ÷ 20'], 'ต้น'),
  D6S('ถักลูกไม้รอบผ้าปูโต๊ะวงกลม 10 ผืน แต่ละผืนมีเส้นผ่านศูนย์กลาง 112 เซนติเมตร ต้องถักลูกไม้ยาวกี่เซนติเมตร (π = 22/7)', '22/7 × 112 × 10', ['22/7 × 112', '22/7 × 56 × 56 × 10'], 'เซนติเมตร'),
  D6S('ตัดกระดาษเป็นครึ่งวงกลมรัศมี 35 เซนติเมตร ทาสีทั้งสองด้าน ต้องทาสีพื้นที่ทั้งหมดกี่ตารางเซนติเมตร (π = 22/7)', '1/2 × 22/7 × 35 × 35 × 2', ['22/7 × 35 × 35 × 2', '1/2 × 22/7 × 35 × 35'], 'ตารางเซนติเมตร'),
  D6S('โต๊ะกลมเส้นผ่านศูนย์กลาง 2.8 เมตร ทาสีตารางเมตรละ 250 บาท ต้องจ่ายค่าทาสีกี่บาท (π = 22/7)', '22/7 × 1.4 × 1.4 × 250', ['22/7 × 2.8 × 2.8 × 250', '2 × 22/7 × 1.4 × 250'], 'บาท'),
  D6S('สนามเด็กเล่นรูปครึ่งวงกลมเส้นผ่านศูนย์กลาง 100 เมตร มีพื้นที่กี่ตารางเมตร (π = 3.14)', '1/2 × 3.14 × 50 × 50', ['3.14 × 50 × 50', '1/2 × 3.14 × 100 × 100'], 'ตารางเมตร'),
  D6S('ป้ายวงกลมรัศมี 21 เซนติเมตร ค่าทาสีตารางเซนติเมตรละ 0.5 บาท ค่าทาสีป้ายกี่บาท (π = 22/7)', '22/7 × 21 × 21 × 0.5', ['2 × 22/7 × 21 × 0.5', '22/7 × 42 × 42 × 0.5'], 'บาท'),
  D6S('สวนวงกลมเส้นผ่านศูนย์กลาง 80 เมตร ตรงกลางมีสระน้ำพุรูปครึ่งวงกลมรัศมี 20 เมตร ปูหญ้าส่วนที่ไม่ใช่สระ ต้องใช้หญ้ากี่ตารางเมตร (π = 3.14)', '3.14 × 40 × 40 − 1/2 × 3.14 × 20 × 20', ['3.14 × 80 × 80 − 3.14 × 20 × 20', '3.14 × 40 × 40 − 3.14 × 20 × 20'], 'ตารางเมตร'),
  D6S('จานใบแรกมีพื้นที่ 706.5 ตารางเซนติเมตร (รัศมี 15 ซม.) จานใบที่สองรัศมียาวกว่าใบแรก 2.5 เซนติเมตร ขอบจานใบที่สองยาวโดยรอบกี่เซนติเมตร (π = 3.14)', '2 × 3.14 × 17.5', ['2 × 3.14 × 15', '3.14 × 17.5 × 17.5'], 'เซนติเมตร'),
  D6S('นิสาตัดกระดาษเป็นวงกลมมีขอบยาว 75.36 เซนติเมตร (รัศมี 12 ซม.) กระดาษมีพื้นที่กี่ตารางเซนติเมตร (π = 3.14)', '3.14 × 12 × 12', ['3.14 × 75.36', '3.14 × 24 × 24'], 'ตารางเซนติเมตร'),
  D6S('อ่างปลามีก้นเป็นวงกลม ความยาวรอบอ่าง 942 เซนติเมตร (รัศมี 150 ซม.) ก้นอ่างมีพื้นที่กี่ตารางเซนติเมตร (π = 3.14)', '3.14 × 150 × 150', ['3.14 × 300 × 300', '2 × 3.14 × 150'], 'ตารางเซนติเมตร'),
  D6S('พิซซ่าถาดหนึ่งมีเส้นรอบวง 66 เซนติเมตร (รัศมี 10.5 ซม.) ตัดเป็น 6 ส่วนเท่า ๆ กัน แต่ละส่วนมีพื้นที่กี่ตารางเซนติเมตร (π = 22/7)', '22/7 × 10.5 × 10.5 ÷ 6', ['22/7 × 10.5 × 10.5', '22/7 × 21 × 21 ÷ 6'], 'ตารางเซนติเมตร'),
  D6S('จานใบหนึ่งยาวโดยรอบ 110 เซนติเมตร (รัศมี 17.5 ซม.) จานมีพื้นที่กี่ตารางเซนติเมตร (π = 22/7)', '22/7 × 17.5 × 17.5', ['22/7 × 35 × 35', '2 × 22/7 × 17.5'], 'ตารางเซนติเมตร'),
  D6S('ผ้ารองโต๊ะวงกลมเส้นรอบวง 628 ซม. (เส้นผ่านศูนย์กลาง 2 ม.) ตัดจากผ้าสี่เหลี่ยมจัตุรัส 3 × 3 เมตร ได้มากที่สุด 1 ผืน เหลือเศษผ้ากี่ตารางเมตร (π = 3.14)', '3 × 3 − 3.14 × 1 × 1', ['3 × 3 − 2 × 3.14 × 1', '3.14 × 1 × 1'], 'ตารางเมตร'),
  D6S('เค้กวงกลมเส้นรอบวง 95.71 ซม. (รัศมี 15.24 ซม. = 6 นิ้ว) แต่งหน้าเค้กตารางนิ้วละ 2.5 บาท ค่าแต่งหน้าเค้กกี่บาท (π = 3.14)', '3.14 × 6 × 6 × 2.5', ['3.14 × 15.24 × 15.24 × 2.5', '2 × 3.14 × 6 × 2.5'], 'บาท'),
  D6S('สระน้ำวงกลมรัศมี 10 เมตร มีทางเดินกว้าง 2 เมตรรอบสระ ทางเดินมีพื้นที่กี่ตารางเมตร (π = 3.14)', '3.14 × 12 × 12 − 3.14 × 10 × 10', ['3.14 × 2 × 2', '3.14 × 12 × 12'], 'ตารางเมตร'),
  D6S('ดัดลวดยาว 88 เซนติเมตรเป็นวงกลม (รัศมี 14 ซม.) วงกลมนี้มีพื้นที่กี่ตารางเซนติเมตร (π = 22/7)', '22/7 × 14 × 14', ['2 × 22/7 × 14', '22/7 × 28 × 28'], 'ตารางเซนติเมตร')];
const c8num = o => Q.t6Num({ fig: o.fig, q: o.q, a: o.a, unit: o.unit, hint: o.hint });

/* =========================================================
   LEVELS 841–852
   ========================================================= */
const L6O = (no, place, title, short, goal, teach, game) => ({ id: 840 + no, place, title, short, tone: TONES5[(no + 4) % 6], goal, teach, game });
const LESSONS_P6C8 = [
  L6O(1, 'ทะเลสาบวงกลม', 'ส่วนต่าง ๆ ของวงกลม', 'ส่วนของวงกลม', 'บอกส่วนต่าง ๆ ของวงกลม: จุดศูนย์กลาง รัศมี เส้นผ่านศูนย์กลาง และเส้นรอบวง', [
    T('ยินดีต้อนรับสู่ <b>ภูเขาวงกลม</b>! ลากจุดสีม่วงไปรอบวง แล้วลากรัศมีหลาย ๆ เส้น — ยาวเท่ากันไหม?', 'ยินดีต้อนรับสู่ภูเขาวงกลม ลากจุดสีม่วงไปรอบวง แล้วลากรัศมีหลาย ๆ เส้น ยาวเท่ากันไหม', el => el.append(simCircParts())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['จุดศูนย์กลาง', 'จุดที่อยู่ห่างจากทุกจุดบนวงกลมเท่ากัน'], ['รัศมี', 'ส่วนของเส้นตรงจากจุดศูนย์กลางไปยังจุดบนวงกลม — ทุกเส้นยาวเท่ากัน'], ['เส้นผ่านศูนย์กลาง', 'ส่วนของเส้นตรงที่<b>ผ่านจุดศูนย์กลาง</b> ปลายทั้งสองอยู่บนวงกลม = 2 × รัศมี'], ['เส้นรอบวง', 'ความยาวรอบวงกลม']], 'รัศมี 6 ซม. → เส้นผ่านศูนย์กลาง 12 ซม.', 'รัศมีหกเซนติเมตร เส้นผ่านศูนย์กลางสิบสองเซนติเมตร')))],
    () => [Q.c8Pick({ fig: C8_W2a, q: 'จุดศูนย์กลางของวงกลมนี้คือจุดใด', opts: ['จุด B', 'จุด A', 'จุด G'], right: 'จุด B' }),
      Q.c8Pick({ fig: C8_W2a, q: 'ข้อใดเป็นเส้นผ่านศูนย์กลาง', opts: ['DE', 'BD', 'BE'], right: 'DE', hint: 'ต้องผ่านจุดศูนย์กลาง และปลายทั้งสองอยู่บนวงกลม' }),
      Q.c8Pick({ fig: C8_W2b, q: 'ข้อใด<b>ไม่ใช่</b>รัศมี', opts: ['คง', 'ฉช', 'ฉก'], right: 'คง', hint: 'รัศมีต้องเริ่มที่จุดศูนย์กลาง ฉ' }),
      Q.c8Pick({ fig: C8_W2b, q: 'คง เป็นเส้นผ่านศูนย์กลางหรือไม่', opts: ['ไม่เป็น เพราะไม่ผ่านจุดศูนย์กลาง', 'เป็น เพราะปลายอยู่บนวงกลม', 'เป็นรัศมี'], right: 'ไม่เป็น เพราะไม่ผ่านจุดศูนย์กลาง' }),
      Q.dPick({ q: 'ขอบของสิ่งใดเป็นรูปวงกลม', opts: ['เหรียญ 5 บาท', 'ไข่ไก่', 'ลูกโป่งทรงยาว'], right: 'เหรียญ 5 บาท' }),
      Q.dPick({ q: 'วงกลมมีรัศมียาว 4.5 ซม. เส้นผ่านศูนย์กลางยาวเท่าใด', opts: ['9 ซม.', '2.25 ซม.', '4.5 ซม.'], right: '9 ซม.' })]),
  L6O(2, 'ป้ายชื่อวงกลม', 'การเรียกชื่อวงกลมและส่วนต่าง ๆ ของวงกลม', 'เรียกชื่อวงกลม', 'เรียกชื่อวงกลมตามจุดศูนย์กลาง และเรียกชื่อรัศมีและเส้นผ่านศูนย์กลางตามจุดปลาย', [
    T('<b>แตะ</b>เส้นแต่ละเส้นในวงกลม O — เส้นไหนเป็นอะไร?', 'แตะเส้นแต่ละเส้นในวงกลมโอ เส้นไหนเป็นอะไร', el => el.append(simNameTap())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['① ชื่อวงกลม', 'เรียกตามจุดศูนย์กลาง เช่น จุดศูนย์กลาง M → “วงกลม M”'], ['② ชื่อรัศมี', 'ใช้ชื่อจุดสองจุด เช่น MA หรือ AM'], ['③ ชื่อเส้นผ่านศูนย์กลาง', 'ใช้ชื่อจุดปลายสองจุด เช่น AB (ผ่าน M)'], ['④ ความยาว', 'ถ้า AB ยาว 12 ซม. → รัศมี MA = 6 ซม.']], 'วงกลม M: รัศมี 6 ซม. เส้นผ่านศูนย์กลาง 12 ซม.', 'วงกลมเอ็ม รัศมีหกเซนติเมตร')))],
    () => [...C8_W3.map(c8num), Q.c8Pick({ fig: C8_W2b, q: 'วงกลมนี้เรียกชื่อว่าอะไร', opts: ['วงกลม ฉ', 'วงกลม ก', 'วงกลม กข'], right: 'วงกลม ฉ', hint: 'เรียกตามจุดศูนย์กลาง' })]),
  L6O(3, 'ลานวงเวียน', 'การสร้างวงกลม', 'สร้างวงกลม', 'สร้างวงกลมด้วยวงเวียนเมื่อกำหนดรัศมีหรือเส้นผ่านศูนย์กลาง', [
    T('ปรับระยะกางวงเวียนบนไม้บรรทัด แล้ว<b>หมุนวงเวียน</b>', 'ปรับระยะกางวงเวียนบนไม้บรรทัด แล้วหมุนวงเวียน', el => el.append(simCompass())),
    T('ขั้นตอนการสร้าง: วงกลม 2 วงที่มี<b>จุดศูนย์กลางร่วมกัน</b> (รัศมี 2 ซม. และเส้นผ่านศูนย์กลาง 6 ซม.)', 'ขั้นตอนการสร้างวงกลมสองวงที่มีจุดศูนย์กลางร่วมกัน', el => el.append(c8col(simLayers(`<circle cx="300" cy="150" r="5" fill="#E5487A"/><text x="310" y="145" class="g6l">O</text>`, [
      ['① กำหนดจุดศูนย์กลาง', 'จุด O', ''], ['② กางวงเวียน 2 ซม.', 'จุดปลายเหล็กที่ O หมุนวงเวียน ได้วงกลมรัศมี 2 ซม.', c8C(300, 150, 60)],
      ['③ เส้นผ่านศูนย์กลาง 6 ซม.', 'รัศมี = 6 ÷ 2 = 3 ซม. → กางวงเวียน 3 ซม.', `<path d="M300 150 L390 150" stroke="#E5487A" stroke-width="2.4" stroke-dasharray="6 4"/><text x="330" y="140" class="g6l" fill="#E5487A">3 ซม.</text>`],
      ['④ หมุนวงเวียน', 'ได้วงกลมวงที่สองที่มีจุดศูนย์กลาง O ร่วมกัน', c8C(300, 150, 90, '#1B8862')]], 'กำหนดเส้นผ่านศูนย์กลาง → <b>หารด้วย 2</b> ก่อนกางวงเวียน'))))],
    () => [Q.dPick({ q: 'สร้างวงกลม A ที่มีรัศมียาว 1.5 เซนติเมตร ต้องกางวงเวียนกว้างเท่าใด', opts: ['1.5 ซม.', '3 ซม.', '0.75 ซม.'], right: '1.5 ซม.' }),
      Q.dPick({ q: 'สร้างวงกลมที่มีเส้นผ่านศูนย์กลางยาว 5 เซนติเมตร ต้องกางวงเวียนกว้างเท่าใด', opts: ['2.5 ซม.', '5 ซม.', '10 ซม.'], right: '2.5 ซม.', hint: 'กางวงเวียน = รัศมี = เส้นผ่านศูนย์กลาง ÷ 2' }),
      Q.dPick({ q: 'วงกลมที่มี “จุดศูนย์กลางร่วมกัน” หมายถึงข้อใด', opts: ['วงกลมหลายวงที่ใช้จุดศูนย์กลางจุดเดียวกัน', 'วงกลมที่มีรัศมีเท่ากัน', 'วงกลมที่สัมผัสกัน'], right: 'วงกลมหลายวงที่ใช้จุดศูนย์กลางจุดเดียวกัน' }),
      Q.dPick({ q: 'สร้างวงกลม 3 วงที่มีจุดศูนย์กลางร่วมกัน วงเล็กสุดรัศมี 1.5 ซม. และรัศมีแต่ละวงต่างกัน 1.5 ซม. วงใหญ่สุดมีรัศมีเท่าใด', opts: ['4.5 ซม.', '3 ซม.', '6 ซม.'], right: '4.5 ซม.', hint: '1.5 → 3 → 4.5' }),
      Q.dPick({ q: 'วงกลม A มี AB เป็นรัศมียาว 5 ซม. วงกลม B มีเส้นผ่านศูนย์กลาง 5 ซม. สร้างวงกลม B ต้องกางวงเวียนกว้างเท่าใด', opts: ['2.5 ซม.', '5 ซม.', '10 ซม.'], right: '2.5 ซม.' })]),
  L6O(4, 'ล้อกลิ้งภูเขา', 'ความสัมพันธ์ระหว่างความยาวของเส้นรอบวงกับความยาวของเส้นผ่านศูนย์กลาง', 'เส้นรอบวง ÷ เส้นผ่านศูนย์กลาง', 'รู้ว่าเส้นรอบวง ÷ เส้นผ่านศูนย์กลาง มีค่าประมาณ 3.14 หรือ 22/7 เรียกว่า π (พาย)', [
    T('เลือกขนาดล้อ แล้ว<b>กลิ้ง 1 รอบ</b> — วัดระยะทางที่ได้ เทียบกับเส้นผ่านศูนย์กลาง', 'เลือกขนาดล้อ แล้วกลิ้งหนึ่งรอบ วัดระยะทางที่ได้ เทียบกับเส้นผ่านศูนย์กลาง', el => el.append(simRoll())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['กระป๋อง', 'เส้นผ่านศูนย์กลาง 7 ซม. พันเชือกรอบ 1 รอบ ยาว 22 ซม. → 22 ÷ 7 ≈ 3.14'], ['จาน', 'เส้นผ่านศูนย์กลาง 25 ซม. เส้นรอบวง 78.5 ซม. → 78.5 ÷ 25 = 3.14'], ['สรุป', 'เส้นรอบวง ÷ เส้นผ่านศูนย์กลาง ≈ 3.14 เสมอ ไม่ว่าวงกลมจะใหญ่หรือเล็ก']], 'π ≈ 3.14 หรือ [22/7]'.replace('[22/7]', '22/7'), 'พายประมาณสามจุดหนึ่งสี่')))],
    () => [Q.dPick({ q: 'ความยาวของเส้นรอบวง ÷ ความยาวของเส้นผ่านศูนย์กลาง มีค่าประมาณเท่าใด', opts: ['3.14', '2', '6.28'], right: '3.14' }),
      Q.dPick({ q: 'สัญลักษณ์ π อ่านว่าอะไร', opts: ['พาย', 'พี', 'ไพ่'], right: 'พาย' }),
      Q.dPick({ q: 'ข้อใดเป็นค่าประมาณของ π', opts: ['22/7 หรือ 3.14', '7/22 หรือ 0.31', '3 หรือ 4'], right: '22/7 หรือ 3.14' }),
      Q.dPick({ q: 'เส้นรอบวงยาวประมาณกี่เท่าของเส้นผ่านศูนย์กลาง', opts: ['มากกว่า 3 เท่าเล็กน้อย', '2 เท่า', '4 เท่า'], right: 'มากกว่า 3 เท่าเล็กน้อย' }),
      Q.t6Num({ q: 'ล้อเส้นผ่านศูนย์กลาง 7 ซม. กลิ้งไป 1 รอบ ได้ระยะทางประมาณกี่เซนติเมตร (π = 22/7)', a: '22', unit: 'ซม.', hint: '22/7 × 7' }),
      Q.t6Num({ q: 'วงกลมมีเส้นรอบวง 31.4 ซม. เส้นผ่านศูนย์กลางยาวกี่เซนติเมตร (π = 3.14)', a: '10', unit: 'ซม.', hint: '31.4 ÷ 3.14' })]),
  L6O(5, 'ทางเดินรอบสระ', 'การหาความยาวของเส้นรอบวง', 'ความยาวเส้นรอบวง', 'หาความยาวของเส้นรอบวง = 2 × π × รัศมี = π × เส้นผ่านศูนย์กลาง และหารัศมีจากเส้นรอบวง', [
    T('ปรับรัศมีและเลือกค่า π — ดูเส้นรอบวงที่คลี่ออก', 'ปรับรัศมีและเลือกค่าพาย ดูเส้นรอบวงที่คลี่ออก', el => el.append(simCircum())),
    T('ตัวอย่างทีละขั้น: หาย้อนกลับ', 'ตัวอย่างทีละขั้น หาย้อนกลับ', el => el.append(dcWalk('', [['โจทย์', 'วงกลมมีเส้นรอบวง 94.2 ซม. รัศมียาวเท่าใด (π = 3.14)'], ['① สูตร', '2 × 3.14 × รัศมี = 94.2'], ['② 2 × 3.14', '= 6.28'], ['③ หาร', 'รัศมี = 94.2 ÷ 6.28 = 15']], 'รัศมี = <b>15 ซม.</b>', 'รัศมีสิบห้าเซนติเมตร')))],
    () => [...C8_CIR.map(c8num), Q.t6Num({ q: 'วงกลมมีเส้นรอบวงยาว 251.2 ซม. มีรัศมียาวกี่เซนติเมตร (π = 3.14)', a: '40', unit: 'ซม.', hint: '251.2 ÷ (2 × 3.14)' }), Q.t6Num({ q: 'วงกลมมีเส้นรอบวงยาว 37.68 เมตร มีเส้นผ่านศูนย์กลางยาวกี่เมตร (π = 3.14)', a: '12', unit: 'ม.', hint: '37.68 ÷ 3.14' })]),
  L6O(6, 'ลานพิซซ่า', 'การหาสูตรการหาพื้นที่ของวงกลม', 'ที่มาของสูตรพื้นที่', 'หาสูตรพื้นที่วงกลมโดยตัดเป็นชิ้นเล็ก ๆ แล้วเรียงเป็นรูปคล้ายสี่เหลี่ยมผืนผ้า ยาว πr กว้าง r → πr²', [
    T('เพิ่มจำนวนชิ้น — ชิ้นวงกลมที่เรียงสลับกันเหมือนอะไรมากขึ้น?', 'เพิ่มจำนวนชิ้น ชิ้นวงกลมที่เรียงสลับกันเหมือนอะไรมากขึ้น', el => el.append(simSectors())),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('', [['① ตัดวงกลม', 'ตัดเป็นชิ้นเท่า ๆ กันหลายชิ้น ครึ่งหนึ่งสีฟ้า ครึ่งหนึ่งสีส้ม'], ['② เรียงสลับ', 'ได้รูปคล้ายสี่เหลี่ยมผืนผ้า'], ['③ ด้านยาว', 'ครึ่งหนึ่งของเส้นรอบวง = ½ × 2πr = πr'], ['④ ด้านกว้าง', 'รัศมี r'], ['⑤ พื้นที่', 'πr × r = πr²']], 'พื้นที่วงกลม = π × r × r', 'พื้นที่วงกลมเท่ากับพายคูณรัศมีคูณรัศมี')))],
    () => [Q.dPick({ q: 'ตัดวงกลมเป็นชิ้นเล็ก ๆ แล้วเรียงสลับกัน จะได้รูปคล้ายรูปใด', opts: ['รูปสี่เหลี่ยมผืนผ้า', 'รูปสามเหลี่ยม', 'รูปวงกลมใหญ่ขึ้น'], right: 'รูปสี่เหลี่ยมผืนผ้า' }),
      Q.dPick({ q: 'ด้านยาวของรูปที่เรียงได้ ยาวประมาณเท่าใด', opts: ['ครึ่งหนึ่งของเส้นรอบวง (πr)', 'เส้นรอบวงทั้งหมด (2πr)', 'รัศมี (r)'], right: 'ครึ่งหนึ่งของเส้นรอบวง (πr)' }),
      Q.dPick({ q: 'ด้านกว้างของรูปที่เรียงได้ ยาวประมาณเท่าใด', opts: ['รัศมี', 'เส้นผ่านศูนย์กลาง', 'เส้นรอบวง'], right: 'รัศมี' }),
      Q.dPick({ q: 'สูตรพื้นที่ของวงกลมคือข้อใด', opts: ['π × r × r', '2 × π × r', 'π × d'], right: 'π × r × r', hint: 'πr × r' }),
      c8num(C8_AREA[0]), c8num(C8_AREA[1])]),
  L6O(7, 'ทุ่งดอกไม้กลม', 'การหาพื้นที่วงกลมโดยใช้สูตร', 'พื้นที่ (สูตร)', 'หาพื้นที่วงกลมด้วยสูตร π × r × r และหารัศมีเมื่อรู้พื้นที่', [
    T('ปรับรัศมี — วงกลมใหญ่กว่าสี่เหลี่ยม r × r ประมาณ <b>3.14 เท่า</b>', 'ปรับรัศมี วงกลมใหญ่กว่าสี่เหลี่ยมอาร์คูณอาร์ ประมาณสามจุดหนึ่งสี่เท่า', el => el.append(simCircArea())),
    T('ตัวอย่างทีละขั้น: รู้พื้นที่ หารัศมี', 'ตัวอย่างทีละขั้น รู้พื้นที่ หารัศมี', el => el.append(dcWalk('', [['โจทย์', 'วงกลมมีพื้นที่ 113.04 ตร.ซม. รัศมียาวเท่าใด (π = 3.14)'], ['① หารด้วย π', '113.04 ÷ 3.14 = 36 = r × r'], ['② หาจำนวนที่คูณตัวเองได้ 36', '6 × 6 = 36']], 'รัศมี = <b>6 ซม.</b>', 'รัศมีหกเซนติเมตร')))],
    () => [c8num(C8_AREA[2]), c8num(C8_AREA[3]), Q.t6Num({ q: 'วงกลมมีพื้นที่ 78.5 ตารางเซนติเมตร มีรัศมียาวกี่เซนติเมตร (π = 3.14)', a: '5', unit: 'ซม.', hint: '78.5 ÷ 3.14 = 25 = 5 × 5' }),
      Q.t6Num({ q: 'ต้องการตัดกระดาษเป็นวงกลมให้มีพื้นที่ 616 ตารางเซนติเมตร ต้องใช้รัศมียาวกี่เซนติเมตร (π = 22/7)', a: '14', unit: 'ซม.', hint: '616 ÷ 22/7 = 196 = 14 × 14' }),
      Q.t6Num({ q: 'วงกลมมีรัศมี 9 ซม. มีพื้นที่กี่ตารางเซนติเมตร (π = 3.14)', a: '254.34', unit: 'ตร.ซม.', hint: '3.14 × 9 × 9' })]),
  L6O(8, 'วงแหวนหิมะ', 'การแก้ปัญหาเกี่ยวกับพื้นที่ของวงกลม', 'พื้นที่ส่วนที่ระบาย', 'หาพื้นที่ส่วนที่ระบายสีที่เกิดจากวงกลมและรูปอื่น โดยนำพื้นที่มาบวกหรือลบกัน', [
    T('ปรับรัศมีวงใหญ่และวงเล็ก — พื้นที่วงแหวน = วงใหญ่ − วงเล็ก', 'ปรับรัศมีวงใหญ่และวงเล็ก พื้นที่วงแหวนเท่ากับวงใหญ่ลบวงเล็ก', el => el.append(simRing())),
    T('ตัวอย่างทีละขั้น: หาจากพื้นที่ที่ระบาย', 'ตัวอย่างทีละขั้น หาจากพื้นที่ที่ระบาย', el => el.append(dcWalk('', [['โจทย์', 'วงกลม A รัศมี 1 ซม. อยู่ในวงกลม B (จุดศูนย์กลางร่วม) พื้นที่ระหว่างวงทั้งสองเท่ากับ 16.485 ตร.ซม. วงกลม B รัศมีเท่าใด (π = 3.14)'], ['① หารด้วย π', '16.485 ÷ 3.14 = 5.25'], ['② บวกพื้นที่วงเล็กกลับ', 'r × r ของ B = 5.25 + 1 × 1 = 6.25'], ['③ หารัศมี', '2.5 × 2.5 = 6.25']], 'วงกลม B รัศมี <b>2.5 ซม.</b>', 'รัศมีสองจุดห้าเซนติเมตร')))],
    () => [...C8_SHADE.map(c8num), Q.dStory(C8S[9])]),
  L6O(9, 'ฐานโจทย์รอบวง', 'การแก้โจทย์ปัญหาเกี่ยวกับความยาวของเส้นรอบวง', 'โจทย์เส้นรอบวง', 'แก้โจทย์ปัญหาความยาวของเส้นรอบวง เช่น ล้อมรั้ว เจาะรู ปลูกต้นไม้รอบวง', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('ล้อจักรยานมีเส้นผ่านศูนย์กลาง 70 เซนติเมตร หมุน 50 รอบ จักรยานเคลื่อนที่ได้กี่เซนติเมตร (π = 22/7)', [{ q: 'ระยะทาง 1 รอบ = เส้นรอบวง', opts: ['22/7 × 70', '22/7 × 70 × 70', '2 × 70'], right: '22/7 × 70', unit: 'ซม.', why: 'เส้นรอบวง = π × เส้นผ่านศูนย์กลาง' }, { q: 'หมุน 50 รอบ', opts: ['220 × 50', '220 + 50', '220 ÷ 50'], right: '220 × 50', unit: 'ซม.', why: 'รอบละ 220 ซม. → คูณ' }], 'ตอบ <b>11,000</b> ซม. (110 เมตร)'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('กระดาษวงกลมแผ่นหนึ่งมีความยาวรอบวง 66 เซนติเมตร มีรัศมียาวกี่เซนติเมตร (π = 22/7)', [['① สูตร', '2 × 22/7 × รัศมี = 66'], ['② 2 × 22/7', '= 44/7'], ['③ หาร', 'รัศมี = 66 ÷ 44/7']], '66 ÷ 44/7')))],
    () => [0, 1, 2, 3, 4].map(i => Q.dStory(C8S[i]))),
  L6O(10, 'ฐานโจทย์พื้นที่', 'การแก้โจทย์ปัญหาเกี่ยวกับพื้นที่ของวงกลม', 'โจทย์พื้นที่วงกลม', 'แก้โจทย์ปัญหาพื้นที่ของวงกลมและครึ่งวงกลม รวมถึงคิดค่าใช้จ่าย', [
    T('วางแผนทีละขั้น: ตัดผ้าวงกลมได้กี่ผืน', 'วางแผนทีละขั้น ตัดผ้าวงกลมได้กี่ผืน', el => el.append(simStepPick('กระดาษผืนหนึ่งขนาด 2 × 2 เมตร (200 × 200 ซม.) ตัดเป็นวงกลมเส้นผ่านศูนย์กลาง 16 เซนติเมตร ได้มากที่สุดกี่แผ่น', [{ q: 'แถวหนึ่งวางได้กี่วง', opts: ['200 ÷ 16', '200 × 16', '200 − 16'], right: '200 ÷ 16', unit: 'วง (ใช้ได้ 12 วง)', why: '12.5 วง แต่ต้องเป็นวงเต็ม → 12 วง' }, { q: 'มี 12 แถว แถวละ 12 วง', opts: ['12 × 12', '12 + 12', '12.5 × 12.5'], right: '12 × 12', unit: 'ผืน', why: 'วางได้ทั้งแนวนอนและแนวตั้ง 12 วง' }], 'ตอบ ตัดได้ <b>144</b> ผืน — <b>ไม่ใช่</b>เอาพื้นที่มาหารกัน'))),
    T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', el => el.append(dcStory('ลานจอดรถรูปครึ่งวงกลมรัศมี 14 เมตร เทพื้นตารางเมตรละ 300 บาท ค่าเทพื้นกี่บาท (π = 22/7)', [['① พื้นที่ครึ่งวงกลม', '½ × 22/7 × 14 × 14 = 308 ตร.ม.'], ['② ค่าเทพื้น', '308 × 300']], '1/2 × 22/7 × 14 × 14 × 300')))],
    () => [...[5, 6, 7, 8].map(i => Q.dStory(C8S[i])), Q.hNum({ q: 'ผ้า 2 × 2 เมตร ตัดเป็นวงกลมเส้นผ่านศูนย์กลาง 16 ซม. ได้มากที่สุดกี่ผืน', head: '<span class="fsign">?</span> ผืน', a: 144, hint: '200 ÷ 16 = 12.5 → แถวละ 12 วง × 12 แถว' })]),
  L6O(11, 'ฐานรู้รอบรู้พื้นที่', 'การแก้โจทย์ปัญหาที่ต้องใช้ความรู้เกี่ยวกับพื้นที่ของวงกลม', 'ใช้ความรู้พื้นที่วงกลม', 'แก้โจทย์ปัญหาที่ต้องหารัศมีจากเส้นรอบวงหรือพื้นที่ก่อน แล้วจึงหาสิ่งที่โจทย์ถาม', [
    T('วางแผนทีละขั้น: รู้พื้นที่ → หารัศมี → หาเส้นรอบวง', 'วางแผนทีละขั้น รู้พื้นที่ หารัศมี หาเส้นรอบวง', el => el.append(simStepPick('จานใบแรกมีพื้นที่ 706.5 ตารางเซนติเมตร จานใบที่สองรัศมียาวกว่าใบแรก 2.5 ซม. ขอบจานใบที่สองยาวโดยรอบเท่าใด (π = 3.14)', [{ q: 'หา r × r ของใบแรก', opts: ['706.5 ÷ 3.14', '706.5 × 3.14', '706.5 ÷ 6.28'], right: '706.5 ÷ 3.14', unit: '= 15 × 15 → รัศมี 15 ซม.', why: 'พื้นที่ = 3.14 × r × r' }, { q: 'รัศมีใบที่สอง', opts: ['15 + 2.5', '15 − 2.5', '15 × 2.5'], right: '15 + 2.5', unit: 'ซม.', why: 'ยาวกว่า → บวก' }, { q: 'ความยาวรอบจาน', opts: ['2 × 3.14 × 17.5', '3.14 × 17.5 × 17.5', '3.14 × 17.5'], right: '2 × 3.14 × 17.5', unit: 'ซม.', why: 'เส้นรอบวง = 2πr' }], 'ตอบ <b>109.9</b> ซม.'))),
    T('ตัวอย่างทีละขั้น: รู้เส้นรอบวง → หาพื้นที่', 'ตัวอย่างทีละขั้น รู้เส้นรอบวง หาพื้นที่', el => el.append(dcStory('ฝาหม้อวงกลมมีเส้นรอบวง 132 เซนติเมตร ฝาหม้อมีพื้นที่กี่ตารางเซนติเมตร (π = 22/7)', [['① หารัศมี', '132 ÷ (2 × 22/7) = 21 ซม.'], ['② หาพื้นที่', '22/7 × 21 × 21']], '22/7 × 21 × 21')))],
    () => [10, 11, 12, 13, 14].map(i => Q.dStory(C8S[i]))),
  L6O(12, 'ยอดเขาวงกลม', 'การแก้โจทย์ปัญหาเกี่ยวกับความยาวรอบรูปและพื้นที่ของวงกลม', 'โจทย์รอบรูปและพื้นที่', 'แก้โจทย์ปัญหาที่ใช้ทั้งความยาวเส้นรอบวงและพื้นที่ของวงกลม รวมถึงการแปลงหน่วย', [
    T('วางแผนทีละขั้น', 'วางแผนทีละขั้น', el => el.append(simStepPick('ลานวงกลมรัศมี 21 เมตร ล้อมรั้วรอบลานเมตรละ 50 บาท และปูหญ้าเต็มลานตารางเมตรละ 20 บาท ค่าใช้จ่ายรวมกี่บาท (π = 22/7)', [{ q: 'ค่ารั้ว', opts: ['2 × 22/7 × 21 × 50', '22/7 × 21 × 21 × 50', '2 × 22/7 × 21'], right: '2 × 22/7 × 21 × 50', unit: 'บาท', why: 'รั้ว = เส้นรอบวง 132 ม.' }, { q: 'ค่าหญ้า', opts: ['22/7 × 21 × 21 × 20', '2 × 22/7 × 21 × 20', '22/7 × 21 × 20'], right: '22/7 × 21 × 21 × 20', unit: 'บาท', why: 'หญ้า = พื้นที่ 1,386 ตร.ม.' }, { q: 'รวม', opts: ['6600 + 27720', '6600 × 27720', '27720 − 6600'], right: '6600 + 27720', unit: 'บาท', why: 'รวมค่าใช้จ่าย → บวก' }], 'ตอบ <b>34,320</b> บาท'))),
    T('ตัวอย่างทีละขั้น: เศษผ้าที่เหลือ', 'ตัวอย่างทีละขั้น เศษผ้าที่เหลือ', el => el.append(dcStory('ตัดที่รองจานวงกลมเส้นผ่านศูนย์กลาง 10 ซม. 4 แผ่น จากกระดาษสี่เหลี่ยมจัตุรัสยาวด้านละ 20 ซม. เหลือเศษกระดาษกี่ตารางเซนติเมตร (π = 3.14)', [['① ผ้าทั้งผืน', '20 × 20 = 400'], ['② วงกลม 4 วง', '4 × 3.14 × 5 × 5 = 314'], ['③ เศษผ้า', '400 − 314']], '20 × 20 − 4 × 3.14 × 5 × 5')))],
    () => [15, 16, 17, 18].map(i => Q.dStory(C8S[i])).concat([Q.dStory(C8S[0])]))
];

/* =========================================================
   ========================================================= */
const EXAM_P6C8 = d6spread([
  { q: 'จุดศูนย์กลางของวงกลมนี้คือจุดใด', fig: C8_W2a, opts: ['จุด B', 'จุด A', 'จุด D', 'จุด G'], a: 0 },
  { q: 'จากรูป ข้อใด<b>ไม่ใช่</b>รัศมีและไม่ใช่เส้นผ่านศูนย์กลาง', fig: C8_W2b, opts: ['คง', 'ฉช', 'กข', 'ฉก'], a: 0 },
  { q: 'วงกลม P มีรัศมียาวเท่าใด', fig: C8_W3[0].fig, opts: ['5 ซม.', '10 ซม.', '20 ซม.', '2.5 ซม.'], a: 0 },
  { q: 'วงกลม B มีเส้นผ่านศูนย์กลางยาวเท่าใด', fig: C8_W3[2].fig, opts: ['14 ซม.', '7 ซม.', '8 ซม.', '16 ซม.'], a: 0 },
  { q: 'สร้างวงกลมที่มีเส้นผ่านศูนย์กลางยาว 5 เซนติเมตร ต้องกางวงเวียนกว้างเท่าใด', opts: ['2.5 ซม.', '5 ซม.', '10 ซม.', '1.5 ซม.'], a: 0 },
  { q: 'ความยาวของเส้นรอบวง ÷ ความยาวของเส้นผ่านศูนย์กลาง มีค่าประมาณเท่าใด', opts: ['3.14', '2', '6.28', '1.57'], a: 0 },
  { q: 'วงกลมมีเส้นผ่านศูนย์กลางยาว 98 ซม. เส้นรอบวงยาวเท่าใด (π = 22/7)', opts: ['308 ซม.', '616 ซม.', '154 ซม.', '196 ซม.'], a: 0 },
  { q: 'วงกลมมีรัศมียาว 2 เมตร เส้นรอบวงยาวเท่าใด (π = 3.14)', opts: ['12.56 ม.', '6.28 ม.', '25.12 ม.', '4 ม.'], a: 0 },
  { q: 'วงกลมมีเส้นรอบวงยาว 251.2 เซนติเมตร มีรัศมียาวเท่าใด (π = 3.14)', opts: ['40 ซม.', '80 ซม.', '20 ซม.', '125.6 ซม.'], a: 0 },
  { q: 'วงกลมมีเส้นผ่านศูนย์กลางยาว 2.8 เมตร มีพื้นที่เท่าใด (π = 22/7)', opts: ['6.16 ตร.ม.', '24.64 ตร.ม.', '8.8 ตร.ม.', '4.4 ตร.ม.'], a: 0 },
  { q: 'วงกลมรูปหนึ่งมีพื้นที่ 78.5 ตารางเซนติเมตร รัศมียาวเท่าใด (π = 3.14)', opts: ['5 ซม.', '25 ซม.', '10 ซม.', '12.5 ซม.'], a: 0 },
  { q: 'หาพื้นที่ส่วนที่ระบายสี (π = 3.14)', fig: C8_SHADE[0].fig, opts: ['141.3 ตร.ซม.', '153.86 ตร.ซม.', '78.5 ตร.ซม.', '12.56 ตร.ซม.'], a: 0 },
  { q: 'โต๊ะกลมเส้นผ่านศูนย์กลาง 280 เซนติเมตร ติดหมุดรอบขอบทุก ๆ 40 เซนติเมตร หนึ่งรอบติดหมุดได้กี่ตัว (π = 22/7)', opts: ['22 รู', '44 รู', '11 รู', '7 รู'], a: 0 },
  { q: 'ปลูกดอกบานชื่นรอบสระน้ำวงกลมเส้นผ่านศูนย์กลาง 4.2 เมตร เว้นระยะ 20 เซนติเมตรต่อ 1 ต้น ปลูกได้กี่ต้น (π = 22/7)', opts: ['66 ต้น', '33 ต้น', '132 ต้น', '21 ต้น'], a: 0 },
  { q: 'ตัดกระดาษเป็นครึ่งวงกลมรัศมี 35 เซนติเมตร ทาสีทั้งสองด้าน ต้องทาสีพื้นที่เท่าใด (π = 22/7)', opts: ['3,850 ตร.ซม.', '1,925 ตร.ซม.', '7,700 ตร.ซม.', '220 ตร.ซม.'], a: 0 },
  { q: 'โต๊ะกลมเส้นผ่านศูนย์กลาง 2.8 เมตร ทาสีตารางเมตรละ 250 บาท ต้องจ่ายค่าทาสีเท่าใด (π = 22/7)', opts: ['1,540 บาท', '6,160 บาท', '2,200 บาท', '770 บาท'], a: 0 },
  { q: 'จานใบแรกมีพื้นที่ 706.5 ตารางเซนติเมตร จานใบที่สองรัศมียาวกว่าใบแรก 2.5 เซนติเมตร ขอบจานใบที่สองยาวโดยรอบเท่าใด (π = 3.14)', opts: ['109.9 ซม.', '94.2 ซม.', '961.63 ซม.', '54.95 ซม.'], a: 0 },
  { q: 'อ่างปลามีก้นเป็นวงกลม ความยาวรอบอ่าง 942 เซนติเมตร ก้นอ่างมีพื้นที่เท่าใด (π = 3.14)', opts: ['70,650 ตร.ซม.', '282,600 ตร.ซม.', '942 ตร.ซม.', '35,325 ตร.ซม.'], a: 0 },
  { q: 'แม่ต้องการตัดผ้าปูโต๊ะวงกลมที่มีเส้นรอบวง 628 เซนติเมตร จากผ้าสี่เหลี่ยมจัตุรัสขนาด 3 × 3 เมตร ตัดได้มากที่สุดกี่ผืน และเหลือเศษผ้าเท่าใด (π = 3.14)', opts: ['1 ผืน เหลือ 5.86 ตร.ม.', '2 ผืน เหลือ 2.72 ตร.ม.', '1 ผืน เหลือ 6.86 ตร.ม.', '4 ผืน เหลือ 0 ตร.ม.'], a: 0 },
  { q: 'พอใจทำเค้กวงกลมเส้นรอบวง 95.71 เซนติเมตร ค่าแต่งหน้าเค้กตารางนิ้วละ 2.5 บาท จะคิดเงินกี่บาท (π = 3.14 และ 1 นิ้ว = 2.54 เซนติเมตร)', opts: ['282.6 บาท', '113.04 บาท', '1,823.3 บาท', '94.2 บาท'], a: 0 }
]);
LESSONS_P6C8.push({ id: 859, boss: true, place: 'ยอดเขาเยติวงกลม', title: 'ด่านบอส: บทที่ 8 วงกลม', short: 'ด่านบอส · ข้อสอบ', tone: 'pink',
  goal: 'คำถามท้ายบท 20 ข้อ (ส่วนต่าง ๆ ของวงกลม การสร้าง π เส้นรอบวง พื้นที่ และโจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อพิชิตยอดเขา',
  exam: EXAM_P6C8, pass: 10, bossName: 'เยติวงกลม', bossPal: 'pink', emblem: 'π', bossKind: 'yeti' });
