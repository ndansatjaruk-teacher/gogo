/* =========================================================
   GRADE 2 · CHAPTER 7 — เวลา  (ชายหาด · ภาคเรียนที่ 2 · เมือง 49 · ด่าน 961–969 · บอส 979)
   calendar · months · writing dates · o'clock (กลางวัน/กลางคืน) · 5-minute times · durations in hours/minutes ·
   digital clock · word problems
   clocks are real: the hour hand moves with the minutes (geared), drag the long hand to set minutes
   ========================================================= */
const TK_MON = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const TK_AB = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const TK_DAY = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'], TK_WD = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
const TK_WC = ['#E5505E', '#E8B20C', '#E86FA6', '#3FAE5E', '#F28C28', '#4AA3DF', '#8C6BE0'];
const tkDays = (m, y) => new Date(y - 543, m + 1, 0).getDate(), tkFirst = (m, y) => new Date(y - 543, m, 1).getDay(), tkWday = (d, m, y) => new Date(y - 543, m, d).getDay();
const tkDayTime = h => h >= 6 && h <= 17;
const tkTxt = (h, m) => m ? `${h} นาฬิกา ${m} นาที` : `${h} นาฬิกา`;
const tkDig = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
const tkDur = (mins, mode) => mode === 'h' || (mins % 60 === 0 && mode !== 'm') ? `${mins / 60} ชั่วโมง` : mins < 60 || mode === 'm' ? `${mins} นาที` : `${Math.floor(mins / 60)} ชั่วโมง ${mins % 60} นาที`;

/* ---------- pictures ---------- */
const tkSun = (s = 34) => `<svg viewBox="-20 -20 40 40" width="${s}" height="${s}" class="tk-sky"><g stroke="#F5A623" stroke-width="3" stroke-linecap="round">${range(0, 7).map(i => `<path d="M0 -17 V-13" transform="rotate(${i * 45})"/>`).join('')}</g><circle r="10" fill="#FFD45C"/></svg>`;
const tkMoon = (s = 34) => `<svg viewBox="-20 -20 40 40" width="${s}" height="${s}" class="tk-sky"><circle r="17" fill="#2B2E5C"/><path d="M4 -11 a12 12 0 1 0 6 18 a9 9 0 1 1 -6 -18 z" fill="#FFE27A"/><circle cx="-9" cy="-7" r="1.3" fill="#fff"/><circle cx="9" cy="10" r="1" fill="#fff"/></svg>`;
const tkSkyIcon = (h, s) => tkDayTime(h) ? tkSun(s) : tkMoon(s);
/* analog clock · hour hand = coral (short) · minute hand = navy (long) · o: ring, mins (5-minute labels outside), arc [m1, m2] elapsed, hl 'h'|'m', size */
function tkClockSVG(h, m, o = {}) {
  const ring = o.ring || '#5BB5F0', rad = d => (d - 90) * Math.PI / 180, P = (r, d) => [(100 + r * Math.cos(rad(d))).toFixed(1), (100 + r * Math.sin(rad(d))).toFixed(1)];
  const pad = o.mins ? 26 : 4; let s = '';
  if (o.arc) { const [a1, a2] = o.arc, d1 = a1 * 6, d2 = a2 * 6 + (a2 <= a1 ? 360 : 0), [x1, y1] = P(80, d1), [x2, y2] = P(80, d2);
    s += `<path d="M100 100 L${x1} ${y1} A80 80 0 ${d2 - d1 > 180 ? 1 : 0} 1 ${x2} ${y2} Z" fill="#FFD45C" opacity=".45"/>`; }
  for (let i = 0; i < 60; i++) { const [x1, y1] = P(84, i * 6), [x2, y2] = P(i % 5 ? 79 : 73, i * 6); s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2B2550" stroke-width="${i % 5 ? 1.2 : 2.6}" stroke-linecap="round"/>`; }
  for (let k = 1; k <= 12; k++) { const [x, y] = P(61, k * 30); s += `<text x="${x}" y="${(+y + 6.5).toFixed(1)}" text-anchor="middle" font-size="19" font-weight="800" fill="#2B2550">${k}</text>`; }
  if (o.mins) for (let k = 1; k <= 12; k++) { const [x, y] = P(108, k * 30); s += `<text x="${x}" y="${(+y + 5).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="800" fill="#2F86C2">${k * 5 % 60 === 0 ? 60 : k * 5}</text>`; }
  const [hx, hy] = P(44, ((h % 12) + m / 60) * 30), [mx, my] = P(74, m * 6);
  const glow = k => o.hl === k ? ` filter="url(#tkGlow)"` : '';
  return `<svg viewBox="${-pad} ${-pad} ${200 + pad * 2} ${200 + pad * 2}" class="tkclk" ${o.size ? `width="${o.size}" height="${o.size}"` : ''} aria-hidden="true">
    <defs><filter id="tkGlow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#FFD45C" flood-opacity="1"/></filter></defs>
    <circle cx="100" cy="100" r="95" fill="${ring}"/><circle cx="100" cy="100" r="87" fill="#FFFDF7"/>${s}
    <line x1="100" y1="100" x2="${mx}" y2="${my}" stroke="#2B2550" stroke-width="5" stroke-linecap="round"${glow('m')}/>
    <line x1="100" y1="100" x2="${hx}" y2="${hy}" stroke="#E5505E" stroke-width="8.5" stroke-linecap="round"${glow('h')}/>
    <circle cx="100" cy="100" r="6" fill="#2B2550"/><circle cx="100" cy="100" r="2.4" fill="#FFD45C"/></svg>`;
}
const tkClk = (h, m, o = {}) => `<div class="tk-c">${tkClockSVG(h, m, o)}${o.sky ? `<span class="tk-skyb">${tkSkyIcon(h, 36)}</span>` : ''}${o.cap ? `<small>${o.cap}</small>` : ''}</div>`;
/* digital clock */
const tkDigSVG = (h, m, col = '#9BE3B5', w = 170) => `<svg viewBox="0 0 170 92" width="${w}" class="tkdig" aria-hidden="true"><rect x="22" y="2" width="22" height="14" rx="6" fill="#8C6BE0"/><rect x="126" y="2" width="22" height="14" rx="6" fill="#8C6BE0"/>
  <rect x="4" y="10" width="162" height="76" rx="20" fill="${col}" stroke="#2B2550" stroke-width="3"/><rect x="18" y="22" width="134" height="52" rx="10" fill="#FFFDF7" stroke="#2B2550" stroke-width="2.5"/>
  <text x="85" y="61" text-anchor="middle" font-size="34" font-weight="800" font-family="Nunito,var(--font-num),sans-serif" fill="#2B2550">${h === null ? '__' : String(h).padStart(2, '0')} : ${m === null ? '__' : String(m).padStart(2, '0')}</text></svg>`;
/* calendar (HTML grid so dates can be tapped) · o: hl [days], wd (highlight a weekday column), marks {day: label}, ia, col */
function tkCal(m, y, o = {}) { const n = tkDays(m, y), f = tkFirst(m, y), hl = new Set(o.hl || []);
  let s = `<div class="tkcal${o.ia ? ' ia' : ''}" style="--mc:${o.col || '#FF7B86'}"><div class="tkc-h"><b>${TK_MON[m]}</b><span>พ.ศ. ${y}</span></div><div class="tkc-g">`;
  s += TK_WD.map((w, i) => `<i class="wd${o.wd === i ? ' on' : ''}" data-w="${i}" style="--wc:${TK_WC[i]}">${w}</i>`).join('');
  for (let k = 0; k < f; k++) s += '<span class="e"></span>';
  for (let d = 1; d <= n; d++) { const w = (f + d - 1) % 7, mk = o.marks && o.marks[d];
    s += `<span class="d${hl.has(d) ? ' hl' : ''}${o.wd === w ? ' col' : ''}${w === 0 ? ' sun' : ''}${mk ? ' mk' : ''}" data-d="${d}" data-w="${w}">${d}${mk ? `<small>${mk}</small>` : ''}</span>`; }
  return s + '</div></div>'; }
const tkCalMark = el => { el.classList.add('ia'); el.addEventListener('click', e => { const c = e.target.closest('.d'); if (!c) return; e.stopPropagation(); c.classList.toggle('tap'); sfx.tap(); }); };
/* fist (นับสันหมัด): 4 knuckles (31 วัน) and 3 dips (30 วัน / ก.พ.) */
/* v184 (ผู้ใช้ขอ): หมัดซ้าย หันหลังมือเข้าหาตัว — นิ้วโป้งอยู่ขวา สันหมัดนิ้วชี้อยู่ขวาสุด นับไปทางซ้ายถึงนิ้วก้อย
   ช่อง 0–6: สันหมัด (คู่) / ร่อง (คี่) · o: upto (แสดงชื่อเดือนถึงเดือนที่เท่าไร), parts (ป้ายสันหมัด/ร่อง), num (เลขลำดับสันหมัด/ร่อง), start (ลูกศรจุดเริ่ม) */
const TK_FX = [292, 254, 216, 178, 140, 102, 64], tkSlot = m => m < 7 ? m : m - 7, tkIsK = i => i % 2 === 0;
function tkFistSVG(k = -1, o = {}) { const upto = o.upto ?? 11, yK = 30, yD = 58, X = TK_FX, Y = i => tkIsK(i) ? yK : yD;
  const pts = [[34, 78], ...[6, 5, 4, 3, 2, 1, 0].map(i => [X[i], Y(i)]), [318, 66]];
  let d = `M34 186 V${pts[0][1]}`; for (let n = 1; n < pts.length; n++) { const [x0, y0] = pts[n - 1], [x1, y1] = pts[n]; d += ` C${x0 + (x1 - x0) * .5} ${y0} ${x0 + (x1 - x0) * .5} ${y1} ${x1} ${y1}`; }
  d += ' C336 70 350 92 348 118 C346 146 326 156 304 152 V186 Z';
  let s = `<path d="${d}" fill="#FFD9B8" stroke="#C98A5C" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M304 152 C318 136 322 112 314 92" fill="none" stroke="#C98A5C" stroke-width="2.4" stroke-linecap="round"/>`
    + [1, 3, 5].map(i => `<path d="M${X[i]} ${yD + 14} C${X[i] - 3} ${yD + 40} ${X[i] + 2} ${yD + 62} ${X[i]} ${yD + 84}" fill="none" stroke="#D9A27A" stroke-width="2" opacity=".75"/>`).join('')
    + `<path d="M60 168 h220" stroke="#D9A27A" stroke-width="2" opacity=".5"/>`;
  if (o.parts) s += `<text x="${X[0]}" y="${yK - 16}" text-anchor="middle" font-size="12" font-weight="800" fill="#6E6290">นิ้วชี้</text><text x="${X[6]}" y="${yK - 16}" text-anchor="middle" font-size="12" font-weight="800" fill="#6E6290">นิ้วก้อย</text><text x="334" y="176" text-anchor="middle" font-size="12" font-weight="800" fill="#6E6290">นิ้วโป้ง</text>`;
  X.forEach((x, i) => { const kn = tkIsK(i), on = k >= 0 && tkSlot(k) === i, y = Y(i);
    s += `<circle cx="${x}" cy="${y}" r="${on ? 12 : 7}" fill="${on ? (kn ? '#E5505E' : '#2F86C2') : (kn ? '#FF9AA8' : '#9DD1F2')}" stroke="#fff" stroke-width="2"/>`;
    if (o.num) s += `<text x="${x}" y="${y + 26}" text-anchor="middle" font-size="12" font-weight="800" fill="${kn ? '#C2485A' : '#2F6FA0'}">${kn ? 'สัน ' + (i / 2 + 1) : 'ร่อง ' + (i + 1) / 2}</text>`;
    const ms = [i, i + 7].filter(m => m < 12 && m <= upto);
    if (ms.length) s += `<text x="${x}" y="${kn ? 206 : 226}" text-anchor="middle" font-size="14" font-weight="800" fill="${kn ? '#C2485A' : '#2F6FA0'}">${ms.map(m => m === k ? `<tspan font-size="16" text-decoration="underline">${TK_AB[m]}</tspan>` : TK_AB[m]).join(' ')}</text>`; });
  if (o.parts) s += `<path d="M${X[4]} ${yK - 2} Q${(X[4] + X[2]) / 2} ${yK - 30} ${X[2]} ${yK - 2}" fill="none" stroke="#E5505E" stroke-width="2" stroke-dasharray="4 3"/><text x="${(X[4] + X[2]) / 2}" y="${yK - 20}" text-anchor="middle" font-size="12" font-weight="800" fill="#C2485A">สันหมัด = นูน</text><text x="${X[3]}" y="${yD + 36}" text-anchor="middle" font-size="12" font-weight="800" fill="#2F6FA0">ร่อง = เว้า</text>`;
  if (o.start) s += `<path d="M${X[0] + 36} 14 q-10 -2 -24 10" fill="none" stroke="#E3A21C" stroke-width="3" marker-end="url(#tkar)"/><text x="${X[0] + 40}" y="12" font-size="12" font-weight="800" fill="#B7791F">เริ่ม</text><path d="M${X[0] - 20} 4 H${X[6] + 20}" stroke="#E3A21C" stroke-width="2.4" stroke-dasharray="5 4" marker-end="url(#tkar)"/>`;
  return `<svg viewBox="0 -8 370 244" class="tkfist" aria-hidden="true"><defs><marker id="tkar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#E3A21C"/></marker></defs>${s}</svg>`; }

/* ---------- interactive clock: drag the long hand (outer part) or the short hand (near the middle); tap also works ---------- */
function tkClock(h0, m0, o = {}) { // v124 (ผู้ใช้ขอ: หมุนให้เสถียรขึ้น) — ลากแบบ “ตามนิ้ว” (นับมุมที่นิ้วหมุนไป) ไม่กระโดดไปที่นิ้วทันที
  // เลือกเข็มที่ใกล้นิ้วที่สุด (มุม + ระยะจากจุดกลาง) · จุดใกล้จุดกลางไม่นับมุม · เข็มยาวหมุนเลย 12 แล้วชั่วโมงเปลี่ยนต่อเนื่อง · แตะเฉย ๆ (ไม่ลาก) = เข็มไปชี้ตรงที่แตะ
  let t = (((h0 % 12) * 60 + m0) % 720 + 720) % 720; const el = h('div', { class: 'tkclock ia' + (o.cls ? ' ' + o.cls : '') }); let drag = null, last = null, acc = 0, t0 = 0, moved = 0, sx = 0, sy = 0;
  const draw = () => { el.innerHTML = tkClockSVG(Math.floor(t / 60), t % 60, { ring: o.ring, mins: o.mins, arc: o.arcFrom !== undefined ? [o.arcFrom, t % 60] : null, hl: drag }); };
  const pos = e => { const sv = el.querySelector('svg'), pt = sv.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(sv.getScreenCTM().inverse()); return [p.x - 100, p.y - 100]; };
  const angOf = ([x, y]) => (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360, adiff = (a, b) => Math.abs(((a - b) % 360 + 540) % 360 - 180);
  const set = nt => { nt = ((nt % 720) + 720) % 720; if (nt === t) return; t = nt; draw(); sfx.tap && sfx.tap(); o.onSet && o.onSet(Math.floor(t / 60), t % 60); };
  const st = () => o.step || 5;
  const fromAcc = () => { if (drag === 'm') { const sn = Math.round(acc / st()) * st(); return o.only === 'm' ? Math.floor(t0 / 60) * 60 + ((sn % 60) + 60) % 60 : sn; } return Math.round(acc) * 60 + t0 % 60; };
  const absSet = p => { const d = angOf(p); if (drag === 'm') { const nm = Math.round(d / 6 / st()) * st() % 60, om = t % 60; let hh = Math.floor(t / 60); if (!o.only) { if (om >= 45 && nm < 15) hh++; else if (om < 15 && nm >= 45) hh--; } set(hh * 60 + nm); }
    else set((Math.round((d - (t % 60) * .5) / 30) % 12 + 12) % 12 * 60 + t % 60); };
  el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); const p = pos(e), r = Math.hypot(...p), a = angOf(p);
    const dh = adiff(a, ((t / 60) % 12) * 30), dm = adiff(a, (t % 60) * 6);
    drag = o.only || (r < 55 ? (dh <= dm + 30 ? 'h' : 'm') : (dm <= dh + 30 ? 'm' : 'h'));
    t0 = t; acc = drag === 'm' ? t : Math.floor(t / 60); last = r > 10 ? a : null; moved = 0; sx = e.clientX; sy = e.clientY;
    try { el.setPointerCapture(e.pointerId); } catch (_) {} draw(); });
  el.addEventListener('pointermove', e => { if (!drag) return; const p = pos(e); moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy)); if (Math.hypot(...p) < 10) return;
    const a = angOf(p); if (last == null) { last = a; return; } let d = ((a - last) % 360 + 540) % 360 - 180; last = a; if (Math.abs(d) > 90) return; // กันมุมกระโดดเมื่อนิ้วผ่านใกล้จุดกลาง
    acc += drag === 'm' ? d / 6 : d / 30; set(fromAcc()); });
  const end = e => { if (!drag) return; if (moved < 6 && e && e.type === 'pointerup') absSet(pos(e)); drag = null; last = null; draw(); };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', () => end()); el.addEventListener('lostpointercapture', () => end());
  el.addEventListener('click', e => e.stopPropagation());
  el.set = (hh, mm) => { t = (((hh % 12) * 60 + mm) % 720 + 720) % 720; draw(); }; el.value = () => [Math.floor(t / 60), t % 60];
  draw(); return el;
}
/* two-step helper with free labels: ① pick (what the story asks / the sentence) ② answer */
const tkTwoStep = (ctx, lab1, opts, right, hint1, then, lab2) => { const lab = h('div', { class: 'p4steplab', html: lab1 }), slot = h('div', { class: 'colstack' });
  const sub = { check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(4); lab.innerHTML = lab2 || `<b>${right}</b> ✓ · ขั้นที่ 2: หาคำตอบ`; slot.innerHTML = ''; slot.append(then()); ctx.say('ใช่แล้ว! หาคำตอบเลย'); } };
  slot.append(choices(sub, shuffle(opts).map(x => ({ value: x, label: x })), right, { hint: hint1 })); return h('div', { class: 'colstack' }, lab, slot); };

/* ---------- teaching sims ---------- */
function simTkCal(m, y, marks) { // tap a date → weekday · tap a weekday → its column and how many
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(); let dates = new Set(), cols = new Set(), hl = [], wd = -1;
  const draw = () => { fig.innerHTML = tkCal(m, y, { hl, wd, marks, ia: true }); };
  fig.addEventListener('click', e => { const c = e.target.closest('.d,.wd'); if (!c) return; e.stopPropagation(); sfx.tap();
    if (c.classList.contains('d')) { const d = +c.dataset.d, w = +c.dataset.w; hl = [d]; wd = -1; dates.add(d); draw(); out.innerHTML = `มองขึ้นไปที่หัวช่อง<br>วันที่ ${d} ${TK_MON[m]} ตรงกับ<b>วัน${TK_DAY[w]}</b>`; say(`วันที่ ${d} ${TK_MON[m]} ตรงกับวัน${TK_DAY[w]}`, true); }
    else { wd = +c.dataset.w; hl = []; cols.add(wd); draw(); const n = range(1, tkDays(m, y)).filter(d => tkWday(d, m, y) === wd); out.innerHTML = `วัน${TK_DAY[wd]} ทั้งเดือน<br>มี <b>${n.length} วัน</b> คือ ${n.join(', ')}`; }
    if (dates.size >= 2 && cols.size >= 1) teachDone(box); });
  draw(); out.innerHTML = 'แตะวันที่ 1 วัน เพื่อดูว่าตรงกับวันอะไร<br>แล้วแตะหัวช่อง (อา. จ. …) เพื่อนับวันนั้นทั้งเดือน'; box.append(fig, out); return box; }
/* v184 (ผู้ใช้ขอ): นับเดือนบนสันหมัด — เล่าทีละประเด็น (สันหมัดคืออะไร → ยกหมัดซ้าย → สันหมัด 4 ร่อง 3 → กติกา → เริ่มนับ)
   แล้วสาธิตนับทีละเดือน บอกครบ: เดือนที่เท่าไร · อักษรย่อ · อยู่บนสันหมัด/ร่องที่เท่าไร · กี่วัน · ตรงกับท้ายชื่อเดือน */
function tkFistSteps() { const S = [
    ['สันหมัดคืออะไร', 'เวลากำมือ ข้อนิ้วที่<b>นูนขึ้นมา</b> เรียกว่า <b>สันหมัด</b> ส่วนที่<b>เว้าลง</b>ระหว่างสันหมัด เรียกว่า <b>ร่อง</b>', tkFistSVG(-1, { upto: -1, parts: 1 })],
    ['ยกหมัดซ้ายขึ้นมา', 'น้อง ๆ ลอง<b>ยกหมัดซ้าย</b>ขึ้นมา กำมือให้แน่น หัน<b>หลังมือ</b>เข้าหาตัว — นิ้วโป้งจะอยู่ทางขวา', tkFistSVG(-1, { upto: -1, parts: 1 })],
    ['นับสันหมัดและร่อง', 'จากนิ้วชี้ไปถึงนิ้วก้อย มี<b>สันหมัด 4 สัน</b> (จุดแดง) และ<b>ร่อง 3 ร่อง</b> (จุดฟ้า) — ลองจับดูบนมือตัวเองนะ', tkFistSVG(-1, { upto: -1, num: 1 })],
    ['กติกา', 'เดือนที่ตรงกับ<b>สันหมัด</b> มี <b>31 วัน</b><br>เดือนที่ตรงกับ<b>ร่อง</b> มี <b>30 วัน</b> (ยกเว้นกุมภาพันธ์)', tkFistSVG(-1, { upto: -1, num: 1 })],
    ['เริ่มนับ', 'เริ่มที่<b>สันหมัดนิ้วชี้</b> (ข้างนิ้วโป้ง) แล้วนับไปทางนิ้วก้อยทีละช่อง: สันหมัด → ร่อง → สันหมัด → …', tkFistSVG(-1, { upto: -1, num: 1, start: 1 })]];
  TK_MON.forEach((nm, m) => { const i = tkSlot(m), kn = tkIsK(i), pos = kn ? `อยู่บน<b>สันหมัดที่ ${i / 2 + 1}</b>` : `อยู่ใน<b>ร่องที่ ${(i + 1) / 2}</b>`;
    const days = m === 1 ? 'ตกในร่อง แต่<b>กุมภาพันธ์พิเศษ</b> มี <b>28 วัน</b> (บางปีมี 29 วัน)' : kn ? `→ มี <b>31 วัน</b>` : `→ มี <b>30 วัน</b>`;
    const tail = m === 1 ? 'ชื่อลงท้าย “พันธ์” — จำไว้ว่าพิเศษ' : /คม$/.test(nm) ? 'ชื่อลงท้าย “คม” ✓ ตรงกับ 31 วัน' : 'ชื่อลงท้าย “ยน” ✓ ตรงกับ 30 วัน';
    const pre = m === 7 ? 'นับถึงนิ้วก้อยแล้ว <b>กลับไปเริ่มที่สันหมัดนิ้วชี้ใหม่</b><br>' : '';
    const post = m === 7 ? '<br>กรกฎาคมกับสิงหาคมจึงมี 31 วัน<b>ติดกัน 2 เดือน</b>' : m === 6 ? '<br>ถึงสันหมัดนิ้วก้อยแล้ว — เดือนต่อไปกลับไปเริ่มใหม่' : '';
    S.push([`เดือนที่ ${m + 1}`, `${pre}<b>${nm}</b> (อักษรย่อ <b>${TK_AB[m]}</b>) ${pos} ${days}<br><small>${tail}</small>${post}`, tkFistSVG(m, { upto: m })]); });
  S.push(['สรุป', '<b>31 วัน</b> (สันหมัด) 7 เดือน: ม.ค. มี.ค. พ.ค. ก.ค. ส.ค. ต.ค. ธ.ค.<br><b>30 วัน</b> (ร่อง) 4 เดือน: เม.ย. มิ.ย. ก.ย. พ.ย.<br><b>ก.พ.</b> 28 หรือ 29 วัน', tkFistSVG(-1)]);
  return S; }
function simTkFist() { const S = tkFistSteps(), N = S.length; let k = 0;
  const box = h('div', { class: 'colstack' }, h6wait()), pane = h('div', { class: 'pw-fig pw-in' }), lab = h('div', { class: 'tkfs-lab' }), txt = h('div', { class: 'fnote tkfs-txt' });
  const back = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (k > 0) { k--; show(); } } }, icon('left'), 'ย้อน');
  const go = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (k < N - 1) { k++; sfx.pop(k % 7 + 1); show(); } } }, icon('right'), h('span'));
  const show = () => { const [l, t, f] = S[k]; pane.innerHTML = f; pane.classList.remove('pw-in'); void pane.offsetWidth; pane.classList.add('pw-in'); lab.innerHTML = `${l} <small>${k + 1} / ${N}</small>`; txt.innerHTML = t;
    say(t.replace(/<[^>]+>/g, ' '), true); back.style.visibility = k ? '' : 'hidden';
    if (k >= N - 1) { go.style.display = 'none'; teachDone(box); } else { go.style.display = ''; go.lastChild.textContent = k >= 4 ? `นับเดือนต่อไป (${TK_MON[k - 4] || 'สรุป'})` : 'ขั้นต่อไป'; } };
  box.append(h('div', { class: 'pwk' }, pane, h('div', { class: 'colstack pw-side' }, lab, txt, h('div', { class: 'rowstack' }, back, go)))); show(); return box; }
/* v184 (ผู้ใช้ขอ): การ์ดจำ 12 เดือน — เริ่มเป็นเลข 1–12 · แตะครั้งที่ 1 = ชื่อเดือน · ครั้งที่ 2 = อักษรย่อ · ครั้งที่ 3 = กลับเป็นเลข */
function simTkMonCards() { const box = h('div', { class: 'colstack' }, h6wait()), seen = new Set(), st = Array(12).fill(0), note = fNote();
  const face = m => st[m] === 0 ? `<b class="num">${m + 1}</b><small>เดือนที่</small>` : st[m] === 1 ? `<b>${TK_MON[m]}</b><small>เดือนที่ ${m + 1}</small>` : `<b class="ab">${TK_AB[m]}</b><small>อักษรย่อ</small>`;
  const cards = TK_MON.map((_, m) => { const c = h('button', { class: 'tkmc ia s0', html: face(m) });
    c.onclick = e => { e.stopPropagation(); st[m] = (st[m] + 1) % 3; c.classList.remove('flip'); void c.offsetWidth; c.classList.add('flip'); c.className = c.className.replace(/\bs\d\b/, 's' + st[m]); c.innerHTML = face(m); sfx.pop(st[m] + 2);
      if (st[m] === 1) { seen.add(m); say(`เดือนที่ ${m + 1} ${TK_MON[m]}`, true); } else if (st[m] === 2) say(`อักษรย่อ ${TK_AB[m].split('').join(' ')}`, true);
      note.innerHTML = `เปิดชื่อเดือนแล้ว <b>${seen.size}</b> / 12 ใบ`; if (seen.size >= 12) { note.innerHTML = 'ครบ 12 เดือนแล้ว! ลองทายในใจก่อนแตะ แล้วแตะดูว่าถูกไหม'; teachDone(box); } };
    return c; });
  const all = (v, t) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); cards.forEach((c, m) => { st[m] = v; c.className = 'tkmc ia s' + v; c.innerHTML = face(m); }); sfx.tap(); } }, t);
  note.innerHTML = 'แตะการ์ด: ครั้งที่ 1 ดู<b>ชื่อเดือน</b> · ครั้งที่ 2 ดู<b>อักษรย่อ</b> · ครั้งที่ 3 กลับเป็นเลข';
  box.append(h('div', { class: 'tkmcs' }, ...cards), h('div', { class: 'rowstack' }, all(0, 'กลับเป็นเลขทุกใบ'), all(1, 'ดูชื่อทุกใบ'), all(2, 'ดูอักษรย่อทุกใบ')), note); return box; }
function simTkDate() { // build a date, see the ways to write it
  let d = 3, m = 9, y = 2568; const box = h('div', { class: 'colstack' }, h6wait()), out = h('div', { class: 'tk-dforms' }), seen = new Set();
  const draw = () => { const yy = String(y).slice(2), mm = String(m + 1).padStart(2, '0'), dd = String(d).padStart(2, '0');
    out.innerHTML = `<div class="tkdf big">วันที่ ${d} ${TK_MON[m]} พ.ศ. ${y}</div><div class="tkdf">${d} ${TK_AB[m]} ${yy}</div><div class="tkdf">${dd}/${mm}/${yy}</div><div class="tkdf">${dd}.${mm}.${yy}</div>`;
    if (seen.size >= 3) teachDone(box); };
  const step = (lab, f) => h('div', { class: 'tk-step' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); f(-1); seen.add(lab); sfx.tap(); draw(); } }, '−'), h('b', null, lab), h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); f(1); seen.add(lab); sfx.tap(); draw(); } }, '+'));
  const row = h('div', { class: 'rowstack' }, step('วันที่', s => { d = Math.min(tkDays(m, y), Math.max(1, d + s)); }), step('เดือน', s => { m = (m + s + 12) % 12; d = Math.min(d, tkDays(m, y)); }), step('ปี', s => { y += s; }));
  draw(); box.append(row, out, fNote('ลองเปลี่ยนวันที่ เดือน และปี<br>ดูว่าเขียนแบบย่อได้กี่แบบ')); return box; }
function simTkDay() { // 24 hours: tap an hour → clock + กลางวัน/กลางคืน
  const box = h('div', { class: 'colstack' }, h6wait()), clk = h('div', { class: 'pw-fig' }), out = fNote(), strip = h('div', { class: 'tk-24 ia' }), seen = new Set();
  const ACT = { 0: 'เที่ยงคืน', 6: 'ตื่นนอน', 7: 'ไปโรงเรียน', 12: 'กินข้าวกลางวัน (เที่ยงวัน)', 16: 'เลิกเรียน', 19: 'ทำการบ้าน', 21: 'เข้านอน' };
  range(0, 23).forEach(hh => strip.append(h('button', { class: 'tkh ' + (tkDayTime(hh) ? 'day' : 'night'), onclick: e => { e.stopPropagation(); sfx.tap(); show(hh); } }, String(hh))));
  const show = hh => { strip.querySelectorAll('.tkh').forEach((b, i) => b.classList.toggle('on', i === hh)); clk.innerHTML = tkClk(hh, 0, { sky: true }); seen.add(tkDayTime(hh) ? 'd' + hh : 'n' + hh);
    out.innerHTML = `<b>${hh} นาฬิกา</b> · เวลา${tkDayTime(hh) ? 'กลางวัน' : 'กลางคืน'}${ACT[hh] ? `<br>${ACT[hh]}` : ''}<br>เข็มสั้นชี้เลข ${hh % 12 || 12} · เข็มยาวชี้เลข 12`; say(`${hh} นาฬิกา เวลา${tkDayTime(hh) ? 'กลางวัน' : 'กลางคืน'}`, true);
    if ([...seen].some(x => x[0] === 'd') && [...seen].some(x => x[0] === 'n') && seen.size >= 4) teachDone(box); };
  clk.innerHTML = tkClk(7, 0, { sky: true }); out.innerHTML = 'แตะชั่วโมงในแถบ 0–23<br>สีเหลือง = กลางวัน (6–17) · สีน้ำเงิน = กลางคืน (18–5)';
  box.append(strip, clk, out); return box; }
function simTkMin() { // drag the long hand, count by fives
  const box = h('div', { class: 'colstack' }, h6wait()), out = fNote(), seen = new Set();
  const c = tkClock(9, 0, { mins: true, only: null, onSet: (hh, mm) => { seen.add(mm); out.innerHTML = `เข็มยาวชี้เลข ${mm / 5 || 12} → <b>${mm} นาที</b><br>นับทีละ 5: ${range(1, mm / 5).map(k => k * 5).join(', ') || '0'}<br>อ่านว่า <b>${tkTxt(hh || 12, mm)}</b>`; if (seen.size >= 4 && [...seen].some(x => x >= 30)) teachDone(box); } });
  out.innerHTML = 'ลากเข็มยาว (สีน้ำเงิน) ไปชี้เลขต่าง ๆ<br>เลขสีฟ้ารอบนอกบอกจำนวนนาที'; box.append(h('div', { class: 'pw-fig' }, c), out); return box; }
function simTkHours(h1, add) { // +1 hour at a time
  const box = h('div', { class: 'colstack' }), fig = h('div', { class: 'pw-fig' }), out = fNote(); let k = 0;
  const draw = () => { fig.innerHTML = `<div class="tk-pair">${tkClk(h1, 0, { cap: 'เริ่ม ' + tkTxt(h1, 0) })}${tkClk(h1 + k, 0, { cap: 'ตอนนี้ ' + tkTxt(h1 + k, 0), ring: '#3FAE5E' })}</div>`; };
  const go = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); k++; sfx.pop(k + 1); draw(); out.innerHTML = `ผ่านไป <b>${k} ชั่วโมง</b> (เข็มสั้นเดิน ${k} ช่อง)`;
    if (k >= add) { go.remove(); out.innerHTML += `<br>เริ่ม ${h1} นาฬิกา ใช้เวลา ${add} ชั่วโมง<br>เสร็จเวลา <b>${h1 + add} นาฬิกา</b>`; say(`เสร็จเวลา ${h1 + add} นาฬิกา`, true); } } }, icon('plus'), h('span', null, 'เดินไป 1 ชั่วโมง'));
  draw(); out.innerHTML = `เข็มยาวเดินครบ 1 รอบ = 1 ชั่วโมง<br>กดเดินทีละ 1 ชั่วโมง ${add} ครั้ง`; box.append(fig, go, out); return box; }
function simTkMins(h1, m1, add) { // +5 minutes at a time, elapsed arc
  const box = h('div', { class: 'colstack' }), fig = h('div', { class: 'pw-fig' }), out = fNote(); let k = 0;
  const draw = () => { const t = h1 * 60 + m1 + k; fig.innerHTML = tkClk(Math.floor(t / 60), t % 60, { arc: k ? [m1, (m1 + k) % 60] : null, mins: true }); };
  const go = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); k += 5; sfx.pop(k / 5); draw(); out.innerHTML = `ผ่านไป <b>${k} นาที</b> (เข็มยาวเดิน ${k / 5} ช่องใหญ่)`;
    if (k >= add) { go.remove(); const t = h1 * 60 + m1 + add; out.innerHTML += `<br>เริ่ม ${tkTxt(h1, m1)} ใช้เวลา ${add} นาที<br>เสร็จเวลา <b>${tkTxt(Math.floor(t / 60), t % 60)}</b>`; } } }, icon('plus'), h('span', null, 'เดินไป 5 นาที'));
  draw(); out.innerHTML = `เริ่ม ${tkTxt(h1, m1)}<br>ช่องใหญ่ 1 ช่อง = 5 นาที`; box.append(fig, go, out); return box; }
function simTkDigital() { // analog ↔ digital live
  const box = h('div', { class: 'colstack' }, h6wait()), dig = h('div', { class: 'pw-fig' }), out = fNote(); let pm = true, hh = 3, mm = 10, n = 0;
  const draw = () => { const H24 = (hh % 12) + (pm ? 12 : 0); dig.innerHTML = tkDigSVG(H24, mm, pm ? '#FFD45C' : '#9DB7F5', 200); out.innerHTML = `<b>${tkDig(H24, mm)}</b> อ่านว่า <b>${tkTxt(H24, mm)}</b><br>ตัวเลขหน้า : คือนาฬิกา · หลัง : คือนาที`; if (++n >= 4) teachDone(box); };
  const c = tkClock(hh, mm, { onSet: (a, b) => { hh = a; mm = b; draw(); } });
  const sw = h('div', { class: 'rowstack ia' }, ...[['กลางวัน', true], ['กลางคืน', false]].map(([t, v], i) => h('button', { class: 'btn sm vsel' + (i ? '' : ' on'), onclick: e => { e.stopPropagation(); pm = v; sw.querySelectorAll('.vsel').forEach((b, j) => b.classList.toggle('on', j === i)); sfx.tap(); draw(); } }, t)));
  draw(); n = 0; box.append(h('div', { class: 'tk-pair' }, c, dig), sw, out); return box; }

/* ---------- question types ---------- */
const tkYesNo = (ctx, h24) => { const blank = h('span', { class: 'blank' }, '?'); return h('div', { class: 'colstack' }, h('div', { class: 'sentence' }, h('span', { class: 'lab' }, `${h24} นาฬิกา เป็นเวลา`), blank), wordChoices(ctx, tkDayTime(h24) ? 'กลางวัน' : 'กลางคืน', blank, 'กลางวัน 6–17 นาฬิกา · กลางคืน 18–5 นาฬิกา', ['กลางวัน', 'กลางคืน'])); };
Object.assign(Q, {
  /* calendar: ask a weekday / date / count · tap cells to mark */
  tkCalQ({ m, y, marks, q, a, opts, num, unit = '', hint }) {
    return { prompt: q, say: q, mount(bd, ctx) { const fig = h('div', { class: 'p4-fig tkcalfig', html: tkCal(m, y, { marks }) }); tkCalMark(fig); /* v184 (ผู้ใช้ขอ): ปฏิทินซ้าย ส่วนตอบขวา */
      let right; if (num) { right = answerBox(ctx, String(a), { hint }); const sl = right.querySelector(':scope > .ans-slot'); if (sl && unit) { const row = h('div', { class: 'ans-urow' }); sl.replaceWith(row); row.append(sl, h('span', { class: 'cap', style: { fontSize: '20px' } }, unit)); } }
      else { right = choices(ctx, shuffle(opts).map(o => ({ value: o, label: o })), a, { hint }); right.classList.add('pp-opts'); }
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'g4sd p2sd pp-sd' }, h('div', { class: 'p2sd-l' }, fig), h('div', { class: 'g4sd-r' }, right)))); bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  /* read a clock: 'h' (hours, with sky) · 'hm' (hours + minutes) */
  tkRead({ h: H, m = 0, ask = 'hm', sky = true }) { const q = ask === 'h' ? 'นาฬิกาบอกเวลากี่นาฬิกา' : 'นาฬิกาบอกเวลาเท่าไร';
    return { prompt: q + (sky ? ' <small>(ดูรูปดวงอาทิตย์/ดวงจันทร์)</small>' : ''), say: q, mount(bd, ctx) { const fig = h('div', { class: 'p4-fig', html: tkClk(H, m, { sky }) });
      const hint = `เข็มสั้นชี้เลข ${H % 12 || 12}${ask === 'h' ? '' : ` · เข็มยาวชี้เลข ${m / 5 || 12} = ${m} นาที`}${sky && (H >= 13 || H === 0) ? ` · ${tkDayTime(H) ? 'กลางวันหลังเที่ยง บวก 12' : 'กลางคืน'}` : ''}`;
      bd.append(h('div', { class: 't6-q p4-q p2q' }, fig, ask === 'h' ? h('div', { class: 'rowstack' }, answerBox(ctx, String(H), { hint }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'นาฬิกา')) : duoInput(ctx, [H, m], ['นาฬิกา', 'นาที'], { pre: '', hint }))); } };
  },
  /* one dial hour → its daytime and night-time names */
  tkTwoNames({ k }) { const day = k >= 6 ? k : k + 12, night = k === 12 ? 0 : k >= 6 ? k + 12 : k; const q = 'เวลานี้เป็นได้ทั้งกลางวันและกลางคืน เติมทั้งสองแบบ';
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: `<div class="tk-pair">${tkClk(k, 0)}<span class="tk-dn">${tkSun(40)}${tkMoon(40)}</span></div>` }),
      duoInput(ctx, [day, night], ['นาฬิกา', 'นาฬิกา'], { rows: ['กลางวัน', 'กลางคืน'], names: ['เวลากลางวัน', 'เวลากลางคืน'], hint: `กลางวัน 6–17 นาฬิกา · กลางคืน 18–5 นาฬิกา · หลังเที่ยงให้บวก 12` }))); } };
  },
  /* set the hands, then say day or night when it matters */
  tkSet({ h: H, m = 0 }) { const q = `หมุนเข็มนาฬิกาให้เป็นเวลา ${tkTxt(H, m)}`;
    return { prompt: q + ' <small>(ลากเข็มยาวด้านนอก · ลากเข็มสั้นใกล้จุดกลาง)</small>', say: q, mount(bd, ctx) { const c = tkClock(H >= 6 && H < 12 ? 3 : 9, H >= 6 && H < 12 ? 30 : 15), slot = h('div', { class: 'colstack' });
      const chk = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); const [a, b] = c.value(); const ok = a === H % 12 && b === m;
        if (!ok) return ctx.check(false, b !== m ? `เข็มยาวต้องชี้เลข ${m / 5 || 12} (${m} นาที)` : `เข็มสั้นต้องชี้${m ? 'เลยเลข ' : 'ที่เลข '}${H % 12 || 12}`);
        chk.remove(); c.classList.remove('ia'); c.style.pointerEvents = 'none'; sfx.pop(5); slot.append(tkYesNo(ctx, H)); } }, icon('check'), h('span', null, 'ตรวจ'));
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig' }, c), h('div', { class: 'colstack' }, h('div', { class: 'fbig', html: `<b>${tkTxt(H, m)}</b>` }), chk, slot))); } };
  },
  /* digital → read */
  tkDigRead({ h: H, m }) { const q = 'นาฬิกาแบบตัวเลขนี้บอกเวลาเท่าไร';
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: tkDigSVG(H, m, pick(['#9BE3B5', '#FFB3C0', '#B8C8FF', '#FFE27A']), 220) }),
      duoInput(ctx, [H, m], ['นาฬิกา', 'นาที'], { pre: '', hint: `ตัวเลขหน้า : = ${H} นาฬิกา · หลัง : = ${m} นาที` }))); } };
  },
  /* time words → pick the digital clock */
  tkDigPick({ h: H, m }) { const q = `${tkTxt(H, m)} เขียนแบบนาฬิกาตัวเลขได้อย่างไร`, right = tkDig(H, m);
    const wrong = [tkDig(H > 12 ? H - 12 : H + 12 < 24 ? H + 12 : H - 1, m), tkDig(H, m ? 0 : 5), tkDig(m % 24 || 1, H % 60)].filter((x, i, A) => x !== right && A.indexOf(x) === i).slice(0, 2);
    return { prompt: q, say: q, mount(bd, ctx) { const c = choices(ctx, shuffle([right, ...wrong]).map(v => { const [a, b] = v.split(':').map(Number); return { value: v, label: tkDigSVG(a, b, '#FFE27A', 150) }; }), right, { hint: 'นาฬิกาอยู่หน้า : นาทีอยู่หลัง : ถ้ามีหลักเดียวเติม 0 ข้างหน้า' });
      c.classList.add('tk-digopts'); bd.append(h('div', { class: 'colstack' }, h('div', { class: 'fbig', html: `<b>${tkTxt(H, m)}</b>` }), c)); } };
  },
  /* elapsed time between two clocks (or two written times) */
  tkElapsed({ h1, m1 = 0, h2, m2 = 0, mode, what, clocks = true }) { const mins = (h2 * 60 + m2) - (h1 * 60 + m1), q = `${what ? what + ' ' : ''}ใช้เวลานานเท่าไร`;
    const unit = mins % 60 === 0 ? 'ชั่วโมง' : mins < 60 ? 'นาที' : null, ans = unit === 'ชั่วโมง' ? mins / 60 : mins;
    return { prompt: q, say: (what ? what + ' ' : '') + `เริ่ม ${tkTxt(h1, m1)} ถึง ${tkTxt(h2, m2)} ใช้เวลานานเท่าไร`, mount(bd, ctx) {
      const fig = clocks ? `<div class="tk-pair">${tkClk(h1, m1, { cap: 'เริ่ม ' + tkTxt(h1, m1) })}${tkClk(h2, m2, { cap: 'สิ้นสุด ' + tkTxt(h2, m2), ring: '#3FAE5E' })}</div>` : `<div class="tk-rows"><div>เริ่ม <b>${tkTxt(h1, m1)}</b></div><div>สิ้นสุด <b>${tkTxt(h2, m2)}</b></div></div>`;
      const hint = unit === 'ชั่วโมง' ? `นับเข็มสั้นจาก ${h1} ไป ${h2} ทีละ 1 ชั่วโมง` : `นับเข็มยาวทีละ 5 นาที จาก ${m1} ถึง ${m2 || 60}`;
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: fig }), unit ? h('div', { class: 'rowstack' }, answerBox(ctx, String(ans), { hint }), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit)) : duoInput(ctx, [Math.floor(mins / 60), mins % 60], ['ชั่วโมง', 'นาที'], { pre: '', hint }))); } };
  },
  /* start + duration → end time */
  tkEnd({ text, h1, m1 = 0, add }) { const t = h1 * 60 + m1 + add, H = Math.floor(t / 60) % 24, M = t % 60;
    return { prompt: 'อ่านโจทย์ แล้วหาเวลาที่เสร็จ', say: text, mount(bd, ctx) {
      const fig = `<div class="storybox">${text}</div>${tkClk(h1, m1, { cap: 'เวลาเริ่ม', arc: add < 60 ? [m1, (m1 + add) % 60] : null })}`;
      bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'p4-fig', html: fig }), duoInput(ctx, [H, M], ['นาฬิกา', 'นาที'], { pre: 'เสร็จเวลา', hint: add % 60 === 0 ? `เข็มสั้นเดินต่อไป ${add / 60} ชั่วโมง (ถ้าไม่มีนาทีให้กด 0)` : `เข็มยาวเดินต่อ ${add} นาที จาก ${m1} นาที` }))); } };
  },
  /* word problems: ① what does it ask? (sentence) ② answer */
  tkStory({ text, sent, wrong, a, unit, duo }) {
    return { prompt: 'อ่านโจทย์ เลือกวิธีคิด แล้วหาคำตอบ', say: text, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text })),
        tkTwoStep(ctx, 'ขั้นที่ 1: เลือก<b>วิธีคิด</b>', [sent, ...wrong], sent, 'อ่านว่าโจทย์ถามอะไร รวมกัน ต่างกัน หรือเวลาที่ผ่านไป',
          () => duo ? duoInput(ctx, a, duo, { pre: '' }) : h('div', { class: 'rowstack' }, answerBox(ctx, String(a), {}), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit))))); } };
  }
});
const tkPick = (fig, q, right, wrong, hint) => Q.p4Pick({ fig, q, opts: [right, ...wrong], right, hint });
const tkMonGroup = () => Q.ixGroup({ q: 'แตะชื่อเดือน แล้วแตะกล่องจำนวนวัน', bins: ['30 วัน', '31 วัน', '28 หรือ 29 วัน'], items: pkF([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 6).map(k => ({ label: TK_MON[k], bin: k === 1 ? 2 : tkDays(k, 2568) === 30 ? 0 : 1, why: k === 1 ? 'กุมภาพันธ์มี 28 หรือ 29 วัน' : /ยน$/.test(TK_MON[k]) ? 'ลงท้าย “ยน” มี 30 วัน' : 'ลงท้าย “คม” มี 31 วัน' })) });
const tkMonSort = () => { const ks = pkF([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 4); return Q.ixSort({ q: 'เรียงเดือนจากต้นปีไปปลายปี', items: ks.map(k => ({ label: TK_MON[k], v: k })), dir: 'asc' }); };
const tkAbMatch = () => Q.ixMatch({ q: 'จับคู่ชื่อเดือนกับอักษรย่อ', pairs: pkF([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 4).map(k => [TK_MON[k], TK_AB[k]]) });
const tkDateWord = (d, m, y) => `วันที่ ${d} ${TK_MON[m]} พ.ศ. ${y}`;

/* ---------- data: practice + วิชาคณิตศาสตร์ ป.2 เรื่อง เวลา — รูปวาดใหม่ทั้งหมด) ---------- */
const TKW_CAL1 = { m: 7, y: 2568, marks: { 12: 'วันแม่' } }, TKW_CAL2 = { m: 1, y: 2568, marks: { 12: 'มาฆบูชา' } }, TKW_CAL3 = { m: 6, y: 2564, marks: { 28: 'วันเฉลิมฯ' } };
const TKW_DATES = [['3 ต.ค. 64', 3, 9, 2564], ['17/03/67', 17, 2, 2567], ['28. 06. 61', 28, 5, 2561], ['24. 01. 64', 24, 0, 2564], ['01 ส.ค. 2561', 1, 7, 2561], ['08 ก.พ. 2563', 8, 1, 2563], ['11/05/62', 11, 4, 2562], ['26/04/65', 26, 3, 2565]]; // 
const TKW_H = [18, 15, 10, 1, 4, 7]; // (มีดวงอาทิตย์/ดวงจันทร์)
const TKW_DIAL = [2, 11, 4, 6, 9, 7]; // 
const TKW_SETH = [7, 16, 21, 23, 0, 13]; // 
const TKW_HM = [[15, 10], [0, 25], [9, 40], [22, 15], [16, 55], [21, 30], [21, 35], [6, 5], [13, 50], [4, 45], [23, 10], [1, 20], [8, 15], [13, 35], [14, 55], [12, 5]]; // 
const TKW_SETHM = [[7, 5], [17, 50], [22, 30], [12, 10], [0, 40], [1, 45]]; // 
const TKW_MATCH = [[2, 25], [9, 0], [18, 45], [20, 10], [13, 5]]; // 
const TKW_END = [{ text: 'ภูเริ่มอ่านหนังสือเวลา 16 นาฬิกา อ่านอยู่ 2 ชั่วโมง ภูอ่านจบเวลาใด', h1: 16, add: 120 },
  { text: 'ป่านนั่งรถไฟใช้เวลา 25 นาที โดยออกเดินทางเวลา 13 นาฬิกา 30 นาที ป่านถึงปลายทางเวลาใด', h1: 13, m1: 30, add: 25 },
  { text: 'การแสดงละครเริ่มเวลา 13 นาฬิกา 15 นาที แสดงนาน 4 ชั่วโมง ละครจบเวลาใด', h1: 13, m1: 15, add: 240 },
  { text: 'มิวเริ่มเรียนว่ายน้ำเวลา 9 นาฬิกา เรียนนาน 25 นาที มิวเรียนเสร็จเวลาใด', h1: 9, add: 25 }]; // 
const TKW_DURH = [['ไอซ์เรียนภาษาไทย', 8, 30, 11, 30], ['จูนเล่นดนตรี', 12, 0, 17, 0], ['พ่อทำสวน', 10, 10, 12, 10], ['ยายออกกำลังกาย', 21, 0, 22, 0], ['ปู่อ่านหนังสือพิมพ์', 20, 0, 22, 0], ['พ่อทำงานที่สวน', 7, 45, 10, 45], ['นิดาเดินทางไปตลาด', 6, 25, 12, 25], ['เรียนวิทยาศาสตร์', 10, 20, 12, 20], ['อ่านหนังสือ', 3, 45, 7, 45], ['เล่นกีฬา', 9, 5, 11, 5]]; // 
const TKW_DURM = [['สปายเดินทางไปตลาด', 9, 10, 9, 20], ['ขวัญอ่านหนังสือ', 8, 25, 8, 35], ['บัวรดน้ำต้นไม้', 11, 35, 11, 50], ['แม่ทำอาหาร', 6, 30, 7, 0], ['แจนทำการบ้าน', 19, 5, 19, 45], ['น้องเล่นฟุตบอล', 7, 15, 7, 40], ['พี่ล้างจาน', 14, 30, 14, 55], ['โอ๋เล่นที่สวนสนุก', 15, 15, 15, 30], ['ปาล์มดูโทรทัศน์', 21, 50, 22, 30], ['ออกกำลังกาย', 1, 40, 2, 0], ['ซักผ้า', 2, 25, 2, 55], ['เล่นเกม', 5, 35, 5, 50]]; // 
const TKW_DIG = [[15, 10], [8, 55], [1, 35], [12, 0], [22, 20], [0, 15]]; // 
const TKW_TODIG = [[16, 50], [9, 15], [12, 40], [3, 35], [20, 10], [23, 0]]; // 
const TKW_ST = [{ text: 'บีมวิ่งจ็อกกิ้ง 55 นาที นุ่นวิ่งนานกว่าบีม 13 นาที นุ่นวิ่งกี่นาที', sent: '55 + 13', wrong: ['55 − 13', '55 × 13'], a: 68, unit: 'นาที' },
  { text: 'ฟ้าเปิดร้านขายขนมเวลา 08.00 น. ถึง 16.00 น. ฟ้าเปิดร้านกี่ชั่วโมง', sent: '16 − 8', wrong: ['16 + 8', '8 − 16'], a: 8, unit: 'ชั่วโมง' },
  { text: 'น้องฟ้าอายุ 10 ปี น้าอายุ 40 ปี น้องฟ้าอายุน้อยกว่าน้ากี่ปี', sent: '40 − 10', wrong: ['40 + 10', '10 − 40'], a: 30, unit: 'ปี' },
  { text: 'ช่างสร้างบ้านหลังแรกใช้เวลา 8 เดือน หลังที่สองใช้เวลา 3 เดือน สร้างบ้านทั้งสองหลังใช้เวลารวมกี่เดือน', sent: '8 + 3', wrong: ['3 − 8', '8 × 3'], a: 11, unit: 'เดือน' },
  { text: 'ญาญ่าออกกำลังกาย 1 ชั่วโมง 10 นาที แล้วเล่นโยคะอีก 2 ชั่วโมง 30 นาที ญาญ่าใช้เวลาทั้งหมดเท่าไร', sent: 'ชั่วโมงรวมกัน นาทีรวมกัน', wrong: ['ชั่วโมงลบกัน นาทีลบกัน', 'ชั่วโมงคูณกัน'], a: [3, 40], duo: ['ชั่วโมง', 'นาที'] },
  { text: 'บีมเริ่มกินข้าวเวลา 18 นาฬิกา 3 นาที กินเสร็จเวลา 18 นาฬิกา 40 นาที บีมกินข้าวนานกี่นาที', sent: '40 − 3', wrong: ['40 + 3', '18 + 40'], a: 37, unit: 'นาที' },
  { text: 'สอบคณิตศาสตร์ 90 นาที สอบภาษาไทย 60 นาที สอบสองวิชาใช้เวลารวมกี่นาที', sent: '90 + 60', wrong: ['90 − 60', '90 × 60'], a: 150, unit: 'นาที' },
  { text: 'ต้นใช้เวลาวาดภาพ 3 ชั่วโมง พลอยใช้เวลา 2 ชั่วโมง ต้นใช้เวลามากกว่าพลอยกี่ชั่วโมง', sent: '3 − 2', wrong: ['3 + 2', '3 × 2'], a: 1, unit: 'ชั่วโมง' },
  { text: 'แม่รีดผ้า 50 นาที พ่อรีดผ้า 40 นาที แม่ใช้เวลามากกว่าพ่อกี่นาที', sent: '50 − 40', wrong: ['50 + 40', '40 − 50'], a: 10, unit: 'นาที' },
  { text: 'ส้มนั่งรถกลับบ้าน 40 นาที แล้วอาบน้ำ 25 นาที ส้มใช้เวลานั่งรถมากกว่าอาบน้ำกี่นาที', sent: '40 − 25', wrong: ['40 + 25', '25 − 40'], a: 15, unit: 'นาที' }]; // เรื่องเวลา

/* ---------- lessons (① รู้จัก → ② ตัวอย่างมีรูป → ③ ลองทำ → เกม) ---------- */
const L2T = (no, vno, place, title, short, goal, teach, game) => ({ id: 960 + no, no, place, title, short, tone: TONES5[(no + 2) % 6], goal, teach, game, learned: true });
const tkCalFig = c => tkCal(c.m, c.y, { marks: c.marks });
const LESSONS_P2C7 = [
  L2T(1, 13, 'หาดปฏิทิน', 'การอ่านปฏิทิน (1)', 'อ่านปฏิทิน (1)', 'อ่านปฏิทิน บอกวัน วันที่ เดือน และปี และบอกว่าวันที่ใดตรงกับวันอะไร',
    [...learnStep('ยินดีต้อนรับสู่ <b>ชายหาดนาฬิกา</b>! รู้จัก<b>ปฏิทิน</b>', 'ยินดีต้อนรับสู่ชายหาดนาฬิกา รู้จักปฏิทิน', [
      { fig: tkCal(9, 2568, { marks: { 23: 'ปิยมหาราช' } }), name: 'ปฏิทินบอก วัน วันที่ เดือน ปี', text: 'ด้านบนบอกเดือนและปี พ.ศ.<br>ตัวเลขในช่องคือวันที่' },
      { fig: `<div class="tk-days">${TK_DAY.map((d, i) => `<span style="--wc:${TK_WC[i]}">วัน${d}</span>`).join('')}</div>`, name: '1 สัปดาห์มี 7 วัน', text: 'อาทิตย์ จันทร์ อังคาร พุธ พฤหัสบดี ศุกร์ เสาร์<br>แล้ววนกลับมาวันอาทิตย์' },
      { fig: tkCal(9, 2568, { hl: [16], wd: 4 }), name: 'วันที่ 16 ตรงกับวันอะไร', text: 'หาเลข 16 แล้วดูขึ้นไปที่หัวช่อง<br>ช่อง พฤ. → <b>วันพฤหัสบดี</b>' }], 'ดูเดือนและปีที่หัวปฏิทิน · หาวันที่ แล้วดูหัวช่องว่าตรงกับวันอะไร'),
     pexStep('ตัวอย่างทีละขั้น: วันอังคารในเดือนตุลาคม 2568 มีกี่วัน', 'ตัวอย่างทีละขั้น', [['① หาหัวช่อง', 'ช่อง อ. คือวันอังคาร', tkCal(9, 2568, { wd: 2 })], ['② นับลงมา', 'วันที่ 7, 14, 21, 28', null], ['③ ตอบ', 'มีวันอังคาร <b>4 วัน</b>', null]], 'วันอังคาร <b>4 วัน</b>'),
     T('ลองแตะปฏิทินเอง', 'ลองแตะปฏิทินเอง', el => el.append(simTkCal(9, 2568, { 23: 'ปิยมหาราช' })))],
    () => { const C = pick([TKW_CAL1, TKW_CAL2]), O = C === TKW_CAL1 ? TKW_CAL2 : TKW_CAL1, nm = TK_MON[C.m];
      const d = pick([6, 8, 15, 20, 25]), w = tkWday(d, C.m, C.y), wd = pick([2, 4, 5]), cnt = range(1, tkDays(C.m, C.y)).filter(x => tkWday(x, C.m, C.y) === wd).length;
      return [Q.tkCalQ({ ...C, q: `วันที่ ${d} ${nm} ตรงกับวันอะไร`, a: 'วัน' + TK_DAY[w], opts: ['วัน' + TK_DAY[w], 'วัน' + TK_DAY[(w + 1) % 7], 'วัน' + TK_DAY[(w + 6) % 7]], hint: `หาเลข ${d} แล้วดูหัวช่องด้านบน` }),
        Q.tkCalQ({ ...C, q: `เดือน${nm}มีวัน${TK_DAY[wd]}กี่วัน`, a: cnt, num: true, unit: 'วัน', hint: `ดูช่อง ${TK_WD[wd]} แล้วนับลงมา (แตะเพื่อทำเครื่องหมาย)` }),
        Q.tkCalQ({ ...C, q: `เดือน${nm}มีกี่วัน`, a: tkDays(C.m, C.y), num: true, unit: 'วัน', hint: 'ดูเลขวันที่สุดท้ายของเดือน' }),
        Q.tkCalQ({ ...O, q: `${O.marks[12] === 'วันแม่' ? 'วันแม่แห่งชาติ' : 'วันมาฆบูชา'}ตรงกับวันที่เท่าไร`, a: 12, num: true, hint: 'หาช่องที่มีคำบอกวันสำคัญ' }),
        Q.tkCalQ({ ...TKW_CAL3, q: 'วันที่ 18 กรกฎาคม ตรงกับวันอะไร', a: 'วันอาทิตย์', opts: ['วันอาทิตย์', 'วันเสาร์', 'วันจันทร์'], hint: 'หาเลข 18 แล้วดูหัวช่อง' })]; }),
  L2T(2, 14, 'หาดสิบสองเดือน', 'การอ่านปฏิทิน (2)', 'อ่านปฏิทิน (2)', 'บอกชื่อเดือนทั้ง 12 เดือน ลำดับของเดือน อักษรย่อ และจำนวนวันในแต่ละเดือน',
    [...learnStep('<b>1 ปีมี 12 เดือน</b>', '1 ปีมี 12 เดือน', [
      { fig: `<div class="tk-mons">${TK_MON.map((x, i) => `<span><b>${i + 1}</b>${x}<small>${TK_AB[i]}</small></span>`).join('')}</div>`, name: 'เรียงจากมกราคมถึงธันวาคม', text: 'เดือนที่ 1 มกราคม … เดือนที่ 12 ธันวาคม<br>แต่ละเดือนมีอักษรย่อ' },
      { fig: lrow(lcap(lbig('…คม', 'sm'), '31 วัน'), lcap(lbig('…ยน', 'sm'), '30 วัน'), lcap(lbig('กุมภาพันธ์', 'sm'), '28 หรือ 29 วัน')), name: 'ดูท้ายชื่อเดือน', text: 'ลงท้าย “คม” มี 31 วัน<br>ลงท้าย “ยน” มี 30 วัน' },
      { fig: tkFistSVG(0), name: 'นับบนสันหมัดก็ได้', text: 'สันหมัด = 31 วัน · ร่อง = 30 วัน' }], 'คม = 31 · ยน = 30 · กุมภาพันธ์ = 28 หรือ 29'),
     /* v184 (ผู้ใช้ขอ): ตัวอย่างเดือนต่อจากเมษายน → เกมการ์ดจำ 12 เดือน */
     T('เกม<b>การ์ดจำเดือน</b>: แตะการ์ดเพื่อดูชื่อเดือน แตะอีกครั้งดูอักษรย่อ', 'เกมการ์ดจำเดือน แตะการ์ดเพื่อดูชื่อเดือน แตะอีกครั้งดูอักษรย่อ', el => el.append(simTkMonCards())),
     T('มาลอง<b>นับเดือนบนสันหมัด</b>กัน — กดทีละขั้น', 'มาลองนับเดือนบนสันหมัดกัน กดทีละขั้น', el => el.append(simTkFist()))],
    () => [tkMonGroup(), tkMonSort(), tkAbMatch(), tkPick(null, 'เดือนที่ 11 คือเดือนใด', 'พฤศจิกายน', ['ตุลาคม', 'ธันวาคม'], 'นับจากมกราคม = 1'), tkPick(null, 'เดือนที่ต่อจากเดือนมีนาคมคือเดือนใด', 'เมษายน', ['กุมภาพันธ์', 'พฤษภาคม'], 'มีนาคมเดือนที่ 3 · ถัดไปเดือนที่ 4'),
      tkPick(null, 'ก.ย. เป็นอักษรย่อของเดือนใด', 'กันยายน', ['กรกฎาคม', 'สิงหาคม'], 'ก.ย. = กัน-ยา-ยน')]),
  L2T(3, 15, 'หาดเขียนวันที่', 'การเขียนแสดงวัน เดือน ปี', 'เขียนวัน เดือน ปี', 'อ่านและเขียนแสดงวัน เดือน ปี แบบเต็มและแบบย่อ',
    [...learnStep('<b>เขียนวัน เดือน ปี</b>', 'เขียนวัน เดือน ปี', [
      { fig: lbig('วันที่ 5 ธันวาคม พ.ศ. 2568'), name: 'แบบเต็ม', text: 'วันที่ → เดือน → ปี พ.ศ.' },
      { fig: lbig('5 ธ.ค. 68'), name: 'แบบย่อชื่อเดือน', text: 'ใช้อักษรย่อของเดือน<br>เขียนปีแค่ 2 ตัวท้าย' },
      { fig: lbig('05/12/68 · 05.12.68'), name: 'แบบตัวเลขล้วน', text: 'วันที่ / เดือนที่ / ปี<br>12 คือเดือนที่ 12 = ธันวาคม' }], 'เรียงเสมอ: วันที่ → เดือน → ปี'),
     pexStep('ตัวอย่างทีละขั้น: 14/02/66 หมายถึงอะไร', 'ตัวอย่างทีละขั้น', [['① ตัวแรก', '14 = วันที่ 14', lbig('<b>14</b>/02/66')], ['② ตัวกลาง', '02 = เดือนที่ 2 = กุมภาพันธ์', lbig('14/<b>02</b>/66')], ['③ ตัวท้าย', '66 = พ.ศ. 2566', lbig('14/02/<b>66</b>')]], 'วันที่ 14 กุมภาพันธ์ พ.ศ. 2566'),
     T('ลองเปลี่ยนวันที่ เดือน ปี', 'ลองเปลี่ยนวันที่ เดือน ปี', el => el.append(simTkDate()))],
    () => [...pkF(TKW_DATES, 3).map(([s, d, m, y]) => tkPick(lbig(s), `${s} หมายถึงวันใด`, tkDateWord(d, m, y), [tkDateWord(d, (m + 1) % 12, y), tkDateWord(m + 1 <= tkDays(m, y) ? m + 1 : d, m, y), tkDateWord(d, m, y - 10)].filter((x, i, A) => A.indexOf(x) === i && x !== tkDateWord(d, m, y)).slice(0, 2), 'วันที่ → เดือนที่ → ปี')),
      Q.ixMatch({ q: 'จับคู่แบบย่อกับแบบเต็ม', pairs: pkF(TKW_DATES, 3).map(([s, d, m, y]) => [s, tkDateWord(d, m, y)]), wide: true }),
      (() => { const [, d, m, y] = pick(TKW_DATES); return tkPick(null, `${tkDateWord(d, m, y)} เขียนแบบย่อได้อย่างไร`, `${d} ${TK_AB[m]} ${String(y).slice(2)}`, [`${d} ${TK_AB[(m + 1) % 12]} ${String(y).slice(2)}`, `${m + 1} ${TK_AB[d % 12]} ${String(y).slice(2)}`], 'วันที่ แล้วอักษรย่อเดือน แล้วปี 2 ตัวท้าย'); })()]),
  L2T(4, 16, 'หาดนาฬิกา', 'การบอกเวลาเป็นนาฬิกา', 'เวลาเป็นนาฬิกา', 'บอกเวลาเป็นนาฬิกา และบอกได้ว่าเป็นเวลากลางวันหรือกลางคืน',
    [...learnStep('รู้จัก<b>หน้าปัดนาฬิกา</b>', 'รู้จักหน้าปัดนาฬิกา', [
      { fig: tkClk(3, 0), name: 'เข็มสั้น กับ เข็มยาว', text: '<b style="color:#E5505E">เข็มสั้น</b> บอกนาฬิกา<br><b>เข็มยาว</b> บอกนาที' },
      { fig: tkClk(3, 0, { hl: 'm' }), name: 'เข็มยาวชี้เลข 12 = ตรง', text: 'ถ้าเข็มยาวชี้ 12 อ่านแค่เข็มสั้น<br>เข็มสั้นชี้ 3 → 3 นาฬิกา' },
      { fig: `<div class="tk-pair">${tkClk(9, 0, { sky: true, cap: 'กลางวัน 9 นาฬิกา' })}${tkClk(21, 0, { sky: true, cap: 'กลางคืน 21 นาฬิกา' })}</div>`, name: 'วันหนึ่งมี 24 ชั่วโมง', text: 'กลางวัน 6–17 นาฬิกา · กลางคืน 18–5 นาฬิกา<br>หลังเที่ยง เข็มสั้นชี้ 3 = 15 นาฬิกา (3 + 12)' }], 'อ่านเข็มสั้น · หลังเที่ยงบวก 12 · เที่ยงคืน = 0 นาฬิกา'),
     pexStep('ตัวอย่างทีละขั้น: ตอนเย็น เข็มสั้นชี้เลข 5', 'ตัวอย่างทีละขั้น', [['① ดูเข็มยาว', 'ชี้เลข 12 → ตรง ไม่มีนาที', tkClk(17, 0, { hl: 'm' })], ['② ดูเข็มสั้น', 'ชี้เลข 5', tkClk(17, 0, { hl: 'h' })], ['③ กลางวันหลังเที่ยง', '5 + 12 = 17', tkClk(17, 0, { sky: true })]], 'ตอนเย็นอ่านว่า <b>17 นาฬิกา</b>'),
     T('ลองแตะดูเวลาตลอดวัน', 'ลองแตะดูเวลาตลอดวัน', el => el.append(simTkDay()))],
    () => [...pkF(TKW_H, 2).map(H => Q.tkRead({ h: H, ask: 'h' })), Q.tkTwoNames({ k: pick(TKW_DIAL) }), ...pkF(TKW_SETH, 2).map(H => Q.tkSet({ h: H }))]),
  L2T(5, 17, 'หาดห้านาที', 'การบอกเวลาเป็นนาฬิกาและนาที (ช่วง 5 นาที)', 'นาฬิกาและนาที', 'บอกเวลาเป็นนาฬิกาและนาที เมื่อเข็มยาวชี้ตัวเลข (ช่วง 5 นาที)',
    [...learnStep('อ่าน<b>นาที</b>จากเข็มยาว', 'อ่านนาทีจากเข็มยาว', [
      { fig: tkClk(9, 0, { mins: true }), name: 'ช่องใหญ่ 1 ช่อง = 5 นาที', text: 'เข็มยาวชี้ 1 = 5 นาที · ชี้ 2 = 10 นาที …<br>นับทีละ 5' },
      { fig: tkClk(9, 20, { mins: true, hl: 'm' }), name: 'เข็มยาวชี้เลข 4', text: '5, 10, 15, 20 → <b>20 นาที</b>' },
      { fig: tkClk(9, 20, { hl: 'h' }), name: 'เข็มสั้นเลยเลข 9 มานิดหน่อย', text: 'ยังไม่ถึง 10 → อ่าน <b>9 นาฬิกา 20 นาที</b>' }], 'อ่านนาฬิกาจากเข็มสั้น (เลขที่ผ่านมาแล้ว) · นาทีจากเข็มยาวนับทีละ 5'),
     pexStep('ตัวอย่างทีละขั้น: ตอนกลางคืน', 'ตัวอย่างทีละขั้น', [['① เข็มยาว', 'ชี้เลข 7 → 7 × 5 = 35 นาที', tkClk(20, 35, { mins: true, hl: 'm' })], ['② เข็มสั้น', 'อยู่ระหว่าง 8 กับ 9 → ผ่าน 8 มาแล้ว', tkClk(20, 35, { hl: 'h' })], ['③ กลางคืน', '8 + 12 = 20', tkClk(20, 35, { sky: true })]], '<b>20 นาฬิกา 35 นาที</b>'),
     T('ลองลากเข็มยาวเอง', 'ลองลากเข็มยาวเอง', el => el.append(simTkMin()))],
    () => [...pkF(TKW_HM, 3).map(([H, M]) => Q.tkRead({ h: H, m: M })), Q.tkSet(pick(TKW_SETHM.map(([H, M]) => ({ h: H, m: M })))), Q.ixMatch({ q: 'จับคู่นาฬิกากับเวลา', pairs: pkF(TKW_MATCH, 3).map(([H, M]) => [tkClockSVG(H, M, { size: 96 }) + tkSkyIcon(H, 26), tkTxt(H, M)]) })]),
  L2T(6, 18, 'หาดชั่วโมง', 'การบอกระยะเวลาเป็นชั่วโมง และการหาเวลาสิ้นสุดกิจกรรม', 'ระยะเวลาเป็นชั่วโมง', 'บอกระยะเวลาเป็นชั่วโมง และหาเวลาสิ้นสุดของกิจกรรม',
    [...learnStep('<b>ระยะเวลา</b>เป็นชั่วโมง', 'ระยะเวลาเป็นชั่วโมง', [
      { fig: tkClk(8, 0, { mins: true }), name: '1 ชั่วโมง = 60 นาที', text: 'เข็มยาวเดินครบ 1 รอบ<br>เข็มสั้นเดินไป 1 ช่อง' },
      { fig: `<div class="tk-pair">${tkClk(8, 0, { cap: 'เริ่ม 8 นาฬิกา' })}${tkClk(11, 0, { cap: 'เสร็จ 11 นาฬิกา', ring: '#3FAE5E' })}</div>`, name: 'นับว่าเข็มสั้นเดินกี่ช่อง', text: '8 → 9 → 10 → 11 = <b>3 ชั่วโมง</b>' },
      { fig: lbig('เวลาเริ่ม + ระยะเวลา = เวลาสิ้นสุด'), name: 'หาเวลาสิ้นสุด', text: 'เริ่ม 14 นาฬิกา ใช้เวลา 2 ชั่วโมง → 16 นาฬิกา' }], 'ระยะเวลา = นับชั่วโมงจากเวลาเริ่มถึงเวลาสิ้นสุด'),
     pexStep('ตัวอย่างทีละขั้น: เริ่ม 9 นาฬิกา 30 นาที ถึง 12 นาฬิกา 30 นาที', 'ตัวอย่างทีละขั้น', [['① ดูนาที', 'นาทีเท่ากัน (30) → นับแค่ชั่วโมง', `<div class="tk-pair">${tkClk(9, 30)}${tkClk(12, 30, { ring: '#3FAE5E' })}</div>`], ['② นับชั่วโมง', '9:30 → 10:30 → 11:30 → 12:30', null], ['③ ตอบ', 'นับได้ 3 ครั้ง', null]], 'ใช้เวลา <b>3 ชั่วโมง</b>'),
     T('ลองเดินเวลาทีละชั่วโมง', 'ลองเดินเวลาทีละชั่วโมง', el => el.append(simTkHours(13, 3)))],
    () => [...pkF(TKW_DURH, 3).map(([w, a, b, c, d], i) => Q.tkElapsed({ what: w, h1: a, m1: b, h2: c, m2: d, clocks: i < 2 })), Q.tkEnd(TKW_END[0]), Q.tkEnd(TKW_END[2])]),
  L2T(7, 19, 'หาดนาที', 'การบอกระยะเวลาเป็นนาที และการหาเวลาสิ้นสุดกิจกรรม', 'ระยะเวลาเป็นนาที', 'บอกระยะเวลาเป็นนาที และหาเวลาสิ้นสุดของกิจกรรม',
    [...learnStep('<b>ระยะเวลา</b>เป็นนาที', 'ระยะเวลาเป็นนาที', [
      { fig: tkClk(10, 25, { mins: true, arc: [10, 25] }), name: 'นับว่าเข็มยาวเดินไปกี่นาที', text: 'จาก 10 นาที ไป 25 นาที<br>นับทีละ 5: 15, 20, 25 → <b>15 นาที</b>' },
      { fig: lbig('25 − 10 = 15'), name: 'หรือเอานาทีลบกัน', text: 'เมื่อนาฬิกาเท่ากัน (ยังไม่ข้ามชั่วโมง)' },
      { fig: tkClk(7, 0, { mins: true, arc: [40, 0] }), name: 'ข้ามชั่วโมงก็ได้', text: '6:40 ถึง 7:00 → 45, 50, 55, 60<br>= <b>20 นาที</b>' }], 'นับเข็มยาวทีละ 5 นาที จากเวลาเริ่มถึงเวลาสิ้นสุด'),
     pexStep('ตัวอย่างทีละขั้น: เริ่ม 16 นาฬิกา 20 นาที ใช้เวลา 25 นาที', 'ตัวอย่างทีละขั้น', [['① เวลาเริ่ม', 'เข็มยาวชี้ 4 (20 นาที)', tkClk(16, 20, { mins: true })], ['② เดินไป 25 นาที', '25, 30, 35, 40, 45', tkClk(16, 45, { mins: true, arc: [20, 45] })], ['③ เวลาสิ้นสุด', '20 + 25 = 45 นาที', null]], 'เสร็จเวลา <b>16 นาฬิกา 45 นาที</b>'),
     T('ลองเดินเวลาทีละ 5 นาที', 'ลองเดินเวลาทีละ 5 นาที', el => el.append(simTkMins(10, 15, 20)))],
    () => [...pkF(TKW_DURM, 3).map(([w, a, b, c, d], i) => Q.tkElapsed({ what: w, h1: a, m1: b, h2: c, m2: d, clocks: i !== 1 })), Q.tkEnd(TKW_END[1]), Q.tkEnd(TKW_END[3])]),
  L2T(8, 20, 'หาดนาฬิกาตัวเลข', 'การบอกเวลาด้วยนาฬิกาแบบใช้ตัวเลข', 'นาฬิกาตัวเลข', 'อ่านและเขียนบอกเวลาด้วยนาฬิกาแบบใช้ตัวเลข',
    [...learnStep('<b>นาฬิกาแบบใช้ตัวเลข</b>', 'นาฬิกาแบบใช้ตัวเลข', [
      { fig: tkDigSVG(14, 25, '#FFD45C', 220), name: 'หน้า : คือนาฬิกา · หลัง : คือนาที', text: '14 : 25 อ่านว่า <b>14 นาฬิกา 25 นาที</b>' },
      { fig: tkDigSVG(7, 5, '#9BE3B5', 220), name: 'มีหลักเดียวเติม 0 ข้างหน้า', text: '07 : 05 = 7 นาฬิกา 5 นาที' },
      { fig: `<div class="tk-pair">${tkClk(21, 40, { sky: true })}${tkDigSVG(21, 40, '#9DB7F5', 170)}</div>`, name: 'ใช้ 0–23 นาฬิกา', text: 'นาฬิกาตัวเลขบอกกลางวัน/กลางคืนชัดเจน<br>21 : 40 = กลางคืน' }], 'นาฬิกา : นาที · หลักเดียวเติม 0'),
     pexStep('ตัวอย่างทีละขั้น: เขียน 6 นาฬิกา 45 นาที แบบตัวเลข', 'ตัวอย่างทีละขั้น', [['① นาฬิกา', '6 → เติม 0 เป็น 06', tkDigSVG(6, null, '#FFE27A', 200)], ['② นาที', '45', tkDigSVG(6, 45, '#FFE27A', 200)]], 'เขียนได้ <b>06 : 45</b>'),
     T('ลองหมุนเข็ม ดูนาฬิกาตัวเลข', 'ลองหมุนเข็ม ดูนาฬิกาตัวเลข', el => el.append(simTkDigital()))],
    () => [...pkF(TKW_DIG, 2).map(([H, M]) => Q.tkDigRead({ h: H, m: M })), ...pkF(TKW_TODIG, 2).map(([H, M]) => Q.tkDigPick({ h: H, m: M })), Q.ixMatch({ q: 'จับคู่นาฬิกาเข็มกับนาฬิกาตัวเลข', pairs: pkF([[7, 30], [19, 30], [10, 5], [22, 5]], 3).map(([H, M]) => [tkClockSVG(H, M, { size: 96 }) + tkSkyIcon(H, 26), tkDig(H, M)]) })]),
  L2T(9, 30, 'หาดโจทย์เวลา', 'โจทย์ปัญหาเกี่ยวกับเวลา', 'โจทย์ปัญหาเวลา', 'วิเคราะห์และแสดงวิธีหาคำตอบของโจทย์ปัญหาเกี่ยวกับเวลา',
    [...learnStep('ขั้นตอน<b>แก้โจทย์ปัญหาเวลา</b>', 'ขั้นตอนแก้โจทย์ปัญหาเวลา', [
      { fig: lbig('โจทย์ถามอะไร?'), name: '① โจทย์ถามอะไร', text: 'เวลาสิ้นสุด · ระยะเวลา · มากกว่า/น้อยกว่า · รวม' },
      { fig: lbig('โจทย์บอกอะไร?'), name: '② โจทย์บอกอะไร', text: 'เวลาเริ่ม เวลาจบ หรือระยะเวลาของแต่ละอย่าง' },
      { fig: lbig('รวม → บวก · ต่างกัน → ลบ'), name: '③ เลือกวิธีคิด แล้วตอบพร้อมหน่วย', text: 'ชั่วโมง · นาที · วัน · เดือน · ปี' }], 'ถาม → บอก → วิธีคิด → ตอบพร้อมหน่วย'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'เต้ยดูการ์ตูน 35 นาที เล่นเกม 20 นาที เต้ยดูการ์ตูนนานกว่าเล่นเกมกี่นาที', `<div class="tk-pair">${tkClk(10, 35, { arc: [0, 35] })}${tkClk(10, 20, { arc: [0, 20], ring: '#3FAE5E' })}</div>`], ['① ถาม', 'นานกว่ากี่นาที → หาผลต่าง', null], ['② วิธีคิด', '35 − 20 = 15', lbig('35 − 20 = 15')]], 'ตอบ <b>15 นาที</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.tkStory({ text: 'แม่ตากผ้า 2 ชั่วโมง แล้วรีดผ้าอีก 1 ชั่วโมง แม่ทำงานบ้านรวมกี่ชั่วโมง', sent: '2 + 1', wrong: ['2 − 1', '2 × 1'], a: 3, unit: 'ชั่วโมง' }), 'ถูกต้อง!')))],
    () => pkF(TKW_ST, 5).map(s => Q.tkStory(s)))
];

/* ---------- boss: built from our own practice items (no test in the files) — d6spread · every item tagged with its level (lv) ---------- */
const tkF = html => `<div class="p4-fig">${html}</div>`;
const EXAM_P2C7 = d6spread([
  { q: '1 สัปดาห์มีกี่วัน', opts: ['7 วัน', '5 วัน', '12 วัน', '30 วัน'], a: 0, lv: 961 },
  { q: 'จากปฏิทิน วันที่ 15 กุมภาพันธ์ ตรงกับวันอะไร', fig: tkF(tkCalFig(TKW_CAL2)), opts: ['วันเสาร์', 'วันศุกร์', 'วันอาทิตย์'], a: 0, lv: 961 },
  { q: 'จากปฏิทิน เดือนสิงหาคมมีวันอังคารกี่วัน', fig: tkF(tkCalFig(TKW_CAL1)), opts: ['4 วัน', '5 วัน', '3 วัน'], a: 0, lv: 961 },
  { q: 'เดือนใดมี 30 วัน', opts: ['เมษายน', 'มกราคม', 'มีนาคม', 'สิงหาคม'], a: 0, lv: 962 },
  { q: 'ต.ค. เป็นอักษรย่อของเดือนใด', opts: ['ตุลาคม', 'ธันวาคม', 'กรกฎาคม', 'กุมภาพันธ์'], a: 0, lv: 962 },
  { q: 'เดือนที่ 11 คือเดือนใด', opts: ['พฤศจิกายน', 'ตุลาคม', 'ธันวาคม', 'พฤษภาคม'], a: 0, lv: 962 },
  { q: '17/03/67 หมายถึงวันใด', opts: ['วันที่ 17 มีนาคม พ.ศ. 2567', 'วันที่ 3 กรกฎาคม พ.ศ. 2567', 'วันที่ 17 พฤษภาคม พ.ศ. 2567', 'วันที่ 17 มีนาคม พ.ศ. 2576'], a: 0, lv: 963 },
  { q: 'วันที่ 8 กุมภาพันธ์ พ.ศ. 2563 เขียนแบบย่อได้อย่างไร', opts: ['8 ก.พ. 63', '8 ก.ค. 63', '2 ก.พ. 68', '8 พ.ค. 63'], a: 0, lv: 963 },
  { q: 'นาฬิกาบอกเวลากี่นาฬิกา (เวลากลางวัน)', fig: tkF(tkClk(15, 0, { sky: true })), opts: ['15 นาฬิกา', '3 นาฬิกา', '12 นาฬิกา 15 นาที'], a: 0, lv: 964 },
  { q: '21 นาฬิกา เป็นเวลากลางวันหรือกลางคืน', opts: ['กลางคืน', 'กลางวัน', 'เที่ยงวัน'], a: 0, lv: 964 },
  { q: 'นาฬิกาบอกเวลาเท่าไร', fig: tkF(tkClk(9, 40, { sky: true })), opts: ['9 นาฬิกา 40 นาที', '8 นาฬิกา 40 นาที', '9 นาฬิกา 8 นาที'], a: 0, lv: 965 },
  { q: 'เข็มยาวชี้เลข 7 หมายถึงกี่นาที', opts: ['35 นาที', '7 นาที', '70 นาที', '30 นาที'], a: 0, lv: 965 },
  { q: 'ภูเริ่มอ่านหนังสือเวลา 16 นาฬิกา อ่านนาน 2 ชั่วโมง อ่านจบเวลาใด', opts: ['18 นาฬิกา', '14 นาฬิกา', '16 นาฬิกา 2 นาที', '17 นาฬิกา'], a: 0, lv: 966 },
  { q: 'ไอซ์เรียน 8 นาฬิกา 30 นาที ถึง 11 นาฬิกา 30 นาที ไอซ์เรียนกี่ชั่วโมง', opts: ['3 ชั่วโมง', '2 ชั่วโมง', '4 ชั่วโมง', '30 ชั่วโมง'], a: 0, lv: 966 },
  { q: 'น้องรดน้ำต้นไม้ตั้งแต่ 14 นาฬิกา 30 นาที ถึง 14 นาฬิกา 55 นาที น้องรดน้ำต้นไม้นานเท่าไร', opts: ['25 นาที', '35 นาที', '55 นาที', '1 ชั่วโมง'], a: 0, lv: 967 },
  { q: 'ป่านออกเดินทาง 13 นาฬิกา 30 นาที ใช้เวลา 25 นาที ถึงปลายทางเวลาใด', opts: ['13 นาฬิกา 55 นาที', '14 นาฬิกา 5 นาที', '13 นาฬิกา 25 นาที', '14 นาฬิกา 30 นาที'], a: 0, lv: 967 },
  { q: 'นาฬิกาตัวเลขนี้บอกเวลาเท่าไร', fig: tkF(tkDigSVG(8, 55, '#B8C8FF', 200)), opts: ['8 นาฬิกา 55 นาที', '5 นาฬิกา 8 นาที', '8 นาฬิกา 5 นาที'], a: 0, lv: 968 },
  { q: '20 นาฬิกา 10 นาที เขียนแบบนาฬิกาตัวเลขได้อย่างไร', opts: ['20:10', '10:20', '08:10', '20:01'], a: 0, lv: 968 },
  { q: 'ฟ้าเปิดร้านเวลา 08.00 น. ถึง 16.00 น. ฟ้าเปิดร้านกี่ชั่วโมง', opts: ['8 ชั่วโมง', '24 ชั่วโมง', '16 ชั่วโมง', '6 ชั่วโมง'], a: 0, lv: 969 },
  { q: 'น้องฟ้าอายุ 12 ปี น้าอายุ 30 ปี น้องฟ้าอายุน้อยกว่าน้ากี่ปี', opts: ['18 ปี', '42 ปี', '28 ปี', '12 ปี'], a: 0, lv: 969 }]);
LESSONS_P2C7.push({ id: 979, boss: true, place: 'อ่าวนาฬิกา', title: 'ด่านบอส: บทที่ 7 เวลา', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'คำถามท้ายบท 20 ข้อ (ปฏิทิน เดือน การเขียนวันที่ นาฬิกา ระยะเวลา นาฬิกาตัวเลข โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P2C7, pass: 10, bossName: 'ปีศาจปลาหมึกนาฬิกา', bossPal: 'sky', emblem: 'น.', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกนาฬิกาแล้ว! บอกเวลาได้แม่นยำมาก', loseLine: 'ปีศาจปลาหมึกนาฬิกายังเร็วกว่า กลับไปทวนแล้วสู้ใหม่นะ!' });
