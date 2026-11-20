/* =========================================================
   prefix a4 · angles in degrees, counter-clockwise from → (screen y goes down, so a4P flips sin)
   - a4SVG({pts, lines, arcs, prot, plane, grid}) every figure · a4Prot protractor (outer scale 0 at `rot`, inner scale 0 at the other end, `flip` = lower half)
   - sims: simA4Plane · simA4Line · simA4Angle(mode) · simA4Measure (drag + rotate a real protractor, snaps onto the vertex / arm) · simA4Reflex
   - questions: Q.a4Grid · a4Kind · a4Draw (tap points in order) · a4Inter · a4Name · a4Count · a4Cmp90 (lay a paper corner on the angle) · a4Cls · a4ClsDeg
     a4Tap · a4Read (protractor already placed) · a4ReadR (reflex: read the small angle → 360 − x) · a4Calc · a4Build (tap the scale, ± 1°, check)
   ========================================================= */
const A4R = Math.PI / 180;
const a4P = (c, r, d) => [c[0] + r * Math.cos(d * A4R), c[1] - r * Math.sin(d * A4R)];
const a4dir = (a, b) => ((Math.atan2(a[1] - b[1], b[0] - a[0]) / A4R) % 360 + 360) % 360;
const a4n = x => Math.round(x * 10) / 10;
const a4cross = (p1, p2, p3, p4) => { const den = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]), t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / den; return [a4n(p1[0] + t * (p2[0] - p1[0])), a4n(p1[1] + t * (p2[1] - p1[1]))]; };
const A4_LAT = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split(''), A4_TH = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ด', 'ต', 'ท', 'น', 'บ', 'ป', 'พ', 'ฟ', 'ม', 'ย', 'ร', 'ล', 'ว', 'ส', 'ห', 'อ'];
const a4Letters = (k, th) => pkF(th == null ? (Math.random() < .35 ? A4_TH : A4_LAT) : th ? A4_TH : A4_LAT, k);
/* notation */
const a4Ang = s => { const [x, v, y] = [...s]; return `<span class="a4an">${x}<span class="a4hat">${v}</span>${y}</span>`; };
const a4m = s => `m(${a4Ang(s)})`;
const a4Sym = (k, ab) => `<span class="a4sym a4-${k}"><i></i>${ab}</span>`;
const A4K = { line: 'เส้นตรง', ray: 'รังสี', seg: 'ส่วนของเส้นตรง' };
const A4KIND = ['มุมแหลม', 'มุมฉาก', 'มุมป้าน', 'มุมตรง', 'มุมกลับ'];
const a4kind = d => d < 90 ? 0 : d === 90 ? 1 : d < 180 ? 2 : d === 180 ? 3 : 4;
const A4WHY = ['น้อยกว่า 90° (เล็กกว่ามุมฉาก)', 'เท่ากับ 90°', 'มากกว่า 90° แต่น้อยกว่า 180°', 'เท่ากับ 180° (แขนอยู่ในแนวเส้นตรงเดียวกัน)', 'มากกว่า 180° แต่น้อยกว่า 360°'];
/* ---------- drawing ---------- */
function a4Arrow(p, d, col) { const a = a4P(p, -9, d - 26), b = a4P(p, -9, d + 26); return `<path d="M${p[0]} ${p[1]} L${a[0]} ${a[1]} L${b[0]} ${b[1]}Z" fill="${col}"/>`; }
function a4Line(a, b, k, o = {}) { const col = o.col || '#2B2550', w = o.w || 3, d = a4dir(a, b), ext = o.ext || 34; let p = a, q = b, s = '';
  if (k === 'line') { p = a4P(a, ext, d + 180); q = a4P(b, ext, d); }
  if (k === 'ray') q = a4P(b, ext, d);
  s += `<line x1="${a4n(p[0])}" y1="${a4n(p[1])}" x2="${a4n(q[0])}" y2="${a4n(q[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${o.dash ? ' stroke-dasharray="7 6"' : ''}/>`;
  if (k === 'line') s += a4Arrow(p, d + 180, col) + a4Arrow(q, d, col);
  if (k === 'ray') s += a4Arrow(q, d, col);
  return s; }
function a4Arc(v, d1, d2, o = {}) { let st = d1, amt = ((d2 - d1) % 360 + 360) % 360; if (!o.reflex && amt > 180) { st = d2; amt = 360 - amt; } if (o.reflex && amt < 180) { st = d2; amt = 360 - amt; }
  const r = o.r || (o.reflex ? 22 : 30), col = o.col || '#E5487A', p1 = a4P(v, r, st), p2 = a4P(v, r, st + amt); let s = '';
  if (Math.abs(amt - 90) < .01 && o.rm !== false) { const k = 15, a = a4P(v, k, st), b = a4P(v, k, st + 90), c = a4P(a, k, st + 90); s += `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(c[0])} ${a4n(c[1])} L${a4n(b[0])} ${a4n(b[1])}" fill="${o.fill || 'rgba(229,72,122,.12)'}" stroke="${col}" stroke-width="2.2"/>`; }
  else if (amt > .5) { const big = amt > 180 ? 1 : 0, A = `A${r} ${r} 0 ${big} 0 ${a4n(p2[0])} ${a4n(p2[1])}`;
    if (Math.abs(amt - 180) < .01) { const m = a4P(v, r, st + 90); s += `<path d="M${v[0]} ${v[1]} L${a4n(p1[0])} ${a4n(p1[1])} A${r} ${r} 0 0 0 ${a4n(m[0])} ${a4n(m[1])} A${r} ${r} 0 0 0 ${a4n(p2[0])} ${a4n(p2[1])}Z" fill="${o.fill || 'rgba(229,72,122,.12)'}" stroke="none"/><path d="M${a4n(p1[0])} ${a4n(p1[1])} A${r} ${r} 0 0 0 ${a4n(m[0])} ${a4n(m[1])} A${r} ${r} 0 0 0 ${a4n(p2[0])} ${a4n(p2[1])}" fill="none" stroke="${col}" stroke-width="2.2"/>`; }
    else s += `<path d="M${v[0]} ${v[1]} L${a4n(p1[0])} ${a4n(p1[1])} ${A}Z" fill="${o.fill || 'rgba(229,72,122,.12)'}" stroke="none"/><path d="M${a4n(p1[0])} ${a4n(p1[1])} ${A}" fill="none" stroke="${col}" stroke-width="2.2"/>`; }
  if (o.lab != null) { const t = a4P(v, r + (o.labR || 16), st + amt / 2); s += `<text x="${a4n(t[0])}" y="${a4n(t[1]) + 5}" class="a4-al" text-anchor="middle" fill="${col}">${o.lab}</text>`; }
  if (o.hit != null) s += `<path class="a4-hit" data-i="${o.hit}" d="M${v[0]} ${v[1]} L${a4n(a4P(v, 46, st)[0])} ${a4n(a4P(v, 46, st)[1])} A46 46 0 ${amt > 180 ? 1 : 0} 0 ${a4n(a4P(v, 46, st + amt)[0])} ${a4n(a4P(v, 46, st + amt)[1])}Z" fill="rgba(0,0,0,0)"/>`;
  return s; }
function a4Prot(c, rot, o = {}) { const R = o.R || 118, sg = o.flip ? -1 : 1, D = k => rot + sg * k, br = '#C29A3A';
  const e1 = a4P(c, R, D(0)), e2 = a4P(c, R, D(180)), m = a4P(c, R, D(90));
  let s = `<g class="a4-prot${o.cls ? ' ' + o.cls : ''}">`;
  s += `<path class="a4-pbody" d="M${a4n(e1[0])} ${a4n(e1[1])} A${R} ${R} 0 0 ${o.flip ? 1 : 0} ${a4n(m[0])} ${a4n(m[1])} A${R} ${R} 0 0 ${o.flip ? 1 : 0} ${a4n(e2[0])} ${a4n(e2[1])}Z" fill="rgba(255,236,170,.62)" stroke="${br}" stroke-width="1.6"/>`;
  const ri = R * .2, i1 = a4P(c, ri, D(0)), i2 = a4P(c, ri, D(180)), im = a4P(c, ri, D(90));
  s += `<path d="M${a4n(i1[0])} ${a4n(i1[1])} A${ri} ${ri} 0 0 ${o.flip ? 1 : 0} ${a4n(im[0])} ${a4n(im[1])} A${ri} ${ri} 0 0 ${o.flip ? 1 : 0} ${a4n(i2[0])} ${a4n(i2[1])}" fill="none" stroke="${br}" stroke-width="1"/>`;
  for (let k = 0; k <= 180; k++) { const L = k % 10 === 0 ? 12 : k % 5 === 0 ? 8 : 4.5, a = a4P(c, R, D(k)), b = a4P(c, R - L, D(k)); s += `<line x1="${a4n(a[0])}" y1="${a4n(a[1])}" x2="${a4n(b[0])}" y2="${a4n(b[1])}" stroke="#6B5320" stroke-width="${k % 10 ? .7 : 1.1}"/>`;
    if (k % 10 === 0) { const t = a4P(c, R - 21, D(k)), u = a4P(c, R - 36, D(k)); s += `<text x="${a4n(t[0])}" y="${a4n(t[1]) + 3.4}" class="a4-po" text-anchor="middle">${k}</text>`;
      if (o.inner !== false) s += `<text x="${a4n(u[0])}" y="${a4n(u[1]) + 3}" class="a4-pi" text-anchor="middle">${180 - k}</text>`; } }
  s += `<line x1="${a4n(e1[0])}" y1="${a4n(e1[1])}" x2="${a4n(e2[0])}" y2="${a4n(e2[1])}" stroke="${br}" stroke-width="1.4"/><circle cx="${c[0]}" cy="${c[1]}" r="3" fill="none" stroke="#B5361E" stroke-width="1.5"/><path d="M${c[0]} ${c[1] - 7}V${c[1] + 7}" stroke="#B5361E" stroke-width="1"/>`;
  if (o.mark != null) { const p = a4P(c, R + 2, D(o.mark)), q = a4P(c, R + 14, D(o.mark) - 4), r = a4P(c, R + 14, D(o.mark) + 4); s += `<path d="M${a4n(p[0])} ${a4n(p[1])} L${a4n(q[0])} ${a4n(q[1])} L${a4n(r[0])} ${a4n(r[1])}Z" fill="#E5487A"/>`; }
  if (o.knob) { const k = a4P(c, R + 16, D(90)); s += `<line x1="${a4n(m[0])}" y1="${a4n(m[1])}" x2="${a4n(k[0])}" y2="${a4n(k[1])}" stroke="${br}" stroke-width="3"/><circle class="a4-knob" cx="${a4n(k[0])}" cy="${a4n(k[1])}" r="12" fill="#FFC24C" stroke="#9A6406" stroke-width="2"/><path d="M${a4n(k[0]) - 5} ${a4n(k[1])} a5 5 0 1 1 5 5" fill="none" stroke="#6B4A06" stroke-width="1.6"/>`; }
  if (o.hitArea) s += `<path class="a4-phit" d="M${a4n(e1[0])} ${a4n(e1[1])} A${R + 16} ${R + 16} 0 0 ${o.flip ? 1 : 0} ${a4n(a4P(c, R + 16, D(90))[0])} ${a4n(a4P(c, R + 16, D(90))[1])} A${R + 16} ${R + 16} 0 0 ${o.flip ? 1 : 0} ${a4n(a4P(c, R + 16, D(180))[0])} ${a4n(a4P(c, R + 16, D(180))[1])}L${c[0]} ${c[1]}Z" fill="rgba(0,0,0,0)"/>`;
  return s + '</g>'; }
function a4SVG(o) { const [W, H] = o.vb || [340, 230], P = o.pts || {}, keys = Object.keys(P); let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="a4-svg${o.cls ? ' ' + o.cls : ''}">`;
  if (o.plane) { const [x, y, w, hh] = o.plane; s += `<path d="M${x + 40} ${y} H${x + w} L${x + w - 40} ${y + hh} H${x}Z" fill="#E8F1FB" stroke="#9DB8DA" stroke-width="1.5"/>`; }
  if (o.grid) { const { x0, y0, n, m, g } = o.grid; let d = '';
    for (let i = 0; i <= n; i++) d += `M${x0 + i * g} ${y0}V${y0 + m * g}`; for (let j = 0; j <= m; j++) d += `M${x0} ${y0 + j * g}H${x0 + n * g}`;
    s += `<path d="${d}" stroke="#D9D2EC" stroke-width="1.3" fill="none"/>`;
    for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) s += `<circle cx="${x0 + i * g}" cy="${y0 + j * g}" r="2" fill="#B9B0D3"/>`; }
  s += o.under || '';
  (o.arcs || []).forEach(A => { const v = P[A.v]; s += a4Arc(v, a4dir(v, P[A.a]), a4dir(v, P[A.b]), A); });
  (o.lines || []).forEach(L => s += a4Line(P[L.a], P[L.b], L.k, L));
  if (o.prot) s += a4Prot(o.prot.c || P[o.prot.v], o.prot.rot, o.prot);
  const cx = keys.reduce((a, k) => a + P[k][0], 0) / (keys.length || 1), cy = keys.reduce((a, k) => a + P[k][1], 0) / (keys.length || 1);
  keys.forEach(k => { const p = P[k]; if (!(o.nodot || []).includes(k)) s += `<circle cx="${a4n(p[0])}" cy="${a4n(p[1])}" r="${o.dotR || 4}" fill="${(o.hl || []).includes(k) ? '#E5487A' : '#2B2550'}"/>`;
    if ((o.nolab || []).includes(k)) return; const d = o.lab && o.lab[k] != null ? o.lab[k] : Math.hypot(p[0] - cx, p[1] - cy) < 4 ? 90 : a4dir([cx, cy], p), t = a4P(p, o.labR || 16, d);
    s += `<text x="${a4n(t[0])}" y="${a4n(t[1]) + 6}" class="a4-n${(o.hl || []).includes(k) ? ' hl' : ''}" text-anchor="middle">${k}</text>`; });
  return s + (o.extra || '') + '</svg>'; }
/* an angle at vertex v: arms toward directions d1, d2 (labels x v y) */
const a4AngPts = (x, v, y, d1, d2, o = {}) => { const c = o.c || [170, 150], L = o.L || 120; return { [x]: a4P(c, L, d1), [v]: c, [y]: a4P(c, o.L2 || L, d2) }; };
/* v107: without a given viewBox the picture box is fitted to the angle (arms, arrow heads, labels, arc) — a reflex arm pointing down
   used to run out of the 340×230 box and over the answer buttons (ผู้ใช้เจอรูปทับตัวเลือก) */
function a4fitBox(d1, a, o) { const L = o.L || 120, L2 = o.L2 || L, ext = (o.k || 'seg') === 'ray' ? 40 : 6, xs = [], ys = [], add = (p, r) => { xs.push(p[0] - r, p[0] + r); ys.push(p[1] - r, p[1] + r); };
  [[d1, L], [d1 + a, L2]].forEach(([d, l]) => { add(a4P([0, 0], l + ext, d), 6); add(a4P([0, 0], l, d), 26); });
  add([0, 0], Math.max(o.fitR || 0, (o.r || (a > 180 ? 22 : 30)) + (o.lab != null ? 30 : 8))); add(a4P([0, 0], 18, d1 + a / 2 + 180), 16);
  const pad = 8, mnx = Math.min(...xs), mxx = Math.max(...xs), mny = Math.min(...ys), mxy = Math.max(...ys), W = Math.max(300, Math.ceil(mxx - mnx + 2 * pad)), H = Math.max(190, Math.ceil(mxy - mny + 2 * pad));
  return { vb: [W, H], c: [a4n((W - (mxx - mnx)) / 2 - mnx), a4n((H - (mxy - mny)) / 2 - mny)] }; }
function a4AngFig(nm, d1, a, o = {}) { if (!o.vb && !o.c) o = { ...o, ...a4fitBox(d1, a, o) }; const [x, v, y] = [...nm], P = a4AngPts(x, v, y, d1, d1 + a, o), refl = a > 180;
  return a4SVG({ vb: o.vb, pts: P, lines: [{ a: v, b: x, k: o.k || 'seg' }, { a: v, b: y, k: o.k || 'seg' }], arcs: o.noArc ? [] : [{ v, a: x, b: y, reflex: refl, lab: o.lab, rm: o.rm, r: o.r }],
    nodot: o.k === 'ray' ? [] : [x, y].filter(() => o.armDots === false), lab: { [v]: d1 + a / 2 + 180, [x]: refl ? d1 + 90 : d1 - 90, [y]: refl ? d1 + a - 90 : d1 + a + 90 }, prot: o.prot, extra: o.extra, cls: o.cls, under: o.under, hl: o.hl }); }
/* pointer → svg coordinates */
/* pointer → svg coordinates.
   iPad Safari gets getScreenCTM()/getBoundingClientRect() wrong inside CSS `zoom` (the app zooms #stage and grows question blocks with zoom),
   so the tapped spot landed somewhere else. Instead we ask the browser's own hit-testing: an invisible overlay (same box, same viewBox)
   made of thin column strips and row strips; document.elementsFromPoint() tells which column and which row are under the finger. */
const A4HIT_S = 2, a4hitCache = {};
function a4hitSVG(W, H) { const k = W + 'x' + H; if (a4hitCache[k]) return a4hitCache[k]; let c = '', r = '';
  for (let x = -120; x < W + 120; x += A4HIT_S) c += `<rect x="${x}" y="-400" width="${A4HIT_S}" height="${H + 800}" data-x="${x + A4HIT_S / 2}"/>`;
  for (let y = -120; y < H + 120; y += A4HIT_S) r += `<rect x="-400" y="${y}" width="${W + 800}" height="${A4HIT_S}" data-y="${y + A4HIT_S / 2}"/>`;
  return a4hitCache[k] = `<g>${c}</g><g>${r}</g>`; }
const a4pt = (svg, e) => { const fig = svg && svg.parentElement, vb = svg && svg.viewBox && svg.viewBox.baseVal;
  if (fig && vb && vb.width && document.elementsFromPoint) {
    let ov = fig.querySelector(':scope > svg.a4-ptov'); const key = `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
    if (!ov || ov.getAttribute('viewBox') !== key) { if (ov) ov.remove(); ov = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ov.setAttribute('class', 'a4-ptov'); ov.setAttribute('viewBox', key);
      ov.setAttribute('preserveAspectRatio', svg.getAttribute('preserveAspectRatio') || 'xMidYMid meet'); ov.innerHTML = a4hitSVG(vb.width, vb.height); fig.append(ov); }
    if (getComputedStyle(fig).position === 'static') fig.style.position = 'relative';
    ov.style.cssText = `position:absolute;left:${svg.offsetLeft || 0}px;top:${svg.offsetTop || 0}px;width:${svg.clientWidth || fig.clientWidth}px;height:${svg.clientHeight || fig.clientHeight}px;pointer-events:auto;overflow:visible;z-index:5`;
    const els = document.elementsFromPoint(e.clientX, e.clientY); ov.style.pointerEvents = 'none';
    let x = null, y = null; for (const el of els) { if (el.parentNode && el.parentNode.parentNode === ov) { if (x == null && el.dataset.x != null) x = +el.dataset.x; else if (y == null && el.dataset.y != null) y = +el.dataset.y; } if (x != null && y != null) break; }
    if (x != null && y != null) return [x + vb.x, y + vb.y]; }
  const m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m); return [r.x, r.y]; };

/* stable drag: one pointer, capture, rAF-throttled, ends on up/cancel/lost capture */
function a4Drag(fig, { down, move, up }) { let id = null, raf = 0, last = null; const svg = () => fig.querySelector('svg');
  const end = () => { if (id == null) return; id = null; if (raf) cancelAnimationFrame(raf); raf = 0; last = null; up && up(); };
  fig.addEventListener('pointerdown', e => { if (id != null || !svg()) return; if (e.pointerType === 'mouse' && e.button !== 0) return; const p = a4pt(svg(), e); if (down(p, e) === false) return; e.preventDefault(); id = e.pointerId; try { fig.setPointerCapture(id); } catch (_) { } });
  fig.addEventListener('pointermove', e => { if (e.pointerId !== id) return; if (e.pointerType === 'mouse' && !e.buttons) return end(); e.preventDefault(); last = a4pt(svg(), e);
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (id != null && last) move(last); }); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => fig.addEventListener(t, e => { if (e.pointerId === id) { if (t === 'pointerup' && last) move(last); end(); } })); }
/* =========================================================
   TEACHING SIMULATIONS
   ========================================================= */
/* tap the plane to put points on it */
function simA4Plane() { const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'a4-board ia' }), out = fNote(), P = {}; let k = 0;
  const draw = () => { fig.innerHTML = a4SVG({ vb: [380, 230], plane: [20, 20, 340, 190], pts: P, lab: Object.fromEntries(Object.keys(P).map(n => [n, 60])) }); };
  fig.addEventListener('click', e => { e.stopPropagation(); if (k >= 6) return; const [x, y] = a4pt(fig.querySelector('svg'), e); if (y < 26 || y > 204) return; const n = A4_LAT[k++]; P[n] = [x, y]; sfx.pop(k); draw();
    out.innerHTML = `วางจุด <b>${n}</b> แล้ว · จุดใช้บอก<b>ตำแหน่ง</b> ไม่มีความกว้าง ความยาว<br>เรียกชื่อจุดด้วยตัวอักษร เช่น จุด ${Object.keys(P).join(', จุด ')}`; if (k >= 3) teachDone(box); });
  out.innerHTML = 'แตะบนระนาบ (พื้นผิวเรียบสีฟ้า) เพื่อวางจุด 3 จุดขึ้นไป'; draw(); out.classList.add('a4-out'); box.append(fig, out); return box; }
/* line / ray / segment: drag A and B, switch kind, swap the name */
function simA4Line() { const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'a4-board ia' }), out = fNote(), seg = h('div', { class: 'seg' }); const P = { A: [110, 140], B: [250, 90] }; let k = 'line', drag = null, seen = new Set(), rev = false;
  const draw = () => { const [p, q] = rev ? ['B', 'A'] : ['A', 'B'];
    fig.innerHTML = a4SVG({ vb: [380, 230], pts: P, lines: [{ a: p, b: q, k, ext: 60 }], hl: k === 'ray' ? [p] : [] }).replace('</svg>', Object.entries(P).map(([n, v]) => `<circle class="a4-drag" data-n="${n}" cx="${v[0]}" cy="${v[1]}" r="16" fill="rgba(111,178,245,.18)" stroke="#6FB2F5" stroke-width="1.5"/>`).join('') + '</svg>');
    const nm = p + q, len = a4n(Math.hypot(P.A[0] - P.B[0], P.A[1] - P.B[1]) / 40);
    out.innerHTML = `${A4K[k]} ${a4Sym(k, nm)} อ่านว่า ${A4K[k]} ${nm}<br>` + (k === 'line' ? 'ยาวออกไปไม่สิ้นสุดทั้งสองข้าง ไม่มีจุดปลาย · เส้นตรง AB กับ BA คือเส้นเดียวกัน' : k === 'ray' ? `มีจุดเริ่มต้นที่จุด ${p} (สีชมพู) ยาวไปทาง ${q} ไม่สิ้นสุด · ชื่อต้องขึ้นต้นด้วยจุดเริ่มต้น` : `มีจุดปลาย 2 จุด วัดความยาวได้ ≈ ${len} ซม. · AB กับ BA คือเส้นเดียวกัน`);
    seen.add(k); if (seen.size >= 3) teachDone(box); };
  [['line', 'เส้นตรง'], ['ray', 'รังสี'], ['seg', 'ส่วนของเส้นตรง']].forEach(([v, t]) => seg.append(h('button', { class: v === k ? 'on' : '', onclick: e => { e.stopPropagation(); k = v; seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === e.currentTarget)); sfx.tap(); draw(); } }, t)));
  a4Drag(fig, { down: p => { let best = null, bd = 42; Object.entries(P).forEach(([n, v]) => { const d = Math.hypot(p[0] - v[0], p[1] - v[1]); if (d < bd) { bd = d; best = n; } }); if (!best) return false; drag = best; },
    move: p => { const o = drag === 'A' ? P.B : P.A; let x = Math.max(30, Math.min(350, p[0])), y = Math.max(30, Math.min(200, p[1])); const d = Math.hypot(x - o[0], y - o[1]);
      if (d < 60) { const ux = d ? (x - o[0]) / d : 1, uy = d ? (y - o[1]) / d : 0; x = o[0] + ux * 60; y = o[1] + uy * 60; if (x < 30 || x > 350 || y < 30 || y > 200) return; }
      P[drag] = [x, y]; draw(); }, up: () => { drag = null; } });
  out.classList.add('a4-out'); box.append(seg, fig, h('div', { class: 'rowstack' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); rev = !rev; sfx.tap(); draw(); } }, icon('undo'), 'สลับชื่อ AB ↔ BA')), out); draw(); return box; }
/* drag the arm of an angle: mode name | cmp (paper corner) | kind | deg */
function simA4Angle(mode) { const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'a4-board ia' }), out = fNote(); let a = mode === 'kind' ? 50 : 65, drag = false, moves = 0, corner = mode === 'cmp', kinds = new Set();
  const V = [175, 165], L = 130, maxA = mode === 'kind' ? 359 : 180;
  const draw = () => { const P = { A: a4P(V, L, 0), B: V, C: a4P(V, L, a) };
    const cor = corner ? `<path d="M${V[0] + 54} ${V[1]} V${V[1] - 54} H${V[0]}" fill="rgba(255,194,76,.18)" stroke="#E6A21E" stroke-width="2" stroke-dasharray="6 4"/>` : '';
    const s = a4SVG({ vb: [360, 230], pts: P, lines: [{ a: 'B', b: 'A', k: 'ray' }, { a: 'B', b: 'C', k: 'ray' }], arcs: [{ v: 'B', a: 'A', b: 'C', reflex: a > 180, rm: mode !== 'cmp', lab: mode === 'deg' ? a + '°' : null }], under: cor, lab: { B: a > 180 ? a / 2 : a / 2 + 180 } });
    const k = a4pt; const knob = a4P(V, L, a); fig.innerHTML = s.replace('</svg>', `<circle class="a4-drag" cx="${a4n(knob[0])}" cy="${a4n(knob[1])}" r="17" fill="rgba(229,72,122,.16)" stroke="#E5487A" stroke-width="1.6"/></svg>`);
    const kd = a4kind(a);
    if (mode === 'name') out.innerHTML = `มุม ${a4Ang('ABC')} หรือ มุม ${a4Ang('CBA')} · จุดยอดมุม = <b>จุด B</b> (อยู่ตรงกลางของชื่อ)<br>แขนของมุม = ${a4Sym('ray', 'BA')} และ ${a4Sym('ray', 'BC')}`;
    else if (mode === 'cmp') out.innerHTML = a === 90 ? 'แขนทับมุมกระดาษพอดี → <b>มุมฉาก</b>' : a === 180 ? 'แขนทั้งสองอยู่ในแนวเส้นตรงเดียวกัน → <b>มุมตรง</b>' : a < 90 ? 'แขน BC อยู่ภายในมุมกระดาษ → <b>เล็กกว่ามุมฉาก</b>' : 'แขน BC อยู่นอกมุมกระดาษ → <b>ใหญ่กว่ามุมฉาก</b>';
    else out.innerHTML = `${a4Ang('ABC')} เป็น <b>${A4KIND[kd]}</b>${mode === 'deg' ? ` · ${a4m('ABC')} = ${a}°` : ''}<br><small>${A4WHY[kd]}</small>`;
    if (mode === 'kind') { kinds.add(kd); if (kinds.size >= 4) teachDone(box); } else if (++moves > 5) teachDone(box); };
  a4Drag(fig, { down: p => { if (Math.hypot(p[0] - V[0], p[1] - V[1]) < 30) return false; drag = true; move(p); }, move: p => move(p), up: () => { drag = false; } });
  const move = p => { if (!drag || Math.hypot(p[0] - V[0], p[1] - V[1]) < 24) return; let d = Math.round(a4dir(V, p)); if (d < 4 || d > maxA) d = d > 270 && maxA < 360 ? 4 : d < 4 ? 4 : maxA; for (const s of [90, 180, 270]) if (Math.abs(d - s) <= 3) d = s; if (d !== a) { a = d; draw(); } };
  const quick = mode === 'kind' ? [[35, 'แหลม'], [90, 'ฉาก'], [130, 'ป้าน'], [180, 'ตรง'], [235, 'กลับ']] : mode === 'cmp' ? [[50, '50'], [90, 'มุมฉาก'], [140, '140'], [180, 'มุมตรง']] : [];
  out.classList.add('a4-out'); box.append(out, fig); if (quick.length) box.append(h('div', { class: 'rowstack' }, ...quick.map(([d, t]) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); a = d; sfx.tap(); draw(); } }, t))));
  box.insertBefore(h('div', { class: 'cap' }, mode === 'cmp' ? 'ลากจุดสีชมพูหมุนแขน BC · กรอบประสีเหลือง = มุมกระดาษ (มุมฉาก)' : 'ลากจุดสีชมพูเพื่อหมุนแขน BC'), out); draw(); moves = 0; return box; }
/* measure with a draggable protractor */
function simA4Measure() { const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'a4-board ia' }), out = fNote(), ask = h('div', { class: 'colstack' }); let st, drag = null, n = 0;
  const V = [200, 180];
  const fresh = () => { const d1 = pick([0, 10, 20, 160, 170, 180, 15, 165]), a = pick([35, 50, 65, 75, 110, 125, 140, 55]), ccw = d1 < 90; st = { d1: ccw ? d1 : d1 - a, a, c: [118, 128], rot: 30, ok1: false, ok2: false, asked: false }; st.good = ccw ? st.d1 : st.d1 + a - 180; ask.innerHTML = ''; draw(); };
  const draw = () => { const { d1, a, c, rot } = st, P = { A: a4P(V, 150, d1), B: V, C: a4P(V, 150, d1 + a) };
    fig.innerHTML = a4SVG({ vb: [400, 250], pts: P, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 14 }, { a: 'B', b: 'C', k: 'ray', ext: 14 }], arcs: [{ v: 'B', a: 'A', b: 'C', r: 24 }], prot: { c, rot, knob: true, cls: 'a4-mv' + (st.ok1 && st.ok2 ? ' ok' : '') }, lab: { B: d1 + a / 2 + 180 } });
    /* v107 (ผู้ใช้ขอ): one step at a time — the next step appears only after the child has done the one before */
    const SX = ['ลากไม้โพรแทรกเตอร์ให้<b>จุดศูนย์กลาง</b>ทับจุดยอดมุม B', 'หมุนปุ่มสีเหลือง ให้<b>เส้นฐาน</b>ทับแขนข้างหนึ่ง', 'อ่านสเกลที่เริ่มนับ <b>0</b> จากแขนที่ทับเส้นฐาน'], cur = !st.ok1 ? 0 : !st.ok2 ? 1 : 2;
    out.innerHTML = SX.slice(0, cur + 1).map((t, i) => `<div class="a4-st${i < cur ? ' done' : ' cur'}">${i < cur ? '✓' : '①②③'[i]} ${t}</div>`).join('') + (st.res || '');
    help.textContent = cur === 0 ? 'ช่วยวางจุดศูนย์กลาง' : cur === 1 ? 'ช่วยหมุนให้' : ''; help.hidden = cur > 1;
    if (st.ok1 && st.ok2 && !st.asked) { st.asked = true; const outer = Math.abs(((rot - d1) % 360 + 360) % 360) < .5, right = a, wrong = 180 - a;
      ask.append(h('div', { class: 'cap', html: `แขน ${outer ? 'BA ทับ 0 ของสเกลวงนอก' : 'BC ทับเส้นฐาน · BA อยู่ที่ 0 ของสเกลวงใน'} → ${a4m('ABC')} เท่ากับเท่าใด` }), choices({ check: (ok, hn) => { if (ok) { sfx.ok(); st.res = `<div class="a4-st ok"><b>${a4m('ABC')} = ${a}°</b></div>`; draw(); ask.innerHTML = ''; if (++n >= 2) teachDone(box); ask.append(p4more(fresh, 'มุมใหม่')); } else { sfx.no(); st.res = '<div class="a4-st"><small>ยังไม่ใช่ — นับจาก 0 ที่อยู่บนแขนของมุม</small></div>'; draw(); } }, say() {} }, shuffle([right, wrong === right ? right + 10 : wrong]).map(x => ({ value: String(x), label: `${x}°` })), String(right))); } };
  const svgOf = () => fig.querySelector('svg');
  a4Drag(fig, { down: (p, e) => { const kb = e.target.closest('.a4-knob'), bd = e.target.closest('.a4-prot'); if (!kb && !bd) return false; drag = kb ? { k: 'rot' } : { k: 'mv', dx: p[0] - st.c[0], dy: p[1] - st.c[1] }; }, up: () => { if (drag) sfx.tap(); drag = null; }, move: p => { if (!drag) return;
    if (drag.k === 'rot' && Math.hypot(p[0] - st.c[0], p[1] - st.c[1]) < 26) return;
    if (drag.k === 'mv') { let c = [p[0] - drag.dx, p[1] - drag.dy]; st.ok1 = Math.hypot(c[0] - V[0], c[1] - V[1]) < 12; if (st.ok1) c = V.slice(); st.c = c; }
    else { let r = a4dir(st.c, p) - 90; const goods = [st.good]; st.ok2 = false; for (const g of goods) { const df = ((r - g) % 360 + 540) % 360 - 180; if (Math.abs(df) < 5) { r = g; st.ok2 = st.ok1; } } st.rot = r; }
    if (drag.k === 'mv' && st.ok2) st.ok2 = st.ok1; draw(); } });
  const help = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (!st.ok1) { st.c = V.slice(); st.ok1 = true; } else if (!st.ok2) { st.rot = st.good; st.ok2 = true; } sfx.pop(3); draw(); } }, 'ช่วยวางจุดศูนย์กลาง');
  out.classList.add('a4-out', 'a4-steps'); box.append(h('div', { class: 'cap' }, 'ลากตัวไม้โพรแทรกเตอร์ · หมุนด้วยปุ่มสีเหลือง'), fig, out, ask, h('div', { class: 'rowstack' }, help)); fresh(); return box; }
/* reflex angle: drag the arm past 180° → 360° − small angle */
function simA4Reflex() { const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'a4-board ia' }), out = fNote(); let a = 230, drag = false, moves = 0; const V = [185, 125];
  const draw = () => { const P = { A: a4P(V, 125, 0), B: V, C: a4P(V, 105, a) }, sm = 360 - a;
    fig.innerHTML = a4SVG({ vb: [370, 250], pts: P, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 14 }, { a: 'B', b: 'C', k: 'ray', ext: 14 }], arcs: [{ v: 'B', a: 'A', b: 'C', reflex: true, r: 26, lab: a + '°', labR: 18 }, { v: 'B', a: 'A', b: 'C', r: 44, col: '#3C8DDB', fill: 'rgba(60,141,219,.10)', lab: sm + '°' }],
      prot: { c: V, rot: 0, flip: true, R: 92, inner: false }, lab: { B: 90 + 0 } }).replace('</svg>', `<circle class="a4-drag" cx="${a4n(P.C[0])}" cy="${a4n(P.C[1])}" r="17" fill="rgba(229,72,122,.16)" stroke="#E5487A" stroke-width="1.6"/></svg>`);
    out.innerHTML = `มุมกลับ ${a4Ang('ABC')} (สีชมพู) กับมุมสีฟ้ารวมกันได้ <b>1 รอบ = 360°</b><br>วัดมุมสีฟ้าได้ ${sm}° → มุมกลับ = 360° − ${sm}° = <b>${a}°</b>` + (a > 180 ? `<br><small>หรือ 180° + ${a - 180}° = ${a}°</small>` : ''); if (++moves > 4) teachDone(box); };
  a4Drag(fig, { down: p => { if (Math.hypot(p[0] - V[0], p[1] - V[1]) < 30) return false; drag = true; mv(p); }, move: p => mv(p), up: () => { drag = false; } });
  const mv = p => { if (!drag || Math.hypot(p[0] - V[0], p[1] - V[1]) < 24) return; let d = Math.round(a4dir(V, p)); d = Math.max(185, Math.min(355, d < 90 ? 355 : d)); if (d !== a) { a = d; draw(); } };
  out.classList.add('a4-out'); box.append(h('div', { class: 'cap' }, 'ลากจุดสีชมพูหมุนแขน BC (มุมกลับอยู่ระหว่าง 180° กับ 360°)'), fig, out); draw(); moves = 0; return box; }

/* =========================================================
   QUESTION TYPES
   ========================================================= */
const a4fig = svg => `<div class="a4-fig">${svg}</div>`;
const a4sd = (cls, left, ...right) => { const g = g4Side(left, ...right); g.classList.add('a4-sd'); if (cls) g.classList.add(cls); return g; }; // picture LEFT · answer RIGHT (v107)
const a4Pick = (o, sig) => ({ ...Q.p4Pick(o), __sig: sig });
Object.assign(Q, {
  /* dot grid: which point is … / put point P … */
  a4Grid({ mode, pts, ref, dx, dy, nm }) { const g = 34, x0 = 30, y0 = 24, P = Object.fromEntries(Object.entries(pts).map(([k, [i, j]]) => [k, [x0 + i * g, y0 + j * g]]));
    const dTxt = (dx ? `ทาง${dx > 0 ? 'ขวา' : 'ซ้าย'} ${Math.abs(dx)} ช่อง` : '') + (dx && dy ? ' และ' : '') + (dy ? `${dy > 0 ? 'ขึ้นไป' : 'ลงมา'} ${Math.abs(dy)} ช่อง` : '');
    const [ri, rj] = pts[ref], ti = ri + dx, tj = rj - dy;
    if (mode === 'find') { const right = Object.keys(pts).find(k => pts[k][0] === ti && pts[k][1] === tj);
      return a4Pick({ fig: a4fig(a4SVG({ vb: [300, 210], grid: { x0, y0, n: 7, m: 5, g }, pts: P, lab: Object.fromEntries(Object.keys(P).map(k => [k, 45])) })), q: `จุดใดอยู่ห่างจากจุด ${ref} ${dTxt}`, say: `จุดใดอยู่ห่างจากจุด ${ref} ${dTxt}`, opts: Object.keys(pts).filter(k => k !== ref).map(k => `จุด ${k}`), right: `จุด ${right}`, hint: 'นับช่องระหว่างจุดตามแนวนอนก่อน แล้วนับตามแนวตั้ง' }, `a4g f ${JSON.stringify(pts)} ${ref}${dx}${dy}`); }
    if (!nm || pts[nm]) { const al = /[A-Z]/.test(ref) ? A4_LAT : A4_TH; nm = ['P', 'ป'].find(c => al.includes(c) && !pts[c]) || al.find(c => !pts[c]); }
    const ask = `แตะวางจุด <b>${nm}</b> ให้อยู่ห่างจากจุด <b>${ref}</b> ${dTxt}`;
    const me = { prompt: ask, say: `วางจุด ${nm} ให้อยู่ห่างจากจุด ${ref} ${dTxt}`, __sig: `a4g p ${JSON.stringify(pts)} ${ref}${dx}${dy}`, mount(bd, ctx) {
      let cur = null, done = false; const cap = h('div', { class: 'a4-ask', html: 'แตะที่จุดตัดของเส้นตาราง เพื่อวางจุด <b>' + nm + '</b> แล้วกด “ตรวจ”' }), fig = h('div', { class: 'a4-board ia rvl a4-tap' });
      const draw = (q, ok) => { const Q2 = { ...P }; if (q) Q2[nm] = [x0 + q[0] * g, y0 + q[1] * g];
        const tg = []; for (let a = 0; a <= 7; a++) for (let b = 0; b <= 5; b++) if (!Object.values(pts).some(p => p[0] === a && p[1] === b)) tg.push(`<circle class="a4-tgt" data-i="${a}" data-j="${b}" cx="${x0 + a * g}" cy="${y0 + b * g}" r="12"/>`);
        fig.innerHTML = a4SVG({ vb: [300, 210], grid: { x0, y0, n: 7, m: 5, g }, pts: Q2, hl: q ? [nm] : [], lab: Object.fromEntries(Object.keys(Q2).map(k => [k, 45])), extra: done ? '' : tg.join('') }); if (ok) fig.dataset.done = 1; };
      fig.addEventListener('click', e => { e.stopPropagation(); if (done) return; const [x, y] = a4pt(fig.querySelector('svg'), e), i = Math.round((x - x0) / g), j = Math.round((y - y0) / g);
        if (i < 0 || i > 7 || j < 0 || j > 5 || Math.hypot(x - x0 - i * g, y - y0 - j * g) > 16 || Object.values(pts).some(p => p[0] === i && p[1] === j)) return;
        cur = [i, j]; draw(cur); sfx.tap(); chk.disabled = false; });
      const chk = h('button', { class: 'btn primary ia', disabled: true, onclick: e => { e.stopPropagation(); if (done || !cur) return; const ok = cur[0] === ti && cur[1] === tj;
        if (ok) { done = true; draw(cur, true); } ctx.check(ok, 'เริ่มที่จุด ' + ref + ' นับช่องตามแนวนอนก่อน แล้วนับตามแนวตั้ง'); } }, icon('check'), 'ตรวจ');
      fig.reveal = () => { done = true; draw([ti, tj], true); };
      draw(); bd.append(h('div', { class: 't6-q p4-q' }, cap, fig, chk)); } };
    return me; },
  /* which is this figure (line / ray / segment) */
  a4Kind({ k, ab }) { const [a, b] = [...ab], P = { [a]: [90, 140], [b]: [250, 80] }, opts = [];
    const right = `${A4K[k]} ${a4Sym(k, ab)}`; opts.push(right);
    if (k === 'ray') opts.push(`${A4K.ray} ${a4Sym('ray', b + a)}`, `${A4K.line} ${a4Sym('line', ab)}`, `${A4K.seg} ${a4Sym('seg', ab)}`);
    else opts.push(...['line', 'ray', 'seg'].filter(x => x !== k).map(x => `${A4K[x]} ${a4Sym(x, ab)}`));
    return a4Pick({ fig: a4fig(a4SVG({ vb: [340, 210], pts: P, lines: [{ a, b, k, ext: 46 }] })), q: 'รูปนี้คือข้อใด', opts, right, hint: 'ดูหัวลูกศร: 2 ข้าง = เส้นตรง · 1 ข้าง = รังสี (เริ่มที่จุดไม่มีลูกศร) · ไม่มี = ส่วนของเส้นตรง' }, `a4k ${k} ${ab}`); },
  /* tap points in order to draw a line / ray / segment / angle */
  a4Draw({ k, name, pts }) { const need = k === 'angle' ? 3 : 2, P = pts;
    const goal = k === 'angle' ? `มุม ${a4Ang(name)}` : `${A4K[k]} ${a4Sym(k, name)}`;
    const me = { prompt: `แตะจุดตามลำดับเพื่อสร้าง ${goal}`, say: `แตะจุดตามลำดับเพื่อสร้าง${k === 'angle' ? 'มุม' : A4K[k]} ${[...name].join(' ')}`, __sig: `a4d ${k} ${name} ${JSON.stringify(P)}`, mount(bd, ctx) {
      let tap = [], busy = false; const fig = h('div', { class: 'a4-board ia rvl a4-tap' }), cap = h('div', { class: 'cap' }, (k === 'angle' ? 'แตะ 3 จุด (จุดยอดมุมเป็นจุดที่ 2)' : k === 'ray' ? 'แตะจุดเริ่มต้นก่อน แล้วแตะจุดที่รังสีผ่าน' : 'แตะ 2 จุด') + ' · แตะจุดล่าสุดซ้ำเพื่อยกเลิก');
      const lines = q => q.length < 2 ? [] : k === 'angle' ? [{ a: q[1], b: q[0], k: 'ray', ext: 18 }].concat(q[2] ? [{ a: q[1], b: q[2], k: 'ray', ext: 18 }] : []) : [{ a: q[0], b: q[1], k, ext: 34 }];
      const ring = (q, done) => done ? '' : Object.entries(P).map(([n, p]) => { const at = q.indexOf(n); return `<circle class="a4-tgt${at >= 0 ? ' on' : ''}" cx="${a4n(p[0])}" cy="${a4n(p[1])}" r="17"/>` + (at >= 0 ? `<text class="a4-ord" x="${a4n(p[0] - 17)}" y="${a4n(p[1] + 24)}">${at + 1}</text>` : ''); }).join('');
      const draw = (q, done) => { fig.innerHTML = a4SVG({ vb: [340, 230], pts: P, lines: lines(q), hl: q, arcs: k === 'angle' && q.length === 3 ? [{ v: q[1], a: q[0], b: q[2] }] : [], extra: ring(q, done) }); if (done) fig.dataset.done = 1; };
      const ok = q => k === 'angle' ? q[1] === name[1] && ((q[0] === name[0] && q[2] === name[2]) || (q[0] === name[2] && q[2] === name[0])) : k === 'ray' ? q.join('') === name : q.join('') === name || q.join('') === name[1] + name[0];
      fig.addEventListener('click', e => { e.stopPropagation(); if (fig.dataset.done) return; const [x, y] = a4pt(fig.querySelector('svg'), e); let best = null, bd2 = 1600; Object.entries(P).forEach(([n, p]) => { const d = (p[0] - x) ** 2 + (p[1] - y) ** 2; if (d < bd2) { bd2 = d; best = n; } }); if (!best || busy) return;
        if (tap.includes(best)) { if (tap[tap.length - 1] === best) { tap.pop(); sfx.tap(); draw(tap); } return; }
        tap.push(best); sfx.tap(); draw(tap); if (tap.length < need) return; const good = ok(tap); if (good) { draw(tap, true); ctx.check(true); } else { const hn = k === 'angle' ? 'จุดยอดมุมต้องแตะเป็นจุดที่สอง (ตัวกลางของชื่อมุม)' : k === 'ray' ? `รังสี ${name} เริ่มที่จุด ${name[0]}` : `แตะจุด ${name[0]} และจุด ${name[1]}`; busy = true; setTimeout(() => { busy = false; if (!fig.dataset.done) { tap = []; draw(tap); } }, 900); ctx.check(false, hn); } });
      fig.reveal = () => draw([...name], true); draw([]); bd.append(h('div', { class: 't6-q p4-q' }, fig, cap)); } };
    return me; },
  /* where do two lines cross */
  a4Inter({ L }) { const [a, b, c, d, x] = L, P = { [a]: [40, 70], [b]: [300, 170], [c]: [70, 190], [d]: [290, 40] }, X = (() => { const [p1, p2, p3, p4] = [P[a], P[b], P[c], P[d]], den = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]), t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / den; return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])]; })();
    const all = { ...P, [x]: X }, others = pkF(A4_LAT.filter(z => !L.includes(z)), 2), E = { [others[0]]: [150, 205], [others[1]]: [255, 105] };
    return a4Pick({ fig: a4fig(a4SVG({ vb: [340, 230], pts: { ...all, ...E }, lines: [{ a, b, k: 'line', ext: 18 }, { a: c, b: d, k: 'line', ext: 18 }], lab: { [x]: 90 } })), q: `${a4Sym('line', a + b)} ตัดกับ ${a4Sym('line', c + d)} ที่จุดใด`, say: `เส้นตรง ${a} ${b} ตัดกับเส้นตรง ${c} ${d} ที่จุดใด`, opts: [x, ...others, a].map(z => `จุด ${z}`), right: `จุด ${x}`, hint: 'จุดตัดคือจุดที่อยู่บนเส้นตรงทั้งสองเส้น' }, `a4i ${L}`); },
  /* name / vertex / arms of an angle */
  a4Name({ nm, d1, a, mode }) { const [x, v, y] = [...nm], fig = a4fig(a4AngFig(nm, d1, a, { k: 'ray' }));
    if (mode === 'name') return a4Pick({ fig, q: 'มุมนี้มีชื่อว่าอะไร', opts: [`มุม ${a4Ang(nm)}`, `มุม ${a4Ang(v + x + y)}`, `มุม ${a4Ang(x + y + v)}`], right: `มุม ${a4Ang(nm)}`, hint: 'ชื่อจุดยอดมุมต้องอยู่ตรงกลาง' }, `a4n n ${nm}${d1}`);
    if (mode === 'vertex') return a4Pick({ fig, q: 'จุดยอดมุมคือจุดใด', opts: [v, x, y].map(z => `จุด ${z}`), right: `จุด ${v}`, hint: 'จุดยอดมุมคือจุดที่แขนทั้งสองเริ่มต้นร่วมกัน' }, `a4n v ${nm}${d1}`);
    return a4Pick({ fig, q: 'แขนของมุมคือข้อใด', opts: [`${a4Sym('ray', v + x)} และ ${a4Sym('ray', v + y)}`, `${a4Sym('ray', x + v)} และ ${a4Sym('ray', y + v)}`, `${a4Sym('ray', x + y)} และ ${a4Sym('ray', v + y)}`], right: `${a4Sym('ray', v + x)} และ ${a4Sym('ray', v + y)}`, hint: 'แขนของมุมเป็นรังสีที่เริ่มต้นจากจุดยอดมุม' }, `a4n a ${nm}${d1}`); },
  /* how many angles share the vertex */
  a4Count({ n, d0, span, L }) { const V = [170, 175], step = span / (n - 1), P = { [L[0]]: V }; L.slice(1, n + 1).forEach((z, i) => P[z] = a4P(V, 140, d0 + i * step));
    const me = { prompt: `จากรูป มีมุมที่มีจุด ${L[0]} เป็นจุดยอด กี่มุม <small>(ไม่นับมุมกลับ)</small>`, say: `จากรูป มีมุมที่มีจุด ${L[0]} เป็นจุดยอดกี่มุม`, __sig: `a4c ${n} ${d0} ${L.join('')}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: a4SVG({ vb: [340, 210], pts: P, lines: L.slice(1, n + 1).map(z => ({ a: L[0], b: z, k: 'ray', ext: 12 })), lab: { [L[0]]: 270 } }) }), answerBox(ctx, String(n * (n - 1) / 2), { hint: 'นับมุมที่เกิดจากแขนติดกันก่อน แล้วนับมุมที่รวม 2 ช่อง 3 ช่อง …' }))); } };
    return me; },
  /* compare with a right angle — lay a paper corner on it */
  a4Cmp90({ nm, d1, a }) { const opts = ['เล็กกว่ามุมฉาก', 'มุมฉาก', 'ใหญ่กว่ามุมฉาก', 'มุมตรง'], right = a < 90 ? 0 : a === 90 ? 1 : a < 180 ? 2 : 3;
    const me = { prompt: `${a4Ang(nm)} เป็นมุมแบบใด`, say: `มุม ${[...nm].join(' ')} เป็นมุมแบบใด`, __sig: `a4r ${nm}${d1} ${a}`, mount(bd, ctx) { let on = false; const fig = h('div', { class: 'p4-fig' });
      const bx = a4fitBox(d1, a, { fitR: 92 }); const draw = () => { const [x, v] = [...nm], c = bx.c, cor = on ? (() => { const p = a4P(c, 62, d1), q = a4P(p, 62, d1 + 90), r = a4P(c, 62, d1 + 90); return `<path d="M${a4n(p[0])} ${a4n(p[1])} L${a4n(q[0])} ${a4n(q[1])} L${a4n(r[0])} ${a4n(r[1])}" fill="rgba(255,194,76,.2)" stroke="#E6A21E" stroke-width="2.4" stroke-dasharray="6 4"/>`; })() : '';
        fig.innerHTML = a4AngFig(nm, d1, a, { ...bx, rm: false, under: cor }); };
      const btn = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); on = !on; sfx.tap(); draw(); btn.lastChild.textContent = on ? 'เก็บมุมกระดาษ' : 'วางมุมกระดาษเทียบ'; } }, icon('eye'), h('span', null, 'วางมุมกระดาษเทียบ'));
      draw(); bd.append(h('div', { class: 't6-q p4-q' }, h('div', { class: 'colstack' }, fig, btn), choices(ctx, opts.map(o => ({ value: o, label: o })), opts[right], { hint: 'วางมุมกระดาษให้มุมตรงจุดยอด ขอบหนึ่งทับแขนข้างหนึ่ง แล้วดูแขนอีกข้าง' }))); } };
    return me; },
  /* kind of the drawn angle */
  a4Cls({ nm, d1, a, show }) { const k = a4kind(a), opts = A4KIND.filter((_, i) => i === k || (show || [0, 1, 2, 3, 4]).includes(i)).slice(0, 4); if (!opts.includes(A4KIND[k])) opts[0] = A4KIND[k];
    /* v107: picture LEFT · choices RIGHT, the picture box fits the angle (ผู้ใช้เจอรูปทับตัวเลือก) */
    return { prompt: `${a4Ang(nm)} (ส่วนที่มีเส้นโค้ง) เป็นมุมชนิดใด`, say: `มุม ${[...nm].join(' ')} เป็นมุมชนิดใด`, __sig: `a4s ${nm}${d1} ${a}`, mount(bd, ctx) {
      bd.append(a4sd('a4-cq', h('div', { class: 'p4-fig', html: a4AngFig(nm, d1, a, { k: 'ray' }) }), choices(ctx, shuffle(opts).map(o => ({ value: o, label: o })), A4KIND[k], { hint: 'เทียบกับมุมฉาก (90°) และมุมตรง (180°)' })));
      bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } }; },
  a4ClsDeg({ nm, a }) { const k = a4kind(a), wrong = [0, 2, 4, 1, 3].filter(i => i !== k).slice(0, 2), op = i => `${A4KIND[i]} เพราะ${A4WHY[i]}`;
    return a4Pick({ fig: p4big(`<span>${a4m(nm)} = ${a}°</span>`), q: 'เป็นมุมชนิดใด เพราะอะไร', say: `มุม ${[...nm].join(' ')} มีขนาด ${a} องศา เป็นมุมชนิดใด`, opts: [op(k), ...wrong.map(op)], right: op(k), hint: 'มุมแหลม < 90° · มุมฉาก = 90° · 90° < มุมป้าน < 180° · มุมตรง = 180° · 180° < มุมกลับ < 360°' }, `a4e ${nm} ${a}`); },
  /* tap the angle of a given kind among three */
  a4Tap({ kind, A }) { const C = [[62, 140], [180, 140], [298, 140]], P = {}, arcs = [], lines = [];
    A.forEach((a, i) => { const d1 = i % 2 ? 10 : 0, v = 'V' + i, x = 'X' + i, y = 'Y' + i; P[x] = a4P(C[i], 52, d1); P[v] = C[i]; P[y] = a4P(C[i], 52, d1 + a); lines.push({ a: v, b: x, k: 'seg' }, { a: v, b: y, k: 'seg' }); arcs.push({ v, a: x, b: y, reflex: a > 180, r: 18, hit: i }); });
    const want = A.findIndex(a => a4kind(a) === kind);
    const me = { prompt: `แตะ<span class="hl">${A4KIND[kind]}</span>`, say: `แตะ${A4KIND[kind]}`, __sig: `a4t ${kind} ${A.join()}`, mount(bd, ctx) {
      const fig = h('div', { class: 'a4-board rvl', html: a4SVG({ vb: [360, 220], pts: P, lines, arcs, nolab: Object.keys(P), dotR: 3 }) });
      fig.reveal = () => { const el = fig.querySelector(`.a4-hit[data-i="${want}"]`); if (el) el.classList.add('ixt-ok'); };
      ixTapFig(fig, '.a4-hit', ctx, i => i === want, A4WHY[kind]); bd.append(h('div', { class: 't6-q p4-q' }, fig)); } };
    return me; },
  /* read a protractor that is already in place */
  a4Read({ nm, d1, a, inner }) { const [x, v, y] = [...nm], c = [190, 172], t = d1 > 20 ? 0 : d1, u = inner ? t + 180 : t, w = inner ? t + 180 - a : t + a, P = { [x]: a4P(c, 150, u), [v]: c, [y]: a4P(c, 150, w) }, rot = t;
    const me = { prompt: `${a4m(nm)} มีขนาดกี่องศา`, say: `มุม ${[...nm].join(' ')} มีขนาดกี่องศา`, __sig: `a4m ${nm}${d1} ${a}${inner ? 'i' : 'o'}`, mount(bd, ctx) {
      bd.append(a4sd('', h('div', { class: 'p4-fig', html: a4SVG({ vb: [380, 230], pts: P, lines: [{ a: v, b: x, k: 'ray', ext: 10 }, { a: v, b: y, k: 'ray', ext: 10 }], prot: { c, rot }, lab: { [v]: 270 } }) }),
        h('div', { class: 'rowstack' }, answerBox(ctx, String(a), { hint: 'ดูแขนที่ทับเส้นฐาน แล้วใช้สเกลที่เริ่ม 0 จากแขนนั้น' }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'องศา')))); } };
    return me; },
  /* reflex: ① read the small angle ② 360 − x */
  a4ReadR({ nm, a }) { const [x, v, y] = [...nm], c = [190, 120], d2 = a, P = { [x]: a4P(c, 140, 0), [v]: c, [y]: a4P(c, 120, d2) }, sm = 360 - a;
    const me = { prompt: `หาขนาดของมุมกลับ ${a4Ang(nm)}`, say: `หาขนาดของมุมกลับ ${[...nm].join(' ')}`, __sig: `a4w ${nm} ${a}`, mount(bd, ctx) {
      const lab = h('div', { class: 'p4steplab' }), slot = h('div', { class: 'colstack' }), fig = h('div', { class: 'p4-fig' }); let k = 0;
      const draw = done => fig.innerHTML = a4SVG({ vb: [380, 250], pts: P, lines: [{ a: v, b: x, k: 'ray', ext: 10 }, { a: v, b: y, k: 'ray', ext: 10 }], arcs: [{ v, a: x, b: y, reflex: true, r: 24, lab: done ? a + '°' : '?' }], prot: { c, rot: 0, flip: true, R: 100 }, lab: { [v]: 90 } });
      const ask = () => { slot.innerHTML = ''; if (k === 0) { lab.innerHTML = '① มุมด้านล่างที่วัดด้วยไม้โพรแทรกเตอร์มีขนาดกี่องศา'; slot.append(h('div', { class: 'rowstack' }, answerBox({ ...ctx, check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(3); k = 1; ask(); } }, String(sm), { hint: 'อ่านสเกลที่เริ่ม 0 จากแขนที่ทับเส้นฐาน' }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'องศา'))); }
        else { lab.innerHTML = `② มุมกลับ = 360° − ${sm}° = ?`; slot.append(h('div', { class: 'rowstack' }, answerBox({ ...ctx, check: (ok, hn) => { if (ok) draw(true); ctx.check(ok, hn); } }, String(a), { hint: 'มุมกลับกับมุมที่วัดได้ รวมกันเป็น 360°' }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'องศา'))); } };
      me.reveal = () => { draw(true); lab.innerHTML = `มุมกลับ = 360° − ${sm}° = <b>${a}°</b>`; slot.innerHTML = ''; };
      draw(false); bd.append(a4sd('', fig, lab, slot)); ask(); } }; // v107 (ผู้ใช้ขอ): picture LEFT · ? answer RIGHT
    return me; },
  /* find missing angles without a protractor */
  a4Calc({ type, x, y, L }) { const [A, B, C, D] = L, V = type === 'full' ? [175, 112] : [175, 150]; let P, lines, arcs, q, ans, hint;
    if (type === 'line') { P = { [A]: a4P(V, 140, 180), [B]: V, [C]: a4P(V, 140, 0), [D]: a4P(V, 130, x) }; lines = [{ a: A, b: C, k: 'line', ext: 10 }, { a: B, b: D, k: 'ray', ext: 10 }];
      arcs = [{ v: B, a: C, b: D, lab: x + '°', r: 32 }, { v: B, a: D, b: A, lab: '?', r: 26, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }]; q = `${A}${B}${C} เป็นเส้นตรง · หา ${a4m(A + B + D)}`; ans = 180 - x; hint = 'มุมตรงมีขนาด 180°'; }
    else if (type === 'line3') { const E = L[4] || 'E'; P = { [A]: a4P(V, 140, 180), [B]: V, [C]: a4P(V, 140, 0), [D]: a4P(V, 130, x), [E]: a4P(V, 130, 180 - y) }; lines = [{ a: A, b: C, k: 'line', ext: 10 }, { a: B, b: D, k: 'ray', ext: 10 }, { a: B, b: E, k: 'ray', ext: 10 }];
      arcs = [{ v: B, a: C, b: D, lab: x + '°', r: 40 }, { v: B, a: E, b: A, lab: y + '°', r: 40 }, { v: B, a: D, b: E, lab: '?', r: 28, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }]; q = `${A}${B}${C} เป็นเส้นตรง · หา ${a4m(D + B + E)}`; ans = 180 - x - y; hint = 'มุมทั้งสามบนเส้นตรงรวมกันได้ 180°'; }
    else if (type === 'right') { P = { [A]: a4P(V, 140, 90), [B]: V, [C]: a4P(V, 140, 0), [D]: a4P(V, 140, x) }; lines = [{ a: B, b: A, k: 'ray', ext: 10 }, { a: B, b: C, k: 'ray', ext: 10 }, { a: B, b: D, k: 'ray', ext: 10 }];
      arcs = [{ v: B, a: C, b: D, lab: x + '°', r: 44 }, { v: B, a: D, b: A, lab: '?', r: 36, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }]; q = `${a4Ang(A + B + C)} เป็นมุมฉาก · หา ${a4m(A + B + D)}`; ans = 90 - x; hint = 'มุมฉากมีขนาด 90°'; }
    else if (type === 'sum') { P = { [A]: a4P(V, 140, 0), [B]: V, [C]: a4P(V, 140, x), [D]: a4P(V, 140, x + y) }; lines = [{ a: B, b: A, k: 'ray', ext: 10 }, { a: B, b: C, k: 'ray', ext: 10 }, { a: B, b: D, k: 'ray', ext: 10 }];
      arcs = [{ v: B, a: A, b: C, lab: x + '°', r: 46 }, { v: B, a: C, b: D, lab: y + '°', r: 38, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }]; q = `หา ${a4m(A + B + D)}`; ans = x + y; hint = 'มุมใหญ่ = ผลบวกของมุมเล็กที่อยู่ติดกัน'; }
    else if (type === 'part') { P = { [A]: a4P(V, 140, 0), [B]: V, [C]: a4P(V, 140, x + y), [D]: a4P(V, 140, x) }; lines = [{ a: B, b: A, k: 'ray', ext: 10 }, { a: B, b: C, k: 'ray', ext: 10 }, { a: B, b: D, k: 'ray', ext: 10 }];
      arcs = [{ v: B, a: A, b: D, lab: x + '°', r: 44 }]; q = `${a4m(A + B + C)} = ${x + y}° และ ${a4m(A + B + D)} = ${x}° · หา ${a4m(D + B + C)}`; ans = y; hint = 'มุมที่หา = มุมใหญ่ − มุมเล็ก'; }
    else { P = { [A]: a4P(V, 96, 0), [B]: V, [C]: a4P(V, 96, x), [D]: a4P(V, 96, x + y) }; lines = [{ a: B, b: A, k: 'ray', ext: 10 }, { a: B, b: C, k: 'ray', ext: 10 }, { a: B, b: D, k: 'ray', ext: 10 }];
      arcs = [{ v: B, a: A, b: C, lab: x + '°', r: 40 }, { v: B, a: C, b: D, lab: y + '°', r: 32 }, { v: B, a: D, b: A, lab: '?', r: 24, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }]; q = `มุมรอบจุด ${B} รวมกันได้ 360° · หา ${a4m(D + B + A)}`; ans = 360 - x - y; hint = 'มุมรอบจุดรวมกันได้ 360°'; }
    const me = { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `a4q ${type} ${x} ${y} ${L}`, __diff: { right: 20, line: 24, sum: 22, part: 26, line3: 30, full: 28 }[type], mount(bd, ctx) { bd.append(a4sd('', h('div', { class: 'p4-fig', html: a4SVG({ vb: [350, 220], pts: P, lines, arcs, lab: { [B]: type === 'full' ? 225 : 270 } }) }),
      h('div', { class: 'rowstack' }, answerBox(ctx, String(ans), { hint }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'องศา')))); } };
    return me; },
  /* build an angle: tap the protractor scale, fine-tune ±1°, check */
  a4Build({ nm, deg, left }) { const [x, v, y] = [...nm], refl = deg > 180, c = [190, refl ? 105 : 175], d1 = left ? 180 : 0, flip = refl, want = refl ? -(360 - deg) : left ? 180 - deg : deg, sm = 360 - deg;
    /* v107 (ผู้ใช้ขอ): the size of the angle marked so far is shown live (dashed arm + arc + "ตอนนี้ …°");
       a reflex angle first asks which angle to build on the other side (360° − มุมกลับ), then the child marks it */
    const me = { prompt: `สร้าง ${a4Ang(nm)} ให้มีขนาด <b>${deg}°</b>`, say: `สร้างมุม ${[...nm].join(' ')} ให้มีขนาด ${deg} องศา`, __sig: `a4b ${nm} ${deg} ${left ? 'L' : 'R'}`, __diff: refl ? 30 : left ? 22 : 18, mount(bd, ctx) {
      let d = null, done = false, stage = refl ? 0 : 1; const fig = h('div', { class: 'a4-board ia rvl' }), lab = h('div', { class: 'p4steplab' }), now = h('div', { class: 'a4-now' }), slot = h('div', { class: 'colstack' });
      const cur = () => d == null ? null : refl ? 360 + d : left ? 180 - d : d;
      const draw = () => { const P = { [x]: a4P(c, 150, d1), [v]: c }, lines = [{ a: v, b: x, k: 'ray', ext: 10 }], arcs = []; let nolab = [], nodot = [];
        if (done) { P[y] = a4P(c, refl ? 120 : 150, d); lines.push({ a: v, b: y, k: 'ray', ext: 10 }); arcs.push({ v, a: x, b: y, reflex: refl, lab: deg + '°', r: 26 }); }
        else if (d != null) { P['*'] = a4P(c, refl ? 120 : 150, d); nolab = nodot = ['*']; lines.push({ a: v, b: '*', k: 'seg', dash: true, col: '#6F6A93', w: 2.4 }); arcs.push({ v, a: x, b: '*', reflex: refl, lab: cur() + '°', r: 26, col: '#3C8DDB', fill: 'rgba(60,141,219,.10)' }); }
        fig.innerHTML = a4SVG({ vb: [380, 250], pts: P, lines, arcs, nolab, nodot, prot: { c, rot: 0, flip, hitArea: !done && stage === 1, mark: d == null || done ? null : (flip ? -d : d) }, lab: { [v]: refl ? -(360 - deg) / 2 : 270 } });
        now.innerHTML = stage < 1 ? '' : done ? `${a4m(nm)} = <b>${deg}°</b>` : d == null ? 'ตอนนี้: ยังไม่ได้ทำเครื่องหมาย' : refl ? `ตอนนี้: มุมด้านล่าง <b>${-d}°</b> · มุมกลับ <b>${cur()}°</b>` : `ตอนนี้มุมมีขนาด <b>${cur()}°</b>`; };
      const set = nd => { if (done || stage < 1) return; d = nd; sfx.tap(); draw(); };
      fig.addEventListener('click', e => { e.stopPropagation(); if (done || stage < 1 || !e.target.closest('.a4-phit')) return; let k = Math.round(a4dir(c, a4pt(fig.querySelector('svg'), e))); if (flip) k = k > 180 ? k - 360 : k; if (!flip) k = Math.max(0, Math.min(180, k > 270 ? 0 : k)); else k = Math.max(-180, Math.min(0, k < -270 ? 0 : k > 90 ? -180 : k)); set(k); });
      const pm = s => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (d == null || stage < 1) return; set(Math.max(flip ? -180 : 0, Math.min(flip ? 0 : 180, d + (flip || left ? -s : s)))); } }, (s > 0 ? '+' : '−') + Math.abs(s) + '°');
      const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (done) return; if (d == null) { now.textContent = 'แตะที่สเกลก่อนนะ'; return; }
        if (d === want) { done = true; d = want; draw(); ctx.check(true); } else { ctx.check(false, left ? 'แขน ' + v + x + ' อยู่ทางซ้าย → นับ 0 จากซ้าย ใช้สเกลวงใน' : refl ? `ทำเครื่องหมายที่ ${sm}° ของสเกลที่เริ่ม 0 จากแขน ${v}${x}` : 'แขน ' + v + x + ' อยู่ทางขวา → นับ 0 จากขวา ใช้สเกลวงนอก'); } } }, icon('check'), 'ตรวจ');
      const tools = h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, pm(-5), pm(-1), pm(1), pm(5)), chk);
      const toBuild = () => { stage = 1; slot.innerHTML = ''; tools.style.display = ''; lab.innerHTML = refl ? `② แตะสเกล<b>ด้านล่าง</b> ทำเครื่องหมายที่ ${sm}° แล้วกด “ตรวจ”` : 'แตะที่สเกลเพื่อทำเครื่องหมาย แล้วปรับทีละ 1°'; draw(); };
      if (refl) { tools.style.display = 'none'; lab.innerHTML = `① มุมกลับ ${deg}° — ต้องสร้างมุม<b>อีกด้านหนึ่ง</b> (ด้านล่าง) กี่องศาก่อน`;
        slot.append(h('div', { class: 'rowstack' }, answerBox({ ...ctx, check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(3); toBuild(); } }, String(sm), { hint: 'มุมกลับกับมุมอีกด้านหนึ่ง รวมกันได้ 1 รอบ = 360°' }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'องศา'))); }
      else toBuild();
      fig.reveal = () => { stage = 1; d = want; done = true; slot.innerHTML = ''; tools.style.display = 'none'; lab.innerHTML = refl ? `มุมอีกด้าน = 360° − ${deg}° = ${sm}°` : ''; draw(); };
      draw(); bd.append(a4sd('a4-bq', fig, lab, slot, now, tools)); } };
    return me; }
});
/* ---------- grouped / text items ---------- */
const A4_PLANE = [['หน้าโต๊ะ', 1], ['ผนังห้องเรียน', 1], ['หน้ากระดาษ', 1], ['พื้นห้อง', 1], ['กระจกหน้าต่าง', 1], ['ผิวน้ำนิ่งในอ่าง', 1], ['กระดานไวต์บอร์ด', 1], ['ผิวลูกบอล', 0], ['ผิวด้านข้างของแก้วน้ำ', 0], ['เปลือกไข่', 0], ['ลูกโลก', 0], ['ผิวกระป๋องด้านข้าง', 0], ['ร่มที่กางอยู่', 0]];
const a4PlaneQ = () => { const S = [...pkF(A4_PLANE.filter(x => x[1]), 2), ...pkF(A4_PLANE.filter(x => !x[1]), 2)];
  return { ...Q.ixGroup({ q: 'จัดลงกล่อง: สิ่งใดมีผิว<b>เป็นระนาบ</b> (เรียบแบน)', bins: ['เป็นระนาบ', 'ไม่เป็นระนาบ'], items: S.map(([t, ok]) => ({ label: t, bin: ok ? 0 : 1, why: ok ? 'ผิวนี้เรียบแบน' : 'ผิวนี้โค้ง ไม่เรียบแบน' })) }), __sig: 'a4p ' + S.map(x => x[0]).join() }; };
const A4_TF = [['เส้นตรงไม่มีจุดปลาย', 1], ['รังสี AB กับรังสี BA เป็นรังสีเดียวกัน', 0], ['ส่วนของเส้นตรง AB กับส่วนของเส้นตรง BA คือเส้นเดียวกัน', 1], ['รังสีมีจุดเริ่มต้น 1 จุด', 1], ['เส้นตรงวัดความยาวได้', 0], ['ส่วนของเส้นตรงวัดความยาวได้', 1], ['ผ่านจุด 2 จุด ลากเส้นตรงได้เพียง 1 เส้น', 1], ['ผ่านจุด 1 จุด ลากเส้นตรงได้เพียง 1 เส้น', 0], ['เส้นตรง AB กับเส้นตรง BA คือเส้นเดียวกัน', 1], ['ส่วนของเส้นตรงมีจุดปลาย 1 จุด', 0], ['รังสีวัดความยาวได้', 0], ['เส้นตรงสองเส้นที่ตัดกันมีจุดตัด 1 จุด', 1]];
const a4TFQ = () => { const S = pkF(A4_TF, 4); return { ...Q.ixGroup({ q: 'ข้อความใด<b>ถูกต้อง</b> ข้อความใด<b>ไม่ถูกต้อง</b>', bins: ['✓ ถูกต้อง', '✗ ไม่ถูกต้อง'], items: S.map(([t, ok]) => ({ label: t, bin: ok ? 0 : 1 })), hint: 'นึกถึงหัวลูกศรและจุดปลายของแต่ละแบบ' }), __sig: 'a4f ' + S.map(x => x[0]).join() }; };
const a4mini = a => `<svg viewBox="0 0 80 60" width="80" height="60" class="a4-mini">${(() => { const c = [40, 42]; return a4Line(c, a4P(c, 34, 0), 'seg', { w: 2.4 }) + a4Line(c, a4P(c, 34, a), 'seg', { w: 2.4 }) + a4Arc(c, 0, a, { r: 11, reflex: a > 180 }); })()}</svg>`;
const a4SortQ = () => { const A = [rnd(20, 75), 90, rnd(110, 165), rnd(25, 80), rnd(100, 170)], S = shuffle(A).slice(0, 4);
  return { ...Q.ixGroup({ q: 'จัดมุมลงกล่องให้ถูกชนิด', bins: ['มุมแหลม', 'มุมฉาก', 'มุมป้าน'], items: S.map(a => ({ label: a4mini(a), bin: a4kind(a), why: A4WHY[a4kind(a)] })) }), __sig: 'a4o ' + S.join() }; };
const A4_BUILD = ['ลากแขนของมุม 1 แขน และกำหนดจุดยอดมุม', 'วางจุดศูนย์กลางไม้โพรแทรกเตอร์ที่จุดยอดมุม ให้เส้นฐานทับแขน', 'นับจาก 0 บนแขนนั้น ทำเครื่องหมายที่ขนาดมุมที่ต้องการ', 'ลากแขนอีกแขนจากจุดยอดผ่านเครื่องหมาย แล้วเขียนชื่อและขนาดมุม'];
const A4_MEAS = ['วางจุดศูนย์กลางไม้โพรแทรกเตอร์ที่จุดยอดมุม', 'หมุนให้เส้นฐานทับแขนข้างหนึ่ง', 'ดูสเกลที่เริ่ม 0 จากแขนที่ทับเส้นฐาน', 'อ่านค่าที่แขนอีกข้างผ่าน'];
const a4SeqQ = which => ({ ...Q.p4Seq({ text: which ? 'เรียงขั้นตอน<b>การสร้างมุม</b>ด้วยไม้โพรแทรกเตอร์' : 'เรียงขั้นตอน<b>การวัดขนาดมุม</b>ด้วยไม้โพรแทรกเตอร์', cards: which ? A4_BUILD : A4_MEAS }), __sig: 'a4z ' + which });
/* ---------- random data ---------- */
const a4ang3 = () => a4Letters(3).join('');
const a4ptsRand = (k, th) => { const L = a4Letters(k, th); for (let g = 0; g < 200; g++) { const P = {}; let ok = true; L.forEach(n => P[n] = [rnd(40, 300), rnd(40, 195)]); const V = Object.values(P);
    for (let i = 0; i < V.length && ok; i++) for (let j = i + 1; j < V.length && ok; j++) { if (Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1]) < 70) ok = false; for (let m = j + 1; m < V.length && ok; m++) { const ar = Math.abs((V[j][0] - V[i][0]) * (V[m][1] - V[i][1]) - (V[m][0] - V[i][0]) * (V[j][1] - V[i][1])); if (ar < 2600) ok = false; } }
    if (ok) return P; } return { [L[0]]: [60, 60], [L[1]]: [280, 80], [L[2]]: [170, 190], [L[3]]: [70, 170] }; };
const a4gridQ = mode => { const L = a4Letters(4, false); for (;;) { const pts = {}; L.forEach(n => { pts[n] = [rnd(0, 7), rnd(0, 5)]; }); const V = Object.values(pts).map(p => p.join()); if (new Set(V).size < 4) continue;
    const ref = L[0], [ri, rj] = pts[ref]; if (mode === 'find') { const t = L[rnd(1, 3)], dx = pts[t][0] - ri, dy = rj - pts[t][1]; if (!dx && !dy) continue; return Q.a4Grid({ mode, pts, ref, dx, dy }); }
    const dx = rnd(-3, 3), dy = rnd(-2, 2), ti = ri + dx, tj = rj - dy; if ((!dx && !dy) || ti < 0 || ti > 7 || tj < 0 || tj > 5 || V.includes([ti, tj].join())) continue; return Q.a4Grid({ mode, pts, ref, dx, dy, nm: 'P' }); } };
const a4acute = () => rnd(4, 15) * 5, a4obt = () => rnd(19, 34) * 5, a4refl = () => rnd(38, 69) * 5;
const a4anyA = () => pick([a4acute, () => 90, a4obt, () => 180])();
const a4d1 = a => a >= 180 ? pick([0, 10, -10]) : pick([0, 10, 20, -10, 30, 180 - a, 160 - a]);

/* ---------- lessons ---------- */
const L4A = (no, place, title, short, goal, teach, game) => ({ id: 1460 + no, place, title, short, tone: TONES5[(no + 3) % 6], goal, teach, game, learned: true });
const a4N = (k, f) => Array.from({ length: k }, f);
const a4ex = (nm, d1, a, o) => a4AngFig(nm, d1, a, { k: 'ray', vb: [340, 210], c: [160, 150], L: 110, ...o });
const LESSONS_P4C8 = [
  L4A(1, 'ลานระนาบ', 'ระนาบ จุด และการใช้จุดแสดงตำแหน่ง', 'ระนาบและจุด', 'บอกความหมายของระนาบ ใช้จุดแสดงตำแหน่ง และบอกตำแหน่งของจุดบนตาราง',
    [...learnStep('ยินดีต้อนรับสู่ <b>ทะเลทรายมุม</b>!', 'ยินดีต้อนรับสู่ทะเลทรายมุม', [
      { fig: a4SVG({ vb: [300, 180], plane: [20, 30, 260, 120] }), name: 'ระนาบ', text: 'พื้นผิวเรียบแบนที่แผ่ออกไปทุกทิศทาง เช่น หน้าโต๊ะ ผนังห้อง หน้ากระดาษ', sum: 'ระนาบเป็นผิวเรียบแบน แผ่ออกไปทุกทิศทาง' },
      { fig: a4SVG({ vb: [300, 180], plane: [20, 30, 260, 120], pts: { A: [100, 80], B: [200, 115] } }), name: 'จุด', text: 'จุดใช้แสดงตำแหน่ง เรียกชื่อด้วยตัวอักษร เช่น จุด A จุด B', sum: 'จุดใช้บอกตำแหน่ง และเรียกชื่อด้วยตัวอักษร' },
      { fig: a4SVG({ vb: [300, 180], grid: { x0: 30, y0: 20, n: 7, m: 4, g: 34 }, pts: { A: [64, 122], B: [166, 54] }, lab: { A: 45, B: 45 } }), name: 'บอกตำแหน่งด้วยการนับช่อง', text: 'จุด B อยู่ห่างจากจุด A ไปทางขวา 3 ช่อง และขึ้นไป 2 ช่อง', sum: 'บอกตำแหน่งจุด: นับช่องตามแนวนอนก่อน แล้วนับตามแนวตั้ง' }]),
     pexStep('ตัวอย่างทีละขั้น: จุดใดอยู่ทางขวาของจุด K 4 ช่อง ลงมา 1 ช่อง', 'ตัวอย่างทีละขั้น', [
       ['① เริ่มที่จุด K', 'หาจุด K ก่อน', a4SVG({ vb: [300, 210], grid: { x0: 30, y0: 24, n: 7, m: 5, g: 34 }, pts: { K: [64, 92], M: [200, 126], N: [166, 58] }, hl: ['K'], lab: { K: 45, M: 45, N: 45 } })],
       ['② นับทางขวา 4 ช่อง', 'แนวนอนก่อน', a4SVG({ vb: [300, 210], grid: { x0: 30, y0: 24, n: 7, m: 5, g: 34 }, pts: { K: [64, 92], M: [200, 126], N: [166, 58] }, lines: [], lab: { K: 45, M: 45, N: 45 }, extra: '<path d="M64 92 H200" stroke="#E5487A" stroke-width="3" stroke-dasharray="6 5"/>' })],
       ['③ ลงมา 1 ช่อง', 'แล้วนับแนวตั้ง → พบจุด M', a4SVG({ vb: [300, 210], grid: { x0: 30, y0: 24, n: 7, m: 5, g: 34 }, pts: { K: [64, 92], M: [200, 126], N: [166, 58] }, hl: ['M'], lab: { K: 45, M: 45, N: 45 }, extra: '<path d="M64 92 H200 V126" stroke="#E5487A" stroke-width="3" stroke-dasharray="6 5" fill="none"/>' })]], 'คำตอบ <b>จุด M</b>'),
     T('ลองวางจุดบนระนาบ', 'ลองวางจุดบนระนาบ', el => el.append(simA4Plane()))],
    () => [...a4N(2, () => a4gridQ('find')), ...a4N(2, () => a4gridQ('place')), a4PlaneQ()]),
  L4A(2, 'เนินเส้นตรง', 'เส้นตรง รังสี และส่วนของเส้นตรง', 'เส้นตรง รังสี', 'บอกความแตกต่างของเส้นตรง รังสี และส่วนของเส้นตรง เขียนชื่อและสัญลักษณ์ได้',
    [...learnStep('<b>เส้นตรง รังสี ส่วนของเส้นตรง</b>', 'เส้นตรง รังสี ส่วนของเส้นตรง', [
      { fig: a4SVG({ vb: [300, 130], pts: { A: [90, 75], B: [210, 75] }, lines: [{ a: 'A', b: 'B', k: 'line', ext: 50 }], lab: { A: 90, B: 90 } }), name: `เส้นตรง ${a4Sym('line', 'AB')}`, text: 'ยาวไม่สิ้นสุดทั้งสองข้าง ไม่มีจุดปลาย · เรียกชื่อ AB หรือ BA ก็ได้', sum: 'เส้นตรงมีหัวลูกศร 2 ข้าง และไม่มีจุดปลาย' },
      { fig: a4SVG({ vb: [300, 130], pts: { A: [70, 75], B: [190, 75] }, lines: [{ a: 'A', b: 'B', k: 'ray', ext: 60 }], hl: ['A'], lab: { A: 90, B: 90 } }), name: `รังสี ${a4Sym('ray', 'AB')}`, text: 'มีจุดเริ่มต้น 1 จุด ยาวไม่สิ้นสุดข้างเดียว · ชื่อต้องขึ้นต้นด้วยจุดเริ่มต้น', sum: 'รังสีมีหัวลูกศร 1 ข้าง · รังสี AB กับรังสี BA ไม่ใช่รังสีเดียวกัน' },
      { fig: a4SVG({ vb: [300, 130], pts: { A: [80, 75], B: [220, 75] }, lines: [{ a: 'A', b: 'B', k: 'seg' }], lab: { A: 90, B: 90 } }), name: `ส่วนของเส้นตรง ${a4Sym('seg', 'AB')}`, text: 'มีจุดปลาย 2 จุด วัดความยาวได้', sum: 'ส่วนของเส้นตรงไม่มีหัวลูกศร มีจุดปลาย 2 จุด จึงวัดความยาวได้' }]),
     pexStep('ตัวอย่างทีละขั้น: รังสี ' + a4Sym('ray', 'QP'), 'ตัวอย่างทีละขั้น รังสี คิว พี', [
       ['① หาจุดเริ่มต้น', 'ตัวแรกของชื่อ คือจุด Q', a4SVG({ vb: [300, 150], pts: { P: [230, 60], Q: [80, 110] }, hl: ['Q'] })],
       ['② ลากผ่านจุด P', 'จาก Q ไปทาง P', a4SVG({ vb: [300, 150], pts: { P: [230, 60], Q: [80, 110] }, lines: [{ a: 'Q', b: 'P', k: 'seg' }], hl: ['Q'] })],
       ['③ ต่อไปไม่สิ้นสุด', 'ใส่หัวลูกศรด้านเดียว', a4SVG({ vb: [300, 150], pts: { P: [230, 60], Q: [80, 110] }, lines: [{ a: 'Q', b: 'P', k: 'ray', ext: 40 }], hl: ['Q'] })]], `ได้ ${a4Sym('ray', 'QP')} ซึ่งต่างจาก ${a4Sym('ray', 'PQ')}`),
     T('ลองลากจุดและเปลี่ยนแบบ', 'ลองลากจุดและเปลี่ยนแบบ', el => el.append(simA4Line())),
     learnStep('เรื่องใหม่: <b>จุดตัด</b>', 'เรื่องใหม่ จุดตัด', [
       { fig: a4SVG({ vb: [300, 180], pts: { A: [40, 50], B: [260, 140], C: [60, 150], D: [250, 30], P: a4cross([40, 50], [260, 140], [60, 150], [250, 30]) }, lines: [{ a: 'A', b: 'B', k: 'line', ext: 14 }, { a: 'C', b: 'D', k: 'line', ext: 14 }], hl: ['P'], lab: { P: 90 } }), name: 'จุดตัด', text: 'เส้นตรง AB กับเส้นตรง CD ตัดกันที่จุด P · จุด P อยู่บนเส้นตรงทั้งสองเส้น', sum: 'เส้นตรงสองเส้นที่ตัดกัน มีจุดตัดเพียง 1 จุด' },
       { fig: a4SVG({ vb: [300, 160], pts: { M: [80, 104], N: [220, 56] }, lines: [{ a: 'M', b: 'N', k: 'line', ext: 30 }] }), name: 'จุดบนเส้นตรงเดียวกัน', text: 'จุด M และจุด N อยู่บนเส้นตรงเดียวกัน เรียกว่าเส้นตรง MN หรือเส้นตรง NM', sum: 'ผ่านจุด 2 จุด ลากเส้นตรงได้เพียง 1 เส้นเท่านั้น' }]),
     pexStep('ตัวอย่างทีละขั้น: หาจุดตัด', 'ตัวอย่างทีละขั้น หาจุดตัด', [
       ['① ลาก ' + a4Sym('line', 'GH'), 'เส้นแรก', a4SVG({ vb: [300, 180], pts: { G: [40, 140], H: [260, 60], J: [70, 40], K: [240, 160] }, lines: [{ a: 'G', b: 'H', k: 'line', ext: 14 }] })],
       ['② ลาก ' + a4Sym('line', 'JK'), 'เส้นที่สอง', a4SVG({ vb: [300, 180], pts: { G: [40, 140], H: [260, 60], J: [70, 40], K: [240, 160] }, lines: [{ a: 'G', b: 'H', k: 'line', ext: 14 }, { a: 'J', b: 'K', k: 'line', ext: 14 }] })],
       ['③ ตั้งชื่อจุดตัด', 'จุดที่อยู่บนทั้งสองเส้น = จุด O', a4SVG({ vb: [300, 180], pts: { G: [40, 140], H: [260, 60], J: [70, 40], K: [240, 160], O: a4cross([40, 140], [260, 60], [70, 40], [240, 160]) }, lines: [{ a: 'G', b: 'H', k: 'line', ext: 14 }, { a: 'J', b: 'K', k: 'line', ext: 14 }], hl: ['O'], lab: { O: 270 } })]], `${a4Sym('line', 'GH')} ตัด ${a4Sym('line', 'JK')} ที่<b>จุด O</b>`)],
    () => [...a4N(2, () => Q.a4Kind({ k: pick(['line', 'ray', 'seg']), ab: a4Letters(2, false).join('') })), ...a4N(2, () => { const P = a4ptsRand(4, false), L = Object.keys(P); return Q.a4Draw({ k: pick(['line', 'ray', 'seg']), name: shuffle(L).slice(0, 2).join(''), pts: P }); }), Q.a4Inter({ L: a4Letters(5, false).join('') }), a4TFQ()]),
  L4A(3, 'โอเอซิสมุม', 'มุม ส่วนประกอบของมุม การเรียกชื่อมุมและการใช้สัญลักษณ์แทนมุม', 'ส่วนประกอบของมุม', 'บอกส่วนประกอบของมุม เรียกชื่อมุมและใช้สัญลักษณ์แทนมุม',
    [...learnStep('<b>มุม</b>', 'มุม', [
      { fig: a4ex('ABC', 10, 55), name: 'มุม', text: 'เกิดจากรังสี 2 เส้นที่มีจุดเริ่มต้นร่วมกัน', sum: 'มุมเกิดจากรังสี 2 เส้นที่มีจุดเริ่มต้นร่วมกัน' },
      { fig: a4ex('ABC', 10, 55, { hl: ['B'] }), name: 'จุดยอดมุม · แขนของมุม', text: 'จุด B เป็นจุดยอดมุม · BA และ BC เป็นแขนของมุม', sum: 'จุดเริ่มต้นที่ร่วมกัน = จุดยอดมุม · รังสีทั้งสองเส้น = แขนของมุม' },
      { fig: p4big(`มุม ${a4Ang('ABC')} หรือ มุม ${a4Ang('CBA')}`), name: 'การเรียกชื่อมุม', text: 'ชื่อจุดยอดมุมอยู่ตรงกลางเสมอ และใช้สัญลักษณ์ ^ เหนือจุดยอด' }], 'จุดยอดมุมอยู่ตรงกลางชื่อ'),
     pexStep('ตัวอย่างทีละขั้น: เรียกชื่อมุม', 'ตัวอย่างทีละขั้น เรียกชื่อมุม', [['① หาจุดยอดมุม', 'จุดที่แขนทั้งสองเริ่มต้น คือจุด ข', a4ex('กขค', 20, 70, { extra: '' })], ['② อ่านจากแขนหนึ่ง ผ่านจุดยอด ไปอีกแขน', 'ก → ข → ค', p4big(`มุม ${a4Ang('กขค')}`)]], `มุม ${a4Ang('กขค')} หรือ มุม ${a4Ang('คขก')}`),
     T('ลองหมุนแขนของมุม', 'ลองหมุนแขนของมุม', el => el.append(simA4Angle('name'))),
     learnStep('เรื่องใหม่: <b>มุมที่มีจุดยอดร่วมกัน</b>', 'เรื่องใหม่ มุมที่มีจุดยอดร่วมกัน', [
       { fig: a4SVG({ vb: [300, 190], pts: { O: [140, 165], A: a4P([140, 165], 120, 15), B: a4P([140, 165], 120, 70), C: a4P([140, 165], 120, 140) }, lines: ['A', 'B', 'C'].map(z => ({ a: 'O', b: z, k: 'ray', ext: 10 })), lab: { O: 270 } }), name: 'แขนร่วมกัน', text: 'มุม AOB กับมุม BOC มีแขน OB ร่วมกัน', sum: 'มุมที่มีจุดยอดร่วมกันอาจมีแขนร่วมกัน 1 แขน' },
       { fig: a4SVG({ vb: [300, 190], pts: { O: [140, 165], A: a4P([140, 165], 120, 15), B: a4P([140, 165], 120, 70), C: a4P([140, 165], 120, 140) }, lines: ['A', 'B', 'C'].map(z => ({ a: 'O', b: z, k: 'ray', ext: 10 })), arcs: [{ v: 'O', a: 'A', b: 'B', r: 34 }, { v: 'O', a: 'B', b: 'C', r: 34, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }, { v: 'O', a: 'A', b: 'C', r: 54, col: '#1B8862', fill: 'rgba(27,136,98,.06)' }], lab: { O: 270 } }), name: 'นับให้ครบ', text: `${a4Ang('AOB')} · ${a4Ang('BOC')} · ${a4Ang('AOC')} — มุมเล็ก 2 มุม และมุมที่รวมกันอีก 1 มุม = 3 มุม` }], 'นับมุมเล็กก่อน แล้วนับมุมที่รวมกัน'),
     pexStep('ตัวอย่างทีละขั้น: นับมุมจากแขน 4 เส้น', 'ตัวอย่างทีละขั้น นับมุม', [
       ['① มุมเล็กติดกัน', '3 มุม', a4SVG({ vb: [300, 190], pts: { P: [150, 170], Q: a4P([150, 170], 120, 10), R: a4P([150, 170], 120, 55), S: a4P([150, 170], 120, 110), T: a4P([150, 170], 120, 160) }, lines: ['Q', 'R', 'S', 'T'].map(z => ({ a: 'P', b: z, k: 'ray', ext: 10 })), arcs: [{ v: 'P', a: 'Q', b: 'R', r: 40 }, { v: 'P', a: 'R', b: 'S', r: 40, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }, { v: 'P', a: 'S', b: 'T', r: 40, col: '#1B8862', fill: 'rgba(27,136,98,.12)' }], lab: { P: 270 } })],
       ['② รวม 2 ช่อง', '2 มุม', a4SVG({ vb: [300, 190], pts: { P: [150, 170], Q: a4P([150, 170], 120, 10), R: a4P([150, 170], 120, 55), S: a4P([150, 170], 120, 110), T: a4P([150, 170], 120, 160) }, lines: ['Q', 'R', 'S', 'T'].map(z => ({ a: 'P', b: z, k: 'ray', ext: 10 })), arcs: [{ v: 'P', a: 'Q', b: 'S', r: 34 }, { v: 'P', a: 'R', b: 'T', r: 52, col: '#3C8DDB', fill: 'rgba(60,141,219,.1)' }], lab: { P: 270 } })],
       ['③ รวม 3 ช่อง', '1 มุม · รวม 3 + 2 + 1 = 6 มุม', a4SVG({ vb: [300, 190], pts: { P: [150, 170], Q: a4P([150, 170], 120, 10), R: a4P([150, 170], 120, 55), S: a4P([150, 170], 120, 110), T: a4P([150, 170], 120, 160) }, lines: ['Q', 'R', 'S', 'T'].map(z => ({ a: 'P', b: z, k: 'ray', ext: 10 })), arcs: [{ v: 'P', a: 'Q', b: 'T', r: 40 }], lab: { P: 270 } })]], 'แขน 4 เส้น มี <b>6 มุม</b>')],
    () => []),
  L4A(4, 'หน้าผามุมฉาก', 'มุมฉาก และมุมตรง', 'มุมฉาก มุมตรง', 'บอกลักษณะของมุมฉากและมุมตรง และเปรียบเทียบมุมกับมุมฉาก',
    [...learnStep('<b>มุมฉาก</b> และ <b>มุมตรง</b>', 'มุมฉาก และมุมตรง', [
      { fig: a4ex('ABC', 0, 90), name: 'มุมฉาก', text: 'มุมที่มีขนาด 90 องศา (90°) มีสัญลักษณ์ ⌐ ที่จุดยอด เช่น มุมของกระดาษ', sum: 'มุมฉากมีขนาด 90°' },
      { fig: a4ex('ABC', 0, 180), name: 'มุมตรง', text: 'มุมที่มีขนาด 180° แขนทั้งสองอยู่ในแนวเส้นตรงเดียวกัน = มุมฉาก 2 มุม', sum: 'มุมตรงมีขนาด 180° เท่ากับมุมฉาก 2 มุม' }]),
     pexStep('ตัวอย่างทีละขั้น: เทียบมุมกับมุมฉาก', 'ตัวอย่างทีละขั้น', [
       ['① วางมุมกระดาษ', 'มุมกระดาษตรงจุดยอด ขอบทับแขน BA', a4ex('ABC', 0, 115, { rm: false, under: '<path d="M222 150 V88 H160" fill="rgba(255,194,76,.2)" stroke="#E6A21E" stroke-width="2.4" stroke-dasharray="6 4"/>' })],
       ['② ดูแขน BC', 'แขน BC อยู่นอกมุมกระดาษ', a4ex('ABC', 0, 115, { rm: false, under: '<path d="M222 150 V88 H160" fill="rgba(255,194,76,.2)" stroke="#E6A21E" stroke-width="2.4" stroke-dasharray="6 4"/>' })]], `${a4Ang('ABC')} <b>ใหญ่กว่ามุมฉาก</b>`),
     T('ลองหมุนแขนเทียบกับมุมกระดาษ', 'ลองหมุนแขนเทียบกับมุมกระดาษ', el => el.append(simA4Angle('cmp')))],
    () => []),
  L4A(5, 'ลานสามมุม', 'มุมแหลม มุมป้าน และมุมกลับ', 'แหลม ป้าน กลับ', 'จำแนกมุมแหลม มุมฉาก มุมป้าน มุมตรง และมุมกลับ',
    [...learnStep('<b>มุมแหลม มุมป้าน มุมกลับ</b>', 'มุมแหลม มุมป้าน มุมกลับ', [
      { fig: a4ex('ABC', 0, 50), name: 'มุมแหลม', text: 'มากกว่า 0° แต่น้อยกว่า 90°', sum: 'มุมแหลมเล็กกว่ามุมฉาก' },
      { fig: a4ex('ABC', 0, 130), name: 'มุมป้าน', text: 'มากกว่า 90° แต่น้อยกว่า 180°', sum: 'มุมป้านใหญ่กว่ามุมฉาก แต่เล็กกว่ามุมตรง' },
      { fig: a4AngFig('ABC', 0, 240, { k: 'ray', vb: [340, 230], c: [170, 110], L: 110 }), name: 'มุมกลับ', text: 'มากกว่า 180° แต่น้อยกว่า 360° (วัดด้านนอก)', sum: 'มุมกลับใหญ่กว่ามุมตรง' }]),
     pexStep('ตัวอย่างทีละขั้น: บอกชนิดของมุม', 'ตัวอย่างทีละขั้น', [['① เทียบกับมุมฉาก', 'ใหญ่กว่ามุมฉาก', a4ex('PQR', 15, 145)], ['② เทียบกับมุมตรง', 'เล็กกว่ามุมตรง', a4ex('PQR', 15, 145)]], `${a4Ang('PQR')} เป็น<b>มุมป้าน</b>`),
     T('ลองหมุนให้ได้มุมครบทุกชนิด', 'ลองหมุนให้ได้มุมครบทุกชนิด', el => el.append(simA4Angle('kind')))],
    () => []),
  L4A(6, 'หอวัดมุม', 'การวัดขนาดของมุมแหลม มุมฉาก มุมป้านและมุมตรง', 'วัดขนาดมุม', 'ใช้ไม้โพรแทรกเตอร์วัดขนาดมุม และหาขนาดมุมจากมุมฉากหรือมุมตรง',
    [...learnStep('<b>ไม้โพรแทรกเตอร์</b>', 'ไม้โพรแทรกเตอร์', [
      { fig: a4SVG({ vb: [300, 160], prot: { c: [150, 145], rot: 0, R: 125 } }), name: 'สเกล 2 วง', text: 'วงนอกเริ่ม 0 ทางขวา · วงในเริ่ม 0 ทางซ้าย · หน่วยเป็นองศา (°)', sum: 'ไม้โพรแทรกเตอร์มีสเกล 2 วง เริ่ม 0 คนละข้าง' },
      { fig: a4SVG({ vb: [300, 160], prot: { c: [150, 145], rot: 0, R: 125 }, extra: '<circle cx="150" cy="145" r="9" fill="none" stroke="#E5487A" stroke-width="3"/><path d="M25 145 H275" stroke="#E5487A" stroke-width="3" opacity=".7"/>' }), name: 'จุดศูนย์กลาง · เส้นฐาน', text: 'วางจุดศูนย์กลางที่จุดยอดมุม ให้เส้นฐานทับแขนข้างหนึ่ง' }], 'อ่านสเกลที่เริ่ม 0 จากแขนที่ทับเส้นฐาน'),
     pexStep('ตัวอย่างทีละขั้น: วัด ' + a4m('ABC'), 'ตัวอย่างทีละขั้น วัดมุม', [
       ['① วางจุดศูนย์กลาง', 'ที่จุดยอด B', a4SVG({ vb: [380, 230], pts: { A: a4P([190, 170], 150, 0), B: [190, 170], C: a4P([190, 170], 150, 65) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 10 }, { a: 'B', b: 'C', k: 'ray', ext: 10 }], prot: { c: [190, 170], rot: -20 }, lab: { B: 270 } })],
       ['② หมุนเส้นฐานทับแขน BA', 'BA ทับ 0 ของวงนอก', a4SVG({ vb: [380, 230], pts: { A: a4P([190, 170], 150, 0), B: [190, 170], C: a4P([190, 170], 150, 65) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 10 }, { a: 'B', b: 'C', k: 'ray', ext: 10 }], prot: { c: [190, 170], rot: 0 }, lab: { B: 270 } })],
       ['③ อ่านวงนอก', 'แขน BC ผ่าน 65', a4SVG({ vb: [380, 230], pts: { A: a4P([190, 170], 150, 0), B: [190, 170], C: a4P([190, 170], 150, 65) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 10 }, { a: 'B', b: 'C', k: 'ray', ext: 10 }], prot: { c: [190, 170], rot: 0, mark: 65 }, lab: { B: 270 } })]], `${a4m('ABC')} = <b>65°</b> (ไม่ใช่ 115° ของวงใน)`),
     T('ลองลากและหมุนไม้โพรแทรกเตอร์', 'ลองลากและหมุนไม้โพรแทรกเตอร์', el => el.append(simA4Measure())),
     learnStep('เรื่องใหม่: <b>หาขนาดมุมโดยไม่ใช้ไม้โพรแทรกเตอร์</b>', 'เรื่องใหม่ หาขนาดมุมโดยไม่ใช้ไม้โพรแทรกเตอร์', [
       { fig: a4SVG({ vb: [320, 180], pts: { จ: a4P([160, 150], 130, 180), ข: [160, 150], ค: a4P([160, 150], 130, 0), ก: a4P([160, 150], 120, 115) }, lines: [{ a: 'จ', b: 'ค', k: 'line', ext: 10 }, { a: 'ข', b: 'ก', k: 'ray', ext: 10 }], arcs: [{ v: 'ข', a: 'ค', b: 'ก', lab: '115°', r: 30 }, { v: 'ข', a: 'ก', b: 'จ', lab: '?', r: 24, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }], lab: { ข: 270 } }), name: 'บนเส้นตรง', text: 'มุมที่อยู่บนเส้นตรงรวมกันได้ 180° → 180° − 115° = 65°' },
       { fig: a4SVG({ vb: [320, 180], pts: { R: a4P([140, 160], 130, 90), O: [140, 160], V: a4P([140, 160], 130, 0), Q: a4P([140, 160], 130, 35) }, lines: ['R', 'V', 'Q'].map(z => ({ a: 'O', b: z, k: 'ray', ext: 8 })), arcs: [{ v: 'O', a: 'V', b: 'Q', lab: '35°', r: 46 }, { v: 'O', a: 'Q', b: 'R', lab: '?', r: 36, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }], lab: { O: 225 } }), name: 'ในมุมฉาก', text: 'มุมฉาก 90° → 90° − 35° = 55°' }], 'ใช้ 90° และ 180° ที่รู้อยู่แล้ว'),
     pexStep('ตัวอย่างทีละขั้น: หาขนาดมุมบนเส้นตรง', 'ตัวอย่างทีละขั้น หาขนาดมุมบนเส้นตรง', [
       ['① ดูว่าเป็นเส้นตรง', 'มุมตรง = 180°', a4SVG({ vb: [320, 180], pts: { S: a4P([160, 150], 130, 180), T: [160, 150], U: a4P([160, 150], 130, 0), W: a4P([160, 150], 120, 48) }, lines: [{ a: 'S', b: 'U', k: 'line', ext: 10 }, { a: 'T', b: 'W', k: 'ray', ext: 10 }], arcs: [{ v: 'T', a: 'U', b: 'S', r: 20, col: '#E6A21E', fill: 'rgba(230,162,30,.1)' }], lab: { T: 270 } })],
       ['② ลบมุมที่รู้', '180° − 48° = 132°', a4SVG({ vb: [320, 180], pts: { S: a4P([160, 150], 130, 180), T: [160, 150], U: a4P([160, 150], 130, 0), W: a4P([160, 150], 120, 48) }, lines: [{ a: 'S', b: 'U', k: 'line', ext: 10 }, { a: 'T', b: 'W', k: 'ray', ext: 10 }], arcs: [{ v: 'T', a: 'U', b: 'W', lab: '48°', r: 34 }, { v: 'T', a: 'W', b: 'S', lab: '132°', r: 26, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)' }], lab: { T: 270 } })]], `${a4m('WTS')} = <b>132°</b>`)],
    () => { const rx = pkF(range(3, 15), 3), lx = pkF(range(7, 31), 3), ra = shuffle([a4acute(), a4acute(), a4obt(), a4obt()]); // v107 (ผู้ใช้ขอ): ~12 ข้อ · หามุมบนเส้นตรงและในมุมฉากมากขึ้น
      return [...ra.map((a, i) => ({ ...Q.a4Read({ nm: a4ang3(), d1: pick([0, 10, 20, 15]), a, inner: i % 2 === 1 }), __diff: 10 + i })), { ...Q.a4ClsDeg({ nm: a4ang3(), a: pick([a4acute, a4obt, () => 90, () => 180])() }), __diff: 15 },
        ...rx.map(x => Q.a4Calc({ type: 'right', x: x * 5, L: a4Letters(4).join('') })), ...lx.map(x => Q.a4Calc({ type: 'line', x: x * 5, L: a4Letters(4).join('') })),
        (() => { const x = rnd(5, 12) * 5, y = rnd(5, 12) * 5; return Q.a4Calc({ type: 'line3', x, y, L: a4Letters(5).join('') }); })()]; }),
  L4A(7, 'ถ้ำมุมกลับ', 'การวัดขนาดของมุมกลับ', 'วัดมุมกลับ', 'หาขนาดของมุมกลับจากมุมที่วัดได้ (360° − มุมที่วัดได้)',
    [...learnStep('<b>วัดมุมกลับ</b>', 'วัดมุมกลับ', [
      { fig: a4SVG({ vb: [320, 220], pts: { A: a4P([160, 110], 120, 0), B: [160, 110], C: a4P([160, 110], 100, 250) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 8 }, { a: 'B', b: 'C', k: 'ray', ext: 8 }], arcs: [{ v: 'B', a: 'A', b: 'C', reflex: true, r: 24 }, { v: 'B', a: 'A', b: 'C', r: 42, col: '#3C8DDB', fill: 'rgba(60,141,219,.12)', lab: '110°' }], lab: { B: 90 } }), name: 'รวมกันได้ 1 รอบ', text: 'มุมกลับกับมุมที่อยู่อีกด้านรวมกันได้ 360°' },
      { fig: p4big('มุมกลับ = 360° − 110° = 250°'), name: 'คิดจากมุมที่วัดได้', text: 'วัดมุมด้านที่เล็กกว่าด้วยไม้โพรแทรกเตอร์ แล้วนำไปลบออกจาก 360°' }], 'มุมกลับ = 360° − มุมที่วัดได้'),
     pexStep('ตัวอย่างทีละขั้น: วัดมุมกลับ ' + a4Ang('PQR'), 'ตัวอย่างทีละขั้น วัดมุมกลับ', [
       ['① วัดมุมด้านล่าง', 'ได้ 140°', a4SVG({ vb: [380, 250], pts: { P: a4P([190, 110], 140, 0), Q: [190, 110], R: a4P([190, 110], 120, 220) }, lines: [{ a: 'Q', b: 'P', k: 'ray', ext: 8 }, { a: 'Q', b: 'R', k: 'ray', ext: 8 }], prot: { c: [190, 110], rot: 0, flip: true, R: 100, mark: 140 }, lab: { Q: 90 } })],
       ['② ลบออกจาก 360°', '360° − 140° = 220°', a4SVG({ vb: [380, 250], pts: { P: a4P([190, 110], 140, 0), Q: [190, 110], R: a4P([190, 110], 120, 220) }, lines: [{ a: 'Q', b: 'P', k: 'ray', ext: 8 }, { a: 'Q', b: 'R', k: 'ray', ext: 8 }], arcs: [{ v: 'Q', a: 'P', b: 'R', reflex: true, r: 26, lab: '220°' }], lab: { Q: 300 } })]], `มุมกลับ ${a4Ang('PQR')} = <b>220°</b>`),
     T('ลองหมุนแขนของมุมกลับ', 'ลองหมุนแขนของมุมกลับ', el => el.append(simA4Reflex()))],
    () => [...a4N(2, () => Q.a4ReadR({ nm: a4ang3(), a: a4refl() })), Q.a4ClsDeg({ nm: a4ang3(), a: pick([a4refl, a4obt])() }), Q.a4Calc({ type: 'full', x: rnd(14, 26) * 5, y: rnd(12, 24) * 5, L: a4Letters(4).join('') }), Q.a4Cls({ nm: a4ang3(), d1: 0, a: pick([a4refl, a4obt, () => 180])() })]),
  L4A(8, 'ลานสร้างมุม', 'การสร้างมุม โดยใช้โพรแทรกเตอร์', 'สร้างมุม', 'สร้างมุมตามขนาดที่กำหนดโดยใช้ไม้โพรแทรกเตอร์ รวมถึงมุมกลับ',
    [...learnStep('<b>สร้างมุมด้วยไม้โพรแทรกเตอร์</b>', 'สร้างมุมด้วยไม้โพรแทรกเตอร์', [
      { fig: a4SVG({ vb: [340, 200], pts: { A: a4P([170, 170], 150, 0), B: [170, 170] }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 8 }], lab: { B: 270 } }), name: '① ลากแขน 1 แขน', text: 'กำหนดจุดยอดมุม B และลาก BA' },
      { fig: a4SVG({ vb: [340, 200], pts: { A: a4P([170, 170], 150, 0), B: [170, 170] }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 8 }], prot: { c: [170, 170], rot: 0, mark: 40 }, lab: { B: 270 } }), name: '② วางไม้ แล้วทำเครื่องหมาย', text: 'นับจาก 0 บนแขน BA ทำเครื่องหมายที่ 40' },
      { fig: a4SVG({ vb: [340, 200], pts: { A: a4P([170, 170], 150, 0), B: [170, 170], C: a4P([170, 170], 150, 40) }, lines: [{ a: 'B', b: 'A', k: 'ray', ext: 8 }, { a: 'B', b: 'C', k: 'ray', ext: 8 }], arcs: [{ v: 'B', a: 'A', b: 'C', lab: '40°' }], lab: { B: 270 } }), name: '③ ลากแขนอีกแขน', text: `ได้ ${a4m('ABC')} = 40°` }], 'แขน → วางไม้ → ทำเครื่องหมาย → ลากแขน'),
     pexStep('ตัวอย่างทีละขั้น: สร้างมุมกลับ 300°', 'ตัวอย่างทีละขั้น สร้างมุมกลับ', [
       ['① คิด 360° − 300°', '= 60° สร้างด้านล่าง', a4SVG({ vb: [380, 250], pts: { X: a4P([190, 105], 150, 0), Y: [190, 105] }, lines: [{ a: 'Y', b: 'X', k: 'ray', ext: 8 }], prot: { c: [190, 105], rot: 0, flip: true, R: 100, mark: 60 }, lab: { Y: 90 } })],
       ['② ลากแขนผ่านเครื่องหมาย', 'มุมด้านบนคือมุมกลับ 300°', a4SVG({ vb: [380, 250], pts: { X: a4P([190, 105], 150, 0), Y: [190, 105], Z: a4P([190, 105], 130, 300) }, lines: [{ a: 'Y', b: 'X', k: 'ray', ext: 8 }, { a: 'Y', b: 'Z', k: 'ray', ext: 8 }], arcs: [{ v: 'Y', a: 'X', b: 'Z', reflex: true, lab: '300°', r: 26 }], lab: { Y: 150 } })]], `ได้มุมกลับ ${a4Ang('XYZ')} = <b>300°</b>`),
     T('ลองสร้างมุม 125°', 'ลองสร้างมุม', el => el.append(qSim(Q.a4Build({ nm: 'DEF', deg: 125 }), 'ถูกต้อง!')))],
    () => [...a4N(2, () => { const deg = pick([a4acute, a4obt, () => rnd(5, 17) * 5 + 3])(); return { ...Q.a4Build({ nm: a4ang3(), deg, left: Math.random() < .4 }), __sig: 'a4b ' + deg, __dup: 'a4b ' + deg }; }), Q.a4Build({ nm: a4ang3(), deg: a4refl() }), /* v153: ขนาดมุมไม่ซ้ำกันในเกมเดียว */ a4SeqQ(pick([0, 1])), (() => { const x = rnd(3, 12) * 5, y = rnd(4, 18) * 5; return Q.a4Calc({ type: 'part', x, y, L: a4Letters(4).join('') }); })()])
];
/* games of lessons 3–5 (need helpers defined after the list) */
Q.a4DrawAngle = () => { const P = a4ptsRand(4), L = Object.keys(P), nm = shuffle(L).slice(0, 3).join(''); return Q.a4Draw({ k: 'angle', name: nm, pts: P }); };
LESSONS_P4C8[5].gameN = 12; // ด่าน 6 หอวัดมุม ~12 ข้อ (ผู้ใช้ขอ)
LESSONS_P4C8[2].game = () => [...['name', 'vertex', 'arms'].map(mode => Q.a4Name({ nm: a4ang3(), d1: pick([0, 10, 20, 30]), a: rnd(8, 30) * 5, mode })), Q.a4DrawAngle(), Q.a4Count({ n: rnd(3, 5), d0: rnd(0, 3) * 5, span: rnd(28, 34) * 5, L: a4Letters(6, false) })];
const a4tapSet = kind => { const pools = [a4acute, () => 90, a4obt, () => 180, a4refl], others = [0, 1, 2, 3, 4].filter(i => i !== kind && !(kind === 1 && i === 3) && !(kind === 3 && i === 1)), A = [pools[kind](), ...pkF(others, 2).map(i => pools[i]())]; return shuffle(A); };
LESSONS_P4C8[3].game = () => [...a4N(3, () => Q.a4Cmp90({ nm: a4ang3(), d1: pick([0, 10, 20]), a: pick([a4acute, a4obt, () => 90, () => 180])() })), (() => { const k = pick([1, 3]); return Q.a4Tap({ kind: k, A: shuffle([k === 1 ? 90 : 180, a4acute(), a4obt()]) }); })(), Q.a4Cls({ nm: a4ang3(), d1: pick([0, 15, 30]), a: pick([90, 180]), show: [1, 3, 0] })];
LESSONS_P4C8[4].game = () => [...a4N(2, () => { const a = pick([a4acute, a4obt, a4refl])(); return Q.a4Cls({ nm: a4ang3(), d1: a4d1(a), a }); }), a4SortQ(), (() => { const k = pick([0, 2, 4]); return Q.a4Tap({ kind: k, A: a4tapSet(k) }); })(), Q.a4Cls({ nm: a4ang3(), d1: 0, a: a4refl() })];

/* ---------- boss ---------- */
const a4X = (q, opts, lv, fig) => ({ q, fig, opts, a: 0, lv });
const EXAM_P4C8 = d6spread([
  a4X('ข้อใดมีผิว<b>ไม่เป็น</b>ระนาบ', ['ผิวลูกแก้ว', 'หน้าโต๊ะ', 'หน้ากระดาษ', 'พื้นห้อง'], 1461),
  a4X('จุดใดอยู่ห่างจากจุด D ไปทางขวา 3 ช่อง และขึ้นไป 2 ช่อง', ['จุด F', 'จุด E', 'จุด G'], 1461, a4SVG({ vb: [300, 210], grid: { x0: 30, y0: 24, n: 7, m: 5, g: 34 }, pts: { D: [64, 160], E: [200, 92], F: [166, 92], G: [166, 160] }, lab: { D: 45, E: 45, F: 45, G: 45 } })),
  a4X('รูปนี้คือข้อใด', ['รังสี ML', 'รังสี LM', 'เส้นตรง LM', 'ส่วนของเส้นตรง LM'], 1462, a4SVG({ vb: [320, 150], pts: { L: [240, 60], M: [90, 100] }, lines: [{ a: 'M', b: 'L', k: 'ray', ext: 40 }] })),
  a4X('ข้อใด<b>วัดความยาวได้</b>', ['ส่วนของเส้นตรง', 'เส้นตรง', 'รังสี'], 1462),
  a4X('เส้นตรง RS ตัดเส้นตรง TU ที่จุดใด', ['จุด X', 'จุด R', 'จุด U', 'จุด W'], 1462, a4SVG({ vb: [320, 200], pts: { R: [40, 60], S: [290, 160], T: [60, 170], U: [280, 40], X: a4cross([40, 60], [290, 160], [60, 170], [280, 40]), W: [250, 112] }, lines: [{ a: 'R', b: 'S', k: 'line', ext: 14 }, { a: 'T', b: 'U', k: 'line', ext: 14 }], lab: { X: 90 } })),
  a4X('มุมนี้มีชื่อว่าอะไร', ['มุม ทนร', 'มุม นทร', 'มุม ทรน', 'มุม รทน'], 1463, a4AngFig('ทนร', 15, 70, { k: 'ray' })),
  a4X('จากรูป มีมุมที่มีจุด O เป็นจุดยอดกี่มุม (ไม่นับมุมกลับ)', ['6 มุม', '3 มุม', '4 มุม', '5 มุม'], 1463, a4SVG({ vb: [320, 200], pts: { O: [160, 175], A: a4P([160, 175], 130, 15), B: a4P([160, 175], 130, 60), C: a4P([160, 175], 130, 115), D: a4P([160, 175], 130, 165) }, lines: ['A', 'B', 'C', 'D'].map(z => ({ a: 'O', b: z, k: 'ray', ext: 8 })), lab: { O: 270 } })),
  a4X('แขนของมุม XYZ คือข้อใด', ['YX และ YZ', 'XY และ XZ', 'XZ และ ZY'], 1463),
  a4X('มุมนี้เป็นมุมชนิดใด', ['มุมตรง', 'มุมฉาก', 'มุมป้าน', 'มุมกลับ'], 1464, a4AngFig('ABC', 10, 180, { k: 'ray' })),
  a4X('มุมฉากมีขนาดกี่องศา', ['90°', '180°', '45°', '100°'], 1464),
  a4X('มุมนี้เป็นมุมชนิดใด', ['มุมป้าน', 'มุมแหลม', 'มุมฉาก', 'มุมกลับ'], 1465, a4AngFig('DEF', 0, 125, { k: 'ray' })),
  a4X('m(PQR) = 205° เป็นมุมชนิดใด', ['มุมกลับ', 'มุมป้าน', 'มุมตรง', 'มุมแหลม'], 1465),
  a4X('ข้อใดเป็นมุมแหลม', ['70°', '90°', '110°', '190°'], 1465),
  a4X('m(KLM) มีขนาดกี่องศา', ['50°', '130°', '40°', '140°'], 1466, a4SVG({ vb: [380, 230], pts: { K: a4P([190, 170], 150, 180), L: [190, 170], M: a4P([190, 170], 150, 130) }, lines: [{ a: 'L', b: 'K', k: 'ray', ext: 10 }, { a: 'L', b: 'M', k: 'ray', ext: 10 }], prot: { c: [190, 170], rot: 0 }, lab: { L: 270 } })),
  a4X('AOC เป็นเส้นตรง m(AOB) = 125° · m(BOC) เท่ากับเท่าใด', ['55°', '65°', '125°', '235°'], 1466),
  a4X('มุม ABC เป็นมุมฉาก m(ABD) = 28° · m(DBC) เท่ากับเท่าใด', ['62°', '72°', '28°', '152°'], 1466),
  a4X('วัดมุมด้านที่เล็กกว่าได้ 75° มุมกลับมีขนาดเท่าใด', ['285°', '105°', '255°', '275°'], 1467),
  a4X('มุมกลับ XYZ มีขนาดเท่าใด', ['230°', '130°', '50°', '310°'], 1467, a4SVG({ vb: [380, 250], pts: { X: a4P([190, 110], 140, 0), Y: [190, 110], Z: a4P([190, 110], 120, 230) }, lines: [{ a: 'Y', b: 'X', k: 'ray', ext: 8 }, { a: 'Y', b: 'Z', k: 'ray', ext: 8 }], arcs: [{ v: 'Y', a: 'X', b: 'Z', reflex: true, r: 24, lab: '?' }], prot: { c: [190, 110], rot: 0, flip: true, R: 100 }, lab: { Y: 90 } })),
  a4X('สร้างมุม 35° โดยแขนแรกอยู่ทางซ้าย ต้องทำเครื่องหมายที่สเกลใด', ['สเกลวงใน ที่ 35', 'สเกลวงนอก ที่ 35', 'สเกลวงใน ที่ 145'], 1468),
  a4X('สร้างมุมกลับ 320° ควรสร้างมุมกี่องศาอีกด้านหนึ่ง', ['40°', '140°', '220°', '60°'], 1468)]);
LESSONS_P4C8.push({ id: 1479, boss: true, place: 'รังแมงป่องมุม', title: 'ด่านบอส: บทที่ 8 มุม', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'คำถามท้ายบท 20 ข้อ (ระนาบ จุด · เส้นตรง รังสี · ส่วนประกอบและชื่อมุม · ชนิดของมุม · วัดและสร้างมุม) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P4C8, pass: 10, bossName: 'แมงป่องมุม', bossPal: 'lilac', emblem: '∠', bossKind: 'scorp',
  winLine: 'ชนะแมงป่องมุมแล้ว! วัดมุมเก่งมาก', loseLine: 'แมงป่องมุมยังไม่ยอมแพ้ กลับไปฝึกวัดมุมแล้วสู้ใหม่นะ!' });
