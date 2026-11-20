/* =========================================================
   ป.5 บทที่ 4 บัญญัติไตรยางศ์ (ภาคเรียนที่ 2) — interactive rate sims,
   question types (t…), levels 591–596 + boss 599
   ========================================================= */
/* b per a, written as a fraction when both are whole numbers, otherwise as a division */
const rFrac = (b, a) => +a === 1 ? fmtDec(String(b)) : Number.isInteger(+b) && Number.isInteger(+a) ? fqHTML(fmt(+b), fmt(+a)) : `(${fmtDec(b)} ÷ ${fmtDec(a)})`;
const r3Txt = r => { let d = r.d; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1 ? dTxt(r) : fmtDec(dFix(r, 2)) + '…'; };
const rNum = v => `<b class="dnum">${fmtDec(String(v))}</b>`;
const r3Val = (a, b, c) => rDiv(rMul(DQ(String(c)), DQ(String(b))), DQ(String(a))); // c × b / a (exact)

/* ---------- 3-row table: given → one unit → asked ---------- */
function r3Rows(o) { // o: { k1, u1, k2, u2, a, b, c }
  return [
    [`${o.k1} ${rNum(o.a)} ${o.u1}`, `${o.k2} ${rNum(o.b)} ${o.u2}`],
    [`${o.k1} ${rNum(1)} ${o.u1}`, `${o.k2} ${rFrac(o.b, o.a)} ${o.u2}`],
    [`${o.k1} ${rNum(o.c)} ${o.u1}`, `${o.k2} ${rNum(o.c)} × ${rFrac(o.b, o.a)} = <b class="dnum pop">${r3Txt(r3Val(o.a, o.b, o.c))}</b> ${o.u2}`]];
}
function r3Table(o, shown = 3, arrows = true) {
  const rows = r3Rows(o), t = h('div', { class: 'r3' });
  rows.forEach((r, k) => { const row = h('div', { class: 'r3-row' + (k < shown ? ' in' : ' hide') }, h('span', { class: 'r3-l', html: r[0] }), h('span', { class: 'r3-r', html: r[1] }));
    if (arrows && k) row.prepend(h('span', { class: 'r3-ar ' + (k === 1 ? 'dn' : 'up') }, k === 1 ? `÷ ${fmtDec(String(o.a))}` : `× ${fmtDec(String(o.c))}`)); t.append(row); });
  return t;
}
/* step-by-step explanation of the rule of three (button reveals each row) */
function simRule3(o, notes = []) {
  const tab = r3Table(o, 1), out = fNote(), rows = [...tab.children]; let k = 1;
  out.innerHTML = notes[0] ? FX(notes[0]) : `ขั้นที่ 1: เขียนสิ่งที่โจทย์<b>กำหนด</b> — ให้สิ่งที่โจทย์ถาม (${o.k2}) อยู่ทางขวามือ`;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); rows[k].classList.remove('hide'); rows[k].classList.add('in'); sfx.pop(k * 3);
    out.innerHTML = notes[k] ? FX(notes[k]) : (k === 1 ? `ขั้นที่ 2: หาค่าของ <b>1 ${o.u1}</b> — จำนวนน้อยลง (${fmtDec(String(o.a))} → 1) จึง<b>หาร</b>ด้วย ${fmtDec(String(o.a))} (เขียนเป็นเศษส่วนไว้ก่อน)` : `ขั้นที่ 3: หาค่าของ <b>${fmtDec(String(o.c))} ${o.u1}</b> — จำนวนมากขึ้น จึง<b>คูณ</b>ด้วย ${fmtDec(String(o.c))}`);
    k++; if (k > 2) { btn.remove(); sfx.ok(); say('ของน้อยลงหาร ของมากขึ้นคูณ', true); } else btn.lastChild.textContent = 'ขั้นที่ 3'; } }, icon('right'), h('span', null, 'ขั้นที่ 2'));
  return h('div', { class: 'colstack' }, o.story ? h('div', { class: 'storybox', html: o.story }) : null, tab, btn, out);
}
/* the student chooses the operation at each step */
function simRule3Try(o) {
  const tab = r3Table(o, 1), out = fNote(), rows = [...tab.children], box = h('div', { class: 'rowstack' }); let k = 1;
  const ask = () => { box.innerHTML = ''; const n = k === 1 ? o.a : o.c, right = k === 1 ? '÷' : '×';
    out.innerHTML = k === 1 ? `จาก ${fmtDec(String(o.a))} ${o.u1} ไปเป็น <b>1 ${o.u1}</b> (น้อยลง) ต้องทำอย่างไร?` : `จาก 1 ${o.u1} ไปเป็น <b>${fmtDec(String(o.c))} ${o.u1}</b> (มากขึ้น) ต้องทำอย่างไร?`;
    ['×', '÷'].forEach(op => box.append(h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const b = e.currentTarget;
      if (op !== right) { sfx.no(); b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('shake'); out.innerHTML = k === 1 ? 'ลองคิดใหม่: ของ<b>น้อยลง</b> ต้อง<b>หาร</b>' : 'ลองคิดใหม่: ของ<b>มากขึ้น</b> ต้อง<b>คูณ</b>'; return; }
      rows[k].classList.remove('hide'); rows[k].classList.add('in'); sfx.pop(k * 3); k++; if (k > 2) { box.remove(); out.innerHTML = `ถูกต้อง! ${o.k2} ${fmtDec(String(o.c))} ${o.u1} = <b>${dTxt(r3Val(o.a, o.b, o.c))} ${o.u2}</b>`; sfx.ok(); } else ask(); } }, `${op} ${fmtDec(String(n))}`))); };
  ask(); return h('div', { class: 'colstack' }, o.story ? h('div', { class: 'storybox', html: o.story }) : null, tab, box, out);
}
/* two quantities that change together: picture + double number line */
function simRate({ e = 'book', k1 = 'สมุด', u1 = 'เล่ม', u2 = 'บาท', per = 12, n0 = 3, max = 10 }) {
  let n = n0; const pic = h('div'), dl = h('div', { class: 'dnl' }), big = h('div', { class: 'fbig r3big' }), out = fNote();
  const draw = () => { pic.innerHTML = ''; pic.append(objRow(e, n, { size: 'clamp(26px,3.4vw,40px)', max: '460px' }));
    const W = 600, x = v => 30 + v / max * (W - 60); let s = `<svg viewBox="0 0 ${W} 120" class="dnl-svg" aria-hidden="true"><path d="M30 34 H${W - 30}" stroke="#2B2550" stroke-width="2.4"/><path d="M30 92 H${W - 30}" stroke="#2B2550" stroke-width="2.4"/>`;
    for (let v = 0; v <= max; v++) { const on = v <= n; s += `<path d="M${x(v)} 26 v16 M${x(v)} 84 v16" stroke="#2B2550" stroke-width="2"/><text x="${x(v)}" y="18" text-anchor="middle" class="dnl-t${v === n ? ' on' : ''}">${v}</text><text x="${x(v)}" y="116" text-anchor="middle" class="dnl-t b${v === n ? ' on' : ''}">${fmt(v * per)}</text>`; if (on && v) s += ''; }
    s += `<path d="M${x(n)} 42 V84" stroke="#E5505E" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="${x(n)}" cy="34" r="8" fill="#6FB2F5"/><circle cx="${x(n)}" cy="92" r="8" fill="#FFC24C"/><text x="12" y="38" class="dnl-n">${u1}</text><text x="12" y="96" class="dnl-n">${u2}</text></svg>`;
    dl.innerHTML = s; big.innerHTML = `${k1} ${rNum(n)} ${u1} <b class="fop">→</b> ${rNum(n * per)} ${u2}`;
    out.innerHTML = `${k1} 1 ${u1} = ${per} ${u2} · ${n} ${u1} จึงเป็น ${n} × ${per} = <b>${fmt(n * per)}</b> ${u2} — <b>เพิ่มขึ้นเป็นกี่เท่า อีกปริมาณก็เพิ่มขึ้นเท่านั้น</b>`; };
  const st = stepper(`จำนวน${k1}`, () => n, x => n = x, () => 1, () => max, draw);
  draw(); return h('div', { class: 'colstack' }, big, pic, dl, st, out);
}
/* v125 (ผู้ใช้ขอ: อธิบายด่าน 1 ใหม่ให้เห็นภาพ) — แถบรูป (bar model) + ตาราง 2 ปริมาณ
   mode 'mul': รู้ของ 1 สิ่ง → หาหลายสิ่ง: ต่อแถบทีละช่อง ช่องละเท่ากัน แล้วรวม = คูณ
   mode 'div': รู้รวมของหลายสิ่ง → หาของ 1 สิ่ง: ตัดแถบเป็นช่องเท่า ๆ กัน = หาร
   ทั้งสองแบบมีตาราง 2 แถวด้านล่าง: ปริมาณที่ 1 คูณ/หารด้วยเท่าไร ปริมาณที่ 2 ก็คูณ/หารด้วยเท่านั้น */
function simBarRate(o) { // o: { mode, story, e, k1, u1, k2, u2, n, per }
  const n = o.n, per = o.per, tot = n * per, mul = o.mode === 'mul';
  const top = h('div', { class: 'br-top' }), bar = h('div', { class: 'br-bar' + (mul ? '' : ' whole') }), brace = h('div', { class: 'br-brace' }), eq = h('div', { class: 'fbig br-eq one-line' }), tab = h('div', { class: 'br-tab' }), out = fNote();
  const cells = range(1, n).map(i => { const t = h('div', { class: 'br-tc' }, h('span', { class: 'br-ic' }, art(o.e)), h('small', null, `${o.k1}ที่ ${i}`)); top.append(t);
    const sg = h('div', { class: 'br-seg' }, h('b', { class: 'br-v' }, mul ? fmt(per) : '')); bar.append(sg); return [t, sg]; });
  const tabRow = (a, b, cls = '') => h('div', { class: 'br-tr ' + cls }, h('span', { html: `${rNum(a)} ${o.u1}` }), h('span', { class: 'br-tar' }, '→'), h('span', { html: `${typeof b === 'number' ? rNum(fmt(b)) : b} ${o.u2}` }));
  const head = h('div', { class: 'br-tr br-th' }, h('span', null, o.k1), h('span'), h('span', null, o.k2));
  const show = (k, on = true) => { const [t, sg] = cells[k]; t.classList.toggle('on', on); sg.classList.toggle('on', on); };
  const steps = mul ? [
    () => { show(0); brace.innerHTML = ''; tab.replaceChildren(head, tabRow(1, per)); out.innerHTML = `ขั้นที่ 1: รู้ของ <b>1 ${o.u1}</b> = ${fmt(per)} ${o.u2} → แถบ 1 ช่อง`; },
    () => { for (let k = 1; k < n; k++) setTimeout(() => { show(k); sfx.pop(k); }, k * 260); out.innerHTML = `ขั้นที่ 2: มี <b>${n} ${o.u1}</b> → ต่อแถบให้ครบ ${n} ช่อง <b>ทุกช่องเท่ากัน</b> ช่องละ ${fmt(per)}`; },
    () => { brace.innerHTML = `<i></i><b>รวม ${n} ช่อง = ?</b>`; eq.innerHTML = `${exprHTML(`${n} × ${per}`)} <b class="fop">=</b> <span class="fsign">?</span>`; out.innerHTML = `ขั้นที่ 3: ${fmt(per)} ซ้ำกัน ${n} ครั้ง คือ <b>คูณ</b>`; },
    () => { brace.innerHTML = `<i></i><b>รวม ${fmt(tot)} ${o.u2}</b>`; eq.innerHTML = `${exprHTML(`${n} × ${per}`)} <b class="fop">=</b> <b class="dnum pop">${fmt(tot)}</b>`;
      tab.append(tabRow(n, tot, 'pop')); tab.classList.add('arw'); tab.dataset.f = `× ${n}`; out.innerHTML = `${o.k1}เพิ่มจาก 1 เป็น ${n} (<b>× ${n}</b>) ${o.k2}ก็เพิ่ม <b>× ${n}</b> เหมือนกัน → <b>รู้ของ 1 สิ่ง หาหลายสิ่ง ใช้คูณ</b>`; }]
  : [
    () => { cells.forEach((_, k) => show(k)); bar.classList.add('whole'); brace.innerHTML = `<i></i><b>รวม ${fmt(tot)} ${o.u2}</b>`; tab.replaceChildren(head, tabRow(n, tot)); out.innerHTML = `ขั้นที่ 1: รู้ของ<b>รวม ${n} ${o.u1}</b> = ${fmt(tot)} ${o.u2} → แถบยาว 1 แถบ`; },
    () => { bar.classList.remove('whole'); bar.classList.add('cut'); out.innerHTML = `ขั้นที่ 2: ราคาเท่ากันทุก${o.u1} → <b>ตัดแถบเป็น ${n} ช่องเท่า ๆ กัน</b>`; },
    () => { cells[0][1].classList.add('hl'); cells[0][1].querySelector('.br-v').textContent = '?'; eq.innerHTML = `${exprHTML(`${tot} ÷ ${n}`)} <b class="fop">=</b> <span class="fsign">?</span>`; out.innerHTML = `ขั้นที่ 3: 1 ช่อง = ${o.k1} 1 ${o.u1} → แบ่ง ${fmt(tot)} เป็น ${n} ส่วนเท่ากัน คือ <b>หาร</b>`; },
    () => { cells.forEach(([, sg], k) => setTimeout(() => { sg.querySelector('.br-v').textContent = fmt(per); sfx.pop(k); }, k * 200)); eq.innerHTML = `${exprHTML(`${tot} ÷ ${n}`)} <b class="fop">=</b> <b class="dnum pop">${fmt(per)}</b>`;
      tab.append(tabRow(1, per, 'pop')); tab.classList.add('arw'); tab.dataset.f = `÷ ${n}`; out.innerHTML = `ตรวจ: ${n} × ${fmt(per)} = ${fmt(tot)} ✓ · ${o.k1}ลดจาก ${n} เป็น 1 (<b>÷ ${n}</b>) ${o.k2}ก็ลด <b>÷ ${n}</b> → <b>รู้หลายสิ่ง หาของ 1 สิ่ง ใช้หาร</b>`; }];
  let k = 0; steps[k++]();
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); steps[k++](); sfx.pop(k * 2); if (k >= steps.length) { btn.remove(); sfx.ok(); say(mul ? 'รู้ของหนึ่งสิ่ง หาหลายสิ่ง ใช้คูณ' : 'รู้หลายสิ่ง หาของหนึ่งสิ่ง ใช้หาร', true); } } }, icon('right'), h('span', null, 'ขั้นต่อไป'));
  return h('div', { class: 'colstack br-wrap' }, o.story ? h('div', { class: 'storybox', html: o.story }) : null, h('div', { class: 'br-pic' }, top, bar, brace), eq, tab, btn, out);
}
/* สรุป: คูณหรือหาร — ภาพเล็ก 2 แบบเทียบกัน */
function simMulDivSum() {
  const card = (mul, title, sub) => h('div', { class: 'br-sum ' + (mul ? 'm' : 'd') }, h('b', { class: 'br-st' }, title),
    h('div', { class: 'br-mini', html: mul ? '<i class="on"></i><span>→</span><i class="on"></i><i class="on"></i><i class="on"></i>' : '<i class="w"></i><span>→</span><i class="on"></i><i class="on"></i><i class="on"></i>' }), h('small', { html: sub }));
  return h('div', { class: 'br-sums' }, card(true, 'รู้ของ 1 สิ่ง → หาหลายสิ่ง', 'ต่อแถบให้ยาวขึ้น = <b>คูณ</b><br>ปากกาด้ามละ 8 บาท 3 ด้าม → 3 × 8 = 24'), card(false, 'รู้ของหลายสิ่ง → หาของ 1 สิ่ง', 'ตัดแถบเป็นช่องเท่ากัน = <b>หาร</b><br>ปากกา 3 ด้าม 24 บาท → 24 ÷ 3 = 8'));
}
/* same direction or opposite direction? */
function simMoreLess() {
  let w = 2, inv = false; const pic = h('div'), bar = h('div', { class: 'ml-bar' }), out = fNote(), big = h('div', { class: 'fbig r3big' });
  const draw = () => { pic.innerHTML = ''; pic.append(objRow('girl', w, { size: 'clamp(28px,3.6vw,42px)' }));
    const v = inv ? 12 / w : 4 * w, vmax = inv ? 12 : 40; bar.innerHTML = `<i style="width:${v / vmax * 100}%"></i><b>${inv ? `${fmtDec(decStr(Rr(12, w)))} วัน` : `${v} แผ่น`}</b>`;
    big.innerHTML = inv ? `คนงาน ${rNum(w)} คน <b class="fop">→</b> ทำเสร็จใน ${rNum(decStr(Rr(12, w)))} วัน` : `คนงาน ${rNum(w)} คน <b class="fop">→</b> ปูกระเบื้องได้ ${rNum(v)} แผ่น/วัน`;
    out.innerHTML = inv ? 'คน<b>เพิ่ม</b> → วัน<b>ลด</b> (เปลี่ยนไป<b>ทางตรงข้าม</b>) · งานเท่าเดิม แบ่งกันทำหลายคนจึงเสร็จเร็วขึ้น' : 'คน<b>เพิ่ม</b> → งาน<b>เพิ่ม</b> (เปลี่ยนไป<b>ทางเดียวกัน</b> เป็นจำนวนเท่า) → ใช้บัญญัติไตรยางศ์แบบ “น้อยลงหาร มากขึ้นคูณ” ได้'; };
  const st = stepper('จำนวนคนงาน', () => w, x => w = x, () => 1, () => 6, draw);
  const tg = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); inv = !inv; tg.textContent = inv ? 'ดูแบบ: คนงานกับงานที่ได้' : 'ดูแบบ: คนงานกับจำนวนวัน'; sfx.page(); draw(); } }, 'ดูแบบ: คนงานกับจำนวนวัน');
  draw(); return h('div', { class: 'colstack' }, big, pic, bar, h('div', { class: 'rowstack' }, st, tg), out);
}
/* which shop is cheaper? find the price of one */
function simCompare({ item, unit, A, B, nA = 'ร้านขายดี', nB = 'ร้านสะดวกซื้อ', e }) {
  const card = (nm, [n, p], col) => h('div', { class: 'cmp-card ' + col }, h('b', null, nm), e ? objRow(e, Math.min(n, 6), { size: '26px' }) : null, h('div', { html: `${item} ${rNum(n)} ${unit} ราคา ${rNum(p)} บาท` }), h('div', { class: 'cmp-u' }));
  const cA = card(nA, A, 'a'), cB = card(nB, B, 'b'), out = fNote(); let st = 0;
  const uA = rDiv(DQ(String(A[1])), DQ(String(A[0]))), uB = rDiv(DQ(String(B[1])), DQ(String(B[0])));
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; sfx.pop(st * 3);
    if (st === 1) { cA.lastChild.innerHTML = `1 ${unit} = ${rFrac(A[1], A[0])} = <b>${dTxt(uA)}</b> บาท`; cB.lastChild.innerHTML = `1 ${unit} = ${rFrac(B[1], B[0])} = <b>${dTxt(uB)}</b> บาท`; out.innerHTML = 'หาราคาของ <b>1 หน่วย</b> ทั้งสองร้าน แล้วเทียบกัน'; btn.lastChild.textContent = 'เทียบราคา'; return; }
    const c = rCmp(uA, uB); (c < 0 ? cA : cB).classList.add('win'); out.innerHTML = c ? `<b>${c < 0 ? nA : nB}</b> ถูกกว่า ${unit}ละ ${dTxt(rSub(c < 0 ? uB : uA, c < 0 ? uA : uB))} บาท` : 'ราคาเท่ากัน'; btn.remove(); sfx.ok(); } }, icon('sparkle'), h('span', null, `หาราคาต่อ 1 ${unit}`));
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, cA, cB), btn, out);
}

/* =========================================================
   QUESTION TYPES (prefix t…)
   ========================================================= */
Object.assign(Q, {
  /* word problem: ① choose the rule-of-three sentence ② answer */
  tSolve({ text, a, b, c, unit, round, plain }) { // plain (ด่าน 1): แสดงเป็น ÷ และ × ตรงกับภาพแถบในบทเรียน ไม่ใช้เศษส่วน
    const exact = r3Val(a, b, c), ans = round === 'down' ? Rr(Math.floor(rVal(exact))) : round === 'up' ? Rr(Math.ceil(rVal(exact))) : exact, D = x => fmtDec(String(x));
    const S = plain ? (x, y, z) => +x === 1 ? `${D(y)} ÷ ${D(z)}` : +z === 1 ? `${D(x)} × ${D(y)}` : `${D(x)} × ${D(y)} ÷ ${D(z)}` : (x, y, z) => +x === 1 ? rFrac(y, z) : `${fmtDec(String(x))} × ${rFrac(y, z)}`, right = S(c, b, a), opts = plain ? shuffle(+a === 1 ? [right, `${D(b)} ÷ ${D(c)}`, `${D(b)} + ${D(c)}`] : [right, `${D(b)} × ${D(a)}`, `${D(b)} − ${D(a)}`]) : shuffle([...new Set([right, S(c, a, b), S(a, b, c), S(b, c, a)])].slice(0, 3)); if (!opts.includes(right)) opts[0] = right;
    return { prompt: text, say: text.replace(/<[^>]+>/g, ''),
      mount(bd, ctx) { const step2 = h('div', { class: 'colstack', style: { display: 'none' } });
        const ch = choices({ check: (ok, hint) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; sfx.pop(5); ctx.say(round ? 'ใช่แล้ว! คำนวณ แล้วอย่าลืมดูว่าต้องปัดอย่างไร' : 'ใช่แล้ว! คำนวณหาคำตอบเลย'); } else ctx.check(false, hint); } },
          opts.map(o => ({ value: o, label: `<span class="fexpr">${o}</span>` })), right, { hint: `หาค่าของ 1 หน่วยก่อน (${fmtDec(String(b))} ÷ ${fmtDec(String(a))}) แล้วคูณด้วยจำนวนที่ถาม (${fmtDec(String(c))})` });
        ch.querySelectorAll('.opt').forEach(o => o.classList.add('fopt'));
        const sx = +c === 1 ? `${b} ÷ ${a}` : +a === 1 ? `${c} × ${b}` : `${c} × ${b} ÷ ${a}`; /* v165: ② คิดทีละขั้น (คูณก่อนแล้วหาร) เมื่อไม่ต้องปัด */
        if (!round && typeof p4stepBox === 'function') step2.append(p4stepBox(ctx, sx, { dec: true })); else step2.append(h('div', { class: 'fbig', html: `${right} <b class="fop">=</b> <span class="fsign">?</span>` }), decAnswer(ctx, ans, { hint: round === 'down' ? `ได้ ${dTxt(exact)} แต่ซื้อ/ทำได้แค่จำนวนเต็ม จึงปัดทิ้ง` : round === 'up' ? `ได้ ${dTxt(exact)} ต้องให้พอ จึงปัดขึ้น` : 'คูณก่อนแล้วค่อยหาร จะได้ตัวเลขลงตัวง่าย', unit }));
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'cap' }, plain ? '① รู้ของ 1 สิ่ง หรือรู้ของรวม? เลือกวิธีคิด (คูณ หรือ หาร)' : '① เลือกวิธีคิดแบบบัญญัติไตรยางศ์'), ch, step2)); ctx.onRight = () => { const q = step2.querySelector('.fsign'); if (q) q.outerHTML = `<b class="dnum">${dTxt(exact)}</b>`; }; } };
  },
  /* fill the 3-row table: value of one, then the answer */
  tTable({ k1, u1, k2, u2, a, b, c }) {
    const o = { k1, u1, k2, u2, a, b, c }, ans = r3Val(a, b, c);
    return { prompt: `${k1} ${fmtDec(String(a))} ${u1} ${k2} ${fmtDec(String(b))} ${u2} ถ้า${k1} ${fmtDec(String(c))} ${u1} จะเป็นกี่${u2}`, say: `${k1} ${a} ${u1} ${k2} ${b} ${u2} ถ้า ${c} ${u1} จะเป็นกี่${u2}`,
      mount(bd, ctx) { const t = r3Table(o, 2); t.lastChild.classList.remove('hide'); t.lastChild.querySelector('.r3-r').innerHTML = `${k2} <span class="fsign">?</span> ${u2}`;
        bd.append(h('div', { class: 'rowstack' }, t, decAnswer(ctx, ans, { hint: `${fmtDec(String(c))} × ${fmtDec(String(b))} ÷ ${fmtDec(String(a))}`, unit: u2 })));
        ctx.onRight = () => { const q = t.querySelector('.fsign'); if (q) q.outerHTML = `<b class="dnum">${dTxt(ans)}</b>`; }; } };
  },
  /* more than / less than (direct or inverse) */
  tMoreLess({ r1, r2, v, unit, more }) {
    const right = (more ? 'มากกว่า' : 'น้อยกว่า') + ` ${v} ${unit}`;
    return { prompt: 'เติมคำว่า <span class="hl">มากกว่า</span> หรือ <span class="hl">น้อยกว่า</span>', say: `${r1} ${r2} มากกว่าหรือน้อยกว่า ${v} ${unit}`,
      mount(bd, ctx) { const blank = h('span', { class: 'fsign' }, '?');
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'r3' }, h('div', { class: 'r3-row in', html: `<span class="r3-l">${r1}</span><span class="r3-r">${v} ${unit}</span>` }), h('div', { class: 'r3-row in' }, h('span', { class: 'r3-l', html: r2 }), h('span', { class: 'r3-r' }, blank))),
          choices(ctx, ['มากกว่า', 'น้อยกว่า'].map(w => ({ value: `${w} ${v} ${unit}`, label: `${w} ${v} ${unit}` })), right, { hint: 'ถ้าเปลี่ยนไปทางเดียวกัน: มากขึ้น → มากกว่า · ถ้าเปลี่ยนทางตรงข้าม (เช่น คนมากขึ้น งานเสร็จเร็วขึ้น): มากขึ้น → น้อยกว่า', onRight: o => { blank.textContent = o.value; blank.classList.add('filled'); } })));
        bd.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); } };
  },
  /* can we use the rule of three? */
  tCan({ text, can, why }) {
    const R = can ? 'ใช้บัญญัติไตรยางศ์ได้' : 'ใช้บัญญัติไตรยางศ์ไม่ได้';
    return { prompt: `โจทย์นี้${'<span class="hl">ใช้บัญญัติไตรยางศ์</span>'}หาคำตอบได้หรือไม่?`, say: 'โจทย์นี้ใช้บัญญัติไตรยางศ์หาคำตอบได้หรือไม่',
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'storybox', html: text }), choices(ctx, ['ใช้บัญญัติไตรยางศ์ได้', 'ใช้บัญญัติไตรยางศ์ไม่ได้'].map(x => ({ value: x, label: x })), R, { hint: why })));
        bd.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); ctx.onRight = () => ctx.say(why); } };
  },
  /* which shop is cheaper? */
  tCheaper({ item, unit, A, B, nA = 'ร้านขายดี', nB = 'ร้านสะดวกซื้อ' }) {
    const uA = rDiv(DQ(String(A[1])), DQ(String(A[0]))), uB = rDiv(DQ(String(B[1])), DQ(String(B[0]))), c = rCmp(uA, uB), right = c < 0 ? nA : c > 0 ? nB : 'ราคาเท่ากัน';
    return { prompt: `${item}: ร้านไหน<span class="hl">ถูกกว่า</span>?`, say: `${item} ร้านไหนถูกกว่า`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, ...[[nA, A, 'a'], [nB, B, 'b']].map(([nm, [n, p], col]) => h('div', { class: 'cmp-card ' + col }, h('b', null, nm), h('div', { html: `${item} ${rNum(n)} ${unit} ราคา ${rNum(p)} บาท` })))),
        choices(ctx, [nA, nB, 'ราคาเท่ากัน'].map(x => ({ value: x, label: x })), right, { hint: `หาราคาต่อ 1 ${unit}: ${nA} ${dTxt(uA)} บาท · ${nB} ${dTxt(uB)} บาท` })));
        bd.querySelectorAll('.opt').forEach(x => x.classList.add('txt')); } };
  }
});

/* =========================================================
   ========================================================= */
const TS = (text, a, b, c, unit, round) => ({ text, a, b, c, unit, round });
const P5R_ONE = [TS('ลุงขับรถชั่วโมงละ 40 กิโลเมตร ขับ 5 ชั่วโมง ได้ระยะทางกี่กิโลเมตร', 1, 40, 5, 'กิโลเมตร'),
  TS('สวนเก็บมะนาวได้ 80 กิโลกรัม ใน 2 วัน เก็บได้เฉลี่ยวันละกี่กิโลกรัม', 2, 80, 1, 'กิโลกรัม'),
  TS('ครูจ่ายเงิน 1,200 บาท ซื้อลูกฟุตบอล 5 ลูก ราคาเท่ากัน ลูกฟุตบอลราคาลูกละกี่บาท', 5, 1200, 1, 'บาท'),
  TS('น้ำยาถูพื้น 4 ลิตร แบ่งใส่ขวดเท่า ๆ กันได้ 8 ขวด ขวดละกี่ลิตร', 8, 4, 1, 'ลิตร'),
  TS('ยายทำสวนมะม่วง ใช้ปุ๋ยไร่ละ 66 กิโลกรัม ถ้ามี 11 ไร่ ยายใช้ปุ๋ยทั้งหมดกี่กิโลกรัม', 1, 66, 11, 'กิโลกรัม'),
  TS('ไก่ซื้อตุ๊กตาราคาตัวละ 36 บาท ถ้าซื้อ 9 ตัว ไก่จะต้องจ่ายเงินเท่าไร', 1, 36, 9, 'บาท'),
  // v125: เพิ่มโจทย์ให้เกมด่าน 1 ครบ 10 ข้อ (คูณ 5 · หาร 5)
  TS('ไข่ไก่แผงละ 30 ฟอง แม่ซื้อ 6 แผง ได้ไข่ทั้งหมดกี่ฟอง', 1, 30, 6, 'ฟอง'), TS('รถโดยสารคันละ 45 ที่นั่ง มี 8 คัน มีที่นั่งทั้งหมดกี่ที่นั่ง', 1, 45, 8, 'ที่นั่ง'),
  TS('ดินสอ 12 แท่ง ราคา 96 บาท ดินสอราคาแท่งละกี่บาท', 12, 96, 1, 'บาท'), TS('ต้นอ่านหนังสือ 7 วัน ได้ 210 หน้า อ่านเฉลี่ยวันละกี่หน้า', 7, 210, 1, 'หน้า'),
  TS('น้ำ 150 ลิตร แบ่งใส่ถังเท่า ๆ กัน 6 ถัง ถังละกี่ลิตร', 6, 150, 1, 'ลิตร')];
const P5R_FILL = [{ k1: 'จาน', u1: 'ใบ', k2: 'ราคา', u2: 'บาท', a: 8, b: 25, c: 24 }, { k1: 'อุ้มถักผ้าเช็ดหน้า', u1: 'ผืน', k2: 'ใช้เวลา', u2: 'วัน', a: 3, b: 2, c: 9 },
  { k1: 'น้ำผลไม้', u1: 'ขวด', k2: 'ราคา', u2: 'บาท', a: 4, b: 42, c: 10 }, { k1: 'ข้าวสาร', u1: 'ลิตร', k2: 'เลี้ยงคนงานได้', u2: 'คน', a: 36, b: 28, c: 27 }];
const RML = (r1, r2, v, unit, more) => ({ r1, r2, v, unit, more });
const P5R_ML = [RML('เทียน 5 เล่ม ราคา', 'เทียน 1 เล่ม ราคา', 40, 'บาท', false), RML('ซื้อขนม 3 ถุง ราคา', 'ซื้อขนม 1 ถุง ราคา', 15, 'บาท', false), RML('การบ้าน 15 ข้อ ใช้เวลาทำ', 'การบ้าน 25 ข้อ ใช้เวลาทำ', 10, 'นาที', true),
  RML('คนงาน 7 คน ช่วยกันขุดบ่อเสร็จในเวลา', 'คนงาน 10 คน ช่วยกันขุดบ่อเสร็จในเวลา', 3, 'วัน', false), RML('คนงาน 3 คน ช่วยกันปูกระเบื้องได้', 'คนงาน 5 คน ช่วยกันปูกระเบื้องได้', 10, 'แผ่น', true)];
const CN = (text, can, why) => ({ text, can, why });
const P5R_CAN = [CN('ซื้อสมุด 4 เล่ม ราคา 60 บาท ถ้าซื้อสมุดแบบเดียวกัน 10 เล่ม ต้องจ่ายเงินเท่าไร', true, 'ราคาเพิ่มขึ้นตามจำนวนสมุดเป็นจำนวนเท่า → ใช้ได้'),
  CN('ปีนี้แม่อายุ 36 ปี ลูกอายุ 9 ปี เมื่อลูกอายุ 18 ปี แม่จะอายุกี่ปี', false, 'อายุเพิ่มขึ้นด้วยการบวก (ทุกคนเพิ่มปีละ 1) ไม่ได้เพิ่มเป็นจำนวนเท่า → ใช้ไม่ได้ (แม่อายุ 45 ปี ไม่ใช่ 72 ปี)'),
  CN('รถยนต์ใช้น้ำมัน 20 ลิตร วิ่งได้ 160 กิโลเมตร ถ้าวิ่ง 400 กิโลเมตร ต้องใช้น้ำมันกี่ลิตร', true, 'ระยะทางเพิ่มขึ้นตามน้ำมันเป็นจำนวนเท่า → ใช้ได้'),
  CN('นักวิ่งคนหนึ่งวิ่ง 100 เมตร ใช้เวลา 15 วินาที ถ้าวิ่ง 42 กิโลเมตร จะใช้เวลากี่วินาที', false, 'วิ่งไกล ๆ จะเหนื่อยและช้าลง ความเร็วไม่คงที่ → ใช้บัญญัติไตรยางศ์ไม่ได้'),
  CN('ค่าเข้าสวนสนุกคนละ 120 บาท ถ้าไป 5 คน ต้องจ่ายเงินเท่าไร', true, 'คนเพิ่มขึ้นกี่เท่า ค่าเข้าก็เพิ่มขึ้นเท่านั้น → ใช้ได้'),
  CN('ต้มไข่ 1 ฟอง ใช้เวลา 10 นาที ถ้าต้มไข่ 6 ฟองในหม้อเดียวกันพร้อมกัน จะใช้เวลากี่นาที', false, 'ต้มพร้อมกันในหม้อเดียว เวลาไม่ได้เพิ่มตามจำนวนไข่ → ใช้ไม่ได้ (ยังใช้ 10 นาที)')];
const P5R_A = [TS('ร้านทำข้าวกล่องได้ 120 กล่อง ใช้เวลา 6 ชั่วโมง ถ้าต้องการทำ 280 กล่อง ต้องใช้เวลากี่ชั่วโมง', 120, 6, 280, 'ชั่วโมง'),
  TS('ร้านขายลูกชิ้น 4 ถุง ราคา 400 บาท ถ้าซื้อ 7 ถุง ต้องจ่ายเงินกี่บาท', 4, 400, 7, 'บาท'),
  TS('คนงาน 5 คน เก็บมะพร้าวได้ 50 ลูก ถ้ามีคนงาน 6 คน จะเก็บมะพร้าวได้กี่ลูก', 5, 50, 6, 'ลูก'),
  TS('คุกกี้ 2 กล่อง หนักรวม 1.6 กิโลกรัม คุกกี้ 10 กล่องหนักกี่กิโลกรัม', 2, 1.6, 10, 'กิโลกรัม'),
  TS('ลุงปลูกต้นมะละกอ 10 ต้น ใช้ 6 แปลง ถ้าปลูก 55 ต้น ต้องใช้กี่แปลง', 10, 6, 55, 'แปลง'),
  TS('โรงงานผลิตเก้าอี้ 42 ตัว ใน 3 วัน ถ้าทำงาน 21 วัน จะผลิตเก้าอี้ได้กี่ตัว', 3, 42, 21, 'ตัว'),
  TS('ผ้า 4 เมตร ราคา 100 บาท ถ้าซื้อผ้า 9 เมตร จะต้องจ่ายเงินกี่บาท', 4, 100, 9, 'บาท'),
  TS('มะนาว 20 ผล ราคา 25 บาท ซื้อมะนาว 10 บาท จะได้มะนาวกี่ผล', 25, 20, 10, 'ผล'),
  TS('ดินสอราคาโหลละ 96 บาท ถ้าต้องการซื้อดินสอ 4 แท่ง จะต้องจ่ายเงินเท่าไร', 12, 96, 4, 'บาท'),
  TS('หนังสือ 6 เล่ม ราคา 500 บาท ซื้อหนังสือ 1,000 บาท จะได้หนังสือกี่เล่ม', 500, 6, 1000, 'เล่ม'),
  TS('ร้านค้าขายสมุด 4 เล่ม ราคา 30 บาท ถ้าซื้อ 10 เล่ม จะต้องจ่ายเงินเท่าไร', 4, 30, 10, 'บาท'),
  TS('ไข่ไก่ราคาโหลละ 54 บาท ต้องการซื้อครึ่งโหล (6 ฟอง) ต้องจ่ายเงินเท่าไร', 12, 54, 6, 'บาท'),
  TS('มานีมีดอกเบญจมาศ 84 ดอก จัดใส่แจกันขนาดเท่า ๆ กันได้ 6 ใบ ถ้าต้องการจัดแจกันขนาดเดียวกัน 10 ใบ จะต้องใช้ดอกเบญจมาศกี่ดอก', 6, 84, 10, 'ดอก')];
const P5R_B = [TS('พัดลม 6 เครื่อง ใช้ไฟฟ้ารวม 300 วัตต์ ถ้าใช้ไฟฟ้า 1,150 วัตต์ จะเปิดพัดลมพร้อมกันได้กี่เครื่อง', 300, 6, 1150, 'เครื่อง'),
  TS('ภูรดน้ำต้นไม้ 15 ต้น ใช้น้ำ 400 ลิตร ถ้ารดน้ำต้นไม้ 30 ต้น ต้องใช้น้ำกี่ลิตร', 15, 400, 30, 'ลิตร'),
  TS('รถส่งของ 10 คัน ส่งพัสดุได้ 60 ชิ้น ถ้ามีรถส่งของ 16 คัน จะส่งพัสดุได้กี่ชิ้น', 10, 60, 16, 'ชิ้น'),
  TS('สมจิตอ่านหนังสือได้ 100 หน้า ใช้เวลา 300 นาที ถ้าต้องการอ่าน 250 หน้า จะใช้เวลากี่นาที', 100, 300, 250, 'นาที'),
  TS('สังกะสี 5 แผ่น ราคา 225 บาท ถ้ามีเงิน 1,000 บาท จะซื้อสังกะสีได้<b>มากที่สุด</b>กี่แผ่น', 225, 5, 1000, 'แผ่น', 'down'),
  TS('รถเข็นขนเกลือได้เที่ยวละ 90 กิโลกรัม ต้องการขนเกลือ 1,140 กิโลกรัม ต้องขน<b>อย่างน้อย</b>กี่เที่ยว', 90, 1, 1140, 'เที่ยว', 'up'),
  TS('เงินสกุลกีบของลาว 1,000 กีบ แลกเป็นเงินไทยได้ 4 บาท ถ้ามีเงิน 255 บาท จะแลกเป็นเงินกีบได้กี่กีบ', 4, 1000, 255, 'กีบ')];
const CH = (item, unit, A, B) => ({ item, unit, A, B });
const P5R_SHOP = [CH('สมุด', 'เล่ม', [5, 40], [4, 28]), CH('ปากกา', 'ด้าม', [1, 5], [12, 54]), CH('ผ้าเช็ดตัว', 'ผืน', [2, 249], [1, 125]), CH('สบู่', 'ก้อน', [6, 48], [2, 18]),
  CH('ข้าวสาร', 'กิโลกรัม', [15, 480], [5, 120]), CH('น้ำมันพืช', 'ขวด', [2, 79], [6, 230]), CH('ผงซักฟอก', 'กิโลกรัม', [1, 125], [5, 615]), CH('รองเท้าฟองน้ำ', 'คู่', [2, 44], [12, 270])];
const P5R_VEG = [['พริก', [1, 25], [5, 65], [2, 25]], ['แคร์รอต', [3, 126], [8, 240], [2, 90]], ['บรอกโคลี', [10, 240], [4, 400], [8, 365]], ['มะเขือยาว', [2, 48], [10, 180], [5, 100]], ['ฟักทอง', [15, 675], [1, 85], [20, 500]]];
const vegTable = () => h('table', { class: 'gtbl sm' }, h('thead', null, h('tr', null, h('th', null, 'ผัก'), h('th', null, 'ร้านที่ 1'), h('th', null, 'ร้านที่ 2'), h('th', null, 'ร้านที่ 3'))),
  h('tbody', null, ...P5R_VEG.map(([n, ...s]) => h('tr', null, h('td', null, n), ...s.map(([k, p]) => h('td', null, `${k} กก. ${p} บาท`))))));
const P5R_2STEP = [TS('ปาล์มมีลูกโป่ง 90 ลูก ใส่ถุงเท่า ๆ กันได้ 5 ถุง ถ้าต้องการจัดลงถุงขนาดเดียวกัน 12 ถุง จะต้องใช้ลูกโป่งกี่ลูก', 5, 90, 12, 'ลูก'),
  TS('รถยนต์ใช้น้ำมัน 20 ลิตร ขับได้ 160 กิโลเมตร ถ้าต้องการขับ 400 กิโลเมตร จะต้องใช้น้ำมันกี่ลิตร', 160, 20, 400, 'ลิตร'),
  TS('ค่าบริการอินเทอร์เน็ต 4 กิกะไบต์ ราคา 69.50 บาท ถ้าใช้ 14 กิกะไบต์ ต้องจ่ายค่าบริการกี่บาท', 4, 69.5, 14, 'บาท'),
  TS('น้ำตาลทราย 1 ช้อนโต๊ะ หนัก 12.5 กรัม ต้องการตักน้ำตาล 1,500 กรัม ต้องตักกี่ช้อนโต๊ะ', 12.5, 1, 1500, 'ช้อนโต๊ะ'),
  TS('กบกระโดดได้ครั้งละ 35 เซนติเมตร ต้องการให้ได้ระยะทาง<b>ไม่ต่ำกว่า</b> 5,000 เซนติเมตร ต้องกระโดดอย่างน้อยกี่ครั้ง', 35, 1, 5000, 'ครั้ง', 'up'),
  TS('ดอกกุหลาบ 4 ดอก ราคา 18 บาท ถ้ามีเงิน 54 บาท จะซื้อดอกกุหลาบได้กี่ดอก', 18, 4, 54, 'ดอก')];

const L5R = (no, vno, place, title, short, goal, teach, game) => ({ id: 590 + no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game });
const LESSONS_P5C4 = [
  L5R(1, 1, 'ถ้ำสองปริมาณ', 'โจทย์ปัญหาการคูณและการหารที่แสดงความสัมพันธ์ระหว่างปริมาณของสิ่ง 2 สิ่ง', 'ความสัมพันธ์ 2 ปริมาณ', 'บอกความสัมพันธ์ของปริมาณ 2 สิ่งที่เปลี่ยนไปพร้อมกัน และใช้การคูณ การหารหาคำตอบ', [
    // v125 (ผู้ใช้ขอ): อธิบายใหม่ให้เห็นภาพ — ① เห็นว่า 2 ปริมาณเปลี่ยนไปด้วยกัน ② แถบรูป: คูณ ③ แถบรูป: หาร ④ สรุปเทียบ 2 แบบ
    T('ยินดีต้อนรับสู่ <b>ถ้ำไตรยางศ์</b>! สมุดเล่มละ 12 บาท — <b>กดเพิ่ม/ลดจำนวนสมุด</b> ดูว่าราคาเปลี่ยนตามอย่างไร', 'ยินดีต้อนรับสู่ถ้ำไตรยางศ์ สมุดเล่มละสิบสองบาท กดเพิ่มลดจำนวนสมุด ดูว่าราคาเปลี่ยนตามอย่างไร', el => el.append(simRate({ e: 'book', k1: 'สมุด', u1: 'เล่ม', u2: 'บาท', per: 12, n0: 3, max: 10 }))),
    T('<b>รู้ของ 1 สิ่ง → หาหลายสิ่ง</b>: ลุงขับรถชั่วโมงละ 40 กิโลเมตร ขับ 5 ชั่วโมง ได้กี่กิโลเมตร — กดทีละขั้น', 'รู้ของหนึ่งสิ่ง หาหลายสิ่ง ลุงขับรถชั่วโมงละสี่สิบกิโลเมตร ขับห้าชั่วโมง ได้กี่กิโลเมตร กดทีละขั้น',
      el => el.append(simBarRate({ mode: 'mul', e: 'car', k1: 'ชั่วโมง', u1: 'ชั่วโมง', k2: 'ระยะทาง', u2: 'กม.', n: 5, per: 40 }))),
    T('<b>รู้ของหลายสิ่ง → หาของ 1 สิ่ง</b>: ซื้อลูกบอล 4 ลูก จ่าย 240 บาท ลูกละกี่บาท — กดทีละขั้น', 'รู้ของหลายสิ่ง หาของหนึ่งสิ่ง ซื้อลูกบอลสี่ลูก จ่ายสองร้อยสี่สิบบาท ลูกละกี่บาท กดทีละขั้น',
      el => el.append(simBarRate({ mode: 'div', e: 'ball', k1: 'ลูกบอล', u1: 'ลูก', k2: 'ราคา', u2: 'บาท', n: 4, per: 60 }))),
    T('สรุป: <b>คูณ</b> หรือ <b>หาร</b>? ดูว่ารู้ของ 1 สิ่ง หรือรู้ของรวมหลายสิ่ง', 'สรุป คูณหรือหาร ดูว่ารู้ของหนึ่งสิ่ง หรือรู้ของรวมหลายสิ่ง', el => el.append(simMulDivSum()))],
    () => [...pkF(P5R_ONE.filter(x => +x.a === 1), 5), ...pkF(P5R_ONE.filter(x => +x.a !== 1), 5)].map(s => Q.tSolve({ ...s, plain: true }))),
  L5R(2, 2, 'ถ้ำสามขั้น', 'การอธิบายวิธีหาคำตอบโดยใช้บัญญัติไตรยางศ์', 'วิธีคิดบัญญัติไตรยางศ์', 'อธิบายวิธีหาคำตอบโดยใช้บัญญัติไตรยางศ์ 3 ขั้น: เขียนสิ่งที่กำหนด → หาค่าของ 1 สิ่ง → หาค่าที่โจทย์ถาม', [
    T('<b>บัญญัติไตรยางศ์</b> = รู้ 3 จำนวน หาจำนวนที่ 4 · ทำ 3 ขั้น — กดดูทีละขั้น', 'บัญญัติไตรยางศ์ คือรู้สามจำนวน หาจำนวนที่สี่ ทำสามขั้น', el => el.append(simRule3({ story: 'ซื้อสมุด 3 เล่ม ราคา 30 บาท ถ้าซื้อสมุด 6 เล่ม จะต้องจ่ายเงินเท่าไร', k1: 'ซื้อสมุด', u1: 'เล่ม', k2: 'ราคา', u2: 'บาท', a: 3, b: 30, c: 6 }))),
    T('ลองเอง: <b>เลือกเครื่องหมาย</b>ในแต่ละขั้น — ของน้อยลงหาร · ของมากขึ้นคูณ', 'ลองเอง เลือกเครื่องหมายในแต่ละขั้น ของน้อยลงหาร ของมากขึ้นคูณ', el => el.append(simRule3Try({ story: 'แอปเปิล 3 ผล ราคา 25 บาท ซื้อแอปเปิล 15 ผล จะต้องจ่ายเงินเท่าไร', k1: 'แอปเปิล', u1: 'ผล', k2: 'ราคา', u2: 'บาท', a: 3, b: 25, c: 15 }))),
    T('ตัวอย่างที่ 3: สิ่งที่ถามเป็น<b>จำนวนของ</b> (ไม่ใช่เงิน) ก็ใช้วิธีเดียวกัน — ให้สิ่งที่ถามอยู่ขวามือ', 'สิ่งที่ถามเป็นจำนวนของ ก็ใช้วิธีเดียวกัน ให้สิ่งที่ถามอยู่ขวามือ', el => el.append(simRule3({ story: 'แป้งฝุ่น 6 กระป๋อง ราคา 192 บาท มีเงิน 64 บาท จะซื้อแป้งฝุ่นได้กี่กระป๋อง', k1: 'มีเงิน', u1: 'บาท', k2: 'ซื้อแป้งฝุ่นได้', u2: 'กระป๋อง', a: 192, b: 6, c: 64 })))],
    () => [...P5R_FILL.map(o => Q.tTable(o)), ...pkF(P5R_ML.slice(0, 3), 2).map(o => Q.tMoreLess(o))]),
  L5R(3, 3, 'ถ้ำใช้ได้ไหม', 'ลักษณะโจทย์ปัญหาที่สามารถใช้บัญญัติไตรยางศ์ในการหาคำตอบ', 'โจทย์แบบไหนใช้ได้', 'บอกได้ว่าโจทย์ใดใช้บัญญัติไตรยางศ์หาคำตอบได้ (ปริมาณ 2 สิ่งเพิ่มหรือลดเป็นจำนวนเท่า)', [
    T('ปริมาณ 2 สิ่ง<b>เปลี่ยนไปด้วยกันเป็นจำนวนเท่า</b>หรือไม่? — ปรับจำนวนคนงาน แล้วกดสลับดูอีกแบบ', 'ปริมาณสองสิ่งเปลี่ยนไปด้วยกันเป็นจำนวนเท่าหรือไม่ ปรับจำนวนคนงาน แล้วกดสลับดูอีกแบบ', el => el.append(simMoreLess())),
    T('ตัวอย่าง 2 ข้อ: ข้อไหนใช้บัญญัติไตรยางศ์ได้ — กดดูทีละขั้น', 'ตัวอย่างสองข้อ ข้อไหนใช้บัญญัติไตรยางศ์ได้', el => el.append(dcWalk('', [['ข้อ ก.', 'ปากกา 2 ด้าม ราคา 18 บาท · 6 ด้ามราคาเท่าไร'], ['คิด ก.', 'ปากกาเพิ่ม 3 เท่า ราคาก็เพิ่ม 3 เท่า → <b>ใช้ได้</b>: 6 × [18/2] = 54 บาท'], ['ข้อ ข.', 'พี่สูง 150 ซม. น้องสูง 120 ซม. อีก 2 ปีพี่สูง 160 ซม. น้องสูงเท่าไร'], ['คิด ข.', 'การสูงขึ้นไม่ได้เพิ่มเป็นจำนวนเท่าที่แน่นอน → <b>ใช้ไม่ได้</b>']], 'ใช้ได้เมื่อ: ปริมาณหนึ่งเพิ่ม/ลดกี่เท่า อีกปริมาณก็เพิ่ม/ลดเท่านั้น (ใช้การคูณ การหาร ไม่ใช่การบวก ลบ)')))],
    () => [...pkF(P5R_CAN, 4).map(o => Q.tCan(o)), ...pkF(P5R_ML.slice(3), 2).map(o => Q.tMoreLess(o)), Q.tMoreLess(P5R_ML[0])]),
  L5R(4, 4, 'ถ้ำวิเคราะห์', 'การวิเคราะห์โจทย์ปัญหาโดยใช้บัญญัติไตรยางศ์ในการหาคำตอบ', 'วิเคราะห์โจทย์', 'วิเคราะห์โจทย์: หาสิ่งที่กำหนด สิ่งที่ถาม จัดให้สิ่งเดียวกันอยู่ตรงกัน แล้วใช้บัญญัติไตรยางศ์', [
    T('วิเคราะห์ทีละขั้น: <b>กำหนดอะไร · ถามอะไร · สิ่งที่ถามไว้ขวามือ</b>', 'วิเคราะห์ทีละขั้น กำหนดอะไร ถามอะไร สิ่งที่ถามไว้ขวามือ', el => el.append(dcWalk('', [['โจทย์', 'ก่อกำแพงยาว 3 เมตร ใช้อิฐ 219 ก้อน ถ้าก่อกำแพงยาว 13 เมตร ต้องใช้อิฐกี่ก้อน'], ['กำหนด', 'กำแพง 3 เมตร ใช้อิฐ 219 ก้อน'], ['ถาม', 'จำนวน<b>อิฐ</b> → อิฐอยู่ขวามือ'], ['ขั้นที่ 2', 'กำแพง 1 เมตร ใช้อิฐ [219/3] = 73 ก้อน'], ['ขั้นที่ 3', 'กำแพง 13 เมตร ใช้อิฐ 13 × 73 = <b>949 ก้อน</b>']], 'ตรวจ: กำแพงยาวขึ้น อิฐก็ต้องมากขึ้น ✓'))),
    T('ลองเอง: เลือกเครื่องหมายทีละขั้น', 'ลองเอง เลือกเครื่องหมายทีละขั้น', el => el.append(simRule3Try({ story: 'สีทาบ้าน 2 ถัง ทาผนังได้ 30 ตารางเมตร ถ้าต้องการทาผนัง 75 ตารางเมตร ต้องใช้สีกี่ถัง', k1: 'ทาผนัง', u1: 'ตร.ม.', k2: 'ใช้สี', u2: 'ถัง', a: 30, b: 2, c: 75 })))],
    () => pkF(P5R_A, 7).map(s => Q.tSolve(s))),
  L5R(5, 5, 'ถ้ำแสดงวิธี 1', 'การแสดงวิธีหาคำตอบของโจทย์ปัญหาโดยใช้บัญญัติไตรยางศ์ (ตอนที่ 1)', 'แสดงวิธีทำ 1', 'แสดงวิธีหาคำตอบด้วยบัญญัติไตรยางศ์ รวมทั้งการปัดเศษให้เหมาะกับโจทย์ และการเปรียบเทียบราคา', [
    T('แสดงวิธีทำ เมื่อคำตอบ<b>ไม่ลงตัว</b>: ซื้อของได้แค่จำนวนเต็ม จึง<b>ปัดทิ้ง</b>', 'เมื่อคำตอบไม่ลงตัว ซื้อของได้แค่จำนวนเต็ม จึงปัดทิ้ง', el => el.append(simRule3({ story: 'สังกะสี 5 แผ่น ราคา 225 บาท ถ้ามีเงิน 1,000 บาท จะซื้อได้มากที่สุดกี่แผ่น', k1: 'มีเงิน', u1: 'บาท', k2: 'ซื้อสังกะสีได้', u2: 'แผ่น', a: 225, b: 5, c: 1000 }, [null, null, 'ขั้นที่ 3: 1,000 × [5/225] = 22.22… แผ่น → ซื้อเศษแผ่นไม่ได้ <b>ตอบ 22 แผ่น</b>']))),
    T('ใช้บัญญัติไตรยางศ์<b>เปรียบเทียบราคา</b>: หาราคาต่อ 1 หน่วยของแต่ละร้าน', 'ใช้บัญญัติไตรยางศ์เปรียบเทียบราคา หาราคาต่อหนึ่งหน่วยของแต่ละร้าน', el => el.append(simCompare({ item: 'น้ำดื่ม', unit: 'ขวด', A: [6, 39], B: [4, 28], e: 'milk' })))],
    () => [...pkF(P5R_B.slice(0, 5), 4).map(s => Q.tSolve(s)), ...pkF(P5R_SHOP, 3).map(o => Q.tCheaper(o)),
      Q.dPick({ q: 'ตารางราคาผัก 3 ร้าน: ถ้าซื้อ<b>แคร์รอต</b> ร้านใดถูกที่สุด', opts: ['ร้านที่ 2 (กิโลกรัมละ 30 บาท)', 'ร้านที่ 1 (กิโลกรัมละ 42 บาท)', 'ร้านที่ 3 (กิโลกรัมละ 45 บาท)'], right: 'ร้านที่ 2 (กิโลกรัมละ 30 บาท)', hint: 'หาราคาต่อ 1 กิโลกรัม: 126 ÷ 3, 240 ÷ 8, 90 ÷ 2' })]),
  L5R(6, 6, 'ถ้ำแสดงวิธี 2', 'การแสดงวิธีหาคำตอบของโจทย์ปัญหาโดยใช้บัญญัติไตรยางศ์ (ตอนที่ 2)', 'แสดงวิธีทำ 2', 'แสดงวิธีหาคำตอบของโจทย์ปัญหาบัญญัติไตรยางศ์ที่ซับซ้อนขึ้น (หลายขั้น หน่วยต่างกัน ทศนิยม)', [
    T('โจทย์ <b>2 ขั้น</b>: ใช้บัญญัติไตรยางศ์ก่อน แล้วคิดเงินต่อ', 'โจทย์สองขั้น ใช้บัญญัติไตรยางศ์ก่อน แล้วคิดเงินต่อ', el => el.append(dcWalk('', [['โจทย์', 'ลูกโป่ง 90 ลูก ใส่ได้ 5 ถุง ถ้าจัด 12 ถุง ต้องใช้ลูกโป่งกี่ลูก และถ้าลูกโป่งราคาลูกละ 2 บาท ต้องจ่ายเงินเท่าไร'], ['ขั้นที่ 1', '5 ถุง ใช้ 90 ลูก → 1 ถุง ใช้ [90/5] = 18 ลูก'], ['ขั้นที่ 2', '12 ถุง ใช้ 12 × 18 = <b>216 ลูก</b>'], ['ขั้นที่ 3', 'ค่าลูกโป่ง 216 × 2 = <b>432 บาท</b>']], 'ตอบ 216 ลูก และ 432 บาท'))),
    T('ตัวอย่างที่ 2: ข้อมูลเป็น<b>ทศนิยม</b> — คิดแบบเดียวกัน (คูณก่อนแล้วค่อยหาร)', 'ข้อมูลเป็นทศนิยม คิดแบบเดียวกัน', el => el.append(simRule3({ story: 'เชือก 3 เมตร ราคา 37.50 บาท ถ้าซื้อเชือก 8 เมตร ต้องจ่ายเงินเท่าไร', k1: 'เชือก', u1: 'เมตร', k2: 'ราคา', u2: 'บาท', a: 3, b: 37.5, c: 8 })))],
    () => [...pkF(P5R_2STEP, 4).map(s => Q.tSolve(s)), ...pkF(P5R_B.slice(5), 2).map(s => Q.tSolve(s)), Q.tSolve(P5R_B[3])])
];
/* boss 599: ข้อสอบท้ายบท — แต่งใหม่ทั้งหมด */
const EXAM_P5C4 = xrot([
  { q: 'ลานจอดรถพื้นที่ 360 ตารางเมตร จอดรถได้ 24 คัน ถ้าต้องการจอดรถ 15 คัน ต้องใช้พื้นที่กี่ตารางเมตร', opts: ['200 ตารางเมตร', '225 ตารางเมตร', '240 ตารางเมตร', '250 ตารางเมตร'], a: 1 },
  { q: 'สบู่ราคาโหลละ 18 บาท ถ้ามีเงิน 108 บาท จะซื้อสบู่ได้กี่โหล', opts: ['5 โหล', '6 โหล', '7 โหล', '8 โหล'], a: 1 },
  { q: 'ขนมครก 6 ชิ้น ราคา 15 บาท ถ้ามีเงิน 45 บาท จะซื้อขนมครกได้กี่ชิ้น', opts: ['12 ชิ้น', '15 ชิ้น', '18 ชิ้น', '21 ชิ้น'], a: 2 },
  { q: 'สมุด 4 เล่ม ราคา 56 บาท ถ้ามีเงิน 98 บาท จะซื้อสมุดได้กี่เล่ม', opts: ['6 เล่ม', '7 เล่ม', '8 เล่ม', '9 เล่ม'], a: 1 },
  { q: 'ปิ่นสอบได้ 36 คะแนน จากคะแนนเต็ม 40 คะแนน ถ้าคะแนนเต็ม 50 คะแนน ปิ่นจะได้กี่คะแนน', opts: ['40 คะแนน', '42 คะแนน', '45 คะแนน', '46 คะแนน'], a: 2 },
  { q: 'ไข่ไก่ 10 ฟอง ราคา 42 บาท ถ้าซื้อไข่ไก่ 25 ฟอง จะต้องจ่ายเงินเท่าไร', opts: ['95 บาท', '100 บาท', '105 บาท', '110 บาท'], a: 2 },
  { q: 'ดินสอราคาโหลละ 60 บาท ต้องการซื้อ 7 แท่ง จะต้องจ่ายเงินเท่าใด', opts: ['30 บาท', '35 บาท', '40 บาท', '42 บาท'], a: 1 },
  { q: 'พิมพ์งาน 12 หน้า ใช้เวลา 9 นาที ถ้าพิมพ์งาน 28 หน้า จะใช้เวลากี่นาที', opts: ['19 นาที', '20 นาที', '21 นาที', '24 นาที'], a: 2 },
  { q: 'ซื้อลำไย 4 กิโลกรัม เป็นเงิน 140 บาท ถ้าซื้อลำไย 9 กิโลกรัม จะต้องจ่ายเงินกี่บาท', opts: ['300 บาท', '305 บาท', '315 บาท', '325 บาท'], a: 2 },
  { q: 'แม่มีส้ม 90 ผล จัดใส่ตะกร้าได้ 5 ใบ ใบละเท่า ๆ กัน ถ้าต้องการจัดแบบเดียวกันนี้ 8 ใบ จะต้องใช้ส้มกี่ผล', opts: ['126 ผล', '135 ผล', '144 ผล', '162 ผล'], a: 2 },
  { q: 'ร้านให้เช่าจักรยาน 3 ชั่วโมง ราคา 52.50 บาท ถ้าเช่า 8 ชั่วโมง จะต้องจ่ายเงินกี่บาท', opts: ['130 บาท', '140 บาท', '147.50 บาท', '157.50 บาท'], a: 1 },
  { q: 'แก้ว 1 ใบจุน้ำได้ 250 มิลลิลิตร ถ้าต้องการตักน้ำ 4.5 ลิตร จะต้องตักทั้งหมดกี่แก้ว', opts: ['16 แก้ว', '18 แก้ว', '20 แก้ว', '45 แก้ว'], a: 1 },
  { q: 'ต้นถั่วงอกยาวขึ้นวันละ 4 เซนติเมตร ต้องใช้เวลาอย่างน้อยกี่วัน จึงจะมั่นใจได้ว่ายาวเกิน 1 เมตร', opts: ['24 วัน', '25 วัน', '26 วัน', '100 วัน'], a: 2 },
  { q: 'เต่าคลานได้ครั้งละ 45 เซนติเมตร เท่า ๆ กันทุกครั้ง ต้องคลานอย่างน้อยกี่ครั้ง จึงจะได้ระยะทางไม่น้อยกว่า 30 เมตร', opts: ['66 ครั้ง', '67 ครั้ง', '68 ครั้ง', '135 ครั้ง'], a: 1 },
  { q: 'ฟาร์มแห่งหนึ่งมีจำนวนไก่ต่อจำนวนเป็ดเป็น 9 : 6 เป็ด 1 ตัวออกไข่ได้ปีละ 150 ฟอง ถ้าฟาร์มมีไก่ 270 ตัว เป็ดทั้งหมดจะออกไข่ได้ปีละกี่ฟอง', opts: ['18,000 ฟอง', '27,000 ฟอง', '36,000 ฟอง', '40,500 ฟอง'], a: 1 }
]);
LESSONS_P5C4.push({ id: 599, boss: true, place: 'ถ้ำราชาหมีไตรยางศ์', title: 'ด่านบอส: บทที่ 4 บัญญัติไตรยางศ์', short: 'ด่านบอส · ข้อสอบ', tone: 'coral',
  goal: 'แก้โจทย์บัญญัติไตรยางศ์ 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส',
  exam: EXAM_P5C4, pass: 8, bossName: 'ราชาหมีไตรยางศ์', bossPal: 'magenta', emblem: '1:3', bossKind: 'bear' });
