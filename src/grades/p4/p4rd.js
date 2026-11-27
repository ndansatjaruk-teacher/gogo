/* =========================================================
   ป.4 บทที่ 9 ทะเลทรายสี่เหลี่ยม — หน้าสอนเรียงใหม่ (v251 · ผู้ใช้ขอ) · prefix r4d
   "สอนให้เห็นภาพก่อน อธิบายทีละหน้า หนึ่งหน้าหนึ่งประเด็น มีตัวอย่างให้ทำของแต่ละประเด็นเหมือนโจทย์ในเกม
    ตัวอย่างทีละขั้นไม่อธิบายด้วยตัวอักษร ทำให้ดูเหมือนคนทำจริง แล้วอธิบายแทรกข้าง ๆ"
   แต่ละประเด็น: ① ดูภาพ (r4vSee 1–2 รูปใหญ่ แตะแล้วรูปเปลี่ยน) → (บางประเด็น) ลากปรับเอง (ฉาก tgScene ใน p4rm.js)
                 → ② ทำให้ดู (r4dDo: ดินสอวาดบนรูป เขียนบนกระดาษทด คำอธิบายสั้น ๆ โผล่ข้าง ๆ) → ③ ลองทำ (ข้อจากเกมของด่านนี้ r4dTry)
   วางหลัง p4rm.js ใน order.txt (ใช้ R4V_SEE ฉาก r4v* และ R4V_GAME)
   ========================================================= */
const R4D_PEN = '<svg viewBox="0 0 40 40" aria-hidden="true"><g transform="rotate(40 20 20)"><rect x="16.5" y="1" width="9" height="27" rx="1.6" fill="#FFC24C" stroke="#2B2550" stroke-width="1.6"/><rect x="16.5" y="1" width="9" height="5.5" rx="1.4" fill="#F49AB5" stroke="#2B2550" stroke-width="1.6"/><path d="M21 6.5 V28" stroke="#E9A93A" stroke-width="1.3"/><path d="M16.5 28 L21 37 L25.5 28 Z" fill="#FBE0BE" stroke="#2B2550" stroke-width="1.6" stroke-linejoin="round"/><path d="M19.6 34.2 L21 37 L22.4 34.2 Z" fill="#2B2550"/></g></svg>';
const r4dRM = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } };
const r4dTxt = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/* worked example done like a person (no paragraphs): each step = { ink: svg drawn on the figure, w: line written on the scratch paper,
   wa: true → the line continues the previous line, n: short note beside it (or a bubble on the figure when the step writes nothing), ans: circle this line }
   o = { W, H, fig (svg inside viewBox 0 0 W H; a [data-grp] group in the ink pops in as one piece, e.g. a protractor), q: the problem (top of the paper), steps, fin, say } · step.off: selectors of figure parts that fade away (e.g. the “?”) · step.tmp: this ink goes away at the next step · o.top: svg kept above the ink (labels) · o.dense: tighter paper lines (long column sums) */
function r4dDo(o) {
  const W = o.W || 360, H = o.H || 240, S = o.steps, n = S.length, rm = r4dRM();
  window.__lastWalk = S.map((s, i) => [`${i + 1}`, r4dTxt(s.n || s.w)]);
  const root = h('div', { class: 'r4d' + (o.dense ? ' dense' : '') }), fw = h('div', { class: 'r4d-fw' }), paper = h('div', { class: 'r4d-pap' }), lines = h('div', { class: 'r4d-lns' });
  fw.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="r4d-svg" aria-hidden="true">${o.fig}<g class="r4d-lay"></g>${o.top || ''}</svg>`;
  if (H / W > .7) fw.style.width = `min(${Math.round(Math.min(560, 400 * W / H))}px, 52%)`; /* v258: รูปสูง (หารยาว) — จำกัดความสูงไม่ให้ล้นจอ */
  const svg = fw.firstChild, lay = svg.querySelector('.r4d-lay'), penF = h('div', { class: 'r4d-pen', html: R4D_PEN }), penP = h('div', { class: 'r4d-pen', html: R4D_PEN }), bub = h('div', { class: 'r4d-bub' });
  fw.append(penF, bub); if (o.q) paper.append(h('div', { class: 'r4d-q', html: o.q })); paper.append(lines, penP);
  const out = fNote2(), cnt = h('span', { class: 'r4d-k' }, `1/${n}`);
  let k = 0, live = [], tm = null, queue = [], fast = false, pF = [W * .92, H * .9], line = null;
  const A = (el, kf, op) => { if (!el.animate) return null; const a = el.animate(kf, { fill: 'both', ...op }); if (fast || rm) a.finish(); else live.push(a); return a; };
  const run = () => { tm = null; while (queue.length) { const f = queue.shift(), d = f() || 0; if (!fast && !rm && d > 0) { tm = setTimeout(run, d); return; } } };
  const ff = () => { fast = true; clearTimeout(tm); tm = null; live.forEach(a => { try { a.finish(); } catch (_) { } }); live = []; run(); fast = false; };
  const pct = ([x, y]) => ({ left: `${(x / W * 100).toFixed(2)}%`, top: `${(y / H * 100).toFixed(2)}%` });
  const show = (p, on) => p.classList.toggle('on', on);
  /* draw one step's ink: lines are drawn by the pencil, filled shapes pop in one by one, writing appears where the pencil goes */
  const ink = s => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'r4d-ink'); g.innerHTML = s.ink; lay.append(g);
    const els = [...g.querySelectorAll('path, line, polyline, polygon, rect, circle, ellipse, text, [data-grp]')].filter(e => !e.closest('defs, pattern') && !(e.parentElement && e.parentElement.closest('[data-grp]'))); let t = 160; const kf = [{ ...pct(pF), offset: 0, t: 0 }];
    const pops = els.filter(e => e.tagName !== 'text' && (e.hasAttribute('data-pop') || !(e.getAttribute('stroke') && (e.getAttribute('fill') || 'none') === 'none' && !e.getAttribute('stroke-dasharray')))).length, popD = Math.max(45, Math.min(130, 1500 / Math.max(1, pops)));
    els.forEach(e => { let bb = null; try { bb = e.getBBox(); } catch (_) { } const tag = e.tagName.toLowerCase(), st = e.getAttribute('stroke'), fl = e.getAttribute('fill') || (tag === 'text' ? '' : 'none'), dash = e.getAttribute('stroke-dasharray');
      if (tag === 'text') { const d = Math.min(700, 170 + 45 * (e.textContent || '').length); A(e, [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }], { duration: d, delay: t });
        if (bb) { kf.push({ ...pct([bb.x, bb.y + bb.height * .9]), t }); kf.push({ ...pct([bb.x + bb.width, bb.y + bb.height * .9]), t: t + d }); } t += d; return; }
      if (st && st !== 'none' && fl === 'none' && !dash && !e.hasAttribute('data-pop') && e.getTotalLength) { let L = 0; try { L = e.getTotalLength(); } catch (_) { }
        if (L > 1) { const d = Math.max(200, Math.min(900, L * 2.4)); e.style.strokeDasharray = `${L} ${L + 2}`; A(e, [{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: d, delay: t, easing: 'ease-in-out' });
          for (let j = 0; j <= 4; j++) { let q = null; try { q = e.getPointAtLength(L * j / 4); } catch (_) { } if (q) kf.push({ ...pct([q.x, q.y]), t: t + d * j / 4 }); } t += d; return; } }
      const d = tag === 'path' && dash ? 420 : popD, op = +(e.getAttribute('opacity') || 1); A(e, [{ opacity: 0 }, { opacity: op }], { duration: Math.max(160, d * 1.6), delay: t }); if (bb) kf.push({ ...pct([bb.x + bb.width / 2, bb.y + bb.height / 2]), t: t + d / 2 }); t += d; });
    const last = kf[kf.length - 1]; if (kf.length > 1) { pF = [parseFloat(last.left) / 100 * W, parseFloat(last.top) / 100 * H]; show(penF, true); A(penF, kf.map(f => ({ left: f.left, top: f.top, offset: Math.min(1, f.t / (t || 1)) })), { duration: t, easing: 'linear' }); }
    return t + 120; };
  const write = s => { if (!s.wa || !line) { line = h('div', { class: 'r4d-ln' }, h('span', { class: 'r4d-w' }), h('span', { class: 'r4d-nt' })); lines.append(line); }
    const sp = h('span', { class: 'r4d-wp', html: (s.wa ? ' ' : '') + s.w }); line.firstChild.append(sp); show(penF, false);
    const off = el => { let x = 0, y = 0; for (let e = el; e && e !== paper; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return [x, y]; }, [x0, y0] = off(sp), d = Math.max(380, Math.min(1500, 260 + 55 * r4dTxt(s.w).length)), y = y0 + sp.offsetHeight * .86;
    A(sp, [{ clipPath: 'inset(-8px 100% -8px 0)' }, { clipPath: 'inset(-8px 0 -8px 0)' }], { duration: d, easing: 'linear' }); show(penP, true);
    A(penP, [{ left: `${x0}px`, top: `${y}px` }, { left: `${x0 + sp.offsetWidth}px`, top: `${y}px` }], { duration: d, easing: 'linear' }); sfx.tap(); return d + 120; };
  const note = s => { if (s.w) { const nt = line.lastChild; nt.innerHTML = s.n; nt.classList.add('on'); A(nt, [{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 320 }); }
    else { const p = s.at || pF, x = Math.max(.2, Math.min(.8, p[0] / W)), lo = p[1] / H < .3; bub.innerHTML = s.n; bub.className = 'r4d-bub on' + (lo ? ' lo' : ''); Object.assign(bub.style, { left: `${x * 100}%`, top: `${p[1] / H * 100}%` }); A(bub, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 }); }
    if (s.ans && line) { const r = h('span', { class: 'r4d-ring' }); line.firstChild.append(r); const w = r.offsetWidth || 200, hh = r.offsetHeight || 50, P = (a, b) => `${a4n(w * a)} ${a4n(hh * b)}`;
      r.innerHTML = `<svg viewBox="0 0 ${a4n(w)} ${a4n(hh)}"><path d="M${P(.07, .62)} C${P(.02, .12)} ${P(.62, .02)} ${P(.94, .24)} C${P(1.01, .46)} ${P(.96, .9)} ${P(.6, .94)} C${P(.3, .99)} ${P(.03, .86)} ${P(.05, .42)}" fill="none" stroke="#E5487A" stroke-width="2.6" stroke-linecap="round"/></svg>`;
      const pth = r.querySelector('path'); let L = 300; try { L = pth.getTotalLength(); } catch (_) { } pth.style.strokeDasharray = `${L} ${L + 2}`; A(pth, [{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 560, easing: 'ease-out' }); }
    sfx.pop(k); if (!fast) say(r4dTxt(s.n || s.w), true); return 650; };
  const end = () => { show(penF, false); show(penP, false); btn.remove(); out.innerHTML = o.fin || ''; sfx.ok(); if (o.say) say(o.say, true); teachDone(root); return 0; };
  const play = () => { const s = S[k]; k++; cnt.textContent = `${Math.min(k + 1, n)}/${n}`; [...lay.querySelectorAll('.r4d-tmp')].forEach(e => e.remove()); if (s.w || s.ink) { if (bub.getAnimations) bub.getAnimations().forEach(a => a.cancel()); bub.classList.remove('on'); }
    if (s.off) queue.push(() => { s.off.forEach(sel => svg.querySelectorAll(sel).forEach(e => A(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 260 }))); return 200; });
    if (s.ink) queue.push(() => ink(s)); if (s.w) queue.push(() => write(s)); if (s.n) queue.push(() => note(s)); if (s.tmp) queue.push(() => { const g = lay.lastElementChild; if (g) g.classList.add('r4d-tmp'); return 0; });
    if (k >= n) queue.push(end); run(); };
  const btn = h('button', { class: 'btn info ia r4d-nx', onclick: e => { e.stopPropagation(); if (queue.length || tm) { ff(); return; } if (k < n) play(); } }, icon('pencil'), h('span', null, 'ขั้นต่อไป'), cnt);
  root.append(h('div', { class: 'r4d-row' }, fw, paper), h('div', { class: 'r4d-bar' }, btn, out)); out.innerHTML = o.start || 'กด <b>ขั้นต่อไป</b> แล้วดูดินสอทำให้ดูทีละขั้น';
  return root;
}

/* ---------- drawing pieces for the worked examples (figure coordinates) ---------- */
const r4dRA = (P, i, col = R4VC.p, k = 13) => { const n = P.length, p = P[i], a = P[(i + n - 1) % n], b = P[(i + 1) % n], la = r4len(a, p), lb = r4len(b, p), ua = [(a[0] - p[0]) / la * k, (a[1] - p[1]) / la * k], ub = [(b[0] - p[0]) / lb * k, (b[1] - p[1]) / lb * k];
  return `<path d="M${a4n(p[0] + ua[0])} ${a4n(p[1] + ua[1])} L${a4n(p[0] + ua[0] + ub[0])} ${a4n(p[1] + ua[1] + ub[1])} L${a4n(p[0] + ub[0])} ${a4n(p[1] + ub[1])}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linejoin="round"/>`; };
const r4dSide = (P, i, col, sw = 7) => { const a = P[i], b = P[(i + 1) % P.length]; return `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(b[0])} ${a4n(b[1])}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" opacity=".85"/>`; };
const r4dOut = (P, i, d = 20, f = .5) => { const n = P.length, a = P[i], b = P[(i + 1) % n], m = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], L = r4len(a, b) || 1; let v = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]; if (r4pip([m[0] + v[0] * 4, m[1] + v[1] * 4], P)) v = [-v[0], -v[1]]; return [m[0] + v[0] * d, m[1] + v[1] * d + 6]; };
const r4dLab = (P, i, t, col = R4VC.ink, d = 20, cls = 'r4d-tx', f = .5) => { const q = r4dOut(P, i, d, f); return r4vT(q[0], q[1], t, col, cls); };
const r4dTick = (P, i, col = R4VC.p, nT = 1) => { const a = P[i], b = P[(i + 1) % P.length], m = r4mid(a, b), L = r4len(a, b) || 1, u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], v = [-u[1], u[0]]; let s = '';
  for (let j = 0; j < nT; j++) { const c = [m[0] + u[0] * (j - (nT - 1) / 2) * 7, m[1] + u[1] * (j - (nT - 1) / 2) * 7]; s += `<path d="M${a4n(c[0] - v[0] * 8)} ${a4n(c[1] - v[1] * 8)} L${a4n(c[0] + v[0] * 8)} ${a4n(c[1] + v[1] * 8)}" fill="none" stroke="${col}" stroke-width="2.8" stroke-linecap="round"/>`; } return s; };
const r4dTx = (x, y, t, col = R4VC.ink, cls = 'r4d-tx', anc = 'middle') => r4vT(x, y, t, col, cls, anc);
const r4dCell = (x, y, g, col) => `<rect x="${a4n(x + 1.5)}" y="${a4n(y + 1.5)}" width="${a4n(g - 3)}" height="${a4n(g - 3)}" rx="3" fill="${col}"/>`;
const r4dNums = (cells, x0, y0, g, col = R4VC.ink, start = 1) => cells.map(([x, y], i) => r4dTx(x0 + x * g + g / 2, y0 + y * g + g / 2 + 6, String(start + i), col, 'r4d-sm')).join('');
const r4dDash = (a, b, col = R4VC.p, sw = 3) => `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(b[0])} ${a4n(b[1])}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-dasharray="7 6" stroke-linecap="round"/>`;
const r4dArr = (a, b, col = R4VC.p) => { const L = r4len(a, b) || 1, u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], v = [-u[1], u[0]], t1 = [b[0] - u[0] * 9 + v[0] * 5, b[1] - u[1] * 9 + v[1] * 5], t2 = [b[0] - u[0] * 9 - v[0] * 5, b[1] - u[1] * 9 - v[1] * 5];
  return `<path d="M${a4n(a[0])} ${a4n(a[1])} L${a4n(b[0])} ${a4n(b[1])} M${a4n(t1[0])} ${a4n(t1[1])} L${a4n(b[0])} ${a4n(b[1])} L${a4n(t2[0])} ${a4n(t2[1])}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`; };

/* ---------- pages ---------- */
/* ① look first: 1–2 big pictures from R4V_SEE[id] (one idea per page) */
const r4dSee = (id, idx, title, cap) => sbMark(title, cap, () => { const all = R4V_SEE[id](); return idx.map(i => all[i]); }, T(`<b>ดูภาพ</b> — ${title}`, `ดูภาพ ${r4dTxt(title)}`, el => { const all = R4V_SEE[id](), L = idx.map(i => all[i]);
  el.append(r4vSee(cap, L, L.map(p => p.s.replace(/<br>/g, r4vSep)).join(r4vSep))); }));
/* ② watch it done */
const r4dShow = (title, o) => T(`<b>ทำให้ดู</b> — ${title}`, `ทำให้ดู ${r4dTxt(title)}`, el => el.append(r4dDo(o)));
/* hands-on scene page (scenes from p4rm.js) */
const r4dPlay = (title, say, mk) => T(`<b>ลองปรับเอง</b> — ${title}`, say, el => el.append(mk()));
/* ③ try one: an item of this lesson's own game (same kind of question as in the game), kept out of the game afterwards */
const r4dTry = (id, kinds, title) => ({ t: `<b>ลองทำ</b> — ${title}`, s: `ลองทำ ${r4dTxt(title)}`, prac: 1, r4try: kinds,
  v(el) { const L = LESSONS.find(x => x.id === id); L.__prac = L.__prac || new Set(); let q = null;
    for (let t = 0; t < 6 && !q; t++) { let qs = []; __EASY = true; try { qs = R4V_GAME[id](); } catch (_) { qs = []; } finally { __EASY = false; }
      for (const kd of kinds) { q = qs.find(x => x && x.mount && x.__kind === 'r4v' + kd && !L.__prac.has(qSig(x))); if (q) break; } }
    if (!q) { el.append(fNote('ทบทวนตัวอย่างอีกครั้ง แล้วไปต่อกัน')); return; } L.__prac.add(qSig(q)); qAtoms(q).forEach(a => L.__prac.add(a)); promptOnce(q);
    const sim = qSim(q, 'เก่งมาก! แบบเดียวกับในเกมเลย', { bub: window.__teachBub }), pr = h('div', { class: 'colstack prac prac-game' }, sim); pr.classList.toggle('qs-figp', !!sim.querySelector(':scope > .qs-r')); el.append(pr); } });

/* corner check: the pencil circles the right-angle mark at each corner, then ticks it */
const r4dChk = (P, col = R4VC.g) => P.map((p, i) => { const n = P.length, a = P[(i + n - 1) % n], b = P[(i + 1) % n], la = r4len(a, p), lb = r4len(b, p), c = [p[0] + ((a[0] - p[0]) / la + (b[0] - p[0]) / lb) * 9, p[1] + ((a[1] - p[1]) / la + (b[1] - p[1]) / lb) * 9];
  return `<circle cx="${a4n(c[0])}" cy="${a4n(c[1])}" r="15" fill="none" stroke="${col}" stroke-width="2.6"/>`; }).join('');
const r4dQ = (x, y, t = '?', cls = 'r4d-q0') => `<g class="${cls}">${r4dTx(x, y, t, R4VC.p, 'r4d-big')}</g>`;

/* =========================================================
   the lessons: one idea per page → watch it done → try one like in the game
   ========================================================= */
const R4D_TEACH = {
  /* ด่าน 1 ชนิดของรูปสี่เหลี่ยมมุมฉาก: ผืนผ้า → จัตุรัส → ไม่ใช่ */
  1481: (() => { const R = r4vR(70, 62, 220, 104), Kq = [[180, 42], [260, 122], [180, 202], [100, 122]];
    return [
      r4dSee(1481, [0], 'รูปสี่เหลี่ยมผืนผ้า', '<b>แตะรูป</b> — ดูมุมและด้านของรูปสี่เหลี่ยมผืนผ้า'),
      r4dShow('ด้านที่ไม่ได้บอกยาวเท่าไร', { fig: r4PolyS(R, { fill: R4VC.sand, names: 'ABCD' }) + r4dLab(R, 0, '9 ซม.') + r4dLab(R, 1, '4 ซม.', R4VC.ink, 34) + r4dQ(180, 196) + r4dQ(36, 121),
        q: 'ABCD เป็นรูปสี่เหลี่ยมผืนผ้า ด้าน CD และ DA ยาวเท่าไร',
        steps: [{ ink: r4dChk(R), n: 'มุมฉากครบ 4 มุม ✓', at: [180, 112] },
          { off: ['.r4d-q0'], ink: r4dSide(R, 0, R4VC.o) + r4dSide(R, 2, R4VC.o) + r4dLab(R, 2, '9 ซม.', R4VC.o), w: 'CD = AB = 9 ซม.', n: 'ด้านตรงข้ามยาวเท่ากัน' },
          { ink: r4dSide(R, 1, R4VC.b) + r4dSide(R, 3, R4VC.b) + r4dLab(R, 3, '4 ซม.', R4VC.b, 34), w: 'DA = BC = 4 ซม.', n: 'อีกคู่หนึ่ง' },
          { w: 'ด้าน 9, 4, 9, 4', n: 'ครบทั้ง 4 ด้าน', ans: 1 }],
        fin: 'ผืนผ้า: <b>ด้านตรงข้ามยาวเท่ากัน</b>', say: 'รูปสี่เหลี่ยมผืนผ้า ด้านตรงข้ามยาวเท่ากัน' }),
      r4dTry(1481, ['1f'], 'ด้านที่ไม่ได้บอก'),
      r4dSee(1481, [1, 2], 'รูปสี่เหลี่ยมจัตุรัส', '<b>แตะรูป</b> — จัตุรัสวางตรงหรือวางเอียงก็ได้'),
      r4dPlay('ลากมุม C', 'ลากมุมซี เปลี่ยนขนาดรูปสี่เหลี่ยม แล้วดูชนิดของรูป', () => r4vBox({ w0: 3, h0: 2,
        cap: '<b>ลากจุดสีชมพู</b>ที่มุม C — รูปมีมุมฉากครบ 4 มุมเสมอ ดูว่าด้านยาวเท่าไร', missions: [['ผืนผ้า ยาว 6 กว้าง 2', s => s.w === 6 && s.h === 2], ['จัตุรัส ด้านละ 4', s => s.w === 4 && s.h === 4], ['ผืนผ้าที่ด้านตั้งยาวกว่าด้านนอน', s => s.h > s.w]],
        body: (s, G) => r4PolyS(G.P, { fill: s.w === s.h ? '#BFE3F7' : '#FFE7A8', names: 'ABCD', labs: [s.w, s.h, s.w, s.h].map(String) }),
        info: s => `มุมฉาก <b>4 มุม</b>${r4vSep}` + (s.w === s.h ? `ด้านยาว ${s.w} เท่ากันทั้ง 4 ด้าน → <b>รูปสี่เหลี่ยมจัตุรัส</b>` : `ด้านตรงข้ามยาวเท่ากัน → <b>รูปสี่เหลี่ยมผืนผ้า</b>`) })),
      r4dShow('รูปที่วางเอียงเป็นรูปชนิดใด', { fig: r4PolyS(Kq, { fill: R4VC.sky, names: 'KLMN' }) + Kq.map((_, i) => r4dLab(Kq, i, '5 ซม.', R4VC.ink, 22)).join(''),
        q: 'รูป KLMN เป็นรูปสี่เหลี่ยมชนิดใด',
        steps: [{ ink: r4dChk(Kq), w: 'มุมฉาก 4 มุม ✓', n: 'ตรวจมุมก่อน' },
          { ink: Kq.map((_, i) => r4dTick(Kq, i, R4VC.g)).join(''), w: 'ด้าน 5, 5, 5, 5 ✓', n: 'ยาวเท่ากันทุกด้าน' },
          { w: 'KLMN เป็นจัตุรัส', n: 'วางเอียงก็ยังเป็นจัตุรัส', ans: 1 }],
        fin: 'มุมฉาก 4 มุม + ทุกด้านเท่ากัน → <b>รูปสี่เหลี่ยมจัตุรัส</b>', say: 'มุมฉากสี่มุม และทุกด้านยาวเท่ากัน เป็นรูปสี่เหลี่ยมจัตุรัส' }),
      r4dTry(1481, ['1c'], 'เป็นรูปชนิดใด'),
      r4dSee(1481, [3], 'ไม่ใช่รูปสี่เหลี่ยมมุมฉาก', '<b>แตะรูป</b> — ด้านตรงข้ามเท่ากัน แต่มุมล่ะ?'),
      r4dTry(1481, ['1d', '1e'], 'ใช่รูปสี่เหลี่ยมมุมฉากไหม')]; })(),

  /* ด่าน 2 เส้นทแยงมุม: คืออะไร → ยาวเท่ากัน แบ่งครึ่งกัน (จัตุรัสตั้งฉาก) */
  1482: (() => { const R = r4vR(80, 58, 200, 112), [A, B, C, D] = R, Q = r4vR(70, 52, 220, 124), [P1, Q1, R1, S1] = Q, O = [180, 114];
    return [
      r4dSee(1482, [0, 1], 'เส้นทแยงมุม กับ ด้าน', '<b>แตะรูป</b> — เส้นทแยงมุมต่างจากด้านอย่างไร'),
      r4dShow('วาดเส้นทแยงมุม', { fig: r4PolyS(R, { fill: R4VC.sand, names: 'ABCD' }), q: 'วาดเส้นทแยงมุมของรูป ABCD ให้ครบ',
        steps: [{ ink: r4vDot(A, R4VC.b, 7) + r4vDot(C, R4VC.b, 7) + r4vLn(A, C, R4VC.b, 4.5), w: 'AC', n: 'A กับ C ไม่อยู่ติดกัน' },
          { ink: r4vDot(B, R4VC.g, 7) + r4vDot(D, R4VC.g, 7) + r4vLn(B, D, R4VC.g, 4.5), w: 'BD', n: 'B กับ D ไม่อยู่ติดกัน' },
          { ink: r4dSide(R, 0, R4VC.p, 5) + r4dTx(180, 40, '✗', R4VC.p, 'r4d-big'), w: 'AB ✗', n: 'A กับ B อยู่ติดกัน → เป็นด้าน', tmp: 1 },
          { w: 'มีเส้นทแยงมุม 2 เส้น', n: 'AC และ BD', ans: 1 }],
        fin: `เส้นทแยงมุม = เชื่อมจุดยอดที่<b>ไม่อยู่ติดกัน</b>${r4vSep}รูปสี่เหลี่ยมมี <b>2 เส้น</b>`, say: 'เส้นทแยงมุมเชื่อมจุดยอดที่ไม่อยู่ติดกัน รูปสี่เหลี่ยมมีสองเส้น' }),
      r4dTry(1482, ['2b', '2c'], 'เส้นทแยงมุม'),
      r4dSee(1482, [2, 3], 'สมบัติของเส้นทแยงมุม', '<b>แตะรูป</b> — เส้นทแยงมุมของผืนผ้าและจัตุรัส'),
      r4dPlay('ลากมุม C ดูเส้นทแยงมุม', 'ลากมุมซี ดูเส้นทแยงมุมเมื่อรูปเปลี่ยนขนาด', () => r4vBox({ w0: 6, h0: 3,
        cap: '<b>ลากจุดสีชมพู</b>ที่มุม C — ขีดสีชมพูบอกว่าครึ่งเส้นทแยงมุมทั้ง 4 ท่อนยาวเท่ากัน', missions: [['ทำรูปจัตุรัส ให้เส้นทแยงมุมตั้งฉากกัน', s => s.w === s.h], ['ทำผืนผ้ายาว 8 กว้าง 2', s => s.w === 8 && s.h === 2], ['ทำผืนผ้ายาว 3 กว้าง 5', s => s.w === 3 && s.h === 5]],
        body: r4vDiagBody, info: s => `AC (สีฟ้า) ยาวเท่ากับ BD (สีเขียว)${r4vSep}จุด O แบ่งครึ่ง: AO = OC = BO = OD` + (s.w === s.h ? `${r4vSep}จัตุรัส: เส้นทแยงมุม<b>ตั้งฉากกัน</b>` : `${r4vSep}ผืนผ้า: ตัดกันแต่<b>ไม่ตั้งฉาก</b>`) })),
      r4dShow('เส้นทแยงมุมยาวเท่าไร', { fig: r4PolyS(Q, { fill: R4VC.sand, names: 'PQRS' }) + r4vLn(P1, R1, '#B7AED3', 2, '5 5') + r4vLn(Q1, S1, '#B7AED3', 2, '5 5') + r4vDot(O, R4VC.p, 5) + r4dTx(180, 146, 'O', '#3A2F6B'),
        q: 'PQRS เป็นรูปสี่เหลี่ยมผืนผ้า PR ยาว 18 ซม. QS และ PO ยาวเท่าไร',
        steps: [{ ink: r4vLn(P1, R1, R4VC.b, 5) + r4dTx(180, 80, '18 ซม.', R4VC.b), w: 'PR = 18 ซม.', n: 'โจทย์บอก' },
          { ink: r4vLn(Q1, S1, R4VC.g, 5), w: 'QS = PR = 18 ซม.', n: 'ยาวเท่ากัน' },
          { ink: [[P1, O], [O, R1], [Q1, O], [O, S1]].map(L => r4dTick(L, 0, R4VC.p)).join(''), w: 'PO = 18 ÷ 2 = 9 ซม.', n: 'O แบ่งครึ่ง', ans: 1 }],
        fin: `เส้นทแยงมุม<b>ยาวเท่ากัน</b>${r4vSep}และ<b>แบ่งครึ่ง</b>ซึ่งกันและกัน`, say: 'เส้นทแยงมุมยาวเท่ากัน และแบ่งครึ่งซึ่งกันและกัน' }),
      r4dTry(1482, ['2e', '2g'], 'ความยาวเส้นทแยงมุม'),
      r4dTry(1482, ['2i'], 'จัตุรัส: มุมที่จุด O')]; })(),

  /* ด่าน 3 การสร้าง: ดูขั้นตอน → ทำให้ดูผืนผ้า → สร้างเอง → ทำให้ดูจัตุรัส → สร้างเอง */
  1483: (() => { const cm = 40, ticks = (x0, y0, n, vert) => `<path class="r4d-ruler" data-pop="1" d="${Array.from({ length: n + 1 }, (_, i) => vert ? `M${x0} ${y0 - i * cm} h9` : `M${x0 + i * cm} ${y0} v9`).join(' ')}" fill="none" stroke="${R4VC.wood}" stroke-width="1.6"/>`;
    const make = (x0, y0, w, hh, nm) => { const [a, b, c, d] = [[x0, y0], [x0 + w * cm, y0], [x0 + w * cm, y0 - hh * cm], [x0, y0 - hh * cm]];
      return { fig: r4gridS(20, y0 - Math.floor(y0 / cm) * cm, 8, Math.floor(y0 / cm) + 1, cm, '#EEE9F7'),
        steps: [{ ink: `<rect class="r4d-ruler" x="${x0 - 16}" y="${y0 + 8}" width="${w * cm + 32}" height="24" rx="4" fill="#FFF3C4" stroke="${R4VC.wood}" stroke-width="1.6"/>` + ticks(x0, y0 + 8, w) + r4vLn(a, b, R4VC.ink, 3.5) + r4vDot(a, R4VC.ink, 4.5) + r4vDot(b, R4VC.ink, 4.5) + r4dTx(a[0] - 14, a[1] - 6, nm[0], '#3A2F6B') + r4dTx(b[0] + 14, b[1] - 6, nm[1], '#3A2F6B') + r4dTx((a[0] + b[0]) / 2, y0 - 10, `${w} ซม.`),
            w: `${nm[0]}${nm[1]} = ${w} ซม.`, n: 'วางไม้บรรทัด ลากด้านแรก' },
          { off: ['.r4d-ruler'], ink: r4dDash(a, [a[0], c[1] - 18], R4VC.b, 2.2) + r4dDash(b, [b[0], c[1] - 18], R4VC.b, 2.2) + `<path d="M${a[0] + 14} ${a[1]} V${a[1] - 14} H${a[0]} M${b[0] - 14} ${b[1]} V${b[1] - 14} H${b[0]}" fill="none" stroke="${R4VC.p}" stroke-width="2.6"/>` + r4dTx(a[0] + 34, a[1] - 22, '90°', R4VC.p) + r4dTx(b[0] - 34, b[1] - 22, '90°', R4VC.p),
            w: `มุม ${nm[0]} = มุม ${nm[1]} = 90°`, n: 'สร้างมุมฉากที่ปลายทั้งสอง' },
          { ink: `<rect class="r4d-ruler" x="${a[0] - 34}" y="${d[1] - 12}" width="24" height="${hh * cm + 24}" rx="4" fill="#FFF3C4" stroke="${R4VC.wood}" stroke-width="1.6"/>` + ticks(a[0] - 19, a[1], hh, 1) + r4vDot(d, R4VC.g, 6) + r4vDot(c, R4VC.g, 6) + r4dTx(a[0] + 36, (a[1] + d[1]) / 2 + 6, `${hh} ซม.`, R4VC.g) + r4dTx(b[0] - 36, (a[1] + d[1]) / 2 + 6, `${hh} ซม.`, R4VC.g),
            w: `${nm[0]}${nm[3]} = ${nm[1]}${nm[2]} = ${hh} ซม.`, n: w === hh ? 'จัตุรัส: ยาวเท่าด้านแรก' : 'วัดด้านที่ตั้งฉาก' },
          { off: ['.r4d-ruler'], ink: `<rect data-pop="1" x="${d[0]}" y="${d[1]}" width="${w * cm}" height="${hh * cm}" fill="${w === hh ? R4VC.sky : R4VC.sand}" fill-opacity=".55"/>` + r4vLn(d, c, R4VC.ink, 3.5) + r4vLn(a, d, R4VC.ink, 3.5) + r4vLn(b, c, R4VC.ink, 3.5) + r4dTx(d[0] - 14, d[1] - 4, nm[3], '#3A2F6B') + r4dTx(c[0] + 14, c[1] - 4, nm[2], '#3A2F6B'),
            w: `ได้ ${nm}`, n: `ลากเชื่อม ${nm[3]} กับ ${nm[2]}`, ans: 1 }] }; };
    const M1 = make(60, 190, 6, 3, 'ABCD'), M2 = make(100, 200, 4, 4, 'PQRS');
    return [
      r4dSee(1483, [0, 1, 2, 3], 'ขั้นตอนการสร้าง', '<b>แตะรูปทีละขั้น</b> — สร้างรูปสี่เหลี่ยมผืนผ้ากว้าง 3 ซม. ยาว 6 ซม.'),
      r4dShow('สร้างรูปสี่เหลี่ยมผืนผ้า', { ...M1, q: 'สร้างรูปสี่เหลี่ยมผืนผ้า ABCD กว้าง 3 ซม. ยาว 6 ซม.', fin: 'ด้านแรก → มุมฉาก → วัดด้านที่ตั้งฉาก → ลากเชื่อม', say: 'ลากด้านแรก สร้างมุมฉาก วัดด้านที่ตั้งฉาก แล้วลากเชื่อม' }),
      r4dTry(1483, ['3c', '3g'], 'สร้างรูปสี่เหลี่ยมผืนผ้า'),
      r4dShow('สร้างรูปสี่เหลี่ยมจัตุรัส', { ...M2, q: 'สร้างรูปสี่เหลี่ยมจัตุรัส PQRS ยาวด้านละ 4 ซม.', fin: 'จัตุรัส: วัด <b>4 ซม. ทุกด้าน</b> เท่าด้านแรก', say: 'จัตุรัสวัดสี่เซนติเมตรทุกด้าน' }),
      r4dTry(1483, ['3b', '3e'], 'สร้างรูปสี่เหลี่ยมจัตุรัส'),
      r4dTry(1483, ['3f'], 'เรียงขั้นตอนการสร้าง')]; })(),

  /* ด่าน 4 ความยาวรอบรูป: เดินรอบ → สูตรผืนผ้า → จัตุรัส */
  1484: (() => { const R = r4vR(70, 62, 220, 110), F = r4vR(80, 70, 200, 96), Sq = r4vR(115, 45, 150, 150), lab4 = (P, t) => P.map((_, i) => r4dLab(P, i, t[i], R4VC.ink, i % 2 ? 32 : 20)).join('');
    return [
      r4dSee(1484, [0], 'ความยาวรอบรูป', '<b>แตะรูป</b> — เดินรอบรูป 1 รอบ'),
      r4dPlay('อูฐเดินรอบแปลง', 'ลากอูฐเดินรอบแปลง ระยะที่เดินครบรอบคือความยาวรอบรูป', () => r4vWalk([[0, 0], [7, 0], [7, 4], [0, 4]], 'ม.',
        [['เดินถึงมุม B', s => s.d === 7], ['เดินครึ่งรอบ ถึงมุม C', s => s.d === 11], ['เดินครบรอบ กลับถึงมุม A', s => s.d === 22]], '<b>ลากอูฐ</b>ไปตามด้านของแปลง ทีละด้าน')),
      r4dShow('เดินรอบแปลง บวกทุกด้าน', { fig: r4PolyS(R, { fill: R4VC.sand, names: 'ABCD' }) + lab4(R, ['9 ม.', '4 ม.', '9 ม.', '4 ม.']), q: 'แปลงผักรูปสี่เหลี่ยมผืนผ้า มีความยาวรอบรูปกี่เมตร',
        steps: [{ ink: r4dSide(R, 0, R4VC.o), w: '9', n: 'เริ่มที่ A เดินไป B' }, { ink: r4dSide(R, 1, R4VC.b), w: '+ 4', wa: 1, n: 'B ไป C' }, { ink: r4dSide(R, 2, R4VC.o), w: '+ 9', wa: 1, n: 'C ไป D' },
          { ink: r4dSide(R, 3, R4VC.b), w: '+ 4 = 26', wa: 1, n: 'กลับถึง A ครบรอบ' }, { w: 'รอบรูป 26 ม.', n: 'ระยะรอบ 1 รอบ', ans: 1 }],
        fin: 'ความยาวรอบรูป = <b>ผลบวกของทุกด้าน</b>', say: 'ความยาวรอบรูป คือผลบวกของความยาวทุกด้าน' }),
      r4dTry(1484, ['4a', '4b'], 'เดินรอบรูป'),
      r4dSee(1484, [1], 'สูตรรอบรูปผืนผ้า', '<b>แตะรูป</b> — ยืดด้านทั้ง 4 มาต่อกัน'),
      r4dShow('ใช้สูตร 2 × (กว้าง + ยาว)', { fig: r4PolyS(F, { fill: R4VC.sand }) + r4dLab(F, 0, '12 ซม.') + r4dLab(F, 3, '5 ซม.', R4VC.ink, 32), q: 'รูปสี่เหลี่ยมผืนผ้ากว้าง 5 ซม. ยาว 12 ซม. ยาวรอบรูปเท่าไร',
        steps: [{ ink: r4dSide(F, 0, R4VC.o) + r4dSide(F, 3, R4VC.b), w: '12 + 5 = 17', n: 'ยาว + กว้าง = ครึ่งรอบ' },
          { ink: r4dSide(F, 2, R4VC.o) + r4dSide(F, 1, R4VC.b) + r4dLab(F, 2, '12 ซม.', R4VC.o) + r4dLab(F, 1, '5 ซม.', R4VC.b, 32), w: '2 × 17 = 34', n: 'อีกครึ่งรอบยาวเท่ากัน' },
          { w: 'รอบรูป 34 ซม.', n: '2 × (กว้าง + ยาว)', ans: 1 }],
        fin: 'ผืนผ้า: รอบรูป = <b>2 × (กว้าง + ยาว)</b>', say: 'รอบรูปผืนผ้า เท่ากับ สองคูณกว้างบวกยาว' }),
      r4dTry(1484, ['4c'], 'แปลงที่ใช้รั้วพอดี'),
      r4dSee(1484, [2], 'รอบรูปจัตุรัส', '<b>แตะรูป</b> — ด้านยาวเท่ากันทั้ง 4 ด้าน'),
      r4dShow('จัตุรัสด้านละ 15 ม.', { fig: r4PolyS(Sq, { fill: R4VC.sky }) + r4dLab(Sq, 0, '15 ม.'), q: 'รูปสี่เหลี่ยมจัตุรัสยาวด้านละ 15 ม. ยาวรอบรูปเท่าไร',
        steps: [{ ink: Sq.map((_, i) => r4dTick(Sq, i, R4VC.g)).join('') + [1, 2, 3].map(i => r4dLab(Sq, i, '15', R4VC.g, i % 2 ? 26 : 20)).join(''), w: '15 + 15 + 15 + 15', n: 'ยาวเท่ากัน 4 ด้าน' },
          { w: '4 × 15 = 60', n: 'บวก 4 ครั้ง = คูณ 4' }, { w: 'รอบรูป 60 ม.', n: 'ระวัง: 15 × 15 ไม่ใช่รอบรูป', ans: 1 }],
        fin: 'จัตุรัส: รอบรูป = <b>4 × ด้าน</b>', say: 'รอบรูปจัตุรัส เท่ากับ สี่คูณความยาวด้าน' }),
      r4dTry(1484, ['4e', '4d'], 'รอบรูปจัตุรัส')]; })(),

  /* ด่าน 5 รอบรูปหลายเหลี่ยม: หาด้านที่ไม่บอก → ขั้นบันได → ตัว U */
  1485: (() => { const L = r4vFitU(R4SH.L(9, 7, 4, 3), 0, 0, 360, 240, 44), LP = L.P, St = r4vFitU([[0, 0], [3, 0], [3, 1], [5, 1], [5, 3], [7, 3], [7, 5], [0, 5]], 0, 0, 360, 240, 46), SP = St.P, U = r4vFitU(R4SH.U(8, 5, 2, 3, 3), 0, 0, 360, 240, 46), UP = U.P;
    const cols = [R4VC.o, R4VC.b, R4VC.g, R4VC.p, '#8E6BD1', '#E09A1E'], q3 = r4dOut(LP, 3, 26);
    return [
      r4dSee(1485, [0], 'ด้านที่ไม่ได้บอก', '<b>แตะรูป</b> — หาด้านที่ไม่บอกจากด้านที่ขนานกัน'),
      r4dShow('รอบรูปตัว L', { fig: r4PolyS(LP, { fill: R4VC.sand, rm: false }) + r4dLab(LP, 0, '5 ม.') + r4dLab(LP, 1, '3 ม.', R4VC.ink, 30, 'r4d-tx', .3) + r4dLab(LP, 2, '4 ม.', R4VC.ink, 20, 'r4d-tx', .7) + r4dLab(LP, 4, '9 ม.') + r4dLab(LP, 5, '7 ม.', R4VC.ink, 30) + r4dQ(q3[0] + 4, q3[1]), q: 'รูปนี้มีความยาวรอบรูปกี่เมตร',
        steps: [{ off: ['.r4d-q0'], ink: r4dSide(LP, 5, R4VC.b) + r4dSide(LP, 1, R4VC.o) + r4dSide(LP, 3, R4VC.p) + r4dLab(LP, 3, '4 ม.', R4VC.p, 30), w: '7 − 3 = 4', n: 'ด้านขวา: 3 + ? = 7' },
          { ink: LP.map((_, i) => r4dSide(LP, i, cols[i], 5)).join(''), w: '5 + 3 + 4 + 4 + 9 + 7 = 32', n: 'เดินรอบ บวกครบทุกด้าน' },
          { w: 'รอบรูป 32 ม.', n: 'ตรวจ: 2 × (9 + 7) = 32 ✓', ans: 1 }],
        fin: 'หาด้านที่ไม่บอกก่อน แล้ว<b>บวกทุกด้าน</b>', say: 'หาด้านที่ไม่บอกก่อน แล้วบวกทุกด้าน' }),
      r4dTry(1485, ['5b', '5c'], 'รอบรูปหลายเหลี่ยม'),
      r4dSee(1485, [1], 'รูปขั้นบันได', '<b>แตะรูป</b> — ดันขั้นบันไดออกไป'),
      r4dPlay('ดันขั้นบันได', 'ดันขั้นบันได รอบรูปเปลี่ยนไหม', () => r4vStair()),
      r4dShow('รอบรูปขั้นบันได', { fig: r4PolyS(SP, { fill: R4VC.sand, rm: false }) + r4dLab(SP, 6, '7 ม.') + r4dLab(SP, 7, '5 ม.', R4VC.ink, 30), q: 'รูปขั้นบันไดนี้มีความยาวรอบรูปกี่เมตร',
        steps: [{ ink: r4dDash(St.mp([0, 0]), St.mp([7, 0]), '#9A8FC4', 2.4) + [0, 2, 4].map(i => r4dSide(SP, i, R4VC.o, 6)).join('') + r4dArr(St.mp([4, 1]), St.mp([4, 0.15]), R4VC.o) + r4dArr(St.mp([6, 3]), St.mp([6, 0.15]), R4VC.o), w: 'ด้านนอนรวม = 7', n: 'ดันขึ้นไป ยาวเท่าด้านล่าง' },
          { ink: r4dDash(St.mp([7, 0]), St.mp([7, 5]), '#9A8FC4', 2.4) + [1, 3, 5].map(i => r4dSide(SP, i, R4VC.b, 6)).join('') + r4dArr(St.mp([3, .5]), St.mp([6.85, .5]), R4VC.b) + r4dArr(St.mp([5, 2]), St.mp([6.85, 2]), R4VC.b), w: 'ด้านตั้งรวม = 5', n: 'ดันออกไป ยาวเท่าด้านซ้าย' },
          { w: '2 × (7 + 5) = 24', n: 'เท่าสี่เหลี่ยมที่ล้อมรอบ', ans: 1 }],
        fin: 'ขั้นบันได: รอบรูป<b>เท่ากับ</b>สี่เหลี่ยมที่ล้อมรอบ', say: 'รูปขั้นบันได มีความยาวรอบรูปเท่ากับสี่เหลี่ยมที่ล้อมรอบ' }),
      r4dTry(1485, ['5g', '5d', '5j'], 'รอบรูปขั้นบันได'),
      r4dSee(1485, [2], 'รูปตัว U', '<b>แตะรูป</b> — รูปที่มีร่องเว้าเข้าไป'),
      r4dShow('รอบรูปตัว U', { fig: r4PolyS(UP, { fill: R4VC.sand, rm: false }) + r4dLab(UP, 6, '8 ม.') + r4dLab(UP, 7, '5 ม.', R4VC.ink, 30) + (() => { const m = U.mp([4, 1.5]); return r4dTx(m[0], m[1] + 6, '3 ม.'); })(), q: 'รูปตัว U นี้มีความยาวรอบรูปกี่เมตร',
        steps: [{ ink: r4dDash(U.mp([3, 0]), U.mp([5, 0]), '#9A8FC4', 2.4) + r4dSide(UP, 6, R4VC.o, 5) + r4dSide(UP, 7, R4VC.b, 5), w: '2 × (8 + 5) = 26', n: 'สี่เหลี่ยมที่ล้อมรอบ' },
          { ink: r4dSide(UP, 1, R4VC.p) + r4dSide(UP, 3, R4VC.p), w: '26 + 3 + 3 = 32', n: 'ร่องเว้า: เดินเพิ่ม 2 ด้าน' },
          { w: 'รอบรูป 32 ม.', n: 'มากกว่าสี่เหลี่ยมที่ล้อมรอบ', ans: 1 }],
        fin: 'ร่องเว้า: รอบรูป<b>เพิ่ม</b>ด้านข้างในอีก 2 ด้าน', say: 'รูปที่มีร่องเว้า ต้องบวกด้านข้างในเพิ่มอีกสองด้าน' }),
      r4dTry(1485, ['5h', '5f'], 'รอบรูปตัว U')]; })(),

  /* ด่าน 6 พื้นที่โดยการนับตาราง: นับช่อง → ครึ่งช่อง → รูปต่างกันพื้นที่เท่ากันได้ */
  1486: (() => { const g = 40, x0 = 40, y0 = 28, C8 = [[1, 0], [2, 0], [1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [2, 2]], F6 = [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2]], H4 = [[0, 1, 3], [0, 2, 3], [4, 1, 0], [4, 2, 0]];
    const cells = (L, col) => L.map(([x, y]) => `<rect x="${x0 + x * g}" y="${y0 + y * g}" width="${g}" height="${g}" fill="${col}" stroke="#C9900F" stroke-width="1"/>`).join('');
    const tri = (x, y, d) => r4triPts(x0 + x * g, y0 + y * g, g, d), triC = (x, y, d) => { const T = tri(x, y, d); return [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3]; };
    return [
      r4dSee(1486, [0, 1], 'พื้นที่ คือ ผิวข้างในรูป', '<b>แตะรูป</b> — พื้นที่วัดเป็นช่อง'),
      r4dPlay('ปูกระเบื้อง', 'ลากมุมปูกระเบื้อง นับช่องเป็นพื้นที่', () => r4vBox({ w0: 2, h0: 2,
        cap: '<b>ลากจุดสีชมพู</b> ปูกระเบื้อง — 1 ช่อง = 1 ตารางหน่วย', missions: [['พื้นที่ 6 ตารางหน่วย', s => s.w * s.h === 6], ['พื้นที่ 12 ตารางหน่วย', s => s.w * s.h === 12], ['พื้นที่ 12 ตารางหน่วย อีกแบบหนึ่ง', r4vArea12]],
        body: (s, G) => r4vTiles(s, G) + r4PolyS(G.P, { fill: 'none', rm: false }),
        info: s => `นับรูปสี่เหลี่ยมจัตุรัสหน่วยได้ <b>${s.w * s.h}</b> ช่อง${r4vSep}พื้นที่ <b>${s.w * s.h} ตารางหน่วย</b>` + (r4vArea12(s) ? `${r4vSep}รูปต่างกัน พื้นที่เท่ากันได้` : '') })),
      r4dShow('นับพื้นที่', { fig: r4gridS(x0, y0, 7, 4, g) + cells(C8, '#FFC24C'), q: 'รูปสีเหลืองมีพื้นที่กี่ตารางหน่วย (□ 1 ช่อง = 1 ตารางหน่วย)',
        steps: [{ ink: r4dNums(C8, x0, y0, g), w: 'นับได้ 8 ช่อง', n: 'นับทีละช่อง ไม่นับซ้ำ' }, { w: 'พื้นที่ 8 ตารางหน่วย', n: '1 ช่อง = 1 ตารางหน่วย', ans: 1 }],
        fin: 'พื้นที่ = <b>จำนวนช่อง</b> (ตารางหน่วย)', say: 'นับช่องได้กี่ช่อง พื้นที่ก็เท่านั้นตารางหน่วย' }),
      r4dTry(1486, ['6b', '6d'], 'นับพื้นที่'),
      r4dSee(1486, [2], 'ครึ่งช่อง', '<b>แตะรูป</b> — ครึ่งช่อง 2 ชิ้นต่อกันได้เท่าไร'),
      r4dShow('รูปที่มีครึ่งช่อง', { fig: r4gridS(x0, y0, 7, 4, g) + cells(F6, '#FFC24C') + H4.map(([x, y, d]) => `<path d="M${tri(x, y, d).map(p => p.join(' ')).join(' L')}Z" fill="#FFD27A" stroke="#C9900F" stroke-width="1"/>`).join(''), q: 'รูปนี้มีพื้นที่กี่ตารางหน่วย',
        steps: [{ ink: r4dNums(F6, x0, y0, g), w: 'ช่องเต็ม 6', n: 'นับช่องเต็มก่อน' },
          { ink: H4.map(([x, y, d]) => { const c = triC(x, y, d); return r4dTx(c[0], c[1] + 5, '½', R4VC.p, 'r4d-sm'); }).join(''), w: 'ครึ่งช่อง 4 ชิ้น = 2', n: 'ครึ่ง 2 ชิ้น = 1 ช่อง' },
          { w: '6 + 2 = 8 ตารางหน่วย', n: 'รวมกัน', ans: 1 }],
        fin: 'ครึ่งช่อง <b>2 ชิ้น = 1</b> ตารางหน่วย', say: 'ครึ่งช่องสองชิ้น เท่ากับหนึ่งตารางหน่วย' }),
      r4dTry(1486, ['6h'], 'รูปที่มีครึ่งช่อง'),
      r4dSee(1486, [3], 'รูปต่างกัน พื้นที่เท่ากันได้', '<b>แตะรูป</b> — นับช่องของทั้งสองรูป'),
      r4dTry(1486, ['6c', '6e'], 'ปูกระเบื้องให้ได้พื้นที่')]; })(),

  /* ด่าน 7 หน่วยพื้นที่: ตร.ซม. → ตร.ม. → ตารางวา (= 4 ตร.ม.) */
  1487: (() => { const g = 46, x0 = 65, y0 = 32, row = j => Array.from({ length: 5 }, (_, i) => [i, j]), R1 = row(0), R23 = [...row(1), ...row(2)];
    return [
      r4dSee(1487, [0], 'ตารางเซนติเมตร', '<b>แตะรูป</b> — ของชิ้นเล็กวัดด้วยตารางเซนติเมตร'),
      r4dTry(1487, ['7b'], 'นับตารางเซนติเมตร'),
      r4dSee(1487, [1], 'ตารางเมตร', '<b>แตะรูป</b> — ห้องและสนามวัดด้วยตารางเมตร'),
      r4dTry(1487, ['7a', '7e'], 'ใช้หน่วยใดวัด'),
      r4dSee(1487, [2, 3], 'ตารางวา', '<b>แตะรูป</b> — ที่ดินวัดด้วยตารางวา'),
      r4dPlay('ลากมุมที่ดิน', 'ลากมุมที่ดิน หนึ่งช่องเท่ากับหนึ่งตารางวา', () => r4vBox({ w0: 2, h0: 2,
        cap: '<b>ลากจุดสีชมพู</b> — ที่ดิน 1 ช่อง ยาวด้านละ 1 วา (2 ม.) = <b>1 ตารางวา</b> = 4 ตร.ม.', missions: [['ที่ดิน 6 ตารางวา', s => s.w * s.h === 6], ['ที่ดิน 40 ตร.ม.', s => s.w * s.h === 10], ['ที่ดินจัตุรัส 9 ตารางวา', s => s.w === 3 && s.h === 3]],
        body: (s, G) => r4grass(G.x0, G.y0, s.w * G.g, s.h * G.g, 'r4vland') + r4gridS(G.x0, G.y0, s.w, s.h, G.g, 'rgba(78,138,58,.55)') + r4PolyS(G.P, { fill: 'none', rm: false, labs: [s.w + ' วา', '', '', s.h + ' วา'] }),
        info: s => `นับได้ ${s.w * s.h} ช่อง = <b>${s.w * s.h} ตารางวา</b>${r4vSep}1 ตารางวา = 4 ตร.ม. → ${s.w * s.h} × 4 = <b>${4 * s.w * s.h} ตร.ม.</b>` })),
      r4dShow('ที่ดินกี่ตารางวา กี่ตารางเมตร', { fig: r4grass(x0, y0, 5 * g, 3 * g, 'r4dld') + r4gridS(x0, y0, 5, 3, g, 'rgba(78,138,58,.6)') + r4vRect(x0, y0, 5 * g, 3 * g) + r4dTx(x0 + 2.5 * g, y0 - 12, '5 วา') + r4dTx(x0 - 26, y0 + 1.5 * g + 6, '3 วา'),
        q: 'ที่ดินนี้มีพื้นที่กี่ตารางวา กี่ตารางเมตร',
        steps: [{ ink: r4dNums(R1, x0, y0, g), w: 'แถวละ 5 ช่อง', n: '1 ช่อง = 1 ตารางวา' }, { ink: r4dNums(R23, x0, y0, g, R4VC.ink, 6), w: '3 × 5 = 15 ตารางวา', n: '3 แถว แถวละ 5 ช่อง' },
          { ink: `<rect x="196" y="196" width="40" height="40" fill="#A8DC8E" stroke="${R4VC.ink}" stroke-width="2"/><path d="M216 196 V236 M196 216 H236" fill="none" stroke="${R4VC.p}" stroke-width="2.2"/>` + r4dTx(188, 222, '1 ตารางวา =', R4VC.ink, 'r4d-sm', 'end') + r4dTx(244, 222, '4 ตร.ม.', R4VC.p, 'r4d-sm', 'start'), w: '1 ตารางวา = 4 ตร.ม.', n: '2 ม. × 2 ม.' },
          { w: '15 × 4 = 60 ตร.ม.', n: 'ตารางวา → ตร.ม. คูณ 4', ans: 1 }],
        fin: 'ที่ดิน 15 ตารางวา = <b>60 ตร.ม.</b>', say: 'ที่ดินสิบห้าตารางวา เท่ากับหกสิบตารางเมตร' }),
      r4dTry(1487, ['7f', '7j', '7h'], 'ตารางวา ↔ ตารางเมตร')]; })(),

  /* ด่าน 8 พื้นที่โดยประมาณ */
  1488: (() => { const S = r4EstShape(2), V = r4estVal(S), g = Math.min(40, Math.floor(330 / S.W), Math.floor(214 / S.H)), x0 = (360 - S.W * g) / 2, y0 = (240 - S.H * g) / 2;
    const tri = (x, y, d) => r4triPts(x0 + x * g, y0 + y * g, g, d), poly = T => T.map(p => p.join(' ')).join(' L');
    const base = r4gridS(x0, y0, S.W, S.H, g) + S.cells.map(([x, y, k, d]) => k === 'f' ? `<rect x="${x0 + x * g}" y="${y0 + y * g}" width="${g}" height="${g}" fill="#9FD0F0" stroke="#4C83B8" stroke-width=".8"/>` : `<path d="M${poly(tri(x, y, d))}Z" fill="#9FD0F0" stroke="#4C83B8" stroke-width=".8"/>`).join('');
    const full = S.cells.filter(c => c[2] === 'f'), half = S.cells.filter(c => c[2] === 'h');
    return [
      r4dSee(1488, [0, 1, 2], 'พื้นที่โดยประมาณ', '<b>แตะรูปทีละรูป</b> — สระน้ำไม่พอดีช่อง'),
      r4dPlay('ระบายสระน้ำ', 'ระบายสระน้ำ นับช่องเต็มและครึ่งช่อง', () => r4vPond(r4EstShape(3))),
      r4dShow('พื้นที่ของบ่อปลา', { fig: base, q: 'บ่อปลามีพื้นที่ประมาณกี่ตารางหน่วย (ครึ่งช่อง 2 ชิ้น = 1)',
        steps: [{ ink: full.map(([x, y]) => `<rect x="${x0 + x * g + 2}" y="${y0 + y * g + 2}" width="${g - 4}" height="${g - 4}" rx="3" fill="#7FCF9E"/>`).join(''), w: `ช่องเต็ม ${V.f}`, n: 'ระบายช่องเต็มทีละช่อง' },
          { ink: half.map(([x, y, , d]) => `<path d="M${poly(tri(x, y, d))}Z" fill="#FFD27A" stroke="#C9900F" stroke-width="1"/>`).join(''), w: `ครึ่งช่อง ${V.hf} ชิ้น = ${V.hf / 2}`, n: '2 ชิ้น = 1 ช่อง' },
          { w: `${V.f} + ${V.hf / 2} = ${V.v}`, n: 'พื้นที่โดยประมาณ', ans: 1 }],
        fin: `บ่อปลามีพื้นที่<b>ประมาณ ${V.v} ตารางหน่วย</b>`, say: `บ่อปลามีพื้นที่ประมาณ ${V.v} ตารางหน่วย` }),
      r4dTry(1488, ['8c', '8d'], 'พื้นที่โดยประมาณ'),
      r4dTry(1488, ['8b', '8a'], 'ช่องเต็มกับครึ่งช่อง')]; })(),

  /* ด่าน 9 พื้นที่ผืนผ้า: นับเป็นแถว → กว้าง × ยาว → ย้อนกลับหาด้าน */
  1489: (() => { const g = 38, x0 = 76, y0 = 64, rowC = j => Array.from({ length: 7 }, (_, i) => [i, j]), tiles = (L, col) => L.map(([x, y]) => r4dCell(x0 + x * g, y0 + y * g, g, col)).join('');
    const Fd = r4vR(60, 64, 240, 100), Rv = r4vR(90, 56, 200, 132), gridIn = (x, y, n, m, gw, gh) => `<path d="${Array.from({ length: n - 1 }, (_, i) => `M${x + (i + 1) * gw} ${y} V${y + m * gh}`).join(' ')} ${Array.from({ length: m - 1 }, (_, j) => `M${x} ${y + (j + 1) * gh} H${x + n * gw}`).join(' ')}" fill="none" stroke="#E0B45E" stroke-width="1.6"/>`;
    return [
      r4dSee(1489, [0], 'นับเป็นแถว', '<b>แตะรูป</b> — ไม่ต้องนับทีละช่อง'),
      r4dPlay('นับแถว × ช่องในแถว', 'ลากมุม นับแถวคูณช่องในแถว', () => r4vBox({ w0: 4, h0: 2, x0: 62,
        cap: '<b>ลากจุดสีชมพู</b> — นับเป็นแถว ไม่ต้องนับทีละช่อง', missions: [['กว้าง 3 ยาว 7', s => s.w === 7 && s.h === 3], ['พื้นที่ 20 ตารางหน่วย แถวละ 5 ช่อง', s => s.w === 5 && s.h === 4], ['พื้นที่ 18 ตารางหน่วย', s => s.w * s.h === 18]],
        body: (s, G) => r4vTiles(s, G) + r4PolyS(G.P, { fill: 'none', rm: false }) + Array.from({ length: s.h }, (_, j) => `<text x="${G.x0 - 12}" y="${G.y0 + j * G.g + G.g / 2 + 6}" class="r4-lab" text-anchor="end">${j + 1}</text>`).join('') + `<text x="${(G.x0 + G.X) / 2}" y="${G.y0 - 10}" class="r4-lab" text-anchor="middle">ยาว ${s.w}</text>`,
        info: s => `${s.h} แถว แถวละ ${s.w} ช่อง → ${s.h} × ${s.w} = <b>${s.w * s.h} ตารางหน่วย</b>${r4vSep}พื้นที่ = ความกว้าง × ความยาว` })),
      r4dShow('นับเป็นแถว', { fig: r4gridS(x0, y0, 7, 3, g) + r4vRect(x0, y0, 7 * g, 3 * g), q: 'รูปนี้มีพื้นที่กี่ตารางหน่วย',
        steps: [{ ink: tiles(rowC(0), '#FFC24C') + r4dNums(rowC(0), x0, y0, g), w: 'แถวละ 7 ช่อง', n: 'นับแถวแรก' },
          { ink: tiles([...rowC(1), ...rowC(2)], '#FFD27A') + [0, 1, 2].map(j => r4dTx(x0 - 16, y0 + j * g + g / 2 + 6, String(j + 1), R4VC.p)).join(''), w: 'มี 3 แถว', n: 'ทุกแถวมี 7 ช่องเท่ากัน' },
          { w: '3 × 7 = 21 ตารางหน่วย', n: 'แถว × ช่องในแถว', ans: 1 }],
        fin: 'นับเป็นแถว: <b>จำนวนแถว × ช่องในแถว</b>', say: 'นับเป็นแถว จำนวนแถวคูณจำนวนช่องในแถว' }),
      r4dTry(1489, ['9a', '9b'], 'นับเป็นแถว'),
      r4dSee(1489, [1], 'พื้นที่ = กว้าง × ยาว', '<b>แตะรูป</b> — ไม่ต้องตีตารางก็หาได้'),
      r4dShow('สนามกว้าง 25 ม. ยาว 60 ม.', { fig: r4PolyS(Fd, { fill: '#C9EBB5' }) + r4dLab(Fd, 0, '60 ม.') + r4dLab(Fd, 3, '25 ม.', R4VC.ink, 34), q: 'สนามรูปสี่เหลี่ยมผืนผ้ากว้าง 25 ม. ยาว 60 ม. มีพื้นที่เท่าไร',
        steps: [{ ink: r4dSide(Fd, 3, R4VC.b), w: 'กว้าง 25 ม.', n: 'ด้านสั้น' }, { ink: r4dSide(Fd, 0, R4VC.o), w: 'ยาว 60 ม.', n: 'ด้านยาว' },
          { ink: gridIn(60, 64, 6, 3, 40, 100 / 3), w: '25 × 60 = 1,500', n: 'กว้าง × ยาว' }, { w: 'พื้นที่ 1,500 ตร.ม.', n: 'ม. × ม. → ตร.ม.', ans: 1 }],
        fin: 'พื้นที่ผืนผ้า = <b>กว้าง × ยาว</b>', say: 'พื้นที่รูปสี่เหลี่ยมผืนผ้า เท่ากับ กว้างคูณยาว' }),
      r4dTry(1489, ['9c', '9g0'], 'กว้าง × ยาว'),
      r4dSee(1489, [2], 'หาด้านที่หายไป', '<b>แตะรูป</b> — รู้พื้นที่ หาความยาว'),
      r4dShow('รู้พื้นที่ หาความยาว', { fig: r4PolyS(Rv, { fill: R4VC.sand }) + r4dLab(Rv, 3, '4 ซม.', R4VC.ink, 34) + r4dQ(190, 44) + r4dTx(190, 128, 'พื้นที่ 24 ตร.ซม.', R4VC.ink), q: 'รูปสี่เหลี่ยมผืนผ้ากว้าง 4 ซม. มีพื้นที่ 24 ตร.ซม. ยาวกี่เซนติเมตร',
        steps: [{ w: '4 × ? = 24', n: 'กว้าง × ยาว = พื้นที่' }, { ink: gridIn(90, 56, 6, 4, 200 / 6, 33) + r4dTx(190, 128, 'พื้นที่ 24 ตร.ซม.', R4VC.ink), w: '24 ÷ 4 = 6', n: 'ย้อนกลับใช้หาร' },
          { off: ['.r4d-q0'], ink: r4dLab(Rv, 0, '6 ซม.', R4VC.p), w: 'ยาว 6 ซม.', n: 'ตรวจ: 4 × 6 = 24 ✓', ans: 1 }],
        fin: 'ด้านที่หายไป = <b>พื้นที่ ÷ ด้านที่รู้</b>', say: 'ด้านที่หายไป เท่ากับ พื้นที่หารด้วยด้านที่รู้' }),
      r4dTry(1489, ['9d', '9e'], 'หาด้านที่หายไป')]; })(),

  /* ด่าน 10 พื้นที่จัตุรัส: ด้าน × ด้าน → อย่าสับสนกับรอบรูป → ย้อนกลับ */
  1490: (() => { const Sq = r4vR(105, 40, 150, 150), g = 30, x0 = 105, y0 = 45, Sg = r4vR(x0, y0, 150, 150), all = []; for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) all.push([i, j]);
    return [
      r4dSee(1490, [0], 'ด้าน × ด้าน', '<b>แตะรูป</b> — จัตุรัสด้านยาวเท่ากัน'),
      r4dPlay('ลากมุมจัตุรัส', 'ลากมุมจัตุรัส ด้านคูณด้าน', () => r4vBox({ w0: 2, h0: 2, sq: true, N: 6, M: 6, g: 40, x0: 120, padR: 120,
        cap: '<b>ลากจุดสีชมพู</b> — รูปจัตุรัสด้านยาวเท่ากันเสมอ', missions: [['พื้นที่ 25 ตารางหน่วย', s => s.w === 5], ['ด้านละ 3', s => s.w === 3], ['พื้นที่ 36 ตารางหน่วย', s => s.w === 6]],
        body: (s, G) => r4vTiles(s, G, ['#9FD0F0', '#BFE3F7']) + r4PolyS(G.P, { fill: 'none', labs: [String(s.w), '', '', String(s.w)] }),
        info: s => `ด้านละ ${s.w} → ${s.w} × ${s.w} = <b>${s.w * s.w} ตารางหน่วย</b>${r4vSep}ความยาวรอบรูป 4 × ${s.w} = ${4 * s.w} (คนละเรื่องกัน)` })),
      r4dShow('จัตุรัสด้านละ 30 ซม.', { fig: r4PolyS(Sq, { fill: R4VC.sky }) + r4dLab(Sq, 0, '30 ซม.'), q: 'รูปสี่เหลี่ยมจัตุรัสยาวด้านละ 30 ซม. มีพื้นที่เท่าไร',
        steps: [{ ink: Sq.map((_, i) => r4dTick(Sq, i, R4VC.g)).join(''), w: 'ทุกด้าน 30 ซม.', n: 'จัตุรัส: กว้าง = ยาว' }, { w: '30 × 30 = 900', n: 'ด้าน × ด้าน' },
          { w: 'พื้นที่ 900 ตร.ซม.', n: 'ซม. × ซม. → ตร.ซม.', ans: 1 }],
        fin: 'พื้นที่จัตุรัส = <b>ด้าน × ด้าน</b>', say: 'พื้นที่รูปสี่เหลี่ยมจัตุรัส เท่ากับ ด้านคูณด้าน' }),
      r4dTry(1490, ['10a', '10c'], 'พื้นที่จัตุรัส'),
      r4dSee(1490, [1], 'อย่าสับสนกับรอบรูป', '<b>แตะรูป</b> — 4 × ด้าน กับ ด้าน × ด้าน'),
      r4dShow('รอบรูป กับ พื้นที่', { fig: r4gridS(x0, y0, 5, 5, g) + r4PolyS(Sg, { fill: 'none', rm: false }) + r4dLab(Sg, 0, '5 ซม.'), q: 'จัตุรัสด้านละ 5 ซม. ยาวรอบรูปเท่าไร มีพื้นที่เท่าไร',
        steps: [{ ink: r4vRect(x0, y0, 150, 150, 'none', R4VC.p, 6), w: '4 × 5 = 20 ซม.', n: 'รอบรูป: ไปตามเส้นรอบ' },
          { ink: all.map(([i, j]) => r4dCell(x0 + i * g, y0 + j * g, g, (i + j) % 2 ? '#9FD0F0' : '#BFE3F7')).join(''), w: '5 × 5 = 25 ตร.ซม.', n: 'พื้นที่: ปูเต็มข้างใน', ans: 1 }],
        fin: `4 × ด้าน = <b>รอบรูป</b> (ซม.)${r4vSep}ด้าน × ด้าน = <b>พื้นที่</b> (ตร.ซม.)`, say: 'สี่คูณด้านเป็นรอบรูป ด้านคูณด้านเป็นพื้นที่' }),
      r4dTry(1490, ['10h', '10f'], 'รอบรูปหรือพื้นที่'),
      r4dSee(1490, [2], 'รู้พื้นที่ หาด้าน', '<b>แตะรูป</b> — จำนวนใดคูณตัวเองได้พื้นที่'),
      r4dShow('พื้นที่ 49 ตร.ซม. ยาวด้านละเท่าไร', { fig: r4PolyS(Sq, { fill: R4VC.sky }) + r4dQ(180, 30) + r4dTx(180, 122, 'พื้นที่ 49 ตร.ซม.'), q: 'รูปสี่เหลี่ยมจัตุรัสมีพื้นที่ 49 ตร.ซม. ยาวด้านละกี่เซนติเมตร',
        steps: [{ w: '? × ? = 49', n: 'ด้านเท่ากัน คูณตัวเอง' }, { w: '6 × 6 = 36 ✗', n: 'น้อยไป ลองจำนวนถัดไป' }, { w: '7 × 7 = 49 ✓', n: 'พอดี' },
          { off: ['.r4d-q0'], ink: r4dLab(Sq, 0, '7 ซม.', R4VC.p) + r4dLab(Sq, 3, '7 ซม.', R4VC.p, 34), w: 'ด้านละ 7 ซม.', n: 'ตอบ', ans: 1 }],
        fin: 'รู้พื้นที่: หา<b>จำนวนที่คูณตัวเอง</b>ได้พื้นที่นั้น', say: 'รู้พื้นที่ หาจำนวนที่คูณตัวเองแล้วได้พื้นที่นั้น' }),
      r4dTry(1490, ['10e'], 'รู้พื้นที่ หาด้าน')]; })(),

  /* ด่าน 11 พื้นที่รูปหลายเหลี่ยม: ตัดแล้วบวก → ใหญ่ลบเล็ก */
  1491: (() => { const F = r4vFitU(R4SH.L(8, 6, 3, 2), 0, 0, 360, 240, 42), labs = ['5 ม.', '2 ม.', '3 ม.', '4 ม.', '8 ม.', '6 ม.'], base = r4PolyS(F.P, { fill: R4VC.sand, rm: false }), top = r4PolyS(F.P, { fill: 'none', stroke: 'none', sw: 0, labs, rm: false });
    const ru = (x1, y1, x2, y2, col) => `<path d="M${[[x1, y1], [x2, y1], [x2, y2], [x1, y2]].map(F.mp).map(p => p.map(a4n).join(' ')).join(' L')}Z" fill="${col}" fill-opacity=".75"/>`, at = (x, y, t, col = R4VC.ink) => { const p = F.mp([x, y]); return r4dTx(p[0], p[1] + 6, t, col); };
    return [
      r4dSee(1491, [0, 1], 'ตัดเป็นสี่เหลี่ยม 2 รูป', '<b>แตะรูป</b> — ตัดแนวตั้งหรือแนวนอนก็ได้'),
      r4dPlay('ลากเส้นตัดห้อง', 'ลากเส้นตัดห้องรูปตัวแอล', () => r4vCut()),
      r4dShow('ตัดแล้วบวก', { fig: base, top, q: 'ห้องรูปตัว L มีพื้นที่กี่ตารางเมตร',
        steps: [{ ink: r4dDash(F.mp([5, 2]), F.mp([5, 6]), R4VC.p, 3), n: 'ตัดเป็นสี่เหลี่ยม 2 รูป', at: F.mp([5, 1.6]) },
          { ink: ru(0, 0, 5, 6, R4VC.sky) + at(2.5, 3, '5 × 6'), w: '5 × 6 = 30', n: 'ส่วนซ้าย' }, { ink: ru(5, 2, 8, 6, R4VC.mint) + at(6.5, 4, '3 × 4'), w: '3 × 4 = 12', n: 'ส่วนขวา' },
          { w: '30 + 12 = 42 ตร.ม.', n: 'รวม 2 ส่วน', ans: 1 }],
        fin: 'ตัดเป็นสี่เหลี่ยมมุมฉาก หาพื้นที่แต่ละส่วน แล้ว<b>บวกกัน</b>', say: 'ตัดเป็นสี่เหลี่ยมมุมฉาก หาพื้นที่แต่ละส่วนแล้วบวกกัน' }),
      r4dTry(1491, ['11a', '11c'], 'ตัดแล้วบวก'),
      r4dSee(1491, [2], 'ใหญ่ลบเล็ก', '<b>แตะรูป</b> — เติมให้เต็มเป็นสี่เหลี่ยมใหญ่'),
      r4dShow('ใหญ่ลบเล็ก', { fig: base, top, q: 'ห้องรูปตัว L เดิม — หาพื้นที่อีกวิธีหนึ่ง',
        steps: [{ ink: `<path d="M${F.mp([5, 0]).map(a4n).join(' ')} L${F.mp([8, 0]).map(a4n).join(' ')} L${F.mp([8, 2]).map(a4n).join(' ')}" fill="none" stroke="${R4VC.p}" stroke-width="3" stroke-dasharray="7 6"/>`, w: '8 × 6 = 48', n: 'เติมเป็นสี่เหลี่ยมใหญ่' },
          { ink: ru(5, 0, 8, 2, '#F9D3E0') + at(6.5, 1, '3 × 2', R4VC.p), w: '3 × 2 = 6', n: 'ส่วนที่เติมเกินมา' }, { w: '48 − 6 = 42 ตร.ม.', n: 'ได้เท่ากับวิธีตัด ✓', ans: 1 }],
        fin: 'สี่เหลี่ยมใหญ่ <b>ลบ</b> ส่วนที่ขาดไป', say: 'พื้นที่สี่เหลี่ยมใหญ่ ลบส่วนที่ขาดไป' }),
      r4dTry(1491, ['11b', '11g'], 'หาพื้นที่รูปหลายเหลี่ยม')]; })(),

  /* ด่าน 12 รอบรูป กับ พื้นที่ */
  1492: (() => { const g = 32, x0 = 68, y0 = 40, all = []; for (let j = 0; j < 5; j++) for (let i = 0; i < 7; i++) all.push([i, j]);
    return [
      r4dSee(1492, [0, 1], 'ล้อมรั้ว กับ ปูหญ้า', '<b>แตะรูป</b> — ไปตามขอบ หรือ คลุมเต็มผิว'),
      r4dShow('แปลงผักกว้าง 5 ม. ยาว 7 ม.', { fig: r4vRect(x0, y0, 7 * g, 5 * g, '#F3E3C3', '#B7AED3', 1.6, '4 4') + r4dTx(x0 + 3.5 * g, y0 - 12, '7 ม.') + r4dTx(x0 - 28, y0 + 2.5 * g + 6, '5 ม.'), q: 'ล้อมรั้วรอบแปลงต้องใช้รั้วกี่เมตร ปูหญ้าเต็มแปลงได้กี่ตารางเมตร',
        steps: [{ ink: r4vRect(x0, y0, 7 * g, 5 * g, 'none', R4VC.wood, 6), w: '2 × (5 + 7) = 24 ม.', n: 'รั้ว = ขอบ → รอบรูป' },
          { ink: all.map(([i, j]) => r4dCell(x0 + i * g, y0 + j * g, g, (i + j) % 2 ? '#A8DC8E' : '#BDE6A6')).join(''), w: '5 × 7 = 35 ตร.ม.', n: 'หญ้า = ข้างใน → พื้นที่', ans: 1 }],
        fin: `รั้ว <b>24 ม.</b>${r4vSep}หญ้า <b>35 ตร.ม.</b> — คนละหน่วยกัน`, say: 'ใช้รั้วยี่สิบสี่เมตร ปูหญ้าสามสิบห้าตารางเมตร' }),
      r4dTry(1492, ['12a', '12h'], 'รอบรูปหรือพื้นที่'),
      r4dSee(1492, [2, 3], 'รั้วเท่ากัน แต่พื้นที่ไม่เท่ากัน', '<b>แตะรูป</b> — รอบรูปกับพื้นที่ไม่ได้ไปด้วยกันเสมอ'),
      r4dPlay('รั้วยาวเท่าเดิม', 'รั้วยาวเท่าเดิม ลากเปลี่ยนรูปแปลง', () => r4vFence()),
      r4dTry(1492, ['12j', '12g'], 'รั้วเท่ากัน พื้นที่ต่างกัน')]; })(),

  /* ด่าน 13 โจทย์ปัญหาความยาวรอบรูป */
  1493: (() => { const Gd = r4vR(60, 52, 240, 128), Tb = r4vR(70, 66, 220, 120);
    return [
      r4dSee(1493, [0], 'คำในโจทย์ที่บอกว่าเป็นรอบรูป', '<b>แตะรูป</b> — กรอบ รั้ว เทปรอบ วิ่งรอบ'),
      r4dPlay('ลากขอบสวน', 'ลากขอบสวน รั้วกี่เมตร', () => r4vGarden()),
      r4dShow('ล้อมรั้วรอบสวน', { fig: r4grass(60, 52, 240, 128, 'r4dgd') + r4PolyS(Gd, { fill: 'none' }) + r4dLab(Gd, 0, '20 ม.') + r4dLab(Gd, 3, '12 ม.', R4VC.ink, 34), q: 'สวนยาว 20 ม. กว้าง 12 ม. ล้อมรั้วรอบสวน รั้วเมตรละ 50 บาท จ่ายกี่บาท',
        steps: [{ ink: r4vRect(60, 52, 240, 128, 'none', R4VC.wood, 6), w: '2 × (20 + 12) = 64 ม.', n: 'รั้วรอบ → รอบรูป' }, { w: '64 × 50 = 3,200 บาท', n: 'เมตรละ 50 บาท', ans: 1 }],
        fin: 'หา<b>รอบรูป</b>ก่อน แล้วจึงคิดราคา', say: 'หาความยาวรอบรูปก่อน แล้วจึงคิดราคา' }),
      r4dTry(1493, ['13b', '13i'], 'โจทย์รอบรูป'),
      r4dSee(1493, [1, 2], 'รู้รอบรูป หาด้าน', '<b>แตะรูป</b> — ย้อนกลับจากความยาวรอบรูป'),
      r4dShow('หาความกว้างของโต๊ะ', { fig: r4PolyS(Tb, { fill: '#E6C79C' }) + r4dLab(Tb, 0, '120 ซม.') + r4dQ(36, 132) + r4dTx(180, 132, 'รอบรูป 380 ซม.'), q: 'โต๊ะยาว 120 ซม. ความยาวรอบรูป 380 ซม. กว้างกี่เซนติเมตร',
        steps: [{ ink: r4dSide(Tb, 0, R4VC.o) + r4dSide(Tb, 3, R4VC.b), w: '380 ÷ 2 = 190', n: 'ครึ่งรอบ = ยาว + กว้าง' },
          { off: ['.r4d-q0'], ink: r4dLab(Tb, 3, '70 ซม.', R4VC.b, 36), w: '190 − 120 = 70', n: 'ลบความยาวออก' },
          { w: 'กว้าง 70 ซม.', n: 'ตรวจ: 2 × (120 + 70) = 380 ✓', ans: 1 }],
        fin: 'รู้รอบรูป: <b>÷ 2</b> แล้ว<b>ลบ</b>ด้านที่รู้', say: 'รู้รอบรูป หารสองแล้วลบด้านที่รู้' }),
      r4dTry(1493, ['13g', '13e'], 'รู้รอบรูป หาด้าน')]; })(),

  /* ด่าน 14 โจทย์ปัญหาพื้นที่ */
  1494: (() => { const g = 40, x0 = 80, y0 = 34, all = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 5; i++) all.push([i, j]); const Lw = r4vR(60, 30, 240, 180);
    return [
      r4dSee(1494, [0, 1], 'ปูเต็มผิว แล้วคิดราคา', '<b>แตะรูป</b> — ปู ทา คลุม = พื้นที่'),
      r4dPlay('ลากม้วนพรม', 'ลากม้วนพรม พื้นที่และราคา', () => r4vCarpet()),
      r4dShow('ปูพรมเต็มห้อง', { fig: r4gridS(x0, y0, 5, 4, g, 'rgba(43,37,80,.22)') + r4vRect(x0, y0, 5 * g, 4 * g) + r4dTx(x0 + 2.5 * g, y0 - 12, '5 ม.') + r4dTx(x0 - 26, y0 + 2 * g + 6, '4 ม.'), q: 'ห้องกว้าง 4 ม. ยาว 5 ม. ปูพรมตารางเมตรละ 250 บาท จ่ายกี่บาท',
        steps: [{ ink: all.map(([i, j]) => r4dCell(x0 + i * g, y0 + j * g, g, (i + j) % 2 ? '#E77FA2' : '#D9668D')).join(''), w: '4 × 5 = 20 ตร.ม.', n: 'ปูเต็มห้อง → พื้นที่' }, { w: '20 × 250 = 5,000 บาท', n: 'ตร.ม. ละ 250 บาท', ans: 1 }],
        fin: 'หา<b>พื้นที่</b>ก่อน แล้วจึงคิดราคา', say: 'หาพื้นที่ก่อน แล้วจึงคิดราคา' }),
      r4dTry(1494, ['14f', '14a'], 'โจทย์พื้นที่'),
      r4dSee(1494, [2], 'เว้นที่ไว้', '<b>แตะรูป</b> — ปูทั้งหมด ยกเว้นตรงกลาง'),
      r4dShow('สนามหญ้าที่มีบ่อน้ำ', { fig: r4grass(60, 30, 240, 180, 'r4dlw') + r4vRect(150, 90, 60, 60, '#9FD0F0', '#4C83B8', 2) + r4PolyS(Lw, { fill: 'none' }) + r4dLab(Lw, 0, '8 ม.') + r4dLab(Lw, 3, '6 ม.', R4VC.ink, 32) + r4dTx(180, 172, '2 ม.', '#2F6FA8', 'r4d-sm'), q: 'สนามกว้าง 6 ม. ยาว 8 ม. ขุดบ่อจัตุรัสด้านละ 2 ม. ที่เหลือเป็นหญ้า หญ้ากี่ตารางเมตร',
        steps: [{ ink: r4vRect(60, 30, 240, 180, 'none', R4VC.o, 5), w: '8 × 6 = 48', n: 'สนามทั้งหมด' }, { ink: r4vRect(150, 90, 60, 60, 'none', R4VC.p, 4), w: '2 × 2 = 4', n: 'บ่อที่เว้นไว้' },
          { w: '48 − 4 = 44 ตร.ม.', n: 'ทั้งหมด − ที่เว้น', ans: 1 }],
        fin: 'เว้นที่: พื้นที่ทั้งหมด <b>ลบ</b> ส่วนที่เว้น', say: 'พื้นที่ทั้งหมด ลบส่วนที่เว้นไว้' }),
      r4dTry(1494, ['14e', '14g'], 'โจทย์เว้นที่')]; })()
};
/* game follows the order the ideas are taught (easy → hard inside each idea) */
const R4D_ORDER = { 1482: ['2a', '2b', '2c', '2d', '2f', '2e', '2g', '2i', '2h', '2j'], 1484: ['4a', '4b', '4c', '4f', '4d', '4e', '4g', '4h', '4i', '4j'],
  1485: ['5a', '5b', '5c', '5e', '5d', '5g', '5i', '5j', '5f', '5h'], 1487: ['7a', '7b', '7g', '7e', '7d', '7c', '7f', '7h', '7j', '7i'] };
Object.keys(R4D_ORDER).forEach(id => { const g0 = R4V_GAME[id], O = R4D_ORDER[id]; R4V_GAME[id] = () => g0().map(q => { const i = O.indexOf(String(q.__kind).slice(3)); return i < 0 ? q : { ...q, __diff: i + 1 }; }); });
LESSONS_P4C9.forEach(L => { if (R4D_TEACH[L.id]) { L.teach = R4D_TEACH[L.id]; L.__pracDone = 1; } if (R4V_GAME[L.id]) L.game = R4V_GAME[L.id]; });
