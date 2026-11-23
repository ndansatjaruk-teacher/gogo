/* =========================================================
   ม.3 บทที่ 6 สถิติ (3) — ควอร์ไทล์ · แผนภาพกล่อง (v228) — prefix m3
   วิธีหาควอร์ไทล์ตามหนังสือเรียน (แบบ inclusive): เรียงข้อมูล → Q2 = มัธยฐาน → ถ้าจำนวนข้อมูลเป็นคี่ ให้รวมมัธยฐานไว้ทั้งสองครึ่ง
   → Q1 = มัธยฐานของครึ่งแรก · Q3 = มัธยฐานของครึ่งหลัง · แผนภาพกล่องใช้ ค่าต่ำสุด Q1 Q2 Q3 ค่าสูงสุด (ไม่มีค่านอกเกณฑ์)
   ข้อมูลทั้งหมดเป็นข้อมูลสมมติ · ด่าน 3001–3006 + บอส 3019 (ผึ้งราชินี)
   ========================================================= */
const m3Sort = a => [...a].sort((x, y) => x - y);
const m3Med = a => { const n = a.length, m = n >> 1; return n % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
const m3Half = n => n % 2 ? (n + 1) / 2 : n / 2;
const m3Five = arr => { const a = m3Sort(arr), n = a.length, h = m3Half(n); return { a, n, min: a[0], max: a[n - 1], q1: m3Med(a.slice(0, h)), q2: m3Med(a), q3: m3Med(a.slice(n - h)) }; };
const m3N = x => (Math.round(x * 100) / 100).toLocaleString('en-US');
const m3R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const m3Pick = a => a[Math.floor(Math.random() * a.length)];
const M3K = { min: 'ค่าต่ำสุด', q1: 'Q₁', q2: 'Q₂ (มัธยฐาน)', q3: 'Q₃', max: 'ค่าสูงสุด' }, M3KS = { min: 'ค่าต่ำสุด', q1: 'Q₁', q2: 'Q₂', q3: 'Q₃', max: 'ค่าสูงสุด' };
const M3COL = ['#F7B733', '#E36A8C', '#7C5CE0', '#3D9BE9'];
/* random data with n values in [lo, hi] (integers) */
const m3Data = (n, lo, hi) => Array.from({ length: n }, () => m3R(lo, hi));
/* data with a chosen five-number shape (for comparison questions) */
const m3Shape = (min, q1, q2, q3, max, n = 12) => { const per = n / 4, a = []; [[min, q1], [q1, q2], [q2, q3], [q3, max]].forEach(([x, y], k) => { for (let i = 0; i < per; i++) a.push(Math.round(x + (y - x) * (i + (k === 0 ? 0 : 1)) / per)); }); return a; };

/* ---------- figures ---------- */
function m3BoxSVG(rows, o = {}) {
  const W = o.W || 640, named = rows.some(r => r.name), pad = named ? 112 : 44, rowH = o.rowH || 74, top = 26, H = top + rows.length * rowH + 40, lo = o.lo, hi = o.hi, step = o.step || 5, X = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad), yAx = H - 34;
  let s = `<path d="M${pad - 10} ${yAx} H${W - pad + 10}" stroke="#2B2550" stroke-width="2"/>`;
  for (let v = lo; v <= hi + 1e-9; v += step) s += `<path d="M${X(v)} ${yAx - 5} V${yAx + 5}" stroke="#2B2550" stroke-width="1.6"/><text x="${X(v)}" y="${yAx + 22}" text-anchor="middle" class="m3-ax">${m3N(v)}</text>`;
  rows.forEach((r, i) => { const F = r.F, y = top + i * rowH + rowH / 2 - 6, c = r.col || M3COL[i % 4], hh = 30;
    if (r.name) s += `<text x="6" y="${y + 6}" class="m3-nm">${r.name}</text>`;
    s += `<path d="M${X(F.min)} ${y} H${X(F.q1)} M${X(F.q3)} ${y} H${X(F.max)}" stroke="#2B2550" stroke-width="2.4"/><path d="M${X(F.min)} ${y - 10} V${y + 10} M${X(F.max)} ${y - 10} V${y + 10}" stroke="#2B2550" stroke-width="2.4"/>`;
    s += `<rect x="${X(F.q1)}" y="${y - hh / 2}" width="${Math.max(1, X(F.q3) - X(F.q1))}" height="${hh}" rx="3" fill="${c}" fill-opacity=".35" stroke="#2B2550" stroke-width="2.4"/><path d="M${X(F.q2)} ${y - hh / 2} V${y + hh / 2}" stroke="#2B2550" stroke-width="3"/>`;
    if (o.labels) ['min', 'q1', 'q2', 'q3', 'max'].forEach((k, j) => { const t = o.labels === 'val' ? m3N(F[k]) : o.labels === 'ask' ? (k === o.ask ? '?' : '') : M3KS[k]; if (!t) return; const up = j % 2 === 0; s += `<text x="${X(F[k])}" y="${up ? y - hh / 2 - 7 : y + hh / 2 + 17}" text-anchor="middle" class="m3-lb${k === o.ask ? ' ask' : ''}">${t}</text>`; }); });
  return `<svg class="m3-box" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
function m3DotSVG(a, o = {}) {
  const W = o.W || 640, pad = 44, lo = o.lo, hi = o.hi, X = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad), cnt = {}, r = o.r || 7;
  const maxStack = Math.max(...a.map(v => a.filter(x => x === v).length)), H = 40 + maxStack * (2 * r + 2) + 30, yAx = H - 30;
  let s = `<path d="M${pad - 10} ${yAx} H${W - pad + 10}" stroke="#2B2550" stroke-width="2"/>`;
  for (let v = lo; v <= hi; v += o.step || 5) s += `<path d="M${X(v)} ${yAx - 4} V${yAx + 4}" stroke="#2B2550" stroke-width="1.4"/><text x="${X(v)}" y="${yAx + 20}" text-anchor="middle" class="m3-ax">${v}</text>`;
  m3Sort(a).forEach((v, i) => { cnt[v] = (cnt[v] || 0) + 1; const col = o.colOf ? o.colOf(v, i) : '#7C5CE0'; s += `<circle cx="${X(v)}" cy="${yAx - 4 - r - (cnt[v] - 1) * (2 * r + 2)}" r="${r}" fill="${col}" stroke="#fff" stroke-width="1.5"/>`; });
  return `<svg class="m3-dot" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
const m3Tiles = (a, cls = '') => `<div class="m3-tiles ${cls}">${a.map(v => `<span class="m3-t">${m3N(v)}</span>`).join('')}</div>`;
const m3Axis = F => { const span = F.max - F.min, step = span > 60 ? 10 : span > 24 ? 5 : span > 10 ? 2 : 1, lo = Math.floor(F.min / step) * step - (F.min % step === 0 ? step : 0), hi = Math.ceil(F.max / step) * step + (F.max % step === 0 ? step : 0); return { lo: Math.max(0, lo), hi, step }; };
const m3AxisAll = Fs => m3Axis({ min: Math.min(...Fs.map(f => f.min)), max: Math.max(...Fs.map(f => f.max)) });

/* ---------- sims ---------- */
/* เรียงข้อมูล: แตะค่าที่น้อยที่สุดที่ยังเหลือ */
function m3SortSim(items, unit = '') {
  const left = h('div', { class: 'm3-pool' }), row = h('div', { class: 'm3-sorted' }), out = fNote(), wrap = h('div', { class: 'colstack no-side' }, h6wait()); let k = 0; const order = m3Sort(items.map(x => x[1]));
  shuffle(items).forEach(([nm, v]) => { const b = h('button', { class: 'm3-card ia', html: `<small>${nm}</small><b>${v}</b>` }); b.onclick = e => { e.stopPropagation(); if (b.classList.contains('used')) return;
    if (v !== order[k]) { sfx.no(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); out.innerHTML = `ยังไม่ใช่ — หาค่าที่<b>น้อยที่สุด</b>ที่ยังเหลือ`; return; }
    k++; b.classList.add('used'); row.append(h('span', { class: 'm3-t in', html: `${v}` })); sfx.pop(k); out.innerHTML = `เรียงแล้ว ${k} จาก ${order.length} ค่า`;
    if (k === order.length) { out.innerHTML = `เรียงจากน้อยไปมากครบแล้ว ✓ — ต่อไปจะแบ่งข้อมูลที่เรียงแล้วออกเป็น <b>4 ส่วนเท่า ๆ กัน</b>`; sfx.ok(); teachDone(wrap); } }; left.append(b); });
  wrap.append(h('div', { class: 'cap' }, `แตะ${unit}ที่มีค่าน้อยที่สุดที่ยังเหลือทีละใบ`), left, h('div', { class: 'cap' }, 'ข้อมูลที่เรียงแล้ว'), row, out); return wrap;
}
/* หาควอร์ไทล์ด้วยการแตะ: Q2 → Q1 (ครึ่งแรก) → Q3 (ครึ่งหลัง) · ตัวกลางมี 2 ตัวให้แตะทั้งสอง */
function m3QuartTap(data, o = {}) {
  const F = m3Five(data), a = F.a, n = a.length, h0 = m3Half(n), wrap = h('div', { class: 'colstack no-side m3-qt' }, o.game ? '' : h6wait()), tiles = h('div', { class: 'm3-tiles big' }), msg = h('div', { class: 'cap m3-qmsg' }), res = h('div', { class: 'm3-qres' }), out = fNote();
  const els = a.map((v, i) => { const t = h('button', { class: 'm3-t ia', html: `${v}<i>${i + 1}</i>` }); t.onclick = e => { e.stopPropagation(); tap(i, t); }; tiles.append(t); return t; });
  const mid = (lo, hi) => { const m = hi - lo; return m % 2 ? [lo + (m - 1) / 2] : [lo + m / 2 - 1, lo + m / 2]; };
  const stages = [{ key: 'q2', lo: 0, hi: n, name: 'Q₂ (มัธยฐาน)', say: `ข้อมูล ${n} ตัว — แตะตัวที่อยู่<b>ตรงกลาง</b>ของข้อมูลทั้งหมด${n % 2 ? '' : ' (มี 2 ตัว แตะทั้งคู่)'}` },
    { key: 'q1', lo: 0, hi: h0, name: 'Q₁', say: `ครึ่งแรกมี ${h0} ตัว${n % 2 ? ' (รวมมัธยฐานด้วย เพราะข้อมูลเป็นจำนวนคี่)' : ''} — แตะตัวกลางของ<b>ครึ่งแรก</b>${h0 % 2 ? '' : ' (2 ตัว)'}` },
    { key: 'q3', lo: n - h0, hi: n, name: 'Q₃', say: `ครึ่งหลังมี ${h0} ตัว — แตะตัวกลางของ<b>ครึ่งหลัง</b>${h0 % 2 ? '' : ' (2 ตัว)'}` }];
  let st = 0, got = []; const show = () => { const S = stages[st]; els.forEach((t, i) => t.classList.toggle('dim', i < S.lo || i >= S.hi)); msg.innerHTML = S.say; };
  const tap = (i, t) => { if (st >= stages.length) return; const S = stages[st], want = mid(S.lo, S.hi);
    if (!want.includes(i)) { if (i < S.lo || i >= S.hi) { msg.innerHTML = `ตัวนี้อยู่นอกช่วงที่กำลังหา — ${S.say}`; } sfx.no(); t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); o.onWrong && o.onWrong(); return; }
    if (got.includes(i)) return; got.push(i); t.classList.add('pick', S.key); sfx.pop(got.length + st * 2);
    if (got.length < want.length) { msg.innerHTML = `ถูกแล้ว — แตะอีกตัวที่อยู่ตรงกลางด้วย`; return; }
    const v = F[S.key]; res.append(h('div', { class: 'm3-qr ' + S.key, html: `<b>${S.name}</b> = ${want.length > 1 ? `(${a[want[0]]} + ${a[want[1]]}) ÷ 2 = ` : ''}<b>${m3N(v)}</b>` })); got = []; st++;
    if (st < stages.length) return show(); els.forEach(t => t.classList.remove('dim')); msg.innerHTML = 'หาครบทั้งสามค่าแล้ว ✓'; out.innerHTML = `Q₁ = <b>${m3N(F.q1)}</b>&emsp;Q₂ = <b>${m3N(F.q2)}</b>&emsp;Q₃ = <b>${m3N(F.q3)}</b>`; sfx.ok(); o.onDone ? o.onDone() : teachDone(wrap); };
  show(); wrap.append(h('div', { class: 'cap' }, o.cap || 'ข้อมูลเรียงจากน้อยไปมากแล้ว (ตัวเลขเล็กมุมขวาคือลำดับที่)'), tiles, msg, res, out);
  wrap.reveal = () => { while (st < stages.length) { const S = stages[st]; mid(S.lo, S.hi).forEach(i => els[i].classList.add('pick', S.key)); res.append(h('div', { class: 'm3-qr ' + S.key, html: `<b>${S.name}</b> = <b>${m3N(F[S.key])}</b>` })); st++; } els.forEach(t => t.classList.remove('dim')); };
  return wrap;
}
/* ส่วนประกอบของแผนภาพกล่อง: แตะทั้ง 5 ค่า */
function m3BoxParts(data) {
  const F = m3Five(data), ax = m3Axis(F), wrap = h('div', { class: 'colstack no-side' }, h6wait()), fig = h('div', { class: 'm3-figbox big', html: m3BoxSVG([{ F }], { ...ax }) }), out = fNote(), seen = new Set();
  const row = h('div', { class: 'rowstack m3-parts' }, ...['min', 'q1', 'q2', 'q3', 'max'].map(k => h('button', { class: 'btn ia m3-part', onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(k); fig.innerHTML = m3BoxSVG([{ F }], { ...ax, labels: 'val' });
    const txt = { min: 'ปลายเส้นด้านซ้าย = ค่าต่ำสุด', q1: 'ขอบซ้ายของกล่อง = Q₁', q2: 'เส้นในกล่อง = Q₂ (มัธยฐาน)', q3: 'ขอบขวาของกล่อง = Q₃', max: 'ปลายเส้นด้านขวา = ค่าสูงสุด' }[k];
    out.innerHTML = `${txt} = <b>${m3N(F[k])}</b>`; sfx.pop(seen.size + 1); if (seen.size === 5) { out.innerHTML += '<br>แผนภาพกล่องใช้ <b>5 ค่า</b>: ค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด'; teachDone(wrap); } } }, M3KS[k])));
  wrap.append(h('div', { class: 'cap', html: `ข้อมูล: ${F.a.join(', ')}` }), fig, row, out); return wrap;
}
/* สร้างแผนภาพกล่องเอง: ลากจุดทั้ง 5 ไปวางให้ตรงค่า */
function m3BoxBuild(data, o = {}) {
  const F = m3Five(data), ax = m3Axis(F), W = 640, pad = 44, X = v => pad + (v - ax.lo) / (ax.hi - ax.lo) * (W - 2 * pad), V = x => ax.lo + (x - pad) / (W - 2 * pad) * (ax.hi - ax.lo), y = 70, NS = 'http://www.w3.org/2000/svg';
  const keys = ['min', 'q1', 'q2', 'q3', 'max'], cur = { min: ax.lo + (ax.hi - ax.lo) * .1, q1: ax.lo + (ax.hi - ax.lo) * .3, q2: ax.lo + (ax.hi - ax.lo) * .5, q3: ax.lo + (ax.hi - ax.lo) * .7, max: ax.lo + (ax.hi - ax.lo) * .9 };
  Object.keys(cur).forEach(k => cur[k] = Math.round(cur[k] * 2) / 2);
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} 150`); svg.setAttribute('class', 'm3-build ia'); let drag = null, done = false;
  const wrap = h('div', { class: 'colstack no-side m3-bb rvl' }, o.game ? '' : h6wait()), out = fNote(), chk = h('button', { class: 'btn primary ia' }, icon('check'), h('span', null, 'ตรวจแผนภาพกล่อง'));
  const draw = () => { const v = keys.map(k => cur[k]); let s = `<path d="M${pad - 10} 120 H${W - pad + 10}" stroke="#2B2550" stroke-width="2"/>`;
    for (let t = ax.lo; t <= ax.hi + 1e-9; t += ax.step) s += `<path d="M${X(t)} 115 V125" stroke="#2B2550" stroke-width="1.5"/><text x="${X(t)}" y="142" text-anchor="middle" class="m3-ax">${m3N(t)}</text>`;
    const sv = [...v].sort((a, b) => a - b); s += `<path d="M${X(sv[0])} ${y} H${X(sv[1])} M${X(sv[3])} ${y} H${X(sv[4])}" stroke="#2B2550" stroke-width="2.4"/><rect x="${X(sv[1])}" y="${y - 16}" width="${Math.max(1, X(sv[3]) - X(sv[1]))}" height="32" rx="3" fill="#F7B733" fill-opacity=".35" stroke="#2B2550" stroke-width="2.4"/><path d="M${X(sv[2])} ${y - 16} V${y + 16}" stroke="#2B2550" stroke-width="3"/>`;
    keys.forEach((k, i) => { const x = X(cur[k]), up = i % 2 === 0; s += `<g class="m3-h"><circle cx="${x}" cy="${y}" r="11" fill="${done ? '#4FB97A' : '#7C5CE0'}" stroke="#fff" stroke-width="2.5"/><text x="${x}" y="${up ? y - 26 : y + 38}" text-anchor="middle" class="m3-lb">${M3KS[k]} ${m3N(cur[k])}</text></g>`; });
    svg.innerHTML = s; };
  const pt = e => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()); };
  svg.addEventListener('pointerdown', e => { if (done) return; e.preventDefault(); e.stopPropagation(); const p = pt(e); let best = null, bd = 28; keys.forEach(k => { const d = Math.abs(X(cur[k]) - p.x) + Math.abs(y - p.y) * .3; if (d < bd) { bd = d; best = k; } }); if (!best) return; drag = best; try { svg.setPointerCapture(e.pointerId); } catch (_) { } });
  svg.addEventListener('pointermove', e => { if (!drag) return; const p = pt(e); cur[drag] = Math.max(ax.lo, Math.min(ax.hi, Math.round(V(p.x) * 2) / 2)); draw(); });
  svg.addEventListener('pointerup', () => { if (drag) sfx.tap(); drag = null; }); svg.addEventListener('click', e => e.stopPropagation());
  chk.onclick = e => { e.stopPropagation(); if (done) return; const bad = keys.filter(k => Math.abs(cur[k] - F[k]) > .01);
    if (!bad.length) { done = true; draw(); chk.remove(); out.innerHTML = `ถูกต้อง! ค่าต่ำสุด ${m3N(F.min)}&emsp;Q₁ ${m3N(F.q1)}&emsp;Q₂ ${m3N(F.q2)}&emsp;Q₃ ${m3N(F.q3)}&emsp;ค่าสูงสุด ${m3N(F.max)}`; sfx.ok(); o.onOK ? o.onOK() : teachDone(wrap); return; }
    sfx.no(); out.innerHTML = `ยังไม่ตรง: <b>${bad.map(k => M3KS[k]).join(', ')}</b> — หาค่านั้นจากข้อมูลอีกครั้ง`; o.onWrong && o.onWrong(); };
  wrap.reveal = () => { keys.forEach(k => cur[k] = F[k]); done = true; draw(); chk.remove(); };
  draw(); wrap.append(h('div', { class: 'cap', html: o.cap || `ลากจุดสีม่วงทั้ง 5 จุดไปวางให้ตรงค่า (หาค่าจากข้อมูลก่อน)` }), o.show === false ? '' : h('div', { class: 'm3-datab', html: m3Tiles(F.a, 'sm') }), svg, chk, out); return wrap;
}
/* ข้อมูลแต่ละส่วนของแผนภาพกล่องมีประมาณ 25% — แตะแต่ละส่วนดูว่าจุดข้อมูลอยู่ใกล้กันหรือห่างกัน */
function m3QuarterSim(data) {
  const F = m3Five(data), ax = m3Axis(F), wrap = h('div', { class: 'colstack no-side' }, h6wait()), dots = h('div', { class: 'm3-figbox big' }), box = h('div', { class: 'm3-figbox big' }), out = fNote(), seen = new Set();
  const parts = [['ส่วนที่ 1', F.min, F.q1], ['ส่วนที่ 2', F.q1, F.q2], ['ส่วนที่ 3', F.q2, F.q3], ['ส่วนที่ 4', F.q3, F.max]];
  const paint = k => { dots.innerHTML = m3DotSVG(F.a, { ...ax, colOf: v => k == null ? '#B9B2D6' : (v >= parts[k][1] && v <= parts[k][2]) ? M3COL[k] : '#D9D4EA' }); };
  box.innerHTML = m3BoxSVG([{ F }], { ...ax, labels: 'abc' }); paint(null);
  const row = h('div', { class: 'rowstack m3-parts' }, ...parts.map(([nm, a, b], k) => h('button', { class: 'btn ia m3-part', style: { '--pc': M3COL[k] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(k); paint(k); sfx.pop(k + 2);
    out.innerHTML = `${nm}: จาก ${m3N(a)} ถึง ${m3N(b)} ยาว <b>${m3N(b - a)}</b> — มีข้อมูลประมาณ <b>25%</b> (ประมาณ ${m3N(F.n / 4)} ตัว)`;
    if (seen.size === 4) { const L = parts.map(p => p[2] - p[1]), sh = L.indexOf(Math.min(...L)), lg = L.indexOf(Math.max(...L)); out.innerHTML += `<br>${parts[sh][0]}สั้นที่สุด → ข้อมูล<b>อยู่ใกล้กัน</b>มากที่สุด<br>${parts[lg][0]}ยาวที่สุด → ข้อมูล<b>กระจาย</b>มากที่สุด`; teachDone(wrap); } } }, nm)));
  wrap.append(box, dots, row, out); return wrap;
}
/* โปรแกรมสร้างแผนภาพกล่อง (จำลอง): ลากจุดข้อมูลบนแผนภาพจุด แล้วตาราง 5 ค่ากับแผนภาพกล่องคำนวณใหม่ทันที */
function m3TechSim(data, lo, hi) {
  const a = data.slice(), W = 640, pad = 44, X = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad), V = x => lo + (x - pad) / (W - 2 * pad) * (hi - lo), NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} 250`); svg.setAttribute('class', 'm3-tech ia');
  const tbl = h('div', { class: 'm3-out' }), wrap = h('div', { class: 'colstack no-side' }, h6wait()), out = fNote(); let drag = -1, moves = 0, last = '';
  const draw = () => { const F = m3Five(a), cnt = {}; let s = `<rect x="0" y="0" width="${W}" height="250" fill="#fff"/><path d="M${pad - 10} 140 H${W - pad + 10}" stroke="#2B2550" stroke-width="2"/>`;
    for (let t = lo; t <= hi; t += 10) s += `<path d="M${X(t)} 136 V144" stroke="#2B2550" stroke-width="1.4"/><text x="${X(t)}" y="160" text-anchor="middle" class="m3-ax">${t}</text>`;
    a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]).forEach(([v, i]) => { cnt[v] = (cnt[v] || 0) + 1; s += `<circle data-i="${i}" cx="${X(v)}" cy="${128 - (cnt[v] - 1) * 14}" r="6.5" fill="${i === drag ? '#E36A8C' : '#7C5CE0'}" stroke="#fff" stroke-width="1.4"/>`; });
    const y = 205; s += `<path d="M${X(F.min)} ${y} H${X(F.q1)} M${X(F.q3)} ${y} H${X(F.max)} M${X(F.min)} ${y - 9} V${y + 9} M${X(F.max)} ${y - 9} V${y + 9}" stroke="#2B2550" stroke-width="2.4"/><rect x="${X(F.q1)}" y="${y - 15}" width="${Math.max(1, X(F.q3) - X(F.q1))}" height="30" rx="3" fill="#F7B733" fill-opacity=".4" stroke="#2B2550" stroke-width="2.4"/><path d="M${X(F.q2)} ${y - 15} V${y + 15}" stroke="#2B2550" stroke-width="3"/>`;
    svg.innerHTML = s; tbl.innerHTML = `<table><tr><th>n</th><th>ค่าต่ำสุด</th><th>Q₁</th><th>มัธยฐาน</th><th>Q₃</th><th>ค่าสูงสุด</th></tr><tr><td>${F.n}</td><td>${m3N(F.min)}</td><td>${m3N(F.q1)}</td><td>${m3N(F.q2)}</td><td>${m3N(F.q3)}</td><td>${m3N(F.max)}</td></tr></table>`; };
  const pt = e => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()); };
  svg.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); const p = pt(e); const c = e.target.closest && e.target.closest('circle[data-i]'); let i = c ? +c.dataset.i : -1;
    if (i < 0) { let bd = 18; a.forEach((v, k) => { const d = Math.abs(X(v) - p.x); if (d < bd && p.y < 150) { bd = d; i = k; } }); } if (i < 0) return; drag = i; try { svg.setPointerCapture(e.pointerId); } catch (_) { } draw(); });
  svg.addEventListener('pointermove', e => { if (drag < 0) return; const p = pt(e); a[drag] = Math.max(lo, Math.min(hi, Math.round(V(p.x)))); draw(); });
  svg.addEventListener('pointerup', () => { if (drag < 0) return; drag = -1; draw(); const F = m3Five(a), k = [F.min, F.q1, F.q2, F.q3, F.max].join(); if (k !== last) { last = k; moves++; sfx.pop(moves + 1); }
    out.innerHTML = moves >= 3 ? 'เห็นไหม — โปรแกรมคำนวณ 5 ค่าและวาดแผนภาพกล่องใหม่ทันทีที่ข้อมูลเปลี่ยน ✓ (ลองลากค่าสูงสุดไปไกล ๆ มัธยฐานแทบไม่เปลี่ยน)' : `ลากต่ออีก ${3 - moves} ครั้ง`; if (moves >= 3) teachDone(wrap); });
  svg.addEventListener('click', e => e.stopPropagation()); draw();
  wrap.append(h('div', { class: 'cap' }, 'ลากจุดข้อมูล (สีม่วง) ไปทางซ้าย-ขวา แล้วดูตารางและแผนภาพกล่องเปลี่ยนตาม'), svg, tbl, out); return wrap;
}

/* =========================================================
   ข้อในเกม
   ========================================================= */
const m3Fig = html => h('div', { class: 'm3-figbox', html });
/* หา Q1/Q2/Q3 จากข้อมูล (แป้นตัวเลข) */
Q.m3Q = ({ data, k, sorted, ctx: tx }) => { const F = m3Five(data), show = sorted ? F.a : data, nm = { q1: 'ควอร์ไทล์ที่ 1 (Q₁)', q2: 'ควอร์ไทล์ที่ 2 (Q₂)', q3: 'ควอร์ไทล์ที่ 3 (Q₃)' }[k];
  const q = `${tx ? tx + ' ' : ''}จากข้อมูล${sorted ? ' (เรียงแล้ว)' : ''} จงหา<b>${nm}</b>`;
  return { prompt: q, say: q.replace(/<[^>]+>/g, '').replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3'), __sig: `m3q ${k} ${data.join(',')}`, __base: 'm3q-' + k, __baseCap: 2, __diff: 20 + data.length * 2 + (sorted ? 0 : 8),
    mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'm3-data', html: m3Tiles(show) + `<small>n = ${F.n}</small>` }), miAns(ctx, F[k], { hint: k === 'q2' ? 'เรียงข้อมูล แล้วหาตัวที่อยู่ตรงกลาง (มี 2 ตัวให้หาค่าเฉลี่ย)' : `หามัธยฐาน (Q₂) ก่อน แล้วหาตัวกลางของครึ่ง${k === 'q1' ? 'แรก' : 'หลัง'}${F.n % 2 ? ' (ข้อมูลเป็นจำนวนคี่ ให้รวมมัธยฐานไว้ในครึ่งนั้นด้วย)' : ''}` }))); } }; };
/* แตะหาควอร์ไทล์ทั้งสาม (ในเกม) */
Q.m3Tap = data => ({ prompt: 'แตะหา Q₂ Q₁ และ Q₃ ตามลำดับ', say: 'แตะหาควอร์ไทล์ที่สอง ที่หนึ่ง และที่สาม ตามลำดับ', __sig: 'm3tap ' + data.join(','), __base: 'm3tap', __baseCap: 1, __diff: 30,
  mount(bd, ctx) { let bad = 0; const w = m3QuartTap(data, { game: true, onDone: () => setTimeout(() => ctx.check(true), 700), onWrong: () => { if (++bad % 2 === 0) ctx.check(false, 'หาตัวกลางของช่วงที่ไม่จาง (ถ้าตัวกลางมี 2 ตัว แตะทั้งคู่)'); } }); w.classList.add('rvl'); bd.append(w); } });
/* อ่านค่าจากแผนภาพกล่อง */
Q.m3Read = ({ F, ask, ctx: tx }) => { const ax = [F.min, F.q1, F.q2, F.q3, F.max].every(v => v % 5 === 0) ? { lo: F.min - 5, hi: F.max + 5, step: 5 } : m3Axis(F), nm = { min: 'ค่าต่ำสุด', q1: 'Q₁', q2: 'มัธยฐาน (Q₂)', q3: 'Q₃', max: 'ค่าสูงสุด', range: 'พิสัย (ค่าสูงสุด − ค่าต่ำสุด)', iqr: 'ผลต่างระหว่าง Q₃ กับ Q₁ (ความยาวกล่อง)' }[ask], ans = ask === 'range' ? F.max - F.min : ask === 'iqr' ? F.q3 - F.q1 : F[ask];
  const q = `${tx || 'จากแผนภาพกล่อง'} <b>${nm}</b> มีค่าเท่าใด`;
  return { prompt: q, say: q.replace(/<[^>]+>/g, '').replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3'), __sig: `m3r ${ask} ${[F.min, F.q1, F.q2, F.q3, F.max]}`, __base: 'm3r', __baseCap: 3, __diff: ask === 'range' || ask === 'iqr' ? 30 : 18,
    mount(bd, ctx) { bd.append(h('div', { class: 'm3-qrow' }, m3Fig(m3BoxSVG([{ F }], { ...ax, labels: ask === 'range' || ask === 'iqr' ? 'val' : 'ask', ask: ask === 'range' || ask === 'iqr' ? null : ask })), miAns(ctx, ans, { hint: ask === 'range' ? 'ปลายขวา − ปลายซ้าย' : ask === 'iqr' ? 'ขอบขวาของกล่อง − ขอบซ้ายของกล่อง' : { min: 'ปลายเส้นด้านซ้าย', q1: 'ขอบซ้ายของกล่อง', q2: 'เส้นในกล่อง', q3: 'ขอบขวาของกล่อง', max: 'ปลายเส้นด้านขวา' }[ask] + ' — อ่านจากสเกลด้านล่าง' }))); } }; };
/* เลือกแผนภาพกล่องที่ตรงกับข้อมูล */
Q.m3Pick = data => { const F = m3Five(data), ax = m3Axis(F), wrong = [{ ...F, q1: F.q2, q2: F.q1 }, { ...F, q2: (F.min + F.max) / 2 }, { ...F, q1: F.min + (F.q1 - F.min) / 2, q3: F.q3 + (F.max - F.q3) / 2 }, { ...F, min: F.q1, q1: F.min }].filter(G => [G.min, G.q1, G.q2, G.q3, G.max].join() !== [F.min, F.q1, F.q2, F.q3, F.max].join() && G.q1 <= G.q2 && G.q2 <= G.q3 && G.min <= G.q1);
  const opts = [['ok', F], ...shuffle(wrong).slice(0, 2).map((G, i) => ['w' + i, G])];
  return { prompt: 'แผนภาพกล่องใดแสดงข้อมูลชุดนี้', say: 'แผนภาพกล่องใดแสดงข้อมูลชุดนี้', __sig: 'm3p ' + data.join(','), __base: 'm3p', __baseCap: 1, __diff: 40,
    mount(bd, ctx) { const ch = choices(ctx, shuffle(opts.map(([v, G]) => ({ value: v, label: m3BoxSVG([{ F: G }], { ...ax, W: 520, rowH: 60 }) + `<i class="m3-k" hidden>${v}</i>` }))), 'ok', { hint: 'หาค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด ก่อน แล้วเทียบกับขอบกล่อง เส้นในกล่อง และปลายเส้น' }); ch.classList.add('m3-boxopts'); bd.append(h('div', { class: 'colstack' }, h('div', { class: 'm3-data', html: m3Tiles(F.a) }), ch)); } }; };
/* สร้างแผนภาพกล่องเอง (ลาก) */
Q.m3Build = data => ({ prompt: 'สร้างแผนภาพกล่องของข้อมูลชุดนี้', say: 'สร้างแผนภาพกล่องของข้อมูลชุดนี้ ลากจุดทั้งห้าไปวางให้ตรงค่า', __sig: 'm3b ' + data.join(','), __base: 'm3b', __baseCap: 1, __diff: 55,
  mount(bd, ctx) { bd.append(m3BoxBuild(data, { game: true, onOK: () => setTimeout(() => ctx.check(true), 600), onWrong: () => ctx.check(false, 'หาค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด จากข้อมูลให้ครบก่อน') })); } });
/* เลือกตอบ (มีรูป) */
Q.m3Opt = ({ q, fig, opts, right, hint, sig, base }) => ({ prompt: q, say: miSay(q.replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3')), __sig: 'm3o ' + (sig || q + right), ...(base ? { __base: base, __baseCap: 2 } : {}),
  mount(bd, ctx) { const ch = choices(ctx, shuffle(opts.map(o => ({ value: o, label: o }))), right, { hint }); if (opts.some(o => o.replace(/<[^>]+>/g, '').length > 8)) ch.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); bd.append(h('div', { class: 'colstack' }, fig ? m3Fig(fig) : '', ch)); } });
/* ตอบตัวเลข (มีรูป) */
Q.m3Num = ({ q, fig, a, unit, hint, sig, base }) => ({ prompt: q, say: miSay(q.replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3')), __sig: 'm3n ' + (sig || q), ...(base ? { __base: base, __baseCap: 2 } : {}),
  mount(bd, ctx) { bd.append(h('div', { class: fig ? 'm3-qrow' : 'colstack' }, fig ? m3Fig(fig) : '', miAns(ctx, a, { unit, hint }))); } });
const m3TF = (text, ok, why) => Q.hTF({ text, ok: !!ok, why });
/* ร้อยละ / จำนวนข้อมูลในช่วง */
const M3PCT = [['ค่าต่ำสุด', 'Q₁', 25], ['Q₁', 'Q₃', 50], ['ค่าต่ำสุด', 'Q₃', 75], ['Q₂', 'ค่าสูงสุด', 50], ['Q₁', 'ค่าสูงสุด', 75], ['Q₃', 'ค่าสูงสุด', 25]];
const m3PctQ = i => { const [a, b, p] = M3PCT[i]; return Q.m3Opt({ q: `ข้อมูลระหว่าง <b>${a}</b> กับ <b>${b}</b> มีประมาณร้อยละเท่าใดของข้อมูลทั้งหมด`, opts: ['25', '50', '75', '100'].map(x => x + '%'), right: p + '%', hint: 'แต่ละส่วนของแผนภาพกล่องมีข้อมูลประมาณ 25%', sig: 'pct ' + i, base: 'm3pct' }); };
const m3CountQ = (N, i) => { const [a, b, p] = M3PCT[i]; return Q.m3Num({ q: `นักเรียน ${N} คน นำคะแนนมาสร้างแผนภาพกล่อง มีนักเรียนประมาณกี่คนที่ได้คะแนนระหว่าง <b>${a}</b> กับ <b>${b}</b>`, a: N * p / 100, unit: 'คน', hint: `ระหว่าง ${a} กับ ${b} มีประมาณ ${p}% ของ ${N} คน`, sig: `cnt ${N} ${i}`, base: 'm3cnt' }); };
/* เปรียบเทียบแผนภาพกล่องสองชุด */
const m3Pair = () => { const A = { min: m3R(20, 30), q1: 0, q2: 0, q3: 0, max: 0 }; A.q1 = A.min + m3R(8, 14); A.q2 = A.q1 + m3R(5, 10); A.q3 = A.q2 + m3R(5, 10); A.max = A.q3 + m3R(6, 14);
  const B = { min: A.min + m3R(-6, 6), q1: 0, q2: 0, q3: 0, max: 0 }; B.q1 = B.min + m3R(4, 8); B.q2 = B.q1 + m3R(3, 6) + (Math.random() < .5 ? 6 : 0); B.q3 = B.q2 + m3R(3, 6); B.max = B.q3 + m3R(4, 12); if (B.q2 === A.q2) B.q2++; if (B.q3 - B.q1 === A.q3 - A.q1) B.q3++; return [A, B]; };
const m3CmpFig = (A, B, na = 'ห้อง ก', nb = 'ห้อง ข') => m3BoxSVG([{ F: A, name: na }, { F: B, name: nb, col: M3COL[1] }], { ...m3AxisAll([A, B]), labels: 'val' });
const m3CmpQ = kind => { const [A, B] = m3Pair(), fig = m3CmpFig(A, B), ia = A.q3 - A.q1, ib = B.q3 - B.q1;
  if (kind === 'med') return Q.m3Opt({ q: 'ห้องใดมี<b>มัธยฐาน</b>ของคะแนนสูงกว่า', fig, opts: ['ห้อง ก', 'ห้อง ข', 'เท่ากัน'], right: A.q2 > B.q2 ? 'ห้อง ก' : 'ห้อง ข', hint: 'เทียบเส้นในกล่องของทั้งสองห้อง', sig: 'cmpmed ' + A.q2 + B.q2, base: 'm3cmp' });
  if (kind === 'iqr') return Q.m3Opt({ q: 'คะแนนกลุ่มกลาง 50% (ในกล่อง) ของห้องใด<b>กระจายมากกว่า</b>', fig, opts: ['ห้อง ก', 'ห้อง ข', 'เท่ากัน'], right: ia > ib ? 'ห้อง ก' : 'ห้อง ข', hint: 'กล่องที่ยาวกว่า = ข้อมูลกลุ่มกลางกระจายมากกว่า', sig: 'cmpiqr ' + ia + ib, base: 'm3cmp' });
  if (kind === 'diff') return Q.m3Num({ q: 'มัธยฐานของสองห้องต่างกันเท่าใด', fig, a: Math.abs(A.q2 - B.q2), unit: 'คะแนน', hint: 'นำมัธยฐาน (เส้นในกล่อง) มาลบกัน', sig: 'cmpd ' + A.q2 + B.q2, base: 'm3cmpn' });
  return Q.m3Num({ q: 'พิสัยของคะแนนห้อง ก มากกว่าหรือน้อยกว่าห้อง ข อยู่เท่าใด (ตอบผลต่าง)', fig, a: Math.abs((A.max - A.min) - (B.max - B.min)), unit: 'คะแนน', hint: 'พิสัย = ค่าสูงสุด − ค่าต่ำสุด ของแต่ละห้อง แล้วนำมาลบกัน', sig: 'cmpr ' + A.max + B.max, base: 'm3cmpn' }); };
/* ตารางผลจากโปรแกรม */
const m3OutTbl = F => `<div class="m3-out"><table><tr><th>n</th><th>ค่าต่ำสุด</th><th>Q₁</th><th>มัธยฐาน</th><th>Q₃</th><th>ค่าสูงสุด</th></tr><tr><td>${F.n}</td><td>${m3N(F.min)}</td><td>${m3N(F.q1)}</td><td>${m3N(F.q2)}</td><td>${m3N(F.q3)}</td><td>${m3N(F.max)}</td></tr></table></div>`;
/* เลือกแผนภาพกล่องที่ตรงกับตารางผลของโปรแกรม */
Q.m3PickT = F => { const ax = m3Axis(F), wrong = [{ ...F, q2: F.q1 + (F.q3 - F.q1) * .8 }, { ...F, q1: F.min, min: F.min - (F.q1 - F.min) }, { ...F, q3: F.max, max: F.max + (F.max - F.q3) }].map(G => ({ ...G, q2: Math.round(G.q2 * 2) / 2, min: Math.max(ax.lo, G.min), max: Math.min(ax.hi, G.max) }));
  return { prompt: 'ตารางผลจากโปรแกรมตรงกับแผนภาพกล่องใด', say: 'ตารางผลจากโปรแกรมตรงกับแผนภาพกล่องใด', __sig: 'm3pt ' + [F.min, F.q1, F.q2, F.q3, F.max], __base: 'm3p', __baseCap: 1, __diff: 35,
    mount(bd, ctx) { const ch = choices(ctx, shuffle([['ok', F], ...shuffle(wrong).slice(0, 2).map((G, i) => ['w' + i, G])].map(([v, G]) => ({ value: v, label: m3BoxSVG([{ F: G }], { ...ax, W: 520, rowH: 60 }) + `<i class="m3-k" hidden>${v}</i>` }))), 'ok', { hint: 'เทียบทีละค่า: ปลายซ้าย ขอบกล่อง เส้นในกล่อง ปลายขวา' }); ch.classList.add('m3-boxopts'); bd.append(h('div', { class: 'colstack' }, m3Fig(m3OutTbl(F)), ch)); } }; };

/* =========================================================
   บทเรียน 3001–3006 + บอส 3019
   ========================================================= */
const M3FRUIT = [['แตงโม', 32], ['มะละกอ', 41], ['ส้ม', 46], ['สับปะรด', 52], ['แอปเปิล', 55], ['ฝรั่ง', 64], ['ลำไย', 66], ['องุ่น', 70], ['มะม่วง', 74], ['กล้วย', 92], ['ทุเรียน', 150]];
const m3Walk = data => { const F = m3Five(data), n = F.n, h0 = m3Half(n), pos = (lo, len) => len % 2 ? `ตัวที่ ${lo + (len + 1) / 2}` : `ค่าเฉลี่ยของตัวที่ ${lo + len / 2} กับ ${lo + len / 2 + 1}`;
  return dcWalk(m3Tiles(F.a), [['① เรียงข้อมูลจากน้อยไปมาก', `${n} ตัว`], ['② Q₂ = มัธยฐานของข้อมูลทั้งหมด', `${pos(0, n)} = ${m3N(F.q2)}`],
    ['③ แบ่งครึ่ง', n % 2 ? `จำนวนข้อมูลเป็นคี่ → ให้มัธยฐานอยู่ทั้งสองครึ่ง ครึ่งละ ${h0} ตัว` : `จำนวนข้อมูลเป็นคู่ → ครึ่งละ ${h0} ตัว`], ['④ Q₁ = มัธยฐานของครึ่งแรก', `${pos(0, h0)} = ${m3N(F.q1)}`], ['⑤ Q₃ = มัธยฐานของครึ่งหลัง', `${pos(n - h0, h0)} = ${m3N(F.q3)}`]],
    `<b>Q₁ = ${m3N(F.q1)} · Q₂ = ${m3N(F.q2)} · Q₃ = ${m3N(F.q3)}</b>`); };
const m3Gen = (n, lo, hi) => { for (let t = 0; t < 40; t++) { const d = m3Data(n, lo, hi), F = m3Five(d); if (F.min < F.q1 && F.q1 < F.q2 && F.q2 < F.q3 && F.q3 < F.max) return d; } return m3Data(n, lo, hi); };
const m3GenF5 = () => { const F = { min: 5 * m3R(2, 6) }; F.q1 = F.min + 5 * m3R(1, 3); F.q2 = F.q1 + 5 * m3R(1, 3); F.q3 = F.q2 + 5 * m3R(1, 3); F.max = F.q3 + 5 * m3R(1, 4); return F; }; /* อ่านค่าจากสเกลได้ตรง (ขีดทุก 5) */
const m3GenF = () => m3Five(m3Gen(m3Pick([11, 12, 13, 15, 16]), m3Pick([10, 20, 30]), m3Pick([70, 80, 90])));
const LM3 = (no, place, title, short, goal, teach, game) => ({ id: 3000 + no, no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game });
const LESSONS_M3C6 = [
  LM3(1, 'สวนผลไม้', 'ควอร์ไทล์ : กิจกรรมพลังงานจากผลไม้', 'แบ่งข้อมูล 4 ส่วน', 'เรียงข้อมูลจากน้อยไปมาก และแบ่งข้อมูลออกเป็นสี่ส่วนเท่า ๆ กัน เพื่อรู้จักควอร์ไทล์ที่ 1 2 และ 3', [
    T('<b>กิจกรรมพลังงานจากผลไม้</b> (ข้อมูลสมมติ: กิโลแคลอรีต่อ 100 กรัม) — เรียงจากน้อยไปมาก', 'กิจกรรมพลังงานจากผลไม้ เรียงข้อมูลจากน้อยไปมาก', el => el.append(m3SortSim(M3FRUIT.map(([n, v]) => [n, v]), 'ผลไม้'))),
    T('แบ่งข้อมูลที่เรียงแล้วเป็น <b>4 ส่วนเท่า ๆ กัน</b> — จุดแบ่งคือ Q₁ Q₂ Q₃', 'แบ่งข้อมูลที่เรียงแล้วเป็นสี่ส่วนเท่า ๆ กัน จุดแบ่งคือควอร์ไทล์ที่หนึ่ง สอง และสาม', el => el.append(m3Walk(M3FRUIT.map(x => x[1])))),
    T('<b>ความหมายของควอร์ไทล์</b> — แตะการ์ดดูทีละใบ', 'ความหมายของควอร์ไทล์ แตะการ์ดดูทีละใบ', el => el.append(miCards([['Q₁', '<b>ประมาณ 25%</b><small>ของข้อมูลน้อยกว่าหรือเท่ากับ Q₁</small>', 'ควอร์ไทล์ที่ 1'], ['Q₂', '<b>ประมาณ 50%</b><small>คือมัธยฐานนั่นเอง</small>', 'ควอร์ไทล์ที่ 2'], ['Q₃', '<b>ประมาณ 75%</b><small>ของข้อมูลน้อยกว่าหรือเท่ากับ Q₃</small>', 'ควอร์ไทล์ที่ 3'], ['4 ส่วน', '<b>ส่วนละประมาณ 25%</b><small>ของข้อมูลทั้งหมด</small>']])))
  ], () => [Q.m3Q({ data: m3Sort(m3Gen(9, 10, 60)), k: 'q2', sorted: true }), Q.m3Q({ data: m3Sort(m3Gen(11, 20, 80)), k: 'q1', sorted: true }), Q.m3Q({ data: m3Sort(m3Gen(11, 20, 80)), k: 'q3', sorted: true }), Q.m3Q({ data: m3Sort(m3Gen(10, 30, 90)), k: 'q2', sorted: true }),
    Q.m3Opt({ q: 'ควอร์ไทล์ที่ 2 (Q₂) มีค่าเท่ากับค่าใด', opts: ['มัธยฐาน', 'ค่าเฉลี่ยเลขคณิต', 'ฐานนิยม', 'ค่าสูงสุด'], right: 'มัธยฐาน', hint: 'Q₂ แบ่งข้อมูลเป็นสองส่วนเท่ากัน' }),
    Q.m3Opt({ q: 'ข้อมูลประมาณร้อยละเท่าใดที่มีค่าน้อยกว่าหรือเท่ากับ Q₁', opts: ['25%', '50%', '75%', '100%'], right: '25%', hint: 'Q₁ คือจุดแบ่งส่วนแรกจาก 4 ส่วน' }), Q.m3Opt({ q: 'ข้อมูลประมาณร้อยละเท่าใดที่มีค่าน้อยกว่าหรือเท่ากับ Q₃', opts: ['25%', '50%', '75%', '100%'], right: '75%', hint: 'น้อยกว่า Q₃ มี 3 ส่วนจาก 4 ส่วน' }),
    Q.m3Opt({ q: 'ก่อนหาควอร์ไทล์ ต้องทำสิ่งใดกับข้อมูลก่อน', opts: ['เรียงข้อมูลจากน้อยไปมาก', 'หาค่าเฉลี่ย', 'นับความถี่ของแต่ละค่า', 'ตัดค่าสูงสุดออก'], right: 'เรียงข้อมูลจากน้อยไปมาก', hint: 'ควอร์ไทล์เป็นค่าตามตำแหน่ง' }),
    Q.m3Opt({ q: 'ควอร์ไทล์แบ่งข้อมูลที่เรียงแล้วออกเป็นกี่ส่วนเท่า ๆ กัน', opts: ['4 ส่วน', '2 ส่วน', '3 ส่วน', '10 ส่วน'], right: '4 ส่วน', hint: 'ควอร์ไทล์ (quartile) มาจากคำว่า หนึ่งในสี่' }),
    m3TF('Q₁ ≤ Q₂ ≤ Q₃ เสมอ', true, 'ควอร์ไทล์เรียงตามตำแหน่งจากน้อยไปมาก'), m3TF('ถ้าข้อมูลมี 40 ตัว จะมีข้อมูลประมาณ 10 ตัวที่น้อยกว่าหรือเท่ากับ Q₁', true, '25% ของ 40 = 10')]),
  LM3(2, 'แปลงควอร์ไทล์', 'ควอร์ไทล์', 'หาควอร์ไทล์', 'หาควอร์ไทล์ที่ 1 2 และ 3 ของข้อมูลทั้งที่มีจำนวนคู่และจำนวนคี่ โดยใช้ความรู้เรื่องมัธยฐาน', [
    T('ตัวอย่างทีละขั้น: <b>หาควอร์ไทล์</b> (ข้อมูล 11 ตัว)', 'ตัวอย่างทีละขั้น หาควอร์ไทล์ ข้อมูลสิบเอ็ดตัว', el => el.append(m3Walk([12, 25, 18, 30, 14, 22, 27, 16, 20, 33, 24]))),
    T('<b>ลองหาเอง (ข้อมูลจำนวนคู่)</b> — แตะ Q₂ แล้ว Q₁ แล้ว Q₃', 'ลองหาเอง ข้อมูลจำนวนคู่ แตะควอร์ไทล์ที่สอง แล้วที่หนึ่ง แล้วที่สาม', el => el.append(m3QuartTap([14, 18, 21, 23, 26, 29, 31, 35, 38, 42]))),
    T('<b>ลองหาเอง (ข้อมูลจำนวนคี่)</b> — มัธยฐานอยู่ในทั้งสองครึ่ง', 'ลองหาเอง ข้อมูลจำนวนคี่ มัธยฐานอยู่ในทั้งสองครึ่ง', el => el.append(m3QuartTap([40, 43, 47, 50, 52, 55, 58, 61, 63, 66, 70, 72, 75])))
  ], () => [Q.m3Q({ data: m3Gen(8, 10, 50), k: 'q2' }), Q.m3Q({ data: m3Gen(10, 20, 70), k: 'q1' }), Q.m3Q({ data: m3Gen(12, 30, 90), k: 'q3' }), Q.m3Q({ data: m3Gen(13, 10, 60), k: 'q1' }), Q.m3Q({ data: m3Gen(15, 40, 99), k: 'q3' }), Q.m3Q({ data: m3Gen(9, 5, 40), k: 'q2' }), Q.m3Tap(m3Sort(m3Gen(12, 20, 80))),
    Q.m3Num({ q: 'ข้อมูลชุดหนึ่งมี 15 ตัว (จำนวนคี่) เมื่อแบ่งครึ่งเพื่อหา Q₁ ครึ่งแรกมีข้อมูลกี่ตัว', a: 8, unit: 'ตัว', hint: 'รวมมัธยฐาน (ตัวที่ 8) ไว้ในครึ่งแรกด้วย' }),
    Q.m3Opt({ q: 'ข้อมูล 20 ตัวเรียงแล้ว Q₁ คือข้อใด', opts: ['ค่าเฉลี่ยของตัวที่ 5 กับตัวที่ 6', 'ตัวที่ 5', 'ตัวที่ 10', 'ค่าเฉลี่ยของตัวที่ 10 กับตัวที่ 11'], right: 'ค่าเฉลี่ยของตัวที่ 5 กับตัวที่ 6', hint: 'ครึ่งแรกมี 10 ตัว ตัวกลางของ 10 ตัวคือตัวที่ 5 กับ 6' }),
    m3TF('ข้อมูล 9 ตัว Q₂ คือข้อมูลตัวที่ 5', true, 'ตัวกลางของ 9 ตัว'), m3TF('ควอร์ไทล์ต้องเป็นค่าที่อยู่ในข้อมูลเสมอ', false, 'อาจเป็นค่าเฉลี่ยของสองค่า เช่น 22.5')]),
  LM3(3, 'ลานกล่องดอกไม้', 'แผนภาพกล่อง', 'สร้างแผนภาพกล่อง', 'บอกส่วนประกอบของแผนภาพกล่อง สร้างแผนภาพกล่องจากข้อมูล และอ่านค่าจากแผนภาพกล่อง', [
    T('<b>ส่วนประกอบของแผนภาพกล่อง</b> — แตะทั้ง 5 ค่า', 'ส่วนประกอบของแผนภาพกล่อง แตะทั้งห้าค่า', el => el.append(m3BoxParts([31, 35, 38, 40, 42, 45, 47, 50, 53, 56, 60, 66]))),
    T('ตัวอย่างทีละขั้น: <b>สร้างแผนภาพกล่อง</b>', 'ตัวอย่างทีละขั้น สร้างแผนภาพกล่อง', el => { const d = [8, 12, 13, 15, 17, 18, 21, 24, 26, 30, 35], F = m3Five(d), ax = m3Axis(F); el.append(dcWalk(m3Tiles(d) + m3BoxSVG([{ F }], { ...ax, labels: 'val' }), [['① หา 5 ค่า', `ค่าต่ำสุด ${F.min} · Q₁ ${m3N(F.q1)} · Q₂ ${m3N(F.q2)} · Q₃ ${m3N(F.q3)} · ค่าสูงสุด ${F.max}`], ['② เขียนเส้นจำนวน', `มีสเกลครอบคลุม ${F.min} ถึง ${F.max}`], ['③ เขียนกล่อง', `จาก Q₁ ถึง Q₃ และเส้นในกล่องที่ Q₂`], ['④ เขียนเส้น 2 ข้าง', 'จากกล่องไปถึงค่าต่ำสุดและค่าสูงสุด']], '<b>ได้แผนภาพกล่อง</b> (box plot)')); }),
    T('<b>ลองสร้างเอง</b>: ลากจุดทั้ง 5 ให้ตรงค่าของข้อมูล', 'ลองสร้างเอง ลากจุดทั้งห้าให้ตรงค่าของข้อมูล', el => el.append(m3BoxBuild([22, 25, 27, 30, 31, 34, 36, 38, 41, 45, 48])))
  ], () => { const F1 = m3GenF(), F2 = m3GenF(), F3 = m3GenF(); return [Q.m3Read({ F: m3GenF5(), ask: 'q2' }), Q.m3Read({ F: m3GenF5(), ask: 'q1' }), Q.m3Read({ F: m3GenF5(), ask: 'q3' }), Q.m3Read({ F: m3GenF5(), ask: 'min' }), Q.m3Read({ F: F1, ask: 'range' }), Q.m3Read({ F: F2, ask: 'iqr' }),
    Q.m3Pick(m3Gen(11, 20, 80)), Q.m3Build(m3Gen(11, 10, 40)),
    Q.m3Opt({ q: 'เส้นตรงกลางในกล่องของแผนภาพกล่องแสดงค่าใด', opts: ['มัธยฐาน (Q₂)', 'ค่าเฉลี่ย', 'Q₁', 'พิสัย'], right: 'มัธยฐาน (Q₂)', hint: 'กล่องเริ่มที่ Q₁ จบที่ Q₃ และมีเส้น Q₂ อยู่ภายใน' }),
    Q.m3Opt({ q: 'แผนภาพกล่องใช้ค่ากี่ค่าในการสร้าง', opts: ['5 ค่า', '3 ค่า', '4 ค่า', 'ทุกค่าในข้อมูล'], right: '5 ค่า', hint: 'ค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด' }),
    m3TF('ความยาวของกล่องคือ Q₃ − Q₁', true, ''), m3TF('ปลายเส้นด้านซ้ายของแผนภาพกล่องคือ Q₁', false, 'ปลายเส้นด้านซ้ายคือค่าต่ำสุด — Q₁ คือขอบซ้ายของกล่อง')]; }),
  LM3(4, 'ทุ่งกระจายเกสร', 'แผนภาพกล่องกับการกระจายของข้อมูล', 'การกระจายข้อมูล', 'แปลความหมายของแผนภาพกล่อง: แต่ละส่วนมีข้อมูลประมาณ 25% ส่วนที่สั้นข้อมูลอยู่ใกล้กัน ส่วนที่ยาวข้อมูลกระจาย', [
    T('<b>แต่ละส่วนมีข้อมูลประมาณ 25%</b> — แตะทีละส่วน ดูจุดข้อมูลในส่วนนั้น', 'แต่ละส่วนมีข้อมูลประมาณยี่สิบห้าเปอร์เซ็นต์ แตะทีละส่วน', el => el.append(m3QuarterSim([12, 14, 15, 16, 17, 17, 18, 20, 23, 27, 32, 38, 44, 51, 57, 62]))),
    T('<b>อ่านการกระจาย</b> จากความยาวของแต่ละส่วน — แตะการ์ดดูทีละใบ', 'อ่านการกระจายจากความยาวของแต่ละส่วน แตะการ์ดดูทีละใบ', el => el.append(miCards([['ส่วนที่สั้น', '<b>ข้อมูลอยู่ใกล้กัน</b><small>(หนาแน่น)</small>'], ['ส่วนที่ยาว', '<b>ข้อมูลกระจาย</b><small>ห่างกันมาก</small>'], ['กล่อง', '<b>ข้อมูลกลุ่มกลาง 50%</b><small>จาก Q₁ ถึง Q₃</small>'], ['ทุกส่วน', '<b>มีข้อมูลเท่า ๆ กัน</b><small>ส่วนละประมาณ 25% แม้จะยาวไม่เท่ากัน</small>']])))
  ], () => { const F = m3Five([10, 22, 25, 26, 28, 29, 31, 34, 40, 52, 60, 75]), ax = m3Axis(F), L = [F.q1 - F.min, F.q2 - F.q1, F.q3 - F.q2, F.max - F.q3], nm = ['ส่วนที่ 1 (ค่าต่ำสุดถึง Q₁)', 'ส่วนที่ 2 (Q₁ ถึง Q₂)', 'ส่วนที่ 3 (Q₂ ถึง Q₃)', 'ส่วนที่ 4 (Q₃ ถึงค่าสูงสุด)'];
    return [...[0, 1, 2, 3, 4, 5].map(m3PctQ), m3CountQ(m3Pick([40, 80]), m3Pick([0, 5])), m3CountQ(m3Pick([120, 200]), m3Pick([1, 2])),
      Q.m3Opt({ q: 'ข้อมูลในส่วนใด<b>อยู่ใกล้กันมากที่สุด</b>', fig: m3BoxSVG([{ F }], { ...ax, labels: 'val' }), opts: nm, right: nm[L.indexOf(Math.min(...L))], hint: 'ส่วนที่สั้นที่สุด ข้อมูลจะอยู่ใกล้กันมากที่สุด', sig: 'near1' }),
      Q.m3Opt({ q: 'ข้อมูลในส่วนใด<b>กระจายมากที่สุด</b>', fig: m3BoxSVG([{ F }], { ...ax, labels: 'val' }), opts: nm, right: nm[L.indexOf(Math.max(...L))], hint: 'ส่วนที่ยาวที่สุด ข้อมูลจะกระจายมากที่สุด', sig: 'far1' }),
      m3TF('ส่วนที่ยาวกว่าในแผนภาพกล่อง มีจำนวนข้อมูลมากกว่าส่วนที่สั้น', false, 'ทุกส่วนมีข้อมูลประมาณ 25% เท่ากัน ความยาวบอกการกระจาย'), m3TF('ข้อมูลประมาณครึ่งหนึ่งอยู่ภายในกล่อง', true, 'จาก Q₁ ถึง Q₃ มีประมาณ 50%')]; }),
  LM3(5, 'สะพานเทียบรวง', 'การเปรียบเทียบแผนภาพกล่อง', 'เปรียบเทียบข้อมูล', 'เปรียบเทียบข้อมูลสองชุดจากแผนภาพกล่อง ทั้งค่ากลาง (มัธยฐาน) และการกระจาย (ความยาวกล่อง พิสัย)', [
    T('<b>เปรียบเทียบคะแนนสอบสองห้อง</b> (ข้อมูลสมมติ) — แตะการ์ดดูทีละใบ', 'เปรียบเทียบคะแนนสอบสองห้อง แตะการ์ดดูทีละใบ', el => { const A = { min: 28, q1: 42, q2: 51, q3: 60, max: 74 }, B = { min: 35, q1: 47, q2: 55, q3: 58, max: 66 };
      el.append(h('div', { class: 'colstack' }, m3Fig(m3CmpFig(A, B)), miCards([['มัธยฐาน', `<b>ห้อง ข สูงกว่า</b><small>55 > 51 คะแนนกลางของห้อง ข สูงกว่า</small>`], ['ความยาวกล่อง', `<b>ห้อง ก ยาวกว่า</b><small>60 − 42 = 18 กับ 58 − 47 = 11 → ห้อง ก กระจายมากกว่า</small>`], ['พิสัย', `<b>ห้อง ก มากกว่า</b><small>74 − 28 = 46 กับ 66 − 35 = 31</small>`], ['สรุป', '<b>ห้อง ข ได้คะแนนสูงกว่าและใกล้เคียงกันมากกว่า</b>']]))); }),
    T('ตัวอย่างทีละขั้น: <b>เปรียบเทียบเวลาวิ่ง</b> สองกลุ่ม (วินาที)', 'ตัวอย่างทีละขั้น เปรียบเทียบเวลาวิ่งสองกลุ่ม', el => { const A = { min: 12, q1: 14, q2: 15, q3: 17, max: 21 }, B = { min: 11, q1: 13, q2: 16, q3: 19, max: 24 };
      el.append(dcWalk(m3BoxSVG([{ F: A, name: 'กลุ่ม ก' }, { F: B, name: 'กลุ่ม ข', col: M3COL[1] }], { ...m3AxisAll([A, B]), labels: 'val' }), [['① ค่ากลาง', 'มัธยฐาน ก = 15 วินาที · ข = 16 วินาที → กลุ่ม ก วิ่งเร็วกว่าเล็กน้อย'], ['② ความยาวกล่อง', 'ก = 17 − 14 = 3 · ข = 19 − 13 = 6 → กลุ่ม ข กระจายมากกว่า'], ['③ พิสัย', 'ก = 21 − 12 = 9 · ข = 24 − 11 = 13']], '<b>กลุ่ม ก วิ่งเร็วกว่าและเวลาใกล้เคียงกันมากกว่า</b>')); })
  ], () => [m3CmpQ('med'), m3CmpQ('iqr'), m3CmpQ('diff'), m3CmpQ('range'), m3CmpQ('med'), m3CmpQ('iqr'),
    Q.m3Opt({ q: 'ต้องการรู้ว่าข้อมูลชุดใด "ใกล้เคียงกันมากกว่า" ควรดูสิ่งใดของแผนภาพกล่อง', opts: ['ความยาวของกล่อง', 'ตำแหน่งของเส้นในกล่องเท่านั้น', 'สีของกล่อง', 'ชื่อของข้อมูล'], right: 'ความยาวของกล่อง', hint: 'กล่องสั้น = ข้อมูลกลุ่มกลางใกล้เคียงกัน' }),
    Q.m3Opt({ q: 'การเปรียบเทียบแผนภาพกล่องสองชุดให้ถูกต้อง ต้องเป็นอย่างไร', opts: ['ใช้สเกลเดียวกัน', 'กล่องต้องยาวเท่ากัน', 'ข้อมูลต้องมีจำนวนเท่ากันเสมอ', 'ต้องวาดคนละสเกล'], right: 'ใช้สเกลเดียวกัน', hint: 'วางบนเส้นจำนวนเดียวกันจึงเทียบได้' }),
    m3TF('ถ้ามัธยฐานของห้อง ก มากกว่าห้อง ข แสดงว่านักเรียนทุกคนในห้อง ก ได้คะแนนมากกว่าทุกคนในห้อง ข', false, 'มัธยฐานบอกค่ากลาง ไม่ได้บอกทุกคน'), m3TF('แผนภาพกล่องที่มีพิสัยมากกว่า ข้อมูลโดยรวมกระจายมากกว่า', true, '')]),
  LM3(6, 'โรงเรือนเทคโน', 'การนำเสนอข้อมูลในรูปแผนภาพกล่องโดยใช้เทคโนโลยี', 'ใช้เทคโนโลยี', 'ใช้โปรแกรมคำนวณค่าและสร้างแผนภาพกล่อง อ่านผลที่ได้ และแปลความหมาย', [
    T('<b>โปรแกรมสร้างแผนภาพกล่อง</b> (จำลอง) — ลากจุดข้อมูลแล้วดูผล', 'โปรแกรมสร้างแผนภาพกล่อง ลากจุดข้อมูลแล้วดูผล', el => el.append(m3TechSim([34, 38, 41, 45, 47, 50, 52, 55, 57, 60, 63, 66, 70, 74, 81], 20, 100))),
    T('<b>ขั้นตอนใช้โปรแกรม</b> — แตะการ์ดดูทีละใบ', 'ขั้นตอนใช้โปรแกรม แตะการ์ดดูทีละใบ', el => el.append(miCards([['1 กรอกข้อมูล', '<b>พิมพ์ข้อมูลลงในตาราง</b><small>หนึ่งค่าต่อหนึ่งช่อง ตรวจให้ครบ</small>'], ['2 เลือกคำสั่ง', '<b>เลือกสร้างแผนภาพกล่อง</b><small>โปรแกรมเรียงข้อมูลและคำนวณให้</small>'], ['3 อ่านผล', '<b>ค่าต่ำสุด Q₁ มัธยฐาน Q₃ ค่าสูงสุด</b><small>จากตารางผลและรูป</small>'], ['4 แปลความหมาย', '<b>ค่ากลางและการกระจาย</b><small>เขียนข้อสรุปด้วยตนเอง</small>']])))
  ], () => { const F = m3GenF(), G = m3GenF(); return [Q.m3Num({ q: 'จากตารางผลของโปรแกรม <b>พิสัย</b>ของข้อมูลเท่าใด', fig: m3OutTbl(F), a: F.max - F.min, hint: 'ค่าสูงสุด − ค่าต่ำสุด', sig: 'out r', base: 'm3out' }), Q.m3Num({ q: 'จากตารางผลของโปรแกรม <b>Q₃ − Q₁</b> เท่าใด', fig: m3OutTbl(G), a: G.q3 - G.q1, hint: 'Q₃ − Q₁', sig: 'out i', base: 'm3out' }),
    Q.m3Num({ q: 'จากตารางผลของโปรแกรม มีข้อมูลประมาณกี่ตัวที่มากกว่าหรือเท่ากับมัธยฐาน', fig: m3OutTbl({ ...F, n: 40 }), a: 20, unit: 'ตัว', hint: '50% ของ n', sig: 'out h', base: 'm3out2' }),
    Q.m3PickT(m3GenF()), Q.m3Read({ F: m3GenF5(), ask: 'q3', ctx: 'โปรแกรมสร้างแผนภาพกล่องดังรูป' }), Q.m3Read({ F: m3GenF(), ask: 'range', ctx: 'โปรแกรมสร้างแผนภาพกล่องดังรูป' }),
    Q.m3Opt({ q: 'ถ้าเปลี่ยนค่าสูงสุดของข้อมูลให้มากขึ้นอีก ค่าใด<b>ไม่เปลี่ยน</b>', opts: ['มัธยฐาน', 'ค่าสูงสุด', 'พิสัย', 'ความยาวเส้นด้านขวา'], right: 'มัธยฐาน', hint: 'มัธยฐานขึ้นกับตำแหน่งตรงกลาง ไม่ใช่ค่าปลาย' }),
    Q.m3Opt({ q: 'ข้อใดเป็นงานที่โปรแกรมช่วยทำให้ได้', opts: ['เรียงข้อมูลและคำนวณควอร์ไทล์', 'สรุปความหมายแทนเราได้ทุกครั้ง', 'แก้ข้อมูลที่กรอกผิดให้เอง', 'เลือกข้อมูลที่จะเก็บให้'], right: 'เรียงข้อมูลและคำนวณควอร์ไทล์', hint: 'โปรแกรมคำนวณได้ แต่การกรอกข้อมูลและแปลความหมายเป็นหน้าที่ของเรา' }),
    m3TF('ถ้ากรอกข้อมูลผิดหนึ่งค่า แผนภาพกล่องที่ได้อาจผิดไปด้วย', true, 'ต้องตรวจข้อมูลก่อนเสมอ'), m3TF('โปรแกรมต่างกันอาจใช้วิธีหาควอร์ไทล์ต่างกัน ค่าจึงอาจต่างกันเล็กน้อย', true, 'ควรรู้ว่าโปรแกรมใช้วิธีใด')]; })
];
LESSONS_M3C6.find(L => L.id === 3002).pracQ = () => Q.m3Q({ data: [21, 15, 30, 18, 26, 24, 12, 28], k: 'q2' });

/* ---------- บอส: 20 ข้อ (แต่งใหม่ทั้งหมด) ---------- */
const m3BF = { min: 20, q1: 35, q2: 48, q3: 56, max: 80 }, m3BA = { min: 30, q1: 45, q2: 52, q3: 60, max: 72 }, m3BB = { min: 25, q1: 38, q2: 47, q3: 64, max: 85 };
const EXAM_M3C6 = xrot([
  { q: 'ข้อมูล 3, 7, 8, 12, 15, 18, 21 มีมัธยฐาน (Q₂) เท่าใด', opts: ['12', '8', '15', '11.5'], a: 0 },
  { q: 'ข้อมูล 3, 7, 8, 12, 15, 18, 21 มี Q₁ เท่าใด', opts: ['7.5', '7', '8', '5'], a: 0 },
  { q: 'ข้อมูล 3, 7, 8, 12, 15, 18, 21 มี Q₃ เท่าใด', opts: ['16.5', '18', '15', '19.5'], a: 0 },
  { q: 'ข้อมูล 10, 14, 15, 19, 22, 25, 27, 30 มี Q₁ เท่าใด', opts: ['14.5', '14', '15', '12'], a: 0 },
  { q: 'ข้อมูล 10, 14, 15, 19, 22, 25, 27, 30 มีมัธยฐานเท่าใด', opts: ['20.5', '19', '22', '20'], a: 0 },
  { q: 'ควอร์ไทล์ที่ 2 มีความหมายเดียวกับค่าใด', opts: ['มัธยฐาน', 'ค่าเฉลี่ย', 'ฐานนิยม', 'พิสัย'], a: 0 },
  { q: 'ข้อมูลประมาณร้อยละเท่าใดที่มีค่ามากกว่า Q₃', opts: ['25%', '75%', '50%', '10%'], a: 0 },
  { q: 'จากแผนภาพกล่อง Q₁ มีค่าเท่าใด' + m3BoxSVG([{ F: m3BF }], { lo: 10, hi: 90, step: 10, labels: 'val' }), opts: ['35', '20', '48', '56'], a: 0 },
  { q: 'จากแผนภาพกล่อง พิสัยของข้อมูลเท่าใด' + m3BoxSVG([{ F: m3BF }], { lo: 10, hi: 90, step: 10, labels: 'val' }), opts: ['60', '80', '21', '45'], a: 0 },
  { q: 'จากแผนภาพกล่อง Q₃ − Q₁ เท่าใด' + m3BoxSVG([{ F: m3BF }], { lo: 10, hi: 90, step: 10, labels: 'val' }), opts: ['21', '60', '13', '8'], a: 0 },
  { q: 'จากแผนภาพกล่อง ข้อมูลในส่วนใดกระจายมากที่สุด' + m3BoxSVG([{ F: m3BF }], { lo: 10, hi: 90, step: 10, labels: 'val' }), opts: ['Q₃ ถึงค่าสูงสุด', 'ค่าต่ำสุดถึง Q₁', 'Q₁ ถึง Q₂', 'Q₂ ถึง Q₃'], a: 0 },
  { q: 'จากแผนภาพกล่อง ข้อมูลในส่วนใดอยู่ใกล้กันมากที่สุด' + m3BoxSVG([{ F: m3BF }], { lo: 10, hi: 90, step: 10, labels: 'val' }), opts: ['Q₂ ถึง Q₃', 'Q₃ ถึงค่าสูงสุด', 'ค่าต่ำสุดถึง Q₁', 'Q₁ ถึง Q₂'], a: 0 },
  { q: 'นักเรียน 160 คน สร้างแผนภาพกล่องของคะแนน มีนักเรียนประมาณกี่คนที่ได้คะแนนระหว่าง Q₁ กับ Q₃', opts: ['80 คน', '40 คน', '120 คน', '160 คน'], a: 0 },
  { q: 'แผนภาพกล่องใช้ค่าใดบ้าง', opts: ['ค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด', 'ค่าเฉลี่ย ฐานนิยม มัธยฐาน', 'ทุกค่าในข้อมูล', 'Q₁ และ Q₃ เท่านั้น'], a: 0 },
  { q: 'จากรูป ห้องใดมีมัธยฐานของคะแนนสูงกว่า' + m3CmpFig(m3BA, m3BB), opts: ['ห้อง ก', 'ห้อง ข', 'เท่ากัน', 'บอกไม่ได้'], a: 0 },
  { q: 'จากรูป ห้องใดมีคะแนนกลุ่มกลาง 50% กระจายมากกว่า' + m3CmpFig(m3BA, m3BB), opts: ['ห้อง ข', 'ห้อง ก', 'เท่ากัน', 'บอกไม่ได้'], a: 0 },
  { q: 'จากรูป ข้อใดถูกต้อง' + m3CmpFig(m3BA, m3BB), opts: ['พิสัยของห้อง ข มากกว่าห้อง ก', 'ค่าต่ำสุดของห้อง ก น้อยกว่าห้อง ข', 'Q₃ ของห้อง ก มากกว่าห้อง ข', 'ทั้งสองห้องมีพิสัยเท่ากัน'], a: 0 },
  { q: 'ข้อใดกล่าว<b>ไม่ถูกต้อง</b>เกี่ยวกับแผนภาพกล่อง', opts: ['ส่วนที่ยาวกว่ามีจำนวนข้อมูลมากกว่า', 'กล่องแสดงข้อมูลประมาณ 50% ตรงกลาง', 'เส้นในกล่องคือมัธยฐาน', 'ปลายเส้นสองข้างคือค่าต่ำสุดและค่าสูงสุด'], a: 0 },
  { q: 'ถ้าค่าสูงสุดของข้อมูลเพิ่มขึ้นมาก ๆ ค่าใดเปลี่ยนแน่นอน', opts: ['พิสัย', 'มัธยฐาน', 'Q₁', 'ค่าต่ำสุด'], a: 0 },
  { q: 'การใช้โปรแกรมสร้างแผนภาพกล่อง ข้อใดเป็นหน้าที่ของผู้ใช้', opts: ['ตรวจข้อมูลที่กรอกและแปลความหมายผลลัพธ์', 'เรียงข้อมูลด้วยมือก่อนทุกครั้ง', 'วาดกล่องด้วยไม้บรรทัด', 'คำนวณควอร์ไทล์ด้วยมือก่อนกรอก'], a: 0 }
], 2);
LESSONS_M3C6.push({ id: 3019, boss: true, place: 'รังผึ้งราชินี', title: 'ด่านบอส: ม.3 บทที่ 6 สถิติ (3)', short: 'ด่านบอส · ข้อสอบ', tone: 'yellow',
  goal: 'ตอบคำถามเรื่องควอร์ไทล์และแผนภาพกล่อง 20 ข้อ ตอบถูก 16 ข้อขึ้นไปเพื่อชนะผึ้งราชินี',
  exam: EXAM_M3C6, pass: 16, bossName: 'ผึ้งราชินีสถิติ', bossPal: 'yellow', emblem: 'Q', bossKind: 'bee',
  winLine: 'ชนะผึ้งราชินีแล้ว! อ่านควอร์ไทล์และแผนภาพกล่องได้คล่องมาก', loseLine: 'ผึ้งราชินียังเฝ้ารังอยู่ ลองทวนเรื่องแผนภาพกล่องอีกนิดแล้วมาสู้ใหม่นะ!' });
