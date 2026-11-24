/* =========================================================
   ม.1 บทที่ 2 การสร้างทางเรขาคณิต (v227) — prefix mg
   กระดาษสร้างรูปจริง: สันตรง/ไม้บรรทัด · วงเวียน · ครึ่งวงกลม (โปรแทรกเตอร์) · แตะจุด
   - mgBoard(T, cb)  กระดาน (ทำเอง / ตัวอย่างทีละขั้นแบบเคลื่อนไหว cb.demo / ดูเฉลย)
       T = { title, given:{pts:{A:[x,y]}, segs:[['A','B']], rays:[['B','A']], lines:[['A','B']]}, tools:[...],
             goal(G) → {ok, why}, sol:[{say, ops:[...]}], marks:[{p,name}], okMsg }
       ops: {t:'seg',a,b} · {t:'arc',c,r,a0,a1} · {t:'pt',p,name} · {t:'prot',c,rot} · {t:'mark',c,rot,deg}   (หน่วย ซม. แกน y ขึ้น)
   - mgFig(spec)  รูปนิ่ง (โจทย์เลือกตอบ / การ์ด)
   - งานสร้าง mgT.* · ข้อ Q.mg* · บทเรียน LESSONS_M1C2 (2201–2212, v231 ชุดใหม่ 12 ด่าน) + บอส 2219
   ใช้ cnsAdd/cnsDist/cnsDir/cnsAng/cnsF จาก p5q.js (โหลดก่อน)
   ========================================================= */
const MG_W = 640, MG_H = 420, MG_K = 44, MG_BW = MG_W / MG_K, MG_BH = MG_H / MG_K;
const mgD = cnsDist, mgA = cnsAng, mgU = cnsDir, mgAdd = cnsAdd, mgF = cnsF;
const mgP = (a, d, r) => cnsAdd(a, cnsDir(d), r), mgNrm = a => ((a % 360) + 360) % 360;
const mgAd = (a, b) => Math.abs(((a - b) % 360 + 540) % 360 - 180), mgLd = (a, b) => { const d = mgAd(a, b); return Math.min(d, 180 - d); };
const mgMid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const mgProj = ([a, b], p) => { const v = [b[0] - a[0], b[1] - a[1]], L2 = v[0] ** 2 + v[1] ** 2 || 1, t = ((p[0] - a[0]) * v[0] + (p[1] - a[1]) * v[1]) / L2, tc = Math.max(0, Math.min(1, t)); return { q: [a[0] + v[0] * tc, a[1] + v[1] * tc], t }; };
const mgDseg = (s, p) => mgD(p, mgProj(s, p).q);
/* point where the ray from o in direction d leaves the board (inset m) */
const mgEdge = (o, d, m = .35) => { let t = 0; while (t < 40) { const q = mgP(o, d, t + .1); if (q[0] < m || q[1] < m || q[0] > MG_BW - m || q[1] > MG_BH - m) break; t += .1; } return mgP(o, d, t); };
const mgXCC = (c1, r1, c2, r2) => { const d = mgD(c1, c2); if (d < 1e-6 || d > r1 + r2 + 1e-6 || d < Math.abs(r1 - r2) - 1e-6) return []; const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r1 * r1 - a * a)), m = [c1[0] + a * (c2[0] - c1[0]) / d, c1[1] + a * (c2[1] - c1[1]) / d]; return [[m[0] + hh * (c2[1] - c1[1]) / d, m[1] - hh * (c2[0] - c1[0]) / d], [m[0] - hh * (c2[1] - c1[1]) / d, m[1] + hh * (c2[0] - c1[0]) / d]]; };
const mgXLC = (a, d, c, r) => { const v = mgU(d), f = [a[0] - c[0], a[1] - c[1]], B = 2 * (f[0] * v[0] + f[1] * v[1]), C = f[0] ** 2 + f[1] ** 2 - r * r, disc = B * B - 4 * C; if (disc < 0) return []; const sq = Math.sqrt(disc); return [(-B - sq) / 2, (-B + sq) / 2].map(t => mgP(a, d, t)); };

function mgBoard(T, cb = {}) {
  const W = MG_W, H = MG_H, K = MG_K, BW = MG_BW, BH = MG_BH, NS = 'http://www.w3.org/2000/svg', demo = !!cb.demo, teach = !cb.onOK && !demo;
  const TOOLS = T.tools || ['point', 'ruler', 'comp'];
  const X = p => [p[0] * K, H - p[1] * K], U = (x, y) => [x / K, (H - y) / K];
  let S = { pts: [], segs: [], arcs: [] }, hist = [], tool = demo ? 'none' : (T.tool0 || (TOOLS.includes('comp') ? 'comp' : TOOLS.includes('prot') ? 'prot' : 'ruler')), act = null, hover = null, done = false, hintT = 0, raf = 0, anim = null;
  const R0 = { o: T.rulO || [.9, .9], th: 0 }, P0 = { c: T.protC || [11.2, 1.2], rot: 0 }, C0 = { c: T.compC || [11.6, 5], r: 2, phi: 35 };
  const RUL = { o: R0.o.slice(), th: 0, len: T.rulLen || 10, out: tool === 'ruler' }, prot = { c: P0.c.slice(), rot: 0, out: tool === 'prot' }, comp = { c: C0.c.slice(), r: 2, phi: 35, out: tool === 'comp' };
  const wrap = h('div', { class: 'cnsf mgb rvl' + (teach ? ' teach' : '') + (demo ? ' demo' : '') }), board = h('div', { class: 'cns-board mg-paper ia' }), msg = h('div', { class: 'cns-msg' }), tbar = h('div', { class: 'cnsf-tools' });
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'cns-svg'); svg.setAttribute('aria-hidden', 'true');
  const layer = c => { const g = document.createElementNS(NS, 'g'); g.setAttribute('class', c); svg.append(g); return g; };
  const gObj = layer('cg-obj'), gTool = layer('cg-tool'), gLab = layer('cg-lab'), gUI = layer('cg-ui'); board.append(svg);
  const save = () => { hist.push(JSON.stringify(S)); if (hist.length > 80) hist.shift(); };
  const say2 = (t, ms = 0) => { msg.innerHTML = t; msg.classList.toggle('hint', !!ms); clearTimeout(hintT); if (ms) hintT = setTimeout(() => { msg.innerHTML = ''; msg.classList.remove('hint'); }, ms); };
  /* ---------- geometry ---------- */
  const D = mgD, ang = mgA, dir = mgU, nrm = mgNrm, adiff = mgAd, wrapD = d => ((d % 360) + 540) % 360 - 180;
  const clampB = (p, m = .25) => [Math.max(m, Math.min(BW - m, p[0])), Math.max(m, Math.min(BH - m, p[1]))], inB = (p, m = .1) => p[0] > m && p[1] > m && p[0] < BW - m && p[1] < BH - m;
  const P_ = i => [S.pts[i].x, S.pts[i].y], segPts = s => [P_(s.a), P_(s.b)];
  const onArc = (a, p) => { if (a.a1 - a.a0 >= 359) return true; return nrm(ang(P_(a.c), p) - a.a0) <= nrm(a.a1 - a.a0) + .05; };
  const projSeg = (s, p) => mgProj(s, p).q;
  const xSS = ([a, b], [c, d]) => { const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0]; if (Math.abs(den) < 1e-9) return []; const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den; return t > -1e-6 && t < 1 + 1e-6 && u > -1e-6 && u < 1 + 1e-6 ? [[a[0] + r[0] * t, a[1] + r[1] * t]] : []; };
  const xSC = ([a, b], c, r) => { const v = [b[0] - a[0], b[1] - a[1]], f = [a[0] - c[0], a[1] - c[1]], A = v[0] ** 2 + v[1] ** 2, B = 2 * (f[0] * v[0] + f[1] * v[1]), C = f[0] ** 2 + f[1] ** 2 - r * r, disc = B * B - 4 * A * C; if (disc < 0 || A < 1e-9) return []; const sq = Math.sqrt(disc); return [(-B - sq) / (2 * A), (-B + sq) / (2 * A)].filter(t => t > -1e-6 && t < 1 + 1e-6).map(t => [a[0] + v[0] * t, a[1] + v[1] * t]); };
  const inters = () => { const out = [], sg = S.segs.map(segPts), ac = S.arcs.map(a => ({ a, c: P_(a.c) }));
    for (let i = 0; i < sg.length; i++) for (let j = i + 1; j < sg.length; j++) out.push(...xSS(sg[i], sg[j]));
    for (let i = 0; i < ac.length; i++) for (let j = i + 1; j < ac.length; j++) out.push(...mgXCC(ac[i].c, ac[i].a.r, ac[j].c, ac[j].a.r).filter(p => onArc(ac[i].a, p) && onArc(ac[j].a, p)));
    sg.forEach(s => ac.forEach(o => out.push(...xSC(s, o.c, o.a.r).filter(p => onArc(o.a, p))))); return out; };
  const realPts = () => S.pts.filter(q => !q.mark && !q.edge).map(q => [q.x, q.y]);
  let pxcm = K;
  const at = e => { const m = svg.getScreenCTM(); pxcm = K * (m ? Math.hypot(m.a, m.b) : 1); const q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m.inverse()); return U(r.x, r.y); };
  const cm = px => px / pxcm;
  const magnet = (p, o = {}) => { const R1 = cm(o.px || 16);
    let best = null, bd = R1; inters().forEach(q => { const d = D(p, q); if (d < bd) { bd = d; best = { p: q, k: 'x' }; } }); if (best) return best;
    S.pts.forEach((q, i) => { if (q.edge || (q.mark && !o.marks)) return; const d = D(p, [q.x, q.y]); if (d < bd) { bd = d; best = { p: [q.x, q.y], k: 'pt', i }; } }); if (best) return best;
    if (o.ruler !== false && RUL.out) { const u = dir(RUL.th), t = (p[0] - RUL.o[0]) * u[0] + (p[1] - RUL.o[1]) * u[1], q = mgAdd(RUL.o, u, t), d = D(p, q); if (t > -.05 && t < RUL.len + .05 && d < cm(12)) { const tr = Math.round(t * 10) / 10; return { p: mgAdd(RUL.o, u, tr), k: 'rul', t: tr }; } }
    if (o.curve !== false) { let b2 = cm(9); S.segs.forEach(s => { const q = projSeg(segPts(s), p), d = D(p, q); if (d < b2) { b2 = d; best = { p: q, k: 'on' }; } }); S.arcs.forEach(a => { const c = P_(a.c), q = mgP(c, ang(c, p), a.r), d = D(p, q); if (d < b2 && onArc(a, q)) { b2 = d; best = { p: q, k: 'on' }; } }); if (best) return best; }
    return null; };
  const used = new Set(Object.keys((T.given || {}).pts || {}));
  const pool = () => (T.newNames || 'CDEFGHIJKLMNOPQRSTUVWXYZ').split('').find(c => !used.has(c)) || '?';
  const ptAt = (p, mark = false, auto = false, name = null) => { const i = S.pts.findIndex(q => !q.mark && !q.edge && D(p, [q.x, q.y]) < .03); if (i >= 0 && !mark) { if (!auto && !S.pts[i].name) { S.pts[i].auto = false; S.pts[i].name = name || pool(); used.add(S.pts[i].name); } return i; }
    const nm = mark || auto ? name : (name || pool()); if (nm) used.add(nm); S.pts.push({ x: p[0], y: p[1], mark, auto, name: nm }); return S.pts.length - 1; };
  /* ---------- given figure ---------- */
  { const g = T.given || {}, id = {}; Object.entries(g.pts || {}).forEach(([n, p]) => { S.pts.push({ x: p[0], y: p[1], name: n, given: true }); id[n] = S.pts.length - 1; });
    const edgePt = p => { S.pts.push({ x: p[0], y: p[1], edge: true, given: true }); return S.pts.length - 1; };
    (g.segs || []).forEach(([a, b]) => S.segs.push({ a: id[a], b: id[b], given: true, k: 'seg' }));
    (g.rays || []).forEach(([a, b]) => { const A = P_(id[a]), d = ang(A, P_(id[b])); S.segs.push({ a: id[a], b: edgePt(mgEdge(A, d)), given: true, k: 'ray' }); });
    (g.lines || []).forEach(([a, b]) => { const A = P_(id[a]), d = ang(A, P_(id[b])); S.segs.push({ a: edgePt(mgEdge(A, d + 180)), b: edgePt(mgEdge(A, d)), given: true, k: 'line' }); });
  }
  const S0 = JSON.stringify(S);
  /* ---------- helper api for goal checks ---------- */
  const mine = () => S.segs.filter(s => !s.given).map(segPts);
  const G = { P: n => { const q = S.pts.find(p => p.name === n && p.given); return q ? [q.x, q.y] : null; }, D, ang, dir, adiff, ldiff: mgLd, add: mgAdd, at: mgP,
    segs: mine, allSegs: () => S.segs.map(segPts), arcs: () => S.arcs.map(a => ({ c: P_(a.c), r: a.r, a0: a.a0, a1: a.a1 })), pts: realPts, xs: inters,
    hasPt: (q, tol = .15) => realPts().some(p => D(p, q) < tol) || S.pts.some(p => !p.mark && !p.edge && D([p.x, p.y], q) < tol),
    thru: (p, q, tol = .12) => mine().some(s => mgDseg(s, p) < tol && mgDseg(s, q) < tol),
    lineAt: (p, deg, tol = 1.6) => mine().some(s => mgDseg(s, p) < .14 && D(s[0], s[1]) > .8 && mgLd(ang(s[0], s[1]), deg) < tol),
    rayAt: (p, deg, tol = 1.6) => mine().some(s => { if (D(s[0], s[1]) < .8 || mgDseg(s, p) > .14) return false; return [0, 1].some(i => D(s[i], p) > .8 && adiff(ang(p, s[i]), deg) < tol); }),
    arcAt: (p, tol = .15) => S.arcs.filter(a => D(P_(a.c), p) < tol).map(a => ({ c: P_(a.c), r: a.r, a0: a.a0, a1: a.a1 })),
    nArcs: () => S.arcs.length, nSegs: () => mine().length,
    hasSeg: (p, q) => S.segs.some(s => { const P = segPts(s); return mgDseg(P, p) < .07 && mgDseg(P, q) < .07; }),
    tris: () => { const R = [], out = []; [...realPts(), ...inters()].forEach(q => { if (!R.some(r => D(r, q) < .05)) R.push(q); }); const con = (i, j) => G.hasSeg(R[i], R[j]); for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { if (!con(i, j)) continue; for (let k = j + 1; k < R.length; k++) { if (!con(i, k) || !con(j, k)) continue; const a = R[i], b = R[j], c = R[k], ar = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])); if (ar > .3) out.push([a, b, c]); } } return out; },
    ptName: (q, n) => { const i = S.pts.findIndex(p => !p.mark && !p.edge && D([p.x, p.y], q) < .2); if (i >= 0) { if (!S.pts[i].given) S.pts[i].name = n; return; } S.pts.push({ x: q[0], y: q[1], name: n }); } };
  /* ---------- hint / check ---------- */
  const sol = T.sol || [], cum = []; { let a = 0, s = 0; sol.forEach(st => { (st.ops || []).forEach(o => { if (o.t === 'arc') a++; if (o.t === 'seg') s++; }); cum.push({ a, s }); }); }
  const nextSay = () => { const na = S.arcs.length, ns = mine().length; const i = cum.findIndex(c => c.a > na || c.s > ns); return (sol[i < 0 ? sol.length - 1 : i] || {}).say || 'ลองใช้วงเวียนและสันตรงตามขั้นตอน'; };
  const finish = () => { RUL.out = prot.out = comp.out = false; tool = 'none'; act = null; hover = null; tbar.querySelectorAll('.cnsf-t').forEach(x => x.classList.remove('on')); };
  const success = r => { done = true; (T.marks || []).forEach(m => G.ptName(m.p, m.name)); ((r && r.names) || []).forEach(([q, n]) => G.ptName(q, n)); finish(); req(); say2(T.okMsg || '<b>สร้างเสร็จแล้ว!</b> 🎉'); sfx.ok(); cb.onOK && cb.onOK(); if (teach) { try { teachDone(wrap); } catch (_) { } } };
  const check = manual => { if (done || demo || !T.goal) return; let r = null; try { r = T.goal(G); } catch (e) { r = { ok: false }; } if (r && r.ok) return success(r);
    if (!manual) return; const why = (r && r.why) || 'ยังสร้างไม่ครบ'; sfx.no(); board.classList.remove('shake'); void board.offsetWidth; board.classList.add('shake'); say2(why + ' — 💡 ' + nextSay()); cb.onWrong && cb.onWrong(why); };
  const hint = () => { say2('💡 ' + nextSay(), 4000); sfx.pop(2); };
  /* ---------- drawing ---------- */
  const arcP = (c, r, a0, a1, cls = '') => { if (a1 - a0 >= 359.5) return `<circle cx="${X(c)[0]}" cy="${X(c)[1]}" r="${r * K}" fill="none" class="mg-arc ${cls}"/>`; const A = X(mgAdd(c, dir(a0), r)), B = X(mgAdd(c, dir(a1), r)); return `<path d="M${A} A${r * K} ${r * K} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${B}" fill="none" class="mg-arc ${cls}"/>`; };
  const arrow = (P, d) => { const a = X(P), u = dir(d), n = [-u[1], u[0]], b = (s, t) => [a[0] - (u[0] * s + n[0] * t) * 1, a[1] + (u[1] * s + n[1] * t) * 1]; return `<path d="M${b(12, 6)} L${a} L${b(12, -6)}" fill="none" stroke="#2B2550" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`; };
  const rulKT = () => { const u = dir(RUL.th), n = [-u[1], u[0]]; for (let t = RUL.len + .05; t > 1; t -= .25) { const q = mgAdd(mgAdd(RUL.o, u, t), n, -.55); if (inB(q, .35)) return t; } return 1.2; };
  const rulVis = () => { const u = dir(RUL.th), n = [-u[1], u[0]]; let c = 0; for (let t = 0; t <= RUL.len; t += .5) if (inB(mgAdd(mgAdd(RUL.o, u, t), n, -.55), .2)) c++; return c >= 4; };
  const rulerG = on => { const u = dir(RUL.th), n = [-u[1], u[0]], q = (t, o) => X(mgAdd(mgAdd(RUL.o, u, t), n, o)); let s = `<g class="cns-ruler ${on ? 'on' : 'off'}"><path d="M${q(-.4, 0)} L${q(RUL.len + .4, 0)} L${q(RUL.len + .4, -1.1)} L${q(-.4, -1.1)} Z" fill="#FFE9A8" fill-opacity=".88" stroke="#C98612" stroke-width="1.5"/>`;
    for (let t = 0; t <= RUL.len + 1e-9; t += .1) { const tt = Math.round(t * 10), L = tt % 10 === 0 ? -.42 : tt % 5 === 0 ? -.3 : -.18; s += `<path d="M${q(t, 0)} L${q(t, L)}" stroke="#8A5A1E" stroke-width="${tt % 10 ? .7 : 1.3}"/>`; if (tt % 10 === 0) s += `<text x="${q(t, -.66)[0]}" y="${q(t, -.66)[1] + 4}" text-anchor="middle" class="cns-rt">${tt / 10}</text>`; }
    const kb = q(rulKT(), -.55); return s + (on && !demo ? `<circle cx="${kb[0]}" cy="${kb[1]}" r="13" fill="#C98612"/><text x="${kb[0]}" y="${kb[1] + 5}" text-anchor="middle" class="cns-ico">⟳</text>` : '') + '</g>'; };
  const protG = on => { const R = 2.7, q = (deg, r) => X(mgAdd(prot.c, dir(prot.rot + deg), r)); let s = `<g class="cns-prot ${on ? 'on' : 'off'}"><path d="M${q(0, R)} A${R * K} ${R * K} 0 0 0 ${q(180, R)} Z" fill="#CFE6FF" fill-opacity=".55" stroke="#3D8BD9" stroke-width="1.6"/><path d="M${q(0, R)} L${q(180, R)}" stroke="#3D8BD9" stroke-width="1.6"/>`;
    for (let a = 0; a <= 180; a += 5) s += `<path d="M${q(a, R)} L${q(a, R - (a % 10 ? .14 : a % 30 ? .22 : .34))}" stroke="#2B6FB8" stroke-width="1.1"/>`;
    for (let a = 0; a <= 180; a += 30) s += `<text x="${q(a, R - .55)[0]}" y="${q(a, R - .55)[1] + 4}" text-anchor="middle" class="cns-pt">${a}</text><text x="${q(a, R - 1.05)[0]}" y="${q(a, R - 1.05)[1] + 4}" text-anchor="middle" class="cns-pt in">${180 - a}</text>`;
    const C = X(prot.c), RK = q(0, R + .55); return s + `<circle cx="${C[0]}" cy="${C[1]}" r="4" fill="#2B6FB8"/>` + (on && !demo ? `<circle cx="${RK[0]}" cy="${RK[1]}" r="13" fill="#3D8BD9"/><text x="${RK[0]}" y="${RK[1] + 5}" text-anchor="middle" class="cns-ico">⟳</text>` : '') + '</g>'; };
  const compGeo = () => { const C = X(comp.c), Pn = X(mgAdd(comp.c, dir(comp.phi), comp.r)), M = [(C[0] + Pn[0]) / 2, (C[1] + Pn[1]) / 2], L = Math.hypot(Pn[0] - C[0], Pn[1] - C[1]) || 1, n = [-(Pn[1] - C[1]) / L, (Pn[0] - C[0]) / L], hh = Math.max(34, 90 - L * .15);
    let up = n[1] < 0 ? n : [-n[0], -n[1]]; const ok = u => { const k = [M[0] + u[0] * (hh + 24), M[1] + u[1] * (hh + 24)]; return k[0] > 16 && k[1] > 16 && k[0] < W - 16 && k[1] < H - 16; }; if (!ok(up) && ok([-up[0], -up[1]])) up = [-up[0], -up[1]];
    const Hn = [M[0] + up[0] * hh, M[1] + up[1] * hh], Kn = [Hn[0] + up[0] * 24, Hn[1] + up[1] * 24]; return { C, Pn, Hn, Kn }; };
  const compG = on => { const { C, Pn, Hn, Kn } = compGeo(); return `<g class="cns-comp ${on ? 'on' : 'off'}"><path d="M${C} L${Hn} L${Pn}" fill="none" stroke="#5B5F7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${Hn[0]}" cy="${Hn[1]}" r="6" fill="#7E6ED6"/><path d="M${Hn} L${Kn}" stroke="#7E6ED6" stroke-width="6" stroke-linecap="round"/><circle cx="${C[0]}" cy="${C[1]}" r="3.5" fill="#2B2550"/><circle cx="${Pn[0]}" cy="${Pn[1]}" r="6" fill="#E5487A"/>`
      + (on ? (demo ? '' : `<circle cx="${Kn[0]}" cy="${Kn[1]}" r="14" fill="#7E6ED6"/><text x="${Kn[0]}" y="${Kn[1] + 5}" text-anchor="middle" class="cns-ico">⟳</text>`) + `<text x="${Pn[0] + 14}" y="${Pn[1] + 24}" class="cns-read">รัศมี ${mgF(comp.r)} ซม.</text>` : '') + '</g>'; };
  const render = () => { raf = 0; let s = '', lab = '';
    S.arcs.forEach(a => { s += arcP(P_(a.c), a.r, a.a0, a.a1); });
    S.segs.forEach(sg => { const P = segPts(sg); s += `<path d="M${X(P[0])} L${X(P[1])}" stroke="#2B2550" stroke-width="${sg.given ? 3.2 : 2.6}" stroke-linecap="round"/>`; if (sg.k === 'ray' || sg.k === 'line') s += arrow(P[1], ang(P[0], P[1])); if (sg.k === 'line') s += arrow(P[0], ang(P[1], P[0])); });
    if (act && act.t === 'pen') s += `<path d="M${X(act.a)} L${X(act.e)}" stroke="#E5487A" stroke-width="2.8" stroke-linecap="round"/>`;
    if (act && act.t === 'sweep') s += arcP(comp.c, comp.r, Math.min(act.a0, act.a1), Math.max(act.a0, act.a1), 'cns-live');
    const deg = S.pts.map(() => 0); S.segs.forEach(sg => { deg[sg.a]++; deg[sg.b]++; }); S.arcs.forEach(a => { deg[a.c] += 2; });
    S.pts.forEach((p, i) => { if (p.edge) return; const q = X([p.x, p.y]); if (p.mark) { s += `<path d="M${q[0] - 5} ${q[1] - 5} l10 10 M${q[0] + 5} ${q[1] - 5} l-10 10" stroke="#E5487A" stroke-width="2.4"/>`; return; }
      if (p.name) { s += `<circle cx="${q[0]}" cy="${q[1]}" r="${p.given ? 5.5 : 5}" fill="${p.given ? '#2B2550' : '#E5487A'}"/>`; const lp = p.lab || [-16, -10]; lab += `<text x="${q[0] + lp[0]}" y="${q[1] + lp[1]}" class="cns-n">${p.name}</text>`; }
      else s += deg[i] >= 2 || done ? `<circle cx="${q[0]}" cy="${q[1]}" r="2.6" fill="#9A93C4"/>` : `<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#fff" stroke="#9A93C4" stroke-width="2"/>`; });
    gObj.innerHTML = s;
    gTool.innerHTML = (RUL.out ? rulerG(tool === 'ruler') : '') + (prot.out ? protG(tool === 'prot') : '') + (comp.out ? compG(tool === 'comp') : '');
    gLab.innerHTML = lab + (done && T.measure ? T.measure(G, X) : '');
    let u = ''; if (act && act.t === 'pen') { const e = X(act.e); u += `<text x="${e[0] + 12}" y="${e[1] - 16}" class="cns-read">${mgF(D(act.a, act.e))} ซม.</text>`; if (act.snapE) u += `<circle cx="${e[0]}" cy="${e[1]}" r="11" fill="none" stroke="#E5487A" stroke-width="2" stroke-dasharray="3 3"/>`; }
    if (hover && !act && tool === 'point' && !done) { const q = X(hover.p); u += hover.k ? `<circle cx="${q[0]}" cy="${q[1]}" r="11" fill="none" stroke="#E5487A" stroke-width="2" stroke-dasharray="3 3"/>` : ''; u += `<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#E5487A" fill-opacity=".45"/>`; }
    gUI.innerHTML = u; };
  const req = () => { if (!raf) raf = requestAnimationFrame(render); };
  /* ---------- hit tests ---------- */
  const near = (p, q, px) => D(p, q) <= cm(px);
  const rulLocal = p => { const u = dir(RUL.th), v = [p[0] - RUL.o[0], p[1] - RUL.o[1]]; return { t: v[0] * u[0] + v[1] * u[1], n: v[0] * -u[1] + v[1] * u[0] }; };
  const rulKnob = () => { const u = dir(RUL.th), n = [-u[1], u[0]]; return mgAdd(mgAdd(RUL.o, u, rulKT()), n, -.55); };
  const protKnob = () => mgAdd(prot.c, dir(prot.rot), 3.25);
  const compPts = () => { const g = compGeo(); return { c: comp.c, pen: mgAdd(comp.c, dir(comp.phi), comp.r), hinge: U(g.Hn[0], g.Hn[1]), knob: U(g.Kn[0], g.Kn[1]) }; };
  const dSeg = (p, a, b) => D(p, projSeg([a, b], p));
  const penStart = p => { const u = dir(RUL.th), nv = [-u[1], u[0]], L = rulLocal(p); let best = null, bd = cm(20);
    [...realPts(), ...inters()].forEach(q => { const Lq = rulLocal(q); if (Math.abs(Lq.n) > .4 || Lq.t < -.7 || Lq.t > RUL.len + .05) return; const d = D(p, q); if (d < bd) { bd = d; best = { q, Lq }; } });
    if (best) { if (Math.abs(best.Lq.n) > 1e-4) RUL.o = mgAdd(RUL.o, nv, best.Lq.n); let t = best.Lq.t; if (t < 0) { RUL.o = mgAdd(RUL.o, u, t); t = 0; } return { p: best.q, t, snap: true }; }
    const t = Math.max(0, Math.min(RUL.len, Math.round(L.t * 10) / 10)); return { p: mgAdd(RUL.o, u, t), t, snap: false }; };
  const penMove = p => { const a = act; RUL.o = a.o0.slice(); RUL.th = a.th0; const u = dir(RUL.th), L = rulLocal(p);
    let best = null, bd = cm(20); [...realPts(), ...inters(), ...S.pts.filter(q => q.mark).map(q => [q.x, q.y])].forEach(q => { if (D(q, a.a) < .3) return; const d = D(p, q); if (d >= bd) return; const th = ang(a.a, q), tq = a.ta + D(a.a, q); if (adiff(th, a.th0) > 10 || tq > RUL.len + .05) return; bd = d; best = { q, th }; });
    if (best) { RUL.th = best.th; RUL.o = mgAdd(a.a, dir(best.th), -a.ta); a.e = best.q; a.snapE = true; return; }
    let t = Math.max(0, Math.min(RUL.len, Math.round(L.t * 10) / 10)); a.e = mgAdd(RUL.o, u, t); a.snapE = false; };
  const align = (c, th) => { let best = th, bd = 3.5; [...S.pts.filter(q => !q.edge).map(q => [q.x, q.y]), ...inters()].forEach(q => { if (D(q, c) < .8) return; const a = ang(c, q); if (adiff(a, th) < bd) { bd = adiff(a, th); best = a; } }); if (best !== th) return best;
    bd = 2.5; S.segs.forEach(sg => { const P = segPts(sg), a = ang(P[0], P[1]); [a, a + 180].forEach(x => { if (adiff(x, th) < bd) { bd = adiff(x, th); best = nrm(x); } }); });
    [0, 90, 180, 270].forEach(a => { if (adiff(a, best) < 1.5) best = a; }); return best; };
  const resetIfLost = k => { if (k === 'ruler' && !rulVis()) { RUL.o = R0.o.slice(); RUL.th = 0; } if (k === 'prot' && !inB(prot.c, .2)) { prot.c = P0.c.slice(); prot.rot = 0; } if (k === 'comp' && !inB(comp.c, .2)) { comp.c = C0.c.slice(); comp.r = C0.r; comp.phi = C0.phi; } };
  /* ---------- pointer ---------- */
  svg.addEventListener('pointerdown', e => { if (done || demo || anim) return; e.preventDefault(); e.stopPropagation(); const p = at(e); try { svg.setPointerCapture(e.pointerId); } catch (_) { } const sx = e.clientX, sy = e.clientY;
    if (tool === 'ruler') { RUL.out = true; const L = rulLocal(p);
      if (near(p, rulKnob(), 26)) { act = { t: 'rrot', last: ang(RUL.o, p), th0: RUL.th, o0: RUL.o.slice() }; return; }
      if (L.t > -.5 && L.t < RUL.len + .5 && L.n > -1.1 - cm(8) && L.n < cm(26)) { if (L.n > -cm(6)) { const o0 = RUL.o.slice(), st = penStart(p); act = { t: 'pen', a: st.p, ta: st.t, e: st.p, snapA: st.snap, snapE: false, o0: RUL.o.slice(), th0: RUL.th, oBefore: o0 }; req(); return; }
        act = { t: 'rmove', d: [p[0] - RUL.o[0], p[1] - RUL.o[1]] }; return; }
      return; }
    if (tool === 'prot') { prot.out = true;
      if (near(p, protKnob(), 26)) { act = { t: 'prot', last: ang(prot.c, p) }; return; }
      const r = D(prot.c, p), a = nrm(ang(prot.c, p) - prot.rot); if (r < 3 && (a <= 180 || r < cm(18))) { act = { t: 'pdown', p, sx, sy, d: [p[0] - prot.c[0], p[1] - prot.c[1]] }; return; }
      return; }
    if (tool === 'comp') { comp.out = true; const K3 = compPts();
      if (near(p, K3.knob, 24) && D(p, K3.knob) < D(p, K3.hinge)) { act = { t: 'sweep', a0: comp.phi, a1: comp.phi, last: ang(comp.c, p) }; return; }
      if (near(p, K3.pen, 26)) { act = { t: 'cpen', sp: p, r0: comp.r, phi0: comp.phi, mode: null }; return; }
      if (near(p, K3.c, 26) || dSeg(p, K3.c, K3.hinge) < cm(18) || dSeg(p, K3.hinge, K3.pen) < cm(18) || near(p, K3.hinge, 22)) { act = { t: 'cmove', d: [p[0] - comp.c[0], p[1] - comp.c[1]], body: !near(p, K3.c, 26) }; return; }
      return; }
    if (tool === 'point') { act = { t: 'tap', sx, sy }; } });
  svg.addEventListener('pointermove', e => { if (demo || anim) return; const p = at(e);
    if (!act) { if (tool === 'point' && !done) { const m = magnet(p, { marks: false }); hover = m ? { p: m.p, k: m.k } : { p, k: null }; req(); } return; }
    if (act.t === 'pen') { penMove(p); req(); return; }
    if (act.t === 'rmove') { const pc = clampB(p, .15); let o = [pc[0] - act.d[0], pc[1] - act.d[1]]; const m = magnet(o, { px: 24, marks: true, ruler: false, curve: false }); if (m) o = m.p; RUL.o = o; req(); return; }
    if (act.t === 'rrot') { const now = ang(RUL.o, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; act.raw = (act.raw ?? RUL.th) + d; const prev = RUL.th; RUL.th = align(RUL.o, act.raw); if (!rulVis()) RUL.th = prev; req(); return; }
    if (act.t === 'pdown') { if (Math.hypot(e.clientX - act.sx, e.clientY - act.sy) > 7) act = { t: 'pmove', d: act.d }; else return; }
    if (act.t === 'pmove') { const pc = clampB(p, .15); let c = clampB([pc[0] - act.d[0], pc[1] - act.d[1]], .2); const m = magnet(c, { px: 22, marks: false, ruler: false, curve: false }); if (m) c = m.p; prot.c = c; req(); return; }
    if (act.t === 'prot') { const now = ang(prot.c, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; act.raw = (act.raw ?? prot.rot) + d; let r = act.raw, bd = 3; S.segs.forEach(sg => { const P = segPts(sg); [0, 1].forEach(i => { if (D(P[i], prot.c) < .06) { const dq = ang(prot.c, P[1 - i]); [dq, dq + 180].forEach(x => { if (adiff(r, x) < bd) { bd = adiff(r, x); r = x; } }); } }); if (mgDseg(P, prot.c) < .06) { const dq = ang(P[0], P[1]); [dq, dq + 180].forEach(x => { if (adiff(r, x) < bd) { bd = adiff(r, x); r = x; } }); } }); [0, 90, 180, 270].forEach(dq => { if (adiff(r, dq) < 1.5) r = dq; }); prot.rot = r; req(); return; }
    if (act.t === 'cmove') { const pc = clampB(p, .15); let c = clampB([pc[0] - act.d[0], pc[1] - act.d[1]], .2); const m = magnet(c, { px: act.body ? 26 : 22, marks: false, ruler: false, curve: false }); if (m) c = m.p; comp.c = c; const pn = mgAdd(comp.c, dir(comp.phi), comp.r); if (!inB(pn, .4)) comp.phi = ang(comp.c, [BW / 2, BH / 2]); req(); return; }
    if (act.t === 'cpen') { if (!act.mode) { if (D(p, act.sp) < cm(14)) return; const dr = Math.abs(D(comp.c, p) - act.r0); act.mode = dr < cm(4) && act.r0 >= .8 ? 'draw' : 'rad'; if (act.mode === 'draw') { act = { t: 'sweep', a0: act.phi0, a1: act.phi0, last: act.phi0 }; } }
      if (act.t === 'cpen') { let r = Math.round(D(comp.c, p) * 10) / 10; const m = magnet(p, { px: 18, marks: false, ruler: false, curve: false }); if (m && m.k !== 'on') r = D(comp.c, m.p); /* ขาดินสอดูดเข้าจุด = กางรัศมีเท่าระยะถึงจุดนั้นพอดี (ลอกความยาว) */ comp.r = Math.max(.5, Math.min(9, r)); comp.phi = ang(comp.c, m && m.k !== 'on' ? m.p : p); req(); return; } }
    if (act.t === 'sweep') { if (D(comp.c, p) < cm(20)) return; const now = ang(comp.c, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; comp.phi += d; act.a1 = comp.phi; req(); } });
  const up = e => { if (!act) return; const a = act; act = null; const p = e && e.clientX != null ? at(e) : null;
    if (a.t === 'pen') { if (D(a.a, a.e) >= .2) { save(); const i = ptAt(a.a, false, true), j = ptAt(a.e, false, true); S.segs.push({ a: i, b: j }); sfx.pop(5); } else { RUL.o = a.oBefore || RUL.o; } req(); check(); return; }
    if (a.t === 'sweep') { const lo = Math.min(a.a0, a.a1), hi = Math.max(a.a0, a.a1); if (hi - lo > 3) { save(); const ci = S.pts.findIndex(q => !q.mark && !q.edge && D([q.x, q.y], comp.c) < .03), c = ci >= 0 ? ci : ptAt(comp.c, false, true); S.arcs.push({ c, r: comp.r, a0: lo, a1: Math.min(lo + 360, hi) }); sfx.pop(6); } req(); check(); return; }
    if (a.t === 'pdown' && p) { const r = D(prot.c, p), ag = nrm(ang(prot.c, p) - prot.rot); if (r > 1.5 && r < 3.2 && ag <= 181) { save(); const dg = Math.round(Math.min(180, ag)); S.pts.push({ x: prot.c[0] + Math.cos((prot.rot + dg) * Math.PI / 180) * 2.7, y: prot.c[1] + Math.sin((prot.rot + dg) * Math.PI / 180) * 2.7, mark: true, deg: dg }); sfx.pop(4); say2(`ทำเครื่องหมายที่ ${dg}° แล้ว — ต่อไปใช้สันตรงลากจากจุดยอดผ่านเครื่องหมาย ✕`); } req(); check(); return; }
    if (a.t === 'tap' && p && e && Math.hypot(e.clientX - a.sx, e.clientY - a.sy) < 10) { const m = magnet(p, { marks: false }); save(); ptAt(m ? m.p : p); sfx.pop(3); hover = null; req(); check(); return; }
    req(); };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', () => { if (act && act.t === 'pen') { RUL.o = act.oBefore || RUL.o; RUL.th = act.th0; } act = null; req(); }); svg.addEventListener('pointerleave', () => { if (!act) { hover = null; req(); } }); svg.addEventListener('click', e => e.stopPropagation());
  /* ---------- ops (เฉลย / ตัวอย่างเคลื่อนไหว) ---------- */
  const doOp = (op, slow, k) => {
    const fin = () => { req(); slow ? setTimeout(k, 260) : k(); };
    if (op.t === 'pt') { G.ptName(op.p, op.name); used.add(op.name); return fin(); }
    if (op.t === 'prot') { prot.out = true; prot.c = op.c.slice(); prot.rot = op.rot || 0; if (slow) tool = 'prot'; return fin(); }
    if (op.t === 'mark') { S.pts.push({ x: op.c[0] + Math.cos((op.rot + op.deg) * Math.PI / 180) * 2.7, y: op.c[1] + Math.sin((op.rot + op.deg) * Math.PI / 180) * 2.7, mark: true, deg: op.deg }); return fin(); }
    if (op.t === 'away') { RUL.out = prot.out = comp.out = false; tool = 'none'; return fin(); }
    if (op.t === 'seg') { const L = D(op.a, op.b), th = ang(op.a, op.b), push = () => { const i = ptAt(op.a, false, true), j = ptAt(op.b, false, true); S.segs.push({ a: i, b: j }); };
      if (!slow) { push(); return fin(); }
      tool = 'ruler'; RUL.out = true; RUL.len = Math.max(T.rulLen || 10, Math.ceil(L + .4)); RUL.th = th; RUL.o = op.a.slice(); const t0 = performance.now(), dur = 300 + L * 70;
      const step = now => { const f = Math.min(1, (now - t0) / dur); act = { t: 'pen', a: op.a, e: mgP(op.a, th, L * f) }; render(); if (f < 1) anim = requestAnimationFrame(step); else { act = null; anim = null; push(); sfx.pop(5); fin(); } }; anim = requestAnimationFrame(step); return; }
    if (op.t === 'arc') { const push = () => { const ci = S.pts.findIndex(q => !q.mark && !q.edge && D([q.x, q.y], op.c) < .03), c = ci >= 0 ? ci : ptAt(op.c, false, true); S.arcs.push({ c, r: op.r, a0: Math.min(op.a0, op.a1), a1: Math.max(op.a0, op.a1) }); };
      if (!slow) { push(); return fin(); }
      tool = 'comp'; comp.out = true; comp.c = op.c.slice(); comp.r = op.r; comp.phi = op.a0; const t0 = performance.now(), dur = 500 + Math.abs(op.a1 - op.a0) * 4;
      const step = now => { const f = Math.min(1, (now - t0) / dur); comp.phi = op.a0 + (op.a1 - op.a0) * f; act = { t: 'sweep', a0: op.a0, a1: comp.phi }; render(); if (f < 1) anim = requestAnimationFrame(step); else { act = null; anim = null; push(); sfx.pop(6); fin(); } }; anim = requestAnimationFrame(step); return; }
    fin(); };
  const runOps = (ops, slow, k) => { let i = 0; const nx = () => { if (i >= ops.length) { req(); return k && k(); } doOp(ops[i++], slow, nx); }; nx(); };
  /* ---------- tools / buttons ---------- */
  const TIPS = { point: 'แตะตรงไหนก็ได้ ได้จุดตรงนั้น (ใกล้จุดตัดจะดูดติดให้)', ruler: 'จับแถบตัวเลขลากเพื่อย้าย · ปุ่ม ⟳ หมุน · ลากตามขอบบน = ลากเส้น (เส้นตรงนิ่ง ไม่สั่น)', prot: 'ลากครึ่งวงกลมให้จุดศูนย์กลางตรงจุดยอดมุม · ⟳ หมุนให้ 0° ทับแขนมุม · แตะที่ขอบ = ทำเครื่องหมายองศา', comp: 'จับเข็มวางที่จุด · ลากขาดินสอ (ชมพู) เข้า-ออก = กางรัศมี · ลากขาดินสอวน หรือหมุนปุ่ม ⟳ = เขียนส่วนโค้ง' };
  const LAB = { point: ['tap', 'จุด'], ruler: ['ruler', T.edgeName || 'สันตรง (ไม้บรรทัด)'], prot: ['prot', 'ครึ่งวงกลม'], comp: ['compass', 'วงเวียน'] };
  const setOn = k => tbar.querySelectorAll('.cnsf-t').forEach(x => x.classList.toggle('on', x.dataset.k === k));
  const tb = key => h('button', { class: 'btn sm ia cnsf-t' + (tool === key ? ' on' : ''), 'data-k': key, onclick: e => { e.stopPropagation(); if (done || anim) return; tool = key; if (key === 'prot') prot.out = true; if (key === 'comp') comp.out = true; if (key === 'ruler') RUL.out = true; resetIfLost(key); setOn(key); say2(TIPS[key], 5000); req(); } }, h('span', { class: 'cns-ti ' + LAB[key][0] }), h('span', null, LAB[key][1]));
  const head = T.title ? h('div', { class: 'cns-head mg-head', html: T.title }) : '';
  if (demo) { let k = 0; const stepB = h('button', { class: 'btn info ia mg-next' }, icon('right'), h('span', null, 'ขั้นต่อไป'));
    const cnt = h('small', { class: 'mg-cnt' }, `ขั้นที่ 0 / ${sol.length}`), list = h('ol', { class: 'mg-steps' });
    stepB.onclick = e => { e.stopPropagation(); if (anim || k >= sol.length) return; const st = sol[k++]; cnt.textContent = `ขั้นที่ ${k} / ${sol.length}`; list.querySelectorAll('li').forEach(li => li.classList.remove('now')); list.append(h('li', { class: 'now', html: st.say })); say2(''); sfx.page && sfx.page();
      try { say(String(st.say).replace(/<[^>]+>/g, ''), true); } catch (_) { }
      stepB.disabled = true; runOps(st.ops || [], true, () => { stepB.disabled = false; if (k >= sol.length) { done = true; (T.marks || []).forEach(m => G.ptName(m.p, m.name)); if (!T.keepTools) RUL.out = prot.out = comp.out = false; req(); stepB.remove(); say2(T.summary || T.okMsg || 'เสร็จแล้ว'); sfx.ok(); try { teachDone(wrap); } catch (_) { } } }); };
    tbar.classList.add('mg-demo'); tbar.append(cnt, list, stepB); }
  else { TOOLS.forEach(k => tbar.append(tb(k)));
    tbar.append(h('button', { class: 'btn sm ia cnsf-u', onclick: e => { e.stopPropagation(); if (done || !hist.length) return; S = JSON.parse(hist.pop()); sfx.page(); req(); } }, icon('undo'), h('span', null, 'ย้อนกลับ')),
      h('button', { class: 'btn sm ia cnsf-h', onclick: e => { e.stopPropagation(); if (!done) hint(); } }, icon('sparkle'), h('span', null, 'คำใบ้')));
    if (T.goal && T.manual !== false) tbar.append(h('button', { class: 'btn sm ia primary mg-chk', onclick: e => { e.stopPropagation(); check(true); } }, icon('check'), h('span', null, 'ตรวจ')));
    if (teach) tbar.append(h('button', { class: 'btn sm ia cnsf-r', onclick: e => { e.stopPropagation(); if (done) return; wrap.reveal(); try { teachDone(wrap); } catch (_) { } } }, icon('eye'), h('span', null, 'ดูเฉลย'))); }
  wrap.append(h('div', { class: 'cns-side' }, head, tbar, msg), board);
  wrap.selfTest = () => { S = JSON.parse(S0); runOps(sol.flatMap(s => s.ops || []), false); const r = T.goal ? T.goal(G) : { ok: true }; S = JSON.parse(S0); return r; }; /* ตรวจว่าเฉลยผ่าน goal (tests) */
  wrap.reveal = () => { if (done) return; S = JSON.parse(S0); hist = []; runOps(sol.flatMap(s => s.ops || []), false); done = true; (T.marks || []).forEach(m => G.ptName(m.p, m.name)); finish(); req(); say2('ดูเฉลย: ' + (T.revealMsg || 'ทำตามขั้นตอนนี้')); };
  wrap._t = { S: () => S, G, RUL, prot, comp, X, U, setTool: k => tbar.querySelector(`[data-k="${k}"]`)?.click(), done: () => done, rulKnob, protKnob, compPts, render, check };
  render(); if (!demo) say2(T.start || 'เลือกอุปกรณ์ แล้วลงมือสร้างได้เลย'); return wrap;
}

/* ---------- static figure (questions, cards) ---------- */
function mgFig(f, o = {}) {
  const P = {}; Object.entries(f.pts || {}).forEach(([n, p]) => P[n] = p); const at = v => typeof v === 'string' ? P[v] : v;
  const all = Object.values(P).slice(); (f.arcs || []).forEach(([c, r]) => { const C = at(c); all.push([C[0] - r, C[1] - r], [C[0] + r, C[1] + r]); }); (f.extra || []).forEach(p => all.push(p));
  const xs = all.map(p => p[0]), ys = all.map(p => p[1]), pad = o.pad ?? .9, x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad, K = 40, Wd = (x1 - x0) * K, Ht = (y1 - y0) * K;
  const Xp = p => [(p[0] - x0) * K, (y1 - p[1]) * K], L = (a, b, w = 2.6, c = '#2B2550', ex = '') => `<path d="M${Xp(a)} L${Xp(b)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${ex}/>`;
  const arw = (p, d) => { const a = Xp(p), u = mgU(d); const b = (s, t) => [a[0] - u[0] * s + u[1] * t, a[1] + u[1] * s + u[0] * t]; return `<path d="M${b(11, 5.5)} L${a} L${b(11, -5.5)}" fill="none" stroke="#2B2550" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`; };
  let s = '';
  (f.arcs || []).forEach(([c, r, a0, a1, col]) => { const C = at(c), A = Xp(mgP(C, a0, r)), B = Xp(mgP(C, a1, r)); s += a1 - a0 >= 359 ? `<circle cx="${Xp(C)[0]}" cy="${Xp(C)[1]}" r="${r * K}" fill="none" stroke="${col || '#7E6ED6'}" stroke-width="2"/>` : `<path d="M${A} A${r * K} ${r * K} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${B}" fill="none" stroke="${col || '#7E6ED6'}" stroke-width="2"/>`; });
  (f.fill || []).forEach(([pts, col]) => { s += `<path d="M${pts.map(n => Xp(at(n))).join(' L')} Z" fill="${col || '#FFD27A'}" fill-opacity=".55"/>`; });
  (f.dash || []).forEach(([a, b]) => { s += L(at(a), at(b), 2, '#9790B0', 'stroke-dasharray="6 5"'); });
  (f.segs || []).forEach(([a, b, col]) => { s += L(at(a), at(b), 2.8, col || undefined); });
  (f.rays || []).forEach(([a, b, col, ext]) => { const A = at(a), B = at(b), d = mgA(A, B), E = mgP(A, d, mgD(A, B) + (ext ?? .8)); s += L(A, E, 2.8, col || undefined) + arw(E, d); });
  (f.lines || []).forEach(([a, b, ext]) => { const A = at(a), B = at(b), d = mgA(A, B), e = ext ?? .8, E1 = mgP(A, d + 180, e), E2 = mgP(B, d, e); s += L(E1, E2, 2.8) + arw(E2, d) + arw(E1, d + 180); });
  (f.angs || []).forEach(([v, a, b, lab, col, rr, fo]) => { const V = at(v), d0 = mgA(V, at(a)), d1 = mgA(V, at(b)); let lo = d0, sw = mgNrm(d1 - d0); if (sw > 180 && !o.reflex) { lo = d1; sw = 360 - sw; } const r = rr || .65, A = Xp(mgP(V, lo, r)), B = Xp(mgP(V, lo + sw, r)), T = Xp(mgP(V, lo + sw / 2, r + .55));
    s += Math.abs(sw - 90) < .5 && !lab ? `<path d="M${Xp(mgP(V, lo, .45))} L${Xp(mgAdd(mgP(V, lo, .45), mgU(lo + 90), .45))} L${Xp(mgP(V, lo + 90, .45))}" fill="none" stroke="${col || '#C25B00'}" stroke-width="2"/>` : (fo ? `<path d="M${Xp(V)} L${A} A${r * K} ${r * K} 0 ${sw > 180 ? 1 : 0} 0 ${B} Z" fill="${col}" fill-opacity="${fo}"/>` : '') + `<path d="M${A} A${r * K} ${r * K} 0 ${sw > 180 ? 1 : 0} 0 ${B}" fill="none" stroke="${col || '#C25B00'}" stroke-width="2.2"/>`;
    if (lab) s += `<text x="${T[0]}" y="${T[1] + 5}" text-anchor="middle" class="mg-fl">${lab}</text>`; });
  (f.ticks || []).forEach(([a, b, n]) => { const A = at(a), B = at(b), m = mgMid(A, B), d = mgA(A, B); for (let i = 0; i < (n || 1); i++) { const c = mgP(m, d, (i - ((n || 1) - 1) / 2) * .16); s += L(mgP(c, d + 90, .18), mgP(c, d - 90, .18), 2, '#C25B00'); } });
  (f.labs || []).forEach(([p, t, dx = 0, dy = 0]) => { const q = Xp(at(p)); s += `<text x="${q[0] + dx}" y="${q[1] + dy}" text-anchor="middle" class="mg-fl">${t}</text>`; });
  Object.entries(P).forEach(([n, p]) => { if ((f.hide || []).includes(n)) return; const q = Xp(p), off = (f.off || {})[n] || [-13, -9]; s += `<circle cx="${q[0]}" cy="${q[1]}" r="4.2" fill="#2B2550"/>`; if (!/^_/.test(n)) s += `<text x="${q[0] + off[0]}" y="${q[1] + off[1]}" class="mg-fn">${n}</text>`; });
  return `<svg class="mg-fig${o.cls ? ' ' + o.cls : ''}" viewBox="0 0 ${Wd.toFixed(0)} ${Ht.toFixed(0)}" style="max-width:${Math.min(o.max || 460, Wd)}px" aria-hidden="true">${s}</svg>`;
}
/* symbol: ส่วนของเส้นตรง (ขีดบน) รังสี (ลูกศรขวา) เส้นตรง (ลูกศรสองข้าง) มุม ∠ */
const mgSym = (k, t) => k === 'ang' ? `∠${t}` : k === 'line' ? `<span class="mg-sym line"><b class="mg-la"></b>${t}</span>` : `<span class="mg-sym ${k}">${t}</span>`;

/* =========================================================
   งานสร้าง (tasks) — พิกัดเป็น ซม. บนกระดาษ 14.5 × 9.5 · ทุกงานมีเฉลยทีละขั้น (sol) ที่ใช้ทั้งตัวอย่างและดูเฉลย
   ========================================================= */
const mgCov = (a, deg) => a.a1 - a.a0 >= 359 || mgNrm(deg - a.a0) <= mgNrm(a.a1 - a.a0) + 1;
const mgEqPair = (L1, L2, rmin = 0) => L1.some(a => L2.some(b => Math.abs(a.r - b.r) < .12 && a.r > rmin));
const mgT = {
  /* ลอกส่วนของเส้นตรง: บนรังสี CX สร้าง CD ให้ยาวเท่ากับ AB */
  copySeg(L = 4.3) { const A = [1.6, 7.4], B = [1.6 + L, 7.4], C = [2.2, 2.6], X = [9.8, 2.6], Q = mgP(C, 0, L);
    return { title: `บนรังสี CX สร้าง <b>CD ให้ยาวเท่ากับ AB</b> ด้วยวงเวียน`, given: { pts: { A, B, C, X }, segs: [['A', 'B']], rays: [['C', 'X']] }, compC: [11.4, 5.6],
      sol: [{ say: 'วางเข็มวงเวียนที่ <b>A</b> กางขาดินสอไปที่ <b>B</b> — รัศมีวงเวียนจึงยาวเท่ากับ AB', ops: [{ t: 'arc', c: A, r: L, a0: -10, a1: 10 }] },
        { say: 'ยกวงเวียนไปวางเข็มที่ <b>C</b> (อย่าเปลี่ยนรัศมี) เขียนส่วนโค้งตัดรังสี CX', ops: [{ t: 'arc', c: C, r: L, a0: -22, a1: 22 }] },
        { say: 'จุดที่ส่วนโค้งตัดรังสี คือ <b>D</b> → CD = AB', ops: [{ t: 'pt', p: Q, name: 'D' }, { t: 'away' }] }],
      marks: [{ p: Q, name: 'D' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> CD ยาวเท่ากับ AB 🎉',
      goal: G => { const a = G.arcAt(C); if (!a.length) return { ok: false, why: 'ยังไม่ได้วางเข็มวงเวียนที่จุด C แล้วเขียนส่วนโค้ง' }; return a.some(x => Math.abs(x.r - L) < .12 && mgCov(x, 0)) ? { ok: true } : { ok: false, why: a.some(x => Math.abs(x.r - L) < .12) ? 'ส่วนโค้งยังไม่ตัดรังสี CX' : `รัศมีวงเวียน ${mgF(a[a.length - 1].r)} ซม. ยังไม่เท่ากับ AB (ลองวางเข็มที่ A แล้วลากขาดินสอไปที่ B)` }; } }; },
  /* ผลบวกของความยาว: บนรังสี PX สร้าง PR = AB + CD */
  sumSeg(a = 3.1, b = 2.4) { const A = [1.4, 8], B = [1.4 + a, 8], C = [7.6, 8], Dd = [7.6 + b, 8], P = [1.8, 3], X = [13, 3], Q = mgP(P, 0, a), R = mgP(P, 0, a + b);
    return { title: 'บนรังสี PX สร้าง <b>PR = AB + CD</b> ด้วยวงเวียน', given: { pts: { A, B, C, D: Dd, P, X }, segs: [['A', 'B'], ['C', 'D']], rays: [['P', 'X']] }, compC: [12, 5.6], newNames: 'QRSTUVW',
      sol: [{ say: 'กางวงเวียนยาวเท่า AB วางเข็มที่ P เขียนส่วนโค้งตัดรังสี ได้จุด Q', ops: [{ t: 'arc', c: A, r: a, a0: -10, a1: 10 }, { t: 'arc', c: P, r: a, a0: -20, a1: 20 }, { t: 'pt', p: Q, name: 'Q' }] },
        { say: 'กางวงเวียนยาวเท่า CD วางเข็มที่ <b>Q</b> เขียนส่วนโค้งตัดรังสีต่อไป ได้จุด R', ops: [{ t: 'arc', c: C, r: b, a0: -10, a1: 10 }, { t: 'arc', c: Q, r: b, a0: -20, a1: 20 }, { t: 'pt', p: R, name: 'R' }, { t: 'away' }] }],
      marks: [{ p: Q, name: 'Q' }, { p: R, name: 'R' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> PR = AB + CD 🎉',
      goal: G => { const q = G.arcAt(P).some(x => Math.abs(x.r - a) < .12 && mgCov(x, 0)), r = G.arcAt(Q).some(x => Math.abs(x.r - b) < .12 && mgCov(x, 0)); return q && r ? { ok: true } : { ok: false, why: !q ? 'ขั้นแรก: ลอก AB จากจุด P ลงบนรังสีก่อน' : 'ต่อไปลอก CD โดยวางเข็มที่จุดปลายของส่วนแรก' }; } }; },
  /* แบ่งครึ่งส่วนของเส้นตรง AB (เส้นแบ่งครึ่งตั้งฉาก) */
  bisSeg(L = 7) { const A = [7.25 - L / 2, 4.6], B = [7.25 + L / 2, 4.6], M = mgMid(A, B), r = L / 2 + 1.2, hh = Math.sqrt(r * r - L * L / 4), Pu = [M[0], M[1] + hh], Pd = [M[0], M[1] - hh], ta = mgA(A, Pu);
    return { title: '<b>แบ่งครึ่ง AB</b>: สร้างเส้นแบ่งครึ่งตั้งฉาก แล้วหาจุดกึ่งกลาง M', given: { pts: { A, B }, segs: [['A', 'B']] }, compC: [11.8, 6.6], newNames: 'MPQRS',
      sol: [{ say: 'กางวงเวียน<b>เกินครึ่งของ AB</b> วางเข็มที่ A เขียนส่วนโค้งทั้งด้านบนและด้านล่างของ AB', ops: [{ t: 'arc', c: A, r, a0: -ta - 14, a1: ta + 14 }] },
        { say: 'ใช้<b>รัศมีเดิม</b> วางเข็มที่ B เขียนส่วนโค้งตัดกับส่วนโค้งแรกทั้งสองจุด', ops: [{ t: 'arc', c: B, r, a0: 180 - ta - 14, a1: 180 + ta + 14 }] },
        { say: 'ใช้สันตรงลากเส้นผ่านจุดตัดทั้งสองจุด — เส้นนี้ตั้งฉากกับ AB และตัด AB ที่จุดกึ่งกลาง <b>M</b>', ops: [{ t: 'seg', a: mgP(Pu, 90, .5), b: mgP(Pd, -90, .5) }, { t: 'pt', p: M, name: 'M' }, { t: 'away' }] }],
      marks: [{ p: M, name: 'M' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> AM = MB และเส้นที่ลากตั้งฉากกับ AB 🎉',
      measure: (G, X) => { const a = X(M); return `<text x="${a[0] + 8}" y="${a[1] + 26}" class="cns-len">AM = MB = ${mgF(L / 2)} ซม.</text>`; },
      goal: G => { const pr = mgEqPair(G.arcAt(A), G.arcAt(B), L / 2 + .05), ln = G.lineAt(M, 90); return pr && ln ? { ok: true } : { ok: false, why: !pr ? 'เขียนส่วนโค้งจาก A และจาก B ด้วยรัศมีเท่ากัน ที่ยาวเกินครึ่งของ AB' : 'ลากเส้นตรงผ่านจุดตัดของส่วนโค้งทั้งสองจุด' }; } }; },
  /* ลอกมุม: ที่จุด O สร้าง ∠XOY ให้เท่ากับ ∠ABC */
  copyAng(deg = 50) { const B = [1.4, 4.8], A = mgP(B, 0, 4.2), C = mgP(B, deg, 4.2), O = [7.2, 1.3], Xx = [11, 1.3], r = 2.3, P1 = mgP(B, 0, r), P2 = mgP(B, deg, r), Q1 = mgP(O, 0, r), Q2 = mgP(O, deg, r), c = mgD(P1, P2), Y = mgP(O, deg, 5.6);
    return { title: `ที่จุด O สร้าง <b>∠XOY ให้เท่ากับ ∠ABC</b> (ลอกมุมด้วยวงเวียน)`, given: { pts: { A, B, C, O, X: Xx }, rays: [['B', 'A'], ['B', 'C'], ['O', 'X']] }, compC: [11.8, 5.6], newNames: 'YPQRS',
      sol: [{ say: 'วางเข็มที่ <b>B</b> เขียนส่วนโค้งตัดแขนมุมทั้งสอง', ops: [{ t: 'arc', c: B, r, a0: -12, a1: deg + 12 }] },
        { say: '<b>รัศมีเดิม</b> วางเข็มที่ <b>O</b> เขียนส่วนโค้งยาว ๆ ตัดรังสี OX', ops: [{ t: 'arc', c: O, r, a0: -12, a1: deg + 22 }] },
        { say: 'กางวงเวียนให้ยาวเท่า<b>ระยะระหว่างจุดตัดสองจุดบนมุม ABC</b>', ops: [{ t: 'arc', c: P1, r: c, a0: mgA(P1, P2) - 12, a1: mgA(P1, P2) + 12 }] },
        { say: 'วางเข็มที่จุดตัดบน OX เขียนส่วนโค้งตัดส่วนโค้งเดิม', ops: [{ t: 'arc', c: Q1, r: c, a0: mgA(Q1, Q2) - 14, a1: mgA(Q1, Q2) + 14 }] },
        { say: 'ลากรังสีจาก O ผ่านจุดตัดนั้น ได้ <b>∠XOY = ∠ABC</b>', ops: [{ t: 'seg', a: O, b: Y }, { t: 'pt', p: Y, name: 'Y' }, { t: 'away' }] }],
      marks: [{ p: Y, name: 'Y' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠XOY = ∠ABC = ${deg}° 🎉`,
      goal: G => { const ray = G.rayAt(O, deg) || G.rayAt(O, -deg), pr = mgEqPair(G.arcAt(B), G.arcAt(O)); return ray && pr ? { ok: true } : { ok: false, why: !pr ? 'เขียนส่วนโค้งรัศมีเท่ากันจากจุด B และจากจุด O ก่อน' : 'ยังไม่ได้ลากรังสีจาก O ผ่านจุดตัดที่ทำให้มุมเท่ากัน' }; } }; },
  /* แบ่งครึ่งมุม */
  bisAng(deg = 76) { const V = [3, 1.4], A = mgP(V, 0, 7), B = mgP(V, deg, 7.2), r = 2.6, P1 = mgP(V, 0, r), P2 = mgP(V, deg, r), r2 = Math.max(2.4, mgD(P1, P2) / 2 + .9), R = mgXCC(P1, r2, P2, r2).sort((a, b) => mgD(V, b) - mgD(V, a))[0], Z = mgP(V, deg / 2, 7.4);
    return { title: `<b>แบ่งครึ่ง ∠AOB</b> ด้วยวงเวียนและสันตรง`, given: { pts: { O: V, A, B }, rays: [['O', 'A'], ['O', 'B']] }, compC: [11.8, 5.4], newNames: 'CDEFGH',
      sol: [{ say: 'วางเข็มที่จุดยอด <b>O</b> เขียนส่วนโค้งตัดแขนมุมทั้งสอง', ops: [{ t: 'arc', c: V, r, a0: -10, a1: deg + 10 }] },
        { say: 'วางเข็มที่จุดตัดบน OA เขียนส่วนโค้งในมุม', ops: [{ t: 'arc', c: P1, r: r2, a0: mgA(P1, R) - 16, a1: mgA(P1, R) + 16 }] },
        { say: '<b>รัศมีเดิม</b> วางเข็มที่จุดตัดบน OB เขียนส่วนโค้งตัดกัน', ops: [{ t: 'arc', c: P2, r: r2, a0: mgA(P2, R) - 16, a1: mgA(P2, R) + 16 }] },
        { say: 'ลากรังสีจาก O ผ่านจุดตัดนั้น เป็น<b>เส้นแบ่งครึ่งมุม</b>', ops: [{ t: 'seg', a: V, b: Z }, { t: 'pt', p: Z, name: 'C' }, { t: 'away' }] }],
      marks: [{ p: Z, name: 'C' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠AOC = ∠COB = ${mgF(deg / 2)}° 🎉`,
      goal: G => { const ray = G.rayAt(V, deg / 2), pr = G.arcAt(V).some(a => mgEqPair(G.arcAt(mgP(V, 0, a.r), .18), G.arcAt(mgP(V, deg, a.r), .18))); return ray && pr ? { ok: true } : { ok: false, why: !G.arcAt(V).length ? 'เริ่มจากวางเข็มที่จุดยอด O เขียนส่วนโค้งตัดแขนมุมทั้งสอง' : !pr ? 'เขียนส่วนโค้งรัศมีเท่ากันจากจุดตัดบน OA และบน OB' : 'ลากรังสีจาก O ผ่านจุดตัดของส่วนโค้งทั้งสอง' }; } }; },
  /* เส้นตั้งฉากที่จุด P บนเส้นตรง */
  perpAt() { const A = [1, 2.6], B = [13, 2.6], P = [7.2, 2.6], r = 2.1, Q1 = mgP(P, 180, r), Q2 = mgP(P, 0, r), r2 = 3.3, R = [P[0], P[1] + Math.sqrt(r2 * r2 - r * r)], Top = [P[0], 8.4];
    return { title: 'สร้างเส้นตรงที่<b>ตั้งฉากกับ AB ที่จุด P</b>', given: { pts: { A, B, P }, lines: [['A', 'B']] }, compC: [11.8, 5.8], newNames: 'QRSTU',
      sol: [{ say: 'วางเข็มที่ <b>P</b> เขียนส่วนโค้งตัด AB ทั้งสองข้างของ P', ops: [{ t: 'arc', c: P, r, a0: 160, a1: 200 }, { t: 'arc', c: P, r, a0: -20, a1: 20 }] },
        { say: 'กางวงเวียน<b>ให้ยาวขึ้น</b> วางเข็มที่จุดตัดทั้งสองข้าง เขียนส่วนโค้งตัดกันเหนือ P', ops: [{ t: 'arc', c: Q1, r: r2, a0: mgA(Q1, R) - 14, a1: mgA(Q1, R) + 14 }, { t: 'arc', c: Q2, r: r2, a0: mgA(Q2, R) - 14, a1: mgA(Q2, R) + 14 }] },
        { say: 'ลากเส้นจาก P ผ่านจุดตัดนั้น ได้ <b>PQ ⊥ AB</b>', ops: [{ t: 'seg', a: P, b: Top }, { t: 'pt', p: Top, name: 'Q' }, { t: 'away' }] }],
      marks: [{ p: Top, name: 'Q' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> เส้นที่ได้ตั้งฉากกับ AB (มุม 90°) 🎉',
      goal: G => { const ln = G.lineAt(P, 90), pr = G.arcAt(P).some(a => mgEqPair(G.arcAt(mgP(P, 0, a.r), .18), G.arcAt(mgP(P, 180, a.r), .18), a.r)); return ln && pr ? { ok: true } : { ok: false, why: !G.arcAt(P).length ? 'เริ่มจากวางเข็มที่ P เขียนส่วนโค้งตัด AB สองข้าง' : !pr ? 'เขียนส่วนโค้งรัศมีเท่ากัน (ยาวกว่าเดิม) จากจุดตัดทั้งสองข้าง' : 'ลากเส้นจาก P ผ่านจุดตัดของส่วนโค้ง' }; } }; },
  /* เส้นตั้งฉากจากจุด P ภายนอกเส้นตรง */
  perpFrom() { const A = [1, 2.3], B = [13, 2.3], P = [6.6, 6.5], r = 5, dd = Math.sqrt(r * r - (P[1] - A[1]) ** 2), C1 = [P[0] - dd, A[1]], C2 = [P[0] + dd, A[1]], r2 = 3.7, R = [P[0], A[1] + Math.sqrt(r2 * r2 - dd * dd)], F = [P[0], A[1]];
    return { title: 'สร้างเส้นตรงจากจุด P ให้<b>ตั้งฉากกับ AB</b>', given: { pts: { A, B, P }, lines: [['A', 'B']] }, compC: [11.6, 5.4], newNames: 'QRSTU',
      sol: [{ say: 'วางเข็มที่ <b>P</b> กางให้ยาวพอ เขียนส่วนโค้งตัด AB สองจุด', ops: [{ t: 'arc', c: P, r, a0: mgA(P, C1) - 8, a1: mgA(P, C2) + 8 }] },
        { say: 'วางเข็มที่จุดตัดทั้งสอง เขียนส่วนโค้ง<b>รัศมีเท่ากัน</b>ตัดกัน', ops: [{ t: 'arc', c: C1, r: r2, a0: mgA(C1, R) - 14, a1: mgA(C1, R) + 14 }, { t: 'arc', c: C2, r: r2, a0: mgA(C2, R) - 14, a1: mgA(C2, R) + 14 }] },
        { say: 'ลากเส้นจาก P ผ่านจุดตัดนั้นลงมาถึง AB ที่จุด <b>Q</b> → PQ ⊥ AB', ops: [{ t: 'seg', a: P, b: F }, { t: 'pt', p: F, name: 'Q' }, { t: 'away' }] }],
      marks: [{ p: F, name: 'Q' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> PQ ตั้งฉากกับ AB — PQ เป็นระยะที่สั้นที่สุดจาก P ถึง AB 🎉',
      goal: G => { const ln = G.lineAt(P, 90) && G.segs().some(s => mgDseg(s, P) < .14 && mgDseg(s, F) < .2), pr = G.arcAt(P).some(a => { const xs = mgXLC(A, 0, P, a.r); return xs.length === 2 && mgEqPair(G.arcAt(xs[0], .18), G.arcAt(xs[1], .18)); }); return ln && pr ? { ok: true } : { ok: false, why: !G.arcAt(P).length ? 'เริ่มจากวางเข็มที่ P เขียนส่วนโค้งตัด AB สองจุด' : !pr ? 'เขียนส่วนโค้งรัศมีเท่ากันจากจุดตัดทั้งสองบน AB' : 'ลากเส้นจาก P ผ่านจุดตัดของส่วนโค้งให้ถึง AB' }; } }; },
  /* มุมขนาดต่าง ๆ ด้วยวงเวียนและสันตรง (0 กับ 180 อยู่บนเส้นตรง · 60/120 จากรูปสามเหลี่ยมด้านเท่า · ที่เหลือแบ่งครึ่ง) */
  angle(deg) { const O = [7.25, 1.3], A = [12.6, 1.3], R0 = 3, Pt = d => mgP(O, d, R0), sol = [], have = new Set([0, 180]);
    const BIS = { 90: [0, 180], 30: [0, 60], 150: [120, 180], 45: [0, 90], 135: [90, 180], 75: [60, 90], 105: [90, 120], 15: [0, 30], 165: [150, 180], 22.5: [0, 45] };
    sol.push({ say: 'วางเข็มที่ <b>O</b> เขียนครึ่งวงกลมตัดเส้นตรงทั้งสองข้าง', ops: [{ t: 'arc', c: O, r: R0, a0: 0, a1: 180 }] });
    const make = (d, last) => { if (have.has(d)) return; if (d === 60 || d === 120) { const c = d === 60 ? Pt(0) : Pt(180), dd = mgA(c, Pt(d)); sol.push({ say: `<b>รัศมีเดิม</b> วางเข็มที่จุดตัด${d === 60 ? 'ทางขวา' : 'ทางซ้าย'} เขียนส่วนโค้งตัดครึ่งวงกลม → ได้มุม ${d}° (รูปสามเหลี่ยมด้านเท่า)`, ops: [{ t: 'arc', c, r: R0, a0: dd - 14, a1: dd + 14 }] }); have.add(d); if (!last) sol.push({ say: `ลากรังสีจาก O ผ่านจุดตัดนั้น (มุม ${d}°)`, ops: [{ t: 'seg', a: O, b: mgP(O, d, 6.4) }] }); return; }
      const [a, b] = BIS[d]; make(a); make(b); const c1 = Pt(a), c2 = Pt(b), r2 = Math.max(2.4, mgD(c1, c2) / 2 + .9), R = mgXCC(c1, r2, c2, r2).sort((x, y) => mgD(O, y) - mgD(O, x))[0];
      sol.push({ say: `แบ่งครึ่งมุมระหว่าง ${a}° กับ ${b}°: วางเข็มที่จุดบนครึ่งวงกลมทั้งสอง เขียนส่วนโค้งรัศมีเท่ากันตัดกัน`, ops: [{ t: 'arc', c: c1, r: r2, a0: mgA(c1, R) - 13, a1: mgA(c1, R) + 13 }, { t: 'arc', c: c2, r: r2, a0: mgA(c2, R) - 13, a1: mgA(c2, R) + 13 }] }); have.add(d);
      if (!last) sol.push({ say: `ลากรังสีจาก O ผ่านจุดตัด ได้มุม ${d}°`, ops: [{ t: 'seg', a: O, b: mgP(O, d, 6.4) }] }); };
    make(deg, true); const Bp = mgP(O, deg, 6.6); sol.push({ say: `ลากรังสี OB ผ่านจุดตัดสุดท้าย ได้ <b>∠AOB = ${deg}°</b>`, ops: [{ t: 'seg', a: O, b: Bp }, { t: 'pt', p: Bp, name: 'B' }, { t: 'away' }] });
    return { title: `สร้าง <b>∠AOB = ${deg}°</b> ด้วยวงเวียนและสันตรง (ไม่ใช้ครึ่งวงกลม)`, given: { pts: { O, A }, lines: [['O', 'A']] }, compC: [2.6, 5.4], rulO: [1, 8.2], newNames: 'BCDEFGH',
      sol, marks: [{ p: Bp, name: 'B' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠AOB = ${deg}° 🎉`,
      measure: (G, X) => { const a = X(mgP(O, deg / 2, 1.5)); return `<text x="${a[0]}" y="${a[1]}" text-anchor="middle" class="cns-deg">${deg}°</text>`; },
      goal: G => { const ray = G.rayAt(O, deg, 1.4), n = G.nArcs() >= 2; return ray && n ? { ok: true } : { ok: false, why: !n ? 'ต้องใช้วงเวียนสร้าง (ยังเขียนส่วนโค้งไม่พอ)' : `ยังไม่มีรังสีจาก O ที่ทำมุม ${deg}° กับ OA` }; } }; },
  /* ครึ่งวงกลม (โปรแทรกเตอร์): สร้างมุมตามขนาดที่กำหนด */
  protAng(deg) { const O = [3.6, 1.6], A = [9.5, 1.6], Bp = mgP(O, deg, 6);
    return { title: `ใช้<b>ครึ่งวงกลม</b>สร้าง <b>∠AOB = ${deg}°</b>`, given: { pts: { O, A }, rays: [['O', 'A']] }, tools: ['point', 'ruler', 'prot'], tool0: 'prot', protC: [11, 6.2], rulO: [1, 8.2], newNames: 'BCDE',
      sol: [{ say: 'วางจุดศูนย์กลางครึ่งวงกลมที่ <b>O</b> ให้เส้นฐาน (0°) ทับรังสี OA', ops: [{ t: 'prot', c: O, rot: 0 }] },
        { say: `อ่านสเกลที่เริ่มจาก 0 ตรง OA ไปถึง <b>${deg}</b> แล้วทำเครื่องหมาย ✕`, ops: [{ t: 'mark', c: O, rot: 0, deg }] },
        { say: 'ใช้สันตรงลากรังสีจาก O ผ่านเครื่องหมาย ✕', ops: [{ t: 'seg', a: O, b: Bp }, { t: 'pt', p: Bp, name: 'B' }, { t: 'away' }] }],
      marks: [{ p: Bp, name: 'B' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠AOB = ${deg}° 🎉`,
      measure: (G, X) => { const a = X(mgP(O, deg / 2, 1.3)); return `<text x="${a[0]}" y="${a[1]}" text-anchor="middle" class="cns-deg">${deg}°</text>`; },
      goal: G => G.rayAt(O, deg, 1.2) ? { ok: true } : { ok: false, why: `ยังไม่มีรังสีจาก O ที่ทำมุม ${deg}° กับ OA` } }; },
  /* เส้นขนานผ่านจุด P (ลอกมุมแย้ง/มุมภายนอกและภายในข้างเดียวกัน) */
  parallel() { const A = [1, 2], B = [13, 2], P = [8.4, 6.2], Q = [5.4, 2], th = mgA(Q, P), r = 1.9, Q1 = mgP(Q, 0, r), Q2 = mgP(Q, th, r), P1 = mgP(P, 0, r), P2 = mgP(P, th, r), c = mgD(Q1, Q2), E1 = [2.6, P[1]], E2 = [13.2, P[1]];
    return { title: 'สร้างเส้นตรงผ่านจุด P ให้<b>ขนานกับ AB</b>', given: { pts: { A, B, P }, lines: [['A', 'B']] }, compC: [2.6, 5.6], newNames: 'QRSTUV',
      sol: [{ say: 'ลากเส้นผ่าน P ตัด AB ที่จุด <b>Q</b> (เส้นตัด)', ops: [{ t: 'seg', a: mgP(Q, th + 180, .6), b: mgP(P, th, 2.4) }, { t: 'pt', p: Q, name: 'Q' }] },
        { say: 'วางเข็มที่ <b>Q</b> เขียนส่วนโค้งตัด QB และ QP', ops: [{ t: 'arc', c: Q, r, a0: -10, a1: th + 10 }] },
        { say: '<b>รัศมีเดิม</b> วางเข็มที่ <b>P</b> เขียนส่วนโค้งแบบเดียวกัน', ops: [{ t: 'arc', c: P, r, a0: -14, a1: th + 10 }] },
        { say: 'กางวงเวียนยาวเท่าระยะระหว่างจุดตัดสองจุดที่ Q แล้วไปเขียนตัดที่ P', ops: [{ t: 'arc', c: Q2, r: c, a0: mgA(Q2, Q1) - 10, a1: mgA(Q2, Q1) + 10 }, { t: 'arc', c: P2, r: c, a0: mgA(P2, P1) - 13, a1: mgA(P2, P1) + 13 }] },
        { say: 'ลากเส้นผ่าน P กับจุดตัดนั้น → มุมที่ P เท่ากับมุมที่ Q (มุมภายนอกและภายในข้างเดียวกันของเส้นตัด) จึง<b>ขนานกับ AB</b>', ops: [{ t: 'seg', a: E1, b: E2 }, { t: 'away' }] }],
      okMsg: '<b>สร้างเสร็จแล้ว!</b> เส้นที่ผ่าน P ขนานกับ AB 🎉',
      goal: G => { const ln = G.lineAt(P, 0, 1.3), tr = G.segs().some(s => mgDseg(s, P) < .15 && mgLd(mgA(s[0], s[1]), 0) > 15 && Math.min(s[0][1], s[1][1]) < A[1] + .12), n = G.nArcs() >= 3; return ln && tr && n ? { ok: true } : { ok: false, why: !tr ? 'เริ่มจากลากเส้นตัดผ่าน P ไปตัด AB' : !n ? 'ลอกมุมที่จุดตัดบน AB ไปไว้ที่ P ด้วยวงเวียน' : 'ลากเส้นผ่าน P ที่ทำมุมเท่ากับมุมที่ Q' }; } }; },
  /* รูปสามเหลี่ยม ABC: ฐาน AB บนรังสีที่กำหนด · kind 'sss' | 'sas' | 'asa' */
  tri(kind, o) { const A = [2.4, 1.5], Xx = [13.2, 1.5]; let B, C, sol = [], title, tools = ['point', 'ruler', 'comp'];
    if (kind === 'sss') { const { c, b, a } = o; B = mgP(A, 0, c); C = mgXCC(A, b, B, a).sort((p, q) => q[1] - p[1])[0];
      title = `สร้าง<b>รูปสามเหลี่ยม ABC</b> ให้ AB = ${c} ซม. BC = ${a} ซม. และ CA = ${b} ซม.`;
      sol = [{ say: `วัดจาก A ไปตามรังสี ${c} ซม. ได้จุด <b>B</b> (ใช้ไม้บรรทัด หรือกางวงเวียน ${c} ซม.)`, ops: [{ t: 'arc', c: A, r: c, a0: -12, a1: 12 }, { t: 'pt', p: B, name: 'B' }] },
        { say: `กางวงเวียน ${b} ซม. วางเข็มที่ <b>A</b> เขียนส่วนโค้งด้านบน`, ops: [{ t: 'arc', c: A, r: b, a0: mgA(A, C) - 16, a1: mgA(A, C) + 16 }] },
        { say: `กางวงเวียน ${a} ซม. วางเข็มที่ <b>B</b> เขียนส่วนโค้งตัดกัน ได้จุด <b>C</b>`, ops: [{ t: 'arc', c: B, r: a, a0: mgA(B, C) - 16, a1: mgA(B, C) + 16 }, { t: 'pt', p: C, name: 'C' }] },
        { say: 'ลาก AC และ BC', ops: [{ t: 'seg', a: A, b: C }, { t: 'seg', a: B, b: C }, { t: 'away' }] }]; }
    else if (kind === 'sas') { const { c, b, A: dA } = o; B = mgP(A, 0, c); C = mgP(A, dA, b); tools = ['point', 'ruler', 'comp', 'prot'];
      title = `สร้าง<b>รูปสามเหลี่ยม ABC</b> ให้ AB = ${c} ซม. ∠A = ${dA}° และ AC = ${b} ซม.`;
      sol = [{ say: `วัดจาก A ไปตามรังสี ${c} ซม. ได้จุด <b>B</b>`, ops: [{ t: 'arc', c: A, r: c, a0: -12, a1: 12 }, { t: 'pt', p: B, name: 'B' }] },
        { say: `วางครึ่งวงกลมที่ A ทำเครื่องหมายที่ ${dA}° แล้วลากรังสีผ่านเครื่องหมาย`, ops: [{ t: 'prot', c: A, rot: 0 }, { t: 'mark', c: A, rot: 0, deg: dA }, { t: 'seg', a: A, b: mgP(A, dA, b + 1.2) }] },
        { say: `กางวงเวียน ${b} ซม. วางเข็มที่ A เขียนส่วนโค้งตัดรังสี ได้จุด <b>C</b>`, ops: [{ t: 'arc', c: A, r: b, a0: dA - 12, a1: dA + 12 }, { t: 'pt', p: C, name: 'C' }] },
        { say: 'ลาก BC', ops: [{ t: 'seg', a: B, b: C }, { t: 'away' }] }]; }
    else { const { c, A: dA, B: dB } = o; B = mgP(A, 0, c); const sA = Math.sin(dB * Math.PI / 180) / Math.sin((180 - dA - dB) * Math.PI / 180) * c; C = mgP(A, dA, sA); tools = ['point', 'ruler', 'comp', 'prot'];
      title = `สร้าง<b>รูปสามเหลี่ยม ABC</b> ให้ AB = ${c} ซม. ∠A = ${dA}° และ ∠B = ${dB}°`;
      sol = [{ say: `วัดจาก A ไปตามรังสี ${c} ซม. ได้จุด <b>B</b>`, ops: [{ t: 'arc', c: A, r: c, a0: -12, a1: 12 }, { t: 'pt', p: B, name: 'B' }] },
        { say: `ที่ A ทำมุม ${dA}° แล้วลากรังสี`, ops: [{ t: 'prot', c: A, rot: 0 }, { t: 'mark', c: A, rot: 0, deg: dA }, { t: 'seg', a: A, b: mgP(A, dA, sA + 1) }] },
        { say: `ที่ B ทำมุม ${dB}° (วัดจาก BA) แล้วลากรังสีตัดกัน ได้จุด <b>C</b>`, ops: [{ t: 'prot', c: B, rot: 0 }, { t: 'mark', c: B, rot: 0, deg: 180 - dB }, { t: 'seg', a: B, b: mgP(B, 180 - dB, mgD(B, C) + 1) }, { t: 'pt', p: C, name: 'C' }, { t: 'away' }] }]; }
    const L = [mgD(A, B), mgD(B, C), mgD(C, A)].sort((x, y) => x - y);
    return { title, given: { pts: { A, X: Xx }, rays: [['A', 'X']] }, tools, compC: [11.8, 5.6], protC: [11.2, 6], rulO: [1, 8.3], newNames: 'BCDEFGH', sol, marks: [{ p: B, name: 'B' }, { p: C, name: 'C' }],
      okMsg: '<b>สร้างเสร็จแล้ว!</b> ได้รูปสามเหลี่ยม ABC ตามโจทย์ 🎉',
      measure: (G, X) => { let s = ''; [[A, B], [B, C], [C, A]].forEach(([p, q]) => { const m = X(mgMid(p, q)), d = mgA(p, q), n = mgU(d - 90), off = [n[0] * 18, -n[1] * 18]; s += `<text x="${m[0] + off[0]}" y="${m[1] + off[1] + 5}" text-anchor="middle" class="cns-len">${mgF(mgD(p, q))}</text>`; }); return s; },
      goal: G => { const t = G.tris().find(tr => { const l = [mgD(tr[0], tr[1]), mgD(tr[1], tr[2]), mgD(tr[2], tr[0])].sort((x, y) => x - y); return l.every((v, i) => Math.abs(v - L[i]) < .18); });
        if (t) return { ok: true }; const any = G.tris()[0]; return { ok: false, why: any ? `รูปสามเหลี่ยมที่ได้มีด้านยาว ${[mgD(any[0], any[1]), mgD(any[1], any[2]), mgD(any[2], any[0])].map(mgF).join(', ')} ซม. ยังไม่ตรงโจทย์` : 'ยังไม่ได้รูปสามเหลี่ยมที่มีด้านครบ 3 ด้าน' }; } }; }
};

/* =========================================================
   ข้อในเกม
   ========================================================= */
Q.mgBuild = (T, q) => ({ prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `mgb ${q}`, __diff: 60, __kind: 'mgb', __base: 'mgb', __baseCap: 2, __baseHard: true,
  mount(bd, ctx) { bd.append(h('div', { class: 'colstack cns-q' }, mgBoard(T, { onOK: () => setTimeout(() => ctx.check(true), 900), onWrong: why => ctx.check(false, why) }))); } });
/* วัดมุมด้วยครึ่งวงกลม แล้วตอบขนาด */
Q.mgMeasure = ({ deg, rot = 0, name = 'ABC' }) => { const B = [4.4, 1.6], A = mgP(B, rot, 6), C = mgP(B, rot + deg, 5.6), T = { title: `ใช้ครึ่งวงกลมวัด <b>∠${name}</b>`, given: { pts: { [name[0]]: A, [name[1]]: B, [name[2]]: C }, rays: [[name[1], name[0]], [name[1], name[2]]] }, tools: ['prot'], tool0: 'prot', protC: [11, 6], start: 'ลากครึ่งวงกลมให้จุดศูนย์กลางอยู่ที่จุดยอด แล้วหมุนให้ 0° ทับแขนมุมข้างหนึ่ง' };
  return { prompt: `วัดขนาดของ ∠${name} แล้วตอบเป็นองศา`, say: `วัดขนาดของมุม ${name.split('').join(' ')} แล้วตอบเป็นองศา`, __sig: `mgm ${deg} ${rot}`, __diff: 40, __kind: 'mgm', __base: 'mgm', __baseCap: 2,
    mount(bd, ctx) { const b = mgBoard(T, {}); b.classList.add('mg-meas'); bd.append(h('div', { class: 'mg-qrow' }, b, miAns(ctx, deg, { unit: 'องศา', hint: 'อ่านสเกลที่เริ่มจาก 0 ตรงแขนมุมข้างแรก' }))); } }; };
/* เลือกตอบ (มีรูป) */
Q.mgPick = ({ q, fig, opts, right, hint, sig }) => ({ prompt: q, say: miSay(q), __sig: 'mgp ' + (sig || q + right), ...(sig ? { __base: 'mgp-' + String(sig).split(' ')[0], __baseCap: String(sig).startsWith('angk') ? 5 : 2 } : {}),
  mount(bd, ctx) { const ch = choices(ctx, shuffle(opts.map(o => ({ value: o, label: o }))), right, { hint }); if (opts.some(o => o.replace(/<[^>]+>/g, '').length > 8)) ch.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); bd.append(h('div', { class: 'colstack' }, fig ? h('div', { class: 'mg-figbox', html: fig }) : '', ch)); } });
/* เลือกรูป */
Q.mgFigs = ({ q, figs, right, hint, sig }) => ({ prompt: q, say: miSay(q), __sig: 'mgf ' + (sig || q),
  mount(bd, ctx) { const ch = choices(ctx, shuffle(figs.map(([v, svg, cap]) => ({ value: v, label: svg + (cap ? `<small class="mg-cap">${cap}</small>` : '') + `<i class="mg-k" hidden>${v}</i>` }))), right, { hint }); ch.classList.add('mg-figopts'); bd.append(ch); } });
/* ตอบตัวเลข (มีรูป) */
Q.mgNum = ({ q, fig, a, unit, hint, sig }) => ({ prompt: q, say: miSay(q), __sig: 'mgn ' + (sig || q), ...(sig ? { __base: 'mgn-' + String(sig).split(' ')[0], __baseCap: 2 } : {}),
  mount(bd, ctx) { bd.append(h('div', { class: fig ? 'mg-qrow' : 'colstack' }, fig ? h('div', { class: 'mg-figbox', html: fig }) : '', miAns(ctx, a, { unit, hint }))); } });
const mgTF = (text, ok, why) => Q.hTF({ text, ok: !!ok, why });

/* ---------- รูปที่ใช้บ่อย ---------- */
const mgAngFig = (deg, o = {}) => { const B = [0, 0], A = mgP(B, o.rot || 0, 3.4), C = mgP(B, (o.rot || 0) + deg, 3.2); return mgFig({ pts: { [o.n?.[0] || 'A']: A, [o.n?.[1] || 'B']: B, [o.n?.[2] || 'C']: C }, rays: [[o.n?.[1] || 'B', o.n?.[0] || 'A'], [o.n?.[1] || 'B', o.n?.[2] || 'C']], angs: o.noArc ? [] : [[o.n?.[1] || 'B', o.n?.[0] || 'A', o.n?.[2] || 'C', o.lab || '']] }, { reflex: deg > 180, max: o.max || 300, pad: 1 }); };
const mgKindFig = k => { const A = [0, 0], B = [3.2, 0]; if (k === 'pt') return mgFig({ pts: { A: [0, 0] }, extra: [[-1.5, -.6], [1.5, .6]] }, { max: 150 }); if (k === 'seg') return mgFig({ pts: { A, B }, segs: [['A', 'B']] }, { max: 220 }); if (k === 'ray') return mgFig({ pts: { A, B }, rays: [['A', 'B']] }, { max: 240 }); return mgFig({ pts: { A, B }, lines: [['A', 'B']] }, { max: 260 }); };
/* ภาพร่องรอยการสร้าง (ใช้ในข้อ "รูปใดแสดง…") */
const MG_TRACE = {
  bisSeg: () => mgFig({ pts: { A: [0, 0], B: [5, 0], M: [2.5, 0] }, segs: [['A', 'B']], arcs: [['A', 3.3, -55, 55], ['B', 3.3, 125, 235]], dash: [[[2.5, 2.6], [2.5, -2.6]]], hide: [] }, { max: 230 }),
  bisAng: () => { const V = [0, 0], A = [4.4, 0], B = mgP(V, 70, 4.4), P1 = mgP(V, 0, 2), P2 = mgP(V, 70, 2), R = mgXCC(P1, 1.9, P2, 1.9).sort((a, b) => mgD(V, b) - mgD(V, a))[0]; return mgFig({ pts: { O: V, A, B }, rays: [['O', 'A'], ['O', 'B']], arcs: [[V, 2, -8, 78], [P1, 1.9, mgA(P1, R) - 15, mgA(P1, R) + 15], [P2, 1.9, mgA(P2, R) - 15, mgA(P2, R) + 15]], dash: [[V, mgP(V, 35, 4.6)]] }, { max: 230 }); },
  perpAt: () => { const P = [0, 0]; return mgFig({ pts: { A: [-3, 0], B: [3, 0], P }, lines: [['A', 'B', .3]], arcs: [[P, 1.6, 160, 200], [P, 1.6, -20, 20], [[-1.6, 0], 2.6, 38, 62], [[1.6, 0], 2.6, 118, 142]], dash: [[P, [0, 2.8]]] }, { max: 230 }); },
  perpFrom: () => { const P = [0, 3]; return mgFig({ pts: { A: [-3.4, 0], B: [3.4, 0], P }, lines: [['A', 'B', .3]], arcs: [[P, 3.8, 232, 308], [[-2.47, 0], 2.8, 10, 40], [[2.47, 0], 2.8, 140, 170]], dash: [[P, [0, -.2]]] }, { max: 230 }); },
  copySeg: () => mgFig({ pts: { A: [0, 2], B: [3, 2], C: [0, 0], D: [3, 0] }, segs: [['A', 'B']], rays: [['C', 'D', null, 1.2]], arcs: [[[0, 0], 3, -15, 15]] }, { max: 220 }),
  angle60: () => { const O = [0, 0]; return mgFig({ pts: { O, A: [4, 0] }, rays: [['O', 'A']], arcs: [[O, 2.6, -5, 75], [[2.6, 0], 2.6, 105, 135]], dash: [[O, mgP(O, 60, 4)]] }, { max: 220 }); },
  parallel: () => mgFig({ pts: { A: [-3, 0], B: [3.5, 0], P: [1.4, 2.6], Q: [-.6, 0] }, lines: [['A', 'B', .3]], segs: [[[-1, -.5], [2.2, 3.6]]], arcs: [[[-.6, 0], 1.2, -8, 62], [[1.4, 2.6], 1.2, -8, 62]], dash: [[[-2.6, 2.6], [3.6, 2.6]]] }, { max: 230 })
};
const mgTraceQ = (key, name) => { const keys = Object.keys(MG_TRACE).filter(k => k !== key && k !== 'angle60').slice(0, 0); const pool = ['bisSeg', 'bisAng', 'perpAt', 'perpFrom', 'copySeg', 'parallel', 'angle60'].filter(k => k !== key); const pick3 = shuffle(pool).slice(0, 2);
  return Q.mgFigs({ q: `รูปใดแสดงร่องรอยของ<b>${name}</b>`, figs: [[key, MG_TRACE[key]()], ...pick3.map(k => [k, MG_TRACE[k]()])], right: key, hint: 'ดูว่าวางเข็มวงเวียนที่จุดใดบ้าง และเส้นที่ได้อยู่ตรงไหน', sig: 'trace ' + key }); };

/* =========================================================
   หน้าเรียน: ตัวอย่างเคลื่อนไหว / ลองสร้าง / สำรวจ
   ========================================================= */
const mgCards = (list, cls) => { const el = miCards(list); cls.split(' ').forEach(c => el.classList.add(c)); return el; };
const mgDemo = T => el => el.append(mgBoard(T, { demo: true }));
const mgTry = T => el => el.append(mgBoard(T));
/* วัดมุมด้วยครึ่งวงกลม (ตัวอย่าง) */
const mgMeasDemo = (deg = 65, rot = 15) => { const B = [4.6, 1.6], A = mgP(B, rot, 6), C = mgP(B, rot + deg, 5.6);
  return { title: `วัดขนาดของ <b>∠ABC</b> ด้วยครึ่งวงกลม`, given: { pts: { A, B, C }, rays: [['B', 'A'], ['B', 'C']] }, tools: ['prot'], protC: [11, 6.4],
    sol: [{ say: 'วางจุดศูนย์กลางของครึ่งวงกลมให้ตรง<b>จุดยอด B</b>', ops: [{ t: 'prot', c: B, rot: 0 }] },
      { say: 'หมุนให้เส้นฐาน (0°) <b>ทับแขน BA</b>', ops: [{ t: 'prot', c: B, rot }] },
      { say: `อ่านสเกลที่เริ่มจาก 0 ตรง BA ไล่ไปจนถึงแขน BC ได้ <b>${deg}°</b>`, ops: [{ t: 'mark', c: B, rot, deg }] }],
    summary: `∠ABC = <b>${deg}°</b> — เริ่มนับจากสเกลที่เป็น 0 ตรงแขนมุมข้างแรกเสมอ`, keepTools: true }; };
/* ความยาว 3 ด้านประกอบเป็นรูปสามเหลี่ยมได้ไหม (วงเวียนจากปลายทั้งสอง) */
function mgIneqSim(sets) {
  const box = h('div', { class: 'mg-figbox mg-big' }), out = fNote(), seen = new Set(), wrap = h('div', { class: 'colstack no-side' }, h6wait());
  const show = (k, [x, y, z]) => { const c = Math.max(x, y, z), [a, b] = [x, y, z].filter((v, i, arr) => i !== arr.indexOf(c)), A = [0, 0], B = [c, 0], X = mgXCC(A, a, B, b).sort((p, q) => q[1] - p[1])[0], ok = a + b > c;
    const f = { pts: { A, B }, segs: [['A', 'B']], arcs: [[A, a, -4, 100, '#3D8BD9'], [B, b, 80, 184, '#E5487A']], extra: [[0, Math.max(a, b) * .9]] };
    if (ok) { f.pts.C = X; f.segs.push(['A', 'C'], ['B', 'C']); f.fill = [[['A', 'B', 'C'], '#FFD27A']]; }
    box.innerHTML = mgFig(f, { max: 420 }); seen.add(k);
    out.innerHTML = ok ? `${a} + ${b} = ${a + b} <b>มากกว่า</b> ${c} → ส่วนโค้งตัดกัน <b>ได้รูปสามเหลี่ยม</b>` : `${a} + ${b} = ${a + b} ${a + b === c ? '<b>เท่ากับ</b>' : '<b>น้อยกว่า</b>'} ${c} → ส่วนโค้ง${a + b === c ? 'พบกันบนฐานพอดี (แบนเป็นเส้นตรง)' : 'ไม่ตัดกัน'} <b>ไม่ได้รูปสามเหลี่ยม</b>`;
    say(out.textContent.replace(/→/g, ''), true); sfx.pop(k + 2);
    if (seen.size === sets.length) { out.innerHTML += '<br>สรุป: <b>ผลบวกของความยาวสองด้านใด ๆ ต้องมากกว่าด้านที่สาม</b>'; teachDone(wrap); } };
  const row = h('div', { class: 'rowstack mg-sets' }, ...sets.map((s, k) => h('button', { class: 'btn ia mg-set', onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); show(k, s); } }, s.join(', ') + ' ซม.')));
  box.innerHTML = '<div class="cap">แตะชุดความยาวทีละชุด — วางด้านที่ยาวที่สุดเป็นฐาน แล้วเขียนส่วนโค้งจากปลายทั้งสอง</div>';
  wrap.append(row, box, out); return wrap;
}
/* ลากจุดยอด C — มุมภายในรวมกันได้ 180° เสมอ */
function mgSumSim() {
  const NS = 'http://www.w3.org/2000/svg', W = 560, H = 300, A = [70, 260], B = [470, 260]; let C = [230, 70], drags = 0, last = null;
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'mg-sum ia'); const out = fNote(), wrap = h('div', { class: 'colstack no-side' }, h6wait());
  const angAt = (P, Q, R) => { const a = Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]), b = Math.atan2(-(R[1] - P[1]), R[0] - P[0]); let d = Math.abs(a - b) * 180 / Math.PI; if (d > 180) d = 360 - d; return d; };
  const arc = (P, Q, R, col, r = 34) => { const a = Math.atan2(Q[1] - P[1], Q[0] - P[0]), b = Math.atan2(R[1] - P[1], R[0] - P[0]); let s = a, e = b; let sw = e - s; while (sw > Math.PI) sw -= 2 * Math.PI; while (sw < -Math.PI) sw += 2 * Math.PI; const x1 = P[0] + r * Math.cos(s), y1 = P[1] + r * Math.sin(s), x2 = P[0] + r * Math.cos(s + sw), y2 = P[1] + r * Math.sin(s + sw); return `<path d="M${P[0]} ${P[1]} L${x1} ${y1} A${r} ${r} 0 0 ${sw > 0 ? 1 : 0} ${x2} ${y2} Z" fill="${col}" fill-opacity=".55" stroke="${col}" stroke-width="2"/>`; };
  const draw = () => { const a = Math.round(angAt(A, B, C)), b = Math.round(angAt(B, A, C)), c = 180 - a - b;
    svg.innerHTML = `<path d="M${A} L${B} L${C} Z" fill="#FFF6D6" stroke="#2B2550" stroke-width="3" stroke-linejoin="round"/>${arc(A, B, C, '#3D8BD9')}${arc(B, C, A, '#E5487A')}${arc(C, A, B, '#4FB97A')}
      <text x="${A[0] - 26}" y="${A[1] + 22}" class="mg-fn">A</text><text x="${B[0] + 10}" y="${B[1] + 22}" class="mg-fn">B</text><text x="${C[0] - 6}" y="${C[1] - 14}" class="mg-fn">C</text>
      <circle cx="${C[0]}" cy="${C[1]}" r="13" fill="#7C5CE0" fill-opacity=".25" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${C[0]}" cy="${C[1]}" r="5" fill="#7C5CE0"/>`;
    out.innerHTML = `∠A + ∠B + ∠C = <b style="color:#2F6FB8">${a}°</b> + <b style="color:#C2386B">${b}°</b> + <b style="color:#2E8A57">${c}°</b> = <b>180°</b>`; };
  let dn = false; const pt = e => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m.inverse()); return [Math.max(40, Math.min(W - 40, r.x)), Math.max(24, Math.min(H - 70, r.y))]; };
  svg.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); dn = true; try { svg.setPointerCapture(e.pointerId); } catch (_) { } C = pt(e); draw(); });
  svg.addEventListener('pointermove', e => { if (!dn) return; C = pt(e); draw(); });
  svg.addEventListener('pointerup', () => { if (!dn) return; dn = false; const k = C.map(v => Math.round(v / 40)).join(','); if (k !== last) { last = k; drags++; sfx.pop(drags + 2); } if (drags >= 3) { out.innerHTML += '<br>ไม่ว่ารูปสามเหลี่ยมจะเป็นรูปแบบใด <b>มุมภายในรวมกันได้ 180° เสมอ</b>'; teachDone(wrap); } });
  svg.addEventListener('click', e => e.stopPropagation()); draw();
  wrap.append(h('div', { class: 'cap' }, 'ลากจุดยอด C (จุดสีม่วง) ไปที่ต่าง ๆ อย่างน้อย 3 ตำแหน่ง แล้วดูผลบวกของมุม'), svg, out); return wrap;
}

/* =========================================================
   ข้อในเกม (ตัวสร้าง)
   ========================================================= */
const mgPick = a => a[Math.floor(Math.random() * a.length)];
const MG_KIND = { pt: 'จุด', seg: 'ส่วนของเส้นตรง', ray: 'รังสี', line: 'เส้นตรง' };
const mgNameFig = (k, n = 'AB') => { const A = [0, 0], B = [3.2, 0], P = { [n[0]]: A, [n[1]]: B }; return k === 'seg' ? mgFig({ pts: P, segs: [[n[0], n[1]]] }, { max: 220 }) : k === 'ray' ? mgFig({ pts: P, rays: [[n[0], n[1]]] }, { max: 240 }) : mgFig({ pts: P, lines: [[n[0], n[1]]] }, { max: 260 }); };
const mgSymQ = (k, n) => Q.mgPick({ q: `รูปนี้เขียนแทนด้วยสัญลักษณ์ใด`, fig: mgNameFig(k, n), opts: ['seg', 'ray', 'line'].map(x => mgSym(x, n)).concat(k === 'ray' ? [mgSym('ray', n[1] + n[0])] : []), right: mgSym(k, n), hint: 'ขีดบน = ส่วนของเส้นตรง · ลูกศรขวา = รังสี (จุดปลายเขียนก่อน) · ลูกศรสองข้าง = เส้นตรง', sig: 'sym ' + k + n });
const mgKindQ = (k, n) => Q.mgPick({ q: 'รูปนี้คืออะไร', fig: mgNameFig(k, n), opts: ['ส่วนของเส้นตรง', 'รังสี', 'เส้นตรง'], right: MG_KIND[k], hint: 'ดูปลายทั้งสองข้าง: มีจุดปลาย หรือมีลูกศร (ยาวต่อไปไม่สิ้นสุด)', sig: 'kind ' + k + n });
const MG_ANGK = [['มุมแหลม', 20, 85], ['มุมฉาก', 90, 90], ['มุมป้าน', 100, 170], ['มุมตรง', 180, 180], ['มุมกลับ', 200, 330]];
const mgAngKindQ = i => { const [nm, lo, hi] = MG_ANGK[i], d = lo === hi ? lo : lo + 5 * Math.floor(Math.random() * ((hi - lo) / 5 + 1)); return Q.mgPick({ q: `∠ABC ที่มีเครื่องหมายส่วนโค้ง เป็นมุมชนิดใด`, fig: mgAngFig(d, { rot: mgPick([0, 15, 30]) }), opts: MG_ANGK.map(x => x[0]), right: nm, hint: 'มุมแหลม < 90° · มุมฉาก = 90° · มุมป้าน 90°–180° · มุมตรง = 180° · มุมกลับ > 180°', sig: 'angk ' + nm }); };
const mgHalfQ = (L, u = 'ซม.') => Q.mgNum({ q: `M เป็นจุดกึ่งกลางของ AB ถ้า AB ยาว ${mgF(L)} ${u} แล้ว AM ยาวเท่าใด`, fig: mgFig({ pts: { A: [0, 0], M: [2.5, 0], B: [5, 0] }, segs: [['A', 'B']], ticks: [['A', 'M', 1], ['M', 'B', 1]] }, { max: 260 }), a: L / 2, unit: u, hint: 'จุดกึ่งกลางแบ่ง AB เป็นสองส่วนยาวเท่ากัน', sig: 'half ' + L });
const mgBisNumQ = d => Q.mgNum({ q: `OC แบ่งครึ่ง ∠AOB ซึ่งมีขนาด ${d}° ∠AOC มีขนาดกี่องศา`, fig: (() => { const O = [0, 0], A = [3.6, 0], B = mgP(O, Math.min(d, 160), 3.6), C = mgP(O, Math.min(d, 160) / 2, 3.9); return mgFig({ pts: { O, A, B, C }, rays: [['O', 'A'], ['O', 'B'], ['O', 'C']], angs: [['O', 'A', 'C', '', '#3D8BD9', .7], ['O', 'C', 'B', '', '#E5487A', .9]] }, { max: 240 }); })(), a: d / 2, unit: 'องศา', hint: 'แบ่งครึ่ง = แบ่งเป็นสองมุมเท่ากัน', sig: 'bisn ' + d });
const mgThirdQ = (a, b) => Q.mgNum({ q: `รูปสามเหลี่ยม ABC มี ∠A = ${a}° และ ∠B = ${b}° ∠C มีขนาดกี่องศา`, fig: (() => { const A = [0, 0], B = [5, 0], s = Math.sin(b * Math.PI / 180) / Math.sin((180 - a - b) * Math.PI / 180) * 5, C = mgP(A, a, s); return mgFig({ pts: { A, B, C }, segs: [['A', 'B'], ['B', 'C'], ['C', 'A']], angs: [['A', 'B', 'C', `${a}°`], ['B', 'C', 'A', `${b}°`], ['C', 'A', 'B', '?']] }, { max: 300 }); })(), a: 180 - a - b, unit: 'องศา', hint: 'มุมภายในของรูปสามเหลี่ยมรวมกัน 180°', sig: 'third ' + a + b });
const mgExtQ = (a, b) => Q.mgNum({ q: `จากรูป ∠ACD เป็นมุมภายนอก ถ้า ∠A = ${a}° และ ∠B = ${b}° ∠ACD มีขนาดกี่องศา`, fig: (() => { const A = [0, 0], B = [4.6, 0]; const s = Math.sin(b * Math.PI / 180) / Math.sin((180 - a - b) * Math.PI / 180) * 4.6, C = mgP(A, a, s), Dd = mgP(C, mgA(B, C), 2); return mgFig({ pts: { A, B, C, D: Dd }, segs: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D']], angs: [['A', 'B', 'C', `${a}°`], ['B', 'C', 'A', `${b}°`], ['C', 'D', 'A', '?']] }, { max: 300 }); })(), a: a + b, unit: 'องศา', hint: 'มุมภายนอก = ผลบวกของมุมภายในสองมุมที่ไม่ได้อยู่ติดกับมัน', sig: 'ext ' + a + b });
const mgIneqQ = () => { const good = mgPick([[4, 5, 7], [3, 6, 8], [5, 5, 9], [6, 7, 12], [2, 9, 10]]), bad = shuffle([[2, 3, 6], [3, 4, 8], [4, 5, 9], [1, 6, 8], [2, 5, 7], [3, 3, 7]]).slice(0, 3), F = s => s.join(', ') + ' ซม.';
  return Q.mgPick({ q: 'ความยาวชุดใดเป็นความยาวของด้านทั้งสามของรูปสามเหลี่ยมได้', opts: [F(good), ...bad.map(F)], right: F(good), hint: 'ผลบวกของสองด้านที่สั้นกว่า ต้องมากกว่าด้านที่ยาวที่สุด', sig: 'ineq ' + good }); };
const mgRangeQ = (a, b) => Q.mgNum({ q: `รูปสามเหลี่ยมมีด้านยาว ${a} ซม. และ ${b} ซม. ด้านที่สามยาวเป็นจำนวนเต็มได้<b>มากที่สุด</b>กี่ ซม.`, a: a + b - 1, unit: 'ซม.', hint: `ด้านที่สามต้องสั้นกว่า ${a} + ${b} = ${a + b}`, sig: 'rng ' + a + b });
const mgParAngQ = d => Q.mgNum({ q: `ℓ ∥ m มีเส้นตัด t ถ้ามุมที่ระบายสีฟ้ามีขนาด ${d}° มุม x มีขนาดกี่องศา (มุมแย้ง)`, fig: (() => { const L1a = [-3, 2], L1b = [3.4, 2], L2a = [-3, 0], L2b = [3.4, 0], P = [1, 2], Qq = mgP(P, 180 + d, 2 / Math.sin(d * Math.PI / 180)), T1 = mgP(P, d, 1.2), T2 = mgP(Qq, 180 + d, 1.2);
  return mgFig({ pts: { _1: L1a, _2: L1b, _3: L2a, _4: L2b, P, Q: Qq, _5: T1, _6: T2, _7: mgP(P, 180, 1), _8: mgP(Qq, 0, 1) }, lines: [['_1', '_2', .1], ['_3', '_4', .1]], segs: [['_5', '_6']], angs: [['Q', '_8', 'P', `${d}°`, '#3D8BD9', .7], ['P', '_7', 'Q', 'x', '#E5487A', .7]], labs: [[[3.6, 2.35], 'ℓ'], [[3.6, .35], 'm'], [T1, 't', 10, -6]], hide: ['_1', '_2', '_3', '_4', '_5', '_6', '_7', '_8'] }, { max: 320 }); })(), a: d, unit: 'องศา', hint: 'เส้นขนานกัน มุมแย้งมีขนาดเท่ากัน', sig: 'par ' + d });

/* =========================================================
   v231 — งานสร้างเพิ่ม (ใช้กับบทเรียน 12 ด่านชุดใหม่)
   ========================================================= */
Object.assign(mgT, {
  /* สร้างส่วนของเส้นตรงตามความยาวที่กำหนด (ไม้บรรทัดหรือวงเวียน) */
  segLen(L = 5) { const P = [2, 3], X = [12.8, 3], Q = mgP(P, 0, L);
    return { title: `บนรังสี PX สร้าง <b>PQ ยาว ${mgF(L)} ซม.</b>`, given: { pts: { P, X }, rays: [['P', 'X']] }, compC: [11.6, 6.4], rulO: [1, 7.6], newNames: 'QRST',
      sol: [{ say: `กางวงเวียนบนไม้บรรทัดให้ยาว <b>${mgF(L)} ซม.</b> แล้ววางเข็มที่ <b>P</b> เขียนส่วนโค้งตัดรังสี`, ops: [{ t: 'arc', c: P, r: L, a0: -14, a1: 14 }] },
        { say: 'จุดที่ส่วนโค้งตัดรังสีคือ <b>Q</b> → PQ ยาวตามที่กำหนด', ops: [{ t: 'pt', p: Q, name: 'Q' }, { t: 'away' }] }],
      marks: [{ p: Q, name: 'Q' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> PQ ยาว ${mgF(L)} ซม. 🎉`,
      goal: G => G.arcAt(P).some(x => Math.abs(x.r - L) < .12 && mgCov(x, 0)) || G.hasPt(Q, .12) ? { ok: true } : { ok: false, why: `วางเข็มที่ P กางวงเวียน ${mgF(L)} ซม. (เทียบกับไม้บรรทัด) แล้วเขียนส่วนโค้งตัดรังสี` } }; },
  /* ผลต่างของความยาว: PR = AB − CD */
  diffSeg(a = 5.2, b = 2.1) { const A = [1.4, 8], B = [1.4 + a, 8], C = [8.4, 8], Dd = [8.4 + b, 8], P = [1.8, 3], X = [13, 3], Q = mgP(P, 0, a), R = mgP(P, 0, a - b);
    return { title: 'บนรังสี PX สร้าง <b>PR = AB − CD</b> ด้วยวงเวียน', given: { pts: { A, B, C, D: Dd, P, X }, segs: [['A', 'B'], ['C', 'D']], rays: [['P', 'X']] }, compC: [12, 5.6], newNames: 'QRSTUVW',
      sol: [{ say: 'ลอก AB จาก P ลงบนรังสี ได้จุด <b>Q</b> (PQ = AB)', ops: [{ t: 'arc', c: A, r: a, a0: -10, a1: 10 }, { t: 'arc', c: P, r: a, a0: -16, a1: 16 }, { t: 'pt', p: Q, name: 'Q' }] },
        { say: 'กางวงเวียนยาวเท่า CD วางเข็มที่ <b>Q</b> เขียนส่วนโค้ง<b>ย้อนกลับ</b>มาทาง P ได้จุด <b>R</b>', ops: [{ t: 'arc', c: C, r: b, a0: -10, a1: 10 }, { t: 'arc', c: Q, r: b, a0: 162, a1: 198 }, { t: 'pt', p: R, name: 'R' }, { t: 'away' }] }],
      marks: [{ p: Q, name: 'Q' }, { p: R, name: 'R' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> PR = AB − CD 🎉',
      goal: G => { const q = G.arcAt(P).some(x => Math.abs(x.r - a) < .12 && mgCov(x, 0)), r = G.arcAt(Q).some(x => Math.abs(x.r - b) < .12 && mgCov(x, 180)); return q && r ? { ok: true } : { ok: false, why: !q ? 'ขั้นแรก: ลอก AB จากจุด P ลงบนรังสีก่อน' : 'ต่อไปลอก CD จากจุดปลาย Q ย้อนกลับมาทาง P' }; } }; },
  /* k เท่าของความยาว: PR = k × AB */
  kSeg(a = 2.4, k = 3) { const A = [1.4, 8], B = [1.4 + a, 8], P = [1.8, 3], X = [13, 3], pts = Array.from({ length: k + 1 }, (_, i) => mgP(P, 0, a * i)), nm = 'QRSTU';
    const sol = [{ say: 'กางวงเวียนยาวเท่า <b>AB</b>', ops: [{ t: 'arc', c: A, r: a, a0: -10, a1: 10 }] }];
    for (let i = 0; i < k; i++) sol.push({ say: `วางเข็มที่${i ? `จุด <b>${nm[i - 1]}</b>` : ' <b>P</b>'} เขียนส่วนโค้งตัดรังสี ได้จุด <b>${nm[i]}</b>`, ops: [{ t: 'arc', c: pts[i], r: a, a0: -16, a1: 16 }, { t: 'pt', p: pts[i + 1], name: nm[i] }, ...(i === k - 1 ? [{ t: 'away' }] : [])] });
    return { title: `บนรังสี PX สร้างส่วนของเส้นตรงยาว <b>${k} เท่าของ AB</b>`, given: { pts: { A, B, P, X }, segs: [['A', 'B']], rays: [['P', 'X']] }, compC: [12, 5.6], newNames: 'QRSTUVW',
      sol, marks: pts.slice(1).map((p, i) => ({ p, name: nm[i] })), okMsg: `<b>สร้างเสร็จแล้ว!</b> ยาว ${k} × AB = ${mgF(a * k)} ซม. 🎉`,
      goal: G => { const bad = pts.slice(0, k).findIndex(p => !G.arcAt(p).some(x => Math.abs(x.r - a) < .12 && mgCov(x, 0))); return bad < 0 ? { ok: true } : { ok: false, why: bad === 0 ? 'เริ่มจากลอก AB จากจุด P' : `ลอก AB ต่อจากจุดปลายที่ได้ (ครั้งที่ ${bad + 1})` }; } }; },
  /* แบ่งส่วนของเส้นตรงเป็น 4 ส่วนเท่ากัน (แบ่งครึ่งซ้ำ) */
  quartSeg(L = 9.6) { const A = [7.25 - L / 2, 4.4], B = [7.25 + L / 2, 4.4], M = mgMid(A, B), Q1 = mgMid(A, M), Q3 = mgMid(M, B), sol = [];
    const bis = (p, q, nmM, last) => { const l = mgD(p, q), r = l / 2 + .9, hh = Math.sqrt(r * r - l * l / 4), m = mgMid(p, q), ta = Math.atan2(hh, l / 2) * 180 / Math.PI;
      sol.push({ say: `แบ่งครึ่ง ${nmM[0]}: วางเข็มที่ปลายทั้งสอง เขียนส่วนโค้งรัศมีเท่ากัน (เกินครึ่ง) ตัดกันสองจุด`, ops: [{ t: 'arc', c: p, r, a0: -ta - 12, a1: ta + 12 }, { t: 'arc', c: q, r, a0: 180 - ta - 12, a1: 180 + ta + 12 }] });
      sol.push({ say: `ลากเส้นผ่านจุดตัดทั้งสอง ได้จุดกึ่งกลาง <b>${nmM[1]}</b>`, ops: [{ t: 'seg', a: [m[0], m[1] + hh + .4], b: [m[0], m[1] - hh - .4] }, { t: 'pt', p: m, name: nmM[1] }, ...(last ? [{ t: 'away' }] : [])] }); };
    bis(A, B, ['AB', 'M']); bis(A, M, ['AM', 'C']); bis(M, B, ['MB', 'D'], true);
    return { title: '<b>แบ่ง AB เป็น 4 ส่วนเท่ากัน</b> (แบ่งครึ่ง แล้วแบ่งครึ่งอีกครั้ง)', given: { pts: { A, B }, segs: [['A', 'B']] }, compC: [13, 6], newNames: 'MCDEFGH', sol,
      marks: [{ p: M, name: 'M' }, { p: Q1, name: 'C' }, { p: Q3, name: 'D' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> AC = CM = MD = DB = ${mgF(L / 4)} ซม. 🎉`,
      goal: G => { const a = G.lineAt(M, 90), b = G.lineAt(Q1, 90), c = G.lineAt(Q3, 90); return a && b && c ? { ok: true } : { ok: false, why: !a ? 'แบ่งครึ่ง AB ก่อน (ได้จุดกึ่งกลาง M)' : 'แบ่งครึ่ง AM และ MB อีกครั้ง' }; } }; },
  /* เขียนวงกลม: จุดศูนย์กลาง O รัศมี r */
  circ(r = 3) { const O = [6, 4.7];
    return { title: `เขียน<b>วงกลม</b> จุดศูนย์กลาง O รัศมี ${mgF(r)} ซม.`, given: { pts: { O } }, compC: [11.8, 6], rulO: [1, .9], newNames: 'ABC',
      sol: [{ say: `กางวงเวียนบนไม้บรรทัดให้ห่าง <b>${mgF(r)} ซม.</b> (ระยะนี้คือ<b>รัศมี</b>)`, ops: [{ t: 'arc', c: O, r, a0: 0, a1: 20 }] }, { say: 'วางเข็มที่จุดศูนย์กลาง <b>O</b> แล้วหมุนวงเวียนรอบเดียว', ops: [{ t: 'arc', c: O, r, a0: 0, a1: 360 }, { t: 'away' }] }],
      okMsg: `<b>เขียนเสร็จแล้ว!</b> ทุกจุดบนวงกลมห่างจาก O เท่ากัน = ${mgF(r)} ซม. 🎉`,
      goal: G => G.arcAt(O).some(x => Math.abs(x.r - r) < .12 && x.a1 - x.a0 >= 300) ? { ok: true } : { ok: false, why: G.arcAt(O).some(x => Math.abs(x.r - r) < .12) ? 'หมุนวงเวียนต่อให้ครบรอบ' : `วางเข็มที่ O และกางวงเวียนให้ยาว ${mgF(r)} ซม.` } }; },
  /* จุดตัดของส่วนโค้ง: หาจุด C ที่ห่างจาก A และ B ตามที่กำหนด */
  meet(ra = 4, rb = 3, d = 5) { const A = [4.2, 2.4], B = [4.2 + d, 2.4], C = mgXCC(A, ra, B, rb).sort((p, q) => q[1] - p[1])[0];
    return { title: `หาจุด C ที่ห่างจาก A <b>${mgF(ra)} ซม.</b> และห่างจาก B <b>${mgF(rb)} ซม.</b> (อยู่เหนือ AB)`, given: { pts: { A, B }, segs: [['A', 'B']] }, compC: [11.2, 6], rulO: [.8, 8.4], newNames: 'CDE',
      sol: [{ say: `กางวงเวียน ${mgF(ra)} ซม. วางเข็มที่ <b>A</b> เขียนส่วนโค้ง — ทุกจุดบนส่วนโค้งนี้ห่างจาก A ${mgF(ra)} ซม.`, ops: [{ t: 'arc', c: A, r: ra, a0: mgA(A, C) - 22, a1: mgA(A, C) + 22 }] },
        { say: `กางวงเวียน ${mgF(rb)} ซม. วางเข็มที่ <b>B</b> เขียนส่วนโค้งตัดกัน — <b>จุดตัด</b>ห่างจากทั้งสองจุดตามที่ต้องการ`, ops: [{ t: 'arc', c: B, r: rb, a0: mgA(B, C) - 22, a1: mgA(B, C) + 22 }, { t: 'pt', p: C, name: 'C' }, { t: 'away' }] }],
      marks: [{ p: C, name: 'C' }], okMsg: `<b>หาจุด C ได้แล้ว!</b> CA = ${mgF(ra)} ซม. และ CB = ${mgF(rb)} ซม. 🎉`,
      goal: G => { const a = G.arcAt(A).some(x => Math.abs(x.r - ra) < .12 && mgCov(x, mgA(A, C))), b = G.arcAt(B).some(x => Math.abs(x.r - rb) < .12 && mgCov(x, mgA(B, C))); return a && b ? { ok: true } : { ok: false, why: !a ? `เขียนส่วนโค้งรัศมี ${mgF(ra)} ซม. จากจุด A ให้ผ่านด้านบนของ AB` : `เขียนส่วนโค้งรัศมี ${mgF(rb)} ซม. จากจุด B ให้ตัดส่วนโค้งแรก` }; } }; },
  /* ผลบวกของมุม: ที่ O สร้าง ∠XOZ = ∠ABC + ∠DEF */
  sumAng(a = 40, b = 35) { const Bv = [1.2, 6.2], Ev = [6, 6.2], O = [2.6, 1.2], Xx = [12.6, 1.2], r = 1.6, sol = [];
    const A1 = mgP(Bv, 0, 3), C1 = mgP(Bv, a, 3), D1 = mgP(Ev, 0, 3), F1 = mgP(Ev, b, 3);
    const copy = (V, deg, base, nm, last) => { const P1 = mgP(V, 0, r), P2 = mgP(V, deg, r), Q1 = mgP(O, base, r), Q2 = mgP(O, base + deg, r), c = mgD(P1, P2), Y = mgP(O, base + deg, 6.2);
      sol.push({ say: `วางเข็มที่จุดยอดของมุม${base ? 'ที่สอง' : 'แรก'} เขียนส่วนโค้งตัดแขนทั้งสอง แล้วใช้<b>รัศมีเดิม</b>เขียนส่วนโค้งที่ O`, ops: [{ t: 'arc', c: V, r, a0: -12, a1: deg + 12 }, { t: 'arc', c: O, r, a0: base - 8, a1: base + deg + 20 }] });
      sol.push({ say: 'กางวงเวียนเท่าระยะระหว่างจุดตัดบนมุมเดิม ไปเขียนตัดที่ส่วนโค้งของ O', ops: [{ t: 'arc', c: P1, r: c, a0: mgA(P1, P2) - 12, a1: mgA(P1, P2) + 12 }, { t: 'arc', c: Q1, r: c, a0: mgA(Q1, Q2) - 14, a1: mgA(Q1, Q2) + 14 }] });
      sol.push({ say: `ลากรังสีจาก O ผ่านจุดตัด ได้รังสี <b>O${nm}</b>`, ops: [{ t: 'seg', a: O, b: Y }, { t: 'pt', p: Y, name: nm }, ...(last ? [{ t: 'away' }] : [])] }); };
    copy(Bv, a, 0, 'Y'); copy(Ev, b, a, 'Z', true);
    return { title: `ที่จุด O สร้าง <b>∠XOZ = ∠ABC + ∠DEF</b>`, given: { pts: { A: A1, B: Bv, C: C1, D: D1, E: Ev, F: F1, O, X: Xx }, segs: [['B', 'A'], ['B', 'C'], ['E', 'D'], ['E', 'F']], rays: [['O', 'X']] }, compC: [12.2, 6.6], newNames: 'YZPQRS', sol,
      marks: [{ p: mgP(O, a, 6.2), name: 'Y' }, { p: mgP(O, a + b, 6.2), name: 'Z' }], okMsg: `<b>สร้างเสร็จแล้ว!</b> ∠XOZ = ${a}° + ${b}° = ${a + b}° 🎉`,
      goal: G => { const r1 = G.rayAt(O, a), r2 = G.rayAt(O, a + b); return r1 && r2 && G.nArcs() >= 4 ? { ok: true } : { ok: false, why: !r1 ? 'ลอก ∠ABC ไปไว้ที่ O บนรังสี OX ก่อน' : 'ลอก ∠DEF ต่อจากรังสีใหม่ที่ได้' }; } }; },
  /* เส้นขนานโดยอาศัยเส้นตั้งฉากสองครั้ง */
  parPerp() { const A = [1, 2], B = [13, 2], P = [7, 6], r = 5, dd = Math.sqrt(r * r - 16), C1 = [P[0] - dd, 2], C2 = [P[0] + dd, 2], r2 = 3.6, R = [P[0], 2 + Math.sqrt(r2 * r2 - dd * dd)], F = [P[0], 2], s = 1.3, U1 = [P[0], P[1] + s], U2 = [P[0], P[1] - s], r3 = 2.1, hx = Math.sqrt(r3 * r3 - s * s);
    return { title: 'สร้างเส้นผ่าน P ให้<b>ขนานกับ AB</b> โดยใช้<b>เส้นตั้งฉากสองครั้ง</b>', given: { pts: { A, B, P }, lines: [['A', 'B']] }, compC: [2.4, 7.4], newNames: 'QRSTUV',
      sol: [{ say: '① สร้างเส้นตั้งฉากจาก P ไปยัง AB: วางเข็มที่ P เขียนส่วนโค้งตัด AB สองจุด', ops: [{ t: 'arc', c: P, r, a0: mgA(P, C1) - 8, a1: mgA(P, C2) + 8 }] },
        { say: 'วางเข็มที่จุดตัดทั้งสอง เขียนส่วนโค้งรัศมีเท่ากันตัดกัน', ops: [{ t: 'arc', c: C1, r: r2, a0: mgA(C1, R) - 14, a1: mgA(C1, R) + 14 }, { t: 'arc', c: C2, r: r2, a0: mgA(C2, R) - 14, a1: mgA(C2, R) + 14 }] },
        { say: 'ลากเส้นผ่าน P กับจุดตัด ลงถึง AB ที่ <b>Q</b> → PQ ⊥ AB', ops: [{ t: 'seg', a: [P[0], 8.6], b: F }, { t: 'pt', p: F, name: 'Q' }] },
        { say: '② สร้างเส้นตั้งฉากกับ PQ ที่จุด P: วางเข็มที่ P เขียนส่วนโค้งตัด PQ สองข้างของ P', ops: [{ t: 'arc', c: P, r: s, a0: 70, a1: 110 }, { t: 'arc', c: P, r: s, a0: 250, a1: 290 }] },
        { say: 'กางวงเวียนให้ยาวขึ้น วางเข็มที่จุดตัดทั้งสองข้าง เขียนส่วนโค้งตัดกันทางขวาของ P', ops: [{ t: 'arc', c: U1, r: r3, a0: mgA(U1, [P[0] + hx, P[1]]) - 12, a1: mgA(U1, [P[0] + hx, P[1]]) + 12 }, { t: 'arc', c: U2, r: r3, a0: mgA(U2, [P[0] + hx, P[1]]) - 12, a1: mgA(U2, [P[0] + hx, P[1]]) + 12 }] },
        { say: 'ลากเส้นผ่าน P กับจุดตัด → ตั้งฉากกับ PQ จึง<b>ขนานกับ AB</b>', ops: [{ t: 'seg', a: [1.4, P[1]], b: [13, P[1]] }, { t: 'away' }] }],
      okMsg: '<b>สร้างเสร็จแล้ว!</b> เส้นที่ผ่าน P ตั้งฉากกับ PQ เหมือน AB จึงขนานกับ AB 🎉',
      goal: G => { const v = G.lineAt(P, 90), hz = G.lineAt(P, 0, 1.3); return v && hz && G.nArcs() >= 4 ? { ok: true } : { ok: false, why: !v ? 'ขั้นแรก: สร้างเส้นตั้งฉากจาก P ไปยัง AB' : 'ต่อไป: สร้างเส้นตั้งฉากกับเส้นนั้นที่จุด P' }; } }; },
  /* ส่วนสูงของรูปสามเหลี่ยม: เส้นตั้งฉากจากจุดยอด C ไปยังฐาน AB */
  altitude() { const A = [1.4, 2.6], B = [12.6, 2.6], C = [5.2, 7.8], r = 5.8, dd = Math.sqrt(r * r - (C[1] - A[1]) ** 2), C1 = [C[0] - dd, A[1]], C2 = [C[0] + dd, A[1]], r2 = 3.2, R = [C[0], A[1] - Math.sqrt(r2 * r2 - dd * dd)], F = [C[0], A[1]];
    return { title: 'สร้าง<b>ส่วนสูง</b>ของรูปสามเหลี่ยม ABC จากจุดยอด C ไปยังฐาน AB', given: { pts: { A, B, C }, segs: [['A', 'B'], ['B', 'C'], ['C', 'A']] }, compC: [11.4, 6.2], newNames: 'DEFGH',
      sol: [{ say: 'วางเข็มที่ <b>C</b> เขียนส่วนโค้งตัดฐาน AB สองจุด', ops: [{ t: 'arc', c: C, r, a0: mgA(C, C1) - 6, a1: mgA(C, C2) + 6 }] },
        { say: 'วางเข็มที่จุดตัดทั้งสอง เขียนส่วนโค้งรัศมีเท่ากันตัดกัน<b>ใต้ฐาน</b>', ops: [{ t: 'arc', c: C1, r: r2, a0: mgA(C1, R) - 14, a1: mgA(C1, R) + 14 }, { t: 'arc', c: C2, r: r2, a0: mgA(C2, R) - 14, a1: mgA(C2, R) + 14 }] },
        { say: 'ลากเส้นจาก C ไปยังจุดตัดนั้น ตัด AB ที่ <b>D</b> → CD คือส่วนสูง (CD ⊥ AB)', ops: [{ t: 'seg', a: C, b: [C[0], R[1] - .3] }, { t: 'pt', p: F, name: 'D' }, { t: 'away' }] }],
      marks: [{ p: F, name: 'D' }], okMsg: '<b>สร้างเสร็จแล้ว!</b> CD ตั้งฉากกับ AB — เป็นส่วนสูงของรูปสามเหลี่ยม 🎉',
      goal: G => { const ln = G.lineAt(C, 90) && G.segs().some(s => mgDseg(s, C) < .14 && mgDseg(s, F) < .2); return ln && G.nArcs() >= 3 ? { ok: true } : { ok: false, why: !G.arcAt(C).length ? 'เริ่มจากวางเข็มที่ C เขียนส่วนโค้งตัด AB สองจุด' : G.nArcs() < 3 ? 'เขียนส่วนโค้งรัศมีเท่ากันจากจุดตัดทั้งสองบน AB' : 'ลากเส้นจาก C ผ่านจุดตัดของส่วนโค้งให้ถึง AB' }; } }; },
  /* รูปหกเหลี่ยมด้านเท่ามุมเท่า: วงกลมแล้วก้าวรัศมีเดิมรอบวง */
  hexagon(r = 3) { const O = [7.25, 4.75], V = [0, 60, 120, 180, 240, 300].map(d => mgP(O, d, r)), nm = 'ABCDEF', sol = [{ say: `เขียนวงกลมจุดศูนย์กลาง O รัศมี ${mgF(r)} ซม. แล้วทำจุด <b>A</b> บนวงกลม`, ops: [{ t: 'arc', c: O, r, a0: 0, a1: 360 }, { t: 'pt', p: V[0], name: 'A' }] }];
    for (let i = 0; i < 5; i++) sol.push({ say: `<b>รัศมีเดิม</b> วางเข็มที่ ${nm[i]} เขียนส่วนโค้งตัดวงกลม ได้จุด <b>${nm[i + 1]}</b>`, ops: [{ t: 'arc', c: V[i], r, a0: 60 * i + 105, a1: 60 * i + 135 }, { t: 'pt', p: V[i + 1], name: nm[i + 1] }] });
    sol.push({ say: 'ลากส่วนของเส้นตรงเชื่อมจุดทั้งหกตามลำดับ', ops: [...V.map((p, i) => ({ t: 'seg', a: p, b: V[(i + 1) % 6] })), { t: 'away' }] });
    return { title: `สร้าง<b>รูปหกเหลี่ยมด้านเท่ามุมเท่า</b> ด้านยาว ${mgF(r)} ซม.`, given: { pts: { O } }, compC: [12.6, 6.2], newNames: 'ABCDEFG', sol,
      okMsg: `<b>สร้างเสร็จแล้ว!</b> ทุกด้านยาวเท่ารัศมี = ${mgF(r)} ซม. 🎉`,
      goal: G => G.arcAt(O).some(x => Math.abs(x.r - r) < .12) && G.nSegs() >= 6 ? { ok: true } : { ok: false, why: 'เขียนวงกลม แล้วก้าววงเวียนรัศมีเดิมรอบวง ลากเส้นเชื่อม 6 จุด' } }; }
});

/* =========================================================
   หน้าลงมือ (v231)
   ========================================================= */
const mgSvg = (W, H, cls) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', `0 0 ${W} ${H}`); s.setAttribute('class', cls + ' ia'); return s; };
const mgSvgPt = (svg, e) => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m.inverse()); return [r.x, r.y]; };
const mgDrag = (svg, on, up) => { let dn = false; svg.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); dn = true; try { svg.setPointerCapture(e.pointerId); } catch (_) { } on(mgSvgPt(svg, e)); });
  svg.addEventListener('pointermove', e => { if (dn) on(mgSvgPt(svg, e)); }); svg.addEventListener('pointerup', () => { if (!dn) return; dn = false; up && up(); }); svg.addEventListener('click', e => e.stopPropagation()); };
const MG_AT = [['มุมแหลม', d => d > 0 && d < 90, '#3D8BD9'], ['มุมฉาก', d => d === 90, '#E5487A'], ['มุมป้าน', d => d > 90 && d < 180, '#F0A020'], ['มุมตรง', d => d === 180, '#4FB97A'], ['มุมกลับ', d => d > 180 && d < 360, '#7C5CE0']];
/* ชนิดของมุม: ลากแขนของมุม ดูขนาดและชื่อชนิดเปลี่ยนตาม — หาให้ครบ 5 ชนิด */
function mgAngTypeSim() {
  const W = 560, H = 340, O = [280, 170], R = 130, svg = mgSvg(W, H, 'mg-sum'), out = fNote(), seen = new Set(), wrap = h('div', { class: 'colstack no-side' }, h6wait()); let th = 50;
  const chips = h('div', { class: 'rowstack mg-sets' }, ...MG_AT.map(([n, , c]) => h('span', { class: 'mg-chip', style: { '--pc': c } }, n)));
  const P = (d, r) => [O[0] + r * Math.cos(d * Math.PI / 180), O[1] - r * Math.sin(d * Math.PI / 180)];
  const draw = () => { const k = MG_AT.findIndex(t => t[1](th)), col = k < 0 ? '#9790B0' : MG_AT[k][2], a = P(th, 58), e = P(th, R);
    const sector = th === 0 ? '' : `<path d="M${O} L${P(0, 58)} A58 58 0 ${th > 180 ? 1 : 0} 0 ${a} Z" fill="${col}" fill-opacity=".28" stroke="${col}" stroke-width="2.4"/>`;
    const sq = th === 90 ? `<path d="M${P(0, 22)} L${[O[0] + 22, O[1] - 22]} L${P(90, 22)}" fill="none" stroke="${col}" stroke-width="2.4"/>` : '';
    svg.innerHTML = `${sector}${sq}<path d="M${O} L${P(0, R + 30)}" stroke="#2B2550" stroke-width="3.4" stroke-linecap="round"/><path d="M${O} L${e}" stroke="#2B2550" stroke-width="3.4" stroke-linecap="round"/><circle cx="${O[0]}" cy="${O[1]}" r="5" fill="#2B2550"/>
      <circle cx="${e[0]}" cy="${e[1]}" r="15" fill="#7C5CE0" fill-opacity=".22" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${e[0]}" cy="${e[1]}" r="6" fill="#7C5CE0"/>
      <text x="${P(th / 2, 86)[0]}" y="${P(th / 2, 86)[1] + 7}" text-anchor="middle" class="mg-big">${th}°</text><text x="${O[0] - 8}" y="${O[1] + 26}" class="mg-fn">B</text><text x="${P(0, R + 34)[0]}" y="${O[1] + 26}" class="mg-fn">A</text><text x="${e[0] + 12}" y="${e[1] - 12}" class="mg-fn">C</text>`;
    chips.querySelectorAll('.mg-chip').forEach((c, i) => c.classList.toggle('now', i === k));
    if (k >= 0) { seen.add(k); chips.children[k].classList.add('on'); }
    out.innerHTML = `∠ABC = <b>${th}°</b> → <b style="color:${col}">${k < 0 ? '-' : MG_AT[k][0]}</b>` + (seen.size === 5 ? '&emsp;ครบทั้ง 5 ชนิดแล้ว ✓' : `&emsp;(พบแล้ว ${seen.size} จาก 5 ชนิด)`); };
  mgDrag(svg, p => { let d = Math.round(Math.atan2(O[1] - p[1], p[0] - O[0]) * 180 / Math.PI); d = (d + 360) % 360; [90, 180].forEach(s => { if (Math.abs(d - s) <= 4) d = s; }); if (d < 3) d = 3; if (d > 357) d = 357; th = d; draw(); }, () => { sfx.pop(seen.size + 1); if (seen.size === 5) { sfx.ok(); teachDone(wrap); } });
  draw(); wrap.append(h('div', { class: 'cap' }, 'ลากจุดสีม่วงที่ปลายแขน BC ไปรอบ ๆ — หามุมให้ครบทั้ง 5 ชนิด (มุมฉากและมุมตรงจะดูดเข้าที่พอดี)'), chips, svg, out); return wrap;
}
/* สมบัติของเส้นแบ่งครึ่ง: 'seg' จุดบนเส้นตั้งฉากแบ่งครึ่ง AB ห่างจาก A และ B เท่ากัน · 'ang' จุดบนเส้นแบ่งครึ่งมุมห่างจากแขนทั้งสองเท่ากัน */
function mgEquiSim(mode) {
  const W = 560, H = 320, svg = mgSvg(W, H, 'mg-sum'), out = fNote(), wrap = h('div', { class: 'colstack no-side' }, h6wait()), K = 40, hits = new Set(); let P = mode === 'seg' ? [200, 80] : [330, 150];
  const A = [120, 260], B = [440, 260], V = [70, 280], ARM = 62, bis = ARM / 2, Pa = (d, r) => [V[0] + r * Math.cos(d * Math.PI / 180), V[1] - r * Math.sin(d * Math.PI / 180)];
  const foot = (d, p) => { const u = [Math.cos(d * Math.PI / 180), -Math.sin(d * Math.PI / 180)], t = (p[0] - V[0]) * u[0] + (p[1] - V[1]) * u[1]; return [V[0] + u[0] * t, V[1] + u[1] * t]; };
  const L = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) / K, f1 = x => (Math.round(x * 10) / 10).toFixed(1);
  const draw = () => { let s = '', on = false;
    if (mode === 'seg') { const d1 = L(P, A), d2 = L(P, B); on = Math.abs(P[0] - 280) < .5;
      s += `<path d="M280 20 V300" stroke="#E5487A" stroke-width="2.4" stroke-dasharray="7 6"/><path d="M${A} L${B}" stroke="#2B2550" stroke-width="3.4"/><path d="M270 260 h10 v-10" fill="none" stroke="#E5487A" stroke-width="2"/>`;
      s += `<path d="M${P} L${A}" stroke="#3D8BD9" stroke-width="2.6"/><path d="M${P} L${B}" stroke="#F0A020" stroke-width="2.6"/>`;
      s += `<text x="${(P[0] + A[0]) / 2 - 16}" y="${(P[1] + A[1]) / 2}" text-anchor="end" class="mg-len a">PA = ${f1(d1)}</text><text x="${(P[0] + B[0]) / 2 + 16}" y="${(P[1] + B[1]) / 2}" class="mg-len b">PB = ${f1(d2)}</text>`;
      s += `<circle cx="${A[0]}" cy="${A[1]}" r="5" fill="#2B2550"/><circle cx="${B[0]}" cy="${B[1]}" r="5" fill="#2B2550"/><text x="${A[0] - 22}" y="${A[1] + 8}" class="mg-fn">A</text><text x="${B[0] + 10}" y="${B[1] + 8}" class="mg-fn">B</text>`;
      out.innerHTML = `PA = <b>${f1(d1)}</b> ซม.&emsp;PB = <b>${f1(d2)}</b> ซม.` + (on ? '&emsp;<b style="color:#2E8A57">P อยู่บนเส้นแบ่งครึ่ง → PA = PB</b>' : ''); }
    else { const F1 = foot(0, P), F2 = foot(ARM, P), d1 = L(P, F1), d2 = L(P, F2), dg = Math.atan2(V[1] - P[1], P[0] - V[0]) * 180 / Math.PI; on = Math.abs(dg - bis) < .5;
      s += `<path d="M${V} L${Pa(bis, 520)}" stroke="#E5487A" stroke-width="2.4" stroke-dasharray="7 6"/><path d="M${V} L${Pa(0, 470)}" stroke="#2B2550" stroke-width="3.4"/><path d="M${V} L${Pa(ARM, 300)}" stroke="#2B2550" stroke-width="3.4"/>`;
      s += `<path d="M${P} L${F1}" stroke="#3D8BD9" stroke-width="2.6"/><path d="M${P} L${F2}" stroke="#F0A020" stroke-width="2.6"/><text x="${P[0] + 14}" y="${(P[1] + F1[1]) / 2 + 6}" class="mg-len a">${f1(d1)}</text><text x="${(P[0] + F2[0]) / 2 - 12}" y="${(P[1] + F2[1]) / 2 - 8}" text-anchor="end" class="mg-len b">${f1(d2)}</text>`;
      s += `<circle cx="${V[0]}" cy="${V[1]}" r="5" fill="#2B2550"/><text x="${V[0] - 24}" y="${V[1] + 6}" class="mg-fn">O</text>`;
      out.innerHTML = `ระยะจาก P ถึงแขน OA = <b>${f1(d1)}</b> ซม.&emsp;ถึงแขน OB = <b>${f1(d2)}</b> ซม.` + (on ? '&emsp;<b style="color:#2E8A57">เท่ากัน!</b>' : ''); }
    s += `<circle cx="${P[0]}" cy="${P[1]}" r="15" fill="#7C5CE0" fill-opacity=".22" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${P[0]}" cy="${P[1]}" r="6" fill="${on ? '#2E8A57' : '#7C5CE0'}"/><text x="${P[0] + 14}" y="${P[1] - 14}" class="mg-fn">P</text>`;
    svg.innerHTML = s; return on; };
  mgDrag(svg, p => { let q = [Math.max(30, Math.min(W - 30, p[0])), Math.max(20, Math.min(H - 30, p[1]))];
    if (mode === 'seg' && Math.abs(q[0] - 280) < 12) q[0] = 280;
    if (mode === 'ang') { const dg = Math.atan2(V[1] - q[1], q[0] - V[0]) * 180 / Math.PI, r = Math.hypot(q[0] - V[0], q[1] - V[1]); if (Math.abs(dg - bis) < 4 && r > 40) q = Pa(bis, r); }
    P = q; draw(); }, () => { if (draw()) { const k = Math.round(P[1] / 30); if (!hits.has(k)) { hits.add(k); sfx.pop(hits.size + 2); } }
    if (hits.size >= 3) { out.innerHTML += mode === 'seg' ? '<br>สรุป: <b>ทุกจุดบนเส้นตั้งฉากแบ่งครึ่ง AB อยู่ห่างจาก A และ B เท่ากัน</b>' : '<br>สรุป: <b>ทุกจุดบนเส้นแบ่งครึ่งมุมอยู่ห่างจากแขนทั้งสองของมุมเท่ากัน</b>'; sfx.ok(); teachDone(wrap); }
    else if (draw()) out.innerHTML += `&emsp;(ลองอีก ${3 - hits.size} ตำแหน่งบนเส้นประ)`; });
  draw(); wrap.append(h('div', { class: 'cap' }, mode === 'seg' ? 'ลากจุด P ไปวางบนเส้นประสีชมพู (เส้นตั้งฉากแบ่งครึ่ง AB) อย่างน้อย 3 ตำแหน่ง แล้วเทียบ PA กับ PB' : 'ลากจุด P ไปวางบนเส้นประสีชมพู (เส้นแบ่งครึ่งมุม) อย่างน้อย 3 ตำแหน่ง แล้วเทียบระยะถึงแขนทั้งสอง'), svg, out); return wrap;
}
/* ระยะห่างระหว่างจุดกับเส้นตรง: เลื่อนจุด Q บนเส้นตรง หาตำแหน่งที่ PQ สั้นที่สุด */
function mgDistSim() {
  const W = 560, H = 300, svg = mgSvg(W, H, 'mg-sum'), out = fNote(), wrap = h('div', { class: 'colstack no-side' }, h6wait()), P = [300, 70], y = 250, K = 40; let qx = 110, moves = 0, done = false;
  const draw = () => { const d = Math.hypot(qx - P[0], y - P[1]) / K, on = qx === P[0];
    svg.innerHTML = `<path d="M20 ${y} H${W - 20}" stroke="#2B2550" stroke-width="3.4"/><text x="${W - 34}" y="${y + 28}" class="mg-fn">B</text><text x="22" y="${y + 28}" class="mg-fn">A</text>
      <path d="M${P} L${qx} ${y}" stroke="${on ? '#2E8A57' : '#E5487A'}" stroke-width="3"/>${on ? `<path d="M${qx} ${y - 16} h16 v16" fill="none" stroke="#2E8A57" stroke-width="2.4"/>` : ''}
      <text x="${(P[0] + qx) / 2 + 12}" y="${(P[1] + y) / 2}" class="mg-len">PQ = ${d.toFixed(1)} ซม.</text><circle cx="${P[0]}" cy="${P[1]}" r="6" fill="#2B2550"/><text x="${P[0] + 10}" y="${P[1] - 8}" class="mg-fn">P</text>
      <circle cx="${qx}" cy="${y}" r="15" fill="#7C5CE0" fill-opacity=".22" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${qx}" cy="${y}" r="6" fill="#7C5CE0"/><text x="${qx - 6}" y="${y + 34}" class="mg-fn">Q</text>`;
    out.innerHTML = on ? `PQ = <b>${d.toFixed(1)} ซม.</b> สั้นที่สุด — <b>PQ ⊥ AB</b> ✓<br>ระยะห่างระหว่างจุด P กับเส้นตรง AB วัดตาม<b>แนวตั้งฉาก</b>` : `PQ = <b>${d.toFixed(1)} ซม.</b> — เลื่อน Q หาตำแหน่งที่ PQ <b>สั้นที่สุด</b>`; return on; };
  mgDrag(svg, p => { let x = Math.max(30, Math.min(W - 30, Math.round(p[0]))); if (Math.abs(x - P[0]) < 10) x = P[0]; qx = x; draw(); }, () => { moves++; sfx.pop(moves % 6 + 1); if (draw() && moves >= 2 && !done) { done = true; sfx.ok(); teachDone(wrap); } });
  draw(); wrap.append(h('div', { class: 'cap' }, 'ลากจุด Q (สีม่วง) ไปตามเส้นตรง AB แล้วดูความยาวของ PQ'), svg, out); return wrap;
}
/* เส้นขนานกับเส้นตัด: ลากเส้นตัดเปลี่ยนมุม แตะปุ่มดูคู่มุม */
const MG_PAIR = { corr: [['1', '5'], ['2', '6'], ['3', '7'], ['4', '8']], alt: [['3', '5'], ['4', '6']], co: [['3', '6'], ['4', '5']], ext: [['1', '7'], ['2', '8']] };
const MG_PNAME = { corr: 'มุมสมนัย', alt: 'มุมแย้ง', co: 'มุมภายในบนข้างเดียวกันของเส้นตัด', vert: 'มุมตรงข้าม' };
const mgSecDeg = (k, t) => (+k % 2 ? t : 180 - t);
function mgTransSim() {
  const W = 600, H = 330, y1 = 110, y2 = 240, X1 = 330, svg = mgSvg(W, H, 'mg-sum mg-trans'), out = fNote(), wrap = h('div', { class: 'colstack no-side' }, h6wait()), seen = new Set(); let t = 60, show = null;
  const col = { corr: '#3D8BD9', alt: '#E5487A', co: '#2FB5A3' };
  const P = (c, d, r) => [c[0] + r * Math.cos(d * Math.PI / 180), c[1] - r * Math.sin(d * Math.PI / 180)];
  const draw = () => { const Ia = [X1, y1], Ib = [X1 - (y2 - y1) / Math.tan(t * Math.PI / 180), y2], sec = [[0, t], [t, 180], [180, 180 + t], [180 + t, 360]];
    const hl = show ? MG_PAIR[show][0] : []; let s = `<path d="M20 ${y1} H${W - 20}" stroke="#2B2550" stroke-width="3.2"/><path d="M20 ${y2} H${W - 20}" stroke="#2B2550" stroke-width="3.2"/><text x="${W - 26}" y="${y1 - 10}" class="mg-fn">ℓ</text><text x="${W - 26}" y="${y2 - 10}" class="mg-fn">m</text>`;
    const e1 = P(Ia, t, 90), e2 = P(Ib, t + 180, 90); s += `<path d="M${e1} L${e2}" stroke="#7C5CE0" stroke-width="3.2"/>`;
    [Ia, Ib].forEach((c, j) => sec.forEach(([a0, a1], i) => { const k = String(j * 4 + i + 1), on = hl.includes(k), r = 30, m = (a0 + a1) / 2, A = P(c, a0, r), B = P(c, a1, r), T = P(c, m, 46);
      s += `<path d="M${c} L${A} A${r} ${r} 0 0 0 ${B} Z" fill="${on ? col[show] : '#E9E5F5'}" fill-opacity="${on ? .75 : .7}" stroke="${on ? col[show] : '#C9C2DD'}" stroke-width="1.6"/><text x="${T[0]}" y="${T[1] + 6}" text-anchor="middle" class="mg-sn${on ? ' on' : ''}">${k}</text>`; }));
    s += `<circle cx="${e1[0]}" cy="${e1[1]}" r="15" fill="#7C5CE0" fill-opacity=".22" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${e1[0]}" cy="${e1[1]}" r="6" fill="#7C5CE0"/><text x="${e1[0] + 14}" y="${e1[1] + 4}" class="mg-fn">t</text>`;
    svg.innerHTML = s;
    if (show) { const [a, b] = MG_PAIR[show][0], da = mgSecDeg(a, t), db = mgSecDeg(b, t); out.innerHTML = `${MG_PNAME[show]}: ∠${a} = <b>${da}°</b> และ ∠${b} = <b>${db}°</b> → ${show === 'co' ? `รวมกัน <b>${da + db}°</b>` : '<b>เท่ากัน</b>'}`; } };
  mgDrag(svg, p => { if (p[1] > y1 - 10) return; let d = Math.round(Math.atan2(y1 - p[1], p[0] - X1) * 180 / Math.PI); t = Math.max(35, Math.min(145, d)); draw(); }, () => sfx.tap());
  const row = h('div', { class: 'rowstack mg-sets' }, ...['corr', 'alt', 'co'].map(k => h('button', { class: 'btn ia mg-set', style: { '--pc': col[k] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); show = k; seen.add(k); draw(); sfx.pop(seen.size + 2); if (seen.size === 3) { out.innerHTML += '<br>ลากปลายเส้นตัด t ดู — <b>ℓ ∥ m</b> มุมสมนัยและมุมแย้งเท่ากันเสมอ มุมภายในบนข้างเดียวกันรวมกัน 180° เสมอ'; teachDone(wrap); } } }, MG_PNAME[k])));
  draw(); wrap.append(h('div', { class: 'cap' }, 'ℓ ∥ m และ t เป็นเส้นตัด — แตะปุ่มดูคู่มุม แล้วลากจุดสีม่วงเพื่อเปลี่ยนมุมของเส้นตัด'), row, svg, out); return wrap;
}

/* =========================================================
   ข้อในเกม (v231)
   ========================================================= */
/* รูปเส้นขนาน ℓ, m กับเส้นตัด t · marks = [[เลขมุม, ป้าย, สี]] */
const mgTransFig = (t, marks, max = 420) => { const Pp = [1.2, 2.8], Qq = mgP(Pp, 180 + t, 2.8 / Math.sin(t * Math.PI / 180)), sec = [[0, t], [t, 180], [180, 180 + t], [180 + t, 360]], f = { pts: { _a: [-3.6, 2.8], _b: [4.6, 2.8], _c: [-3.6, 0], _d: [4.6, 0], _p: Pp, _q: Qq, _e: mgP(Pp, t, 1.3), _f: mgP(Qq, t + 180, 1.3) }, lines: [['_a', '_b', .1], ['_c', '_d', .1]], segs: [['_e', '_f']], angs: [], labs: [[[4.9, 3.1], 'ℓ'], [[4.9, .3], 'm'], [mgP(Pp, t, 1.5), 't']], hide: ['_a', '_b', '_c', '_d', '_p', '_q', '_e', '_f'] };
  marks.forEach(([k, lab, col]) => { const c = +k <= 4 ? Pp : Qq, [a0, a1] = sec[(+k - 1) % 4]; f.angs.push([c, mgP(c, a0, 1), mgP(c, a1, 1), lab, col, .62, .45]); }); return mgFig(f, { max, pad: .5 }); };
const mgPairQ = kind => { const t = mgPick([50, 55, 60, 65, 70, 115, 120, 125]), [a, b] = mgPick(kind === 'vert' ? [['1', '3'], ['2', '4'], ['5', '7']] : MG_PAIR[kind]);
  return Q.mgPick({ q: 'ℓ ∥ m มุมที่ระบายสีทั้งสองเป็นมุมคู่ใด', fig: mgTransFig(t, [[a, '', '#3D8BD9'], [b, '', '#E5487A']]), opts: ['มุมสมนัย', 'มุมแย้ง', 'มุมภายในบนข้างเดียวกันของเส้นตัด', 'มุมตรงข้าม'], right: MG_PNAME[kind], hint: 'สมนัย = ตำแหน่งเดียวกันที่จุดตัดทั้งสอง · แย้ง = อยู่ระหว่างเส้นขนาน คนละข้างของเส้นตัด · ภายในข้างเดียวกัน = อยู่ระหว่างเส้นขนาน ข้างเดียวกัน', sig: 'pair' + kind + ' ' + t + a + b }); };
const mgPairNumQ = kind => { const t = mgPick([48, 52, 58, 64, 72, 108, 116, 124]), [a, b] = mgPick(MG_PAIR[kind]), da = mgSecDeg(a, t), db = mgSecDeg(b, t);
  return Q.mgNum({ q: `ℓ ∥ m ถ้ามุมสีฟ้ามีขนาด ${da}° มุม x มีขนาดกี่องศา`, fig: mgTransFig(t, [[a, `${da}°`, '#3D8BD9'], [b, 'x', '#E5487A']]), a: db, unit: 'องศา', hint: kind === 'co' ? 'มุมภายในบนข้างเดียวกันของเส้นตัด รวมกันได้ 180°' : `${MG_PNAME[kind]}มีขนาดเท่ากัน`, sig: 'pairn' + kind + ' ' + t + a + b }); };
/* ความสัมพันธ์ของเส้นตรงสองเส้น */
const mgRelQ = k => { const f = k === 'par' ? { pts: { A: [0, 1.6], B: [4, 1.6], C: [0, 0], D: [4, 0] }, lines: [['A', 'B', .3], ['C', 'D', .3]] } : k === 'perp' ? { pts: { A: [0, 1], B: [4, 1], C: [2, -.6], D: [2, 2.6] }, lines: [['A', 'B', .3], ['C', 'D', .3]], angs: [[[2, 1], [3, 1], [2, 2], '']] } : { pts: { A: [0, .4], B: [4, 1.6], C: [.6, 2.4], D: [3.4, -.4] }, lines: [['A', 'B', .3], ['C', 'D', .3]] };
  return Q.mgPick({ q: 'เส้นตรง AB กับเส้นตรง CD มีความสัมพันธ์กันอย่างไร', fig: mgFig(f, { max: 300 }), opts: ['ขนานกัน', 'ตั้งฉากกัน', 'ตัดกันแต่ไม่ตั้งฉาก'], right: { par: 'ขนานกัน', perp: 'ตั้งฉากกัน', cut: 'ตัดกันแต่ไม่ตั้งฉาก' }[k], hint: 'ขนาน = ไม่ตัดกันเลย · ตั้งฉาก = ตัดกันเป็นมุมฉาก', sig: 'rel' + k }); };
/* เครื่องมือ */
const MG_TOOL = [['ต้องการ<b>วัดความยาว</b>ของส่วนของเส้นตรง ใช้เครื่องมือใด', 'ไม้บรรทัด', ['วงเวียน', 'โพรแทรกเตอร์', 'ไม้ฉาก']], ['ต้องการ<b>เขียนวงกลมหรือส่วนโค้ง</b> ใช้เครื่องมือใด', 'วงเวียน', ['ไม้บรรทัด', 'โพรแทรกเตอร์', 'ไม้ฉาก']],
  ['ต้องการ<b>วัดขนาดของมุม</b> ใช้เครื่องมือใด', 'โพรแทรกเตอร์', ['วงเวียน', 'ไม้บรรทัด', 'สันตรง']], ['ต้องการ<b>ตรวจว่ามุมเป็นมุมฉาก</b>อย่างรวดเร็ว ใช้เครื่องมือใด', 'ไม้ฉาก', ['วงเวียน', 'สันตรง', 'ไม้บรรทัดอย่างเดียว']],
  ['ใน<b>การสร้างทางเรขาคณิต</b> ใช้เครื่องมือคู่ใด', 'วงเวียนและสันตรง', ['โพรแทรกเตอร์และไม้ฉาก', 'ไม้บรรทัดวัดความยาวอย่างเดียว', 'กรรไกรและกาว']], ['ต้องการ<b>ลอกความยาว</b>ของ AB ไปไว้ที่อื่นโดยไม่วัด ใช้เครื่องมือใด', 'วงเวียน', ['โพรแทรกเตอร์', 'ไม้ฉาก', 'ยางลบ']]];
const mgToolQ = i => { const [q, r, w] = MG_TOOL[i]; return Q.mgPick({ q, opts: [r, ...w], right: r, hint: 'คิดว่างานนั้นต้องวัด ต้องเขียนส่วนโค้ง หรือต้องการมุม', sig: 'tool' + i }); };
/* ส่วนประกอบของมุม */
const mgPartQ = k => { const n = mgPick(['PQR', 'XYZ', 'KLM']), f = mgAngFig(mgPick([50, 70, 110]), { n, rot: mgPick([0, 20]) }), right = k === 'v' ? `จุด ${n[1]}` : `${mgSym('ray', n[1] + n[0])} และ ${mgSym('ray', n[1] + n[2])}`;
  return Q.mgPick({ q: k === 'v' ? `<b>จุดยอด</b>ของ ∠${n} คือจุดใด` : `<b>แขน</b>ของ ∠${n} คือข้อใด`, fig: f, opts: k === 'v' ? [`จุด ${n[0]}`, `จุด ${n[1]}`, `จุด ${n[2]}`] : [right, `${mgSym('ray', n[0] + n[1])} และ ${mgSym('ray', n[2] + n[1])}`, `${mgSym('seg', n[0] + n[2])}`], right, hint: 'ชื่อมุมเขียนจุดยอดไว้ตรงกลาง แขนคือรังสีที่เริ่มจากจุดยอด', sig: 'part' + k + ' ' + n }); };
/* ชนิดของรูปสามเหลี่ยม */
const mgTriSideQ = () => { const [L, nm] = mgPick([[[5, 5, 5], 'รูปสามเหลี่ยมด้านเท่า'], [[6, 6, 4], 'รูปสามเหลี่ยมหน้าจั่ว'], [[4, 6, 7], 'รูปสามเหลี่ยมด้านไม่เท่า'], [[7, 4, 7], 'รูปสามเหลี่ยมหน้าจั่ว'], [[3, 5, 6], 'รูปสามเหลี่ยมด้านไม่เท่า']]);
  return Q.mgPick({ q: `รูปสามเหลี่ยมที่มีด้านยาว ${L.join(' ซม., ')} ซม. เป็นรูปสามเหลี่ยมชนิดใด (จำแนกตามด้าน)`, opts: ['รูปสามเหลี่ยมด้านเท่า', 'รูปสามเหลี่ยมหน้าจั่ว', 'รูปสามเหลี่ยมด้านไม่เท่า'], right: nm, hint: 'ด้านเท่ากัน 3 ด้าน = ด้านเท่า · 2 ด้าน = หน้าจั่ว · ไม่เท่ากันเลย = ด้านไม่เท่า', sig: 'triS ' + L }); };
const mgTriAngQ = () => { const [A, nm] = mgPick([[[50, 60, 70], 'รูปสามเหลี่ยมมุมแหลม'], [[90, 35, 55], 'รูปสามเหลี่ยมมุมฉาก'], [[110, 40, 30], 'รูปสามเหลี่ยมมุมป้าน'], [[45, 45, 90], 'รูปสามเหลี่ยมมุมฉาก'], [[65, 65, 50], 'รูปสามเหลี่ยมมุมแหลม'], [[25, 130, 25], 'รูปสามเหลี่ยมมุมป้าน']]);
  return Q.mgPick({ q: `รูปสามเหลี่ยมที่มีมุม ${A.join('°, ')}° เป็นรูปสามเหลี่ยมชนิดใด (จำแนกตามมุม)`, opts: ['รูปสามเหลี่ยมมุมแหลม', 'รูปสามเหลี่ยมมุมฉาก', 'รูปสามเหลี่ยมมุมป้าน'], right: nm, hint: 'ดูมุมที่ใหญ่ที่สุด: < 90° แหลม · = 90° ฉาก · > 90° ป้าน', sig: 'triA ' + A }); };
const mgSegOpQ = k => { const a = mgPick([4, 5, 6, 7]), b = mgPick([1.5, 2, 2.5, 3]), [q, v, hnt] = { add: [`AB ยาว ${a} ซม. และ CD ยาว ${b} ซม. สร้าง PQ = AB + CD ด้วยวงเวียน PQ ยาวกี่ ซม.`, a + b, 'ลอก AB แล้วลอก CD ต่อ'], sub: [`AB ยาว ${a} ซม. และ CD ยาว ${b} ซม. สร้าง PQ = AB − CD ด้วยวงเวียน PQ ยาวกี่ ซม.`, a - b, 'ลอก AB แล้วลอก CD ย้อนกลับจากปลาย'], two: [`AB ยาว ${b} ซม. สร้าง PQ = 3AB (ลอก AB ต่อกัน 3 ครั้ง) PQ ยาวกี่ ซม.`, 3 * b, `${b} × 3`], mix: [`AB ยาว ${a} ซม. และ CD ยาว ${b} ซม. สร้าง PQ = AB + 2CD PQ ยาวกี่ ซม.`, a + 2 * b, 'ลอก AB แล้วลอก CD ต่ออีก 2 ครั้ง'] }[k];
  return Q.mgNum({ q, a: Math.round(v * 10) / 10, unit: 'ซม.', hint: hnt, sig: 'seg' + k + ' ' + a + b }); };

const mgPbQ = v => Q.mgNum({ q: `P อยู่บนเส้นตั้งฉากแบ่งครึ่ง AB ถ้า PA ยาว ${v} ซม. แล้ว PB ยาวกี่ ซม.`, fig: mgFig({ pts: { A: [0, 0], B: [5, 0], P: [2.5, 2.6] }, segs: [['A', 'B'], ['P', 'A'], ['P', 'B']], dash: [[[2.5, -.6], [2.5, 3.2]]], ticks: [['A', [2.5, 0], 1], [[2.5, 0], 'B', 1]] }, { max: 340 }), a: v, unit: 'ซม.', hint: 'จุดบนเส้นตั้งฉากแบ่งครึ่งอยู่ห่างจาก A และ B เท่ากัน', sig: 'pbeq ' + v });
const mgBisRevQ = v => Q.mgNum({ q: `OC แบ่งครึ่ง ∠AOB ถ้า ∠AOC = ${v}° แล้ว ∠AOB มีขนาดกี่องศา`, a: 2 * v, unit: 'องศา', hint: 'มุมเดิม = 2 เท่าของมุมที่แบ่งได้', sig: 'bisrev ' + v });
/* =========================================================
   บทเรียน 2201–2212 + บอส 2219 (ชุดใหม่ v231 — 12 ด่านตามโครงสร้างที่ผู้ใช้ให้)
   ========================================================= */
const LM2 = (no, place, title, short, goal, teach, game) => ({ id: 2200 + no, no, place, title, short, tone: TONES5[(no + 3) % 6], goal, teach, game });
const LESSONS_M1C2 = [
  LM2(1, 'ท่าเรือรูปพื้นฐาน', 'รู้จักรูปเรขาคณิตและสัญลักษณ์พื้นฐาน', 'จุด เส้น รังสี มุม', 'แยกความแตกต่างของจุด เส้นตรง ส่วนของเส้นตรง รังสี และมุม อ่านและเขียนสัญลักษณ์ บอกจุดยอดและแขนของมุม จำแนกชนิดของมุม และรู้จักเส้นขนาน เส้นตั้งฉาก', [
    T('รู้จัก<b>จุด เส้นตรง ส่วนของเส้นตรง รังสี</b> — แตะการ์ดดูทีละใบ', 'รู้จักจุด เส้นตรง ส่วนของเส้นตรง และรังสี แตะการ์ดดูทีละใบ', el => el.append(mgCards([
      [mgKindFig('pt') + '<b>จุด</b>', `<b>จุด A</b><small>ใช้บอกตำแหน่ง ไม่มีขนาด</small>`, 'จุด'], [mgKindFig('line') + '<b>เส้นตรง</b>', `<b>${mgSym('line', 'AB')}</b><small>ยาวไม่สิ้นสุดทั้งสองทาง</small>`, 'เส้นตรง'],
      [mgKindFig('seg') + '<b>ส่วนของเส้นตรง</b>', `<b>${mgSym('seg', 'AB')}</b><small>มีจุดปลาย 2 จุด วัดความยาวได้</small>`, 'ส่วนของเส้นตรง'], [mgKindFig('ray') + '<b>รังสี</b>', `<b>${mgSym('ray', 'AB')}</b><small>มีจุดปลาย 1 จุด (A) ยาวไม่สิ้นสุดทางเดียว</small>`, 'รังสี']], 'mg-cards'))),
    T('<b>มุม</b>: จุดยอดและแขน — แตะการ์ดดูทีละใบ', 'มุม จุดยอดและแขน แตะการ์ดดูทีละใบ', el => el.append(h('div', { class: 'mg-qrow' }, h('div', { class: 'mg-figbox', html: mgAngFig(55, { n: 'BAC', lab: '' }) }), mgCards([['ชื่อมุม', '<b>∠BAC หรือ ∠CAB</b><small>จุดยอดอยู่ตรงกลางเสมอ</small>'], ['จุดยอด', '<b>จุด A</b><small>จุดปลายร่วมของรังสีสองเส้น</small>'], ['แขนของมุม', `<b>${mgSym('ray', 'AB')} และ ${mgSym('ray', 'AC')}</b>`]], 'mg-cards')))),
    T('<b>ชนิดของมุม</b> — ลากแขนของมุมให้ครบ 5 ชนิด', 'ชนิดของมุม ลากแขนของมุมให้ครบห้าชนิด', el => el.append(mgAngTypeSim())),
    T('<b>เส้นตรงสองเส้น</b> และรูปหลายเหลี่ยม — แตะการ์ดดูทีละใบ', 'เส้นตรงสองเส้น และรูปหลายเหลี่ยม แตะการ์ดดูทีละใบ', el => el.append(mgCards([['ขนานกัน', '<b>ℓ ∥ m</b><small>ไม่ตัดกัน ห่างกันเท่ากันตลอด</small>'], ['ตั้งฉากกัน', '<b>AB ⊥ CD</b><small>ตัดกันเป็นมุมฉาก 90°</small>'], ['จุดสองจุด', '<b>ลากเส้นตรงผ่านได้เพียงเส้นเดียว</b>'], ['เส้นตรงสองเส้นตัดกัน', '<b>ตัดกันได้เพียงจุดเดียว</b>'], ['รูปสามเหลี่ยม', '<b>ส่วนของเส้นตรง 3 เส้น</b><small>มีจุดยอด 3 จุด</small>'], ['รูปสี่เหลี่ยม', '<b>ส่วนของเส้นตรง 4 เส้น</b><small>มีจุดยอด 4 จุด</small>']], 'mg-cards')))
  ], () => [mgKindQ('seg', 'PQ'), mgKindQ('line', 'XY'), mgSymQ('seg', 'CD'), mgSymQ('ray', 'EF'), mgSymQ('line', 'GH'), mgPartQ('v'), mgPartQ('a'), ...[0, 1, 2, 3, 4].map(mgAngKindQ), mgRelQ('par'), mgRelQ('perp'), mgRelQ('cut'),
    Q.mgNum({ q: 'กำหนดจุดสองจุด ลากเส้นตรงผ่านจุดทั้งสองได้กี่เส้น', a: 1, unit: 'เส้น', hint: 'มีเส้นตรงเพียงเส้นเดียวที่ผ่านจุดสองจุด', sig: 'prop1' }),
    mgTF(`${mgSym('ray', 'AB')} กับ ${mgSym('ray', 'BA')} เป็นรังสีเดียวกัน`, false, 'จุดปลายต่างกัน (A กับ B) และไปคนละทาง จึงเป็นคนละรังสี'), mgTF('มุมกลับมีขนาดมากกว่า 180° แต่น้อยกว่า 360°', true, ''), mgTF('ส่วนของเส้นตรงวัดความยาวได้ แต่รังสีวัดความยาวไม่ได้', true, 'รังสียาวไม่สิ้นสุดทางเดียว')]),
  LM2(2, 'โรงเครื่องมือริมน้ำ', 'รู้จักเครื่องมือและหลักการสร้างทางเรขาคณิต', 'เครื่องมือ·รัศมี', 'ใช้ไม้บรรทัด วงเวียน ไม้ฉาก และโพรแทรกเตอร์ได้ถูกต้อง บอกความแตกต่างระหว่างการวัดกับการสร้าง เข้าใจจุดศูนย์กลาง รัศมี และจุดตัดของส่วนโค้ง', [
    T('<b>เครื่องมือ</b> และ<b>การวัด ≠ การสร้าง</b> — แตะการ์ดดูทีละใบ', 'เครื่องมือ และการวัดไม่เหมือนการสร้าง แตะการ์ดดูทีละใบ', el => el.append(mgCards([['ไม้บรรทัด', '<b>วัดความยาว ลากเส้นตรง</b><small>มีสเกลบอกความยาว</small>'], ['สันตรง', '<b>ลากเส้นตรงเท่านั้น</b><small>ไม่ใช้สเกลวัด</small>'], ['วงเวียน', '<b>เขียนวงกลม/ส่วนโค้ง ลอกความยาว</b>'], ['ไม้ฉาก', '<b>เขียน/ตรวจมุมฉาก</b>'], ['โพรแทรกเตอร์', '<b>วัดและเขียนมุม</b><small>ในเกมนี้คือครึ่งวงกลม</small>'], ['การสร้าง', '<b>ใช้วงเวียนและสันตรง</b><small>อาศัยความยาวที่เท่ากัน ไม่กะด้วยสายตา และเห็นร่องรอยการสร้าง</small>']], 'mg-cards'))),
    T('ตัวอย่างทีละขั้น: <b>จุดศูนย์กลางและรัศมี</b> — เขียนวงกลม', 'ตัวอย่างทีละขั้น จุดศูนย์กลางและรัศมี เขียนวงกลม', mgDemo(mgT.circ(3))),
    T('<b>ลองหาเอง</b>: จุดตัดของส่วนโค้ง — ติดตรงไหนกด คำใบ้', 'ลองหาเอง จุดตัดของส่วนโค้ง', mgTry(mgT.meet(4, 3, 5))),
    T('ตัวอย่างทีละขั้น: <b>วัดมุมด้วยโพรแทรกเตอร์ (ครึ่งวงกลม)</b>', 'ตัวอย่างทีละขั้น วัดมุมด้วยโพรแทรกเตอร์', mgDemo(mgMeasDemo(65, 15)))
  ], () => [0, 1, 2, 3, 4, 5].map(mgToolQ).concat([Q.mgBuild(mgT.circ(mgPick([2.5, 3.5, 4])), 'เขียนวงกลมตามรัศมีที่กำหนด'), Q.mgBuild(mgT.meet(mgPick([4.5, 5]), mgPick([3.5, 4]), 6), 'หาจุดที่อยู่ห่างจากสองจุดตามที่กำหนด'),
    Q.mgMeasure({ deg: mgPick([35, 55, 70]), rot: mgPick([0, 20]) }), Q.mgMeasure({ deg: mgPick([110, 125, 145]), rot: mgPick([0, 10]), name: 'PQR' }),
    Q.mgNum({ q: 'วงกลมรัศมี 3.5 ซม. มีเส้นผ่านศูนย์กลางยาวกี่ ซม.', a: 7, unit: 'ซม.', hint: 'เส้นผ่านศูนย์กลาง = 2 × รัศมี', sig: 'diam' }),
    Q.mgPick({ q: 'ข้อใดเป็น<b>การสร้าง</b> ไม่ใช่การวัด', opts: ['ใช้วงเวียนลอกความยาว AB ไปไว้บนรังสี', 'ใช้ไม้บรรทัดวัดว่า AB ยาว 5 ซม.', 'ใช้โพรแทรกเตอร์อ่านว่ามุมกาง 60°', 'กะระยะด้วยสายตาแล้ววาด'], right: 'ใช้วงเวียนลอกความยาว AB ไปไว้บนรังสี', hint: 'การสร้างใช้วงเวียนและสันตรง โดยไม่อ่านตัวเลข', sig: 'cons' }),
    mgTF('ทุกจุดบนวงกลมอยู่ห่างจากจุดศูนย์กลางเท่ากัน', true, 'ระยะนั้นคือรัศมี'), mgTF('จุดตัดของส่วนโค้งจาก A รัศมี 4 ซม. กับส่วนโค้งจาก B รัศมี 3 ซม. อยู่ห่างจาก A 3 ซม.', false, 'อยู่บนส่วนโค้งจาก A จึงห่างจาก A 4 ซม.')])),
  LM2(3, 'ลำธารลอกเส้น', 'การสร้างส่วนของเส้นตรงและการคัดลอกความยาว', 'สร้าง·ลอกความยาว', 'สร้างส่วนของเส้นตรงตามความยาวที่กำหนด คัดลอกความยาวด้วยวงเวียน และสร้างความยาวที่เป็นผลบวก ผลต่าง หรือหลายเท่าของความยาวที่กำหนด', [
    T('ตัวอย่างทีละขั้น: <b>สร้าง CD ให้ยาวเท่ากับ AB</b> (ลอกความยาวด้วยวงเวียน)', 'ตัวอย่างทีละขั้น สร้างซีดีให้ยาวเท่ากับเอบี', mgDemo(mgT.copySeg(4.3))),
    T('ตัวอย่างทีละขั้น: <b>PR = AB + CD</b> (ส่วนของเส้นตรงต่อเนื่องกัน)', 'ตัวอย่างทีละขั้น พีอาร์เท่ากับเอบีบวกซีดี', mgDemo(mgT.sumSeg(3.1, 2.4))),
    T('ตัวอย่างทีละขั้น: <b>PR = AB − CD</b>', 'ตัวอย่างทีละขั้น พีอาร์เท่ากับเอบีลบซีดี', mgDemo(mgT.diffSeg(5.2, 2.1))),
    T('<b>ลองสร้างเอง</b>: ยาว 3 เท่าของ AB — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง ยาวสามเท่าของเอบี', mgTry(mgT.kSeg(2.4, 3)))
  ], () => [Q.mgBuild(mgT.segLen(mgPick([4.5, 5.5, 6.5])), 'สร้างส่วนของเส้นตรงตามความยาวที่กำหนด'), Q.mgBuild(mgT.copySeg(mgPick([3.6, 4.7, 5.2])), 'ลอกความยาว AB ลงบนรังสี CX'), Q.mgBuild(mgT.sumSeg(mgPick([2.8, 3.3]), mgPick([2.1, 2.6])), 'สร้างผลบวกของความยาวด้วยวงเวียน'), Q.mgBuild(mgT.diffSeg(mgPick([4.6, 5.6]), mgPick([1.8, 2.3])), 'สร้างผลต่างของความยาวด้วยวงเวียน'), Q.mgBuild(mgT.kSeg(mgPick([2, 2.6]), 2), 'สร้างความยาว 2 เท่าของ AB'),
    mgTraceQ('copySeg', 'การสร้างส่วนของเส้นตรงให้ยาวเท่ากับที่กำหนด'), mgSegOpQ('add'), mgSegOpQ('sub'), mgSegOpQ('two'), mgSegOpQ('mix'),
    Q.mgPick({ q: 'การลอกความยาว AB ด้วยวงเวียน ขั้นแรกทำอย่างไร', opts: ['วางเข็มที่ A กางขาดินสอไปที่ B', 'วัด AB ด้วยไม้บรรทัดแล้วจำตัวเลข', 'วางเข็มที่กึ่งกลางของ AB', 'กางวงเวียนเท่าใดก็ได้'], right: 'วางเข็มที่ A กางขาดินสอไปที่ B', hint: 'รัศมีวงเวียนต้องเท่ากับ AB', sig: 'cpstep' }),
    Q.mgPick({ q: 'สร้าง PR = AB − CD ขั้นที่สองต้องลอก CD อย่างไร', opts: ['จากจุดปลายของส่วนแรก ย้อนกลับมาทางจุดเริ่มต้น', 'ต่อออกไปข้างหน้า', 'จากจุดเริ่มต้น P', 'ไม่ต้องลอก CD'], right: 'จากจุดปลายของส่วนแรก ย้อนกลับมาทางจุดเริ่มต้น', hint: 'ลบ = ตัดความยาวออก', sig: 'dfstep' }),
    mgTF('การลอกความยาวด้วยวงเวียน ต้องไม่เปลี่ยนรัศมีระหว่างยกวงเวียนไปวาง', true, 'รัศมีคือความยาวที่ลอกมา'), mgTF('ถ้า AB = 5 ซม. และ CD = 2 ซม. แล้ว AB + 2CD = 14 ซม.', false, '5 + 2 × 2 = 9 ซม.')]),
  LM2(4, 'สะพานจุดกึ่งกลาง', 'การแบ่งครึ่งส่วนของเส้นตรง', 'จุดกึ่งกลาง', 'บอกความหมายของจุดกึ่งกลาง แบ่งครึ่งส่วนของเส้นตรงด้วยวงเวียน สร้างเส้นตั้งฉากแบ่งครึ่ง และใช้สมบัติว่าจุดบนเส้นตั้งฉากแบ่งครึ่งอยู่ห่างจากปลายทั้งสองเท่ากัน', [
    T('<b>จุดกึ่งกลาง</b> — แตะการ์ดดูทีละใบ', 'จุดกึ่งกลาง แตะการ์ดดูทีละใบ', el => el.append(h('div', { class: 'colstack' }, h('div', { class: 'mg-figbox', html: mgFig({ pts: { A: [0, 0], M: [2.5, 0], B: [5, 0] }, segs: [['A', 'B']], ticks: [['A', 'M', 1], ['M', 'B', 1]] }, { max: 300 }) }), mgCards([['จุดกึ่งกลาง', '<b>แบ่ง AB เป็น 2 ส่วนยาวเท่ากัน</b><small>AM = MB</small>'], ['เส้นตั้งฉากแบ่งครึ่ง', '<b>ผ่านจุดกึ่งกลาง และตั้งฉากกับ AB</b>'], ['รัศมีที่ใช้', '<b>ยาวกว่าครึ่งของ AB</b><small>ส่วนโค้งจึงตัดกันสองจุด</small>']], 'mg-cards')))),
    T('ตัวอย่างทีละขั้น: <b>แบ่งครึ่ง AB</b> (เส้นตั้งฉากแบ่งครึ่ง)', 'ตัวอย่างทีละขั้น แบ่งครึ่งเอบี', mgDemo(mgT.bisSeg(7))),
    T('<b>สมบัติ</b>: จุดบนเส้นตั้งฉากแบ่งครึ่ง — ลากจุด P ดู', 'สมบัติของจุดบนเส้นตั้งฉากแบ่งครึ่ง ลากจุดพีดู', el => el.append(mgEquiSim('seg'))),
    T('<b>ลองสร้างเอง</b>: แบ่ง AB เป็น 4 ส่วนเท่ากัน — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง แบ่งเอบีเป็นสี่ส่วนเท่ากัน', mgTry(mgT.quartSeg(9.6)))
  ], () => [Q.mgBuild(mgT.bisSeg(mgPick([5.6, 6.6, 7.4])), 'แบ่งครึ่ง AB ด้วยวงเวียนและสันตรง'), Q.mgBuild(mgT.quartSeg(mgPick([8.8, 10])), 'แบ่ง AB เป็น 4 ส่วนเท่ากัน'),
    mgTraceQ('bisSeg', 'การแบ่งครึ่งส่วนของเส้นตรง'), mgHalfQ(mgPick([9, 11, 13])), mgHalfQ(mgPick([7.4, 8.6])),
    Q.mgNum({ q: 'แบ่ง AB ที่ยาว 12 ซม. ออกเป็น 4 ส่วนเท่ากัน แต่ละส่วนยาวกี่ ซม.', a: 3, unit: 'ซม.', hint: 'แบ่งครึ่งได้ 6 แล้วแบ่งครึ่งอีกได้ 3', sig: 'quart' }),
    mgPbQ(mgPick([4.5, 5.5, 6])),
    Q.mgPick({ q: 'การแบ่งครึ่ง AB ต้องกางวงเวียนอย่างไร', opts: ['ยาวกว่าครึ่งหนึ่งของ AB', 'สั้นกว่าครึ่งหนึ่งของ AB', 'ยาวเท่าครึ่งหนึ่งของ AB พอดี'], right: 'ยาวกว่าครึ่งหนึ่งของ AB', hint: 'ถ้าสั้นกว่าหรือเท่ากับครึ่ง ส่วนโค้งจากสองปลายจะไม่ตัดกันสองจุด', sig: 'bisr' }),
    Q.mgPick({ q: 'เส้นที่ได้จากการแบ่งครึ่ง AB ทำมุมกับ AB กี่องศา', opts: ['90°', '45°', '60°', '180°'], right: '90°', hint: 'เส้นแบ่งครึ่งที่ได้ตั้งฉากกับ AB', sig: 'bisa' }),
    mgTF('ส่วนของเส้นตรงหนึ่งเส้นมีจุดกึ่งกลางได้เพียงจุดเดียว', true, 'จุดกึ่งกลางมีจุดเดียว'), mgTF('การแบ่งส่วนของเส้นตรงเป็น 8 ส่วนเท่ากัน ทำได้โดยแบ่งครึ่งซ้ำ 3 ครั้ง', true, '2 × 2 × 2 = 8')]),
  LM2(5, 'คุ้งลอกมุม', 'การสร้างมุมและการคัดลอกมุม', 'วัด·สร้าง·ลอกมุม', 'บอกส่วนประกอบของมุม อ่านขนาดของมุม สร้างมุมด้วยโพรแทรกเตอร์ และคัดลอกมุมให้มีขนาดเท่ากับมุมที่กำหนดด้วยวงเวียนและสันตรง', [
    T('ตัวอย่างทีละขั้น: <b>สร้างมุม 50° ด้วยโพรแทรกเตอร์</b>', 'ตัวอย่างทีละขั้น สร้างมุมห้าสิบองศาด้วยโพรแทรกเตอร์', mgDemo(mgT.protAng(50))),
    T('ตัวอย่างทีละขั้น: <b>ลอกมุม</b> สร้าง ∠XOY ให้เท่ากับ ∠ABC', 'ตัวอย่างทีละขั้น ลอกมุม', mgDemo(mgT.copyAng(50))),
    T('<b>ลองสร้างเอง</b>: ลอกมุม — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง ลอกมุม', mgTry(mgT.copyAng(70)))
  ], () => [mgPartQ('v'), mgPartQ('a'), Q.mgMeasure({ deg: mgPick([40, 60, 75]), rot: mgPick([0, 15]) }), Q.mgMeasure({ deg: mgPick([105, 130, 150]), rot: mgPick([0, 10]), name: 'XYZ' }),
    Q.mgBuild(mgT.protAng(mgPick([40, 75, 80, 105, 130])), 'ใช้โพรแทรกเตอร์สร้างมุมตามที่กำหนด'), Q.mgBuild(mgT.copyAng(mgPick([40, 55, 65])), 'สร้างมุมให้เท่ากับ ∠ABC'),
    Q.mgPick({ q: 'การลอกมุม ต้องใช้ระยะใดเป็นรัศมีครั้งที่สอง', opts: ['ระยะระหว่างจุดตัดสองจุดบนแขนของมุมเดิม', 'ความยาวแขนของมุม', 'ระยะจากจุดยอดถึงจุดตัด', 'รัศมีเท่าใดก็ได้'], right: 'ระยะระหว่างจุดตัดสองจุดบนแขนของมุมเดิม', hint: 'ระยะนี้บอกว่ามุมกางมากแค่ไหน', sig: 'cpang' }),
    Q.mgPick({ q: 'การวัดมุมด้วยโพรแทรกเตอร์ ต้องวางจุดศูนย์กลางไว้ที่ใด', opts: ['จุดยอดของมุม', 'ปลายแขนของมุม', 'กึ่งกลางแขนของมุม', 'ที่ใดก็ได้'], right: 'จุดยอดของมุม', hint: 'แล้วให้เส้น 0° ทับแขนข้างหนึ่ง', sig: 'protc' }),
    Q.mgPick({ q: 'ความยาวแขนของมุมมีผลต่อขนาดของมุมหรือไม่', opts: ['ไม่มีผล ขนาดมุมขึ้นกับการกางของแขน', 'แขนยาว มุมใหญ่', 'แขนสั้น มุมใหญ่', 'แขนยาวเท่ากันเท่านั้นจึงวัดได้'], right: 'ไม่มีผล ขนาดมุมขึ้นกับการกางของแขน', hint: 'แขนของมุมเป็นรังสี ยาวไม่สิ้นสุดอยู่แล้ว', sig: 'armlen' }),
    mgTF('ลอกมุมแล้ว มุมใหม่มีขนาดเท่ากับมุมเดิม แม้แขนจะยาวไม่เท่ากัน', true, ''), mgTF('การลอกมุมด้วยวงเวียน ต้องใช้โพรแทรกเตอร์วัดก่อน', false, 'ลอกด้วยวงเวียนและสันตรงได้โดยไม่ต้องวัด')]),
  LM2(6, 'ท่าแบ่งครึ่งมุม', 'การแบ่งครึ่งมุม', 'แบ่งครึ่งมุม', 'บอกความหมายของเส้นแบ่งครึ่งมุม สร้างเส้นแบ่งครึ่งมุมด้วยวงเวียน หาขนาดมุมหลังแบ่งครึ่ง และใช้สมบัติว่าจุดบนเส้นแบ่งครึ่งมุมอยู่ห่างจากแขนทั้งสองเท่ากัน', [
    T('ตัวอย่างทีละขั้น: <b>แบ่งครึ่งมุม</b>', 'ตัวอย่างทีละขั้น แบ่งครึ่งมุม', mgDemo(mgT.bisAng(76))),
    T('<b>สมบัติ</b>: จุดบนเส้นแบ่งครึ่งมุม — ลากจุด P ดู', 'สมบัติของจุดบนเส้นแบ่งครึ่งมุม ลากจุดพีดู', el => el.append(mgEquiSim('ang'))),
    T('<b>ลองสร้างเอง</b>: แบ่งครึ่ง ∠AOB — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง แบ่งครึ่งมุมเอโอบี', mgTry(mgT.bisAng(104)))
  ], () => [Q.mgBuild(mgT.bisAng(mgPick([64, 88, 120])), 'แบ่งครึ่งมุมด้วยวงเวียนและสันตรง'), Q.mgBuild(mgT.bisAng(mgPick([50, 140])), 'แบ่งครึ่งมุมด้วยวงเวียนและสันตรง'),
    mgTraceQ('bisAng', 'การแบ่งครึ่งมุม'), mgBisNumQ(mgPick([64, 86])), mgBisNumQ(mgPick([110, 136])), mgBisNumQ(mgPick([75, 95])),
    mgBisRevQ(mgPick([28, 37, 46])),
    Q.mgNum({ q: 'แบ่งครึ่ง ∠AOB ซึ่งมีขนาด 120° แล้วแบ่งครึ่งมุมที่ได้อีกครั้ง จะได้มุมขนาดกี่องศา', a: 30, unit: 'องศา', hint: '120 ÷ 2 ÷ 2', sig: 'bis2' }),
    Q.mgNum({ q: 'จุด P อยู่บนเส้นแบ่งครึ่ง ∠AOB และห่างจากแขน OA 3 ซม. P ห่างจากแขน OB กี่ ซม.', a: 3, unit: 'ซม.', hint: 'จุดบนเส้นแบ่งครึ่งมุมห่างจากแขนทั้งสองเท่ากัน', sig: 'bisprop' }),
    Q.mgPick({ q: 'ขั้นแรกของการแบ่งครึ่ง ∠AOB คือข้อใด', opts: ['วางเข็มวงเวียนที่จุดยอด O เขียนส่วนโค้งตัดแขนมุมทั้งสอง', 'ลากเส้นจาก A ไป B', 'วางโพรแทรกเตอร์วัดมุม', 'วางเข็มวงเวียนที่ A แล้วเขียนวงกลม'], right: 'วางเข็มวงเวียนที่จุดยอด O เขียนส่วนโค้งตัดแขนมุมทั้งสอง', hint: 'เริ่มที่จุดยอดของมุมเสมอ', sig: 'bisstep' }),
    mgTF('เส้นแบ่งครึ่งมุมแบ่งมุมออกเป็นสองมุมที่มีขนาดเท่ากัน', true, ''), mgTF('ถ้ามุมเดิมมีขนาด 90° แบ่งครึ่งแล้วได้มุม 40°', false, '90 ÷ 2 = 45°')]),
  LM2(7, 'แก่งมุมพิเศษ', 'การสร้างมุมขนาดต่าง ๆ', 'มุม 30° 45° 60°…', 'สร้างมุม 60° 90° 120° และมุมที่ได้จากการแบ่งครึ่งหรือนำมุมมารวมกัน เช่น 30° 45° 135° 150° ด้วยวงเวียนและสันตรง', [
    T('มุมที่สร้างได้ด้วย<b>วงเวียนและสันตรง</b> — แตะการ์ดดูว่าได้มาอย่างไร', 'มุมที่สร้างได้ด้วยวงเวียนและสันตรง แตะการ์ดดูว่าได้มาอย่างไร', el => el.append(miCards([['60°', '<b>รูปสามเหลี่ยมด้านเท่า</b><small>รัศมีเดิมตัดกัน</small>'], ['90°', '<b>เส้นตั้งฉาก</b><small>แบ่งครึ่งมุมตรง 180°</small>'], ['30°', '<b>แบ่งครึ่ง 60°</b>'], ['45°', '<b>แบ่งครึ่ง 90°</b>'], ['120°', '<b>60° + 60°</b><small>หรือ 180° − 60°</small>'], ['135°', '<b>90° + 45°</b>'], ['150°', '<b>180° − 30°</b>'], ['รวมมุม', '<b>ลอกมุมต่อกัน</b><small>เช่น 60° + 45° = 105°</small>']]))),
    T('ตัวอย่างทีละขั้น: <b>สร้างมุม 60°</b>', 'ตัวอย่างทีละขั้น สร้างมุมหกสิบองศา', mgDemo(mgT.angle(60))),
    T('ตัวอย่างทีละขั้น: <b>สร้างมุม 45°</b> (สร้าง 90° แล้วแบ่งครึ่ง)', 'ตัวอย่างทีละขั้น สร้างมุมสี่สิบห้าองศา', mgDemo(mgT.angle(45))),
    T('ตัวอย่างทีละขั้น: <b>นำมุมมารวมกัน</b> ∠ABC + ∠DEF', 'ตัวอย่างทีละขั้น นำมุมมารวมกัน', mgDemo(mgT.sumAng(40, 35))),
    T('<b>ลองสร้างเอง</b>: สร้างมุม 30° — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง สร้างมุมสามสิบองศา', mgTry(mgT.angle(30)))
  ], () => [Q.mgBuild(mgT.angle(mgPick([60, 90, 120])), 'สร้างมุมด้วยวงเวียนและสันตรง'), Q.mgBuild(mgT.angle(mgPick([45, 135, 150])), 'สร้างมุมด้วยวงเวียนและสันตรง (ใช้การแบ่งครึ่ง)'), Q.mgBuild(mgT.sumAng(mgPick([35, 45]), mgPick([30, 40])), 'สร้างมุมที่เป็นผลบวกของมุมสองมุม'),
    mgTraceQ('angle60', 'การสร้างมุม 60°'),
    Q.mgPick({ q: 'มุมขนาดใดสร้างด้วยวงเวียนและสันตรง<b>ไม่ได้</b>', opts: ['40°', '15°', '105°', '135°'], right: '40°', hint: 'มุมที่สร้างได้มาจาก 60° 90° 180° และการแบ่งครึ่ง/บวก/ลบมุมเหล่านี้', sig: 'cant' }),
    Q.mgPick({ q: 'การสร้างมุม 75° ทำได้โดยข้อใด', opts: ['สร้างมุม 60° แล้วต่อด้วยมุม 15°', 'แบ่งครึ่งมุม 120°', 'สร้างมุม 90° แล้วต่อด้วยมุม 15°', 'แบ่งครึ่งมุม 180°'], right: 'สร้างมุม 60° แล้วต่อด้วยมุม 15°', hint: '60 + 15 = 75', sig: 'a75' }),
    Q.mgPick({ q: 'การสร้างมุม 150° ข้อใดถูกต้อง', opts: ['สร้างมุม 30° แล้วใช้มุมประชิดบนเส้นตรง (180° − 30°)', 'แบ่งครึ่งมุม 120°', 'สร้างมุม 60° สองครั้ง', 'สร้างมุม 90° แล้วต่อด้วยมุม 45°'], right: 'สร้างมุม 30° แล้วใช้มุมประชิดบนเส้นตรง (180° − 30°)', hint: '180 − 30 = 150', sig: 'a150' }),
    Q.mgNum({ q: 'แบ่งครึ่งมุมฉาก แล้วแบ่งครึ่งมุมที่ได้อีกครั้ง จะได้มุมขนาดกี่องศา', a: 22.5, unit: 'องศา', hint: '90 ÷ 2 ÷ 2', sig: 'a225' }), Q.mgNum({ q: 'สร้างมุม 60° แล้วต่อด้วยมุม 45° ที่จุดยอดเดียวกัน จะได้มุมรวมขนาดกี่องศา', a: 105, unit: 'องศา', hint: '60 + 45', sig: 'a105' }),
    Q.mgNum({ q: '∠ABC = 70° และ ∠DEF = 25° สร้างมุมที่มีขนาดเท่ากับ ∠ABC − ∠DEF จะได้มุมกี่องศา', a: 45, unit: 'องศา', hint: 'ลอก ∠ABC แล้วลอก ∠DEF ย้อนกลับเข้าไปในมุม', sig: 'adiff' }),
    Q.mgPick({ q: 'การสร้างมุม 90° ที่จุด O บนเส้นตรง ใช้การสร้างใด', opts: ['การสร้างเส้นตั้งฉากที่จุดบนเส้นตรง', 'การลอกส่วนของเส้นตรง', 'การสร้างเส้นขนาน', 'การแบ่งครึ่งมุม 60°'], right: 'การสร้างเส้นตั้งฉากที่จุดบนเส้นตรง', hint: 'มุมฉาก = เส้นตั้งฉาก', sig: 'a90' }),
    Q.mgNum({ q: 'แบ่งครึ่งมุม 60° แล้วนำมุมที่ได้ไปต่อกับมุม 60° อีกมุมหนึ่ง จะได้มุมรวมกี่องศา', a: 90, unit: 'องศา', hint: '60 + 30', sig: 'a6030' }),
    mgTF('ในการสร้างมุม 60° ใช้รัศมีเดียวกันตลอด เพราะได้รูปสามเหลี่ยมด้านเท่า', true, ''), mgTF('มุม 120° สร้างได้จากการแบ่งครึ่งมุม 60°', false, 'แบ่งครึ่ง 60° ได้ 30° — 120° คือ 60° + 60°')]),
  LM2(8, 'สะพานตั้งฉาก', 'การสร้างเส้นตั้งฉาก', 'เส้นตั้งฉาก', 'สร้างเส้นตั้งฉากผ่านจุดบนเส้นตรงและจากจุดภายนอกเส้นตรง และบอกได้ว่าระยะห่างระหว่างจุดกับเส้นตรงวัดตามแนวตั้งฉาก', [
    T('ตัวอย่างทีละขั้น: <b>เส้นตั้งฉากที่จุด P บนเส้นตรง</b>', 'ตัวอย่างทีละขั้น เส้นตั้งฉากที่จุดพีบนเส้นตรง', mgDemo(mgT.perpAt())),
    T('ตัวอย่างทีละขั้น: <b>เส้นตั้งฉากจากจุด P ภายนอกเส้นตรง</b>', 'ตัวอย่างทีละขั้น เส้นตั้งฉากจากจุดพีภายนอกเส้นตรง', mgDemo(mgT.perpFrom())),
    T('<b>ระยะห่างระหว่างจุดกับเส้นตรง</b> — เลื่อนจุด Q หาระยะที่สั้นที่สุด', 'ระยะห่างระหว่างจุดกับเส้นตรง เลื่อนจุดคิวหาระยะที่สั้นที่สุด', el => el.append(mgDistSim())),
    T('<b>ลองสร้างเอง</b>: เส้นตั้งฉากจากจุด P มายัง AB — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง สร้างเส้นตั้งฉากจากจุดพีมายังเอบี', mgTry(mgT.perpFrom()))
  ], () => [Q.mgBuild(mgT.perpAt(), 'สร้างเส้นตั้งฉากที่จุด P บนเส้นตรง AB'), Q.mgBuild(mgT.perpFrom(), 'สร้างเส้นตั้งฉากจากจุด P มายัง AB'),
    mgTraceQ('perpAt', 'การสร้างเส้นตั้งฉากที่จุดบนเส้นตรง'), mgTraceQ('perpFrom', 'การสร้างเส้นตั้งฉากจากจุดภายนอก'),
    ...[35, 52, 68].map(d => Q.mgNum({ q: `OC ⊥ AB ที่จุด O ถ้า ∠COD = ${d}° ∠DOB มีขนาดกี่องศา`, fig: (() => { const O = [0, 0], A = [-3.4, 0], B = [3.4, 0], C = [0, 3.2], Dd = mgP(O, 90 - d, 3.3); return mgFig({ pts: { A, O, B, C, D: Dd }, lines: [['A', 'B', .2]], rays: [['O', 'C'], ['O', 'D']], angs: [['O', 'B', 'C', ''], ['O', 'D', 'C', `${d}°`, '#3D8BD9', .9]], off: { O: [-6, 22] } }, { max: 280 }); })(), a: 90 - d, unit: 'องศา', hint: '∠COB = 90° แบ่งเป็น ∠COD กับ ∠DOB', sig: 'perpn ' + d })),
    Q.mgPick({ q: 'PQ ⊥ AB หมายความว่าอย่างไร', opts: ['PQ ตั้งฉากกับ AB (ทำมุม 90°)', 'PQ ขนานกับ AB', 'PQ ยาวเท่ากับ AB', 'PQ แบ่งครึ่ง AB เสมอ'], right: 'PQ ตั้งฉากกับ AB (ทำมุม 90°)', hint: '⊥ อ่านว่า ตั้งฉากกับ', sig: 'perpsym' }),
    Q.mgPick({ q: '<b>ระยะห่าง</b>ระหว่างจุด P กับเส้นตรง AB คือความยาวของส่วนของเส้นตรงใด', opts: ['ส่วนของเส้นตรงจาก P ที่ตั้งฉากกับ AB', 'ส่วนของเส้นตรงจาก P ไปยังจุด A', 'ส่วนของเส้นตรงที่ยาวที่สุดจาก P ถึง AB', 'ส่วนของเส้นตรงจาก P ที่ขนานกับ AB'], right: 'ส่วนของเส้นตรงจาก P ที่ตั้งฉากกับ AB', hint: 'แนวตั้งฉากให้ระยะที่สั้นที่สุด', sig: 'dist' }),
    Q.mgNum({ q: 'จาก P ลากเส้นไปยังเส้นตรง AB ได้ยาว 5 ซม., 4 ซม., 3 ซม. และ 6 ซม. (เส้นหนึ่งตั้งฉากกับ AB) ระยะห่างระหว่าง P กับ AB เท่ากับกี่ ซม.', a: 3, unit: 'ซม.', hint: 'เส้นที่ตั้งฉากสั้นที่สุด', sig: 'distn' }),
    mgTF('ผ่านจุด P บนเส้นตรง AB สร้างเส้นตั้งฉากกับ AB ได้เพียงเส้นเดียว', true, ''), mgTF('มุมที่เกิดจากเส้นตรงสองเส้นที่ตั้งฉากกัน มีขนาด 45°', false, 'ตั้งฉาก = 90°')]),
  LM2(9, 'ทางแยกเส้นตัด', 'ความสัมพันธ์ของเส้นขนานและเส้นตัด', 'มุมแย้ง·สมนัย', 'บอกมุมภายใน มุมภายนอก มุมแย้ง มุมสมนัย และมุมภายในบนข้างเดียวกันของเส้นตัด และใช้สมบัติของมุมเมื่อเส้นตรงสองเส้นขนานกันหาขนาดของมุม', [
    T('<b>เส้นตัด</b>และชื่อของมุม — แตะการ์ดดูทีละใบ', 'เส้นตัดและชื่อของมุม แตะการ์ดดูทีละใบ', el => el.append(h('div', { class: 'mg-qrow' }, h('div', { class: 'mg-figbox mg-tf', html: mgTransFig(60, [['1', '1', '#C9C2DD'], ['2', '2', '#C9C2DD'], ['3', '3', '#C9C2DD'], ['4', '4', '#C9C2DD'], ['5', '5', '#C9C2DD'], ['6', '6', '#C9C2DD'], ['7', '7', '#C9C2DD'], ['8', '8', '#C9C2DD']], 480) }),
      mgCards([['เส้นตัด', '<b>เส้นตรงที่ตัดเส้นตรงสองเส้น</b><small>ในรูปคือ t</small>'], ['มุมภายใน', '<b>∠3 ∠4 ∠5 ∠6</b><small>อยู่ระหว่าง ℓ กับ m</small>'], ['มุมภายนอก', '<b>∠1 ∠2 ∠7 ∠8</b><small>อยู่นอก ℓ กับ m</small>'], ['มุมแย้ง', '<b>∠3 กับ ∠5 · ∠4 กับ ∠6</b><small>มุมภายใน คนละข้างของเส้นตัด</small>'], ['มุมสมนัย', '<b>∠1 กับ ∠5 · ∠2 กับ ∠6 …</b><small>ตำแหน่งเดียวกันที่จุดตัดทั้งสอง</small>']], 'mg-cards')))),
    T('<b>เมื่อ ℓ ∥ m</b> — แตะปุ่มดูคู่มุม แล้วลากเส้นตัด', 'เมื่อเอลขนานกับเอ็ม แตะปุ่มดูคู่มุม แล้วลากเส้นตัด', el => el.append(mgTransSim())),
    T('ตัวอย่างทีละขั้น: <b>หาขนาดของมุมเมื่อเส้นขนานกัน</b>', 'ตัวอย่างทีละขั้น หาขนาดของมุมเมื่อเส้นขนานกัน', el => el.append(dcWalk(mgTransFig(62, [['1', '62°', '#3D8BD9'], ['6', 'y', '#E5487A'], ['5', 'x', '#F0A020']]),
      [['① มุมสมนัย', '∠1 กับ ∠5 เป็นมุมสมนัย → x = 62°'], ['② มุมบนเส้นตรง', '∠5 + ∠6 = 180° (มุมตรง) → y = 180° − 62° = 118°'], ['③ ตรวจด้วยมุมภายในข้างเดียวกัน', '∠4 = 118° (คู่กับ ∠1 บนเส้นตรง) และ ∠4 + ∠5 = 118° + 62° = 180° ✓']], '<b>x = 62° และ y = 118°</b>')))
  ], () => [mgPairQ('corr'), mgPairQ('alt'), mgPairQ('co'), mgPairQ('vert'), mgPairNumQ('corr'), mgPairNumQ('alt'), mgPairNumQ('co'), mgParAngQ(mgPick([50, 55, 62])),
    Q.mgPick({ q: 'มุมคู่ใดที่<b>รวมกันได้ 180°</b> เมื่อ ℓ ∥ m', opts: ['มุมภายในบนข้างเดียวกันของเส้นตัด', 'มุมแย้ง', 'มุมสมนัย', 'มุมตรงข้าม'], right: 'มุมภายในบนข้างเดียวกันของเส้นตัด', hint: 'มุมแย้งและสมนัยมีขนาดเท่ากัน', sig: 'sum180' }),
    Q.mgPick({ q: 'เส้นตรงสองเส้นมีเส้นตัด ทำให้มุมแย้งคู่หนึ่งเป็น 72° และ 72° สรุปได้ว่าอย่างไร', opts: ['เส้นตรงสองเส้นนั้นขนานกัน', 'เส้นตรงสองเส้นนั้นตั้งฉากกัน', 'สรุปอะไรไม่ได้', 'เส้นตัดตั้งฉากกับเส้นทั้งสอง'], right: 'เส้นตรงสองเส้นนั้นขนานกัน', hint: 'ถ้ามุมแย้งเท่ากัน เส้นตรงคู่นั้นขนานกัน', sig: 'conv' }),
    mgTF('มุมภายในอยู่ระหว่างเส้นตรงสองเส้นที่ถูกตัด', true, ''), mgTF('เมื่อ ℓ ∥ m มุมสมนัยรวมกันได้ 180° เสมอ', false, 'มุมสมนัยมีขนาดเท่ากัน')]),
  LM2(10, 'ทางน้ำคู่ขนาน', 'การสร้างเส้นขนาน', 'สร้างเส้นขนาน', 'สร้างเส้นตรงผ่านจุดที่กำหนดให้ขนานกับเส้นตรงที่กำหนด ด้วยการสร้างมุมที่เท่ากัน และด้วยเส้นตั้งฉากสองครั้ง และแก้โจทย์ประยุกต์', [
    T('ตัวอย่างทีละขั้น: <b>เส้นผ่าน P ขนานกับ AB</b> (สร้างมุมที่เท่ากัน)', 'ตัวอย่างทีละขั้น เส้นผ่านพีขนานกับเอบี สร้างมุมที่เท่ากัน', mgDemo(mgT.parallel())),
    T('ตัวอย่างทีละขั้น: <b>เส้นขนานโดยใช้เส้นตั้งฉาก</b>', 'ตัวอย่างทีละขั้น เส้นขนานโดยใช้เส้นตั้งฉาก', mgDemo(mgT.parPerp())),
    T('<b>ลองสร้างเอง</b>: เส้นผ่าน P ขนานกับ AB — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง เส้นผ่านพีขนานกับเอบี', mgTry(mgT.parallel()))
  ], () => [Q.mgBuild(mgT.parallel(), 'สร้างเส้นผ่าน P ให้ขนานกับ AB'), Q.mgBuild(mgT.parPerp(), 'สร้างเส้นผ่าน P ให้ขนานกับ AB โดยใช้เส้นตั้งฉาก'), mgTraceQ('parallel', 'การสร้างเส้นขนาน'),
    Q.mgPick({ q: 'การสร้างเส้นขนานผ่านจุด P โดยวิธีลอกมุม อาศัยสมบัติใด', opts: ['ถ้ามุมสมนัย (หรือมุมแย้ง) เท่ากัน เส้นตรงสองเส้นขนานกัน', 'ถ้าเส้นตรงยาวเท่ากัน จะขนานกัน', 'ถ้ามุมรวมกัน 90° จะขนานกัน', 'จุดกึ่งกลางของส่วนของเส้นตรง'], right: 'ถ้ามุมสมนัย (หรือมุมแย้ง) เท่ากัน เส้นตรงสองเส้นขนานกัน', hint: 'ลอกมุมที่เส้นตัดทำกับ AB ไปไว้ที่ P', sig: 'pprop' }),
    Q.mgPick({ q: 'ถ้าเส้นตรง ℓ และ m ต่างก็ตั้งฉากกับเส้นตรง n แล้ว ℓ กับ m เป็นอย่างไร', opts: ['ขนานกัน', 'ตั้งฉากกัน', 'ตัดกันเป็นมุม 45°', 'สรุปไม่ได้'], right: 'ขนานกัน', hint: 'มุมสมนัยเป็น 90° เท่ากัน', sig: 'pperp' }),
    Q.mgPick({ q: 'ต้องการสร้างถนน CD ให้ขนานกับคลอง AB และห่างกัน 3 ซม. ควรทำอย่างไร', opts: ['สร้างเส้นตั้งฉากกับ AB วัดไป 3 ซม. แล้วสร้างเส้นตั้งฉากอีกครั้ง', 'ลากเส้นใดก็ได้ที่ห่าง 3 ซม. ด้วยสายตา', 'แบ่งครึ่ง AB แล้วลากเส้น', 'สร้างมุม 60° ที่ปลาย AB'], right: 'สร้างเส้นตั้งฉากกับ AB วัดไป 3 ซม. แล้วสร้างเส้นตั้งฉากอีกครั้ง', hint: 'ระยะห่างระหว่างเส้นขนานวัดตามแนวตั้งฉาก', sig: 'pdist' }),
    mgPairNumQ('corr'), mgPairNumQ('co'),
    Q.mgNum({ q: 'ℓ ∥ m มีเส้นตัดทำให้เกิดมุมภายในบนข้างเดียวกันของเส้นตัดคู่หนึ่ง ถ้ามุมหนึ่งเป็น 70° อีกมุมหนึ่งกี่องศา', a: 110, unit: 'องศา', hint: 'รวมกันได้ 180°', sig: 'co70' }),
    mgTF('ผ่านจุด P ที่อยู่นอกเส้นตรง ℓ มีเส้นตรงที่ขนานกับ ℓ ได้เพียงเส้นเดียว', true, ''), mgTF('เส้นตรงสองเส้นที่ขนานกันจะตัดกันเมื่อลากต่อไปยาว ๆ', false, 'เส้นขนานไม่ตัดกันเลย'), mgTF('ระยะห่างระหว่างเส้นขนานคู่หนึ่งเท่ากันทุกตำแหน่ง', true, '')]),
  LM2(11, 'เกาะสามเหลี่ยม', 'การสำรวจและสร้างรูปสามเหลี่ยม', 'สามเหลี่ยม', 'จำแนกรูปสามเหลี่ยมตามด้านและมุม รู้ว่ามุมภายในรวมกัน 180° และความยาวสามด้านต้องสอดคล้องกับเงื่อนไข สร้างรูปสามเหลี่ยมเมื่อกำหนดด้านสามด้าน หรือด้านกับมุม และสร้างส่วนสูง', [
    T('<b>ชนิดของรูปสามเหลี่ยม</b> — แตะการ์ดดูทีละใบ', 'ชนิดของรูปสามเหลี่ยม แตะการ์ดดูทีละใบ', el => el.append(mgCards([['ด้านเท่า', '<b>ด้านยาวเท่ากัน 3 ด้าน</b><small>มุมละ 60°</small>'], ['หน้าจั่ว', '<b>ด้านยาวเท่ากัน 2 ด้าน</b><small>มุมที่ฐานเท่ากัน</small>'], ['ด้านไม่เท่า', '<b>ด้านยาวไม่เท่ากันเลย</b>'], ['มุมแหลม', '<b>ทุกมุมเล็กกว่า 90°</b>'], ['มุมฉาก', '<b>มีมุมหนึ่งเป็น 90°</b>'], ['มุมป้าน', '<b>มีมุมหนึ่งใหญ่กว่า 90°</b>']], 'mg-cards'))),
    T('<b>ความยาวสามด้าน</b> ประกอบเป็นรูปสามเหลี่ยมได้เสมอไหม — ลองทุกชุด', 'ความยาวสามด้านประกอบเป็นรูปสามเหลี่ยมได้เสมอไหม ลองทุกชุด', el => el.append(mgIneqSim([[4, 5, 7], [2, 3, 6], [3, 4, 7], [5, 5, 5]]))),
    T('<b>มุมภายใน</b>ของรูปสามเหลี่ยมรวมกันได้เท่าไร — ลากจุดยอดดู', 'มุมภายในของรูปสามเหลี่ยมรวมกันได้เท่าไร ลากจุดยอดดู', el => el.append(mgSumSim())),
    T('ตัวอย่างทีละขั้น: <b>กำหนดด้านสามด้าน</b>', 'ตัวอย่างทีละขั้น กำหนดด้านสามด้าน', mgDemo(mgT.tri('sss', { c: 6, b: 4, a: 5 }))),
    T('<b>ลองสร้างเอง</b>: กำหนดด้านสองด้านและมุมในระหว่าง — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง กำหนดด้านสองด้านและมุมในระหว่าง', mgTry(mgT.tri('sas', { c: 6, b: 4, A: 50 }))),
    T('ตัวอย่างทีละขั้น: <b>สร้างส่วนสูง</b>ของรูปสามเหลี่ยม', 'ตัวอย่างทีละขั้น สร้างส่วนสูงของรูปสามเหลี่ยม', mgDemo(mgT.altitude()))
  ], () => [mgTriSideQ(), mgTriSideQ(), mgTriAngQ(), mgTriAngQ(), mgIneqQ(), mgRangeQ(mgPick([4, 5]), mgPick([7, 9])), mgThirdQ(mgPick([35, 45]), mgPick([80, 75])), mgThirdQ(90, mgPick([35, 48])), mgExtQ(mgPick([40, 45]), mgPick([65, 70])),
    Q.mgBuild(mgT.tri('sss', mgPick([{ c: 7, b: 5, a: 4 }, { c: 6.5, b: 4.5, a: 5.5 }])), 'สร้างรูปสามเหลี่ยมจากด้านสามด้าน'), Q.mgBuild(mgT.tri('asa', mgPick([{ c: 6, A: 50, B: 60 }, { c: 7, A: 40, B: 70 }])), 'สร้างรูปสามเหลี่ยมจากมุม ด้าน มุม'), Q.mgBuild(mgT.altitude(), 'สร้างส่วนสูงของรูปสามเหลี่ยม'),
    Q.mgPick({ q: 'กำหนด AB = 6 ซม. AC = 4 ซม. BC = 11 ซม. สร้างรูปสามเหลี่ยม ABC ได้หรือไม่', opts: ['ไม่ได้ เพราะ 6 + 4 น้อยกว่า 11', 'ได้ เป็นรูปสามเหลี่ยมมุมป้าน', 'ได้ เป็นรูปสามเหลี่ยมมุมฉาก', 'ได้ หลายรูป'], right: 'ไม่ได้ เพราะ 6 + 4 น้อยกว่า 11', hint: 'ส่วนโค้งจาก A และ B จะไม่ตัดกัน', sig: 'tri11' }),
    mgTF('รูปสามเหลี่ยมหนึ่งรูปมีมุมฉากได้สองมุม', false, 'ถ้ามี 90° สองมุม รวมกันก็ 180° แล้ว มุมที่สามจะเป็น 0° ไม่ได้'), mgTF('กำหนดมุมสามมุม 50°, 60°, 70° สร้างรูปสามเหลี่ยมได้เพียงขนาดเดียว', false, 'รูปมีรูปร่างเดียวกันแต่ขนาดใหญ่หรือเล็กก็ได้')]),
  LM2(12, 'ปากน้ำสี่เหลี่ยม', 'การสร้างรูปสี่เหลี่ยมและโจทย์ประยุกต์', 'สี่เหลี่ยม·ประยุกต์', 'บอกสมบัติของรูปสี่เหลี่ยมชนิดต่าง ๆ สร้างรูปสี่เหลี่ยมผืนผ้า จัตุรัส ด้านขนาน โดยใช้เส้นตั้งฉาก เส้นขนาน และการลอกความยาว และแก้โจทย์ที่ต้องใช้การสร้างหลายขั้นตอน', [
    T('<b>รูปสี่เหลี่ยมชนิดต่าง ๆ</b> — แตะการ์ดดูสมบัติ', 'รูปสี่เหลี่ยมชนิดต่าง ๆ แตะการ์ดดูสมบัติ', el => el.append(mgCards([['ผืนผ้า', '<b>มุมฉาก 4 มุม</b><small>ด้านตรงข้ามยาวเท่ากัน</small>'], ['จัตุรัส', '<b>มุมฉาก 4 มุม ด้านเท่ากันทุกด้าน</b>'], ['ด้านขนาน', '<b>ด้านตรงข้ามขนานและยาวเท่ากัน</b>'], ['ขนมเปียกปูน', '<b>ด้านเท่ากันทุกด้าน</b><small>เส้นทแยงมุมตั้งฉากกัน</small>'], ['รูปว่าว', '<b>ด้านประชิดยาวเท่ากัน 2 คู่</b>'], ['คางหมู', '<b>ด้านขนานกัน 1 คู่</b>']], 'mg-cards'))),
    T('ตัวอย่างทีละขั้น: <b>รูปสี่เหลี่ยมด้านขนาน ABCD</b> AB = 5 ซม. ∠A = 60° AD = 3 ซม.', 'ตัวอย่างทีละขั้น รูปสี่เหลี่ยมด้านขนาน', el => el.append(dcWalk(mgFig({ pts: { A: [0, 0], B: [5, 0], C: [6.5, 2.6], D: [1.5, 2.6] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], angs: [['A', 'B', 'D', '60°']], fill: [[['A', 'B', 'C', 'D'], '#FFD27A']] }, { max: 300 }),
      [['① สร้างฐาน', 'AB = 5 ซม.'], ['② สร้างมุม', '∠A = 60° (วงเวียน: รูปสามเหลี่ยมด้านเท่า)'], ['③ ลอกความยาว', 'AD = 3 ซม. บนแขนของมุม'], ['④ หาจุด C', 'วงเวียนจาก D รัศมี AB และจาก B รัศมี AD ตัดกันที่ C'], ['⑤ ลากเส้น', 'BC และ DC']], '<b>ด้านตรงข้ามยาวเท่ากัน → ได้รูปสี่เหลี่ยมด้านขนาน</b>'))),
    T('<b>ลองสร้างเอง</b>: รูปสี่เหลี่ยมผืนผ้า ABCD ให้ AB = 6 ซม. และ BC = 3.5 ซม. (มุมฉากใช้การสร้างเส้นตั้งฉาก)', 'ลองสร้างเอง รูปสี่เหลี่ยมผืนผ้า', el => el.append(cnsFree(cnsPara(6, 3.5, 90, 'รูปสี่เหลี่ยมผืนผ้า')))),
    T('ตัวอย่างทีละขั้น: <b>รูปหกเหลี่ยมด้านเท่ามุมเท่า</b> (โจทย์หลายขั้นตอน)', 'ตัวอย่างทีละขั้น รูปหกเหลี่ยมด้านเท่ามุมเท่า', mgDemo(mgT.hexagon(3)))
  ], () => [cnsGen.para(), cnsGen.rect(), cnsGen.sq(), cnsGen.rhom(), cnsGen.kite(),
    Q.mgPick({ q: 'การสร้างรูปสี่เหลี่ยมผืนผ้า ต้องใช้การสร้างพื้นฐานใดเพื่อให้ได้มุมฉาก', opts: ['การสร้างเส้นตั้งฉาก', 'การแบ่งครึ่งมุม 60°', 'การสร้างมุม 45°', 'การลอกความยาว'], right: 'การสร้างเส้นตั้งฉาก', hint: 'มุมฉาก = 90°', sig: 'q4rect' }),
    Q.mgPick({ q: 'สร้างรูปสี่เหลี่ยมด้านขนาน ABCD เมื่อมี AB และ AD แล้ว หาจุด C อย่างไร', opts: ['วงเวียนจาก B รัศมี AD และจาก D รัศมี AB ตัดกัน', 'แบ่งครึ่ง AB', 'สร้างมุม 90° ที่ B', 'ลาก BD แล้วแบ่งครึ่ง'], right: 'วงเวียนจาก B รัศมี AD และจาก D รัศมี AB ตัดกัน', hint: 'ด้านตรงข้ามยาวเท่ากัน: BC = AD และ DC = AB', sig: 'q4para' }),
    Q.mgNum({ q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มี ∠A = 65° ∠B มีขนาดกี่องศา', fig: mgFig({ pts: { A: [0, 0], B: [5, 0], C: [6.27, 2.72], D: [1.27, 2.72] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], angs: [['A', 'B', 'D', '65°'], ['B', 'C', 'A', '?']] }, { max: 300 }), a: 115, unit: 'องศา', hint: 'AD ∥ BC จึงเป็นมุมภายในบนข้างเดียวกันของเส้นตัด รวมกัน 180°', sig: 'q4ang' }),
    Q.mgNum({ q: 'สร้างรูปหกเหลี่ยมด้านเท่ามุมเท่าในวงกลมรัศมี 4 ซม. ด้านแต่ละด้านยาวกี่ ซม.', a: 4, unit: 'ซม.', hint: 'ก้าววงเวียนด้วยรัศมีเดิมรอบวงกลม', sig: 'hex' }),
    Q.mgNum({ q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มี AB = 7 ซม. และ AD = 4 ซม. ความยาวรอบรูปเท่าใด', a: 22, unit: 'ซม.', hint: '2 × (7 + 4)', sig: 'q4per' }),
    Q.mgPick({ q: 'สร้างรูปสี่เหลี่ยมจัตุรัสที่มีเส้นทแยงมุมยาว 6 ซม. ต้องใช้สมบัติใดของเส้นทแยงมุม', opts: ['ยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน และตั้งฉากกัน', 'ยาวไม่เท่ากัน', 'ขนานกัน', 'ไม่ตัดกัน'], right: 'ยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน และตั้งฉากกัน', hint: 'เส้นทแยงมุมของจัตุรัสตัดกันเป็นมุมฉากที่จุดกึ่งกลาง', sig: 'q4diag' }),
    Q.mgPick({ q: 'รูปสี่เหลี่ยมขนมเปียกปูน ABCD ที่ AB = 4 ซม. ด้าน BC ยาวกี่ ซม.', opts: ['4 ซม.', '8 ซม.', '2 ซม.', 'บอกไม่ได้'], right: '4 ซม.', hint: 'ขนมเปียกปูนมีด้านยาวเท่ากันทุกด้าน', sig: 'q4rh' }),
    Q.mgNum({ q: 'รูปว่าว ABCD มี ∠A = 100° ∠C = 60° และ ∠B = ∠D มุม B มีขนาดกี่องศา', a: 100, unit: 'องศา', hint: 'มุมภายในของรูปสี่เหลี่ยมรวมกัน 360° → (360 − 100 − 60) ÷ 2', sig: 'q4kite' }),
    Q.mgPick({ q: 'รูปสี่เหลี่ยมผืนผ้า ABCD มี AB = 6 ซม. และ BC = 3.5 ซม. ด้าน CD ยาวเท่าใด', opts: ['6 ซม.', '3.5 ซม.', '9.5 ซม.', '12 ซม.'], right: '6 ซม.', hint: 'ด้านตรงข้ามของรูปสี่เหลี่ยมผืนผ้ายาวเท่ากัน', sig: 'q4cd' }),
    mgTF('รูปสี่เหลี่ยมจัตุรัสสร้างได้จากการสร้างเส้นตั้งฉากและการลอกความยาว', true, ''), mgTF('กำหนดความยาวด้านทั้งสี่ด้านอย่างเดียว ก็สร้างรูปสี่เหลี่ยมได้เพียงแบบเดียว', false, 'มุมเปลี่ยนได้ รูปจึงบิดได้หลายแบบ')])
];
LESSONS_M1C2.find(L => L.id === 2201).pracQ = () => mgKindQ('ray', 'KL');
LESSONS_M1C2.find(L => L.id === 2211).pracQ = () => mgThirdQ(50, 60);

/* ---------- บอส: 20 ข้อ (แต่งใหม่ทั้งหมด) ---------- */
const mgXF = s => ({ html: s });
const EXAM_M1C2 = xrot([
  { q: 'ข้อใดกล่าว<b>ไม่ถูกต้อง</b>', opts: ['รังสีมีจุดปลายสองจุด', 'ส่วนของเส้นตรงมีจุดปลายสองจุด', 'เส้นตรงยาวไม่สิ้นสุดทั้งสองทาง', 'จุดใช้บอกตำแหน่ง'], a: 0 },
  { q: 'รูปนี้เขียนแทนด้วยสัญลักษณ์ใด' + mgNameFig('ray', 'PQ'), opts: [mgXF(mgSym('ray', 'PQ')), mgXF(mgSym('ray', 'QP')), mgXF(mgSym('seg', 'PQ')), mgXF(mgSym('line', 'PQ'))], a: 0 },
  { q: 'มุมขนาด 205° เป็นมุมชนิดใด', opts: ['มุมกลับ', 'มุมป้าน', 'มุมตรง', 'มุมแหลม'], a: 0 },
  { q: 'ต้องการเขียนส่วนโค้งเพื่อลอกความยาว ใช้เครื่องมือใด', opts: ['วงเวียน', 'โพรแทรกเตอร์', 'ไม้ฉาก', 'ยางลบ'], a: 0 },
  { q: 'จุด C อยู่บนส่วนโค้งที่มีจุดศูนย์กลาง A รัศมี 5 ซม. CA ยาวเท่าใด', opts: ['5 ซม.', '10 ซม.', '2.5 ซม.', 'บอกไม่ได้'], a: 0 },
  { q: 'AB ยาว 6 ซม. และ CD ยาว 2.5 ซม. สร้าง PQ = AB − CD ได้ PQ ยาวเท่าใด', opts: ['3.5 ซม.', '8.5 ซม.', '4 ซม.', '2.5 ซม.'], a: 0 },
  { q: 'การแบ่งครึ่ง AB ที่ยาว 8 ซม. ควรกางวงเวียนยาวเท่าใด', opts: ['5 ซม.', '3 ซม.', '4 ซม.', '2 ซม.'], a: 0 },
  { q: 'P อยู่บนเส้นตั้งฉากแบ่งครึ่ง AB และ PA = 7 ซม. PB ยาวเท่าใด', opts: ['7 ซม.', '3.5 ซม.', '14 ซม.', 'บอกไม่ได้'], a: 0 },
  { q: 'รูปนี้เป็นร่องรอยของการสร้างใด' + MG_TRACE.bisAng(), opts: ['การแบ่งครึ่งมุม', 'การแบ่งครึ่งส่วนของเส้นตรง', 'การสร้างเส้นขนาน', 'การสร้างเส้นตั้งฉากจากจุดภายนอก'], a: 0 },
  { q: 'OC แบ่งครึ่ง ∠AOB ถ้า ∠AOC = 37° แล้ว ∠AOB มีขนาดเท่าใด', opts: ['74°', '37°', '18.5°', '53°'], a: 0 },
  { q: 'มุมในข้อใดสร้างด้วยวงเวียนและสันตรงไม่ได้', opts: ['50°', '75°', '112.5°', '165°'], a: 0 },
  { q: 'การสร้างมุม 135° ทำได้โดยข้อใด', opts: ['สร้างมุมฉาก แล้วต่อด้วยมุม 45°', 'แบ่งครึ่งมุม 270°', 'สร้างมุม 60° สองครั้ง', 'แบ่งครึ่งมุม 90° สองครั้ง'], a: 0 },
  { q: 'ระยะห่างระหว่างจุด P กับเส้นตรง AB วัดอย่างไร', opts: ['วัดตามแนวที่ตั้งฉากกับ AB', 'วัดจาก P ไปจุด A', 'วัดเส้นที่ยาวที่สุดจาก P ถึง AB', 'วัดตามแนวที่ขนานกับ AB'], a: 0 },
  { q: 'ℓ ∥ m มุมที่ระบายสีทั้งสองเป็นมุมคู่ใด' + mgTransFig(60, [['3', '', '#3D8BD9'], ['5', '', '#E5487A']]), opts: ['มุมแย้ง', 'มุมสมนัย', 'มุมภายในบนข้างเดียวกันของเส้นตัด', 'มุมตรงข้าม'], a: 0 },
  { q: 'ℓ ∥ m มีเส้นตัด ถ้ามุมภายในบนข้างเดียวกันของเส้นตัดมุมหนึ่งเป็น 64° อีกมุมหนึ่งมีขนาดเท่าใด', opts: ['116°', '64°', '26°', '126°'], a: 0 },
  { q: 'การสร้างเส้นผ่านจุด P ให้ขนานกับเส้นตรง ℓ ใช้การสร้างใดเป็นหลัก', opts: ['การสร้างมุมให้เท่ากับมุมที่กำหนด', 'การแบ่งครึ่งส่วนของเส้นตรง', 'การสร้างรูปสามเหลี่ยมด้านเท่า', 'การวัดด้วยไม้บรรทัด'], a: 0 },
  { q: 'ความยาวชุดใดเป็นด้านทั้งสามของรูปสามเหลี่ยมได้', opts: ['5 ซม., 6 ซม., 10 ซม.', '3 ซม., 4 ซม., 8 ซม.', '2 ซม., 5 ซม., 7 ซม.', '4 ซม., 4 ซม., 9 ซม.'], a: 0 },
  { q: 'รูปสามเหลี่ยม ABC มี ∠A = 48° และ ∠B = 67° ∠C มีขนาดเท่าใด', opts: ['65°', '115°', '75°', '55°'], a: 0 },
  { q: 'รูปสามเหลี่ยมที่มีด้านยาว 6 ซม., 6 ซม. และ 4 ซม. เป็นรูปสามเหลี่ยมชนิดใด', opts: ['รูปสามเหลี่ยมหน้าจั่ว', 'รูปสามเหลี่ยมด้านเท่า', 'รูปสามเหลี่ยมด้านไม่เท่า', 'รูปสามเหลี่ยมมุมฉากเสมอ'], a: 0 },
  { q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มี ∠A = 72° ∠B มีขนาดเท่าใด', opts: ['108°', '72°', '18°', '288°'], a: 0 }
], 4);
LESSONS_M1C2.push({ id: 2219, boss: true, place: 'วังจระเข้เรขา', title: 'ด่านบอส: ม.1 บทที่ 2 การสร้างทางเรขาคณิต', short: 'ด่านบอส · ข้อสอบ', tone: 'jade',
  goal: 'ตอบคำถามเรื่องเรขาคณิตพื้นฐานและการสร้างทางเรขาคณิต 20 ข้อ ตอบถูก 16 ข้อขึ้นไปเพื่อชนะจระเข้เรขา',
  exam: EXAM_M1C2, pass: 16, bossName: 'จระเข้เรขา', bossPal: 'night', emblem: '∠', bossKind: 'croc',
  winLine: 'ชนะจระเข้เรขาแล้ว! ใช้วงเวียน สันตรง และโพรแทรกเตอร์ได้คล่องมาก', loseLine: 'จระเข้เรขายังเฝ้าวังน้ำอยู่ กลับไปฝึกสร้างอีกนิดแล้วมาสู้ใหม่นะ!' });
