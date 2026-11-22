/* =========================================================
   GRADE 2 · CHAPTER 6 — การหาร  (ชายหาด · ภาคเรียนที่ 2 · เมือง 48 · ด่าน 941–952 · บอส 959)
   grouping (กลุ่มละเท่า ๆ กัน → ได้กี่กลุ่ม) · sharing (แบ่งให้ … คน → ได้คนละเท่าไร) · counters · ×/÷ fact family ·
   exact vs remainder · number sense · unknowns · word problems
   division facts feed the same memory as the times tables (mtHit) — ข้อที่จำไม่แม่นจะถูกถามบ่อยขึ้น
   ========================================================= */
/* ---------- pictures ---------- */
const dvPile = (n, e, s = 18, cols = 10) => { const c = Math.min(cols, Math.max(n, 1)), r = Math.ceil(n / c);
  return `<svg viewBox="0 0 ${c * s + 8} ${r * s + 8}" class="mtpic" style="max-width:${Math.min(c * s * 1.7, 440)}px" aria-hidden="true">${range(0, n - 1).map(i => mtIco(e, 4 + (i % c) * s, 4 + Math.floor(i / c) * s, s - 2)).join('')}</svg>`; };
/* groups of k plus a dashed “เหลือ” area */
const dvLeft = (n, k, e, o = {}) => { const g = Math.floor(n / k), r = n % k;
  return `<div class="dv-left">${g ? mtGroupsSVG(g, k, e, { box: o.box, run: o.run, size: o.size }) : ''}${r ? `<div class="dv-rem">${dvPile(r, e, 18, 5)}<small>เหลือ ${r}</small></div>` : ''}</div>`; };
/* ---------- generic 2-slot answer (ผลหาร | เศษ) ---------- */
function duoInput(ctx, want, U, o = {}) {
  const val = ['', '']; let cur = 0, done = false;
  const slots = [0, 1].map(i => h('button', { class: 'mc-slot', onclick: e => { e.stopPropagation(); if (!done) { cur = i; paint(); } } }, '?'));
  const msg = h('div', { class: 'pad-msg' });
  const paint = () => slots.forEach((s, i) => { s.textContent = val[i] === '' ? '?' : fmt(+val[i]); s.classList.toggle('on', i === cur && !done); s.classList.toggle('filled', val[i] !== ''); });
  const type = d => { if (done) return; sfx.tap(); msg.textContent = ''; val[cur] = (val[cur] + d).slice(-Math.max(3, String(want[cur]).length + 1, 7)).replace(/^0+(\d)/, '$1'); paint(); };
  const ok = () => { if (done) return;
    const nm = i => (o.names && o.names[i]) || U[i]; /* v136: ชื่อช่องในข้อความเตือน */
    if (val[cur] === '') { msg.textContent = `กดจำนวน${nm(cur)} (ถ้าไม่มีให้กด 0)`; return; }
    const other = 1 - cur; if (val[other] === '') { cur = other; paint(); msg.textContent = `ต่อไปกด${nm(cur)} (ถ้าไม่มีให้กด 0)`; return; }
    const good = +val[0] === want[0] && +val[1] === want[1]; if (good) { done = true; wrap.classList.add('done'); }
    ctx.check(good, o.hint); if (!good && !done) { val[0] = val[1] = ''; cur = 0; paint(); } }; /* v188: ครั้งที่ 3 เฉลยแล้ว อย่าล้าง */
  const kp = h('div', { class: 'keypad' });
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: () => type(d) }, d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: () => { sfx.tap(); val[cur] = val[cur].slice(0, -1); paint(); } }, icon('left')), h('button', { class: 'btn', onclick: () => type(0) }, '0'), h('button', { class: 'btn primary', 'aria-label': 'ส่งคำตอบ', onclick: ok }, icon('check')));
  /* v185 (ผู้ใช้ขอ): o.rows = [ป้ายบรรทัด 1, ป้ายบรรทัด 2] → สองช่องอยู่คนละบรรทัด (เช่น กลางวัน / กลางคืน) */
  const rowsEl = o.rows ? h('div', { class: 'mc-rows' }, ...[0, 1].map(i => h('div', { class: 'mc-row mc-row2' }, h('span', { class: 'mc-u mc-rl' }, o.rows[i]), slots[i], U[i] ? h('span', { class: 'mc-u' }, U[i]) : null))) : null;
  const wrap = h('div', { class: 'ans mc-ans ia' }, rowsEl || h('div', { class: 'mc-row' }, o.pre === '' ? null : h('span', { class: 'mc-u' }, o.pre || 'ได้'), slots[0], U[0] ? h('span', { class: 'mc-u' }, U[0]) : null, o.mid ? h('span', { class: 'mc-u mc-mid' }, o.mid) : null, slots[1], U[1] ? h('span', { class: 'mc-u' }, U[1]) : null), kp, msg); /* v136: o.mid = คำระหว่างสองช่อง (ได้ __ เศษ __) */
  wrap.reveal = () => { val[0] = String(want[0]); val[1] = String(want[1]); done = true; paint(); wrap.classList.add('done', 'revealed'); }; wrap.ansText = want.map(String);
  paint(); return wrap;
}

/* ---------- teaching sims ---------- */
/* put things into boxes, k per box — how many boxes? (การหาร = แบ่งเป็นกลุ่ม กลุ่มละเท่า ๆ กัน) */
/* ---------- v191 (ผู้ใช้ขอ): ภาพเดียวต่อเนื่อง ขนาดผลไม้คงที่ แค่จัดกลุ่ม ---------- */
/* groups = items in each bag/plate · pile = not yet grouped · K/G/P reserve room so the picture does not jump between states · W = width to fit */
function dvBoard({ groups = [], pile = 0, e, box = 'bag', S = 38, K, G, P, W = 540, lab, pileLab, hl, cols }) {
  const ic = `<i>${artHTML(e)}</i>`, k = Math.max(1, K || 0, ...groups), c = cols || (k <= 3 ? k : k <= 4 ? 2 : k <= 9 ? 3 : 4), rin = Math.ceil(k / c);
  const bw = c * S + 18, bh = rin * S + 18 + (lab ? 26 : 0), per = Math.max(1, Math.floor((W + 12) / (bw + 12))), Gn = Math.max(G || 0, groups.length);
  const g = groups.map((m, i) => `<div class="dvb-bx ${box}${hl === i ? ' hl' : ''}" style="width:${bw}px"><div class="dvb-in" style="grid-template-columns:repeat(${c},${S}px);min-height:${rin * S}px">${ic.repeat(m)}</div>${lab ? `<b class="dvb-n">${lab(i, m)}</b>` : ''}</div>`).join('');
  const Pn = Math.max(P || 0, pile), pc = Math.max(1, Math.min(Pn, Math.floor((W + 4) / (S + 4)), 10));
  return `<div class="dvb" style="--s:${S}px;max-width:${W + 20}px">${Gn ? `<div class="dvb-g" style="min-height:${Math.ceil(Gn / per) * (bh + 12)}px">${g}</div>` : ''}${Pn ? `<div class="dvb-p${pile ? '' : ' empty'}" style="min-height:${Math.ceil(Pn / pc) * (S + 4) + 6}px"><div class="dvb-pi" style="grid-template-columns:repeat(${pc},${S}px)">${ic.repeat(pile)}</div>${pileLab && pile ? `<small>${pileLab}</small>` : ''}</div>` : ''}</div>`;
}
const dvBags = (n, k, e, o = {}) => dvBoard({ groups: Array(Math.floor(n / k)).fill(k), pile: n % k, e, K: k, pileLab: n % k ? `เหลือ ${n % k}` : '', ...o });
/* counters: tap one at a time — each shows its group number, one colour per group, the next group a new colour */
const dvCtrHTML = (n, k = 0, upto = 0) => `<div class="dvc">${range(0, n - 1).map(i => i < upto ? `<span class="ct on" style="--c:${DV_COL[Math.floor(i / k) % DV_COL.length]}">${Math.floor(i / k) + 1}</span>` : '<span class="ct"></span>').join('')}</div>`;
function dvTapCtr(el, k, onTap) { let cnt = 0; const cts = [...el.querySelectorAll('.ct')]; el.classList.add('ia');
  cts.forEach(c => c.onclick = e => { e.stopPropagation(); if (c.classList.contains('on')) return; const g = Math.floor(cnt / k);
    c.classList.add('on'); c.style.setProperty('--c', DV_COL[g % DV_COL.length]); c.textContent = g + 1; cnt++; const full = cnt % k === 0; sfx.pop(full ? 6 : cnt % k);
    onTap && onTap({ cnt, groups: Math.floor(cnt / k), full, left: cts.length - cnt }); });
  return { reset: () => { cnt = 0; cts.forEach(c => { c.className = 'ct'; c.textContent = ''; c.style.removeProperty('--c'); }); } }; }


/* ---------- sims ---------- */
function simDvGroup(cfg) { /* ใหญ่ขึ้น · ผลไม้ขนาดเท่าเดิมทุกครั้ง แค่ย้ายเข้าถุง */
  const box = h('div', { class: 'colstack dvsim' }, h6wait()), fig = h('div', { class: 'dvsim-fig' }), out = fNote(), bar = h('div', { class: 'rowstack ia' }); let k = cfg.ks[0], left, g, tried = new Set();
  const draw = () => { fig.innerHTML = dvBoard({ groups: Array(g).fill(k), pile: left, e: cfg.e, K: k, G: Math.floor(cfg.n / k), P: cfg.n, S: 44, W: 640, pileLab: left ? `ยังไม่ได้จัด ${left}` : '', lab: i => `${cfg.box}ที่ ${i + 1}` }); };
  const reset = () => { left = cfg.n; g = 0; draw(); out.innerHTML = `${cfg.what} ${cfg.n} ${cfg.unit} · กด “จัดใส่${cfg.box}” ทีละ${cfg.box}`; };
  const go = h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); if (left < k) return; left -= k; g++; sfx.pop(g); draw();
    if (left >= k) { out.innerHTML = `จัดได้ ${g} ${cfg.box} · เหลือ ${left} ${cfg.unit}`; return; }
    tried.add(k); out.innerHTML = `${cfg.box}ละ ${k} ได้ <b>${g} ${cfg.box}</b>${left ? ` เหลือ ${left}` : ''} → <b>${cfg.n} ÷ ${k} = ${g}</b>`; say(`${cfg.n} หารด้วย ${k} เท่ากับ ${g}`, true);
    if (tried.size >= Math.min(2, cfg.ks.length)) teachDone(box); else out.innerHTML += ' · ลองเปลี่ยนจำนวนต่อ' + cfg.box + 'ดู'; } }, icon('right'), 'จัดใส่' + cfg.box);
  cfg.ks.forEach((x, i) => bar.append(h('button', { class: 'btn sm ia vsel' + (i ? '' : ' on'), onclick: e => { e.stopPropagation(); k = x; bar.querySelectorAll('.vsel').forEach((b, j) => b.classList.toggle('on', j === i)); sfx.tap(); reset(); } }, `${cfg.box}ละ ${x}`)));
  reset(); box.append(h('div', { class: 'rowstack dvsim-bar' }, bar, go), fig, out); return box;
}
function simDvShare(cfg) {
  const box = h('div', { class: 'colstack dvsim' }, h6wait()), fig = h('div', { class: 'dvsim-fig' }), out = fNote(); let left = cfg.n, each = 0; const q = cfg.n / cfg.p;
  const draw = () => { fig.innerHTML = dvBoard({ groups: Array(cfg.p).fill(each), pile: left, e: cfg.e, box: 'plate', K: q, G: cfg.p, P: cfg.n, S: 44, W: 640, lab: i => `คนที่ ${i + 1}`, pileLab: left ? `ยังไม่ได้แจก ${left}` : '' }); };
  const go = h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); if (left < cfg.p) return; left -= cfg.p; each++; sfx.pop(each); draw();
    if (left >= cfg.p) { out.innerHTML = `แจกรอบที่ ${each} แล้ว · ได้คนละ ${each}`; return; }
    go.remove(); out.innerHTML = `แจกหมดแล้ว · ${cfg.p} คน ได้คนละ <b>${each} ${cfg.unit}</b> → <b>${cfg.n} ÷ ${cfg.p} = ${each}</b>`; say(`${cfg.n} หารด้วย ${cfg.p} เท่ากับ ${each}`, true); teachDone(box); } }, icon('right'), `แจกคนละ 1 ${cfg.unit} (ครบ ${cfg.p} คน)`);
  draw(); out.innerHTML = `${cfg.what} ${cfg.n} ${cfg.unit} แบ่งให้ ${cfg.p} คน · แจกรอบละคนละ 1 ${cfg.unit}`;
  box.append(go, fig, out); return box;
}
function simDvCounters(n, k) {
  const box = h('div', { class: 'colstack dvsim' }, h6wait()), fig = h('div', { class: 'dvsim-fig dvc-big', html: dvCtrHTML(n) }), out = fNote();
  dvTapCtr(fig.firstChild, k, ({ cnt, groups, full, left }) => { out.innerHTML = left ? (full ? `ครบกลุ่มที่ ${groups} แล้ว — กลุ่มต่อไปเปลี่ยนสี` : `กลุ่มที่ ${groups + 1}: แตะไปแล้ว ${cnt % k} ตัว`) : `ครบแล้ว ได้ <b>${groups} กลุ่ม</b> → <b>${n} ÷ ${k} = ${groups}</b>`; if (!left) { say(`${n} หารด้วย ${k} เท่ากับ ${groups}`, true); teachDone(box); } });
  out.innerHTML = `ตัวนับ ${n} ตัว · แตะทีละตัว ครบ ${k} ตัวเป็น 1 กลุ่ม`; box.append(fig, out); return box;
}
function simDvFam(r, c) {
  const p = r * c, box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'dvsim-fig' }), out = fNote(), seen = new Set();
  const show = (k, o) => { fig.innerHTML = dvArrSVG(r, c, o); seen.add(k); out.innerHTML = { m: `${r} แถว แถวละ ${c} → <b>${r} × ${c} = ${p}</b>`, a: `${p} จุด แบ่งเป็น ${r} แถวเท่า ๆ กัน ได้แถวละ ${c} → <b>${p} ÷ ${r} = ${c}</b>`, b: `${p} จุด แบ่งเป็น ${c} คอลัมน์ ได้คอลัมน์ละ ${r} → <b>${p} ÷ ${c} = ${r}</b>` }[k]; if (seen.size >= 3) teachDone(box); };
  const b = (t, k, o) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.pop(seen.size + 2); show(k, o); } }, t);
  fig.innerHTML = dvArrSVG(r, c); out.innerHTML = 'กดดูทีละประโยค';
  box.append(h('div', { class: 'rowstack' }, b(`${r} × ${c}`, 'm', { run: true }), b(`${p} ÷ ${r}`, 'a', { mode: 'rows' }), b(`${p} ÷ ${c}`, 'b', { mode: 'cols', cols: true })), fig, out); return box;
}
function simDvRem(k = 4, e = 'cookie') {
  let n = 12; const box = h('div', { class: 'colstack dvsim' }, h6wait()), fig = h('div', { class: 'dvsim-fig' }), out = fNote(), kinds = new Set();
  const draw = () => { const q = Math.floor(n / k), r = n % k; fig.innerHTML = dvBags(n, k, e, { G: Math.floor(24 / k), P: k - 1, S: 40, W: 640, lab: i => `ถุงที่ ${i + 1}` }); kinds.add(r ? 1 : 0);
    out.innerHTML = r ? `${n} ÷ ${k} ได้ ${q} เศษ ${r} · มีของเหลือ → <b>หารไม่ลงตัว</b>` : `${n} ÷ ${k} = ${q} · ไม่มีเหลือ → <b>หารลงตัว</b>`; if (kinds.size >= 2) teachDone(box); };
  const b = (t, d) => h('button', { class: 'btn sm ia', onclick: e2 => { e2.stopPropagation(); const v = n + d; if (v < k || v > 24) { sfx.no(); return; } n = v; sfx.tap(); draw(); } }, t);
  draw(); box.append(h('div', { class: 'rowstack' }, h('span', { class: 'cap' }, `ใส่ถุง ถุงละ ${k}`), b('− 1 ชิ้น', -1), b('+ 1 ชิ้น', 1)), fig, out); return box;
}
function simDvSense(mode) {
  let a = 24, d = mode === 'top' ? 4 : 2; const box = h('div', { class: 'colstack dvsim' }, h6wait()), fig = h('div', { class: 'dvsim-fig' }), out = fNote(), seen = new Set();
  const draw = () => { const q = a / d; fig.innerHTML = dvBoard({ groups: Array(d).fill(q), e: 'strawberry', box: 'plate', K: mode === 'top' ? 7 : 12, G: mode === 'top' ? 4 : 8, S: 30, W: 640, lab: i => `คนที่ ${i + 1}` }); seen.add(a + ':' + d);
    out.innerHTML = `<b>${a} ÷ ${d} = ${q}</b> · ` + (mode === 'top' ? 'ตัวหารเท่าเดิม ตัวตั้งมากขึ้น ผลหารก็มากขึ้น' : 'ตัวตั้งเท่าเดิม ตัวหารมากขึ้น ผลหารกลับน้อยลง'); if (seen.size >= 3) teachDone(box); };
  const opts = mode === 'top' ? [8, 12, 16, 20, 24, 28] : [2, 3, 4, 6, 8];
  const row = h('div', { class: 'rowstack ia' }, ...opts.map(v => h('button', { class: 'btn sm', onclick: e => { e.stopPropagation(); if (mode === 'top') a = v; else d = v; sfx.tap(); draw(); } }, mode === 'top' ? `${v} ÷ ${d}` : `${a} ÷ ${v}`)));
  draw(); box.append(h('div', { class: 'cap' }, mode === 'top' ? 'แบ่งให้ 4 คนเท่าเดิม เปลี่ยนจำนวนสตรอว์เบอร์รี' : 'สตรอว์เบอร์รี 24 ผลเท่าเดิม เปลี่ยนจำนวนคน'), row, fig, out); return box;
}
/* หารทีละแม่: ① การ์ดสีฟ้า (คู่กับการคูณ) ② การ์ดพลิก ③ เติมคำตอบ */
function dvCards(d) {
  const box = h('div', { class: 'colstack mtcwrap' }, h6wait()), grid = h('div', { class: 'mtcards ia' }), heard = new Set();
  range(1, 12).forEach(q => { const c = h('button', { class: 'mtcard dvcard' }, h('span', { class: 'mtcf', html: `${d * q} ÷ ${d} = <b>${q}</b>` }), h('small', null, `${d} × ${q} = ${d * q}`));
    c.onclick = e => { e.stopPropagation(); grid.querySelectorAll('.mtcard').forEach(x => x.classList.toggle('on', x === c)); heard.add(q); say(`${d * q} หารด้วย ${d} เท่ากับ ${q} เพราะ ${d} คูณ ${q} เท่ากับ ${d * q}`, true); if (heard.size >= 12) teachDone(box); }; grid.append(c); });
  box.append(h('div', { class: 'cap' }, `หารด้วย ${d} ใช้แม่ ${d} ช่วยคิด — แตะการ์ดเพื่อฟังให้ครบทุกใบ`), grid); return box;
}
function dvFlip(d) {
  const box = h('div', { class: 'colstack mtcwrap' }), grid = h('div', { class: 'mtcards ia' });
  const cards = range(1, 12).map(q => { const c = h('button', { class: 'mtcard flip open' }, h('span', { class: 'mtc-in' }, h('span', { class: 'mtc-f mtc-q', html: `${d * q} ÷ ${d} = <i class="mtq">?</i>` }), h('span', { class: 'mtc-f mtc-a', html: `${d * q} ÷ ${d} = <b>${q}</b>` })));
    c.onclick = e => { e.stopPropagation(); sfx.tap(); c.classList.toggle('open'); if (c.classList.contains('open')) say(`${d * q} หารด้วย ${d} เท่ากับ ${q}`, true); }; grid.append(c); return c; });
  cards.forEach((c, i) => setTimeout(() => c.classList.remove('open'), 500 + i * 70)); setTimeout(() => teachDone(box), 1400);
  box.append(h('div', { class: 'mtflip-h', html: `นึกในใจ: <b>${d} × อะไร</b> ได้ตัวตั้ง — จำไม่ได้ แตะการ์ดพลิกดูได้ แตะอีกครั้งพลิกกลับ · ฝึกจนไม่ต้องพลิกเลย!` }), grid); return box;
}
function dvFillAll(d) {
  const box = h('div', { class: 'colstack' }, h6wait()), tab = h('div', { class: 'mttab sm mtfall' }), slot = h('div', { class: 'colstack' }), out = h('div', { class: 'p4steplab mtfa-l' }); let q = 1, tries = 0; const rev = new Set();
  const draw = () => { tab.innerHTML = range(1, 12).map(j => `<div class="mtrow${j === q ? ' on' : ''}${rev.has(j) ? ' rv' : ''}"><span class="mtf">${d * j} ÷ ${d} = ${j >= q ? '<i class="mtq">?</i>' : `<b>${j}</b>`}</span></div>`).join(''); };
  const ask = () => { draw(); slot.innerHTML = ''; if (q > 12) { out.innerHTML = `เก่งมาก! หารด้วย ${d} ครบ 12 ข้อแล้ว`; teachDone(box); return; } tries = 0; out.innerHTML = `<b>${d * q} ÷ ${d}</b> เท่ากับเท่าไร`;
    const qq = q; slot.append(answerBox({ say: t => say(t), check: ok => { if (qq !== q) return; if (ok) { mtHit(d, q, !tries); sfx.ok(); q++; setTimeout(ask, 300); return; } tries++; sfx.no();
      if (tries >= 3) { rev.add(q); out.innerHTML = `${d * q} ÷ ${d} = <b>${q}</b> เพราะ ${d} × ${q} = ${d * q}`; q++; setTimeout(ask, 1800); }
      else out.innerHTML = tries === 1 ? `ยังไม่ใช่ ลองอีกครั้ง: <b>${d * q} ÷ ${d}</b>` : `คำใบ้: ${d} × อะไร = ${d * q}`; } }, String(q))); };
  box.append(h('div', { class: 'g4sd p2sd mtfa' }, h('div', { class: 'p2sd-l' }, tab), h('div', { class: 'g4sd-r' }, out, slot))); ask(); return box;
}
const dvTablePages = d => [T(`หารด้วย ${d}: การ์ดคู่กับแม่ ${d}`, `หารด้วย ${d} การ์ดคู่กับแม่ ${d}`, el => el.append(dvCards(d))),
  T(`พลิกการ์ดหารด้วย ${d}: ฝึกจำ`, `พลิกการ์ดหารด้วย ${d} ฝึกจำ`, el => el.append(dvFlip(d))), T(`เติมผลหาร หารด้วย ${d} ให้ครบ`, `เติมผลหาร หารด้วย ${d} ให้ครบ`, el => el.append(dvFillAll(d)))];

/* ---------- question types ---------- */
const dvOpts = (n, d) => [`${fmt(n)} ÷ ${d}`, `${fmt(n)} × ${d}`, `${fmt(n)} − ${d}`];
Object.assign(Q, {
  /* picture → sentence → answer · mode 'group' (กลุ่มละ d ได้กี่กลุ่ม) | 'share' (แบ่ง d คน ได้คนละเท่าไร) */
  dvPic({ n, d, e, what, box, unit, mode }) { const q = n / d, text = mode === 'share' ? `${what} ${n} ${unit} แบ่งใส่ ${d} ${box} ${box}ละเท่า ๆ กัน ได้${box}ละกี่${unit}` : `${what} ${n} ${unit} แบ่งใส่${box} ${box}ละ ${d} ${unit} แบ่งได้กี่${box}`;
    const S = n <= 16 ? 46 : n <= 30 ? 38 : 32, fig = mode === 'share' ? dvBoard({ groups: Array(d).fill(q), e, box: 'plate', S, W: 480 }) : dvBoard({ groups: Array(q).fill(d), e, S, W: 480 }); /* v191: ผลไม้ขนาดเท่ากันทุกข้อ */
    return { prompt: text, say: text, mount(bd, ctx) { bd.append(ppSide(h('div', { class: 'dvfig', html: fig }),
      mtTwoStep(ctx, dvOpts(n, d), `${fmt(n)} ÷ ${d}`, 'แบ่งเท่า ๆ กัน → หาร', () => h('div', { class: 'rowstack' }, answerBox(ctx, String(q), { hint: mode === 'share' ? `แจกคนละ 1 ไปเรื่อย ๆ หรือคิด ${d} × อะไร = ${n}` : `นับว่ามีกี่${box} หรือคิด อะไร × ${d} = ${n}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, mode === 'share' ? unit : box))))); } };
  },
  /* counters: tap to circle groups, then answer */
  dvCtr({ n, d }) { const q = `${n} ÷ ${d} = ?`;
    return { prompt: q + ` <small>(แตะตัวนับทีละตัว ครบ ${d} ตัวเป็น 1 กลุ่ม)</small>`, say: `${n} หารด้วย ${d} เท่ากับเท่าไร`, mount(bd, ctx) { const f = h('div', { class: 'dvc-big', html: dvCtrHTML(n) }), ab = h('div', { class: 'dvgate', style: { visibility: 'hidden' } }, answerBox(ctx, String(n / d), { hint: `แตะครบทุกตัวแล้วนับว่ามีกี่กลุ่ม (กี่สี)` }));
      dvTapCtr(f.firstChild, d, ({ left }) => { if (!left) { ab.style.visibility = ''; ctx.say('ครบทุกตัวแล้ว มีกี่กลุ่ม ตอบเลย'); } }); /* v191: แตะทีละตัว เลขกลุ่ม + สีต่อกลุ่ม · ครบก่อนจึงตอบได้ */
      bd.append(ppSide(f, ab)); } };
  },
  /* one division fact — remembered with the times tables */
  dvFact({ n, d }) { const q = n / d;
    return { prompt: `${n} ÷ ${d} = ?`, say: `${n} หารด้วย ${d} เท่ากับเท่าไร`, mount(bd, ctx) { const hintFig = h('div', { class: 'p4-fig mt-hint' });
      const px = mtProxy(ctx, ok => mtHit(d, q, ok), () => { hintFig.innerHTML = `<div class="fbig">${d} × <span class="fsign">?</span> = ${n}</div>` + (n <= 48 ? mtGroupsSVG(q, d, pick(['cookie', 'orange', 'strawberry']), { run: true, size: 12 }) : ''); });
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'colstack' }, h('div', { class: 'fbig p4big mt-big', html: `${n} <span class="fop">÷</span> ${d} <span class="fop">=</span> <span class="fsign">?</span>` }), hintFig),
        answerBox(px, String(q), { hint: `ท่องแม่ ${d}: ${d} × อะไร = ${n}` }))); } };
  },
  /* fact family: fill 3 blanks one after another */
  dvFam({ a, b }) { const p = a * b, rows = [[`${a} × ${b}`, p], [`${p} ÷ ${a}`, b], [`${p} ÷ ${b}`, a]];
    return { prompt: 'เติมคำตอบทีละบรรทัด', say: 'เติมคำตอบทีละบรรทัด', mount(bd, ctx) { let k = 0; const tab = h('div', { class: 'mttab sm one' }), slot = h('div');
      const draw = () => { tab.innerHTML = rows.map(([t, v], i) => `<div class="mtrow${i === k ? ' on' : ''}"><span class="mtf">${t} = ${i < k ? `<b>${v}</b>` : '<i class="mtq">?</i>'}</span></div>`).join(''); };
      const ask = () => { draw(); slot.innerHTML = ''; if (k >= rows.length) return ctx.check(true);
        slot.append(answerBox({ ...ctx, check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(k + 2); k++; setTimeout(ask, 300); }, say: ctx.say }, String(rows[k][1]), { hint: k ? `ใช้ ${a} × ${b} = ${p} ช่วย` : `ท่องแม่ ${a}` })); };
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'colstack' }, h('div', { class: 'p4-fig', html: mtArraySVG(a, b) }), tab), slot)); ask(); } };
  },
  dvPop({ facts }) { const q = 'แตะลูกโป่งที่เป็นผลหาร ให้เร็วที่สุด!';
    return { prompt: q, say: q, mount(bd, ctx) { let r = 0; const t0 = Date.now(), head = h('div', { class: 'fbig p4big mt-big' }), sky = h('div', { class: 'mtsky ia' }), dots = h('div', { class: 'mtdots' });
      const round = () => { dots.innerHTML = facts.map((_, i) => `<i class="${i < r ? 'ok' : i === r ? 'cur' : ''}"></i>`).join('');
        if (r >= facts.length) { head.innerHTML = `ครบ ${facts.length} ข้อใน <b>${Math.round((Date.now() - t0) / 1000)}</b> วินาที!`; sky.innerHTML = ''; return ctx.check(true); }
        const [n, d] = facts[r], q2 = n / d; let first = true; head.innerHTML = `${n} <span class="fop">÷</span> ${d} <span class="fop">=</span> <span class="fsign">?</span>`; sky.innerHTML = '';
        shuffle([q2, ...shuffle([q2 + 1, q2 - 1, q2 + 2, d, q2 * 2].filter(x => x > 0 && x !== q2).filter((x, i, A) => A.indexOf(x) === i)).slice(0, 3)]).forEach((v, i) => { const bl = h('button', { class: 'mtball c' + i, style: { animationDelay: (i * .35) + 's' } }, h('span', null, String(v)));
          bl.onclick = e => { e.stopPropagation(); if (v === q2) { if (first) mtHit(d, q2, true); bl.classList.add('pop'); popConfetti(bl); sfx.pop(r + 2); r++; setTimeout(round, 380); }
            else { if (first) { first = false; mtHit(d, q2, false); } bl.classList.remove('bad'); void bl.offsetWidth; bl.classList.add('bad'); sfx.no(); ctx.say(`ยังไม่ใช่ — ${d} × อะไร = ${n}`); } }; sky.append(bl); }); };
      bd.append(h('div', { class: 'colstack' }, dots, head, sky)); round(); } };
  },
  /* quotient and remainder */
  dvRem({ n, d, e }) { const q = Math.floor(n / d), r = n % d;
    return { prompt: `${n} ÷ ${d} ได้เท่าไร เศษเท่าไร`, say: `${n} หารด้วย ${d} ได้เท่าไร เศษเท่าไร`, mount(bd, ctx) {
      bd.append(ppSide(h('div', { class: 'colstack' }, h('div', { class: 'fbig p4big', html: `${n} <span class="fop">÷</span> ${d}` }), n <= 40 ? h('div', { class: 'dvfig', html: dvBags(n, d, e || 'cookie', { S: 22, W: 440, pileLab: n % d ? 'เหลือ' : '' }) }) : null),
        duoInput(ctx, [q, r], ['', ''], { pre: 'ได้', mid: 'เศษ', names: ['ผลหาร', 'เศษ'], hint: `${d} × ${q} = ${d * q} ใกล้ ${n} ที่สุดแต่ไม่เกิน → เหลือ ${n} − ${d * q}` }))); } };
  },
  dvCmp({ l, r }) { const L = l[0] / l[1], R = r[0] / r[1], sym = L > R ? '>' : L < R ? '<' : '=';
    return { prompt: 'เติมเครื่องหมาย > < หรือ =', say: `${l[0]} หาร ${l[1]} กับ ${r[0]} หาร ${r[1]} เติมเครื่องหมาย`, mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?');
      const hint = l[1] === r[1] ? 'ตัวหารเท่ากัน → ตัวตั้งมากกว่า ผลหารมากกว่า' : l[0] === r[0] ? 'ตัวตั้งเท่ากัน → ตัวหารมากกว่า ผลหารน้อยกว่า' : 'หาผลหารทั้งสองก่อน แล้วเปรียบเทียบ';
      bd.append(h('div', { class: 'colstack' }, h('div', { class: 'sentence' }, h('span', { class: 'lab' }, `${l[0]} ÷ ${l[1]}`), blank, h('span', { class: 'lab' }, `${r[0]} ÷ ${r[1]}`)), wordChoices(ctx, sym, blank, hint, ['>', '<', '=']))); } };
  },
  /* a ÷ b = c with the box at pos 0 (ตัวตั้ง) or 1 (ตัวหาร) */
  dvUnk({ a, b, c, pos }) { const x = pos === 0 ? a : b, L = pos === 0 ? '□' : a, R = pos === 1 ? '□' : b;
    return { prompt: `${L} ÷ ${R} = ${c}  □ คือจำนวนใด`, say: `${pos === 0 ? 'อะไร' : a} หารด้วย ${pos === 1 ? 'อะไร' : b} เท่ากับ ${c}`, mount(bd, ctx) {
      const hint = pos === 0 ? `ตัวตั้ง = ผลหาร × ตัวหาร → ${c} × ${b}` : `ตัวหาร = ตัวตั้ง ÷ ผลหาร → ${a} ÷ ${c} (${c} × อะไร = ${a})`;
      const right = pos === 0 ? `${c} × ${b}` : `${a} ÷ ${c}`, opts = pos === 0 ? [right, `${c} ÷ ${b}`, `${c} + ${b}`] : [right, `${a} × ${c}`, `${a} − ${c}`];
      const step2 = () => { if (pos === 0 && (c >= 10) !== (b >= 10)) { const w = h('div', { class: 'k3stcol' }); Q.colW({ nums: c >= 10 ? [c, b] : [b, c], op: '×' }).mount(w, ctx); return w; } return answerBox(ctx, String(x), { hint: pos === 0 ? `ท่องแม่ ${Math.min(b, c)}` : `${c} × อะไร = ${a}` }); };
      bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'fbig p4big mt-big', html: `${L === '□' ? '<span class="fsign">□</span>' : L} <span class="fop">÷</span> ${R === '□' ? '<span class="fsign">□</span>' : R} <span class="fop">=</span> ${c}` }),
        mtTwoStep(ctx, opts, right, hint, step2))); } }; /* v172: ① เลือกวิธีหา □ (ความสัมพันธ์คูณ-หาร) ② คูณ/หารเอง */
  },
  /* story: ① choose the sentence ② answer (with remainder when rem) */
  dvStory({ text, n, d, unit, unit2, fig }) { const q = Math.floor(n / d), r = n % d; /* v191: โจทย์ใหญ่ด้านบน เน้นคำถาม · ภาพซ้าย ขั้นตอนขวา */
    return { prompt: '<span class="w2pr">อ่านโจทย์ → เลือกประโยคสัญลักษณ์ → หาคำตอบ</span>', say: text, __sig: 'dvs ' + text, mount(bd, ctx) {
      const steps = mtTwoStep(ctx, dvOpts(n, d), `${fmt(n)} ÷ ${d}`, 'แบ่งเท่า ๆ กัน → หาร', () => r ? duoInput(ctx, [q, r], [unit, unit2 || unit], { pre: 'ได้', mid: 'เหลือ', names: [unit, `ที่เหลือ`], hint: `${d} × ${q} = ${d * q} → เหลือ ${n - d * q}` })
        : ppAns(ctx, q, `${d} × อะไร = ${n}`, unit));
      const top = h('div', { class: 'storybox w2stq', html: text.replace(/\s(\S*(?:เท่าไร|เท่าใด|กี่\S*))$/, ' <b class="w2qhl">$1</b>') });
      bd.append(h('div', { class: 'colstack w2st' }, top, fig ? ppSide(h('div', { class: 'dvfig', html: fig }), steps) : steps)); } };
  },
  /* v191: ดูภาพ แล้วบอกว่าหารลงตัวไหม */
  dvExactPic({ n, d }) { const e = pick(['cookie', 'strawberry', 'orange', 'apple']), r = n % d, q2 = `${n} ÷ ${d} หารลงตัวหรือไม่`;
    return { prompt: q2, say: q2, __sig: `dvx ${n}/${d}`, mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?');
      bd.append(ppSide(h('div', { class: 'colstack' }, h('div', { class: 'cap' }, `จัดถุงละ ${d}`), h('div', { class: 'dvfig', html: dvBags(n, d, e, { S: 26, W: 440, pileLab: r ? 'เหลือ' : '' }) })),
        h('div', { class: 'colstack' }, h('div', { class: 'sentence' }, h('span', { class: 'lab' }, `${n} ÷ ${d}`), blank), wordChoices(ctx, r ? 'หารไม่ลงตัว' : 'หารลงตัว', blank, r ? `จัดถุงละ ${d} แล้วยังเหลือ ${r}` : `จัดได้ ${n / d} ถุงพอดี ไม่มีเหลือ`, ['หารลงตัว', 'หารไม่ลงตัว'])))); } };
  }
});
const dvFacts = (tables, k) => mtFacts(tables, k).map(([a, b]) => [a * b, a]).filter(([n, d]) => d > 0);
const dvExactQ = items => Q.ixGroup({ q: 'แตะการ์ด แล้วแตะกล่องที่ใช่', bins: ['หารลงตัว', 'หารไม่ลงตัว'], items: items.map(([n, d]) => ({ label: `${n} ÷ ${d}`, bin: n % d ? 1 : 0, why: n % d ? `${n} ÷ ${d} มีเศษ ${n % d}` : `${d} × ${n / d} = ${n} พอดี` })) });

/* ---------- data: practice ---------- */
const DVW_GRP = [[35, 5, 'tomato', 'มะเขือเทศ', 'ถุง', 'ลูก'], [18, 3, 'chompoo', 'ชมพู่', 'จาน', 'ลูก'], [12, 3, 'sunflower', 'ดอกทานตะวัน', 'ตะกร้า', 'ดอก'], [10, 2, 'donut', 'โดนัท', 'กล่อง', 'ชิ้น'],
  [15, 3, 'cake', 'เค้ก', 'กล่อง', 'ชิ้น'], [20, 4, 'pineapple', 'สับปะรด', 'กล่อง', 'ผล'], [20, 5, 'orange', 'ส้ม', 'กล่อง', 'ผล'], [12, 4, 'cupcake', 'คัพเค้ก', 'จาน', 'ชิ้น'], [24, 6, 'fish', 'ปลา', 'ถุง', 'ตัว'], [32, 8, 'shrimp', 'กุ้ง', 'ถุง', 'ตัว']]; // 1 + PPT 6.1
const DVW_SHR = [[12, 2, 'mango', 'มะม่วง', 'กล่อง', 'ผล'], [12, 4, 'watermelon', 'แตงโม', 'กล่อง', 'ผล'], [16, 4, 'mangosteen', 'มังคุด', 'จาน', 'ผล'], [8, 4, 'fish', 'ปลา', 'ถุง', 'ตัว'],
  [15, 3, 'corn', 'ข้าวโพด', 'กล่อง', 'ฝัก'], [9, 3, 'durian', 'ทุเรียน', 'กล่อง', 'ผล'], [20, 4, 'cake', 'เค้ก', 'จาน', 'ชิ้น'], [24, 4, 'crab', 'ปู', 'ถุง', 'ตัว']]; // PPT 6.2
const DVW_CTR = [[18, 3], [20, 4], [28, 7], [10, 2], [16, 4], [24, 6], [22, 2], [27, 3], [45, 5], [42, 6], [24, 2], [32, 4], [36, 4], [60, 10], [77, 7], [80, 8], [14, 7], [100, 10]]; // PPT 6.3
const DVW_FACT = [[30, 5], [100, 10], [144, 12], [12, 6], [16, 2], [12, 3], [55, 11], [45, 5], [81, 9], [33, 11], [54, 6], [64, 8], [35, 7], [28, 4], [27, 9], [50, 10],
  [48, 6], [40, 8], [14, 7], [60, 12], [36, 6], [54, 9], [42, 6], [32, 4], [63, 9], [72, 12], [21, 7], [24, 8], [70, 10], [36, 12], [72, 6], [108, 12], [88, 11], [49, 7], [56, 8], [84, 7], [90, 9]]; // 2–4
const DVW_FAM = [[2, 3], [4, 5], [8, 3], [7, 4], [9, 8], [5, 6], [6, 10], [12, 11], [10, 2], [3, 12], [8, 5], [6, 9], [11, 7], [4, 9]]; // 5–6
const DVW_EX = [[12, 3], [18, 2], [21, 4], [27, 5], [14, 3], [30, 6], [28, 7], [35, 4], [24, 8], [40, 9], [16, 2], [32, 5], [27, 3], [41, 4], [45, 6]]; // 7
const DVW_REM = [[9, 2], [16, 7], [33, 5], [70, 6], [47, 8], [26, 4], [65, 11], [58, 12], [64, 9], [53, 8], [78, 10], [29, 3], [13, 2], [45, 6], [62, 5], [44, 7],
  [7, 4], [60, 7], [90, 11], [83, 12], [13, 5], [15, 2], [49, 9], [75, 11], [52, 5], [52, 8], [57, 10], [37, 7], [19, 3], [27, 6], [59, 9]]; // 8–9
const DVW_LET = [[48, 8], [132, 12], [67, 6], [27, 3], [83, 10], [24, 9], [49, 7], [50, 5], [76, 11], [25, 2]]; // 10
const DVW_CMP1 = [[[8, 4], [8, 2]], [[56, 7], [42, 7]], [[27, 3], [30, 3]], [[35, 5], [55, 5]], [[24, 3], [36, 3]], [[9, 3], [0, 3]], [[4, 4], [12, 4]], [[36, 6], [18, 6]], [[45, 5], [40, 5]], [[7, 1], [14, 1]], [[12, 2], [20, 2]], [[28, 7], [42, 7]],
  [[70, 7], [63, 7]], [[80, 10], [120, 10]], [[16, 2], [18, 2]], [[72, 6], [42, 6]], [[48, 12], [108, 12]], [[40, 8], [16, 8]]]; // 11–12 (ตัวหารเท่ากัน)
const DVW_CMP2 = [[[60, 10], [60, 12]], [[66, 11], [66, 6]], [[90, 9], [90, 10]], [[18, 3], [18, 6]], [[10, 2], [10, 5]], [[45, 5], [45, 9]], [[24, 2], [24, 3]], [[40, 5], [40, 10]], [[35, 7], [35, 5]], [[20, 2], [20, 5]], [[99, 11], [99, 9]], [[36, 3], [36, 12]]]; // (ตัวตั้งเท่ากัน)
const DVW_UNK = [[20, 4, 5, 1], [63, 7, 9, 0], [60, 10, 6, 1], [24, 6, 4, 1], [36, 12, 3, 0], [7, 7, 1, 1], [0, 11, 0, 0], [18, 9, 2, 0], [80, 8, 10, 0], [99, 9, 11, 1],
  [12, 4, 3, 0], [64, 8, 8, 0], [90, 10, 9, 1], [42, 7, 6, 0], [12, 6, 2, 0], [8, 8, 1, 1], [121, 11, 11, 1], [48, 4, 12, 0], [0, 8, 0, 0], [25, 5, 5, 1]]; // 13–14 [ตัวตั้ง, ตัวหาร, ผลหาร, ตำแหน่ง □]
const DVW_ST1 = [{ text: 'โรงอาหารมีเนื้อไก่ 45 กิโลกรัม ใช้ทำอาหารวันละ 9 กิโลกรัม จะใช้ได้กี่วัน', n: 45, d: 9, unit: 'วัน' },
  { text: 'ปอซื้อน้ำผลไม้ 5 กล่อง ราคาเท่ากันทุกกล่อง จ่ายเงินไป 30 บาท น้ำผลไม้ราคากล่องละกี่บาท', n: 30, d: 5, unit: 'บาท' },
  { text: 'ครูมีสีเทียน 60 แท่ง แบ่งใส่กล่อง 12 กล่อง กล่องละเท่ากัน จะได้กล่องละกี่แท่ง', n: 60, d: 12, unit: 'แท่ง' },
  { text: 'นักกีฬา 84 คน แบ่งเป็นทีม ทีมละ 7 คน จะได้กี่ทีม', n: 84, d: 7, unit: 'ทีม' },
  { text: 'แป้งเล่นเกมในสวนสนุก 63 นาที เล่นเกมละ 9 นาที แป้งเล่นได้กี่เกม', n: 63, d: 9, unit: 'เกม' },
  { text: 'แม่มีขนมเค้ก 18 ชิ้น จัดใส่กล่อง กล่องละ 6 ชิ้น จัดได้กี่กล่อง', n: 18, d: 6, unit: 'กล่อง', fig: () => dvBoard({ pile: 18, e: 'cake', S: 26, W: 420 }) },
  { text: 'พ่อมีลูกบอล 12 ลูก แบ่งให้ลูก 3 คนเท่า ๆ กัน ลูกจะได้คนละกี่ลูก', n: 12, d: 3, unit: 'ลูก', fig: () => dvBoard({ pile: 12, e: 'ball', S: 30, W: 420 }) }]; // 15–18 + PPT 6.10
const DVW_ST2 = [{ text: 'ยายมีเงิน 60 บาท แบ่งให้หลาน 11 คน คนละเท่า ๆ กัน หลานได้คนละกี่บาท และยายเหลือเงินกี่บาท', n: 60, d: 11, unit: 'บาท' },
  { text: 'สวนของลุงมีมะพร้าว 154 ลูก แบ่งให้เพื่อนบ้าน 10 บ้าน บ้านละเท่า ๆ กัน ได้บ้านละกี่ลูก และเหลือมะพร้าวกี่ลูก', n: 154, d: 10, unit: 'ลูก' },
  { text: 'เมย์จัดดอกทานตะวัน 61 ดอก ใส่แจกันใบละ 5 ดอก จัดได้กี่แจกัน และเหลือดอกทานตะวันกี่ดอก', n: 61, d: 5, unit: 'แจกัน', unit2: 'ดอก' },
  { text: 'แม่ค้ามีน้ำเปล่า 38 แพ็ก บริจาคให้โรงเรียนละ 6 แพ็ก บริจาคได้กี่โรงเรียน และเหลือน้ำเปล่ากี่แพ็ก', n: 38, d: 6, unit: 'โรงเรียน', unit2: 'แพ็ก' },
  { text: 'ป้ามีมังคุด 136 กิโลกรัม ใส่เข่ง เข่งละ 12 กิโลกรัม ได้กี่เข่ง และเหลือมังคุดกี่กิโลกรัม', n: 136, d: 12, unit: 'เข่ง', unit2: 'กิโลกรัม' },
  { text: 'มีคุกกี้ 13 ชิ้น แบ่งให้น้อง 3 คน คนละเท่า ๆ กัน น้องได้คนละกี่ชิ้น และเหลือกี่ชิ้น', n: 13, d: 3, unit: 'ชิ้น', fig: () => dvLeft(13, 4, 'cookie', { size: 12 }) },
  { text: 'สมชายเลี้ยงปลา 56 ตัว แบ่งใส่ตู้ปลา ตู้ละ 10 ตัว ได้กี่ตู้ และเหลือปลากี่ตัว', n: 56, d: 10, unit: 'ตู้', unit2: 'ตัว' },
  { text: 'ฝ้ายมีดอกกุหลาบ 35 ดอก มัดเป็นช่อ ช่อละ 6 ดอก ได้กี่ช่อ และเหลือดอกกุหลาบกี่ดอก', n: 35, d: 6, unit: 'ช่อ', unit2: 'ดอก' }]; // 15–18 + PPT 6.11
DVW_ST2[5].fig = () => dvBoard({ pile: 13, e: 'cookie', S: 30, W: 420 }); /* v191: ภาพไม่บอกคำตอบ */

/* ---------- lessons (① รู้จัก → ② ตัวอย่างมีรูป → ③ ลองทำ → เกม) ---------- */
const L2D = (no, place, title, short, goal, teach, game) => ({ id: 940 + no, no, place, title, short, tone: TONES5[no % 6], goal, teach, game, learned: true });
const dvPicQ = (x, mode) => Q.dvPic({ n: x[0], d: x[1], e: x[2], what: x[3], box: x[4], unit: x[5], mode });
const LESSONS_P2C6 = [
  L2D(1, 'หาดแบ่งกลุ่ม', 'ความหมายของการหาร (1)', 'ความหมายการหาร (1)', 'บอกความหมายของการหารเป็นการแบ่งออกเป็นกลุ่ม กลุ่มละเท่า ๆ กัน และเขียนประโยคสัญลักษณ์การหาร', [], null),
  L2D(2, 'หาดแบ่งให้เพื่อน', 'ความหมายของการหาร (2)', 'ความหมายการหาร (2)', 'บอกความหมายของการหารเป็นการแบ่งให้เท่า ๆ กัน และเขียนประโยคสัญลักษณ์การหาร', [], null),
  L2D(3, 'หาดตัวนับ', 'การหาผลหารโดยใช้ตัวนับ', 'ใช้ตัวนับ', 'หาผลหารโดยใช้ตัวนับจัดเป็นกลุ่ม กลุ่มละเท่า ๆ กัน', [], null),
  L2D(4, 'หาดคูณหาร', 'ความสัมพันธ์ของการคูณและการหาร', 'คูณ ↔ หาร', 'เขียนประโยคการหารจากประโยคการคูณ และบอกความสัมพันธ์ของการคูณและการหาร', [], null),
  L2D(5, 'หาดท่องหาร', 'การหาผลหารโดยใช้ความสัมพันธ์ของการคูณและการหาร', 'หารด้วยสูตรคูณ', 'หาผลหารโดยใช้ความสัมพันธ์ของการคูณและการหาร (ท่องสูตรคูณ)', [], null),
  L2D(6, 'หาดลงตัว', 'การหารลงตัวและการหารไม่ลงตัว', 'ลงตัว · ไม่ลงตัว', 'บอกได้ว่าการหารใดหารลงตัว และการหารใดหารไม่ลงตัว', [], null),
  L2D(7, 'หาดเศษ', 'การหาผลหารและเศษ', 'ผลหารและเศษ', 'หาผลหารและเศษของการหารที่หารไม่ลงตัว', [], null),
  L2D(8, 'หาดเทียบหาร', 'การพัฒนาความรู้สึกเชิงจำนวนเกี่ยวกับการหาร (1)', 'เทียบผลหาร (1)', 'เปรียบเทียบผลหารเมื่อตัวหารเท่ากัน โดยไม่ต้องคำนวณทุกตัว', [], null),
  L2D(9, 'หาดเทียบตัวหาร', 'การพัฒนาความรู้สึกเชิงจำนวนเกี่ยวกับการหาร (2)', 'เทียบผลหาร (2)', 'เปรียบเทียบผลหารเมื่อตัวตั้งเท่ากัน แต่ตัวหารต่างกัน', [], null),
  L2D(10, 'หาดตัวไม่ทราบค่า', 'การหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การหาร', 'ตัวไม่ทราบค่า', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การหาร', [], null),
  L2D(11, 'หาดโจทย์หาร', 'โจทย์ปัญหาการหาร (1)', 'โจทย์ปัญหา (1)', 'วิเคราะห์โจทย์ปัญหาการหารที่หารลงตัว เขียนประโยคสัญลักษณ์ และหาคำตอบ', [], null),
  L2D(12, 'หาดโจทย์มีเศษ', 'โจทย์ปัญหาการหาร (2)', 'โจทย์ปัญหา (2)', 'แก้โจทย์ปัญหาการหารที่มีเศษ บอกทั้งผลหารและสิ่งที่เหลือ', [], null)
];
/* pictures for the worked example in 941 used dvPile with 'coin'; ensure the art exists */
if (!ART.coin) ART.coin = `<circle cx="32" cy="32" r="22" fill="#FFD45C" stroke="#B7791F" stroke-width="3"/><circle cx="32" cy="32" r="14" fill="none" stroke="#E3A21C" stroke-width="2"/>`;

/* ---------- v191 (ผู้ใช้ขอ): หน้า “รู้จัก” เป็นภาพเดียวต่อเนื่อง (picWalk) · ตัวอย่าง/ลองทำ ใช้ภาพแบบเดียวกัน · เกมละ 10 ข้อ ---------- */
const dvW = (t, rows, fin, sayEnd) => T(t, t.replace(/<[^>]+>/g, ''), el => el.append(picWalk(rows, fin, sayEnd)));
const DVB1 = o => dvBoard({ e: 'orange', K: 3, G: 4, P: 12, S: 40, W: 520, ...o });
const DVB2 = o => dvBoard({ e: 'cookie', box: 'plate', K: 4, G: 3, P: 12, S: 40, W: 520, lab: i => `คนที่ ${i + 1}`, ...o });
const DVB6 = o => dvBoard({ e: 'cookie', K: 4, G: 4, P: 3, S: 36, W: 540, lab: i => `ถุงที่ ${i + 1}`, ...o });
const DVB7 = o => dvBoard({ e: 'apple', K: 5, G: 3, P: 4, S: 36, W: 540, lab: i => `ถุงที่ ${i + 1}`, ...o });
const dvNames = lrow(lcap(lbig('12', 'sm'), 'ตัวตั้ง'), lcap(lbig('÷ 3', 'sm'), 'ตัวหาร'), lcap(lbig('= 4', 'sm'), 'ผลหาร'));
const DV_TEACH = [
  /* 1 แบ่งกลุ่ม */
  [dvW('ยินดีต้อนรับสู่ <b>ชายหาดแบ่งเท่ากัน</b>! รู้จัก<b>การหาร</b>', [
    ['มีส้ม 12 ผล', 'อยากใส่ถุง <b>ถุงละ 3 ผล</b> จะได้กี่ถุง', DVB1({ pile: 12, pileLab: 'ส้ม 12 ผล' })],
    ['จัดใส่ถุง', 'หยิบทีละ 3 ผลใส่ถุง — ทุกถุงมี<b>เท่า ๆ กัน</b>', DVB1({ groups: [3, 3], pile: 6, lab: i => `ถุงที่ ${i + 1}`, pileLab: 'ยังไม่ได้จัด 6' })],
    ['จัดจนหมด', 'ได้ <b>4 ถุง</b> ไม่มีส้มเหลือ', DVB1({ groups: [3, 3, 3, 3], lab: i => `ถุงที่ ${i + 1}` })],
    ['เขียนเป็นการหาร', '<b>12 ÷ 3 = 4</b> อ่านว่า “สิบสองหารด้วยสาม เท่ากับสี่” · ÷ อ่านว่า “หาร”', `<div class="colstack dvpw">${DVB1({ groups: [3, 3, 3, 3], lab: i => `ถุงที่ ${i + 1}` })}${lbig('12 ÷ 3 = 4')}</div>`],
    ['ชื่อของแต่ละส่วน', '12 คือ<b>ตัวตั้ง</b> · 3 คือ<b>ตัวหาร</b> · 4 คือ<b>ผลหาร</b>', `<div class="colstack dvpw">${DVB1({ groups: [3, 3, 3, 3], lab: i => `ถุงที่ ${i + 1}` })}${dvNames}</div>`]],
    'การหาร = แบ่งเป็นกลุ่ม กลุ่มละเท่า ๆ กัน แล้วดูว่าได้กี่กลุ่ม'),
   pexStep('ตัวอย่างทีละขั้น: โดนัท 10 ชิ้น ใส่กล่องละ 2', 'ตัวอย่างทีละขั้น', [
    ['① ดูภาพ', 'โดนัท 10 ชิ้น', dvBoard({ e: 'donut', pile: 10, P: 10, K: 2, G: 5, S: 40, W: 520 })],
    ['② จัดใส่กล่อง', 'กล่องละ 2 ชิ้น', dvBoard({ e: 'donut', groups: [2, 2], pile: 6, P: 10, K: 2, G: 5, S: 40, W: 520 })],
    ['③ นับกล่อง', 'จัดจนหมด ได้ 5 กล่อง', dvBoard({ e: 'donut', groups: [2, 2, 2, 2, 2], P: 10, K: 2, G: 5, S: 40, W: 520, lab: i => `กล่องที่ ${i + 1}` })],
    ['④ ประโยคการหาร', '<b>10 ÷ 2 = 5</b>', null]], 'จัดได้ <b>5 กล่อง</b>'),
   T('ลองจัดเอง: เลือกจำนวนต่อถุง แล้วกดจัดใส่ถุง', 'ลองจัดเอง เลือกจำนวนต่อถุง แล้วกดจัดใส่ถุง', el => el.append(simDvGroup({ n: 12, ks: [3, 4, 6], e: 'strawberry', what: 'สตรอว์เบอร์รี', unit: 'ผล', box: 'ถุง' })))],
  /* 2 แบ่งให้เพื่อน */
  [dvW('การหารแบบ<b>แบ่งให้เท่า ๆ กัน</b>', [
    ['คุกกี้ 12 ชิ้น แบ่งให้ 3 คน', 'ทุกคนต้องได้<b>เท่ากัน</b>', DVB2({ groups: [0, 0, 0], pile: 12, pileLab: 'คุกกี้ 12 ชิ้น' })],
    ['แจกรอบที่ 1', 'แจกคนละ 1 ชิ้น ใช้ไป 3 ชิ้น เหลือ 9', DVB2({ groups: [1, 1, 1], pile: 9, pileLab: 'เหลือ 9' })],
    ['แจกรอบต่อไป', 'รอบที่ 2 คนละ 1 ชิ้นอีก → ได้คนละ 2 เหลือ 6', DVB2({ groups: [2, 2, 2], pile: 6, pileLab: 'เหลือ 6' })],
    ['แจกจนหมด', 'แจก 4 รอบ ทุกคนได้คนละ <b>4 ชิ้น</b>', DVB2({ groups: [4, 4, 4] })],
    ['เขียนเป็นการหาร', '12 ชิ้น แบ่ง 3 คน ได้คนละ 4 → <b>12 ÷ 3 = 4</b>', `<div class="colstack dvpw">${DVB2({ groups: [4, 4, 4] })}${lbig('12 ÷ 3 = 4')}</div>`]],
    'แบ่งให้ … คน เท่า ๆ กัน → หาร ได้คนละเท่าไร'),
   pexStep('ตัวอย่างทีละขั้น: มังคุด 16 ผล ใส่ 4 จาน', 'ตัวอย่างทีละขั้น', [
    ['① ดูภาพ', 'มังคุด 16 ผล มี 4 จาน', dvBoard({ e: 'mangosteen', box: 'plate', groups: [0, 0, 0, 0], pile: 16, K: 4, G: 4, P: 16, S: 34, W: 540 })],
    ['② แจกรอบที่ 1', 'จานละ 1 ผล (ใช้ไป 4)', dvBoard({ e: 'mangosteen', box: 'plate', groups: [1, 1, 1, 1], pile: 12, K: 4, G: 4, P: 16, S: 34, W: 540 })],
    ['③ แจกจนหมด', 'แจก 4 รอบ ได้จานละ 4', dvBoard({ e: 'mangosteen', box: 'plate', groups: [4, 4, 4, 4], K: 4, G: 4, P: 16, S: 34, W: 540 })],
    ['④ ประโยคการหาร', '<b>16 ÷ 4 = 4</b>', null]], 'ได้จานละ <b>4 ผล</b>'),
   T('ลองแจกเอง: กดแจกคนละ 1 จนหมด', 'ลองแจกเอง กดแจกคนละ 1 จนหมด', el => el.append(simDvShare({ n: 15, p: 3, e: 'apple', what: 'แอปเปิล', unit: 'ผล' })))],
  /* 3 ตัวนับ */
  [dvW('ใช้<b>ตัวนับ</b>หาผลหาร', [
    ['วางตัวนับ', '16 ÷ 4 → วางตัวนับ <b>16 ตัว</b> เท่ากับตัวตั้ง', `<div class="dvc-big">${dvCtrHTML(16, 4, 0)}</div>`],
    ['แตะทีละตัว', 'นับ 1, 2, 3, 4 ครบ 4 ตัว (ตัวหาร) เป็น<b>กลุ่มที่ 1</b> — ใส่เลข 1 สีเดียวกัน', `<div class="dvc-big">${dvCtrHTML(16, 4, 4)}</div>`],
    ['กลุ่มต่อไปเปลี่ยนสี', 'แตะต่อ ครบ 4 ตัวเป็นกลุ่มที่ 2, 3, … สีไม่ซ้ำกัน', `<div class="dvc-big">${dvCtrHTML(16, 4, 12)}</div>`],
    ['นับกลุ่ม', 'ครบทุกตัว ได้ <b>4 กลุ่ม</b> → 16 ÷ 4 = 4', `<div class="colstack dvpw"><div class="dvc-big">${dvCtrHTML(16, 4, 16)}</div>${lbig('16 ÷ 4 = 4')}</div>`]],
    'วางตัวนับ → แตะทีละตัว ครบตัวหารเป็น 1 กลุ่ม → จำนวนกลุ่มคือผลหาร'),
   pexStep('ตัวอย่างทีละขั้น: 24 ÷ 6', 'ตัวอย่างทีละขั้น', [
    ['① วางตัวนับ', '24 ตัว', `<div class="dvc-big">${dvCtrHTML(24, 6, 0)}</div>`],
    ['② กลุ่มที่ 1', 'แตะทีละตัว ครบ 6 ตัว', `<div class="dvc-big">${dvCtrHTML(24, 6, 6)}</div>`],
    ['③ แตะต่อจนหมด', 'ได้ 4 กลุ่ม (4 สี)', `<div class="dvc-big">${dvCtrHTML(24, 6, 24)}</div>`],
    ['④ ตอบ', '<b>24 ÷ 6 = 4</b>', null]], '24 ÷ 6 = <b>4</b>'),
   T('ลองเอง: แตะตัวนับทีละตัว กลุ่มละ 3', 'ลองเอง แตะตัวนับทีละตัว กลุ่มละสาม', el => el.append(simDvCounters(18, 3)))],
  /* 4 คูณ ↔ หาร */
  [dvW('<b>การคูณ</b>กับ<b>การหาร</b>เป็นคู่กัน', [
    ['ดูแผนภาพ', 'จุด 3 แถว แถวละ 4 จุด', dvArrSVG(3, 4)],
    ['การคูณ', 'นับทีละแถว 4, 8, 12 → <b>3 × 4 = 12</b>', dvArrSVG(3, 4, { run: true })],
    ['หารด้วย 3', 'แบ่ง 12 จุด เป็น <b>3 แถว</b>เท่า ๆ กัน (3 สี) ได้แถวละ 4 → <b>12 ÷ 3 = 4</b>', dvArrSVG(3, 4, { mode: 'rows' })],
    ['หารด้วย 4', 'แบ่ง 12 จุด เป็น <b>4 คอลัมน์</b> (4 สี) ได้คอลัมน์ละ 3 → <b>12 ÷ 4 = 3</b>', dvArrSVG(3, 4, { mode: 'cols', cols: true })],
    ['ครอบครัวเดียวกัน', 'ใช้จำนวน 3, 4, 12 ชุดเดียวกัน — รู้การคูณ 1 ประโยค ได้การหาร 2 ประโยค', `<div class="colstack dvpw">${dvArrSVG(3, 4)}${lbig('3 × 4 = 12<br>12 ÷ 3 = 4 · 12 ÷ 4 = 3')}</div>`]],
    'จากการคูณ 1 ประโยค เขียนการหารได้ 2 ประโยค'),
   pexStep('ตัวอย่างทีละขั้น: จาก 5 × 6 = 30', 'ตัวอย่างทีละขั้น', [['① การคูณ', '5 แถว แถวละ 6 → 5 × 6 = 30', dvArrSVG(5, 6, { run: true })], ['② หารด้วย 5', '30 แบ่งเป็น 5 แถว ได้แถวละ 6 → 30 ÷ 5 = 6', dvArrSVG(5, 6, { mode: 'rows' })], ['③ หารด้วย 6', '30 แบ่งเป็น 6 คอลัมน์ ได้คอลัมน์ละ 5 → 30 ÷ 6 = 5', dvArrSVG(5, 6, { mode: 'cols', cols: true })]], '5 × 6 = 30 · 30 ÷ 5 = 6 · 30 ÷ 6 = 5'),
   T('ลองกดดูทั้งสามประโยค', 'ลองกดดูทั้งสามประโยค', el => el.append(simDvFam(4, 6))), T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.dvFam({ a: 3, b: 5 }), 'ถูกต้อง!'))],
  /* 5 ท่องหาร — แยกทีละแม่ */
  [dvW('หาผลหารด้วย<b>สูตรคูณ</b>', [
    ['คิดกลับเป็นการคูณ', '35 ÷ 5 = ? → ถามตัวเองว่า <b>5 × อะไร = 35</b>', `<div class="colstack dvpw">${lbig('35 ÷ 5 = ?')}${lbig('5 × ? = 35', 'sm')}</div>`],
    ['ท่องแม่ 5', '5, 10, 15, 20, 25, 30, 35 → ถึง 35 ครั้งที่ <b>7</b>', `<div class="colstack dvpw">${mtHopSVG(5, 7)}${lbig('5 × ? = 35', 'sm')}</div>`],
    ['ได้ผลหาร', '5 × 7 = 35 → <b>35 ÷ 5 = 7</b>', `<div class="colstack dvpw">${mtHopSVG(5, 7)}${lbig('5 × 7 = 35 → 35 ÷ 5 = 7')}</div>`]],
    'ตัวหาร × อะไร = ตัวตั้ง → อะไรนั้นคือผลหาร · ต่อไปฝึกทีละแม่'),
   ...range(2, 9).flatMap(dvTablePages)],
  /* 6 ลงตัว · ไม่ลงตัว */
  [dvW('หาร<b>ลงตัว</b> กับ <b>ไม่ลงตัว</b>', [
    ['หารลงตัว', 'คุกกี้ 12 ชิ้น ใส่ถุงละ 4 ได้ 3 ถุงพอดี <b>ไม่มีเหลือ</b> → 12 ÷ 4 หารลงตัว', DVB6({ groups: [4, 4, 4] })],
    ['เพิ่มอีก 2 ชิ้น', 'มี 14 ชิ้น ใส่ถุงละ 4 ได้ 3 ถุง <b>เหลือ 2</b> ใส่ถุงไม่ครบ → 14 ÷ 4 หารไม่ลงตัว', DVB6({ groups: [4, 4, 4], pile: 2, pileLab: 'เหลือ 2' })],
    ['เศษ', 'ของที่เหลือเรียกว่า <b>เศษ</b> · เศษต้องน้อยกว่าตัวหาร (2 น้อยกว่า 4)', `<div class="colstack dvpw">${DVB6({ groups: [4, 4, 4], pile: 2, pileLab: 'เศษ 2' })}${lbig('14 ÷ 4 ได้ 3 เศษ 2')}</div>`],
    ['เหลือเท่าตัวหาร', 'เพิ่มอีก 2 เป็น 16 → เหลือ 4 จัดได้อีก 1 ถุง → 16 ÷ 4 = 4 ลงตัว', DVB6({ groups: [4, 4, 4, 4] })]],
    'ไม่มีเหลือ = หารลงตัว · มีเหลือ = หารไม่ลงตัว'),
   pexStep('ตัวอย่างทีละขั้น: 21 ÷ 4', 'ตัวอย่างทีละขั้น', [['① จัดถุงละ 4', '4, 8, 12, 16, 20 → 5 ถุง', dvBags(21, 4, 'cookie', { G: 5, P: 3, S: 32, W: 540, pileLab: 'เหลือ 1', lab: i => `${(i + 1) * 4}` })], ['② ดูที่เหลือ', 'เหลือ 1 ใส่ถุงไม่ได้', null], ['③ สรุป', '21 ÷ 4 <b>หารไม่ลงตัว</b> (เศษ 1)', null]], '21 ÷ 4 หารไม่ลงตัว (เศษ 1)'),
   T('ลองเพิ่ม-ลดคุกกี้ ดูว่าลงตัวไหม', 'ลองเพิ่มลดคุกกี้ ดูว่าลงตัวไหม', el => el.append(simDvRem(4)))],
  /* 7 ผลหารและเศษ */
  [dvW('หา<b>ผลหารและเศษ</b>', [
    ['17 ÷ 5', 'แอปเปิล 17 ผล ใส่ถุงละ 5', DVB7({ pile: 17, P: 17, pileLab: 'แอปเปิล 17 ผล' })],
    ['จัดเป็นกลุ่มเต็ม', 'ได้ 3 ถุงเต็ม เหลือ 2 ผล', DVB7({ groups: [5, 5, 5], pile: 2, P: 17, pileLab: 'เหลือ 2' })],
    ['เขียนผลหารและเศษ', '<b>17 ÷ 5 ได้ 3 เศษ 2</b> · ผลหาร = 3 · เศษ = 2', `<div class="colstack dvpw">${DVB7({ groups: [5, 5, 5], pile: 2, P: 17, pileLab: 'เศษ 2' })}${lbig('17 ÷ 5 ได้ 3 เศษ 2')}</div>`],
    ['คิดด้วยสูตรคูณ', '5 × 3 = 15 ใกล้ 17 ที่สุดแต่ไม่เกิน → 17 − 15 = 2', `<div class="colstack dvpw">${DVB7({ groups: [5, 5, 5], pile: 2, P: 17, pileLab: 'เศษ 2' })}${lbig('5 × 3 = 15 → 17 − 15 = 2')}</div>`]],
    'ผลหาร = จำนวนกลุ่มเต็ม · เศษ = ที่เหลือ (น้อยกว่าตัวหาร)'),
   pexStep('ตัวอย่างทีละขั้น: 47 ÷ 8', 'ตัวอย่างทีละขั้น', [['① ท่องแม่ 8', '8, 16, 24, 32, 40, 48', mtHopSVG(8, 6)], ['② เลือก', '48 เกิน 47 → ใช้ 8 × 5 = 40', null], ['③ หาเศษ', '47 − 40 = 7 (น้อยกว่า 8 ✓)', dvBags(47, 8, 'strawberry', { G: 5, P: 7, S: 22, W: 560, lab: i => `${(i + 1) * 8}`, cols: 4 })]], '47 ÷ 8 ได้ <b>5 เศษ 7</b>'),
   T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.dvRem({ n: 23, d: 4 }), 'ถูกต้อง!'))],
  /* 8 ตัวหารเท่ากัน */
  [dvW('ตัวหาร<b>เท่ากัน</b>', [
    ['8 ÷ 4', 'สตรอว์เบอร์รี 8 ผล แบ่งให้ 4 คน ได้คนละ 2', dvBoard({ groups: [2, 2, 2, 2], e: 'strawberry', box: 'plate', K: 5, G: 4, S: 30, W: 560, lab: i => `คนที่ ${i + 1}` })],
    ['20 ÷ 4', 'เพิ่มเป็น 20 ผล แบ่ง 4 คนเท่าเดิม ได้คนละ 5', dvBoard({ groups: [5, 5, 5, 5], e: 'strawberry', box: 'plate', K: 5, G: 4, S: 30, W: 560, lab: i => `คนที่ ${i + 1}` })],
    ['เปรียบเทียบ', 'ตัวหารเท่ากัน (4) · ตัวตั้งมากกว่า ผลหารมากกว่า → <b>8 ÷ 4 &lt; 20 ÷ 4</b>', `<div class="colstack dvpw">${dvBoard({ groups: [5, 5, 5, 5], e: 'strawberry', box: 'plate', K: 5, G: 4, S: 30, W: 560 })}${lbig('8 ÷ 4 &lt; 20 ÷ 4')}</div>`]],
    'ตัวหารเท่ากัน · ตัวตั้งมาก ผลหารมาก'),
   pexStep('ตัวอย่างทีละขั้น: 56 ÷ 7 กับ 42 ÷ 7', 'ตัวอย่างทีละขั้น', [['① ดูตัวหาร', 'เท่ากัน คือ 7', lbig('56 ÷ 7 ? 42 ÷ 7')], ['② ดูตัวตั้ง', '56 มากกว่า 42', null], ['③ สรุป', '56 ÷ 7 <b>&gt;</b> 42 ÷ 7', lbig('56 ÷ 7 &gt; 42 ÷ 7')]], '56 ÷ 7 &gt; 42 ÷ 7'),
   T('ลองเปลี่ยนจำนวนสตรอว์เบอร์รี', 'ลองเปลี่ยนจำนวนสตรอว์เบอร์รี', el => el.append(simDvSense('top')))],
  /* 9 ตัวตั้งเท่ากัน */
  [dvW('ตัวตั้ง<b>เท่ากัน</b> ตัวหารต่างกัน', [
    ['12 ÷ 2', 'คุกกี้ 12 ชิ้น แบ่งให้ 2 คน ได้คนละ 6', dvBoard({ groups: [6, 6], e: 'cookie', box: 'plate', K: 6, G: 6, S: 28, W: 560, lab: i => `คนที่ ${i + 1}` })],
    ['12 ÷ 6', 'คุกกี้ 12 ชิ้นเท่าเดิม แบ่งให้ 6 คน ได้คนละ 2', dvBoard({ groups: [2, 2, 2, 2, 2, 2], e: 'cookie', box: 'plate', K: 6, G: 6, S: 28, W: 560, lab: i => `คนที่ ${i + 1}` })],
    ['เปรียบเทียบ', 'แบ่งให้คนมาก ได้คนละน้อย → <b>12 ÷ 2 &gt; 12 ÷ 6</b>', `<div class="colstack dvpw">${dvBoard({ groups: [2, 2, 2, 2, 2, 2], e: 'cookie', box: 'plate', K: 6, G: 6, S: 28, W: 560 })}${lbig('12 ÷ 2 &gt; 12 ÷ 6')}</div>`]],
    'ตัวตั้งเท่ากัน · ตัวหารมาก ผลหารน้อย'),
   pexStep('ตัวอย่างทีละขั้น: 45 ÷ 5 กับ 45 ÷ 9', 'ตัวอย่างทีละขั้น', [['① ดูตัวตั้ง', 'เท่ากัน คือ 45', lbig('45 ÷ 5 ? 45 ÷ 9')], ['② ดูตัวหาร', '5 น้อยกว่า 9', null], ['③ สรุป', 'ตัวหารน้อย ผลหารมาก → 45 ÷ 5 <b>&gt;</b> 45 ÷ 9', lbig('45 ÷ 5 &gt; 45 ÷ 9')]], '45 ÷ 5 &gt; 45 ÷ 9'),
   T('ลองเปลี่ยนจำนวนคน', 'ลองเปลี่ยนจำนวนคน', el => el.append(simDvSense('bot')))],
  /* 10 ตัวไม่ทราบค่า */
  [dvW('หา<b>ตัวไม่ทราบค่า</b>ในการหาร', [
    ['ไม่รู้ตัวตั้ง', '□ ÷ 4 = 3 → แบ่งถุงละ 4 ได้ 3 ถุง มีทั้งหมดกี่ชิ้น', `<div class="colstack dvpw">${lbig('□ ÷ 4 = 3')}${dvBoard({ groups: [0, 0, 0], e: 'cookie', K: 4, G: 3, S: 34, W: 520 })}</div>`],
    ['ใช้การคูณ', '3 ถุง ถุงละ 4 → 3 × 4 = <b>12</b> → □ = 12', `<div class="colstack dvpw">${lbig('3 × 4 = 12')}${dvBoard({ groups: [4, 4, 4], e: 'cookie', K: 4, G: 3, S: 34, W: 520 })}</div>`],
    ['ตรวจ', '12 ÷ 4 = 3 ✓', `<div class="colstack dvpw">${lbig('12 ÷ 4 = 3 ✓')}${dvBoard({ groups: [4, 4, 4], e: 'cookie', K: 4, G: 3, S: 34, W: 520 })}</div>`],
    ['ไม่รู้ตัวหาร', '20 ÷ □ = 5 → 5 × อะไร = 20 → □ = <b>4</b>', lbig('20 ÷ □ = 5 → 5 × 4 = 20')]], 'ใช้การคูณช่วยหาตัวที่หายไป'),
   pexStep('ตัวอย่างทีละขั้น: 60 ÷ □ = 6', 'ตัวอย่างทีละขั้น', [['① อ่าน', '60 แบ่งเท่า ๆ กัน ได้ 6 → แบ่งเป็นกี่กลุ่ม', lbig('60 ÷ □ = 6')], ['② ใช้การคูณ', '6 × อะไร = 60', mtHopSVG(6, 10)], ['③ ได้', '6 × 10 = 60 → □ = 10', null], ['④ ตรวจ', '60 ÷ 10 = 6 ✓', null]], '□ = <b>10</b>'),
   T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.dvUnk({ a: 28, b: 7, c: 4, pos: 0 }), 'ถูกต้อง!'))],
  /* 11 โจทย์ปัญหา (1) */
  [dvW('ขั้นตอน<b>แก้โจทย์ปัญหาการหาร</b>', [
    ['① หาคำที่บอกว่าแบ่ง', 'มีไข่ 24 ฟอง ใส่<b>แผงละ 6</b> ฟอง ได้กี่แผง — “…ละ” “แบ่ง…เท่า ๆ กัน” → หาร', dvBoard({ e: 'egg', pile: 24, P: 24, K: 6, G: 4, S: 28, W: 540, pileLab: 'ไข่ 24 ฟอง' })],
    ['② วาดภาพ', 'จัดแผงละ 6 ฟอง', dvBoard({ e: 'egg', groups: [6, 6, 6, 6], K: 6, G: 4, P: 24, S: 28, W: 540, lab: i => `แผงที่ ${i + 1}` })],
    ['③ ประโยคสัญลักษณ์', '24 ÷ 6 = □ · 6 × 4 = 24 → □ = 4', null],
    ['④ ตอบพร้อมหน่วย', 'ตอบ <b>4 แผง</b>', null]], 'มีของทั้งหมด แบ่งเท่า ๆ กัน → หาร · ตอบพร้อมหน่วย'),
   T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.dvStory({ text: 'มีลูกอม 30 เม็ด แบ่งให้เด็ก 5 คนเท่า ๆ กัน ได้คนละกี่เม็ด', n: 30, d: 5, unit: 'เม็ด', fig: dvBoard({ e: 'lollipop', pile: 30, S: 24, W: 420 }) }), 'ถูกต้อง!'))],
  /* 12 โจทย์มีเศษ */
  [dvW('โจทย์การหารที่<b>มีเศษ</b>', [
    ['แบ่งแล้วมีเหลือ', 'แอปเปิล 26 ผล ใส่ถุงละ 4 ได้ 6 ถุง เหลือ 2 ผล', dvBags(26, 4, 'apple', { G: 6, P: 3, S: 30, W: 560, lab: i => `ถุงที่ ${i + 1}` })],
    ['ตอบให้ครบ', 'ได้กี่ถุง <b>และ</b> เหลือกี่ผล → 26 ÷ 4 ได้ 6 เศษ 2', `<div class="colstack dvpw">${dvBags(26, 4, 'apple', { G: 6, P: 3, S: 30, W: 560 })}${lbig('26 ÷ 4 ได้ 6 เศษ 2')}</div>`],
    ['ใส่หน่วยให้ถูก', 'ผลหารเป็นหน่วยของกลุ่ม (ถุง) · เศษเป็นหน่วยของสิ่งของ (ผล)', `<div class="colstack dvpw">${dvBags(26, 4, 'apple', { G: 6, P: 3, S: 30, W: 560 })}${lbig('ตอบ 6 ถุง เหลือ 2 ผล')}</div>`]],
    'มีเศษ → ตอบทั้งผลหารและเศษ พร้อมหน่วย'),
   T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.dvStory({ text: 'มีส้ม 22 ผล ใส่ถุงละ 5 ผล ได้กี่ถุง และเหลือส้มกี่ผล', n: 22, d: 5, unit: 'ถุง', unit2: 'ผล', fig: dvBoard({ e: 'orange', pile: 22, S: 26, W: 420 }) }), 'ถูกต้อง!'))]];
const dvLv = (n, d) => (n > 50) * 2 + (d > 6) + (n % d ? 1 : 0);
const DV_GAMES = [
  () => [...pkF(DVW_GRP, 7).map(x => dvPicQ(x, 'group')), ...pkF(DVW_SHR.filter(x => x[0] / x[1] <= 6), 3).map(x => dvPicQ(x, 'group'))].slice(0, 10),
  () => [...pkF(DVW_SHR, 6).map(x => dvPicQ(x, 'share')), ...pkF(DVW_GRP, 2).map(x => dvPicQ(x, 'share')), Q.ixGroup({ q: 'การหารนี้ถามอะไร แตะการ์ดแล้วแตะกล่อง', bins: ['ถามว่าได้กี่กลุ่ม', 'ถามว่าได้กลุ่มละเท่าไร'], items: [
      { label: 'ส้ม 20 ผล ใส่ถุงละ 5 ได้กี่ถุง', bin: 0 }, { label: 'ส้ม 20 ผล แบ่ง 4 คน ได้คนละกี่ผล', bin: 1 }, { label: 'ไข่ 18 ฟอง ใส่แผงละ 6 ได้กี่แผง', bin: 0 }, { label: 'ไข่ 18 ฟอง แบ่ง 3 แผงเท่ากัน ได้แผงละกี่ฟอง', bin: 1 }].map(x => ({ ...x, why: x.bin ? 'รู้จำนวนคน/กลุ่มแล้ว ถามว่าได้เท่าไร' : 'รู้ว่ากลุ่มละเท่าไร ถามว่าได้กี่กลุ่ม' })) }),
    Q.ixGroup({ q: 'แตะการ์ด แล้วแตะกล่องที่ใช่', bins: ['ถามว่าได้กี่กลุ่ม', 'ถามว่าได้กลุ่มละเท่าไร'], items: [
      { label: 'ดินสอ 24 แท่ง ใส่กล่องละ 8 ได้กี่กล่อง', bin: 0 }, { label: 'ดินสอ 24 แท่ง แบ่ง 3 คน ได้คนละกี่แท่ง', bin: 1 }, { label: 'ขนม 30 ชิ้น ใส่ถุงละ 5 ได้กี่ถุง', bin: 0 }, { label: 'ขนม 30 ชิ้น แบ่ง 6 คน ได้คนละกี่ชิ้น', bin: 1 }].map(x => ({ ...x, why: x.bin ? 'รู้จำนวนคน/กลุ่มแล้ว ถามว่าได้เท่าไร' : 'รู้ว่ากลุ่มละเท่าไร ถามว่าได้กี่กลุ่ม' })) })],
  () => pkF(DVW_CTR.filter(([n]) => n <= 45), 10).sort((a, b) => a[0] - b[0]).map(([n, d]) => Q.dvCtr({ n, d })),
  () => [...pkF(DVW_FAM, 7).map(([a, b]) => Q.dvFam({ a, b })), ...[0, 1, 2].map(() => Q.ixMatch({ q: 'จับคู่การหารกับการคูณที่ช่วยคิด', pairs: pkF([[24, 6], [35, 5], [36, 9], [42, 7], [18, 3], [40, 8], [27, 9], [32, 4], [54, 6]], 3).map(([n, d]) => [`${n} ÷ ${d}`, `${d} × ${n / d} = ${n}`]) }))],
  () => [...pkF(DVW_FACT, 6).sort((a, b) => dvLv(...a) - dvLv(...b)).map(([n, d]) => Q.dvFact({ n, d })), Q.dvPop({ facts: dvFacts(range(2, 5), 5) }), Q.dvPop({ facts: dvFacts(range(6, 9), 5) }),
    Q.ixMatch({ q: 'จับคู่การหารกับผลหาร', pairs: pkF([[14, 2], [24, 3], [32, 4], [45, 5], [42, 6], [56, 7], [72, 8], [63, 9]], 4).map(([n, d]) => [`${n} ÷ ${d}`, String(n / d)]) }), Q.dvFam({ a: pick([6, 7, 8]), b: pick([4, 5, 9]) })],
  () => { const E = shuffle(DVW_EX.slice()), P = E.slice(0, 5), A = E.slice(5, 11), B = E.slice(9, 15), key = ([n, d]) => n + '/' + d, used = new Set([...P, ...A, ...B].map(key));
    return [...P.map(([n, d]) => Q.dvExactPic({ n, d })), dvExactQ(A), dvExactQ(B), ...pkF(DVW_FACT.filter(x => !used.has(key(x)) && x[0] <= 60), 3).map(([n, d]) => Q.dvFact({ n, d }))]; },
  () => [...pkF(DVW_REM.filter(([n]) => n <= 40), 4).map(([n, d]) => Q.dvRem({ n, d })), ...pkF(DVW_REM.filter(([n]) => n > 40), 4).map(([n, d]) => Q.dvRem({ n, d })), ...[0, 1].map(() => Q.ixMatch({ q: 'จับคู่การหารกับคำตอบ', pairs: pkF(DVW_LET, 4).map(([n, d]) => [`${n} ÷ ${d}`, n % d ? `${Math.floor(n / d)} เศษ ${n % d}` : String(n / d)]) }))],
  () => pkF(DVW_CMP1, 10).map(([l, r]) => Q.dvCmp({ l, r })),
  () => [...pkF(DVW_CMP2, 8).map(([l, r]) => Q.dvCmp({ l, r })), ...pkF(DVW_CMP1, 2).map(([l, r]) => Q.dvCmp({ l, r }))],
  () => pkF(DVW_UNK, 10).map(([a, b, c, pos]) => Q.dvUnk({ a, b, c, pos })),
  () => pkF(DVW_ST1, 10).map(s => Q.dvStory({ ...s, fig: s.fig ? s.fig() : null })),
  () => pkF(DVW_ST2, 10).map(s => Q.dvStory({ ...s, fig: s.fig ? s.fig() : null }))];
LESSONS_P2C6.forEach((L, i) => { L.teach = DV_TEACH[i]; L.game = DV_GAMES[i]; L.gameN = 10; });

/* ---------- boss: built from our own practice items (no test in the files) — d6spread · every item tagged with its level (lv) ---------- */
const dvX = (q, r, extra, unit = '', lv) => { const out = [r]; [...extra, r + 1, r - 1, r + 2].forEach(x => { if (out.length < 4 && x >= 0 && !out.includes(x)) out.push(x); }); return { q, opts: out.map(v => `${v}${unit ? ' ' + unit : ''}`), a: 0, lv }; };
const EXAM_P2C6 = d6spread([
  { q: 'มีลูกพลับ 35 ลูก ใส่ถุง ถุงละ 5 ลูก เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร', opts: ['35 ÷ 5 = □', '35 × 5 = □', '35 − 5 = □', '5 ÷ 35 = □'], a: 0, lv: 941 },
  { q: 'จากรูป แบ่งได้กี่ถุง', fig: `<div class="p4-fig">${mtGroupsSVG(4, 6, 'fish', { box: 'bag', size: 13 })}</div>`, opts: ['4 ถุง', '6 ถุง', '24 ถุง'], a: 0, lv: 941 },
  dvX('มังคุด 16 ผล แบ่งใส่ 4 จาน จานละเท่า ๆ กัน ได้จานละกี่ผล', 4, [12, 20], 'ผล', 942),
  { q: 'ข้อใดเป็นการหาร', opts: ['ส้ม 20 ผล แบ่งให้ 4 คนเท่า ๆ กัน', 'ส้ม 4 ถุง ถุงละ 5 ผล', 'มีส้ม 20 ผล ซื้อเพิ่ม 4 ผล', 'มีส้ม 20 ผล กินไป 4 ผล'], a: 0, lv: 942 },
  dvX('ตัวนับ 27 ตัว วงกลุ่มละ 3 ตัว ได้กี่กลุ่ม', 9, [8, 24], 'กลุ่ม', 943),
  { q: 'จาก 7 × 4 = 28 ข้อใดถูกต้อง', opts: ['28 ÷ 7 = 4', '28 ÷ 4 = 6', '28 ÷ 7 = 7', '4 ÷ 28 = 7'], a: 0, lv: 944 },
  dvX('132 ÷ 12 = ?', 11, [12, 10], '', 944),
  dvX('63 ÷ 9 = ?', 7, [6, 8], '', 945), dvX('72 ÷ 6 = ?', 12, [11, 13], '', 945), dvX('56 ÷ 8 = ?', 7, [6, 9], '', 945),
  { q: 'ข้อใดเป็นการหารไม่ลงตัว', opts: ['35 ÷ 4', '28 ÷ 7', '24 ÷ 8', '30 ÷ 6'], a: 0, lv: 946 },
  { q: '47 ÷ 8 ได้เท่าไร', opts: ['5 เศษ 7', '6 เศษ 1', '5 เศษ 5', '7 เศษ 5'], a: 0, lv: 947 },
  { q: '67 ÷ 6 ได้เท่าไร', opts: ['11 เศษ 1', '10 เศษ 7', '11', '12 เศษ 1'], a: 0, lv: 947 },
  { q: '56 ÷ 7 … 42 ÷ 7 ควรเติมเครื่องหมายใด', opts: ['>', '<', '='], a: 0, lv: 948 },
  { q: '45 ÷ 5 … 45 ÷ 9 ควรเติมเครื่องหมายใด', opts: ['>', '<', '='], a: 0, lv: 949 },
  dvX('□ ÷ 7 = 9  □ คือจำนวนใด', 63, [16, 2], '', 950), dvX('99 ÷ □ = 11  □ คือจำนวนใด', 9, [88, 110], '', 950),
  dvX('โรงอาหารมีเนื้อไก่ 54 กิโลกรัม ใช้วันละ 9 กิโลกรัม ใช้ได้กี่วัน', 6, [45, 63], 'วัน', 951),
  dvX('มีนักเรียน 63 คน แบ่งกลุ่มละ 7 คน ได้กี่กลุ่ม', 9, [56, 70], 'กลุ่ม', 951),
  { q: 'เมย์จัดดอกทานตะวัน 61 ดอก ใส่แจกันใบละ 5 ดอก จัดได้กี่แจกัน และเหลือกี่ดอก', opts: ['12 แจกัน เหลือ 1 ดอก', '11 แจกัน เหลือ 6 ดอก', '12 แจกัน เหลือ 5 ดอก', '13 แจกัน'], a: 0, lv: 952 }]);
LESSONS_P2C6.push({ id: 959, boss: true, place: 'อ่าวแบ่งเท่า', title: 'ด่านบอส: บทที่ 6 การหาร', short: 'ด่านบอส · ข้อสอบ', tone: 'lilac',
  goal: 'คำถามท้ายบท 20 ข้อ (ความหมายของการหาร ตัวนับ คูณ–หาร หารลงตัว ผลหารและเศษ เปรียบเทียบ ตัวไม่ทราบค่า โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P2C6, pass: 10, bossName: 'ปีศาจปลาหมึกแบ่งเท่า', bossPal: 'lilac', emblem: '÷', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกแบ่งเท่าแล้ว! แบ่งอะไรก็เท่ากันทุกคน', loseLine: 'ปีศาจปลาหมึกยังแบ่งเก่งกว่า กลับไปทวนแล้วสู้ใหม่นะ!' });
