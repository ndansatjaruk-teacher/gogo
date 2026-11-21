/* =========================================================
   รูปประกอบตัวอย่างทีละขั้น (ผู้ใช้ขอ: ทุกตัวอย่างทีละขั้นต้องมีรูปภาพ — ตัวอักษรอย่างเดียวเข้าใจยาก)
   Older worked examples that were text-only get a picture panel beside them: WPIC[id] = [[text-match, () => figure], …]
   New lessons: use pexStep / picWalk (learnkit.js) directly — every step can change the picture.
   ========================================================= */
/* simple pictures */
const wpNL = (vals, lo, hi, step) => { const W = 520, x = v => 24 + (v - lo) / (hi - lo) * (W - 48); let s = `<line x1="16" x2="${W - 16}" y1="60" y2="60" stroke="#2B2550" stroke-width="2"/>`;
  for (let v = lo; v <= hi; v += step) s += `<line x1="${x(v)}" x2="${x(v)}" y1="54" y2="66" stroke="#2B2550" stroke-width="1.6"/><text x="${x(v)}" y="84" text-anchor="middle" class="mt-hn">${v}</text>`;
  vals.forEach((v, i) => { s += `<circle cx="${x(v)}" cy="60" r="7" fill="${['#FF7B86', '#5BB5F0', '#4CC38A', '#B18CF2'][i % 4]}" stroke="#2B2550"/><text x="${x(v)}" y="${36 - (i % 2) * 14}" text-anchor="middle" class="mt-run">${v}</text>`; });
  return `<svg viewBox="0 0 ${W} 96" class="mtpic" aria-hidden="true">${s}</svg>`; };
/* horizontal length bars [[name, cm, colour]] */
const wpBars = (L, unit = 'ซม.', fv) => { const max = Math.max(...L.map(x => x[1])), W = 520; return `<svg viewBox="0 0 ${W} ${L.length * 44 + 8}" class="mtpic" aria-hidden="true">${L.map(([n, v, c], i) => { const w = (W - 150) * v / max;
  return `<text x="92" y="${i * 44 + 30}" text-anchor="end" class="p4bl">${n}</text><rect x="100" y="${i * 44 + 10}" width="${w}" height="28" rx="7" fill="${c || ['#CFE6FF', '#FFD9AE', '#C9F0D9'][i % 3]}" stroke="#8C84A8"/><text x="${106 + w}" y="${i * 44 + 30}" class="p4bt" style="font-size:14px">${fv ? fv(v) : v + ' ' + unit}</text>`; }).join('')}</svg>`; };
/* weights as blocks: big block = 1 kg, small = 1 ขีด */
const wpKg = (gs, names) => { let s = '', y = 6; gs.forEach((g, r) => { const k = Math.floor(g / 1000), d = Math.round(g % 1000 / 100); let x = 96;
  s += `<text x="88" y="${y + 26}" text-anchor="end" class="p4bl">${names ? names[r] : ''}</text>`;
  for (let i = 0; i < k; i++) { s += `<rect x="${x}" y="${y}" width="26" height="34" rx="4" fill="#7FC8F0" stroke="#2F6FA0"/><text x="${x + 13}" y="${y + 22}" text-anchor="middle" style="font:800 9px var(--font-num);fill:#fff">1กก.</text>`; x += 29; }
  for (let i = 0; i < d; i++) { s += `<rect x="${x}" y="${y + 14}" width="9" height="20" rx="2" fill="#FFD45C" stroke="#B7791F"/>`; x += 11; }
  y += 44; }); return `<svg viewBox="0 0 560 ${y}" class="mtpic" aria-hidden="true">${s}</svg>`; };
const wpRow = (...figs) => `<div class="wp-row">${figs.join('')}</div>`;
/* v179 (ผู้ใช้ขอ): สองแผนภาพวางซ้อนกัน (บน–ล่าง) ให้แต่ละภาพใหญ่ขึ้น */
const wpCol = (...figs) => `<div class="wp-col">${figs.join('')}</div>`;
const WPIC = {
  47: [['ตัวอย่าง', () => wpNL([798, 764, 760, 648], 600, 820, 20)]],
  62: [['624 + 175', () => p2blocksFig(624, 175)]], 63: [['256 + 318', () => p2blocksFig(256, 318)]],
  64: [['586 + 257', () => p2blocksFig(586, 257)], ['บวกสามจำนวน', () => p4pwSVG({ w: 707, p1: 393, p2: 314, unk: 'w', l1: '125 + 268', l2: '314' })]],
  /* 65: ตัวอย่างใช้ p2blkWalk (ภาพเปลี่ยนตามขั้น) แล้ว */ 66: [['769 − 435', () => p2blocksFig(769, -435)]], 67: [['834 − 516', () => p2blocksFig(834, -516)]],
  68: [['600 − 284', () => p2blocksFig(600, -284)]], /* v179: ลบสามจำนวนมีภาพทีละขั้นแล้ว */
  /* 69, 70: ตัวอย่างใช้ picWalk + p2pwSVG (ภาพเปลี่ยนตามขั้น) แล้ว — v179 */

  71: [['ตัวอย่างทีละขั้น', () => wpCol(mtGroupsSVG(5, 3, 'balloon', { size: 16 }), p4pwSVG({ w: 520, p1: 165, p2: 355, unk: '2', l1: 'แตกไป', l2: 'เหลือ', lw: 'มีทั้งหมด' }))]],
  73: [['500 − 238', () => p4pwSVG({ w: 500, p1: 238, p2: 262, unk: '2', l1: 'ซื้อรองเท้าแตะ', l2: 'เหลือ', lw: 'มีเงิน' })]],
  81: [['ใครสูงกว่า', () => p2wallSVG([{ e: 'kid3', name: 'ต้นข้าว', cm: 118 }, { e: 'kid6', name: 'ใบเตย', cm: 104 }], { max: 140, guides: true })]],
  82: [['527 เซนติเมตร', () => wpBars([['527 ซม.', 527, '#CFE6FF'], ['5 ม.', 500, '#FFD9AE']], '', v => v === 527 ? '5 ม. 27 ซม.' : '500 ซม.')], ['8 เมตร 3', () => wpBars([['8 ม. 3 ซม.', 803], ['83 ซม.', 83]], '', v => v + ' ซม.')]],
  83: [['3 ม. 45', () => wpBars([['ต้นกล้า', 345], ['ปุยฝ้าย', 308]], '', v => mcTxt(v, 1))]],
  84: [['เรียงความยาว', () => wpBars([['ตาข่าย', 275], ['เชือก', 312], ['ไม้พาย', 190]], '', v => v + ' ซม.')]],
  85: [['เส้นทางไหน', () => wpBars([['ผ่านร้านไอศกรีม', 795], ['ผ่านสวนมะพร้าว', 850]], '', v => v + ' ม.')]],
  86: [['385 เซนติเมตร', () => p4pwSVG({ w: 632, p1: 385, p2: 247, unk: 'w', fv: v => mcTxt(v, 1), l1: '385 ซม.', l2: '2 ม. 47 ซม.' })]],
  87: [['ตัวอย่างทีละขั้น', () => p4pwSVG({ w: 520, p1: 275, p2: 245, unk: '2', fv: v => mcTxt(v, 1), l1: 'ตัดไปทำร่ม', l2: 'เหลือ', lw: 'ผ้าใบ' })]],
  88: [['ตัวอย่างทีละขั้น', () => p4cmpSVG({ big: 815, small: 360, unk: 'big', nb: 'เรือใบ', ns: 'เรือพาย', fv: v => mcTxt(v, 1) })]],
  904: [['37 ขีด', () => wpKg([3700], ['37 ขีด'])]], 905: [['ตัวอย่างทีละขั้น', () => wpRow(w2DialSVG(1500, 'kd', { items: ['pineapple'], col: 'coral' }), w2DialSVG(2100, 'kd', { items: ['coconut'], col: 'mint' }))]],
  906: [['ตัวอย่างทีละขั้น', () => wpKg([1000, 1200], ['กระเทียม', 'หัวไชเท้า'])]],
  907: [['9 กก. 4 ขีด', () => wpKg([9400, 6800], ['9 กก. 4 ขีด', '6 กก. 8 ขีด'])], ['12 กก. 2 ขีด', () => wpKg([12200, 5600], ['12 กก. 2 ขีด', 'เอาออก'])]],
  908: [['4 กก. 600', () => wpKg([4600, 3500], ['4 กก. 600 ก.', '3 กก. 500 ก.'])], ['5 กก. 300', () => wpKg([5300, 2700], ['5 กก. 300 ก.', 'เอาออก'])]],
  909: [['ตัวอย่างทีละขั้น', () => p4pwSVG({ w: 7400, p1: 900, p2: 6500, unk: '2', fv: v => w2t(v, 'kg', 1), l1: 'หุงไป', l2: 'เหลือ', lw: 'ข้าวสาร' })]],
  910: [['ตัวอย่างทีละขั้น', () => p4cmpSVG({ big: 4500, small: 2700, unk: 'small', nb: 'กล่องแดง', ns: 'กล่องฟ้า', fv: v => w2t(v, 'kd', 1) })]],
  982: [['ตัวอย่างทีละขั้น', () => `<div class="vwrap">${vPourFig('sack', 6, 'scoop', { col: '#F2D9A0', dry: 1, srcName: 'ทราย' })}</div>`]],
  984: [['ตัวอย่างทีละขั้น', () => wpRow(vCont('cup', .7, { col: vLiq.coffee }), vCont('bottle', .9, { col: vLiq.water, label: '1 ลิตร' }), vCont('tank', .8, { col: vLiq.water }))]],
  985: [['ตัวอย่างทีละขั้น', () => `<div class="p2cards">${vCard(['น้ำมะพร้าว', 7, 'jar', '#CBE8E0'])}${vCard(['น้ำแตงโม', 3, 'jug', '#FF7B86'])}</div>`]],
  986: [['ตัวอย่างทีละขั้น', () => wpRow(lspoon(0), lspoon(1), `<svg viewBox="0 0 64 64" width="76">${V_TOOL.cup[1]}</svg>`)]],
  987: [['ตัวอย่างทีละขั้น', () => wpRow(vCont('tank', .5, { col: vLiq.water, marks: 6 }), vCont('tank', 1, { col: vLiq.water, marks: 6 }))]],
  988: [['หาความจุ', () => `<div class="p2cards">${vCard(['ถัง', 12, 'tank', vLiq.water])}${vCard(['กะละมัง', 6, 'basin', vLiq.water])}</div>`]],
  989: [['ตัวอย่างทีละขั้น', () => wpRow(vCont('jar', 35 / 60, { col: vLiq.water }), p4pwSVG({ w: 60, p1: 35, p2: 25, unk: '2', l1: 'มีน้ำ', l2: 'เติมอีก', lw: 'ความจุ' }))]],
  1001: [['แยกทรงกับรูป', () => wpRow(lsv(solidSVG('box', 'yellow')), lsv(g2flat('rect', 'sky')), lsv(solidSVG('sphere', 'mint')), lsv('<circle cx="32" cy="32" r="24" fill="#FFD9DE" stroke="#C2485A" stroke-width="2.2"/>'))]],
  1021: [['ตัวอย่างทีละขั้น', () => mtGroupsSVG(4, 9, 'cookie', { size: 13 })]],
  1022: [['ตัวอย่างทีละขั้น', () => p4pwSVG({ w: 85, p1: 30, p2: 55, unk: '2', l1: 'แจกเพื่อน', l2: 'เหลือ', lw: '60 + 25' })]],
  1023: [['ตัวอย่างทีละขั้น', () => p4pwSVG({ w: 300, p1: 215, p2: 85, unk: '2', l1: 'หมวก + แว่น', l2: 'เหลือ', lw: 'มีเงิน' })]],
  1024: [['ตัวอย่างทีละขั้น', () => mtGroupsSVG(8, 6, 'orange', { box: 'bag', size: 13 })]],
  1025: [['ตัวอย่างทีละขั้น', () => mtGroupsSVG(5, 6, 'croissant', { size: 14 })]]
};
(function applyWPic() {
  Object.entries(WPIC).forEach(([id, list]) => { const L = LESSONS.find(x => x.id === +id); if (!L) return;
    list.forEach(([m, fig]) => { const st = L.teach.find(s => /ตัวอย่าง/.test(s.t) && s.t.replace(/<[^>]+>/g, '').includes(m) && !s.pic); if (!st) return;
      const v0 = st.v; st.pic = true; st.v = el => { const pane = h('div', { class: 'pw-fig pw-in' }), side = h('div', { class: 'colstack pw-side' }); const f = fig();
        typeof f === 'string' ? pane.innerHTML = f : pane.append(f); el.append(h('div', { class: 'pwk' }, pane, side)); v0(side); }; }); });
})();
