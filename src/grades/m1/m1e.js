/* =========================================================
   ม.1 บทที่ 3 เลขยกกำลัง (v233) — prefix e3 · เมือง 92 "ลำน้ำยกกำลัง" (โลกแม่น้ำ ม.1)
   14 ด่านตามโครงสร้างที่ผู้ใช้ให้: ความหมาย · ฐาน/เลขชี้กำลัง · เขียนในรูปเลขยกกำลัง · หาค่า · ฐานลบและวงเล็บ ·
   ฐานเศษส่วน/ทศนิยม · คูณฐานเดียวกัน · หารฐานเดียวกัน · กำลังศูนย์และหนึ่ง · คูณหารร่วม · โจทย์หลายขั้นตอน ·
   สัญกรณ์วิทยาศาสตร์ (ความหมาย · การเขียน · การคำนวณ) — ด่าน 2301–2314 + บอส 2319 · ข้อความ/โจทย์แต่งใหม่ทั้งหมด
   ========================================================= */
const e3R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const e3Pick = a => a[Math.floor(Math.random() * a.length)];
const e3Fmt = x => { const r = Math.round(x * 1e10) / 1e10; return r < 0 ? '−' + (-r).toLocaleString('en-US', { maximumFractionDigits: 10 }) : r.toLocaleString('en-US', { maximumFractionDigits: 10 }); };
const e3B = b => typeof b === 'string' ? b : b < 0 ? `(${e3Fmt(b)})` : e3Fmt(b);
const e3P = (b, n) => `<span class="e3p">${e3B(b)}<sup>${n}</sup></span>`;
const e3Fr = (n, d, neg) => `${neg ? '−' : ''}${fqHTML(n, d)}`;
const e3PF = (n, d, e, neg) => `<span class="e3p">(${e3Fr(n, d, neg)})<sup>${e}</sup></span>`;
const e3Rep = (b, n) => Array(n).fill(e3B(b)).join(' × ');
const e3X = s => `<span class="e3-x">${s}</span>`;
const e3Say = t => miSay(String(t).replace(/<span class="fq"><i>(\d+)<\/i><i>(\d+)<\/i><\/span>/g, ' เศษ $1 ส่วน $2 ').replace(/<sup>([^<]*)<\/sup>/g, ' ยกกำลัง $1 ').replace(/□/g, ' อะไร ').replace(/≠/g, ' ไม่เท่ากับ '));
const e3TF = (text, ok, why) => Q.hTF({ text, ok: !!ok, why });
const e3SupN = n => String(n).replace(/-/g, '−');

/* ---------- ข้อในเกม ---------- */
/* ตอบเป็นตัวเลข (เศษส่วนพิมพ์ 4/9 ได้) · expr = นิพจน์ตัวใหญ่ */
Q.e3N = ({ q, expr, a, unit, hint, sig, base, diff }) => ({ prompt: q, say: e3Say(q + ' ' + (expr || '')), __sig: 'e3n ' + (sig || q + expr), ...(base ? { __base: base, __baseCap: 2 } : {}), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, expr ? h('div', { class: 'e3-big', html: expr }) : '', miAns(ctx, a, { unit, hint }))); } });
/* เลือกตอบ (ตัวเลือกเป็น HTML ได้) */
Q.e3O = ({ q, expr, opts, right, hint, sig, base, diff }) => ({ prompt: q, say: e3Say(q + ' ' + (expr || '')), __sig: 'e3o ' + (sig || q + right), ...(base ? { __base: base, __baseCap: 2 } : {}), ...(diff != null ? { __diff: diff } : {}),
  mount(bd, ctx) { const ch = choices(ctx, shuffle([...new Set(opts)].map(o => ({ value: o, label: `<span class="e3-x">${o}</span>` }))), right, { hint }); ch.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); bd.append(h('div', { class: 'colstack' }, expr ? h('div', { class: 'e3-big', html: expr }) : '', ch)); } });

/* ---------- หน้าลงมือ ---------- */
const e3Wrap = () => h('div', { class: 'colstack no-side' }, h6wait());
/* การคูณซ้ำ: พับกระดาษ — พับแต่ละครั้งจำนวนชั้นเพิ่มเป็น 2 เท่า */
function e3FoldSim(max = 5) {
  const wrap = e3Wrap(), paper = h('div', { class: 'e3-paper' }), big = h('div', { class: 'e3-big' }), out = fNote(); let n = 0;
  const draw = () => { const L = 2 ** n; paper.innerHTML = Array.from({ length: Math.min(L, 32) }, (_, i) => `<i style="--k:${i}"></i>`).join('');
    big.innerHTML = n === 0 ? 'ยังไม่พับ: กระดาษ <b>1</b> ชั้น' : `${e3Rep(2, n)} = ${e3P(2, n)} = <b>${L}</b> ชั้น`; };
  const btn = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (n >= max) return; n++; sfx.pop(n + 1); draw();
    out.innerHTML = `พับครั้งที่ ${n}: ชั้นกระดาษ × 2 → <b>${2 ** n}</b> ชั้น — เขียนเป็น ${e3P(2, n)} (นำ 2 มาคูณกัน ${n} ตัว)`;
    if (n === max) { btn.remove(); out.innerHTML += `<br>${e3P(2, 5)} ไม่ใช่ 2 × 5 = 10 แต่เป็น 2 คูณกัน 5 ตัว = <b>32</b>`; sfx.ok(); teachDone(wrap); } } }, 'พับครึ่ง ✂');
  draw(); wrap.append(h('div', { class: 'cap' }, `แตะ "พับครึ่ง" ${max} ครั้ง แล้วดูจำนวนชั้นของกระดาษ`), paper, big, btn, out); return wrap;
}
/* ส่วนประกอบ: แตะฐานและเลขชี้กำลังของเลขยกกำลังแต่ละตัว */
function e3PartSim(list) {
  const wrap = e3Wrap(), row = h('div', { class: 'rowstack e3-parts' }), out = fNote(); let done = 0;
  list.forEach(([html, base, exp, note]) => { const card = h('div', { class: 'e3-pcard', html: `<div class="e3-big">${html}</div>` }), seen = new Set();
    const bb = h('button', { class: 'btn ia e3-pb b' }, 'ฐาน'), eb = h('button', { class: 'btn ia e3-pb e' }, 'เลขชี้กำลัง');
    const hit = (k, b) => { if (seen.has(k)) return; seen.add(k); b.classList.add('on'); b.innerHTML = k === 'b' ? `ฐาน = <b>${base}</b>` : `เลขชี้กำลัง = <b>${exp}</b>`; sfx.pop(seen.size + 1);
      out.innerHTML = k === 'b' ? `ฐาน <b>${base}</b> = จำนวนที่นำมาคูณซ้ำ${note ? ' — ' + note : ''}` : `เลขชี้กำลัง <b>${exp}</b> = จำนวนตัวที่นำฐานมาคูณกัน`;
      if (seen.size === 2 && ++done === list.length) { sfx.ok(); teachDone(wrap); } };
    bb.onclick = e => { e.stopPropagation(); hit('b', bb); }; eb.onclick = e => { e.stopPropagation(); hit('e', eb); };
    card.append(h('div', { class: 'rowstack' }, bb, eb)); row.append(card); });
  wrap.append(h('div', { class: 'cap' }, 'แตะปุ่ม ฐาน และ เลขชี้กำลัง ของทุกการ์ด'), row, out); return wrap;
}
/* แยกตัวประกอบ: แตะจำนวนที่ยังแยกได้ จนเหลือแต่จำนวนเฉพาะ แล้วรวมเป็นเลขยกกำลัง */
function e3TreeSim(N) {
  const wrap = e3Wrap(), chips = h('div', { class: 'rowstack e3-chips' }), big = h('div', { class: 'e3-big' }), out = fNote(); let L = [N];
  const sp = n => { for (let p = 2; p * p <= n; p++) if (n % p === 0) return p; return 0; };
  const draw = () => { chips.innerHTML = ''; L.forEach((v, i) => { if (i) chips.append(h('span', { class: 'e3-op' }, '×')); const c = sp(v);
      const b = h('button', { class: 'e3-chip ia' + (c ? ' comp' : ' prime') }, String(v)); b.onclick = e => { e.stopPropagation(); if (!c) { sfx.no(); out.innerHTML = `${v} เป็นจำนวนเฉพาะ แยกต่อไม่ได้`; return; } L.splice(i, 1, c, v / c); L.sort((a, b2) => a - b2); sfx.pop(L.length); draw(); }; chips.append(b); });
    if (L.every(v => !sp(v))) { const cnt = {}; L.forEach(v => cnt[v] = (cnt[v] || 0) + 1); big.innerHTML = `${N} = ${Object.entries(cnt).map(([b, k]) => k > 1 ? e3P(+b, k) : b).join(' × ')}`; out.innerHTML = 'แยกจนเหลือแต่<b>จำนวนเฉพาะ</b>แล้ว → นับตัวที่ซ้ำกันเขียนเป็นเลขยกกำลัง ✓'; sfx.ok(); teachDone(wrap); } else big.innerHTML = `${N} = ${L.join(' × ')}`; };
  draw(); wrap.append(h('div', { class: 'cap' }, 'แตะจำนวนสีส้ม (ยังแยกตัวประกอบได้) จนเหลือแต่จำนวนเฉพาะ (สีเขียว)'), chips, big, out); return wrap;
}
/* หาค่า: คูณฐานทีละครั้ง ดูค่าโตขึ้น */
function e3StepSim(b, n) {
  const wrap = e3Wrap(), bars = h('div', { class: 'e3-bars' }), big = h('div', { class: 'e3-big' }), out = fNote(); let k = 1;
  const draw = () => { bars.innerHTML = Array.from({ length: k }, (_, i) => `<div class="e3-bar" style="--h:${Math.max(6, 100 * b ** (i + 1) / b ** n)}%"><b>${e3Fmt(b ** (i + 1))}</b><small>${e3P(b, i + 1)}</small></div>`).join(''); big.innerHTML = `${e3P(b, k)} = ${e3Rep(b, k)} = <b>${e3Fmt(b ** k)}</b>`; };
  const btn = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (k >= n) return; k++; sfx.pop(k); draw(); if (k === n) { btn.remove(); out.innerHTML = `${e3P(b, n)} = <b>${e3Fmt(b ** n)}</b> — คูณทีละตัวจากซ้ายไปขวา`; sfx.ok(); teachDone(wrap); } } }, `× ${b}`);
  draw(); wrap.append(h('div', { class: 'cap' }, `แตะ × ${b} จนได้ ${e3B(b)} คูณกัน ${n} ตัว`), bars, big, btn, out); return wrap;
}
/* ฐานลบกับวงเล็บ: แตะเลขชี้กำลังแต่ละค่า เทียบ (−2)ⁿ กับ −2ⁿ */
function e3SignSim() {
  const wrap = e3Wrap(), tbl = h('div', { class: 'e3-tbl' }), out = fNote(), seen = new Set();
  const row = h('div', { class: 'rowstack e3-chips' }, ...[1, 2, 3, 4, 5, 6].map(n => h('button', { class: 'btn ia e3-nb', onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(n); sfx.pop(n);
    tbl.append(h('div', { class: 'e3-tr ' + (n % 2 ? 'odd' : 'even'), html: `<span>${e3P(-2, n)} = ${e3Rep(-2, n)} = <b>${e3Fmt((-2) ** n)}</b></span><span>−${e3P(2, n)} = −(${e3Rep(2, n)}) = <b>${e3Fmt(-(2 ** n))}</b></span>` }));
    out.innerHTML = n % 2 ? `n = ${n} เป็น<b>จำนวนคี่</b> → ${e3P(-2, n)} เป็น<b>ลบ</b>` : `n = ${n} เป็น<b>จำนวนคู่</b> → ${e3P(-2, n)} เป็น<b>บวก</b> แต่ −${e3P(2, n)} ยังเป็นลบ`;
    if (seen.size === 6) { out.innerHTML += '<br>ฐานติดลบต้องมี<b>วงเล็บ</b> · ไม่มีวงเล็บ ฐานคือ 2 แล้วค่อยใส่เครื่องหมายลบ'; sfx.ok(); teachDone(wrap); } } }, `n = ${n}`)));
  wrap.append(h('div', { class: 'cap' }, 'แตะ n ทีละค่า เทียบ (−2)ⁿ กับ −2ⁿ'), row, tbl, out); return wrap;
}
/* กำลังคู่ได้บวก กำลังคี่ได้ลบ: แตะ n แล้วจับคู่ตัวลบทีละคู่ (ลบ × ลบ = บวก) ดูว่าเหลือตัวลบไหม */
function e3PairSim(b = -4) {
  const wrap = e3Wrap(), chips = h('div', { class: 'e3-pairs' }), res = h('div', { class: 'e3-big e3-pres' }), ev = h('div', { class: 'e3-rule even' }, h('b', null, 'เลขชี้กำลังคู่ → บวก')), od = h('div', { class: 'e3-rule odd' }, h('b', null, 'เลขชี้กำลังคี่ → ลบ')), out = fNote(), seen = new Set(), NS = [2, 3, 4, 5, 6];
  const show = n => { const k = n >> 1; let s = '';
    for (let i = 0; i < k; i++) s += `<span class="e3-pr" style="--d:${0.25 + i * 0.35}s"><span class="e3-f">${e3B(b)}</span><span class="e3-f">${e3B(b)}</span><i>+</i></span>`;
    if (n % 2) s += `<span class="e3-pr one" style="--d:${0.25 + k * 0.35}s"><span class="e3-f">${e3B(b)}</span><i>−</i></span>`;
    chips.innerHTML = s; const v = b ** n;
    res.innerHTML = `${e3P(b, n)} = <b class="${v < 0 ? 'neg' : 'pos'}">${e3Fmt(v)}</b>`;
    (n % 2 ? od : ev).append(h('span', { class: 'e3-rx', html: `${e3P(b, n)} = ${e3Fmt(v)}` }));
    out.innerHTML = n % 2 ? `n = ${n} เป็น<b>จำนวนคี่</b> — จับคู่ได้ ${k} คู่ แต่<b>เหลือตัวลบ 1 ตัว</b> → ผลเป็น<b>ลบ</b>` : `n = ${n} เป็น<b>จำนวนคู่</b> — จับคู่ได้ ${k} คู่พอดี ทุกคู่เป็นบวก → ผลเป็น<b>บวก</b>`; };
  const row = h('div', { class: 'rowstack e3-chips' }, ...NS.map(n => h('button', { class: 'btn ia e3-nb', onclick: e => { e.stopPropagation(); if (seen.has(n)) return; e.currentTarget.classList.add('on'); seen.add(n); show(n); sfx.pop(n);
    if (seen.size === NS.length) { out.innerHTML = 'ฐานเป็นจำนวนลบ: เลขชี้กำลัง<b>คู่</b> → ตัวลบจับคู่ได้หมด ผลเป็น<b>บวก</b>&emsp;เลขชี้กำลัง<b>คี่</b> → เหลือตัวลบ 1 ตัว ผลเป็น<b>ลบ</b>'; sfx.ok(); teachDone(wrap); } } }, `n = ${n}`)));
  wrap.append(h('div', { class: 'cap', html: `ลบ × ลบ = <b>บวก</b> — แตะ n ทีละค่า แล้วดูว่า ${e3B(b)} จับคู่กันได้หมดไหม` }), row, chips, res, h('div', { class: 'e3-rules' }, ev, od), out);
  chips.innerHTML = '<span class="e3-ph">แตะ n ด้านบน</span>'; return wrap;
}
/* ตัวอย่าง: ทายว่าผลเป็นบวกหรือลบ แล้วดูเหตุผล */
function e3SignEx(items) {
  const wrap = e3Wrap(), grid = h('div', { class: 'e3-exg' }), out = fNote(); let got = 0;
  items.forEach(([ex, v, why]) => { const box = h('div', { class: 'e3-exc' }), ans = h('div', { class: 'e3-exa' }), btns = h('div', { class: 'rowstack' });
    ['บวก', 'ลบ'].forEach(t => btns.append(h('button', { class: 'btn ia e3-sg ' + (t === 'บวก' ? 'p' : 'm'), onclick: e => { e.stopPropagation(); if (box.classList.contains('ok')) return; const right = (v > 0) === (t === 'บวก');
      if (!right) { sfx.no(); const b = e.currentTarget; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); out.innerHTML = 'ยังไม่ใช่ — ดูวงเล็บก่อน แล้วดูว่าเลขชี้กำลังเป็นคู่หรือคี่'; return; }
      box.classList.add('ok'); btns.remove(); ans.innerHTML = `${why}<br><b class="${v < 0 ? 'neg' : 'pos'}">= ${e3Fmt(v)}</b>`; got++; sfx.pop(got + 2); out.innerHTML = `ถูกต้อง ${got} จาก ${items.length} ข้อ`;
      if (got === items.length) { out.innerHTML = 'ครบแล้ว ✓ ดู<b>วงเล็บ</b>ก่อนเสมอ แล้วค่อยดูว่าเลขชี้กำลังเป็นคู่หรือคี่'; sfx.ok(); teachDone(wrap); } } }, t)));
    box.append(h('div', { class: 'e3-big', html: ex }), btns, ans); grid.append(box); });
  wrap.append(h('div', { class: 'cap' }, 'ค่าของแต่ละข้อเป็นบวกหรือลบ แตะคำตอบ'), grid, out); return wrap;
}
/* ฐานเป็นเศษส่วน: คูณด้วย ½ ซ้ำ — พื้นที่ที่ระบายเหลือครึ่งหนึ่งทุกครั้ง */
function e3HalfSim(max = 4) {
  const wrap = e3Wrap(), sq = h('div', { class: 'e3-sq' }), big = h('div', { class: 'e3-big' }), out = fNote(); let n = 0;
  const draw = () => { let s = '<svg viewBox="0 0 200 200"><rect width="200" height="200" fill="#fff" stroke="#2B2550" stroke-width="3"/>'; let x = 0, y = 0, w = 200, hh = 200;
    for (let i = 0; i < n; i++) { if (i % 2 === 0) w /= 2; else hh /= 2; }
    s += `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#3D9BE9" fill-opacity=".55" stroke="#2B2550" stroke-width="2"/></svg>`; sq.innerHTML = s;
    big.innerHTML = n === 0 ? 'เต็มรูป = 1' : `${e3PF(1, 2, n)} = ${Array(n).fill(fqHTML(1, 2)).join(' × ')} = ${fqHTML(1, 2 ** n)}`; };
  const btn = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (n >= max) return; n++; sfx.pop(n + 1); draw(); out.innerHTML = `คูณด้วย ½ ครั้งที่ ${n} → ส่วนที่ระบายเหลือ ${fqHTML(1, 2 ** n)} ของรูป`;
    if (n === max) { btn.remove(); out.innerHTML += '<br>ฐานเป็นเศษส่วน: <b>ยกกำลังทั้งตัวเศษและตัวส่วน</b> · ฐานน้อยกว่า 1 ยิ่งยกกำลังมาก ค่ายิ่งน้อยลง'; sfx.ok(); teachDone(wrap); } } }, 'คูณด้วย ½');
  draw(); wrap.append(h('div', { class: 'cap' }, `แตะ "คูณด้วย ½" ${max} ครั้ง`), h('div', { class: 'e3-row' }, sq, big), btn, out); return wrap;
}
/* คูณฐานเดียวกัน: กระจายเป็นการคูณซ้ำ แล้วแตะนับตัวประกอบทุกตัว */
function e3MulSim(list) {
  const wrap = e3Wrap(), stage = h('div', { class: 'colstack' }), out = fNote(); let k = 0;
  const show = () => { const [b, m, n] = list[k]; stage.innerHTML = ''; let cnt = 0; const tot = m + n;
    const top = h('div', { class: 'e3-big', html: `${e3P(b, m)} × ${e3P(b, n)} = ?` }), tiles = h('div', { class: 'rowstack e3-tiles' });
    for (let i = 0; i < tot; i++) { if (i === m) tiles.append(h('span', { class: 'e3-op' }, '×')); const t = h('button', { class: 'e3-tile ia ' + (i < m ? 'g1' : 'g2') }, e3B(b)); t.onclick = e => { e.stopPropagation(); if (t.dataset.n) return; cnt++; t.dataset.n = cnt; t.append(h('i', null, String(cnt))); sfx.pop(cnt % 8 + 1);
      if (cnt === tot) { top.innerHTML = `${e3P(b, m)} × ${e3P(b, n)} = ${e3P(b, `${m}+${n}`)} = ${e3P(b, tot)}`; out.innerHTML = `${e3B(b)} คูณกันทั้งหมด <b>${tot}</b> ตัว = ${m} + ${n} → <b>นำเลขชี้กำลังมาบวกกัน</b>`; sfx.ok(); k++;
        if (k < list.length) stage.append(h('button', { class: 'btn info ia', onclick: e2 => { e2.stopPropagation(); show(); } }, icon('right'), 'ตัวอย่างต่อไป')); else { out.innerHTML += '<br>สรุป: <b>aᵐ × aⁿ = aᵐ⁺ⁿ</b> (ฐานต้องเหมือนกัน)'; teachDone(wrap); } } }; tiles.append(t); }
    stage.append(top, h('div', { class: 'cap' }, `กระจายเป็นการคูณซ้ำแล้ว — แตะนับตัวประกอบทุกตัว (สีฟ้า ${m} ตัว · สีชมพู ${n} ตัว)`), tiles); out.innerHTML = ''; };
  show(); wrap.append(stage, out); return wrap;
}
/* หารฐานเดียวกัน: แตะตัวประกอบเพื่อตัดคู่บน-ล่าง */
function e3DivSim(list) {
  const wrap = e3Wrap(), stage = h('div', { class: 'colstack' }), out = fNote(); let k = 0;
  const show = () => { const [b, m, n] = list[k]; stage.innerHTML = ''; let cut = 0; const need = Math.min(m, n);
    const top = h('div', { class: 'e3-big', html: `${e3P(b, m)} ÷ ${e3P(b, n)} = ?` }), num = h('div', { class: 'rowstack e3-tiles' }), den = h('div', { class: 'rowstack e3-tiles' }), T = [], B = [];
    const mk = (arr, row, cls, cnt) => { for (let i = 0; i < cnt; i++) { if (i) row.append(h('span', { class: 'e3-op' }, '×')); const t = h('button', { class: 'e3-tile ia ' + cls }, e3B(b)); t.onclick = e => { e.stopPropagation(); if (t.classList.contains('cut') || cut >= need) return;
      const other = (arr === T ? B : T).find(x => !x.classList.contains('cut')); t.classList.add('cut'); other.classList.add('cut'); cut++; sfx.pop(cut + 1);
      if (cut === need) { const r = m - n; top.innerHTML = `${e3P(b, m)} ÷ ${e3P(b, n)} = ${r > 0 ? e3P(b, r) : r === 0 ? '<b>1</b>' : `${fqHTML(1, e3P(b, -r))} = ${e3P(b, e3SupN(r))}`}`;
        out.innerHTML = r > 0 ? `ตัดคู่กันได้ ${n} คู่ เหลือข้างบน ${r} ตัว → ${m} − ${n} = ${r}` : r === 0 ? `ตัดได้หมดทั้งบนและล่าง → เหลือ <b>1</b> (และ ${m} − ${n} = 0 จึงเขียนเป็น ${e3P(b, 0)} = 1)` : `ตัดได้ ${m} คู่ เหลือข้างล่าง ${-r} ตัว → ${fqHTML(1, e3P(b, -r))} ซึ่งเขียนเป็น ${e3P(b, e3SupN(r))} (${m} − ${n} = ${e3SupN(r)})`;
        sfx.ok(); k++; if (k < list.length) stage.append(h('button', { class: 'btn info ia', onclick: e2 => { e2.stopPropagation(); show(); } }, icon('right'), 'กรณีต่อไป')); else { out.innerHTML += '<br>สรุป: <b>aᵐ ÷ aⁿ = aᵐ⁻ⁿ</b> เมื่อ a ≠ 0'; teachDone(wrap); } } }; arr.push(t); row.append(t); } };
    mk(T, num, 'g1', m); mk(B, den, 'g2', n);
    stage.append(top, h('div', { class: 'cap' }, `แตะตัวประกอบเพื่อตัดคู่บน-ล่าง (ตัดได้ ${need} คู่)`), h('div', { class: 'e3-frac' }, num, h('div', { class: 'e3-fl' }), den)); out.innerHTML = ''; };
  show(); wrap.append(stage, out); return wrap;
}
/* กำลังศูนย์: ลดเลขชี้กำลังทีละ 1 = หารด้วย 2 */
function e3ZeroSim() {
  const wrap = e3Wrap(), tbl = h('div', { class: 'e3-tbl' }), out = fNote(); let n = 4;
  const add = () => tbl.append(h('div', { class: 'e3-tr' + (n === 0 ? ' zero' : ''), html: `<span>${e3P(2, n)}</span><span>= <b>${2 ** n}</b></span>` }));
  const btn = h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); if (n <= 0) return; n--; add(); sfx.pop(5 - n);
    out.innerHTML = `เลขชี้กำลังลดลง 1 → ค่า ÷ 2 → ${e3P(2, n)} = <b>${2 ** n}</b>`;
    if (n === 0) { btn.remove(); out.innerHTML = `${e3P(2, 1)} = 2 (ยกกำลัง 1 คือตัวมันเอง) และ ${e3P(2, 0)} = 2 ÷ 2 = <b>1</b><br>ทั่วไป: <b>a¹ = a</b> และ <b>a⁰ = 1</b> เมื่อ a ≠ 0 (0⁰ ไม่นิยาม)`; sfx.ok(); teachDone(wrap); } } }, 'เลขชี้กำลัง − 1 (÷ 2)');
  add(); wrap.append(h('div', { class: 'cap' }, 'แตะลดเลขชี้กำลังทีละ 1 แล้วดูค่าที่ได้'), tbl, btn, out); return wrap;
}
/* หาค่าที่ไม่ทราบ: แทนค่า x ทีละค่า */
function e3FindSim({ show, cands, val, target, msg }) {
  const wrap = e3Wrap(), list = h('div', { class: 'colstack e3-try' }), out = fNote(); let ok = false;
  const row = h('div', { class: 'rowstack e3-chips' }, ...cands.map(c => h('button', { class: 'btn ia e3-nb', onclick: e => { e.stopPropagation(); if (ok) return; const v = val(c), hit = v === target; e.currentTarget.classList.add(hit ? 'on' : 'no');
    list.append(h('div', { class: 'e3-tr ' + (hit ? 'even' : 'odd'), html: `x = ${c} → ${msg(c)} = <b>${e3Fmt(v)}</b> ${hit ? '✓' : '✗'}` })); sfx[hit ? 'ok' : 'no']();
    if (hit) { ok = true; out.innerHTML = `x = <b>${c}</b> ทำให้สมการเป็นจริง`; teachDone(wrap); } } }, `x = ${c}`)));
  wrap.append(h('div', { class: 'e3-big', html: show }), h('div', { class: 'cap' }, 'แตะค่าของ x ที่เป็นไปได้ทีละค่า'), row, list, out); return wrap;
}
/* กำลังของ 10: แตะทีละตัว ดูค่า */
function e3TenSim() {
  const wrap = e3Wrap(), out = fNote(), seen = new Set(), ks = [3, 2, 1, 0, -1, -2, -3];
  const row = h('div', { class: 'rowstack e3-chips' }, ...ks.map(k => h('button', { class: 'btn ia e3-nb', html: e3P(10, e3SupN(k)), onclick: e => { e.stopPropagation(); e.currentTarget.classList.add('on'); seen.add(k); sfx.pop(seen.size);
    out.innerHTML = k > 0 ? `${e3P(10, k)} = ${Array(k).fill(10).join(' × ')} = <b>${(10 ** k).toLocaleString('en-US')}</b> (มี 0 ${k} ตัว)` : k === 0 ? `${e3P(10, 0)} = <b>1</b>` : `${e3P(10, e3SupN(k))} = ${fqHTML(1, 10 ** -k)} = <b>${(10 ** k).toFixed(-k)}</b> (ทศนิยม ${-k} ตำแหน่ง)`;
    if (seen.size === ks.length) { out.innerHTML += '<br>เลขชี้กำลังของ 10 <b>บวก</b> = จำนวนมาก · <b>ลบ</b> = จำนวนน้อยกว่า 1'; sfx.ok(); teachDone(wrap); } } })));
  wrap.append(h('div', { class: 'cap' }, 'แตะกำลังของ 10 ทีละตัว'), row, out); return wrap;
}
/* เลื่อนจุดทศนิยมจนได้ 1 ≤ a < 10 แล้วเขียน a × 10ⁿ */
function e3DotSim(str) {
  const wrap = e3Wrap(), raw = str.replace(/,/g, ''), dp = raw.includes('.') ? raw.indexOf('.') : raw.length, digits = raw.replace('.', ''), big = h('div', { class: 'e3-big e3-dots' }), out = fNote(); let p = dp, done = false;
  const fmt = () => { if (p >= digits.length) return digits.replace(/^0+(?=\d)/, ''); let a = digits.slice(0, p) + '.' + digits.slice(p); a = a.replace(/^0+(?=\d)/, ''); if (a.includes('.')) a = a.replace(/\.?0+$/, ''); if (a.startsWith('.')) a = '0' + a; return a; };
  const draw = () => { const k = dp - p, a = fmt(), v = +a, ok = v >= 1 && v < 10;
    big.innerHTML = `<span class="e3-dig">${digits.split('').map((d, i) => (i === p ? '<b class="e3-pt">.</b>' : '') + `<i>${d}</i>`).join('') + (p === digits.length ? '<b class="e3-pt">.</b>' : '')}</span><span class="e3-eq">= ${a} × ${e3P(10, e3SupN(k))}</span>`;
    big.classList.toggle('ok', ok);
    out.innerHTML = `เลื่อนจุดไป${k > 0 ? 'ทางซ้าย' : k < 0 ? 'ทางขวา' : ''} ${Math.abs(k)} ตำแหน่ง → เลขชี้กำลัง <b>${e3SupN(k)}</b>` + (ok ? `<br>${a} อยู่ระหว่าง 1 ถึง 10 ✓ → <b>${raw.includes('.') ? str : (+raw).toLocaleString('en-US')} = ${a} × ${e3P(10, e3SupN(k))}</b>` : `<br>ตัวหน้ายังไม่อยู่ระหว่าง 1 ถึง 10 (ต้อง 1 ≤ a < 10)`);
    if (ok && !done) { done = true; sfx.ok(); teachDone(wrap); } };
  const L = h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); if (p > 1) { p--; sfx.tap(); draw(); } } }, '◀ เลื่อนจุดไปซ้าย'), R = h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); if (p < digits.length) { p++; sfx.tap(); draw(); } } }, 'เลื่อนจุดไปขวา ▶');
  draw(); wrap.append(h('div', { class: 'cap' }, `เลื่อนจุดทศนิยมจนตัวหน้าอยู่ระหว่าง 1 ถึง 10`), big, h('div', { class: 'rowstack' }, L, R), out); return wrap;
}

/* ---------- ตัวสร้างข้อ ---------- */
const E3Q = {
  /* การคูณซ้ำ → เลขยกกำลัง */
  rep2pow: () => { const b = e3Pick([3, 5, 7, -2, -4]), n = e3R(3, 6); return Q.e3O({ q: 'เขียนการคูณซ้ำต่อไปนี้ในรูปเลขยกกำลัง', expr: e3Rep(b, n), opts: [e3P(b, n), e3P(n, Math.abs(b)), `${e3B(b)} × ${n}`, e3P(b, n + 1)], right: e3P(b, n), hint: 'ฐาน = จำนวนที่คูณซ้ำ · เลขชี้กำลัง = จำนวนตัว', sig: `r2p ${b}${n}`, base: 'e3r2p', diff: 10 }); },
  pow2rep: () => { const b = e3Pick([4, 6, 9]), n = e3R(3, 5); return Q.e3O({ q: 'เลขยกกำลังนี้หมายถึงข้อใด', expr: e3P(b, n), opts: [e3Rep(b, n), `${b} × ${n}`, e3Rep(n, b), `${b} + ${b} + ${b}`], right: e3Rep(b, n), hint: 'นำฐานมาคูณกันตามจำนวนเลขชี้กำลัง ไม่ใช่ฐาน × เลขชี้กำลัง', sig: `p2r ${b}${n}`, base: 'e3p2r', diff: 10 }); },
  count: () => { const b = e3Pick([6, 8, 11]), n = e3R(5, 9); return Q.e3N({ q: 'มีการนำฐานมาคูณกันกี่ตัว', expr: e3P(b, n), a: n, unit: 'ตัว', hint: 'ดูเลขชี้กำลัง', sig: `cnt ${b}${n}`, base: 'e3cnt', diff: 8 }); },
  read: () => { const [ex, r, w] = e3Pick([[e3P(5, 3), 'ห้ายกกำลังสาม', ['สามยกกำลังห้า', 'ห้าคูณสาม']], [e3P(-2, 4), 'ลบสองทั้งหมดยกกำลังสี่', ['ลบของสองยกกำลังสี่', 'สี่ยกกำลังลบสอง']], [`−${e3P(2, 4)}`, 'ลบของสองยกกำลังสี่', ['ลบสองทั้งหมดยกกำลังสี่', 'สองยกกำลังลบสี่']]]); return Q.e3O({ q: 'อ่านเลขยกกำลังนี้อย่างไร', expr: ex, opts: [r, ...w], right: r, hint: 'อ่านฐานก่อน แล้วตามด้วย "ยกกำลัง" และเลขชี้กำลัง · มีวงเล็บอ่านว่า "ทั้งหมด"', sig: 'read ' + r, base: 'e3read', diff: 12 }); },
  /* ฐาน / เลขชี้กำลัง */
  base: () => { const [ex, b] = e3Pick([[e3P(7, 5), 7], [e3P(-3, 4), -3], [`−${e3P(3, 4)}`, 3], [e3P(12, 2), 12], [e3P(-5, 3), -5]]); return Q.e3N({ q: '<b>ฐาน</b>ของเลขยกกำลังนี้คือจำนวนใด', expr: ex, a: b, hint: 'ฐานคือจำนวนที่อยู่ใต้เลขชี้กำลัง · ถ้าไม่มีวงเล็บ เครื่องหมายลบไม่ได้อยู่ในฐาน', sig: 'base ' + ex, base: 'e3base', diff: 10 }); },
  exp: () => { const b = e3Pick([2, 9, -4]), n = e3R(5, 12); return Q.e3N({ q: '<b>เลขชี้กำลัง</b>ของเลขยกกำลังนี้คือจำนวนใด', expr: e3P(b, n), a: n, hint: 'เลขชี้กำลังคือตัวเลขตัวเล็กมุมขวาบน', sig: `exp ${b}${n}`, base: 'e3exp', diff: 8 }); },
  /* เขียนจำนวนในรูปเลขยกกำลัง */
  toExp: () => { const [b, n] = e3Pick([[2, 5], [3, 4], [2, 6], [5, 3], [3, 5], [7, 2]]); return Q.e3N({ q: 'เติมเลขชี้กำลังให้ถูกต้อง', expr: `${(b ** n).toLocaleString('en-US')} = ${e3P(b, '□')}`, a: n, hint: `นำ ${b} มาคูณกันไปเรื่อย ๆ จนได้ ${b ** n}`, sig: `toe ${b}${n}`, base: 'e3toe', diff: 18 }); },
  toBase: () => { const [b, n] = e3Pick([[4, 3], [5, 3], [6, 2], [10, 4], [9, 2], [2, 7]]); return Q.e3N({ q: 'เติมฐานให้ถูกต้อง', expr: `${(b ** n).toLocaleString('en-US')} = ${e3P('□', n)}`, a: b, hint: `หาจำนวนที่คูณกัน ${n} ตัวแล้วได้ ${b ** n}`, sig: `tob ${b}${n}`, base: 'e3tob', diff: 20 }); },
  many: () => { const [N, r, w] = e3Pick([[64, [e3P(2, 6), e3P(4, 3), e3P(8, 2)], [e3P(6, 4), e3P(2, 8), e3P(4, 4)]], [81, [e3P(3, 4), e3P(9, 2)], [e3P(3, 3), e3P(4, 3), e3P(9, 3)]], [16, [e3P(2, 4), e3P(4, 2)], [e3P(8, 2), e3P(2, 8), e3P(4, 4)]]]); const right = r[e3R(0, r.length - 1)];
    return Q.e3O({ q: `ข้อใดมีค่าเท่ากับ ${N}`, opts: [right, ...w], right, hint: 'หาค่าของแต่ละตัวเลือก', sig: 'many ' + N, base: 'e3many', diff: 24 }); },
  prime: () => { const [N, a, b] = e3Pick([[72, 3, 2], [200, 3, 2], [108, 2, 3], [45, 0, 2], [24, 3, 1]]), P = { 72: [2, 3], 200: [2, 5], 108: [2, 3], 45: [3, 5], 24: [2, 3] }[N], E = { 72: [3, 2], 200: [3, 2], 108: [2, 3], 45: [2, 1], 24: [3, 1] }[N];
    return Q.e3N({ q: `${N} = ${e3P(P[0], '□')} × ${E[1] > 1 ? e3P(P[1], E[1]) : P[1]} — เติมเลขชี้กำลัง`, a: E[0], hint: `แยกตัวประกอบของ ${N} เป็นจำนวนเฉพาะ แล้วนับจำนวน ${P[0]}`, sig: 'prime ' + N, base: 'e3prime', diff: 30 }); },
  /* หาค่า */
  value: (lo = 2, hi = 5) => { const [b, n] = e3Pick([[2, 5], [3, 4], [4, 3], [10, 4], [5, 3], [2, 6], [6, 3], [3, 5]].filter(([, n2]) => n2 >= lo && n2 <= hi + 1)); return Q.e3N({ q: 'หาค่าของเลขยกกำลัง', expr: e3P(b, n), a: b ** n, hint: `${e3Rep(b, n)}`, sig: `val ${b}${n}`, base: 'e3val', diff: 12 + n * 2 }); },
  cmp: () => { const [x, y] = e3Pick([[[2, 5], [5, 2]], [[3, 4], [4, 3]], [[2, 6], [6, 2]], [[10, 2], [2, 10]], [[3, 3], [5, 2]]]), vx = x[0] ** x[1], vy = y[0] ** y[1], r = vx > vy ? '>' : vx < vy ? '<' : '=';
    return Q.e3O({ q: 'เปรียบเทียบค่า เลือกเครื่องหมายที่ถูกต้อง', expr: `${e3P(...x)} ◯ ${e3P(...y)}`, opts: ['>', '<', '='], right: r, hint: `หาค่าทั้งสองก่อน: ${vx} กับ ${vy}`, sig: 'cmp ' + x + y, base: 'e3cmp', diff: 22 }); },
  /* ฐานลบและวงเล็บ */
  neg: () => { const [ex, v] = e3Pick([[e3P(-2, 3), -8], [e3P(-3, 2), 9], [`−${e3P(3, 2)}`, -9], [e3P(-2, 4), 16], [`−${e3P(2, 4)}`, -16], [e3P(-1, 7), -1], [e3P(-5, 2), 25], [`−${e3P(-2, 3)}`, 8], [e3P(-10, 3), -1000]]); return Q.e3N({ q: 'หาค่า', expr: ex, a: v, hint: 'มีวงเล็บ: ลบอยู่ในฐาน (เลขชี้กำลังคู่ได้บวก คี่ได้ลบ) · ไม่มีวงเล็บ: ยกกำลังก่อนแล้วใส่ลบ', sig: 'neg ' + ex, base: 'e3neg', diff: 26 }); },
  sign: () => { const b = e3Pick([-3, -7, -12]), n = e3R(5, 12); return Q.e3O({ q: 'ค่าของเลขยกกำลังนี้เป็นจำนวนบวกหรือจำนวนลบ', expr: e3P(b, n), opts: ['จำนวนบวก', 'จำนวนลบ', 'ศูนย์'], right: n % 2 ? 'จำนวนลบ' : 'จำนวนบวก', hint: 'ฐานลบ: เลขชี้กำลังคู่ = บวก · คี่ = ลบ', sig: `sign ${b}${n}`, base: 'e3sign', diff: 18 }); },
  /* ฐานเศษส่วน / ทศนิยม */
  frac: () => { const [n, d, e, neg] = e3Pick([[2, 3, 2, 0], [1, 2, 3, 0], [3, 4, 2, 0], [1, 3, 3, 1], [2, 5, 2, 1], [1, 2, 4, 1]]), num = n ** e, den = d ** e, s = neg && e % 2 ? '−' : '';
    return Q.e3N({ q: 'หาค่า (ตอบเป็นเศษส่วน กด / ระหว่างตัวเศษกับตัวส่วน)', expr: e3PF(n, d, e, neg), a: `${s}${num}/${den}`, hint: `ยกกำลังทั้งตัวเศษและตัวส่วน: ${n}${'⁰¹²³⁴'[e]} ÷ ${d}${'⁰¹²³⁴'[e]}${neg ? ' · ฐานลบ ดูว่าเลขชี้กำลังคู่หรือคี่' : ''}`, sig: `frac ${n}${d}${e}${neg}`, base: 'e3frac', diff: 30 }); },
  dec: () => { const [b, e] = e3Pick([[0.3, 2], [0.2, 3], [1.2, 2], [0.5, 2], [0.1, 4], [-0.2, 2], [-0.3, 3]]), v = Math.round(b ** e * 1e8) / 1e8; return Q.e3N({ q: 'หาค่า', expr: e3P(b, e), a: String(v), /* v247: ส่งเป็นข้อความ — miN ปัดเหลือ 3 ตำแหน่ง ทำให้เฉลย 0.0001 แสดงเป็น 0 */ hint: 'คูณเหมือนจำนวนนับ แล้วนับตำแหน่งทศนิยมรวมกัน', sig: `dec ${b}${e}`, base: 'e3dec', diff: 28 }); },
  /* คูณ / หาร ฐานเดียวกัน */
  mulE: () => { const b = e3Pick([2, 3, 5, 7, -2, -3]), m = e3R(2, 7), n = e3R(2, 6); return Q.e3N({ q: 'เติมเลขชี้กำลัง', expr: `${e3P(b, m)} × ${e3P(b, n)} = ${e3P(b, '□')}`, a: m + n, hint: 'ฐานเดียวกันคูณกัน → นำเลขชี้กำลังมาบวกกัน', sig: `mul ${b}${m}${n}`, base: 'e3mul', diff: 20 }); },
  mul3: () => { const b = e3Pick([2, 5, 10]), m = e3R(2, 4), n = e3R(1, 3), k = e3R(2, 5); return Q.e3N({ q: 'เติมเลขชี้กำลัง', expr: `${e3P(b, m)} × ${n === 1 ? b : e3P(b, n)} × ${e3P(b, k)} = ${e3P(b, '□')}`, a: m + n + k, hint: `${b} ที่ไม่มีเลขชี้กำลัง คือ ${e3P(b, 1)}`, sig: `mul3 ${b}${m}${n}${k}`, base: 'e3mul3', diff: 26 }); },
  divE: () => { const b = e3Pick([2, 3, 5, 10, -4]), n = e3R(2, 5), m = n + e3R(1, 5); return Q.e3N({ q: 'เติมเลขชี้กำลัง', expr: `${e3P(b, m)} ÷ ${e3P(b, n)} = ${e3P(b, '□')}`, a: m - n, hint: 'ฐานเดียวกันหารกัน → นำเลขชี้กำลังมาลบกัน (ตัวตั้ง − ตัวหาร)', sig: `div ${b}${m}${n}`, base: 'e3div', diff: 22 }); },
  divNeg: () => { const b = e3Pick([2, 3, 5]), m = e3R(2, 4), n = m + e3R(1, 4); return Q.e3N({ q: 'เติมเลขชี้กำลัง (อาจเป็นจำนวนลบ กด − ก่อน)', expr: `${e3P(b, m)} ÷ ${e3P(b, n)} = ${e3P(b, '□')}`, a: m - n, hint: `${m} − ${n} = ${m - n}`, sig: `divn ${b}${m}${n}`, base: 'e3divn', diff: 34 }); },
  divVal: () => { const b = e3Pick([2, 3, 5]), n = e3R(2, 5), r = e3R(1, 3), m = n + r; return Q.e3N({ q: 'หาค่า', expr: `${e3P(b, m)} ÷ ${e3P(b, n)}`, a: b ** r, hint: `${e3P(b, m - n)} แล้วหาค่า`, sig: `divv ${b}${m}${n}`, base: 'e3divv', diff: 26 }); },
  sameBase: () => { const ok = `${e3P(3, 4)} × ${e3P(3, 2)} = ${e3P(3, 6)}`; return Q.e3O({ q: 'ข้อใด<b>ถูกต้อง</b>', opts: [ok, `${e3P(2, 3)} × ${e3P(3, 2)} = ${e3P(6, 5)}`, `${e3P(3, 4)} × ${e3P(3, 2)} = ${e3P(9, 6)}`, `${e3P(3, 4)} × ${e3P(3, 2)} = ${e3P(3, 8)}`], right: ok, hint: 'บวกเลขชี้กำลังได้เมื่อฐานเหมือนกัน และฐานยังคงเดิม', sig: 'same', base: 'e3same', diff: 30 }); },
  /* ศูนย์ / หนึ่ง */
  zero: () => { const [ex, v] = e3Pick([[e3P(7, 0), 1], [e3P(-5, 0), 1], [`−${e3P(5, 0)}`, -1], [e3P(13, 1), 13], [e3PF(2, 3, 0), 1], [`${e3P(4, 0)} + ${e3P(4, 1)}`, 5], [`3 × ${e3P(8, 0)}`, 3], [e3P(-9, 1), -9]]); return Q.e3N({ q: 'หาค่า', expr: ex, a: v, hint: 'a⁰ = 1 (a ≠ 0) · a¹ = a · ไม่มีวงเล็บ เครื่องหมายลบอยู่นอกฐาน', sig: 'zero ' + ex, base: 'e3zero', diff: 16 }); },
  /* คูณหารร่วม */
  mix: () => { const b = e3Pick([2, 3, 5]), m = e3R(2, 5), n = e3R(2, 4), k = e3R(2, m + n - 1); return Q.e3N({ q: 'เติมเลขชี้กำลัง', expr: `(${e3P(b, m)} × ${e3P(b, n)}) ÷ ${e3P(b, k)} = ${e3P(b, '□')}`, a: m + n - k, hint: `${m} + ${n} − ${k}`, sig: `mix ${b}${m}${n}${k}`, base: 'e3mix', diff: 34 }); },
  mixVal: () => { const b = e3Pick([2, 3]), m = e3R(3, 5), n = e3R(2, 4), r = e3R(1, 3), k = m + n - r; return Q.e3N({ q: 'หาค่า', expr: `${e3P(b, m)} × ${e3P(b, n)} ÷ ${e3P(b, k)}`, a: b ** r, hint: `จัดเป็น ${e3P(b, `${m}+${n}−${k}`)} แล้วหาค่า`, sig: `mixv ${b}${m}${n}${k}`, base: 'e3mixv', diff: 38 }); },
  powPow: () => { const b = e3Pick([2, 3, 5]), m = e3R(2, 4), n = e3R(2, 3); return Q.e3N({ q: 'เติมเลขชี้กำลัง', expr: `<span class="e3p">(${e3P(b, m)})<sup>${n}</sup></span> = ${e3P(b, '□')}`, a: m * n, hint: `<span class="e3p">(${e3P(b, m)})<sup>${n}</sup></span> = ${Array(n).fill(e3P(b, m)).join(' × ')} → ${Array(n).fill(m).join(' + ')}`, sig: `pp ${b}${m}${n}`, base: 'e3pp', diff: 36 }); },
  convB: () => { const [ex, a, hnt] = e3Pick([[`${e3P(4, 3)} = ${e3P(2, '□')}`, 6, '4 = 2² จึงได้ (2²)³'], [`${e3P(9, 2)} = ${e3P(3, '□')}`, 4, '9 = 3²'], [`${e3P(8, 2)} = ${e3P(2, '□')}`, 6, '8 = 2³'], [`${e3P(25, 3)} = ${e3P(5, '□')}`, 6, '25 = 5²']]); return Q.e3N({ q: 'จัดให้มีฐานเดียวกัน แล้วเติมเลขชี้กำลัง', expr: ex, a, hint: hnt, sig: 'conv ' + ex, base: 'e3conv', diff: 36 }); },
  /* โจทย์หลายขั้นตอน */
  findX: () => { const b = e3Pick([2, 3, 5]), k = e3R(2, 4), x = e3R(2, 6), op = e3Pick(['×', '÷']); const rhs = op === '×' ? x + k : x - k;
    if (op === '÷' && rhs < 1) return Q.e3N({ q: 'หาค่า x', expr: `${e3P(b, 'x')} × ${e3P(b, k)} = ${e3P(b, x + k)}`, a: x, hint: `x + ${k} = ${x + k}`, sig: `fx ${b}${k}${x}×`, base: 'e3fx', diff: 40 });
    return Q.e3N({ q: 'หาค่า x', expr: `${e3P(b, 'x')} ${op} ${e3P(b, k)} = ${e3P(b, rhs)}`, a: x, hint: op === '×' ? `x + ${k} = ${rhs}` : `x − ${k} = ${rhs}`, sig: `fx ${b}${k}${x}${op}`, base: 'e3fx', diff: 40 }); },
  findXv: () => { const [ex, a] = e3Pick([[`${e3P(2, 'x')} = 32`, 5], [`${e3P(3, 'x')} = 81`, 4], [`${e3P(5, 'x')} = 125`, 3], [`${e3P(10, 'x')} = 10,000`, 4], [`${e3P(2, 'x')} × 2 = 64`, 5]]); return Q.e3N({ q: 'หาค่า x', expr: ex, a, hint: 'เขียนจำนวนทางขวาให้เป็นเลขยกกำลังที่มีฐานเดียวกัน', sig: 'fxv ' + a + ex.length, base: 'e3fxv', diff: 38 }); },
  grow: () => { const s = e3Pick([2, 3, 5]), hrs = e3R(3, 6); return Q.e3N({ q: `แบคทีเรียชนิดหนึ่ง (สถานการณ์สมมติ) เพิ่มจำนวนเป็น 2 เท่าทุก 1 ชั่วโมง ถ้าตอนแรกมี ${s} ตัว เมื่อผ่านไป ${hrs} ชั่วโมงจะมีกี่ตัว`, a: s * 2 ** hrs, unit: 'ตัว', hint: `${s} × ${e3P(2, hrs)}`, sig: `grow ${s}${hrs}`, base: 'e3grow', diff: 44 }); },
  cmpConv: () => { const [x, y, r] = e3Pick([[e3P(4, 3), e3P(2, 5), '>'], [e3P(8, 2), e3P(2, 7), '<'], [e3P(9, 2), e3P(3, 4), '='], [e3P(27, 2), e3P(3, 5), '>']]); return Q.e3O({ q: 'เปรียบเทียบโดยจัดให้มีฐานเดียวกัน', expr: `${x} ◯ ${y}`, opts: ['>', '<', '='], right: r, hint: 'เขียนฐานใหญ่เป็นเลขยกกำลังของฐานเล็ก แล้วเทียบเลขชี้กำลัง', sig: 'cc ' + x + y, base: 'e3cc', diff: 42 }); },
  /* สัญกรณ์วิทยาศาสตร์ */
  isSci: () => { const right = e3Pick([`3.5 × ${e3P(10, 4)}`, `7.02 × ${e3P(10, e3SupN(-3))}`, `1.8 × ${e3P(10, 6)}`]); return Q.e3O({ q: 'ข้อใดเขียนอยู่ใน<b>รูปสัญกรณ์วิทยาศาสตร์</b>', opts: [right, `35 × ${e3P(10, 3)}`, `0.35 × ${e3P(10, 5)}`, `3.5 × ${e3P(100, 2)}`], right, hint: 'a × 10ⁿ โดย 1 ≤ a < 10 และฐานต้องเป็น 10', sig: 'isSci ' + right, base: 'e3is', diff: 24 }); },
  tenPow: () => { const k = e3Pick([3, 5, 6, -2, -3, -4]); return k > 0 ? Q.e3N({ q: 'หาค่า', expr: e3P(10, k), a: 10 ** k, hint: `มี 0 ตามหลัง 1 จำนวน ${k} ตัว`, sig: 'ten ' + k, base: 'e3ten', diff: 14 }) : Q.e3N({ q: 'หาค่า (ตอบเป็นทศนิยม)', expr: e3P(10, e3SupN(k)), a: 10 ** k, hint: `${fqHTML(1, 10 ** -k)} = ทศนิยม ${-k} ตำแหน่ง`, sig: 'ten ' + k, base: 'e3ten', diff: 20 }); },
  bigExp: () => { const [s, a, n] = e3Pick([['45,000', 4.5, 4], ['3,200,000', 3.2, 6], ['780,000', 7.8, 5], ['150,000,000', 1.5, 8], ['6,020', 6.02, 3]]); return Q.e3N({ q: 'เขียนในรูปสัญกรณ์วิทยาศาสตร์ เติมเลขชี้กำลัง', expr: `${s} = ${a} × ${e3P(10, '□')}`, a: n, hint: 'นับว่าเลื่อนจุดทศนิยมไปทางซ้ายกี่ตำแหน่ง', sig: 'be ' + s, base: 'e3be', diff: 26 }); },
  bigA: () => { const [s, a, n] = e3Pick([['52,000', 5.2, 4], ['9,100,000', 9.1, 6], ['360,000', 3.6, 5], ['2,450,000', 2.45, 6]]); return Q.e3N({ q: 'เขียนในรูปสัญกรณ์วิทยาศาสตร์ เติมจำนวนหน้า × 10', expr: `${s} = □ × ${e3P(10, n)}`, a, hint: 'จำนวนหน้าต้องมากกว่าหรือเท่ากับ 1 แต่น้อยกว่า 10', sig: 'ba ' + s, base: 'e3ba', diff: 24 }); },
  smallExp: () => { const [s, a, n] = e3Pick([['0.00032', 3.2, -4], ['0.0045', 4.5, -3], ['0.000008', 8, -6], ['0.071', 7.1, -2], ['0.00000125', 1.25, -6]]); return Q.e3N({ q: 'เขียนในรูปสัญกรณ์วิทยาศาสตร์ เติมเลขชี้กำลัง (จำนวนลบ กด − ก่อน)', expr: `${s} = ${a} × ${e3P(10, '□')}`, a: n, hint: 'เลื่อนจุดไปทางขวากี่ตำแหน่ง เลขชี้กำลังเป็นลบเท่านั้น', sig: 'se ' + s, base: 'e3se', diff: 32 }); },
  sciPick: () => { const [s, r, w] = e3Pick([['0.0006', `6 × ${e3P(10, e3SupN(-4))}`, [`6 × ${e3P(10, 4)}`, `6 × ${e3P(10, e3SupN(-3))}`, `0.6 × ${e3P(10, e3SupN(-3))}`]], ['84,000', `8.4 × ${e3P(10, 4)}`, [`8.4 × ${e3P(10, 3)}`, `84 × ${e3P(10, 3)}`, `8.4 × ${e3P(10, e3SupN(-4))}`]], ['0.0102', `1.02 × ${e3P(10, e3SupN(-2))}`, [`1.02 × ${e3P(10, 2)}`, `10.2 × ${e3P(10, e3SupN(-3))}`, `1.02 × ${e3P(10, e3SupN(-3))}`]]]);
    return Q.e3O({ q: `${s} เขียนในรูปสัญกรณ์วิทยาศาสตร์ได้ตามข้อใด`, opts: [r, ...w], right: r, hint: 'เลื่อนจุดจนได้ 1 ≤ a < 10 · ซ้าย = เลขชี้กำลังบวก · ขวา = ลบ', sig: 'sp ' + s, base: 'e3sp', diff: 30 }); },
  back: () => { const [ex, v] = e3Pick([[`2.5 × ${e3P(10, 3)}`, 2500], [`7.04 × ${e3P(10, 5)}`, 704000], [`3 × ${e3P(10, e3SupN(-2))}`, 0.03], [`4.6 × ${e3P(10, e3SupN(-3))}`, 0.0046], [`1.2 × ${e3P(10, 6)}`, 1200000]]); return Q.e3N({ q: 'เขียนเป็นจำนวนปกติ', expr: ex, a: v, hint: 'เลขชี้กำลังบวก เลื่อนจุดไปขวา · ลบ เลื่อนจุดไปซ้าย', sig: 'back ' + v, base: 'e3back', diff: 30 }); },
  sciMul: () => { const [a, m, b, n, ra, rn] = e3Pick([[3, 4, 2, 3, 6, 7], [2, 5, 4, 2, 8, 7], [5, 3, 3, 4, 1.5, 8], [4, 6, 2, -2, 8, 4]]); return Q.e3N({ q: 'หาผลคูณ ให้อยู่ในรูปสัญกรณ์วิทยาศาสตร์ เติมเลขชี้กำลัง', expr: `(${a} × ${e3P(10, e3SupN(m))}) × (${b} × ${e3P(10, e3SupN(n))}) = ${ra} × ${e3P(10, '□')}`, a: rn, hint: `${a} × ${b} = ${a * b}${a * b >= 10 ? ` = ${a * b / 10} × 10 (เลขชี้กำลังเพิ่มอีก 1)` : ''} · ${e3SupN(m)} + ${e3SupN(n)}`, sig: `sm ${a}${m}${b}${n}`, base: 'e3sm', diff: 44 }); },
  sciDiv: () => { const [a, m, b, n, ra, rn] = e3Pick([[8, 6, 2, 2, 4, 4], [9, 5, 3, 3, 3, 2], [6, 4, 3, 7, 2, -3], [2, 5, 4, 2, 5, 2]]); return Q.e3N({ q: 'หาผลหาร ให้อยู่ในรูปสัญกรณ์วิทยาศาสตร์ เติมเลขชี้กำลัง', expr: `(${a} × ${e3P(10, m)}) ÷ (${b} × ${e3P(10, n)}) = ${ra} × ${e3P(10, '□')}`, a: rn, hint: `${a} ÷ ${b} = ${a / b}${a / b < 1 ? ` = ${a / b * 10} × ${e3P(10, e3SupN(-1))}` : ''} · ${m} − ${n}`, sig: `sd ${a}${m}${b}${n}`, base: 'e3sd', diff: 46 }); },
  sciCmp: () => { const [x, y, r] = e3Pick([[`3.2 × ${e3P(10, 5)}`, `9.8 × ${e3P(10, 4)}`, '>'], [`5 × ${e3P(10, e3SupN(-3))}`, `2 × ${e3P(10, e3SupN(-2))}`, '<'], [`1.5 × ${e3P(10, 6)}`, `15 × ${e3P(10, 5)}`, '=']]); return Q.e3O({ q: 'เปรียบเทียบ เลือกเครื่องหมายที่ถูกต้อง', expr: `${x} ◯ ${y}`, opts: ['>', '<', '='], right: r, hint: 'ดูเลขชี้กำลังของ 10 ก่อน ถ้าเท่ากันจึงเทียบจำนวนหน้า', sig: 'scmp ' + x, base: 'e3scmp', diff: 34 }); },
  fix: () => { const [ex, a, n] = e3Pick([[`25 × ${e3P(10, 3)}`, 2.5, 4], [`0.8 × ${e3P(10, 6)}`, 8, 5], [`340 × ${e3P(10, 2)}`, 3.4, 4], [`0.05 × ${e3P(10, 7)}`, 5, 5]]); return Q.e3N({ q: `ปรับ ${ex} ให้อยู่ในรูปสัญกรณ์วิทยาศาสตร์ ${a} × 10<sup>□</sup> เติมเลขชี้กำลัง`, a: n, hint: 'จำนวนหน้าเล็กลง 10 เท่า เลขชี้กำลังเพิ่ม 1 · จำนวนหน้าใหญ่ขึ้น 10 เท่า เลขชี้กำลังลด 1', sig: 'fix ' + ex, base: 'e3fix', diff: 40 }); },
  sciStory: () => { const [q, a] = e3Pick([['ระยะทางจากโลกถึงดวงอาทิตย์ประมาณ 150,000,000 กิโลเมตร เขียนเป็น 1.5 × 10<sup>□</sup> กิโลเมตร เติมเลขชี้กำลัง', 8], ['ขนาดของเซลล์ชนิดหนึ่งประมาณ 0.00002 เมตร เขียนเป็น 2 × 10<sup>□</sup> เมตร เติมเลขชี้กำลัง', -5], ['ฝุ่นละอองขนาด 0.0000025 เมตร เขียนเป็น 2.5 × 10<sup>□</sup> เมตร เติมเลขชี้กำลัง', -6]]); return Q.e3N({ q, a, hint: 'จำนวนมาก → เลขชี้กำลังบวก · จำนวนน้อยกว่า 1 → เลขชี้กำลังลบ', sig: 'story ' + a, base: 'e3story', diff: 42 }); }
};

/* =========================================================
   v247 (ผู้ใช้ขอ: "ลำน้ำยกกำลัง ทำให้เกมยากขึ้น") — ข้อท้าทายของแต่ละด่าน: ฐานลบ/เศษส่วน เลขชี้กำลังใหญ่ขึ้น
   เปลี่ยนฐานก่อนใช้สมบัติ หลายขั้นตอน และตัวเลือกที่เป็นข้อผิดพลาดที่เด็กมักทำ · เกมยังเรียงง่าย → ยาก (ข้อง่ายเหลือเป็นข้ออุ่นเครื่อง)
   ========================================================= */
const e3Ng = n => (n < 0 ? '−' + (-n).toLocaleString('en-US') : n.toLocaleString('en-US'));
const E3H = {
  /* 1 คูณซ้ำ */
  repNeg: () => { const b = e3Pick([-3, -5, -2]), n = e3R(4, 6), r = e3P(b, n); return Q.e3O({ q: 'เขียนการคูณซ้ำต่อไปนี้ในรูปเลขยกกำลัง', expr: e3Rep(b, n), opts: [r, `−${e3P(-b, n)}`, `${e3B(b)} × ${n}`, e3P(n, b)], right: r, hint: 'ฐานติดลบต้องอยู่ในวงเล็บ', sig: `h-rn ${b}${n}`, base: 'e3hrn', diff: 32 }); },
  repFrac: () => { const [a, b] = e3Pick([[1, 2], [2, 3], [3, 4]]), n = e3R(3, 5), r = e3PF(a, b, n); return Q.e3O({ q: 'เขียนการคูณซ้ำต่อไปนี้ในรูปเลขยกกำลัง', expr: Array(n).fill(fqHTML(a, b)).join(' × '), opts: [r, `${fqHTML(e3P(a, n), b)}`, `${fqHTML(a, e3P(b, n))}`, e3PF(a, b, n + 1)], right: r, hint: 'เศษส่วนทั้งตัวเป็นฐาน ต้องใส่วงเล็บ', sig: `h-rf ${a}${b}${n}`, base: 'e3hrf', diff: 34 }); },
  repMix: () => { const m = e3R(2, 4), n = e3R(2, 4), r = `${e3P(2, m)} × ${e3P(3, n)}`; return Q.e3O({ q: 'เขียนในรูปเลขยกกำลัง', expr: `${Array(m).fill(2).join(' × ')} × ${Array(n).fill(3).join(' × ')}`, opts: [r, e3P(6, m + n), e3P(5, m + n), `${e3P(2, n)} × ${e3P(3, m)}`], right: r, hint: 'จำนวนต่างกัน แยกเขียนคนละฐาน', sig: `h-rm ${m}${n}`, base: 'e3hrm', diff: 36 }); },
  negVal: () => { const [b, n] = e3Pick([[-2, 5], [-3, 4], [-2, 6], [-3, 3], [-4, 3]]); return Q.e3N({ q: `นำ ${e3Ng(b)} มาคูณกัน ${n} ตัว ได้ค่าเท่าใด`, a: b ** n, hint: 'นับจำนวนตัวที่ติดลบ: คู่ = บวก คี่ = ลบ', sig: `h-nv ${b}${n}`, base: 'e3hnv', diff: 38 }); },
  /* 2 ฐาน เลขชี้กำลัง */
  baseHard: () => { const [ex, a] = e3Pick([[`−${e3P(-2, 3)}`, -2], [e3PF(2, 3, 4, 1), '−2/3'], [`−${e3PF(1, 4, 2)}`, '1/4'], [`${e3P(-0.5, 3)}`, -0.5]]); return Q.e3N({ q: '<b>ฐาน</b>ของเลขยกกำลังนี้คือจำนวนใด (เศษส่วนกด /)', expr: ex, a, hint: 'ฐานคือสิ่งที่อยู่ในวงเล็บติดกับเลขชี้กำลัง', sig: 'h-bh ' + ex, base: 'e3hbh', diff: 38 }); },
  sumBE: () => { const b = e3Pick([-4, -6, -9]), n = e3R(5, 9); return Q.e3N({ q: 'ฐาน + เลขชี้กำลัง เท่ากับเท่าใด', expr: e3P(b, n), a: b + n, hint: `ฐานคือ ${e3Ng(b)}`, sig: `h-se ${b}${n}`, base: 'e3hse', diff: 34 }); },
  whichVal: () => { const [v, r, w] = e3Pick([[32, e3P(2, 5), [e3P(5, 2), e3P(2, 4), e3P(4, 2)]], [-27, e3P(-3, 3), [`−${e3P(-3, 3)}`, e3P(-9, 2), e3P(-3, 2)]], [81, e3P(-3, 4), [`−${e3P(3, 4)}`, e3P(-3, 3), e3P(4, 3)]]]); return Q.e3O({ q: `เลขยกกำลังใดมีค่าเท่ากับ ${e3Ng(v)}`, opts: [r, ...w], right: r, hint: 'หาค่าทีละตัวเลือก ระวังวงเล็บ', sig: 'h-wv ' + v, base: 'e3hwv', diff: 36 }); },
  /* 3 เขียนในรูปยกกำลัง */
  toExpBig: () => { const [N, b, n] = e3Pick([[1024, 2, 10], [243, 3, 5], [625, 5, 4], [729, 3, 6], [512, 2, 9]]); return Q.e3N({ q: 'เติมเลขชี้กำลังให้ถูกต้อง', expr: `${N.toLocaleString('en-US')} = ${e3P(b, '□')}`, a: n, hint: `หาร ${N} ด้วย ${b} ไปเรื่อย ๆ แล้วนับครั้ง`, sig: `h-te ${N}`, base: 'e3hte', diff: 32 }); },
  toBaseNeg: () => { const [N, b, n] = e3Pick([[-125, -5, 3], [-32, -2, 5], [-343, -7, 3], [-1000, -10, 3]]); return Q.e3N({ q: 'เติมฐานให้ถูกต้อง (จำนวนลบกด − ก่อน)', expr: `${e3Ng(N)} = ${e3P('□', n)}`, a: b, hint: 'ผลเป็นลบ และเลขชี้กำลังเป็นคี่ ฐานต้องเป็นจำนวนลบ', sig: `h-tb ${N}`, base: 'e3htb', diff: 40 }); },
  toFrac: () => { const [a, b, n] = e3Pick([[1, 2, 5], [2, 3, 3], [1, 3, 4], [3, 5, 3]]); return Q.e3N({ q: 'เติมเลขชี้กำลังให้ถูกต้อง', expr: `${fqHTML(a ** n, b ** n)} = ${e3PF(a, b, '□')}`, a: n, hint: `${b ** n} = ${b} คูณกันกี่ตัว`, sig: `h-tf ${a}${b}${n}`, base: 'e3htf', diff: 38 }); },
  prime360: () => { const [N, f] = e3Pick([[360, `${e3P(2, '□')} × ${e3P(3, 2)} × 5`], [720, `${e3P(2, '□')} × ${e3P(3, 2)} × 5`], [1000, `${e3P(2, '□')} × ${e3P(5, 3)}`]]); return Q.e3N({ q: 'แยกตัวประกอบเป็นจำนวนเฉพาะ แล้วเติมเลขชี้กำลัง', expr: `${N.toLocaleString('en-US')} = ${f}`, a: { 360: 3, 720: 4, 1000: 3 }[N], hint: `หาร ${N} ด้วย 2 ไปเรื่อย ๆ`, sig: 'h-p ' + N, base: 'e3hp', diff: 42 }); },
  /* 4 หาค่า */
  valueBig: () => { const [b, n] = e3Pick([[2, 10], [3, 5], [4, 4], [7, 3], [6, 4], [2, 9]]); return Q.e3N({ q: 'หาค่าของเลขยกกำลัง', expr: e3P(b, n), a: b ** n, hint: 'คูณทีละตัว หรือจับคู่คูณ เช่น 2¹⁰ = 2⁵ × 2⁵', sig: `h-vb ${b}${n}`, base: 'e3hvb', diff: 34 }); },
  valExpr: () => { const [ex, v, ht] = e3Pick([[`${e3P(2, 3)} × ${e3P(3, 2)}`, 72, '8 × 9'], [`${e3P(10, 3)} − ${e3P(9, 3)}`, 271, '1,000 − 729'], [`${e3P(5, 2)} − ${e3P(2, 4)} + ${e3P(3, 3)}`, 36, '25 − 16 + 27'], [`2 × ${e3P(3, 4)} − ${e3P(4, 3)}`, 98, '162 − 64'], [`${e3P(6, 2)} ÷ ${e3P(2, 2)} + ${e3P(1, 9)}`, 10, '36 ÷ 4 + 1']]); return Q.e3N({ q: 'หาค่า (ยกกำลังก่อน แล้วคูณหาร แล้วบวกลบ)', expr: ex, a: v, hint: ht, sig: 'h-ve ' + v, base: 'e3hve', diff: 40 }); },
  maxOf: () => { const [arr, r] = e3Pick([[[e3P(2, 7), e3P(5, 3), e3P(3, 4)], e3P(2, 7)], [[e3P(3, 4), e3P(4, 3), e3P(2, 6)], e3P(3, 4)], [[e3P(2, 10), e3P(10, 3), e3P(5, 4)], e3P(2, 10)]]); return Q.e3O({ q: 'ข้อใดมีค่า<b>มากที่สุด</b>', opts: arr, right: r, hint: 'หาค่าทุกตัวเลือก — เลขชี้กำลังมากไม่ได้แปลว่าค่ามากเสมอ', sig: 'h-mx ' + r, base: 'e3hmx', diff: 38 }); },
  /* 5 ฐานลบ */
  negHard: () => { const [ex, v] = e3Pick([[`−${e3P(-3, 4)}`, -81], [`${e3P(-2, 3)} × ${e3P(-1, 9)}`, 8], [`−${e3P(2, 4)} + ${e3P(-2, 4)}`, 0], [`${e3P(-3, 3)} − ${e3P(-3, 2)}`, -36], [`${e3P(-10, 4)}`, 10000], [`−${e3P(-1, 8)} − ${e3P(-1, 7)}`, 0], [`${e3P(-2, 2)} × ${e3P(-2, 3)}`, -32]]); return Q.e3N({ q: 'หาค่า (ระวังวงเล็บและเครื่องหมาย)', expr: ex, a: v, hint: 'หาค่าแต่ละพจน์ก่อน ดูว่าลบอยู่ในวงเล็บหรือไม่', sig: 'h-ng ' + ex, base: 'e3hng', diff: 40 }); },
  signHard: () => { const [ex, r] = e3Pick([[`−${e3P(-5, 7)}`, 'จำนวนบวก'], [`−${e3P(-4, 6)}`, 'จำนวนลบ'], [`${e3P(-2, 3)} × ${e3P(-3, 3)}`, 'จำนวนบวก'], [`${e3P(-1, 99)} × ${e3P(7, 2)}`, 'จำนวนลบ']]); return Q.e3O({ q: 'ค่าของนิพจน์นี้เป็นจำนวนบวกหรือจำนวนลบ', expr: ex, opts: ['จำนวนบวก', 'จำนวนลบ', 'ศูนย์'], right: r, hint: 'หาเครื่องหมายของแต่ละส่วนก่อน แล้วรวม', sig: 'h-sg ' + ex, base: 'e3hsg', diff: 36 }); },
  /* 6 เศษส่วน ทศนิยม */
  fracHard: () => { const [ex, a] = e3Pick([[e3PF(2, 3, 3, 1), '−8/27'], [`<span class="e3p">(1${fqHTML(1, 2)})<sup>3</sup></span>`, '27/8'], [`${e3PF(2, 3, 2)} × ${e3PF(3, 2, 2)}`, 1], [e3PF(3, 4, 3, 1), '−27/64'], [`${e3PF(1, 2, 3)} + ${e3PF(1, 2, 2)}`, '3/8']]); return Q.e3N({ q: 'หาค่า (ตอบเป็นเศษส่วนอย่างต่ำ กด / ระหว่างตัวเศษกับตัวส่วน)', expr: ex, a, hint: 'ยกกำลังทั้งตัวเศษและตัวส่วน ระวังเครื่องหมาย', sig: 'h-fr ' + ex, base: 'e3hfr', diff: 40 }); },
  decHard: () => { const [b, e] = e3Pick([[0.2, 4], [-0.1, 5], [1.1, 2], [0.03, 2], [-0.4, 3], [1.5, 2]]); return Q.e3N({ q: 'หาค่า', expr: e3P(b, e), a: String(Math.round(b ** e * 1e10) / 1e10), hint: 'คูณเหมือนจำนวนนับ แล้วนับตำแหน่งทศนิยมรวมกัน', sig: `h-dc ${b}${e}`, base: 'e3hdc', diff: 38 }); },
  cmpDec: () => { const [x, y, r] = e3Pick([[e3P(0.9, 2), '0.9', '<'], [e3P(1.2, 2), '1.2', '>'], [e3PF(3, 4, 2), fqHTML(3, 4), '<'], [e3P(-0.5, 3), e3P(-0.5, 2), '<']]); return Q.e3O({ q: 'เปรียบเทียบ เลือกเครื่องหมายที่ถูกต้อง', expr: `${x} ◯ ${y}`, opts: ['>', '<', '='], right: r, hint: 'ฐานระหว่าง 0 กับ 1 ยิ่งยกกำลังยิ่งเล็ก', sig: 'h-cd ' + x, base: 'e3hcd', diff: 36 }); },
  /* 7 คูณ */
  mulConv: () => { const [ex, a, ht] = e3Pick([[`${e3P(2, 3)} × ${e3P(4, 2)} = ${e3P(2, '□')}`, 7, '4² = (2²)² = 2⁴'], [`${e3P(3, 2)} × ${e3P(9, 3)} = ${e3P(3, '□')}`, 8, '9³ = 3⁶'], [`16 × ${e3P(2, 3)} = ${e3P(2, '□')}`, 7, '16 = 2⁴'], [`${e3P(5, 4)} × 25 × 5 = ${e3P(5, '□')}`, 7, '25 = 5²']]); return Q.e3N({ q: 'จัดให้เป็นฐานเดียวกันก่อน แล้วเติมเลขชี้กำลัง', expr: ex, a, hint: ht, sig: 'h-mc ' + ex, base: 'e3hmc', diff: 40 }); },
  mulMiss: () => { const m = e3R(2, 6), n = e3R(3, 7), k = e3R(2, 5); return Q.e3N({ q: 'เติมเลขชี้กำลังที่หายไป', expr: `${e3P('x', m)} × ${e3P('x', '□')} × ${e3P('x', k)} = ${e3P('x', m + n + k)}`, a: n, hint: `${m} + □ + ${k} = ${m + n + k}`, sig: `h-mm ${m}${n}${k}`, base: 'e3hmm', diff: 34 }); },
  mulNegB: () => { const m = e3R(2, 5), n = e3R(2, 5); return Q.e3N({ q: 'หาค่า', expr: `${e3P(-2, m)} × ${e3P(-2, n)}`, a: (-2) ** (m + n), hint: `${e3P(-2, m + n)} — ดูว่าเลขชี้กำลังเป็นคู่หรือคี่`, sig: `h-mn ${m}${n}`, base: 'e3hmn', diff: 38 }); },
  /* 8 หาร */
  divConv: () => { const [ex, a, ht] = e3Pick([[`${e3P(2, 10)} ÷ ${e3P(4, 3)} = ${e3P(2, '□')}`, 4, '4³ = 2⁶'], [`${e3P(9, 4)} ÷ ${e3P(3, 5)} = ${e3P(3, '□')}`, 3, '9⁴ = 3⁸'], [`${e3P(25, 3)} ÷ ${e3P(5, 4)} = ${e3P(5, '□')}`, 2, '25³ = 5⁶'], [`${e3P(8, 2)} ÷ 16 = ${e3P(2, '□')}`, 2, '8² = 2⁶ และ 16 = 2⁴']]); return Q.e3N({ q: 'จัดให้เป็นฐานเดียวกันก่อน แล้วเติมเลขชี้กำลัง', expr: ex, a, hint: ht, sig: 'h-dc2 ' + ex, base: 'e3hdv', diff: 40 }); },
  divFrac: () => { const [b, m, n] = e3Pick([[6, 5, 7], [2, 3, 8], [5, 2, 5], [10, 4, 7]]); return Q.e3N({ q: 'หาค่า (ตอบเป็นเศษส่วน)', expr: `${e3P(b, m)} ÷ ${e3P(b, n)}`, a: `1/${b ** (n - m)}`, hint: `${e3P(b, e3SupN(m - n))} = 1 ÷ ${e3P(b, n - m)}`, sig: `h-df ${b}${m}${n}`, base: 'e3hdf', diff: 42 }); },
  divMiss: () => { const m = e3R(2, 5), k = e3R(1, 4); return Q.e3N({ q: 'เติมเลขชี้กำลังที่หายไป (อาจเป็นจำนวนลบ)', expr: `${e3P('y', m)} ÷ ${e3P('y', '□')} = ${e3P('y', e3SupN(-k))}`, a: m + k, hint: `${m} − □ = −${k}`, sig: `h-dm ${m}${k}`, base: 'e3hdm', diff: 42 }); },
  /* 9 ศูนย์ หนึ่ง */
  zeroHard: () => { const [ex, v] = e3Pick([[`${e3P(-7, 0)} − ${e3P(7, 0)}`, 0], [`${e3P(3, 0)} × ${e3P(3, 2)} + ${e3P(2, 0)}`, 10], [`${e3PF(2, 3, 0)} + ${e3P(-1, 1)}`, 0], [`${e3P(5, 3)} ÷ ${e3P(5, 3)} + ${e3P(5, 1)}`, 6], [`(${e3P(4, 0)} + ${e3P(9, 0)})<sup>3</sup>`, 8], [`−${e3P(6, 0)} × ${e3P(-2, 3)}`, 8], [`${e3P(0, 4)} + ${e3P(4, 0)}`, 1]]); return Q.e3N({ q: 'หาค่า', expr: ex, a: v, hint: 'a⁰ = 1 เมื่อ a ≠ 0 · 0 ยกกำลังจำนวนบวก = 0', sig: 'h-z ' + ex, base: 'e3hz', diff: 38 }); },
  zeroX: () => { const b = e3Pick([2, 3, 7]), m = e3R(3, 6); return Q.e3N({ q: 'หาค่า x', expr: `${e3P(b, m)} ÷ ${e3P(b, 'x')} = 1`, a: m, hint: `1 = ${e3P(b, 0)} → ${m} − x = 0`, sig: `h-zx ${b}${m}`, base: 'e3hzx', diff: 40 }); },
  /* 10 คูณหารร่วม */
  mixHard: () => { const [ex, a, ht] = e3Pick([[`<span class="e3p">(${e3P(2, 3)})<sup>2</sup></span> × ${e3P(2, 4)} ÷ ${e3P(2, 7)} = ${e3P(2, '□')}`, 3, '6 + 4 − 7'], [`${e3P(4, 3)} × ${e3P(2, 5)} ÷ ${e3P(8, 2)} = ${e3P(2, '□')}`, 5, '4³ = 2⁶ · 8² = 2⁶'], [`(${e3P('a', 4)} × ${e3P('a', 2)}) ÷ <span class="e3p">(${e3P('a', 3)})<sup>2</sup></span> = ${e3P('a', '□')}`, 0, '6 − 6'], [`${e3P(3, 5)} × ${e3P(9, 2)} ÷ ${e3P(27, 2)} = ${e3P(3, '□')}`, 3, '9² = 3⁴ · 27² = 3⁶']]); return Q.e3N({ q: 'จัดรูป แล้วเติมเลขชี้กำลัง', expr: ex, a, hint: ht, sig: 'h-mh ' + ex, base: 'e3hmh', diff: 44 }); },
  mixValH: () => { const [ex, v] = e3Pick([[`<span class="e3p">(${e3P(3, 2)})<sup>3</sup></span> ÷ ${e3P(3, 4)}`, 9], [`<span class="e3p">(${e3P(5, 2)})<sup>3</sup></span> ÷ ${e3P(25, 2)}`, 25], [`${e3P(2, 8)} ÷ <span class="e3p">(${e3P(2, 2)})<sup>3</sup></span>`, 4], [`${e3P(10, 5)} × ${e3P(10, 2)} ÷ ${e3P(100, 3)}`, 10]]); return Q.e3N({ q: 'หาค่า', expr: ex, a: v, hint: 'จัดเป็นฐานเดียวกัน รวมเลขชี้กำลัง แล้วหาค่า', sig: 'h-mv ' + v, base: 'e3hmv', diff: 44 }); },
  /* 11 หา x */
  findXH: () => { const [ex, a, ht] = e3Pick([[`${e3P(2, 'x + 1')} = 32`, 4, '32 = 2⁵ → x + 1 = 5'], [`${e3P(3, 'x')} × 9 = ${e3P(3, 6)}`, 4, '9 = 3² → x + 2 = 6'], [`${e3P(4, 'x')} = ${e3P(2, 10)}`, 5, '4ˣ = 2²ˣ → 2x = 10'], [`${e3P(2, 'x')} ÷ ${e3P(2, 3)} = 16`, 7, '16 = 2⁴ → x − 3 = 4'], [`${e3P(5, '2x')} = 625`, 2, '625 = 5⁴ → 2x = 4'], [`${e3P(9, 'x')} = 27`, '3/2', '9ˣ = 3²ˣ และ 27 = 3³ → 2x = 3']]); return Q.e3N({ q: 'หาค่า x', expr: ex, a, hint: ht, sig: 'h-fx ' + ex, base: 'e3hfx', diff: 46 }); },
  cmpBig: () => { const [x, y, r, ht] = e3Pick([[e3P(2, 30), e3P(3, 20), '<', '2³⁰ = (2³)¹⁰ = 8¹⁰ · 3²⁰ = (3²)¹⁰ = 9¹⁰'], [e3P(2, 40), e3P(3, 25), '>', '2⁴⁰ = (2⁸)⁵ = 256⁵ · 3²⁵ = (3⁵)⁵ = 243⁵'], [e3P(5, 20), e3P(25, 10), '=', '25¹⁰ = (5²)¹⁰ = 5²⁰']]); return Q.e3O({ q: 'เปรียบเทียบ เลือกเครื่องหมายที่ถูกต้อง', expr: `${x} ◯ ${y}`, opts: ['>', '<', '='], right: r, hint: ht, sig: 'h-cb ' + x, base: 'e3hcb', diff: 48 }); },
  grow3: () => { const s = e3Pick([2, 4, 5]), d = e3R(3, 5); return Q.e3N({ q: `ข่าวลือแพร่ไป (สถานการณ์สมมติ) ทุกวันคนที่รู้เพิ่มเป็น 3 เท่า วันแรกมี ${s} คนรู้ เมื่อผ่านไป ${d} วันจะมีคนรู้กี่คน`, a: s * 3 ** d, unit: 'คน', hint: `${s} × ${e3P(3, d)}`, sig: `h-g3 ${s}${d}`, base: 'e3hg3', diff: 42 }); },
  /* 12 สัญกรณ์ */
  tenNeg: () => { const [ex, a] = e3Pick([['0.00001', -5], ['0.0001', -4], ['0.001', -3], ['0.000001', -6]]); return Q.e3N({ q: 'เติมเลขชี้กำลัง (จำนวนลบ กด − ก่อน)', expr: `${ex} = ${e3P(10, '□')}`, a, hint: 'นับว่า 1 อยู่ตำแหน่งที่เท่าไรหลังจุดทศนิยม', sig: 'h-tn ' + ex, base: 'e3htn', diff: 36 }); },
  tenOrder: () => { const r = e3P(10, 2); return Q.e3O({ q: 'ข้อใดมีค่า<b>มากที่สุด</b>', opts: [r, e3P(10, e3SupN(-3)), e3P(10, 0), `−${e3P(10, 3)}`], right: r, hint: '10⁰ = 1 · 10⁻³ = 0.001 · −10³ = −1,000', sig: 'h-to', diff: 38 }); },
  /* 13 เขียนสัญกรณ์ */
  sciHard: () => { const [s, a, n] = e3Pick([['0.000000705', 7.05, -7], ['40,500,000', 4.05, 7], ['0.00000903', 9.03, -6], ['602,000,000,000', 6.02, 11]]); return Q.e3N({ q: 'เขียนในรูปสัญกรณ์วิทยาศาสตร์ เติมเลขชี้กำลัง (จำนวนลบ กด − ก่อน)', expr: `${s} = ${a} × ${e3P(10, '□')}`, a: n, hint: 'นับว่าเลื่อนจุดกี่ตำแหน่ง ไปทางไหน', sig: 'h-sh ' + s, base: 'e3hsh', diff: 40 }); },
  fixHard: () => { const [ex, a, n] = e3Pick([[`0.035 × ${e3P(10, e3SupN(-2))}`, 3.5, -4], [`4,050 × ${e3P(10, e3SupN(-6))}`, 4.05, -3], [`0.12 × ${e3P(10, 9)}`, 1.2, 8], [`760 × ${e3P(10, e3SupN(-5))}`, 7.6, -3]]); return Q.e3N({ q: `ปรับ ${ex} ให้อยู่ในรูปสัญกรณ์วิทยาศาสตร์ ${a} × 10<sup>□</sup> เติมเลขชี้กำลัง`, a: n, hint: 'จำนวนหน้าเล็กลงกี่เท่า เลขชี้กำลังต้องเพิ่มเท่านั้น (และกลับกัน)', sig: 'h-fh ' + ex, base: 'e3hfh', diff: 46 }); },
  /* 14 คำนวณสัญกรณ์ */
  sciMulH: () => { const [ex, a, n] = e3Pick([[`(6 × ${e3P(10, 4)}) × (5 × ${e3P(10, e3SupN(-2))})`, 3, 3], [`(2.5 × ${e3P(10, 4)}) × (6 × ${e3P(10, 2)})`, 1.5, 7], [`(8 × ${e3P(10, e3SupN(-3))}) × (7 × ${e3P(10, 5)})`, 5.6, 3]]); return Q.e3N({ q: `หาผลคูณ ตอบในรูป ${a} × 10<sup>□</sup> เติมเลขชี้กำลัง`, expr: ex, a: n, hint: 'คูณจำนวนหน้า บวกเลขชี้กำลัง แล้วปรับจำนวนหน้าให้อยู่ระหว่าง 1 ถึง 10', sig: 'h-sm ' + ex, base: 'e3hsm', diff: 46 }); },
  sciDivH: () => { const [ex, a, n] = e3Pick([[`(1.2 × ${e3P(10, 3)}) ÷ (4 × ${e3P(10, 5)})`, 3, -3], [`(2 × ${e3P(10, e3SupN(-4))}) ÷ (8 × ${e3P(10, 2)})`, 2.5, -7], [`(6 × ${e3P(10, 5)}) ÷ (1.5 × ${e3P(10, e3SupN(-3))})`, 4, 8]]); return Q.e3N({ q: `หาผลหาร ตอบในรูป ${a} × 10<sup>□</sup> เติมเลขชี้กำลัง (จำนวนลบ กด − ก่อน)`, expr: ex, a: n, hint: 'หารจำนวนหน้า ลบเลขชี้กำลัง แล้วปรับจำนวนหน้า', sig: 'h-sd ' + ex, base: 'e3hsd', diff: 48 }); },
  sciAddH: () => { const [ex, a] = e3Pick([[`3 × ${e3P(10, 4)} + 5 × ${e3P(10, 3)}`, 3.5], [`7.2 × ${e3P(10, 5)} − 4 × ${e3P(10, 4)}`, 6.8], [`1.5 × ${e3P(10, 6)} + 25 × ${e3P(10, 4)}`, 1.75]]); return Q.e3N({ q: 'หาผลลัพธ์ เติมจำนวนหน้า', expr: `${ex} = □ × ${e3P(10, a === 1.75 ? 6 : a === 6.8 ? 5 : 4)}`, a, hint: 'ทำเลขชี้กำลังให้เท่ากันก่อน แล้วจึงบวกลบจำนวนหน้า', sig: 'h-sa ' + ex, base: 'e3hsa', diff: 46 }); },
  lightStory: () => Q.e3N({ q: 'แสงเดินทางประมาณ 3 × 10<sup>5</sup> กิโลเมตรต่อวินาที ใน 500 วินาทีแสงเดินทางได้ 1.5 × 10<sup>□</sup> กิโลเมตร เติมเลขชี้กำลัง', a: 8, hint: '3 × 500 = 1,500 = 1.5 × 10³', sig: 'h-ls', diff: 48 })
};
Object.keys(E3H).forEach(k => { const f = E3H[k]; E3H[k] = (...a) => { const q = f(...a); if (q.__base) q.__baseCap = 3; return q; }; }); /* ข้อท้าทายแบบเดียวกันได้ถึง 3 ข้อต่อเกม (ตัวเลขต่างกัน) */
/* =========================================================
   บทเรียน 2301–2314 + บอส 2319
   ========================================================= */
const LM3E = (no, place, title, short, goal, teach, game) => ({ id: 2300 + no, no, place, title, short, tone: TONES5[(no + 1) % 6], goal, teach, game });
const LESSONS_M1C3 = [
  LM3E(1, 'ท่าน้ำคูณซ้ำ', 'ความหมายของเลขยกกำลังและการคูณซ้ำ', 'คูณซ้ำ', 'เขียนการคูณซ้ำในรูปเลขยกกำลัง อ่านเลขยกกำลัง และแปลงเลขยกกำลังกลับเป็นการคูณซ้ำ โดยเข้าใจว่าเลขยกกำลังไม่ใช่ฐานคูณเลขชี้กำลัง', [
    T('<b>พับกระดาษครึ่งซ้ำ ๆ</b> — แตะพับแล้วดูจำนวนชั้น', 'พับกระดาษครึ่งซ้ำ ๆ แตะพับแล้วดูจำนวนชั้น', el => el.append(e3FoldSim(5))),
    T('<b>เลขยกกำลัง</b> — แตะการ์ดดูทีละใบ', 'เลขยกกำลัง แตะการ์ดดูทีละใบ', el => el.append(miCards([[e3P(2, 4), `<b>${e3Rep(2, 4)}</b><small>2 คูณกัน 4 ตัว = 16</small>`, '2⁴'], ['อ่านว่า', `<b>สองยกกำลังสี่</b><small>หรือ สองกำลังสี่</small>`, e3P(2, 4)], ['ระวัง!', `<b>${e3P(2, 4)} ≠ 2 × 4</b><small>16 ไม่ใช่ 8</small>`], ['คูณซ้ำ → ยกกำลัง', `<b>${e3Rep(5, 3)} = ${e3P(5, 3)}</b>`]])))
  ], () => [E3H.repNeg(), E3H.repFrac(), E3H.repMix(), E3H.negVal(), E3H.repNeg(), E3H.repFrac(), E3H.repMix(), E3Q.rep2pow(), E3Q.pow2rep(), E3Q.count(), E3Q.read(), E3Q.value(2, 3),
    Q.e3N({ q: 'นำ 4 มาคูณกัน 3 ตัว ได้ค่าเท่าใด', a: 64, hint: '4 × 4 × 4', sig: 'four3', diff: 14 }),
    e3TF(`${e3P(3, 2)} = 3 × 2 = 6`, false, `${e3P(3, 2)} = 3 × 3 = 9`), e3TF(`${e3Rep(7, 5)} = ${e3P(7, 5)}`, true, '')]),
  LM3E(2, 'ป้ายฐานกับเลขชี้กำลัง', 'ส่วนประกอบของเลขยกกำลัง: ฐานและเลขชี้กำลัง', 'ฐาน·เลขชี้กำลัง', 'ระบุฐานและเลขชี้กำลังของเลขยกกำลังได้ถูกต้อง รวมถึงฐานที่เป็นจำนวนลบ เศษส่วน และกรณีที่ไม่มีวงเล็บ', [
    T('<b>ฐาน และ เลขชี้กำลัง</b> — แตะทุกการ์ด', 'ฐาน และ เลขชี้กำลัง แตะทุกการ์ด', el => el.append(e3PartSim([[e3P(3, 4), '3', '4'], [e3P(-2, 5), '−2', '5', 'มีวงเล็บ เครื่องหมายลบจึงอยู่ในฐาน'], [e3PF(2, 3, 3), '2/3', '3', 'เศษส่วนในวงเล็บทั้งหมดเป็นฐาน'], [`−${e3P(2, 4)}`, '2', '4', 'ไม่มีวงเล็บ ลบไม่ได้อยู่ในฐาน']]))),
    T('<b>สรุป</b> — แตะการ์ดดูทีละใบ', 'สรุป แตะการ์ดดูทีละใบ', el => el.append(miCards([['ฐาน', '<b>จำนวนที่นำมาคูณซ้ำ</b>'], ['เลขชี้กำลัง', '<b>จำนวนตัวที่นำฐานมาคูณ</b><small>เขียนตัวเล็กมุมขวาบน</small>'], ['aⁿ', '<b>a เป็นฐาน n เป็นเลขชี้กำลัง</b>'], ['(−3)⁴ กับ −3⁴', '<b>ฐานคือ −3 กับ 3</b><small>วงเล็บบอกขอบเขตของฐาน</small>']])))
  ], () => [E3H.baseHard(), E3H.sumBE(), E3H.whichVal(), E3H.whichVal(), E3H.baseHard(), E3H.sumBE(), E3H.whichVal(), E3Q.base(), E3Q.exp(), E3Q.count(), E3Q.read(), E3Q.rep2pow(),
    Q.e3O({ q: 'เลขยกกำลังใดมี<b>ฐานเป็น −5</b>', opts: [e3P(-5, 3), `−${e3P(5, 3)}`, e3P(3, '−5'), e3P(5, 3)], right: e3P(-5, 3), hint: 'ฐานติดลบต้องอยู่ในวงเล็บ', sig: 'bm5', diff: 18 }),
    e3TF(`ฐานของ −${e3P(4, 2)} คือ −4`, false, 'ไม่มีวงเล็บ ฐานคือ 4'), e3TF(`${e3PF(1, 2, 3)} มีฐานเป็น ½ และเลขชี้กำลังเป็น 3`, true, '')]),
  LM3E(3, 'คุ้งแยกตัวประกอบ', 'การเขียนจำนวนในรูปเลขยกกำลัง', 'เขียนในรูปยกกำลัง', 'เขียนจำนวนในรูปเลขยกกำลังจากการคูณซ้ำและการแยกตัวประกอบ และรู้ว่าจำนวนเดียวกันเขียนได้หลายแบบ', [
    T('<b>แยกตัวประกอบ 64</b> — แตะจำนวนที่ยังแยกได้', 'แยกตัวประกอบหกสิบสี่ แตะจำนวนที่ยังแยกได้', el => el.append(e3TreeSim(64))),
    T('<b>แยกตัวประกอบ 72</b> — ได้ฐานสองตัว', 'แยกตัวประกอบเจ็ดสิบสอง ได้ฐานสองตัว', el => el.append(e3TreeSim(72))),
    T('<b>จำนวนเดียวกัน หลายแบบ</b> — แตะการ์ดดูทีละใบ', 'จำนวนเดียวกัน หลายแบบ แตะการ์ดดูทีละใบ', el => el.append(miCards([['16', `<b>${e3P(2, 4)} = ${e3P(4, 2)}</b>`], ['81', `<b>${e3P(3, 4)} = ${e3P(9, 2)}</b>`], ['64', `<b>${e3P(2, 6)} = ${e3P(4, 3)} = ${e3P(8, 2)}</b>`], ['นิยมเขียน', '<b>ฐานเป็นจำนวนเฉพาะ</b><small>เช่น 64 = 2⁶</small>']])))
  ], () => [E3H.toExpBig(), E3H.toBaseNeg(), E3H.toFrac(), E3H.prime360(), E3H.toExpBig(), E3H.toBaseNeg(), E3H.toFrac(), E3Q.toExp(), E3Q.toBase(), E3Q.many(), E3Q.prime(), E3Q.rep2pow(),
    Q.e3N({ q: 'เติมเลขชี้กำลัง', expr: `1,000,000 = ${e3P(10, '□')}`, a: 6, hint: 'นับเลข 0', sig: 'mil', diff: 16 }),
    e3TF(`${e3P(2, 4)} = ${e3P(4, 2)}`, true, 'ทั้งคู่เท่ากับ 16'), e3TF(`27 = ${e3P(9, 3)}`, false, `27 = ${e3P(3, 3)}`)]),
  LM3E(4, 'สะพานหาค่า', 'การหาค่าของเลขยกกำลัง', 'หาค่า', 'หาค่าของเลขยกกำลังโดยการคูณซ้ำ และเปรียบเทียบค่าของเลขยกกำลัง', [
    T('<b>หาค่า 3⁴</b> — แตะคูณทีละตัว', 'หาค่าสามยกกำลังสี่ แตะคูณทีละตัว', el => el.append(e3StepSim(3, 4))),
    T('<b>เปรียบเทียบ 2⁵ กับ 5²</b> — แตะการ์ดดูทีละใบ', 'เปรียบเทียบสองยกกำลังห้ากับห้ายกกำลังสอง', el => el.append(miCards([[e3P(2, 5), `<b>${e3Rep(2, 5)} = 32</b>`], [e3P(5, 2), '<b>5 × 5 = 25</b>'], ['สรุป', `<b>${e3P(2, 5)} > ${e3P(5, 2)}</b><small>สลับฐานกับเลขชี้กำลัง ค่าไม่เท่ากัน</small>`], ['ฐาน 10', `<b>${e3P(10, 5)} = 100,000</b><small>มี 0 ห้าตัว</small>`]])))
  ], () => [E3H.valueBig(), E3H.valExpr(), E3H.valExpr(), E3H.maxOf(), E3H.valueBig(), E3H.valExpr(), E3H.maxOf(), E3Q.value(2, 3), E3Q.cmp(), E3Q.tenPow(),
    Q.e3N({ q: 'หาค่า', expr: `${e3P(2, 3)} + ${e3P(3, 2)}`, a: 17, hint: '8 + 9', sig: 'sum89', diff: 20 }), Q.e3N({ q: 'หาค่า', expr: `${e3P(5, 2)} − ${e3P(2, 4)}`, a: 9, hint: '25 − 16', sig: 'sub', diff: 22 }),
    e3TF(`${e3P(1, 100)} = 1`, true, '1 คูณกันกี่ตัวก็ได้ 1'), e3TF(`${e3P(4, 3)} = ${e3P(3, 4)}`, false, '64 กับ 81')]),
  LM3E(5, 'แก่งวงเล็บลบ', 'เลขยกกำลังที่มีฐานเป็นจำนวนลบและเครื่องหมายวงเล็บ', 'ฐานลบ·วงเล็บ', 'หาค่าเลขยกกำลังที่มีฐานเป็นจำนวนลบ บอกเครื่องหมายของผลลัพธ์จากเลขชี้กำลังคู่หรือคี่ และแยกความแตกต่างระหว่าง (−a)ⁿ กับ −aⁿ', [
    T('<b>กำลังคู่ได้บวก กำลังคี่ได้ลบ</b> — จับคู่ตัวลบ', 'กำลังคู่ได้บวก กำลังคี่ได้ลบ จับคู่ตัวลบ', el => el.append(e3PairSim(-4))),
    T('<b>(−2)ⁿ กับ −2ⁿ</b> — แตะ n ทีละค่า', 'ลบสองทั้งหมดยกกำลังเอ็น กับ ลบของสองยกกำลังเอ็น แตะเอ็นทีละค่า', el => el.append(e3SignSim())),
    T('ตัวอย่าง: <b>บวกหรือลบ?</b>', 'ตัวอย่าง บวกหรือลบ', el => el.append(e3SignEx([[e3P(-1, 100), 1, 'ฐาน −1, เลขชี้กำลัง 100 เป็น<b>คู่</b> → บวก'], [e3P(-5, 3), -125, 'ฐาน −5, เลขชี้กำลัง 3 เป็น<b>คี่</b> → ลบ'], [e3P(-3, 4), 81, 'ฐาน −3, เลขชี้กำลัง 4 เป็น<b>คู่</b> → บวก'], [`<span>−${e3P(6, 2)}</span>`, -36, '<b>ไม่มีวงเล็บ</b> ฐานคือ 6 → 6² = 36 แล้วใส่ลบ']]))),
    T('ตัวอย่างทีละขั้น: <b>(−3)² กับ −3²</b>', 'ตัวอย่างทีละขั้น ลบสามทั้งหมดยกกำลังสอง กับ ลบของสามยกกำลังสอง', el => el.append(dcWalk(`${e3P(-3, 2)} &emsp; กับ &emsp; −${e3P(3, 2)}`, [['① ดูฐาน', `${e3P(-3, 2)} ฐานคือ −3 · −${e3P(3, 2)} ฐานคือ 3`], ['② (−3)²', '(−3) × (−3) = 9'], ['③ −3²', '−(3 × 3) = −9']], '<b>วงเล็บเปลี่ยนคำตอบ: 9 ≠ −9</b>')))
  ], () => [E3H.negHard(), E3H.negHard(), E3H.signHard(), E3H.negHard(), E3H.negHard(), E3H.signHard(), E3H.negHard(), E3Q.neg(), E3Q.sign(), E3Q.base(),
    Q.e3O({ q: 'ข้อใดมีค่า<b>เป็นลบ</b>', opts: [`−${e3P(4, 2)}`, e3P(-4, 2), e3P(-1, 6), e3P(-2, 4)], right: `−${e3P(4, 2)}`, hint: 'หาค่าทีละข้อ ระวังวงเล็บ', sig: 'negpick', diff: 30 }),
    Q.e3N({ q: 'หาค่า', expr: `${e3P(-1, 15)} + ${e3P(-1, 20)}`, a: 0, hint: '(−1)¹⁵ = −1 และ (−1)²⁰ = 1', sig: 'm1pp', diff: 34 }),
    e3TF(`${e3P(-5, 2)} = −${e3P(5, 2)}`, false, '25 กับ −25'), e3TF('เลขยกกำลังที่มีฐานเป็นจำนวนลบและเลขชี้กำลังเป็นจำนวนคี่ มีค่าเป็นลบ', true, '')]),
  LM3E(6, 'ทุ่งเศษส่วน', 'เลขยกกำลังที่มีฐานเป็นเศษส่วนและทศนิยม', 'ฐานเศษส่วน·ทศนิยม', 'หาค่าเลขยกกำลังที่มีฐานเป็นเศษส่วน (รวมเศษส่วนติดลบและจำนวนคละ) และทศนิยม และเปรียบเทียบค่า', [
    T('<b>คูณด้วย ½ ซ้ำ ๆ</b> — ดูพื้นที่ที่เหลือ', 'คูณด้วยครึ่งซ้ำ ๆ ดูพื้นที่ที่เหลือ', el => el.append(e3HalfSim(4))),
    T('ตัวอย่างทีละขั้น: <b>เศษส่วน ทศนิยม และจำนวนคละ</b>', 'ตัวอย่างทีละขั้น เศษส่วน ทศนิยม และจำนวนคละ', el => el.append(dcWalk('', [['① (2/3)²', `${fqHTML(2, 3)} × ${fqHTML(2, 3)} = ${fqHTML(4, 9)} (ยกกำลังทั้งเศษและส่วน)`], ['② (0.3)²', '0.3 × 0.3 = 0.09 (ทศนิยม 1 + 1 = 2 ตำแหน่ง)'], ['③ (−1/2)³', `ฐานลบ เลขชี้กำลังคี่ → −${fqHTML(1, 8)}`], ['④ (1½)²', `แปลงเป็นเศษเกิน ${fqHTML(3, 2)} ก่อน → ${fqHTML(9, 4)}`]], '<b>ฐานเศษส่วน: ยกกำลังทั้งตัวเศษและตัวส่วน</b>')))
  ], () => [E3H.fracHard(), E3H.fracHard(), E3H.decHard(), E3H.cmpDec(), E3H.fracHard(), E3H.decHard(), E3H.cmpDec(), E3Q.frac(), E3Q.dec(), E3Q.dec(),
    Q.e3N({ q: 'หาค่า (ตอบเป็นเศษส่วน)', expr: `<span class="e3p">(1${fqHTML(1, 2)})<sup>2</sup></span>`, a: '9/4', hint: `1½ = ${fqHTML(3, 2)}`, sig: 'mixed', diff: 36 }),
    Q.e3O({ q: 'เปรียบเทียบ เลือกเครื่องหมายที่ถูกต้อง', expr: `${e3P(0.5, 2)} ◯ 0.5`, opts: ['>', '<', '='], right: '<', hint: '0.5 × 0.5 = 0.25', sig: 'cmp05', diff: 26 }),
    e3TF(`${e3PF(2, 3, 2)} = ${fqHTML(4, 3)}`, false, `ต้องยกกำลังตัวส่วนด้วย = ${fqHTML(4, 9)}`), e3TF(`${e3P(0.1, 3)} = 0.001`, true, '')]),
  LM3E(7, 'ท่าคูณฐานเดียวกัน', 'สมบัติการคูณเลขยกกำลังที่มีฐานเดียวกัน', 'aᵐ × aⁿ', 'คูณเลขยกกำลังที่มีฐานเดียวกันโดยกระจายเป็นการคูณซ้ำ สังเกตว่าเลขชี้กำลังบวกกัน และใช้สมบัติ aᵐ × aⁿ = aᵐ⁺ⁿ เฉพาะเมื่อฐานเหมือนกัน', [
    T('<b>กระจายแล้วนับ</b> — แตะนับตัวประกอบทุกตัว', 'กระจายแล้วนับ แตะนับตัวประกอบทุกตัว', el => el.append(e3MulSim([[2, 3, 2], [5, 2, 4], [-3, 1, 3]]))),
    T('<b>สมบัติการคูณ</b> — แตะการ์ดดูทีละใบ', 'สมบัติการคูณ แตะการ์ดดูทีละใบ', el => el.append(miCards([['aᵐ × aⁿ', '<b>= aᵐ⁺ⁿ</b><small>ฐานเดียวกัน บวกเลขชี้กำลัง</small>'], ['ฐานคงเดิม', `<b>${e3P(3, 2)} × ${e3P(3, 4)} = ${e3P(3, 6)}</b><small>ไม่ใช่ 9⁶</small>`], ['ฐานต่างกัน', `<b>${e3P(2, 3)} × ${e3P(5, 2)}</b><small>ใช้สมบัตินี้ไม่ได้ ต้องหาค่าแยก = 8 × 25 = 200</small>`], ['ไม่มีเลขชี้กำลัง', `<b>a = a¹</b><small>${e3P(7, 3)} × 7 = ${e3P(7, 4)}</small>`]])))
  ], () => [E3H.mulConv(), E3H.mulConv(), E3H.mulMiss(), E3H.mulNegB(), E3H.mulConv(), E3H.mulMiss(), E3H.mulNegB(), E3Q.mulE(), E3Q.mul3(), E3Q.sameBase(),
    Q.e3N({ q: 'หาค่า', expr: `${e3P(2, 3)} × ${e3P(2, 2)}`, a: 32, hint: `${e3P(2, 5)}`, sig: 'mv232', diff: 22 }), Q.e3N({ q: 'หาค่า', expr: `${e3P(10, 2)} × ${e3P(10, 3)}`, a: 100000, hint: `${e3P(10, 5)}`, sig: 'mv10', diff: 22 }),
    Q.e3N({ q: 'เติมเลขชี้กำลัง', expr: `${e3P('a', 4)} × ${e3P('a', '□')} = ${e3P('a', 9)}`, a: 5, hint: '4 + □ = 9', sig: 'ma49', diff: 30 }),
    e3TF(`${e3P(2, 3)} × ${e3P(2, 4)} = ${e3P(2, 12)}`, false, 'บวกเลขชี้กำลัง ไม่ใช่คูณ → 2⁷'), e3TF(`${e3P(5, 2)} × ${e3P(3, 2)} = ${e3P(8, 4)}`, false, 'ฐานต่างกัน ใช้สมบัติการคูณไม่ได้')]),
  LM3E(8, 'ประตูหารฐานเดียวกัน', 'สมบัติการหารเลขยกกำลังที่มีฐานเดียวกัน', 'aᵐ ÷ aⁿ', 'หารเลขยกกำลังที่มีฐานเดียวกันโดยตัดตัวประกอบที่เหมือนกัน ใช้สมบัติ aᵐ ÷ aⁿ = aᵐ⁻ⁿ (a ≠ 0) ทั้งกรณีเลขชี้กำลังตัวตั้งมากกว่า เท่ากัน และน้อยกว่า', [
    T('<b>ตัดตัวประกอบ</b> — แตะเพื่อตัดคู่บน-ล่าง', 'ตัดตัวประกอบ แตะเพื่อตัดคู่บนล่าง', el => el.append(e3DivSim([[2, 5, 2], [3, 3, 3], [2, 2, 5]]))),
    T('<b>สมบัติการหาร</b> — แตะการ์ดดูทีละใบ', 'สมบัติการหาร แตะการ์ดดูทีละใบ', el => el.append(miCards([['aᵐ ÷ aⁿ', '<b>= aᵐ⁻ⁿ</b><small>a ≠ 0 · ลบเลขชี้กำลัง (ตัวตั้ง − ตัวหาร)</small>'], ['m = n', '<b>= a⁰ = 1</b>'], ['m < n', `<b>${e3P(2, 2)} ÷ ${e3P(2, 5)} = ${e3P(2, '−3')}</b><small>= ${fqHTML(1, e3P(2, 3))}</small>`], ['a⁻ⁿ', `<b>= ${fqHTML(1, 'aⁿ')}</b><small>a ≠ 0</small>`]])))
  ], () => [E3H.divConv(), E3H.divConv(), E3H.divFrac(), E3H.divMiss(), E3H.divConv(), E3H.divFrac(), E3H.divMiss(), E3Q.divE(), E3Q.divNeg(), E3Q.divVal(), E3Q.divVal(),
    Q.e3N({ q: 'หาค่า (ตอบเป็นเศษส่วน)', expr: `${e3P(3, 2)} ÷ ${e3P(3, 4)}`, a: '1/9', hint: `= ${e3P(3, '−2')} = ${fqHTML(1, e3P(3, 2))}`, sig: 'd324', diff: 36 }),
    Q.e3O({ q: 'ทำไมสมบัติ aᵐ ÷ aⁿ ต้องมีเงื่อนไข a ≠ 0', opts: ['เพราะหารด้วย 0 ไม่ได้', 'เพราะ 0 ไม่ใช่จำนวนเต็ม', 'เพราะเลขชี้กำลังต้องเป็นบวก', 'ไม่จำเป็นต้องมีเงื่อนไข'], right: 'เพราะหารด้วย 0 ไม่ได้', hint: 'ตัวหาร aⁿ จะเป็น 0', sig: 'whyne0', diff: 24 }),
    e3TF(`${e3P(7, 6)} ÷ ${e3P(7, 2)} = ${e3P(7, 3)}`, false, 'ลบเลขชี้กำลัง 6 − 2 = 4 ไม่ใช่หาร'), e3TF(`${e3P(5, 4)} ÷ ${e3P(5, 4)} = 1`, true, '')]),
  LM3E(9, 'หาดกำลังศูนย์', 'เลขยกกำลังศูนย์และเลขชี้กำลังเป็นหนึ่ง', 'a⁰ และ a¹', 'บอกความหมายของ a¹ = a และ a⁰ = 1 อธิบายที่มาจากการหาร และรู้เงื่อนไขว่าฐานต้องไม่เป็นศูนย์', [
    T('<b>ลดเลขชี้กำลังทีละ 1</b> — ดูว่าได้ค่าอะไร', 'ลดเลขชี้กำลังทีละหนึ่ง ดูว่าได้ค่าอะไร', el => el.append(e3ZeroSim())),
    T('ตัวอย่างทีละขั้น: <b>ทำไม a⁰ = 1</b>', 'ตัวอย่างทีละขั้น ทำไมเอยกกำลังศูนย์เท่ากับหนึ่ง', el => el.append(dcWalk(`${e3P(5, 3)} ÷ ${e3P(5, 3)}`, [['① หารด้วยตัวมันเอง', '125 ÷ 125 = 1'], ['② ใช้สมบัติการหาร', `${e3P(5, '3−3')} = ${e3P(5, 0)}`], ['③ จึงได้', `${e3P(5, 0)} = 1`], ['④ เงื่อนไข', 'ฐานต้องไม่เป็น 0 เพราะ 0 ÷ 0 ไม่มีความหมาย → 0⁰ ไม่นิยาม']], '<b>a⁰ = 1 เมื่อ a ≠ 0</b>')))
  ], () => [E3H.zeroHard(), E3H.zeroHard(), E3H.zeroHard(), E3H.zeroX(), E3H.zeroHard(), E3H.zeroX(), E3H.zeroHard(), E3Q.zero(), E3Q.zero(),
    Q.e3O({ q: 'ข้อใด<b>ไม่มีความหมาย</b> (ไม่นิยาม)', opts: [e3P(0, 0), e3P(5, 0), e3P(0, 5), e3P(-1, 0)], right: e3P(0, 0), hint: 'a⁰ = 1 ใช้ได้เมื่อ a ≠ 0', sig: 'undef', diff: 26 }),
    Q.e3N({ q: 'หาค่า', expr: `${e3P(9, 4)} ÷ ${e3P(9, 4)}`, a: 1, hint: `= ${e3P(9, 0)}`, sig: 'nn', diff: 18 }), Q.e3N({ q: 'หาค่า', expr: `${e3P(2, 0)} + ${e3P(2, 1)} + ${e3P(2, 2)}`, a: 7, hint: '1 + 2 + 4', sig: 'z012', diff: 22 }),
    e3TF(`${e3P(-8, 0)} = −1`, false, 'ฐาน −8 ≠ 0 ดังนั้น = 1'), e3TF(`−${e3P(8, 0)} = −1`, true, 'ไม่มีวงเล็บ = −(8⁰) = −1')]),
  LM3E(10, 'ลำธารคูณหาร', 'การคูณและหารเลขยกกำลังร่วมกัน', 'คูณหารร่วมกัน', 'หาค่าและจัดรูปนิพจน์ที่มีทั้งการคูณและการหารเลขยกกำลัง จัดฐานให้เหมือนกัน และใช้สมบัติ (aᵐ)ⁿ = aᵐⁿ', [
    T('ตัวอย่างทีละขั้น: <b>(2³ × 2⁴) ÷ 2²</b>', 'ตัวอย่างทีละขั้น สองกำลังสามคูณสองกำลังสี่ หารด้วยสองกำลังสอง', el => el.append(dcWalk(`(${e3P(2, 3)} × ${e3P(2, 4)}) ÷ ${e3P(2, 2)}`, [['① คูณก่อน (ซ้ายไปขวา)', `${e3P(2, '3+4')} = ${e3P(2, 7)}`], ['② หาร', `${e3P(2, 7)} ÷ ${e3P(2, 2)} = ${e3P(2, '7−2')}`], ['③ ผลลัพธ์', `${e3P(2, 5)} = 32`]], `<b>${e3P(2, '3+4−2')} = ${e3P(2, 5)} = 32</b>`))),
    T('ตัวอย่างทีละขั้น: <b>ยกกำลังซ้อน (2³)²</b> และจัดฐานให้เหมือนกัน', 'ตัวอย่างทีละขั้น ยกกำลังซ้อน และจัดฐานให้เหมือนกัน', el => el.append(dcWalk(`<span class="e3p">(${e3P(2, 3)})<sup>2</sup></span> &emsp; และ &emsp; ${e3P(4, 3)} × ${e3P(2, 2)}`, [['① (2³)²', `${e3P(2, 3)} × ${e3P(2, 3)} = ${e3P(2, '3+3')} = ${e3P(2, 6)} → (aᵐ)ⁿ = aᵐⁿ`], ['② 4³', `4 = ${e3P(2, 2)} → ${e3P(4, 3)} = <span class="e3p">(${e3P(2, 2)})<sup>3</sup></span> = ${e3P(2, 6)}`], ['③ 4³ × 2²', `${e3P(2, 6)} × ${e3P(2, 2)} = ${e3P(2, 8)} = 256`]], '<b>ฐานต่างกัน ลองเขียนให้เป็นฐานเดียวกันก่อน</b>')))
  ], () => [E3H.mixHard(), E3H.mixHard(), E3H.mixValH(), E3H.mixValH(), E3H.mixHard(), E3H.mixValH(), E3H.mixHard(), E3Q.mix(), E3Q.mixVal(), E3Q.powPow(), E3Q.convB(), E3Q.convB(),
    Q.e3N({ q: 'หาค่า', expr: `${e3P(10, 6)} ÷ ${e3P(10, 2)} ÷ ${e3P(10, 3)}`, a: 10, hint: '6 − 2 − 3 = 1', sig: 'ten3', diff: 34 }),
    e3TF(`<span class="e3p">(${e3P(3, 2)})<sup>4</sup></span> = ${e3P(3, 6)}`, false, 'ยกกำลังซ้อน คูณเลขชี้กำลัง = 3⁸'), e3TF(`${e3P(2, 5)} × ${e3P(2, 3)} ÷ ${e3P(2, 6)} = 4`, true, '2²')]),
  LM3E(11, 'ค่ายแก้ปริศนา', 'การแก้โจทย์เลขยกกำลังหลายขั้นตอน', 'หา x · ประยุกต์', 'หาฐานหรือเลขชี้กำลังที่หายไป เปรียบเทียบเลขยกกำลังโดยจัดฐานให้เหมือนกัน และแก้โจทย์การเพิ่มขึ้นแบบทวีคูณ', [
    T('<b>หาค่า x</b> — ลองแทนค่าทีละค่า', 'หาค่าเอกซ์ ลองแทนค่าทีละค่า', el => el.append(e3FindSim({ show: `${e3P(2, 'x')} × ${e3P(2, 3)} = ${e3P(2, 7)}`, cands: [2, 3, 4, 5, 10], val: x => 2 ** (x + 3), target: 128, msg: x => `${e3P(2, x)} × ${e3P(2, 3)} = ${e3P(2, x + 3)}` }))),
    T('ตัวอย่างทีละขั้น: <b>เปรียบเทียบ 4³ กับ 2⁵</b> และโจทย์ทวีคูณ', 'ตัวอย่างทีละขั้น เปรียบเทียบ และโจทย์ทวีคูณ', el => el.append(dcWalk('', [['① จัดฐาน', `${e3P(4, 3)} = <span class="e3p">(${e3P(2, 2)})<sup>3</sup></span> = ${e3P(2, 6)}`], ['② เทียบ', `${e3P(2, 6)} > ${e3P(2, 5)} เพราะ 6 > 5`], ['③ ทวีคูณ', 'สาหร่าย (สมมติ) เพิ่มเป็น 2 เท่าทุกวัน เริ่ม 5 ต้น ผ่านไป 4 วัน'], ['④ คำนวณ', `5 × ${e3P(2, 4)} = 5 × 16 = 80 ต้น`]], '<b>ฐานเดียวกัน เลขชี้กำลังมากกว่า ค่ามากกว่า (เมื่อฐาน > 1)</b>')))
  ], () => [E3H.findXH(), E3H.findXH(), E3H.findXH(), E3H.cmpBig(), E3H.grow3(), E3H.findXH(), E3H.cmpBig(), E3Q.findX(), E3Q.findXv(), E3Q.cmpConv(), E3Q.grow(), E3Q.grow(),
    Q.e3N({ q: 'หาค่า x', expr: `${e3P(3, 5)} ÷ ${e3P(3, 'x')} = 9`, a: 3, hint: '9 = 3² → 5 − x = 2', sig: 'fx9', diff: 46 }),
    e3TF(`ถ้า ${e3P(5, 'x')} = 1 แล้ว x = 0`, true, '5⁰ = 1'), e3TF(`${e3P(2, 10)} มากกว่า 1,000`, true, '2¹⁰ = 1,024')]),
  LM3E(12, 'หอดูดาววิทย์', 'ความหมายและหลักการของสัญกรณ์วิทยาศาสตร์', 'สัญกรณ์วิทยาศาสตร์', 'บอกเหตุผลของการใช้สัญกรณ์วิทยาศาสตร์ รูปแบบ a × 10ⁿ เมื่อ 1 ≤ a < 10 และความหมายของเลขชี้กำลังบวกและลบของ 10', [
    T('<b>กำลังของ 10</b> — แตะทีละตัว', 'กำลังของสิบ แตะทีละตัว', el => el.append(e3TenSim())),
    T('<b>สัญกรณ์วิทยาศาสตร์</b> — แตะการ์ดดูทีละใบ', 'สัญกรณ์วิทยาศาสตร์ แตะการ์ดดูทีละใบ', el => el.append(miCards([['ทำไมต้องใช้', '<b>เขียนจำนวนที่มากมาก/น้อยมากให้สั้น</b><small>อ่านและเปรียบเทียบง่าย</small>'], ['รูปแบบ', `<b>a × ${e3P(10, 'n')}</b><small>1 ≤ a < 10 · n เป็นจำนวนเต็ม</small>`], ['n บวก', '<b>จำนวนมาก</b><small>เช่น 3 × 10⁸</small>'], ['n ลบ', '<b>จำนวนน้อยกว่า 1</b><small>เช่น 2.5 × 10⁻⁶</small>'], ['ไม่ใช่', `<b>25 × ${e3P(10, 3)}</b><small>25 ไม่อยู่ระหว่าง 1 ถึง 10</small>`]])))
  ], () => [E3H.tenNeg(), E3H.tenNeg(), E3H.tenOrder(), E3H.sciHard(), E3H.tenNeg(), E3H.tenOrder(), E3H.sciHard(), E3Q.isSci(), E3Q.tenPow(), E3Q.tenPow(),
    Q.e3O({ q: 'ในรูป a × 10ⁿ ค่า a ต้องเป็นอย่างไร', opts: ['1 ≤ a < 10', '0 < a < 1', 'a เป็นจำนวนเต็มเท่านั้น', 'a > 10'], right: '1 ≤ a < 10', hint: 'มีหลักหน้าจุดทศนิยมหนึ่งหลักที่ไม่ใช่ศูนย์', sig: 'arange', diff: 14 }),
    Q.e3O({ q: 'จำนวนใดควรเขียนด้วยเลขชี้กำลัง<b>ลบ</b>', opts: ['0.00045', '45,000', '4.5', '450'], right: '0.00045', hint: 'จำนวนที่น้อยกว่า 1', sig: 'negwhich', diff: 18 }),
    Q.e3O({ q: 'ค่าของ 10⁻² เท่ากับข้อใด', opts: ['0.01', '−100', '100', '−0.01'], right: '0.01', hint: `10⁻² = ${fqHTML(1, 100)}`, sig: 'tenm2', diff: 20 }),
    e3TF(`10⁻³ เป็นจำนวนลบ`, false, '10⁻³ = 0.001 เป็นจำนวนบวกที่น้อยกว่า 1'), e3TF(`0.7 × ${e3P(10, 4)} อยู่ในรูปสัญกรณ์วิทยาศาสตร์`, false, '0.7 < 1')]),
  LM3E(13, 'สถานีเลื่อนจุด', 'การเขียนจำนวนให้อยู่ในรูปสัญกรณ์วิทยาศาสตร์', 'เขียนสัญกรณ์', 'เขียนจำนวนที่มีค่ามาก (เลื่อนจุดทศนิยมไปทางซ้าย เลขชี้กำลังบวก) และจำนวนที่มีค่าน้อย (เลื่อนไปทางขวา เลขชี้กำลังลบ) ในรูปสัญกรณ์วิทยาศาสตร์', [
    T('<b>จำนวนที่มีค่ามาก</b>: 45,000 — เลื่อนจุดทศนิยม', 'จำนวนที่มีค่ามาก สี่หมื่นห้าพัน เลื่อนจุดทศนิยม', el => el.append(e3DotSim('45000'))),
    T('<b>จำนวนที่มีค่าน้อย</b>: 0.00032 — เลื่อนจุดทศนิยม', 'จำนวนที่มีค่าน้อย ศูนย์จุดศูนย์ศูนย์ศูนย์สามสอง เลื่อนจุดทศนิยม', el => el.append(e3DotSim('0.00032'))),
    T('<b>สรุป</b> — แตะการ์ดดูทีละใบ', 'สรุป แตะการ์ดดูทีละใบ', el => el.append(miCards([['จำนวนมาก', '<b>เลื่อนจุดไปทางซ้าย</b><small>เลขชี้กำลัง = จำนวนตำแหน่ง (บวก)</small>'], ['จำนวนน้อย', '<b>เลื่อนจุดไปทางขวา</b><small>เลขชี้กำลัง = −(จำนวนตำแหน่ง)</small>'], ['ตรวจทุกครั้ง', '<b>1 ≤ a < 10</b>']])))
  ], () => [E3H.sciHard(), E3H.sciHard(), E3H.fixHard(), E3H.fixHard(), E3H.sciHard(), E3H.fixHard(), E3H.sciHard(), E3Q.bigExp(), E3Q.bigA(), E3Q.smallExp(), E3Q.sciPick(), E3Q.sciPick(),
    Q.e3N({ q: 'เขียนในรูปสัญกรณ์วิทยาศาสตร์ เติมเลขชี้กำลัง', expr: `7 = 7 × ${e3P(10, '□')}`, a: 0, hint: 'ไม่ต้องเลื่อนจุด', sig: 'seven', diff: 22 }),
    e3TF(`0.0045 = 4.5 × ${e3P(10, 3)}`, false, 'จำนวนน้อยกว่า 1 เลขชี้กำลังต้องเป็นลบ = 4.5 × 10⁻³'), e3TF(`3,000,000 = 3 × ${e3P(10, 6)}`, true, '')]),
  LM3E(14, 'ท่าเรือคำนวณ', 'การคำนวณและโจทย์ประยุกต์สัญกรณ์วิทยาศาสตร์', 'คำนวณสัญกรณ์', 'แปลงสัญกรณ์วิทยาศาสตร์กลับเป็นจำนวนปกติ เปรียบเทียบ คูณ หาร (และบวกลบเมื่อเลขชี้กำลังเท่ากัน) ปรับคำตอบให้อยู่ในรูปมาตรฐาน และแก้โจทย์ระยะทาง มวล ขนาด', [
    T('ตัวอย่างทีละขั้น: <b>คูณและหาร</b>', 'ตัวอย่างทีละขั้น คูณและหาร', el => el.append(dcWalk('', [['① คูณ', `(3 × ${e3P(10, 4)}) × (5 × ${e3P(10, 2)}) = 15 × ${e3P(10, 6)}`], ['② ปรับรูป', `15 = 1.5 × 10 → 1.5 × ${e3P(10, 7)}`], ['③ หาร', `(8 × ${e3P(10, 9)}) ÷ (2 × ${e3P(10, 3)}) = 4 × ${e3P(10, 6)}`], ['④ บวก (เลขชี้กำลังเท่ากัน)', `2.1 × ${e3P(10, 5)} + 3.4 × ${e3P(10, 5)} = 5.5 × ${e3P(10, 5)}`]], '<b>คูณ/หาร: จัดการจำนวนหน้ากับกำลังของ 10 แยกกัน แล้วปรับให้ 1 ≤ a < 10</b>'))),
    T('<b>เปรียบเทียบและโจทย์</b> — แตะการ์ดดูทีละใบ', 'เปรียบเทียบและโจทย์ แตะการ์ดดูทีละใบ', el => el.append(miCards([['เปรียบเทียบ', '<b>ดูเลขชี้กำลังก่อน</b><small>เลขชี้กำลังมากกว่า จำนวนมากกว่า</small>'], ['เลขชี้กำลังเท่ากัน', '<b>เทียบจำนวนหน้า</b>'], ['ระยะทาง', `<b>แสงเดินทางประมาณ 3 × ${e3P(10, 5)} กม. ต่อวินาที</b>`], ['ขนาดเล็ก', `<b>ไวรัสบางชนิดประมาณ 1 × ${e3P(10, '−7')} เมตร</b>`]])))
  ], () => [E3H.sciMulH(), E3H.sciDivH(), E3H.sciAddH(), E3H.lightStory(), E3H.sciMulH(), E3H.sciDivH(), E3H.sciAddH(), E3Q.back(), E3Q.sciCmp(), E3Q.sciMul(), E3Q.sciDiv(), E3Q.fix(), E3Q.sciStory(),
    Q.e3N({ q: 'หาผลบวก เติมจำนวนหน้า', expr: `2.3 × ${e3P(10, 4)} + 4.1 × ${e3P(10, 4)} = □ × ${e3P(10, 4)}`, a: 6.4, hint: 'เลขชี้กำลังเท่ากัน บวกจำนวนหน้า', sig: 'sadd', diff: 30 }),
    e3TF(`2 × ${e3P(10, 5)} มากกว่า 9 × ${e3P(10, 4)}`, true, '200,000 > 90,000')])
];
LESSONS_M1C3.find(L => L.id === 2301).pracQ = () => Q.e3O({ q: 'เขียนการคูณซ้ำต่อไปนี้ในรูปเลขยกกำลัง', expr: e3Rep(2, 3), opts: [e3P(2, 3), e3P(3, 2), '2 × 3'], right: e3P(2, 3), hint: 'ฐาน 2 คูณกัน 3 ตัว', sig: 'prac1' });

/* ---------- บอส: 20 ข้อ (แต่งใหม่ทั้งหมด) ---------- */
const e3XF = s => ({ html: `<span class="e3-x">${s}</span>` });
const EXAM_M1C3 = xrot([
  { q: `${e3Rep(6, 4)} เขียนในรูปเลขยกกำลังได้ตามข้อใด`, opts: [e3XF(e3P(6, 4)), e3XF(e3P(4, 6)), e3XF('6 × 4'), e3XF(e3P(6, 5))], a: 0 },
  { q: `${e3P(5, 3)} มีค่าเท่าใด`, opts: ['125', '15', '243', '8'], a: 0 },
  { q: `ฐานของ −${e3P(7, 2)} คือจำนวนใด`, opts: ['7', '−7', '2', '−2'], a: 0 },
  { q: `${e3P(-2, 5)} มีค่าเท่าใด`, opts: ['−32', '32', '−10', '10'], a: 0 },
  { q: `−${e3P(3, 2)} มีค่าเท่าใด`, opts: ['−9', '9', '−6', '6'], a: 0 },
  { q: `81 เขียนในรูปเลขยกกำลังที่มีฐานเป็นจำนวนเฉพาะได้ตามข้อใด`, opts: [e3XF(e3P(3, 4)), e3XF(e3P(9, 2)), e3XF(e3P(4, 3)), e3XF(e3P(81, 1))], a: 0 },
  { q: `${e3PF(2, 5, 2)} มีค่าเท่าใด`, opts: [e3XF(fqHTML(4, 25)), e3XF(fqHTML(4, 5)), e3XF(fqHTML(2, 25)), e3XF(fqHTML(4, 10))], a: 0 },
  { q: `${e3P(0.2, 3)} มีค่าเท่าใด`, opts: ['0.008', '0.6', '0.08', '0.0008'], a: 0 },
  { q: `${e3P(3, 4)} × ${e3P(3, 5)} เท่ากับข้อใด`, opts: [e3XF(e3P(3, 9)), e3XF(e3P(3, 20)), e3XF(e3P(9, 9)), e3XF(e3P(9, 20))], a: 0 },
  { q: `${e3P(2, 8)} ÷ ${e3P(2, 3)} เท่ากับข้อใด`, opts: [e3XF(e3P(2, 5)), e3XF(e3P(2, 11)), e3XF(e3P(1, 5)), e3XF(e3P(2, '8÷3'))], a: 0 },
  { q: `${e3P(5, 2)} ÷ ${e3P(5, 4)} เท่ากับข้อใด`, opts: [e3XF(e3P(5, '−2')), e3XF(e3P(5, 2)), e3XF(e3P(5, 6)), e3XF(e3P(1, 2))], a: 0 },
  { q: `${e3P(-6, 0)} มีค่าเท่าใด`, opts: ['1', '−1', '0', '−6'], a: 0 },
  { q: 'ข้อใดไม่นิยาม (ไม่มีความหมาย)', opts: [e3XF(e3P(0, 0)), e3XF(e3P(0, 3)), e3XF(e3P(3, 0)), e3XF(e3P(1, 0))], a: 0 },
  { q: `(${e3P(2, 3)} × ${e3P(2, 5)}) ÷ ${e3P(2, 6)} มีค่าเท่าใด`, opts: ['4', '8', '16', '2'], a: 0 },
  { q: `ถ้า ${e3P(3, 'x')} × ${e3P(3, 2)} = ${e3P(3, 6)} แล้ว x มีค่าเท่าใด`, opts: ['4', '3', '8', '12'], a: 0 },
  { q: `${e3P(4, 3)} เท่ากับข้อใด`, opts: [e3XF(e3P(2, 6)), e3XF(e3P(2, 5)), e3XF(e3P(2, 7)), e3XF(e3P(8, 3))], a: 0 },
  { q: 'ข้อใดอยู่ในรูปสัญกรณ์วิทยาศาสตร์', opts: [e3XF(`4.08 × ${e3P(10, 5)}`), e3XF(`40.8 × ${e3P(10, 4)}`), e3XF(`0.408 × ${e3P(10, 6)}`), e3XF(`4.08 × ${e3P(100, 3)}`)], a: 0 },
  { q: '0.00071 เขียนในรูปสัญกรณ์วิทยาศาสตร์ได้ตามข้อใด', opts: [e3XF(`7.1 × ${e3P(10, '−4')}`), e3XF(`7.1 × ${e3P(10, 4)}`), e3XF(`7.1 × ${e3P(10, '−5')}`), e3XF(`71 × ${e3P(10, '−5')}`)], a: 0 },
  { q: `(4 × ${e3P(10, 3)}) × (3 × ${e3P(10, 5)}) เท่ากับข้อใด`, opts: [e3XF(`1.2 × ${e3P(10, 9)}`), e3XF(`12 × ${e3P(10, 15)}`), e3XF(`1.2 × ${e3P(10, 8)}`), e3XF(`7 × ${e3P(10, 8)}`)], a: 0 },
  { q: `ระยะทางประมาณ 384,000 กิโลเมตร เขียนในรูปสัญกรณ์วิทยาศาสตร์ได้ตามข้อใด`, opts: [e3XF(`3.84 × ${e3P(10, 5)}`), e3XF(`3.84 × ${e3P(10, 6)}`), e3XF(`38.4 × ${e3P(10, 4)}`), e3XF(`3.84 × ${e3P(10, '−5')}`)], a: 0 }
], 3);
LESSONS_M1C3.push({ id: 2319, boss: true, place: 'วังจระเข้ยกกำลัง', title: 'ด่านบอส: ม.1 บทที่ 3 เลขยกกำลัง', short: 'ด่านบอส · ข้อสอบ', tone: 'orange',
  goal: 'ตอบคำถามเรื่องเลขยกกำลังและสัญกรณ์วิทยาศาสตร์ 20 ข้อ ตอบถูก 16 ข้อขึ้นไปเพื่อชนะจระเข้ยกกำลัง',
  exam: EXAM_M1C3, pass: 16, bossName: 'จระเข้ยกกำลัง', bossPal: 'orange', emblem: 'xⁿ', bossKind: 'croc',
  winLine: 'ชนะจระเข้ยกกำลังแล้ว! ใช้สมบัติของเลขยกกำลังได้คล่องมาก', loseLine: 'จระเข้ยกกำลังยังเฝ้าวังน้ำอยู่ ลองทวนสมบัติการคูณและการหารอีกนิดแล้วมาสู้ใหม่นะ!' });
