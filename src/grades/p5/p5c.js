/* =========================================================
   ป.5 บทที่ 3 การนำเสนอข้อมูล — bar charts (with broken scale), double bar charts, line graphs:
   chart engine, interactive reading/building sims, question types (g…), levels 571–582 + boss 589
   ========================================================= */
const GCOL = ['#FF7BA6', '#4FB3F0', '#FFB23E', '#3FC98F', '#9F8FF0'];
const GSOLO = '#FF8FB1';
/* spec: { kind:'bar'|'line', title, yName, xName, cats:[..], series:[{ name, v:[..], col }], min (axis start; >0 = broken), max, step, horiz, nolab } */
function chartGeom(spec) {
  const W = 640, H = 390, ns = spec.series.length, MT = ns > 1 ? 58 : 40, MB = 64, ML = 70, MR = 22, base = H - MB, br = (spec.min || 0) > 0, gap = br ? 26 : 0;
  const top = MT, span = base - gap - top, lo = spec.min || 0, hi = spec.max;
  const y = v => br ? (v <= lo ? base - gap * Math.max(0, v) / lo : base - gap - (v - lo) / (hi - lo) * span) : base - v / hi * (base - top);
  const yInv = py => br ? lo + (base - gap - py) / span * (hi - lo) : (base - py) / (base - top) * hi;
  const n = spec.cats.length, band = (W - ML - MR) / n, x0 = c => ML + band * c;
  return { W, H, MT, MB, ML, MR, base, br, gap, top, lo, hi, y, yInv, n, band, x0, ns };
}
const niceStep = r => { const p = 10 ** Math.floor(Math.log10(r / 6)); for (const m of [1, 2, 2.5, 5, 10]) if (r / (m * p) <= 7) return m * p; return 10 * p; };
const gNum = v => fmtDec(decStr(DQ(String(v))));
function chartSVG(spec, st = {}) {
  if (spec.horiz) return chartSVGh(spec, st);
  const G = chartGeom(spec), { W, H, base, ML, MR, top, y, band, x0, ns, br, gap } = G, vals = st.vals || spec.series.map(s => s.v), line = spec.kind === 'line';
  const col = si => spec.series[si].col || (ns > 1 ? GCOL[si] : line ? '#E5487A' : GSOLO);
  let s = `<svg viewBox="0 0 ${W} ${H}" class="gch-svg" aria-hidden="true">`;
  // grid + y ticks
  for (let t = G.lo; t <= G.hi + 1e-9; t = +(t + spec.step).toFixed(6)) { const yy = y(t); s += `<path d="M${ML} ${yy} H${W - MR}" stroke="#E4DEF0" stroke-width="1.2"/><path d="M${ML - 6} ${yy} H${ML}" stroke="#2B2550" stroke-width="2"/><text x="${ML - 10}" y="${yy + 5}" text-anchor="end" class="gt">${gNum(t)}</text>`; }
  if (br) s += `<text x="${ML - 10}" y="${base + 5}" text-anchor="end" class="gt">0</text>`;
  // axes (with zig-zag break)
  s += br ? `<path d="M${ML} ${top - 14} V${base - gap} l9 4 l-18 7 l18 7 l-9 4 V${base}" fill="none" stroke="#2B2550" stroke-width="2.4" stroke-linejoin="round"/>` : `<path d="M${ML} ${top - 14} V${base}" stroke="#2B2550" stroke-width="2.4"/>`;
  s += `<path d="M${ML} ${base} H${W - MR + 6}" stroke="#2B2550" stroke-width="2.4"/><path d="M${ML - 6} ${top - 8} L${ML} ${top - 18} L${ML + 6} ${top - 8}" fill="none" stroke="#2B2550" stroke-width="2.4"/>`;
  if (spec.yName) s += `<text x="${ML - 4}" y="${top - 24}" class="gyn">${spec.yName}</text>`;
  if (spec.xName) s += `<text x="${W - MR + 4}" y="${base + 52}" text-anchor="end" class="gyn">${spec.xName}</text>`;
  // category labels
  spec.cats.forEach((c, ci) => { const cx = x0(ci) + band / 2, lines = String(c).split('\n'), hl = st.hlc && st.hlc.includes(ci);
    lines.forEach((ln, k) => s += `<text x="${cx}" y="${base + 22 + k * 15}" text-anchor="middle" class="gc${hl ? ' on' : ''}">${ln}</text>`); });
  // legend
  if (ns > 1) { let lx = W - MR - spec.series.reduce((a, se) => a + 34 + se.name.length * 10.5, 0); spec.series.forEach((se, si) => { const off = st.off && st.off.includes(si); s += `<g class="glg${off ? ' off' : ''}" data-s="${si}"><rect x="${lx}" y="10" width="16" height="16" rx="4" fill="${col(si)}"/><text x="${lx + 22}" y="23" class="gl">${se.name}</text></g>`; lx += 34 + se.name.length * 10.5; }); }
  const lab = (x, yy, v, rot, si) => spec.nolab && !(st.show && st.show.includes(si)) ? '' : rot ? `<text transform="translate(${x + 4} ${yy - 6}) rotate(-90)" class="gv">${gNum(v)}</text>` : `<text x="${x}" y="${yy - 7}" text-anchor="middle" class="gv">${gNum(v)}</text>`;
  if (!line) {
    const gw = band * (ns > 1 ? .78 : .5), bw = gw / ns, rot = ns > 1 || vals.some(v => v.some(x => gNum(x).length > 5));
    vals.forEach((vs, si) => { if (st.off && st.off.includes(si)) return; vs.forEach((v, ci) => { if (v == null) return; const bx = x0(ci) + (band - gw) / 2 + si * bw, by = y(v), key = ci + ':' + si;
      const cls = (st.hl && st.hl.includes(key) ? ' on' : '') + (st.ok && st.ok.includes(key) ? ' ok' : '') + (st.bad && st.bad.includes(key) ? ' bad' : '');
      s += `<rect class="gbar${cls}" data-c="${ci}" data-s="${si}" x="${bx + 1}" y="${by}" width="${bw - 2}" height="${Math.max(0, base - by)}" rx="3" fill="${col(si)}"/>`;
      if (st.handles) s += `<circle class="ghd" cx="${bx + bw / 2}" cy="${by}" r="9" fill="#fff" stroke="${col(si)}" stroke-width="3"/>`;
      s += lab(bx + bw / 2, by, v, rot, si); }); });
  } else {
    vals.forEach((vs, si) => { if (st.off && st.off.includes(si)) return; const pts = vs.map((v, ci) => v == null ? null : [x0(ci) + band / 2, y(v)]);
      const segs = []; pts.forEach((p, k) => { if (p && pts[k + 1]) segs.push(`M${p[0]} ${p[1]} L${pts[k + 1][0]} ${pts[k + 1][1]}`); });
      s += `<path d="${segs.join(' ')}" stroke="${col(si)}" stroke-width="3.2" fill="none" stroke-linecap="round" class="gln"/>`;
      if (st.seg != null && pts[st.seg] && pts[st.seg + 1]) s += `<path d="M${pts[st.seg][0]} ${pts[st.seg][1]} L${pts[st.seg + 1][0]} ${pts[st.seg + 1][1]}" stroke="${vs[st.seg + 1] >= vs[st.seg] ? '#2FBF7C' : '#E5505E'}" stroke-width="7" stroke-linecap="round" opacity=".75"/>`;
      pts.forEach((p, ci) => { if (!p) return; const key = ci + ':' + si, cls = (st.hl && st.hl.includes(key) ? ' on' : '') + (st.ok && st.ok.includes(key) ? ' ok' : '');
        s += `<circle class="gpt${cls}" data-c="${ci}" data-s="${si}" cx="${p[0]}" cy="${p[1]}" r="${st.handles ? 10 : 6}" fill="${st.handles ? '#fff' : col(si)}" stroke="${col(si)}" stroke-width="3"/>`;
        s += lab(p[0], p[1] - 4, vs[ci], false, si); }); });
  }
  // reading guide: dashed line from the value to the axis
  if (st.guide) st.guide.forEach(([ci, si]) => { const v = vals[si][ci]; if (v == null) return; const gw = band * (ns > 1 && !line ? .78 : .5), bw = gw / ns, cx = line ? x0(ci) + band / 2 : x0(ci) + (band - gw) / 2 + si * bw + bw / 2, yy = y(v);
    s += `<path d="M${cx} ${yy} H${ML}" stroke="#2B2550" stroke-width="2" stroke-dasharray="6 5"/><g transform="translate(${Math.min(cx + 12, W - 120)} ${yy - 34})"><rect width="${gNum(v).length * 10 + 26}" height="28" rx="9" fill="#2B2550"/><text x="13" y="20" class="gbub">${gNum(v)}</text></g>`; });
  if (st.diff) { const [[c1, s1], [c2, s2]] = st.diff, v1 = vals[s1][c1], v2 = vals[s2][c2], gx = W - MR - 30; s += `<path d="M${gx} ${y(v1)} H${gx + 10} V${y(v2)} H${gx}" stroke="#E5505E" stroke-width="3" fill="none"/><path d="M${ML} ${y(v1)} H${gx}" stroke="#E5505E" stroke-width="1.5" stroke-dasharray="4 4"/><path d="M${ML} ${y(v2)} H${gx}" stroke="#E5505E" stroke-width="1.5" stroke-dasharray="4 4"/>`; }
  return s + '</svg>';
}
function chartSVGh(spec, st = {}) { // horizontal grouped bars (no break)
  const W = 640, H = 330, ns = spec.series.length, ML = 92, MR = 26, MT = 40, MB = 64, base = ML, right = W - MR, n = spec.cats.length, band = (H - MT - MB) / n, x = v => base + v / spec.max * (right - base);
  const col = si => spec.series[si].col || GCOL[si]; let s = `<svg viewBox="0 0 ${W} ${H}" class="gch-svg" aria-hidden="true">`;
  for (let t = 0; t <= spec.max; t += spec.step) s += `<path d="M${x(t)} ${MT} V${H - MB}" stroke="#E4DEF0" stroke-width="1.2"/><text x="${x(t)}" y="${H - MB + 20}" text-anchor="middle" class="gt">${gNum(t)}</text>`;
  s += `<path d="M${base} ${MT - 10} V${H - MB} H${right + 6}" fill="none" stroke="#2B2550" stroke-width="2.4"/>`;
  if (spec.xName) s += `<text x="${right}" y="${H - MB + 42}" text-anchor="end" class="gyn">${spec.xName}</text>`;
  if (spec.yName) s += `<text x="8" y="${MT - 18}" class="gyn">${spec.yName}</text>`;
  spec.cats.forEach((c, ci) => { const cy = H - MB - band * (ci + .5); s += `<text x="${base - 10}" y="${cy + 5}" text-anchor="end" class="gc">${c}</text>`;
    const gh = band * .7, bh = gh / ns; spec.series.forEach((se, si) => { const by = cy - gh / 2 + si * bh, key = ci + ':' + si; s += `<rect class="gbar${st.hl && st.hl.includes(key) ? ' on' : ''}" data-c="${ci}" data-s="${si}" x="${base}" y="${by}" width="${x(se.v[ci]) - base}" height="${bh - 2}" fill="${col(si)}" stroke="#2B2550" stroke-width="1.4" rx="3"/>`;
      if (!spec.nolab) s += `<text x="${x(se.v[ci]) + 6}" y="${by + bh / 2 + 4}" class="gv">${gNum(se.v[ci])}</text>`; }); });
  let lx = ML; spec.series.forEach((se, si) => { s += `<rect x="${lx}" y="${H - 20}" width="16" height="16" rx="4" fill="${col(si)}" stroke="#2B2550" stroke-width="1.4"/><text x="${lx + 22}" y="${H - 7}" class="gl">${se.name}</text>`; lx += 40 + se.name.length * 11; });
  return s + '</svg>';
}
/* chart element with optional tapping; returns wrapper with .draw(st) */
function dataChart(spec, o = {}) {
  const box = h('div', { class: 'gch' + (o.sm ? ' sm' : '') + (o.onTap ? ' ia tapc' : '') }, spec.title ? h('div', { class: 'gch-t' }, spec.title) : null), pic = h('div', { class: 'gch-p' }); box.append(pic);
  let st = o.st || {}; box.draw = (s2 = st) => { st = s2; pic.innerHTML = chartSVG(spec, st); }; box.state = () => st; box.draw();
  if (o.onTap) pic.addEventListener('click', e => { const t = e.target.closest('[data-c]'), lg = e.target.closest('.glg'); e.stopPropagation();
    if (lg && o.onLegend) return o.onLegend(+lg.dataset.s); if (t) o.onTap(+t.dataset.c, +t.dataset.s);
    else if (o.nearest) { const r = pic.firstChild.getBoundingClientRect(), G = chartGeom(spec), px = (e.clientX - r.left) / r.width * G.W, ci = Math.floor((px - G.ML) / G.band); if (ci >= 0 && ci < G.n) o.onTap(ci, 0); } });
  return box;
}
const gTable = (spec, o = {}) => { const hd = h('tr', null, h('th', null, spec.xName || ''), ...spec.series.map(se => h('th', null, spec.series.length > 1 ? se.name : (spec.yName || 'จำนวน'))));
  const t = h('table', { class: 'gtbl' + (o.sm ? ' sm' : '') }, h('thead', null, hd), h('tbody', null, ...spec.cats.map((c, ci) => h('tr', { class: o.hl === ci ? 'on' : '' }, h('td', null, String(c).replace('\n', ' ')), ...spec.series.map(se => h('td', { class: 'num' }, gNum(se.v[ci])))))));
  return h('div', { class: 'gtbl-w' }, spec.title && !o.notitle ? h('div', { class: 'gch-t' }, spec.title) : null, t); };
const gCat = (spec, ci) => String(spec.cats[ci]).replace('\n', '');

/* builder: drag bars / points to the values in a table */
function chartBuilder(spec, o = {}) {
  const G = chartGeom(spec), snap = spec.snap || spec.step / 10, tol = spec.tol != null ? spec.tol : snap, init = spec.series.map(se => se.v.map(() => o.empty ? null : spec.min || 0));
  const vals = spec.series.map((se, si) => se.v.map((_, ci) => init[si][ci] == null ? (spec.kind === 'line' ? null : (spec.min || 0)) : init[si][ci]));
  let ok = [], drag = null; const box = h('div', { class: 'gch build ia' }, spec.title ? h('div', { class: 'gch-t' }, spec.title) : null), pic = h('div', { class: 'gch-p' }); box.append(pic);
  const draw = () => { pic.innerHTML = chartSVG(spec, { vals, handles: true, ok }); }; draw();
  const toV = py => { let v = G.yInv(py); v = Math.round(v / snap) * snap; return Math.max(spec.min || 0, Math.min(G.hi, +v.toFixed(6))); };
  const pt = e => { const sv = pic.firstChild, r = sv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * G.W, (e.clientY - r.top) / r.height * G.H]; };
  pic.addEventListener('pointerdown', e => { const [px, py] = pt(e), ci = Math.floor((px - G.ML) / G.band); if (ci < 0 || ci >= G.n) return; e.preventDefault();
    let si = 0; if (G.ns > 1 && spec.kind !== 'line') { const gw = G.band * .78, bw = gw / G.ns; si = Math.max(0, Math.min(G.ns - 1, Math.floor((px - G.x0(ci) - (G.band - gw) / 2) / bw))); }
    else if (G.ns > 1) { let bd = 1e9; vals.forEach((vs, k) => { const d = Math.abs(G.y(vs[ci] == null ? G.lo : vs[ci]) - py); if (d < bd) { bd = d; si = k; } }); }
    drag = [ci, si]; try { pic.setPointerCapture(e.pointerId); } catch (_) {} vals[si][ci] = toV(py); ok = ok.filter(k => k !== ci + ':' + si); draw(); o.onChange && o.onChange(vals); sfx.tap(); });
  pic.addEventListener('pointermove', e => { if (!drag) return; const [, py] = pt(e); vals[drag[1]][drag[0]] = toV(py); draw(); o.onChange && o.onChange(vals); });
  const up = () => { if (drag) sfx.pop(3); drag = null; }; pic.addEventListener('pointerup', up); pic.addEventListener('pointercancel', up);
  box.check = () => { const wrong = []; ok = []; spec.series.forEach((se, si) => se.v.forEach((t, ci) => { const v = vals[si][ci]; if (v != null && Math.abs(v - t) <= tol + 1e-9) { ok.push(ci + ':' + si); vals[si][ci] = t; } else wrong.push([ci, si]); })); draw(); return wrong; };
  box.fill = () => { spec.series.forEach((se, si) => se.v.forEach((t, ci) => vals[si][ci] = t)); box.check(); };
  box.vals = () => vals; return box;
}

/* =========================================================
   QUESTION TYPES (prefix g…)
   ========================================================= */
Object.assign(Q, {
  /* read / compute a number from a chart */
  gAsk({ chart, q, a, unit = '', hint, say: sy }) {
    return { prompt: q, say: sy || q.replace(/<[^>]+>/g, ''),
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack gq' }, dataChart(chart, { sm: true }), decAnswer(ctx, DQ(String(a).replace(/,/g, '')), { hint: hint || 'อ่านค่าจากปลายแท่ง/จุด แล้วคำนวณตามคำถาม', unit }))); } };
  },
  /* choose an answer (category names / statements) */
  gPick({ chart, q, opts, right, hint, say: sy }) {
    return { prompt: q, say: sy || q.replace(/<[^>]+>/g, ''),
      mount(bd, ctx) { const ch = choices(ctx, shuffle(opts).map(o => ({ value: o, label: `<span class="dtxt">${o}</span>` })), right, { hint }); ch.querySelectorAll('.opt').forEach(x => x.classList.add('txt'));
        bd.append(h('div', { class: 'rowstack gq' }, chart ? dataChart(chart, { sm: true }) : null, ch)); } };
  },
  /* draw the chart from a table (drag bars / points) */
  gBuild({ chart }) {
    const line = chart.kind === 'line';
    return { prompt: `${line ? 'เขียนกราฟเส้น' : chart.series.length > 1 ? 'เขียนแผนภูมิแท่งเปรียบเทียบ' : 'เขียนแผนภูมิแท่ง'}จากตาราง <small>(ลาก${line ? 'จุด' : 'แท่ง'}ขึ้นลงให้ตรงกับข้อมูล)</small>`, say: `${line ? 'เขียนกราฟเส้น' : 'เขียนแผนภูมิแท่ง'}จากตาราง ลากขึ้นลงให้ตรงกับข้อมูล`,
      mount(bd, ctx) { const b = chartBuilder(chart, { empty: line }), msg = h('div', { class: 'pad-msg' });
        const btn = checkButton('ตรวจ', () => { const w = b.check(); if (!w.length) { btn.remove(); msg.textContent = ''; ctx.check(true); } else { msg.textContent = `ยังไม่ตรง ${w.length} ${line ? 'จุด' : 'แท่ง'} (สีจาง) ลองดูเส้นตารางอีกครั้ง`; ctx.check(false, 'ดูค่าบนแกนตั้ง: เส้นตารางแต่ละช่องมีค่าเท่าไร แล้วลากให้ตัวเลขบน' + (line ? 'จุด' : 'แท่ง') + 'ตรงกับตาราง'); } });
        bd.append(h('div', { class: 'rowstack gq' }, gTable(chart, { sm: true }), h('div', { class: 'colstack' }, b, btn, msg))); } };
  }
});

/* =========================================================
   TEACHING SIMULATIONS
   ========================================================= */
/* why a broken scale? slide the axis start and watch the differences grow */
function simBreak(spec, start0 = 0) {
  const full = { ...spec, min: 0, max: spec.max, step: niceStep(spec.max) }; let s0 = start0; const out = fNote(), wrap = h('div');
  const half = Math.round(spec.min / 2 / spec.step) * spec.step, uniq = [...new Set([0, half, spec.min].filter(v => v >= 0))];
  const draw = () => { const sp = s0 ? { ...spec, min: s0, step: niceStep(spec.max - s0) } : full; wrap.innerHTML = ''; wrap.append(dataChart(sp));
    out.innerHTML = s0 ? `แกนตั้งเริ่มที่ 0 แล้ว<b>ข้าม (ย่น)</b>ไปเริ่มที่ <b>${gNum(s0)}</b> — รอยหยัก ⌇ บอกว่าตัดช่วงนี้ออก ความต่างของแต่ละแท่งจึง<b>เห็นชัดขึ้น</b>` : 'แกนตั้งเริ่มที่ 0 ทุกแท่งสูงเกือบเท่ากัน <b>ดูความต่างยาก</b> — ลองกดย่นระยะ'; };
  const st = h('div', { class: 'rowstack' }, ...uniq.map(v => { const b = h('button', { class: 'btn sm ia' + (v === s0 ? ' on' : '') }, v ? `เริ่มที่ ${gNum(v)}` : 'เริ่มที่ 0'); b.onclick = e => { e.stopPropagation(); s0 = v; st.querySelectorAll('.btn').forEach(x => x.classList.toggle('on', x === b)); sfx.pop(3); draw(); }; return b; }));
  draw(); return h('div', { class: 'colstack' }, wrap, h('div', { class: 'cap' }, 'ย่นระยะแกนตั้ง:'), st, out);
}
/* tap bars to read them; tap two bars to see the difference */
function simReadBar(spec) {
  const out = fNote(); let picks = [];
  const c = dataChart(spec, { onTap: (ci, si) => { picks.push([ci, si]); if (picks.length > 2) picks = [[ci, si]]; sfx.pop(picks.length * 2);
    const v = k => spec.series[picks[k][1]].v[picks[k][0]], nm = k => gCat(spec, picks[k][0]) + (spec.series.length > 1 ? ` (${spec.series[picks[k][1]].name})` : '');
    c.draw({ guide: picks, hl: picks.map(p => p.join(':')), diff: picks.length === 2 ? picks : null });
    out.innerHTML = picks.length === 1 ? `<b>${nm(0)}</b> = ${gNum(v(0))} ${spec.unit || ''} — ลากสายตาจากปลายแท่งไปที่แกนตั้ง · แตะอีกแท่งเพื่อเปรียบเทียบ` : `${nm(0)} ${gNum(v(0))} · ${nm(1)} ${gNum(v(1))} → ต่างกัน <b>${gNum(Math.abs(v(0) - v(1)))}</b> ${spec.unit || ''}`; } });
  out.innerHTML = '<b>แตะแท่ง</b>เพื่ออ่านค่า แตะ 2 แท่งเพื่อหาผลต่าง'; return h('div', { class: 'colstack' }, c, out);
}
/* double bar chart: legend on/off, tap a category for both values */
function simDouble(spec) {
  const out = fNote(); let off = [], c;
  const show = ci => { const vs = spec.series.map(se => se.v[ci]); c.draw({ off, hlc: [ci], guide: spec.series.map((_, si) => [ci, si]).filter(([, si]) => !off.includes(si)), hl: spec.series.map((_, si) => ci + ':' + si) });
    out.innerHTML = `<b>${gCat(spec, ci)}</b>: ` + spec.series.map((se, si) => `<span class="gsw" style="background:${se.col || GCOL[si]}"></span>${se.name} ${gNum(vs[si])}`).join(', ') + (vs.length === 2 ? ` → ต่างกัน <b>${gNum(Math.abs(vs[0] - vs[1]))}</b>` : ''); sfx.pop(ci + 2); };
  c = dataChart(spec, { onTap: ci => show(ci), onLegend: si => { off = off.includes(si) ? off.filter(x => x !== si) : [...off, si]; if (off.length === spec.series.length) off = []; c.draw({ off }); sfx.tap(); out.innerHTML = `แสดง: ${spec.series.filter((_, k) => !off.includes(k)).map(se => se.name).join(', ')} — สีของแท่งบอกว่าเป็นข้อมูลชุดไหน (ดูที่<b>คำอธิบายสัญลักษณ์</b>)`; } });
  out.innerHTML = 'แตะ<b>กลุ่มแท่ง</b>เพื่ออ่านค่าทั้งสองชุด · แตะ<b>สัญลักษณ์สี</b>ด้านบนเพื่อซ่อน/แสดงข้อมูลแต่ละชุด'; return h('div', { class: 'colstack' }, c, out);
}
/* line graph: tap a point to read it, tap between points to see the change */
function simLineRead(spec) {
  const out = fNote(); const vs = spec.series[0].v; let c;
  c = dataChart(spec, { nearest: true, onTap: ci => { const prev = ci > 0 ? ci - 1 : null; c.draw({ guide: [[ci, 0]], hl: [ci + ':0'], seg: prev });
    out.innerHTML = `<b>${gCat(spec, ci)}</b> = ${gNum(vs[ci])} ${spec.unit || ''}` + (prev != null ? ` · จาก${gCat(spec, prev)} ${vs[ci] >= vs[prev] ? '<b class="up">เพิ่มขึ้น</b>' : '<b class="dn">ลดลง</b>'} ${gNum(Math.abs(vs[ci] - vs[prev]))} (เส้น${vs[ci] >= vs[prev] ? 'ชันขึ้น' : 'ลาดลง'})` : ''); sfx.pop(ci + 1); } });
  out.innerHTML = '<b>แตะจุด</b>บนเส้น — ดูค่า และดูว่าเพิ่มขึ้นหรือลดลงจากจุดก่อนหน้าเท่าไร'; return h('div', { class: 'colstack' }, c, out);
}
/* step-by-step writing: table → builder → check */
function simBuild(spec, notes) {
  const b = chartBuilder(spec, { empty: spec.kind === 'line' }), out = fNote(), list = h('div', { class: 'colstack fstory' });
  (notes || []).forEach(([lab, body]) => list.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: body }))));
  const btn = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); const w = b.check(); if (!w.length) { btn.remove(); out.innerHTML = '<b>ถูกต้องทั้งหมด!</b> ' + (spec.kind === 'line' ? 'จุดทุกจุดตรงกับข้อมูล แล้วลากเส้นต่อจุด' : 'ทุกแท่งสูงตรงกับข้อมูล'); sfx.ok(); say('ถูกต้องทั้งหมด', true); } else { sfx.no(); out.innerHTML = `ยังไม่ตรง <b>${w.length}</b> ${spec.kind === 'line' ? 'จุด' : 'แท่ง'} — ดูว่าเส้นตารางแต่ละเส้นมีค่าเท่าไร แล้วลากใหม่`; } } }, icon('check'), 'ตรวจ');
  const help = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); b.fill(); sfx.page(); out.innerHTML = 'ดูเฉลยแล้ว — กด “ตรวจ” เพื่อยืนยัน'; } }, icon('eye'), 'ดูเฉลย');
  out.innerHTML = `ลาก${spec.kind === 'line' ? 'จุด' : 'แท่ง'}ขึ้นลงให้ตัวเลขตรงกับตาราง แล้วกด “ตรวจ”`;
  return h('div', { class: 'gside' }, b, h('div', { class: 'colstack gside-r' }, gTable(spec, { sm: true, notitle: true }), list, h('div', { class: 'rowstack' }, btn, help), out));
}
/* a worked example on a chart, revealed one step at a time (with highlights) */
function gWalk(spec, rows, final) {
  const c = dataChart(spec), list = h('div', { class: 'colstack fstory' }), out = fNote(); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, body, st] = rows[k]; list.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: body }))); if (st) c.draw(st); sfx.pop(k); k++;
    if (k >= rows.length) { btn.remove(); out.innerHTML = final || ''; sfx.ok(); } } }, icon('right'), 'ขั้นต่อไป');
  return h('div', { class: 'gside' }, c, h('div', { class: 'colstack gside-r' }, list, btn, out));
}

/* =========================================================
   ========================================================= */
const GS = (title, yName, xName, cats, series, min, max, step, extra = {}) => ({ kind: 'bar', title, yName, xName, cats, series: series.map(([name, v]) => ({ name, v })), min, max, step, ...extra });
// teaching-only data (not used in games)
const C3_T_HEIGHT = GS('ความสูงของนักเรียน 5 คน', 'ความสูง (ซม.)', 'ชื่อ', ['ต้น', 'ฝน', 'เมฆ', 'ดาว', 'ภู'], [['', [142, 148, 151, 139, 145]]], 130, 155, 5, { unit: 'ซม.' });
const C3_T_BOOK = GS('จำนวนหนังสือที่ห้องสมุดได้รับบริจาค', 'จำนวน (เล่ม)', 'เดือน', ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.'], [['', [520, 580, 490, 610, 560]]], 400, 650, 50, { unit: 'เล่ม' });
const C3_T_FRUIT = GS('ผลไม้ที่ร้านขายได้ (กิโลกรัม)', 'จำนวน (กก.)', 'ผลไม้', ['มะม่วง', 'ส้ม', 'กล้วย', 'องุ่น'], [['วันเสาร์', [45, 30, 25, 40]], ['วันอาทิตย์', [35, 40, 30, 50]]], 0, 60, 10, { unit: 'กก.' });
const C3_T_RUN = GS('เวลาวิ่ง 100 เมตร (วินาที) ของ 2 ห้อง', 'เวลา (วินาที)', 'สัปดาห์', ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'], [['ห้อง 5/1', [18.4, 17.9, 17.5, 17.1]], ['ห้อง 5/2', [18.8, 18.1, 17.6, 17.4]]], 16, 19, .5, { unit: 'วินาที' });
const C3_T_TEMP = { kind: 'line', title: 'อุณหภูมิตอนเที่ยงในสัปดาห์หนึ่ง', yName: 'อุณหภูมิ (°C)', xName: 'วัน', cats: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'], series: [{ name: '', v: [31, 33, 32, 35, 34, 30, 32] }], min: 28, max: 36, step: 1, unit: 'องศา' };
const C3_T_PLANT = { kind: 'line', title: 'ความสูงต้นถั่วที่ปลูก', yName: 'ความสูง (ซม.)', xName: 'สัปดาห์ที่', cats: ['1', '2', '3', '4', '5'], series: [{ name: '', v: [2, 5, 9, 12, 14] }], min: 0, max: 16, step: 2, snap: 1, unit: 'ซม.' };
const C3_T_BUILD = GS('จำนวนนักเรียนที่มาโรงเรียนด้วยวิธีต่าง ๆ', 'จำนวน (คน)', 'วิธี', ['เดิน', 'จักรยาน', 'รถยนต์', 'รถโรงเรียน'], [['', [240, 210, 280, 230]]], 150, 300, 25, { snap: 5, unit: 'คน' });
const C3_T_BUILD2 = GS('คะแนนสอบ 2 วิชา', 'คะแนน', 'ชื่อ', ['ก้อง', 'แก้ว', 'กล้า'], [['คณิต', [16, 18, 14]], ['ไทย', [12, 17, 15]]], 0, 20, 2, { snap: 1, unit: 'คะแนน' });
// ข้อมูลสมมติสำหรับฝึกอ่าน/เขียนแผนภูมิ (แต่งขึ้นเอง)
const C3_SUBJ = GS('จำนวนนักเรียนชั้น ป.5 ที่ชอบเรียนวิชาต่าง ๆ', 'จำนวน (คน)', 'วิชา', ['คณิต\nศาสตร์', 'วิทยา\nศาสตร์', 'ศิลปะ', 'ภาษา\nอังกฤษ', 'ภาษา\nไทย', 'การงาน\nอาชีพ'], [['', [126, 172, 95, 88, 141, 163]]], 0, 200, 50, { unit: 'คน' });
const C3_SICK = GS('ผู้ป่วยนอกของโรงพยาบาลเมืองตัวเลข จำแนกตาม 5 กลุ่มโรค (ข้อมูลสมมติ)', 'จำนวน (ครั้ง)', 'สาเหตุป่วย', ['ติดเชื้อ\nและปรสิต', 'เนื้องอก', 'ระบบ\nประสาท', 'ระบบ\nหายใจ', 'ระบบ\nย่อยอาหาร'], [['', [612, 436, 398, 2086, 1874]]], 350, 2350, 200, { unit: 'ครั้ง' });
const C3_GAME = GS('ผู้ชมคลิปเกมแต่ละประเภทในช่องของพี่ภู (ข้อมูลสมมติ)', 'จำนวน (คน)', 'ประเภท', ['ยิง', 'ต่อสู้', 'วางแผน', 'แข่งรถ', 'กีฬา'], [['', [84260, 71836, 56420, 62970, 91548]]], 50000, 100000, 10000, { unit: 'คน' });
const C3_TRADE = GS('มูลค่าสินค้าเข้าและออกของท่าเรือเมืองตัวเลข ม.ค.–พ.ค. (ข้อมูลสมมติ)', 'มูลค่า (ล้านบาท)', 'เดือน', ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.'], [['สินค้าขาเข้า', [812450, 768320, 853190, 826740, 907615]], ['สินค้าขาออก', [721380, 759860, 901470, 795230, 861940]]], 550000, 950000, 50000, { unit: 'ล้านบาท' });
const C3_EXPORT = GS('มูลค่าสินค้าส่งออก 5 หมวดของบริษัทแห่งหนึ่ง ม.ค.–มี.ค. (ข้อมูลสมมติ)', 'มูลค่า (ล้านบาท)', 'หมวดสินค้า', ['อัญมณีและ\nเครื่องประดับ', 'ธัญพืช', 'เหล็กหรือ\nเหล็กกล้า', 'น้ำตาลและ\nขนม', 'ทองแดง'], [['มกราคม', [42500, 22400, 31200, 8700, 9600]], ['กุมภาพันธ์', [61800, 19600, 17300, 13400, 11100]], ['มีนาคม', [36900, 16800, 15800, 14900, 12500]]], 0, 80000, 10000, { unit: 'ล้านบาท' });
const C3_SEED = GS('เมล็ดพันธุ์ผักที่ร้านใบเขียวขายได้ ม.ค.–พ.ค. (ข้อมูลสมมติ)', 'จำนวน (ซอง)', 'เดือน', ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.'], [['ผักบุ้ง', [23518, 35106, 25740, 28362, 37925]], ['ผักกาด', [33847, 24715, 26893, 23580, 34106]], ['ผักคะน้า', [38264, 28537, 33918, 35471, 29250]]], 20000, 42000, 2000, { unit: 'ซอง' });
const C3_POWER = GS('การใช้ไฟฟ้าเฉลี่ยต่อบ้านของหมู่บ้านแห่งหนึ่ง พ.ศ. 2564–2568 (ข้อมูลสมมติ)', 'จำนวน (หน่วย/บ้าน)', 'ปี', ['2564', '2565', '2566', '2567', '2568'], [['', [2914, 2987, 3046, 2961, 3072]]], 2850, 3100, 50, { snap: 1, tol: 8 });
const C3_FLOOD = GS('ต้นไม้ที่ชาวบ้านช่วยกันปลูก พ.ศ. 2564–2568 (ข้อมูลสมมติ)', 'จำนวน (ต้น)', 'ปี', ['2564', '2565', '2566', '2567', '2568'], [['', [548, 712, 436, 381, 597]]], 300, 750, 50, { snap: 1, tol: 6 });
const C3_PENCIL = GS('ดินสอที่ร้านสหกรณ์ขายได้', 'จำนวน (แท่ง)', 'วัน', ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'], [['', [110, 75, 60, 125, 85]]], 0, 140, 20, { snap: 5, tol: 0 });
const C3_HOTEL = GS('ผู้เข้าพักโรงแรมในเทศกาลต่าง ๆ (ข้อมูลสมมติ)', 'จำนวน (คน)', 'เทศกาล', ['ปีใหม่', 'สงกรานต์', 'ลอยกระทง', 'คริสต์มาส'], [['โรงแรมทะเลใส', [88600, 61200, 73400, 55800]], ['โรงแรมภูผา', [81300, 64700, 70900, 77500]]], 50000, 95000, 5000, { snap: 100, tol: 800 });
const C3_BREAD = { kind: 'line', title: 'ยอดขายขนมปังแต่ละไส้ของร้านป้าแดง (ข้อมูลสมมติ)', yName: 'จำนวน (ชิ้น)', xName: 'ไส้', cats: ['เผือก', 'ครีม', 'ช็อกโกแลต', 'ลูกเกด', 'ข้าวโพด', 'ถั่วแดง'], series: [{ name: '', v: [81250, 73640, 86920, 73640, 68370, 64180] }], min: 60000, max: 90000, step: 5000, unit: 'ชิ้น' };
const C3_SCHOOL = { kind: 'line', title: 'จำนวนนักเรียนของโรงเรียนในอำเภอหนึ่ง (ข้อมูลสมมติ)', yName: 'จำนวน (คน)', xName: 'โรงเรียน', cats: ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด'], series: [{ name: '', v: [1400, 2600, 3700, 3300, 4200, 2200, 1500, 2800] }], min: 0, max: 4500, step: 500, unit: 'คน' };
const C3_TRUCK = { kind: 'line', title: 'สินค้าที่บริษัทขนส่งแห่งหนึ่งส่งไปแต่ละจังหวัดในหนึ่งวัน (ข้อมูลสมมติ)', yName: 'จำนวน (ตัน)', xName: 'จังหวัด', cats: ['สตูล', 'กำแพง\nเพชร', 'เชียงราย', 'พิษณุโลก', 'ภูเก็ต', 'เชียงใหม่', 'กรุงเทพฯ'], series: [{ name: '', v: [11.2, 12.6, 13.4, 14.8, 15.9, 17.3, 19.4] }], min: 10, max: 20, step: 2, unit: 'ตัน' };
const C3_CANE = { kind: 'line', title: 'ผลผลิตอ้อยของไร่ลุงคำ พ.ศ. 2564–2568 (ข้อมูลสมมติ)', yName: 'ปริมาณ (พันตัน)', xName: 'ปี', cats: ['2564', '2565', '2566', '2567', '2568'], series: [{ name: '', v: [2.3, 1.6, 3.7, 1.8, 3.1] }], min: 0, max: 4, step: .5, snap: .1, tol: 0 };
const C3_DAM = { kind: 'line', title: 'ปริมาณน้ำในอ่างเก็บน้ำเมืองตัวเลข พ.ศ. 2563–2568 (ข้อมูลสมมติ)', yName: 'ปริมาณ (พัน ลบ.ม.)', xName: 'ปี', cats: ['2563', '2564', '2565', '2566', '2567', '2568'], series: [{ name: '', v: [47820, 58640, 50310, 53470, 43960, 38250] }], min: 35000, max: 65000, step: 5000, snap: 10, tol: 500 };
const C3_SPEND = GS('รายจ่ายของชาวเมืองตัวเลขในหนึ่งปี จำแนกตามประเภท (ข้อมูลสมมติ)', 'จำนวน (บาท)', 'รายการ', ['อาหาร', 'เสื้อผ้า', 'รักษา\nพยาบาล', 'การเดินทาง', 'การสื่อสาร'], [['', [1724580, 362470, 298150, 1186390, 173260]]], 50000, 2050000, 500000, { unit: 'บาท' });
const C3_ZOO = GS('ผู้เข้าชมสัตว์ในสวนสัตว์เมืองตัวเลข 2 วัน (ข้อมูลสมมติ)', 'จำนวน (คน)', 'ชนิดสัตว์', ['สิงโต', 'ฮิปโป\nแคระ', 'คาปิบารา', 'แพนด้า', 'เสือ', 'ยีราฟ'], [['วันที่ 1', [24170, 30860, 27410, 17580, 14320, 16940]], ['วันที่ 2', [27350, 34680, 22190, 24760, 13580, 21470]]], 10000, 38000, 4000, { unit: 'คน' });
const C3_RAIN = { kind: 'line', title: 'ปริมาณน้ำฝนที่วัดได้ที่โรงเรียน เม.ย.–ส.ค. (ข้อมูลสมมติ)', yName: 'ปริมาณ (มม.)', xName: 'เดือน', cats: ['เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.'], series: [{ name: '', v: [138.6, 104.2, 127.9, 146.3, 112.5] }], min: 100, max: 150, step: 10, unit: 'มิลลิเมตร' };
const C3_WOOD = { kind: 'line', title: 'รายได้จากการขายต้นกล้าของสหกรณ์หมู่บ้าน พ.ศ. 2564–2568 (ข้อมูลสมมติ)', yName: 'จำนวน (บาท)', xName: 'ปี', cats: ['2564', '2565', '2566', '2567', '2568'], series: [{ name: '', v: [1346200, 1612800, 1508400, 2684600, 1797500] }], min: 1000000, max: 3000000, step: 500000, unit: 'บาท' };
const C3_HOUSE = GS('ยอดขายบ้าน โครงการบ้านสวนสุข (ข้อมูลสมมติ)', 'จำนวน (หลัง)', 'เดือน', ['ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.'], [['พ.ศ. 2567', [270, 140, 210, 170]], ['พ.ศ. 2568', [260, 190, 160, 230]]], 0, 300, 50, { unit: 'หลัง' });
const C3_POP = GS('ประชากรแต่ละภาคของประเทศนัมเบอร์แลนด์ (ข้อมูลสมมติ)', 'จำนวน (พันคน)', 'ภาค', ['เมืองหลวง', 'ภาคกลาง', 'ภาคเหนือ', 'ภาค\nตะวันออก', 'ภาคใต้'], [['', [8540, 19360, 11820, 17430, 9270]]], 8000, 20000, 2000, { unit: 'พันคน' });
const C3_RICE = GS('ข้าวสารที่โรงสีผลิตได้ พ.ค.–ส.ค.', 'ปริมาณ (ตัน)', 'เดือน', ['พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.'], [['พ.ศ. 2567', [1.75, 2, 2.5, 3]], ['พ.ศ. 2568', [2.25, 2.75, 2.75, 2]]], 1, 3, .25, { unit: 'ตัน' });
const C3_FOREST = GS('เนื้อที่ป่าไม้แต่ละภาคของประเทศนัมเบอร์แลนด์ พ.ศ. 2558 และ 2568 (ข้อมูลสมมติ)', 'เนื้อที่ (ร้อยละ)', 'ภาค', ['เหนือ', 'อีสาน', 'ตะวันออก', 'กลาง', 'ใต้'], [['พ.ศ. 2558', [54.12, 17.46, 20.38, 28.65, 26.71]], ['พ.ศ. 2568', [50.83, 15.27, 23.14, 32.09, 25.36]]], 0, 60, 10, { unit: 'ร้อยละ' });
const C3_TOUR = GS('นักท่องเที่ยวต่างชาติที่มาเที่ยวเมืองตัวเลข พ.ศ. 2567 และ 2568 (ข้อมูลสมมติ)', 'จำนวน (คน)', 'ประเทศ', ['ลาว', 'เวียดนาม', 'สิงคโปร์', 'ญี่ปุ่น', 'เกาหลี'], [['พ.ศ. 2567', [1295400, 876300, 1012700, 1384600, 1528900]], ['พ.ศ. 2568', [1547200, 958100, 1093500, 1621800, 1736400]]], 800000, 1800000, 200000, { unit: 'คน' });
const C3_EGG = { kind: 'line', title: 'ไข่ไก่ที่ร้านค้าส่งขายได้ในหนึ่งสัปดาห์ (ข้อมูลสมมติ)', yName: 'จำนวน (แผง)', xName: 'วัน', cats: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'], series: [{ name: '', v: [350, 250, 300, 450, 500, 600, 550] }], min: 0, max: 650, step: 50, unit: 'แผง' };
const C3_RECYC = { kind: 'line', title: 'ขยะที่โรงเรียนในเขตหนึ่งนำกลับมาใช้ใหม่ พ.ศ. 2563–2568 (ข้อมูลสมมติ)', yName: 'ปริมาณ (ตัน)', xName: 'ปี', cats: ['2563', '2564', '2565', '2566', '2567', '2568'], series: [{ name: '', v: [5.46, 5.08, 4.71, 5.12, 6.03, 8.37] }], min: 3, max: 9, step: 1, unit: 'ตัน' };
const C3_GAS = { kind: 'line', title: 'ราคามะม่วงกิโลกรัมละ ที่ตลาดเมืองตัวเลข พ.ศ. 2564–2568 (ข้อมูลสมมติ)', yName: 'ราคา (บาท)', xName: 'ปี', cats: ['2564', '2565', '2566', '2567', '2568'], series: [{ name: '', v: [44.75, 47.2, 35.4, 32.85, 36.1] }], min: 30, max: 50, step: 5, unit: 'บาท' };
const C3_PASS = { kind: 'line', title: 'ร้อยละของนักเรียน ป.5 ที่สอบผ่านคณิตศาสตร์ (ข้อมูลสมมติ)', yName: 'ร้อยละ', xName: 'ปีการศึกษา', cats: ['2565', '2566', '2567', '2568'], series: [{ name: '', v: [82, 88, 74, 91] }], min: 70, max: 95, step: 5, snap: 1, tol: 0 };

const QA = (chart, q, a, unit, hint) => Q.gAsk({ chart, q, a, unit, hint });
const QP = (chart, q, opts, right, hint) => Q.gPick({ chart, q, opts, right, hint });
const L5C = (no, vno, place, title, short, goal, teach, game) => ({ id: 570 + no, place, title, short, tone: TONES5[(no + 4) % 6], goal, teach, game });
const LESSONS_P5C3 = [
  L5C(1, 53, 'ถ้ำรอยหยัก', 'อธิบายการอ่านแผนภูมิแท่งที่มีการย่นระยะ', 'รู้จักการย่นระยะ', 'บอกได้ว่าการย่นระยะคืออะไร ใช้เมื่อไร และอ่านสัญลักษณ์ ⌇ บนแกนตั้งได้', [
    T('ยินดีต้อนรับสู่ <b>ถ้ำแผนภูมิ</b>! ข้อมูลความสูงนักเรียน 5 คน ถ้าแกนตั้งเริ่มที่ 0 ทุกแท่งดูสูงพอ ๆ กัน — <b>กดปุ่มย่นระยะ</b>ดูความต่าง', 'ยินดีต้อนรับสู่ถ้ำแผนภูมิ ถ้าแกนตั้งเริ่มที่ศูนย์ ทุกแท่งดูสูงพอ ๆ กัน กดปุ่มย่นระยะดูความต่าง', el => el.append(simBreak(C3_T_HEIGHT))),
    T('ตัวอย่างอ่านทีละขั้น: แผนภูมิที่<b>ย่นระยะ</b> — กด “ขั้นต่อไป”', 'ตัวอย่างอ่านแผนภูมิที่ย่นระยะทีละขั้น', el => el.append(gWalk(C3_T_BOOK, [
      ['① ชื่อแผนภูมิ', 'บอกว่าเป็นข้อมูล<b>หนังสือที่ได้รับบริจาค</b>ในแต่ละเดือน'],
      ['② แกนตั้ง', 'หน่วยเป็น <b>เล่ม</b> · ช่องละ <b>50 เล่ม</b>'],
      ['③ รอยหยัก ⌇', 'ระหว่าง 0 กับ 400 ถูก<b>ย่น</b>ไว้ เพราะไม่มีข้อมูลต่ำกว่า 400 จะได้เห็นความต่างชัด', { hlc: [] }],
      ['④ อ่านค่า', 'เดือนเมษายน ปลายแท่งตรงกับ <b>610 เล่ม</b> (มากที่สุด)', { guide: [[3, 0]], hl: ['3:0'] }],
      ['⑤ เปรียบเทียบ', 'เมษายน 610 − มีนาคม 490 = <b>120 เล่ม</b>', { guide: [[3, 0], [2, 0]], hl: ['3:0', '2:0'], diff: [[3, 0], [2, 0]] }]],
      'แท่งที่สูงกว่า = ค่ามากกว่า · <b>รอยหยักไม่ได้ทำให้ค่าเปลี่ยน</b> แค่ตัดช่วงว่างออก'))),
    T('ข้อควรระวัง: แผนภูมิย่นระยะ <b>ห้ามเทียบความสูงเป็นเท่า</b> เช่น แท่งหนึ่งสูงเป็น 2 เท่าของอีกแท่ง ไม่ได้แปลว่าค่ามากกว่า 2 เท่า — ต้องอ่านตัวเลขเสมอ', 'แผนภูมิย่นระยะ ห้ามเทียบความสูงเป็นเท่า ต้องอ่านตัวเลขเสมอ', el => el.append(simBreak(C3_T_BOOK, 400)))],
    () => [QA(C3_SICK, 'ผู้ป่วยนอกจาก<b>โรคติดเชื้อและปรสิต</b>มารับบริการกี่ครั้ง', '612', 'ครั้ง', 'หาแท่งของโรคติดเชื้อและปรสิต แล้วอ่านตัวเลขที่ปลายแท่ง'),
      QA(C3_SICK, '<b>โรคระบบประสาท</b>มีผู้ป่วยนอกมารับบริการทั้งหมดกี่ครั้ง', '398', 'ครั้ง'),
      QA(C3_SICK, 'กลุ่มโรค<b>เนื้องอก</b>มีผู้มารับบริการ<b>น้อยกว่า</b>กลุ่มโรคระบบย่อยอาหารกี่ครั้ง', '1438', 'ครั้ง', 'ระบบย่อยอาหาร 1,874 − เนื้องอก 436'),
      QA(C3_SICK, 'รวมผู้ป่วยนอกจากทั้ง 5 กลุ่มโรค มีทั้งหมดกี่ครั้ง', '5406', 'ครั้ง', 'บวกค่าของทั้ง 5 แท่ง'),
      QP(C3_SICK, 'สัญลักษณ์ ⌇ บนแกนตั้งของแผนภูมินี้หมายความว่าอย่างไร', ['ย่นระยะช่วง 0 ถึง 350 ที่ไม่มีข้อมูล', 'ค่าทุกแท่งลดลง 350', 'แกนตั้งเริ่มที่ 0 ตามปกติ'], 'ย่นระยะช่วง 0 ถึง 350 ที่ไม่มีข้อมูล', 'รอยหยักคือการตัดช่วงที่ไม่มีข้อมูลออก'),
      QP(null, 'ข้อมูลใดเหมาะกับการเขียน<b>แผนภูมิแท่งที่มีการย่นระยะ</b>มากที่สุด', ['คะแนนสอบ 81, 86, 90, 84 คะแนน', 'จำนวนดินสอ 3, 12, 25, 7 แท่ง', 'ผลไม้ 0, 5, 10, 15 ผล'], 'คะแนนสอบ 81, 86, 90, 84 คะแนน', 'ย่นระยะเมื่อข้อมูลทุกค่ามีค่ามากและใกล้เคียงกัน'),
      QA(C3_SICK, 'กลุ่มโรค<b>ระบบหายใจ</b>มีผู้มารับบริการมากกว่ากลุ่มโรคระบบประสาทกี่ครั้ง', '1688', 'ครั้ง', 'ระบบหายใจ 2,086 − ระบบประสาท 398'),
      QP(C3_SICK, 'กลุ่มโรคใดมีผู้มารับบริการ<b>มากที่สุด</b>', ['ระบบหายใจ', 'ระบบย่อยอาหาร', 'ติดเชื้อและปรสิต', 'เนื้องอก'], 'ระบบหายใจ', 'หาแท่งที่สูงที่สุด'),
      QP(null, 'ทำไมแผนภูมิผู้ป่วยนอกจึง<b>ย่นระยะ</b>แกนตั้งช่วง 0 ถึง 350', ['ทุกค่ามากกว่า 350 ถ้าเริ่มที่ 0 แท่งจะยาวมากและเทียบกันยาก', 'เพราะข้อมูลบางค่าติดลบ', 'เพื่อให้ทุกแท่งยาวเท่ากัน'], 'ทุกค่ามากกว่า 350 ถ้าเริ่มที่ 0 แท่งจะยาวมากและเทียบกันยาก', 'ย่นระยะช่วงที่ไม่มีข้อมูล')] /* v134: ≥ 8 ข้อ */),
  L5C(2, 54, 'ถ้ำอ่านแท่ง', 'อ่านแผนภูมิแท่งที่มีการย่นระยะ', 'อ่านแผนภูมิย่นระยะ', 'อ่านค่าจากแผนภูมิแท่งที่มีการย่นระยะ หามากสุด น้อยสุด ผลต่าง และผลรวม', [
    T('<b>แตะแท่ง</b>เพื่ออ่านค่า — เส้นประพาสายตาไปที่แกนตั้ง · แตะแท่งที่ 2 เพื่อดูผลต่าง', 'แตะแท่งเพื่ออ่านค่า แตะแท่งที่สองเพื่อดูผลต่าง', el => el.append(simReadBar(C3_T_BOOK))),
    T('ตัวอย่างคำนวณจากแผนภูมิ: <b>ผลรวม</b>และ<b>ค่าเฉลี่ย</b>', 'ตัวอย่างคำนวณผลรวมและค่าเฉลี่ยจากแผนภูมิ', el => el.append(gWalk(C3_T_HEIGHT, [
      ['① อ่านทุกแท่ง', 'ต้น 142 · ฝน 148 · เมฆ 151 · ดาว 139 · ภู 145', { guide: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] }],
      ['② ผลรวม', '142 + 148 + 151 + 139 + 145 = <b>725 ซม.</b>'],
      ['③ ค่าเฉลี่ย', '725 ÷ 5 = <b>145 ซม.</b> (ผลรวม ÷ จำนวนคน)'],
      ['④ สูงสุด − ต่ำสุด', 'เมฆ 151 − ดาว 139 = <b>12 ซม.</b>', { hl: ['2:0', '3:0'], diff: [[2, 0], [3, 0]] }]], 'จำไว้: <b>เฉลี่ย = ผลรวม ÷ จำนวน</b>')))],
    () => [QA(C3_GAME, 'คลิปเกมประเภท<b>ยิง</b>มีผู้ชมกี่คน', '84260', 'คน'),
      QP(C3_GAME, 'คลิปเกมประเภทใดมีผู้ชม<b>น้อยที่สุด</b>', ['วางแผน', 'แข่งรถ', 'ต่อสู้', 'ยิง'], 'วางแผน', 'หาแท่งที่เตี้ยที่สุด'),
      QA(C3_GAME, 'คลิปเกมแข่งรถมีผู้ชม<b>น้อยกว่า</b>คลิปเกมกีฬากี่คน', '28578', 'คน', 'กีฬา 91,548 − แข่งรถ 62,970'),
      QA(C3_GAME, 'ผู้ชมทุกประเภทรวมกันมีกี่คน', '367034', 'คน'),
      QA(C3_GAME, 'ผู้ชม<b>โดยเฉลี่ย</b>ของประเภทต่อสู้และกีฬาเท่ากับกี่คน', '81692', 'คน', '(71,836 + 91,548) ÷ 2'),
      QP(C3_GAME, 'คลิปเกมประเภทใดมีผู้ชม<b>มากกว่า 80,000</b> คน', ['ยิง และ กีฬา', 'ต่อสู้ และ กีฬา', 'ยิง และ ต่อสู้'], 'ยิง และ กีฬา', 'ดูแท่งที่ยาวเกินเส้น 80,000'),
      QA(C3_POP, '<b>ภาคกลาง</b>มีประชากรมากกว่า<b>เมืองหลวง</b>กี่พันคน', '10820', 'พันคน', '19,360 − 8,540'),
      QA(C3_POP, '<b>ภาคตะวันออก</b>มีประชากรกี่พันคน', '17430', 'พันคน'), QP(C3_POP, 'ภาคใดมีประชากร<b>น้อยที่สุด</b>', ['เมืองหลวง', 'ภาคใต้', 'ภาคเหนือ', 'ภาคตะวันออก'], 'เมืองหลวง', 'หาแท่งที่เตี้ยที่สุด')] /* v134: ≥ 8 ข้อ */),
  L5C(3, 55, 'ถ้ำแท่งคู่', 'อธิบายแผนภูมิแท่งเปรียบเทียบ', 'รู้จักแผนภูมิเปรียบเทียบ', 'บอกส่วนประกอบของแผนภูมิแท่งเปรียบเทียบ และอ่านคำอธิบายสัญลักษณ์ได้', [
    T('<b>แผนภูมิแท่งเปรียบเทียบ</b> = ข้อมูล 2 ชุดขึ้นไปวางคู่กัน แยกด้วย<b>สี</b> · แตะสัญลักษณ์สีเพื่อซ่อน/แสดง แตะกลุ่มแท่งเพื่ออ่านค่า', 'แผนภูมิแท่งเปรียบเทียบ คือข้อมูลสองชุดขึ้นไปวางคู่กัน แยกด้วยสี', el => el.append(simDouble(C3_T_FRUIT))),
    T('ตัวอย่างอ่านทีละขั้น', 'ตัวอย่างอ่านแผนภูมิแท่งเปรียบเทียบทีละขั้น', el => el.append(gWalk(C3_T_FRUIT, [
      ['① คำอธิบายสัญลักษณ์', 'สีชมพู = <b>วันเสาร์</b> · สีฟ้า = <b>วันอาทิตย์</b>'],
      ['② อ่านกลุ่มเดียวกัน', 'องุ่น: เสาร์ 40 กก. · อาทิตย์ 50 กก.', { guide: [[3, 0], [3, 1]], hl: ['3:0', '3:1'] }],
      ['③ เปรียบเทียบในกลุ่ม', 'องุ่นวันอาทิตย์ขายได้มากกว่าวันเสาร์ 50 − 40 = <b>10 กก.</b>', { diff: [[3, 1], [3, 0]], hl: ['3:0', '3:1'] }],
      ['④ เปรียบเทียบทั้งชุด', 'วันเสาร์รวม 45 + 30 + 25 + 40 = <b>140 กก.</b> · วันอาทิตย์รวม 35 + 40 + 30 + 50 = <b>155 กก.</b>']], 'อ่านสีจากคำอธิบายสัญลักษณ์ก่อนเสมอ')))],
    () => [QA(C3_RICE, 'ปี พ.ศ. 2568 มีผลผลิตรวมทั้งหมดกี่ตัน', '9.75', 'ตัน', 'บวกแท่งของ พ.ศ. 2568 ทุกเดือน'),
      QA(C3_RICE, 'ปี 2567 และปี 2568 มีผลผลิตรวมต่างกันกี่ตัน', '0.5', 'ตัน', 'รวมปี 2567 = 9.25 · รวมปี 2568 = 9.75'),
      QA(C3_RICE, 'ผลผลิตเดือนสิงหาคมสองปีรวมกัน มากกว่าเดือนพฤษภาคมสองปีรวมกันเท่าใด', '1', 'ตัน', 'ส.ค. 3 + 2 = 5 · พ.ค. 1.75 + 2.25 = 4'),
      QA(C3_RICE, 'ผลผลิตเดือนมิถุนายนสองปีรวมกันเท่ากับกี่ตัน', '4.75', 'ตัน'),
      QP(C3_HOUSE, 'เดือนใดมียอดขายบ้านรวมสองปี<b>น้อยที่สุด</b>', ['มีนาคม', 'กุมภาพันธ์', 'เมษายน', 'พฤษภาคม'], 'มีนาคม', 'รวมสองแท่งในแต่ละเดือนแล้วเทียบ'),
      QA(C3_HOUSE, 'ยอดขายบ้านรวมสองปีเดือนกุมภาพันธ์มากกว่าเดือนเมษายนกี่หลัง', '160', 'หลัง', 'ก.พ. 270 + 260 = 530 · เม.ย. 210 + 160 = 370'),
      QA(C3_HOUSE, 'เดือนพฤษภาคม พ.ศ. 2568 ขายบ้านได้มากกว่า พ.ศ. 2567 กี่หลัง', '60', 'หลัง', '230 − 170'),
      QP(C3_RICE, 'เดือนใดที่ พ.ศ. 2567 มีผลผลิต<b>มากกว่า</b> พ.ศ. 2568', ['สิงหาคม', 'กรกฎาคม', 'มิถุนายน', 'พฤษภาคม'], 'สิงหาคม', 'เทียบความสูงของสองแท่งในแต่ละเดือน'),
      QP(null, 'แผนภูมิแท่งเปรียบเทียบต้องมีส่วนใด จึงรู้ว่าแท่งแต่ละสีแทนข้อมูลชุดใด', ['คำอธิบายสัญลักษณ์', 'สัญลักษณ์ ⌇ บนแกนตั้ง', 'เส้นตารางแนวนอน'], 'คำอธิบายสัญลักษณ์')] /* v134: ≥ 8 ข้อ */),
  L5C(4, 56, 'ถ้ำเทียบสามสี', 'การอ่านแผนภูมิแท่งเปรียบเทียบ', 'อ่านแผนภูมิเปรียบเทียบ', 'อ่านและตอบคำถามจากแผนภูมิแท่งเปรียบเทียบที่มีข้อมูล 2–3 ชุด', [
    T('แผนภูมิเปรียบเทียบ<b>2 ชุด</b> — แตะแท่งเพื่ออ่าน แตะ 2 แท่งเพื่อหาผลต่าง', 'แตะแท่งเพื่ออ่าน แตะสองแท่งเพื่อหาผลต่าง', el => el.append(simReadBar(C3_T_FRUIT))),
    T('ตัวอย่าง: ข้อมูล <b>3 ชุด</b> ก็อ่านแบบเดียวกัน — ดูสีให้ถูกชุด', 'ข้อมูลสามชุดก็อ่านแบบเดียวกัน ดูสีให้ถูกชุด', el => el.append(gWalk(C3_EXPORT, [
      ['① สัญลักษณ์', 'ดูคำอธิบายสัญลักษณ์มุมบน: <b>แต่ละสีคือ 1 เดือน</b> (ม.ค. · ก.พ. · มี.ค.)'],
      ['② อ่าน 1 หมวด', 'ทองแดง: ม.ค. 9,600 · ก.พ. 11,100 · มี.ค. 12,500', { guide: [[4, 0], [4, 1], [4, 2]], hl: ['4:0', '4:1', '4:2'] }],
      ['③ แนวโน้ม', 'ทองแดง<b>เพิ่มขึ้นทุกเดือน</b> · มี.ค. มากกว่า ม.ค. 12,500 − 9,600 = <b>2,900</b> ล้านบาท', { diff: [[4, 2], [4, 0]], hl: ['4:0', '4:2'] }]], 'อ่านทีละหมวด แล้วจับคู่สีกับเดือน')))],
    () => [QP(C3_EXPORT, 'เดือนมกราคม หมวดสินค้าใดมีมูลค่าส่งออก<b>น้อยที่สุด</b>', ['น้ำตาลและขนม', 'ทองแดง', 'ธัญพืช', 'เหล็กหรือเหล็กกล้า'], 'น้ำตาลและขนม', 'ดูเฉพาะแท่งสีของเดือนมกราคม'),
      QA(C3_EXPORT, 'มูลค่าส่งออกหมวด<b>ธัญพืช</b>ทั้งสามเดือนรวมกันกี่ล้านบาท', '58800', 'ล้านบาท', '22,400 + 19,600 + 16,800'),
      QA(C3_EXPORT, 'หมวด<b>เหล็กหรือเหล็กกล้า</b> เดือนมกราคมและมีนาคมรวมกันกี่ล้านบาท', '47000', 'ล้านบาท'),
      QA(C3_EXPORT, 'เดือนมีนาคม หมวด<b>ทองแดง</b>มากกว่าเดือนกุมภาพันธ์กี่ล้านบาท', '1400', 'ล้านบาท'),
      QA(C3_SEED, 'เดือนมกราคม ร้านขายเมล็ด<b>ผักบุ้ง</b>ได้กี่ซอง', '23518', 'ซอง'),
      QA(C3_SEED, 'เดือนกุมภาพันธ์ ขายผักบุ้งได้มากกว่าผักกาดกี่ซอง', '10391', 'ซอง'),
      QP(C3_SEED, 'ผักคะน้าขายได้<b>น้อยกว่า 30,000 ซอง</b>ในเดือนใด', ['กุมภาพันธ์ และ พฤษภาคม', 'มีนาคม และ เมษายน', 'มกราคม และ พฤษภาคม'], 'กุมภาพันธ์ และ พฤษภาคม', 'ดูเฉพาะแท่งสีของผักคะน้า'),
      QA(C3_SEED, 'เดือนพฤษภาคม ขายเมล็ดผักทั้งสามชนิดรวมกันกี่ซอง', '101281', 'ซอง', '37,925 + 34,106 + 29,250'), QP(C3_SEED, 'เดือนมีนาคม เมล็ดผักชนิดใดขายได้<b>มากที่สุด</b>', ['ผักคะน้า', 'ผักกาด', 'ผักบุ้ง'], 'ผักคะน้า', 'ดูเฉพาะแท่งของเดือนมีนาคม')] /* v134: ≥ 8 ข้อ */),
  L5C(5, 57, 'ถ้ำแท่งคู่ย่น', 'การอ่านแผนภูมิแท่งเปรียบเทียบที่มีการย่นระยะ', 'แท่งเปรียบเทียบย่นระยะ', 'อ่านแผนภูมิแท่งเปรียบเทียบที่มีการย่นระยะ', [
    T('ข้อมูล 2 ห้องมีค่าใกล้กันมาก จึง<b>ย่นระยะ</b> — แตะกลุ่มแท่งเพื่ออ่านทั้งสองห้อง', 'ข้อมูลสองห้องมีค่าใกล้กันมาก จึงย่นระยะ แตะกลุ่มแท่งเพื่ออ่าน', el => el.append(simDouble(C3_T_RUN))),
    T('ตัวอย่าง: หาผลต่างที่<b>มากที่สุด</b>', 'ตัวอย่างหาผลต่างที่มากที่สุด', el => el.append(gWalk(C3_T_RUN, [
      ['① หาผลต่างทีละกลุ่ม', 'สัปดาห์ 1: 18.8 − 18.4 = 0.4 · สัปดาห์ 2: 18.1 − 17.9 = 0.2'],
      ['② ต่อ', 'สัปดาห์ 3: 17.6 − 17.5 = 0.1 · สัปดาห์ 4: 17.4 − 17.1 = 0.3'],
      ['③ เทียบ', 'ต่างกันมากที่สุดคือ <b>สัปดาห์ 1</b> (0.4 วินาที)', { hl: ['0:0', '0:1'], diff: [[0, 1], [0, 0]], guide: [[0, 0], [0, 1]] }]], 'ห้อง 5/1 วิ่งเร็วขึ้นทุกสัปดาห์ (เวลาลดลง)')))],
    () => [QA(C3_TRADE, 'เดือนมกราคม สินค้า<b>ขาเข้า</b>มีมูลค่ากี่ล้านบาท', '812450', 'ล้านบาท'),
      QA(C3_TRADE, 'เดือนเมษายน สินค้าขาออก<b>น้อยกว่า</b>สินค้าขาเข้ากี่ล้านบาท', '31510', 'ล้านบาท', '826,740 − 795,230'),
      QP(C3_TRADE, 'เดือนใดมีมูลค่าสินค้าขาเข้าและขาออก<b>ต่างกันมากที่สุด</b>', ['มกราคม', 'มีนาคม', 'เมษายน', 'พฤษภาคม'], 'มกราคม', 'หาผลต่างของแต่ละเดือน แล้วเทียบ'),
      QA(C3_TOUR, 'พ.ศ. 2568 นักท่องเที่ยวจาก<b>เกาหลี</b>มาเที่ยวกี่คน', '1736400', 'คน'),
      QP(C3_TOUR, 'พ.ศ. 2567 นักท่องเที่ยวจากประเทศใดมา<b>น้อยที่สุด</b>', ['เวียดนาม', 'สิงคโปร์', 'ลาว', 'ญี่ปุ่น'], 'เวียดนาม'),
      QA(C3_TOUR, 'นักท่องเที่ยวจาก<b>ลาว</b> ปี 2568 เพิ่มขึ้นจากปี 2567 กี่คน', '251800', 'คน', '1,547,200 − 1,295,400'),
      QA(C3_FOREST, 'ภาคกลาง ปี 2568 มีเนื้อที่ป่าไม้เพิ่มขึ้นจากปี 2558 ร้อยละเท่าใด', '3.44', '', '32.09 − 28.65'),
      QA(C3_TRADE, 'เดือนพฤษภาคม สินค้า<b>ขาออก</b>มีมูลค่ากี่ล้านบาท', '861940', 'ล้านบาท'), QP(C3_TOUR, 'พ.ศ. 2568 นักท่องเที่ยวจากประเทศใดมา<b>มากที่สุด</b>', ['เกาหลี', 'ญี่ปุ่น', 'ลาว', 'สิงคโปร์'], 'เกาหลี', 'ดูแท่งสีของ พ.ศ. 2568')] /* v134: ≥ 8 ข้อ */),
  L5C(6, 58, 'ถ้ำสร้างแท่ง', 'การเขียนแผนภูมิแท่งที่มีการย่นระยะ', 'เขียนแผนภูมิย่นระยะ', 'เขียนแผนภูมิแท่งที่มีการย่นระยะจากตารางข้อมูล', [
    T('ขั้นตอนการเขียน — ทำตามทีละข้อ แล้ว<b>ลากแท่ง</b>ให้สูงตรงกับตาราง', 'ขั้นตอนการเขียนแผนภูมิแท่งที่มีการย่นระยะ ลากแท่งให้สูงตรงกับตาราง', el => el.append(simBuild(C3_T_BUILD, [
      ['① ชื่อแผนภูมิ', 'บอกว่าเป็นข้อมูลเรื่องอะไร'], ['② ค่าน้อยสุด/มากสุด', 'ข้อมูลอยู่ระหว่าง <b>210–280</b> คน'],
      ['③ มาตราส่วน', 'เริ่มที่ <b>150</b> (ย่นระยะ 0–150 ใส่ ⌇) · ช่องละ <b>25 คน</b>'], ['④ วาดแท่ง', 'ลากแท่งให้สูงเท่าข้อมูล ความกว้างแท่งเท่ากัน ระยะห่างเท่ากัน']]))),
    T('ตัวอย่างเลือก<b>จุดเริ่มย่นระยะ</b>: ค่าน้อยสุดคือ 490 → เริ่มที่ 400 (ต่ำกว่าค่าน้อยสุดเล็กน้อย) — ลองกดเปลี่ยนจุดเริ่มดู', 'เลือกจุดเริ่มย่นระยะ ให้ต่ำกว่าค่าน้อยที่สุดเล็กน้อย', el => el.append(simBreak(C3_T_BOOK, 400)))],
    () => [Q.gBuild({ chart: C3_PENCIL }), Q.gBuild({ chart: C3_FLOOD }), Q.gBuild({ chart: C3_POWER }),
      QP(null, 'ข้อมูลการใช้ไฟฟ้า 2,929 · 2,969 · 3,061 · 2,972 · 3,038 ควรย่นระยะแล้ว<b>เริ่มแกนตั้ง</b>ที่ค่าใด', ['2,850', '0', '3,100', '2,970'], '2,850', 'เริ่มที่ค่าที่น้อยกว่าค่าน้อยที่สุด (2,929) เล็กน้อย'),
      QP(null, 'ข้อใด<b>ไม่ใช่</b>สิ่งที่ต้องมีในแผนภูมิแท่งที่มีการย่นระยะ', ['ความสูงแท่งต้องเป็นเท่าของกันและกัน', 'สัญลักษณ์ ⌇ บนแกนตั้ง', 'ชื่อแผนภูมิและหน่วยบนแกน'], 'ความสูงแท่งต้องเป็นเท่าของกันและกัน'),
      QP(null, 'คะแนนสอบ 82, 87, 91, 85, 89 ถ้าเขียนแผนภูมิแท่งที่มีการย่นระยะ ควรเริ่มแกนตั้งที่ค่าใด', ['80', '0', '90', '85'], '80', 'เริ่มที่ค่าที่น้อยกว่าค่าน้อยที่สุด (82) เล็กน้อย'),
      QP(null, 'สัญลักษณ์แสดงการ<b>ย่นระยะ</b>เขียนไว้ที่ใด', ['บนแกนตั้ง ระหว่าง 0 กับค่าที่เริ่มมีข้อมูล', 'ที่ปลายแท่งที่สูงที่สุด', 'ใต้ชื่อแผนภูมิ'], 'บนแกนตั้ง ระหว่าง 0 กับค่าที่เริ่มมีข้อมูล'),
      QP(null, 'ข้อมูลชุดใด<b>ไม่ควร</b>เขียนเป็นแผนภูมิแท่งที่มีการย่นระยะ', ['จำนวนนักเรียน 5, 18, 30, 42 คน', 'ราคาทอง 30,100 · 30,250 · 30,400 บาท', 'น้ำหนัก 41, 43, 45, 44 กิโลกรัม'], 'จำนวนนักเรียน 5, 18, 30, 42 คน', 'ข้อมูลที่มีค่าน้อยใกล้ 0 ไม่ต้องย่นระยะ')] /* v134: ≥ 8 ข้อ */),
  L5C(7, 59, 'ถ้ำสร้างแท่งคู่', 'การเขียนแผนภูมิแท่งเปรียบเทียบ', 'เขียนแผนภูมิเปรียบเทียบ', 'เขียนแผนภูมิแท่งเปรียบเทียบจากตารางข้อมูล 2 ชุด', [
    T('เขียนแผนภูมิแท่งเปรียบเทียบ: แต่ละชื่อมี<b>2 แท่งติดกัน</b> สีต่างกัน — ลากทั้งสองสีให้ตรงตาราง', 'แผนภูมิแท่งเปรียบเทียบ แต่ละชื่อมีสองแท่งติดกัน สีต่างกัน', el => el.append(simBuild(C3_T_BUILD2, [
      ['① สัญลักษณ์', 'กำหนดสีให้ข้อมูลแต่ละชุด แล้วเขียนคำอธิบายไว้มุมแผนภูมิ'], ['② มาตราส่วน', 'คะแนน 12–18 → เริ่มที่ 0 ช่องละ 2 คะแนน'], ['③ วาดแท่งคู่', 'แท่งชุดเดียวกันใช้สีเดียวกันและอยู่ลำดับเดียวกันทุกกลุ่ม']]))),
    T('ตัวอย่างอ่านแผนภูมิที่เพิ่งเขียน — เช็คว่าวาดถูกโดยแตะกลุ่มแท่ง', 'อ่านแผนภูมิที่เพิ่งเขียน', el => el.append(simDouble(C3_T_BUILD2)))],
    () => [Q.gBuild({ chart: GS('คะแนนสอบ 2 ครั้ง', 'คะแนน', 'ชื่อ', ['มด', 'ปู', 'ปลา', 'แพร'], [['ครั้งที่ 1', [14, 18, 12, 16]], ['ครั้งที่ 2', [16, 15, 17, 19]]], 0, 20, 2, { snap: 1, tol: 0 }) }),
      Q.gBuild({ chart: C3_HOTEL }),
      QP(C3_HOTEL, 'จากแผนภูมิ เทศกาลใดที่<b>โรงแรมภูผา</b>มีผู้เข้าพักมากกว่าโรงแรมทะเลใส', ['สงกรานต์ และ คริสต์มาส', 'ปีใหม่ และ ลอยกระทง', 'ปีใหม่ และ คริสต์มาส'], 'สงกรานต์ และ คริสต์มาส'),
      QA(C3_HOTEL, 'เทศกาล<b>คริสต์มาส</b> โรงแรมภูผามีผู้เข้าพักมากกว่าโรงแรมทะเลใสกี่คน', '21700', 'คน')]),
  L5C(8, 60, 'ถ้ำเส้นกราฟ', 'การอ่านกราฟเส้น', 'อ่านกราฟเส้น', 'อ่านค่าจากกราฟเส้น และบอกการเพิ่มขึ้น/ลดลงของข้อมูล', [
    T('<b>กราฟเส้น</b> ใช้จุดแทนข้อมูล แล้วลากเส้นต่อกัน — เส้น<b>ชันขึ้น</b> = เพิ่มขึ้น · <b>ลาดลง</b> = ลดลง · แตะจุดดูนะ', 'กราฟเส้น ใช้จุดแทนข้อมูล เส้นชันขึ้นคือเพิ่มขึ้น ลาดลงคือลดลง', el => el.append(simLineRead(C3_T_TEMP))),
    T('ตัวอย่างอ่านทีละขั้น', 'ตัวอย่างอ่านกราฟเส้นทีละขั้น', el => el.append(gWalk(C3_T_PLANT, [
      ['① สูงสุด', 'สัปดาห์ที่ 5 ต้นถั่วสูง <b>14 ซม.</b>', { guide: [[4, 0]], hl: ['4:0'] }],
      ['② เพิ่มขึ้นมากที่สุด', 'สัปดาห์ 2 → 3 เพิ่มขึ้น 9 − 5 = <b>4 ซม.</b> (เส้นชันที่สุด)', { seg: 1, hl: ['1:0', '2:0'] }],
      ['③ แนวโน้ม', 'เส้นขึ้นตลอด → ต้นถั่ว<b>สูงขึ้นทุกสัปดาห์</b>']], 'เส้นยิ่งชัน = เปลี่ยนแปลงมาก')))],
    () => [QA(C3_BREAD, 'ร้านป้าแดงขายขนมปัง<b>ไส้เผือก</b>ได้กี่ชิ้น', '81250', 'ชิ้น'),
      QP(C3_BREAD, 'ไส้ใดขายได้ <b>68,370</b> ชิ้น', ['ข้าวโพด', 'ถั่วแดง', 'ลูกเกด', 'ครีม'], 'ข้าวโพด'),
      QP(C3_BREAD, 'ไส้ใดขายได้จำนวน<b>เท่ากัน</b>', ['ครีม กับ ลูกเกด', 'เผือก กับ ครีม', 'ข้าวโพด กับ ถั่วแดง'], 'ครีม กับ ลูกเกด'),
      QA(C3_SCHOOL, 'โรงเรียน<b>สาม</b>และโรงเรียน<b>เจ็ด</b>มีนักเรียนต่างกันกี่คน', '2200', 'คน', '3,700 − 1,500'),
      QA(C3_SCHOOL, 'โรงเรียนทั้ง 8 แห่งมีนักเรียนรวมกันกี่คน', '21700', 'คน'),
      QP(C3_EGG, 'วันใดบ้างที่ร้านค้าขายไข่ไก่ได้<b>มากกว่า 500 แผง</b>', ['เสาร์ และ อาทิตย์', 'ศุกร์ และ เสาร์', 'พฤหัสบดี และ ศุกร์'], 'เสาร์ และ อาทิตย์', 'ดูจุดที่อยู่สูงกว่าเส้น 500'),
      QA(C3_RECYC, 'ปี 2566 มีการนำขยะกลับมาใช้<b>น้อยกว่า</b>ปี 2567 กี่ตัน', '0.91', 'ตัน', '6.03 − 5.12'),
      QA(C3_EGG, 'วันอังคาร ร้านค้าขายไข่ไก่ได้กี่แผง', '250', 'แผง'), QP(C3_RECYC, 'ปีใดนำขยะกลับมาใช้ใหม่<b>น้อยที่สุด</b>', ['2565', '2564', '2563', '2566'], '2565', 'หาจุดที่ต่ำที่สุด')] /* v134: ≥ 8 ข้อ */),
  L5C(9, 61, 'ถ้ำวาดเส้น', 'การเขียนกราฟเส้น', 'เขียนกราฟเส้น', 'เขียนกราฟเส้นจากตารางข้อมูล', [
    T('ขั้นตอนเขียนกราฟเส้น — <b>ลากจุด</b>แต่ละจุดให้ตรงกับตาราง แล้วเส้นจะต่อให้เอง', 'ขั้นตอนเขียนกราฟเส้น ลากจุดให้ตรงกับตาราง', el => el.append(simBuild(C3_T_PLANT, [
      ['① แกน', 'แกนนอน = <b>สัปดาห์</b> · แกนตั้ง = <b>ความสูง (ซม.)</b>'], ['② มาตราส่วน', 'ค่ามากสุด 14 → แกนถึง 16 ช่องละ 2'], ['③ จุด', 'ทุกสัปดาห์ใส่จุดตรงค่า แล้วลากเส้นตรงต่อจุดตามลำดับ']]))),
    T('ตัวอย่าง: ข้อมูลค่ามากและใกล้กัน ก็<b>ย่นระยะ</b>ในกราฟเส้นได้ — แตะจุดดูค่า', 'กราฟเส้นก็ย่นระยะได้ แตะจุดดูค่า', el => el.append(simLineRead(C3_T_TEMP)))],
    () => [Q.gBuild({ chart: C3_CANE }), Q.gBuild({ chart: C3_PASS }), Q.gBuild({ chart: C3_DAM }),
      QP(C3_CANE, 'จากกราฟผลผลิตอ้อย ปีใดผลผลิต<b>ลดลง</b>จากปีก่อนหน้ามากที่สุด', ['2567', '2565', '2568'], '2567', 'ดูเส้นที่ลาดลงชันที่สุด: 2566 → 2567 ลดลง 1.9')]),
  L5C(10, 62, 'ถ้ำโจทย์เส้น', 'โจทย์ปัญหาเกี่ยวกับกราฟเส้น', 'โจทย์กราฟเส้น', 'แก้โจทย์ปัญหาโดยใช้ข้อมูลจากกราฟเส้น', [
    T('แก้โจทย์จากกราฟ: ① หาข้อมูลที่ต้องใช้ ② อ่านค่า ③ เลือกวิธีคำนวณ ④ ตอบ — กดทีละขั้น', 'แก้โจทย์จากกราฟ หาข้อมูล อ่านค่า เลือกวิธี ตอบ', el => el.append(gWalk(C3_T_TEMP, [
      ['โจทย์', 'อุณหภูมิ<b>เฉลี่ย</b>ของวันจันทร์ถึงวันศุกร์เท่ากับกี่องศา'],
      ['① ข้อมูลที่ใช้', 'จันทร์–ศุกร์ 5 วัน', { guide: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] }],
      ['② อ่านค่า', '31 · 33 · 32 · 35 · 34'], ['③ คำนวณ', '(31 + 33 + 32 + 35 + 34) ÷ 5 = 165 ÷ 5'], ['④ ตอบ', '<b>33 องศาเซลเซียส</b>']], 'ตรวจ: 33 อยู่ระหว่างค่าน้อยสุด (31) กับมากสุด (35) ✓'))),
    T('ตัวอย่างที่ 2: “<b>เพิ่มขึ้น</b>มากที่สุดช่วงใด” — แตะจุดทีละจุดดูการเปลี่ยนแปลง', 'ตัวอย่างที่สอง หาช่วงที่เพิ่มขึ้นมากที่สุด', el => el.append(simLineRead(C3_T_PLANT)))],
    () => [QP(C3_TRUCK, 'จังหวัดใดมีปริมาณการขนส่งสินค้า<b>น้อยที่สุด</b>', ['สตูล', 'กำแพงเพชร', 'เชียงราย'], 'สตูล'),
      QA(C3_TRUCK, 'ปริมาณสินค้าเฉลี่ยของทั้ง 7 จังหวัด (ทศนิยม 2 ตำแหน่ง) กี่ตัน', '14.94', 'ตัน', '(11.2 + 12.6 + 13.4 + 14.8 + 15.9 + 17.3 + 19.4) ÷ 7 = 104.6 ÷ 7 ≈ 14.94'),
      QA(C3_TRUCK, 'เชียงรายและพิษณุโลกรวมกัน มากกว่ากรุงเทพฯ กี่ตัน', '8.8', 'ตัน', '(13.4 + 14.8) − 19.4'),
      QA(C3_RAIN, 'เดือนที่ฝนตกมากที่สุด มีน้ำฝนมากกว่าเดือนที่น้อยที่สุดกี่มิลลิเมตร', '42.1', 'มิลลิเมตร', '146.3 − 104.2'),
      QA(C3_WOOD, 'ปี 2564–2568 สหกรณ์มีรายได้จากการขายต้นกล้า<b>เฉลี่ย</b>ปีละกี่บาท', '1789900', 'บาท', 'บวกทั้ง 5 ปี แล้วหารด้วย 5'),
      QA(C3_GAS, 'ราคามะม่วงลดลงมากที่สุดในช่วงปีใด (2565 → 2566) ลดลงกี่บาท', '11.8', 'บาท', '47.20 − 35.40'),
      QA(C3_EGG, 'ถ้าขายไข่ไก่แผงละ 80 บาท วันพุธขายได้เงินกี่บาท', '24000', 'บาท', '300 × 80'),
      QA(C3_RAIN, 'เดือนกรกฎาคมและสิงหาคมมีน้ำฝนรวมกันกี่มิลลิเมตร', '258.8', 'มิลลิเมตร', '146.3 + 112.5'), QA(C3_WOOD, 'ปี 2567 สหกรณ์มีรายได้มากกว่าปี 2566 กี่บาท', '1176200', 'บาท', '2,684,600 − 1,508,400')] /* v134: ≥ 8 ข้อ */),
  L5C(11, 63, 'ถ้ำโจทย์ย่น', 'โจทย์ปัญหาเกี่ยวกับแผนภูมิแท่งที่มีการย่นระยะ', 'โจทย์แผนภูมิย่นระยะ', 'แก้โจทย์ปัญหาจากแผนภูมิแท่งที่มีการย่นระยะ', [
    T('ตัวอย่างโจทย์ “<b>ส่วนที่ไม่ได้แสดงในแผนภูมิ</b>” — หาจากผลรวมทั้งหมด', 'ตัวอย่างหาส่วนที่ไม่ได้แสดงในแผนภูมิ จากผลรวมทั้งหมด', el => el.append(gWalk(C3_T_BOOK, [
      ['โจทย์', 'ทั้งปีได้รับบริจาค <b>6,000 เล่ม</b> ช่วงเดือน มิ.ย.–ธ.ค. ได้รับกี่เล่ม'],
      ['① อ่านค่า', '520 + 580 + 490 + 610 + 560', { guide: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] }], ['② รวม ม.ค.–พ.ค.', '= <b>2,760 เล่ม</b>'],
      ['③ ส่วนที่เหลือ', '6,000 − 2,760 = <b>3,240 เล่ม</b>']], 'โจทย์ 2 ขั้น: หาผลรวมก่อน แล้วค่อยลบ'))),
    T('ตัวอย่างที่ 2: แตะแท่งเพื่ออ่านค่า แล้วลองคิด “มากกว่าค่าเฉลี่ยกี่คน”', 'ตัวอย่างที่สอง แตะแท่งเพื่ออ่านค่า', el => el.append(simReadBar(C3_T_HEIGHT)))],
    () => [QA(C3_SPEND, 'ถ้ารายจ่ายทั้งหมดในปีนั้นรวม 4,000,000 บาท รายจ่ายเพื่อ<b>การศึกษา</b> (ไม่ได้แสดงในแผนภูมิ) กี่บาท', '255150', 'บาท', '4,000,000 − (1,724,580 + 362,470 + 298,150 + 1,186,390 + 173,260)'),
      QA(C3_SPEND, 'รายจ่ายด้าน<b>อาหาร</b>มากกว่า<b>การเดินทาง</b>กี่บาท', '538190', 'บาท'),
      QA(C3_POP, 'ประชากร<b>ภาคเหนือ</b>และ<b>ภาคกลาง</b>ต่างกันกี่พันคน', '7540', 'พันคน', '19,360 − 11,820'),
      QA(C3_POP, 'ภาคที่มีประชากรมากที่สุดกับน้อยที่สุดต่างกันกี่พันคน', '10820', 'พันคน'),
      QA(C3_SUBJ, 'นักเรียนชอบวิชาคณิตศาสตร์มากกว่าวิชาภาษาอังกฤษกี่คน', '38', 'คน'),
      QA(C3_SICK, 'ผู้ป่วยโรค<b>ระบบหายใจ</b>มากกว่าโรค<b>ติดเชื้อและปรสิต</b>กี่ครั้ง', '1474', 'ครั้ง')]),
  L5C(12, 64, 'ถ้ำโจทย์สองขั้น', 'โจทย์ปัญหาเกี่ยวกับแผนภูมิแท่งย่นระยะ (หลายขั้นตอน)', 'โจทย์แผนภูมิหลายขั้น', 'แก้โจทย์ปัญหาหลายขั้นตอนจากแผนภูมิแท่งเปรียบเทียบและแผนภูมิที่มีการย่นระยะ', [
    T('ตัวอย่างโจทย์ <b>หลายขั้น</b>: ผลรวม × ราคา', 'ตัวอย่างโจทย์หลายขั้น ผลรวมคูณราคา', el => el.append(gWalk(C3_T_FRUIT, [
      ['โจทย์', 'มะม่วงกิโลกรัมละ 40 บาท สองวันขายมะม่วงได้เงินเท่าไร'],
      ['① อ่านค่า', 'เสาร์ 45 กก. · อาทิตย์ 35 กก.', { guide: [[0, 0], [0, 1]], hl: ['0:0', '0:1'] }], ['② รวม', '45 + 35 = <b>80 กก.</b>'], ['③ คูณราคา', '80 × 40 = <b>3,200 บาท</b>']], 'อ่านค่า → รวม → คูณราคา'))),
    T('ตัวอย่างที่ 2: แผนภูมิเปรียบเทียบที่ย่นระยะ — แตะกลุ่มแท่งเพื่ออ่านค่าคู่', 'ตัวอย่างที่สอง แตะกลุ่มแท่งเพื่ออ่านค่าคู่', el => el.append(simDouble(C3_ZOO)))],
    () => [QA(C3_ZOO, 'ฮิปโปแคระมีผู้เข้าชม 2 วันรวมกันกี่คน', '65540', 'คน', '30,860 + 34,680'),
      QA(C3_ZOO, 'ถ้าบัตรเข้าชม<b>ฮิปโปแคระ</b>คนละ 50 บาท และ<b>ยีราฟ</b>คนละ 30 บาท ทั้งสองวันได้เงินรวมกี่บาท', '4429300', 'บาท', '(30,860 + 34,680) × 50 + (16,940 + 21,470) × 30'),
      QA(C3_SEED, 'ถ้าขายเมล็ดผักคะน้าซองละ 5 บาท ยอดขายเดือนมกราคมคิดเป็นเงินกี่บาท', '191320', 'บาท', '38,264 × 5'),
      QA(C3_SEED, 'เดือน ม.ค.–พ.ค. ร้านขายเมล็ดผักกาดได้ทั้งหมดกี่ซอง', '143141', 'ซอง'),
      QA(C3_TRADE, 'มูลค่าสินค้าขาเข้ารวม ม.ค.–พ.ค. ทั้งหมดกี่ล้านบาท', '4168315', 'ล้านบาท'),
      QA(C3_SCHOOL, 'ถ้าปีหน้าโรงเรียนแปดรับนักเรียนเพิ่ม 286 คน จะมีนักเรียนกี่คน', '3086', 'คน')])
];
/* boss 589: ข้อสอบท้ายบท — แต่งใหม่ทั้งหมด */
/* charts for boss 589 — invented data (original items) */
const X3_SALE = GS('จำนวนต้นไม้ที่ร้านต้นกล้าขายได้', 'จำนวน (ต้น)', 'เดือน', ['มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], [['ปีที่แล้ว', [120, 180, 150, 90]], ['ปีนี้', [160, 140, 200, 110]]], 0, 250, 50, { unit: 'ต้น' });
const X3_WATER = { kind: 'line', title: 'ปริมาณน้ำที่โรงเรียนใช้ ม.ค.–มิ.ย.', yName: 'ปริมาณน้ำ (ลูกบาศก์เมตร)', xName: 'เดือน', cats: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'], series: [{ name: '', v: [420, 460, 520, 610, 380, 450] }], min: 300, max: 700, step: 100, unit: 'ลูกบาศก์เมตร' };
const X3_CLUB = { horiz: true, kind: 'bar', title: 'จำนวนสมาชิกชมรมดนตรีไทย', yName: 'ชมรม', xName: 'จำนวน (คน)', cats: ['กลองยาว', 'ขลุ่ย'], series: [{ name: 'หญิง', v: [25, 35], col: '#FFFFFF' }, { name: 'ชาย', v: [30, 15], col: '#8F86B3' }], max: 40, step: 5, nolab: true };
const X3_FRUIT = GS('ผลไม้ที่นักเรียนชั้น ป.5 ชอบ', 'จำนวน (คน)', 'ผลไม้', ['มะม่วง', 'ส้ม', 'กล้วย', 'แตงโม', 'ทุเรียน'], [['', [64, 38, 45, 71, 52]]], 0, 80, 10, { unit: 'คน' });
const X3_BOOK = { kind: 'line', title: 'ยอดขายหนังสือของร้านแห่งหนึ่ง', yName: 'จำนวน (เล่ม)', xName: 'พ.ศ.', cats: ['2563', '2564', '2565', '2566', '2567'], series: [{ name: '', v: [1250, 1480, 1390, 1720, 1860] }], min: 1000, max: 2000, step: 200, unit: 'เล่ม' };
const X3_BIKE = GS('จำนวนนักเรียนที่ปั่นจักรยานมาโรงเรียน', 'จำนวน (คน)', 'ชั้น', ['ป.3', 'ป.4', 'ป.5', 'ป.6'], [['', [18, 27, 34, 41]]], 0, 50, 10, { unit: 'คน' });
const EXAM_P5C3 = xrot([
  { q: 'จากแผนภูมิยอดขายต้นไม้ ข้อใดกล่าวถูกต้อง', gchart: X3_SALE, opts: ['ปีนี้ขายได้รวมมากกว่าปีที่แล้ว 70 ต้น', 'เดือน ก.ค. ปีนี้ขายได้มากกว่าเดือน ก.ค. ปีที่แล้ว', 'เดือน ก.ย. ทั้งสองปีขายได้เท่ากัน', 'ปีที่แล้วเดือน ส.ค. ขายได้มากที่สุด'], a: 0 },
  { q: 'เดือน ส.ค. ของปีที่แล้วกับปีนี้ ขายต้นไม้ได้ต่างกันกี่ต้น', gchart: X3_SALE, opts: ['30 ต้น', '50 ต้น', '70 ต้น', '350 ต้น'], a: 1 },
  { q: 'รวมสองปี เดือนใดขายต้นไม้ได้น้อยที่สุด', gchart: X3_SALE, opts: ['เดือนมิถุนายน', 'เดือนกรกฎาคม', 'เดือนสิงหาคม', 'เดือนกันยายน'], a: 3 },
  { q: 'จากกราฟเส้นปริมาณน้ำที่โรงเรียนใช้ ข้อใดกล่าวถูกต้อง', gchart: X3_WATER, opts: ['เดือน เม.ย. ใช้น้ำเพิ่มขึ้นจากเดือน มี.ค. 90 ลูกบาศก์เมตร', 'เดือน พ.ค. ใช้น้ำมากกว่าเดือน เม.ย.', 'เดือน ก.พ. ใช้น้ำน้อยที่สุด', 'เดือน มิ.ย. ใช้น้ำลดลงจากเดือน พ.ค. 70 ลูกบาศก์เมตร'], a: 0 },
  { q: 'เดือนที่ใช้น้ำมากที่สุดกับเดือนที่ใช้น้ำน้อยที่สุด ใช้น้ำต่างกันเท่าใด', gchart: X3_WATER, opts: ['130 ลูกบาศก์เมตร', '190 ลูกบาศก์เมตร', '230 ลูกบาศก์เมตร', '280 ลูกบาศก์เมตร'], a: 2 },
  { q: 'ตั้งแต่เดือนมกราคมถึงเดือนมิถุนายน โรงเรียนใช้น้ำรวมทั้งหมดเท่าใด', gchart: X3_WATER, opts: ['2,480 ลูกบาศก์เมตร', '2,840 ลูกบาศก์เมตร', '2,940 ลูกบาศก์เมตร', '3,840 ลูกบาศก์เมตร'], a: 1 },
  { q: 'สมาชิกชมรมกลองยาวและชมรมขลุ่ย มีจำนวนต่างกันกี่คน', gchart: X3_CLUB, opts: ['5 คน', '10 คน', '15 คน', '20 คน'], a: 0 },
  { q: 'สมาชิกหญิงของสองชมรมมีจำนวนต่างกันกี่คน', gchart: X3_CLUB, opts: ['5 คน', '10 คน', '15 คน', '20 คน'], a: 1 },
  { q: 'สมาชิกชายของสองชมรมมีจำนวนต่างกันกี่คน', gchart: X3_CLUB, opts: ['5 คน', '10 คน', '15 คน', '25 คน'], a: 2 },
  { q: 'ถ้าต้องการให้สองชมรมมีสมาชิกรวมกัน 120 คน จะต้องรับสมาชิกเพิ่มอีกกี่คน', gchart: X3_CLUB, opts: ['5 คน', '15 คน', '25 คน', '35 คน'], a: 1 },
  { q: 'จากแผนภูมิ ผลไม้ชนิดใดมีผู้ชอบมากที่สุด', gchart: X3_FRUIT, opts: ['มะม่วง', 'แตงโม', 'ทุเรียน', 'กล้วย'], a: 1 },
  { q: 'นักเรียนที่ชอบมะม่วงมากกว่านักเรียนที่ชอบส้มกี่คน', gchart: X3_FRUIT, opts: ['16 คน', '26 คน', '36 คน', '102 คน'], a: 1 },
  { q: 'ถ้านักเรียนแต่ละคนเลือกผลไม้ได้ 1 ชนิด มีนักเรียนตอบแบบสอบถามทั้งหมดกี่คน', gchart: X3_FRUIT, opts: ['260 คน', '270 คน', '280 คน', '290 คน'], a: 1 },
  { q: 'ปีใดยอดขายหนังสือลดลงจากปีก่อน และลดลงกี่เล่ม', gchart: X3_BOOK, opts: ['พ.ศ. 2565 ลดลง 90 เล่ม', 'พ.ศ. 2564 ลดลง 230 เล่ม', 'พ.ศ. 2566 ลดลง 330 เล่ม', 'พ.ศ. 2567 ลดลง 140 เล่ม'], a: 0 },
  { q: 'ตั้งแต่ พ.ศ. 2563–2567 ร้านนี้ขายหนังสือได้เฉลี่ยปีละกี่เล่ม', gchart: X3_BOOK, opts: ['1,450 เล่ม', '1,540 เล่ม', '1,560 เล่ม', '7,700 เล่ม'], a: 1 },
  { q: 'ถ้าขายหนังสือเล่มละ 85 บาท ปี พ.ศ. 2567 ร้านนี้ได้เงินกี่บาท', gchart: X3_BOOK, opts: ['158,100 บาท', '148,800 บาท', '158,010 บาท', '15,810 บาท'], a: 0 },
  { q: 'ชั้นใดมีนักเรียนปั่นจักรยานมาโรงเรียนมากกว่าชั้น ป.4 อยู่ 14 คน', gchart: X3_BIKE, opts: ['ป.3', 'ป.5', 'ป.6', 'ไม่มีชั้นใดเลย'], a: 2 },
  { q: 'นักเรียนชั้น ป.3 และ ป.5 รวมกัน มากกว่าชั้น ป.6 กี่คน', gchart: X3_BIKE, opts: ['7 คน', '11 คน', '13 คน', '16 คน'], a: 1 },
  { q: 'ถ้าต้องการแสดงการเปลี่ยนแปลงของอุณหภูมิในแต่ละชั่วโมงของวันหนึ่ง ควรนำเสนอข้อมูลแบบใดจึงเหมาะสมที่สุด', opts: ['กราฟเส้น', 'แผนภูมิรูปภาพ', 'ตารางทางเดียวแบบรายการ', 'แผนภูมิแท่งเปรียบเทียบ'], a: 0 },
  { q: 'จากกราฟ ช่วงปีใดยอดขายหนังสือเพิ่มขึ้นมากที่สุด', gchart: X3_BOOK, opts: ['พ.ศ. 2563 → 2564', 'พ.ศ. 2565 → 2566', 'พ.ศ. 2566 → 2567', 'พ.ศ. 2564 → 2565'], a: 1 }
], 3);
LESSONS_P5C3.push({ id: 589, boss: true, place: 'ถ้ำราชาหมีกราฟ', title: 'ด่านบอส: บทที่ 3 การนำเสนอข้อมูล', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'อ่านแผนภูมิและกราฟ ตอบคำถาม 20 ข้อ ตอบถูกอย่างน้อย 10 ข้อเพื่อชนะบอส',
  exam: EXAM_P5C3, pass: 10, bossName: 'ราชาหมีกราฟ', bossPal: 'jade', emblem: 'กราฟ', bossKind: 'bear' });
