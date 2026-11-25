/* ม.1 บทที่ 2 ลำน้ำเรขา — กระดานสร้างรูป (ดู geo/README.md) */
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
  /* v243 (ผู้ใช้ขอ): โจทย์ตัวใหญ่ชัด ๆ เหนือกระดาน · ทำถูก/ดูเฉลย/ยังไม่ถูก แสดงในแถบเดียวกันให้เห็นชัด */
  const banner = h('div', { class: 'mg-banner', role: 'status' }, h('span', { class: 'mg-bi' }, '✎'), h('span', { class: 'mg-bt', html: T.title || '' }));
  const flag = (kind, html) => { banner.classList.remove('ok', 'bad', 'rev'); void banner.offsetWidth; if (kind) banner.classList.add(kind); banner.firstChild.textContent = kind === 'ok' ? '✓' : kind === 'bad' ? '!' : kind === 'rev' ? '👁' : '✎'; banner.lastChild.innerHTML = html; board.classList.toggle('mg-ok', kind === 'ok'); };
  const say2 = (t, ms = 0) => { msg.innerHTML = t; msg.classList.toggle('hint', !!ms); clearTimeout(hintT); if (ms) hintT = setTimeout(() => { msg.innerHTML = ''; msg.classList.remove('hint'); }, ms); };
  /* ---------- geometry ---------- */
  const D = mgD, ang = mgA, dir = mgU, nrm = mgNrm, adiff = mgAd, wrapD = d => ((d % 360) + 540) % 360 - 180;
  const clampB = (p, m = .25) => [Math.max(m, Math.min(BW - m, p[0])), Math.max(m, Math.min(BH - m, p[1]))], inB = (p, m = .1) => p[0] > m && p[1] > m && p[0] < BW - m && p[1] < BH - m;
  const P_ = i => [S.pts[i].x, S.pts[i].y], segPts = s => [P_(s.a), P_(s.b)];
  const onArc = (a, p) => { if (a.a1 - a.a0 >= 359) return true; const e = Math.max(3, .25 / a.r * 57.3); /* เผื่อปลายส่วนโค้ง ~3° (เด็กเริ่ม/หยุดตรงเส้นพอดี) */ return nrm(ang(P_(a.c), p) - a.a0 + e) <= a.a1 - a.a0 + 2 * e; };
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
  const success = r => { done = true; (T.marks || []).forEach(m => G.ptName(m.p, m.name)); ((r && r.names) || []).forEach(([q, n]) => G.ptName(q, n)); finish(); req(); say2(T.okMsg || '<b>สร้างเสร็จแล้ว!</b> 🎉'); flag('ok', `<b>ถูกต้อง!</b> ${String(T.okMsg || 'สร้างเสร็จแล้ว').replace(/<\/?b>/g, '').replace(/^สร้างเสร็จแล้ว!?\s*/, '') || 'สร้างเสร็จแล้ว'}`); sfx.ok(); cb.onOK && cb.onOK(); if (teach) { try { teachDone(wrap); } catch (_) { } } };
  const check = manual => { if (done || demo || !T.goal) return; let r = null; try { r = T.goal(G); } catch (e) { r = { ok: false }; } if (r && r.ok) return success(r);
    if (!manual) return; const why = (r && r.why) || 'ยังสร้างไม่ครบ'; sfx.no(); board.classList.remove('shake'); void board.offsetWidth; board.classList.add('shake'); say2(why + ' — 💡 ' + nextSay()); flag('bad', `<b>ยังไม่ถูก</b> — ${why}`); clearTimeout(banner.__t); banner.__t = setTimeout(() => { if (!done) flag('', T.title || ''); }, 3500); cb.onWrong && cb.onWrong(why); };
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
  const compGeo = () => { const C = X(comp.c), Pn = X(mgAdd(comp.c, dir(comp.phi), comp.r)), M = [(C[0] + Pn[0]) / 2, (C[1] + Pn[1]) / 2], L = Math.hypot(Pn[0] - C[0], Pn[1] - C[1]) || 1, n = [-(Pn[1] - C[1]) / L, (Pn[0] - C[0]) / L], hh0 = Math.max(34, 90 - L * .15), kd = x => Math.hypot(L / 2, x + 24), hh = [hh0, hh0 + 34, hh0 - 30, 34, hh0 + 60].find(x => x >= 30 && Math.abs(kd(x) - L) > 24) || hh0; /* ปุ่ม ⟳ ต้องไม่ทับวงเส้นประ */
    let up = n[1] < 0 ? n : [-n[0], -n[1]]; const ok = u => { const k = [M[0] + u[0] * (hh + 24), M[1] + u[1] * (hh + 24)]; return k[0] > 16 && k[1] > 16 && k[0] < W - 16 && k[1] < H - 16; }; if (!ok(up) && ok([-up[0], -up[1]])) up = [-up[0], -up[1]];
    const Hn = [M[0] + up[0] * hh, M[1] + up[1] * hh], Kn = [Hn[0] + up[0] * 24, Hn[1] + up[1] * 24]; return { C, Pn, Hn, Kn }; };
  const compG = on => { const { C, Pn, Hn, Kn } = compGeo(); return (on && !demo && !done ? `<circle cx="${C[0]}" cy="${C[1]}" r="${comp.r * K}" fill="none" stroke="#E5487A" stroke-opacity=".55" stroke-width="2" stroke-dasharray="5 6"/>` : '') + `<g class="cns-comp ${on ? 'on' : 'off'}"><path d="M${C} L${Hn} L${Pn}" fill="none" stroke="#5B5F7A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${Hn[0]}" cy="${Hn[1]}" r="6" fill="#7E6ED6"/><path d="M${Hn} L${Kn}" stroke="#7E6ED6" stroke-width="6" stroke-linecap="round"/><circle cx="${C[0]}" cy="${C[1]}" r="3.5" fill="#2B2550"/><circle cx="${Pn[0]}" cy="${Pn[1]}" r="6" fill="#E5487A"/>`
      + (on ? (demo ? '' : `<circle cx="${Kn[0]}" cy="${Kn[1]}" r="14" fill="#7E6ED6"/><text x="${Kn[0]}" y="${Kn[1] + 5}" text-anchor="middle" class="cns-ico">⟳</text>`) + `<text x="${Pn[0] + 14}" y="${Pn[1] + 24}" class="cns-read">รัศมี ${mgF(comp.r)} ซม.</text>` : '') + '</g>'; };
  const render = () => { raf = 0; let s = '', lab = '';
    S.arcs.forEach(a => { s += arcP(P_(a.c), a.r, a.a0, a.a1); });
    S.segs.forEach(sg => { const P = segPts(sg); s += `<path d="M${X(P[0])} L${X(P[1])}" stroke="#2B2550" stroke-width="${sg.given ? 3.2 : 2.6}" stroke-linecap="round"/>`; if (sg.k === 'ray' || sg.k === 'line') s += arrow(P[1], ang(P[0], P[1])); if (sg.k === 'line') s += arrow(P[0], ang(P[1], P[0])); });
    if (act && act.t === 'pen') s += `<path d="M${X(act.a)} L${X(act.e)}" stroke="#E5487A" stroke-width="2.8" stroke-linecap="round"/>`;
    if (act && act.t === 'sweep' && act.on !== false) s += arcP(comp.c, comp.r, Math.min(act.a0, act.a1, act.lo ?? act.a0), Math.max(act.a0, act.a1, act.hi ?? act.a0), 'cns-live');
    const deg = S.pts.map(() => 0); S.segs.forEach(sg => { deg[sg.a]++; deg[sg.b]++; }); S.arcs.forEach(a => { deg[a.c] += 2; });
    S.pts.forEach((p, i) => { if (p.edge) return; const q = X([p.x, p.y]); if (p.mark) { s += `<path d="M${q[0] - 5} ${q[1] - 5} l10 10 M${q[0] + 5} ${q[1] - 5} l-10 10" stroke="#E5487A" stroke-width="2.4"/>`; return; }
      if (p.name) { s += `<circle cx="${q[0]}" cy="${q[1]}" r="${p.given ? 5.5 : 5}" fill="${p.given ? '#2B2550' : '#E5487A'}"/>`; const lp = p.lab || [-16, -10]; lab += `<text x="${q[0] + lp[0]}" y="${q[1] + lp[1]}" class="cns-n">${p.name}</text>`; }
      else s += deg[i] >= 2 || done ? `<circle cx="${q[0]}" cy="${q[1]}" r="2.6" fill="#9A93C4"/>` : `<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#fff" stroke="#9A93C4" stroke-width="2"/>`; });
    gObj.innerHTML = s;
    gTool.innerHTML = (RUL.out ? rulerG(tool === 'ruler') : '') + (prot.out ? protG(tool === 'prot') : '') + (comp.out ? compG(tool === 'comp') : '');
    gLab.innerHTML = lab + (done && T.measure ? T.measure(G, X) : '');
    let u = ''; if (act && act.t === 'pen') { const e = X(act.e); u += `<text x="${e[0] + 12}" y="${e[1] - 16}" class="cns-read">${mgF(D(act.a, act.e))} ซม.</text>`; if (act.snapE) u += `<circle cx="${e[0]}" cy="${e[1]}" r="11" fill="none" stroke="#E5487A" stroke-width="2" stroke-dasharray="3 3"/>`; if (act.thru) { const q = X(act.thru); u += `<circle cx="${q[0]}" cy="${q[1]}" r="11" fill="none" stroke="#E5487A" stroke-width="2" stroke-dasharray="3 3"/>`; } }
    if (act && act.t === 'pmark') { const q = X(mgAdd(prot.c, dir(prot.rot + act.deg), 2.7)), t = X(mgAdd(prot.c, dir(prot.rot + act.deg), 3.55)), c0 = X(prot.c); u += `<path d="M${c0} L${q}" stroke="#E5487A" stroke-width="1.6" stroke-dasharray="4 4"/><path d="M${q[0] - 6} ${q[1] - 6} l12 12 M${q[0] + 6} ${q[1] - 6} l-12 12" stroke="#E5487A" stroke-width="2.6"/><text x="${t[0]}" y="${t[1] + 6}" text-anchor="middle" class="cns-read">${act.deg}°</text>`; }
    if (hover && !act && tool === 'point' && !done) { const q = X(hover.p); u += hover.k ? `<circle cx="${q[0]}" cy="${q[1]}" r="11" fill="none" stroke="#E5487A" stroke-width="2" stroke-dasharray="3 3"/>` : ''; u += `<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#E5487A" fill-opacity=".45"/>`; }
    gUI.innerHTML = u; };
  const req = () => { if (!raf) raf = requestAnimationFrame(render); };
  /* ---------- hit tests ---------- */
  const near = (p, q, px) => D(p, q) <= cm(px);
  const rulLocal = p => { const u = dir(RUL.th), v = [p[0] - RUL.o[0], p[1] - RUL.o[1]]; return { t: v[0] * u[0] + v[1] * u[1], n: v[0] * -u[1] + v[1] * u[0] }; };
  const rulKnob = () => { const u = dir(RUL.th), n = [-u[1], u[0]]; return mgAdd(mgAdd(RUL.o, u, rulKT()), n, -.55); };
  const protKnob = () => mgAdd(prot.c, dir(prot.rot), 3.25);
  const protDeg = p => { const a = nrm(ang(prot.c, p) - prot.rot); return a > 270 ? 0 : Math.round(Math.min(180, a)); };
  const compPts = () => { const g = compGeo(); return { c: comp.c, pen: mgAdd(comp.c, dir(comp.phi), comp.r), hinge: U(g.Hn[0], g.Hn[1]), knob: U(g.Kn[0], g.Kn[1]) }; };
  const dSeg = (p, a, b) => D(p, projSeg([a, b], p));
  const penStart = p => { const u = dir(RUL.th), nv = [-u[1], u[0]], L = rulLocal(p); let best = null, bd = cm(26);
    [...realPts(), ...inters()].forEach(q => { const Lq = rulLocal(q); if (Math.abs(Lq.n) > .4 || Lq.t < -.7 || Lq.t > RUL.len + .05) return; const d = D(p, q); if (d < bd) { bd = d; best = { q, Lq }; } });
    if (best) { if (Math.abs(best.Lq.n) > 1e-4) RUL.o = mgAdd(RUL.o, nv, best.Lq.n); let t = best.Lq.t; if (t < 0) { RUL.o = mgAdd(RUL.o, u, t); t = 0; } return { p: best.q, t, snap: true }; }
    const t = Math.max(0, Math.min(RUL.len, Math.round(L.t * 10) / 10)); return { p: mgAdd(RUL.o, u, t), t, snap: false }; };
  const penMove = p => { const a = act; if (!a.A0) a.A0 = a.a.slice(); a.a = a.A0.slice(); RUL.o = a.o0.slice(); RUL.th = a.th0; const u = dir(RUL.th), L = rulLocal(p);
    let best = null, bd = cm(20); [...realPts(), ...inters(), ...S.pts.filter(q => q.mark).map(q => [q.x, q.y])].forEach(q => { if (D(q, a.a) < .3) return; const d = D(p, q); if (d >= bd) return; const th = ang(a.a, q), tq = a.ta + D(a.a, q); if (adiff(th, a.th0) > 10 || tq > RUL.len + .05) return; bd = d; best = { q, th }; });
    a.thru = null; if (best) { RUL.th = best.th; RUL.o = mgAdd(a.a, dir(best.th), -a.ta); a.e = best.q; a.snapE = true; return; }
    /* ลากเลยจุด/จุดตัดที่อยู่เกือบบนแนวไม้บรรทัด → หมุนไม้บรรทัดให้เส้นผ่านจุดนั้นพอดี (เด็กลากเลยจุดได้ ไม่ต้องหยุดตรงจุด) */
    if (a.snapA) { let bq = null, bo = cm(30); /* จุดตัดที่สร้างขึ้น / ✕ ได้ก่อนจุดที่โจทย์ให้ (เส้นที่สร้างมักลากผ่านจุดตัด) */ [...realPts().map(q => [q, 1.6]), ...inters().map(q => [q, 1]), ...S.pts.filter(q => q.mark).map(q => [[q.x, q.y], 1])].forEach(([q, w]) => { const dq = D(a.a, q); if (dq < .6 || a.ta + dq > RUL.len + .05) return; const th = ang(a.a, q), dd = adiff(th, a.th0); if (dd > 10 || L.t - a.ta < dq - cm(10)) return; const off = dq * Math.sin(dd * Math.PI / 180) * w; if (off < bo) { bo = off; bq = { q, th }; } });
      if (bq) { RUL.th = bq.th; RUL.o = mgAdd(a.a, dir(bq.th), -a.ta); const t = Math.max(0, Math.min(RUL.len, Math.round(L.t * 10) / 10)); a.e = mgAdd(RUL.o, dir(bq.th), t); a.snapE = false; a.thru = bq.q; return; } }
    else { /* เริ่มที่ว่าง: ลากผ่านจุด/จุดตัด 2 จุดที่เกือบอยู่บนแนวไม้บรรทัด → เส้นผ่านทั้งสองจุดพอดี (เช่น เส้นแบ่งครึ่ง) · ผ่านจุดเดียว → เลื่อนขนานให้ผ่านจุดนั้น */
      const nv = [-u[1], u[0]], tE = L.t, near = [...realPts(), ...inters(), ...S.pts.filter(q => q.mark).map(q => [q.x, q.y])].map(q => ({ q, l: rulLocal(q) })).filter(o => Math.abs(o.l.n) < cm(36) && o.l.t > a.ta - .6 && o.l.t < tE - cm(4)).filter((o, i, arr) => arr.findIndex(z => D(z.q, o.q) < .05) === i);
      let fit = null; for (let i = 0; i < near.length; i++) for (let j = i + 1; j < near.length; j++) { const P1 = near[i].l.t < near[j].l.t ? near[i] : near[j], P2 = P1 === near[i] ? near[j] : near[i], th = ang(P1.q, P2.q), dl = D(P1.q, P2.q); if (dl < .8 || adiff(th, a.th0) > 10) continue; if (!fit || dl > fit.dl) fit = { th, dl, q: P1.q, q2: P2.q }; }
      if (!fit && near.length) { const o = near.reduce((b, z) => Math.abs(z.l.n) < Math.abs(b.l.n) ? z : b); fit = { th: a.th0, q: o.q }; }
      if (fit) { const w = dir(fit.th), pr = z => { const v = [z[0] - fit.q[0], z[1] - fit.q[1]], t = v[0] * w[0] + v[1] * w[1]; return mgAdd(fit.q, w, t); }; a.a = pr(a.A0); RUL.th = fit.th; RUL.o = mgAdd(a.a, w, -a.ta); const t = Math.max(0, Math.min(RUL.len, Math.round(rulLocal(p).t * 10) / 10)); a.e = mgAdd(RUL.o, w, t); a.snapE = false; a.thru = fit.q2 || fit.q; return; } }
    let t = Math.max(0, Math.min(RUL.len, Math.round(L.t * 10) / 10)); a.e = mgAdd(RUL.o, u, t); a.snapE = false; };
  const align = (c, th) => { let best = th, bd = 3.5; [...S.pts.filter(q => !q.edge).map(q => [q.x, q.y]), ...inters()].forEach(q => { if (D(q, c) < .8) return; const a = ang(c, q); if (adiff(a, th) < bd) { bd = adiff(a, th); best = a; } }); if (best !== th) return best;
    bd = 2.5; S.segs.forEach(sg => { const P = segPts(sg), a = ang(P[0], P[1]); [a, a + 180].forEach(x => { if (adiff(x, th) < bd) { bd = adiff(x, th); best = nrm(x); } }); });
    [0, 90, 180, 270].forEach(a => { if (adiff(a, best) < 1.5) best = a; }); return best; };
  const resetIfLost = k => { if (k === 'ruler' && !rulVis()) { RUL.o = R0.o.slice(); RUL.th = 0; } if (k === 'prot' && !inB(prot.c, .2)) { prot.c = P0.c.slice(); prot.rot = 0; } if (k === 'comp' && !inB(comp.c, .2)) { comp.c = C0.c.slice(); comp.r = C0.r; comp.phi = C0.phi; } };
  /* ---------- pointer ---------- */
  svg.addEventListener('pointerdown', e => { if (done || demo || anim) return; e.preventDefault(); e.stopPropagation(); const p = at(e); try { svg.setPointerCapture(e.pointerId); } catch (_) { } const sx = e.clientX, sy = e.clientY;
    if (tool === 'ruler') { RUL.out = true; const L = rulLocal(p);
      if (near(p, rulKnob(), 26)) { act = { t: 'rrot', last: ang(RUL.o, p), th0: RUL.th, o0: RUL.o.slice() }; return; }
      if (L.t > -1 && L.t < RUL.len + .8 && L.n > -1.1 - cm(8) && L.n < cm(26)) { if (L.n > -cm(6)) { const o0 = RUL.o.slice(), st = penStart(p); act = { t: 'pen', a: st.p, ta: st.t, e: st.p, snapA: st.snap, snapE: false, o0: RUL.o.slice(), th0: RUL.th, oBefore: o0 }; req(); return; }
        act = { t: 'rmove', d: [p[0] - RUL.o[0], p[1] - RUL.o[1]] }; return; }
      return; }
    if (tool === 'prot') { prot.out = true;
      if (near(p, protKnob(), 26)) { act = { t: 'prot', last: ang(prot.c, p) }; return; }
      const r = D(prot.c, p), a = nrm(ang(prot.c, p) - prot.rot);
      /* แตะ/ลากตามขอบสเกล = เลือกองศา (เห็น ✕ กับตัวเลขก่อนปล่อย) · จับด้านในครึ่งวงกลม = ย้าย */
      if (TOOLS.includes('prot') && r > 1.75 && r < 3.4 && (a <= 184 || a >= 352)) { act = { t: 'pmark', deg: protDeg(p) }; req(); return; }
      if (r < 3 && (a <= 180 || r < cm(18))) { act = { t: 'pmove', d: [p[0] - prot.c[0], p[1] - prot.c[1]] }; return; }
      return; }
    if (tool === 'comp') { comp.out = true; const K3 = compPts();
      if (near(p, K3.knob, Math.abs(D(comp.c, p) - comp.r) < cm(16) ? 15 : 24) && D(p, K3.knob) < D(p, K3.hinge)) { act = { t: 'sweep', a0: comp.phi, a1: comp.phi, last: ang(comp.c, p) }; return; }
      if (near(p, K3.pen, 20)) { act = { t: 'cpen', sp: p, r0: comp.r, phi0: comp.phi }; return; }
      { const dc = D(comp.c, p); if (dc > cm(24) && Math.abs(dc - comp.r) < cm(20) && !near(p, K3.c, 26) && !near(p, K3.hinge, 26)) { /* แตะบนวงเส้นประ = วางดินสอตรงนั้นแล้วเขียนตามนิ้ว */ const a = ang(comp.c, p); comp.phi = comp.phi + wrapD(a - comp.phi); act = { t: 'sweep', a0: comp.phi, a1: comp.phi, last: a, pen: true, on: true }; req(); return; } }
      if (near(p, K3.c, 26) || dSeg(p, K3.c, K3.hinge) < cm(18) || dSeg(p, K3.hinge, K3.pen) < cm(18) || near(p, K3.hinge, 22)) { act = { t: 'cmove', d: [p[0] - comp.c[0], p[1] - comp.c[1]], body: !near(p, K3.c, 26) }; return; }
      return; }
    if (tool === 'point') { act = { t: 'tap', sx, sy }; } });
  svg.addEventListener('pointermove', e => { if (demo || anim) return; const p = at(e);
    if (!act) { if (tool === 'point' && !done) { const m = magnet(p, { marks: false }); hover = m ? { p: m.p, k: m.k } : { p, k: null }; req(); } return; }
    if (act.t === 'pen') { penMove(p); req(); return; }
    if (act.t === 'rmove') { const pc = clampB(p, .15); let o = [pc[0] - act.d[0], pc[1] - act.d[1]]; const m = magnet(o, { px: 24, marks: true, ruler: false, curve: false }); if (m) o = m.p; RUL.o = o; req(); return; }
    if (act.t === 'rrot') { const now = ang(RUL.o, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; act.raw = (act.raw ?? RUL.th) + d; const prev = RUL.th; RUL.th = align(RUL.o, act.raw); if (!rulVis()) RUL.th = prev; req(); return; }
    if (act.t === 'pmark') { act.deg = protDeg(p); req(); return; }
    if (act.t === 'pmove') { const pc = clampB(p, .15); let c = clampB([pc[0] - act.d[0], pc[1] - act.d[1]], .2); const m = magnet(c, { px: 32, marks: false, ruler: false, curve: false }); if (m) c = m.p; prot.c = c; req(); return; }
    if (act.t === 'prot') { const now = ang(prot.c, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; act.raw = (act.raw ?? prot.rot) + d; let r = act.raw, bd = 3; S.segs.forEach(sg => { const P = segPts(sg); [0, 1].forEach(i => { if (D(P[i], prot.c) < .06) { const dq = ang(prot.c, P[1 - i]); [dq, dq + 180].forEach(x => { if (adiff(r, x) < bd) { bd = adiff(r, x); r = x; } }); } }); if (mgDseg(P, prot.c) < .06) { const dq = ang(P[0], P[1]); [dq, dq + 180].forEach(x => { if (adiff(r, x) < bd) { bd = adiff(r, x); r = x; } }); } }); [0, 90, 180, 270].forEach(dq => { if (adiff(r, dq) < 1.5) r = dq; }); prot.rot = r; req(); return; }
    if (act.t === 'cmove') { const pc = clampB(p, .15); let c = clampB([pc[0] - act.d[0], pc[1] - act.d[1]], .2); const m = magnet(c, { px: act.body ? 34 : 30, marks: false, ruler: false, curve: false }); if (m) c = m.p; comp.c = c; const pn = mgAdd(comp.c, dir(comp.phi), comp.r); if (!inB(pn, .4)) comp.phi = ang(comp.c, [BW / 2, BH / 2]); req(); return; }
    if (act.t === 'cpen') { /* ขาดินสอ = กางรัศมีอย่างเดียว ไม่เขียน (ลากไปที่จุด = ลอกความยาวพอดี) · เขียน = ลากบนวงเส้นประ หรือหมุนปุ่ม ⟳
         ลากวนรอบ ๆ โดยระยะไม่เปลี่ยน = หมุนวงเวียนเฉย ๆ (รัศมีเดิม) */
      if (!act.moved) { if (D(p, act.sp) < cm(8)) return; act.moved = true; }
      const dc = D(comp.c, p), m = magnet(p, { px: 20, marks: false, ruler: false, curve: false }), hit = m && m.k !== 'on' && D(comp.c, m.p) > .4;
      let r = hit ? D(comp.c, m.p) : Math.round(dc * 10) / 10; if (!hit && adiff(ang(comp.c, p), act.phi0) > 25 && Math.abs(dc - act.r0) < cm(14)) { r = act.r0; if (!act.told) { act.told = true; say2('เขียนส่วนโค้ง: ลากไปตาม<b>วงเส้นประ</b> หรือหมุนปุ่ม ⟳ — ขาดินสอใช้กางรัศมี', 3500); } }
      comp.r = Math.max(.5, Math.min(9, r)); comp.phi = ang(comp.c, hit ? m.p : p); req(); return; }
    if (act.t === 'sweep') { if (D(comp.c, p) < cm(20)) return; const now = ang(comp.c, p), d = wrapD(now - act.last); act.last = now; if (Math.abs(d) > 45) return; comp.phi += d;
      if (act.pen) { /* ขาดินสอแตะกระดาษเฉพาะเมื่อนิ้วอยู่ใกล้แนววงกลม · ลากผ่านด้านใน/นอกไกล ๆ = หมุนวงเวียนไปเฉย ๆ ไม่เขียน */ const on = Math.abs(D(comp.c, p) - comp.r) <= Math.max(cm(44), comp.r * .4); if (on && !act.on) act.a0 = act.a1 = act.lo = act.hi = comp.phi; else if (!on && act.on) addArc(act); act.on = on; }
      if (act.on !== false) { act.a1 = comp.phi; act.lo = Math.min(act.lo ?? act.a0, comp.phi); act.hi = Math.max(act.hi ?? act.a0, comp.phi); } req(); } });
  const addArc = a => { const lo = Math.min(a.a0, a.a1, a.lo ?? a.a0), hi = Math.max(a.a0, a.a1, a.hi ?? a.a0); /* ลากไป-กลับ = ส่วนโค้งครอบคลุมทุกที่ที่ลากผ่าน */ if (hi - lo <= 3) return false; save(); const ci = S.pts.findIndex(q => !q.mark && !q.edge && D([q.x, q.y], comp.c) < .03), c = ci >= 0 ? ci : ptAt(comp.c, false, true); S.arcs.push({ c, r: comp.r, a0: lo, a1: Math.min(lo + 360, hi) }); sfx.pop(6); return true; };
  const up = e => { if (!act) return; const a = act; act = null; const p = e && e.clientX != null ? at(e) : null;
    if (a.t === 'pen') { if (D(a.a, a.e) >= .2) { save(); const i = ptAt(a.a, false, true), j = ptAt(a.e, false, true); S.segs.push({ a: i, b: j }); sfx.pop(5); } else { RUL.o = a.oBefore || RUL.o; } req(); check(); return; }
    if (a.t === 'sweep') { if (a.on !== false) addArc(a); req(); check(); return; }
    if (a.t === 'pmark') { { save(); const dg = a.deg; S.pts.push({ x: prot.c[0] + Math.cos((prot.rot + dg) * Math.PI / 180) * 2.7, y: prot.c[1] + Math.sin((prot.rot + dg) * Math.PI / 180) * 2.7, mark: true, deg: dg }); sfx.pop(4); say2(`ทำเครื่องหมายที่ ${dg}° แล้ว — ต่อไปใช้สันตรงลากจากจุดยอดผ่านเครื่องหมาย ✕`); } req(); check(); return; }
    if (a.t === 'tap' && p && e && Math.hypot(e.clientX - a.sx, e.clientY - a.sy) < 10) { const m = magnet(p, { marks: false }); save(); ptAt(m ? m.p : p); sfx.pop(3); hover = null; req(); check(); return; }
    req(); };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', () => { if (act && act.t === 'pen') { RUL.o = act.oBefore || RUL.o; RUL.th = act.th0; } if (act && act.t === 'sweep' && act.on !== false) addArc(act); act = null; req(); check(); }); svg.addEventListener('pointerleave', () => { if (!act) { hover = null; req(); } }); svg.addEventListener('click', e => e.stopPropagation());
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
  const TIPS = { point: 'แตะตรงไหนก็ได้ ได้จุดตรงนั้น (ใกล้จุดตัดจะดูดติดให้)', ruler: 'จับแถบตัวเลขลากเพื่อย้าย · ปุ่ม ⟳ หมุน · ลากตามขอบบน = ลากเส้น (เส้นตรงนิ่ง ไม่สั่น)', prot: 'ลากครึ่งวงกลมให้จุดศูนย์กลางตรงจุดยอดมุม · ⟳ หมุนให้ 0° ทับแขนมุม · แตะที่ขอบ = ทำเครื่องหมายองศา', comp: 'จับเข็มวางที่จุด · ลากขาดินสอ (ชมพู) = กางรัศมี (ลากไปที่จุด = ลอกความยาว) · ลากไปตามวงเส้นประ หรือหมุนปุ่ม ⟳ = เขียนส่วนโค้ง' };
  const LAB = { point: ['tap', 'จุด'], ruler: ['ruler', T.edgeName || 'สันตรง (ไม้บรรทัด)'], prot: ['prot', 'ครึ่งวงกลม'], comp: ['compass', 'วงเวียน'] };
  const setOn = k => tbar.querySelectorAll('.cnsf-t').forEach(x => x.classList.toggle('on', x.dataset.k === k));
  const tb = key => h('button', { class: 'btn sm ia cnsf-t' + (tool === key ? ' on' : ''), 'data-k': key, onclick: e => { e.stopPropagation(); if (done || anim) return; tool = key; if (key === 'prot') prot.out = true; if (key === 'comp') comp.out = true; if (key === 'ruler') RUL.out = true; resetIfLost(key); setOn(key); say2(TIPS[key], 8000); req(); } }, h('span', { class: 'cns-ti ' + LAB[key][0] }), h('span', null, LAB[key][1]));
  const head = ''; /* v243: โจทย์ย้ายไปเป็นแถบใหญ่เหนือกระดาน (banner) */
  if (demo) { let k = 0; const stepB = h('button', { class: 'btn info ia mg-next' }, icon('right'), h('span', null, 'ขั้นต่อไป'));
    const cnt = h('small', { class: 'mg-cnt' }, `ขั้นที่ 0 / ${sol.length}`), list = h('ol', { class: 'mg-steps' });
    stepB.onclick = e => { e.stopPropagation(); if (anim || k >= sol.length) return; const st = sol[k++]; cnt.textContent = `ขั้นที่ ${k} / ${sol.length}`; list.querySelectorAll('li').forEach(li => li.classList.remove('now')); list.append(h('li', { class: 'now', html: st.say })); say2(''); sfx.page && sfx.page();
      try { say(String(st.say).replace(/<[^>]+>/g, ''), true); } catch (_) { }
      stepB.disabled = true; runOps(st.ops || [], true, () => { stepB.disabled = false; if (k >= sol.length) { done = true; (T.marks || []).forEach(m => G.ptName(m.p, m.name)); if (!T.keepTools) RUL.out = prot.out = comp.out = false; req(); stepB.remove(); say2(T.summary || T.okMsg || 'เสร็จแล้ว'); flag('ok', `<b>ครบทุกขั้นแล้ว</b> — ${String(T.summary || T.okMsg || '').replace(/<\/?b>/g, '') || 'ดูตัวอย่างจบแล้ว'}`); sfx.ok(); try { teachDone(wrap); } catch (_) { } } }); };
    tbar.classList.add('mg-demo'); tbar.append(cnt, list, stepB); }
  else { TOOLS.forEach(k => tbar.append(tb(k)));
    tbar.append(h('button', { class: 'btn sm ia cnsf-u', onclick: e => { e.stopPropagation(); if (done || !hist.length) return; S = JSON.parse(hist.pop()); sfx.page(); req(); } }, icon('undo'), h('span', null, 'ย้อนกลับ')),
      h('button', { class: 'btn sm ia cnsf-h', onclick: e => { e.stopPropagation(); if (!done) hint(); } }, icon('sparkle'), h('span', null, 'คำใบ้')));
    if (T.goal && T.manual !== false) tbar.append(h('button', { class: 'btn sm ia primary mg-chk', onclick: e => { e.stopPropagation(); check(true); } }, icon('check'), h('span', null, 'ตรวจ')));
    if (teach) tbar.append(h('button', { class: 'btn sm ia cnsf-r', onclick: e => { e.stopPropagation(); if (done) return; wrap.reveal(); try { teachDone(wrap); } catch (_) { } } }, icon('eye'), h('span', null, 'ดูเฉลย'))); }
  if (T.title) wrap.append(banner); wrap.append(h('div', { class: 'cns-side' }, head, tbar, msg), board);
  wrap.selfTest = () => { S = JSON.parse(S0); runOps(sol.flatMap(s => s.ops || []), false); const r = T.goal ? T.goal(G) : { ok: true }; S = JSON.parse(S0); return r; }; /* ตรวจว่าเฉลยผ่าน goal (tests) */
  wrap.reveal = () => { if (done) return; S = JSON.parse(S0); hist = []; runOps(sol.flatMap(s => s.ops || []), false); done = true; (T.marks || []).forEach(m => G.ptName(m.p, m.name)); finish(); req(); say2('ดูเฉลย: ' + (T.revealMsg || 'ทำตามขั้นตอนนี้')); flag('rev', `<b>ดูเฉลย</b> — ${T.title || ''}`); };
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

const mgPick = a => a[Math.floor(Math.random() * a.length)];
