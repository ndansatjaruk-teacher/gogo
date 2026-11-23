/* =========================================================
   ม.1 บทที่ 2 การสร้างทางเรขาคณิต (v227) — prefix mg
   กระดาษสร้างรูปจริง: สันตรง/ไม้บรรทัด · วงเวียน · ครึ่งวงกลม (โปรแทรกเตอร์) · แตะจุด
   - mgBoard(T, cb)  กระดาน (ทำเอง / ตัวอย่างทีละขั้นแบบเคลื่อนไหว cb.demo / ดูเฉลย)
       T = { title, given:{pts:{A:[x,y]}, segs:[['A','B']], rays:[['B','A']], lines:[['A','B']]}, tools:[...],
             goal(G) → {ok, why}, sol:[{say, ops:[...]}], marks:[{p,name}], okMsg }
       ops: {t:'seg',a,b} · {t:'arc',c,r,a0,a1} · {t:'pt',p,name} · {t:'prot',c,rot} · {t:'mark',c,rot,deg}   (หน่วย ซม. แกน y ขึ้น)
   - mgFig(spec)  รูปนิ่ง (โจทย์เลือกตอบ / การ์ด)
   - งานสร้าง mgT.* · ข้อ Q.mg* · บทเรียน LESSONS_M1C2 (2101–2109) + บอส 2119
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
  (f.angs || []).forEach(([v, a, b, lab, col, rr]) => { const V = at(v), d0 = mgA(V, at(a)), d1 = mgA(V, at(b)); let lo = d0, sw = mgNrm(d1 - d0); if (sw > 180 && !o.reflex) { lo = d1; sw = 360 - sw; } const r = rr || .65, A = Xp(mgP(V, lo, r)), B = Xp(mgP(V, lo + sw, r)), T = Xp(mgP(V, lo + sw / 2, r + .55));
    s += Math.abs(sw - 90) < .5 && !lab ? `<path d="M${Xp(mgP(V, lo, .45))} L${Xp(mgAdd(mgP(V, lo, .45), mgU(lo + 90), .45))} L${Xp(mgP(V, lo + 90, .45))}" fill="none" stroke="${col || '#C25B00'}" stroke-width="2"/>` : `<path d="M${A} A${r * K} ${r * K} 0 ${sw > 180 ? 1 : 0} 0 ${B}" fill="none" stroke="${col || '#C25B00'}" stroke-width="2.2"/>`;
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
  sumSeg(a = 3.1, b = 2.4) { const A = [1.4, 8], B = [1.4 + a, 8], C = [7.6, 8], Dd = [7.6 + b, 8], P = [1.8, 3], X = [5, 3], Q = mgP(P, 0, a), R = mgP(P, 0, a + b);
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
Q.mgMeasure = ({ deg, rot = 0, name = 'ABC' }) => { const B = [4.4, 1.6], A = mgP(B, rot, 6), C = mgP(B, rot + deg, 5.6), T = { title: `ใช้ครึ่งวงกลมวัด <b>∠${name}</b>`, given: { pts: { [name[0]]: A, [name[1]]: B, [name[2]]: C }, rays: [[name[1], name[0]], [name[1], name[2]]] }, tools: ['prot'], tool0: 'prot', protC: [11, 6.4], start: 'ลากครึ่งวงกลมให้จุดศูนย์กลางอยู่ที่จุดยอด แล้วหมุนให้ 0° ทับแขนมุมข้างหนึ่ง' };
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
   บทเรียน 2101–2109 + บอส 2119
   ========================================================= */
const LM2 = (no, place, title, short, goal, teach, game) => ({ id: 2100 + no, no, place, title, short, tone: TONES5[(no + 3) % 6], goal, teach, game });
const LESSONS_M1C2 = [
  LM2(1, 'ท่าเรือรูปพื้นฐาน', 'รูปเรขาคณิตพื้นฐาน', 'จุด เส้น รังสี มุม', 'บอกและเขียนสัญลักษณ์ของจุด เส้นตรง ส่วนของเส้นตรง รังสี และมุม จำแนกชนิดของมุม และใช้ครึ่งวงกลม (โปรแทรกเตอร์) วัดและสร้างมุม', [
    T('รู้จัก<b>จุด เส้นตรง ส่วนของเส้นตรง รังสี</b> — แตะการ์ดดูทีละใบ', 'รู้จักจุด เส้นตรง ส่วนของเส้นตรง และรังสี แตะการ์ดดูทีละใบ', el => el.append(mgCards([
      [mgKindFig('pt') + '<b>จุด</b>', `<b>จุด A</b><small>ใช้บอกตำแหน่ง ไม่มีขนาด</small>`, 'จุด'], [mgKindFig('line') + '<b>เส้นตรง</b>', `<b>${mgSym('line', 'AB')}</b><small>ยาวไม่สิ้นสุดทั้งสองทาง</small>`, 'เส้นตรง'],
      [mgKindFig('seg') + '<b>ส่วนของเส้นตรง</b>', `<b>${mgSym('seg', 'AB')}</b><small>มีจุดปลาย 2 จุด วัดความยาวได้</small>`, 'ส่วนของเส้นตรง'], [mgKindFig('ray') + '<b>รังสี</b>', `<b>${mgSym('ray', 'AB')}</b><small>มีจุดปลาย 1 จุด (A) ยาวไม่สิ้นสุดทางเดียว</small>`, 'รังสี']], 'mg-cards'))),
    T('<b>ชนิดของมุม</b> — แตะการ์ดดูขนาดของมุมแต่ละชนิด', 'ชนิดของมุม แตะการ์ดดูขนาดของมุมแต่ละชนิด', el => el.append(mgCards([[40, 'มุมแหลม', 'มากกว่า 0° แต่น้อยกว่า 90°'], [90, 'มุมฉาก', 'เท่ากับ 90°'], [130, 'มุมป้าน', 'มากกว่า 90° แต่น้อยกว่า 180°'], [180, 'มุมตรง', 'เท่ากับ 180°'], [250, 'มุมกลับ', 'มากกว่า 180° แต่น้อยกว่า 360°']].map(([d, n, m]) => [mgAngFig(d, { max: 150 }) + `<b>${n}</b>`, `<b>${m}</b>`, n]), 'mg-cards mg-cards5'))),
    T('ตัวอย่างทีละขั้น: <b>วัดมุมด้วยครึ่งวงกลม</b>', 'ตัวอย่างทีละขั้น วัดมุมด้วยครึ่งวงกลม', mgDemo(mgMeasDemo(65, 15))),
    T('ตัวอย่างทีละขั้น: <b>สร้างมุม 50° ด้วยครึ่งวงกลม</b>', 'ตัวอย่างทีละขั้น สร้างมุมห้าสิบองศาด้วยครึ่งวงกลม', mgDemo(mgT.protAng(50))),
    T('<b>ลองสร้างเอง</b>: ใช้ครึ่งวงกลมสร้างมุม 115° — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง ใช้ครึ่งวงกลมสร้างมุมหนึ่งร้อยสิบห้าองศา', mgTry(mgT.protAng(115)))
  ], () => [mgKindQ('seg', 'PQ'), mgKindQ('ray', 'MN'), mgKindQ('line', 'XY'), mgSymQ('seg', 'CD'), mgSymQ('ray', 'EF'), mgSymQ('line', 'GH'), ...[0, 1, 2, 3, 4].map(mgAngKindQ),
    Q.mgMeasure({ deg: mgPick([35, 55, 70]), rot: mgPick([0, 20]) }), Q.mgMeasure({ deg: mgPick([110, 125, 145]), rot: mgPick([0, 10]), name: 'PQR' }),
    Q.mgBuild(mgT.protAng(mgPick([40, 75, 80])), 'ใช้ครึ่งวงกลมสร้างมุมตามที่กำหนด'), Q.mgBuild(mgT.protAng(mgPick([105, 130, 150])), 'ใช้ครึ่งวงกลมสร้างมุมป้านตามที่กำหนด'),
    mgTF('ผ่านจุดสองจุดใด ๆ ลากเส้นตรงได้เพียงเส้นเดียว', true, 'มีเส้นตรงเพียงเส้นเดียวที่ผ่านจุดสองจุด'), mgTF(`${mgSym('ray', 'AB')} กับ ${mgSym('ray', 'BA')} เป็นรังสีเดียวกัน`, false, 'จุดปลายต่างกัน (A กับ B) และไปคนละทาง จึงเป็นคนละรังสี'), mgTF('มุมกลับมีขนาดมากกว่า 90° แต่น้อยกว่า 180°', false, 'นั่นคือมุมป้าน — มุมกลับมากกว่า 180°')]),
  LM2(2, 'ลำธารลอกเส้น', 'การสร้างเกี่ยวกับส่วนของเส้นตรง', 'ลอกเส้น·แบ่งครึ่ง', 'สร้างส่วนของเส้นตรงให้ยาวเท่ากับที่กำหนด สร้างผลบวก/ผลต่างของความยาว และแบ่งครึ่งส่วนของเส้นตรงด้วยวงเวียนและสันตรง', [
    T('ตัวอย่างทีละขั้น: <b>สร้าง CD ให้ยาวเท่ากับ AB</b> (ลอกความยาวด้วยวงเวียน)', 'ตัวอย่างทีละขั้น สร้างซีดีให้ยาวเท่ากับเอบี', mgDemo(mgT.copySeg(4.3))),
    T('ตัวอย่างทีละขั้น: <b>แบ่งครึ่ง AB</b> หาจุดกึ่งกลาง', 'ตัวอย่างทีละขั้น แบ่งครึ่งเอบี หาจุดกึ่งกลาง', mgDemo(mgT.bisSeg(7))),
    T('<b>ลองสร้างเอง</b>: แบ่งครึ่ง AB — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง แบ่งครึ่งเอบี', mgTry(mgT.bisSeg(6.2)))
  ], () => [Q.mgBuild(mgT.copySeg(mgPick([3.6, 4.7, 5.2])), 'ลอกความยาว AB ลงบนรังสี CX'), Q.mgBuild(mgT.bisSeg(mgPick([5.6, 6.6, 7.4])), 'แบ่งครึ่ง AB ด้วยวงเวียนและสันตรง'), Q.mgBuild(mgT.sumSeg(mgPick([2.8, 3.3]), mgPick([2.1, 2.6])), 'สร้างผลบวกของความยาวด้วยวงเวียน'),
    mgTraceQ('bisSeg', 'การแบ่งครึ่งส่วนของเส้นตรง'), mgTraceQ('copySeg', 'การสร้างส่วนของเส้นตรงให้ยาวเท่ากับที่กำหนด'), mgHalfQ(mgPick([9, 11, 13])), mgHalfQ(mgPick([7.4, 8.6]), 'ซม.'),
    Q.mgPick({ q: 'การแบ่งครึ่ง AB ต้องกางวงเวียนอย่างไร', opts: ['ยาวกว่าครึ่งหนึ่งของ AB', 'สั้นกว่าครึ่งหนึ่งของ AB', 'ยาวเท่าครึ่งหนึ่งของ AB พอดี'], right: 'ยาวกว่าครึ่งหนึ่งของ AB', hint: 'ถ้าสั้นกว่าหรือเท่ากับครึ่ง ส่วนโค้งจากสองปลายจะไม่ตัดกันสองจุด' }),
    Q.mgPick({ q: 'เส้นที่ได้จากการแบ่งครึ่ง AB ทำมุมกับ AB กี่องศา', opts: ['90°', '45°', '60°', '180°'], right: '90°', hint: 'เส้นแบ่งครึ่งที่ได้ตั้งฉากกับ AB' }),
    Q.mgNum({ q: 'AB ยาว 7 ซม. และ CD ยาว 3 ซม. ถ้าสร้าง PQ = AB − CD ด้วยวงเวียน PQ ยาวกี่ ซม.', a: 4, unit: 'ซม.', hint: 'ลอก AB แล้วลอก CD ย้อนกลับจากปลาย' }), Q.mgNum({ q: 'AB ยาว 2.5 ซม. ถ้าสร้าง PQ = 3AB (ลอก AB ต่อกัน 3 ครั้ง) PQ ยาวกี่ ซม.', a: 7.5, unit: 'ซม.', hint: '2.5 × 3' }),
    mgTF('ส่วนของเส้นตรงหนึ่งเส้นมีจุดกึ่งกลางได้เพียงจุดเดียว', true, 'จุดกึ่งกลางมีจุดเดียว'), mgTF('การลอกความยาวด้วยวงเวียน ต้องไม่เปลี่ยนรัศมีระหว่างยกวงเวียนไปวาง', true, 'รัศมีคือความยาวที่ลอกมา')]),
  LM2(3, 'คุ้งลอกมุม', 'การสร้างเกี่ยวกับมุม', 'ลอกมุม·แบ่งครึ่งมุม', 'สร้างมุมให้มีขนาดเท่ากับมุมที่กำหนด และแบ่งครึ่งมุมด้วยวงเวียนและสันตรง', [
    T('ตัวอย่างทีละขั้น: <b>สร้างมุมให้เท่ากับมุมที่กำหนด</b> (ลอกมุม)', 'ตัวอย่างทีละขั้น สร้างมุมให้เท่ากับมุมที่กำหนด', mgDemo(mgT.copyAng(50))),
    T('ตัวอย่างทีละขั้น: <b>แบ่งครึ่งมุม</b>', 'ตัวอย่างทีละขั้น แบ่งครึ่งมุม', mgDemo(mgT.bisAng(76))),
    T('<b>ลองสร้างเอง</b>: แบ่งครึ่ง ∠AOB — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง แบ่งครึ่งมุมเอโอบี', mgTry(mgT.bisAng(104)))
  ], () => [Q.mgBuild(mgT.copyAng(mgPick([40, 55, 65])), 'สร้างมุมให้เท่ากับ ∠ABC'), Q.mgBuild(mgT.bisAng(mgPick([64, 88, 120])), 'แบ่งครึ่งมุมด้วยวงเวียนและสันตรง'),
    mgTraceQ('bisAng', 'การแบ่งครึ่งมุม'), mgBisNumQ(mgPick([64, 86])), mgBisNumQ(mgPick([110, 136])), mgBisNumQ(mgPick([75, 95])),
    Q.mgNum({ q: 'แบ่งครึ่ง ∠AOB ซึ่งมีขนาด 120° แล้วแบ่งครึ่งมุมที่ได้อีกครั้ง จะได้มุมขนาดกี่องศา', a: 30, unit: 'องศา', hint: '120 ÷ 2 ÷ 2' }),
    Q.mgPick({ q: 'ขั้นแรกของการแบ่งครึ่ง ∠AOB คือข้อใด', opts: ['วางเข็มวงเวียนที่จุดยอด O เขียนส่วนโค้งตัดแขนมุมทั้งสอง', 'ลากเส้นจาก A ไป B', 'วางครึ่งวงกลมวัดมุม', 'วางเข็มวงเวียนที่ A แล้วเขียนวงกลม'], right: 'วางเข็มวงเวียนที่จุดยอด O เขียนส่วนโค้งตัดแขนมุมทั้งสอง', hint: 'เริ่มที่จุดยอดของมุมเสมอ' }),
    Q.mgPick({ q: 'การลอกมุม ต้องใช้ระยะใดเป็นรัศมีครั้งที่สอง', opts: ['ระยะระหว่างจุดตัดสองจุดบนแขนของมุมเดิม', 'ความยาวแขนของมุม', 'ระยะจากจุดยอดถึงจุดตัด', 'รัศมีเท่าใดก็ได้'], right: 'ระยะระหว่างจุดตัดสองจุดบนแขนของมุมเดิม', hint: 'ระยะนี้บอกว่ามุมกางมากแค่ไหน' }),
    mgTF('เส้นแบ่งครึ่งมุมแบ่งมุมออกเป็นสองมุมที่มีขนาดเท่ากัน', true, ''), mgTF('ถ้ามุมเดิมมีขนาด 90° แบ่งครึ่งแล้วได้มุม 40°', false, '90 ÷ 2 = 45°')]),
  LM2(4, 'สะพานตั้งฉาก', 'การสร้างเส้นตั้งฉาก', 'เส้นตั้งฉาก', 'สร้างเส้นตั้งฉากที่จุดบนเส้นตรง และสร้างเส้นตั้งฉากจากจุดภายนอกมายังเส้นตรง', [
    T('ตัวอย่างทีละขั้น: <b>เส้นตั้งฉากที่จุด P บนเส้นตรง</b>', 'ตัวอย่างทีละขั้น เส้นตั้งฉากที่จุดพีบนเส้นตรง', mgDemo(mgT.perpAt())),
    T('ตัวอย่างทีละขั้น: <b>เส้นตั้งฉากจากจุด P ภายนอกเส้นตรง</b>', 'ตัวอย่างทีละขั้น เส้นตั้งฉากจากจุดพีภายนอกเส้นตรง', mgDemo(mgT.perpFrom())),
    T('<b>ลองสร้างเอง</b>: สร้างเส้นตั้งฉากจากจุด P มายัง AB — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง สร้างเส้นตั้งฉากจากจุดพีมายังเอบี', mgTry(mgT.perpFrom()))
  ], () => [Q.mgBuild(mgT.perpAt(), 'สร้างเส้นตั้งฉากที่จุด P บนเส้นตรง AB'), Q.mgBuild(mgT.perpFrom(), 'สร้างเส้นตั้งฉากจากจุด P มายัง AB'),
    mgTraceQ('perpAt', 'การสร้างเส้นตั้งฉากที่จุดบนเส้นตรง'), mgTraceQ('perpFrom', 'การสร้างเส้นตั้งฉากจากจุดภายนอก'),
    ...[[35], [52], [68]].map(([d]) => Q.mgNum({ q: `OC ⊥ AB ที่จุด O ถ้า ∠COD = ${d}° ∠DOB มีขนาดกี่องศา`, fig: (() => { const O = [0, 0], A = [-3.4, 0], B = [3.4, 0], C = [0, 3.2], Dd = mgP(O, 90 - d, 3.3); return mgFig({ pts: { A, O, B, C, D: Dd }, lines: [['A', 'B', .2]], rays: [['O', 'C'], ['O', 'D']], angs: [['O', 'B', 'C', ''], ['O', 'D', 'C', `${d}°`, '#3D8BD9', .9]], off: { O: [-6, 22] } }, { max: 280 }); })(), a: 90 - d, unit: 'องศา', hint: '∠COB = 90° แบ่งเป็น ∠COD กับ ∠DOB', sig: 'perpn ' + d })),
    Q.mgPick({ q: 'PQ ⊥ AB หมายความว่าอย่างไร', opts: ['PQ ตั้งฉากกับ AB (ทำมุม 90°)', 'PQ ขนานกับ AB', 'PQ ยาวเท่ากับ AB', 'PQ แบ่งครึ่ง AB เสมอ'], right: 'PQ ตั้งฉากกับ AB (ทำมุม 90°)', hint: '⊥ อ่านว่า ตั้งฉากกับ' }),
    Q.mgPick({ q: 'เส้นตั้งฉากจากจุด P ไปยังเส้นตรง AB มีสมบัติใด', opts: ['เป็นระยะที่สั้นที่สุดจาก P ถึง AB', 'ยาวที่สุดจาก P ถึง AB', 'ขนานกับ AB', 'มีได้หลายเส้น'], right: 'เป็นระยะที่สั้นที่สุดจาก P ถึง AB', hint: 'ระยะห่างระหว่างจุดกับเส้นตรงวัดตามแนวตั้งฉาก' }),
    mgTF('การสร้างเส้นตั้งฉาก ต้องเขียนส่วนโค้งสองส่วนที่มีรัศมีเท่ากันจากจุดสองจุดบนเส้นตรง', true, ''), mgTF('มุมที่เกิดจากเส้นตรงสองเส้นที่ตั้งฉากกัน มีขนาด 45°', false, 'ตั้งฉาก = 90°')]),
  LM2(5, 'แก่งมุมพิเศษ', 'การสร้างมุมที่มีขนาดต่าง ๆ', 'มุม 60° 90° 45°', 'สร้างมุมขนาด 60° 120° 90° และมุมที่ได้จากการแบ่งครึ่ง เช่น 30° 45° 135° ด้วยวงเวียนและสันตรง', [
    T('มุมที่สร้างได้ด้วย<b>วงเวียนและสันตรง</b> — แตะการ์ดดูว่าได้มาอย่างไร', 'มุมที่สร้างได้ด้วยวงเวียนและสันตรง แตะการ์ดดูว่าได้มาอย่างไร', el => el.append(miCards([['60°', '<b>รูปสามเหลี่ยมด้านเท่า</b><small>รัศมีเดิมตัดกัน</small>'], ['90°', '<b>เส้นตั้งฉาก</b><small>แบ่งครึ่งมุมตรง 180°</small>'], ['30°', '<b>แบ่งครึ่ง 60°</b>'], ['45°', '<b>แบ่งครึ่ง 90°</b>'], ['120°', '<b>60° + 60°</b><small>หรือ 180° − 60°</small>'], ['135°', '<b>90° + 45°</b>'], ['75°', '<b>60° + 15°</b><small>15° = แบ่งครึ่ง 30°</small>'], ['150°', '<b>180° − 30°</b>']]))),
    T('ตัวอย่างทีละขั้น: <b>สร้างมุม 60°</b>', 'ตัวอย่างทีละขั้น สร้างมุมหกสิบองศา', mgDemo(mgT.angle(60))),
    T('ตัวอย่างทีละขั้น: <b>สร้างมุม 45°</b> (สร้าง 90° แล้วแบ่งครึ่ง)', 'ตัวอย่างทีละขั้น สร้างมุมสี่สิบห้าองศา', mgDemo(mgT.angle(45))),
    T('<b>ลองสร้างเอง</b>: สร้างมุม 30° — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง สร้างมุมสามสิบองศา', mgTry(mgT.angle(30)))
  ], () => [Q.mgBuild(mgT.angle(mgPick([60, 90, 120])), 'สร้างมุมด้วยวงเวียนและสันตรง'), Q.mgBuild(mgT.angle(mgPick([30, 45, 135, 150])), 'สร้างมุมด้วยวงเวียนและสันตรง (ใช้การแบ่งครึ่ง)'),
    mgTraceQ('angle60', 'การสร้างมุม 60°'),
    Q.mgPick({ q: 'มุมขนาดใดสร้างด้วยวงเวียนและสันตรง<b>ไม่ได้</b>', opts: ['40°', '15°', '105°', '135°'], right: '40°', hint: 'มุมที่สร้างได้มาจาก 60° 90° 180° และการแบ่งครึ่ง/บวก/ลบมุมเหล่านี้' }),
    Q.mgPick({ q: 'การสร้างมุม 75° ทำได้โดยข้อใด', opts: ['สร้างมุม 60° แล้วต่อด้วยมุม 15°', 'แบ่งครึ่งมุม 120°', 'สร้างมุม 90° แล้วต่อด้วยมุม 15°', 'แบ่งครึ่งมุม 180°'], right: 'สร้างมุม 60° แล้วต่อด้วยมุม 15°', hint: '60 + 15 = 75' }),
    Q.mgPick({ q: 'มุม 22.5° ได้จากการแบ่งครึ่งมุมขนาดใด', opts: ['45°', '60°', '30°', '90°'], right: '45°', hint: '22.5 × 2 = 45' }),
    Q.mgPick({ q: 'การสร้างมุม 150° ข้อใดถูกต้อง', opts: ['สร้างมุม 30° แล้วใช้มุมประชิดบนเส้นตรง (180° − 30°)', 'แบ่งครึ่งมุม 120°', 'สร้างมุม 60° สองครั้ง', 'สร้างมุม 90° แล้วต่อด้วยมุม 45°'], right: 'สร้างมุม 30° แล้วใช้มุมประชิดบนเส้นตรง (180° − 30°)', hint: '180 − 30 = 150' }),
    Q.mgNum({ q: 'แบ่งครึ่งมุมฉาก แล้วแบ่งครึ่งมุมที่ได้อีกครั้ง จะได้มุมขนาดกี่องศา', a: 22.5, unit: 'องศา', hint: '90 ÷ 2 ÷ 2' }), Q.mgNum({ q: 'สร้างมุม 60° แล้วต่อด้วยมุม 45° ที่จุดยอดเดียวกัน จะได้มุมรวมขนาดกี่องศา', a: 105, unit: 'องศา', hint: '60 + 45' }),
    Q.mgPick({ q: 'การสร้างมุม 90° ที่จุด O บนเส้นตรง ใช้การสร้างใด', opts: ['การสร้างเส้นตั้งฉากที่จุดบนเส้นตรง', 'การลอกส่วนของเส้นตรง', 'การสร้างเส้นขนาน', 'การแบ่งครึ่งมุม 60°'], right: 'การสร้างเส้นตั้งฉากที่จุดบนเส้นตรง', hint: 'มุมฉาก = เส้นตั้งฉาก' }),
    Q.mgNum({ q: 'สร้างมุม 90° แล้วแบ่งครึ่ง จากนั้นนำมุมที่ได้ไปต่อกับมุม 90° จะได้มุมรวมกี่องศา', a: 135, unit: 'องศา', hint: '90 + 45' }), Q.mgNum({ q: 'แบ่งครึ่งมุม 60° แล้วนำมุมที่ได้ไปต่อกับมุม 60° อีกมุมหนึ่ง จะได้มุมรวมกี่องศา', a: 90, unit: 'องศา', hint: '60 + 30' }),
    mgTF('ในการสร้างมุม 60° ใช้รัศมีเดียวกันตลอด เพราะได้รูปสามเหลี่ยมด้านเท่า', true, ''), mgTF('มุม 120° สร้างได้จากการแบ่งครึ่งมุม 60°', false, 'แบ่งครึ่ง 60° ได้ 30° — 120° คือ 60° + 60°')]),
  LM2(6, 'เกาะสามเหลี่ยม', 'การสร้างรูปสามเหลี่ยม', 'สร้างสามเหลี่ยม', 'สร้างรูปสามเหลี่ยมเมื่อกำหนดความยาวของด้านสามด้าน ด้านสองด้านกับมุมในระหว่าง หรือมุมสองมุมกับด้านในระหว่าง', [
    T('ตัวอย่างทีละขั้น: <b>กำหนดด้านสามด้าน</b> (ด้าน ด้าน ด้าน)', 'ตัวอย่างทีละขั้น กำหนดด้านสามด้าน', mgDemo(mgT.tri('sss', { c: 6, b: 4, a: 5 }))),
    T('ตัวอย่างทีละขั้น: <b>กำหนดด้านสองด้านและมุมในระหว่าง</b> (ด้าน มุม ด้าน)', 'ตัวอย่างทีละขั้น กำหนดด้านสองด้านและมุมในระหว่าง', mgDemo(mgT.tri('sas', { c: 6, b: 4, A: 50 }))),
    T('<b>ลองสร้างเอง</b>: กำหนดมุมสองมุมและด้านในระหว่าง (มุม ด้าน มุม) — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง กำหนดมุมสองมุมและด้านในระหว่าง', mgTry(mgT.tri('asa', { c: 6, A: 45, B: 60 })))
  ], () => [Q.mgBuild(mgT.tri('sss', mgPick([{ c: 6, b: 4, a: 5 }, { c: 7, b: 5, a: 4 }, { c: 6.5, b: 4.5, a: 5.5 }])), 'สร้างรูปสามเหลี่ยมจากด้านสามด้าน'), Q.mgBuild(mgT.tri('sas', mgPick([{ c: 6, b: 4, A: 60 }, { c: 7, b: 3.5, A: 45 }, { c: 5.5, b: 4, A: 70 }])), 'สร้างรูปสามเหลี่ยมจากด้าน มุม ด้าน'),
    Q.mgBuild(mgT.tri('asa', mgPick([{ c: 6, A: 50, B: 60 }, { c: 7, A: 40, B: 70 }])), 'สร้างรูปสามเหลี่ยมจากมุม ด้าน มุม'),
    Q.mgPick({ q: 'ข้อมูลชุดใดสร้างรูปสามเหลี่ยมได้เพียงแบบเดียว (ทุกคนสร้างได้รูปเท่ากัน)', opts: ['ด้านสามด้าน', 'มุมสามมุม', 'มุมหนึ่งมุมเท่านั้น', 'ด้านหนึ่งด้านเท่านั้น'], right: 'ด้านสามด้าน', hint: 'รู้แค่มุม รูปจะใหญ่หรือเล็กก็ได้' }),
    Q.mgPick({ q: 'สร้างรูปสามเหลี่ยม ABC เมื่อกำหนด AB, ∠A และ AC ควรเริ่มอย่างไร', opts: ['สร้าง AB แล้วสร้างมุม A บน AB', 'สร้างมุม C ก่อน', 'สร้าง BC ก่อน', 'วาดวงกลมรัศมี AB'], right: 'สร้าง AB แล้วสร้างมุม A บน AB', hint: 'มุม A อยู่ระหว่างด้าน AB และ AC' }),
    mgThirdQ(mgPick([40, 55]), mgPick([65, 70])), mgThirdQ(mgPick([90]), mgPick([35, 48])), mgThirdQ(mgPick([25, 30]), mgPick([110, 105])),
    Q.mgPick({ q: 'กำหนด AB = 6 ซม. AC = 4 ซม. BC = 11 ซม. สร้างรูปสามเหลี่ยม ABC ได้หรือไม่', opts: ['ไม่ได้ เพราะ 6 + 4 น้อยกว่า 11', 'ได้ เป็นรูปสามเหลี่ยมมุมป้าน', 'ได้ เป็นรูปสามเหลี่ยมมุมฉาก', 'ได้ หลายรูป'], right: 'ไม่ได้ เพราะ 6 + 4 น้อยกว่า 11', hint: 'ส่วนโค้งจาก A และ B จะไม่ตัดกัน' }),
    mgTF('รูปสามเหลี่ยมด้านเท่าที่ยาวด้านละ 5 ซม. มีมุมทุกมุม 60°', true, ''), mgTF('กำหนดมุมสามมุม 50°, 60°, 70° สร้างรูปสามเหลี่ยมได้เพียงขนาดเดียว', false, 'รูปมีรูปร่างเดียวกันแต่ขนาดใหญ่หรือเล็กก็ได้')]),
  LM2(7, 'ลานสำรวจ', 'การสำรวจเกี่ยวกับรูปสามเหลี่ยม', 'ด้าน·มุมสามเหลี่ยม', 'สำรวจความยาวของด้านที่ประกอบเป็นรูปสามเหลี่ยมได้ ผลบวกของมุมภายใน และมุมภายนอกของรูปสามเหลี่ยม', [
    T('<b>ความยาวสามด้าน</b> ประกอบเป็นรูปสามเหลี่ยมได้เสมอไหม — ลองทุกชุด', 'ความยาวสามด้านประกอบเป็นรูปสามเหลี่ยมได้เสมอไหม ลองทุกชุด', el => el.append(mgIneqSim([[4, 5, 7], [2, 3, 7], [3, 4, 7], [5, 5, 5]]))),
    T('<b>มุมภายใน</b>ของรูปสามเหลี่ยมรวมกันได้เท่าไร — ลากจุดยอดดู', 'มุมภายในของรูปสามเหลี่ยมรวมกันได้เท่าไร ลากจุดยอดดู', el => el.append(mgSumSim())),
    T('ตัวอย่างทีละขั้น: <b>มุมภายนอก</b>ของรูปสามเหลี่ยม', 'ตัวอย่างทีละขั้น มุมภายนอกของรูปสามเหลี่ยม', el => el.append(dcWalk((() => { const A = [0, 0], B = [4.6, 0], s = Math.sin(70 * Math.PI / 180) / Math.sin(60 * Math.PI / 180) * 4.6, C = mgP(A, 50, s), Dd = mgP(C, mgA(B, C), 2); return mgFig({ pts: { A, B, C, D: Dd }, segs: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D']], angs: [['A', 'B', 'C', '50°'], ['B', 'C', 'A', '70°'], ['C', 'D', 'A', '?']] }, { max: 300 }); })(),
      [['① มุมภายในทั้งสาม', '∠A + ∠B + ∠ACB = 180° → 50 + 70 + ∠ACB = 180 → ∠ACB = 60°'], ['② มุมบนเส้นตรง', '∠ACB + ∠ACD = 180° (มุมตรง) → ∠ACD = 120°'], ['③ สังเกต', '120 = 50 + 70']], '<b>มุมภายนอก = ผลบวกของมุมภายในสองมุมที่ไม่ได้อยู่ติดกับมัน</b>')))
  ], () => [mgIneqQ(), mgIneqQ(), mgRangeQ(mgPick([4, 5]), mgPick([7, 9])), mgRangeQ(mgPick([3, 6]), mgPick([8, 10])), mgThirdQ(mgPick([35, 45]), mgPick([80, 75])), mgThirdQ(mgPick([60]), mgPick([60])), mgExtQ(mgPick([40, 45]), mgPick([65, 70])), mgExtQ(mgPick([30, 35]), mgPick([90, 85])),
    Q.mgPick({ q: 'รูปสามเหลี่ยมที่มีมุมหนึ่งเป็น 100° มุมที่เหลืออีกสองมุมรวมกันกี่องศา', opts: ['80°', '100°', '180°', '260°'], right: '80°', hint: '180 − 100' }),
    mgTF('รูปสามเหลี่ยมหนึ่งรูปมีมุมฉากได้สองมุม', false, 'ถ้ามี 90° สองมุม รวมกันก็ 180° แล้ว มุมที่สามจะเป็น 0° ไม่ได้'), mgTF('ด้านที่ยาวที่สุดของรูปสามเหลี่ยม ต้องสั้นกว่าผลบวกของอีกสองด้าน', true, '')]),
  LM2(8, 'ทางน้ำคู่ขนาน', 'การสร้างเส้นขนาน', 'เส้นขนาน', 'สร้างเส้นตรงให้ผ่านจุดที่กำหนดและขนานกับเส้นตรงที่กำหนด โดยใช้การสร้างมุมให้เท่ากัน', [
    T('<b>เส้นขนาน</b> — แตะการ์ดดูทีละใบ', 'เส้นขนาน แตะการ์ดดูทีละใบ', el => el.append(miCards([['เส้นขนานคืออะไร', '<b>ไม่ตัดกัน</b><small>ห่างกันเท่ากันตลอด</small>'], ['สัญลักษณ์', `<b>ℓ ∥ m</b><small>อ่านว่า ℓ ขนานกับ m</small>`], ['ใช้อะไรสร้าง', '<b>มุมที่เท่ากัน</b><small>ลอกมุมที่เส้นตัดทำกับเส้นเดิม</small>'], ['มุมแย้ง', '<b>เท่ากัน</b><small>เมื่อเส้นตรงสองเส้นขนานกัน</small>']]))),
    T('ตัวอย่างทีละขั้น: <b>สร้างเส้นผ่าน P ให้ขนานกับ AB</b>', 'ตัวอย่างทีละขั้น สร้างเส้นผ่านพีให้ขนานกับเอบี', mgDemo(mgT.parallel())),
    T('<b>ลองสร้างเอง</b>: เส้นผ่าน P ขนานกับ AB — ติดตรงไหนกด คำใบ้', 'ลองสร้างเอง เส้นผ่านพีขนานกับเอบี', mgTry(mgT.parallel()))
  ], () => [Q.mgBuild(mgT.parallel(), 'สร้างเส้นผ่าน P ให้ขนานกับ AB'), mgTraceQ('parallel', 'การสร้างเส้นขนาน'), mgParAngQ(mgPick([50, 55])), mgParAngQ(mgPick([62, 68])), mgParAngQ(mgPick([40, 45])),
    Q.mgPick({ q: 'ℓ ∥ m อ่านว่าอย่างไร', opts: ['ℓ ขนานกับ m', 'ℓ ตั้งฉากกับ m', 'ℓ ตัดกับ m', 'ℓ ยาวเท่ากับ m'], right: 'ℓ ขนานกับ m', hint: '∥ = ขนาน' }),
    Q.mgPick({ q: 'การสร้างเส้นขนานผ่านจุด P อาศัยการสร้างใด', opts: ['สร้างมุมให้เท่ากับมุมที่กำหนด', 'แบ่งครึ่งส่วนของเส้นตรง', 'สร้างมุม 60°', 'วัดความยาวด้วยไม้บรรทัด'], right: 'สร้างมุมให้เท่ากับมุมที่กำหนด', hint: 'ลอกมุมที่เส้นตัดทำกับเส้นเดิมไปไว้ที่ P' }),
    Q.mgNum({ q: 'ℓ ∥ m มีเส้นตัดทำให้เกิดมุมภายในบนข้างเดียวกันของเส้นตัดคู่หนึ่ง ถ้ามุมหนึ่งเป็น 70° อีกมุมหนึ่งกี่องศา', a: 110, unit: 'องศา', hint: 'มุมภายในบนข้างเดียวกันของเส้นตัด รวมกันได้ 180°' }),
    mgTF('เส้นตรงสองเส้นที่ขนานกันจะตัดกันเมื่อลากต่อไปยาว ๆ', false, 'เส้นขนานไม่ตัดกันเลย'), mgTF('ถ้าเส้นตัดทำมุมแย้งเท่ากัน เส้นตรงคู่นั้นขนานกัน', true, ''), mgTF('ผ่านจุด P ที่อยู่นอกเส้นตรง ℓ มีเส้นตรงที่ขนานกับ ℓ ได้เพียงเส้นเดียว', true, '')]),
  LM2(9, 'ปากน้ำสี่เหลี่ยม', 'การสร้างรูปสี่เหลี่ยม', 'สร้างสี่เหลี่ยม', 'สร้างรูปสี่เหลี่ยมชนิดต่าง ๆ เมื่อกำหนดความยาวของด้าน ขนาดของมุม หรือเส้นทแยงมุม โดยใช้การสร้างพื้นฐาน', [
    T('ตัวอย่างทีละขั้น: <b>รูปสี่เหลี่ยมด้านขนาน ABCD</b> AB = 5 ซม. ∠A = 60° AD = 3 ซม.', 'ตัวอย่างทีละขั้น รูปสี่เหลี่ยมด้านขนาน', el => el.append(dcWalk(mgFig({ pts: { A: [0, 0], B: [5, 0], C: [6.5, 2.6], D: [1.5, 2.6] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], angs: [['A', 'B', 'D', '60°']], fill: [[['A', 'B', 'C', 'D'], '#FFD27A']] }, { max: 300 }),
      [['① สร้างฐาน', 'AB = 5 ซม.'], ['② สร้างมุม', '∠A = 60° (วงเวียน: รูปสามเหลี่ยมด้านเท่า)'], ['③ ลอกความยาว', 'AD = 3 ซม. บนแขนของมุม'], ['④ หาจุด C', 'วงเวียนจาก D รัศมี AB และจาก B รัศมี AD ตัดกันที่ C'], ['⑤ ลากเส้น', 'BC และ DC']], '<b>ด้านตรงข้ามยาวเท่ากัน → ได้รูปสี่เหลี่ยมด้านขนาน</b>'))),
    T('<b>ลองสร้างเอง</b>: รูปสี่เหลี่ยมด้านขนาน ABCD ให้ AB = 5 ซม. ∠A = 60° และ AD = 3 ซม.', 'ลองสร้างเอง รูปสี่เหลี่ยมด้านขนาน', el => el.append(cnsFree(cnsPara(5, 3, 60, 'รูปสี่เหลี่ยมด้านขนาน')))),
    T('<b>ลองสร้างเอง</b>: รูปสี่เหลี่ยมผืนผ้า ABCD ให้ AB = 6 ซม. และ BC = 3.5 ซม. (มุมฉากใช้การสร้างเส้นตั้งฉาก)', 'ลองสร้างเอง รูปสี่เหลี่ยมผืนผ้า', el => el.append(cnsFree(cnsPara(6, 3.5, 90, 'รูปสี่เหลี่ยมผืนผ้า'))))
  ], () => [cnsGen.para(), cnsGen.rect(), cnsGen.sq(), cnsGen.rhom(), cnsGen.kite(),
    Q.mgPick({ q: 'การสร้างรูปสี่เหลี่ยมผืนผ้า ต้องใช้การสร้างพื้นฐานใดเพื่อให้ได้มุมฉาก', opts: ['การสร้างเส้นตั้งฉาก', 'การแบ่งครึ่งมุม 60°', 'การสร้างมุม 45°', 'การลอกความยาว'], right: 'การสร้างเส้นตั้งฉาก', hint: 'มุมฉาก = 90°' }),
    Q.mgPick({ q: 'สร้างรูปสี่เหลี่ยมด้านขนาน ABCD เมื่อมี AB และ AD แล้ว หาจุด C อย่างไร', opts: ['วงเวียนจาก B รัศมี AD และจาก D รัศมี AB ตัดกัน', 'แบ่งครึ่ง AB', 'สร้างมุม 90° ที่ B', 'ลาก BD แล้วแบ่งครึ่ง'], right: 'วงเวียนจาก B รัศมี AD และจาก D รัศมี AB ตัดกัน', hint: 'ด้านตรงข้ามยาวเท่ากัน: BC = AD และ DC = AB' }),
    Q.mgPick({ q: 'รูปสี่เหลี่ยมขนมเปียกปูน ABCD ที่ AB = 4 ซม. ด้าน BC ยาวกี่ ซม.', opts: ['4 ซม.', '8 ซม.', '2 ซม.', 'บอกไม่ได้'], right: '4 ซม.', hint: 'ขนมเปียกปูนมีด้านยาวเท่ากันทุกด้าน' }),
    Q.mgNum({ q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มี ∠A = 65° ∠B มีขนาดกี่องศา', fig: mgFig({ pts: { A: [0, 0], B: [5, 0], C: [6.27, 2.72], D: [1.27, 2.72] }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], angs: [['A', 'B', 'D', '65°'], ['B', 'C', 'A', '?']] }, { max: 300 }), a: 115, unit: 'องศา', hint: 'มุมที่อยู่ติดกันบนด้านเดียวกันรวมกันได้ 180°' }),
    Q.mgPick({ q: 'รูปสี่เหลี่ยมผืนผ้า ABCD มี AB = 6 ซม. และ BC = 3.5 ซม. ด้าน CD ยาวเท่าใด', opts: ['6 ซม.', '3.5 ซม.', '9.5 ซม.', '12 ซม.'], right: '6 ซม.', hint: 'ด้านตรงข้ามของรูปสี่เหลี่ยมผืนผ้ายาวเท่ากัน' }),
    Q.mgPick({ q: 'สร้างรูปสี่เหลี่ยมจัตุรัสที่มีเส้นทแยงมุมยาว 6 ซม. ต้องใช้สมบัติใดของเส้นทแยงมุม', opts: ['ยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน และตั้งฉากกัน', 'ยาวไม่เท่ากัน', 'ขนานกัน', 'ไม่ตัดกัน'], right: 'ยาวเท่ากัน แบ่งครึ่งซึ่งกันและกัน และตั้งฉากกัน', hint: 'เส้นทแยงมุมของจัตุรัสตัดกันเป็นมุมฉากที่จุดกึ่งกลาง' }),
    Q.mgNum({ q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มี AB = 7 ซม. และ AD = 4 ซม. ความยาวรอบรูปเท่าใด', a: 22, unit: 'ซม.', hint: '2 × (7 + 4)' }),
    Q.mgNum({ q: 'รูปว่าว ABCD มี ∠A = 100° ∠C = 60° และ ∠B = ∠D มุม B มีขนาดกี่องศา', a: 100, unit: 'องศา', hint: 'มุมภายในของรูปสี่เหลี่ยมรวมกัน 360° → (360 − 100 − 60) ÷ 2' }),
    mgTF('รูปสี่เหลี่ยมจัตุรัสสร้างได้จากการสร้างเส้นตั้งฉากและการลอกความยาว', true, ''), mgTF('กำหนดความยาวด้านทั้งสี่ด้านอย่างเดียว ก็สร้างรูปสี่เหลี่ยมได้เพียงแบบเดียว', false, 'มุมเปลี่ยนได้ รูปจึงบิดได้หลายแบบ')])
];
LESSONS_M1C2.find(L => L.id === 2101).pracQ = () => mgKindQ('ray', 'KL');
LESSONS_M1C2.find(L => L.id === 2107).pracQ = () => mgThirdQ(50, 60);

/* ---------- บอส: 20 ข้อ (แต่งใหม่ทั้งหมด) ---------- */
const mgXF = s => ({ html: s });
const EXAM_M1C2 = xrot([
  { q: 'ข้อใดกล่าว<b>ไม่ถูกต้อง</b>', opts: ['รังสีมีจุดปลายสองจุด', 'ส่วนของเส้นตรงมีจุดปลายสองจุด', 'เส้นตรงยาวไม่สิ้นสุดทั้งสองทาง', 'จุดใช้บอกตำแหน่ง'], a: 0 },
  { q: 'รูปนี้เขียนแทนด้วยสัญลักษณ์ใด' + mgNameFig('ray', 'PQ'), opts: [mgXF(mgSym('ray', 'PQ')), mgXF(mgSym('ray', 'QP')), mgXF(mgSym('seg', 'PQ')), mgXF(mgSym('line', 'PQ'))], a: 0 },
  { q: 'มุมขนาด 205° เป็นมุมชนิดใด', opts: ['มุมกลับ', 'มุมป้าน', 'มุมตรง', 'มุมแหลม'], a: 0 },
  { q: 'จากรูป ∠ABC เป็นมุมชนิดใด' + mgAngFig(118, { rot: 10 }), opts: ['มุมป้าน', 'มุมแหลม', 'มุมฉาก', 'มุมกลับ'], a: 0 },
  { q: 'การวัดมุมด้วยครึ่งวงกลม (โปรแทรกเตอร์) ต้องวางจุดศูนย์กลางไว้ที่ใด', opts: ['จุดยอดของมุม', 'ปลายแขนของมุม', 'กึ่งกลางแขนของมุม', 'ที่ใดก็ได้'], a: 0 },
  { q: 'การแบ่งครึ่ง AB ที่ยาว 8 ซม. ควรกางวงเวียนยาวเท่าใด', opts: ['5 ซม.', '3 ซม.', '4 ซม.', '2 ซม.'], a: 0 },
  { q: 'M เป็นจุดกึ่งกลางของ AB ถ้า AM = 4.5 ซม. AB ยาวเท่าใด', opts: ['9 ซม.', '4.5 ซม.', '2.25 ซม.', '13.5 ซม.'], a: 0 },
  { q: 'รูปนี้เป็นร่องรอยของการสร้างใด' + MG_TRACE.bisAng(), opts: ['การแบ่งครึ่งมุม', 'การแบ่งครึ่งส่วนของเส้นตรง', 'การสร้างเส้นขนาน', 'การสร้างเส้นตั้งฉากจากจุดภายนอก'], a: 0 },
  { q: 'รูปนี้เป็นร่องรอยของการสร้างใด' + MG_TRACE.perpFrom(), opts: ['การสร้างเส้นตั้งฉากจากจุดภายนอกเส้นตรง', 'การแบ่งครึ่งมุม', 'การสร้างมุม 60°', 'การลอกส่วนของเส้นตรง'], a: 0 },
  { q: 'OC แบ่งครึ่ง ∠AOB ถ้า ∠AOC = 37° แล้ว ∠AOB มีขนาดเท่าใด', opts: ['74°', '37°', '18.5°', '53°'], a: 0 },
  { q: 'มุมในข้อใดสร้างด้วยวงเวียนและสันตรงไม่ได้', opts: ['50°', '75°', '112.5°', '165°'], a: 0 },
  { q: 'การสร้างมุม 60° ด้วยวงเวียนและสันตรง อาศัยสมบัติของรูปใด', opts: ['รูปสามเหลี่ยมด้านเท่า', 'รูปสี่เหลี่ยมจัตุรัส', 'รูปสามเหลี่ยมมุมฉาก', 'วงกลมสองวงที่ไม่ตัดกัน'], a: 0 },
  { q: 'การสร้างมุม 135° ทำได้โดยข้อใด', opts: ['สร้างมุมฉาก แล้วต่อด้วยมุม 45°', 'แบ่งครึ่งมุม 270°', 'สร้างมุม 60° สองครั้ง', 'แบ่งครึ่งมุม 90° สองครั้ง'], a: 0 },
  { q: 'ความยาวชุดใดเป็นด้านทั้งสามของรูปสามเหลี่ยมได้', opts: ['5 ซม., 6 ซม., 10 ซม.', '3 ซม., 4 ซม., 8 ซม.', '2 ซม., 5 ซม., 7 ซม.', '4 ซม., 4 ซม., 9 ซม.'], a: 0 },
  { q: 'รูปสามเหลี่ยม ABC มี ∠A = 48° และ ∠B = 67° ∠C มีขนาดเท่าใด', opts: ['65°', '115°', '75°', '55°'], a: 0 },
  { q: 'รูปสามเหลี่ยมมีมุมภายในสองมุมเป็น 55° และ 60° มุมภายนอกที่จุดยอดที่สามมีขนาดเท่าใด', opts: ['115°', '65°', '125°', '55°'], a: 0 },
  { q: 'ข้อมูลชุดใดสร้างรูปสามเหลี่ยมได้เพียงขนาดเดียว', opts: ['ด้านสองด้านและมุมในระหว่าง', 'มุมสามมุม', 'ด้านหนึ่งด้าน', 'มุมหนึ่งมุมกับด้านหนึ่งด้านที่ไม่ได้ติดกับมุม'], a: 0 },
  { q: 'การสร้างเส้นผ่านจุด P ให้ขนานกับเส้นตรง ℓ ใช้การสร้างใดเป็นหลัก', opts: ['การสร้างมุมให้เท่ากับมุมที่กำหนด', 'การแบ่งครึ่งส่วนของเส้นตรง', 'การสร้างรูปสามเหลี่ยมด้านเท่า', 'การวัดด้วยไม้บรรทัด'], a: 0 },
  { q: 'ℓ ∥ m มีเส้นตัดทำมุมแย้งคู่หนึ่ง ถ้ามุมหนึ่งเป็น 58° อีกมุมหนึ่งมีขนาดเท่าใด', opts: ['58°', '122°', '32°', '116°'], a: 0 },
  { q: 'รูปสี่เหลี่ยมด้านขนาน ABCD มี ∠A = 72° ∠B มีขนาดเท่าใด', opts: ['108°', '72°', '18°', '288°'], a: 0 }
], 4);
LESSONS_M1C2.push({ id: 2119, boss: true, place: 'วังจระเข้เรขา', title: 'ด่านบอส: ม.1 บทที่ 2 การสร้างทางเรขาคณิต', short: 'ด่านบอส · ข้อสอบ', tone: 'jade',
  goal: 'ตอบคำถามเรื่องการสร้างทางเรขาคณิต 20 ข้อ ตอบถูก 16 ข้อขึ้นไปเพื่อชนะจระเข้เรขา',
  exam: EXAM_M1C2, pass: 16, bossName: 'จระเข้เรขา', bossPal: 'night', emblem: '∠', bossKind: 'croc',
  winLine: 'ชนะจระเข้เรขาแล้ว! ใช้วงเวียน สันตรง และครึ่งวงกลมได้คล่องมาก', loseLine: 'จระเข้เรขายังเฝ้าวังน้ำอยู่ กลับไปฝึกสร้างอีกนิดแล้วมาสู้ใหม่นะ!' });
