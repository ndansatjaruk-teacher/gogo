/* =========================================================
   GRADE 3 · CHAPTER 4 — รูปเรขาคณิต (แกนสมมาตร)  (ป่าดิบชื้น · ภาคเรียนที่ 1 · เมือง 59 · ด่าน 1221–1224 · บอส 1239)
   every figure lives in a 200×200 box · polygons get their centroid and axes COMPUTED (reflect every vertex) — no hand-typed answers
   NEW: syFoldHTML/syFoldEl (fold a figure along any line, animated) · syRotEl (turn a line, mirror ghost shows when it is an axis)
        dot-grid mirror drawing (Q.syDraw) · cell painting (Q.syPaint) · paper fold-and-cut (simSyCut, Q.syCut)
   ========================================================= */
let SY_ID = 0;
const syReg = (n, r, rot = -90) => Array.from({ length: n }, (_, i) => { const a = (rot + i * 360 / n) * Math.PI / 180; return [100 + r * Math.cos(a), 100 + r * Math.sin(a)]; });
const syStar = (n, R, r, rot = -90) => Array.from({ length: 2 * n }, (_, i) => { const a = (rot + i * 180 / n) * Math.PI / 180, q = i % 2 ? r : R; return [100 + q * Math.cos(a), 100 + q * Math.sin(a)]; });
const syAD = (a, b) => { const d = Math.abs(((a - b) % 180 + 180) % 180); return Math.min(d, 180 - d); };
const syRefl = ([x, y], [cx, cy], a) => { const t = a * Math.PI / 180, dx = Math.cos(t), dy = Math.sin(t), vx = x - cx, vy = y - cy, k = 2 * (vx * dx + vy * dy); return [cx + k * dx - vx, cy + k * dy - vy]; };
function syCentroid(p) { let A = 0, X = 0, Y = 0; p.forEach(([x0, y0], i) => { const [x1, y1] = p[(i + 1) % p.length], c = x0 * y1 - x1 * y0; A += c; X += (x0 + x1) * c; Y += (y0 + y1) * c; }); return [X / (3 * A), Y / (3 * A)]; }
function syAxesOf(p, c) { const hit = [];
  for (let a = 0; a < 180; a += 0.5) if (p.every(q => { const r = syRefl(q, c, a); return p.some(s => Math.hypot(s[0] - r[0], s[1] - r[1]) < 1.6); })) hit.push(a);
  const out = []; hit.forEach(a => { const g = out.find(o => syAD(o[o.length - 1], a) <= 1); g ? g.push(a) : out.push([a]); });
  return out.map(g => { const m = g.reduce((s, v) => { let d = v - g[0]; if (d > 90) d -= 180; if (d < -90) d += 180; return s + d; }, 0) / g.length + g[0]; return ((Math.round(m * 2) / 2) % 180 + 180) % 180; })
    .filter((v, i, A) => A.findIndex(w => syAD(w, v) < 1) === i).sort((x, y) => x - y); }
/* ---------- catalogue: p = polygon · d = filled path · L = letter strokes · o(P) = drawn object ---------- */
const SYF = {
  tri_eq: { n: 'สามเหลี่ยมด้านเท่า', p: syReg(3, 86) }, tri_iso: { n: 'สามเหลี่ยมหน้าจั่ว', p: [[100, 22], [148, 172], [52, 172]] }, tri_r: { n: 'สามเหลี่ยมมุมฉาก', p: [[45, 30], [45, 170], [165, 170]] },
  tri_ri: { n: 'สามเหลี่ยมมุมฉาก', p: [[40, 40], [40, 160], [160, 160]] }, tri_s: { n: 'สามเหลี่ยมด้านไม่เท่า', p: [[35, 160], [172, 150], [85, 38]] },
  sq: { n: 'สี่เหลี่ยมจัตุรัส', p: [[35, 35], [165, 35], [165, 165], [35, 165]] }, rect: { n: 'สี่เหลี่ยมผืนผ้า', p: [[25, 60], [175, 60], [175, 140], [25, 140]] },
  rhom: { n: 'สี่เหลี่ยมขนมเปียกปูน', p: [[100, 22], [158, 100], [100, 178], [42, 100]] }, para: { n: 'สี่เหลี่ยมด้านขนาน', p: [[62, 55], [182, 55], [138, 145], [18, 145]] },
  trap_i: { n: 'สี่เหลี่ยมคางหมู', p: [[25, 55], [175, 55], [135, 145], [65, 145]] }, trap_r: { n: 'สี่เหลี่ยมคางหมู', p: [[35, 50], [120, 50], [172, 150], [35, 150]] },
  kite: { n: 'รูปว่าว', p: [[100, 18], [148, 75], [100, 182], [52, 75]] }, pent: { n: 'ห้าเหลี่ยมด้านเท่า', p: syReg(5, 84) }, hex: { n: 'หกเหลี่ยมด้านเท่า', p: syReg(6, 84, 0) },
  oct: { n: 'แปดเหลี่ยมด้านเท่า', p: syReg(8, 84, 22.5) }, hexl: { n: 'หกเหลี่ยม', p: [[18, 100], [58, 55], [142, 55], [182, 100], [142, 145], [58, 145]] },
  tag: { n: 'ห้าเหลี่ยมรูปป้าย', p: [[28, 55], [130, 55], [176, 100], [130, 145], [28, 145]] },
  arr2: { n: 'ลูกศรสองหัว', p: [[10, 100], [52, 55], [52, 80], [148, 80], [148, 55], [190, 100], [148, 145], [148, 120], [52, 120], [52, 145]] },
  arrow: { n: 'ลูกศร', p: [[18, 78], [108, 78], [108, 42], [182, 100], [108, 158], [108, 122], [18, 122]] },
  chev: { n: 'รูปบั้ง', p: [[20, 50], [130, 50], [180, 100], [130, 150], [20, 150], [70, 100]] }, bow: { n: 'รูปริบบิ้น', p: [[22, 50], [178, 50], [150, 100], [178, 150], [22, 150], [50, 100]] },
  plus: { n: 'รูปกากบาท', p: [[72, 22], [128, 22], [128, 72], [178, 72], [178, 128], [128, 128], [128, 178], [72, 178], [72, 128], [22, 128], [22, 72], [72, 72]] },
  star5: { n: 'ดาวห้าแฉก', p: syStar(5, 88, 36) }, star4: { n: 'ดาวสี่แฉก', p: syStar(4, 88, 28) }, house: { n: 'รูปบ้าน', p: [[100, 18], [172, 82], [172, 178], [28, 178], [28, 82]] },
  lsh: { n: 'รูปตัวแอล', p: [[40, 22], [92, 22], [92, 125], [168, 125], [168, 178], [40, 178]] }, flag: { n: 'ธงชายแฉก', p: [[45, 22], [155, 22], [155, 178], [100, 140], [45, 178]] },
  step: { n: 'รูปขั้นบันได', p: [[25, 175], [25, 138], [68, 138], [68, 92], [124, 92], [124, 28], [175, 28], [175, 175]] },
  bolt: { n: 'รูปสายฟ้า', p: [[112, 12], [48, 112], [95, 112], [70, 188], [152, 82], [106, 82], [138, 12]] },
  crown: { n: 'มงกุฎ', p: [[28, 162], [28, 58], [64, 104], [100, 40], [136, 104], [172, 58], [172, 162]] },
  shirt: { n: 'เสื้อยืด', p: [[72, 28], [86, 40], [114, 40], [128, 28], [178, 60], [158, 92], [140, 80], [140, 178], [60, 178], [60, 80], [42, 92], [22, 60]] },
  semi: { n: 'ครึ่งวงกลม', d: 'M18 62 H182 A82 82 0 0 1 18 62 Z', ax: [90] }, circ: { n: 'วงกลม', d: 'M100 22 A78 78 0 1 1 99.9 22 Z', ax: 'inf' },
  ell: { n: 'วงรี', d: 'M18 100 A82 52 0 1 1 182 100 A82 52 0 1 1 18 100 Z', ax: [0, 90] },
  heart: { n: 'รูปหัวใจ', d: 'M100 168 C40 122 18 88 28 60 C38 30 80 24 100 56 C120 24 162 30 172 60 C182 88 160 122 100 168 Z', ax: [90] },
  moon: { n: 'รูปเสี้ยวจันทร์', d: 'M125 28 A72 72 0 1 0 125 172 A100 100 0 0 1 125 28 Z', ax: [0] },
  drop: { n: 'รูปหยดน้ำ', d: 'M100 20 C100 20 48 96 48 126 A52 52 0 0 0 152 126 C152 96 100 20 100 20 Z', ax: [90] },
  bfly: { n: 'ผีเสื้อ', ax: [90], o: P => { const w = `<path d="M100 96 C75 38 22 34 26 78 C29 106 70 110 100 102 Z M100 108 C70 112 40 136 54 160 C68 178 93 146 100 114 Z" fill="${P[1]}" stroke="${P[3]}" stroke-width="3"/><circle cx="62" cy="76" r="9" fill="${P[0]}"/>`;
    return `${w}<g transform="matrix(-1 0 0 1 200 0)">${w}</g><ellipse cx="100" cy="104" rx="7" ry="44" fill="#4A4560"/><path d="M97 64 Q88 40 76 34 M103 64 Q112 40 124 34" fill="none" stroke="#4A4560" stroke-width="3" stroke-linecap="round"/>`; } },
  tree: { n: 'ต้นสน', ax: [90], o: P => `<rect x="88" y="146" width="24" height="36" rx="3" fill="#A8774A"/>` + [[18, 82, 52], [44, 122, 62], [78, 158, 74]].map(([t, b, w]) => `<polygon points="100,${t} ${100 + w},${b} ${100 - w},${b}" fill="${P[1]}" stroke="${P[3]}" stroke-width="3" stroke-linejoin="round"/>`).join('') },
  fish: { n: 'ปลา', ax: [0], o: P => `<polygon points="48,100 12,64 12,136" fill="${P[2]}" stroke="${P[3]}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="106" cy="100" rx="66" ry="40" fill="${P[1]}" stroke="${P[3]}" stroke-width="3"/><circle cx="146" cy="100" r="9" fill="#fff"/><circle cx="149" cy="100" r="4.5" fill="#4A4560"/>` },
  umb: { n: 'ร่ม', ax: [90], o: P => `<path d="M100 100 V172" stroke="#4A4560" stroke-width="6" stroke-linecap="round"/><path d="M20 100 A80 80 0 0 1 180 100 Q160 86 140 100 Q120 86 100 100 Q80 86 60 100 Q40 86 20 100 Z" fill="${P[1]}" stroke="${P[3]}" stroke-width="3" stroke-linejoin="round"/><path d="M100 22 V100" stroke="${P[3]}" stroke-width="2"/>` },
  sun: { n: 'ดวงอาทิตย์', ax: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5], o: P => Array.from({ length: 8 }, (_, i) => `<polygon points="100,10 112,40 88,40" fill="${P[2]}" transform="rotate(${i * 45} 100 100)"/>`).join('') + `<circle cx="100" cy="100" r="54" fill="${P[1]}" stroke="${P[3]}" stroke-width="3"/>` },
  duck: { n: 'ลูกเป็ด', ax: [], o: P => `<ellipse cx="92" cy="128" rx="62" ry="40" fill="${P[1]}" stroke="${P[3]}" stroke-width="3"/><circle cx="138" cy="72" r="30" fill="${P[1]}" stroke="${P[3]}" stroke-width="3"/><polygon points="164,66 194,76 164,86" fill="#F2AE2E"/><circle cx="146" cy="66" r="4.5" fill="#4A4560"/><path d="M60 122 Q86 140 108 118" fill="none" stroke="${P[3]}" stroke-width="3"/>` },
  cup: { n: 'แก้วมีหูจับ', ax: [], o: P => `<path d="M150 70 C188 70 188 130 150 130" fill="none" stroke="${P[3]}" stroke-width="10"/><path d="M42 50 H158 L148 172 H52 Z" fill="${P[1]}" stroke="${P[3]}" stroke-width="3" stroke-linejoin="round"/><path d="M42 50 H158" stroke="${P[3]}" stroke-width="6"/>` },
  shoe: { n: 'รองเท้า', ax: [], o: P => `<path d="M24 150 V92 Q26 74 48 82 L84 96 Q112 112 150 114 Q182 120 180 150 Z" fill="${P[1]}" stroke="${P[3]}" stroke-width="3" stroke-linejoin="round"/><path d="M24 158 H180" stroke="#4A4560" stroke-width="10" stroke-linecap="round"/>` },
  pflag: { n: 'ธงบนเสา', ax: [], o: P => `<rect x="44" y="18" width="10" height="164" rx="4" fill="#A8774A"/><polygon points="54,24 166,56 54,92" fill="${P[1]}" stroke="${P[3]}" stroke-width="3" stroke-linejoin="round"/>` }
};
/* letters: stroke paths (axes given — every letter is drawn to match them) */
const SYL = { A: ['M50 172 L100 28 L150 172 M70 118 H130', [90]], H: ['M55 28 V172 M145 28 V172 M55 100 H145', [0, 90]], T: ['M42 34 H158 M100 34 V172', [90]], M: ['M44 172 V28 L100 112 L156 28 V172', [90]],
  X: ['M50 28 L150 172 M150 28 L50 172', [0, 90]], E: ['M148 30 H60 V170 H148 M60 100 H132', [0]], U: ['M55 28 V114 A45 45 0 0 0 145 114 V28', [90]], V: ['M48 28 L100 172 L152 28', [90]],
  Y: ['M48 28 L100 100 L152 28 M100 100 V172', [90]], I: ['M66 30 H134 M100 30 V170 M66 170 H134', [0, 90]], O: ['M100 28 A56 72 0 1 1 100 172 A56 72 0 1 1 100 28', [0, 90]], C: ['M150 52 A62 70 0 1 0 150 148', [0]],
  D: ['M58 30 V170 H88 A70 70 0 0 0 88 30 Z', [0]], K: ['M60 28 V172 M146 28 L60 100 L146 172', [0]], W: ['M32 30 L64 170 L100 72 L136 170 L168 30', [90]],
  F: ['M142 30 H60 V170 M60 100 H126', []], L: ['M62 28 V170 H146', []], N: ['M55 172 V28 L145 172 V28', []], S: ['M146 52 C122 18 54 24 58 64 C62 100 142 94 144 136 C146 178 74 182 52 148', []],
  Z: ['M50 30 H150 L50 170 H150', []], G: ['M150 52 A62 70 0 1 0 156 122 H112', []], J: ['M140 28 V128 A40 40 0 0 1 60 128', []], P: ['M60 172 V30 H106 A36 36 0 0 1 106 102 H60', []], R: ['M60 172 V30 H106 A36 36 0 0 1 106 102 H60 M100 102 L150 172', []] };
Object.entries(SYL).forEach(([k, [L, ax]]) => { SYF['L_' + k] = { n: `ตัว ${k}`, L, ax }; });
Object.values(SYF).forEach(F => { if (F.p) { F.c = syCentroid(F.p); F.ax = syAxesOf(F.p, F.c); } else F.c = [100, 100]; });
const syN = F => F.ax === 'inf' ? Infinity : F.ax.length, syIsAx = (F, a) => F.ax === 'inf' || F.ax.some(x => syAD(x, a) < 0.8);
/* ---------- drawing ---------- */
const syBody = (F, col) => { const P = PAL[col] || PAL.sky;
  if (F.p) return `<polygon points="${F.p.map(q => q.map(v => +v.toFixed(1)).join(',')).join(' ')}" fill="${P[1]}" stroke="${P[3]}" stroke-width="3" stroke-linejoin="round"/>`;
  if (F.d) return `<path d="${F.d}" fill="${P[1]}" stroke="${P[3]}" stroke-width="3" stroke-linejoin="round"/>`;
  if (F.L) return `<path d="${F.L}" fill="none" stroke="${P[3]}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><path d="${F.L}" fill="none" stroke="${P[1]}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`;
  return F.o(P); };
const syLine = ([cx, cy], a, cls = 'sy-ax', R = 135) => { const t = a * Math.PI / 180, dx = Math.cos(t) * R, dy = Math.sin(t) * R; return `<line class="${cls}" x1="${(cx - dx).toFixed(1)}" y1="${(cy - dy).toFixed(1)}" x2="${(cx + dx).toFixed(1)}" y2="${(cy + dy).toFixed(1)}"/>`; };
const syRT = ([cx, cy], a) => `translate(${cx} ${cy}) rotate(${a}) scale(1 -1) rotate(${-a}) translate(${-cx} ${-cy})`;
function syFigSVG(F, o = {}) { const col = o.col || mixCol(), lines = (o.lines || []).map(l => syLine(F.c, l.a, l.cls || 'sy-ax')).join('');
  return `<svg viewBox="-12 -12 224 224" class="${o.cls || 'sy-svg'}" aria-hidden="true">${syBody(F, col)}${lines}${o.extra || ''}</svg>`; }
const syMini = (F, o = {}) => syFigSVG(F, { ...o, cls: 'sy-mini' });
const syAllAx = F => (F.ax === 'inf' ? [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5] : F.ax).map(a => ({ a, cls: 'sy-ax ok' }));
/* fold along the line at angle a: s = 1 open · 0 half · −1 folded over */
function syFoldHTML(F, a, s = 1, o = {}) { const id = 'syf' + (++SY_ID), [cx, cy] = F.c, body = syBody(F, o.col || mixCol()), half = y => `<rect x="-400" y="${y}" width="800" height="400" transform="translate(${cx} ${cy}) rotate(${a})"/>`;
  return `<svg viewBox="-12 -12 224 224" class="${o.cls || 'sy-svg'}" aria-hidden="true"><defs><clipPath id="${id}a" clipPathUnits="userSpaceOnUse">${half(-400)}</clipPath><clipPath id="${id}b" clipPathUnits="userSpaceOnUse">${half(0)}</clipPath></defs>
    <g clip-path="url(#${id}a)">${body}</g><g class="mv" style="opacity:${s < 0 ? .72 : 1}" transform="translate(${cx} ${cy}) rotate(${a}) scale(1 ${s}) rotate(${-a}) translate(${-cx} ${-cy})"><g clip-path="url(#${id}b)">${body}</g></g>${o.noLine ? '' : syLine(F.c, a)}</svg>`; }
function syFoldEl(F, a, o = {}) { const el = h('div', { class: 'sy-fold', html: syFoldHTML(F, a, 1, o) }), mv = el.querySelector('.mv'), [cx, cy] = F.c; let s = 1, raf = 0;
  const set = v => { s = v; mv.setAttribute('transform', `translate(${cx} ${cy}) rotate(${a}) scale(1 ${v.toFixed(3)}) rotate(${-a}) translate(${-cx} ${-cy})`); mv.style.opacity = v < 0 ? .72 : 1; };
  el.fold = (to, cb, ms = 1000) => { cancelAnimationFrame(raf); const s0 = s, t0 = performance.now(); if (matchMedia('(prefers-reduced-motion: reduce)').matches) ms = 1;
    const st = t => { const k = Math.min(1, (t - t0) / ms), e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; set(s0 + (to - s0) * e); if (k < 1) raf = requestAnimationFrame(st); else cb && cb(); }; raf = requestAnimationFrame(st); };
  el.state = () => s; return el; }
/* a line you turn around the centre; the mirror image (dashed) lands on the figure only when the line is an axis */
function syRotEl(F, o = {}) { const [cx, cy] = F.c, body = syBody(F, o.col || mixCol()), R = 104;
  const el = h('div', { class: 'sy-rotw', html: `<svg viewBox="-20 -20 240 240" class="sy-svg sy-rot" aria-hidden="true">${body}<g class="gh"><g class="sy-ghost">${body}</g></g><g class="fd"></g><line class="sy-cur"/><circle class="sy-hd" r="13"/></svg>` });
  const svg = el.firstChild, gh = svg.querySelector('.gh'), cur = svg.querySelector('.sy-cur'), hd = svg.querySelector('.sy-hd'), fd = svg.querySelector('.fd'), found = [];
  let a = o.a0 ?? 25, drag = false;
  const draw = () => { const t = a * Math.PI / 180, dx = Math.cos(t), dy = Math.sin(t), on = syIsAx(F, a);
    cur.setAttribute('x1', cx - dx * 132); cur.setAttribute('y1', cy - dy * 132); cur.setAttribute('x2', cx + dx * 132); cur.setAttribute('y2', cy + dy * 132);
    hd.setAttribute('cx', cx + dx * R); hd.setAttribute('cy', cy + dy * R); gh.setAttribute('transform', syRT(F.c, a)); svg.classList.toggle('on', on);
    if (on && !found.some(f => syAD(f, a) < (F.ax === 'inf' ? 12 : 1))) { found.push(a); fd.insertAdjacentHTML('beforeend', syLine(F.c, a, 'sy-ax ok')); sfx.pop(Math.min(8, found.length + 2)); o.onFound && o.onFound(found.length, a); }
    o.onMove && o.onMove(a, on); };
  const setA = v => { v = ((v % 180) + 180) % 180; const snap = F.ax === 'inf' ? null : F.ax.find(x => syAD(x, v) < 6); a = snap != null ? snap : Math.round(v); draw(); };
  const ang = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse()); return Math.atan2(q.y - cy, q.x - cx) * 180 / Math.PI; };
  svg.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); drag = true; try { svg.setPointerCapture(e.pointerId); } catch (_) {} setA(ang(e)); });
  svg.addEventListener('pointermove', e => { if (drag) setA(ang(e)); });
  ['pointerup', 'pointercancel'].forEach(k => svg.addEventListener(k, () => { drag = false; }));
  svg.addEventListener('click', e => e.stopPropagation());
  el.turn = d => setA(a + d); el.found = () => found.length; setTimeout(draw, 0); return el; }
/* candidate lines for "tap every axis" */
const syCand = F => { const ax = F.ax, ds = shuffle([0, 30, 45, 60, 90, 120, 135, 150, 15, 75, 105, 165]).filter(d => ax.every(x => syAD(x, d) > 11));
  const out = [...ax]; ds.forEach(d => { if (out.length < Math.max(4, ax.length + 2) && out.every(x => syAD(x, d) > 11)) out.push(d); }); return shuffle(out); };
/* ---------- dot grid (draw the other half) ---------- */
const SYG = 30, syGP = (x, y) => [x * SYG + 16, y * SYG + 16];
const syMir = (p, ax, a) => ax === 'v' ? [2 * a - p[0], p[1]] : [p[0], 2 * a - p[1]];
const syPoly = (pts, cls) => `<polyline class="${cls}" points="${pts.map(p => syGP(...p).join(',')).join(' ')}"/>`;
function syGridSVG(D, o = {}) { const { W, H, ax, a, p } = D, [w, hh] = syGP(W, H); let s = '';
  for (let x = 0; x <= W; x++) s += `<line class="sy-gl" x1="${syGP(x, 0)[0]}" y1="16" x2="${syGP(x, 0)[0]}" y2="${hh}"/>`;
  for (let y = 0; y <= H; y++) s += `<line class="sy-gl" x1="16" y1="${syGP(0, y)[1]}" x2="${w}" y2="${syGP(0, y)[1]}"/>`;
  s += ax === 'v' ? `<line class="sy-ax" x1="${syGP(a, 0)[0]}" y1="4" x2="${syGP(a, 0)[0]}" y2="${hh + 12}"/>` : `<line class="sy-ax" x1="4" y1="${syGP(0, a)[1]}" x2="${w + 12}" y2="${syGP(0, a)[1]}"/>`;
  s += syPoly(p, 'sy-given'); if (o.other) s += syPoly(p.map(q => syMir(q, ax, a)), 'sy-mine');
  (o.marks || []).forEach(([q, lab, col]) => { const [x, y] = syGP(...q); s += `<circle cx="${x}" cy="${y}" r="7" fill="${col || '#E5505E'}"/>${lab ? `<text x="${x + 9}" y="${y - 8}" class="sy-gt">${lab}</text>` : ''}`; });
  (o.span || []).forEach(([q, n]) => { const [x, y] = syGP(...q), [x2, y2] = syGP(...(ax === 'v' ? [a, q[1]] : [q[0], a])); s += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#2FA36B" stroke-width="4" stroke-dasharray="3 4"/><text x="${(x + x2) / 2}" y="${(y + y2) / 2 + 24}" text-anchor="middle" class="sy-gt g">${n}</text>`; });
  return `<svg viewBox="-18 -14 ${w + 52} ${hh + 34}" class="sy-grid" aria-hidden="true">${s}${o.extra || ''}</svg>`; }
const sySamp = segs => { const S = new Set(); segs.forEach(([[x1, y1], [x2, y2]]) => { const n = Math.max(1, Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 4)); for (let k = 0; k <= n; k++) S.add(`${Math.round((x1 + (x2 - x1) * k / n) * 4)},${Math.round((y1 + (y2 - y1) * k / n) * 4)}`); }); return S; };
/* ---------- cell painting ---------- */
const SY_PC = { a: '#FF7B86', b: '#FFD45C', c: '#5FC77A', d: '#5BB8F0' }, SY_PN = { a: 'แดง', b: 'เหลือง', c: 'เขียว', d: 'ฟ้า' }, SYC = 30;
function syPaintModel(D) { const { W, H, ax, a, rows } = D, give = {}, want = {};
  rows.forEach((r, i) => [...r].forEach((ch, j) => { if (ch === '.') return; const x = ax === 'v' ? j : j, y = i; give[`${x},${y}`] = ch; const m = ax === 'v' ? [2 * a - 1 - x, y] : [x, 2 * a - 1 - y]; want[m.join(',')] = ch; }));
  return { give, want, mine: (x, y) => ax === 'v' ? x >= a : y >= a }; }
function syPaintSVG(D, o = {}) { const { W, H, ax, a } = D, M = syPaintModel(D), user = o.user || (o.full ? M.want : {}); let s = '';
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = `${x},${y}`, ch = M.give[k] || user[k]; s += `<rect class="sy-cell${M.mine(x, y) ? ' m' : ''}" data-k="${k}" x="${x * SYC + 6}" y="${y * SYC + 6}" width="${SYC}" height="${SYC}" fill="${ch ? SY_PC[ch] : '#fff'}"/>`; }
  s += ax === 'v' ? `<line class="sy-ax solid" x1="${a * SYC + 6}" y1="0" x2="${a * SYC + 6}" y2="${H * SYC + 12}"/>` : `<line class="sy-ax solid" x1="0" y1="${a * SYC + 6}" x2="${W * SYC + 12}" y2="${a * SYC + 6}"/>`;
  return `<svg viewBox="0 0 ${W * SYC + 12} ${H * SYC + 12}" class="sy-paint" aria-hidden="true">${s}${o.extra || ''}</svg>`; }
/* ---------- paper fold & cut: halves touch the fold x = 100 at both ends ---------- */
const SYH = { tree: [[100, 18], [62, 64], [80, 64], [46, 108], [72, 108], [36, 150], [88, 150], [88, 182], [100, 182]], doll: [[100, 22], [84, 27], [80, 48], [90, 60], [58, 66], [42, 112], [56, 115], [68, 86], [72, 122], [62, 178], [84, 178], [94, 132], [100, 132]],
  vase: [[100, 28], [72, 28], [78, 44], [52, 82], [58, 142], [76, 174], [100, 174]], heart: [[100, 60], [86, 38], [62, 32], [40, 52], [44, 92], [100, 168]], house: [[100, 22], [40, 80], [58, 80], [58, 176], [100, 176]],
  rocket: [[100, 16], [80, 58], [80, 128], [52, 168], [84, 152], [100, 152]], bell: [[100, 24], [84, 30], [74, 60], [70, 118], [46, 150], [92, 150], [92, 170], [100, 176]], leaf: [[100, 18], [72, 52], [58, 100], [70, 146], [94, 164], [100, 186]] };
const SYH_N = { tree: 'ต้นสน', doll: 'ตุ๊กตากระดาษ', vase: 'แจกัน', heart: 'หัวใจ', house: 'บ้าน', rocket: 'จรวด', bell: 'ระฆัง', leaf: 'ใบไม้' };
const syPts = p => p.map(q => q.map(v => +v.toFixed(1)).join(',')).join(' ');
const syFull = p => [...p, ...p.slice().reverse().map(([x, y]) => [200 - x, y])];
const syShift = p => { const m = Math.min(...p.map(q => q[0])); return p.map(([x, y]) => [x - m + 100, y]); };
const syUpside = p => p.map(([x, y]) => [200 - x, 200 - y]);
const syPieceSVG = (pieces, o = {}) => `<svg viewBox="-12 -12 224 224" class="${o.cls || 'sy-mini'}" aria-hidden="true"><g ${o.rot ? `transform="rotate(${o.rot} 100 100)"` : ''}>${pieces.map(([p, f, st]) => `<polygon points="${syPts(p)}" fill="${f}" stroke="${st || '#4A4560'}" stroke-width="3" stroke-linejoin="round"/>`).join('')}${o.axis ? '<line class="sy-ax" x1="100" y1="-8" x2="100" y2="208"/>' : ''}</g></svg>`;
const syPaperSVG = (k, o = {}) => `<svg viewBox="-12 -12 224 224" class="${o.cls || 'sy-svg'}" aria-hidden="true"><g ${o.rot ? `transform="rotate(${o.rot} 100 100)"` : ''}><rect x="26" y="6" width="74" height="188" rx="3" fill="#FFFDF5" stroke="#B9B1CF" stroke-width="2"/><line x1="100" y1="2" x2="100" y2="198" stroke="#7A5AF8" stroke-width="5"/>
  <polygon points="${syPts(SYH[k])}" fill="${o.fill || 'none'}" stroke="#E5505E" stroke-width="3" stroke-dasharray="${o.fill ? 'none' : '7 5'}"/></g><text x="${o.rot ? 100 : 150}" y="${o.rot ? 214 : 104}" text-anchor="middle" class="sy-gt">รอยพับ</text></svg>`;

/* ---------- teaching sims ---------- */
function simSyFold(list) { // fold each figure along its dashed line → does it match?
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), done = new Set(); let i = 0, fe = null;
  const show = () => { const [k, a] = list[i]; fe = syFoldEl(SYF[k], a); fig.innerHTML = ''; fig.append(fe); out.innerHTML = `${SYF[k].n} · กด <b>พับ</b> ดูว่าสองข้างทับกันสนิทไหม`; };
  const fold = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); const [k, a] = list[i], ok = syIsAx(SYF[k], a); sfx.tap();
    fe.state() < 0 ? fe.fold(1) : fe.fold(-1, () => { out.innerHTML = ok ? `ทับกันสนิท ✓<br>เส้นประ<b>เป็นแกนสมมาตร</b>` : `ทับกันไม่สนิท มีส่วนเกินออกมา ✗<br>เส้นประ<b>ไม่เป็นแกนสมมาตร</b>`; ok ? sfx.ok() : sfx.no(); done.add(i); if (done.size >= list.length) teachDone(box); }); } }, 'พับ / คลี่');
  const next = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); i = (i + 1) % list.length; sfx.tap(); show(); } }, 'รูปถัดไป', icon('right'));
  show(); box.append(fig, h('div', { class: 'rowstack' }, fold, next), out); return box; }
function simSyRotate(keys, need = 2) { // turn the line; collect every axis
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), full = new Set(); let k = keys[0], re = null;
  const tabs = h('div', { class: 'rowstack' }, ...keys.map(kk => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); k = kk; sfx.tap(); show(); } }, SYF[kk].n)));
  const msg = (n, on) => { const F = SYF[k], tot = syN(F); out.innerHTML = `${F.n} · พบแกนสมมาตรแล้ว <b>${n}</b> แกน${on ? ' — เงาสีม่วงทับรูปพอดี!' : ''}<br>${tot === Infinity ? (n >= 4 ? 'หมุนไปทางไหนก็เป็นแกน → วงกลมมีแกนสมมาตร<b>มากมายนับไม่ถ้วน</b>' : 'ลองหมุนต่อไปเรื่อย ๆ') : n >= tot ? `ครบแล้ว! ${F.n}มีแกนสมมาตร <b>${tot}</b> แกน` : 'หมุนเส้นต่อไป หาให้ครบ'}`;
    if ((tot === Infinity && n >= 4) || n >= tot) { full.add(k); if (full.size >= need) teachDone(box); } };
  const show = () => { re = syRotEl(SYF[k], { onFound: n => msg(n, true), onMove: (a, on) => { if (!on) msg(re ? re.found() : 0, false); } }); fig.innerHTML = ''; fig.append(re); out.innerHTML = 'ลากจุดสีแดงหมุนเส้น · เงาเส้นประสีม่วง = ภาพที่พับมาทับ<br>ถ้าเงาทับรูปพอดี เส้นนั้นคือแกนสมมาตร'; };
  show(); box.append(tabs, fig, h('div', { class: 'rowstack' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); re.turn(-15); } }, '⟲ 15°'), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); re.turn(15); } }, '⟳ 15°')), out); return box; }
function simSyMirror(D) { // tap any cell: its mirror cell lights up the same distance from the axis
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), user = {}; let n = 0;
  const M = { ...D, rows: Array(D.ax === 'v' ? D.H : D.a).fill('') };
  const draw = (hl) => { fig.innerHTML = syPaintSVG(M, { user }); if (hl) hl.forEach(k => fig.querySelector(`[data-k="${k}"]`)?.classList.add('hl')); };
  fig.addEventListener('click', e => { const r = e.target.closest('.sy-cell'); if (!r) return; e.stopPropagation(); const [x, y] = r.dataset.k.split(',').map(Number), m = D.ax === 'v' ? [2 * D.a - 1 - x, y] : [x, 2 * D.a - 1 - y], k1 = `${x},${y}`, k2 = m.join(','), on = !user[k1];
    if (on) { user[k1] = user[k2] = 'c'; } else { delete user[k1]; delete user[k2]; } sfx.pop(++n % 8 + 1); draw([k1, k2]);
    const d = D.ax === 'v' ? Math.min(Math.abs(x - D.a), Math.abs(x + 1 - D.a)) : Math.min(Math.abs(y - D.a), Math.abs(y + 1 - D.a));
    out.innerHTML = `ช่องนี้ห่างเส้นแกน <b>${d}</b> ช่อง<br>ช่องคู่ของมันอีกข้างก็ห่าง <b>${d}</b> ช่อง (เหมือนส่องกระจก)`; if (n >= 5) teachDone(box); });
  out.innerHTML = 'แตะช่องใดก็ได้ ข้างใดก็ได้<br>ดูว่าช่องอีกข้างที่เปลี่ยนสีอยู่ตรงไหน'; draw(); box.append(fig, out); return box; }
function simSyCut(keys) { // fold the paper, cut along the dashed line, unfold
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set(); let k = keys[0];
  const show = () => { fig.innerHTML = syPaperSVG(k); out.innerHTML = `${SYH_N[k]}: พับกระดาษครึ่ง แล้ววาดรูปครึ่งเดียวติดรอยพับ<br>กด <b>ตัดแล้วคลี่</b>`; };
  const cut = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.tap();
    fig.innerHTML = ''; const fe = syFoldEl({ p: syFull(SYH[k]), c: [100, 100], ax: [] }, 90, { noLine: true, col: 'coral' }); fe.fold(-1, null, 1); fig.append(fe);
    setTimeout(() => fe.fold(1, () => { fe.querySelector('svg').insertAdjacentHTML('beforeend', '<line class="sy-ax" x1="100" y1="-8" x2="100" y2="208"/>'); out.innerHTML = `คลี่ออกได้<b>${SYH_N[k]}</b>ทั้งรูป<br>รอยพับกลายเป็น<b>แกนสมมาตร</b> สองข้างเหมือนกันแต่กลับด้าน`; sfx.ok(); seen.add(k); if (seen.size >= 2) teachDone(box); }, 1300), 350); } }, 'ตัดแล้วคลี่');
  const tabs = h('div', { class: 'rowstack' }, ...keys.map(kk => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); k = kk; sfx.tap(); show(); } }, SYH_N[kk])));
  show(); box.append(tabs, fig, h('div', { class: 'rowstack' }, cut), out); return box; }

/* ---------- question types ---------- */
const syHintFold = 'นึกภาพพับตามเส้นประ: ถ้าสองข้างทับกันสนิทพอดี เส้นนั้นเป็นแกนสมมาตร';
Object.assign(Q, {
  syIs({ f, a }) { const F = SYF[f], ok = syIsAx(F, a), q = 'เส้นประเป็นแกนสมมาตรหรือไม่';
    return { prompt: q + ' <small>(นึกภาพพับตามเส้นประ)</small>', say: q, __sig: `syIs ${f} ${a}`, mount(bd, ctx) { const fe = syFoldEl(F, a), c2 = Object.assign(Object.create(ctx), { check: (r, hn) => { if (r) fe.fold(-1); ctx.check(r, hn); } }); fe.classList.add('rvl'); fe.reveal = () => fe.fold(-1);
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig' }, fe), choices(c2, [{ value: 1, label: 'เป็น' }, { value: 0, label: 'ไม่เป็น' }], ok ? 1 : 0, { hint: syHintFold }))); } }; },
  syWhich({ items, not }) { const right = items.findIndex(([f, a]) => syIsAx(SYF[f], a) !== !!not), q = `รอยเส้นประในรูปใด${not ? '<b>ไม่</b>' : ''}เป็นแกนสมมาตร`;
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: 'syWhich ' + items.flat().join(' '), mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, choices(ctx, items.map(([f, a], i) => ({ value: i, label: syMini(SYF[f], { lines: [{ a }] }) })), right, { hint: syHintFold }))); } }; },
  syCount({ f }) { const F = SYF[f], n = syN(F), q = `${F.n}มีแกนสมมาตรกี่แกน`;
    return { prompt: q, say: q, __sig: 'syCount ' + f, mount(bd, ctx) { const fig = h('div', { class: 'p4-fig', html: syFigSVG(F, { col: mixCol() }) }), col = mixCol(), hint = 'นึกพับหลายแบบ: แนวตั้ง แนวนอน แนวเฉียง นับทุกเส้นที่พับแล้วทับกันสนิท';
      const c2 = Object.assign(Object.create(ctx), { check: (r, hn) => { if (r) fig.innerHTML = syFigSVG(F, { col, lines: syAllAx(F) }); ctx.check(r, hn); } });
      bd.append(h('div', { class: 't6-q p4-q p2q' }, fig, n === Infinity ? choices(c2, ['2 แกน', '4 แกน', '8 แกน', 'มากมายนับไม่ถ้วน'].map(v => ({ value: v, label: v })), 'มากมายนับไม่ถ้วน', { hint })
        : h('div', { class: 'rowstack' }, answerBox(c2, String(n), { hint }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'แกน')))); } }; },
  syFind({ f }) { const F = SYF[f], C = syCand(F), q = `แตะเลือก<b>ทุกเส้น</b>ที่เป็นแกนสมมาตรของ${F.n}`;
    return { prompt: q + (F.ax.length ? '' : ' <small>(ถ้าไม่มีเลย ไม่ต้องเลือก แล้วกดตรวจ)</small>'), say: q.replace(/<[^>]+>/g, ''), __sig: 'syFind ' + f, mount(bd, ctx) {
      const fig = h('div', { class: 'p4-fig', html: `<svg viewBox="-12 -12 224 224" class="sy-svg" aria-hidden="true">${syBody(F, mixCol())}${C.map(a => `<g class="sy-c" data-a="${a}">${syLine(F.c, a, 'vis')}${syLine(F.c, a, 'hit')}</g>`).join('')}</svg>` });
      fig.addEventListener('click', e => { const g = e.target.closest('.sy-c'); if (!g) return; e.stopPropagation(); g.classList.toggle('on'); sfx.tap(); });
      bd.append(h('div', { class: 't6-q p4-q p2q' }, fig, h('div', { class: 'colstack' }, h('div', { class: 'cap', html: 'แตะเส้นเพื่อเลือก · แตะซ้ำเพื่อเอาออก' }), checkButton('ตรวจคำตอบ', () => {
        const sel = [...fig.querySelectorAll('.sy-c.on')].map(g => +g.dataset.a), wrong = sel.filter(a => !syIsAx(F, a)), miss = F.ax.filter(x => !sel.some(a => syAD(a, x) < 1));
        if (!wrong.length && !miss.length) fig.querySelectorAll('.sy-c.on').forEach(g => g.classList.add('ok'));
        ctx.check(!wrong.length && !miss.length, wrong.length ? 'มีเส้นที่เลือกแล้วพับไม่ทับกันสนิท ลองเอาออก' : `ยังเลือกไม่ครบ ${F.n}มีแกนสมมาตรมากกว่านี้`); })))); } }; },
  syPick({ c, rot = 0 }) { const p = SYH[c], col = PAL[mixCol()], gray = '#E4E0EE', pieces = [p.map(([x, y]) => [200 - x, y]), syShift(p), syUpside(p)], q = 'รูปใดเป็นรูปอีกข้างหนึ่งของแกนสมมาตรที่ถูกต้อง';
    return { prompt: q, say: q, __sig: `syPick ${c} ${rot}`, mount(bd, ctx) { const opts = pieces.map((pc, i) => ({ value: i, label: syPieceSVG([[p, gray, '#9C95B5'], [pc, col[1], col[3]]], { axis: true, rot }) }));
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: syPieceSVG([[p, col[1], col[3]]], { axis: true, rot, cls: 'sy-svg' }) }), choices(ctx, shuffle(opts), 0, { hint: 'อีกข้างต้องเหมือนกันแต่กลับด้าน ทุกจุดห่างเส้นแกนเท่าเดิม' }))); } }; },
  syDraw(D) { const { W, H, ax, a, p } = D, want = sySamp(p.slice(1).map((q, i) => [syMir(p[i], ax, a), syMir(q, ax, a)])), q = 'วาดรูปอีกข้างหนึ่งของแกนสมมาตร';
    const giveSide = ax === 'v' ? (p.some(q2 => q2[0] < a) ? -1 : 1) : (p.some(q2 => q2[1] < a) ? -1 : 1), okPt = ([x, y]) => (ax === 'v' ? (x - a) : (y - a)) * giveSide <= 0;
    return { prompt: q + ' <small>(แตะจุดทีละจุดเพื่อลากเส้น · แตะจุดเดิมซ้ำ = ยกปากกา)</small>', say: q, __sig: 'syDraw ' + JSON.stringify(p), mount(bd, ctx) { let strokes = [], cur = null; const fig = h('div', { class: 'p4-fig sy-gw' }), msg = h('div', { class: 'cap' }, ' ');
      const draw = () => { const segs = strokes.map(s => s.length > 1 ? syPoly(s, 'sy-mine') : '').join(''), dots = []; for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) { const [px, py] = syGP(x, y); dots.push(`<circle class="sy-dot${okPt([x, y]) ? ' m' : ''}" cx="${px}" cy="${py}" r="4"/><circle class="sy-hit" data-p="${x},${y}" cx="${px}" cy="${py}" r="13"/>`); }
        const last = cur && cur[cur.length - 1], ring = last ? `<circle cx="${syGP(...last)[0]}" cy="${syGP(...last)[1]}" r="10" fill="none" stroke="#5B9BD5" stroke-width="3"/>` : '';
        const ends = [p[0], p[p.length - 1]].map(q2 => `<circle cx="${syGP(...q2)[0]}" cy="${syGP(...q2)[1]}" r="7" fill="#E5505E"/>`).join('');
        fig.innerHTML = syGridSVG(D, { extra: segs + dots.join('') + ends + ring }); };
      fig.addEventListener('click', e => { const t = e.target.closest('.sy-hit'); if (!t) return; e.stopPropagation(); const pt = t.dataset.p.split(',').map(Number);
        if (!okPt(pt)) { msg.textContent = 'วาดอีกข้างหนึ่งของเส้นแกน (ข้างที่ยังว่าง)'; sfx.no(); return; } msg.textContent = ' ';
        const last = cur && cur[cur.length - 1]; if (last && last[0] === pt[0] && last[1] === pt[1]) cur = null; else if (cur) cur.push(pt); else { cur = [pt]; strokes.push(cur); } sfx.tap(); draw(); });
      const undo = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); const s = strokes[strokes.length - 1]; if (!s) return; s.pop(); if (!s.length) { strokes.pop(); cur = null; } else cur = s; sfx.tap(); draw(); } }, icon('replay'), 'ย้อนกลับ');
      const clr = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); strokes = []; cur = null; sfx.tap(); draw(); } }, 'ล้าง');
      draw(); bd.append(h('div', { class: 't6-q p4-q p2q' }, fig, h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, undo, clr), msg, checkButton('ตรวจคำตอบ', () => {
        const segs = []; strokes.forEach(s => s.slice(1).forEach((q2, i) => segs.push([s[i], q2]))); const got = sySamp(segs), ok = got.size === want.size && [...want].every(k => got.has(k));
        if (ok) { cur = null; draw(); } ctx.check(ok, 'แต่ละจุดต้องห่างเส้นแกนเท่ากับจุดคู่ของมัน (นับช่อง) แล้วลากเชื่อมตามลำดับ'); })))); } }; },
  syPaint(D) { const M = syPaintModel(D), cols = [...new Set(Object.values(M.give))].sort(), q = 'ระบายสีอีกข้างหนึ่งของแกนสมมาตร';
    return { prompt: q + ' <small>(เลือกสี แล้วแตะช่อง · แตะซ้ำเพื่อลบ)</small>', say: q, __sig: 'syPaint ' + D.rows.join('|'), mount(bd, ctx) { const user = {}; let sel = cols[0]; const fig = h('div', { class: 'p4-fig sy-gw' });
      const pal = h('div', { class: 'rowstack sy-pal' }, ...cols.map(ch => { const b = h('button', { class: 'sy-sw ia' + (ch === sel ? ' on' : ''), style: { background: SY_PC[ch] }, 'aria-label': SY_PN[ch], onclick: e => { e.stopPropagation(); sel = ch; pal.querySelectorAll('.sy-sw').forEach(x => x.classList.toggle('on', x === b)); sfx.tap(); } }); return b; }));
      const draw = () => { fig.innerHTML = syPaintSVG(D, { user }); };
      fig.addEventListener('click', e => { const r = e.target.closest('.sy-cell.m'); if (!r) return; e.stopPropagation(); const k = r.dataset.k; if (user[k] === sel) delete user[k]; else user[k] = sel; sfx.pop(3); draw(); });
      draw(); bd.append(h('div', { class: 't6-q p4-q p2q' }, fig, h('div', { class: 'colstack' }, pal, checkButton('ตรวจคำตอบ', () => {
        const ok = Object.keys(M.want).length === Object.keys(user).length && Object.entries(M.want).every(([k, v]) => user[k] === v);
        ctx.check(ok, 'นับช่องจากเส้นแกน: ช่องที่ห่างแกน 1 ช่อง อีกข้างก็ห่าง 1 ช่อง และใช้สีเดียวกัน'); })))); } }; },
  syCut({ c, rot = 0 }) { const p = SYH[c], col = PAL[mixCol()], q = 'พับกระดาษครึ่ง แล้วตัดตามเส้นประ เมื่อคลี่ออกจะได้รูปใด';
    const opts = [[[syFull(p), col[1], col[3]]], [[p, col[1], col[3]]], [[p, col[1], col[3]], [syShift(p), col[1], col[3]]]];
    return { prompt: q, say: q, __sig: `syCut ${c} ${rot}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: syPaperSVG(c, { rot }) }),
      choices(ctx, shuffle(opts.map((o, i) => ({ value: i, label: syPieceSVG(o, { rot }) }))), 0, { hint: 'รอยพับกลายเป็นแกนสมมาตร: อีกข้างเหมือนกันแต่กลับด้าน ติดกันที่รอยพับ' }))); } }; }
});
const syGroupQ = keys => Q.ixGroup({ q: 'จัดรูปลงกล่อง <b>มีแกนสมมาตร</b> หรือ <b>ไม่มีแกนสมมาตร</b>', bins: ['มีแกนสมมาตร', 'ไม่มีแกนสมมาตร'], items: keys.map(k => ({ label: syMini(SYF[k]), bin: syN(SYF[k]) ? 0 : 1, why: `${SYF[k].n}${syN(SYF[k]) ? 'มี' : 'ไม่มี'}แกนสมมาตร` })), hint: syHintFold });
const syCntGroupQ = keys => Q.ixGroup({ q: 'จัดรูปลงกล่องตามจำนวนแกนสมมาตร', bins: ['1 แกน', '2 แกน', 'มากกว่า 2 แกน'], items: keys.map(k => { const n = syN(SYF[k]); return { label: syMini(SYF[k]), bin: n === 1 ? 0 : n === 2 ? 1 : 2, why: `${SYF[k].n}มีแกนสมมาตร ${n === Infinity ? 'มากมาย' : n + ' แกน'}` }; }), hint: 'นึกพับหลายแบบ แล้วนับเส้นที่ทับกันสนิท' });
const syLetQ = keys => Q.ixGroup({ q: 'จัดตัวอักษรลงกล่อง <b>มีแกนสมมาตร</b> หรือ <b>ไม่มีแกนสมมาตร</b>', bins: ['มีแกนสมมาตร', 'ไม่มีแกนสมมาตร'], items: keys.map(k => ({ label: syMini(SYF['L_' + k]), bin: syN(SYF['L_' + k]) ? 0 : 1, why: `ตัว ${k} ${syN(SYF['L_' + k]) ? 'มี' : 'ไม่มี'}แกนสมมาตร` })), hint: 'นึกพับตัวอักษรแนวตั้งและแนวนอน' });

/* ---------- data ---------- */
const SY_RD = 29.74; // rectangle diagonal
const SYW_IS = [['heart', 90], ['heart', 0], ['tri_iso', 90], ['tri_iso', 30], ['rect', 0], ['rect', SY_RD], ['kite', 90], ['kite', 0], ['house', 90], ['house', 0], ['bfly', 90], ['bfly', 0], ['fish', 0], ['fish', 90], ['sq', 45],
  ['para', 0], ['para', 90], ['crown', 90], ['umb', 90], ['umb', 0], ['semi', 90], ['semi', 0], ['moon', 0], ['moon', 90], ['trap_i', 90], ['tree', 90], ['arrow', 0], ['arrow', 90], ['duck', 90], ['cup', 90], ['drop', 90], ['shirt', 90], ['star5', 90], ['tri_r', 45]]; // 
const SYW_HAS = ['bfly', 'crown', 'tree', 'umb', 'sun', 'fish', 'heart', 'drop', 'shirt', 'house', 'duck', 'cup', 'shoe', 'pflag', 'para', 'tri_s', 'bolt', 'step', 'lsh', 'trap_r', 'tri_r']; // 
const SYW_CNT = ['tri_eq', 'tri_iso', 'sq', 'rect', 'rhom', 'kite', 'pent', 'hex', 'oct', 'star5', 'star4', 'plus', 'ell', 'semi', 'heart', 'hexl', 'tag', 'arr2', 'chev', 'bow', 'house', 'trap_i', 'circ', 'flag', 'tri_ri', 'para']; // 
const SYW_FIND = ['tri_eq', 'tri_iso', 'sq', 'rect', 'rhom', 'kite', 'pent', 'hex', 'star4', 'plus', 'ell', 'hexl', 'tag', 'arr2', 'chev', 'bow', 'house', 'trap_i', 'flag', 'para', 'tri_ri', 'heart'];
const SYW_DRAW = [{ W: 8, H: 8, ax: 'v', a: 4, p: [[4, 0], [1, 2], [3, 4], [1, 6], [4, 8]] }, { W: 8, H: 8, ax: 'v', a: 4, p: [[4, 1], [2, 1], [2, 3], [0, 4], [2, 5], [2, 7], [4, 7]] },
  { W: 8, H: 8, ax: 'h', a: 4, p: [[1, 4], [3, 2], [6, 1], [8, 4]] }, { W: 8, H: 8, ax: 'h', a: 4, p: [[0, 4], [2, 1], [4, 3], [6, 1], [8, 4]] }, { W: 8, H: 8, ax: 'v', a: 4, p: [[4, 0], [1, 3], [3, 3], [1, 7], [4, 8]] },
  { W: 8, H: 8, ax: 'v', a: 4, p: [[4, 0], [0, 3], [1, 3], [1, 8], [4, 8]] }, { W: 8, H: 8, ax: 'v', a: 4, p: [[4, 0], [0, 4], [2, 4], [2, 8], [4, 8]] }, { W: 8, H: 8, ax: 'h', a: 4, p: [[0, 4], [1, 1], [4, 2], [6, 0], [8, 4]] },
  { W: 8, H: 8, ax: 'v', a: 4, p: [[4, 1], [1, 1], [1, 3], [3, 4], [1, 5], [1, 7], [4, 7]] }, { W: 8, H: 8, ax: 'v', a: 4, p: [[4, 0], [3, 2], [0, 2], [2, 4], [1, 7], [4, 6]] }]; // แต่งเพิ่ม
const SYW_PAINT = [{ W: 8, H: 7, ax: 'v', a: 4, rows: ['..aa', '.abb', 'abbb', '.abb', '..aa', '...c', '...c'] }, { W: 8, H: 8, ax: 'h', a: 4, rows: ['...aa...', '..abba..', '.ab..ba.', 'cccbbccc'] },
  { W: 6, H: 7, ax: 'v', a: 3, rows: ['..a', '.aa', 'aab', '.ab', '..b', '.cc', '..c'] }, { W: 7, H: 6, ax: 'h', a: 3, rows: ['a.a.a.a', 'aaaaaaa', '.bbbbb.'] },
  { W: 8, H: 6, ax: 'v', a: 4, rows: ['d..d', 'dd.d', '.ddd', '..dd', '..aa', '...a'] }, { W: 8, H: 7, ax: 'v', a: 4, rows: ['....', '.aa.', 'abba', 'abbb', '.abb', '..ab', '...a'] },
  { W: 8, H: 6, ax: 'h', a: 3, rows: ['c..cc..c', 'cc.dd.cc', '.cdddd.c'] }, { W: 6, H: 8, ax: 'v', a: 3, rows: ['..b', '.bb', 'bbb', '..c', '.cc', 'c.c', '..c', '.dd'] }]; // แต่งเพิ่ม
const SYW_LET = Object.keys(SYL);
const SYH_K = Object.keys(SYH);

/* ---------- lessons ---------- */
const L3Y = (no, place, title, short, goal, teach, game) => ({ id: 1220 + no, no, place, title, short, tone: TONES5[(no + 2) % 6], goal, teach, game, learned: true });
const syIsPick = n => { const T = shuffle(SYW_IS.filter(([f, a]) => syIsAx(SYF[f], a))), F = shuffle(SYW_IS.filter(([f, a]) => !syIsAx(SYF[f], a))); return shuffle([...T.slice(0, Math.ceil(n / 2)), ...F.slice(0, Math.floor(n / 2))]).slice(0, n); };
const syWhichQ = not => { const T = shuffle(SYW_IS.filter(([f, a]) => syIsAx(SYF[f], a))), F = shuffle(SYW_IS.filter(([f, a]) => !syIsAx(SYF[f], a)));
  const one = (not ? F : T)[0], rest = (not ? T : F).filter(x => x[0] !== one[0]), b = rest[0], c = rest.find(x => x[0] !== b[0]); return Q.syWhich({ items: shuffle([one, b, c]), not }); };
const LESSONS_P3C4 = [
  L3Y(1, 'ป่าผีเสื้อ', 'รูปที่มีแกนสมมาตร', 'รูปที่มีแกนสมมาตร', 'บอกได้ว่าเส้นใดเป็นแกนสมมาตร และรูปใดมีหรือไม่มีแกนสมมาตร',
    [...learnStep('ยินดีต้อนรับสู่ <b>ป่าผีเสื้อ</b>! รู้จัก<b>แกนสมมาตร</b>', 'ยินดีต้อนรับสู่ป่าผีเสื้อ รู้จักแกนสมมาตร', [
      { fig: syFigSVG(SYF.bfly, { lines: [{ a: 90 }] }), name: 'พับครึ่งแล้วทับกันสนิท', text: 'ปีกผีเสื้อสองข้างเหมือนกันแต่กลับด้าน<br>เส้นประตรงกลางคือ<b>แกนสมมาตร</b>' },
      { fig: syFoldHTML(SYF.heart, 90, 0.15, { col: 'coral' }), name: 'ลองพับตามเส้น', text: 'พับตามเส้นประ · ถ้าสองข้างทับกันพอดี<br>เส้นนั้นเป็นแกนสมมาตร' },
      { fig: syFoldHTML(SYF.rect, SY_RD, -1, { col: 'sky' }), name: 'ไม่ใช่ทุกเส้นที่เป็นแกน', text: 'พับตามเส้นทแยงของสี่เหลี่ยมผืนผ้า<br>มีส่วนเกินออกมา → ไม่เป็นแกนสมมาตร' },
      { fig: syFigSVG(SYF.duck), name: 'บางรูปไม่มีแกนสมมาตร', text: 'ลูกเป็ดพับทางไหนก็ไม่ทับกันสนิท<br>จึง<b>ไม่มีแกนสมมาตร</b>' }], 'แกนสมมาตร = เส้นที่พับแล้ว สองข้างทับกันสนิทพอดี'),
     pexStep('ตัวอย่างทีละขั้น: เส้นประเป็นแกนสมมาตรไหม', 'ตัวอย่างทีละขั้น', [['① ดูเส้นประ', 'เส้นประผ่านกลางรูปบ้าน แนวตั้ง', syFoldHTML(SYF.house, 90, 1, { col: 'yellow' })], ['② พับตามเส้นประ', 'พับข้างขวาข้ามมาทางซ้าย', syFoldHTML(SYF.house, 90, 0, { col: 'yellow' })], ['③ ดูว่าทับกันไหม', 'สองข้างทับกันสนิทพอดี ไม่มีส่วนเกิน', syFoldHTML(SYF.house, 90, -1, { col: 'yellow' })]], 'เส้นประ<b>เป็นแกนสมมาตร</b>ของรูปบ้าน'),
     T('ลองพับตามเส้นประ', 'ลองพับตามเส้นประ', el => el.append(simSyFold([['tri_iso', 90], ['para', 90], ['umb', 90], ['rect', SY_RD]])))],
    () => [...syIsPick(2).map(([f, a]) => Q.syIs({ f, a })), syWhichQ(false), syWhichQ(true), syGroupQ([...shuffle(SYW_HAS.filter(k => syN(SYF[k]))).slice(0, 3), ...shuffle(SYW_HAS.filter(k => !syN(SYF[k]))).slice(0, 3)])]),
  L3Y(2, 'ป่าหลายแกน', 'รูปที่มีแกนสมมาตรหลายแกน', 'แกนสมมาตรหลายแกน', 'หาแกนสมมาตรทุกแกนของรูป และบอกจำนวนแกนสมมาตร',
    [...learnStep('รูปบางรูปมี<b>แกนสมมาตรหลายแกน</b>', 'รูปบางรูปมีแกนสมมาตรหลายแกน', [
      { fig: syFigSVG(SYF.sq, { lines: syAllAx(SYF.sq), col: 'mint' }), name: 'สี่เหลี่ยมจัตุรัส 4 แกน', text: 'แนวตั้ง แนวนอน และแนวทแยง 2 เส้น' },
      { fig: syFigSVG(SYF.tri_eq, { lines: syAllAx(SYF.tri_eq), col: 'lilac' }), name: 'สามเหลี่ยมด้านเท่า 3 แกน', text: 'จากมุมแต่ละมุมไปกลางด้านตรงข้าม' },
      { fig: syFigSVG(SYF.rect, { lines: syAllAx(SYF.rect), col: 'yellow' }), name: 'สี่เหลี่ยมผืนผ้า 2 แกน', text: 'เส้นทแยงมุมไม่ใช่แกนสมมาตร' },
      { fig: syFigSVG(SYF.circ, { lines: syAllAx(SYF.circ), col: 'sky' }), name: 'วงกลมมีมากมายนับไม่ถ้วน', text: 'เส้นใดก็ได้ที่ผ่านจุดศูนย์กลาง' }], 'นึกพับทุกแนว แล้วนับเส้นที่สองข้างทับกันสนิท'),
     pexStep('ตัวอย่างทีละขั้น: สี่เหลี่ยมผืนผ้ามีแกนสมมาตรกี่แกน', 'ตัวอย่างทีละขั้น', [['① แนวตั้ง', 'พับแล้วทับกันสนิท ✓', syFoldHTML(SYF.rect, 90, -1, { col: 'coral' })], ['② แนวนอน', 'พับแล้วทับกันสนิท ✓', syFoldHTML(SYF.rect, 0, -1, { col: 'coral' })], ['③ แนวทแยง', 'มีส่วนเกินออกมา ✗', syFoldHTML(SYF.rect, SY_RD, -1, { col: 'coral' })]], 'สี่เหลี่ยมผืนผ้ามีแกนสมมาตร <b>2 แกน</b>'),
     T('ลองหมุนเส้นหาแกนสมมาตร', 'ลองหมุนเส้นหาแกนสมมาตรให้ครบ', el => el.append(simSyRotate(['sq', 'tri_eq', 'kite', 'hexl', 'circ'])))],
    () => [...pkF(SYW_CNT, 2).map(f => Q.syCount({ f })), ...pkF(SYW_FIND, 2).map(f => Q.syFind({ f })), syCntGroupQ(pkF(SYW_CNT.filter(k => syN(SYF[k])), 6))]),
  L3Y(3, 'ป่ากระจกเงา', 'การประยุกต์ใช้รูปที่มีแกนสมมาตร (1)', 'อีกข้างของแกน (1)', 'เลือกและวาดรูปอีกข้างหนึ่งของแกนสมมาตร',
    [...learnStep('รูป<b>อีกข้างหนึ่ง</b>ของแกนสมมาตร', 'รูปอีกข้างหนึ่งของแกนสมมาตร', [
      { fig: syGridSVG(SYW_DRAW[0], { other: true }), name: 'เหมือนส่องกระจก', text: 'อีกข้างหนึ่งเหมือนกันแต่<b>กลับด้าน</b>' },
      { fig: syGridSVG(SYW_DRAW[1], { marks: [[[0, 4], 'ก'], [[8, 4], 'ก′', '#2FA36B']], span: [[[0, 4], '4 ช่อง'], [[8, 4], '4 ช่อง']] }), name: 'ห่างแกนเท่ากัน', text: 'จุดห่างแกน 4 ช่อง<br>จุดคู่ของมันอีกข้างก็ห่าง 4 ช่อง' },
      { fig: `<div class="tk-pair">${syPieceSVG([[SYH.heart, '#FFC2C6', '#C23C4B'], [SYH.heart.map(([x, y]) => [200 - x, y]), '#FF7B86', '#C23C4B']], { axis: true, cls: 'sy-mid' })}${syPieceSVG([[SYH.heart, '#FFC2C6', '#C23C4B'], [syShift(SYH.heart), '#FF7B86', '#C23C4B']], { axis: true, cls: 'sy-mid' })}</div>`, name: 'กลับด้าน ✓ · ไม่กลับด้าน ✗', text: 'ถ้าแค่เลื่อนไปโดยไม่กลับด้าน จะไม่เป็นรูปสมมาตร' }], 'นับช่องจากแกนทีละจุด แล้วลากเส้นเชื่อม'),
     pexStep('ตัวอย่างทีละขั้น: วาดอีกข้างของแกน', 'ตัวอย่างทีละขั้น', [['① จุดบนแกน', 'จุดที่อยู่บนแกนอยู่ที่เดิม', syGridSVG(SYW_DRAW[4], { marks: [[[4, 0]], [[4, 8]]] })], ['② นับช่อง', 'จุดห่างแกน 3 ช่อง → อีกข้างห่าง 3 ช่อง', syGridSVG(SYW_DRAW[4], { marks: [[[1, 3], '', '#E5505E'], [[7, 3], '', '#2FA36B'], [[1, 7], '', '#E5505E'], [[7, 7], '', '#2FA36B'], [[3, 3], '', '#E5505E'], [[5, 3], '', '#2FA36B']], span: [[[1, 3], '3'], [[7, 3], '3']] })], ['③ ลากเส้นเชื่อม', 'ต่อจุดตามลำดับเดียวกัน', syGridSVG(SYW_DRAW[4], { other: true })]], 'ได้รูปที่<b>มีแกนสมมาตร</b>'),
     T('ลองแตะช่อง ดูช่องคู่อีกข้าง', 'ลองแตะช่อง ดูช่องคู่อีกข้าง', el => el.append(simSyMirror({ W: 8, H: 6, ax: 'v', a: 4 })))],
    () => [...pkF(SYH_K, 2).map(c => Q.syPick({ c, rot: pick([0, 0, 90]) })), ...pkF(SYW_DRAW, 3).map(D => Q.syDraw(D))]),
  L3Y(4, 'ป่าพับกระดาษ', 'การประยุกต์ใช้รูปที่มีแกนสมมาตร (2)', 'อีกข้างของแกน (2)', 'ระบายสีอีกข้างของแกนสมมาตร ตัดกระดาษ และหาแกนสมมาตรของตัวอักษร',
    [...learnStep('รูปสมมาตร<b>รอบตัวเรา</b>', 'รูปสมมาตรรอบตัวเรา', [
      { fig: `<div class="tk-pair">${syFigSVG(SYF.L_A, { lines: [{ a: 90 }], cls: 'sy-mid', col: 'sky' })}${syFigSVG(SYF.L_H, { lines: syAllAx(SYF.L_H), cls: 'sy-mid', col: 'mint' })}</div>`, name: 'ตัวอักษร', text: 'ตัว A มี 1 แกน · ตัว H มี 2 แกน' },
      { fig: syPaperSVG('doll', { fill: '#FFC2C6' }), name: 'ตัดกระดาษพับ', text: 'พับครึ่ง วาดครึ่งรูปติดรอยพับ แล้วตัด<br>คลี่ออกได้รูปที่มีแกนสมมาตร' },
      { fig: syPaintSVG(SYW_PAINT[0], { full: true }), name: 'ลวดลายสมมาตร', text: 'ระบายสีช่องที่ห่างแกนเท่ากัน ด้วยสีเดียวกัน' }], 'รอยพับ = แกนสมมาตร · อีกข้างเหมือนกันแต่กลับด้าน'),
     pexStep('ตัวอย่างทีละขั้น: ระบายสีอีกข้างหนึ่ง', 'ตัวอย่างทีละขั้น', [['① ดูแถวบนสุด', 'ช่องแดงติดแกน 2 ช่อง → อีกข้างก็ติดแกน 2 ช่อง', syPaintSVG(SYW_PAINT[0], { user: { '4,0': 'a', '5,0': 'a' } })], ['② ทำทีละแถว', 'นับช่องจากแกน ใช้สีเดิม', syPaintSVG(SYW_PAINT[0], { user: Object.fromEntries(Object.entries(syPaintModel(SYW_PAINT[0]).want).filter(([k]) => +k.split(',')[1] < 4)) })], ['③ ครบทุกแถว', 'สองข้างเหมือนกันแต่กลับด้าน', syPaintSVG(SYW_PAINT[0], { full: true })]], 'ได้ลวดลายที่<b>มีแกนสมมาตร</b>'),
     T('ลองพับกระดาษ ตัด แล้วคลี่', 'ลองพับกระดาษ ตัด แล้วคลี่', el => el.append(simSyCut(['tree', 'doll', 'vase', 'rocket'])))],
    () => [...pkF(SYW_PAINT, 2).map(D => Q.syPaint(D)), Q.syCut({ c: pick(SYH_K), rot: pick([0, 0, 90]) }), syLetQ([...pkF(SYW_LET.filter(k => SYL[k][1].length), 3), ...pkF(SYW_LET.filter(k => !SYL[k][1].length), 3)]), Q.syCount({ f: 'L_' + pick(['A', 'H', 'T', 'X', 'E', 'I', 'O', 'M', 'K', 'D', 'U', 'S', 'N']) })])
];

/* ---------- boss ---------- */
const syX = (q, fig, opts, lv) => ({ q, fig, opts, a: 0, lv });
const syO = (F, o = {}) => ({ html: syMini(F, o), say: F.n });
const EXAM_P3C4 = d6spread([
  syX('เส้นประเป็นแกนสมมาตรหรือไม่', syFigSVG(SYF.rect, { lines: [{ a: SY_RD }], col: 'sky' }), ['ไม่เป็นแกนสมมาตร', 'เป็นแกนสมมาตร'], 1221),
  syX('เส้นประเป็นแกนสมมาตรหรือไม่', syFigSVG(SYF.tree, { lines: [{ a: 90 }], col: 'mint' }), ['เป็นแกนสมมาตร', 'ไม่เป็นแกนสมมาตร'], 1221),
  syX('รูปใดไม่มีแกนสมมาตร', null, [syO(SYF.para, { col: 'coral' }), syO(SYF.sq, { col: 'yellow' }), syO(SYF.heart, { col: 'pink' }), syO(SYF.tri_iso, { col: 'sky' })], 1221),
  syX('ข้อใดถูกต้อง', null, ['พับตามแกนสมมาตรแล้ว สองข้างทับกันสนิท', 'เส้นที่ผ่านกลางรูปทุกเส้นเป็นแกนสมมาตร', 'รูปทุกรูปมีแกนสมมาตร'], 1221),
  syX('รูปนี้มีแกนสมมาตรหรือไม่', syFigSVG(SYF.shoe, { col: 'orange' }), ['ไม่มีแกนสมมาตร', 'มีแกนสมมาตร 1 แกน', 'มีแกนสมมาตร 2 แกน'], 1221),
  syX('สี่เหลี่ยมจัตุรัสมีแกนสมมาตรกี่แกน', syFigSVG(SYF.sq, { col: 'mint' }), ['4 แกน', '2 แกน', '1 แกน', '8 แกน'], 1222),
  syX('สี่เหลี่ยมผืนผ้ามีแกนสมมาตรกี่แกน', syFigSVG(SYF.rect, { col: 'yellow' }), ['2 แกน', '4 แกน', '1 แกน', 'ไม่มีแกนสมมาตร'], 1222),
  syX('สามเหลี่ยมด้านเท่ามีแกนสมมาตรกี่แกน', syFigSVG(SYF.tri_eq, { col: 'lilac' }), ['3 แกน', '1 แกน', '2 แกน', '6 แกน'], 1222),
  syX('หกเหลี่ยมด้านเท่ามีแกนสมมาตรกี่แกน', syFigSVG(SYF.hex, { col: 'coral' }), ['6 แกน', '3 แกน', '4 แกน', '12 แกน'], 1222),
  syX('วงกลมมีแกนสมมาตรกี่แกน', syFigSVG(SYF.circ, { col: 'sky' }), ['มากมายนับไม่ถ้วน', '1 แกน', '2 แกน', '4 แกน'], 1222),
  syX('รูปใดมีแกนสมมาตรเพียง 1 แกน', null, [syO(SYF.kite, { col: 'mint' }), syO(SYF.rect, { col: 'yellow' }), syO(SYF.sq, { col: 'coral' }), syO(SYF.para, { col: 'sky' })], 1222),
  syX('ดาวห้าแฉกมีแกนสมมาตรกี่แกน', syFigSVG(SYF.star5, { col: 'yellow' }), ['5 แกน', '1 แกน', '2 แกน', '10 แกน'], 1222),
  syX('รูปใดเป็นรูปอีกข้างหนึ่งของแกนสมมาตรที่ถูกต้อง', syPieceSVG([[SYH.house, '#B8E0FF', '#3E7CB1']], { axis: true, cls: 'sy-svg' }),
    [{ html: syPieceSVG([[SYH.house, '#E4E0EE', '#9C95B5'], [SYH.house.map(([x, y]) => [200 - x, y]), '#B8E0FF', '#3E7CB1']], { axis: true }), say: 'ภาพที่กลับด้าน' }, { html: syPieceSVG([[SYH.house, '#E4E0EE', '#9C95B5'], [syShift(SYH.house), '#B8E0FF', '#3E7CB1']], { axis: true }), say: 'ภาพที่เลื่อนไป' }, { html: syPieceSVG([[SYH.house, '#E4E0EE', '#9C95B5'], [syUpside(SYH.house), '#B8E0FF', '#3E7CB1']], { axis: true }), say: 'ภาพที่กลับหัว' }], 1223),
  syX('รูปใดเป็นรูปอีกข้างหนึ่งของแกนสมมาตรที่ถูกต้อง', syPieceSVG([[SYH.rocket, '#FFD45C', '#D18E1C']], { axis: true, cls: 'sy-svg', rot: 90 }),
    [{ html: syPieceSVG([[SYH.rocket, '#E4E0EE', '#9C95B5'], [SYH.rocket.map(([x, y]) => [200 - x, y]), '#FFD45C', '#D18E1C']], { axis: true, rot: 90 }), say: 'ภาพที่กลับด้าน' }, { html: syPieceSVG([[SYH.rocket, '#E4E0EE', '#9C95B5'], [syUpside(SYH.rocket), '#FFD45C', '#D18E1C']], { axis: true, rot: 90 }), say: 'ภาพที่กลับหัว' }, { html: syPieceSVG([[SYH.rocket, '#E4E0EE', '#9C95B5'], [syShift(SYH.rocket), '#FFD45C', '#D18E1C']], { axis: true, rot: 90 }), say: 'ภาพที่เลื่อนไป' }], 1223),
  syX('จุดหนึ่งอยู่ห่างแกนสมมาตร 3 ช่อง จุดคู่ของมันอีกข้างหนึ่งต้องอยู่ห่างแกนกี่ช่อง', null, ['3 ช่อง', '6 ช่อง', '1 ช่อง', '0 ช่อง'], 1223),
  syX('ถ้าระบายสีอีกข้างหนึ่งของแกนให้สมมาตร ต้องระบายเพิ่มกี่ช่อง', syPaintSVG(SYW_PAINT[2]), [`${Object.keys(syPaintModel(SYW_PAINT[2]).give).length} ช่อง`, `${Object.keys(syPaintModel(SYW_PAINT[2]).give).length * 2} ช่อง`, `${Object.keys(syPaintModel(SYW_PAINT[2]).give).length - 2} ช่อง`], 1224),
  syX('พับกระดาษครึ่ง แล้วตัดตามเส้นประ เมื่อคลี่ออกจะได้รูปใด', syPaperSVG('tree'), [{ html: syPieceSVG([[syFull(SYH.tree), '#5FC77A', '#2F8A4B']]), say: 'ต้นสนทั้งต้น' }, { html: syPieceSVG([[SYH.tree, '#5FC77A', '#2F8A4B']]), say: 'ต้นสนครึ่งต้น' }, { html: syPieceSVG([[SYH.tree, '#5FC77A', '#2F8A4B'], [syShift(SYH.tree), '#5FC77A', '#2F8A4B']]), say: 'ครึ่งต้นสองชิ้นเรียงกัน' }], 1224),
  syX('ตัวอักษรใดมีแกนสมมาตร 2 แกน', null, [syO(SYF.L_H, { col: 'mint' }), syO(SYF.L_A, { col: 'coral' }), syO(SYF.L_T, { col: 'yellow' }), syO(SYF.L_N, { col: 'sky' })], 1224),
  syX('ตัวอักษรใดไม่มีแกนสมมาตร', null, [syO(SYF.L_S, { col: 'lilac' }), syO(SYF.L_A, { col: 'coral' }), syO(SYF.L_E, { col: 'mint' }), syO(SYF.L_U, { col: 'yellow' })], 1224),
  syX('ตัวอักษรใดมีแกนสมมาตรเป็นเส้นแนวนอน', null, [syO(SYF.L_E, { col: 'sky' }), syO(SYF.L_A, { col: 'yellow' }), syO(SYF.L_T, { col: 'coral' }), syO(SYF.L_V, { col: 'mint' })], 1224)]);
LESSONS_P3C4.push({ id: 1239, boss: true, place: 'ป่าผีเสื้อยักษ์', title: 'ด่านบอส: ป.3 บทที่ 4 รูปเรขาคณิต', short: 'ด่านบอส · ข้อสอบ', tone: 'yellow',
  goal: 'คำถามท้ายบท 20 ข้อ (แกนสมมาตร · จำนวนแกนสมมาตร · รูปอีกข้างหนึ่งของแกน · ระบายสี · ตัดกระดาษ · ตัวอักษร) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P3C4, pass: 10, bossName: 'งูยักษ์กระจกเงา', bossPal: 'mint', emblem: '◇', bossKind: 'snake',
  winLine: 'ชนะงูยักษ์กระจกเงาแล้ว! หาแกนสมมาตรเก่งมาก', loseLine: 'งูยักษ์กระจกเงายังไม่ยอมแพ้ กลับไปทวนแล้วสู้ใหม่นะ!' });
