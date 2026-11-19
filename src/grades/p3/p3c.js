/* =========================================================
   GRADE 3 · CHAPTER 5 — แผนภูมิรูปภาพและตารางทางเดียว  (ป่าดิบชื้น · ภาคเรียนที่ 1 · เมือง 60 · ด่าน 1341–1345 · บอส 1359)
   reuses the pictograph kit of p2c (ppHTML / ppBuilder / Q.ppRead / ppNum / ppTap / ppSort / simPpKey) with NEW P3 data (keys 3–50)
   NEW: survey sheet with tally (simPc3Survey · Q.pc3Count) · one-way table pc3TabHTML (vertical / horizontal) and its questions ·
        pc3Cells = several blanks sharing one keypad → fill a one-way table from text / pictograph / tally / clues
   ========================================================= */
/* ---------- one-way table ---------- */
function pc3TabHTML(T, o = {}) { const u = T.unit, hz = o.horiz ?? T.horiz, cell = (v, i) => o.blank && o.blank.includes(i) ? `<td class="n pc3-b" data-i="${i}"></td>` : `<td class="n">${fmt(v)}</td>`;
  const body = hz ? `<tr class="hd"><td>${T.head}</td>${T.rows.map(([n], i) => `<td class="${o.hl === i ? 'hl' : ''}" data-r="${i}">${n}</td>`).join('')}</tr><tr><td class="hd2">จำนวน (${u})</td>${T.rows.map(([, v], i) => cell(v, i)).join('')}</tr>`
    : `<tr class="hd"><td>${T.head}</td><td>จำนวน (${u})</td></tr>${T.rows.map(([n, v], i) => `<tr class="pc3-r${o.hl === i ? ' hl' : ''}" data-r="${i}"><td>${n}</td>${cell(v, i)}</tr>`).join('')}`;
  return `<div class="pc3-tab${hz ? ' hz' : ''}">${o.noTitle ? '' : `<div class="pc3-tt">${T.title}</div>`}<table>${body}</table></div>`; }
/* several blanks, one keypad (cells live wherever the caller puts the slot buttons) */
function pc3Cells(ctx, want, o = {}) { const val = want.map(() => ''); let cur = 0, done = false; const msg = h('div', { class: 'pad-msg' });
  const slots = want.map((_, i) => h('button', { class: 'mc-slot pc3-s', onclick: e => { e.stopPropagation(); if (!done) { cur = i; paint(); } } }, '?'));
  const paint = () => slots.forEach((s, i) => { s.textContent = val[i] === '' ? '?' : fmt(+val[i]); s.classList.toggle('on', i === cur && !done); s.classList.toggle('filled', val[i] !== ''); });
  const type = d => { if (done) return; sfx.tap(); msg.textContent = ''; slots[cur].classList.remove('bad'); val[cur] = (val[cur] + d).slice(-7).replace(/^0+(\d)/, '$1'); paint(); };
  const ok = () => { if (done) return; if (val[cur] !== '' && val.some(v => v === '')) { cur = val.findIndex(v => v === ''); paint(); return; }
    if (val[cur] === '') { msg.textContent = 'กดตัวเลขในช่องที่เลือกก่อน'; return; }
    const bad = val.map((v, i) => +v !== want[i]), good = !bad.some(Boolean); slots.forEach((s, i) => s.classList.toggle('bad', bad[i]));
    if (good) { done = true; wrap.classList.add('done'); } ctx.check(good, o.hint);
    if (!good) { msg.textContent = `ยังผิด ${bad.filter(Boolean).length} ช่อง (สีแดง) ลองใหม่`; cur = bad.indexOf(true); paint(); } };
  const kp = h('div', { class: 'keypad' }); [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: () => type(d) }, d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: () => { sfx.tap(); val[cur] = val[cur].slice(0, -1); paint(); } }, icon('left')), h('button', { class: 'btn', onclick: () => type(0) }, '0'), h('button', { class: 'btn primary', 'aria-label': 'ตกลง', onclick: ok }, icon('check')));
  const wrap = h('div', { class: 'ans mc-ans ia pc3-ans' }, h('div', { class: 'cap' }, 'แตะช่อง ? แล้วกดตัวเลข · ✓ ไปช่องถัดไป/ตรวจ'), kp, msg);
  wrap.reveal = () => { want.forEach((w, i) => { val[i] = String(w); }); done = true; slots.forEach(s => s.classList.remove('bad')); paint(); wrap.classList.add('done', 'revealed'); }; wrap.ansText = want.map(String);
  paint(); return { wrap, slots }; }
/* ---------- survey sheet: responses as word chips ---------- */
const pc3Resp = S => { const out = []; S.cats.forEach(([c, n]) => { for (let i = 0; i < n; i++) out.push(c); }); let seed = S.seed || 7; return out.map(c => [c, (seed = (seed * 9301 + 49297) % 233280)]).sort((a, b) => a[1] - b[1]).map(x => x[0]); };
const pc3SheetHTML = S => `<div class="pc3-sheet"><div class="pc3-tt">${S.title}</div><div class="pc3-chips" style="--c:${S.cols || 6}">${pc3Resp(S).map((c, i) => `<span class="pc3-chip" data-i="${i}">${c}</span>`).join('')}</div></div>`;
function pc3Mark(f) { f.classList.add('ia'); f.querySelectorAll('.pc3-chip').forEach(c => c.addEventListener('click', e => { e.stopPropagation(); c.classList.toggle('x'); sfx.tap(); })); }
/* ---------- teaching sims ---------- */
function simPc3Survey(S) { // tap every answer once → a tally mark goes to its group
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig', html: pc3SheetHTML(S) }), tab = h('div', { class: 'pc3-tab' }), out = fNote(), cnt = Object.fromEntries(S.cats.map(([c]) => [c, 0])); let left = S.cats.reduce((a, c) => a + c[1], 0);
  const draw = () => { tab.innerHTML = `<table><tr class="hd"><td>${S.head}</td><td>รอยขีด</td><td>จำนวน (${S.unit})</td></tr>${S.cats.map(([c]) => `<tr><td>${c}</td><td class="tl">${tallySVG(cnt[c], { scale: .9 })}</td><td class="n">${left ? '' : cnt[c]}</td></tr>`).join('')}</table>`; };
  fig.addEventListener('click', e => { const c = e.target.closest('.pc3-chip'); if (!c || c.classList.contains('x')) return; e.stopPropagation(); c.classList.add('x'); cnt[c.textContent]++; left--; sfx.pop(Math.min(8, cnt[c.textContent])); draw();
    out.innerHTML = left ? `${c.textContent} +1 · เหลืออีก ${left} คำตอบ` : `ครบทุกคำตอบ!<br>นับรอยขีด (กลุ่มละ 5) ได้จำนวนของแต่ละรายการ`; if (!left) { sfx.ok(); teachDone(box); } });
  draw(); out.innerHTML = 'แตะคำตอบทีละคำ (จะขีดฆ่าไว้กันนับซ้ำ)<br>รอยขีดจะไปอยู่ในแถวของคำนั้น'; box.append(fig, tab, out); return box; }
function simPc3Read(D) { // tap rows: count by the key
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'ppwrap', html: ppHTML(D) }), out = fNote(), seen = new Set();
  ppTapCount(fig.firstChild, D, { nums: true, out, onTap: i => { seen.add(i); if (seen.size >= 3) teachDone(box); } }); out.innerHTML = `1 รูปแทน ${D.k} ${D.unit} · แตะแถวเพื่อนับเพิ่มทีละ ${D.k}`; box.append(fig, out); return box; }
function simPc3Table(T) { // tap two rows → compare
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(); let sel = [], n = 0;
  const draw = () => { fig.innerHTML = pc3TabHTML(T); fig.querySelectorAll('[data-r]').forEach(r => r.classList.toggle('hl', sel.includes(+r.dataset.r))); };
  fig.addEventListener('click', e => { const r = e.target.closest('[data-r]'); if (!r) return; e.stopPropagation(); const i = +r.dataset.r; sel = [...sel.filter(x => x !== i), i].slice(-2); sfx.tap(); draw(); n++;
    const [a, b] = sel.map(k => T.rows[k]); out.innerHTML = sel.length < 2 ? `${a[0]} ${fmt(a[1])} ${T.unit} · แตะอีกแถวเพื่อเปรียบเทียบ` : `${a[0]} ${fmt(a[1])} · ${b[0]} ${fmt(b[1])}<br>ต่างกัน ${fmt(Math.abs(a[1] - b[1]))} ${T.unit} · รวมกัน ${fmt(a[1] + b[1])} ${T.unit}`; if (n >= 3) teachDone(box); });
  draw(); out.innerHTML = 'แตะแถวในตาราง 2 แถว'; box.append(fig, out); return box; }

/* ---------- question types ---------- */
const PC3_UNIT = { 'คน': 'คน' };
Object.assign(Q, {
  pc3Count({ S, c }) { const n = S.cats.find(x => x[0] === c)[1], q = `จากข้อมูล ${S.what}ที่เลือก<b>${c}</b>มีกี่${S.unit}`;
    return { prompt: q + ' <small>(แตะคำเพื่อขีดฆ่าขณะนับ)</small>', say: q.replace(/<[^>]+>/g, ''), __sig: `pc3c ${S.title} ${c}`, mount(bd, ctx) { const f = h('div', { class: 'p4-fig', html: pc3SheetHTML(S) }); pc3Mark(f);
      bd.append(h('div', { class: 't6-q p4-q p2q' }, f, h('div', { class: 'rowstack' }, answerBox(ctx, String(n), { hint: `หาคำว่า “${c}” ทีละคำ ขีดรอยขีดไว้ ครบ 5 ขีดทับเป็นกลุ่ม` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, S.unit)))); } }; },
  pc3Tally({ n, what }) { const q = `รอยขีดนี้แสดงจำนวน${what || ''}เท่าใด`;
    return { prompt: q, say: q, __sig: 'pc3t ' + n, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig pc3-tly', html: tallySVG(n, { scale: 1.5 }) }), answerBox(ctx, String(n), { hint: 'นับกลุ่มละ 5 (4 ขีดตั้ง + 1 ขีดทับ) แล้วนับเพิ่มขีดที่เหลือ' }))); } }; },
  pc3TallyPick({ n }) { const opts = [...new Set([n, n + 1, n - 1, n + 5, n - 5].filter(x => x > 0))].slice(0, 4), q = `ข้อใดเป็นรอยขีดแสดงจำนวน <b>${n}</b>`;
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: 'pc3tp ' + n, mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, choices(ctx, shuffle(opts).map(v => ({ value: v, label: `<span class="pc3-tlo">${tallySVG(v, { scale: .85 })}</span>` })), n, { hint: 'กลุ่มที่มีขีดทับ = 5 · นับกลุ่มละ 5 ก่อน แล้วนับขีดที่เหลือ' }))); } }; },
  pc3TRead({ T, i }) { const [n, v] = T.rows[i], q = `จากตาราง ${n}มีจำนวนเท่าใด`;
    return { prompt: q, say: q, __sig: `pc3r ${T.title} ${i}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: pc3TabHTML(T) }), h('div', { class: 'rowstack' }, answerBox(ctx, String(v), { hint: `หา “${n}” ในช่องรายการ แล้วอ่านจำนวนในช่องคู่กัน` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, T.unit)))); } }; },
  pc3TNum({ T, q, a, hint, unit, key }) {
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `pc3n ${T.title} ${key || q}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: pc3TabHTML(T) }), h('div', { class: 'rowstack' }, answerBox(ctx, String(a), { hint }), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit ?? T.unit)))); } }; },
  pc3TTap({ T, ask }) { const vals = T.rows.map(r => r[1]), t = ask === 'max' ? Math.max(...vals) : Math.min(...vals), q = `แตะรายการที่มีจำนวน<b>${ask === 'max' ? 'มากที่สุด' : 'น้อยที่สุด'}</b>ในตาราง`;
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), __sig: `pc3tt ${T.title} ${ask}`, mount(bd, ctx) { const f = h('div', { class: 'p4-fig', html: pc3TabHTML(T) }); const tb = f.querySelector('.pc3-tab');
      ixTapFig(tb, '[data-r]', ctx, i => T.rows[i][1] === t, 'เทียบตัวเลขทีละหลัก เริ่มจากหลักที่มีค่ามากที่สุด'); tb.querySelectorAll('[data-r]').forEach(r => { r.dataset.i = r.dataset.r; });
      bd.append(h('div', { class: 'colstack' }, f, h('div', { class: 'cap ixcap' }, 'แตะที่แถวในตารางได้เลย'))); } }; },
  pc3TFill({ T, src, give = [] }) { const blanks = T.rows.map((_, i) => i).filter(i => !give.includes(i)), q = 'เขียนตารางทางเดียวจากข้อมูลให้ครบ';
    return { prompt: q + ' <small>(แตะช่อง ? แล้วกดตัวเลข)</small>', say: q, __sig: `pc3f ${T.title} ${src.kind}`, mount(bd, ctx) { const C = pc3Cells(ctx, blanks.map(i => T.rows[i][1]), { hint: src.kind === 'pp' ? `นับรูปแล้วคูณด้วยค่าของ 1 รูป (${src.D.k})` : src.kind === 'tally' ? 'นับรอยขีดกลุ่มละ 5' : src.kind === 'clue' ? 'เริ่มจากข้อมูลที่รู้แน่นอนก่อน แล้วบวกหรือลบตามเงื่อนไข' : 'อ่านข้อมูลทีละรายการ แล้วเติมให้ตรงแถว' });
      const top = src.kind === 'pp' ? ppHTML(src.D) : src.kind === 'tally' ? `<div class="pc3-tab"><div class="pc3-tt">${src.title || T.title}</div><table>${T.rows.map(([n, v]) => `<tr><td>${n}</td><td class="tl">${tallySVG(v, { scale: .9 })}</td></tr>`).join('')}</table></div>`
        : `<div class="pc3-src">${(src.lines || T.rows.map(([n, v]) => `${n} ${fmt(v)} ${T.unit}`)).map(l => `<div>• ${l}</div>`).join('')}</div>`;
      const tb = h('div', { html: pc3TabHTML(T, { blank: blanks }) }); tb.querySelectorAll('.pc3-b').forEach(td => td.append(C.slots[blanks.indexOf(+td.dataset.i)]));
      bd.append(h('div', { class: 't6-q p4-q p2q pc3-fillq' }, h('div', { class: 'pc3-pair' }, h('div', { class: 'p4-fig', html: top }), h('div', { class: 'p4-fig pc3-fillt' }, tb)), C.wrap)); } }; }
});
const pc3TSort = (T, dir) => ({ ...Q.ixSort({ q: `เรียงรายการจาก<b>${dir === 'desc' ? 'มากไปน้อย' : 'น้อยไปมาก'}</b>`, fig: pc3TabHTML(T), items: T.rows.map(r => ({ label: r[0], v: r[1] })), dir, slotLabels: T.rows.map((_, i) => i ? '' : dir === 'desc' ? 'มากที่สุด' : 'น้อยที่สุด') }), __sig: `pc3s ${T.title} ${dir}` });
const pc3TTitle = T => { const wrong = shuffle(PC3_TB.filter(x => x !== T)).slice(0, 2).map(x => x.title); return { ...Q.p4Pick({ fig: pc3TabHTML(T, { noTitle: true }), q: 'ตารางนี้ควรมีชื่อตารางว่าอะไร', opts: [T.title, ...wrong], right: T.title, hint: 'ดูหัวตาราง รายการ และหน่วยของจำนวน' }), __sig: `pc3ti ${T.title}` }; };
/* table questions built from the numbers of each table */
function pc3TQs(T) { const R = T.rows, u = T.unit, i = rnd(0, R.length - 1); let a = rnd(0, R.length - 1), b = (a + rnd(1, R.length - 1)) % R.length; if (R[a][1] < R[b][1]) [a, b] = [b, a];
  const tot = R.reduce((s, r) => s + r[1], 0), pr = T.price, add = T.add || 10;
  return [Q.pc3TRead({ T, i }), Q.pc3TTap({ T, ask: pick(['max', 'min']) }),
    Q.pc3TNum({ T, q: `${R[a][0]}มากกว่า${R[b][0]}กี่${u}`, a: R[a][1] - R[b][1], hint: 'จำนวนมาก − จำนวนน้อย', key: `d${a}-${b}` }),
    Q.pc3TNum({ T, q: `รวมทุกรายการมีทั้งหมดกี่${u}`, a: tot, hint: 'บวกจำนวนของทุกรายการ', key: 'tot' }),
    pr ? Q.pc3TNum({ T, q: `ถ้า${R[i][0]}ราคา${pr[1]}ละ ${pr[0]} บาท จะได้เงินทั้งหมดกี่บาท`, a: R[i][1] * pr[0], unit: 'บาท', hint: `จำนวน × ${pr[0]}`, key: 'p' + i })
       : Q.pc3TNum({ T, q: `ถ้า${R[i][0]}เพิ่มขึ้นอีก ${add} ${u} จะมีกี่${u}`, a: R[i][1] + add, hint: `จำนวนเดิม + ${add}`, key: 'a' + i }),
    pc3TSort(T, pick(['asc', 'desc'])), pc3TTitle(T)]; }
/* pictograph questions built from each chart */
function pc3PQs(D) { const R = D.rows, u = D.unit, i = rnd(0, R.length - 1); let a = rnd(0, R.length - 1), b = (a + rnd(1, R.length - 1)) % R.length; if (R[a][1] < R[b][1]) [a, b] = [b, a];
  const tot = R.reduce((s, r) => s + r[1], 0), sg = k => ({ __sig: `pc3p ${D.title} ${k}` });
  return [{ ...Q.ppRead({ D, i }), ...sg('r' + i) }, { ...Q.ppTap({ D, ask: pick(['max', 'min']) }), ...sg('t') },
    { ...Q.ppNum({ D, q: `${R[a][0]}มากกว่า${R[b][0]}กี่${u}`, a: R[a][1] - R[b][1], hint: 'หาจำนวนของแต่ละแถวก่อน แล้วลบกัน' }), ...sg(`d${a}${b}`) },
    { ...Q.ppNum({ D, q: `รวมทั้งหมดกี่${u}`, a: tot, hint: 'หาจำนวนของทุกแถว แล้วบวกกัน' }), ...sg('tot') },
    { ...ppKeyQ(D), ...sg('k') }, { ...ppSort(D, pick(['asc', 'desc'])), ...sg('s') },
    (j => ({ ...Q.ppNum({ D, q: `แถว${R[j][0]}มีกี่รูป และ${R[j][0]}มีจำนวน ${fmt(R[j][1])} ${u} · ถ้าเพิ่มอีก ${D.k * 2} ${u} ต้องวาดทั้งหมดกี่รูป`, a: R[j][1] / D.k + 2, unit: 'รูป', hint: `(${R[j][1]} + ${D.k * 2}) ÷ ${D.k}` }), ...sg('n' + j) }))(pick(R.map((r, k) => k).filter(k => R[k][1] % D.k === 0)))]; }
const pc3KeyQ = D => { const ks = [2, 3, 4, 5, 6, 7, 10, 20, 25, 50].filter(k => k !== D.k && D.rows.some(r => r[1] % k)), q = 'ถ้าจะวาดแผนภูมิรูปภาพโดย<b>ไม่ต้องใช้ครึ่งรูป</b> ควรให้ 1 รูปแทนจำนวนใด';
  return { ...Q.p4Pick({ fig: `<div class="pc3-src"><div class="pc3-tt">${D.title}</div>${D.rows.map(([n, v]) => `<div>• ${n} ${fmt(v)} ${D.unit}</div>`).join('')}</div>`, q, opts: [D.k, ...shuffle(ks).slice(0, 2)].map(String), right: String(D.k), hint: 'ทุกจำนวนต้องหารด้วยค่าของ 1 รูปได้ลงตัว' }), __sig: 'pc3k ' + D.title }; };

/* ---------- data ---------- */
const PC3S = (title, what, head, unit, cats, seed, cols) => ({ title, what, head, unit, cats, seed, cols });
const PC3_SURV = [PC3S('วิธีที่นักเรียนเดินทางมาโรงเรียน', 'นักเรียน', 'วิธีเดินทาง', 'คน', [['รถบัส', 11], ['จักรยาน', 6], ['เดิน', 5], ['มอเตอร์ไซค์', 5], ['รถยนต์', 3]], 11), // 
  PC3S('สีที่นักเรียนห้อง ป.3/2 ชอบ', 'นักเรียน', 'สี', 'คน', [['แดง', 7], ['ฟ้า', 9], ['เขียว', 4], ['ชมพู', 6]], 23), PC3S('ผลไม้ที่นักเรียนชอบ', 'นักเรียน', 'ผลไม้', 'คน', [['มะม่วง', 8], ['ส้ม', 4], ['แตงโม', 6], ['องุ่น', 9], ['กล้วย', 3]], 37),
  PC3S('กีฬาที่นักเรียนชอบเล่น', 'นักเรียน', 'กีฬา', 'คน', [['ฟุตบอล', 10], ['แบดมินตัน', 7], ['ว่ายน้ำ', 5], ['บาสเกตบอล', 3]], 41), PC3S('สัตว์เลี้ยงที่บ้านของนักเรียน', 'นักเรียน', 'สัตว์เลี้ยง', 'คน', [['สุนัข', 9], ['แมว', 8], ['ปลา', 4], ['กระต่าย', 2], ['นก', 3]], 53),
  PC3S('เมนูอาหารกลางวันที่นักเรียนเลือก', 'นักเรียน', 'เมนู', 'คน', [['ข้าวผัด', 6], ['ก๋วยเตี๋ยว', 8], ['ข้าวมันไก่', 5], ['ผัดกะเพรา', 7]], 67)];
const PC3_GRP = [{ bins: ['ของเล่น', 'ของใช้'], items: [['ม้าโยก', 0], ['หุ่นยนต์', 0], ['ตุ๊กตาหมี', 0], ['รถของเล่น', 0], ['ไดโนเสาร์ของเล่น', 0], ['กล้องถ่ายรูป', 1], ['กระเป๋า', 1], ['ถุงเท้า', 1], ['เก้าอี้', 1], ['แปรงสีฟัน', 1]] }, // 
  { bins: ['ผลไม้', 'เครื่องดื่ม', 'ขนม'], items: [['มะม่วง', 0], ['ส้ม', 0], ['แตงโม', 0], ['นม', 1], ['น้ำผลไม้', 1], ['ชาเย็น', 1], ['คุกกี้', 2], ['มันฝรั่งทอด', 2], ['ลูกอม', 2]] }, // 
  { bins: ['อุปกรณ์ทำครัว', 'เฟอร์นิเจอร์', 'อุปกรณ์ทำความสะอาด'], items: [['กระทะ', 0], ['หม้อ', 0], ['ตะหลิว', 0], ['โซฟา', 1], ['ตู้เสื้อผ้า', 1], ['โต๊ะ', 1], ['ไม้กวาด', 2], ['ไม้ถูพื้น', 2], ['ที่ตักผง', 2]] }, // 
  { bins: ['ยานพาหนะทางบก', 'ทางน้ำ', 'ทางอากาศ'], items: [['รถไฟ', 0], ['รถตู้', 0], ['จักรยาน', 0], ['เรือใบ', 1], ['เรือข้ามฟาก', 1], ['เรือหางยาว', 1], ['เครื่องบิน', 2], ['เฮลิคอปเตอร์', 2], ['บอลลูน', 2]] },
  { bins: ['สัตว์บก', 'สัตว์น้ำ', 'สัตว์ปีก'], items: [['ช้าง', 0], ['ม้า', 0], ['กระต่าย', 0], ['ปลาทอง', 1], ['ปลาหมึก', 1], ['ปลาดาว', 1], ['นกแก้ว', 2], ['เป็ด', 2], ['นกเงือก', 2]] },
  { bins: ['เครื่องเขียน', 'อุปกรณ์กีฬา'], items: [['ดินสอ', 0], ['ยางลบ', 0], ['ไม้บรรทัด', 0], ['กบเหลาดินสอ', 0], ['ลูกฟุตบอล', 1], ['ไม้แบดมินตัน', 1], ['เชือกกระโดด', 1], ['ห่วงฮูลาฮูป', 1]] }];
const PC3D = (title, what, unit, k, keyE, rows, orient = 'h') => ({ title, what, unit, k, keyE, rows, orient });
const PC3_PP = [PC3D('จำนวนขนมที่แม่ขายได้ใน 5 วัน', 'ขนม', 'ชิ้น', 10, 'cupcake', [['วันจันทร์', 40], ['วันอังคาร', 55], ['วันพุธ', 30], ['วันพฤหัสบดี', 45], ['วันศุกร์', 60]]), // 
  PC3D('ผลไม้ที่นักเรียนชั้น ป.2 ชอบ', 'นักเรียน', 'คน', 2, 'girl', [['ส้ม', 8], ['กล้วย', 6], ['แอปเปิล', 12], ['ฝรั่ง', 5], ['องุ่น', 9]]), // 
  PC3D('ผลไม้ที่นักเรียนชั้น ป.3 ชอบ', 'นักเรียน', 'คน', 3, 'girl', [['ส้ม', 12], ['กล้วย', 9], ['แอปเปิล', 6], ['ฝรั่ง', 15], ['องุ่น', 3]], 'v'),
  PC3D('จำนวนคนที่ทำกิจกรรมต่าง ๆ ในวันหยุด', 'คน', 'คน', 7, 'girl', [['ดูโทรทัศน์', 35], ['เล่นเกม', 49], ['อ่านหนังสือ', 21], ['ทำการบ้าน', 28], ['ออกกำลังกาย', 14]]), // 
  PC3D('จำนวนผักที่ร้านศรีเจริญจำหน่าย', 'ผัก', 'กิโลกรัม', 20, 'cabbage', [['มะเขือม่วง', 60], ['พริกหวาน', 80], ['กะหล่ำดอก', 100], ['ฟักทอง', 80], ['พริก', 120]], 'v'), // 
  PC3D('จำนวนดอกกุหลาบที่ลุงเก็บได้', 'ดอกกุหลาบ', 'ดอก', 50, 'rose', [['มกราคม', 200], ['กุมภาพันธ์', 350], ['มีนาคม', 250], ['เมษายน', 125]]), // 
  PC3D('จำนวนลูกหมูที่เกิดในฟาร์ม', 'ลูกหมู', 'ตัว', 5, 'pig', [['มกราคม', 20], ['กุมภาพันธ์', 30], ['มีนาคม', 25], ['เมษายน', 40], ['พฤษภาคม', 35]]), // 
  PC3D('เงินฝากสะสมของนักเรียน', 'เงิน', 'บาท', 50, 'coin', [['นัท', 200], ['กาย', 250], ['บอล', 400], ['ส้ม', 450], ['พีพี', 100]]), // 
  PC3D('ของเล่นที่ขายได้ในวันเสาร์', 'ของเล่น', 'ชิ้น', 5, 'teddy', [['ตุ๊กตา', 20], ['รถของเล่น', 15], ['ลูกบอล', 10], ['จิ๊กซอว์', 5], ['ตัวต่อ', 25]]), // 
  PC3D('หนังสือที่ถูกยืมจากห้องสมุดใน 2 สัปดาห์', 'หนังสือ', 'เล่ม', 6, 'book', [['การ์ตูน', 30], ['นิยาย', 18], ['สารคดี', 12], ['วิชาการ', 6]]), // 
  PC3D('ตั๋วภาพยนตร์ที่ขายได้ในวันหยุด', 'ตั๋ว', 'ใบ', 20, 'star', [['ทั่วไป', 120], ['เด็ก', 90], ['ผู้สูงอายุ', 40], ['หมู่คณะ', 70]]), // 
  PC3D('ขวดพลาสติกที่แต่ละชั้นเก็บได้', 'ขวด', 'ขวด', 10, 'milk', [['ป.1', 35], ['ป.2', 50], ['ป.3', 65], ['ป.4', 40], ['ป.5', 55]], 'v'),
  PC3D('ผลไม้ที่ร้านป้าแดงขายได้', 'ผลไม้', 'ผล', 4, 'mango', [['มะม่วง', 24], ['ทุเรียน', 10], ['มังคุด', 18], ['เงาะ', 32]]),
  PC3D('ต้นไม้ที่แต่ละห้องปลูก', 'ต้นไม้', 'ต้น', 3, 'tree', [['ป.3/1', 18], ['ป.3/2', 24], ['ป.3/3', 15], ['ป.3/4', 21]])];
const PC3T = (title, head, unit, rows, o = {}) => ({ title, head, unit, rows, ...o });
const PC3_TB = [PC3T('จำนวนเครื่องดื่มที่ร้านกาแฟขายได้ในวันนี้', 'เครื่องดื่ม', 'แก้ว', [['กาแฟเย็น', 52], ['ชาเขียว', 40], ['น้ำส้ม', 35], ['สมูทตี้ผลไม้', 25], ['โกโก้เย็น', 30]], { price: [20, 'แก้ว'] }), // 
  PC3T('ผลผลิตแอปเปิลของแต่ละสวนในปี พ.ศ. 2568', 'สวนแอปเปิล', 'กิโลกรัม', [['สวนสินใจ', 573], ['สวนมานะ', 237], ['สวนสมจิตร', 400], ['สวนกุลยา', 766]], { price: [40, 'กิโลกรัม'] }), // 
  PC3T('จำนวนหนังสือที่ร้านดาด้าขายได้ในวันจันทร์', 'ประเภท', 'เล่ม', [['นิยาย', 432], ['การ์ตูน', 213], ['วิชาการ', 300], ['ประวัติศาสตร์', 348], ['ศิลปะ', 233]], { add: 45 }), // 
  PC3T('ค่าใช้จ่ายของครอบครัวหนึ่งในเดือนมกราคม', 'รายการ', 'บาท', [['ค่าอาหาร', 12000], ['ค่าไฟฟ้า', 2500], ['ค่าน้ำประปา', 800], ['ค่าอินเทอร์เน็ต', 1300], ['ค่าผ่อนบ้าน', 10000]], { horiz: true, add: 500 }), // 
  PC3T('จำนวนผู้สมัครสมาชิกดูหนังออนไลน์แต่ละแบบ', 'แบบสมาชิก', 'คน', [['พื้นฐาน', 200], ['มาตรฐาน', 350], ['พรีเมียม', 150], ['ครอบครัว', 100], ['นักเรียน', 75]], { add: 25 }), // 
  PC3T('การใช้ไฟฟ้าของบ้านหลังหนึ่ง', 'เดือน', 'หน่วย', [['มกราคม', 350], ['กุมภาพันธ์', 320], ['มีนาคม', 370], ['เมษายน', 400], ['พฤษภาคม', 380]], { horiz: true, price: [5, 'หน่วย'] }), // 
  PC3T('จำนวนนักเรียนในชมรมต่าง ๆ', 'ชมรม', 'คน', [['ฟุตบอล', 46], ['ดนตรี', 38], ['วาดภาพ', 27], ['หุ่นยนต์', 52], ['ภาษาอังกฤษ', 31]], { add: 8 }),
  PC3T('จำนวนขวดพลาสติกที่แต่ละห้องเก็บได้', 'ห้อง', 'ขวด', [['ป.3/1', 128], ['ป.3/2', 96], ['ป.3/3', 154], ['ป.3/4', 117]], { horiz: true, price: [2, 'ขวด'] }),
  PC3T('จำนวนผู้เข้าชมสวนสัตว์ในแต่ละวัน', 'วัน', 'คน', [['จันทร์', 1250], ['อังคาร', 980], ['พุธ', 1105], ['พฤหัสบดี', 1320], ['ศุกร์', 1875]], { add: 150 }),
  PC3T('ปริมาณน้ำฝนในแต่ละเดือน', 'เดือน', 'มิลลิเมตร', [['พฤษภาคม', 165], ['มิถุนายน', 210], ['กรกฎาคม', 245], ['สิงหาคม', 280], ['กันยายน', 315]], { horiz: true, add: 20 }),
  PC3T('จำนวนไข่ที่ฟาร์มเก็บได้ในแต่ละวัน', 'วัน', 'ฟอง', [['จันทร์', 236], ['อังคาร', 248], ['พุธ', 219], ['พฤหัสบดี', 260], ['ศุกร์', 254]], { price: [4, 'ฟอง'] }),
  PC3T('ระยะทางที่นักปั่นจักรยานแต่ละคนปั่นได้', 'นักปั่น', 'กิโลเมตร', [['เอก', 42], ['บี', 35], ['ซี', 58], ['ดิว', 47]], { add: 12 })];
/* fill-the-table sources (lesson 5) */
const PC3_FILL = [{ T: PC3_TB[4], src: { kind: 'text' } }, { T: PC3_TB[5], src: { kind: 'text', lines: ['มกราคม ใช้ไฟฟ้า 350 หน่วย', 'กุมภาพันธ์ ใช้ไฟฟ้า 320 หน่วย', 'มีนาคม ใช้ไฟฟ้า 370 หน่วย', 'เมษายน ใช้ไฟฟ้า 400 หน่วย', 'พฤษภาคม ใช้ไฟฟ้า 380 หน่วย'] } },
  { T: PC3T('ตั๋วภาพยนตร์ที่ขายได้ในวันหยุด', 'ประเภทตั๋ว', 'ใบ', PC3_PP[10].rows), src: { kind: 'pp', D: PC3_PP[10] } }, { T: PC3T('ขวดพลาสติกที่แต่ละชั้นเก็บได้', 'ชั้น', 'ขวด', PC3_PP[11].rows), src: { kind: 'pp', D: PC3_PP[11] } },
  { T: PC3T('ต้นไม้ที่แต่ละห้องปลูก', 'ห้อง', 'ต้น', PC3_PP[13].rows), src: { kind: 'pp', D: PC3_PP[13] } },
  { T: PC3T('วิธีที่นักเรียนเดินทางมาโรงเรียน', 'วิธีเดินทาง', 'คน', PC3_SURV[0].cats), src: { kind: 'tally' } }, { T: PC3T('สัตว์เลี้ยงที่บ้านของนักเรียน', 'สัตว์เลี้ยง', 'คน', PC3_SURV[4].cats), src: { kind: 'tally' } },
  { T: PC3T('ผลผลิตผลไม้ของสวนป้าจันทร์ในเดือนเมษายน', 'ผลไม้', 'ต้น', [['ลำไย', 55], ['มะม่วง', 40], ['ลิ้นจี่', 20], ['กล้วย', 45]]), src: { kind: 'clue', lines: ['ลำไยได้ผลผลิต 55 ต้น', 'ลำไยได้ผลผลิตมากกว่ามะม่วง 15 ต้น', 'มะม่วงได้ผลผลิตมากกว่าลิ้นจี่ 20 ต้น', 'กล้วยได้ผลผลิตน้อยกว่าลำไย 10 ต้น'] } }, // (ปรับ)
  { T: PC3T('คะแนนสอบคณิตศาสตร์ของนักเรียน 4 คน', 'ชื่อ', 'คะแนน', [['ฟ้า', 18], ['ดิน', 15], ['ลม', 20], ['ไฟ', 12]]), src: { kind: 'clue', lines: ['ลมได้ 20 คะแนน', 'ฟ้าได้น้อยกว่าลม 2 คะแนน', 'ดินได้น้อยกว่าฟ้า 3 คะแนน', 'ไฟได้น้อยกว่าดิน 3 คะแนน'] } },
  { T: PC3T('จำนวนนักเรียนที่มาโรงเรียนในสัปดาห์นี้', 'วัน', 'คน', [['จันทร์', 128], ['อังคาร', 131], ['พุธ', 125], ['พฤหัสบดี', 130], ['ศุกร์', 127]]), src: { kind: 'text', lines: ['วันจันทร์มีนักเรียนมา 128 คน', 'วันอังคารมา 131 คน', 'วันพุธมา 125 คน', 'วันพฤหัสบดีมา 130 คน', 'วันศุกร์มา 127 คน'] } }];

/* ---------- lessons ---------- */
const L3P = (no, place, title, short, goal, teach, game) => ({ id: 1340 + no, no, place, title, short, tone: TONES5[(no + 3) % 6], goal, teach, game, learned: true });
const pc3GroupQ = () => { const G = pick(PC3_GRP), it = shuffle(G.items).slice(0, 6); return { ...Q.ixGroup({ q: 'จำแนกสิ่งของลงกลุ่มให้ถูกต้อง', bins: G.bins, items: it.map(([label, bin]) => ({ label, bin, why: `${label} อยู่ในกลุ่ม${G.bins[bin]}` })), hint: 'สิ่งที่มีลักษณะหรือใช้งานเหมือนกันอยู่กลุ่มเดียวกัน' }), __sig: 'pc3g ' + it.map(x => x[0]).sort().join() }; };
const pc3MostQ = S => { const mx = S.cats.reduce((a, c) => c[1] > a[1] ? c : a), q = `จากข้อมูล ${S.what}เลือกสิ่งใด<b>มากที่สุด</b>`;
  return { ...Q.p4Pick({ fig: pc3SheetHTML(S), q, opts: shuffle(S.cats.map(c => c[0])).slice(0, 4).concat(mx[0]).filter((x, i, A) => A.indexOf(x) === i).slice(-4), right: mx[0], hint: 'นับแต่ละคำด้วยรอยขีด แล้วเปรียบเทียบ' }), __sig: 'pc3m ' + S.title }; };
const pc3Pick = (A, k) => shuffle(A).slice(0, k);
const LESSONS_P3C5 = [
  L3P(1, 'ป่าสำรวจ', 'การเก็บรวบรวมข้อมูลและการจำแนกข้อมูล', 'เก็บและจำแนกข้อมูล', 'เก็บรวบรวมข้อมูลด้วยรอยขีด และจำแนกข้อมูลเป็นกลุ่ม',
    [...learnStep('ยินดีต้อนรับสู่ <b>ป่าสำรวจ</b>! มาเก็บ<b>ข้อมูล</b>กัน', 'ยินดีต้อนรับสู่ป่าสำรวจ มาเก็บข้อมูลกัน', [
      { fig: pc3SheetHTML({ ...PC3_SURV[1], cols: 6 }), name: 'ข้อมูล', text: 'ข้อเท็จจริงที่เก็บมา เช่น ถามเพื่อนว่าชอบสีอะไร' },
      { fig: `<div class="pc3-tab"><table><tr class="hd"><td>ของเล่น</td><td>ของใช้</td></tr><tr><td>ม้าโยก · หุ่นยนต์</td><td>กระเป๋า · เก้าอี้</td></tr></table></div>`, name: 'จำแนกข้อมูล', text: 'จัดสิ่งที่มีลักษณะเหมือนกันไว้กลุ่มเดียวกัน' },
      { fig: `<div class="pc3-tly">${tallySVG(12, { scale: 1.6 })}</div>`, name: 'รอยขีด', text: 'ขีดทีละ 1 · ขีดที่ 5 ขีดทับ 4 ขีดแรก<br>รอยขีดนี้ = 5 + 5 + 2 = 12' }], 'สำรวจ → ขีดรอยขีด → นับ → บันทึกลงตาราง'),
     pexStep('ตัวอย่างทีละขั้น: นับข้อมูลด้วยรอยขีด', 'ตัวอย่างทีละขั้น', [['① อ่านทีละคำ', 'เจอคำว่า “แดง” ขีด 1 ขีดในแถวแดง', pc3SheetHTML({ ...PC3_SURV[1], cols: 6 })], ['② ขีดจนครบทุกคำ', 'ขีดที่ 5 ให้ขีดทับเป็นกลุ่ม', `<div class="pc3-tly">${tallySVG(7, { scale: 1.6 })}</div>`], ['③ นับรอยขีด', 'แดง: 5 + 2 = 7 คน', null]], 'สีแดงมีนักเรียนชอบ <b>7 คน</b>'),
     T('ลองนับข้อมูลด้วยรอยขีด', 'ลองนับข้อมูลด้วยรอยขีด', el => el.append(simPc3Survey(PC3_SURV[3])))],
    () => [pc3GroupQ(), pc3GroupQ(), ...pc3Pick(PC3_SURV.filter(S => S !== PC3_SURV[3]), 2).map(S => Q.pc3Count({ S, c: pick(S.cats)[0] })), Q.pc3Tally({ n: rnd(11, 34) }), Q.pc3TallyPick({ n: rnd(9, 28) }), pc3MostQ(pick(PC3_SURV.slice(0, 3)))]),
  L3P(2, 'ป่าภาพนับ', 'การอ่านแผนภูมิรูปภาพ', 'อ่านแผนภูมิรูปภาพ', 'อ่านแผนภูมิรูปภาพที่ 1 รูปแทนหลายหน่วย และตอบคำถามจากแผนภูมิ',
    [...learnStep('อ่าน<b>แผนภูมิรูปภาพ</b>', 'อ่านแผนภูมิรูปภาพ', [
      { fig: ppHTML(PC3_PP[6]), name: 'ส่วนประกอบ', text: 'ชื่อแผนภูมิ · รายการ · รูป · บรรทัด “กำหนดให้”' },
      { fig: ppHTML({ ...PC3_PP[6], rows: PC3_PP[6].rows.slice(0, 2) }), name: '1 รูปแทน 5 ตัว', text: 'มกราคม 4 รูป → 5, 10, 15, 20 = 20 ตัว' },
      { fig: ppHTML({ ...PC3_PP[5], rows: PC3_PP[5].rows.slice(2) }), name: 'ครึ่งรูป = ครึ่งหนึ่งของ 1 รูป', text: 'เมษายน 2 รูปครึ่ง → 50 + 50 + 25 = 125 ดอก' }], 'จำนวน = นับเพิ่มทีละค่าของ 1 รูป'),
     pexStep('ตัวอย่างทีละขั้น: กิจกรรมวันหยุด', 'ตัวอย่างทีละขั้น', [['① ดูกำหนดให้', '1 รูปแทน 7 คน', ppHTML(PC3_PP[3])], ['② นับรูปแถวเล่นเกม', '7 รูป', null], ['③ นับเพิ่มทีละ 7', '7, 14, 21, 28, 35, 42, 49', null]], 'เล่นเกม <b>49 คน</b> มากที่สุด'),
     T('ลองแตะแถวเพื่อนับ', 'ลองแตะแถวเพื่อนับ', el => el.append(simPc3Read(PC3_PP[1])))],
    () => { const D = pick([PC3_PP[0], PC3_PP[2], PC3_PP[4], PC3_PP[5], PC3_PP[7], PC3_PP[12]]); return shuffle(pc3PQs(D)).slice(0, 5); }),
  L3P(3, 'ป่าวาดภาพ', 'การเขียนแผนภูมิรูปภาพ', 'เขียนแผนภูมิรูปภาพ', 'เลือกค่าของ 1 รูปที่เหมาะสม และเขียนแผนภูมิรูปภาพจากข้อมูล',
    [...learnStep('<b>เขียน</b>แผนภูมิรูปภาพ', 'เขียนแผนภูมิรูปภาพ', [
      { fig: `<div class="pc3-src"><div class="pc3-tt">ของเล่นที่ขายได้</div><div>• ตุ๊กตา 20 ชิ้น</div><div>• รถของเล่น 15 ชิ้น</div><div>• ลูกบอล 10 ชิ้น</div></div>`, name: '① ดูข้อมูล', text: 'ทุกจำนวนหารด้วย 5 ลงตัว → ให้ 1 รูปแทน 5 ชิ้น' },
      { fig: ppHTML({ ...PC3_PP[8], rows: PC3_PP[8].rows.slice(0, 3) }), name: '② วาดรูปแต่ละแถว', text: 'ตุ๊กตา 20 ÷ 5 = 4 รูป · รถ 3 รูป · ลูกบอล 2 รูป' },
      { fig: lbig('ชื่อแผนภูมิ + กำหนดให้'), name: '③ อย่าลืม', text: 'ใส่ชื่อแผนภูมิ ชื่อรายการ และบอกว่า 1 รูปแทนเท่าใด' }], 'จำนวนรูป = จำนวน ÷ ค่าของ 1 รูป'),
     pexStep('ตัวอย่างทีละขั้น: หนังสือที่ถูกยืม', 'ตัวอย่างทีละขั้น', [['① ข้อมูล', 'การ์ตูน 30 · นิยาย 18 · สารคดี 12 · วิชาการ 6', `<div class="pc3-src"><div class="pc3-tt">หนังสือที่ถูกยืม</div><div>• การ์ตูน 30 เล่ม</div><div>• นิยาย 18 เล่ม</div><div>• สารคดี 12 เล่ม</div><div>• วิชาการ 6 เล่ม</div></div>`], ['② เลือก 1 รูป', 'ทุกจำนวนหารด้วย 6 ลงตัว → 1 รูปแทน 6 เล่ม', lbig('30 ÷ 6 = 5 · 18 ÷ 6 = 3<br>12 ÷ 6 = 2 · 6 ÷ 6 = 1')], ['③ จำนวนรูป', '5 รูป · 3 รูป · 2 รูป · 1 รูป', ppHTML(PC3_PP[9])]], 'ได้แผนภูมิรูปภาพที่<b>ไม่ต้องใช้ครึ่งรูป</b>'),
     T('ลองเปลี่ยนค่าของ 1 รูป', 'ลองเปลี่ยนค่าของ 1 รูป แล้วดูว่าต้องวาดกี่รูป', el => el.append(simPpKey(PC3_PP[6], [5, 10])))],
    () => { const D = pick([PC3_PP[8], PC3_PP[9], PC3_PP[10], PC3_PP[11], PC3_PP[13], PC3_PP[3]]), E = pick(PC3_PP.filter(x => x !== D && x.k <= 10 && x.rows.every(r => r[1] / x.k <= 7)));
      return [{ ...Q.ppBuild({ D: D.rows.every(r => r[1] / D.k <= 7) ? D : E }), __sig: 'pc3b ' + (D.rows.every(r => r[1] / D.k <= 7) ? D : E).title }, pc3KeyQ(pick(PC3_PP.filter(x => x !== D && x.rows.every(r => r[1] % x.k === 0)))), pc3PQs(D)[6], pc3PQs(E)[6], { ...ppKeyQ(D), __sig: 'pc3p ' + D.title + ' k' }]; }),
  L3P(4, 'ป่าตารางอ่าน', 'การอ่านตารางทางเดียว', 'อ่านตารางทางเดียว', 'อ่านข้อมูลจากตารางทางเดียว เปรียบเทียบ และคำนวณจากข้อมูล',
    [...learnStep('<b>ตารางทางเดียว</b>', 'ตารางทางเดียว', [
      { fig: pc3TabHTML(PC3_TB[6]), name: 'ส่วนประกอบ', text: 'ชื่อตาราง · หัวตาราง · รายการ · จำนวน (หน่วย)' },
      { fig: pc3TabHTML(PC3_TB[7]), name: 'ตารางแนวนอนก็ได้', text: 'รายการอยู่แถวบน จำนวนอยู่แถวล่าง' },
      { fig: pc3TabHTML(PC3_TB[6], { hl: 3 }), name: 'อ่านค่า', text: 'หาชื่อรายการ แล้วอ่านจำนวนในช่องคู่กัน<br>หุ่นยนต์ 52 คน' }], 'ตารางทางเดียวแสดงข้อมูลเพียงเรื่องเดียว'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'ชมรมหุ่นยนต์มีมากกว่าชมรมวาดภาพกี่คน', pc3TabHTML(PC3_TB[6])], ['① อ่านค่า', 'หุ่นยนต์ 52 คน · วาดภาพ 27 คน', pc3TabHTML(PC3_TB[6], { hl: 3 })], ['② ลบ', '52 − 27 = 25', null]], 'หุ่นยนต์มากกว่า <b>25 คน</b>'),
     T('ลองแตะแถวเปรียบเทียบ', 'ลองแตะแถวเปรียบเทียบ', el => el.append(simPc3Table(PC3_TB[8])))],
    () => { const T = pick(PC3_TB.filter(x => x !== PC3_TB[6] && x !== PC3_TB[8])); return shuffle(pc3TQs(T)).slice(0, 5); }),
  L3P(5, 'ป่าตารางเขียน', 'การเขียนตารางทางเดียว', 'เขียนตารางทางเดียว', 'เขียนตารางทางเดียวจากข้อความ แผนภูมิรูปภาพ รอยขีด และเงื่อนไข',
    [...learnStep('<b>เขียน</b>ตารางทางเดียว', 'เขียนตารางทางเดียว', [
      { fig: `<div class="pc3-src"><div>• ฟุตบอล 46 คน</div><div>• ดนตรี 38 คน</div><div>• วาดภาพ 27 คน</div></div>`, name: '① อ่านข้อมูล', text: 'ข้อมูลเรื่องเดียวกัน หน่วยเดียวกัน' },
      { fig: pc3TabHTML({ ...PC3_TB[6], rows: PC3_TB[6].rows.slice(0, 3) }), name: '② ตั้งชื่อและหัวตาราง', text: 'ช่องแรกเป็นรายการ ช่องที่สองเป็นจำนวน (หน่วย)' },
      { fig: ppHTML(PC3_PP[13]), name: 'จากแผนภูมิรูปภาพก็ได้', text: 'นับรูป × ค่าของ 1 รูป แล้วเขียนลงตาราง' }], 'ชื่อตาราง → หัวตาราง → รายการ → จำนวน'),
     pexStep('ตัวอย่างทีละขั้น: จากแผนภูมิเป็นตาราง', 'ตัวอย่างทีละขั้น', [['① นับรูปแถวแรก', 'ป.3/1 มี 6 รูป × 3 = 18 ต้น', ppHTML(PC3_PP[13])], ['② ทำทุกแถว', '24 · 15 · 21', null], ['③ เขียนตาราง', 'รายการ = ห้อง · จำนวน (ต้น)', pc3TabHTML(PC3T('ต้นไม้ที่แต่ละห้องปลูก', 'ห้อง', 'ต้น', PC3_PP[13].rows))]], 'ได้<b>ตารางทางเดียว</b>'),
     T('ลองเขียนตารางทางเดียว', 'ลองเขียนตารางทางเดียว', el => el.append(qSim(Q.pc3TFill({ T: PC3T('จำนวนนักเรียนในชมรม', 'ชมรม', 'คน', PC3_TB[6].rows.slice(0, 3)), src: { kind: 'text' } }), 'ถูกต้อง!')))],
    () => [...pc3Pick(PC3_FILL.slice(0, 7), 2).map(o => Q.pc3TFill(o)), Q.pc3TFill(pick(PC3_FILL.slice(7))), pc3TTitle(pick(PC3_TB)), Q.pc3TFill({ ...pick(PC3_FILL.slice(2, 5)), give: [0] })])
];

/* ---------- boss ---------- */
const pc3X = (q, fig, opts, lv) => ({ q, fig, opts, a: 0, lv });
const EXAM_P3C5 = d6spread([
  pc3X('รอยขีดนี้แสดงจำนวนเท่าใด', `<div class="pc3-tly">${tallySVG(17, { scale: 1.4 })}</div>`, ['17', '15', '22', '12'], 1341),
  pc3X('ข้อใดไม่ใช่ยานพาหนะทางน้ำ', null, ['รถไฟ', 'เรือใบ', 'เรือข้ามฟาก', 'เรือหางยาว'], 1341),
  pc3X('จากข้อมูล นักเรียนเลือกเมนูใดมากที่สุด', pc3SheetHTML(PC3_SURV[5]), ['ก๋วยเตี๋ยว', 'ข้าวผัด', 'ผัดกะเพรา', 'ข้าวมันไก่'], 1341),
  pc3X('การเขียนรอยขีด ขีดที่ 5 ต้องเขียนอย่างไร', null, ['ขีดทับ 4 ขีดแรกเป็นกลุ่ม', 'ขีดตั้งต่อไปเรื่อย ๆ', 'เขียนเป็นตัวเลข 5'], 1341),
  pc3X('ป.3/2 ปลูกต้นไม้กี่ต้น', ppHTML(PC3_PP[13]), ['24 ต้น', '8 ต้น', '21 ต้น', '27 ต้น'], 1342),
  pc3X('เดือนใดเก็บดอกกุหลาบได้น้อยที่สุด และได้กี่ดอก', ppHTML(PC3_PP[5]), ['เมษายน 125 ดอก', 'เมษายน 3 ดอก', 'มีนาคม 250 ดอก', 'มกราคม 200 ดอก'], 1342),
  pc3X('เล่นเกมมากกว่าอ่านหนังสือกี่คน', ppHTML(PC3_PP[3]), ['28 คน', '4 คน', '70 คน', '21 คน'], 1342),
  pc3X('ผักทั้งหมดในร้านมีกี่กิโลกรัม', ppHTML(PC3_PP[4]), ['440 กิโลกรัม', '22 กิโลกรัม', '400 กิโลกรัม', '120 กิโลกรัม'], 1342),
  pc3X('ถ้า 1 รูปแทน 5 ชิ้น ข้อมูล 35 ชิ้นต้องวาดกี่รูป', null, ['7 รูป', '5 รูป', '35 รูป', '30 รูป'], 1343),
  pc3X('ข้อมูล 12, 18, 24, 30 ควรให้ 1 รูปแทนจำนวนใด จึงไม่ต้องใช้ครึ่งรูป', null, ['6', '4', '5', '10'], 1343),
  pc3X('ถ้า 1 รูปแทน 10 คน การวาด 25 คนต้องวาดอย่างไร', null, ['2 รูปครึ่ง', '25 รูป', '2 รูป', '3 รูป'], 1343),
  pc3X('สิ่งที่แผนภูมิรูปภาพต้องมีเสมอคือข้อใด', null, ['บรรทัดกำหนดให้ว่า 1 รูปแทนเท่าใด', 'สีของรูปต่างกันทุกแถว', 'รูปขนาดต่างกัน'], 1343),
  pc3X('สวนใดได้ผลผลิตมากที่สุด', pc3TabHTML(PC3_TB[1]), ['สวนกุลยา', 'สวนสินใจ', 'สวนสมจิตร', 'สวนมานะ'], 1344),
  pc3X('ค่าอาหารมากกว่าค่าอินเทอร์เน็ตกี่บาท', pc3TabHTML(PC3_TB[3]), ['10,700 บาท', '13,300 บาท', '9,500 บาท', '1,300 บาท'], 1344),
  pc3X('ถ้าขายไข่ฟองละ 4 บาท วันพฤหัสบดีจะได้เงินกี่บาท', pc3TabHTML(PC3_TB[10]), ['1,040 บาท', '264 บาท', '1,000 บาท', '65 บาท'], 1344),
  pc3X('ตารางนี้ควรมีชื่อว่าอะไร', pc3TabHTML(PC3_TB[11], { noTitle: true }), ['ระยะทางที่นักปั่นจักรยานแต่ละคนปั่นได้', 'จำนวนนักปั่นจักรยาน', 'ราคาจักรยาน'], 1344),
  pc3X('ข้อมูล: เอ 30 คน บี 25 คน ซี 40 คน · ถ้าเขียนเป็นตารางทางเดียว หัวตารางช่องที่สองควรเขียนว่าอะไร', null, ['จำนวน (คน)', 'ชื่อ', 'เอ'], 1345),
  pc3X('แผนภูมินี้ เมื่อเขียนเป็นตารางทางเดียว แถวผู้สูงอายุต้องเขียนจำนวนเท่าใด', ppHTML(PC3_PP[10]), ['40 ใบ', '2 ใบ', '20 ใบ', '60 ใบ'], 1345),
  pc3X('ลมได้ 20 คะแนน ฟ้าได้น้อยกว่าลม 2 คะแนน ในตารางต้องเขียนคะแนนของฟ้าเท่าใด', null, ['18', '22', '2', '20'], 1345),
  pc3X('ข้อใดเป็นตารางทางเดียว', null, ['ตารางที่แสดงข้อมูลเรื่องเดียว มีรายการและจำนวน', 'ตารางที่มีข้อมูลหลายเรื่องปนกัน', 'แผนภูมิที่ใช้รูปแทนจำนวน'], 1345)]);
LESSONS_P3C5.push({ id: 1359, boss: true, place: 'ป่าตารางยักษ์', title: 'ด่านบอส: ป.3 บทที่ 5 แผนภูมิรูปภาพและตารางทางเดียว', short: 'ด่านบอส · ข้อสอบ', tone: 'yellow',
  goal: 'คำถามท้ายบท 20 ข้อ (เก็บและจำแนกข้อมูล · รอยขีด · อ่านและเขียนแผนภูมิรูปภาพ · อ่านและเขียนตารางทางเดียว) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P3C5, pass: 10, bossName: 'งูยักษ์ตารางข้อมูล', bossPal: 'sky', emblem: '▦', bossKind: 'snake',
  winLine: 'ชนะงูยักษ์ตารางข้อมูลแล้ว! อ่านแผนภูมิและตารางเก่งมาก', loseLine: 'งูยักษ์ตารางข้อมูลยังไม่ยอมแพ้ กลับไปทวนแล้วสู้ใหม่นะ!' });
