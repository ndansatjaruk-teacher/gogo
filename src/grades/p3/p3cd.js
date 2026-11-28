/* =========================================================
   ป.3 บทที่ 5 แผนภูมิรูปภาพและตารางทางเดียว (ป่าดิบชื้นแผนภูมิ ด่าน 1341–1345) — หน้าสอนและเกมเรียงใหม่ (v300 · ผู้ใช้ขอ) · prefix c3d
   ประเด็นละหน้า: ① ดูภาพ (กระดานครู: ข้อมูล → รอยขีด → ตาราง · แผนภูมิรูปภาพ svg `c3dPP` นับทีละค่าของ 1 รูป ครึ่งรูป · เลือกค่าของ 1 รูป
   · ตารางทางเดียว svg `c3dTab`) → ลงมือเอง (คงหน้าแตะของ p3c.js / simPpKey ของ ป.2) → ② ทำให้ดู (ดินสอนับ/เขียนลงตาราง) → ③ ลองทำ
   แทนการ์ดรู้จัก (lrnBoard) และ picWalk · วางต่อจาก p3sd.js
   ========================================================= */
const c3dIc = (e, x, y, s = 26, half) => `<g transform="translate(${a4n(x)} ${a4n(y)}) scale(${s / 64})">${n3dIn(ppI(e))}</g>` + (half ? `<rect x="${a4n(x + s / 2)}" y="${a4n(y - 1)}" width="${a4n(s / 2 + 2)}" height="${s + 2}" fill="#fff"/>` : '');
/* pictograph: o.rows (subset), o.k, o.hl = row to count, o.cnt = show the running count on that row, o.key */
function c3dPP(D, o = {}) { const k = o.k || D.k, R = o.rows || D.rows, y0 = o.y0 ?? 44, rh = 36, lx = 14, ix = 120, s = 26; let g = o.title === false ? '' : h6dT(o.cx || 220, y0 - 18, D.title, H6C.ink, 'r4d-sm');
  R.forEach(([lab, val], i) => { const y = y0 + i * rh, [n, hf] = ppN(val, k); if (o.hl === i) g += `<rect x="6" y="${y - 4}" width="${ix + (n + 1) * 30}" height="${rh - 2}" rx="8" fill="${H6C.y}"/>`;
    g += h6dT(lx, y + 21, lab, H6C.ink, 'r4d-sm', 'start') + `<path d="M${ix - 8} ${y - 4} V${y + rh - 6}" stroke="${H6C.fade}" stroke-width="1.4"/>`;
    for (let j = 0; j < n + hf; j++) { g += c3dIc(D.keyE, ix + j * 30, y + 2, s, hf && j === n); if (o.cnt && o.hl === i) g += h6dT(ix + j * 30 + 13, y + 1, fmt(Math.min(val, (j + 1) * k)), H6C.p, 'e4d-nm'); } });
  if (o.key !== false) g += h6dT(lx, y0 + R.length * rh + 22, `กำหนดให้ 1 รูป แทน ${k} ${D.unit}`, H6C.b, 'r4d-sm', 'start');
  return g; }
/* one-way table: o.hl row(s), o.rows subset, o.blank → ? */
function c3dTab(T, o = {}) { const R = o.rows || T.rows, x0 = o.x0 ?? 60, w1 = o.w1 || 170, w2 = o.w2 || 120, y0 = o.y0 ?? 40, rh = 32, hl = [].concat(o.hl ?? []); let g = o.title === false ? '' : h6dT(x0 + (w1 + w2) / 2, y0 - 12, T.title, H6C.ink, 'r4d-sm');
  const cell = (x, y, w, t, fill, col = H6C.ink) => `<rect x="${x}" y="${y}" width="${w}" height="${rh}" fill="${fill}" stroke="${H6C.fade}" stroke-width="1.4"/>` + h6dT(x + w / 2, y + 22, t, col, 'r4d-sm');
  g += cell(x0, y0, w1, T.head, H6C.sky) + cell(x0 + w1, y0, w2, `จำนวน (${T.unit})`, H6C.sky);
  R.forEach(([n, v], i) => { const y = y0 + rh * (i + 1), f = hl.includes(i) ? H6C.y : '#fff'; g += cell(x0, y, w1, n, f) + cell(x0 + w1, y, w2, o.blank && o.blank.includes(i) ? '?' : fmt(v), f, o.blank && o.blank.includes(i) ? H6C.p : H6C.ink); });
  return g; }
const C3D_G0 = {};
const c3dTry = (L, title) => f6dTry(L.id, () => pick(C3D_G0[L.id]()), title);
const C3D_TEACH = {
  1341: L => { const S = PC3_SURV[1], resp = pc3Resp(S);
    return [
      h6dB('เก็บข้อมูลด้วยรอยขีด', [[resp.map((c, i) => h6dT(40 + (i % 7) * 46, 40 + Math.floor(i / 7) * 28, c, H6C.ink, 'r4d-sm')).join('') + h6dT(180, 18, S.title, H6C.b, 'r4d-sm'), '<b>ข้อมูล</b>: ถามเพื่อนทีละคนว่าชอบสีอะไร'],
        { ink: S.cats.map(([c, n], i) => h6dT(40, 50 + i * 40, c, H6C.ink, 'r4d-sm', 'start') + `<g transform="translate(110 ${28 + i * 40}) scale(.85)">${n3dIn(tallySVG(n))}</g>` + h6dT(330, 50 + i * 40, String(n), H6C.g, 'r4d-tx')).join(''), t: '<b>จำแนก</b>ตามสี แล้วขีดทีละ 1 ขีด ขีดที่ 5 ขีดทับ 4 ขีดแรก', clear: 1 },
        [h6dT(180, 220, 'รอยขีด → นับทีละ 5 → เขียนจำนวน', H6C.p, 'r4d-sm'), 'นับรอยขีดทีละ 5 แล้วบันทึกเป็นจำนวน']], 'สำรวจ → ขีดรอยขีด → นับ → บันทึก', { W: 360, H: 232 }),
      ...s9dKeep(L, [L.__old.length - 1]),
      r4dShow('นับรอยขีด', { W: 360, H: 200, fig: `<g transform="translate(40 50) scale(1.4)">${n3dIn(tallySVG(17))}</g>`, q: 'รอยขีดนี้แสดงจำนวนเท่าใด',
        steps: [{ ink: h6dT(80, 140, '5', H6C.p, 'r4d-tx'), w: 'กลุ่มที่ 1 = 5', n: '' }, { ink: h6dT(150, 140, '10', H6C.p, 'r4d-tx'), w: 'กลุ่มที่ 2 = 10', n: 'นับเพิ่มทีละ 5' }, { ink: h6dT(225, 140, '15', H6C.p, 'r4d-tx'), w: 'กลุ่มที่ 3 = 15', n: '' }, { ink: h6dT(290, 140, '17', H6C.g, 'r4d-tx'), w: '15 + 2 = 17', n: 'ขีดเดี่ยวอีก 2', ans: 1 }],
        fin: 'นับกลุ่มละ 5 ก่อน แล้วนับขีดที่เหลือ', say: 'นับกลุ่มละห้าก่อน แล้วนับขีดที่เหลือ' }),
      c3dTry(L, 'รอยขีดและการจำแนก')]; },
  1342: L => { const D = PC3_PP[6], E = PC3_PP[5];
    return [
      h6dB('อ่านแผนภูมิรูปภาพ', [[c3dPP(D, { rows: D.rows.slice(0, 3), key: false }), 'ชื่อแผนภูมิ รายการ และรูป'], [h6dT(14, 44 + 3 * 36 + 22, `กำหนดให้ 1 รูป แทน ${D.k} ${D.unit}`, H6C.b, 'r4d-sm', 'start'), `บรรทัด<b>กำหนดให้</b>: 1 รูปแทน ${D.k} ${D.unit}`],
        [c3dPP(D, { rows: D.rows.slice(0, 3), hl: 0, cnt: 1, key: false, title: false }), `นับเพิ่มทีละ ${D.k}: ${D.rows[0][0]} มี <b>${D.rows[0][1]} ${D.unit}</b>`],
        { ink: c3dPP(E, { rows: E.rows.slice(2, 4) }) + h6dT(260, 190, `ครึ่งรูป = ${E.k / 2} ${E.unit}`, H6C.p, 'r4d-sm'), t: `ครึ่งรูป แทนครึ่งหนึ่งของ 1 รูป = ${E.k / 2} ${E.unit}`, clear: 1 }], 'จำนวน = นับเพิ่มทีละค่าของ 1 รูป', { W: 440, H: 210 }),
      ...s9dKeep(L, [L.__old.length - 1]),
      (() => { const P = PC3_PP[3]; return r4dShow('อ่านแถวเล่นเกม', { W: 440, H: 250, fig: c3dPP(P), q: `จากแผนภูมิ ${P.rows[1][0]}มีกี่${P.unit}`,
        steps: [{ ink: `<rect x="6" y="${44 + 5 * 36 + 2}" width="250" height="28" rx="8" fill="none" stroke="${H6C.o}" stroke-width="2.4"/>`, w: `1 รูปแทน ${P.k} ${P.unit}`, n: 'ดูกำหนดให้' }, { ink: `<rect x="6" y="${44 + 36 - 4}" width="${120 + 8 * 30}" height="34" rx="8" fill="none" stroke="${H6C.p}" stroke-width="2.4"/>`, w: `เล่นเกม ${ppN(P.rows[1][1], P.k)[0]} รูป`, n: '' },
          { ink: c3dPP(P, { hl: 1, cnt: 1, key: false, title: false }), w: `${P.k}, ${P.k * 2}, … ${P.rows[1][1]}`, n: `นับเพิ่มทีละ ${P.k}` }, { ink: '', w: `${P.rows[1][1]} ${P.unit}`, n: '', ans: 1 }], fin: 'ดูกำหนดให้ก่อน แล้วนับเพิ่มทีละค่าของ 1 รูป', say: 'ดูกำหนดให้ก่อน แล้วนับเพิ่มทีละค่าของหนึ่งรูป' }); })(),
      c3dTry(L, 'อ่านแผนภูมิรูปภาพ')]; },
  1343: L => { const D = PC3_PP[8], R3 = D.rows.slice(0, 3);
    return [
      h6dB('เขียนแผนภูมิรูปภาพ', [[R3.map(([n, v], i) => h6dT(40, 50 + i * 30, `${n} ${v} ${D.unit}`, H6C.ink, 'r4d-sm', 'start')).join('') + h6dT(220, 24, D.title, H6C.ink, 'r4d-sm'), '① ดูข้อมูล: ทุกจำนวนหารด้วย 5 ลงตัว'],
        [h6dT(300, 80, `1 รูป แทน ${D.k} ${D.unit}`, H6C.b, 'r4d-tx'), `เลือกให้ <b>1 รูปแทน ${D.k}</b> จะได้ไม่ต้องใช้ครึ่งรูป`],
        { ink: c3dPP(D, { rows: R3 }) + R3.map(([, v], i) => h6dT(400, 44 + i * 36 + 21, `${v} ÷ ${D.k} = ${v / D.k}`, H6C.p, 'r4d-sm')).join(''), t: `② จำนวนรูป = จำนวน ÷ ${D.k} แล้ววาดทีละแถว ③ ใส่ชื่อแผนภูมิและบรรทัดกำหนดให้`, clear: 1 }], 'จำนวนรูป = จำนวน ÷ ค่าของ 1 รูป', { W: 480, H: 200 }),
      ...s9dKeep(L, [L.__old.length - 1]),
      f6dEq('ต้องวาดกี่รูป', [{ e: '1 รูป แทน 6 เล่ม' }, { e: '30 ÷ 6 = 5', w: 'การ์ตูน 5 รูป', n: '' }, { e: '18 ÷ 6 = 3', w: 'นิยาย 3 รูป', n: '' }, { e: '12 ÷ 6 = *2', w: 'สารคดี 2 รูป', n: '', ans: 1 }], { q: 'หนังสือที่ถูกยืม: การ์ตูน 30 นิยาย 18 สารคดี 12 เล่ม ถ้า 1 รูปแทน 6 เล่ม ต้องวาดแถวละกี่รูป', fin: 'จำนวนรูป = จำนวน ÷ ค่าของ 1 รูป', say: 'จำนวนรูป เท่ากับ จำนวน หาร ค่าของหนึ่งรูป' }),
      c3dTry(L, 'เขียนแผนภูมิรูปภาพ')]; },
  1344: L => { const T = PC3_TB[6], T2 = PC3_TB[7];
    return [
      h6dB('ตารางทางเดียว', [[c3dTab(T), 'ชื่อตาราง หัวตาราง รายการ และจำนวน (หน่วย)'], [c3dTab(T, { hl: 3 }), `อ่านค่า: หา<b>${T.rows[3][0]}</b> แล้วอ่านจำนวนในช่องคู่กัน = <b>${T.rows[3][1]} ${T.unit}</b>`],
        [c3dTab(T, { hl: [2, 3] }) + h6dT(180, 260, `${T.rows[3][1]} − ${T.rows[2][1]} = ${T.rows[3][1] - T.rows[2][1]}`, H6C.g, 'r4d-tx'), `เปรียบเทียบ: ${T.rows[3][0]}มากกว่า${T.rows[2][0]} ${T.rows[3][1] - T.rows[2][1]} ${T.unit}`]], 'ตารางทางเดียวแสดงข้อมูลเรื่องเดียว', { W: 400, H: 272 }),
      ...s9dKeep(L, [L.__old.length - 1]),
      f6dEq('อ่านตารางแล้วคำนวณ', [{ e: 'หาผลรวม 3 ชมรม' }, { e: `${T.rows[0][1]} + ${T.rows[1][1]} = ${T.rows[0][1] + T.rows[1][1]}`, w: `${T.rows[0][0]} + ${T.rows[1][0]}`, n: 'อ่านค่าจากตาราง' }, { e: `${T.rows[0][1] + T.rows[1][1]} + ${T.rows[2][1]} = *${T.rows[0][1] + T.rows[1][1] + T.rows[2][1]}`, w: `รวม ${T.rows[0][1] + T.rows[1][1] + T.rows[2][1]} ${T.unit}`, n: '', ans: 1 }],
        { q: `จากตาราง${T.title} ${T.rows[0][0]} ${T.rows[1][0]} และ${T.rows[2][0]} รวมกันกี่${T.unit}`, fin: 'อ่านค่าให้ถูกแถว แล้วคำนวณ', say: 'อ่านค่าให้ถูกแถว แล้วคำนวณ' }),
      c3dTry(L, 'อ่านตารางทางเดียว')]; },
  1345: L => { const P = PC3_PP[13], T = PC3T(P.title, 'ห้อง', P.unit, P.rows.map(([n, v]) => [n, v]));
    return [
      h6dB('เขียนตารางทางเดียว', [[PC3_TB[6].rows.slice(0, 3).map(([n, v], i) => h6dT(40, 50 + i * 30, `${n} ${v} คน`, H6C.ink, 'r4d-sm', 'start')).join(''), '① อ่านข้อมูล: เรื่องเดียวกัน หน่วยเดียวกัน'],
        [c3dTab(PC3_TB[6], { rows: PC3_TB[6].rows.slice(0, 3), x0: 170, w1: 120, w2: 110 }), '② ตั้งชื่อตาราง หัวตาราง แล้วเขียนรายการกับจำนวนทีละแถว'],
        { ink: c3dPP(P, { y0: 40 }) + `<path d="M330 120 H350" stroke="${H6C.p}" stroke-width="3"/>` + c3dTab(T, { title: false, x0: 360, w1: 70, w2: 90, y0: 40 }), t: 'จากแผนภูมิรูปภาพก็ได้: นับรูป × ค่าของ 1 รูป แล้วเขียนลงตาราง', clear: 1 }], 'ชื่อตาราง → หัวตาราง → รายการ → จำนวน', { W: 530, H: 230 }),
      ...s9dKeep(L, [L.__old.length - 1]),
      f6dEq('จากแผนภูมิเป็นตาราง', [{ e: `1 รูป แทน ${P.k} ${P.unit}` }, ...P.rows.slice(0, 3).map(([n, v], i) => ({ e: `${v / P.k} × ${P.k} = ${i === 2 ? '*' : ''}${v}`, w: `${n} ${v} ${P.unit}`, n: i ? '' : 'นับรูป × ค่าของ 1 รูป', ans: i === 2 ? 1 : 0 }))],
        { q: `แปลงแผนภูมิรูปภาพ${P.title} เป็นตารางทางเดียว`, fin: 'นับรูปแต่ละแถว คูณค่าของ 1 รูป แล้วเขียนลงตาราง', say: 'นับรูปแต่ละแถว คูณค่าของหนึ่งรูป แล้วเขียนลงตาราง' }),
      c3dTry(L, 'เขียนตารางทางเดียว')]; }
};
LESSONS_P3C5.forEach(L => { const f = C3D_TEACH[L.id]; if (!f || L.boss) return; C3D_G0[L.id] = L.game; L.__old = L.teach; L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true;
  const g0 = L.game; L.game = () => [...g0(), ...g0()]; h6dOrd(L, t => 0); });
