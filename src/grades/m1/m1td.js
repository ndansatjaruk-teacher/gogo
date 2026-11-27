/* =========================================================
   ม.1 บทที่ 9 สถิติ (1) — หน้าสอน (v277 · ผู้ใช้ขอ "จัดเรียงให้เหมือนที่ทำมา") · prefix t9d
   ดูภาพ (กระดานครูขึ้นทีละขั้น) → ลงมือเอง (แตะแยกการ์ด ขีดรอยขีด วางรูปภาพ ลากแท่ง แตะส่วนของวงกลม สลับแกน) → ทำให้ดู (ดินสอ) → ลองทำ (ข้อจากเกม — e1dTry)
   ========================================================= */
const t9dB = (title, beats, fin, o = {}) => d1dBoard(title, { W: o.W || 400, H: o.H || 240, beats, fin });
const t9dTry = (id, sigs, title) => e1dTry(id, sigs, title);
const t9dCard = t => `<span class="t9card">${t}</span>`;
const t9dDash = (x1, y1, x2, y2, col = T9C.p) => `<path d="M${a4n(x1)} ${a4n(y1)} L${a4n(x2)} ${a4n(y2)}" stroke="${col}" stroke-width="2" stroke-dasharray="5 4"/>`;

/* ① tally: tap each piece of data, its tally mark appears; at the end the table shows the counts */
function t9dTally(cats, data) {
  return T('<b>ลงมือเอง</b> — ขีดรอยขีดทีละข้อมูล', 'ลงมือเอง ขีดรอยขีดทีละข้อมูล', el => { const n = cats.map(() => 0), fig = h('div', { class: 't9tal' }), out = h('div', { class: 's5tip', html: 'แตะข้อมูลทีละตัว (เรียงจากซ้ายไปขวา) — รอยขีดจะขึ้นในแถวของมัน' });
    const draw = () => { fig.innerHTML = t9Svg(cats.map((c, i) => t9T(84, 30 + i * 36, c, T9C.ink, 't9l', 'end') + t9Tally(n[i], 104, 25 + i * 36) + t9T(330, 30 + i * 36, n[i] ? n[i] : '', T9C.v, 't9l')).join(''), 360, cats.length * 36 + 10); };
    const chips = h('div', { class: 't9chips ia' }, ...data.map(d => h('button', { class: 'btn sm t9chip', onclick: e => { e.stopPropagation(); const b = e.currentTarget; if (b.disabled) return; b.disabled = true; b.classList.add('done'); n[cats.indexOf(d)]++; sfx.tap(); draw();
      if (n.reduce((a, b2) => a + b2, 0) === data.length) { out.innerHTML = `ครบ ${data.length} ข้อมูล! ` + cats.map((c, i) => `${c} <b>${n[i]}</b>`).join(' · ').replace(/ · /g, ', '); sfx.ok(); teachDone(el); } } }, d)));
    el.append(h('div', { class: 'colstack s5pg' }, out, chips, fig, h6wait())); draw(); }); }

/* ② pictograph: tap a row to add a picture, tap the last picture to make it half / remove it */
function t9dPicto(cats, vals, key, icon, unit) {
  return T('<b>ลงมือเอง</b> — วาดแผนภูมิรูปภาพ', 'ลงมือเอง วาดแผนภูมิรูปภาพ', el => { const half = cats.map(() => 0), host = h('div', { class: 't9pic ia' }), msg = h('div', { class: 's5tip', html: `แตะในแถวเพื่อเพิ่มรูป · แตะรูปสุดท้ายเพื่อเปลี่ยนเป็น<b>ครึ่งรูป</b> หรือเอาออก · รูป 1 รูปแทน ${key} ${unit}` }); let done = false;
    const ok = () => half.every((u, i) => u * key / 2 === vals[i]);
    const draw = () => { const W = 380, rh = 40; let s = ''; cats.forEach((c, i) => { const y = 10 + i * rh, n = half[i] / 2; s += `<rect x="0" y="${y}" width="${W}" height="${rh - 4}" rx="10" fill="${half[i] * key / 2 === vals[i] ? '#E4F7EC' : '#F7F5FC'}" data-row="${i}"/>` + t9T(78, y + 23, `${c} (${vals[i]})`, T9C.ink, 't9l', 'end');
        for (let j = 0; j < Math.ceil(n - 1e-9); j++) s += `<g data-ico="${i}" data-j="${j}">${t9Icon(104 + j * 28, y + 18, icon, Math.min(1, n - j))}<rect x="${90 + j * 28}" y="${y + 2}" width="28" height="32" fill="transparent"/></g>`; });
      host.innerHTML = t9Svg(s + t9Icon(110, cats.length * rh + 26, icon) + t9T(128, cats.length * rh + 31, `แทน ${key} ${unit}`, T9C.ink, 't9l', 'start'), W, cats.length * rh + 44, 't9svg'); };
    host.addEventListener('click', e => { e.stopPropagation(); if (done) return; const g = e.target.closest('[data-ico]'), r = e.target.closest('[data-row]');
      if (g) { const i = +g.dataset.ico, j = +g.dataset.j; if (j === Math.ceil(half[i] / 2 - 1e-9) - 1) half[i] -= 1; else return; } else if (r) { const i = +r.dataset.row; if (half[i] % 2) half[i] += 1; else half[i] += 2; if (half[i] > 20) half[i] = 20; } else return;
      sfx.tap(); draw(); if (ok()) { done = true; msg.innerHTML = '<b>ถูกต้องทุกแถว!</b> จำนวนรูป × ' + key + ' = ข้อมูล'; sfx.ok(); teachDone(el); } });
    el.append(h('div', { class: 'colstack s5pg' }, msg, host, h6wait())); draw(); }); }

/* ③ bar chart: drag each bar to the value in the table */
function t9dBars(cats, vals, step) {
  return T('<b>ลงมือเอง</b> — ลากแท่งให้ตรงกับตาราง', 'ลงมือเอง ลากแท่งให้ตรงกับตาราง', el => { const cur = cats.map(() => step), max = Math.max(...vals) + step * 2, W = 380, H = 250, msg = h('div', { class: 's5tip', html: 'ลากยอดแท่งขึ้นหรือลง ให้สูงเท่ากับจำนวนในตาราง' }); let done = false, drag = -1;
    const A = t9Axes(cats, max, { w: W - 70, h: H - 74, step, yt: 'จำนวน' }), host = h('div', { class: 's5v ia t9bars' });
    const draw = () => { host.innerHTML = t9Svg(A.s + cats.map((c, i) => { const bw = A.bw * .56, x0 = A.X(i) - bw / 2, ok = cur[i] === vals[i]; return `<rect x="${a4n(x0)}" y="${a4n(A.Y(cur[i]))}" width="${a4n(bw)}" height="${a4n(A.Y(0) - A.Y(cur[i]))}" rx="3" fill="${ok ? '#58C98F' : T9C.s[0]}" stroke="${T9C.ink}" stroke-width="1.4"/><rect x="${a4n(x0 - 8)}" y="${a4n(A.Y(cur[i]) - 14)}" width="${a4n(bw + 16)}" height="28" rx="8" fill="${ok ? '#2FAF7C' : '#7C5CE0'}" opacity=".85" data-bar="${i}" class="t9grip"/>` + t9T(A.X(i), A.Y(cur[i]) + 5, cur[i], '#fff', 't9n'); }).join(''), W, H, 't9svg'); };
    const yOf = e => { const svg = host.querySelector('svg'), m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()).y; };
    host.addEventListener('pointerdown', e => { const g = e.target.closest('[data-bar]'); if (!g || done) return; drag = +g.dataset.bar; try { host.setPointerCapture(e.pointerId); } catch (_) { } e.preventDefault(); });
    host.addEventListener('pointermove', e => { if (drag < 0) return; const v = Math.max(0, Math.min(A.top, Math.round((A.y + A.h - yOf(e)) / A.h * A.top / step) * step)); if (v !== cur[drag]) { cur[drag] = v; sfx.tap(); draw(); } });
    host.addEventListener('pointerup', () => { if (drag < 0) return; drag = -1; if (!done && cur.every((v, i) => v === vals[i])) { done = true; msg.innerHTML = '<b>แผนภูมิแท่งตรงกับตารางแล้ว!</b> ความสูงของแท่ง = จำนวน'; sfx.ok(); teachDone(el); } });
    el.append(h('div', { class: 'colstack s5pg' }, msg, h('div', { class: 's5two' }, h('div', { html: t9Tab(['', 'จำนวน'], cats.map((c, i) => [c, vals[i]])) }), host), h6wait())); draw(); }); }

/* ④ pie: tap each part to see percent → how many out of the total */
function t9dPie(items, total, unit) {
  return T('<b>ลงมือเอง</b> — แตะแต่ละส่วนของวงกลม', 'ลงมือเอง แตะแต่ละส่วนของวงกลม', el => { const seen = new Set(), host = h('div', { class: 't9pie ia' }), out = h('div', { class: 's5vpic', html: `ทั้งวงกลม = <b>100%</b> = ${total} ${unit}<br>แตะแต่ละส่วน` });
    const draw = () => { host.innerHTML = t9Svg(t9Pie(items.map((it, i) => ({ ...it, c: seen.has(i) ? T9C.s[i] : '#E6E0F3' })), 150, 120, 100), 300, 240, 't9svg'); host.querySelectorAll('path, circle').forEach((p, i) => { p.dataset.part = i; p.style.cursor = 'pointer'; }); };
    host.addEventListener('click', e => { e.stopPropagation(); const p = e.target.closest('[data-part]'); if (!p) return; const i = +p.dataset.part, it = items[i]; seen.add(i); sfx.tap(); draw();
      out.innerHTML = `<b>${it.t}</b> ${it.v}%<br>= ${it.v} ÷ 100 × ${total} = <b>${t9N(it.v * total / 100)} ${unit}</b><br><small>มุม ${t9N(it.v * 36 / 10)}°</small>`; if (seen.size === items.length) { sfx.ok(); teachDone(el); } });
    el.append(h('div', { class: 'colstack s5pg' }, h('div', { class: 's5tip', html: 'แตะส่วนของวงกลมให้ครบทุกส่วน ดูว่าร้อยละแปลงเป็นจำนวนจริงได้อย่างไร' }), h('div', { class: 's5two' }, host, out), h6wait())); draw(); }); }

/* ⑤ the same data, axis from 0 or from 90 */
function t9dAxis(a, b) {
  return T('<b>ลงมือเอง</b> — แกนตั้งหลอกตา', 'ลงมือเอง แกนตั้งหลอกตา', el => { const seen = new Set(), host = h('div', { class: 't9fixed' }), out = h('div', { class: 's5tip' });
    const draw = lo => { const A = t9Axes(['ร้าน ก', 'ร้าน ข'], b - lo, { w: 250, h: 160, step: lo ? 1 : 20, lo }); host.innerHTML = t9Svg(A.s + t9Bars(A, [a - lo, b - lo], [T9C.s[0], T9C.s[1]], { val: false }).join(''), 330, 220, 't9svg');
      out.innerHTML = lo ? `แกนเริ่มที่ <b>${lo}</b>: ร้าน ข ดูมากกว่าหลายเท่า แต่จริง ๆ ต่างกันแค่ <b>${b - a}</b> ชิ้น` : `แกนเริ่มที่ <b>0</b>: สองแท่งสูงใกล้กัน (${a} กับ ${b})`; seen.add(lo); if (seen.size === 2) teachDone(el); };
    el.append(h('div', { class: 'colstack s5pg' }, h('div', { class: 's5tip', html: 'ข้อมูลชุดเดียวกัน ยอดขาย ร้าน ก ' + a + ' ชิ้น ร้าน ข ' + b + ' ชิ้น — แตะปุ่มเพื่อเปลี่ยนจุดเริ่มของแกนตั้ง' }), s5dChips(['แกนเริ่มที่ 0', 'แกนเริ่มที่ 90'], i => draw(i ? 90 : 0)), host, out, h6wait())); draw(0); }); }

const T9D_TEACH = {
  2901: L => [
    t9dB('ข้อมูลสองแบบ', [[t9T(100, 40, 'เชิงปริมาณ', T9C.b, 't9big') + t9T(300, 40, 'เชิงคุณภาพ', T9C.p, 't9big'), 'ข้อมูล = ข้อเท็จจริงของเรื่องที่สนใจ แบ่งเป็น 2 แบบ'], [t9T(100, 90, 'ส่วนสูง 152 ซม.') + t9T(100, 125, 'คะแนนสอบ 18') + t9T(100, 160, 'พี่น้อง 2 คน'), '<b>เชิงปริมาณ</b>: เป็นตัวเลข นำมาบวก ลบ เทียบมากน้อยได้'],
      [t9T(300, 90, 'สีที่ชอบ: ฟ้า') + t9T(300, 125, 'กรุ๊ปเลือด: A') + t9T(300, 160, 'กีฬาที่ชอบ: แบด'), '<b>เชิงคุณภาพ</b>: บอกลักษณะหรือประเภท'], [t9T(200, 212, 'เลขที่บ้าน 49 → คุณภาพ (ตัวเลขเป็นแค่ชื่อเรียก)', T9C.v), 'ระวัง: ตัวเลขบางอย่างเป็นแค่ชื่อเรียก เช่น เบอร์โทร เลขที่บ้าน']], 'วัดหรือนับได้ = เชิงปริมาณ · บอกลักษณะ = เชิงคุณภาพ'.replace(' · ', ', ')),
    s5dTapSet('แตะข้อมูลเชิงปริมาณ', 'แตะข้อมูลเชิงปริมาณ', shuffle([{ svg: t9dCard('น้ำหนัก 42 กก.'), ok: 1, why: 'วัดหรือนับได้เป็นจำนวน' }, { svg: t9dCard('อายุ 13 ปี'), ok: 1 }, { svg: t9dCard('เวลานอน 8 ชั่วโมง'), ok: 1 }, { svg: t9dCard('สีกระเป๋า: แดง') }, { svg: t9dCard('เบอร์โทร 08x-xxx') }, { svg: t9dCard('ผลไม้ที่ชอบ: ส้ม') }]), 'แตะทุกการ์ดที่เป็น<b>ข้อมูลเชิงปริมาณ</b> (แตะซ้ำ = เอาออก)'),
    t9dTry(2901, ['kind', 'kind2', 'pickqn'], 'ข้อมูลสองแบบ')],
  2902: L => [
    t9dB('คำถามทางสถิติ', [[t9T(200, 40, '"ภูผาสูงกี่เซนติเมตร"', T9C.ink, 't9big'), 'คำถามนี้มีคำตอบ<b>เดียว</b>'], [t9T(200, 74, '→ 158 ซม. (คำตอบเดียว) ✗', T9C.p), 'ไม่ต้องเก็บข้อมูลจากหลายคน = <b>ไม่ใช่</b>คำถามทางสถิติ'], [t9T(200, 130, '"นักเรียนห้องนี้สูงคนละกี่เซนติเมตร"', T9C.ink, 't9big'), 'เปลี่ยนเป็นถามกลุ่มคน'], [t9T(200, 166, '→ 148, 152, 155, 160, 163, … ✓', T9C.g), 'คำตอบ<b>หลากหลาย</b> ต้องเก็บข้อมูล = คำถามทางสถิติ'], [t9T(200, 214, 'บอกให้ชัด: ศึกษาอะไร · กับใคร'.replace(' · ', ' และ '), T9C.v), 'คำถามที่ดีบอกเรื่องที่ศึกษาและกลุ่มที่จะถาม']], 'คำถามทางสถิติ = คาดได้ว่าคำตอบหลากหลาย'),
    s5dTapSet('แตะคำถามทางสถิติ', 'แตะคำถามทางสถิติ', shuffle([{ svg: t9dCard('เพื่อนในห้องชอบผลไม้อะไร'), ok: 1, why: 'คำตอบหลากหลาย ต้องถามหลายคน' }, { svg: t9dCard('ครอบครัวในซอยนี้มีรถกี่คัน'), ok: 1 }, { svg: t9dCard('นักเรียน ม.1 ตื่นนอนกี่โมง'), ok: 1 }, { svg: t9dCard('1 ปีมีกี่เดือน') }, { svg: t9dCard('น้ำใสเกิดเดือนอะไร') }, { svg: t9dCard('กรุงเทพฯ อยู่ภาคไหน') }]), 'แตะทุกการ์ดที่เป็น<b>คำถามทางสถิติ</b>'),
    t9dTry(2902, ['isq', 'notq', 'pick'], 'คำถามทางสถิติ')],
  2903: L => [
    t9dB('วิธีเก็บรวบรวมข้อมูล', [[t9T(110, 40, '① สำรวจ (แบบสอบถาม)', T9C.b, 't9l', 'start'), 'ถามคนจำนวนมากพร้อมกัน'], [t9T(110, 76, '② สัมภาษณ์ (ถาม–ตอบ)', T9C.b, 't9l', 'start'), 'คุยถามทีละคน ได้รายละเอียด'], [t9T(110, 112, '③ สังเกต (ดู นับ จด)', T9C.b, 't9l', 'start'), 'เฝ้าดูแล้วบันทึก เช่น นับรถ'], [t9T(110, 148, '④ ทดลอง (จัดสถานการณ์)', T9C.b, 't9l', 'start'), 'ทำการทดลองแล้ววัดผล'], [t9T(110, 184, '⑤ จากทะเบียน/รายงาน', T9C.b, 't9l', 'start'), 'ข้อมูลที่บันทึกไว้แล้ว'],
      [t9T(200, 222, 'เก็บเอง = ปฐมภูมิ · คนอื่นเก็บไว้ = ทุติยภูมิ'.replace(' · ', '   '), T9C.p), '<b>ปฐมภูมิ</b> เก็บเองโดยตรง · <b>ทุติยภูมิ</b> นำมาจากที่อื่น'.replace(' · ', ' ')]], 'เลือกวิธีเก็บข้อมูลให้เหมาะกับคำถาม'),
    t9dTry(2903, ['how', 'prim', 'fert'], 'เก็บข้อมูล')],
  2904: L => [
    t9dB('รอยขีดและตาราง', [[t9T(200, 34, 'ส้ม มะม่วง ส้ม กล้วย ส้ม มะม่วง ส้ม ส้ม กล้วย ส้ม', T9C.ink, 't9n'), 'ข้อมูลผลไม้ที่ชอบ 10 คน'], [t9T(80, 84, 'ส้ม', T9C.ink, 't9l', 'end') + t9Tally(6, 100, 79), 'ส้ม: ขีดทีละเส้น ครบ 4 เส้น เส้นที่ 5 ขีด<b>ทับ</b> → นับเป็น 5'], [t9T(80, 124, 'มะม่วง', T9C.ink, 't9l', 'end') + t9Tally(2, 100, 119) + t9T(80, 164, 'กล้วย', T9C.ink, 't9l', 'end') + t9Tally(2, 100, 159), 'มะม่วง 2 กล้วย 2'],
      [t9T(300, 84, '6', T9C.v, 't9big') + t9T(300, 124, '2', T9C.v, 't9big') + t9T(300, 164, '2', T9C.v, 't9big') + t9T(300, 210, 'รวม 10', T9C.g, 't9big'), 'นับรอยขีดเป็นตัวเลข = <b>ตารางความถี่</b> รวมได้ 10 ครบ']], 'รอยขีด: กลุ่มละ 5 นับเร็ว · รวมความถี่ต้องเท่ากับจำนวนข้อมูลทั้งหมด'.replace(' · ', ' ')),
    t9dTally(['มะม่วง', 'ส้ม', 'กล้วย', 'แตงโม'], ['ส้ม', 'มะม่วง', 'กล้วย', 'ส้ม', 'แตงโม', 'มะม่วง', 'ส้ม', 'ส้ม', 'กล้วย', 'มะม่วง', 'ส้ม', 'แตงโม', 'ส้ม', 'มะม่วง', 'กล้วย', 'ส้ม']),
    t9dTry(2904, ['tal', 'read', 'tot'], 'รอยขีดและตาราง')],
  2905: L => [
    t9dB('อ่านแผนภูมิรูปภาพ', [[t9Icon(146, 176, 'egg') + t9T(162, 181, 'แทน 2 ฟอง ', T9C.ink, 't9l', 'start'), 'ดู<b>คำอธิบาย</b>ก่อน: รูป 1 รูปแทน 2 ฟอง'], [t9Picto(['จ.', 'อ.', 'พ.'], [8, 6, 7], 2, 'egg', { unit: 'ฟอง', x: 60, y: 20, rh: 46 }), 'นับรูปในแต่ละแถว'], [t9T(330, 48, '4 × 2 = 8', T9C.b, 't9l') + t9T(330, 94, '3 × 2 = 6', T9C.b, 't9l'), 'จ. 4 รูป = 8 ฟอง · อ. 3 รูป = 6 ฟอง'.replace(' · ', ', ')], [t9T(330, 140, '3½ × 2 = 7', T9C.p, 't9l'), 'พ. 3 รูปครึ่ง: ครึ่งรูป = 1 ฟอง → <b>7 ฟอง</b>']], 'จำนวน = จำนวนรูป × ค่าที่รูป 1 รูปแทน'),
    t9dPicto(['จ.', 'อ.', 'พ.', 'พฤ.'], [6, 9, 4, 7], 2, 'book', 'เล่ม'),
    t9dTry(2905, ['key', 'read', 'max'], 'แผนภูมิรูปภาพ')],
  2906: L => { const A = t9Axes(['แมว', 'สุนัข', 'ปลา', 'นก'], 16, { x: 60, y: 22, w: 300, h: 168, step: 4, yt: 'จำนวนคน' }), v = [10, 14, 6, 8];
    return [
      t9dB('แผนภูมิแท่ง', [[A.s, 'แกนนอน = ประเภท · แกนตั้ง = จำนวน (ช่องละ 4)'.replace(' · ', ', ')], ...v.map((x, i) => [t9Bars(A, v, T9C.s[0])[i], i ? `${['แมว', 'สุนัข', 'ปลา', 'นก'][i]} ${x} คน` : 'แท่งแรก: แมว 10 คน (ครึ่งช่องระหว่าง 8 กับ 12)']), [t9dDash(A.X(1), A.Y(14), A.x, A.Y(14)) + t9T(A.X(1), A.Y(14) - 8, 'สูงสุด 14', T9C.p, 't9l'), 'ยอดแท่งตรงกับเลขบนแกนตั้ง = จำนวน']], 'ความสูงของแท่ง = จำนวน · แท่งกว้างเท่ากันเสมอ'.replace(' · ', ', ')),
      t9dBars(['ส้ม', 'องุ่น', 'มังคุด', 'ลำไย'], [12, 6, 16, 8], 2),
      t9dTry(2906, ['read', 'max', 'diff'], 'แผนภูมิแท่ง')]; },
  2907: L => { const A = t9Axes(['ม.1', 'ม.2', 'ม.3'], 50, { x: 60, y: 34, w: 300, h: 160, step: 10, yt: 'คน' });
    return [
      t9dB('แผนภูมิแท่งเปรียบเทียบ', [[A.s + t9Legend(A.x + 120, A.y - 18, ['ชาย', 'หญิง']), 'ดู<b>คำอธิบายสี</b>ก่อน: ฟ้า = ชาย ส้ม = หญิง'], [t9Bars(A, [30, 40, 25], T9C.s[0], { k: .34, dx: -A.bw * .18 }).join(''), 'แท่งสีฟ้า: ชาย 30, 40, 25'], [t9Bars(A, [35, 30, 45], T9C.s[1], { k: .34, dx: A.bw * .18 }).join(''), 'แท่งสีส้ม: หญิง 35, 30, 45'], [t9T(A.X(2), 24, 'ต่างกัน 20', T9C.p, 't9l'), 'เทียบคู่ในชั้นเดียวกัน: ม.3 หญิงมากกว่าชาย 20 คน']], 'แท่งเปรียบเทียบ: ข้อมูล 2 ชุดเรียงคู่กันในแต่ละหัวข้อ'),
      t9dTry(2907, ['g', 'b', 'sum'], 'แท่งเปรียบเทียบ')]; },
  2908: L => { const cats = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.'], v = [10, 15, 25, 20, 30], A = t9Axes(cats, 30, { x: 60, y: 20, w: 300, h: 170, step: 5, yt: 'ขวด' });
    return [
      t9dB('กราฟเส้น', [[A.s, 'ขายน้ำได้กี่ขวดในแต่ละวัน'], [v.map((x, i) => `<circle cx="${a4n(A.X(i))}" cy="${a4n(A.Y(x))}" r="5" fill="${T9C.b}"/>`).join(''), 'จุดแต่ละจุด = ค่าของวันนั้น'], [`<polyline points="${v.map((x, i) => a4n(A.X(i)) + ',' + a4n(A.Y(x))).join(' ')}" fill="none" stroke="${T9C.b}" stroke-width="2.6"/>`, 'ลากเส้นต่อจุด เห็น<b>การขึ้นลง</b>ตามเวลา'], [`<path d="M${a4n(A.X(1))} ${a4n(A.Y(15))} L${a4n(A.X(2))} ${a4n(A.Y(25))}" stroke="${T9C.p}" stroke-width="5"/>` + t9T(A.X(1) + 10, A.Y(22) - 4, '+10', T9C.p, 't9l'), 'เส้นชันขึ้นมากที่สุด: อ. → พ. เพิ่ม 10 ขวด'], [`<path d="M${a4n(A.X(2))} ${a4n(A.Y(25))} L${a4n(A.X(3))} ${a4n(A.Y(20))}" stroke="${T9C.o}" stroke-width="5"/>`, 'เส้นลง: พ. → พฤ. ลดลง 5 ขวด']], 'กราฟเส้นเหมาะกับข้อมูลที่เปลี่ยนไปตามเวลา'),
      t9dTry(2908, ['read', 'max', 'up'], 'กราฟเส้น')]; },
  2909: L => { const it = [{ t: 'อาหาร', v: 50 }, { t: 'เดินทาง', v: 25 }, { t: 'ออม', v: 15 }, { t: 'อื่น ๆ', v: 10 }];
    return [
      t9dB('แผนภูมิวงกลม', [[`<circle cx="130" cy="120" r="96" fill="#E6E0F3" stroke="#fff" stroke-width="2"/>` + t9T(130, 126, '100%', T9C.v, 't9big'), 'ทั้งวงกลม = ทั้งหมด = <b>100%</b> = 360°'], [t9Pie(it, 130, 120, 96, { noLab: true }), 'แบ่งเป็นส่วนตามร้อยละ'], [t9T(300, 60, 'อาหาร 50% = ครึ่งวง', T9C.s[0], 't9l') + t9T(300, 96, 'เดินทาง 25% = 90°', T9C.s[1], 't9l'), '50% = ครึ่งวง · 25% = หนึ่งในสี่ = 90°'.replace(' · ', ', ')], [t9T(300, 150, '1% = 3.6°', T9C.p, 't9big') + t9T(300, 186, 'ออม 15% = 54°', T9C.s[2], 't9l'), 'มุม = ร้อยละ × 3.6°']], 'ส่วนของวงกลม = ร้อยละของทั้งหมด'),
      r4dShow('รายได้ 8,000 บาท ใช้ค่าอาหาร 35%', e1dEq([{ e: '35% ของ 8,000' }, { e: '= {35|100} × 8,000', w: 'ร้อยละ = ส่วนในร้อย', n: '' }, { e: '= 35 × 80', w: '8,000 ÷ 100 = 80', n: '' }, { e: '= *2,800 บาท', w: 'ค่าอาหาร', n: '', ans: 1 }], { q: 'รายได้ 8,000 บาท แผนภูมิวงกลมบอกว่าค่าอาหาร 35% เป็นเงินกี่บาท', fin: 'จำนวน = ร้อยละ ÷ 100 × ทั้งหมด', say: 'จำนวน เท่ากับ ร้อยละ หาร 100 คูณ ทั้งหมด' })),
      t9dPie([{ t: 'ฟุตบอล', v: 40 }, { t: 'แบด', v: 30 }, { t: 'ว่ายน้ำ', v: 20 }, { t: 'อื่น ๆ', v: 10 }], 60, 'คน'),
      t9dTry(2909, ['pct', 'money', 'max'], 'แผนภูมิวงกลม')]; },
  2910: L => [
    t9dB('เลือกวิธีนำเสนอ', [[`<g transform="translate(10 20) scale(.48)">${t9Axes(['ก', 'ข', 'ค'], 10, { x: 40, y: 10, w: 240, h: 150, step: 5 }).s + t9Bars(t9Axes(['ก', 'ข', 'ค'], 10, { x: 40, y: 10, w: 240, h: 150, step: 5 }), [6, 9, 4]).join('')}</g>` + t9T(85, 128, 'แท่ง: เทียบจำนวน'), '<b>แผนภูมิแท่ง</b>: เปรียบเทียบจำนวนแต่ละประเภท'],
      [`<g transform="translate(205 20) scale(.48)">${(A => A.s + t9Line(A, [3, 5, 4, 8]))(t9Axes(['1', '2', '3', '4'], 10, { x: 40, y: 10, w: 240, h: 150, step: 5 }))}</g>` + t9T(285, 128, 'เส้น: เปลี่ยนตามเวลา'), '<b>กราฟเส้น</b>: การเปลี่ยนแปลงตามเวลา'],
      [t9Pie([{ t: '', v: 50 }, { t: '', v: 30 }, { t: '', v: 20 }], 85, 180, 40, { noLab: true }) + t9T(85, 236, 'วงกลม: ส่วนของทั้งหมด'), '<b>แผนภูมิวงกลม</b>: สัดส่วนของทั้งหมด'], [t9Icon(250, 170, 'star') + t9Icon(278, 170, 'star') + t9Icon(306, 170, 'star', .5) + t9T(285, 236, 'รูปภาพ: ดูง่าย'), '<b>แผนภูมิรูปภาพ</b>: น่าสนใจ ดูง่าย (ตาราง = ค่าละเอียด)']], 'ดูว่าข้อมูลบอกอะไร แล้วเลือกแบบที่สื่อได้ชัดที่สุด'),
    t9dTry(2910, ['temp', 'budget', 'fruit'], 'เลือกแผนภูมิ')],
  2911: L => [
    t9dB('แผนภูมิหลอกตา', [[(A => A.s + t9Bars(A, [94, 97], [T9C.s[0], T9C.s[1]]).join(''))(t9Axes(['ก', 'ข'], 100, { x: 50, y: 30, w: 130, h: 160, step: 20 })), 'แกนเริ่มที่ 0: ร้าน ก 94 ร้าน ข 97 สูงใกล้กัน'], [(A => A.s + t9Bars(A, [4, 7], [T9C.s[0], T9C.s[1]]).join(''))(t9Axes(['ก', 'ข'], 7, { x: 250, y: 30, w: 130, h: 160, step: 1, lo: 90 })), 'ข้อมูลเดียวกัน แกนเริ่มที่ 90: ร้าน ข ดูสูงกว่า<b>เกือบ 2 เท่า</b>'], [t9T(310, 228, 'จริง ๆ ต่างกันแค่ 3!', T9C.p, 't9l'), 'อ่าน<b>ตัวเลขบนแกน</b>เสมอ ไม่ดูแค่ความสูง']], 'ก่อนเชื่อแผนภูมิ: ดูแกน หน่วย และแหล่งที่มาของข้อมูล'),
    t9dAxis(94, 97),
    t9dTry(2911, ['cut', 'start', 'sample'], 'อ่านอย่างระมัดระวัง')],
  2912: L => [
    t9dB('กระบวนการทางสถิติ', [[t9T(200, 40, '① ตั้งคำถามทางสถิติ', T9C.v, 't9big'), 'อยากรู้อะไร จากใคร'], [t9T(200, 82, '② เก็บรวบรวมข้อมูล', T9C.b, 't9big'), 'สำรวจ สัมภาษณ์ สังเกต ทดลอง'], [t9T(200, 124, '③ วิเคราะห์ข้อมูล', T9C.g, 't9big'), 'นับ จัดตาราง หาค่าที่สนใจ'], [t9T(200, 166, '④ นำเสนอข้อมูล', T9C.o, 't9big'), 'เลือกแผนภูมิที่เหมาะ'], [t9T(200, 208, '⑤ แปลความหมาย', T9C.p, 't9big'), 'สรุปจากข้อมูลจริง ไม่เกินข้อมูล']], 'ตั้งคำถาม → เก็บข้อมูล → วิเคราะห์ → นำเสนอ → แปลความหมาย'),
    r4dShow('คาดการณ์จากกลุ่มตัวอย่าง', e1dEq([{ e: '{12|40} = 30%' }, { e: '30% ของ 600', w: 'กลุ่มตัวอย่าง 40 คน ชอบ 12 คน = 30%', n: 'ทั้งโรงเรียน 600 คน' }, { e: '= {30|100} × 600', w: '', n: '' }, { e: '= *180 คน', w: 'ประมาณ 180 คน', n: 'ถ้าสัดส่วนเหมือนกัน', ans: 1 }], { q: 'ถามนักเรียน 40 คน ชอบเมนูใหม่ 12 คน ถ้าทั้งโรงเรียนมี 600 คน จะมีคนชอบประมาณกี่คน', fin: 'ใช้ร้อยละของกลุ่มตัวอย่างคาดการณ์กลุ่มใหญ่ (ถ้ากลุ่มตัวอย่างเป็นตัวแทนที่ดี)', say: 'ใช้ร้อยละของกลุ่มตัวอย่าง คาดการณ์กลุ่มใหญ่' })),
    t9dTry(2912, ['ask', 'tot', 'menu'], 'ครบกระบวนการ')]
};
LESSONS_M1C9.forEach(L => { const f = T9D_TEACH[L.id]; if (f) { L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true; } });
