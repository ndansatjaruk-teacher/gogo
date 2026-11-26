/* =========================================================
   ม.1 บทที่ 6 ลำน้ำสมการ — หน้าสอนเรียงใหม่ (v259 · ผู้ใช้ขอ) · prefix e1d
   แบบเดียวกับ ป.4 (v251–v258): ประเด็นละหน้า ① ดูภาพ (r4vSee) → (บางประเด็น) ลงมือเองด้วยฉากเดิม (ชิป ตาชั่ง ลากค่า x …)
   → ② ทำให้ดู (r4dDo: ดินสอเขียนสมการทีละบรรทัด จัดเครื่องหมาย = ให้ตรงกัน เขียน "− 3" สีชมพูทั้งสองข้าง ขีดฆ่าของบนตาชั่ง
   ลากเส้นแจกแจง คิดบนกระดาษทด คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อจากเกมของด่านนั้นเอง เลือกด้วย sig)
   ตัดการ์ดข้อความ (miCards) และตัวอย่างแบบตัวหนังสือ (rpWalk) ออก · เกมคงเดิม (เรียงตาม diff อยู่แล้ว)
   วางหลัง p4md.js ใน order.txt (ใช้ r4dDo a4dSee g5dTry o4dCross จากไฟล์ ป.4)
   ========================================================= */
const E1C = { ink: '#2B2550', p: '#E5487A', b: '#2F7BC0', g: '#1B8862', o: '#EC7F1E', fade: '#B7AED3', bad: '#D9534F', x: '#7C5CE0', u: '#F08A24' };
/* ---------- one written line of an equation ----------
   tokens split by spaces · "!" pink, "^" blue, "*" green · "{num|den}" a fraction ("~" = space inside, "!" colours a part) · a token ending "_" sticks to the next one */
const e1dTw = (s, fs) => [...s].reduce((a, c) => a + fs * (/[(),.]/.test(c) ? .34 : /\s|~/.test(c) ? .3 : /[−+=×÷]/.test(c) ? .62 : /[฀-๿]/.test(c) ? .64 : .6), 0);
function e1dParse(str) { return str.trim().split(/\s+/).map(t => { let col = null, stick = false; if (/^[!^*]/.test(t)) { col = { '!': E1C.p, '^': E1C.b, '*': E1C.g }[t[0]]; t = t.slice(1); } if (t.endsWith('_')) { stick = true; t = t.slice(0, -1); }
  const pw = !/^\{/.test(t) && t.match(/^(.+?)'(.+)$/); if (pw) { const e = pw[2], ec = /^[!^*]/.test(e) ? { '!': E1C.p, '^': E1C.b, '*': E1C.g }[e[0]] : null; return { t: pw[1], pw: { s: (ec ? e.slice(1) : e).replace(/~/g, ' '), col: ec }, col, stick }; } /* v262: "2'5" = 2⁵ (เลขชี้กำลังตัวเล็กยกขึ้น · "!" ตัวแรกหลัง ' ระบายสีเลขชี้กำลัง) */
  const fr = t.match(/^\{(.+)\|(.+)\}$/); return fr ? { f: [fr[1], fr[2]].map(p => /^[!^*]/.test(p) ? { s: p.slice(1).replace(/~/g, ' '), col: { '!': E1C.p, '^': E1C.b, '*': E1C.g }[p[0]] } : { s: p.replace(/~/g, ' '), col: null }), col, stick } : { t, col, stick, op: /^[+−×÷=]$/.test(t) }; }); }
const e1dWid = (k, fs) => k.pw ? e1dTw(k.t, fs) + e1dTw(k.pw.s, fs * .62) + 2 : k.f ? Math.max(e1dTw(k.f[0].s, fs * .82), e1dTw(k.f[1].s, fs * .82)) + 6 : k.op ? fs * .62 : e1dTw(k.t, fs);
const e1dGap = (a, b, fs) => a.stick || (b && b.t === ')') ? 0 : fs * .3;
const e1dSides = (T, fs) => { const e = T.findIndex(k => k.t === '='); let L = 0, R = 0; T.forEach((k, i) => { const w = e1dWid(k, fs) + (i < T.length - 1 ? e1dGap(k, T[i + 1], fs) : 0); if (e < 0 || i > e) R += w; else if (i < e) L += w; }); return { e, L, R }; };
function e1dLine(str, eqX, y, fs, col = E1C.ink) { const T = e1dParse(str), S = e1dSides(T, fs), eqW = fs * .62, g = fs * .3; let x = S.e < 0 ? eqX + eqW / 2 + g : eqX - eqW / 2 - g - S.L, s = ''; const xs = [];
  T.forEach((k, i) => { const w = e1dWid(k, fs), c = x + w / 2, kc = k.col || col; xs.push([x, x + w]);
    if (k.f) { const fs2 = fs * .82; s += `<text x="${a4n(c)}" y="${a4n(y - fs * .42)}" class="e1d-t" text-anchor="middle" style="fill:${k.f[0].col || kc};font-size:${a4n(fs2)}px">${k.f[0].s}</text><path d="M${a4n(x + 1)} ${a4n(y - fs * .3)} H${a4n(x + w - 1)}" stroke="${kc}" stroke-width="2"/><text x="${a4n(c)}" y="${a4n(y + fs * .5)}" class="e1d-t" text-anchor="middle" style="fill:${k.f[1].col || kc};font-size:${a4n(fs2)}px">${k.f[1].s}</text>`; }
    else if (k.pw) { const bw = e1dTw(k.t, fs); s += `<text x="${a4n(x + bw / 2)}" y="${a4n(y)}" class="e1d-t" text-anchor="middle" style="fill:${kc};font-size:${a4n(fs)}px">${k.t}</text><text x="${a4n(x + bw + 1)}" y="${a4n(y - fs * .5)}" class="e1d-t" style="fill:${k.pw.col || kc};font-size:${a4n(fs * .62)}px">${k.pw.s}</text>`; }
    else s += `<text x="${a4n(c)}" y="${a4n(y)}" class="e1d-t" text-anchor="middle" style="fill:${kc};font-size:${a4n(fs)}px">${k.t}</text>`;
    x += w + (i < T.length - 1 ? e1dGap(k, T[i + 1], fs) : 0); });
  return { s, xs, T, y, fs }; }
/* equation lines one under another, the "=" signs in one column · rows[0] is the problem (printed), every other row is written by the pencil */
function e1dEq(rows, o = {}) {
  const fs0 = 24, meas = rows.filter(r => r.e).map(r => e1dSides(e1dParse(r.e), fs0)), mL = Math.max(1, ...meas.map(m => m.e < 0 ? 0 : m.L)), mR = Math.max(1, ...meas.map(m => m.e < 0 ? m.R + fs0 : m.R));
  const eqX = o.eqX || Math.max(70, Math.min(290, 180 + (mL - mR) / 2)), sc = Math.min(1, (eqX - 20) / mL, (346 - eqX - 20) / mR), fs = Math.max(15, Math.round(fs0 * sc * 10) / 10);
  let y = o.y0 || 44; const ys = rows.map((r, i) => { const fr = r.e && /\{/.test(r.e); if (i && !r.sk) y += (fr || /\{/.test(rows[i - 1].e || '') ? 1.95 : 1.62) * fs; return y; });
  const H = Math.max(240, y + 30 + (o.extraH || 0)), Ls = rows.map((r, i) => r.e ? e1dLine(r.e, eqX, ys[i], fs) : null);
  const steps = rows.slice(1).map((r, j) => { const i = j + 1; return { ink: (r.e ? Ls[i].s : '') + (r.ex ? r.ex(Ls, { eqX, fs, ys }) : ''), w: r.w, n: r.n, ans: r.ans, tmp: r.tmp }; });
  return { W: 360, H, fig: (o.fig || '') + Ls[0].s, steps, q: o.q, fin: o.fin, say: o.say, dense: steps.length > 3 || o.dense, Ls, eqX, fs, ys }; }
/* drawing on a written line */
const e1dArc = (L, i, j, col = E1C.p) => { const a = L.xs[i][0] + L.fs * .3, b = (L.xs[j][0] + L.xs[j][1]) / 2, y = L.y - L.fs * .95, hh = 10 + (b - a) * .28; return `<path d="M${a4n(a)} ${a4n(y)} Q${a4n((a + b) / 2)} ${a4n(y - hh)} ${a4n(b)} ${a4n(y)}" fill="none" stroke="${col}" stroke-width="2"/>` + `<path d="M${a4n(b - 4)} ${a4n(y - 5)} L${a4n(b)} ${a4n(y)} L${a4n(b + 4)} ${a4n(y - 6)}" fill="none" stroke="${col}" stroke-width="2"/>`; };
const e1dUnder = (L, i, j, col = E1C.p) => { const a = L.xs[i][0] - 2, b = L.xs[j][1] + 2, y = L.y + L.fs * .3; return `<path d="M${a4n(a)} ${a4n(y)} Q${a4n((a + b) / 2)} ${a4n(y + 7)} ${a4n(b)} ${a4n(y)}" fill="none" stroke="${col}" stroke-width="2.4"/>`; };
const e1dTick = (x, y, col = E1C.g) => `<path d="M${a4n(x - 8)} ${a4n(y - 6)} L${a4n(x - 2)} ${a4n(y + 1)} L${a4n(x + 10)} ${a4n(y - 13)}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
const e1dTx = (x, y, t, col = E1C.ink, cls = 'r4d-tx', anc = 'middle') => r4dTx(x, y, t, col, cls, anc);

/* ---------- pictures ---------- */
/* the balance of the game (x = purple box, 1 = orange ball) at 0.69 scale · returns the svg and the centre of every item, for crossing out */
function e1dBal(L, R, o = {}) { const k = 360 / 520, ty = o.ty != null ? o.ty : 34, P = { L: { x: [], u: [] }, R: { x: [], u: [] } }, tilt = o.tilt || 0;
  const it = (side, ob, cx) => { let s = '', n = 0; const put = kind => { const c = n % 5, r = Math.floor(n / 5), x = cx - 80 + c * 40, y = 118 - r * 40; P[side][kind].push([a4n((x + 17) * k), a4n((y - 16) * k + ty)]);
      s += kind === 'x' ? `<rect x="${x}" y="${y - 34}" width="34" height="34" rx="6" fill="${E1C.x}"/><text x="${x + 17}" y="${y - 10}" class="lq-it-t" text-anchor="middle">x</text>` : `<circle cx="${x + 17}" cy="${y - 16}" r="15" fill="${E1C.u}"/><text x="${x + 17}" y="${y - 10}" class="lq-it-t" text-anchor="middle">1</text>`; n++; };
    for (let i = 0; i < (ob.x || 0); i++) put('x'); for (let i = 0; i < (ob.u || 0); i++) put('u'); return s; };
  const items = it('L', L, 140) + it('R', R, 380);
  const s = `<g transform="translate(0 ${ty}) scale(${k})"><path d="M260 150 L236 200 h48 z" fill="#CFC7E6"/><g transform="rotate(${tilt} 260 150)"><path d="M60 150 H460" stroke="${E1C.ink}" stroke-width="6" stroke-linecap="round"/><path d="M40 122 h200 l-12 20 h-176 z M280 122 h200 l-12 20 h-176 z" fill="#FFF6D6" stroke="${E1C.ink}" stroke-width="2.5"/>${o.lt != null ? `<text x="140" y="104" class="e1d-t" text-anchor="middle" style="font-size:34px">${o.lt}</text><text x="380" y="104" class="e1d-t" text-anchor="middle" style="font-size:34px">${o.rt}</text>` : items}</g></g>`;
  return { s, P, k, ty }; }
const e1dX = (P, side, kind, i) => o4dCross(P[side][kind][i][0], P[side][kind][i][1], 9);
/* a number line with hops */
function e1dNL(lo, hi, y = 150) { const x0 = 26, x1 = 334, X = v => x0 + (v - lo) * (x1 - x0) / (hi - lo); let s = `<path d="M${x0 - 10} ${y} H${x1 + 10}" stroke="${E1C.ink}" stroke-width="2.4"/>`;
  for (let v = lo; v <= hi; v++) s += `<path d="M${a4n(X(v))} ${y - 7} V${y + 7}" stroke="${E1C.ink}" stroke-width="${v ? 1.8 : 2.6}"/>` + ((hi - lo <= 12 || v % 2 === 0) ? e1dTx(X(v), y + 26, v < 0 ? '−' + (-v) : String(v), v ? E1C.ink : E1C.b, 'r4d-sm') : '');
  const hop = (a, b, col, lab, hh = 40) => `<path d="M${a4n(X(a))} ${y - 4} Q${a4n((X(a) + X(b)) / 2)} ${a4n(y - 4 - hh * 2)} ${a4n(X(b))} ${y - 4}" fill="none" stroke="${col}" stroke-width="2.8"/><circle cx="${a4n(X(b))}" cy="${y}" r="6" fill="${col}"/>` + e1dTx((X(a) + X(b)) / 2, y - 10 - hh, lab, col);
  return { s, X, y, hop, dot: (v, col = E1C.ink) => `<circle cx="${a4n(X(v))}" cy="${y}" r="6" fill="${col}"/>` }; }
const e1dChip = (x, y, w, t, col = E1C.ink, f = '#fff') => `<rect x="${a4n(x)}" y="${y}" width="${a4n(w)}" height="38" rx="10" fill="${f}" stroke="${col}" stroke-width="2"/>` + e1dTx(x + w / 2, y + 25, t, col, 'r4d-sm');
const e1dSee = (title, cap, list) => a4dSee(title, cap, list);
/* ③ an item of this lesson's own game, chosen by its sig (i1, b2, …) */
const e1dTry = (id, sigs, title) => g5dTry(id, () => { const L = LESSONS.find(x => x.id === id), qs = L.game().filter(q => q && q.__sig && sigs.includes(q.__sig.split(' ')[1])); if (!qs.length) return null; const q = pick(qs); return { ...q, __sig: q.__sig + ' ลองทำ' }; }, title); /* sig ใหม่: เกมยังใช้ข้อแบบนี้ได้ (ตัวเลขสุ่มใหม่) — เกมของบทนี้มีข้อละแบบ ถ้าตัดออกจะเหลือไม่ถึง 10 ข้อ */
/* an old hands-on page of this lesson (ชิป ตาชั่ง ลากค่า x …), found by its title */
const e1dOld = (L, re) => { const p = L.teach.find(s => re.test(s.t || '')); return p ? { ...p, t: `<b>ลงมือเอง</b> — ${String(p.t).replace(/<[^>]+>/g, '')}` } : null; };

/* =========================================================
   the lessons: each entry is (old lesson) => pages
   ========================================================= */
const E1D_TEACH = {
  /* ด่าน 1 ทบทวนจำนวนเต็ม */
  2601: L => { const N = e1dNL(-8, 4, 150);
    return [
      e1dSee('บวก ลบ บนเส้นจำนวน', '<b>แตะรูป</b> — บวกเดินไปทางขวา ลบเดินไปทางซ้าย', [
        { t: '(−5) + 3', f: on => e1dTx(180, 50, '(−5) + 3', E1C.ink, 'r4v-big') + N.s + N.dot(-5) + (on ? r4vH(N.hop(-5, -2, E1C.g, '+ 3', 30) + e1dTx(N.X(-2), 214, '= −2', E1C.g, 'r4v-big')) : ''), s: 'บวก 3 = เดินไปทางขวา 3<br>(−5) + 3 = <b>−2</b>' },
        { t: '3 − 8', f: on => e1dTx(180, 50, '3 − 8 = 3 + (−8)', E1C.ink, 'r4v-big') + N.s + N.dot(3) + (on ? r4vH(N.hop(3, -5, E1C.p, '− 8', 36) + e1dTx(N.X(-5), 214, '= −5', E1C.p, 'r4v-big')) : ''), s: 'ลบ = บวกจำนวนตรงข้าม<br>เดินไปทางซ้าย 8 = <b>−5</b>' }]),
      e1dOld(L, /ชิปบวก/),
      e1dTry(2601, ['i1', 'i2', 'i3'], 'บวก ลบจำนวนเต็ม'),
      e1dOld(L, /กฎเครื่องหมาย/),
      e1dTry(2601, ['i4', 'i5', 'i6', 'i7'], 'คูณ หารจำนวนเต็ม'),
      r4dShow('(−3) × 4 − (−6) ÷ 2', e1dEq([{ e: '(−3) × 4 − (−6) ÷ 2' }, { e: '= !−12 − (−6) ÷ 2', w: '(−3) × 4 = −12', n: 'คูณก่อน: ต่างเครื่องหมาย → ลบ' }, { e: '= −12 − !(−3)', w: '(−6) ÷ 2 = −3', n: 'หาร: ต่างเครื่องหมาย → ลบ' },
        { e: '= −12 !+ !3', w: 'ลบด้วย −3 = บวก 3', n: 'ลบจำนวนลบ = บวกจำนวนบวก' }, { e: '= *−9', w: 'ตอบ −9', n: 'เหลือจำนวนเดียว', ans: 1 }], { eqX: 64, q: 'หาค่า (−3) × 4 − (−6) ÷ 2', fin: `<b>คูณ หาร ก่อน</b> แล้วบวก ลบ${r4vSep}ลบจำนวนลบ = บวก`, say: 'คูณหารก่อน แล้วบวกลบ ลบจำนวนลบเท่ากับบวก' })),
      e1dTry(2601, ['i9'], 'ลำดับการคำนวณ')]; },

  /* ด่าน 2 สมบัติของการดำเนินการ */
  2602: L => { const dots = (r, c, x0, y0, col) => Array.from({ length: r * c }, (_, i) => `<circle cx="${x0 + (i % c) * 20}" cy="${y0 + Math.floor(i / c) * 20}" r="7" fill="${col}" stroke="${E1C.ink}" stroke-width="1.2"/>`).join(''), N = e1dNL(-8, 8, 150);
    return [
      e1dSee('การสลับที่', '<b>แตะรูป</b> — บวก คูณ สลับที่ได้ ลบ หาร สลับที่ไม่ได้', [
        { t: '3 × 5 กับ 5 × 3', f: on => dots(3, 5, 40, 70, '#9FD0F0') + (on ? r4vH(dots(5, 3, 230, 50, '#FFC24C') + e1dTx(80, 200, '3 × 5 = 15', E1C.b) + e1dTx(250, 200, '5 × 3 = 15', E1C.o)) : e1dTx(260, 110, '?', E1C.fade, 'r4v-big')), s: 'หมุนภาพ จำนวนเท่าเดิม<br>3 × 5 = <b>5 × 3</b>' },
        { t: '9 − 4 กับ 4 − 9', f: on => N.s + (on ? r4vH(N.dot(5, E1C.g) + e1dTx(N.X(5), 110, '9 − 4 = 5', E1C.g) + N.dot(-5, E1C.p) + e1dTx(N.X(-5), 110, '4 − 9 = −5', E1C.p)) : e1dTx(180, 100, '9 − 4 = 4 − 9 ?', E1C.ink, 'r4v-big')), s: 'คำตอบไม่เท่ากัน<br>การลบ<b>สลับที่ไม่ได้</b>' }]),
      e1dOld(L, /แจกแจง/),
      r4dShow('7 × 98', e1dEq([{ e: '7 × 98' }, { e: '= 7 × (_ !100 − !2_ )', w: '98 = 100 − 2', n: 'แยกให้คิดง่าย' }, { e: '= !700 − !14', w: '7 × 100 − 7 × 2', n: 'สมบัติการแจกแจง' }, { e: '= *686', w: 'ตอบ 686', n: 'คิดในใจได้', ans: 1 }],
        { eqX: 80, q: 'หาค่า 7 × 98 โดยใช้สมบัติการแจกแจง', fin: 'a × (b − c) = a × b − a × c ช่วย<b>คิดในใจ</b>', say: 'ใช้สมบัติการแจกแจงช่วยคิดในใจ' })),
      e1dTry(2602, ['p7', 'p10'], 'ใช้สมบัติช่วยคิด'),
      e1dTry(2602, ['p1', 'p2', 'p3'], 'บอกสมบัติ'),
      e1dSee('เอกลักษณ์ และอินเวอร์ส', '<b>แตะรูป</b> — บวกแล้วได้ 0 คูณแล้วได้ 1', [
        { t: 'อินเวอร์สการบวก', f: on => N.s + N.dot(7) + (on ? r4vH(N.hop(7, 0, E1C.p, '+ (−7)', 34) + e1dTx(N.X(0), 214, '7 + (−7) = 0', E1C.p, 'r4v-tx')) : ''), s: 'อินเวอร์สการบวกของ 7 คือ <b>−7</b><br>บวกกันได้ 0' },
        { t: 'อินเวอร์สการคูณ', f: on => `<rect x="40" y="90" width="280" height="44" rx="6" fill="#C9F0D9" stroke="${E1C.ink}" stroke-width="2"/>` + (on ? r4vH(Array.from({ length: 6 }, (_, i) => `<path d="M${40 + (i + 1) * 40} 90 V134" stroke="${E1C.ink}" stroke-width="1.6"/>`).join('') + `<rect x="40" y="90" width="40" height="44" fill="#FFC24C" stroke="${E1C.ink}" stroke-width="2"/>` + e1dTx(180, 180, '7 × ¹⁄₇ = 1', E1C.b, 'r4v-big')) : e1dTx(180, 118, '7 ส่วน', E1C.ink)), s: 'อินเวอร์สการคูณของ 7 คือ <b>1/7</b><br>คูณกันได้ 1' }]),
      e1dTry(2602, ['p4', 'p5', 'p6'], 'เอกลักษณ์ อินเวอร์ส')]; },

  /* ด่าน 3 ตัวแปร */
  2603: L => { const bag = (x, open) => `<path d="M${x} 80 Q${x - 8} 140 ${x + 26} 140 Q${x + 60} 140 ${x + 52} 80 Z" fill="${open ? '#EFE9FA' : E1C.x}" stroke="${E1C.ink}" stroke-width="2"/>` + (open ? Array.from({ length: 4 }, (_, i) => `<circle cx="${x + 12 + (i % 2) * 18}" cy="${104 + Math.floor(i / 2) * 18}" r="7" fill="${E1C.u}"/>`).join('') : e1dTx(x + 26, 120, 'x', '#fff', 'r4v-big'));
    return [
      e1dSee('ตัวแปร', '<b>แตะรูป</b> — ถุงปิด = จำนวนที่ยังไม่รู้', [
        { t: '3x + 2', f: on => [0, 1, 2].map(i => bag(30 + i * 70, on)).join('') + `<circle cx="252" cy="122" r="9" fill="${E1C.u}"/><circle cx="276" cy="122" r="9" fill="${E1C.u}"/>` + e1dTx(180, 48, '3 ถุง ถุงละ x ลูก กับอีก 2 ลูก = 3x + 2', E1C.ink, 'r4v-tx') + (on ? r4vH(e1dTx(180, 196, 'ถ้า x = 4 → 3 × 4 + 2 = 14', E1C.g, 'r4v-big')) : e1dTx(180, 196, 'x = ?', E1C.fade, 'r4v-big')), s: 'x แทนจำนวนที่ยังไม่รู้<br>ถ้า x = 4 → 3x + 2 = <b>14</b>' }]),
      e1dOld(L, /ลากค่า x/),
      e1dTry(2603, ['v1', 'v2'], 'ตัวแปร ค่าคงตัว'),
      r4dShow('แทนค่า x = −4 ใน 5x − 1', e1dEq([{ e: '5x − 1' }, { e: '= 5_ !(−4) − 1', w: 'แทน x ด้วย (−4)', n: 'แทนจำนวนลบ ใส่วงเล็บ' }, { e: '= !−20 − 1', w: '5 × (−4) = −20', n: 'คูณก่อน' }, { e: '= *−21', w: 'ตอบ −21', n: '−20 − 1', ans: 1 }],
        { eqX: 90, q: 'ถ้า x = −4 แล้ว 5x − 1 เท่ากับเท่าใด', fin: 'แทนค่า: <b>ใส่จำนวนแทน x</b> (จำนวนลบใส่วงเล็บ) แล้วคำนวณ', say: 'แทนค่า ใส่จำนวนแทนเอ็กซ์ จำนวนลบใส่วงเล็บ แล้วคำนวณ' })),
      e1dTry(2603, ['v3', 'v4', 'v5'], 'แทนค่า')]; },

  /* ด่าน 4 นิพจน์ */
  2604: L => { const E = e1dLine('3x − 2y + 7', 40, 92, 34), c = i => (E.xs[i][0] + E.xs[i][1]) / 2, chips = [[28, 86, 'มากกว่า'], [122, 132, '4 เท่าของ x'], [262, 74, 'อยู่ 5']];
    return [
      e1dSee('ส่วนประกอบของนิพจน์', '<b>แตะรูป</b> — พจน์ สัมประสิทธิ์ ค่าคงตัว', [
        { t: '3x − 2y + 7', f: on => E.s + (on ? r4vH([0, 2, 4].map((i, j) => `<path d="M${a4n(E.xs[i][0] - (j ? 20 : 0))} 108 V116 H${a4n(E.xs[i][1])} V108" fill="none" stroke="${E1C.b}" stroke-width="2"/>` + e1dTx(c(i), 136, `พจน์ ${j + 1}`, E1C.b, 'r4d-sm')).join('')
          + e1dTx(c(0), 178, 'สัมประสิทธิ์ 3', E1C.p, 'r4d-sm') + e1dTx(c(2) - 10, 200, 'สัมประสิทธิ์ −2', E1C.p, 'r4d-sm') + e1dTx(c(4), 178, 'ค่าคงตัว 7', E1C.g, 'r4d-sm')) : ''), s: '3 พจน์ · สัมประสิทธิ์ของ x คือ 3<br>ค่าคงตัวคือ <b>7</b>'.replace(' · ', '<br>') }]),
      e1dTry(2604, ['n1', 'n2', 'n4'], 'ส่วนประกอบของนิพจน์'),
      e1dOld(L, /จับคู่ข้อความกับนิพจน์/),
      r4dShow('ข้อความ → นิพจน์', { fig: chips.map(([x, w, t]) => e1dChip(x, 60, w, t)).join(''), q: 'เขียน "มากกว่า 4 เท่าของ x อยู่ 5" เป็นนิพจน์',
        steps: [{ ink: e1dChip(122, 60, 132, '4 เท่าของ x', E1C.p, '#FFE4EE') + e1dTx(188, 140, '4x', E1C.p, 'r4d-big'), w: '4 เท่าของ x → 4x', n: 'กี่เท่า → คูณ' },
          { ink: e1dChip(28, 60, 86, 'มากกว่า', E1C.b, '#E4F0FB') + e1dChip(262, 60, 74, 'อยู่ 5', E1C.b, '#E4F0FB') + e1dTx(299, 140, '+ 5', E1C.b, 'r4d-big'), w: 'มากกว่า … อยู่ 5 → + 5', n: 'มากกว่า → บวก' },
          { ink: e1dTx(180, 206, '4x + 5', E1C.g, 'r4d-big'), w: 'ได้ 4x + 5', n: 'นิพจน์', ans: 1 }],
        fin: `อ่านทีละส่วน: <b>กี่เท่า → คูณ</b>${r4vSep}มากกว่า → บวก${r4vSep}น้อยกว่า → ลบ`.replace(/ · /g, r4vSep), say: 'อ่านทีละส่วน กี่เท่าใช้คูณ มากกว่าใช้บวก น้อยกว่าใช้ลบ' }),
      e1dTry(2604, ['n5', 'n6'], 'เขียนนิพจน์'),
      e1dTry(2604, ['n8'], 'พจน์ที่คล้ายกัน')]; },

  /* ด่าน 5 การจัดรูปนิพจน์ */
  2605: L => { const xt = (x, y, neg) => `<rect x="${x}" y="${y}" width="16" height="44" rx="3" fill="${neg ? '#FFE4EE' : E1C.x}" stroke="${neg ? E1C.p : E1C.ink}" stroke-width="1.6"/>` + e1dTx(x + 8, y + 28, neg ? '−x' : 'x', neg ? E1C.p : '#fff', 'r4d-sm'), ut = (x, y, neg) => `<rect x="${x}" y="${y}" width="16" height="16" rx="3" fill="${neg ? '#FFE4EE' : E1C.u}" stroke="${neg ? E1C.p : E1C.ink}" stroke-width="1.4"/>`;
    const row = [['x', 0], ['x', 0], ['x', 0], ['u', 0], ['u', 0], ['x', 1], ['u', 0], ['u', 0], ['u', 0], ['u', 0], ['x', 0], ['x', 0], ['u', 1]];
    return [
      e1dSee('รวมพจน์ที่คล้ายกัน', '<b>แตะรูป</b> — 3x + 2 − x + 4 + 2x − 1', [
        { t: 'แผ่นพจน์', f: on => e1dTx(180, 40, '3x + 2 − x + 4 + 2x − 1', E1C.ink, 'r4v-tx') + (on ? r4vH([0, 1, 2, 3, 4].map(i => xt(30 + i * 22, 70)).join('') + xt(150, 70, 1) + o4dCross(158, 92, 12) + o4dCross(118, 92, 12)
          + [0, 1, 2, 3, 4, 5].map(i => ut(200 + i * 22, 84)).join('') + ut(332, 84, 1) + o4dCross(340, 92, 9) + o4dCross(310, 92, 9) + e1dTx(90, 150, '3 − 1 + 2 = 4 → 4x', E1C.x, 'r4v-tx') + e1dTx(270, 150, '2 + 4 − 1 = 5', E1C.u, 'r4v-tx') + e1dTx(180, 204, '= 4x + 5', E1C.g, 'r4v-big'))
          : row.map(([k, n], i) => k === 'x' ? xt(16 + i * 25, 80, n) : ut(16 + i * 25, 94, n)).join('')), s: 'x รวมกับ x · ค่าคงตัวรวมกับค่าคงตัว<br>ได้ <b>4x + 5</b>'.replace(' · ', ' ') }]),
      e1dOld(L, /แยกพจน์/),
      e1dTry(2605, ['r1', 'r2', 'r4'], 'รวมสัมประสิทธิ์'),
      r4dShow('3(2x − 1) + 4', e1dEq([{ e: '3(_ 2x − 1) + 4' }, { e: '= !6x − !3 + 4', w: '3 × 2x = 6x, 3 × 1 = 3', n: 'แจกแจง: คูณเข้าทุกพจน์', ex: Ls => e1dArc(Ls[0], 0, 1) + e1dArc(Ls[0], 0, 3) }, { e: '= 6x !+ !1', w: '−3 + 4 = 1', n: 'รวมค่าคงตัว' },
        { w: 'ตอบ 6x + 1', n: '6x กับ 1 รวมกันไม่ได้', ans: 1 }], { eqX: 90, q: 'จัดรูป 3(2x − 1) + 4', fin: '<b>แจกแจง</b> แล้วรวมเฉพาะพจน์ที่คล้ายกัน', say: 'แจกแจง แล้วรวมเฉพาะพจน์ที่คล้ายกัน' })),
      e1dTry(2605, ['r5', 'r6', 'r7'], 'จัดรูปนิพจน์')]; },

  /* ด่าน 6 ความหมายของสมการ */
  2606: L => [
    e1dSee('สมการ = ตาชั่งสองข้างเท่ากัน', '<b>แตะรูป</b> — ดูว่าตาชั่งสมดุลไหม', [
      { t: '3 + 5 = 8', f: on => e1dBal({}, {}, { lt: '3 + 5', rt: '8' }).s + (on ? r4vH(e1dTx(180, 230, 'สมดุล → สมการที่เป็นจริง', E1C.g, 'r4v-tx')) : e1dTx(180, 230, '?', E1C.fade, 'r4v-tx')), s: 'สองข้างเท่ากัน<br>สมการที่<b>เป็นจริง</b>' },
      { t: '5 + 4 = 10', f: on => e1dBal({}, {}, { lt: '5 + 4', rt: '10', tilt: on ? 6 : 0 }).s + (on ? r4vH(e1dTx(180, 230, '9 ≠ 10 → สมการที่เป็นเท็จ', E1C.bad, 'r4v-tx')) : e1dTx(180, 230, '?', E1C.fade, 'r4v-tx')), s: 'สองข้างไม่เท่ากัน<br>สมการที่<b>เป็นเท็จ</b>' }]),
    e1dOld(L, /สมการ หรือ ไม่ใช่/),
    e1dTry(2606, ['q1', 'q2'], 'สมการหรือไม่'),
    r4dShow('12 − 4 = 2 × 4 จริงไหม', e1dEq([{ e: '12 − 4 = 2 × 4' }, { e: '!8 = 2 × 4', w: 'ข้างซ้าย 12 − 4 = 8', n: 'คิดทีละข้าง' }, { e: '8 = !8', w: 'ข้างขวา 2 × 4 = 8', n: 'แล้วข้างขวา' },
      { w: 'เท่ากัน → เป็นจริง', n: 'สมการที่เป็นจริง', ans: 1, ex: (Ls, g) => e1dTick(g.eqX + 70, Ls[2].y) }], { q: 'สมการ 12 − 4 = 2 × 4 เป็นจริงหรือไม่', fin: 'คำนวณ<b>ทีละข้าง</b> แล้วเทียบว่าเท่ากันไหม', say: 'คำนวณทีละข้าง แล้วเทียบว่าเท่ากันไหม' })),
    e1dTry(2606, ['q4', 'q9'], 'จริงหรือเท็จ'),
    e1dTry(2606, ['q3', 'q8'], 'เติม □ ให้เป็นจริง')],

  /* ด่าน 7 คำตอบของสมการ */
  2607: L => [
    e1dSee('คำตอบของสมการ', '<b>แตะรูป</b> — ลองแทนค่าใน x + 7 = 12', [
      { t: 'ลอง x = 4', f: on => e1dBal({}, {}, { lt: '4 + 7', rt: '12', tilt: on ? 5 : 0 }).s + (on ? r4vH(e1dTx(180, 230, '11 ≠ 12 ✗', E1C.bad, 'r4v-tx')) : ''), s: '11 ไม่เท่ากับ 12<br>4 <b>ไม่ใช่</b>คำตอบ' },
      { t: 'ลอง x = 5', f: on => e1dBal({}, {}, { lt: '5 + 7', rt: '12' }).s + (on ? r4vH(e1dTx(180, 230, '12 = 12 ✓', E1C.g, 'r4v-tx')) : ''), s: 'สมดุล<br>x = <b>5</b> เป็นคำตอบ' }]),
    e1dOld(L, /ลองแทนค่า/),
    r4dShow('x = 3 เป็นคำตอบไหม', e1dEq([{ e: '4x − 5 = 7' }, { e: '4_ !(3) − 5 = 7', w: 'แทน x = 3', n: 'แทนทุกที่ที่มี x' }, { e: '!12 − 5 = 7', w: '4 × 3 = 12', n: 'คูณก่อน' }, { e: '!7 = 7', w: '12 − 5 = 7', n: 'สองข้างเท่ากัน' },
      { w: 'x = 3 เป็นคำตอบ', n: 'สมการเป็นจริง', ans: 1, ex: (Ls, g) => e1dTick(g.eqX + 50, Ls[3].y) }], { q: 'x = 3 เป็นคำตอบของสมการ 4x − 5 = 7 หรือไม่', fin: 'คำตอบ = จำนวนที่<b>แทนแล้วสมการเป็นจริง</b>', say: 'คำตอบ คือจำนวนที่แทนแล้วสมการเป็นจริง' })),
    e1dTry(2607, ['a1', 'a2'], 'คำตอบของสมการ'),
    e1dTry(2607, ['a3', 'a4', 'a10'], 'หาคำตอบ')],

  /* ด่าน 8 สมบัติของการเท่ากัน */
  2608: L => { const B1 = e1dBal({ x: 1, u: 2 }, { u: 5 }), B2 = e1dBal({ x: 2 }, { u: 6 }), B = e1dBal({ x: 1, u: 3 }, { u: 7 }, { ty: 46 });
    return [
      e1dSee('สมบัติของการเท่ากัน', '<b>แตะรูป</b> — ทำอย่างเดียวกันทั้งสองข้าง', [
        { t: 'เติมเท่ากัน', f: on => (on ? e1dBal({ x: 1, u: 3 }, { u: 6 }).s + r4vH(e1dTx(180, 220, '+1 ทั้งสองข้าง ยังสมดุล', E1C.g, 'r4v-tx')) : B1.s + e1dTx(180, 220, 'x + 2 = 5', E1C.ink, 'r4v-tx')), s: 'บวกเท่ากันทั้งสองข้าง<br><b>ยังสมดุล</b>' },
        { t: 'แบ่งครึ่ง', f: on => B2.s + (on ? r4vH(e1dX(B2.P, 'L', 'x', 1) + [3, 4, 5].map(i => e1dX(B2.P, 'R', 'u', i)).join('') + e1dTx(180, 220, '÷ 2 ทั้งสองข้าง → x = 3', E1C.g, 'r4v-tx')) : e1dTx(180, 220, '2x = 6', E1C.ink, 'r4v-tx')), s: 'หารเท่ากันทั้งสองข้าง<br><b>ยังสมดุล</b>' }]),
      e1dOld(L, /ตาชั่งสมดุล/),
      r4dShow('ตาชั่ง x + 3 = 7', { fig: B.s + e1dTx(180, 34, 'x + 3 = 7', E1C.ink, 'r4d-big'), q: 'ตาชั่งสมดุล กล่อง x หนักเท่าใด',
        steps: [{ ink: [0, 1, 2].map(i => e1dX(B.P, 'L', 'u', i) + e1dX(B.P, 'R', 'u', i)).join(''), w: 'x + 3 − 3 = 7 − 3', n: 'เอาก้อน 1 ออกข้างละ 3' },
          { ink: [3, 4, 5, 6].map(i => `<circle cx="${B.P.R.u[i][0]}" cy="${B.P.R.u[i][1]}" r="14" fill="none" stroke="${E1C.g}" stroke-width="2.4"/>`).join('') + e1dTx(180, 226, 'x = 4', E1C.g, 'r4d-big'), w: 'x = 4', n: 'เหลือ x ข้างเดียว' }, { w: 'ตรวจ 4 + 3 = 7', n: 'สมดุล', ans: 1 }],
        fin: 'ทำ<b>อย่างเดียวกันทั้งสองข้าง</b> สมการยังเป็นจริง', say: 'ทำอย่างเดียวกันทั้งสองข้าง สมการยังเป็นจริง' }),
      e1dTry(2608, ['e1', 'e2'], 'ตาชั่ง'),
      e1dTry(2608, ['e4', 'e5', 'e6', 'e7'], 'ทำทั้งสองข้าง')]; },

  /* ด่าน 9 x + a = b */
  2609: L => { const card = (x, a, b, col) => `<rect x="${x}" y="70" width="130" height="90" rx="14" fill="#fff" stroke="${col}" stroke-width="2.4"/>` + e1dTx(x + 40, 124, a, col, 'r4v-big') + e1dTx(x + 92, 124, b, col, 'r4v-big') + `<path d="M${x + 52} 108 h28 M${x + 74} 102 l6 6 l-6 6" fill="none" stroke="${col}" stroke-width="2.4"/>`;
    return [
      e1dSee('ทำตรงข้ามเพื่อเหลือ x', '<b>แตะรูป</b> — บวก กับ ลบ ย้อนกันได้', [
        { t: 'x + 4 → x', f: on => e1dTx(180, 50, 'x + 4', E1C.ink, 'r4v-big') + (on ? r4vH(card(30, '+ 4', '− 4', E1C.p) + e1dTx(95, 196, 'x + 4 − 4 = x', E1C.p, 'r4v-tx') + card(200, '− 4', '+ 4', E1C.b) + e1dTx(265, 196, 'x − 4 + 4 = x', E1C.b, 'r4v-tx')) : ''), s: '+ 4 ย้อนด้วย <b>− 4</b><br>− 4 ย้อนด้วย <b>+ 4</b>' }]),
      e1dOld(L, /ตาชั่ง/),
      r4dShow('x − 4 = 9', e1dEq([{ e: 'x − 4 = 9' }, { e: 'x − 4 !+ !4 = 9 !+ !4', w: 'บวก 4 ทั้งสองข้าง', n: '− 4 ย้อนด้วย + 4' }, { e: 'x = *13', w: 'x = 13', n: '− 4 + 4 = 0' }, { w: 'ตรวจ 13 − 4 = 9', n: 'เป็นจริง', ans: 1 }],
        { q: 'แก้สมการ x − 4 = 9', fin: 'ทำ<b>ตรงข้าม</b>กับสิ่งที่ติดกับ x ทั้งสองข้าง', say: 'ทำตรงข้ามกับสิ่งที่ติดกับเอ็กซ์ ทั้งสองข้าง' })),
      e1dTry(2609, ['b1', 'b2', 'b3'], 'สมการบวก ลบ'),
      e1dTry(2609, ['b5', 'b6', 'b10'], 'คำตอบเป็นจำนวนลบ')]; },

  /* ด่าน 10 ax = b */
  2610: L => { const B = e1dBal({ x: 3 }, { u: 12 }), gx = B.P.R.u;
    return [
      e1dSee('3x = 12', '<b>แตะรูป</b> — แบ่งเป็น 3 ส่วนเท่ากัน', [
        { t: '3 กล่อง = 12 ลูก', f: on => B.s + (on ? r4vH(gx.map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="13" fill="none" stroke="${[E1C.p, E1C.b, E1C.g][i % 3]}" stroke-width="3"/>`).join('') + B.P.L.x.map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="15" fill="none" stroke="${[E1C.p, E1C.b, E1C.g][i]}" stroke-width="3"/>`).join('') + e1dTx(180, 222, '1 กล่อง = 12 ÷ 3 = 4', E1C.g, 'r4v-tx')) : e1dTx(180, 222, '3x = 12', E1C.ink, 'r4v-tx')), s: '3 กล่องหนัก 12<br>1 กล่อง = 12 ÷ 3 = <b>4</b>' }]),
      e1dOld(L, /ตาชั่ง/),
      r4dShow('x หารด้วย 3 ได้ 5', e1dEq([{ e: '{x|3} = 5' }, { e: '{x|3} !× !3 = 5 !× !3', w: 'คูณ 3 ทั้งสองข้าง', n: 'หาร 3 ย้อนด้วย × 3' }, { e: 'x = *15', w: 'x = 15' }, { w: 'ตรวจ 15 ÷ 3 = 5', n: 'เป็นจริง', ans: 1 }],
        { q: `แก้สมการ ${fqHTML('x', 3)} = 5`, fin: 'หาร ↔ คูณ เป็นการดำเนินการ<b>ตรงข้ามกัน</b>', say: 'หารกับคูณเป็นการดำเนินการตรงข้ามกัน' })),
      e1dTry(2610, ['m1', 'm2', 'm6'], 'สมการคูณ หาร'),
      r4dShow('−2x = 10', e1dEq([{ e: '−2x = 10' }, { e: '{−2x|!−2} = {10|!−2}', w: 'หาร −2 ทั้งสองข้าง', n: 'หารด้วยสัมประสิทธิ์ทั้งตัว (รวมเครื่องหมาย)' }, { e: 'x = *−5', w: 'x = −5', n: 'บวก ÷ ลบ = ลบ' }, { w: 'ตรวจ −2 × (−5) = 10', n: 'เป็นจริง', ans: 1 }],
        { q: 'แก้สมการ −2x = 10', fin: 'หารด้วยสัมประสิทธิ์<b>รวมเครื่องหมายลบ</b> แล้วตรวจคำตอบ', say: 'หารด้วยสัมประสิทธิ์รวมเครื่องหมายลบ แล้วตรวจคำตอบ' })),
      e1dTry(2610, ['m3', 'm4', 'm7'], 'สัมประสิทธิ์ติดลบ')]; },

  /* ด่าน 11 ax + b = c */
  2611: L => { const bx = (x, y, t, col) => `<rect x="${x - 34}" y="${y - 22}" width="68" height="40" rx="10" fill="#EAF4FC" stroke="${col}" stroke-width="2.2"/>` + e1dTx(x, y + 6, t, col, 'r4v-tx'), ar = (a, b, y, col) => r4dArr([a, y], [b, y], col);
    return [
      e1dSee('ย้อนกลับ', '<b>แตะรูป</b> — x ผ่านเครื่อง × 2 แล้ว + 3 ได้ 11', [
        { t: '2x + 3 = 11', f: on => e1dTx(26, 84, 'x', E1C.x, 'r4v-big') + ar(42, 76, 78, E1C.ink) + bx(112, 78, '× 2', E1C.ink) + ar(148, 182, 78, E1C.ink) + bx(218, 78, '+ 3', E1C.ink) + ar(254, 288, 78, E1C.ink) + e1dTx(316, 84, '11', E1C.ink, 'r4v-big')
          + (on ? r4vH(ar(288, 254, 160, E1C.p) + bx(218, 160, '− 3', E1C.p) + ar(182, 148, 160, E1C.p) + bx(112, 160, '÷ 2', E1C.p) + ar(76, 42, 160, E1C.p) + e1dTx(26, 166, '4', E1C.p, 'r4v-big') + e1dTx(316, 166, '11', E1C.p, 'r4v-big') + e1dTx(180, 214, 'ย้อน: ขั้นสุดท้ายก่อน', E1C.p, 'r4v-tx')) : ''), s: 'ย้อนกลับ: − 3 ก่อน แล้ว ÷ 2<br>x = <b>4</b>' }]),
      e1dOld(L, /เครื่องแปลงจำนวน/),
      r4dShow('2x + 3 = 11', e1dEq([{ e: '2x + 3 = 11' }, { e: '2x + 3 !− !3 = 11 !− !3', w: 'ลบ 3 ทั้งสองข้าง', n: 'ย้อน + 3 ก่อน' }, { e: '2x = !8', w: '2x = 8' }, { e: '{2x|!2} = {8|!2}', w: 'หาร 2 ทั้งสองข้าง', n: 'แล้วย้อน × 2' },
        { e: 'x = *4', w: 'x = 4' }, { w: 'ตรวจ 2(4) + 3 = 11', n: 'เป็นจริง', ans: 1 }], { q: 'แก้สมการ 2x + 3 = 11', fin: 'ย้อนสิ่งที่ทำ<b>หลังสุดก่อน</b>: บวก ลบ ก่อน แล้วคูณ หาร', say: 'ย้อนสิ่งที่ทำหลังสุดก่อน บวกลบก่อน แล้วคูณหาร' })),
      e1dTry(2611, ['h1', 'h2'], 'สมการสองขั้น'),
      e1dTry(2611, ['h3', 'h4', 'h10'], 'ย้อนกลับหา x')]; },

  /* ด่าน 12 x อยู่ทั้งสองข้าง */
  2612: L => { const B = e1dBal({ x: 3, u: 2 }, { x: 1, u: 8 });
    return [
      e1dSee('x ทั้งสองข้าง', '<b>แตะรูป</b> — เอากล่อง x ออกเท่ากันทั้งสองข้าง', [
        { t: '3x + 2 = x + 8', f: on => B.s + (on ? r4vH(e1dX(B.P, 'L', 'x', 2) + e1dX(B.P, 'R', 'x', 0) + e1dTx(180, 222, 'เหลือ 2x + 2 = 8', E1C.g, 'r4v-tx')) : e1dTx(180, 222, '3x + 2 = x + 8', E1C.ink, 'r4v-tx')), s: 'เอา x ออกข้างละ 1 กล่อง<br>ให้ x อยู่<b>ข้างเดียว</b>' }]),
      e1dOld(L, /กล่อง x ทั้งสองข้าง/),
      r4dShow('5x − 2 = 2x + 10', e1dEq([{ e: '5x − 2 = 2x + 10' }, { e: '5x − 2 !− !2x = 2x + 10 !− !2x', w: 'ลบ 2x ทั้งสองข้าง', n: 'เก็บ x ไว้ข้างที่มากกว่า' }, { e: '3x − 2 = 10', w: '3x − 2 = 10' },
        { e: '3x = !12', w: 'บวก 2 ทั้งสองข้าง', n: '− 2 ย้อนด้วย + 2' }, { e: 'x = *4', w: 'หาร 3 ทั้งสองข้าง' }, { w: 'ตรวจ 18 = 18', n: 'สองข้างเท่ากัน', ans: 1 }], { q: 'แก้สมการ 5x − 2 = 2x + 10', fin: '<b>รวม x ไว้ข้างเดียว</b> ค่าคงตัวไว้อีกข้าง แล้วแก้ต่อ', say: 'รวมเอ็กซ์ไว้ข้างเดียว ค่าคงตัวไว้อีกข้าง แล้วแก้ต่อ' })),
      e1dTry(2612, ['k1', 'k2', 'k3'], 'x ทั้งสองข้าง'),
      e1dTry(2612, ['k7', 'k8'], 'ขั้นแรก')]; },

  /* ด่าน 13 สมการที่มีวงเล็บ */
  2613: L => { const A = e1dLine('3(_ x − 4)', 110, 90, 34), B = e1dLine('−(_ x − 3)', 110, 90, 34);
    return [
      e1dSee('ตัดวงเล็บ', '<b>แตะรูป</b> — คูณเข้าทุกพจน์ในวงเล็บ', [
        { t: '3(x − 4)', f: on => A.s + (on ? r4vH(e1dArc(A, 0, 1) + e1dArc(A, 0, 3) + e1dTx(180, 170, '= 3x − 12', E1C.p, 'r4v-big')) : ''), s: '3 คูณ x และ 3 คูณ 4<br>= <b>3x − 12</b>' },
        { t: '−(x − 3)', f: on => B.s + (on ? r4vH(e1dArc(B, 0, 1) + e1dArc(B, 0, 3) + e1dTx(180, 170, '= −x + 3', E1C.p, 'r4v-big')) : ''), s: 'ลบหน้าวงเล็บ<br><b>เปลี่ยนเครื่องหมายทุกพจน์</b>' }]),
      e1dTry(2613, ['w3', 'w4'], 'ตัดวงเล็บ'),
      r4dShow('2(x + 3) = 14', e1dEq([{ e: '2(_ x + 3) = 14' }, { e: '!2x + !6 = 14', w: '2 × x + 2 × 3', n: 'แจกแจง', ex: Ls => e1dArc(Ls[0], 0, 1) + e1dArc(Ls[0], 0, 3) }, { e: '2x = !8', w: 'ลบ 6 ทั้งสองข้าง' }, { e: 'x = *4', w: 'หาร 2 ทั้งสองข้าง' },
        { w: 'ตรวจ 2(4 + 3) = 14', n: 'เป็นจริง', ans: 1 }], { q: 'แก้สมการ 2(x + 3) = 14', fin: '<b>ตัดวงเล็บก่อน</b> (หรือหาร 2 ก่อนก็ได้) แล้วแก้ต่อ', say: 'ตัดวงเล็บก่อน หรือหารสองก่อนก็ได้ แล้วแก้ต่อ' })),
      e1dTry(2613, ['w1', 'w2'], 'สมการมีวงเล็บ'),
      r4dShow('2(x + 1) − (x − 3) = 10', e1dEq([{ e: '2(_ x + 1) − (_ x − 3) = 10' }, { e: '!2x + !2 !− !x !+ !3 = 10', w: 'ตัดวงเล็บทั้งสองคู่', n: 'ลบหน้าวงเล็บ เปลี่ยนเครื่องหมาย', ex: Ls => e1dArc(Ls[0], 0, 1) + e1dArc(Ls[0], 0, 3) + e1dArc(Ls[0], 5, 6) + e1dArc(Ls[0], 5, 8) },
        { e: 'x + 5 = 10', w: 'รวมพจน์: x + 5', n: '2x − x, 2 + 3' }, { e: 'x = *5', w: 'ลบ 5 ทั้งสองข้าง' }, { w: 'ตรวจ 12 − 2 = 10', n: 'เป็นจริง', ans: 1 }], { q: 'แก้สมการ 2(x + 1) − (x − 3) = 10', fin: 'ลบหน้าวงเล็บ: <b>เปลี่ยนเครื่องหมายทุกพจน์</b>ในวงเล็บ', say: 'ลบหน้าวงเล็บ เปลี่ยนเครื่องหมายทุกพจน์ในวงเล็บ' })),
      e1dTry(2613, ['w7', 'w9'], 'วงเล็บหลายคู่')]; },

  /* ด่าน 14 สมการที่มีเศษส่วน */
  2614: L => { const bar = (y, n, col) => `<rect x="40" y="${y}" width="240" height="30" fill="#fff" stroke="${E1C.ink}" stroke-width="1.6"/>` + Array.from({ length: n - 1 }, (_, i) => `<path d="M${40 + (i + 1) * 240 / n} ${y} V${y + 30}" stroke="${E1C.ink}" stroke-width="1.4"/>`).join('') + `<rect x="40" y="${y}" width="${240 / n}" height="30" fill="${col}" stroke="${E1C.ink}" stroke-width="1.6"/>`;
    return [
      e1dSee('กำจัดตัวส่วน', '<b>แตะรูป</b> — ครึ่งหนึ่งกับหนึ่งในสาม ตัดเป็น 6 ส่วนเท่ากันได้', [
        { t: 'x/2 + x/3', f: on => bar(50, 2, '#9FD0F0') + e1dTx(310, 70, '½', E1C.b, 'r4v-tx') + bar(100, 3, '#FFC24C') + e1dTx(310, 120, '⅓', E1C.o, 'r4v-tx') + (on ? r4vH(bar(150, 6, '#C9F0D9') + e1dTx(310, 170, '⅙', E1C.g, 'r4v-tx') + e1dTx(180, 220, '× 6 → 3x + 2x', E1C.g, 'r4v-big')) : ''), s: 'คูณด้วย ค.ร.น. ของตัวส่วน (6)<br>ตัวส่วน<b>หายหมด</b>' }]),
      e1dOld(L, /กำจัดตัวส่วน/),
      r4dShow('x/2 + x/3 = 10', e1dEq([{ e: '{x|2} + {x|3} = 10' }, { e: '{x|2} !×_ !6 + {x|3} !×_ !6 = 10 !× !6', w: 'คูณ 6 ทุกพจน์', n: 'ค.ร.น. ของ 2 กับ 3' }, { e: '!3x + !2x = 60', w: '3x + 2x = 60', n: 'ตัวส่วนหายแล้ว' }, { e: '5x = 60', w: 'รวมพจน์' },
        { e: 'x = *12', w: 'หาร 5 ทั้งสองข้าง' }, { w: 'ตรวจ 6 + 4 = 10', n: 'เป็นจริง', ans: 1 }], { q: `แก้สมการ ${fqHTML('x', 2)} + ${fqHTML('x', 3)} = 10`, fin: 'คูณ<b>ทุกพจน์</b>ด้วย ค.ร.น. ของตัวส่วน', say: 'คูณทุกพจน์ด้วย ค ร น ของตัวส่วน' })),
      e1dTry(2614, ['f7', 'f1', 'f2'], 'สมการเศษส่วน'),
      r4dShow('ตัวเศษมีหลายพจน์', e1dEq([{ e: '{x~+~1|2} + {x~−~1|3} = 6' }, { e: '!3(_ x + 1) + !2(_ x − 1) = 36', w: 'คูณ 6 ทั้งสองข้าง', n: 'ตัวเศษหลายพจน์ ใส่วงเล็บ' }, { e: '3x + 3 + 2x − 2 = 36', w: 'แจกแจง' }, { e: '5x + 1 = 36', w: 'รวมพจน์' },
        { e: 'x = *7', w: '5x = 35 → x = 7' }, { w: 'ตรวจ 4 + 2 = 6', n: 'เป็นจริง', ans: 1 }], { q: `แก้สมการ ${fqHTML('x + 1', 2)} + ${fqHTML('x − 1', 3)} = 6`, fin: 'ตัวเศษหลายพจน์ คิดเหมือน<b>มีวงเล็บครอบ</b>', say: 'ตัวเศษหลายพจน์ คิดเหมือนมีวงเล็บครอบ' })),
      e1dTry(2614, ['f4', 'f5', 'f9'], 'ตัวเศษหลายพจน์')]; },

  /* ด่าน 15 ทศนิยมและจำนวนลบ */
  2615: L => [
    e1dSee('ทศนิยม → จำนวนเต็ม', '<b>แตะรูป</b> — คูณ 10 ทุกพจน์', [
      { t: '0.5x + 1.2 = 3.7', f: on => e1dLine('0.5x + 1.2 = 3.7', 180, 80, 30).s + (on ? r4vH(e1dTx(180, 126, '× 10 ทุกพจน์', E1C.p, 'r4v-tx') + e1dLine('!5x + !12 = !37', 180, 180, 30).s) : ''), s: 'ทศนิยม 1 ตำแหน่ง คูณ 10<br>ได้<b>จำนวนเต็ม</b>ทุกพจน์' }]),
    r4dShow('0.5x + 1.2 = 3.7', e1dEq([{ e: '0.5x + 1.2 = 3.7' }, { e: '!5x + !12 = !37', w: 'คูณ 10 ทุกพจน์', n: 'ทศนิยมหายไป' }, { e: '5x = !25', w: 'ลบ 12 ทั้งสองข้าง' }, { e: 'x = *5', w: 'หาร 5 ทั้งสองข้าง' }, { w: 'ตรวจ 2.5 + 1.2 = 3.7', n: 'เป็นจริง', ans: 1 }],
      { q: 'แก้สมการ 0.5x + 1.2 = 3.7', fin: `ทศนิยม 1 ตำแหน่ง × 10${r4vSep}2 ตำแหน่ง × 100 — คูณ<b>ทุกพจน์</b>`.replace(' · ', r4vSep), say: 'ทศนิยมหนึ่งตำแหน่งคูณสิบ สองตำแหน่งคูณร้อย คูณทุกพจน์' })),
    e1dTry(2615, ['d1', 'd2', 'd3'], 'สมการทศนิยม'),
    r4dShow('−3x + 4 = 19', e1dEq([{ e: '−3x + 4 = 19' }, { e: '−3x = !15', w: 'ลบ 4 ทั้งสองข้าง' }, { e: '{−3x|!−3} = {15|!−3}', w: 'หาร −3 ทั้งสองข้าง', n: 'รวมเครื่องหมายลบ' }, { e: 'x = *−5', w: 'x = −5', n: 'บวก ÷ ลบ = ลบ' }, { w: 'ตรวจ 15 + 4 = 19', n: 'เป็นจริง', ans: 1 }],
      { q: 'แก้สมการ −3x + 4 = 19', fin: 'หารด้วยจำนวนลบ เครื่องหมายคำตอบเปลี่ยน — <b>ตรวจคำตอบทุกครั้ง</b>', say: 'หารด้วยจำนวนลบ เครื่องหมายคำตอบเปลี่ยน ตรวจคำตอบทุกครั้ง' })),
    e1dTry(2615, ['d4', 'd5', 'd6'], 'สมการจำนวนลบ')],

  /* ด่าน 16 แปลข้อความเป็นสมการ */
  2616: L => { const bx = (x, w, t, col, f) => `<rect x="${x}" y="80" width="${w}" height="40" rx="6" fill="${f}" stroke="${E1C.ink}" stroke-width="2"/>` + e1dTx(x + w / 2, 106, t, col, 'r4v-tx'), chips = [[18, 150, '4 เท่าของจำนวนหนึ่ง'], [178, 86, 'ลบด้วย 5'], [274, 70, 'ได้ 23']];
    return [
      e1dSee('คำสำคัญ', '<b>แตะรูป</b> — มากกว่า / น้อยกว่า … อยู่ 4', [
        { t: 'มากกว่า x อยู่ 4', f: on => bx(40, 180, 'x', E1C.x, '#EFE9FA') + (on ? r4vH(bx(220, 80, '4', E1C.o, '#FFE7A8') + e1dTx(180, 170, 'x + 4', E1C.g, 'r4v-big')) : e1dTx(180, 170, '?', E1C.fade, 'r4v-big')), s: 'มากกว่า x อยู่ 4<br>= <b>x + 4</b>' },
        { t: 'น้อยกว่า x อยู่ 4', f: on => bx(40, 260, 'x', E1C.x, '#EFE9FA') + (on ? r4vH(`<rect x="220" y="80" width="80" height="40" fill="#FFE4EE" stroke="${E1C.p}" stroke-width="2" stroke-dasharray="5 4"/>` + o4dCross(260, 100, 12) + e1dTx(180, 170, 'x − 4', E1C.g, 'r4v-big')) : e1dTx(180, 170, '?', E1C.fade, 'r4v-big')), s: 'น้อยกว่า x อยู่ 4<br>= <b>x − 4</b> (ไม่ใช่ 4 − x)' }]),
      e1dOld(L, /จับคู่ข้อความกับสมการ/),
      r4dShow('ข้อความ → สมการ', { fig: chips.map(([x, w, t]) => e1dChip(x, 60, w, t)).join(''), q: '4 เท่าของจำนวนหนึ่ง ลบด้วย 5 ได้ 23',
        steps: [{ w: 'ให้จำนวนนั้นเป็น x', n: 'กำหนดตัวแปร' }, { ink: e1dChip(18, 60, 150, '4 เท่าของจำนวนหนึ่ง', E1C.p, '#FFE4EE') + e1dTx(93, 140, '4x', E1C.p, 'r4d-big'), w: '4 เท่าของจำนวนหนึ่ง → 4x', n: 'กี่เท่า → คูณ' },
          { ink: e1dChip(178, 60, 86, 'ลบด้วย 5', E1C.b, '#E4F0FB') + e1dTx(221, 140, '− 5', E1C.b, 'r4d-big'), w: 'ลบด้วย 5 → − 5' }, { ink: e1dChip(274, 60, 70, 'ได้ 23', E1C.g, '#E2F6EA') + e1dTx(309, 140, '= 23', E1C.g, 'r4d-big'), w: 'ได้ 23 → = 23', n: 'ได้ / เท่ากับ → =' },
          { ink: e1dTx(180, 206, '4x − 5 = 23', E1C.ink, 'r4d-big'), w: 'สมการ 4x − 5 = 23', n: 'ต่อทุกส่วนเข้าด้วยกัน', ans: 1 }],
        dense: true, fin: 'กำหนดตัวแปร → <b>แปลทีละส่วน</b> → คำว่า "ได้" คือ =', say: 'กำหนดตัวแปร แปลทีละส่วน คำว่าได้คือเท่ากับ' }),
      e1dTry(2616, ['t1', 't3'], 'แปลเป็นสมการ'),
      e1dTry(2616, ['t4', 't5', 't7'], 'แปลข้อความยาว')]; },

  /* ด่าน 17 โจทย์จำนวน */
  2617: L => { const fig = `<rect x="40" y="70" width="150" height="34" rx="5" fill="#EFE9FA" stroke="${E1C.ink}" stroke-width="2"/><rect x="40" y="122" width="150" height="34" rx="5" fill="#EFE9FA" stroke="${E1C.ink}" stroke-width="2"/><rect x="190" y="122" width="50" height="34" rx="5" fill="#FFE7A8" stroke="${E1C.ink}" stroke-width="2"/>` + e1dTx(30, 92, 'น้อย', '#7A70A0', 'r4d-sm', 'end') + e1dTx(30, 144, 'มาก', '#7A70A0', 'r4d-sm', 'end');
    return [
      e1dSee('แผนภาพช่วยคิด', '<b>แตะรูป</b> — สองจำนวนรวมกัน 40 ต่างกัน 6', [
        { t: 'สองจำนวน', f: on => fig + (on ? r4vH(e1dTx(115, 93, 'x', E1C.x, 'r4v-big') + e1dTx(115, 145, 'x', E1C.x, 'r4v-big') + e1dTx(215, 145, '6', E1C.o, 'r4v-tx') + `<path d="M256 70 h8 V156 h-8" fill="none" stroke="${E1C.p}" stroke-width="2.4"/>` + e1dTx(300, 118, 'รวม 40', E1C.p, 'r4v-tx')) : ''), s: 'จำนวนน้อย = x<br>จำนวนมาก = <b>x + 6</b>' }]),
      e1dOld(L, /จำนวนเรียงกัน/),
      r4dShow('สองจำนวนรวมกัน 40', { fig, q: 'จำนวนสองจำนวนรวมกันได้ 40 จำนวนหนึ่งมากกว่าอีกจำนวน 6 จำนวนทั้งสองคือจำนวนใด',
        steps: [{ ink: e1dTx(115, 93, 'x', E1C.x, 'r4d-big'), w: 'ให้จำนวนน้อย = x', n: 'กำหนดตัวแปร' }, { ink: e1dTx(115, 145, 'x', E1C.x, 'r4d-big') + e1dTx(215, 145, '6', E1C.o, 'r4d-tx'), w: 'จำนวนมาก = x + 6', n: 'มากกว่า 6' },
          { ink: `<path d="M256 70 h8 V156 h-8" fill="none" stroke="${E1C.p}" stroke-width="2.4"/>` + e1dTx(300, 118, '40', E1C.p, 'r4d-big'), w: 'x + (x + 6) = 40', n: 'รวมกัน = 40' }, { w: '2x + 6 = 40 → 2x = 34', n: 'แก้สมการ' },
          { ink: e1dTx(180, 210, '17 กับ 23', E1C.g, 'r4d-big'), w: 'x = 17', n: 'จำนวนมาก 17 + 6 = 23' }, { w: 'ตอบ 17 และ 23', n: 'ตอบครบตามที่ถาม', ans: 1 }],
        dense: true, fin: 'ให้ตัวแปร → เขียนอีกจำนวนด้วย x → <b>สร้างสมการ</b> → แก้ และตอบให้ครบ', say: 'ให้ตัวแปร เขียนอีกจำนวนด้วยเอ็กซ์ สร้างสมการ แก้ และตอบให้ครบ' }),
      e1dTry(2617, ['u8', 'u7', 'u2'], 'โจทย์จำนวน'),
      e1dTry(2617, ['u1', 'u4'], 'สองจำนวน / จำนวนเรียงกัน')]; },

  /* ด่าน 18 อายุและเงิน */
  2618: L => { const book = x => `<rect x="${x}" y="70" width="40" height="54" rx="4" fill="#3C8DDB" stroke="${E1C.ink}" stroke-width="1.6"/><path d="M${x + 8} 70 V124" stroke="#fff" stroke-width="2"/>` + e1dTx(x + 20, 146, 'x', E1C.x, 'r4d-tx');
    const fig = [40, 92, 144].map(book).join('') + `<rect x="220" y="80" width="80" height="16" rx="8" fill="#F49AB5" stroke="${E1C.ink}" stroke-width="1.6"/>` + e1dTx(260, 124, '12 บาท', E1C.ink, 'r4d-sm');
    const tab = `<rect x="40" y="40" width="280" height="120" fill="#fff" stroke="#B9AFD6" stroke-width="1.4"/><path d="M40 76 H320 M40 118 H320 M140 40 V160 M230 40 V160" stroke="#B9AFD6" stroke-width="1.4"/>` + e1dTx(185, 64, 'ลูก', E1C.ink, 'g5d-h') + e1dTx(275, 64, 'พ่อ', E1C.ink, 'g5d-h') + e1dTx(90, 103, 'ตอนนี้', E1C.ink, 'g5d-s') + e1dTx(90, 145, 'อีก 5 ปี', E1C.ink, 'g5d-s') + e1dTx(185, 104, '10', E1C.ink, 'r4d-tx') + e1dTx(275, 104, 'x', E1C.x, 'r4d-tx');
    return [
      e1dSee('อายุผ่านไป', '<b>แตะรูป</b> — ผ่านไป 5 ปี', [
        { t: 'พ่อ 40 ลูก 10', f: on => { const N = e1dNL(0, 50, 120); return `<path d="M26 120 H334" stroke="${E1C.ink}" stroke-width="2.4"/>` + [0, 10, 20, 30, 40, 50].map(v => `<path d="M${N.X(v)} 113 V127" stroke="${E1C.ink}" stroke-width="1.8"/>` + e1dTx(N.X(v), 148, String(v), E1C.ink, 'r4d-sm')).join('') + N.dot(10, E1C.b) + N.dot(40, E1C.o) + e1dTx(N.X(10), 172, 'ลูก', E1C.b, 'r4d-sm') + e1dTx(N.X(40), 172, 'พ่อ', E1C.o, 'r4d-sm')
          + (on ? r4vH(N.hop(10, 15, E1C.b, '+5', 16) + N.hop(40, 45, E1C.o, '+5', 16) + e1dTx(180, 214, 'ห่างกัน 30 ปีเท่าเดิม', E1C.g, 'r4v-tx')) : ''); }, s: 'ผ่านไปกี่ปี ทุกคน<b>อายุเพิ่มเท่ากัน</b><br>ผลต่างอายุเท่าเดิม' }]),
      e1dOld(L, /เส้นเวลาของอายุ/),
      r4dShow('ซื้อสมุดกับปากกา', { fig, q: 'ซื้อสมุด 3 เล่ม เล่มละเท่ากัน กับปากกา 1 ด้ามราคา 12 บาท จ่ายทั้งหมด 57 บาท สมุดเล่มละกี่บาท',
        steps: [{ w: 'ให้สมุดเล่มละ x บาท', n: 'กำหนดตัวแปร' }, { ink: `<path d="M40 166 V174 H300 V166" fill="none" stroke="${E1C.p}" stroke-width="2.4"/>` + e1dTx(170, 198, '3x + 12 = 57', E1C.p, 'r4d-big'), w: '3x + 12 = 57', n: 'ราคารวม = 57' },
          { w: '3x = 45', n: 'ลบ 12 ทั้งสองข้าง' }, { w: 'x = 15', n: 'หาร 3 ทั้งสองข้าง' }, { w: 'ตอบ สมุดเล่มละ 15 บาท', n: 'ตรวจ 45 + 12 = 57', ans: 1 }],
        dense: true, fin: 'ราคารวม = <b>ราคาต่อชิ้น × จำนวน</b> + ของอื่น', say: 'ราคารวม เท่ากับราคาต่อชิ้นคูณจำนวน บวกของอื่น' }),
      e1dTry(2618, ['g5', 'g6', 'g7'], 'โจทย์เงิน'),
      r4dShow('อายุพ่อกับลูก', { fig: tab, q: 'ปัจจุบันลูกอายุ 10 ปี อีก 5 ปี พ่อจะอายุเป็น 3 เท่าของลูก ปัจจุบันพ่ออายุกี่ปี',
        steps: [{ ink: e1dTx(185, 146, '15', E1C.b, 'r4d-tx') + e1dTx(275, 146, 'x + 5', E1C.o, 'r4d-tx'), w: 'อีก 5 ปี: ลูก 15 พ่อ x + 5', n: 'ทุกคน +5' }, { ink: e1dTx(180, 202, 'x + 5 = 3 × 15', E1C.p, 'r4d-big'), w: 'x + 5 = 3 × 15', n: 'พ่อ = 3 เท่าของลูก' },
          { w: 'x + 5 = 45 → x = 40', n: 'แก้สมการ' }, { w: 'ตอบ พ่ออายุ 40 ปี', n: 'ตรวจ 45 = 3 × 15', ans: 1 }],
        dense: true, fin: 'ทำ<b>ตารางตอนนี้ / อีกกี่ปี</b> แล้วสร้างสมการจากแถวที่โจทย์บอก', say: 'ทำตารางตอนนี้กับอีกกี่ปี แล้วสร้างสมการจากแถวที่โจทย์บอก' }),
      e1dTry(2618, ['g1', 'g2', 'g3'], 'โจทย์อายุ')]; },

  /* ด่าน 19 การวัด */
  2619: L => { const R = `<rect x="70" y="60" width="220" height="110" fill="#E4F0FB" stroke="${E1C.ink}" stroke-width="2.4"/>`;
    return [
      e1dSee('ความยาวรอบรูป', '<b>แตะรูป</b> — กว้าง x ยาวมากกว่ากว้าง 4', [
        { t: 'สี่เหลี่ยมผืนผ้า', f: on => R + e1dTx(56, 120, 'x', E1C.x, 'r4v-big', 'end') + e1dTx(180, 196, 'x + 4', E1C.o, 'r4v-big') + (on ? r4vH(`<rect x="70" y="60" width="220" height="110" fill="none" stroke="${E1C.p}" stroke-width="4" stroke-dasharray="10 6"/>` + e1dTx(180, 40, 'รอบรูป = 2(x + x + 4)', E1C.p, 'r4v-tx')) : ''), s: 'รอบรูป = 2 × (กว้าง + ยาว)<br>= <b>2(x + x + 4)</b>' }]),
      e1dOld(L, /สี่เหลี่ยมผืนผ้า/),
      r4dShow('รอบรูป 40 เซนติเมตร', { fig: R, q: 'สี่เหลี่ยมผืนผ้ายาวมากกว่ากว้าง 4 ซม. ความยาวรอบรูป 40 ซม. กว้างกี่เซนติเมตร',
        steps: [{ ink: e1dTx(56, 120, 'x', E1C.x, 'r4d-big', 'end'), w: 'ให้กว้าง = x', n: 'กำหนดตัวแปร' }, { ink: e1dTx(180, 196, 'x + 4', E1C.o, 'r4d-big'), w: 'ยาว = x + 4', n: 'ยาวกว่า 4' },
          { ink: `<rect x="70" y="60" width="220" height="110" fill="none" stroke="${E1C.p}" stroke-width="4" stroke-dasharray="10 6"/>`, w: '2(x + x + 4) = 40', n: 'รอบรูป = 40' }, { w: '4x + 8 = 40 → 4x = 32', n: 'แก้สมการ' },
          { ink: e1dTx(180, 122, 'กว้าง 8 ยาว 12', E1C.g, 'r4d-big'), w: 'x = 8', n: 'ยาว 8 + 4 = 12' }, { w: 'ตอบ กว้าง 8 เซนติเมตร', n: 'ตรวจ 2(8 + 12) = 40', ans: 1 }],
        dense: true, fin: `วาดรูป ใส่ตัวแปรบนรูป แล้วใช้<b>สูตร</b>สร้างสมการ${r4vSep}คำตอบต้องเป็นบวก`.replace(' · ', r4vSep), say: 'วาดรูป ใส่ตัวแปรบนรูป แล้วใช้สูตรสร้างสมการ คำตอบต้องเป็นบวก' }),
      e1dTry(2619, ['y1', 'y2', 'y3'], 'โจทย์รูปเรขาคณิต'),
      e1dTry(2619, ['y5', 'y8', 'y11'], 'โจทย์สถานการณ์')]; },

  /* ด่าน 20 รวมโจทย์ */
  2620: L => { const C = [[180, 56], [296, 128], [180, 200], [64, 128]], lab = ['① ถามอะไร', '② ให้ตัวแปร', '③ สร้างสมการ', '④ แก้ + ตรวจ'], col = [E1C.p, E1C.b, E1C.o, E1C.g];
    const hen = x => `<circle cx="${x}" cy="94" r="12" fill="#FFF3D6" stroke="${E1C.ink}" stroke-width="1.6"/><path d="M${x - 5} 106 v10 M${x + 5} 106 v10" stroke="${E1C.ink}" stroke-width="2"/>`, cow = x => `<rect x="${x - 16}" y="84" width="32" height="20" rx="6" fill="#F4E1C1" stroke="${E1C.ink}" stroke-width="1.6"/><path d="M${x - 12} 104 v12 M${x - 4} 104 v12 M${x + 4} 104 v12 M${x + 12} 104 v12" stroke="${E1C.ink}" stroke-width="2"/>`;
    const fig = [40, 72, 104].map(hen).join('') + [220, 262, 304].map(cow).join('') + e1dTx(72, 146, 'ไก่ 2 ขา', E1C.ink, 'r4d-sm') + e1dTx(262, 146, 'วัว 4 ขา', E1C.ink, 'r4d-sm') + e1dTx(180, 44, 'หัวรวม 20 ขารวม 56', E1C.ink, 'r4d-tx');
    return [
      e1dSee('4 ขั้นของโจทย์ปัญหา', '<b>แตะรูป</b> — ทำวนครบทุกขั้น', [
        { t: 'ขั้นตอน', f: on => on ? r4vH(C.map((p, i) => `<rect x="${p[0] - 58}" y="${p[1] - 22}" width="116" height="40" rx="12" fill="#fff" stroke="${col[i]}" stroke-width="2.4"/>` + e1dTx(p[0], p[1] + 5, lab[i], col[i], 'r4v-tx')).join('')) : C.map(p => `<rect x="${p[0] - 58}" y="${p[1] - 22}" width="116" height="40" rx="12" fill="#fff" stroke="${E1C.fade}" stroke-width="2"/>` + e1dTx(p[0], p[1] + 5, '?', E1C.fade, 'r4v-tx')).join(''), s: 'ถามอะไร → ให้ตัวแปร<br>→ สร้างสมการ → <b>แก้และตรวจ</b>' }]),
      r4dShow('ไก่กับวัว', { fig, q: 'ฟาร์มมีไก่กับวัวรวม 20 ตัว นับขาได้ 56 ขา มีไก่กี่ตัว',
        steps: [{ w: 'ให้ไก่ x ตัว วัว 20 − x ตัว', n: '② ให้ตัวแปร (หัวรวม 20)' }, { ink: e1dTx(180, 186, '2x + 4(20 − x) = 56', E1C.p, 'r4d-big'), w: '2x + 4(20 − x) = 56', n: '③ ขารวม 56' },
          { w: '2x + 80 − 4x = 56', n: 'แจกแจง' }, { w: '−2x = −24 → x = 12', n: '④ แก้สมการ' }, { ink: e1dTx(180, 224, 'ไก่ 12 วัว 8', E1C.g, 'r4d-big'), w: 'ตอบ ไก่ 12 ตัว', n: 'ตรวจ 24 + 32 = 56', ans: 1 }],
        dense: true, fin: '① ถามอะไร ② ให้ตัวแปร ③ สร้างสมการ ④ <b>แก้และตรวจ</b>', say: 'ถามอะไร ให้ตัวแปร สร้างสมการ แก้และตรวจ' }),
      e1dTry(2620, ['z1', 'z2', 'z3'], 'แก้สมการ'),
      e1dTry(2620, ['z5', 'z11', 'z6'], 'โจทย์ปัญหา')]; }
};
/* ด่าน 18: เพิ่มโจทย์ใหม่ 2 ข้อ (อายุรวม / ซื้อของ) */
{ const L = LESSONS_M1C6.find(x => x.id === 2618), g0 = L && L.game; if (g0) L.game = () => [...g0(),
  Q.rpNum({ story: 'แม่อายุมากกว่าลูก 26 ปี อายุของแม่กับลูกรวมกัน 50 ปี', q: 'ลูกอายุกี่ปี', a: 12, unit: 'ปี', hint: 'ให้ลูกอายุ x ปี: x + (x + 26) = 50', sig: 'g11', diff: 6 }),
  Q.rpNum({ story: 'ซื้อดินสอ 5 แท่ง แท่งละเท่ากัน กับยางลบ 1 ก้อนราคา 8 บาท จ่ายทั้งหมด 43 บาท', q: 'ดินสอแท่งละกี่บาท', a: 7, unit: 'บาท', hint: '5x + 8 = 43', sig: 'g12', diff: 5 })]; }
LESSONS_M1C6.forEach(L => { const f = E1D_TEACH[L.id]; if (f) { L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true; } });
