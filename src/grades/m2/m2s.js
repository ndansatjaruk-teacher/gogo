/* =========================================================
   ม.2 บทที่ 7 สถิติ (2) — แผนภาพจุด · แผนภาพต้น-ใบ · ฮิสโทแกรม · ค่าเฉลี่ย มัธยฐาน ฐานนิยม (v238) — prefix s2
   ไฟล์นี้: ตัวช่วย รูป (แผนภาพจุด ต้น-ใบ ตารางความถี่ ฮิสโทแกรม) หน้าลงมือ และชนิดข้อ Q.s2Opt / Q.s2Num
   บทเรียน + บอสอยู่ใน m2l.js · โลกเมืองนักสืบข้อมูล (engine/detect.js) · ใช้คลาส CSS ของ m3 (.m3-tiles .m3-t .m3-out) ร่วมด้วย
   ฐานนิยม: ค่าที่มีความถี่สูงสุด อาจมีมากกว่า 1 ค่า · ทุกค่ามีความถี่เท่ากัน = ไม่มีฐานนิยม · ข้อมูลทั้งหมดเป็นข้อมูลสมมติ
   ========================================================= */
const s2R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const s2Pick = a => a[Math.floor(Math.random() * a.length)];
const s2Sort = a => [...a].sort((x, y) => x - y);
const s2N = x => (Math.round(x * 100) / 100).toLocaleString('en-US');
const s2Sum = a => a.reduce((s, v) => s + v, 0);
const s2Ok = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6; /* ตอบได้ด้วยทศนิยมไม่เกิน 2 ตำแหน่ง */
const s2Mean = a => s2Sum(a) / a.length;
const s2Med = arr => { const a = s2Sort(arr), n = a.length, m = n >> 1; return n % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
const s2Freq = a => { const m = new Map(); s2Sort(a).forEach(v => m.set(v, (m.get(v) || 0) + 1)); return m; };
const s2Modes = a => { const f = s2Freq(a), c = [...f.values()], mx = Math.max(...c); if (c.every(x => x === mx)) return []; return [...f].filter(([, k]) => k === mx).map(([v]) => v); };
const s2ModeTxt = a => { const m = s2Modes(a); return m.length ? m.map(s2N).join(' และ ') : 'ไม่มีฐานนิยม'; };
const s2Say = t => miSay(String(t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const s2Data = (n, lo, hi) => Array.from({ length: n }, () => s2R(lo, hi));
/* n integers in [lo, hi] whose mean is a whole number */
const s2DataMean = (n, lo, hi) => { for (let t = 0; t < 200; t++) { const d = s2Data(n - 1, lo, hi), need = (n - s2Sum(d) % n) % n; for (let k = 0; k < 6; k++) { const last = lo + need + n * s2R(0, Math.floor((hi - lo - need) / n)); if (last >= lo && last <= hi) { const a = [...d, last]; if (Number.isInteger(s2Mean(a))) return a; } } } return Array.from({ length: n }, (_, i) => lo + i); };
/* exactly one mode (kind 'one'), two modes ('two') or no mode ('none') */
const s2DataMode = (n, lo, hi, kind = 'one') => { for (let t = 0; t < 400; t++) { const d = s2Data(n, lo, hi), m = s2Modes(d); if (kind === 'one' ? m.length === 1 && s2Freq(d).get(m[0]) >= 3 : kind === 'two' ? m.length === 2 : m.length === 0 && s2Freq(d).size < n) return d; } return kind === 'none' ? [lo, lo, lo + 2, lo + 2, lo + 4, lo + 4] : [lo, lo, lo, lo + 1, lo + 2]; };
const S2COL = ['#3D9BE9', '#E36A8C', '#7C5CE0', '#2FB5A3', '#F0A020'];
const s2Tiles = (a, cls = '') => `<div class="m3-tiles ${cls}">${a.map(v => `<span class="m3-t">${typeof v === 'number' ? s2N(v) : v}</span>`).join('')}</div>`;

/* ---------- figures ---------- */
/* แผนภาพจุด: o = { lo, hi, step, W, col(v, k) → สี, mark: [[ค่า, ป้าย, สี]], unit, name } */
function s2DotSVG(arr, o = {}) {
  const a = s2Sort(arr), lo = o.lo ?? Math.min(...a), hi = o.hi ?? Math.max(...a), step = o.step || 1, W = o.W || 600, pad = 34, r = o.r || 9, cnt = {};
  a.forEach(v => cnt[v] = (cnt[v] || 0) + 1);
  const X = v => pad + (v - lo) / Math.max(step, hi - lo) * (W - 2 * pad), mx = Math.max(1, ...Object.values(cnt)), H = 24 + mx * (2 * r + 3) + (o.mark ? 58 : 40) + (o.unit ? 18 : 0), yAx = H - (o.mark ? 58 : 34) - (o.unit ? 18 : 0);
  const every = (hi - lo) / step > 22 ? 5 : (hi - lo) / step > 13 ? 2 : 1;
  let s = `<path d="M${pad - 16} ${yAx} H${W - pad + 16}" stroke="#2B2550" stroke-width="2.2"/>`;
  for (let i = 0, v = lo; v <= hi + 1e-9; i++, v = lo + i * step) { const lab = i % every === 0; s += `<path d="M${X(v)} ${yAx - (lab ? 6 : 4)} V${yAx + (lab ? 6 : 4)}" stroke="#2B2550" stroke-width="1.6"/>${lab ? `<text x="${X(v)}" y="${yAx + 23}" text-anchor="middle" class="m3-ax">${s2N(v)}</text>` : ''}`; }
  const k = {}; a.forEach(v => { k[v] = (k[v] || 0) + 1; const c = o.col ? o.col(v, k[v]) : '#7C5CE0'; s += `<circle cx="${X(v)}" cy="${yAx - 5 - r - (k[v] - 1) * (2 * r + 3)}" r="${r}" fill="${c}" stroke="#fff" stroke-width="1.6"/>`; });
  (o.mark || []).forEach(([v, t, c], j) => { s += `<path d="M${X(v)} ${yAx + 30} l-8 12 h16 z" fill="${c}"/><text x="${X(v)}" y="${yAx + 56}" text-anchor="middle" class="m3-lb" style="fill:${c}">${t}</text>`; });
  if (o.unit) s += `<text x="${W - pad + 16}" y="${yAx + (o.mark ? 74 : 44)}" text-anchor="end" class="m3-ax" style="font-size:14px">${o.unit}</text>`;
  return `<svg class="s2-dot" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
/* แผนภาพต้น-ใบ (จำนวนเต็มบวก ลำต้น = ค่า ÷ 10 ปัดลง ใบ = หลักหน่วย) · o.hl(v) → คลาสของใบ */
const s2Stems = a => { const s = s2Sort(a), lo = Math.floor(s[0] / 10), hi = Math.floor(s[s.length - 1] / 10); return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i); };
const s2StemHTML = (arr, o = {}) => { const a = s2Sort(arr), st = o.stems || s2Stems(a), k = a.find(v => v % 10) ?? a[0];
  return `<div class="s2-stem"><table><tr><th>ลำต้น</th><th>ใบ</th></tr>${st.map(t => `<tr><td>${t}</td><td>${a.filter(v => Math.floor(v / 10) === t).map(v => `<i class="${o.hl ? o.hl(v) || '' : ''}">${v % 10}</i>`).join('')}</td></tr>`).join('')}</table><small>${Math.floor(k / 10)} | ${k % 10} หมายถึง ${k}${o.unit ? ' ' + o.unit : ''}</small></div>`; };
/* ต้น-ใบสองด้าน: ใบของกลุ่มซ้ายอ่านจากขวาไปซ้าย */
const s2Stem2HTML = (A, B, na, nb, o = {}) => { const a = s2Sort(A), b = s2Sort(B), st = s2Stems([...a, ...b]), k = b.find(v => v % 10) ?? b[0], ka = a.find(v => v % 10) ?? a[0];
  return `<div class="s2-stem two"><table><tr><th class="l">${na}</th><th>ลำต้น</th><th>${nb}</th></tr>${st.map(t => `<tr><td class="l">${a.filter(v => Math.floor(v / 10) === t).reverse().map(v => `<i class="${o.hl ? o.hl(v, 'a') || '' : ''}">${v % 10}</i>`).join('')}</td><td>${t}</td><td>${b.filter(v => Math.floor(v / 10) === t).map(v => `<i class="${o.hl ? o.hl(v, 'b') || '' : ''}">${v % 10}</i>`).join('')}</td></tr>`).join('')}</table><small>${na}: ${ka % 10} | ${Math.floor(ka / 10)} หมายถึง ${ka}&emsp;${nb}: ${Math.floor(k / 10)} | ${k % 10} หมายถึง ${k}</small></div>`; };
/* ตารางความถี่แนวตั้ง rows = [[ค่า/ช่วง, ความถี่, (ช่องเพิ่ม)]] */
const s2FreqHTML = (rows, head = ['ข้อมูล', 'ความถี่'], o = {}) => `<div class="m3-out s2-ft"><table><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr>${rows.map((r, i) => `<tr class="${o.hl === i ? 'hl' : ''}">${r.map(c => `<td>${typeof c === 'number' ? s2N(c) : c}</td>`).join('')}</tr>`).join('')}${o.total != null ? `<tr class="tot"><td>รวม</td><td>${s2N(o.total)}</td>${head.length > 2 ? '<td></td>'.repeat(head.length - 2) : ''}</tr>` : ''}</table></div>`;
const s2FreqRows = a => [...s2Freq(a)].map(([v, f]) => [v, f]);
/* ช่วง: ตั้งแต่ lo แต่น้อยกว่า hi */
const s2Cls = (lo, w, n) => Array.from({ length: n }, (_, i) => ({ lo: lo + i * w, hi: lo + (i + 1) * w, f: 0 }));
const s2Bin = (data, cls) => cls.map(c => ({ ...c, f: data.filter(v => v >= c.lo && v < c.hi).length }));
const s2ClsTxt = c => `${s2N(c.lo)}–${s2N(c.hi)}`;
const s2ClsLong = c => `ตั้งแต่ ${s2N(c.lo)} แต่น้อยกว่า ${s2N(c.hi)}`;
/* ฮิสโทแกรม: cls = [{lo, hi, f}] ความกว้างเท่ากัน แท่งติดกัน · o = { x, W, H, hl: Set ของ index, ymax, labels, col } */
function s2HistSVG(cls, o = {}) {
  const W = o.W || 560, H = o.H || 290, l = 52, r = 16, t = 16, b = 56, fm = Math.max(1, ...cls.map(c => c.f)), st = fm > 24 ? 5 : fm > 12 ? 2 : 1, mx = o.ymax || Math.ceil((fm + (o.labels ? st : 0)) / st) * st, n = cls.length, bw = (W - l - r) / n, Y = f => H - b - f / mx * (H - t - b);
  let s = '';
  for (let f = 0; f <= mx; f += st) s += `<path d="M${l} ${Y(f)} H${W - r}" stroke="#E4DFF2" stroke-width="1"/><text x="${l - 8}" y="${Y(f) + 5}" text-anchor="end" class="m3-ax">${f}</text>`;
  cls.forEach((c, i) => { const on = o.hl && o.hl.has(i), col = o.col ? o.col(i) : on ? '#FFC34D' : '#8E7BE6'; s += `<rect x="${l + i * bw}" y="${Y(c.f)}" width="${bw}" height="${Y(0) - Y(c.f)}" fill="${col}" fill-opacity="${on ? 1 : .85}" stroke="#2B2550" stroke-width="1.8"/>`;
    if (o.labels && c.f) s += `<text x="${l + (i + .5) * bw}" y="${Y(c.f) - 7}" text-anchor="middle" class="m3-lb">${c.f}</text>`; });
  s += `<path d="M${l} ${t - 4} V${Y(0)} H${W - r + 6}" stroke="#2B2550" stroke-width="2.2" fill="none"/>`;
  cls.forEach((c, i) => { s += `<text x="${l + i * bw}" y="${Y(0) + 20}" text-anchor="middle" class="m3-ax">${s2N(c.lo)}</text>`; }); s += `<text x="${l + n * bw}" y="${Y(0) + 20}" text-anchor="middle" class="m3-ax">${s2N(cls[n - 1].hi)}</text>`;
  s += `<text x="${(l + W - r) / 2}" y="${H - 8}" text-anchor="middle" class="m3-nm">${o.x || 'ข้อมูล'}</text><text x="14" y="${(t + Y(0)) / 2}" text-anchor="middle" class="m3-nm" transform="rotate(-90 14 ${(t + Y(0)) / 2})">ความถี่</text>`;
  return `<svg class="s2-hist" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
/* แผนภูมิแท่ง (แท่งแยกกัน) ไว้เทียบกับฮิสโทแกรม */
function s2BarSVG(cats, o = {}) {
  const W = o.W || 560, H = o.H || 290, l = 52, r = 16, t = 16, b = 56, fm = Math.max(...cats.map(c => c[1])), st = fm > 12 ? 2 : 1, mx = Math.ceil(fm / st) * st, n = cats.length, bw = (W - l - r) / n, Y = f => H - b - f / mx * (H - t - b);
  let s = ''; for (let f = 0; f <= mx; f += st) s += `<path d="M${l} ${Y(f)} H${W - r}" stroke="#E4DFF2"/><text x="${l - 8}" y="${Y(f) + 5}" text-anchor="end" class="m3-ax">${f}</text>`;
  cats.forEach(([nm, f], i) => { s += `<rect x="${l + i * bw + bw * .2}" y="${Y(f)}" width="${bw * .6}" height="${Y(0) - Y(f)}" rx="3" fill="${S2COL[i % 5]}" stroke="#2B2550" stroke-width="1.6"/><text x="${l + (i + .5) * bw}" y="${Y(0) + 20}" text-anchor="middle" class="m3-ax">${nm}</text>`; });
  s += `<path d="M${l} ${t - 4} V${Y(0)} H${W - r + 6}" stroke="#2B2550" stroke-width="2.2" fill="none"/><text x="${(l + W - r) / 2}" y="${H - 8}" text-anchor="middle" class="m3-nm">${o.x || ''}</text>`;
  return `<svg class="s2-hist" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}
const s2Fig = html => h('div', { class: 'm3-figbox s2-fig', html });
const s2Wrap = () => h('div', { class: 'colstack no-side' }, h6wait());
const s2Folder = (top, big) => `<svg viewBox="0 0 40 30" class="s2-fd" aria-hidden="true"><path d="M2 6 h12 l3 3 h21 v19 h-36 z" fill="#E8C27A" stroke="#A8803A" stroke-width="1.4"/><path d="M2 11 h36 v17 h-36 z" fill="#F4D594" stroke="#A8803A" stroke-width="1.4"/></svg><small>${top}</small><b>${big}</b>`;

/* ---------- หน้าลงมือ ---------- */
/* เรียงแฟ้มหลักฐาน: แตะแฟ้มที่ค่าน้อยที่สุดที่ยังเหลือทีละแฟ้ม */
function s2SortSim(items, unit = '') {
  const pool = h('div', { class: 'm3-pool' }), row = h('div', { class: 'm3-sorted' }), out = fNote(), wrap = s2Wrap(); let k = 0; const order = s2Sort(items.map(x => x[1]));
  shuffle(items).forEach(([nm, v]) => { const b = h('button', { class: 'm3-card ia s2-card', html: s2Folder(nm, s2N(v)) }); b.onclick = e => { e.stopPropagation(); if (b.classList.contains('used')) return;
    if (v !== order[k]) { sfx.no(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); out.innerHTML = 'ยังไม่ใช่ — หาค่าที่<b>น้อยที่สุด</b>ที่ยังเหลือ'; return; }
    k++; b.classList.add('used'); row.append(h('span', { class: 'm3-t in', html: `${s2N(v)}<i>${k}</i>` })); sfx.pop(k); out.innerHTML = `เรียงแล้ว ${k} จาก ${order.length} แฟ้ม`;
    if (k === order.length) { out.innerHTML = `เรียงจากน้อยไปมากแล้ว ✓ — ค่าต่ำสุด <b>${s2N(order[0])}</b>${unit}&emsp;ค่าสูงสุด <b>${s2N(order[k - 1])}</b>${unit}`; sfx.ok(); teachDone(wrap); } }; pool.append(b); });
  wrap.append(h('div', { class: 'cap' }, 'แตะแฟ้มที่มีค่าน้อยที่สุดที่ยังเหลือทีละแฟ้ม'), pool, h('div', { class: 'cap' }, 'ข้อมูลที่เรียงแล้ว (ตัวเลขเล็กคือลำดับที่)'), row, out); return wrap;
}
/* นับความถี่: แตะข้อมูลทีละตัว ขีด | ลงในแถวของค่านั้น */
function s2TallySim(data, head = 'ข้อมูล') {
  const vals = [...s2Freq(data).keys()], tally = new Map(vals.map(v => [v, 0])), tiles = h('div', { class: 'm3-tiles big' }), tb = h('div', { class: 'm3-out s2-ft' }), out = fNote(), wrap = s2Wrap(); let got = 0, last = null;
  const draw = () => { tb.innerHTML = `<table><tr><th>${head}</th><th>รอยขีด</th><th>ความถี่</th></tr>${vals.map(v => `<tr class="${v === last ? 'hl' : ''}"><td>${s2N(v)}</td><td class="s2-tal">${'|'.repeat(tally.get(v)).replace(/\|\|\|\|\|/g, '<s>||||</s> ')}</td><td>${got === data.length ? tally.get(v) : ''}</td></tr>`).join('')}</table>`; };
  data.forEach(v => { const t = h('button', { class: 'm3-t ia', html: s2N(v) }); t.onclick = e => { e.stopPropagation(); if (t.classList.contains('used')) return; t.classList.add('used'); tally.set(v, tally.get(v) + 1); got++; last = v; sfx.pop(got % 7 + 1); draw();
    if (got === data.length) { const m = Math.max(...tally.values()); out.innerHTML = `ครบ ${data.length} ตัว — <b>ความถี่</b> = จำนวนครั้งที่ค่านั้นปรากฏ&emsp;ค่าที่มีความถี่มากที่สุดคือ <b>${vals.filter(x => tally.get(x) === m).map(s2N).join(' และ ')}</b>`; sfx.ok(); teachDone(wrap); } else out.innerHTML = `ขีดแล้ว ${got} จาก ${data.length} ตัว`; }; tiles.append(t); });
  draw(); wrap.append(h('div', { class: 'cap' }, 'แตะข้อมูลทีละตัว แล้วดูรอยขีดในตาราง'), h('div', { class: 's2-qrow' }, tiles, tb), out); return wrap;
}
/* สร้างแผนภาพจุด: แตะข้อมูลทีละตัว จุดตกลงเหนือค่าของมัน */
function s2DotBuild(data, o = {}) {
  const lo = o.lo ?? Math.min(...data), hi = o.hi ?? Math.max(...data), placed = [], tiles = h('div', { class: 'm3-tiles big' }), fig = h('div', { class: 'm3-figbox big s2-fig' }), out = fNote(), wrap = s2Wrap();
  const draw = last => { fig.innerHTML = s2DotSVG(placed.length ? placed : [], { lo, hi, step: o.step, unit: o.unit, col: (v, k) => v === last && k === placed.filter(x => x === v).length ? '#FFC34D' : '#7C5CE0' }); };
  data.forEach(v => { const t = h('button', { class: 'm3-t ia', html: s2N(v) }); t.onclick = e => { e.stopPropagation(); if (t.classList.contains('used')) return; t.classList.add('used'); placed.push(v); draw(v); sfx.pop(placed.length % 7 + 1);
    out.innerHTML = placed.length === data.length ? `ครบ ${data.length} จุด ✓ — <b>1 จุด แทนข้อมูล 1 ค่า</b>&emsp;ค่าซ้ำกันจุดจะซ้อนขึ้นไป` : `${s2N(v)} → จุดที่ ${placed.filter(x => x === v).length} เหนือ ${s2N(v)}`;
    if (placed.length === data.length) { sfx.ok(); teachDone(wrap); } }; tiles.append(t); });
  fig.innerHTML = s2DotSVG([lo], { lo, hi, step: o.step, unit: o.unit, col: () => 'transparent' }); wrap.append(h('div', { class: 'cap' }, o.cap || 'แตะข้อมูลทีละตัว วางจุดบนเส้นจำนวน'), tiles, fig, out); return wrap;
}
/* ปุ่มสำรวจ: แต่ละปุ่มไฮไลต์รูปและบอกคำอธิบาย ต้องแตะครบ (views = [[ชื่อปุ่ม, () => ({ fig, txt })]]) */
function s2Explore(views, cap, endTxt, base = '') {
  const fig = h('div', { class: 'm3-figbox big s2-fig' }), out = fNote(), wrap = s2Wrap(), seen = new Set();
  const row = h('div', { class: 'rowstack m3-parts' }, ...views.map(([t, fn], j) => h('button', { class: 'btn ia m3-part', style: { '--pc': S2COL[j % 5] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(j); const r = fn(); fig.innerHTML = r.fig; out.innerHTML = r.txt + (seen.size === views.length && endTxt ? `&emsp;✓ ${endTxt}` : ''); sfx.pop(seen.size + 1); if (seen.size === views.length) teachDone(wrap); } }, t)));
  fig.innerHTML = base; wrap.append(h('div', { class: 'cap', html: cap }), row, fig, out); return { wrap, fig, out };
}
/* สร้างแผนภาพต้น-ใบ: แตะข้อมูลทีละตัว ใบไปต่อท้ายลำต้นของมัน (เรียงให้) */
function s2StemBuild(data, unit = '') {
  const put = [], tiles = h('div', { class: 'm3-tiles big' }), fig = h('div', { class: 's2-fig' }), out = fNote(), wrap = s2Wrap(), st = s2Stems(data);
  const draw = last => { fig.innerHTML = put.length ? s2StemHTML(put, { stems: st, hl: v => v === last ? 'new' : '', unit }) : s2StemHTML([st[0] * 10], { stems: st, hl: () => 'gone' }); };
  data.forEach(v => { const t = h('button', { class: 'm3-t ia', html: s2N(v) }); t.onclick = e => { e.stopPropagation(); if (t.classList.contains('used')) return; t.classList.add('used'); put.push(v); draw(v); sfx.pop(put.length % 7 + 1);
    out.innerHTML = put.length === data.length ? `ครบแล้ว ✓ — <b>ลำต้น</b> = หลักสิบ&emsp;<b>ใบ</b> = หลักหน่วย เรียงจากน้อยไปมาก&emsp;ข้อมูลเดิมยังอ่านกลับได้ครบทุกตัว` : `${s2N(v)} → ลำต้น <b>${Math.floor(v / 10)}</b> ใบ <b>${v % 10}</b>`;
    if (put.length === data.length) { sfx.ok(); teachDone(wrap); } }; tiles.append(t); });
  draw(); wrap.append(h('div', { class: 'cap' }, 'แตะข้อมูลทีละตัว แยกเป็นลำต้น (หลักสิบ) กับใบ (หลักหน่วย)'), h('div', { class: 's2-qrow' }, tiles, fig), out); return wrap;
}
/* อ่านกลับ: แตะใบทีละใบ ดูค่าข้อมูลเดิม */
function s2StemRead(data, unit = '') {
  const a = s2Sort(data), wrap = s2Wrap(), fig = h('div', { class: 's2-fig s2-tapstem', html: s2StemHTML(a, { unit }) }), list = h('div', { class: 'm3-sorted' }), out = fNote(); const seen = new Set();
  fig.querySelectorAll('td:nth-child(2) i').forEach((el, i) => { el.classList.add('ia'); el.onclick = e => { e.stopPropagation(); if (seen.has(i)) return; seen.add(i); el.classList.add('done'); const stem = el.closest('tr').firstChild.textContent, v = +stem * 10 + +el.textContent; list.append(h('span', { class: 'm3-t in', html: s2N(v) })); sfx.pop(seen.size % 7 + 1);
    out.innerHTML = `ลำต้น ${stem} ใบ ${el.textContent} → <b>${v}</b>`; if (seen.size === a.length) { out.innerHTML = `ได้ข้อมูลเดิมครบ ${a.length} ตัว เรียงจากน้อยไปมากแล้ว ✓ ค่าต่ำสุด <b>${a[0]}</b> ค่าสูงสุด <b>${a[a.length - 1]}</b>`; sfx.ok(); teachDone(wrap); } }; });
  wrap.append(h('div', { class: 'cap' }, 'แตะใบทีละใบ แล้วอ่านกลับเป็นข้อมูลเดิม'), h('div', { class: 's2-qrow' }, fig, list), out); return wrap;
}
/* ใส่ข้อมูลลงช่วง (ตั้งแต่…แต่น้อยกว่า…) ฮิสโทแกรมโตขึ้นทีละข้อมูล */
function s2BinSim(data, cls, x = 'ข้อมูล') {
  let C = cls.map(c => ({ ...c, f: 0 })), got = 0; const tiles = h('div', { class: 'm3-tiles' }), fig = h('div', { class: 'm3-figbox s2-fig' }), tb = h('div'), out = fNote(), wrap = s2Wrap();
  const draw = j => { fig.innerHTML = s2HistSVG(C, { x, W: 520, H: 250, ymax: Math.max(...s2Bin(data, cls).map(c => c.f)) + 1, hl: j != null ? new Set([j]) : null, labels: true }); tb.innerHTML = s2FreqHTML(C.map(c => [s2ClsTxt(c), c.f]), ['ช่วง', 'ความถี่'], { hl: j }); };
  data.forEach(v => { const t = h('button', { class: 'm3-t ia', html: s2N(v) }); t.onclick = e => { e.stopPropagation(); if (t.classList.contains('used')) return; t.classList.add('used'); const j = C.findIndex(c => v >= c.lo && v < c.hi); C[j].f++; got++; draw(j); sfx.pop(got % 7 + 1);
    out.innerHTML = got === data.length ? 'ครบแล้ว ✓ — ฮิสโทแกรม: แท่งกว้างเท่าช่วง <b>ติดกัน</b> ความสูง = ความถี่ของช่วง' : `${s2N(v)} อยู่ในช่วง <b>${s2ClsLong(C[j])}</b>`; if (got === data.length) { sfx.ok(); teachDone(wrap); } }; tiles.append(t); });
  draw(null); wrap.append(h('div', { class: 'cap' }, 'แตะข้อมูลทีละตัว ใส่ลงช่วงของมัน (ช่วง 40–50 คือ ตั้งแต่ 40 แต่น้อยกว่า 50)'), tiles, h('div', { class: 's2-qrow' }, fig, tb), out); return wrap;
}
/* อ่านฮิสโทแกรม: แตะแท่งทีละแท่ง */
function s2HistRead(cls, x, unit = 'คน') {
  const fig = h('div', { class: 'm3-figbox big s2-fig' }), out = fNote(), wrap = s2Wrap(), seen = new Set(), tot = s2Sum(cls.map(c => c.f));
  const draw = j => { fig.innerHTML = s2HistSVG(cls, { x, hl: j != null ? new Set([j]) : null }); fig.querySelectorAll('rect').forEach((r, i) => { r.classList.add('ia'); r.style.cursor = 'pointer'; r.onclick = e => { e.stopPropagation(); seen.add(i); draw(i); sfx.pop(seen.size + 1);
    out.innerHTML = `ช่วง <b>${s2ClsLong(cls[i])}</b> มี <b>${cls[i].f}</b> ${unit}` + (seen.size === cls.length ? `&emsp;✓ รวมทุกแท่ง = ${tot} ${unit}` : ''); if (seen.size === cls.length) teachDone(wrap); }; }); };
  draw(null); wrap.append(h('div', { class: 'cap' }, 'แตะแท่งทีละแท่ง อ่านช่วงและความถี่'), fig, out); out.innerHTML = 'ความสูงของแท่ง = ความถี่ (อ่านจากแกนตั้ง)'; return wrap;
}
/* เกลี่ยก้อน: ย้ายก้อนจากหอที่สูงที่สุดไปหอที่เตี้ยที่สุด จนสูงเท่ากัน = ค่าเฉลี่ย */
function s2LevelSim(hs, names) {
  const H = hs.slice(), wrap = s2Wrap(), fig = h('div', { class: 's2-towers' }), out = fNote(), mean = s2Mean(hs);
  const draw = (from, to) => { fig.innerHTML = H.map((n, i) => `<div class="s2-tw ${i === from ? 'from' : i === to ? 'to' : ''}"><div class="s2-blk">${Array.from({ length: n }, (_, k) => `<i style="--c:${S2COL[i % 5]}"></i>`).join('')}</div><b>${n}</b><small>${names[i]}</small></div>`).join(''); };
  const btn = h('button', { class: 'btn info ia' }, icon('right'), h('span', null, 'เกลี่ย 1 ก้อน'));
  btn.onclick = e => { e.stopPropagation(); const mx = Math.max(...H), mn = Math.min(...H); if (mx - mn <= 0) return; const f = H.indexOf(mx), t = H.indexOf(mn); H[f]--; H[t]++; draw(f, t); sfx.pop(H[t] % 7 + 1);
    if (Math.max(...H) === Math.min(...H)) { btn.remove(); out.innerHTML = `ทุกหอสูง <b>${H[0]}</b> ก้อนเท่ากัน = <b>ค่าเฉลี่ย</b>&emsp;(${hs.join(' + ')}) ÷ ${hs.length} = ${s2Sum(hs)} ÷ ${hs.length} = <b>${s2N(mean)}</b>`; sfx.ok(); teachDone(wrap); } else out.innerHTML = `ย้ายจากหอที่สูงที่สุดไปหอที่เตี้ยที่สุด — ก้อนทั้งหมดยังเป็น ${s2Sum(hs)} ก้อนเท่าเดิม`; };
  draw(); out.innerHTML = `ก้อนทั้งหมด ${s2Sum(hs)} ก้อน ใน ${hs.length} หอ — กด <b>เกลี่ย 1 ก้อน</b> จนทุกหอสูงเท่ากัน`; wrap.append(fig, btn, out); return wrap;
}
/* ค่าเฉลี่ยจากตารางความถี่: แตะทีละแถว ได้ ค่า × ความถี่ */
function s2FreqMeanSim(rows, head = 'คะแนน') {
  const wrap = s2Wrap(), tb = h('div', { class: 'm3-out s2-ft' }), out = fNote(), done = new Set(), n = s2Sum(rows.map(r => r[1])), sum = s2Sum(rows.map(r => r[0] * r[1]));
  const draw = () => { tb.innerHTML = `<table><tr><th>${head} (x)</th><th>ความถี่ (f)</th><th>x × f</th></tr>${rows.map((r, i) => `<tr class="ia ${done.has(i) ? 'hl' : ''}" data-i="${i}"><td>${r[0]}</td><td>${r[1]}</td><td>${done.has(i) ? `${r[0]} × ${r[1]} = <b>${r[0] * r[1]}</b>` : '?'}</td></tr>`).join('')}<tr class="tot"><td>รวม</td><td>${n}</td><td>${done.size === rows.length ? `<b>${sum}</b>` : ''}</td></tr></table>`;
    tb.querySelectorAll('tr[data-i]').forEach(tr => tr.onclick = e => { e.stopPropagation(); const i = +tr.dataset.i; if (done.has(i)) return; done.add(i); sfx.pop(done.size + 1); draw();
      if (done.size === rows.length) { out.innerHTML = `ค่าเฉลี่ย = ผลรวมของ x × f ÷ จำนวนข้อมูล = ${sum} ÷ ${n} = <b>${s2N(sum / n)}</b>`; sfx.ok(); teachDone(wrap); } else out.innerHTML = 'ค่า x ซ้ำ f ครั้ง → รวมได้ x × f'; }); };
  draw(); out.innerHTML = 'แตะทีละแถว คูณค่ากับความถี่'; wrap.append(h('div', { class: 'cap' }, 'ข้อมูลซ้ำกันมาก ใช้ตารางความถี่ช่วยรวม'), tb, out); return wrap;
}
/* หาค่าที่หายไป: แตะค่าที่เป็นไปได้ของ x ดูว่าได้ค่าเฉลี่ยตามที่โจทย์บอกไหม */
function s2MissSim(arr, target, cands, unit = '') {
  const wrap = s2Wrap(), out = fNote(), list = h('div', { class: 'm3-qres' }); let ok = false; const n = arr.length, known = s2Sum(arr.filter(v => v !== 'x'));
  const row = h('div', { class: 'rowstack m3-parts' }, ...cands.map(c => h('button', { class: 'btn ia m3-part', onclick: e => { e.stopPropagation(); if (ok) return; const m = (known + c) / n, hit = Math.abs(m - target) < 1e-9; e.currentTarget.classList.add(hit ? 'on' : 'no');
    list.append(h('div', { class: 'm3-qr ' + (hit ? 'q3' : 'q2'), html: `x = ${c} → (${known} + ${c}) ÷ ${n} = <b>${s2N(m)}</b> ${hit ? '✓' : '✗'}` }));
    if (hit) { ok = true; sfx.ok(); out.innerHTML = `ทางลัด: ผลรวมต้องเป็น ${s2N(target)} × ${n} = ${s2N(target * n)} → x = ${s2N(target * n)} − ${known} = <b>${c}</b>`; teachDone(wrap); } else sfx.no(); } }, `x = ${c}`)));
  wrap.append(h('div', { class: 'cap', html: `ข้อมูล ${n} ตัว มี x หนึ่งตัว · ค่าเฉลี่ย = <b>${s2N(target)}</b>${unit}` }), h('div', { class: 'm3-datab', html: s2Tiles(arr) }), h('div', { class: 'cap' }, 'แตะค่าของ x ที่เป็นไปได้ทีละค่า'), row, list, out); return wrap;
}
/* มัธยฐาน: เรียงก่อน แล้วแตะตัวกลาง (จำนวนคู่แตะ 2 ตัว) */
function s2MedSim(data) {
  const wrap = s2Wrap(), a = s2Sort(data), n = a.length, mid = n % 2 ? [n >> 1] : [n / 2 - 1, n / 2], tiles = h('div', { class: 'm3-tiles big' }), out = fNote(), got = [];
  const sortBox = s2SortMini(data, () => { sortBox.remove(); show(); });
  const show = () => { a.forEach((v, i) => { const t = h('button', { class: 'm3-t ia', html: `${s2N(v)}<i>${i + 1}</i>` }); t.onclick = e => { e.stopPropagation(); if (got.length === mid.length) return;
    if (!mid.includes(i)) { sfx.no(); t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); out.innerHTML = `ยังไม่ใช่ — ข้อมูล ${n} ตัว ตัวกลางอยู่ตำแหน่ง ${n % 2 ? `ที่ ${(n + 1) / 2}` : `ที่ ${n / 2} และ ${n / 2 + 1}`}`; return; }
    if (got.includes(i)) return; got.push(i); t.classList.add('pick', 'q2'); sfx.pop(got.length + 2);
    if (got.length < mid.length) { out.innerHTML = 'ถูกแล้ว — แตะอีกตัวที่อยู่ตรงกลางด้วย'; return; }
    out.innerHTML = n % 2 ? `ข้อมูล ${n} ตัว (คี่) → ตัวที่ ${(n + 1) / 2} → มัธยฐาน = <b>${s2N(s2Med(a))}</b>` : `ข้อมูล ${n} ตัว (คู่) → ตัวที่ ${n / 2} กับ ${n / 2 + 1} → มัธยฐาน = (${s2N(a[mid[0]])} + ${s2N(a[mid[1]])}) ÷ 2 = <b>${s2N(s2Med(a))}</b>`; sfx.ok(); teachDone(wrap); }; tiles.append(t); });
    wrap.append(h('div', { class: 'cap' }, `เรียงแล้ว — แตะตัวที่อยู่ตรงกลาง${n % 2 ? '' : ' (มี 2 ตัว แตะทั้งคู่)'}`), tiles, out); out.innerHTML = 'ตำแหน่งของมัธยฐาน = (n + 1) ÷ 2'; };
  wrap.append(sortBox); return wrap;
}
/* เรียงข้อมูลแบบย่อ (แตะค่าที่น้อยที่สุดที่ยังเหลือ) แล้วเรียก onDone */
function s2SortMini(data, onDone) {
  const box = h('div', { class: 'colstack s2-sortmini' }), pool = h('div', { class: 'm3-tiles big' }), row = h('div', { class: 'm3-sorted' }), order = s2Sort(data); let k = 0;
  data.forEach(v => { const t = h('button', { class: 'm3-t ia', html: s2N(v) }); t.onclick = e => { e.stopPropagation(); if (t.classList.contains('used')) return; if (v !== order[k]) { sfx.no(); t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); return; }
    k++; t.classList.add('used'); row.append(h('span', { class: 'm3-t in', html: s2N(v) })); sfx.pop(k % 7 + 1); if (k === order.length) setTimeout(onDone, 450); }; pool.append(t); });
  box.append(h('div', { class: 'cap', html: '<b>หามัธยฐานต้องเรียงก่อน</b> — แตะค่าที่น้อยที่สุดที่ยังเหลือทีละตัว' }), pool, row); return box;
}
/* ค่าผิดปกติ: เปลี่ยนค่าสูงสุดทีละแบบ ดูค่าเฉลี่ย มัธยฐาน ฐานนิยม */
function s2OutlierSim(base, bigs, unit = '') {
  const wrap = s2Wrap(), fig = h('div', { class: 'm3-figbox big s2-fig' }), tb = h('div', { class: 's2-cmp' }), out = fNote(), seen = new Set(), hi = Math.max(...bigs) + 2, lo = Math.min(...base) - 1;
  const draw = big => { const d = [...base, big], mean = s2Mean(d), med = s2Med(d); fig.innerHTML = s2DotSVG(d, { lo, hi, step: 1, r: 7, W: 640, col: v => v === big ? '#E0445A' : '#7C5CE0', mark: [[mean, 'ค่าเฉลี่ย', '#E36A8C'], [med, 'มัธยฐาน', '#2FB5A3']] });
    tb.innerHTML = `<span style="--pc:#E36A8C">ค่าเฉลี่ย <b>${s2N(mean)}</b></span><span style="--pc:#2FB5A3">มัธยฐาน <b>${s2N(med)}</b></span><span style="--pc:#7C5CE0">ฐานนิยม <b>${s2ModeTxt(d)}</b></span>`; };
  const row = h('div', { class: 'rowstack m3-parts' }, ...bigs.map((b, j) => h('button', { class: 'btn ia m3-part', style: { '--pc': S2COL[j % 5] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(j); draw(b); sfx.pop(seen.size + 1);
    out.innerHTML = j ? `ค่าสูงสุดเปลี่ยนเป็น ${b}${unit} — <b>ค่าเฉลี่ยขยับตาม</b> แต่มัธยฐานกับฐานนิยมแทบไม่เปลี่ยน` : 'ข้อมูลปกติ ค่ากลางทั้งสามใกล้กัน';
    if (seen.size === bigs.length) { out.innerHTML += '&emsp;✓ ข้อมูลที่มีค่าผิดปกติ (สูงหรือต่ำมาก) <b>มัธยฐาน</b>เป็นตัวแทนได้ดีกว่าค่าเฉลี่ย'; sfx.ok(); teachDone(wrap); } } }, `ค่าสูงสุด = ${b}`)));
  draw(bigs[0]); out.innerHTML = 'แตะปุ่มทีละปุ่ม'; wrap.append(h('div', { class: 'cap' }, 'แตะเปลี่ยนค่าสูงสุดของข้อมูล แล้วดูค่ากลางทั้งสาม'), row, fig, tb, out); return wrap;
}
/* ข้อความนักสืบ: แตะตรวจว่าจริงหรือไม่ */
function s2ClaimSim(claims, fig) {
  const wrap = s2Wrap(), out = fNote(), list = h('div', { class: 's2-claims' }), seen = new Set();
  claims.forEach(([t, ok, why], i) => { const b = h('button', { class: 'btn ia s2-claim' }, h('span', { html: t })); b.onclick = e => { e.stopPropagation(); if (seen.has(i)) return; seen.add(i); b.classList.add(ok ? 'yes' : 'no'); b.append(h('em', { html: (ok ? '✓ จริง — ' : '✗ ไม่จริง — ') + why })); sfx.pop(seen.size + 1);
    if (seen.size === claims.length) { out.innerHTML = 'ตรวจครบทุกข้อ ✓ ก่อนเชื่อข้อสรุป ให้ตรวจกับข้อมูลเสมอ'; sfx.ok(); teachDone(wrap); } }; list.append(b); });
  wrap.append(h('div', { class: 'cap' }, 'แตะข้อความทีละข้อ ตรวจกับข้อมูลว่าจริงไหม'), fig ? s2Fig(fig) : '', list, out); return wrap;
}

/* ---------- ชนิดข้อ ---------- */
Q.s2Opt = ({ q, fig, tiles, opts, right, hint, sig, base, diff }) => ({ prompt: q, say: s2Say(q), __sig: 's2o ' + (sig || q + right), ...(base ? { __base: base, __baseCap: 2 } : {}), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { const ch = choices(ctx, shuffle(opts.map(o => ({ value: o, label: o }))), right, { hint }); if (opts.some(o => String(o).replace(/<[^>]+>/g, '').length > 8)) ch.querySelectorAll('.opt').forEach(x => x.classList.add('txt'));
    bd.append(h('div', { class: 'colstack' }, tiles ? h('div', { class: 'm3-data', html: s2Tiles(tiles) }) : '', fig ? s2Fig(fig) : '', ch)); } });
Q.s2Num = ({ q, fig, tiles, a, unit, hint, sig, base, diff }) => ({ prompt: q, say: s2Say(q), __sig: 's2n ' + (sig || q), ...(base ? { __base: base, __baseCap: 2 } : {}), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { bd.append(h('div', { class: fig ? 's2-qrow' : 'colstack' }, tiles ? h('div', { class: 'm3-data', html: s2Tiles(tiles) }) : '', fig ? s2Fig(fig) : '', miAns(ctx, a, { unit, hint }))); } });
const s2TF = (text, ok, why) => Q.hTF({ text, ok: !!ok, why });
