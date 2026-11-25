/* =========================================================
   prefix r4 · ผู้ใช้ขอ "ให้เกมสนุก เพิ่มเกมใหม่ ๆ" → mini-games that are played, not just answered:
   - นักสืบรูปสี่เหลี่ยม (Q.r4Pick: แตะเลือกทุกรูปที่ใช่ แล้วตรวจ) · กระดานหมุด (Q.r4Geo: ลากหมุด 4 ตัวสร้างรูปตามสั่ง)
   - อูฐเดินรอบรูป (Q.r4Walk: แตะด้านทีละด้าน อูฐเดินตาม ผลรวมขึ้นสด · ด้านที่ไม่บอกความยาวต้องคิดเอง)
   - ล้อมรั้ว (Q.r4Fence: ลากมุมสร้างแปลงตามความยาวรอบรูป / พื้นที่ / ทั้งสองอย่าง — มีหลายคำตอบที่ถูก)
   - ปูกระเบื้อง (Q.r4Paint: ลากระบายให้ได้พื้นที่ตามสั่ง) · นับช่อง (Q.r4Count) · นับครึ่งช่อง (Q.r4Est)
   - ประลองแปลงผัก (Q.r4Duel) · ตัดรูป (Q.r4Cut: แตะเส้นตัด แบ่งเป็นสี่เหลี่ยมมุมฉาก) · ร้านปูพรม (โจทย์ราคาต่อตารางเมตร)
   ========================================================= */
const R4G = 30;                                                    // px per grid unit
const r4mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const r4len = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const r4pip = (p, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const r4areaU = P => Math.abs(P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const r4perU = P => P.reduce((s, p, i) => s + r4len(p, P[(i + 1) % P.length]), 0);
const r4f = n => fmt(n);
const R4N = ['ABCD', 'กขคง', 'PQRS', 'มยรล', 'WXYZ', 'สบลด', 'EFGH', 'ฝผหอ', 'KLMN', 'ตรลย'];
/* polygon in px → svg: fill, right-angle marks, side labels (outside), names */
function r4PolyS(P, o = {}) { let s = `<path d="M${P.map(p => p.map(a4n).join(' ')).join(' L')}Z" fill="${o.fill || '#FFE7A8'}" stroke="${o.stroke || '#2B2550'}" stroke-width="${o.sw || 3}" stroke-linejoin="round"${o.cls ? ` class="${o.cls}"` : ''}${o.data ? ` data-i="${o.data}"` : ''}/>`;
  const n = P.length;
  if (o.rm !== false) P.forEach((p, i) => { const a = P[(i + n - 1) % n], b = P[(i + 1) % n], ua = [(a[0] - p[0]) / r4len(a, p), (a[1] - p[1]) / r4len(a, p)], ub = [(b[0] - p[0]) / r4len(b, p), (b[1] - p[1]) / r4len(b, p)];
    if (Math.abs(ua[0] * ub[0] + ua[1] * ub[1]) > .02) return; const k = o.rmK || 11, c = [p[0] + (ua[0] + ub[0]) * k, p[1] + (ua[1] + ub[1]) * k]; if (!r4pip([p[0] + (ua[0] + ub[0]) * 3, p[1] + (ua[1] + ub[1]) * 3], P)) return;
    s += `<path d="M${a4n(p[0] + ua[0] * k)} ${a4n(p[1] + ua[1] * k)} L${a4n(c[0])} ${a4n(c[1])} L${a4n(p[0] + ub[0] * k)} ${a4n(p[1] + ub[1] * k)}" fill="none" stroke="#E5487A" stroke-width="1.8"/>`; });
  const boxes = [];
  (o.labs || []).forEach((t, i) => { if (t == null || t === '') return; const a = P[i], b = P[(i + 1) % n], m = r4mid(a, b), L = r4len(a, b); let nv = [(b[1] - a[1]) / L, -(a[0] - b[0]) / L]; if (r4pip([m[0] + nv[0] * 6, m[1] + nv[1] * 6], P)) nv = [-nv[0], -nv[1]];
    const vert = Math.abs(b[0] - a[0]) < 1, tw = String(t).length * 7.4 + 4, tv = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], sh = Math.min(L / 2 - 4, 22);
    const cands = [[nv, 15, 0], [nv, 15, sh], [nv, 15, -sh], [[-nv[0], -nv[1]], 15, 0], [nv, 28, 0], [nv, 15, sh * 2], [nv, 15, -sh * 2]]; let q, bx, anc;
    for (const [v, d, sft] of cands) { q = [m[0] + v[0] * d + tv[0] * sft, m[1] + v[1] * d + tv[1] * sft]; anc = vert ? (v[0] > 0 ? 'start' : 'end') : 'middle'; const x1 = anc === 'start' ? q[0] : anc === 'end' ? q[0] - tw : q[0] - tw / 2; bx = [x1, q[1] - 9, x1 + tw, q[1] + 9]; if (!boxes.some(B => bx[0] < B[2] && bx[2] > B[0] && bx[1] < B[3] && bx[3] > B[1])) break; }
    boxes.push(bx); s += `<text x="${a4n(q[0])}" y="${a4n(q[1]) + 5}" class="r4-lab${t === '?' ? ' q' : ''}" text-anchor="${anc}">${t}</text>`; });
  if (o.names) { const cx = P.reduce((a, p) => a + p[0], 0) / n, cy = P.reduce((a, p) => a + p[1], 0) / n; [...o.names].forEach((nm, i) => { const p = P[i], d = [p[0] - cx, p[1] - cy], L = Math.hypot(...d) || 1, q = [p[0] + d[0] / L * 15, p[1] + d[1] / L * 15]; s += `<text x="${a4n(q[0])}" y="${a4n(q[1]) + 6}" class="r4-nm" text-anchor="middle">${nm}</text>`; }); }
  return s; }
/* fit a polygon given in units into a W×H box */
function r4Fit(U, W = 340, H = 220, pad = 46) { const xs = U.map(p => p[0]), ys = U.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys), k = Math.min((W - 2 * pad) / w, (H - 2 * pad) / h), ox = (W - w * k) / 2 - Math.min(...xs) * k, oy = (H - h * k) / 2 - Math.min(...ys) * k; return { P: U.map(([x, y]) => [ox + x * k, oy + y * k]), k, ox, oy }; }
const r4svg = (W, H, inner, cls = '') => `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="r4-svg ${cls}">${inner}</svg>`;
/* rectangle with real numbers (drawn with a readable shape) */
function r4Rect(w, h, o = {}) { const W = o.W || 340, H = o.H || 210, r = Math.max(.32, Math.min(1, h / w)), bw = r < 1 ? 230 : 160, bh = r < 1 ? Math.max(70, bw * r) : 160, x = (W - bw) / 2, y = (H - bh) / 2;
  const P = [[x, y], [x + bw, y], [x + bw, y + bh], [x, y + bh]], u = o.unit ? ' ' + o.unit : '', L = o.labs || [r4f(w) + u, o.all ? r4f(h) + u : '', o.all ? r4f(w) + u : '', r4f(h) + u];
  if (o.sq) L.splice(0, 4, o.labs ? o.labs[0] : r4f(w) + u, '', '', '');
  let s = r4PolyS(P, { labs: L, names: o.names, fill: o.fill, cls: o.cls });
  if (o.diag) s += `<path d="M${P[0].join(' ')} L${P[2].join(' ')} M${P[1].join(' ')} L${P[3].join(' ')}" stroke="#3C8DDB" stroke-width="2.4" stroke-dasharray="${o.diag === 'dash' ? '6 5' : ''}"/>`;
  return r4svg(W, H, s + (o.extra || '')); }
/* a grid of unit cells */
const r4gridS = (x0, y0, n, m, g = R4G, col = '#DCD6EC') => { let s = `<g class="r4-grid">`; for (let i = 0; i <= n; i++) s += `<path d="M${x0 + i * g} ${y0} V${y0 + m * g}" stroke="${col}" stroke-width="1"/>`; for (let j = 0; j <= m; j++) s += `<path d="M${x0} ${y0 + j * g} H${x0 + n * g}" stroke="${col}" stroke-width="1"/>`; return s + '</g>'; };
const r4dots = (x0, y0, n, m, g = R4G) => { let s = ''; for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) s += `<circle cx="${x0 + i * g}" cy="${y0 + j * g}" r="2.6" fill="#B7AED3"/>`; return s; };
/* rectilinear shapes in grid units (clockwise from top-left) */
const R4SH = {
  L: (W, H, a, b) => [[0, 0], [W - a, 0], [W - a, b], [W, b], [W, H], [0, H]],
  J: (W, H, a, b) => [[0, 0], [W, 0], [W, H], [a, H], [a, H - b], [0, H - b]],
  U: (W, H, a, b, c) => [[0, 0], [c, 0], [c, b], [c + a, b], [c + a, 0], [W, 0], [W, H], [0, H]],
  T: (W, H, a, b, c) => [[0, 0], [W, 0], [W, b], [c + a, b], [c + a, H], [c, H], [c, b], [0, b]],
  S: (W, H, a, b) => [[0, 0], [W - a, 0], [W - a, b], [W, b], [W, H], [a, H], [a, H - b], [0, H - b]]
};
const r4shape = (k, W, H, a, b, c) => R4SH[k](W, H, a, b, c);
/* split a rectilinear shape (unit coords) along cut segments → pieces drawn apart a little, so the cut looks real */
function r4Pieces(U, cuts) { const xs = U.map(p => p[0]), ys = U.map(p => p[1]), X0 = Math.min(...xs), Y0 = Math.min(...ys), X1 = Math.max(...xs), Y1 = Math.max(...ys);
  const inside = new Set(); for (let x = X0; x < X1; x++) for (let y = Y0; y < Y1; y++) if (r4pip([x + .5, y + .5], U)) inside.add(x + ',' + y);
  const blockV = (X, y) => cuts.some(([p, q]) => p[0] === X && q[0] === X && Math.min(p[1], q[1]) <= y && Math.max(p[1], q[1]) >= y + 1);
  const blockH = (Y, x) => cuts.some(([p, q]) => p[1] === Y && q[1] === Y && Math.min(p[0], q[0]) <= x && Math.max(p[0], q[0]) >= x + 1);
  const seen = new Set(), comps = [];
  inside.forEach(k0 => { if (seen.has(k0)) return; const comp = [], st = [k0]; seen.add(k0);
    while (st.length) { const k = st.pop(), [x, y] = k.split(',').map(Number); comp.push([x, y]);
      [[1, 0, !blockV(x + 1, y)], [-1, 0, !blockV(x, y)], [0, 1, !blockH(y + 1, x)], [0, -1, !blockH(y, x)]].forEach(([dx, dy, ok]) => { const n = (x + dx) + ',' + (y + dy); if (ok && inside.has(n) && !seen.has(n)) { seen.add(n); st.push(n); } }); }
    comps.push(comp); });
  return comps; }
function r4PiecesSVG(U, comps, mp, k, o = {}) { const cols = o.cols || ['#FFD27A', '#BFE3F7', '#C9F0D9', '#F9D3E0'], gap = o.gap ?? 10, A = r4areaU(U);
  const cx = U.reduce((s, p) => s + p[0], 0) / U.length, cy = U.reduce((s, p) => s + p[1], 0) / U.length;
  return comps.map((cells, i) => { const set = new Set(cells.map(c => c.join(','))), mx = cells.reduce((s, c) => s + c[0] + .5, 0) / cells.length, my = cells.reduce((s, c) => s + c[1] + .5, 0) / cells.length;
    let dx = mx - cx, dy = my - cy; const L = Math.hypot(dx, dy) || 1; dx = dx / L * gap; dy = dy / L * gap;
    let fill = '', edge = ''; cells.forEach(([x, y]) => { const a = mp([x, y]); fill += `M${a4n(a[0])} ${a4n(a[1])}h${a4n(k)}v${a4n(k)}h${a4n(-k)}Z`;
      if (!set.has(x + ',' + (y - 1))) { const b = mp([x, y]); edge += `M${a4n(b[0])} ${a4n(b[1])}h${a4n(k)}`; } if (!set.has(x + ',' + (y + 1))) { const b = mp([x, y + 1]); edge += `M${a4n(b[0])} ${a4n(b[1])}h${a4n(k)}`; }
      if (!set.has((x - 1) + ',' + y)) { const b = mp([x, y]); edge += `M${a4n(b[0])} ${a4n(b[1])}v${a4n(k)}`; } if (!set.has((x + 1) + ',' + y)) { const b = mp([x + 1, y]); edge += `M${a4n(b[0])} ${a4n(b[1])}v${a4n(k)}`; } });
    return `<g class="r4-piece${o.still || !gap ? ' r4-still' : ''}" style="--dx:${a4n(dx)}px;--dy:${a4n(dy)}px;animation-delay:${i * 80}ms"><path d="${fill}" fill="${cols[i % cols.length]}" stroke="${cols[i % cols.length]}" stroke-width=".6"/><path d="${edge}" fill="none" stroke="#2B2550" stroke-width="2.6" stroke-linecap="square"/></g>`; }).join(''); }

const r4rnd = () => { for (;;) { const k = pick(['L', 'J', 'U', 'T', 'S']), W = rnd(4, 8), H = rnd(3, 6), a = rnd(1, W - 2), b = rnd(1, H - 1), c = rnd(1, Math.max(1, W - a - 1)); if ((k === 'U' || k === 'T') && c + a >= W) continue; if (k === 'S' && (2 * a >= W || 2 * b >= H)) continue; return { k, P: r4shape(k, W, H, a, b, c) }; } };
/* ---------- fun pictures ---------- */
const r4camel = () => `<g class="r4-walker"><ellipse cx="0" cy="-7" rx="11" ry="7" fill="#D9A55B" stroke="#8A5A1E" stroke-width="1.4"/><circle cx="-2" cy="-14" r="5" fill="#D9A55B" stroke="#8A5A1E" stroke-width="1.4"/><circle cx="10" cy="-12" r="4" fill="#D9A55B" stroke="#8A5A1E" stroke-width="1.4"/><circle cx="11.5" cy="-13" r="1" fill="#2B2550"/><path d="M-7 -1 v6 M-2 -1 v6 M4 -1 v6 M8 -1 v6" stroke="#8A5A1E" stroke-width="2"/></g>`;
const r4grass = (x, y, w, h, id) => `<defs><pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#A8DC8E"/><path d="M3 11 l2 -5 l2 5 M9 7 l1.5 -4 l1.5 4" stroke="#5FA845" stroke-width="1.3" fill="none"/></pattern></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})" stroke="#4E8A3A" stroke-width="2.5"/>`;

/* =========================================================
   TEACHING HELPERS (v249: หน้าสอนแบบ ม.ต้น และ sim ใหม่อยู่ใน p4rm.js)
   ========================================================= */
function r4EstShape(seed) { // cells: [x, y, kind] kind 'f' full · 'h' half-triangle (corner tri) with dir
  const S = [
    { W: 7, H: 5, cells: [[1, 0, 'h', 3], [2, 0, 'f'], [3, 0, 'f'], [4, 0, 'h', 0], [0, 1, 'h', 3], [1, 1, 'f'], [2, 1, 'f'], [3, 1, 'f'], [4, 1, 'f'], [5, 1, 'h', 0], [0, 2, 'f'], [1, 2, 'f'], [2, 2, 'f'], [3, 2, 'f'], [4, 2, 'f'], [5, 2, 'f'], [0, 3, 'h', 2], [1, 3, 'f'], [2, 3, 'f'], [3, 3, 'f'], [4, 3, 'f'], [5, 3, 'h', 1], [1, 4, 'h', 2], [2, 4, 'f'], [3, 4, 'f'], [4, 4, 'h', 1]] },
    { W: 6, H: 5, cells: [[2, 0, 'h', 3], [3, 0, 'h', 0], [1, 1, 'h', 3], [2, 1, 'f'], [3, 1, 'f'], [4, 1, 'h', 0], [0, 2, 'h', 3], [1, 2, 'f'], [2, 2, 'f'], [3, 2, 'f'], [4, 2, 'f'], [5, 2, 'h', 0], [0, 3, 'h', 2], [1, 3, 'f'], [2, 3, 'f'], [3, 3, 'f'], [4, 3, 'f'], [5, 3, 'h', 1], [1, 4, 'h', 2], [2, 4, 'f'], [3, 4, 'f'], [4, 4, 'h', 1]] },
    { W: 7, H: 4, cells: [[0, 0, 'h', 3], [1, 0, 'f'], [2, 0, 'f'], [3, 0, 'f'], [4, 0, 'f'], [5, 0, 'f'], [6, 0, 'h', 0], [0, 1, 'f'], [1, 1, 'f'], [2, 1, 'f'], [3, 1, 'f'], [4, 1, 'f'], [5, 1, 'f'], [6, 1, 'f'], [0, 2, 'h', 2], [1, 2, 'f'], [2, 2, 'f'], [3, 2, 'f'], [4, 2, 'f'], [5, 2, 'f'], [6, 2, 'h', 1], [1, 3, 'h', 2], [2, 3, 'f'], [3, 3, 'h', 1]] },
    { W: 5, H: 5, cells: [[1, 0, 'h', 3], [2, 0, 'f'], [3, 0, 'h', 0], [0, 1, 'h', 3], [1, 1, 'f'], [2, 1, 'f'], [3, 1, 'f'], [4, 1, 'h', 0], [0, 2, 'f'], [1, 2, 'f'], [2, 2, 'f'], [3, 2, 'f'], [4, 2, 'f'], [0, 3, 'h', 2], [1, 3, 'f'], [2, 3, 'f'], [3, 3, 'f'], [4, 3, 'h', 1], [1, 4, 'h', 2], [2, 4, 'f'], [3, 4, 'h', 1]] },
    { W: 6, H: 4, cells: [[0, 0, 'f'], [1, 0, 'f'], [2, 0, 'h', 0], [0, 1, 'f'], [1, 1, 'f'], [2, 1, 'f'], [3, 1, 'h', 0], [0, 2, 'f'], [1, 2, 'f'], [2, 2, 'f'], [3, 2, 'f'], [4, 2, 'h', 0], [0, 3, 'f'], [1, 3, 'f'], [2, 3, 'f'], [3, 3, 'f'], [4, 3, 'f'], [5, 3, 'h', 0]] },
    { W: 6, H: 4, cells: [[1, 0, 'h', 3], [2, 0, 'f'], [3, 0, 'f'], [4, 0, 'h', 0], [0, 1, 'h', 3], [1, 1, 'f'], [2, 1, 'f'], [3, 1, 'f'], [4, 1, 'f'], [5, 1, 'h', 0], [0, 2, 'f'], [1, 2, 'f'], [2, 2, 'f'], [3, 2, 'f'], [4, 2, 'f'], [5, 2, 'f'], [0, 3, 'f'], [1, 3, 'f'], [2, 3, 'f'], [3, 3, 'f'], [4, 3, 'f'], [5, 3, 'f']] }];
  return S[seed % S.length]; }
/* a rectangle with 45° corners cut off (sizes c = [tl, tr, br, bl]) → full cells + exact half cells */
function r4EstMake(W, H, c) { const [a, b, d, e] = c, P = [[a, 0], [W - b, 0], [W, b], [W, H - d], [W - d, H], [e, H], [0, H - e], [0, a]], cells = [];
  const inP = (x, y) => r4pip([x, y], P);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const q = (u, v) => inP(x + u, y + v), t = q(.5, .2), r = q(.8, .5), b2 = q(.5, .8), l = q(.2, .5), n = [t, r, b2, l].filter(Boolean).length;
    if (n === 4) cells.push([x, y, 'f']); else if (n === 2) cells.push([x, y, 'h', r && b2 ? 3 : t && l ? 1 : b2 && l ? 0 : 2]); }
  return { W, H, cells }; }
const r4EstGen = () => { for (;;) { const W = rnd(4, 7), H = rnd(3, 5), c = [0, 0, 0, 0].map(() => rnd(0, 2)); if (c.filter(Boolean).length < 2 || c.reduce((x, y) => x + y, 0) % 2) continue; if (c[0] + c[1] > W || c[2] + c[3] > W || c[0] + c[3] > H || c[1] + c[2] > H) continue; return { W, H, c }; } };
const r4estVal = S => { const f = S.cells.filter(c => c[2] === 'f').length, hf = S.cells.filter(c => c[2] === 'h').length; return { f, hf, v: f + hf / 2 }; };
/* half triangles: dir 0 = bottom-left half (top-right edge of a shape) · 1 = top-left half · 2 = top-right half · 3 = bottom-right half */
const r4triPts = (x, y, g, d) => { const A = [x, y], B = [x + g, y], C = [x + g, y + g], D = [x, y + g]; return [[A, C, D], [A, B, D], [A, B, C], [D, B, C]][d]; };
function r4EstSVG(S, marks = {}, o = {}) { const g = o.g || 32, x0 = 24, y0 = 20; let s = r4gridS(x0, y0, S.W, S.H, g);
  S.cells.forEach(([x, y, k, d], i) => { const X = x0 + x * g, Y = y0 + y * g, col = marks[i] ? (k === 'f' ? '#7FCF9E' : '#FFD27A') : '#9FD0F0';
    s += k === 'f' ? `<rect x="${X}" y="${Y}" width="${g}" height="${g}" fill="${col}" stroke="#4C83B8" stroke-width=".8" class="r4-ec" data-i="${i}"/>` : `<path d="M${r4triPts(X, Y, g, d).map(p => p.join(' ')).join(' L')}Z" fill="${col}" stroke="#4C83B8" stroke-width=".8" class="r4-ec" data-i="${i}"/><rect x="${X}" y="${Y}" width="${g}" height="${g}" fill="transparent" class="r4-ec" data-i="${i}"/>`;
    if (marks[i]) s += `<text x="${X + g / 2}" y="${Y + g / 2 + 5}" class="r4-mk" text-anchor="middle">${k === 'f' ? '1' : '½'}</text>`; });
  return r4svg(x0 * 2 + S.W * g, y0 * 2 + S.H * g, s); }

/* =========================================================
   QUESTION TYPES / MINI-GAMES
   ========================================================= */
const r4fig = svg => `<div class="r4-fig">${svg}</div>`;
const r4Pk = (o, sig) => ({ ...Q.p4Pick(o), __sig: sig });
/* quadrilateral kinds in a 70×70 cell, with right-angle marks only where the angle is 90° */
const R4Q = { rect: () => [[0, 12], [70, 12], [70, 52], [0, 52]], sq: () => [[10, 6], [62, 6], [62, 58], [10, 58]], para: () => [[16, 12], [72, 12], [56, 54], [0, 54]], trap: () => [[18, 10], [54, 10], [72, 56], [0, 56]], rtrap: () => [[0, 8], [44, 8], [72, 56], [0, 56]], rhom: () => [[36, 0], [59, 33], [36, 66], [13, 33]], kite: () => [[36, 0], [62, 22], [36, 66], [10, 22]], trect: () => { const c = [36, 32], a = 18 * Math.PI / 180, w = 30, hh = 17; return [[-w, -hh], [w, -hh], [w, hh], [-w, hh]].map(([x, y]) => [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)]); }, tsq: () => [[36, 2], [68, 34], [36, 66], [4, 34]] };
const R4QR = { rect: 1, sq: 1, trect: 1, tsq: 1 };
/* classify a quadrilateral by its geometry (answers never depend on hand-typed keys) */
const r4Class = P => { const n = P.length, L = P.map((p, i) => r4len(p, P[(i + 1) % n])), right = P.every((p, i) => { const a = P[(i + n - 1) % n], b = P[(i + 1) % n]; return Math.abs((a[0] - p[0]) * (b[0] - p[0]) + (a[1] - p[1]) * (b[1] - p[1])) / (r4len(a, p) * r4len(b, p)) < .02; });
  const eq = Math.max(...L) / Math.min(...L) < 1.03; return right ? (eq ? 'sq' : 'rect') : eq ? 'rhom' : 'other'; };
Object.assign(Q, {
  /* นักสืบรูปสี่เหลี่ยม: tap every shape that fits, then check */
  r4Pick({ ks, want }) { const isW = k => { const c = r4Class(R4Q[k]()); return want === 'sq' ? c === 'sq' : c === 'sq' || c === 'rect'; }, cols = ['#FFC24C', '#6FB2F5', '#4FD1A1', '#FF7B86', '#B9A6F5', '#7FD3E6'];
    const me = { prompt: `แตะเลือก<span class="hl">${want === 'sq' ? 'รูปสี่เหลี่ยมจัตุรัส' : 'รูปสี่เหลี่ยมมุมฉาก'}</span>ให้ครบทุกรูป แล้วกดตรวจ`, say: `แตะเลือก${want === 'sq' ? 'รูปสี่เหลี่ยมจัตุรัส' : 'รูปสี่เหลี่ยมมุมฉาก'}ให้ครบทุกรูป`, __sig: `r4p ${want} ${ks.join()}`, mount(bd, ctx) {
      const sel = new Set(), fig = h('div', { class: 'r4-board ia rvl' }); let done = false;
      const draw = (rev) => { let s = ''; ks.forEach((k, i) => { const ox = 14 + (i % 3) * 112, oy = 14 + Math.floor(i / 3) * 100, P = R4Q[k]().map(([x, y]) => [ox + x * 1.12, oy + y * 1.12]);
        s += `<g class="r4-sh${sel.has(i) ? ' on' : ''}${rev && isW(k) ? ' ok' : ''}" data-i="${i}">` + `<rect x="${ox - 8}" y="${oy - 8}" width="100" height="88" rx="12" class="r4-shbg"/>` + r4PolyS(P, { fill: cols[i % 6], sw: 2.4, rmK: 8 }) + '</g>'; });
        fig.innerHTML = r4svg(352, 214, s); };
      fig.addEventListener('click', e => { e.stopPropagation(); if (done) return; const g = e.target.closest('.r4-sh'); if (!g) return; const i = +g.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); sfx.tap(); draw(); });
      const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (done) return; const good = ks.every((k, i) => isW(k) === sel.has(i)); if (good) { done = true; draw(true); ctx.check(true); } else ctx.check(false, want === 'sq' ? 'รูปจัตุรัส: มุมฉากทั้ง 4 มุม และด้านยาวเท่ากันทุกด้าน (รูปที่หมุนเอียงก็ยังเป็นรูปจัตุรัส)' : 'รูปสี่เหลี่ยมมุมฉากต้องมีเครื่องหมายมุมฉาก (สีชมพู) ครบทั้ง 4 มุม'); } }, icon('check'), 'ตรวจ');
      fig.reveal = () => { done = true; draw(true); }; draw(); bd.append(h('div', { class: 't6-q p4-q' }, fig, chk)); } };
    return me; },
  /* what kind + why */
  r4Kind({ k, nm, w, hh }) { const shapes = { sq: [[0, 0], [w, 0], [w, w], [0, w]], rect: [[0, 0], [w, 0], [w, hh], [0, hh]], para: [[1.2, 0], [w + 1.2, 0], [w, hh], [0, hh]] }, P = r4Fit(shapes[k], 340, 210, 50).P;
    const L = k === 'sq' ? [w, w, w, w] : k === 'rect' ? [w, hh, w, hh] : [w, '', w, ''], u = ' ซม.';
    const O = { sq: 'รูปสี่เหลี่ยมจัตุรัส เพราะมีมุมฉาก 4 มุม และด้านยาวเท่ากันทุกด้าน', rect: 'รูปสี่เหลี่ยมผืนผ้า เพราะมีมุมฉาก 4 มุม ด้านตรงข้ามยาวเท่ากัน', para: 'ไม่ใช่รูปสี่เหลี่ยมมุมฉาก เพราะมีมุมที่ไม่ใช่มุมฉาก', rect2: 'รูปสี่เหลี่ยมจัตุรัส เพราะด้านตรงข้ามยาวเท่ากัน' };
    return r4Pk({ fig: r4fig(r4svg(340, 210, r4PolyS(P, { names: nm, labs: L.map(x => x === '' ? '' : x + u) }))), q: `รูป ${nm} เป็นรูปสี่เหลี่ยมชนิดใด เพราะอะไร`, say: `รูป ${[...nm].join(' ')} เป็นรูปสี่เหลี่ยมชนิดใด`, opts: shuffle([O[k], ...['sq', 'rect', 'para'].filter(x => x !== k).map(x => O[x])]), right: O[k], hint: 'ดูเครื่องหมายมุมฉากทั้ง 4 มุม แล้วดูความยาวด้าน' }, `r4k ${k} ${nm} ${w} ${hh}`); },
  /* tap the diagonals */
  r4TapDiag({ k, nm }) { const shp = { rect: [[0, 0], [7, 0], [7, 4], [0, 4]], sq: [[0, 0], [5, 0], [5, 5], [0, 5]], para: [[2, 0], [8, 0], [6, 4], [0, 4]], trap: [[2, 0], [6, 0], [8, 4], [0, 4]], kite: [[3, 0], [6, 2], [3, 6], [0, 2]] }, P = r4Fit(shp[k], 340, 220, 40).P;
    const segs = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
    const me = { prompt: `แตะ<span class="hl">เส้นทแยงมุม</span>ของรูป ${nm} ให้ครบทุกเส้น`, say: `แตะเส้นทแยงมุมของรูป ${[...nm].join(' ')} ให้ครบทุกเส้น`, __sig: `r4d ${k} ${nm}`, mount(bd, ctx) { const got = new Set(); const fig = h('div', { class: 'r4-board ia rvl' });
      const draw = () => { let s = r4PolyS(P, { names: nm, fill: '#FFF1CC', rm: false }); segs.forEach(([a, b], i) => { const on = got.has(i); s += `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${on ? '#1B8862' : '#2B2550'}" stroke-width="${on ? 5 : 3}"/><line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="transparent" stroke-width="20" class="r4-seg" data-i="${i}"/>`; }); fig.innerHTML = r4svg(340, 220, s); };
      fig.addEventListener('click', e => { e.stopPropagation(); const t = e.target.closest('.r4-seg'); if (!t || fig.dataset.done) return; const i = +t.dataset.i; if (i < 4) return ctx.check(false, 'ด้านของรูปไม่ใช่เส้นทแยงมุม · เส้นทแยงมุมเชื่อมจุดยอดที่ไม่อยู่ติดกัน'); got.add(i); sfx.pop(got.size); draw(); if (got.size === 2) { fig.dataset.done = 1; ctx.check(true); } });
      fig.reveal = () => { got.add(4); got.add(5); fig.dataset.done = 1; draw(); }; draw(); bd.append(h('div', { class: 't6-q p4-q' }, fig)); } };
    return me; },
  /* สร้างเส้นทแยงมุม: tap a vertex, then the vertex that is not next to it */
  r4DrawDiag({ k, nm }) { const shp = { rect: [[0, 0], [7, 0], [7, 4], [0, 4]], sq: [[0, 0], [5, 0], [5, 5], [0, 5]], para: [[2, 0], [8, 0], [6, 4], [0, 4]], trap: [[2, 0], [6, 0], [8, 4], [0, 4]], kite: [[3, 0], [6, 2], [3, 6], [0, 2]] }, P = r4Fit(shp[k], 340, 220, 40).P;
    const me = { prompt: `สร้าง<span class="hl">เส้นทแยงมุม</span>ของรูป ${nm} ให้ครบ <small>(แตะจุดยอด แล้วแตะจุดยอดที่ไม่อยู่ติดกัน)</small>`, say: `สร้างเส้นทแยงมุมของรูป ${[...nm].join(' ')} ให้ครบ`, __sig: `r4dd ${k} ${nm}`, mount(bd, ctx) {
      const got = new Set(); let sel = -1, bad = null, done = false; const fig = h('div', { class: 'r4-board ia rvl' }), info = h('div', { class: 'p4steplab' }, 'แตะจุดยอดจุดแรก');
      const draw = () => { let s = r4PolyS(P, { names: nm, fill: '#FFF1CC', rm: false });
        [...got].forEach(i => { const [a, b] = i === 0 ? [0, 2] : [1, 3]; s += `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${i === 0 ? '#3C8DDB' : '#1B8862'}" stroke-width="4" stroke-linecap="round" class="r4-dnew"/>`; });
        if (bad) s += `<line x1="${P[bad[0]][0]}" y1="${P[bad[0]][1]}" x2="${P[bad[1]][0]}" y2="${P[bad[1]][1]}" stroke="#E5487A" stroke-width="5" stroke-dasharray="6 5"/>`;
        if (got.size === 2 && (k === 'rect' || k === 'sq')) { const O = r4mid(P[0], P[2]); s += `<circle cx="${O[0]}" cy="${O[1]}" r="4.5" fill="#E5487A"/>`; }
        if (!done) P.forEach((p, i) => s += `<circle class="r4-vt${i === sel ? ' on' : ''}" data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="${i === sel ? 15 : 13}" fill="${i === sel ? 'rgba(229,72,122,.45)' : 'rgba(229,72,122,.16)'}" stroke="#E5487A" stroke-width="2"/>`);
        fig.innerHTML = r4svg(340, 220, s); };
      fig.addEventListener('click', e => { e.stopPropagation(); if (done) return; const c = e.target.closest('.r4-vt'); if (!c) return; const i = +c.dataset.i; bad = null;
        if (sel < 0 || sel === i) { sel = sel === i ? -1 : i; sfx.tap(); info.textContent = sel < 0 ? 'แตะจุดยอดจุดแรก' : `เริ่มที่จุด ${[...nm][sel]} → แตะจุดยอดที่ไม่อยู่ติดกัน`; return draw(); }
        const a = sel, b = i; sel = -1;
        if ((a + 2) % 4 !== b) { bad = [a, b]; draw(); info.textContent = `${[...nm][a]}${[...nm][b]} เป็นด้านของรูป`; return ctx.check(false, 'ด้านของรูปไม่ใช่เส้นทแยงมุม · เส้นทแยงมุมเชื่อมจุดยอดที่ไม่อยู่ติดกัน'); }
        const d = Math.min(a, b) % 2; if (got.has(d)) { info.textContent = 'เส้นนี้ลากแล้ว ลองอีกเส้น'; return draw(); }
        got.add(d); sfx.pop(got.size + 2); info.innerHTML = `ลาก <b>${[...nm][a]}${[...nm][b]}</b> แล้ว` + (got.size < 2 ? ' · ยังมีอีก 1 เส้น' : '');
        if (got.size === 2) { done = true; info.innerHTML = `เส้นทแยงมุม คือ <b>${nm[0]}${nm[2]}</b> และ <b>${nm[1]}${nm[3]}</b>`; draw(); ctx.check(true); } else draw(); });
      fig.reveal = () => { got.add(0); got.add(1); done = true; draw(); }; draw(); bd.append(h('div', { class: 't6-q p4-q' }, fig, info)); } };
    return me; },
  /* facts about the diagonals of a rectangle */
  r4DiagNum({ nm, d, ask }) { const [A, B, C, D] = [...nm], P = [[60, 40], [280, 40], [280, 170], [60, 170]], O = [170, 105];
    let s = r4PolyS(P, { names: nm, fill: '#FFF1CC' }) + `<path d="M60 40 L280 170 M280 40 L60 170" stroke="#3C8DDB" stroke-width="2.6"/><circle cx="170" cy="105" r="4" fill="#E5487A"/><text x="170" y="96" class="r4-nm" text-anchor="middle">O</text>`;
    let q, ans; if (ask === 'other') { s += `<text x="118" y="93" class="r4-lab">${d} ซม.</text>`; q = `${A}${C} ยาว ${d} ซม. · ${B}${D} ยาวกี่เซนติเมตร`; ans = d; }
    else if (ask === 'half') { q = `${A}${C} ยาว ${d} ซม. · ${A}O ยาวกี่เซนติเมตร`; ans = d / 2; }
    else { q = `${B}O ยาว ${d / 2} ซม. · ${A}${C} ยาวกี่เซนติเมตร`; ans = d; }
    const me = { prompt: `${nm} เป็นรูปสี่เหลี่ยมผืนผ้า · ${q}`, say: `${q}`, __sig: `r4n ${nm} ${d} ${ask}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: r4svg(340, 210, s) }), h('div', { class: 'rowstack' }, answerBox(ctx, String(ans), { hint: 'เส้นทแยงมุมของรูปสี่เหลี่ยมผืนผ้ายาวเท่ากัน และแบ่งครึ่งซึ่งกันและกัน' }), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'ซม.')))); } };
    return me; },
  /* กระดานหมุด: drag 4 pegs to make a rectangle / square of given sides */
  /* build a square / rectangle FROM SCRATCH on a peg board (ผู้ใช้ขอ): tap (or drag) peg → peg to draw each side, close back at the start, then ตรวจ */
  r4Build({ kind, w, hh, nm }) { const N = 10, M = 7, g = 34, x0 = 22, y0 = 22, want = kind === 'sq' ? [w, w] : [w, hh], H2 = kind === 'sq' ? w : hh;
    const goal = kind === 'sq' ? `รูปสี่เหลี่ยมจัตุรัส ${nm} ยาวด้านละ ${w} หน่วย` : `รูปสี่เหลี่ยมผืนผ้า ${nm} กว้าง ${hh} หน่วย ยาว ${w} หน่วย`;
    const me = { prompt: `สร้าง${goal} บนกระดานหมุด`, say: `สร้าง${goal} บนกระดานหมุด เริ่มจากด้านแรก แล้วสร้างด้านที่ตั้งฉาก`, __sig: `r4n ${kind} ${w} ${H2}`, __diff: 10 + w + H2 / 2 + (kind === 'rect' ? 2 : 0),
      mount(bd, ctx) { let P = [], closed = false, done = false, rub = null, from = -1; const fig = h('div', { class: 'r4-board ia rvl r4-build' }), info = h('div', { class: 'p4steplab' });
        const px = q => [x0 + q[0] * g, y0 + q[1] * g], same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
        const near = p => { const q = [Math.round((p[0] - x0) / g), Math.round((p[1] - y0) / g)]; if (q[0] < 0 || q[0] > N || q[1] < 0 || q[1] > M) return null; return Math.hypot(p[0] - x0 - q[0] * g, p[1] - y0 - q[1] * g) <= g * .48 ? q : null; };
        const len = (a, b) => { const L = Math.hypot(a[0] - b[0], a[1] - b[1]); return Math.abs(L - Math.round(L)) < 1e-9 ? Math.round(L) : null; };
        const perp = (a, b, c) => (a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1]) === 0;
        const step = () => { const n = P.length; if (closed) return 'ปิดรูปแล้ว — กด <b>ตรวจ</b>';
          if (!n) return `① แตะหมุดจุดเริ่ม แล้วแตะ (หรือลาก) ไปอีกหมุด สร้าง<b>ด้านแรกยาว ${w} หน่วย</b>`;
          if (n === 1) return `① แตะ (หรือลาก) ไปอีกหมุด ให้ด้านแรกยาว <b>${w} หน่วย</b>`;
          if (n === 2) return `② สร้าง<b>ด้านที่ตั้งฉาก</b> ยาว <b>${H2} หน่วย</b>`;
          if (n === 3) return '③ สร้างด้านที่ 3 ให้ขนานและยาวเท่าด้านแรก';
          return '④ แตะหมุดจุดเริ่ม เพื่อ<b>ลากปิดรูป</b>'; };
        const draw = () => { const Q = P.map(px); let s = r4dots(x0, y0, N, M, g);
          if (closed) s += r4PolyS(Q, { fill: done ? 'rgba(79,209,161,.35)' : 'rgba(255,194,76,.45)', names: done ? nm : undefined, labs: P.map((p, i) => { const L = len(p, P[(i + 1) % P.length]); return L ? String(L) : ''; }) });
          else { if (Q.length > 1) s += `<path d="M${Q.map(q => q.join(' ')).join(' L')}" fill="none" stroke="#2B2550" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
            for (let i = 1; i < P.length; i++) { const L = len(P[i - 1], P[i]); if (L) { const a = Q[i - 1], b = Q[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (a[1] - b[1]) / d, ny = (b[0] - a[0]) / d; s += `<text x="${(a[0] + b[0]) / 2 + nx * 14}" y="${(a[1] + b[1]) / 2 + ny * 14 + 5}" text-anchor="middle" font-size="15" font-weight="800" fill="#3C6FD8">${L}</text>`; } }
            for (let i = 1; i < P.length - 1; i++) if (perp(P[i - 1], P[i], P[i + 1])) { const b = Q[i], u = [Q[i - 1][0] - b[0], Q[i - 1][1] - b[1]], v = [Q[i + 1][0] - b[0], Q[i + 1][1] - b[1]], lu = Math.hypot(...u), lv = Math.hypot(...v), k = 10, p1 = [b[0] + u[0] / lu * k, b[1] + u[1] / lu * k], p3 = [b[0] + v[0] / lv * k, b[1] + v[1] / lv * k], p2 = [p1[0] + v[0] / lv * k, p1[1] + v[1] / lv * k];
              s += `<path d="M${p1.join(' ')} L${p2.join(' ')} L${p3.join(' ')}" fill="none" stroke="#E5487A" stroke-width="2"/>`; }
            if (rub && P.length) { const a = Q[Q.length - 1]; s += `<line x1="${a[0]}" y1="${a[1]}" x2="${rub[0]}" y2="${rub[1]}" stroke="#E5487A" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>`; }
            Q.forEach((q, i) => s += `<circle cx="${q[0]}" cy="${q[1]}" r="${i === 0 ? 9 : 7}" fill="${i === 0 ? '#FFC24C' : '#E5487A'}" stroke="#fff" stroke-width="2"/>`); }
          fig.innerHTML = r4svg(x0 * 2 + N * g, y0 * 2 + M * g, s); info.innerHTML = step(); };
        const add = q => { if (closed || done) return; const n = P.length;
          if (n >= 3 && same(q, P[0])) { closed = true; if (n >= 3) { const a = P[n - 1], b = P[0], c = P[1]; if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) === 0) P.shift(); } sfx.pop(6); draw(); return; }
          if (same(q, P[n - 1])) return; if (P.some(p => same(p, q))) { info.innerHTML = 'หมุดนี้ใช้ไปแล้ว — ถ้าจะปิดรูป ให้แตะ<b>หมุดจุดเริ่ม</b> (สีเหลือง)'; return; }
          if (n >= 2) { const a = P[n - 2], b = P[n - 1]; if ((b[0] - a[0]) * (q[1] - b[1]) - (b[1] - a[1]) * (q[0] - b[0]) === 0 && (b[0] - a[0]) * (q[0] - b[0]) + (b[1] - a[1]) * (q[1] - b[1]) > 0) P.pop(); } // same straight side → one side
          P.push(q); sfx.tap(); draw(); };
        /* own pointer mapping (getBoundingClientRect + viewBox) — exact under CSS zoom */
        const toSvg = e => { const sv = fig.querySelector('svg'), r = sv.getBoundingClientRect(), vb = sv.viewBox.baseVal, k = Math.min(r.width / vb.width, r.height / vb.height), ox = r.left + (r.width - vb.width * k) / 2, oy = r.top + (r.height - vb.height * k) / 2; return [(e.clientX - ox) / k, (e.clientY - oy) / k]; };
        let pid = null;
        fig.addEventListener('pointerdown', e => { if (pid != null || done || closed) return; if (e.pointerType === 'mouse' && e.button !== 0) return; const q = near(toSvg(e)); if (!q) return; e.preventDefault(); e.stopPropagation();
          if (!P.length) { P = [q]; sfx.tap(); from = 0; } else if (same(q, P[P.length - 1])) from = 0; else { add(q); return; }
          rub = null; pid = e.pointerId; try { fig.setPointerCapture(pid); } catch (_) { } draw(); });
        fig.addEventListener('pointermove', e => { if (e.pointerId !== pid || from < 0) return; e.preventDefault(); rub = toSvg(e); draw(); });
        const fin = e => { if (e.pointerId !== pid) return; pid = null; if (from < 0) return; from = -1; const q = rub && near(rub); rub = null; if (q) add(q); else draw(); };
        ['pointerup', 'pointercancel'].forEach(t => fig.addEventListener(t, fin));
        const undo = h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); if (done) return; sfx.tap(); if (closed) closed = false; else P.pop(); draw(); } }, icon('left'), 'ย้อน');
        const clr = h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); if (done) return; sfx.tap(); P = []; closed = false; draw(); } }, icon('replay'), 'เริ่มใหม่');
        const ok = () => { if (!closed) return P.length < 4 ? 'สร้างให้ครบ 4 ด้านก่อน แล้วลากกลับมาที่หมุดจุดเริ่ม' : 'ลากกลับมาที่หมุดจุดเริ่ม (สีเหลือง) เพื่อปิดรูป';
          if (P.length !== 4) return 'รูปสี่เหลี่ยมต้องมี 4 ด้าน 4 มุม';
          if (!P.every((b, i) => perp(P[(i + 3) % 4], b, P[(i + 1) % 4]))) return 'ยังมีมุมที่ไม่ใช่มุมฉาก — ทุกมุมของรูปนี้ต้องเป็นมุมฉาก';
          const L = P.map((p, i) => len(p, P[(i + 1) % 4])), ws = want.slice().sort((x, y) => x - y), hs = [L[0], L[1]].sort((x, y) => x - y);
          if (L.some(x => x == null) || ws[0] !== hs[0] || ws[1] !== hs[1]) return kind === 'sq' ? `ทุกด้านต้องยาว ${w} หน่วย — นับช่องระหว่างหมุดอีกครั้ง` : `ด้านต้องยาว ${w} หน่วย และ ${hh} หน่วย — นับช่องระหว่างหมุดอีกครั้ง`; return ''; };
        const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (done) return; const m = ok(); if (!m) { done = true; draw(); info.innerHTML = `ได้${goal} ✓`; ctx.check(true); } else ctx.check(false, m); } }, icon('check'), 'ตรวจ');
        fig.reveal = () => { P = [[1, 1], [1 + want[0], 1], [1 + want[0], 1 + want[1]], [1, 1 + want[1]]]; closed = true; done = true; draw(); };
        draw(); bd.append(h('div', { class: 't6-q p4-q r4-bq' }, fig, h('div', { class: 'colstack' }, info, h('div', { class: 'rowstack' }, undo, clr), chk))); } };
    return me; },
  r4Geo({ kind, w, hh, nm }) { const N = 9, M = 6, g = 32, x0 = 24, y0 = 22, want = kind === 'sq' ? [w, w] : [w, hh];
    const goal = kind === 'sq' ? `รูปสี่เหลี่ยมจัตุรัส ${nm} ยาวด้านละ ${w} หน่วย` : `รูปสี่เหลี่ยมผืนผ้า ${nm} กว้าง ${hh} หน่วย ยาว ${w} หน่วย`;
    const me = { prompt: `ลากหมุดสร้าง${goal}`, say: `ลากหมุดสร้าง${goal}`, __sig: `r4g ${kind} ${w} ${hh} ${nm}`, mount(bd, ctx) { let V = [[1, 1], [4, 1], [5, 4], [1, 3]].map(p => p.slice()), drag = -1, done = false; const fig = h('div', { class: 'r4-board ia rvl' }), info = h('div', { class: 'p4steplab' }, 'ลากหมุดสีชมพู');
      const px = p => [x0 + p[0] * g, y0 + p[1] * g];
      const draw = () => { const P = V.map(px); let s = r4dots(x0, y0, N, M, g) + r4PolyS(P, { names: nm, fill: 'rgba(255,194,76,.45)', labs: V.map((p, i) => { const q = V[(i + 1) % 4], L2 = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2, L = Math.sqrt(L2); return Number.isInteger(L) ? String(L) : ''; }) });
        P.forEach((p, i) => s += `<circle class="r4-peg${i === drag ? ' on' : ''}" data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="${i === drag ? 15 : 12}" fill="${i === drag ? 'rgba(229,72,122,.45)' : 'rgba(229,72,122,.25)'}" stroke="#E5487A" stroke-width="2"/>`); fig.innerHTML = r4svg(x0 * 2 + N * g, y0 * 2 + M * g, s); };
      a4Drag(fig, { down: (p, e) => { if (done) return false; const c = e.target.closest('.r4-peg'); let k = c ? +c.dataset.i : -1;
          if (k < 0) { let bd = 24; V.forEach((v, i) => { const d = Math.hypot(p[0] - x0 - v[0] * g, p[1] - y0 - v[1] * g); if (d < bd) { bd = d; k = i; } }); } if (k < 0) return false; drag = k; draw(); },
        move: ([x, y]) => { if (drag < 0) return; const q = [Math.max(0, Math.min(N, Math.round((x - x0) / g))), Math.max(0, Math.min(M, Math.round((y - y0) / g)))]; if (V.some((p, i) => i !== drag && p[0] === q[0] && p[1] === q[1])) return; if (q[0] !== V[drag][0] || q[1] !== V[drag][1]) { V[drag] = q; sfx.tap(); draw(); } },
        up: () => { drag = -1; draw(); } });
      const ok = () => { const E = V.map((p, i) => { const q = V[(i + 1) % 4]; return [q[0] - p[0], q[1] - p[1]]; }), L2 = E.map(e => e[0] ** 2 + e[1] ** 2); if (L2.some(x => !x)) return 'วางหมุดให้ครบ 4 ตำแหน่ง';
        if (!E.every((e, i) => { const f = E[(i + 1) % 4]; return e[0] * f[0] + e[1] * f[1] === 0; })) return 'ยังมีมุมที่ไม่ใช่มุมฉาก (มุมฉากจะมีเครื่องหมายสีชมพู)';
        const a = Math.sqrt(L2[0]), b = Math.sqrt(L2[1]), ws = want.slice().sort((x, y) => x - y), hs = [a, b].sort((x, y) => x - y); if (ws[0] !== hs[0] || ws[1] !== hs[1]) return kind === 'sq' ? `ด้านต้องยาว ${w} หน่วยทุกด้าน` : `ด้านต้องยาว ${hh} หน่วย และ ${w} หน่วย`; return ''; };
      const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (done) return; const m = ok(); if (!m) { done = true; draw(); ctx.check(true); } else ctx.check(false, m); } }, icon('check'), 'ตรวจ');
      fig.reveal = () => { V = [[1, 1], [1 + want[0], 1], [1 + want[0], 1 + want[1]], [1, 1 + want[1]]]; done = true; draw(); };
      draw(); bd.append(h('div', { class: 't6-q p4-q' }, fig, h('div', { class: 'colstack' }, info, chk))); } };
    return me; },
  /* อูฐเดินรอบรูป: tap every side (unknown sides ask for their length), then give the perimeter */
  r4Walk({ U, L, u, sig }) { const F = r4Fit(U, 360, 230, 50), P = F.P, n = P.length, V = U.map((p, i) => r4len(p, U[(i + 1) % n])), tot = V.reduce((a, b) => a + b, 0) * (sig && sig.k || 1), k = sig && sig.k || 1;
    const me = { prompt: 'แตะทุกด้านให้อูฐเดินรอบรูป แล้วหา<span class="hl">ความยาวรอบรูป</span>', say: 'แตะทุกด้านให้อูฐเดินรอบรูป แล้วหาความยาวรอบรูป', __sig: `r4w ${JSON.stringify(U)} ${L.join()} ${k}`, mount(bd, ctx) {
      const walked = new Set(), lab = L.slice(); let at = P[0], ask = null; const fig = h('div', { class: 'r4-board ia rvl' }), info = h('div', { class: 'p4steplab' }, 'แตะด้านไหนก่อนก็ได้'), slot = h('div', { class: 'colstack' });
      const draw = () => { let s = r4PolyS(P, { labs: lab.map((t, i) => t == null ? '?' : t + ' ' + u), fill: '#FFF1CC' }); P.forEach((p, i) => { const q = P[(i + 1) % n]; if (walked.has(i)) s += `<path d="M${p.join(' ')} L${q.join(' ')}" stroke="#E5487A" stroke-width="6" stroke-linecap="round" opacity=".5"/>`; s += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="transparent" stroke-width="22" class="r4-seg" data-i="${i}"/>`; });
        fig.innerHTML = r4svg(360, 230, s + `<g style="transform:translate(${a4n(at[0])}px,${a4n(at[1])}px);transition:transform .45s">${r4camel()}</g>`); };
      const sumTxt = () => [...walked].sort((a, b) => a - b).map(i => lab[i]).join(' + ');
      const final = () => { info.innerHTML = `${sumTxt()} = ?`; slot.innerHTML = ''; slot.append(h('div', { class: 'rowstack' }, answerBox(ctx, String(tot), { hint: 'บวกความยาวทุกด้านเข้าด้วยกัน' }), h('span', { class: 'cap', style: { fontSize: '22px' } }, u))); };
      fig.addEventListener('click', e => { e.stopPropagation(); if (ask != null) return; const t = e.target.closest('.r4-seg'); if (!t) return; const i = +t.dataset.i; if (walked.has(i)) return;
        const go = () => { walked.add(i); at = r4mid(P[i], P[(i + 1) % n]); sfx.pop(walked.size); draw(); if (walked.size === n) final(); else info.innerHTML = `เดินแล้ว: ${sumTxt()}`; };
        if (lab[i] != null) return go(); ask = i; draw(); info.innerHTML = 'ด้านนี้ไม่ได้บอกความยาว · ยาวเท่าไร? <small>(ดูด้านที่ขนานกับด้านนี้)</small>'; slot.innerHTML = '';
        slot.append(h('div', { class: 'rowstack' }, answerBox({ ...ctx, check: (ok, hn) => { if (!ok) return ctx.check(false, hn); lab[i] = r4f(V[i] * k); ask = null; slot.innerHTML = ''; go(); } }, String(V[i] * k), { hint: 'ด้านขนานฝั่งตรงข้ามรวมกันยาวเท่ากัน — นำด้านยาวลบด้านสั้น' }), h('span', { class: 'cap', style: { fontSize: '22px' } }, u))); });
      me.reveal = () => { P.forEach((_, i) => { walked.add(i); lab[i] = r4f(V[i] * k); }); draw(); info.innerHTML = `ความยาวรอบรูป = <b>${r4f(tot)} ${u}</b>`; slot.innerHTML = ''; };
      draw(); bd.append(h('div', { class: 't6-q p4-q' }, fig, h('div', { class: 'colstack' }, info, slot))); } };
    return me; },
  /* ล้อมรั้ว / ปูหญ้า: drag the corner to make a plot with the given perimeter and/or area (many right answers) */
  r4Fence({ P, A, u = 'ม.', place = '' }) { const N = 10, M = 7, g = 28, x0 = 22, y0 = 20;
    const goal = P && A ? `ใช้รั้วยาว <b>${P} ${u}</b> ล้อมแปลงให้ได้พื้นที่ <b>${A} ตร.${u === 'ม.' ? 'ม.' : u}</b>` : P ? `ใช้รั้วยาว <b>${P} ${u}</b> ล้อมแปลงหญ้ารูปสี่เหลี่ยมมุมฉากให้พอดี` : `ปูหญ้า${place ? place : ''}ให้ได้พื้นที่ <b>${A} ตร.ม.</b> เป็นรูปสี่เหลี่ยมมุมฉาก`;
    const me = { prompt: goal + ' <small>(ลากมุมสีชมพู · 1 ช่อง = 1 ม.)</small>', say: goal.replace(/<[^>]+>/g, ''), __sig: `r4f ${P} ${A}`, mount(bd, ctx) { let w = 2, hh = 2, drag = false, done = false; const fig = h('div', { class: 'r4-board ia rvl' }), info = h('div', { class: 'p4steplab' });
      const draw = () => { let s = r4gridS(x0, y0, N, M, g, '#EAE4F4') + r4grass(x0, y0, w * g, hh * g, 'r4g' + (P || 0) + (A || 0)) + `<text x="${x0 + w * g / 2}" y="${y0 + hh * g + 20}" class="r4-lab" text-anchor="middle">${w} ม.</text><text x="${x0 + w * g + 8}" y="${y0 + hh * g / 2 + 5}" class="r4-lab">${hh} ม.</text>`;
        if (!done) s += `<circle class="r4-handle" cx="${x0 + w * g}" cy="${y0 + hh * g}" r="13" fill="rgba(229,72,122,.25)" stroke="#E5487A" stroke-width="2"/>`; fig.innerHTML = r4svg(x0 * 2 + N * g + 30, y0 * 2 + M * g + 14, s); info.innerHTML = `แปลงกว้าง ${hh} ม. ยาว ${w} ม.`; };
      a4Drag(fig, { down: (p, e) => { if (done || (!e.target.closest('.r4-handle') && Math.hypot(p[0] - x0 - w * g, p[1] - y0 - hh * g) > 30)) return false; drag = true; }, up: () => { drag = false; },
        move: ([x, y]) => { if (!drag) return; const nw = Math.max(1, Math.min(N, Math.round((x - x0) / g))), nh = Math.max(1, Math.min(M, Math.round((y - y0) / g))); if (nw !== w || nh !== hh) { w = nw; hh = nh; sfx.tap(); draw(); } } });
      const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (done) return; const p = 2 * (w + hh), a = w * hh, okP = !P || p === P, okA = !A || a === A;
        if (okP && okA) { done = true; draw(); info.innerHTML += ` → รั้ว ${p} ${u} · พื้นที่ ${a} ตร.ม. ✓`; ctx.check(true); }
        else ctx.check(false, !okP && P ? `รั้วที่ใช้ = 2 × (${w} + ${hh}) = ${p} ม. ยังไม่ใช่ ${P} ม.` : `พื้นที่ = ${w} × ${hh} = ${a} ตร.ม. ยังไม่ใช่ ${A} ตร.ม.`); } }, icon('check'), 'ตรวจ');
      fig.reveal = () => { for (let a = 1; a <= N; a++) for (let b = 1; b <= M; b++) if ((!P || 2 * (a + b) === P) && (!A || a * b === A)) { w = a; hh = b; done = true; draw(); return; } };
      draw(); bd.append(h('div', { class: 't6-q p4-q' }, fig, h('div', { class: 'colstack' }, info, chk))); } };
    return me; },
  /* นับช่อง: tap the cells while counting, then answer */
  r4Count({ cells, unit, W, H }) { const g = 30, x0 = 22, y0 = 20;
    const me = { prompt: `หาพื้นที่ของรูป <small>(□ 1 ช่อง = 1 ${unit})</small>`, say: `หาพื้นที่ของรูป หนึ่งช่องเท่ากับหนึ่ง${unit}`, __sig: `r4c ${cells.map(c => c.join('.')).join(' ')} ${unit}`, mount(bd, ctx) { const mk = new Map(); const fig = h('div', { class: 'r4-board ia' });
      const draw = () => { let s = r4gridS(x0, y0, W, H, g); cells.forEach(([x, y], i) => { const on = mk.get(i); s += `<rect x="${x0 + x * g}" y="${y0 + y * g}" width="${g}" height="${g}" fill="${on ? '#FFC24C' : '#9FD0F0'}" stroke="#4C83B8" stroke-width="1" class="r4-cell" data-i="${i}"/>` + (on ? `<text x="${x0 + x * g + g / 2}" y="${y0 + y * g + g / 2 + 5}" class="r4-mk" text-anchor="middle">${on}</text>` : ''); }); fig.innerHTML = r4svg(x0 * 2 + W * g, y0 * 2 + H * g, s); };
      fig.addEventListener('click', e => { e.stopPropagation(); const c = e.target.closest('.r4-cell'); if (!c) return; const i = +c.dataset.i; if (mk.has(i)) mk.delete(i); else mk.set(i, mk.size + 1); [...mk.keys()].forEach((k, j) => mk.set(k, j + 1)); sfx.tap(); draw(); });
      draw(); bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig' }, fig, h('div', { class: 'cap' }, 'แตะช่องเพื่อนับ')), h('div', { class: 'rowstack' }, answerBox(ctx, String(cells.length), { hint: 'แตะนับทีละช่อง ตัวเลขจะขึ้นให้' }), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit)))); } };
    return me; },
  /* ปูกระเบื้อง: paint cells (drag) to make an area, optionally a rectangle */
  r4Paint({ n, rect }) { const W = 8, H = 6, g = 30, x0 = 22, y0 = 20;
    const me = { prompt: `ปูกระเบื้องให้ได้พื้นที่ <b>${n} ตารางหน่วย</b>${rect ? ' เป็น<b>รูปสี่เหลี่ยมมุมฉาก</b>' : ''} <small>(แตะหรือลากระบาย)</small>`, say: `ปูกระเบื้องให้ได้พื้นที่ ${n} ตารางหน่วย${rect ? ' เป็นรูปสี่เหลี่ยมมุมฉาก' : ''}`, __sig: `r4t ${n} ${rect ? 1 : 0}`, mount(bd, ctx) { const on = new Set(); let paint = null, done = false; const fig = h('div', { class: 'r4-board ia rvl' }), info = h('div', { class: 'p4steplab' });
      const draw = () => { let s = r4gridS(x0, y0, W, H, g); for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const k = j * W + i; s += `<rect x="${x0 + i * g + 1}" y="${y0 + j * g + 1}" width="${g - 2}" height="${g - 2}" rx="3" fill="${on.has(k) ? ((i + j) % 2 ? '#FFD27A' : '#FFB84C') : 'rgba(255,255,255,.01)'}" class="r4-cell" data-k="${k}"/>`; } fig.innerHTML = r4svg(x0 * 2 + W * g, y0 * 2 + H * g, s); info.textContent = `ปูแล้ว ${on.size} แผ่น`; };
      const hit = e => { const el = document.elementFromPoint(e.clientX, e.clientY); const c = el && el.closest && el.closest('.r4-cell'); return c ? +c.dataset.k : null; };
      fig.addEventListener('pointerdown', e => { if (done) return; const k = hit(e); if (k == null) return; e.preventDefault(); paint = !on.has(k); paint ? on.add(k) : on.delete(k); sfx.tap(); draw(); try { fig.setPointerCapture(e.pointerId); } catch (_) { } });
      fig.addEventListener('pointermove', e => { if (paint == null) return; const k = hit(e); if (k == null) return; if (paint && !on.has(k)) { on.add(k); sfx.tap(); draw(); } else if (!paint && on.has(k)) { on.delete(k); draw(); } });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => fig.addEventListener(t, () => { paint = null; }));
      const isRect = () => { const xs = [...on].map(k => k % W), ys = [...on].map(k => Math.floor(k / W)); return (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1) === on.size; };
      const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (done) return; if (on.size !== n) return ctx.check(false, `ตอนนี้ปู ${on.size} แผ่น ต้องการ ${n} แผ่น`); if (rect && !isRect()) return ctx.check(false, `ได้ ${n} แผ่นแล้ว แต่ยังไม่เป็นรูปสี่เหลี่ยมมุมฉาก — ลองจัดเป็นแถวละเท่า ๆ กัน`); done = true; ctx.check(true); } }, icon('check'), 'ตรวจ');
      fig.reveal = () => { on.clear(); const w = [6, 5, 4, 3, 2, 1, 7, 8].find(a => n % a === 0 && n / a <= H && a <= W) || 1; for (let i = 0; i < n; i++) on.add(Math.floor(i / w) * W + i % w); done = true; draw(); };
      draw(); bd.append(h('div', { class: 't6-q p4-q' }, fig, h('div', { class: 'colstack' }, info, chk))); } };
    return me; },
  /* half-cells estimate */
  r4Est({ W, H, c }) { const S = r4EstMake(W, H, c), V = r4estVal(S);
    const me = { prompt: 'หาพื้นที่โดยประมาณของสระน้ำ <small>(ครึ่งช่อง 2 ชิ้น = 1 ตารางหน่วย)</small>', say: 'หาพื้นที่โดยประมาณของสระน้ำ ครึ่งช่องสองชิ้นเท่ากับหนึ่งตารางหน่วย', __sig: `r4e ${W} ${H} ${c}`, mount(bd, ctx) { const marks = {}; const fig = h('div', { class: 'r4-board ia' });
      const draw = () => fig.innerHTML = r4EstSVG(S, marks, { g: 30 }); fig.addEventListener('click', e => { e.stopPropagation(); const c = e.target.closest('.r4-ec'); if (!c) return; marks[+c.dataset.i] = !marks[+c.dataset.i]; sfx.tap(); draw(); });
      draw(); bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig' }, fig, h('div', { class: 'cap' }, 'แตะชิ้นที่นับแล้ว: 1 = เต็มช่อง · ½ = ครึ่งช่อง')), h('div', { class: 'rowstack' }, answerBox(ctx, String(V.v), { hint: `นับช่องเต็ม แล้วนับครึ่งช่อง จับคู่ 2 ชิ้นเป็น 1 ช่อง` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'ตารางหน่วย')))); } };
    return me; },
  /* ประลองแปลงผัก: which plot is bigger / has the longer fence */
  r4Duel({ a, b, ask }) { const g = 20, s = (R, x, id, nm) => r4grass(x, 30, R[0] * g, R[1] * g, id) + r4gridS(x, 30, R[0], R[1], g, 'rgba(78,138,58,.45)') + `<text x="${x + R[0] * g / 2}" y="20" class="r4-nm" text-anchor="middle">แปลง ${nm}</text>`;
    const W = 40 + (a[0] + b[0]) * g + 40, H = 30 + Math.max(a[1], b[1]) * g + 20, va = ask === 'area' ? a[0] * a[1] : 2 * (a[0] + a[1]), vb = ask === 'area' ? b[0] * b[1] : 2 * (b[0] + b[1]), right = va > vb ? 'แปลง ก' : va < vb ? 'แปลง ข' : 'เท่ากัน';
    return r4Pk({ fig: r4fig(r4svg(W, H, s(a, 20, 'r4da', 'ก') + s(b, 60 + a[0] * g, 'r4db', 'ข'))), q: ask === 'area' ? 'แปลงใดมี<span class="hl">พื้นที่</span>มากกว่า <small>(1 ช่อง = 1 ตร.ม.)</small>' : 'แปลงใดต้องใช้<span class="hl">รั้วล้อม</span>ยาวกว่า <small>(1 ช่อง ยาว 1 ม.)</small>', say: ask === 'area' ? 'แปลงใดมีพื้นที่มากกว่า' : 'แปลงใดต้องใช้รั้วล้อมยาวกว่า', opts: ['แปลง ก', 'แปลง ข', 'เท่ากัน'], right, hint: ask === 'area' ? 'พื้นที่ = กว้าง × ยาว (นับช่อง)' : 'ความยาวรอบรูป = 2 × (กว้าง + ยาว)', keep: true }, `r4u ${a} ${b} ${ask}`); },
  /* ตัดรูป: tap a cut line, then the total area */
  r4Cut({ k, Wd, Hd, a, b, c, u }) { const U = r4shape(k, Wd, Hd, a, b, c), F = r4Fit(U, 360, 240, 50), mp = ([x, y]) => [F.ox + x * F.k, F.oy + y * F.k], P = U.map(mp), A = r4areaU(U);
    const cuts = { L: [[[[Wd - a, b], [Wd - a, Hd]]], [[[0, b], [Wd - a, b]]]], J: [[[[a, 0], [a, Hd - b]]], [[[a, Hd - b], [Wd, Hd - b]]]], U: [[[[0, b], [c, b]], [[c + a, b], [Wd, b]]], [[[c, b], [c, Hd]], [[c + a, b], [c + a, Hd]]]], T: [[[[c, b], [c + a, b]]], [[[c, 0], [c, b]], [[c + a, 0], [c + a, b]]]] }[k];
    const labs = U.map((p, i) => r4f(r4len(p, U[(i + 1) % U.length])) + ' ' + u);
    /* ผู้ใช้ขอ: each dashed line is cut by its own tap (no group cuts), pieces stay in place and just change colour (no flying apart) */
    const SEG = []; cuts.forEach((C, g) => C.forEach(sg => SEG.push({ sg, g })));
    const me = { prompt: 'แตะเส้นประทีละเส้นเพื่อตัดรูปเป็นรูปสี่เหลี่ยมมุมฉาก แล้วหา<span class="hl">พื้นที่ทั้งหมด</span>', say: 'แตะเส้นประทีละเส้นเพื่อตัดรูปเป็นรูปสี่เหลี่ยมมุมฉาก แล้วหาพื้นที่ทั้งหมด', __sig: `r4x ${k} ${Wd} ${Hd} ${a} ${b} ${c}`, mount(bd, ctx) { const on = new Set(); let open = false; const fig = h('div', { class: 'r4-board ia r4-cutfig' }), info = h('div', { class: 'p4steplab' }, 'แตะเส้นประที่จะตัด ทีละเส้น'), slot = h('div', { class: 'colstack' });
      const pieces = () => r4Pieces(U, [...on].map(i => SEG[i].sg)), isRect = cs => { const xs = cs.map(c => c[0]), ys = cs.map(c => c[1]); return cs.length === (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1); };
      const draw = () => { let s = ''; if (!on.size) s += r4PolyS(P, { fill: '#FFF1CC', labs, rm: false });
        else s += r4PolyS(P, { fill: 'none', stroke: '#C9C1DE', sw: 2, labs, rm: false }) + r4PiecesSVG(U, pieces(), mp, F.k, { gap: 0, still: true });
        SEG.forEach(({ sg: [p, q] }, i) => { const A2 = mp(p), B2 = mp(q), c0 = on.has(i); if (open && !c0) return; s += `<line x1="${A2[0]}" y1="${A2[1]}" x2="${B2[0]}" y2="${B2[1]}" stroke="${c0 ? '#E5487A' : '#3C8DDB'}" stroke-width="${c0 ? 3.5 : 3}"${c0 ? '' : ' stroke-dasharray="7 6"'}/>` + (open ? '' : `<line x1="${A2[0]}" y1="${A2[1]}" x2="${B2[0]}" y2="${B2[1]}" stroke="transparent" stroke-width="22" class="r4-seg" data-i="${i}"/>`); });
        fig.innerHTML = r4svg(360, 240, s); };
      fig.addEventListener('click', e => { e.stopPropagation(); const t = e.target.closest('.r4-seg'); if (!t || open) return; const i = +t.dataset.i; if (on.has(i)) on.delete(i); else on.add(i); sfx.pop(3);
        const C = pieces(), ok = on.size && C.length >= 2 && C.every(isRect); draw();
        if (ok) { open = true; draw(); info.innerHTML = `ตัดแล้วได้รูปสี่เหลี่ยมมุมฉาก ${C.length} ส่วน หาพื้นที่แต่ละส่วนแล้วรวมกัน`; slot.append(h('div', { class: 'rowstack' }, answerBox(ctx, String(A), { hint: 'พื้นที่แต่ละส่วน = กว้าง × ยาว แล้วนำมาบวกกัน (หรือใช้สี่เหลี่ยมใหญ่ลบส่วนที่ขาด)' }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'ตร.' + u))); }
        else info.innerHTML = on.size ? 'ยังมีส่วนที่ไม่เป็นรูปสี่เหลี่ยมมุมฉาก — แตะเส้นประเส้นอื่นเพื่อตัดต่อ (แตะเส้นที่ตัดแล้วซ้ำเพื่อยกเลิก)' : 'แตะเส้นประที่จะตัด ทีละเส้น'; });
      me.reveal = () => { if (!open) { on.clear(); SEG.forEach((x, i) => { if (x.g === 0) on.add(i); }); open = true; draw(); } info.innerHTML = `พื้นที่ทั้งหมด = <b>${r4f(A)} ตร.${u}</b>`; slot.innerHTML = ''; };
      draw(); bd.append(h('div', { class: 't6-q p4-q r4-cutq ql-pref-side' }, fig, h('div', { class: 'colstack' }, info, slot))); } };
    return me; }
});
/* text-based items */
const r4Story = s => ({ ...Q.p4Story2(s), __sig: 'r4s ' + s.text.replace(/<[^>]+>/g, '').slice(0, 50) }); /* v154: ② คิดทีละขั้นบน p4stepBox (เดิมพิมพ์คำตอบอย่างเดียว) */
const r4FigStory = (fig, text, expr, wrong, unit) => ({ ...r4Story(D6S(`${text}<div class="r4-sfig">${fig}</div>`, expr, wrong, unit)), prompt: text, say: text.replace(/<[^>]+>/g, '') });
const R4_PROP = [['รูปสี่เหลี่ยมผืนผ้ามีมุมฉาก 4 มุม', 1], ['รูปสี่เหลี่ยมผืนผ้ามีด้านยาวเท่ากันทุกด้าน', 0], ['รูปสี่เหลี่ยมจัตุรัสมีด้านยาวเท่ากันทุกด้าน', 1], ['รูปสี่เหลี่ยมจัตุรัสเป็นรูปสี่เหลี่ยมมุมฉาก', 1], ['ด้านตรงข้ามของรูปสี่เหลี่ยมผืนผ้ายาวเท่ากัน', 1], ['รูปสี่เหลี่ยมที่มีมุมฉาก 2 มุม เป็นรูปสี่เหลี่ยมมุมฉากเสมอ', 0], ['รูปสี่เหลี่ยมจัตุรัสที่หมุนเอียงไม่เป็นรูปจัตุรัสแล้ว', 0], ['รูปสี่เหลี่ยมมุมฉากมี 2 ชนิด คือ ผืนผ้า และจัตุรัส', 1], ['ด้านที่อยู่ติดกันของรูปสี่เหลี่ยมผืนผ้าต้องยาวเท่ากัน', 0], ['ด้านตรงข้ามของรูปสี่เหลี่ยมมุมฉากขนานกัน', 1]];
const R4_DPROP = [['เส้นทแยงมุมของรูปสี่เหลี่ยมผืนผ้ายาวเท่ากัน', 1], ['เส้นทแยงมุมของรูปสี่เหลี่ยมจัตุรัสตัดกันเป็นมุมฉาก', 1], ['เส้นทแยงมุมของรูปสี่เหลี่ยมผืนผ้าตัดกันเป็นมุมฉากเสมอ', 0], ['รูปสี่เหลี่ยมทุกรูปมีเส้นทแยงมุม 2 เส้น', 1], ['เส้นทแยงมุมของรูปสี่เหลี่ยมมุมฉากแบ่งครึ่งซึ่งกันและกัน', 1], ['เส้นทแยงมุมคือด้านที่ยาวที่สุดของรูปสี่เหลี่ยม', 0], ['เส้นทแยงมุมเชื่อมจุดยอดที่อยู่ติดกัน', 0], ['เส้นทแยงมุมของรูปสี่เหลี่ยมจัตุรัสยาวเท่ากัน', 1]];
const r4TF = (D, tag) => { const S = pkF(D, 4); return { ...Q.ixGroup({ q: 'ข้อความใด<b>ถูกต้อง</b> ข้อความใด<b>ไม่ถูกต้อง</b>', bins: ['✓ ถูกต้อง', '✗ ไม่ถูกต้อง'], items: S.map(([t, ok]) => ({ label: t, bin: ok ? 0 : 1 })), hint: 'นึกถึงมุมฉาก ความยาวด้าน และเส้นทแยงมุม' }), __sig: `r4o ${tag} ` + S.map(x => x[0]).join() }; };
const R4_UNIT = [['หน้าปกสมุด', 0], ['แสตมป์', 0], ['กระดาษโน้ต', 0], ['จอโทรศัพท์', 0], ['พื้นห้องเรียน', 1], ['สนามฟุตบอล', 1], ['ผนังห้องนอน', 1], ['สระว่ายน้ำ', 1], ['ที่ดินปลูกบ้าน', 2], ['ที่ดินทำสวนทุเรียน', 2], ['ที่ดินสร้างโรงเรียน', 2]];
const r4UnitQ = () => { const S = [...pkF(R4_UNIT.filter(x => x[1] === 0), 2), ...pkF(R4_UNIT.filter(x => x[1] === 1), 1), ...pkF(R4_UNIT.filter(x => x[1] === 2), 1)];
  return { ...Q.ixGroup({ q: 'ควรวัดพื้นที่ด้วยหน่วยใด จัดลงกล่อง', bins: ['ตร.ซม.', 'ตร.ม.', 'ตารางวา'], items: S.map(([t, b]) => ({ label: t, bin: b, why: ['ของชิ้นเล็ก ใช้ตารางเซนติเมตร', 'ห้อง สนาม ผนัง ใช้ตารางเมตร', 'ที่ดิน นิยมใช้ตารางวา'][b] })) }), __sig: 'r4i ' + S.map(x => x[0]).join() }; };
const R4_WHICH = [['ติดไฟประดับรอบป้าย', 0], ['ล้อมรั้วรอบสวน', 0], ['ติดเทปรอบกระดาน', 0], ['ทำกรอบรูป', 0], ['วิ่งรอบสนาม', 0], ['ปูกระเบื้องพื้นห้อง', 1], ['ทาสีผนัง', 1], ['ปลูกหญ้าเต็มสนาม', 1], ['ปูพรมในห้อง', 1], ['ห่อปกหนังสือ', 1]];
const r4WhichQ = () => { const S = [...pkF(R4_WHICH.filter(x => !x[1]), 2), ...pkF(R4_WHICH.filter(x => x[1]), 2)];
  return { __base: 'r4which', __baseCap: 1, ...Q.ixGroup({ q: 'งานนี้ต้องหา<b>ความยาวรอบรูป</b> หรือ <b>พื้นที่</b>', bins: ['ความยาวรอบรูป', 'พื้นที่'], items: S.map(([t, b]) => ({ label: t, bin: b, why: b ? 'คลุมเต็มผิวด้านใน → พื้นที่' : 'วางตามขอบโดยรอบ → ความยาวรอบรูป' })) }), __sig: 'r4h ' + S.map(x => x[0]).join() }; };
const R4_BUILD = ['ลากด้านแรกยาวตามที่กำหนด', 'สร้างมุมฉากที่ปลายทั้งสองข้างด้วยไม้โพรแทรกเตอร์', 'วัดความยาวด้านที่ตั้งฉากตามที่กำหนด แล้วทำจุด', 'ลากเชื่อมจุด แล้วเขียนชื่อรูป'];
const r4SeqQ = () => ({ ...Q.p4Seq({ text: 'เรียงขั้นตอน<b>การสร้างรูปสี่เหลี่ยมผืนผ้า</b>', cards: R4_BUILD }), __sig: 'r4q build' });
/* ---------- random data ---------- */
const r4nm = () => pick(R4N);
const r4qkSet = want => { const pos = want === 'sq' ? ['sq', 'tsq'] : ['rect', 'sq', 'trect', 'tsq'], neg = want === 'sq' ? ['rect', 'trect', 'rhom', 'para'] : ['para', 'trap', 'rtrap', 'rhom', 'kite']; const k = rnd(2, 3); return shuffle([...pkF(pos, Math.min(k, pos.length)), ...pkF(neg, 6 - Math.min(k, pos.length))]); };
const r4walkRect = () => { const sq = Math.random() < .35, w = rnd(3, 9), hh = sq ? w : rnd(2, 6) === w ? w - 1 : rnd(2, 6), U = [[0, 0], [w, 0], [w, hh], [0, hh]], k = pick([1, 2, 5, 10]), L = sq ? [r4f(w * k), null, null, null] : [r4f(w * k), r4f(hh * k), null, null]; return Q.r4Walk({ U, L, u: pick(['ซม.', 'ม.']), sig: { k } }); };
const r4walkPoly = () => { const S = r4rnd(), n = S.P.length, k = pick([1, 2, 3, 5, 10]), hor = i => S.P[i][1] === S.P[(i + 1) % n][1], hs = shuffle([...Array(n).keys()]), h1 = hs[0], h2 = hs.find(i => hor(i) !== hor(h1)), hide = new Set(Math.random() < .5 ? [h1] : [h1, h2]), L = S.P.map((p, i) => hide.has(i) ? null : r4f(r4len(p, S.P[(i + 1) % n]) * k));
  // only hide sides that can be worked out: keep at least the other sides on the same direction
  return Q.r4Walk({ U: S.P, L, u: pick(['ซม.', 'ม.']), sig: { k } }); };
const r4cutQ = () => { for (;;) { const k = pick(['L', 'J', 'U', 'T']), Wd = rnd(5, 9), Hd = rnd(4, 7), a = rnd(2, Wd - 3), b = rnd(1, Hd - 2), c = rnd(1, Math.max(1, Wd - a - 1)); if ((k === 'U' || k === 'T') && c + a >= Wd) continue; return Q.r4Cut({ k, Wd, Hd, a, b, c, u: pick(['ม.', 'ซม.']) }); } };
const r4cells = () => { const S = r4rnd(), out = []; const W = Math.max(...S.P.map(p => p[0])), H = Math.max(...S.P.map(p => p[1])); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (r4pip([x + .5, y + .5], S.P)) out.push([x + 1, y + 1]); return { cells: out, W: W + 2, H: H + 2 }; };
const r4fenceQ = mode => { const pairs = []; for (let a = 1; a <= 10; a++) for (let b = 1; b <= 7; b++) pairs.push([a, b]); const [a, b] = pick(pairs.filter(([a, b]) => a * b >= 6 && a !== b || (a === b && a > 2)));
  return mode === 'P' ? Q.r4Fence({ P: 2 * (a + b) }) : mode === 'A' ? Q.r4Fence({ A: a * b }) : Q.r4Fence({ P: 2 * (a + b), A: a * b }); };
/* ด่าน 9: four grass fields of growing area, each a different place so none reads as a repeat */
const R4_GRASS = ['หน้าบ้าน', 'ในแปลงเลี้ยงแพะ', 'ในสนามเด็กเล่น', 'หลังโรงเรียน', 'ในสนามฟุตบอลจำลอง', 'ในสวนหย่อมกลางหมู่บ้าน'];
const r4grassQs = () => { const pl = pkF(R4_GRASS, 4), used = new Set(), out = []; [[6, 12], [12, 20], [20, 30], [30, 48]].forEach(([lo, hi], i) => {
    const ok = []; for (let a = 1; a <= 10; a++) for (let b = 1; b <= 7; b++) { const A = a * b; if (A >= lo && A <= hi && a !== b && !used.has(A)) ok.push(A); }
    const A = pick(ok); used.add(A); out.push({ ...Q.r4Fence({ A, place: pl[i] }), __diff: 20 + i }); }); return out; };
const r4duelQ = ask => { for (;;) { const a = [rnd(2, 7), rnd(2, 6)], b = [rnd(2, 7), rnd(2, 6)]; if (a.join() === b.join()) continue; const va = ask === 'area' ? a[0] * a[1] : a[0] + a[1], vb = ask === 'area' ? b[0] * b[1] : b[0] + b[1]; if (Math.abs(va - vb) > 3) continue; return Q.r4Duel({ a, b, ask }); } };
/* formula items with a figure (choose the sentence → compute) */
const r4perFormula = () => { const sq = Math.random() < .4, nm = r4nm(), u = pick(['ซม.', 'ม.', 'นิ้ว', 'มม.']), w = sq ? pick([rnd(6, 99), rnd(100, 600)]) : rnd(12, 600), hh = sq ? w : rnd(5, Math.max(6, w - 3));
  return sq ? r4FigStory(r4Rect(w, w, { unit: u, sq: true, names: nm }), `รูปสี่เหลี่ยมจัตุรัส ${nm} มีความยาวรอบรูปเท่าใด`, `4 × ${w}`, [`${w} × ${w}`, `2 × ${w}`], u)
    : r4FigStory(r4Rect(w, hh, { unit: u, names: nm }), `รูปสี่เหลี่ยมผืนผ้า ${nm} มีความยาวรอบรูปเท่าใด`, `2 × (${w} + ${hh})`, [`${w} × ${hh}`, `${w} + ${hh}`], u); };
const r4areaFormula = sq => { const nm = r4nm(), u = pick(['ซม.', 'ม.', 'นิ้ว', 'มม.', 'วา']), w = sq ? rnd(4, 40) : rnd(6, 90), hh = sq ? w : rnd(3, Math.max(4, Math.min(w - 2, 40)));
  const ua = u === 'วา' ? 'ตารางวา' : 'ตร.' + u;
  return sq ? r4FigStory(r4Rect(w, w, { unit: u, sq: true, names: nm }), `รูปสี่เหลี่ยมจัตุรัส ${nm} มีพื้นที่เท่าใด`, `${w} × ${w}`, [w === 4 ? `4 × 4 × 4` : `4 × ${w}`, `${w} + ${w}`], ua)
    : r4FigStory(r4Rect(w, hh, { unit: u, names: nm }), `รูปสี่เหลี่ยมผืนผ้า ${nm} มีพื้นที่เท่าใด`, `${hh} × ${w}`, [`2 × (${w} + ${hh})`, `${w} + ${hh}`], ua); };
const r4sideFromP = () => { const sq = Math.random() < .5, w = rnd(5, 60), hh = rnd(3, Math.max(4, w - 2)), u = pick(['ซม.', 'ม.']);
  return sq ? r4Story(D6S(`รูปสี่เหลี่ยมจัตุรัสมีความยาวรอบรูป ${4 * w} ${u} ยาวด้านละเท่าใด`, `${4 * w} ÷ 4`, [`${4 * w} × 4`, `${4 * w} − 4`], u))
    : r4Story(D6S(`รูปสี่เหลี่ยมผืนผ้ายาว ${w} ${u} มีความยาวรอบรูป ${2 * (w + hh)} ${u} กว้างเท่าใด`, `(${2 * (w + hh)} ÷ 2) − ${w}`, [`${2 * (w + hh)} − ${w}`, `${2 * (w + hh)} ÷ 2`], u)); };
const r4sideFromA = () => { const sq = Math.random() < .5, w = rnd(3, 12), hh = rnd(2, 15), u = pick(['ซม.', 'ม.']);
  return sq ? { ...Q.p4Num({ fig: p4big(`<span class="fsign">?</span> <b class="fop">×</b> <span class="fsign">?</span> <b class="fop">=</b> <b class="num">${w * w}</b>`), q: `รูปสี่เหลี่ยมจัตุรัสมีพื้นที่ ${w * w} ตร.${u} ยาวด้านละกี่${u === 'ม.' ? 'เมตร' : 'เซนติเมตร'}`, a: w, hint: `ด้าน × ด้าน = ${w * w} → ท่องสูตรคูณหาจำนวนที่คูณตัวเองได้ ${w * w}` }), __sig: 'r4sq ' + w } /* v154: เดิมตัวเลือก ${w * w} ÷ ${w} บอกคำตอบ */
    : r4Story(D6S(`รูปสี่เหลี่ยมผืนผ้ามีพื้นที่ ${w * hh} ตร.${u} กว้าง ${w} ${u} ยาวเท่าใด`, `${w * hh} ÷ ${w}`, [`${w * hh} − ${w}`, `${w * hh} × ${w}`], u)); };
/* word problems practice+ แบบฝึกหัด 13–14 style, random numbers) */
const R4_PS = [
  (n) => { const w = rnd(8, 30), l = rnd(w + 2, 60); return D6S(`สวนสาธารณะเป็นรูปสี่เหลี่ยมผืนผ้า ยาว ${l} เมตร กว้าง ${w} เมตร ต้องการล้อมรั้วรอบสวน จะใช้รั้วกี่เมตร`, `2 × (${l} + ${w})`, [`${l} × ${w}`, `${l} + ${w}`], 'เมตร'); },
  (n) => { const w = rnd(15, 40), l = rnd(w + 3, 60); return D6S(`${n}ทำกรอบรูปรูปสี่เหลี่ยมผืนผ้า ยาว ${l} เซนติเมตร กว้าง ${w} เซนติเมตร ต้องใช้ไม้ยาวกี่เซนติเมตร`, `2 × (${l} + ${w})`, [`${l} × ${w}`, `${l} + ${w}`], 'เซนติเมตร'); },
  (n) => { const s = rnd(40, 150); return D6S(`ครูติดเทปสีรอบกระดานรูปสี่เหลี่ยมจัตุรัส ยาวด้านละ ${s} เซนติเมตร ต้องใช้เทปกี่เซนติเมตร`, `4 × ${s}`, [`${s} × ${s}`, `2 × ${s}`], 'เซนติเมตร'); },
  (n) => { const l = rnd(100, 200), w = rnd(50, l - 10); return D6S(`โต๊ะรูปสี่เหลี่ยมผืนผ้ายาว ${l} เซนติเมตร มีความยาวรอบรูป ${2 * (l + w)} เซนติเมตร โต๊ะกว้างกี่เซนติเมตร`, `(${2 * (l + w)} ÷ 2) − ${l}`, [`${2 * (l + w)} − ${l}`, `${2 * (l + w)} ÷ 4`], 'เซนติเมตร'); },
  (n) => { const s = rnd(20, 95); return D6S(`แปลงผักรูปสี่เหลี่ยมจัตุรัสมีความยาวรอบแปลง ${4 * s} เซนติเมตร ยาวด้านละกี่เซนติเมตร`, `${4 * s} ÷ 4`, [`${4 * s} ÷ 2`, `${4 * s} − 4`], 'เซนติเมตร'); },
  (n) => { const w = rnd(10, 25), l = rnd(w + 2, 40), k = pick([2, 3]); return D6S(`${n}วิ่งรอบสนามรูปสี่เหลี่ยมผืนผ้ายาว ${l} เมตร กว้าง ${w} เมตร จำนวน ${k} รอบ วิ่งได้ระยะทางกี่เมตร`, `2 × (${l} + ${w}) × ${k}`, [`(${l} + ${w}) × ${k}`, `${l} × ${w} × ${k}`], 'เมตร'); }];
const R4_AS = [
  (n) => { const w = rnd(3, 12), l = rnd(w + 1, 20); return D6S(`แปลงนารูปสี่เหลี่ยมมุมฉากกว้าง ${w} เมตร ยาว ${l} เมตร มีพื้นที่กี่ตารางเมตร`, `${w} × ${l}`, [`2 × (${w} + ${l})`, `${w} + ${l}`], 'ตารางเมตร'); },
  (n) => { const w = rnd(8, 15), l = rnd(w + 2, 25); return D6S(`ซองจดหมายกว้าง ${w} เซนติเมตร ยาว ${l} เซนติเมตร มีพื้นที่กี่ตารางเซนติเมตร`, `${w} × ${l}`, [`2 × (${w} + ${l})`, `${w} + ${l}`], 'ตารางเซนติเมตร'); },
  (n) => { const w = rnd(20, 40), l = rnd(w + 5, 60); return D6S(`ที่ดินรูปสี่เหลี่ยมมุมฉากยาว ${l} วา กว้าง ${w} วา ปลูกหญ้าเต็มพื้นที่ จะปลูกหญ้ากี่ตารางวา`, `${l} × ${w}`, [`2 × (${l} + ${w})`, `${l} + ${w}`], 'ตารางวา'); },
  (n) => { const w = rnd(8, 15), l = rnd(w + 2, 24), s = rnd(1, 3); return D6S(`${n}มีลานรูปสี่เหลี่ยมผืนผ้ายาว ${l} เมตร กว้าง ${w} เมตร เว้นที่รูปสี่เหลี่ยมจัตุรัสยาวด้านละ ${s} เมตรไว้ปลูกต้นไม้ ลานที่เหลือมีพื้นที่กี่ตารางเมตร`, `${l} × ${w} − ${s} × ${s}`, [`${l} × ${w} + ${s} × ${s}`, `${l} × ${w} − ${s} × 4`], 'ตารางเมตร'); },
  (n) => { const w = rnd(4, 12), l = rnd(w + 1, 18), p = pick([150, 200, 250, 300, 450]); return D6S(`ร้านปูพรมคิดราคาตารางเมตรละ ${p} บาท ห้องยาว ${l} เมตร กว้าง ${w} เมตร ปูพรมเต็มห้องต้องจ่ายกี่บาท`, `${l} × ${w} × ${p}`, [`2 × (${l} + ${w}) × ${p}`, `(${l} + ${w}) × ${p}`], 'บาท'); },
  (n) => { const s = rnd(2, 9), c = pick([20, 25, 40, 50]); return D6S(`ป้ายโฆษณารูปสี่เหลี่ยมจัตุรัสยาวด้านละ ${s} เมตร ทาสีตารางเมตรละ ${c} บาท ต้องจ่ายค่าสีกี่บาท`, `${s} × ${s} × ${c}`, [`4 × ${s} × ${c}`, `${s} × ${c}`], 'บาท'); },
  (n) => { const w = rnd(10, 20), l = rnd(w + 2, 30), a = rnd(2, 6); return D6S(`สนามหญ้ากว้าง ${w} เมตร ยาว ${l} เมตร ขุดบ่อรูปสี่เหลี่ยมจัตุรัสด้านละ ${a} เมตร เหลือพื้นที่หญ้ากี่ตารางเมตร`, `${w} × ${l} − ${a} × ${a}`, [`(${w} + ${l}) × 2 − ${a} × ${a}`, `${w} × ${l} + ${a} × ${a}`], 'ตารางเมตร'); }];
const r4ps = (D, k) => pkF(D, k).map(f => r4Story(f(pick(['ปุ้ม', 'มะลิ', 'ต้นข้าว', 'ก้อง', 'ใบเตย', 'ภูผา', 'ป้าศรี', 'ลุงชัย']))));

/* ---------- lessons ---------- */
const L4R = (no, place, title, short, goal, teach, game) => ({ id: 1480 + no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game, learned: true });
const r4N = (k, f) => Array.from({ length: k }, f);
const r4ex = (U, labs, o = {}) => { const F = r4Fit(U, o.W || 320, o.H || 200, o.pad || 44); return r4svg(o.W || 320, o.H || 200, r4PolyS(F.P, { labs, fill: o.fill, names: o.names, rm: o.rm }) + (o.extra ? o.extra(F) : '')); };
const LESSONS_P4C9 = [
  L4R(1, 'โอเอซิสมุมฉาก', 'ชนิดของรูปสี่เหลี่ยมมุมฉาก', 'ชนิดของรูปสี่เหลี่ยมมุมฉาก', 'บอกชนิดและสมบัติของรูปสี่เหลี่ยมผืนผ้าและรูปสี่เหลี่ยมจัตุรัส',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(2, 'เนินเส้นทแยง', 'เส้นทแยงมุมของรูปสี่เหลี่ยม', 'เส้นทแยงมุม', 'บอกเส้นทแยงมุมของรูปสี่เหลี่ยม และสมบัติเส้นทแยงมุมของรูปสี่เหลี่ยมมุมฉาก',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(3, 'ลานหมุดทราย', 'การสร้างรูปสี่เหลี่ยมจัตุรัส และรูปสี่เหลี่ยมผืนผ้า', 'สร้างรูปสี่เหลี่ยม', 'สร้างรูปสี่เหลี่ยมจัตุรัสและรูปสี่เหลี่ยมผืนผ้าเมื่อกำหนดความยาวของด้าน',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(4, 'สนามอูฐเดินรอบ', 'การหาความยาวรอบรูปของรูปสี่เหลี่ยมมุมฉาก', 'ความยาวรอบรูป', 'หาความยาวรอบรูปของรูปสี่เหลี่ยมผืนผ้าและรูปสี่เหลี่ยมจัตุรัส',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(5, 'ผาบันไดทราย', 'การหาความยาวรอบรูปของรูปหลายเหลี่ยมที่สามารถแบ่งหรือต่อเป็นรูปสี่เหลี่ยมมุมฉาก', 'รอบรูปหลายเหลี่ยม', 'หาความยาวรอบรูปของรูปหลายเหลี่ยมที่แบ่งหรือต่อเป็นรูปสี่เหลี่ยมมุมฉากได้',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(6, 'ลานกระเบื้อง', 'การหาพื้นที่โดยการนับตาราง', 'พื้นที่โดยนับตาราง', 'หาพื้นที่โดยนับรูปสี่เหลี่ยมจัตุรัสหน่วย (ตารางหน่วย)',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(7, 'ตลาดตารางวา', 'การหาพื้นที่ของรูปเรขาคณิตโดยการนับตารางเป็นตารางเซนติเมตร ตารางเมตร ตารางวา', 'ตร.ซม. ตร.ม. ตารางวา', 'หาพื้นที่โดยการนับตารางในหน่วยตารางเซนติเมตร ตารางเมตร และตารางวา',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(8, 'สระน้ำโอเอซิส', 'การหาพื้นที่โดยประมาณ ใช้การนับตารางของรูปที่ไม่เต็มตารางหน่วย', 'พื้นที่โดยประมาณ', 'หาพื้นที่โดยประมาณ โดยนับช่องเต็มและนำครึ่งช่องมารวมกัน',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(9, 'ทุ่งสูตรผืนผ้า', 'การหาพื้นที่ของรูปสี่เหลี่ยมผืนผ้าโดยใช้สูตร', 'พื้นที่ผืนผ้า (สูตร)', 'หาพื้นที่ของรูปสี่เหลี่ยมผืนผ้าโดยใช้ ความกว้าง × ความยาว',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */), // ผู้ใช้ขอ: ปูทุ่งหญ้า 4 ข้อ · ไม่มีปูกระเบื้อง
  L4R(10, 'ลานจัตุรัส', 'การหาพื้นที่ของรูปสี่เหลี่ยมจัตุรัสโดยใช้สูตร', 'พื้นที่จัตุรัส (สูตร)', 'หาพื้นที่ของรูปสี่เหลี่ยมจัตุรัสโดยใช้ ความยาวด้าน × ความยาวด้าน',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */), // ผู้ใช้ขอ: ไม่มีปูกระเบื้อง · ไม่ซ้ำแบบเดิมเกิน 3 ข้อ
  L4R(11, 'ห้องรูปตัวแอล', 'การหาพื้นที่ของรูปหลายเหลี่ยมที่สามารถแบ่งเป็นรูปสี่เหลี่ยมมุมฉากได้', 'พื้นที่หลายเหลี่ยม', 'หาพื้นที่ของรูปหลายเหลี่ยมโดยแบ่งเป็นรูปสี่เหลี่ยมมุมฉาก หรือใช้รูปใหญ่ลบส่วนที่ขาด',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(12, 'ไร่รั้วและหญ้า', 'โจทย์การหาพื้นที่และความยาวรอบรูปสี่เหลี่ยมมุมฉาก', 'พื้นที่กับรอบรูป', 'แยกความแตกต่างระหว่างพื้นที่และความยาวรอบรูป และหาทั้งสองอย่าง',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(13, 'ถนนรั้วทะเลทราย', 'การแก้โจทย์ปัญหาเกี่ยวกับความยาวรอบรูปของรูปสี่เหลี่ยมมุมฉาก', 'โจทย์รอบรูป', 'วิเคราะห์และแสดงวิธีหาคำตอบของโจทย์ปัญหาเกี่ยวกับความยาวรอบรูป',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */),
  L4R(14, 'ร้านพรมแมงป่อง', 'การแก้โจทย์ปัญหาเกี่ยวกับพื้นที่ของรูปสี่เหลี่ยมมุมฉาก', 'โจทย์พื้นที่', 'วิเคราะห์และแสดงวิธีหาคำตอบของโจทย์ปัญหาเกี่ยวกับพื้นที่ รวมโจทย์ 2 ขั้นตอน',
    [] /* หน้าสอนอยู่ใน p4rd.js (R4D_TEACH · v251) */,
    () => [] /* v249: เกม 10 ข้อ ง่าย → ยาก อยู่ใน p4rm.js (R4V_GAME) */)
];

/* ---------- boss ---------- */
const r4X = (q, opts, lv, fig) => ({ q, fig, opts, a: 0, lv });
const EXAM_P4C9 = d6spread([
  r4X('รูปใดเป็นรูปสี่เหลี่ยมจัตุรัส', ['รูปที่มีมุมฉาก 4 มุม และด้านยาวเท่ากันทุกด้าน', 'รูปที่มีมุมฉาก 2 มุม', 'รูปที่ด้านตรงข้ามยาวเท่ากันแต่ไม่มีมุมฉาก'], 1481),
  r4X('รูปนี้เป็นรูปสี่เหลี่ยมชนิดใด', ['รูปสี่เหลี่ยมผืนผ้า', 'รูปสี่เหลี่ยมจัตุรัส', 'ไม่ใช่รูปสี่เหลี่ยมมุมฉาก'], 1481, r4Rect(9, 5, { unit: 'ซม.', all: true })),
  r4X('เส้นทแยงมุมของรูปสี่เหลี่ยม PQRS คือข้อใด', ['PR และ QS', 'PQ และ RS', 'PS และ QR'], 1482, r4Rect(7, 4, { labs: ['', '', '', ''], names: 'PQRS' })),
  r4X('รูปสี่เหลี่ยมผืนผ้า ABCD มีเส้นทแยงมุม AC ยาว 26 ซม. เส้นทแยงมุม BD ยาวเท่าใด', ['26 ซม.', '13 ซม.', '52 ซม.'], 1482),
  r4X('ข้อใดไม่ใช่ขั้นตอนการสร้างรูปสี่เหลี่ยมผืนผ้า', ['สร้างมุม 60° ที่ปลายด้านแรก', 'ลากด้านแรกตามความยาวที่กำหนด', 'สร้างมุมฉากที่ปลายด้านแรก'], 1483),
  r4X('รูปสี่เหลี่ยมผืนผ้ายาว 20 ฟุต กว้าง 10 ฟุต มีความยาวรอบรูปเท่าใด', ['60 ฟุต', '30 ฟุต', '200 ฟุต', '40 ฟุต'], 1484, r4Rect(20, 10, { unit: 'ฟุต' })),
  r4X('รูปสี่เหลี่ยมจัตุรัสยาวด้านละ 115 ม. มีความยาวรอบรูปเท่าใด', ['460 ม.', '230 ม.', '13,225 ม.', '345 ม.'], 1484),
  r4X('รูปนี้มีความยาวรอบรูปเท่าใด', ['28 ม.', '24 ม.', '42 ม.', '26 ม.'], 1485, r4ex(R4SH.L(8, 6, 3, 2), ['5 ม.', '2 ม.', '3 ม.', '4 ม.', '8 ม.', '6 ม.'])),
  r4X('รูปนี้มีพื้นที่กี่ตารางหน่วย', ['10 ตารางหน่วย', '8 ตารางหน่วย', '12 ตารางหน่วย', '14 ตารางหน่วย'], 1486, r4svg(260, 150, r4gridS(40, 15, 6, 4, 30) + [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2]].map(([x, y]) => `<rect x="${40 + x * 30}" y="${15 + y * 30}" width="30" height="30" fill="#9FD0F0" stroke="#4C83B8"/>`).join(''))),
  r4X('ควรใช้หน่วยใดวัดพื้นที่ของที่ดินปลูกบ้าน', ['ตารางวา', 'ตารางเซนติเมตร', 'ตารางมิลลิเมตร'], 1487),
  r4X('1 ตารางวา เท่ากับกี่ตารางเมตร', ['4 ตารางเมตร', '2 ตารางเมตร', '1 ตารางเมตร', '8 ตารางเมตร'], 1487),
  r4X('สระน้ำนี้มีพื้นที่โดยประมาณกี่ตารางหน่วย', ['17 ตารางหน่วย', '12 ตารางหน่วย', '22 ตารางหน่วย', '15 ตารางหน่วย'], 1488, r4EstSVG(r4EstShape(1), {}, { g: 26 })),
  r4X('รูปสี่เหลี่ยมผืนผ้ากว้าง 35 ม. ยาว 80 ม. มีพื้นที่เท่าใด', ['2,800 ตร.ม.', '230 ตร.ม.', '115 ตร.ม.', '2,400 ตร.ม.'], 1489),
  r4X('รูปสี่เหลี่ยมผืนผ้ามีพื้นที่ 48 ตร.ซม. กว้าง 6 ซม. ยาวเท่าใด', ['8 ซม.', '42 ซม.', '18 ซม.', '12 ซม.'], 1489),
  r4X('รูปสี่เหลี่ยมจัตุรัสยาวด้านละ 12 ซม. มีพื้นที่เท่าใด', ['144 ตร.ซม.', '48 ตร.ซม.', '24 ตร.ซม.', '124 ตร.ซม.'], 1490),
  r4X('รูปนี้มีพื้นที่เท่าใด', ['42 ตร.ม.', '48 ตร.ม.', '28 ตร.ม.', '36 ตร.ม.'], 1491, r4ex(R4SH.L(8, 6, 3, 2), ['5 ม.', '2 ม.', '3 ม.', '4 ม.', '8 ม.', '6 ม.'], { rm: false })),
  r4X('งานใดต้องหาพื้นที่', ['ปูกระเบื้องพื้นห้อง', 'ล้อมรั้วรอบสวน', 'ติดเทปรอบกระดาน'], 1492),
  r4X('ใช้รั้วยาว 16 ม. ล้อมแปลงรูปสี่เหลี่ยมผืนผ้ากว้าง 3 ม. แปลงนี้ยาวกี่เมตร', ['5 ม.', '13 ม.', '8 ม.', '10 ม.'], 1493),
  r4X('โต๊ะยาว 150 ซม. มีความยาวรอบรูป 500 ซม. โต๊ะกว้างเท่าใด', ['100 ซม.', '350 ซม.', '200 ซม.', '125 ซม.'], 1493),
  r4X('ห้องยาว 24 ม. กว้าง 15 ม. ปูพื้นตารางเมตรละ 450 บาท ต้องจ่ายกี่บาท', ['162,000 บาท', '35,100 บาท', '17,550 บาท', '16,200 บาท'], 1494)]);
LESSONS_P4C9.push({ id: 1499, boss: true, place: 'รังแมงป่องสี่เหลี่ยม', title: 'ด่านบอส: บทที่ 9 รูปสี่เหลี่ยมมุมฉาก', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'คำถามท้ายบท 20 ข้อ (ชนิด · เส้นทแยงมุม · สร้างรูป · ความยาวรอบรูป · พื้นที่ · โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P4C9, pass: 10, bossName: 'แมงป่องสี่เหลี่ยม', bossPal: 'yellow', emblem: '▭', bossKind: 'scorp',
  winLine: 'ชนะแมงป่องสี่เหลี่ยมแล้ว! เก่งเรื่องรอบรูปและพื้นที่มาก', loseLine: 'แมงป่องสี่เหลี่ยมยังไม่ยอมแพ้ กลับไปฝึกแล้วสู้ใหม่นะ!' });
