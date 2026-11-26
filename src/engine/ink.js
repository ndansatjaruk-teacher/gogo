'use strict';
/* =========================================================
   INK: pen/finger drawing, palm rejection, handwriting
   recognition for digits, tracing score, scratch layer
   ========================================================= */
const PEN = { down: false, last: 0 };
addEventListener('pointerdown', e => { if (e.pointerType === 'pen') { PEN.down = true; PEN.last = Date.now(); } }, true);
['pointerup', 'pointercancel'].forEach(t => addEventListener(t, e => { if (e.pointerType === 'pen') { PEN.down = false; PEN.last = Date.now(); } }, true));
/* a touch is treated as a resting palm if the pen is in use, or the contact is very large */
const isPalm = e => e.pointerType === 'touch' && (PEN.down || Date.now() - PEN.last < 1200 || (e.width > 45 && e.height > 45));

/* ---------------- v263 (ผู้ใช้ขอ) ขีดซ้ำเพื่อลบ · scratch-to-erase (แบบ Goodnotes) ----------------
   ขีดไปมาเร็ว ๆ ทับหมึกที่เขียนไว้ = ลบเส้นที่อยู่ใต้รอยขีด โดยไม่ต้องเปลี่ยนเป็นยางลบ
   ใช้ได้ทั้งกระดาษทด (Scratch) และช่องเขียนคำตอบ (InkPad) · ปากกา Apple Pencil / สไตลัส นิ้ว และเมาส์
   จำว่าเป็นรอยขีดลบเมื่อ: เปลี่ยนทิศกลับไปมาตามแกนหลัก ≥ minRev ครั้ง (แต่ละขาไกลกว่า minLeg px) · มุมกลับแหลม (ไม่ใช่โค้งมนแบบลายมือ)
   ความยาวเส้นต่อขนาดกรอบ ≥ minDens · เร็วพอ (minSpeed px/ms) · กรอบไม่ใหญ่เกิน maxSize · และต้องมีหมึกอยู่ใต้รอยขีดจริง
   เส้นที่ถูกลบ: แตะรอยขีด (ระยะ tol) และอยู่ในพื้นที่รอยขีด ≥ minCover ของความยาวเส้น (หรือเกือบทั้งเส้นอยู่ในพื้นที่) — เส้นข้าง ๆ ที่แค่เฉียดไม่ถูกลบ
   ระหว่างขีด: เมื่อจำได้แล้ว รอยขีดจางลงเป็นสีเทา และเส้นที่จะถูกลบจางลง (บอกล่วงหน้า) · ยกปากกา = ลบทันที · ย้อน/ทำซ้ำได้ */
const SCRUB = { minRev: 4, minLeg: 7, sharpCos: -.25, sharpShare: .6, minDens: 3, minSpeed: .25, maxSize: 360, minCover: .15, tol: 6 };
const SCRUB_LV = { low: { minRev: 5, minDens: 3.6, minCover: .25, sharpShare: .7, minSpeed: .4 }, normal: {}, high: { minRev: 3, minDens: 2.4, minCover: .1, sharpShare: .5, minSpeed: .15 } };
const scrubCfg = () => Object.assign({}, SCRUB, SCRUB_LV[(typeof SET !== 'undefined' && SET.scrubLv) || 'normal'] || {});
const scrubOn = () => typeof SET === 'undefined' || SET.scrubErase !== false;
function scrubRes(P, step = 3) { if (!P.length) return []; const out = [{ x: P[0].x, y: P[0].y }]; let px = P[0].x, py = P[0].y, acc = 0; /* even spacing (step px), points added between far-apart samples */
  for (let i = 1; i < P.length; i++) { let ax = px, ay = py; const bx = P[i].x, by = P[i].y; let d = Math.hypot(bx - ax, by - ay);
    while (acc + d >= step) { const t = (step - acc) / d; ax += (bx - ax) * t; ay += (by - ay) * t; out.push({ x: ax, y: ay }); d = Math.hypot(bx - ax, by - ay); acc = 0; }
    acc += d; px = bx; py = by; }
  return out; }
function scrubHull(P) { const a = P.map(p => [p.x, p.y]).sort((u, v) => u[0] - v[0] || u[1] - v[1]); if (a.length < 3) return a; const cr = (o, p, q) => (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]), lo = [], up = [];
  for (const p of a) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = a.length - 1; i >= 0; i--) { const p = a[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1)); }
const scrubSegD = (x, y, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / L)) : 0; return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); };
const scrubInHull = (x, y, H, tol) => { if (H.length < 3) return H.some(q => Math.hypot(x - q[0], y - q[1]) <= tol); let ins = false; for (let i = 0, j = H.length - 1; i < H.length; j = i++) { const [xi, yi] = H[i], [xj, yj] = H[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins; }
  if (ins) return true; for (let i = 0, j = H.length - 1; i < H.length; j = i++) if (scrubSegD(x, y, H[j], H[i]) <= tol) return true; return false; };
/* is this stroke a scratch gesture? pts = [{x, y}], ms = how long it took · returns { R, H, box } or null */
function scrubShape(pts, ms, cfg = scrubCfg()) {
  const R = scrubRes(pts, 3); if (R.length < 10) return null;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, len = 0, mx = 0, my = 0; R.forEach((p, i) => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); mx += p.x; my += p.y; if (i) len += Math.hypot(p.x - R[i - 1].x, p.y - R[i - 1].y); });
  const size = Math.max(x1 - x0, y1 - y0); if (size < 10 || size > cfg.maxSize || len / size < cfg.minDens || len / Math.max(1, ms) < cfg.minSpeed) return null;
  mx /= R.length; my /= R.length; let sxx = 0, syy = 0, sxy = 0; R.forEach(p => { const dx = p.x - mx, dy = p.y - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; });
  const th0 = Math.atan2(2 * sxy, sxx - syy) / 2; let rev = [];
  /* both the main axis and the one across it: a zig-zag that travels down a word has its back-and-forth across the main axis */
  for (const th of [th0, th0 + Math.PI / 2]) { const c = Math.cos(th), sn = Math.sin(th), u = R.map(p => (p.x - mx) * c + (p.y - my) * sn);
  /* direction changes along the main axis, with hysteresis: a leg counts only when it is longer than minLeg */
  const rv = []; let dir = 0, ext = 0, lo = 0, hi = 0; for (let i = 1; i < u.length; i++) {
    if (!dir) { if (u[i] > u[hi]) hi = i; if (u[i] < u[lo]) lo = i; if (u[i] - u[lo] > cfg.minLeg) { dir = 1; ext = i; } else if (u[hi] - u[i] > cfg.minLeg) { dir = -1; ext = i; } continue; }
    if (dir > 0) { if (u[i] >= u[ext]) ext = i; else if (u[ext] - u[i] > cfg.minLeg) { rv.push(ext); dir = -1; ext = i; } }
    else { if (u[i] <= u[ext]) ext = i; else if (u[i] - u[ext] > cfg.minLeg) { rv.push(ext); dir = 1; ext = i; } } }
    if (rv.length > rev.length) rev = rv; }
  if (rev.length < cfg.minRev) return null;
  const sharp = rev.filter(k => { const a = R[Math.max(0, k - 3)], m = R[k], b = R[Math.min(R.length - 1, k + 3)], v1 = [m.x - a.x, m.y - a.y], v2 = [b.x - m.x, b.y - m.y], n = Math.hypot(...v1) * Math.hypot(...v2); return n && (v1[0] * v2[0] + v1[1] * v2[1]) / n < cfg.sharpCos; }).length;
  if (sharp / rev.length < cfg.sharpShare) return null;
  return { R, H: scrubHull(R), box: [x0, y0, x1, y1] }; }
/* the strokes under a scratch: they touch the scratch line and lie (mostly) inside its area */
function scrubTargets(sc, strokes, skip, cfg = scrubCfg()) { const out = [], [bx0, by0, bx1, by1] = sc.box;
  strokes.forEach(s => { if (!s || s === skip || s.erase || !s.pts || !s.pts.length) return; const tol = cfg.tol + (s.width || 4) / 2, Q = scrubRes(s.pts, 3);
    if (!Q.some(p => p.x >= bx0 - tol && p.x <= bx1 + tol && p.y >= by0 - tol && p.y <= by1 + tol)) return;
    let ins = 0, touch = false; for (const p of Q) { if (scrubInHull(p.x, p.y, sc.H, tol)) ins++; if (!touch) for (let i = 1; i < sc.R.length; i++) if (scrubSegD(p.x, p.y, [sc.R[i - 1].x, sc.R[i - 1].y], [sc.R[i].x, sc.R[i].y]) <= tol) { touch = true; break; } }
    const cov = ins / Q.length; if ((touch && cov >= cfg.minCover) || cov >= .8) out.push(s); });
  return out; }
/* live check while the pen is still down (every few points) · s.__scrub = the strokes that will go */
function scrubLive(s, strokes) { if (!scrubOn() || s.erase) return false; const n = s.pts.length; if (n < 12 || n - (s.__chk || 0) < 4) return false; s.__chk = n;
  const sc = scrubShape(s.pts, performance.now() - s.t0), tg = sc ? scrubTargets(sc, strokes, s) : [], was = !!s.__scrub; s.__scrub = tg.length ? tg : null;
  return was !== !!s.__scrub || (s.__scrub && s.__scrub.length !== (s.__n || 0)) ? (s.__n = s.__scrub ? s.__scrub.length : 0, true) : false; }
/* at pen-up: the final decision · returns the erased strokes (with their old places) or null */
function scrubDo(s, strokes) { if (!scrubOn() || s.erase) return null; const sc = scrubShape(s.pts, performance.now() - s.t0), tg = sc ? scrubTargets(sc, strokes, s) : [];
  delete s.__scrub; if (!tg.length) return null; const items = tg.map(t => ({ s: t, i: strokes.indexOf(t) })).sort((a, b) => a.i - b.i);
  for (let k = items.length - 1; k >= 0; k--) strokes.splice(items[k].i, 1); const j = strokes.indexOf(s); if (j >= 0) strokes.splice(j, 1);
  try { sfx.pop && sfx.pop(2); } catch (_) { } return items; }
const scrubBack = (strokes, items) => items.forEach(({ s, i }) => strokes.splice(Math.min(i, strokes.length), 0, s));
/* how a stroke is painted while a scratch is being recognised */
const scrubAlpha = (s, cur) => cur && cur.__scrub ? (s === cur ? .35 : cur.__scrub.includes(s) ? .22 : 1) : 1;

class InkPad {
  constructor(canvas, o = {}) {
    this.c = canvas; this.x = canvas.getContext('2d');
    this.o = Object.assign({ width: 7, color: '#2B2550' }, o);
    this.strokes = []; this.cur = null; this.pid = null; this.hist = [];
    canvas.classList.add('pad-canvas'); canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', e => this.down(e));
    canvas.addEventListener('pointermove', e => this.move(e));
    canvas.addEventListener('pointerup', e => this.up(e));
    canvas.addEventListener('pointercancel', e => this.up(e));
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(canvas); canvas.__pad = this;
    this.resize();
  }
  pos(e) { const r = this.c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  resize() {
    const r = this.c.getBoundingClientRect(), d = devicePixelRatio || 1;
    if (!r.width) return;
    this.w = r.width; this.h = r.height;
    this.c.width = Math.round(r.width * d); this.c.height = Math.round(r.height * d);
    this.x.setTransform(d, 0, 0, d, 0, 0); this.redraw();
  }
  down(e) {
    if (this.o.disabled || isPalm(e)) return;
    if (e.pointerType === 'pen' && this.cur && this.cur.type !== 'pen') { this.strokes.pop(); this.cur = null; this.redraw(); }
    if (this.cur) return;
    e.preventDefault(); e.stopPropagation();
    try { this.c.setPointerCapture(e.pointerId); } catch (_) { }
    this.pid = e.pointerId;
    this.cur = { pts: [this.pos(e)], type: e.pointerType, color: this.o.color, width: this.o.width, t0: performance.now() };
    this.strokes.push(this.cur); this.drawLast();
    this.o.onStart && this.o.onStart();
  }
  move(e) {
    if (!this.cur || e.pointerId !== this.pid) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (evs.length ? evs : [e])) { this.cur.pts.push(this.pos(ev)); this.drawLast(); }
    if (!this.o.noScrub && scrubLive(this.cur, this.strokes)) this.redraw(); /* v263: บอกล่วงหน้าว่ากำลังขีดลบ */
  }
  up(e) {
    if (!this.cur || e.pointerId !== this.pid) return;
    const s = this.cur; this.cur = null; this.pid = null;
    const gone = !this.o.noScrub && scrubDo(s, this.strokes); /* v263: ขีดซ้ำเพื่อลบ */
    if (gone) { this.hist.push({ gone, n: this.strokes.length }); this.redraw(); this.o.onErase && this.o.onErase(gone); }
    this.o.onStroke && this.o.onStroke(this.strokes);
  }
  drawStroke(s, from = 1) {
    const x = this.x, p = s.pts;
    x.strokeStyle = s.__scrub ? '#9A93B8' : s.color; x.lineWidth = s.width; x.lineCap = 'round'; x.lineJoin = 'round'; x.globalAlpha = scrubAlpha(s, this.cur);
    x.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over';
    if (p.length === 1) { x.beginPath(); x.arc(p[0].x, p[0].y, s.width / 2, 0, 7); x.fillStyle = s.color; x.fill(); }
    x.beginPath(); x.moveTo(p[Math.max(0, from - 1)].x, p[Math.max(0, from - 1)].y);
    for (let i = from; i < p.length; i++) x.lineTo(p[i].x, p[i].y);
    x.stroke(); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
  }
  drawLast() { const s = this.cur; if (s) this.drawStroke(s, Math.max(1, s.pts.length - 1)); }
  redraw() {
    if (!this.w) return;
    this.x.clearRect(0, 0, this.w, this.h);
    this.o.drawBg && this.o.drawBg(this.x, this.w, this.h);
    for (const s of this.strokes) this.drawStroke(s);
  }
  clear() { this.strokes = []; this.cur = null; this.hist = []; this.redraw(); }
  undo() { const h = this.hist[this.hist.length - 1]; if (h && h.n === this.strokes.length) { this.hist.pop(); scrubBack(this.strokes, h.gone); } else this.strokes.pop(); this.redraw(); } /* v263: ย้อนการขีดลบได้ */
  destroy() { this.ro.disconnect(); }
}

/* ---------------- digit stroke templates (0..100 box, y down) ---------------- */
function arc(cx, cy, rx, ry, a0, a1, n = 16) {
  const p = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return p;
}
/* Each digit: list of variants; each variant: list of strokes. Variant 0 is the teaching model (stroke order shown). */
const DIGIT_STROKES = {
  '0': [[arc(50, 50, 28, 45, -90, -450, 36)], [arc(50, 50, 28, 45, -90, 270, 36)], [arc(50, 50, 32, 44, -70, -430, 36)]],
  '1': [[[[50, 5], [50, 95]]], [[[30, 24], [50, 5], [50, 95]]], [[[30, 24], [50, 5], [50, 95]], [[28, 95], [72, 95]]], [[[54, 5], [46, 95]]]],
  '2': [[[...arc(50, 30, 25, 24, 190, 380, 18), [24, 95], [80, 95]]],
  [[...arc(50, 32, 27, 26, 200, 365, 16), [26, 93], [78, 93]]],
  [[...arc(50, 28, 25, 22, 180, 390, 18), [40, 70], [22, 94], [36, 88], [80, 92]]]],
  '3': [[[...arc(48, 28, 25, 22, 200, 450, 16), ...arc(48, 72, 28, 23, 270, 520, 18)]],
  [[[22, 8], [74, 8], [46, 42], ...arc(48, 70, 28, 25, 250, 520, 18)]],
  [[...arc(50, 28, 22, 21, 210, 450, 14), ...arc(50, 71, 26, 24, 270, 510, 16)]]],
  '4': [[[[58, 5], [16, 66], [86, 66]], [[66, 34], [66, 95]]],
  [[[58, 5], [16, 66], [86, 66]], [[66, 5], [66, 95]]],
  [[[26, 5], [22, 60], [82, 60]], [[66, 5], [66, 95]]],
  [[[26, 5], [22, 60], [82, 60], [70, 60], [70, 20], [70, 95]]]],
  '5': [[[[30, 5], [27, 45], ...arc(50, 68, 27, 26, 215, 520, 18)], [[30, 5], [78, 5]]],
  [[[78, 5], [30, 5], [27, 45], ...arc(50, 68, 27, 26, 215, 520, 18)]],
  [[[30, 5], [28, 46], ...arc(46, 68, 26, 25, 230, 500, 16)], [[28, 5], [76, 7]]]],
  '6': [[[[72, 6], [52, 14], [36, 30], [27, 55], ...arc(50, 70, 23, 24, 180, -180, 26)]],
  [[[64, 5], [34, 40], ...arc(50, 70, 22, 23, 200, -160, 24)]],
  [[[70, 8], [40, 25], [28, 55], ...arc(50, 72, 22, 22, 180, -150, 24)]]],
  '7': [[[[20, 8], [80, 8], [42, 95]]], [[[20, 8], [80, 8], [42, 95]], [[36, 52], [72, 52]]], [[[20, 22], [20, 8], [80, 8], [46, 95]]], [[[22, 8], [78, 8], [56, 50], [50, 95]]]],
  '8': [[[...arc(50, 27, 20, 21, -30, -270, 16), ...arc(50, 72, 25, 23, -90, 270, 26), ...arc(50, 27, 20, 21, 90, -30, 10)]],
  [arc(50, 27, 20, 21, -90, 270, 22), arc(50, 72, 25, 23, -90, 270, 26)],
  [[...arc(50, 26, 21, 21, -20, -250, 16), [70, 68], ...arc(50, 72, 22, 22, 0, 180, 12), [70, 30]]]],
  '9': [[[...arc(48, 30, 23, 24, 0, -360, 26), [71, 30], [68, 95]]],
  [[...arc(46, 28, 24, 23, -10, -360, 26), [70, 30], [64, 94]]],
  [[...arc(48, 30, 23, 24, 0, -360, 26), [71, 30], [70, 72], [60, 92], [42, 95]]]]
};

const REC_N = 44;
function samplePts(strokes, n = REC_N) {
  const S = strokes.map(s => (s.pts || s).map(p => Array.isArray(p) ? p : [p.x, p.y])).filter(s => s.length);
  const segs = []; let total = 0;
  for (const s of S) for (let i = 1; i < s.length; i++) { const d = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]); if (d > 0) { segs.push([s[i - 1], s[i], d]); total += d; } }
  const out = [];
  if (total < 1e-6) { for (const s of S) out.push(s[0]); return out.length ? out : [[0, 0]]; }
  const step = total / (n - 1); let acc = 0, next = 0;
  for (const [a, b, d] of segs) {
    while (next <= acc + d + 1e-9 && out.length < n) { const t = (next - acc) / d; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); next += step; }
    acc += d;
  }
  while (out.length < n) out.push(segs[segs.length - 1][1]);
  return out;
}
function bboxOf(P) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of P) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }; }
function normPts(P) {
  const b = bboxOf(P), s = Math.max(b.w, b.h) || 1, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
  return P.map(([x, y]) => [(x - cx) / s, (y - cy) / s]);
}
function chamfer(A, B) {
  let sa = 0, sb = 0;
  for (const a of A) { let m = 1e9; for (const b of B) { const d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2; if (d < m) m = d; } sa += Math.sqrt(m); }
  for (const b of B) { let m = 1e9; for (const a of A) { const d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2; if (d < m) m = d; } sb += Math.sqrt(m); }
  return Math.max(sa / A.length, sb / B.length) * .6 + (sa / A.length + sb / B.length) / 2 * .4;
}
/* endpoint feature: where strokes start/end matters a little (open vs closed shapes) */
function endpoints(strokes) {
  const all = samplePts(strokes, REC_N), b = bboxOf(all), s = Math.max(b.w, b.h) || 1, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
  const E = [];
  for (const st of strokes) {
    const p = (st.pts || st).map(q => Array.isArray(q) ? q : [q.x, q.y]); if (p.length < 2) continue;
    const L = p.reduce((a, q, i) => i ? a + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0, 0);
    if (L < s * .08) continue;
    const a = p[0], z = p[p.length - 1];
    if (Math.hypot(a[0] - z[0], a[1] - z[1]) < s * .12) continue; // closed loop: no free ends
    E.push([(a[0] - cx) / s, (a[1] - cy) / s], [(z[0] - cx) / s, (z[1] - cy) / s]);
  }
  return E;
}
function endDist(E1, E2) {
  if (!E1.length && !E2.length) return 0;
  if (!E1.length || !E2.length) return .25;
  const f = (A, B) => A.reduce((t, a) => t + Math.min(...B.map(b => Math.hypot(a[0] - b[0], a[1] - b[1]))), 0) / A.length;
  return Math.min(.3, (f(E1, E2) + f(E2, E1)) / 2);
}
const TEMPLATES = [];
for (const [d, vars] of Object.entries(DIGIT_STROKES)) for (const v of vars) TEMPLATES.push({ d, pts: normPts(samplePts(v)), ends: endpoints(v) });

function glyphScores(strokes) {
  const P = normPts(samplePts(strokes)), E = endpoints(strokes), best = {};
  for (const t of TEMPLATES) {
    const sc = chamfer(P, t.pts) + .35 * endDist(E, t.ends);
    if (best[t.d] == null || sc < best[t.d]) best[t.d] = sc;
  }
  return best; // digit -> score (lower is better)
}
function strokeBoxes(strokes) {
  return strokes.filter(s => s.pts.length).map(s => { const b = bboxOf(s.pts.map(p => [p.x, p.y])); return { s, ...b }; }).sort((a, b) => a.x0 - b.x0);
}
function groupByX(strokes) {
  const bs = strokeBoxes(strokes); if (!bs.length) return [];
  const H = Math.max(...bs.map(b => b.y1)) - Math.min(...bs.map(b => b.y0)) || 1;
  const groups = [];
  for (const b of bs) {
    const g = groups[groups.length - 1];
    if (g && b.x0 < g.x1 + H * .04) { g.x1 = Math.max(g.x1, b.x1); g.strokes.push(b.s); }
    else groups.push({ x0: b.x0, x1: b.x1, strokes: [b.s] });
  }
  return groups.map(g => g.strokes);
}
/* Recognise a handwritten whole number. candidates: array of strings like '0'..'10'. */
function recognizeNumber(strokes, candidates = range(0, 10).map(String)) {
  strokes = strokes.filter(s => s.pts && s.pts.length);
  if (!strokes.length) return null;
  if (candidates === 'any') { // read each glyph on its own; tiny marks low on the line (commas) are skipped
    const bs = strokeBoxes(strokes), y0 = Math.min(...bs.map(b => b.y0)), y1 = Math.max(...bs.map(b => b.y1)), H = y1 - y0 || 1;
    const keep = bs.filter(b => Math.max(b.y1 - b.y0, b.x1 - b.x0) > H * .32 || b.y0 < y0 + H * .45).map(b => b.s);
    const g = groupByX(keep); if (!g.length) return null;
    let tot = 0, val = '';
    for (const part of g) { const sc = glyphScores(part); let bd = null; for (const d in sc) if (d.length === 1 && (bd == null || sc[d] < sc[bd])) bd = d; val += bd; tot += sc[bd]; }
    const score = tot / g.length; return { value: val.replace(/^0+(\d)/, '$1'), score, confident: score < .16 };
  }
  const partitions = [];
  const g = groupByX(strokes); partitions.push(g);
  if (g.length > 1) partitions.push([strokes]);
  const bs = strokeBoxes(strokes).map(b => b.s);
  if (bs.length >= 2 && g.length === 1) for (let k = 1; k < bs.length; k++) partitions.push([bs.slice(0, k), bs.slice(k)]);
  let best = null;
  for (const part of partitions) {
    const scores = part.map(glyphScores);
    for (const c of candidates) {
      if (c.length !== part.length) continue;
      let s = 0; for (let i = 0; i < c.length; i++) s += scores[i][c[i]];
      s /= c.length;
      if (part !== g) s += .02; // prefer the natural grouping
      if (!best || s < best.score) best = { value: c, score: s };
    }
  }
  if (!best) return null;
  best.confident = best.score < .16;
  return best;
}

/* ---------------- tracing guides & scoring ---------------- */
/* geometry for an Arabic digit model inside a w*h box */
function digitXf(w, h, scale = .74) { const k = h * scale / 100; return ([x, y]) => [w / 2 + (x - 50) * k, h / 2 + (y - 50) * k]; }
function digitModel(d) {
  if (d.length === 1) return DIGIT_STROKES[d][0].map(s => s.map(p => [p[0], p[1]]));
  // multi-digit (10): place side by side
  const out = []; const n = d.length;
  [...d].forEach((ch, i) => { const off = (i - (n - 1) / 2) * 62; for (const s of DIGIT_STROKES[ch][0]) out.push(s.map(p => [p[0] + off, p[1]])); });
  return out;
}
function drawGuide(x, w, h, g, mode, level = 0) {
  // mode: 'show' (faded, dashed, start dots) | 'mask' (solid); level 0 full · 1 light · 2 faint (show only)
  x.save();
  if (mode !== 'mask') x.globalAlpha = [1, .45, .16][level] ?? 1;
  if (g.kind === 'digit') {
    const f = digitXf(w, h, g.d.length > 1 ? .62 : .74), S = digitModel(g.d).map(s => s.map(f));
    const lw = h * (mode === 'mask' ? .1 : .085);
    x.lineCap = 'round'; x.lineJoin = 'round';
    for (const s of S) {
      x.beginPath(); s.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]));
      x.strokeStyle = mode === 'mask' ? '#000' : '#EEEBFF'; x.lineWidth = lw; x.stroke();
      if (mode !== 'mask') { x.setLineDash([1, 10]); x.strokeStyle = '#8E7CF0'; x.lineWidth = 4; x.stroke(); x.setLineDash([]); }
    }
    if (mode !== 'mask') { x.globalAlpha = level >= 2 ? .55 : 1; } if (mode !== 'mask') S.forEach((s, i) => {
      x.beginPath(); x.arc(s[0][0], s[0][1] + 1.5, 12, 0, 7); x.fillStyle = '#1E9C70'; x.fill(); x.beginPath(); x.arc(s[0][0], s[0][1], 12, 0, 7); x.fillStyle = '#2FBF8C'; x.fill();
      x.fillStyle = '#fff'; x.font = '900 13px Nunito, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(i + 1, s[0][0], s[0][1] + 1);
    });
  } else {
    const fs = fitFont(x, g.text, w * .86, h * (g.text.length > 2 ? .66 : .72));
    x.font = `${g.weight || 500} ${fs}px 'IBM Plex Sans Thai Looped', Thonburi, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    const m = x.measureText(g.text), asc = m.actualBoundingBoxAscent || fs * .7, des = m.actualBoundingBoxDescent || 0;
    const y = h / 2 + (asc - des) / 2;
    if (mode === 'mask') { x.fillStyle = '#000'; x.fillText(g.text, w / 2, y); x.lineWidth = fs * .05; x.strokeStyle = '#000'; x.strokeText(g.text, w / 2, y); }
    else {
      x.fillStyle = '#EEEBFF'; x.fillText(g.text, w / 2, y);
      x.setLineDash([3, 5]); x.lineWidth = 1.6; x.strokeStyle = '#8E7CF0'; x.strokeText(g.text, w / 2, y); x.setLineDash([]);
    }
  }
  x.restore();
}
function fitFont(x, text, maxW, maxH) {
  const t = 100; x.font = `500 ${t}px 'IBM Plex Sans Thai Looped', Thonburi, sans-serif`;
  const m = x.measureText(text), gh = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || t * .7, gw = m.width || t;
  return Math.min(maxH / gh, maxW / gw) * t;
}
function gridMask(gw, gh, draw) {
  const c = document.createElement('canvas'); c.width = gw; c.height = gh;
  const x = c.getContext('2d'); draw(x);
  const d = x.getImageData(0, 0, gw, gh).data, m = new Uint8Array(gw * gh);
  for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 50 ? 1 : 0;
  return m;
}
function distMap(m, gw, gh) {
  const D = new Float32Array(gw * gh); const INF = 1e6;
  for (let i = 0; i < m.length; i++) D[i] = m[i] ? 0 : INF;
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { const i = y * gw + x; if (x) D[i] = Math.min(D[i], D[i - 1] + 1); if (y) D[i] = Math.min(D[i], D[i - gw] + 1); if (x && y) D[i] = Math.min(D[i], D[i - gw - 1] + 1.4); if (y && x < gw - 1) D[i] = Math.min(D[i], D[i - gw + 1] + 1.4); }
  for (let y = gh - 1; y >= 0; y--) for (let x = gw - 1; x >= 0; x--) { const i = y * gw + x; if (x < gw - 1) D[i] = Math.min(D[i], D[i + 1] + 1); if (y < gh - 1) D[i] = Math.min(D[i], D[i + gw] + 1); if (x < gw - 1 && y < gh - 1) D[i] = Math.min(D[i], D[i + gw + 1] + 1.4); if (y < gh - 1 && x) D[i] = Math.min(D[i], D[i + gw - 1] + 1.4); }
  return D;
}
/* returns {coverage, precision, pass} */
function scoreTrace(pad, guide) {
  const G = 44, cell = pad.h / G, gw = Math.ceil(pad.w / cell), gh = G, k = 1 / cell;
  const gm = gridMask(gw, gh, x => { x.scale(k, k); drawGuide(x, pad.w, pad.h, guide, 'mask'); });
  const im = gridMask(gw, gh, x => {
    x.scale(k, k); x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = Math.max(6, pad.h * .035); x.strokeStyle = '#000';
    for (const s of pad.strokes) { x.beginPath(); s.pts.forEach((p, i) => i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y)); if (s.pts.length === 1) x.lineTo(s.pts[0].x + .5, s.pts[0].y); x.stroke(); }
  });
  const dI = distMap(im, gw, gh), dG = distMap(gm, gw, gh);
  let gc = 0, gcov = 0, ic = 0, iok = 0;
  for (let i = 0; i < gm.length; i++) {
    if (gm[i]) { gc++; if (dI[i] <= 2.2) gcov++; }
    if (im[i]) { ic++; if (dG[i] <= 2.5) iok++; }
  }
  const coverage = gc ? gcov / gc : 0, precision = ic ? iok / ic : 0;
  const t = guide.kind === 'digit' ? [.7, .72] : [.62, .68];
  return { coverage, precision, pass: coverage >= t[0] && precision >= t[1] && ic > 6 };
}
/* animate the writing of an Arabic digit on a canvas (stroke order) */
function animateDigit(canvas, d, opts = {}) {
  const x = canvas.getContext('2d'), dpr = devicePixelRatio || 1, r = canvas.getBoundingClientRect();
  const w = r.width, hh = r.height; canvas.width = w * dpr; canvas.height = hh * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const f = digitXf(w, hh, d.length > 1 ? .62 : .74), S = digitModel(d).map(s => s.map(f));
  const lens = S.map(s => s.reduce((a, p, i) => i ? a + Math.hypot(p[0] - s[i - 1][0], p[1] - s[i - 1][1]) : 0, 0));
  const total = lens.reduce((a, b) => a + b, 0), dur = opts.dur || 1800;
  let t0 = null, stop = false;
  function frame(ts) {
    if (stop) return; if (!t0) t0 = ts;
    const prog = Math.min(1, (ts - t0) / dur) * total;
    x.clearRect(0, 0, w, hh); drawGuide(x, w, hh, { kind: 'digit', d }, 'show');
    let left = prog, pen = null;
    x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#FF6F7D'; x.lineWidth = hh * .075;
    S.forEach((s, si) => {
      if (left <= 0) return;
      x.beginPath(); x.moveTo(s[0][0], s[0][1]); pen = s[0];
      for (let i = 1; i < s.length && left > 0; i++) {
        const seg = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
        if (seg <= left) { x.lineTo(s[i][0], s[i][1]); left -= seg; pen = s[i]; }
        else { const t = left / seg; pen = [s[i - 1][0] + (s[i][0] - s[i - 1][0]) * t, s[i - 1][1] + (s[i][1] - s[i - 1][1]) * t]; x.lineTo(pen[0], pen[1]); left = 0; }
      }
      x.stroke();
    });
    if (pen) { x.beginPath(); x.arc(pen[0], pen[1], hh * .05, 0, 7); x.fillStyle = '#fff'; x.fill(); x.lineWidth = 3; x.strokeStyle = '#2B2550'; x.stroke(); }
    if (prog < total) requestAnimationFrame(frame); else opts.onDone && opts.onDone();
  }
  requestAnimationFrame(frame);
  return () => { stop = true; };
}

/* ---------------- Scratch layer (ทด) ---------------- */
const Scratch = {
  on: false, enabled: false, color: '#4C9BF0', strokes: [], cur: null, hist: [], fwd: [],
  /* v179 (ผู้ใช้ขอ: แถบเครื่องมือทดลากย้ายได้) จับที่ป้าย "กระดาษทด" แล้วลาก — แถบไม่บังโจทย์ · จำตำแหน่งไว้ (ถ้าเบราว์เซอร์ให้เก็บ) */
  dragBar() { const T = this.tools, g = T.querySelector('.t'); g.classList.add('grip'); g.title = 'ลากเพื่อย้ายแถบ';
    const place = (x, y) => { const r = T.getBoundingClientRect(), X = Math.max(4, Math.min(innerWidth - r.width - 4, x)), Y = Math.max(4, Math.min(innerHeight - r.height - 4, y)); Object.assign(T.style, { left: X + 'px', top: Y + 'px', bottom: 'auto', transform: 'none' }); return [X, Y]; };
    this.placeBar = place; try { this.barPos = JSON.parse(localStorage.getItem('scratchBar') || 'null'); } catch (_) { }
    let d = null;
    g.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); const r = T.getBoundingClientRect(); d = { dx: e.clientX - r.left, dy: e.clientY - r.top }; T.classList.add('dragging'); try { g.setPointerCapture(e.pointerId); } catch (_) { } });
    g.addEventListener('pointermove', e => { if (d) this.barPos = place(e.clientX - d.dx, e.clientY - d.dy); });
    const end = () => { if (!d) return; d = null; T.classList.remove('dragging'); try { localStorage.setItem('scratchBar', JSON.stringify(this.barPos)); } catch (_) { } };
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
    addEventListener('resize', () => { if (this.barPos) this.barPos = place(...this.barPos); }); },
  init() {
    this.c = h('canvas', { id: 'scratch' }); document.body.append(this.c); this.x = this.c.getContext('2d');
    const sw = c => h('button', { class: 'sw' + (c === this.color ? ' on' : ''), style: { background: c }, 'aria-label': 'สี', onclick: e => { this.color = c; this.tools.querySelectorAll('.sw').forEach(b => b.classList.toggle('on', b === e.currentTarget)); } });
    this.tools = h('div', { class: 'scratch-tools' }, h('span', { class: 't' }, icon('pencil'), 'กระดาษทด'),
      ['#4C9BF0', '#FF6F7D', '#2FBF8C', '#2B2550'].map(sw),
      h('button', { class: 'ibtn', 'aria-label': 'ย้อน', onclick: () => this.undo() }, icon('undo')),
      h('button', { class: 'ibtn', 'aria-label': 'ทำซ้ำ', onclick: () => this.redo() }, icon('redo')),
      h('button', { class: 'ibtn', 'aria-label': 'ล้าง', onclick: () => this.clear(true) }, icon('eraser')),
      h('button', { class: 'ibtn', 'aria-label': 'ปิด', onclick: () => this.toggle(false) }, icon('close')));
    document.body.append(this.tools); this.dragBar();
    addEventListener('resize', () => this.resize()); this.resize();
    // finger/pen drawing while scratch mode is on
    this.c.addEventListener('pointerdown', e => {
      // taps on the top bar (e.g. pressing ทด again to close) go to the button underneath instead of drawing
      const tb = document.querySelector('.topbar'), r = tb && tb.getBoundingClientRect();
      // (iPad Safari fires its own click afterwards at the same spot — which would hit ทด again and reopen scratch — so swallow it)
      if (r && e.clientY <= r.bottom) { e.preventDefault(); const b = this.under(e.clientX, e.clientY)?.closest('button'); if (b) b.click(); this.blockClickUntil = Date.now() + 700; return; }
      e.preventDefault();
      // Apple Pencil always writes · finger / mouse: a short tap presses what is underneath (answers, keypad), a drag writes.
      // The tap is tracked even when palm rejection blocks drawing (a finger right after the Pencil, or a wide fingertip on iPad).
      if (e.pointerType !== 'pen') this.tapC = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now(), moved: 0 };
      if (!isPalm(e)) this.start(e);
      try { this.c.setPointerCapture(e.pointerId); } catch (_) { } });
    this.c.addEventListener('pointermove', e => { const T = this.tapC; if (T && e.pointerId === T.id) T.moved = Math.max(T.moved, Math.hypot(e.clientX - T.x, e.clientY - T.y)); this.move(e); });
    this.c.addEventListener('pointerup', e => this.end(e)); this.c.addEventListener('pointercancel', e => this.end(e));
    // Apple Pencil: write anywhere on blank space even when scratch mode is off
    document.addEventListener('pointerdown', e => {
      if (this.on || !this.enabled || !SET.penAnywhere || e.pointerType !== 'pen') return;
      if (e.target.closest('button,a,canvas,input,.ia,.mi,.pi,.opt,.ncard,.slot,.counter,.heart,.obj.tappable,.topbar,.bottombar,.modal-bg,.sheet')) return;
      e.preventDefault(); this.start(e, true);
      const mv = ev => this.move(ev), up = ev => { this.end(ev); removeEventListener('pointermove', mv, true); removeEventListener('pointerup', up, true); removeEventListener('pointercancel', up, true); };
      addEventListener('pointermove', mv, true); addEventListener('pointerup', up, true); addEventListener('pointercancel', up, true);
    }, true);
    // fingers scroll the page; an Apple Pencil on blank space writes instead of scrolling (Safari reports touchType 'stylus')
    document.addEventListener('touchstart', e => {
      if (this.on || !this.enabled || !SET.penAnywhere) return; const t = e.touches[0]; if (!t || t.touchType !== 'stylus') return;
      if (e.target.closest('button,a,canvas,input,.ia,.mi,.pi,.opt,.ncard,.slot,.counter,.heart,.obj.tappable,.topbar,.bottombar,.modal-bg,.sheet')) return;
      e.preventDefault();
    }, { passive: false, capture: true });
    // swallow the click that follows a pen scribble so it doesn't advance the lesson
    document.addEventListener('click', e => { if (this.ours) return; if (Date.now() < (this.blockClickUntil || 0)) { e.stopPropagation(); e.preventDefault(); } }, true);
  },
  resize() {
    const d = devicePixelRatio || 1; this.c.width = innerWidth * d; this.c.height = innerHeight * d;
    this.c.style.width = innerWidth + 'px'; this.c.style.height = innerHeight + 'px'; this.x.setTransform(d, 0, 0, d, 0, 0); this.redraw();
  },
  start(e, passive) { this.cur = { pts: [{ x: e.clientX, y: e.clientY }], color: this.color, id: e.pointerId, moved: 0, passive, t0: performance.now() }; this.strokes.push(this.cur); this.drawSeg(this.cur); },
  move(e) {
    const s = this.cur; if (!s || e.pointerId !== s.id) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (evs.length ? evs : [e])) { const l = s.pts[s.pts.length - 1]; s.moved += Math.hypot(ev.clientX - l.x, ev.clientY - l.y); s.pts.push({ x: ev.clientX, y: ev.clientY }); if (!s.__scrub) this.drawSeg(s); }
    if (scrubLive(s, this.strokes) || s.__scrub) this.redraw(); /* v263: กำลังขีดลบ → รอยขีดเป็นสีเทาจาง เส้นที่จะถูกลบจางลง */
  },
  under(x, y) { this.c.style.pointerEvents = 'none'; const el = document.elementFromPoint(x, y); this.c.style.pointerEvents = ''; return el; },
  end(e) {
    const T = this.tapC; if (T && e.pointerId === T.id) { this.tapC = null;
      if (T.moved < 12 && Date.now() - T.t < 700 && e.type !== 'pointercancel') { // finger tap → act like a normal tap on the page
        const s = this.cur; if (s && s.id === e.pointerId) { this.cur = null; this.strokes.pop(); this.redraw(); }
        const el = this.under(T.x, T.y); if (!el) return;
        const o = { bubbles: true, cancelable: true, clientX: T.x, clientY: T.y, pointerId: 99, pointerType: 'touch', isPrimary: true };
      try { el.dispatchEvent(new PointerEvent('pointerdown', o)); el.dispatchEvent(new PointerEvent('pointerup', o)); } catch (_) {}
        this.ours = true; try { const b = el.closest('button, a, label'); if (b) b.click(); else el.dispatchEvent(new MouseEvent('click', o)); } finally { this.ours = false; } this.blockClickUntil = Date.now() + 500; return; } }
    const s = this.cur; if (!s || e.pointerId !== s.id) return; this.cur = null;
    if (s.passive && s.moved < 6) { this.strokes.pop(); this.redraw(); return; } if (s.passive) this.blockClickUntil = Date.now() + 400;
    const gone = e.type !== 'pointercancel' && scrubDo(s, this.strokes); /* v263: ขีดซ้ำเพื่อลบ */
    this.hist.push(gone ? { gone } : { add: s }); this.fwd = []; this.redraw();
  },
  /* v263: ย้อน / ทำซ้ำ (รวมการขีดลบและการล้าง) */
  undo() { const h = this.hist.pop(); if (!h) { this.strokes.pop(); this.redraw(); return; } if (h.add) { const i = this.strokes.lastIndexOf(h.add); if (i >= 0) this.strokes.splice(i, 1); } else if (h.gone) scrubBack(this.strokes, h.gone); else if (h.all) this.strokes = h.all.slice(); this.fwd.push(h); this.redraw(); },
  redo() { const h = this.fwd.pop(); if (!h) return; if (h.add) this.strokes.push(h.add); else if (h.gone) h.gone.slice().reverse().forEach(({ s }) => { const i = this.strokes.indexOf(s); if (i >= 0) this.strokes.splice(i, 1); }); else if (h.all) this.strokes = []; this.hist.push(h); this.redraw(); },
  drawSeg(s) {
    const x = this.x, p = s.pts, n = p.length; x.strokeStyle = s.color; x.fillStyle = s.color; x.lineWidth = 4; x.lineCap = 'round'; x.lineJoin = 'round';
    if (n === 1) { x.beginPath(); x.arc(p[0].x, p[0].y, 2, 0, 7); x.fill(); return; }
    x.beginPath(); x.moveTo(p[n - 2].x, p[n - 2].y); x.lineTo(p[n - 1].x, p[n - 1].y); x.stroke();
  },
  redraw() { this.x.clearRect(0, 0, innerWidth, innerHeight); for (const s of this.strokes) { const p = s.pts; this.x.globalAlpha = scrubAlpha(s, this.cur); this.x.strokeStyle = s.__scrub ? '#9A93B8' : s.color; this.x.lineWidth = 4; this.x.lineCap = 'round'; this.x.lineJoin = 'round'; this.x.beginPath(); p.forEach((q, i) => i ? this.x.lineTo(q.x, q.y) : this.x.moveTo(q.x, q.y)); this.x.stroke(); } this.x.globalAlpha = 1; },
  clear(undoable) { if (undoable && this.strokes.length) { this.hist.push({ all: this.strokes.slice() }); this.fwd = []; } else { this.hist = []; this.fwd = []; } this.strokes = []; this.cur = null; this.redraw(); },
  toggle(v = !this.on) { this.on = v; this.c.classList.toggle('on', v); this.tools.classList.toggle('on', v); const b = $('#btnScratch'); b && b.classList.toggle('on', v); if (v && this.barPos && this.placeBar) requestAnimationFrame(() => { this.barPos = this.placeBar(...this.barPos); }); },
  setEnabled(v) { this.enabled = v; if (!v) { this.toggle(false); this.clear(); } }
};

/* ---------------- free writing check (no guide) ----------------
   Arabic digits → recognizeNumber. Thai digits & Thai words → compare the
   child's ink with font-rendered templates of every candidate; the target
   must be the closest shape and close enough in absolute terms.          */
const GLYPH_PTS = {};
function glyphPoints(text, N = 110, font = "'IBM Plex Sans Thai Looped'") {
  const key = font + '|' + text; if (GLYPH_PTS[key]) return GLYPH_PTS[key];
  const W = 360, H = 200, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); const fs = (() => { x.font = `400 100px ${font}, Thonburi, sans-serif`; const m = x.measureText(text); const gh = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || 70; return Math.min(150 / gh, 330 / (m.width || 100)) * 100; })();
  x.font = `400 ${fs}px ${font}, Thonburi, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#000'; x.fillText(text, W / 2, H / 2);
  const d = x.getImageData(0, 0, W, H).data, P = [];
  for (let yy = 0; yy < H; yy += 2) for (let xx = 0; xx < W; xx += 2) if (d[(yy * W + xx) * 4 + 3] > 120) P.push([xx, yy]);
  const out = []; const step = Math.max(1, P.length / N); for (let k = 0; k < P.length && out.length < N; k += step) out.push(P[Math.floor(k)]);
  return (GLYPH_PTS[key] = normPts(out.length ? out : [[0, 0]]));
}
const TEMPLATE_FONTS = ["'IBM Plex Sans Thai Looped'", 'Mali'];
function freeScorePts(P, cands) { return cands.map(t => ({ t, s: Math.min(...TEMPLATE_FONTS.map(f => chamfer(P, glyphPoints(t, 110, f)))) })).sort((a, b) => a.s - b.s); }
const THAI_DIGIT_CANDS = [...TH_DIG.split(''), '๑๐'];
function freeWriteCheck(strokes, target, kind) {
  strokes = strokes.filter(s => s.pts && s.pts.length);
  if (!strokes.length) return { ok: false, empty: true };
  if (kind === 'digit') { const r = recognizeNumber(strokes, String(target).length > 1 && target !== '10' ? range(0, 99).map(String) : undefined); return { ok: !!r && r.value === String(target) && r.score < .2, read: r && r.value, score: r && r.score }; }
  const W10 = WORD.slice(0, 11), cands = kind === 'thai' ? (THAI_DIGIT_CANDS.includes(target) ? THAI_DIGIT_CANDS : range(0, 20).map(n => thai(n))) : (W10.includes(target) ? W10 : WORD.slice(0, 21));
  const ranked = freeScorePts(normPts(samplePts(strokes, 110)), cands);
  const tgt = ranked.find(r => r.t === target);
  const ok = tgt.s < .14 && (ranked[0].t === target || tgt.s <= ranked[0].s * 1.06);
  return { ok, read: ranked[0].t, score: tgt.s, ranked };
}
