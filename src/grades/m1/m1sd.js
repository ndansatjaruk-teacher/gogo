/* =========================================================
   ม.1 บทที่ 5 รูปเรขาคณิตสองมิติและสามมิติ — หน้าสอน (v275 · ผู้ใช้ขอ) · prefix s5d
   ดูภาพ = กระดานครู (d1dBoard ขึ้นทีละประเด็น รอแตะ/Space) → ลงมือเอง (หมุนรูปทรง แตะนับ พับภาพคลี่ ตัดด้วยระนาบ ต่อบล็อก)
   → ทำให้ดู (r4dShow / e1dEq) → ลองทำ (ข้อจากเกมของด่านนั้น — e1dTry) · ไม่มีตัวเลื่อน/ปุ่มเพิ่มลด: ลากกับแตะเท่านั้น
   ========================================================= */
const s5dB = (title, beats, fin, o = {}) => d1dBoard(title, { W: o.W || 400, H: o.H || 240, beats, fin });
const s5dTry = (id, sigs, title) => e1dTry(id, sigs, title);
/* where a 3-D point lands in a picture drawn with the same view settings */
const s5dXY = (p, o = {}) => { const q = s5Rot(p, o.yaw ?? .62, o.pit ?? .42), W = o.W || 400, H = o.H || 240; return [s5N((o.cx ?? W / 2) + q[0] * (o.sc || 52)), s5N((o.cy ?? H / 2 + 6) - q[1] * (o.sc || 52))]; };
const s5dDot = (x, y, col = S5C.p, r = 6.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="#fff" stroke-width="2"/>`;
const s5dLine = (a, b, col = S5C.p, w = 5) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
const s5dPoly = (P, col = '#FF8FB0', op = .8) => `<polygon points="${P.map(p => p.join(',')).join(' ')}" fill="${col}" fill-opacity="${op}" stroke="${S5C.p}" stroke-width="2.4" stroke-linejoin="round"/>`;
const s5dChips = (labels, on, cls = '') => { const row = h('div', { class: 's5chips ia ' + cls }); labels.forEach((t, i) => row.append(h('button', { class: 'btn sm s5chip' + (i === 0 ? ' on' : ''), onclick: e => { e.stopPropagation(); row.querySelectorAll('.s5chip').forEach((b, j) => b.classList.toggle('on', j === i)); sfx.tap(); on(i); } }, t))); return row; };
const s5dMis = () => h('div', { class: 's5mis' });
const s5dSetMis = (el, list, k, extra = '') => { el.innerHTML = list.map((t, i) => `<span class="${i < k ? 'ok' : i === k ? 'now' : ''}">${i < k ? '✓ ' : ''}${t}</span>`).join('') + extra; };

/* ① tap the right pictures (sorting) */
function s5dTapSet(title, say, items, cap) {
  return T(`<b>ลงมือเอง</b> — ${title}`, `ลงมือเอง ${say}`, el => { const msg = h('div', { class: 's5tip', html: cap }), want = items.filter(x => x.ok).length; let done = false;
    const grid = h('div', { class: 's5grid ia' }), check = () => { const on = [...grid.children].map((b, i) => b.classList.contains('on') === !!items[i].ok); if (on.every(Boolean) && !done) { done = true; msg.innerHTML = `<b>ถูกต้องครบ ${want} รูป!</b> ` + ((items.find(x => x.why) || {}).why || ''); sfx.ok(); teachDone(el); } };
    items.forEach(it => grid.append(h('button', { class: 's5card', html: it.svg, onclick: e => { e.stopPropagation(); if (done) return; e.currentTarget.classList.toggle('on'); sfx.tap(); check(); } })));
    el.append(h('div', { class: 'colstack s5pg' }, msg, grid, h6wait())); }); }

/* ② turn solids around (chips choose the solid) */
function s5dSpin() {
  return T('<b>ลงมือเอง</b> — หมุนดูรูปทรงสามมิติ', 'ลงมือเอง หมุนดูรูปทรงสามมิติ', el => { const ks = ['cube', 'cyl', 'cone', 'pyr4', 'prism3', 'sph'], seen = new Set(); let k = 0, acc = 0, last = null;
    const name = h('div', { class: 's5name' }), mis = s5dMis(), host = h('div', { class: 's5host' }), show = () => { host.innerHTML = ''; last = null; acc = 0; name.innerHTML = `<b>${S5_NAME[ks[k]]}</b>`;
      host.append(s5View(s5Solid(ks[k]), { W: 400, H: 260, sc: 62, hid: true, onTurn: (y) => { if (last != null) acc += Math.abs(y - last); last = y; if (acc > 2.2 && !seen.has(k)) { seen.add(k); sfx.ok(); upd(); } } })); };
    const upd = () => { s5dSetMis(mis, ['หมุนรูปทรงที่ 1', 'หมุนรูปทรงที่ 2', 'หมุนรูปทรงที่ 3'], Math.min(3, seen.size), seen.size >= 3 ? ' <b>เยี่ยม! เห็นทุกด้านของรูปทรงแล้ว</b>' : ''); if (seen.size >= 3) teachDone(el); };
    el.append(h('div', { class: 'colstack s5pg' }, h('div', { class: 's5tip', html: 'เลือกรูปทรง แล้ว<b>ลากบนรูปเพื่อหมุน</b> ดูให้ครบทุกด้าน (เส้นประ = ส่วนที่ถูกบัง)' }), s5dChips(ks.map(x => S5_NAME[x]), i => { k = i; show(); }), name, host, mis, h6wait()));
    show(); upd(); }); }

/* ③ tap to count: vertices / edges / faces (missions in a row) */
function s5dCount(list) {
  return T('<b>ลงมือเอง</b> — แตะนับ จุดยอด สัน หน้า', 'ลงมือเอง แตะนับ จุดยอด สัน หน้า', el => { let m = 0; const mis = s5dMis(), host = h('div', { class: 's5host' }), cnt = h('div', { class: 's5cnt' }), word = { v: 'จุดยอด', e: 'สัน', f: 'หน้า' };
    const load = () => { host.innerHTML = ''; if (m >= list.length) { s5dSetMis(mis, list.map(x => x.t), m, ' <b>ครบทุกภารกิจ!</b>'); cnt.textContent = ''; teachDone(el); return; } const x = list[m], S = s5Solid(x.k), need = x.what === 'v' ? S.V.length : x.what === 'e' ? S.E.length : S.F.length;
      s5dSetMis(mis, list.map(y => y.t), m); cnt.innerHTML = `แตะแล้ว <b>0</b> / ${need} ${word[x.what]}`;
      host.append(s5View(S, { W: 400, H: 260, sc: 62, pick: x.what, hid: true, onPick: (_, __, mk) => { const n = mk[x.what].size; cnt.innerHTML = `แตะแล้ว <b>${n}</b> / ${need} ${word[x.what]}`; if (n === need) { sfx.ok(); cnt.innerHTML = `<b>ครบ ${need} ${word[x.what]}!</b>`; m++; setTimeout(load, 1100); } } })); };
    el.append(h('div', { class: 'colstack s5pg' }, h('div', { class: 's5tip', html: '<b>ลากเพื่อหมุน</b> · <b>แตะ</b>เพื่อทำเครื่องหมาย (แตะซ้ำ = เอาออก) · หมุนไปดูด้านหลังด้วย' }), mis, host, cnt, h6wait())); load(); }); }

/* ④ look from the front / right side / top (the stack turns to that view) */
function s5dViews(Hs) {
  return T('<b>ลงมือเอง</b> — มองจากด้านหน้า ด้านข้าง ด้านบน', 'ลงมือเอง มองจากด้านหน้า ด้านข้าง ด้านบน', el => { const T0 = s5Stack(Hs), V = s5Views(Hs), seen = new Set(), pic = h('div', { class: 's5vpic' }), mis = s5dMis();
    const view = h('div', { class: 's5v ia' }); let yaw = .62, pit = .5, anim = 0; const draw = () => { view.innerHTML = s5Svg(s5DrawStack(T0, { W: 400, H: 260, sc: 40, yaw, pit }), 400, 260, 's5svg'); };
    let st = null; view.addEventListener('pointerdown', e => { st = { x: e.clientX, y: e.clientY }; try { view.setPointerCapture(e.pointerId); } catch (_) { } }); view.addEventListener('pointermove', e => { if (!st) return; yaw += (e.clientX - st.x) * .012; pit = Math.max(-.2, Math.min(1.57, pit + (e.clientY - st.y) * .012)); st = { x: e.clientX, y: e.clientY }; draw(); }); view.addEventListener('pointerup', () => { st = null; });
    const go = (y2, p2) => { cancelAnimationFrame(anim); const y0 = yaw, p0 = pit, t0 = performance.now(), dy = ((y2 - y0 + Math.PI * 3) % (Math.PI * 2)) - Math.PI; const f = now => { const t = Math.min(1, (now - t0) / 800), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; yaw = y0 + dy * e; pit = p0 + (p2 - p0) * e; draw(); if (t < 1) anim = requestAnimationFrame(f); }; anim = requestAnimationFrame(f); };
    const B = [['ด้านหน้า', 0, 0, 'front'], ['ด้านข้าง (ขวา)', -Math.PI / 2, 0, 'side'], ['ด้านบน', 0, Math.PI / 2, 'top']];
    const upd = () => { s5dSetMis(mis, ['มองด้านหน้า', 'มองด้านข้าง', 'มองด้านบน'].filter((_, i) => true), seen.size, seen.size >= 3 ? ' <b>ภาพสามทิศครบแล้ว!</b>' : ''); if (seen.size >= 3) teachDone(el); };
    const row = h('div', { class: 's5chips ia' }, ...B.map(([t, y, p, k]) => h('button', { class: 'btn sm s5chip', onclick: e => { e.stopPropagation(); row.querySelectorAll('.s5chip').forEach(b => b.classList.toggle('on', b === e.currentTarget)); sfx.tap(); go(y, p); pic.innerHTML = `<b>ภาพ${t}</b>` + s5ViewPic(V[k], { W: 170, H: 130 }); seen.add(k); upd(); } }, t)));
    el.append(h('div', { class: 'colstack s5pg' }, h('div', { class: 's5tip', html: 'แตะปุ่มเพื่อหมุนไปมองจากทิศนั้น (ลากเพื่อหมุนเองก็ได้) แล้วดู<b>ภาพสองมิติ</b>ที่เห็น' }), row, h('div', { class: 's5two' }, view, pic), mis, h6wait())); draw(); upd(); }); }

/* ⑤ fold nets for real (buttons fold / unfold; drag to turn) */
function s5dFold() {
  return T('<b>ลงมือเอง</b> — พับภาพคลี่', 'ลงมือเอง พับภาพคลี่', el => { const L = [['ลูกบาศก์', () => s5NetGrid(S5_CUBE_NETS[0])], ['ทรงสี่เหลี่ยมมุมฉาก', () => s5NetCuboid()], ['ปริซึมสามเหลี่ยม', () => s5NetPrism(3)], ['ปริซึมหกเหลี่ยม', () => s5NetPrism(6, 1)], ['พีระมิดฐานสี่เหลี่ยม', () => s5NetPyr(4)], ['พีระมิดฐานห้าเหลี่ยม', () => s5NetPyr(5, 1.3)]];
    let N = L[0][1](), k = 0, t = 0, yaw = .5, pit = .75, anim = 0; const seen = new Set(), mis = s5dMis(), view = h('div', { class: 's5v ia' }), lab = h('div', { class: 's5name' });
    const draw = () => { view.innerHTML = s5Svg(s5DrawNet(N, t, { W: 400, H: 260, yaw, pit }), 400, 260, 's5svg'); lab.innerHTML = t > .99 ? `พับเสร็จ = <b>${L[k][0]}</b>` : t < .01 ? 'ภาพคลี่ (แบนราบ)' : 'กำลังพับ…'; };
    const run = to => { cancelAnimationFrame(anim); const t0 = t, s = performance.now(), ms = 1500 * Math.abs(to - t0) + 200; const f = now => { const u = Math.min(1, (now - s) / ms); t = t0 + (to - t0) * (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2); draw(); if (u < 1) anim = requestAnimationFrame(f); else if (to === 1 && !seen.has(k)) { seen.add(k); sfx.ok(); upd(); } }; anim = requestAnimationFrame(f); };
    let st = null; view.addEventListener('pointerdown', e => { st = { x: e.clientX, y: e.clientY }; try { view.setPointerCapture(e.pointerId); } catch (_) { } }); view.addEventListener('pointermove', e => { if (!st) return; yaw += (e.clientX - st.x) * .012; pit = Math.max(.05, Math.min(1.5, pit + (e.clientY - st.y) * .012)); st = { x: e.clientX, y: e.clientY }; draw(); }); view.addEventListener('pointerup', () => { st = null; });
    const upd = () => { s5dSetMis(mis, ['พับแบบที่ 1', 'พับแบบที่ 2', 'พับแบบที่ 3'], Math.min(3, seen.size), seen.size >= 3 ? ' <b>เก่งมาก! เห็นแล้วว่าภาพคลี่พับเป็นรูปทรงได้อย่างไร</b>' : ''); if (seen.size >= 3) teachDone(el); };
    const btns = h('div', { class: 's5chips ia' }, h('button', { class: 'btn primary s5go', onclick: e => { e.stopPropagation(); sfx.tap(); run(1); } }, h('span', null, 'พับ ▲')), h('button', { class: 'btn s5go', onclick: e => { e.stopPropagation(); sfx.tap(); run(0); } }, h('span', null, 'คลี่ ▼')));
    el.append(h('div', { class: 'colstack s5pg' }, h('div', { class: 's5tip', html: 'เลือกภาพคลี่ แล้วกด <b>พับ</b> ดูว่ากลายเป็นรูปทรงอะไร (ลากเพื่อหมุนดูได้)' }), s5dChips(L.map(x => x[0]), i => { k = i; N = L[i][1](); t = 0; cancelAnimationFrame(anim); draw(); }), view, h('div', { class: 's5bar2' }, lab, btns), mis, h6wait())); draw(); upd(); }); }

/* ⑥ build with cubes: tap a square of the floor plan to stack (1 → 2 → 3 → empty) */
function s5dBuild(title, missions, o = {}) {
  return T(`<b>ลงมือเอง</b> — ${title}`, `ลงมือเอง ${title}`, el => { const R = o.R || 3, C = o.C || 3, Hs = Array.from({ length: R }, () => new Array(C).fill(0)); let m = 0, yaw = .62, pit = .55;
    const view = h('div', { class: 's5v ia' }), plan = h('div', { class: 's5plan ia', style: { gridTemplateColumns: `repeat(${C}, 1fr)` } }), mis = s5dMis(), goal = h('div', { class: 's5goal' });
    const draw = () => { view.innerHTML = s5Svg(s5DrawStack(s5Stack(Hs), { W: 360, H: 250, sc: 36, yaw, pit }), 360, 250, 's5svg'); [...plan.children].forEach((b, i) => { const v = Hs[Math.floor(i / C)][i % C]; b.textContent = v || ''; b.classList.toggle('on', v > 0); }); };
    const check = () => { let hit = false; while (m < missions.length && missions[m].ok(Hs)) { hit = true; m++; if (m < missions.length && missions[m].reset) Hs.forEach(r => r.fill(0)); } if (hit) { sfx.ok(); draw(); show(); } };
    const show = () => { s5dSetMis(mis, missions.map(x => x.t), m, m >= missions.length ? ' <b>ภารกิจสำเร็จทั้งหมด!</b>' : ''); goal.innerHTML = m < missions.length && missions[m].pic ? missions[m].pic : ''; if (m >= missions.length) teachDone(el); };
    for (let i = 0; i < R * C; i++) plan.append(h('button', { class: 's5cell', onclick: e => { e.stopPropagation(); if (m >= missions.length) return; const r = Math.floor(i / C), c = i % C; Hs[r][c] = (Hs[r][c] + 1) % 4; sfx.tap(); draw(); check(); } }));
    let st = null; view.addEventListener('pointerdown', e => { st = { x: e.clientX, y: e.clientY }; try { view.setPointerCapture(e.pointerId); } catch (_) { } }); view.addEventListener('pointermove', e => { if (!st) return; yaw += (e.clientX - st.x) * .012; pit = Math.max(0, Math.min(1.5, pit + (e.clientY - st.y) * .012)); st = { x: e.clientX, y: e.clientY }; draw(); }); view.addEventListener('pointerup', () => { st = null; });
    el.append(h('div', { class: 'colstack s5pg' }, h('div', { class: 's5tip', html: 'แตะช่องบน<b>แผนผังพื้น</b> เพื่อวางลูกบาศก์ซ้อนขึ้นไป (1 → 2 → 3 → ว่าง) · ลากรูปเพื่อหมุน' }), mis, h('div', { class: 's5two' }, h('div', { class: 'colstack s5planw' }, h('div', { class: 's5small' }, 'แผนผังพื้น (ด้านหน้าอยู่ล่าง)'), plan, goal), view), h6wait())); draw(); show(); }); }

/* ⑦ cut with a plane: choose the solid and the direction, drag the purple handle to move the plane */
function s5dCut() {
  return T('<b>ลงมือเอง</b> — ตัดรูปทรงด้วยระนาบ', 'ลงมือเอง ตัดรูปทรงด้วยระนาบ', el => { const ks = ['cuboid', 'cyl', 'cone', 'sph', 'pyr4'], dirs = [['ขนานกับฐาน', [0, 1, 0]], ['ตั้งฉากกับฐาน', [1, 0, 0]], ['เฉียง', [.45, 1, 0]]];
    let k = 0, di = 0, d = .2, S = s5Solid(ks[0]); const want = ['รูปวงกลม', 'รูปสี่เหลี่ยม', 'รูปสามเหลี่ยม', 'รูปวงรี'], found = new Set(), mis = s5dMis(), pic = h('div', { class: 's5vpic' }), W = 400, H = 270, sc = 56;
    const kind = Cc => { if (!Cc) return ''; const n = Cc.P.length; if (n === 3) return 'รูปสามเหลี่ยม'; if (n === 4) return 'รูปสี่เหลี่ยม'; if (n <= 8) return `รูป${S5_POLY[n] || n + ' เหลี่ยม'}`; const xs = Cc.flat.map(p => p[0]), ys = Cc.flat.map(p => p[1]), a = (Math.max(...xs) - Math.min(...xs)) / (Math.max(...ys) - Math.min(...ys)); return a > .93 && a < 1.07 ? 'รูปวงกลม' : 'รูปวงรี'; };
    const over = (yaw, pit) => { const n = s5Unit(dirs[di][1]), Cc = s5Cut(S, n, d), u = s5Unit(Math.abs(n[1]) < .9 ? s5Crs(n, [0, 1, 0]) : s5Crs(n, [1, 0, 0])), v = s5Crs(n, u), c0 = s5Mul(n, d), R = 2, P = p => s5dXY(p, { W, H, sc, yaw, pit, cy: H / 2 + 6 });
      const quad = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => P(s5Add(c0, s5Add(s5Mul(u, a * R), s5Mul(v, b * R))))), g = P(s5Add(c0, s5Mul(u, R)));
      const kd = kind(Cc); pic.innerHTML = Cc ? `หน้าตัด: <b>${kd}</b>` + s5CutPic(Cc, { W: 170, H: 130 }) : 'ระนาบยังไม่ผ่านรูปทรง<br>ลากจุดม่วงเข้ามา' ; if (Cc && want.includes(kd) && !found.has(kd)) { found.add(kd); sfx.ok(); setTimeout(upd, 0); }
      return `<polygon points="${quad.map(p => p.join(',')).join(' ')}" fill="#7C5CE0" fill-opacity=".13" stroke="#7C5CE0" stroke-width="1.6" stroke-dasharray="6 4"/>` + (Cc ? s5dPoly(Cc.P.map(P), '#FF8FB0', .85) : '') + `<circle cx="${g[0]}" cy="${g[1]}" r="15" fill="#7C5CE0" stroke="#fff" stroke-width="3" data-grip="1" class="s5grip"/><text x="${g[0]}" y="${g[1] + 5}" text-anchor="middle" class="s5gt">⇕</text>`; };
    const host = h('div', { class: 's5host' }); let V = null; const make = () => { host.innerHTML = ''; S = s5Solid(ks[k]); V = s5View(S, { W, H, sc, hid: true, xray: true, yaw: .55, pit: .32, over, onGrip: (dx, dy) => { const n = s5Unit(dirs[di][1]); d = Math.max(-1.9, Math.min(1.9, n[1] > .5 ? d - dy / sc : d + dx / sc)); if (Math.abs(d) < .1) d = 0; /* ดูดเข้าที่กึ่งกลาง (ผ่านจุดยอด/แกนกลาง) */ } /* ระนาบนอน/เฉียง: ลากขึ้น–ลง · ระนาบตั้ง: ลากซ้าย–ขวา */ }); host.append(V); };
    const upd = () => { s5dSetMis(mis, want.map(t => 'หา' + t), found.size, found.size >= 4 ? ' <b>หาหน้าตัดครบ 4 แบบแล้ว!</b>' : ''); [...mis.children].forEach((sp, i) => sp.className = found.has(want[i]) ? 'ok' : ''); if (found.size >= 4) teachDone(el); };
    el.append(h('div', { class: 'colstack s5pg' }, h('div', { class: 's5tip', html: 'เลือกรูปทรงและแนวระนาบ แล้ว<b>ลากจุดม่วง</b>เพื่อเลื่อนระนาบ (ลากที่อื่น = หมุนรูป) หาหน้าตัดให้ครบ 4 แบบ' }), s5dChips(ks.map(x => S5_NAME[x]), i => { k = i; d = di === 1 ? 0 : ks[i] === 'cone' && di === 2 ? -.25 : .2; make(); }), s5dChips(dirs.map(x => x[0]), i => { di = i; d = i === 1 ? 0 : ks[k] === 'cone' && i === 2 ? -.25 : .2; V.draw(); }, 's5dir'), h('div', { class: 's5two' }, host, pic), mis, h6wait()));
    make(); upd(); }); }

/* ⑧ which face is opposite? tap a square of the net, then watch it fold */
function s5dOpp(list) {
  return T('<b>ลงมือเอง</b> — หน้าใดอยู่ตรงข้าม', 'ลงมือเอง หน้าใดอยู่ตรงข้าม', el => { let m = 0, t = 0, anim = 0; const mis = s5dMis(), flat = h('div', { class: 's5netw ia' }), view = h('div', { class: 's5v' }), msg = h('div', { class: 's5tip' });
    const load = () => { if (m >= list.length) { s5dSetMis(mis, list.map((_, i) => `ภาพคลี่ที่ ${i + 1}`), m, ' <b>ครบแล้ว! พับในใจได้เก่งมาก</b>'); teachDone(el); return; } const [cells, a] = list[m], opp = s5Opp(cells), N = s5NetGrid(cells).map(f => ({ ...f, c: f.cell === a ? '#FF8FB0' : '#FFF6D9', lab: 'ABCDEF'[f.cell] })); t = 0;
      s5dSetMis(mis, list.map((_, i) => `ภาพคลี่ที่ ${i + 1}`), m); msg.innerHTML = `หน้า <b>${'ABCDEF'[a]}</b> (สีชมพู) — แตะหน้าที่จะอยู่<b>ตรงข้าม</b>เมื่อพับเป็นลูกบาศก์`;
      flat.innerHTML = s5NetFlat(N, { W: 300, H: 210, cls: 's5svg' }); view.innerHTML = s5Svg(s5DrawNet(N, 0, { W: 300, H: 210 }), 300, 210, 's5svg');
      flat.querySelectorAll('polygon').forEach((p, i) => { p.style.cursor = 'pointer'; p.addEventListener('click', e => { e.stopPropagation(); const c = N[i].cell; if (c === a) return;
        if (c === opp[a]) { sfx.ok(); msg.innerHTML = `<b>ถูกต้อง!</b> หน้า ${'ABCDEF'[c]} อยู่ตรงข้ามกับหน้า ${'ABCDEF'[a]} — ดูตอนพับ`; const N2 = N.map(f => ({ ...f, c: f.cell === a || f.cell === c ? '#FF8FB0' : '#FFF6D9' })), s = performance.now(); cancelAnimationFrame(anim);
          const f = now => { const u = Math.min(1, (now - s) / 1600); t = u; view.innerHTML = s5Svg(s5DrawNet(N2, t, { W: 300, H: 210, yaw: .5 + u * 1.2, pit: .8 }), 300, 210, 's5svg'); if (u < 1) anim = requestAnimationFrame(f); else { m++; setTimeout(load, 1400); } }; anim = requestAnimationFrame(f); }
        else { sfx.no(); msg.innerHTML = `หน้า ${'ABCDEF'[c]} พับแล้ว<b>ติดกับ</b>หน้า ${'ABCDEF'[a]} — ลองหน้าที่เว้นไปหนึ่งช่องในแถวเดียวกัน`; } }); }); };
    el.append(h('div', { class: 'colstack s5pg' }, msg, h('div', { class: 's5two' }, flat, view), mis, h6wait())); load(); }); }

const S5D_TEACH = {
  2501: L => [
    s5dB('รูปเรขาคณิตสองมิติ', [[s5Sh('tri', 20, 30, 110, 90).s + s5Sh('sq', 145, 30, 110, 90).s + s5Sh('circ', 270, 30, 110, 90).s, 'รูปที่วาดบนกระดาษแบน ๆ มีแค่<b>ความกว้าง</b>กับ<b>ความยาว</b> = รูปสองมิติ'],
      [s5T(75, 150, 'สามเหลี่ยม') + s5T(200, 150, 'สี่เหลี่ยม') + s5T(325, 150, 'วงกลม'), 'เรียกชื่อตามรูปร่าง: นับด้าน หรือดูว่าเป็นเส้นโค้ง'],
      [s5Sh('pent', 30, 165, 90, 70, { col: '#9EE6C0' }).s + s5T(140, 205, 'รูปปิด', S5C.g, 's5l', 'start') + s5Sh('open3', 220, 165, 90, 70).s + s5T(330, 205, 'รูปเปิด', S5C.p, 's5l', 'start'), '<b>รูปปิด</b> เส้นรอบรูปต่อกันครบ · <b>รูปเปิด</b> มีปลายเส้นไม่ต่อกัน'.replace(' · ', ' ')]], 'รูปสองมิติ = กว้าง × ยาว ไม่มีความหนา · แยกได้เป็นรูปปิด/เปิด ด้านตรง/ด้านโค้ง'.replace(' · ', ', ')),
    s5dTapSet('แตะรูปที่มีด้านโค้ง', 'แตะรูปที่มีด้านโค้ง', shuffle([{ svg: s5ShPic('circ'), ok: 1, why: 'วงกลม วงรี ครึ่งวงกลม มีเส้นโค้ง' }, { svg: s5ShPic('semi'), ok: 1 }, { svg: s5ShPic('ell'), ok: 1 }, { svg: s5ShPic('tri') }, { svg: s5ShPic('hex') }, { svg: s5ShPic('trap') }]), 'แตะทุกรูปที่มี<b>ด้านโค้ง</b> (แตะซ้ำ = เอาออก)'),
    s5dTry(2501, ['name', 'closed', 'curve'], 'รูปสองมิติ')],
  2502: L => { const n = 6, P = s5Sh('hex', 60, 20, 280, 200).P, c = s5Avg(P.map(p => [...p, 0])), Lb = 'ABCDEF';
    return [
      s5dB('จุดยอด ด้าน มุม เส้นทแยงมุม', [[s5Sh('hex', 60, 20, 280, 200, { col: '#E6F2FF' }).s, 'รูปหกเหลี่ยม'], [P.map(p => s5dDot(s5N(p[0]), s5N(p[1]))).join('') + P.map((p, i) => { const d = s5Unit([p[0] - c[0], p[1] - c[1], 0]); return s5T(p[0] + d[0] * 18, p[1] + d[1] * 18 + 6, Lb[i]); }).join(''), '<b>จุดยอด</b> = จุดที่ด้านสองด้านมาพบกัน: 6 จุด'],
        [s5dLine(P[0], P[1], S5C.b, 5) + s5dLine(P[1], P[2], S5C.b, 5), '<b>ด้าน</b> = ส่วนของเส้นตรงรอบรูป: 6 ด้าน'], [[2, 3, 4].map(j => `<line x1="${s5N(P[0][0])}" y1="${s5N(P[0][1])}" x2="${s5N(P[j][0])}" y2="${s5N(P[j][1])}" stroke="${S5C.g}" stroke-width="2.6" stroke-dasharray="7 5"/>`).join(''), '<b>เส้นทแยงมุม</b> เชื่อมจุดยอดที่ไม่ติดกัน: จาก A ลากได้ 6 − 3 = 3 เส้น']],
        'ด้าน = จุดยอด = มุม (n) · จากจุดยอดหนึ่งลากเส้นทแยงมุมได้ n − 3 เส้น'.replace(' · ', ', ')),
      r4dShow('นับเส้นทแยงมุมทั้งหมดของรูปหกเหลี่ยม', { W: 400, H: 240, fig: s5Sh('hex', 60, 20, 280, 200, { col: '#E6F2FF' }).s, q: 'รูปหกเหลี่ยมมีเส้นทแยงมุมทั้งหมดกี่เส้น',
        steps: [{ ink: [2, 3, 4].map(j => s5dLine(P[0], P[j], S5C.g, 2.4)).join(''), w: 'จาก A ลากได้ 3 เส้น', n: 'n − 3 = 6 − 3' }, { ink: [3, 4, 5].map(j => s5dLine(P[1], P[j], S5C.b, 2.4)).join(''), w: 'ทุกจุดยอดลากได้ 3 เส้น', n: '6 จุด × 3 = 18' }, { w: 'แต่ AC กับ CA คือเส้นเดียวกัน', n: 'นับซ้ำสองครั้ง → ÷ 2' }, { w: '18 ÷ 2 = 9 เส้น', n: 'n(n − 3) ÷ 2', ans: 1 }],
        fin: 'เส้นทแยงมุมทั้งหมด = <b>n(n − 3) ÷ 2</b>', say: 'เส้นทแยงมุมทั้งหมด เท่ากับ n คูณ n ลบ 3 หารสอง' }),
      s5dTry(2502, ['vtx', 'side', 'dv'], 'ส่วนประกอบของรูปสองมิติ')]; },
  2503: L => [
    s5dB('จากสองมิติเป็นสามมิติ', [[s5Sh('sq', 30, 70, 120, 110, { col: '#A7C7FF' }).s, 'สี่เหลี่ยมจัตุรัส: กว้างกับยาว (สองมิติ)'], [s5Draw(s5Solid('cube', { a: 1.6 }), { W: 400, H: 240, cx: 290, cy: 128, sc: 52, hid: true }), 'เพิ่ม<b>ความสูง (ความหนา)</b> → ลูกบาศก์ (สามมิติ)'],
      [s5dLine([175, 125], [215, 125], S5C.p, 3) + `<path d="M207 118 L216 125 L207 132" fill="none" stroke="${S5C.p}" stroke-width="3"/>` + s5T(195, 110, '+ สูง', S5C.p), 'รูปสามมิติจับต้องได้ มีที่ว่างข้างใน']], 'รูปสามมิติ = กว้าง + ยาว + สูง'),
    s5dB('ชื่อรูปทรงที่พบบ่อย', [[s5Draw(s5Solid('cube', { a: 1.3 }), { W: 400, H: 240, cx: 70, cy: 80, sc: 40 }) + s5T(70, 150, 'ลูกบาศก์'), 'ลูกบาศก์ ทุกหน้าเป็นสี่เหลี่ยมจัตุรัส'], [s5Draw(s5Solid('cyl', { r: .9, h: 1.7 }), { W: 400, H: 240, cx: 200, cy: 80, sc: 40 }) + s5T(200, 150, 'ทรงกระบอก'), 'ทรงกระบอก ฐานเป็นวงกลม 2 ฐาน'],
      [s5Draw(s5Solid('cone', { r: 1, h: 1.9 }), { W: 400, H: 240, cx: 330, cy: 80, sc: 40 }) + s5T(330, 150, 'กรวย'), 'กรวย ฐานวงกลม มียอดแหลม'], [s5Draw(s5Solid('sph', { r: .95 }), { W: 400, H: 240, cx: 70, cy: 195, sc: 30 }) + s5T(140, 205, 'ทรงกลม', S5C.ink, 's5l', 'start') + s5Draw(s5Solid('pyr4', { r: 1, h: 1.4 }), { W: 400, H: 240, cx: 290, cy: 192, sc: 30 }) + s5T(350, 205, 'พีระมิด', S5C.ink, 's5l', 'start'), 'ทรงกลม มีแต่ผิวโค้ง · พีระมิด หน้าข้างเป็นสามเหลี่ยมมาพบกันที่ยอด'.replace(' · ', ' ')]], 'ดูหน้า ผิวโค้ง และยอด เพื่อเรียกชื่อรูปทรง'),
    s5dSpin(),
    s5dTry(2503, ['nm', 'obj', 'coin'], 'รูปเรขาคณิตสามมิติ')],
  2504: L => { const S = s5Solid('cube'), o = { W: 400, H: 240, sc: 58, hid: true }, X = j => s5dXY(S.V[j], o);
    return [
      s5dB('หน้า สัน จุดยอด', [[s5Draw(S, o), 'ลูกบาศก์ (เส้นประ = สันด้านหลังที่ถูกบัง)'], [s5dPoly([2, 3, 7, 6].map(X), '#FF8FB0', .55), '<b>หน้า</b> = พื้นผิวเรียบ ลูกบาศก์มี 6 หน้า'], [s5dLine(X(6), X(5), S5C.b, 6), '<b>สัน</b> = เส้นที่หน้าสองหน้ามาพบกัน มี 12 เส้น'], [s5dDot(...X(6), S5C.g, 8), '<b>จุดยอด</b> = จุดที่สันมาพบกัน มี 8 จุด']], 'ลูกบาศก์: หน้า 6 สัน 12 จุดยอด 8'),
      s5dB('หน้าราบกับผิวโค้ง', [[s5Draw(s5Solid('cyl', { r: 1, h: 1.8 }), { W: 400, H: 240, cx: 110, sc: 52, hid: true }), 'ทรงกระบอก: <b>หน้าราบ</b> 2 หน้า (วงกลมบน–ล่าง)'], [s5T(110, 228, 'ผิวโค้ง 1 ผิว', S5C.p), 'รอบข้างเป็น<b>ผิวโค้ง</b> ไม่นับเป็นสัน'], [s5Draw(s5Solid('cone', { r: 1.05, h: 2 }), { W: 400, H: 240, cx: 290, sc: 52, hid: true }) + s5dDot(290, s5dXY([0, 1, 0], { cx: 290, sc: 52 })[1], S5C.g, 7), 'กรวย: หน้าราบ 1 ผิวโค้ง 1 และ<b>จุดยอด 1 จุด</b>']], 'รูปทรงที่มีผิวโค้ง นับหน้าราบและผิวโค้งแยกกัน'),
      s5dCount([{ k: 'cube', what: 'v', t: 'ลูกบาศก์: แตะจุดยอดทุกจุด' }, { k: 'pyr4', what: 'e', t: 'พีระมิด: แตะสันทุกเส้น' }, { k: 'prism3', what: 'f', t: 'ปริซึมสามเหลี่ยม: แตะหน้าทุกหน้า' }]),
      s5dTry(2504, ['f', 'v', 'e'], 'นับหน้า สัน จุดยอด')]; },
  2505: L => { const S = s5Solid('prism3'), o = { W: 400, H: 240, sc: 50, cx: 120, hid: true }, X = j => s5dXY(S.V[j], o), bot = S.F.find(f => f.every(j => S.V[j][1] < 0)), top = S.F.find(f => f.length === 3 && f.every(j => S.V[j][1] > 0));
    return [
      s5dB('หน้าของรูปทรงเป็นรูปสองมิติ', [[s5Draw(S, o), 'ปริซึมสามเหลี่ยม'], [s5dPoly(top.map(X)) + s5Sh('tri', 250, 10, 80, 66, { col: '#FF8FB0' }).s + s5T(345, 52, '× 2', S5C.p, 's5l', 'start'), 'ฐานบนและล่างเป็น<b>รูปสามเหลี่ยม 2 รูป</b>'],
        [s5dPoly(S.F[2].map(X), '#8FD3F4', .8) + s5Sh('rect', 240, 100, 100, 70, { col: '#8FD3F4' }).s + s5T(345, 142, '× 3', S5C.b, 's5l', 'start'), 'หน้าข้างเป็น<b>รูปสี่เหลี่ยมผืนผ้า 3 รูป</b> (เท่ากับจำนวนด้านของฐาน)']], 'ปริซึมฐาน n เหลี่ยม: ฐาน 2 รูป + สี่เหลี่ยม n รูป · พีระมิด: ฐาน 1 รูป + สามเหลี่ยม n รูป'.replace(' · ', ' ')),
      s5dB('พีระมิดฐานสี่เหลี่ยม', [[s5Draw(s5Solid('pyr4'), { W: 400, H: 240, sc: 52, cx: 120, hid: true }), 'พีระมิดฐานสี่เหลี่ยม'], [s5Sh('sq', 250, 14, 80, 70, { col: '#FFD27A' }).s + s5T(345, 56, '× 1', S5C.o, 's5l', 'start'), 'ฐาน: สี่เหลี่ยม 1 รูป'], [s5Sh('tri', 250, 110, 80, 70, { col: '#9EE6C0' }).s + s5T(345, 152, '× 4', S5C.g, 's5l', 'start'), 'หน้าข้าง: สามเหลี่ยม 4 รูป มาพบกันที่ยอด']], 'พีระมิดฐานสี่เหลี่ยม = สี่เหลี่ยม 1 + สามเหลี่ยม 4'),
      s5dTry(2505, ['p3', 'py4', 'hl'], 'หน้าเป็นรูปอะไร')]; },
  2506: L => [
    s5dB('มองทรงกระบอกจากสามทิศ', [[s5Draw(s5Solid('cyl', { r: .9, h: 1.7 }), { W: 400, H: 240, cx: 80, sc: 50, hid: true }), 'ทรงกระบอกตั้งอยู่บนโต๊ะ'], [s5Sh('rect', 165, 70, 90, 100, { col: '#8FD3F4' }).s.replace(/points="[^"]*"/, 'points="175,62 245,62 245,178 175,178"') + s5T(210, 200, 'ด้านหน้า'), 'มองจาก<b>ด้านหน้า</b> เห็นรูปสี่เหลี่ยมมุมฉาก'], [s5Sh('circ', 280, 70, 100, 100, { col: '#8FD3F4' }).s + s5T(330, 200, 'ด้านบน'), 'มองจาก<b>ด้านบน</b> เห็นรูปวงกลม']], 'ภาพที่มองเห็นจากแต่ละทิศ เป็นรูปสองมิติ'),
    s5dViews([[1, 2, 0], [2, 3, 1]]),
    s5dTry(2506, ['top', 'front', 'cyltop'], 'ภาพสามทิศ')],
  2507: L => { const N = s5NetGrid(S5_CUBE_NETS[0]);
    return [
      s5dB('ภาพคลี่พับเป็นรูปทรง', [[s5DrawNet(N, 0, { W: 400, H: 240 }), 'ภาพคลี่ของลูกบาศก์: สี่เหลี่ยมจัตุรัส 6 รูปต่อกัน'], { ink: s5DrawNet(N, .5, { W: 400, H: 240 }), t: 'พับตามรอยต่อทีละด้าน…', clear: 1 }, { ink: s5DrawNet(N, 1, { W: 400, H: 240 }), t: 'ปิดครบทุกด้าน = <b>ลูกบาศก์</b>', clear: 1 }], 'ภาพคลี่ = รูปสองมิติที่พับแล้วได้รูปทรงสามมิติ'),
      s5dB('ภาพคลี่ของทรงกระบอกและกรวย', [[s5NetCyl({ W: 190, H: 230, cls: '' }).replace(/^<svg[^>]*>|<\/svg>$/g, ''), 'ทรงกระบอก: วงกลม 2 รูป + สี่เหลี่ยมผืนผ้า 1 รูป (ผิวข้างที่คลี่ออก)'], [`<g transform="translate(210 0)">${s5NetCone({ W: 190, H: 230, cls: '' }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`, 'กรวย: วงกลม 1 รูป + <b>รูปพัด</b> (ส่วนของวงกลม) 1 รูป']], 'รูปทรงที่มีผิวโค้ง คลี่ผิวโค้งออกเป็นสี่เหลี่ยมผืนผ้าหรือรูปพัด'),
      s5dFold(),
      s5dTry(2507, ['net', 'cylnet', 'pickpyr'], 'ภาพคลี่')]; },
  2508: L => [
    s5dB('นับลูกบาศก์ทีละกอง', [[s5DrawStack(s5Stack([[1, 2, 1], [2, 3, 1]]), { W: 400, H: 240, sc: 36 }), 'ลูกบาศก์ที่ต่อกัน (ทุกก้อนวางบนพื้นหรือบนก้อนอื่น)'], [s5T(330, 40, 'แถวหลัง: 1 + 2 + 1 = 4', S5C.b, 's5l', 'end'), 'นับ<b>แถวหลัง</b> ทีละกอง: 4 ก้อน'], [s5T(330, 66, 'แถวหน้า: 2 + 3 + 1 = 6', S5C.g, 's5l', 'end'), 'นับ<b>แถวหน้า</b>: 6 ก้อน'], [s5T(330, 96, 'รวม 10 ก้อน', S5C.p, 's5big', 'end'), 'รวมทั้งหมด <b>10 ก้อน</b> (อย่าลืมก้อนที่ซ่อนอยู่ใต้กองสูง)']], 'นับเป็นกอง: ความสูงของแต่ละกอง แล้วรวมกัน'),
    s5dBuild('ต่อบล็อกตามภารกิจ', [{ t: 'ต่อให้มี 5 ก้อน', ok: Hs => s5Count(Hs) === 5 }, { t: 'สร้างกองสูง 3 ชั้น 1 กอง', ok: Hs => Hs.flat().includes(3) }, { t: 'ต่อเป็นทรงสี่เหลี่ยม 2 × 2 สูง 2 (8 ก้อน)', reset: 1, ok: Hs => s5Count(Hs) === 8 && Hs.flat().filter(v => v === 2).length === 4 }]),
    s5dTry(2508, ['cnt', 'tab', 'house'], 'ประกอบและแยกรูปทรง')],
  2509: L => [
    s5dB('ตัดทรงกระบอกสองแนว', [[s5CutFig('cyl', [0, 1, 0], .2, { W: 200, H: 240, sc: 46 }).replace(/^<svg[^>]*>|<\/svg>$/g, ''), 'ตัดในแนว<b>ขนานกับฐาน</b> → หน้าตัดเป็น<b>รูปวงกลม</b>'], [`<g transform="translate(200 0)">${s5CutFig('cyl', [1, 0, 0], .15, { W: 200, H: 240, sc: 46 }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`, 'ตัดในแนว<b>ตั้งฉากกับฐาน</b> → หน้าตัดเป็น<b>รูปสี่เหลี่ยมมุมฉาก</b>']], 'หน้าตัดขึ้นกับ<b>ชนิดของรูปทรง</b>และ<b>แนวที่ตัด</b>'),
    s5dB('กรวยกับทรงกลม', [[s5CutFig('cone', [1, 0, 0], 0, { W: 200, H: 240, sc: 46 }).replace(/^<svg[^>]*>|<\/svg>$/g, ''), 'ตัดกรวยตั้งฉากกับฐาน<b>ผ่านจุดยอด</b> → สามเหลี่ยม'], [`<g transform="translate(200 0)">${s5CutFig('cone', [.42, 1, 0], -.25, { W: 200, H: 240, sc: 46 }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`, 'ตัดกรวย<b>เฉียง</b> ไม่ผ่านฐาน → <b>วงรี</b>']], 'ทรงกลมตัดแนวใดก็ได้ วงกลมเสมอ'),
    s5dCut(),
    s5dTry(2509, ['cut', 'cut2', 'sphall'], 'หน้าตัด')],
  2510: L => { const S = s5Solid('prism5'), o = { W: 400, H: 240, sc: 50, hid: true }, X = j => s5dXY(S.V[j], o), n = 5;
    return [
      s5dB('นับสันของปริซึมเป็นกลุ่ม', [[s5Draw(S, o), 'ปริซึมห้าเหลี่ยม'], [[0, 1, 2, 3, 4].map(i => s5dLine(X(n + i), X(n + (i + 1) % n), S5C.b, 4)).join(''), 'สันรอบ<b>ฐานบน</b> 5 เส้น'], [[0, 1, 2, 3, 4].map(i => s5dLine(X(i), X((i + 1) % n), S5C.g, 4)).join(''), 'สันรอบ<b>ฐานล่าง</b> 5 เส้น'], [[0, 1, 2, 3, 4].map(i => s5dLine(X(i), X(n + i), S5C.o, 4)).join(''), 'สัน<b>ข้าง</b> 5 เส้น → รวม 15 = 3 × 5']], 'ปริซึมฐาน n เหลี่ยม: สัน 3n จุดยอด 2n หน้า n + 2'),
      r4dShow('นับพีระมิดฐานหกเหลี่ยม', { W: 400, H: 240, fig: s5Draw(s5Solid('pyr6'), { W: 400, H: 240, sc: 52, hid: true }), q: 'พีระมิดฐานหกเหลี่ยมมีหน้า สัน จุดยอดอย่างละเท่าใด',
        steps: [{ w: 'หน้า = 6 + 1 = 7', n: 'หน้าข้าง 6 + ฐาน 1' }, { w: 'สัน = 6 + 6 = 12', n: 'รอบฐาน 6 + ขึ้นไปหายอด 6' }, { w: 'จุดยอด = 6 + 1 = 7', n: 'รอบฐาน 6 + ยอด 1', ans: 1 }], fin: 'พีระมิดฐาน n เหลี่ยม: หน้า n + 1 สัน 2n จุดยอด n + 1', say: 'พีระมิดฐาน n เหลี่ยม หน้า n บวก 1 สัน 2n จุดยอด n บวก 1' }),
      s5dTry(2510, ['prf', 'pre', 'pyv'], 'นับหน้า สัน จุดยอด')]; },
  2511: L => [
    s5dB('หน้า + จุดยอด − สัน', [[s5T(200, 40, 'รูปทรง      หน้า   จุดยอด   สัน', S5C.ink, 's5l'), 'ตารางจำนวนองค์ประกอบ'], [s5T(200, 80, 'ลูกบาศก์       6       8        12', S5C.b, 's5l'), '6 + 8 − 12 = <b>2</b>'], [s5T(200, 120, 'ปริซึม 3        5       6         9', S5C.g, 's5l'), '5 + 6 − 9 = <b>2</b>'], [s5T(200, 160, 'พีระมิด 4       5       5         8', S5C.o, 's5l'), '5 + 5 − 8 = <b>2</b>'], [s5T(200, 210, 'หน้า + จุดยอด − สัน = 2', S5C.p, 's5big'), 'ได้ 2 ทุกรูป! (สูตรของออยเลอร์)']], 'รูปทรงหลายหน้าทุกรูป: <b>หน้า + จุดยอด − สัน = 2</b>'),
    r4dShow('ใช้สูตรหาสัน', e1dEq([{ e: 'หน้า + จุดยอด − สัน = 2' }, { e: '7 + 10 − สัน = 2', w: 'ปริซึมห้าเหลี่ยม: หน้า 7 จุดยอด 10', n: 'แทนค่าที่รู้' }, { e: '17 − สัน = 2', w: '7 + 10 = 17', n: 'รวมก่อน' }, { e: 'สัน = *15', w: 'สัน 15 เส้น', n: '17 − 2', ans: 1 }], { q: 'ปริซึมห้าเหลี่ยมมีหน้า 7 จุดยอด 10 มีสันกี่เส้น', fin: 'รู้สองค่า หาค่าที่สามได้ด้วย <b>หน้า + จุดยอด − สัน = 2</b>', say: 'รู้สองค่า หาค่าที่สามได้' })),
    s5dTry(2511, ['euler', 'pat', 'use'], 'ความสัมพันธ์ขององค์ประกอบ')],
  2512: L => { const Hs = [[1, 3, 2], [2, 1, 1]], V = s5Views(Hs);
    return [
      s5dB('จากตารางภาพด้านบน → ภาพด้านหน้า', [[Hs.map((r, i) => r.map((v, j) => `<rect x="${30 + j * 46}" y="${40 + i * 46}" width="46" height="46" fill="#FFF6D9" stroke="${S5C.ink}" stroke-width="2"/>` + s5T(53 + j * 46, 72 + i * 46, v, S5C.ink, 's5big')).join('')).join('') + s5T(99, 150, '▲ ด้านหน้า', S5C.p, 's5l'), 'ตัวเลข = จำนวนลูกบาศก์ที่ซ้อนในช่องนั้น'],
        [[0, 1, 2].map(j => s5T(53 + j * 46, 30, `สูง ${V.front[j]}`, S5C.b, 's5l')).join(''), 'แต่ละคอลัมน์: ใช้<b>ตัวเลขที่มากที่สุด</b> 2, 3, 2'], [s5ViewPic(V.front, { W: 170, H: 140 }).replace(/^<svg[^>]*>/, '<g transform="translate(200 40)">').replace(/<\/svg>$/, '</g>'), 'ภาพด้านหน้า: สูง 2, 3, 2 ชั้น'], [s5DrawStack(s5Stack(Hs), { W: 400, H: 240, sc: 20, cx: 300, cy: 215 }), 'เทียบกับรูปจริง (รวม 10 ก้อน)']], 'ภาพด้านหน้า: คอลัมน์ละค่ามากสุด · ภาพด้านข้าง: แถวละค่ามากสุด'.replace(' · ', ' ')),
      s5dTry(2512, ['sum', 'front', 'cone3'], 'อ่านภาพฉาย')]; },
  2513: L => [
    s5dB('หน้าตรงข้ามบนภาพคลี่', [[s5NetFlat(s5NetGrid(S5_CUBE_NETS[0]).map(f => ({ ...f, lab: 'ABCDEF'[f.cell], c: [0, 2].includes(f.cell) ? '#FF8FB0' : '#FFF6D9' })), { W: 400, H: 240, cls: '' }).replace(/^<svg[^>]*>|<\/svg>$/g, ''), 'แถว 4 ช่อง: หน้าที่<b>เว้นไป 1 ช่อง</b>อยู่ตรงข้ามกัน (A กับ C)'], [s5T(200, 228, 'B ↔ D และ E ↔ F', S5C.p, 's5l'), 'หน้าบนกับหน้าล่างของแถวก็อยู่ตรงข้ามกัน']], 'หน้าตรงข้ามไม่มีวันอยู่ติดกันบนภาพคลี่'),
    s5dOpp([[S5_CUBE_NETS[0], 0], [S5_CUBE_NETS[6], 2], [S5_CUBE_NETS[10], 0]]),
    s5dTry(2513, ['opp', 'dice', 'ok1'], 'พับในใจ')],
  2514: L => [
    r4dShow('ย้อนจากจำนวนสันไปหาฐาน', e1dEq([{ e: 'สันของปริซึม = 3n' }, { e: '3n = 24', w: 'ปริซึมมีสัน 24 เส้น', n: 'ตั้งสมการ' }, { e: 'n = 24 ÷ 3', w: 'หารด้วย 3', n: 'แก้สมการ' }, { e: 'n = *8', w: 'ฐานเป็นรูปแปดเหลี่ยม', n: 'ปริซึมแปดเหลี่ยม', ans: 1 }], { q: 'ปริซึมรูปหนึ่งมีสัน 24 เส้น ฐานเป็นรูปกี่เหลี่ยม', fin: 'ใช้สูตรของรูปทรง ตั้งสมการ แล้วย้อนหา n', say: 'ใช้สูตรของรูปทรง ตั้งสมการ แล้วย้อนหา n' })),
    r4dShow('รูปทรงนี้คืออะไร', { W: 400, H: 240, fig: s5T(200, 60, 'หน้า 6   สัน 10   จุดยอด 6', S5C.ink, 's5big'), q: 'รูปทรงหนึ่งมีหน้า 6 สัน 10 จุดยอด 6 คือรูปทรงใด',
      steps: [{ w: 'หน้า = จุดยอด → พีระมิด', n: 'ปริซึมมีจุดยอด 2n มากกว่าหน้า' }, { w: 'สัน 2n = 10 → n = 5', n: 'พีระมิด: สัน 2n' }, { ink: s5Draw(s5Solid('pyr5'), { W: 400, H: 240, sc: 40, cy: 160, hid: true }), w: 'พีระมิดฐานห้าเหลี่ยม', n: 'ตรวจ: 6 + 6 − 10 = 2', ans: 1 }], fin: 'ใช้แบบรูปของปริซึม/พีระมิด และสูตรออยเลอร์ตรวจคำตอบ', say: 'ใช้แบบรูปของปริซึมและพีระมิด แล้วตรวจด้วยสูตรออยเลอร์' }),
    s5dTry(2514, ['prE', 'pyE', 'eulE'], 'ย้อนหารูปทรง')],
  2515: L => [
    s5dB('ทาสีลูกบาศก์ 3 × 3 × 3', [[s5DrawStack(s5Stack([[3, 3, 3], [3, 3, 3], [3, 3, 3]]), { W: 400, H: 240, sc: 30, cx: 130 }), 'ลูกบาศก์ใหญ่จากก้อนเล็ก 27 ก้อน ทาสีด้านนอกทั้งหมด'], [s5T(232, 60, 'มุม: ทาสี 3 หน้า = 8', S5C.p, 's5l', 'start'), 'ก้อนที่<b>มุม</b> โดนสี 3 หน้า: มี 8 มุม'], [s5T(232, 100, 'กลางสัน: 2 หน้า = 12', S5C.b, 's5l', 'start'), 'ก้อน<b>กลางสัน</b> โดนสี 2 หน้า: 12 สัน'], [s5T(232, 140, 'กลางหน้า: 1 หน้า = 6', S5C.g, 's5l', 'start'), 'ก้อน<b>กลางหน้า</b> โดนสี 1 หน้า: 6 หน้า'], [s5T(232, 180, 'ข้างใน: 0 หน้า = 1', S5C.o, 's5l', 'start'), 'ตรงกลางในสุดไม่โดนสี: 8 + 12 + 6 + 1 = 27']], 'ใช้ จุดยอด (8) สัน (12) หน้า (6) ของลูกบาศก์แก้โจทย์ได้'),
    s5dTry(2515, ['paint3', 'paint2', 'nolid'], 'โจทย์ประยุกต์')],
  2516: L => { const tgt = [[0, 2, 1], [1, 3, 1], [1, 1, 0]], V = s5Views(tgt), key = v => JSON.stringify(v);
    return [
      s5dB('ออกแบบบ้านของเล่น', [[s5Draw(s5Solid('cuboid', { a: 2.4, b: 1.3, c: 1.6 }), { W: 400, H: 240, sc: 50, cy: 160 }), 'ตัวบ้าน = ทรงสี่เหลี่ยมมุมฉาก'], [s5Draw(s5Solid('prism3', { r: 1.0, h: 2.4 }), { W: 400, H: 240, sc: 50, cy: 100, yaw: .62 + Math.PI / 2, pit: .42 }), 'หลังคา = ปริซึมสามเหลี่ยม'], [s5T(200, 230, 'ใช้ภาพคลี่ 2 ชุด ต่อกันเป็นบ้าน', S5C.p), 'ระบุส่วนประกอบ แล้วเตรียมภาพคลี่ของแต่ละส่วน']], 'นักออกแบบ: แยกชิ้นงานเป็นรูปทรง → ภาพสามทิศ → ภาพคลี่'),
      s5dBuild('สร้างตามแบบของลูกค้า', [{ t: 'ภาพด้านบนตรงตามแบบ', pic: '<b>แบบด้านบน</b>' + s5ViewPic(V.top, { W: 140, H: 110 }), ok: Hs => key(s5Views(Hs).top) === key(V.top) }, { t: 'ภาพด้านหน้าตรงตามแบบด้วย', pic: '<b>แบบด้านหน้า</b>' + s5ViewPic(V.front, { W: 140, H: 110 }), ok: Hs => key(s5Views(Hs).top) === key(V.top) && key(s5Views(Hs).front) === key(V.front) }, { t: 'ภาพด้านข้างตรงตามแบบด้วย', pic: '<b>แบบด้านข้าง</b>' + s5ViewPic(V.side, { W: 140, H: 110 }), ok: Hs => ['top', 'front', 'side'].every(k => key(s5Views(Hs)[k]) === key(V[k])) }]),
      s5dTry(2516, ['pencup', 'dtop', 'gift'], 'นักออกแบบ')]; }
};
LESSONS_M1C5.forEach(L => { const f = S5D_TEACH[L.id]; if (f) { L.teach = f(L).filter(Boolean); L.__pracDone = 1; L.learned = true; } });
