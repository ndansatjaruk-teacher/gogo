/* =========================================================
   ม.3 บทที่ 6 สถิติ (3) — มัธยฐาน · ควอร์ไทล์ · IQR · แผนภาพกล่อง · ค่านอกเกณฑ์ (v230) — prefix m3
   วิธีหาควอร์ไทล์ตามเอกสารของผู้ใช้: เรียงข้อมูล → Q2 = มัธยฐาน → Q1 = มัธยฐานของข้อมูลที่อยู่ "ต่ำกว่า" Q2
   → Q3 = มัธยฐานของข้อมูลที่อยู่ "สูงกว่า" Q2 (จำนวนคี่: ไม่นับมัธยฐานในทั้งสองครึ่ง · ครึ่งละ ⌊n/2⌋ ตัว)
   ค่านอกเกณฑ์: น้อยกว่า Q1 − 1.5×IQR หรือมากกว่า Q3 + 1.5×IQR
   ข้อมูลทั้งหมดเป็นข้อมูลสมมติ · ด่าน 3601–3614 + บอส 3619 (หมีขาว) · โลกขั้วโลกหิมะ (engine/polar.js)
   ========================================================= */
const m3Sort = a => [...a].sort((x, y) => x - y);
const m3Med = a => { const n = a.length, m = n >> 1; return n % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
const m3Five = arr => { const a = m3Sort(arr), n = a.length, h = n >> 1; return { a, n, min: a[0], max: a[n - 1], q1: m3Med(a.slice(0, h)), q2: m3Med(a), q3: m3Med(a.slice(n - h)) }; };
/* ตำแหน่ง (ลำดับที่ในข้อมูลที่เรียงแล้ว) ของ Q1 Q2 Q3 */
const m3Pos = n => { const h = n >> 1; return { q2: (n + 1) / 2, q1: (h + 1) / 2, q3: n - h + (h + 1) / 2, h }; };
const m3PosTxt = p => p % 1 ? `ค่าเฉลี่ยของตัวที่ ${p - .5} กับ ${p + .5}` : `ตัวที่ ${p}`;
const m3Fence = F => { const iqr = F.q3 - F.q1; return { iqr, lo: F.q1 - 1.5 * iqr, hi: F.q3 + 1.5 * iqr }; };
/* five numbers + outliers: whiskers stop at the furthest values inside the fences */
const m3FiveO = arr => { const F = m3Five(arr), f = m3Fence(F), inn = F.a.filter(v => v >= f.lo && v <= f.hi); return { ...F, ...f, outs: F.a.filter(v => v < f.lo || v > f.hi), wlo: inn[0], whi: inn[inn.length - 1] }; };
const m3N = x => (Math.round(x * 100) / 100).toLocaleString('en-US');
const m3R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const m3Pick = a => a[Math.floor(Math.random() * a.length)];
const M3K = { min: 'ค่าต่ำสุด', q1: 'Q₁', q2: 'Q₂ (มัธยฐาน)', q3: 'Q₃', max: 'ค่าสูงสุด' }, M3KS = { min: 'ค่าต่ำสุด', q1: 'Q₁', q2: 'Q₂', q3: 'Q₃', max: 'ค่าสูงสุด' };
const M3COL = ['#3D9BE9', '#E36A8C', '#7C5CE0', '#2FB5A3'];
const m3Say = t => miSay(String(t).replace(/<[^>]+>/g, ' ').replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3').replace(/\s+/g, ' ').trim());
/* random data with n values in [lo, hi] (integers) */
const m3Data = (n, lo, hi) => Array.from({ length: n }, () => m3R(lo, hi));
const m3Gen = (n, lo, hi) => { for (let t = 0; t < 60; t++) { const d = m3Data(n, lo, hi), F = m3Five(d); if (F.min < F.q1 && F.q1 < F.q2 && F.q2 < F.q3 && F.q3 < F.max) return d; } return m3Data(n, lo, hi); };
/* sorted, all different values */
const m3Uniq = (n, lo, hi) => { for (let t = 0; t < 80; t++) { const s = new Set(); while (s.size < n) s.add(m3R(lo, hi)); const a = m3Sort([...s]); if (a.length === n) return a; } return Array.from({ length: n }, (_, i) => lo + i * 2); };
const m3GenF5 = () => { const F = { min: 5 * m3R(2, 6) }; F.q1 = F.min + 5 * m3R(1, 3); F.q2 = F.q1 + 5 * m3R(1, 3); F.q3 = F.q2 + 5 * m3R(1, 3); F.max = F.q3 + 5 * m3R(1, 4); return F; }; /* อ่านค่าจากสเกลได้ตรง (ขีดทุก 5) */
const m3GenF = () => m3Five(m3Gen(m3Pick([11, 12, 13, 15, 16]), m3Pick([10, 20, 30]), m3Pick([70, 80, 90])));
const m3Axis = F => { const span = F.max - F.min, step = span > 60 ? 10 : span > 24 ? 5 : span > 10 ? 2 : 1, lo = Math.floor(F.min / step) * step - (F.min % step === 0 ? step : 0), hi = Math.ceil(F.max / step) * step + (F.max % step === 0 ? step : 0); return { lo: Math.max(0, lo), hi, step }; };
const m3AxisAll = Fs => m3Axis({ min: Math.min(...Fs.map(f => f.min)), max: Math.max(...Fs.map(f => f.max)) });
const m3Ax5 = F => ({ lo: F.min - 5, hi: F.max + 5, step: 5 });

/* ---------- figures ---------- */
/* rows: [{ F, name, col }] · F may carry wlo/whi/outs (ค่านอกเกณฑ์) · o.band = [from, to, colour] shades a range */
function m3BoxSVG(rows, o = {}) {
  const named = rows.some(r => r.name), W = o.W || (rows.length === 1 && !named ? 540 : 640), pad = named ? 112 : 44, rowH = o.rowH || 74, top = 26, H = top + rows.length * rowH + 40, lo = o.lo, hi = o.hi, step = o.step || 5, X = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad), yAx = H - 34;
  let s = '';
  if (o.band) s += `<rect x="${X(o.band[0])}" y="${top - 14}" width="${Math.max(2, X(o.band[1]) - X(o.band[0]))}" height="${rows.length * rowH + 4}" rx="6" fill="${o.band[2] || '#FFE27A'}" opacity=".45"/>`;
  s += `<path d="M${pad - 10} ${yAx} H${W - pad + 10}" stroke="#2B2550" stroke-width="2"/>`;
  for (let v = lo; v <= hi + 1e-9; v += step) s += `<path d="M${X(v)} ${yAx - 5} V${yAx + 5}" stroke="#2B2550" stroke-width="1.6"/><text x="${X(v)}" y="${yAx + 22}" text-anchor="middle" class="m3-ax">${m3N(v)}</text>`;
  rows.forEach((r, i) => { const F = r.F, y = top + i * rowH + rowH / 2 - 6, c = r.col || M3COL[i % 4], hh = 30, a0 = F.wlo ?? F.min, a1 = F.whi ?? F.max;
    if (r.name) s += `<text x="6" y="${y + 6}" class="m3-nm">${r.name}</text>`;
    s += `<path d="M${X(a0)} ${y} H${X(F.q1)} M${X(F.q3)} ${y} H${X(a1)}" stroke="#2B2550" stroke-width="2.4"/><path d="M${X(a0)} ${y - 10} V${y + 10} M${X(a1)} ${y - 10} V${y + 10}" stroke="#2B2550" stroke-width="2.4"/>`;
    s += `<rect x="${X(F.q1)}" y="${y - hh / 2}" width="${Math.max(1, X(F.q3) - X(F.q1))}" height="${hh}" rx="3" fill="${c}" fill-opacity=".32" stroke="#2B2550" stroke-width="2.4"/><path d="M${X(F.q2)} ${y - hh / 2} V${y + hh / 2}" stroke="#2B2550" stroke-width="3"/>`;
    (F.outs || []).forEach(v => { s += `<circle cx="${X(v)}" cy="${y}" r="6" fill="#fff" stroke="#E0445A" stroke-width="2.6"/>`; if (o.labels === 'val') s += `<text x="${X(v)}" y="${y - 14}" text-anchor="middle" class="m3-lb out">${m3N(v)}</text>`; });
    if (o.labels) ['min', 'q1', 'q2', 'q3', 'max'].forEach((k, j) => { const v = k === 'min' ? a0 : k === 'max' ? a1 : F[k], t = o.labels === 'val' ? m3N(v) : o.labels === 'ask' ? (k === o.ask ? '?' : '') : M3KS[k]; if (!t) return; const up = j % 2 === 0; s += `<text x="${X(v)}" y="${up ? y - hh / 2 - 7 : y + hh / 2 + 17}" text-anchor="middle" class="m3-lb${k === o.ask ? ' ask' : ''}">${t}</text>`; }); });
  return `<svg class="m3-box" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
/* vertical box plot (แผนภาพกล่องแนวตั้ง) */
function m3VBoxSVG(F, o = {}) {
  const W = 300, H = o.H || 360, t = 24, b = H - 24, lo = o.lo, hi = o.hi, step = o.step || 5, Y = v => b - (v - lo) / (hi - lo) * (b - t), x0 = 74, cx = 170, bw = 64;
  let s = `<path d="M${x0} ${t - 8} V${b + 8}" stroke="#2B2550" stroke-width="2"/>`;
  for (let v = lo; v <= hi + 1e-9; v += step) s += `<path d="M${x0 - 5} ${Y(v)} H${x0 + 5}" stroke="#2B2550" stroke-width="1.6"/><text x="${x0 - 10}" y="${Y(v) + 5}" text-anchor="end" class="m3-ax">${m3N(v)}</text>`;
  s += `<path d="M${cx} ${Y(F.min)} V${Y(F.q1)} M${cx} ${Y(F.q3)} V${Y(F.max)} M${cx - 14} ${Y(F.min)} H${cx + 14} M${cx - 14} ${Y(F.max)} H${cx + 14}" stroke="#2B2550" stroke-width="2.4"/>`;
  s += `<rect x="${cx - bw / 2}" y="${Y(F.q3)}" width="${bw}" height="${Math.max(1, Y(F.q1) - Y(F.q3))}" rx="3" fill="${o.col || M3COL[0]}" fill-opacity=".32" stroke="#2B2550" stroke-width="2.4"/><path d="M${cx - bw / 2} ${Y(F.q2)} H${cx + bw / 2}" stroke="#2B2550" stroke-width="3"/>`;
  if (o.labels) ['min', 'q1', 'q2', 'q3', 'max'].forEach(k => { const tx = o.labels === 'val' ? m3N(F[k]) : o.labels === 'ask' ? (k === o.ask ? '?' : '') : M3KS[k]; if (tx) s += `<text x="${cx + bw / 2 + 10}" y="${Y(F[k]) + 5}" class="m3-lb${k === o.ask ? ' ask' : ''}">${tx}</text>`; });
  return `<svg class="m3-vbox" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
function m3DotSVG(a, o = {}) {
  const W = o.W || 640, pad = 44, lo = o.lo, hi = o.hi, X = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad), cnt = {}, r = o.r || 7;
  const maxStack = Math.max(...a.map(v => a.filter(x => x === v).length)), H = 40 + maxStack * (2 * r + 2) + 30, yAx = H - 30;
  let s = '';
  if (o.fence) o.fence.forEach((f, k) => { if (f < lo || f > hi) return; s += `<path d="M${X(f)} 6 V${yAx}" stroke="#E0445A" stroke-width="2" stroke-dasharray="6 5"/><text x="${X(f)}" y="18" text-anchor="${k ? 'end' : 'start'}" dx="${k ? -6 : 6}" class="m3-lb out">${m3N(f)}</text>`; });
  s += `<path d="M${pad - 10} ${yAx} H${W - pad + 10}" stroke="#2B2550" stroke-width="2"/>`;
  for (let v = lo; v <= hi; v += o.step || 5) s += `<path d="M${X(v)} ${yAx - 4} V${yAx + 4}" stroke="#2B2550" stroke-width="1.4"/><text x="${X(v)}" y="${yAx + 20}" text-anchor="middle" class="m3-ax">${v}</text>`;
  m3Sort(a).forEach((v, i) => { cnt[v] = (cnt[v] || 0) + 1; const col = o.colOf ? o.colOf(v, i) : '#7C5CE0'; s += `<circle data-i="${i}" cx="${X(v)}" cy="${yAx - 4 - r - (cnt[v] - 1) * (2 * r + 2)}" r="${r}" fill="${col}" stroke="#fff" stroke-width="1.5"/>`; });
  return `<svg class="m3-dot" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
const m3Tiles = (a, cls = '') => `<div class="m3-tiles ${cls}">${a.map(v => v === 'x' ? '<span class="m3-t x">x</span>' : `<span class="m3-t">${m3N(v)}</span>`).join('')}</div>`;
/* แผนภาพต้น-ใบ (stem-and-leaf) of whole numbers 10–99 */
const m3StemHTML = a => { const s = m3Sort(a), st = [...new Set(s.map(v => Math.floor(v / 10)))]; const k = s[0];
  return `<div class="m3-stem"><table><tr><th>ลำต้น</th><th>ใบ</th></tr>${st.map(t => `<tr><td>${t}</td><td>${s.filter(v => Math.floor(v / 10) === t).map(v => v % 10).join('&ensp;')}</td></tr>`).join('')}</table><small>${Math.floor(k / 10)} | ${k % 10} หมายถึง ${k}</small></div>`; };
/* ตารางแจกแจงความถี่ [[ค่า, ความถี่]] */
const m3FreqHTML = (pairs, head = 'คะแนน') => `<div class="m3-out m3-freq"><table><tr><th>${head}</th>${pairs.map(p => `<td>${p[0]}</td>`).join('')}</tr><tr><th>จำนวนคน</th>${pairs.map(p => `<td>${p[1]}</td>`).join('')}</tr></table></div>`;
const m3Expand = pairs => pairs.flatMap(([v, f]) => Array(f).fill(v));
const m3OutTbl = F => `<div class="m3-out"><table><tr><th>n</th><th>ค่าต่ำสุด</th><th>Q₁</th><th>มัธยฐาน</th><th>Q₃</th><th>ค่าสูงสุด</th></tr><tr><td>${F.n}</td><td>${m3N(F.min)}</td><td>${m3N(F.q1)}</td><td>${m3N(F.q2)}</td><td>${m3N(F.q3)}</td><td>${m3N(F.max)}</td></tr></table></div>`;
const m3Fig = html => h('div', { class: 'm3-figbox', html });
const m3Peng = (c = '') => `<svg viewBox="-12 -15 24 31" class="m3-pg ${c}" aria-hidden="true">${PL_PENG}</svg>`;

/* ---------- sims ---------- */
/* เรียงข้อมูล: แตะค่าที่น้อยที่สุดที่ยังเหลือ (การ์ดเพนกวิน) */
function m3SortSim(items, unit = '', done = '') {
  const left = h('div', { class: 'm3-pool' }), row = h('div', { class: 'm3-sorted' }), out = fNote(), wrap = h('div', { class: 'colstack no-side' }, h6wait()); let k = 0; const order = m3Sort(items.map(x => x[1]));
  shuffle(items).forEach(([nm, v]) => { const b = h('button', { class: 'm3-card ia', html: `${m3Peng()}<small>${nm}</small><b>${v}</b>` }); b.onclick = e => { e.stopPropagation(); if (b.classList.contains('used')) return;
    if (v !== order[k]) { sfx.no(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); out.innerHTML = `ยังไม่ใช่ — หาค่าที่<b>น้อยที่สุด</b>ที่ยังเหลือ`; return; }
    k++; b.classList.add('used'); row.append(h('span', { class: 'm3-t in', html: `${v}<i>${k}</i>` })); sfx.pop(k); out.innerHTML = `เรียงแล้ว ${k} จาก ${order.length} ค่า`;
    if (k === order.length) { out.innerHTML = done || `เรียงจากน้อยไปมากครบแล้ว ✓`; sfx.ok(); teachDone(wrap); } }; left.append(b); });
  wrap.append(h('div', { class: 'cap' }, `แตะ${unit}ที่มีค่าน้อยที่สุดที่ยังเหลือทีละตัว`), left, h('div', { class: 'cap' }, 'ข้อมูลที่เรียงแล้ว (ตัวเลขเล็กคือลำดับที่)'), row, out); return wrap;
}
/* แตะหาตัวกลาง: Q2 → Q1 (ข้อมูลที่ต่ำกว่า Q2) → Q3 (ข้อมูลที่สูงกว่า Q2) · ตัวกลางมี 2 ตัวให้แตะทั้งสอง
   o.keys: ['q2'] = หามัธยฐานอย่างเดียว · o.split: หลังหามัธยฐานแล้วระบายสองครึ่ง · o.iqr: แสดง IQR ตอนจบ */
function m3QuartTap(data, o = {}) {
  const F = m3Five(data), a = F.a, n = a.length, h0 = n >> 1, wrap = h('div', { class: 'colstack no-side m3-qt' }, o.game ? '' : h6wait()), tiles = h('div', { class: 'm3-tiles big' }), msg = h('div', { class: 'cap m3-qmsg' }), res = h('div', { class: 'm3-qres' }), out = fNote();
  const els = a.map((v, i) => { const t = h('button', { class: 'm3-t ia', html: `${m3N(v)}<i>${i + 1}</i>` }); t.onclick = e => { e.stopPropagation(); tap(i, t); }; tiles.append(t); return t; });
  const mid = (lo, hi) => { const m = hi - lo; return m % 2 ? [lo + (m - 1) / 2] : [lo + m / 2 - 1, lo + m / 2]; };
  const odd = n % 2 ? ' (ไม่นับมัธยฐาน)' : '';
  const all = [{ key: 'q2', lo: 0, hi: n, name: o.keys && o.keys.length === 1 ? 'มัธยฐาน' : 'Q₂ (มัธยฐาน)', say: `ข้อมูล ${n} ตัว — แตะตัวที่อยู่<b>ตรงกลาง</b>ของข้อมูลทั้งหมด${n % 2 ? '' : ' (มี 2 ตัว แตะทั้งคู่)'}` },
    { key: 'q1', lo: 0, hi: h0, name: 'Q₁', say: `ข้อมูลที่อยู่<b>ต่ำกว่า</b> Q₂ มี ${h0} ตัว${odd} — แตะตัวกลางของช่วงนี้${h0 % 2 ? '' : ' (2 ตัว)'}` },
    { key: 'q3', lo: n - h0, hi: n, name: 'Q₃', say: `ข้อมูลที่อยู่<b>สูงกว่า</b> Q₂ มี ${h0} ตัว${odd} — แตะตัวกลางของช่วงนี้${h0 % 2 ? '' : ' (2 ตัว)'}` }];
  const stages = all.filter(S => !o.keys || o.keys.includes(S.key));
  let st = 0, got = []; const show = () => { const S = stages[st]; els.forEach((t, i) => t.classList.toggle('dim', i < S.lo || i >= S.hi)); msg.innerHTML = S.say; };
  const halves = () => { els.forEach((t, i) => { t.classList.remove('dim', 'pick', 'q2'); t.classList.add(i < h0 ? 'lo' : i >= n - h0 ? 'hi' : 'mid'); }); };
  const finish = () => { els.forEach(t => t.classList.remove('dim')); sfx.ok();
    if (o.split) { halves(); out.innerHTML = `ครึ่งล่าง ${h0} ตัว: <b>${a.slice(0, h0).map(m3N).join(', ')}</b><br>ครึ่งบน ${h0} ตัว: <b>${a.slice(n - h0).map(m3N).join(', ')}</b>${n % 2 ? `<br>มัธยฐาน ${m3N(F.q2)} อยู่ตรงกลาง <b>ไม่นับ</b>ในครึ่งใด` : ''}`; }
    else if (stages.length === 1) out.innerHTML = `มัธยฐาน = <b>${m3N(F.q2)}</b> (ตำแหน่งที่ ${m3N((n + 1) / 2)})`;
    else out.innerHTML = `Q₁ = <b>${m3N(F.q1)}</b>&emsp;Q₂ = <b>${m3N(F.q2)}</b>&emsp;Q₃ = <b>${m3N(F.q3)}</b>` + (o.iqr ? `<br>IQR = Q₃ − Q₁ = ${m3N(F.q3)} − ${m3N(F.q1)} = <b>${m3N(F.q3 - F.q1)}</b>` : '');
    msg.innerHTML = 'หาครบแล้ว ✓'; o.onDone ? o.onDone() : teachDone(wrap); };
  const tap = (i, t) => { if (st >= stages.length) return; const S = stages[st], want = mid(S.lo, S.hi);
    if (!want.includes(i)) { if (i < S.lo || i >= S.hi) { msg.innerHTML = `ตัวนี้อยู่นอกช่วงที่กำลังหา — ${S.say}`; } sfx.no(); t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); o.onWrong && o.onWrong(); return; }
    if (got.includes(i)) return; got.push(i); t.classList.add('pick', S.key); sfx.pop(got.length + st * 2);
    if (got.length < want.length) { msg.innerHTML = `ถูกแล้ว — แตะอีกตัวที่อยู่ตรงกลางด้วย`; return; }
    const v = F[S.key]; res.append(h('div', { class: 'm3-qr ' + S.key, html: `<b>${S.name}</b> = ${want.length > 1 ? `(${m3N(a[want[0]])} + ${m3N(a[want[1]])}) ÷ 2 = ` : ''}<b>${m3N(v)}</b>` })); got = []; st++;
    if (st < stages.length) return show(); finish(); };
  show(); wrap.append(h('div', { class: 'cap' }, o.cap || 'ข้อมูลเรียงจากน้อยไปมากแล้ว (ตัวเลขเล็กมุมขวาคือลำดับที่)'), tiles, msg, res, out);
  wrap.reveal = () => { while (st < stages.length) { const S = stages[st]; mid(S.lo, S.hi).forEach(i => els[i].classList.add('pick', S.key)); res.append(h('div', { class: 'm3-qr ' + S.key, html: `<b>${S.name}</b> = <b>${m3N(F[S.key])}</b>` })); st++; } els.forEach(t => t.classList.remove('dim')); };
  return wrap;
}
/* ตำแหน่งของควอร์ไทล์: แตะจำนวนข้อมูล n แล้วดูว่า Q1 Q2 Q3 อยู่ตรงไหน */
function m3PosSim(ns) {
  const wrap = h('div', { class: 'colstack no-side' }, h6wait()), fig = h('div', { class: 'm3-figbox big' }), out = fNote(), seen = new Set();
  const draw = n => { const P = m3Pos(n), W = 640, gap = Math.min(44, (W - 60) / n), x0 = (W - gap * (n - 1)) / 2, X = p => x0 + (p - 1) * gap; let s = '';
    for (let i = 1; i <= n; i++) { const lo = i <= P.h, hi = i > n - P.h, c = lo ? '#CFE6FA' : hi ? '#FBD9E3' : '#E6E2F0'; s += `<circle cx="${X(i)}" cy="70" r="${gap * .4}" fill="${c}" stroke="#2B2550" stroke-width="1.6"/><text x="${X(i)}" y="76" text-anchor="middle" class="m3-ax">${i}</text>`; }
    [['q1', '#F7B733', 'Q₁'], ['q2', '#E36A8C', 'Q₂'], ['q3', '#7C5CE0', 'Q₃']].forEach(([k, c, t], j) => { const x = X(P[k]); s += `<path d="M${x} 30 V${70 - gap * .4 - 2}" stroke="${c}" stroke-width="3"/><path d="M${x} 32 l-7 -12 h14 z" fill="${c}"/><text x="${x}" y="14" text-anchor="middle" class="m3-lb">${t}</text>`; });
    s += `<text x="${W / 2}" y="118" text-anchor="middle" class="m3-nm">ข้อมูล ${n} ตัว · ครึ่งละ ${P.h} ตัว${n % 2 ? ' (ไม่นับตัวกลาง)' : ''}</text>`;
    fig.innerHTML = `<svg class="m3-box" viewBox="0 0 ${W} 130" aria-hidden="true">${s}</svg>`;
    out.innerHTML = `Q₂ = ${m3PosTxt(P.q2)}<br>Q₁ = ${m3PosTxt(P.q1)}&emsp;Q₃ = ${m3PosTxt(P.q3)}`; };
  const row = h('div', { class: 'rowstack m3-parts' }, ...ns.map((n, k) => h('button', { class: 'btn ia m3-part', style: { '--pc': M3COL[k % 4] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(n); draw(n); sfx.pop(k + 2); if (seen.size === ns.length) { out.innerHTML += '<br>ตัวกลางมี 2 ตัวเมื่อไร ให้หา<b>ค่าเฉลี่ย</b>ของสองตัวนั้น'; teachDone(wrap); } } }, `n = ${n}`)));
  wrap.append(h('div', { class: 'cap' }, 'แตะจำนวนข้อมูลทีละปุ่ม แล้วดูตำแหน่งของ Q₁ Q₂ Q₃'), row, fig, out); draw(ns[0]); out.innerHTML = 'แตะปุ่มด้านบน'; return wrap;
}
/* ค่าที่ไม่ทราบ x: แตะค่าที่เป็นไปได้ แล้วดูว่า Q ที่ได้ตรงกับที่โจทย์บอกไหม (o.boxT = ให้แผนภาพกล่องเป้าหมาย) */
function m3XSim({ arr, key, target, cands, boxT }) {
  const wrap = h('div', { class: 'colstack no-side' }, h6wait()), out = fNote(), list = h('div', { class: 'm3-qres' }), fig = boxT ? h('div', { class: 'm3-figbox' }) : null, nm = { q1: 'Q₁', q2: 'มัธยฐาน', q3: 'Q₃' }[key]; let ok = false;
  const ax = boxT ? m3Axis(boxT) : null, drawB = G => { if (fig) fig.innerHTML = m3BoxSVG([{ F: boxT, name: 'โจทย์' }, ...(G ? [{ F: G, name: 'ข้อมูลของเรา', col: M3COL[1] }] : [])], { ...ax, labels: 'val' }); };
  const row = h('div', { class: 'rowstack m3-parts' }, ...cands.map(c => h('button', { class: 'btn ia m3-part', onclick: e => { e.stopPropagation(); if (ok) return; const G = m3Five(arr.map(v => v === 'x' ? c : v)), v = G[key], hit = Math.abs(v - target) < 1e-9; e.currentTarget.classList.add(hit ? 'on' : 'no');
    list.append(h('div', { class: 'm3-qr ' + (hit ? 'q3' : 'q2'), html: `x = ${c} → ${nm} = <b>${m3N(v)}</b> ${hit ? '✓' : '✗'}` })); drawB(G);
    if (hit) { ok = true; sfx.ok(); out.innerHTML = `x = <b>${c}</b> ทำให้${nm} = ${m3N(target)} พอดี`; teachDone(wrap); } else sfx.no(); } }, `x = ${c}`)));
  wrap.append(h('div', { class: 'cap', html: `ข้อมูลเรียงจากน้อยไปมาก มี x หนึ่งตัว · โจทย์บอกว่า <b>${nm} = ${m3N(target)}</b>` }), h('div', { class: 'm3-datab', html: m3Tiles(arr) }), ...(fig ? [fig] : []), h('div', { class: 'cap' }, 'แตะค่าของ x ที่เป็นไปได้ทีละค่า'), row, list, out);
  drawB(null); return wrap;
}
/* IQR ไม่ขึ้นกับค่าปลาย: เปลี่ยนค่าสูงสุด / ต่ำสุด แล้วเทียบพิสัยกับ IQR */
function m3IqrSim(data, changes) {
  let a = data.slice(); const wrap = h('div', { class: 'colstack no-side' }, h6wait()), fig = h('div', { class: 'm3-figbox big' }), tbl = h('div', { class: 'm3-out' }), out = fNote(), seen = new Set(); const all = [...data, ...changes.map(c => c[1])], ax = m3Axis({ min: Math.min(...all), max: Math.max(...all) });
  const draw = () => { const F = m3Five(a); fig.innerHTML = m3BoxSVG([{ F }], { ...ax, labels: 'val', band: [F.q1, F.q3, '#BFE3F7'] }); tbl.innerHTML = `<table><tr><th>ข้อมูล</th><td style="font-size:.85em">${F.a.join(', ')}</td></tr><tr><th>พิสัย</th><td>${m3N(F.max)} − ${m3N(F.min)} = <b>${m3N(F.max - F.min)}</b></td></tr><tr><th>IQR</th><td>${m3N(F.q3)} − ${m3N(F.q1)} = <b>${m3N(F.q3 - F.q1)}</b></td></tr></table>`; };
  const row = h('div', { class: 'rowstack m3-parts' }, ...changes.map(([lab, nv, which], k) => h('button', { class: 'btn ia m3-part', style: { '--pc': M3COL[k % 4] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(k); a = data.slice(); const s = m3Sort(a); const idx = a.indexOf(which === 'max' ? s[s.length - 1] : s[0]); a[idx] = nv; draw(); sfx.pop(k + 2);
    out.innerHTML = `${lab}: พิสัยเปลี่ยน แต่ <b>IQR เท่าเดิม</b>`; if (seen.size === changes.length) { out.innerHTML += '<br>IQR ดูเฉพาะข้อมูลครึ่งกลาง (50%) จึง<b>ไม่ถูกค่าสุดโต่งดึง</b>'; teachDone(wrap); } } }, lab)));
  draw(); wrap.append(h('div', { class: 'cap' }, 'แตะปุ่มเปลี่ยนค่าปลาย แล้วเทียบพิสัยกับ IQR'), row, fig, tbl, out); return wrap;
}
/* อ่านแผนภาพกล่อง: แตะทั้ง 5 ค่า ดูว่ามีข้อมูลประมาณกี่ % (กี่คน) ที่ไม่เกินค่านั้น */
function m3ReadSim(F, N, unit, what) {
  const ax = m3Ax5(F), wrap = h('div', { class: 'colstack no-side' }, h6wait()), fig = h('div', { class: 'm3-figbox big' }), out = fNote(), seen = new Set(), P = { min: 0, q1: 25, q2: 50, q3: 75, max: 100 };
  const draw = k => { fig.innerHTML = m3BoxSVG([{ F }], { ...ax, labels: 'val', band: k ? [F.min, F[k], '#FFE27A'] : null }); };
  const row = h('div', { class: 'rowstack m3-parts' }, ...['min', 'q1', 'q2', 'q3', 'max'].map((k, j) => h('button', { class: 'btn ia m3-part', style: { '--pc': M3COL[j % 4] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(k); draw(k); sfx.pop(j + 2);
    out.innerHTML = k === 'min' ? `${what}ต่ำสุดคือ <b>${m3N(F.min)} ${unit}</b>` : k === 'max' ? `${what}สูงสุดคือ <b>${m3N(F.max)} ${unit}</b> — ทั้ง ${N} คน (100%) ได้ไม่เกินค่านี้` : `ประมาณ <b>${P[k]}%</b> ของ ${N} คน = <b>${N * P[k] / 100} คน</b> ได้${what}ไม่เกิน ${m3N(F[k])} ${unit}`;
    if (seen.size === 5) teachDone(wrap); } }, M3KS[k])));
  draw(null); wrap.append(h('div', { class: 'cap' }, `${what}ของนักเรียน ${N} คน (ข้อมูลสมมติ) — แตะทีละค่า`), fig, row, out); return wrap;
}
/* ข้อมูลแต่ละส่วนของแผนภาพกล่องมีประมาณ 25% — แตะแต่ละส่วนดูว่าจุดข้อมูลอยู่ใกล้กันหรือห่างกัน */
function m3QuarterSim(data) {
  const F = m3Five(data), ax = m3Axis(F), wrap = h('div', { class: 'colstack no-side' }, h6wait()), dots = h('div', { class: 'm3-figbox big' }), box = h('div', { class: 'm3-figbox big' }), out = fNote(), seen = new Set();
  const parts = [['ส่วนที่ 1', F.min, F.q1], ['ส่วนที่ 2', F.q1, F.q2], ['ส่วนที่ 3', F.q2, F.q3], ['ส่วนที่ 4', F.q3, F.max]];
  const paint = k => { dots.innerHTML = m3DotSVG(F.a, { ...ax, colOf: v => k == null ? '#B9B2D6' : (v >= parts[k][1] && v <= parts[k][2]) ? M3COL[k] : '#D9D4EA' }); box.innerHTML = m3BoxSVG([{ F }], { ...ax, W: 640, labels: 'val', band: k == null ? null : [parts[k][1], parts[k][2], M3COL[k]] }); };
  paint(null);
  const row = h('div', { class: 'rowstack m3-parts' }, ...parts.map(([nm, a, b], k) => h('button', { class: 'btn ia m3-part', style: { '--pc': M3COL[k] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(k); paint(k); sfx.pop(k + 2);
    out.innerHTML = `${nm}: จาก ${m3N(a)} ถึง ${m3N(b)} ยาว <b>${m3N(b - a)}</b> — มีข้อมูลประมาณ <b>25%</b>`;
    if (seen.size === 4) { const L = parts.map(p => p[2] - p[1]), sh = L.indexOf(Math.min(...L)), lg = L.indexOf(Math.max(...L)); out.innerHTML += `<br>${parts[sh][0]}สั้นที่สุด → ข้อมูล<b>กระจุกตัว</b>มากที่สุด<br>${parts[lg][0]}ยาวที่สุด → ข้อมูล<b>กระจาย</b>มากที่สุด`; teachDone(wrap); } } }, nm)));
  wrap.append(box, dots, row, out); return wrap;
}
/* เปรียบเทียบแผนภาพกล่องสองชุด: แตะทีละหัวข้อ */
function m3CmpSim(A, B, na, nb, unit) {
  const ax = m3AxisAll([A, B]), wrap = h('div', { class: 'colstack no-side' }, h6wait()), fig = h('div', { class: 'm3-figbox big' }), out = fNote(), seen = new Set(), ia = A.q3 - A.q1, ib = B.q3 - B.q1, ra = A.max - A.min, rb = B.max - B.min;
  const who = (x, y, big) => x === y ? 'เท่ากัน' : (x > y) === big ? na : nb;
  const items = [['มัธยฐาน', [Math.min(A.q2, B.q2), Math.max(A.q2, B.q2)], `มัธยฐาน ${na} = ${m3N(A.q2)}&emsp;${nb} = ${m3N(B.q2)} → <b>${who(A.q2, B.q2, true)}</b> มีค่ากลางสูงกว่า`],
    ['Q₁', [Math.min(A.q1, B.q1), Math.max(A.q1, B.q1)], `Q₁ ${na} = ${m3N(A.q1)}&emsp;${nb} = ${m3N(B.q1)} → 75% ของ<b>${who(A.q1, B.q1, true)}</b>ได้ตั้งแต่ ${m3N(Math.max(A.q1, B.q1))} ${unit}ขึ้นไป`],
    ['ความยาวกล่อง (IQR)', null, `IQR ${na} = ${m3N(ia)}&emsp;${nb} = ${m3N(ib)} → ข้อมูลกลุ่มกลางของ<b>${who(ia, ib, true)}</b>กระจายมากกว่า`],
    ['พิสัย', null, `พิสัย ${na} = ${m3N(ra)}&emsp;${nb} = ${m3N(rb)} → ข้อมูลโดยรวมของ<b>${who(ra, rb, true)}</b>กระจายมากกว่า`]];
  const draw = k => { fig.innerHTML = m3BoxSVG([{ F: A, name: na }, { F: B, name: nb, col: M3COL[1] }], { ...ax, labels: 'val', band: k != null && items[k][1] ? [...items[k][1], '#FFE27A'] : null }); };
  const row = h('div', { class: 'rowstack m3-parts' }, ...items.map(([lab, , txt], k) => h('button', { class: 'btn ia m3-part', style: { '--pc': M3COL[k % 4] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(k); draw(k); sfx.pop(k + 2); out.innerHTML = txt; if (seen.size === items.length) teachDone(wrap); } }, lab)));
  draw(null); wrap.append(fig, h('div', { class: 'cap' }, 'แตะทีละหัวข้อเพื่อเปรียบเทียบ'), row, out); return wrap;
}
/* ค่านอกเกณฑ์: ① IQR ② ขอบเขตล่าง/บน ③ แตะจุดที่อยู่นอกขอบเขต → แผนภาพกล่องแบบมีค่านอกเกณฑ์ */
function m3OutSim(data) {
  const F = m3FiveO(data), ax = m3Axis(F), wrap = h('div', { class: 'colstack no-side' }, h6wait()), dots = h('div', { class: 'm3-figbox big m3-otap ia' }), box = h('div', { class: 'm3-figbox big' }), out = fNote(); let step = 0; const found = new Set();
  const colOf = (v, i) => found.has(i) ? '#E0445A' : step >= 2 && (v < F.lo || v > F.hi) ? '#7C5CE0' : step >= 2 ? '#B9B2D6' : '#7C5CE0';
  const draw = () => { dots.innerHTML = m3DotSVG(F.a, { ...ax, r: 9, colOf, fence: step >= 2 ? [F.lo, F.hi] : null }); box.innerHTML = m3BoxSVG([{ F: found.size === F.outs.length && step >= 2 ? F : { ...F, wlo: undefined, whi: undefined, outs: [] } }], { ...ax, W: 640, labels: 'val' }); };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); step++; sfx.pop(step + 1);
    if (step === 1) { out.innerHTML = `① IQR = Q₃ − Q₁ = ${m3N(F.q3)} − ${m3N(F.q1)} = <b>${m3N(F.iqr)}</b>`; }
    if (step === 2) { btn.remove(); out.innerHTML = `② ขอบเขตล่าง = Q₁ − 1.5 × IQR = ${m3N(F.q1)} − ${m3N(1.5 * F.iqr)} = <b>${m3N(F.lo)}</b><br>&emsp;ขอบเขตบน = Q₃ + 1.5 × IQR = ${m3N(F.q3)} + ${m3N(1.5 * F.iqr)} = <b>${m3N(F.hi)}</b><br>③ <b>แตะจุดที่อยู่นอกเส้นประสีแดง</b>`; }
    draw(); } }, icon('right'), 'ขั้นต่อไป');
  dots.addEventListener('click', e => { e.stopPropagation(); if (step < 2) return; const c = e.target.closest && e.target.closest('circle[data-i]'); if (!c) return; const i = +c.dataset.i, v = F.a[i];
    if (v >= F.lo && v <= F.hi) { sfx.no(); out.innerHTML = `${m3N(v)} อยู่ระหว่าง ${m3N(F.lo)} ถึง ${m3N(F.hi)} — <b>ไม่ใช่</b>ค่านอกเกณฑ์`; return; }
    if (found.has(i)) return; found.add(i); sfx.pop(found.size + 3); draw();
    if (found.size === F.outs.length) { sfx.ok(); out.innerHTML = `ค่านอกเกณฑ์คือ <b>${F.outs.map(m3N).join(', ')}</b> — ในแผนภาพกล่องเขียนเป็น<b>จุด</b><br>วิสเกอร์ลากถึง <b>${m3N(F.wlo)}</b> และ <b>${m3N(F.whi)}</b> (ค่าที่ไกลที่สุดที่ไม่ใช่ค่านอกเกณฑ์)`; teachDone(wrap); } else out.innerHTML = `ถูกต้อง — ยังมีอีก ${F.outs.length - found.size} จุด`; });
  draw(); out.innerHTML = `Q₁ = ${m3N(F.q1)}&emsp;Q₃ = ${m3N(F.q3)} — กด <b>ขั้นต่อไป</b>`; wrap.append(dots, box, btn, out); return wrap;
}
/* แผนภาพกล่องที่ค่อย ๆ วาด + ไฮไลต์ (ด่าน 6)
   o.show: ค่าที่วาดแล้ว (min q1 q2 q3 max) · o.hl: ส่วนที่ไฮไลต์ (min q1 q2 q3 max lw rw box) · o.fresh: ส่วนที่เพิ่งวาด (เล่นแอนิเมชัน)
   o.dots: ข้อมูล → แผนภาพจุดด้านบน (o.dotHL(v) = สีจุด) · o.marks: จุดเล็กที่ 5 ค่า · o.quarters: แถบ 4 ส่วน · o.names: ป้ายชื่อ + ค่า */
function m3BoxHL(F, ax, o = {}) {
  const W = 640, pad = 44, X = v => pad + (v - ax.lo) / (ax.hi - ax.lo) * (W - 2 * pad), dt = o.dots ? 64 : 0, y = 62 + dt, hh = 34, yAx = y + 56, H = yAx + 32;
  const S = new Set(o.show || []), HL = new Set(o.hl || []), FR = new Set(o.fresh || []), HC = '#FFD43B';
  const seg = (d, part, w = 2.6) => (HL.has(part) ? `<path d="${d}" class="m3-halo" stroke="${HC}" stroke-width="15" stroke-linecap="round" fill="none"/>` : '') + `<path d="${d}" pathLength="1" class="${FR.has(part) ? 'm3-draw' : ''}" stroke="#2B2550" stroke-width="${w}" fill="none"/>`;
  let s = '';
  if (o.quarters) { const b = [F.min, F.q1, F.q2, F.q3, F.max], qc = ['#CFE6FA', '#FFE7A3', '#FBD9E3', '#D7F2E8'];
    for (let i = 0; i < 4; i++) s += `<rect class="m3-fade" x="${X(b[i])}" y="${y - hh / 2 - 30}" width="${Math.max(2, X(b[i + 1]) - X(b[i]))}" height="${yAx - y + hh / 2 + 30}" fill="${qc[i]}" opacity=".85"/><text x="${(X(b[i]) + X(b[i + 1])) / 2}" y="${y - hh / 2 - 9}" text-anchor="middle" class="m3-lb">≈25%</text>`; }
  if (o.axis !== false) { s += `<path d="M${pad - 10} ${yAx} H${W - pad + 10}" stroke="#2B2550" stroke-width="2" pathLength="1" class="${FR.has('axis') ? 'm3-draw' : ''}"/>`;
    for (let v = ax.lo; v <= ax.hi + 1e-9; v += ax.step) s += `<g class="${FR.has('axis') ? 'm3-fade' : ''}"><path d="M${X(v)} ${yAx - 5} V${yAx + 5}" stroke="#2B2550" stroke-width="1.6"/><text x="${X(v)}" y="${yAx + 22}" text-anchor="middle" class="m3-ax">${m3N(v)}</text></g>`; }
  if (o.dots) { const cnt = {}; m3Sort(o.dots).forEach(v => { cnt[v] = (cnt[v] || 0) + 1; const c = o.dotHL ? o.dotHL(v) : '#7C5CE0'; s += `<circle cx="${X(v)}" cy="${dt + 2 - (cnt[v] - 1) * 18}" r="8" fill="${c}" stroke="#fff" stroke-width="1.5"/>`; });
}
  if (S.has('q1') && S.has('q3')) s += (HL.has('box') ? `<rect x="${X(F.q1) - 6}" y="${y - hh / 2 - 6}" width="${X(F.q3) - X(F.q1) + 12}" height="${hh + 12}" rx="8" fill="${HC}" class="m3-halo"/>` : '') + `<rect class="${FR.has('box') ? 'm3-fade' : ''}" x="${X(F.q1)}" y="${y - hh / 2}" width="${Math.max(1, X(F.q3) - X(F.q1))}" height="${hh}" fill="#3D9BE9" fill-opacity=".3"/>` + seg(`M${X(F.q1)} ${y - hh / 2} H${X(F.q3)} M${X(F.q1)} ${y + hh / 2} H${X(F.q3)}`, 'box', 2.6);
  if (S.has('min') && S.has('q1')) s += seg(`M${X(F.min)} ${y} H${X(F.q1)}`, 'lw');
  if (S.has('q3') && S.has('max')) s += seg(`M${X(F.q3)} ${y} H${X(F.max)}`, 'rw');
  if (S.has('min')) s += seg(`M${X(F.min)} ${y - 11} V${y + 11}`, 'min');
  if (S.has('max')) s += seg(`M${X(F.max)} ${y - 11} V${y + 11}`, 'max');
  ['q1', 'q3'].forEach(k => { if (S.has(k)) s += seg(`M${X(F[k])} ${y - hh / 2} V${y + hh / 2}`, k); });
  if (S.has('q2')) s += seg(`M${X(F.q2)} ${y - hh / 2} V${y + hh / 2}`, 'q2', 3.2);
  if (o.marks) M3K5.forEach(k => { s += `<circle class="${FR.has('marks') ? 'm3-fade' : ''}" cx="${X(F[k])}" cy="${y}" r="6" fill="#7C5CE0" stroke="#fff" stroke-width="2"/>`; });
  M3K5.forEach((k, j) => { if (!(S.has(k) || o.marks) || o.names === false) return; const up = j % 2 === 0, ty = up ? y - hh / 2 - 9 : y + hh / 2 + 19, t = `${o.names ? M3KS[k] + ' ' : ''}${m3N(F[k])}`, on = HL.has(k);
    if (on) { const w = t.length * 8.6 + 14; s += `<rect x="${X(F[k]) - w / 2}" y="${ty - 17}" width="${w}" height="23" rx="11.5" fill="${HC}"/>`; }
    s += `<text x="${X(F[k])}" y="${ty}" text-anchor="middle" class="m3-lb${FR.has(k) ? ' m3-fade' : ''}">${t}</text>`; });
  return `<svg class="m3-box m3-hlbox" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
const M3K5 = ['min', 'q1', 'q2', 'q3', 'max'];
/* ตำแหน่ง (เริ่ม 0) ของข้อมูลที่ให้ค่า k — ตัวกลางมี 2 ตัวได้ 2 ตำแหน่ง */
const m3IdxOf = (n, k) => { const P = m3Pos(n), p = k === 'min' ? 1 : k === 'max' ? n : P[k]; return [...new Set([Math.floor(p) - 1, Math.ceil(p) - 1])]; };
const m3TileRow = (a, mark = {}) => `<div class="m3-tiles ${a.length > 11 ? '' : 'big'}">${a.map((v, i) => `<span class="m3-t ${mark[i] || ''}">${m3N(v)}<i>${i + 1}</i></span>`).join('')}</div>`;
/* แผนภาพกล่องคืออะไร: แตะ กล่อง / เส้นในกล่อง / วิสเกอร์ / 4 ส่วน */
function m3BoxWhat(data) {
  const F = m3Five(data), ax = m3Axis(F), wrap = h('div', { class: 'colstack no-side' }, h6wait()), fig = h('div', { class: 'm3-figbox big' }), out = fNote(), seen = new Set(), all = M3K5;
  const Y = '#FFC21A', G = '#CFCBDF', P = '#7C5CE0'; const tip = h('div', { class: 'cap', html: 'แตะแต่ละปุ่มเพื่อดูว่าส่วนนั้นคืออะไร' });
  const view = { box: { hl: ['box', 'q1', 'q3'], dot: v => v >= F.q1 && v <= F.q3 ? Y : G, txt: `<b>กล่อง</b> เริ่มที่ Q₁ = ${m3N(F.q1)} จบที่ Q₃ = ${m3N(F.q3)} — ข้อมูล<b>ช่วงกลาง</b>ประมาณครึ่งหนึ่ง (50%) อยู่ในกล่อง` },
    q2: { hl: ['q2'], dot: v => v === F.q2 ? Y : v < F.q2 ? '#8EC5F2' : '#F2A7BE', txt: `<b>เส้นในกล่อง</b> คือ Q₂ หรือมัธยฐาน = ${m3N(F.q2)} — ข้อมูลครึ่งหนึ่งอยู่ทางซ้าย อีกครึ่งหนึ่งอยู่ทางขวา` },
    wh: { hl: ['lw', 'rw', 'min', 'max'], dot: v => v < F.q1 || v > F.q3 ? Y : G, txt: `<b>วิสเกอร์</b> (whisker แปลว่า หนวด) คือเส้นที่ยื่นออกจากกล่อง 2 ข้าง ด้านซ้ายยื่นไปถึง<b>ค่าต่ำสุด</b> ${m3N(F.min)}&emsp;ด้านขวายื่นไปถึง<b>ค่าสูงสุด</b> ${m3N(F.max)}` },
    qt: { hl: [], quarters: true, dot: () => P, txt: `ค่าทั้ง 5 แบ่งข้อมูลเป็น <b>4 ส่วน</b> แต่ละส่วนมีข้อมูลประมาณ <b>25%</b> — ส่วนที่ยาวกว่า<b>ไม่ได้</b>แปลว่ามีข้อมูลมากกว่า แต่แปลว่าข้อมูลกระจายห่างกันกว่า` } };
  const draw = (k, fr) => { const V = view[k] || {}; fig.innerHTML = m3BoxHL(F, ax, { show: all, dots: F.a, dotHL: V.dot, hl: V.hl, quarters: V.quarters, names: V.quarters ? false : true, fresh: fr }); };
  const row = h('div', { class: 'rowstack m3-parts' }, ...[['box', 'กล่อง'], ['q2', 'เส้นในกล่อง'], ['wh', 'วิสเกอร์'], ['qt', 'แบ่งเป็น 4 ส่วน']].map(([k, t], j) => h('button', { class: 'btn ia m3-part', style: { '--pc': M3COL[j % 4] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(k); draw(k); out.innerHTML = view[k].txt; sfx.pop(seen.size + 1);
    if (seen.size === 4) { tip.innerHTML = '✓ แผนภาพกล่องสรุปข้อมูลทั้งชุดด้วย <b>5 ค่า</b>: ค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด'; teachDone(wrap); } } }, t)));
  wrap.append(h('div', { class: 'cap', html: `ระยะไถลของเพนกวิน ${F.n} ตัว (เมตร) — จุดด้านบนคือข้อมูลแต่ละตัว ด้านล่างคือ<b>แผนภาพกล่อง</b> (box plot)` }), fig, tip, row, out);
  draw(''); out.innerHTML = 'แผนภาพกล่องมี <b>กล่อง</b> 1 กล่อง และ<b>เส้น</b>ยื่นออกมา 2 ข้าง'; return wrap;
}
/* วาดแผนภาพกล่องทีละขั้น: หา 5 ค่า → เส้นจำนวน → จุด 5 ค่า → กล่อง + Q₂ → วิสเกอร์ */
function m3DrawWalk(data) {
  const F = m3Five(data), ax = m3Axis(F), n = F.n, wrap = h('div', { class: 'colstack no-side' }, h6wait()), tl = h('div', { class: 'm3-datab' }), fig = h('div', { class: 'm3-figbox big' }), out = fNote(), list = h('div', { class: 'colstack fstory' }); let k = 0;
  const mk = {}; M3K5.forEach(q => m3IdxOf(n, q).forEach(i => mk[i] = 'pick hl'));
  const steps = [
    ['① หา 5 ค่า', `ค่าต่ำสุด ${m3N(F.min)}&emsp;Q₁ ${m3N(F.q1)}&emsp;Q₂ ${m3N(F.q2)}&emsp;Q₃ ${m3N(F.q3)}&emsp;ค่าสูงสุด ${m3N(F.max)}`, () => { tl.innerHTML = m3TileRow(F.a, mk); fig.innerHTML = ''; }],
    ['② เขียนเส้นจำนวน', `สเกลต้องครอบคลุม ${m3N(F.min)} ถึง ${m3N(F.max)} และแบ่งช่องเท่า ๆ กัน`, () => { fig.innerHTML = m3BoxHL(F, ax, { fresh: ['axis'] }); }],
    ['③ ทำจุดที่ 5 ค่า', 'วางจุดเหนือเส้นจำนวนตรงค่าทั้ง 5', () => { fig.innerHTML = m3BoxHL(F, ax, { marks: true, fresh: ['marks'], hl: M3K5 }); }],
    ['④ เขียนกล่อง', 'กล่องเริ่มที่ Q₁ จบที่ Q₃ และขีดเส้นในกล่องที่ Q₂', () => { fig.innerHTML = m3BoxHL(F, ax, { marks: true, show: ['q1', 'q2', 'q3'], fresh: ['q1', 'q2', 'q3', 'box'], hl: ['box', 'q1', 'q2', 'q3'] }); }],
    ['⑤ เขียนวิสเกอร์', 'ลากเส้นจากกล่องไปถึงค่าต่ำสุดและค่าสูงสุด', () => { fig.innerHTML = m3BoxHL(F, ax, { show: M3K5, fresh: ['lw', 'rw', 'min', 'max'], hl: ['lw', 'rw', 'min', 'max'] }); }]];
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, body, fn] = steps[k]; list.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: body }))); fn(); sfx.pop(k); k++;
    if (k >= steps.length) { btn.remove(); out.innerHTML = '<b>ได้แผนภาพกล่องแล้ว</b> ✓'; sfx.ok(); teachDone(wrap); } } }, icon('right'), 'ขั้นต่อไป');
  tl.innerHTML = m3TileRow(F.a);
  wrap.append(h('div', { class: 'cap' }, `ข้อมูล ${n} ตัว เรียงจากน้อยไปมากแล้ว`), tl, fig, list, btn, out); return wrap;
}
/* ส่วนประกอบของแผนภาพกล่อง: แตะทีละค่าตามลำดับ แผนภาพค่อย ๆ ขึ้นมาทีละส่วน (ส่วนที่เพิ่งขึ้นจะถูกไฮไลต์) */
function m3BoxParts(data) {
  const F = m3Five(data), ax = m3Axis(F), wrap = h('div', { class: 'colstack no-side' }, h6wait()), tl = h('div', { class: 'm3-datab' }), fig = h('div', { class: 'm3-figbox big' }), out = fNote(), shown = [], mk = {};
  const part = { min: ['min'], q1: ['q1', 'lw'], q2: ['q2'], q3: ['q3', 'box'], max: ['max', 'rw'] };
  const txt = { min: `<b>ค่าต่ำสุด</b> = ${m3N(F.min)} → ขีดเส้นสั้นที่ปลายด้านซ้าย`, q1: `<b>Q₁</b> = ${m3N(F.q1)} → ขอบซ้ายของกล่อง และ<b>วิสเกอร์ด้านซ้าย</b>ลากจากค่าต่ำสุดมาถึงกล่อง`, q2: `<b>Q₂ (มัธยฐาน)</b> = ${m3N(F.q2)} → เส้นตรงในกล่อง`, q3: `<b>Q₃</b> = ${m3N(F.q3)} → ขอบขวาของกล่อง ได้<b>กล่อง</b>จาก Q₁ ถึง Q₃`, max: `<b>ค่าสูงสุด</b> = ${m3N(F.max)} → <b>วิสเกอร์ด้านขวา</b>ลากจากกล่องไปถึงค่าสูงสุด` };
  const btns = M3K5.map((k, j) => h('button', { class: 'btn ia m3-part' + (j ? ' lock' : ' next'), style: { '--pc': M3COL[j % 4] }, onclick: e => { e.stopPropagation(); const b = e.currentTarget; if (shown.length !== j) { if (j > shown.length) { sfx.no(); out.innerHTML = `แตะ <b>${M3KS[M3K5[shown.length]]}</b> ก่อน`; } return; }
    shown.push(k); b.classList.remove('next'); b.classList.add('on'); if (btns[j + 1]) btns[j + 1].classList.replace('lock', 'next');
    Object.keys(mk).forEach(i => mk[i] = 'got'); m3IdxOf(F.n, k).forEach(i => mk[i] = 'pick hl'); tl.innerHTML = m3TileRow(F.a, mk);
    fig.innerHTML = m3BoxHL(F, ax, { show: shown, hl: [...part[k], k], fresh: part[k], names: true }); out.innerHTML = txt[k]; sfx.pop(shown.length + 1);
    if (shown.length === 5) { out.innerHTML = txt[k] + '&emsp;✓ ครบ 5 ค่าแล้ว'; teachDone(wrap); } } }, M3KS[k]));
  tl.innerHTML = m3TileRow(F.a); fig.innerHTML = m3BoxHL(F, ax, {});
  wrap.append(h('div', { class: 'cap' }, `ข้อมูล ${F.n} ตัว เรียงแล้ว — แตะทีละค่าตามลำดับ แล้วดูแผนภาพกล่องค่อย ๆ ขึ้นมา`), tl, fig, h('div', { class: 'rowstack m3-parts' }, ...btns), out); out.innerHTML = 'เริ่มที่ <b>ค่าต่ำสุด</b>'; return wrap;
}
/* สร้างแผนภาพกล่องเอง: ลากจุดทั้ง 5 ไปวางให้ตรงค่า */
function m3BoxBuild(data, o = {}) {
  const F = m3Five(data), ax = m3Axis(F), W = 640, pad = 44, X = v => pad + (v - ax.lo) / (ax.hi - ax.lo) * (W - 2 * pad), V = x => ax.lo + (x - pad) / (W - 2 * pad) * (ax.hi - ax.lo), y = 70, NS = 'http://www.w3.org/2000/svg';
  const keys = ['min', 'q1', 'q2', 'q3', 'max'], cur = { min: ax.lo + (ax.hi - ax.lo) * .1, q1: ax.lo + (ax.hi - ax.lo) * .3, q2: ax.lo + (ax.hi - ax.lo) * .5, q3: ax.lo + (ax.hi - ax.lo) * .7, max: ax.lo + (ax.hi - ax.lo) * .9 };
  Object.keys(cur).forEach(k => cur[k] = Math.round(cur[k] * 2) / 2);
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} 150`); svg.setAttribute('class', 'm3-build ia'); let drag = null, done = false;
  const wrap = h('div', { class: 'colstack no-side m3-bb rvl' }, o.game ? '' : h6wait()), out = fNote2(), chk = h('button', { class: 'btn primary ia' }, icon('check'), h('span', null, 'ตรวจแผนภาพกล่อง'));
  const draw = () => { const v = keys.map(k => cur[k]); let s = `<path d="M${pad - 10} 120 H${W - pad + 10}" stroke="#2B2550" stroke-width="2"/>`;
    for (let t = ax.lo; t <= ax.hi + 1e-9; t += ax.step) s += `<path d="M${X(t)} 115 V125" stroke="#2B2550" stroke-width="1.5"/><text x="${X(t)}" y="142" text-anchor="middle" class="m3-ax">${m3N(t)}</text>`;
    const sv = [...v].sort((a, b) => a - b); s += `<path d="M${X(sv[0])} ${y} H${X(sv[1])} M${X(sv[3])} ${y} H${X(sv[4])}" stroke="#2B2550" stroke-width="2.4"/><rect x="${X(sv[1])}" y="${y - 16}" width="${Math.max(1, X(sv[3]) - X(sv[1]))}" height="32" rx="3" fill="#3D9BE9" fill-opacity=".3" stroke="#2B2550" stroke-width="2.4"/><path d="M${X(sv[2])} ${y - 16} V${y + 16}" stroke="#2B2550" stroke-width="3"/>`;
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
/* โปรแกรมสร้างแผนภาพกล่อง (จำลอง): ลากจุดข้อมูลบนแผนภาพจุด แล้วตาราง 5 ค่ากับแผนภาพกล่องคำนวณใหม่ทันที */
function m3TechSim(data, lo, hi) {
  const a = data.slice(), W = 640, pad = 44, X = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad), V = x => lo + (x - pad) / (W - 2 * pad) * (hi - lo), NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} 250`); svg.setAttribute('class', 'm3-tech ia');
  const tbl = h('div', { class: 'm3-out' }), wrap = h('div', { class: 'colstack no-side' }, h6wait()), out = fNote2(); let drag = -1, moves = 0, last = '';
  const draw = () => { const F = m3FiveO(a), cnt = {}; let s = `<rect x="0" y="0" width="${W}" height="250" fill="#fff"/><path d="M${pad - 10} 140 H${W - pad + 10}" stroke="#2B2550" stroke-width="2"/>`;
    for (let t = lo; t <= hi; t += 10) s += `<path d="M${X(t)} 136 V144" stroke="#2B2550" stroke-width="1.4"/><text x="${X(t)}" y="160" text-anchor="middle" class="m3-ax">${t}</text>`;
    a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]).forEach(([v, i]) => { cnt[v] = (cnt[v] || 0) + 1; s += `<circle data-i="${i}" cx="${X(v)}" cy="${128 - (cnt[v] - 1) * 14}" r="6.5" fill="${i === drag ? '#E36A8C' : '#7C5CE0'}" stroke="#fff" stroke-width="1.4"/>`; });
    const y = 205; s += `<path d="M${X(F.wlo)} ${y} H${X(F.q1)} M${X(F.q3)} ${y} H${X(F.whi)} M${X(F.wlo)} ${y - 9} V${y + 9} M${X(F.whi)} ${y - 9} V${y + 9}" stroke="#2B2550" stroke-width="2.4"/><rect x="${X(F.q1)}" y="${y - 15}" width="${Math.max(1, X(F.q3) - X(F.q1))}" height="30" rx="3" fill="#3D9BE9" fill-opacity=".32" stroke="#2B2550" stroke-width="2.4"/><path d="M${X(F.q2)} ${y - 15} V${y + 15}" stroke="#2B2550" stroke-width="3"/>`;
    F.outs.forEach(v => { s += `<circle cx="${X(v)}" cy="${y}" r="6" fill="#fff" stroke="#E0445A" stroke-width="2.6"/>`; });
    svg.innerHTML = s; tbl.innerHTML = `<table><tr><th>n</th><th>ค่าต่ำสุด</th><th>Q₁</th><th>มัธยฐาน</th><th>Q₃</th><th>ค่าสูงสุด</th><th>IQR</th><th>ค่านอกเกณฑ์</th></tr><tr><td>${F.n}</td><td>${m3N(F.min)}</td><td>${m3N(F.q1)}</td><td>${m3N(F.q2)}</td><td>${m3N(F.q3)}</td><td>${m3N(F.max)}</td><td>${m3N(F.iqr)}</td><td>${F.outs.length ? F.outs.map(m3N).join(', ') : '-'}</td></tr></table>`; };
  const pt = e => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()); };
  svg.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); const p = pt(e); const c = e.target.closest && e.target.closest('circle[data-i]'); let i = c ? +c.dataset.i : -1;
    if (i < 0) { let bd = 18; a.forEach((v, k) => { const d = Math.abs(X(v) - p.x); if (d < bd && p.y < 150) { bd = d; i = k; } }); } if (i < 0) return; drag = i; try { svg.setPointerCapture(e.pointerId); } catch (_) { } draw(); });
  svg.addEventListener('pointermove', e => { if (drag < 0) return; const p = pt(e); a[drag] = Math.max(lo, Math.min(hi, Math.round(V(p.x)))); draw(); });
  svg.addEventListener('pointerup', () => { if (drag < 0) return; drag = -1; draw(); const F = m3Five(a), k = [F.min, F.q1, F.q2, F.q3, F.max].join(); if (k !== last) { last = k; moves++; sfx.pop(moves + 1); }
    out.innerHTML = moves >= 3 ? 'เห็นไหม — โปรแกรมคำนวณใหม่และวาดแผนภาพกล่องทันทีที่ข้อมูลเปลี่ยน ✓ (ลองลากจุดขวาสุดไปไกล ๆ จะกลายเป็นค่านอกเกณฑ์)' : `ลากต่ออีก ${3 - moves} ครั้ง`; if (moves >= 3) teachDone(wrap); });
  svg.addEventListener('click', e => e.stopPropagation()); draw();
  wrap.append(h('div', { class: 'cap' }, 'ลากจุดข้อมูล (สีม่วง) ไปทางซ้าย-ขวา แล้วดูตารางและแผนภาพกล่องเปลี่ยนตาม'), svg, tbl, out); return wrap;
}
/* ขั้นตอนหาควอร์ไทล์ทีละขั้น (วิธีใช้มัธยฐาน) */
const m3Walk = data => { const F = m3Five(data), n = F.n, P = m3Pos(n);
  return dcWalk(m3Tiles(data), [['① เรียงข้อมูลจากน้อยไปมาก', `${n} ตัว: ${F.a.join(', ')}`], ['② Q₂ = มัธยฐานของข้อมูลทั้งหมด', `${m3PosTxt(P.q2)} = ${m3N(F.q2)}`],
    ['③ แบ่งข้อมูลเป็น 2 ส่วน', n % 2 ? `จำนวนคี่ → ไม่นับมัธยฐาน เหลือครึ่งละ ${P.h} ตัว` : `จำนวนคู่ → ครึ่งละ ${P.h} ตัว`], ['④ Q₁ = มัธยฐานของข้อมูลที่ต่ำกว่า Q₂', `${m3PosTxt(P.q1)} = ${m3N(F.q1)}`], ['⑤ Q₃ = มัธยฐานของข้อมูลที่สูงกว่า Q₂', `${m3PosTxt(P.q3)} = ${m3N(F.q3)}`]],
    `<b>Q₁ = ${m3N(F.q1)}&emsp;Q₂ = ${m3N(F.q2)}&emsp;Q₃ = ${m3N(F.q3)}</b>`); };

/* v232 (ผู้ใช้ขอ): ข้อที่ให้ข้อมูลยังไม่เรียง — ให้แตะเรียงจากน้อยไปมากก่อน แล้วข้อมูลชุดเดิมเลื่อนออกไป จึงค่อยแสดงคำถาม/ช่องตอบ */
function m3SortFirst(data, onDone) {
  const order = m3Sort(data), wrap = h('div', { class: 'colstack m3-sf' }), cap = h('div', { class: 'cap m3-sfcap', html: 'ข้อมูลยังไม่เรียง — <b>แตะค่าที่น้อยที่สุดที่ยังเหลือ</b> ทีละตัว เพื่อเรียงจากน้อยไปมากก่อน' }), pool = h('div', { class: 'm3-tiles m3-pool2' }), row = h('div', { class: 'm3-tiles m3-sorted' }); let k = 0;
  data.forEach(v => { const b = h('button', { class: 'm3-t ia', html: m3N(v) }); b.onclick = e => { e.stopPropagation(); if (b.classList.contains('used') || k >= order.length) return;
    if (v !== order[k]) { sfx.no(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
    k++; b.classList.add('used'); row.append(h('span', { class: 'm3-t in', html: `${m3N(v)}<i>${k}</i>` })); sfx.pop(k % 8 + 1);
    if (k === order.length) { sfx.ok(); cap.innerHTML = 'เรียงจากน้อยไปมากแล้ว ✓'; pool.classList.add('out'); setTimeout(() => { pool.remove(); cap.remove(); onDone(wrap); }, 480); } }; pool.append(b); });
  wrap.append(cap, pool, row); return wrap;
}
/* =========================================================
   ข้อในเกม
   ========================================================= */
/* หา Q1/Q2/Q3/มัธยฐาน จากข้อมูล (แป้นตัวเลข) */
Q.m3Q = ({ data, k, sorted, med, ctx: tx }) => { const F = m3Five(data), show = sorted ? F.a : data, nm = med ? 'มัธยฐาน' : { q1: 'ควอร์ไทล์ที่ 1 (Q₁)', q2: 'ควอร์ไทล์ที่ 2 (Q₂)', q3: 'ควอร์ไทล์ที่ 3 (Q₃)' }[k];
  const q = `${tx ? tx + ' ' : ''}จากข้อมูล${sorted ? ' (เรียงแล้ว)' : ''} จงหา<b>${nm}</b>`;
  return { prompt: q, say: m3Say(q), __sig: `m3q ${k} ${data.join(',')}`, __base: 'm3q-' + k + (sorted ? 's' : '') + (F.n % 2), __baseCap: 2, __diff: 20 + data.length * 2 + (sorted ? 0 : 8) + (k === 'q2' ? 0 : 6),
    mount(bd, ctx) { const ans = () => miAns(ctx, F[k], { hint: k === 'q2' ? 'หาตัวที่อยู่ตรงกลาง (ตำแหน่งที่ (n + 1) ÷ 2 · มี 2 ตัวให้หาค่าเฉลี่ย)' : `หามัธยฐานก่อน แล้วหาตัวกลางของข้อมูลที่${k === 'q1' ? 'ต่ำ' : 'สูง'}กว่ามัธยฐาน${F.n % 2 ? ' (จำนวนคี่: ไม่นับมัธยฐาน)' : ''}` });
      if (sorted) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'm3-data', html: m3Tiles(show) + `<small>n = ${F.n}</small>` }), ans())); return; }
      const col = h('div', { class: 'colstack' }); col.append(m3SortFirst(data, w => { w.append(h('small', { class: 'm3-n' }, `n = ${F.n}`)); col.append(ans()); })); bd.append(col); } }; };
/* แตะหาตัวกลาง (ในเกม) */
Q.m3Tap = (data, keys) => { const one = keys && keys.length === 1; return { prompt: one ? 'แตะหามัธยฐานของข้อมูล' : 'แตะหา Q₂ Q₁ และ Q₃ ตามลำดับ', say: one ? 'แตะหามัธยฐานของข้อมูล' : 'แตะหาควอร์ไทล์ที่สอง ที่หนึ่ง และที่สาม ตามลำดับ', __sig: 'm3tap ' + data.join(','), __base: 'm3tap', __baseCap: 1, __diff: one ? 22 : 34,
  mount(bd, ctx) { let bad = 0; const w = m3QuartTap(data, { game: true, keys, onDone: () => setTimeout(() => ctx.check(true), 700), onWrong: () => { if (++bad % 2 === 0) ctx.check(false, 'หาตัวกลางของช่วงที่ไม่จาง (ถ้าตัวกลางมี 2 ตัว แตะทั้งคู่)'); } }); w.classList.add('rvl'); bd.append(w); } }; };
/* อ่านค่าจากแผนภาพกล่อง */
Q.m3Read = ({ F, ask, ctx: tx, vert }) => { const ax = [F.min, F.q1, F.q2, F.q3, F.max].every(v => v % 5 === 0) ? m3Ax5(F) : m3Axis(F), nm = { min: 'ค่าต่ำสุด', q1: 'Q₁', q2: 'มัธยฐาน (Q₂)', q3: 'Q₃', max: 'ค่าสูงสุด', range: 'พิสัย', iqr: 'พิสัยระหว่างควอร์ไทล์ (IQR)' }[ask], ans = ask === 'range' ? F.max - F.min : ask === 'iqr' ? F.q3 - F.q1 : F[ask], calc = ask === 'range' || ask === 'iqr';
  const q = `${tx || 'จากแผนภาพกล่อง'} <b>${nm}</b> มีค่าเท่าใด`;
  return { prompt: q, say: m3Say(q), __sig: `m3r ${ask} ${[F.min, F.q1, F.q2, F.q3, F.max]}`, __base: 'm3r' + ask + (vert ? 'v' : ''), __baseCap: 2, __diff: calc ? 30 : 18,
    mount(bd, ctx) { const lab = { labels: calc ? 'val' : 'ask', ask: calc ? null : ask }; bd.append(h('div', { class: 'm3-qrow' }, vert ? h('div', { class: 'm3-figbox v', html: m3VBoxSVG(F, { ...ax, ...lab }) }) : m3Fig(m3BoxSVG([{ F }], { ...ax, ...lab })), miAns(ctx, ans, { hint: ask === 'range' ? 'พิสัย = ค่าสูงสุด − ค่าต่ำสุด' : ask === 'iqr' ? 'IQR = Q₃ − Q₁ (ความยาวของกล่อง)' : { min: 'ปลายวิสเกอร์ด้าน' + (vert ? 'ล่าง' : 'ซ้าย'), q1: 'ขอบ' + (vert ? 'ล่าง' : 'ซ้าย') + 'ของกล่อง', q2: 'เส้นในกล่อง', q3: 'ขอบ' + (vert ? 'บน' : 'ขวา') + 'ของกล่อง', max: 'ปลายวิสเกอร์ด้าน' + (vert ? 'บน' : 'ขวา') }[ask] + ' — อ่านจากสเกล' }))); } }; };
/* เลือกแผนภาพกล่องที่ตรงกับข้อมูล */
Q.m3Pick = data => { const F = m3Five(data), ax = m3Axis(F), wrong = [{ ...F, q1: F.q2, q2: F.q1 }, { ...F, q2: (F.min + F.max) / 2 }, { ...F, q1: F.min + (F.q1 - F.min) / 2, q3: F.q3 + (F.max - F.q3) / 2 }, { ...F, min: F.q1, q1: F.min }].filter(G => [G.min, G.q1, G.q2, G.q3, G.max].join() !== [F.min, F.q1, F.q2, F.q3, F.max].join() && G.q1 <= G.q2 && G.q2 <= G.q3 && G.min <= G.q1);
  const opts = [['ok', F], ...shuffle(wrong).slice(0, 2).map((G, i) => ['w' + i, G])];
  return { prompt: 'แผนภาพกล่องใดแสดงข้อมูลชุดนี้', say: 'แผนภาพกล่องใดแสดงข้อมูลชุดนี้', __sig: 'm3p ' + data.join(','), __base: 'm3p', __baseCap: 2, __diff: 40,
    mount(bd, ctx) { const ch = choices(ctx, shuffle(opts.map(([v, G]) => ({ value: v, label: m3BoxSVG([{ F: G }], { ...ax, W: 520, rowH: 60 }) + `<i class="m3-k" hidden>${v}</i>` }))), 'ok', { hint: 'หาค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด ก่อน แล้วเทียบกับขอบกล่อง เส้นในกล่อง และปลายวิสเกอร์' }); ch.classList.add('m3-boxopts'); bd.append(h('div', { class: 'colstack' }, h('div', { class: 'm3-data', html: m3Tiles(F.a) }), ch)); } }; };
/* สร้างแผนภาพกล่องเอง (ลาก) */
Q.m3Build = data => ({ prompt: 'สร้างแผนภาพกล่องของข้อมูลชุดนี้', say: 'สร้างแผนภาพกล่องของข้อมูลชุดนี้ ลากจุดทั้งห้าไปวางให้ตรงค่า', __sig: 'm3b ' + data.join(','), __base: 'm3b', __baseCap: 1, __diff: 55,
  mount(bd, ctx) { bd.append(m3BoxBuild(data, { game: true, onOK: () => setTimeout(() => ctx.check(true), 600), onWrong: () => ctx.check(false, 'หาค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด จากข้อมูลให้ครบก่อน') })); } });
/* เลือกตอบ (มีรูปหรือข้อมูลได้) */
Q.m3Opt = ({ q, fig, tiles, sortFirst, opts, right, hint, sig, base, diff }) => ({ prompt: q, say: m3Say(q), __sig: 'm3o ' + (sig || q + right), ...(base ? { __base: base, __baseCap: 2 } : {}), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { const mk = () => { const ch = choices(ctx, shuffle(opts.map(o => ({ value: o, label: o }))), right, { hint }); if (opts.some(o => o.replace(/<[^>]+>/g, '').length > 8)) ch.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); return ch; };
    if (sortFirst) { const col = h('div', { class: 'colstack' }); col.append(m3SortFirst(sortFirst, () => col.append(mk()))); bd.append(col); return; }
    bd.append(h('div', { class: 'colstack' }, tiles ? h('div', { class: 'm3-data', html: m3Tiles(tiles) }) : '', fig ? m3Fig(fig) : '', mk())); } });
/* ตอบตัวเลข (มีรูปหรือข้อมูลได้) */
Q.m3Num = ({ q, fig, tiles, sortFirst, a, unit, hint, sig, base, diff }) => ({ prompt: q, say: m3Say(q), __sig: 'm3n ' + (sig || q), ...(base ? { __base: base, __baseCap: 2 } : {}), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { if (sortFirst) { const col = h('div', { class: 'colstack' }); col.append(m3SortFirst(sortFirst, () => col.append(miAns(ctx, a, { unit, hint })))); bd.append(col); return; }
    bd.append(h('div', { class: fig ? 'm3-qrow' : 'colstack' }, tiles ? h('div', { class: 'm3-data', html: m3Tiles(tiles) }) : '', fig ? m3Fig(fig) : '', miAns(ctx, a, { unit, hint }))); } });
const m3TF = (text, ok, why) => Q.hTF({ text, ok: !!ok, why });
/* ข้อ 1) ข้อ 2) จริงหรือไม่ */
const M3ST = ['ข้อ 1) และข้อ 2) ถูก', 'ข้อ 1) ถูก แต่ข้อ 2) ผิด', 'ข้อ 1) ผิด แต่ข้อ 2) ถูก', 'ข้อ 1) และข้อ 2) ผิด'];
const m3StmtQ = (fig, s1, ok1, s2, ok2, sig) => Q.m3Opt({ q: `จากรูป พิจารณาข้อความ<div class="m3-stmt">ข้อ 1) ${s1}<br>ข้อ 2) ${s2}</div>ข้อใดถูกต้อง`, fig, opts: M3ST, right: M3ST[ok1 ? (ok2 ? 0 : 1) : (ok2 ? 2 : 3)], hint: 'ตรวจทีละข้อความกับแผนภาพ', sig: 'st ' + sig, base: 'm3st', diff: 60 });
/* จำนวนข้อมูลในครึ่งล่าง / เลือกครึ่งล่าง-บน */
Q.m3HalfN = n => Q.m3Num({ q: `ข้อมูล ${n} ตัว เมื่อแบ่งเป็น 2 ส่วนเพื่อหา Q₁ ข้อมูลที่อยู่ต่ำกว่ามัธยฐานมีกี่ตัว`, a: n >> 1, unit: 'ตัว', hint: n % 2 ? 'จำนวนคี่: ไม่นับมัธยฐาน (n − 1) ÷ 2' : 'จำนวนคู่: n ÷ 2', sig: 'half ' + n, base: 'm3halfn' + (n % 2), diff: 14 + n / 4 });
Q.m3HalfPick = (data, up) => { const F = m3Five(data), a = F.a, n = a.length, h0 = n >> 1, right = (up ? a.slice(n - h0) : a.slice(0, h0)).join(', '), inc = (up ? a.slice(n - h0 - (n % 2)) : a.slice(0, h0 + (n % 2))).join(', '), raw = (up ? a.slice(0, h0) : a.slice(n - h0)).join(', '), off = (up ? a.slice(n - h0 - 1, n - 1) : a.slice(1, h0 + 1)).join(', ');
  const opts = [...new Set([right, inc, raw, off])]; return Q.m3Opt({ q: `ข้อใดคือข้อมูลที่อยู่<b>${up ? 'สูง' : 'ต่ำ'}กว่ามัธยฐาน</b> (ใช้หา ${up ? 'Q₃' : 'Q₁'})`, sortFirst: data, opts, right, hint: `หามัธยฐาน แล้วเลือกข้อมูลที่อยู่${up ? 'หลัง' : 'ก่อน'}มัธยฐาน${n % 2 ? ' (ไม่นับมัธยฐาน)' : ''}`, sig: 'hp ' + data.join(','), base: 'm3halfp' + (up ? 1 : 0), diff: 30 }); };
/* ตำแหน่งของ Q */
Q.m3PosQ = (n, k) => { const P = m3Pos(n), nm = { q1: 'Q₁', q2: 'Q₂ (มัธยฐาน)', q3: 'Q₃' }[k], right = m3PosTxt(P[k]), hI = n % 2 ? (n + 1) / 2 : n / 2, inc = k === 'q1' ? (hI + 1) / 2 : k === 'q3' ? n - hI + (hI + 1) / 2 : n / 2, quart = k === 'q1' ? n / 4 : k === 'q3' ? 3 * n / 4 : n / 2;
  const tx = p => p % 1 === 0 ? `ตัวที่ ${p}` : p % 1 === .5 ? m3PosTxt(p) : `ตัวที่ ${m3N(p)}`, opts = [...new Set([right, tx(inc), tx(k === 'q2' ? quart : P[k] - 1), tx(k === 'q2' ? (n + 2) / 2 : P.q2), tx(k === 'q1' ? P.q1 + 1 : k === 'q3' ? P.q3 - 1 : P.q2 + 1)])].slice(0, 4);
  if (!opts.includes(right)) opts[0] = right; return Q.m3Opt({ q: `ข้อมูล ${n} ตัวเรียงจากน้อยไปมากแล้ว <b>${nm}</b> คือข้อใด`, opts, right, hint: k === 'q2' ? 'ตำแหน่งมัธยฐาน = (n + 1) ÷ 2' : `ครึ่ง${k === 'q1' ? 'ล่าง' : 'บน'}มี ${P.h} ตัว แล้วหาตัวกลางของครึ่งนั้น`, sig: `pos ${n} ${k}`, base: 'm3pos' + k, diff: 20 + n / 3 }); };
/* ค่าที่ไม่ทราบ x: ข้อมูลเรียงแล้วมี x หนึ่งตัว และบอก Q */
const m3XGen = key => { for (let t = 0; t < 80; t++) { const n = key === 'q2' ? m3Pick([6, 8, 10]) : m3Pick([8, 9, 12, 13]), a = m3Uniq(n, 5, 60), F = m3Five(a), P = m3Pos(n), p = P[key];
  if (p % 1 === 0) continue; const ix = m3Pick([p - 1.5, p - .5]); if (a[ix] - a[ix - 1] < 2 || a[ix + 1] - a[ix] < 2) continue; const arr = a.map((v, i) => i === ix ? 'x' : v); return { arr, key, target: F[key], x: a[ix], ix, a }; } return null; };
Q.m3XQ = key => { const G = m3XGen(key), nm = { q1: 'Q₁', q2: 'มัธยฐาน', q3: 'Q₃' }[key], q = `ข้อมูลเรียงจากน้อยไปมาก ถ้า<b>${nm} = ${m3N(G.target)}</b> แล้ว x มีค่าเท่าใด`;
  return { prompt: q, say: m3Say(q), __sig: `m3x ${key} ${G.arr.join(',')}`, __base: 'm3x' + key, __baseCap: 2, __diff: 48 + G.arr.length,
    mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'm3-data', html: m3Tiles(G.arr) + `<small>n = ${G.arr.length}</small>` }), miAns(ctx, G.x, { hint: `${nm} เป็นค่าเฉลี่ยของ x กับตัวที่อยู่ติดกัน → (x + ตัวนั้น) ÷ 2 = ${m3N(G.target)}` }))); } }; };
/* จากแผนภาพต้น-ใบ / ตารางความถี่ */
Q.m3StemQ = (data, key) => { const F = m3Five(data), nm = { q1: 'Q₁', q2: 'มัธยฐาน', q3: 'Q₃' }[key], q = `จากแผนภาพต้น-ใบ จงหา<b>${nm}</b>`;
  return { prompt: q, say: m3Say(q), __sig: `m3s ${key} ${data.join(',')}`, __base: 'm3stem' + key, __baseCap: 2, __diff: 45,
    mount(bd, ctx) { bd.append(h('div', { class: 'm3-qrow' }, h('div', { html: m3StemHTML(data) + `<small class="m3-n">n = ${F.n}</small>` }), miAns(ctx, F[key], { hint: 'ใบในแต่ละแถวเรียงจากน้อยไปมากแล้ว นับตำแหน่งต่อกันทุกแถว' }))); } }; };
Q.m3FreqQ = (pairs, key) => { const F = m3Five(m3Expand(pairs)), nm = { q1: 'Q₁', q2: 'มัธยฐาน', q3: 'Q₃' }[key], q = `จากตาราง คะแนนของนักเรียน ${F.n} คน จงหา<b>${nm}</b>`;
  return { prompt: q, say: m3Say(q), __sig: `m3f ${key} ${pairs.join(';')}`, __base: 'm3freq' + key, __baseCap: 2, __diff: 50,
    mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { html: m3FreqHTML(pairs) }), miAns(ctx, F[key], { unit: 'คะแนน', hint: `นับสะสมจำนวนคนทีละช่อง หาว่าคนที่อยู่${m3PosTxt(m3Pos(F.n)[key]).replace('ตัวที่', 'ลำดับที่')}ได้กี่คะแนน` }))); } }; };
const m3FreqGen = () => { for (let t = 0; t < 60; t++) { const v0 = m3R(3, 6), pairs = [0, 1, 2, 3, 4, 5].map(i => [v0 + i, m3R(1, 5)]), n = pairs.reduce((s, p) => s + p[1], 0); if (n >= 12 && n <= 22) return pairs; } return [[4, 2], [5, 3], [6, 4], [7, 3], [8, 2], [9, 1]]; };
/* IQR จากข้อมูล */
Q.m3IqrQ = (data, sorted) => { const F = m3Five(data); return Q.m3Num({ q: `จากข้อมูล${sorted ? ' (เรียงแล้ว)' : ''} จงหา<b>พิสัยระหว่างควอร์ไทล์ (IQR)</b>`, ...(sorted ? { tiles: F.a } : { sortFirst: data }), a: F.q3 - F.q1, hint: 'หา Q₁ และ Q₃ ก่อน แล้ว IQR = Q₃ − Q₁', sig: 'iqr ' + data.join(','), base: 'm3iqr' + (sorted ? 's' : ''), diff: 40 + data.length }); };
/* ขอบเขตค่านอกเกณฑ์ / ค่านอกเกณฑ์ */
const m3OutGen = (want = 1) => { for (let t = 0; t < 200; t++) { const n = m3Pick([9, 10, 11, 12]), a = m3Uniq(n - 1, 20, 50), far = m3Pick([1, -1]), v = far > 0 ? 50 + m3R(15, 30) : 20 - m3R(12, 18), d = want ? [...a, v] : [...a, m3R(20, 50)], F = m3FiveO(d);
  if (F.iqr % 2 || F.outs.length !== want || new Set(d).size !== d.length || F.lo < 0) continue; return d; } return [12, 21, 24, 25, 27, 28, 30, 31, 33, 60]; };
Q.m3FenceQ = (data, side) => { const F = m3FiveO(data), q = `จากข้อมูล (Q₁ = ${m3N(F.q1)}, Q₃ = ${m3N(F.q3)}) จงหา<b>ขอบเขต${side === 'hi' ? 'บน' : 'ล่าง'}</b> ของค่านอกเกณฑ์`;
  return Q.m3Num({ q, tiles: F.a, a: F[side], hint: side === 'hi' ? 'Q₃ + 1.5 × IQR' : 'Q₁ − 1.5 × IQR', sig: 'fence ' + side + data.join(','), base: 'm3fence', diff: 50 }); };
Q.m3OutPick = data => { const F = m3FiveO(data), right = F.outs.length ? F.outs.map(m3N).join(', ') : 'ไม่มีค่านอกเกณฑ์', s = F.a, opts = [...new Set([right, 'ไม่มีค่านอกเกณฑ์', m3N(s[s.length - 1] === F.outs[0] ? s[s.length - 2] : s[s.length - 1]), m3N(s[0] === F.outs[0] ? s[1] : s[0])])];
  return Q.m3Opt({ q: `ข้อมูลชุดนี้มี Q₁ = ${m3N(F.q1)} และ Q₃ = ${m3N(F.q3)} ค่าใดเป็น<b>ค่านอกเกณฑ์</b>`, tiles: F.a, opts, right, hint: `IQR = ${m3N(F.iqr)} · ค่านอกเกณฑ์ < Q₁ − 1.5×IQR หรือ > Q₃ + 1.5×IQR`, sig: 'op ' + data.join(','), base: 'm3outp', diff: 55 }); };
/* ร้อยละ / จำนวนข้อมูลในช่วง */
const M3PCT = [['ค่าต่ำสุด', 'Q₁', 25], ['Q₁', 'Q₃', 50], ['ค่าต่ำสุด', 'Q₃', 75], ['Q₂', 'ค่าสูงสุด', 50], ['Q₁', 'ค่าสูงสุด', 75], ['Q₃', 'ค่าสูงสุด', 25]];
const m3PctQ = i => { const [a, b, p] = M3PCT[i]; return Q.m3Opt({ q: `ข้อมูลระหว่าง <b>${a}</b> กับ <b>${b}</b> มีประมาณร้อยละเท่าใดของข้อมูลทั้งหมด`, opts: ['25', '50', '75', '100'].map(x => x + '%'), right: p + '%', hint: 'แต่ละส่วนของแผนภาพกล่องมีข้อมูลประมาณ 25%', sig: 'pct ' + i, base: 'm3pct', diff: 15 }); };
const m3CountQ = (N, F, kind) => { const ax = m3Ax5(F), [txt, p] = { le1: [`ได้ไม่เกิน ${F.q1} คะแนน`, 25], ge3: [`ได้ตั้งแต่ ${F.q3} คะแนนขึ้นไป`, 25], mid: [`ได้ตั้งแต่ ${F.q1} ถึง ${F.q3} คะแนน`, 50], ge1: [`ได้ตั้งแต่ ${F.q1} คะแนนขึ้นไป`, 75], le2: [`ได้ไม่เกิน ${F.q2} คะแนน`, 50], le3: [`ได้ไม่เกิน ${F.q3} คะแนน`, 75] }[kind];
  return Q.m3Num({ q: `คะแนนของนักเรียน ${N} คน ดังแผนภาพกล่อง มีนักเรียนประมาณกี่คนที่${txt}`, fig: m3BoxSVG([{ F }], { ...ax, labels: 'val' }), a: N * p / 100, unit: 'คน', hint: `ช่วงนี้มีประมาณ ${p}% ของ ${N} คน`, sig: `cnt ${N} ${kind} ${F.q1}`, base: 'm3cnt' + kind, diff: 30 }); };
/* เปรียบเทียบแผนภาพกล่องสองชุด */
const m3Pair = () => { const A = { min: m3R(20, 30), q1: 0, q2: 0, q3: 0, max: 0 }; A.q1 = A.min + m3R(8, 14); A.q2 = A.q1 + m3R(5, 10); A.q3 = A.q2 + m3R(5, 10); A.max = A.q3 + m3R(6, 14);
  const B = { min: A.min + m3R(-6, 6), q1: 0, q2: 0, q3: 0, max: 0 }; B.q1 = B.min + m3R(4, 8); B.q2 = B.q1 + m3R(3, 6) + (Math.random() < .5 ? 6 : 0); B.q3 = B.q2 + m3R(3, 6); B.max = B.q3 + m3R(4, 12); if (B.q2 === A.q2) B.q2++; if (B.q3 - B.q1 === A.q3 - A.q1) B.q3++; if (B.max - B.min === A.max - A.min) B.max++; return [A, B]; };
const m3CmpFig = (A, B, na = 'ห้อง ก', nb = 'ห้อง ข') => m3BoxSVG([{ F: A, name: na }, { F: B, name: nb, col: M3COL[1] }], { ...m3AxisAll([A, B]), labels: 'val' });
const m3CmpQ = kind => { const [A, B] = m3Pair(), fig = m3CmpFig(A, B), ia = A.q3 - A.q1, ib = B.q3 - B.q1;
  if (kind === 'med') return Q.m3Opt({ q: 'ห้องใดมี<b>มัธยฐาน</b>ของคะแนนสูงกว่า', fig, opts: ['ห้อง ก', 'ห้อง ข', 'เท่ากัน'], right: A.q2 > B.q2 ? 'ห้อง ก' : 'ห้อง ข', hint: 'เทียบเส้นในกล่องของทั้งสองห้อง', sig: 'cmpmed ' + A.q2 + B.q2, base: 'm3cmpmed', diff: 25 });
  if (kind === 'iqr') return Q.m3Opt({ q: 'คะแนนกลุ่มกลาง 50% (ในกล่อง) ของห้องใด<b>กระจายมากกว่า</b>', fig, opts: ['ห้อง ก', 'ห้อง ข', 'เท่ากัน'], right: ia > ib ? 'ห้อง ก' : 'ห้อง ข', hint: 'กล่องที่ยาวกว่า (IQR มากกว่า) = ข้อมูลกลุ่มกลางกระจายมากกว่า', sig: 'cmpiqr ' + ia + ib, base: 'm3cmpiqr', diff: 30 });
  if (kind === 'diff') return Q.m3Num({ q: 'มัธยฐานของสองห้องต่างกันเท่าใด', fig, a: Math.abs(A.q2 - B.q2), unit: 'คะแนน', hint: 'นำมัธยฐาน (เส้นในกล่อง) มาลบกัน', sig: 'cmpd ' + A.q2 + B.q2, base: 'm3cmpd', diff: 35 });
  if (kind === 'stmt') return m3StmtQ(fig, `Q₃ ของห้อง ก มากกว่าห้อง ข`, A.q3 > B.q3, `พิสัยของห้อง ข มากกว่าห้อง ก`, (B.max - B.min) > (A.max - A.min), [A.q3, B.q3, A.max, B.max].join());
  return Q.m3Num({ q: 'พิสัยของคะแนนห้อง ก กับห้อง ข ต่างกันเท่าใด', fig, a: Math.abs((A.max - A.min) - (B.max - B.min)), unit: 'คะแนน', hint: 'พิสัย = ค่าสูงสุด − ค่าต่ำสุด ของแต่ละห้อง แล้วนำมาลบกัน', sig: 'cmpr ' + A.max + B.max, base: 'm3cmpr', diff: 40 }); };
/* เลือกแผนภาพกล่องที่ตรงกับตารางผลของโปรแกรม */
Q.m3PickT = F => { const ax = m3Axis(F), wrong = [{ ...F, q2: F.q1 + (F.q3 - F.q1) * .8 }, { ...F, q1: F.min, min: F.min - (F.q1 - F.min) }, { ...F, q3: F.max, max: F.max + (F.max - F.q3) }].map(G => ({ ...G, q2: Math.round(G.q2 * 2) / 2, min: Math.max(ax.lo, G.min), max: Math.min(ax.hi, G.max) }));
  return { prompt: 'ตารางผลจากโปรแกรมตรงกับแผนภาพกล่องใด', say: 'ตารางผลจากโปรแกรมตรงกับแผนภาพกล่องใด', __sig: 'm3pt ' + [F.min, F.q1, F.q2, F.q3, F.max], __base: 'm3p', __baseCap: 1, __diff: 35,
    mount(bd, ctx) { const ch = choices(ctx, shuffle([['ok', F], ...shuffle(wrong).slice(0, 2).map((G, i) => ['w' + i, G])].map(([v, G]) => ({ value: v, label: m3BoxSVG([{ F: G }], { ...ax, W: 520, rowH: 60 }) + `<i class="m3-k" hidden>${v}</i>` }))), 'ok', { hint: 'เทียบทีละค่า: ปลายซ้าย ขอบกล่อง เส้นในกล่อง ปลายขวา' }); ch.classList.add('m3-boxopts'); bd.append(h('div', { class: 'colstack' }, m3Fig(m3OutTbl(F)), ch)); } }; };
/* ส่วนใดกระจุก / กระจาย */
const M3PART = ['ค่าต่ำสุดถึง Q₁', 'Q₁ ถึง Q₂', 'Q₂ ถึง Q₃', 'Q₃ ถึงค่าสูงสุด'];
const m3SpreadF = () => { for (let t = 0; t < 60; t++) { const F = m3GenF5(), L = [F.q1 - F.min, F.q2 - F.q1, F.q3 - F.q2, F.max - F.q3], mn = Math.min(...L), mx = Math.max(...L); if (L.filter(x => x === mn).length === 1 && L.filter(x => x === mx).length === 1) return F; } return { min: 10, q1: 20, q2: 25, q3: 40, max: 60 }; };
const m3SpreadQ = near => { const F = m3SpreadF(), L = [F.q1 - F.min, F.q2 - F.q1, F.q3 - F.q2, F.max - F.q3], k = L.indexOf(near ? Math.min(...L) : Math.max(...L));
  return Q.m3Opt({ q: near ? 'ข้อมูลในช่วงใด<b>กระจุกตัว</b> (อยู่ใกล้กัน) มากที่สุด' : 'ข้อมูลในช่วงใด<b>กระจาย</b>มากที่สุด', fig: m3BoxSVG([{ F }], { ...m3Ax5(F), labels: 'val' }), opts: M3PART, right: M3PART[k], hint: near ? 'ช่วงที่สั้นที่สุด (แต่ละช่วงมีข้อมูล 25% เท่ากัน)' : 'ช่วงที่ยาวที่สุด', sig: (near ? 'near ' : 'far ') + L.join(), base: 'm3spread' + (near ? 1 : 0), diff: 28 }); };

/* =========================================================
   บทเรียน 3601–3614 + บอส 3619
   ========================================================= */
const M3PENG = [['ปุยฝ้าย', 58], ['ข้าวปั้น', 47], ['ลูกเกด', 63], ['มะปราง', 52], ['เมฆ', 70], ['ทองดี', 55], ['หิมะ', 61], ['ขนมปัง', 44], ['น้ำแข็ง', 66]];
const LM3 = (no, place, title, short, goal, teach, game, x = {}) => ({ id: 3600 + no, no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game, gameN: 8, ...x }); /* v232 ผู้ใช้ขอ: ด่านละ 8 ข้อ */
const LESSONS_M3C6 = [
  LM3(1, 'ลานเพนกวิน', 'ทบทวนมัธยฐานและการเรียงลำดับข้อมูล', 'มัธยฐาน', 'เรียงข้อมูลจากน้อยไปมาก และหามัธยฐานของข้อมูลทั้งที่มีจำนวนคี่และจำนวนคู่', [
    T('<b>ความสูงของเพนกวิน 9 ตัว</b> (ข้อมูลสมมติ: เซนติเมตร) — เรียงจากน้อยไปมาก', 'ความสูงของเพนกวินเก้าตัว เรียงจากน้อยไปมาก', el => el.append(m3SortSim(M3PENG.slice(), 'เพนกวิน', 'เรียงครบแล้ว ✓ — ตัวที่ 5 อยู่ตรงกลางพอดี (ซ้าย 4 ตัว ขวา 4 ตัว) <b>มัธยฐาน = 58 เซนติเมตร</b>'))),
    T('<b>มัธยฐาน (จำนวนคี่)</b> — แตะตัวที่อยู่ตรงกลาง', 'มัธยฐาน จำนวนคี่ แตะตัวที่อยู่ตรงกลาง', el => el.append(m3QuartTap([12, 15, 17, 18, 21, 24, 26, 29, 33, 35, 40], { keys: ['q2'] }))),
    T('<b>มัธยฐาน (จำนวนคู่)</b> — ตัวกลางมี 2 ตัว แตะทั้งคู่', 'มัธยฐาน จำนวนคู่ ตัวกลางมีสองตัว แตะทั้งคู่', el => el.append(m3QuartTap([31, 34, 36, 40, 43, 47, 50, 52], { keys: ['q2'] }))),
    T('<b>สรุปเรื่องมัธยฐาน</b> — แตะการ์ดดูทีละใบ', 'สรุปเรื่องมัธยฐาน แตะการ์ดดูทีละใบ', el => el.append(miCards([['มัธยฐาน', '<b>ค่าที่อยู่ตรงกลาง</b><small>เมื่อเรียงข้อมูลจากน้อยไปมากแล้ว</small>'], ['ตำแหน่ง', '<b>(n + 1) ÷ 2</b><small>n = จำนวนข้อมูล</small>', 'ตำแหน่งมัธยฐาน'], ['n เป็นคู่', '<b>ค่าเฉลี่ยของ 2 ตัวกลาง</b><small>เช่น ตัวที่ 4 กับ 5 เมื่อ n = 8</small>'], ['ค่าสุดโต่ง', '<b>มัธยฐานแทบไม่เปลี่ยน</b><small>เหมาะกับข้อมูลที่มีค่าสูงหรือต่ำผิดปกติ</small>']])))
  ], () => [Q.m3Q({ data: m3Uniq(7, 10, 60), k: 'q2', sorted: true, med: true }), Q.m3Q({ data: m3Uniq(9, 20, 80), k: 'q2', sorted: true, med: true }), Q.m3Q({ data: m3Uniq(8, 10, 60), k: 'q2', sorted: true, med: true }), Q.m3Q({ data: m3Uniq(10, 30, 90), k: 'q2', sorted: true, med: true }),
    Q.m3Q({ data: shuffle(m3Uniq(9, 10, 70)), k: 'q2', med: true }), Q.m3Q({ data: shuffle(m3Uniq(12, 20, 90)), k: 'q2', med: true }), Q.m3Tap(m3Uniq(11, 10, 70), ['q2']),
    Q.m3PosQ(m3Pick([15, 21, 25]), 'q2'), Q.m3PosQ(m3Pick([20, 30, 40]), 'q2'),
    Q.m3Opt({ q: 'ก่อนหามัธยฐาน ต้องทำสิ่งใดกับข้อมูลก่อน', opts: ['เรียงข้อมูลจากน้อยไปมาก', 'หาค่าเฉลี่ย', 'ตัดค่าสูงสุดออก', 'นับความถี่ของแต่ละค่า'], right: 'เรียงข้อมูลจากน้อยไปมาก', hint: 'มัธยฐานเป็นค่าตามตำแหน่ง', diff: 8 }),
    m3TF('ข้อมูล 9 ตัว มัธยฐานคือข้อมูลตัวที่ 5 เมื่อเรียงแล้ว', true, '(9 + 1) ÷ 2 = 5'), m3TF('ถ้าเปลี่ยนค่าสูงสุดให้มากขึ้นอีก มัธยฐานจะมากขึ้นด้วย', false, 'มัธยฐานขึ้นกับตำแหน่งตรงกลาง ไม่ใช่ค่าปลาย'), m3TF('ข้อมูล 10 ตัว มัธยฐานคือค่าเฉลี่ยของตัวที่ 5 และตัวที่ 6', true, '(10 + 1) ÷ 2 = 5.5')]),
  LM3(2, 'สะพานน้ำแข็ง', 'การแบ่งข้อมูลเป็น 2 ส่วน', 'แบ่งครึ่งข้อมูล', 'ใช้มัธยฐานแบ่งข้อมูลที่เรียงแล้วเป็น 2 ส่วน คือข้อมูลที่ต่ำกว่าและสูงกว่ามัธยฐาน ทั้งกรณีจำนวนคี่และจำนวนคู่', [
    T('<b>แบ่งข้อมูลจำนวนคู่</b> — แตะมัธยฐาน แล้วดูสองครึ่ง', 'แบ่งข้อมูลจำนวนคู่ แตะมัธยฐาน แล้วดูสองครึ่ง', el => el.append(m3QuartTap([8, 11, 13, 14, 16, 19, 22, 23, 27, 30], { keys: ['q2'], split: true }))),
    T('<b>แบ่งข้อมูลจำนวนคี่</b> — มัธยฐานอยู่ตรงกลาง ไม่นับในครึ่งใด', 'แบ่งข้อมูลจำนวนคี่ มัธยฐานอยู่ตรงกลาง ไม่นับในครึ่งใด', el => el.append(m3QuartTap([41, 44, 46, 49, 53, 55, 58, 62, 64, 67, 71], { keys: ['q2'], split: true }))),
    T('<b>สรุปการแบ่งข้อมูลเป็น 2 ส่วน</b> — แตะการ์ดดูทีละใบ', 'สรุปการแบ่งข้อมูลเป็นสองส่วน แตะการ์ดดูทีละใบ', el => el.append(miCards([['n เป็นคู่', '<b>ครึ่งละ n ÷ 2 ตัว</b><small>เช่น 10 ตัว → ครึ่งละ 5 ตัว</small>'], ['n เป็นคี่', '<b>ไม่นับมัธยฐาน</b><small>ครึ่งละ (n − 1) ÷ 2 ตัว เช่น 11 ตัว → ครึ่งละ 5 ตัว</small>'], ['ครึ่งล่าง', '<b>ข้อมูลที่ต่ำกว่ามัธยฐาน</b><small>ใช้หา Q₁</small>'], ['ครึ่งบน', '<b>ข้อมูลที่สูงกว่ามัธยฐาน</b><small>ใช้หา Q₃</small>']])))
  ], () => [Q.m3HalfN(m3Pick([8, 12])), Q.m3HalfN(m3Pick([9, 13])), Q.m3HalfN(m3Pick([16, 20])), Q.m3HalfN(m3Pick([15, 21, 25])),
    Q.m3HalfPick(shuffle(m3Uniq(8, 10, 50)), false), Q.m3HalfPick(shuffle(m3Uniq(9, 10, 50)), false), Q.m3HalfPick(shuffle(m3Uniq(9, 20, 60)), true), Q.m3HalfPick(shuffle(m3Uniq(10, 20, 70)), true),
    Q.m3Tap(m3Uniq(9, 10, 60), ['q2']),
    Q.m3Opt({ q: 'ข้อมูล 11 ตัวเรียงแล้ว ข้อมูลที่อยู่ต่ำกว่ามัธยฐานคือข้อใด', opts: ['ตัวที่ 1 ถึงตัวที่ 5', 'ตัวที่ 1 ถึงตัวที่ 6', 'ตัวที่ 1 ถึงตัวที่ 4', 'ตัวที่ 6 ถึงตัวที่ 11'], right: 'ตัวที่ 1 ถึงตัวที่ 5', hint: 'มัธยฐานคือตัวที่ 6 — ไม่นับมัธยฐาน', diff: 22 }),
    m3TF('ข้อมูล 13 ตัว ครึ่งล่างมี 6 ตัว', true, 'ไม่นับมัธยฐาน (13 − 1) ÷ 2 = 6'), m3TF('ข้อมูลจำนวนคี่ ต้องนับมัธยฐานรวมไว้ในครึ่งล่างด้วย', false, 'ไม่นับมัธยฐานในทั้งสองครึ่ง')]),
  LM3(3, 'ประภาคารหิมะ', 'ควอร์ไทล์และตำแหน่งของควอร์ไทล์', 'ตำแหน่งควอร์ไทล์', 'บอกความหมายของควอร์ไทล์ที่ 1 2 และ 3 และหาตำแหน่งของควอร์ไทล์ในข้อมูลที่เรียงแล้ว', [
    T('<b>ควอร์ไทล์แบ่งข้อมูลเป็น 4 ส่วน</b> — แตะการ์ดดูทีละใบ', 'ควอร์ไทล์แบ่งข้อมูลเป็นสี่ส่วน แตะการ์ดดูทีละใบ', el => el.append(h('div', { class: 'colstack' }, h('div', { class: 'm3-quarter', html: ['25%', '25%', '25%', '25%'].map((p, i) => `<span style="--c:${M3COL[i]}">${p}</span>`).join('') + '<i style="left:25%">Q₁</i><i style="left:50%">Q₂</i><i style="left:75%">Q₃</i>' }),
      miCards([['Q₁', '<b>ประมาณ 25%</b><small>ของข้อมูลน้อยกว่าหรือเท่ากับ Q₁</small>', 'ควอร์ไทล์ที่ 1'], ['Q₂', '<b>ประมาณ 50%</b><small>คือมัธยฐานนั่นเอง</small>', 'ควอร์ไทล์ที่ 2'], ['Q₃', '<b>ประมาณ 75%</b><small>ของข้อมูลน้อยกว่าหรือเท่ากับ Q₃</small>', 'ควอร์ไทล์ที่ 3']])))),
    T('<b>ตำแหน่งของควอร์ไทล์</b> — แตะจำนวนข้อมูลแต่ละแบบ', 'ตำแหน่งของควอร์ไทล์ แตะจำนวนข้อมูลแต่ละแบบ', el => el.append(m3PosSim([7, 8, 11, 12]))),
    T('ตัวอย่างทีละขั้น: <b>หาควอร์ไทล์ด้วยความรู้เรื่องมัธยฐาน</b>', 'ตัวอย่างทีละขั้น หาควอร์ไทล์ด้วยความรู้เรื่องมัธยฐาน', el => el.append(m3Walk([22, 9, 15, 30, 12, 26, 18])))
  ], () => [Q.m3PosQ(m3Pick([7, 11, 15]), 'q1'), Q.m3PosQ(m3Pick([8, 12, 16]), 'q1'), Q.m3PosQ(m3Pick([7, 11, 19]), 'q3'), Q.m3PosQ(m3Pick([10, 14, 20]), 'q3'), Q.m3PosQ(m3Pick([9, 13]), 'q1'),
    Q.m3Opt({ q: 'ควอร์ไทล์แบ่งข้อมูลที่เรียงแล้วออกเป็นกี่ส่วนเท่า ๆ กัน', opts: ['4 ส่วน', '2 ส่วน', '3 ส่วน', '10 ส่วน'], right: '4 ส่วน', hint: 'quartile มาจากคำว่า หนึ่งในสี่', diff: 6 }),
    Q.m3Opt({ q: 'ข้อมูลประมาณร้อยละเท่าใดที่มีค่าน้อยกว่าหรือเท่ากับ Q₃', opts: ['25%', '50%', '75%', '100%'], right: '75%', hint: 'น้อยกว่า Q₃ มี 3 ส่วนจาก 4 ส่วน', diff: 10 }), Q.m3Opt({ q: 'ควอร์ไทล์ที่ 2 (Q₂) มีค่าเท่ากับค่าใด', opts: ['มัธยฐาน', 'ค่าเฉลี่ยเลขคณิต', 'ฐานนิยม', 'ค่าสูงสุด'], right: 'มัธยฐาน', hint: 'Q₂ แบ่งข้อมูลเป็นสองส่วนเท่ากัน', diff: 8 }),
    Q.m3Num({ q: 'นักเรียน 40 คน ประมาณกี่คนที่ได้คะแนนน้อยกว่าหรือเท่ากับ Q₁', a: 10, unit: 'คน', hint: '25% ของ 40', sig: 'pc40', base: 'm3pcn', diff: 18 }), Q.m3Num({ q: 'นักเรียน 120 คน ประมาณกี่คนที่ได้คะแนนน้อยกว่าหรือเท่ากับ Q₃', a: 90, unit: 'คน', hint: '75% ของ 120', sig: 'pc120', base: 'm3pcn', diff: 22 }),
    m3TF('Q₁ ≤ Q₂ ≤ Q₃ เสมอ', true, 'ควอร์ไทล์เรียงตามตำแหน่งจากน้อยไปมาก'), m3TF('ควอร์ไทล์ต้องเป็นค่าที่อยู่ในข้อมูลเสมอ', false, 'อาจเป็นค่าเฉลี่ยของสองค่า เช่น 22.5')]),
  LM3(4, 'หลุมตกปลา', 'การหาควอร์ไทล์เมื่อข้อมูลมีจำนวนคู่', 'ควอร์ไทล์ (n คู่)', 'หาควอร์ไทล์ที่ 1 2 และ 3 ของข้อมูลที่มีจำนวนคู่', [
    T('ตัวอย่างทีละขั้น: <b>จำนวนปลาที่จับได้ 12 วัน</b> (ข้อมูลสมมติ)', 'ตัวอย่างทีละขั้น จำนวนปลาที่จับได้สิบสองวัน', el => el.append(m3Walk([14, 9, 21, 17, 11, 25, 19, 8, 23, 15, 12, 28]))),
    T('<b>ลองหาเอง (n = 10)</b> — แตะ Q₂ แล้ว Q₁ แล้ว Q₃', 'ลองหาเอง ข้อมูลสิบตัว แตะควอร์ไทล์ที่สอง ที่หนึ่ง และที่สาม', el => el.append(m3QuartTap([14, 18, 21, 23, 26, 29, 31, 35, 38, 42])))
  ], () => [Q.m3Q({ data: m3Uniq(8, 10, 50), k: 'q1', sorted: true }), Q.m3Q({ data: m3Uniq(8, 10, 50), k: 'q3', sorted: true }), Q.m3Q({ data: m3Uniq(10, 20, 70), k: 'q1', sorted: true }), Q.m3Q({ data: m3Uniq(10, 20, 70), k: 'q3', sorted: true }),
    Q.m3Q({ data: shuffle(m3Gen(12, 30, 90)), k: 'q1' }), Q.m3Q({ data: shuffle(m3Gen(12, 30, 90)), k: 'q3' }), Q.m3Q({ data: shuffle(m3Gen(14, 10, 60)), k: 'q2' }), Q.m3Tap(m3Uniq(12, 20, 80)),
    Q.m3PosQ(m3Pick([16, 20]), 'q1'), Q.m3PosQ(m3Pick([16, 20]), 'q3'),
    Q.m3Opt({ q: 'ข้อมูล 20 ตัวเรียงแล้ว Q₁ คือข้อใด', opts: ['ค่าเฉลี่ยของตัวที่ 5 กับตัวที่ 6', 'ตัวที่ 5', 'ตัวที่ 10', 'ค่าเฉลี่ยของตัวที่ 10 กับตัวที่ 11'], right: 'ค่าเฉลี่ยของตัวที่ 5 กับตัวที่ 6', hint: 'ครึ่งล่างมี 10 ตัว ตัวกลางของ 10 ตัวคือตัวที่ 5 กับ 6', sig: 'q1of20', diff: 30 }),
    m3TF('ข้อมูล 8 ตัว Q₃ คือค่าเฉลี่ยของตัวที่ 6 กับตัวที่ 7', true, 'ครึ่งบนคือตัวที่ 5–8 ตัวกลางคือตัวที่ 6 กับ 7')]),
  LM3(5, 'ถ้ำน้ำแข็ง', 'การหาควอร์ไทล์เมื่อข้อมูลมีจำนวนคี่', 'ควอร์ไทล์ (n คี่)', 'หาควอร์ไทล์ที่ 1 2 และ 3 ของข้อมูลที่มีจำนวนคี่ โดยไม่นับมัธยฐานในครึ่งล่างและครึ่งบน', [
    T('ตัวอย่างทีละขั้น: <b>เวลาไถลน้ำแข็งของเพนกวิน 11 ตัว</b> (วินาที ข้อมูลสมมติ)', 'ตัวอย่างทีละขั้น เวลาไถลน้ำแข็งของเพนกวินสิบเอ็ดตัว', el => el.append(m3Walk([16, 23, 12, 19, 27, 14, 21, 30, 18, 25, 11]))),
    T('<b>ลองหาเอง (n = 13)</b> — ครึ่งละ 6 ตัว ตัวกลางมี 2 ตัว', 'ลองหาเอง ข้อมูลสิบสามตัว ครึ่งละหกตัว', el => el.append(m3QuartTap([40, 43, 47, 50, 52, 55, 58, 61, 63, 66, 70, 72, 75]))),
    T('<b>ลองหาเอง (n = 15)</b> — ครึ่งละ 7 ตัว', 'ลองหาเอง ข้อมูลสิบห้าตัว ครึ่งละเจ็ดตัว', el => el.append(m3QuartTap([5, 6, 8, 8, 9, 11, 12, 13, 15, 16, 16, 18, 20, 21, 24])))
  ], () => [Q.m3Q({ data: m3Uniq(7, 10, 50), k: 'q1', sorted: true }), Q.m3Q({ data: m3Uniq(7, 10, 50), k: 'q3', sorted: true }), Q.m3Q({ data: m3Uniq(9, 20, 70), k: 'q1', sorted: true }), Q.m3Q({ data: m3Uniq(9, 20, 70), k: 'q3', sorted: true }),
    Q.m3Q({ data: shuffle(m3Gen(11, 30, 90)), k: 'q1' }), Q.m3Q({ data: shuffle(m3Gen(11, 30, 90)), k: 'q3' }), Q.m3Q({ data: shuffle(m3Gen(13, 10, 60)), k: 'q2' }), Q.m3Tap(m3Uniq(11, 10, 70)),
    Q.m3PosQ(m3Pick([13, 17]), 'q1'), Q.m3PosQ(m3Pick([15, 19]), 'q3'),
    Q.m3Num({ q: 'ข้อมูล 15 ตัว (จำนวนคี่) ข้อมูลที่อยู่ต่ำกว่ามัธยฐานมีกี่ตัว', a: 7, unit: 'ตัว', hint: 'ไม่นับมัธยฐาน (15 − 1) ÷ 2', sig: 'h15', diff: 15 }),
    m3TF('ข้อมูล 9 ตัว Q₁ คือค่าเฉลี่ยของตัวที่ 2 กับตัวที่ 3', true, 'ครึ่งล่างคือตัวที่ 1–4 ตัวกลางคือตัวที่ 2 กับ 3'), m3TF('ข้อมูล 7 ตัว Q₃ คือข้อมูลตัวที่ 5', false, 'ครึ่งบนคือตัวที่ 5–7 ตัวกลางคือตัวที่ 6')]),
  LM3(6, 'หมู่บ้านอิกลู', 'การหาควอร์ไทล์จากโจทย์ประยุกต์และข้อมูลที่ไม่ทราบค่า', 'โจทย์ประยุกต์ + x', 'หาควอร์ไทล์จากแผนภาพต้น-ใบและตารางความถี่ และหาค่าที่ไม่ทราบในข้อมูลเมื่อรู้ค่าควอร์ไทล์', [
    T('<b>ข้อมูลที่ไม่ทราบค่า</b> — ลองแทนค่า x ทีละค่า', 'ข้อมูลที่ไม่ทราบค่า ลองแทนค่าเอกซ์ทีละค่า', el => el.append(m3XSim({ arr: [6, 9, 'x', 15, 18, 20, 24, 27], key: 'q1', target: 10.5, cands: [10, 11, 12, 13, 14] }))),
    T('ตัวอย่างทีละขั้น: <b>ควอร์ไทล์จากแผนภาพต้น-ใบ</b>', 'ตัวอย่างทีละขั้น ควอร์ไทล์จากแผนภาพต้นใบ', el => { const d = [31, 35, 38, 42, 44, 44, 47, 51, 53, 56, 58, 62, 65, 67, 70], F = m3Five(d);
      el.append(dcWalk(m3StemHTML(d), [['① นับจำนวนข้อมูล', `ใบทั้งหมด ${F.n} ใบ → n = ${F.n}`], ['② Q₂', `ตัวที่ 8 = ${F.q2}`], ['③ Q₁', `ครึ่งล่าง 7 ตัว → ตัวที่ 4 = ${F.q1}`], ['④ Q₃', `ครึ่งบน 7 ตัว → ตัวที่ 12 = ${F.q3}`]], `<b>Q₁ = ${F.q1}&emsp;Q₂ = ${F.q2}&emsp;Q₃ = ${F.q3}</b>`)); }),
    T('ตัวอย่างทีละขั้น: <b>ควอร์ไทล์จากตารางความถี่</b>', 'ตัวอย่างทีละขั้น ควอร์ไทล์จากตารางความถี่', el => { const P = [[5, 2], [6, 4], [7, 5], [8, 3], [9, 2]], F = m3Five(m3Expand(P));
      el.append(dcWalk(m3FreqHTML(P), [['① นับจำนวนคน', `2 + 4 + 5 + 3 + 2 = ${F.n} คน`], ['② นับสะสม', 'คนที่ 1–2 ได้ 5 · คนที่ 3–6 ได้ 6 · คนที่ 7–11 ได้ 7 · คนที่ 12–14 ได้ 8 · คนที่ 15–16 ได้ 9'], ['③ Q₂', `ค่าเฉลี่ยของคนที่ 8 กับ 9 = ${F.q2}`], ['④ Q₁ และ Q₃', `ครึ่งละ 8 คน → Q₁ = คนที่ 4 กับ 5 = ${F.q1} · Q₃ = คนที่ 12 กับ 13 = ${F.q3}`]], `<b>Q₁ = ${F.q1}&emsp;Q₂ = ${F.q2}&emsp;Q₃ = ${F.q3}</b> คะแนน`)); })
  ], () => [Q.m3XQ('q2'), Q.m3XQ('q1'), Q.m3XQ('q3'), Q.m3XQ('q1'), Q.m3StemQ(m3Uniq(11, 20, 79), 'q2'), Q.m3StemQ(m3Uniq(13, 30, 89), 'q1'), Q.m3StemQ(m3Uniq(15, 40, 99), 'q3'),
    Q.m3FreqQ(m3FreqGen(), 'q2'), Q.m3FreqQ(m3FreqGen(), 'q1'), Q.m3FreqQ(m3FreqGen(), 'q3'),
    Q.m3Opt({ q: 'นักเรียน 40 คนเรียงคะแนนจากน้อยไปมาก Q₁ คือคะแนนของใคร', opts: ['ค่าเฉลี่ยของคนที่ 10 กับ 11', 'คนที่ 10', 'คนที่ 20', 'ค่าเฉลี่ยของคนที่ 20 กับ 21'], right: 'ค่าเฉลี่ยของคนที่ 10 กับ 11', hint: 'ครึ่งล่าง 20 คน ตัวกลางคือคนที่ 10 กับ 11', sig: 'q1of40', diff: 35 }),
    m3TF('ถ้ารู้ว่า Q₁ = (8 + x) ÷ 2 = 10 แล้ว x = 12', true, '8 + x = 20 → x = 12')]),
  LM3(7, 'ธารน้ำแข็ง', 'พิสัยระหว่างควอร์ไทล์ (IQR)', 'IQR', 'หาพิสัยระหว่างควอร์ไทล์ (IQR = Q₃ − Q₁) และบอกได้ว่า IQR แสดงการกระจายของข้อมูลกลุ่มกลาง 50%', [
    T('<b>หา IQR</b> — แตะ Q₂ Q₁ Q₃ แล้วดูความกว้างของข้อมูลกลุ่มกลาง', 'หาไอคิวอาร์ แตะควอร์ไทล์ แล้วดูความกว้างของข้อมูลกลุ่มกลาง', el => el.append(m3QuartTap([6, 9, 10, 13, 15, 16, 18, 21, 24, 25, 29, 33], { iqr: true }))),
    T('<b>พิสัย กับ IQR</b> — เปลี่ยนค่าปลายแล้วเทียบกัน', 'พิสัยกับไอคิวอาร์ เปลี่ยนค่าปลายแล้วเทียบกัน', el => el.append(m3IqrSim([12, 15, 17, 18, 20, 22, 23, 25, 27, 30], [['ค่าสูงสุด 30 → 48', 48, 'max'], ['ค่าต่ำสุด 12 → 4', 4, 'min']]))),
    T('<b>สรุป IQR</b> — แตะการ์ดดูทีละใบ', 'สรุปไอคิวอาร์ แตะการ์ดดูทีละใบ', el => el.append(miCards([['IQR', '<b>Q₃ − Q₁</b><small>พิสัยระหว่างควอร์ไทล์</small>', 'พิสัยระหว่างควอร์ไทล์'], ['ความหมาย', '<b>ความกว้างของข้อมูลกลุ่มกลาง 50%</b><small>= ความยาวของกล่อง</small>'], ['IQR มาก', '<b>ข้อมูลกลุ่มกลางกระจายมาก</b>'], ['IQR น้อย', '<b>ข้อมูลกลุ่มกลางใกล้เคียงกัน</b>']])))
  ], () => [Q.m3IqrQ(m3Uniq(8, 10, 50), true), Q.m3IqrQ(m3Uniq(9, 10, 60), true), Q.m3IqrQ(shuffle(m3Gen(10, 20, 80))), Q.m3IqrQ(shuffle(m3Gen(11, 20, 80))),
    Q.m3Read({ F: m3GenF5(), ask: 'iqr' }), Q.m3Read({ F: m3GenF5(), ask: 'iqr' }),
    Q.m3Num({ q: 'ข้อมูลชุดหนึ่งมี Q₁ = 24 และ Q₃ = 41 IQR เท่าใด', a: 17, hint: 'Q₃ − Q₁', sig: 'iqrt1', base: 'm3iqrt', diff: 12 }), Q.m3Num({ q: 'ข้อมูลชุดหนึ่งมี IQR = 15 และ Q₁ = 32 Q₃ เท่าใด', a: 47, hint: 'Q₃ = Q₁ + IQR', sig: 'iqrt2', base: 'm3iqrt', diff: 20 }),
    Q.m3Opt({ q: 'ข้อมูลกลุ่มใดมีข้อมูลกลุ่มกลาง<b>ใกล้เคียงกันมากกว่า</b>', opts: ['กลุ่ม ก (IQR = 6)', 'กลุ่ม ข (IQR = 14)', 'เท่ากัน', 'บอกไม่ได้'], right: 'กลุ่ม ก (IQR = 6)', hint: 'IQR น้อย = ข้อมูลกลุ่มกลางใกล้เคียงกัน', sig: 'iqrc', diff: 16 }),
    Q.m3Opt({ q: 'ถ้าค่าสูงสุดของข้อมูลเพิ่มขึ้นมาก ๆ ค่าใด<b>ไม่เปลี่ยน</b>', opts: ['IQR', 'พิสัย', 'ค่าสูงสุด', 'ความยาวของวิสเกอร์ด้านขวา'], right: 'IQR', hint: 'IQR ใช้ Q₁ และ Q₃ เท่านั้น', sig: 'iqrfix', diff: 18 }),
    m3TF('IQR คือความยาวของกล่องในแผนภาพกล่อง', true, 'จาก Q₁ ถึง Q₃'), m3TF('IQR = ค่าสูงสุด − ค่าต่ำสุด', false, 'นั่นคือพิสัย — IQR = Q₃ − Q₁')]),
  LM3(8, 'โรงต่อเลื่อน', 'องค์ประกอบและการสร้างแผนภาพกล่อง', 'สร้างแผนภาพกล่อง', 'บอกองค์ประกอบของแผนภาพกล่อง (กล่อง วิสเกอร์ และค่าทั้ง 5) และสร้างแผนภาพกล่องจากข้อมูล', [
    T('<b>แผนภาพกล่องคืออะไร</b> — แตะดูแต่ละส่วน', 'แผนภาพกล่องคืออะไร แตะดูแต่ละส่วน', el => el.append(m3BoxWhat([4, 6, 7, 9, 10, 12, 13, 15, 18, 20, 24]))),
    T('<b>วาดแผนภาพกล่องอย่างไร</b> — ทีละขั้น', 'วาดแผนภาพกล่องอย่างไร ทีละขั้น', el => el.append(m3DrawWalk([8, 12, 13, 15, 17, 18, 21, 24, 26, 30, 35]))),
    T('<b>องค์ประกอบของแผนภาพกล่อง</b> — แตะทีละค่า', 'องค์ประกอบของแผนภาพกล่อง แตะทีละค่า', el => el.append(m3BoxParts([31, 35, 38, 40, 42, 45, 47, 50, 53, 56, 60, 66]))),
    T('<b>ลองสร้างเอง</b>: ลากจุดทั้ง 5 ให้ตรงค่าของข้อมูล', 'ลองสร้างเอง ลากจุดทั้งห้าให้ตรงค่าของข้อมูล', el => el.append(m3BoxBuild([22, 25, 27, 30, 31, 34, 36, 38, 41, 45, 48])))
  ], () => [Q.m3Read({ F: m3GenF5(), ask: 'q2' }), Q.m3Read({ F: m3GenF5(), ask: 'q1' }), Q.m3Read({ F: m3GenF5(), ask: 'q3' }), Q.m3Read({ F: m3GenF5(), ask: 'max' }),
    Q.m3Pick(m3Gen(11, 20, 80)), Q.m3Pick(m3Gen(12, 10, 60)), Q.m3Build(m3Gen(11, 10, 40)),
    Q.m3Opt({ q: 'เส้นตรงกลางในกล่องของแผนภาพกล่องแสดงค่าใด', opts: ['มัธยฐาน (Q₂)', 'ค่าเฉลี่ย', 'Q₁', 'พิสัย'], right: 'มัธยฐาน (Q₂)', hint: 'กล่องเริ่มที่ Q₁ จบที่ Q₃ และมีเส้น Q₂ อยู่ภายใน', diff: 8 }),
    Q.m3Opt({ q: 'แผนภาพกล่องใช้ค่ากี่ค่าในการสร้าง', opts: ['5 ค่า', '3 ค่า', '4 ค่า', 'ทุกค่าในข้อมูล'], right: '5 ค่า', hint: 'ค่าต่ำสุด Q₁ Q₂ Q₃ ค่าสูงสุด', diff: 8 }),
    Q.m3Opt({ q: '<b>วิสเกอร์</b>ด้านขวาของแผนภาพกล่องลากจากค่าใดไปค่าใด', opts: ['Q₃ ถึงค่าสูงสุด', 'Q₂ ถึง Q₃', 'Q₁ ถึง Q₃', 'ค่าต่ำสุดถึงค่าสูงสุด'], right: 'Q₃ ถึงค่าสูงสุด', hint: 'วิสเกอร์คือเส้นสองข้างของกล่อง', diff: 12 }),
    m3TF('ปลายวิสเกอร์ด้านซ้ายของแผนภาพกล่องคือ Q₁', false, 'ปลายวิสเกอร์ด้านซ้ายคือค่าต่ำสุด — Q₁ คือขอบซ้ายของกล่อง')]),
  LM3(9, 'หอดูแสงเหนือ', 'การอ่านและแปลความหมายแผนภาพกล่อง', 'อ่านแผนภาพกล่อง', 'อ่านค่าจากแผนภาพกล่อง (แนวนอนและแนวตั้ง) และบอกจำนวนหรือร้อยละของข้อมูลในแต่ละช่วง', [
    T('<b>อ่านแผนภาพกล่อง</b> — แตะทีละค่า ดูว่ามีกี่คน', 'อ่านแผนภาพกล่อง แตะทีละค่า ดูว่ามีกี่คน', el => el.append(m3ReadSim({ min: 15, q1: 30, q2: 40, q3: 50, max: 70 }, 80, 'คะแนน', 'คะแนน'))),
    T('<b>แผนภาพกล่องแนวตั้ง</b> — อ่านจากล่างขึ้นบน', 'แผนภาพกล่องแนวตั้ง อ่านจากล่างขึ้นบน', el => { const F = { min: 145, q1: 155, q2: 160, q3: 170, max: 185 }; el.append(h('div', { class: 'm3-qrow' }, h('div', { class: 'm3-figbox v', html: m3VBoxSVG(F, { lo: 140, hi: 190, step: 5, labels: 'val' }) }),
      miCards([['ด้านล่าง', '<b>ค่าต่ำสุด 145</b><small>ปลายวิสเกอร์ล่าง</small>'], ['กล่อง', '<b>Q₁ = 155 ถึง Q₃ = 170</b><small>มีข้อมูลประมาณ 50%</small>'], ['เส้นในกล่อง', '<b>มัธยฐาน 160</b>'], ['ด้านบน', '<b>ค่าสูงสุด 185</b><small>ปลายวิสเกอร์บน</small>']]))); })
  ], () => { const N = m3Pick([40, 80, 120, 200]); return [...[0, 1, 2, 5].map(m3PctQ), m3CountQ(N, m3GenF5(), 'le1'), m3CountQ(N, m3GenF5(), 'mid'), m3CountQ(m3Pick([40, 60, 100]), m3GenF5(), 'ge1'), m3CountQ(m3Pick([40, 60, 100]), m3GenF5(), 'le3'),
    Q.m3Read({ F: m3GenF5(), ask: 'q2', vert: true }), Q.m3Read({ F: m3GenF5(), ask: 'q1', vert: true }), Q.m3Read({ F: m3GenF5(), ask: 'range' }),
    m3TF('ข้อมูลประมาณครึ่งหนึ่งอยู่ภายในกล่อง', true, 'จาก Q₁ ถึง Q₃ มีประมาณ 50%'), m3TF('ข้อมูลประมาณ 25% มีค่ามากกว่าหรือเท่ากับ Q₁', false, 'มากกว่าหรือเท่ากับ Q₁ มีประมาณ 75%')]; }),
  LM3(10, 'ทุ่งเกล็ดหิมะ', 'การกระจายของข้อมูลและการเปรียบเทียบการกระจาย', 'การกระจาย', 'บอกได้ว่าข้อมูลช่วงใดกระจุกตัวหรือกระจายจากความยาวของแต่ละช่วงในแผนภาพกล่อง', [
    T('<b>แต่ละช่วงมีข้อมูลประมาณ 25%</b> — แตะทีละช่วง ดูจุดข้อมูลในช่วงนั้น', 'แต่ละช่วงมีข้อมูลประมาณยี่สิบห้าเปอร์เซ็นต์ แตะทีละช่วง', el => el.append(m3QuarterSim([12, 14, 15, 16, 17, 17, 18, 20, 23, 27, 32, 38, 44, 51, 57, 62]))),
    T('<b>อ่านการกระจาย</b> จากความยาวของแต่ละช่วง — แตะการ์ดดูทีละใบ', 'อ่านการกระจายจากความยาวของแต่ละช่วง แตะการ์ดดูทีละใบ', el => el.append(miCards([['ช่วงสั้น', '<b>ข้อมูลกระจุกตัว</b><small>อยู่ใกล้กัน</small>'], ['ช่วงยาว', '<b>ข้อมูลกระจาย</b><small>อยู่ห่างกันมาก</small>'], ['ทุกช่วง', '<b>มีข้อมูลประมาณ 25% เท่ากัน</b><small>แม้จะยาวไม่เท่ากัน</small>'], ['เปรียบเทียบ', '<b>ช่วงยาวกว่า กระจายมากกว่า</b><small>เช่น Q₃ ถึงค่าสูงสุด ยาวกว่า ค่าต่ำสุดถึง Q₁</small>']])))
  ], () => [m3SpreadQ(true), m3SpreadQ(false), m3SpreadQ(true), m3SpreadQ(false),
    ...(() => { const F = m3SpreadF(), L = [F.q1 - F.min, F.q2 - F.q1, F.q3 - F.q2, F.max - F.q3], i = L.indexOf(Math.max(...L)), j = L.indexOf(Math.min(...L)), fig = m3BoxSVG([{ F }], { ...m3Ax5(F), labels: 'val' });
      return [m3StmtQ(fig, `ช่วง${M3PART[i]} ข้อมูลกระจายมากกว่าช่วง${M3PART[j]}`, true, `ช่วง${M3PART[i]} มีจำนวนข้อมูลมากกว่าช่วง${M3PART[j]}`, false, L.join()),
        Q.m3Num({ q: 'ช่วงที่ยาวที่สุดในแผนภาพกล่องนี้ยาวเท่าใด', fig, a: Math.max(...L), hint: 'หาความยาวทั้ง 4 ช่วง แล้วเลือกช่วงที่ยาวที่สุด', sig: 'longest ' + L.join(), base: 'm3long', diff: 30 })]; })(),
    Q.m3Opt({ q: 'ข้อมูลในกล่อง (Q₁ ถึง Q₃) ของกลุ่มใด<b>กระจุกตัวมากกว่า</b>', fig: m3CmpFig({ min: 20, q1: 30, q2: 35, q3: 40, max: 60 }, { min: 15, q1: 25, q2: 38, q3: 50, max: 55 }, 'กลุ่ม ก', 'กลุ่ม ข'), opts: ['กลุ่ม ก', 'กลุ่ม ข', 'เท่ากัน'], right: 'กลุ่ม ก', hint: 'กล่องสั้นกว่า = กระจุกตัวมากกว่า', sig: 'grpbox', diff: 26 }),
    Q.m3Opt({ q: 'ถ้าวิสเกอร์ด้านซ้ายสั้นมาก แต่วิสเกอร์ด้านขวายาวมาก ข้อใดถูก', opts: ['ข้อมูล 25% ที่น้อยที่สุดอยู่ใกล้กัน', 'ข้อมูลด้านซ้ายมีจำนวนน้อยกว่า', 'ข้อมูลด้านขวามีจำนวนมากกว่า', 'ค่ามัธยฐานอยู่ทางขวา'], right: 'ข้อมูล 25% ที่น้อยที่สุดอยู่ใกล้กัน', hint: 'ความยาวบอกการกระจาย ไม่ได้บอกจำนวน', sig: 'whisk', diff: 30 }),
    m3TF('ช่วงที่ยาวกว่าในแผนภาพกล่อง มีจำนวนข้อมูลมากกว่าช่วงที่สั้น', false, 'ทุกช่วงมีข้อมูลประมาณ 25% เท่ากัน ความยาวบอกการกระจาย'), m3TF('ช่วงที่สั้นที่สุดคือช่วงที่ข้อมูลกระจุกตัวมากที่สุด', true, '')]),
  LM3(11, 'สะพานภูเขาน้ำแข็ง', 'การเปรียบเทียบแผนภาพกล่อง 2 ชุด', 'เปรียบเทียบ 2 ชุด', 'เปรียบเทียบข้อมูลสองชุดจากแผนภาพกล่อง ทั้งค่ากลาง (มัธยฐาน) และการกระจาย (IQR พิสัย)', [
    T('<b>คะแนนสอบก่อนเรียนและหลังเรียน</b> (ข้อมูลสมมติ) — แตะทีละหัวข้อ', 'คะแนนสอบก่อนเรียนและหลังเรียน แตะทีละหัวข้อ', el => el.append(m3CmpSim({ min: 3, q1: 6, q2: 8, q3: 10, max: 14 }, { min: 6, q1: 10, q2: 13, q3: 15, max: 19 }, 'ก่อนเรียน', 'หลังเรียน', 'คะแนน'))),
    T('ตัวอย่างทีละขั้น: <b>เปรียบเทียบเวลาว่ายน้ำ</b> สองกลุ่ม (วินาที)', 'ตัวอย่างทีละขั้น เปรียบเทียบเวลาว่ายน้ำสองกลุ่ม', el => { const A = { min: 12, q1: 14, q2: 15, q3: 17, max: 21 }, B = { min: 11, q1: 13, q2: 16, q3: 19, max: 24 };
      el.append(dcWalk(m3BoxSVG([{ F: A, name: 'กลุ่ม ก' }, { F: B, name: 'กลุ่ม ข', col: M3COL[1] }], { ...m3AxisAll([A, B]), labels: 'val' }), [['① ค่ากลาง', 'มัธยฐาน ก = 15 วินาที · ข = 16 วินาที → กลุ่ม ก ว่ายเร็วกว่าเล็กน้อย'], ['② IQR', 'ก = 17 − 14 = 3 · ข = 19 − 13 = 6 → กลุ่ม ข กระจายมากกว่า'], ['③ พิสัย', 'ก = 21 − 12 = 9 · ข = 24 − 11 = 13']], '<b>กลุ่ม ก ว่ายเร็วกว่าและเวลาใกล้เคียงกันมากกว่า</b>')); })
  ], () => [m3CmpQ('med'), m3CmpQ('iqr'), m3CmpQ('diff'), m3CmpQ('range'), m3CmpQ('med'), m3CmpQ('iqr'), m3CmpQ('stmt'), m3CmpQ('stmt'),
    Q.m3Opt({ q: 'ต้องการรู้ว่าข้อมูลชุดใด "ใกล้เคียงกันมากกว่า" ควรดูสิ่งใดของแผนภาพกล่อง', opts: ['ความยาวของกล่อง (IQR)', 'ตำแหน่งของเส้นในกล่องเท่านั้น', 'สีของกล่อง', 'ชื่อของข้อมูล'], right: 'ความยาวของกล่อง (IQR)', hint: 'กล่องสั้น = ข้อมูลกลุ่มกลางใกล้เคียงกัน', diff: 14 }),
    Q.m3Opt({ q: 'การเปรียบเทียบแผนภาพกล่องสองชุดให้ถูกต้อง ต้องเป็นอย่างไร', opts: ['ใช้สเกลเดียวกัน', 'กล่องต้องยาวเท่ากัน', 'ต้องวาดคนละสเกล', 'ต้องมีวิสเกอร์ยาวเท่ากัน'], right: 'ใช้สเกลเดียวกัน', hint: 'วางบนเส้นจำนวนเดียวกันจึงเทียบได้', diff: 12 }),
    m3TF('ถ้ามัธยฐานของห้อง ก มากกว่าห้อง ข แสดงว่านักเรียนทุกคนในห้อง ก ได้คะแนนมากกว่าทุกคนในห้อง ข', false, 'มัธยฐานบอกค่ากลาง ไม่ได้บอกทุกคน')]),
  LM3(12, 'แพน้ำแข็งลอย', 'การหาค่านอกเกณฑ์ (Outlier)', 'ค่านอกเกณฑ์', 'หาขอบเขตล่าง Q₁ − 1.5×IQR และขอบเขตบน Q₃ + 1.5×IQR บอกค่านอกเกณฑ์ และเขียนแผนภาพกล่องที่มีค่านอกเกณฑ์', [
    T('<b>หาค่านอกเกณฑ์</b> — ทำทีละขั้น แล้วแตะจุดที่อยู่นอกขอบเขต', 'หาค่านอกเกณฑ์ ทำทีละขั้น แล้วแตะจุดที่อยู่นอกขอบเขต', el => el.append(m3OutSim([4, 21, 24, 25, 27, 28, 30, 31, 33, 35, 58]))),
    T('<b>สรุปค่านอกเกณฑ์</b> — แตะการ์ดดูทีละใบ', 'สรุปค่านอกเกณฑ์ แตะการ์ดดูทีละใบ', el => el.append(h('div', { class: 'colstack' }, m3Fig(m3BoxSVG([{ F: m3FiveO([4, 21, 24, 25, 27, 28, 30, 31, 33, 35, 58]) }], { lo: 0, hi: 60, step: 5, labels: 'val' })),
      miCards([['ขอบเขตล่าง', '<b>Q₁ − 1.5 × IQR</b><small>น้อยกว่านี้ = ค่านอกเกณฑ์</small>'], ['ขอบเขตบน', '<b>Q₃ + 1.5 × IQR</b><small>มากกว่านี้ = ค่านอกเกณฑ์</small>'], ['ในแผนภาพ', '<b>เขียนเป็นจุด</b><small>วิสเกอร์ลากถึงค่าที่ไกลที่สุดที่ไม่ใช่ค่านอกเกณฑ์</small>'], ['ความหมาย', '<b>ค่าที่ต่างจากข้อมูลส่วนใหญ่มาก</b><small>ควรตรวจว่าเก็บข้อมูลผิดหรือไม่</small>']]))))
  ], () => { const d1 = m3OutGen(1), d2 = m3OutGen(1), d3 = m3OutGen(0), d4 = m3OutGen(1); return [Q.m3FenceQ(d1, 'hi'), Q.m3FenceQ(d2, 'lo'), Q.m3OutPick(d1), Q.m3OutPick(d4), Q.m3OutPick(d3), Q.m3IqrQ(d2, true),
    Q.m3Num({ q: 'ข้อมูลชุดหนึ่งมี Q₁ = 20 และ Q₃ = 28 ขอบเขตบนของค่านอกเกณฑ์เท่าใด', a: 40, hint: 'IQR = 8 · 28 + 1.5 × 8', sig: 'fz1', base: 'm3fz', diff: 30 }), Q.m3Num({ q: 'ข้อมูลชุดหนึ่งมี Q₁ = 30 และ Q₃ = 42 ขอบเขตล่างของค่านอกเกณฑ์เท่าใด', a: 12, hint: 'IQR = 12 · 30 − 1.5 × 12', sig: 'fz2', base: 'm3fz', diff: 30 }),
    Q.m3Opt({ q: 'ข้อมูลชุดหนึ่งมีขอบเขตล่าง 12 และขอบเขตบน 60 ค่าใดเป็นค่านอกเกณฑ์', opts: ['65', '58', '15', '12'], right: '65', hint: 'มากกว่า 60 หรือน้อยกว่า 12', sig: 'fz3', diff: 18 }),
    Q.m3Opt({ q: 'ในแผนภาพกล่องที่มีค่านอกเกณฑ์ วิสเกอร์ลากไปถึงค่าใด', opts: ['ค่าที่ไกลที่สุดที่ไม่ใช่ค่านอกเกณฑ์', 'ค่านอกเกณฑ์', 'ขอบเขตบนพอดี', 'Q₃ เสมอ'], right: 'ค่าที่ไกลที่สุดที่ไม่ใช่ค่านอกเกณฑ์', hint: 'ค่านอกเกณฑ์เขียนแยกเป็นจุด', sig: 'fz4', diff: 20 }),
    m3TF('ค่านอกเกณฑ์คือค่าที่มากกว่า Q₃ + 1.5 × IQR หรือน้อยกว่า Q₁ − 1.5 × IQR', true, ''), m3TF('ข้อมูลทุกชุดต้องมีค่านอกเกณฑ์อย่างน้อย 1 ค่า', false, 'บางชุดไม่มีค่านอกเกณฑ์เลย')]; }),
  LM3(13, 'ค่ายสำรวจ', 'โจทย์ประยุกต์แผนภาพกล่องและการหาค่าที่ไม่ทราบ', 'ประยุกต์ + x', 'แก้โจทย์ประยุกต์จากแผนภาพกล่อง และหาค่าที่ไม่ทราบเมื่อรู้ค่าจากแผนภาพกล่อง', [
    T('<b>หา x ให้แผนภาพกล่องตรงกับโจทย์</b> — ลองแทนค่าทีละค่า', 'หาเอกซ์ให้แผนภาพกล่องตรงกับโจทย์ ลองแทนค่าทีละค่า', el => el.append(m3XSim({ arr: [10, 14, 17, 19, 22, 'x', 28, 30, 35, 40], key: 'q2', target: 23.5, cands: [23, 24, 25, 26, 27], boxT: { min: 10, q1: 17, q2: 23.5, q3: 30, max: 40 } }))),
    T('ตัวอย่างทีละขั้น: <b>นักเรียน 60 คน</b> วัดน้ำหนัก (กิโลกรัม ข้อมูลสมมติ)', 'ตัวอย่างทีละขั้น นักเรียนหกสิบคน วัดน้ำหนัก', el => { const F = { min: 36, q1: 43, q2: 50, q3: 55, max: 68 };
      el.append(dcWalk(m3BoxSVG([{ F }], { lo: 30, hi: 70, step: 5, labels: 'val' }), [['① ช่วงละ 25%', '25% ของ 60 คน = 15 คน'], ['② หนักไม่เกิน 43 กก.', 'ค่าต่ำสุดถึง Q₁ → ประมาณ 15 คน'], ['③ หนัก 43 ถึง 55 กก.', 'Q₁ ถึง Q₃ (50%) → ประมาณ 30 คน'], ['④ หนักกว่า 50 กก.', 'Q₂ ถึงค่าสูงสุด (50%) → ประมาณ 30 คน'], ['⑤ IQR', '55 − 43 = 12 กก.']], '<b>อ่านจำนวนคนได้จาก "ช่วงละ 25%"</b>')); })
  ], () => [Q.m3XQ('q2'), Q.m3XQ('q3'), m3CountQ(m3Pick([60, 80]), m3GenF5(), 'ge3'), m3CountQ(m3Pick([120, 160]), m3GenF5(), 'le2'),
    Q.m3Num({ q: 'แผนภาพกล่องมีพิสัย 45 และค่าสูงสุด 82 ค่าต่ำสุดเท่าใด', a: 37, hint: 'ค่าต่ำสุด = ค่าสูงสุด − พิสัย', sig: 'ap1', base: 'm3ap', diff: 25 }), Q.m3Num({ q: 'IQR = 18 และ Q₃ = 64 Q₁ เท่าใด', a: 46, hint: 'Q₁ = Q₃ − IQR', sig: 'ap2', base: 'm3ap', diff: 25 }),
    Q.m3Num({ q: 'นักเรียน 200 คน มีกี่คนโดยประมาณที่ได้คะแนนระหว่าง Q₁ กับ Q₂', a: 50, unit: 'คน', hint: '25% ของ 200', sig: 'ap3', base: 'm3ap2', diff: 22 }), Q.m3Num({ q: 'ข้อมูลมี Q₁ = 18 และ IQR = 10 ขอบเขตบนของค่านอกเกณฑ์เท่าใด', a: 43, hint: 'Q₃ = 28 แล้วขอบเขตบน = Q₃ + 1.5 × IQR', sig: 'ap4', base: 'm3ap2', diff: 45 }),
    Q.m3Opt({ q: 'ห้อง ก มี Q₃ = 70 คะแนน นักเรียน 40 คน ข้อใดถูก', opts: ['ประมาณ 10 คนได้ตั้งแต่ 70 คะแนนขึ้นไป', 'ประมาณ 30 คนได้ตั้งแต่ 70 คะแนนขึ้นไป', 'ทุกคนได้ไม่เกิน 70 คะแนน', 'ประมาณ 20 คนได้ตั้งแต่ 70 คะแนนขึ้นไป'], right: 'ประมาณ 10 คนได้ตั้งแต่ 70 คะแนนขึ้นไป', hint: 'ตั้งแต่ Q₃ ขึ้นไปมีประมาณ 25%', sig: 'ap5', diff: 30 }),
    m3StmtQ(m3BoxSVG([{ F: { min: 20, q1: 35, q2: 45, q3: 50, max: 70 } }], { lo: 15, hi: 75, step: 5, labels: 'val' }), 'ข้อมูลประมาณ 75% มีค่าไม่เกิน 50', true, 'IQR เท่ากับ 50', false, 'ap6'),
    m3TF('ถ้า Q₂ = 30 และข้อมูลมี 100 ตัว จะมีประมาณ 50 ตัวที่มีค่าไม่เกิน 30', true, '')]),
  LM3(14, 'สถานีวิจัยขั้วโลก', 'การนำเสนอข้อมูลด้วยเทคโนโลยีและแบบทดสอบสรุป', 'เทคโนโลยี + สรุป', 'ใช้โปรแกรมคำนวณค่าและสร้างแผนภาพกล่อง อ่านผล แปลความหมาย และทบทวนทั้งบทด้วยแบบทดสอบสรุป', [
    T('<b>โปรแกรมสร้างแผนภาพกล่อง</b> (จำลอง) — ลากจุดข้อมูลแล้วดูผล', 'โปรแกรมสร้างแผนภาพกล่อง ลากจุดข้อมูลแล้วดูผล', el => el.append(m3TechSim([34, 38, 41, 45, 47, 50, 52, 55, 57, 60, 63, 66, 70, 74, 81], 20, 100))),
    T('<b>ขั้นตอนใช้โปรแกรม</b> — แตะการ์ดดูทีละใบ', 'ขั้นตอนใช้โปรแกรม แตะการ์ดดูทีละใบ', el => el.append(miCards([['1 กรอกข้อมูล', '<b>พิมพ์ข้อมูลลงในตาราง</b><small>หนึ่งค่าต่อหนึ่งช่อง ตรวจให้ครบ</small>'], ['2 เลือกคำสั่ง', '<b>เลือกสร้างแผนภาพกล่อง</b><small>โปรแกรมเรียงข้อมูลและคำนวณให้</small>'], ['3 อ่านผล', '<b>ค่าต่ำสุด Q₁ มัธยฐาน Q₃ ค่าสูงสุด</b><small>และค่านอกเกณฑ์ (ถ้ามี)</small>'], ['4 แปลความหมาย', '<b>ค่ากลางและการกระจาย</b><small>เขียนข้อสรุปด้วยตนเอง</small>']])))
  ], () => { const F = m3GenF(); return [Q.m3Num({ q: 'จากตารางผลของโปรแกรม <b>IQR</b> ของข้อมูลเท่าใด', fig: m3OutTbl(F), a: F.q3 - F.q1, hint: 'Q₃ − Q₁', sig: 'out i', base: 'm3out', diff: 20 }), Q.m3PickT(m3GenF()),
    Q.m3Q({ data: m3Uniq(9, 10, 60), k: 'q2', sorted: true, med: true }), Q.m3Q({ data: shuffle(m3Gen(10, 20, 80)), k: 'q1' }), Q.m3Q({ data: shuffle(m3Gen(11, 20, 80)), k: 'q3' }), Q.m3PosQ(m3Pick([13, 17]), 'q3'), Q.m3HalfN(m3Pick([15, 19])),
    Q.m3XQ('q1'), Q.m3IqrQ(m3Uniq(10, 10, 60), true), Q.m3Read({ F: m3GenF5(), ask: 'q3' }), m3PctQ(m3Pick([1, 4])), m3SpreadQ(m3Pick([true, false])), m3CmpQ(m3Pick(['med', 'iqr'])), Q.m3OutPick(m3OutGen(1)), Q.m3FenceQ(m3OutGen(1), 'hi'),
    Q.m3Opt({ q: 'ข้อใดเป็นงานที่โปรแกรมช่วยทำให้ได้', opts: ['เรียงข้อมูลและคำนวณควอร์ไทล์', 'สรุปความหมายแทนเราได้ทุกครั้ง', 'แก้ข้อมูลที่กรอกผิดให้เอง', 'เลือกข้อมูลที่จะเก็บให้'], right: 'เรียงข้อมูลและคำนวณควอร์ไทล์', hint: 'โปรแกรมคำนวณได้ แต่การกรอกข้อมูลและแปลความหมายเป็นหน้าที่ของเรา', diff: 10 }),
    m3TF('โปรแกรมต่างกันอาจใช้วิธีหาควอร์ไทล์ต่างกัน ค่าจึงอาจต่างกันเล็กน้อย', true, 'ควรรู้ว่าโปรแกรมใช้วิธีใด')]; })
];
/* v234 (ผู้ใช้ขอ): เรียงด่านใหม่ — สร้าง/อ่านแผนภาพกล่องและการกระจายก่อน แล้วจึง IQR → เปรียบเทียบ → ค่านอกเกณฑ์ → โจทย์ประยุกต์
   (id เดิมไม่เปลี่ยน ดาวที่เก็บไว้จึงไม่หาย · เลขด่าน no และสีตามลำดับใหม่) */
[3601, 3602, 3603, 3604, 3605, 3608, 3609, 3610, 3607, 3611, 3612, 3606, 3613, 3614].map(id => LESSONS_M3C6.find(L => L.id === id)).forEach((L, k, arr) => { L.no = k + 1; L.tone = TONES5[(k + 2) % 6]; LESSONS_M3C6[k] = L; });
LESSONS_M3C6.find(L => L.id === 3604).pracQ = () => Q.m3Q({ data: [21, 15, 30, 18, 26, 24, 12, 28], k: 'q2' });

/* ---------- บอส: 20 ข้อ (แต่งใหม่ทั้งหมด · คำตอบคำนวณจาก m3Five) ---------- */
const m3BD1 = m3Five([3, 7, 8, 12, 15, 18, 21]), m3BD2 = m3Five([10, 14, 15, 19, 22, 25, 27, 30]), m3BD3 = m3Five([5, 9, 11, 12, 14, 16, 20, 23, 25, 31]), m3BD4 = m3FiveO([8, 13, 14, 15, 16, 18, 19, 20, 22, 41]);
const m3BF = { min: 20, q1: 35, q2: 48, q3: 56, max: 80 }, m3BA = { min: 30, q1: 45, q2: 52, q3: 60, max: 72 }, m3BB = { min: 25, q1: 38, q2: 47, q3: 64, max: 85 };
const m3BFig = () => m3BoxSVG([{ F: m3BF }], { lo: 10, hi: 90, step: 10, labels: 'val' });
const EXAM_M3C6 = xrot([
  { q: 'ข้อมูล 3, 7, 8, 12, 15, 18, 21 มีมัธยฐานเท่าใด', opts: [m3N(m3BD1.q2), '8', '15', '11.5'], a: 0 },
  { q: 'ข้อมูล 3, 7, 8, 12, 15, 18, 21 มี Q₁ เท่าใด', opts: [m3N(m3BD1.q1), '7.5', '8', '5'], a: 0 },
  { q: 'ข้อมูล 3, 7, 8, 12, 15, 18, 21 มี Q₃ เท่าใด', opts: [m3N(m3BD1.q3), '16.5', '15', '19.5'], a: 0 },
  { q: 'ข้อมูล 10, 14, 15, 19, 22, 25, 27, 30 มี Q₁ เท่าใด', opts: [m3N(m3BD2.q1), '14', '15', '12'], a: 0 },
  { q: 'ข้อมูล 10, 14, 15, 19, 22, 25, 27, 30 มีมัธยฐานเท่าใด', opts: [m3N(m3BD2.q2), '19', '22', '20'], a: 0 },
  { q: 'ข้อมูล 21 ตัวเรียงจากน้อยไปมากแล้ว Q₁ คือข้อใด', opts: ['ค่าเฉลี่ยของตัวที่ 5 กับตัวที่ 6', 'ตัวที่ 5', 'ตัวที่ 6', 'ตัวที่ 11'], a: 0 },
  { q: 'ข้อมูล 5, 9, 11, 12, 14, 16, 20, 23, 25, 31 มี IQR เท่าใด', opts: [m3N(m3BD3.q3 - m3BD3.q1), '26', '15', '9'], a: 0 },
  { q: 'ข้อมูลเรียงแล้ว 4, 6, x, 11, 13, 15, 18, 20 มี Q₁ = 7.5 x เท่าใด', opts: ['9', '7.5', '8', '10'], a: 0 },
  { q: 'ข้อมูลประมาณร้อยละเท่าใดที่มีค่ามากกว่า Q₃', opts: ['25%', '75%', '50%', '10%'], a: 0 },
  { q: 'จากแผนภาพกล่อง Q₁ มีค่าเท่าใด' + m3BFig(), opts: ['35', '20', '48', '56'], a: 0 },
  { q: 'จากแผนภาพกล่อง IQR เท่าใด' + m3BFig(), opts: ['21', '60', '13', '8'], a: 0 },
  { q: 'จากแผนภาพกล่อง ข้อมูลในช่วงใดกระจายมากที่สุด' + m3BFig(), opts: ['Q₃ ถึงค่าสูงสุด', 'ค่าต่ำสุดถึง Q₁', 'Q₁ ถึง Q₂', 'Q₂ ถึง Q₃'], a: 0 },
  { q: 'จากแผนภาพกล่อง ข้อมูลในช่วงใดกระจุกตัวมากที่สุด' + m3BFig(), opts: ['Q₂ ถึง Q₃', 'Q₃ ถึงค่าสูงสุด', 'ค่าต่ำสุดถึง Q₁', 'Q₁ ถึง Q₂'], a: 0 },
  { q: 'นักเรียน 160 คน สร้างแผนภาพกล่องของคะแนน มีนักเรียนประมาณกี่คนที่ได้คะแนนระหว่าง Q₁ กับ Q₃', opts: ['80 คน', '40 คน', '120 คน', '160 คน'], a: 0 },
  { q: 'จากรูป ห้องใดมีมัธยฐานของคะแนนสูงกว่า' + m3CmpFig(m3BA, m3BB), opts: ['ห้อง ก', 'ห้อง ข', 'เท่ากัน', 'บอกไม่ได้'], a: 0 },
  { q: 'จากรูป ห้องใดมีคะแนนกลุ่มกลาง 50% กระจายมากกว่า' + m3CmpFig(m3BA, m3BB), opts: ['ห้อง ข', 'ห้อง ก', 'เท่ากัน', 'บอกไม่ได้'], a: 0 },
  { q: `ข้อมูล 8, 13, 14, 15, 16, 18, 19, 20, 22, 41 มี Q₁ = ${m3N(m3BD4.q1)} และ Q₃ = ${m3N(m3BD4.q3)} ขอบเขตบนของค่านอกเกณฑ์เท่าใด`, opts: [m3N(m3BD4.hi), m3N(m3BD4.q3 + m3BD4.iqr), m3N(m3BD4.q3 + 2 * m3BD4.iqr), m3N(m3BD4.lo)], a: 0 },
  { q: 'ข้อมูล 8, 13, 14, 15, 16, 18, 19, 20, 22, 41 ค่าใดเป็นค่านอกเกณฑ์', opts: [m3BD4.outs.map(m3N).join(', '), '8', '8 และ 41', 'ไม่มีค่านอกเกณฑ์'], a: 0 },
  { q: 'ข้อใดกล่าว<b>ไม่ถูกต้อง</b>เกี่ยวกับแผนภาพกล่อง', opts: ['ช่วงที่ยาวกว่ามีจำนวนข้อมูลมากกว่า', 'กล่องแสดงข้อมูลประมาณ 50% ตรงกลาง', 'เส้นในกล่องคือมัธยฐาน', 'ค่านอกเกณฑ์เขียนเป็นจุดแยกจากวิสเกอร์'], a: 0 },
  { q: 'การใช้โปรแกรมสร้างแผนภาพกล่อง ข้อใดเป็นหน้าที่ของผู้ใช้', opts: ['ตรวจข้อมูลที่กรอกและแปลความหมายผลลัพธ์', 'เรียงข้อมูลด้วยมือก่อนทุกครั้ง', 'วาดกล่องด้วยไม้บรรทัด', 'คำนวณควอร์ไทล์ด้วยมือก่อนกรอก'], a: 0 }
], 2);
LESSONS_M3C6.push({ id: 3619, boss: true, place: 'ถ้ำหมีขาว', title: 'ด่านบอส: ม.3 บทที่ 6 สถิติ (3)', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'ตอบคำถามเรื่องควอร์ไทล์ แผนภาพกล่อง และค่านอกเกณฑ์ 20 ข้อ ตอบถูก 16 ข้อขึ้นไปเพื่อชนะหมีขาว',
  exam: EXAM_M3C6, pass: 16, bossName: 'หมีขาวสถิติ', bossPal: 'sky', emblem: 'Q', bossKind: 'pbear',
  winLine: 'ชนะหมีขาวแล้ว! อ่านควอร์ไทล์และแผนภาพกล่องได้คล่องมาก', loseLine: 'หมีขาวยังเฝ้าถ้ำอยู่ ลองทวนเรื่องแผนภาพกล่องอีกนิดแล้วมาสู้ใหม่นะ!' });
