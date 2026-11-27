/* =========================================================
   ม.1 บทที่ 4 ทศนิยมและเศษส่วน — หน้าสอน (v267 · ผู้ใช้ขอ) · prefix d1d
   ประเด็นละหน้า: ① ดูภาพ (ตารางหลัก เส้นจำนวน กระโดดบวกลบ ตาราง 10×10 แถบเศษส่วน ตารางพื้นที่ …)
   → ② ทำให้ดู (r4dShow: ดินสอเขียนทีละบรรทัด เครื่องหมาย = ตรงกัน ระบายสี ขีดเส้นใต้ ตั้งหลัก + โน้ตสั้น ๆ ข้าง ๆ)
   → ③ ลองทำ (ข้อจากเกมของด่านนั้นเอง เลือกด้วย sig — e1dTry) · ไม่มีการ์ดข้อความ ไม่มีปุ่มทีละขั้น
   ใช้ e1dEq/e1dLine (m1qd.js) w1dC (m1ed.js) a4dSee r4dShow r4vH (ป.4) e4dColDo (ตั้งบวกลบทศนิยม)
   ========================================================= */
const D1C = { ink: '#2B2550', p: '#E5487A', b: '#2F7BC0', g: '#1B8862', o: '#EC7F1E', fade: '#B7AED3', y: '#FFE7A8', sky: '#DCEBFA', m: '#FDE2EA', mint: '#D4F1E2' };
const d1dT = (x, y, t, col = D1C.ink, cls = 'r4d-tx', anc = 'middle') => e1dTx(x, y, t, col, cls, anc);
const d1dC = (str, x, y, fs = 26, col = D1C.ink) => w1dC(str, x, y, fs, col);
const d1dF = v => { const t = Math.round(Math.abs(v) * 1e6) / 1e6; return (v < 0 ? '−' : '') + t; };
/* number line lo..hi (any step) · X(v), dot, hop (arc with label), mark (label under) */
function d1dNL(lo, hi, o = {}) { const x0 = o.x0 || 30, x1 = o.x1 || 330, y = o.y || 150, X = v => x0 + (v - lo) * (x1 - x0) / (hi - lo), st = o.step || 1, lb = o.lab || st, fm = o.fmt || d1dF;
  let s = `<path d="M${x0 - 12} ${y} H${x1 + 12}" stroke="${D1C.ink}" stroke-width="2.4"/>`;
  for (let k = 0, v = lo; v <= hi + 1e-9; k++, v = lo + k * st) { const big = Math.abs(v / lb - Math.round(v / lb)) < 1e-6; s += `<path d="M${a4n(X(v))} ${y - (big ? 8 : 5)} V${y + (big ? 8 : 5)}" stroke="${D1C.ink}" stroke-width="${Math.abs(v) < 1e-9 ? 2.8 : big ? 1.8 : 1.1}"/>` + (big ? d1dT(X(v), y + 28, fm(v), Math.abs(v) < 1e-9 ? D1C.b : D1C.ink, 'r4d-sm') : ''); }
  const hop = (a, b, col, lab, hh = 34) => `<path d="M${a4n(X(a))} ${y - 4} Q${a4n((X(a) + X(b)) / 2)} ${a4n(y - 4 - hh * 2)} ${a4n(X(b))} ${y - 4}" fill="none" stroke="${col}" stroke-width="2.8"/><path d="M${a4n(X(b))} ${y - 4} l${a > b ? 9 : -9} -9" stroke="${col}" stroke-width="2.8" fill="none"/>` + d1dT((X(a) + X(b)) / 2, y - 12 - hh, lab, col);
  return { s, X, y, hop, dot: (v, col = D1C.ink, r = 6) => `<circle cx="${a4n(X(v))}" cy="${y}" r="${r}" fill="${col}" stroke="#fff" stroke-width="2"/>`, mark: (v, t, col = D1C.ink, dy = -18) => d1dT(X(v), y + dy, t, col, 'r4d-sm') }; }
/* decimal place-value chart: places from 10^hi down to 10^lo (lo < 0) · digits of str */
const D1_PN = { 2: 'ร้อย', 1: 'สิบ', 0: 'หน่วย', '-1': 'ส่วนสิบ', '-2': 'ส่วนร้อย', '-3': 'ส่วนพัน', '-4': 'ส่วนหมื่น' };
function d1dPV(str, o = {}) { const hi = o.hi != null ? o.hi : 1, lo = o.lo != null ? o.lo : -3, cw = o.cw || 52, n = hi - lo + 1, pg = 14, x0 = (o.cx || 180) - (n * cw + pg) / 2, y0 = o.y0 || 34;
  const X = k => x0 + (hi - k) * cw + cw / 2 + (k < 0 ? pg : 0), [ip, fp = ''] = String(str).split('.'), dg = k => k >= 0 ? (ip.length - 1 - k >= 0 ? ip[ip.length - 1 - k] : null) : fp[-k - 1] != null ? fp[-k - 1] : null;
  let s = '';
  for (let k = hi; k >= lo; k--) { s += (o.names === false ? '' : d1dT(X(k), y0, D1_PN[k], k < 0 ? D1C.b : '#7A70A0', 'e4d-nm')) + `<rect x="${a4n(X(k) - cw / 2 + 2)}" y="${y0 + 8}" width="${cw - 4}" height="46" rx="7" fill="#fff" stroke="${D1C.fade}" stroke-width="1.3"/>`;
    if (o.digits !== false && dg(k) != null) s += d1dT(X(k), y0 + 42, dg(k), D1C.ink, 'e4d-dg'); }
  s += `<circle cx="${a4n(X(0) + cw / 2 + pg / 2)}" cy="${y0 + 46}" r="4.5" fill="${D1C.p}"/>`;
  const cell = (k, col = D1C.y, d) => `<rect x="${a4n(X(k) - cw / 2 + 2)}" y="${y0 + 8}" width="${cw - 4}" height="46" rx="7" fill="${col}" stroke="${D1C.fade}" stroke-width="1.3" data-pop="1"/>` + (d != null ? d1dT(X(k), y0 + 42, d, k < 0 ? D1C.b : D1C.ink, 'e4d-dg') : '');
  return { s, X, cell, dg, yD: y0 + 42, yB: y0 + 54, y0 }; }
/* fraction bar: d equal parts, n shaded */
const d1dBar = (x, y, w, h, n, d, col = '#9FD0F0', o = {}) => Array.from({ length: d }, (_, i) => `<rect x="${a4n(x + i * w / d)}" y="${y}" width="${a4n(w / d)}" height="${h}" fill="${i < n ? col : '#fff'}" stroke="${D1C.ink}" stroke-width="${o.sw || 1.6}"/>`).join('') + (o.lab ? d1dT(x - 10, y + h / 2 + 6, o.lab, D1C.ink, 'r4d-tx', 'end') : '');
/* 10×10 grid (0.a × 0.b): a columns blue, b rows pink, overlap purple */
const d1dGrid = (x, y, sz, a, b, on) => { const c = sz / 10; let s = ''; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) { const A = i < a, B = on && j < b; s += `<rect x="${a4n(x + i * c)}" y="${a4n(y + j * c)}" width="${a4n(c)}" height="${a4n(c)}" fill="${A && B ? '#B79CF0' : A ? '#BFE0F7' : B ? '#FBD0DC' : '#fff'}" stroke="#9C93BE" stroke-width=".8"/>`; } return s + `<rect x="${x}" y="${y}" width="${sz}" height="${sz}" fill="none" stroke="${D1C.ink}" stroke-width="2"/>`; };
/* r × c area model for a fraction of a fraction */
const d1dArea = (x, y, w, h, cols, rows, a, b, on) => { let s = ''; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const A = i < a, B = on && j < b; s += `<rect x="${a4n(x + i * w / cols)}" y="${a4n(y + j * h / rows)}" width="${a4n(w / cols)}" height="${a4n(h / rows)}" fill="${A && B ? '#B79CF0' : A ? '#BFE0F7' : B ? '#FBD0DC' : '#fff'}" stroke="${D1C.ink}" stroke-width="1.4"/>`; } return s; };
const d1dTry = (id, sigs, title) => e1dTry(id, sigs, title);
/* a repeating decimal drawn in svg: dots over the digits at positions ix */
const d1dDots = (t, ix, cx, y, col = D1C.g) => { const w = c => c === '.' ? 8 : 16, W = [...t].reduce((a, c) => a + w(c), 0); let x = cx - W / 2, s = ''; [...t].forEach((c, i) => { s += d1dT(x + w(c) / 2, y, c, col, 'e4d-dg'); if (ix.includes(i)) s += `<circle cx="${a4n(x + w(c) / 2)}" cy="${y - 25}" r="2.8" fill="${col}"/>`; x += w(c); }); return s; };
const d1dSee = (title, cap, list) => a4dSee(title, cap, list);
const d1dEq = (title, rows, o) => r4dShow(title, e1dEq(rows, o));
const d1dCol = (title, a, b, op, o = {}) => T(`<b>ทำให้ดู</b> — ${title}`, `ทำให้ดู ${title}`, el => el.append(e4dColDo(a, b, op, { q: o.q || `หาค่า ${a} ${op} ${b}`, fin: o.fin, say: o.say, cw: o.cw })));
/* chips: a short row of number cards */
const d1dChips = (y, list, cx = 180) => { const w = list.map(t => Math.max(54, e1dTw(String(t[0]).replace(/<[^>]+>/g, ''), 15) + 22)), tot = w.reduce((a, b) => a + b, 0) + (list.length - 1) * 10; let x = cx - tot / 2; return list.map((t, i) => { const s = e1dChip(x, y, w[i], t[0], t[1] || D1C.ink, t[2] || '#fff'); x += w[i] + 10; return s; }).join(''); };

/* ---------- ① กระดาน (v269 · ผู้ใช้ขอ): ประเด็นเดียวเต็มหน้า ค่อย ๆ ขึ้นทีละอย่างพร้อมคำพูดของครู (เล่นเอง ไม่ต้องกด)
   ปากกาเขียนเส้น/ตัวหนังสือลงกระดานทีละชิ้น แล้วคำอธิบายของจังหวะนั้นขึ้นใต้กระดาน (พูดออกเสียง) รอให้อ่านจบจึงขึ้นจังหวะถัดไป
   ครบทุกจังหวะแล้วปุ่ม "ถัดไป" จึงกดได้ · ปุ่ม "ดูอีกครั้ง" เล่นใหม่ · window.__D1B_FAST (ทดสอบ) คูณเวลาทั้งหมด ---------- */
function d1dBoardDo(o) {
  const W = o.W || 400, H = o.H || 200, S = o.beats, F = () => window.__D1B_FAST || 1;
  const root = h('div', { class: 'd1b ia' }), bd = h('div', { class: 'd1b-bd', style: { maxWidth: `min(1000px, calc((100cqh - 112px) * ${(W / H).toFixed(3)}))` } }), /* v271: รูปทุกขนาด (กระดานของทุกบท) */ cap = h('div', { class: 'd1b-say' }),  dots = h('div', { class: 'd1b-dots' }, ...S.map(() => h('i')));
  bd.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="r4d-svg d1b-svg" aria-hidden="true">${o.fig || ''}<g class="d1b-lay"></g></svg>`;
  const svg = bd.firstChild, lay = svg.querySelector('.d1b-lay'), pen = h('div', { class: 'r4d-pen', html: R4D_PEN }); bd.append(pen);
  let k = 0, tm = null, pF = [W * .92, H * .9], started = false, phase = 'wait', cur = null;
  const A = (el, kf, op) => el.animate ? el.animate(kf, { fill: 'both', ...op, duration: op.duration * F(), delay: (op.delay || 0) * F() }) : null;
  const pct = ([x, y]) => ({ left: `${(x / W * 100).toFixed(2)}%`, top: `${(y / H * 100).toFixed(2)}%` });
  const ink = s => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'd1b-ink'); g.innerHTML = s; lay.append(g);
    const els = [...g.querySelectorAll('path, line, polyline, polygon, rect, circle, ellipse, text')]; let t = 120; const kf = [{ ...pct(pF), t: 0 }];
    els.forEach(e => { let bb = null; try { bb = e.getBBox(); } catch (_) { } const tag = e.tagName.toLowerCase(), st = e.getAttribute('stroke'), fl = e.getAttribute('fill') || (tag === 'text' ? '' : 'none'), dash = e.getAttribute('stroke-dasharray');
      if (tag === 'text') { const d = Math.min(650, 150 + 40 * (e.textContent || '').length); A(e, [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }], { duration: d, delay: t });
        if (bb) { kf.push({ ...pct([bb.x, bb.y + bb.height * .9]), t }); kf.push({ ...pct([bb.x + bb.width, bb.y + bb.height * .9]), t: t + d }); } t += d; return; }
      if (st && st !== 'none' && fl === 'none' && !dash && e.getTotalLength) { let L = 0; try { L = e.getTotalLength(); } catch (_) { }
        if (L > 1) { const d = Math.max(220, Math.min(900, L * 3)); e.style.strokeDasharray = `${L} ${L + 2}`; A(e, [{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: d, delay: t, easing: 'ease-in-out' });
          for (let j = 0; j <= 4; j++) { let q = null; try { q = e.getPointAtLength(L * j / 4); } catch (_) { } if (q) kf.push({ ...pct([q.x, q.y]), t: t + d * j / 4 }); } t += d; return; } }
      const d = Math.max(40, Math.min(160, 1600 / els.length)), op = +(e.getAttribute('opacity') || 1); A(e, [{ opacity: 0 }, { opacity: op }], { duration: Math.max(180, d * 1.6), delay: t }); if (bb) kf.push({ ...pct([bb.x + bb.width / 2, bb.y + bb.height / 2]), t: t + d / 2 }); t += d; });
    if (kf.length > 1) { const last = kf[kf.length - 1]; pF = [parseFloat(last.left) / 100 * W, parseFloat(last.top) / 100 * H]; pen.classList.add('on'); A(pen, kf.map(f => ({ left: f.left, top: f.top, offset: Math.min(1, f.t / (t || 1)) })), { duration: t, easing: 'linear' }); }
    return t + 150; };
  const speak = t => { const tx = r4dTxt(t); cap.innerHTML = `<span>${t}</span>`; cap.classList.add('on'); A(cap, [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }], { duration: Math.min(1500, 300 + 24 * tx.length), easing: 'linear' }); say(tx, true); return Math.max(2400, 700 + 88 * tx.length); };
  const step = () => { tm = null; if (!root.isConnected) return; if (k >= S.length) { end(); return; } const b = S[k]; dots.children[k].className = 'on'; k++; phase = 'ink'; cur = b;
    if (b.off) b.off.forEach(sel => svg.querySelectorAll(sel).forEach(e => A(e, [{ opacity: 1 }, { opacity: .12 }], { duration: 300 })));
    if (b.clear) lay.querySelectorAll('.d1b-ink').forEach(e => A(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 })); /* v271: รูปใหม่ทั้งรูป → รูปเดิมหายไป */
    const d1 = b.ink ? ink(b.ink) : 0; tm = setTimeout(() => { if (!root.isConnected) return; pen.classList.remove('on'); phase = 'talk'; tm = setTimeout(step, speak(b.t) * F()); }, d1 * F()); };
  const again = h('button', { class: 'btn sm ia d1b-again', style: { display: 'none' }, onclick: e => { e.stopPropagation(); clearTimeout(tm); svg.querySelectorAll('*').forEach(x => x.getAnimations && x.getAnimations().forEach(a => a.cancel())); lay.innerHTML = ''; k = 0; pF = [W * .92, H * .9];
    [...dots.children].forEach(i => { i.className = ''; }); cap.innerHTML = ''; cap.classList.remove('on', 'fin'); again.style.display = 'none'; root.classList.add('ia'); phase = 'wait'; sfx.tap(); tm = setTimeout(step, 400 * F()); } }, icon('replay'), h('span', null, 'ดูอีกครั้ง'));
  const end = () => { phase = 'end'; root.classList.remove('ia'); tip.textContent = 'ครบแล้ว — แตะหรือกด Space ไปหน้าถัดไป'; pen.classList.remove('on'); if (o.fin) { cap.innerHTML = `<span>★ ${o.fin}</span>`; cap.classList.add('fin'); A(cap, [{ transform: 'scale(.96)' }, { transform: 'scale(1.03)' }, { transform: 'none' }], { duration: 420 }); } again.style.display = ''; sfx.ok(); teachDone(root); };
  const go = () => { if (started) return; if (!root.isConnected) { setTimeout(go, 150); return; } started = true; tm = setTimeout(step, 700 * F()); }; setTimeout(go, 30);
  /* v270 (ผู้ใช้ขอ): กดเองทีละขั้นได้ — แตะหน้าจอ / Space / → / Enter: กำลังเขียนอยู่ → เขียนเสร็จทันทีและขึ้นคำอธิบาย · ขึ้นคำอธิบายแล้ว → ไปขั้นถัดไปเลย (ไม่ต้องรอ) */
  const tip = h('span', { class: 'd1b-tip' }, 'แตะหน้าจอ หรือกด Space ไปขั้นต่อไป');
  const fast = () => { (root.getAnimations ? root.getAnimations({ subtree: true }) : []).forEach(a => { try { a.finish(); } catch (_) { } }); pen.classList.remove('on'); };
  const skip = () => { if (phase === 'end' || phase === 'busy') return false; clearTimeout(tm); started = true;
    if (phase === 'ink') { fast(); phase = 'talk'; tm = setTimeout(step, speak(cur.t) * F()); } else { fast(); step(); } return true; };
  const off = () => { removeEventListener('click', onTap, true); removeEventListener('keydown', onKey, true); };
  const onTap = e => { if (!root.isConnected) return off(); if (phase === 'end' || (typeof Scratch !== 'undefined' && Scratch.on)) return; const t = e.target;
    if (!t.closest || !t.closest('.screen.teach') || t.closest('button, a, .bottombar, .restart, .skipgame')) return; e.stopPropagation(); e.preventDefault(); skip(); };
  const onKey = e => { if (!root.isConnected) return off(); if (phase === 'end' || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return; if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable]')) return;
    if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); skip(); } };
  addEventListener('click', onTap, true); addEventListener('keydown', onKey, true);
  root.append(bd, h('div', { class: 'd1b-row' }, cap, h('div', { class: 'd1b-bar' }, dots, again)), tip); return root;
}
const d1dBoard = (title, o) => T(`<b>ดูภาพ</b> — ${title}`, `ดูภาพ ${title}`, el => el.append(d1dBoardDo({ ...o, beats: o.beats.map(b => Array.isArray(b) ? { ink: b[0], t: b[1], off: b[2] } : b) })));
/* board drawing helpers (board = 400 × 200) */
const d1bT = (x, y, t, col = D1C.ink, cls = 'r4d-tx', anc = 'middle') => d1dT(x, y, t, col, cls, anc);
const d1bRing = (L, i, j, col = D1C.p) => { const a = L.xs[i][0] - 5, b = L.xs[j][1] + 5, hh = L.fs * (/\{/.test(L.T.slice(i, j + 1).map(k => k.f ? '{' : '').join('')) ? 1.25 : .8); return `<ellipse cx="${a4n((a + b) / 2)}" cy="${a4n(L.y - L.fs * .32)}" rx="${a4n((b - a) / 2 + 3)}" ry="${a4n(hh)}" fill="none" stroke="${col}" stroke-width="2.4"/>`; };
const d1bArr = (x1, y1, x2, y2, col = D1C.o) => { const L = Math.hypot(x2 - x1, y2 - y1) || 1, u = [(x2 - x1) / L, (y2 - y1) / L], v = [-u[1], u[0]]; return `<path d="M${a4n(x1)} ${a4n(y1)} L${a4n(x2)} ${a4n(y2)}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/><path d="M${a4n(x2 - u[0] * 8 + v[0] * 5)} ${a4n(y2 - u[1] * 8 + v[1] * 5)} L${a4n(x2)} ${a4n(y2)} L${a4n(x2 - u[0] * 8 - v[0] * 5)} ${a4n(y2 - u[1] * 8 - v[1] * 5)}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`; };
const d1bBrk = (x1, x2, y, lab, col) => `<path d="M${a4n(x1)} ${y + 6} V${y} H${a4n(x2)} V${y + 6}" fill="none" stroke="${col}" stroke-width="2.4"/>` + d1bT((x1 + x2) / 2, y - 6, lab, col, 'r4d-sm');
const d1bOv = (x, y, w, hh, col, op = .5) => `<rect x="${a4n(x)}" y="${a4n(y)}" width="${a4n(w)}" height="${a4n(hh)}" fill="${col}" opacity="${op}"/>`;
const d1bCuts = (x, y, w, hh, n, skip = 0, col = D1C.p) => Array.from({ length: n - 1 }, (_, i) => skip && (i + 1) % skip === 0 ? '' : `<path d="M${a4n(x + (i + 1) * w / n)} ${y - 4} V${y + hh + 4}" stroke="${col}" stroke-width="1.6" stroke-dasharray="3 3"/>`).join('');
const d1bFrac = (x, y, n, d, col = D1C.ink, fs = 18) => d1dC(`{${n}|${d}}`, x, y, fs, col);
const D1B = {
  2401: [[(() => { const P = d1dPV('47.385', { cx: 200, y0: 26, cw: 56 }), v = (k, a, f) => d1bT(P.X(k), 108, a, k < 0 ? D1C.b : D1C.ink) + (f ? d1bFrac(P.X(k), 142, 1, f, D1C.p, 14) : '');
    const arcs = [1, 0, -1, -2].map(k => `<path d="M${a4n(P.X(k) + 6)} 166 Q${a4n((P.X(k) + P.X(k - 1)) / 2)} 182 ${a4n(P.X(k - 1) - 6)} 166" fill="none" stroke="${D1C.o}" stroke-width="2"/>` + d1bT((P.X(k) + P.X(k - 1)) / 2, 196, '÷ 10', D1C.o, 'r4d-sm')).join('');
    return d1dBoard('ค่าประจำหลักหลังจุดทศนิยม', { beats: [[P.s, 'ทศนิยม 47.385 — <b>จุดทศนิยม</b>คั่นระหว่างหลักหน่วยกับหลักส่วนสิบ'], [P.cell(1, D1C.y, '4') + P.cell(0, D1C.y, '7') + v(1, '40') + v(0, '7'), 'หน้าจุด: 4 อยู่หลักสิบ มีค่า <b>40</b> และ 7 อยู่หลักหน่วย มีค่า <b>7</b>'],
      [P.cell(-1, D1C.sky, '3') + v(-1, '0.3', 10), 'หลังจุดหลักแรกคือ <b>หลักส่วนสิบ</b>: 3 มีค่า 3/10 = <b>0.3</b>'], [P.cell(-2, D1C.sky, '8') + v(-2, '0.08', 100), 'หลักที่สองคือ <b>หลักส่วนร้อย</b>: 8 มีค่า 8/100 = <b>0.08</b>'],
      [P.cell(-3, D1C.sky, '5') + v(-3, '0.005', 1000), 'หลักที่สามคือ <b>หลักส่วนพัน</b>: 5 มีค่า 5/1000 = <b>0.005</b>'], [arcs, 'ไปทางขวาทีละหลัก ค่าประจำหลัก<b>ลดลงทีละ 10 เท่า</b>']],
      fin: `หลังจุด: <b>ส่วนสิบ ส่วนร้อย ส่วนพัน</b>${r4vSep}ไปทางขวา ค่าลดลง 10 เท่า` }); })()]],
  2402: [[(() => { const N = d1dNL(-4, 4, { step: .25, lab: 1, x0: 40, x1: 360, y: 112 });
    return d1dBoard('ค่าสัมบูรณ์ = ระยะห่างจาก 0', { beats: [[N.s, 'บนเส้นจำนวน 0 อยู่ตรงกลาง ทางขวาเป็น<b>จำนวนบวก</b> ทางซ้ายเป็น<b>จำนวนลบ</b>'],
      [N.dot(3.25, D1C.b) + N.mark(3.25, '3.25', D1C.b, -14) + d1bBrk(N.X(0), N.X(3.25), 64, '3.25 หน่วย', D1C.b), '3.25 อยู่ห่างจาก 0 ไปทางขวา <b>3.25 หน่วย</b>'],
      [N.dot(-3.25, D1C.p) + N.mark(-3.25, '−3.25', D1C.p, -14) + d1bBrk(N.X(-3.25), N.X(0), 64, '3.25 หน่วย', D1C.p), '−3.25 อยู่ห่างจาก 0 ไปทางซ้าย <b>3.25 หน่วย</b> เท่ากัน'],
      [d1dC('|−3.25| = |3.25| = *3.25', 200, 180, 20), 'ระยะห่างจาก 0 เรียกว่า <b>ค่าสัมบูรณ์</b> เขียนด้วย | | และไม่เป็นจำนวนลบ']], fin: `ค่าสัมบูรณ์ = <b>ระยะห่างจาก 0</b>${r4vSep}|−3.25| = 3.25` }); })()],
    [(() => { const N = d1dNL(-2, 0, { step: .05, lab: .5, x0: 40, x1: 360, y: 104 });
    return d1dBoard('จำนวนที่อยู่ทางขวามีค่ามากกว่า', { beats: [[N.s, 'ขยายเส้นจำนวนช่วง −2 ถึง 0 ให้เห็นทศนิยมชัด ๆ'], [N.dot(-1.5, D1C.p) + N.mark(-1.5, '−1.5', D1C.p, -16), '−1.5 อยู่กึ่งกลางระหว่าง −2 กับ −1'],
      [N.dot(-1.25, D1C.b) + N.mark(-1.25, '−1.25', D1C.b, -16), '−1.25 อยู่<b>ทางขวา</b>ของ −1.5 จึงใกล้ 0 มากกว่า'], [d1bArr(N.X(-1.5), 64, N.X(-1.25), 64, D1C.g) + d1dC('−1.5 *< −1.25', 200, 168, 22), 'จำนวนที่อยู่ทางขวามี<b>ค่ามากกว่า</b>เสมอ: −1.5 &lt; −1.25'],
      [d1bT(200, 196, 'ค่าสัมบูรณ์ 1.5 มากกว่า แต่ −1.5 มีค่าน้อยกว่า', D1C.p, 'r4d-sm'), 'จำนวนลบ ยิ่งค่าสัมบูรณ์มาก ยิ่งอยู่ทางซ้าย จึง<b>มีค่าน้อย</b>']], fin: `จำนวนลบ: <b>ค่าสัมบูรณ์มากกว่า มีค่าน้อยกว่า</b>` }); })()]],
  2403: [[(() => { const N = d1dNL(-6, 1, { step: .25, lab: 1, x0: 30, x1: 370, y: 118 });
    return d1dBoard('บวกจำนวนบวก: เดินไปทางขวา', { beats: [[d1dC('(−5.2) + 3.85', 130, 34, 22), 'โจทย์ (−5.2) + 3.85'], [N.s + N.dot(-5.2, D1C.p) + N.mark(-5.2, '−5.2', D1C.p, 48), 'เริ่มที่ <b>−5.2</b> บนเส้นจำนวน'],
      [N.hop(-5.2, -1.35, D1C.b, '+3.85', 28), 'บวก 3.85 คือ<b>เดินไปทางขวา</b> 3.85 หน่วย'], [N.dot(-1.35, D1C.g) + N.mark(-1.35, '−1.35', D1C.g, 48), 'หยุดที่ <b>−1.35</b> ยังไม่ถึง 0 ผลบวกจึงเป็นจำนวนลบ'],
      [d1dC('= *−1.35', 290, 34, 22), 'ดังนั้น (−5.2) + 3.85 = −1.35']], fin: `บวกจำนวนบวก = <b>ไปทางขวา</b>` }); })(),
    (() => { const N = d1dNL(-5, 0, { step: .25, lab: 1, x0: 40, x1: 360, y: 118 });
    return d1dBoard('บวกจำนวนลบ: เดินไปทางซ้าย', { beats: [[d1dC('(−2.6) + (−1.35)', 130, 34, 22), 'โจทย์ (−2.6) + (−1.35)'], [N.s + N.dot(-2.6, D1C.p) + N.mark(-2.6, '−2.6', D1C.p, 48), 'เริ่มที่ <b>−2.6</b>'],
      [N.hop(-2.6, -3.95, D1C.p, '−1.35', 28), 'บวกจำนวนลบ คือ<b>เดินไปทางซ้าย</b> 1.35 หน่วย'], [N.dot(-3.95, D1C.g) + N.mark(-3.95, '−3.95', D1C.g, 48), 'หยุดที่ <b>−3.95</b> ยิ่งไกลจาก 0 ไปทางลบ'],
      [d1dC('= *−3.95', 300, 34, 22), 'ลบรวมกับลบ: บวกค่าสัมบูรณ์ 2.6 + 1.35 = 3.95 แล้วใส่เครื่องหมายลบ']], fin: `บวกจำนวนลบ = <b>ไปทางซ้าย</b>` }); })()]],
  2404: [[d1dBoard('สมบัติการสลับที่', { beats: [[d1dC('(−1.5) + 2.7', 110, 64, 22), 'ลองบวก (−1.5) + 2.7'], [d1dC('= *1.2', 110, 108, 22), 'ได้ <b>1.2</b>'], [d1dC('2.7 + (−1.5)', 290, 64, 22), 'สลับที่สองจำนวน เป็น 2.7 + (−1.5)'], [d1dC('= *1.2', 290, 108, 22), 'ก็ได้ <b>1.2</b> เท่าเดิม'],
      [`<rect x="110" y="140" width="180" height="46" rx="12" fill="#FDE2EA" stroke="${D1C.p}" stroke-width="2"/>` + d1dC('a + b = b + a', 200, 171, 22, D1C.p), 'การบวกสลับที่ได้ ผลเท่าเดิม เรียกว่า <b>สมบัติการสลับที่</b>']], fin: `<b>a + b = b + a</b>` }),
    (() => { const N = d1dNL(-10, 10, { step: 1, lab: 5, x0: 40, x1: 360, y: 92 });
    return d1dBoard('อินเวอร์สและเอกลักษณ์การบวก', { beats: [[N.s + N.dot(8.35, D1C.b) + N.mark(8.35, '8.35', D1C.b, -16), 'จุด 8.35 อยู่ทางขวาของ 0'], [N.dot(-8.35, D1C.p) + N.mark(-8.35, '−8.35', D1C.p, -16), '<b>จำนวนตรงข้าม</b>คือ −8.35 อยู่อีกฝั่ง ห่าง 0 เท่ากัน'],
      [d1dC('8.35 + (−8.35) = *0', 200, 150, 20), 'บวกกันได้ 0 พอดี เรียกว่า <b>อินเวอร์สการบวก</b>'], [d1dC('0 + (−6.08) = *−6.08', 200, 188, 18), 'ส่วนบวกด้วย 0 ได้จำนวนเดิม เรียกว่า <b>เอกลักษณ์การบวก</b>']], fin: `a + (−a) = <b>0</b>${r4vSep}a + 0 = <b>a</b>` }); })()]],
  2405: [[(() => { const N = d1dNL(-1, 8, { step: .25, lab: 1, x0: 30, x1: 370, y: 132 });
    return d1dBoard('ลบ = บวกด้วยจำนวนตรงข้าม', { beats: [[d1dC('4.5 − (−2.75)', 110, 40, 22), 'โจทย์ 4.5 − (−2.75)'], [d1dC('= 4.5 + !2.75', 290, 40, 22) + d1bT(290, 72, 'ลบ (−2.75) → บวก 2.75', D1C.p, 'r4d-sm'), 'ลบด้วยจำนวนลบ เปลี่ยนเป็น<b>บวกด้วยจำนวนตรงข้าม</b> คือ + 2.75'],
      [N.s + N.dot(4.5, D1C.b) + N.mark(4.5, '4.5', D1C.b, 48), 'เริ่มที่ 4.5'], [N.hop(4.5, 7.25, D1C.g, '+2.75', 18) + N.dot(7.25, D1C.g) + N.mark(7.25, '7.25', D1C.g, 48), 'เดินไปทางขวา 2.75 ได้ <b>7.25</b>']], fin: `<b>a − b = a + (−b)</b>` }); })()]],
  2406: [[(() => { const Y = v => 100 - v * 16, TH = `<rect x="60" y="12" width="20" height="172" rx="10" fill="#fff" stroke="${D1C.ink}" stroke-width="2"/><circle cx="70" cy="186" r="11" fill="#F2706F" stroke="${D1C.ink}" stroke-width="2"/><rect x="66" y="50" width="8" height="136" fill="#F2706F"/>` + [-5, 0, 5].map(v => `<path d="M80 ${Y(v)} h9" stroke="${D1C.ink}" stroke-width="2"/>` + d1bT(52, Y(v) + 5, String(v).replace('-', '−'), D1C.ink, 'r4d-sm', 'end')).join('');
    const ln = (v, col, lab) => `<path d="M82 ${a4n(Y(v))} H150" stroke="${col}" stroke-width="2.4" stroke-dasharray="5 4"/>` + d1bT(156, Y(v) + 5, lab, col, 'r4d-sm', 'start');
    return d1dBoard('ต่างกันกี่องศา', { beats: [[TH, 'เทอร์โมมิเตอร์เป็น<b>เส้นจำนวนแนวตั้ง</b> 0 อยู่ตรงกลาง'], [ln(3.5, D1C.p, 'สูงสุด 3.5'), 'อุณหภูมิสูงสุด 3.5 องศา อยู่<b>เหนือ 0</b>'], [ln(-4.8, D1C.b, 'ต่ำสุด −4.8'), 'อุณหภูมิต่ำสุด −4.8 องศา อยู่<b>ใต้ 0</b>'],
      [`<path d="M238 ${Y(3.5)} V${Y(0)}" stroke="${D1C.p}" stroke-width="3"/><path d="M238 ${Y(0)} V${a4n(Y(-4.8))}" stroke="${D1C.b}" stroke-width="3"/>` + d1bT(244, (Y(3.5) + Y(0)) / 2 + 5, '3.5', D1C.p, 'r4d-tx', 'start') + d1bT(244, (Y(0) + Y(-4.8)) / 2 + 5, '4.8', D1C.b, 'r4d-tx', 'start') + `<path d="M84 ${Y(0)} H238" stroke="${D1C.fade}" stroke-width="1.5" stroke-dasharray="3 3"/>`, 'จาก −4.8 ขึ้นมาถึง 0 คือ 4.8 องศา และจาก 0 ถึง 3.5 อีก 3.5 องศา'],
      [d1dC('3.5 + 4.8 = *8.3', 338, 92, 14) + d1dC('3.5 − (−4.8) = *8.3', 338, 130, 14), 'ต่างกัน = มาก − น้อย = 3.5 − (−4.8) = <b>8.3 องศา</b>']], fin: `ต่างกัน = <b>มาก − น้อย</b>` }); })()]],
  2407: [[(() => { const P = d1dPV('4.83', { hi: 2, lo: -2, cx: 200, y0: 22, cw: 52 }), Q = d1dPV('', { hi: 2, lo: -2, cx: 200, y0: 112, cw: 52, names: false });
    return d1dBoard('คูณด้วย 10, 100, 1,000', { beats: [[P.s, '4.83 อยู่ในตารางหลัก'], [Q.s, 'คูณด้วย 100 เลขโดดทุกตัว<b>เลื่อนไปทางซ้าย 2 หลัก</b>'],
      [[[0, '4'], [-1, '8'], [-2, '3']].map(([k, d]) => d1bArr(P.X(k), P.yB + 4, Q.X(k + 2), Q.y0 + 12) + d1bT(Q.X(k + 2), Q.yD, d, D1C.g, 'e4d-dg')).join(''), '4 ไปอยู่หลักร้อย 8 หลักสิบ 3 หลักหน่วย'],
      [d1dC('4.83 × 100 = *483', 200, 194, 16), 'ได้ <b>483</b> — คูณ 10 เลื่อน 1 หลัก คูณ 100 เลื่อน 2 หลัก คูณ 1,000 เลื่อน 3 หลัก']], fin: `× 10, 100, 1,000 → เลื่อนจุดไป<b>ทางขวา</b> 1, 2, 3 หลัก` }); })(),
    d1dBoard('0.6 × 0.4 บนตาราง 100 ช่อง', { beats: [[d1dGrid(40, 18, 160, 0, 0, false), 'ตารางนี้คือ <b>1</b> แบ่งเป็น 100 ช่อง ช่องละ 0.01'], [d1bOv(40, 18, 96, 160, '#4FA3E0', .45) + d1bT(300, 50, 'ระบาย 0.6', D1C.b), 'ระบาย 6 แถวตั้ง คือ <b>0.6</b> ของตาราง'],
      [d1bOv(40, 18, 96, 64, '#7C5CE0', .55) + d1bT(300, 88, '0.4 ของ 0.6', '#7C5CE0'), 'เอา <b>0.4</b> ของส่วนสีฟ้า คือ 4 แถวนอน'], [d1bT(300, 126, '= 24 ช่อง', '#7C5CE0') + d1dC('0.6 × 0.4 = *0.24', 300, 164, 18), 'ส่วนที่ซ้อนกันมี 24 ช่อง จาก 100 ช่อง จึงได้ <b>0.24</b>'],
      [d1bT(300, 194, '6 × 4 = 24 ทศนิยม 2 ตำแหน่ง', D1C.o, 'r4d-sm'), 'เหมือนคูณ 6 × 4 = 24 แล้วใส่ทศนิยม 2 ตำแหน่ง']], fin: `คูณแบบจำนวนนับ แล้ว<b>นับตำแหน่งทศนิยม</b>` })]],
  2408: [[(() => { const L = w1dCL('0.25 × (−7.3) × 4', 200, 48, 24);
    return d1dBoard('จับคู่ให้คูณกันได้ 1', { beats: [[L.s, 'โจทย์ 0.25 × (−7.3) × 4'], [d1bRing(L, 0, 0) + d1bRing(L, 4, 4), 'สังเกต <b>0.25 กับ 4</b> คูณกันได้ 1 พอดี'], [d1dC('= (_ !0.25 × !4) × (−7.3)', 200, 92, 20), 'สลับที่ เปลี่ยนหมู่ ให้ 0.25 กับ 4 อยู่ด้วยกัน'],
      [d1dC('= 1 × (−7.3) = *−7.3', 200, 132, 20), '1 คูณจำนวนใดก็ได้จำนวนนั้น จึงได้ <b>−7.3</b>'], [d1dChips(156, [['0.5 × 2 = 1', D1C.b], ['0.2 × 5 = 1', D1C.b], ['2.5 × 4 = 10', D1C.p]], 200), 'คู่ที่ควรจำ: 0.5 × 2 และ 0.2 × 5 ได้ 1 ส่วน 2.5 × 4 ได้ 10']],
      fin: `สลับที่ให้<b>คู่ที่คูณกันลงตัว</b>อยู่ด้วยกัน` }); })()]],
  2409: [[(() => { const L = w1dCL('2.36 ÷ 0.4', 200, 44, 28), c = i => (L.xs[i][0] + L.xs[i][1]) / 2;
    return d1dBoard('ทำตัวหารให้เป็นจำนวนนับ', { beats: [[L.s, 'โจทย์ 2.36 ÷ 0.4'], [d1bRing(L, 2, 2) + d1bT(c(2) + 40, 76, 'ตัวหารเป็นทศนิยม', D1C.p, 'r4d-sm', 'start'), 'ตัวหาร 0.4 ยังเป็นทศนิยม หารยาก'],
      [d1bArr(c(0), 58, c(0) - 10, 104) + d1bArr(c(2), 58, c(2) + 6, 104) + d1bT(c(0) - 32, 86, '× 10', D1C.o, 'r4d-sm') + d1bT(c(2) + 30, 92, '× 10', D1C.o, 'r4d-sm'), 'คูณ 10 <b>ทั้งตัวตั้งและตัวหาร</b> ผลหารไม่เปลี่ยน'],
      [d1dC('23.6 ÷ !4', 200, 132, 28), 'ได้ 23.6 ÷ 4 ตัวหารเป็นจำนวนนับแล้ว'], [d1dC('= *5.9', 200, 178, 26), '23.6 ÷ 4 = <b>5.9</b>']], fin: `เลื่อนจุด<b>ตัวตั้งและตัวหารเท่ากัน</b>` }); })(),
    (() => { const P = d1dPV('56.2', { hi: 1, lo: -3, cx: 200, y0: 22, cw: 52 }), Q = d1dPV('', { hi: 1, lo: -3, cx: 200, y0: 112, cw: 52, names: false });
    return d1dBoard('หารด้วย 10, 100, 1,000', { beats: [[P.s, '56.2 อยู่ในตารางหลัก'], [Q.s, 'หารด้วย 100 เลขโดดทุกตัว<b>เลื่อนไปทางขวา 2 หลัก</b>'],
      [[[1, '5'], [0, '6'], [-1, '2']].map(([k, d]) => d1bArr(P.X(k), P.yB + 4, Q.X(k - 2), Q.y0 + 12) + d1bT(Q.X(k - 2), Q.yD, d, D1C.g, 'e4d-dg')).join('') + d1bT(Q.X(0), Q.yD, '0', D1C.p, 'e4d-dg'), '5 ไปอยู่ส่วนสิบ 6 ส่วนร้อย 2 ส่วนพัน หลักหน่วยเติม 0'],
      [d1dC('56.2 ÷ 100 = *0.562', 200, 194, 16), 'ได้ <b>0.562</b>']], fin: `÷ 10, 100, 1,000 → เลื่อนจุดไป<b>ทางซ้าย</b> 1, 2, 3 หลัก` }); })()]],
  2410: [[(() => { const bag = (x, w, lab) => `<rect x="${x}" y="40" width="${w}" height="56" rx="8" fill="#FFD9A8" stroke="${D1C.ink}" stroke-width="2"/>` + d1bT(x + w / 2, 74, lab, D1C.ink, 'r4d-sm') + d1bT(x + w / 2, 116, w > 40 ? '48.60' : '24.30', D1C.o, 'r4d-sm');
    return d1dBoard('ใช้คูณ: ราคาต่อหน่วย × จำนวน', { beats: [[bag(30, 56, '1 กก.'), 'ส้ม 1 กิโลกรัม ราคา <b>48.60 บาท</b>'], [bag(94, 56, '1 กก.') + bag(158, 28, '½'), 'ซื้อ 2.5 กิโลกรัม คือ 2 กิโลกรัมเต็ม กับอีกครึ่ง'],
      [d1dC('48.6 × 2.5', 300, 66, 22), 'ทุกกิโลกรัมราคาเท่ากัน จึงใช้<b>คูณ</b>'], [d1dC('= *121.5', 300, 106, 22), '48.6 × 2.5 = <b>121.5</b> บาท'], [d1bT(200, 170, 'ราคาต่อหน่วย × จำนวน = ราคารวม', D1C.g), 'จำไว้: ราคาต่อหน่วย คูณ จำนวน ได้<b>ราคารวม</b>']], fin: `ราคาต่อหน่วย × จำนวน = <b>ราคารวม</b>` }); })(),
    d1dBoard('ใช้หาร: แบ่งเป็นชิ้นเท่า ๆ กัน', { beats: [[`<rect x="20" y="70" width="360" height="26" rx="5" fill="#F7B5C9" stroke="${D1C.ink}" stroke-width="2"/>` + d1bT(200, 58, '7.2 เมตร'), 'ริบบิ้นยาว <b>7.2 เมตร</b>'], [d1bOv(20, 70, 22.5, 26, D1C.p, .55) + d1bT(31, 124, '0.45', D1C.p, 'r4d-sm'), 'ตัดเป็นเส้นสั้น เส้นละ <b>0.45 เมตร</b>'],
      [d1bCuts(20, 70, 360, 26, 16), 'ตัดไปเรื่อย ๆ จนหมดเส้น'], [Array.from({ length: 16 }, (_, i) => d1bT(31.25 + i * 22.5, 112, String(i + 1), D1C.b, 'r4d-sm')).join(''), 'นับได้ <b>16 เส้น</b>'],
      [d1dC('7.2 ÷ 0.45 = *16', 200, 166, 22), 'แบ่งเป็นชิ้นเท่า ๆ กัน ใช้<b>หาร</b>: ทั้งหมด ÷ ขนาดต่อชิ้น']], fin: `ทั้งหมด ÷ ขนาดต่อชิ้น = <b>จำนวนชิ้น</b>` })]],
  2411: [[d1dBoard('เศษส่วนที่เท่ากัน', { beats: [[d1dBar(100, 34, 260, 40, 2, 3) + d1bFrac(56, 60, 2, 3, D1C.b, 20), 'แถบนี้แบ่งเป็น 3 ส่วน ระบาย 2 ส่วน คือ <b>2/3</b>'], [d1bCuts(100, 34, 260, 40, 12, 4), 'แบ่งแต่ละส่วนย่อยออกเป็น <b>4 ชิ้น</b>เท่า ๆ กัน'],
      [d1dBar(100, 98, 260, 40, 8, 12, '#FBD0DC') + d1bFrac(56, 124, 8, 12, D1C.p, 20), 'ตอนนี้มี 12 ชิ้น ระบาย 8 ชิ้น คือ <b>8/12</b> ยาวเท่าเดิม'], [d1dC('{2|3} = {2~×~4|3~×~4} = {8|12}', 220, 180, 18), 'ยาวเท่ากันจึงเท่ากัน: <b>คูณทั้งเศษและส่วน</b>ด้วยจำนวนเดียวกัน']],
      fin: `คูณ (หรือหาร) <b>ทั้งเศษและส่วน</b>ด้วยจำนวนเดียวกัน ได้เศษส่วนที่เท่ากัน` })],
    [(() => { const N = d1dNL(-1, 1, { step: .25, lab: 1, x0: 60, x1: 340, y: 112, fmt: v => v < 0 ? '−1' : String(v) });
    return d1dBoard('เศษส่วนที่เป็นจำนวนลบ', { beats: [[N.s, 'เส้นจำนวนจาก −1 ถึง 1 แบ่งช่วงละ 1/4'], [N.dot(.75, D1C.b) + d1dC('{3|4}', N.X(.75), 80, 16, D1C.b), '<b>3/4</b> อยู่ทางขวาของ 0 สามช่อง'],
      [N.dot(-.75, D1C.p) + d1dC('−_ {3|4}', N.X(-.75), 80, 16, D1C.p) + d1bBrk(N.X(-.75), N.X(0), 40, '', D1C.p) + d1bBrk(N.X(0), N.X(.75), 40, '', D1C.b), '<b>−3/4</b> อยู่ทางซ้าย ห่าง 0 เท่ากัน'],
      [d1dC('−_ {3|4} = {−3|4} = {3|−4}', 200, 180, 18), 'เครื่องหมายลบเขียนได้สามแบบ มีค่าเท่ากัน']], fin: `−3/4 = (−3)/4 = 3/(−4)` }); })()]],
  2412: [[d1dBoard('ตัวส่วนเท่ากัน', { beats: [[d1dBar(110, 34, 260, 36, 5, 9) + d1bFrac(64, 58, 5, 9, D1C.b, 20), '<b>5/9</b> คือ 5 ชิ้น จาก 9 ชิ้น'], [d1dBar(110, 92, 260, 36, 7, 9, '#FBD0DC') + d1bFrac(64, 116, 7, 9, D1C.p, 20), '<b>7/9</b> คือ 7 ชิ้น ขนาดชิ้นเท่ากัน'],
      [`<path d="M${110 + 260 * 5 / 9} 28 V136" stroke="${D1C.g}" stroke-width="2" stroke-dasharray="4 3"/>` + d1dC('{5|9} *< {7|9}', 240, 176, 22), 'ชิ้นเท่ากัน ใครมีหลายชิ้นกว่า มากกว่า: <b>5/9 &lt; 7/9</b>']], fin: `ตัวส่วนเท่ากัน → <b>เทียบตัวเศษ</b>` }),
    d1dBoard('ตัวเศษเท่ากัน', { beats: [[d1dBar(110, 34, 260, 36, 3, 7) + d1bFrac(64, 58, 3, 7, D1C.b, 20), '<b>3/7</b> แบ่ง 7 ชิ้น เอา 3 ชิ้น'], [d1dBar(110, 92, 260, 36, 3, 5, '#FBD0DC') + d1bFrac(64, 116, 3, 5, D1C.p, 20), '<b>3/5</b> แบ่งแค่ 5 ชิ้น ชิ้นใหญ่กว่า เอา 3 ชิ้นเท่ากัน'],
      [`<path d="M${110 + 260 * 3 / 7} 28 V136" stroke="${D1C.g}" stroke-width="2" stroke-dasharray="4 3"/>` + d1dC('{3|7} *< {3|5}', 240, 176, 22), 'จำนวนชิ้นเท่ากัน ตัวส่วนน้อยกว่า ชิ้นใหญ่กว่า: <b>3/7 &lt; 3/5</b>']], fin: `ตัวเศษเท่ากัน → <b>ตัวส่วนน้อยกว่า มีค่ามากกว่า</b>` })]],
  2413: [[d1dBoard('ทำตัวส่วนให้เท่ากันก่อนบวก', { beats: [[d1dBar(100, 20, 240, 30, 1, 4) + d1bFrac(60, 42, 1, 4, D1C.b, 18) + d1dBar(100, 62, 240, 30, 2, 3, '#FBD0DC') + d1bFrac(60, 84, 2, 3, D1C.p, 18), 'จะบวก 1/4 กับ 2/3 แต่<b>ชิ้นขนาดไม่เท่ากัน</b>'],
      [d1bCuts(100, 20, 240, 30, 12, 3) + d1bCuts(100, 62, 240, 30, 12, 4), 'แบ่งทั้งสองแถบเป็น <b>12 ชิ้น</b> (ค.ร.น. ของ 4 กับ 3)'], [d1dC('= {3|12}', 372, 42, 16, D1C.b) + d1dC('= {8|12}', 372, 84, 16, D1C.p), '1/4 กลายเป็น <b>3/12</b> และ 2/3 กลายเป็น <b>8/12</b>'],
      [d1dBar(100, 112, 60, 30, 3, 3) + d1dBar(160, 112, 160, 30, 8, 8, '#FBD0DC') + d1dBar(320, 112, 20, 30, 0, 1), 'นำมาต่อกัน ได้ 11 ชิ้น จาก 12 ชิ้น'], [d1dC('{3|12} + {8|12} = *{11|12}', 220, 180, 18), 'ตัวส่วนเท่ากันแล้ว จึง<b>บวกเฉพาะตัวเศษ</b>']], fin: `ทำ<b>ตัวส่วนให้เท่ากัน</b>ก่อน แล้วบวกตัวเศษ` })]],
  2414: [[(() => { const L = w1dCL('(−_ {3|4} ) + {2|9} + {3|4}', 200, 48, 24);
    return d1dBoard('จับคู่จำนวนตรงข้าม', { beats: [[L.s, 'โจทย์ (−3/4) + 2/9 + 3/4'], [d1bRing(L, 0, 2) + d1bRing(L, 6, 6), '<b>−3/4 กับ 3/4</b> เป็นจำนวนตรงข้ามกัน'], [d1dC('= ( (−_ {3|4} ) + {3|4} ) + {2|9}', 200, 108, 20), 'สลับที่ให้มาอยู่ด้วยกัน'],
      [d1dC('= 0 + {2|9} = *{2|9}', 200, 166, 22), 'รวมกันได้ 0 เหลือ <b>2/9</b> ไม่ต้องหาตัวส่วนร่วมเลย']], fin: `จับคู่<b>จำนวนตรงข้าม</b> รวมกันได้ 0` }); })(),
    (() => { const L = w1dCL('{2|5} + {5|8} + {3|5}', 200, 44, 24);
    return d1dBoard('จับคู่ที่รวมกันได้ 1', { beats: [[L.s, 'โจทย์ 2/5 + 5/8 + 3/5'], [d1bRing(L, 0, 0) + d1bRing(L, 4, 4), '<b>2/5 กับ 3/5</b> ตัวส่วนเท่ากัน'], [d1dBar(100, 78, 200, 26, 2, 5) + d1bOv(180, 78, 120, 26, '#F7B5C9', .9) + d1bCuts(100, 78, 200, 26, 5, 0, D1C.ink), 'รวมกันเต็มแถบพอดี'],
      [d1dC('= ( {2|5} + {3|5} ) + {5|8} = 1 + {5|8}', 200, 140, 18), 'จับคู่ก่อน ได้ <b>1</b>'], [d1dC('= *{13|8}', 200, 186, 18), '1 + 5/8 = <b>13/8</b>']], fin: `สลับที่ให้<b>ตัวส่วนเดียวกัน</b>อยู่ติดกัน` }); })()]],
  2415: [[(() => { const N = d1dNL(-1, 1, { step: .1, lab: .5, x0: 40, x1: 360, y: 136, fmt: v => v === 0 ? '0' : v < 0 ? (v < -.75 ? '−1' : '−½') : (v > .75 ? '1' : '½') });
    return d1dBoard('ลบเศษส่วน = บวกด้วยจำนวนตรงข้าม', { beats: [[d1dC('{2|5} − (−_ {1|2} )', 110, 44, 22), 'โจทย์ 2/5 − (−1/2)'], [d1dC('= {2|5} + !{1|2}', 290, 44, 22), 'ลบด้วยจำนวนลบ เปลี่ยนเป็น<b>บวกด้วย 1/2</b>'],
      [N.s + N.dot(.4, D1C.b) + d1dC('{2|5}', N.X(.4), 188, 14, D1C.b), 'เริ่มที่ 2/5 บนเส้นจำนวน'], [N.hop(.4, .9, D1C.g, '+½', 18) + N.dot(.9, D1C.g) + d1dC('{9|10}', N.X(.9), 188, 14, D1C.g), 'เดินไปทางขวา 1/2 ถึง <b>9/10</b>']], fin: `<b>a − b = a + (−b)</b> ใช้ได้กับเศษส่วนด้วย` }); })()]],
  2416: [[d1dBoard('เหลือน้ำเท่าไร', { beats: [[d1dBar(80, 50, 240, 44, 0, 12) + d1bT(200, 36, 'น้ำเต็มถัง = 1'), 'ถังน้ำเต็มถัง ถือเป็น <b>1</b> ทั้งถัง แบ่งเป็น 12 ส่วน'], [d1bOv(80, 50, 60, 44, '#F7B5C9', .95) + d1bFrac(110, 124, 1, 4, D1C.p, 16), 'ตอนเช้าใช้ไป <b>1/4</b> ของถัง คือ 3 ใน 12 ส่วน'],
      [d1bOv(140, 50, 80, 44, '#FFD98A', .95) + d1bFrac(180, 124, 1, 3, D1C.o, 16), 'ตอนเย็นใช้อีก <b>1/3</b> คือ 4 ใน 12 ส่วน'], [d1bOv(220, 50, 100, 44, '#9FD0F0', .95) + d1bFrac(270, 124, 5, 12, D1C.b, 16) + d1bCuts(80, 50, 240, 44, 12, 0, D1C.ink), 'เหลือ <b>5 ส่วน</b> จาก 12 ส่วน'],
      [d1dC('1 − {1|4} − {1|3} = *{5|12}', 200, 178, 18), 'เขียนเป็นประโยคสัญลักษณ์: 1 − 1/4 − 1/3 = 5/12']], fin: `ทั้งหมดคือ <b>1</b> แล้วลบส่วนที่ใช้ไป` })]],
  2417: [[d1dBoard('เศษส่วนของเศษส่วน', { beats: [[d1dArea(40, 16, 175, 120, 5, 3, 0, 0, false), 'สี่เหลี่ยมนี้คือ <b>1</b> แบ่ง 5 แถวตั้ง และ 3 แถวนอน'], [d1bOv(40, 16, 105, 120, '#4FA3E0', .45) + d1bT(310, 46, 'ระบาย 3/5', D1C.b), 'ระบาย <b>3/5</b> ของรูป'],
      [d1bOv(40, 16, 105, 80, '#7C5CE0', .55) + d1bT(310, 84, '2/3 ของ 3/5', '#7C5CE0'), 'เอา <b>2/3</b> ของส่วนสีฟ้า'], [d1bT(310, 122, '6 ช่อง จาก 15', '#7C5CE0'), 'นับได้ 6 ช่อง จากทั้งหมด 15 ช่อง'],
      [d1dC('{2|3} × {3|5} = {2~×~3|3~×~5} = {6|15} = *{2|5}', 200, 176, 17), '<b>เศษคูณเศษ ส่วนคูณส่วน</b>: 2/3 × 3/5 = 6/15 = 2/5']], fin: `เศษคูณเศษ${r4vSep}ส่วนคูณส่วน` })]],
  2418: [[d1dBoard('ส่วนกลับ (อินเวอร์สการคูณ)', { beats: [[d1dC('{3|7}', 120, 56, 30), 'เศษส่วน 3/7'], [`<path d="M150 40 Q200 6 250 40" fill="none" stroke="${D1C.o}" stroke-width="2.4"/>` + d1dC('{7|3}', 280, 56, 30, D1C.p), '<b>กลับเศษเป็นส่วน</b> ได้ 7/3'],
      [d1dC('{3|7} × {7|3} = {21|21} = *1', 200, 122, 20), 'คูณกันได้ 1 พอดี เรียกว่า <b>ส่วนกลับ</b> หรืออินเวอร์สการคูณ'], [d1dC('(−_ {5|6} ) × (−_ {6|5} ) = *1', 200, 178, 18), 'จำนวนลบก็เหมือนกัน เครื่องหมายเดิม: ส่วนกลับของ −5/6 คือ <b>−6/5</b>']], fin: `จำนวน × ส่วนกลับ = <b>1</b>` })]],
  2419: [[d1dBoard('หารด้วยเศษส่วน = ใส่ได้กี่ชิ้น', { beats: [[d1dBar(100, 34, 240, 36, 6, 8) + d1bFrac(60, 58, 3, 4, D1C.b, 20), 'แถบนี้คือ <b>3/4</b> (6 ใน 8 ชิ้น)'], [`<rect x="100" y="92" width="90" height="30" rx="4" fill="#FBD0DC" stroke="${D1C.p}" stroke-width="2"/>` + d1bT(145, 113, '3/8', D1C.p, 'r4d-sm'), 'ถามว่า <b>3/8</b> ใส่ลงใน 3/4 ได้กี่ครั้ง'],
      [`<rect x="190" y="92" width="90" height="30" rx="4" fill="#FBD0DC" stroke="${D1C.p}" stroke-width="2"/>` + d1bT(235, 113, '3/8', D1C.p, 'r4d-sm'), 'ได้ <b>2 ครั้ง</b>พอดี'], [d1dC('{3|4} ÷ {3|8} = *2', 220, 172, 22), 'ดังนั้น 3/4 ÷ 3/8 = 2']], fin: `หาร = <b>ใส่ได้กี่ชิ้น</b>` }),
    d1dBoard('6 ÷ 3/4', { beats: [[Array.from({ length: 6 }, (_, i) => `<rect x="${50 + i * 50}" y="36" width="50" height="36" fill="#9FD0F0" stroke="${D1C.ink}" stroke-width="1.8"/>` + d1bT(75 + i * 50, 60, String(i + 1), D1C.ink, 'r4d-sm')).join(''), 'มีอยู่ <b>6</b> หน่วย'],
      [d1bCuts(50, 36, 300, 36, 8) + Array.from({ length: 8 }, (_, i) => d1bT(68.75 + i * 37.5, 96, String(i + 1), D1C.p, 'r4d-sm')).join(''), 'ตัดเป็นชิ้นละ 3/4 ได้ <b>8 ชิ้น</b>'], [d1dC('6 ÷ {3|4} = 6 × {4|3} = *8', 200, 156, 22), 'หารด้วย 3/4 เท่ากับ<b>คูณด้วยส่วนกลับ</b> 4/3']], fin: `÷ a/b = <b>× b/a</b>` })]],
  2420: [[d1dBoard('เศษส่วนของจำนวน', { beats: [[d1dBar(40, 60, 320, 40, 0, 7) + d1bT(200, 46, '840 บาท'), 'เงิน 840 บาท แบ่งเป็น <b>7 ส่วน</b>เท่า ๆ กัน'], [Array.from({ length: 7 }, (_, i) => d1bT(40 + 320 / 14 + i * 320 / 7, 86, '120', D1C.ink, 'r4d-sm')).join(''), 'ส่วนละ 840 ÷ 7 = <b>120</b> บาท'],
      [d1bOv(40, 60, 320 * 3 / 7, 40, '#4FA3E0', .4), 'เอา <b>3 ส่วน</b>'], [d1dC('840 × {3|7} = *360', 200, 156, 22), '3 ส่วน = <b>360</b> บาท คือ 840 × 3/7']], fin: `a/b ของจำนวน = จำนวน <b>× a/b</b>` })]],
  2421: [[d1dBoard('3/8 เป็นทศนิยมรู้จบ', { beats: [[d1dC('{3|8} = 3 ÷ 8', 200, 40, 24), 'เศษส่วนคือการหาร: 3/8 = <b>3 ÷ 8</b>'], [d1dC('30 ÷ 8 = !3 เศษ 6', 140, 92, 18), 'เติม 0 แล้วหาร ได้ <b>3</b> เหลือเศษ 6'], [d1dC('60 ÷ 8 = !7 เศษ 4', 140, 128, 18), 'หารต่อ ได้ <b>7</b> เหลือ 4'],
      [d1dC('40 ÷ 8 = !5 เศษ *0', 140, 164, 18), 'หารต่อ ได้ <b>5</b> เศษ 0 หารลงตัวแล้ว'], [d1dC('= *0.375', 320, 128, 24) + d1bT(320, 164, 'ทศนิยมรู้จบ', D1C.g, 'r4d-sm'), 'ได้ <b>0.375</b> เป็นทศนิยมรู้จบ']], fin: `หารลงตัว → <b>ทศนิยมรู้จบ</b>` }),
    d1dBoard('2/3 เป็นทศนิยมซ้ำ', { beats: [[d1dC('{2|3} = 2 ÷ 3', 200, 40, 24), '2/3 = <b>2 ÷ 3</b>'], [d1dC('20 ÷ 3 = !6 เศษ ^2', 140, 92, 18), 'เติม 0 แล้วหาร ได้ <b>6</b> เหลือเศษ 2'], [d1dC('20 ÷ 3 = !6 เศษ ^2', 140, 128, 18), 'เศษ 2 <b>กลับมาอีก</b> หารแล้วได้ 6 ซ้ำเดิม'],
      [d1dC('20 ÷ 3 = 6 เศษ 2', 140, 164, 18, D1C.fade) + d1bT(140, 192, '… ไม่จบ', D1C.fade, 'r4d-sm'), 'วนซ้ำไปเรื่อย ๆ ไม่จบ'], [d1bT(320, 92, '0.666…', D1C.ink, 'r4d-tx') + d1dDots('0.6', [2], 320, 140), 'เขียน 0.666… ย่อโดย<b>ใส่จุดบนเลขที่ซ้ำ</b> เรียกว่าทศนิยมซ้ำ']], fin: `เศษวนกลับมา → <b>ทศนิยมซ้ำ</b>` })]]
};

const D1D_TEACH = {
  /* ด่าน 1 ค่าประจำหลักของทศนิยม */
  2401: L => { const P = d1dPV('47.385'), Q = d1dPV('52.384'), R = d1dPV('40.502', { digits: false });
    return [
      ...D1B[2401][0],
      d1dTry(2401, ['pl', 'pvv'], 'หลักและค่าประจำหลัก'),
      r4dShow('เขียน 52.384 ในรูปกระจาย', { fig: Q.s, q: 'เขียน 52.384 ในรูปกระจาย',
        steps: [{ ink: Q.cell(1, D1C.y, '5') + Q.cell(0, D1C.y, '2'), w: '50 + 2', n: 'หน้าจุด: สิบ หน่วย' },
          { ink: Q.cell(-1, D1C.sky, '3') + Q.cell(-2, D1C.sky, '8') + Q.cell(-3, D1C.sky, '4'), w: '+ 0.3 + 0.08 + 0.004', wa: 1, n: 'หลังจุด: ค่าของแต่ละหลัก' },
          { w: `(5 × 10) + (2 × 1)`, n: 'เลขโดด × ค่าประจำหลัก' }, { w: `+ (3 × ${fqHTML(1, 10)}) + (8 × ${fqHTML(1, 100)})`, n: 'ส่วนสิบ ส่วนร้อย' }, { w: `+ (4 × ${fqHTML(1, 1000)})`, n: 'ครบทุกหลัก', ans: 1 }],
        dense: true, fin: `รูปกระจาย = <b>เลขโดด × ค่าประจำหลัก</b> ของทุกหลักบวกกัน`, say: 'รูปกระจาย คือเลขโดดคูณค่าประจำหลักของทุกหลักบวกกัน' }),
      d1dTry(2401, ['val', 'exp', 'read'], 'ค่าของเลขโดด รูปกระจาย'),
      r4dShow('รูปกระจาย → ทศนิยม', { fig: R.s, q: `เขียน (4 × 10) + (5 × ${fqHTML(1, 10)}) + (2 × ${fqHTML(1, 1000)}) เป็นทศนิยม`,
        steps: [{ ink: R.cell(1, D1C.y, '4'), w: '4 × 10 → หลักสิบ 4', n: 'วางเลขโดดตามค่าประจำหลัก' }, { ink: R.cell(-1, D1C.sky, '5') + R.cell(-3, D1C.sky, '2'), w: '5 ส่วนสิบ และ 2 ส่วนพัน', n: 'หลังจุด' },
          { ink: `<g>${d1dT(R.X(0), R.yD, '0', D1C.p, 'e4d-dg')}${d1dT(R.X(-2), R.yD, '0', D1C.p, 'e4d-dg')}</g>`, w: 'หลักที่ไม่มี เติม 0', n: 'หน่วย ส่วนร้อย = 0' }, { w: '= 40.502', n: 'อ่านจากตาราง', ans: 1 }],
        fin: `วางเลขโดดลงหลัก แล้ว<b>เติม 0</b> ในหลักที่ไม่มี`, say: 'วางเลขโดดลงหลัก แล้วเติมศูนย์ในหลักที่ไม่มี' }),
      d1dTry(2401, ['fexp', 'pow', 'x10'], 'รูปกระจายเป็นทศนิยม')]; },

  /* ด่าน 2 ค่าสัมบูรณ์และการเปรียบเทียบ */
  2402: L => { const A = d1dNL(-4, 4, { step: .25, lab: 1, y: 140 }), B = d1dNL(-2, 0, { step: .05, lab: .5, y: 140 }), C = d1dNL(-3, -2, { step: .1, lab: .5, y: 170 });
    return [
      ...D1B[2402][0],
      d1dTry(2402, ['abs', 'absw'], 'ค่าสัมบูรณ์'),
      ...D1B[2402][1],
      r4dShow('เปรียบเทียบ −2.08 กับ −2.8', { fig: d1dC('−2.08 !? −2.8', 180, 46, 30) + C.s, q: 'เติม &gt; หรือ &lt; : −2.08 ◯ −2.8',
        steps: [{ ink: d1dC('|−2.08| = 2.08    |−2.8| = 2.80', 180, 96, 18), w: '2.08 กับ 2.80', n: 'ดูค่าสัมบูรณ์ เติม 0 ให้ตำแหน่งเท่ากัน' }, { w: '2.08 < 2.80', n: 'ส่วนสิบ 0 < 8' },
          { ink: C.dot(-2.08, D1C.b) + C.dot(-2.8, D1C.p) + C.mark(-2.08, '−2.08', D1C.b, -16) + C.mark(-2.8, '−2.8', D1C.p, -16), w: '−2.08 อยู่ทางขวา', n: 'จำนวนลบ: ค่าสัมบูรณ์น้อยกว่า อยู่ใกล้ 0 กว่า' }, { w: '−2.08 > −2.8', n: 'ทางขวามากกว่า', ans: 1 }],
        fin: `จำนวนลบ: <b>ค่าสัมบูรณ์มากกว่า มีค่าน้อยกว่า</b>`, say: 'จำนวนลบ ค่าสัมบูรณ์มากกว่า มีค่าน้อยกว่า' }),
      d1dTry(2402, ['c1', 'c2', 'c3'], 'เปรียบเทียบทศนิยม'),
      d1dTry(2402, ['mx', 'mn', 'ord'], 'มากที่สุด น้อยที่สุด เรียงลำดับ')]; },

  /* ด่าน 3 การบวกทศนิยม */
  2403: L => { const A = d1dNL(-6, 1, { step: .25, lab: 1 }), B = d1dNL(-5, 0, { step: .25, lab: 1 });
    return [
      d1dCol('ตั้งบวก 3.75 + 1.4', '3.75', '1.4', '+', { fin: `ตั้ง<b>จุดให้ตรงกัน</b> เติม 0 ให้ตำแหน่งเท่ากัน แล้วบวกจากขวา`, say: 'ตั้งจุดให้ตรงกัน เติมศูนย์ แล้วบวกจากขวา' }),
      d1dTry(2403, ['p'], 'บวกทศนิยมบวก'),
      ...D1B[2403][0],
      d1dEq('(−5.2) + 3.85 ด้วยค่าสัมบูรณ์', [{ e: '(−5.2) + 3.85' }, { e: '|−5.2| = !5.20 , |3.85| = ^3.85', w: 'เครื่องหมายต่างกัน', n: 'ดูค่าสัมบูรณ์' }, { e: '5.20 − 3.85 = 1.35', w: 'ลบค่าสัมบูรณ์', n: 'มาก − น้อย' },
        { e: '(−5.2) + 3.85 = *−1.35', w: 'ใช้เครื่องหมายของ −5.2', n: '|−5.2| มากกว่า → ผลเป็นลบ', ans: 1 }], { q: 'หาค่า (−5.2) + 3.85', fin: `ต่างเครื่องหมาย: <b>ลบค่าสัมบูรณ์</b>${r4vSep}ใช้เครื่องหมายของตัวที่ค่าสัมบูรณ์มากกว่า`, say: 'ต่างเครื่องหมาย ลบค่าสัมบูรณ์ ใช้เครื่องหมายของตัวที่ค่าสัมบูรณ์มากกว่า' }),
      d1dTry(2403, ['nn', 'pn', 'np', 'inv', 'sg'], 'บวกทศนิยมบวกลบ'),
      d1dTry(2403, ['pn2', 'tri', 'st'], 'บวกหลายจำนวน โจทย์')]; },

  /* ด่าน 4 สมบัติของการบวกทศนิยม */
  2404: L => { const N = d1dNL(-10, 10, { step: 1, lab: 5, y: 150 });
    return [
      ...D1B[2404][0],
      d1dTry(2404, ['cm', 'as', 'id', 'inv', 'fill'], 'ชื่อสมบัติ เติมจำนวน'),
      d1dEq('คิดลัด 6.73 + (−2.5) + 3.27', [{ e: '6.73 + (−2.5) + 3.27' }, { e: '= !6.73 + !3.27 + (−2.5)', w: 'สลับที่', n: '.73 กับ .27 รวมกันลงตัว', ex: Ls => e1dUnder(Ls[1], 1, 3) },
        { e: '= !10 + (−2.5)', w: '6.73 + 3.27 = 10', n: 'รวมคู่ที่ลงตัวก่อน' }, { e: '= *7.5', w: 'ตอบ 7.5', n: '10 − 2.5', ans: 1 }], { q: 'หาค่า 6.73 + (−2.5) + 3.27 อย่างง่าย', fin: `<b>สลับที่ เปลี่ยนหมู่</b> ให้คู่ที่รวมกันลงตัวอยู่ติดกัน`, say: 'สลับที่ เปลี่ยนหมู่ ให้คู่ที่รวมกันลงตัวอยู่ติดกัน' }),
      d1dTry(2404, ['smart', 'smart2'], 'คิดลัด')]; },

  /* ด่าน 5 การลบทศนิยม */
  2405: L => { const A = d1dNL(-1, 8, { step: .25, lab: 1 });
    return [
      ...D1B[2405][0],
      d1dCol('ตั้งลบ 7.25 − 3.6', '7.25', '3.6', '−', { fin: `ตั้ง<b>จุดให้ตรงกัน</b> เติม 0 แล้วลบจากขวา`, say: 'ตั้งจุดให้ตรงกัน เติมศูนย์ แล้วลบจากขวา' }),
      d1dTry(2405, ['pp', 'rw'], 'ลบทศนิยม'),
      d1dEq('2.4 − 5.15', [{ e: '2.4 − 5.15' }, { e: '= 2.4 + !(−5.15)', w: 'ลบ → บวกจำนวนตรงข้าม', n: 'เปลี่ยนเป็นการบวก' }, { e: '5.15 − 2.40 = 2.75', w: 'ต่างเครื่องหมาย ลบค่าสัมบูรณ์', n: 'มาก − น้อย' },
        { e: '= *−2.75', w: 'ตอบ −2.75', n: '|−5.15| มากกว่า → ลบ', ans: 1 }], { q: 'หาค่า 2.4 − 5.15', fin: `ตัวลบมากกว่าตัวตั้ง → <b>ผลลบเป็นจำนวนลบ</b>`, say: 'ตัวลบมากกว่าตัวตั้ง ผลลบเป็นจำนวนลบ' }),
      d1dTry(2405, ['neg', 'nm'], 'ผลลบเป็นจำนวนลบ'),
      d1dEq('(−1.8) − (−6.05)', [{ e: '(−1.8) − (−6.05)' }, { e: '= (−1.8) + !6.05', w: 'ลบด้วยจำนวนลบ = บวก', n: 'เปลี่ยนการลบ' }, { e: '6.05 − 1.80 = 4.25', w: 'ลบค่าสัมบูรณ์', n: 'ต่างเครื่องหมาย' }, { e: '= *4.25', w: 'ตอบ 4.25', n: '|6.05| มากกว่า → บวก', ans: 1 }],
        { q: 'หาค่า (−1.8) − (−6.05)', fin: `<b>a − b = a + (−b)</b> แล้วใช้กฎการบวก`, say: 'a ลบ b เท่ากับ a บวกจำนวนตรงข้ามของ b แล้วใช้กฎการบวก' }),
      d1dTry(2405, ['mm', 'mn', 'mx', 'miss'], 'ลบด้วยจำนวนลบ')]; },

  /* ด่าน 6 โจทย์ปัญหาบวกลบทศนิยม */
  2406: L => { const th = (x, v, col, lab) => { const y = 120 - v * 16; return `<path d="M${x} ${a4n(y)} H${x + 70}" stroke="${col}" stroke-width="3" stroke-dasharray="5 4"/>` + d1dT(x + 76, y + 5, lab, col, 'r4d-sm', 'start'); };
    const TH = `<rect x="70" y="30" width="22" height="180" rx="11" fill="#fff" stroke="${D1C.ink}" stroke-width="2"/><circle cx="81" cy="214" r="16" fill="#F2706F" stroke="${D1C.ink}" stroke-width="2"/><rect x="77" y="64" width="8" height="150" fill="#F2706F"/>` + [-5, 0, 5].map(v => `<path d="M92 ${120 - v * 16} h10" stroke="${D1C.ink}" stroke-width="2"/>` + d1dT(60, 125 - v * 16, String(v).replace('-', '−'), D1C.ink, 'r4d-sm', 'end')).join('');
    return [
      ...D1B[2406][0],
      d1dTry(2406, ['run', 'sent', 'temp', 'cmp'], 'เขียนประโยคสัญลักษณ์'),
      d1dEq('เงินในบัญชี', [{ e: '1,250.75 − 480.50 + 312.25' }, { e: '= !770.25 + 312.25', w: 'ถอน 480.50 → ลบ', n: '1,250.75 − 480.50' }, { e: '= *1,082.50', w: 'ฝาก 312.25 → บวก', n: 'ตอบ 1,082.50 บาท', ans: 1 }],
        { q: 'มีเงิน 1,250.75 บาท ถอน 480.50 บาท แล้วฝากเพิ่ม 312.25 บาท ตอนนี้มีเงินเท่าใด', fin: `ถอน = <b>ลบ</b>${r4vSep}ฝาก = <b>บวก</b>${r4vSep}ทำจากซ้ายไปขวา`, say: 'ถอนคือลบ ฝากคือบวก ทำจากซ้ายไปขวา' }),
      d1dEq('ราคาหุ้น 3 วัน', [{ e: '2.35 + (−4.1) + 1.25' }, { e: '= !(−1.75) + 1.25', w: '2.35 + (−4.1) = −1.75', n: 'วันที่ 1 กับ 2' }, { e: '= *−0.5', w: 'ลดลง 0.50 บาท', n: 'ผลเป็นลบ = ราคาลดลง', ans: 1 }],
        { q: 'ราคาหุ้นเปลี่ยน +2.35 −4.1 และ +1.25 บาท รวมแล้วเปลี่ยนไปเท่าใด', fin: `เพิ่มขึ้นใช้<b>จำนวนบวก</b> ลดลงใช้<b>จำนวนลบ</b>`, say: 'เพิ่มขึ้นใช้จำนวนบวก ลดลงใช้จำนวนลบ' }),
      d1dTry(2406, ['bank', 'sea', 'w', 'stk'], 'โจทย์ปัญหา')]; },

  /* ด่าน 7 การคูณทศนิยม */
  2407: L => { const P = d1dPV('4.83', { hi: 2, lo: -2 }), P2 = d1dPV('483', { hi: 2, lo: -2, y0: 128 });
    return [
      ...D1B[2407][0],
      d1dTry(2407, ['ten', 'pp', 'ten2'], 'คูณทศนิยม'),
      d1dEq('1.25 × 0.08', [{ e: '1.25 × 0.08' }, { e: '125 × 8 = !1000', w: 'คูณแบบจำนวนนับ', n: 'ไม่สนใจจุดก่อน' }, { e: '2 + 2 = ^4', w: 'ทศนิยม 2 + 2 = 4 ตำแหน่ง', n: 'นับตำแหน่งทศนิยมทั้งสองตัว' },
        { e: '= 0.1000 = *0.1', w: 'นับจากขวา 4 ตำแหน่ง', n: 'ตัด 0 ท้ายได้', ans: 1 }], { q: 'หาค่า 1.25 × 0.08', fin: `คูณแบบจำนวนนับ แล้ว<b>นับตำแหน่งทศนิยมรวม</b>`, say: 'คูณแบบจำนวนนับ แล้วนับตำแหน่งทศนิยมรวม' }),
      d1dTry(2407, ['pp2', 'dp'], 'นับตำแหน่งทศนิยม'),
      d1dEq('(−0.35) × (−0.2)', [{ e: '(−0.35) × (−0.2)' }, { e: '35 × 2 = 70', w: 'คูณแบบจำนวนนับ', n: '' }, { e: '0.35 × 0.2 = 0.070', w: 'ทศนิยม 2 + 1 = 3 ตำแหน่ง', n: 'นับตำแหน่ง' },
        { e: '(−) × (−) = !(+)', w: 'ลบ × ลบ = บวก', n: 'เครื่องหมายเหมือนกัน' }, { e: '= *0.07', w: 'ตอบ 0.07', n: '', ans: 1 }], { q: 'หาค่า (−0.35) × (−0.2)', fin: `เครื่องหมาย<b>เหมือนกัน</b>ได้บวก${r4vSep}<b>ต่างกัน</b>ได้ลบ`, say: 'เครื่องหมายเหมือนกันได้บวก ต่างกันได้ลบ' }),
      d1dTry(2407, ['pn', 'nn', 'sq', 'tri'], 'คูณทศนิยมบวกลบ')]; },

  /* ด่าน 8 สมบัติของการคูณทศนิยม */
  2408: L => [
    ...D1B[2408][0],
    d1dTry(2408, ['cm', 'id', 'z', 'ds'], 'สมบัติการคูณ'),
    d1dEq('0.25 × (−7.3) × 4', [{ e: '0.25 × (−7.3) × 4' }, { e: '= (_ !0.25 × !4) × (−7.3)', w: 'สลับที่ เปลี่ยนหมู่', n: 'จับคู่ 0.25 กับ 4' }, { e: '= 1 × (−7.3)', w: '0.25 × 4 = 1', n: '' }, { e: '= *−7.3', w: 'ตอบ −7.3', n: '1 เป็นเอกลักษณ์', ans: 1 }],
      { q: 'หาค่า 0.25 × (−7.3) × 4 อย่างง่าย', fin: `สลับที่ให้<b>คู่ที่คูณกันลงตัว</b>มาอยู่ด้วยกัน`, say: 'สลับที่ให้คู่ที่คูณกันลงตัวมาอยู่ด้วยกัน' }),
    d1dEq('2.5 × 4.6 + 2.5 × 5.4', [{ e: '!2.5 × 4.6 + !2.5 × 5.4' }, { e: '= !2.5 × (4.6 + 5.4)', w: 'ดึงตัวร่วม 2.5 ออก', n: 'สมบัติการแจกแจง' }, { e: '= 2.5 × 10', w: '4.6 + 5.4 = 10', n: '' }, { e: '= *25', w: 'ตอบ 25', n: '', ans: 1 }],
      { q: 'หาค่า 2.5 × 4.6 + 2.5 × 5.4', fin: `<b>a × b + a × c = a × (b + c)</b>`, say: 'a คูณ b บวก a คูณ c เท่ากับ a คูณ b บวก c' }),
    d1dEq('1.8 × 102', [{ e: '1.8 × 102' }, { e: '= 1.8 × (_ !100 + !2)', w: '102 = 100 + 2', n: 'แยกให้คูณง่าย' }, { e: '= 180 + 3.6', w: '1.8 × 100 + 1.8 × 2', n: 'แจกแจง' }, { e: '= *183.6', w: 'ตอบ 183.6', n: '', ans: 1 }],
      { q: 'หาค่า 1.8 × 102', fin: `แยกจำนวนเป็น<b>100 + 2</b> แล้วแจกแจง`, say: 'แยกจำนวนเป็นร้อยบวกสอง แล้วแจกแจง' }),
    d1dTry(2408, ['smart', 'dist', 'dist2', 'dist3'], 'คิดลัดด้วยสมบัติ')],

  /* ด่าน 9 การหารทศนิยม */
  2409: L => [
    ...D1B[2409][0],
    d1dTry(2409, ['ten', 'mv', 'pp'], 'หารทศนิยม'),
    d1dEq('0.081 ÷ 0.27', [{ e: '0.081 ÷ 0.27' }, { e: '= !8.1 ÷ !27', w: '× 100 ทั้งคู่', n: 'ตัวหารเป็นจำนวนนับ' }, { e: '81 ÷ 27 = 3', w: 'หารแบบจำนวนนับ', n: '' }, { e: '= *0.3', w: 'ตอบ 0.3', n: '8.1 มีทศนิยม 1 ตำแหน่ง', ans: 1 }],
      { q: 'หาค่า 0.081 ÷ 0.27', fin: `เลื่อนจุด<b>ตัวตั้งและตัวหารเท่ากัน</b> จนตัวหารเป็นจำนวนนับ`, say: 'เลื่อนจุดตัวตั้งและตัวหารเท่ากัน จนตัวหารเป็นจำนวนนับ' }),
    d1dEq('(−1.44) ÷ (−0.12)', [{ e: '(−1.44) ÷ (−0.12)' }, { e: '1.44 ÷ 0.12 = !144 ÷ !12', w: '× 100 ทั้งคู่', n: 'ค่าสัมบูรณ์' }, { e: '= 12', w: '144 ÷ 12 = 12', n: '' }, { e: '(−) ÷ (−) = *12', w: 'ลบ ÷ ลบ = บวก', n: 'ตอบ 12', ans: 1 }],
      { q: 'หาค่า (−1.44) ÷ (−0.12)', fin: `กฎเครื่องหมายของ<b>การหารเหมือนการคูณ</b>`, say: 'กฎเครื่องหมายของการหารเหมือนการคูณ' }),
    d1dTry(2409, ['np', 'nn', 'pn', 'pp2', 'mix'], 'หารทศนิยมบวกลบ')],

  /* ด่าน 10 โจทย์ปัญหาคูณหารทศนิยม */
  2410: L => { const rib = on => `<rect x="30" y="80" width="300" height="20" rx="4" fill="#F7B5C9" stroke="${D1C.ink}" stroke-width="1.6"/>` + (on ? r4vH(Array.from({ length: 15 }, (_, i) => `<path d="M${30 + (i + 1) * 300 / 16} 72 V108" stroke="${D1C.p}" stroke-width="2" stroke-dasharray="3 3"/>`).join('') + d1dT(180, 150, '7.2 ÷ 0.45 = 16 เส้น', D1C.g, 'r4v-tx')) : '') + d1dT(180, 60, '7.2 เมตร', D1C.ink, 'r4d-tx');
    return [
      ...D1B[2410][0],
      d1dTry(2410, ['buy', 'area', 'avg'], 'คูณหรือหาร'),
      d1dEq('ริบบิ้น 7.2 ม. ตัดเส้นละ 0.45 ม.', [{ e: '7.2 ÷ 0.45' }, { e: '= !720 ÷ !45', w: '× 100 ทั้งคู่', n: 'ตัวหารเป็นจำนวนนับ' }, { e: '= *16', w: 'ได้ 16 เส้น', n: '45 × 16 = 720 ✓', ans: 1 }],
        { q: 'ริบบิ้นยาว 7.2 เมตร ตัดเป็นเส้นละ 0.45 เมตร ได้กี่เส้น', fin: `ตรวจ: <b>ผลหาร × ตัวหาร = ตัวตั้ง</b>`, say: 'ตรวจคำตอบ ผลหารคูณตัวหารเท่ากับตัวตั้ง' }),
      d1dEq('อุณหภูมิลดลงชั่วโมงละ 1.5 องศา', [{ e: '2 + 3.5 × (−1.5)' }, { e: '= 2 + !(−5.25)', w: '3.5 × (−1.5) = −5.25', n: 'คูณก่อน: ลดลงรวม' }, { e: '= *−3.25', w: 'อุณหภูมิ −3.25 °C', n: '2 − 5.25', ans: 1 }],
        { q: 'ตอนแรก 2 °C ลดลงชั่วโมงละ 1.5 องศา ผ่านไป 3.5 ชั่วโมง อุณหภูมิเท่าใด', fin: `<b>คูณ หาร ก่อน บวก ลบ</b>`, say: 'คูณหารก่อน บวกลบ' }),
      d1dTry(2410, ['cut', 'unit', 'wheel', 'chg', 'temp', 'dist'], 'โจทย์ปัญหา')]; },

  /* ด่าน 11 ความหมายของเศษส่วน */
  2411: L => { const N = d1dNL(-1, 1, { step: .25, lab: 1, y: 140, fmt: v => v < 0 ? '−' + (-v) : String(v) });
    return [
      ...D1B[2411][0],
      d1dTry(2411, ['shade', 'eq'], 'เศษส่วนที่เท่ากัน'),
      d1dEq('18/24 เป็นเศษส่วนอย่างต่ำ', [{ e: '{18|24}' }, { e: '= {18~÷~6|24~÷~6}', w: 'ห.ร.ม. ของ 18 กับ 24 คือ 6', n: 'หารทั้งเศษและส่วน' }, { e: '= *{3|4}', w: 'ตอบ 3/4', n: '3 กับ 4 หารร่วมไม่ได้แล้ว', ans: 1 }],
        { q: 'เขียน 18/24 เป็นเศษส่วนอย่างต่ำ', fin: `หารทั้งเศษและส่วนด้วย <b>ห.ร.ม.</b>`, say: 'หารทั้งเศษและส่วนด้วย ห ร ม' }),
      d1dEq('17/5 เป็นจำนวนคละ', [{ e: '{17|5}' }, { e: '17 ÷ 5 = !3 เศษ ^2', w: 'หาร', n: 'ได้เต็ม 3 เหลือ 2 ส่วน' }, { e: '= !3_ {^2|5}', w: 'ได้ 3 2/5', n: 'ผลหารเป็นจำนวนเต็ม เศษเป็นตัวเศษ' },
        { e: '3_ {2|5} = {3~×~5~+~2|5} = *{17|5}', w: 'ตรวจกลับ ✓ ตอบ 3 2/5', n: 'จำนวนคละ → เศษเกิน', ans: 1 }], { q: 'เขียน 17/5 เป็นจำนวนคละ', fin: `เศษเกิน → จำนวนคละ: <b>หาร</b>${r4vSep}จำนวนคละ → เศษเกิน: <b>เต็ม × ส่วน + เศษ</b>`, say: 'เศษเกินเป็นจำนวนคละใช้หาร จำนวนคละเป็นเศษเกิน เอาจำนวนเต็มคูณตัวส่วนบวกตัวเศษ' }),
      d1dTry(2411, ['low', 'imp', 'mix'], 'อย่างต่ำ จำนวนคละ'),
      ...D1B[2411][1],
      d1dTry(2411, ['nl', 'neg'], 'เศษส่วนลบ')]; },

  /* ด่าน 12 การเปรียบเทียบเศษส่วน */
  2412: L => { const N = d1dNL(-1, 0, { step: 1 / 12, lab: 1, y: 170, fmt: v => v < 0 ? '−1' : '0' });
    return [
      ...D1B[2412][0],
      d1dTry(2412, ['sd', 'sn'], 'เปรียบเทียบเศษส่วน'),
      d1dEq('เปรียบเทียบ 5/6 กับ 7/8', [{ e: '{5|6} !? {7|8}' }, { e: '{5|6} = {!20|24}', w: 'ค.ร.น. ของ 6 กับ 8 คือ 24', n: 'ทำตัวส่วนให้เท่ากัน' }, { e: '{7|8} = {!21|24}', w: '7 × 3 = 21', n: '' }, { e: '{5|6} *< {7|8}', w: '20 < 21', n: 'เทียบตัวเศษ', ans: 1 }],
        { q: 'เติม &gt; หรือ &lt; : 5/6 ◯ 7/8', fin: `ทำ<b>ตัวส่วนให้เท่ากัน</b> แล้วเทียบตัวเศษ`, say: 'ทำตัวส่วนให้เท่ากัน แล้วเทียบตัวเศษ' }),
      r4dShow('เปรียบเทียบ −2/3 กับ −3/4', { ...e1dEq([{ e: '−_ {2|3} !? −_ {3|4}' }, { e: '{2|3} = {8|12} , {3|4} = {9|12}', w: 'ค่าสัมบูรณ์ 8/12 กับ 9/12', n: 'ตัวส่วน 12' },
        { e: '−_ {2|3} *> −_ {3|4}', w: 'ค่าสัมบูรณ์มากกว่า มีค่าน้อยกว่า', n: '−2/3 อยู่ใกล้ 0 กว่า', ans: 1, ex: () => N.s + N.dot(-2 / 3, D1C.b) + N.dot(-3 / 4, D1C.p) + N.mark(-2 / 3, '−8/12', D1C.b, -14) + N.mark(-3 / 4, '−9/12', D1C.p, 30) }], { q: 'เติม &gt; หรือ &lt; : −2/3 ◯ −3/4' }), fin: `จำนวนลบ: <b>ค่าสัมบูรณ์มากกว่า มีค่าน้อยกว่า</b>`, say: 'จำนวนลบ ค่าสัมบูรณ์มากกว่า มีค่าน้อยกว่า' }),
      d1dTry(2412, ['cx', 'ng', 'lt'], 'เปรียบเทียบด้วยตัวส่วนร่วม'),
      d1dTry(2412, ['mx', 'mn', 'btw'], 'มากที่สุด น้อยที่สุด')]; },

  /* ด่าน 13 การบวกเศษส่วน */
  2413: L => [
    ...D1B[2413][0],
    d1dTry(2413, ['sd', 'lcm', 'dd'], 'บวกเศษส่วน'),
    d1dEq('3/8 + 1/6', [{ e: '{3|8} + {1|6}' }, { e: '= {!9|24} + {!4|24}', w: 'ค.ร.น. ของ 8 กับ 6 คือ 24', n: 'ทำตัวส่วนให้เท่ากัน' }, { e: '= *{13|24}', w: 'ตอบ 13/24', n: 'บวกเฉพาะตัวเศษ', ans: 1 }],
      { q: 'หาค่า 3/8 + 1/6', fin: `ตัวส่วนเท่ากันด้วย <b>ค.ร.น.</b> แล้วบวกตัวเศษ`, say: 'ทำตัวส่วนเท่ากันด้วย ค ร น แล้วบวกตัวเศษ' }),
    d1dEq('(−5/6) + 1/4', [{ e: '(−_ {5|6} ) + {1|4}' }, { e: '= (−_ {!10|12} ) + {!3|12}', w: 'ตัวส่วน 12', n: 'ทำตัวส่วนให้เท่ากัน' }, { e: '= *−_ {7|12}', w: '10 − 3 = 7 ใช้เครื่องหมายลบ', n: 'ต่างเครื่องหมาย ลบค่าสัมบูรณ์', ans: 1 }],
      { q: 'หาค่า (−5/6) + 1/4', fin: `กฎเครื่องหมายเหมือนการบวก<b>จำนวนเต็ม</b>`, say: 'กฎเครื่องหมายเหมือนการบวกจำนวนเต็ม' }),
    d1dTry(2413, ['np', 'nn'], 'บวกเศษส่วนบวกลบ'),
    d1dEq('1 3/8 + 2 5/6', [{ e: '1_ {3|8} + 2_ {5|6}' }, { e: '= {11|8} + {17|6}', w: 'เปลี่ยนเป็นเศษเกิน', n: '1 × 8 + 3 , 2 × 6 + 5' }, { e: '= {!33|24} + {!68|24}', w: 'ตัวส่วน 24', n: '' }, { e: '= *{101|24} = *4_ {*5|24}', w: 'ตอบ 4 5/24', n: '101 ÷ 24 = 4 เศษ 5', ans: 1 }],
      { q: 'หาค่า 1 3/8 + 2 5/6', fin: `จำนวนคละ: <b>เปลี่ยนเป็นเศษเกิน</b>ก่อน`, say: 'จำนวนคละ เปลี่ยนเป็นเศษเกินก่อน' }),
    d1dTry(2413, ['mx', 'tri', 'mn'], 'จำนวนคละ หลายจำนวน')],

  /* ด่าน 14 สมบัติของการบวกเศษส่วน */
  2414: L => { const N = d1dNL(-1, 1, { step: .25, lab: 1, y: 150, fmt: v => v < 0 ? '−1' : String(v) });
    return [
      ...D1B[2414][0],
      d1dTry(2414, ['cm', 'inv', 'id', 'as', 'fill'], 'สมบัติการบวก'),
      d1dEq('2/5 + 5/8 + 3/5', [{ e: '{2|5} + {5|8} + {3|5}' }, { e: '= ( {!2|5} + {!3|5} ) + {5|8}', w: 'สลับที่ เปลี่ยนหมู่', n: 'ส่วน 5 อยู่ด้วยกัน' }, { e: '= 1 + {5|8}', w: '2/5 + 3/5 = 1', n: '' }, { e: '= *{13|8}', w: 'ตอบ 13/8 = 1 5/8', n: '', ans: 1 }],
        { q: 'หาค่า 2/5 + 5/8 + 3/5 อย่างง่าย', fin: `สลับที่ให้<b>ตัวส่วนเดียวกัน</b>หรือ<b>จำนวนตรงข้าม</b>อยู่ติดกัน`, say: 'สลับที่ให้ตัวส่วนเดียวกันหรือจำนวนตรงข้ามอยู่ติดกัน' }),
      d1dTry(2414, ['smart', 'smart2', 'smart3'], 'คิดลัด')]; },

  /* ด่าน 15 การลบเศษส่วน */
  2415: L => { const N = d1dNL(-1, 1, { step: .1, lab: .5, y: 150, fmt: v => v === 0 ? '0' : v < 0 ? (v === -1 ? '−1' : '−½') : (v === 1 ? '1' : '½') });
    return [
      ...D1B[2415][0],
      d1dTry(2415, ['sd', 'rw', 'dd'], 'ลบเศษส่วน'),
      d1dEq('1/3 − 3/4', [{ e: '{1|3} − {3|4}' }, { e: '= {!4|12} − {!9|12}', w: 'ตัวส่วน 12', n: 'ทำตัวส่วนให้เท่ากัน' }, { e: '= *−_ {5|12}', w: '4 − 9 = −5', n: 'ตัวลบมากกว่า ผลเป็นลบ', ans: 1 }],
        { q: 'หาค่า 1/3 − 3/4', fin: `ทำตัวส่วนให้เท่ากัน แล้ว<b>ลบตัวเศษ</b> (ระวังเครื่องหมาย)`, say: 'ทำตัวส่วนให้เท่ากัน แล้วลบตัวเศษ ระวังเครื่องหมาย' }),
      d1dTry(2415, ['neg', 'mm', 'nn'], 'ลบเศษส่วนบวกลบ'),
      d1dEq('4 1/3 − 2 3/4', [{ e: '4_ {1|3} − 2_ {3|4}' }, { e: '= {13|3} − {11|4}', w: 'เปลี่ยนเป็นเศษเกิน', n: '' }, { e: '= {!52|12} − {!33|12}', w: 'ตัวส่วน 12', n: '' }, { e: '= *{19|12} = *1_ {*7|12}', w: 'ตอบ 1 7/12', n: '', ans: 1 }],
        { q: 'หาค่า 4 1/3 − 2 3/4', fin: `จำนวนคละ: <b>เศษเกินก่อน</b> แล้วทำตัวส่วนให้เท่ากัน`, say: 'จำนวนคละ เปลี่ยนเป็นเศษเกินก่อน แล้วทำตัวส่วนให้เท่ากัน' }),
      d1dTry(2415, ['mx', 'big'], 'ลบจำนวนคละ')]; },

  /* ด่าน 16 โจทย์ปัญหาบวกลบเศษส่วน */
  2416: L => [
    ...D1B[2416][0],
    d1dTry(2416, ['flour', 'sent', 'rib'], 'ประโยคสัญลักษณ์'),
    d1dEq('ที่ดินที่เหลือ', [{ e: '1 − ( {1|3} + {2|5} )' }, { e: '= 1 − ( {!5|15} + {!6|15} )', w: 'ข้าว + ข้าวโพด', n: 'ตัวส่วน 15' }, { e: '= {15|15} − {11|15}', w: 'ทั้งแปลง = 15/15', n: '' }, { e: '= *{4|15}', w: 'เหลือ 4/15 ของแปลง', n: '', ans: 1 }],
      { q: 'ปลูกข้าว 1/3 ของแปลง ปลูกข้าวโพด 2/5 ของแปลง เหลือที่ดินเศษส่วนเท่าใด', fin: `ทั้งหมดคือ <b>1</b> ลบส่วนที่ใช้ไป`, say: 'ทั้งหมดคือหนึ่ง ลบส่วนที่ใช้ไป' }),
    d1dEq('เดินสองวัน', [{ e: '2_ {1|4} + ( 2_ {1|4} + {5|6} )' }, { e: '2_ {1|4} + {5|6} = {!27|12} + {!10|12} = {37|12}', w: 'วันที่สองก่อน', n: 'มากกว่าวันแรก 5/6' }, { e: '{27|12} + {37|12} = {64|12}', w: 'รวมสองวัน', n: '' }, { e: '= *{16|3} = *5_ {*1|3}', w: 'เดิน 5 1/3 กม.', n: 'ทำเป็นอย่างต่ำ', ans: 1 }],
      { q: 'วันแรกเดิน 2 1/4 กม. วันที่สองเดินมากกว่าวันแรก 5/6 กม. สองวันเดินรวมเท่าใด', fin: `โจทย์สองขั้น: <b>หาสิ่งที่ยังไม่รู้ก่อน</b> แล้วรวม`, say: 'โจทย์สองขั้น หาสิ่งที่ยังไม่รู้ก่อน แล้วรวม' }),
    d1dTry(2416, ['land', 'tank', 'temp', 'walk'], 'โจทย์ปัญหา')],

  /* ด่าน 17 การคูณเศษส่วน */
  2417: L => [
    ...D1B[2417][0],
    d1dTry(2417, ['of', 'pp', 'wh'], 'คูณเศษส่วน'),
    d1dEq('14/15 × 25/28', [{ e: '{14|15} × {25|28}' }, { e: '= {!1|3} × {^5|!2}', w: '14 กับ 28 ÷ 14 , 25 กับ 15 ÷ 5', n: 'ตัดทอนไขว้ก่อนคูณ' }, { e: '= *{5|6}', w: 'ตอบ 5/6', n: '1 × 5 , 3 × 2', ans: 1 }],
      { q: 'หาค่า 14/15 × 25/28', fin: `<b>ตัดทอน</b>เศษกับส่วนที่หารร่วมได้ก่อนคูณ ตัวเลขจะเล็ก`, say: 'ตัดทอนเศษกับส่วนที่หารร่วมได้ก่อนคูณ ตัวเลขจะเล็ก' }),
    d1dEq('1 1/2 × 2 2/3', [{ e: '1_ {1|2} × 2_ {2|3}' }, { e: '= {3|2} × {8|3}', w: 'เศษเกิน', n: 'ห้ามคูณจำนวนเต็มกับจำนวนเต็มแยกกัน' }, { e: '= {!24|!6}', w: '3 × 8 , 2 × 3', n: '' }, { e: '= *4', w: 'ตอบ 4', n: '', ans: 1 }],
      { q: 'หาค่า 1 1/2 × 2 2/3', fin: `จำนวนคละ: <b>เปลี่ยนเป็นเศษเกิน</b>ก่อนคูณ`, say: 'จำนวนคละ เปลี่ยนเป็นเศษเกินก่อนคูณ' }),
    d1dTry(2417, ['pn', 'nn', 'mx', 'cx'], 'คูณเศษส่วนบวกลบ'),
    d1dEq('(−2/3)³', [{ e: "(−_ {2|3} )'3" }, { e: '= (−_ {2|3} ) × (−_ {2|3} ) × (−_ {2|3} )', w: 'คูณตัวเอง 3 ครั้ง', n: '' }, { e: '= *−_ {8|27}', w: 'ลบ 3 ตัว (คี่) → ลบ', n: '2 × 2 × 2 , 3 × 3 × 3', ans: 1 }],
      { q: 'หาค่า (−2/3)<sup>3</sup>', fin: `เลขชี้กำลัง<b>คี่</b> ฐานลบ ผลเป็นลบ${r4vSep}<b>คู่</b> ผลเป็นบวก`, say: 'เลขชี้กำลังคี่ ฐานลบ ผลเป็นลบ คู่ผลเป็นบวก' }),
    d1dTry(2417, ['pw', 'tri'], 'ยกกำลัง คูณหลายจำนวน')],

  /* ด่าน 18 สมบัติของการคูณเศษส่วน */
  2418: L => [
    ...D1B[2418][0],
    d1dTry(2418, ['inv', 'id', 'ds', 'invn'], 'สมบัติการคูณ'),
    d1dEq('3/5 × 7/8 + 3/5 × 1/8', [{ e: '!{3|5} × {7|8} + !{3|5} × {1|8}' }, { e: '= !{3|5} × ( {7|8} + {1|8} )', w: 'ดึงตัวร่วม 3/5 ออก', n: 'แจกแจง' }, { e: '= {3|5} × 1', w: '7/8 + 1/8 = 1', n: '' }, { e: '= *{3|5}', w: 'ตอบ 3/5', n: '', ans: 1 }],
      { q: 'หาค่า 3/5 × 7/8 + 3/5 × 1/8', fin: `มี<b>ตัวคูณร่วม</b> → ดึงออกด้วยการแจกแจง`, say: 'มีตัวคูณร่วม ดึงออกด้วยการแจกแจง' }),
    d1dEq('24 × (5/6 − 3/8)', [{ e: '24 × ( {5|6} − {3|8} )' }, { e: '= !24 × {5|6} − !24 × {3|8}', w: 'แจกแจง 24', n: '24 หาร 6 และ 8 ลงตัว' }, { e: '= 20 − 9', w: '24 ÷ 6 × 5 , 24 ÷ 8 × 3', n: '' }, { e: '= *11', w: 'ตอบ 11', n: '', ans: 1 }],
      { q: 'หาค่า 24 × (5/6 − 3/8)', fin: `แจกแจงเข้าไป เมื่อ<b>ตัดกับตัวส่วนได้ลงตัว</b>`, say: 'แจกแจงเข้าไป เมื่อตัดกับตัวส่วนได้ลงตัว' }),
    d1dTry(2418, ['smart', 'dist', 'dist2', 'dist3'], 'คิดลัดด้วยสมบัติ')],

  /* ด่าน 19 การหารเศษส่วน */
  2419: L => [
    ...D1B[2419][0],
    d1dTry(2419, ['rw', 'pp', 'wh'], 'หารเศษส่วน'),
    d1dEq('5/6 ÷ 2/3', [{ e: '{5|6} ÷ {2|3}' }, { e: '= {5|6} × !{3|2}', w: 'หาร → คูณด้วยส่วนกลับ', n: 'กลับเฉพาะตัวหาร' }, { e: '= {15|12}', w: '5 × 3 , 6 × 2', n: '' }, { e: '= *{5|4}', w: 'ตอบ 5/4 = 1 1/4', n: 'ทำเป็นอย่างต่ำ', ans: 1 }],
      { q: 'หาค่า 5/6 ÷ 2/3', fin: `<b>÷ a/b = × b/a</b> (กลับเฉพาะตัวหาร)`, say: 'หารด้วย a ส่วน b เท่ากับคูณด้วย b ส่วน a กลับเฉพาะตัวหาร' }),
    d1dEq('(−7/10) ÷ (−14/15)', [{ e: '(−_ {7|10} ) ÷ (−_ {14|15} )' }, { e: '= (−_ {7|10} ) × !(−_ {15|14} )', w: 'คูณด้วยส่วนกลับ', n: '' }, { e: '= {1~×~3|2~×~2}', w: '7 กับ 14 ÷ 7 , 15 กับ 10 ÷ 5', n: 'ตัดทอนไขว้' }, { e: '= *{3|4}', w: 'ลบ ÷ ลบ = บวก', n: 'ตอบ 3/4', ans: 1 }],
      { q: 'หาค่า (−7/10) ÷ (−14/15)', fin: `คูณด้วยส่วนกลับ แล้วใช้<b>กฎเครื่องหมาย</b>`, say: 'คูณด้วยส่วนกลับ แล้วใช้กฎเครื่องหมาย' }),
    d1dTry(2419, ['np', 'nn', 'fw', 'mx', 'mix'], 'หารเศษส่วนบวกลบ')],

  /* ด่าน 20 โจทย์ปัญหาคูณหารเศษส่วน */
  2420: L => [
    ...D1B[2420][0],
    d1dTry(2420, ['of', 'area', 'cut', 'scale'], 'คูณหรือหาร'),
    d1dEq('ถังน้ำจุกี่ลิตร', [{ e: '{3|4} − {3|5}' }, { e: '= {!15|20} − {!12|20} = {3|20}', w: 'น้ำ 6 ลิตร = 3/20 ของถัง', n: 'ส่วนที่เพิ่มขึ้น' }, { e: '6 ÷ {3|20} = 6 × {20|3}', w: 'ทั้งถัง = 6 ÷ 3/20', n: 'หาร = คูณส่วนกลับ' }, { e: '= *40', w: 'ถังจุ 40 ลิตร', n: 'ตรวจ: 3/20 × 40 = 6 ✓', ans: 1 }],
      { q: 'ถังมีน้ำ 3/5 ถัง เติมอีก 6 ลิตร ได้ 3/4 ถังพอดี ถังจุน้ำกี่ลิตร', fin: `รู้ว่า<b>เศษส่วนหนึ่งเท่ากับกี่ลิตร</b> → หารด้วยเศษส่วนนั้นได้ทั้งหมด`, say: 'รู้ว่าเศษส่วนหนึ่งเท่ากับกี่ลิตร หารด้วยเศษส่วนนั้นได้ทั้งหมด' }),
    d1dEq('อ่านหนังสือสองวัน', [{ e: '120 × {1|3} = 40', w: 'วันแรก 40 หน้า', n: '' }, { e: '120 − 40 = 80', w: 'เหลือ 80 หน้า', n: '' }, { e: '80 × {1|4} = 20', w: 'วันที่สอง 1/4 ของที่เหลือ', n: 'ระวัง: ของที่เหลือ ไม่ใช่ของทั้งเล่ม' }, { e: '80 − 20 = *60', w: 'ยังไม่ได้อ่าน 60 หน้า', n: '', ans: 1 }],
      { q: 'หนังสือ 120 หน้า วันแรกอ่าน 1/3 ของเล่ม วันที่สองอ่าน 1/4 ของที่เหลือ ยังไม่ได้อ่านกี่หน้า', fin: `อ่านให้ชัดว่า "<b>ของ</b>" อะไร`, say: 'อ่านให้ชัดว่า ของ อะไร' }),
    d1dTry(2420, ['spd', 'book', 'tank'], 'โจทย์ปัญหา')],

  /* ด่าน 21 ความสัมพันธ์ระหว่างทศนิยมและเศษส่วน */
  2421: L => [
    ...D1B[2421][0],
    d1dTry(2421, ['fd', 'df', 'neg'], 'เศษส่วน ↔ ทศนิยม'),
    r4dShow('5/11 เป็นทศนิยม', { fig: d1dC('5 ÷ 11', 180, 44, 28), q: 'เขียน 5/11 เป็นทศนิยม',
      steps: [{ ink: d1dC('50 ÷ 11 = !4 เศษ 6', 180, 96, 22), w: '0.4', n: 'เติม 0 หาร' }, { ink: d1dC('60 ÷ 11 = !5 เศษ 5', 180, 136, 22), w: '0.45', n: 'หารต่อ' },
        { ink: d1dC('50 ÷ 11 = 4 เศษ 6', 180, 176, 22, D1C.fade), w: '0.4545…', n: 'เศษ 5 กลับมาอีก → วนซ้ำ' }, { ink: d1dDots('0.45', [2, 3], 180, 226), w: '= 0.4545… (45 ซ้ำ)', n: 'จุดบนตัวแรกและตัวสุดท้ายที่ซ้ำ', ans: 1 }],
      fin: `เศษกลับมาซ้ำ → <b>ทศนิยมซ้ำ</b> ใส่จุดบนตัวที่ซ้ำ`, say: 'เศษกลับมาซ้ำ เป็นทศนิยมซ้ำ ใส่จุดบนตัวที่ซ้ำ' }),
    d1dTry(2421, ['fd2', 'rep', 'which'], 'ทศนิยมซ้ำ'),
    r4dShow(`${d1Rep('0.[18]')} เป็นเศษส่วน`, { ...e1dEq([{ e: 'x = 0.181818…' }, { e: '100x = 18.181818…', w: 'ซ้ำ 2 ตัว → คูณ 100', n: 'ให้ส่วนที่ซ้ำตรงกัน' }, { e: '99x = 18', w: 'ลบกัน: ส่วนที่ซ้ำหายไป', n: '100x − x' }, { e: 'x = {18|99} = *{2|11}', w: 'ตอบ 2/11', n: 'ทำเป็นอย่างต่ำ', ans: 1 }],
      { q: 'เขียน 0.181818… เป็นเศษส่วน' }), fin: `ซ้ำ <b>2 ตัว</b> → คูณ 100 แล้วลบ (ได้ส่วน 99)`, say: 'ซ้ำสองตัว คูณร้อยแล้วลบ ได้ส่วนเก้าสิบเก้า' }),
    d1dTry(2421, ['rf', 'rf2'], 'ทศนิยมซ้ำเป็นเศษส่วน')]
};
LESSONS_M1C4.forEach(L => { const f = D1D_TEACH[L.id]; if (f) { L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true; } });
