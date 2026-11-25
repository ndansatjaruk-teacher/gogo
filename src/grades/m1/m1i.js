/* =========================================================
   ม.1 บทที่ 1 จำนวนเต็ม (โลกแม่น้ำ · เมือง 90 · ด่าน 2001–2015 · บอสจระเข้ 2019)
   1 คลิปของ สสวท. = 1 ด่าน (ชื่อด่าน = ชื่อคลิป) · เนื้อหาและโจทย์แต่งใหม่ทั้งหมด
   integer kit: signed keypad, number line (drag / tap / hops), chips with zero pairs, groups, sea-level scale. Prefix mi.
   ========================================================= */
const miN = n => (n < 0 ? '−' + (-n).toLocaleString('en-US', { maximumFractionDigits: 10 }) : n.toLocaleString('en-US', { maximumFractionDigits: 10 })); /* v247: เดิมปัดเหลือทศนิยม 3 ตำแหน่ง → เฉลย 0.0046 แสดงเป็น 0.005 */
const miP = n => (n < 0 ? `(${miN(n)})` : miN(n));
/* v217 (ผู้ใช้ขอ: ให้มีสีสัน): จำนวนลบสีแดง จำนวนบวกสีฟ้า ศูนย์สีเข้ม — สีเดียวกับเส้นจำนวน */
const miC = n => `<span class="num">${miN(n)}</span>`; /* v219 (ผู้ใช้ขอ): ตัวเลข ม.1 สีดำทั้งหมด */
/* speech: read signs and operators the Thai way */
const miSay = t => String(t).replace(/<[^>]+>/g, ' ').replace(/\|([^|]+)\|/g, ' ค่าสัมบูรณ์ของ $1 ').replace(/[()[\]]/g, ' ').replace(/−/g, ' ลบ ').replace(/×/g, ' คูณ ').replace(/÷/g, ' หาร ').replace(/\+/g, ' บวก ')
  .replace(/=/g, ' เท่ากับ ').replace(/[☐□]/g, ' ช่องว่าง ').replace(/°C/g, ' องศาเซลเซียส').replace(/</g, ' น้อยกว่า ').replace(/>/g, ' มากกว่า ').replace(/\s+/g, ' ').trim();
/* evaluate an expression written with − × ÷ and (−n) — exact integers only */
const miEval = s => { const js = String(s).replace(/,/g, '').replace(/\|([^|]+)\|/g, 'Math.abs($1)').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/\[/g, '(').replace(/\]/g, ')'); /* eslint-disable-next-line no-new-func */ return Function('return (' + js + ')')(); };
const miX = s => `<span class="mi-x num">${String(s).replace(/([+×÷=])/g, ' <b class="mi-op">$1</b> ').replace(/ − /g, ' <b class="mi-op">−</b> ')}</span>`;
const MI_NM = ['ภูผา', 'น้ำใส', 'ต้นกล้า', 'ใบเตย', 'ก้องภพ', 'ปลายฟ้า', 'ธารา', 'แพรวา', 'ภาคิน', 'ขวัญข้าว'];

/* ---------- ม.ต้น answer keypad (v215, ผู้ใช้ขอ): แป้นมีปุ่ม − / . ในแป้นเลย (ไม่มีปุ่ม − หน้าช่องคำตอบ)
   รับ จำนวนเต็ม (−12) · ทศนิยม (−0.75) · เศษส่วน (3/4, −5/8) — ตรวจด้วยค่าของจำนวน ---------- */
const MI_FMT = /^−?\d+(\.\d+)?$|^−?\d+\/\d+$/;
const miVal = t => { const neg = t[0] === '−', b = neg ? t.slice(1) : t, v = b.includes('/') ? (([n, d]) => +d ? +n / +d : NaN)(b.split('/')) : +b; return neg ? -v : v; };
const miShow = t => t.replace(/^(−?)(\d+)/, (_, s, d) => s + (+d).toLocaleString('en-US'));
/* pointer → svg user coords (same matrix the drawing uses; zoomfix keeps it right on Safari) */
const miSvgPt = (svg, ev) => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = ev.clientX; q.y = ev.clientY; const r = q.matrixTransform(m.inverse()); return [r.x, r.y]; };
function miAns(ctx, expected, o = {}) {
  const want = typeof expected === 'number' ? expected : miVal(String(expected).replace(/-/g, '−')), wantTxt = typeof expected === 'number' ? miN(expected) : String(expected).replace(/-/g, '−');
  let val = '';
  const slot = h('div', { class: 'ans-slot num' }, '?'), msg = h('div', { class: 'pad-msg' });
  const show = () => { slot.textContent = val === '' ? '?' : miShow(val); slot.classList.toggle('filled', val !== ''); };
  const put = k => { msg.textContent = '';
    if (k === '−') { if (val === '') val = '−'; else if (val === '−') val = ''; else { msg.textContent = 'กด − ก่อนตัวเลข (จำนวนลบ)'; return; } }
    else if (k === '.') { const part = val.split('/').pop(); if (!/\d$/.test(val) || part.includes('.')) { msg.textContent = 'ใส่ . หลังตัวเลข และใส่ได้ครั้งเดียว'; return; } val += '.'; }
    else if (k === '/') { if (!/\d$/.test(val) || val.includes('/') || val.includes('.')) { msg.textContent = 'เศษส่วน: ใส่ตัวเศษ แล้วกด / แล้วใส่ตัวส่วน'; return; } val += '/'; }
    else { if (val.replace(/\D/g, '').length >= 7) return; val += k; }
    sfx.tap(); show(); };
  const submit = () => { if (wrap.classList.contains('done')) return; if (val === '') { msg.textContent = 'กดตัวเลขก่อนนะ'; return; }
    if (!MI_FMT.test(val)) { msg.textContent = 'ตัวเลขยังไม่ครบ (เช่น 3/4 หรือ 0.5)'; return; }
    const v = miVal(val), ok = Math.abs(v - want) < 1e-9; msg.textContent = '';
    if (ok) wrap.classList.add('done');
    const why = !ok && Math.abs(Math.abs(v) - Math.abs(want)) < 1e-9 && v !== 0 ? `ตัวเลขถูกแล้ว แต่<b>เครื่องหมาย</b>ยังไม่ถูก${o.hint ? ' — ' + o.hint : ''}` : o.hint;
    ctx.check(ok, why); if (!ok && !wrap.classList.contains('revealed')) { val = ''; show(); } };
  const key = (lab, k, cls = '') => h('button', { class: 'btn ' + cls, 'aria-label': k === '−' ? 'เครื่องหมายลบ' : k === '/' ? 'เศษส่วน' : k === '.' ? 'จุดทศนิยม' : String(lab), onclick: e => { e.stopPropagation(); put(k); } }, lab);
  const kp = h('div', { class: 'keypad mi-kp' },
    key(1, '1'), key(2, '2'), key(3, '3'), h('button', { class: 'btn', 'aria-label': 'ลบตัวเลข', onclick: e => { e.stopPropagation(); sfx.tap(); val = val.slice(0, -1); msg.textContent = ''; show(); } }, icon('left')),
    key(4, '4'), key(5, '5'), key(6, '6'), key('−', '−', 'sym'),
    key(7, '7'), key(8, '8'), key(9, '9'), key('/', '/', 'sym'),
    key('.', '.', 'sym'), key(0, '0'), h('button', { class: 'btn primary ok2', 'aria-label': 'ส่งคำตอบ', onclick: e => { e.stopPropagation(); submit(); } }, icon('check')));
  const wrap = h('div', { class: 'ans ia mi-ans' }, h('div', { class: 'mi-ansrow' }, slot, o.unit ? h('span', { class: 'cap mi-unit' }, o.unit) : null), kp, msg);
  wrap.reveal = () => { val = wantTxt.replace(/,/g, ''); show(); wrap.classList.add('done', 'revealed'); };
  wrap.ansText = wantTxt;
  return wrap;
}

/* ---------- number line (svg): ticks lo…hi, negative side coral, positive side sky ---------- */
function miLine(lo, hi, o = {}) {
  const W = 760, pad = 30, H = o.h || 96, y0 = o.y || 54, n = hi - lo, st = (W - 2 * pad) / n, X = v => pad + (v - lo) * st, every = n > 24 ? 5 : n > 16 ? 2 : 1;
  let s = `<path d="M${pad - 22} ${y0} H${W - pad + 22}" stroke="#2B2550" stroke-width="2.6"/><path d="M${pad - 22} ${y0} l10 -6 v12 z M${W - pad + 22} ${y0} l-10 -6 v12 z" fill="#2B2550"/>`;
  for (let v = lo; v <= hi; v++) { const x = X(v), big = v % every === 0, c = '#2B2550';
    s += `<path d="M${x} ${y0 - (big ? 9 : 5)} V${y0 + (big ? 9 : 5)}" stroke="${c}" stroke-width="${v === 0 ? 3 : 2}"/>`;
    if (big && !(o.hideLabels || []).includes(v)) s += `<text x="${x}" y="${y0 + 36}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="${v === 0 ? 900 : 800}" font-size="${n > 20 ? 20 : 23}" fill="${c}">${miN(v)}</text>`; }
  const el = h('div', { class: 'mi-nl qsig-skip' + (o.tap || o.drag ? ' ia' : '') + (o.drag ? ' drag' : ''), html: `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><g class="mi-hi"></g>${s}<g class="mi-lay"></g></svg>` });
  const svg = el.firstChild, lay = svg.querySelector('.mi-lay'), hiL = svg.querySelector('.mi-hi');
  Object.assign(el, { X, lo, hi, y0, lay,
    add: (str, back) => { (back ? hiL : lay).insertAdjacentHTML('beforeend', str); },
    clear: () => { lay.innerHTML = ''; hiL.innerHTML = ''; },
    dot: (v, col = '#FF7B86', lab, cls = '') => lay.insertAdjacentHTML('beforeend', `<g class="mi-dot ${cls}"><circle cx="${X(v)}" cy="${y0}" r="10" fill="${col}" stroke="#fff" stroke-width="3"/>${lab ? `<text x="${X(v)}" y="${y0 - 18}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="22" fill="#2B2550">${lab}</text>` : ''}</g>`),
    arc: (a, b, col = '#F5A742', lab) => { const xa = X(a), xb = X(b), mx = (xa + xb) / 2, hgt = Math.min(46, 16 + Math.abs(xb - xa) * .25), d = xb > xa ? -1 : 1;
      lay.insertAdjacentHTML('beforeend', `<g class="mi-arc"><path d="M${xa} ${y0 - 4} Q${mx} ${y0 - 4 - hgt * 2} ${xb} ${y0 - 4}" fill="none" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/><path d="M${xb} ${y0 - 4} l${d * 9} -6 l${d * 2} 10 z" fill="${col}"/>${lab ? `<text x="${mx}" y="${y0 - 10 - hgt}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="18" fill="#2B2550">${lab}</text>` : ''}</g>`); },
    span: (a, b, col = '#4FD1A1', lab) => { const xa = X(Math.min(a, b)), xb = X(Math.max(a, b)), yy = y0 + 44;
      lay.insertAdjacentHTML('beforeend', `<g class="mi-span"><path d="M${xa} ${yy - 6} V${yy} H${xb} V${yy - 6}" fill="none" stroke="${col}" stroke-width="3"/>${lab ? `<text x="${(xa + xb) / 2}" y="${yy + 20}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="19" fill="#2B2550">${lab}</text>` : ''}</g>`); } });
  const at = ev => { const x = miSvgPt(svg, ev)[0]; return Math.max(lo, Math.min(hi, Math.round((x - pad) / st + lo))); }; /* v242: พิกัดผ่าน CTM — รูปที่ถูกย่อแบบเว้นขอบ (letterbox) ก็ยังตรงนิ้ว */
  if (o.tap) svg.addEventListener('click', ev => { ev.stopPropagation(); o.tap(at(ev), el); });
  if (o.drag) { let down = false; svg.addEventListener('pointerdown', ev => { down = true; svg.setPointerCapture && svg.setPointerCapture(ev.pointerId); o.drag(at(ev), el, true); });
    svg.addEventListener('pointermove', ev => { if (down) o.drag(at(ev), el, false); }); const up = () => { if (down) { down = false; o.end && o.end(el); } }; svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up); svg.addEventListener('click', ev => ev.stopPropagation()); }
  return el;
}
const miType = n => (Number.isInteger(n) ? (n > 0 ? 'จำนวนเต็มบวก' : n < 0 ? 'จำนวนเต็มลบ' : 'ศูนย์') : 'ไม่เป็นจำนวนเต็ม');

/* ---------- chips: yellow + and coral − ; a + chip with a − chip is a zero pair ---------- */
const miChip = (s, cls = '') => h('button', { class: 'mi-chip ' + (s > 0 ? 'p' : 'm') + ' ' + cls, 'aria-label': s > 0 ? 'ชิปบวก' : 'ชิปลบ', 'data-s': s }, s > 0 ? '+' : '−');

/* =========================================================
   TEACH SIMS — every one calls teachDone() when the child has done the key action
   ========================================================= */
/* sea level: drag the bird / fish above and below the river surface */
function miSeaSim() {
  const H = 300, top = 20, lvl = 10, U = (H - 2 * top) / 20, Y = v => top + (lvl - v) * U; let v = 6; const seen = new Set();
  const out = fNote2();
  const svgF = () => { let s = `<rect x="0" y="0" width="420" height="${Y(0)}" fill="#E4F4FD"/><rect x="0" y="${Y(0)}" width="420" height="${H - Y(0)}" fill="#7FCCEE"/><path d="M0 ${Y(0)} q30 -6 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#fff" stroke-width="3"/>`;
    for (let k = -10; k <= 10; k++) { const y = Y(k); s += `<path d="M60 ${y} H${k % 5 === 0 ? 80 : 72}" stroke="#2B2550" stroke-width="${k === 0 ? 3 : 1.6}"/>`; if (k % 2 === 0) s += `<text x="52" y="${y + 5}" text-anchor="end" font-family="Nunito,sans-serif" font-weight="800" font-size="15" fill="#2B2550">${miN(k)}</text>`; }
    s += `<path d="M66 ${Y(10)} V${Y(-10)}" stroke="#2B2550" stroke-width="2"/><text x="400" y="${Y(0) - 8}" text-anchor="end" font-size="14" font-weight="700" fill="#1E5A7A">ระดับน้ำ = 0</text>`;
    const who = v >= 0 ? `<g transform="translate(232 ${Y(v) - 34}) scale(1.1)">${SCENERY.duck}</g>` : `<g transform="translate(240 ${Y(v) - 30}) scale(.9)">${ART.fish}</g>`;
    s += `<path d="M90 ${Y(v)} H250" stroke="#F5A742" stroke-width="2.4" stroke-dasharray="6 5"/><circle cx="66" cy="${Y(v)}" r="8" fill="#F5A742" stroke="#fff" stroke-width="2.5"/>${who}`;
    return `<svg viewBox="0 0 420 ${H}" class="mi-sea" aria-hidden="true">${s}</svg>`; };
  const box = h('div', { class: 'mi-seabox ia drag' }); const draw = () => { box.innerHTML = svgF();
    out.innerHTML = v > 0 ? `อยู่<b>เหนือ</b>ระดับน้ำ ${v} เมตร → <b class="mi-pos">${miN(v)}</b> (จำนวนเต็มบวก)` : v < 0 ? `อยู่<b>ใต้</b>ระดับน้ำ ${-v} เมตร → <b class="mi-neg">${miN(v)}</b> (จำนวนเต็มลบ)` : `อยู่<b>ที่</b>ระดับน้ำพอดี → <b>0</b> (ศูนย์)`;
    seen.add(Math.sign(v)); if (seen.size === 3) { out.innerHTML += ' ✓'; teachDone(box); } };
  const at = ev => { const y = miSvgPt(box.firstChild, ev)[1]; return Math.max(-10, Math.min(10, Math.round(lvl - (y - top) / U))); };
  let down = false; box.addEventListener('pointerdown', ev => { down = true; box.setPointerCapture && box.setPointerCapture(ev.pointerId); const n = at(ev); if (n !== v) { v = n; sfx.pop(Math.abs(v) % 8); draw(); } });
  box.addEventListener('pointermove', ev => { if (!down) return; const n = at(ev); if (n !== v) { v = n; draw(); } });
  box.addEventListener('pointerup', () => { if (down) { down = false; say(v > 0 ? `เหนือระดับน้ำ ${v} เมตร บวก ${v}` : v < 0 ? `ใต้ระดับน้ำ ${-v} เมตร ลบ ${-v}` : 'ศูนย์ ระดับน้ำพอดี', true); } });
  box.addEventListener('click', e => e.stopPropagation()); draw();
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, 'ลากขึ้น–ลงบนภาพ: ลองให้ไปอยู่เหนือน้ำ ใต้น้ำ และที่ระดับน้ำพอดี'), box, out);
}
/* tap points on the number line: positive / negative / zero */
function miTypeSim() {
  const out = fNote(), seen = new Set(); let el;
  el = miLine(-6, 6, { tap: v => { el.clear(); el.dot(v, v < 0 ? '#E5505E' : v > 0 ? '#2F86C2' : '#2B2550', miN(v)); sfx.pop(Math.abs(v)); seen.add(Math.sign(v));
    out.innerHTML = `<b class="${v < 0 ? 'mi-neg' : v > 0 ? 'mi-pos' : ''}">${miN(v)}</b> เป็น<b>${miType(v)}</b>` + (v < 0 ? ' — อยู่ทางซ้ายของ 0' : v > 0 ? ' — อยู่ทางขวาของ 0 (คือจำนวนนับ)' : ' — ไม่เป็นทั้งบวกและลบ');
    say(miSay(out.textContent), true); if (seen.size === 3) teachDone(el); } });
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, 'แตะจุดบนเส้นจำนวน — ลองแตะจำนวนบวก จำนวนลบ และศูนย์'), el, out);
}
/* compare: tap two numbers, the one on the right is greater */
function miCmpSim() {
  const out = fNote(); let pick = [], done = 0, neg2 = false, el;
  el = miLine(-10, 10, { tap: v => { if (pick.length === 2) { pick = []; el.clear(); } if (pick.includes(v)) return; pick.push(v); el.dot(v, pick.length === 1 ? '#F5A742' : '#7C5CE0', miN(v)); sfx.pop(pick.length + 2);
    if (pick.length === 2) { const [a, b] = pick, lo = Math.min(a, b), hi = Math.max(a, b); done++; if (a < 0 && b < 0) neg2 = true;
      out.innerHTML = `${miN(lo)} อยู่ทาง<b>ซ้าย</b>ของ ${miN(hi)} → <b>${miN(lo)} &lt; ${miN(hi)}</b>`; say(`${miSay(miN(lo))} น้อยกว่า ${miSay(miN(hi))}`, true);
      if (done >= 3 && neg2) teachDone(el); else if (done >= 3) out.innerHTML += '<div class="cap">ลองเทียบจำนวนลบ 2 จำนวนดูบ้าง</div>'; } else out.textContent = 'แตะอีก 1 จำนวน'; } });
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, 'แตะ 2 จำนวนบนเส้นจำนวน แล้วดูว่าจำนวนใดมากกว่า (ลอง 3 ครั้ง — มีคู่จำนวนลบด้วย)'), el, out);
}
/* ordering on the river path: tap the cards from least to greatest (v217) */
function miOrderSim(nums) {
  const sorted = [...nums].sort((x, y) => x - y), sh = nums.slice(), out = fNote();
  const board = cvnBoard({ cards: sh.map(miC), horiz: true, fits: (k, i) => sh[k] === sorted[i],
    onDone: ok => { if (!ok) { out.innerHTML = 'ยังไม่ใช่ — หาจำนวนที่<b>น้อยที่สุด</b>ที่ยังเหลือ (จำนวนลบที่ตัวเลขมากกว่ามีค่าน้อยกว่า)'; return; }
      out.innerHTML = `จำนวนลบก่อน → ศูนย์ → จำนวนบวก<br><b>${sorted.map(miC).join(' , ')}</b>`; say(miSay('เรียงได้ ' + sorted.map(miN).join(' ')), true); teachDone(board); } });
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'dir' }, 'น้อย', h('span', { class: 'ar' }), 'มาก'), board, out);
}
/* opposite and absolute value: drag the point, its mirror and its distance from 0 follow */
function miOppSim() {
  const out = fNote2(), seen = new Set(); let el, v = 4;
  const draw = () => { el.clear(); if (v !== 0) { el.dot(-v, '#B8AEDB', miN(-v)); el.span(0, v, '#4FD1A1', `ห่างจาก 0 = ${Math.abs(v)}`); }
    el.dot(v, v < 0 ? '#E5505E' : '#2F86C2', miN(v));
    out.innerHTML = v === 0 ? 'จำนวนตรงข้ามของ 0 คือ 0<br>|0| = 0' : `จำนวนตรงข้ามของ <b>${miN(v)}</b> คือ <b>${miN(-v)}</b> (ห่างจาก 0 เท่ากัน คนละข้าง)<br>ค่าสัมบูรณ์ <b>|${miN(v)}| = ${Math.abs(v)}</b>`; };
  el = miLine(-8, 8, { h: 130, drag: (n, _, first) => { if (n !== v || first) { v = n; draw(); if (v) seen.add(v); } }, end: () => { sfx.pop(Math.abs(v)); say(miSay(out.textContent), true); if (seen.size >= 3 && [...seen].some(x => x < 0)) teachDone(el); } });
  draw(); return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, 'ลากบนเส้นจำนวนไปที่จำนวนต่าง ๆ (ลองทั้งจำนวนบวกและจำนวนลบ อย่างน้อย 3 จำนวน)'), el, out);
}
/* addition by hopping: start at a, tap the next tick b times (right for +, left for −) */
function miHopBoard(a, b, onDone, o = {}) {
  const c = a + b, lo = Math.min(-2, a, c) - 1, hi = Math.max(2, a, c) + 1; let cur = a, k = 0, el; const dir = Math.sign(b);
  const cap = h('div', { class: 'cap' }, b === 0 ? 'บวกด้วย 0 ไม่ต้องกระโดด' : `เริ่มที่ ${miN(a)} แล้วแตะจุดถัดไปทาง${dir > 0 ? '<b>ขวา</b>' : '<b>ซ้าย</b>'}ทีละ 1 ช่อง ${Math.abs(b)} ครั้ง`);
  cap.innerHTML = cap.textContent.replace('ขวา', '<b>ขวา</b>').replace('ซ้าย', '<b>ซ้าย</b>');
  el = miLine(lo, hi, { tap: v => { if (k >= Math.abs(b)) return; if (v !== cur + dir) { sfx.no(); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); if (o.miss) o.miss(); return; }
    el.arc(cur, v, '#F5A742', k + 1); cur = v; k++; sfx.pop(k); if (k === Math.abs(b)) { el.dot(cur, '#7C5CE0', miN(cur)); onDone(cur, el); } } });
  el.dot(a, '#F5A742', miN(a));
  if (b === 0) setTimeout(() => onDone(a, el), 0);
  return h('div', { class: 'colstack' }, cap, el);
}
function miHopSim(list) {
  const box = h('div', { class: 'colstack' }), out = fNote(); let i = 0;
  const run = () => { const [a, b] = list[i]; box.replaceChildren(h('div', { class: 'fbig', html: miX(`${miP(a)} + ${miP(b)} = ?`) }), miHopBoard(a, b, (c, el) => {
    out.innerHTML = `${miP(a)} + ${miP(b)} = <b>${miN(c)}</b>`; say(miSay(`${miP(a)} + ${miP(b)} = ${miN(c)}`), true);
    i++; if (i < list.length) setTimeout(() => { out.innerHTML = ''; run(); }, 1600); else teachDone(box); }), out); };
  run(); return h('div', { class: 'colstack no-side' }, h6wait(), box); /* v221 no-side: กล่องถูกวาดใหม่ทุกรอบ ห้ามย้ายคำอธิบายไปด้านข้าง */
}
/* v222: ตัวอย่าง 2 ข้อเทียบกันเป็น 2 คอลัมน์ แตะ "ขั้นต่อไป" แล้วทั้งสองฝั่งขึ้นขั้นพร้อมกัน · steps = [[ป้าย, ซ้าย, ขวา], …] */
function miTwoWalk(L, R, steps, endHTML, sayEnd) {
  const col = ([head, kind]) => h('div', { class: 'mi-scol' }, h('div', { class: 'mi-shead num', html: miX(head) }), kind ? h('small', { class: 'mi-skind', html: kind }) : '');
  const P = col(L), N = col(R), out = fNote(); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, l, r] = steps[k];
    P.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: l }))); N.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: r }))); sfx.pop(k); k++;
    if (k >= steps.length) { btn.remove(); out.innerHTML = endHTML || ''; sfx.ok(); if (sayEnd) say(sayEnd, true); teachDone(out); } } }, icon('right'), 'ขั้นต่อไป');
  return h('div', { class: 'colstack no-side' }, h6wait(), h('div', { class: 'mi-two' }, P, N), btn, out);
}
/* v220 (ผู้ใช้ขอ): บวกเครื่องหมายเหมือนกัน — สอนคู่บวกกับคู่ลบเทียบกัน ใช้หลักเดียวกัน 3 ขั้น */
function miSameSim(a, b) {
  const col = (x, y, kind) => { const c = h('div', { class: 'mi-scol' }, h('div', { class: 'mi-shead num', html: miX(`${miP(x)} + ${miP(y)}`) }), h('small', { class: 'mi-skind' }, kind)); return c; };
  const P = col(a, b, 'บวกทั้งคู่'), N = col(-a, -b, 'ลบทั้งคู่'), out = fNote(); let k = 0;
  const steps = [['① ดูเครื่องหมาย', `บวกทั้งคู่ → <b>เหมือนกัน</b>`, `ลบทั้งคู่ → <b>เหมือนกัน</b>`],
    ['② บวกค่าสัมบูรณ์', `${a} + ${b} = <b>${a + b}</b>`, `|${miN(-a)}| + |${miN(-b)}| = ${a} + ${b} = <b>${a + b}</b>`],
    ['③ ใส่เครื่องหมายเดิม', `บวก → <b class="mi-big">${a + b}</b>`, `ลบ → <b class="mi-big">${miN(-a - b)}</b>`]];
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, p, n] = steps[k];
    P.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: p }))); N.append(h('div', { class: 'fst-row' }, h('b', null, lab), h('span', { html: n }))); sfx.pop(k); k++;
    if (k >= steps.length) { btn.remove(); out.innerHTML = `ขั้นตอน<b>เหมือนกันทุกขั้น</b> ต่างกันแค่เครื่องหมายที่ใส่กลับ (บวก → ผลเป็นบวก, ลบ → ผลเป็นลบ)`; sfx.ok();
      say(`ใช้หลักเดียวกัน บวกค่าสัมบูรณ์แล้วใส่เครื่องหมายเดิม ${miSay(`${a} + ${b} = ${a + b}`)} และ ${miSay(`${miP(-a)} + ${miP(-b)} = ${miN(-a - b)}`)}`, true); teachDone(btn.parentNode || out); } } }, icon('right'), 'ขั้นต่อไป');
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'mi-two' }, P, N), btn, out);
}
/* v220: ลองทำเอง — บวกจำนวนเต็มลบสองจำนวน เลือกคำตอบทีละขั้น */
function miSameTry(list) {
  const box = h('div', { class: 'colstack' }), wrap = h('div', { class: 'colstack no-side' }, h6wait(), box); let i = 0;
  const run = () => { const [a, b] = list[i], A = -a, B = -b, S = A + B, rows = h('div', { class: 'colstack fstory' }), ask = h('div', { class: 'cap' }), opts = h('div', { class: 'opts mi-tryopts' }), out = fNote(); let k = 0;
    const qs = [{ q: 'เครื่องหมายของสองจำนวนนี้เป็นอย่างไร', ok: 'เหมือนกัน', bad: ['ต่างกัน'], lab: '① ดูเครื่องหมาย', row: 'ลบทั้งคู่ → <b>เหมือนกัน</b>', hint: `${miN(a)} และ ${miN(b)} มีเครื่องหมายลบทั้งคู่` },
      { q: `บวกค่าสัมบูรณ์ |${miN(a)}| + |${miN(b)}| ได้เท่าไร`, ok: String(S), bad: [String(A - B), miN(-S)], lab: '② บวกค่าสัมบูรณ์', row: `${A} + ${B} = <b>${S}</b>`, hint: `|${miN(a)}| = ${A} และ |${miN(b)}| = ${B} แล้วนำมา<b>บวก</b>กัน` },
      { q: 'ใส่เครื่องหมายเดิม ผลบวกคือเท่าไร', ok: miN(-S), bad: [String(S)], lab: '③ ใส่เครื่องหมายเดิม', row: `ลบ → <b>${miN(-S)}</b>`, hint: 'เครื่องหมายเดิมของทั้งสองจำนวนคือ<b>ลบ</b>' }];
    const step = () => { const t = qs[k]; ask.innerHTML = t.q; opts.replaceChildren(...shuffle([t.ok, ...t.bad]).map(v => h('button', { class: 'opt ia num', onclick: e => { e.stopPropagation(); const bt = e.currentTarget;
      if (v !== t.ok) { sfx.no(); bt.classList.remove('shake'); void bt.offsetWidth; bt.classList.add('shake'); out.innerHTML = 'ลองใหม่: ' + t.hint; return; }
      out.innerHTML = ''; rows.append(h('div', { class: 'fst-row' }, h('b', null, t.lab), h('span', { html: t.row }))); sfx.pop(k * 2 + 2); k++;
      if (k < qs.length) return step();
      ask.remove(); opts.remove(); out.innerHTML = `ถูกต้อง! ${miP(a)} + ${miP(b)} = <b>${miN(-S)}</b>`; sfx.ok(); say(miSay(`ถูกต้อง ${miP(a)} + ${miP(b)} = ${miN(-S)}`), true);
      i++; if (i < list.length) setTimeout(run, 1800); else teachDone(wrap); } }, v))); };
    box.replaceChildren(h('div', { class: 'fbig', html: miX(`${miP(a)} + ${miP(b)} = ?`) }), rows, ask, opts, out); step(); };
  run(); return wrap;
}
/* zero pairs: tap a + chip and a − chip to remove them; what is left is the answer */
function miChipBoard(a, b, onDone, o = {}) {
  const row = s => h('div', { class: 'mi-chips' }), ra = row(), rb = row(), info = h('div', { class: 'cap' }, 'แตะชิป + 1 อัน กับชิป − 1 อัน = คู่ศูนย์ (หักล้างกันได้ 0)'); let sel = null, pairs = 0;
  const all = () => [...ra.children, ...rb.children].filter(c => !c.classList.contains('gone'));
  const left = () => { const L = all(); return { p: L.filter(c => c.dataset.s > 0).length, m: L.filter(c => c.dataset.s < 0).length }; };
  const finish = () => { const { p, m } = left(); if (p && m) return; const r = p - m; info.innerHTML = `จับคู่ได้ ${pairs} คู่ (= 0) — เหลือชิป${r > 0 ? 'บวก' : r < 0 ? 'ลบ' : ''} ${Math.abs(r)} อัน → <b>${miN(r)}</b>`; onDone(r); };
  const tap = c => e => { e.stopPropagation(); if (c.classList.contains('gone')) return;
    if (!sel) { sel = c; c.classList.add('sel'); sfx.tap(); return; }
    if (sel === c) { c.classList.remove('sel'); sel = null; return; }
    if (sel.dataset.s === c.dataset.s) { sfx.no(); sel.classList.remove('sel'); sel = c; c.classList.add('sel'); info.textContent = 'ต้องจับคู่ชิป + กับชิป − (คนละสี)'; return; }
    [sel, c].forEach(x => { x.classList.remove('sel'); x.classList.add('gone'); }); sel = null; pairs++; sfx.pop(pairs); info.textContent = `คู่ศูนย์ ${pairs} คู่`; finish(); };
  [[a, ra], [b, rb]].forEach(([n, r]) => { for (let k = 0; k < Math.abs(n); k++) { const c = miChip(Math.sign(n)); c.onclick = tap(c); r.append(c); } });
  setTimeout(finish, 0);
  return h('div', { class: 'colstack mi-chipbox ia' }, h('div', { class: 'mi-chiprow' }, h('span', { class: 'mi-lab num' }, miN(a)), ra), h('div', { class: 'mi-chiprow' }, h('span', { class: 'mi-lab num' }, miN(b)), rb), info);
}
function miChipSim(list) {
  const box = h('div', { class: 'colstack' }), out = fNote(); let i = 0;
  const run = () => { const [a, b, lab] = list[i]; box.replaceChildren(lab ? h('div', { class: 'mi-round', html: lab }) : '', h('div', { class: 'fbig', html: miX(`${miP(a)} + ${miP(b)} = ?`) }), miChipBoard(a, b, r => {
    out.innerHTML = `${miP(a)} + ${miP(b)} = <b>${miN(r)}</b>`; say(miSay(`${miP(a)} + ${miP(b)} = ${miN(r)}`), true);
    i++; if (i < list.length) setTimeout(() => { out.innerHTML = ''; run(); }, 1800); else teachDone(box); }), out); };
  run(); return h('div', { class: 'colstack no-side' }, h6wait(), box); /* v221 no-side: กล่องถูกวาดใหม่ทุกรอบ ห้ามย้ายคำอธิบายไปด้านข้าง */
}
/* a river trip: tap each move card, the boat moves on the number line */
function miTripSim(start, moves, what = 'เรือ') {
  let pos = start, el; const out = fNote(), cards = h('div', { class: 'mi-moves' }), sum = [miP(start)];
  el = miLine(Math.min(start, ...moves.reduce((a, m) => [...a, a[a.length - 1] + m], [start])) - 2, Math.max(start, ...moves.reduce((a, m) => [...a, a[a.length - 1] + m], [start])) + 2, { h: 110 });
  el.dot(start, '#F5A742', miN(start));
  moves.forEach((m, k) => { const c = h('button', { class: 'mi-card mv ia' }, h('b', { class: 'num' }, (m > 0 ? '+' : '') + miN(m)), h('small', null, m > 0 ? 'ไปทางขวา' : 'ไปทางซ้าย'));
    c.onclick = e => { e.stopPropagation(); if (c.disabled) return; if ([...cards.children].slice(0, k).some(x => !x.disabled)) { sfx.no(); out.textContent = 'แตะการ์ดตามลำดับจากซ้ายไปขวา'; return; }
      c.disabled = true; c.classList.add('used'); el.arc(pos, pos + m, m > 0 ? '#2F86C2' : '#E5505E', (m > 0 ? '+' : '') + miN(m)); pos += m; sum.push(miP(m)); sfx.pop(k + 2);
      out.innerHTML = `${sum.join(' + ')} = <b>${miN(pos)}</b>`; if (k === moves.length - 1) { el.dot(pos, '#7C5CE0', miN(pos)); say(miSay(out.textContent), true); teachDone(el); } };
    cards.append(c); });
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, `${what}เริ่มที่ ${miN(start)} — แตะการ์ดทีละใบตามลำดับ`), el, cards, out);
}
/* subtraction → addition of the opposite: tap the − sign, then the number */
function miFlipSim(list) {
  const box = h('div', { class: 'colstack' }), out = fNote(); let i = 0;
  const run = () => { const [a, b, lab] = list[i]; let st = 0;
    const A = h('span', { class: 'mi-tok num' }, miP(a)), op = h('button', { class: 'mi-tok op ia' }, '−'), B = h('button', { class: 'mi-tok num ia' }, miP(b)), res = h('span', { class: 'mi-tok num q' }, '?');
    const line = h('div', { class: 'fbig mi-flip' }, A, op, B, h('b', { class: 'mi-op' }, '='), res), cap = h('div', { class: 'cap' }, '① แตะเครื่องหมาย − ให้เปลี่ยนเป็น +');
    op.onclick = e => { e.stopPropagation(); if (st !== 0) return; st = 1; op.textContent = '+'; op.classList.add('done'); sfx.pop(2); cap.textContent = `② แตะ ${miN(b)} ให้เปลี่ยนเป็นจำนวนตรงข้าม`; };
    B.onclick = e => { e.stopPropagation(); if (st !== 1) { sfx.no(); return; } st = 2; B.textContent = miP(-b); B.classList.add('done'); sfx.pop(4); res.textContent = miN(a - b); res.classList.remove('q');
      cap.innerHTML = `ลบด้วย ${miN(b)} = <b>บวกด้วยจำนวนตรงข้าม ${miN(-b)}</b>`; out.innerHTML = `${miP(a)} − ${miP(b)} = ${miP(a)} + ${miP(-b)} = <b>${miN(a - b)}</b>`; say(miSay(out.textContent), true);
      i++; if (i < list.length) setTimeout(() => { out.innerHTML = ''; run(); }, 2000); else teachDone(box); };
    box.replaceChildren(lab ? h('div', { class: 'mi-round', html: lab }) : '', line, cap, out); };
  run(); return h('div', { class: 'colstack no-side' }, h6wait(), box); /* v221 no-side: กล่องถูกวาดใหม่ทุกรอบ ห้ามย้ายคำอธิบายไปด้านข้าง */
}
/* the gap between two values = larger − smaller (tap two points) */
function miGapSim(lo, hi, need = 2) {
  const out = fNote(); let pick = [], done = 0, cross = false, el;
  el = miLine(lo, hi, { h: 140, tap: v => { if (pick.length === 2) { pick = []; el.clear(); } if (pick.includes(v)) return; pick.push(v); el.dot(v, pick.length === 1 ? '#F5A742' : '#7C5CE0', miN(v)); sfx.pop(pick.length + 1);
    if (pick.length === 2) { const a = Math.min(...pick), b = Math.max(...pick); el.span(a, b, '#4FD1A1', `ห่างกัน ${b - a}`); done++; if (a < 0 && b > 0) cross = true;
      out.innerHTML = `ห่างกัน = มาก − น้อย = ${miP(b)} − ${miP(a)} = <b>${b - a}</b>`; say(miSay(out.textContent), true); if (done >= need && cross) teachDone(el); else if (done >= need) out.innerHTML += '<div class="cap">ลองเลือกจำนวนลบ 1 ตัว กับจำนวนบวก 1 ตัว</div>'; } else out.textContent = 'แตะอีก 1 จำนวน'; } });
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, 'แตะ 2 จำนวน แล้วดูว่าห่างกันเท่าไร (ลองคู่ที่อยู่คนละข้างของ 0 ด้วย)'), el, out);
}
/* multiplication as groups: tap each empty slot to put a group of `a` chips */
function miGroupSim(a, n) {
  const out = fNote(), grid = h('div', { class: 'mi-groups' }); let k = 0;
  for (let g = 0; g < n; g++) { const slot = h('button', { class: 'mi-group ia' }, h('small', null, `กลุ่มที่ ${g + 1}`));
    slot.onclick = e => { e.stopPropagation(); if (slot.classList.contains('on')) return; if (g !== k) { sfx.no(); out.textContent = 'แตะกลุ่มถัดไปตามลำดับ'; return; }
      slot.classList.add('on'); for (let c = 0; c < Math.abs(a); c++) slot.append(miChip(Math.sign(a), 'pop')); k++; sfx.pop(k);
      out.innerHTML = `${Array(k).fill(miP(a)).join(' + ')} = <b>${miN(a * k)}</b>` + (k === n ? ` → <b>${n} × ${miP(a)} = ${miN(a * n)}</b>` : '');
      if (k === n) { say(miSay(`${n} × ${miP(a)} = ${miN(a * n)}`), true); teachDone(grid); } };
    grid.append(slot); }
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, `แตะกลุ่มทีละกลุ่ม — แต่ละกลุ่มมี ${miN(a)}`), grid, out);
}
/* a pattern table revealed row by row (tap the next row) */
function miPatternSim(rows, note) {
  const out = fNote(), tbl = h('div', { class: 'mi-pat' }); let k = 0;
  rows.forEach(([e, v, mark], i) => { const r = h('button', { class: 'mi-prow ia' + (mark ? ' mk' : '') }, h('span', { class: 'num', html: e + ' =' }), h('b', { class: 'num' }, '?'));
    r.onclick = ev => { ev.stopPropagation(); if (i !== k) { sfx.no(); out.textContent = 'แตะแถวถัดไปตามลำดับ'; return; } r.lastChild.textContent = miN(v); r.classList.add('on'); k++; sfx.pop(k);
      out.innerHTML = i > 0 ? `ผลคูณเพิ่มขึ้นทีละ <b>${v - rows[i - 1][1]}</b>` : ''; if (k === rows.length) { out.innerHTML = note; say(miSay(out.textContent), true); teachDone(tbl); } };
    tbl.append(r); });
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, 'แตะแถวทีละแถวจากบนลงล่าง สังเกตว่าผลคูณเปลี่ยนอย่างไร'), tbl, out);
}
/* flip cards: tap every card (counted by the teach gate) */
/* v224 (ผู้ใช้ขอ): หน้าสรุปตัวใหญ่ — ตารางเครื่องหมายของผลคูณ 2 × 2 · แตะครบ 4 ช่อง */
function miSignTable() {
  const cells = [['บวก', 'บวก', 'บวก', '3 × 4 = 12'], ['บวก', 'ลบ', 'ลบ', '3 × (−4) = −12'], ['ลบ', 'บวก', 'ลบ', '(−3) × 4 = −12'], ['ลบ', 'ลบ', 'บวก', '(−3) × (−4) = 12']], out = fNote(); let seen = 0;
  const grid = h('div', { class: 'mi-sgn' }, ...cells.map(([a, b, r, ex]) => { const c = h('button', { class: 'mi-sgc ia ' + (r === 'บวก' ? 'pos' : 'neg') }, h('span', { class: 'mi-sgq' }, `${a} × ${b}`), h('b', { class: 'mi-sgr' }, `= ${r}`), h('small', { class: 'num' }, ex));
    c.onclick = e => { e.stopPropagation(); if (c.classList.contains('on')) return; c.classList.add('on'); sfx.pop(++seen); say(`${a} คูณ ${b} ได้${r}`, true);
      if (seen === cells.length) { out.innerHTML = 'เครื่องหมาย<b>เหมือนกัน</b> ได้<b>บวก</b> และเครื่องหมาย<b>ต่างกัน</b> ได้<b>ลบ</b>'; sfx.ok(); teachDone(grid); } }; return c; }));
  return h('div', { class: 'colstack no-side' }, h6wait(), h('div', { class: 'cap' }, 'แตะทุกช่องเพื่อเปิดดู'), grid, out);
}
/* v241 (ผู้ใช้ขอ): การ์ดพลิกของ ม.ต้น ใช้พื้นที่ให้เต็มที่แต่ไม่แน่น — การ์ดยืดเต็มความกว้าง แล้วหาความสูงที่มากที่สุด (ไม่เกิน 250px)
   ที่ทั้งหน้ายังพอดีกรอบ (วัดจริงหลังวางลงหน้า) · ตัวอักษรโตตามขนาดการ์ด (container query) */
function miCardsFit(wrap) { let n = 0;
  const go = () => { const vis = wrap.closest('.visual'); if (!vis || !wrap.isConnected || !vis.clientHeight) { if (n++ < 40) requestAnimationFrame(go); return; }
    const unz = () => { vis.querySelectorAll('[data-gz]').forEach(c => { c.style.zoom = c.dataset.gz || ''; }); vis.classList.remove('shrunk'); };
    const fits = () => vis.scrollHeight <= vis.clientHeight + 2 && vis.scrollWidth <= vis.clientWidth + 2;
    let H = 260; for (; H > 120; H -= 10) { wrap.style.setProperty('--fch', H + 'px'); unz(); if (fits()) break; }
    wrap.style.setProperty('--fch', H + 'px'); if (typeof fitShrink === 'function') fitShrink(vis); /* ยังล้นที่ 120px → ระบบย่อทั้งหน้าเหมือนเดิม */
    if (!wrap.__ro && window.ResizeObserver) { let t = 0, w0 = vis.clientWidth, h0 = vis.clientHeight; wrap.__ro = new ResizeObserver(() => { if (vis.clientWidth === w0 && vis.clientHeight === h0) return; w0 = vis.clientWidth; h0 = vis.clientHeight; clearTimeout(t); t = setTimeout(() => { if (wrap.isConnected) go(); }, 150); }); wrap.__ro.observe(vis); } };
  requestAnimationFrame(() => requestAnimationFrame(go)); return wrap; }
function miCards(list) {
  return miCardsFit(h('div', { class: 'mi-cards mx', 'data-n': list.length }, ...list.map(([f, b, q]) => { const c = h('button', { class: 'mi-card fc' }, h('span', { class: 'f', html: f }), h('span', { class: 'b', html: `<i class="fc-q">${q ?? f}</i>${b}` })); /* q = หัวข้อด้านหลัง (ถ้าด้านหน้ามีรูป) */ /* v226 (ผู้ใช้ขอ): ด้านหลังยังมีข้อความด้านหน้า จะได้จำได้ว่าพูดถึงอะไร */
    c.onclick = e => { e.stopPropagation(); c.classList.toggle('flip'); sfx.pop(2); if (c.classList.contains('flip')) say(miSay(c.querySelector('.b').textContent), true); }; return c; })));
}
/* sharing: tap each chip to deal it to the next group */
function miShareSim(a, n) {
  const out = fNote(), pool = h('div', { class: 'mi-chips' }), groups = h('div', { class: 'mi-groups sm' }); let k = 0;
  const gs = Array.from({ length: n }, (_, g) => { const s = h('div', { class: 'mi-group on' }, h('small', null, `กลุ่มที่ ${g + 1}`)); groups.append(s); return s; });
  for (let c = 0; c < Math.abs(a); c++) { const ch = miChip(Math.sign(a)); ch.onclick = e => { e.stopPropagation(); if (ch.classList.contains('gone')) return; ch.classList.add('gone'); gs[k % n].append(miChip(Math.sign(a), 'pop')); k++; sfx.pop(k % 8);
    if (k === Math.abs(a)) { out.innerHTML = `แต่ละกลุ่มได้ ${Math.abs(a / n)} อัน (${a < 0 ? 'ชิปลบ' : 'ชิปบวก'}) → <b>${miP(a)} ÷ ${n} = ${miN(a / n)}</b>`; say(miSay(out.textContent), true); teachDone(groups); } else out.textContent = `แจกแล้ว ${k} / ${Math.abs(a)} อัน`; }; pool.append(ch); }
  return h('div', { class: 'colstack' }, h6wait(), h('div', { class: 'cap' }, `แตะชิปทีละอัน แจกให้ ${n} กลุ่มเท่า ๆ กัน`), pool, groups, out);
}
/* swap the two numbers: tap the swap button; addition / multiplication keep the result */
function miSwapSim(list) {
  const box = h('div', { class: 'colstack' }), out = fNote(); let i = 0;
  const run = () => { const [a, op, b] = list[i], v1 = miEval(`${miP(a)} ${op} ${miP(b)}`), v2 = miEval(`${miP(b)} ${op} ${miP(a)}`);
    const l1 = h('div', { class: 'fbig', html: miX(`${miP(a)} ${op} ${miP(b)} = ${miN(v1)}`) }), l2 = h('div', { class: 'fbig mi-ghost', html: miX(`${miP(b)} ${op} ${miP(a)} = ?`) });
    const btn = h('button', { class: 'btn info ia' }, icon('replay'), 'สลับที่');
    btn.onclick = e => { e.stopPropagation(); btn.remove(); l2.classList.remove('mi-ghost'); l2.innerHTML = miX(`${miP(b)} ${op} ${miP(a)} = ${Number.isInteger(v2) ? miN(v2) : 'ไม่เป็นจำนวนเต็ม'}`); sfx.pop(3);
      out.innerHTML = v1 === v2 ? `ผลเท่าเดิม ✓ — <b>การ${op === '+' ? 'บวก' : 'คูณ'}มีสมบัติการสลับที่</b>` : `ผลไม่เท่ากัน ✗ — <b>การ${op === '−' ? 'ลบ' : 'หาร'}ไม่มีสมบัติการสลับที่</b>`; say(miSay(out.textContent), true);
      i++; if (i < list.length) setTimeout(() => { out.innerHTML = ''; run(); }, 2200); else teachDone(box); };
    box.replaceChildren(l1, l2, btn, out); };
  run(); return h('div', { class: 'colstack no-side' }, h6wait(), box); /* v221 no-side: กล่องถูกวาดใหม่ทุกรอบ ห้ามย้ายคำอธิบายไปด้านข้าง */
}

/* =========================================================
   GAME QUESTION TYPES (Q.mi…)
   ========================================================= */
const miOptC = (ctx, nums, right, hint) => { const ch = choices(ctx, shuffle(nums.map(n => ({ value: String(n), label: miC(n) }))), String(right), { hint }); ch.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); return ch; };
const miOpt = (ctx, opts, right, hint) => { const ch = choices(ctx, shuffle(opts.map(o => ({ value: String(o), label: `<span class="num">${o}</span>` }))), String(right), { hint }); ch.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); return ch; };
Object.assign(Q, {
  /* what kind of number is n */
  miKind({ n, lab }) {
    const q = `<b class="num">${lab || miN(n)}</b> เป็นจำนวนชนิดใด`;
    return { prompt: q, say: miSay(`${lab || miN(n)} เป็นจำนวนชนิดใด`), __sig: 'mik ' + (lab || n),
      mount(bd, ctx) { bd.append(miOpt(ctx, ['จำนวนเต็มบวก', 'จำนวนเต็มลบ', 'ศูนย์', 'ไม่เป็นจำนวนเต็ม'], miType(n), 'จำนวนเต็มบวกอยู่ทางขวาของ 0 · จำนวนเต็มลบอยู่ทางซ้ายของ 0 · เศษส่วนหรือทศนิยมที่ไม่ลงตัวไม่เป็นจำนวนเต็ม')); } };
  },
  /* a situation written as an integer */
  miCtx({ text, a }) {
    return { prompt: `${text} — เขียนเป็นจำนวนเต็มได้อย่างไร`, say: miSay(`${text} เขียนเป็นจำนวนเต็มได้อย่างไร`), __sig: 'mic ' + text,
      mount(bd, ctx) { bd.append(miAns(ctx, a, { hint: 'เพิ่มขึ้น เหนือ กำไร = บวก · ลดลง ใต้ ต่ำกว่า ขาดทุน = ลบ (กด − ก่อนตัวเลข)' })); } };
  },
  /* read the point on the number line */
  miRead({ n, lo = -10, hi = 10 }) {
    return { prompt: 'จุดสีม่วงแทนจำนวนใด', say: 'จุดสีม่วงแทนจำนวนใด', __sig: 'mir ' + n + lo,
      mount(bd, ctx) { const el = miLine(lo, hi, { hideLabels: range(lo, hi).filter(v => v !== 0 && v !== lo && v !== hi && Math.abs(v) !== 5) }); el.dot(n, '#7C5CE0'); bd.append(h('div', { class: 'colstack' }, el, miAns(ctx, n, { hint: 'นับช่องจาก 0 · ทางซ้ายของ 0 เป็นจำนวนลบ' }))); } };
  },
  /* tap the number on the number line */
  miPlace({ n, lo = -10, hi = 10 }) {
    return { prompt: `แตะจุดที่แทน <b class="num">${miN(n)}</b> บนเส้นจำนวน`, say: miSay(`แตะจุดที่แทน ${miN(n)} บนเส้นจำนวน`), __sig: 'mip ' + n,
      mount(bd, ctx) { let el; el = miLine(lo, hi, { hideLabels: range(lo, hi).filter(v => v !== 0 && v !== lo && v !== hi && Math.abs(v) !== 5), tap: v => { if (el.dataset.done) return; el.clear(); el.dot(v, v === n ? '#4FD1A1' : '#E5505E', miN(v)); if (v === n) el.dataset.done = 1; ctx.check(v === n, n < 0 ? 'จำนวนลบอยู่ทางซ้ายของ 0 · นับช่องจาก 0 ไปทางซ้าย' : 'นับช่องจาก 0 ไปทางขวา'); } });
        el.classList.add('rvl'); el.reveal = () => { el.clear(); el.dot(n, '#4FD1A1', miN(n)); el.dataset.done = 1; }; bd.append(el); } };
  },
  /* compare with > < = */
  miCmp({ a, b, la, lb }) {
    const r = a > b ? '>' : a < b ? '<' : '=', blank = h('span', { class: 'blank' }, '?');
    return { prompt: 'เลือกเครื่องหมาย &gt; &lt; หรือ = เติมในช่องว่าง', say: miSay(`${la || miN(a)} กับ ${lb || miN(b)} เลือกเครื่องหมาย`), __sig: `micmp ${la || a} ${lb || b}`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'sentence num' }, h('span', { class: 'lab', html: la || miC(a) }), blank, h('span', { class: 'lab', html: lb || miC(b) })), wordChoices(ctx, r, blank, 'บนเส้นจำนวน จำนวนที่อยู่ทางขวามีค่ามากกว่า · จำนวนลบที่ตัวเลขมากกว่ากลับมีค่าน้อยกว่า', ['>', '<', '=']))); } };
  },
  /* the greatest / least in a set */
  miExt({ nums, max = true, ctx: what }) {
    const r = max ? Math.max(...nums) : Math.min(...nums), q = what || `จำนวนใด${max ? 'มากที่สุด' : 'น้อยที่สุด'}`;
    return { prompt: q, say: miSay(q), __sig: 'mix ' + nums.join(',') + max,
      mount(bd, ctx) { bd.append(miOptC(ctx, nums, r, max ? 'จำนวนที่อยู่ทางขวาสุดบนเส้นจำนวนมากที่สุด' : 'จำนวนที่อยู่ทางซ้ายสุดบนเส้นจำนวนน้อยที่สุด')); } };
  },
  /* ordering: tap the cards in order (the same board as ป.1 — v217 ผู้ใช้ขอ: ให้เด็กกดเรียงเอง) */
  miOrder({ nums, asc = true }) {
    const sorted = [...nums].sort((x, y) => asc ? x - y : y - x);
    return { prompt: `เรียงลำดับจาก<span class="hl">${asc ? 'น้อยไปมาก' : 'มากไปน้อย'}</span> <small>(แตะการ์ดตามลำดับ)</small>`, say: `เรียงลำดับจาก${asc ? 'น้อยไปมาก' : 'มากไปน้อย'} แตะการ์ดตามลำดับ`, __sig: 'mio ' + nums.join(',') + asc,
      mount(bd, ctx) { const sh = shuffle(nums.slice()), board = cvnBoard({ cards: sh.map(miC), horiz: true, fits: (k, i) => sh[k] === sorted[i],
          onDone: ok => ok ? ctx.check(true) : ctx.check(false, asc ? 'หาจำนวนที่น้อยที่สุดที่ยังเหลือก่อน — จำนวนลบที่ตัวเลขมาก (เช่น −9) มีค่าน้อยกว่า −2' : 'หาจำนวนที่มากที่สุดที่ยังเหลือก่อน — จำนวนบวกมากกว่าจำนวนลบเสมอ') });
        ctx.onRight = () => board.reveal();
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'dir' }, asc ? 'น้อย' : 'มาก', h('span', { class: 'ar' }), asc ? 'มาก' : 'น้อย'), board)); } };
  },
  /* opposite / absolute value */
  miOpp({ n }) { return { prompt: `จำนวนตรงข้ามของ <b class="num">${miN(n)}</b> คือจำนวนใด`, say: miSay(`จำนวนตรงข้ามของ ${miN(n)} คือจำนวนใด`), __sig: 'miopp ' + n,
    mount(bd, ctx) { bd.append(miAns(ctx, -n, { hint: 'จำนวนตรงข้ามอยู่ห่างจาก 0 เท่ากันแต่อยู่คนละข้าง · จำนวนตรงข้ามของ 0 คือ 0' })); } }; },
  /* calculate an integer expression (optional picture above) */
  miCalc({ expr, hint, fig, q, unit }) {
    const a = miEval(expr);
    return { prompt: q || 'หาผลลัพธ์', say: miSay(q || `หาผลลัพธ์ของ ${expr}`), __sig: 'mical ' + expr,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, fig ? fig() : null, h('div', { class: 'fbig', html: miX(`${expr} = ?`) }), miAns(ctx, a, { hint, unit }))); ctx.onRight = () => { const f = bd.querySelector('.fbig'); if (f) f.innerHTML = miX(`${expr} = ${miN(a)}`); }; } };
  },
  /* a word problem: choose the sentence, then answer */
  miStory({ text, expr, wrong, unit, hint }) {
    const a = miEval(expr);
    return { prompt: text, say: miSay(text), __sig: 'mis ' + text,
      mount(bd, ctx) { const step2 = h('div', { class: 'colstack', style: { display: 'none' } }, h('div', { class: 'fbig', html: miX(`${expr} = ?`) }), miAns(ctx, a, { hint, unit }));
        const ch = choices({ check: (ok, hn) => { if (!ok) return ctx.check(false, hn); ch.style.display = 'none'; step2.style.display = ''; sfx.pop(4); ctx.say('ถูกต้อง! หาผลลัพธ์ต่อเลย'); }, say: ctx.say },
          shuffle([expr, ...wrong].map(e => ({ value: e, label: miX(e) }))), expr, { hint: 'อ่านว่าเพิ่ม/ลด หรือหาผลต่าง แล้วเลือกประโยคสัญลักษณ์' });
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'cap' }, '① เลือกประโยคสัญลักษณ์'), ch, step2)); } };
  },
  /* hop on the number line, then answer */
  miHopQ({ a, b }) {
    return { prompt: `ใช้เส้นจำนวนหา <span class="num">${miP(a)} + ${miP(b)}</span>`, say: miSay(`ใช้เส้นจำนวนหา ${miP(a)} + ${miP(b)}`), __sig: `mih ${a}+${b}`,
      mount(bd, ctx) { const ans = h('div', { style: { display: 'none' } }, miAns(ctx, a + b, { hint: 'ผลบวกคือจุดที่กระโดดไปหยุด' }));
        bd.append(h('div', { class: 'colstack' }, miHopBoard(a, b, () => { ans.style.display = ''; sfx.ok(); }), ans)); } };
  },
  /* v226 (ผู้ใช้ขอ): ค่าเฉลี่ย — ① หาผลรวมก่อน ② เลือกประโยคสัญลักษณ์ ③ หาคำตอบ */
  miAvg({ text, nums, unit }) {
    const sum = nums.reduce((x, y) => x + y, 0), n = nums.length, e = `${miP(sum)} ÷ ${n}`, avg = sum / n;
    return { prompt: text, say: miSay(text), __sig: 'miavg ' + nums.join(','),
      mount(bd, ctx) { const sumX = nums.map(miP).join(' + ');
        const s3 = h('div', { class: 'colstack mi-avst', style: { display: 'none' } }, h('div', { class: 'cap' }, '③ หาค่าเฉลี่ย'), h('div', { class: 'fbig', html: miX(`${e} = ?`) }), miAns(ctx, avg, { unit, hint: `${e} — หารเครื่องหมายต่างกันได้ลบ` }));
        const ch = choices({ check: (ok, hn) => { if (!ok) return ctx.check(false, hn); s2.style.display = 'none'; s3.style.display = ''; sfx.pop(5); ctx.say && ctx.say('ถูกต้อง! หาค่าเฉลี่ยต่อเลย'); }, say: ctx.say },
          shuffle([e, `${miP(sum)} × ${n}`, `${miP(-sum)} ÷ ${n}`].map(v => ({ value: v, label: miX(v) }))), e, { hint: `ค่าเฉลี่ย = ผลรวม ÷ จำนวนข้อมูล (${n})` });
        const s2 = h('div', { class: 'colstack mi-avst', style: { display: 'none' } }, h('div', { class: 'cap', html: `② ผลรวม = <b>${miN(sum)}</b> — เลือกประโยคสัญลักษณ์หาค่าเฉลี่ย` }), ch);
        const a1 = miAns({ check: (ok, hn) => { if (!ok) return ctx.check(false, hn); s1.style.display = 'none'; s2.style.display = ''; sfx.pop(3); ctx.say && ctx.say('ถูกต้อง! ต่อไปเลือกประโยคสัญลักษณ์'); }, say: ctx.say }, sum, { hint: 'บวกทีละคู่: เครื่องหมายเหมือนกันบวกค่าสัมบูรณ์ ต่างกันเอามากลบน้อย' });
        const s1 = h('div', { class: 'colstack mi-avst' }, h('div', { class: 'cap' }, `① หาผลรวมของข้อมูลทั้ง ${n} จำนวนก่อน`), h('div', { class: 'fbig', html: miX(`${sumX} = ?`) }), a1);
        bd.append(h('div', { class: 'colstack' }, s1, s2, s3)); },
      reveal(root) { root.querySelectorAll('.mi-avst').forEach((x, i) => x.style.display = i === 2 ? '' : 'none'); } };
  },
  /* v223: distance between two points on the number line (always ≥ 0) */
  miGapQ({ a, b, lo = -10, hi = 10 }) {
    const d = Math.abs(a - b);
    return { prompt: 'จุด <b>A</b> กับจุด <b>B</b> อยู่ห่างกันกี่หน่วย', say: 'จุด เอ กับจุด บี อยู่ห่างกันกี่หน่วย', __sig: `migap ${a},${b}`,
      mount(bd, ctx) { const el = miLine(lo, hi, { h: 130 }); el.dot(a, '#F5A742', 'A'); el.dot(b, '#7C5CE0', 'B');
        bd.append(h('div', { class: 'colstack' }, el, miAns(ctx, d, { hint: 'ระยะห่าง = จำนวนที่มาก − จำนวนที่น้อย (นับช่องจาก A ถึง B ก็ได้) · ระยะห่างไม่ติดลบ' })));
        ctx.onRight = () => el.span(Math.min(a, b), Math.max(a, b), '#4FD1A1', `ห่างกัน ${d}`); } };
  },
  /* make zero pairs, then answer */
  miChipQ({ a, b }) {
    return { prompt: `ใช้ชิปหา <span class="num">${miP(a)} + ${miP(b)}</span>`, say: miSay(`ใช้ชิปหา ${miP(a)} + ${miP(b)}`), __sig: `mich ${a}+${b}`,
      mount(bd, ctx) { const ans = h('div', { style: { display: 'none' } }, miAns(ctx, a + b, { hint: 'ชิปที่เหลือหลังจับคู่ศูนย์คือผลบวก' }));
        bd.append(h('div', { class: 'rowstack' }, miChipBoard(a, b, () => { ans.style.display = ''; }), ans)); } };
  },
  /* pick the equal expression (rewrite) */
  miPick({ q, opts, right, hint }) {
    return { prompt: q, say: miSay(q), __sig: 'mipk ' + q + right,
      mount(bd, ctx) { const ch = choices(ctx, shuffle(opts.map(o => ({ value: o, label: /[a-zก-๙]/i.test(o) && !/^[\d\s()−+×÷=|,]+$/.test(o) ? o : miX(o) }))), right, { hint }); ch.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); bd.append(ch); } };
  },
  /* the missing number */
  miMiss({ expr, a, hint }) {
    return { prompt: 'หาจำนวนที่แทนด้วย ☐', say: miSay(`หาจำนวนที่แทนด้วยช่องว่าง ${expr}`), __sig: 'mim ' + expr,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'fbig', html: miX(expr) }), miAns(ctx, a, { hint }))); ctx.onRight = () => { const f = bd.querySelector('.fbig'); if (f) f.innerHTML = miX(expr.replace('☐', miP(a))); }; } };
  },
  /* the sign of a result */
  miSignQ({ expr }) {
    const v = miEval(expr), r = v > 0 ? 'จำนวนบวก' : v < 0 ? 'จำนวนลบ' : 'ศูนย์';
    return { prompt: `ผลลัพธ์ของ <span class="num">${expr}</span> เป็นจำนวนชนิดใด (ไม่ต้องหาคำตอบ)`, say: miSay(`ผลลัพธ์ของ ${expr} เป็นจำนวนชนิดใด`), __sig: 'misg ' + expr,
      mount(bd, ctx) { bd.append(miOpt(ctx, ['จำนวนบวก', 'จำนวนลบ', 'ศูนย์'], r, 'คูณ/หาร: เครื่องหมายเหมือนกันได้บวก ต่างกันได้ลบ · บวก: ดูจำนวนที่ค่าสัมบูรณ์มากกว่า')); } };
  }
});
const MIQ = { k: (n, lab) => Q.miKind({ n, lab }), c: (text, a) => Q.miCtx({ text, a }), x: (expr, hint, o = {}) => Q.miCalc({ expr, hint, ...o }) };

/* =========================================================
   LESSONS 2001–2015 (one per clip) + BOSS 2019
   ========================================================= */
/* v223: ผลต่างของ 2 จำนวน (ผลไม่ติดลบ): ① เลือก มาก − น้อย ② หาคำตอบ · ตัวลวง = น้อย − มาก และลืมเครื่องหมายของตัวลบ */
const miDiffQ = (a, b) => { const big = Math.max(a, b), sm = Math.min(a, b), e = `${miP(big)} − ${miP(sm)}`, w = [...new Set([`${miP(sm)} − ${miP(big)}`, `${miP(big)} − ${miP(-sm)}`])].filter(x => x !== e);
  return Q.miStory({ text: `หาผลต่างของ <span class="num">${miN(a)}</span> กับ <span class="num">${miN(b)}</span>`, expr: e, wrong: w, hint: `ผลต่าง = จำนวนที่มาก − จำนวนที่น้อย = ${e} (ผลต่างไม่ติดลบ)` }); };
const LM1 = (no, place, title, short, goal, teach, game) => ({ id: 2000 + no, no, place, title, short, tone: TONES5[(no + 2) % 6], goal, teach, game });
const MI_SUMS = { same: [[1, 6], [-3, -5], [-6, -2], [7, 2], [-6, -1], [-3, -3], [2, 6], [-1, -7]], mix: [[5, -3], [-7, 4], [-2, 6], [3, -8], [-5, 5], [6, -2], [-9, 3], [4, -4], [-1, 7]] };
const LESSONS_M1C1 = [
  LM1(1, 'ท่าน้ำจำนวนเต็ม', 'จำนวนเต็ม ตอนที่ 1', 'รู้จักจำนวนเต็ม', 'บอกได้ว่าจำนวนใดเป็นจำนวนเต็มบวก จำนวนเต็มลบ หรือศูนย์ และใช้จำนวนเต็มแทนสถานการณ์ เช่น สูงหรือต่ำกว่าระดับน้ำ', [
    T('ยินดีต้อนรับสู่ <b>แม่น้ำจำนวนเต็ม ม.1</b>! ระดับน้ำคือ <b>0</b> — <b>ลาก</b>ขึ้นลงดู: เหนือน้ำเป็น<b>บวก</b> ใต้น้ำเป็น<b>ลบ</b>', 'ยินดีต้อนรับสู่แม่น้ำจำนวนเต็ม ระดับน้ำคือศูนย์ ลากขึ้นลงดู เหนือน้ำเป็นบวก ใต้น้ำเป็นลบ', el => el.append(miSeaSim())),
    T('จำนวนเต็มบนเส้นจำนวน: <b>แตะ</b>จุดต่าง ๆ ดูว่าเป็นจำนวนเต็มบวก จำนวนเต็มลบ หรือศูนย์', 'แตะจุดบนเส้นจำนวน ดูว่าเป็นจำนวนเต็มบวก ลบ หรือศูนย์', el => el.append(miTypeSim())),
    T('ตัวอย่างทีละขั้น: จำนวนเต็มมี 3 กลุ่ม', 'ตัวอย่างทีละขั้น จำนวนเต็มมีสามกลุ่ม', el => el.append(dcWalk('…, −3, −2, −1, 0, 1, 2, 3, …', [['① จำนวนเต็มบวก', '1, 2, 3, … (คือจำนวนนับ)'], ['② ศูนย์', '0 ไม่เป็นทั้งจำนวนบวกและจำนวนลบ'], ['③ จำนวนเต็มลบ', '−1, −2, −3, … อยู่ทางซ้ายของ 0'], ['④ ไม่ใช่จำนวนเต็ม', '2.5 และ 1/2 อยู่ระหว่างจำนวนเต็ม']], '<b>จำนวนเต็ม</b> = จำนวนเต็มลบ · ศูนย์ · จำนวนเต็มบวก')))
  ], () => [MIQ.k(-7), MIQ.k(12), MIQ.k(0), MIQ.k(3.5, '3.5'), MIQ.k(-15), MIQ.k(-0.5, '−0.5'),
    MIQ.c('นักประดาน้ำดำลงไปใต้ระดับน้ำทะเล 18 เมตร', -18), MIQ.c('อุณหภูมิต่ำกว่า 0 องศาเซลเซียส 6 องศา', -6), MIQ.c('ร้านขายผักได้กำไร 250 บาท', 250), MIQ.c('ร้านขายขนมขาดทุน 80 บาท', -80), MIQ.c('จอดรถที่ชั้นใต้ดินชั้นที่ 3', -3), MIQ.c('ภูเขาสูงกว่าระดับน้ำทะเล 940 เมตร', 940),
    Q.miRead({ n: -4 }), Q.miRead({ n: 6 }), Q.miRead({ n: -8 }), Q.miPlace({ n: -3 }), Q.miPlace({ n: 7 }), Q.miPlace({ n: -9 })]),
  LM1(2, 'คุ้งน้ำเทียบค่า', 'จำนวนเต็ม ตอนที่ 2', 'เทียบ/เรียงลำดับ', 'เปรียบเทียบและเรียงลำดับจำนวนเต็มโดยใช้เส้นจำนวน และใช้เครื่องหมาย > < =', [
    T('<b>แตะ</b> 2 จำนวนบนเส้นจำนวน — จำนวนที่อยู่<b>ทางขวา</b>มีค่า<b>มากกว่า</b>เสมอ', 'แตะสองจำนวนบนเส้นจำนวน จำนวนที่อยู่ทางขวามีค่ามากกว่าเสมอ', el => el.append(miCmpSim())),
    T('ตัวอย่างทีละขั้น: −8 กับ −3 จำนวนใดมากกว่า', 'ตัวอย่างทีละขั้น ลบแปด กับ ลบสาม จำนวนใดมากกว่า', el => el.append(dcWalk('−8  ?  −3', [['① ดูบนเส้นจำนวน', '−8 อยู่ทางซ้ายของ −3'], ['② ทางซ้ายมีค่าน้อยกว่า', 'แม้ 8 มากกว่า 3 แต่ −8 อยู่ไกลจาก 0 ไปทางลบมากกว่า'], ['③ สรุป', '−8 < −3 หรือ −3 > −8']], '<b>−8 &lt; −3</b>'))),
    T('<b>ลองเรียงเอง</b>: 4, −7, 0, −2, 9 จากน้อยไปมาก — แตะการ์ดตามลำดับ', 'ลองเรียงเอง จากน้อยไปมาก แตะการ์ดตามลำดับ', el => el.append(miOrderSim([4, -7, 0, -2, 9])))
  ], () => [Q.miCmp({ a: -6, b: 2 }), Q.miCmp({ a: -4, b: -9 }), Q.miCmp({ a: 0, b: -5 }), Q.miCmp({ a: -12, b: -12 }), Q.miCmp({ a: -15, b: -11 }), Q.miCmp({ a: 7, b: -20 }),
    Q.miExt({ nums: [-3, 5, -8, 0] }), Q.miExt({ nums: [-14, -2, -9, -21], max: false }), Q.miExt({ nums: [-1, -10, -6, -4] }),
    Q.miOrder({ nums: [3, -5, 0, -1, 6] }), Q.miOrder({ nums: [-13, 5, -2, 9, -6], asc: false }), Q.miOrder({ nums: [-2, -9, 5, -6] }),
    Q.miExt({ nums: [-5, 3, -12, -1], max: false, ctx: 'อุณหภูมิตอนเช้าของ 4 เมือง (°C) เมืองใดหนาวที่สุด — อุณหภูมิใดน้อยที่สุด' })]),
  LM1(3, 'สะพานสองฝั่ง', 'จำนวนเต็ม ตอนที่ 3', 'ตรงข้าม·สัมบูรณ์', 'บอกจำนวนตรงข้ามของจำนวนเต็ม และหาค่าสัมบูรณ์ (ระยะห่างจาก 0 บนเส้นจำนวน)', [
    T('<b>ลาก</b>จุดบนเส้นจำนวน — จุดจาง ๆ คือ<b>จำนวนตรงข้าม</b> และเส้นเขียวคือ<b>ระยะห่างจาก 0</b> (ค่าสัมบูรณ์)', 'ลากจุดบนเส้นจำนวน จุดจางคือจำนวนตรงข้าม เส้นเขียวคือระยะห่างจากศูนย์ หรือค่าสัมบูรณ์', el => el.append(miOppSim())),
    T('ตัวอย่างทีละขั้น: จำนวนตรงข้ามและค่าสัมบูรณ์', 'ตัวอย่างทีละขั้น จำนวนตรงข้ามและค่าสัมบูรณ์', el => el.append(dcWalk('|−6|  และ  |6|', [['① −6 ห่างจาก 0', '6 หน่วย → |−6| = 6'], ['② 6 ห่างจาก 0', '6 หน่วย → |6| = 6'], ['③ จำนวนตรงข้ามของ −6', 'คือ 6 (และจำนวนตรงข้ามของ 6 คือ −6)'], ['④ ค่าสัมบูรณ์', 'ไม่เป็นจำนวนลบเลย · |0| = 0']], '<b>ค่าสัมบูรณ์ = ระยะห่างจาก 0</b>'))),
    T('ตัวอย่างทีละขั้น: |−7| + |3| และ −|−4|', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('|−7| + |3|', [['① หาค่าสัมบูรณ์ก่อน', '|−7| = 7 · |3| = 3'], ['② บวกกัน', '7 + 3 = 10'], ['③ ระวัง', '−|−4| = −(4) = −4 (เครื่องหมายลบอยู่นอกค่าสัมบูรณ์)']], '<b>|−7| + |3| = 10</b>')))
  ], () => [Q.miOpp({ n: -9 }), Q.miOpp({ n: 14 }), Q.miOpp({ n: 0 }), Q.miOpp({ n: -125 }),
    MIQ.x('|−8|'), MIQ.x('|15|'), MIQ.x('|−9| − |4|', 'หาค่าสัมบูรณ์แต่ละตัวก่อน'), MIQ.x('|−3| × 2', 'หาค่าสัมบูรณ์ก่อน'), MIQ.x('−|−5|', 'เครื่องหมายลบอยู่นอกค่าสัมบูรณ์'), MIQ.x('|−6| + |−7|', 'ค่าสัมบูรณ์ไม่เป็นจำนวนลบ'),
    Q.miPick({ q: 'จำนวนใดมีค่าสัมบูรณ์เท่ากับ 8', opts: ['8 และ −8', '8 เท่านั้น', '−8 เท่านั้น'], right: '8 และ −8', hint: 'ทั้ง 8 และ −8 ห่างจาก 0 เท่ากับ 8' }),
    Q.miCmp({ a: 9, b: 7, la: '|−9|', lb: '7' }), Q.miCmp({ a: 5, b: 5, la: '|−5|', lb: '|5|' })]),
  LM1(4, 'แก่งบวกเดียวกัน', 'การบวกจำนวนเต็ม ตอนที่ 1', 'บวกบนเส้นจำนวน', 'หาผลบวกของจำนวนเต็มที่มีเครื่องหมายเหมือนกันโดยใช้เส้นจำนวน และโดยใช้ค่าสัมบูรณ์', [
    T('<b>บวกบนเส้นจำนวน</b>: เริ่มที่ตัวแรก บวกจำนวนบวก = กระโดดไปทาง<b>ขวา</b> · บวกจำนวนลบ = ไปทาง<b>ซ้าย</b> — แตะทีละช่อง', 'บวกบนเส้นจำนวน เริ่มที่ตัวแรก บวกจำนวนบวกไปทางขวา บวกจำนวนลบไปทางซ้าย', el => el.append(miHopSim([[3, 4], [-2, -5]]))),
    T('<b>หลักเดียวกัน</b>: <b>บวกทั้งคู่</b> หรือ <b>ลบทั้งคู่</b> ก็ทำ 3 ขั้นเหมือนกัน', 'บวกจำนวนที่มีเครื่องหมายเหมือนกัน ไม่ว่าบวกทั้งคู่หรือลบทั้งคู่ ใช้หลักเดียวกัน ดูเครื่องหมาย บวกค่าสัมบูรณ์ แล้วใส่เครื่องหมายเดิม', el => el.append(miSameSim(5, 8))),
    T('ตัวอย่างทีละขั้น: (−6) + (−9) โดยใช้ค่าสัมบูรณ์', 'ตัวอย่างทีละขั้น ลบหก บวก ลบเก้า', el => el.append(dcWalk('(−6) + (−9)', [['① เครื่องหมายเหมือนกัน', 'เป็นจำนวนลบทั้งคู่'], ['② บวกค่าสัมบูรณ์', '6 + 9 = 15'], ['③ ใส่เครื่องหมายเดิม', 'ลบ → −15']], '<b>(−6) + (−9) = −15</b>'))),
    T('<b>ลองทำเอง</b>: บวกจำนวนเต็มลบสองจำนวน — เลือกคำตอบทีละขั้น', 'ลองทำเอง บวกจำนวนเต็มลบสองจำนวน เลือกคำตอบทีละขั้น', el => el.append(miSameTry([[-12, -7], [-24, -18]])))
  ], () => [...MI_SUMS.same.slice(0, 4).map(([a, b]) => Q.miHopQ({ a, b })), MIQ.x('(−14) + (−9)', 'เครื่องหมายเหมือนกัน: บวกค่าสัมบูรณ์ แล้วใส่เครื่องหมายเดิม'), MIQ.x('(−25) + (−38)', 'บวกค่าสัมบูรณ์ 25 + 38 แล้วใส่เครื่องหมายลบ'), MIQ.x('18 + 27'), MIQ.x('(−33) + (−19)', 'บวกค่าสัมบูรณ์แล้วใส่เครื่องหมายลบ'), MIQ.x('(−8) + (−6) + (−5)', 'บวกจำนวนลบทุกตัว ผลเป็นลบ'), Q.miSignQ({ expr: '(−210) + (−95)' }), MIQ.x('(−40) + (−65)', 'บวกค่าสัมบูรณ์แล้วใส่เครื่องหมายลบ'),
    Q.miSignQ({ expr: '(−17) + (−8)' }), MIQ.x('(−7) + (−7) + (−7)', 'บวกจำนวนลบไปเรื่อย ๆ ผลยิ่งน้อยลง'), MIQ.x('(−150) + (−250)', 'บวกค่าสัมบูรณ์แล้วใส่เครื่องหมายลบ')]),
  LM1(5, 'แก่งคู่ศูนย์', 'การบวกจำนวนเต็ม ตอนที่ 2', 'บวกต่างเครื่องหมาย', 'หาผลบวกของจำนวนเต็มบวกกับจำนวนเต็มลบ ด้วยคู่ศูนย์ (ชิป) และด้วยค่าสัมบูรณ์', [
    T('<b>คู่ศูนย์</b>: ชิป <b>+</b> 1 อัน กับชิป <b>−</b> 1 อัน รวมกันได้ 0 — แตะจับคู่จนจับไม่ได้ ที่เหลือคือคำตอบ', 'คู่ศูนย์ ชิปบวกหนึ่งอันกับชิปลบหนึ่งอันรวมกันได้ศูนย์ แตะจับคู่ ที่เหลือคือคำตอบ', el => el.append(miChipSim([[-7, 4, 'แบบที่ 1 · <b>จำนวนลบอยู่ข้างหน้า</b>'], [5, -3, 'แบบที่ 2 · <b>จำนวนลบอยู่ตัวที่สอง</b>']]))),
    T('ตัวอย่างทีละขั้น แบบที่ 1 (จำนวนลบอยู่ข้างหน้า): (−15) + 6 โดยใช้ค่าสัมบูรณ์', 'ตัวอย่างทีละขั้น แบบที่หนึ่ง จำนวนลบอยู่ข้างหน้า ลบสิบห้า บวก หก', el => el.append(dcWalk('(−15) + 6', [['① เครื่องหมายต่างกัน', 'ลบกับบวก'], ['② ค่าสัมบูรณ์', '|−15| = 15 · |6| = 6'], ['③ มาก − น้อย', '15 − 6 = 9'], ['④ เครื่องหมายของตัวที่ค่าสัมบูรณ์มากกว่า', '−15 → ลบ']], '<b>(−15) + 6 = −9</b>'))),
    T('ตัวอย่างทีละขั้น แบบที่ 2 (จำนวนลบอยู่ตัวที่สอง): 8 + (−13) โดยใช้ค่าสัมบูรณ์', 'ตัวอย่างทีละขั้น แบบที่สอง จำนวนลบอยู่ตัวที่สอง แปด บวก ลบสิบสาม', el => el.append(dcWalk('8 + (−13)', [['① เครื่องหมายต่างกัน', 'บวกกับลบ'], ['② ค่าสัมบูรณ์', '|8| = 8 · |−13| = 13'], ['③ มาก − น้อย', '13 − 8 = 5'], ['④ เครื่องหมายของตัวที่ค่าสัมบูรณ์มากกว่า', '−13 → ลบ']], '<b>8 + (−13) = −5</b>')))
  ], () => [...MI_SUMS.mix.slice(2, 6).map(([a, b]) => Q.miChipQ({ a, b })), MIQ.x('(−24) + 9', 'ต่างเครื่องหมาย: เอาค่าสัมบูรณ์มากลบน้อย แล้วใช้เครื่องหมายของตัวที่ค่าสัมบูรณ์มากกว่า'), MIQ.x('31 + (−18)', 'มากลบน้อย 31 − 18 ใช้เครื่องหมายของ 31'),
    MIQ.x('(−47) + 47', 'จำนวนกับจำนวนตรงข้ามรวมกันได้ 0'), MIQ.x('(−56) + 29', '56 − 29 ใช้เครื่องหมายของ −56'), MIQ.x('120 + (−95)', '120 − 95 ใช้เครื่องหมายของ 120'), MIQ.x('(−73) + 50', '73 − 50 ใช้เครื่องหมายของ −73'), Q.miChipQ({ a: -1, b: 7 }), Q.miSignQ({ expr: '(−63) + 58' }), Q.miSignQ({ expr: '44 + (−39)' })]),
  LM1(6, 'ปากคลองบวก', 'การบวกจำนวนเต็ม ตอนที่ 3', 'บวกหลายจำนวน', 'หาผลบวกของจำนวนเต็มหลายจำนวน และแก้โจทย์ปัญหาการบวกจำนวนเต็ม', [
    T('เรือล่องแม่น้ำ: <b>แตะการ์ดทีละใบ</b> (+ = พายไปทางขวา · − = ไปทางซ้าย) ดูว่าเรือไปหยุดที่ใด', 'เรือล่องแม่น้ำ แตะการ์ดทีละใบ ดูว่าเรือไปหยุดที่ใด', el => el.append(miTripSim(-2, [5, -8, 6]))),
    T('ตัวอย่างทีละขั้น: อุณหภูมิเปลี่ยนตลอดวัน', 'ตัวอย่างทีละขั้น อุณหภูมิเปลี่ยนตลอดวัน', el => el.append(dcStory('ตอนเช้าอุณหภูมิ −3 °C ตอนกลางวันสูงขึ้น 7 องศา ตอนค่ำลดลง 5 องศา ตอนค่ำอุณหภูมิเท่าไร', [['① เขียนประโยคสัญลักษณ์', '(−3) + 7 + (−5)'], ['② บวกทีละคู่', '(−3) + 7 = 4'], ['③ บวกตัวที่เหลือ', '4 + (−5) = −1']], '', 'ตอนค่ำอุณหภูมิ ลบหนึ่ง องศาเซลเซียส')))
  ], () => [MIQ.x('(−4) + 9 + (−6)', 'บวกทีละคู่จากซ้ายไปขวา'), MIQ.x('8 + (−15) + 3'), MIQ.x('(−12) + (−5) + 20'), MIQ.x('(−7) + 7 + (−9)', 'จำนวนกับจำนวนตรงข้ามรวมกันได้ 0'), MIQ.x('25 + (−40) + (−10)'), MIQ.x('(−18) + 30 + (−12)'), MIQ.x('(−6) + (−6) + 13'),
    Q.miStory({ text: 'นกบินอยู่สูงกว่าระดับน้ำ 12 เมตร แล้วโฉบลงมา 15 เมตร ตอนนี้นกอยู่ที่ระดับใด (เมตร)', expr: '12 + (−15)', wrong: ['12 + 15', '(−12) + 15'], unit: 'เมตร', hint: 'สูงกว่าระดับน้ำ = บวก · ลงมา = บวกด้วยจำนวนลบ' }),
    Q.miStory({ text: 'ร้านค้าวันจันทร์ขาดทุน 300 บาท วันอังคารได้กำไร 450 บาท สองวันรวมกันได้กำไรหรือขาดทุนกี่บาท (กำไรเป็นบวก ขาดทุนเป็นลบ)', expr: '(−300) + 450', wrong: ['300 + 450', '(−300) + (−450)'], unit: 'บาท', hint: 'ขาดทุน = ลบ · กำไร = บวก' }),
    Q.miStory({ text: 'ปลาว่ายอยู่ลึก 4 เมตรใต้ระดับน้ำ แล้วดำลงไปอีก 6 เมตร ปลาอยู่ที่ระดับใด (เมตร)', expr: '(−4) + (−6)', wrong: ['(−4) + 6', '4 + 6'], unit: 'เมตร', hint: 'ใต้ระดับน้ำ = ลบ · ดำลงไปอีก = บวกด้วยจำนวนลบ' }),
    Q.miStory({ text: 'ลิฟต์อยู่ชั้นใต้ดินชั้นที่ 2 (−2) ขึ้นไป 7 ชั้น แล้วลง 3 ชั้น ลิฟต์อยู่ชั้นใด', expr: '(−2) + 7 + (−3)', wrong: ['2 + 7 + 3', '(−2) + (−7) + 3'], hint: 'ขึ้น = บวก · ลง = บวกด้วยจำนวนลบ' })]),
  LM1(7, 'ท่าเรือพลิกลบ', 'การลบจำนวนเต็ม ตอนที่ 1', 'ลบ = บวกตรงข้าม', 'หาผลลบของจำนวนเต็มโดยเปลี่ยนการลบเป็นการบวกด้วยจำนวนตรงข้ามของตัวลบ', [
    T('<b>ลบ = บวกด้วยจำนวนตรงข้าม</b>: แตะเครื่องหมาย − ให้เป็น + แล้วแตะตัวลบให้เป็นจำนวนตรงข้าม', 'ลบ เท่ากับ บวกด้วยจำนวนตรงข้าม แตะเครื่องหมายลบให้เป็นบวก แล้วแตะตัวลบให้เป็นจำนวนตรงข้าม', el => el.append(miFlipSim([[7, -4, 'แบบที่ 1 · ตัวแรกเป็น<b>จำนวนเต็มบวก</b>'], [-6, 9, 'แบบที่ 2 · ตัวแรกเป็น<b>จำนวนเต็มลบ</b>'], [-5, -8, 'แบบที่ 2 · ตัวแรกเป็น<b>จำนวนเต็มลบ</b>']]))),
    T('ตัวอย่างทีละขั้น: ทำไมลบจำนวนลบ จึงได้มากขึ้น', 'ตัวอย่างทีละขั้น ทำไมลบจำนวนลบจึงได้มากขึ้น', el => el.append(dcWalk('5 − 3 , 5 − 2 , … , 5 − (−2)', [['① 5 − 3', '= 2'], ['② 5 − 2 , 5 − 1 , 5 − 0', '= 3 , 4 , 5 (ตัวลบน้อยลง 1 ผลมากขึ้น 1)'], ['③ 5 − (−1)', '= 6'], ['④ 5 − (−2)', '= 7 = 5 + 2']], '<b>ลบด้วยจำนวนลบ = บวกด้วยจำนวนบวก</b>'))),
    T('ตัวอย่างทีละขั้น แบบที่ 1 ตัวแรกเป็น<b>จำนวนเต็มบวก</b>', 'ตัวอย่างทีละขั้น แบบที่หนึ่ง ตัวแรกเป็นจำนวนเต็มบวก', el => el.append(miTwoWalk(['4 − (−9)', 'ตัวแรกเป็นบวก · ตัวลบเป็นลบ'], ['3 − 8', 'ตัวแรกเป็นบวก · ตัวลบเป็นบวก'],
      [['① เปลี่ยน − เป็น +', '4 + ☐', '3 + ☐'], ['② ตัวลบ → จำนวนตรงข้าม', '−9 → 9', '8 → −8'], ['③ บวก', '4 + 9 = <b>13</b>', '3 + (−8) = <b>−5</b>']],
      'ตัวตั้ง<b>เหมือนเดิม</b> เปลี่ยนแค่ − เป็น + และตัวลบเป็นจำนวนตรงข้าม', 'ตัวตั้งเหมือนเดิม เปลี่ยนแค่เครื่องหมายลบเป็นบวก และตัวลบเป็นจำนวนตรงข้าม สี่ ลบ ลบเก้า ได้ สิบสาม สาม ลบ แปด ได้ ลบห้า'))),
    T('ตัวอย่างทีละขั้น แบบที่ 2 ตัวแรกเป็น<b>จำนวนเต็มลบ</b>', 'ตัวอย่างทีละขั้น แบบที่สอง ตัวแรกเป็นจำนวนเต็มลบ', el => el.append(miTwoWalk(['(−6) − 8', 'ตัวแรกเป็นลบ · ตัวลบเป็นบวก'], ['(−7) − (−10)', 'ตัวแรกเป็นลบ · ตัวลบเป็นลบ'],
      [['① เปลี่ยน − เป็น +', '(−6) + ☐', '(−7) + ☐'], ['② ตัวลบ → จำนวนตรงข้าม', '8 → −8', '−10 → 10'], ['③ บวก', '(−6) + (−8) = <b>−14</b>', '(−7) + 10 = <b>3</b>']],
      'ตัวแรกเป็นลบก็ใช้หลักเดิม: ตัวตั้ง<b>ไม่เปลี่ยน</b> (−6 ยังเป็น −6) เปลี่ยนเฉพาะตัวลบ', 'ตัวแรกเป็นลบก็ใช้หลักเดิม ตัวตั้งไม่เปลี่ยน เปลี่ยนเฉพาะตัวลบ ลบหก ลบ แปด ได้ ลบสิบสี่ ลบเจ็ด ลบ ลบสิบ ได้ สาม')))
  ], () => [Q.miPick({ q: '9 − (−4) เท่ากับข้อใด', opts: ['9 + 4', '9 + (−4)', '(−9) + 4'], right: '9 + 4', hint: 'เปลี่ยน − เป็น + แล้วเปลี่ยนตัวลบ −4 เป็นจำนวนตรงข้ามคือ 4' }),
    Q.miPick({ q: '(−8) − 6 เท่ากับข้อใด', opts: ['(−8) + (−6)', '(−8) + 6', '8 + (−6)'], right: '(−8) + (−6)', hint: 'จำนวนตรงข้ามของ 6 คือ −6' }),
    Q.miPick({ q: '(−3) − (−10) เท่ากับข้อใด', opts: ['(−3) + 10', '(−3) + (−10)', '3 + 10'], right: '(−3) + 10', hint: 'จำนวนตรงข้ามของ −10 คือ 10 · ตัวตั้งไม่เปลี่ยน' }),
    MIQ.x('6 − (−5)', 'ลบด้วย −5 = บวกด้วย 5'), MIQ.x('(−4) − 9', 'ลบด้วย 9 = บวกด้วย −9'), MIQ.x('(−11) − (−7)', 'ลบด้วย −7 = บวกด้วย 7'), MIQ.x('8 − 15', 'ลบด้วย 15 = บวกด้วย −15'), MIQ.x('(−20) − (−20)'), MIQ.x('0 − (−13)', 'ลบด้วย −13 = บวกด้วย 13'), MIQ.x('(−35) − 48', 'บวกด้วย −48'), MIQ.x('(−9) − 14', 'บวกด้วย −14'),
    Q.miMiss({ expr: '7 − ☐ = 10', a: -3, hint: '7 + 3 = 10 ดังนั้น ☐ ต้องเป็นจำนวนตรงข้ามของ 3' })]),
  LM1(8, 'ลำธารผลต่าง', 'การลบจำนวนเต็ม ตอนที่ 2', 'ผลต่าง·โจทย์ลบ', 'ใช้การลบจำนวนเต็มหาผลต่างหรือระยะห่าง และแก้โจทย์ปัญหาการลบจำนวนเต็ม', [
    T('<b>ระยะห่าง</b>ของ 2 จำนวน = จำนวนที่มาก − จำนวนที่น้อย — แตะ 2 จำนวนดู', 'ระยะห่างของสองจำนวน เท่ากับ จำนวนที่มาก ลบ จำนวนที่น้อย แตะสองจำนวนดู', el => el.append(miGapSim(-10, 10))),
    T('ตัวอย่างทีละขั้น: อุณหภูมิกลางวันกับกลางคืน', 'ตัวอย่างทีละขั้น อุณหภูมิกลางวันกับกลางคืน', el => el.append(dcStory('บนยอดเขาตอนกลางวันอุณหภูมิ 9 °C ตอนกลางคืน −4 °C กลางวันกับกลางคืนอุณหภูมิต่างกันกี่องศา', [['① ต่างกัน = มาก − น้อย', '9 − (−4)'], ['② ลบ = บวกจำนวนตรงข้าม', '9 + 4'], ['③ คำตอบ', '= 13 องศา']], '', 'ต่างกัน สิบสาม องศา')))
  ], () => [Q.miGapQ({ a: -3, b: 4 }), Q.miGapQ({ a: -8, b: -2 }), Q.miGapQ({ a: 6, b: -5 }),
    miDiffQ(7, -6), miDiffQ(-12, -5), miDiffQ(-9, 16), miDiffQ(-25, -40),
    Q.miStory({ text: 'นกเกาะอยู่บนต้นไม้สูงกว่าระดับน้ำ 7 เมตร ปลาว่ายอยู่ใต้ระดับน้ำ 5 เมตร นกกับปลาอยู่ห่างกันกี่เมตร', expr: '7 − (−5)', wrong: ['7 − 5', '(−5) − 7'], unit: 'เมตร', hint: 'ห่างกัน = มาก − น้อย = 7 − (−5)' }),
    Q.miStory({ text: 'ห้องเย็นเก็บปลาตอนแรก 5 °C ปรับให้เย็นลงจนเป็น −7 °C อุณหภูมิลดลงกี่องศา', expr: '5 − (−7)', wrong: ['5 − 7', '(−7) − 5'], unit: 'องศา', hint: 'ลดลง = ค่าแรก − ค่าหลัง = 5 − (−7)' }),
    Q.miStory({ text: 'สถานีขั้วโลก ก วัดอุณหภูมิได้ −15 °C สถานี ข วัดได้ −6 °C สองสถานีอุณหภูมิต่างกันกี่องศา', expr: '(−6) − (−15)', wrong: ['(−15) − (−6)', '(−6) − 15'], unit: 'องศา', hint: 'มาก − น้อย: −6 มากกว่า −15 → (−6) − (−15)' }),
    Q.miStory({ text: 'ช่องแช่แข็งตู้เย็น −18 °C ห้องครัว 30 °C อุณหภูมิต่างกันกี่องศา', expr: '30 − (−18)', wrong: ['30 − 18', '(−18) − 30'], unit: 'องศา', hint: 'มาก − น้อย = 30 − (−18)' }),
    Q.miStory({ text: 'นักดำน้ำคนแรกอยู่ที่ระดับ −12 เมตร คนที่สองอยู่ที่ระดับ −30 เมตร ทั้งสองอยู่ห่างกันกี่เมตร', expr: '(−12) − (−30)', wrong: ['(−30) − (−12)', '(−12) − 30'], unit: 'เมตร', hint: 'มาก − น้อย: −12 มากกว่า −30' }),
    Q.miStory({ text: 'ยอดเขาสูงกว่าระดับน้ำทะเล 1,200 เมตร ซากเรืออยู่ใต้ระดับน้ำทะเล 350 เมตร ทั้งสองอยู่ห่างกันกี่เมตร', expr: '1,200 − (−350)', wrong: ['1,200 − 350', '(−350) − 1,200'], unit: 'เมตร', hint: 'มาก − น้อย' })]),
  LM1(9, 'ลานกลุ่มคูณ', 'การคูณจำนวนเต็ม ตอนที่ 1', 'คูณบวกกับลบ', 'หาผลคูณของจำนวนเต็มบวกกับจำนวนเต็มลบ โดยมองเป็นการบวกซ้ำ และสมบัติการสลับที่', [
    T('<b>การคูณ = การบวกซ้ำ</b>: 4 × (−3) คือมี (−3) อยู่ 4 กลุ่ม — แตะกลุ่มทีละกลุ่ม', 'การคูณคือการบวกซ้ำ สี่คูณลบสาม คือมีลบสามอยู่สี่กลุ่ม แตะกลุ่มทีละกลุ่ม', el => el.append(miGroupSim(-3, 4))),
    T('ตัวอย่างทีละขั้น: <b>ลบ × บวก</b> (−7) × 5', 'ตัวอย่างทีละขั้น ลบเจ็ด คูณ ห้า', el => el.append(dcWalk('(−7) × 5', [['① สลับที่ได้', '(−7) × 5 = 5 × (−7)'], ['② บวกซ้ำ 5 ครั้ง', '(−7) + (−7) + (−7) + (−7) + (−7)'], ['③ ผลรวม', '= −35']], '<b>(−7) × 5 = −35</b>'))),
    T('ตัวอย่างทีละขั้น: <b>ลบ × ลบ</b> (−4) × (−3)', 'ตัวอย่างทีละขั้น ลบสี่ คูณ ลบสาม', el => el.append(dcWalk('(−4) × (−3)', [['① เริ่มจากที่รู้แล้ว', '(−4) × 3 = −12'], ['② ตัวคูณเปลี่ยนจาก 3 เป็น −3 (จำนวนตรงข้าม)', 'ผลคูณก็เปลี่ยนเป็นจำนวนตรงข้ามด้วย'], ['③ จำนวนตรงข้ามของ −12', '= 12']], '<b>(−4) × (−3) = 12</b> — ลบ × ลบ ได้บวก'))),
    T('<b>สรุป</b>: เครื่องหมายของผลคูณ', 'สรุปเครื่องหมายของผลคูณ เครื่องหมายเหมือนกันได้บวก ต่างกันได้ลบ', el => el.append(miSignTable()))
  ], () => [MIQ.x('6 × (−4)', 'มี (−4) อยู่ 6 กลุ่ม'), MIQ.x('(−8) × 3', 'บวก × ลบ ได้ลบ'), MIQ.x('(−12) × 5'), MIQ.x('9 × (−11)'), MIQ.x('(−25) × 4'), MIQ.x('(−1) × 37', 'คูณด้วย −1 ได้จำนวนตรงข้าม'), MIQ.x('15 × (−20)'),
    Q.miPick({ q: '3 × (−6) เท่ากับข้อใด', opts: ['(−6) + (−6) + (−6)', '(−3) + (−3) + (−3)', '6 + 6 + 6'], right: '(−6) + (−6) + (−6)', hint: 'มี (−6) อยู่ 3 กลุ่ม' }),
    Q.miSignQ({ expr: '(−17) × 23' }), Q.miMiss({ expr: '☐ × 7 = −56', a: -8, hint: 'ผลคูณเป็นลบ และ 7 เป็นบวก ตัวที่หายไปต้องเป็นลบ' }),
    Q.miStory({ text: 'น้ำในอ่างลดลงนาทีละ 4 ลิตร (−4) เวลาผ่านไป 9 นาที ปริมาณน้ำเปลี่ยนไปเท่าไร (ลิตร)', expr: '9 × (−4)', wrong: ['9 × 4', '9 + (−4)'], unit: 'ลิตร', hint: 'ลดลงนาทีละ 4 ลิตร 9 ครั้ง' })]),
  LM1(10, 'คุ้งลบคูณลบ', 'การคูณจำนวนเต็ม ตอนที่ 2', 'ลบคูณลบ', 'หาผลคูณของจำนวนเต็มลบกับจำนวนเต็มลบ และผลคูณของจำนวนเต็มหลายจำนวน', [
    T('<b>แบบรูป</b>: แตะทีละแถว — ตัวคูณลดลงทีละ 1 ผลคูณ<b>เพิ่มขึ้นทีละ 3</b>', 'แบบรูป แตะทีละแถว ตัวคูณลดลงทีละหนึ่ง ผลคูณเพิ่มขึ้นทีละสาม', el => el.append(miPatternSim([['(−3) × 2', -6], ['(−3) × 1', -3], ['(−3) × 0', 0], ['(−3) × (−1)', 3, 1], ['(−3) × (−2)', 6, 1], ['(−3) × (−3)', 9, 1]], '<b>ลบ × ลบ = บวก</b> · (−3) × (−3) = 9'))),
    T('แตะการ์ดให้ครบทุกใบ — <b>เครื่องหมายของผลคูณ</b>', 'แตะการ์ดให้ครบทุกใบ เครื่องหมายของผลคูณ', el => el.append(miCards([['บวก × บวก', '= <b>บวก</b><br><small>3 × 4 = 12</small>'], ['บวก × ลบ', '= <b>ลบ</b><br><small>3 × (−4) = −12</small>'], ['ลบ × บวก', '= <b>ลบ</b><br><small>(−3) × 4 = −12</small>'], ['ลบ × ลบ', '= <b>บวก</b><br><small>(−3) × (−4) = 12</small>']]))),
    T('ตัวอย่างทีละขั้น: (−2) × (−5) × (−3)', 'ตัวอย่างทีละขั้น', el => el.append(dcWalk('(−2) × (−5) × (−3)', [['① นับจำนวนลบ', 'มี 3 ตัว (จำนวนคี่)'], ['② เครื่องหมาย', 'จำนวนลบเป็นคี่ → ผลเป็นลบ'], ['③ คูณค่าสัมบูรณ์', '2 × 5 × 3 = 30']], '<b>(−2) × (−5) × (−3) = −30</b>')))
  ], () => [MIQ.x('(−6) × (−7)', 'ลบ × ลบ ได้บวก'), MIQ.x('(−9) × (−8)'), MIQ.x('(−15) × (−4)'), MIQ.x('(−1) × (−1)'), MIQ.x('(−2) × (−3) × (−4)', 'จำนวนลบ 3 ตัว (คี่) ผลเป็นลบ'), MIQ.x('(−5) × 2 × (−6)', 'จำนวนลบ 2 ตัว (คู่) ผลเป็นบวก'), MIQ.x('(−1) × (−2) × (−3) × (−4)', 'จำนวนลบ 4 ตัว (คู่) ผลเป็นบวก'),
    Q.miSignQ({ expr: '(−13) × (−29)' }), Q.miSignQ({ expr: '(−7) × 6 × (−2) × (−1)' }), Q.miMiss({ expr: '(−9) × ☐ = 63', a: -7, hint: 'ผลคูณเป็นบวก ตัวคูณจึงต้องมีเครื่องหมายเดียวกับ −9' }),
    Q.miPick({ q: 'ข้อใดมีผลคูณเป็นจำนวนบวก', opts: ['(−4) × (−5) × 2', '(−4) × 5 × 2', '(−4) × (−5) × (−2)'], right: '(−4) × (−5) × 2', hint: 'นับจำนวนลบ: คู่ได้บวก คี่ได้ลบ' })]),
  LM1(11, 'ท่าแบ่งหาร', 'การหารจำนวนเต็ม ตอนที่ 1', 'หารจำนวนเต็ม', 'หาผลหารของจำนวนเต็ม โดยใช้ความสัมพันธ์ของการคูณและการหาร', [
    T('<b>แจกชิป</b>: (−12) ÷ 3 คือแบ่ง −12 เป็น 3 กลุ่มเท่า ๆ กัน — แตะชิปทีละอัน', 'แจกชิป ลบสิบสอง หาร สาม คือแบ่งลบสิบสองเป็นสามกลุ่มเท่า ๆ กัน', el => el.append(miShareSim(-12, 3))),
    T('ตัวอย่างทีละขั้น: (−20) ÷ (−4) ใช้การคูณ', 'ตัวอย่างทีละขั้น ลบยี่สิบ หาร ลบสี่', el => el.append(dcWalk('(−20) ÷ (−4) = ☐', [['① หารคือหาตัวคูณที่หายไป', '☐ × (−4) = −20'], ['② ลอง', '5 × (−4) = −20 ✓'], ['③ ผลหาร', '☐ = 5']], '<b>เครื่องหมายเหมือนกัน → บวก · ต่างกัน → ลบ</b> (เหมือนการคูณ)')))
  ], () => [MIQ.x('(−24) ÷ 6', 'ลบ ÷ บวก ได้ลบ'), MIQ.x('35 ÷ (−7)'), MIQ.x('(−48) ÷ (−8)', 'ลบ ÷ ลบ ได้บวก'), MIQ.x('(−90) ÷ 15'), MIQ.x('(−144) ÷ (−12)'), MIQ.x('0 ÷ (−9)', '0 หารด้วยจำนวนใดที่ไม่ใช่ 0 ได้ 0'), MIQ.x('(−100) ÷ 25'),
    Q.miMiss({ expr: '☐ ÷ (−3) = 7', a: -21, hint: '☐ = 7 × (−3)' }), Q.miMiss({ expr: '(−56) ÷ ☐ = −8', a: 7, hint: '☐ × (−8) = −56' }), Q.miSignQ({ expr: '(−84) ÷ (−7)' }),
    Q.miPick({ q: 'การหารข้อใดได้คำตอบถูกต้อง', opts: ['(−27) ÷ 3 = −9', '(−27) ÷ 3 = 9', '(−27) ÷ (−3) = −9'], right: '(−27) ÷ 3 = −9', hint: 'ตรวจด้วยการคูณ: ผลหาร × ตัวหาร = ตัวตั้ง' })]),
  LM1(12, 'วังน้ำหาร', 'การหารจำนวนเต็ม ตอนที่ 2', 'หาร·โจทย์ปัญหา', 'รู้ว่าการหารด้วยศูนย์หาค่าไม่ได้ และแก้โจทย์ปัญหาการหารจำนวนเต็ม เช่น ค่าเฉลี่ย', [
    T('แตะการ์ดให้ครบทุกใบ — <b>ศูนย์กับการหาร</b>', 'แตะการ์ดให้ครบทุกใบ ศูนย์กับการหาร', el => el.append(miCards([['0 ÷ 8', '= <b>0</b><br><small>เพราะ 0 × 8 = 0</small>'], ['8 ÷ 0', '<b>หาค่าไม่ได้</b><br><small>ไม่มีจำนวนใดคูณ 0 แล้วได้ 8</small>'], ['(−8) ÷ 0', '<b>หาค่าไม่ได้</b><br><small>ห้ามหารด้วย 0</small>'], ['0 ÷ (−8)', '= <b>0</b><br><small>เพราะ 0 × (−8) = 0</small>']]))),
    T('<b>สรุปจากการสังเกต</b>: ศูนย์อยู่ตรงไหนของการหาร', 'สรุปจากการสังเกต ถ้าตัวตั้งเป็นศูนย์ คำตอบเป็นศูนย์ ถ้าตัวหารเป็นศูนย์ หาค่าไม่ได้', el => el.append(miTwoWalk(['0 ÷ a', '<b>ตัวตั้ง</b>เป็น 0 (a ไม่ใช่ 0)'], ['a ÷ 0', '<b>ตัวหาร</b>เป็น 0'],
      [['ตัวอย่าง', '0 ÷ 8 , 0 ÷ (−8)', '8 ÷ 0 , (−8) ÷ 0'], ['ตรวจด้วยการคูณ', '0 × 8 = 0 ✓', 'ไม่มีจำนวนใดคูณ 0 แล้วได้ 8'], ['สรุป', 'คำตอบเป็น <b>0</b>', '<b>หาค่าไม่ได้</b>']],
      'ตัวตั้งเป็น 0 → คำตอบเป็น <b>0</b> &nbsp; แต่ &nbsp; ตัวหารเป็น 0 → <b>หาค่าไม่ได้</b>', 'สรุป ถ้าตัวตั้งเป็นศูนย์ คำตอบเป็นศูนย์ แต่ถ้าตัวหารเป็นศูนย์ หาค่าไม่ได้'))),
    T('ตัวอย่างทีละขั้น: อุณหภูมิเฉลี่ย', 'ตัวอย่างทีละขั้น อุณหภูมิเฉลี่ย', el => el.append(dcStory('อุณหภูมิตอนเช้า 5 วันบนยอดดอย คือ −3, 2, −6, 1, −4 °C อุณหภูมิเฉลี่ยเท่าไร', [['① รวมอุณหภูมิ', '(−3) + 2 + (−6) + 1 + (−4) = −10'], ['② หารด้วยจำนวนวัน', '(−10) ÷ 5'], ['③ ค่าเฉลี่ย', '= −2 °C']], '', 'อุณหภูมิเฉลี่ย ลบสอง องศาเซลเซียส')))
  ], () => [Q.miPick({ q: '(−15) ÷ 0 เท่ากับเท่าใด', opts: ['หาค่าไม่ได้', '0', '−15'], right: 'หาค่าไม่ได้', hint: 'ไม่มีจำนวนใดคูณ 0 แล้วได้ −15' }), Q.miPick({ q: '0 ÷ (−15) เท่ากับเท่าใด', opts: ['0', 'หาค่าไม่ได้', '−15'], right: '0', hint: '0 × (−15) = 0' }),
    Q.miPick({ q: 'นิพจน์ใดไม่มีค่า (หาค่าไม่ได้)', opts: ['11 ÷ 0', '0 ÷ 11', '0 × 11'], right: '11 ÷ 0', hint: 'ห้ามหารด้วย 0' }), MIQ.x('(−65) ÷ 13'), Q.miMiss({ expr: '☐ ÷ (−6) = −9', a: 54, hint: '☐ = (−9) × (−6)' }),
    Q.miAvg({ text: 'อุณหภูมิ 4 วันคือ −5, −2, 3, −8 °C อุณหภูมิเฉลี่ยเท่าไร', nums: [-5, -2, 3, -8], unit: '°C' }),
    Q.miStory({ text: 'นักดำน้ำดำลงไป 60 เมตร (−60) อย่างสม่ำเสมอใน 5 นาที แต่ละนาทีระดับเปลี่ยนไปเท่าไร (เมตร)', expr: '(−60) ÷ 5', wrong: ['60 ÷ 5', '(−60) × 5'], unit: 'เมตร', hint: 'แบ่งการเปลี่ยนแปลงทั้งหมดเท่า ๆ กัน 5 ส่วน' }),
    Q.miStory({ text: 'หุ้นราคาลดลงรวม 84 บาท (−84) ใน 7 วัน วันละเท่า ๆ กัน ราคาเปลี่ยนวันละเท่าไร (บาท)', expr: '(−84) ÷ 7', wrong: ['84 ÷ 7', '(−84) + 7'], unit: 'บาท', hint: 'ลดลง = ลบ แล้วหารด้วยจำนวนวัน' }),
    MIQ.x('(−72) ÷ (−9) ÷ 2', 'หารจากซ้ายไปขวา'), MIQ.x('(−144) ÷ 8 ÷ (−3)', 'หารจากซ้ายไปขวา'), MIQ.x('120 ÷ (−6) ÷ (−5)')]),
  LM1(13, 'สะพานสลับที่', 'สมบัติการบวกและการคูณจำนวนเต็ม ตอนที่ 1', 'สลับที่·เปลี่ยนหมู่', 'ใช้สมบัติการสลับที่และสมบัติการเปลี่ยนหมู่ของการบวกและการคูณจำนวนเต็มช่วยคิดเลข', [
    T('ด่านนี้เรียน<b>สมบัติการสลับที่</b> และ<b>สมบัติการเปลี่ยนหมู่</b> — แตะการ์ดดูทีละใบ', 'ด่านนี้จะเรียนสมบัติสองอย่าง คือ การสลับที่ และ การเปลี่ยนหมู่ ของการบวกและการคูณ แตะการ์ดดูทีละใบ', el => el.append(miCards([['สมบัติการสลับที่<br>สำหรับการบวก', '<b>a + b = b + a</b>'], ['สมบัติการสลับที่<br>สำหรับการคูณ', '<b>a × b = b × a</b>'], ['สมบัติการเปลี่ยนหมู่<br>สำหรับการบวก', '<b>(a + b) + c = a + (b + c)</b>'], ['สมบัติการเปลี่ยนหมู่<br>สำหรับการคูณ', '<b>(a × b) × c = a × (b × c)</b>']]))),
    T('กด <b>สลับที่</b> ดูว่าผลเท่าเดิมไหม — ทั้งการบวก การลบ การคูณ และการหาร', 'กดสลับที่ ดูว่าผลเท่าเดิมไหม', el => el.append(miSwapSim([[-8, '+', 5], [-8, '−', 5], [-6, '×', 4], [-12, '÷', 4]]))),
    T('ตัวอย่างทีละขั้น: <b>เปลี่ยนหมู่</b>ให้คิดง่าย', 'ตัวอย่างทีละขั้น เปลี่ยนหมู่ให้คิดง่าย', el => el.append(dcWalk('(−25) + 17 + 25', [['① สลับที่', '(−25) + 25 + 17'], ['② เปลี่ยนหมู่', '[(−25) + 25] + 17 = 0 + 17'], ['③ คูณก็ทำได้', '(−4) × 7 × 25 = 7 × [(−4) × 25] = 7 × (−100)']], '<b>(−25) + 17 + 25 = 17</b> · (−4) × 7 × 25 = −700')))
  ], () => [Q.miPick({ q: '(−9) + 14 = 14 + (−9) ใช้สมบัติใด', opts: ['สมบัติการสลับที่สำหรับการบวก', 'สมบัติการเปลี่ยนหมู่สำหรับการบวก', 'สมบัติการแจกแจง'], right: 'สมบัติการสลับที่สำหรับการบวก', hint: 'สองข้างสลับตำแหน่งกันเท่านั้น' }),
    Q.miPick({ q: '[(−2) × 5] × 7 = (−2) × [5 × 7] ใช้สมบัติใด', opts: ['สมบัติการเปลี่ยนหมู่สำหรับการคูณ', 'สมบัติการสลับที่สำหรับการคูณ', 'สมบัติการแจกแจง'], right: 'สมบัติการเปลี่ยนหมู่สำหรับการคูณ', hint: 'ลำดับเดิม แต่เปลี่ยนว่าคู่ไหนทำก่อน' }),
    Q.miPick({ q: 'สมการข้อใดเป็นเท็จ', opts: ['9 − (−2) = (−2) − 9', '9 + (−2) = (−2) + 9', '9 × (−2) = (−2) × 9'], right: '9 − (−2) = (−2) − 9', hint: 'การลบไม่มีสมบัติการสลับที่' }),
    Q.miPick({ q: 'สลับที่แล้วข้อใดได้ผลไม่เท่าเดิม', opts: ['(−30) ÷ 5 กับ 5 ÷ (−30)', '(−30) × 5 กับ 5 × (−30)', '(−30) + 5 กับ 5 + (−30)'], right: '(−30) ÷ 5 กับ 5 ÷ (−30)', hint: 'การหารไม่มีสมบัติการสลับที่' }), MIQ.x('(−250) + 87 + 250', 'จับคู่ −250 กับ 250'), MIQ.x('(−2) × 17 × (−50)', 'คูณ (−2) × (−50) ก่อน ได้ 100'),
    MIQ.x('(−36) + 58 + 36', 'สลับที่ให้ −36 กับ 36 อยู่คู่กัน (ได้ 0)'), MIQ.x('(−5) × 13 × 20', 'คูณ (−5) × 20 ก่อน ได้ −100'), MIQ.x('(−125) × (−7) × 8', 'คูณ (−125) × 8 ก่อน ได้ −1,000'), MIQ.x('49 + (−17) + (−49)', 'จับคู่ 49 กับ −49'),
    Q.miMiss({ expr: '(−6) × ☐ = 11 × (−6)', a: 11, hint: 'สมบัติการสลับที่สำหรับการคูณ' })]),
  LM1(14, 'เขื่อนแจกแจง', 'สมบัติการบวกและการคูณจำนวนเต็ม ตอนที่ 2', 'แจกแจง·เอกลักษณ์', 'ใช้สมบัติการแจกแจง สมบัติของศูนย์และหนึ่ง ช่วยหาผลลัพธ์ของจำนวนเต็ม', [
    T('ด่านนี้จะเรียน<b>สมบัติการแจกแจง</b> และ<b>สมบัติของ 0 และ 1</b> — แตะการ์ดดูทีละใบ', 'ด่านนี้จะเรียนสมบัติการแจกแจง และสมบัติของศูนย์และหนึ่ง แตะการ์ดดูทีละใบ', el => el.append(miCards([['สมบัติการแจกแจง', '<b>a × (b + c) = a × b + a × c</b>'], ['สมบัติของศูนย์', '<b>a + 0 = a</b><br><b>a × 0 = 0</b>'], ['สมบัติของหนึ่ง', '<b>a × 1 = a</b>']]))),
    T('แตะการ์ดให้ครบทุกใบ — <b>สมบัติของ 0 และ 1</b>', 'แตะการ์ดให้ครบทุกใบ สมบัติของศูนย์และหนึ่ง', el => el.append(miCards([['a + 0', '= <b>a</b><br><small>(−9) + 0 = −9</small>'], ['a × 1', '= <b>a</b><br><small>(−9) × 1 = −9</small>'], ['a × 0', '= <b>0</b><br><small>(−9) × 0 = 0</small>'], ['a + (−a)', '= <b>0</b><br><small>9 + (−9) = 0</small>']]))),
    T('ตัวอย่างทีละขั้น: <b>แจกแจง</b> (−6) × 13', 'ตัวอย่างทีละขั้น แจกแจง ลบหก คูณ สิบสาม', el => el.append(dcWalk('(−6) × 13', [['① แยก 13', '(−6) × (10 + 3)'], ['② แจกแจง', '(−6) × 10 + (−6) × 3'], ['③ คูณ', '(−60) + (−18)'], ['④ บวก', '= −78']], '<b>a × (b + c) = a × b + a × c</b>'))),
    T('ตัวอย่างทีละขั้น: แจกแจงย้อนกลับ', 'ตัวอย่างทีละขั้น แจกแจงย้อนกลับ', el => el.append(dcWalk('25 × (−48) + 25 × 8', [['① ดึงตัวร่วม 25', '25 × [(−48) + 8]'], ['② ในวงเล็บ', '(−48) + 8 = −40'], ['③ คูณ', '25 × (−40) = −1,000']], '<b>25 × (−48) + 25 × 8 = −1,000</b>')))
  ], () => [Q.miPick({ q: '(−3) × (8 + 5) = (−3) × 8 + (−3) × 5 ใช้สมบัติใด', opts: ['สมบัติการแจกแจง', 'สมบัติการเปลี่ยนหมู่', 'สมบัติการสลับที่'], right: 'สมบัติการแจกแจง', hint: 'คูณเข้าไปในวงเล็บทีละตัว' }),
    MIQ.x('(−8) × 102', 'แจกแจง (−8) × (100 + 2)'), MIQ.x('(−7) × 99', 'แจกแจง (−7) × (100 − 1)'), MIQ.x('15 × (−23) + 15 × 3', 'ดึง 15 ออกมา: 15 × [(−23) + 3]'), MIQ.x('(−12) × 47 + (−12) × 53', 'ดึง (−12) ออกมา: (−12) × (47 + 53)'), MIQ.x('(−365) × 0', 'คูณด้วย 0 ได้ 0'),
    Q.miMiss({ expr: '(−58) + ☐ = −58', a: 0, hint: 'บวกด้วยจำนวนใดแล้วได้ค่าเดิม' }), Q.miMiss({ expr: '☐ × (−27) = −27', a: 1, hint: 'คูณด้วยจำนวนใดแล้วได้ค่าเดิม' }), Q.miMiss({ expr: '(−9) × (6 + ☐) = (−54) + (−36)', a: 4, hint: '(−9) × ☐ = −36' }),
    Q.miPick({ q: 'การแจกแจงข้อใดถูกต้อง', opts: ['(−5) × (10 − 3) = (−50) − (−15)', '(−5) × (10 − 3) = (−50) − 3', '(−5) × (10 − 3) = 10 − (−15)'], right: '(−5) × (10 − 3) = (−50) − (−15)', hint: 'คูณ −5 เข้าไปทั้ง 10 และ 3' })]),
  LM1(15, 'ปากแม่น้ำสรุป', 'สรุปบทเรียน', 'สรุปจำนวนเต็ม', 'ทบทวนจำนวนเต็มทั้งบท: ชนิด การเปรียบเทียบ จำนวนตรงข้าม ค่าสัมบูรณ์ การบวก ลบ คูณ หาร และสมบัติ', [
    T('แตะการ์ดสรุปให้ครบทุกใบ', 'แตะการ์ดสรุปให้ครบทุกใบ', el => el.append(miCards([['จำนวนเต็ม', 'ลบ · ศูนย์ · บวก'], ['เทียบค่า', 'ทางขวา<br>มากกว่าเสมอ'], ['|a|', 'ระยะห่าง<br>จาก 0'], ['บวก', 'เหมือน: บวกค่า<br>ต่าง: มาก − น้อย'], ['ลบ', 'บวกด้วย<br>จำนวนตรงข้าม'], ['คูณ · หาร', 'เหมือน → บวก<br>ต่าง → ลบ'], ['÷ 0', 'หาค่าไม่ได้'], ['สมบัติ', 'สลับที่ · เปลี่ยนหมู่<br>แจกแจง']]))),
    T('ตัวอย่างทีละขั้น: <b>คูณ หาร ก่อน บวก ลบ</b>', 'ตัวอย่างทีละขั้น คูณหารก่อนบวกลบ', el => el.append(dcWalk('(−3) × 4 − (−18) ÷ 6', [['① คูณก่อน', '(−3) × 4 = −12'], ['② หาร', '(−18) ÷ 6 = −3'], ['③ ลบ', '(−12) − (−3) = (−12) + 3'], ['④ คำตอบ', '= −9']], '<b>(−3) × 4 − (−18) ÷ 6 = −9</b>')))
  ], () => [MIQ.k(-23), Q.miCmp({ a: -14, b: -41 }), Q.miOpp({ n: -66 }), MIQ.x('|−18| − |−7|'), MIQ.x('(−45) + 28'), MIQ.x('(−19) − (−31)'), MIQ.x('(−14) × (−5)'), MIQ.x('(−132) ÷ 11'),
    MIQ.x('(−2) × 9 + 30 ÷ (−5)', 'คูณหารก่อน แล้วค่อยบวก'), MIQ.x('20 − 4 × (−6)', 'คูณก่อน: 4 × (−6) = −24'), MIQ.x('(−5) × [3 − (−7)]', 'ทำในวงเล็บก่อน'),
    Q.miStory({ text: 'เรือเริ่มที่ท่าน้ำ (0) พายทวนน้ำไปทางเหนือ 14 กิโลเมตร (+14) แล้วถูกกระแสน้ำพัดกลับ 20 กิโลเมตร เรืออยู่ที่ตำแหน่งใด (กิโลเมตร)', expr: '14 + (−20)', wrong: ['14 + 20', '(−14) + 20'], unit: 'กม.', hint: 'ไปทางเหนือ = บวก · ถูกพัดกลับ = บวกด้วยจำนวนลบ' })])
];

/* =========================================================
   BOSS 2019 — จระเข้จำนวนเต็ม (20 ข้อ แต่งใหม่ทั้งหมด · ตัวลวง = ความผิดที่พบบ่อย)
   ========================================================= */
const EXAM_M1C1 = xrot([
  { q: 'ข้อใดเป็นจำนวนเต็มลบทั้งหมด', opts: ['−4, −12, −1', '−4, 0, −1', '−4, −1.5, −9', '4, −12, −1'], a: 0 },
  { q: 'ข้อใดถูกต้อง', opts: ['0 ไม่เป็นทั้งจำนวนเต็มบวกและจำนวนเต็มลบ', '0 เป็นจำนวนเต็มบวก', '0 เป็นจำนวนเต็มลบ', '0 ไม่เป็นจำนวนเต็ม'], a: 0 },
  { q: 'นักดำน้ำอยู่ต่ำกว่าระดับน้ำทะเล 25 เมตร เขียนแทนด้วยจำนวนเต็มใด', opts: ['−25', '25', '−2.5', '0'], a: 0 },
  { q: 'ข้อใดถูกต้อง', opts: ['−9 < −4', '−9 > −4', '−4 < −9', '−9 = −4'], a: 0 },
  { q: 'เรียงจากน้อยไปมาก ข้อใดถูกต้อง', opts: ['−11, −6, 0, 3, 8', '0, 3, −6, 8, −11', '3, −6, 8, −11, 0', '−6, −11, 0, 3, 8'], a: 0 },
  { q: 'อุณหภูมิของ 4 หมู่บ้านคือ −7, 2, −12, −1 °C หมู่บ้านใดหนาวที่สุด', opts: ['หมู่บ้านที่ −12 °C', 'หมู่บ้านที่ −1 °C', 'หมู่บ้านที่ 2 °C', 'หมู่บ้านที่ −7 °C'], a: 0 },
  { q: 'จำนวนตรงข้ามของ −38 คือข้อใด', opts: ['38', '−38', '0', '1/38'], a: 0 },
  { q: '|−15| + |6| มีค่าเท่าใด', opts: ['21', '9', '−9', '−21'], a: 0 },
  { q: '(−17) + (−26) มีค่าเท่าใด', opts: ['−43', '43', '−9', '9'], a: 0 },
  { q: '35 + (−52) มีค่าเท่าใด', opts: ['−17', '17', '−87', '87'], a: 0 },
  { q: '(−8) + 15 + (−9) มีค่าเท่าใด', opts: ['−2', '2', '−32', '16'], a: 0 },
  { q: '12 − (−9) มีค่าเท่าใด', opts: ['21', '3', '−21', '−3'], a: 0 },
  { q: '(−24) − 16 มีค่าเท่าใด', opts: ['−40', '−8', '8', '40'], a: 0 },
  { q: 'กลางวันอุณหภูมิ 4 °C กลางคืน −11 °C อุณหภูมิต่างกันกี่องศา', opts: ['15 องศา', '7 องศา', '−7 องศา', '−15 องศา'], a: 0 },
  { q: '(−12) × 7 มีค่าเท่าใด', opts: ['−84', '84', '−19', '−5'], a: 0 },
  { q: '(−3) × (−4) × (−5) มีค่าเท่าใด', opts: ['−60', '60', '−12', '12'], a: 0 },
  { q: '(−96) ÷ (−8) มีค่าเท่าใด', opts: ['12', '−12', '88', '−88'], a: 0 },
  { q: 'ข้อใดหาค่าไม่ได้', opts: ['(−7) ÷ 0', '0 ÷ (−7)', '0 × (−7)', '(−7) + 0'], a: 0 },
  { q: '(−6) × 15 + (−6) × 85 มีค่าเท่าใด', opts: ['−600', '600', '−90', '−510'], a: 0 },
  { q: 'ข้อใดไม่ถูกต้อง', opts: ['(−5) − 8 = 8 − (−5)', '(−5) + 8 = 8 + (−5)', '(−5) × 8 = 8 × (−5)', '[(−5) + 8] + 2 = (−5) + [8 + 2]'], a: 0 }
], 3);
/* v224 (ผู้ใช้ขอ): ด่านพิเศษหลังด่าน 8 — ถามตอบเร็ว 15 ข้อ การบวกและการลบจำนวนเต็มเท่านั้น · สุ่มใหม่ทุกครั้ง ง่าย → ยาก
   ข้อ 1–5 เลขหลักเดียว · 6–10 เลขสองหลัก · 11–15 สามจำนวน · วนครบ 7 แบบ (บวกลบ+ลบ, บวกต่างเครื่องหมาย 2 แบบ, ลบ 4 แบบ) */
function miQuick15() {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), P = miP, out = [], seen = new Set();
  const H = { same: 'เครื่องหมายเหมือนกัน: บวกค่าสัมบูรณ์ แล้วใส่เครื่องหมายเดิม', mix: 'ต่างเครื่องหมาย: มากลบน้อย ใช้เครื่องหมายของตัวที่ค่าสัมบูรณ์มากกว่า', sub: 'ลบ = บวกด้วยจำนวนตรงข้ามของตัวลบ' };
  const K = [(lo, hi) => [`${P(-R(lo, hi))} + ${P(-R(lo, hi))}`, H.same], (lo, hi) => [`${P(-R(lo, hi))} + ${R(lo, hi)}`, H.mix], (lo, hi) => [`${R(lo, hi)} + ${P(-R(lo, hi))}`, H.mix],
    (lo, hi) => [`${R(lo, hi)} − ${P(-R(lo, hi))}`, H.sub], (lo, hi) => [`${P(-R(lo, hi))} − ${R(lo, hi)}`, H.sub], (lo, hi) => [`${P(-R(lo, hi))} − ${P(-R(lo, hi))}`, H.sub], (lo, hi) => { const a = R(lo, hi); return [`${a} − ${a + R(lo, hi)}`, H.sub]; }];
  for (let i = 0, t = 0; out.length < 15 && t < 400; t++) { let e, hn; const k = (i + Math.floor(i / 7)) % 7;
    if (i < 5) [e, hn] = K[k](1, 9); else if (i < 10) [e, hn] = K[k](10, 40);
    else { const a = R(2, 30) * (Math.random() < .5 ? -1 : 1), b = R(2, 30) * (Math.random() < .5 ? -1 : 1), c = R(2, 30) * (Math.random() < .5 ? -1 : 1); e = `${P(a)} ${Math.random() < .5 ? '+' : '−'} ${P(b)} − ${P(c)}`; hn = 'ทำจากซ้ายไปขวา ลบ = บวกด้วยจำนวนตรงข้าม'; }
    if (seen.has(e)) continue; seen.add(e); out.push(MIQ.x(e, hn)); i++; }
  return out;
}
LESSONS_M1C1.splice(LESSONS_M1C1.findIndex(L => L.id === 2008) + 1, 0, { id: 2016, bonus: true, place: 'แก่งถามตอบ', title: 'ด่านพิเศษ: บวก ลบ จำนวนเต็ม 15 ข้อ', short: 'ถามตอบ บวก ลบ', tone: 'yellow', learned: true, noTeach: true, gameN: 15,
  goal: 'ฝึกบวกและลบจำนวนเต็มแบบถามตอบเร็ว 15 ข้อ (สุ่มใหม่ทุกครั้ง) เริ่มจากเลขหลักเดียว ไปสองหลัก และสามจำนวน', teach: [], game: miQuick15 });
/* v226 (ผู้ใช้ขอ): ด่านพิเศษหลังด่าน 12 — ถามตอบเร็ว 15 ข้อ การคูณและการหารจำนวนเต็มเท่านั้น · สุ่มใหม่ทุกครั้ง
   ข้อ 1–5 ตัวประกอบหลักเดียว · 6–10 ใหญ่ขึ้น (สองหลัก) · 11–15 สามจำนวน · หารลงตัวเสมอ · วนเครื่องหมายครบ 6 แบบ */
function miQuickMD15() {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), P = miP, sg = k => [[1, -1], [-1, 1], [-1, -1]][k % 3], out = [], seen = new Set();
  const H = { m: 'คูณ: เครื่องหมายเหมือนกันได้บวก ต่างกันได้ลบ', d: 'หาร: เครื่องหมายเหมือนกันได้บวก ต่างกันได้ลบ (ตรวจด้วยการคูณ)', t: 'ทำจากซ้ายไปขวา แล้วดูเครื่องหมายทีละขั้น' };
  for (let i = 0, t = 0; out.length < 15 && t < 400; t++) { let e, hn; const k = i % 2, [s1, s2] = sg(Math.floor(i / 2)); /* คู่ = คูณ คี่ = หาร · เครื่องหมายวน บวก×ลบ, ลบ×บวก, ลบ×ลบ */
    if (i < 10) { const big = i >= 5, a = big ? R(11, 25) : R(2, 9), b = big ? R(3, 9) : R(2, 9);
      if (k % 2 === 0) { e = `${P(s1 * a)} × ${P(s2 * b)}`; hn = H.m; } else { e = `${P(s1 * a * b)} ÷ ${P(s2 * b)}`; hn = H.d; } }
    else { const a = R(2, 9), b = R(2, 6), c = R(2, 5), x = Math.random() < .5 ? -1 : 1, y = Math.random() < .5 ? -1 : 1, z = Math.random() < .5 ? -1 : 1;
      e = i % 2 ? `${P(x * a * c)} ÷ ${P(z * c)} × ${P(y * b)}` : `${P(x * a)} × ${P(y * b * c)} ÷ ${P(z * c)}`; hn = H.t; }
    if (seen.has(e)) continue; seen.add(e); out.push(MIQ.x(e, hn)); i++; }
  return out;
}
LESSONS_M1C1.splice(LESSONS_M1C1.findIndex(L => L.id === 2012) + 1, 0, { id: 2017, bonus: true, place: 'แก่งคูณหาร', title: 'ด่านพิเศษ: คูณ หาร จำนวนเต็ม 15 ข้อ', short: 'ถามตอบ คูณ หาร', tone: 'yellow', learned: true, noTeach: true, gameN: 15,
  goal: 'ฝึกคูณและหารจำนวนเต็มแบบถามตอบเร็ว 15 ข้อ (สุ่มใหม่ทุกครั้ง) เริ่มจากเลขหลักเดียว ไปสองหลัก และสามจำนวน', teach: [], game: miQuickMD15 });
LESSONS_M1C1.find(L => L.id === 2008).pracQ = () => miDiffQ(6, -2);
LESSONS_M1C1.find(L => L.id === 2010).pracQ = () => MIQ.x('(−6) × (−4)', 'ลบ × ลบ ได้บวก · 6 × 4 = 24'); /* v224 (ผู้ใช้ขอ): ลองทำเองแบบ 2 จำนวนก่อน */ /* v223 (ผู้ใช้ขอ): ลองทำเองแบบปกติก่อน ไม่ใช่โจทย์ปัญหา */
LESSONS_M1C1.push({ id: 2019, boss: true, place: 'วังจระเข้', title: 'ด่านบอส: ม.1 บทที่ 1 จำนวนเต็ม', short: 'ด่านบอส · ข้อสอบ', tone: 'jade',
  goal: 'ตอบคำถามเรื่องจำนวนเต็ม 20 ข้อ ตอบถูก 16 ข้อขึ้นไปเพื่อชนะจระเข้',
  exam: EXAM_M1C1, pass: 16, bossName: 'จระเข้จำนวนเต็ม', bossPal: 'green', emblem: '±', bossKind: 'croc',
  winLine: 'ชนะจระเข้จำนวนเต็มแล้ว! บวก ลบ คูณ หาร จำนวนเต็มได้คล่องมาก', loseLine: 'จระเข้ยังเฝ้าวังน้ำอยู่ กลับไปทวนแล้วมาสู้ใหม่นะ!' });
