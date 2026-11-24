/* =========================================================
   ม.3 บทที่ 11 อัตราส่วนตรีโกณมิติ (v240) — prefix tg
   ไฟล์นี้: ตัวช่วยคณิต (ราก เศษส่วน ค่าตรีโกณ) รูปสามเหลี่ยมมุมฉาก หน้าลงมือ (ลาก/แตะ) และชนิดข้อ Q.tgOpt / Q.tgNum / Q.tgSide
   บทเรียน + บอสอยู่ใน m3tl.js · โลกขั้วโลกหิมะ (engine/polar.js)
   สีประจำด้านทั้งบท: ข้าม (ด้านตรงข้ามมุม) = ชมพู · ชิด (ด้านประชิดมุม) = ฟ้า · ฉาก (ด้านตรงข้ามมุมฉาก) = ม่วง
   ค่าตรีโกณของมุมทั่วไปใช้ทศนิยม 3 ตำแหน่ง (แบบตารางในหนังสือ) · มุมพิเศษเขียนแบบ 1/√2 และ 1/√3
   ========================================================= */
const tgR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const tgPick = a => a[Math.floor(Math.random() * a.length)];
const tgGcd = (a, b) => b ? tgGcd(b, a % b) : Math.abs(a);
const tgN = (x, d = 2) => { const v = Math.round(x * 10 ** d) / 10 ** d; return (Object.is(v, -0) ? 0 : v).toLocaleString('en-US', { maximumFractionDigits: d }); };
const TG_RAD = Math.PI / 180;
const tgV = (fn, deg) => { const r = deg * TG_RAD, s = Math.sin(r), c = Math.cos(r), v = { sin: s, cos: c, tan: s / c, cosec: 1 / s, sec: 1 / c, cot: c / s }[fn]; return Math.round(v * 1000) / 1000; }; /* ค่าจากตาราง 3 ตำแหน่ง */
const tgV3 = (fn, deg) => tgV(fn, deg).toFixed(3);
/* ---------- written forms ---------- */
const tgRt = x => `<span class="tg-rt">√<span>${x}</span></span>`;
const tgF = (n, d) => `<span class="tg-f"><i>${n}</i><s>/</s><i>${d}</i></span>`;
const tgRad = n => { let k = 1, r = n; for (let f = 2; f * f <= r; f++) while (r % (f * f) === 0) { r /= f * f; k *= f; } return { k, r }; };
const tgRH = ({ k, r }) => r === 1 ? String(k) : (k === 1 ? '' : k) + tgRt(r);
const tgLen = sq => tgRH(tgRad(sq)); /* length from its square: 12 → 2√3 */
const tgLenT = sq => tgPlain(tgLen(sq)); /* same, plain text for svg labels */
const tgFH = (n, d) => { const g = tgGcd(n, d), a = n / g, b = d / g; return b === 1 ? String(a) : tgF(a, b); };
const tgFS = (n, d) => { const g = tgGcd(n, d), a = n / g, b = d / g; return b === 1 ? String(a) : `${a}/${b}`; };
/* √n2 / √d2 in simplest written form (not rationalised) */
const tgRatioH = (n2, d2) => { const A = tgRad(n2), B = tgRad(d2); if (A.r === B.r) return tgFH(A.k, B.k); const g = tgGcd(A.k, B.k), a = { k: A.k / g, r: A.r }, b = { k: B.k / g, r: B.r }; return b.k === 1 && b.r === 1 ? tgRH(a) : tgF(tgRH(a), tgRH(b)); };
const tgPlain = s => String(s).replace(/<s>\/<\/s>/g, '/').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const tgSpeak = s => tgPlain(s).replace(/cosec|sec|cot|cos|sin|tan/g, w => ({ sin: ' ไซน์ ', cos: ' โคไซน์ ', tan: ' แทนเจนต์ ', cosec: ' โคเซแคนต์ ', sec: ' เซแคนต์ ', cot: ' โคแทนเจนต์ ' })[w])
  .replace(/√/g, ' รากที่สองของ ').replace(/(\d)\s*\/\s*(\d)/g, '$1 ส่วน $2').replace(/\//g, ' ส่วน ').replace(/θ/g, ' ทีตา ').replace(/°/g, ' องศา ').replace(/²/g, ' กำลังสอง ').replace(/≈/g, ' ประมาณ ').replace(/×/g, ' คูณ ').replace(/\s+/g, ' ').trim();
const tgSay = t => miSay(tgSpeak(t));
/* ---------- ratios ---------- */
const TG_FN = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'], cosec: ['hyp', 'opp'], sec: ['hyp', 'adj'], cot: ['adj', 'opp'] };
const TG_INV = { sin: 'cosec', cos: 'sec', tan: 'cot', cosec: 'sin', sec: 'cos', cot: 'tan' };
const TG_TH = { opp: 'ข้าม', adj: 'ชิด', hyp: 'ฉาก' };
const TG_LONG = { opp: 'ด้านตรงข้ามมุม', adj: 'ด้านประชิดมุม', hyp: 'ด้านตรงข้ามมุมฉาก' };
const TG_COL = { opp: '#E5487A', adj: '#2F8FDB', hyp: '#7C5CE0' };
const TG_SAYFN = { sin: 'ไซน์', cos: 'โคไซน์', tan: 'แทนเจนต์', cosec: 'โคเซแคนต์', sec: 'เซแคนต์', cot: 'โคแทนเจนต์' };
const tgRole = (key, ref) => key === 'AB' ? 'hyp' : (key === 'BC') === (ref !== 'B') ? 'opp' : 'adj'; /* sides AB (hyp), BC, AC · right angle at C */
const tgKeyOf = (role, ref) => role === 'hyp' ? 'AB' : (role === 'opp') === (ref !== 'B') ? 'BC' : 'AC';
const tgDef = (fn, html = true) => { const [n, d] = TG_FN[fn]; return html ? tgF(TG_TH[n], TG_TH[d]) : `${TG_TH[n]}/${TG_TH[d]}`; };
/* Pythagorean triples [opp, adj, hyp] for the angle at A */
const TG_TRIP = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25], [24, 7, 25], [20, 21, 29], [21, 20, 29], [9, 40, 41], [12, 35, 37], [6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 9, 15]];
const tgTrip = (skip = []) => { const pool = TG_TRIP.filter(t => !skip.some(s => s[0] === t[0] && s[1] === t[1])); return tgPick(pool.length ? pool : TG_TRIP); };
/* the value of a ratio for a triangle given as squares of [opp, adj, hyp] */
const tgSq = t => t.map(x => x * x);
const tgRatioOf = (fn, sq) => { const i = { opp: 0, adj: 1, hyp: 2 }, [n, d] = TG_FN[fn]; return tgRatioH(sq[i[n]], sq[i[d]]); };
/* special angles */
const TG_SP = { 30: { sin: tgF(1, 2), cos: tgF(tgRt(3), 2), tan: tgF(1, tgRt(3)), cosec: '2', sec: tgF(2, tgRt(3)), cot: tgRt(3) },
  45: { sin: tgF(1, tgRt(2)), cos: tgF(1, tgRt(2)), tan: '1', cosec: tgRt(2), sec: tgRt(2), cot: '1' },
  60: { sin: tgF(tgRt(3), 2), cos: tgF(1, 2), tan: tgRt(3), cosec: tgF(2, tgRt(3)), sec: '2', cot: tgF(1, tgRt(3)) } };
const TG_SPALL = [...new Set(Object.values(TG_SP).flatMap(o => Object.values(o)))];

/* =========================================================
   right-triangle figure
   o = { o: opp length, a: adj length (shape only), rot (deg), flip, names: true | ['P','Q','R'] (A B C),
         ref: 'A' | 'B' | null (angle with the mark), refLab: 'θ', ang: { A: '30°', B: … } (text at vertices),
         sides: { opp|adj|hyp|AB|BC|AC: text }, roles: true (role chips), col: true (colour by role), hl: [roles],
         tap: true (wide hit paths .tg-hit data-k), W, H, pad, cls }
   ========================================================= */
function tgTriSVG(o = {}) {
  const W = o.W || 400, H = o.H || 260, pad = o.pad ?? 46, ref = o.ref === undefined ? 'A' : o.ref, oL = o.o || 3, aL = o.a || 4, nm = o.names === true ? ['A', 'B', 'C'] : o.names || null;
  const rot = (o.rot || 0) * TG_RAD, fl = o.flip ? -1 : 1;
  const raw = { A: [0, 0], C: [aL, 0], B: [aL, oL] }, P = {};
  Object.entries(raw).forEach(([k, [x, y]]) => { x *= fl; P[k] = [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]; });
  const xs = Object.values(P).map(p => p[0]), ys = Object.values(P).map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), hh = Math.max(...ys) - Math.min(...ys), s = Math.min((W - 2 * pad) / (w || 1), (H - 2 * pad) / (hh || 1));
  const ox = (W - w * s) / 2, oy = (H - hh * s) / 2, S = {}; Object.entries(P).forEach(([k, [x, y]]) => { S[k] = [ox + (x - Math.min(...xs)) * s, oy + (Math.max(...ys) - y) * s]; });
  const G = [(S.A[0] + S.B[0] + S.C[0]) / 3, (S.A[1] + S.B[1] + S.C[1]) / 3], u = (p, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
  const ends = { AB: ['A', 'B'], BC: ['B', 'C'], AC: ['A', 'C'] }, roleCol = k => ref ? TG_COL[tgRole(k, ref)] : k === 'AB' ? TG_COL.hyp : '#2B2550';
  const hl = new Set((o.hl || []).map(r => ['AB', 'BC', 'AC'].includes(r) ? r : tgKeyOf(r, ref || 'A')));
  let g = `<path d="M${S.A} L${S.B} L${S.C} Z" fill="${o.fill || '#E8F4FD'}" stroke="none"/>`;
  Object.entries(ends).forEach(([k, [p, q]]) => { const on = hl.has(k), c = o.col || on ? roleCol(k) : '#2B2550'; g += `<path class="tg-sd" data-k="${k}" d="M${S[p]} L${S[q]}" stroke="${c}" stroke-width="${on ? 7 : o.col ? 4.5 : 3}" stroke-linecap="round"/>`; });
  { const a = u(S.C, S.A), b = u(S.C, S.B), q = 15; g += `<path d="M${S.C[0] + a[0] * q} ${S.C[1] + a[1] * q} l${b[0] * q} ${b[1] * q} l${-a[0] * q} ${-a[1] * q}" fill="none" stroke="#2B2550" stroke-width="2"/>`; }
  const arc = (V, lab, col, r = 30) => { const others = ['A', 'B', 'C'].filter(k => k !== V), a = u(S[V], S[others[0]]), b = u(S[V], S[others[1]]), cr = a[0] * b[1] - a[1] * b[0], bis = u([0, 0], [a[0] + b[0], a[1] + b[1]]);
    g += `<path d="M${S[V][0] + a[0] * r} ${S[V][1] + a[1] * r} A${r} ${r} 0 0 ${cr > 0 ? 1 : 0} ${S[V][0] + b[0] * r} ${S[V][1] + b[1] * r}" fill="${col}" fill-opacity=".18" stroke="${col}" stroke-width="2.6"/>`;
    if (lab) g += `<text x="${S[V][0] + bis[0] * (r + 17)}" y="${S[V][1] + bis[1] * (r + 17) + 7}" text-anchor="middle" class="tg-ang" style="fill:${col}">${lab}</text>`; };
  if (ref) arc(ref, o.refLab ?? 'θ', '#F08A24');
  Object.entries(o.ang || {}).forEach(([V, t]) => { if (V !== ref) arc(V, t, '#5A6A8A', 24); });
  if (nm) ['A', 'B', 'C'].forEach((k, i) => { const d = u(G, S[k]); g += `<text x="${S[k][0] + d[0] * 20}" y="${S[k][1] + d[1] * 20 + 7}" text-anchor="middle" class="tg-vn">${nm[i]}</text>`; });
  const sideTxt = {}; Object.entries(o.sides || {}).forEach(([k, t]) => { sideTxt[['AB', 'BC', 'AC'].includes(k) ? k : tgKeyOf(k, ref || 'A')] = t; });
  Object.entries(ends).forEach(([k, [p, q]]) => { const M = [(S[p][0] + S[q][0]) / 2, (S[p][1] + S[q][1]) / 2], d = u(G, M), role = ref ? tgRole(k, ref) : null, t = sideTxt[k];
    if (t != null && t !== '') g += `<text x="${M[0] + d[0] * 24}" y="${M[1] + d[1] * 24 + 7}" text-anchor="middle" class="tg-sv" style="fill:${o.col || hl.has(k) ? roleCol(k) : '#2B2550'}">${t}</text>`;
    if (o.roles && role && (o.roles === true || o.roles.includes(role))) { const off = t != null && t !== '' ? 50 : 26, x = M[0] + d[0] * off, y = M[1] + d[1] * off; g += `<g class="tg-chip"><rect x="${x - 26}" y="${y - 15}" width="52" height="28" rx="14" fill="${TG_COL[role]}"/><text x="${x}" y="${y + 6}" text-anchor="middle">${TG_TH[role]}</text></g>`; }
    if (o.tap) g += `<path class="tg-hit" data-k="${k}" d="M${S[p]} L${S[q]}" stroke="transparent" stroke-width="34" stroke-linecap="round"/>`; });
  return `<svg class="tg-tri ${o.cls || ''}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${g}${o.extra ? o.extra(S) : ''}</svg>`;
}
const tgFig = html => h('div', { class: 'm3-figbox tg-fig', html });
const tgWrap = () => h('div', { class: 'colstack no-side tg-pg' }, h6wait());
/* a little ratio card: "sin θ = ข้าม/ฉาก = 3/5" */
const tgEq = (...parts) => `<span class="tg-eq">${parts.join(' <b class="fop">=</b> ')}</span>`;

/* =========================================================
   missions + drag scene (one draggable thing; drag anywhere on the picture moves it)
   ========================================================= */
function tgMission(list, wrap) {
  const done = new Set(), el = h('div', { class: 'tg-mis' }, ...list.map(([t]) => h('span', { class: 'tg-mi', html: t })));
  return { el, check(st) { list.forEach(([, test], i) => { if (!done.has(i) && test(st)) { done.add(i); el.children[i].classList.add('ok'); if (done.size === list.length) { sfx.ok(); teachDone(wrap); } else sfx.pop(done.size + 3); } }); } };
}
/* drag anywhere on the picture: pointer → svg coordinates with getScreenCTM (zoomfix handles Safari zoom) · a tap also moves */
function tgDrag(fig, move) { let id = null, raf = 0, last = null;
  const pt = e => { const s = fig.querySelector('svg'), m = s.getScreenCTM().inverse(), q = s.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m); return [r.x, r.y]; };
  fig.addEventListener('pointerdown', e => { if (id != null || !fig.querySelector('svg')) return; if (e.pointerType === 'mouse' && e.button !== 0) return; e.preventDefault(); id = e.pointerId; try { fig.setPointerCapture(id); } catch (_) { } last = pt(e); move(last); });
  fig.addEventListener('pointermove', e => { if (e.pointerId !== id) return; if (e.pointerType === 'mouse' && !e.buttons) { id = null; return; } e.preventDefault(); last = pt(e); if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (id != null && last) move(last); }); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => fig.addEventListener(t, e => { if (e.pointerId !== id) return; id = null; if (raf) cancelAnimationFrame(raf); raf = 0; if (t === 'pointerup' && last) move(last); last = null; })); }
function tgScene(o) {
  const wrap = tgWrap(), fig = h('div', { class: 'tg-board ia' }), out = fNote(), mis = tgMission(o.missions, wrap); let st = o.st;
  const draw = () => { fig.innerHTML = `<svg viewBox="0 0 ${o.W} ${o.H}" class="tg-scene" aria-hidden="true">${o.svg(st)}</svg>`; out.innerHTML = o.info(st); };
  tgDrag(fig, p => { const n = o.drag(p, st); if (n != null) { st = n; draw(); mis.check(st); } });
  draw(); wrap.append(h('div', { class: 'cap', html: o.cap }), mis.el, h('div', { class: 'tg-row' }, fig, o.side ? o.side : ''), out); return wrap;
}
const tgHandle = (x, y, c = '#F08A24') => `<circle cx="${x}" cy="${y}" r="20" fill="${c}" fill-opacity=".18"/><circle class="tg-h" cx="${x}" cy="${y}" r="11" fill="${c}" stroke="#fff" stroke-width="3"/>`;
const tgArc = (V, a1, a2, r, col) => { const p = a => [V[0] + r * Math.cos(a), V[1] - r * Math.sin(a)], s = p(a1), e = p(a2); return `<path d="M${V[0]} ${V[1]} L${s[0]} ${s[1]} A${r} ${r} 0 0 ${a2 > a1 ? 0 : 1} ${e[0]} ${e[1]} Z" fill="${col}" fill-opacity=".2" stroke="${col}" stroke-width="2.4"/>`; };
const tgTx = (x, y, t, cls = 'tg-sv', col = '#2B2550', anc = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anc}" class="${cls}" style="fill:${col}">${t}</text>`;
const tgRA = (x, y, dx, dy, q = 14) => `<path d="M${x + dx * q} ${y} v${dy * q} h${-dx * q}" fill="none" stroke="#2B2550" stroke-width="2"/>`;

/* ---------- 1 ลากจุด B: เมื่อมุม C = 90° เป็นสามเหลี่ยมมุมฉาก ---------- */
function tgSimRight() {
  const A = [70, 236], C = [340, 236], ang = (p, q, r) => { const a = Math.atan2(p[1] - q[1], p[0] - q[0]), b = Math.atan2(r[1] - q[1], r[0] - q[0]); let d = Math.abs(a - b) * 180 / Math.PI; return d > 180 ? 360 - d : d; };
  const info = B => { const a = Math.round(ang(B, A, C)), c = Math.round(ang(A, C, B)), b = 180 - a - c; return { a, b, c }; };
  return tgScene({ W: 470, H: 280, st: [250, 80], cap: 'ลากจุด <b>B</b> ไปมา ดูขนาดของมุมทั้งสาม',
    missions: [['ทำให้มุม C = 90°', B => info(B).c === 90], ['ทำสามเหลี่ยมมุมฉากอีกรูป ที่สูงต่างจากเดิม', (() => { let y0 = null; return B => { if (info(B).c !== 90) return false; if (y0 == null) { y0 = B[1]; return false; } return Math.abs(B[1] - y0) > 40; }; })()]],
    svg: B => { const { a, b, c } = info(B), right = c === 90; let s = `<path d="M${A} L${B} L${C} Z" fill="#E8F4FD" stroke="#2B2550" stroke-width="3" stroke-linejoin="round"/>`;
      if (right) s += `<path d="M${A} L${B}" stroke="${TG_COL.hyp}" stroke-width="7" stroke-linecap="round"/>` + tgRA(C[0], C[1], -1, -1) + tgTx((A[0] + B[0]) / 2 - 18, (A[1] + B[1]) / 2 - 14, 'ยาวที่สุด', 'tg-lb', TG_COL.hyp, 'end');
      s += tgTx(A[0] - 14, A[1] + 30, `A ${a}°`, 'tg-vn') + tgTx(C[0] + 16, C[1] + 30, `C ${c}°`, 'tg-vn', right ? '#1B8862' : '#2B2550') + tgTx(B[0], B[1] - 26, `B ${b}°`, 'tg-vn');
      return s + tgHandle(B[0], B[1]); },
    drag: p => { let x = Math.max(110, Math.min(440, p[0])), y = Math.max(50, Math.min(200, p[1])); if (Math.abs(x - C[0]) < 16) x = C[0]; return [x, y]; },
    info: B => { const { a, b, c } = info(B); return c === 90 ? `มุม C = 90° → <b>สามเหลี่ยมมุมฉาก</b>&emsp;มุม A + มุม B = ${a} + ${b} = <b>90°</b>&emsp;ด้าน AB อยู่ตรงข้ามมุมฉาก ยาวที่สุด` : `มุม A + มุม B + มุม C = ${a} + ${b} + ${c} = 180°&emsp;มุม C ${c < 90 ? 'ยังเล็กกว่า' : 'ใหญ่กว่า'} 90°`; } });
}

/* ---------- 2 แตะด้าน: ข้าม ชิด ฉาก ของมุม θ (2 รอบ: θ ที่ A แล้วย้ายไป B) ---------- */
function tgSimSides(tri = { o: 3, a: 4 }) {
  const wrap = tgWrap(), fig = h('div', { class: 'tg-board ia' }), out = fNote(), asks = ['opp', 'adj', 'hyp']; let ref = 'A', k = 0; const got = [];
  const draw = () => { const sides = {}; got.forEach(r => sides[r] = TG_TH[r]); fig.innerHTML = tgTriSVG({ ...tri, ref, names: true, tap: true, hl: got, roles: got, W: 420, H: 270 }); fig.querySelectorAll('.tg-hit').forEach(p => p.onclick = e => { e.stopPropagation(); tap(p.dataset.k); }); };
  const ask = () => { out.innerHTML = `มุม θ อยู่ที่ <b>${ref}</b> — แตะ<b style="color:${TG_COL[asks[k]]}">${TG_LONG[asks[k]]}${asks[k] === 'hyp' ? '' : ' θ'}</b> (${TG_TH[asks[k]]})`; };
  const tap = key => { if (k >= 3) return; const want = asks[k]; if (tgRole(key, ref) !== want) { sfx.no(); out.innerHTML = want === 'hyp' ? 'ยังไม่ใช่ — ด้านตรงข้าม<b>มุมฉาก</b> คือด้านที่ไม่ได้แตะมุมฉากเลย (ยาวที่สุด)' : want === 'opp' ? 'ยังไม่ใช่ — ด้านตรงข้ามมุม θ คือด้านที่<b>ไม่แตะ</b>มุม θ' : 'ยังไม่ใช่ — ด้านประชิดมุม θ <b>แตะมุม θ</b> แต่ไม่ใช่ด้านที่ยาวที่สุด'; return; }
    got.push(want); k++; sfx.pop(got.length + 1); draw();
    if (k < 3) return ask();
    if (ref === 'A') { out.innerHTML = 'ครบแล้ว ✓ — ต่อไป <b>ย้ายมุม θ ไปที่ B</b> ด้านไหนจะเปลี่ยนชื่อ?'; setTimeout(() => { ref = 'B'; k = 0; got.length = 0; draw(); ask(); }, 1400); }
    else { out.innerHTML = 'ย้าย θ แล้ว <b>ข้ามกับชิดสลับกัน</b> แต่<b>ฉาก</b>เป็นด้านเดิมเสมอ ✓'; sfx.ok(); teachDone(wrap); } };
  draw(); ask(); wrap.append(h('div', { class: 'cap' }, 'แตะด้านบนรูปตามที่ถาม'), fig, out); return wrap;
}

/* ---------- 3 พีทาโกรัส: แตะสี่เหลี่ยมจัตุรัสบนแต่ละด้าน นับพื้นที่ ---------- */
function tgSimPyth(t = [3, 4, 5]) {
  const wrap = tgWrap(), fig = h('div', { class: 'tg-board ia' }), out = fNote(), seen = new Set(), [o, a, c] = t, U = 38, A = [184, 276], C = [184 + a * U, 276], B = [184 + a * U, 276 - o * U];
  const sq = (p, q, side, key, col) => { const d = [q[0] - p[0], q[1] - p[1]], n = side > 0 ? [d[1], -d[0]] : [-d[1], d[0]], P3 = [q[0] + n[0], q[1] + n[1]], P4 = [p[0] + n[0], p[1] + n[1]], L = Math.round(Math.hypot(...d) / U), on = seen.has(key);
    let s = `<path class="tg-sq" data-k="${key}" d="M${p} L${q} L${P3} L${P4} Z" fill="${col}" fill-opacity="${on ? .45 : .14}" stroke="${col}" stroke-width="2.4"/>`;
    if (on) for (let i = 1; i < L; i++) { const f = i / L; s += `<path d="M${p[0] + d[0] * f} ${p[1] + d[1] * f} l${n[0]} ${n[1]} M${p[0] + n[0] * f} ${p[1] + n[1] * f} l${d[0]} ${d[1]}" stroke="${col}" stroke-width=".8" opacity=".7"/>`; }
    const M = [(p[0] + P3[0]) / 2, (p[1] + P3[1]) / 2]; s += tgTx(M[0], M[1] + 8, on ? `${L}² = ${L * L}` : 'แตะ', 'tg-lb', on ? '#2B2550' : col); return s; };
  const draw = () => { fig.innerHTML = `<svg viewBox="0 0 520 440" class="tg-scene tg-pyth" aria-hidden="true">${sq(A, C, -1, 'adj', TG_COL.adj)}${sq(C, B, -1, 'opp', TG_COL.opp)}${sq(B, A, -1, 'hyp', TG_COL.hyp)}<path d="M${A} L${B} L${C} Z" fill="#fff" stroke="#2B2550" stroke-width="3"/>${tgRA(C[0], C[1], -1, -1)}${tgTx((A[0] + C[0]) / 2, A[1] - 8, a)}${tgTx(C[0] - 14, (C[1] + B[1]) / 2 + 7, o)}${tgTx((A[0] + B[0]) / 2 - 6, (A[1] + B[1]) / 2 + 22, c)}</svg>`;
    fig.querySelectorAll('.tg-sq').forEach(p => p.onclick = e => { e.stopPropagation(); if (seen.has(p.dataset.k)) return; seen.add(p.dataset.k); sfx.pop(seen.size + 1); draw();
      out.innerHTML = seen.size < 3 ? `พื้นที่สี่เหลี่ยมจัตุรัส = ด้าน × ด้าน — แตะอีก ${3 - seen.size} รูป` : `${o * o} + ${a * a} = ${c * c} → <b>${o}² + ${a}² = ${c}²</b>&emsp;กำลังสองของด้านตรงข้ามมุมฉาก = ผลบวกกำลังสองของอีกสองด้าน ✓`; if (seen.size === 3) { sfx.ok(); teachDone(wrap); } }); };
  draw(); out.innerHTML = 'แตะสี่เหลี่ยมจัตุรัสบนแต่ละด้าน ดูพื้นที่'; wrap.append(h('div', { class: 'cap' }, 'สร้างสี่เหลี่ยมจัตุรัสบนด้านทั้งสามของสามเหลี่ยมมุมฉาก'), fig, out); return wrap;
}

/* ---------- 4 สามเหลี่ยมคล้าย: ลากขยาย มุมเท่าเดิม อัตราส่วนเท่าเดิม ---------- */
function tgSimScale() {
  const U = 28, A = [30, 282], used = new Set(), ks = [1, 1.5, 2, 2.5, 3];
  const tb = k => `<table class="tg-tb"><tr><th></th><th>ด้าน</th><th>อัตราส่วน</th></tr><tr><td><span style="color:${TG_COL.opp}">ข้าม</span>/<span style="color:${TG_COL.hyp}">ฉาก</span></td><td>${tgN(3 * k)}/${tgN(5 * k)}</td><td><b>0.6</b></td></tr><tr><td><span style="color:${TG_COL.adj}">ชิด</span>/<span style="color:${TG_COL.hyp}">ฉาก</span></td><td>${tgN(4 * k)}/${tgN(5 * k)}</td><td><b>0.8</b></td></tr><tr><td><span style="color:${TG_COL.opp}">ข้าม</span>/<span style="color:${TG_COL.adj}">ชิด</span></td><td>${tgN(3 * k)}/${tgN(4 * k)}</td><td><b>0.75</b></td></tr></table>`;
  const side = h('div', { class: 'tg-side' });
  const W = tgScene({ W: 400, H: 300, st: 1, cap: 'ลากมุม <b>B</b> ขยายสามเหลี่ยม — มุม θ เท่าเดิมตลอด',
    missions: [['ขนาด 1 เท่า', k => k === 1], ['ขยาย 2 เท่า', k => k === 2], ['ขยาย 3 เท่า', k => k === 3]],
    svg: k => { const C = [A[0] + 4 * k * U, A[1]], B = [C[0], A[1] - 3 * k * U]; side.innerHTML = tb(k);
      return `<path d="M${A} L${B} L${C} Z" fill="#E8F4FD"/><path d="M${B} L${C}" stroke="${TG_COL.opp}" stroke-width="4.5"/><path d="M${A} L${C}" stroke="${TG_COL.adj}" stroke-width="4.5"/><path d="M${A} L${B}" stroke="${TG_COL.hyp}" stroke-width="4.5"/>${tgRA(C[0], C[1], -1, -1)}${tgArc(A, 0, Math.atan2(3, 4), 30, '#F08A24')}${tgTx(A[0] + 46, A[1] - 7, 'θ', 'tg-ang', '#F08A24')}`
        + tgTx((A[0] + C[0]) / 2, A[1] + 24, tgN(4 * k), 'tg-sv', TG_COL.adj) + tgTx(C[0] + 8, (B[1] + C[1]) / 2 + 7, tgN(3 * k), 'tg-sv', TG_COL.opp, 'start') + tgTx((A[0] + B[0]) / 2 - 10, (A[1] + B[1]) / 2 - 8, tgN(5 * k), 'tg-sv', TG_COL.hyp, 'end') + tgHandle(B[0], B[1]); },
    drag: p => { const t = ((p[0] - A[0]) * 4 + (A[1] - p[1]) * 3) / 5 / (5 * U), k = ks.reduce((b, x) => Math.abs(x - t) < Math.abs(b - t) ? x : b, 1); used.add(k); return k; },
    info: k => used.size >= 3 ? `ขยายแล้วด้านยาวขึ้น แต่<b>อัตราส่วนของด้านคู่เดิมเท่าเดิม</b> เพราะเป็นสามเหลี่ยมคล้ายที่มีมุม θ เท่ากัน → อัตราส่วนนี้จึงเป็น “ค่าประจำมุม θ” เรียกว่า <b>อัตราส่วนตรีโกณมิติ</b>` : `ขยาย ${tgN(k)} เท่า: ด้านยาวขึ้น ${tgN(k)} เท่า — ดูตารางอัตราส่วน`, side });
  return W;
}

/* ---------- 5 บันไดยาว 10 เมตร: ลากปลายบน → sin θ = สูง/10 · cos θ = ห่าง/10 ---------- */
function tgSimLadder() {
  const F = [400, 250], L = 200, info = d => { const r = d * TG_RAD; return { h: 10 * Math.sin(r), b: 10 * Math.cos(r) }; };
  const side = h('div', { class: 'tg-side' });
  return tgScene({ W: 440, H: 290, st: 50, cap: 'บันไดยาว <b>10 เมตร</b> พิงกำแพงน้ำแข็ง — ลากปลายบนของบันไดขึ้นลง',
    missions: [['ทำให้ θ = 30°', d => d === 30], ['ทำให้ θ = 60°', d => d === 60], ['หามุมที่ sin θ = cos θ', d => d === 45]],
    svg: d => { const r = d * TG_RAD, B = [F[0], F[1] - L * Math.sin(r)], A = [F[0] - L * Math.cos(r), F[1]], { h: hh, b } = info(d);
      side.innerHTML = `<div class="tg-live">${tgEq(`sin ${d}°`, `<span style="color:${TG_COL.opp}">ข้าม</span>/<span style="color:${TG_COL.hyp}">ฉาก</span>`, `${tgN(hh)}/10`, `<b>${tgN(hh / 10, 3)}</b>`)}${tgEq(`cos ${d}°`, `<span style="color:${TG_COL.adj}">ชิด</span>/<span style="color:${TG_COL.hyp}">ฉาก</span>`, `${tgN(b)}/10`, `<b>${tgN(b / 10, 3)}</b>`)}</div>`;
      return `<rect x="${F[0]}" y="20" width="26" height="${F[1] - 20}" fill="#D6ECFA" stroke="#9CCBEA" stroke-width="2"/><path d="M10 ${F[1]} H430" stroke="#9CCBEA" stroke-width="4"/>`
        + `<path d="M${A} L${B}" stroke="${TG_COL.hyp}" stroke-width="7" stroke-linecap="round"/><path d="M${B} L${F}" stroke="${TG_COL.opp}" stroke-width="4" stroke-dasharray="8 6"/><path d="M${A} L${F}" stroke="${TG_COL.adj}" stroke-width="4" stroke-dasharray="8 6"/>${tgRA(F[0], F[1], -1, -1)}${tgArc(A, 0, r, 34, '#F08A24')}`
        + tgTx(A[0] + 52, A[1] - 10, `θ = ${d}°`, 'tg-ang', '#F08A24', 'start') + tgTx(F[0] - 10, (B[1] + F[1]) / 2 + 6, `สูง ${tgN(hh)}`, 'tg-lb', TG_COL.opp, 'end') + tgTx((A[0] + F[0]) / 2, F[1] + 26, `ห่าง ${tgN(b)}`, 'tg-lb', TG_COL.adj) + tgTx((A[0] + B[0]) / 2 - 14, (A[1] + B[1]) / 2 - 4, '10 ม.', 'tg-lb', TG_COL.hyp, 'end') + tgHandle(B[0], B[1]); },
    drag: p => Math.max(15, Math.min(75, Math.round(Math.asin(Math.max(.2, Math.min(.98, (F[1] - p[1]) / L))) / TG_RAD / 5) * 5)), /* ทีละ 5° แตะเป้าง่ายบนไอแพด */
    info: d => d === 45 ? 'θ = 45° → สูงเท่ากับห่าง จึงได้ <b>sin 45° = cos 45°</b>' : d === 30 ? 'θ = 30° → สูง 5 เมตร ครึ่งหนึ่งของบันได → <b>sin 30° = 0.5</b>' : d === 60 ? 'θ = 60° → ห่างจากกำแพง 5 เมตร → <b>cos 60° = 0.5</b>' : `θ ยิ่งใหญ่ → <b>sin θ เพิ่มขึ้น</b> แต่ <b>cos θ ลดลง</b>`, side });
}

/* ---------- 6 ทางลาด: ลากยอด → tan θ = สูง/ยาวตามพื้น ---------- */
function tgSimRamp() {
  const A = [40, 262], RUN = 10, U = 12, side = h('div', { class: 'tg-side' });
  return tgScene({ W: 300, H: 290, st: 4, cap: 'ทางลาดสโนว์บอร์ด ยาวตามพื้น <b>10 เมตร</b> — ลากยอดทางลาดขึ้นลง',
    missions: [['ทำให้ tan θ = 0.5', r => r === 5], ['ทำให้ tan θ = 1', r => r === 10], ['ทำให้ tan θ = 2', r => r === 20]],
    svg: r => { const C = [A[0] + RUN * U * 2, A[1]], B = [C[0], A[1] - r * U], th = Math.atan2(r, RUN);
      side.innerHTML = `<div class="tg-live">${tgEq('tan θ', `<span style="color:${TG_COL.opp}">ข้าม</span>/<span style="color:${TG_COL.adj}">ชิด</span>`, `${r}/10`, `<b>${tgN(r / 10)}</b>`)}<div class="cap">θ ≈ ${tgN(th / TG_RAD, 1)}°</div></div>`;
      return `<path d="M${A} L${B} L${C} Z" fill="#F4FAFF" stroke="#9CCBEA" stroke-width="2"/><path d="M${A} L${B}" stroke="#5A6A8A" stroke-width="5" stroke-linecap="round"/><path d="M${B} L${C}" stroke="${TG_COL.opp}" stroke-width="4.5"/><path d="M${A} L${C}" stroke="${TG_COL.adj}" stroke-width="4.5"/>${tgRA(C[0], C[1], -1, -1)}${tgArc(A, 0, Math.atan2(r * U, RUN * U * 2), 30, '#F08A24')}`
        + tgTx(A[0] + 40, A[1] - 8, 'θ', 'tg-ang', '#F08A24', 'start') + tgTx(C[0] + 8, (B[1] + C[1]) / 2 + 7, `${r} ม.`, 'tg-lb', TG_COL.opp, 'start') + tgTx((A[0] + C[0]) / 2, A[1] + 24, '10 ม.', 'tg-lb', TG_COL.adj) + tgHandle(B[0], B[1]); },
    drag: p => Math.max(1, Math.min(20, Math.round((A[1] - p[1]) / U))),
    info: r => r === 10 ? 'สูงเท่ากับยาวตามพื้น → θ = 45° และ <b>tan 45° = 1</b>' : r > 10 ? 'ชันกว่า 45° → <b>tan θ มากกว่า 1</b> ได้ (ต่างจาก sin และ cos ที่ไม่เกิน 1)' : 'tan θ บอก<b>ความชัน</b>: สูงขึ้นเท่าไรต่อระยะตามพื้น 1 หน่วย', side });
}

/* ---------- เงา: ลากดวงอาทิตย์ → เงาเสาธงสูง 10 เมตร = 10 ÷ tan θ ---------- */
function tgSimShadow() {
  const P = [330, 244], HP = 10, U = 10, side = h('div', { class: 'tg-side' });
  return tgScene({ W: 460, H: 280, st: 40, cap: 'เสาธงสูง <b>10 เมตร</b> — ลากดวงอาทิตย์ ดูมุมเงยของดวงอาทิตย์กับความยาวเงา',
    missions: [['มุมเงย 45°', d => d === 45], ['มุมเงย 60°', d => d === 60], ['มุมเงย 30°', d => d === 30]],
    svg: d => { const r = d * TG_RAD, sh = HP / Math.tan(r), T = [P[0], P[1] - HP * U], E = [P[0] - sh * U, P[1]], S = [T[0] + Math.cos(r) * 112, T[1] - Math.sin(r) * 112];
      side.innerHTML = `<div class="tg-live">${tgEq(`tan ${d}°`, `10/เงา`)}${tgEq('เงา', `10 ÷ tan ${d}°`, `<b>${tgN(sh)}</b> ม.`)}</div>`;
      return `<path d="M0 ${P[1]} H460" stroke="#9CCBEA" stroke-width="4"/><path d="M${E} L${P}" stroke="#5A6A8A" stroke-width="9" opacity=".45"/><path d="M${S} L${E}" stroke="#F5B52E" stroke-width="2.4" stroke-dasharray="7 6"/><path d="M${P} L${T}" stroke="#B5462F" stroke-width="6"/><path d="M${T[0]} ${T[1]} h-26 l6 8 l-6 8 h26 z" fill="#E36A8C"/>${tgArc(E, 0, r, 34, '#F08A24')}`
        + tgTx(E[0] + 44, E[1] - 8, `${d}°`, 'tg-ang', '#F08A24', 'start') + tgTx((E[0] + P[0]) / 2, P[1] + 26, `เงา ${tgN(sh)} ม.`, 'tg-lb', '#5A6A8A') + tgTx(P[0] + 12, (P[1] + T[1]) / 2, '10 ม.', 'tg-lb', '#B5462F', 'start')
        + `<g transform="translate(${S[0]} ${S[1]})"><circle r="26" fill="#FFD45C" opacity=".35"/><circle r="17" fill="#FFC21E" stroke="#F08A24" stroke-width="2"/></g>`; },
    drag: p => { const T = [P[0], P[1] - HP * U]; return Math.max(25, Math.min(75, Math.round(Math.atan2(T[1] - p[1], Math.max(4, p[0] - T[0])) / TG_RAD / 5) * 5)); },
    info: d => d === 45 ? 'มุมเงย 45° → <b>เงายาวเท่ากับความสูงของเสา</b>' : `ดวงอาทิตย์ยิ่งสูง (มุมเงยโต) → เงายิ่ง<b>สั้น</b>`, side });
}

/* ---------- มุมเงย / มุมก้ม: ผู้สังเกตบนหอน้ำแข็ง ลากบอลลูนหรือเรือ ---------- */
function tgSimElev() {
  const E = [110, 130], side = h('div', { class: 'tg-side' });
  const ang = p => Math.round(Math.atan2(E[1] - p[1], p[0] - E[0]) / TG_RAD);
  return tgScene({ W: 480, H: 300, st: [360, 50], cap: 'เพนกวินยืนบนหอสังเกตการณ์ — ลากสิ่งของไปที่ต่าง ๆ ดูมุมที่สายตาทำกับแนวระดับ',
    missions: [['มุมเงย 30°', p => ang(p) === 30], ['มุมก้ม 40°', p => ang(p) === -40], ['มุมก้ม 20°', p => ang(p) === -20]],
    svg: p => { const a = ang(p), up = a > 0, col = up ? '#2FB5A3' : '#E36A8C', r = Math.abs(a) * TG_RAD;
      side.innerHTML = `<div class="tg-live"><div class="tg-big" style="color:${col}">${a === 0 ? 'อยู่ในแนวระดับ' : (up ? 'มุมเงย ' : 'มุมก้ม ') + Math.abs(a) + '°'}</div><div class="cap">${up ? 'มองขึ้นจากแนวระดับ' : a < 0 ? 'มองลงจากแนวระดับ' : ''}</div></div>`;
      return `<rect x="0" y="246" width="480" height="54" fill="#9CD3F2"/><path d="M0 246 H480" stroke="#6FB4E0" stroke-width="2"/><rect x="${E[0] - 34}" y="${E[1] + 18}" width="56" height="${246 - E[1] - 18}" fill="#EEF7FD" stroke="#9CCBEA" stroke-width="2"/>`
        + `<path d="M${E} H470" stroke="#5A6A8A" stroke-width="2" stroke-dasharray="6 6"/>${tgTx(462, E[1] - 8, 'แนวระดับ', 'tg-lb', '#5A6A8A', 'end')}<path d="M${E} L${p}" stroke="${col}" stroke-width="3"/>`
        + (a ? tgArc(E, 0, up ? r : -r, 54, col) + tgTx(E[0] + 66 * Math.cos(r / 2), E[1] + (up ? -1 : 1) * 66 * Math.sin(r / 2) + 6, Math.abs(a) + '°', 'tg-ang', col, 'start') : '')
        + `<g transform="translate(${E[0] - 8} ${E[1] + 2}) scale(1.4)">${PL_PENG}</g>`
        + (p[1] < 236 && up ? `<g transform="translate(${p[0]} ${p[1]})"><path d="M-4 18 L0 30 L4 18" stroke="#5A6A8A" stroke-width="1.5" fill="none"/><ellipse cx="0" cy="0" rx="17" ry="20" fill="#E36A8C" stroke="#B5466A" stroke-width="2"/><rect x="-6" y="28" width="12" height="9" rx="2" fill="#C99A5C"/></g>` : `<g transform="translate(${p[0]} ${p[1]})"><path d="M-22 -2 h44 l-8 12 h-28 z" fill="#E0A35C" stroke="#A86A2A" stroke-width="2"/><path d="M0 -2 V-26 l14 12 h-14" fill="#fff" stroke="#9CCBEA" stroke-width="1.6"/></g>`); },
    drag: p => { const x = Math.max(170, Math.min(465, p[0])), y = Math.max(22, Math.min(276, p[1])), r = Math.hypot(x - E[0], y - E[1]), a = Math.round(Math.atan2(E[1] - y, x - E[0]) / TG_RAD / 5) * 5 * TG_RAD; return [E[0] + r * Math.cos(a), E[1] - r * Math.sin(a)]; }, /* มุมทีละ 5° */
    info: p => { const a = ang(p); return a > 0 ? '<b>มุมเงย</b> = มุมที่แนวสายตาทำกับแนวระดับ เมื่อมองสิ่งที่อยู่<b>สูงกว่า</b>ระดับสายตา' : a < 0 ? '<b>มุมก้ม</b> = มุมที่แนวสายตาทำกับแนวระดับ เมื่อมองสิ่งที่อยู่<b>ต่ำกว่า</b>ระดับสายตา' : 'สิ่งของอยู่ในแนวระดับสายตาพอดี'; }, side });
}

/* ---------- เดินเข้าหาหอ: มุมเงยเปลี่ยน (โจทย์สองจุด) ---------- */
function tgSimWalk() {
  const T = [420, 60], G = 256, U = 4.6, HT = (G - T[1]) / U, side = h('div', { class: 'tg-side' }); let seen = {};
  const xOf = a => T[0] - HT / Math.tan(a * TG_RAD) * U;
  return tgScene({ W: 470, H: 290, st: 25, cap: `หอประภาคารสูง ${tgN(HT, 1)} เมตร (โดยประมาณ) — ลากเพนกวินเดินบนพื้น ดูมุมเงยถึงยอดหอ`,
    missions: [['ยืนจุดที่มุมเงย 30°', a => a === 30], ['ยืนจุดที่มุมเงย 60°', a => a === 60]],
    svg: a => { const x = xOf(a), d = (T[0] - x) / U; seen[a] = d;
      side.innerHTML = `<div class="tg-live">${tgEq(`tan ${a}°`, 'สูง/ระยะ')}<div class="cap">ห่างจากหอ ${tgN(d, 1)} ม.</div></div>`;
      return `<path d="M0 ${G} H470" stroke="#9CCBEA" stroke-width="4"/><rect x="${T[0] - 12}" y="${T[1]}" width="24" height="${G - T[1]}" fill="#fff" stroke="#E36A8C" stroke-width="2.4"/><path d="M${T[0] - 12} ${T[1] + 40} h24 M${T[0] - 12} ${T[1] + 90} h24 M${T[0] - 12} ${T[1] + 140} h24" stroke="#E36A8C" stroke-width="8"/><path d="M${T[0] - 16} ${T[1]} h32 l-6 -14 h-20 z" fill="#FFC21E" stroke="#D99A12" stroke-width="1.6"/>`
        + `<path d="M${x} ${G} L${T[0]} ${T[1]}" stroke="#2FB5A3" stroke-width="2.6" stroke-dasharray="7 5"/>${tgArc([x, G], 0, a * TG_RAD, 30, '#2FB5A3')}${tgTx(x + 38, G - 8, a + '°', 'tg-ang', '#2FB5A3', 'start')}<g transform="translate(${x} ${G - 16}) scale(1.3)">${PL_PENG}</g>`
        + `<path d="M${x} ${G + 16} H${T[0]}" stroke="#5A6A8A" stroke-width="1.6"/>${tgTx((x + T[0]) / 2, G + 32, `${tgN(d, 1)} ม.`, 'tg-lb', '#5A6A8A')}`; },
    drag: p => Math.max(20, Math.min(75, Math.round(Math.atan2(HT, Math.max(1, (T[0] - Math.min(T[0] - 8, p[0])) / U)) / TG_RAD / 5) * 5)), /* ตำแหน่งตามมุม ทีละ 5° */
    info: a => a >= 60 && seen[30] ? 'เดินเข้าใกล้หอ → <b>มุมเงยโตขึ้น</b> ระยะที่เดินได้ = ผลต่างของระยะทั้งสองจุด' : 'ยิ่งอยู่ไกล มุมเงยยิ่งเล็ก', side });
}

/* ---------- สร้างอัตราส่วน: แตะด้านตัวเศษ แล้วแตะด้านตัวส่วน (หลายรอบ) ---------- */
/* rounds = [{ fn, tri: [opp, adj, hyp] (ตัวเลข), ref: 'A'|'B', rot, flip }] */
function tgBuild(rounds, cap = 'แตะด้านที่เป็น<b>ตัวเศษ</b> แล้วแตะด้านที่เป็น<b>ตัวส่วน</b>') {
  const wrap = tgWrap(), fig = h('div', { class: 'tg-board ia' }), out = fNote(), card = h('div', { class: 'tg-card' }), list = h('div', { class: 'tg-done' }); let i = 0, pick = [];
  const R = () => rounds[i], lenOf = (role, t) => t[{ opp: 0, adj: 1, hyp: 2 }[role]];
  const draw = () => { const r = R(), t = r.tri, ref = r.ref || 'A', sd = { AB: t[2] }; sd[tgKeyOf('opp', ref)] = t[0]; sd[tgKeyOf('adj', ref)] = t[1];
    const o = ref === 'A' ? t[0] : t[1], a = ref === 'A' ? t[1] : t[0];
    fig.innerHTML = tgTriSVG({ o, a, ref, names: true, tap: true, sides: sd, hl: pick, rot: r.rot, flip: r.flip, W: 400, H: 260 });
    fig.querySelectorAll('.tg-hit').forEach(p => p.onclick = e => { e.stopPropagation(); tap(p.dataset.k); });
    const [n, d] = TG_FN[r.fn]; card.innerHTML = tgEq(`${r.fn} θ`, tgF(pick[0] ? `<b style="color:${TG_COL[pick[0]]}">${lenOf(pick[0], t)}</b>` : '?', pick[1] ? `<b style="color:${TG_COL[pick[1]]}">${lenOf(pick[1], t)}</b>` : '?')); };
  const tap = key => { if (i >= rounds.length) return; const r = R(), ref = r.ref || 'A', role = tgRole(key, ref), want = TG_FN[r.fn][pick.length]; if (!want) return;
    if (role !== want) { sfx.no(); out.innerHTML = `ยังไม่ใช่ — ${r.fn} θ = ${tgDef(r.fn)} ตอนนี้ต้องการ<b style="color:${TG_COL[want]}">${TG_LONG[want]}${want === 'hyp' ? '' : ' θ'}</b>`; return; }
    pick.push(role); sfx.pop(pick.length + 2); draw(); if (pick.length < 2) { out.innerHTML = `ได้ตัวเศษแล้ว — ต่อไปแตะ<b>ตัวส่วน</b>`; return; }
    const t = r.tri, v = tgFH(lenOf(pick[0], t), lenOf(pick[1], t)); list.append(h('span', { class: 'tg-chip2', html: `${r.fn} θ = ${v}` })); out.innerHTML = tgEq(`${r.fn} θ`, tgDef(r.fn), tgF(lenOf(pick[0], t), lenOf(pick[1], t)), `<b>${v}</b>`);
    i++; if (i >= rounds.length) { out.innerHTML += '&emsp;ครบทุกข้อ ✓'; sfx.ok(); teachDone(wrap); return; }
    setTimeout(() => { pick = []; draw(); out.innerHTML = `ข้อต่อไป: สร้าง <b>${R().fn} θ</b> = ${tgDef(R().fn)}`; }, 1500); };
  draw(); out.innerHTML = `สร้าง <b>${R().fn} θ</b> = ${tgDef(R().fn)}`;
  wrap.append(h('div', { class: 'cap', html: cap }), h('div', { class: 'tg-row' }, fig, h('div', { class: 'colstack tg-sidecol' }, card, list)), out); return wrap;
}

/* ---------- เลือกอัตราส่วนที่ใช้หาด้าน (รู้มุม รู้ด้านหนึ่ง หาอีกด้าน) ---------- */
/* rounds = [{ deg, know: role, kv, find: role }] */
function tgPickSim(rounds) {
  const wrap = tgWrap(), fig = h('div', { class: 'tg-board' }), out = fNote(), steps = h('div', { class: 'colstack tg-steps' }); let i = 0;
  const btns = h('div', { class: 'rowstack m3-parts' }, ...['sin', 'cos', 'tan'].map(fn => h('button', { class: 'btn ia m3-part', onclick: e => { e.stopPropagation(); pickFn(fn); } }, `${fn} θ`)));
  const fnFor = (k, f) => Object.keys(TG_FN).slice(0, 3).find(fn => { const p = TG_FN[fn]; return (p[0] === k && p[1] === f) || (p[0] === f && p[1] === k); });
  const draw = () => { const r = rounds[i], sd = {}; sd[r.know] = `${r.kv}`; sd[r.find] = 'x'; const shape = { o: Math.sin(r.deg * TG_RAD) * 10, a: Math.cos(r.deg * TG_RAD) * 10 };
    fig.innerHTML = tgTriSVG({ ...shape, ref: 'A', refLab: r.deg + '°', sides: sd, hl: [r.know, r.find], W: 380, H: 240 }); steps.innerHTML = ''; out.innerHTML = `รู้<b style="color:${TG_COL[r.know]}">${TG_TH[r.know]}</b> อยากรู้<b style="color:${TG_COL[r.find]}">${TG_TH[r.find]}</b> — ใช้อัตราส่วนใด?`; };
  const pickFn = fn => { const r = rounds[i]; if (!r) return; const want = fnFor(r.know, r.find); if (fn !== want) { sfx.no(); out.innerHTML = `${fn} θ = ${tgDef(fn)} — ไม่ได้ใช้ทั้ง${TG_TH[r.know]}และ${TG_TH[r.find]} ลองใหม่`; return; }
    const [n, d] = TG_FN[fn], v = tgV(fn, r.deg), up = n === r.find, x = up ? r.kv * v : r.kv / v;
    steps.innerHTML = `<div>${tgEq(`${fn} ${r.deg}°`, up ? tgF('x', r.kv) : tgF(r.kv, 'x'))}</div><div>${up ? tgEq('x', `${r.kv} × ${fn} ${r.deg}°`, `${r.kv} × ${tgV3(fn, r.deg)}`, `<b>${tgN(x)}</b>`) : tgEq('x', `${r.kv} ÷ ${fn} ${r.deg}°`, `${r.kv} ÷ ${tgV3(fn, r.deg)}`, `<b>${tgN(x)}</b>`)}</div>`;
    sfx.pop(i + 3); i++; if (i >= rounds.length) { out.innerHTML = 'ครบแล้ว ✓ — เลือกอัตราส่วนที่มี<b>ด้านที่รู้</b>กับ<b>ด้านที่ต้องการหา</b>อยู่ด้วยกัน'; sfx.ok(); teachDone(wrap); return; }
    out.innerHTML = `ใช้ <b>${fn} θ</b> ถูกแล้ว ✓`; setTimeout(draw, 2200); };
  draw(); wrap.append(h('div', { class: 'cap' }, 'แตะอัตราส่วนที่ใช้หาค่า x'), h('div', { class: 'tg-row' }, fig, steps), btns, out); return wrap;
}

/* ---------- มุมพิเศษ: แตะช่องตารางให้ครบ ---------- */
function tgSpTable(fns = ['sin', 'cos', 'tan']) {
  const wrap = tgWrap(), tb = h('div', { class: 'm3-out tg-sp' }), out = fNote(), seen = new Set(), degs = [30, 45, 60];
  const why = (fn, d) => { const s = d === 45 ? { o: '1', a: '1', h: tgRt(2) } : d === 30 ? { o: '1', a: tgRt(3), h: '2' } : { o: tgRt(3), a: '1', h: '2' }, m = { opp: s.o, adj: s.a, hyp: s.h }, [n, dd] = TG_FN[fn]; return `${fn} ${d}° = ${tgDef(fn)} = ${tgF(m[n], m[dd])}`; };
  const draw = () => { tb.innerHTML = `<table><tr><th></th>${degs.map(d => `<th>${d}°</th>`).join('')}</tr>${fns.map(fn => `<tr><th>${fn}</th>${degs.map(d => { const k = fn + d; return `<td class="ia ${seen.has(k) ? 'hl' : ''}" data-k="${k}">${seen.has(k) ? TG_SP[d][fn] : '?'}</td>`; }).join('')}</tr>`).join('')}</table>`;
    tb.querySelectorAll('td[data-k]').forEach(td => td.onclick = e => { e.stopPropagation(); const k = td.dataset.k, fn = k.replace(/\d+/, ''), d = +k.replace(/\D+/, ''); if (seen.has(k)) return; seen.add(k); sfx.pop(seen.size % 7 + 1); draw();
      out.innerHTML = why(fn, d) + (seen.size === fns.length * 3 ? '&emsp;ครบตาราง ✓' : ''); if (seen.size === fns.length * 3) { sfx.ok(); teachDone(wrap); } }); };
  draw(); out.innerHTML = 'แตะช่อง ? ทีละช่อง'; wrap.append(h('div', { class: 'tg-row' }, h('div', { class: 'tg-fig2', html: tgSpFigs() }), tb), out); return wrap;
}
/* the two special triangles side by side */
const tgSpFigs = () => tgTriSVG({ o: 1, a: Math.sqrt(3), ref: 'A', refLab: '30°', ang: { B: '60°' }, sides: { opp: '1', adj: tgPlain(tgRt(3)), hyp: '2' }, W: 300, H: 190, pad: 38 })
  + tgTriSVG({ o: 1, a: 1, ref: 'A', refLab: '45°', ang: { B: '45°' }, sides: { opp: '1', adj: '1', hyp: tgPlain(tgRt(2)) }, W: 230, H: 190, pad: 38 });

/* ---------- พับครึ่งสามเหลี่ยมด้านเท่า / ตัดครึ่งสี่เหลี่ยมจัตุรัส ---------- */
function tgSimHalf() {
  const wrap = tgWrap(), fig = h('div', { class: 'tg-board' }), out = fNote(), seen = new Set(); let mode = 'eq';
  const eq = cut => `<svg viewBox="0 0 300 250" class="tg-scene" aria-hidden="true"><path d="M30 220 L270 220 L150 12 Z" fill="${cut ? '#F4FAFF' : '#E8F4FD'}" stroke="#2B2550" stroke-width="3"/>${cut ? `<path d="M150 220 L270 220 L150 12 Z" fill="#E8F4FD" stroke="#2B2550" stroke-width="3"/><path d="M150 12 V220" stroke="${TG_COL.opp}" stroke-width="5"/>${tgRA(150, 220, 1, -1)}${tgTx(140, 130, tgPlain(tgRt(3)), 'tg-sv', TG_COL.opp, 'end')}${tgTx(210, 244, '1', 'tg-sv', TG_COL.adj)}${tgTx(90, 244, '1', 'tg-sv', '#9AA3B8')}${tgTx(226, 108, '2', 'tg-sv', TG_COL.hyp, 'start')}${tgTx(242, 210, '60°', 'tg-ang', '#F08A24', 'end')}${tgTx(160, 66, '30°', 'tg-ang', '#F08A24', 'start')}` : `${tgTx(150, 244, '2', 'tg-sv')}${tgTx(76, 108, '2', 'tg-sv', '#2B2550', 'end')}${tgTx(226, 108, '2', 'tg-sv', '#2B2550', 'start')}${tgTx(60, 212, '60°', 'tg-ang', '#F08A24', 'start')}${tgTx(242, 212, '60°', 'tg-ang', '#F08A24', 'end')}${tgTx(150, 54, '60°', 'tg-ang', '#F08A24')}`}</svg>`;
  const sq = cut => `<svg viewBox="0 0 300 250" class="tg-scene" aria-hidden="true"><rect x="60" y="20" width="190" height="190" fill="${cut ? '#F4FAFF' : '#E8F4FD'}" stroke="#2B2550" stroke-width="3"/>${cut ? `<path d="M60 210 L250 210 L250 20 Z" fill="#E8F4FD" stroke="#2B2550" stroke-width="3"/><path d="M60 210 L250 20" stroke="${TG_COL.hyp}" stroke-width="5"/>${tgRA(250, 210, -1, -1)}${tgTx(140, 104, tgPlain(tgRt(2)), 'tg-sv', TG_COL.hyp, 'end')}${tgTx(102, 202, '45°', 'tg-ang', '#F08A24', 'start')}${tgTx(242, 70, '45°', 'tg-ang', '#F08A24', 'end')}` : ''}${tgTx(155, 236, '1', 'tg-sv')}${tgTx(268, 122, '1', 'tg-sv', '#2B2550', 'start')}</svg>`;
  const steps = [['พับครึ่งสามเหลี่ยมด้านเท่า', () => { fig.innerHTML = eq(true); return 'สามเหลี่ยมด้านเท่ายาวด้านละ 2 มุมละ 60° → พับครึ่งได้สามเหลี่ยมมุมฉาก มุม 30° และ 60° ฐาน 1 ฉาก 2 สูง = √(2² − 1²) = <b>√3</b>'; }],
    ['ตัดสี่เหลี่ยมจัตุรัสตามแนวทแยง', () => { fig.innerHTML = sq(true); return 'สี่เหลี่ยมจัตุรัสด้านละ 1 ตัดตามเส้นทแยงมุม → สามเหลี่ยมมุมฉากหน้าจั่ว มุม 45° 45° ด้านตรงข้ามมุมฉาก = √(1² + 1²) = <b>√2</b>'; }]];
  const row = h('div', { class: 'rowstack m3-parts' }, ...steps.map(([t, fn], j) => h('button', { class: 'btn ia m3-part', style: { '--pc': S2COL[j] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(j); out.innerHTML = fn(); sfx.pop(seen.size + 2); if (seen.size === 2) { out.innerHTML += '&emsp;✓ จำสามเหลี่ยมสองรูปนี้ได้ ก็หาค่ามุม 30° 45° 60° ได้เอง'; sfx.ok(); teachDone(wrap); } } }, t)));
  fig.innerHTML = eq(false); out.innerHTML = 'แตะปุ่มทีละปุ่ม'; wrap.append(h('div', { class: 'cap' }, 'สร้างสามเหลี่ยมมุมฉากที่มีมุม 30°, 45°, 60° จากรูปที่รู้จัก'), row, fig, out); return wrap;
}

/* ---------- ตารางค่าตรีโกณ: หาค่าตามที่ถาม ---------- */
function tgTableSim(asks, lo = 25, hi = 36) {
  const wrap = tgWrap(), tb = h('div', { class: 'm3-out tg-vt' }), out = fNote(); let i = 0;
  const draw = hl => { tb.innerHTML = `<table><tr><th>มุม</th><th>sin</th><th>cos</th><th>tan</th></tr>${Array.from({ length: hi - lo + 1 }, (_, j) => lo + j).map(d => `<tr><th>${d}°</th>${['sin', 'cos', 'tan'].map(fn => `<td class="ia ${hl === fn + d ? 'hl' : ''}" data-f="${fn}" data-d="${d}">${tgV3(fn, d)}</td>`).join('')}</tr>`).join('')}</table>`;
    tb.querySelectorAll('td').forEach(td => td.onclick = e => { e.stopPropagation(); if (i >= asks.length) return; const [fn, d] = asks[i]; if (td.dataset.f !== fn || +td.dataset.d !== d) { sfx.no(); out.innerHTML = `ยังไม่ใช่ — หาแถว <b>${d}°</b> แล้วดูคอลัมน์ <b>${fn}</b>`; return; }
      i++; draw(fn + d); sfx.pop(i + 2); out.innerHTML = `${fn} ${d}° ≈ <b>${tgV3(fn, d)}</b>` + (i < asks.length ? `&emsp;ต่อไป: หา <b>${asks[i][0]} ${asks[i][1]}°</b>` : '&emsp;✓ อ่านตารางเป็นแล้ว');
      if (i === asks.length) { sfx.ok(); teachDone(wrap); } }); };
  draw(); out.innerHTML = `แตะค่าของ <b>${asks[0][0]} ${asks[0][1]}°</b> ในตาราง`; wrap.append(h('div', { class: 'cap' }, 'ตารางค่าอัตราส่วนตรีโกณมิติ (ทศนิยม 3 ตำแหน่ง)'), tb, out); return wrap;
}

/* =========================================================
   question types
   ========================================================= */
/* story = โจทย์ยาว แสดงในกล่องเรื่องด้านซ้าย · q = คำถามสั้นบนหัว (ทั้งสองถูกอ่านออกเสียง) */
const tgLeft = (story, fig) => story ? h('div', { class: 'colstack tg-left' }, h('div', { class: 'tg-story', html: story }), fig ? tgFig(fig) : '') : fig ? tgFig(fig) : '';
const tgSaySt = (story, q) => tgSay((story ? story + ' ' : '') + q);
Q.tgOpt = ({ story, q, fig, opts, right, hint, sig, base, cap, diff }) => ({ prompt: q, say: tgSaySt(story, q), __sig: 'tgo ' + (sig || q + right), ...(base ? { __base: base, __baseCap: cap || 2 } : {}), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { const ch = choices(ctx, shuffle(opts.map(o => ({ value: String(o), label: String(o) }))), String(right), { hint }); ch.classList.add('tg-opts'); if (opts.some(o => tgPlain(o).length > 9)) ch.querySelectorAll('.opt').forEach(x => x.classList.add('txt'));
    bd.append(h('div', { class: fig || story ? 'tg-qrow' : 'colstack' }, tgLeft(story, fig), ch)); } });
Q.tgNum = ({ story, q, fig, a, unit, hint, sig, base, cap, diff }) => ({ prompt: q, say: tgSaySt(story, q), __sig: 'tgn ' + (sig || q), ...(base ? { __base: base, __baseCap: cap || 2 } : {}), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { bd.append(h('div', { class: fig || story ? 'tg-qrow' : 'colstack' }, tgLeft(story, fig), miAns(ctx, a, { unit, hint }))); } });
/* tap the side: tri = tgTriSVG options (tap is added) · ask = role or side key */
Q.tgSide = ({ q, tri, ask, hint, sig, diff }) => ({ prompt: q, say: tgSay(q), __sig: 'tgs ' + (sig || q + JSON.stringify(tri)), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { const ref = tri.ref === undefined ? 'A' : tri.ref, key = ['AB', 'BC', 'AC'].includes(ask) ? ask : tgKeyOf(ask, ref), fig = h('div', { class: 'm3-figbox tg-fig ia rvl' });
    const draw = (hl, bad) => { fig.innerHTML = tgTriSVG({ ...tri, tap: true, hl: hl ? [hl] : [] }); if (bad) { const p = fig.querySelector(`.tg-sd[data-k="${bad}"]`); if (p) p.setAttribute('stroke', '#E0445A'); }
      fig.querySelectorAll('.tg-hit').forEach(p => p.onclick = e => { e.stopPropagation(); if (fig.classList.contains('done')) return; const k = p.dataset.k, ok = k === key; if (ok) { fig.classList.add('done'); draw(k); } else draw(null, k); ctx.check(ok, hint); }); };
    fig.reveal = () => { fig.classList.add('done'); draw(key); }; fig.ansText = 'ด้าน ' + key; draw(); bd.append(h('div', { class: 'colstack' }, fig)); } });
const tgTF = (text, ok, why) => Q.hTF({ text, ok: !!ok, why });
/* choices for a ratio of a Pythagorean triangle: right + the usual mix-ups */
const tgRatioOpts = (fn, t) => { const v = (n, d) => tgFH(n, d), m = { opp: t[0], adj: t[1], hyp: t[2] }, [n, d] = TG_FN[fn], other = ['opp', 'adj', 'hyp'].find(r => r !== n && r !== d);
  return { right: v(m[n], m[d]), opts: [v(m[n], m[d]), v(m[d], m[n]), v(m[other], m[d]), v(m[n], m[other])] }; };

/* =========================================================
   story scenes (สัดส่วนตามมุมจริง ไม่บอกคำตอบ) — tgScn(kind, o)
   o = { deg, deg2, d, hgt, L, eye, top } ป้ายเป็นข้อความ ('?' = สิ่งที่ถาม)
   ========================================================= */
function tgScn(kind, o = {}) {
  const W = 440, H = 270, G = 230, r = (o.deg || 40) * TG_RAD, lb = (x, y, t, c = '#2B2550', a = 'middle') => t == null || t === '' ? '' : tgTx(x, y, t, 'tg-lb', c, a);
  const ground = `<path d="M10 ${G} H430" stroke="#9CCBEA" stroke-width="4"/>`, eyeC = '#2FB5A3', depC = '#E36A8C';
  let s = '';
  if (kind === 'tower' || kind === 'tree') { const ex = 70, ey = G - (o.eye ? 26 : 0), X = Math.min(380, ex + Math.max(120, 150 / Math.tan(r) * 1.0)), top = Math.max(26, ey - (X - ex) * Math.tan(r));
    s += ground + (kind === 'tree' ? `<path d="M${X} ${G} V${top + 30}" stroke="#8B5A2B" stroke-width="10"/><ellipse cx="${X}" cy="${top + 30}" rx="30" ry="34" fill="#9FD47A" stroke="#5FA336" stroke-width="2"/>` : `<rect x="${X - 14}" y="${top}" width="28" height="${G - top}" fill="#EEF7FD" stroke="#6FB4E0" stroke-width="2.4"/><path d="M${X - 18} ${top} h36 l-6 -12 h-24 z" fill="#E36A8C"/>`);
    s += `<path d="M${ex} ${ey} L${X} ${top}" stroke="${eyeC}" stroke-width="2.6" stroke-dasharray="7 5"/><path d="M${ex} ${ey} H${X}" stroke="#5A6A8A" stroke-width="1.6" stroke-dasharray="5 5"/>${tgArc([ex, ey], 0, Math.atan2(ey - top, X - ex), 34, eyeC)}${lb(ex + 44, ey - 8, o.degT ?? (o.deg + '°'), eyeC, 'start')}`;
    s += `<g transform="translate(${ex - 4} ${G - 14}) scale(1.25)">${PL_PENG}</g>` + lb((ex + X) / 2, G + 26, o.d) + lb(X + 22, (ey + top) / 2, o.hgt, '#B5462F', 'start') + (o.eye ? lb(ex - 22, G - 6, o.eye, '#5A6A8A', 'end') : '');
    if (o.eye) s += `<path d="M${X + 14} ${ey} V${G}" stroke="#5A6A8A" stroke-width="1.6"/>`; }
  else if (kind === 'cliff' || kind === 'boats') { const tx = 80, ty = 48, d1 = Math.min(330, (G - ty) / Math.tan(r)), B1 = [tx + d1, G], r2 = (o.deg2 || 30) * TG_RAD, B2 = [tx + Math.min(350, (G - ty) / Math.tan(r2)), G];
    s += `<rect x="0" y="${G}" width="440" height="40" fill="#9CD3F2"/><path d="M0 ${G} H440" stroke="#6FB4E0" stroke-width="2"/><path d="M20 ${G} V${ty} H${tx} V${G} Z" fill="#EEF7FD" stroke="#9CCBEA" stroke-width="2.4"/><g transform="translate(${tx - 10} ${ty - 14}) scale(1.25)">${PL_PENG}</g>`;
    s += `<path d="M${tx} ${ty} H430" stroke="#5A6A8A" stroke-width="1.6" stroke-dasharray="5 5"/>`;
    const boat = ([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-20 -4 h40 l-7 10 h-26 z" fill="#E0A35C" stroke="#A86A2A" stroke-width="1.6"/><path d="M0 -4 V-24 l12 10 h-12" fill="#fff" stroke="#9CCBEA" stroke-width="1.4"/></g>`;
    s += `<path d="M${tx} ${ty} L${B1[0]} ${B1[1] - 6}" stroke="${depC}" stroke-width="2.6" stroke-dasharray="7 5"/>${tgArc([tx, ty], 0, -Math.atan2(G - 6 - ty, B1[0] - tx), 60, depC)}${(() => { const a1 = Math.atan2(G - 6 - ty, B1[0] - tx), m = kind === 'boats' ? (a1 + Math.atan2(G - 6 - ty, B2[0] - tx)) / 2 + .12 : a1 / 2; return lb(tx + 76 * Math.cos(m), ty + 76 * Math.sin(m) + 6, o.degT ?? (o.deg + '°'), depC, 'start'); })()}${boat(B1)}`;
    if (kind === 'boats') s += `<path d="M${tx} ${ty} L${B2[0]} ${B2[1] - 6}" stroke="#7C5CE0" stroke-width="2.4" stroke-dasharray="7 5"/>${tgArc([tx, ty], 0, -Math.atan2(G - 6 - ty, B2[0] - tx), 118, '#7C5CE0')}${(() => { const m = Math.atan2(G - 6 - ty, B2[0] - tx) / 2; return lb(tx + 134 * Math.cos(m), ty + 134 * Math.sin(m) + 6, o.deg2 + '°', '#7C5CE0', 'start'); })()}${boat(B2)}${lb((B1[0] + B2[0]) / 2, G + 30, o.d2)}`;
    s += lb(10, (ty + G) / 2, o.hgt, '#B5462F', 'start') + lb((tx + B1[0]) / 2, G + 30, o.d); }
  else if (kind === 'kite') { const A = [90, G - 20], L = 240, K = [A[0] + L * Math.cos(r), A[1] - L * Math.sin(r)];
    s += ground + `<g transform="translate(${A[0] - 6} ${A[1] + 4}) scale(1.25)">${PL_PENG}</g><path d="M${A} L${K}" stroke="#5A6A8A" stroke-width="2"/><path d="M${K[0]} ${K[1]} V${A[1]}" stroke="#B5462F" stroke-width="2" stroke-dasharray="6 5"/><path d="M${A} H${K[0]}" stroke="#5A6A8A" stroke-width="1.4" stroke-dasharray="5 5"/>${tgArc(A, 0, r, 34, eyeC)}${lb(A[0] + 44, A[1] - 8, o.degT ?? (o.deg + '°'), eyeC, 'start')}`;
    s += `<g transform="translate(${K[0]} ${K[1]})"><path d="M0 -20 L14 0 L0 20 L-14 0 Z" fill="#E36A8C" stroke="#B5466A" stroke-width="2"/><path d="M0 20 q6 10 -2 18 q-6 8 2 14" stroke="#B5466A" fill="none" stroke-width="1.6"/></g>` + lb((A[0] + K[0]) / 2 - 14, (A[1] + K[1]) / 2 - 8, o.L, '#5A6A8A', 'end') + lb(K[0] + 12, (K[1] + A[1]) / 2, o.hgt, '#B5462F', 'start') + lb((A[0] + K[0]) / 2, A[1] + 30, o.d); }
  else if (kind === 'ladder' || kind === 'ramp') { const F = [330, G], L = 210, A = [F[0] - L * Math.cos(r), G], B = [F[0], G - L * Math.sin(r)];
    s += ground + (kind === 'ladder' ? `<rect x="${F[0]}" y="20" width="24" height="${G - 20}" fill="#D6ECFA" stroke="#9CCBEA" stroke-width="2"/><path d="M${A} L${B}" stroke="#B5462F" stroke-width="7" stroke-linecap="round"/>` : `<path d="M${A} L${B} L${F} Z" fill="#F4FAFF" stroke="#9CCBEA" stroke-width="2"/><path d="M${A} L${B}" stroke="#5A6A8A" stroke-width="6" stroke-linecap="round"/>`);
    s += `${tgRA(F[0], F[1], -1, -1)}${tgArc(A, 0, r, 34, '#F08A24')}${lb(A[0] + 44, A[1] - 8, o.degT ?? (o.deg + '°'), '#F08A24', 'start')}` + lb((A[0] + B[0]) / 2 - 12, (A[1] + B[1]) / 2 - 6, o.L, '#B5462F', 'end') + lb(F[0] - 10, (B[1] + G) / 2, o.hgt, '#2B2550', 'end') + lb((A[0] + F[0]) / 2, G + 28, o.d); }
  else if (kind === 'two') { const T = [380, 40], r2 = (o.deg2 || 60) * TG_RAD, HT = G - T[1], x1 = T[0] - HT / Math.tan(r), x2 = T[0] - HT / Math.tan(r2);
    s += ground + `<rect x="${T[0] - 12}" y="${T[1]}" width="24" height="${HT}" fill="#EEF7FD" stroke="#6FB4E0" stroke-width="2.4"/><path d="M${T[0] - 16} ${T[1]} h32 l-6 -12 h-20 z" fill="#E36A8C"/>`;
    s += `<path d="M${x1} ${G} L${T}" stroke="${eyeC}" stroke-width="2.4" stroke-dasharray="7 5"/><path d="M${x2} ${G} L${T}" stroke="#7C5CE0" stroke-width="2.4" stroke-dasharray="7 5"/>${tgArc([x1, G], 0, r, 30, eyeC)}${tgArc([x2, G], 0, r2, 26, '#7C5CE0')}${lb(x1 + 36, G - 8, o.deg + '°', eyeC, 'start')}${lb(x2 + 30, G - 10, o.deg2 + '°', '#7C5CE0', 'start')}`;
    s += `<circle cx="${x1}" cy="${G}" r="5" fill="${eyeC}"/><circle cx="${x2}" cy="${G}" r="5" fill="#7C5CE0"/>${lb(x1, G + 24, 'A')}${lb(x2, G + 24, 'B')}` + lb((x1 + x2) / 2, G + 30, o.d) + lb(T[0] - 22, (T[1] + G) / 2, o.hgt, '#B5462F', 'end') + lb((x2 + T[0]) / 2, G + 30, o.d2); }
  return `<svg class="tg-scn" viewBox="0 0 ${W} ${H + 12}" aria-hidden="true">${s}</svg>`;
}
