/* =========================================================
   ม.2 บทที่ 5 สมบัติของเลขยกกำลัง (v248) — prefix ep · ตัวช่วยและหน้าลงมือทำ
   ใช้ e3P / e3PF / e3SupN / Q.e3N / Q.e3O / e3TF และหน้าสอนบางหน้าของ ม.1 บทที่ 3 (m1e.js) · rpSort / rpWalk (m1r.js) · tgScene (m3t.js)
   ความยากของเกมเทียบกับแบบฝึกหัดที่ผู้ใช้ส่งมา (หลายฐานในข้อเดียว เลขชี้กำลังลบ ตัวแปร หาค่า a เรียงลำดับ หลักหน่วย) — โจทย์แต่งใหม่ทั้งหมด
   ========================================================= */
const epR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const epPick = a => a[Math.floor(Math.random() * a.length)];
const epS = n => e3SupN(n); /* เลขชี้กำลังติดลบใช้เครื่องหมาย − */
const epP = (b, n) => e3P(b, typeof n === 'number' && n < 0 ? epS(n) : n);
const epX = s => `<span class="ep-ex">${s}</span>`; /* ไม่ใช้ flex (e3-x/e3-big เป็น flex ทำให้วงเล็บกับ <sup> แยกห่างกัน) */
/* monomial: coef, [['a', 2], ['b', 1]] → −6a²b */
const epM = (c, vars) => { const v = vars.filter(([, e]) => e !== 0).map(([x, e]) => e === 1 ? x : `${x}<sup>${String(e).replace('-', '−')}</sup>`).join(''); return (c === 1 && v ? '' : c === -1 && v ? '−' : String(c).replace('-', '−')) + v; };
const epN = (q, expr, a, hint, sig, diff, o = {}) => Q.e3N({ q, expr: expr ? epX(expr) : expr, a, hint, sig: 'ep ' + sig, diff, base: o.base, unit: o.unit });
const epO = (q, expr, opts, right, hint, sig, diff, o = {}) => Q.e3O({ q, expr: expr ? epX(expr) : expr, opts: opts.map(epX), right: epX(right), hint, sig: 'ep ' + sig, diff, base: o.base });
const epTF = (t, ok, why) => e3TF(t, ok, why);

/* (ab)ⁿ: แตะตัวประกอบทีละตัว ระบบย้ายไปรวมกลุ่มฐานเดียวกัน */
function epSimRegroup(a = 2, b = 3, n = 3) {
  const wrap = e3Wrap(), top = h('div', { class: 'e3-big', html: epX(`(${a} × ${b})<sup>${n}</sup> = ${Array(n).fill(`(${a} × ${b})`).join(' × ')}`) }), tiles = h('div', { class: 'rowstack e3-tiles' }), ga = h('div', { class: 'ep-grp' }), gb = h('div', { class: 'ep-grp' }), out = fNote(); let left = 2 * n;
  const lab = () => { ga.innerHTML = `<b>${a}</b> ${ga.dataset.k ? `× ${ga.dataset.k} ตัว` : ''}`; gb.innerHTML = `<b>${b}</b> ${gb.dataset.k ? `× ${gb.dataset.k} ตัว` : ''}`; };
  for (let i = 0; i < 2 * n; i++) { const v = i % 2 ? b : a, t = h('button', { class: 'e3-tile ia ' + (i % 2 ? 'g2' : 'g1') }, String(v)); if (i && i % 2 === 0) tiles.append(h('span', { class: 'e3-op' }, '×'));
    t.onclick = e => { e.stopPropagation(); if (t.classList.contains('cut')) return; t.classList.add('cut'); const g = v === a ? ga : gb; g.dataset.k = (+g.dataset.k || 0) + 1; lab(); sfx.pop(2 * n - left + 2); left--;
      if (!left) { top.innerHTML = epX(`(${a} × ${b})<sup>${n}</sup> = ${e3P(a, n)} × ${e3P(b, n)} = ${a ** n} × ${b ** n} = <b>${(a * b) ** n}</b>`); out.innerHTML = 'สลับที่และจัดกลุ่มใหม่ได้ → <b>(ab)ⁿ = aⁿbⁿ</b> เลขชี้กำลังกระจายไปยัง<b>ทุกตัวประกอบ</b>ในวงเล็บ (ใช้กับการบวกไม่ได้)'; sfx.ok(); teachDone(wrap); } };
    tiles.append(t); }
  lab(); out.innerHTML = 'แตะตัวประกอบทุกตัว — ระบบย้ายไปรวมกับตัวที่เหมือนกัน';
  wrap.append(h('div', { class: 'cap' }, 'กระจายเป็นการคูณซ้ำแล้ว — แตะทุกตัวเพื่อจัดกลุ่มใหม่'), top, tiles, h('div', { class: 'rowstack ep-grps' }, ga, gb), out); return wrap;
}
/* บันไดเลขชี้กำลัง: ลากไปทางซ้าย ลดเลขชี้กำลังทีละ 1 = หารด้วยฐาน → ไปถึง 0 และติดลบ */
function epSimLadder(b = 2) {
  const W = 640, H = 230, X0 = 40, SX = 70, lo = -4, hi = 4, Y = 150;
  const val = e => e >= 0 ? String(b ** e) : fqHTML(1, b ** -e), valT = e => e >= 0 ? String(b ** e) : `1/${b ** -e}`;
  return tgScene({ W, H, st: { e: 3 }, cap: `<b>ลากจุดไปทางซ้าย</b> — ลดเลขชี้กำลังทีละ 1 คือ<b>หารด้วย ${b}</b> ทุกครั้ง`,
    missions: [[`ไปที่ ${b}⁰`, s => s.e === 0], [`ไปที่ ${b}⁻²`, s => s.e === -2], [`ไปที่ ${b}⁻⁴`, s => s.e === -4]],
    svg: s => { let g = `<path d="M${X0} ${Y} h${SX * (hi - lo)}" stroke="#2B2550" stroke-width="2"/>`;
      for (let e = lo; e <= hi; e++) { const x = X0 + (e - lo) * SX, on = e === s.e; g += `<path d="M${x} ${Y - 7} v14" stroke="#2B2550" stroke-width="1.6"/><text x="${x}" y="${Y + 30}" class="rp-sv" text-anchor="middle">${b}<tspan dy="-9" font-size="12">${String(e).replace('-', '−')}</tspan></text><text x="${x}" y="${Y - 26 - (on ? 14 : 0)}" class="${on ? 'rp-fr' : 'rp-sm'}" text-anchor="middle">${valT(e)}</text>`;
        if (e < hi) g += `<text x="${x + SX / 2}" y="${Y - 70}" class="rp-sv" text-anchor="middle" style="fill:${RP_C.o}">÷ ${b}</text>`; }
      return g + `<text x="${X0 + SX * (hi - lo) / 2}" y="${Y - 100}" class="rp-sm" text-anchor="middle">← ไปทางซ้ายทีละช่อง = หารด้วย ${b}</text>` + tgHandle(X0 + (s.e - lo) * SX, Y, RP_C.o); },
    drag: p => ({ e: Math.max(lo, Math.min(hi, Math.round((p[0] - X0) / SX) + lo)) }),
    info: s => s.e > 0 ? `${e3P(b, s.e)} = ${Array(s.e).fill(b).join(' × ')} = <b>${b ** s.e}</b>` : s.e === 0 ? `${e3P(b, 0)} = ${b} ÷ ${b} = <b>1</b> (ฐานต้องไม่เป็น 0)` : `${e3P(b, epS(s.e))} = ${fqHTML(1, e3P(b, -s.e))} = <b>${val(s.e)}</b> — เลขชี้กำลังลบ = <b>ส่วนกลับ</b> ไม่ใช่จำนวนลบ` });
}
/* การเติบโตเป็นเท่า: ลากเวลา จำนวนเพิ่มเป็น 2 เท่าทุกช่วง */
function epSimGrow(s0 = 3, step = 20) {
  const W = 640, H = 260, X0 = 50, SX = 85, Y = 220;
  return tgScene({ W, H, st: { t: 0 }, cap: `แบคทีเรีย (สถานการณ์สมมติ) ${s0} ตัว แบ่งตัวเพิ่มเป็น 2 เท่าทุก ${step} นาที — <b>ลากจุดบนเส้นเวลา</b>`,
    missions: [['ผ่านไป 1 ชั่วโมง', s => s.t === 3], ['ผ่านไป 2 ชั่วโมง', s => s.t === 6]],
    svg: s => { let g = `<path d="M${X0} ${Y} h${SX * 6}" stroke="#2B2550" stroke-width="2"/>`; for (let i = 0; i <= 6; i++) g += `<path d="M${X0 + i * SX} ${Y - 6} v12" stroke="#2B2550" stroke-width="1.5"/><text x="${X0 + i * SX}" y="${Y + 24}" class="rp-sm" text-anchor="middle">${i * step} น.</text>`;
      for (let i = 0; i <= s.t; i++) { const hgt = Math.max(4, Math.log2(s0 * 2 ** i) * 20); g += `<rect x="${X0 + i * SX - 16}" y="${Y - 14 - hgt}" width="32" height="${hgt}" rx="5" fill="${i === s.t ? RP_C.o : RP_C.b}" fill-opacity=".75"/><text x="${X0 + i * SX}" y="${Y - 20 - hgt}" class="rp-sm" text-anchor="middle">${s0 * 2 ** i}</text>`; }
      return g + tgHandle(X0 + s.t * SX, Y, RP_C.o); },
    drag: p => ({ t: Math.max(0, Math.min(6, Math.round((p[0] - X0) / SX))) }),
    info: s => `ผ่านไป ${s.t * step} นาที = แบ่งตัว ${s.t} ครั้ง → ${s0} × ${e3P(2, s.t)} = <b>${s0 * 2 ** s.t}</b> ตัว` });
}
