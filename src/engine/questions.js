/* v167 — กระดานกระโดดบนเส้นจำนวน: เริ่มที่ a แล้วแตะทีละช่อง (บวก → ขวา · ลบ → ซ้าย) ครบ b ครั้งจึงได้คำตอบ */
function hopLine(ctx, a, b, op, lo, hi) { const nl = numberLine(lo, hi, { hi: [a] }), e = eqRow([a, op, b, '=', '?'], { sm: true }), d = op === '+' ? 1 : -1, ans = a + d * b; nl.classList.add('ia', 'tapline', 'hopline'); let cur = a, k = 0;
  const T = [...nl.querySelectorAll('.tick')], tk = n => T[n - lo], dir = op === '+' ? 'ขวา' : 'ซ้าย';
  T.forEach((t, i) => { const n = i + lo; t.onclick = ev => { ev.stopPropagation(); if (nl.dataset.done) return;
    if (n === cur + d) { k++; cur = n; t.classList.add('hop'); t.dataset.k = k; sfx.pop(Math.min(8, k + 2)); if (k === b) { nl.dataset.done = 1; t.classList.add('hi2'); e.fill(ans); ctx.check(true); } return; }
    t.classList.remove('wrongtick'); void t.offsetWidth; t.classList.add('wrongtick');
    ctx.check(false, (n - cur) * d <= 0 ? `${op === '+' ? 'บวก' : 'ลบ'}ต้องกระโดดไปทาง<b>${dir}</b> — จาก ${cur} ช่องถัดไปคือ ${cur + d}` : `กระโดดทีละ 1 ช่องนะ — จาก ${cur} ช่องถัดไปคือ ${cur + d}`); }; });
  ctx.onRight = () => { nl.dataset.done = 1; for (let j = 1; j <= b; j++) { const t = tk(a + d * j); t.classList.add('hop'); t.dataset.k = j; } tk(ans).classList.add('hi2'); e.fill(ans); };
  return h('div', { class: 'colstack' }, e, nl, h('div', { class: 'cap' }, `${op === '+' ? 'บวก' : 'ลบ'} ${b} = กระโดดไปทาง${dir} ${b} ครั้ง`)); }
'use strict';
/* =========================================================
   QUESTION TYPES — reusable game rounds.
   Each returns { prompt, mount(body, ctx) }.
   ctx.check(ok, hint) reports an attempt.
   ========================================================= */
const Q = {
  /* count objects then answer (keypad or handwriting) */
  count({ n, item = anyItem(), scatter = n > 5, pen }) {
    return {
      prompt: `มี${item.n}กี่${item.c}? <small>(แตะนับทีละ${item.c}ได้นะ)</small>`, say: `มี${item.n}กี่${item.c}`,
      mount(b, ctx) {
        const vis = n === 0 ? plate(item.e, 0) : scatter ? objField(item.e, n) : objRow(item.e, n, { pop: true, max: '460px', size: n <= 3 ? 'clamp(70px,10vw,120px)' : n <= 5 ? 'clamp(58px,8vw,96px)' : null });
        if (n) makeCountable(vis);
        b.append(vis, answerBox(ctx, n, { preferPen: pen, hint: n ? `แตะ${item.n}ทีละ${item.c} แล้วนับ ${WORD.slice(1, 4).join(' ')} ...` : 'ไม่มีเลยสักชิ้น เรียกว่าศูนย์' }));
      }
    };
  },
  tenCount({ n, pen }) {
    return {
      prompt: 'ในกรอบมีจุดกี่จุด?', mount(b, ctx) {
        b.append(tenFrame(n, { pop: true }), answerBox(ctx, n, { preferPen: pen, hint: 'แถวบนเต็มคือ 5 แล้วนับต่อจาก 5 นะ' }));
      }
    };
  },
  /* colour exactly n hearts (like practice */
  hearts({ n, max = 5, item = pick(ITEMS.animals) }) {
    return {
      prompt: `แตะระบายหัวใจให้เท่ากับจำนวน${item.n}`, mount(b, ctx) {
        const vis = makeCountable(objRow(item.e, n, { pop: true, max: '400px' }));
        const on = Array(max).fill(false), hs = h('div', { class: 'hearts ia' });
        on.forEach((_, i) => { const bt = h('button', { class: 'heart', html: HEART(false) }); bt.onclick = e => { e.stopPropagation(); on[i] = !on[i]; bt.innerHTML = HEART(on[i]); sfx.pop(on.filter(Boolean).length); }; hs.append(bt); });
        b.append(h('div', { class: 'box' }, vis, h('div', { class: 'cap' }, 'นับให้ครบ')), h('div', { class: 'box ia' }, hs, checkButton('ระบายเสร็จแล้ว', () => {
          const c = on.filter(Boolean).length;
          ctx.check(c === n, c > n ? `ระบายเกินไป ${c - n} ดวง ลองแตะเพื่อลบออกนะ` : `ระบายยังไม่ครบ ยังขาดอีก ${n - c} ดวง`);
        })));
      }
    };
  },
  /* pick the group that has n */
  pickGroup({ n, max = 10, item = anyItem() }) {
    const nums = near(n, 3, Math.max(0, n - 3), Math.min(max, n + 3));
    return {
      prompt: `แตะกลุ่มที่มี${item.n} <span class="hl">${n}</span> ${item.c}`, say: `แตะกลุ่มที่มี${item.n} ${WORD[n]} ${item.c}`,
      mount(b, ctx) { b.append(choices(ctx, nums.map(k => ({ value: k, group: 1, node: k === 0 ? plate(item.e, 0) : (o => (makeCountable(o), o))(objRow(item.e, k, { max: '200px' })) })), n, { hint: 'แตะนับในแต่ละกลุ่มก่อนนะ' })); }
    };
  },
  zeroPick() {
    const item = pick([{ e: 'cookie', n: 'คุกกี้', c: 'ชิ้น' }, { e: 'strawberry', n: 'สตรอว์เบอร์รี', c: 'ผล' }, { e: 'apple', n: 'แอปเปิล', c: 'ผล' }]);
    const nums = shuffle([0, rnd(1, 2), rnd(3, 5)]);
    return {
      prompt: `จานไหนมี${item.n} <span class="hl">0</span> ${item.c}?`, say: `จานไหนมี${item.n} ศูนย์ ${item.c}`,
      mount(b, ctx) { b.append(choices(ctx, nums.map(k => ({ value: k, group: 1, node: plate(item.e, k) })), 0, { hint: 'ศูนย์ คือ ไม่มีเลย' })); }
    };
  },
  /* draw lines to match groups to numbers practice */
  matchGroups({ nums, flash }) {
    const items = shuffle(ALL_ITEMS);
    return {
      prompt: 'ลากเส้น (หรือแตะ 2 ฝั่ง) จับคู่จำนวนที่เท่ากัน',
      mount(b, ctx) {
        const left = nums.map((n, i) => ({ key: n, node: flash ? (n <= 6 ? dice(n, '84px') : tenFrame(n, { w: '130px' })) : n > 5 && i % 2 ? tenFrame(n, { w: '130px' }) : objRow(items[i].e, n) }));
        const right = shuffle(nums).map(n => ({ key: n, label: String(n) }));
        b.append(matchBoard(ctx, left, right, { hint: 'นับให้ดีแล้วลองใหม่นะ' }));
      }
    };
  },
  matchForms({ nums, kind = 'thai' }) {
    // kind: 'thai' (1 ↔ ๑) | 'word' (1 ↔ หนึ่ง) | 'wordthai'
    const lab = { thai: n => thai(n), word: n => WORD[n] };
    const leftF = kind === 'wordthai' ? lab.thai : String, rightF = kind === 'thai' ? lab.thai : lab.word;
    return {
      prompt: kind === 'thai' ? 'จับคู่ตัวเลขฮินดูอารบิกกับตัวเลขไทย' : kind === 'word' ? 'จับคู่ตัวเลขกับตัวหนังสือ' : 'จับคู่ตัวเลขไทยกับตัวหนังสือ',
      mount(b, ctx) { b.append(matchBoard(ctx, shuffle(nums).map(n => ({ key: n, label: leftF(n) })), shuffle(nums).map(n => ({ key: n, label: rightF(n) })), { hint: 'ลองอ่านออกเสียงดูนะ' })); }
    };
  },
  /* tracing practice (writing) */
  trace({ glyph, kind }) {
    const g = kind === 'digit' ? { kind: 'digit', d: String(glyph) } : { kind: 'text', text: glyph };
    const what = kind === 'digit' ? `เลข ${glyph}` : kind === 'thai' ? `เลขไทย ${glyph}` : `คำว่า “${glyph}”`;
    return {
      prompt: `เขียนตามรอยเส้นประ ${what}`, say: `เขียนตามรอยเส้นประ ${kind === 'digit' ? 'เลข ' + WORD[+glyph] : what}`,
      mount(b, ctx) {
        const t = tracePad(g, { h: 300, onCheck: (ok) => ctx.check(ok, ok ? '' : 'ค่อย ๆ เขียนตามเส้นประให้ครบนะ' + (kind === 'digit' ? ' กด ▶ ดูวิธีเขียนได้' : '')) });
        b.append(t);
      }
    };
  },
  /* write the number for a picture — handwriting first */
  /* exam-style free writing, no guide. ask: 'digit' | 'thai' | 'word'; from: what is shown as the cue */
  freeWrite({ n, ask, from }) {
    const target = ask === 'digit' ? String(n) : ask === 'thai' ? thai(n) : WORD[n];
    const what = { digit: 'ตัวเลขฮินดูอารบิก', thai: 'ตัวเลขไทย', word: 'ตัวหนังสือ' }[ask];
    const item = n ? anyItem() : { e: 'cookie', n: 'คุกกี้', c: 'ชิ้น' };
    const cue = from === 'picture' ? (n ? makeCountable(objRow(item.e, n, { pop: true, max: '380px', size: n <= 4 ? 'clamp(54px,7vw,84px)' : null })) : plate('cookie', 0))
      : from === 'digit' ? h('div', { class: 'bignum' }, String(n)) : from === 'thai' ? h('div', { class: 'bignum th' }, thai(n)) : h('div', { class: 'word', style: { fontSize: 'clamp(40px,6vw,72px)', color: 'var(--mint-2)' } }, WORD[n]);
    const cueTxt = from === 'picture' ? 'จำนวนในภาพ' : from === 'digit' ? `เลข ${n}` : from === 'thai' ? `เลขไทย ${thai(n)}` : `คำว่า “${WORD[n]}”`;
    return {
      prompt: `เขียน<span class="hl">${what}</span>แสดง${cueTxt} <small>(เขียนเองนะ)</small>`, say: `เขียน${what} แสดง${from === 'picture' ? 'จำนวนในภาพ' : from === 'digit' ? 'เลข ' + WORD[n] : from === 'thai' ? 'เลขไทย ' + WORD[n] : 'คำว่า ' + WORD[n]}`,
      mount(b, ctx) { b.append(h('div', { class: 'colstack' }, cue), freePad(ctx, target, ask, { hint: ask === 'word' ? `${n} เขียนว่า ${WORD[n]}` : `เขียน${what}ของ ${WORD[n]}` })); }
    };
  },
  writeCount({ n, item = anyItem() }) {
    return {
      prompt: `นับ${item.n} แล้ว<b>เขียน</b>ตัวเลขแสดงจำนวน`, say: `นับ${item.n} แล้วเขียนตัวเลขแสดงจำนวน`,
      mount(b, ctx) { const v = n ? makeCountable(objRow(item.e, n, { pop: true, max: '420px', size: n <= 3 ? 'clamp(64px,9vw,110px)' : null })) : plate(item.e, 0); b.append(v, answerBox(ctx, n, { preferPen: true, hint: 'นับอีกครั้งแล้วเขียนใหม่นะ' })); }
    };
  },
  /* word / thai digit → number etc. */
  formChoice({ n, from, pool }) {
    const nums = near(n, 3, Math.min(...pool), Math.max(...pool));
    const shows = { word: WORD[n], thai: thai(n), arabic: String(n) };
    const prompts = { word: `คำว่า <span class="hl">“${WORD[n]}”</span> คือเลขอะไร?`, thai: `เลขไทย <span class="hl">${thai(n)}</span> คือเลขอะไร?`, arabic: `เลข <span class="hl">${n}</span> เขียนเป็นตัวหนังสือว่าอะไร?` };
    const lab = from === 'arabic' ? k => WORD[k] : String;
    return {
      prompt: prompts[from], say: from === 'arabic' ? `เลข ${WORD[n]} เขียนเป็นตัวหนังสือว่าอะไร` : prompts[from],
      mount(b, ctx) { b.append(h('div', { class: 'bignum sm' + (from === 'thai' ? ' th' : from === 'word' ? ' th' : '') }, shows[from]), choices(ctx, nums.map(k => ({ value: k, label: lab(k) })), n, { hint: 'ลองอ่านออกเสียงดูนะ' })); }
    };
  },
  /* compare by pairing one-to-one, then choose the word */
  pairCompare({ a, b: bb, ia = pick(ITEMS.animals), ib }) {
    ib = ib || pick(ALL_ITEMS.filter(x => x !== ia));
    const rel = a > bb ? 'มากกว่า' : a < bb ? 'น้อยกว่า' : 'เท่ากับ';
    return {
      prompt: `จับคู่${ia.n}กับ${ib.n}ทีละ 1 ตัว แล้วเลือกคำ`, say: `แตะ${ia.n} แล้วแตะ${ib.n} เพื่อจับคู่ทีละหนึ่ง แล้วเลือกคำ`,
      mount(b, ctx) {
        const sent = h('div', { class: 'sentence', style: { opacity: .35, pointerEvents: 'none' } });
        const blank = h('span', { class: 'blank' }, '?');
        const pr = pairRows(ia.e, a, ib.e, bb, { interactive: true, onDone: () => { sent.style.opacity = 1; sent.style.pointerEvents = ''; ctx.say(`จับคู่ครบแล้ว! จำนวน${ia.n} ... จำนวน${ib.n}`); } });
        sent.append(h('span', { class: 'lab' }, `จำนวน${ia.n}`), blank, h('span', { class: 'lab' }, `จำนวน${ib.n}`));
        const ch = choices(ctx, ['น้อยกว่า', 'มากกว่า', 'เท่ากับ'].map(w => ({ value: w, label: w })), rel, { onRight: o => { blank.textContent = o.value; blank.classList.add('filled'); }, hint: 'ดูว่าแถวไหนมีตัวที่เหลือไม่มีคู่' });
        b.append(h('div', { class: 'colstack' }, pr, sent, ch));
        b.querySelectorAll('.opt').forEach(o => o.addEventListener('click', ev => { if (!pr.isDone()) { ev.stopImmediatePropagation(); ctx.say('จับคู่ให้ครบก่อนนะ'); } }, true));
      }
    };
  },
  /* compare two numbers / two groups with a word */
  compareWord({ a, b: bb, show = 'num' }) {
    const rel = a > bb ? 'มากกว่า' : a < bb ? 'น้อยกว่า' : 'เท่ากับ';
    const [ia, ib] = twoItems();
    return {
      prompt: show === 'num' ? `เลือกคำเติมในช่องว่าง` : `เปรียบเทียบจำนวน${ia.n}กับ${ib.n}`,
      say: show === 'num' ? `${WORD[a]} ... ${WORD[bb]} เลือกคำเติมในช่องว่าง` : `เปรียบเทียบจำนวน${ia.n}กับจำนวน${ib.n}`,
      mount(b, ctx) {
        const blank = h('span', { class: 'blank' }, '?');
        const side = (n, it) => show === 'num' ? h('span', { class: 'bignum sm' }, n) : h('div', { class: 'box' }, (o => (makeCountable(o), o))(objRow(it.e, n, { max: '270px', size: n > 5 ? 'clamp(24px,3.4vw,36px)' : 'clamp(30px,4.4vw,46px)' })), h('div', { class: 'cap' }, `จำนวน${it.n}`));
        b.append(h('div', { class: 'colstack' },
          h('div', { class: 'sentence' }, side(a, ia), blank, side(bb, ib)),
          choices(ctx, ['น้อยกว่า', 'มากกว่า', 'เท่ากับ'].map(w => ({ value: w, label: w })), rel, { onRight: o => { blank.textContent = o.value; blank.classList.add('filled'); }, hint: 'นึกถึงเส้นจำนวน ยิ่งอยู่ทางขวายิ่งมาก' })));
      }
    };
  },
  extreme({ nums, which }) {
    const target = which === 'max' ? Math.max(...nums) : Math.min(...nums);
    return {
      prompt: `แตะจำนวนที่<span class="hl">${which === 'max' ? 'มากที่สุด' : 'น้อยที่สุด'}</span>`,
      mount(b, ctx) { b.append(choices(ctx, nums.map(n => ({ value: n, label: fmt(n) })), target, { hint: which === 'max' ? 'จำนวนที่มากที่สุดอยู่ทางขวาสุดของเส้นจำนวน' : 'จำนวนที่น้อยที่สุดอยู่ทางซ้ายสุดของเส้นจำนวน' })); }
    };
  },
  /* order numbers ascending/descending practice-17) */
  order({ nums, dir = 'asc' }) {
    const sorted = [...nums].sort((x, y) => dir === 'asc' ? x - y : y - x);
    return {
      prompt: `เรียงลำดับจาก<span class="hl">${dir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}</span> <small>(แตะการ์ดตามลำดับ)</small>`, say: `เรียงลำดับจาก${dir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}`,
      mount(b, ctx) { // v119: เส้นทางคาราวาน (cvnBoard)
        const sh = shuffle(nums.slice()), board = cvnBoard({ cards: sh.map(v => fmt(v)), horiz: true, fits: (k, i) => sh[k] === sorted[i],
          onDone: ok => ok ? ctx.check(true) : ctx.check(false, dir === 'asc' ? 'หาจำนวนที่น้อยที่สุดที่ยังเหลือ วางก่อนนะ' : 'หาจำนวนที่มากที่สุดที่ยังเหลือ วางก่อนนะ') });
        ctx.onRight = () => board.reveal();
        b.append(h('div', { class: 'colstack' }, h('div', { class: 'dir' }, dir === 'asc' ? 'น้อย' : 'มาก', h('span', { class: 'ar' }), dir === 'asc' ? 'มาก' : 'น้อย'), board));
      }
    };
  },
  /* one more / one less */
  beforeAfter({ n, dir }) {
    const ans = dir === 'more' ? n + 1 : n - 1;
    return {
      prompt: `จำนวนที่${dir === 'more' ? 'มากกว่า' : 'น้อยกว่า'} <span class="hl">${n}</span> อยู่ 1 คือจำนวนใด?`, say: `จำนวนที่${dir === 'more' ? 'มากกว่า' : 'น้อยกว่า'} ${WORD[n]} อยู่หนึ่ง คือจำนวนใด`,
      mount(b, ctx) { b.append(numberLine(n > 9 ? 10 : 0, n > 9 ? 20 : 10, { hi: [n] }), answerBox(ctx, ans, { hint: dir === 'more' ? 'ดูเส้นจำนวน ขยับไปทางขวา 1 ช่อง' : 'ดูเส้นจำนวน ขยับไปทางซ้าย 1 ช่อง' })); }
    };
  },
  missingSeq({ start, len = 5, desc }) {
    let seq = range(start, start + len - 1); if (desc) seq = seq.reverse();
    const miss = seq[rnd(1, len - 2)];
    return {
      prompt: 'จำนวนใดหายไป?', mount(b, ctx) {
        b.append(h('div', { class: 'slots' }, seq.map(v => h('div', { class: 'slot' + (v === miss ? '' : ' filled'), style: v === miss ? null : { cursor: 'default' } }, v === miss ? '?' : v))), answerBox(ctx, miss, { hint: desc ? 'ลดลงทีละ 1' : 'เพิ่มขึ้นทีละ 1' }));
      }
    };
  },
  /* part–whole with one missing value */
  partWhole({ whole, a, q = 'b', counters = true, pen }) {
    const bb = whole - a; const ans = q === 'whole' ? whole : q === 'a' ? a : bb;
    return {
      prompt: q === 'whole' ? 'ส่วนย่อยรวมกันเป็นส่วนรวมเท่าไร?' : q === 'a' ? `${whole} แบ่งเป็น <span class="hl">?</span> กับ ${bb}` : `${whole} แบ่งเป็น ${a} กับ <span class="hl">?</span>`,
      say: q === 'whole' ? `${WORD[a]} กับ ${WORD[bb]} รวมกันเป็นเท่าไร` : q === 'a' ? `${WORD[whole]} แบ่งเป็น อะไร กับ ${WORD[bb]}` : `${WORD[whole]} แบ่งเป็น ${WORD[a]} กับ อะไร`,
      mount(b, ctx) {
        const pw = partWhole(whole, a, bb, { q });
        const col = h('div', { class: 'colstack' }, pw);
        if (counters) { const c = h('div', { class: 'counters' }); for (let i = 0; i < whole; i++) c.append(h('span', { class: 'counter' + (i < a ? '' : ' b') + (q !== 'whole' && ((q === 'b' && i >= a) || (q === 'a' && i < a)) ? ' ghost' : '') })); col.append(c); }
        const box = answerBox(ctx, ans, { preferPen: pen, hint: q === 'whole' ? 'นับตัวนับทั้งหมดรวมกัน' : 'นับตัวนับที่จางอยู่ หรือนับต่อจากส่วนที่รู้ไปจนถึงส่วนรวม' });
        b.append(col, box);
        ctx.onRight = () => pw.fill(ans);
      }
    };
  },
  /* interactive split: make whole = a + b by tapping counters */
  split({ whole, a }) {
    const bb = whole - a;
    return {
      prompt: `แตะตัวนับเพื่อเปลี่ยนสี ให้ <span class="hl">${whole}</span> แบ่งเป็น <span class="hl">${a}</span> (สีแดง) กับ <span class="hl2">${bb}</span> (สีฟ้า)`,
      say: `แตะตัวนับเพื่อเปลี่ยนสี ให้ ${WORD[whole]} แบ่งเป็น ${WORD[a]} สีแดง กับ ${WORD[bb]} สีฟ้า`,
      mount(b, ctx) {
        const a0 = a === whole ? 0 : whole;
        const pw = partWhole(whole, a0, whole - a0, { w: 'clamp(190px,24vw,240px)' });
        const sp = splitter(whole, (x, y) => pw.set(whole, x, y), { a: a0 });
        b.append(h('div', { class: 'colstack' }, sp,
          checkButton('ตรวจคำตอบ', () => { const [x, y] = sp.parts(); ctx.check(x === a && y === bb, `ตอนนี้ได้ ${x} กับ ${y} ต้องการ ${a} กับ ${bb}`); })), pw);
      }
    };
  },
  /* subitising: flash a pattern briefly */
  flash({ n, ms = 1600 }) {
    return {
      prompt: 'ดูภาพแป๊บเดียว แล้วบอกจำนวน <small>(ไม่ต้องนับทีละจุด)</small>', say: 'ดูภาพแป๊บเดียว แล้วบอกจำนวน',
      mount(b, ctx) {
        const holder = h('div', { class: 'colstack' });
        const show = () => { holder.firstChild && holder.firstChild.replaceWith(n <= 6 && Math.random() < .6 ? dice(n, 'clamp(140px,22vw,220px)') : tenFrame(n, { w: 'clamp(220px,32vw,320px)' })); setTimeout(() => holder.firstChild && holder.firstChild.replaceWith(h('div', { class: 'flashcover' }, icon('eye'))), ms); };
        holder.append(h('div'), h('button', { class: 'btn sm info ia', onclick: e => { e.stopPropagation(); show(); } }, icon('eye'), 'ดูอีกครั้ง'));
        setTimeout(show, 400);
        b.append(holder, choices(ctx, near(n, 4, 1, 10).sort((x, y) => x - y).map(k => ({ value: k, label: String(k) })), n, { hint: 'แถวบนของกรอบสิบเต็มคือ 5 นะ' }));
      }
    };
  },
  flashPick({ n }) {
    const nums = near(n, 3, Math.max(1, n - 3), Math.min(10, n + 3));
    return {
      prompt: `แตะภาพที่มีจำนวนเท่ากับ <span class="hl">${n}</span> โดยไม่ต้องนับ`, say: `แตะภาพที่มีจำนวนเท่ากับ ${WORD[n]}`,
      mount(b, ctx) { b.append(choices(ctx, nums.map(k => ({ value: k, group: 1, node: k <= 6 && Math.random() < .5 ? dice(k, '120px') : tenFrame(k, { w: 'clamp(160px,18vw,210px)' }) })), n, { hint: 'กรอบสิบ: แถวบนเต็ม = 5' })); }
    };
  }
};

/* =========================================================
   CHAPTER 2 QUESTION TYPES — addition, sums up to 10
   ========================================================= */
const sumHint = (a, b) => `เริ่มที่ ${Math.max(a, b)} แล้วนับต่ออีก ${Math.min(a, b)} นะ`;
Object.assign(Q, {
  /* two groups "a รวมกับ b เป็น ?" practice */
  combine({ a, b, item = anyItem(), item2, pen }) {
    const i2 = item2 || item;
    return {
      prompt: `${a} รวมกับ ${b} เป็นเท่าไร? <small>(แตะนับได้)</small>`, say: `${WORD[a]} รวมกับ ${WORD[b]} เป็นเท่าไร`,
      mount(bd, ctx) { bd.append(h('div', { class: 'story' }, groupBox(item.e, a, `${a}`, { count: true }), h('div', { class: 'verb' }, h('span', null, 'รวมกับ')), groupBox(i2.e, b, `${b}`, { count: true, delay0: .4 })), answerBox(ctx, a + b, { preferPen: pen, hint: sumHint(a, b) })); }
    };
  },
  /* "มีอยู่ a เพิ่มอีก b เป็น ?" practice */
  addMore({ a, b, item = anyItem(), pen }) {
    return {
      prompt: `มีอยู่ ${a} เพิ่มอีก ${b} เป็นเท่าไร?`, say: `มีอยู่ ${WORD[a]} เพิ่มอีก ${WORD[b]} เป็นเท่าไร`,
      mount(bd, ctx) { bd.append(storyStrip(item.e, a, 'เพิ่มอีก', item.e, b), answerBox(ctx, a + b, { preferPen: pen, hint: sumHint(a, b) })); }
    };
  },
  /* place counters to show a + b practice */
  drawSum({ a, b }) {
    return {
      prompt: `แตะช่องวางตัวนับให้เท่ากับผลบวก <span class="hl">${a} + ${b}</span>`, say: `แตะช่องวางตัวนับให้เท่ากับ ${WORD[a]} บวก ${WORD[b]}`,
      mount(bd, ctx) {
        const e = eqRow([a, '+', b, '=', '?']); const t = tenToggle(c => { e.blanks[0].textContent = c || '?'; });
        bd.append(h('div', { class: 'colstack' }, e, t, checkButton('ตรวจคำตอบ', () => ctx.check(t.count() === a + b, t.count() > a + b ? 'วางเกินไปนะ แตะเพื่อเอาออก' : `วาง ${a} ตัว แล้ววางเพิ่มอีก ${b} ตัว`))));
      }
    };
  },
  /* plain fact a + b = ? with optional two-colour ten-frame scaffold */
  addFact({ a, b, frame = false, pen, vert = false }) {
    return {
      prompt: vert ? 'หาผลบวก (ตั้งบวก)' : 'หาผลบวก', say: `${WORD[a]} บวก ${WORD[b]} เท่ากับเท่าไร`,
      mount(bd, ctx) {
        const e = vert ? vertical(a, b) : eqRow([a, '+', b, '=', '?']);
        bd.append(h('div', { class: 'colstack' }, e, frame ? tenFrame2(a, b, { w: 'clamp(200px,26vw,280px)' }) : null), answerBox(ctx, a + b, { preferPen: pen, hint: sumHint(a, b) }));
        ctx.onRight = () => { if (vert) e.querySelector('.ans').textContent = a + b; else e.fill(a + b); };
      }
    };
  },
  /* build "1 + 4 = 5" from words practice */
  buildSentence({ a, b, word = pick(['รวมกับ', 'กับ', 'เพิ่มอีก']) }) {
    const c = a + b, extra = shuffle(range(0, 10).filter(x => ![a, b, c].includes(x))).slice(0, 2);
    return {
      prompt: `เขียนประโยคสัญลักษณ์: <span class="hl">${a} ${word} ${b} เป็น ${c}</span>`, say: `เขียนประโยคสัญลักษณ์ ${WORD[a]} ${word} ${WORD[b]} เป็น ${WORD[c]}`,
      mount(bd, ctx) { bd.append(sentenceBuilder(ctx, [a, '+', b, '=', c], [a, b, c, '+', '=', ...extra], 'เรียงเป็น ตัวตั้ง + ตัวบวก = ผลบวก')); }
    };
  },
  /* picture → choose sentence */
  pickSentence({ a, b, item = anyItem(), item2 }) {
    const c = a + b, i2 = item2 || item;
    const wrong = shuffle([[a, b, c + 1], [a, c, a + c > 10 ? c : a + c], [b + 1, b, c], [a, b, c - 1]].filter(t => t[2] >= 0 && t[2] <= 10 && !(t[0] === a && t[1] === b && t[2] === c))).slice(0, 2);
    const opts = shuffle([[a, b, c], ...wrong]);
    return {
      prompt: 'ภาพนี้เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร?',
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'story' }, groupBox(item.e, a), h('div', { class: 'verb' }, icon('plus')), groupBox(i2.e, b, null, { delay0: .3 })), choices(ctx, opts.map(t => ({ value: t.join(), node: eqRow([t[0], '+', t[1], '=', t[2]], { sm: true }) })), [a, b, c].join(), { hint: 'นับแต่ละกลุ่ม แล้วนับรวมทั้งหมด' }))); }
    };
  },
  /* x + ? = 10 */
  makeTen({ a }) {
    return {
      prompt: `${a} บวกกับเท่าไรได้ <span class="hl">10</span>?`, say: `${WORD[a]} บวกกับเท่าไร ได้สิบ`,
      mount(bd, ctx) { const e = eqRow([a, '+', '?', '=', 10]); bd.append(h('div', { class: 'colstack' }, e, tenFrame(a, { w: 'clamp(220px,30vw,300px)' }), h('div', { class: 'cap' }, 'นับช่องที่ยังว่าง')), answerBox(ctx, 10 - a, { hint: 'นับช่องว่างในกรอบสิบ' })); ctx.onRight = () => e.fill(10 - a); }
    };
  },
  /* tap every flower whose sum is 10 practice */
  findTens() {
    const tens = shuffle([[1, 9], [2, 8], [3, 7], [4, 6], [5, 5], [6, 4], [7, 3], [8, 2], [9, 1], [10, 0]]).slice(0, 3);
    const not = shuffle([[2, 2], [5, 4], [4, 2], [3, 5], [3, 4], [1, 8], [6, 3], [2, 7]]).slice(0, 3);
    const all = shuffle([...tens, ...not]);
    return {
      prompt: 'แตะดอกไม้<span class="hl">ทุกดอก</span>ที่ผลบวกเท่ากับ 10', say: 'แตะดอกไม้ทุกดอกที่ผลบวกเท่ากับสิบ',
      mount(bd, ctx) {
        const sel = new Set(), g = h('div', { class: 'flowers ia' });
        all.forEach((t, i) => { const f = h('button', { class: 'flw', html: '<svg viewBox="0 0 100 100">' + [0, 72, 144, 216, 288].map(r => `<ellipse class="pt" cx="50" cy="24" rx="19" ry="24" transform="rotate(${r} 50 50)"/>`).join('') + '<circle cx="50" cy="50" r="26" fill="#FFF7DD" stroke="#F2D27A" stroke-width="1.5"/></svg>' }, h('span', { class: 'num' }, `${t[0]}+${t[1]}`)); f.onclick = e => { e.stopPropagation(); sel.has(i) ? sel.delete(i) : sel.add(i); f.classList.toggle('on', sel.has(i)); sfx.pop(sel.size); }; g.append(f); });
        bd.append(h('div', { class: 'colstack' }, g, checkButton('ตรวจคำตอบ', () => { const ok = all.every((t, i) => (t[0] + t[1] === 10) === sel.has(i)); ctx.check(ok, 'ลองบวกทีละดอก ดอกที่ได้ 10 พอดีเท่านั้นนะ'); })));
      }
    };
  },
  /* match expression ↔ sum practice */
  matchSums({ n = 3 } = {}) {
    const sums = shuffle(range(3, 10)).slice(0, n);
    const ex = sums.map(s => { const a = rnd(0, s); return { key: s, label: `<span class="num">${a} + ${s - a}</span>` }; });
    return { prompt: 'จับคู่ประโยคการบวกกับผลบวกที่เท่ากัน', mount(bd, ctx) { bd.append(matchBoard(ctx, ex, shuffle(sums).map(s => ({ key: s, label: String(s) })), { hint: 'หาผลบวกก่อนแล้วค่อยจับคู่' })); } };
  },
  /* part–whole diagram → number sentence */
  pwSentence({ whole, a, miss = pick(['a', 'b', 'c']) }) {
    const b = whole - a, toks = [a, '+', b, '=', whole], idx = { a: 0, b: 2, c: 4 }[miss], ans = toks[idx]; toks[idx] = '?';
    return {
      prompt: 'ดูแผนภาพ แล้วเติมประโยคสัญลักษณ์ให้ถูกต้อง',
      mount(bd, ctx) { const e = eqRow(toks); bd.append(h('div', { class: 'colstack' }, partWhole(whole, a, b, { w: 'clamp(200px,24vw,260px)' }), e), answerBox(ctx, ans, { hint: 'ส่วนย่อย + ส่วนย่อย = ส่วนรวม' })); ctx.onRight = () => e.fill(ans); }
    };
  },
  /* commutative: a + b = b + ? */
  swap({ a, b }) {
    return {
      prompt: 'เติมตัวเลขให้ประโยคสัญลักษณ์ถูกต้อง', say: `${WORD[a]} บวก ${WORD[b]} เท่ากับ ${WORD[b]} บวกอะไร`,
      mount(bd, ctx) { const e = eqRow([a, '+', b, '=', b, '+', '?']); bd.append(h('div', { class: 'colstack' }, e, h('div', { class: 'rowstack' }, domino(a, b), domino(b, a))), answerBox(ctx, a, { hint: 'สลับที่ตัวตั้งกับตัวบวก ผลบวกยังเท่าเดิม' })); ctx.onRight = () => e.fill(a); }
    };
  },
  sameSum({ a, b }) {
    const c = a + b, opts = [[b, a]]; while (opts.length < 3) { const x = rnd(0, 9), y = rnd(0, 10 - x); if (x + y !== c && !opts.some(o => o[0] === x && o[1] === y)) opts.push([x, y]); }
    return { prompt: `ข้อใดมีผลบวกเท่ากับ <span class="hl">${a} + ${b}</span>?`, say: `ข้อใดมีผลบวกเท่ากับ ${WORD[a]} บวก ${WORD[b]}`, mount(bd, ctx) { bd.append(choices(ctx, shuffle(opts).map(o => ({ value: o.join(), node: eqRow([o[0], '+', o[1]], { sm: true }) })), [b, a].join(), { hint: 'สลับที่การบวก ผลบวกเท่าเดิม' })); } };
  },
  /* two-step: story → choose sentence → answer */
  story({ text, a, b, unit, art: ar = 'apple', art2, ask, op = '+', pic = 'join' }) {
    const ans = op === '+' ? a + b : a - b;
    return {
      prompt: text, say: text,
      mount(bd, ctx) {
        const vis = op === '+' ? h('div', { class: 'story' }, groupBox(ar, a, null, { count: true }), h('div', { class: 'verb' }, icon('plus')), groupBox(art2 || ar, b, null, { count: true, delay0: .4 }))
          : pic === 'compare' ? pairRows(ar, a, art2 || ar, b, { auto: true }) : h('div', { class: 'story' }, crossedRow(ar, a, b));
        if (op === '−' && pic === 'compare') setTimeout(() => vis.autoPair && vis.autoPair(120), 300);
        const col = h('div', { class: 'colstack' }, vis);
        const step2 = h('div', { class: 'colstack', style: { display: 'none' } });
        const e = eqRow([a, op, b, '=', '?']);
        const wrongs = op === '+' ? [[a, '+', b + 1 > 10 - a ? Math.max(0, b - 1) : b + 1], [Math.max(a, b) + 1 > 9 ? 1 : Math.max(a, b) + 1, '+', Math.min(a, b)]]
          : [[a, '+', b], [a, '−', b === a ? b - 1 : b + 1], [b, '−', a]];
        const opts = shuffle([[a, op, b], ...wrongs.filter(w => !(w[1] === '−' && w[0] < w[2]))]).filter((o, i, arr) => arr.findIndex(p => p.join() === o.join()) === i).slice(0, 3);
        const ch = choices({ check: (ok, hint) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; sfx.pop(5); ctx.say(ask || 'ใช่แล้ว! หาคำตอบเลย'); } else ctx.check(false, hint); } }, opts.map(o => ({ value: o.join(), node: eqRow([o[0], o[1], o[2], '=', '?'], { sm: true }) })), [a, op, b].join(), { hint: op === '+' ? 'หาตัวเลขในโจทย์ทั้งสองจำนวน' : 'จำนวนที่มีอยู่ทั้งหมดเป็นตัวตั้ง ใช้การลบ' });
        step2.append(e, h('div', { class: 'rowstack' }, answerBox(ctx, ans, { hint: op === '+' ? sumHint(a, b) : `เริ่มที่ ${a} แล้วนับถอยหลัง ${b}` }), h('div', { class: 'cap', style: { fontSize: '20px' } }, unit)));
        col.append(h('div', { class: 'cap' }, '① เลือกประโยคสัญลักษณ์'), ch, step2);
        bd.append(col); ctx.onRight = () => e.fill(ans);
      }
    };
  },
  /* which situation is addition */
  isAddition() {
    const items = shuffle([
      { t: 'มีส้ม 4 ผล ซื้อมาอีก 2 ผล', add: true }, { t: 'มีลูกโป่ง 6 ลูก แตกไป 2 ลูก', add: false }, { t: 'มีคุกกี้ 5 ชิ้น กินไป 1 ชิ้น', add: false },
      { t: 'มีปลา 3 ตัว เพื่อนให้อีก 2 ตัว', add: true }, { t: 'มีดินสอ 7 แท่ง ให้น้องไป 3 แท่ง', add: false }, { t: 'มีแมวสีขาว 2 ตัว แมวสีดำ 3 ตัว รวมกี่ตัว', add: true }]);
    const right = items.find(x => x.add), wrong = items.filter(x => !x.add).slice(0, 2);
    return { prompt: 'สถานการณ์ใดเป็น<span class="hl">การบวก</span>?', mount(bd, ctx) { bd.append(choices(ctx, shuffle([right, ...wrong]).map(x => ({ value: x.add, label: x.t })), true, { hint: 'การบวก คือ การรวม หรือ เพิ่มขึ้น' })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); } };
  }
});
/* word problems from practice(+ variants) */
const WORD_PROBLEMS = [
  { text: 'ปลายมีส้ม 2 ผล แม่ซื้อมาให้อีก 6 ผล รวมแล้วปลายมีส้มกี่ผล', a: 2, b: 6, unit: 'ผล', art: 'orange' },
  { text: 'กระปุกของโอมมีเงิน 3 บาท ตาหยอดให้อีก 4 บาท รวมแล้วมีเงินกี่บาท', a: 3, b: 4, unit: 'บาท', art: 'coin' },
  { text: 'ปั้นมีขนมปัง 4 ชิ้น แบมมีมากกว่าปั้น 5 ชิ้น แบมมีขนมปังกี่ชิ้น', a: 4, b: 5, unit: 'ชิ้น', art: 'cookie' },
  { text: 'วงดนตรีของโรงเรียนมีสมาชิกหญิง 5 คน สมาชิกชาย 3 คน วงนี้มีสมาชิกกี่คน', a: 5, b: 3, unit: 'คน', art: 'dotA', art2: 'dotB' },
  { text: 'ต้นข้าวมีลูกบอล 4 ลูก พ่อซื้อให้อีก 4 ลูก ต้นข้าวมีลูกบอลรวมกี่ลูก', a: 4, b: 4, unit: 'ลูก', art: 'ball' },
  { text: 'ส้มอยู่ในตะกร้า 3 ผล เก็บมาใส่อีก 4 ผล ตอนนี้ในตะกร้ามีส้มกี่ผล', a: 3, b: 4, unit: 'ผล', art: 'orange' },
  { text: 'ตาเลี้ยงแมว 4 ตัว และสุนัข 6 ตัว ตาเลี้ยงสัตว์รวมกี่ตัว', a: 4, b: 6, unit: 'ตัว', art: 'cat', art2: 'dog' },
  { text: 'แม่มีไข่ไก่ 4 ฟอง ซื้อมาอีก 4 ฟอง แม่มีไข่ทั้งหมดกี่ฟอง', a: 4, b: 4, unit: 'ฟอง', art: 'egg' }
];

/* =========================================================
   CHAPTER 3 QUESTION TYPES — subtraction, minuend ≤ 10
   ========================================================= */
const subHint = (a, b) => `เริ่มที่ ${a} แล้วนับถอยหลัง ${b} ครั้งนะ`;
Object.assign(Q, {
  /* tap to take away b, then say how many are left practice */
  takeAway({ a, b, item = anyItem(), pen }) {
    return {
      prompt: `มี${item.n} ${a} ${item.c} <b>แตะเอาออก ${b} ${item.c}</b> แล้วเหลือกี่${item.c}?`, say: `มี${item.n} ${WORD[a]} ${item.c} แตะเอาออก ${WORD[b]} ${item.c} แล้วเหลือกี่${item.c}`,
      mount(bd, ctx) {
        const e = eqRow([a, '−', b, '=', '?']); const step2 = h('div', { class: 'colstack', style: { display: 'none' } }, e, answerBox(ctx, a - b, { preferPen: pen, hint: 'นับตัวที่ยังไม่ถูกเอาออก' }));
        const cnt = h('div', { class: 'cap' }, `เอาออกแล้ว 0 / ${b}`);
        const row = removableRow(item.e, a, b, k => { cnt.textContent = `เอาออกแล้ว ${k} / ${b}`; }, () => { step2.style.display = ''; ctx.say(`${a} เอาออก ${b} เหลือเท่าไร?`); });
        bd.append(h('div', { class: 'colstack' }, row, cnt), step2); ctx.onRight = () => e.fill(a - b);
      }
    };
  },
  /* picture with crossed-out items */
  crossed({ a, b, item = anyItem(), pen }) {
    return {
      prompt: `${a} เอาออก ${b} เหลือเท่าไร?`, say: `${WORD[a]} เอาออก ${WORD[b]} เหลือเท่าไร`,
      mount(bd, ctx) { const e = eqRow([a, '−', b, '=', '?']); bd.append(h('div', { class: 'colstack' }, crossedRow(item.e, a, b), e), answerBox(ctx, a - b, { preferPen: pen, hint: 'นับตัวที่ไม่ถูกขีดทิ้ง' })); ctx.onRight = () => e.fill(a - b); }
    };
  },
  subFact({ a, b, frame = false, vert = false, pen }) {
    return {
      prompt: vert ? 'หาผลลบ (ตั้งลบ)' : 'หาผลลบ', say: `${WORD[a]} ลบ ${WORD[b]} เท่ากับเท่าไร`,
      mount(bd, ctx) {
        const e = vert ? vertical(a, b, null, '−') : eqRow([a, '−', b, '=', '?']);
        bd.append(h('div', { class: 'colstack' }, e, frame ? tenCrossed(a, b) : null), answerBox(ctx, a - b, { preferPen: pen, hint: subHint(a, b) }));
        ctx.onRight = () => { if (vert) e.querySelector('.ans').textContent = a - b; else e.fill(a - b); };
      }
    };
  },
  buildSub({ a, b, word = pick(['เอาออก', 'ลบด้วย']) }) {
    const c = a - b, extra = shuffle(range(0, 10).filter(x => ![a, b, c].includes(x))).slice(0, 2);
    return {
      prompt: `เขียนประโยคสัญลักษณ์: <span class="hl">${a} ${word} ${b} เหลือ ${c}</span>`, say: `เขียนประโยคสัญลักษณ์ ${WORD[a]} ${word} ${WORD[b]} เหลือ ${WORD[c]}`,
      mount(bd, ctx) { bd.append(sentenceBuilder(ctx, [a, '−', b, '=', c], [a, b, c, '−', '=', '+', ...extra].slice(0, 8), 'ตัวตั้ง − ตัวลบ = ผลลบ')); }
    };
  },
  /* compare two groups by pairing, answer the difference practice */
  compareDiff({ a, b, ia = pick(ITEMS.animals), ib }) {
    ib = ib || pick(ALL_ITEMS.filter(x => x !== ia));
    const more = a > b, d = Math.abs(a - b);
    return {
      prompt: `จับคู่ทีละ 1 แล้วตอบ: จำนวน${ia.n}${more ? 'มากกว่า' : 'น้อยกว่า'}จำนวน${ib.n}กี่${ia.c}?`, say: `จับคู่ แล้วตอบว่า จำนวน${ia.n}${more ? 'มากกว่า' : 'น้อยกว่า'}จำนวน${ib.n} กี่${ia.c}`,
      mount(bd, ctx) {
        const e = eqRow([Math.max(a, b), '−', Math.min(a, b), '=', '?'], { sm: true }); e.style.visibility = 'hidden';
        const step2 = h('div', { style: { opacity: .3, pointerEvents: 'none', transition: 'opacity .25s' } }, answerBox(ctx, d, { hint: 'นับตัวที่เหลือไม่มีคู่' }));
        const pr = pairRows(ia.e, a, ib.e, b, { interactive: true, onDone: () => { step2.style.opacity = 1; step2.style.pointerEvents = ''; e.style.visibility = ''; ctx.say('นับตัวที่ไม่มีคู่ แล้วตอบเลย'); } });
        bd.append(h('div', { class: 'colstack' }, pr, e), step2); ctx.onRight = () => e.fill(d);
      }
    };
  },
  /* fact family: fill one missing number practice */
  family({ a, b }) {
    const c = a + b, rows = [[a, '+', b, '=', c], [b, '+', a, '=', c], [c, '−', b, '=', a], [c, '−', a, '=', b]];
    const k = rnd(2, 3), idx = pick([0, 2, 4].filter(i => !(k >= 2 && i === 4) || true)), ans = rows[k][idx];
    return {
      prompt: 'ใช้ความสัมพันธ์ของการบวกและการลบ เติมตัวเลขที่หายไป',
      mount(bd, ctx) {
        const list = h('div', { class: 'colstack', style: { gap: '8px' } }, rows.slice(0, 2).map(r => eqRow(r, { sm: true })));
        const t = [...rows[k]]; t[idx] = '?'; const e = eqRow(t);
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'cap' }, 'รู้ว่า'), list, h('div', { class: 'cap' }, 'ดังนั้น'), e), answerBox(ctx, ans, { hint: `${a} กับ ${b} รวมกันได้ ${c}` }));
        ctx.onRight = () => e.fill(ans);
      }
    };
  },
  pwSub({ whole, a, miss = pick(['b', 'c']) }) {
    const b = whole - a, t = [whole, '−', a, '=', b], idx = miss === 'a' ? 0 : miss === 'b' ? 2 : 4, ans = t[idx]; t[idx] = '?';
    return { prompt: 'ดูแผนภาพ แล้วเติมประโยคสัญลักษณ์การลบ', mount(bd, ctx) { const e = eqRow(t); bd.append(h('div', { class: 'colstack' }, partWhole(whole, a, b, { w: 'clamp(200px,24vw,260px)' }), e), answerBox(ctx, ans, { hint: 'ส่วนรวม − ส่วนย่อย = ส่วนย่อยอีกส่วน' })); ctx.onRight = () => e.fill(ans); } };
  },
  /* answer by tapping where you land on the number line */
  lineSub({ a, b }) {
    return {
      prompt: `<span class="hl">${a} − ${b}</span> เริ่มที่ ${a} แล้วแตะกระโดดไปทางซ้ายทีละ 1 ช่อง`, say: `${WORD[a]} ลบ ${WORD[b]} เริ่มที่ ${WORD[a]} แล้วแตะกระโดดไปทางซ้ายทีละหนึ่งช่อง`,
      mount(bd, ctx) { /* v167 (ผู้ใช้ขอ: ทำจริงบนเส้นจำนวน) — เด็กกระโดดเองทีละช่อง นับครบ b ครั้งจึงได้คำตอบ (เดิมแตะคำตอบเลย) */
        const nl = numberLine(0, 10, { hi: [a] }), e = eqRow([a, '−', b, '=', '?'], { sm: true }); nl.classList.add('ia', 'tapline', 'hopline'); let cur = a, k = 0;
        const T = [...nl.querySelectorAll('.tick')];
        T.forEach((t, n) => { t.onclick = ev => { ev.stopPropagation(); if (nl.dataset.done) return;
          if (n === cur - 1) { k++; cur = n; t.classList.add('hop'); t.dataset.k = k; sfx.pop(Math.min(8, k + 2));
            if (k === b) { nl.dataset.done = 1; t.classList.add('hi2'); e.fill && e.fill(a - b); ctx.check(true); } return; }
          t.classList.remove('wrongtick'); void t.offsetWidth; t.classList.add('wrongtick');
          ctx.check(false, n >= cur ? `ลบต้องกระโดดไปทาง<b>ซ้าย</b> — จาก ${cur} ช่องถัดไปคือ ${cur - 1}` : `กระโดดทีละ 1 ช่องนะ — จาก ${cur} ช่องถัดไปคือ ${cur - 1}`); }; });
        ctx.onRight = () => { nl.dataset.done = 1; for (let j = 1; j <= b; j++) { const t = T[a - j]; t.classList.add('hop'); t.dataset.k = j; } T[a - b].classList.add('hi2'); e.fill && e.fill(a - b); };
        bd.append(h('div', { class: 'colstack' }, e, nl, h('div', { class: 'cap' }, `ลบ ${b} = กระโดดไปทางซ้าย ${b} ครั้ง`)));
      }
    };
  },
  /* tap counters in a ten frame to cross them out practice */
  tenSub({ a, b }) {
    return {
      prompt: `ใช้กรอบสิบหา <span class="hl">${a} − ${b}</span> <small>(แตะขีดทิ้ง ${b} ตัว)</small>`, say: `ใช้กรอบสิบ หา ${WORD[a]} ลบ ${WORD[b]} แตะขีดทิ้ง ${WORD[b]} ตัว`,
      mount(bd, ctx) {
        const e = eqRow([a, '−', b, '=', '?']); const step2 = h('div', { style: { display: 'none' } }, answerBox(ctx, a - b, { hint: 'นับตัวที่ยังไม่ถูกขีดทิ้ง' }));
        const tf = tenTapCross(a, b, () => { step2.style.display = ''; });
        bd.append(h('div', { class: 'colstack' }, e, tf), step2); ctx.onRight = () => e.fill(a - b);
      }
    };
  },
  /* unknown in addition / subtraction sentences practice */
  unknown({ form = pick(['a+?', '?+b', 'a-?', '?-b']), a, b }) {
    let t, ans;
    if (form === 'a+?') { const c = rnd(3, 10); a = a ?? rnd(0, c); t = [a, '+', '?', '=', c]; ans = c - a; }
    else if (form === '?+b') { const c = rnd(3, 10); b = b ?? rnd(0, c); t = ['?', '+', b, '=', c]; ans = c - b; }
    else if (form === 'a-?') { a = a ?? rnd(3, 10); const c = rnd(0, a); t = [a, '−', '?', '=', c]; ans = a - c; }
    else { b = b ?? rnd(1, 6); const c = rnd(0, 10 - b); t = ['?', '−', b, '=', c]; ans = b + c; }
    return { prompt: 'หาจำนวนที่แทนด้วย ☐', mount(bd, ctx) { const e = eqRow(t); bd.append(h('div', { class: 'colstack' }, e, h('div', { class: 'cap' }, 'ลองนึกถึงแผนภาพส่วนย่อย–ส่วนรวม')), answerBox(ctx, ans, { hint: form.includes('+') ? 'ใช้การลบช่วยหา' : form === '?-b' ? 'ใช้การบวกช่วยหา: ผลลบ + ตัวลบ' : 'ตัวตั้ง − ผลลบ' })); ctx.onRight = () => e.fill(ans); } };
  },
  /* tap every cloud whose difference is n practice */
  findDiff({ n = 2 } = {}) {
    const yes = shuffle([[10, 8], [4, 2], [3, 1], [8, 6], [5, 3], [7, 5], [9, 7], [6, 4]].filter(p => p[0] - p[1] === n)).slice(0, 3);
    const no = shuffle([[9, 1], [8, 2], [7, 3], [9, 6], [10, 5], [6, 5], [8, 4]].filter(p => p[0] - p[1] !== n)).slice(0, 3);
    const all = shuffle([...yes, ...no]);
    return {
      prompt: `แตะเมฆ<span class="hl">ทุกก้อน</span>ที่ผลลบเท่ากับ ${n}`, say: `แตะเมฆทุกก้อนที่ผลลบเท่ากับ ${WORD[n]}`,
      mount(bd, ctx) {
        const sel = new Set(), g = h('div', { class: 'flowers ia' });
        all.forEach((t, i) => { const f = h('button', { class: 'cloudb', html: '<svg viewBox="0 0 120 80"><path class="cl" d="M28 70 a20 20 0 0 1 -4 -39 a26 26 0 0 1 48 -10 a20 20 0 0 1 32 16 a17 17 0 0 1 -6 33 z"/></svg>' }, h('span', { class: 'num' }, `${t[0]}−${t[1]}`)); f.onclick = e => { e.stopPropagation(); sel.has(i) ? sel.delete(i) : sel.add(i); f.classList.toggle('on', sel.has(i)); sfx.pop(sel.size); }; g.append(f); });
        bd.append(h('div', { class: 'colstack' }, g, checkButton('ตรวจคำตอบ', () => ctx.check(all.every((t, i) => (t[0] - t[1] === n) === sel.has(i)), 'ลบทีละก้อน ก้อนที่ได้ ' + n + ' พอดีเท่านั้นนะ'))));
      }
    };
  },
  matchDiffs({ k = 3 } = {}) {
    const ds = shuffle(range(0, 8)).slice(0, k);
    const ex = ds.map(d => { const a = rnd(d, 10); return { key: d, label: `<span class="num">${a} − ${a - d}</span>` }; });
    return { prompt: 'จับคู่ประโยคการลบกับผลลบที่เท่ากัน', mount(bd, ctx) { bd.append(matchBoard(ctx, ex, shuffle(ds).map(d => ({ key: d, label: String(d) })), { hint: 'หาผลลบก่อนแล้วค่อยจับคู่' })); } };
  },
  isSubtraction() {
    const items = shuffle([
      { t: 'มีไข่ 3 ฟอง ซื้อมาอีก 2 ฟอง', sub: false }, { t: 'มีมะม่วง 4 ลูก กินไป 2 ลูก', sub: true }, { t: 'มีปลาทอง 5 ตัว เพื่อนให้อีก 1 ตัว', sub: false },
      { t: 'มีลูกโป่ง 7 ลูก แตกไป 2 ลูก', sub: true }, { t: 'มีดินสอ 2 แท่ง แม่ให้อีก 3 แท่ง', sub: false }, { t: 'มีขนม 6 ชิ้น ให้น้องไป 3 ชิ้น', sub: true }]);
    const right = items.find(x => x.sub), wrong = items.filter(x => !x.sub).slice(0, 2);
    return { prompt: 'สถานการณ์ใดเป็น<span class="hl">การลบ</span>?', mount(bd, ctx) { bd.append(choices(ctx, shuffle([right, ...wrong]).map(x => ({ value: x.sub, label: x.t })), true, { hint: 'การลบ คือ การเอาออก ทำให้ลดลง หรือเปรียบเทียบหาส่วนต่าง' })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); } };
  },
  pickSub({ a, b, item = anyItem() }) {
    const c = a - b, opts = shuffle([[a, '−', b, c], [a, '+', b, Math.min(10, a + b)], [a, '−', c === b ? b + 1 : c, c === b ? a - b - 1 : b].filter(x => x >= 0)].filter(o => o.length === 4));
    return { prompt: 'ภาพนี้เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร?', mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, crossedRow(item.e, a, b), choices(ctx, opts.map(o => ({ value: o.join(), node: eqRow([o[0], o[1], o[2], '=', o[3]], { sm: true }) })), [a, '−', b, c].join(), { hint: 'มีทั้งหมดเท่าไร ถูกขีดทิ้งไปเท่าไร' }))); } };
  }
});
const SUB_PROBLEMS = [
  { text: 'บิวมีเงิน 8 บาท จ่ายค่าไอศกรีม 7 บาท บิวเหลือเงินกี่บาท', a: 8, b: 7, unit: 'บาท', art: 'coin', op: '−' },
  { text: 'ริบบิ้นสีชมพูและสีเขียวมีรวม 5 เส้น เป็นสีชมพู 2 เส้น เป็นสีเขียวกี่เส้น', a: 5, b: 2, unit: 'เส้น', art: 'dotB', op: '−' },
  { text: 'ภูมีลูกอม 10 เม็ด แบ่งให้น้อง 9 เม็ด ภูยังมีลูกอมอยู่กี่เม็ด', a: 10, b: 9, unit: 'เม็ด', art: 'circle', op: '−' },
  { text: 'ร้านยายมีน้ำปลา 6 ลิตร ขวดแตกหกไป 5 ลิตร ยังเหลือน้ำปลากี่ลิตร', a: 6, b: 5, unit: 'ลิตร', art: 'milk', op: '−' },
  { text: 'มิวมีตุ๊กตาแมว 7 ตัว ตุ๊กตาช้าง 5 ตัว ตุ๊กตาแมวมากกว่าตุ๊กตาช้างกี่ตัว', a: 7, b: 5, unit: 'ตัว', art: 'panda', art2: 'rabbit', op: '−', pic: 'compare' },
  { text: 'ในจานมีกล้วยสุก 6 ผล กล้วยดิบ 9 ผล กล้วยสุกน้อยกว่ากล้วยดิบกี่ผล', a: 9, b: 6, unit: 'ผล', art: 'mango', art2: 'pear', op: '−', pic: 'compare' },
  { text: 'นิทานเล่มหนึ่งมี 7 หน้า เจนอ่านแล้ว 4 หน้า ต้องอ่านอีกกี่หน้าจึงจะจบเล่ม', a: 7, b: 4, unit: 'หน้า', art: 'book', op: '−' },
  { text: 'บีมมีจาน 6 ใบ ทำตกแตก 1 ใบ บีมเหลือจานกี่ใบ', a: 6, b: 1, unit: 'ใบ', art: 'milk', op: '−' }
];

/* =========================================================
   GRADE 2 · CHAPTER 1 QUESTION TYPES — numbers to 1,000
   ========================================================= */
const fitRange = (start, step, len, lo = 0, hi = 1000) => { const last = start + (len - 1) * step; if (last > hi) start -= last - hi + rnd(0, 20); if (last < lo) start += lo - last + rnd(0, 20); return Math.max(lo, Math.min(hi, start)); };
const nearBig = (n, k, lo = 0, hi = 999, spread = [1, 10, 100]) => { const s = new Set([n]); let g = 0; while (s.size < k && g++ < 50) { const d = pick(spread) * pick([-1, 1]) * rnd(1, 2); const m = n + d; if (m >= lo && m <= hi) s.add(m); } return shuffle([...s]); };
/* v122 (ผู้ใช้ขอ): ข้อที่ถามหลัก/ค่าของเลขโดด — เลขโดดที่ถามต้องมีตัวเดียวในจำนวน ไม่งั้นเด็กไม่รู้ว่าหมายถึงตัวไหน
   uniqAt(n, i): เปลี่ยนเลขโดดตัวอื่นที่ซ้ำกับตำแหน่ง i ให้เป็นเลขที่ยังไม่มีในจำนวน (ตัวแรกไม่เป็น 0) · uniqPick(n): สุ่มตำแหน่งที่ไม่ซ้ำ */
const uniqAt = (n, i) => { const a = String(n).split(''), d = a[i];
  a.forEach((x, j) => { if (j !== i && x === d) { const free = '0123456789'.split('').filter(c => !a.includes(c) && !(j === 0 && c === '0')); a[j] = free.length ? pick(free) : x; } });
  return +a.join(''); };
const uniqPick = (n, i) => { const s = String(n); if (i == null) { const u = s.split('').map((_, k) => k).filter(k => s.split(s[k]).length === 2); i = u.length ? pick(u) : rnd(0, s.length - 1); } return { n: uniqAt(n, i), i }; };
Object.assign(Q, {
  skipCount({ step, n, item = anyItem() }) {
    return {
      prompt: `นับทีละ ${step} — มี${item.n}ทั้งหมดกี่${item.c}?`, say: `นับทีละ ${WORD[step] || step} มี${item.n}ทั้งหมดกี่${item.c}`,
      mount(b, ctx) { b.append(skipGroups(item.e, n, step), answerBox(ctx, n, { hint: `นับกลุ่มละ ${step}: ${[1, 2, 3].map(k => k * step).join(', ')}, …` })); }
    };
  },
  blocksRead({ n, ask = 'digit' }) {
    const what = { digit: 'ตัวเลขฮินดูอารบิก', thai: 'ตัวเลขไทย', word: 'ตัวหนังสือ' }[ask];
    return { __sig: `blk ${n} ${ask}`,
      prompt: `ภาพนี้แสดงจำนวนเท่าไร? <small>(ตอบเป็น${what})</small>`, say: `ภาพนี้แสดงจำนวนเท่าไร ตอบเป็น${what}`,
      mount(b, ctx) {
        const vis = baseBlocks(n, { labels: false });
        const hint = 'นับแผ่นร้อย แท่งสิบ และก้อนหน่วย';
        if (ask === 'digit') b.append(vis, answerBox(ctx, n, { hint }));
        else { const opts = nearBig(n, 3); b.append(h('div', { class: 'colstack' }, vis, choices(ctx, opts.map(v => ({ value: v, label: ask === 'thai' ? thai(v) : thaiWords(v) })), n, { hint }))); b.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); }
      }
    };
  },
  wordToNum({ n }) {
    return { mx: { k: 'nw', l: fmt(n), r: thaiWords(n) }, prompt: `เขียนตัวเลขฮินดูอารบิกของ <span class="hl">${thaiWords(n)}</span>`, say: `เขียนตัวเลขของ ${thaiWords(n)}`, mount(b, ctx) { b.append(h('div', { class: 'word', style: { color: 'var(--mint-2)' } }, thaiWords(n)), answerBox(ctx, n, { hint: 'ฟังทีละส่วน: กี่ร้อย กี่สิบ กี่หน่วย' })); } };
  },
  numToWord({ n, from = 'digit' }) {
    const opts = nearBig(n, 3);
    return { mx: { k: from === 'thai' ? 'nwth' : 'nw', l: from === 'thai' ? `<span class="th">${thai(n)}</span>` : fmt(n), r: thaiWords(n) }, prompt: `${from === 'thai' ? 'เลขไทย' : 'จำนวน'} <span class="hl">${from === 'thai' ? thai(n) : n}</span> อ่านว่าอะไร?`, say: `จำนวนนี้อ่านว่าอะไร`, mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' + (from === 'thai' ? ' th' : '') }, from === 'thai' ? thai(n) : n), choices(ctx, opts.map(v => ({ value: v, label: thaiWords(v) })), n, { hint: 'อ่านจากหลักร้อย หลักสิบ แล้วหลักหน่วย' }))); b.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); } };
  },
  match1000({ nums }) {
    const kinds = shuffle(['thai', 'word', 'blocks']);
    return {
      prompt: 'ลากเส้น (หรือแตะ 2 ฝั่ง) จับคู่จำนวนที่เท่ากัน',
      mount(b, ctx) {
        const left = nums.map((n, i) => ({ key: n, node: kinds[i % 3] === 'blocks' ? baseBlocks(n, { sm: true }) : h('span', { class: kinds[i % 3] === 'word' ? 'mword' : '' }, kinds[i % 3] === 'thai' ? thai(n) : thaiWords(n)) }));
        b.append(matchBoard(ctx, left, shuffle(nums).map(n => ({ key: n, label: String(n) })), { hint: 'แปลงให้เป็นตัวเลขฮินดูอารบิกก่อน' }));
      }
    };
  },
  placeValue({ n, pos = rnd(0, 2) }) {
    n = uniqAt(n, pos);
    const d = +String(n).padStart(3, '0')[pos], names = ['หลักร้อย', 'หลักสิบ', 'หลักหน่วย'], val = d * [100, 10, 1][pos];
    return { prompt: `${n}: เลข <span class="hl">${d}</span> ใน${names[pos]} มีค่าเท่าไร?`, say: `${thaiWords(n)} เลข ${WORD[d]} ใน${names[pos]} มีค่าเท่าไร`, mount(b, ctx) { b.append(placeChart(n, { hi: pos }), answerBox(ctx, val, { hint: `${names[pos]} มีค่าเป็น ${['ร้อย', 'สิบ', 'หน่วย'][pos]}: ${d} ${['ร้อย', 'สิบ', 'หน่วย'][pos]}` })); } };
  },
  whichPlace({ n }) {
    const U = uniqPick(n); n = U.n; const s = String(n), pos = U.i, d = s[pos];
    const names = ['หลักร้อย', 'หลักสิบ', 'หลักหน่วย'];
    return { prompt: `ใน <span class="hl">${n}</span> เลข ${d} อยู่ในหลักใด?`, mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, n), choices(ctx, names.map((x, i) => ({ value: i, label: x })), pos, { hint: 'นับจากขวา: หน่วย สิบ ร้อย' }))); } };
  },
  expanded({ n, miss = rnd(0, 2) }) {
    const parts = [Math.floor(n / 100) * 100, Math.floor(n / 10) % 10 * 10, n % 10];
    const t = [n, '=', parts[0], '+', parts[1], '+', parts[2]]; const idx = [2, 4, 6][miss], ans = parts[miss]; t[idx] = '?';
    return { prompt: 'เขียนในรูปกระจาย: เติมจำนวนที่หายไป', say: `เขียน ${thaiWords(n)} ในรูปกระจาย`, mount(b, ctx) { const e = eqRow(t); b.append(h('div', { class: 'colstack' }, placeChart(n, { values: true, q: null }), e), answerBox(ctx, ans, { hint: 'รูปกระจาย = ค่าของหลักร้อย + ค่าของหลักสิบ + ค่าของหลักหน่วย' })); ctx.onRight = () => e.fill(ans); } };
  },
  pickExpanded({ n }) {
    const hd = Math.floor(n / 100), t = Math.floor(n / 10) % 10, u = n % 10;
    const right = `${hd * 100} + ${t * 10} + ${u}`;
    const bad = [`${hd} + ${t} + ${u}`, `${hd * 100} + ${u * 10} + ${t}`, `${hd * 10} + ${t * 10} + ${u}`, `${hd * 100} + ${t} + ${u}`].filter(x => x !== right && x.split(' + ').reduce((a, b) => a + +b, 0) !== n);
    const opts = shuffle([right, ...[...new Set(bad)].slice(0, 2)]);
    return { prompt: `ข้อใดเป็นรูปกระจายของ <span class="hl">${n}</span>?`, mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, n), choices(ctx, opts.map(o => ({ value: o, label: `<span class="num">${o}</span>` })), right, { hint: 'แต่ละหลักต้องเขียนเป็นค่าของหลักนั้น' }))); } };
  },
  compareSym({ a, b: bb, blocks = false }) {
    const rel = a > bb ? '>' : a < bb ? '<' : '=';
    return {
      prompt: 'เลือกเครื่องหมาย &gt; &lt; หรือ = เติมในช่องว่าง', say: `${thaiWords(a)} กับ ${thaiWords(bb)} เลือกเครื่องหมาย`,
      mount(b, ctx) {
        const e = eqRow([a, '?', bb]);
        b.append(h('div', { class: 'colstack' }, blocks ? h('div', { class: 'rowstack' }, baseBlocks(a, { sm: true }), baseBlocks(bb, { sm: true })) : null, e,
          h('div', { class: 'legend' }, h('span', null, h('b', null, '>'), ' มากกว่า'), h('span', null, h('b', null, '<'), ' น้อยกว่า'), h('span', null, h('b', null, '='), ' เท่ากับ')),
          choices(ctx, ['>', '<', '='].map(x => ({ value: x, label: `<span class="num" style="font-size:1.3em">${x.replace('>', '&gt;').replace('<', '&lt;')}</span>` })), rel, { onRight: o => e.fill(o.value), hint: 'เทียบหลักร้อยก่อน ถ้าเท่ากันค่อยเทียบหลักสิบ แล้วหลักหน่วย' })));
      }
    };
  },
  evenOdd({ n }) {
    return { mx: { k: 'eo', n }, prompt: `<span class="hl">${n}</span> เป็นจำนวนคู่หรือจำนวนคี่?`, say: `${thaiWords(n)} เป็นจำนวนคู่หรือจำนวนคี่`, mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, n), choices(ctx, [{ value: 0, label: 'จำนวนคู่' }, { value: 1, label: 'จำนวนคี่' }], n % 2, { hint: 'ดูเลขโดดในหลักหน่วย: 0 2 4 6 8 เป็นจำนวนคู่' }))); } };
  },
  sortEvenOdd({ k = 6 } = {}) {
    const nums = shuffle([...shuffle(range(100, 999).filter(x => x % 2 === 0)).slice(0, k / 2), ...shuffle(range(100, 999).filter(x => x % 2)).slice(0, k / 2)]);
    return { prompt: 'แยกจำนวนคู่และจำนวนคี่ใส่ตะกร้า', mount(b, ctx) { b.append(sortBins(ctx, nums, 'จำนวนคู่', 'จำนวนคี่', v => v % 2 === 0, 'ดูเลขโดดในหลักหน่วยนะ')); } };
  },
  pattern({ start, step, len = 5, blank, hi = 1000 }) {
    start = fitRange(start, step, len, 0, hi);
    const vals = range(0, len - 1).map(i => start + i * step), bi = blank ?? rnd(1, len - 1);
    return { prompt: 'เติมจำนวนในแบบรูปให้ถูกต้อง', say: 'เติมจำนวนในแบบรูปให้ถูกต้อง', mount(b, ctx) { b.append(h('div', { class: 'colstack' }, numStrip(vals, [bi])), answerBox(ctx, vals[bi], { hint: `ลองดูว่าแต่ละจำนวน${step > 0 ? 'เพิ่มขึ้น' : 'ลดลง'}ทีละเท่าไร` })); } };
  },
  patternRule({ start, step, len = 4, hi = 1000 }) {
    start = fitRange(start, step, len, 0, hi);
    const vals = range(0, len - 1).map(i => start + i * step), right = (step > 0 ? 'เพิ่มขึ้นทีละ ' : 'ลดลงทีละ ') + Math.abs(step);
    const opts = shuffle([right, (step > 0 ? 'ลดลงทีละ ' : 'เพิ่มขึ้นทีละ ') + Math.abs(step), (step > 0 ? 'เพิ่มขึ้นทีละ ' : 'ลดลงทีละ ') + (Math.abs(step) === 10 ? 100 : Math.abs(step) === 100 ? 10 : Math.abs(step) * 2)]);
    return { prompt: 'แบบรูปนี้เป็นอย่างไร?', mount(b, ctx) { b.append(h('div', { class: 'colstack' }, numStrip(vals), choices(ctx, opts.map(o => ({ value: o, label: o })), right, { hint: 'ลบจำนวนที่อยู่ติดกันดู' }))); b.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); } };
  }
});

/* =========================================================
   GRADE 3 · CHAPTER 1 QUESTION TYPES — numbers to 100,000
   ========================================================= */
const PLACE = ['หลักแสน', 'หลักหมื่น', 'หลักพัน', 'หลักร้อย', 'หลักสิบ', 'หลักหน่วย'];
const placeOf = (n, i) => { const s = String(n); return PLACE[6 - s.length + i]; };          // name of digit i (from the left)
const valOf = (n, i) => { const s = String(n); return +s[i] * 10 ** (s.length - 1 - i); };
/* plausible look-alikes: swap two digits / change one digit — never equal to n */
function lookAlikes(n, k = 2, lo = 1000, hi = 99999) {
  const s = String(n), out = new Set(); let g = 0;
  while (out.size < k && g++ < 80) {
    let t = s.split(''); const i = rnd(0, t.length - 1), j = rnd(0, t.length - 1);
    if (Math.random() < .5 && t[i] !== t[j]) [t[i], t[j]] = [t[j], t[i]]; else t[i] = String((+t[i] + pick([1, 2, 9, 8])) % 10);
    const m = +t.join(''); if (m !== n && m >= lo && m <= hi && String(m).length === s.length) out.add(m);
  }
  return [...out];
}
const txtOpts = b => { const os = [...b.querySelectorAll('.opt')]; os.forEach(o => o.classList.add('txt')); if (os.some(o => o.textContent.length > 18)) os[0] && os[0].parentNode.classList.add('stack'); };
Object.assign(Q, {
  /* read an abacus */
  abacusRead({ n, ask = 'digit', rods }) {
    const what = { digit: 'ตัวเลขฮินดูอารบิก', thai: 'ตัวเลขไทย', word: 'ตัวหนังสือ' }[ask];
    return {
      prompt: `ลูกคิดแสดงจำนวนเท่าไร? <small>(ตอบเป็น${what})</small>`, say: `ลูกคิดแสดงจำนวนเท่าไร ตอบเป็น${what}`,
      mount(b, ctx) {
        const vis = abacus(n, { rods: rods || Math.max(4, String(n).length) }), hint = 'นับลูกคิดทีละหลัก จากหลักซ้ายสุดไปหลักหน่วย หลักที่ไม่มีลูกคิดเขียน 0';
        if (ask === 'digit') b.append(vis, answerBox(ctx, n, { hint }));
        else { const opts = shuffle([n, ...lookAlikes(n)]); b.append(h('div', { class: 'colstack' }, vis, choices(ctx, opts.map(v => ({ value: v, label: ask === 'thai' ? thai(fmt(v)) : thaiWords(v) })), n, { hint }))); txtOpts(b); }
      }
    };
  },
  /* words / Thai numerals → Hindu-Arabic digits */
  writeDigits({ n, from = 'word' }) {
    const shown = from === 'thai' ? thai(fmt(n)) : thaiWords(n);
    return { prompt: `เขียน${from === 'thai' ? ' ' : ''}<span class="hl">${shown}</span> เป็นตัวเลขฮินดูอารบิก`, say: `เขียน ${thaiWords(n)} เป็นตัวเลขฮินดูอารบิก`,
      mount(b, ctx) { b.append(h('div', { class: from === 'thai' ? 'bignum sm th' : 'word', style: from === 'thai' ? null : { color: 'var(--mint-2)' } }, shown), answerBox(ctx, n, { hint: from === 'thai' ? '๐=0 ๑=1 ๒=2 ๓=3 ๔=4 ๕=5 ๖=6 ๗=7 ๘=8 ๙=9' : 'ฟังทีละส่วน: กี่หมื่น กี่พัน กี่ร้อย กี่สิบ กี่หน่วย หลักที่ไม่ได้อ่านให้เขียน 0' })); } };
  },
  /* digits / Thai numerals / abacus → which words */
  readWords({ n, from = 'digit' }) {
    const opts = shuffle([n, ...lookAlikes(n)]);
    return { prompt: 'จำนวนนี้อ่านว่าอย่างไร?', say: 'จำนวนนี้อ่านว่าอย่างไร',
      mount(b, ctx) { const vis = from === 'abacus' ? abacus(n, { sm: true }) : h('div', { class: 'bignum sm' + (from === 'thai' ? ' th' : '') }, from === 'thai' ? thai(fmt(n)) : fmt(n));
        b.append(h('div', { class: 'colstack' }, vis, choices(ctx, opts.map(v => ({ value: v, label: thaiWords(v) })), n, { hint: 'อ่านทีละหลักจากซ้าย: หมื่น พัน ร้อย สิบ หน่วย' }))); txtOpts(b); } };
  },
  /* digits → Thai numerals */
  toThai({ n }) {
    const opts = shuffle([n, ...lookAlikes(n)]);
    return { prompt: `<span class="hl">${fmt(n)}</span> เขียนเป็นตัวเลขไทยอย่างไร?`, say: `${thaiWords(n)} เขียนเป็นตัวเลขไทยอย่างไร`,
      mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, fmt(n)), choices(ctx, opts.map(v => ({ value: v, label: `<span class="thn">${thai(fmt(v))}</span>` })), n, { hint: '๐=0 ๑=1 ๒=2 ๓=3 ๔=4 ๕=5 ๖=6 ๗=7 ๘=8 ๙=9' }))); txtOpts(b); } };
  },
  /* practice: true / false statement */
  truth({ text, ok, hint }) {
    return { prompt: 'ข้อความนี้ถูกหรือผิด?', say: 'ข้อความนี้ถูกหรือผิด',
      mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'stmt', html: text }), choices(ctx, [{ value: true, label: `${icon('check').outerHTML} ถูก` }, { value: false, label: `${icon('close').outerHTML} ผิด` }], ok, { hint }))); b.querySelectorAll('.opt').forEach((o, i) => o.classList.add('txt', i ? 'tf-no' : 'tf-yes')); } };
  },
  /* practice: match equal numbers in different forms */
  match5({ nums }) {
    const kinds = shuffle(['thai', 'word', 'abacus', 'word']);
    return { prompt: 'แตะ 2 ฝั่ง (หรือลากเส้น) จับคู่จำนวนที่เท่ากัน',
      mount(b, ctx) {
        const left = nums.map((n, i) => ({ key: n, node: kinds[i % 4] === 'abacus' ? abacus(n, { sm: true, labels: false }) : h('span', { class: kinds[i % 4] === 'word' ? 'mword' : 'thn' }, kinds[i % 4] === 'thai' ? thai(fmt(n)) : thaiWords(n)) }));
        b.append(matchBoard(ctx, left, shuffle(nums).map(n => ({ key: n, label: fmt(n) })), { hint: 'แปลงให้เป็นตัวเลขฮินดูอารบิกก่อน แล้วเทียบทีละหลัก' }));
      } };
  },
  /* place value of the digit at position i */
  digitValue({ n, i, underline = false }) {
    if (underline) { if (i == null) i = rnd(0, String(n).length - 1); } else ({ n, i } = uniqPick(n, i));
    const s = String(n), d = s[i], v = valOf(n, i), pn = placeOf(n, i);
    return { prompt: underline ? `ตัวเลขที่ขีดเส้นใต้ มีค่าเท่าไร?` : `${fmt(n)}: เลข <span class="hl">${d}</span> ใน${pn} มีค่าเท่าไร?`, say: `เลข ${WORD[d]} ใน${pn} มีค่าเท่าไร`,
      mount(b, ctx) {
        const vis = underline ? h('div', { class: 'bignum sm', html: fmt(n).replace(/\d/g, (c, off) => { const idx = fmt(n).slice(0, off).replace(/,/g, '').length; return idx === i ? `<u>${c}</u>` : c; }) }) : placeChart(n, { hi: i });
        b.append(vis, answerBox(ctx, v, { hint: `${d} อยู่ใน${pn} มีค่า ${d} ${pn.replace('หลัก', '')} = ${fmt(v)}` }));
      } };
  },
  /* which place is digit d in */
  digitPlace({ n, i }) {
    ({ n, i } = uniqPick(n, i)); const s = String(n), d = s[i];
    const right = placeOf(n, i), opts = shuffle([right, ...shuffle(PLACE.slice(6 - s.length).filter(x => x !== right)).slice(0, 2)]);
    return { prompt: `ใน <span class="hl">${fmt(n)}</span> เลข ${d} อยู่ในหลักใด?`, say: `เลข ${WORD[d]} อยู่ในหลักใด`,
      mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, fmt(n)), choices(ctx, opts.map(x => ({ value: x, label: x })), right, { hint: 'นับจากขวา: หน่วย สิบ ร้อย พัน หมื่น' }))); txtOpts(b); } };
  },
  /* expanded form with one missing part */
  expanded5({ n, miss }) {
    const s = String(n), parts = s.split('').map((_, i) => valOf(n, i)).filter(v => v > 0);
    const mi = miss ?? rnd(0, parts.length - 1), t = [fmt(n), '=']; parts.forEach((p, i) => { if (i) t.push('+'); t.push(i === mi ? '?' : fmt(p)); });
    return { prompt: 'เขียนในรูปกระจาย: เติมจำนวนที่หายไป', say: `เขียน ${thaiWords(n)} ในรูปกระจาย`,
      mount(b, ctx) { const e = eqRow(t, { sm: true }); b.append(h('div', { class: 'colstack' }, placeChart(n, { values: true }), e), answerBox(ctx, parts[mi], { hint: 'รูปกระจาย = ค่าของเลขโดดในแต่ละหลักบวกกัน' })); ctx.onRight = () => e.fill(fmt(parts[mi])); } };
  },
  pickExpanded5({ n }) {
    const s = String(n), vals = s.split('').map((_, i) => valOf(n, i)).filter(v => v), right = vals.map(fmt).join(' + ');
    const shift = vals.map(v => fmt(v >= 10 ? v / 10 : v)).join(' + '), digitsOnly = s.split('').filter(d => d !== '0').join(' + ');
    const opts = shuffle([...new Set([right, shift, digitsOnly])]);
    return { prompt: `ข้อใดเป็นรูปกระจายของ <span class="hl">${fmt(n)}</span>?`, say: `ข้อใดเป็นรูปกระจายของ ${thaiWords(n)}`,
      mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, fmt(n)), choices(ctx, opts.map(o => ({ value: o, label: `<span class="num">${o}</span>` })), right, { hint: 'เลขโดดแต่ละตัวต้องเขียนเป็นค่าของหลักนั้น' }))); txtOpts(b); } };
  },
  /* expanded → number */
  fromExpanded({ n }) {
    const s = String(n), vals = s.split('').map((_, i) => valOf(n, i)).filter(v => v), t = []; vals.forEach((v, i) => { if (i) t.push('+'); t.push(fmt(v)); }); t.push('=', '?');
    return { prompt: 'รวมค่าของแต่ละหลัก ได้จำนวนใด?', say: 'รวมค่าของแต่ละหลัก ได้จำนวนใด',
      mount(b, ctx) { const e = eqRow(t, { sm: true }); b.append(e, answerBox(ctx, n, { hint: 'เขียนเลขโดดของแต่ละหลักเรียงกัน หลักที่ไม่มีให้เขียน 0' })); ctx.onRight = () => e.fill(fmt(n)); } };
  },
  /* compare: either side may be an expanded sum practice */
  compare5({ a, b: bb, ea, eb, eq = true }) {
    const rel = a > bb ? '>' : a < bb ? '<' : '=', side = (v, e) => e ? e : fmt(v), sy = eq ? ['>', '<', '='] : ['>', '<'];
    return { prompt: `เลือกเครื่องหมาย ${sy.map(x => x.replace('>', '&gt;').replace('<', '&lt;')).join(' ')} เติมในช่องว่าง`, say: 'เลือกเครื่องหมายเติมในช่องว่าง',
      mount(b, ctx) {
        const e = h('div', { class: 'cmp5' }, h('span', { class: 'side num' + (ea ? ' ex' : '') }, side(a, ea)), h('span', { class: 'eqb' }, '?'), h('span', { class: 'side num' + (eb ? ' ex' : '') }, side(bb, eb)));
        b.append(h('div', { class: 'colstack' }, e,
          h('div', { class: 'legend' }, h('span', null, h('b', null, '>'), ' มากกว่า'), h('span', null, h('b', null, '<'), ' น้อยกว่า'), eq ? h('span', null, h('b', null, '='), ' เท่ากับ') : null),
          choices(ctx, sy.map(x => ({ value: x, label: `<span class="num" style="font-size:1.3em">${x.replace('>', '&gt;').replace('<', '&lt;')}</span>` })), rel, { onRight: o => { const q = e.querySelector('.eqb'); q.textContent = o.value; q.classList.add('filled'); }, hint: ea || eb ? 'รวมรูปกระจายให้เป็นจำนวนก่อน แล้วค่อยเทียบ' : 'จำนวนหลักไม่เท่ากัน ดูว่าจำนวนไหนมีหลักมากกว่า ถ้าเท่ากัน เทียบจากหลักซ้ายสุดทีละหลัก' })));
      } };
  },
  /* practice: a number that fits between two neighbours in order */
  between({ lo, hi }) {
    const right = rnd(lo + 1, hi - 1), wrong = [rnd(Math.max(1, lo - 4000), lo - 1), rnd(hi + 1, Math.min(100000, hi + 4000))];
    const opts = shuffle([right, ...wrong]);
    return { prompt: `จำนวนใดอยู่<span class="hl">ระหว่าง</span> ${fmt(lo)} กับ ${fmt(hi)}?`, say: `จำนวนใดอยู่ระหว่าง ${thaiWords(lo)} กับ ${thaiWords(hi)}`,
      mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'nstrip' }, h('div', { class: 'ns' }, fmt(lo)), h('div', { class: 'ns blank' }, '?'), h('div', { class: 'ns' }, fmt(hi))), choices(ctx, opts.map(v => ({ value: v, label: fmt(v) })), right, { hint: `ต้องมากกว่า ${fmt(lo)} และน้อยกว่า ${fmt(hi)}` }))); } };
  },
  /* practice-19: patterns with any equal step, values given exactly */
  seqFill({ vals, blank, step }) {
    step = step ?? vals[1] - vals[0];
    return { prompt: blank === vals.length - 1 ? 'จำนวนถัดไปในแบบรูปคือจำนวนใด?' : 'เติมจำนวนที่หายไปในแบบรูป', say: 'เติมจำนวนที่หายไปในแบบรูป',
      mount(b, ctx) { b.append(numStrip(vals, [blank]), answerBox(ctx, vals[blank], { hint: `ลองลบจำนวนที่อยู่ติดกันดู แบบรูปนี้${step > 0 ? 'เพิ่มขึ้น' : 'ลดลง'}ทีละ ${Math.abs(step)}` })); } };
  },
  seqRule({ vals }) {
    const step = vals[1] - vals[0], m = Math.abs(step), right = (step > 0 ? 'เพิ่มขึ้นทีละ ' : 'ลดลงทีละ ') + fmt(m);
    const opts = shuffle([right, (step > 0 ? 'ลดลงทีละ ' : 'เพิ่มขึ้นทีละ ') + fmt(m), (step > 0 ? 'เพิ่มขึ้นทีละ ' : 'ลดลงทีละ ') + fmt(m === 1 ? 2 : m + pick([1, -1]) * (m > 10 ? 10 : 1))]);
    return { prompt: 'แบบรูปนี้เป็นอย่างไร?', say: 'แบบรูปนี้เป็นอย่างไร',
      mount(b, ctx) { b.append(h('div', { class: 'colstack' }, numStrip(vals), choices(ctx, opts.map(o => ({ value: o, label: o })), right, { hint: 'ลบจำนวนที่อยู่ติดกันดูว่าเพิ่มขึ้นหรือลดลงเท่าไร' }))); txtOpts(b); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 4 QUESTION TYPES — numbers 11 to 20
   ========================================================= */
Object.assign(Q, {
  /* objects laid out as a row of ten + the rest (count on from 10) */
  count20({ n, item = anyItem(), pen }) {
    return { prompt: `มี${item.n}กี่${item.c}? <small>(แถวบนมี 10 แล้วนับต่อ)</small>`, say: `มี${item.n}กี่${item.c}`,
      mount(b, ctx) { const sz = 'clamp(30px,4.2vw,48px)', vis = h('div', { class: 'rows20' }, objRow(item.e, 10, { size: sz, pop: true }), objRow(item.e, n - 10, { size: sz, pop: true, delay0: .9 })); makeCountable(vis);
        b.append(vis, answerBox(ctx, n, { preferPen: pen, hint: `แถวบนมี 10 นับต่อ: ${range(11, 13).map(k => WORD[k]).join(' ')} …` })); } };
  },
  frames20({ n, pen }) {
    return { prompt: 'กรอบสิบแสดงจำนวนเท่าไร?', say: 'กรอบสิบแสดงจำนวนเท่าไร',
      mount(b, ctx) { b.append(twoFrames(n, { pop: true }), answerBox(ctx, n, { preferPen: pen, hint: `กรอบแรกเต็มคือ 10 แล้วนับต่อในกรอบที่สองอีก ${n - 10}` })); } };
  },
  /* practice: put exactly n hearts in the frames */
  fillFrames({ n }) {
    return { prompt: `แตะช่องวางหัวใจ <span class="hl">${n}</span> ดวง`, say: `แตะช่องวางหัวใจ ${WORD[n]} ดวง`,
      mount(b, ctx) { const cnt = h('div', { class: 'bignum sm' }, 0), fb = frameBuilder(0, { icon: true, onChange: v => { cnt.textContent = v; } });
        b.append(h('div', { class: 'colstack' }, fb, cnt, checkButton('วางเสร็จแล้ว', () => { const c = fb.value(); ctx.check(c === n, c > n ? `เกินไป ${c - n} ดวง แตะช่องที่มีหัวใจเพื่อเอาออก` : `ยังขาดอีก ${n - c} ดวง เติมให้เต็มกรอบแรกก่อน แล้วต่อกรอบที่สอง`); }))); } };
  },
  matchFrames({ nums }) {
    return { prompt: 'แตะ 2 ฝั่ง (หรือลากเส้น) จับคู่กรอบสิบกับจำนวน',
      mount(b, ctx) { b.append(matchBoard(ctx, nums.map(n => ({ key: n, node: twoFrames(n, { w: 'clamp(96px,11vw,130px)' }) })), shuffle(nums).map(n => ({ key: n, label: String(n) })), { hint: 'กรอบแรกเต็มคือ 10 แล้วนับต่อ' })); } };
  },
  /* expanded form 1x = 10 + x */
  expand20({ n, miss = 'u' }) {
    const u = n - 10, t = miss === 'n' ? ['?', '=', 10, '+', u] : miss === 't' ? [n, '=', '?', '+', u] : [n, '=', 10, '+', '?'], ans = miss === 'n' ? n : miss === 't' ? 10 : u;
    return { prompt: 'เขียนในรูปกระจาย: เติมจำนวนที่หายไป', say: `เขียน ${WORD[n]} ในรูปกระจาย`,
      mount(b, ctx) { const e = eqRow(t); b.append(h('div', { class: 'colstack' }, sticks(n, { labels: true }), e), answerBox(ctx, ans, { hint: `${n} คือ 1 มัด (สิบ) กับอีก ${u} อัน เขียนเป็น 10 + ${u}` })); ctx.onRight = () => e.fill(ans); } };
  },
  pickExpand20({ n }) {
    const u = n - 10, right = `10 + ${u}`, opts = shuffle([...new Set([right, `1 + ${u}`, `10 + ${u === 10 ? 9 : u + 1}`])]);
    return { prompt: `ข้อใดเป็นรูปกระจายของ <span class="hl">${n}</span>?`, say: `ข้อใดเป็นรูปกระจายของ ${WORD[n]}`,
      mount(b, ctx) { b.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, n), choices(ctx, opts.map(o => ({ value: o, label: `<span class="num">${o}</span>` })), right, { hint: 'เลขหลักสิบ 1 หมายถึง 10' }))); } };
  },
  /* practice: compare with the number line */
  lineCompare({ a, b: bb }) {
    const rel = a > bb ? 'มากกว่า' : a < bb ? 'น้อยกว่า' : 'เท่ากับ';
    return { prompt: 'ดูเส้นจำนวน แล้วเลือกคำเติมในช่องว่าง', say: `${WORD[a]} กับ ${WORD[bb]} ดูเส้นจำนวน แล้วเลือกคำ`,
      mount(b, ctx) { const blank = h('span', { class: 'blank' }, '?');
        b.append(h('div', { class: 'colstack' }, numberLine(0, 20, { hi: [a], hi2: [bb] }), h('div', { class: 'sentence' }, h('span', { class: 'bignum sm' }, a), blank, h('span', { class: 'bignum sm' }, bb)),
          choices(ctx, ['น้อยกว่า', 'มากกว่า', 'เท่ากับ'].map(w => ({ value: w, label: w })), rel, { onRight: o => { blank.textContent = o.value; blank.classList.add('filled'); }, hint: 'บนเส้นจำนวน จำนวนที่อยู่ทางขวามีค่ามากกว่า' }))); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 5 QUESTION TYPES — + and − within 20
   ========================================================= */
const opWord = op => op === '+' ? 'บวก' : 'ลบ';
Object.assign(Q, {
  /* count on: the bigger number is a card, tap the counters to keep counting */
  countOnAdd({ a, b }) {
    const big = Math.max(a, b), small = Math.min(a, b);
    return { prompt: `หาผลบวก <span class="hl">${a} + ${b}</span> <small>(เริ่มที่ ${big} แตะนับต่อ)</small>`, say: `${WORD[a]} บวก ${WORD[b]} เริ่มที่ ${WORD[big]} แล้วแตะนับต่อ`,
      mount(bd, ctx) { const e = eqRow([a, '+', b, '=', '?']), cnt = h('div', { class: 'conrow' }, h('span', { class: 'concard num' }, big));
        for (let k = 1; k <= small; k++) { const c = h('button', { class: 'counter tap b ia', 'aria-label': 'นับต่อ' }); c.onclick = ev => { ev.stopPropagation(); if (c.dataset.c) return; const n = big + cnt.querySelectorAll('[data-c]').length + 1; c.dataset.c = n; c.textContent = n; c.classList.add('counted'); sfx.pop(n); say(WORD[n], true); }; cnt.append(c); }
        bd.append(h('div', { class: 'colstack' }, e, cnt), answerBox(ctx, a + b, { hint: `เริ่มที่ ${big} แล้วนับต่ออีก ${small}: ${range(big + 1, Math.min(big + 3, big + small)).join(', ')} …` })); ctx.onRight = () => e.fill(a + b); } };
  },
  /* tap the answer on the 0–20 number line */
  lineCalc({ a, b, op = '+' }) { /* v167: กระโดดเองทีละช่อง (เดิมแตะคำตอบเลย) */
    return { prompt: `<span class="hl">${a} ${op === '+' ? '+' : '−'} ${b}</span> เริ่มที่ ${a} แล้วแตะกระโดดไปทาง${op === '+' ? 'ขวา' : 'ซ้าย'}ทีละ 1 ช่อง`, say: `${WORD[a]} ${opWord(op)} ${WORD[b]} เริ่มที่ ${WORD[a]} แล้วแตะกระโดดทีละหนึ่งช่อง`,
      mount(bd, ctx) { bd.append(hopLine(ctx, a, b, op === '+' ? '+' : '−', 0, 20)); } };
  },
  /* practice: doubles */
  doubles({ n, item = pick(ITEMS.fruits) }) {
    return { prompt: `${item.n}แถวละ ${n} ${item.c} 2 แถว รวมเป็นเท่าไร?`, say: `${WORD[n]} บวก ${WORD[n]} เท่ากับเท่าไร`,
      mount(bd, ctx) { const sz = 'clamp(28px,3.8vw,44px)', e = eqRow([n, '+', n, '=', '?']);
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'rows20' }, objRow(item.e, n, { size: sz, pop: true }), objRow(item.e, n, { size: sz, pop: true, delay0: .5 })), e), answerBox(ctx, n + n, { hint: `${n} + ${n} คือนับ ${n} สองครั้ง` })); ctx.onRight = () => e.fill(n + n); } };
  },
  /* practice: make ten — ask the leftover part or the final sum */
  makeTen20({ a, b }) { /* v167 (ผู้ใช้ขอ: ทำให้ครบสิบเองทีละขั้น — เดิมคำอธิบายบอกคำตอบไว้แล้ว) ① ใหญ่ + □ = 10 ② แบ่งตัวเล็ก ③ 10 + ที่เหลือ */
    const big = Math.max(a, b), small = Math.min(a, b), need = 10 - big, rest = small - need;
    return { prompt: `หาผลบวก <span class="hl">${a} + ${b}</span> โดยทำให้ครบสิบ`, say: `${WORD[a]} บวก ${WORD[b]} โดยทำให้ครบสิบ`, __sig: `mk10 ${a}+${b}`,
      mount(bd, ctx) { const w = 'clamp(150px,19vw,220px)', fr = h('div', { class: 'tf2' }), lab = h('div', { class: 'p4steplab' }), slot = h('div', { class: 'colstack' }), e = eqRow([a, '+', b, '=', '?'], { sm: true }); let st = 0;
        const draw = () => { fr.innerHTML = ''; fr.append(st === 0 ? tenFrame(big, { w }) : tenFrame(10, { w, color: i => i < big ? '' : 'b' }), tenFrame(st === 0 ? small : rest, { w, color: () => 'b' })); };
        const sub = f => ({ check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(st + 3); f(); }, say: ctx.say });
        const run = () => { slot.innerHTML = ''; draw();
          if (st === 0) { lab.innerHTML = `① ${big} ต้องการอีกเท่าไรจึงครบ 10: <b>${big} + ☐ = 10</b>`; slot.append(answerBox(sub(() => { st = 1; run(); }), need, { hint: `นับช่องว่างในกรอบแรก` })); }
          else if (st === 1) { lab.innerHTML = `② แบ่ง ${small} ให้ไปเติม ${need} แล้ว ${small} เหลือเท่าไร: <b>${small} = ${need} + ☐</b>`; slot.append(answerBox(sub(() => { st = 2; run(); }), rest, { hint: `${small} − ${need}` })); }
          else { lab.innerHTML = `③ ครบสิบแล้ว: <b>10 + ${rest} = ☐</b>`; slot.append(answerBox(ctx, a + b, { hint: `10 กับอีก ${rest}` })); } };
        ctx.onRight = () => e.fill(a + b); run(); bd.append(h('div', { class: 'colstack' }, e, fr, lab, slot)); } };
  },
  /* three numbers, left to right */
  three({ nums, op = '+' }) {
    const [a, b, c] = nums, o = op === '+' ? '+' : '−', mid = op === '+' ? a + b : a - b, ans = op === '+' ? mid + c : mid - c;
    return { prompt: `หา${op === '+' ? 'ผลบวก' : 'ผลลบ'}ของจำนวนสามจำนวน`, say: `${WORD[a]} ${opWord(op)} ${WORD[b]} ${opWord(op)} ${WORD[c]} เท่ากับเท่าไร`,
      mount(bd, ctx) { const e = eqRow([a, o, b, o, c, '=', '?']);
        bd.append(h('div', { class: 'colstack' }, e, h('div', { class: 'cap' }, 'ทำทีละขั้น: สองจำนวนแรกก่อน แล้วค่อยจำนวนที่สาม')), answerBox(ctx, ans, { hint: `${a} ${o} ${b} = ${mid} แล้ว ${mid} ${o} ${c} = ?` })); ctx.onRight = () => e.fill(ans); } };
  },
  /* practice: subtract by counting on from the smaller number */
  subCountOn({ a, b }) {
    return { prompt: `${a} − ${b} = ? <small>นับต่อจาก ${b} ไปถึง ${a} ได้กี่ครั้ง</small>`, say: `${WORD[a]} ลบ ${WORD[b]} นับต่อจาก ${WORD[b]} ไปถึง ${WORD[a]} ได้กี่ครั้ง`,
      mount(bd, ctx) { const nl = numberLine(Math.max(0, b - 1), Math.min(20, a + 1), { hi: [b], hi2: range(b + 1, a), compact: true }), e = eqRow([a, '−', b, '=', '?'], { sm: true });
        bd.append(h('div', { class: 'colstack' }, nl, e), answerBox(ctx, a - b, { hint: `นับ ${b + 1}, ${b + 2}, … จนถึง ${a} แล้วนับว่ากี่ครั้ง` })); ctx.onRight = () => e.fill(a - b); } };
  },
  /* practice: unknown in any slot */
  unknown20({ t }) {
    const [x, op, y, , z] = t, ans = x === '?' ? (op === '+' ? z - y : z + y) : y === '?' ? (op === '+' ? z - x : x - z) : z;
    const tok = t.map(v => v === '-' ? '−' : v);
    return { prompt: 'หาจำนวนที่แทนด้วย ☐', say: 'หาจำนวนที่แทนด้วยช่องว่าง',
      mount(bd, ctx) { const e = eqRow(tok); const whole = op === '+' ? z : (x === '?' ? '?' : x), pa = op === '+' ? x : y, pb = op === '+' ? y : z;
        bd.append(h('div', { class: 'colstack' }, e, partWhole(whole === '?' ? ans : whole, pa === '?' ? ans : pa, pb === '?' ? ans : pb, { q: whole === '?' ? 'whole' : pa === '?' ? 'a' : 'b', w: 'clamp(160px,20vw,210px)' })),
          answerBox(ctx, ans, { hint: op === '+' ? 'ส่วนรวม − ส่วนย่อยที่รู้ = ส่วนย่อยที่หายไป' : x === '?' ? 'ตัวตั้ง = ผลลบ + ตัวลบ' : 'ตัวลบ = ตัวตั้ง − ผลลบ' })); ctx.onRight = () => e.fill(ans); } };
  },
  /* word problem: choose the sentence, then answer */
  story20({ text, a, b, op, unit }) {
    const o = op === '+' ? '+' : '−', ans = op === '+' ? a + b : a - b, other = op === '+' ? '−' : '+';
    const opts = shuffle([[a, o, b], [a, other, b], [a, o, b === 1 ? 2 : b - 1]].filter(x => !(x[1] === '−' && x[0] < x[2]))).map(x => x.join(' '));
    return { prompt: text, say: text,
      mount(bd, ctx) { const step2 = h('div', { class: 'colstack', style: { display: 'none' } }), e = eqRow([a, o, b, '=', '?']);
        const ch = choices({ check: (ok, hint) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; sfx.pop(5); ctx.say('ใช่แล้ว! หาคำตอบเลย'); } else ctx.check(false, hint); } }, opts.map(s => { const p = s.split(' '); return { value: s, node: eqRow([p[0], p[1], p[2], '=', '?'], { sm: true }) }; }), [a, o, b].join(' '), { hint: op === '+' ? 'โจทย์ถามว่ารวมกันหรือเพิ่มขึ้น ใช้การบวก' : 'โจทย์ถามว่าเหลือหรือมากกว่ากี่ ใช้การลบ' });
        step2.append(e, h('div', { class: 'rowstack' }, answerBox(ctx, ans, { hint: op === '+' ? `เริ่มที่ ${Math.max(a, b)} แล้วนับต่อ` : `นับต่อจาก ${b} ไปถึง ${a}` }), h('div', { class: 'cap', style: { fontSize: '20px' } }, unit)));
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'cap' }, '① เลือกประโยคสัญลักษณ์'), ch, step2)); ctx.onRight = () => e.fill(ans); } };
  },
  /* practice: which story fits the sentence */
  pickStory({ a, b, op, stories }) {
    const o = op === '+' ? '+' : '−';
    return { prompt: `โจทย์ข้อใดตรงกับประโยคสัญลักษณ์ <span class="hl">${a} ${o} ${b} = ☐</span>`, say: `โจทย์ข้อใดตรงกับ ${WORD[a]} ${opWord(op)} ${WORD[b]}`,
      mount(bd, ctx) { bd.append(choices(ctx, shuffle(stories.map((s, i) => ({ value: i, label: s }))), 0, { hint: op === '+' ? 'หาโจทย์ที่ถามว่ารวมกันหรือเพิ่มขึ้น' : 'หาโจทย์ที่ถามว่าเหลือเท่าไรหรือมากกว่ากี่' })); txtOpts(bd); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 6 QUESTION TYPES — picture graphs, tally marks
   chart = { title, data: [{ label, e, n }], unit, unitName, orient, keyE }
   ========================================================= */
const chartNode = (c, o = {}) => c.tally ? h('table', { class: 'tbl tallyt' + (o.hl ? '' : '') }, h('tr', null, h('th', null, c.colName || 'รายการ'), h('th', null, 'รอยขีด')), c.data.map((d, i) => h('tr', { class: o.hl && o.hl.includes(i) ? 'hi' : '' }, h('td', null, d.e ? h('span', { class: 'tl-lab' }, h('span', { class: 'pc-ic' }, art(d.e)), d.label) : d.label), h('td', null, tally(d.n))))) : pictoChart(c.data, { title: c.title, unit: c.unit, unitName: c.unitName, orient: c.orient, keyE: c.keyE, sm: o.sm ?? c.data.length > 5, hl: o.hl, ...o });
const uniqExt = (c, f) => { const v = f(...c.data.map(d => d.n)); return c.data.filter(d => d.n === v).length === 1 ? c.data.find(d => d.n === v) : null; };
const labelChoices = (b, ctx, c, right, hint, pool) => { b.append(choices(ctx, (pool || c.data).map(d => ({ value: d.label, label: d.label })), right, { hint })); b.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); };
Object.assign(Q, {
  chartAsk({ chart: c, ask, a = 0, b = 1, k = 3 }) {
    if (ask === 'diff' && c.data[a].n < c.data[b].n) [a, b] = [b, a]; /* v134: “A มากกว่า B กี่ชิ้น” ต้องให้ A มากกว่าจริง (เดิมได้คำตอบติดลบ −2 ซึ่งกดตอบไม่ได้) */
    if (ask === 'diff' && c.data[a].n === c.data[b].n) ask = 'total';
    let A = c.data[a]; const B = c.data[b], u = c.unit || 'ชิ้น';
    const P = {
      count: [`${A.label} มีกี่${u}?`, A.n, `นับรูปในแถว${A.label} 1 รูปแทน 1 ${u}`],
      total: [`${A.label}และ${B.label} รวมกันกี่${u}?`, A.n + B.n, `${A.n} + ${B.n}`],
      all: [`ทั้งหมดรวมกันกี่${u}?`, c.data.reduce((s, d) => s + d.n, 0), 'นับจำนวนในแต่ละแถว แล้วบวกกันทั้งหมด'],
      diff: [`${A.label} มากกว่า ${B.label} กี่${u}?`, A.n - B.n, `${A.n} − ${B.n}`],
      key: [`1 รูป แทนจำนวนกี่${u}?`, 1, 'ดูที่บรรทัด “กำหนดให้” ใต้แผนภูมิ']
    };
    if (P[ask]) { const [q, ans, hint] = P[ask];
      return { prompt: q, say: q, mount(bd, ctx) { bd.append(chartNode(c, { hl: ['count', 'total', 'diff'].includes(ask) ? (ask === 'count' ? [a] : [a, b]) : null }), answerBox(ctx, ans, { hint })); } }; }
    if (ask === 'most' || ask === 'least') { const r = uniqExt(c, ask === 'most' ? Math.max : Math.min), q = `ข้อใด${ask === 'most' ? 'มากที่สุด' : 'น้อยที่สุด'}?`;
      return { prompt: q, say: q, mount(bd, ctx) { bd.append(chartNode(c)); labelChoices(bd, ctx, c, r.label, ask === 'most' ? 'แถวที่มีรูปยาวที่สุด' : 'แถวที่มีรูปสั้นที่สุด'); } }; }
    if (ask === 'cmp') { const rel = A.n > B.n ? 'มากกว่า' : A.n < B.n ? 'น้อยกว่า' : 'เท่ากับ';
      return { prompt: `จำนวน${A.label} ... จำนวน${B.label}`, say: `จำนวน${A.label} กับจำนวน${B.label} เลือกคำ`, mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?');
        bd.append(h('div', { class: 'colstack' }, chartNode(c, { hl: [a, b] }), h('div', { class: 'sentence' }, h('span', { class: 'lab' }, A.label), blank, h('span', { class: 'lab' }, B.label)), choices(ctx, ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'].map(w => ({ value: w, label: w })), rel, { onRight: o => { blank.textContent = o.value; blank.classList.add('filled'); }, hint: 'เทียบความยาวของสองแถว' }))); } }; }
    if (ask === 'equal') { // data may be shuffled (mixChart) → pick a bigger row and derive how many to add
      if (!c.data.some((d, i) => i !== a && d.n === A.n + k)) { const bigger = c.data.map((d, i) => [d, i]).filter(([d, i]) => i !== a && d.n > A.n);
        if (bigger.length) k = pick(bigger)[0].n - A.n; else { const lo = c.data.map((d, i) => [d, i]).filter(([d]) => d.n < A.n).sort((x, y) => x[0].n - y[0].n)[0]; a = lo[1]; A = c.data[a]; k = c.data.reduce((m, d) => Math.max(m, d.n), 0) - A.n; } }
      const tgt = A.n + k, r = c.data.find((d, i) => i !== a && d.n === tgt), q = `ถ้า${A.label}เพิ่มอีก ${k} ${u} จะเท่ากับข้อใด?`;
      return { prompt: q, say: q, mount(bd, ctx) { bd.append(chartNode(c, { hl: [a] })); labelChoices(bd, ctx, c, r.label, `${A.n} + ${k} = ${tgt} หาแถวที่มี ${tgt}`, c.data.filter((d, i) => i !== a)); } }; }
    if (ask === 'same') { const pair = c.data.filter(d => c.data.filter(x => x.n === d.n).length > 1), q = 'ข้อใดมีจำนวนเท่ากัน?';
      const right = pair.map(d => d.label).join(' กับ '), wrongs = shuffle(c.data.filter(d => !pair.includes(d))).slice(0, 2).map((d, i) => `${d.label} กับ ${pair[i % pair.length].label}`);
      return { prompt: q, say: q, mount(bd, ctx) { bd.append(chartNode(c)); bd.append(choices(ctx, shuffle([right, ...wrongs]).map(s => ({ value: s, label: s })), right, { hint: 'หาสองแถวที่มีรูปยาวเท่ากัน' })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); } }; }
    if (ask === 'order') { const sorted = [...c.data].sort((x, y) => y.n - x.n).map(d => d.label);
      return { prompt: 'เรียงจาก<span class="hl">มากไปน้อย</span> <small>(แตะการ์ดตามลำดับ)</small>', say: 'เรียงจากมากไปน้อย', mount(bd, ctx) {
        const nOf = l => c.data.find(d => d.label === l).n, sh = shuffle(sorted.slice()); // v119: เส้นทางคาราวาน
        const board = cvnBoard({ cards: sh, horiz: true, fits: (k, i) => nOf(sh[k]) === nOf(sorted[i]), onDone: ok => ok ? ctx.check(true) : ctx.check(false, 'หาแถวที่มีรูปมากที่สุดที่ยังเหลือ วางก่อน') });
        ctx.onRight = () => board.reveal();
        bd.append(h('div', { class: 'colstack' }, chartNode(c, { sm: true }), h('div', { class: 'dir' }, 'มาก', h('span', { class: 'ar' }), 'น้อย'), board)); } }; }
    if (ask === 'title') { const others = shuffle(CHART_TITLES.filter(t => t !== c.title)).slice(0, 2), q = 'แผนภูมิรูปภาพนี้แสดงอะไร?';
      return { prompt: q, say: q, mount(bd, ctx) { const node = chartNode(c); node.querySelector('.pc-title')?.remove(); bd.append(node, choices(ctx, shuffle([c.title, ...others]).map(t => ({ value: t, label: t })), c.title, { hint: 'ดูชื่อของแต่ละแถวและรูปที่ใช้' })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); bd.querySelector('.opts')?.classList.add('stack'); } }; }
  },
  /* build a picture graph from scattered pictures or from a tally table */
  buildChart({ chart: c, from = 'mix' }) {
    return { prompt: from === 'mix' ? 'นับรูปแต่ละชนิด แล้วระบายแผนภูมิรูปภาพให้ถูกต้อง' : 'ดูรอยขีด แล้วระบายแผนภูมิรูปภาพให้ถูกต้อง', say: 'นับแล้วระบายแผนภูมิรูปภาพให้ถูกต้อง',
      mount(bd, ctx) {
        const src = from === 'mix' ? mixField(c.data, { tap: true }) : h('table', { class: 'tbl tallyt' }, c.data.map(d => h('tr', null, h('td', null, d.label), h('td', null, tally(d.n)))));
        const pb = pictoBuilder(c.data, { title: c.title, orient: c.orient, max: Math.max(...c.data.map(d => d.n)) + (from === 'mix' ? 1 : 2) });
        bd.append(h('div', { class: 'colstack' }, from === 'mix' ? h('div', { class: 'cap' }, 'แตะรูปที่นับแล้วเพื่อทำเครื่องหมาย') : null, src), h('div', { class: 'colstack' }, pb, checkButton('ตรวจคำตอบ', () => { const v = pb.values(), bad = c.data.findIndex((d, i) => v[i] !== d.n); ctx.check(bad < 0, bad < 0 ? '' : `${c.data[bad].label} ยังไม่ถูก ลองนับใหม่ (${v[bad] > c.data[bad].n ? 'ระบายเกิน' : 'ยังขาด'})`); })));
      } };
  },
  tallyRead({ n, label }) {
    return { prompt: `รอยขีดนี้แสดงจำนวนเท่าไร?${label ? ` <small>(${label})</small>` : ''}`, say: 'รอยขีดนี้แสดงจำนวนเท่าไร',
      mount(bd, ctx) { bd.append(h('div', { class: 'tallybig' }, tally(n, { scale: 1.8 })), answerBox(ctx, n, { hint: 'กลุ่มที่มีเส้นขีดทับ 1 กลุ่ม = 5 นับทีละ 5 แล้วนับต่อ' })); } };
  },
  tallyMake({ n, label }) {
    return { prompt: `เขียนรอยขีดแสดงจำนวน <span class="hl">${n}</span>${label ? ` <small>(${label})</small>` : ''}`, say: `เขียนรอยขีดแสดงจำนวน ${WORD[n]}`,
      mount(bd, ctx) { const tb = tallyBuilder(); bd.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, n), tb, checkButton('ตรวจคำตอบ', () => { const v = tb.value(); ctx.check(v === n, v > n ? `เกินไป ${v - n} ขีด` : `ยังขาดอีก ${n - v} ขีด · ขีดที่ 5 ขีดทับเป็นกลุ่ม`); }))); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 7 QUESTION TYPES — weight
   item = { e, name }
   ========================================================= */
const W_WORDS = ['หนักกว่า', 'เบากว่า', 'หนักเท่ากับ'];
const wordChoices = (ctx, right, blank, hint, words = W_WORDS) => choices(ctx, words.map(w => ({ value: w, label: w })), right, { hint, onRight: o => { blank.textContent = o.value; blank.classList.add('filled'); } });
Object.assign(Q, {
  /* practice: read a pan balance */
  balanceCmp({ a, b, rel }) { // rel: 1 = a heavier, -1 = a lighter, 0 = equal
    const right = rel > 0 ? 'หนักกว่า' : rel < 0 ? 'เบากว่า' : 'หนักเท่ากับ';
    return { prompt: `${a.name} ... ${b.name} <small>(ดูเครื่องชั่งสองแขน)</small>`, say: `${a.name} กับ ${b.name} ดูเครื่องชั่ง แล้วเลือกคำ`,
      mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?');
        bd.append(h('div', { class: 'colstack' }, balance({ e: a.e, n: 3 }, { e: b.e, n: 3 }, { wl: rel > 0 ? 2 : rel < 0 ? 0 : 1, wr: 1, labels: [a.name, b.name] }), h('div', { class: 'sentence' }, h('span', { class: 'lab' }, a.name), blank, h('span', { class: 'lab' }, b.name)), wordChoices(ctx, right, blank, 'ข้างที่ต่ำลงหนักกว่า ข้างที่ยกขึ้นเบากว่า ถ้าเสมอกันหนักเท่ากัน'))); } };
  },
  /* practice: non-standard unit (marbles) */
  marbles({ a, n }) {
    return { prompt: `${a.name}หนักเท่ากับลูกแก้วกี่ลูก?`, say: `${a.name} หนักเท่ากับลูกแก้วกี่ลูก`,
      mount(bd, ctx) { bd.append(balance({ e: a.e, n: 2 }, { e: 'marble', n }, { wl: 1, wr: 1, labels: [a.name, `ลูกแก้ว`] }), h('div', { class: 'rowstack' }, answerBox(ctx, n, { hint: 'เครื่องชั่งเสมอกัน นับลูกแก้วทางขวา' }), h('div', { class: 'cap', style: { fontSize: '20px' } }, 'ลูก'))); } };
  },
  /* practice: estimate (heavier / lighter than 1 kg) */
  estimate1kg({ a, heavy }) {
    const right = heavy ? 'หนักกว่า 1 กิโลกรัม' : 'เบากว่า 1 กิโลกรัม';
    return { prompt: `คาดคะเน: ${a.name}หนักกว่าหรือเบากว่า 1 กิโลกรัม?`, say: `คาดคะเน ${a.name} หนักกว่า หรือเบากว่า หนึ่งกิโลกรัม`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, h('span', { class: 'est-it' }, art(a.e), h('b', null, a.name)), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'กับ'), h('span', { class: 'est-it' }, art('kg1'), h('b', null, 'ลูกตุ้ม 1 กิโลกรัม'))),
        choices(ctx, ['หนักกว่า 1 กิโลกรัม', 'เบากว่า 1 กิโลกรัม'].map(w => ({ value: w, label: w })), right, { hint: 'ลองนึกว่าถือของสองอย่างไว้ในมือ ข้างไหนหนักมือกว่า' }))); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); } };
  },
  /* practice: read a spring scale */
  readScale({ a, v, unit = 'kg', col }) {
    const u = unit === 'kd' ? 'ขีด' : 'กิโลกรัม';
    return { prompt: `${a.name}หนักกี่${u}?`, say: `${a.name} หนักกี่${u}`,
      mount(bd, ctx) { bd.append(springScale({ v, unit, e: a.e, n: 3, col: col || pick(['sky', 'mint', 'coral', 'lilac', 'yellow']), label: a.name }), h('div', { class: 'rowstack' }, answerBox(ctx, v, { hint: unit === 'kd' ? 'ตัวเลขบนหน้าปัดบอกกิโลกรัม ระหว่างตัวเลขมี 10 ขีด นับทีละขีดจาก 0' : 'ดูว่าเข็มชี้ที่ตัวเลขใด' }), h('div', { class: 'cap', style: { fontSize: '20px' } }, u))); } };
  },
  /* practice: set the needle */
  setScale({ a, v, unit = 'kg' }) {
    const u = unit === 'kd' ? 'ขีด' : 'กิโลกรัม';
    return { prompt: `${a.name}หนัก <span class="hl">${v} ${u}</span> หมุนเข็มให้ชี้ถูกตำแหน่ง`, say: `${a.name} หนัก ${WORD[v] || v} ${u} หมุนเข็มให้ชี้ถูกตำแหน่ง`,
      mount(bd, ctx) { let cur = 0; const sc = springScale({ v: 0, unit, e: a.e, n: 3, interactive: true, col: 'mint', onSet: x => { cur = x; read.textContent = `${x} ${u}`; } }), read = h('b', { class: 'num ss-read' }, `0 ${u}`);
        bd.append(h('div', { class: 'colstack' }, sc, h('div', { class: 'cap' }, 'แตะหรือลากบนหน้าปัดเพื่อหมุนเข็ม'), read, checkButton('ตรวจคำตอบ', () => ctx.check(cur === v, cur > v ? `เกินไป ${cur - v} ${u}` : `ยังขาดอีก ${v - cur} ${u}`)))); } };
  },
  /* practice: compare two scales; ขีด version also asks "by how much" */
  scalesCmp({ a, b, va, vb, unit = 'kg', diff = false }) {
    const u = unit === 'kd' ? 'ขีด' : 'กิโลกรัม', right = va > vb ? 'หนักกว่า' : va < vb ? 'เบากว่า' : 'หนักเท่ากับ';
    return { prompt: `${a.name} ... ${b.name}${diff ? ' อยู่กี่' + u : ''}`, say: `${a.name} กับ ${b.name} เลือกคำ`,
      mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?'), step2 = h('div', { class: 'rowstack', style: { display: 'none' } });
        const scales = h('div', { class: 'rowstack' }, springScale({ v: va, unit, e: a.e, n: 2, sm: true, col: 'coral', label: `${a.name} ${va} ${u}` }), springScale({ v: vb, unit, e: b.e, n: 2, sm: true, col: 'sky', label: `${b.name} ${vb} ${u}` }));
        const sent = h('div', { class: 'sentence' }, h('span', { class: 'lab' }, a.name), blank, h('span', { class: 'lab' }, b.name));
        const ch = wordChoices(diff && va !== vb ? { check: (ok, hint) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; sfx.pop(4); ctx.say('ใช่แล้ว! แล้วต่างกันอยู่กี่' + u); } else ctx.check(false, hint); } } : ctx, right, blank, 'เข็มชี้ที่จำนวนมากกว่า = หนักกว่า', va === vb ? W_WORDS : W_WORDS);
        if (diff && va !== vb) step2.append(h('span', { class: 'cap', style: { fontSize: '20px' } }, 'อยู่'), answerBox(ctx, Math.abs(va - vb), { hint: `${Math.max(va, vb)} − ${Math.min(va, vb)}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, u));
        bd.append(h('div', { class: 'colstack' }, scales, sent, ch, step2)); } };
  },
  scalesExtreme({ items, unit = 'kg', which = 'max' }) {
    const u = unit === 'kd' ? 'ขีด' : 'กิโลกรัม', f = which === 'max' ? Math.max : Math.min, tv = f(...items.map(x => x.v)), right = items.find(x => x.v === tv).name, q = `สิ่งใด${which === 'max' ? 'หนักที่สุด' : 'เบาที่สุด'}?`;
    return { prompt: q, say: q, mount(bd, ctx) { const cols = ['coral', 'sky', 'mint', 'lilac'];
      const row = h('div', { class: 'rowstack' }, ...items.map((x, i) => { const sc = springScale({ v: x.v, unit, e: x.e, n: 2, sm: true, col: cols[i % 4], label: x.name }); sc.dataset.i = i; return sc; }));
      ixTapFig(row, ':scope > [data-i]', ctx, i => items[i].name === right, which === 'max' ? 'อ่านน้ำหนักทุกอัน แล้วหาจำนวนที่มากที่สุด' : 'อ่านน้ำหนักทุกอัน แล้วหาจำนวนที่น้อยที่สุด');
      bd.append(h('div', { class: 'colstack' }, row, h('div', { class: 'cap ixcap' }, 'แตะเครื่องชั่งของสิ่งที่ใช่'))); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 8 QUESTION TYPES — position & ordinal numbers
   ========================================================= */
const BUS_SVG = `<svg viewBox="0 0 120 90" aria-hidden="true"><ellipse cx="60" cy="86" rx="54" ry="3.5" fill="#2B2550" opacity=".12"/><path d="M8 72 V26 q0 -14 14 -14 h76 q14 0 14 14 v46 z" fill="url(#g-yellow)" stroke="${PAL.yellow[3]}" stroke-width="2.4" stroke-linejoin="round"/><rect x="16" y="22" width="88" height="24" rx="6" fill="#BFE3FA" stroke="${PAL.yellow[3]}" stroke-width="2"/><path d="M45 22 v24 M75 22 v24" stroke="${PAL.yellow[3]}" stroke-width="2"/><rect x="8" y="56" width="104" height="6" fill="${PAL.yellow[3]}" opacity=".5"/><circle cx="18" cy="64" r="4" fill="#FFF6D6"/><circle cx="102" cy="64" r="4" fill="#FFF6D6"/><circle cx="30" cy="76" r="9" fill="#2B2550"/><circle cx="90" cy="76" r="9" fill="#2B2550"/><circle cx="30" cy="76" r="3.5" fill="#C9C4DA"/><circle cx="90" cy="76" r="3.5" fill="#C9C4DA"/></svg>`;
const nameChoices = (bd, ctx, names, right, hint) => { bd.append(choices(ctx, names.map(n => ({ value: n, label: n })), right, { hint })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); };
const ordChoices = (bd, ctx, n, right, hint) => { bd.append(choices(ctx, range(1, n).map(k => ({ value: k, label: ORD(k) })), right, { hint })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); };
Object.assign(Q, {
  /* practice: who stands right / left / between / in the middle (viewer's left → right) */
  lineAsk({ names, ask, of, of2 }) {
    const i = names.indexOf(of), j = names.indexOf(of2);
    const P = { right: [`ใครยืนอยู่<span class="hl">ข้างขวา</span>ของ${of}?`, names[i + 1], 'ข้างขวา = มือขวาของเรา ดูคนที่อยู่ถัดไปทางขวามือ'],
      left: [`ใครยืนอยู่<span class="hl">ข้างซ้าย</span>ของ${of}?`, names[i - 1], 'ข้างซ้าย = มือซ้ายของเรา ดูคนที่อยู่ถัดไปทางซ้ายมือ'],
      between: [`ใครยืนอยู่<span class="hl">ระหว่าง</span>${of}กับ${of2}?`, names[(i + j) / 2], 'ระหว่าง = อยู่ตรงกลางของสองคนนี้'],
      middle: ['ใครยืนอยู่<span class="hl">ตรงกลาง</span>?', names[(names.length - 1) / 2], 'ตรงกลาง = มีคนข้างซ้ายและข้างขวาเท่ากัน'] }[ask];
    return { prompt: P[0], say: P[0].replace(/<[^>]+>/g, ''), mount(bd, ctx) { bd.append(lineup(names, { hl: [i, j].filter(x => x >= 0) })); nameChoices(bd, ctx, shuffle([P[1], ...shuffle(names.filter(n => n !== of && n !== of2 && n !== P[1])).slice(0, 2)]), P[1], P[2]); } };
  },
  /* practice: front / back / left / right in a 3×3 photo */
  gridAsk({ rows, ask, of }) {
    let r = 0, c = 0; rows.forEach((row, ri) => { const ci = row.indexOf(of); if (ci >= 0) { r = ri; c = ci; } });
    const at = (rr, cc) => rows[rr] && rows[rr][cc];
    const P = { front: ['ข้างหน้า', at(r + 1, c), 'ข้างหน้า = แถวที่อยู่ใกล้เรามากกว่า (แถวล่าง)'], back: ['ข้างหลัง', at(r - 1, c), 'ข้างหลัง = แถวที่อยู่ไกลกว่า (แถวบน)'], right: ['ข้างขวา', at(r, c + 1), 'ข้างขวา = ทางมือขวาของเรา'], left: ['ข้างซ้าย', at(r, c - 1), 'ข้างซ้าย = ทางมือซ้ายของเรา'] }[ask];
    const all = rows.flat(), q = `ใครยืนอยู่<span class="hl">${P[0]}</span>ของ${of}?`;
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { bd.append(kidGrid(rows, { hl: [of] })); nameChoices(bd, ctx, shuffle([P[1], ...shuffle(all.filter(n => n !== P[1] && n !== of)).slice(0, 2)]), P[1], P[2]); } };
  },
  /* practice: shelf — where is X / what is at (row, col) */
  shelfAsk({ rows, names, ask, r, c }) {
    const COL = ['ข้างซ้าย', 'ตรงกลาง', 'ข้างขวา'];
    if (ask === 'where') { const right = `ชั้นที่ ${r + 1} ${COL[c]}`, wrong = shuffle([[r, (c + 1) % 3], [(r + 1) % rows.length, c], [(r + rows.length - 1) % rows.length, (c + 2) % 3]]).slice(0, 2).map(([a, b]) => `ชั้นที่ ${a + 1} ${COL[b]}`);
      const q = `${names[rows[r][c]]}วางอยู่ชั้นใด ตำแหน่งใด?`;
      return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'shq' }, art(rows[r][c]), h('b', null, names[rows[r][c]])), shelf(rows))); /* v204 (ผู้ใช้ขอ): ถามถึงผลไม้ใด ใส่รูปด้วย */ bd.append(choices(ctx, shuffle([right, ...wrong]).map(x => ({ value: x, label: x })), right, { hint: 'ชั้นที่ 1 อยู่ล่างสุด นับขึ้นไป แล้วดูว่าอยู่ข้างซ้าย ตรงกลาง หรือข้างขวา' })); bd.querySelectorAll('.opt').forEach(o => o.classList.add('txt')); } }; }
    const e = rows[r][c], q = `ชั้นที่ ${r + 1} ${COL[c]} วางผลไม้ใด?`, opts = shuffle([e, ...shuffle(rows.flat().filter(x => x !== e)).slice(0, 2)]);
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(shelf(rows)); bd.append(choices(ctx, opts.map(x => ({ value: x, node: h('span', { class: 'opt-art' }, art(x), h('b', null, names[x])) })), e, { hint: 'ชั้นที่ 1 อยู่ล่างสุด' })); } };
  },
  /* practice: race — who finished k-th / which place did X get */
  raceAsk({ racers, ask, k, who }) {
    const order = [...racers].sort((a, b) => b.pos - a.pos).map(r => r.name);
    if (ask === 'who') { const q = `ใครเข้าเส้นชัยเป็น<span class="hl">${ORD(k)}</span>?`;
      return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { bd.append(raceTrack(racers)); nameChoices(bd, ctx, shuffle([order[k - 1], ...shuffle(order.filter(n => n !== order[k - 1])).slice(0, 2)]), order[k - 1], 'คนที่อยู่ใกล้เส้นชัยที่สุด (ขวาสุด) คืออันดับที่ 1'); } }; }
    const q = `${who}เข้าเส้นชัยเป็นอันดับที่เท่าไร?`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(raceTrack(racers)); ordChoices(bd, ctx, Math.min(racers.length, 6), order.indexOf(who) + 1, 'นับจากคนที่ใกล้เส้นชัยที่สุดเป็นอันดับที่ 1'); } };
  },
  /* practice: queue to the bus (first to get on = nearest the bus, on the right) */
  busAsk({ names, k }) {
    const order = [...names].reverse(), q = `ใครขึ้นรถรับนักเรียนเป็น<span class="hl">คนที่ ${k}</span>?`;
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { bd.append(h('div', { class: 'busq' }, lineup(names, { sm: true }), h('span', { class: 'bus', html: BUS_SVG }))); nameChoices(bd, ctx, shuffle([order[k - 1], ...shuffle(names.filter(n => n !== order[k - 1])).slice(0, 2)]), order[k - 1], 'คนที่อยู่ใกล้รถที่สุดได้ขึ้นก่อน เป็นคนที่ 1'); } };
  },
  /* practice: rank by amount */
  rankAsk({ items, unit, ask, k, who, pic }) {
    const order = [...items].sort((a, b) => b.n - a.n);
    const vis = () => h('div', { class: 'rankvis' }, ...items.map(it => h('div', { class: 'rk-col' + (it.col ? ' tm' : ''), style: it.col ? { '--tc': it.col } : null }, pic ? h('div', { class: 'rk-pile' }, ...range(1, it.n).map(() => art(pic))) : null, h('b', { class: 'rk-name' }, it.name), h('span', { class: 'rk-n num' }, `${it.n} ${unit}`))));
    if (ask === 'who') { const q = `ใครได้<span class="hl">${ORD(k)}</span>? <small>(มากที่สุด = อันดับที่ 1)</small>`;
      return { prompt: q, say: `ใครได้${ORD(k)}`, mount(bd, ctx) { bd.append(vis()); nameChoices(bd, ctx, items.map(x => x.name), order[k - 1].name, 'เรียงจากมากไปน้อย คนที่ได้มากที่สุดเป็นอันดับที่ 1'); } }; }
    const q = `${who}ได้อันดับที่เท่าไร?`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(vis()); ordChoices(bd, ctx, items.length, order.findIndex(x => x.name === who) + 1, 'เรียงจากมากไปน้อย คนที่ได้มากที่สุดเป็นอันดับที่ 1'); } };
  },
  /* practice: place names into slots from clues */
  arrange({ clues, answer, slotLabel }) { /* v204 (ผู้ใช้ขอ): เลือกได้เองว่าจะวางใครไว้ช่องไหน — แตะชื่อ แล้วแตะช่อง (หรือแตะช่องก่อน) */
    return { prompt: 'อ่านข้อความ แตะชื่อ แล้วแตะช่องที่จะวาง', say: 'อ่านข้อความ แตะชื่อ แล้วแตะช่องที่จะวาง',
      mount(bd, ctx) {
        const slots = h('div', { class: 'slots ia lbl ar' }), cards = h('div', { class: 'cards ia lbl' }), placed = Array(answer.length).fill(null); let sel = null, pickSlot = -1;
        const S = answer.map((_, i) => { const s = h('div', { class: 'slot' }); s.dataset.lab = slotLabel ? slotLabel(i) : i + 1; slots.append(s); return s; });
        const render = () => { S.forEach((s, i) => { s.textContent = placed[i] ? placed[i].v : ''; s.classList.toggle('filled', !!placed[i]); s.classList.toggle('pick', i === pickSlot); }); C.forEach(c => { c.classList.toggle('used', placed.some(p => p && p.c === c)); c.classList.toggle('sel', c === sel); }); };
        const put = (i, c) => { const old = placed.findIndex(p => p && p.c === c); if (old >= 0) placed[old] = null; placed[i] = { v: c.textContent, c }; sel = null; pickSlot = -1; sfx.pop(i); render();
          if (!placed.includes(null)) { const ok = placed.every((p, k) => p.v === answer[k]); if (ok) { slots.dataset.done = 1; ctx.check(true); } else { ctx.check(false, 'อ่านข้อความทีละประโยค เริ่มจากคนที่รู้ตำแหน่งแน่นอนก่อน — แตะช่องเพื่อเอาชื่อออกแล้ววางใหม่'); } } };
        S.forEach((s, i) => s.onclick = e => { e.stopPropagation(); if (slots.dataset.done) return; if (sel) { put(i, sel); return; } if (placed[i]) { placed[i] = null; sfx.tap(); render(); return; } pickSlot = pickSlot === i ? -1 : i; sfx.tap(); render(); });
        const C = shuffle(answer).map(v => { const cd = h('button', { class: 'ncard' }, v); cd.onclick = e => { e.stopPropagation(); if (slots.dataset.done) return; if (pickSlot >= 0) { put(pickSlot, cd); return; } sel = sel === cd ? null : cd; sfx.tap(); render(); }; cards.append(cd); return cd; });
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'stmt clues' }, ...clues.map(c => h('div', null, c))), slots, cards)); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 9 QUESTION TYPES — รูปเรขาคณิต
   ========================================================= */
const TRACE_OBJ = { coin: { v: 'circle', sc: 1.4, name: 'เหรียญ' }, plate: { v: 'wellipse', sc: .97, name: 'จานรูปไข่' }, setsquare: { v: 'rtri', sc: 1, name: 'ไม้ฉาก' }, cardbook: { v: 'book', sc: 1.06, name: 'สมุด' }, sandwichT: { v: 'tri', sc: 1, name: 'แซนด์วิช' } };
const SK = ['box', 'ball', 'cyl', 'cone'], FK = ['tri', 'quad', 'circle', 'ellipse'];
const FK_V = { tri: 'tri', quad: 'rect', circle: 'circle', ellipse: 'ellipse' };
const solidOpt = k => ({ value: k, node: h('span', { class: 'opt-art' }, solidEl({ box: 'box', ball: 'sphere', cyl: 'cyl', cone: 'cone' }[k]), h('b', null, SOLID_NAME[k])) });
const shapeOpt = k => ({ value: k, node: h('span', { class: 'opt-art' }, shapeEl(FK_V[k]), h('b', null, SHAPE_NAME[k])) });
Object.assign(Q, {
  /* practice: name the solid */
  solidName({ v }) {
    const k = SOLID_KIND(v);
    return { mx: { k: 'solid', kind: k, pic: `<svg viewBox="0 0 64 64" class="ixpic">${solidSVG(v)}</svg>`, name: SOLID_NAME[k] }, prompt: 'รูปนี้คือรูปเรขาคณิตใด?', say: 'รูปนี้คือรูปเรขาคณิตใด',
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, solidEl(v, 'big'), choices(ctx, shuffle(SK).map(x => ({ value: x, label: SOLID_NAME[x] })), k, { hint: { box: 'มีหน้าเรียบเป็นรูปสี่เหลี่ยม 6 หน้า มีมุมแหลม', ball: 'กลมทุกด้าน กลิ้งได้ทุกทิศทาง', cyl: 'ด้านบนและด้านล่างเป็นวงกลมเท่ากัน ตั้งได้และกลิ้งได้', cone: 'ฐานเป็นวงกลม ปลายแหลมด้านเดียว' }[k] }))); txtOpts(bd); } };
  },
  /* practice: tap (colour) every solid / shape of one kind */
  tapKind({ items, kind, mode = 'solid' }) {
    const name = mode === 'solid' ? SOLID_NAME[kind] : SHAPE_NAME[kind], is = it => (mode === 'solid' ? SOLID_KIND(it.v) : SHAPE_KIND(it.v)) === kind;
    return { prompt: `แตะระบายสี<span class="hl">${name}</span>ให้ครบทุกรูป แล้วกดตรวจ`, say: `แตะระบายสี${name}ให้ครบทุกรูป แล้วกดตรวจ`,
      mount(bd, ctx) {
        const sc = scatterScene(items, { kind: mode, outline: true }); sc.classList.add('ia', 'tapscene');
        const col = mode === 'solid' ? SOLID_COL[kind] : SHAPE_COL[kind], cnt = h('b', { class: 'num' }, '0');
        sc.querySelectorAll('.sc-it').forEach(el => { el.onclick = e => { e.stopPropagation(); if (sc.dataset.done) return; const on = el.classList.toggle('on'); const it = items[+el.dataset.i];
          el.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true">${mode === 'solid' ? solidSVG(it.v, on ? col : 'white') : shapeSVG(it.v, on ? col : null, { rot: it.rot, outline: !on })}</svg>`; cnt.textContent = sc.querySelectorAll('.on').length; sfx.pop(+cnt.textContent); }; });
        if (mode === 'solid') sc.querySelectorAll('.sc-it').forEach((el, i) => el.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true">${solidSVG(items[i].v, 'white')}</svg>`);
        bd.append(h('div', { class: 'colstack' }, sc, h('div', { class: 'cap' }, 'ระบายแล้ว ', cnt, ' รูป'), checkButton('ตรวจคำตอบ', () => {
          const want = items.map((it, i) => is(it) ? i : -1).filter(i => i >= 0), got = [...sc.querySelectorAll('.sc-it.on')].map(e => +e.dataset.i);
          const ok = want.length === got.length && want.every(i => got.includes(i));
          if (ok) { sc.dataset.done = 1; ctx.say && ctx.say(`มี${name} ${WORD[want.length]} รูป`); }
          ctx.check(ok, got.some(i => !want.includes(i)) ? `มีรูปที่ไม่ใช่${name}ถูกระบายอยู่ แตะอีกครั้งเพื่อลบสี` : `ยังมี${name}ที่ยังไม่ได้ระบายนะ`);
        }))); } };
  },
  /* practice: how many of a kind */
  countKind({ items, kind, mode = 'solid', art: isArt }) {
    const name = mode === 'shape' ? SHAPE_NAME[kind] : SOLID_NAME[kind], n = items.filter(it => (isArt ? it.k : mode === 'solid' ? SOLID_KIND(it.v) : SHAPE_KIND(it.v)) === kind).length;
    const q = isArt ? `สิ่งของที่มีลักษณะคล้าย<span class="hl">${name}</span>มีกี่ชิ้น?` : `มี<span class="hl">${name}</span>กี่รูป?`;
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { const sc = scatterScene(items, { kind: isArt ? 'art' : mode }); makeTapMark(sc); bd.append(sc, answerBox(ctx, n, { hint: `แตะทำเครื่องหมายที่${name}ทีละรูปขณะนับ` })); } };
  },
  /* practice: which solid does this object look like */
  objSolid({ obj, kind, name }) {
    const q = `${name}มีลักษณะคล้ายรูปเรขาคณิตใด?`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('span', { class: 'solid big' }, art(obj)), choices(ctx, shuffle(SK).map(solidOpt), kind, { hint: 'ดูรูปร่างของสิ่งของ: กลมทุกด้าน? มีหน้าเป็นวงกลม 2 หน้า? ปลายแหลม? หรือเป็นกล่องเหลี่ยม?' }))); } };
  },
  /* practice: name a 2D shape */
  shapeName({ v, rot = 0 }) {
    const k = SHAPE_KIND(v);
    return { mx: { k: 'shape', kind: k, pic: `<svg viewBox="0 0 64 64" class="ixpic">${shapeSVG(v, undefined, { rot })}</svg>`, name: SHAPE_NAME[k] }, prompt: 'รูปนี้คือรูปอะไร?', say: 'รูปนี้คือรูปอะไร', mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, shapeEl(v, { rot, cls: 'big' }), choices(ctx, shuffle(FK).map(x => ({ value: x, label: SHAPE_NAME[x] })), k, { hint: { tri: 'มี 3 ด้าน 3 มุม', quad: 'มี 4 ด้าน 4 มุม', circle: 'กลมเท่ากันทุกด้าน ไม่มีมุม', ellipse: 'กลมแต่ยาวรี ไม่มีมุม' }[k] }))); txtOpts(bd); } };
  },
  /* practice: how many sides / corners */
  sidesCorners({ v, ask = 'sides', rot = 0 }) {
    const P = SHAPE_PTS[v], n = P ? P.length : 0, w = ask === 'sides' ? 'ด้าน' : 'มุม', name = SHAPE_NAME[SHAPE_KIND(v)];
    return { prompt: `${name}นี้มีกี่<span class="hl">${w}</span>?`, say: `${name}นี้มีกี่${w}`,
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, sideCounter(v), h('div', { class: 'rowstack' }, answerBox(ctx, n, { hint: P ? `แตะ${w}ทีละ${w}เพื่อนับ` : `${name}มีขอบโค้ง ไม่มี${w}เลย ตอบ 0` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, w)))); } };
  },
  /* practice: which shape matches the description */
  shapeClue({ clue, kind }) {
    return { prompt: clue, say: clue, mount(bd, ctx) { bd.append(choices(ctx, shuffle(FK).map(shapeOpt), kind, { hint: 'นับด้านและมุมของแต่ละรูป' })); } };
  },
  /* practice: trace using a template / an object */
  traceShape({ v, obj, name }) {
    const sname = SHAPE_NAME[SHAPE_KIND(v)], q = obj ? `วาง${name}เป็นแบบ แล้วลากเส้นรอบ${name} จะได้${sname}` : `ลากเส้นตามแบบของ${sname}ให้รอบรูป`;
    return { prompt: q, say: q,
      mount(bd, ctx) { const tb = traceBoard(v, { obj, sc: obj && TRACE_OBJ[obj] ? TRACE_OBJ[obj].sc : 1 });
        bd.append(h('div', { class: 'colstack' }, tb, h('div', { class: 'rowstack' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); tb.pad.clear(); } }, icon('eraser'), 'ล้าง'),
          checkButton(obj ? 'ยกของออก' : 'ตรวจคำตอบ', () => { const { cov, prec } = tb.score(); const ok = cov >= .72 && prec >= .62; if (ok || obj) tb.lift(); ctx.check(ok, cov < .72 ? 'ลากเส้นให้รอบรูปจนครบ ไม่ขาดตอนนะ' : 'ลากเส้นให้ชิดขอบของแบบมากขึ้น'); if (!ok && obj) setTimeout(() => { tb.classList.remove('lifted'); tb.pad.clear(); }, 1300); })))); } };
  },
  /* practice: what shape do you get by tracing around X */
  traceWhat({ obj, name, kind }) {
    const q = `ถ้าลากเส้นรอบ${name} จะได้รูปอะไร?`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('span', { class: 'solid big flat' }, art(obj)), choices(ctx, shuffle(FK).map(shapeOpt), kind, { hint: 'ดูขอบรอบนอกของสิ่งของที่วางบนกระดาษ' }))); } };
  },
  /* practice: count one kind of shape in the robot picture */
  robotCount({ kind }) {
    const n = ROBOT_PARTS.filter(p => p[0] === kind).length, q = `หุ่นยนต์ตัวนี้มี<span class="hl">${SHAPE_NAME[kind]}</span>กี่รูป?`;
    return { prompt: q, say: q.replace(/<[^>]+>/g, ''), mount(bd, ctx) { const r = h('div', { class: 'robotw ia', html: robotSVG([]) }); robotTap(r, kind); bd.append(h('div', { class: 'rowstack' }, r, h('div', { class: 'colstack' }, h('div', { class: 'cap' }, `แตะ${SHAPE_NAME[kind]}เพื่อระบายสีขณะนับ`), answerBox(ctx, n, { hint: `แตะ${SHAPE_NAME[kind]}ทีละรูปให้เป็นสี แล้วนับ` })))); } };
  },
  /* practice: which set repeats */
  patUnit({ seq }) {
    const u = patUnit(seq), L = u.length, right = u.join('|');
    const alts = [seq.slice(0, L + 1), L > 1 ? Array(L).fill(u[0]) : seq.slice(0, L + 2), L > 1 ? seq.slice(0, L - 1) : [u[0], seq.find(t => t !== u[0]) || u[0]]].map(a => a.join('|')).filter(a => a !== right);
    const opts = shuffle([right, ...[...new Set(alts)].slice(0, 2)]);
    return { prompt: 'ชุดใดคือ<span class="hl">ชุดที่ซ้ำ</span>ในแบบรูปนี้?', say: 'ชุดใดคือชุดที่ซ้ำในแบบรูปนี้',
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, patStrip(seq), choices(ctx, opts.map(o => ({ value: o, node: patStrip(o.split('|'), { sm: true }) })), right, { hint: 'ดูว่ารูปชุดไหนเกิดขึ้นซ้ำ ๆ ตั้งแต่ต้นจนจบ' }))); } };
  },
  /* practice: the missing item */
  patMissing({ seq, blank }) {
    const right = seq[blank], opts = shuffle([...new Set(seq)]).slice(0, 3); if (!opts.includes(right)) opts[0] = right;
    return { prompt: 'รูปใดหายไปจากแบบรูปซ้ำนี้?', say: 'รูปใดหายไปจากแบบรูปซ้ำนี้',
      mount(bd, ctx) { const st = patStrip(seq, { blank: [blank] }); bd.append(h('div', { class: 'colstack' }, st, choices(ctx, shuffle(opts).map(t => ({ value: t, node: tokEl(t) })), right, { hint: 'หาชุดที่ซ้ำก่อน แล้วไล่ดูว่าช่องว่างตรงกับรูปไหนในชุด', onRight: () => { const b = st.querySelector('.blank'); b.replaceWith(Object.assign(tokEl(right), { className: 'tok fill' + (right.endsWith('.s') ? ' s' : '') })); } }))); bd.querySelectorAll('.opt').forEach(o => o.classList.add('tokopt')); } };
  },
  /* practice: continue a repeating pattern from a palette */
  patMake({ unit, reps = 2, show = 1, palette }) {
    const full = range(0, unit.length * (show + reps) - 1).map(i => unit[i % unit.length]), given = unit.length * show, pal = palette || shuffle([...new Set(unit)]);
    return { prompt: 'ต่อแบบรูปซ้ำให้ถูกต้อง <small>(แตะรูปด้านล่างเพื่อวาง)</small>', say: 'ต่อแบบรูปซ้ำให้ถูกต้อง แตะรูปด้านล่างเพื่อวาง',
      mount(bd, ctx) { const st = h('div', { class: 'pstrip make' }), placed = [];
        full.forEach((t, i) => st.append(i < given ? tokEl(t) : h('span', { class: 'tok slot', 'data-i': i })));
        const slots = [...st.querySelectorAll('.slot')];
        const draw = () => slots.forEach((s, i) => { s.innerHTML = ''; s.className = 'tok slot' + (placed[i] ? ' filled' + (placed[i].endsWith('.s') ? ' s' : '') : ''); if (placed[i]) s.innerHTML = tokEl(placed[i]).innerHTML; });
        slots.forEach((s, i) => s.onclick = e => { e.stopPropagation(); if (st.dataset.done || i !== placed.length - 1) return; placed.pop(); draw(); });
        const palEl = h('div', { class: 'palette ia' }, ...pal.map(t => { const b = h('button', { class: 'palb' }, tokEl(t)); b.onclick = e => { e.stopPropagation(); if (st.dataset.done || placed.length >= slots.length) return; placed.push(t); sfx.pop(placed.length); draw(); if (placed.length === slots.length) check(); }; return b; }));
        function check() { const ok = placed.every((t, i) => t === full[given + i]); if (ok) st.dataset.done = 1; ctx.check(ok, 'ดูชุดแรกเป็นตัวอย่าง แล้ววางตามลำดับเดิมซ้ำไปเรื่อย ๆ (แตะช่องสุดท้ายเพื่อลบ)'); if (!ok) setTimeout(() => { placed.length = 0; draw(); }, 900); }
        bd.append(h('div', { class: 'colstack' }, st, palEl)); } };
  }
});
/* tap to mark objects while counting (keeps a running count) */
function makeTapMark(sc) { sc.classList.add('ia'); let n = 0; sc.querySelectorAll('.sc-it').forEach(el => { el.style.cursor = 'pointer'; el.onclick = e => { e.stopPropagation(); const on = el.classList.toggle('mark'); n += on ? 1 : -1; if (on) { el.dataset.c = n; sfx.pop(n); } }; }); }
function robotTap(r, kind) { let n = 0; r.querySelectorAll('.rp').forEach(p => p.addEventListener('click', e => { e.stopPropagation(); const k = p.dataset.k, c = PAL[ROBOT_FILL[k]]; const on = p.getAttribute('fill') === '#fff'; p.setAttribute('fill', on ? c[1] : '#fff'); p.setAttribute('stroke', on ? c[3] : '#2B2550'); if (!kind || k === kind) { n += on ? 1 : -1; sfx.pop(n); if (on && kind) say(WORD[n], true); } else sfx.tap(); })); }

/* =========================================================
   GRADE 1 · CHAPTER 10 QUESTION TYPES — จำนวนนับ 21 ถึง 100
   ========================================================= */
const near2 = (n, k = 3) => { const s = new Set([n]); const c = shuffle([n + 1, n - 1, n + 10, n - 10, +String(n).split('').reverse().join(''), n + 2]); for (const m of c) { if (s.size >= k) break; if (m >= 10 && m <= 100 && m !== n) s.add(m); } return shuffle([...s]); };
Object.assign(Q, {
  /* practice: rods and cubes → number (digits / Thai digits / words) */
  tensRead({ n, ask = 'digit' }) {
    const what = { digit: 'ตัวเลขฮินดูอารบิก', thai: 'ตัวเลขไทย', word: 'ตัวหนังสือ' }[ask], hint = 'นับแท่งสิบทีละ 10 แล้วนับก้อนหน่วยต่อทีละ 1';
    return { __sig: `tens ${n} ${ask}`, prompt: `ภาพนี้แสดงจำนวนเท่าไร? <small>(ตอบเป็น${what})</small>`, say: `ภาพนี้แสดงจำนวนเท่าไร ตอบเป็น${what}`,
      mount(bd, ctx) { const vis = tensOnes(n);
        if (ask === 'digit') bd.append(vis, answerBox(ctx, n, { hint }));
        else { bd.append(h('div', { class: 'colstack' }, vis, choices(ctx, near2(n).map(v => ({ value: v, label: ask === 'thai' ? `<span class="num th">${thai(v)}</span>` : thaiWords(v) })), n, { hint }))); txtOpts(bd); } } };
  },
  /* practice: fruit in baskets of ten */
  basketCount({ e, name, n, unit = 'ผล' }) {
    const q = `มี${name}ทั้งหมดกี่${unit}? <small>(ตะกร้าละ 10 ${unit})</small>`;
    return { prompt: q, say: `มี${name}ทั้งหมดกี่${unit} ตะกร้าละสิบ${unit}`, mount(bd, ctx) { bd.append(baskets(e, n), answerBox(ctx, n, { hint: `ตะกร้าเต็มนับทีละ 10 แล้วนับ${name}ที่เหลือต่อทีละ 1` })); } };
  },
  /* practice: value of a digit */
  place2({ n, pos }) {
    if (n >= 10) n = uniqAt(n, pos); // v122: เลขโดดที่ถามต้องไม่ซ้ำ
    const d = +String(n).padStart(2, '0')[pos], nm = ['หลักสิบ', 'หลักหน่วย'][pos], val = pos ? d : d * 10;
    return { prompt: `${n}: เลข <span class="hl">${d}</span> ใน${nm} มีค่าเท่าไร?`, say: `${thaiWords(n)} เลข ${WORD[d]} ใน${nm} มีค่าเท่าไร`,
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, placeChart(n, { places: 2, hi: pos }), tensOnes(n, { sm: true })), answerBox(ctx, val, { hint: pos ? `เลขในหลักหน่วยมีค่าเท่ากับตัวมันเอง: ${d}` : `${d} ในหลักสิบ = ${d} สิบ = ${d * 10}` })); } };
  },
  /* practice: expanded form */
  expand2({ n, miss = rnd(0, 1) }) {
    const t = Math.floor(n / 10) * 10, u = n % 10, toks = [n, '=', t, '+', u], ans = miss ? u : t; toks[miss ? 4 : 2] = '?';
    return { prompt: 'เขียนในรูปกระจาย: เติมจำนวนที่หายไป', say: `เขียน ${thaiWords(n)} ในรูปกระจาย`,
      mount(bd, ctx) { const e = eqRow(toks); bd.append(h('div', { class: 'colstack' }, placeChart(n, { places: 2, values: true }), e), answerBox(ctx, ans, { hint: 'รูปกระจาย = ค่าของหลักสิบ + ค่าของหลักหน่วย' })); ctx.onRight = () => e.fill(ans); } };
  },
  pickExpand2({ n }) {
    const t = Math.floor(n / 10), u = n % 10, right = `${t * 10} + ${u}`, opts = shuffle([...new Set([right, `${t} + ${u}`, ...[`${u * 10} + ${t}`, `${t * 10} + ${u * 10}`, `${t} + ${u * 10}`].filter(x => x !== right && x.split(' + ').reduce((a, b) => a + +b, 0) !== n)])].slice(0, 3));
    return { prompt: `ข้อใดเป็นรูปกระจายของ <span class="hl">${n}</span>?`, mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'bignum sm' }, n), choices(ctx, opts.map(o => ({ value: o, label: `<span class="num">${o}</span>` })), right, { hint: 'เลขในหลักสิบต้องเขียนเป็นค่าของมัน เช่น 4 สิบ = 40' }))); } };
  },
  /* practice: > < = */
  cmp2({ a, b: bb, blocks = false }) {
    const rel = a > bb ? '>' : a < bb ? '<' : '=';
    return { prompt: 'เลือกเครื่องหมาย &gt; &lt; หรือ = เติมในช่องว่าง', say: `${thaiWords(a)} กับ ${thaiWords(bb)} เลือกเครื่องหมาย`,
      mount(bd, ctx) { const e = eqRow([a, '?', bb]);
        bd.append(h('div', { class: 'colstack' }, blocks ? h('div', { class: 'rowstack cmpblk' }, tensOnes(a, { sm: true }), tensOnes(bb, { sm: true })) : null, e,
          h('div', { class: 'legend' }, h('span', null, h('b', null, '>'), ' มากกว่า'), h('span', null, h('b', null, '<'), ' น้อยกว่า'), h('span', null, h('b', null, '='), ' เท่ากับ')),
          choices(ctx, ['>', '<', '='].map(x => ({ value: x, label: `<span class="num" style="font-size:1.3em">${x.replace('>', '&gt;').replace('<', '&lt;')}</span>` })), rel, { onRight: o => e.fill(o.value), hint: 'เทียบเลขในหลักสิบก่อน ถ้าเท่ากันค่อยเทียบหลักหน่วย' }))); } };
  },
  /* practice: rule of a pattern (±1 / ±10) */
  patRule2({ vals }) {
    const st = vals[1] - vals[0], right = (st > 0 ? 'เพิ่มขึ้นทีละ ' : 'ลดลงทีละ ') + Math.abs(st);
    const opts = shuffle([right, (st > 0 ? 'ลดลงทีละ ' : 'เพิ่มขึ้นทีละ ') + Math.abs(st), (st > 0 ? 'เพิ่มขึ้นทีละ ' : 'ลดลงทีละ ') + (Math.abs(st) === 1 ? 10 : 1)]);
    return { prompt: 'แบบรูปนี้เป็นแบบรูปของจำนวนที่…', say: 'แบบรูปนี้เป็นแบบรูปของจำนวนที่ เพิ่มขึ้น หรือลดลงทีละเท่าไร',
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, numStrip(vals), choices(ctx, opts.map(o => ({ value: o, label: o })), right, { hint: 'ดูจำนวนที่อยู่ติดกัน: มากขึ้นหรือน้อยลง และต่างกันเท่าไร' }))); txtOpts(bd); } };
  },
  /* practice: fill the pattern (several blanks, one at a time) */
  seqBlank({ vals, blank }) {
    const st = vals[1] - vals[0] || vals[2] - vals[1];
    return { prompt: 'เติมจำนวนในแบบรูปให้ถูกต้อง', say: 'เติมจำนวนในแบบรูปให้ถูกต้อง',
      mount(bd, ctx) { const s = numStrip(vals, [blank]); bd.append(s, answerBox(ctx, vals[blank], { hint: `แบบรูปนี้${st > 0 ? 'เพิ่มขึ้น' : 'ลดลง'}ทีละ ${Math.abs(st)}` })); ctx.onRight = () => { const c = s.querySelectorAll('.ns')[blank]; c.textContent = vals[blank]; c.classList.remove('blank'); c.classList.add('hi'); }; } };
  },
  /* practice: a piece of the hundred chart */
  hundredFill({ cells, show, q }) {
    return { prompt: 'รูปนี้เป็นส่วนหนึ่งของตารางร้อย ช่อง ? คือจำนวนใด?', say: 'รูปนี้เป็นส่วนหนึ่งของตารางร้อย ช่องว่างคือจำนวนใด',
      mount(bd, ctx) { bd.append(h('div', { class: 'rowstack' }, hundredPiece(cells, show, q), h('div', { class: 'hrule' }, h('span', null, 'ไปทางขวา ', h('b', null, '+1')), h('span', null, 'ลงข้างล่าง ', h('b', null, '+10')))), answerBox(ctx, q, { hint: 'ช่องทางขวาเพิ่มขึ้นทีละ 1 ช่องข้างล่างเพิ่มขึ้นทีละ 10' })); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 11 QUESTION TYPES — การวัดความยาว
   ========================================================= */
const UNIT_TH = { cm: 'เซนติเมตร', m: 'เมตร', clip: 'หน่วย', cube: 'หน่วย', box: 'หน่วย' };
const textOpts = (bd, ctx, list, right, hint) => { bd.append(choices(ctx, list.map(x => ({ value: x, label: x })), right, { hint })); txtOpts(bd); };
Object.assign(Q, {
  /* practice: longest / shortest / tallest / shortest-standing */
  lenExtreme({ items, ask, unit, vis = 'len', max }) {
    const W = { long: ['ยาวที่สุด', Math.max], short: ['สั้นที่สุด', Math.min], tall: ['สูงที่สุด', Math.max], low: ['เตี้ยที่สุด', Math.min] }[ask], key = vis === 'len' ? 'len' : 'h', tv = W[1](...items.map(x => x[key])), right = items.find(x => x[key] === tv).name;
    const q = `สิ่งใด<span class="hl">${W[0]}</span>?`;
    return { prompt: q + ' <small>(แตะที่ภาพ)</small>', say: `สิ่งใด${W[0]} แตะที่ภาพ`, mount(bd, ctx) { const fig = vis === 'len' ? lenBoard(items, { unit, max }) : heightBoard(items, { unit: unit || 'none', max, guides: !!unit });
      ixTapFig(fig, vis === 'len' ? '.lb-row' : '.hb-col', ctx, i => items[i].name === right, unit ? 'นับหน่วยหรืออ่านตัวเลขของแต่ละสิ่ง แล้วเปรียบเทียบ' : 'ปลายข้างหนึ่งเริ่มที่เส้นเดียวกัน ดูว่าปลายอีกข้างของสิ่งใดไกลที่สุด'); bd.append(h('div', { class: 'colstack' }, fig, h('div', { class: 'cap ixcap' }, 'แตะสิ่งของในภาพได้เลย'))); } };
  },
  /* practice: taller / shorter */
  tallerWord({ a, b }) { // a, b: { name, h, e }
    const right = a.h > b.h ? 'สูงกว่า' : 'เตี้ยกว่า', blank = h('span', { class: 'blank' }, '?');
    return { prompt: `${a.name} ... ${b.name}`, say: `${a.name} กับ ${b.name} ใครสูงกว่ากัน เลือกคำ`,
      mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, heightBoard([a, b], { unit: 'none' }), h('div', { class: 'sentence' }, h('span', { class: 'lab' }, a.name), blank, h('span', { class: 'lab' }, b.name)), wordChoices(ctx, right, blank, 'ดูยอดศีรษะ ใครอยู่สูงกว่า', ['สูงกว่า', 'เตี้ยกว่า']))); } };
  },
  /* practice: how many units / cm long or tall */
  unitCount({ item, unit, vis = 'len', max }) {
    const u = UNIT_TH[unit], v = vis === 'len' ? item.len : item.h, q = `${item.name}${vis === 'len' ? 'ยาว' : 'สูง'}กี่${u}?`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(vis === 'len' ? lenBoard([item], { unit, max: max || item.len + 1 }) : heightBoard([item], { unit, max: max || item.h + 1, guides: true }), h('div', { class: 'rowstack' }, answerBox(ctx, v, { hint: unit === 'cm' ? 'เริ่มที่ 0 แล้วดูว่าปลายอีกข้างตรงกับตัวเลขใด' : `นับ${unit === 'clip' ? 'คลิป' : 'หน่วย'}ทีละอันจนสุดปลาย` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, u))); } };
  },
  /* practice: difference of two lengths */
  lenDiff({ a, b, unit = 'cm', vis = 'none', word }) {
    const u = UNIT_TH[unit], la = a.len ?? a.h, lb = b.len ?? b.h, w = word || (la > lb ? (a.h != null ? 'สูงกว่า' : 'ยาวกว่า') : (a.h != null ? 'เตี้ยกว่า' : 'สั้นกว่า')), q = `${a.name}${w}${b.name}อยู่กี่${u}?`;
    return { prompt: q, say: q, mount(bd, ctx) {
      const vis_ = vis === 'len' ? lenBoard([a, b], { unit, guides: true }) : vis === 'h' ? heightBoard([a, b], { unit, guides: true }) : h('div', { class: 'rowstack' }, ...[a, b].map(x => h('div', { class: 'lencard' }, x.e ? art(x.e) : null, h('b', null, x.name), h('span', { class: 'num' }, `${x.len ?? x.h} ${unit === 'cm' ? 'ซม.' : unit === 'm' ? 'ม.' : 'หน่วย'}`))));
      bd.append(vis_, h('div', { class: 'rowstack' }, answerBox(ctx, Math.abs(la - lb), { hint: `${Math.max(la, lb)} − ${Math.min(la, lb)}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, u))); } };
  },
  /* practice: set a length with the ruler (drag the end) */
  rulerSet({ len, col = 'mint', kind = 'straw', max = 10 }) {
    const q = `ลากปลายให้${kind === 'pencil' ? 'ดินสอ' : 'หลอด'}ยาว <span class="hl">${len} เซนติเมตร</span>`;
    return { prompt: q, say: `ลากปลายให้ยาว ${WORD[len]} เซนติเมตร`, mount(bd, ctx) { let cur = 2;
      const lb = lenBoard([{ kind, len: cur, col }], { unit: 'cm', max }), obj = lb.querySelector('.lb-obj'), read = h('b', { class: 'num ss-read' }, `${cur} เซนติเมตร`);
      const knob = h('span', { class: 'lb-knob ia' }); obj.append(knob);
      const set = v => { v = Math.max(1, Math.min(max, v)); if (v === cur) return; cur = v; obj.style.width = `calc(var(--u) * ${v})`; obj.innerHTML = longSVG(kind, v, col); obj.append(knob); read.textContent = `${v} เซนติเมตร`; sfx.tap(); };
      knob.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); knob.setPointerCapture(e.pointerId); const x0 = obj.getBoundingClientRect().left, U = lb.querySelector('.ruler').getBoundingClientRect().width / max;
        const mv = ev => set(Math.round((ev.clientX - x0) / U)); const up = () => { knob.removeEventListener('pointermove', mv); knob.removeEventListener('pointerup', up); }; knob.addEventListener('pointermove', mv); knob.addEventListener('pointerup', up); });
      lb.querySelector('.ruler').addEventListener('click', e => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); set(Math.round((e.clientX - r.left) / (r.width / max))); });
      lb.set = set;
      bd.append(h('div', { class: 'colstack' }, lb, h('div', { class: 'cap' }, 'ลากปุ่มกลมที่ปลาย หรือแตะตัวเลขบนไม้บรรทัด'), read, checkButton('ตรวจคำตอบ', () => ctx.check(cur === len, cur > len ? `ยาวเกินไป ${cur - len} เซนติเมตร` : `ยังขาดอีก ${len - cur} เซนติเมตร`)))); } };
  },
  /* practice: longer or shorter than 1 metre */
  meterJudge({ e, name, more }) {
    const right = more ? 'ยาวกว่า 1 เมตร' : 'สั้นกว่า 1 เมตร', q = `${name}ยาวกว่าหรือสั้นกว่า 1 เมตร?`;
    return { prompt: q, say: q, mount(bd, ctx) { const col = h('div', { class: 'colstack mjq' }, h('div', { class: 'rowstack' }, h('span', { class: 'est-it' }, art(e), h('b', null, name)), h('span', { class: 'cap', style: { fontSize: '22px' } }, 'กับ'), h('span', { class: 'est-it' }, h('span', { class: 'mstick' }, h('i'), h('i'), h('i'), h('i'), h('i')), h('b', null, 'ไม้เมตร (1 เมตร)')))); bd.append(col); /* v189: รูปบน ตัวเลือกล่าง */ textOpts(col, ctx, ['ยาวกว่า 1 เมตร', 'สั้นกว่า 1 เมตร'], right, '1 เมตร ยาวประมาณจากพื้นถึงเอวของผู้ใหญ่ หรือกางแขนของเด็ก ป.1'); } };
  },
  /* which unit fits: cm or m */
  unitPick({ name, e, m }) {
    const right = m ? 'เมตร' : 'เซนติเมตร', q = `ควรวัด${name}เป็นหน่วยใด?`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('span', { class: 'est-it' }, art(e), h('b', null, name))); textOpts(bd, ctx, ['เซนติเมตร', 'เมตร'], right, 'ของชิ้นเล็กวัดเป็นเซนติเมตร ของที่ยาวมากหรือระยะทางวัดเป็นเมตร'); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 12 QUESTION TYPES — การบวกที่ผลบวกไม่เกิน 100
   ========================================================= */
Object.assign(Q, {
  /* practice: find the sum (blocks optional) */
  add100({ a, b, blocks = false }) {
    return { prompt: blocks ? `หาผลบวก <span class="hl">${a} + ${b}</span> <small>(ใช้บล็อกช่วยได้)</small>` : `หาผลบวก <span class="hl">${a} + ${b}</span>`, say: `${thaiWords(a)} บวก ${thaiWords(b)} เท่ากับเท่าไร`, __tier: blocks ? 1 : 2, __atoms: [`a12 ${a}+${b}`], /* v203: แบบเดียวกับเมืองลบร้อย */
      mount(bd, ctx) { const e = eqRow([a, '+', b, '=', '?']); bd.append(h('div', { class: 'colstack' }, blocks ? addLab(a, b) : null, e),
        answerBox(ctx, a + b, { hint: (a % 10 + b % 10) >= 10 ? 'บวกหลักหน่วยก่อน ครบ 10 หน่วยทด 1 สิบไปหลักสิบ' : 'บวกหลักหน่วยกับหลักหน่วย หลักสิบกับหลักสิบ' })); ctx.onRight = () => e.fill(a + b); } };
  },
  /* practice: step by step (split into tens and ones) */
  addSteps({ a, b }) {
    const big = Math.max(a, b), sm = Math.min(a, b), steps = [];
    if (sm < 10) { const t = Math.floor(big / 10) * 10, u = big % 10;
      steps.push({ label: 'ขั้นที่ 1', toks: [u, '+', sm, '=', '?'], ans: u + sm, hint: `บวกหลักหน่วย ${u} + ${sm}`, say: 'ขั้นที่สอง นำหลักสิบมาบวก' });
      steps.push({ label: 'ขั้นที่ 2', toks: [t, '+', '@0', '=', '?'], ans: a + b, hint: `${t} + ${u + sm}` }); }
    else { const ta = Math.floor(a / 10) * 10, tb = Math.floor(b / 10) * 10, ua = a % 10, ub = b % 10;
      steps.push({ label: 'ขั้นที่ 1', toks: [ta, '+', tb, '=', '?'], ans: ta + tb, hint: `${ta / 10} สิบ + ${tb / 10} สิบ`, say: 'ขั้นที่สอง บวกหลักหน่วย' });
      steps.push({ label: 'ขั้นที่ 2', toks: [ua, '+', ub, '=', '?'], ans: ua + ub, hint: `${ua} + ${ub}`, say: 'ขั้นที่สาม รวมผลบวก' });
      steps.push({ label: 'ขั้นที่ 3', toks: ['@0', '+', '@1', '=', '?'], ans: a + b, hint: `${ta + tb} + ${ua + ub}` }); }
    return { prompt: `หาผลบวก <span class="hl">${a} + ${b}</span> ทีละขั้น`, say: `หาผลบวก ${thaiWords(a)} บวก ${thaiWords(b)} ทีละขั้น`, __tier: 0, __atoms: [`a12 ${a}+${b}`], mount(bd, ctx) { bd.append(addLab(a, b), multiStep(ctx, steps)); } };
  },
  /* practice: vertical addition, ones column then tens column */
  vertAdd({ a, b }) {
    const us = a % 10 + b % 10, carry = us >= 10, s = a + b;
    return { prompt: `ตั้งบวก <span class="hl">${a} + ${b}</span>`, say: `ตั้งบวก ${thaiWords(a)} บวก ${thaiWords(b)}`,
      mount(bd, ctx) { const box = h('div', { class: 'ms-box' }), lay = h('div'), note = h('div', { class: 'cap vnote' }, '① บวกหลักหน่วยก่อน');
        const draw = (show, q) => { lay.innerHTML = ''; lay.append(vertLayout(a, b, { show, q })); };
        draw({}, 'ones');
        const step1 = { check: (ok, hint) => { if (!ok) return ctx.check(false, hint); sfx.pop(4); draw({ ones: true, carry }, 'tens'); note.innerHTML = carry ? `${a % 10} + ${b % 10} = ${us} เขียน ${us % 10} <b>ทด 1</b> ไปหลักสิบ · ② บวกหลักสิบ` : '② บวกหลักสิบ'; ctx.say && ctx.say(carry ? `ได้ ${WORD[us]} เขียน ${WORD[us % 10]} ทดหนึ่งไปหลักสิบ` : 'ต่อไปบวกหลักสิบ');
          box.innerHTML = ''; const tsum = Math.floor(s / 10); box.append(answerBox(ctx, tsum, { hint: carry ? `${Math.floor(a / 10)} + ${Math.floor(b / 10)} + 1 (ที่ทดมา)` : `${Math.floor(a / 10)} + ${Math.floor(b / 10)}` })); } };
        box.append(answerBox(step1, us % 10, { hint: carry ? `${a % 10} + ${b % 10} = ${us} เขียนเฉพาะ ${us % 10} ในหลักหน่วย` : `${a % 10} + ${b % 10}` }));
        ctx.onRight = () => { draw({ ones: true, tens: true, carry }); note.innerHTML = `ตอบ <b>${s}</b>`; };
        bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, lay, note), box)); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 13 QUESTION TYPES — การลบจำนวนที่ตัวตั้งไม่เกิน 100
   ========================================================= */
Object.assign(Q, {
  sub100({ a, b, blocks = false }) {
    const borrow = a % 10 < b % 10;
    return { prompt: blocks ? `หาผลลบ <span class="hl">${a} − ${b}</span> <small>(ใช้บล็อกช่วยได้)</small>` : `หาผลลบ <span class="hl">${a} − ${b}</span>`, say: `${thaiWords(a)} ลบ ${thaiWords(b)} เท่ากับเท่าไร`, __tier: blocks ? 1 : 2, __atoms: [`s13 ${a}-${b}`], /* v202: ตอบเลย (ยากสุด) ไว้ท้าย · ตัวเลขชุดเดียวกันไม่ซ้ำในเกม */
      mount(bd, ctx) { const e = eqRow([a, '−', b, '=', '?']); bd.append(h('div', { class: 'colstack' }, blocks ? blockLab(a) : null, e),
        answerBox(ctx, a - b, { hint: borrow ? 'หน่วยไม่พอลบ ให้กระจาย 1 สิบ เป็น 10 หน่วยก่อน' : 'หลักหน่วยลบหลักหน่วย หลักสิบลบหลักสิบ' })); ctx.onRight = () => e.fill(a - b); } };
  },
  /* practice: step by step */
  subSteps({ a, b }) {
    const ta = Math.floor(a / 10) * 10, ua = a % 10, tb = Math.floor(b / 10) * 10, ub = b % 10, steps = [];
    if (ua >= ub) {
      if (b < 10) steps.push({ label: 'ขั้นที่ 1', toks: [ua, '−', ub, '=', '?'], ans: ua - ub, hint: `ลบหลักหน่วย ${ua} − ${ub}`, say: 'ขั้นที่สอง รวมกับสิบ' }, { label: 'ขั้นที่ 2', toks: [ta, '+', '@0', '=', '?'], ans: a - b, hint: `${ta} + ${ua - ub}` });
      else steps.push({ label: 'ขั้นที่ 1', toks: [ta, '−', tb, '=', '?'], ans: ta - tb, hint: `${ta / 10} สิบ − ${tb / 10} สิบ`, say: 'ขั้นที่สอง ลบหลักหน่วย' }, { label: 'ขั้นที่ 2', toks: [ua, '−', ub, '=', '?'], ans: ua - ub, hint: `${ua} − ${ub}`, say: 'ขั้นที่สาม รวมผล' }, { label: 'ขั้นที่ 3', toks: ['@0', '+', '@1', '=', '?'], ans: a - b, hint: `${ta - tb} + ${ua - ub}` });
    } else { // กระจาย 1 สิบ
      steps.push({ label: 'ขั้นที่ 1 กระจาย', toks: [a, '=', ta - 10, '+', '?'], ans: ua + 10, hint: `กระจาย 1 สิบ: ${ua} + 10`, say: 'ขั้นที่สอง ลบหน่วย' }, { label: 'ขั้นที่ 2', toks: ['@0', '−', ub, '=', '?'], ans: ua + 10 - ub, hint: `${ua + 10} − ${ub}`, say: b < 10 ? 'ขั้นที่สาม รวมผล' : 'ขั้นที่สาม ลบสิบ' });
      if (b < 10) steps.push({ label: 'ขั้นที่ 3', toks: [ta - 10, '+', '@1', '=', '?'], ans: a - b, hint: `${ta - 10} + ${ua + 10 - ub}` });
      else steps.push({ label: 'ขั้นที่ 3', toks: [ta - 10, '−', tb, '=', '?'], ans: ta - 10 - tb, hint: `${ta - 10} − ${tb}`, say: 'ขั้นที่สี่ รวมผล' }, { label: 'ขั้นที่ 4', toks: ['@2', '+', '@1', '=', '?'], ans: a - b, hint: `${ta - 10 - tb} + ${ua + 10 - ub}` });
    }
    return { prompt: `หาผลลบ <span class="hl">${a} − ${b}</span> ทีละขั้น`, say: `หาผลลบ ${thaiWords(a)} ลบ ${thaiWords(b)} ทีละขั้น`, __tier: 0, __atoms: [`s13 ${a}-${b}`], mount(bd, ctx) { bd.append(blockLab(a), multiStep(ctx, steps)); } }; /* v202: ขั้นช่วยคิดมาก่อน · บล็อกกดกระจาย/เอาออกได้ */
  },
  /* practice: vertical subtraction */
  vertSub({ a, b }) {
    const borrow = a % 10 < b % 10, d = a - b;
    return { prompt: `ตั้งลบ <span class="hl">${a} − ${b}</span>`, say: `ตั้งลบ ${thaiWords(a)} ลบ ${thaiWords(b)}`,
      mount(bd, ctx) { const box = h('div', { class: 'ms-box' }), lay = h('div'), note = h('div', { class: 'cap vnote' }, borrow ? `① หลักหน่วย ${a % 10} ลบ ${b % 10} ไม่ได้ → กระจาย 1 สิบ` : '① ลบหลักหน่วยก่อน');
        const draw = (show, q) => { lay.innerHTML = ''; lay.append(vertSubLayout(a, b, { show, q })); }; draw({ borrow }, 'ones');
        const tensQ = () => { box.innerHTML = ''; box.append(answerBox(ctx, Math.floor(d / 10), { hint: borrow ? `${Math.floor(a / 10) - 1} − ${Math.floor(b / 10)} (หลักสิบเหลือ ${Math.floor(a / 10) - 1} เพราะกระจายไปแล้ว)` : `${Math.floor(a / 10)} − ${Math.floor(b / 10)}` })); };
        const step1 = { check: (ok, hint) => { if (!ok) return ctx.check(false, hint); sfx.pop(4); draw({ ones: true, borrow }, 'tens'); note.innerHTML = '② ลบหลักสิบ'; ctx.say && ctx.say('ต่อไปลบหลักสิบ'); tensQ(); } };
        box.append(answerBox(step1, d % 10, { hint: borrow ? `${a % 10 + 10} − ${b % 10}` : `${a % 10} − ${b % 10}` }));
        ctx.onRight = () => { draw({ ones: true, tens: true, borrow }); note.innerHTML = `ตอบ <b>${d}</b>`; };
        bd.append(h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, lay, note), box)); } };
  },
  /* practice: fact family (addition ↔ subtraction) */
  factFam({ a, b, k = rnd(0, 2) }) {
    const c = a + b, __atoms = [`ff ${a}+${b}`], forms = [[c, '−', a, '=', '?', b], [c, '−', b, '=', '?', a], ['?', '−', a, '=', b, c]], f = forms[k], toks = f.slice(0, 5);
    return { __atoms, prompt: `รู้ว่า <span class="hl">${a} + ${b} = ${c}</span> เติมคำตอบ`, say: `รู้ว่า ${thaiWords(a)} บวก ${thaiWords(b)} เท่ากับ ${thaiWords(c)} เติมคำตอบ`,
      mount(bd, ctx) { const e = eqRow(toks); bd.append(h('div', { class: 'colstack' }, partWhole(c, a, b, { w: 'clamp(170px,19cqw,220px)', q: ['b', 'a', 'whole'][k] }) /* v202: วงกลมส่วนรวม–ส่วนย่อย แทนแท่ง · จำนวนที่ถามเป็น ? */, eqRow([a, '+', b, '=', c], { sm: true }), e), answerBox(ctx, f[5], { hint: 'การบวกและการลบเป็นครอบครัวเดียวกัน: ส่วนรวม − ส่วนหนึ่ง = อีกส่วน' })); ctx.onRight = () => e.fill(f[5]); } };
  },
  /* practice: unknown */
  findX({ toks }) { // toks like ['?', '−', 13, '=', 54]
    const [x, op, y, , z] = toks; let ans, hint;
    if (x === '?') { ans = op === '+' ? z - y : z + y; hint = op === '+' ? `${z} − ${y}` : `${z} + ${y}`; }
    else { ans = op === '+' ? z - x : x - z; hint = op === '+' ? `${z} − ${x}` : `${x} − ${z}`; }
    return { prompt: 'หาจำนวนที่แทน ? ในประโยคสัญลักษณ์', say: 'หาจำนวนที่แทนช่องว่าง', mount(bd, ctx) { const e = eqRow(toks); bd.append(e, answerBox(ctx, ans, { hint: `ใช้ความสัมพันธ์ของการบวกและการลบ: ${hint}` })); ctx.onRight = () => e.fill(ans); } };
  }
});

/* =========================================================
   GRADE 1 · CHAPTER 14 QUESTION TYPES — โจทย์ปัญหาการบวกและการลบ (ไม่เกิน 100)
   ========================================================= */
Object.assign(Q, {
  /* write the sentence (choose) then the answer — numbers up to 100, bar model shown in step 2 */
  story100({ text, a, b, op, unit, bar, lab }) {
    const o = op === '+' ? '+' : '−', ans = op === '+' ? a + b : a - b, other = op === '+' ? '−' : '+', right = [a, o, b].join(' ');
    const cands = [[a, o, b], [a, other, b], op === '+' ? [a + b, '−', b] : [a - b, '+', b]].filter(x => !(x[1] === '−' && x[0] < x[2]));
    if (cands.length < 3) cands.push([a, o, b + (b < 90 ? 10 : -10)]);
    const opts = shuffle([...new Map(cands.map(x => [x.join(' '), x])).values()]).map(x => x.join(' '));
    return { prompt: text, say: text,
      mount(bd, ctx) { const step2 = h('div', { class: 'colstack', style: { display: 'none' } }), e = eqRow([a, o, b, '=', '?']);
        const ch = choices({ check: (ok, hint) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; sfx.pop(5); ctx.say('ใช่แล้ว! หาคำตอบเลย'); } else ctx.check(false, hint); } }, opts.map(s => { const p = s.split(' '); return { value: s, node: eqRow([+p[0], p[1], +p[2], '=', '?'], { sm: true }) }; }), right, { hint: op === '+' ? 'โจทย์ถามว่ารวมกัน เพิ่มขึ้น หรือมากกว่า ใช้การบวก' : 'โจทย์ถามว่าเหลือ น้อยกว่า หรือต่างกันเท่าไร ใช้การลบ' });
        step2.append(bar ? barModel(bar) : storyModel({ text, a, b, op, unit, lab }) /* v201: unit was missing — money showed children, captions kept the unit */, e, h('div', { class: 'rowstack' }, answerBox(ctx, ans, { hint: op === '+' ? 'ตั้งบวก หลักหน่วยก่อน แล้วหลักสิบ' : 'ตั้งลบ หลักหน่วยก่อน ถ้าไม่พอให้กระจาย 1 สิบ' }), h('div', { class: 'cap', style: { fontSize: '20px' } }, unit)));
        bd.append(h('div', { class: 'colstack' }, h('div', { class: 'cap' }, '① เลือกประโยคสัญลักษณ์'), ch, step2)); ctx.onRight = () => e.fill(ans); } };
  },
  /* practice: which story matches the sentence */
  storyFor({ a, b, op, stories }) {
    const o = op === '+' ? '+' : '−';
    return { prompt: `โจทย์ข้อใดตรงกับ <span class="hl">${a} ${o} ${b} = ☐</span>`, say: `โจทย์ข้อใดตรงกับ ${thaiWords(a)} ${op === '+' ? 'บวก' : 'ลบ'} ${thaiWords(b)}`,
      mount(bd, ctx) { const right = stories[0]; bd.append(choices(ctx, shuffle(stories).map(t => ({ value: t, label: t })), right, { hint: op === '+' ? 'หาโจทย์ที่เป็นการรวมกันหรือเพิ่มขึ้น และใช้จำนวนตรงกัน' : 'หาโจทย์ที่เป็นการเอาออก เหลือ หรือเปรียบเทียบ และใช้จำนวนตรงกัน' })); txtOpts(bd); } };
  }
});
