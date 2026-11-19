/* =========================================================
   GRADE 2 · CHAPTER 11 — แผนภูมิรูปภาพ  (ชายหาด · ภาคเรียนที่ 2 · เมือง 44 · ด่าน 1041–1043 · บอส 1059)
   1 picture = 2 / 5 / 10 units (half picture = half the key) · skip-count by tapping a row ·
   change the key and watch the chart redraw · build a pictograph from a table · tap the biggest row
   ========================================================= */
const ppI = e => `<svg viewBox="0 0 64 64" aria-hidden="true">${ART[e] || SCENERY[e] || ART.star}</svg>`;
/* D = { title, what, unit, k, orient 'h'|'v', keyE, rows: [[label, value, art]] } */
const ppN = (v, k) => [Math.floor(v / k), v % k ? 1 : 0];
function ppHTML(D, o = {}) {
  const v = D.orient === 'v', k = o.k || D.k, mx = Math.max(...D.rows.map(r => ppN(r[1], k).reduce((a, b) => a + b, 0)));
  const rows = D.rows.map(([lab, val, e], i) => { const [n, hf] = ppN(val, k), ic = e || D.keyE;
    return `<div class="pp-row" data-i="${i}"><div class="pp-lab">${lab}</div><div class="pp-cells" style="--mx:${mx}">${range(1, n).map(j => `<span class="pp-i" data-j="${j}">${ppI(ic)}</span>`).join('')}${hf ? `<span class="pp-i half" data-j="${n + 1}">${ppI(ic)}</span>` : ''}</div></div>`; }).join('');
  const key = `<div class="pp-key">กำหนดให้ ${D.keyE ? `<span class="pp-i k">${ppI(D.keyE)}</span>` : '1 รูป'} แทนจำนวน${D.what} ${k} ${D.unit}${k % 2 === 0 && D.rows.some(r => r[1] % k) ? ` · ครึ่งรูปแทน ${k / 2} ${D.unit}` : ''}</div>`;
  return `<div class="pp ${v ? 'v' : 'h'}"><div class="pp-title">${D.title}</div><div class="pp-grid" style="--n:${D.rows.length}">${rows}</div>${key}</div>`;
}
/* tap a row: count by k (teach shows the running count, game only marks the pictures) */
function ppTapCount(el, D, o = {}) {
  el.classList.add('ia'); const out = o.out;
  el.querySelectorAll('.pp-row').forEach(r => r.addEventListener('click', e => { e.stopPropagation(); const i = +r.dataset.i, [lab, val] = D.rows[i]; let c = 0, seq = [];
    el.querySelectorAll('.pp-row').forEach(x => x.classList.toggle('on', x === r)); el.querySelectorAll('.pp-i b').forEach(b => b.remove());
    r.querySelectorAll('.pp-i').forEach((ic, j) => { c += ic.classList.contains('half') ? D.k / 2 : D.k; seq.push(c); if (o.nums) { const v = c; setTimeout(() => { ic.insertAdjacentHTML('beforeend', `<b>${v}</b>`); sfx.pop(j + 1); }, j * 140); } });
    if (out) { out.innerHTML = `${lab}: นับเพิ่มทีละ ${D.k} → ${seq.join(', ')} · <b>${val} ${D.unit}</b>`; say(`${lab} ${val} ${D.unit}`, true); }
    o.onTap && o.onTap(i); }));
}
/* teaching: same data, different key */
function simPpKey(D, keys) {
  let k = D.k; const box = h('div', { class: 'colstack' }), fig = h('div', { class: 'ppwrap' }), out = fNote(), seen = new Set();
  const draw = () => { fig.innerHTML = ppHTML(D, { k }); ppTapCount(fig.firstChild, { ...D, k }, { nums: true, out }); seen.add(k);
    const icons = D.rows.reduce((a, r) => a + ppN(r[1], k).reduce((x, y) => x + y, 0), 0); out.innerHTML = `ถ้า 1 รูปแทน <b>${k}</b> ${D.unit} ต้องใช้รูปทั้งหมด <b>${icons}</b> รูป — แตะแถวเพื่อนับเพิ่มทีละ ${k}`; if (seen.size >= 2) teachDone(box); };
  box.append(h6wait(), h('div', { class: 'rowstack ia' }, h('span', { class: 'cap' }, '1 รูปแทน'), ...keys.map(x => h('button', { class: 'btn sm ia pp-kb', onclick: e => { e.stopPropagation(); k = x; sfx.tap(); box.querySelectorAll('.pp-kb').forEach(b => b.classList.toggle('on', b.textContent === String(x))); draw(); } }, String(x)))), fig, out);
  draw(); [...box.querySelectorAll('.pp-kb')].forEach(b => b.classList.toggle('on', b.textContent === String(k))); return box;
}
/* builder: tap a slot to cycle  empty → picture → half picture (when the key is even) → empty */
function ppBuilder(D) {
  const slots = Math.max(...D.rows.map(r => Math.ceil(r[1] / D.k))) + 1, canHalf = D.k % 2 === 0, st = D.rows.map(() => Array(slots).fill(0));
  const wrap = h('div', { class: 'pp h build ia' }, h('div', { class: 'pp-title' }, D.title));
  const grid = h('div', { class: 'pp-grid' }); wrap.append(grid, h('div', { class: 'pp-key', html: `กำหนดให้ <span class="pp-i k">${ppI(D.keyE)}</span> แทนจำนวน${D.what} ${D.k} ${D.unit}${canHalf ? ` · แตะซ้ำเป็นครึ่งรูป (แทน ${D.k / 2})` : ''}` }));
  const val = i => st[i].reduce((a, s) => a + (s === 1 ? D.k : s === 2 ? D.k / 2 : 0), 0);
  const draw = () => { grid.innerHTML = ''; D.rows.forEach(([lab, v, e], i) => { const cells = h('div', { class: 'pp-cells' });
    st[i].forEach((s, j) => { const c = h('button', { class: 'pp-slot' + (s ? ' f' : '') + (s === 2 ? ' half' : ''), html: s ? ppI(e || D.keyE) : '' }); c.onclick = ev => { ev.stopPropagation(); if (wrap.dataset.done) return; st[i][j] = (s + 1) % (canHalf ? 3 : 2); sfx.tap(); draw(); }; cells.append(c); });
    grid.append(h('div', { class: 'pp-row' }, h('div', { class: 'pp-lab' }, lab, h('small', null, `${v} ${D.unit}`)), cells, h('b', { class: 'pp-sum' + (val(i) === v ? ' ok' : '') }, val(i)))); }); };
  draw(); wrap.check = () => D.rows.every((r, i) => val(i) === r[1]); wrap.lock = () => wrap.dataset.done = 1; return wrap;
}
Object.assign(Q, {
  ppRead({ D, i, q }) {
    const [lab, val] = D.rows[i]; q = q || `${lab}มี${D.what}กี่${D.unit}`;
    return { prompt: q + ' <small>(แตะรูปทำเครื่องหมายขณะนับได้)</small>', say: q, mount(bd, ctx) { const f = h('div', { class: 'ppwrap', html: ppHTML(D) }); ppMark(f);
      bd.append(h('div', { class: 't6-q p4-q p2q' }, f, h('div', { class: 'rowstack' }, answerBox(ctx, String(val), { hint: `1 รูปแทน ${D.k} ${D.unit} — นับเพิ่มทีละ ${D.k}${val % D.k ? ` ครึ่งรูปแทน ${D.k / 2}` : ''}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, D.unit)))); } };
  },
  ppNum({ D, q, a, hint, unit }) {
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { const f = h('div', { class: 'ppwrap', html: ppHTML(D) }); ppMark(f);
      bd.append(h('div', { class: 't6-q p4-q p2q' }, f, h('div', { class: 'rowstack' }, answerBox(ctx, String(a), { hint }), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit ?? D.unit)))); } };
  },
  /* tap the row (most / least) right in the chart */
  ppTap({ D, ask }) {
    const vals = D.rows.map(r => r[1]), t = ask === 'max' ? Math.max(...vals) : Math.min(...vals), q = `แตะแถวที่มีจำนวน<span class="hl">${ask === 'max' ? 'มากที่สุด' : 'น้อยที่สุด'}</span>ในแผนภูมิ`;
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { const f = h('div', { class: 'ppwrap', html: ppHTML(D) });
      ixTapFig(f.firstChild, '.pp-row', ctx, i => D.rows[i][1] === t, ask === 'max' ? 'ดูว่าแถวไหนมีรูปมากที่สุด (ครึ่งรูปนับครึ่งเดียว)' : 'ดูว่าแถวไหนมีรูปน้อยที่สุด');
      bd.append(h('div', { class: 'colstack' }, f, h('div', { class: 'cap ixcap' }, 'แตะที่แถวในแผนภูมิได้เลย'))); } };
  },
  ppBuild({ D }) {
    const q = `สร้างแผนภูมิรูปภาพจากข้อมูล โดย 1 รูปแทน ${D.k} ${D.unit}`;
    return { prompt: q + ' <small>(แตะช่องเพื่อวางรูป)</small>', say: q, mount(bd, ctx) { const B = ppBuilder(D);
      bd.append(h('div', { class: 'colstack' }, B, checkButton('ตรวจคำตอบ', () => { const ok = B.check(); if (ok) B.lock(); ctx.check(ok, `แต่ละแถว จำนวนรูป × ${D.k} ต้องเท่ากับข้อมูล${D.k % 2 === 0 ? ` (ครึ่งรูป = ${D.k / 2})` : ''}`); }))); } };
  }
});
function ppMark(f) { f.classList.add('ia'); f.querySelectorAll('.pp-i:not(.k)').forEach(ic => ic.addEventListener('click', e => { e.stopPropagation(); ic.classList.toggle('mk'); sfx.tap(); })); }
const ppSort = (D, dir) => Q.ixSort({ q: `เรียงจาก<span class="hl">${dir === 'desc' ? 'มากที่สุดไปน้อยที่สุด' : 'น้อยที่สุดไปมากที่สุด'}</span>`, fig: ppHTML(D), items: D.rows.map(r => ({ label: r[0], v: r[1] })), dir, slotLabels: D.rows.map((_, i) => i ? '' : dir === 'desc' ? 'มากที่สุด' : 'น้อยที่สุด') });
const ppKeyQ = D => Q.p4Pick({ fig: ppHTML(D), q: `จากแผนภูมิ 1 รูปแทนจำนวน${D.what}กี่${D.unit}`, opts: [D.k, ...[1, 2, 5, 10].filter(x => x !== D.k).slice(0, 2)].map(x => `${x} ${D.unit}`), right: `${D.k} ${D.unit}`, hint: 'ดูบรรทัด “กำหนดให้” ใต้แผนภูมิ' });
const ppPick = (D, q, right, opts, hint) => Q.p4Pick({ fig: ppHTML(D), q, opts: [right, ...opts.filter(o => o !== right)].slice(0, 4), right, hint });

/* ---------- data: teaching (not used in the games) ---------- */
const PPT_2 = { title: 'จำนวนเปลือกหอยที่เด็ก ๆ เก็บได้', what: 'เปลือกหอย', unit: 'ชิ้น', k: 2, keyE: 'shell', rows: [['ต้นกล้า', 8], ['ใบเตย', 12], ['ภูผา', 6], ['ฟ้าใส', 10]] };
const PPT_5 = { title: 'จำนวนลูกโป่งที่ขายได้', what: 'ลูกโป่ง', unit: 'ลูก', k: 5, keyE: 'balloon', rows: [['วันเสาร์', 25], ['วันอาทิตย์', 40], ['วันจันทร์', 15]] };
const PPT_10 = { title: 'จำนวนผู้เข้าชมการแสดงโลมา', what: 'ผู้เข้าชม', unit: 'คน', k: 10, keyE: 'kid4', rows: [['รอบเช้า', 70], ['รอบบ่าย', 45], ['รอบเย็น', 25]] };
const PPT_B = { title: 'จำนวนปูที่จับได้', what: 'ปู', unit: 'ตัว', k: 2, keyE: 'crab', rows: [['เรือแดง', 6], ['เรือเขียว', 10], ['เรือฟ้า', 4]] };
/* ---------- data: practice — charts redrawn, own data ---------- */
const PPW1 = { title: 'จำนวนสัตว์ที่นักท่องเที่ยวพบ', what: 'สัตว์', unit: 'ตัว', k: 2, keyE: 'fish', rows: [['ปลา', 12, 'fish'], ['เต่า', 8, 'turtle'], ['นก', 14, 'chick']] }; // (ภาพสัตว์วาดใหม่)
const PPW2 = { title: 'จำนวนไอศกรีมที่ขายได้ใน 5 วัน', what: 'ไอศกรีม', unit: 'โคน', k: 2, keyE: 'icecream', rows: [['วันจันทร์', 6], ['วันอังคาร', 14], ['วันพุธ', 8], ['วันพฤหัสบดี', 10], ['วันศุกร์', 12]] };
const PPW3 = { title: 'จำนวนข้าวโพดที่ชาวสวนเก็บได้ใน 1 วัน', what: 'ข้าวโพด', unit: 'กิโลกรัม', k: 2, keyE: 'corn', rows: [['ออย', 12], ['แพรว', 8], ['แตงโม', 16], ['แพม', 14], ['แน่น', 6]] };
const PPW4 = { title: 'จำนวนสัตว์ชนิดต่าง ๆ ในฟาร์มสุขใจ', what: 'สัตว์', unit: 'ตัว', k: 5, orient: 'v', rows: [['สุนัข', 20, 'dog'], ['แมว', 5, 'cat'], ['นก', 10, 'chick'], ['ปลา', 15, 'fish'], ['กระต่าย', 20, 'rabbit']] };
const PPW5 = { title: 'จำนวนเหรียญรางวัลกีฬาโอลิมปิก', what: 'เหรียญ', unit: 'เหรียญ', k: 5, keyE: 'medal', orient: 'v', rows: [['ยกน้ำหนัก', 15], ['เทควันโด', 20], ['ว่ายน้ำ', 10], ['มวยสากล', 30], ['วิ่ง', 15]] };
const PPW6 = { title: 'จำนวนรถที่จอด ณ ลานจอดรถในวันเสาร์', what: 'รถ', unit: 'คัน', k: 5, keyE: 'car', rows: [['รถเก๋ง', 35], ['รถจักรยานยนต์', 40], ['รถตู้', 10], ['รถกระบะ', 25]] };
const PPW7 = { title: 'จำนวนผลไม้ที่ขายได้ใน 1 วัน', what: 'ผลไม้', unit: 'กิโลกรัม', k: 10, rows: [['มังคุด', 60, 'mangosteen'], ['ส้ม', 70, 'orange'], ['ฝรั่ง', 90, 'guava'], ['มะม่วง', 40, 'mango']] };
const PPW8 = { title: 'จำนวนปลาในบ่อเลี้ยงปลาที่เกษตรกรจับได้', what: 'ปลา', unit: 'ตัว', k: 10, keyE: 'fish', rows: [['ปลาทับทิม', 110], ['ปลาดุก', 80], ['ปลานิล', 110], ['ปลาสวาย', 120]] };
const PPW9 = { title: 'จำนวนนักเรียนที่ชอบกิจกรรมต่าง ๆ', what: 'นักเรียน', unit: 'คน', k: 10, keyE: 'kid1', rows: [['วาดภาพระบายสี', 80], ['เล่นเกม', 75], ['อ่านการ์ตูน', 50], ['ฟังเพลง', 35], ['เล่นกีฬา', 65]] };
const PPW10 = { title: 'จำนวนนักท่องเที่ยวที่มาเที่ยวอุทยานแห่งชาติ', what: 'นักท่องเที่ยว', unit: 'คน', k: 10, keyE: 'kid2', orient: 'v', rows: [['น้ำตก', 60], ['จุดชมวิว', 40], ['น้ำพุร้อน', 50], ['ถ้ำ', 30]] };
const ppMix = D => ({ ...D, rows: reshuffle(D.rows) });

/* ---------- lessons ---------- */
const L2C = (no, place, title, short, goal, teach, game) => ({ id: 1040 + no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game });
const LESSONS_P2C11 = [
  L2C(1, 'หาดแทนสอง', 'แผนภูมิรูปภาพที่กำหนดรูป 1 รูปแทน 2 หน่วย', '1 รูปแทน 2', 'อ่านและเขียนแผนภูมิรูปภาพที่กำหนดรูป 1 รูปแทน 2 หน่วย',
    [T('ยินดีต้อนรับสู่ <b>ชายหาดแผนภูมิ</b>! ที่นี่ <b>1 รูปแทน 2 ชิ้น</b> — แตะแถวเพื่อนับเพิ่มทีละ 2', 'ยินดีต้อนรับสู่ชายหาดแผนภูมิ ที่นี่หนึ่งรูปแทนสองชิ้น แตะแถวเพื่อนับเพิ่มทีละสอง', el => { const out = fNote(), f = h('div', { class: 'ppwrap', html: ppHTML(PPT_2) }); ppTapCount(f.firstChild, PPT_2, { nums: true, out }); out.innerHTML = 'แตะชื่อหรือแถวของแต่ละคน'; el.append(h('div', { class: 'colstack' }, f, out)); }),
     T('ลองสร้างเอง: ปูที่จับได้ — แตะช่องวางรูป (1 รูปแทน 2 ตัว)', 'ลองสร้างเอง แตะช่องวางรูป หนึ่งรูปแทนสองตัว', el => el.append(qSim(Q.ppBuild({ D: PPT_B }), 'ตัวเลขด้านขวาเท่ากับข้อมูลทุกแถวแล้ว'))),
     T('ตัวอย่างทีละขั้น: อ่านแผนภูมิ', 'ตัวอย่างทีละขั้น', p4ex([['① ดูกำหนดให้', '1 รูปแทนเปลือกหอย 2 ชิ้น'], ['② นับรูปของใบเตย', '6 รูป'], ['③ นับเพิ่มทีละ 2', '2, 4, 6, 8, 10, 12 → 12 ชิ้น'], ['④ เปรียบเทียบ', 'ใบเตย 12 − ภูผา 6 = 6 ชิ้น']], 'ใบเตยเก็บได้มากกว่าภูผา <b>6 ชิ้น</b>', '', () => h('div', { class: 'ppwrap', html: ppHTML(PPT_2) })))],
    () => { const A = ppMix(PPW2), B = ppMix(PPW3), i = rnd(0, 4);
      return [Q.ppBuild({ D: { ...PPW1, rows: reshuffle(PPW1.rows) } }), Q.ppRead({ D: A, i }), Q.ppTap({ D: B, ask: pick(['max', 'min']) }),
        Q.ppNum({ D: PPW2, q: 'ขายไอศกรีมในวันพุธน้อยกว่าวันศุกร์อยู่กี่โคน', a: 4, hint: 'วันศุกร์ 12 โคน วันพุธ 8 โคน → 12 − 8' }),
        Q.ppNum({ D: PPW3, q: 'ออยเก็บข้าวโพดได้น้อยกว่าแพมกี่กิโลกรัม', a: 2, hint: 'แพม 14 ออย 12 → 14 − 12' }), ppSort(A, 'desc')]; }),
  L2C(2, 'หาดแทนห้า', 'แผนภูมิรูปภาพที่กำหนดรูป 1 รูปแทน 5 หน่วย', '1 รูปแทน 5', 'อ่านและเขียนแผนภูมิรูปภาพที่กำหนดรูป 1 รูปแทน 5 หน่วย และแก้โจทย์จากแผนภูมิ',
    [T('ข้อมูลเดียวกัน แต่เปลี่ยน <b>1 รูปแทน 5 ลูก</b> เป็น <b>10 ลูก</b> — ดูจำนวนรูปที่ใช้ แล้วแตะแถวนับ', 'ข้อมูลเดียวกัน แต่เปลี่ยนรูปหนึ่งรูปแทนกี่ลูก แตะปุ่มดูจำนวนรูปที่ใช้ แล้วแตะแถวนับ', el => el.append(simPpKey(PPT_5, [5, 10]))),
     T('ตัวอย่างทีละขั้น: 1 รูปแทน 5', 'ตัวอย่างทีละขั้น', p4ex([['① ดูกำหนดให้', '1 รูปแทนลูกโป่ง 5 ลูก'], ['② วันอาทิตย์มี', '8 รูป → 5, 10, 15, … , 40 → 40 ลูก'], ['③ วันจันทร์มี', '3 รูป → 15 ลูก'], ['④ รวม 3 วัน', '25 + 40 + 15 = 80 ลูก']], 'ขายลูกโป่งได้ทั้งหมด <b>80 ลูก</b>', '', () => h('div', { class: 'ppwrap', html: ppHTML(PPT_5) })))],
    () => { const A = ppMix(PPW4), B = ppMix(PPW5), C = ppMix(PPW6);
      return [ppKeyQ(A), Q.ppRead({ D: B, i: B.rows.findIndex(r => r[0] === 'ว่ายน้ำ'), q: 'ประเทศไทยได้รับเหรียญจากกีฬาว่ายน้ำกี่เหรียญ' }),
        Q.ppNum({ D: PPW4, q: 'ฟาร์มสุขใจเลี้ยงสัตว์รวมทั้งหมดกี่ตัว', a: 70, hint: '20 + 5 + 10 + 15 + 20' }), Q.ppTap({ D: C, ask: 'max' }),
        ppPick(PPW6, 'รถตู้มีจำนวนน้อยกว่ารถประเภทใดอยู่ 15 คัน', 'รถกระบะ', ['รถเก๋ง', 'รถจักรยานยนต์'], 'รถตู้ 10 คัน + 15 = 25 คัน'),
        Q.ppNum({ D: PPW5, q: 'จำนวนเหรียญรางวัลจากกีฬายกน้ำหนักน้อยกว่ากีฬาเทควันโดกี่เหรียญ', a: 5, hint: 'เทควันโด 20 ยกน้ำหนัก 15' }),
        Q.ppNum({ D: PPW6, q: 'ลานจอดรถมีรถเก๋งและรถตู้รวมกันกี่คัน', a: 45, hint: '35 + 10' }), Q.ppNum({ D: PPW5, q: 'กีฬามวยสากลได้เหรียญรางวัลมากกว่ากีฬาว่ายน้ำกี่เหรียญ', a: 20, hint: 'มวยสากล 30 ว่ายน้ำ 10' }), /* v134: ≥ 8 ข้อ */
        Q.ppTap({ D: B, ask: 'min' }), ppSort(ppMix(PPW4), 'desc')]; }),
  L2C(3, 'หาดแทนสิบ', 'แผนภูมิรูปภาพที่กำหนดรูป 1 รูปแทน 10 หน่วย', '1 รูปแทน 10', 'อ่านและเขียนแผนภูมิรูปภาพที่กำหนดรูป 1 รูปแทน 10 หน่วย (ครึ่งรูปแทน 5 หน่วย) และแก้โจทย์จากแผนภูมิ',
    [T('<b>1 รูปแทน 10 คน</b> — มี<b>ครึ่งรูป</b>ด้วย! แตะแถวนับเพิ่มทีละ 10 ครึ่งรูปบวก 5', 'หนึ่งรูปแทนสิบคน มีครึ่งรูปด้วย แตะแถวนับเพิ่มทีละสิบ ครึ่งรูปบวกห้า', el => { const out = fNote(), f = h('div', { class: 'ppwrap', html: ppHTML(PPT_10) }); ppTapCount(f.firstChild, PPT_10, { nums: true, out }); out.innerHTML = 'แตะแต่ละรอบ'; el.append(h('div', { class: 'colstack' }, f, out)); }),
     T('ลองสร้างเอง: แตะช่องซ้ำเพื่อทำ<b>ครึ่งรูป</b>', 'ลองสร้างเอง แตะช่องซ้ำเพื่อทำครึ่งรูป', el => el.append(qSim(Q.ppBuild({ D: { ...PPT_10, title: 'จำนวนผู้เข้าชมการแสดงโลมา (สร้างเอง)', rows: [['รอบเช้า', 30], ['รอบบ่าย', 55], ['รอบเย็น', 15]] } }), 'ครึ่งรูปแทน 5 คน'))),
     T('ตัวอย่างทีละขั้น: ครึ่งรูป', 'ตัวอย่างทีละขั้น', p4ex([['① ดูกำหนดให้', '1 รูปแทน 10 คน → ครึ่งรูปแทน 5 คน'], ['② รอบบ่าย', '4 รูปเต็ม กับครึ่งรูป'], ['③ นับ', '10, 20, 30, 40 แล้ว + 5 = 45 คน'], ['④ เปรียบเทียบ', 'รอบเช้า 70 − รอบบ่าย 45 = 25 คน']], 'รอบเช้ามากกว่ารอบบ่าย <b>25 คน</b>', '', () => h('div', { class: 'ppwrap', html: ppHTML(PPT_10) })))],
    () => { const A = ppMix(PPW7), B = ppMix(PPW8), C = ppMix(PPW9);
      return [Q.ppRead({ D: A, i: A.rows.findIndex(r => r[0] === 'ส้ม'), q: 'ขายส้มได้ทั้งหมดกี่กิโลกรัม' }), Q.ppRead({ D: C, i: C.rows.findIndex(r => r[0] === 'ฟังเพลง'), q: 'นักเรียนที่ชอบฟังเพลงมีกี่คน' }),
        Q.ppNum({ D: PPW8, q: 'ปลาดุกมีจำนวนน้อยกว่าปลานิลอยู่กี่ตัว', a: 30, hint: 'ปลานิล 110 ปลาดุก 80' }), Q.ppTap({ D: B, ask: 'max' }),
        Q.ppNum({ D: PPW9, q: 'ถ้ามีนักเรียนอีก 20 คนเลือกอ่านการ์ตูน ต้องวาดรูปเพิ่มอีกกี่รูป', a: 2, unit: 'รูป', hint: '1 รูปแทน 10 คน → 20 คน ใช้ 2 รูป' }),
        Q.ppNum({ D: PPW10, q: 'ถ้าเก็บค่าเข้าชมน้ำตกคนละ 7 บาท อุทยานจะได้เงินรวมกี่บาท', a: 420, unit: 'บาท', hint: 'น้ำตก 60 คน × 7 บาท' }), ppSort(ppMix(PPW10), 'asc'),
        Q.ppNum({ D: PPW7, q: 'ขายมังคุดและมะม่วงได้รวมกันกี่กิโลกรัม', a: 100, hint: '60 + 40' }), Q.ppTap({ D: C, ask: 'min' })]; } /* v134: ≥ 8 ข้อ */)
];

/* ---------- boss: built from our own practice items (no official test supplied) — d6spread ---------- */
const ppX = (D, q, right, wrong) => ({ q, fig: ppHTML(D), opts: [right, ...wrong].map(String), a: 0 });
const EXAM_P2C11 = d6spread([
  ppX(PPW2, 'วันใดขายไอศกรีมได้มากที่สุด', 'วันอังคาร', ['วันศุกร์', 'วันพฤหัสบดี', 'วันจันทร์']),
  ppX(PPW2, 'วันจันทร์ขายไอศกรีมได้กี่โคน', '6 โคน', ['3 โคน', '8 โคน', '12 โคน']),
  ppX(PPW3, 'แตงโมเก็บข้าวโพดได้กี่กิโลกรัม', '16 กิโลกรัม', ['8 กิโลกรัม', '14 กิโลกรัม', '18 กิโลกรัม']),
  ppX(PPW3, 'ชาวสวนคนใดเก็บข้าวโพดได้น้อยที่สุด', 'แน่น', ['แพรว', 'ออย', 'แพม']),
  ppX(PPW3, 'ถ้าพรุ่งนี้แพมเก็บข้าวโพดได้เพิ่มจากวันนี้ 4 กิโลกรัม พรุ่งนี้จะได้ข้าวโพดกี่กิโลกรัม', '18 กิโลกรัม', ['10 กิโลกรัม', '16 กิโลกรัม', '22 กิโลกรัม']),
  ppX(PPW4, 'จากแผนภูมิ 1 รูปแทนสัตว์กี่ตัว', '5 ตัว', ['1 ตัว', '2 ตัว', '10 ตัว']),
  ppX(PPW4, 'ฟาร์มสุขใจเลี้ยงกระต่ายมากกว่านกอยู่กี่ตัว', '10 ตัว', ['2 ตัว', '5 ตัว', '30 ตัว']),
  ppX(PPW4, 'สัตว์ชนิดใดที่ฟาร์มสุขใจเลี้ยงจำนวนเท่ากัน', 'สุนัขกับกระต่าย', ['นกกับปลา', 'แมวกับนก', 'สุนัขกับปลา']),
  ppX(PPW5, 'กีฬาที่ได้รับเหรียญรางวัลมากที่สุดคือกีฬาใด', 'มวยสากล', ['เทควันโด', 'วิ่ง', 'ยกน้ำหนัก']),
  ppX(PPW5, 'จำนวนเหรียญรางวัลทั้งหมดจาก 5 ประเภทกีฬาเท่ากับกี่เหรียญ', '90 เหรียญ', ['18 เหรียญ', '80 เหรียญ', '95 เหรียญ']),
  ppX(PPW6, 'รถเก๋งมีจำนวนทั้งหมดกี่คัน', '35 คัน', ['7 คัน', '30 คัน', '40 คัน']),
  ppX(PPW6, 'จำนวนรถทุกประเภทรวมกันกี่คัน', '110 คัน', ['22 คัน', '100 คัน', '115 คัน']),
  ppX(PPW7, 'ขายผลไม้ชนิดใดได้ทั้งหมด 60 กิโลกรัม', 'มังคุด', ['ส้ม', 'ฝรั่ง', 'มะม่วง']),
  ppX(PPW7, 'ผลไม้ทั้งหมดที่ขายได้รวมกันมีน้ำหนักกี่กิโลกรัม', '260 กิโลกรัม', ['26 กิโลกรัม', '250 กิโลกรัม', '270 กิโลกรัม']),
  ppX(PPW8, 'ปลาชนิดใดมีจำนวนเท่ากัน', 'ปลาทับทิมกับปลานิล', ['ปลาดุกกับปลาสวาย', 'ปลานิลกับปลาสวาย', 'ปลาทับทิมกับปลาดุก']),
  ppX(PPW8, 'ปลาสวายมีจำนวนมากกว่าปลาทับทิมอยู่กี่ตัว', '10 ตัว', ['1 ตัว', '20 ตัว', '40 ตัว']),
  ppX(PPW9, 'นักเรียนที่ชอบเล่นเกมมีกี่คน', '75 คน', ['70 คน', '80 คน', '7 คน']),
  ppX(PPW9, 'นักเรียนชอบกิจกรรมใดรวมกันได้ 100 คน', 'เล่นกีฬาและฟังเพลง', ['เล่นเกมและอ่านการ์ตูน', 'วาดภาพระบายสีและฟังเพลง', 'อ่านการ์ตูนและเล่นกีฬา']),
  ppX(PPW10, 'จุดชมวิวมีนักท่องเที่ยวน้อยกว่าน้ำพุร้อนกี่คน', '10 คน', ['1 คน', '20 คน', '90 คน']),
  ppX(PPW10, 'สถานที่ใดบ้างมีนักท่องเที่ยวน้อยกว่า 45 คน', 'จุดชมวิวและถ้ำ', ['ถ้ำและน้ำพุร้อน', 'น้ำตกและจุดชมวิว', 'น้ำพุร้อนและน้ำตก'])]);
LESSONS_P2C11.push({ id: 1059, boss: true, place: 'อ่าวแผนภูมิ', title: 'ด่านบอส: บทที่ 11 แผนภูมิรูปภาพ', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'คำถามท้ายบท 20 ข้อ (อ่านแผนภูมิรูปภาพที่ 1 รูปแทน 2, 5 และ 10 หน่วย) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P2C11, pass: 10, bossName: 'ปีศาจปลาหมึกแผนภูมิ', bossPal: 'sky', emblem: '▦', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกแผนภูมิแล้ว! อ่านแผนภูมิได้คล่องมาก', loseLine: 'ปีศาจปลาหมึกยังนับรูปเร็วกว่า สู้ใหม่นะ!' });
