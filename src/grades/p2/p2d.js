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
/* counters (ตัวนับ) for tapping into groups */
const dvCtrHTML = n => `<div class="dvc">${range(0, n - 1).map(i => `<span class="ct" data-i="${i}"></span>`).join('')}</div>`;
function dvCircle(el, k, onGroup) { let next = 0, g = 0; const cts = [...el.querySelectorAll('.ct')];
  el.classList.add('ia'); el.onclick = e => { e.stopPropagation(); if (next + k > cts.length) { sfx.no(); return; } for (let i = next; i < next + k; i++) cts[i].classList.add('g' + (g % 4)); cts[next].classList.add('gs'); cts[next + k - 1].classList.add('ge');
    next += k; g++; sfx.pop(g); onGroup && onGroup(g, cts.length - next); };
  return { reset: () => { next = 0; g = 0; cts.forEach(c => c.className = 'ct'); } }; }

/* ---------- generic 2-slot answer (ผลหาร | เศษ) ---------- */
function duoInput(ctx, want, U, o = {}) {
  const val = ['', '']; let cur = 0, done = false;
  const slots = [0, 1].map(i => h('button', { class: 'mc-slot', onclick: e => { e.stopPropagation(); if (!done) { cur = i; paint(); } } }, '?'));
  const msg = h('div', { class: 'pad-msg' });
  const paint = () => slots.forEach((s, i) => { s.textContent = val[i] === '' ? '?' : fmt(+val[i]); s.classList.toggle('on', i === cur && !done); s.classList.toggle('filled', val[i] !== ''); });
  const type = d => { if (done) return; sfx.tap(); msg.textContent = ''; val[cur] = (val[cur] + d).slice(-Math.max(3, String(want[cur]).length + 1, 7)).replace(/^0+(\d)/, '$1'); paint(); };
  const ok = () => { if (done) return;
    if (val[cur] === '') { msg.textContent = `กดจำนวน${U[cur]} (ถ้าไม่มีให้กด 0)`; return; }
    const other = 1 - cur; if (val[other] === '') { cur = other; paint(); msg.textContent = `ต่อไปกด${U[cur]} (ถ้าไม่มีให้กด 0)`; return; }
    const good = +val[0] === want[0] && +val[1] === want[1]; if (good) { done = true; wrap.classList.add('done'); }
    ctx.check(good, o.hint); if (!good) { val[0] = val[1] = ''; cur = 0; paint(); } };
  const kp = h('div', { class: 'keypad' });
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: () => type(d) }, d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: () => { sfx.tap(); val[cur] = val[cur].slice(0, -1); paint(); } }, icon('left')), h('button', { class: 'btn', onclick: () => type(0) }, '0'), h('button', { class: 'btn primary', 'aria-label': 'ส่งคำตอบ', onclick: ok }, icon('check')));
  const wrap = h('div', { class: 'ans mc-ans ia' }, h('div', { class: 'mc-row' }, o.pre === '' ? null : h('span', { class: 'mc-u' }, o.pre || 'ได้'), slots[0], h('span', { class: 'mc-u' }, U[0]), slots[1], h('span', { class: 'mc-u' }, U[1])), kp, msg);
  wrap.reveal = () => { val[0] = String(want[0]); val[1] = String(want[1]); done = true; paint(); wrap.classList.add('done', 'revealed'); }; wrap.ansText = want.map(String);
  paint(); return wrap;
}

/* ---------- teaching sims ---------- */
/* put things into boxes, k per box — how many boxes? (การหาร = แบ่งเป็นกลุ่ม กลุ่มละเท่า ๆ กัน) */
function simDvGroup(cfg) {
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), bar = h('div', { class: 'rowstack ia' }); let k = cfg.ks[0], left, g, tried = new Set();
  const draw = () => { fig.innerHTML = `<div class="dv-left">${g ? mtGroupsSVG(g, k, cfg.e, { box: 'bag', size: 15 }) : ''}${left ? `<div class="dv-rem pile">${dvPile(left, cfg.e, 18, 6)}<small>ยังไม่ได้จัด ${left}</small></div>` : ''}</div>`; };
  const reset = () => { left = cfg.n; g = 0; draw(); out.innerHTML = `${cfg.what} ${cfg.n} ${cfg.unit}<br>กด “จัดใส่${cfg.box}” ทีละ${cfg.box}`; };
  const go = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (left < k) return; left -= k; g++; sfx.pop(g); draw();
    if (left >= k) { out.innerHTML = `จัดได้ ${g} ${cfg.box}<br>เหลือ ${left} ${cfg.unit}`; return; }
    tried.add(k); out.innerHTML = `${cfg.box}ละ ${k} ได้ <b>${g} ${cfg.box}</b>${left ? `<br>เหลือ ${left}` : ''}<br>เขียนว่า <b>${cfg.n} ÷ ${k} = ${g}</b>`; say(`${cfg.n} หารด้วย ${k} เท่ากับ ${g}`, true);
    if (tried.size >= Math.min(2, cfg.ks.length)) teachDone(box); else out.innerHTML += '<br>ลองเปลี่ยนจำนวนต่อ' + cfg.box + 'ดู'; } }, 'จัดใส่' + cfg.box);
  cfg.ks.forEach((x, i) => bar.append(h('button', { class: 'btn sm ia vsel' + (i ? '' : ' on'), onclick: e => { e.stopPropagation(); k = x; bar.querySelectorAll('.vsel').forEach((b, j) => b.classList.toggle('on', j === i)); sfx.tap(); reset(); } }, `${cfg.box}ละ ${x}`)));
  reset(); box.append(bar, fig, go, out); return box;
}
/* deal one to each person per round (การหาร = แบ่งให้เท่า ๆ กัน) */
function simDvShare(cfg) {
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(); let left = cfg.n, each = 0;
  const draw = () => { fig.innerHTML = `<div class="dv-left">${mtGroupsSVG(cfg.p, each, cfg.e, { box: 'plate', size: 15 })}${left ? `<div class="dv-rem pile">${dvPile(left, cfg.e, 18, 6)}<small>ยังไม่ได้แจก ${left}</small></div>` : ''}</div>`; };
  const go = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (left < cfg.p) return; left -= cfg.p; each++; sfx.pop(each); draw();
    if (left >= cfg.p) { out.innerHTML = `แจกรอบที่ ${each} แล้ว<br>ได้คนละ ${each}`; return; }
    go.remove(); out.innerHTML = `แจกหมดแล้ว<br>${cfg.p} คน ได้คนละ <b>${each} ${cfg.unit}</b><br>เขียนว่า <b>${cfg.n} ÷ ${cfg.p} = ${each}</b>`; say(`${cfg.n} หารด้วย ${cfg.p} เท่ากับ ${each}`, true); teachDone(box); } }, `แจกคนละ 1 ${cfg.unit} (ครบ ${cfg.p} คน)`);
  draw(); out.innerHTML = `${cfg.what} ${cfg.n} ${cfg.unit} แบ่งให้ ${cfg.p} คน<br>แจกรอบละคนละ 1 ${cfg.unit}`;
  box.append(fig, go, out); return box;
}
/* counters: tap to circle groups of k */
function simDvCounters(n, k) {
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig', html: dvCtrHTML(n) }), out = fNote();
  dvCircle(fig.firstChild, k, (g, left) => { out.innerHTML = left ? `วงได้ ${g} กลุ่ม<br>เหลือ ${left} ตัว` : `วงครบแล้ว ได้ <b>${g} กลุ่ม</b><br><b>${n} ÷ ${k} = ${g}</b>`; if (!left) { say(`${n} หารด้วย ${k} เท่ากับ ${g}`, true); teachDone(box); } });
  out.innerHTML = `ตัวนับ ${n} ตัว<br>แตะเพื่อวงกลุ่มละ ${k} ตัว`; box.append(fig, out); return box;
}
/* fact family from one array */
function simDvFam(r, c) {
  const p = r * c, box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set();
  const show = (k, hl) => { fig.innerHTML = mtArraySVG(r, c, hl); seen.add(k); out.innerHTML = { m: `${r} แถว แถวละ ${c}<br><b>${r} × ${c} = ${p}</b>`, a: `${p} จุด แบ่งเป็น ${r} แถว<br>ได้แถวละ ${c}<br><b>${p} ÷ ${r} = ${c}</b>`, b: `${p} จุด แบ่งแถวละ ${c}<br>ได้ ${r} แถว<br><b>${p} ÷ ${c} = ${r}</b>` }[k]; if (seen.size >= 3) teachDone(box); };
  const b = (t, k, hl) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); sfx.pop(seen.size + 2); show(k, hl); } }, t);
  fig.innerHTML = mtArraySVG(r, c); out.innerHTML = 'กดดูทีละประโยค';
  box.append(fig, h('div', { class: 'rowstack' }, b(`${r} × ${c}`, 'm', { run: true }), b(`${p} ÷ ${r}`, 'a', { run: true }), b(`${p} ÷ ${c}`, 'b', { col: '#FFD45C' })), out); return box;
}
/* exact or remainder: change the number of things, k per group */
function simDvRem(k = 4, e = 'cookie') {
  let n = 12; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), kinds = new Set();
  const draw = () => { const q = Math.floor(n / k), r = n % k; fig.innerHTML = dvLeft(n, k, e, { box: 'bag', size: 14 }); kinds.add(r ? 1 : 0);
    out.innerHTML = r ? `${n} ÷ ${k} ได้ ${q} เศษ ${r}<br>มีของเหลือ → <b>หารไม่ลงตัว</b>` : `${n} ÷ ${k} = ${q}<br>ไม่มีเหลือ → <b>หารลงตัว</b>`; if (kinds.size >= 2) teachDone(box); };
  const b = (t, d) => h('button', { class: 'btn sm ia', onclick: e2 => { e2.stopPropagation(); const v = n + d; if (v < k || v > 30) { sfx.no(); return; } n = v; sfx.tap(); draw(); } }, t);
  draw(); box.append(h('div', { class: 'cap' }, `ใส่ถุง ถุงละ ${k}`), fig, h('div', { class: 'rowstack' }, b('− 1', -1), b('+ 1', 1)), out); return box;
}
/* number sense: keep the divisor (or the dividend) and watch the quotient */
function simDvSense(mode) {
  let a = mode === 'top' ? 24 : 24, d = mode === 'top' ? 4 : 2; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set();
  const draw = () => { const q = a / d; fig.innerHTML = mtGroupsSVG(d, q, 'strawberry', { box: 'plate', size: q > 8 ? 11 : 14 }); seen.add(a + ':' + d);
    out.innerHTML = `<b>${a} ÷ ${d} = ${q}</b><br>` + (mode === 'top' ? 'ตัวหารเท่าเดิม · ตัวตั้งมากขึ้น ผลหารก็มากขึ้น' : 'ตัวตั้งเท่าเดิม · ตัวหารมากขึ้น ผลหารกลับน้อยลง'); if (seen.size >= 3) teachDone(box); };
  const opts = mode === 'top' ? [8, 12, 16, 20, 24, 28] : [2, 3, 4, 6, 8];
  const row = h('div', { class: 'rowstack ia' }, ...opts.map(v => h('button', { class: 'btn sm', onclick: e => { e.stopPropagation(); if (mode === 'top') a = v; else d = v; sfx.tap(); draw(); } }, mode === 'top' ? `${v} ÷ ${d}` : `${a} ÷ ${v}`)));
  draw(); box.append(h('div', { class: 'cap' }, mode === 'top' ? 'แบ่งให้ 4 คนเท่าเดิม เปลี่ยนจำนวนสตรอว์เบอร์รี' : 'สตรอว์เบอร์รี 24 ผลเท่าเดิม เปลี่ยนจำนวนคน'), row, fig, out); return box;
}

/* ---------- question types ---------- */
const dvOpts = (n, d) => [`${fmt(n)} ÷ ${d}`, `${fmt(n)} × ${d}`, `${fmt(n)} − ${d}`];
Object.assign(Q, {
  /* picture → sentence → answer · mode 'group' (กลุ่มละ d ได้กี่กลุ่ม) | 'share' (แบ่ง d คน ได้คนละเท่าไร) */
  dvPic({ n, d, e, what, box, unit, mode }) { const q = n / d, text = mode === 'share' ? `${what} ${n} ${unit} แบ่งใส่ ${d} ${box} ${box}ละเท่า ๆ กัน ได้${box}ละกี่${unit}` : `${what} ${n} ${unit} แบ่งใส่${box} ${box}ละ ${d} ${unit} แบ่งได้กี่${box}`;
    const fig = mode === 'share' ? mtGroupsSVG(d, q, e, { box: 'bag', size: q > 6 ? 12 : 15 }) : mtGroupsSVG(q, d, e, { box: 'bag', size: d > 6 ? 12 : 15 });
    return { prompt: text, say: text, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'p4-fig', html: fig }),
      mtTwoStep(ctx, dvOpts(n, d), `${fmt(n)} ÷ ${d}`, 'แบ่งเท่า ๆ กัน → หาร', () => h('div', { class: 'rowstack' }, answerBox(ctx, String(q), { hint: mode === 'share' ? `แจกคนละ 1 ไปเรื่อย ๆ หรือคิด ${d} × อะไร = ${n}` : `นับว่ามีกี่${box} หรือคิด อะไร × ${d} = ${n}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, mode === 'share' ? unit : box))))); } };
  },
  /* counters: tap to circle groups, then answer */
  dvCtr({ n, d }) { const q = `${n} ÷ ${d} = ?`;
    return { prompt: q + ' <small>(แตะตัวนับเพื่อวงกลุ่มละ ' + d + ')</small>', say: `${n} หารด้วย ${d} เท่ากับเท่าไร`, mount(bd, ctx) { const f = h('div', { class: 'p4-fig', html: dvCtrHTML(n) }); dvCircle(f.firstChild, d);
      bd.append(h('div', { class: 't6-q p4-q p2q' }, f, answerBox(ctx, String(n / d), { hint: `วงกลุ่มละ ${d} แล้วนับจำนวนกลุ่ม` }))); } };
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
          bl.onclick = e => { e.stopPropagation(); if (v === q2) { if (first) mtHit(d, q2, true); bl.classList.add('pop'); sfx.pop(r + 2); r++; setTimeout(round, 380); }
            else { if (first) { first = false; mtHit(d, q2, false); } bl.classList.remove('bad'); void bl.offsetWidth; bl.classList.add('bad'); sfx.no(); ctx.say(`ยังไม่ใช่ — ${d} × อะไร = ${n}`); } }; sky.append(bl); }); };
      bd.append(h('div', { class: 'colstack' }, dots, head, sky)); round(); } };
  },
  /* quotient and remainder */
  dvRem({ n, d, e }) { const q = Math.floor(n / d), r = n % d;
    return { prompt: `${n} ÷ ${d} ได้เท่าไร เศษเท่าไร`, say: `${n} หารด้วย ${d} ได้เท่าไร เศษเท่าไร`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'colstack' }, h('div', { class: 'fbig p4big', html: `${n} <span class="fop">÷</span> ${d}` }), n <= 40 ? h('div', { class: 'p4-fig', html: dvLeft(n, d, e || 'cookie', { box: 'bag', size: 12 }) }) : null),
        duoInput(ctx, [q, r], ['', 'เศษ'], { pre: 'ได้', hint: `${d} × ${q} = ${d * q} ใกล้ ${n} ที่สุดแต่ไม่เกิน → เหลือ ${n} − ${d * q}` }))); } };
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
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'fbig p4big mt-big', html: `${L === '□' ? '<span class="fsign">□</span>' : L} <span class="fop">÷</span> ${R === '□' ? '<span class="fsign">□</span>' : R} <span class="fop">=</span> ${c}` }), answerBox(ctx, String(x), { hint }))); } };
  },
  /* story: ① choose the sentence ② answer (with remainder when rem) */
  dvStory({ text, n, d, unit, unit2, fig }) { const q = Math.floor(n / d), r = n % d;
    return { prompt: 'อ่านโจทย์ เลือกประโยคสัญลักษณ์ แล้วหาคำตอบ', say: text, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text }), fig ? h('div', { html: fig }) : null),
        mtTwoStep(ctx, dvOpts(n, d), `${fmt(n)} ÷ ${d}`, 'แบ่งเท่า ๆ กัน → หาร', () => r ? duoInput(ctx, [q, r], [unit, `เหลือ (${unit2 || unit})`], { pre: 'ได้', hint: `${d} × ${q} = ${d * q} → เหลือ ${n - d * q}` })
          : h('div', { class: 'rowstack' }, answerBox(ctx, String(q), { hint: `${d} × อะไร = ${n}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit))))); } };
  }
});
const dvFacts = (tables, k) => mtFacts(tables, k).map(([a, b]) => [a * b, a]).filter(([n, d]) => d > 0);
const dvExactQ = items => Q.ixGroup({ q: 'แตะการ์ด แล้วแตะกล่องที่ใช่', bins: ['หารลงตัว', 'หารไม่ลงตัว'], items: items.map(([n, d]) => ({ label: `${n} ÷ ${d}`, bin: n % d ? 1 : 0, why: n % d ? `${n} ÷ ${d} มีเศษ ${n % d}` : `${d} × ${n / d} = ${n} พอดี` })) });

/* ---------- data: practice ---------- */
const DVW_GRP = [[35, 5, 'tomato', 'มะเขือเทศ', 'ถุง', 'ลูก'], [18, 3, 'chompoo', 'ชมพู่', 'จาน', 'ลูก'], [12, 3, 'sunflower', 'ดอกทานตะวัน', 'ตะกร้า', 'ดอก'], [10, 2, 'donut', 'โดนัท', 'กล่อง', 'ชิ้น'],
  [15, 3, 'cake', 'เค้ก', 'กล่อง', 'ชิ้น'], [20, 4, 'pineapple', 'สับปะรด', 'กล่อง', 'ผล'], [20, 5, 'orange', 'ส้ม', 'กล่อง', 'ผล'], [12, 4, 'cupcake', 'คัพเค้ก', 'จาน', 'ชิ้น'], [24, 6, 'fish', 'ปลา', 'ถุง', 'ตัว'], [32, 8, 'shrimp', 'กุ้ง', 'ถุง', 'ตัว']]; // 1 + PPT 6.1
const DVW_SHR = [[12, 2, 'mango', 'มะม่วง', 'กล่อง', 'ผล'], [12, 4, 'watermelon', 'แตงโม', 'กล่อง', 'ผล'], [16, 4, 'mangosteen', 'มังคุด', 'จาน', 'ผล'], [8, 4, 'fish', 'ปลา', 'ถุง', 'ตัว'],
  [15, 3, 'corn', 'ข้าวโพด', 'กล่อง', 'ฝัก'], [9, 3, 'durian', 'ทุเรียน', 'กล่อง', 'ผล'], [20, 4, 'cake', 'เค้ก', 'จาน', 'ชิ้น'], [24, 4, 'crab', 'ปู', 'ถุง', 'ตัว']]; // PPT 6.2
const DVW_CTR = [[10, 2], [16, 4], [24, 6], [22, 2], [27, 3], [45, 5], [42, 6], [24, 2], [32, 4], [36, 4], [60, 10], [77, 7], [80, 8], [14, 7], [100, 10]]; // PPT 6.3
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
  { text: 'แม่มีขนมเค้ก 18 ชิ้น จัดใส่กล่อง กล่องละ 6 ชิ้น จัดได้กี่กล่อง', n: 18, d: 6, unit: 'กล่อง', fig: () => mtGroupsSVG(3, 6, 'cake', { box: 'bag', size: 13 }) },
  { text: 'พ่อมีลูกบอล 12 ลูก แบ่งให้ลูก 3 คนเท่า ๆ กัน ลูกจะได้คนละกี่ลูก', n: 12, d: 3, unit: 'ลูก', fig: () => dvPile(12, 'ball', 22, 6) }]; // 15–18 + PPT 6.10
const DVW_ST2 = [{ text: 'ยายมีเงิน 60 บาท แบ่งให้หลาน 11 คน คนละเท่า ๆ กัน หลานได้คนละกี่บาท และยายเหลือเงินกี่บาท', n: 60, d: 11, unit: 'บาท' },
  { text: 'สวนของลุงมีมะพร้าว 154 ลูก แบ่งให้เพื่อนบ้าน 10 บ้าน บ้านละเท่า ๆ กัน ได้บ้านละกี่ลูก และเหลือมะพร้าวกี่ลูก', n: 154, d: 10, unit: 'ลูก' },
  { text: 'เมย์จัดดอกทานตะวัน 61 ดอก ใส่แจกันใบละ 5 ดอก จัดได้กี่แจกัน และเหลือดอกทานตะวันกี่ดอก', n: 61, d: 5, unit: 'แจกัน', unit2: 'ดอก' },
  { text: 'แม่ค้ามีน้ำเปล่า 38 แพ็ก บริจาคให้โรงเรียนละ 6 แพ็ก บริจาคได้กี่โรงเรียน และเหลือน้ำเปล่ากี่แพ็ก', n: 38, d: 6, unit: 'โรงเรียน', unit2: 'แพ็ก' },
  { text: 'ป้ามีมังคุด 136 กิโลกรัม ใส่เข่ง เข่งละ 12 กิโลกรัม ได้กี่เข่ง และเหลือมังคุดกี่กิโลกรัม', n: 136, d: 12, unit: 'เข่ง', unit2: 'กิโลกรัม' },
  { text: 'มีคุกกี้ 13 ชิ้น แบ่งให้น้อง 3 คน คนละเท่า ๆ กัน น้องได้คนละกี่ชิ้น และเหลือกี่ชิ้น', n: 13, d: 3, unit: 'ชิ้น', fig: () => dvLeft(13, 4, 'cookie', { size: 12 }) },
  { text: 'สมชายเลี้ยงปลา 56 ตัว แบ่งใส่ตู้ปลา ตู้ละ 10 ตัว ได้กี่ตู้ และเหลือปลากี่ตัว', n: 56, d: 10, unit: 'ตู้', unit2: 'ตัว' },
  { text: 'ฝ้ายมีดอกกุหลาบ 35 ดอก มัดเป็นช่อ ช่อละ 6 ดอก ได้กี่ช่อ และเหลือดอกกุหลาบกี่ดอก', n: 35, d: 6, unit: 'ช่อ', unit2: 'ดอก' }]; // 15–18 + PPT 6.11
DVW_ST2[5].fig = () => dvLeft(13, 3, 'cookie', { size: 12 });

/* ---------- lessons (① รู้จัก → ② ตัวอย่างมีรูป → ③ ลองทำ → เกม) ---------- */
const L2D = (no, place, title, short, goal, teach, game) => ({ id: 940 + no, no, place, title, short, tone: TONES5[no % 6], goal, teach, game, learned: true });
const dvPicQ = (x, mode) => Q.dvPic({ n: x[0], d: x[1], e: x[2], what: x[3], box: x[4], unit: x[5], mode });
const LESSONS_P2C6 = [
  L2D(1, 'หาดแบ่งกลุ่ม', 'ความหมายของการหาร (1)', 'ความหมายการหาร (1)', 'บอกความหมายของการหารเป็นการแบ่งออกเป็นกลุ่ม กลุ่มละเท่า ๆ กัน และเขียนประโยคสัญลักษณ์การหาร',
    [...learnStep('ยินดีต้อนรับสู่ <b>ชายหาดแบ่งเท่ากัน</b>! รู้จัก<b>การหาร</b>', 'ยินดีต้อนรับสู่ชายหาดแบ่งเท่ากัน รู้จักการหาร', [
      { fig: dvPile(12, 'orange', 22, 6), name: 'มีส้ม 12 ผล', text: 'อยากใส่ถุง ถุงละ 3 ผล' },
      { fig: mtGroupsSVG(4, 3, 'orange', { box: 'bag' }), name: 'แบ่งเป็นกลุ่ม กลุ่มละเท่า ๆ กัน', text: 'ใส่ถุงละ 3 ผล ได้ <b>4 ถุง</b>' },
      { fig: lbig('12 ÷ 3 = 4'), name: 'เขียนเป็นการหาร', text: 'อ่านว่า “สิบสองหารด้วยสาม เท่ากับสี่”<br>เครื่องหมาย ÷ อ่านว่า “หาร”' },
      { fig: lrow(lcap(lbig('12', 'sm'), 'ตัวตั้ง'), lcap(lbig('÷ 3', 'sm'), 'ตัวหาร'), lcap(lbig('= 4', 'sm'), 'ผลหาร')), name: 'ชื่อของแต่ละส่วน', text: 'ตัวตั้ง ÷ ตัวหาร = ผลหาร' }], 'การหาร = แบ่งเป็นกลุ่ม กลุ่มละเท่า ๆ กัน แล้วดูว่าได้กี่กลุ่ม'),
     pexStep('ตัวอย่างทีละขั้น: โดนัท 10 ชิ้น ใส่กล่องละ 2', 'ตัวอย่างทีละขั้น', [['① ดูภาพ', 'โดนัท 10 ชิ้น', dvPile(10, 'donut', 24, 5)], ['② จัดใส่กล่อง', 'กล่องละ 2 ชิ้น', mtGroupsSVG(5, 2, 'donut', { box: 'bag' })], ['③ นับกล่อง', 'ได้ 5 กล่อง', mtGroupsSVG(5, 2, 'donut', { box: 'bag', run: true })], ['④ ประโยคการหาร', '<b>10 ÷ 2 = 5</b>', null]], 'จัดได้ <b>5 กล่อง</b>'),
     T('ลองจัดเอง: เลือกจำนวนต่อถุง แล้วกดจัดใส่ถุง', 'ลองจัดเอง เลือกจำนวนต่อถุง แล้วกดจัดใส่ถุง', el => el.append(simDvGroup({ n: 12, ks: [3, 4, 6], e: 'strawberry', what: 'สตรอว์เบอร์รี', unit: 'ผล', box: 'ถุง' })))],
    () => pkF(DVW_GRP, 5).map(x => dvPicQ(x, 'group'))),
  L2D(2, 'หาดแบ่งให้เพื่อน', 'ความหมายของการหาร (2)', 'ความหมายการหาร (2)', 'บอกความหมายของการหารเป็นการแบ่งให้เท่า ๆ กัน และเขียนประโยคสัญลักษณ์การหาร',
    [...learnStep('การหารแบบ<b>แบ่งให้เท่า ๆ กัน</b>', 'การหารแบบแบ่งให้เท่า ๆ กัน', [
      { fig: dvPile(12, 'cookie', 22, 6), name: 'คุกกี้ 12 ชิ้น แบ่งให้ 3 คน', text: 'ทุกคนต้องได้เท่ากัน' },
      { fig: mtGroupsSVG(3, 1, 'cookie', { box: 'plate' }), name: 'แจกคนละ 1 ชิ้น ทีละรอบ', text: 'รอบแรก ทุกคนได้ 1 ชิ้น' },
      { fig: mtGroupsSVG(3, 4, 'cookie', { box: 'plate' }), name: 'แจกจนหมด', text: 'ทุกคนได้คนละ <b>4 ชิ้น</b>' },
      { fig: lbig('12 ÷ 3 = 4'), name: 'เขียนเป็นการหาร', text: '12 ชิ้น แบ่ง 3 คน ได้คนละ 4' }], 'แบ่งให้ … คน เท่า ๆ กัน → หาร ได้คนละเท่าไร'),
     pexStep('ตัวอย่างทีละขั้น: มังคุด 16 ผล ใส่ 4 จาน', 'ตัวอย่างทีละขั้น', [['① ดูภาพ', 'มังคุด 16 ผล มี 4 จาน', dvPile(16, 'mangosteen', 22, 8)], ['② แจกรอบที่ 1', 'จานละ 1 ผล (ใช้ไป 4)', mtGroupsSVG(4, 1, 'mangosteen', { box: 'plate' })], ['③ แจกจนหมด', 'แจก 4 รอบ ได้จานละ 4', mtGroupsSVG(4, 4, 'mangosteen', { box: 'plate' })], ['④ ประโยคการหาร', '<b>16 ÷ 4 = 4</b>', null]], 'ได้จานละ <b>4 ผล</b>'),
     T('ลองแจกเอง: กดแจกคนละ 1 จนหมด', 'ลองแจกเอง กดแจกคนละ 1 จนหมด', el => el.append(simDvShare({ n: 15, p: 3, e: 'apple', what: 'แอปเปิล', unit: 'ผล' })))],
    () => [...pkF(DVW_SHR, 4).map(x => dvPicQ(x, 'share')), Q.ixGroup({ q: 'การหารนี้ถามอะไร แตะการ์ดแล้วแตะกล่อง', bins: ['ถามว่าได้กี่กลุ่ม', 'ถามว่าได้กลุ่มละเท่าไร'], items: [
      { label: 'ส้ม 20 ผล ใส่ถุงละ 5 ได้กี่ถุง', bin: 0 }, { label: 'ส้ม 20 ผล แบ่ง 4 คน ได้คนละกี่ผล', bin: 1 }, { label: 'ไข่ 18 ฟอง ใส่แผงละ 6 ได้กี่แผง', bin: 0 }, { label: 'ไข่ 18 ฟอง แบ่ง 3 แผงเท่ากัน ได้แผงละกี่ฟอง', bin: 1 }].map(x => ({ ...x, why: x.bin ? 'รู้จำนวนคน/กลุ่มแล้ว ถามว่าได้เท่าไร' : 'รู้ว่ากลุ่มละเท่าไร ถามว่าได้กี่กลุ่ม' })) })]),
  L2D(3, 'หาดตัวนับ', 'การหาผลหารโดยใช้ตัวนับ', 'ใช้ตัวนับ', 'หาผลหารโดยใช้ตัวนับจัดเป็นกลุ่ม กลุ่มละเท่า ๆ กัน',
    [...learnStep('ใช้<b>ตัวนับ</b>หาผลหาร', 'ใช้ตัวนับหาผลหาร', [
      { fig: dvCtrHTML(16), name: 'วางตัวนับเท่ากับตัวตั้ง', text: '16 ÷ 4 → วางตัวนับ 16 ตัว' },
      { fig: () => { const d = h('div', { html: dvCtrHTML(16) }); [...d.querySelectorAll('.ct')].forEach((c, i) => { c.classList.add('g' + Math.floor(i / 4) % 4); if (i % 4 === 0) c.classList.add('gs'); if (i % 4 === 3) c.classList.add('ge'); }); return d; }, name: 'วงทีละ 4 ตัว (ตัวหาร)', text: 'วงได้ <b>4 กลุ่ม</b>' },
      { fig: lbig('16 ÷ 4 = 4'), name: 'จำนวนกลุ่ม คือ ผลหาร', text: '' }], 'วางตัวนับ → วงกลุ่มละเท่ากับตัวหาร → นับกลุ่ม'),
     pexStep('ตัวอย่างทีละขั้น: 24 ÷ 6', 'ตัวอย่างทีละขั้น', [['① วางตัวนับ', '24 ตัว', dvPile(24, 'coin', 20, 8)], ['② วงกลุ่มละ 6', 'กลุ่มแรก 6 ตัว', mtGroupsSVG(1, 6, 'coin', { size: 16 })], ['③ วงต่อจนหมด', 'ได้ 4 กลุ่ม', mtGroupsSVG(4, 6, 'coin', { run: true, size: 14 })], ['④ ตอบ', '<b>24 ÷ 6 = 4</b>', null]], '24 ÷ 6 = <b>4</b>'),
     T('ลองเอง: แตะตัวนับเพื่อวงกลุ่มละ 3', 'ลองเอง แตะตัวนับเพื่อวงกลุ่มละสาม', el => el.append(simDvCounters(18, 3)))],
    () => pkF(DVW_CTR.filter(([n]) => n <= 45), 5).map(([n, d]) => Q.dvCtr({ n, d }))),
  L2D(4, 'หาดคูณหาร', 'ความสัมพันธ์ของการคูณและการหาร', 'คูณ ↔ หาร', 'เขียนประโยคการหารจากประโยคการคูณ และบอกความสัมพันธ์ของการคูณและการหาร',
    [...learnStep('<b>การคูณ</b>กับ<b>การหาร</b>เป็นคู่กัน', 'การคูณกับการหารเป็นคู่กัน', [
      { fig: mtArraySVG(3, 4, { run: true }), name: '3 แถว แถวละ 4', text: '<b>3 × 4 = 12</b>' },
      { fig: mtArraySVG(3, 4, { run: true }), name: '12 แบ่งเป็น 3 แถว', text: 'ได้แถวละ 4 → <b>12 ÷ 3 = 4</b>' },
      { fig: mtArraySVG(3, 4, { col: '#FFD45C' }), name: '12 แบ่งแถวละ 4', text: 'ได้ 3 แถว → <b>12 ÷ 4 = 3</b>' },
      { fig: lbig('3 × 4 = 12<br>12 ÷ 3 = 4 · 12 ÷ 4 = 3'), name: 'ครอบครัวเดียวกัน', text: 'รู้การคูณ 1 ประโยค ได้การหาร 2 ประโยค' }], 'จากการคูณ 1 ประโยค เขียนการหารได้ 2 ประโยค'),
     pexStep('ตัวอย่างทีละขั้น: จาก 5 × 6 = 30', 'ตัวอย่างทีละขั้น', [['① การคูณ', '5 แถว แถวละ 6 → 5 × 6 = 30', mtArraySVG(5, 6, { run: true })], ['② หาร 5', '30 แบ่ง 5 แถว ได้แถวละ 6 → 30 ÷ 5 = 6', null], ['③ หาร 6', '30 แบ่งแถวละ 6 ได้ 5 แถว → 30 ÷ 6 = 5', mtArraySVG(5, 6, { col: '#FFD45C' })]], '5 × 6 = 30 · 30 ÷ 5 = 6 · 30 ÷ 6 = 5'),
     T('ลองกดดูทั้งสามประโยค', 'ลองกดดูทั้งสามประโยค', el => el.append(simDvFam(4, 6)))],
    () => pkF(DVW_FAM, 4).map(([a, b]) => Q.dvFam({ a, b })).concat([Q.ixMatch({ q: 'จับคู่การหารกับการคูณที่ช่วยคิด', pairs: pkF([[24, 6], [35, 5], [36, 9], [42, 7]], 3).map(([n, d]) => [`${n} ÷ ${d}`, `${d} × ${n / d} = ${n}`]) })])),
  L2D(5, 'หาดท่องหาร', 'การหาผลหารโดยใช้ความสัมพันธ์ของการคูณและการหาร', 'หารด้วยสูตรคูณ', 'หาผลหารโดยใช้ความสัมพันธ์ของการคูณและการหาร (ท่องสูตรคูณ)',
    [...learnStep('หาผลหารด้วย<b>สูตรคูณ</b>', 'หาผลหารด้วยสูตรคูณ', [
      { fig: lbig('35 ÷ 5 = ?'), name: 'คิดกลับเป็นการคูณ', text: '5 × อะไร = 35' },
      { fig: mtHopSVG(5, 7), name: 'ท่องแม่ 5 จนถึง 35', text: '5, 10, 15, 20, 25, 30, 35 → 7 ครั้ง' },
      { fig: lbig('5 × 7 = 35 → 35 ÷ 5 = 7'), name: 'ได้ผลหาร', text: 'ยิ่งท่องสูตรคูณคล่อง ยิ่งหารได้เร็ว' }], 'ตัวหาร × อะไร = ตัวตั้ง'),
     pexStep('ตัวอย่างทีละขั้น: 56 ÷ 8', 'ตัวอย่างทีละขั้น', [['① ถามตัวเอง', '8 × อะไร = 56', lbig('8 × ? = 56')], ['② ท่องแม่ 8', '8, 16, 24, 32, 40, 48, 56', mtHopSVG(8, 7)], ['③ นับ', 'ครั้งที่ 7 ได้ 56', null], ['④ ตอบ', '<b>56 ÷ 8 = 7</b>', mtGroupsSVG(7, 8, 'strawberry', { size: 10 })]], '56 ÷ 8 = <b>7</b>'),
     T('ลองเอง', 'ลองเอง', el => el.append(qSim(Q.dvFact({ n: 42, d: 6 }), 'ถูกต้อง!')))],
    () => [...pkF(DVW_FACT, 3).map(([n, d]) => Q.dvFact({ n, d })), Q.dvPop({ facts: dvFacts(range(2, 9), 5) }), Q.dvPop({ facts: pkF(DVW_FACT.filter(([n, d]) => n / d <= 12), 5) })]),
  L2D(6, 'หาดลงตัว', 'การหารลงตัวและการหารไม่ลงตัว', 'ลงตัว · ไม่ลงตัว', 'บอกได้ว่าการหารใดหารลงตัว และการหารใดหารไม่ลงตัว',
    [...learnStep('หาร<b>ลงตัว</b> กับ <b>ไม่ลงตัว</b>', 'หารลงตัว กับ ไม่ลงตัว', [
      { fig: dvLeft(12, 4, 'cookie', { box: 'bag' }), name: 'หารลงตัว', text: '12 ÷ 4 แบ่งได้ 3 ถุงพอดี<br><b>ไม่มีเหลือ</b>' },
      { fig: dvLeft(14, 4, 'cookie', { box: 'bag' }), name: 'หารไม่ลงตัว', text: '14 ÷ 4 ได้ 3 ถุง<br><b>เหลือ 2</b> ใส่ถุงไม่ครบ' },
      { fig: lbig('เหลือน้อยกว่าตัวหารเสมอ'), name: 'ของที่เหลือเรียกว่า “เศษ”', text: 'ถ้าเหลือเท่ากับตัวหาร ต้องจัดได้อีก 1 กลุ่ม' }], 'ไม่มีเหลือ = ลงตัว · มีเหลือ = ไม่ลงตัว'),
     pexStep('ตัวอย่างทีละขั้น: 21 ÷ 4', 'ตัวอย่างทีละขั้น', [['① จัดถุงละ 4', '4, 8, 12, 16, 20', mtGroupsSVG(5, 4, 'cookie', { box: 'bag', size: 12, run: true })], ['② ดูที่เหลือ', 'เหลือ 1 ใส่ถุงไม่ได้', dvLeft(21, 4, 'cookie', { box: 'bag', size: 12 })], ['③ สรุป', '21 ÷ 4 <b>หารไม่ลงตัว</b>', null]], '21 ÷ 4 หารไม่ลงตัว (เศษ 1)'),
     T('ลองเปลี่ยนจำนวนคุกกี้ ดูว่าลงตัวไหม', 'ลองเปลี่ยนจำนวนคุกกี้ ดูว่าลงตัวไหม', el => el.append(simDvRem(4)))],
    () => [dvExactQ(pkF(DVW_EX, 6)), dvExactQ(pkF(DVW_EX, 6)), ...pkF(DVW_EX.filter(([n, d]) => n % d === 0), 3).map(([n, d]) => Q.dvFact({ n, d }))]),
  L2D(7, 'หาดเศษ', 'การหาผลหารและเศษ', 'ผลหารและเศษ', 'หาผลหารและเศษของการหารที่หารไม่ลงตัว',
    [...learnStep('หา<b>ผลหารและเศษ</b>', 'หาผลหารและเศษ', [
      { fig: dvLeft(17, 5, 'apple', { box: 'bag' }), name: '17 ÷ 5', text: 'จัดถุงละ 5 ได้ 3 ถุง เหลือ 2' },
      { fig: lbig('17 ÷ 5 ได้ 3 เศษ 2'), name: 'เขียนผลหารและเศษ', text: 'ผลหาร = 3 · เศษ = 2' },
      { fig: lbig('5 × 3 = 15 → 17 − 15 = 2'), name: 'คิดด้วยสูตรคูณ', text: 'หาผลคูณที่ใกล้ตัวตั้งที่สุดแต่ไม่เกิน<br>แล้วลบหาเศษ' }], 'ผลหาร = จำนวนกลุ่มเต็ม · เศษ = ที่เหลือ (น้อยกว่าตัวหาร)'),
     pexStep('ตัวอย่างทีละขั้น: 47 ÷ 8', 'ตัวอย่างทีละขั้น', [['① ท่องแม่ 8', '8, 16, 24, 32, 40, 48', mtHopSVG(8, 6)], ['② เลือก', '48 เกิน 47 → ใช้ 8 × 5 = 40', lbig('8 × 5 = 40')], ['③ หาเศษ', '47 − 40 = 7 (น้อยกว่า 8 ✓)', dvLeft(47, 8, 'strawberry', { size: 10 })]], '47 ÷ 8 ได้ <b>5 เศษ 7</b>'),
     T('ลองเอง', 'ลองเอง', el => el.append(qSim(Q.dvRem({ n: 23, d: 4 }), 'ถูกต้อง!')))],
    () => [...pkF(DVW_REM, 4).map(([n, d]) => Q.dvRem({ n, d })), Q.ixMatch({ q: 'จับคู่การหารกับคำตอบ', pairs: pkF(DVW_LET, 4).map(([n, d]) => [`${n} ÷ ${d}`, n % d ? `${Math.floor(n / d)} เศษ ${n % d}` : String(n / d)]) })]),
  L2D(8, 'หาดเทียบหาร', 'การพัฒนาความรู้สึกเชิงจำนวนเกี่ยวกับการหาร (1)', 'เทียบผลหาร (1)', 'เปรียบเทียบผลหารเมื่อตัวหารเท่ากัน โดยไม่ต้องคำนวณทุกตัว',
    [...learnStep('ตัวหาร<b>เท่ากัน</b>', 'ตัวหารเท่ากัน', [
      { fig: lpair(mtGroupsSVG(4, 2, 'strawberry', { box: 'plate', size: 13 }), mtGroupsSVG(4, 5, 'strawberry', { box: 'plate', size: 13 }), 'vs'), name: '8 ÷ 4 กับ 20 ÷ 4', text: 'แบ่งให้ 4 คนเท่ากัน' },
      { fig: lbig('8 ÷ 4 = 2 · 20 ÷ 4 = 5'), name: 'ของมากกว่า ได้มากกว่า', text: '' },
      { fig: lbig('8 ÷ 4 &lt; 20 ÷ 4'), name: 'ตัวหารเท่ากัน → ดูตัวตั้ง', text: 'ตัวตั้งมากกว่า ผลหารมากกว่า' }], 'ตัวหารเท่ากัน · ตัวตั้งมาก ผลหารมาก'),
     pexStep('ตัวอย่างทีละขั้น: 56 ÷ 7 กับ 42 ÷ 7', 'ตัวอย่างทีละขั้น', [['① ดูตัวหาร', 'เท่ากัน คือ 7', lbig('56 ÷ 7 ? 42 ÷ 7')], ['② ดูตัวตั้ง', '56 มากกว่า 42', null], ['③ สรุป', '56 ÷ 7 <b>&gt;</b> 42 ÷ 7', lbig('8 &gt; 6')]], '56 ÷ 7 &gt; 42 ÷ 7'),
     T('ลองเปลี่ยนจำนวนสตรอว์เบอร์รี', 'ลองเปลี่ยนจำนวนสตรอว์เบอร์รี', el => el.append(simDvSense('top')))],
    () => pkF(DVW_CMP1, 5).map(([l, r]) => Q.dvCmp({ l, r }))),
  L2D(9, 'หาดเทียบตัวหาร', 'การพัฒนาความรู้สึกเชิงจำนวนเกี่ยวกับการหาร (2)', 'เทียบผลหาร (2)', 'เปรียบเทียบผลหารเมื่อตัวตั้งเท่ากัน แต่ตัวหารต่างกัน',
    [...learnStep('ตัวตั้ง<b>เท่ากัน</b> ตัวหารต่างกัน', 'ตัวตั้งเท่ากัน ตัวหารต่างกัน', [
      { fig: lpair(mtGroupsSVG(2, 6, 'cookie', { box: 'plate', size: 12 }), mtGroupsSVG(6, 2, 'cookie', { box: 'plate', size: 12 }), 'vs'), name: '12 ÷ 2 กับ 12 ÷ 6', text: 'คุกกี้ 12 ชิ้นเท่ากัน' },
      { fig: lbig('12 ÷ 2 = 6 · 12 ÷ 6 = 2'), name: 'แบ่งให้คนมาก ได้คนละน้อย', text: '' },
      { fig: lbig('12 ÷ 2 &gt; 12 ÷ 6'), name: 'ตัวตั้งเท่ากัน → ตัวหารมาก ผลหารน้อย', text: '' }], 'ตัวตั้งเท่ากัน · ตัวหารมาก ผลหารน้อย'),
     pexStep('ตัวอย่างทีละขั้น: 45 ÷ 5 กับ 45 ÷ 9', 'ตัวอย่างทีละขั้น', [['① ดูตัวตั้ง', 'เท่ากัน คือ 45', lbig('45 ÷ 5 ? 45 ÷ 9')], ['② ดูตัวหาร', '5 น้อยกว่า 9', null], ['③ สรุป', 'ตัวหารน้อย ผลหารมาก → 45 ÷ 5 <b>&gt;</b> 45 ÷ 9', lbig('9 &gt; 5')]], '45 ÷ 5 &gt; 45 ÷ 9'),
     T('ลองเปลี่ยนจำนวนคน', 'ลองเปลี่ยนจำนวนคน', el => el.append(simDvSense('bot')))],
    () => [...pkF(DVW_CMP2, 4).map(([l, r]) => Q.dvCmp({ l, r })), ...pkF(DVW_CMP1, 1).map(([l, r]) => Q.dvCmp({ l, r }))]),
  L2D(10, 'หาดตัวไม่ทราบค่า', 'การหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การหาร', 'ตัวไม่ทราบค่า', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การหาร',
    [...learnStep('หา<b>ตัวไม่ทราบค่า</b>ในการหาร', 'หาตัวไม่ทราบค่าในการหาร', [
      { fig: lbig('□ ÷ 4 = 3'), name: 'ไม่รู้ตัวตั้ง', text: 'ตัวตั้ง = ผลหาร × ตัวหาร → 3 × 4 = <b>12</b>' },
      { fig: mtGroupsSVG(3, 4, 'cookie', { box: 'bag', size: 14 }), name: '3 กลุ่ม กลุ่มละ 4', text: 'รวมเป็น 12 → 12 ÷ 4 = 3 ✓' },
      { fig: lbig('20 ÷ □ = 5'), name: 'ไม่รู้ตัวหาร', text: '5 × อะไร = 20 → □ = <b>4</b>' }], 'ใช้การคูณช่วยหาตัวที่หายไป'),
     pexStep('ตัวอย่างทีละขั้น: 60 ÷ □ = 6', 'ตัวอย่างทีละขั้น', [['① อ่าน', '60 แบ่งเท่า ๆ กัน ได้ 6 → แบ่งเป็นกี่กลุ่ม', lbig('60 ÷ □ = 6')], ['② ใช้การคูณ', '6 × อะไร = 60', mtHopSVG(6, 10)], ['③ ได้', '6 × 10 = 60 → □ = 10', null], ['④ ตรวจ', '60 ÷ 10 = 6 ✓', null]], '□ = <b>10</b>'),
     T('ลองเอง', 'ลองเอง', el => el.append(qSim(Q.dvUnk({ a: 28, b: 7, c: 4, pos: 0 }), 'ถูกต้อง!')))],
    () => pkF(DVW_UNK, 5).map(([a, b, c, pos]) => Q.dvUnk({ a, b, c, pos }))),
  L2D(11, 'หาดโจทย์หาร', 'โจทย์ปัญหาการหาร (1)', 'โจทย์ปัญหา (1)', 'วิเคราะห์โจทย์ปัญหาการหารที่หารลงตัว เขียนประโยคสัญลักษณ์ และหาคำตอบ',
    [...learnStep('ขั้นตอน<b>แก้โจทย์ปัญหาการหาร</b>', 'ขั้นตอนแก้โจทย์ปัญหาการหาร', [
      { fig: lbig('แบ่ง · …ละ · เท่า ๆ กัน'), name: '① หาคำที่บอกว่าแบ่ง', text: 'แบ่งใส่…ละ / แบ่งให้…คน เท่า ๆ กัน → หาร' },
      { fig: mtGroupsSVG(6, 9, 'pork', { box: 'bag', size: 10 }), name: '② วาดภาพ', text: 'ของทั้งหมดเท่าไร แบ่งอย่างไร' },
      { fig: lbig('54 ÷ 9 = 6 · ตอบ 6 วัน'), name: '③ เขียนประโยคการหาร แล้วตอบพร้อมหน่วย', text: '' }], 'มีของทั้งหมด แบ่งเท่า ๆ กัน → หาร'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'มีไข่ 24 ฟอง ใส่แผงละ 6 ฟอง ได้กี่แผง', dvPile(24, 'egg', 20, 8)], ['① ถามอะไร', 'จำนวนแผง', null], ['② ประโยคสัญลักษณ์', '24 ÷ 6 = □', mtGroupsSVG(4, 6, 'egg', { box: 'bag', size: 13 })], ['③ คิด', '6 × 4 = 24 → □ = 4', null]], 'ตอบ <b>4 แผง</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.dvStory({ text: 'มีลูกอม 30 เม็ด แบ่งให้เด็ก 5 คนเท่า ๆ กัน ได้คนละกี่เม็ด', n: 30, d: 5, unit: 'เม็ด', fig: dvPile(30, 'lollipop', 18, 10) }), 'ถูกต้อง!')))],
    () => pkF(DVW_ST1, 5).map(s => Q.dvStory({ ...s, fig: s.fig ? s.fig() : null }))),
  L2D(12, 'หาดโจทย์มีเศษ', 'โจทย์ปัญหาการหาร (2)', 'โจทย์ปัญหา (2)', 'แก้โจทย์ปัญหาการหารที่มีเศษ บอกทั้งผลหารและสิ่งที่เหลือ',
    [...learnStep('โจทย์การหารที่<b>มีเศษ</b>', 'โจทย์การหารที่มีเศษ', [
      { fig: dvLeft(26, 4, 'apple', { box: 'bag', size: 12 }), name: 'แบ่งแล้วมีเหลือ', text: 'แอปเปิล 26 ผล ใส่ถุงละ 4<br>ได้ 6 ถุง เหลือ 2 ผล' },
      { fig: lbig('26 ÷ 4 ได้ 6 เศษ 2'), name: 'ตอบให้ครบทั้งสองอย่าง', text: 'ได้กี่ถุง <b>และ</b> เหลือกี่ผล' },
      { fig: lbig('ตอบ 6 ถุง เหลือ 2 ผล'), name: 'ใส่หน่วยให้ถูก', text: 'ผลหารเป็นหน่วยของกลุ่ม · เศษเป็นหน่วยของสิ่งของ' }], 'มีเศษ → ตอบทั้งผลหารและเศษ พร้อมหน่วย'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'มีดินสอ 38 แท่ง แบ่งให้เพื่อน 5 คนเท่า ๆ กัน ได้คนละกี่แท่ง เหลือกี่แท่ง', dvPile(38, 'pencil', 16, 10)], ['① ประโยคสัญลักษณ์', '38 ÷ 5 = □', null], ['② สูตรคูณ', '5 × 7 = 35 (5 × 8 = 40 เกิน)', mtGroupsSVG(5, 7, 'pencil', { box: 'plate', size: 10 })], ['③ เศษ', '38 − 35 = 3', dvLeft(38, 7, 'pencil', { size: 9 })]], 'ตอบ ได้คนละ <b>7 แท่ง</b> เหลือ <b>3 แท่ง</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.dvStory({ text: 'มีส้ม 22 ผล ใส่ถุงละ 5 ผล ได้กี่ถุง และเหลือส้มกี่ผล', n: 22, d: 5, unit: 'ถุง', unit2: 'ผล', fig: dvLeft(22, 5, 'orange', { box: 'bag', size: 12 }) }), 'ถูกต้อง!')))],
    () => pkF(DVW_ST2, 5).map(s => Q.dvStory({ ...s, fig: s.fig ? s.fig() : null })))
];
/* pictures for the worked example in 941 used dvPile with 'coin'; ensure the art exists */
if (!ART.coin) ART.coin = `<circle cx="32" cy="32" r="22" fill="#FFD45C" stroke="#B7791F" stroke-width="3"/><circle cx="32" cy="32" r="14" fill="none" stroke="#E3A21C" stroke-width="2"/>`;

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
