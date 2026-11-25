/* ม.1 บทที่ 2 ลำน้ำเรขา — หน้าเรียน: การ์ด ตัวอย่าง ลองสร้าง และหน้าลงมือ (ลากสำรวจ) */
/* =========================================================
   หน้าเรียน: ตัวอย่างเคลื่อนไหว / ลองสร้าง / สำรวจ
   ========================================================= */
const mgCards = (list, cls) => { const el = miCards(list); cls.split(' ').forEach(c => el.classList.add(c)); return el; };
const mgDemo = T => el => el.append(mgBoard(T, { demo: true }));
const mgTry = T => el => el.append(mgBoard(T));
/* วัดมุมด้วยครึ่งวงกลม (ตัวอย่าง) */
const mgMeasDemo = (deg = 65, rot = 15) => { const B = [4.6, 1.6], A = mgP(B, rot, 6), C = mgP(B, rot + deg, 5.6);
  return { title: `วัดขนาดของ <b>∠ABC</b> ด้วยครึ่งวงกลม`, given: { pts: { A, B, C }, rays: [['B', 'A'], ['B', 'C']] }, tools: ['prot'], protC: [11, 6.4],
    sol: [{ say: 'วางจุดศูนย์กลางของครึ่งวงกลมให้ตรง<b>จุดยอด B</b>', ops: [{ t: 'prot', c: B, rot: 0 }] },
      { say: 'หมุนให้เส้นฐาน (0°) <b>ทับแขน BA</b>', ops: [{ t: 'prot', c: B, rot }] },
      { say: `อ่านสเกลที่เริ่มจาก 0 ตรง BA ไล่ไปจนถึงแขน BC ได้ <b>${deg}°</b>`, ops: [{ t: 'mark', c: B, rot, deg }] }],
    summary: `∠ABC = <b>${deg}°</b> — เริ่มนับจากสเกลที่เป็น 0 ตรงแขนมุมข้างแรกเสมอ`, keepTools: true }; };
/* ความยาว 3 ด้านประกอบเป็นรูปสามเหลี่ยมได้ไหม (วงเวียนจากปลายทั้งสอง) */
function mgIneqSim(sets) {
  const box = h('div', { class: 'mg-figbox mg-big' }), out = fNote2(), seen = new Set(), wrap = h('div', { class: 'colstack no-side' }, h6wait());
  const show = (k, [x, y, z]) => { const c = Math.max(x, y, z), [a, b] = [x, y, z].filter((v, i, arr) => i !== arr.indexOf(c)), A = [0, 0], B = [c, 0], X = mgXCC(A, a, B, b).sort((p, q) => q[1] - p[1])[0], ok = a + b > c;
    const f = { pts: { A, B }, segs: [['A', 'B']], arcs: [[A, a, -4, 100, '#3D8BD9'], [B, b, 80, 184, '#E5487A']], extra: [[0, Math.max(a, b) * .9]] };
    if (ok) { f.pts.C = X; f.segs.push(['A', 'C'], ['B', 'C']); f.fill = [[['A', 'B', 'C'], '#FFD27A']]; }
    box.innerHTML = mgFig(f, { max: 420 }); seen.add(k);
    out.innerHTML = ok ? `${a} + ${b} = ${a + b} <b>มากกว่า</b> ${c} → ส่วนโค้งตัดกัน <b>ได้รูปสามเหลี่ยม</b>` : `${a} + ${b} = ${a + b} ${a + b === c ? '<b>เท่ากับ</b>' : '<b>น้อยกว่า</b>'} ${c} → ส่วนโค้ง${a + b === c ? 'พบกันบนฐานพอดี (แบนเป็นเส้นตรง)' : 'ไม่ตัดกัน'} <b>ไม่ได้รูปสามเหลี่ยม</b>`;
    say(out.textContent.replace(/→/g, ''), true); sfx.pop(k + 2);
    if (seen.size === sets.length) { out.innerHTML += '<br>สรุป: <b>ผลบวกของความยาวสองด้านใด ๆ ต้องมากกว่าด้านที่สาม</b>'; teachDone(wrap); } };
  const row = h('div', { class: 'rowstack mg-sets' }, ...sets.map((s, k) => h('button', { class: 'btn ia mg-set', onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); show(k, s); } }, s.join(', ') + ' ซม.')));
  box.innerHTML = '<div class="cap">แตะชุดความยาวทีละชุด — วางด้านที่ยาวที่สุดเป็นฐาน แล้วเขียนส่วนโค้งจากปลายทั้งสอง</div>';
  wrap.append(row, box, out); return wrap;
}
/* ลากจุดยอด C — มุมภายในรวมกันได้ 180° เสมอ */
function mgSumSim() {
  const NS = 'http://www.w3.org/2000/svg', W = 560, H = 300, A = [70, 260], B = [470, 260]; let C = [230, 70], drags = 0, last = null;
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'mg-sum ia'); const out = fNote2(), wrap = h('div', { class: 'colstack no-side' }, h6wait());
  const angAt = (P, Q, R) => { const a = Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]), b = Math.atan2(-(R[1] - P[1]), R[0] - P[0]); let d = Math.abs(a - b) * 180 / Math.PI; if (d > 180) d = 360 - d; return d; };
  const arc = (P, Q, R, col, r = 34) => { const a = Math.atan2(Q[1] - P[1], Q[0] - P[0]), b = Math.atan2(R[1] - P[1], R[0] - P[0]); let s = a, e = b; let sw = e - s; while (sw > Math.PI) sw -= 2 * Math.PI; while (sw < -Math.PI) sw += 2 * Math.PI; const x1 = P[0] + r * Math.cos(s), y1 = P[1] + r * Math.sin(s), x2 = P[0] + r * Math.cos(s + sw), y2 = P[1] + r * Math.sin(s + sw); return `<path d="M${P[0]} ${P[1]} L${x1} ${y1} A${r} ${r} 0 0 ${sw > 0 ? 1 : 0} ${x2} ${y2} Z" fill="${col}" fill-opacity=".55" stroke="${col}" stroke-width="2"/>`; };
  const draw = () => { const a = Math.round(angAt(A, B, C)), b = Math.round(angAt(B, A, C)), c = 180 - a - b;
    svg.innerHTML = `<path d="M${A} L${B} L${C} Z" fill="#FFF6D6" stroke="#2B2550" stroke-width="3" stroke-linejoin="round"/>${arc(A, B, C, '#3D8BD9')}${arc(B, C, A, '#E5487A')}${arc(C, A, B, '#4FB97A')}
      <text x="${A[0] - 26}" y="${A[1] + 22}" class="mg-fn">A</text><text x="${B[0] + 10}" y="${B[1] + 22}" class="mg-fn">B</text><text x="${C[0] - 6}" y="${C[1] - 14}" class="mg-fn">C</text>
      <circle cx="${C[0]}" cy="${C[1]}" r="13" fill="#7C5CE0" fill-opacity=".25" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${C[0]}" cy="${C[1]}" r="5" fill="#7C5CE0"/>`;
    out.innerHTML = `∠A + ∠B + ∠C = <b style="color:#2F6FB8">${a}°</b> + <b style="color:#C2386B">${b}°</b> + <b style="color:#2E8A57">${c}°</b> = <b>180°</b>`; };
  mgDrag(svg, p => { C = [Math.max(40, Math.min(W - 40, p[0])), Math.max(24, Math.min(H - 70, p[1]))]; draw(); }, () => { const k = C.map(v => Math.round(v / 40)).join(','); if (k !== last) { last = k; drags++; sfx.pop(drags + 2); } if (drags >= 3) { out.innerHTML += '<br>ไม่ว่ารูปสามเหลี่ยมจะเป็นรูปแบบใด <b>มุมภายในรวมกันได้ 180° เสมอ</b>'; teachDone(wrap); } });
  draw();
  wrap.append(h('div', { class: 'cap' }, 'ลากจุดยอด C (จุดสีม่วง) ไปที่ต่าง ๆ อย่างน้อย 3 ตำแหน่ง แล้วดูผลบวกของมุม'), svg, out); return wrap;
}

/* =========================================================
   หน้าลงมือ (v231)
   ========================================================= */
const mgSvg = (W, H, cls) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', `0 0 ${W} ${H}`); s.setAttribute('class', cls + ' ia'); return s; };
const mgSvgPt = (svg, e) => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m.inverse()); return [r.x, r.y]; };
/* ลากบน svg: นิ้วเดียว (นิ้วที่สองไม่แย่ง) · นิ้วหลุด/ถูกยกเลิก = ปล่อย */
const mgDrag = (svg, on, up) => { let id = null; const end = () => { if (id === null) return; id = null; up && up(); };
  svg.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (id !== null) return; id = e.pointerId; try { svg.setPointerCapture(e.pointerId); } catch (_) { } on(mgSvgPt(svg, e), true); });
  svg.addEventListener('pointermove', e => { if (e.pointerId === id) on(mgSvgPt(svg, e), false); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(k => svg.addEventListener(k, e => { if (e.pointerId === id) end(); })); svg.addEventListener('click', e => e.stopPropagation()); };
/* มุมจากการลาก: ไม่สนใจนิ้วที่อยู่ใกล้จุดยอด (มุมกระโดด) · หมุนต่อเนื่อง ไม่ข้ามจาก 3° ไป 357° */
const mgArmDeg = (O, p, prev, lo, hi, minR = 34) => { if (Math.hypot(p[0] - O[0], p[1] - O[1]) < minR) return prev; const raw = Math.atan2(O[1] - p[1], p[0] - O[0]) * 180 / Math.PI, d = ((raw - prev) % 360 + 540) % 360 - 180; return Math.max(lo, Math.min(hi, prev + d)); };
const MG_AT = [['มุมแหลม', d => d > 0 && d < 90, '#3D8BD9'], ['มุมฉาก', d => d === 90, '#E5487A'], ['มุมป้าน', d => d > 90 && d < 180, '#F0A020'], ['มุมตรง', d => d === 180, '#4FB97A'], ['มุมกลับ', d => d > 180 && d < 360, '#7C5CE0']];
/* ชนิดของมุม: ลากแขนของมุม ดูขนาดและชื่อชนิดเปลี่ยนตาม — หาให้ครบ 5 ชนิด */
function mgAngTypeSim() {
  const W = 560, H = 340, O = [280, 170], R = 130, svg = mgSvg(W, H, 'mg-sum'), out = fNote2(), seen = new Set(), wrap = h('div', { class: 'colstack no-side' }, h6wait()); let th = 50;
  const chips = h('div', { class: 'rowstack mg-sets' }, ...MG_AT.map(([n, , c]) => h('span', { class: 'mg-chip', style: { '--pc': c } }, n)));
  const P = (d, r) => [O[0] + r * Math.cos(d * Math.PI / 180), O[1] - r * Math.sin(d * Math.PI / 180)];
  const draw = () => { const k = MG_AT.findIndex(t => t[1](th)), col = k < 0 ? '#9790B0' : MG_AT[k][2], a = P(th, 58), e = P(th, R);
    const sector = th === 0 ? '' : `<path d="M${O} L${P(0, 58)} A58 58 0 ${th > 180 ? 1 : 0} 0 ${a} Z" fill="${col}" fill-opacity=".28" stroke="${col}" stroke-width="2.4"/>`;
    const sq = th === 90 ? `<path d="M${P(0, 22)} L${[O[0] + 22, O[1] - 22]} L${P(90, 22)}" fill="none" stroke="${col}" stroke-width="2.4"/>` : '';
    svg.innerHTML = `${sector}${sq}<path d="M${O} L${P(0, R + 30)}" stroke="#2B2550" stroke-width="3.4" stroke-linecap="round"/><path d="M${O} L${e}" stroke="#2B2550" stroke-width="3.4" stroke-linecap="round"/><circle cx="${O[0]}" cy="${O[1]}" r="5" fill="#2B2550"/>
      <circle cx="${e[0]}" cy="${e[1]}" r="15" fill="#7C5CE0" fill-opacity=".22" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${e[0]}" cy="${e[1]}" r="6" fill="#7C5CE0"/>
      <text x="${P(th / 2, 86)[0]}" y="${P(th / 2, 86)[1] + 7}" text-anchor="middle" class="mg-big">${th}°</text><text x="${O[0] - 8}" y="${O[1] + 26}" class="mg-fn">B</text><text x="${P(0, R + 34)[0]}" y="${O[1] + 26}" class="mg-fn">A</text><text x="${e[0] + 12}" y="${e[1] - 12}" class="mg-fn">C</text>`;
    chips.querySelectorAll('.mg-chip').forEach((c, i) => c.classList.toggle('now', i === k));
    if (k >= 0) { seen.add(k); chips.children[k].classList.add('on'); }
    out.innerHTML = `∠ABC = <b>${th}°</b> → <b style="color:${col}">${k < 0 ? '-' : MG_AT[k][0]}</b>` + (seen.size === 5 ? '&emsp;ครบทั้ง 5 ชนิดแล้ว ✓' : `&emsp;(พบแล้ว ${seen.size} จาก 5 ชนิด)`); };
  let raw = th; mgDrag(svg, p => { raw = mgArmDeg(O, p, raw, 3, 357); let d = Math.round(raw); [90, 180].forEach(s => { if (Math.abs(raw - s) <= 4) d = s; }); if (d === th) return; th = d; draw(); }, () => { sfx.pop(seen.size + 1); if (seen.size === 5) { sfx.ok(); teachDone(wrap); } });
  draw(); wrap.append(h('div', { class: 'cap' }, 'ลากจุดสีม่วงที่ปลายแขน BC ไปรอบ ๆ — หามุมให้ครบทั้ง 5 ชนิด (มุมฉากและมุมตรงจะดูดเข้าที่พอดี)'), chips, svg, out); return wrap;
}
/* สมบัติของเส้นแบ่งครึ่ง: 'seg' จุดบนเส้นตั้งฉากแบ่งครึ่ง AB ห่างจาก A และ B เท่ากัน · 'ang' จุดบนเส้นแบ่งครึ่งมุมห่างจากแขนทั้งสองเท่ากัน */
function mgEquiSim(mode) {
  const W = 560, H = 320, svg = mgSvg(W, H, 'mg-sum'), out = fNote2(), wrap = h('div', { class: 'colstack no-side' }, h6wait()), K = 40, hits = new Set(); let P = mode === 'seg' ? [200, 80] : [330, 150];
  const A = [120, 260], B = [440, 260], V = [70, 280], ARM = 62, bis = ARM / 2, Pa = (d, r) => [V[0] + r * Math.cos(d * Math.PI / 180), V[1] - r * Math.sin(d * Math.PI / 180)];
  const foot = (d, p) => { const u = [Math.cos(d * Math.PI / 180), -Math.sin(d * Math.PI / 180)], t = (p[0] - V[0]) * u[0] + (p[1] - V[1]) * u[1]; return [V[0] + u[0] * t, V[1] + u[1] * t]; };
  const L = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) / K, f1 = x => (Math.round(x * 10) / 10).toFixed(1);
  const draw = () => { let s = '', on = false;
    if (mode === 'seg') { const d1 = L(P, A), d2 = L(P, B); on = Math.abs(P[0] - 280) < .5;
      s += `<path d="M280 20 V300" stroke="#E5487A" stroke-width="2.4" stroke-dasharray="7 6"/><path d="M${A} L${B}" stroke="#2B2550" stroke-width="3.4"/><path d="M270 260 h10 v-10" fill="none" stroke="#E5487A" stroke-width="2"/>`;
      s += `<path d="M${P} L${A}" stroke="#3D8BD9" stroke-width="2.6"/><path d="M${P} L${B}" stroke="#F0A020" stroke-width="2.6"/>`;
      s += `<text x="${(P[0] + A[0]) / 2 - 16}" y="${(P[1] + A[1]) / 2}" text-anchor="end" class="mg-len a">PA = ${f1(d1)}</text><text x="${(P[0] + B[0]) / 2 + 16}" y="${(P[1] + B[1]) / 2}" class="mg-len b">PB = ${f1(d2)}</text>`;
      s += `<circle cx="${A[0]}" cy="${A[1]}" r="5" fill="#2B2550"/><circle cx="${B[0]}" cy="${B[1]}" r="5" fill="#2B2550"/><text x="${A[0] - 22}" y="${A[1] + 8}" class="mg-fn">A</text><text x="${B[0] + 10}" y="${B[1] + 8}" class="mg-fn">B</text>`;
      out.innerHTML = `PA = <b>${f1(d1)}</b> ซม.&emsp;PB = <b>${f1(d2)}</b> ซม.` + (on ? '&emsp;<b style="color:#2E8A57">P อยู่บนเส้นแบ่งครึ่ง → PA = PB</b>' : ''); }
    else { const F1 = foot(0, P), F2 = foot(ARM, P), d1 = L(P, F1), d2 = L(P, F2), dg = Math.atan2(V[1] - P[1], P[0] - V[0]) * 180 / Math.PI; on = Math.abs(dg - bis) < .5;
      s += `<path d="M${V} L${Pa(bis, 520)}" stroke="#E5487A" stroke-width="2.4" stroke-dasharray="7 6"/><path d="M${V} L${Pa(0, 470)}" stroke="#2B2550" stroke-width="3.4"/><path d="M${V} L${Pa(ARM, 300)}" stroke="#2B2550" stroke-width="3.4"/>`;
      s += `<path d="M${P} L${F1}" stroke="#3D8BD9" stroke-width="2.6"/><path d="M${P} L${F2}" stroke="#F0A020" stroke-width="2.6"/><text x="${P[0] + 14}" y="${(P[1] + F1[1]) / 2 + 6}" class="mg-len a">${f1(d1)}</text><text x="${(P[0] + F2[0]) / 2 - 12}" y="${(P[1] + F2[1]) / 2 - 8}" text-anchor="end" class="mg-len b">${f1(d2)}</text>`;
      s += `<circle cx="${V[0]}" cy="${V[1]}" r="5" fill="#2B2550"/><text x="${V[0] - 24}" y="${V[1] + 6}" class="mg-fn">O</text>`;
      out.innerHTML = `ระยะจาก P ถึงแขน OA = <b>${f1(d1)}</b> ซม.&emsp;ถึงแขน OB = <b>${f1(d2)}</b> ซม.` + (on ? '&emsp;<b style="color:#2E8A57">เท่ากัน!</b>' : ''); }
    s += `<circle cx="${P[0]}" cy="${P[1]}" r="15" fill="#7C5CE0" fill-opacity=".22" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${P[0]}" cy="${P[1]}" r="6" fill="${on ? '#2E8A57' : '#7C5CE0'}"/><text x="${P[0] + 14}" y="${P[1] - 14}" class="mg-fn">P</text>`;
    svg.innerHTML = s; return on; };
  mgDrag(svg, p => { let q = [Math.max(30, Math.min(W - 30, p[0])), Math.max(20, Math.min(H - 30, p[1]))];
    if (mode === 'seg' && Math.abs(q[0] - 280) < 12) q[0] = 280;
    if (mode === 'ang') { const dg = Math.atan2(V[1] - q[1], q[0] - V[0]) * 180 / Math.PI, r = Math.hypot(q[0] - V[0], q[1] - V[1]); if (Math.abs(dg - bis) < 4 && r > 40) q = Pa(bis, r); }
    P = q; draw(); }, () => { if (draw()) { const k = Math.round(P[1] / 30); if (!hits.has(k)) { hits.add(k); sfx.pop(hits.size + 2); } }
    if (hits.size >= 3) { out.innerHTML += mode === 'seg' ? '<br>สรุป: <b>ทุกจุดบนเส้นตั้งฉากแบ่งครึ่ง AB อยู่ห่างจาก A และ B เท่ากัน</b>' : '<br>สรุป: <b>ทุกจุดบนเส้นแบ่งครึ่งมุมอยู่ห่างจากแขนทั้งสองของมุมเท่ากัน</b>'; sfx.ok(); teachDone(wrap); }
    else if (draw()) out.innerHTML += `&emsp;(ลองอีก ${3 - hits.size} ตำแหน่งบนเส้นประ)`; });
  draw(); wrap.append(h('div', { class: 'cap' }, mode === 'seg' ? 'ลากจุด P ไปวางบนเส้นประสีชมพู (เส้นตั้งฉากแบ่งครึ่ง AB) อย่างน้อย 3 ตำแหน่ง แล้วเทียบ PA กับ PB' : 'ลากจุด P ไปวางบนเส้นประสีชมพู (เส้นแบ่งครึ่งมุม) อย่างน้อย 3 ตำแหน่ง แล้วเทียบระยะถึงแขนทั้งสอง'), svg, out); return wrap;
}
/* ระยะห่างระหว่างจุดกับเส้นตรง: เลื่อนจุด Q บนเส้นตรง หาตำแหน่งที่ PQ สั้นที่สุด */
function mgDistSim() {
  const W = 560, H = 300, svg = mgSvg(W, H, 'mg-sum'), out = fNote2(), wrap = h('div', { class: 'colstack no-side' }, h6wait()), P = [300, 70], y = 250, K = 40; let qx = 110, moves = 0, done = false;
  const draw = () => { const d = Math.hypot(qx - P[0], y - P[1]) / K, on = qx === P[0];
    svg.innerHTML = `<path d="M20 ${y} H${W - 20}" stroke="#2B2550" stroke-width="3.4"/><text x="${W - 34}" y="${y + 28}" class="mg-fn">B</text><text x="22" y="${y + 28}" class="mg-fn">A</text>
      <path d="M${P} L${qx} ${y}" stroke="${on ? '#2E8A57' : '#E5487A'}" stroke-width="3"/>${on ? `<path d="M${qx} ${y - 16} h16 v16" fill="none" stroke="#2E8A57" stroke-width="2.4"/>` : ''}
      <text x="${(P[0] + qx) / 2 + 12}" y="${(P[1] + y) / 2}" class="mg-len">PQ = ${d.toFixed(1)} ซม.</text><circle cx="${P[0]}" cy="${P[1]}" r="6" fill="#2B2550"/><text x="${P[0] + 10}" y="${P[1] - 8}" class="mg-fn">P</text>
      <circle cx="${qx}" cy="${y}" r="15" fill="#7C5CE0" fill-opacity=".22" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${qx}" cy="${y}" r="6" fill="#7C5CE0"/><text x="${qx - 6}" y="${y + 34}" class="mg-fn">Q</text>`;
    out.innerHTML = on ? `PQ = <b>${d.toFixed(1)} ซม.</b> สั้นที่สุด — <b>PQ ⊥ AB</b> ✓<br>ระยะห่างระหว่างจุด P กับเส้นตรง AB วัดตาม<b>แนวตั้งฉาก</b>` : `PQ = <b>${d.toFixed(1)} ซม.</b> — เลื่อน Q หาตำแหน่งที่ PQ <b>สั้นที่สุด</b>`; return on; };
  mgDrag(svg, p => { let x = Math.max(30, Math.min(W - 30, Math.round(p[0]))); if (Math.abs(x - P[0]) < 10) x = P[0]; qx = x; draw(); }, () => { moves++; sfx.pop(moves % 6 + 1); if (draw() && moves >= 2 && !done) { done = true; sfx.ok(); teachDone(wrap); } });
  draw(); wrap.append(h('div', { class: 'cap' }, 'ลากจุด Q (สีม่วง) ไปตามเส้นตรง AB แล้วดูความยาวของ PQ'), svg, out); return wrap;
}
/* เส้นขนานกับเส้นตัด: ลากเส้นตัดเปลี่ยนมุม แตะปุ่มดูคู่มุม */
const MG_PAIR = { corr: [['1', '5'], ['2', '6'], ['3', '7'], ['4', '8']], alt: [['3', '5'], ['4', '6']], co: [['3', '6'], ['4', '5']], ext: [['1', '7'], ['2', '8']] };
const MG_PNAME = { corr: 'มุมสมนัย', alt: 'มุมแย้ง', co: 'มุมภายในบนข้างเดียวกันของเส้นตัด', vert: 'มุมตรงข้าม' };
const mgSecDeg = (k, t) => (+k % 2 ? t : 180 - t);
function mgTransSim() {
  const W = 600, H = 330, y1 = 110, y2 = 240, X1 = 330, svg = mgSvg(W, H, 'mg-sum mg-trans'), out = fNote2(), wrap = h('div', { class: 'colstack no-side' }, h6wait()), seen = new Set(); let t = 60, show = null;
  const col = { corr: '#3D8BD9', alt: '#E5487A', co: '#2FB5A3' };
  const P = (c, d, r) => [c[0] + r * Math.cos(d * Math.PI / 180), c[1] - r * Math.sin(d * Math.PI / 180)];
  const draw = () => { const Ia = [X1, y1], Ib = [X1 - (y2 - y1) / Math.tan(t * Math.PI / 180), y2], sec = [[0, t], [t, 180], [180, 180 + t], [180 + t, 360]];
    const hl = show ? MG_PAIR[show][0] : []; let s = `<path d="M20 ${y1} H${W - 20}" stroke="#2B2550" stroke-width="3.2"/><path d="M20 ${y2} H${W - 20}" stroke="#2B2550" stroke-width="3.2"/><text x="${W - 26}" y="${y1 - 10}" class="mg-fn">ℓ</text><text x="${W - 26}" y="${y2 - 10}" class="mg-fn">m</text>`;
    const e1 = P(Ia, t, 90), e2 = P(Ib, t + 180, 90); s += `<path d="M${e1} L${e2}" stroke="#7C5CE0" stroke-width="3.2"/>`;
    [Ia, Ib].forEach((c, j) => sec.forEach(([a0, a1], i) => { const k = String(j * 4 + i + 1), on = hl.includes(k), r = 30, m = (a0 + a1) / 2, A = P(c, a0, r), B = P(c, a1, r), T = P(c, m, 46);
      s += `<path d="M${c} L${A} A${r} ${r} 0 0 0 ${B} Z" fill="${on ? col[show] : '#E9E5F5'}" fill-opacity="${on ? .75 : .7}" stroke="${on ? col[show] : '#C9C2DD'}" stroke-width="1.6"/><text x="${T[0]}" y="${T[1] + 6}" text-anchor="middle" class="mg-sn${on ? ' on' : ''}">${k}</text>`; }));
    s += `<circle cx="${e1[0]}" cy="${e1[1]}" r="15" fill="#7C5CE0" fill-opacity=".22" stroke="#7C5CE0" stroke-width="2.5"/><circle cx="${e1[0]}" cy="${e1[1]}" r="6" fill="#7C5CE0"/><text x="${e1[0] + 14}" y="${e1[1] + 4}" class="mg-fn">t</text>`;
    svg.innerHTML = s;
    if (show) { const [a, b] = MG_PAIR[show][0], da = mgSecDeg(a, t), db = mgSecDeg(b, t); out.innerHTML = `${MG_PNAME[show]}: ∠${a} = <b>${da}°</b> และ ∠${b} = <b>${db}°</b> → ${show === 'co' ? `รวมกัน <b>${da + db}°</b>` : '<b>เท่ากัน</b>'}`; } };
  let tr = t; mgDrag(svg, p => { if (p[1] > y1 - 10) return; tr = mgArmDeg([X1, y1], p, tr, 35, 145, 30); const d = Math.round(tr); if (d === t) return; t = d; draw(); }, () => sfx.tap());
  const row = h('div', { class: 'rowstack mg-sets' }, ...['corr', 'alt', 'co'].map(k => h('button', { class: 'btn ia mg-set', style: { '--pc': col[k] }, onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); show = k; seen.add(k); draw(); sfx.pop(seen.size + 2); if (seen.size === 3) { out.innerHTML += '<br>ลากปลายเส้นตัด t ดู — <b>ℓ ∥ m</b> มุมสมนัยและมุมแย้งเท่ากันเสมอ มุมภายในบนข้างเดียวกันรวมกัน 180° เสมอ'; teachDone(wrap); } } }, MG_PNAME[k])));
  draw(); wrap.append(h('div', { class: 'cap' }, 'ℓ ∥ m และ t เป็นเส้นตัด — แตะปุ่มดูคู่มุม แล้วลากจุดสีม่วงเพื่อเปลี่ยนมุมของเส้นตัด'), row, svg, out); return wrap;
}
