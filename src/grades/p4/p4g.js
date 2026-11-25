/* =========================================================
   prefix g4 · reuses the P5 chart kit (p5c: chartSVG/dataChart/chartBuilder/gTable/simReadBar/simBuild/gWalk · Q.gAsk/gPick/gBuild)
   and the P3 survey sheet (pc3SheetHTML/pc3Mark/pc3Cells, tallySVG)
   NEW: two-way tables g4TwHTML (header · rows · columns · totals) + games:
   - สำรวจแล้วกรอกตาราง (Q.g4TwTally) · เติมช่องที่หายจากผลรวม (Q.g4TwFill) · แตะช่องคำตอบในตาราง (Q.g4TwTap) · คำนวณจากตาราง (Q.g4TwAsk)
   - แตะแท่ง (Q.g4TapBar) · เรียงแท่งจากมากไปน้อยด้วยการแตะ (Q.g4Rank) · แท่งที่ถูกซ่อน (Q.g4Hidden) · จับผิดแผนภูมิ (Q.g4Spot) · เลือกมาตราส่วน (Q.g4Scale)
   ========================================================= */
/* ---------- two-way tables ---------- */
// T = { title, rowH, cols:[..], rows:[[name,[v..]]], unit, total:true }
const g4Tot = T => ({ r: T.rows.map(([, v]) => v.reduce((a, b) => a + b, 0)), c: T.cols.map((_, j) => T.rows.reduce((a, [, v]) => a + v[j], 0)) });
const g4All = T => g4Tot(T).r.reduce((a, b) => a + b, 0);
function g4TwHTML(T, o = {}) { const t = g4Tot(T), tot = T.total !== false, bl = o.blank || [], hl = o.hl || [], cell = (key, v) => bl.includes(key) ? `<td class="n g4-b" data-k="${key}"></td>` : `<td class="n${hl.includes(key) ? ' on' : ''}" data-k="${key}">${fmt(v)}</td>`;
  let s = `<div class="g4tw">${T.title && !o.notitle ? `<div class="pc3-tt">${T.title}</div>` : ''}<table><tr class="hd"><td rowspan="2">${T.rowH}</td><td colspan="${T.cols.length + (tot ? 1 : 0)}">${T.unit === 'บาท' ? 'ราคา' : 'จำนวน'} (${T.unit})</td></tr><tr class="hd">${T.cols.map(c => `<td>${c}</td>`).join('')}${tot ? '<td>รวม</td>' : ''}</tr>`;
  T.rows.forEach(([n, v], i) => { s += `<tr><td class="rh${hl.includes('r' + i) ? ' on' : ''}" data-k="r${i}">${n}</td>${v.map((x, j) => cell(`${i},${j}`, x)).join('')}${tot ? cell(`${i},t`, t.r[i]) : ''}</tr>`; });
  if (tot) s += `<tr class="tot"><td>รวม</td>${t.c.map((x, j) => cell(`t,${j}`, x)).join('')}${cell('t,t', g4All(T))}</tr>`;
  return s + '</table></div>'; }
const g4val = (T, k) => { const [a, b] = k.split(','), t = g4Tot(T); if (a === 't' && b === 't') return g4All(T); if (a === 't') return t.c[+b]; if (b === 't') return t.r[+a]; return T.rows[+a][1][+b]; };
const g4keyTxt = (T, k) => { const [a, b] = k.split(','), r = a === 't' ? 'รวมทุก' + T.rowH : T.rows[+a][0], c = b === 't' ? 'รวม' : T.cols[+b]; return `${r} (${c})`; };
/* random two-way tables */
const G4_TW = [
  ['จำนวนสมาชิกชมรมต่าง ๆ ของโรงเรียนแห่งหนึ่ง', 'ชมรม', ['ชาย', 'หญิง'], ['ถ่ายภาพ', 'ศิลปะ', 'ดนตรี', 'วาดภาพ', 'หุ่นยนต์', 'ทำอาหาร'], 'คน', [8, 50]],
  ['จำนวนนักเรียนแต่ละห้อง', 'ห้อง', ['ชาย', 'หญิง'], ['ป.4/1', 'ป.4/2', 'ป.4/3', 'ป.4/4'], 'คน', [12, 24]],
  ['ผลไม้ที่ขายได้ในวันหยุด', 'ผลไม้', ['เสาร์', 'อาทิตย์'], ['มะม่วง', 'ส้ม', 'มังคุด', 'เงาะ', 'ทุเรียน'], 'กิโลกรัม', [15, 90]],
  ['เสื้อนักกีฬาที่ร้านมีในสต็อก', 'ขนาด', ['สีแดง', 'สีฟ้า', 'สีเหลือง'], ['S', 'M', 'L'], 'ตัว', [10, 60]],
  ['วิธีมาโรงเรียนของนักเรียน', 'วิธีเดินทาง', ['ป.4', 'ป.5', 'ป.6'], ['เดิน', 'จักรยาน', 'รถโรงเรียน', 'ผู้ปกครองมาส่ง'], 'คน', [8, 45]],
  ['หนังสือที่ห้องสมุดให้ยืม', 'ประเภท', ['มิถุนายน', 'กรกฎาคม'], ['นิทาน', 'สารคดี', 'การ์ตูน', 'นิตยสาร'], 'เล่ม', [20, 140]],
  ['จำนวนต้นไม้ที่นักเรียนปลูก', 'ชั้น', ['ต้นมะม่วง', 'ต้นสัก', 'ต้นยางนา'], ['ป.3', 'ป.4', 'ป.5'], 'ต้น', [5, 40]],
  ['ปริมาณข้าวที่สหกรณ์รับซื้อ', 'หมู่บ้าน', ['ข้าวเจ้า', 'ข้าวเหนียว'], ['บ้านนา', 'บ้านทุ่ง', 'บ้านโคก', 'บ้านหนอง'], 'ตัน', [10, 95]]];
const g4twRand = (i, nr) => { const [title, rowH, cols, names, unit, [lo, hi]] = i == null ? pick(G4_TW) : G4_TW[i], R = pkF(names, Math.min(names.length, nr || rnd(3, 4))).sort((a, b) => names.indexOf(a) - names.indexOf(b));
  return { title, rowH, cols, unit, rows: R.map(n => [n, cols.map(() => rnd(lo, hi))]) }; };
/* ---------- bar-chart data ---------- */
const G4_BAR = [
  ['จำนวนนักเรียนชั้น ป.4 ที่เลือกเล่นกีฬาแต่ละชนิด', 'จำนวน (คน)', 'กีฬา', ['ฟุตบอล', 'วอลเลย์บอล', 'ปิงปอง', 'ว่ายน้ำ', 'แบดมินตัน'], 'คน', [10, 20, 50]],
  ['จำนวนผลไม้ในร้านค้าแห่งหนึ่ง', 'จำนวน (ลูก)', 'ผลไม้', ['มะเฟือง', 'มังคุด', 'ส้มโอ', 'แตงโม', 'มะม่วง'], 'ลูก', [50, 100, 200]],
  ['จำนวนเครื่องดื่มที่ร้านขายได้ในหนึ่งเดือน', 'จำนวน (แก้ว)', 'เครื่องดื่ม', ['โกโก้', 'ชาเย็น', 'นมชมพู', 'กาแฟ', 'น้ำส้ม'], 'แก้ว', [100, 200, 500]],
  ['จำนวนผู้เข้าชมพิพิธภัณฑ์', 'จำนวน (คน)', 'วัน', ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'], 'คน', [100, 500, 1000]],
  ['จำนวนหนังสือที่นักเรียนอ่านในหนึ่งภาคเรียน', 'จำนวน (เล่ม)', 'ชื่อ', ['ต้นข้าว', 'มะลิ', 'ภูผา', 'ใบเตย', 'ก้อง'], 'เล่ม', [2, 4]],
  ['จำนวนเงินออมของนักเรียน', 'จำนวนเงิน (บาท)', 'ชื่อ', ['ปุ้ม', 'น้ำใส', 'วายุ', 'แพรวา', 'ธันวา'], 'บาท', [20, 50, 100]],
  ['ปริมาณน้ำฝนในแต่ละเดือน', 'ปริมาณ (มิลลิเมตร)', 'เดือน', ['พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], 'มิลลิเมตร', [10, 20, 50]],
  ['จำนวนต้นไม้ที่แต่ละห้องปลูก', 'จำนวน (ต้น)', 'ห้อง', ['ป.4/1', 'ป.4/2', 'ป.4/3', 'ป.4/4'], 'ต้น', [4, 10]],
  ['จำนวนรถที่ผ่านหน้าโรงเรียนใน 1 ชั่วโมง', 'จำนวน (คัน)', 'ชนิดรถ', ['รถยนต์', 'จักรยานยนต์', 'รถบัส', 'จักรยาน', 'รถกระบะ'], 'คัน', [4, 10, 20]]];
/* values are multiples of half a step (readable on the grid) */
const g4barRand = (i, o = {}) => { const [title, yName, xName, cats0, unit, steps] = i == null ? pick(G4_BAR) : G4_BAR[i], step = pick(steps), n = Math.min(cats0.length, o.n || rnd(4, cats0.length)), cats = cats0.slice(0, n);
  const top = step * rnd(6, 9), half = o.full || step % 2 ? 1 : 2; /* half-step values only when the step is even → never a decimal answer (ผู้ใช้ขอ) */ let v; for (;;) { v = cats.map(() => Math.round(rnd(step, top - step / half) * half / step) * step / half); if (new Set(v).size === v.length) break; }
  return { kind: 'bar', title, yName, xName, cats, series: [{ name: '', v }], min: 0, max: top, step, snap: step / half, unit, nolab: !!o.nolab, horiz: !!o.horiz }; };
const g4cat = (C, i) => String(C.cats[i]);
const g4V = (C, i) => C.series[0].v[i];
/* ป.4 บท 10 (ผู้ใช้ขอ): table / chart on the LEFT, answer on the RIGHT (unit beside the ? slot, keypad under it) — on every screen, portrait too */
const g4Ans = (ctx, a, hint, unit) => { const v = String(a).replace(/,/g, ''), an = /^\d+$/.test(v) ? answerBox(ctx, v, { hint }) : decAnswer(ctx, DQ(v), { hint }), sl = an.querySelector(':scope > .ans-slot'); /* v155: คำตอบจำนวนนับไม่ต้องมีปุ่มจุด */
  if (unit && sl) { const row = h('div', { class: 'ans-urow' }); sl.replaceWith(row); row.append(sl, h('span', { class: 'cap g4u' }, unit)); } return an; };
const g4Side = (left, ...right) => h('div', { class: 'g4sd' }, h('div', { class: 'g4sd-l' }, left), h('div', { class: 'g4sd-r' }, ...right));
const g4SideAsk = (C, q, a, unit, hint, sig) => ({ prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: sig, mount(bd, ctx) { bd.append(g4Side(dataChart(C), g4Ans(ctx, a, hint, unit))); } });

/* =========================================================
   TEACHING SIMULATIONS
   ========================================================= */
/* survey chips → two-way table: tap a chip, its count goes to its cell */
function simG4Survey(S) { const box = h('div', { class: 'colstack' }, h6wait()), sheet = h('div', { class: 'pw-fig', html: g4SheetHTML(S) }), tab = h('div'), out = fNote(), T = { title: S.title, rowH: S.rowH, cols: S.cols, unit: S.unit, rows: S.rowsN.map(n => [n, S.cols.map(() => 0)]) }; let left = S.list.length, last = null;
  const draw = () => { tab.innerHTML = g4TwHTML(T, { notitle: true, hl: last ? [last] : [] }); };
  sheet.addEventListener('click', e => { const c = e.target.closest('.pc3-chip'); if (!c || c.classList.contains('x')) return; e.stopPropagation(); c.classList.add('x'); const [r, k] = S.list[+c.dataset.i]; T.rows[r][1][k]++; last = `${r},${k}`; left--; sfx.pop(Math.min(8, T.rows[r][1][k])); draw();
    out.innerHTML = left ? `${S.rowsN[r]} · ${S.cols[k]} +1 · เหลืออีก ${left} คน` : 'นับครบแล้ว! แถวสุดท้ายและหลักสุดท้ายคือผลรวม'; if (!left) { sfx.ok(); teachDone(box); } });
  out.innerHTML = 'แตะคำตอบทีละคน ตัวเลขจะไปอยู่ในช่องที่ตรงกับ<b>แถว</b>และ<b>หลัก</b>'; draw(); box.append(sheet, tab, out); return box; }
const g4SheetHTML = S => `<div class="pc3-sheet"><div class="pc3-tt">${S.title}</div><div class="pc3-chips" style="--c:${S.colsN || 4}">${S.list.map(([r, k], i) => `<span class="pc3-chip g4chip" data-i="${i}">${S.cols[k]}·${S.rowsN[r]}</span>`).join('')}</div></div>`;
const g4survey = (title, rowH, rowsN, cols, unit, counts) => { const list = []; counts.forEach((row, r) => row.forEach((n, k) => { for (let i = 0; i < n; i++) list.push([r, k]); })); let seed = rowsN.length * 31 + list.length; list.sort(() => ((seed = (seed * 9301 + 49297) % 233280) / 233280) - .5); return { title, rowH, rowsN, cols, unit, list }; };
/* tap cells of a two-way table: name of the row + column, and the totals */
function simG4Read(T) { const box = h('div', { class: 'colstack' }, h6wait()), tab = h('div', { class: 'ia' }), out = fNote(), seen = new Set();
  const draw = k => { tab.innerHTML = g4TwHTML(T, { hl: k ? [k] : [] }); };
  tab.addEventListener('click', e => { const td = e.target.closest('td[data-k]'); if (!td || td.dataset.k.startsWith('r')) return; e.stopPropagation(); const k = td.dataset.k; draw(k); sfx.pop(3); seen.add(k.includes('t') ? 't' : 'c');
    const [a, b] = k.split(','); out.innerHTML = a === 't' && b === 't' ? `รวมทั้งหมด <b>${fmt(g4All(T))}</b> ${T.unit}` : a === 't' ? `รวม${T.cols[+b]}ทุก${T.rowH} = ${T.rows.map(([, v]) => v[+b]).join(' + ')} = <b>${fmt(g4val(T, k))}</b> ${T.unit}` : b === 't' ? `${T.rows[+a][0]} รวม = ${T.rows[+a][1].join(' + ')} = <b>${fmt(g4val(T, k))}</b> ${T.unit}` : `${T.rowH} <b>${T.rows[+a][0]}</b> · <b>${T.cols[+b]}</b> = <b>${fmt(g4val(T, k))}</b> ${T.unit}`;
    if (seen.size >= 2) teachDone(box); });
  out.innerHTML = 'แตะตัวเลขในตาราง: อ่านชื่อ<b>แถว</b>ทางซ้าย และชื่อ<b>หลัก</b>ด้านบน · ลองแตะช่อง “รวม” ด้วย'; draw(); box.append(tab, out); return box; }

/* =========================================================
   QUESTION TYPES
   ========================================================= */
Object.assign(Q, {
  /* survey sheet → fill the two-way table */
  g4TwTally({ S, give }) { const T = { title: S.title, rowH: S.rowH, cols: S.cols, unit: S.unit, total: false, rows: S.rowsN.map((n, r) => [n, S.cols.map((_, k) => S.list.filter(([a, b]) => a === r && b === k).length)]) };
    const keys = []; T.rows.forEach((_, i) => T.cols.forEach((_, j) => keys.push(`${i},${j}`))); const blanks = keys.filter(k => !give.includes(k)), q = 'นับคำตอบจากผลสำรวจ แล้วเติมตาราง 2 ทาง';
    return { prompt: q + ' <small>(แตะคำตอบเพื่อขีดฆ่าขณะนับ)</small>', say: q, __sig: `g4y ${S.title} ${S.list.map(x => x.join('')).join('')} ${give}`, mount(bd, ctx) { const C = pc3Cells(ctx, blanks.map(k => g4val(T, k)), { hint: 'นับเฉพาะคำตอบที่ตรงกับทั้งแถวและหลักของช่องนั้น' }); const sheet = h('div', { class: 'p4-fig', html: g4SheetHTML(S) }); pc3Mark(sheet);
      const tb = h('div', { html: g4TwHTML(T, { blank: blanks, notitle: true }) }); tb.querySelectorAll('.g4-b').forEach(td => td.append(C.slots[blanks.indexOf(td.dataset.k)]));
      bd.append(h('div', { class: 't6-q p4-q p2q pc3-fillq' }, h('div', { class: 'pc3-pair' }, sheet, h('div', { class: 'p4-fig pc3-fillt' }, tb)), C.wrap)); } }; },
  /* missing cells from the totals */
  g4TwFill({ T, blanks }) { const q = 'เติมจำนวนในช่องที่ว่าง <small>(ใช้ผลรวมของแถวหรือหลัก)</small>';
    return { prompt: q, say: 'เติมจำนวนในช่องที่ว่าง ใช้ผลรวมของแถวหรือหลัก', __sig: `g4f ${JSON.stringify(T.rows)} ${blanks}`, mount(bd, ctx) { const C = pc3Cells(ctx, blanks.map(k => g4val(T, k)), { hint: 'ช่องที่หาย = ผลรวม − จำนวนอื่นในแถว (หรือหลัก) เดียวกัน' });
      const tb = h('div', { html: g4TwHTML(T, { blank: blanks }) }); tb.querySelectorAll('.g4-b').forEach(td => td.append(C.slots[blanks.indexOf(td.dataset.k)]));
      bd.append(h('div', { class: 't6-q p4-q' }, h('div', { class: 'p4-fig pc3-fillt' }, tb), C.wrap)); } }; },
  /* tap the cell that answers the question */
  g4TwTap({ T, ask }) { const t = g4Tot(T); let q, ok, hint;
    if (ask.k === 'cell') { q = `แตะช่องที่บอกจำนวน${T.rowH} <b>${T.rows[ask.r][0]}</b> ที่เป็น <b>${T.cols[ask.c]}</b>`; ok = k => k === `${ask.r},${ask.c}`; hint = 'หาแถวทางซ้ายก่อน แล้วไล่ไปทางขวาจนถึงหลักที่ต้องการ'; }
    else if (ask.k === 'maxcol') { const vs = T.rows.map(([, v]) => v[ask.c]), m = Math.max(...vs); q = `${T.rowH}ใดมี<b>${T.cols[ask.c]}</b>มากที่สุด แตะช่องตัวเลขนั้น`; ok = k => { const [a, b] = k.split(','); return b === String(ask.c) && a !== 't' && T.rows[+a][1][ask.c] === m; }; hint = `ดูเฉพาะหลัก “${T.cols[ask.c]}” แล้วหาจำนวนที่มากที่สุด`; }
    else if (ask.k === 'mintot') { const m = Math.min(...t.r); q = `${T.rowH}ใดมี<b>รวมน้อยที่สุด</b> แตะช่องผลรวมนั้น`; ok = k => { const [a, b] = k.split(','); return b === 't' && a !== 't' && t.r[+a] === m; }; hint = 'ดูหลัก “รวม” ทางขวาสุด'; }
    else { q = `แตะช่องที่บอกจำนวน<b>${T.cols[ask.c]}ทั้งหมด</b>`; ok = k => k === `t,${ask.c}`; hint = 'ผลรวมของแต่ละหลักอยู่ในแถว “รวม” ล่างสุด'; }
    const me = { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `g4t ${JSON.stringify(T.rows)} ${JSON.stringify(ask)}`, mount(bd, ctx) { const tab = h('div', { class: 'ia rvl', html: g4TwHTML(T) });
      tab.addEventListener('click', e => { const td = e.target.closest('td[data-k]'); if (!td || tab.dataset.done || td.dataset.k.startsWith('r')) return; e.stopPropagation(); const good = ok(td.dataset.k); td.classList.remove('bad'); void td.offsetWidth; td.classList.add(good ? 'ok' : 'bad'); if (good) tab.dataset.done = 1; ctx.check(good, hint); });
      tab.reveal = () => { tab.querySelectorAll('td[data-k]').forEach(td => { if (!td.dataset.k.startsWith('r') && ok(td.dataset.k)) td.classList.add('ok'); }); tab.dataset.done = 1; };
      bd.append(h('div', { class: 't6-q p4-q' }, tab, h('div', { class: 'cap' }, 'แตะที่ช่องในตาราง'))); } };
    return me; },
  /* compute from the table */
  g4TwAsk({ T, q, a, hint, sig }) { return { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `g4a ${sig}`, mount(bd, ctx) { bd.append(g4Side(h('div', { class: 'p4-fig', html: g4TwHTML(T) }), g4Ans(ctx, a, hint, T.unit))); } }; },
  /* tap a bar */
  g4TapBar({ C, want }) { const vs = C.series[0].v, m = want === 'max' ? Math.max(...vs) : want === 'min' ? Math.min(...vs) : want, idx = vs.indexOf(m);
    const q = want === 'max' ? `แตะแท่งที่มี<span class="hl">มากที่สุด</span>` : want === 'min' ? `แตะแท่งที่มี<span class="hl">น้อยที่สุด</span>` : `แตะแท่งที่มีค่า <b>${gNum(want)}</b> ${C.unit}`;
    const me = { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `g4b ${C.title} ${vs} ${want}`, mount(bd, ctx) { let done = false; const ch = dataChart(C, { onTap: ci => { if (done) return; const good = ci === idx; ch.draw({ hl: [ci + ':0'], guide: [[ci, 0]] }); if (good) done = true; ctx.check(good, want === 'max' || want === 'min' ? 'เทียบความสูงของปลายแท่ง' : 'ลากเส้นจากค่าบนแกนตั้งไปหาแท่งที่ปลายแตะพอดี'); } });
      ch.classList.add('rvl'); ch.reveal = () => { done = true; ch.draw({ hl: [idx + ':0'], guide: [[idx, 0]] }); }; bd.append(h('div', { class: 't6-q p4-q' }, ch)); } };
    return me; },
  /* tap the bars from most to least */
  g4Rank({ C, dir }) { const vs = C.series[0].v, order = vs.map((v, i) => [v, i]).sort((a, b) => dir === 'asc' ? a[0] - b[0] : b[0] - a[0]).map(x => x[1]);
    const q = `แตะแท่งเรียงจาก<span class="hl">${dir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}</span>`;
    const me = { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `g4r ${C.title} ${vs} ${dir}`, mount(bd, ctx) { let k = 0; const lab = h('div', { class: 'p4steplab' }, 'แตะแท่งแรก');
      const ch = dataChart(C, { onTap: ci => { if (k >= order.length) return; if (ci === order[k]) { k++; sfx.pop(k); ch.draw({ hl: order.slice(0, k).map(i => i + ':0'), hlc: order.slice(0, k) }); lab.innerHTML = order.slice(0, k).map(i => g4cat(C, i)).join(' → '); if (k === order.length) ctx.check(true); }
        else if (!order.slice(0, k).includes(ci)) ctx.check(false, dir === 'asc' ? 'เลือกแท่งที่เตี้ยที่สุดในบรรดาแท่งที่เหลือ' : 'เลือกแท่งที่สูงที่สุดในบรรดาแท่งที่เหลือ'); } });
      ch.classList.add('rvl'); ch.reveal = () => { k = order.length; ch.draw({ hl: order.map(i => i + ':0') }); lab.innerHTML = order.map(i => g4cat(C, i)).join(' → '); };
      bd.append(h('div', { class: 't6-q p4-q' }, ch, lab)); } };
    return me; },
  /* one bar hidden: the total is known */
  g4Hidden({ C, i }) { const vs = C.series[0].v, tot = vs.reduce((a, b) => a + b, 0), C2 = { ...C, series: [{ name: '', v: vs.map((v, k) => k === i ? null : v) }], nolab: false };
    const q = `แท่งของ<b>${g4cat(C, i)}</b>ถูกซ่อนไว้ ถ้า${C.title}รวมทั้งหมด <b>${fmt(tot)}</b> ${C.unit} ${g4cat(C, i)}มีจำนวนเท่าใด`; /* v155: เดิมขึ้นต้นด้วยชื่อแผนภูมิ → promptOnce คิดว่าโจทย์อยู่ในการ์ดแล้ว ตัดเหลือ “อ่านโจทย์ แล้วตอบ” จนโจทย์หาย */
    const me = { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `g4h ${C.title} ${vs} ${i}`, mount(bd, ctx) { const ch = dataChart(C2, { st: { hlc: [i] } });
      const ans = g4Ans(ctx, vs[i], 'นำผลรวมทั้งหมด ลบด้วยค่าของแท่งอื่นทุกแท่ง', C.unit);
      ctx.onRight = () => { if (ch.isConnected) ch.replaceWith(dataChart(C, { st: { hl: [i + ':0'] } })); }; bd.append(g4Side(ch, ans)); } };
    return me; },
  /* spot the bar that was drawn wrong */
  g4Spot({ C, i, wrong }) { const vs = C.series[0].v, D = { ...C, series: [{ name: '', v: vs.map((v, k) => k === i ? wrong : v) }], nolab: true }, Tb = { ...C, nolab: false };
    const me = { prompt: 'ตารางถูกต้อง แต่แผนภูมิวาด<span class="hl">ผิด 1 แท่ง</span> แตะแท่งที่ผิด', say: 'ตารางถูกต้อง แต่แผนภูมิวาดผิดหนึ่งแท่ง แตะแท่งที่ผิด', __sig: `g4s ${C.title} ${vs} ${i}`, mount(bd, ctx) { let done = false;
      const ch = dataChart(D, { onTap: ci => { if (done) return; const good = ci === i; ch.draw({ hl: [ci + ':0'], guide: [[ci, 0]] }); if (good) { done = true; } ctx.check(good, 'อ่านค่าปลายแท่งทีละแท่ง แล้วเทียบกับตัวเลขในตาราง'); } });
      ch.classList.add('rvl'); ch.reveal = () => { done = true; ch.draw({ hl: [i + ':0'], guide: [[i, 0]] }); };
      bd.append(h('div', { class: 'rowstack gq' }, gTable(Tb, { sm: true }), ch)); } };
    return me; },
  /* which scale fits the data */
  g4Scale({ C }) { const mx = Math.max(...C.series[0].v), right = C.step, opts = [...new Set([right, right * 10, Math.max(1, right / 10)].map(x => x >= 1 ? x : 1))];
    const tb = gTable({ ...C, nolab: false }, { sm: true }).outerHTML;
    return { ...Q.p4Pick({ fig: tb, q: `จะเขียนแผนภูมิแท่งจากตารางนี้ ควรให้ 1 ช่องบนแกนตั้งแทนเท่าใด <small>(แกนมี 6–9 ช่อง)</small>`, say: 'จะเขียนแผนภูมิแท่งจากตารางนี้ ควรให้หนึ่งช่องบนแกนตั้งแทนเท่าใด', opts: opts.map(x => `ช่องละ ${fmt(x)} ${C.unit}`), right: `ช่องละ ${fmt(right)} ${C.unit}`, hint: `ค่ามากที่สุด ${fmt(mx)} ต้องอยู่บนแกนได้ภายใน 6–9 ช่อง` }), __sig: `g4c ${C.title} ${C.series[0].v}` }; }
});
const g4Ask = (C, q, a, hint, sig) => g4SideAsk({ ...C, nolab: false }, q, a, C.unit, hint, 'g4k ' + sig);
const g4Read = C => { const i = rnd(0, C.cats.length - 1); return g4SideAsk({ ...C, nolab: true }, `<b>${g4cat(C, i)}</b> มีจำนวนเท่าใด <small>(อ่านจากแกน)</small>`, g4V(C, i), C.unit, 'ลากเส้นจากปลายแท่งไปที่แกนตั้ง แล้วอ่านค่า (ครึ่งช่องคือครึ่งหนึ่งของช่อง)', `g4e ${C.title} ${C.series[0].v} ${i}`); };
/* problems from a bar chart */
const g4BarQ = (C, k0) => { const v = C.series[0].v, n = v.length, [i, j] = pkF([...Array(n).keys()], 2), k = k0 || pick(['diff', 'sum', 'all', 'price', 'more']), u = C.unit; /* v252: k0 = ชนิดโจทย์ที่ต้องการ (หน้าลองทำ/เกมเรียงตามประเด็น) */
  if (k === 'diff') return g4Ask(C, `<b>${g4cat(C, i)}</b> กับ <b>${g4cat(C, j)}</b> ต่างกันเท่าใด`, Math.abs(v[i] - v[j]), 'นำค่าที่มากกว่า ลบด้วยค่าที่น้อยกว่า', `${C.title}${v}d${i}${j}`);
  if (k === 'sum') return g4Ask(C, `<b>${g4cat(C, i)}</b> และ <b>${g4cat(C, j)}</b> รวมกันเท่าใด`, v[i] + v[j], 'อ่านค่าทั้งสองแท่งแล้วบวกกัน', `${C.title}${v}s${i}${j}`);
  if (k === 'all') return g4Ask(C, 'รวมทั้งหมดเท่าใด', v.reduce((a, b) => a + b, 0), 'บวกค่าทุกแท่ง', `${C.title}${v}a`);
  if (k === 'price' && ['ลูก', 'แก้ว', 'เล่ม'].includes(u)) { const p = pick([5, 10, 15, 20, 25]); return g4Ask({ ...C, unit: 'บาท' }, `ถ้าขาย<b>${g4cat(C, i)}</b> ${u === 'เล่ม' ? 'เล่ม' : u}ละ ${p} บาท จะได้เงินเท่าใด`, v[i] * p, `จำนวน${g4cat(C, i)} × ${p}`, `${C.title}${v}p${i}${p}`); }
  const big = Math.max(v[i], v[j]), sm = Math.min(v[i], v[j]), bi = v[i] > v[j] ? i : j, si = bi === i ? j : i;
  return g4Ask(C, `<b>${g4cat(C, bi)}</b> มากกว่า <b>${g4cat(C, si)}</b> อยู่เท่าใด`, big - sm, 'หาผลต่างของสองแท่ง', `${C.title}${v}m${i}${j}`); };
/* problems from a two-way table */
const g4TwQ = (T, kind) => { const t = g4Tot(T), u = T.unit, n = T.rows.length, [i, j] = pkF([...Array(n).keys()], 2), c = rnd(0, T.cols.length - 1), sig = `${JSON.stringify(T.rows)}`;
  const k = kind || pick(['rowtot', 'coltot', 'diffrow', 'diffcol', 'sum2', 'all']);
  if (k === 'rowtot') return Q.g4TwAsk({ T: { ...T, total: false }, q: `${T.rowH}<b>${T.rows[i][0]}</b> มีทั้งหมดเท่าใด`, a: t.r[i], hint: 'บวกจำนวนทุกช่องในแถวนั้น', sig: sig + 'rt' + i });
  if (k === 'coltot') return Q.g4TwAsk({ T: { ...T, total: false }, q: `<b>${T.cols[c]}</b> ทุก${T.rowH}รวมกันเท่าใด`, a: t.c[c], hint: 'บวกจำนวนทุกช่องในหลักนั้น', sig: sig + 'ct' + c });
  if (k === 'diffrow') return Q.g4TwAsk({ T, q: `${T.rowH}<b>${T.rows[i][0]}</b> มี${T.cols[0]}มากกว่าหรือน้อยกว่า${T.cols[1]} อยู่เท่าใด`, a: Math.abs(T.rows[i][1][0] - T.rows[i][1][1]), hint: 'อ่านสองช่องในแถวเดียวกัน แล้วหาผลต่าง', sig: sig + 'dr' + i });
  if (k === 'diffcol') return Q.g4TwAsk({ T, q: `<b>${T.cols[c]}</b> ของ${T.rows[i][0]} กับ ${T.rows[j][0]} ต่างกันเท่าใด`, a: Math.abs(T.rows[i][1][c] - T.rows[j][1][c]), hint: 'อ่านสองช่องในหลักเดียวกัน แล้วหาผลต่าง', sig: sig + 'dc' + i + j + c });
  if (k === 'sum2') return Q.g4TwAsk({ T, q: `${T.rowH}<b>${T.rows[i][0]}</b> และ <b>${T.rows[j][0]}</b> รวมกันทั้งหมดเท่าใด`, a: t.r[i] + t.r[j], hint: 'ใช้ผลรวมของสองแถว แล้วบวกกัน', sig: sig + 's2' + i + j });
  return Q.g4TwAsk({ T: { ...T, total: false }, q: 'รวมทั้งหมดในตารางเท่าใด', a: g4All(T), hint: 'บวกทุกช่อง (หรือรวมทีละแถวแล้วบวกกัน)', sig: sig + 'all' }); };
const g4twTapQ = T => { const k = pick(['cell', 'maxcol', 'mintot', 'coltot']), t = g4Tot(T), c = rnd(0, T.cols.length - 1);
  if (k === 'maxcol' && new Set(T.rows.map(([, v]) => v[c])).size < T.rows.length) return Q.g4TwTap({ T, ask: { k: 'cell', r: rnd(0, T.rows.length - 1), c } });
  if (k === 'mintot' && new Set(t.r).size < t.r.length) return Q.g4TwTap({ T, ask: { k: 'coltot', c } });
  return Q.g4TwTap({ T, ask: { k, r: rnd(0, T.rows.length - 1), c } }); };
const g4fillQ = () => { const T = g4twRand(null, rnd(3, 4)), n = T.rows.length, m = T.cols.length, cand = []; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) cand.push(`${i},${j}`);
  const b1 = pick(cand), [r1, c1] = b1.split(','), cand2 = cand.filter(k => { const [r, c] = k.split(','); return r !== r1 && c !== c1; }), b2 = pick(cand2), b3 = Math.random() < .5 ? `${pick([...Array(n).keys()].filter(i => String(i) !== r1 && String(i) !== b2.split(',')[0]).concat([0]))},t` : 't,' + rnd(0, m - 1);
  return Q.g4TwFill({ T, blanks: [...new Set([b1, b2, b3])] }); };
const g4tallyQ = () => { const P = pick([['ผลไม้ที่ชอบ', 'ผลไม้', ['มะม่วง', 'ส้ม', 'กล้วย'], ['ชาย', 'หญิง']], ['สัตว์เลี้ยงที่อยากมี', 'สัตว์', ['แมว', 'สุนัข', 'ปลา'], ['ป.4/1', 'ป.4/2']], ['กีฬาที่ชอบ', 'กีฬา', ['ฟุตบอล', 'แบดมินตัน', 'ว่ายน้ำ'], ['ชาย', 'หญิง']], ['สีที่ชอบ', 'สี', ['แดง', 'ฟ้า', 'เขียว'], ['ชาย', 'หญิง']]]);
  const counts = P[2].map(() => P[3].map(() => rnd(1, 5))), S = g4survey(`ผลสำรวจ${P[0]}ของนักเรียน`, P[1], P[2], P[3], 'คน', counts), keys = []; P[2].forEach((_, i) => P[3].forEach((_, j) => keys.push(`${i},${j}`)));
  return Q.g4TwTally({ S, give: pkF(keys, 2) }); };
/* word problems with a table / chart in the story box */
const g4FigStory = (fig, text, expr, wrong, unit) => { const base = Q.p4Story2(D6S(text, expr, wrong, unit)); /* v155: ② คิดทีละขั้นบน p4stepBox */
  return { ...base, prompt: text, say: text.replace(/<[^>]+>/g, ''), __sig: 'g4x ' + text.replace(/<[^>]+>/g, '').slice(0, 60) + fig.length,
    mount(bd, ctx) { const tmp = h('div'); base.mount(tmp, ctx); const col = tmp.firstElementChild, sb = col.querySelector('.storybox'); if (sb) sb.remove(); // the question is already in the bubble
      bd.append(g4Side(h('div', { class: 'p4-fig', html: fig }), ...col.childNodes)); } }; };
const g4priceStory = () => { const items = pick([[['เสื้อยืด', 'กางเกง', 'หมวก'], ['ขนาดเล็ก', 'ขนาดใหญ่'], [[120, 180], [150, 220], [60, 90]]], [['ข้าวผัด', 'ก๋วยเตี๋ยว', 'ข้าวมันไก่'], ['ธรรมดา', 'พิเศษ'], [[40, 50], [35, 45], [40, 55]]], [['สมุด', 'ปากกา', 'ดินสอสี'], ['ร้าน ก', 'ร้าน ข'], [[25, 22], [12, 15], [45, 39]]]]);
  const [names, cols, P] = items, T = { title: 'ตารางราคาสินค้า', rowH: 'สินค้า', cols, unit: 'บาท', total: false, rows: names.map((n, i) => [n, P[i]]) }, i = rnd(0, 2), j = (i + rnd(1, 2)) % 3, c = rnd(0, 1), a = rnd(2, 4), b = rnd(1, 3);
  const fig = g4TwHTML(T), x = P[i][c], y = P[j][c];
  return pick([() => g4FigStory(fig, `ซื้อ${names[i]} (${cols[c]}) ${a} ชิ้น และ${names[j]} (${cols[c]}) ${b} ชิ้น ต้องจ่ายเงินกี่บาท`, `${a} × ${x} + ${b} × ${y}`, [`${a} × ${x} + ${y}`, `(${a} + ${b}) × ${x}`], 'บาท'),
    () => { const M = [100, 200, 300, 500, 1000].find(m => m > a * x); return g4FigStory(fig, `มีเงิน ${fmt(M)} บาท ซื้อ${names[i]} (${cols[c]}) ${a} ชิ้น จะเหลือเงินกี่บาท`, `${M} − ${a} × ${x}`, [`${M} − ${x}`, `${M} + ${a} × ${x}`], 'บาท'); }, // money always enough → never a negative answer that cannot be typed
    () => g4FigStory(fig, `${names[i]} ${cols[1]} แพงกว่าหรือถูกกว่า ${cols[0]} อยู่กี่บาท`, `${Math.max(P[i][0], P[i][1])} − ${Math.min(P[i][0], P[i][1])}`, [`${P[i][0]} + ${P[i][1]}`, `${Math.max(P[i][0], P[i][1])} × 2`], 'บาท')])(); };
const g4twStory = () => { let T, t; do { T = g4twRand(null, 3); t = g4Tot(T); } while (new Set(t.r).size < 3); // no two rows with the same total
  let [i, j] = pkF([0, 1, 2], 2); const c = rnd(0, T.cols.length - 1), fig = g4TwHTML({ ...T, total: false }), u = T.unit;
  if (t.r[i] < t.r[j]) [i, j] = [j, i]; // ask “the bigger one has more than the smaller one by …” — never the other way round (ผู้ใช้ขอ)
  return pick([() => g4FigStory(fig, `${T.rows[i][0]} มีทั้งหมดมากกว่า ${T.rows[j][0]} อยู่เท่าใด`, `${T.rows[i][1].join(' + ')} − (${T.rows[j][1].join(' + ')})`, [`${T.rows[i][1].join(' + ')} + ${T.rows[j][1].join(' + ')}`], u),
    () => g4FigStory(fig, `${T.cols[c]}ของ ${T.rows[i][0]} และ ${T.rows[j][0]} รวมกันเท่าใด`, `${T.rows[i][1][c]} + ${T.rows[j][1][c]}`, [`${T.rows[i][1][c]} − ${T.rows[j][1][c]}`.replace(/^(\d+) − (\d+)$/, (m, p, q) => +p >= +q ? m : `${q} − ${p}`)], u)])(); };
const G4_STEPS = ['เขียนชื่อแผนภูมิ', 'เขียนแกนตั้ง แกนนอน และชื่อแกน', 'กำหนดมาตราส่วน (1 ช่องแทนเท่าใด)', 'วาดแท่งให้สูงตามข้อมูล ความกว้างเท่ากัน ห่างเท่ากัน'];
const g4SeqQ = () => ({ ...Q.p4Seq({ text: 'เรียงขั้นตอน<b>การเขียนแผนภูมิแท่ง</b>', cards: G4_STEPS }), __sig: 'g4q steps' });
const G4_TF = [['ตาราง 2 ทาง จำแนกข้อมูลได้ 2 ลักษณะพร้อมกัน', 1], ['แถว “รวม” ล่างสุดเป็นผลรวมของแต่ละหลัก', 1], ['แผนภูมิแท่งต้องมีชื่อแผนภูมิ', 1], ['แท่งในแผนภูมิเดียวกันควรกว้างเท่ากัน', 1], ['ระยะห่างระหว่างแท่งต้องไม่เท่ากัน', 0], ['แผนภูมิแท่งวาดได้ทั้งแนวตั้งและแนวนอน', 1], ['แท่งที่ยาวกว่าแสดงจำนวนที่น้อยกว่า', 0], ['ตาราง 2 ทางไม่ต้องมีหัวตาราง', 0], ['มาตราส่วนบนแกนต้องเพิ่มขึ้นทีละเท่า ๆ กัน', 1], ['แผนภูมิแท่งไม่ต้องบอกหน่วย', 0]];
const g4TF = () => { const S = pkF(G4_TF, 4); return { ...Q.ixGroup({ q: 'ข้อความใด<b>ถูกต้อง</b> ข้อความใด<b>ไม่ถูกต้อง</b>', bins: ['✓ ถูกต้อง', '✗ ไม่ถูกต้อง'], items: S.map(([t, ok]) => ({ label: t, bin: ok ? 0 : 1 })), hint: 'นึกถึงส่วนประกอบของตารางและแผนภูมิ' }), __sig: 'g4o ' + S.map(x => x[0]).join() }; };

/* ---------- lessons ---------- */
const L4G = (no, place, title, short, goal, teach, game) => ({ id: 1500 + no, place, title, short, tone: TONES5[no % 6], goal, teach, game, learned: true });
const g4N = (k, f) => Array.from({ length: k }, f);
const G4_T_CLUB = { title: 'จำนวนสมาชิกชมรมของโรงเรียนบ้านทราย', rowH: 'ชมรม', cols: ['ชาย', 'หญิง'], unit: 'คน', rows: [['ดนตรี', [14, 18]], ['กีฬา', [22, 11]], ['ศิลปะ', [9, 16]]] };
const G4_T_SURV = g4survey('ผลสำรวจขนมที่ชอบของนักเรียน', 'ขนม', ['ขนมครก', 'ทองหยิบ', 'ลอดช่อง'], ['ชาย', 'หญิง'], 'คน', [[4, 2], [1, 5], [2, 1]]);
const G4_T_BAR = { kind: 'bar', title: 'จำนวนนักเรียนที่มาโรงเรียนด้วยวิธีต่าง ๆ', yName: 'จำนวน (คน)', xName: 'วิธี', cats: ['เดิน', 'จักรยาน', 'รถโรงเรียน', 'รถยนต์'], series: [{ name: '', v: [45, 30, 70, 55] }], min: 0, max: 80, step: 10, snap: 5, unit: 'คน' };
const G4_T_BARH = { ...G4_T_BAR, horiz: true, title: 'จำนวนนักเรียนที่มาโรงเรียนด้วยวิธีต่าง ๆ (แนวนอน)' };
const G4_T_BUILD = { kind: 'bar', title: 'จำนวนหนังสือที่ห้องสมุดได้รับบริจาค', yName: 'จำนวน (เล่ม)', xName: 'เดือน', cats: ['มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], series: [{ name: '', v: [60, 85, 40, 75] }], min: 0, max: 100, step: 10, snap: 5, unit: 'เล่ม' };
const g4chart = (C, st) => { const d = h('div'); d.append(dataChart(C, { st, sm: true })); return d.innerHTML; };
const LESSONS_P4C10 = [
  L4G(1, 'จุดสำรวจทะเลทราย', 'การเก็บรวบรวมข้อมูล และการนำเสนอข้อมูลโดยใช้ตาราง 2 ทาง', 'ตาราง 2 ทาง', 'เก็บรวบรวมข้อมูล และนำเสนอข้อมูลด้วยตาราง 2 ทาง',
    [...learnStep('ยินดีต้อนรับสู่ <b>ทะเลทรายข้อมูล</b>!', 'ยินดีต้อนรับสู่ทะเลทรายข้อมูล', [
      { fig: g4SheetHTML(G4_T_SURV), name: 'การเก็บรวบรวมข้อมูล', text: 'สำรวจ สอบถาม สังเกต หรือทดลอง แล้วจดคำตอบไว้' },
      { fig: `<div class="pc3-tab"><table><tr class="hd"><td>ขนม</td><td>รอยขีด</td></tr>${[['ขนมครก', 6], ['ทองหยิบ', 6], ['ลอดช่อง', 3]].map(([n, v]) => `<tr><td>${n}</td><td class="tl">${tallySVG(v, { scale: .9 })}</td></tr>`).join('')}</table></div>`, name: 'รอยขีด', text: 'นับคำตอบด้วยรอยขีด กลุ่มละ 5' }], 'เก็บข้อมูลแล้วจัดให้เป็นระเบียบ'),
     pexStep('ตัวอย่างทีละขั้น: นับผลสำรวจ', 'ตัวอย่างทีละขั้น นับผลสำรวจ', [['① ขีดฆ่าทีละคำตอบ', 'กันนับซ้ำ', g4SheetHTML(G4_T_SURV)], ['② นับรวม', 'ขนมครก 6 · ทองหยิบ 6 · ลอดช่อง 3', `<div class="pc3-tab"><table><tr class="hd"><td>ขนม</td><td>จำนวน (คน)</td></tr><tr><td>ขนมครก</td><td class="n">6</td></tr><tr><td>ทองหยิบ</td><td class="n">6</td></tr><tr><td>ลอดช่อง</td><td class="n">3</td></tr></table></div>`]], 'ได้<b>ตารางทางเดียว</b>'),
     learnStep('เรื่องใหม่: <b>ตาราง 2 ทาง</b>', 'เรื่องใหม่ ตาราง 2 ทาง', [
       { fig: g4TwHTML(G4_T_CLUB, { hl: ['r0', '0,0', '0,1'] }), name: 'แถวกับหลัก', text: 'จำแนกข้อมูลได้ 2 ลักษณะพร้อมกัน: แถว = ชมรม · หลัก = ชาย หญิง' },
       { fig: g4TwHTML(G4_T_CLUB, { hl: ['0,t', '1,t', '2,t', 't,0', 't,1', 't,t'] }), name: 'ช่องรวม', text: 'หลักขวาสุดคือรวมของแถว · แถวล่างสุดคือรวมของหลัก' }], 'ตาราง 2 ทาง = แถว × หลัก + ผลรวม'),
     pexStep('ตัวอย่างทีละขั้น: อ่านตาราง 2 ทาง', 'ตัวอย่างทีละขั้น อ่านตาราง 2 ทาง', [['① หาแถว “กีฬา”', 'อ่านจากหัวแถวทางซ้าย', g4TwHTML(G4_T_CLUB, { hl: ['r1'] })], ['② ไปที่หลัก “หญิง”', 'ช่องที่ตัดกัน', g4TwHTML(G4_T_CLUB, { hl: ['r1', '1,1'] })]], 'ชมรมกีฬามีนักเรียนหญิง <b>11 คน</b>'),
     T('ลองแตะคำตอบลงตาราง 2 ทาง', 'ลองแตะคำตอบลงตาราง 2 ทาง', el => el.append(simG4Survey(G4_T_SURV)))],
    () => [g4tallyQ(), g4fillQ(), ...g4N(2, () => g4twTapQ(g4twRand())), g4TwQ(g4twRand(), pick(['rowtot', 'coltot']))]),
  L4G(2, 'ตลาดตาราง', 'การใช้ข้อมูลจากตาราง 2 ทางในการหาคำตอบของโจทย์ปัญหา', 'โจทย์จากตาราง', 'ใช้ข้อมูลจากตาราง 2 ทางหาคำตอบของโจทย์ปัญหา',
    [...learnStep('<b>โจทย์จากตาราง 2 ทาง</b>', 'โจทย์จากตาราง 2 ทาง', [
      { fig: g4TwHTML(G4_T_CLUB, { hl: ['0,1', '2,1'] }), name: 'หาข้อมูลที่ต้องใช้', text: 'หญิงชมรมดนตรี 18 คน · หญิงชมรมศิลปะ 16 คน' },
      { fig: p4big('18 − 16 = 2'), name: 'เลือกวิธีคิด', text: 'มากกว่ากี่คน → ลบ' }], 'หาช่องที่ต้องใช้ → เลือกวิธีคิด → ตอบพร้อมหน่วย'),
     pexStep('ตัวอย่างทีละขั้น: ชมรมใดมีสมาชิกมากที่สุด', 'ตัวอย่างทีละขั้น', [['① ดูหลัก “รวม”', 'ดนตรี 32 · กีฬา 33 · ศิลปะ 25', g4TwHTML(G4_T_CLUB, { hl: ['0,t', '1,t', '2,t'] })], ['② เทียบ', '33 มากที่สุด', g4TwHTML(G4_T_CLUB, { hl: ['1,t'] })]], 'ชมรม<b>กีฬา</b>มีสมาชิกมากที่สุด 33 คน'),
     T('ลองแตะอ่านตาราง', 'ลองแตะอ่านตาราง', el => el.append(simG4Read(G4_T_CLUB))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.g4TwAsk({ T: G4_T_CLUB, q: 'นักเรียนชายทั้งหมดมีกี่คน', a: 45, hint: 'ดูช่องรวมของหลัก “ชาย”', sig: 'demo' }), 'ถูกต้อง!')))],
    () => [...g4N(2, () => g4TwQ(g4twRand())), g4twStory(), g4priceStory(), g4twTapQ(g4twRand())]),
  L4G(3, 'หอแท่งทราย', 'การอ่านแผนภูมิแท่ง', 'อ่านแผนภูมิแท่ง', 'อ่านข้อมูลจากแผนภูมิแท่งแนวตั้งและแนวนอน',
    [...learnStep('<b>แผนภูมิแท่ง</b>', 'แผนภูมิแท่ง', [
      { fig: g4chart(G4_T_BAR), name: 'ส่วนประกอบ', text: 'ชื่อแผนภูมิ · แกนตั้งบอกจำนวน · แกนนอนบอกรายการ · แท่งสูงเท่ากับข้อมูล' },
      { fig: g4chart(G4_T_BARH), name: 'แนวนอนก็ได้', text: 'แท่งยาวไปทางขวา อ่านค่าจากแกนนอน' }], 'แท่งยาวกว่า = จำนวนมากกว่า'),
     pexStep('ตัวอย่างทีละขั้น: อ่านค่าแท่ง “รถยนต์”', 'ตัวอย่างทีละขั้น', [['① หาแท่ง', 'แท่งที่ 4', g4chart({ ...G4_T_BAR, nolab: true }, { hl: ['3:0'] })], ['② ลากไปที่แกน', 'ปลายแท่งอยู่ครึ่งทางระหว่าง 50 กับ 60', g4chart({ ...G4_T_BAR, nolab: true }, { hl: ['3:0'], guide: [[3, 0]] })]], 'รถยนต์ <b>55 คน</b>'),
     T('ลองแตะแท่งอ่านค่า', 'ลองแตะแท่งอ่านค่า', el => el.append(simReadBar(G4_T_BAR)))],
    () => [...g4N(2, () => g4Read(g4barRand(null, { nolab: true }))), Q.g4TapBar({ C: g4barRand(null, { nolab: true }), want: pick(['max', 'min']) }), (() => { const C = g4barRand(null, { nolab: false, horiz: Math.random() < .5 }); const v = C.series[0].v, mx = v.indexOf(Math.max(...v)); return { ...Q.gPick({ chart: C, q: `ข้อใด<b>มากที่สุด</b>`, opts: C.cats.slice(0, 4).concat(C.cats.length > 4 && mx >= 4 ? [C.cats[mx]] : []).filter((x, k, A) => A.indexOf(x) === k).slice(-4), right: g4cat(C, mx), hint: 'แท่งที่ยาวที่สุด' }), __sig: `g4p ${C.title} ${v}` }; })(), Q.g4Rank({ C: g4barRand(null, { n: 4 }), dir: pick(['asc', 'desc']) })]),
  L4G(4, 'ลานโจทย์แผนภูมิ', 'การใช้ข้อมูลจากแผนภูมิแท่งในการหาคำตอบของโจทย์ปัญหา', 'โจทย์จากแผนภูมิ', 'ใช้ข้อมูลจากแผนภูมิแท่งหาคำตอบของโจทย์ปัญหา',
    [...learnStep('<b>โจทย์จากแผนภูมิแท่ง</b>', 'โจทย์จากแผนภูมิแท่ง', [
      { fig: g4chart(G4_T_BAR, { hl: ['2:0', '1:0'] }), name: 'อ่านค่าที่ต้องใช้', text: 'รถโรงเรียน 70 · จักรยาน 30' },
      { fig: p4big('70 − 30 = 40'), name: 'คำนวณ', text: 'มากกว่ากันเท่าใด → ลบ' }], 'อ่านค่า → เลือกวิธีคิด → ตอบพร้อมหน่วย'),
     T('ตัวอย่างทีละขั้น: รวมทั้งหมด', 'ตัวอย่างทีละขั้น รวมทั้งหมด', el => el.append(gWalk(G4_T_BAR, [['① อ่านทุกแท่ง', '45 · 30 · 70 · 55', { hl: ['0:0', '1:0', '2:0', '3:0'] }], ['② บวก', '45 + 30 + 70 + 55 = 200', null]], 'มาโรงเรียนทั้งหมด <b>200 คน</b>'))),
     T('แท่งที่หายไป', 'แท่งที่หายไป', el => el.append(qSim(Q.g4Hidden({ C: G4_T_BUILD, i: 2 }), 'ถูกต้อง!')))],
    () => [...g4N(3, () => g4BarQ(g4barRand(null, { horiz: Math.random() < .3 }))), (() => { const C = g4barRand(); return Q.g4Hidden({ C, i: rnd(0, C.cats.length - 1) }); })(), Q.g4TapBar((() => { const C = g4barRand(null, { nolab: true }); return { C, want: pick(C.series[0].v) }; })())]),
  L4G(5, 'โรงวาดแผนภูมิ', 'การเขียนแผนภูมิแท่ง', 'เขียนแผนภูมิแท่ง', 'เขียนแผนภูมิแท่งจากข้อมูลในตาราง เลือกมาตราส่วนที่เหมาะสม',
    [...learnStep('<b>เขียนแผนภูมิแท่ง</b>', 'เขียนแผนภูมิแท่ง', [
      { fig: gTable(G4_T_BUILD, { sm: true }).outerHTML, name: '① ดูข้อมูล', text: 'ค่ามากที่สุด 85 เล่ม' },
      { fig: p4big('ช่องละ 10 เล่ม'), name: '② เลือกมาตราส่วน', text: 'ให้ค่ามากที่สุดอยู่บนแกนได้ภายในไม่กี่ช่อง' },
      { fig: g4chart(G4_T_BUILD), name: '③ วาดแท่ง', text: 'ใส่ชื่อแผนภูมิ ชื่อแกน แท่งกว้างเท่ากัน ห่างเท่ากัน' }], 'ชื่อ → แกน → มาตราส่วน → แท่ง'),
     pexStep('ตัวอย่างทีละขั้น: เขียนแท่งของ ก.ค. (85 เล่ม)', 'ตัวอย่างทีละขั้น', [['① หาตำแหน่ง', '85 อยู่ครึ่งทางระหว่าง 80 กับ 90', g4chart({ ...G4_T_BUILD, series: [{ name: '', v: [60, null, null, null] }] })], ['② วาดแท่ง', 'สูงถึง 85', g4chart({ ...G4_T_BUILD, series: [{ name: '', v: [60, 85, null, null] }] }, { hl: ['1:0'] })]], 'วาดต่อจนครบทุกเดือน'),
     T('ลองลากแท่งให้ตรงตาราง', 'ลองลากแท่งให้ตรงตาราง', el => el.append(simBuild(G4_T_BUILD, [['ชื่อแผนภูมิ', G4_T_BUILD.title], ['มาตราส่วน', 'ช่องละ 10 เล่ม']])))],
    () => [...g4N(2, () => { const C = g4barRand(null, { n: 4 }); return { ...Q.gBuild({ chart: C }), __sig: `g4u ${C.title} ${C.series[0].v}` }; }), Q.g4Scale({ C: g4barRand(null, { n: 4 }) }), (() => { const C = g4barRand(null, { n: 4, full: true }), i = rnd(0, 3), v = C.series[0].v[i]; return Q.g4Spot({ C, i, wrong: v + (v + C.step <= C.max ? C.step : -C.step) }); })(), g4SeqQ()])
];
/* ---------- boss ---------- */
const g4X = (q, opts, lv, fig) => ({ q, fig, opts, a: 0, lv });
const G4_B_TW = { title: 'จำนวนสมาชิกชมรมต่าง ๆ', rowH: 'ชมรม', cols: ['ชาย', 'หญิง'], unit: 'คน', rows: [['ถ่ายภาพ', [26, 45]], ['ศิลปะ', [44, 35]], ['ดนตรี', [51, 23]], ['วาดภาพ', [13, 14]]] };
const G4_B_BAR = { kind: 'bar', title: 'จำนวนผลไม้ในร้านค้า', yName: 'จำนวน (ลูก)', xName: 'ผลไม้', cats: ['มะเฟือง', 'มังคุด', 'ส้มโอ', 'แตงโม', 'มะม่วง'], series: [{ name: '', v: [250, 950, 600, 750, 500] }], min: 0, max: 1000, step: 100, unit: 'ลูก', nolab: true };
const g4bf = C => { const d = h('div'); d.append(dataChart(C, { sm: true })); return d.innerHTML; };
const EXAM_P4C10 = d6spread([
  g4X('ข้อใดเป็นวิธีเก็บรวบรวมข้อมูล', ['สำรวจและสอบถาม', 'วาดแท่งให้สูงเท่ากัน', 'ลบตัวเลขในตาราง'], 1501),
  g4X('ชมรมศิลปะมีนักเรียนหญิงกี่คน', ['35 คน', '44 คน', '79 คน', '45 คน'], 1501, g4TwHTML(G4_B_TW)),
  g4X('นักเรียนชายทั้งหมดมีกี่คน', ['134 คน', '117 คน', '251 คน', '124 คน'], 1501, g4TwHTML(G4_B_TW)),
  g4X('ช่อง “รวม” ล่างสุดของตาราง 2 ทางคืออะไร', ['ผลรวมของแต่ละหลัก', 'ผลรวมของแต่ละแถว', 'ค่าที่มากที่สุด'], 1501),
  g4X('ชมรมใดมีสมาชิกมากที่สุด', ['ศิลปะ', 'ถ่ายภาพ', 'ดนตรี', 'วาดภาพ'], 1502, g4TwHTML(G4_B_TW)),
  g4X('ชมรมถ่ายภาพมีนักเรียนหญิงมากกว่านักเรียนชายกี่คน', ['19 คน', '71 คน', '9 คน', '21 คน'], 1502, g4TwHTML(G4_B_TW)),
  g4X('ชมรมวาดภาพมีสมาชิกน้อยกว่าชมรมดนตรีกี่คน', ['47 คน', '27 คน', '74 คน', '37 คน'], 1502, g4TwHTML(G4_B_TW)),
  g4X('สมาชิกชมรมถ่ายภาพและชมรมศิลปะรวมกันกี่คน', ['150 คน', '140 คน', '79 คน', '160 คน'], 1502, g4TwHTML(G4_B_TW)),
  g4X('ร้านค้ามีมังคุดกี่ลูก', ['950 ลูก', '900 ลูก', '1,000 ลูก', '850 ลูก'], 1503, g4bf(G4_B_BAR)),
  g4X('ผลไม้ใดมีจำนวนน้อยที่สุด', ['มะเฟือง', 'มะม่วง', 'ส้มโอ', 'แตงโม'], 1503, g4bf(G4_B_BAR)),
  g4X('ข้อใดเรียงจากมากไปน้อยได้ถูกต้อง', ['มังคุด แตงโม ส้มโอ', 'แตงโม มังคุด ส้มโอ', 'ส้มโอ แตงโม มังคุด'], 1503, g4bf(G4_B_BAR)),
  g4X('แผนภูมิแท่งแนวนอน อ่านค่าจากแกนใด', ['แกนนอน', 'แกนตั้ง', 'ชื่อแผนภูมิ'], 1503),
  g4X('มังคุดมากกว่าส้มโอกี่ลูก', ['350 ลูก', '250 ลูก', '1,550 ลูก', '300 ลูก'], 1504, g4bf(G4_B_BAR)),
  g4X('ร้านค้ามีผลไม้ทั้งหมดกี่ลูก', ['3,050 ลูก', '2,950 ลูก', '3,150 ลูก', '2,050 ลูก'], 1504, g4bf(G4_B_BAR)),
  g4X('ถ้าขายมะม่วงลูกละ 5 บาท จะได้เงินกี่บาท', ['2,500 บาท', '505 บาท', '1,000 บาท', '250 บาท'], 1504, g4bf(G4_B_BAR)),
  g4X('ผลไม้ที่มีจำนวนมากกว่า 600 ลูก มีกี่ชนิด', ['2 ชนิด', '3 ชนิด', '1 ชนิด', '4 ชนิด'], 1504, g4bf(G4_B_BAR)),
  g4X('ข้อมูลมีค่ามากที่สุด 85 ควรให้ 1 ช่องแทนเท่าใด', ['10', '1', '100'], 1505),
  g4X('ข้อใด<b>ไม่ใช่</b>ส่วนประกอบของแผนภูมิแท่ง', ['รอยขีด', 'ชื่อแผนภูมิ', 'ชื่อแกน', 'มาตราส่วน'], 1505),
  g4X('แท่งในแผนภูมิแท่งเดียวกันควรเป็นอย่างไร', ['กว้างเท่ากันและห่างเท่ากัน', 'กว้างไม่เท่ากัน', 'ยาวเท่ากันทุกแท่ง'], 1505),
  g4X('ขั้นตอนแรกของการเขียนแผนภูมิแท่งคือข้อใด', ['เขียนชื่อแผนภูมิ', 'วาดแท่ง', 'อ่านค่าแท่งที่สูงที่สุด'], 1505)]);
LESSONS_P4C10.push({ id: 1509, boss: true, place: 'รังแมงป่องข้อมูล', title: 'ด่านบอส: บทที่ 10 การนำเสนอข้อมูล', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'คำถามท้ายบท 20 ข้อ (เก็บข้อมูล · ตาราง 2 ทาง · อ่านแผนภูมิแท่ง · โจทย์ปัญหา · เขียนแผนภูมิแท่ง) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P4C10, pass: 10, bossName: 'แมงป่องข้อมูล', bossPal: 'sky', emblem: '▥', bossKind: 'scorp',
  winLine: 'ชนะแมงป่องข้อมูลแล้ว! อ่านตารางและแผนภูมิเก่งมาก', loseLine: 'แมงป่องข้อมูลยังไม่ยอมแพ้ กลับไปฝึกอ่านแผนภูมิแล้วสู้ใหม่นะ!' });
