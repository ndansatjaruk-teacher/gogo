/* =========================================================
   GRADE 2 · CHAPTER 9 — รูปเรขาคณิต  (ชายหาด · ภาคเรียนที่ 2 · เมือง 42 · ด่าน 1001–1005 · บอส 1019)
   solids vs flat shapes · polygons (closed, straight sides) · circle vs ellipse ·
   drawing polygons on a dot grid · repeating patterns of shapes
   reuses: solidSVG / shapeSVG / sideCounter / tokEl / patStrip (ป.1 บทที่ 9) · simPolyMake / K7N (ป.6 บทที่ 7) · ix kit
   ========================================================= */
const g2reg = (n, r = 26, rot = -90, cx = 32, cy = 33) => range(0, n - 1).map(i => { const a = (rot + i * 360 / n) * Math.PI / 180; return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)]; });
/* new outlines in the 64-box (P1's shapeSVG / sideCounter / tokEl draw anything listed in SHAPE_PTS) */
Object.assign(SHAPE_PTS, {
  g2_pent: g2reg(5), g2_hex: g2reg(6, 26, 0), g2_hept: g2reg(7), g2_oct: g2reg(8, 26, 22.5), g2_non: g2reg(9), g2_dec: g2reg(10, 26, -90),
  g2_house: [[32, 6], [56, 26], [56, 56], [8, 56], [8, 26]], g2_arrow: [[6, 24], [34, 24], [34, 10], [58, 32], [34, 54], [34, 40], [6, 40]],
  g2_bow: [[8, 12], [32, 22], [56, 12], [56, 52], [32, 42], [8, 52]], g2_chev: [[8, 12], [36, 12], [56, 32], [36, 52], [8, 52], [28, 32]],
  g2_lshape: [[10, 8], [30, 8], [30, 36], [56, 36], [56, 56], [10, 56]], g2_cross: [[24, 6], [40, 6], [40, 24], [58, 24], [58, 40], [40, 40], [40, 58], [24, 58], [24, 40], [6, 40], [6, 24], [24, 24]],
  g2_star6: range(0, 11).map(i => { const a = (-90 + i * 30) * Math.PI / 180, r = i % 2 ? 13 : 27; return [+(32 + r * Math.cos(a)).toFixed(1), +(33 + r * Math.sin(a)).toFixed(1)]; }),
  g2_kite5: [[32, 6], [54, 24], [46, 56], [18, 56], [10, 24]], g2_gem: [[18, 10], [46, 10], [58, 26], [32, 58], [6, 26]], g2_tshirt: [[18, 8], [46, 8], [58, 22], [48, 30], [48, 56], [16, 56], [16, 30], [6, 22]]
});
Object.assign(TOK_SHAPE, { pe: 'g2_pent', hx: 'g2_hex', oc: 'g2_oct', hs: 'g2_house' });
const G2_PN = v => SHAPE_PTS[v].length;
/* curved / open figures (not polygons) — 64-box paths */
const G2_NOT = {
  heart: ['M32 56 C8 40 4 24 15 16 C23 10 30 14 32 21 C34 14 41 10 49 16 C60 24 56 40 32 56 Z', 'มีเส้นโค้ง'],
  dee: ['M12 10 L34 10 A22 22 0 0 1 34 54 L12 54 Z', 'มีเส้นโค้ง'],
  zig: ['M6 46 L19 18 L32 46 L45 18 L58 46', 'ไม่ใช่รูปปิด'],
  cup: ['M12 12 L12 54 L52 54 L52 12', 'ไม่ใช่รูปปิด (ด้านบนเปิด)'],
  moon: ['M40 8 A26 26 0 1 0 40 58 A20 20 0 1 1 40 8 Z', 'มีเส้นโค้ง'],
  bean: ['M20 12 C36 4 52 16 46 30 C42 40 54 48 42 56 C28 64 8 50 12 34 C14 26 8 18 20 12 Z', 'มีเส้นโค้ง'],
  hook: ['M10 54 L10 14 L44 14 L44 40 L26 40', 'ไม่ใช่รูปปิด'] };
const g2notSVG = (k, col) => { const [d] = G2_NOT[k], c = PAL[col || mixCol()], open = !/Z$/.test(d); return `<path d="${d}" fill="${open ? 'none' : c[0]}" stroke="${open ? '#2B2550' : c[3]}" stroke-width="${open ? 2.6 : 2.2}" stroke-linejoin="round" stroke-linecap="round"/>`; };
/* a card = { svg (64-box inner), kind, name } */
const G2K = { box: 'ทรงสี่เหลี่ยมมุมฉาก', rect: 'รูปสี่เหลี่ยมมุมฉาก', ball: 'ทรงกลม', circle: 'วงกลม', ellipse: 'วงรี', poly: 'เป็นรูปหลายเหลี่ยม', not: 'ไม่เป็นรูปหลายเหลี่ยม' };
/* flat shapes are drawn FLAT (one colour, no shading) so they never look like solids */
const g2flat = (v, p, rot = 0) => { const c = PAL[p || mixCol()]; return `<g transform="rotate(${rot} 32 32)"><path d="${shapeOutline(v)}" fill="${c[0]}" stroke="${c[3]}" stroke-width="2.2" stroke-linejoin="round"/></g>`; };
const g2c = (kind, v, o = {}) => {
  if (kind === 'box') return { kind, svg: solidSVG(v || pick(['box', 'cube', 'slab', 'tower']), o.p || mixCol()) };
  if (kind === 'ball') return { kind, svg: solidSVG('sphere', o.p || mixCol()) };
  if (kind === 'rect') return { kind, svg: g2flat(v || pick(['rect', 'square', 'tallrect']), o.p, o.rot) };
  if (kind === 'circle') { const c = PAL[o.p || mixCol()]; return { kind, svg: `<circle cx="32" cy="32" r="${o.r || 24}" fill="${c[0]}" stroke="${c[3]}" stroke-width="2.2"/>` }; }
  if (kind === 'ellipse') return { kind, svg: g2flat(v || pick(['ellipse', 'wellipse']), o.p, o.rot) };
  if (kind === 'poly') return { kind, n: G2_PN(v), svg: g2flat(v, o.p, o.rot) };
  if (kind === 'not') return { kind, why: G2_NOT[v][1], svg: g2notSVG(v, o.p) };
};
const g2pic = (c, cls = '') => `<svg viewBox="0 0 64 64" class="g2pic ${cls}" aria-hidden="true">${c.svg}</svg>`;
const g2big = c => `<div class="g2big">${g2pic(c)}</div>`;

/* ---------- picture made of circles and ellipses (count them) ---------- */
// items: [kind 'c'|'e', cx, cy, rx, ry, rot]
const g2oval = (it, i, col) => { const [k, cx, cy, rx, ry = rx, rot = 0] = it; return `<ellipse class="g2o" data-i="${i}" data-k="${k}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${k === 'c' ? rx : ry}" transform="rotate(${rot} ${cx} ${cy})" fill="${col}" stroke="#2B2550" stroke-width="1.8"/>`; };
function g2ovalPic(P, o = {}) {
  const cols = ['#FFD45C', '#7FC8F0', '#FF9AA8', '#9BE3B5', '#C9B8FF', '#FFB877'];
  return `<svg viewBox="${P.vb || '0 0 200 160'}" class="g2ovals" aria-hidden="true">${P.extra || ''}${P.items.map((it, i) => g2oval(it, i, o.plain ? '#fff' : cols[i % cols.length])).join('')}</svg>`;
}
function g2markable(el) { el.classList.add('ia'); let n = 0; el.querySelectorAll('.g2o, .g2s').forEach(p => p.addEventListener('click', e => { e.stopPropagation(); const on = p.classList.toggle('mk'); n += on ? 1 : -1; sfx.pop(Math.max(1, n)); })); }

/* ---------- teaching sims ---------- */
/* solids leave flat shapes: trace around a box, cut a ball */
function simFlatSolid() {
  const out = fNote(), box = h('div', { class: 'colstack' }, h6wait()), seen = new Set();
  const L = [['box', 'rect', 'ทรงสี่เหลี่ยมมุมฉาก', 'วางลงบนกระดาษแล้ว<b>ลากเส้นรอบ</b> ได้<b>รูปสี่เหลี่ยมมุมฉาก</b>', 'ลากเส้นรอบ'], ['cube', 'square', 'ทรงสี่เหลี่ยมมุมฉาก (ลูกบาศก์)', 'ทุกหน้าเป็น<b>รูปสี่เหลี่ยมมุมฉาก</b> (สี่เหลี่ยมจัตุรัส)', 'ลากเส้นรอบ'], ['sphere', 'circle', 'ทรงกลม', '<b>ผ่าครึ่ง</b>ทรงกลม หน้าตัดเป็น<b>วงกลม</b> — ทรงกลมกลิ้งได้ทุกทิศ ส่วนวงกลมแบนอยู่บนกระดาษ', 'ผ่าครึ่ง']];
  const row = h('div', { class: 'g2flat ia' }, ...L.map(([sv, fv, nm, msg, act], i) => { const res = h('span', { class: 'g2res' }), b = h('button', { class: 'g2fl' }, h('span', { class: 'solid', html: `<svg viewBox="0 0 64 64">${solidSVG(sv, ['yellow', 'sky', 'mint'][i])}</svg>` }), h('b', null, nm), h('small', null, act), res);
    b.onclick = e => { e.stopPropagation(); res.innerHTML = `<svg viewBox="0 0 64 64">${g2flat(fv, ['yellow', 'sky', 'mint'][i])}</svg>`; res.animate([{ transform: 'translateY(-30px) scale(.4)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.3,1.3,.5,1)' }); b.classList.add('on'); sfx.pop(i + 2);
      out.innerHTML = `${nm}: ${msg}`; say(out.textContent, true); seen.add(i); if (seen.size === L.length) { teachDone(box); out.innerHTML += '<br><b>รูปทรง</b>มีความหนา จับได้รอบด้าน · <b>รูป</b>แบนอยู่บนกระดาษ'; } }; return b; }));
  box.append(h('div', { class: 'cap' }, 'แตะรูปทรงทีละอัน ดูว่าได้รูปอะไร'), row, out); return box;
}
/* stretch a circle into an ellipse — radius lines are equal only for the circle */
function simStretch() {
  let rx = 60, ry = 60; const made = new Set(), out = fNote(), box = h('div', { class: 'colstack' }, h6wait()), wrap = h('div', { class: 'g2strw ia' });
  const draw = () => { const eq = Math.abs(rx - ry) < 3, L = range(0, 7).map(k => { const a = k * Math.PI / 4, x = rx * Math.cos(a), y = ry * Math.sin(a); return [x, y, Math.round(Math.hypot(x, y))]; });
    wrap.innerHTML = `<svg viewBox="0 0 300 200" class="g2str"><ellipse cx="150" cy="100" rx="${rx}" ry="${ry}" fill="${eq ? '#FFC2C6' : '#FFE0B0'}" stroke="#2B2550" stroke-width="2.4"/>${L.map(([x, y]) => `<line x1="150" y1="100" x2="${150 + x}" y2="${100 + y}" stroke="${eq ? '#1B8862' : '#C23C4B'}" stroke-width="2" stroke-dasharray="5 4"/>`).join('')}<circle cx="150" cy="100" r="4" fill="#2B2550"/>
      <g class="g2h" data-h="x"><circle cx="${150 + rx}" cy="100" r="13"/><path d="M${150 + rx - 6} 100 h12 M${150 + rx - 6} 100 l4 -4 M${150 + rx - 6} 100 l4 4 M${150 + rx + 6} 100 l-4 -4 M${150 + rx + 6} 100 l-4 4"/></g>
      <g class="g2h" data-h="y"><circle cx="150" cy="${100 - ry}" r="13"/><path d="M150 ${100 - ry - 6} v12 M150 ${100 - ry - 6} l-4 4 M150 ${100 - ry - 6} l4 4 M150 ${100 - ry + 6} l-4 -4 M150 ${100 - ry + 6} l4 -4"/></g></svg>`;
    const k = eq ? 'circle' : 'ellipse'; made.add(k);
    out.innerHTML = eq ? '<b>วงกลม</b> — จากจุดตรงกลางไปถึงขอบ <b>ยาวเท่ากันทุกเส้น</b> (เส้นสีเขียว)' : '<b>วงรี</b> — จากจุดตรงกลางไปถึงขอบ <b>ยาวไม่เท่ากัน</b> (ยาวด้านหนึ่ง สั้นอีกด้าน)';
    if (made.size === 2 && !box.dataset.ok) { box.dataset.ok = 1; teachDone(box); }
    wrap.querySelectorAll('.g2h').forEach(g => !g.__bd && (g.__bd = 1) && g.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); const svg = wrap.firstChild, ax = g.dataset.h; try { g.setPointerCapture(e.pointerId); } catch (_) {}
      const mv = ev => { const p = p2svgPt(svg, ev); if (ax === 'x') rx = Math.max(24, Math.min(140, Math.round(p.x - 150))); else ry = Math.max(24, Math.min(92, Math.round(100 - p.y))); if (Math.abs(rx - ry) < 4) (ax === 'x' ? rx = ry : ry = rx); draw(); };
      const up = () => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); sfx.tap(); }; document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up); })); };
  draw();
  box.append(h('div', { class: 'cap' }, 'ลากปุ่มกลมเพื่อยืดหรือหด — ลองทำให้เป็นวงกลม แล้วยืดเป็นวงรี'), wrap, h('div', { class: 'rowstack' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); rx = ry = 70; draw(); sfx.tap(); } }, 'ทำเป็นวงกลม'), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); rx = 120; ry = 55; draw(); sfx.tap(); } }, 'ยืดเป็นวงรี')), out);
  return box;
}

/* ---------- dot grid: tap dots to draw a polygon ---------- */
const g2X = (a, b, c, d) => { const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
function g2polyInfo(P) { // P: vertices (grid coords), closed
  let V = P.filter((p, i) => !(p[0] === P[(i + 1) % P.length][0] && p[1] === P[(i + 1) % P.length][1]));
  let changed = true; while (changed && V.length > 2) { changed = false; for (let i = 0; i < V.length; i++) { const a = V[(i - 1 + V.length) % V.length], b = V[i], c = V[(i + 1) % V.length]; if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) === 0) { V.splice(i, 1); changed = true; break; } } }
  const n = V.length, E = V.map((p, i) => [p, V[(i + 1) % n]]); let simple = n >= 3;
  for (let i = 0; i < n && simple; i++) for (let j = i + 1; j < n; j++) { if (j === i + 1 || (i === 0 && j === n - 1)) continue; if (g2X(E[i][0], E[i][1], E[j][0], E[j][1])) { simple = false; break; } }
  return { n, simple };
}
function g2dotBoard(o = {}) {
  const C = o.cols || 7, R = o.rows || 5, G = 50, W = (C - 1) * G + 60, H = (R - 1) * G + 60, X = c => 30 + c * G, Y = r => 30 + r * G; let P = [], closed = false;
  const wrap = h('div', { class: 'g2dots ia' }), info = h('div', { class: 'g2dinfo' });
  const draw = () => { const pts = P.map(([c, r]) => `${X(c)},${Y(r)}`).join(' ');
    wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="g2dsvg">${closed ? `<polygon points="${pts}" fill="#CFE6FF" stroke="#2F86C2" stroke-width="4" stroke-linejoin="round"/>` : P.length > 1 ? `<polyline points="${pts}" fill="none" stroke="#2F86C2" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
      ${range(0, R - 1).map(r => range(0, C - 1).map(c => { const k = P.findIndex(p => p[0] === c && p[1] === r); return `<g class="g2d" data-c="${c}" data-r="${r}"><circle cx="${X(c)}" cy="${Y(r)}" r="18" fill="transparent"/><circle cx="${X(c)}" cy="${Y(r)}" r="${k >= 0 ? 8 : 5}" fill="${k === 0 && !closed && P.length > 2 ? '#E5505E' : k >= 0 ? '#2F86C2' : '#B7AFCD'}"/></g>`; }).join('')).join('')}</svg>`;
    wrap.querySelectorAll('.g2d').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); if (closed) return; const c = +g.dataset.c, r = +g.dataset.r;
      if (P.length > 2 && P[0][0] === c && P[0][1] === r) { closed = true; sfx.ok(); }
      else if (!P.some(p => p[0] === c && p[1] === r)) { P.push([c, r]); sfx.pop(Math.min(P.length, 9)); } else return; draw(); }));
    const I = closed ? g2polyInfo(P) : null;
    info.innerHTML = !P.length ? 'แตะจุดเพื่อเริ่มวาด' : !closed ? `วางจุดแล้ว ${P.length} จุด — ${P.length > 2 ? 'แตะ<b>จุดสีแดง</b> (จุดแรก) เพื่อปิดรูป' : 'แตะจุดถัดไป'}` : !I.simple ? '<b>เส้นตัดกัน</b> — ยังไม่ใช่รูปหลายเหลี่ยม กด “ย้อน” แล้ววาดใหม่' : `ได้<b>${K7N(I.n)}</b> · มี ${I.n} ด้าน ${I.n} มุม`;
    o.onChange && o.onChange(closed ? I : null); };
  const undo = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (closed) closed = false; else P.pop(); draw(); sfx.tap(); } }, icon('undo'), 'ย้อน'),
    clr = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); P = []; closed = false; draw(); sfx.tap(); } }, icon('eraser'), 'ล้าง');
  draw(); const el = h('div', { class: 'colstack' }, wrap, info, h('div', { class: 'rowstack' }, undo, clr)); el.get = () => closed ? g2polyInfo(P) : null; el.clear = () => { P = []; closed = false; draw(); }; return el;
}
function simDotDraw(targets) {
  let k = 0; const box = h('div', { class: 'colstack' }, h6wait()), goal = h('div', { class: 'cap p2goal' });
  const show = () => { goal.innerHTML = k < targets.length ? `ภารกิจ ${k + 1}/${targets.length}: วาด<b>${K7N(targets[k])}</b> (ต่อจุด ${targets[k]} จุดด้วยเส้นตรง แล้วปิดรูป)` : '✓ วาดครบแล้ว! จำนวนจุดยอด = จำนวนด้าน = จำนวนมุม'; };
  const brd = g2dotBoard({ onChange: I => { if (I && I.simple && k < targets.length && I.n === targets[k]) { sfx.ok(); k++; show(); if (k >= targets.length) { teachDone(box); say('วาดครบแล้ว', true); } else setTimeout(() => brd.clear(), 1100); } } });
  show(); box.append(goal, brd); return box;
}

/* ---------- question types (prefix g2) ---------- */
Object.assign(Q, {
  g2name({ c, opts, q = 'รูปนี้คือรูปเรขาคณิตใด', hint }) {
    return Q.p4Pick({ fig: g2big(c), q, opts, right: opts[0], hint: hint || 'รูปทรงมีความหนา (ทรง…) · รูปแบนอยู่บนกระดาษ (รูป… / วงกลม / วงรี)' });
  },
  /* tap every card of one kind, then check */
  g2tapAll({ q, cards, ok, hint }) {
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) {
      const g = h('div', { class: 'g2grid ia' }, ...cards.map((c, i) => { const b = h('button', { class: 'g2cell', 'data-i': i, html: g2pic(c) + `<i>${i + 1}</i>` }); b.onclick = e => { e.stopPropagation(); if (g.dataset.done) return; b.classList.toggle('on'); sfx.pop(g.querySelectorAll('.on').length || 1); }; return b; }));
      bd.append(h('div', { class: 'colstack' }, g, checkButton('ตรวจคำตอบ', () => { const got = [...g.querySelectorAll('.g2cell.on')].map(b => +b.dataset.i), want = cards.map((c, i) => ok(c) ? i : -1).filter(i => i >= 0), good = got.length === want.length && want.every(i => got.includes(i));
        if (good) g.dataset.done = 1; ctx.check(good, got.some(i => !want.includes(i)) ? 'มีรูปที่ไม่ใช่ถูกเลือกอยู่ แตะอีกครั้งเพื่อยกเลิก' : hint || 'ยังเลือกไม่ครบนะ'); }))); } };
  },
  /* tap the sides / corners to count them */
  g2sides({ v, ask = 'ด้าน' }) {
    const n = G2_PN(v), q = `รูปนี้มีกี่<span class="hl">${ask}</span>`;
    return { prompt: q, say: `รูปนี้มีกี่${ask}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, sideCounter(v), h('div', { class: 'rowstack' }, answerBox(ctx, n, { hint: `แตะ${ask}ทีละ${ask}รอบรูปเพื่อนับ` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, ask)))); } };
  },
  /* count circles / ellipses (or one polygon kind) in a picture — tap to mark while counting */
  g2count({ fig, q, a, hint }) {
    return { prompt: q + ' <small>(แตะทำเครื่องหมายขณะนับได้)</small>', say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { const f = h('div', { class: 'g2figw', html: fig }); g2markable(f);
      bd.append(h('div', { class: 't6-q p4-q p2q' }, f, h('div', { class: 'rowstack' }, answerBox(ctx, a, { hint: hint || 'แตะทีละรูปแล้วนับ' }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'รูป')))); } };
  },
  /* draw an n-gon on the dot grid */
  g2draw({ n }) {
    const q = `ต่อจุดวาด<span class="hl">${K7N(n)}</span>`;
    return { prompt: q + ' <small>(แตะจุดทีละจุด แล้วแตะจุดแรกเพื่อปิดรูป)</small>', say: `ต่อจุดวาด${K7N(n)}`, mount(bd, ctx) { const brd = g2dotBoard();
      bd.append(h('div', { class: 'colstack' }, brd, checkButton('ตรวจคำตอบ', () => { const I = brd.get(); ctx.check(!!I && I.simple && I.n === n, !I ? 'ยังไม่ได้ปิดรูป — แตะจุดแรก (สีแดง) เพื่อปิดรูป' : !I.simple ? 'เส้นตัดกันอยู่ ลองวาดใหม่' : `รูปนี้มี ${I.n} ด้าน แต่${K7N(n)}ต้องมี ${n} ด้าน`); }))); } };
  }
});
const g2sortQ = (q, bins, cards, hint) => Q.ixGroup({ q, bins: bins.map(k => G2K[k] || k), items: cards.map(c => ({ label: g2pic(c, 'sm'), bin: bins.indexOf(c.kind === 'poly' ? 'poly' : c.kind), why: c.why })), hint });

/* ---------- data: teaching (not used in the games) ---------- */
const G2T_SORT = () => [g2c('box', 'slab'), g2c('rect', 'tallrect'), g2c('ball'), g2c('circle', null, { r: 16 }), g2c('box', 'cube'), g2c('rect', 'rect', { rot: 20 })];
const G2T_POLY = () => [g2c('poly', 'g2_kite5'), g2c('not', 'moon'), g2c('poly', 'g2_cross'), g2c('not', 'hook'), g2c('poly', 'g2_hex'), g2c('not', 'bean')];
const G2T_OVAL = { vb: '0 0 200 170', items: [['c', 100, 112, 44], ['c', 100, 52, 30], ['e', 88, 46, 5, 8], ['e', 112, 46, 5, 8], ['e', 40, 100, 24, 9, -30], ['e', 160, 100, 24, 9, 30]] }; // snowman: 2 circles, 4 ellipses
/* ---------- data: practice — pictures redrawn ---------- */
const G2W_1 = () => [g2c('box', 'box'), g2c('ball'), g2c('rect', 'rect'), g2c('circle'), g2c('box', 'tower'), g2c('rect', 'rect', { rot: -18 })]; // 
const G2W_2 = () => [g2c('box', 'tower'), g2c('rect', 'rect'), g2c('circle'), g2c('ball'), g2c('box', 'slab'), g2c('rect', 'square', { rot: 45 }), g2c('circle', null, { r: 14 }), g2c('box', 'cube')]; // 
const G2W_OBJ = [['ball', 'ลูกบอลชายหาด', 'ball'], ['globe', 'ลูกโลก', 'ball'], ['orange', 'ส้ม', 'ball'], ['giftbox', 'กล่องของขวัญ', 'box'], ['dice', 'ลูกเต๋า', 'box'], ['carton', 'กล่องนม', 'box'], ['tissue', 'กล่องกระดาษทิชชู', 'box']]; // 
const G2W_POLY = () => [g2c('not', 'heart'), g2c('poly', 'g2_pent'), g2c('not', 'zig'), g2c('poly', 'g2_hex'), g2c('not', 'dee'), g2c('poly', 'g2_star6'), g2c('poly', 'g2_chev'), g2c('not', 'cup'), g2c('poly', 'g2_arrow')]; // 
const G2W_NAME = ['g2_oct', 'g2_hept', 'g2_house', 'g2_bow', 'g2_non', 'g2_dec', 'g2_hex', 'g2_pent', 'g2_tshirt', 'g2_gem']; // 
const G2W_SIDES = ['g2_lshape', 'g2_arrow', 'g2_star6', 'g2_bow', 'g2_kite5', 'g2_tshirt']; // 
const G2W_MIX = { list: ['g2_pent', 'g2_hex', 'g2_oct', 'g2_hept', 'g2_hex', 'g2_pent', 'g2_oct', 'g2_hex', 'g2_hept', 'g2_pent', 'g2_hex'] }; // : 3 ห้า 4 หก 2 เจ็ด 2 แปด
const G2W_OVAL7 = () => [g2c('circle'), g2c('ellipse', 'wellipse', { rot: -30 }), g2c('ellipse', 'ellipse'), g2c('circle', null, { r: 22 }), g2c('circle', null, { r: 9 }), g2c('ellipse', 'wellipse'), g2c('ellipse', 'ellipse', { rot: 40 }), g2c('circle', null, { r: 15 })]; // 
const G2W_PICS = [
  { name: 'ดอกไม้', vb: '0 0 200 170', items: [['c', 100, 70, 16], ['e', 100, 34, 11, 20], ['e', 100, 106, 11, 20], ['e', 64, 70, 20, 11], ['e', 136, 70, 20, 11], ['e', 112, 150, 8, 14, 40]], extra: '<path d="M100 88 V168" stroke="#5BA35B" stroke-width="5"/>' }, // ข้อ 1
  { name: 'ตุ๊กตาหิมะสามตัว', vb: '0 0 240 170', items: [['c', 40, 40, 16], ['e', 40, 100, 22, 34], ['c', 120, 40, 16], ['e', 120, 100, 22, 34], ['c', 200, 40, 16], ['e', 200, 100, 22, 34], ['c', 80, 30, 9], ['c', 160, 30, 9]] }, // ข้อ 2
  { name: 'นกฮูก', vb: '0 0 220 200', items: [['c', 110, 132, 56], ['c', 110, 52, 36], ['e', 96, 46, 7, 11], ['e', 124, 46, 7, 11], ['e', 110, 64, 5, 8], ['e', 44, 128, 14, 32, 20], ['e', 176, 128, 14, 32, -20], ['c', 84, 192, 8], ['c', 136, 192, 8], ['c', 60, 26, 9], ['c', 160, 26, 9]] }]; // ข้อ 3
const G2W_PAT = [ // (สีและขนาดตามต้นฉบับโดยประมาณ)
  ['pe.pink', 'ci.coral', 'el.lilac'], ['pe.yellow', 'pe.yellow.s'], ['el.sky', 'el.coral', 'el.lilac', 'el.mint'], ['ci.mint.s', 'ci.mint.s', 'ci.mint'],
  ['hx.orange', 'ci.orange', 'pe.orange'], ['tri.sky', 'tri.pink'], ['sq.coral', 'ci.lilac', 'tri.yellow'], ['heart', 'heart', 'star'],
  ['mangoY', 'mangoG'], ['pineapple', 'pineapple.s'], ['apple', 'apple.s', 'apple.s'], ['carrot', 'carrot.s'], ['oc.sky', 'hs.coral', 'oc.sky', 'ci.yellow']];
const g2seq = (u, n = 9) => range(0, n - 1).map(i => u[i % u.length]);

/* ---------- lessons ---------- */
const L2G = (no, place, title, short, goal, teach, game) => ({ id: 1000 + no, place, title, short, tone: TONES5[(no + 2) % 6], goal, teach, game });
const G2_SB = ['ทรงสี่เหลี่ยมมุมฉาก', 'รูปสี่เหลี่ยมมุมฉาก', 'ทรงกลม', 'วงกลม'];
const LESSONS_P2C9 = [
  L2G(1, 'หาดทรงกับรูป', 'ทรงสี่เหลี่ยมมุมฉากกับรูปสี่เหลี่ยมมุมฉาก ทรงกลมกับวงกลม', 'ทรง ↔ รูป', 'จำแนกทรงสี่เหลี่ยมมุมฉากกับรูปสี่เหลี่ยมมุมฉาก และทรงกลมกับวงกลม',
    [T('ยินดีต้อนรับสู่ <b>ชายหาดรูปเรขาคณิต</b>! ทรงกับรูปเกี่ยวกันอย่างไร: แตะรูปทรงแต่ละอัน ดูว่าได้<b>รูปแบน</b>อะไร', 'ทรงกับรูปเกี่ยวกันอย่างไร แตะรูปทรงแต่ละอัน ดูว่าได้รูปแบนอะไร', el => el.append(simFlatSolid())),
     T('ลองจัดเอง: แตะรูป แล้วแตะกล่องที่ใช่', 'ลองจัดเอง แตะรูป แล้วแตะกล่องที่ใช่', el => el.append(qSim(g2sortQ('จัดรูปลงกล่อง', ['box', 'rect', 'ball', 'circle'], G2T_SORT(), 'รูปทรงดูหนา มีด้านข้าง · รูปแบนเห็นแค่ขอบรอบ'), 'จัดครบแล้ว!'))),
     T('ตัวอย่างทีละขั้น: แยกทรงกับรูป', 'ตัวอย่างทีละขั้น', p4ex([['① ดูความหนา', 'เห็นด้านบนและด้านข้าง → เป็น<b>ทรง</b> (สามมิติ)'], ['② ดูรูปแบน', 'เห็นแค่เส้นรอบรูป แบนบนกระดาษ → เป็น<b>รูป</b>'], ['③ ดูมุม', 'มีมุมฉาก 4 มุม → สี่เหลี่ยมมุมฉาก · กลมไม่มีมุม → กลม']], '<b>ทรงสี่เหลี่ยมมุมฉาก</b> มีหน้าเป็น<b>รูปสี่เหลี่ยมมุมฉาก</b> · <b>ทรงกลม</b> ผ่าครึ่งได้<b>วงกลม</b>'))],
    () => { const w1 = shuffle(G2W_1()), w2 = shuffle(G2W_2()), tk = pick(['box', 'ball']); return [...w1.slice(0, 2).map(c => Q.g2name({ c, opts: [G2K[c.kind], ...G2_SB.filter(x => x !== G2K[c.kind])] })),
      g2sortQ('จัดรูปลงกล่องให้ถูกต้อง', ['box', 'rect', 'ball', 'circle'], w2.slice(0, 6), 'รูปทรงดูหนา มีด้านข้าง · รูปแบนเห็นแค่ขอบรอบ'),
      Q.g2tapAll({ q: `แตะเลือก<span class="hl">${G2K[tk]}</span>ทุกรูป แล้วกดตรวจ`, cards: w2, ok: c => c.kind === tk, hint: tk === 'box' ? 'ทรงสี่เหลี่ยมมุมฉากดูหนา เห็นหน้าด้านบนและด้านข้าง' : 'ทรงกลมดูนูน มีแสงเงา ไม่ใช่วงกลมแบน ๆ' }),
      ...pkF(G2W_OBJ, 2).map(([e, n, k]) => Q.p4Pick({ fig: `<div class="g2big">${artHTML(e)}</div>`, q: `${n}มีลักษณะคล้ายรูปเรขาคณิตใด`, opts: [G2K[k], ...G2_SB.filter(x => x !== G2K[k])], right: G2K[k], hint: 'สิ่งของจริงมีความหนา จึงเป็น “ทรง”' }))]; }),
  L2G(2, 'หาดหลายเหลี่ยม', 'รูปหลายเหลี่ยม', 'รูปหลายเหลี่ยม', 'บอกลักษณะของรูปหลายเหลี่ยม (รูปปิด ด้านเป็นเส้นตรง) บอกชื่อ จำนวนด้านและจำนวนมุม',
    [T('<b>รูปหลายเหลี่ยม</b> = รูปปิด ทุกด้านเป็นเส้นตรง — แตะรูปแล้วแตะกล่อง', 'รูปหลายเหลี่ยม คือรูปปิด ทุกด้านเป็นเส้นตรง แตะรูปแล้วแตะกล่อง', el => el.append(qSim(g2sortQ('เป็นรูปหลายเหลี่ยมหรือไม่', ['poly', 'not'], G2T_POLY(), 'ดูว่าเป็นรูปปิดไหม และมีเส้นโค้งไหม'), 'เส้นโค้งหรือรูปไม่ปิด ไม่ใช่รูปหลายเหลี่ยม'))),
     T('เปลี่ยน<b>จำนวนด้าน</b> แล้วดูชื่อรูป — ลากจุดให้รูปบิดได้ ชื่อก็ยังเหมือนเดิม', 'เปลี่ยนจำนวนด้าน แล้วดูชื่อรูป ลากจุดให้รูปบิดได้ ชื่อก็ยังเหมือนเดิม', el => el.append(simPolyMake())),
     T('ตัวอย่างทีละขั้น: รูปนี้ชื่ออะไร', 'ตัวอย่างทีละขั้น', p4ex([['① นับด้าน', 'แตะนับรอบรูป ได้ 6 ด้าน'], ['② นับมุม', 'ได้ 6 มุม (เท่ากับจำนวนด้าน)'], ['③ ตั้งชื่อ', 'มี 6 ด้าน → รูปหกเหลี่ยม']], '<b>รูปหกเหลี่ยม</b> มี 6 ด้าน 6 มุม', '', () => h('div', { class: 'g2big', html: g2pic(g2c('poly', 'g2_chev', { p: 'mint' })) })))],
    () => { const nm = pkF(G2W_NAME, 2), sd = pkF(G2W_SIDES, 2), M = G2W_MIX.list, kind = pick([5, 6]), mixFig = `<svg viewBox="0 0 330 200" class="g2ovals">${M.map((v, i) => `<g class="g2s" transform="translate(${(i % 6) * 54 + 4} ${Math.floor(i / 6) * 96 + 6}) scale(${0.78 + (i % 3) * .06})"><path d="${shapeOutline(v)}" fill="#fff" stroke="#2B2550" stroke-width="2.2" stroke-linejoin="round" transform="rotate(${(i * 37) % 60 - 30} 32 32)"/></g>`).join('')}</svg>`;
      return [g2sortQ('จัดรูปลงกล่อง: เป็นรูปหลายเหลี่ยมหรือไม่', ['poly', 'not'], shuffle(G2W_POLY()).slice(0, 6), 'รูปหลายเหลี่ยมต้องเป็นรูปปิด และทุกด้านเป็นเส้นตรง'),
        ...nm.map(v => { const n = G2_PN(v), near = shuffle([n - 1, n + 1, n + 2].filter(k => k >= 3 && k <= 12)).slice(0, 2); return Q.g2name({ c: g2c('poly', v), q: 'รูปนี้คือรูปอะไร', opts: [K7N(n), ...near.map(K7N)], hint: 'นับจำนวนด้านรอบรูป' }); }),
        Q.g2sides({ v: sd[0], ask: 'ด้าน' }), Q.g2sides({ v: sd[1], ask: 'มุม' }),
        Q.g2count({ fig: mixFig, q: `ในภาพมี<span class="hl">${K7N(kind)}</span>กี่รูป`, a: M.filter(v => G2_PN(v) === kind).length, hint: `นับด้านของแต่ละรูป แล้วแตะรูปที่มี ${kind} ด้าน` })]; }),
  L2G(3, 'หาดกลมรี', 'วงกลมและวงรี', 'วงกลม · วงรี', 'จำแนกวงกลมและวงรี และนับวงกลม วงรีในภาพ',
    [T('ลาก<b>ปุ่มกลม</b>ยืด–หด: วงกลมมีระยะจากจุดตรงกลางถึงขอบ<b>เท่ากันทุกทิศ</b>', 'ลากปุ่มกลมยืดหด วงกลมมีระยะจากจุดตรงกลางถึงขอบเท่ากันทุกทิศ', el => el.append(simStretch())),
     T('ลองแยกเอง: แตะรูป แล้วแตะกล่อง <b>วงกลม</b> หรือ <b>วงรี</b>', 'ลองแยกเอง แตะรูป แล้วแตะกล่อง วงกลม หรือ วงรี', el => el.append(qSim(g2sortQ('จัดลงกล่อง', ['circle', 'ellipse'], [g2c('circle', null, { r: 12 }), g2c('ellipse', 'ellipse', { rot: 60 }), g2c('circle'), g2c('ellipse', 'wellipse', { rot: 15 })], 'วงกลมกลมเท่ากันทุกด้าน วงรียืดยาวด้านหนึ่ง'), 'แยกถูกทั้งหมด!'))),
     T('ตัวอย่างทีละขั้น: ตุ๊กตาหิมะมีวงกลมและวงรีกี่รูป', 'ตัวอย่างทีละขั้น', p4ex([['① วงกลม', 'ตัวและหัว → 2 รูป'], ['② วงรี', 'ตา 2 รูป + แขน 2 รูป → 4 รูป'], ['③ ตรวจ', 'รวม 6 รูป เท่ากับจำนวนชิ้นในภาพ ✓']], 'วงกลม <b>2</b> รูป · วงรี <b>4</b> รูป', '', () => h('div', { class: 'g2figw', html: g2ovalPic(G2T_OVAL) })))],
    () => { const P = shuffle(G2W_PICS); return [g2sortQ('จัดลงกล่อง: วงกลม หรือ วงรี', ['circle', 'ellipse'], shuffle(G2W_OVAL7()).slice(0, 6)),
      Q.g2tapAll({ q: 'แตะเลือก<span class="hl">วงรี</span>ทุกรูป แล้วกดตรวจ', cards: shuffle(G2W_OVAL7()), ok: c => c.kind === 'ellipse' }),
      ...P.slice(0, 2).map((p, i) => { const k = i ? 'c' : 'e'; return Q.g2count({ fig: g2ovalPic(p), q: `ภาพ${p.name}มี<span class="hl">${k === 'c' ? 'วงกลม' : 'วงรี'}</span>กี่รูป`, a: p.items.filter(x => x[0] === k).length, hint: k === 'c' ? 'วงกลมกลมเท่ากันทุกด้าน' : 'วงรียืดยาวด้านหนึ่ง' }); }),
      Q.p4Pick({ fig: g2big(g2c('ellipse', 'wellipse')), q: 'ข้อใดถูกต้องเกี่ยวกับรูปนี้', opts: ['เป็นวงรี ไม่มีด้านและไม่มีมุม', 'เป็นวงกลม ไม่มีด้านและไม่มีมุม', 'เป็นวงรี มี 4 มุม'], right: 'เป็นวงรี ไม่มีด้านและไม่มีมุม', hint: 'รูปยืดยาว → วงรี · ขอบเป็นเส้นโค้งทั้งหมด จึงไม่มีด้านและมุม' })]; }),
  L2G(4, 'หาดวาดรูป', 'การเขียนรูปหลายเหลี่ยม', 'เขียนรูปหลายเหลี่ยม', 'เขียนรูปหลายเหลี่ยมโดยต่อจุดด้วยเส้นตรง และสร้างภาพจากรูปเรขาคณิต',
    [T('แตะจุดทีละจุดให้เป็น<b>รูปปิด</b> — จำนวนจุดยอด = จำนวนด้าน', 'แตะจุดทีละจุดให้เป็นรูปปิด จำนวนจุดยอด เท่ากับ จำนวนด้าน', el => el.append(simDotDraw([5, 6]))),
     T('ตัวอย่างทีละขั้น: เขียนรูปเจ็ดเหลี่ยม', 'ตัวอย่างทีละขั้น', p4ex([['① วางจุด', 'เลือกจุด 7 จุด ไม่ให้ 3 จุดติดกันอยู่บนเส้นตรงเดียวกัน'], ['② ลากเส้นตรง', 'ต่อจุดเรียงกันไปทีละจุด เส้นไม่ตัดกัน'], ['③ ปิดรูป', 'ลากจากจุดสุดท้ายกลับไปจุดแรก'], ['④ ตรวจ', 'นับด้านได้ 7 ด้าน 7 มุม ✓']], 'ได้<b>รูปเจ็ดเหลี่ยม</b>', '', () => h('div', { class: 'g2big', html: g2pic(g2c('poly', 'g2_hept', { p: 'lilac' })) }))),
     T('สร้างภาพจากรูปเรขาคณิตชนิดต่าง ๆ — เลือกรูป ลาก หมุน วางได้ตามใจ', 'สร้างภาพจากรูปเรขาคณิตชนิดต่าง ๆ เลือกรูป ลาก หมุน วางได้ตามใจ', el => el.append(shapeCanvas()))],
    () => { const N = shuffle([5, 6, 7, 8]), v = pick(['g2_oct', 'g2_hept', 'g2_non']), n = G2_PN(v); return [...N.slice(0, 3).map(n => Q.g2draw({ n })),
      Q.g2name({ c: g2c('poly', v), q: 'รูปที่วาดนี้คือรูปอะไร', opts: [K7N(n), K7N(n - 1), K7N(n + 1)], hint: 'นับจุดยอด (หรือด้าน) รอบรูป' }),
      Q.p4Pick({ q: 'ถ้าต่อจุด 8 จุดด้วยเส้นตรงจนเป็นรูปปิด (ไม่มี 3 จุดติดกันอยู่บนเส้นตรงเดียวกัน) จะได้รูปใด', opts: ['รูปแปดเหลี่ยม', 'รูปเจ็ดเหลี่ยม', 'รูปเก้าเหลี่ยม'], right: 'รูปแปดเหลี่ยม', hint: 'จำนวนจุดยอด = จำนวนด้าน' })]; }),
  L2G(5, 'หาดแบบรูป', 'แบบรูปซ้ำของรูปเรขาคณิตและรูปอื่น ๆ', 'แบบรูปซ้ำ', 'หาชุดที่ซ้ำ บอกรูปที่หายไป และต่อแบบรูปซ้ำของรูปเรขาคณิตและรูปอื่น ๆ',
    [T('กด<b>หาชุดที่ซ้ำ</b> แล้ว<b>ต่อแบบรูป</b>', 'กดหาชุดที่ซ้ำ แล้วต่อแบบรูป', el => el.append(patternSim(g2seq(['hx.mint', 'pe.sky', 'pe.sky'], 9)))),
     T('ลองเอง: รูปใดหายไป', 'ลองเอง รูปใดหายไป', el => el.append(qSim(Q.patMissing({ seq: g2seq(['oc.coral', 'ci.yellow', 'el.mint', 'ci.yellow'], 12), blank: 6 }), 'ชุดที่ซ้ำมี 4 รูป'))),
     T('ตัวอย่างทีละขั้น: หาชุดที่ซ้ำ', 'ตัวอย่างทีละขั้น', p4ex([['① ดูรูปแรก', 'วงกลมเล็ก วงกลมเล็ก วงกลมใหญ่'], ['② ดูต่อ', 'วงกลมเล็ก วงกลมเล็ก วงกลมใหญ่ — ซ้ำเดิม!'], ['③ สรุป', 'ชุดที่ซ้ำมี 3 รูป รูปต่อไปคือวงกลมเล็ก']], 'แบบรูปซ้ำ = <b>ชุดเดิมเกิดซ้ำ ๆ</b>', '', () => patStrip(g2seq(['ci.sky.s', 'ci.sky.s', 'ci.sky'], 6))))],
    () => { const U = shuffle(G2W_PAT); return [Q.patUnit({ seq: g2seq(U[0], U[0].length * 3) }), ...U.slice(1, 4).map(u => { const s = g2seq(u, Math.max(9, u.length * 3)); return Q.patMissing({ seq: s, blank: rnd(u.length, s.length - 1) }); }),
      Q.patMake({ unit: U[4], reps: 1, show: 2 }), Q.patMake({ unit: U[5], reps: 1, show: 2 })]; })
];

/* ---------- boss: built from our own practice items (no official test supplied) — d6spread ---------- */
const g2xFig = c => `<div class="g2big">${g2pic(c)}</div>`;
const EXAM_P2C9 = d6spread([
  { q: 'รูปนี้คือรูปเรขาคณิตใด', fig: g2xFig(g2c('box', 'box', { p: 'sky' })), opts: ['ทรงสี่เหลี่ยมมุมฉาก', 'รูปสี่เหลี่ยมมุมฉาก', 'ทรงกลม', 'วงกลม'], a: 0 },
  { q: 'รูปนี้คือรูปเรขาคณิตใด', fig: g2xFig(g2c('circle', null, { p: 'coral' })), opts: ['วงกลม', 'ทรงกลม', 'วงรี', 'รูปสี่เหลี่ยมมุมฉาก'], a: 0 },
  { q: 'รูปนี้คือรูปเรขาคณิตใด', fig: g2xFig(g2c('ball', null, { p: 'mint' })), opts: ['ทรงกลม', 'วงกลม', 'วงรี', 'ทรงสี่เหลี่ยมมุมฉาก'], a: 0 },
  { q: 'รูปนี้คือรูปเรขาคณิตใด', fig: g2xFig(g2c('rect', 'rect', { p: 'yellow' })), opts: ['รูปสี่เหลี่ยมมุมฉาก', 'ทรงสี่เหลี่ยมมุมฉาก', 'รูปห้าเหลี่ยม', 'วงรี'], a: 0 },
  { q: 'ลูกบอลชายหาดมีลักษณะคล้ายรูปเรขาคณิตใด', fig: `<div class="g2big">${artHTML('ball')}</div>`, opts: ['ทรงกลม', 'วงกลม', 'วงรี', 'ทรงสี่เหลี่ยมมุมฉาก'], a: 0 },
  { q: 'กล่องของขวัญมีลักษณะคล้ายรูปเรขาคณิตใด', fig: `<div class="g2big">${artHTML('giftbox')}</div>`, opts: ['ทรงสี่เหลี่ยมมุมฉาก', 'รูปสี่เหลี่ยมมุมฉาก', 'ทรงกลม', 'วงกลม'], a: 0 },
  { q: 'รูปนี้คือรูปอะไร', fig: g2xFig(g2c('poly', 'g2_hex', { p: 'lilac' })), opts: ['รูปหกเหลี่ยม', 'รูปห้าเหลี่ยม', 'รูปเจ็ดเหลี่ยม', 'รูปแปดเหลี่ยม'], a: 0 },
  { q: 'รูปนี้คือรูปอะไร', fig: g2xFig(g2c('poly', 'g2_oct', { p: 'pink' })), opts: ['รูปแปดเหลี่ยม', 'รูปหกเหลี่ยม', 'รูปเจ็ดเหลี่ยม', 'รูปเก้าเหลี่ยม'], a: 0 },
  { q: 'รูปนี้คือรูปอะไร', fig: g2xFig(g2c('poly', 'g2_house', { p: 'yellow' })), opts: ['รูปห้าเหลี่ยม', 'รูปสี่เหลี่ยม', 'รูปหกเหลี่ยม', 'รูปสามเหลี่ยม'], a: 0 },
  { q: 'รูปนี้คือรูปอะไร', fig: g2xFig(g2c('poly', 'g2_arrow', { p: 'sky' })), opts: ['รูปเจ็ดเหลี่ยม', 'รูปหกเหลี่ยม', 'รูปห้าเหลี่ยม', 'รูปแปดเหลี่ยม'], a: 0 },
  { q: 'ข้อใด<b>ไม่ใช่</b>รูปหลายเหลี่ยม', opts: [{ html: g2pic(g2c('not', 'heart', { p: 'pink' }), 'opt'), say: 'รูปหัวใจ' }, { html: g2pic(g2c('poly', 'g2_pent', { p: 'pink' }), 'opt'), say: 'รูปห้าเหลี่ยม' }, { html: g2pic(g2c('poly', 'g2_lshape', { p: 'pink' }), 'opt'), say: 'รูปหกเหลี่ยม' }, { html: g2pic(g2c('poly', 'g2_gem', { p: 'pink' }), 'opt'), say: 'รูปห้าเหลี่ยม' }], a: 0 },
  { q: 'รูปหกเหลี่ยมมีกี่ด้าน', opts: ['6 ด้าน', '5 ด้าน', '7 ด้าน', '8 ด้าน'], a: 0 },
  { q: 'รูปแปดเหลี่ยมมีกี่มุม', opts: ['8 มุม', '6 มุม', '7 มุม', '10 มุม'], a: 0 },
  { q: 'รูปนี้คือรูปเรขาคณิตใด', fig: g2xFig(g2c('ellipse', 'wellipse', { p: 'orange' })), opts: ['วงรี', 'วงกลม', 'ทรงกลม', 'รูปหกเหลี่ยม'], a: 0 },
  { q: 'ภาพดอกไม้นี้มีวงรีกี่รูป', fig: `<div class="g2figw">${g2ovalPic(G2W_PICS[0])}</div>`, opts: ['5 รูป', '4 รูป', '6 รูป', '1 รูป'], a: 0 },
  { q: 'ข้อใดถูกต้อง', opts: ['วงกลมและวงรีไม่มีด้านและไม่มีมุม', 'วงรีมี 4 มุม', 'วงกลมมี 1 ด้าน', 'รูปหกเหลี่ยมมี 5 ด้าน'], a: 0 },
  { q: 'ถ้าต่อจุด 7 จุดด้วยเส้นตรงจนเป็นรูปปิด (ไม่มี 3 จุดติดกันอยู่บนเส้นตรงเดียวกัน) จะได้รูปใด', opts: ['รูปเจ็ดเหลี่ยม', 'รูปหกเหลี่ยม', 'รูปแปดเหลี่ยม', 'วงกลม'], a: 0 },
  { q: 'รูปใดหายไปจากแบบรูปซ้ำนี้', fig: `<div class="g2pat">${patStrip(g2seq(G2W_PAT[0], 9), { blank: [8] }).outerHTML}</div>`, opts: [{ html: tokEl('el.lilac').outerHTML, say: 'วงรีสีม่วง' }, { html: tokEl('pe.pink').outerHTML, say: 'รูปห้าเหลี่ยมสีชมพู' }, { html: tokEl('ci.coral').outerHTML, say: 'วงกลมสีแดง' }], a: 0 },
  { q: 'รูปใดหายไปจากแบบรูปซ้ำนี้', fig: `<div class="g2pat">${patStrip(g2seq(G2W_PAT[1], 8), { blank: [5] }).outerHTML}</div>`, opts: [{ html: tokEl('pe.yellow.s').outerHTML, say: 'รูปห้าเหลี่ยมเล็ก' }, { html: tokEl('pe.yellow').outerHTML, say: 'รูปห้าเหลี่ยมใหญ่' }, { html: tokEl('ci.yellow').outerHTML, say: 'วงกลม' }], a: 0 },
  { q: 'แบบรูปซ้ำนี้ ชุดที่ซ้ำมีกี่รูป', fig: `<div class="g2pat">${patStrip(g2seq(G2W_PAT[2], 8)).outerHTML}</div>`, opts: ['4 รูป', '2 รูป', '3 รูป', '8 รูป'], a: 0 }]);
LESSONS_P2C9.push({ id: 1019, boss: true, place: 'อ่าวรูปทรง', title: 'ด่านบอส: บทที่ 9 รูปเรขาคณิต', short: 'ด่านบอส · ข้อสอบ', tone: 'lilac',
  goal: 'คำถามท้ายบท 20 ข้อ (ทรงกับรูป รูปหลายเหลี่ยม วงกลม วงรี และแบบรูปซ้ำ) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P2C9, pass: 10, bossName: 'ปีศาจปลาหมึกรูปทรง', bossPal: 'lilac', emblem: '⬟', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกรูปทรงแล้ว! รู้จักรูปเรขาคณิตครบเลย', loseLine: 'ปีศาจปลาหมึกยังจำรูปทรงได้ดีกว่า สู้ใหม่นะ!' });
