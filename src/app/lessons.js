'use strict';
/* =========================================================
   Each lesson = { id, title, goal, video, icon, color,
                   teach:[{t, v(el)}], game:() => [questions] }
   To add a lesson: push a new object with the same shape.
   ========================================================= */
const PM = k => h('span', { html: `<svg viewBox="0 0 24 24" class="ic" style="width:26px;height:26px;stroke-width:3"><path d="M5 12h14${k === '+' ? 'M12 5v14' : ''}"/></svg>` });
const row = (...k) => h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px,3vw,40px)', flexWrap: 'wrap' } }, ...k);
const col = (...k) => h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' } }, ...k);

/* interactive: eat cookies until the plate is empty → 0 */
function zeroPlate(e = 'cookie', n = 3) {
  const p = plate(e, n), num = bigNum(n, 'sm');
  p.querySelectorAll('.obj').forEach(o => { o.classList.add('tappable', 'ia'); o.onclick = ev => { ev.stopPropagation(); o.animate([{ transform: 'scale(1)' }, { transform: 'scale(0)' }], { duration: 250 }).onfinish = () => { o.remove(); const left = p.querySelectorAll('.obj').length; num.textContent = left; sfx.pop(left); say(left ? WORD[left] : 'ไม่มีเลย ศูนย์', true); }; }; });
  return row(p, num);
}
/* interactive ten-frame adder (simulation) */
function tenAdder(start = 5, min = 0, max = 10) {
  let n = start; const holder = h('div'), num = bigNum(n, 'sm'), word = h('div', { class: 'word' }, WORD[n]);
  const draw = () => { holder.innerHTML = ''; holder.append(tenFrame(n)); num.textContent = n; word.textContent = WORD[n]; };
  const btn = (lab, d) => h('button', { class: 'btn lg icon ia ' + (d > 0 ? 'primary' : 'danger'), 'aria-label': d > 0 ? 'เพิ่ม' : 'ลด', onclick: e => { e.stopPropagation(); const m = Math.min(max, Math.max(min, n + d)); if (m !== n) { n = m; draw(); sfx.pop(n); say(WORD[n], true); } } }, lab);
  draw();
  return row(btn(PM('-'), -1), col(holder, row(num, word)), btn(PM('+'), 1));
}
/* interactive comparison simulator */
function compareSim(a0 = 7, b0 = 5) {
  let a = a0, b = b0;
  const fa = h('div'), fb = h('div'), w = h('div', { class: 'word', style: { minWidth: '5em', textAlign: 'center', color: 'var(--pink)' } });
  const na = bigNum(a, 'sm'), nb = bigNum(b, 'sm');
  const draw = () => { fa.innerHTML = ''; fb.innerHTML = ''; fa.append(tenFrame(a, { w: 'clamp(140px,20vw,200px)' })); fb.append(tenFrame(b, { w: 'clamp(140px,20vw,200px)', color: () => 'b' })); na.textContent = a; nb.textContent = b; w.textContent = a > b ? 'มากกว่า' : a < b ? 'น้อยกว่า' : 'เท่ากับ'; };
  const ctl = (get, set) => row(h('button', { class: 'btn icon danger ia', 'aria-label': 'ลด', onclick: e => { e.stopPropagation(); set(Math.max(0, get() - 1)); draw(); sfx.pop(get()); say(`${WORD[a]} ${w.textContent} ${WORD[b]}`, true); } }, PM('-')), h('button', { class: 'btn icon primary ia', 'aria-label': 'เพิ่ม', onclick: e => { e.stopPropagation(); set(Math.min(10, get() + 1)); draw(); sfx.pop(get()); say(`${WORD[a]} ${w.textContent} ${WORD[b]}`, true); } }, PM('+')));
  draw();
  return row(col(fa, na, ctl(() => a, v => a = v)), w, col(fb, nb, ctl(() => b, v => b = v)));
}
/* interactive ordering demo */
function orderDemo(nums, dir) {
  const fake = { check: (ok) => { if (ok) { sfx.ok(); say('ถูกต้อง เก่งมาก', true); } else { sfx.no(); say('ลองใหม่นะ', true); } }, say: () => { } };
  const q = Q.order({ nums, dir }); const box = h('div'); q.mount(box, fake); return box;
}
function liveSplit(n) {
  const pw = partWhole(n, n - 2, 2, { w: 'clamp(200px,26vw,260px)' });
  const sp = splitter(n, (a, b) => { pw.set(n, a, b); say(`${WORD[a]} กับ ${WORD[b]}`, true); }, { a: n - 2 });
  return row(col(sp, h('div', { class: 'tap-hint', style: { animation: 'none' } }, 'แตะตัวนับ = ย้ายไปอีกส่วน')), pw);
}
function revealPart(whole, a) {
  const pw = partWhole(whole, a, whole - a, { q: 'b' });
  const c = h('div', { class: 'counters' }); for (let i = 0; i < whole; i++) c.append(h('span', { class: 'counter' + (i < a ? '' : ' b') }));
  const btn = h('button', { class: 'btn accent ia', onclick: e => { e.stopPropagation(); pw.fill(whole - a); btn.remove(); sfx.ok(); say(`${WORD[whole]} แบ่งเป็น ${WORD[a]} กับ ${WORD[whole - a]}`, true); } }, 'แตะเพื่อดูคำตอบ');
  return row(col(pw), col(c, btn));
}
function waysToMake(n, only) {
  const w = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '14px 22px', justifyContent: 'center', maxWidth: '1000px' } });
  for (let a = n; a >= 0; a--) if (!only || only.includes(a)) w.append(partWhole(n, a, n - a, { w: n > 5 ? 'clamp(110px,13vw,150px)' : 'clamp(130px,16vw,180px)', labels: false }));
  w.querySelectorAll('.pw').forEach((p, i) => { p.style.setProperty('--pwf', n > 5 ? 'clamp(20px,2.6vw,28px)' : 'clamp(22px,3vw,34px)'); p.style.animation = `rise .4s var(--ease) ${i * .06}s both`; });
  return w;
}

/* ---------- generic builders shared by several lessons ---------- */
function writingTeach(nums) {
  const it = pick(ITEMS.fruits);
  const steps = [{ t: 'จำนวนหนึ่ง ๆ เขียนได้ <span class="hl">3 แบบ</span> คือ <span class="hl">ตัวเลขฮินดูอารบิก</span> <span class="hl2">ตัวเลขไทย</span> และ <span class="hl3">ตัวหนังสือ</span>', v: el => el.append(triple(nums[nums.length - 1])) }];
  for (const n of nums) {
    const item = n === 0 ? { e: 'cookie', n: 'คุกกี้', c: 'ชิ้น' } : pick(ALL_ITEMS);
    steps.push({ t: n === 0 ? 'จานว่าง ไม่มีคุกกี้เลย จำนวนคือ <span class="hl">ศูนย์</span>' : `มี${item.n} ${n} ${item.c} — จำนวน <span class="hl">${WORD[n]}</span>`, v: el => el.append(n ? objRow(item.e, n, { pop: true, max: '420px' }) : plate('cookie', 0), triple(n)) });
    steps.push({ t: `ดูวิธีเขียนเลข <span class="hl">${n}</span> ให้ถูกลำดับ`, s: `ดูวิธีเขียนเลข ${WORD[n]} ให้ถูกลำดับ`, v: el => el.append(writeDemo(String(n), Math.min(300, innerHeight * .42)), h('div', { class: 'bignum' }, String(n))) });
    steps.push({ t: `ฝึกเขียนเลข <span class="hl">${n}</span> 4 ครั้ง — เส้นประจะจางลงทุกครั้ง ครั้งสุดท้ายเขียนเองเลย!`, s: `ฝึกเขียนเลข ${WORD[n]} สี่ครั้ง เส้นประจะจางลงทุกครั้ง ครั้งสุดท้ายเขียนเองเลย`, v: el => el.append(practicePad({ kind: 'digit', d: String(n) })) });
    steps.push({ t: `เลขไทย <span class="hl2">${thai(n)}</span> อ่านว่า “${WORD[n]}” — เริ่มเขียนที่<b>หัวกลม</b>ก่อน ฝึก 4 ครั้งนะ`, s: `เลขไทย ${WORD[n]} เริ่มเขียนที่หัวกลมก่อน ฝึกสี่ครั้งนะ`, v: el => el.append(h('div', { class: 'bignum th' }, thai(n)), practicePad({ kind: 'text', text: thai(n) }, { free: 'thai' })) });
    steps.push({ t: `ตัวหนังสือ <span class="hl3">“${WORD[n]}”</span> ฝึกเขียน 4 ครั้ง`, s: `ตัวหนังสือ ${WORD[n]} ฝึกเขียนสี่ครั้ง`, v: el => el.append(practicePad({ kind: 'text', text: WORD[n] }, { free: 'word', h: 220 })) });
  }
  steps.push({ t: 'สรุป: จำนวนเดียวกัน เขียนได้ 3 แบบ', v: el => el.append(numTable(nums)) });
  return steps;
}
function writingGame(nums) {
  const pool = range(0, 10), qs = [];
  // free writing (no guide): each number in each form, cue varies
  for (const n of nums) qs.push(Q.freeWrite({ n, ask: 'digit', from: pick(['picture', 'word', 'thai']) }));
  for (const n of nums) qs.push(Q.freeWrite({ n, ask: 'thai', from: pick(['digit', 'picture']) }));
  for (const n of shuffle(nums).slice(0, 2)) qs.push(Q.freeWrite({ n, ask: 'word', from: pick(['digit', 'picture']) }));
  qs.push(Q.formChoice({ n: pick(nums), from: 'word', pool }));
  const mnums = nums.length >= 3 ? nums : shuffle([...nums, ...shuffle(pool.filter(x => !nums.includes(x))).slice(0, 3 - nums.length)]);
  qs.push(Q.matchForms({ nums: mnums, kind: pick(['thai', 'word']) }));
  return qs;
}
function partWholeTeach(lo, hi) {
  const n = hi, a = n - 2;
  return [
    { t: `มีตัวนับ ${n} ตัว เป็นสีแดง ${a} ตัว และสีฟ้า 2 ตัว`, v: el => { const c = h('div', { class: 'counters' }); for (let i = 0; i < n; i++) c.append(h('span', { class: 'counter pop' + (i < a ? '' : ' b'), style: { animation: `popIn .4s var(--spring) ${i * .1}s both` } })); el.append(c); } },
    { t: `${a} กับ 2 เรียกว่า <span class="hl">ส่วนย่อย</span> รวมกันได้ ${n} เรียกว่า <span class="hl">ส่วนรวม</span>`, v: el => el.append(partWhole(n, a, 2)) },
    { t: `ลอง<b>แตะตัวนับ</b>เพื่อย้ายไปอีกส่วน ดูสิว่าส่วนย่อยเปลี่ยนไปอย่างไร แต่ส่วนรวมยังเป็น ${n} เสมอ`, s: `ลองแตะตัวนับเพื่อย้ายไปอีกส่วน ส่วนรวมยังเป็น ${WORD[n]} เสมอ`, v: el => el.append(liveSplit(n)) },
    { t: `${n} แบ่งเป็นส่วนย่อยได้หลายแบบ`, v: el => el.append(waysToMake(n)) },
    { t: lo === 0 ? 'ถ้าแบ่ง 4 เป็น 1 กับ 3 แล้ว 0 ล่ะ? 4 แบ่งเป็น 4 กับ 0 ได้ด้วยนะ' : `ลองดู ${lo + 1} แบ่งได้แบบไหนบ้าง`, v: el => el.append(waysToMake(lo === 0 ? 4 : lo + 1)) },
    { t: 'ถ้ารู้ส่วนรวมและส่วนย่อย 1 ส่วน ก็หาอีกส่วนได้ — ลองนับตัวนับสีฟ้าดูนะ', v: el => { const w = rnd(Math.max(3, lo + 2), hi), a2 = rnd(1, w - 1); el.append(revealPart(w, a2)); } },
    { t: 'เข้าใจแล้วไปเล่นเกมกัน!', v: el => el.append(mascot('wow', 'big')) }
  ];
}
function partWholeGame(lo, hi) {
  const W = () => rnd(Math.max(lo, 2), hi);
  const q = [];
  let w = W(); q.push(Q.partWhole({ whole: w, a: rnd(1, w - 1), q: 'b' }));
  w = W(); q.push(Q.partWhole({ whole: w, a: rnd(0, w), q: 'a' }));
  w = W(); q.push(Q.partWhole({ whole: w, a: rnd(1, w - 1), q: 'whole' }));
  w = W(); q.push(Q.split({ whole: w, a: rnd(1, w - 1) }));
  w = W(); q.push(Q.partWhole({ whole: w, a: rnd(1, w - 1), q: 'b', counters: false }));
  w = W(); q.push(Q.split({ whole: w, a: rnd(0, w) }));
  w = W(); q.push(Q.partWhole({ whole: w, a: rnd(1, w - 1), q: pick(['a', 'b']), counters: false, pen: true }));
  return q;
}

const LESSONS_CH1 = [
  {
    id: 1, title: 'การนับหนึ่งถึงห้า และศูนย์', short: 'นับ 1–5 และ 0', tone: 'yellow',
    goal: 'นับสิ่งต่าง ๆ ที่มีจำนวน 1 ถึง 5 ได้ และบอกได้ว่า “ไม่มีเลย” คือ 0 (ศูนย์)',
    teach: [
      { t: 'สวัสดีจ้ะ! เราคือ <b>น้องเจี๊ยบ</b> วันนี้มาฝึก “นับ” กันนะ', v: el => el.append(mascot('happy', 'big')) },
      { t: 'มีแอปเปิล 1 ผล นับว่า <span class="hl">“หนึ่ง”</span>', v: el => el.append(objRow('apple', 1, { pop: true, size: 'clamp(70px,12vw,120px)' }), bigNum(1)) },
      { t: 'เพิ่มอีก 1 ผล นับ หนึ่ง <span class="hl">สอง</span> — มี 2 ผล', v: el => el.append(objRow('apple', 2, { pop: true, size: 'clamp(60px,10vw,110px)' }), bigNum(2)) },
      { t: 'นับต่อ หนึ่ง สอง <span class="hl">สาม</span> — มี 3 ผล', v: el => el.append(objRow('apple', 3, { pop: true, size: 'clamp(56px,9vw,100px)' }), bigNum(3)) },
      { t: 'หนึ่ง สอง สาม <span class="hl">สี่</span> … <span class="hl">ห้า</span>!', v: el => el.append(col(objRow('apple', 4, { pop: true }), h('b', { class: 'word' }, '4')), col(objRow('apple', 5, { pop: true, delay0: .6 }), h('b', { class: 'word' }, '5'))) },
      { t: '<b>ลองแตะนับลูกบอลทีละลูก</b> ลูกที่นับแล้วจะมีตัวเลขติดไว้ จะได้ไม่นับซ้ำ', s: 'ลองแตะนับลูกบอลทีละลูกนะ', v: el => { const o = objRow('ball', 5, { pop: true, size: 'clamp(56px,9vw,96px)' }); const n = bigNum('?', 'sm'); makeCountable(o, c => { n.textContent = c; say('มีลูกบอล ห้า ลูก', true); }); el.append(o, n); } },
      { t: 'ยิ่งนับเพิ่ม จำนวนก็ยิ่ง<span class="hl">มากขึ้นทีละ 1</span>', v: el => el.append(stairs(1, 5)) },
      { t: 'มีคุกกี้ 3 ชิ้น… <b>ลองแตะกินคุกกี้</b>ให้หมดจานสิ', s: 'มีคุกกี้สามชิ้น ลองแตะกินคุกกี้ให้หมดจานสิ', v: el => el.append(zeroPlate('cookie', 3)) },
      { t: 'ไม่มีเลยสักชิ้น เราเรียกว่า <span class="hl">“ศูนย์”</span> เขียนว่า <span class="hl">0</span>', v: el => el.append(plate('cookie', 0), bigNum(0)) },
      { t: 'สรุป: 0 1 2 3 4 5', v: el => el.append(stairs(0, 5, { colors: true })) }
    ],
    game: () => [Q.count({ n: rnd(1, 3) }), Q.hearts({ n: rnd(2, 5) }), Q.count({ n: rnd(4, 5) }), Q.pickGroup({ n: rnd(1, 5), max: 5 }), Q.zeroPick(), Q.count({ n: rnd(3, 5), scatter: true }), Q.hearts({ n: rnd(1, 4) }), Q.count({ n: 0, item: { e: 'cookie', n: 'คุกกี้', c: 'ชิ้น' } })]
  },
  {
    id: 2, title: 'การนับหกถึงสิบ', short: 'นับ 6–10', tone: 'yellow',
    goal: 'นับสิ่งต่าง ๆ ที่มีจำนวน 6 ถึง 10 ได้ โดยนับต่อจาก 5 และใช้กรอบสิบช่วยนับ',
    teach: [
      { t: 'นี่คือ <b>กรอบสิบ</b> มี 10 ช่อง แถวบนเต็มพอดีคือ <span class="hl">5</span>', v: el => el.append(tenFrame(5, { pop: true }), bigNum(5)) },
      { t: '5 เพิ่มอีก 1 เป็น <span class="hl">6 “หก”</span>', v: el => el.append(tenFrame(6, { pop: true, from: 5 }), bigNum(6)) },
      { t: '6 เพิ่มอีก 1 เป็น <span class="hl">7 “เจ็ด”</span>', v: el => el.append(tenFrame(7, { pop: true, from: 6 }), bigNum(7)) },
      { t: '<b>ลองกดปุ่ม + และ −</b> แล้วดูว่าจำนวนเปลี่ยนไปอย่างไร', s: 'ลองกดบวก กดลบ แล้วดูว่าจำนวนเปลี่ยนไปอย่างไร', v: el => el.append(tenAdder(7)) },
      { t: 'เต็มกรอบพอดีเป็น <span class="hl">10 “สิบ”</span>', v: el => el.append(tenFrame(10, { pop: true }), bigNum(10)) },
      { t: '<b>ลองแตะนับ</b> ปลาที่ว่ายกระจายอยู่ทีละตัว จะได้ไม่นับซ้ำ', s: 'ลองแตะนับปลาทีละตัวนะ', v: el => { const f = objField('fish', 8); const n = bigNum('?', 'sm'); makeCountable(f, c => { n.textContent = c; say('มีปลา แปด ตัว', true); }); el.append(f, n); } },
      { t: 'สรุป: 6 7 8 9 10 เพิ่มขึ้นทีละ 1', v: el => el.append(stairs(6, 10, { colors: true })) }
    ],
    game: () => [Q.tenCount({ n: rnd(6, 7) }), Q.count({ n: rnd(6, 8), scatter: true }), Q.hearts({ n: rnd(6, 9), max: 10 }), Q.matchGroups({ nums: shuffle(range(6, 10)).slice(0, 3) }), Q.pickGroup({ n: rnd(6, 10), max: 10 }), Q.tenCount({ n: rnd(8, 10) }), Q.count({ n: rnd(7, 10), scatter: true })]
  },
  { id: 3, title: 'การเขียนตัวเลข และตัวหนังสือแสดงจำนวนหนึ่งและสอง', short: 'เขียน 1 และ 2', tone: 'sky', goal: 'เขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 1 และ 2 ได้', teach: writingTeach([1, 2]), game: () => writingGame([1, 2]) },
  { id: 4, title: 'การเขียนตัวเลข และตัวหนังสือแสดงสามและสี่', short: 'เขียน 3 และ 4', tone: 'sky', goal: 'เขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 3 และ 4 ได้', teach: writingTeach([3, 4]), game: () => writingGame([3, 4]) },
  { id: 5, title: 'การเขียนตัวเลข และตัวหนังสือแสดงจำนวนห้าและศูนย์', short: 'เขียน 5 และ 0', tone: 'sky', goal: 'เขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 5 และ 0 ได้', teach: writingTeach([5, 0]), game: () => writingGame([5, 0]) },
  { id: 6, title: 'การเขียนตัวเลข และตัวหนังสือแสดงจำนวนหกและเจ็ด', short: 'เขียน 6 และ 7', tone: 'sky', goal: 'เขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 6 และ 7 ได้', teach: writingTeach([6, 7]), game: () => writingGame([6, 7]) },
  { id: 7, title: 'การเขียนตัวเลข และตัวหนังสือแสดงจำนวนแปด เก้าและสิบ', short: 'เขียน 8 9 10', tone: 'sky', goal: 'เขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 8, 9 และ 10 ได้', teach: writingTeach([8, 9, 10]), game: () => writingGame([8, 9, 10]) },
  {
    id: 8, title: 'การเปรียบเทียบจำนวนนับโดยการจับคู่', short: 'จับคู่เปรียบเทียบ', tone: 'coral',
    goal: 'เปรียบเทียบจำนวน 2 กลุ่มโดยการจับคู่หนึ่งต่อหนึ่ง และใช้คำว่า มากกว่า น้อยกว่า เท่ากับ ได้',
    teach: [
      { t: 'มี <b>หมู</b> กับ <b>สุนัข</b> อะไรมากกว่ากันนะ? มา<b>จับคู่</b>กัน!', v: el => el.append(pairRows('pig', 6, 'dog', 4)) },
      { t: 'จับคู่ <span class="hl">ทีละ 1 ตัว กับ 1 ตัว</span>', v: el => { const p = pairRows('pig', 6, 'dog', 4); el.append(p); p.autoPair(); } },
      { t: 'หมูเหลือ 2 ตัวที่ไม่มีคู่ จึงพูดว่า <span class="hl">จำนวนหมู มากกว่า จำนวนสุนัข</span>', v: el => { const p = pairRows('pig', 6, 'dog', 4); el.append(p); p.autoPair(60); } },
      { t: 'กลับกัน <span class="hl2">จำนวนสุนัข น้อยกว่า จำนวนหมู</span>', v: el => { const p = pairRows('dog', 4, 'pig', 6); el.append(p); p.autoPair(60); } },
      { t: '<b>ลองจับคู่เองนะ</b> แตะมะม่วง แล้วแตะสตรอว์เบอร์รี (หรือลากเส้น)', s: 'ลองจับคู่เองนะ แตะมะม่วง แล้วแตะสตรอว์เบอร์รี', v: el => { const p = pairRows('mango', 5, 'strawberry', 7, { interactive: true, onDone: () => { sfx.ok(); say('จำนวนมะม่วง น้อยกว่า จำนวนสตรอว์เบอร์รี', true); } }); el.append(p); } },
      { t: 'ถ้าจับคู่ได้พอดี ไม่เหลือเลย แปลว่า <span class="hl3">เท่ากับ</span>', v: el => { const p = pairRows('cat', 5, 'fish', 5); el.append(p); p.autoPair(250); } }
    ],
    game: () => [Q.pairCompare({ a: rnd(5, 7), b: rnd(2, 4) }), Q.pairCompare({ a: rnd(2, 4), b: rnd(5, 7) }), Q.pairCompare((n => ({ a: n, b: n }))(rnd(3, 6))), Q.compareWord({ a: rnd(1, 4), b: rnd(6, 9), show: 'group' }), Q.pairCompare({ a: rnd(6, 8), b: rnd(3, 5) }), Q.compareWord((n => ({ a: n, b: n, show: 'group' }))(rnd(3, 7)))]
  },
  {
    id: 9, title: 'การเปรียบเทียบจำนวนนับ 1 ถึง 10 และ 0', short: 'มากกว่า น้อยกว่า', tone: 'coral',
    goal: 'เปรียบเทียบจำนวน 0 ถึง 10 และใช้คำว่า มากกว่า น้อยกว่า เท่ากับ ได้ถูกต้อง',
    teach: [
      { t: 'เปรียบเทียบ <b>7</b> กับ <b>5</b> ด้วยการจับคู่', v: el => { const p = pairRows('dotA', 7, 'dotB', 5); el.append(p); p.autoPair(250); } },
      { t: '7 เหลือ 2 ที่ไม่มีคู่ — <span class="hl">7 มากกว่า 5</span> และ <span class="hl2">5 น้อยกว่า 7</span>', v: el => el.append(row(bigNum(7, 'sm'), h('div', { class: 'word' }, 'มากกว่า'), bigNum(5, 'sm'))) },
      { t: 'บน<b>เส้นจำนวน</b> ยิ่งไปทางขวา จำนวนยิ่ง<span class="hl">มาก</span>', v: el => el.append(numberLine(0, 10, { hi: [7], hi2: [5] })) },
      { t: '<span class="hl">0</span> คือไม่มีเลย จึง<span class="hl">น้อยกว่า</span>ทุกจำนวน', v: el => el.append(numberLine(0, 10, { hi: [0] })) },
      { t: 'เขียนแทนคำด้วย<b>เครื่องหมาย</b>ได้: <span class="hl">&gt;</span> อ่านว่า “มากกว่า”', s: 'เครื่องหมายนี้ อ่านว่า มากกว่า เจ็ดมากกว่าห้า', v: el => el.append(eqRow([7, '>', 5]), h('div', { class: 'word' }, '7 มากกว่า 5')) },
      { t: '<span class="hl2">&lt;</span> อ่านว่า “น้อยกว่า” — ปากของเครื่องหมายจะอ้าไปทางจำนวนที่มากกว่าเสมอ', s: 'เครื่องหมายนี้ อ่านว่า น้อยกว่า ห้าน้อยกว่าเจ็ด', v: el => el.append(eqRow([5, '<', 7]), h('div', { class: 'word' }, '5 น้อยกว่า 7')) },
      { t: '<span class="hl3">=</span> อ่านว่า “เท่ากับ” และ <span class="hl">≠</span> อ่านว่า “ไม่เท่ากับ”', s: 'เครื่องหมายเท่ากับ และ ไม่เท่ากับ', v: el => el.append(h('div', { class: 'colstack' }, eqRow([4, '=', 4]), eqRow([5, '≠', 8]))) },
      { t: '<b>ลองกดปุ่ม + และ −</b> ทั้งสองฝั่ง แล้วดูคำเปรียบเทียบตรงกลาง', s: 'ลองกดบวก ลบ ทั้งสองฝั่ง แล้วดูคำเปรียบเทียบตรงกลาง', v: el => el.append(compareSim(7, 5)) },
      { t: 'จำนวนเท่ากัน เช่น <span class="hl3">4 เท่ากับ 4</span>', v: el => el.append(row(tenFrame(4, { w: '170px' }), h('div', { class: 'word' }, 'เท่ากับ'), tenFrame(4, { w: '170px', color: () => 'b' }))) }
    ],
    game: () => {
      const p = () => { let a = rnd(0, 10), b = rnd(0, 10); return { a, b }; };
      return [Q.compareWord({ ...p() }), Q.compareWord({ a: rnd(6, 10), b: rnd(0, 5) }), Q.compareWord({ ...p(), show: 'group' }), Q.extreme({ nums: shuffle(range(0, 10)).slice(0, 4), which: 'max' }), Q.compareWord({ a: 0, b: rnd(1, 9) }), Q.extreme({ nums: shuffle(range(0, 10)).slice(0, 4), which: 'min' }), Q.compareWord((n => ({ a: n, b: n }))(rnd(1, 10)))];
    }
  },
  {
    id: 10, title: 'การเรียงลำดับจำนวนนับ 1 ถึง 10 และ 0', short: 'เรียงลำดับ', tone: 'mint',
    goal: 'เรียงลำดับจำนวน 0 ถึง 10 จากน้อยไปมาก และจากมากไปน้อยได้',
    teach: [
      { t: 'บนเส้นจำนวน จำนวนเรียง<span class="hl">จากน้อยไปมาก</span> เพิ่มขึ้นทีละ 1', v: el => el.append(numberLine(0, 10)) },
      { t: 'จำนวนที่<span class="hl">มากกว่า 6 อยู่ 1</span> คือ 7 และ<span class="hl2">น้อยกว่า 6 อยู่ 1</span> คือ 5', v: el => el.append(numberLine(0, 10, { hi: [6], hi2: [5, 7] })) },
      { t: 'เรียง 8 5 6 <b>จากน้อยไปมาก</b>: หาจำนวนที่น้อยที่สุดวางก่อน → <span class="hl">5 6 8</span>', v: el => el.append(row(...[5, 6, 8].map((n, i) => h('div', { class: 'ncard', style: { animation: `rise .4s var(--ease) ${i * .3}s both` } }, n)))) },
      { t: 'เรียง<b>จากมากไปน้อย</b>: หาจำนวนที่มากที่สุดวางก่อน → <span class="hl">8 6 5</span>', v: el => el.append(row(...[8, 6, 5].map((n, i) => h('div', { class: 'ncard', style: { animation: `rise .4s var(--ease) ${i * .3}s both` } }, n)))) },
      { t: '<b>ลองเรียงเอง</b> จากน้อยไปมาก แตะการ์ดตามลำดับนะ', s: 'ลองเรียงเอง จากน้อยไปมาก', v: el => el.append(orderDemo([3, 9, 1], 'asc')) }
    ],
    game: () => [Q.order({ nums: shuffle(range(0, 10)).slice(0, 3), dir: 'asc' }), Q.beforeAfter({ n: rnd(1, 9), dir: 'more' }), Q.order({ nums: shuffle(range(0, 10)).slice(0, 3), dir: 'desc' }), Q.missingSeq({ start: rnd(0, 6) }), Q.order({ nums: shuffle(range(0, 10)).slice(0, 4), dir: 'asc' }), Q.beforeAfter({ n: rnd(1, 10), dir: 'less' }), Q.order({ nums: shuffle(range(0, 10)).slice(0, 4), dir: 'desc' }), Q.missingSeq({ start: rnd(0, 6), desc: true })]
  },
  { id: 11, title: 'ความสัมพันธ์ของจำนวนแบบส่วนย่อย – ส่วนรวมของจำนวน 0 ถึง 5', short: 'ส่วนย่อย-ส่วนรวม 0–5', tone: 'lilac', goal: 'บอกความสัมพันธ์แบบส่วนย่อย–ส่วนรวมของจำนวน 0 ถึง 5 และหาส่วนที่หายไปได้', teach: partWholeTeach(0, 5), game: () => partWholeGame(0, 5) },
  { id: 12, title: 'ความสัมพันธ์ของจำนวนแบบส่วนย่อย – ส่วนรวมของจำนวน 6 ถึง 10', short: 'ส่วนย่อย-ส่วนรวม 6–10', tone: 'lilac', goal: 'บอกความสัมพันธ์แบบส่วนย่อย–ส่วนรวมของจำนวน 6 ถึง 10 และหาส่วนที่หายไปได้', teach: partWholeTeach(5, 10), game: () => partWholeGame(6, 10) },
  {
    id: 13, bonus: true, title: 'ด่านพิเศษ: การบอกจำนวนโดยไม่ต้องนับ', short: 'บอกจำนวนไม่ต้องนับ', tone: 'orange',
    goal: 'บอกจำนวนจากรูปแบบจุด (ลูกเต๋า กรอบสิบ) ได้ทันทีโดยไม่ต้องนับทีละหนึ่ง',
    teach: [
      { t: 'บางทีเราดูแล้วรู้จำนวนได้เลย <b>ไม่ต้องนับ</b> เช่น ลูกเต๋า', v: el => el.append(...[1, 2, 3, 4, 5, 6].map(n => col(dice(n, 'clamp(70px,11vw,110px)'), h('b', { class: 'word' }, n)))) },
      { t: 'กรอบสิบ: แถวบนเต็มคือ <span class="hl">5</span> เลยไม่ต้องนับ', v: el => el.append(tenFrame(5), bigNum(5, 'sm')) },
      { t: '5 กับอีก 2 เป็น <span class="hl">7</span>', v: el => el.append(tenFrame(7), bigNum(7, 'sm')) },
      { t: 'เต็มกรอบเหลือว่าง 1 ช่อง คือ <span class="hl">9</span>', v: el => el.append(tenFrame(9), bigNum(9, 'sm')) },
      { t: 'ในเกม ภาพจะโผล่มา<b>แป๊บเดียว</b> ดูให้ดีนะ!', v: el => el.append(mascot('wow', 'big')) }
    ],
    game: () => [Q.flash({ n: rnd(2, 5), ms: 1800 }), Q.flashPick({ n: rnd(5, 8) }), Q.flash({ n: rnd(5, 8) }), Q.matchGroups({ nums: shuffle(range(2, 9)).slice(0, 3), flash: true }), Q.flash({ n: rnd(6, 10), ms: 1500 }), Q.flashPick({ n: rnd(7, 10) })]
  }
];

/* ---------- Chapter 1 boss: ข้อสอบท้ายหน่วย — แต่งใหม่ทั้งหมด (original items) ---------- */
const P = (k, n) => ({ pic: [k, n] });
/* practice-set exams: rotate options so the right answer is not always ก */
const spread = ex => ex.map((q, i) => { const r = i % q.opts.length; return r ? { ...q, opts: [...q.opts.slice(r), ...q.opts.slice(0, r)], a: (q.a - r + q.opts.length) % q.opts.length } : q; });
const EXAM_CH1 = xrot([
  { q: 'ภาพในข้อใดมีจำนวนน้อยกว่า 4', opts: [P('circle', 6), P('heart', 3), P('star', 5)], a: 1 },
  { q: '7 เขียนเป็นตัวเลขไทยได้อย่างไร', opts: ['๓', '๗', '๙'], a: 1 },
  { q: 'ข้อใดแสดงจำนวนเดียวกัน', opts: ['๘  8', '๖  9', '๓  2'], a: 0 },
  { q: 'ภาพใดมีจำนวนเท่ากับ 6', opts: [P('star', 6), P('heart', 8), P('circle', 4)], a: 0 },
  { q: 'ภาพใดมีจำนวนน้อยที่สุด', opts: [P('flower', 5), P('triangle', 1), P('heart', 3)], a: 1 },
  { q: 'ข้อใดมีค่าไม่เท่ากับข้ออื่น', opts: ['สี่', '๔', '6'], a: 2 },
  { q: 'ภาพใดมีจำนวนมากที่สุด', opts: [P('circle', 5), P('triangle', 8), P('flower', 6)], a: 1 },
  { q: '3  4  5  ☐  7  8 ควรเติมตัวเลขใดลงในช่องว่าง', opts: ['9', '6', '2'], a: 1 },
  { q: 'ข้อใดถูกต้อง', opts: ['6 > 4', '3 > 5', '9 < 8'], a: 0, legend: true },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['4 < 6', '10 > 2', '7 = 9'], a: 2, legend: true },
  { q: 'ใครมีลูกแก้วน้อยที่สุด', opts: ['ต้นมีลูกแก้ว 6 ลูก', 'ฝนมีลูกแก้ว 2 ลูก', 'บีมมีลูกแก้ว 8 ลูก'], a: 1 },
  { q: 'ข้อใดเรียงลำดับจำนวนจากมากไปน้อย', opts: ['6  5  4  3', '2  3  4  5', '8  6  7  5'], a: 0 },
  { q: 'ข้อใดเรียงลำดับจำนวนจากน้อยไปมาก', opts: ['7  6  5  4', '0  1  2  3', '1  3  2  4'], a: 1 },
  { q: 'ภาพข้อใดแสดงจำนวน 0  4  2', opts: [{ boxes: [null, ['star', 4], ['heart', 2]] }, { boxes: [['star', 4], null, ['heart', 2]] }, { boxes: [null, ['heart', 2], ['star', 4]] }], a: 0 },
  { q: '๗ กับ 7 แตกต่างกันในเรื่องใด', opts: ['ค่าของจำนวน', 'รูปแบบการเขียนตัวเลข', 'จำนวนสิ่งของที่แสดง'], a: 1 }
], 1);
LESSONS_CH1.push({
  id: 14, boss: true, title: 'ด่านบอส: ข้อสอบหน่วยที่ 1 จำนวน 1 ถึง 10 และ 0', short: 'ด่านบอส · ข้อสอบ', tone: 'lilac',
  goal: 'ทำข้อสอบท้ายหน่วยที่ 1 จำนวน 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอสและเปิดเมืองถัดไป',
  exam: EXAM_CH1, pass: 8, bossName: 'ราชาปีศาจตัวเลข', bossPal: 'lilac', emblem: '10'
});

/* =========================================================
   CHAPTER 2 — การบวกจำนวนสองจำนวนที่ผลบวกไม่เกิน 10
   ========================================================= */
function revealBtn(eq, v, pw) {
  const btn = h('button', { class: 'btn accent ia', onclick: ev => { ev.stopPropagation(); eq.fill(v); pw && pw.fill(v); btn.remove(); sfx.ok(); say(String(v), true); } }, icon('eye'), 'แตะเพื่อดูคำตอบ');
  return h('div', { class: 'colstack' }, eq, btn);
}
function mergeDemo(e, a, b) { // tap to push two groups together
  const left = groupBox(e, a, `${a}`), right = groupBox(e, b, `${b}`, { delay0: .3 });
  const st = h('div', { class: 'story' }, left, h('div', { class: 'verb' }, h('span', null, 'รวมกับ')), right);
  const res = h('div', { class: 'colstack', style: { display: 'none' } });
  const btn = h('button', { class: 'btn accent ia', onclick: ev => { ev.stopPropagation(); btn.remove(); st.classList.add('merge');
    setTimeout(() => { st.replaceWith(groupBox(e, a + b, `${a} รวมกับ ${b} เป็น ${a + b}`, { count: true, max: '420px' })); res.style.display = ''; sfx.ok(); say(`${WORD[a]} รวมกับ ${WORD[b]} เป็น ${WORD[a + b]}`, true); }, 450); } }, icon('plus'), 'รวมกัน');
  res.append(bigNum(a + b, 'sm'));
  return h('div', { class: 'colstack' }, st, btn, res);
}
function countOn(a, b) { // number-line hops from a
  const nl = numberLine(0, a + b > 10 ? 20 : 10, { hi: [a] }); const ticks = nl.querySelectorAll('.tick');
  const btn = h('button', { class: 'btn info ia', onclick: async ev => { ev.stopPropagation(); btn.disabled = true; for (let k = 1; k <= b; k++) { await sleep(600); ticks[a + k].classList.add('hi2'); sfx.pop(k); say(WORD[a + k], true); } await sleep(500); ticks[a + b].classList.remove('hi2'); ticks[a + b].classList.add('hi'); } }, icon('play'), `นับต่อจาก ${a}`);
  return h('div', { class: 'colstack' }, nl, btn);
}
function addMachine(a0 = 3, b0 = 4) { // live addition simulator
  let a = a0, b = b0; const tf = h('div'), e = h('div');
  const draw = () => { tf.innerHTML = ''; tf.append(tenFrame2(a, b, { w: 'clamp(220px,28vw,300px)' })); e.innerHTML = ''; e.append(eqRow([a, '+', b, '=', a + b])); };
  const ctl = (lab, get, set, cls) => h('div', { class: 'colstack', style: { gap: '6px' } }, h('div', { class: 'cap' }, lab), h('div', { class: 'rowstack', style: { gap: '8px' } },
    h('button', { class: 'btn icon sm ia', onclick: ev => { ev.stopPropagation(); if (get() > 0) { set(get() - 1); draw(); sfx.pop(a + b); say(`${WORD[a]} บวก ${WORD[b]} เท่ากับ ${WORD[a + b]}`, true); } } }, PM('-')),
    h('button', { class: 'btn icon sm ia ' + cls, onclick: ev => { ev.stopPropagation(); if (a + b < 10) { set(get() + 1); draw(); sfx.pop(a + b); say(`${WORD[a]} บวก ${WORD[b]} เท่ากับ ${WORD[a + b]}`, true); } } }, PM('+'))));
  draw();
  return h('div', { class: 'colstack' }, e, h('div', { class: 'rowstack' }, ctl('ตัวตั้ง (แดง)', () => a, v => a = v, 'danger'), tf, ctl('ตัวบวก (ฟ้า)', () => b, v => b = v, 'info')));
}
function makeTenToy() { // tap counters in a full frame to recolour → a + b = 10
  const st = Array(10).fill(0).map((_, i) => i < 6 ? 0 : 1), f = h('div', { class: 'tf ia', style: { '--tfw': 'clamp(240px,32vw,340px)' } }), e = h('div');
  const draw = () => { const a = st.filter(x => !x).length; e.innerHTML = ''; e.append(eqRow([a, '+', 10 - a, '=', 10])); };
  st.forEach((v, i) => { const c = h('span'); const d = h('i', { class: 'dot' + (v ? ' b' : '') }); c.append(d); c.style.cursor = 'pointer'; c.onclick = ev => { ev.stopPropagation(); st[i] ^= 1; d.className = 'dot' + (st[i] ? ' b' : ''); sfx.pop(i); draw(); const a = st.filter(x => !x).length; say(`${WORD[a]} บวก ${WORD[10 - a]} เท่ากับ สิบ`, true); }; f.append(c); });
  draw(); return h('div', { class: 'colstack' }, f, e);
}
function dominoFlip(a, b) {
  let flipped = false; const box = h('div'), e = h('div');
  const draw = () => { box.innerHTML = ''; const [x, y] = flipped ? [b, a] : [a, b]; box.append(domino(x, y)); e.innerHTML = ''; e.append(eqRow([x, '+', y, '=', a + b])); };
  const btn = h('button', { class: 'btn info ia', onclick: ev => { ev.stopPropagation(); flipped = !flipped; box.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }], { duration: 400, easing: 'cubic-bezier(.22,1,.36,1)' }); setTimeout(draw, 200); sfx.page(); say(flipped ? `${WORD[b]} บวก ${WORD[a]} ก็เท่ากับ ${WORD[a + b]}` : `${WORD[a]} บวก ${WORD[b]} เท่ากับ ${WORD[a + b]}`, true); } }, icon('replay'), 'หมุนโดมิโน');
  draw(); return h('div', { class: 'colstack' }, box, e, btn);
}
function liveSplitAdd(n) {
  const e = h('div'), pw = partWhole(n, n - 3, 3, { w: 'clamp(190px,22vw,240px)' });
  const draw = (a, b) => { pw.set(n, a, b); e.innerHTML = ''; e.append(h('div', { class: 'colstack', style: { gap: '8px' } }, eqRow([a, '+', b, '=', n], { sm: true }), eqRow([b, '+', a, '=', n], { sm: true }))); };
  const sp = splitter(n, (a, b) => { draw(a, b); say(`${WORD[a]} บวก ${WORD[b]} เท่ากับ ${WORD[n]}`, true); }, { a: n - 3 });
  draw(n - 3, 3); return h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, sp, pw), e);
}
const LESSONS_CH2 = [
  {
    id: 21, no: 1, title: 'การรวมจำนวนสองจำนวน', short: 'รวมจำนวน', tone: 'coral',
    goal: 'หาผลรวมของจำนวนสองจำนวนได้ โดยการนับรวม และการนับต่อ',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองบวกเลข</b>! ที่นี่เราจะเรียนเรื่อง <span class="hl">การรวม</span>', v: el => el.append(mascot('wow', 'big')) },
      { t: 'มีคุกกี้ 2 กล่อง กล่องแรก 4 ชิ้น กล่องที่สอง 5 ชิ้น', v: el => el.append(h('div', { class: 'story' }, groupBox('cookie', 4, '4 ชิ้น'), groupBox('cookie', 5, '5 ชิ้น', { delay0: .4 }))) },
      { t: '<b>แตะปุ่ม “รวมกัน”</b> แล้วนับคุกกี้ทั้งหมดดูนะ', s: 'แตะปุ่มรวมกัน แล้วนับคุกกี้ทั้งหมดดูนะ', v: el => el.append(mergeDemo('cookie', 4, 5)) },
      { t: '<span class="hl">4 รวมกับ 5 เป็น 9</span> — การนำของมารวมกัน เรียกว่า <b>การรวม</b>', v: el => el.append(h('div', { class: 'word' }, '4 รวมกับ 5 เป็น 9'), tenFrame2(4, 5)) },
      { t: 'วิธีลัด: <b>นับต่อ</b> เริ่มที่ 5 แล้วนับต่ออีก 4 → 6 7 8 9', s: 'วิธีลัด นับต่อ เริ่มที่ห้า แล้วนับต่ออีกสี่ หก เจ็ด แปด เก้า', v: el => el.append(countOn(5, 4)) },
      { t: '<span class="hl">มีอยู่ 5 เพิ่มอีก 2 เป็น 7</span> — “เพิ่มอีก” ก็คือการรวมเหมือนกัน', v: el => el.append(storyStrip('orange', 5, 'เพิ่มอีก', 'orange', 2), bigNum(7, 'sm')) }
    ],
    game: () => [Q.combine({ a: rnd(1, 4), b: rnd(1, 4) }), Q.combine({ a: rnd(2, 5), b: rnd(2, 5), item: pick(ITEMS.fruits) }), Q.addMore({ a: rnd(3, 6), b: rnd(1, 3) }), Q.drawSum({ a: rnd(1, 4), b: rnd(1, 4) }), Q.combine((a => ({ a, b: rnd(1, 10 - a) }))(rnd(3, 7))), Q.addMore({ a: rnd(5, 7), b: rnd(2, 3), pen: true }), Q.drawSum({ a: 5, b: rnd(2, 5) })]
  },
  {
    id: 22, no: 2, title: 'การบวกและประโยคสัญลักษณ์การบวก', short: 'ประโยคสัญลักษณ์', tone: 'coral',
    goal: 'เขียนประโยคสัญลักษณ์แสดงการบวก อ่าน และหาผลบวกได้ รวมถึงการบวกด้วย 0 และการบวกจำนวนเดียวกัน',
    teach: [
      { t: '“2 รวมกับ 3 เป็น 5” เขียนเป็น<b>ประโยคสัญลักษณ์</b>ได้ว่า', s: 'สองรวมกับสามเป็นห้า เขียนเป็นประโยคสัญลักษณ์ได้ว่า', v: el => el.append(h('div', { class: 'story' }, groupBox('apple', 2), h('div', { class: 'verb' }, icon('plus')), groupBox('apple', 3, null, { delay0: .3 })), eqRow([2, '+', 3, '=', 5])) },
      { t: '<span class="hl">+</span> อ่านว่า “บวก” และ <span class="hl3">=</span> อ่านว่า “เท่ากับ” → อ่านว่า <b>สองบวกสามเท่ากับห้า</b>', v: el => el.append(eqRow([2, '+', 3, '=', 5])) },
      { t: 'แต่ละตัวมีชื่อ: <b>ตัวตั้ง</b> + <b>ตัวบวก</b> = <b>ผลบวก</b>', v: el => el.append(eqRow([2, '+', 3, '=', 5], { labels: true })) },
      { t: '<b>ลองกด + และ −</b> เปลี่ยนตัวตั้งกับตัวบวก แล้วดูผลบวกเปลี่ยนตาม', s: 'ลองกดบวก และลบ เปลี่ยนตัวตั้งกับตัวบวก แล้วดูผลบวก', v: el => el.append(addMachine(3, 4)) },
      { t: 'เขียน<b>ตั้งบวก</b>แนวตั้งก็ได้ ผลบวกเหมือนกัน', v: el => el.append(eqRow([4, '+', 3, '=', 7]), vertical(4, 3, 7)) },
      { t: '<b>บวกด้วย 0</b> ได้เท่าเดิม: 6 + 0 = 6', v: el => el.append(h('div', { class: 'story' }, groupBox('star', 6), h('div', { class: 'verb' }, icon('plus')), h('div', { class: 'box gbox' }, h('div', { class: 'cap' }, 'ไม่มีเลย'))), eqRow([6, '+', 0, '=', 6])) },
      { t: '<b>บวกจำนวนเดียวกัน</b> เช่น 4 + 4 = 8', v: el => el.append(h('div', { class: 'story' }, groupBox('strawberry', 4), h('div', { class: 'verb' }, icon('plus')), groupBox('strawberry', 4, null, { delay0: .3 })), eqRow([4, '+', 4, '=', 8])) }
    ],
    game: () => [Q.buildSentence({ a: rnd(1, 4), b: rnd(1, 4) }), Q.pickSentence({ a: rnd(1, 5), b: rnd(1, 4) }), Q.addFact({ a: rnd(1, 5), b: rnd(1, 4), frame: true }), Q.addFact({ a: rnd(1, 10), b: 0 }), Q.addFact((n => ({ a: n, b: n }))(rnd(1, 5))), Q.buildSentence({ a: rnd(3, 6), b: rnd(1, 4) }), Q.addFact({ a: rnd(2, 6), b: rnd(1, 3), vert: true, pen: true }), Q.matchSums()]
  },
  {
    id: 23, no: 3, title: 'การบวกที่ผลบวกเป็น 10', short: 'ผลบวกเป็น 10', tone: 'coral',
    goal: 'บอกจำนวนสองจำนวนที่รวมกันได้ 10 และหาผลบวกที่เป็น 10 ได้',
    teach: [
      { t: 'กรอบสิบเต็มพอดีคือ <span class="hl">10</span> — แดง 6 กับ ฟ้า 4 รวมเป็น 10', v: el => el.append(tenFrame2(6, 4, { w: 'clamp(240px,32vw,340px)' }), eqRow([6, '+', 4, '=', 10])) },
      { t: '<b>ลองแตะตัวนับ</b>เพื่อเปลี่ยนสี ดูว่ามีกี่แบบที่รวมกันได้ 10', s: 'ลองแตะตัวนับเพื่อเปลี่ยนสี ดูว่ามีกี่แบบที่รวมกันได้สิบ', v: el => el.append(makeTenToy()) },
      { t: 'คู่ที่รวมกันได้ 10 — จำไว้ใช้บ่อย ๆ นะ', v: el => { const w = h('div', { class: 'tens-list' }); for (let a = 0; a <= 10; a++) w.append(eqRow([a, '+', 10 - a, '=', 10], { sm: true })); el.append(w); } },
      { t: '<b>7 + ? = 10</b> นับช่องที่ยังว่างในกรอบสิบ', s: 'เจ็ดบวกอะไรได้สิบ นับช่องที่ยังว่าง', v: el => el.append(tenFrame(7, { w: 'clamp(240px,32vw,340px)' }), revealBtn(eqRow([7, '+', '?', '=', 10]), 3)) }
    ],
    game: () => [Q.makeTen({ a: rnd(1, 9) }), Q.findTens(), Q.addFact((a => ({ a, b: 10 - a, frame: true }))(rnd(1, 9))), Q.makeTen({ a: rnd(2, 8) }), Q.matchSums(), Q.findTens(), Q.makeTen({ a: rnd(0, 10) })]
  },
  {
    id: 24, no: 4, title: 'ความสัมพันธ์ของจำนวนแบบส่วนย่อย – ส่วนรวม กับการบวก', short: 'ส่วนย่อย-ส่วนรวม กับการบวก', tone: 'coral',
    goal: 'เขียนประโยคสัญลักษณ์การบวกจากแผนภาพส่วนย่อย–ส่วนรวม และหาจำนวนที่หายไปได้',
    teach: [
      { t: 'จำแผนภาพนี้ได้ไหม? 3 กับ 4 เป็น<b>ส่วนย่อย</b> รวมกันได้ 7 เป็น<b>ส่วนรวม</b>', v: el => el.append(partWhole(7, 3, 4)) },
      { t: 'ส่วนย่อย + ส่วนย่อย = ส่วนรวม → <span class="hl">3 + 4 = 7</span> และ <span class="hl2">4 + 3 = 7</span>', v: el => el.append(partWhole(7, 3, 4, { w: 'clamp(200px,24vw,260px)' }), h('div', { class: 'colstack' }, eqRow([3, '+', 4, '=', 7]), eqRow([4, '+', 3, '=', 7]))) },
      { t: '<b>ลองแตะตัวนับ</b> ดูประโยคสัญลักษณ์เปลี่ยนตามส่วนย่อย', s: 'ลองแตะตัวนับ ดูประโยคสัญลักษณ์เปลี่ยนตามส่วนย่อย', v: el => el.append(liveSplitAdd(8)) },
      { t: 'ถ้าส่วนย่อยหายไป ใช้ส่วนรวมช่วยหา: <b>2 + ? = 6</b>', v: el => { const pw = partWhole(6, 2, 4, { q: 'b' }); el.append(pw, revealBtn(eqRow([2, '+', '?', '=', 6]), 4, pw)); } }
    ],
    game: () => { const W = () => rnd(3, 10); return [Q.pwSentence({ whole: W(), a: 2, miss: 'c' }), Q.pwSentence((w => ({ whole: w, a: rnd(1, w - 1), miss: 'b' }))(W())), Q.pwSentence((w => ({ whole: w, a: rnd(1, w - 1), miss: 'a' }))(W())), Q.partWhole((w => ({ whole: w, a: rnd(1, w - 1), q: 'whole' }))(W())), Q.pwSentence((w => ({ whole: w, a: rnd(0, w), miss: pick(['a', 'b']) }))(W())), Q.split((w => ({ whole: w, a: rnd(1, w - 1) }))(rnd(5, 10)))]; }
  },
  {
    id: 25, no: 5, title: 'การสลับที่ของการบวก', short: 'สลับที่การบวก', tone: 'coral',
    goal: 'บอกได้ว่าการสลับที่ตัวตั้งกับตัวบวก ผลบวกยังเท่าเดิม และใช้ช่วยหาผลบวก',
    teach: [
      { t: 'โดมิโนนี้มี 2 จุด กับ 5 จุด → <span class="hl">2 + 5 = 7</span>', v: el => el.append(domino(2, 5), eqRow([2, '+', 5, '=', 7])) },
      { t: '<b>ลองหมุนโดมิโน</b> — กลายเป็น 5 + 2 แต่ยังได้ 7 เท่าเดิม!', s: 'ลองหมุนโดมิโน กลายเป็นห้าบวกสอง แต่ยังได้เจ็ดเท่าเดิม', v: el => el.append(dominoFlip(2, 5)) },
      { t: '<b>สลับที่</b>ตัวตั้งกับตัวบวก <span class="hl">ผลบวกเท่าเดิม</span>: 2 + 5 = 5 + 2', v: el => el.append(eqRow([2, '+', 5, '=', 5, '+', 2])) },
      { t: 'เคล็ดลับ: เริ่มจาก<b>จำนวนที่มาก</b>แล้วนับต่อ 1 + 8 → เริ่มที่ 8 นับต่อ 9', v: el => el.append(eqRow([1, '+', 8, '=', 8, '+', 1], { sm: true }), countOn(8, 1)) }
    ],
    game: () => [Q.swap({ a: rnd(1, 4), b: rnd(5, 6) }), Q.sameSum({ a: rnd(1, 4), b: rnd(2, 5) }), Q.swap({ a: rnd(2, 5), b: rnd(1, 4) }), Q.addFact({ a: 1, b: rnd(6, 9) }), Q.sameSum({ a: rnd(3, 6), b: rnd(1, 3) }), Q.matchSums(), Q.swap({ a: rnd(0, 3), b: rnd(4, 7) })]
  },
  {
    id: 26, no: 6, title: 'สถานการณ์การบวก', short: 'สถานการณ์การบวก', tone: 'coral',
    goal: 'บอกสถานการณ์ที่เป็นการบวก (การรวม การเพิ่ม) และเขียนประโยคสัญลักษณ์จากสถานการณ์ได้',
    teach: [
      { t: 'ในบ่อมีเป็ด... เอ๊ย! มีปลา 3 ตัว แล้ว<span class="hl">ว่ายมาเพิ่ม</span>อีก 2 ตัว', s: 'ในบ่อมีปลาสามตัว แล้วว่ายมาเพิ่มอีกสองตัว', v: el => el.append(storyStrip('fish', 3, 'มาเพิ่ม', 'fish', 2)) },
      { t: 'มีปลาทั้งหมดเท่าไร? → <span class="hl">3 + 2 = 5</span>', v: el => el.append(storyStrip('fish', 3, 'มาเพิ่ม', 'fish', 2), eqRow([3, '+', 2, '=', 5])) },
      { t: 'แอปเปิล 4 ผล กับ ลูกแพร์ 3 ผล <span class="hl">รวมกัน</span>เป็นผลไม้ 7 ผล', v: el => el.append(h('div', { class: 'story' }, groupBox('apple', 4, 'แอปเปิล'), h('div', { class: 'verb' }, h('span', null, 'รวมกับ')), groupBox('pear', 3, 'ลูกแพร์', { delay0: .3 })), eqRow([4, '+', 3, '=', 7])) },
      { t: 'คำที่บอกว่าเป็น<b>การบวก</b>: <span class="hl">เพิ่ม</span> <span class="hl">อีก</span> <span class="hl">รวม</span> <span class="hl">ทั้งหมด</span>', v: el => el.append(h('div', { class: 'chips' }, ...['ซื้อเพิ่ม', 'ให้อีก', 'รวมกัน', 'ทั้งหมด', 'มาเพิ่ม'].map(t => h('span', { class: 'kchip' }, t)))) },
      { t: 'แต่ “กินไป” “แตกไป” “ให้คนอื่นไป” ทำให้<b>ลดลง</b> ไม่ใช่การบวกนะ', v: el => el.append(h('div', { class: 'chips' }, ...['กินไป', 'แตกไป', 'ให้ไป'].map(t => h('span', { class: 'kchip no' }, t)))) }
    ],
    game: () => [Q.pickSentence({ a: rnd(2, 5), b: rnd(1, 4), item: pick(ITEMS.animals) }), Q.isAddition(), Q.story({ ...pick(WORD_PROBLEMS.slice(4)) }), Q.pickSentence({ a: rnd(2, 5), b: rnd(1, 4), item: pick(ITEMS.fruits), item2: pick(ITEMS.fruits) }), Q.isAddition(), Q.addMore({ a: rnd(2, 6), b: rnd(1, 4), item: pick(ITEMS.animals) })]
  },
  {
    id: 27, no: 7, title: 'โจทย์ปัญหาการบวก', short: 'โจทย์ปัญหา', tone: 'coral',
    goal: 'อ่านโจทย์ปัญหาการบวก บอกสิ่งที่โจทย์กำหนดและสิ่งที่โจทย์ถาม เขียนประโยคสัญลักษณ์และหาคำตอบได้',
    teach: [
      { t: 'อ่านโจทย์: <b>ปลายมีส้ม 3 ผล แม่ซื้อมาให้อีก 4 ผล รวมแล้วปลายมีส้มกี่ผล</b>', v: el => el.append(storyStrip('orange', 3, 'ซื้อเพิ่ม', 'orange', 4)) },
      { t: '① โจทย์<b>บอก</b>อะไร? มีส้ม <span class="hl">3</span> ผล แม่ซื้อให้อีก <span class="hl">4</span> ผล', v: el => el.append(h('div', { class: 'word', style: { fontSize: 'clamp(22px,3vw,34px)' } }, h('span', { class: 'hl' }, '3'), ' ผล  และ  ', h('span', { class: 'hl' }, '4'), ' ผล')) },
      { t: '② โจทย์<b>ถาม</b>อะไร? <span class="hl2">รวมแล้วปลายมีส้มกี่ผล</span> → คำว่า “รวมแล้ว” บอกว่าต้องบวก', v: el => el.append(h('div', { class: 'chips' }, h('span', { class: 'kchip' }, 'ทั้งหมด'), h('span', { class: 'kchip' }, 'ซื้อเพิ่ม'))) },
      { t: '③ เขียน<b>ประโยคสัญลักษณ์</b>: 3 + 4 = ☐', v: el => el.append(eqRow([3, '+', 4, '=', '?'])) },
      { t: '④ หาคำตอบ แล้วตอบให้ครบ: <span class="hl">ปลายมีส้มทั้งหมด 7 ผล</span>', v: el => el.append(eqRow([3, '+', 4, '=', 7]), tenFrame2(3, 4)) }
    ],
    game: () => shuffle(WORD_PROBLEMS).slice(0, 6).map(p => Q.story(p))
  }
];
/* ---------- Chapter 2 boss: ข้อสอบท้ายหน่วย — แต่งใหม่ทั้งหมด (original items) ---------- */
const EXAM_CH2 = xrot([
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['1 + 5 = 6', '3 + 4 = 8', '2 + 6 = 8'], a: 1 },
  { q: 'ผลบวกข้อใดมีค่าน้อยที่สุด', opts: ['4 + 2', '1 + 3', '5 + 4'], a: 1 },
  { q: 'ผลบวกข้อใดมีค่ามากที่สุด', opts: ['2 + 5', '6 + 4', '3 + 3'], a: 1 },
  { q: 'ผลบวกข้อใดมีค่าน้อยกว่า 5', opts: ['3 + 1', '2 + 4', '5 + 2'], a: 0 },
  { q: 'ข้อใดมีผลบวกไม่เท่ากับข้ออื่น', opts: ['3 + 4', '5 + 2', '1 + 5'], a: 2 },
  { q: '4 + 2 = ☐ ข้อใดกล่าวถูกต้อง', opts: ['ผลบวกเท่ากับ 4', 'ผลบวกมากกว่า 5', 'ผลบวกน้อยกว่า 6'], a: 1 },
  { q: 'ผลบวกข้อใดมีค่ามากกว่า 8', opts: ['4 + 4', '6 + 3', '2 + 5'], a: 1 },
  { q: 'ข้อใดถูกต้อง', opts: ['2 + 3 > 4 + 1', '5 + 1 = 3 + 3', '6 + 2 < 4 + 3'], a: 1, legend: true },
  { q: 'ข้อใดมีผลบวกเท่ากับ 2 + 7', opts: ['5 + 4', '3 + 5', '8 + 0'], a: 0 },
  { q: 'จำนวนใดบวกกับ 3 แล้วได้ 8', opts: ['4', '5', '6'], a: 1 },
  { q: '<u>5</u> + 2 = 7 และ <u>1</u> + 3 = 4 ตัวเลข 5 และตัวเลข 1 เป็นอะไรเหมือนกัน', opts: ['ตัวตั้ง', 'ตัวบวก', 'ผลบวก'], a: 0 },
  { q: '“มีนกเกาะกิ่งไม้ 4 ตัว บินมาเกาะเพิ่มอีก 3 ตัว มีนกทั้งหมดกี่ตัว” เขียนเป็นประโยคสัญลักษณ์ได้ตามข้อใด', opts: ['4 + 3 = ☐', '4 − 3 = ☐', '3 + 3 = ☐'], a: 0 },
  { q: 'ต้นมีดินสอ 6 แท่ง ฝนมีดินสอเท่ากับต้น ข้อใดถูกต้อง', opts: ['ฝนมีดินสอน้อยกว่าต้น', 'ต้นและฝนมีดินสอเท่ากัน', 'ต้นมีดินสอมากกว่าฝน'], a: 1 },
  { q: '3 + 4 = ☐ เป็นประโยคสัญลักษณ์ของข้อใด', opts: ['มีปลา 3 ตัว ซื้อมาอีก 4 ตัว มีปลาทั้งหมดกี่ตัว', 'มีปลา 4 ตัว ให้เพื่อนไป 3 ตัว เหลือปลากี่ตัว', 'มีปลา 3 ตัว ซื้อมาอีก 3 ตัว มีปลาทั้งหมดกี่ตัว'], a: 0 },
  { q: 'ปู่ปลูกต้นมะม่วง 5 ต้น ปลูกเพิ่มอีก 3 ต้น ปู่มีต้นมะม่วงทั้งหมดกี่ต้น', opts: ['7 ต้น', '8 ต้น', '9 ต้น'], a: 1 },
  { q: 'ในตู้มีจาน 1 ใบ แม่นำจานมาใส่อีก 6 ใบ ในตู้มีจานทั้งหมดกี่ใบ', opts: ['6 ใบ', '7 ใบ', '8 ใบ'], a: 1 },
  { q: 'น้องมีสติกเกอร์ 4 แผ่น ครูให้อีก 4 แผ่น น้องมีสติกเกอร์ทั้งหมดกี่แผ่น', opts: ['8 แผ่น', '7 แผ่น', '4 แผ่น'], a: 0 },
  { q: '“มีรถจอดอยู่ 6 คัน แล่นเข้ามาจอดอีก 2 คัน มีรถจอดทั้งหมดกี่คัน” เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร', opts: ['6 − 2 = ☐', '6 + 2 = ☐', '6 + 6 = ☐'], a: 1 },
  { q: '“ในสวนมีดอกกุหลาบ 3 ดอก ดอกมะลิ 6 ดอก มีดอกไม้ทั้งหมดกี่ดอก” โจทย์ถามอะไร', opts: ['มีดอกกุหลาบกี่ดอก', 'มีดอกไม้ทั้งหมดกี่ดอก', 'มีดอกมะลิกี่ดอก'], a: 1 },
  { q: '“ในห้องมีนักเรียนชาย 5 คน นักเรียนหญิง 3 คน รวม 8 คน” เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร', opts: ['5 + 3 = 8', '5 + 8 = 3', '8 + 3 = 5'], a: 0 }
], 2);
LESSONS_CH2.push({
  id: 28, boss: true, title: 'ด่านบอส: ข้อสอบหน่วยที่ 2 การบวก', short: 'ด่านบอส · ข้อสอบ', tone: 'coral',
  goal: 'ทำข้อสอบท้ายหน่วยที่ 2 การบวก จำนวน 20 ข้อ ตอบถูกอย่างน้อย 10 ข้อเพื่อชนะบอสและเปิดเมืองถัดไป',
  exam: EXAM_CH2, pass: 10, bossName: 'ราชาปีศาจบวกเลข', bossPal: 'coral', emblem: '+'
});

/* =========================================================
   CHAPTER 3 — การลบจำนวนสองจำนวนที่ตัวตั้งไม่เกิน 10
   ========================================================= */
function popDemo(e, a, b) { // tap to take away, then the sentence appears
  const res = h('div', { class: 'colstack', style: { visibility: 'hidden' } }, h('div', { class: 'word' }, `${a} เอาออก ${b} เหลือ ${a - b}`), eqRow([a, '−', b, '=', a - b]));
  const cnt = h('div', { class: 'cap' }, `แตะเอาออก ${b} ลูก`);
  const row = removableRow(e, a, b, k => { cnt.textContent = `เอาออกแล้ว ${k} ลูก`; say(WORD[k], true); }, () => { res.style.visibility = ''; sfx.ok(); say(`${WORD[a]} เอาออก ${WORD[b]} เหลือ ${WORD[a - b]}`, true); });
  return h('div', { class: 'colstack' }, row, cnt, res);
}
function countBack(a, b) { // hop left on the number line
  const nl = numberLine(0, a > 10 ? 20 : 10, { hi: [a] }); const ticks = nl.querySelectorAll('.tick');
  const btn = h('button', { class: 'btn info ia', onclick: async ev => { ev.stopPropagation(); btn.disabled = true; for (let k = 1; k <= b; k++) { await sleep(600); ticks[a - k].classList.add('hi2'); sfx.pop(k); say(WORD[a - k], true); } await sleep(500); ticks[a - b].classList.remove('hi2'); ticks[a - b].classList.add('hi'); } }, icon('play'), `ถอยหลัง ${b} ช่องจาก ${a}`);
  return h('div', { class: 'colstack' }, nl, btn);
}
function diffDemo(ea, a, eb, b) {
  const p = pairRows(ea, a, eb, b); const out = h('div', { class: 'colstack', style: { visibility: 'hidden' } }, eqRow([a, '−', b, '=', a - b]));
  setTimeout(async () => { await p.autoPair(220); await sleep(500); out.style.visibility = ''; sfx.ok(); }, 300);
  return h('div', { class: 'colstack' }, p, out);
}
function familyDemo(a, b) {
  const c = a + b, rows = [[a, '+', b, '=', c], [b, '+', a, '=', c], [c, '−', b, '=', a], [c, '−', a, '=', b]];
  const list = h('div', { class: 'colstack', style: { gap: '8px' } }); let k = 0;
  const btn = h('button', { class: 'btn accent ia', onclick: ev => { ev.stopPropagation(); if (k < 4) { const e = eqRow(rows[k], { sm: true }); e.style.animation = 'popIn .4s var(--spring)'; list.append(e); sfx.pop(k); k++; } if (k >= 4) btn.remove(); } }, icon('plus'), 'แตะดูประโยคถัดไป');
  return h('div', { class: 'rowstack' }, partWhole(c, a, b, { w: 'clamp(190px,22vw,240px)' }), h('div', { class: 'colstack' }, list, btn));
}
function liveSplitSub(n) {
  const e = h('div'), pw = partWhole(n, n - 3, 3, { w: 'clamp(190px,22vw,240px)' });
  const draw = (a, b) => { pw.set(n, a, b); e.innerHTML = ''; e.append(h('div', { class: 'colstack', style: { gap: '8px' } }, eqRow([n, '−', a, '=', b], { sm: true }), eqRow([n, '−', b, '=', a], { sm: true }))); };
  const sp = splitter(n, (a, b) => { draw(a, b); say(`${WORD[n]} ลบ ${WORD[a]} เท่ากับ ${WORD[b]}`, true); }, { a: n - 3 });
  draw(n - 3, 3); return h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, sp, pw), e);
}
function tenSubDemo(a, b) {
  const e = eqRow([a, '−', b, '=', '?']);
  const f = tenTapCross(a, b, () => { e.fill(a - b); sfx.ok(); say(`${WORD[a]} ลบ ${WORD[b]} เท่ากับ ${WORD[a - b]}`, true); });
  return h('div', { class: 'colstack' }, f, e, h('div', { class: 'cap' }, `แตะขีดทิ้ง ${b} ตัว`));
}
const LESSONS_CH3 = [
  {
    id: 31, title: 'การลบโดยการเอาออก', short: 'ลบโดยเอาออก', tone: 'sky',
    goal: 'หาผลลบโดยการเอาออก เขียนและอ่านประโยคสัญลักษณ์แสดงการลบได้ รวมถึงการลบด้วย 0',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองลบเลข</b>! ที่นี่เราจะเรียนเรื่อง <span class="hl2">การลบ</span>', v: el => el.append(mascot('wow', 'big')) },
      { t: 'มีลูกโป่ง 6 ลูก <b>แตะเอาออก 3 ลูก</b> แล้วดูว่าเหลือกี่ลูก', s: 'มีลูกโป่งหกลูก แตะเอาออกสามลูก แล้วดูว่าเหลือกี่ลูก', v: el => el.append(popDemo('balloon', 6, 3)) },
      { t: '6 เอาออก 3 เหลือ 3 เขียนเป็น <span class="hl2">6 − 3 = 3</span> เครื่องหมาย <b>−</b> อ่านว่า “ลบ”', s: 'หกเอาออกสามเหลือสาม เขียนเป็น หกลบสามเท่ากับสาม', v: el => el.append(crossedRow('balloon', 6, 3), eqRow([6, '−', 3, '=', 3])) },
      { t: 'แต่ละตัวมีชื่อ: <b>ตัวตั้ง</b> − <b>ตัวลบ</b> = <b>ผลลบ</b>', v: el => el.append(eqRow([6, '−', 3, '=', 3], { labels: 'sub' })) },
      { t: 'เขียน<b>ตั้งลบ</b>แนวตั้งก็ได้', v: el => el.append(eqRow([8, '−', 2, '=', 6]), vertical(8, 2, 6, '−')) },
      { t: '<b>ลบด้วย 0</b> ไม่ได้เอาอะไรออก จึงเหลือเท่าเดิม: 5 − 0 = 5', v: el => el.append(h('div', { class: 'box gbox' }, objRow('star', 5, { pop: true })), eqRow([5, '−', 0, '=', 5])) },
      { t: '<b>ลบด้วยตัวเอง</b> เอาออกหมด เหลือ 0: 4 − 4 = 0', v: el => el.append(crossedRow('cupcake', 4, 4), eqRow([4, '−', 4, '=', 0])) }
    ],
    game: () => [Q.takeAway({ a: rnd(4, 6), b: rnd(1, 3) }), Q.crossed({ a: rnd(5, 8), b: rnd(1, 4) }), Q.buildSub((a => ({ a, b: rnd(1, a - 1) }))(rnd(4, 9))), Q.takeAway({ a: rnd(6, 9), b: rnd(2, 5) }), Q.subFact({ a: rnd(1, 10), b: 0 }), Q.subFact((n => ({ a: n, b: n }))(rnd(2, 9))), Q.subFact((a => ({ a, b: rnd(1, a), vert: true, pen: true }))(rnd(3, 10))), Q.crossed({ a: rnd(7, 10), b: rnd(2, 6), pen: true })]
  },
  {
    id: 32, title: 'การลบโดยการเปรียบเทียบ', short: 'ลบโดยเปรียบเทียบ', tone: 'sky',
    goal: 'หาผลต่างของจำนวนสองกลุ่มโดยการจับคู่เปรียบเทียบ และเขียนประโยคสัญลักษณ์แสดงการลบได้',
    teach: [
      { t: 'หมู 8 ตัว แมว 5 ตัว — หมู<b>มากกว่า</b>แมว<b>กี่ตัว</b>? มาจับคู่กัน', v: el => el.append(pairRows('pig', 8, 'cat', 5)) },
      { t: 'จับคู่ทีละ 1 ตัว หมูเหลือ <span class="hl2">3 ตัว</span>ที่ไม่มีคู่ → 8 − 5 = 3', v: el => el.append(diffDemo('pig', 8, 'cat', 5)) },
      { t: 'พูดได้ว่า จำนวนหมู<span class="hl">มากกว่า</span>จำนวนแมว 3 ตัว และ จำนวนแมว<span class="hl2">น้อยกว่า</span>จำนวนหมู 3 ตัว', v: el => el.append(eqRow([8, '−', 5, '=', 3])) },
      { t: '<b>ลองจับคู่เอง</b> ปลา 6 ตัว กับ ปู 4 ตัว ต่างกันกี่ตัว?', s: 'ลองจับคู่เอง ปลาหกตัว กับปูสี่ตัว ต่างกันกี่ตัว', v: el => { const out = h('div', { style: { visibility: 'hidden' } }, eqRow([6, '−', 4, '=', 2])); el.append(h('div', { class: 'colstack' }, pairRows('fish', 6, 'crab', 4, { interactive: true, onDone: () => { out.style.visibility = ''; sfx.ok(); say('ปลามากกว่าปู สองตัว', true); } }), out)); } }
    ],
    game: () => [Q.compareDiff({ a: rnd(6, 8), b: rnd(2, 4) }), Q.compareDiff({ a: rnd(2, 4), b: rnd(5, 7) }), Q.compareDiff({ a: rnd(5, 9), b: rnd(3, 5) }), Q.compareWord({ a: rnd(3, 6), b: rnd(6, 9), show: 'group' }), Q.compareDiff({ a: rnd(3, 5), b: rnd(6, 8) }), Q.subFact({ a: rnd(5, 9), b: rnd(1, 4) })]
  },
  {
    id: 33, title: 'การลบโดยใช้ความสัมพันธ์ของการบวกและการลบ', short: 'บวกกับลบสัมพันธ์กัน', tone: 'sky',
    goal: 'ใช้ความสัมพันธ์ของการบวกและการลบ (ครอบครัวจำนวน) ช่วยหาผลลบได้',
    teach: [
      { t: 'จำนวน 3, 4 และ 7 เป็น<b>ครอบครัวเดียวกัน</b> <b>แตะดู</b>ประโยคที่เขียนได้ทีละประโยค', s: 'จำนวน สาม สี่ และเจ็ด เป็นครอบครัวเดียวกัน แตะดูประโยคที่เขียนได้', v: el => el.append(familyDemo(3, 4)) },
      { t: 'รู้ว่า <span class="hl">3 + 4 = 7</span> ก็รู้ว่า <span class="hl2">7 − 4 = 3</span> และ <span class="hl2">7 − 3 = 4</span>', v: el => el.append(h('div', { class: 'colstack' }, eqRow([3, '+', 4, '=', 7]), eqRow([7, '−', 4, '=', 3]), eqRow([7, '−', 3, '=', 4]))) },
      { t: 'ลองใช้: 9 − 6 = ? คิดว่า <b>6 บวกอะไรได้ 9</b>', v: el => el.append(eqRow([6, '+', '?', '=', 9], { sm: true }), revealBtn(eqRow([9, '−', 6, '=', '?']), 3)) }
    ],
    game: () => [Q.family({ a: rnd(1, 5), b: rnd(2, 5) }), Q.family({ a: rnd(2, 6), b: rnd(1, 4) }), Q.subFact({ a: rnd(6, 10), b: rnd(2, 5) }), Q.family({ a: rnd(1, 4), b: rnd(3, 6) }), Q.matchDiffs(), Q.family({ a: rnd(3, 5), b: rnd(3, 5) })]
  },
  {
    id: 34, title: 'ความสัมพันธ์ของจำนวนแบบส่วนย่อย – ส่วนรวมกับการลบ', short: 'ส่วนย่อย-ส่วนรวม กับการลบ', tone: 'sky',
    goal: 'ใช้แผนภาพส่วนย่อย–ส่วนรวมเขียนประโยคสัญลักษณ์การลบ และหาผลลบได้',
    teach: [
      { t: 'ส่วนรวม 7 แบ่งเป็น 2 กับ 5 — เอาส่วนย่อยออกจากส่วนรวม ได้อีกส่วน', v: el => el.append(partWhole(7, 2, 5)) },
      { t: '<span class="hl2">7 − 2 = 5</span> และ <span class="hl2">7 − 5 = 2</span>', v: el => el.append(partWhole(7, 2, 5, { w: 'clamp(200px,24vw,260px)' }), h('div', { class: 'colstack' }, eqRow([7, '−', 2, '=', 5]), eqRow([7, '−', 5, '=', 2]))) },
      { t: '<b>ลองแตะตัวนับ</b> แล้วดูประโยคการลบเปลี่ยนตาม', s: 'ลองแตะตัวนับ แล้วดูประโยคการลบเปลี่ยนตาม', v: el => el.append(liveSplitSub(9)) }
    ],
    game: () => { const W = () => rnd(3, 10); return [Q.pwSub((w => ({ whole: w, a: rnd(1, w - 1), miss: 'c' }))(W())), Q.pwSub((w => ({ whole: w, a: rnd(1, w - 1), miss: 'b' }))(W())), Q.partWhole((w => ({ whole: w, a: rnd(1, w - 1), q: 'b' }))(W())), Q.pwSub((w => ({ whole: w, a: rnd(0, w), miss: 'c' }))(W())), Q.split((w => ({ whole: w, a: rnd(1, w - 1) }))(rnd(5, 10))), Q.pwSub((w => ({ whole: w, a: rnd(1, w - 1), miss: 'a' }))(W()))]; }
  },
  {
    id: 35, title: 'การหาผลลบโดยใช้เส้นจำนวน', short: 'ลบด้วยเส้นจำนวน', tone: 'sky',
    goal: 'หาผลลบโดยการนับถอยหลังบนเส้นจำนวน และใช้กรอบสิบช่วยหาผลลบได้',
    teach: [
      { t: 'บนเส้นจำนวน <b>การลบ = กระโดดไปทางซ้าย</b> ลองกดดู 8 − 3', s: 'บนเส้นจำนวน การลบ คือ กระโดดไปทางซ้าย ลองกดดู แปดลบสาม', v: el => el.append(eqRow([8, '−', 3, '=', 5], { sm: true }), countBack(8, 3)) },
      { t: 'เริ่มที่ 10 ถอยหลัง 4 ช่อง → <span class="hl2">10 − 4 = 6</span>', v: el => el.append(countBack(10, 4)) },
      { t: 'ใช้<b>กรอบสิบ</b>ก็ได้ — <b>แตะขีดทิ้ง</b>ตามจำนวนตัวลบ แล้วนับที่เหลือ', s: 'ใช้กรอบสิบก็ได้ แตะขีดทิ้งตามจำนวนตัวลบ แล้วนับที่เหลือ', v: el => el.append(tenSubDemo(9, 6)) }
    ],
    game: () => [Q.lineSub({ a: rnd(5, 8), b: rnd(1, 3) }), Q.tenSub((a => ({ a, b: rnd(1, a - 1) }))(rnd(5, 10))), Q.lineSub({ a: 10, b: rnd(2, 6) }), Q.findDiff({ n: 2 }), Q.lineSub((a => ({ a, b: rnd(1, a) }))(rnd(4, 9))), Q.tenSub((a => ({ a, b: rnd(2, a) }))(rnd(6, 10)))]
  },
  {
    id: 36, title: 'การหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การบวกและการลบ', short: 'ตัวไม่ทราบค่า', tone: 'sky',
    goal: 'หาจำนวนที่แทนด้วย ☐ ในประโยคสัญลักษณ์การบวกและการลบได้',
    teach: [
      { t: '<b>☐</b> คือจำนวนที่เรายังไม่รู้ เรียกว่า <b>ตัวไม่ทราบค่า</b>', v: el => el.append(eqRow([4, '+', '?', '=', 9])) },
      { t: '4 + ☐ = 9 → ส่วนรวม 9 ส่วนย่อย 4 อีกส่วนคือ 9 − 4 = <span class="hl2">5</span>', v: el => { const pw = partWhole(9, 4, 5, { q: 'b' }); el.append(pw, revealBtn(eqRow([4, '+', '?', '=', 9]), 5, pw)); } },
      { t: '☐ − 3 = 4 → ตัวตั้งคือส่วนรวม: 4 + 3 = <span class="hl2">7</span>', v: el => { const pw = partWhole(7, 4, 3, { q: 'whole' }); el.append(pw, revealBtn(eqRow(['?', '−', 3, '=', 4]), 7, pw)); } },
      { t: '8 − ☐ = 6 → 8 − 6 = <span class="hl2">2</span>', v: el => { const pw = partWhole(8, 6, 2, { q: 'b' }); el.append(pw, revealBtn(eqRow([8, '−', '?', '=', 6]), 2, pw)); } }
    ],
    game: () => [Q.unknown({ form: 'a+?' }), Q.unknown({ form: '?+b' }), Q.unknown({ form: 'a-?' }), Q.unknown({ form: '?-b' }), Q.unknown({}), Q.unknown({}), Q.unknown({})]
  },
  {
    id: 37, title: 'สถานการณ์การลบ', short: 'สถานการณ์การลบ', tone: 'sky',
    goal: 'บอกสถานการณ์ที่เป็นการลบ (เอาออก เปรียบเทียบ) และเขียนประโยคสัญลักษณ์จากสถานการณ์ได้',
    teach: [
      { t: 'มีคัพเค้ก 7 ชิ้น <span class="hl2">กินไป</span> 2 ชิ้น เหลือกี่ชิ้น? → 7 − 2 = 5', v: el => el.append(crossedRow('cupcake', 7, 2), eqRow([7, '−', 2, '=', 5])) },
      { t: 'มีส้ม 6 ผล กล้วย 4 ผล <span class="hl2">ส้มมากกว่ากล้วยกี่ผล</span>? → 6 − 4 = 2', v: el => el.append(diffDemo('orange', 6, 'banana', 4)) },
      { t: 'คำที่บอกว่าเป็น<b>การลบ</b>: <span class="hl2">เอาออก กินไป แตก ให้ไป เหลือ มากกว่า…กี่ น้อยกว่า…กี่</span>', v: el => el.append(h('div', { class: 'chips' }, ...['กินไป', 'แตกไป', 'ให้ไป', 'เหลือ', 'มากกว่ากี่', 'น้อยกว่ากี่'].map(t => h('span', { class: 'kchip sub' }, t)))) }
    ],
    game: () => [Q.isSubtraction(), Q.pickSub({ a: rnd(5, 9), b: rnd(1, 4) }), Q.story({ ...pick(SUB_PROBLEMS.slice(0, 4)) }), Q.isSubtraction(), Q.pickSub({ a: rnd(4, 8), b: rnd(1, 3), item: pick(ITEMS.fruits) }), Q.story({ ...pick(SUB_PROBLEMS.slice(4, 6)) })]
  },
  {
    id: 38, title: 'โจทย์ปัญหาการลบ', short: 'โจทย์ปัญหาการลบ', tone: 'sky',
    goal: 'อ่านโจทย์ปัญหาการลบ บอกสิ่งที่โจทย์กำหนดและสิ่งที่โจทย์ถาม เขียนประโยคสัญลักษณ์และหาคำตอบได้',
    teach: [
      { t: 'อ่านโจทย์: <b>ภูมีลูกอม 8 เม็ด แบ่งให้น้อง 6 เม็ด ภูยังมีลูกอมอยู่กี่เม็ด</b>', v: el => el.append(crossedRow('circle', 8, 6)) },
      { t: '① โจทย์<b>บอก</b>: มีลูกอม <span class="hl">8</span> เม็ด แบ่งให้น้อง <span class="hl">6</span> เม็ด', v: el => el.append(h('div', { class: 'word', style: { fontSize: 'clamp(22px,3vw,34px)' } }, h('span', { class: 'hl' }, '8'), ' เม็ด  ให้ไป  ', h('span', { class: 'hl' }, '6'), ' เม็ด')) },
      { t: '② โจทย์<b>ถาม</b>: <span class="hl2">ภูยังมีลูกอมอยู่กี่เม็ด</span> → คำว่า “แบ่งให้” และ “เหลือ” บอกว่าต้องลบ', v: el => el.append(h('div', { class: 'chips' }, h('span', { class: 'kchip sub' }, 'ให้ไป'), h('span', { class: 'kchip sub' }, 'เหลือ'))) },
      { t: '③ ประโยคสัญลักษณ์ <b>8 − 6 = ☐</b>  ④ ตอบ <span class="hl2">ภูเหลือลูกอม 2 เม็ด</span>', v: el => el.append(eqRow([8, '−', 6, '=', 2]), tenCrossed(8, 6)) }
    ],
    game: () => shuffle(SUB_PROBLEMS).slice(0, 6).map(p => Q.story(p))
  }
];
/* ---------- Chapter 3 boss: ข้อสอบท้ายหน่วย — แต่งใหม่ทั้งหมด (original items) ---------- */
const EXAM_CH3 = xrot([
  { q: 'ข้อใดหมายถึงการลบ', opts: ['การนำจำนวนสองจำนวนมารวมกัน', 'การนำจำนวนหนึ่งเอาออกไปจากอีกจำนวนหนึ่ง', 'การนับเพิ่มทีละ 1'], a: 1 },
  { q: 'ข้อใดถูกต้อง', opts: ['7 − 3 = 5', '6 − 4 = 2', '10 − 2 = 7'], a: 1 },
  { q: 'ผลลบข้อใดมีค่าน้อยที่สุด', opts: ['8 − 2', '6 − 5', '9 − 4'], a: 1 },
  { q: 'ผลลบข้อใดมีค่ามากกว่า 5', opts: ['10 − 3', '6 − 2', '8 − 4'], a: 0 },
  { q: 'ผลลบข้อใดมีค่ามากที่สุด', opts: ['7 − 1', '9 − 6', '5 − 3'], a: 0 },
  { q: '9 − 4 แล้วนำผลลบไปลบออกอีก 2 ได้เท่าไร', opts: ['2', '3', '4'], a: 1 },
  { q: 'ข้อใดถูกต้อง', opts: ['6 − 1 < 4', '10 = 9 + 2', '8 > 9 − 3'], a: 2, legend: true },
  { q: 'ข้อใดมีผลลบเท่ากับ 7 − 2', opts: ['9 − 4', '8 − 2', '6 − 3'], a: 0 },
  { q: 'ข้อใดมีผลลบมากกว่า 6 − 4 อยู่ 3', opts: ['8 − 3', '7 − 4', '9 − 5'], a: 0 },
  { q: 'ข้อใดถูกต้อง', opts: ['5 + 2 < 9 − 3', '8 − 4 = 2 + 2', '10 − 6 > 1 + 4'], a: 1, legend: true },
  { q: 'ข้อใดมีผลลบน้อยกว่า 4 + 4 อยู่ 2', opts: ['10 − 4', '9 − 1', '7 − 3'], a: 0 },
  { q: 'ข้อใดเป็นเรื่องการลบ', opts: ['มีขนม 5 ชิ้น แม่ให้อีก 3 ชิ้น', 'มีสมุด 6 เล่ม แจกเพื่อนไป 2 เล่ม', 'มีไก่ 2 ตัว ซื้อมาเพิ่ม 4 ตัว'], a: 1 },
  { q: '“มีปากกาสีแดง 2 ด้าม ปากกาสีน้ำเงิน 7 ด้าม ปากกาสีแดงน้อยกว่าปากกาสีน้ำเงินกี่ด้าม” เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร', opts: ['2 + 7 = ☐', '7 − 2 = ☐', '2 − 7 = ☐'], a: 1 },
  { q: 'มีขนมปัง 9 ชิ้น กินไป 4 ชิ้น เหลือขนมปังกี่ชิ้น', opts: ['4 ชิ้น', '5 ชิ้น', '6 ชิ้น'], a: 1 },
  { q: 'มีนก 6 ตัวเกาะบนรั้ว บินหนีไป 5 ตัว เหลือนกกี่ตัว', opts: ['1 ตัว', '2 ตัว', '11 ตัว'], a: 0 },
  { q: '“มีกล้วย 8 ผล ขายไป 5 ผล เหลือกล้วยกี่ผล” โจทย์ถามอะไร', opts: ['ขายกล้วยไปกี่ผล', 'เหลือกล้วยกี่ผล', 'มีกล้วยกี่ผล'], a: 1 },
  { q: '9 − 4 = ☐ เป็นประโยคสัญลักษณ์ของข้อใด', opts: ['มีหนังสือ 9 เล่ม เพื่อนยืมไป 4 เล่ม เหลือหนังสือกี่เล่ม', 'มีหนังสือ 9 เล่ม ซื้อมาอีก 4 เล่ม มีหนังสือทั้งหมดกี่เล่ม', 'มีหนังสือ 4 เล่ม ซื้อมาอีก 5 เล่ม มีหนังสือทั้งหมดกี่เล่ม'], a: 0 },
  { q: 'ในจานมีลูกชิ้น 10 ลูก กินไป 3 ลูก เหลือลูกชิ้นกี่ลูก', opts: ['6 ลูก', '7 ลูก', '8 ลูก'], a: 1 },
  { q: 'ห้องเรียนมีพัดลม 8 ตัว เสีย 2 ตัว พัดลมที่ใช้ได้มีกี่ตัว', opts: ['6 ตัว', '10 ตัว', '5 ตัว'], a: 0 },
  { q: 'ปลูกต้นกล้า 7 ต้น ตายไป 1 ต้น เหลือต้นกล้ากี่ต้น', opts: ['8 ต้น', '5 ต้น', '6 ต้น'], a: 2 }
], 0);
LESSONS_CH3.push({
  id: 39, boss: true, title: 'ด่านบอส: ข้อสอบหน่วยที่ 3 การลบ', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'ทำข้อสอบท้ายหน่วยที่ 3 การลบ จำนวน 20 ข้อ ตอบถูกอย่างน้อย 10 ข้อเพื่อชนะบอส',
  exam: EXAM_CH3, pass: 10, bossName: 'ราชาปีศาจลบเลข', bossPal: 'sky', emblem: '−'
});

/* =========================================================
   GRADE 1 · CHAPTER 4 — จำนวนนับ 11 ถึง 20  (เมืองนับถึงยี่สิบ)
   ========================================================= */
/* two live ten frames: tap cells or press + − ; readout shows words and 10 + x */
function frameMachine(start = 10, opts = {}) {
  const out = h('div', { class: 'colstack', style: { gap: '4px', minWidth: 'min(260px,80vw)' } });
  const draw = n => { out.innerHTML = ''; out.append(h('div', { class: 'bignum sm' }, n), h('div', { class: 'word', style: { fontSize: 'clamp(22px,2.8vw,32px)', color: 'var(--mint-2)' } }, WORD[n]),
    h('div', { class: 'expline num' }, n > 10 ? `${n} = 10 + ${n - 10}` : n === 10 ? 'เต็มกรอบ = 10' : `${n}`)); };
  const fb = frameBuilder(start, { min: opts.min, onChange: n => { draw(n); say(n > 10 ? `${WORD[n]} คือ สิบ กับ ${WORD[n - 10]}` : WORD[n], true); } });
  draw(start);
  const bt = (lab, d, cls) => h('button', { class: 'btn ia ' + cls, onclick: e => { e.stopPropagation(); fb.set(fb.value() + d); } }, PM(d > 0 ? '+' : '-'), lab);
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, fb, out), h('div', { class: 'rowstack' }, bt('เอาออก 1', -1, ''), bt('เพิ่มอีก 1', 1, 'primary')), h('div', { class: 'tap-hint', style: { animation: 'none' } }, 'แตะช่องในกรอบก็ได้'));
}
/* sticks: add / remove; ten loose sticks are tied into a bundle */
function bundleMachine(start = 14) {
  let n = start; const vis = h('div'), out = h('div', { class: 'colstack', style: { gap: '4px' } }), note = h('div', { class: 'carry-note' });
  const draw = () => { vis.innerHTML = ''; vis.append(sticks(n, { labels: true })); out.innerHTML = ''; out.append(h('div', { class: 'bignum sm' }, n), h('div', { class: 'word', style: { fontSize: 'clamp(22px,2.8vw,32px)', color: 'var(--mint-2)' } }, WORD[n]), n > 10 ? eqRow([n, '=', 10, '+', n - 10], { sm: true }) : h('span')); };
  const flash = t => { note.innerHTML = t; note.classList.remove('on'); void note.offsetWidth; note.classList.add('on'); };
  const step = d => { const v = n + d; if (v < 0 || v > 20) { sfx.no(); return; } n = v; draw(); sfx.pop(n);
    if (d > 0 && n % 10 === 0) { flash(`ไม้ครบ <b>10 อัน</b> มัดรวมเป็น <b>1 มัด</b>`); sfx.win(); } else if (d < 0 && n % 10 === 9) flash('แกะมัดออก 1 มัด แล้วหยิบออก 1 อัน');
    say(n > 10 ? `${WORD[n]} คือ หนึ่งมัด กับ ${WORD[n - 10]} อัน` : WORD[n], true); };
  draw();
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, vis, out), h('div', { class: 'rowstack' },
    h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); step(-1); } }, PM('-'), 'หยิบออก 1 อัน'), h('button', { class: 'btn primary ia', onclick: e => { e.stopPropagation(); step(1); } }, PM('+'), 'เพิ่มไม้ 1 อัน')), note);
}
/* tap two numbers on the line → the comparison sentence */
function lineTapCompare(a0 = 16, b0 = 13) {
  let pick2 = [a0, b0]; const nl = numberLine(0, 20), sent = h('div');
  const draw = () => { nl.querySelectorAll('.tick').forEach((t, i) => { t.classList.toggle('hi', i === pick2[0]); t.classList.toggle('hi2', i === pick2[1]); }); const [a, b] = pick2, rel = a > b ? 'มากกว่า' : a < b ? 'น้อยกว่า' : 'เท่ากับ';
    sent.innerHTML = ''; sent.append(h('div', { class: 'sentence' }, h('span', { class: 'bignum sm' }, a), h('span', { class: 'blank filled' }, rel), h('span', { class: 'bignum sm' }, b)), h('div', { class: 'cap' }, a === b ? 'อยู่ตำแหน่งเดียวกัน' : `${a} อยู่ทาง${a > b ? 'ขวา' : 'ซ้าย'}ของ ${b}`)); };
  nl.querySelectorAll('.tick').forEach((t, i) => { t.classList.add('ia'); t.style.cursor = 'pointer'; t.onclick = e => { e.stopPropagation(); pick2 = [pick2[1], i]; draw(); sfx.pop(i); const [a, b] = pick2; say(`${WORD[a]} ${a > b ? 'มากกว่า' : a < b ? 'น้อยกว่า' : 'เท่ากับ'} ${WORD[b]}`, true); }; });
  draw(); return h('div', { class: 'colstack' }, nl, sent, h('div', { class: 'tap-hint', style: { animation: 'none' } }, 'แตะตัวเลขบนเส้นจำนวน 2 ตัว'));
}
const T20 = () => rnd(11, 20), T19 = () => rnd(11, 19);
const WS10 = [[13, 16], [19, 15], [14, 20], [17, 17]];
const WS11 = [[13, 20], [14, 16], [15, 16], [16, 19], [18, 13], [12, 14], [14, 11], [15, 11], [12, 12], [15, 14], [16, 15], [20, 12], [18, 19], [14, 14], [20, 11], [19, 16], [11, 16], [14, 20], [14, 18], [16, 16], [17, 16], [20, 11], [20, 13], [11, 14], [17, 17], [18, 12], [13, 15], [18, 19], [16, 18], [16, 14], [11, 13], [19, 16]];
const WS13 = [[18, 11, 14, 20], [16, 18, 19, 17], [14, 11, 16, 20, 18, 17], [18, 17, 14, 20], [13, 14, 11, 19], [19, 13, 15, 11, 14], [11, 19, 12, 17, 18], [13, 16, 20, 18, 12], [14, 17, 13, 15, 16]];
const WS14 = [[14, 17, 11, 15], [13, 16, 19, 20], [19, 20, 15, 16, 17], [18, 19, 11, 17], [17, 12, 15, 20], [12, 17, 11, 18, 19], [13, 15, 16, 14, 17], [14, 18, 19, 20, 15], [20, 13, 15, 16, 18]];
const LESSONS_CH4 = [
  { id: 201, title: 'การนับสิบเอ็ดถึงยี่สิบ', short: 'นับ 11–20', tone: 'yellow',
    goal: 'นับสิ่งต่าง ๆ ที่มีจำนวน 11 ถึง 20 โดยนับต่อจาก 10 และบอกจำนวนได้',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองนับถึงยี่สิบ</b>! เรานับถึง 10 ได้แล้ว มานับต่อกัน', s: 'ยินดีต้อนรับสู่เมืองนับถึงยี่สิบ เรานับถึงสิบได้แล้ว มานับต่อกัน', v: el => el.append(mascot('wow', 'big')) },
      { t: 'มีแอปเปิล <b>10</b> ผล เพิ่มอีก 1 ผล เป็น <span class="hl">สิบเอ็ด</span> (11)', s: 'มีแอปเปิลสิบผล เพิ่มอีกหนึ่งผล เป็นสิบเอ็ด', v: el => el.append(h('div', { class: 'rows20' }, objRow('apple', 10, { pop: true, size: 'clamp(30px,4.2vw,48px)' }), objRow('apple', 1, { pop: true, delay0: 1, size: 'clamp(30px,4.2vw,48px)' })), h('div', { class: 'bignum sm' }, 11)) },
      { t: '<b>กดเพิ่มอีก 1</b> ไปเรื่อย ๆ นับต่อจาก 10: สิบเอ็ด สิบสอง สิบสาม … ยี่สิบ', s: 'กดเพิ่มอีกหนึ่งไปเรื่อย ๆ นับต่อจากสิบ', v: el => el.append(frameMachine(10)) },
      { t: 'บนเส้นจำนวน นับ<b>เพิ่ม</b>ทีละ 1 ขยับไปทาง<b>ขวา</b> นับ<b>ลด</b>ทีละ 1 ขยับไปทาง<b>ซ้าย</b>', v: el => el.append(numberLine(10, 20, { hi: [11, 12, 13] })) },
      { t: 'จำไว้: 20 อ่านว่า <span class="hl">ยี่สิบ</span> ไม่ใช่ “สองสิบ”', s: 'จำไว้ ยี่สิบ ไม่ใช่สองสิบ', v: el => el.append(twoFrames(20), triple(20)) }
    ],
    game: () => [Q.count20({ n: T20(), item: pick(ITEMS.fruits) }), Q.count20({ n: T20() }), Q.missingSeq({ start: rnd(11, 16) }), Q.beforeAfter({ n: T19(), dir: 'more' }), Q.missingSeq({ start: rnd(12, 16), desc: true }), Q.beforeAfter({ n: rnd(12, 20), dir: 'less' }), Q.count20({ n: T20(), pen: true })] },
  { id: 202, title: 'การแสดงจำนวนนับสิบเอ็ดถึงยี่สิบด้วยกรอบสิบ', short: 'กรอบสิบ 11–20', tone: 'sky',
    goal: 'ใช้กรอบสิบสองกรอบแสดงจำนวน 11 ถึง 20 และบอกจำนวนจากกรอบสิบได้',
    teach: [
      { t: '<b>กรอบสิบ</b> 1 กรอบมี 10 ช่อง เต็มกรอบคือ <span class="hl">10</span>', v: el => el.append(tenFrame(10, { pop: true })) },
      { t: 'จำนวนที่มากกว่า 10 ใช้<b>สองกรอบ</b>: เต็มกรอบแรก แล้วต่อกรอบที่สอง เช่น 14', v: el => el.append(twoFrames(14, { pop: true }), eqRow([14, '=', 10, '+', 4], { sm: true })) },
      { t: '<b>ลองแตะช่อง</b>หรือกด + − สร้างจำนวน 11 ถึง 20 ดูนะ', s: 'ลองแตะช่องหรือกดบวกลบ สร้างจำนวนสิบเอ็ดถึงยี่สิบดูนะ', v: el => el.append(frameMachine(13)) },
      { t: 'เต็มสองกรอบพอดี คือ <span class="hl">20</span> (ยี่สิบ)', v: el => el.append(twoFrames(20, { pop: true })) }
    ],
    game: () => { const ws = shuffle([14, 20, 13, 16]); return [Q.frames20({ n: T20() }), Q.fillFrames({ n: ws[0] }), Q.frames20({ n: T20() }), Q.matchFrames({ nums: shuffle(range(11, 20)).slice(0, 3) }), Q.fillFrames({ n: ws[1] }), Q.frames20({ n: T20(), pen: true })]; } },
  { id: 203, title: 'การเขียนตัวเลขและตัวหนังสือแสดงจำนวน 11 ถึง 20', short: 'เขียน 11–20', tone: 'coral',
    goal: 'อ่านและเขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 11 ถึง 20 ได้',
    teach: [
      { t: 'จำนวนเดียวกันเขียนได้ <span class="hl">3 แบบ</span> เช่น 14', v: el => el.append(twoFrames(14), triple(14)) },
      { t: 'ตัวหนังสือ: <b>สิบ</b> + จำนวนที่เหลือ — แต่ 11 อ่านว่า <span class="hl">สิบเอ็ด</span> และ 20 อ่านว่า <span class="hl">ยี่สิบ</span>', v: el => el.append(table20()) },
      { t: 'ดูวิธีเขียนเลข <span class="hl">14</span>: เขียน 1 ก่อน แล้วตามด้วย 4', s: 'ดูวิธีเขียนเลขสิบสี่ เขียนหนึ่งก่อน แล้วตามด้วยสี่', v: el => el.append(writeDemo('14', Math.min(280, innerHeight * .4))) },
      { t: 'ฝึกเขียนเลข <span class="hl">17</span> 4 ครั้ง เส้นประจะจางลง ครั้งสุดท้ายเขียนเอง', s: 'ฝึกเขียนเลขสิบเจ็ด สี่ครั้ง', v: el => el.append(practicePad({ kind: 'digit', d: '17' })) },
      { t: 'เลขไทย <span class="hl2">๑๕</span> (สิบห้า) ฝึกเขียน 4 ครั้ง เริ่มที่หัวกลมก่อน', s: 'เลขไทย สิบห้า ฝึกเขียนสี่ครั้ง', v: el => el.append(practicePad({ kind: 'text', text: '๑๕' }, { free: 'thai' })) },
      { t: 'ตัวหนังสือ <span class="hl3">“สิบสอง”</span> ฝึกเขียน 4 ครั้ง', s: 'ตัวหนังสือ สิบสอง ฝึกเขียนสี่ครั้ง', v: el => el.append(practicePad({ kind: 'text', text: 'สิบสอง' }, { free: 'word', h: 220 })) },
      { t: 'ตัวหนังสือ <span class="hl3">“ยี่สิบ”</span> ฝึกเขียน 4 ครั้ง', s: 'ตัวหนังสือ ยี่สิบ ฝึกเขียนสี่ครั้ง', v: el => el.append(practicePad({ kind: 'text', text: 'ยี่สิบ' }, { free: 'word', h: 220 })) }
    ],
    game: () => { const ns = shuffle(range(11, 20)), pool = range(11, 20);
      return [Q.freeWrite({ n: ns[0], ask: 'digit', from: pick(['word', 'thai']) }), Q.formChoice({ n: ns[1], from: 'word', pool }), Q.freeWrite({ n: ns[2], ask: 'thai', from: 'digit' }), Q.matchForms({ nums: ns.slice(3, 6), kind: 'thai' }), Q.formChoice({ n: ns[6], from: 'arabic', pool }), Q.matchForms({ nums: ns.slice(7, 10), kind: 'word' }), Q.freeWrite({ n: ns[8], ask: 'word', from: 'digit' })]; } },
  { id: 204, title: 'การเขียนแสดงจำนวนในรูปการกระจาย', short: 'รูปกระจาย 11–20', tone: 'mint',
    goal: 'เขียนจำนวน 11 ถึง 20 ในรูปกระจายเป็น 10 กับจำนวนที่เหลือได้',
    teach: [
      { t: 'ไม้ 10 อัน มัดรวมเป็น <b>1 มัด</b> — 1 มัด คือ <span class="hl">10</span>', v: el => el.append(sticks(10, { labels: true })) },
      { t: '14 คือ <b>1 มัด กับ 4 อัน</b> เขียนในรูปกระจายได้ <span class="hl">14 = 10 + 4</span>', v: el => el.append(sticks(14, { labels: true }), eqRow([14, '=', 10, '+', 4])) },
      { t: '<b>ลองเพิ่ม หยิบออก</b> ไม้ทีละอัน ดูรูปกระจายเปลี่ยนตาม ถ้าครบ 10 อันจะมัดรวมเป็นมัดใหม่', s: 'ลองเพิ่ม หยิบออก ไม้ทีละอัน ถ้าครบสิบอันจะมัดรวมเป็นมัดใหม่', v: el => el.append(bundleMachine(17)) },
      { t: '20 คือ <b>2 มัด</b> เขียนได้ <span class="hl">20 = 10 + 10</span>', v: el => el.append(sticks(20, { labels: true }), eqRow([20, '=', 10, '+', 10])) }
    ],
    game: () => { const ws = shuffle([14, 15, 11, 17, 19, 13, 20, 18, 12, 16]); return [Q.expand20({ n: ws[0] }), Q.expand20({ n: ws[1] }), Q.pickExpand20({ n: ws[2] }), Q.expand20({ n: ws[3], miss: 'n' }), Q.expand20({ n: ws[4], miss: 't' }), Q.pickExpand20({ n: ws[5] }), Q.expand20({ n: ws[6] })]; } },
  { id: 205, title: 'การเปรียบเทียบจำนวนโดยใช้เส้นจำนวน', short: 'เทียบบนเส้นจำนวน', tone: 'lilac',
    goal: 'เปรียบเทียบจำนวน 11 ถึง 20 โดยใช้เส้นจำนวน และใช้คำว่า มากกว่า น้อยกว่า เท่ากับ ได้',
    teach: [
      { t: 'บนเส้นจำนวน จำนวนที่อยู่<b>ทางขวา</b>มีค่า<span class="hl">มากกว่า</span>', v: el => el.append(numberLine(0, 20, { hi: [16], hi2: [13] }), h('div', { class: 'sentence' }, h('span', { class: 'bignum sm' }, 16), h('span', { class: 'blank filled' }, 'มากกว่า'), h('span', { class: 'bignum sm' }, 13))) },
      { t: 'จำนวนที่อยู่<b>ทางซ้าย</b>มีค่า<span class="hl2">น้อยกว่า</span>', v: el => el.append(numberLine(0, 20, { hi: [15], hi2: [19] }), h('div', { class: 'sentence' }, h('span', { class: 'bignum sm' }, 15), h('span', { class: 'blank filled' }, 'น้อยกว่า'), h('span', { class: 'bignum sm' }, 19))) },
      { t: '<b>ลองแตะ</b>ตัวเลข 2 ตัวบนเส้นจำนวน ดูว่าตัวไหนมากกว่า', s: 'ลองแตะตัวเลขสองตัวบนเส้นจำนวน ดูว่าตัวไหนมากกว่า', v: el => el.append(lineTapCompare(14, 20)) }
    ],
    game: () => [...shuffle(WS10).map(([a, b]) => Q.lineCompare({ a, b })), Q.lineCompare({ a: T20(), b: T20() }), Q.compareWord({ a: T20(), b: T20() })] },
  { id: 206, title: 'การใช้เครื่องหมาย >, < และ =', short: 'เครื่องหมาย > < =', tone: 'orange',
    goal: 'ใช้เครื่องหมาย > < = แสดงการเปรียบเทียบจำนวน 11 ถึง 20 ได้',
    teach: [
      { t: '<span class="hl">&gt;</span> อ่านว่า มากกว่า · <span class="hl2">&lt;</span> อ่านว่า น้อยกว่า · <span class="hl3">=</span> อ่านว่า เท่ากับ', v: el => el.append(eqRow([18, '>', 13]), eqRow([12, '<', 14]), eqRow([17, '=', 17])) },
      { t: 'ปากของเครื่องหมาย<b>อ้าไปทางจำนวนที่มากกว่า</b>เสมอ', v: el => el.append(h('div', { class: 'rowstack' }, twoFrames(18, { w: 'clamp(110px,13vw,150px)' }), twoFrames(13, { w: 'clamp(110px,13vw,150px)' })), eqRow([18, '>', 13])) },
      { t: 'ใช้เส้นจำนวนช่วยได้: 14 อยู่ทางซ้ายของ 20 ดังนั้น 14 &lt; 20', v: el => el.append(numberLine(10, 20, { hi: [14], hi2: [20] }), eqRow([14, '<', 20])) }
    ],
    game: () => shuffle(WS11).slice(0, 7).map(([a, b]) => Q.compareSym({ a, b })) },
  { id: 207, title: 'การเรียงลำดับจำนวน', short: 'เรียงลำดับ 11–20', tone: 'yellow',
    goal: 'เรียงลำดับจำนวน 11 ถึง 20 จากน้อยไปมาก และจากมากไปน้อยได้',
    teach: [
      { t: 'เรียงจาก<b>น้อยไปมาก</b>: หาจำนวนที่น้อยที่สุดก่อน เส้นจำนวนช่วยได้', v: el => el.append(numberLine(10, 20, { hi: [11, 14, 18, 20] }), numStrip([11, 14, 18, 20])) },
      { t: 'เรียงจาก<b>มากไปน้อย</b>: หาจำนวนที่มากที่สุดก่อน', v: el => el.append(numStrip([17, 15, 14, 11])) },
      { t: '<b>ลองเรียงเอง</b> จากน้อยไปมาก', s: 'ลองเรียงเอง จากน้อยไปมาก', v: el => el.append(orderDemo([16, 18, 19, 17], 'asc')) }
    ],
    game: () => { const a = shuffle(WS13), d = shuffle(WS14); return [Q.order({ nums: a[0], dir: 'asc' }), Q.order({ nums: d[0], dir: 'desc' }), Q.extreme({ nums: a[1], which: 'max' }), Q.order({ nums: a[2], dir: 'asc' }), Q.extreme({ nums: d[1], which: 'min' }), Q.order({ nums: d[2], dir: 'desc' })]; } },
  { id: 208, title: 'ความสัมพันธ์ของจำนวนแบบส่วนย่อย-ส่วนรวม', short: 'ส่วนย่อย–ส่วนรวม', tone: 'sky',
    goal: 'บอกความสัมพันธ์ของจำนวนแบบส่วนย่อย-ส่วนรวม ของจำนวน 11 ถึง 20 ได้',
    teach: [
      { t: '14 แบ่งเป็น <b>10 กับ 4</b> — 10 และ 4 คือ<span class="hl">ส่วนย่อย</span> 14 คือ<span class="hl">ส่วนรวม</span>', v: el => el.append(twoFrames(14), partWhole(14, 10, 4)) },
      { t: '<b>แตะตัวนับ</b>เพื่อย้ายไปอีกส่วน ส่วนย่อยเปลี่ยน แต่ส่วนรวมยังเป็น 15 เสมอ', s: 'แตะตัวนับเพื่อย้ายไปอีกส่วน ส่วนรวมยังเป็นสิบห้าเสมอ', v: el => el.append(liveSplit(15)) },
      { t: '12 แบ่งเป็นส่วนย่อยได้หลายแบบ เช่น', v: el => el.append(waysToMake(12, [10, 9, 8, 7, 6, 5, 4, 3])) },
      { t: 'รู้ส่วนรวมและส่วนย่อย 1 ส่วน ก็หาอีกส่วนได้: 18 แบ่งเป็น 10 กับเท่าไร?', v: el => { const pw = partWhole(18, 10, 8, { q: 'b' }); const btn = h('button', { class: 'btn accent ia', onclick: e => { e.stopPropagation(); pw.fill(8); btn.remove(); sfx.ok(); say('สิบแปด แบ่งเป็น สิบ กับ แปด', true); } }, icon('eye'), 'แตะเพื่อดูคำตอบ'); el.append(h('div', { class: 'rowstack' }, pw, h('div', { class: 'colstack' }, twoFrames(18), btn))); } }
    ],
    game: () => { const W = () => rnd(11, 20); let w; const q = [];
      w = W(); q.push(Q.partWhole({ whole: w, a: 10, q: 'b', counters: false })); w = W(); q.push(Q.partWhole({ whole: w, a: rnd(1, w - 1), q: 'b', counters: false }));
      w = W(); q.push(Q.split({ whole: w, a: rnd(2, w - 2) })); w = W(); q.push(Q.partWhole({ whole: w, a: rnd(1, w - 1), q: 'a', counters: false }));
      w = W(); q.push(Q.partWhole({ whole: w, a: rnd(3, w - 3), q: 'whole', counters: false })); w = W(); q.push(Q.partWhole({ whole: w, a: rnd(1, w - 1), q: pick(['a', 'b']), counters: false, pen: true }));
      return q; } }
];
const EXAM_CH4 = [
  { q: 'ภาพใดแสดงจำนวน 13', opts: [{ frames: 13 }, { frames: 16 }, { frames: 11 }], a: 0 },
  { q: 'ไม้ 1 มัด (10 อัน) กับไม้อีก 5 อัน รวมเป็นกี่อัน', opts: ['6', '15', '51'], a: 1 },
  { q: '๑๘ อ่านว่าอย่างไร', opts: ['สิบแปด', 'สิบหก', 'แปดสิบ'], a: 0 },
  { q: 'สิบเจ็ด เขียนเป็นตัวเลขฮินดูอารบิกได้อย่างไร', opts: ['71', '17', '7'], a: 1 },
  { q: 'ข้อใดเป็นจำนวนเดียวกันทั้งหมด', opts: ['12   ๑๒   สิบสอง', '15   ๑๕   สิบสี่', '19   ๑๖   สิบเก้า'], a: 0 },
  { q: '16 เขียนในรูปกระจายได้อย่างไร', opts: ['10 + 6', '1 + 6', '10 + 16'], a: 0 },
  { q: '10 + 9 เท่ากับจำนวนใด', opts: ['19', '91', '109'], a: 0 },
  { q: 'บนเส้นจำนวน จำนวนใดอยู่ทางขวาของ 15', opts: ['13', '12', '18'], a: 2 },
  { q: 'ข้อใดถูกต้อง', opts: ['13 > 16', '19 > 15', '14 > 20'], a: 1, legend: true },
  { q: 'ข้อใดควรเติมเครื่องหมาย &lt; ลงใน ☐', opts: ['20 ☐ 11', '12 ☐ 14', '17 ☐ 17'], a: 1, legend: true },
  { q: 'จำนวนในข้อใดมากที่สุด', opts: ['18', '11', '14'], a: 0 },
  { q: 'ข้อใดเรียงลำดับจำนวนจากน้อยไปมาก', opts: ['11   14   18   20', '18   11   14   20', '20   18   14   11'], a: 0 },
  { q: 'ข้อใดเรียงลำดับจำนวนจากมากไปน้อย', opts: ['15   16   17   19', '17   15   14   11', '13   16   19   20'], a: 1 },
  { q: '18 แบ่งเป็น 10 กับจำนวนใด', opts: ['8', '9', '10'], a: 0 },
  { q: '15 แบ่งเป็นส่วนย่อยได้ตามข้อใด', opts: ['9 กับ 6', '8 กับ 5', '10 กับ 4'], a: 0 }
];
LESSONS_CH4.push({
  id: 209, boss: true, title: 'ด่านบอส: บทที่ 4 จำนวนนับ 11 ถึง 20', short: 'ด่านบอส · ข้อสอบ', tone: 'orange',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส',
  exam: spread(EXAM_CH4), pass: 8, bossName: 'ราชาปีศาจยี่สิบ', bossPal: 'orange', emblem: '20'
});

/* =========================================================
   GRADE 1 · CHAPTER 5 — การบวก การลบจำนวนนับไม่เกิน 20  (เมืองบวกลบยี่สิบ)
   ========================================================= */
/* count on: start at the bigger number, tap to add one at a time */
function countOnTap(a, b) {
  const big = Math.max(a, b), small = Math.min(a, b); let k = 0;
  const row = h('div', { class: 'conrow' }, h('span', { class: 'concard num' }, big)), res = h('div', { style: { visibility: 'hidden' } }, eqRow([a, '+', b, '=', a + b]));
  const cs = range(1, small).map(() => { const c = h('span', { class: 'counter b' }); row.append(c); return c; });
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (k >= small) return; cs[k].textContent = big + k + 1; cs[k].classList.add('counted'); k++; sfx.pop(k); say(WORD[big + k], true); if (k === small) { res.style.visibility = ''; btn.remove(); setTimeout(() => say(`${WORD[a]} บวก ${WORD[b]} เท่ากับ ${WORD[a + b]}`, true), 700); } } }, icon('plus'), 'นับต่อทีละ 1');
  return h('div', { class: 'colstack' }, row, btn, res);
}
/* doubles: change n and see n + n */
function doublesDemo(n0 = 6) {
  let n = n0; const vis = h('div'), e = h('div');
  const draw = () => { vis.innerHTML = ''; vis.append(h('div', { class: 'rows20' }, objRow('orange', n, { size: 'clamp(26px,3.6vw,42px)' }), objRow('orange', n, { size: 'clamp(26px,3.6vw,42px)' }))); e.innerHTML = ''; e.append(eqRow([n, '+', n, '=', n + n])); };
  const bt = (d, cls) => h('button', { class: 'btn icon ia ' + cls, onclick: ev => { ev.stopPropagation(); n = Math.max(1, Math.min(10, n + d)); draw(); sfx.pop(n); say(`${WORD[n]} บวก ${WORD[n]} เท่ากับ ${WORD[n + n]}`, true); } }, PM(d > 0 ? '+' : '-'));
  draw(); return h('div', { class: 'colstack' }, vis, e, h('div', { class: 'rowstack' }, bt(-1, ''), bt(1, 'primary')));
}
/* make ten: move part of the smaller number into the bigger number's frame */
function makeTenSim(a = 5, b = 8) {
  const big = Math.max(a, b), small = Math.min(a, b), need = 10 - big, rest = small - need, w = 'clamp(160px,21vw,240px)';
  const fr = h('div'), steps = h('div', { class: 'colstack', style: { gap: '8px' } }); let st = 0;
  const draw = () => { fr.innerHTML = ''; fr.append(h('div', { class: 'tf2' }, tenFrame(st ? 10 : big, { w, color: i => i < big ? '' : 'b' }), tenFrame(st ? rest : small, { w, color: () => 'b' }))); };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++; draw(); sfx.pop(st);
    if (st === 1) { steps.append(h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.2vw,26px)' } }, `ย้าย ${need} ตัวไปเติม ${big} ให้ครบ 10 → เหลือ ${rest}`), eqRow([a, '+', b, '=', rest, '+', 10], { sm: true })); say(`ย้าย ${WORD[need]} ตัว ไปเติมให้ครบสิบ เหลือ ${WORD[rest]}`, true); btn.lastChild.textContent = 'รวมเลย'; }
    else { steps.append(eqRow([rest, '+', 10, '=', a + b], { sm: true })); say(`${WORD[rest]} บวก สิบ เท่ากับ ${WORD[a + b]}`, true); btn.remove(); } } }, icon('right'), 'ทำให้ครบสิบ');
  draw(); return h('div', { class: 'colstack' }, eqRow([a, '+', b, '=', '?'], { sm: true }), fr, btn, steps);
}
/* vertical form with place headings; reveal units then tens */
function vertSteps(a, b, op = '+') {
  const r = op === '+' ? a + b : a - b, pad = n => String(n).padStart(2, ' ').split('');
  const cell = (t, cls = '') => h('span', { class: 'vc ' + cls }, t.trim());
  const ansU = cell(pad(r)[1], 'ans hide'), ansT = cell(pad(r)[0], 'ans hide');
  const g = h('div', { class: 'vgrid' }, h('span'), h('span', { class: 'vh t' }, 'หลักสิบ'), h('span', { class: 'vh u' }, 'หลักหน่วย'),
    h('span'), cell(pad(a)[0]), cell(pad(a)[1]), h('span', { class: 'vop' + (op === '−' ? ' minus' : '') }, op), cell(pad(b)[0]), cell(pad(b)[1]),
    h('span', { class: 'vline2' }), h('span'), ansT, ansU);
  const note = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.2vw,26px)' } }, op === '+' ? 'ตั้งหลักให้ตรงกัน แล้วบวกหลักหน่วยก่อน' : 'ตั้งหลักให้ตรงกัน แล้วลบหลักหน่วยก่อน'); let k = 0;
  const du = (n => +String(n).slice(-1)), dt = n => Math.floor(n / 10);
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); k++; sfx.pop(k);
    if (k === 1) { ansU.classList.remove('hide'); note.textContent = `หลักหน่วย: ${du(a)} ${op} ${du(b)} = ${du(r)}`; say(`หลักหน่วย ${WORD[du(a)]} ${opWord(op === '+' ? '+' : '-')} ${WORD[du(b)]} เท่ากับ ${WORD[du(r)]}`, true); btn.lastChild.textContent = 'หลักสิบ'; }
    else { ansT.classList.remove('hide'); note.textContent = dt(a) && dt(b) ? `หลักสิบ: ${dt(a)} ${op} ${dt(b)} = ${dt(r)} → ตอบ ${r}` : `หลักสิบ: เขียน ${dt(r)} ลงมา → ตอบ ${r}`; say(`ตอบ ${WORD[r]}`, true); btn.remove(); } } }, icon('right'), 'หลักหน่วย');
  return h('div', { class: 'colstack' }, g, note, btn);
}
function threeDemo(nums, op = '+') {
  const [a, b, c] = nums, o = op === '+' ? '+' : '−', mid = op === '+' ? a + b : a - b, r = op === '+' ? mid + c : mid - c;
  const list = h('div', { class: 'colstack', style: { gap: '8px' } }, eqRow([a, o, b, o, c, '=', '?']));
  let k = 0; const rows = [[a, o, b, '=', mid], [mid, o, c, '=', r]];
  const btn = h('button', { class: 'btn accent ia', onclick: e => { e.stopPropagation(); const q = eqRow(rows[k], { sm: true, hi: [4] }); q.style.animation = 'popIn .4s var(--spring)'; list.append(q); sfx.pop(k); say(`${WORD[rows[k][0]]} ${opWord(op)} ${WORD[rows[k][2]]} เท่ากับ ${WORD[rows[k][4]]}`, true); k++; if (k >= 2) btn.remove(); } }, icon('right'), 'ทำทีละขั้น');
  return h('div', { class: 'colstack' }, list, btn);
}
function subCountOnDemo(a = 18, b = 9) {
  const nl = numberLine(Math.max(0, b - 1), Math.min(20, a + 1), { hi: [b], compact: true }), ticks = [...nl.querySelectorAll('.tick')], off = Math.max(0, b - 1), out = h('div', { style: { visibility: 'hidden' } }, eqRow([a, '−', b, '=', a - b]));
  const cnt = h('div', { class: 'bignum sm' }, 0);
  const btn = h('button', { class: 'btn info ia', onclick: async e => { e.stopPropagation(); btn.disabled = true; for (let k = 1; k <= a - b; k++) { await sleep(450); ticks[b + k - off].classList.add('hi2'); cnt.textContent = k; sfx.pop(k); say(WORD[k], true); } await sleep(500); out.style.visibility = ''; sfx.ok(); say(`นับต่อจาก ${WORD[b]} ไปถึง ${WORD[a]} ได้ ${WORD[a - b]} ครั้ง`, true); } }, icon('play'), `นับต่อจาก ${b} ไปถึง ${a}`);
  return h('div', { class: 'colstack' }, nl, h('div', { class: 'rowstack' }, h('span', { class: 'cap' }, 'นับได้'), cnt, h('span', { class: 'cap' }, 'ครั้ง')), btn, out);
}
const WS5_1 = [[2, 11], [9, 4], [8, 8], [10, 5], [5, 14], [19, 1], [9, 9], [6, 5], [12, 3], [14, 2], [15, 5], [7, 6]];
const WS5_2 = [[12, 4], [6, 5], [14, 5], [7, 7]];
const WS5_4 = [[5, 8], [8, 9], [5, 9], [6, 5], [4, 7], [6, 7], [9, 6], [8, 8]];
const WS5_V = [[11, 3], [14, 1], [9, 4], [19, 1], [6, 13], [4, 12], [8, 8], [11, 5], [5, 15], [5, 12], [16, 3], [9, 7], [10, 5], [7, 7], [14, 6], [8, 11], [13, 2], [7, 12]];
const WS5_H = [[13, 4], [11, 1], [4, 9], [7, 7], [14, 4], [19, 0], [15, 5], [5, 6], [7, 8], [9, 9], [15, 2], [8, 11], [14, 6], [12, 1], [17, 2], [14, 5], [13, 3], [2, 9], [5, 12], [8, 12], [5, 14], [12, 8], [3, 16], [2, 10], [18, 0], [13, 7], [10, 5], [1, 15], [0, 14], [12, 2], [16, 1], [6, 7], [6, 6], [9, 4], [11, 9], [1, 10], [9, 7], [6, 12], [14, 3], [15, 4], [6, 11], [7, 13], [1, 12], [4, 14], [10, 3], [10, 2], [1, 16], [1, 17], [15, 3], [5, 11], [10, 8], [3, 15], [9, 10], [13, 0], [12, 7], [4, 16], [2, 18], [18, 1], [1, 18], [16, 3]];
const WS5_3 = [[1, 4, 8], [4, 5, 5], [14, 3, 2], [6, 8, 3], [3, 6, 5], [12, 4, 4], [2, 5, 6], [5, 1, 8], [1, 12, 4], [6, 3, 3], [10, 3, 2], [11, 5, 4], [1, 7, 9], [8, 1, 10], [2, 5, 12], [15, 1, 2], [9, 7, 3], [7, 6, 5]];
const WS5_11 = [[12, 6], [11, 2], [15, 4], [14, 7]], WS5_12 = [[18, 9], [15, 8], [16, 6], [11, 4]];
const WS5_SV = [[14, 5], [16, 3], [19, 9], [11, 5], [17, 14], [20, 6], [12, 12], [16, 4], [13, 7], [18, 8], [15, 8], [11, 3], [16, 13], [20, 5], [18, 4], [19, 11], [16, 12], [13, 5]];
const WS5_SH = [[11, 2], [15, 14], [15, 10], [19, 7], [15, 8], [20, 12], [14, 3], [15, 4], [16, 11], [17, 13], [19, 12], [14, 4], [13, 4], [11, 3], [16, 2], [12, 0], [18, 14], [15, 12], [20, 17], [15, 3], [15, 11], [20, 8], [19, 15], [20, 10], [13, 2], [12, 7], [18, 16], [19, 18], [18, 1], [17, 2], [17, 17], [16, 3], [19, 6], [20, 7], [13, 5], [16, 5], [14, 14], [13, 3], [17, 15], [16, 15], [19, 16], [20, 1], [16, 10], [20, 11], [16, 13], [18, 15], [19, 17], [14, 10], [11, 9], [11, 6], [18, 6], [19, 9], [15, 7], [12, 12], [17, 4], [19, 14], [13, 9]];
const WS5_S3 = [[15, 4, 3], [20, 9, 2], [13, 4, 5], [18, 1, 6], [17, 2, 8], [11, 3, 5], [20, 9, 5], [18, 9, 3], [20, 7, 6], [12, 2, 2], [13, 4, 6], [17, 2, 6]];
const WS5_MIX = ['11-3', '6+7', '13-1', '20-4', '14+3', '12-5', '19+1', '8+8', '16-14', '13-6', '11+4', '8+9', '12-10', '17-12', '4+11', '6+8', '13-3', '15-4', '14-9', '16+4', '5+9', '11+6', '13-4', '18-15', '19-17', '15+5', '14-14', '3+12', '17-7', '20-9', '5+13', '9+10', '12+5'];
const WS5_UN = [[15, '+', '?', '=', 18], ['?', '+', 10, '=', 15], [20, '+', '?', '=', 20], [9, '+', '?', '=', 20], [13, '+', '?', '=', 17], [2, '+', '?', '=', 16], ['?', '+', 5, '=', 19], ['?', '+', 6, '=', 11], [10, '+', '?', '=', 20], ['?', '+', 7, '=', 14], [6, '+', '?', '=', 12],
  [19, '-', '?', '=', 10], ['?', '-', 10, '=', 6], [20, '-', '?', '=', 14], ['?', '-', 11, '=', 7], [18, '-', '?', '=', 3], [17, '-', '?', '=', 11], ['?', '-', 5, '=', 15], ['?', '-', 6, '=', 8], ['?', '-', 5, '=', 12], ['?', '-', 14, '=', 0], [16, '-', '?', '=', 15]];
const WS5_STORY = [
  { text: 'ร้านของแก้วขายน้ำแดงได้ 10 แก้ว ร้านของเอขายได้ 6 แก้ว สองร้านขายน้ำแดงได้รวมกี่แก้ว', a: 10, b: 6, op: '+', unit: 'แก้ว' },
  { text: 'ข้าวหอมเก็บเงินไว้ 13 บาท อยากมีเงินครบ 15 บาท ต้องเก็บเพิ่มอีกกี่บาท', a: 15, b: 13, op: '−', unit: 'บาท' },
  { text: 'ในชั้นของเจนมีหนังสือนิทาน 5 เล่ม พ่อซื้อมาใส่เพิ่ม 13 เล่ม ตอนนี้มีหนังสือกี่เล่ม', a: 5, b: 13, op: '+', unit: 'เล่ม' },
  { text: 'ฟาร์มของลุงมีนก 20 ตัว มีเป็ด 10 ตัว จำนวนนกมากกว่าเป็ดกี่ตัว', a: 20, b: 10, op: '−', unit: 'ตัว' },
  { text: 'ร้านยายมีน้ำปลา 17 ลิตร ขายออกไป 11 ลิตร ยังเหลือน้ำปลากี่ลิตร', a: 17, b: 11, op: '−', unit: 'ลิตร' },
  { text: 'กระปุกของมิ้นท์มีเงิน 10 บาท ยายหยอดให้อีก 6 บาท รวมแล้วมีเงินกี่บาท', a: 10, b: 6, op: '+', unit: 'บาท' },
  { text: 'โต้งมีดินสอ 11 แท่ง ทำตกหายระหว่างทาง 7 แท่ง โต้งเหลือดินสอกี่แท่ง', a: 11, b: 7, op: '−', unit: 'แท่ง' },
  { text: 'สวนของตามีต้นมะขาม 8 ต้น มีต้นมะพร้าวมากกว่าต้นมะขาม 3 ต้น สวนนี้มีต้นมะพร้าวกี่ต้น', a: 8, b: 3, op: '+', unit: 'ต้น' }];
const WS5_MAKE = [
  { a: 20, b: 6, op: '−', stories: ['มีลูกโป่ง 20 ลูก แตกไป 6 ลูก เหลือลูกโป่งกี่ลูก', 'มีลูกโป่ง 20 ลูก ซื้อเพิ่มอีก 6 ลูก มีลูกโป่งทั้งหมดกี่ลูก', 'มีลูกโป่ง 6 ลูก แตกไป 2 ลูก เหลือลูกโป่งกี่ลูก'] },
  { a: 11, b: 7, op: '+', stories: ['มีไข่ 11 ฟอง ซื้อเพิ่มอีก 7 ฟอง มีไข่ทั้งหมดกี่ฟอง', 'มีไข่ 11 ฟอง แตกไป 7 ฟอง เหลือไข่กี่ฟอง', 'มีไข่ 7 ฟอง ซื้อเพิ่มอีก 7 ฟอง มีไข่ทั้งหมดกี่ฟอง'] },
  { a: 12, b: 6, op: '+', stories: ['มีชมพู่ 12 ผล มีมะม่วง 6 ผล มีผลไม้ทั้งหมดกี่ผล', 'มีชมพู่ 12 ผล มีมะม่วง 6 ผล มีชมพู่มากกว่ามะม่วงกี่ผล', 'มีชมพู่ 12 ผล กินไป 2 ผล เหลือชมพู่กี่ผล'] },
  { a: 12, b: 6, op: '−', stories: ['มีชมพู่ 12 ผล มีมะม่วง 6 ผล มีชมพู่มากกว่ามะม่วงกี่ผล', 'มีชมพู่ 12 ผล มีมะม่วง 6 ผล มีผลไม้ทั้งหมดกี่ผล', 'มีชมพู่ 6 ผล ซื้อเพิ่มอีก 12 ผล มีชมพู่ทั้งหมดกี่ผล'] }];
const mix5 = s => { const op = s.includes('+') ? '+' : '−', [a, b] = s.split(/[+-]/).map(Number); return op === '+' ? Q.addFact({ a, b }) : Q.subFact({ a, b }); };
const LESSONS_CH5 = [
  { id: 211, title: 'การหาผลบวกโดยใช้การนับต่อ', short: 'บวก: นับต่อ', tone: 'yellow',
    goal: 'หาผลบวกที่ไม่เกิน 20 โดยเริ่มจากจำนวนที่มากกว่า แล้วนับต่อ รวมถึงการบวกจำนวนเดียวกันและการบวกสามจำนวน',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองบวกลบยี่สิบ</b>! ตอนนี้เรานับถึง 20 ได้แล้ว มาบวกลบกัน', s: 'ยินดีต้อนรับสู่เมืองบวกลบยี่สิบ มาบวกลบกัน', v: el => el.append(mascot('wow', 'big')) },
      { t: '9 + 4: เริ่มที่ <b>9</b> แล้ว<b>นับต่อ</b>อีก 4 — กดนับต่อทีละ 1', s: 'เก้า บวก สี่ เริ่มที่เก้า แล้วนับต่ออีกสี่ กดนับต่อทีละหนึ่ง', v: el => el.append(countOnTap(9, 4)) },
      { t: 'เริ่มจาก<b>จำนวนที่มากกว่า</b>จะนับน้อยกว่า: 2 + 11 เริ่มที่ 11 นับต่ออีก 2', s: 'เริ่มจากจำนวนที่มากกว่าจะนับน้อยกว่า', v: el => el.append(countOnTap(2, 11)) },
      { t: '<b>บวกจำนวนเดียวกัน</b> เช่น 6 + 6 = 12 ลองกด + − เปลี่ยนจำนวนดู', s: 'บวกจำนวนเดียวกัน ลองกดบวกลบเปลี่ยนจำนวนดู', v: el => el.append(doublesDemo(6)) },
      { t: '<b>บวกสามจำนวน</b> ทำทีละขั้น: บวกสองจำนวนแรกก่อน แล้วนับต่ออีกจำนวน', s: 'บวกสามจำนวน ทำทีละขั้น', v: el => el.append(threeDemo([4, 5, 5])) }
    ],
    game: () => { const p = shuffle(WS5_1), t3 = shuffle(WS5_3); return [Q.countOnAdd({ a: p[0][0], b: p[0][1] }), Q.countOnAdd({ a: p[1][0], b: p[1][1] }), Q.doubles({ n: pick([6, 7, 8, 9]) }), Q.addFact({ a: p[2][0], b: p[2][1] }), Q.three({ nums: t3[0] }), Q.addFact({ a: p[3][0], b: p[3][1], pen: true }), Q.three({ nums: t3[1] })]; } },
  { id: 212, title: 'การหาผลบวกโดยใช้เส้นจำนวน', short: 'บวก: เส้นจำนวน', tone: 'sky',
    goal: 'หาผลบวกที่ไม่เกิน 20 โดยใช้เส้นจำนวน และหาผลบวกทั้งแบบแนวนอนและแนวตั้ง',
    teach: [
      { t: '12 + 4: เริ่มที่ <b>12</b> แล้ว<b>กระโดดไปทางขวา 4 ครั้ง</b> — กดดูนะ', s: 'สิบสอง บวก สี่ เริ่มที่สิบสอง แล้วกระโดดไปทางขวาสี่ครั้ง', v: el => el.append(countOn(12, 4)) },
      { t: 'ลองอีกข้อ: 6 + 5', v: el => el.append(countOn(6, 5)) },
      { t: '<b>แนวตั้ง</b>: เขียนหลักหน่วยตรงหลักหน่วย หลักสิบตรงหลักสิบ แล้วบวกหลักหน่วยก่อน', s: 'แนวตั้ง เขียนหลักให้ตรงกัน แล้วบวกหลักหน่วยก่อน', v: el => el.append(vertSteps(14, 5)) },
      { t: '<b>แนวนอน</b> เขียนต่อกันเป็นแถว: 13 + 4 = 17 ได้คำตอบเท่ากับแนวตั้ง', v: el => el.append(eqRow([13, '+', 4, '=', 17]), vertical(13, 4, 17)) }
    ],
    game: () => { const l = shuffle(WS5_2), v = shuffle(WS5_V), hz = shuffle(WS5_H); return [Q.lineCalc({ a: l[0][0], b: l[0][1] }), Q.lineCalc({ a: l[1][0], b: l[1][1] }), Q.addFact({ a: v[0][0], b: v[0][1], vert: true }), Q.lineCalc({ a: l[2][0], b: l[2][1] }), Q.addFact({ a: hz[0][0], b: hz[0][1] }), Q.addFact({ a: v[1][0], b: v[1][1], vert: true, pen: true }), Q.addFact({ a: hz[1][0], b: hz[1][1] })]; } },
  { id: 213, title: 'การหาผลบวกโดยการทำให้ครบสิบ', short: 'บวก: ทำให้ครบสิบ', tone: 'mint',
    goal: 'หาผลบวกที่มากกว่า 10 โดยแบ่งจำนวนหนึ่งไปเติมอีกจำนวนให้ครบสิบ',
    teach: [
      { t: '5 + 8: เติม 8 ให้ครบ 10 ต้องการอีก <b>2</b> จึงแบ่ง 5 เป็น 2 กับ 3 — กดดูทีละขั้น', s: 'ห้า บวก แปด เติมแปดให้ครบสิบ ต้องการอีกสอง กดดูทีละขั้น', v: el => el.append(makeTenSim(5, 8)) },
      { t: 'ลองอีกข้อ: 9 + 6', v: el => el.append(makeTenSim(9, 6)) }
    ],
    game: () => { const p = shuffle(WS5_4); return [Q.makeTen20({ a: p[0][0], b: p[0][1], ask: 'rest' }), Q.makeTen20({ a: p[1][0], b: p[1][1] }), Q.makeTen20({ a: p[2][0], b: p[2][1], ask: 'rest' }), Q.makeTen20({ a: p[3][0], b: p[3][1] }), Q.addFact({ a: p[4][0], b: p[4][1] }), Q.makeTen20({ a: p[5][0], b: p[5][1] })]; } },
  { id: 214, title: 'การหาผลลบโดยใช้การวาดรูป', short: 'ลบ: วาดรูป', tone: 'coral',
    goal: 'หาผลลบของจำนวนที่ตัวตั้งไม่เกิน 20 โดยใช้รูปภาพ แล้วเขียนประโยคสัญลักษณ์',
    teach: [
      { t: 'มีลูกบอล 12 ลูก <b>แตะเอาออก 9 ลูก</b> เหลือกี่ลูก?', s: 'มีลูกบอลสิบสองลูก แตะเอาออกเก้าลูก เหลือกี่ลูก', v: el => el.append(popDemo('ball', 12, 9)) },
      { t: 'ลองอีกข้อ: 14 เอาออก 6', v: el => el.append(popDemo('balloon', 14, 6)) }
    ],
    game: () => [Q.takeAway({ a: 12, b: 9 }), Q.takeAway({ a: 14, b: 6 }), Q.takeAway({ a: 13, b: 4 }), Q.subFact({ a: rnd(12, 18), b: rnd(3, 8) }), Q.takeAway({ a: rnd(15, 18), b: rnd(5, 9) }), Q.subFact({ a: rnd(12, 18), b: rnd(3, 8), pen: true })] },
  { id: 215, title: 'การหาผลลบโดยใช้เส้นจำนวน', short: 'ลบ: เส้นจำนวน', tone: 'lilac',
    goal: 'หาผลลบของจำนวนที่ตัวตั้งไม่เกิน 20 โดยใช้เส้นจำนวน รวมถึงการลบสามจำนวน',
    teach: [
      { t: 'บนเส้นจำนวน <b>ลบ = กระโดดไปทางซ้าย</b>: 12 − 6 — กดดูนะ', s: 'บนเส้นจำนวน ลบคือกระโดดไปทางซ้าย', v: el => el.append(countBack(12, 6)) },
      { t: 'ลองอีกข้อ: 15 − 4', v: el => el.append(countBack(15, 4)) },
      { t: '<b>ลบสามจำนวน</b> ทำทีละขั้นจากซ้ายไปขวา', s: 'ลบสามจำนวน ทำทีละขั้นจากซ้ายไปขวา', v: el => el.append(threeDemo([15, 4, 3], '−')) }
    ],
    game: () => { const l = shuffle(WS5_11), t3 = shuffle(WS5_S3); return [Q.lineCalc({ a: l[0][0], b: l[0][1], op: '−' }), Q.lineCalc({ a: l[1][0], b: l[1][1], op: '−' }), Q.lineCalc({ a: l[2][0], b: l[2][1], op: '−' }), Q.three({ nums: t3[0], op: '−' }), Q.lineCalc({ a: l[3][0], b: l[3][1], op: '−' }), Q.three({ nums: t3[1], op: '−' })]; } },
  { id: 216, title: 'การหาผลลบโดยใช้การนับต่อ', short: 'ลบ: นับต่อ', tone: 'sky',
    goal: 'หาผลลบโดยนับต่อจากตัวลบไปจนถึงตัวตั้ง และหาผลลบทั้งแบบแนวนอนและแนวตั้ง',
    teach: [
      { t: '18 − 9: <b>นับต่อจาก 9 ไปถึง 18</b> ได้กี่ครั้ง คำตอบคือจำนวนครั้งนั้น', s: 'สิบแปด ลบ เก้า นับต่อจากเก้าไปถึงสิบแปด ได้กี่ครั้ง', v: el => el.append(subCountOnDemo(18, 9)) },
      { t: 'ลองอีกข้อ: 15 − 8', v: el => el.append(subCountOnDemo(15, 8)) },
      { t: '<b>ลบแนวตั้ง</b>: ตั้งหลักให้ตรงกัน แล้วลบหลักหน่วยก่อน', s: 'ลบแนวตั้ง ตั้งหลักให้ตรงกัน แล้วลบหลักหน่วยก่อน', v: el => el.append(vertSteps(16, 3, '−')) },
      { t: '<b>แนวนอน</b>: 19 − 7 = 12 ได้คำตอบเท่ากับแนวตั้ง', v: el => el.append(eqRow([19, '−', 7, '=', 12]), vertical(19, 7, 12, '−')) }
    ],
    game: () => { const c = shuffle(WS5_12), v = shuffle(WS5_SV), hz = shuffle(WS5_SH); return [Q.subCountOn({ a: c[0][0], b: c[0][1] }), Q.subCountOn({ a: c[1][0], b: c[1][1] }), Q.subFact({ a: v[0][0], b: v[0][1], vert: true }), Q.subCountOn({ a: c[2][0], b: c[2][1] }), Q.subFact({ a: hz[0][0], b: hz[0][1] }), Q.subFact({ a: v[1][0], b: v[1][1], vert: true, pen: true }), Q.subFact({ a: hz[1][0], b: hz[1][1] })]; } },
  { id: 217, title: 'การหาค่าของตัวไม่ทราบค่า', short: 'ตัวไม่ทราบค่า', tone: 'yellow',
    goal: 'หาผลบวกและผลลบ และหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การบวกและการลบ',
    teach: [
      { t: 'ดู<b>เครื่องหมาย</b>ให้ดีก่อนคิด: + บวก · − ลบ', v: el => el.append(eqRow([13, '−', 6, '=', 7], { sm: true }), eqRow([6, '+', 8, '=', 14], { sm: true })) },
      { t: '<b>ตัวไม่ทราบค่า</b> ☐: 15 + ☐ = 18 → 18 แบ่งเป็น 15 กับ 3 ดังนั้น ☐ = 3', v: el => el.append(eqRow([15, '+', '?', '=', 18]), revealBtn(partWhole(18, 15, 3, { q: 'b' }), 3)) },
      { t: '☐ − 5 = 15 → ตัวตั้ง = 15 + 5 = <span class="hl">20</span>', v: el => el.append(eqRow(['?', '−', 5, '=', 15]), revealBtn(partWhole(20, 5, 15, { q: 'whole' }), 20)) },
      { t: '19 − ☐ = 10 → ตัวลบ = 19 − 10 = <span class="hl">9</span>', v: el => el.append(eqRow([19, '−', '?', '=', 10]), revealBtn(partWhole(19, 9, 10, { q: 'a' }), 9)) }
    ],
    game: () => { const m = shuffle(WS5_MIX), u = shuffle(WS5_UN); return [Q.unknown20({ t: u[0] }), mix5(m[0]), Q.unknown20({ t: u[1] }), Q.unknown20({ t: u[2] }), mix5(m[1]), Q.unknown20({ t: u[3] }), Q.unknown20({ t: u[4] })]; } },
  { id: 218, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (1)', short: 'โจทย์ปัญหา (1)', tone: 'orange',
    goal: 'วิเคราะห์โจทย์ปัญหา เขียนประโยคสัญลักษณ์ และหาคำตอบของโจทย์ปัญหาการบวกและการลบ',
    teach: [
      { t: 'อ่านโจทย์ แล้วดูว่าถามอะไร: <b>รวมกัน เพิ่มขึ้น</b> → บวก · <b>เหลือ</b> → ลบ', v: el => el.append(h('div', { class: 'stmt' }, 'ร้านของแก้วขายน้ำแดงได้ 13 แก้ว ร้านของเอขายได้ 4 แก้ว สองร้านขายน้ำแดงได้รวมกี่แก้ว'), eqRow([13, '+', 4, '=', 17])) },
      { t: '"มีอยู่ … เพิ่มอีกเท่าไรจึงจะครบ" ใช้การลบ: ข้าวหอมเก็บเงินไว้ 10 บาท ต้องเก็บเพิ่มอีกกี่บาทจึงครบ 20 บาท', v: el => el.append(eqRow([20, '−', 10, '=', 10])) },
      { t: 'เปรียบเทียบ: <b>"มากกว่ากี่ตัว"</b> ใช้การลบ', v: el => el.append(h('div', { class: 'stmt' }, 'ฟาร์มของลุงมีนก 18 ตัว มีเป็ด 15 ตัว จำนวนนกมากกว่าเป็ดกี่ตัว'), eqRow([18, '−', 15, '=', 3])) }
    ],
    game: () => [Q.story20(WS5_STORY[0]), Q.story20(WS5_STORY[1]), Q.story20(WS5_STORY[2]), Q.story20(WS5_STORY[3]), Q.story20(pick(WS5_STORY.slice(4)))] },
  { id: 219, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (2)', short: 'โจทย์ปัญหา (2)', tone: 'red',
    goal: 'แสดงวิธีหาคำตอบของโจทย์ปัญหาการบวกและการลบ และสร้างโจทย์ปัญหาจากภาพหรือประโยคสัญลักษณ์ได้',
    teach: [
      { t: 'จ๋ามีเงิน 12 บาท แม่ให้เพิ่ม 8 บาท → <b>เพิ่ม</b> ใช้การบวก', v: el => el.append(h('div', { class: 'stmt' }, 'กระปุกของมิ้นท์มีเงิน 12 บาท ยายหยอดให้อีก 8 บาท รวมแล้วมีเงินกี่บาท'), eqRow([12, '+', 8, '=', 20])) },
      { t: '"ปลูกมะพร้าว<b>มากกว่า</b>มะขามอยู่ 5 ต้น" ถามว่าปลูกมะพร้าวกี่ต้น → ใช้การ<b>บวก</b>', v: el => el.append(h('div', { class: 'stmt' }, 'สวนของตามีต้นมะขาม 9 ต้น มีต้นมะพร้าวมากกว่าต้นมะขาม 5 ต้น สวนนี้มีต้นมะพร้าวกี่ต้น'), eqRow([9, '+', 5, '=', 14])) },
      { t: '<b>สร้างโจทย์</b>จากประโยคสัญลักษณ์ 20 − 6 = 14 เช่น "มีลูกโป่ง 20 ลูก แตกไป 6 ลูก เหลือ 14 ลูก"', v: el => el.append(eqRow([20, '−', 6, '=', 14]), h('div', { class: 'stmt' }, 'มีลูกโป่ง 20 ลูก แตกไป 6 ลูก เหลือลูกโป่งกี่ลูก')) }
    ],
    game: () => { const mk = shuffle(WS5_MAKE); return [Q.story20(WS5_STORY[4]), Q.story20(WS5_STORY[5]), Q.pickStory(mk[0]), Q.story20(WS5_STORY[6]), Q.story20(WS5_STORY[7]), Q.pickStory(mk[1])]; } }
];
const EXAM_CH5 = [
  { q: '9 + 4 = ☐', opts: ['13', '12', '14'], a: 0 },
  { q: '8 + 8 เท่ากับเท่าใด', opts: ['16', '18', '15'], a: 0 },
  { q: '5 + 8 ทำให้ครบสิบได้ตามข้อใด', opts: ['3 + 10', '5 + 10', '8 + 10'], a: 0 },
  { q: 'ผลบวกของ 14 + 6 เท่ากับเท่าใด', opts: ['20', '19', '18'], a: 0 },
  { q: '1 + 12 + 4 = ☐', opts: ['17', '16', '18'], a: 0 },
  { q: '15 − 4 = ☐', opts: ['11', '9', '19'], a: 0 },
  { q: '18 − 9 นับต่อจาก 9 ไปถึง 18 ได้กี่ครั้ง', opts: ['9', '8', '27'], a: 0 },
  { q: '20 − 6 = ☐', opts: ['14', '16', '26'], a: 0 },
  { q: '18 − 1 − 6 = ☐', opts: ['11', '13', '12'], a: 0 },
  { q: 'ข้อใดมีผลลัพธ์เท่ากับ 15', opts: ['20 − 5', '11 + 3', '19 − 3'], a: 0 },
  { q: '15 + ☐ = 18 จำนวนใน ☐ คือจำนวนใด', opts: ['3', '33', '13'], a: 0 },
  { q: '☐ − 5 = 15 จำนวนใน ☐ คือจำนวนใด', opts: ['20', '10', '15'], a: 0 },
  { q: '☐ + 7 = 14 จำนวนใน ☐ คือจำนวนใด', opts: ['7', '21', '6'], a: 0 },
  { q: 'ข้อใดถูกต้อง', opts: ['13 + 4 = 18', '16 − 3 = 13', '9 + 7 = 15'], a: 1 },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['12 + 8 = 20', '17 − 2 = 15', '13 − 6 = 8'], a: 2 },
  { q: 'ร้านของแก้วขายน้ำแดงได้ 13 แก้ว ร้านของเอขายได้ 4 แก้ว สองร้านขายได้รวมกี่แก้ว เขียนประโยคสัญลักษณ์ได้อย่างไร', opts: ['13 + 4 = 17', '13 − 4 = 9', '13 + 4 = 18'], a: 0 },
  { q: 'ร้านยายมีน้ำปลา 16 ลิตร ขายออกไป 12 ลิตร ยังเหลือน้ำปลากี่ลิตร', opts: ['4 ลิตร', '28 ลิตร', '6 ลิตร'], a: 0 },
  { q: 'ฟาร์มของลุงมีนก 18 ตัว มีเป็ด 15 ตัว จำนวนนกมากกว่าเป็ดกี่ตัว', opts: ['3 ตัว', '33 ตัว', '13 ตัว'], a: 0 },
  { q: 'สวนของตามีต้นมะขาม 9 ต้น มีต้นมะพร้าวมากกว่าต้นมะขาม 5 ต้น สวนนี้มีต้นมะพร้าวกี่ต้น', opts: ['4 ต้น', '14 ต้น', '15 ต้น'], a: 1 },
  { q: 'ประโยคสัญลักษณ์ 11 + 7 = ☐ ตรงกับโจทย์ข้อใด', opts: ['มีไข่ 11 ฟอง ซื้อเพิ่มอีก 7 ฟอง มีไข่ทั้งหมดกี่ฟอง', 'มีไข่ 11 ฟอง แตกไป 7 ฟอง เหลือไข่กี่ฟอง', 'มีไข่ 7 ฟอง ซื้อเพิ่มอีก 7 ฟอง มีไข่ทั้งหมดกี่ฟอง'], a: 0 }
];
LESSONS_CH5.push({
  id: 229, boss: true, title: 'ด่านบอส: บทที่ 5 การบวก การลบจำนวนนับไม่เกิน 20', short: 'ด่านบอส · ข้อสอบ', tone: 'red',
  goal: 'ตอบคำถามท้ายบท 20 ข้อ ตอบถูกอย่างน้อย 10 ข้อเพื่อชนะบอส',
  exam: spread(EXAM_CH5), pass: 10, bossName: 'ราชาปีศาจบวกลบ', bossPal: 'red', emblem: '±'
});

/* =========================================================
   GRADE 1 · CHAPTER 6 — แผนภูมิรูปภาพ  (เมืองแผนภูมิ)
   ========================================================= */
const D = (label, e, n) => ({ label, e, n });
const C_VEG = { title: 'จำนวนผักชนิดต่าง ๆ', orient: 'v', unit: 'หัว', unitName: 'ผัก', data: [D('บร็อกโคลี', 'broccoli', 3), D('ฟักทอง', 'pumpkin', 3), D('แคร์รอต', 'carrot', 4), D('มะเขือเทศ', 'tomato', 5)] };
const C_SEA = { title: 'จำนวนสัตว์น้ำชนิดต่าง ๆ', orient: 'v', unit: 'ตัว', unitName: 'สัตว์', data: [D('หมึก', 'squid', 5), D('ปลาดาว', 'starfishA', 3), D('ปลา', 'fish', 4), D('ปลาปักเป้า', 'puffer', 2), D('ม้าน้ำ', 'seahorse', 2)] };
const C_FLOWER = { title: 'จำนวนดอกไม้ชนิดต่าง ๆ', orient: 'v', unit: 'ดอก', unitName: 'ดอกไม้', data: [D('ลิลลี่', 'lily', 2), D('กุหลาบ', 'rose', 5), D('ดอกบัว', 'lotus', 1), D('มะลิ', 'jasmine', 4), D('ทานตะวัน', 'sunflower', 3), D('กล้วยไม้', 'orchid', 2)] };
const C_LOLLI = { title: 'จำนวนสติกเกอร์ที่ครูให้นักเรียนใน 5 วัน', unit: 'ชิ้น', unitName: 'อมยิ้ม', keyE: 'lollipop', data: [D('วันจันทร์', 'lollipop', 7), D('วันอังคาร', 'lollipop', 9), D('วันพุธ', 'lollipop', 5), D('วันพฤหัสบดี', 'lollipop', 8), D('วันศุกร์', 'lollipop', 6)] };
const C_SHOP = { title: 'จำนวนสินค้าที่ขายในร้านค้าแห่งหนึ่ง', unit: 'ชิ้น', unitName: 'สินค้า', data: [D('เค้ก', 'cake', 5), D('โดนัท', 'donut', 3), D('ครัวซองต์', 'croissant', 4), D('แซนด์วิช', 'sandwich', 1), D('คุกกี้', 'cookie', 6)] };
const C_MEDAL = { title: 'จำนวนเหรียญรางวัลที่นักเรียนได้รับจากกีฬาต่าง ๆ', unit: 'เหรียญ', unitName: 'เหรียญ', keyE: 'medal', data: [D('วิ่ง 100 เมตร', 'medal', 6), D('กระโดดไกล', 'medal', 8), D('ว่ายน้ำ', 'medal', 5), D('ฟุตบอล', 'medal', 1), D('บาสเกตบอล', 'medal', 3)] };
const C_FRUIT = { title: 'จำนวนนักเรียนหญิง ป.1 ที่ชอบกินผลไม้ชนิดต่าง ๆ', orient: 'v', unit: 'คน', unitName: 'นักเรียนหญิง', keyE: 'girl', data: [D('แตงโม', 'girl', 3), D('กล้วย', 'girl', 2), D('องุ่น', 'girl', 8), D('ส้ม', 'girl', 1), D('แอปเปิล', 'girl', 3)] };
const C_VOL = { title: 'จำนวนคนที่เข้าร่วมกิจกรรมต่าง ๆ', unit: 'คน', unitName: 'คน', keyE: 'girl', colName: 'กิจกรรม', data: [D('ปลูกต้นไม้', 'girl', 15), D('แจกอาหาร', 'girl', 9), D('เก็บขยะ', 'girl', 5)] };
const C_PRIZE = { title: 'จำนวนของรางวัลที่นักเรียนได้รับ', unit: 'ชิ้น', tally: true, colName: 'ของรางวัล', data: [D('ตุ๊กตา', 'teddy', 8), D('หนังสือ', 'book', 3), D('ลูกโป่ง', 'balloon', 10), D('ตัวต่อ', 'blocks', 5), D('ปากกา', 'pen', 8)] };
const C_ART = { title: 'จำนวนรางวัลจากการแสดงผลงานศิลปะ', unit: 'รางวัล', unitName: 'รางวัล', colName: 'ประเภท', data: [D('วาดภาพระบายสี', 'palette', 12), D('ปั้นดินเหนียว', 'vase', 6), D('ถ่ายภาพ', 'camera', 10)] };
const CHART_TITLES = [C_VEG, C_SEA, C_FLOWER, C_LOLLI, C_SHOP, C_MEDAL, C_FRUIT, C_VOL, C_ART].map(c => c.title);
const withTally = c => ({ ...c, tally: true });
/* scattered pictures → tap → they line up into a picture graph */
function sortToChart(c) {
  const box = h('div'); box.append(mixField(c.data));
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); box.innerHTML = ''; box.append(chartNode(c, { counts: true })); btn.remove(); sfx.win(); say('จัดรูปชนิดเดียวกันเรียงเป็นแถว นับง่ายขึ้นเยอะเลย', true); } }, icon('sparkle'), 'จัดเรียงเป็นแผนภูมิ');
  return h('div', { class: 'colstack' }, box, btn);
}
/* tap a row/column: its pictures get numbered and the count is read aloud */
function rowCounter(c) {
  const ch = chartNode(c), note = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.4vw,26px)' } }, 'แตะแถวเพื่อนับ');
  ch.rows.forEach((r, i) => { r.classList.add('ia', 'tapr'); r.onclick = e => { e.stopPropagation(); ch.rows.forEach(x => { x.classList.remove('on'); x.querySelectorAll('.pc-ic i').forEach(b => b.remove()); }); r.classList.add('on');
    r.querySelectorAll('.pc-cells .pc-ic').forEach((ic, k) => { const b = h('i', { class: 'num' }, k + 1); b.style.animationDelay = k * .08 + 's'; ic.append(b); });
    const d = c.data[i]; note.innerHTML = `<b>${d.label}</b> มี <span class="hl">${d.n}</span> ${c.unit}`; sfx.pop(d.n); say(`${d.label} มี ${WORD[d.n]} ${c.unit}`, true); }; });
  return h('div', { class: 'colstack' }, ch, note);
}
/* compare two rows: the extra pictures light up */
function compareRows(c, a, b) {
  const ch = chartNode(c, { hl: [a, b] }), A = c.data[a], B = c.data[b], big = A.n >= B.n ? a : b, d = Math.abs(A.n - B.n);
  const out = h('div', { class: 'colstack', style: { visibility: 'hidden' } }, h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.4vw,26px)' } }, `${c.data[big].label} มากกว่า ${c.data[big === a ? b : a].label} อยู่ ${d} ${c.unit}`), eqRow([Math.max(A.n, B.n), '−', Math.min(A.n, B.n), '=', d], { sm: true }));
  const btn = h('button', { class: 'btn accent ia', onclick: e => { e.stopPropagation(); [...ch.rows[big].querySelectorAll('.pc-cells .pc-ic')].slice(Math.min(A.n, B.n)).forEach(ic => ic.classList.add('extra')); out.style.visibility = ''; btn.remove(); sfx.ok(); } }, icon('eye'), 'ดูส่วนที่มากกว่า');
  return h('div', { class: 'colstack' }, ch, btn, out);
}
function tallyToChart(c) {
  const box = h('div', { class: 'rowstack' }, chartNode(withTally(c)));
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); box.append(chartNode({ ...c, tally: false }, { counts: true })); btn.remove(); sfx.win(); } }, icon('right'), 'เปลี่ยนเป็นแผนภูมิรูปภาพ');
  return h('div', { class: 'colstack' }, box, btn);
}
const LESSONS_CH6 = [
  { id: 231, title: 'การอ่านแผนภูมิรูปภาพอย่างง่าย', short: 'แผนภูมิอย่างง่าย', tone: 'mint',
    goal: 'จัดรูปภาพชนิดเดียวกันเป็นแผนภูมิรูปภาพ และอ่านจำนวนของแต่ละชนิดจากแผนภูมิได้',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองแผนภูมิ</b>! มาเรียนวิธีนับของหลายชนิดให้ง่ายขึ้นกัน', s: 'ยินดีต้อนรับสู่เมืองแผนภูมิ มาเรียนวิธีนับของหลายชนิดให้ง่ายขึ้นกัน', v: el => el.append(mascot('wow', 'big')) },
      { t: 'แม่ค้าขายผักหลายชนิดปนกัน นับยากใช่ไหม? <b>แตะปุ่ม</b>เพื่อจัดเรียง', s: 'แม่ค้าขายผักหลายชนิดปนกัน นับยากใช่ไหม แตะปุ่มเพื่อจัดเรียง', v: el => el.append(sortToChart(C_VEG)) },
      { t: 'ภาพที่จัดเรียงแบบนี้เรียกว่า <span class="hl">แผนภูมิรูปภาพ</span> มี<b>ชื่อแผนภูมิ</b>อยู่ด้านบน และ<b>ชื่อแต่ละชนิด</b>อยู่ใต้แถว', v: el => el.append(chartNode(C_VEG)) },
      { t: '<b>แตะแต่ละแถว</b>เพื่อนับว่าสัตว์น้ำแต่ละชนิดมีกี่ตัว', s: 'แตะแต่ละแถวเพื่อนับว่าสัตว์น้ำแต่ละชนิดมีกี่ตัว', v: el => el.append(rowCounter(C_SEA)) },
      { t: 'แถวที่<b>ยาวที่สุด</b> = มากที่สุด · แถวที่<b>สั้นที่สุด</b> = น้อยที่สุด · แถวที่<b>ยาวเท่ากัน</b> = เท่ากัน', v: el => el.append(chartNode(C_SEA, { hl: [0] })) }
    ],
    game: () => [Q.buildChart({ chart: mixChart(C_VEG) }), Q.chartAsk({ chart: mixChart(C_SEA), ask: 'most' }), Q.chartAsk({ chart: mixChart(C_SEA), ask: 'same' }), Q.buildChart({ chart: mixChart(C_FLOWER) }), Q.chartAsk({ chart: mixChart(C_FLOWER), ask: 'least' }), Q.chartAsk({ chart: mixChart(C_FLOWER), ask: 'count', a: pick([1, 3, 4]) })] },
  { id: 232, title: 'การอ่านแผนภูมิรูปภาพ', short: 'อ่านแผนภูมิรูปภาพ', tone: 'sky',
    goal: 'อ่านแผนภูมิรูปภาพแนวนอนและแนวตั้งที่กำหนดให้ 1 รูปแทน 1 หน่วย เปรียบเทียบ และตอบคำถามเกี่ยวกับมากที่สุด น้อยที่สุด ผลรวม ผลต่าง และการเรียงลำดับได้',
    teach: [
      { t: 'แผนภูมิรูปภาพมี 3 ส่วน: <b>ชื่อแผนภูมิ</b> · <b>รายการ</b> (วันจันทร์ วันอังคาร …) · <b>กำหนดให้</b> 1 รูปแทนกี่ชิ้น', v: el => el.append(chartNode(C_LOLLI)) },
      { t: '<b>แตะแต่ละแถว</b>นับอมยิ้มที่คุณครูแจกในแต่ละวัน', s: 'แตะแต่ละแถว นับอมยิ้มที่คุณครูแจกในแต่ละวัน', v: el => el.append(rowCounter(C_LOLLI)) },
      { t: '<b>รวมกัน</b>ใช้การบวก: โดนัท 3 กับเค้ก 5 รวมเป็น 8 ชิ้น', v: el => el.append(chartNode(C_SHOP, { hl: [0, 1] }), eqRow([3, '+', 5, '=', 8], { sm: true })) },
      { t: '<b>มากกว่ากี่ชิ้น</b>ใช้การลบ: วันจันทร์มากกว่าวันศุกร์กี่ชิ้น?', s: 'มากกว่ากี่ชิ้น ใช้การลบ', v: el => el.append(compareRows(C_LOLLI, 0, 4)) },

      { t: 'แผนภูมิรูปภาพ<b>แนวตั้ง</b> รูปเรียงจากล่างขึ้นบน คอลัมน์ที่<b>สูงที่สุด</b>มากที่สุด', v: el => el.append(chartNode(C_FRUIT)) },
      { t: '<b>แตะแต่ละคอลัมน์</b>นับจำนวนนักเรียนที่ชอบผลไม้แต่ละชนิด', s: 'แตะแต่ละคอลัมน์ นับจำนวนนักเรียนที่ชอบผลไม้แต่ละชนิด', v: el => el.append(rowCounter(C_FRUIT)) },
      { t: 'เปรียบเทียบ: นักเรียนชอบองุ่นมากกว่าแอปเปิลกี่คน?', v: el => el.append(compareRows(C_FRUIT, 2, 4)) },
      { t: 'เรียงจาก<b>มากไปน้อย</b>: หาแถวที่ยาวที่สุดก่อน แล้วไล่ลงไป', v: el => el.append(chartNode(C_SHOP, { sm: true }), h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.2vw,24px)' } }, 'คุกกี้ · เค้ก · ครัวซองต์ · โดนัท · แซนด์วิช')) }
    ],
    game: () => [Q.chartAsk({ chart: mixChart(C_LOLLI), ask: 'title' }), Q.chartAsk({ chart: mixChart(C_LOLLI), ask: 'count', a: 3 }), Q.chartAsk({ chart: mixChart(C_SHOP), ask: 'most' }), Q.chartAsk({ chart: mixChart(C_SHOP), ask: 'total', a: 1, b: 0 }), Q.chartAsk({ chart: mixChart(C_LOLLI), ask: 'diff', a: 0, b: 4 }), Q.chartAsk({ chart: mixChart(C_MEDAL), ask: 'equal', a: 2, k: 3 }), Q.chartAsk({ chart: mixChart(C_FRUIT), ask: 'total', a: 1, b: 4 }), Q.chartAsk({ chart: mixChart(C_FRUIT), ask: 'cmp', a: 0, b: 1 }), Q.chartAsk({ chart: mixChart(C_FRUIT), ask: 'least' }), Q.chartAsk({ chart: mixChart(C_SHOP), ask: 'order' })] },
  { id: 233, title: 'รอยขีดกับแผนภูมิรูปภาพ', short: 'รอยขีดกับแผนภูมิ', tone: 'orange',
    goal: 'ใช้รอยขีดบันทึกจำนวน อ่านจำนวนจากรอยขีด และนำข้อมูลจากรอยขีดมาเขียนแผนภูมิรูปภาพได้',
    teach: [
      { t: '<span class="hl">รอยขีด</span> คือการขีดเส้น 1 ขีดแทน 1 ครั้ง พอครบ <b>5</b> ให้ขีดทับเป็นกลุ่ม นับทีละ 5 ได้เร็ว', s: 'รอยขีด คือการขีดเส้นหนึ่งขีดแทนหนึ่งครั้ง พอครบห้าให้ขีดทับเป็นกลุ่ม', v: el => el.append(h('div', { class: 'rowstack' }, tally(4, { scale: 1.6 }), tally(5, { scale: 1.6 }), tally(9, { scale: 1.6 }))) },
      { t: '<b>ลองกดขีดเพิ่ม</b> ดูว่าขีดที่ 5, 10, 15 เป็นอย่างไร', s: 'ลองกดขีดเพิ่ม ดูว่าขีดที่ห้า สิบ สิบห้า เป็นอย่างไร', v: el => el.append(tallyBuilder(null, { showCount: true })) },
      { t: 'อ่านรอยขีด: <b>นับกลุ่มละ 5</b> แล้วนับต่อ — 5, 10, 15 → 15 คน', v: el => el.append(h('div', { class: 'tallybig' }, tally(15, { scale: 1.8 })), eqRow([5, '+', 5, '+', 5, '=', 15], { sm: true })) },
      { t: 'นำรอยขีดมาเขียน<b>แผนภูมิรูปภาพ</b> — กดดูนะ', s: 'นำรอยขีดมาเขียนแผนภูมิรูปภาพ', v: el => el.append(tallyToChart(C_ART)) }
    ],
    game: () => [Q.tallyRead({ n: 15, label: 'ปลูกต้นไม้' }), Q.tallyMake({ n: 9, label: 'แจกอาหาร' }), Q.buildChart({ chart: mixChart(C_VOL), from: 'tally' }), Q.chartAsk({ chart: mixChart(C_PRIZE), ask: 'most' }), Q.chartAsk({ chart: mixChart(C_PRIZE), ask: 'diff', a: 4, b: 1 }), Q.buildChart({ chart: mixChart(C_ART), from: 'tally' }), Q.chartAsk({ chart: withTally(C_ART), ask: 'least' })] }
];
const EXAM_CH6 = [
  { q: 'จากแผนภูมิ ผักชนิดใดมีจำนวนมากที่สุด', chart: C_VEG, opts: ['มะเขือเทศ', 'แคร์รอต', 'ฟักทอง'], a: 0 },
  { q: 'จากแผนภูมิ แคร์รอตมีกี่หัว', chart: C_VEG, opts: ['4 หัว', '3 หัว', '5 หัว'], a: 0 },
  { q: 'จากแผนภูมิ สัตว์น้ำชนิดใดมีจำนวนเท่ากัน', chart: C_SEA, opts: ['ปลาปักเป้ากับม้าน้ำ', 'หมึกกับปลา', 'ปลาดาวกับปลา'], a: 0 },
  { q: 'จากแผนภูมิ ดอกไม้ชนิดใดมีจำนวนน้อยที่สุด', chart: C_FLOWER, opts: ['ดอกบัว', 'ลิลลี่', 'กล้วยไม้'], a: 0 },
  { q: 'กำหนดให้ 1 รูปแทนอมยิ้ม 1 ชิ้น วันพฤหัสบดีคุณครูแจกอมยิ้มกี่ชิ้น', chart: C_LOLLI, opts: ['8 ชิ้น', '7 ชิ้น', '9 ชิ้น'], a: 0 },
  { q: 'วันใดที่คุณครูแจกอมยิ้มน้อยที่สุด', chart: C_LOLLI, opts: ['วันพุธ', 'วันศุกร์', 'วันจันทร์'], a: 0 },
  { q: 'วันจันทร์คุณครูแจกอมยิ้มมากกว่าวันศุกร์กี่ชิ้น', chart: C_LOLLI, opts: ['1 ชิ้น', '2 ชิ้น', '13 ชิ้น'], a: 0 },
  { q: 'ร้านค้าขายโดนัทรวมกับเค้กได้กี่ชิ้น', chart: C_SHOP, opts: ['8 ชิ้น', '2 ชิ้น', '9 ชิ้น'], a: 0 },
  { q: 'ข้อใดเรียงลำดับสินค้าที่ขายได้จากมากไปน้อยถูกต้อง', chart: C_SHOP, opts: ['คุกกี้ เค้ก ครัวซองต์ โดนัท แซนด์วิช', 'เค้ก คุกกี้ โดนัท ครัวซองต์ แซนด์วิช', 'แซนด์วิช โดนัท ครัวซองต์ เค้ก คุกกี้'], a: 0 },
  { q: 'ถ้าได้เหรียญจากว่ายน้ำเพิ่มอีก 3 เหรียญ จะเท่ากับกีฬาชนิดใด', chart: C_MEDAL, opts: ['กระโดดไกล', 'วิ่ง 100 เมตร', 'บาสเกตบอล'], a: 0 },
  { q: 'นักเรียนหญิงชอบกินกล้วยกับแอปเปิลรวมกันกี่คน', chart: C_FRUIT, opts: ['5 คน', '6 คน', '1 คน'], a: 0 },
  { q: 'จำนวนนักเรียนหญิงที่ชอบกินแตงโม ... กล้วย', chart: C_FRUIT, opts: ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'], a: 0 },
  { q: 'รอยขีดในข้อใดแสดงจำนวน 9', opts: [{ tally: 9 }, { tally: 4 }, { tally: 14 }], a: 0 },
  { q: 'จากรอยขีด ของรางวัลชนิดใดที่นักเรียนได้รับมากที่สุด', chart: C_PRIZE, opts: ['ลูกโป่ง', 'ตุ๊กตา', 'ปากกา'], a: 0 },
  { q: 'จำนวนรางวัลจากการวาดภาพระบายสีมากกว่าการถ่ายภาพกี่รางวัล', chart: withTally(C_ART), opts: ['2 รางวัล', '12 รางวัล', '22 รางวัล'], a: 0 }
];
LESSONS_CH6.push({
  id: 239, boss: true, title: 'ด่านบอส: บทที่ 6 แผนภูมิรูปภาพ', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส',
  exam: spread(EXAM_CH6), pass: 8, bossName: 'ราชาปีศาจแผนภูมิ', bossPal: 'mint', emblem: 'IIII'
});

/* =========================================================
   GRADE 1 · CHAPTER 7 — การวัดน้ำหนัก  (เมืองตาชั่ง)
   ========================================================= */
const IT = (e, name) => ({ e, name });
const W = { durian: IT('durian', 'ทุเรียน'), banana: IT('banana', 'กล้วย'), orange: IT('orange', 'ส้ม'), apple: IT('apple', 'แอปเปิล'), tomato: IT('tomato', 'มะเขือเทศ'), chompoo: IT('chompoo', 'ชมพู่'), corn: IT('corn', 'ข้าวโพด'), mango: IT('mango', 'มะม่วง'),
  rambutan: IT('rambutan', 'เงาะ'), grape: IT('grape', 'องุ่น'), pineapple: IT('pineapple', 'สับปะรด'), mangosteen: IT('mangosteen', 'มังคุด'), shrimp: IT('shrimp', 'กุ้ง'), chicken: IT('chicken', 'เนื้อไก่'), squid: IT('squid', 'หมึก'), fish: IT('fish', 'ปลา'),
  salmon: IT('salmon', 'แซลมอน'), pork: IT('pork', 'เนื้อหมู'), mushroom: IT('mushroom', 'เห็ด'), potato: IT('potato', 'มันฝรั่ง'), cabbage: IT('cabbage', 'กะหล่ำปลี'), carrot: IT('carrot', 'แคร์รอต'), coconut: IT('coconut', 'มะพร้าว'),
  pumpkin: IT('pumpkin', 'ฟักทอง'), watermelon: IT('watermelon', 'แตงโม'), guava: IT('guava', 'ฝรั่ง'), chili: IT('chili', 'พริก'), eggplant: IT('eggplant', 'มะเขือม่วง'), lemon: IT('lemon', 'เลมอน'),
  pencil: IT('pencil', 'ดินสอ'), book: IT('book', 'หนังสือ'), balloon: IT('balloon', 'ลูกโป่ง'), teddy: IT('teddy', 'ตุ๊กตา'), egg: IT('egg', 'ไข่ไก่') };
const WS7_BAL = [[W.durian, W.banana, 1], [W.orange, W.apple, -1], [W.tomato, W.chompoo, 0], [W.corn, W.mango, 1], [W.rambutan, W.grape, 0], [W.pineapple, W.mangosteen, 1], [W.shrimp, W.chicken, -1], [W.squid, W.fish, -1], [W.salmon, W.pork, 1], [W.mushroom, W.potato, -1], [W.mango, W.tomato, 0], [W.chompoo, W.lemon, 0]];
const WS7_MARB = [[W.orange, 6], [W.cabbage, 5], [IT('chili', 'พริกหยวก'), 3], [W.carrot, 9], [W.coconut, 12], [IT('eggplant', 'มันม่วง'), 2]];
const WS7_KG = [[W.durian, 2], [W.banana, 6], [W.orange, 7], [W.apple, 1], [W.tomato, 4], [W.chompoo, 7], [W.pumpkin, 5], [IT('potato', 'เผือก'), 6], [W.watermelon, 7], [W.mushroom, 1], [W.guava, 4], [W.coconut, 7]];
const WS7_SET = [[W.mango, 3], [W.cabbage, 6], [W.pineapple, 2], [W.potato, 4], [W.corn, 1], [W.grape, 5]];
const WS7_EST = [[W.pencil, 0], [W.watermelon, 1], [W.balloon, 0], [W.pumpkin, 1], [W.egg, 0], [W.coconut, 1], [W.apple, 0], [W.durian, 1], [W.teddy, 0]];
const WS7_KGCMP = [[W.chicken, W.fish, 4, 3], [W.fish, W.shrimp, 3, 1], [W.salmon, W.squid, 2, 7], [W.pork, W.squid, 5, 7], [W.rambutan, W.durian, 3, 6], [W.pork, W.chicken, 4, 2], [W.mango, W.orange, 7, 7], [W.pineapple, W.chompoo, 6, 1], [W.tomato, W.orange, 3, 4]];
const WS7_KD = [[W.watermelon, 13], [IT('guava', 'อะโวคาโด'), 23], [W.cabbage, 35], [W.chili, 15], [W.eggplant, 25], [W.coconut, 8], [W.rambutan, 2], [W.mango, 12], [W.guava, 18], [IT('guava', 'น้อยหน่า'), 10], [W.banana, 27], [W.grape, 4]];
const WS7_KDSET = [[W.rambutan, 3], [W.lemon, 6], [W.pineapple, 11], [W.tomato, 20], [W.guava, 25], [W.orange, 13]];
const WS7_KDCMP = [[W.rambutan, W.chili, 7, 18], [W.chili, W.orange, 18, 4], [W.grape, W.rambutan, 10, 7], [W.rambutan, W.orange, 7, 4], [W.watermelon, W.chompoo, 4, 10], [W.pineapple, W.durian, 6, 12], [W.watermelon, W.pineapple, 4, 6], [W.durian, W.watermelon, 12, 4]];
const WS7_STORY1 = [
  { text: 'ลูกแมวหนัก 7 กิโลกรัม ลูกสุนัขหนัก 5 กิโลกรัม ลูกแมวหนักกว่าลูกสุนัขกี่กิโลกรัม', a: 7, b: 5, op: '−', unit: 'กิโลกรัม' },
  { text: 'ฟักทองหนัก 10 กิโลกรัม กะหล่ำปลีหนัก 7 กิโลกรัม ถ้านำทั้งสองอย่างมาชั่งรวมกันจะหนักกี่กิโลกรัม', a: 10, b: 7, op: '+', unit: 'กิโลกรัม' },
  { text: 'ต้าซื้อลำไยมา 10 ขีด ให้ป้าข้างบ้านไป 8 ขีด ต้าเหลือลำไยกี่ขีด', a: 10, b: 8, op: '−', unit: 'ขีด' },
  { text: 'แม่มีกระเทียม 13 ขีด ยายเอามาให้อีก 4 ขีด แม่มีกระเทียมรวมกี่ขีด', a: 13, b: 4, op: '+', unit: 'ขีด' }];
const WS7_STORY2 = [
  { text: 'ห่านหนัก 3 กิโลกรัม แพะหนักกว่าห่าน 5 กิโลกรัม แพะหนักกี่กิโลกรัม', a: 3, b: 5, op: '+', unit: 'กิโลกรัม' },
  { text: 'ร้านผลไม้มีมังคุด 20 กิโลกรัม ขายไปแล้ว 11 กิโลกรัม ร้านเหลือมังคุดกี่กิโลกรัม', a: 20, b: 11, op: '−', unit: 'กิโลกรัม' },
  { text: 'ฟ้ามีกล้วยหนัก 5 ขีด บีมมีกล้วยหนัก 9 ขีด สองคนมีกล้วยรวมกันหนักกี่ขีด', a: 5, b: 9, op: '+', unit: 'ขีด' },
  { text: 'ป้าขายแตงกวาไป 8 กิโลกรัม ยังเหลืออยู่ 2 กิโลกรัม ตอนแรกป้ามีแตงกวากี่กิโลกรัม', a: 8, b: 2, op: '+', unit: 'กิโลกรัม' }];
/* balance lab: one thing on the left, add / remove marbles on the right */
function marbleLab(a, w = 4) {
  let n = 0; const bal = balance({ e: a.e, n: 2 }, { e: 'marble', n: 0 }, { wl: w, wr: 0, labels: [a.name, 'ลูกแก้ว'] }), sent = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.3vw,26px)' } });
  const draw = () => { bal.set({ e: a.e, n: 2 }, { e: 'marble', n }, w, n); sent.innerHTML = n < w ? `${a.name}<b> หนักกว่า </b>ลูกแก้ว ${n} ลูก` : n > w ? `${a.name}<b> เบากว่า </b>ลูกแก้ว ${n} ลูก` : `${a.name}<b class="hl"> หนักเท่ากับ </b>ลูกแก้ว ${n} ลูก`; };
  const bt = (d, lab, cls) => h('button', { class: 'btn ia ' + cls, onclick: e => { e.stopPropagation(); const v = Math.max(0, Math.min(9, n + d)); if (v === n) { sfx.no(); return; } n = v; draw(); sfx.pop(n); if (n === w) { sfx.win(); say(`สมดุลแล้ว ${a.name} หนักเท่ากับลูกแก้ว ${WORD[w]} ลูก`, true); } } }, PM(d > 0 ? '+' : '-'), lab);
  draw(); return h('div', { class: 'colstack' }, bal, sent, h('div', { class: 'rowstack' }, bt(-1, 'เอาออก', ''), bt(1, 'ใส่ลูกแก้ว', 'primary')));
}
/* pick what goes on each pan and watch the beam */
function balanceLab(pool) {
  let li = 0, ri = 1; const bal = balance({ e: pool[0].e, n: 1 }, { e: pool[1].e, n: 1 }, { labels: ['', ''] }), sent = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.3vw,26px)' } });
  const draw = () => { const A = pool[li], B = pool[ri]; bal.set({ e: A.e, n: 1 }, { e: B.e, n: 1 }, A.w, B.w); bal.querySelector('.bal-lab.l').textContent = A.name; bal.querySelector('.bal-lab.r').textContent = B.name;
    const rel = A.w > B.w ? 'หนักกว่า' : A.w < B.w ? 'เบากว่า' : 'หนักเท่ากับ'; sent.innerHTML = `${A.name} <b class="hl">${rel}</b> ${B.name}`; return rel; };
  const cyc = side => h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); if (side) ri = (ri + 1) % pool.length; else li = (li + 1) % pool.length; const rel = draw(); sfx.pop(li + ri); say(`${pool[li].name} ${rel} ${pool[ri].name}`, true); } }, icon('replay'), side ? 'เปลี่ยนของข้างขวา' : 'เปลี่ยนของข้างซ้าย');
  draw(); return h('div', { class: 'colstack' }, bal, sent, h('div', { class: 'rowstack' }, cyc(0), cyc(1)));
}
/* spring scale lab: tap things to put them on / take them off the plate */
function scaleLab(pool, unit = 'kg') {
  const on = new Set(), u = unit === 'kd' ? 'ขีด' : 'กิโลกรัม';
  const sc = springScale({ v: 0, unit, list: [], col: 'mint' }), read = h('div', { class: 'bignum sm' }, `0`), cap = h('div', { class: 'cap', style: { fontSize: '20px' } }, u);
  const tray = h('div', { class: 'tray' }, ...pool.map((it, i) => { const b = h('button', { class: 'tray-it ia' }, art(it.e), h('b', null, it.name), h('small', { class: 'num' }, `${it.w} ${u}`));
    b.onclick = e => { e.stopPropagation(); on.has(i) ? on.delete(i) : on.add(i); b.classList.toggle('on', on.has(i)); const v = [...on].reduce((s, k) => s + pool[k].w, 0);
      if (v >= (unit === 'kd' ? 40 : 8)) { on.delete(i); b.classList.remove('on'); sfx.no(); say('หนักเกินที่เครื่องชั่งอ่านได้', true); return; }
      sc.setItems([...on].map(k => pool[k].e)); sc.setValue(v); read.textContent = v; sfx.pop(v); say(unit === 'kd' ? `${WORD[v] || v} ขีด` : `${WORD[v]} กิโลกรัม`, true); }; return b; }));
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, sc, h('div', { class: 'colstack', style: { gap: '2px' } }, read, cap)), tray, h('div', { class: 'cap' }, 'แตะของเพื่อวางบนเครื่องชั่ง แตะอีกครั้งเพื่อยกออก'));
}
function compareScales(a, b, va, vb, unit = 'kg') {
  const u = unit === 'kd' ? 'ขีด' : 'กิโลกรัม', rel = va > vb ? 'หนักกว่า' : va < vb ? 'เบากว่า' : 'หนักเท่ากับ';
  const out = h('div', { class: 'colstack', style: { visibility: 'hidden' } }, h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.4vw,26px)' } }, `${a.name} ${rel} ${b.name}${va !== vb ? ` อยู่ ${Math.abs(va - vb)} ${u}` : ''}`), va !== vb ? eqRow([Math.max(va, vb), '−', Math.min(va, vb), '=', Math.abs(va - vb)], { sm: true }) : h('span'));
  const btn = h('button', { class: 'btn accent ia', onclick: e => { e.stopPropagation(); out.style.visibility = ''; btn.remove(); sfx.ok(); say(`${a.name} ${rel} ${b.name}`, true); } }, icon('eye'), 'เปรียบเทียบ');
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, springScale({ v: va, unit, e: a.e, n: 2, sm: true, col: 'coral', label: `${a.name} ${va} ${u}` }), springScale({ v: vb, unit, e: b.e, n: 2, sm: true, col: 'sky', label: `${b.name} ${vb} ${u}` })), btn, out);
}
const LESSONS_CH7 = [
  { id: 241, title: 'การวัดน้ำหนักโดยใช้เครื่องชั่งสองแขนอย่างง่าย', short: 'เครื่องชั่งสองแขน', tone: 'yellow',
    goal: 'เปรียบเทียบน้ำหนักโดยใช้เครื่องชั่งสองแขน ใช้คำว่า หนักกว่า เบากว่า หนักเท่ากับ และวัดน้ำหนักด้วยหน่วยที่ไม่ใช่หน่วยมาตรฐาน',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองตาชั่ง</b>! วันนี้เราจะมาชั่งน้ำหนักของสิ่งต่าง ๆ กัน', s: 'ยินดีต้อนรับสู่เมืองตาชั่ง วันนี้เราจะมาชั่งน้ำหนักของสิ่งต่าง ๆ กัน', v: el => el.append(mascot('wow', 'big')) },
      { t: '<b>เครื่องชั่งสองแขน</b>: ข้างที่<b>ต่ำลง</b>หนักกว่า ข้างที่<b>ยกขึ้น</b>เบากว่า — กดเปลี่ยนของแต่ละข้างดูนะ', s: 'เครื่องชั่งสองแขน ข้างที่ต่ำลงหนักกว่า ข้างที่ยกขึ้นเบากว่า กดเปลี่ยนของดูนะ', v: el => el.append(balanceLab([{ ...W.durian, w: 5 }, { ...W.banana, w: 2 }, { ...W.apple, w: 1 }, { ...W.orange, w: 1 }, { ...W.pineapple, w: 3 }])) },
      { t: 'ถ้าเครื่องชั่ง<b>อยู่ในแนวระดับ</b> แปลว่าสองข้าง<span class="hl">หนักเท่ากัน</span>', v: el => el.append(balance({ e: 'tomato', n: 3 }, { e: 'chompoo', n: 3 }, { wl: 1, wr: 1, labels: ['มะเขือเทศ', 'ชมพู่'] }), h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.3vw,26px)' } }, 'มะเขือเทศ หนักเท่ากับ ชมพู่')) },
      { t: 'ใช้<b>ลูกแก้ว</b>ชั่งได้ด้วย: ใส่ลูกแก้วจนเครื่องชั่งสมดุล แล้วนับว่ากี่ลูก', s: 'ใช้ลูกแก้วชั่งได้ด้วย ใส่ลูกแก้วจนเครื่องชั่งสมดุล แล้วนับว่ากี่ลูก', v: el => el.append(marbleLab(W.orange, 6)) }
    ],
    game: () => { const b = shuffle(WS7_BAL), m = shuffle(WS7_MARB); return [Q.balanceCmp({ a: b[0][0], b: b[0][1], rel: b[0][2] }), Q.balanceCmp({ a: b[1][0], b: b[1][1], rel: b[1][2] }), Q.marbles({ a: m[0][0], n: m[0][1] }), Q.balanceCmp({ a: b[2][0], b: b[2][1], rel: b[2][2] }), Q.marbles({ a: m[1][0], n: m[1][1] }), Q.balanceCmp({ a: b[3][0], b: b[3][1], rel: b[3][2] })]; } },
  { id: 242, title: 'การวัดน้ำหนักเป็นกิโลกรัมโดยใช้เครื่องชั่งสปริง', short: 'ชั่งเป็นกิโลกรัม', tone: 'sky',
    goal: 'วัดน้ำหนักเป็นกิโลกรัมโดยใช้เครื่องชั่งสปริง อ่านน้ำหนักจากหน้าปัด และคาดคะเนน้ำหนักเทียบกับ 1 กิโลกรัม',
    teach: [
      { t: '<b>กิโลกรัม</b> เป็นหน่วยวัดน้ำหนัก เขียนย่อว่า <span class="hl">กก.</span> นี่คือลูกตุ้มหนัก 1 กิโลกรัม', v: el => el.append(h('span', { class: 'est-it big' }, art('kg1'), h('b', null, '1 กิโลกรัม'))) },
      { t: '<b>เครื่องชั่งสปริง</b>: วางของบนจาน แล้วอ่านตัวเลขที่<b>เข็มชี้</b> — แตะของเพื่อวางบนเครื่องชั่งดูนะ', s: 'เครื่องชั่งสปริง วางของบนจาน แล้วอ่านตัวเลขที่เข็มชี้ แตะของเพื่อวางบนเครื่องชั่ง', v: el => el.append(scaleLab([{ ...W.watermelon, w: 3 }, { ...W.pumpkin, w: 2 }, { ...W.pineapple, w: 1 }, { ...W.coconut, w: 1 }])) },
      { t: '<b>คาดคะเน</b>: ลองนึกว่าของนั้นหนักกว่าหรือเบากว่า 1 กิโลกรัม แล้วชั่งจริงเพื่อตรวจ', v: el => el.append(h('div', { class: 'rowstack' }, h('span', { class: 'est-it' }, art('pencil'), h('b', null, 'ดินสอ: เบากว่า 1 กก.')), h('span', { class: 'est-it' }, art('watermelon'), h('b', null, 'แตงโม: หนักกว่า 1 กก.')))) }
    ],
    game: () => { const k = shuffle(WS7_KG), st = shuffle(WS7_SET), es = shuffle(WS7_EST); return [Q.readScale({ a: k[0][0], v: k[0][1] }), Q.readScale({ a: k[1][0], v: k[1][1] }), Q.setScale({ a: st[0][0], v: st[0][1] }), Q.estimate1kg({ a: es[0][0], heavy: es[0][1] }), Q.readScale({ a: k[2][0], v: k[2][1] }), Q.setScale({ a: st[1][0], v: st[1][1] }), Q.estimate1kg({ a: es[1][0], heavy: es[1][1] })]; } },
  { id: 243, title: 'การเปรียบเทียบน้ำหนักเป็นกิโลกรัม', short: 'เทียบกิโลกรัม', tone: 'coral',
    goal: 'เปรียบเทียบน้ำหนักเป็นกิโลกรัม บอกสิ่งที่หนักที่สุด เบาที่สุด และใช้คำว่า หนักกว่า เบากว่า หนักเท่ากับ',
    teach: [
      { t: 'อ่านน้ำหนักทั้งสองเครื่อง แล้ว<b>เทียบจำนวน</b>: จำนวนมากกว่า = <span class="hl">หนักกว่า</span>', s: 'อ่านน้ำหนักทั้งสองเครื่อง แล้วเทียบจำนวน จำนวนมากกว่าหนักกว่า', v: el => el.append(compareScales(W.chicken, W.fish, 4, 3)) },
      { t: 'น้ำหนักเท่ากัน ใช้คำว่า <b>หนักเท่ากับ</b>', v: el => el.append(compareScales(W.mango, W.orange, 7, 7)) },
      { t: 'หลายสิ่ง: หาจำนวนที่<b>มากที่สุด</b> = หนักที่สุด · <b>น้อยที่สุด</b> = เบาที่สุด', v: el => el.append(h('div', { class: 'rowstack' }, springScale({ v: 4, e: 'chicken', n: 2, sm: true, col: 'coral', label: 'เนื้อไก่ 4 กก.' }), springScale({ v: 3, e: 'fish', n: 2, sm: true, col: 'sky', label: 'ปลา 3 กก.' }), springScale({ v: 1, e: 'shrimp', n: 2, sm: true, col: 'lilac', label: 'กุ้ง 1 กก.' })), h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.2vw,24px)' } }, 'เนื้อไก่หนักที่สุด · กุ้งเบาที่สุด')) }
    ],
    game: () => { const c = shuffle(WS7_KGCMP); return [Q.scalesCmp({ a: c[0][0], b: c[0][1], va: c[0][2], vb: c[0][3] }), Q.scalesExtreme({ items: [{ ...W.chicken, v: 4 }, { ...W.fish, v: 3 }, { ...W.shrimp, v: 1 }], which: 'max' }), Q.scalesCmp({ a: c[1][0], b: c[1][1], va: c[1][2], vb: c[1][3] }), Q.scalesExtreme({ items: [{ ...W.salmon, v: 2 }, { ...W.squid, v: 7 }, { ...W.pork, v: 5 }], which: 'min' }), Q.scalesCmp({ a: c[2][0], b: c[2][1], va: c[2][2], vb: c[2][3] }), Q.scalesExtreme({ items: [{ ...W.pineapple, v: 6 }, { ...W.chompoo, v: 1 }, { ...W.tomato, v: 3 }, { ...W.orange, v: 4 }], which: pick(['max', 'min']) })]; } },
  { id: 244, title: 'การวัดน้ำหนักเป็นขีด', short: 'ชั่งเป็นขีด', tone: 'mint',
    goal: 'วัดน้ำหนักเป็นขีดโดยใช้เครื่องชั่งสปริง และอ่านน้ำหนักเป็นขีด',
    teach: [
      { t: 'ของเบา ๆ ชั่งเป็น <b>ขีด</b> — <span class="hl">10 ขีด = 1 กิโลกรัม</span>', s: 'ของเบา ๆ ชั่งเป็นขีด สิบขีดเท่ากับหนึ่งกิโลกรัม', v: el => el.append(springScale({ v: 10, unit: 'kd', e: 'kg1', n: 1, col: 'mint', label: '1 กิโลกรัม = 10 ขีด' })) },
      { t: 'หน้าปัดแบบขีด: ตัวเลขบอก<b>กิโลกรัม</b> ระหว่างตัวเลขมี <b>10 ขีด</b> นับทีละขีดจาก 0', v: el => el.append(h('div', { class: 'rowstack' }, springScale({ v: 3, unit: 'kd', e: 'rambutan', n: 3, sm: true, col: 'lilac', label: 'เงาะ 3 ขีด' }), springScale({ v: 13, unit: 'kd', e: 'watermelon', n: 1, sm: true, col: 'coral', label: 'แตงโม 13 ขีด' }))) },
      { t: '<b>แตะผลไม้</b>วางบนเครื่องชั่ง แล้วอ่านน้ำหนักเป็นขีด', s: 'แตะผลไม้วางบนเครื่องชั่ง แล้วอ่านน้ำหนักเป็นขีด', v: el => el.append(scaleLab([{ ...W.orange, w: 2 }, { ...W.mango, w: 3 }, { ...W.apple, w: 2 }, { ...W.grape, w: 4 }, { ...W.banana, w: 5 }], 'kd')) }
    ],
    game: () => { const k = shuffle(WS7_KD), st = shuffle(WS7_KDSET); return [Q.readScale({ a: k[0][0], v: k[0][1], unit: 'kd' }), Q.readScale({ a: k[1][0], v: k[1][1], unit: 'kd' }), Q.setScale({ a: st[0][0], v: st[0][1], unit: 'kd' }), Q.readScale({ a: k[2][0], v: k[2][1], unit: 'kd' }), Q.setScale({ a: st[1][0], v: st[1][1], unit: 'kd' }), Q.readScale({ a: k[3][0], v: k[3][1], unit: 'kd' })]; } },
  { id: 245, title: 'การเปรียบเทียบน้ำหนักเป็นขีด', short: 'เทียบขีด', tone: 'lilac',
    goal: 'เปรียบเทียบน้ำหนักเป็นขีด บอกว่าหนักกว่าหรือเบากว่า และหนักกว่าหรือเบากว่าอยู่กี่ขีด',
    teach: [
      { t: 'เปรียบเทียบเป็นขีด แล้วบอกว่า<b>ต่างกันกี่ขีด</b> ด้วยการลบ', s: 'เปรียบเทียบเป็นขีด แล้วบอกว่าต่างกันกี่ขีด ด้วยการลบ', v: el => el.append(compareScales(W.chili, W.rambutan, 18, 7, 'kd')) },
      { t: 'อีกคู่: แตงโม กับ ชมพู่', v: el => el.append(compareScales(W.watermelon, W.chompoo, 4, 10, 'kd')) }
    ],
    game: () => shuffle(WS7_KDCMP).slice(0, 6).map(([a, b, va, vb]) => Q.scalesCmp({ a, b, va, vb, unit: 'kd', diff: true })) },
  { id: 246, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (1)', short: 'โจทย์น้ำหนัก (1)', tone: 'orange',
    goal: 'แสดงวิธีหาคำตอบของโจทย์ปัญหาการบวกและการลบเกี่ยวกับน้ำหนักที่มีหน่วยเป็นกิโลกรัมและขีด',
    teach: [
      { t: 'โจทย์น้ำหนักคิดเหมือนโจทย์บวกลบ แต่<b>ต้องเขียนหน่วย</b>ทุกครั้ง: กิโลกรัม หรือ ขีด', v: el => el.append(h('div', { class: 'stmt' }, 'ฟักทองหนัก 8 กิโลกรัม กะหล่ำปลีหนัก 6 กิโลกรัม ถ้านำทั้งสองอย่างมาชั่งรวมกันจะหนักกี่กิโลกรัม'), eqRow([8, '+', 6, '=', 14]), h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.2vw,24px)' } }, 'ตอบ 14 กิโลกรัม')) },
      { t: '<b>"หนักกว่ากี่กิโลกรัม"</b> ใช้การลบ', v: el => el.append(h('div', { class: 'stmt' }, 'ลูกแมวหนัก 4 กิโลกรัม ลูกสุนัขหนัก 3 กิโลกรัม ลูกแมวหนักกว่าลูกสุนัขกี่กิโลกรัม'), balance({ e: 'cat', n: 1 }, { e: 'dog', n: 1 }, { wl: 4, wr: 3, labels: ['แมว 4 กก.', 'สุนัข 3 กก.'] }), eqRow([4, '−', 3, '=', 1])) }
    ],
    game: () => WS7_STORY1.map(st => Q.story20(st)) },
  { id: 247, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (2)', short: 'โจทย์น้ำหนัก (2)', tone: 'red',
    goal: 'แสดงวิธีหาคำตอบของโจทย์ปัญหาการบวกและการลบเกี่ยวกับน้ำหนักที่ซับซ้อนขึ้น',
    teach: [
      { t: '<b>"หนักกว่า … อยู่"</b> แล้วถามว่าหนักกี่กิโลกรัม → ใช้การ<b>บวก</b>', v: el => el.append(h('div', { class: 'stmt' }, 'ห่านหนัก 2 กิโลกรัม แพะหนักกว่าห่าน 4 กิโลกรัม แพะหนักกี่กิโลกรัม'), eqRow([2, '+', 4, '=', 6])) },
      { t: '<b>"ขายไปแล้วเหลือ … เดิมมีเท่าไร"</b> → เอาที่ขายกับที่เหลือมา<b>บวก</b>กัน', v: el => el.append(h('div', { class: 'stmt' }, 'ป้าขายแตงกวาไป 7 กิโลกรัม ยังเหลือ 4 กิโลกรัม ตอนแรกป้ามีแตงกวากี่กิโลกรัม'), eqRow([7, '+', 4, '=', 11])) }
    ],
    game: () => [...WS7_STORY2.map(st => Q.story20(st)), Q.story20(pick(WS7_STORY1))] }
];
const EXAM_CH7 = [
  { q: 'จากเครื่องชั่ง ทุเรียน ... กล้วย', opts: ['หนักกว่า', 'เบากว่า', 'หนักเท่ากับ'], a: 0, bal: [['durian', 2], ['banana', 2], 1] },
  { q: 'จากเครื่องชั่ง มะเขือเทศ ... ชมพู่', opts: ['หนักเท่ากับ', 'หนักกว่า', 'เบากว่า'], a: 0, bal: [['tomato', 3], ['chompoo', 3], 0] },
  { q: 'จากเครื่องชั่ง กุ้ง ... เนื้อไก่', opts: ['เบากว่า', 'หนักกว่า', 'หนักเท่ากับ'], a: 0, bal: [['shrimp', 3], ['chicken', 1], -1] },
  { q: 'ส้มหนักเท่ากับลูกแก้วกี่ลูก', opts: ['6 ลูก', '5 ลูก', '3 ลูก'], a: 0, bal: [['orange', 2], ['marble', 6], 0] },
  { q: 'ทุเรียนหนักกี่กิโลกรัม', scale: [2, 'kg', 'durian'], opts: ['2 กิโลกรัม', '3 กิโลกรัม', '6 กิโลกรัม'], a: 0 },
  { q: 'ฟักทองหนักกี่กิโลกรัม', scale: [5, 'kg', 'pumpkin'], opts: ['5 กิโลกรัม', '4 กิโลกรัม', '7 กิโลกรัม'], a: 0 },
  { q: 'ข้อใดน่าจะหนักกว่า 1 กิโลกรัม', opts: ['แตงโม 1 ผล', 'ดินสอ 1 แท่ง', 'ไข่ไก่ 1 ฟอง'], a: 0 },
  { q: 'เนื้อไก่หนัก 4 กิโลกรัม ปลาหนัก 3 กิโลกรัม เนื้อไก่ ... ปลา', opts: ['หนักกว่า', 'เบากว่า', 'หนักเท่ากับ'], a: 0 },
  { q: 'แซลมอนหนัก 2 กก. หมึกหนัก 7 กก. เนื้อหมูหนัก 5 กก. สิ่งใดหนักที่สุด', opts: ['หมึก', 'เนื้อหมู', 'แซลมอน'], a: 0 },
  { q: 'แตงโมหนักกี่ขีด', scale: [13, 'kd', 'watermelon'], opts: ['13 ขีด', '3 ขีด', '31 ขีด'], a: 0 },
  { q: '1 กิโลกรัม เท่ากับกี่ขีด', opts: ['10 ขีด', '100 ขีด', '1 ขีด'], a: 0 },
  { q: 'พริกหนัก 18 ขีด เงาะหนัก 7 ขีด พริกหนักกว่าเงาะอยู่กี่ขีด', opts: ['11 ขีด', '25 ขีด', '10 ขีด'], a: 0 },
  { q: 'ลูกแมวหนัก 4 กิโลกรัม ลูกสุนัขหนัก 3 กิโลกรัม ลูกแมวหนักกว่าลูกสุนัขกี่กิโลกรัม', opts: ['1 กิโลกรัม', '7 กิโลกรัม', '2 กิโลกรัม'], a: 0 },
  { q: 'ฟ้ามีกล้วยหนัก 4 ขีด บีมมีกล้วยหนัก 8 ขีด สองคนมีกล้วยรวมกันหนักกี่ขีด', opts: ['12 ขีด', '4 ขีด', '10 ขีด'], a: 0 },
  { q: 'ป้าขายแตงกวาไป 7 กิโลกรัม เหลืออีก 4 กิโลกรัม ตอนแรกป้ามีแตงกวากี่กิโลกรัม', opts: ['11 กิโลกรัม', '3 กิโลกรัม', '10 กิโลกรัม'], a: 0 }
];
LESSONS_CH7.push({ id: 249, boss: true, title: 'ด่านบอส: บทที่ 7 การวัดน้ำหนัก', short: 'ด่านบอส · ข้อสอบ', tone: 'yellow',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส', exam: spread(EXAM_CH7), pass: 8, bossName: 'ราชาปีศาจตาชั่ง', bossPal: 'yellow', emblem: 'กก.' });

/* =========================================================
   GRADE 1 · CHAPTER 8 — การบอกตำแหน่งและอันดับที่  (เมืองตำแหน่ง · ภาคเรียนที่ 2)
   ========================================================= */
/* ---- teach ≠ game: games re-arrange the pictures used while teaching ---- */
const mixChart = c => ({ ...c, data: shuffle(c.data) });
const mixScene = items => { const slots = shuffle(items.map(({ x, y, s, rot }) => ({ x, y, s, rot }))); return items.map((it, i) => ({ ...it, ...slots[i] })); };
const mixVals = (list, key) => { const v = shuffle(list.map(x => x[key])); return list.map((x, i) => ({ ...x, [key]: v[i] })); };
const notSame = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const reshuffle = list => { let r = shuffle(list); for (let g = 0; g < 9 && notSame(r, list); g++) r = shuffle(list); return r; };
const omit = (pool, skip) => pool.filter(p => !skip.some(q => q[0] === p[0] && q[1] === p[1]));
const WS8_LINE = ['ออย', 'สิงห์', 'แตงโม', 'ณัฐ', 'ส้ม'];
const WS8_GRID = [['คิม', 'ฝน', 'เต๋า'], ['บอล', 'จอย', 'โบ'], ['กิ๊ฟ', 'พอล', 'นุ่น']];
const WS8_HORSE = [{ name: 'พี', e: 'rabbit', pos: .35 }, { name: 'เน', e: 'dog', pos: .6 }, { name: 'เสือ', e: 'cat', pos: .85 }];
const WS8_BUS = ['แพม', 'เอ', 'ต่อ', 'พราว', 'มอส'];
const WS8_BALL = [{ name: 'หลิน', n: 10 }, { name: 'นุ้ย', n: 7 }, { name: 'ก๊อต', n: 12 }];
const WS8_SHELF = [['apple', 'mango', 'pomelo'], ['strawberry', 'mangosteen', 'watermelon'], ['durian', 'chompoo', 'pineapple'], ['banana', 'guava', 'grape']];
const FRUIT_TH = { apple: 'แอปเปิล', mango: 'มะม่วง', pomelo: 'ส้มโอ', strawberry: 'สตรอว์เบอร์รี', mangosteen: 'มังคุด', watermelon: 'แตงโม', durian: 'ทุเรียน', chompoo: 'ชมพู่', pineapple: 'สับปะรด', banana: 'กล้วย', guava: 'ฝรั่ง', grape: 'องุ่น' };
const WS8_BIKE = [{ name: 'บอล', e: 'kid1', pos: .74 }, { name: 'เบส', e: 'kid3', pos: .5 }, { name: 'ต้า', e: 'kid5', pos: .64 }, { name: 'เค', e: 'kid7', pos: .38 }, { name: 'ไกค์', e: 'kid9', pos: .84 }, { name: 'เกม', e: 'kid11', pos: .93 }];
const WS8_DOLL = [{ name: 'ทีมสีฟ้า', n: 5 }, { name: 'ทีมสีเขียว', n: 2 }, { name: 'ทีมสีแดง', n: 6 }];
const WS8_TARGET = [{ name: 'ทีมสีเขียว', col: '#2FBF8C', hits: [7, 8, 10] }, { name: 'ทีมสีน้ำเงิน', col: '#4C7BF0', hits: [6, 8, 9] }, { name: 'ทีมสีแดง', col: '#FF5A6A', hits: [9, 8, 7] }];
/* tap a kid: neighbours get labelled */
function lineTap(names) {
  const lu = lineup(names), note = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.3vw,26px)', minHeight: '1.6em' } }, 'แตะเด็กคนไหนก็ได้');
  lu.kids.forEach((k, i) => { k.classList.add('ia'); k.style.cursor = 'pointer'; k.onclick = e => { e.stopPropagation(); lu.kids.forEach(x => { x.classList.remove('on', 'nb'); x.querySelector('.lu-badge')?.remove(); }); k.classList.add('on');
    const parts = []; if (i > 0) { lu.kids[i - 1].classList.add('nb'); lu.kids[i - 1].append(h('i', { class: 'lu-badge l' }, 'ข้างซ้าย')); parts.push(`${names[i - 1]}อยู่ข้างซ้าย`); }
    if (i < names.length - 1) { lu.kids[i + 1].classList.add('nb'); lu.kids[i + 1].append(h('i', { class: 'lu-badge r' }, 'ข้างขวา')); parts.push(`${names[i + 1]}อยู่ข้างขวา`); }
    const mid = i === (names.length - 1) / 2 ? ` · ${names[i]}อยู่<b>ตรงกลาง</b>` : (i > 0 && i < names.length - 1 ? ` · ${names[i]}อยู่<b>ระหว่าง</b>${names[i - 1]}กับ${names[i + 1]}` : '');
    note.innerHTML = `ของ<b>${names[i]}</b>: ${parts.join(' · ')}${mid}`; sfx.pop(i); say(note.textContent, true); }; });
  return h('div', { class: 'colstack' }, h('div', { class: 'hands' }, h('span', null, '← มือซ้าย'), h('span', null, 'มือขวา →')), lu, note);
}
function gridTap(rows) {
  const g = kidGrid(rows), note = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'แตะเด็กคนไหนก็ได้');
  const kids = [...g.querySelectorAll('.lu-kid')];
  kids.forEach((k, idx) => { const r = Math.floor(idx / 3), c = idx % 3; k.classList.add('ia'); k.style.cursor = 'pointer'; k.onclick = e => { e.stopPropagation(); kids.forEach(x => { x.classList.remove('on', 'nb'); x.querySelector('.lu-badge')?.remove(); }); k.classList.add('on'); const parts = [];
    [[r + 1, c, 'ข้างหน้า'], [r - 1, c, 'ข้างหลัง'], [r, c - 1, 'ข้างซ้าย'], [r, c + 1, 'ข้างขวา']].forEach(([rr, cc, lab]) => { if (rr < 0 || rr > 2 || cc < 0 || cc > 2) return; const t = kids[rr * 3 + cc]; t.classList.add('nb'); t.append(h('i', { class: 'lu-badge' }, lab)); parts.push(`${lab}: ${rows[rr][cc]}`); });
    note.innerHTML = `<b>${rows[r][c]}</b> — ${parts.join(' · ')}`; sfx.pop(idx); say(`${rows[r][c]} ${parts.join(' ')}`, true); }; });
  return h('div', { class: 'colstack' }, g, note);
}
/* race: press start, the runners move, ordinal badges appear as they finish */
function raceSim(racers) {
  const tr = raceTrack(racers.map(r => ({ ...r, pos: 0 }))), out = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.2vw,24px)', minHeight: '1.6em' } });
  const order = [...racers].map((r, i) => ({ ...r, i })).sort((a, b) => b.pos - a.pos);
  const btn = h('button', { class: 'btn primary ia', onclick: async e => { e.stopPropagation(); btn.disabled = true; sfx.page();
    order.forEach((r, k) => { const run = tr.runners[r.i]; run.style.transition = `left ${1.4 + k * .5}s cubic-bezier(.4,.1,.3,1)`; requestAnimationFrame(() => run.style.setProperty('--x', 1)); });
    for (let k = 0; k < order.length; k++) { await sleep(k ? 500 : 1400); const run = tr.runners[order[k].i]; run.append(h('i', { class: 'rc-badge m' + (k + 1) }, ORD(k + 1))); sfx.pop(k); say(`${order[k].name} ${ORD(k + 1)}`, true); }
    out.textContent = order.map((r, k) => `${ORD(k + 1)} ${r.name}`).join(' · '); btn.remove(); } }, icon('play'), 'เริ่มแข่ง!');
  return h('div', { class: 'colstack' }, tr, btn, out);
}
function busSim(names) {
  const lu = lineup(names, { sm: true }), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } });
  const btn = h('button', { class: 'btn primary ia', onclick: async e => { e.stopPropagation(); btn.disabled = true;
    for (let k = 0; k < names.length; k++) { const kid = lu.kids[names.length - 1 - k]; kid.append(h('i', { class: 'lu-badge' }, `คนที่ ${k + 1}`)); kid.classList.add('board'); sfx.pop(k); say(`${names[names.length - 1 - k]} ขึ้นรถเป็นคนที่ ${WORD[k + 1]}`, true); await sleep(900); }
    out.textContent = 'คนที่อยู่ใกล้รถที่สุดได้ขึ้นก่อน'; btn.remove(); } }, icon('play'), 'ขึ้นรถ!');
  return h('div', { class: 'colstack' }, h('div', { class: 'busq' }, lu, h('span', { class: 'bus', html: BUS_SVG })), btn, out);
}
function shelfTap(rows) {
  const sw = shelf(rows), note = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.2vw,24px)', minHeight: '1.6em' } }, 'แตะผลไม้ช่องไหนก็ได้'), COL = ['ข้างซ้าย', 'ตรงกลาง', 'ข้างขวา'];
  sw.querySelectorAll('.sh-cell').forEach(c => { c.classList.add('ia'); c.style.cursor = 'pointer'; c.onclick = e => { e.stopPropagation(); sw.querySelectorAll('.sh-cell').forEach(x => x.classList.remove('on')); c.classList.add('on'); const r = +c.dataset.r, cc = +c.dataset.c;
    note.innerHTML = `<b>${FRUIT_TH[rows[r][cc]]}</b> อยู่ชั้นที่ ${r + 1} ${COL[cc]}`; sfx.pop(r * 3 + cc); say(note.textContent, true); }; });
  return h('div', { class: 'colstack' }, sw, note);
}
/* amounts → press to sort into ranks (FLIP) */
function rankSim(items, unit, pic) {
  const box = h('div', { class: 'rankvis' }); const cols = items.map(it => { const c = h('div', { class: 'rk-col' }, pic ? h('div', { class: 'rk-pile' }, ...range(1, it.n).map(() => art(pic))) : null, h('b', { class: 'rk-name' }, it.name), h('span', { class: 'rk-n num' }, `${it.n} ${unit}`)); box.append(c); return c; });
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const first = cols.map(c => c.getBoundingClientRect().left);
    const order = items.map((it, i) => i).sort((a, b) => items[b].n - items[a].n); order.forEach(i => box.append(cols[i]));
    cols.forEach((c, i) => { const dx = first[i] - c.getBoundingClientRect().left; c.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.3,1.2,.4,1)' }); });
    order.forEach((i, k) => cols[i].prepend(h('i', { class: 'rc-badge m' + (k + 1) }, ORD(k + 1)))); btn.remove(); sfx.win(); say('เรียงจากมากไปน้อย ' + order.map((i, k) => `${items[i].name} ${ORD(k + 1)}`).join(' '), true); } }, icon('right'), 'เรียงอันดับ');
  return h('div', { class: 'colstack' }, box, btn);
}
/* shooting target with team hits */
const TARGET_POS = { 10: [[0, 0]], 9: [[16, -14], [-14, 16], [14, 16]], 8: [[-30, -12], [32, -8], [-28, 18], [26, 22]], 7: [[-34, -34], [40, 30], [0, 46]], 6: [[48, -40], [-52, 10]] };
function targetSVG(teams) {
  const used = {}; let dots = '';
  teams.forEach(t => t.hits.forEach(v => { const k = used[v] = (used[v] || 0); const p = TARGET_POS[v][k % TARGET_POS[v].length]; used[v]++; dots += `<circle cx="${70 + p[0]}" cy="${70 + p[1]}" r="5" fill="${t.col}" stroke="#fff" stroke-width="1.6"/>`; }));
  const ring = (r, f, lab) => `<circle cx="70" cy="70" r="${r}" fill="${f}" stroke="#2B2550" stroke-width="1.6"/>` + (lab ? `<text x="70" y="${70 - r + 9}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="8" fill="${f === '#2B2550' ? '#fff' : '#2B2550'}">${lab}</text>` : '');
  return `<svg viewBox="0 0 140 140" class="target" aria-hidden="true">${ring(66, '#fff', 6)}${ring(54, '#fff', 7)}${ring(42, '#E8E4EF', 8)}${ring(30, '#E8E4EF', 9)}<circle cx="70" cy="70" r="14" fill="#2B2550"/><text x="70" y="74" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="11" fill="#fff">10</text>${dots}</svg>`;
}
function targetSim(teams) {
  const sums = h('div', { class: 'colstack', style: { gap: '6px' } });
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const tot = teams.map(t => t.hits.reduce((a, b) => a + b, 0)), ord = teams.map((t, i) => i).sort((a, b) => tot[b] - tot[a]);
    teams.forEach((t, i) => sums.append(h('div', { class: 'tg-row' }, h('i', { style: { background: t.col } }), h('b', null, t.name), eqRow([...t.hits.flatMap((v, k) => k ? ['+', v] : [v]), '=', tot[i]], { sm: true }), h('span', { class: 'rc-badge m' + (ord.indexOf(i) + 1) }, ORD(ord.indexOf(i) + 1)))));
    btn.remove(); sfx.win(); say('ทีมที่ได้คะแนนรวมมากที่สุดได้อันดับที่หนึ่ง', true); } }, icon('plus'), 'รวมคะแนนแต่ละทีม');
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, h('span', { class: 'targetw', html: targetSVG(teams) }), h('div', { class: 'colstack', style: { gap: '4px', alignItems: 'flex-start' } }, ...teams.map(t => h('div', { class: 'tg-row' }, h('i', { style: { background: t.col } }), h('b', null, t.name))))), btn, sums);
}
const LESSONS_CH8 = [
  { id: 251, title: 'การบอกตำแหน่งของสิ่งต่าง ๆ', short: 'บอกตำแหน่ง', tone: 'sky',
    goal: 'บอกตำแหน่งของสิ่งต่าง ๆ โดยใช้คำว่า ข้างซ้าย ข้างขวา ตรงกลาง ระหว่าง ข้างหน้า ข้างหลัง',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>ภาคเรียนที่ 2</b> และ <b>เมืองตำแหน่ง</b>! มาบอกว่าใครอยู่ตรงไหนกัน', s: 'ยินดีต้อนรับสู่ภาคเรียนที่สอง และเมืองตำแหน่ง มาบอกว่าใครอยู่ตรงไหนกัน', v: el => el.append(mascot('wow', 'big')) },
      { t: '<b>ข้างซ้าย</b> = ทางมือซ้ายของเรา · <b>ข้างขวา</b> = ทางมือขวาของเรา — <b>แตะเด็กแต่ละคน</b>ดูนะ', s: 'ข้างซ้ายคือทางมือซ้ายของเรา ข้างขวาคือทางมือขวาของเรา แตะเด็กแต่ละคนดูนะ', v: el => el.append(lineTap(WS8_LINE)) },
      { t: '<b>ข้างหน้า</b> = แถวที่อยู่ใกล้เรา · <b>ข้างหลัง</b> = แถวที่อยู่ไกลออกไป — แตะดูได้เลย', s: 'ข้างหน้าคือแถวที่อยู่ใกล้เรา ข้างหลังคือแถวที่อยู่ไกลออกไป แตะดูได้เลย', v: el => el.append(gridTap(WS8_GRID)) }
    ],
    game: () => { const N = reshuffle(WS8_LINE), G0 = reshuffle(WS8_GRID.flat()), G = [G0.slice(0, 3), G0.slice(3, 6), G0.slice(6)], bi = rnd(0, 2), gr = rnd(0, 1), gc = rnd(0, 1);
      return [Q.lineAsk({ names: N, ask: 'right', of: N[rnd(0, 3)] }), Q.lineAsk({ names: N, ask: 'left', of: N[rnd(1, 4)] }), Q.lineAsk({ names: N, ask: 'middle' }), Q.lineAsk({ names: N, ask: 'between', of: N[bi], of2: N[bi + 2] }), Q.gridAsk({ rows: G, ask: 'front', of: G[gr][rnd(0, 2)] }), Q.gridAsk({ rows: G, ask: pick(['right', 'back']), of: G[gr + 1][gc] }),
      Q.arrange({ clues: ['ไทยอยู่ลู่หมายเลข 4', 'เตยอยู่ลู่หมายเลข 2', 'นพอยู่ลู่ข้างซ้ายของเตย', 'แต้มอยู่ลู่ระหว่างเตยกับไทย'], answer: ['นพ', 'เตย', 'แต้ม', 'ไทย'], slotLabel: i => `ลู่ ${i + 1}` })]; } },
  { id: 252, title: 'การบอกอันดับที่ของสิ่งต่าง ๆ', short: 'บอกอันดับที่', tone: 'coral',
    goal: 'บอกอันดับที่ของสิ่งต่าง ๆ โดยใช้คำว่า อันดับที่ 1 อันดับที่ 2 อันดับที่ 3 …',
    teach: [
      { t: '<b>อันดับที่</b> บอกว่าใครมาก่อนมาหลัง ใครถึงเส้นชัยก่อนได้ <span class="hl">อันดับที่ 1</span> — กดเริ่มแข่ง!', s: 'อันดับที่ บอกว่าใครมาก่อนมาหลัง ใครถึงเส้นชัยก่อนได้อันดับที่หนึ่ง กดเริ่มแข่ง', v: el => el.append(raceSim(WS8_HORSE)) },
      { t: 'เข้าแถวขึ้นรถ: คนที่อยู่<b>ใกล้รถที่สุด</b>ได้ขึ้นเป็น<b>คนที่ 1</b>', s: 'เข้าแถวขึ้นรถ คนที่อยู่ใกล้รถที่สุดได้ขึ้นเป็นคนที่หนึ่ง', v: el => el.append(busSim(WS8_BUS)) },
      { t: 'จัดอันดับจาก<b>จำนวน</b>: ใครโยนลูกบอลลงตะกร้าได้มากที่สุดได้อันดับที่ 1', v: el => el.append(rankSim(WS8_BALL, 'ลูก', 'ball')) }
    ],
    game: () => { const HR = mixVals(WS8_HORSE, 'pos'), BS = reshuffle(WS8_BUS), BL = mixVals(WS8_BALL, 'n'); return [Q.raceAsk({ racers: HR, ask: 'who', k: 1 }), Q.raceAsk({ racers: HR, ask: 'rank', who: pick(HR).name }), Q.busAsk({ names: BS, k: 1 }), Q.busAsk({ names: BS, k: pick([2, 4, 5]) }), Q.rankAsk({ items: BL, unit: 'ลูก', ask: 'who', k: 1, pic: 'ball' }), Q.rankAsk({ items: BL, unit: 'ลูก', ask: 'rank', who: pick(BL).name, pic: 'ball' })]; } },
  { id: 253, title: 'การแสดงสิ่งต่าง ๆ ตามตำแหน่งและอันดับที่', short: 'ตำแหน่งและอันดับ', tone: 'mint',
    goal: 'บอกตำแหน่งของสิ่งต่าง ๆ บนชั้นวางของ (ชั้นที่ … ข้างซ้าย ตรงกลาง ข้างขวา) และบอกอันดับที่ในการแข่งขัน',
    teach: [
      { t: 'ชั้นวางของ: <b>ชั้นที่ 1 อยู่ล่างสุด</b> นับขึ้นไป แล้วบอกว่าอยู่ข้างซ้าย ตรงกลาง หรือข้างขวา — แตะดูนะ', s: 'ชั้นวางของ ชั้นที่หนึ่งอยู่ล่างสุด นับขึ้นไป แตะดูนะ', v: el => el.append(shelfTap(WS8_SHELF)) },
      { t: 'ปั่นจักรยานแข่ง: ดูว่าใครอยู่<b>ลู่ไหน</b> และใครถึงเส้นชัยเป็น<b>อันดับที่เท่าไร</b>', s: 'ปั่นจักรยานแข่ง ดูว่าใครอยู่ลู่ไหน และใครถึงเส้นชัยเป็นอันดับที่เท่าไร', v: el => el.append(raceSim(WS8_BIKE)) }
    ],
    game: () => { const F = reshuffle(WS8_SHELF.flat()), SH = [0, 1, 2, 3].map(r => F.slice(r * 3, r * 3 + 3)), BK = mixVals(WS8_BIKE, 'pos'); return [Q.shelfAsk({ rows: SH, names: FRUIT_TH, ask: 'where', r: 2, c: 0 }), Q.shelfAsk({ rows: SH, names: FRUIT_TH, ask: 'where', r: 1, c: 1 }), Q.shelfAsk({ rows: SH, names: FRUIT_TH, ask: 'what', r: 0, c: 1 }), Q.shelfAsk({ rows: SH, names: FRUIT_TH, ask: 'what', r: 3, c: 0 }),
      Q.raceAsk({ racers: BK, ask: 'rank', who: pick(BK).name }), Q.raceAsk({ racers: BK, ask: 'who', k: 1 }), Q.raceAsk({ racers: BK, ask: 'rank', who: pick(BK).name })]; } },
  { id: 254, title: 'การนำไปใช้', short: 'การนำไปใช้', tone: 'orange',
    goal: 'นำความรู้เรื่องตำแหน่งและอันดับที่ไปใช้ จัดอันดับผลการแข่งขันจากจำนวนหรือคะแนนรวม',
    teach: [
      { t: 'แข่งวางตุ๊กตา: ทีมที่วางได้<b>มากที่สุด</b>เป็นผู้ชนะ ได้<b>อันดับที่ 1</b>', s: 'แข่งวางตุ๊กตา ทีมที่วางได้มากที่สุดเป็นผู้ชนะ ได้อันดับที่หนึ่ง', v: el => el.append(rankSim(WS8_DOLL, 'ตัว', 'teddy')) },
      { t: 'ยิงเป้า: <b>รวมคะแนน</b>ของแต่ละทีมก่อน แล้วจัดอันดับจากคะแนนรวม', s: 'ยิงเป้า รวมคะแนนของแต่ละทีมก่อน แล้วจัดอันดับจากคะแนนรวม', v: el => el.append(targetSim(WS8_TARGET)) }
    ],
    game: () => { const T = mixVals(WS8_TARGET, 'hits'), tg = T.map(t => ({ name: t.name, n: t.hits.reduce((a, b) => a + b, 0) })), DL = mixVals(WS8_DOLL, 'n');
      return [Q.rankAsk({ items: DL, unit: 'ตัว', ask: 'who', k: 1, pic: 'teddy' }), Q.rankAsk({ items: DL, unit: 'ตัว', ask: 'who', k: 2, pic: 'teddy' }), Q.rankAsk({ items: DL, unit: 'ตัว', ask: 'rank', who: pick(DL).name, pic: 'teddy' }),
        Q.three({ nums: shuffle(T[0].hits) }), Q.rankAsk({ items: tg, unit: 'คะแนน', ask: 'who', k: 1 }), Q.rankAsk({ items: tg, unit: 'คะแนน', ask: 'rank', who: pick(tg).name })]; } }
];
const EXAM_CH8 = [
  { q: 'ใครยืนอยู่ข้างขวาของแตงโม', line: WS8_LINE, opts: ['ณัฐ', 'สิงห์', 'ส้ม'], a: 0 },
  { q: 'ใครยืนอยู่ตรงกลาง', line: WS8_LINE, opts: ['แตงโม', 'ออย', 'ณัฐ'], a: 0 },
  { q: 'ใครยืนอยู่ระหว่างออยกับแตงโม', line: WS8_LINE, opts: ['สิงห์', 'ณัฐ', 'ส้ม'], a: 0 },
  { q: 'ใครยืนอยู่ข้างซ้ายของณัฐ', line: WS8_LINE, opts: ['แตงโม', 'ส้ม', 'สิงห์'], a: 0 },
  { q: 'ใครยืนอยู่ข้างหน้าจอย', grid: WS8_GRID, opts: ['พอล', 'ฝน', 'โบ'], a: 0 },
  { q: 'ใครยืนอยู่ข้างหลังโบ', grid: WS8_GRID, opts: ['เต๋า', 'นุ่น', 'จอย'], a: 0 },
  { q: 'ใครเข้าเส้นชัยเป็นอันดับที่ 1', race: WS8_HORSE, opts: ['เสือ', 'เน', 'พี'], a: 0 },
  { q: 'ใครขึ้นรถรับนักเรียนเป็นคนที่ 1', bus: WS8_BUS, opts: ['มอส', 'แพม', 'ต่อ'], a: 0 },
  { q: 'หลินโยนได้ 10 ลูก นุ้ย 7 ลูก ก๊อต 12 ลูก ใครได้อันดับที่ 1', opts: ['ก๊อต', 'หลิน', 'นุ้ย'], a: 0 },
  { q: 'ทุเรียนวางอยู่ชั้นใด ตำแหน่งใด', shelf: WS8_SHELF, opts: ['ชั้นที่ 3 ข้างซ้าย', 'ชั้นที่ 2 ข้างซ้าย', 'ชั้นที่ 3 ข้างขวา'], a: 0 },
  { q: 'ชั้นที่ 1 ตรงกลางวางผลไม้ใด', shelf: WS8_SHELF, opts: ['มะม่วง', 'มังคุด', 'แอปเปิล'], a: 0 },
  { q: 'ไกค์ปั่นจักรยานมาเป็นอันดับที่เท่าไร', race: WS8_BIKE, opts: ['อันดับที่ 2', 'อันดับที่ 5', 'อันดับที่ 1'], a: 0 },
  { q: 'ทีมสีฟ้าวางตุ๊กตาได้ 5 ตัว ทีมสีเขียว 2 ตัว ทีมสีแดง 6 ตัว ทีมใดได้อันดับที่ 2', opts: ['ทีมสีฟ้า', 'ทีมสีแดง', 'ทีมสีเขียว'], a: 0 },
  { q: 'ทีมสีเขียวยิงได้ 7, 8 และ 10 คะแนน ได้คะแนนรวมเท่าไร', opts: ['25 คะแนน', '24 คะแนน', '15 คะแนน'], a: 0 },
  { q: 'เขียว 25 คะแนน น้ำเงิน 23 คะแนน แดง 24 คะแนน ทีมสีน้ำเงินได้อันดับที่เท่าไร', opts: ['อันดับที่ 3', 'อันดับที่ 1', 'อันดับที่ 2'], a: 0 }
];
LESSONS_CH8.push({ id: 259, boss: true, title: 'ด่านบอส: บทที่ 8 การบอกตำแหน่งและอันดับที่', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส', exam: spread(EXAM_CH8), pass: 8, bossName: 'ราชาปีศาจอันดับ', bossPal: 'sky', emblem: 'ที่ 1' });

/* =========================================================
   GRADE 1 · CHAPTER 9 — รูปเรขาคณิต (เมืองรูปทรง) · term 2
   ========================================================= */
const WS9_SOLIDS = [
  { v: 'sphere', x: 3, y: 5, s: 13 }, { v: 'cyl', x: 20, y: 3, s: 13 }, { v: 'box', x: 37, y: 6, s: 15 }, { v: 'cyl', x: 57, y: 3, s: 13 }, { v: 'cone', x: 76, y: 4, s: 13 },
  { v: 'sphere', x: 4, y: 37, s: 12 }, { v: 'disk', x: 19, y: 39, s: 15 }, { v: 'slab', x: 38, y: 35, s: 18 }, { v: 'cube', x: 61, y: 37, s: 14 }, { v: 'coneDown', x: 80, y: 35, s: 13 },
  { v: 'cylLie', x: 7, y: 67, s: 16 }, { v: 'tower', x: 33, y: 63, s: 13 }, { v: 'sphere', x: 57, y: 68, s: 14 }];
const WS9_ROOM = [
  { v: 'partyhat', k: 'cone', x: 3, y: 4, s: 12 }, { v: 'globe', k: 'ball', x: 19, y: 4, s: 13 }, { v: 'candle', k: 'cyl', x: 36, y: 3, s: 10 }, { v: 'mug', k: 'cyl', x: 49, y: 8, s: 12 }, { v: 'carton', k: 'box', x: 65, y: 3, s: 12 }, { v: 'trafficcone', k: 'cone', x: 81, y: 4, s: 12 },
  { v: 'giftbox', k: 'box', x: 4, y: 52, s: 14 }, { v: 'ball', k: 'ball', x: 22, y: 56, s: 12 }, { v: 'basketball', k: 'ball', x: 37, y: 56, s: 12 }, { v: 'dice', k: 'box', x: 52, y: 55, s: 12 }, { v: 'drum', k: 'cyl', x: 67, y: 54, s: 14 }, { v: 'icecream', k: 'cone', x: 84, y: 52, s: 11 }];
const WS9_OBJ = [['pot', 'cyl', 'หม้อ'], ['ball', 'ball', 'ลูกบอล'], ['globe', 'ball', 'ลูกโลก'], ['icecream', 'cone', 'ไอศกรีมโคน'], ['carton', 'box', 'กล่องนม'], ['drum', 'cyl', 'กลอง'], ['giftbox', 'box', 'กล่องของขวัญ'], ['partyhat', 'cone', 'หมวกวันเกิด'], ['can', 'cyl', 'กระป๋อง'], ['basketball', 'ball', 'ลูกบาสเกตบอล'], ['trafficcone', 'cone', 'กรวยจราจร'], ['dice', 'box', 'ลูกเต๋า'], ['candle', 'cyl', 'เทียน'], ['mug', 'cyl', 'แก้วมัค'], ['orange', 'ball', 'ส้ม']];
const WS9_SHAPES = [
  { v: 'rect', x: 3, y: 5, s: 13 }, { v: 'tallrect', x: 20, y: 2, s: 9, rot: 40 }, { v: 'square', x: 34, y: 4, s: 11, rot: 20 }, { v: 'tri', x: 50, y: 2, s: 12, rot: 10 }, { v: 'circle', x: 68, y: 4, s: 11 }, { v: 'ellipse', x: 85, y: 3, s: 9 },
  { v: 'ellipse', x: 4, y: 38, s: 8 }, { v: 'tri', x: 15, y: 36, s: 12, rot: -20 }, { v: 'square', x: 31, y: 38, s: 9, rot: 45 }, { v: 'stri', x: 45, y: 36, s: 11 }, { v: 'rect', x: 60, y: 38, s: 13, rot: -35 }, { v: 'wellipse', x: 79, y: 40, s: 13 },
  { v: 'tri', x: 2, y: 68, s: 13, rot: 25 }, { v: 'circle', x: 20, y: 69, s: 10 }, { v: 'rtri', x: 35, y: 68, s: 11 }, { v: 'ellipse', x: 52, y: 70, s: 7, rot: 30 }, { v: 'tri', x: 66, y: 68, s: 13, rot: 180 }];
const rep = (u, k) => range(1, k).flatMap(() => u);
const WS9_UNIT = [rep(['orange', 'orange.s'], 4), rep(['tri.sky', 'tri.pink'], 4), rep(['mangoG', 'plum', 'chompoo'], 3), rep(['basketball', 'mushroom'], 4), rep(['apple', 'chompoo', 'chompoo'], 3), rep(['sq.lilac', 'sq.lilac', 'sq.lilac.s'], 3)];
const WS9_MISS = [[rep(['sq.pink', 'ci.lilac'], 4), 5], [rep(['tri.sky', 'tri.sky.s'], 4), 7], [rep(['el.mint', 'el.pink', 'el.orange'], 4), 8], [rep(['ci.yellow.s', 'ci.yellow', 'ci.yellow'], 3), 8], [rep(['tri.lilac', 'sq.mint', 'sq.mint'], 3), 6], [rep(['sq.pink', 'sq.orange'], 4), 7],
  [rep(['s_tower', 's_cyl'], 4), 1], [rep(['candle', 'leafG'], 5), 8], [rep(['pencil', 'cardbook', 'cardbook'], 3), 2], [rep(['clock', 'clock.s'], 3), 2], [rep(['ball.s', 'ball', 'ball.s'], 3), 6], [rep(['popsicleB', 'popsicleP'], 4), 0],
  [rep(['tomato', 'mangosteen'], 4), 2], [rep(['corn', 'corn.s', 'corn'], 3), 8], [rep(['mangoG', 'mangoY'], 4), 2], [rep(['durian', 'chompoo', 'durian'], 3), 6], [rep(['orange', 'orange', 'plum'], 3), 5], [rep(['pineapple', 'pineapple.s'], 4), 3]];
const STAMP = { box: ['rect', 'รูปสี่เหลี่ยม'], cube: ['square', 'รูปสี่เหลี่ยม'], cyl: ['circle', 'วงกลม'], cone: ['circle', 'วงกลม'] };
/* roll test on a ramp — which solids roll?  Side view: a ball rolls with its highlight fixed (light comes from
   above) while its stripe turns; a cylinder lying across the ramp shows its round end and its spokes turn.
   No contact shadow is drawn on the moving shapes (a shadow that turns with the shape looks wrong). */
function rollerSVG(v) {
  if (v === 'sphere') return `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="url(#g-mint)" stroke="${PAL.mint[3]}" stroke-width="1.6"/><g class="spin"><path d="M3 34 Q32 46 61 34" fill="none" stroke="${PAL.mint[3]}" stroke-width="2" opacity=".5"/><path d="M30 3 Q20 32 30 61" fill="none" stroke="${PAL.mint[3]}" stroke-width="1.6" opacity=".35"/><circle cx="44" cy="22" r="3" fill="#fff" opacity=".6"/></g><ellipse cx="22" cy="20" rx="9" ry="5" transform="rotate(-30 22 20)" fill="#fff" opacity=".55"/></svg>`;
  if (v === 'cylEnd') { const c = PAL.coral; return `<svg viewBox="-10 0 74 64" aria-hidden="true"><path d="M32 2 H48 A30 30 0 0 1 48 62 H32 Z" fill="url(#l-coral)" stroke="${c[3]}" stroke-width="1.6"/><circle cx="32" cy="32" r="30" fill="${c[0]}" stroke="${c[3]}" stroke-width="1.6"/><g class="spin">${[0, 60, 120].map(a => `<path d="M32 32 L${32 + 24 * Math.cos(a * Math.PI / 180)} ${32 + 24 * Math.sin(a * Math.PI / 180)} M32 32 L${32 - 24 * Math.cos(a * Math.PI / 180)} ${32 - 24 * Math.sin(a * Math.PI / 180)}" stroke="${c[2]}" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>`).join('')}<circle cx="32" cy="32" r="5" fill="${c[2]}"/></g><circle cx="32" cy="32" r="30" fill="none" stroke="${c[3]}" stroke-width="1.6"/></svg>`; }
  return `<svg viewBox="0 0 64 64" aria-hidden="true">${solidSVG(v === 'box' ? 'box' : 'cone', v === 'box' ? 'yellow' : 'sky').replace(/<ellipse[^>]*opacity="\.1[26]"\/>/, '')}</svg>`;
}
function rollRamp() {
  const box = h('div', { class: 'ramp' }, h('span', { class: 'ramp-bg', html: '<svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 34 L200 86 V100 H0 Z" fill="#F3E7CF"/><path d="M0 34 L200 86" stroke="#D9C39A" stroke-width="2.4"/></svg>' }));
  const out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '2.6em' } }, 'แตะรูปทรงด้านล่าง วางบนทางลาด แล้วดูว่าเกิดอะไรขึ้น');
  const R = { sphere: ['roll', 'ทรงกลม <b>กลิ้งได้</b>ทุกทิศทาง เพราะผิวโค้งรอบตัว'], cylLie: ['roll', 'ทรงกระบอกวางนอน <b>กลิ้งได้</b> · ถ้าตั้งขึ้นจะซ้อนกันได้ เพราะหน้าบนล่างเรียบ'], box: ['stay', 'ทรงสี่เหลี่ยมมุมฉาก <b>กลิ้งไม่ได้</b> มีหน้าเรียบทุกด้าน ตั้งซ้อนกันได้'], cone: ['wob', 'กรวยวางนอนกลิ้ง<b>วนเป็นวงกลม</b> เพราะมีปลายแหลมข้างเดียว'] };
  let cur = null, anims = [];
  const pick = v => { if (cur) cur.remove(); anims.forEach(a => a.cancel()); anims = [];
    const el = h('span', { class: 'roller', html: rollerSVG(v === 'cylLie' ? 'cylEnd' : v) }); box.append(el); cur = el; sfx.page();
    const W = box.clientWidth, H = box.clientHeight, s = el.offsetWidth, ang = Math.atan2(H * .52, W), deg = ang * 180 / Math.PI, r = s / 2;
    const lineY = x => H * .34 + H * .52 * x / W, pos = x => ({ x: x - r, y: lineY(x) - r / Math.cos(ang) - r }); // centre sits r above the slope
    const x0 = W * .04 + r, x1 = W - r - W * .02, p0 = pos(x0), p1 = pos(x1), dist = (x1 - x0) / Math.cos(ang);
    const [kind, msg] = R[v];
    if (kind === 'roll') {
      el.style.transform = `translate(${p0.x}px,${p0.y}px)`;
      const T = 2200, ease = 'cubic-bezier(.5,0,.75,1)'; // speeds up as it rolls down
      anims.push(el.animate([{ transform: `translate(${p0.x}px,${p0.y}px)` }, { transform: `translate(${p1.x}px,${p1.y}px)` }], { duration: T, easing: ease, fill: 'forwards' }));
      const spin = el.querySelector('.spin'); spin.style.transformOrigin = '32px 32px'; spin.style.transformBox = 'view-box';
      anims.push(spin.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${dist / (2 * Math.PI * r) * 360}deg)` }], { duration: T, easing: ease, fill: 'forwards' }));
    } else if (kind === 'stay') {
      const p = pos(W * .3); el.style.transform = `translate(${p.x}px,${p.y + r * .12}px) rotate(${deg}deg)`; el.style.transformOrigin = '50% 85%';
      anims.push(el.animate([{ transform: `translate(${p.x}px,${p.y - 30}px) rotate(${deg}deg)` }, { transform: `translate(${p.x}px,${p.y + r * .12}px) rotate(${deg}deg)` }, { transform: `translate(${p.x + 3}px,${p.y + r * .12}px) rotate(${deg}deg)` }, { transform: `translate(${p.x}px,${p.y + r * .12}px) rotate(${deg}deg)` }], { duration: 900, easing: 'ease-out', fill: 'forwards' }));
    } else { const p = pos(W * .42); el.style.transformOrigin = '50% 50%';
      anims.push(el.animate([{ transform: `translate(${p.x}px,${p.y}px) rotate(${deg - 80}deg)` }, { transform: `translate(${p.x + 26}px,${p.y + 6}px) rotate(${deg - 120}deg)` }, { transform: `translate(${p.x - 14}px,${p.y - 4}px) rotate(${deg - 40}deg)` }, { transform: `translate(${p.x}px,${p.y}px) rotate(${deg - 80}deg)` }], { duration: 1800, easing: 'ease-in-out', iterations: 2, fill: 'forwards' })); }
    setTimeout(() => { out.innerHTML = msg; say(out.textContent, true); }, 300);
  };
  const btns = h('div', { class: 'solidbar ia' }, ...['box', 'sphere', 'cylLie', 'cone'].map(v => { const b = h('button', { class: 'solidbtn' }, solidEl(v), h('b', null, SOLID_NAME[SOLID_KIND(v)])); b.onclick = e => { e.stopPropagation(); pick(v); }; return b; }));
  return h('div', { class: 'colstack' }, box, btns, out);
}
/* tap any solid: every solid of the same kind lights up and is counted */
function kindTap(items) {
  const sc = scatterScene(items, {}), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, ' '); sc.classList.add('ia', 'tapscene');
  sc.querySelectorAll('.sc-it').forEach(el => el.onclick = e => { e.stopPropagation(); const k = SOLID_KIND(items[+el.dataset.i].v); let n = 0;
    sc.querySelectorAll('.sc-it').forEach(x => { const on = SOLID_KIND(items[+x.dataset.i].v) === k; x.classList.toggle('mark', on); x.classList.toggle('dim', !on); if (on) x.dataset.c = ++n; });
    out.innerHTML = `<b>${SOLID_NAME[k]}</b> มี ${n} รูป`; sfx.pop(n); say(`${SOLID_NAME[k]} มี ${WORD[n]} รูป`, true); });
  return h('div', { class: 'colstack' }, sc, out);
}
/* tap an object → its solid appears beside it */
function objToSolid(list) {
  const out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'แตะสิ่งของ ดูว่าคล้ายรูปเรขาคณิตใด');
  const g = h('div', { class: 'objgrid ia' }, ...list.map(([o, k, n]) => { const sv = { box: 'box', ball: 'sphere', cyl: 'cyl', cone: 'cone' }[k];
    const c = h('button', { class: 'objcard' }, h('span', { class: 'oc-o', html: artHTML(o) }), h('span', { class: 'oc-s' }, solidEl(sv)), h('b', null, n), h('small', null, SOLID_NAME[k]));
    c.onclick = e => { e.stopPropagation(); c.classList.toggle('on'); if (c.classList.contains('on')) { sfx.pop(2); out.innerHTML = `<b>${n}</b> มีลักษณะคล้าย<b>${SOLID_NAME[k]}</b>`; say(out.textContent, true); } }; return c; }));
  return h('div', { class: 'colstack' }, g, out);
}
/* press a solid onto paper — its flat face leaves a 2D shape */
function stampSim() {
  const paper = h('div', { class: 'paper' }), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'แตะรูปทรง กดลงบนกระดาษ แล้วยกขึ้นดูรอยที่เกิด');
  let k = 0;
  const bar = h('div', { class: 'solidbar ia' }, ...[['box', 'box'], ['cube', 'cube'], ['cyl', 'cyl'], ['cone', 'coneDown']].map(([key, v]) => { const b = h('button', { class: 'solidbtn' }, solidEl(v), h('b', null, SOLID_NAME[SOLID_KIND(v)])); b.onclick = async e => { e.stopPropagation(); if (paper.querySelectorAll('.stamp').length >= 6) paper.querySelector('.stamp').remove();
    const [sv, nm] = STAMP[key], st = shapeEl(sv, { cls: 'stamp' }), x = 6 + (k % 4) * 23; k++; st.style.left = x + '%';
    const ghost = solidEl(key === 'cone' ? 'cone' : v, 'press'); ghost.style.left = x + '%'; paper.append(ghost); sfx.tap();
    await ghost.animate([{ transform: 'translateY(-60%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.3,1.3,.5,1)' }).finished;
    paper.append(st); st.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 300 });
    await ghost.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-70%)', opacity: 0 }], { duration: 420, delay: 250, fill: 'forwards' }).finished; ghost.remove();
    sfx.pop(k); out.innerHTML = `หน้าเรียบของ${SOLID_NAME[SOLID_KIND(v)]}ทำให้เกิด<b>${nm}</b>`; say(out.textContent, true); }; return b; }));
  return h('div', { class: 'colstack' }, bar, paper, out);
}
function shapeGallery() {
  const out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'แตะแต่ละรูปเพื่อฟังชื่อ');
  const info = { tri: 'มี 3 ด้าน 3 มุม', quad: 'มี 4 ด้าน 4 มุม', circle: 'กลมทุกด้าน ไม่มีด้านและมุม', ellipse: 'กลมรี ไม่มีด้านและมุม' };
  const g = h('div', { class: 'solidbar ia' }, ...[['tri', 'tri'], ['quad', 'rect'], ['quad', 'square'], ['circle', 'circle'], ['ellipse', 'ellipse']].map(([k, v]) => { const b = h('button', { class: 'solidbtn' }, shapeEl(v, { face: true }), h('b', null, SHAPE_NAME[k]));
    b.onclick = e => { e.stopPropagation(); b.firstChild.animate([{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(1.15) rotate(-8deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 450, easing: 'cubic-bezier(.3,1.4,.5,1)' }); sfx.pop(2); out.innerHTML = `<b>${SHAPE_NAME[k]}</b> ${info[k]}`; say(out.textContent, true); }; return b; }));
  return h('div', { class: 'colstack' }, g, out);
}
function traceDemo(v, obj) {
  const tb = traceBoard(v, { obj, sc: obj ? TRACE_OBJ[obj].sc : 1 }), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, obj ? `วาง${TRACE_OBJ[obj].name}บนกระดาษ แล้วลากเส้นรอบขอบ` : 'ลากดินสอไปตามขอบของแบบรูป');
  const btn = h('button', { class: 'btn info ia', onclick: async e => { e.stopPropagation(); btn.disabled = true; tb.classList.remove('lifted'); await tb.demo(); if (obj) { await sleep(350); tb.lift(); } sfx.ok(); out.innerHTML = `ได้<b>${SHAPE_NAME[SHAPE_KIND(v)]}</b>`; say(out.textContent, true); btn.disabled = false; } }, icon('play'), 'ดูวิธีวาด');
  return h('div', { class: 'colstack' }, tb, h('div', { class: 'rowstack' }, btn, h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); tb.pad.clear(); tb.classList.remove('lifted'); tb.pad.redraw(); } }, icon('eraser'), 'ลองวาดเอง')), out);
}
/* free picture made of shapes practice: add, drag, turn, remove */
function shapeCanvas() {
  const board = h('div', { class: 'scanvas ia' }); let sel = null, z = 1;
  const add = (v, p) => { const el = shapeEl(v, { p, cls: 'piece' }); el.dataset.rot = 0; el.style.left = 35 + Math.random() * 20 + '%'; el.style.top = 25 + Math.random() * 30 + '%'; board.append(el); select(el); sfx.pop(board.children.length);
    el.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); select(el); el.style.zIndex = ++z; const r = board.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, l0 = el.offsetLeft, t0 = el.offsetTop; el.setPointerCapture(e.pointerId);
      const mv = ev => { el.style.left = Math.max(-20, Math.min(r.width - 20, l0 + ev.clientX - sx)) + 'px'; el.style.top = Math.max(-20, Math.min(r.height - 20, t0 + ev.clientY - sy)) + 'px'; };
      const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); }; el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); }); };
  const select = el => { board.querySelectorAll('.piece').forEach(p => p.classList.remove('sel')); sel = el; el && el.classList.add('sel'); };
  board.addEventListener('pointerdown', e => { if (e.target === board) select(null); });
  const pal = h('div', { class: 'palette ia' }, ...[['tri', 'yellow'], ['rtri', 'mint'], ['rect', 'pink'], ['square', 'sky'], ['circle', 'coral'], ['ellipse', 'orange'], ['wellipse', 'lilac']].map(([v, p]) => { const b = h('button', { class: 'palb' }, shapeEl(v, { p })); b.onclick = e => { e.stopPropagation(); add(v, p); }; return b; }));
  const tools = h('div', { class: 'rowstack' }, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (!sel) return; const r = (+sel.dataset.rot + 45) % 360; sel.dataset.rot = r; sel.style.transform = `rotate(${r}deg)`; sfx.tap(); } }, icon('replay'), 'หมุน'),
    h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (!sel) return; sel.remove(); sel = null; sfx.tap(); } }, icon('trash'), 'ลบ'));
  return h('div', { class: 'colstack' }, pal, board, tools);
}
/* robot practice: tap a shape name to light up all those parts */
function robotSim() {
  const r = h('div', { class: 'robotw', html: robotSVG([]) }), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'แตะชื่อรูป ดูว่าหุ่นยนต์มีรูปนั้นกี่รูป');
  const bar = h('div', { class: 'rowstack ia' }, ...FK.map(k => { const b = h('button', { class: 'btn sm' }, shapeEl(FK_V[k], { cls: 'mini' }), SHAPE_NAME[k]); b.onclick = async e => { e.stopPropagation(); r.innerHTML = robotSVG([]); const parts = [...r.querySelectorAll(`.rp[data-k="${k}"]`)], c = PAL[ROBOT_FILL[k]];
    for (let i = 0; i < parts.length; i++) { parts[i].setAttribute('fill', c[1]); parts[i].setAttribute('stroke', c[3]); sfx.pop(i + 1); await sleep(220); }
    out.innerHTML = `หุ่นยนต์มี<b>${SHAPE_NAME[k]} ${parts.length} รูป</b>`; say(out.textContent, true); }; return b; }));
  return h('div', { class: 'rowstack' }, r, h('div', { class: 'colstack' }, bar, out));
}
/* repeating pattern: bracket each repeat, then continue the pattern */
function patternSim(seq) {
  const u = patUnit(seq), L = u.length, st = patStrip(seq), toks = [...st.children], out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } });
  const b1 = h('button', { class: 'btn info ia', onclick: async e => { e.stopPropagation(); b1.disabled = true; toks.forEach(t => t.classList.remove('u0', 'u1'));
    for (let i = 0; i < toks.length; i++) { toks[i].classList.add('u' + (Math.floor(i / L) % 2)); if (i % L === L - 1) { sfx.pop(i / L); await sleep(380); } }
    out.innerHTML = `ชุดที่ซ้ำมี <b>${L} รูป</b> เกิดซ้ำไปเรื่อย ๆ`; say(out.textContent, true); b2.style.display = ''; } }, icon('sparkle'), 'หาชุดที่ซ้ำ');
  const b2 = h('button', { class: 'btn primary ia', style: { display: 'none' }, onclick: async e => { e.stopPropagation(); b2.disabled = true; const n0 = st.children.length;
    for (let k = 0; k < L; k++) { const t = tokEl(u[(n0 + k) % L]); t.className += ' u' + (Math.floor((n0 + k) / L) % 2) + ' fill'; st.append(t); sfx.pop(k + 3); await sleep(300); }
    out.innerHTML = 'ต่อแบบรูปได้อีก 1 ชุด!'; say('ต่อแบบรูปได้อีกหนึ่งชุด', true); } }, icon('plus'), 'ต่อแบบรูป');
  return h('div', { class: 'colstack' }, st, h('div', { class: 'rowstack' }, b1, b2), out);
}
/* missing item: reveal by reading the unit */
function missingSim(seq, blank) {
  const st = patStrip(seq, { blank: [blank] }), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'รูปไหนหายไป? ลองเดาก่อน แล้วกดดูคำตอบ');
  const L = patUnit(seq).length;
  const btn = h('button', { class: 'btn info ia', onclick: async e => { e.stopPropagation(); btn.remove(); const ts = [...st.children];
    for (let i = 0; i < ts.length; i++) { ts[i].classList.add('u' + (Math.floor(i / L) % 2)); if (i % L === L - 1) await sleep(300); }
    const b = st.querySelector('.blank'); const t = tokEl(seq[blank]); t.className += ' fill u' + (Math.floor(blank / L) % 2); b.replaceWith(t); sfx.ok(); out.innerHTML = `ชุดที่ซ้ำมี ${L} รูป ช่องว่างจึงเป็นรูปนี้`; say(out.textContent, true); } }, icon('eye'), 'ดูคำตอบ');
  return h('div', { class: 'colstack' }, st, btn, out);
}
const LESSONS_CH9 = [
  { id: 261, title: 'ทรงสี่เหลี่ยมมุมฉาก ทรงกลม ทรงกระบอก และกรวย', short: 'รูปเรขาคณิตสามมิติ', tone: 'yellow',
    goal: 'จำแนกและบอกชื่อทรงสี่เหลี่ยมมุมฉาก ทรงกลม ทรงกระบอก และกรวย',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองรูปทรง</b>! ที่นี่ทุกอย่างสร้างจากรูปเรขาคณิต', s: 'ยินดีต้อนรับสู่เมืองรูปทรง ที่นี่ทุกอย่างสร้างจากรูปเรขาคณิต', v: el => el.append(h('div', { class: 'solidbar' }, ...['box', 'sphere', 'cyl', 'cone'].map(v => h('span', { class: 'solidbtn static' }, solidEl(v), h('b', null, SOLID_NAME[SOLID_KIND(v)]))))) },
      { t: 'ทดลอง: <b>แตะรูปทรง</b>วางบนทางลาด รูปไหนกลิ้งได้ รูปไหนกลิ้งไม่ได้?', s: 'ทดลอง แตะรูปทรงวางบนทางลาด รูปไหนกลิ้งได้ รูปไหนกลิ้งไม่ได้', v: el => el.append(rollRamp()) },
      { t: 'รูปทรงเดียวกันอาจ<b>ใหญ่ เล็ก สูง เตี้ย หรือวางคนละแบบ</b> แต่ยังชื่อเดิม — <b>แตะรูปทรง</b>ดูว่ามีแบบเดียวกันกี่รูป', s: 'รูปทรงเดียวกันอาจใหญ่ เล็ก สูง เตี้ย หรือวางคนละแบบ แต่ยังชื่อเดิม แตะรูปทรงดูว่ามีแบบเดียวกันกี่รูป', v: el => el.append(kindTap(WS9_SOLIDS)) }
    ],
    game: () => [Q.solidName({ v: 'cone' }), Q.solidName({ v: 'sphere' }), Q.solidName({ v: 'cyl' }), Q.solidName({ v: 'tower' }), Q.tapKind({ items: mixScene(WS9_SOLIDS), kind: 'ball' }), Q.countKind({ items: mixScene(WS9_SOLIDS), kind: 'box' }), Q.countKind({ items: mixScene(WS9_SOLIDS), kind: pick(['cyl', 'cone']) })] },
  { id: 262, title: 'สิ่งรอบตัวกับทรงสี่เหลี่ยมมุมฉาก ทรงกลม ทรงกระบอก และกรวย', short: 'สิ่งรอบตัวกับรูปทรง', tone: 'coral',
    goal: 'บอกได้ว่าสิ่งของรอบตัวมีลักษณะคล้ายทรงสี่เหลี่ยมมุมฉาก ทรงกลม ทรงกระบอก หรือกรวย',
    teach: [
      { t: 'ของรอบตัวเรามีรูปร่าง<b>คล้าย</b>รูปเรขาคณิต — <b>แตะสิ่งของ</b>ดูนะ', s: 'ของรอบตัวเรามีรูปร่างคล้ายรูปเรขาคณิต แตะสิ่งของดูนะ', v: el => el.append(objToSolid(WS9_OBJ.slice(0, 6))) },
      { t: 'ในห้องจัดงานวันเกิดนี้ มีของที่คล้ายรูปเรขาคณิตอะไรบ้าง? <b>แตะทำเครื่องหมาย</b>ขณะนับ', s: 'ในห้องจัดงานวันเกิดนี้ มีของที่คล้ายรูปเรขาคณิตอะไรบ้าง แตะทำเครื่องหมายขณะนับ', v: el => { const sc = scatterScene(WS9_ROOM, { kind: 'art', cls: 'room' }); makeTapMark(sc); el.append(sc); } }
    ],
    game: () => [...shuffle(WS9_OBJ.slice(6)).slice(0, 3).map(([o, k, n]) => Q.objSolid({ obj: o, kind: k, name: n })), ...shuffle(WS9_OBJ.slice(0, 6)).slice(0, 2).map(([o, k, n]) => Q.objSolid({ obj: o, kind: k, name: n })), Q.countKind({ items: mixScene(WS9_ROOM), kind: 'box', art: true }), Q.countKind({ items: mixScene(WS9_ROOM), kind: 'cyl', art: true })] },
  { id: 263, title: 'รูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม และวงรี', short: 'รูปเรขาคณิตสองมิติ', tone: 'mint',
    goal: 'จำแนกและบอกชื่อรูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม และวงรี',
    teach: [
      { t: 'กด<b>หน้าเรียบ</b>ของรูปทรงลงบนกระดาษ จะได้รูปแบน ๆ — <b>แตะรูปทรง</b>ทดลองเลย', s: 'กดหน้าเรียบของรูปทรงลงบนกระดาษ จะได้รูปแบน ๆ แตะรูปทรงทดลองเลย', v: el => el.append(stampSim()) },
      { t: 'รูปแบนมี 4 ชนิด: <b>รูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม วงรี</b> — แตะแต่ละรูป', s: 'รูปแบนมีสี่ชนิด รูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม วงรี แตะแต่ละรูป', v: el => el.append(shapeGallery()) },
      { t: 'หมุนหรือเปลี่ยนขนาด ก็ยังเป็นรูปเดิม เช่น รูปเหล่านี้เป็น<b>รูปสามเหลี่ยม</b>ทั้งหมด', s: 'หมุนหรือเปลี่ยนขนาด ก็ยังเป็นรูปเดิม', v: el => el.append(h('div', { class: 'solidbar' }, ...[['tri', 0], ['rtri', 0], ['stri', 0], ['tri', 180], ['tri', 30]].map(([v, r]) => shapeEl(v, { rot: r })))) }
    ],
    game: () => [Q.shapeName({ v: 'tri', rot: rnd(0, 3) * 30 }), Q.shapeName({ v: pick(['rect', 'square', 'tallrect']), rot: pick([0, 20, 45]) }), Q.shapeName({ v: pick(['ellipse', 'wellipse']) }), Q.shapeName({ v: 'circle' }), Q.tapKind({ items: mixScene(WS9_SHAPES), kind: 'tri', mode: 'shape' }), Q.countKind({ items: mixScene(WS9_SHAPES), kind: 'quad', mode: 'shape' }), Q.countKind({ items: mixScene(WS9_SHAPES), kind: pick(['ellipse', 'circle']), mode: 'shape' })] },
  { id: 264, title: 'ลักษณะของรูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม และวงรี', short: 'ลักษณะของรูป', tone: 'sky',
    goal: 'บอกลักษณะของรูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม และวงรี จากจำนวนด้านและมุม',
    teach: [
      { t: '<b>ด้าน</b> คือเส้นตรงรอบรูป · <b>มุม</b> คือจุดที่ด้านสองด้านมาชนกัน — <b>แตะด้านและมุม</b>ของรูปสามเหลี่ยมเพื่อนับ', s: 'ด้าน คือเส้นตรงรอบรูป มุม คือจุดที่ด้านสองด้านมาชนกัน แตะด้านและมุมของรูปสามเหลี่ยมเพื่อนับ', v: el => el.append(sideCounter('tri')) },
      { t: 'ลองนับ<b>รูปสี่เหลี่ยม</b>บ้าง มีกี่ด้าน กี่มุม?', s: 'ลองนับรูปสี่เหลี่ยมบ้าง มีกี่ด้าน กี่มุม', v: el => el.append(sideCounter('rect')) },
      { t: '<b>วงกลม</b>กับ<b>วงรี</b> มีขอบโค้ง <b>ไม่มีด้าน ไม่มีมุม</b> · วงกลมกลมเท่ากันทุกทาง วงรียืดยาวออก', s: 'วงกลมกับวงรี มีขอบโค้ง ไม่มีด้าน ไม่มีมุม', v: el => el.append(h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, shapeEl('circle', { face: true, cls: 'big' }), h('b', null, 'วงกลม')), h('div', { class: 'colstack' }, shapeEl('ellipse', { face: true, cls: 'big' }), h('b', null, 'วงรี')))) },
      { t: 'หุ่นยนต์ตัวนี้ประกอบด้วยรูปอะไรบ้าง? <b>แตะชื่อรูป</b>เพื่อนับ', s: 'หุ่นยนต์ตัวนี้ประกอบด้วยรูปอะไรบ้าง แตะชื่อรูปเพื่อนับ', v: el => el.append(robotSim()) }
    ],
    game: () => [Q.sidesCorners({ v: 'tri', ask: 'sides' }), Q.sidesCorners({ v: pick(['rect', 'square']), ask: 'corners' }), Q.sidesCorners({ v: pick(['circle', 'ellipse']), ask: pick(['sides', 'corners']) }),
      Q.shapeClue({ clue: 'รูปใดมี 3 ด้าน และ 3 มุม?', kind: 'tri' }), Q.shapeClue({ clue: 'รูปใดมี 4 ด้าน และ 4 มุม?', kind: 'quad' }), Q.shapeClue({ clue: 'รูปใดไม่มีด้านและมุม และมีลักษณะยาวรี?', kind: 'ellipse' }), Q.robotCount({ kind: 'tri' })] },
  { id: 265, title: 'การเขียนรูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม และวงรีโดยใช้แบบของรูป', short: 'เขียนรูปจากแบบ', tone: 'lilac',
    goal: 'เขียนรูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม และวงรี โดยลากเส้นตามแบบของรูป',
    teach: [
      { t: 'ใช้<b>แบบของรูป</b>: ลากดินสอไปตามขอบให้รอบรูป ไม่ยกดินสอ — กด<b>ดูวิธีวาด</b>', s: 'ใช้แบบของรูป ลากดินสอไปตามขอบให้รอบรูป กดดูวิธีวาด', v: el => el.append(traceDemo('tri')) },
      { t: 'วงกลมก็ทำแบบเดียวกัน ค่อย ๆ ลากเส้นโค้งไปจนบรรจบจุดเริ่มต้น', s: 'วงกลมก็ทำแบบเดียวกัน ค่อย ๆ ลากเส้นโค้งไปจนบรรจบจุดเริ่มต้น', v: el => el.append(traceDemo('circle')) }
    ],
    game: () => [Q.traceShape({ v: 'tri' }), Q.traceShape({ v: 'rect' }), Q.traceShape({ v: 'circle' }), Q.traceShape({ v: 'ellipse' }), Q.robotCount({ kind: 'circle' }), Q.robotCount({ kind: 'quad' })] },
  { id: 266, title: 'การเขียนรูปสามเหลี่ยม รูปสี่เหลี่ยม วงกลม และวงรีโดยใช้สิ่งของเป็นแบบ', short: 'เขียนรูปจากสิ่งของ', tone: 'orange',
    goal: 'เขียนรูปเรขาคณิตโดยใช้สิ่งของเป็นแบบ และใช้รูปเรขาคณิตสร้างภาพตามจินตนาการ',
    teach: [
      { t: 'วาง<b>เหรียญ</b>บนกระดาษ ลากเส้นรอบเหรียญ แล้วยกออก จะได้<b>วงกลม</b>', s: 'วางเหรียญบนกระดาษ ลากเส้นรอบเหรียญ แล้วยกออก จะได้วงกลม', v: el => el.append(traceDemo('circle', 'coin')) },
      { t: 'วาง<b>สมุด</b>แล้วลากเส้นรอบ จะได้<b>รูปสี่เหลี่ยม</b>', s: 'วางสมุดแล้วลากเส้นรอบ จะได้รูปสี่เหลี่ยม', v: el => el.append(traceDemo('book', 'cardbook')) },
      { t: 'ลอง<b>สร้างภาพตามจินตนาการ</b> แตะรูปเพื่อเพิ่ม ลากเพื่อย้าย กดหมุนได้', s: 'ลองสร้างภาพตามจินตนาการ แตะรูปเพื่อเพิ่ม ลากเพื่อย้าย', v: el => el.append(shapeCanvas()) }
    ],
    game: () => [Q.traceWhat({ obj: 'coin', name: 'เหรียญ', kind: 'circle' }), Q.traceWhat({ obj: 'setsquare', name: 'ไม้ฉาก', kind: 'tri' }), Q.traceWhat({ obj: 'plate', name: 'จานรูปไข่', kind: 'ellipse' }), Q.traceWhat({ obj: 'cardbook', name: 'สมุด', kind: 'quad' }),
      Q.traceShape({ v: 'circle', obj: 'coin', name: 'เหรียญ' }), Q.traceShape({ v: 'book', obj: 'cardbook', name: 'สมุด' })] },
  { id: 267, title: 'แบบรูปซ้ำของรูปเรขาคณิตและรูปอื่น ๆ', short: 'แบบรูปซ้ำ', tone: 'sky',
    goal: 'บอกชุดที่ซ้ำในแบบรูปซ้ำของรูปเรขาคณิตและรูปอื่น ๆ',
    teach: [
      { t: '<b>แบบรูปซ้ำ</b> คือรูปที่เรียงเป็นชุดเดิมซ้ำไปเรื่อย ๆ — กด<b>หาชุดที่ซ้ำ</b>', s: 'แบบรูปซ้ำ คือรูปที่เรียงเป็นชุดเดิมซ้ำไปเรื่อย ๆ กดหาชุดที่ซ้ำ', v: el => el.append(patternSim(rep(['ci.sky', 'ci.sky.s'], 4))) },
      { t: 'ชุดที่ซ้ำอาจมี 3 รูป ซ้ำกันเรื่อง<b>รูปร่าง สี หรือขนาด</b>', s: 'ชุดที่ซ้ำอาจมีสามรูป ซ้ำกันเรื่องรูปร่าง สี หรือขนาด', v: el => el.append(patternSim(rep(['tri.coral', 'ci.mint', 'sq.yellow'], 3))) },
      { t: 'แบบรูปซ้ำเรื่อง<b>ขนาด</b>: ใหญ่ ใหญ่ เล็ก …', s: 'แบบรูปซ้ำเรื่องขนาด ใหญ่ ใหญ่ เล็ก', v: el => el.append(patternSim(rep(['strawberry', 'strawberry', 'strawberry.s'], 3))) }
    ],
    game: () => [...shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4).map(i => Q.patUnit({ seq: WS9_UNIT[i] })), Q.patMissing({ seq: WS9_MISS[0][0], blank: WS9_MISS[0][1] }), Q.patMissing({ seq: WS9_MISS[5][0], blank: WS9_MISS[5][1] })] },
  { id: 268, title: 'รูปที่หายไปในแบบรูปซ้ำของรูปเรขาคณิตและรูปอื่น ๆ', short: 'รูปที่หายไป', tone: 'red',
    goal: 'หารูปที่หายไปในแบบรูปซ้ำ และสร้างแบบรูปซ้ำเกี่ยวกับรูปร่าง สี และขนาด',
    teach: [
      { t: 'หา<b>ชุดที่ซ้ำ</b>ก่อน แล้วดูว่าช่องว่างตรงกับรูปไหนในชุด', s: 'หาชุดที่ซ้ำก่อน แล้วดูว่าช่องว่างตรงกับรูปไหนในชุด', v: el => el.append(missingSim(...WS9_MISS[2])) },
      { t: 'รูปอื่น ๆ ก็ทำได้เหมือนกัน เช่น ผลไม้', s: 'รูปอื่น ๆ ก็ทำได้เหมือนกัน เช่น ผลไม้', v: el => el.append(missingSim(...WS9_MISS[15])) }
    ],
    game: () => [...shuffle([1, 3, 4]).slice(0, 2).map(i => Q.patMissing({ seq: WS9_MISS[i][0], blank: WS9_MISS[i][1] })), ...shuffle([6, 7, 8, 9, 10, 11]).slice(0, 2).map(i => Q.patMissing({ seq: WS9_MISS[i][0], blank: WS9_MISS[i][1] })), ...shuffle([12, 13, 14, 16, 17]).slice(0, 2).map(i => Q.patMissing({ seq: WS9_MISS[i][0], blank: WS9_MISS[i][1] })),
      Q.patMake({ unit: ['tri.sky', 'ci.sky', 'ci.sky'], palette: ['tri.sky', 'ci.sky', 'sq.sky'] }), Q.patMake({ unit: ['sq.coral', 'sq.yellow', 'sq.mint'], palette: ['sq.coral', 'sq.yellow', 'sq.mint', 'sq.sky'] }), Q.patMake({ unit: ['ci.lilac', 'ci.lilac.s'], reps: 3 })] }
];
const EXAM_CH9 = [
  { q: 'รูปนี้คือรูปเรขาคณิตใด', solid: 'cone', opts: ['กรวย', 'ทรงกลม', 'ทรงกระบอก'], a: 0 },
  { q: 'รูปนี้คือรูปเรขาคณิตใด', solid: 'sphere', opts: ['ทรงกลม', 'วงกลม', 'ทรงกระบอก'], a: 0 },
  { q: 'รูปนี้คือรูปเรขาคณิตใด', solid: 'cylLie', opts: ['ทรงกระบอก', 'ทรงสี่เหลี่ยมมุมฉาก', 'กรวย'], a: 0 },
  { q: 'รูปนี้คือรูปเรขาคณิตใด', solid: 'tower', opts: ['ทรงสี่เหลี่ยมมุมฉาก', 'ทรงกระบอก', 'รูปสี่เหลี่ยม'], a: 0 },
  { q: 'ลูกบอลมีลักษณะคล้ายรูปเรขาคณิตใด', obj: 'ball', opts: ['ทรงกลม', 'ทรงกระบอก', 'กรวย'], a: 0 },
  { q: 'กลองมีลักษณะคล้ายรูปเรขาคณิตใด', obj: 'drum', opts: ['ทรงกระบอก', 'ทรงกลม', 'ทรงสี่เหลี่ยมมุมฉาก'], a: 0 },
  { q: 'ไอศกรีมโคนมีลักษณะคล้ายรูปเรขาคณิตใด', obj: 'icecream', opts: ['กรวย', 'ทรงกระบอก', 'ทรงกลม'], a: 0 },
  { q: 'กล่องนมมีลักษณะคล้ายรูปเรขาคณิตใด', obj: 'carton', opts: ['ทรงสี่เหลี่ยมมุมฉาก', 'กรวย', 'ทรงกลม'], a: 0 },
  { q: 'รูปนี้คือรูปอะไร', shape: ['tri', 30], opts: ['รูปสามเหลี่ยม', 'รูปสี่เหลี่ยม', 'วงรี'], a: 0 },
  { q: 'รูปนี้คือรูปอะไร', shape: ['wellipse', 0], opts: ['วงรี', 'วงกลม', 'รูปสี่เหลี่ยม'], a: 0 },
  { q: 'รูปสี่เหลี่ยมมีกี่ด้าน กี่มุม', shape: ['rect', 0], opts: ['4 ด้าน 4 มุม', '3 ด้าน 3 มุม', '4 ด้าน 0 มุม'], a: 0 },
  { q: 'รูปใดไม่มีด้านและไม่มีมุม', opts: [{ shape: 'circle' }, { shape: 'tri' }, { shape: 'square' }], a: 0 },
  { q: 'ถ้าลากเส้นรอบเหรียญ จะได้รูปอะไร', obj: 'coin', opts: ['วงกลม', 'วงรี', 'รูปสามเหลี่ยม'], a: 0 },
  { q: 'รูปใดหายไปจากแบบรูปซ้ำ', seq: WS9_MISS[0], opts: [{ tok: 'ci.lilac' }, { tok: 'sq.pink' }, { tok: 'tri.sky' }], a: 0 },
  { q: 'รูปใดหายไปจากแบบรูปซ้ำ', seq: WS9_MISS[16], opts: [{ tok: 'plum' }, { tok: 'orange' }, { tok: 'apple' }], a: 0 }
];
LESSONS_CH9.push({ id: 269, boss: true, title: 'ด่านบอส: บทที่ 9 รูปเรขาคณิต', short: 'ด่านบอส · ข้อสอบ', tone: 'lilac',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส', exam: spread(EXAM_CH9), pass: 8, bossName: 'ราชาปีศาจรูปทรง', bossPal: 'lilac', emblem: '▲●■' });

/* =========================================================
   GRADE 1 · CHAPTER 10 — จำนวนนับ 21 ถึง 100 (เมืองร้อย)
   ========================================================= */
const WS10_TENS = [70, 60, 30, 10, 80, 100, 50, 90, 20, 40];
const WS10_21 = [21, 23, 28, 25, 24, 27, 22, 26, 29, 30];
const WS10_31 = [35, 47, 33, 49, 41, 38, 50, 44];
const WS10_51 = [67, 87, 84, 51, 64, 88, 72, 56, 83, 90];
const WS10_PV = [[49, 0], [78, 1], [55, 0], [14, 1], [63, 0], [88, 1], [85, 0], [31, 1], [77, 0], [20, 1]];
const WS10_EXP = [68, 15, 27, 82, 97, 45, 61, 96, 74, 36, 23, 52, 11, 83, 16, 30, 95, 24, 55, 71];
const WS10_CMP = [[16, 76], [58, 99], [34, 40], [41, 79], [97, 80], [19, 11], [40, 65], [84, 62], [49, 29], [65, 77], [50, 43], [79, 78], [62, 38], [83, 99], [98, 100], [70, 64]];
const WS10_CMPE = [[62, 54], [48, 48], [36, 42], [55, 51], [12, 30], [89, 92], [98, 88], [70, 32], [65, 65], [49, 21], [70, 71], [55, 54], [33, 33], [40, 67], [95, 66], [79, 78]];
const WS10_ASC = [[79, 64, 80], [91, 43, 66], [12, 67, 89, 53], [20, 56, 48, 30], [54, 96, 79, 73], [52, 43, 78, 49], [69, 60, 51, 62, 61], [84, 90, 86, 81, 83]];
const WS10_DESC = [[37, 45, 54], [64, 93, 78], [88, 97, 59, 85], [48, 95, 74, 99], [87, 36, 84, 31], [78, 22, 28, 75], [91, 38, 31, 95, 34], [23, 46, 41, 45, 21]];
const WS10_P1 = [[[67, 66, 65, 64, 63, 62], 5], [[34, 35, 36, 37, 38, 39], 5], [[56, 57, 58, 59, 60, 61], 5], [[83, 82, 81, 80, 79, 78], 5], [[21, 22, 23, 24, 25, 26], 5], [[89, 88, 87, 86, 85, 84], 5], [[55, 56, 57, 58, 59, 60], 4], [[70, 69, 68, 67, 66, 65], 4], [[33, 34, 35, 36, 37, 38], 5], [[68, 69, 70, 71, 72, 73], 1], [[26, 25, 24, 23, 22, 21], 0]];
const WS10_P10 = [[[10, 20, 30, 40, 50, 60], 5], [[80, 70, 60, 50, 40, 30], 5], [[45, 55, 65, 75, 85, 95], 5], [[77, 67, 57, 47, 37, 27], 4], [[92, 82, 72, 62, 52, 42], 4], [[43, 53, 63, 73, 83, 93], 4], [[25, 35, 45, 55, 65, 75], 4], [[69, 59, 49, 39, 29, 19], 4], [[36, 46, 56, 66, 76, 86], 5], [[71, 61, 51, 41, 31, 21], 5],
  [[20, 30, 40, 50, 60, 70], 5], [[74, 64, 54, 44, 34, 24], 4], [[27, 37, 47, 57, 67, 77], 0], [[91, 81, 71, 61, 51, 41], 2], [[43, 53, 63, 73, 83, 93], 1]];
const WS10_PIECE = [[[43, 44, 45, 46, 54, 64], [43], 46], [[43, 44, 45, 46, 54, 64], [43], 64], [[67, 77, 87, 88, 89, 79, 69], [67], 89], [[67, 77, 87, 88, 89, 79, 69], [67], 69], [[28, 29, 30, 38, 48, 58, 59, 60, 68, 78], [58], 30], [[28, 29, 30, 38, 48, 58, 59, 60, 68, 78], [58], 78], [[36, 37, 38, 48, 58, 68, 73, 74, 75, 76, 85, 95], [75], 38], [[36, 37, 38, 48, 58, 68, 73, 74, 75, 76, 85, 95], [75], 95]];
const TENS_WORD = range(1, 10).map(k => thaiWords(k * 10));
/* rods + cubes machine: +10 / −10 / +1 / −1, regroups at ten, shows digits, Thai digits and words */
function tensMachine(n0, lo = 10, hi = 100) {
  let n = n0; const vis = h('div', { class: 'tm-vis' }), num = h('div', { class: 'tm-num' }), note = h('div', { class: 'cap tm-note' });
  const draw = (msg) => { vis.innerHTML = ''; vis.append(tensOnes(n, { labels: true })); num.innerHTML = `<b class="num">${n}</b><span class="num th">${thai(n)}</span><span class="tm-w">${thaiWords(n)}</span>`; note.innerHTML = msg || `${Math.floor(n / 10)} สิบ กับ ${n % 10} หน่วย`; };
  const step = (d, lab) => h('button', { class: 'btn sm ia ' + (d > 0 ? 'primary' : 'danger'), onclick: e => { e.stopPropagation(); const m = n + d; if (m < lo || m > hi) { sfx.no(); return; } const regroup = d === 1 && m % 10 === 0, ungroup = d === -1 && n % 10 === 0; n = m; draw(regroup ? 'ครบ 10 หน่วย <b>รวมเป็น 1 สิบ</b>' : ungroup ? 'แยก 1 สิบ <b>เป็น 10 หน่วย</b>' : null); if (regroup || ungroup) vis.animate([{ transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.3,1.5,.5,1)' }); sfx.pop(n % 10); say(thaiWords(n), true); } }, lab);
  draw();
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, vis, num), note, h('div', { class: 'rowstack' }, step(-10, '− 1 สิบ'), step(-1, '− 1 หน่วย'), step(1, '+ 1 หน่วย'), step(10, '+ 1 สิบ')));
}
function tensCount() { // count by tens to 100
  let k = 0; const vis = h('div', { class: 'tm-vis' }), big = bigNum(0, 'sm'), w = h('div', { class: 'word' }, ' ');
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (k >= 10) { k = 0; } else k++; vis.innerHTML = ''; vis.append(tensOnes(k * 10)); big.textContent = k * 10; w.textContent = k ? TENS_WORD[k - 1] : ' '; sfx.pop(k); if (k) say(TENS_WORD[k - 1], true); btn.lastChild.textContent = k >= 10 ? 'นับใหม่' : 'เพิ่ม 1 สิบ'; } }, icon('plus'), h('span', null, 'เพิ่ม 1 สิบ'));
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, vis, h('div', { class: 'colstack' }, big, w)), btn);
}
function basketDemo(e, n) {
  const b = baskets(e, n, { labels: true }), big = bigNum('?', 'sm'); [...b.querySelectorAll('.bs-lab')].forEach(l => l.style.visibility = 'hidden');
  const full = Math.floor(n / 10), rest = n % 10; let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: ev => { ev.stopPropagation(); const labs = b.querySelectorAll('.bs-lab'); if (k < full) { labs[k].style.visibility = ''; k++; big.textContent = k * 10; say(TENS_WORD[k - 1], true); sfx.pop(k); if (k === full && !rest) btn.remove(); } else { big.textContent = n; say(`${TENS_WORD[full - 1]} นับต่ออีก ${WORD[rest]} เป็น ${thaiWords(n)}`, true); sfx.ok(); btn.remove(); } } }, icon('plus'), 'นับทีละตะกร้า');
  return h('div', { class: 'colstack' }, b, h('div', { class: 'rowstack' }, big, btn));
}
function hundredTap() {
  const g = hundredGrid({}), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'แตะจำนวนใดก็ได้ในตารางร้อย'); g.classList.add('ia');
  g.querySelectorAll('.hc').forEach(c => c.onclick = e => { e.stopPropagation(); const n = +c.dataset.n; g.querySelectorAll('.hc').forEach(x => x.classList.remove('on', 'r1', 'd10', 'col')); c.classList.add('on');
    if (n % 10) g.querySelector(`[data-n="${n + 1}"]`).classList.add('r1'); if (n <= 90) g.querySelector(`[data-n="${n + 10}"]`).classList.add('d10');
    out.innerHTML = `<b>${n}</b>` + (n % 10 ? ` · ทางขวา ${n + 1} (เพิ่ม 1)` : '') + (n <= 90 ? ` · ข้างล่าง ${n + 10} (เพิ่ม 10)` : ''); sfx.pop(n % 10); say(thaiWords(n), true); });
  const btn = h('button', { class: 'btn info ia', onclick: async e => { e.stopPropagation(); btn.disabled = true; const on = g.querySelector('.hc.on'), n0 = on ? +on.dataset.n : 3; g.querySelectorAll('.hc').forEach(x => x.classList.remove('col'));
    for (let n = (n0 - 1) % 10 + 1; n <= 100; n += 10) { g.querySelector(`[data-n="${n}"]`).classList.add('col'); sfx.pop(n / 10); say(thaiWords(n), true); await sleep(520); } btn.disabled = false; } }, icon('play'), 'ไล่ลงทีละ 10');
  return h('div', { class: 'colstack' }, g, h('div', { class: 'rowstack' }, btn, out));
}
function expandDemo(n) {
  const t = Math.floor(n / 10), u = n % 10, eq = eqRow([n, '=', '?', '+', '?']), pc = placeChart(n, { places: 2, values: false });
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); btn.remove(); pc.replaceWith(placeChart(n, { places: 2, values: true })); eq.fill && eq.fill(t * 10); setTimeout(() => { eq.replaceWith(eqRow([n, '=', t * 10, '+', u], { hi: [2, 4] })); sfx.ok(); say(`${thaiWords(n)} เท่ากับ ${thaiWords(t * 10)} บวก ${WORD[u]}`, true); }, 250); } }, icon('eye'), 'แยกเป็นค่าของแต่ละหลัก');
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, tensOnes(n, { labels: true }), pc), eq, btn);
}
function compareBlocks(a, b) {
  const rel = (x, y) => x > y ? '>' : x < y ? '<' : '=', A = tensOnes(a, { labels: true }), B = tensOnes(b, { labels: true }), sign = h('b', { class: 'num cmpsign' }, '?'), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } });
  let step = 0; const ta = Math.floor(a / 10), tb = Math.floor(b / 10);
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); step++;
    if (step === 1) { [A, B].forEach(x => x.querySelector('.rod')?.classList.add('hi')); out.innerHTML = `หลักสิบ: ${ta} สิบ กับ ${tb} สิบ` + (ta === tb ? ' — เท่ากัน ต้องดูหลักหน่วย' : ''); if (ta !== tb) { sign.textContent = rel(a, b); btn.remove(); out.innerHTML += ` → <b>${a} ${rel(a, b)} ${b}</b>`; sfx.ok(); } else { btn.lastChild.textContent = 'เทียบหลักหน่วย'; sfx.pop(2); } say(out.textContent.replace('>', ' มากกว่า ').replace('<', ' น้อยกว่า '), true); }
    else { [A, B].forEach(x => x.querySelector('.cube')?.classList.add('hi')); sign.textContent = rel(a, b); out.innerHTML = `หลักหน่วย: ${a % 10} กับ ${b % 10} → <b>${a} ${rel(a, b)} ${b}</b>`; btn.remove(); sfx.ok(); say(out.textContent.replace('>', ' มากกว่า ').replace('<', ' น้อยกว่า ').replace('=', ' เท่ากับ '), true); } } }, icon('right'), h('span', null, 'เทียบหลักสิบ'));
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack cmpblk' }, h('div', { class: 'colstack' }, A, h('b', { class: 'num' }, a)), sign, h('div', { class: 'colstack' }, B, h('b', { class: 'num' }, b))), btn, out);
}
const LESSONS_CH10 = [
  { id: 271, title: 'การนับทีละ 10', short: 'นับทีละ 10', tone: 'sky',
    goal: 'นับเพิ่มทีละ 10 จาก 10 ถึง 100 และบอกจำนวนจากกลุ่มละ 10',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองร้อย</b>! จัดของเป็นกลุ่มละ 10 แล้ว<b>นับทีละ 10</b> — แตะปุ่มนับดูนะ', s: 'ยินดีต้อนรับสู่เมืองร้อย จัดของเป็นกลุ่มละสิบ แล้วนับทีละสิบ แตะปุ่มนับดูนะ', v: el => el.append(skipDemo('pig', 30, 10)) },
      { t: '1 แท่ง = <b>1 สิบ</b> · เพิ่มทีละแท่ง: สิบ ยี่สิบ สามสิบ … จนถึง<b>หนึ่งร้อย</b>', s: 'หนึ่งแท่งเท่ากับหนึ่งสิบ เพิ่มทีละแท่ง สิบ ยี่สิบ สามสิบ จนถึงหนึ่งร้อย', v: el => el.append(tensCount()) },
      { t: '<b>10 สิบ = 100</b> อ่านว่า <b>หนึ่งร้อย</b>', s: 'สิบ สิบ เท่ากับ หนึ่งร้อย', v: el => el.append(numStrip(range(1, 10).map(k => k * 10), [], { step: 10 })) }
    ],
    game: () => [Q.skipCount({ step: 10, n: 30, item: { e: 'pig', n: 'หมู', c: 'ตัว' } }), Q.skipCount({ step: 10, n: 20, item: { e: 'car', n: 'รถ', c: 'คัน' } }), Q.skipCount({ step: 10, n: 60, item: { e: 'pineapple', n: 'สับปะรด', c: 'ผล' } }),
      Q.tensRead({ n: pick([80, 50, 90, 60]) }), Q.tensRead({ n: pick(WS10_TENS), ask: 'word' }), Q.tensRead({ n: pick(WS10_TENS), ask: 'thai' }), Q.tensRead({ n: 100 })] },
  { id: 272, title: 'จำนวนนับ 21 ถึง 30', short: '21 ถึง 30', tone: 'coral',
    goal: 'อ่าน เขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 21 ถึง 30',
    teach: [
      { t: '2 สิบ กับ 1 หน่วย = <b>21</b> อ่านว่า <b>ยี่สิบเอ็ด</b> — กด<b>+ 1 หน่วย</b> นับต่อไปจนถึง 30', s: 'สองสิบกับหนึ่งหน่วย เท่ากับ ยี่สิบเอ็ด กดเพิ่มหนึ่งหน่วย นับต่อไปจนถึงสามสิบ', v: el => el.append(tensMachine(21, 20, 30)) },
      { t: 'ผลไม้ตะกร้าละ 10 ผล: นับตะกร้าเต็มทีละ 10 แล้ว<b>นับต่อ</b>ที่เหลือทีละ 1', s: 'ผลไม้ตะกร้าละสิบผล นับตะกร้าเต็มทีละสิบ แล้วนับต่อที่เหลือทีละหนึ่ง', v: el => el.append(basketDemo('orange', 24)) }
    ],
    game: () => [Q.basketCount({ e: 'apple', name: 'แอปเปิล', n: 30 }), Q.basketCount({ e: 'guava', name: 'ฝรั่ง', n: 27 }), Q.basketCount({ e: 'chompoo', name: 'ชมพู่', n: 28 }), Q.tensRead({ n: pick(WS10_21) }), Q.tensRead({ n: pick(WS10_21), ask: 'thai' }), Q.tensRead({ n: pick(WS10_21), ask: 'word' }), Q.wordToNum({ n: rnd(21, 30) })] },
  { id: 273, title: 'จำนวนนับ 31 ถึง 50', short: '31 ถึง 50', tone: 'mint',
    goal: 'อ่าน เขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 31 ถึง 50',
    teach: [
      { t: 'ลองสร้างจำนวน 31 ถึง 50 ด้วย<b>แท่งสิบ</b>และ<b>ก้อนหน่วย</b> — ครบ 10 หน่วยจะรวมเป็น 1 สิบ', s: 'ลองสร้างจำนวนสามสิบเอ็ดถึงห้าสิบ ด้วยแท่งสิบและก้อนหน่วย ครบสิบหน่วยจะรวมเป็นหนึ่งสิบ', v: el => el.append(tensMachine(38, 30, 50)) },
      { t: 'แอปเปิล 3 ตะกร้าเต็ม กับอีก 6 ผล มีทั้งหมดกี่ผล?', s: 'แอปเปิลสามตะกร้าเต็ม กับอีกหกผล มีทั้งหมดกี่ผล', v: el => el.append(basketDemo('apple', 36)) }
    ],
    game: () => [Q.basketCount({ e: 'mango', name: 'มะม่วง', n: 50 }), Q.basketCount({ e: 'pineapple', name: 'สับปะรด', n: 33 }), Q.basketCount({ e: 'mangosteen', name: 'มังคุด', n: 44 }), Q.tensRead({ n: pick(WS10_31) }), Q.tensRead({ n: pick(WS10_31), ask: 'thai' }), Q.tensRead({ n: pick(WS10_31), ask: 'word' }), Q.wordToNum({ n: rnd(31, 50) })] },
  { id: 274, title: 'จำนวนนับ 51 ถึง 100', short: '51 ถึง 100', tone: 'orange',
    goal: 'อ่าน เขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวน 51 ถึง 100',
    teach: [
      { t: 'จำนวน 51 ถึง 100: กดเพิ่ม/ลดทีละ 1 สิบ หรือ 1 หน่วย แล้วอ่านออกเสียง', s: 'จำนวนห้าสิบเอ็ดถึงหนึ่งร้อย กดเพิ่มหรือลดทีละหนึ่งสิบ หรือหนึ่งหน่วย แล้วอ่านออกเสียง', v: el => el.append(tensMachine(67, 50, 100)) },
      { t: '<b>ตารางร้อย</b> มีจำนวน 1 ถึง 100 แถวละ 10 จำนวน — แตะดูจำนวนใดก็ได้', s: 'ตารางร้อย มีจำนวนหนึ่งถึงหนึ่งร้อย แถวละสิบจำนวน แตะดูจำนวนใดก็ได้', v: el => el.append(hundredTap()) }
    ],
    game: () => { const ns = shuffle(WS10_51); return [Q.tensRead({ n: ns[0] }), Q.tensRead({ n: ns[1] }), Q.tensRead({ n: ns[2], ask: 'thai' }), Q.tensRead({ n: ns[3], ask: 'word' }), Q.wordToNum({ n: rnd(51, 99) }), Q.numToWord({ n: rnd(51, 99) }), Q.tensRead({ n: 100, ask: 'word' })]; } },
  { id: 275, title: 'หลัก ค่าของเลขโดดในแต่ละหลัก ของจำนวนนับไม่เกิน 100', short: 'หลักและค่าของเลขโดด', tone: 'lilac',
    goal: 'บอกหลักและค่าของเลขโดดในแต่ละหลักของจำนวนนับไม่เกิน 100',
    teach: [
      { t: 'จำนวนสองหลักมี <b>หลักสิบ</b> และ <b>หลักหน่วย</b> · 49 มีเลข 4 ในหลักสิบ <b>มีค่า 40</b> และเลข 9 ในหลักหน่วย <b>มีค่า 9</b>', s: 'จำนวนสองหลักมีหลักสิบ และหลักหน่วย สี่สิบเก้า มีเลขสี่ในหลักสิบ มีค่าสี่สิบ และเลขเก้าในหลักหน่วย มีค่าเก้า', v: el => el.append(h('div', { class: 'rowstack' }, tensOnes(49, { labels: true }), placeChart(49, { places: 2, values: true }))) },
      { t: 'เลขเดียวกัน อยู่คนละหลัก <b>มีค่าไม่เท่ากัน</b>: 88 → 80 กับ 8', s: 'เลขเดียวกัน อยู่คนละหลัก มีค่าไม่เท่ากัน แปดสิบแปด คือ แปดสิบ กับ แปด', v: el => el.append(h('div', { class: 'rowstack' }, tensOnes(88, { labels: true }), placeChart(88, { places: 2, values: true }))) },
      { t: 'ลองเปลี่ยนจำนวน แล้วดูค่าของแต่ละหลัก', s: 'ลองเปลี่ยนจำนวน แล้วดูค่าของแต่ละหลัก', v: el => el.append(tensMachine(55, 10, 99)) }
    ],
    game: () => shuffle(WS10_PV).slice(0, 6).map(([n, pos]) => Q.place2({ n, pos })) },
  { id: 276, title: 'การเขียนแสดงจำนวนในรูปกระจาย', short: 'รูปกระจาย', tone: 'yellow',
    goal: 'เขียนแสดงจำนวนนับไม่เกิน 100 ในรูปกระจาย',
    teach: [
      { t: '<b>รูปกระจาย</b> = ค่าของหลักสิบ + ค่าของหลักหน่วย · แตะปุ่มเพื่อแยก 53', s: 'รูปกระจาย เท่ากับ ค่าของหลักสิบ บวก ค่าของหลักหน่วย แตะปุ่มเพื่อแยกห้าสิบสาม', v: el => el.append(expandDemo(53)) },
      { t: 'ลองอีกจำนวน: 84', s: 'ลองอีกจำนวน แปดสิบสี่', v: el => el.append(expandDemo(84)) }
    ],
    game: () => { const ns = shuffle(WS10_EXP.filter(n => n !== 53 && n !== 84)); return [...ns.slice(0, 5).map(n => Q.expand2({ n })), Q.pickExpand2({ n: ns[5] }), Q.pickExpand2({ n: ns[6] })]; } },
  { id: 277, title: 'การเปรียบเทียบจำนวน', short: 'เปรียบเทียบจำนวน', tone: 'sky',
    goal: 'เปรียบเทียบจำนวนนับไม่เกิน 100 โดยใช้เครื่องหมาย > < =',
    teach: [
      { t: 'เปรียบเทียบ: ดู<b>หลักสิบ</b>ก่อน หลักสิบมากกว่า จำนวนนั้นมากกว่า', s: 'เปรียบเทียบ ดูหลักสิบก่อน หลักสิบมากกว่า จำนวนนั้นมากกว่า', v: el => el.append(compareBlocks(34, 40)) },
      { t: 'ถ้าหลักสิบ<b>เท่ากัน</b> ให้ดู<b>หลักหน่วย</b>', s: 'ถ้าหลักสิบเท่ากัน ให้ดูหลักหน่วย', v: el => el.append(compareBlocks(79, 78)) }
    ],
    game: () => { const a = shuffle(omit(WS10_CMP, [[34, 40], [79, 78]])), b = shuffle(WS10_CMPE.filter(([x, y]) => x === y)), c = shuffle(omit(WS10_CMPE.filter(([x, y]) => x !== y), [[79, 78]]));
      return [Q.cmp2({ a: a[0][0], b: a[0][1], blocks: a[0][0] < 100 && a[0][1] < 100 }), Q.cmp2({ a: a[1][0], b: a[1][1] }), Q.cmp2({ a: a[2][0], b: a[2][1] }), Q.cmp2({ a: b[0][0], b: b[0][1] }), Q.cmp2({ a: c[0][0], b: c[0][1] }), Q.cmp2({ a: c[1][0], b: c[1][1] })]; } },
  { id: 278, title: 'การเรียงลำดับจำนวน', short: 'เรียงลำดับจำนวน', tone: 'mint',
    goal: 'เรียงลำดับจำนวนนับไม่เกิน 100 จากน้อยไปมาก และจากมากไปน้อย',
    teach: [
      { t: 'วางจำนวนบน<b>เส้นจำนวน</b>: ยิ่งอยู่ทางขวา ยิ่งมาก', s: 'วางจำนวนบนเส้นจำนวน ยิ่งอยู่ทางขวา ยิ่งมาก', v: el => el.append(orderLine([12, 67, 89, 53], 100, 0)) },
      { t: 'เรียงจาก<b>น้อยไปมาก</b>: 12, 53, 67, 89 · จาก<b>มากไปน้อย</b>: 89, 67, 53, 12', s: 'เรียงจากน้อยไปมาก สิบสอง ห้าสิบสาม หกสิบเจ็ด แปดสิบเก้า', v: el => el.append(numStrip([12, 53, 67, 89]), numStrip([89, 67, 53, 12])) }
    ],
    game: () => { const a = shuffle(WS10_ASC.filter(x => x[0] !== 12)), d = shuffle(WS10_DESC); return [Q.order({ nums: a[0] }), Q.order({ nums: a[1] }), Q.order({ nums: a[2] }), Q.order({ nums: d[0], dir: 'desc' }), Q.order({ nums: d[1], dir: 'desc' }), Q.order({ nums: d[2], dir: 'desc' })]; } },
  { id: 279, title: 'แบบรูปของจำนวนที่เพิ่มขึ้นทีละ 1 และแบบรูปของจำนวนที่ลดลงทีละ 1', short: 'แบบรูปทีละ 1', tone: 'coral',
    goal: 'บอกจำนวนที่หายไปในแบบรูปของจำนวนที่เพิ่มขึ้นทีละ 1 และลดลงทีละ 1',
    teach: [
      { t: '<b>เพิ่มขึ้นทีละ 1</b>: 56, 57, 58, … — กดปุ่มเพื่อไปต่อ', s: 'เพิ่มขึ้นทีละหนึ่ง ห้าสิบหก ห้าสิบเจ็ด ห้าสิบแปด กดปุ่มเพื่อไปต่อ', v: el => el.append(hopStrip(56, 1)) },
      { t: '<b>ลดลงทีละ 1</b>: 83, 82, 81, …', s: 'ลดลงทีละหนึ่ง แปดสิบสาม แปดสิบสอง แปดสิบเอ็ด', v: el => el.append(hopStrip(83, -1)) }
    ],
    game: () => { const p = shuffle(WS10_P1.filter(([v]) => v[0] !== 56 && v[0] !== 83)); return [...p.slice(0, 4).map(([vals, b]) => Q.seqBlank({ vals, blank: b })), Q.patRule2({ vals: p[4][0].slice(0, 5) }), Q.patRule2({ vals: p[5][0].slice(0, 5) })]; } },
  { id: 280, title: 'แบบรูปของจำนวนที่เพิ่มขึ้นทีละ 10 และแบบรูปของจำนวนที่ลดลงทีละ 10', short: 'แบบรูปทีละ 10', tone: 'orange',
    goal: 'บอกจำนวนที่หายไปในแบบรูปของจำนวนที่เพิ่มขึ้นทีละ 10 และลดลงทีละ 10 รวมทั้งบนตารางร้อย',
    teach: [
      { t: '<b>เพิ่มขึ้นทีละ 10</b>: เลขในหลักสิบเพิ่มขึ้นทีละ 1 หลักหน่วยเท่าเดิม', s: 'เพิ่มขึ้นทีละสิบ เลขในหลักสิบเพิ่มขึ้นทีละหนึ่ง หลักหน่วยเท่าเดิม', v: el => el.append(hopStrip(45, 10)) },
      { t: '<b>ลดลงทีละ 10</b>: 92, 82, 72, …', s: 'ลดลงทีละสิบ เก้าสิบสอง แปดสิบสอง เจ็ดสิบสอง', v: el => el.append(hopStrip(92, -10)) },
      { t: 'บน<b>ตารางร้อย</b>: ไปทางขวาเพิ่ม 1 · ลงข้างล่างเพิ่ม 10 — แตะจำนวน แล้วกดไล่ลงทีละ 10', s: 'บนตารางร้อย ไปทางขวาเพิ่มหนึ่ง ลงข้างล่างเพิ่มสิบ', v: el => el.append(hundredTap()) }
    ],
    game: () => { const p = shuffle(WS10_P10.filter(([v]) => v[0] !== 45 && v[0] !== 92)), pc = shuffle(WS10_PIECE); return [...p.slice(0, 4).map(([vals, b]) => Q.seqBlank({ vals, blank: b })), Q.patRule2({ vals: p[4][0].slice(0, 5) }), Q.hundredFill({ cells: pc[0][0], show: pc[0][1], q: pc[0][2] }), Q.hundredFill({ cells: pc[1][0], show: pc[1][1], q: pc[1][2] })]; } }
];
const EXAM_CH10 = [
  { q: 'ภาพนี้แสดงจำนวนเท่าไร', blocks: 40, opts: ['40', '4', '14'], a: 0 },
  { q: 'ภาพนี้แสดงจำนวนเท่าไร', blocks: 35, opts: ['35', '53', '8'], a: 0 },
  { q: 'ตัวเลขไทยของ 47 คือข้อใด', opts: ['๔๗', '๗๔', '๔๐๗'], a: 0 },
  { q: 'หกสิบแปด เขียนเป็นตัวเลขฮินดูอารบิกได้อย่างไร', opts: ['68', '86', '608'], a: 0 },
  { q: '72 อ่านว่าอย่างไร', opts: ['เจ็ดสิบสอง', 'ยี่สิบเจ็ด', 'เจ็ดสิบเอ็ด'], a: 0 },
  { q: 'นับทีละ 10: 20, 30, 40, ☐', opts: ['50', '41', '60'], a: 0 },
  { q: '49 เลข 4 อยู่ในหลักใด', opts: ['หลักสิบ', 'หลักหน่วย', 'หลักร้อย'], a: 0 },
  { q: '78 เลข 7 มีค่าเท่าไร', opts: ['70', '7', '78'], a: 0 },
  { q: '85 เลข 5 มีค่าเท่าไร', opts: ['5', '50', '85'], a: 0 },
  { q: '53 เขียนในรูปกระจายได้อย่างไร', opts: ['50 + 3', '5 + 3', '30 + 5'], a: 0 },
  { q: '90 + 6 = ☐', opts: ['96', '69', '906'], a: 0 },
  { q: '58 ☐ 99', legend: true, opts: ['<', '>', '='], a: 0 },
  { q: '65 ☐ 65', legend: true, opts: ['=', '>', '<'], a: 0 },
  { q: '84 ☐ 62', legend: true, opts: ['>', '<', '='], a: 0 },
  { q: 'ข้อใดเรียงลำดับจากน้อยไปมาก', opts: ['43, 66, 91', '91, 66, 43', '43, 91, 66'], a: 0 },
  { q: 'ข้อใดเรียงลำดับจากมากไปน้อย', opts: ['99, 95, 74, 48', '48, 74, 95, 99', '95, 99, 74, 48'], a: 0 },
  { q: '67, 66, 65, 64, ☐', opts: ['63', '65', '74'], a: 0 },
  { q: '45, 55, 65, 75, ☐', opts: ['85', '76', '95'], a: 0 },
  { q: '92, 82, 72, 62 เป็นแบบรูปของจำนวนที่…', opts: ['ลดลงทีละ 10', 'เพิ่มขึ้นทีละ 10', 'ลดลงทีละ 1'], a: 0 },
  { q: 'ส่วนหนึ่งของตารางร้อย ช่อง ? คือจำนวนใด', hund: [[43, 44, 45, 46, 54, 64], [43], 54], opts: ['54', '44', '53'], a: 0 }
];
LESSONS_CH10.push({ id: 289, boss: true, title: 'ด่านบอส: บทที่ 10 จำนวนนับ 21 ถึง 100', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'ตอบคำถามท้ายบท 20 ข้อ ตอบถูกอย่างน้อย 10 ข้อเพื่อชนะบอส', exam: spread(EXAM_CH10), pass: 10, bossName: 'ราชาปีศาจร้อย', bossPal: 'mint', emblem: '100' });

/* =========================================================
   GRADE 1 · CHAPTER 11 — การวัดความยาว (เมืองไม้บรรทัด) · term 2
   ========================================================= */
const WS11_PEN = [{ kind: 'pencil', len: 5, col: 'yellow', name: 'ดินสอ' }, { kind: 'pen', len: 7, name: 'ปากกา' }];
const WS11_KIDS = [{ e: 'kid1', h: 8, name: 'ครูเอ' }, { e: 'kid0', h: 5, name: 'ส้ม' }, { e: 'kid2', h: 7, name: 'ครูเจน' }, { e: 'kid3', h: 4, name: 'น็อต' }];
const WS11_BENPON = [{ e: 'kid5', h: 5, name: 'เบน' }, { e: 'kid6', h: 6, name: 'พล' }];
const WS11_ANIMALS = [{ e: 'cat', h: 4, name: 'แมว' }, { e: 'dog', h: 3, name: 'สุนัข' }, { e: 'teddy', h: 4, name: 'หมี' }, { e: 'rabbit', h: 6, name: 'กระต่าย' }];
const WS11_CLIP = [{ kind: 'crayonbox', len: 3, name: 'กล่องสีไม้' }, { kind: 'pencilcase', len: 4, name: 'กระเป๋าดินสอ' }, { kind: 'pencil', len: 7, col: 'pink', name: 'ดินสอ' }, { kind: 'brush', len: 6, name: 'พู่กัน' }];
const WS11_TALL = [{ e: 'milk', h: 2, name: 'กล่องนม' }, { e: 'dog', h: 3, name: 'สุนัข' }, { e: 'tree', h: 8, name: 'ต้นส้ม' }, { e: 'girl', h: 7, name: 'ผู้หญิง' }];
const WS11_KITCHEN = [{ kind: 'pan', len: 6, name: 'กระทะ' }, { kind: 'spatula', len: 13, name: 'ตะหลิว' }, { kind: 'knife', len: 7, name: 'มีด' }, { kind: 'spoon', len: 7, name: 'ช้อน' }];
const WS11_PENCILS = [{ kind: 'pencil', len: 5, col: 'orange', name: 'ดินสอสีส้ม' }, { kind: 'pencil', len: 7, col: 'green', name: 'ดินสอสีเขียว' }, { kind: 'pencil', len: 5, col: 'red', name: 'ดินสอสีแดง' }, { kind: 'pencil', len: 3, col: 'yellow', name: 'ดินสอสีเหลือง' }];
const WS11_BOTTLES = [{ bottle: 1, col: 'orange', h: 7, name: 'ขวดสีส้ม' }, { bottle: 1, col: 'pink', h: 9, name: 'ขวดสีชมพู' }, { bottle: 1, col: 'green', h: 4, name: 'ขวดสีเขียว' }, { bottle: 1, col: 'sky', h: 5, name: 'ขวดสีฟ้า' }, { bottle: 1, col: 'yellow', h: 7, name: 'ขวดสีเหลือง' }];
const WS11_STRAWS = [{ kind: 'straw', len: 3, col: 'green', name: 'หลอดสีเขียว' }, { kind: 'straw', len: 6, col: 'yellow', name: 'หลอดสีเหลือง' }, { kind: 'straw', len: 4, col: 'orange', name: 'หลอดสีส้ม' }, { kind: 'straw', len: 2, col: 'red', name: 'หลอดสีแดง' }, { kind: 'straw', len: 3, col: 'lilac', name: 'หลอดสีม่วง' }];
const WS11_CM = [{ e: 'rope', len: 18, name: 'เชือก' }, { e: 'flag', len: 7, name: 'ธง' }, { e: 'broom', len: 11, name: 'ไม้กวาด' }, { e: 'cloth', len: 20, name: 'ผ้า' }];
const WS11_CUPS = [{ e: 'mug', h: 20, name: 'แก้วกาแฟ' }, { e: 'can', h: 12, name: 'กระป๋องน้ำแอปเปิล' }, { e: 'glassOJ', h: 17, name: 'แก้วน้ำส้ม' }, { e: 'carton', h: 8, name: 'กล่องนม' }];
const WS11_BLDG = [{ e: 'shopB', h: 14, name: 'ร้านค้า' }, { e: 'school', h: 19, name: 'โรงเรียน' }, { e: 'bank', h: 4, name: 'ธนาคาร' }, { e: 'postoffice', h: 10, name: 'ไปรษณีย์' }];
const WS11_METER = [{ e: 'pencil', name: 'ดินสอ', cm: 18 }, { e: 'book', name: 'หนังสือ', cm: 28 }, { e: 'eraser', name: 'ยางลบ', cm: 5 }, { e: 'door', name: 'ประตู', cm: 200 }, { e: 'bed', name: 'เตียง', cm: 190 }, { e: 'car', name: 'รถยนต์', cm: 450 }, { e: 'teddy', name: 'ตุ๊กตาหมี', cm: 30 }, { e: 'boat', name: 'เรือ', cm: 600 }];
const lenOf = (list, n) => list.find(x => x.name === n);
/* put the two ends on the same start line */
function alignSim(items) {
  const lb = lenBoard(items.map((it, i) => ({ ...it, start: [1.6, 0, .8, 2.2][i % 4] })), { max: Math.max(...items.map(x => x.len)) + 3 }), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'สิ่งใดยาวกว่า? ปลายยังไม่ตรงกัน ดูยากนะ');
  lb.classList.add('align'); lb.append(h('i', { class: 'lb-start' }));
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); btn.remove(); lb.querySelectorAll('.lb-obj').forEach(o => o.style.marginLeft = '0px'); sfx.page();
    setTimeout(() => { const L = Math.max(...items.map(x => x.len)), i = items.findIndex(x => x.len === L); lb.querySelectorAll('.lb-row')[i].classList.add('win'); out.innerHTML = `จัดปลายให้เริ่มที่เส้นเดียวกันแล้ว <b>${items[i].name}ยาวที่สุด</b>`; sfx.ok(); say(out.textContent, true); }, 700); } }, icon('right'), 'จัดปลายให้ตรงกัน');
  return h('div', { class: 'colstack' }, lb, btn, out);
}
/* tap two figures to compare their height */
function tallTap(items, o = {}) {
  const hb = heightBoard(items, { unit: o.unit || 'none', guides: o.guides }), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'แตะ 2 คนเพื่อเปรียบเทียบความสูง'); let pick = [];
  hb.classList.add('ia'); hb.querySelectorAll('.hb-col').forEach(c => { c.style.cursor = 'pointer'; c.onclick = e => { e.stopPropagation(); const i = +c.dataset.i; pick = [...pick.filter(x => x !== i), i].slice(-2); hb.querySelectorAll('.hb-col').forEach(x => x.classList.toggle('on', pick.includes(+x.dataset.i))); sfx.pop(pick.length);
    if (pick.length === 2) { const [a, b] = pick.map(k => items[k]); out.innerHTML = a.h === b.h ? `${a.name}สูง<b>เท่ากับ</b>${b.name}` : `${a.name}<b>${a.h > b.h ? 'สูงกว่า' : 'เตี้ยกว่า'}</b>${b.name}`; say(out.textContent, true); } }; });
  const ext = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const mx = Math.max(...items.map(x => x.h)), mn = Math.min(...items.map(x => x.h)); hb.querySelectorAll('.hb-col').forEach(c => { const v = items[+c.dataset.i].h; c.classList.toggle('top', v === mx); c.classList.toggle('low', v === mn); });
    out.innerHTML = `สูงที่สุด: <b>${items.filter(x => x.h === mx).map(x => x.name).join(', ')}</b> · เตี้ยที่สุด: <b>${items.filter(x => x.h === mn).map(x => x.name).join(', ')}</b>`; sfx.ok(); say(out.textContent, true); } }, icon('sparkle'), 'หาสูงที่สุด เตี้ยที่สุด');
  return h('div', { class: 'colstack' }, hb, ext, out);
}
/* lay paper clips one by one under an object */
function clipLay(item, unit = 'clip') {
  const lb = lenBoard([item], { unit, max: item.len + 1 }), us = [...lb.querySelectorAll('.lb-units > *')], big = bigNum(0, 'sm'); us.forEach(u => u.style.visibility = 'hidden'); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); if (k < us.length) { us[k].style.visibility = ''; us[k].animate([{ transform: 'translateY(-14px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.3,1.4,.5,1)' }); k++; big.textContent = k; sfx.pop(k); say(WORD[k], true); }
    if (k >= us.length) { btn.remove(); setTimeout(() => say(`${item.name}ยาว ${WORD[k]} หน่วย`, true), 600); } } }, icon('plus'), unit === 'clip' ? 'วางคลิปทีละอัน' : 'วางทีละหน่วย');
  return h('div', { class: 'colstack' }, lb, h('div', { class: 'rowstack' }, big, btn));
}
/* right and wrong ways of measuring with units */
function unitRules() {
  const ok = lenBoard([{ kind: 'pencil', len: 5, col: 'sky' }], { unit: 'clip', max: 6 }), bad = lenBoard([{ kind: 'pencil', len: 5, col: 'sky' }], { unit: 'clip', max: 6 });
  bad.querySelector('.lb-units').classList.add('gappy'); [...bad.querySelectorAll('.clip')].slice(3).forEach(c => c.remove());
  return h('div', { class: 'colstack' }, h('div', { class: 'rule ok' }, h('b', null, '✓ ถูก'), ' วางต่อกันไม่เว้นช่อง เริ่มที่ปลาย', ok), h('div', { class: 'rule bad' }, h('b', null, '✗ ผิด'), ' วางเว้นช่อง ได้ 3 หน่วย ไม่ถูกต้อง', bad));
}
/* drag the pencil along the ruler: length = end − start */
function rulerSim(len = 5) {
  let st = 0; const lb = lenBoard([{ kind: 'pencil', len, col: 'coral' }], { unit: 'cm', max: 10 }), obj = lb.querySelector('.lb-obj'), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } });
  const draw = () => { obj.style.marginLeft = `calc(var(--u) * ${st})`; out.innerHTML = st === 0 ? `เริ่มที่ <b>0</b> ปลายอยู่ที่ <b>${len}</b> → ยาว <b>${len} เซนติเมตร</b>` : `เริ่มที่ ${st} ปลายอยู่ที่ ${st + len} → ยาว ${st + len} − ${st} = <b>${len} เซนติเมตร</b> (เท่าเดิม!)`; };
  obj.classList.add('ia', 'drag'); obj.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); obj.setPointerCapture(e.pointerId); const U = lb.querySelector('.ruler').getBoundingClientRect().width / 10, x0 = e.clientX, s0 = st;
    const mv = ev => { const v = Math.max(0, Math.min(10 - len, Math.round(s0 + (ev.clientX - x0) / U))); if (v !== st) { st = v; draw(); sfx.tap(); } }; const up = () => { obj.removeEventListener('pointermove', mv); obj.removeEventListener('pointerup', up); say(out.textContent, true); }; obj.addEventListener('pointermove', mv); obj.addEventListener('pointerup', up); });
  draw(); return h('div', { class: 'colstack' }, lb, h('div', { class: 'cap' }, 'ลากดินสอไปวางตรงไหนก็ได้บนไม้บรรทัด'), out);
}
/* 1 metre = 100 centimetres; compare things with the metre stick */
function meterSim() {
  const bars = h('div', { class: 'mbars' }), out = h('div', { class: 'word', style: { fontSize: 'clamp(16px,2vw,22px)', minHeight: '1.6em' } }, 'แตะสิ่งของเพื่อเทียบกับ 1 เมตร');
  const bar = (cm, cls, lab) => h('div', { class: 'mb-row ' + cls }, h('span', { class: 'mb-bar', style: { width: Math.min(cm, 230) / 230 * 100 + '%' } }, cm > 230 ? h('i', { class: 'mb-more' }, '→') : null), h('span', { class: 'mb-lab' }, lab));
  bars.append(bar(100, 'meter', '1 เมตร = 100 เซนติเมตร'));
  const pal = h('div', { class: 'palette ia' }, ...WS11_METER.map(it => { const b = h('button', { class: 'palb' }, art(it.e)); b.onclick = e => { e.stopPropagation(); bars.querySelector('.item')?.remove(); bars.append(bar(it.cm, 'item', it.name)); const more = it.cm > 100; out.innerHTML = `${it.name}<b>${more ? 'ยาวกว่า' : 'สั้นกว่า'} 1 เมตร</b>`; sfx.pop(more ? 6 : 2); say(out.textContent, true); }; return b; }));
  return h('div', { class: 'colstack' }, bars, pal, out);
}
const LESSONS_CH11 = [
  { id: 291, title: 'การเปรียบเทียบความยาวของสิ่งต่าง ๆ', short: 'เปรียบเทียบความยาว', tone: 'sky',
    goal: 'เปรียบเทียบความยาวและความสูงโดยตรง ใช้คำว่า ยาวกว่า สั้นกว่า สูงกว่า เตี้ยกว่า ยาวที่สุด สูงที่สุด',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองไม้บรรทัด</b>! จะเปรียบเทียบความยาว ต้อง<b>ให้ปลายข้างหนึ่งเริ่มที่เส้นเดียวกัน</b>', s: 'ยินดีต้อนรับสู่เมืองไม้บรรทัด จะเปรียบเทียบความยาว ต้องให้ปลายข้างหนึ่งเริ่มที่เส้นเดียวกัน', v: el => el.append(alignSim(WS11_PEN)) },
      { t: 'เปรียบเทียบความสูง: ยืนบนพื้นเดียวกันแล้วดูยอดศีรษะ — <b>แตะ 2 คน</b>', s: 'เปรียบเทียบความสูง ยืนบนพื้นเดียวกันแล้วดูยอดศีรษะ แตะสองคน', v: el => el.append(tallTap(WS11_KIDS)) }
    ],
    game: () => [Q.lenExtreme({ items: reshuffle(WS11_PEN), ask: 'long' }), Q.lenExtreme({ items: reshuffle(WS11_BENPON), ask: 'tall', vis: 'h' }), Q.lenExtreme({ items: reshuffle(WS11_KIDS), ask: 'tall', vis: 'h' }), Q.lenExtreme({ items: reshuffle(WS11_KIDS), ask: 'low', vis: 'h' }),
      Q.tallerWord({ a: WS11_KIDS[0], b: WS11_KIDS[1] }), Q.tallerWord({ a: WS11_KIDS[3], b: WS11_KIDS[2] }), Q.tallerWord({ a: WS11_KIDS[1], b: WS11_KIDS[3] })] },
  { id: 292, title: 'การวัดความยาวโดยใช้หน่วยที่ไม่ใช่หน่วยมาตรฐาน', short: 'วัดด้วยหน่วยไม่มาตรฐาน', tone: 'coral',
    goal: 'วัดความยาวและความสูงโดยใช้สิ่งของ เช่น คลิปหนีบกระดาษ หรือกล่อง เป็นหน่วยวัด',
    teach: [
      { t: 'ใช้<b>คลิปหนีบกระดาษ</b>วัดความยาว: วางต่อกันตั้งแต่ปลายหนึ่งถึงอีกปลาย แล้วนับ — กดวางทีละอัน', s: 'ใช้คลิปหนีบกระดาษวัดความยาว วางต่อกันตั้งแต่ปลายหนึ่งถึงอีกปลาย แล้วนับ', v: el => el.append(clipLay({ kind: 'pencil', len: 5, col: 'sky', name: 'ดินสอสีฟ้า' })) },
      { t: 'วางหน่วยให้<b>ชิดกัน ไม่เว้นช่อง ไม่ซ้อนกัน</b> จึงจะวัดได้ถูกต้อง', s: 'วางหน่วยให้ชิดกัน ไม่เว้นช่อง ไม่ซ้อนกัน จึงจะวัดได้ถูกต้อง', v: el => el.append(unitRules()) },
      { t: 'วัด<b>ความสูง</b>ด้วยกล่องเรียงซ้อนกัน 1 กล่อง = 1 หน่วย', s: 'วัดความสูงด้วยกล่องเรียงซ้อนกัน หนึ่งกล่องเท่ากับหนึ่งหน่วย', v: el => el.append(tallTap(WS11_ANIMALS, { unit: 'box', guides: true })) }
    ],
    game: () => [...WS11_CLIP.map(item => Q.unitCount({ item, unit: 'clip' })), Q.unitCount({ item: WS11_ANIMALS[3], unit: 'box', vis: 'h', max: 7 }), Q.unitCount({ item: WS11_ANIMALS[1], unit: 'box', vis: 'h', max: 7 }), Q.lenExtreme({ items: reshuffle(WS11_CLIP), ask: pick(['long', 'short']), unit: 'clip' })] },
  { id: 293, title: 'การเปรียบเทียบความยาวโดยใช้หน่วยที่ไม่ใช่หน่วยมาตรฐาน', short: 'เปรียบเทียบด้วยหน่วย', tone: 'mint',
    goal: 'เปรียบเทียบความยาวและความสูงจากจำนวนหน่วยที่วัดได้ และบอกว่ายาวกว่าหรือสั้นกว่ากันอยู่กี่หน่วย',
    teach: [
      { t: 'นับหน่วยของแต่ละสิ่ง: <b>จำนวนหน่วยมากกว่า = ยาวกว่า</b>', s: 'นับหน่วยของแต่ละสิ่ง จำนวนหน่วยมากกว่า ยาวกว่า', v: el => el.append(lenBoard(WS11_KITCHEN, { unit: 'cube', guides: true })) },
      { t: 'ความสูงก็เหมือนกัน — แตะ 2 อย่างเพื่อเปรียบเทียบ', s: 'ความสูงก็เหมือนกัน แตะสองอย่างเพื่อเปรียบเทียบ', v: el => el.append(tallTap(WS11_TALL, { unit: 'cube', guides: true })) }
    ],
    game: () => [Q.unitCount({ item: WS11_TALL[0], unit: 'cube', vis: 'h', max: 9 }), Q.unitCount({ item: WS11_TALL[3], unit: 'cube', vis: 'h', max: 9 }), Q.lenExtreme({ items: reshuffle(WS11_TALL), ask: 'tall', vis: 'h', unit: 'cube' }), Q.lenExtreme({ items: reshuffle(WS11_KITCHEN), ask: 'long', unit: 'cube' }), Q.lenExtreme({ items: reshuffle(WS11_KITCHEN), ask: 'short', unit: 'cube' }),
      Q.lenDiff({ a: WS11_KITCHEN[2], b: WS11_KITCHEN[0], unit: 'cube', vis: 'len' }), Q.lenDiff({ a: WS11_KITCHEN[3], b: WS11_KITCHEN[1], unit: 'cube', vis: 'len' })] },
  { id: 294, title: 'การวัดความยาวเป็นเซนติเมตร', short: 'วัดเป็นเซนติเมตร', tone: 'orange',
    goal: 'วัดความยาวและความสูงเป็นเซนติเมตรโดยใช้ไม้บรรทัด และคาดคะเนความยาว',
    teach: [
      { t: '<b>เซนติเมตร</b> เป็นหน่วยมาตรฐาน ใช้<b>ไม้บรรทัด</b>วัด — วางปลายดินสอที่ <b>0</b> แล้วอ่านตัวเลขที่ปลายอีกข้าง', s: 'เซนติเมตร เป็นหน่วยมาตรฐาน ใช้ไม้บรรทัดวัด วางปลายดินสอที่ศูนย์ แล้วอ่านตัวเลขที่ปลายอีกข้าง', v: el => el.append(rulerSim(5)) },
      { t: 'วัดหลายอย่างพร้อมกัน: ทุกอย่างเริ่มที่ 0 อ่านตัวเลขที่ปลาย', s: 'วัดหลายอย่างพร้อมกัน ทุกอย่างเริ่มที่ศูนย์ อ่านตัวเลขที่ปลาย', v: el => el.append(lenBoard(WS11_PENCILS, { unit: 'cm', max: 7, guides: true })) },
      { t: 'วัด<b>ความสูง</b>เป็นเซนติเมตร: ตั้งไม้บรรทัดข้าง ๆ แล้วอ่านที่ยอด', s: 'วัดความสูงเป็นเซนติเมตร ตั้งไม้บรรทัดข้าง ๆ แล้วอ่านที่ยอด', v: el => el.append(heightBoard(WS11_BOTTLES, { unit: 'cm', max: 10, guides: true })) }
    ],
    game: () => { const p = shuffle(WS11_PENCILS), s = shuffle(WS11_STRAWS), b = shuffle(WS11_BOTTLES);
      return [Q.unitCount({ item: p[0], unit: 'cm', max: 7 }), Q.unitCount({ item: s[0], unit: 'cm', max: 7 }), Q.unitCount({ item: b[0], unit: 'cm', vis: 'h', max: 10 }), Q.unitCount({ item: b[1], unit: 'cm', vis: 'h', max: 10 }), Q.lenDiff({ a: WS11_STRAWS[1], b: WS11_STRAWS[2], vis: 'len' }), Q.lenDiff({ a: WS11_STRAWS[3], b: WS11_STRAWS[1], vis: 'len' }), Q.rulerSet({ len: rnd(3, 8) })]; } },
  { id: 295, title: 'การวัดความยาวเป็นเมตร', short: 'วัดเป็นเมตร', tone: 'lilac',
    goal: 'รู้จักหน่วยเมตร (1 เมตร = 100 เซนติเมตร) บอกได้ว่าสิ่งใดยาวกว่าหรือสั้นกว่า 1 เมตร และเลือกหน่วยที่เหมาะสม',
    teach: [
      { t: '<b>1 เมตร = 100 เซนติเมตร</b> ใช้วัดของที่ยาวมาก ๆ — แตะสิ่งของเพื่อเทียบกับไม้เมตร', s: 'หนึ่งเมตร เท่ากับ หนึ่งร้อยเซนติเมตร ใช้วัดของที่ยาวมาก ๆ แตะสิ่งของเพื่อเทียบกับไม้เมตร', v: el => el.append(meterSim()) },
      { t: 'ของชิ้นเล็กวัดเป็น<b>เซนติเมตร</b> · ของยาวมาก ความสูงของตึก ระยะทาง วัดเป็น<b>เมตร</b>', s: 'ของชิ้นเล็กวัดเป็นเซนติเมตร ของยาวมาก ความสูงของตึก ระยะทาง วัดเป็นเมตร', v: el => el.append(h('div', { class: 'rowstack' }, ...[['eraser', 'ซม.'], ['pencil', 'ซม.'], ['door', 'ม.'], ['school', 'ม.']].map(([e, u]) => h('span', { class: 'est-it' }, art(e), h('b', null, u))))) }
    ],
    game: () => { const m = shuffle(WS11_METER); return [...m.slice(0, 4).map(it => Q.meterJudge({ e: it.e, name: it.name, more: it.cm > 100 })), Q.unitPick({ name: 'ความยาวของยางลบ', e: 'eraser', m: false }), Q.unitPick({ name: 'ความสูงของโรงเรียน', e: 'school', m: true }), Q.unitPick({ name: 'ความยาวของเรือ', e: 'boat', m: true })]; } },
  { id: 296, title: 'การเปรียบเทียบความยาวที่มีหน่วยเป็นเซนติเมตร เป็นเมตร', short: 'เปรียบเทียบ ซม. ม.', tone: 'yellow',
    goal: 'เปรียบเทียบความยาวที่มีหน่วยเดียวกัน (เซนติเมตร หรือ เมตร) และหาว่ายาวกว่าหรือสั้นกว่ากันอยู่เท่าไร',
    teach: [
      { t: 'เชือกยาว 18 ซม. ธงยาว 7 ซม. → เชือก<b>ยาวกว่า</b>ธง 18 − 7 = <b>11 เซนติเมตร</b>', s: 'เชือกยาวสิบแปดเซนติเมตร ธงยาวเจ็ดเซนติเมตร เชือกยาวกว่าธง สิบเอ็ดเซนติเมตร', v: el => el.append(h('div', { class: 'rowstack' }, ...WS11_CM.map(x => h('div', { class: 'lencard' }, art(x.e), h('b', null, x.name), h('span', { class: 'num' }, `${x.len} ซม.`))))) },
      { t: 'ตึกสูงเป็น<b>เมตร</b>: โรงเรียนสูง 19 ม. ร้านค้าสูง 14 ม. → โรงเรียนสูงกว่า 5 เมตร', s: 'ตึกสูงเป็นเมตร โรงเรียนสูงสิบเก้าเมตร ร้านค้าสูงสิบสี่เมตร โรงเรียนสูงกว่าห้าเมตร', v: el => el.append(rankSim(WS11_BLDG.map(b => ({ name: b.name, n: b.h })), 'ม.')) }
    ],
    game: () => [Q.lenDiff({ a: WS11_CM[1], b: WS11_CM[2] }), Q.lenDiff({ a: WS11_CM[0], b: WS11_CM[1] }), Q.lenDiff({ a: WS11_CM[3], b: WS11_CM[0] }), Q.lenDiff({ a: WS11_CUPS[1], b: WS11_CUPS[3] }), Q.lenDiff({ a: WS11_CUPS[2], b: WS11_CUPS[0] }), Q.lenDiff({ a: WS11_BLDG[0], b: WS11_BLDG[2], unit: 'm' }), Q.lenDiff({ a: WS11_BLDG[3], b: WS11_BLDG[1], unit: 'm' })] },
  { id: 297, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (1)', short: 'โจทย์ปัญหา (1)', tone: 'sky',
    goal: 'เขียนประโยคสัญลักษณ์และหาคำตอบของโจทย์ปัญหาการบวกและการลบเกี่ยวกับความยาว',
    teach: [
      { t: 'อ่านโจทย์ แล้วคิดว่า <b>เพิ่ม/รวม</b> ใช้การบวก · <b>ตัดออก/เหลือ</b> ใช้การลบ', s: 'อ่านโจทย์ แล้วคิดว่า เพิ่มหรือรวม ใช้การบวก ตัดออกหรือเหลือ ใช้การลบ', v: el => el.append(lenBoard([{ kind: 'ribbon', len: 3, col: 'coral', name: 'เดิม 3 ม.' }, { kind: 'ribbon', len: 8, col: 'sky', name: 'ซื้อเพิ่ม 8 ม.' }, { kind: 'ribbon', len: 11, col: 'mint', name: 'รวม 11 ม.' }], { max: 12 })) },
      { t: 'ตัวอย่างที่ 2 (การลบ): <b>ตัดออก / เหลือ</b> ใช้การลบ — กดดูประโยคสัญลักษณ์', s: 'ตัวอย่างที่สอง ตัดออก หรือเหลือ ใช้การลบ', v: el => el.append(storySim(ST('ผ้ายาว 16 เมตร ตัดไปใช้ 7 เมตร เหลือผ้ากี่เมตร', 16, 7, '-', 'เมตร'))) }
    ],
    game: () => [Q.story20({ text: 'โอ๊ตมีเชือกยาว 4 เมตร ซื้อมาต่ออีก 5 เมตร รวมแล้วเชือกยาวกี่เมตร', a: 4, b: 5, op: '+', unit: 'เมตร' }), Q.story20({ text: 'เสาธงสูง 5 เมตร อาคารสูงมากกว่าเสาธง 4 เมตร อาคารสูงกี่เมตร', a: 5, b: 4, op: '+', unit: 'เมตร' }), Q.story20({ text: 'ริบบิ้นยาว 15 เซนติเมตร ครูตัดไปใช้ 9 เซนติเมตร ริบบิ้นเหลือยาวกี่เซนติเมตร', a: 15, b: 9, op: '-', unit: 'เซนติเมตร' }),
      Q.story20({ text: 'ดินสอยาว 12 เซนติเมตร ปากกายาวกว่าดินสอ 3 เซนติเมตร ปากกายาวกี่เซนติเมตร', a: 12, b: 3, op: '+', unit: 'เซนติเมตร' }), Q.story20({ text: 'ริบบิ้นยาว 15 เมตร ใช้ผูกของขวัญไป 6 เมตร เหลือริบบิ้นกี่เมตร', a: 15, b: 6, op: '-', unit: 'เมตร' })] },
  { id: 298, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (2)', short: 'โจทย์ปัญหา (2)', tone: 'coral',
    goal: 'แก้โจทย์ปัญหาการบวกและการลบเกี่ยวกับความยาวที่ซับซ้อนขึ้น เช่น หาสิ่งที่ยังขาด หาค่าเดิม เปรียบเทียบ',
    teach: [
      { t: '“ต้องตัดอีกกี่เมตรจึงจะครบ” และ “สูงกว่ากันกี่เมตร” ใช้<b>การลบ</b> · “เดิมมีเท่าไร” ให้นำส่วนที่ใช้ไปกับส่วนที่เหลือมา<b>บวก</b>กัน', s: 'ต้องตัดอีกกี่เมตรจึงจะครบ และสูงกว่ากันกี่เมตร ใช้การลบ เดิมมีเท่าไร ให้นำส่วนที่ใช้ไปกับส่วนที่เหลือมาบวกกัน', v: el => el.append(h('div', { class: 'colstack' }, eqRow([19, '−', 13, '=', 6], { sm: true }), h('div', { class: 'cap' }, 'ต้องการ 19 เมตร ตัดแล้ว 13 เมตร → ยังขาด 6 เมตร'), eqRow([6, '+', 14, '=', 20], { sm: true }), h('div', { class: 'cap' }, 'ใช้ไป 6 ซม. เหลือ 14 ซม. → เดิมมี 20 ซม.'))) },
      { t: 'ตัวอย่าง “<b>ต้องหาเพิ่มอีกกี่</b>” → ต้องการ − มีแล้ว', s: 'ต้องหาเพิ่มอีกกี่ ใช้ต้องการลบมีแล้ว', v: el => el.append(storySim(ST('ต้องการเชือก 18 เมตร มีแล้ว 11 เมตร ต้องหาเชือกเพิ่มอีกกี่เมตร', 18, 11, '-', 'เมตร'))) },
      { t: 'ตัวอย่าง “<b>เดิมมีเท่าไร</b>” → ใช้ไป + เหลือ', s: 'เดิมมีเท่าไร ใช้ไปบวกเหลือ', v: el => el.append(storySim(ST('ใช้ริบบิ้นไป 8 เซนติเมตร เหลือ 9 เซนติเมตร เดิมมีริบบิ้นกี่เซนติเมตร', 8, 9, '+', 'เซนติเมตร'))) }
    ],
    game: () => [Q.story20({ text: 'ยายจะตัดผ้าให้ได้ 17 เมตร ตอนนี้ตัดได้ 10 เมตร ต้องตัดเพิ่มอีกกี่เมตรจึงครบ', a: 17, b: 10, op: '-', unit: 'เมตร' }), Q.story20({ text: 'น้ำผึ้งใช้ไหมพรมถักที่คั่นหนังสือไป 4 เซนติเมตร ยังเหลือไหมพรม 11 เซนติเมตร ตอนแรกไหมพรมยาวกี่เซนติเมตร', a: 4, b: 11, op: '+', unit: 'เซนติเมตร' }), Q.story20({ text: 'ต้นสนสูง 11 เมตร เสาไฟสูง 4 เมตร ต้นสนสูงกว่าเสาไฟกี่เมตร', a: 11, b: 4, op: '-', unit: 'เมตร' }),
      Q.story20({ text: 'เชือกสีแดงยาว 17 เซนติเมตร เชือกสีฟ้ายาว 9 เซนติเมตร เชือกสีแดงยาวกว่าเชือกสีฟ้ากี่เซนติเมตร', a: 17, b: 9, op: '-', unit: 'เซนติเมตร' }), Q.story20({ text: 'ต้นไม้สูง 8 เมตร ปีนี้สูงขึ้นอีก 2 เมตร ต้นไม้สูงกี่เมตร', a: 8, b: 2, op: '+', unit: 'เมตร' })] }
];
const EXAM_CH11 = [
  { q: 'สิ่งใดยาวที่สุด', lenb: [WS11_PENCILS, 7], opts: ['ดินสอสีเขียว', 'ดินสอสีส้ม', 'ดินสอสีเหลือง'], a: 0 },
  { q: 'ใครสูงที่สุด', hgtb: [WS11_KIDS, 0], opts: ['ครูเอ', 'ครูเจน', 'น็อต'], a: 0 },
  { q: 'ส้ม ☐ น็อต', hgtb: [[WS11_KIDS[1], WS11_KIDS[3]], 0], opts: ['สูงกว่า', 'เตี้ยกว่า', 'สูงเท่ากับ'], a: 0 },
  { q: 'กระเป๋าดินสอยาวกี่หน่วย', lenb: [[WS11_CLIP[1]], 5, 'clip'], opts: ['4 หน่วย', '3 หน่วย', '5 หน่วย'], a: 0 },
  { q: 'กระต่ายสูงกี่หน่วย', hgtb: [[WS11_ANIMALS[3]], 7, 'box'], opts: ['6 หน่วย', '5 หน่วย', '7 หน่วย'], a: 0 },
  { q: 'วางคลิปวัดความยาวแบบใดถูกต้อง', opts: ['วางต่อกัน ไม่เว้นช่อง', 'วางเว้นช่องห่าง ๆ', 'วางซ้อนกัน'], a: 0 },
  { q: 'มีดยาว 7 หน่วย กระทะยาว 6 หน่วย มีดยาวกว่ากระทะอยู่กี่หน่วย', opts: ['1 หน่วย', '13 หน่วย', '7 หน่วย'], a: 0 },
  { q: 'ดินสอสีเหลืองยาวกี่เซนติเมตร', lenb: [[WS11_PENCILS[3]], 7, 'cm'], opts: ['3 เซนติเมตร', '4 เซนติเมตร', '2 เซนติเมตร'], a: 0 },
  { q: 'ขวดสีชมพูสูงกี่เซนติเมตร', hgtb: [[WS11_BOTTLES[1]], 10, 'cm'], opts: ['9 เซนติเมตร', '8 เซนติเมตร', '10 เซนติเมตร'], a: 0 },
  { q: '1 เมตร เท่ากับกี่เซนติเมตร', opts: ['100 เซนติเมตร', '10 เซนติเมตร', '1 เซนติเมตร'], a: 0 },
  { q: 'สิ่งใดยาวกว่า 1 เมตร', opts: [{ pic: ['door', 1] }, { pic: ['pencil', 1] }, { pic: ['eraser', 1] }], a: 0 },
  { q: 'ควรวัดความสูงของโรงเรียนเป็นหน่วยใด', opts: ['เมตร', 'เซนติเมตร', 'หน่วยคลิป'], a: 0 },
  { q: 'ผ้ายาว 20 ซม. เชือกยาว 18 ซม. ผ้ายาวกว่าเชือกอยู่กี่เซนติเมตร', opts: ['2 เซนติเมตร', '38 เซนติเมตร', '8 เซนติเมตร'], a: 0 },
  { q: 'ร้านค้าสูง 14 ม. ธนาคารสูง 4 ม. ร้านค้าสูงกว่าธนาคารกี่เมตร', opts: ['10 เมตร', '18 เมตร', '9 เมตร'], a: 0 },
  { q: 'โอ๊ตมีเชือกยาว 3 เมตร ซื้อมาต่ออีก 8 เมตร เชือกยาวรวมกี่เมตร', opts: ['11 เมตร', '5 เมตร', '10 เมตร'], a: 0 }
];
LESSONS_CH11.push({ id: 299, boss: true, title: 'ด่านบอส: บทที่ 11 การวัดความยาว', short: 'ด่านบอส · ข้อสอบ', tone: 'orange',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส', exam: spread(EXAM_CH11), pass: 8, bossName: 'ราชาปีศาจไม้บรรทัด', bossPal: 'orange', emblem: 'ซม.' });

/* =========================================================
   GRADE 1 · CHAPTER 12 — การบวกที่ผลบวกไม่เกิน 100 (เมืองบวกร้อย)
   ========================================================= */
const WS12_A1 = [[35, 4], [42, 7], [24, 2], [60, 5], [76, 3], [91, 1], [65, 2], [1, 74], [32, 7], [4, 54], [3, 32], [95, 3]];
const WS12_A1Q = [[55, 3], [6, 42], [25, 3], [0, 30], [1, 45], [34, 3], [32, 6], [70, 8], [0, 31], [52, 3], [33, 3], [41, 3], [6, 23], [72, 4], [2, 62], [81, 5], [20, 9], [50, 2], [22, 3], [7, 61], [71, 3], [80, 9], [45, 4], [31, 1], [40, 7], [62, 1]];
const WS12_A2 = [[22, 12], [61, 24], [35, 42], [48, 31], [33, 66], [54, 13], [81, 11], [45, 43], [27, 32]];
const WS12_A2Q = [[39, 30], [41, 33], [26, 32], [52, 21], [42, 25], [65, 24], [61, 31], [44, 43], [60, 18], [11, 70], [27, 22], [12, 16], [55, 41], [32, 53], [13, 24], [40, 30], [72, 26], [11, 23], [42, 13], [21, 62], [31, 31], [62, 35], [52, 27], [48, 31]];
const WS12_C1 = [[77, 6], [4, 38], [65, 5], [87, 5], [9, 49], [7, 39]];
const WS12_V = [[44, 5], [3, 22], [31, 8], [6, 12], [70, 7], [2, 81], [17, 2], [32, 3], [40, 6], [4, 23], [61, 5], [7, 11], [53, 6], [8, 20], [3, 91], [13, 23], [35, 44], [55, 32], [60, 15], [47, 51], [22, 14], [20, 20], [12, 24], [45, 34], [56, 33], [27, 72], [31, 26], [42, 21], [50, 37], [65, 30]];
const WS12_VC = [[9, 26], [72, 8], [55, 6], [37, 7], [8, 28], [6, 67], [43, 8], [36, 6], [9, 64], [82, 8], [3, 69], [88, 6], [31, 9], [36, 5], [7, 79], [15, 7], [24, 6], [8, 73], [44, 9], [3, 37], [67, 8], [9, 22], [26, 6], [7, 49],
  [28, 32], [37, 47], [59, 25], [48, 19], [45, 27], [29, 39], [59, 32], [75, 15], [26, 36], [29, 59], [58, 19], [44, 49], [51, 29], [22, 69], [47, 53], [68, 22], [15, 47], [56, 35], [18, 18], [37, 46], [25, 67], [55, 39], [73, 27], [44, 46]];
const WS12_C2 = [[59, 34], [25, 25], [77, 14], [46, 28], [33, 49], [65, 26], [13, 37], [27, 29], [19, 18], [53, 39], [27, 25], [72, 18], [56, 26], [39, 59], [14, 39], [45, 37], [55, 29], [19, 21], [48, 43], [77, 15], [26, 34], [39, 39], [49, 23], [15, 16], [45, 48], [23, 77]];
const WS12_MIX = [[34, 4], [43, 12], [27, 54], [36, 16], [78, 7], [35, 22], [62, 8], [38, 38], [18, 53], [54, 8], [93, 4], [49, 29], [56, 34], [28, 61], [9, 36], [39, 30], [46, 47], [28, 68]];
const pair = (list, k = 1) => shuffle(list).slice(0, k);
const T12 = [[35, 4], [65, 2], [22, 12], [48, 31], [77, 6], [87, 5], [35, 44], [3, 22], [37, 47], [47, 53]];
/* two numbers as rods + cubes → push together → regroup ten ones into one ten */
function addBlocksSim(a, b) {
  const ta = Math.floor(a / 10), ua = a % 10, tb = Math.floor(b / 10), ub = b % 10, vis = h('div', { class: 'rowstack cmpblk' }), eq = eqRow([a, '+', b, '=', '?']), note = h('div', { class: 'cap tm-note' });
  vis.append(h('div', { class: 'colstack' }, blocksTU(ta, ua, { labels: true }), h('b', { class: 'num' }, a)), h('b', { class: 'num cmpsign' }, '+'), h('div', { class: 'colstack' }, blocksTU(tb, ub, { labels: true }), h('b', { class: 'num' }, b)));
  let st = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++;
    if (st === 1) { vis.innerHTML = ''; vis.append(blocksTU(ta + tb, ua + ub, { labels: true })); vis.animate([{ transform: 'scale(.94)' }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.3,1.5,.5,1)' }); note.innerHTML = `สิบรวมกับสิบ: ${ta + tb} สิบ · หน่วยรวมกับหน่วย: ${ua + ub} หน่วย`; sfx.pop(3);
      if (ua + ub >= 10) { btn.lastChild.textContent = 'รวม 10 หน่วยเป็น 1 สิบ (ทด)'; say(`หน่วยรวมกันได้ ${WORD[ua + ub]} หน่วย ครบสิบแล้ว`, true); return; } }
    vis.innerHTML = ''; vis.append(blocksTU(Math.floor((a + b) / 10), (a + b) % 10, { labels: true })); if (st === 2) note.innerHTML = `10 หน่วยรวมเป็น <b>1 สิบ</b> ทดไปหลักสิบ → ${Math.floor((a + b) / 10)} สิบ ${(a + b) % 10} หน่วย`;
    eq.fill(a + b); btn.remove(); sfx.ok(); say(`${thaiWords(a)} บวก ${thaiWords(b)} เท่ากับ ${thaiWords(a + b)}`, true); } }, icon('plus'), h('span', null, 'รวมกัน'));
  return h('div', { class: 'colstack' }, vis, eq, note, btn);
}
/* step-by-step reveal of the split method */
function splitSim(a, b) {
  const big = Math.max(a, b), sm = Math.min(a, b), rows = [];
  if (sm < 10) { const t = Math.floor(big / 10) * 10, u = big % 10; rows.push(['ขั้นที่ 1 แยก', [big, '=', t, '+', u]], ['ขั้นที่ 2 บวกหน่วย', [u, '+', sm, '=', u + sm]], ['ขั้นที่ 3 รวม', [t, '+', u + sm, '=', a + b]]); }
  else { const ta = a - a % 10, tb = b - b % 10; rows.push(['ขั้นที่ 1 บวกสิบ', [ta, '+', tb, '=', ta + tb]], ['ขั้นที่ 2 บวกหน่วย', [a % 10, '+', b % 10, '=', a % 10 + b % 10]], ['ขั้นที่ 3 รวม', [ta + tb, '+', a % 10 + b % 10, '=', a + b]]); }
  const list = h('div', { class: 'colstack ms-rows' }); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, toks] = rows[k]; const r = h('div', { class: 'ms-row done' }, h('span', { class: 'ms-lab' }, lab), eqRow(toks, { sm: true })); r.style.animation = 'popIn .35s var(--spring)'; list.append(r); sfx.pop(k); say(`${toks[0]} ${toks[1] === '=' ? 'เท่ากับ' : 'บวก'} ${toks[2]} ${toks[3] === '=' ? 'เท่ากับ' : 'บวก'} ${toks[4]}`, true); k++; if (k >= rows.length) btn.remove(); } }, icon('right'), 'ทีละขั้น');
  return h('div', { class: 'colstack' }, eqRow([a, '+', b, '=', '?']), list, btn);
}
/* vertical addition walk-through */
function vertSim(a, b) {
  const us = a % 10 + b % 10, carry = us >= 10, lay = h('div'), note = h('div', { class: 'cap vnote' }, 'ตั้งหลักให้ตรงกัน: หลักหน่วยตรงหลักหน่วย หลักสิบตรงหลักสิบ'); let st = 0;
  const draw = show => { lay.innerHTML = ''; lay.append(vertLayout(a, b, { show })); }; draw({});
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++;
    if (st === 1) { draw({ ones: true, carry }); note.innerHTML = carry ? `① หลักหน่วย ${a % 10} + ${b % 10} = ${us} เขียน <b>${us % 10}</b> แล้ว<b>ทด 1</b> ไปหลักสิบ` : `① หลักหน่วย ${a % 10} + ${b % 10} = <b>${us}</b>`; btn.lastChild.textContent = 'บวกหลักสิบ'; sfx.pop(3); say(carry ? `หลักหน่วย ได้ ${WORD[us]} เขียน ${WORD[us % 10]} ทดหนึ่ง` : `หลักหน่วย ได้ ${WORD[us]}`, true); }
    else { draw({ ones: true, tens: true, carry }); const T = Math.floor((a + b) / 10); note.innerHTML = `② หลักสิบ ${Math.floor(a / 10)} + ${Math.floor(b / 10)}${carry ? ' + 1' : ''} = <b>${T}</b> · ตอบ <b>${a + b}</b>`; btn.remove(); sfx.ok(); say(`ตอบ ${thaiWords(a + b)}`, true); } } }, icon('right'), h('span', null, 'บวกหลักหน่วย'));
  return h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, lay, btn), h('div', { class: 'colstack' }, blocksTU(Math.floor(a / 10), a % 10, { sm: true }), blocksTU(Math.floor(b / 10), b % 10, { sm: true }), note));
}
const LESSONS_CH12 = [
  { id: 301, title: 'การบวกจำนวนสองหลักกับหนึ่งหลักที่ผลบวกไม่เกิน 100 ที่ไม่มีการทด', short: 'สองหลัก + หนึ่งหลัก', tone: 'sky',
    goal: 'หาผลบวกของจำนวนสองหลักกับจำนวนหนึ่งหลักที่ไม่มีการทด โดยบวกหลักหน่วยกับหลักหน่วย',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองบวกร้อย</b>! 35 + 4: นำ<b>หน่วยรวมกับหน่วย</b> สิบยังเท่าเดิม — กดรวมกัน', s: 'ยินดีต้อนรับสู่เมืองบวกร้อย สามสิบห้าบวกสี่ นำหน่วยรวมกับหน่วย สิบยังเท่าเดิม กดรวมกัน', v: el => el.append(addBlocksSim(35, 4)) },
      { t: 'คิดทีละขั้น: แยก 65 เป็น 60 + 5 → บวกหน่วย 5 + 2 = 7 → รวม 60 + 7 = 67', s: 'คิดทีละขั้น แยกหกสิบห้า เป็นหกสิบบวกห้า บวกหน่วยห้าบวกสองเท่ากับเจ็ด รวมหกสิบบวกเจ็ดเท่ากับหกสิบเจ็ด', v: el => el.append(splitSim(65, 2)) }
    ],
    game: () => { const p = shuffle(omit(WS12_A1, T12)), q = shuffle(omit(WS12_A1Q, T12)); return [Q.add100({ a: p[0][0], b: p[0][1], blocks: true }), Q.add100({ a: p[1][0], b: p[1][1], blocks: true }), Q.addSteps({ a: p[2][0], b: p[2][1] }), Q.addSteps({ a: p[3][0], b: p[3][1] }), ...q.slice(0, 3).map(([a, b]) => Q.add100({ a, b }))]; } },
  { id: 302, title: 'การบวกจำนวนสองหลักกับสองหลักที่ผลบวกไม่เกิน 100 ที่ไม่มีการทด', short: 'สองหลัก + สองหลัก', tone: 'coral',
    goal: 'หาผลบวกของจำนวนสองหลักกับจำนวนสองหลักที่ไม่มีการทด โดยบวกสิบกับสิบ และหน่วยกับหน่วย',
    teach: [
      { t: '22 + 12: <b>สิบรวมกับสิบ</b> หน่วยรวมกับหน่วย — กดรวมกัน', s: 'ยี่สิบสองบวกสิบสอง สิบรวมกับสิบ หน่วยรวมกับหน่วย กดรวมกัน', v: el => el.append(addBlocksSim(22, 12)) },
      { t: 'คิดทีละขั้น: 48 + 31 → 40 + 30 = 70 → 8 + 1 = 9 → 70 + 9 = 79', s: 'คิดทีละขั้น สี่สิบแปดบวกสามสิบเอ็ด', v: el => el.append(splitSim(48, 31)) }
    ],
    game: () => { const p = shuffle(omit(WS12_A2, T12)), q = shuffle(omit(WS12_A2Q, T12)); return [Q.add100({ a: p[0][0], b: p[0][1], blocks: true }), Q.addSteps({ a: p[1][0], b: p[1][1] }), Q.addSteps({ a: p[2][0], b: p[2][1] }), Q.addSteps({ a: p[3][0], b: p[3][1] }), ...q.slice(0, 3).map(([a, b]) => Q.add100({ a, b }))]; } },
  { id: 303, title: 'การบวกจำนวนสองหลักกับหนึ่งหลักที่ผลบวกไม่เกิน 100 มีการทด', short: 'บวกมีการทด', tone: 'mint',
    goal: 'หาผลบวกที่หน่วยรวมกันได้ 10 หรือมากกว่า โดยรวม 10 หน่วยเป็น 1 สิบ (การทด)',
    teach: [
      { t: '77 + 6: หน่วยรวมกันได้ 13 หน่วย <b>ครบ 10 หน่วยรวมเป็น 1 สิบ</b> เรียกว่า <b>การทด</b> — กดดูนะ', s: 'เจ็ดสิบเจ็ดบวกหก หน่วยรวมกันได้สิบสามหน่วย ครบสิบหน่วยรวมเป็นหนึ่งสิบ เรียกว่าการทด กดดูนะ', v: el => el.append(addBlocksSim(77, 6)) },
      { t: 'คิดทีละขั้น: 87 + 5 → 7 + 5 = 12 → 80 + 12 = 92', s: 'คิดทีละขั้น แปดสิบเจ็ดบวกห้า เจ็ดบวกห้าเท่ากับสิบสอง แปดสิบบวกสิบสองเท่ากับเก้าสิบสอง', v: el => el.append(splitSim(87, 5)) }
    ],
    game: () => { const p = shuffle(omit(WS12_C1, T12)), q = shuffle(WS12_VC.slice(0, 24)); return [Q.add100({ a: p[0][0], b: p[0][1], blocks: true }), Q.addSteps({ a: p[1][0], b: p[1][1] }), Q.addSteps({ a: p[2][0], b: p[2][1] }), Q.addSteps({ a: p[3][0], b: p[3][1] }), ...q.slice(0, 3).map(([a, b]) => Q.add100({ a, b }))]; } },
  { id: 304, title: 'การหาผลบวกโดยการตั้งบวกไม่มีการทด', short: 'ตั้งบวกไม่มีทด', tone: 'orange',
    goal: 'หาผลบวกโดยการตั้งบวก (หลักตรงกัน) บวกหลักหน่วยก่อน แล้วบวกหลักสิบ',
    teach: [
      { t: '<b>ตั้งบวก</b>: เขียนให้หลักตรงกัน แล้ว<b>บวกหลักหน่วยก่อน</b> จากนั้นบวกหลักสิบ', s: 'ตั้งบวก เขียนให้หลักตรงกัน แล้วบวกหลักหน่วยก่อน จากนั้นบวกหลักสิบ', v: el => el.append(vertSim(35, 44)) },
      { t: 'จำนวนหนึ่งหลักต้องอยู่ใน<b>หลักหน่วย</b> เสมอ: 3 + 22', s: 'จำนวนหนึ่งหลักต้องอยู่ในหลักหน่วยเสมอ', v: el => el.append(vertSim(3, 22)) }
    ],
    game: () => [...pair(omit(WS12_V, T12).slice(0, 15), 3).map(([a, b]) => Q.vertAdd({ a, b })), ...pair(omit(WS12_V, T12).slice(15), 3).map(([a, b]) => Q.vertAdd({ a, b }))] },
  { id: 305, title: 'การหาผลบวกโดยการตั้งบวกที่มีการทด', short: 'ตั้งบวกมีทด', tone: 'lilac',
    goal: 'หาผลบวกโดยการตั้งบวกที่มีการทด: หลักหน่วยรวมได้ 10 ขึ้นไป ทด 1 ไปหลักสิบ',
    teach: [
      { t: 'หลักหน่วยรวมได้ <b>10 ขึ้นไป</b>: เขียนหลักหน่วย แล้ว<b>ทด 1</b> ไว้บนหลักสิบ', s: 'หลักหน่วยรวมได้สิบขึ้นไป เขียนหลักหน่วย แล้วทดหนึ่งไว้บนหลักสิบ', v: el => el.append(vertSim(37, 47)) },
      { t: 'อย่าลืมบวกตัวทดในหลักสิบด้วย: 47 + 53 = 100', s: 'อย่าลืมบวกตัวทดในหลักสิบด้วย สี่สิบเจ็ดบวกห้าสิบสาม เท่ากับหนึ่งร้อย', v: el => el.append(vertSim(47, 53)) }
    ],
    game: () => [...pair(omit(WS12_VC, T12).slice(0, 24), 2).map(([a, b]) => Q.vertAdd({ a, b })), ...pair(omit(WS12_VC, T12).slice(24), 3).map(([a, b]) => Q.vertAdd({ a, b })), ...pair(omit(WS12_C2, T12), 1).map(([a, b]) => Q.add100({ a, b })), ...pair(omit(WS12_MIX, T12), 1).map(([a, b]) => Q.vertAdd({ a, b }))] }
];
const EXAM_CH12 = [
  { q: '35 + 4 = ☐', opts: ['39', '75', '31'], a: 0 },
  { q: '1 + 74 = ☐', opts: ['75', '84', '74'], a: 0 },
  { q: '61 + 24 = ☐', opts: ['85', '37', '84'], a: 0 },
  { q: '48 + 31 = ☐', opts: ['79', '17', '78'], a: 0 },
  { q: '40 + 30 = ☐', opts: ['70', '7', '43'], a: 0 },
  { q: '77 + 6 = ☐', opts: ['83', '73', '137'], a: 0 },
  { q: '9 + 49 = ☐', opts: ['58', '48', '139'], a: 0 },
  { q: 'ตั้งบวกแล้วได้ผลบวกเท่าไร', vert: [55, 32], opts: ['87', '78', '23'], a: 0 },
  { q: 'ตั้งบวกแล้วได้ผลบวกเท่าไร', vert: [2, 81], opts: ['83', '101', '38'], a: 0 },
  { q: 'ตั้งบวกแล้วได้ผลบวกเท่าไร', vert: [43, 8], opts: ['51', '41', '123'], a: 0 },
  { q: 'ตั้งบวกแล้วได้ผลบวกเท่าไร', vert: [28, 32], opts: ['60', '50', '510'], a: 0 },
  { q: '37 + 47 หลักหน่วยรวมกันได้ 14 ต้องเขียนอย่างไร', opts: ['เขียน 4 ทด 1', 'เขียน 14', 'เขียน 1 ทด 4'], a: 0 },
  { q: '59 + 34 = ☐', opts: ['93', '83', '813'], a: 0 },
  { q: '47 + 53 = ☐', opts: ['100', '90', '910'], a: 0 },
  { q: '25 + 67 = ☐', opts: ['92', '82', '812'], a: 0 }
];
LESSONS_CH12.push({ id: 309, boss: true, title: 'ด่านบอส: บทที่ 12 การบวกที่ผลบวกไม่เกิน 100', short: 'ด่านบอส · ข้อสอบ', tone: 'coral',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส', exam: spread(EXAM_CH12), pass: 8, bossName: 'ราชาปีศาจบวกร้อย', bossPal: 'coral', emblem: '+' });

/* =========================================================
   GRADE 1 · CHAPTER 13 — การลบจำนวนที่ตัวตั้งไม่เกิน 100 (เมืองลบร้อย)
   ========================================================= */
const WS13_1 = [[59, 5], [83, 2], [78, 8], [69, 8], [58, 5], [94, 4], [44, 1], [57, 3], [98, 7], [71, 1], [87, 5], [69, 6], [75, 3], [31, 1], [97, 4], [62, 1], [89, 6], [95, 1], [76, 4], [33, 3], [45, 4], [56, 2], [78, 3]];
const WS13_2 = [[71, 11], [98, 23], [83, 43], [56, 32], [80, 50], [64, 44], [76, 31], [82, 51], [85, 82], [90, 80], [66, 45], [83, 21], [75, 14], [68, 34], [99, 77], [35, 35], [26, 12], [69, 36], [77, 35], [83, 23], [58, 33], [56, 54]];
const WS13_B1 = [[70, 5], [94, 7], [61, 8], [57, 9], [22, 6], [84, 5], [61, 4], [42, 7], [30, 8], [51, 2], [65, 9], [22, 3], [73, 8], [40, 9], [30, 6], [74, 7], [53, 5]];
const WS13_B2 = [[50, 23], [64, 36], [84, 45], [51, 28], [42, 13], [95, 27], [75, 39], [91, 17], [53, 26], [30, 15], [83, 34], [75, 19], [32, 15], [41, 17], [95, 59], [87, 49], [72, 25], [63, 38], [54, 26], [97, 48], [85, 67], [48, 29], [84, 37], [60, 18], [92, 36], [55, 46], [73, 57], [40, 32], [32, 14], [93, 25]];
const WS13_V = [[24, 2], [19, 6], [35, 3], [98, 7], [47, 4], [58, 8], [67, 2], [43, 1], [76, 4], [29, 8], [68, 3], [59, 6], [35, 2], [47, 7], [14, 3], [26, 14], [37, 13], [45, 24], [59, 36], [86, 22], [97, 63], [72, 12], [68, 20], [59, 41]];
const WS13_MIX = [[68, 23], [43, 7], [75, 49], [90, 25], [39, 15], [83, 46], [62, 37], [98, 74], [75, 3], [32, 4], [81, 42], [57, 49], [70, 25], [63, 37], [74, 35], [60, 12], [64, 24], [44, 15], [90, 24], [67, 39], [42, 39], [80, 41], [83, 55], [84, 79], [40, 24], [73, 57], [64, 35]];
const WS13_FAM = [[56, 23], [32, 39], [47, 8], [26, 15], [46, 34], [33, 59]];
const WS13_X1 = [['?', '−', 13, '=', 54], [49, '+', '?', '=', 88], ['?', '+', 46, '=', 71], [84, '−', '?', '=', 75], [11, '+', '?', '=', 74], ['?', '−', 28, '=', 30], [50, '−', '?', '=', 33], ['?', '+', 36, '=', 72], ['?', '−', 39, '=', 29], ['?', '+', 38, '=', 43]];
const WS13_X2 = [[58, '+', '?', '=', 68], [60, '−', '?', '=', 34], ['?', '+', 25, '=', 50], [77, '+', '?', '=', 94], ['?', '−', 26, '=', 4], [61, '+', '?', '=', 90], ['?', '+', 28, '=', 51], ['?', '−', 57, '=', 29], ['?', '−', 44, '=', 18]];
/* take away with rods and cubes; regroup one ten into ten ones when the ones are not enough */
function subBlocksSim(a, b) {
  let t = Math.floor(a / 10), u = a % 10; const tb = Math.floor(b / 10), ub = b % 10, vis = h('div', { class: 'rowstack cmpblk' }), eq = eqRow([a, '−', b, '=', '?']), note = h('div', { class: 'cap tm-note' }, `มี ${t} สิบ ${u} หน่วย ต้องเอาออก ${tb ? tb + ' สิบ ' : ''}${ub} หน่วย`);
  const draw = o => { vis.innerHTML = ''; vis.append(blocksTU(t, u, { labels: true, sub: true, ...o })); }; draw({});
  let st = u < ub ? 0 : 1;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation();
    if (st === 0) { t--; u += 10; draw({}); vis.animate([{ transform: 'scale(.95)' }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.3,1.5,.5,1)' }); note.innerHTML = `หน่วยไม่พอ → <b>กระจาย 1 สิบ เป็น 10 หน่วย</b> ได้ ${t} สิบ ${u} หน่วย`; btn.lastChild.textContent = `เอาออก ${b}`; sfx.pop(4); say('หน่วยไม่พอ กระจายหนึ่งสิบ เป็นสิบหน่วย', true); st = 1; return; }
    if (st === 1) { draw({ xT: tb, xU: ub }); note.innerHTML = `เอาออก ${tb ? tb + ' สิบ ' : ''}${ub} หน่วย`; btn.lastChild.textContent = 'ดูที่เหลือ'; sfx.pop(2); st = 2; return; }
    t -= tb; u -= ub; draw({}); eq.fill(a - b); note.innerHTML = `เหลือ ${t} สิบ ${u} หน่วย = <b>${a - b}</b>`; btn.remove(); sfx.ok(); say(`${thaiWords(a)} ลบ ${thaiWords(b)} เท่ากับ ${thaiWords(a - b)}`, true); } }, icon('right'), h('span', null, st === 0 ? 'กระจาย 1 สิบ' : `เอาออก ${b}`));
  return h('div', { class: 'colstack' }, vis, eq, note, btn);
}
function subSplitSim(a, b) {
  const ta = a - a % 10, ua = a % 10, tb = b - b % 10, ub = b % 10, rows = [];
  if (ua >= ub) { if (b < 10) rows.push(['ลบหน่วย', [ua, '−', ub, '=', ua - ub]], ['รวม', [ta, '+', ua - ub, '=', a - b]]); else rows.push(['ลบสิบ', [ta, '−', tb, '=', ta - tb]], ['ลบหน่วย', [ua, '−', ub, '=', ua - ub]], ['รวม', [ta - tb, '+', ua - ub, '=', a - b]]); }
  else { rows.push(['กระจาย', [a, '=', ta - 10, '+', ua + 10]], ['ลบหน่วย', [ua + 10, '−', ub, '=', ua + 10 - ub]]); if (b < 10) rows.push(['รวม', [ta - 10, '+', ua + 10 - ub, '=', a - b]]); else rows.push(['ลบสิบ', [ta - 10, '−', tb, '=', ta - 10 - tb]], ['รวม', [ta - 10 - tb, '+', ua + 10 - ub, '=', a - b]]); }
  const list = h('div', { class: 'colstack ms-rows' }); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, toks] = rows[k]; const r = h('div', { class: 'ms-row done' }, h('span', { class: 'ms-lab' }, `ขั้นที่ ${k + 1} ${lab}`), eqRow(toks, { sm: true })); r.style.animation = 'popIn .35s var(--spring)'; list.append(r); sfx.pop(k); k++; if (k >= rows.length) { btn.remove(); say(`${thaiWords(a)} ลบ ${thaiWords(b)} เท่ากับ ${thaiWords(a - b)}`, true); } } }, icon('right'), 'ทีละขั้น');
  return h('div', { class: 'colstack' }, eqRow([a, '−', b, '=', '?']), list, btn);
}
function vertSubSim(a, b) {
  const borrow = a % 10 < b % 10, lay = h('div'), note = h('div', { class: 'cap vnote' }, 'ตั้งหลักให้ตรงกัน แล้วลบหลักหน่วยก่อน'); let st = 0;
  const draw = show => { lay.innerHTML = ''; lay.append(vertSubLayout(a, b, { show })); }; draw({});
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); st++;
    if (st === 1) { draw({ ones: true, borrow }); note.innerHTML = borrow ? `① ${a % 10} ลบ ${b % 10} ไม่ได้ → <b>กระจาย 1 สิบ</b> หลักหน่วยเป็น ${a % 10 + 10} · ${a % 10 + 10} − ${b % 10} = <b>${(a - b) % 10}</b>` : `① หลักหน่วย ${a % 10} − ${b % 10} = <b>${(a - b) % 10}</b>`; btn.lastChild.textContent = 'ลบหลักสิบ'; sfx.pop(3); say(note.textContent, true); }
    else { draw({ ones: true, tens: true, borrow }); note.innerHTML = `② หลักสิบ ${Math.floor(a / 10) - (borrow ? 1 : 0)} − ${Math.floor(b / 10)} = <b>${Math.floor((a - b) / 10)}</b> · ตอบ <b>${a - b}</b>`; btn.remove(); sfx.ok(); say(`ตอบ ${thaiWords(a - b)}`, true); } } }, icon('right'), h('span', null, 'ลบหลักหน่วย'));
  return h('div', { class: 'rowstack' }, h('div', { class: 'colstack' }, lay, btn), h('div', { class: 'colstack' }, blocksTU(Math.floor(a / 10), a % 10, { sm: true }), note));
}
function famSim(a, b) {
  const c = a + b, rows = [[a, '+', b, '=', c], [b, '+', a, '=', c], [c, '−', a, '=', b], [c, '−', b, '=', a]], list = h('div', { class: 'colstack ms-rows' }); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const r = eqRow(rows[k], { sm: true }); r.style.animation = 'popIn .35s var(--spring)'; list.append(r); sfx.pop(k); k++; if (k >= 4) { btn.remove(); say('ครอบครัวเดียวกัน บวกกลับเป็นลบได้', true); } } }, icon('plus'), 'สร้างประโยคในครอบครัว');
  return h('div', { class: 'rowstack' }, barModel({ parts: [a, b], labels: ['', ''] }), h('div', { class: 'colstack' }, list, btn));
}
const pk = (list, k) => shuffle(list).slice(0, k);
const LESSONS_CH13 = [
  { id: 311, title: 'การลบจำนวนสองหลักกับหนึ่งหลักที่ไม่มีการกระจาย', short: 'สองหลัก − หนึ่งหลัก', tone: 'sky',
    goal: 'หาผลลบของจำนวนสองหลักกับจำนวนหนึ่งหลักที่ไม่มีการกระจาย',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองลบร้อย</b>! 47 − 3: เอาออกเฉพาะ<b>หน่วย</b> สิบยังเท่าเดิม — กดเอาออก', s: 'ยินดีต้อนรับสู่เมืองลบร้อย สี่สิบเจ็ดลบสาม เอาออกเฉพาะหน่วย สิบยังเท่าเดิม', v: el => el.append(subBlocksSim(47, 3)) },
      { t: 'คิดทีละขั้น: ลบหน่วยก่อน แล้วรวมกับสิบ', s: 'คิดทีละขั้น ลบหน่วยก่อน แล้วรวมกับสิบ', v: el => el.append(subSplitSim(86, 4)) }
    ],
    game: () => { const p = pk(WS13_1, 7); return [Q.sub100({ a: p[0][0], b: p[0][1], blocks: true }), Q.subSteps({ a: p[1][0], b: p[1][1] }), Q.subSteps({ a: p[2][0], b: p[2][1] }), ...p.slice(3).map(([a, b]) => Q.sub100({ a, b }))]; } },
  { id: 312, title: 'การลบจำนวนสองหลักกับสองหลักที่ไม่มีการกระจาย', short: 'สองหลัก − สองหลัก', tone: 'coral',
    goal: 'หาผลลบของจำนวนสองหลักกับจำนวนสองหลักที่ไม่มีการกระจาย โดยลบสิบกับสิบ หน่วยกับหน่วย',
    teach: [
      { t: '87 − 43: เอาออก<b>4 สิบ</b> และ<b>3 หน่วย</b>', s: 'แปดสิบเจ็ดลบสี่สิบสาม เอาออกสี่สิบ และสามหน่วย', v: el => el.append(subBlocksSim(87, 43)) },
      { t: 'คิดทีละขั้น: สิบลบสิบ หน่วยลบหน่วย แล้วรวมกัน', s: 'คิดทีละขั้น สิบลบสิบ หน่วยลบหน่วย แล้วรวมกัน', v: el => el.append(subSplitSim(79, 52)) }
    ],
    game: () => { const p = pk(WS13_2, 7); return [Q.sub100({ a: p[0][0], b: p[0][1], blocks: true }), Q.subSteps({ a: p[1][0], b: p[1][1] }), Q.subSteps({ a: p[2][0], b: p[2][1] }), ...p.slice(3).map(([a, b]) => Q.sub100({ a, b }))]; } },
  { id: 313, title: 'การลบจำนวนสองหลักกับหนึ่งหลักมีการกระจาย', short: 'ลบมีการกระจาย', tone: 'mint',
    goal: 'หาผลลบที่หน่วยของตัวตั้งน้อยกว่าตัวลบ โดยกระจาย 1 สิบ เป็น 10 หน่วย',
    teach: [
      { t: '52 − 7: 2 หน่วยเอาออก 7 ไม่ได้ → <b>กระจาย 1 สิบ เป็น 10 หน่วย</b> แล้วค่อยเอาออก', s: 'ห้าสิบสองลบเจ็ด สองหน่วยเอาออกเจ็ดไม่ได้ กระจายหนึ่งสิบเป็นสิบหน่วย แล้วค่อยเอาออก', v: el => el.append(subBlocksSim(52, 7)) },
      { t: 'คิดทีละขั้น: 63 = 50 + 13 → 13 − 5 = 8 → 50 + 8 = 58', s: 'คิดทีละขั้น หกสิบสาม เท่ากับ ห้าสิบบวกสิบสาม', v: el => el.append(subSplitSim(63, 5)) }
    ],
    game: () => { const p = pk(WS13_B1, 7); return [Q.sub100({ a: p[0][0], b: p[0][1], blocks: true }), Q.subSteps({ a: p[1][0], b: p[1][1] }), Q.subSteps({ a: p[2][0], b: p[2][1] }), ...p.slice(3).map(([a, b]) => Q.sub100({ a, b }))]; } },
  { id: 314, title: 'การลบจำนวนสองหลักกับสองหลักมีการกระจาย', short: 'สองหลักมีการกระจาย', tone: 'orange',
    goal: 'หาผลลบของจำนวนสองหลักกับสองหลักที่มีการกระจาย',
    teach: [
      { t: '62 − 27: กระจาย 1 สิบก่อน แล้วเอาออก 2 สิบ 7 หน่วย', s: 'หกสิบสองลบยี่สิบเจ็ด กระจายหนึ่งสิบก่อน แล้วเอาออกสองสิบ เจ็ดหน่วย', v: el => el.append(subBlocksSim(62, 27)) },
      { t: 'คิดทีละขั้น: กระจาย → ลบหน่วย → ลบสิบ → รวม', s: 'คิดทีละขั้น กระจาย ลบหน่วย ลบสิบ รวม', v: el => el.append(subSplitSim(71, 36)) }
    ],
    game: () => { const p = pk(WS13_B2, 7); return [Q.sub100({ a: p[0][0], b: p[0][1], blocks: true }), Q.subSteps({ a: p[1][0], b: p[1][1] }), Q.subSteps({ a: p[2][0], b: p[2][1] }), ...p.slice(3).map(([a, b]) => Q.sub100({ a, b }))]; } },
  { id: 315, title: 'การหาผลลบโดยการตั้งลบไม่มีการกระจาย', short: 'ตั้งลบไม่มีกระจาย', tone: 'lilac',
    goal: 'หาผลลบโดยการตั้งลบ หลักตรงกัน ลบหลักหน่วยก่อน แล้วลบหลักสิบ',
    teach: [
      { t: '<b>ตั้งลบ</b>: หลักหน่วยตรงหลักหน่วย หลักสิบตรงหลักสิบ แล้ว<b>ลบหลักหน่วยก่อน</b>', s: 'ตั้งลบ หลักหน่วยตรงหลักหน่วย หลักสิบตรงหลักสิบ แล้วลบหลักหน่วยก่อน', v: el => el.append(vertSubSim(58, 23)) },
      { t: 'ตัวลบหนึ่งหลักต้องอยู่ใน<b>หลักหน่วย</b>', s: 'ตัวลบหนึ่งหลักต้องอยู่ในหลักหน่วย', v: el => el.append(vertSubSim(39, 6)) }
    ],
    game: () => pk(WS13_V, 6).map(([a, b]) => Q.vertSub({ a, b })) },
  { id: 316, title: 'การหาผลลบโดยการตั้งลบมีการกระจาย', short: 'ตั้งลบมีกระจาย', tone: 'yellow',
    goal: 'หาผลลบโดยการตั้งลบที่มีการกระจาย: ขีดฆ่าหลักสิบ ลดลง 1 และหลักหน่วยเพิ่มขึ้น 10',
    teach: [
      { t: 'หลักหน่วยไม่พอลบ: <b>ขีดฆ่าหลักสิบ เขียนลดลง 1</b> และหลักหน่วยเพิ่ม 10', s: 'หลักหน่วยไม่พอลบ ขีดฆ่าหลักสิบ เขียนลดลงหนึ่ง และหลักหน่วยเพิ่มสิบ', v: el => el.append(vertSubSim(52, 17)) },
      { t: 'ตัวตั้งลงท้ายด้วย 0 ก็กระจายได้: 80 − 34', s: 'ตัวตั้งลงท้ายด้วยศูนย์ก็กระจายได้ แปดสิบลบสามสิบสี่', v: el => el.append(vertSubSim(80, 34)) }
    ],
    game: () => [...pk(WS13_B1, 2), ...pk(WS13_B2, 3), ...pk(WS13_MIX, 2)].map(([a, b]) => Q.vertSub({ a, b })) },
  { id: 317, title: 'ความสัมพันธ์ของการบวกและการลบ', short: 'บวกกับลบสัมพันธ์กัน', tone: 'sky',
    goal: 'ใช้ความสัมพันธ์ของการบวกและการลบ เขียนประโยคการลบจากประโยคการบวก',
    teach: [
      { t: 'ส่วนย่อย 2 ส่วนรวมกันเป็นส่วนรวม: จาก <b>45 + 28 = 73</b> ได้ <b>73 − 45 = 28</b> และ <b>73 − 28 = 45</b>', s: 'จาก สี่สิบห้าบวกยี่สิบแปดเท่ากับเจ็ดสิบสาม ได้ เจ็ดสิบสามลบสี่สิบห้าเท่ากับยี่สิบแปด', v: el => el.append(famSim(45, 28)) },
      { t: 'ตัวอย่างที่ 2 (ไม่มีทด): จาก <b>30 + 25 = 55</b> เขียนการลบได้ 2 ประโยค — กดดูทีละขั้น', s: 'ตัวอย่างที่สอง จากสามสิบบวกยี่สิบห้าเท่ากับห้าสิบห้า เขียนการลบได้สองประโยค', v: el => el.append(famSim(30, 25)) }
    ],
    game: () => [...pk(WS13_FAM, 4).map(([a, b]) => Q.factFam({ a, b })), Q.factFam({ a: rnd(21, 49), b: rnd(11, 39) }), Q.factFam({ a: rnd(21, 49), b: rnd(11, 39) })] },
  { id: 318, title: 'การหาค่าของตัวไม่ทราบค่า (1)', short: 'ตัวไม่ทราบค่า (1)', tone: 'coral',
    goal: 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การบวกและการลบ',
    teach: [
      { t: '<b>? − 12 = 30</b>: เอาออก 12 แล้วเหลือ 30 → เดิมมี 30 + 12 = <b>42</b>', s: 'ช่องว่างลบสิบสองเท่ากับสามสิบ เดิมมีสามสิบบวกสิบสองเท่ากับสี่สิบสอง', v: el => el.append(barModel({ whole: 42, parts: [30, 12], labels: ['เหลือ', 'เอาออก'], q: 'whole' })) },
      { t: '<b>25 + ? = 60</b>: ส่วนรวม 60 รู้ส่วนหนึ่ง 25 → อีกส่วน 60 − 25 = <b>35</b>', s: 'ยี่สิบห้าบวกช่องว่างเท่ากับหกสิบ อีกส่วน หกสิบลบยี่สิบห้าเท่ากับสามสิบห้า', v: el => el.append(barModel({ whole: 60, parts: [25, 35], labels: ['', ''], q: 1 })) }
    ],
    game: () => pk(WS13_X1, 7).map(toks => Q.findX({ toks })) },
  { id: 319, title: 'การหาค่าของตัวไม่ทราบค่า (2)', short: 'ตัวไม่ทราบค่า (2)', tone: 'mint',
    goal: 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์ที่มีการทดหรือการกระจาย',
    teach: [
      { t: '<b>70 − ? = 26</b>: เอาออกไปเท่าไรจึงเหลือ 26 → 70 − 26 = <b>44</b>', s: 'เจ็ดสิบลบช่องว่างเท่ากับยี่สิบหก เจ็ดสิบลบยี่สิบหกเท่ากับสี่สิบสี่', v: el => el.append(barModel({ whole: 70, parts: [44, 26], labels: ['เอาออก', 'เหลือ'], q: 0 })) },
      { t: '<b>? + 18 = 53</b>: ส่วนรวม 53 รู้ส่วนหนึ่ง 18 → อีกส่วน 53 − 18 = <b>35</b> (กระจาย 1 สิบ)', s: 'ช่องว่างบวกสิบแปดเท่ากับห้าสิบสาม ห้าสิบสามลบสิบแปดเท่ากับสามสิบห้า', v: el => el.append(h('div', { class: 'colstack' }, barModel({ whole: 53, parts: [35, 18], labels: ['', ''], q: 0 }), vertSubSim(53, 18))) }
    ],
    game: () => pk(WS13_X2, 7).map(toks => Q.findX({ toks })) }
];
const EXAM_CH13 = [
  { q: '59 − 5 = ☐', opts: ['54', '64', '9'], a: 0 },
  { q: '98 − 23 = ☐', opts: ['75', '121', '74'], a: 0 },
  { q: '35 − 35 = ☐', opts: ['0', '70', '35'], a: 0 },
  { q: '61 − 8 = ☐', opts: ['53', '57', '47'], a: 0 },
  { q: '50 − 23 = ☐', opts: ['27', '33', '37'], a: 0 },
  { q: '84 − 45 = ☐', opts: ['39', '41', '49'], a: 0 },
  { q: 'ตั้งลบแล้วได้ผลลบเท่าไร', vsub: [97, 63], opts: ['34', '43', '160'], a: 0 },
  { q: 'ตั้งลบแล้วได้ผลลบเท่าไร', vsub: [57, 9], opts: ['48', '52', '58'], a: 0 },
  { q: 'ตั้งลบแล้วได้ผลลบเท่าไร', vsub: [92, 36], opts: ['56', '64', '66'], a: 0 },
  { q: '42 − 7 หน่วยไม่พอลบ ต้องทำอย่างไร', opts: ['กระจาย 1 สิบ เป็น 10 หน่วย', 'ลบ 7 − 2 แทน', 'ทด 1 ไปหลักสิบ'], a: 0 },
  { q: '56 + 23 = 79 ดังนั้น 79 − 56 = ☐', opts: ['23', '79', '33'], a: 0 },
  { q: '47 + ☐ = 55', opts: ['8', '18', '102'], a: 0 },
  { q: '☐ − 13 = 54', opts: ['67', '41', '57'], a: 0 },
  { q: '50 − ☐ = 33', opts: ['17', '27', '83'], a: 0 },
  { q: '☐ + 28 = 51', opts: ['23', '79', '33'], a: 0 }
];
LESSONS_CH13.push({ id: 329, boss: true, title: 'ด่านบอส: บทที่ 13 การลบจำนวนที่ตัวตั้งไม่เกิน 100', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส', exam: spread(EXAM_CH13), pass: 8, bossName: 'ราชาปีศาจลบร้อย', bossPal: 'sky', emblem: '−' });

/* =========================================================
   GRADE 1 · CHAPTER 14 — โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ (เมืองโจทย์)
   ========================================================= */
const ST = (text, a, b, op, unit) => ({ text, a, b, op, unit });
const WS14P = {
  add1: [ST('บัวเก็บมะยมได้ 2 ผล เก็บมะเฟืองได้มากกว่ามะยม 26 ผล บัวเก็บมะเฟืองได้กี่ผล', 2, 26, '+', 'ผล'), ST('ในกระเป๋าของแนนมีเงิน 80 บาท ของโจมี 10 บาท สองคนมีเงินรวมกันกี่บาท', 80, 10, '+', 'บาท'), ST('โบ๊ทมีลูกแก้ว 21 ลูก เพื่อนให้มาอีก 7 ลูก โบ๊ทมีลูกแก้วรวมกี่ลูก', 21, 7, '+', 'ลูก'), ST('ในฟาร์มมีไก่ 32 ตัว เป็ด 25 ตัว มีไก่และเป็ดรวมกันกี่ตัว', 32, 25, '+', 'ตัว'), ST('แม่ทำขนม 45 ชิ้น ทำเพิ่มอีก 12 ชิ้น แม่ทำขนมทั้งหมดกี่ชิ้น', 45, 12, '+', 'ชิ้น')],
  add2: [ST('ตะกร้าของยายมีไข่เป็ด 35 ฟอง และไข่ไก่ 53 ฟอง มีไข่รวมกี่ฟอง', 35, 53, '+', 'ฟอง'), ST('หมวกราคา 50 บาท รองเท้าแตะแพงกว่าหมวก 15 บาท รองเท้าแตะราคากี่บาท', 50, 15, '+', 'บาท'), ST('ฝ้ายเก็บเงินได้ 24 บาท พ่อให้มาอีก 16 บาท ฝ้ายมีเงินรวมกี่บาท', 24, 16, '+', 'บาท'), ST('ลุงปลูกต้นลำไย 25 ต้น ปลูกต้นมะพร้าว 10 ต้น ลุงปลูกต้นไม้รวมกี่ต้น', 25, 10, '+', 'ต้น'), ST('ห้องเรียนมีสมุด 58 เล่ม ครูนำมาเพิ่มอีก 27 เล่ม มีสมุดทั้งหมดกี่เล่ม', 58, 27, '+', 'เล่ม')],
  sub1: [ST('ร้านผลไม้มีส้ม 70 ผล ขายออกไป 46 ผล ร้านเหลือส้มกี่ผล', 70, 46, '-', 'ผล'), ST('ฟาร์มมีแพะ 47 ตัว แกะ 15 ตัว แพะมากกว่าแกะกี่ตัว', 47, 15, '-', 'ตัว'), ST('แปลงผักแปลงแรกมีหัวไชเท้า 25 หัว แปลงที่สองมีน้อยกว่าแปลงแรก 8 หัว แปลงที่สองมีหัวไชเท้ากี่หัว', 25, 8, '-', 'หัว'), ST('ร้านมีลูกโป่ง 67 ลูก ขายไป 35 ลูก เหลือลูกโป่งกี่ลูก', 67, 35, '-', 'ลูก'), ST('บอลมีสติกเกอร์ 39 แผ่น ให้น้อง 16 แผ่น บอลเหลือสติกเกอร์กี่แผ่น', 39, 16, '-', 'แผ่น')],
  sub2: [ST('ร้านผลไม้รับมะละกอสุกมา 70 กิโลกรัม มะละกอดิบ 39 กิโลกรัม มะละกอสุกมากกว่ามะละกอดิบกี่กิโลกรัม', 70, 39, '-', 'กิโลกรัม'), ST('ร้านส้มตำมีมะนาว 45 ลูก ใช้ไปในวันนี้ 30 ลูก เหลือมะนาวกี่ลูก', 45, 30, '-', 'ลูก'), ST('ร้านดอกไม้มีริบบิ้น 83 เมตร ใช้ห่อช่อดอกไม้ไป 26 เมตร เหลือริบบิ้นกี่เมตร', 83, 26, '-', 'เมตร'), ST('ต้นกล้วยสูง 80 เซนติเมตร น้องเล็กสูง 64 เซนติเมตร ต้นกล้วยสูงกว่าน้องเล็กกี่เซนติเมตร', 80, 64, '-', 'เซนติเมตร'), ST('ห้องสมุดมีหนังสือนิทาน 71 เล่ม มีคนยืมไป 26 เล่ม เหลือหนังสือนิทานกี่เล่ม', 71, 26, '-', 'เล่ม')],
  p1: [ST('แพะหนัก 30 กิโลกรัม แกะหนัก 33 กิโลกรัม ถ้าชั่งรวมกันจะหนักกี่กิโลกรัม', 30, 33, '+', 'กิโลกรัม'), ST('ก้องมีเงิน 71 บาท ซื้อหมวกไป 33 บาท ก้องเหลือเงินกี่บาท', 71, 33, '-', 'บาท'), ST('ร้านเสื้อขายไปแล้ว 35 ตัว ยังเหลือในร้าน 40 ตัว ตอนแรกร้านมีเสื้อกี่ตัว', 35, 40, '+', 'ตัว'), ST('ต้นไม้สูง 68 เซนติเมตร ตัดกิ่งออก 15 เซนติเมตร ต้นไม้สูงเท่าไร', 68, 15, '-', 'เซนติเมตร'), ST('ป้าเก็บไข่ได้ 27 ฟอง เก็บได้อีก 38 ฟอง ป้าเก็บไข่ได้ทั้งหมดกี่ฟอง', 27, 38, '+', 'ฟอง')],
  p2: [ST('ไม้บรรทัดสีเขียวยาว 37 เซนติเมตร ไม้บรรทัดสีเหลืองยาว 28 เซนติเมตร สีเหลืองสั้นกว่าสีเขียวกี่เซนติเมตร', 37, 28, '-', 'เซนติเมตร'), ST('ต้นกล้าสูง 56 เซนติเมตร ต้นข้าวสูงกว่าต้นกล้า 7 เซนติเมตร ต้นข้าวสูงเท่าไร', 56, 7, '+', 'เซนติเมตร'), ST('วันจันทร์โอมหยอดกระปุก 57 บาท วันอังคารหยอดอีก 39 บาท สองวันโอมหยอดกระปุกรวมกี่บาท', 57, 39, '+', 'บาท'), ST('รถบัสมีผู้โดยสาร 52 คน ลงที่ป้ายแรก 18 คน เหลือผู้โดยสารกี่คน', 52, 18, '-', 'คน'), ST('กล่องใบเล็กหนัก 27 กิโลกรัม กล่องใบใหญ่หนักกว่า 18 กิโลกรัม กล่องใบใหญ่หนักกี่กิโลกรัม', 27, 18, '+', 'กิโลกรัม')],
  p3: [ST('ชมรมว่ายน้ำมีสมาชิกหญิง 45 คน สมาชิกชาย 44 คน ชมรมนี้มีสมาชิกทั้งหมดกี่คน', 45, 44, '+', 'คน'), ST('ครูต้องใช้ปากกา 45 ด้าม ตอนนี้มี 32 ด้าม ต้องซื้อเพิ่มอีกกี่ด้าม', 45, 32, '-', 'ด้าม'), ST('บิ๊กพกเงินมา 50 บาท เงินหล่นหาย 12 บาท บิ๊กเหลือเงินกี่บาท', 50, 12, '-', 'บาท'), ST('สวนมีต้นกุหลาบ 24 ต้น ปลูกเพิ่มอีก 49 ต้น สวนมีต้นกุหลาบทั้งหมดกี่ต้น', 24, 49, '+', 'ต้น'), ST('นิดต้องการพับนกกระดาษ 60 ตัว พับแล้ว 37 ตัว ต้องพับอีกกี่ตัว', 60, 37, '-', 'ตัว')],
  p4: [ST('ริบบิ้นสีม่วงและสีเหลืองมีทั้งหมด 96 เส้น เป็นสีเหลือง 45 เส้น เป็นสีม่วงกี่เส้น', 96, 45, '-', 'เส้น'), ST('เป็ดว่ายน้ำในบ่อ 70 ตัว อยู่บนฝั่งอีก 21 ตัว มีเป็ดทั้งหมดกี่ตัว', 70, 21, '+', 'ตัว'), ST('ตู้ปลาของต้นข้าวมีปลา 51 ตัว ใส่ปลาเพิ่ม 32 ตัว ตู้นี้มีปลาทั้งหมดกี่ตัว', 51, 32, '+', 'ตัว'), ST('มีลูกแก้ว 90 ลูก เป็นสีฟ้า 57 ลูก ที่เหลือเป็นสีเขียว มีลูกแก้วสีเขียวกี่ลูก', 90, 57, '-', 'ลูก'), ST('ห้องหนึ่งมีนักเรียน 34 คน อีกห้องมี 39 คน สองห้องมีนักเรียนรวมกันกี่คน', 34, 39, '+', 'คน')]
};
const WS14_MAKE = [{ a: 85, b: 13, op: '+', stories: ['มีปลา 85 ตัว ซื้อมาเพิ่ม 13 ตัว มีปลาทั้งหมดกี่ตัว', 'มีปลา 85 ตัว ให้เพื่อนไป 13 ตัว เหลือปลากี่ตัว', 'มีปลา 58 ตัว ซื้อมาเพิ่ม 31 ตัว มีปลาทั้งหมดกี่ตัว'] },
  { a: 57, b: 29, op: '-', stories: ['มีลูกอม 57 เม็ด กินไป 29 เม็ด เหลือลูกอมกี่เม็ด', 'มีลูกอม 57 เม็ด ซื้อเพิ่ม 29 เม็ด มีลูกอมทั้งหมดกี่เม็ด', 'มีลูกอม 75 เม็ด กินไป 29 เม็ด เหลือลูกอมกี่เม็ด'] },
  { a: 36, b: 25, op: '+', stories: ['ห้องหนึ่งมีเก้าอี้ 36 ตัว อีกห้องมี 25 ตัว มีเก้าอี้รวมกันกี่ตัว', 'มีเก้าอี้ 36 ตัว ยกออกไป 25 ตัว เหลือเก้าอี้กี่ตัว', 'มีเก้าอี้ 63 ตัว อีกห้องมี 25 ตัว มีเก้าอี้รวมกันกี่ตัว'] },
  { a: 80, b: 45, op: '-', stories: ['แม่มีเงิน 80 บาท ซื้อผลไม้ 45 บาท แม่เหลือเงินกี่บาท', 'แม่มีเงิน 80 บาท ได้เพิ่มอีก 45 บาท แม่มีเงินกี่บาท', 'แม่มีเงิน 80 บาท ซื้อผลไม้ 54 บาท แม่เหลือเงินกี่บาท'] }];
/* teach: read the story, see the bar model, then reveal the sentence and the answer */
function storySim(st) {
  const ans = st.op === '+' ? st.a + st.b : st.a - st.b, out = h('div', { class: 'colstack' }), model = storyModel(st);
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); btn.remove(); out.append(eqRow([st.a, st.op === '+' ? '+' : '−', st.b, '=', ans]), h('div', { class: 'cap' }, `ตอบ ${ans} ${st.unit}`)); sfx.ok(); say(`ตอบ ${thaiWords(ans)} ${st.unit}`, true); } }, icon('eye'), 'เขียนประโยคสัญลักษณ์');
  return h('div', { class: 'colstack' }, h('div', { class: 'storybox' }, st.text), model, btn, out);
}
const SQ = list => list.map(st => Q.story100(st));
const LESSONS_CH14 = [
  { id: 331, title: 'สถานการณ์การบวก (1)', short: 'สถานการณ์การบวก (1)', tone: 'sky',
    goal: 'เขียนประโยคสัญลักษณ์การบวกจากสถานการณ์ รวมกัน เพิ่มขึ้น และมากกว่า',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>เมืองโจทย์</b>! <b>รวมกัน</b> ใช้การบวก — ส่วนย่อย 2 ส่วนรวมเป็นส่วนรวม', s: 'ยินดีต้อนรับสู่เมืองโจทย์ รวมกัน ใช้การบวก ส่วนย่อยสองส่วนรวมเป็นส่วนรวม', v: el => el.append(storySim(ST('มีดินสอสีแดง 24 แท่ง สีฟ้า 31 แท่ง มีดินสอรวมกันกี่แท่ง', 24, 31, '+', 'แท่ง'))) },
      { t: '<b>มากกว่า</b> ก็ใช้การบวก: นำจำนวนที่น้อยกว่ามาบวกส่วนที่มากกว่า', s: 'มากกว่า ก็ใช้การบวก นำจำนวนที่น้อยกว่ามาบวกส่วนที่มากกว่า', v: el => el.append(storySim(ST('น้องมีสติกเกอร์ 15 ดวง พี่มีมากกว่าน้อง 20 ดวง พี่มีสติกเกอร์กี่ดวง', 15, 20, '+', 'ดวง'))) }
    ],
    game: () => SQ(WS14P.add1) },
  { id: 332, title: 'สถานการณ์การบวก (2)', short: 'สถานการณ์การบวก (2)', tone: 'coral',
    goal: 'เขียนประโยคสัญลักษณ์การบวกจากโจทย์ที่มีการทด',
    teach: [{ t: 'อ่านโจทย์ หาคำสำคัญ: <b>รวม ทั้งหมด เพิ่ม แพงกว่า</b> → ใช้การบวก', s: 'อ่านโจทย์ หาคำสำคัญ รวม ทั้งหมด เพิ่ม แพงกว่า ใช้การบวก', v: el => el.append(storySim(ST('มีส้ม 46 ผล ซื้อมาเพิ่ม 28 ผล มีส้มทั้งหมดกี่ผล', 46, 28, '+', 'ผล'))) },
      { t: 'ตัวอย่างที่ 2: <b>แพงกว่า</b> ก็ใช้การบวก (มีการทด)', s: 'ตัวอย่างที่สอง แพงกว่า ก็ใช้การบวก', v: el => el.append(storySim(ST('เสื้อราคา 59 บาท กางเกงแพงกว่าเสื้อ 25 บาท กางเกงราคากี่บาท', 59, 25, '+', 'บาท'))) }
    ],
    game: () => SQ(WS14P.add2) },
  { id: 333, title: 'สถานการณ์การลบ (1)', short: 'สถานการณ์การลบ (1)', tone: 'mint',
    goal: 'เขียนประโยคสัญลักษณ์การลบจากสถานการณ์ เอาออก เหลือ และเปรียบเทียบ',
    teach: [
      { t: '<b>เอาออก / เหลือ</b> ใช้การลบ: ส่วนรวม − ส่วนที่เอาออก = ส่วนที่เหลือ', s: 'เอาออก หรือเหลือ ใช้การลบ ส่วนรวมลบส่วนที่เอาออก เท่ากับส่วนที่เหลือ', v: el => el.append(storySim(ST('มีขนม 58 ชิ้น แจกไป 25 ชิ้น เหลือขนมกี่ชิ้น', 58, 25, '-', 'ชิ้น'))) },
      { t: '<b>มากกว่ากี่ / น้อยกว่ากี่</b> ใช้การลบ: หาส่วนต่าง', s: 'มากกว่ากี่ หรือน้อยกว่ากี่ ใช้การลบ หาส่วนต่าง', v: el => el.append(storySim(ST('แมวมี 36 ตัว สุนัขมี 14 ตัว แมวมากกว่าสุนัขกี่ตัว', 36, 14, '-', 'ตัว'))) }
    ],
    game: () => SQ(WS14P.sub1) },
  { id: 334, title: 'สถานการณ์การลบ (2)', short: 'สถานการณ์การลบ (2)', tone: 'orange',
    goal: 'เขียนประโยคสัญลักษณ์การลบจากโจทย์ที่มีการกระจาย',
    teach: [{ t: 'คำสำคัญ: <b>เหลือ ใช้ไป ตัดไป สูงกว่า มากกว่ากี่</b> → ใช้การลบ', s: 'คำสำคัญ เหลือ ใช้ไป ตัดไป สูงกว่า มากกว่ากี่ ใช้การลบ', v: el => el.append(storySim(ST('มีเชือก 73 เมตร ตัดไปใช้ 38 เมตร เหลือเชือกกี่เมตร', 73, 38, '-', 'เมตร'))) },
      { t: 'ตัวอย่างที่ 2: <b>สูงกว่ากี่</b> ใช้การลบ (มีการกระจาย)', s: 'ตัวอย่างที่สอง สูงกว่ากี่ ใช้การลบ', v: el => el.append(storySim(ST('ตึกสูง 61 เมตร ต้นไม้สูง 27 เมตร ตึกสูงกว่าต้นไม้กี่เมตร', 61, 27, '-', 'เมตร'))) }
    ],
    game: () => SQ(WS14P.sub2) },
  { id: 335, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (1)', short: 'โจทย์ปัญหา (1)', tone: 'lilac',
    goal: 'วิเคราะห์โจทย์ปัญหา เลือกว่าใช้การบวกหรือการลบ เขียนประโยคสัญลักษณ์ และหาคำตอบ',
    teach: [{ t: '<b>เดิมมีเท่าไร</b>: ขายไป + เหลือ = เดิม → ใช้การบวก', s: 'เดิมมีเท่าไร ขายไปบวกเหลือ เท่ากับเดิม ใช้การบวก', v: el => el.append(storySim(ST('ใช้กระดาษไป 26 แผ่น เหลือ 47 แผ่น เดิมมีกระดาษกี่แผ่น', 26, 47, '+', 'แผ่น'))) },
      { t: 'ตัวอย่างที่ 2: “ขายไป … เหลือ … เดิมมีกี่” ก็ใช้การบวกเหมือนกัน', s: 'ตัวอย่างที่สอง ขายไป เหลือ เดิมมีกี่ ใช้การบวก', v: el => el.append(storySim(ST('ขายไข่ไป 35 ฟอง เหลือ 28 ฟอง เดิมมีไข่กี่ฟอง', 35, 28, '+', 'ฟอง'))) }
    ],
    game: () => SQ(WS14P.p1) },
  { id: 336, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (2)', short: 'โจทย์ปัญหา (2)', tone: 'yellow',
    goal: 'แก้โจทย์ปัญหาการบวกและการลบเกี่ยวกับความยาว ความสูง และเงิน',
    teach: [{ t: 'โจทย์เปรียบเทียบความยาว: <b>ยาวน้อยกว่ากี่</b> → ยาวมาก − ยาวน้อย', s: 'โจทย์เปรียบเทียบความยาว ยาวน้อยกว่ากี่ ยาวมากลบยาวน้อย', v: el => el.append(storySim(ST('ริบบิ้นสีชมพูยาว 65 เซนติเมตร สีฟ้ายาว 38 เซนติเมตร สีฟ้ายาวน้อยกว่าสีชมพูกี่เซนติเมตร', 65, 38, '-', 'เซนติเมตร'))) },
      { t: 'ตัวอย่างที่ 2 (เงิน): <b>แพงกว่ากี่บาท</b> → ราคามาก − ราคาน้อย', s: 'ตัวอย่างที่สอง แพงกว่ากี่บาท ราคามากลบราคาน้อย', v: el => el.append(storySim(ST('กระเป๋าราคา 85 บาท ปากการาคา 27 บาท กระเป๋าแพงกว่าปากกากี่บาท', 85, 27, '-', 'บาท'))) }
    ],
    game: () => SQ(WS14P.p2) },
  { id: 337, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (3)', short: 'โจทย์ปัญหา (3)', tone: 'sky',
    goal: 'แก้โจทย์ปัญหาที่ต้องหาส่วนที่ยังขาด และส่วนที่หายไป',
    teach: [{ t: '<b>ต้องการ … มีอยู่แล้ว … ต้องเพิ่มอีกกี่</b> → ต้องการ − มีอยู่แล้ว', s: 'ต้องการ มีอยู่แล้ว ต้องเพิ่มอีกกี่ ใช้ต้องการลบมีอยู่แล้ว', v: el => el.append(storySim(ST('ครูต้องการลูกบอล 40 ลูก มีอยู่แล้ว 28 ลูก ต้องซื้อเพิ่มอีกกี่ลูก', 40, 28, '-', 'ลูก'))) },
      { t: 'ตัวอย่างที่ 2: ต้องการ 50 มีแล้ว 34 → ขาดอีก 50 − 34', s: 'ตัวอย่างที่สอง ต้องการห้าสิบ มีแล้วสามสิบสี่ ขาดอีกห้าสิบลบสามสิบสี่', v: el => el.append(storySim(ST('ต้องการปลูกดอกไม้ 50 ดอก ปลูกแล้ว 34 ดอก ต้องปลูกเพิ่มอีกกี่ดอก', 50, 34, '-', 'ดอก'))) }
    ],
    game: () => SQ(WS14P.p3) },
  { id: 338, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (4)', short: 'โจทย์ปัญหา (4)', tone: 'coral',
    goal: 'แก้โจทย์ปัญหาที่รู้ส่วนรวมและส่วนย่อย หาอีกส่วนหนึ่ง',
    teach: [{ t: 'รู้<b>ส่วนรวม</b>และ<b>ส่วนหนึ่ง</b> หาอีกส่วน → ส่วนรวม − ส่วนที่รู้', s: 'รู้ส่วนรวมและส่วนหนึ่ง หาอีกส่วน ส่วนรวมลบส่วนที่รู้', v: el => el.append(storySim(ST('มีผลไม้ 64 ผล เป็นมะม่วง 29 ผล ที่เหลือเป็นส้ม มีส้มกี่ผล', 64, 29, '-', 'ผล'))) },
      { t: 'ตัวอย่างที่ 2: นักเรียนทั้งห้อง (ส่วนรวม) − นักเรียนชาย (ส่วนที่รู้) = นักเรียนหญิง', s: 'ตัวอย่างที่สอง ส่วนรวมลบส่วนที่รู้ ได้อีกส่วน', v: el => el.append(storySim(ST('ห้องเรียนมีนักเรียน 42 คน เป็นนักเรียนชาย 19 คน มีนักเรียนหญิงกี่คน', 42, 19, '-', 'คน'))) }
    ],
    game: () => SQ(WS14P.p4) },
  { id: 339, title: 'โจทย์ปัญหาการบวก และโจทย์ปัญหาการลบ (5)', short: 'โจทย์ปัญหา (5)', tone: 'mint',
    goal: 'สร้างโจทย์ปัญหาจากประโยคสัญลักษณ์ และแก้โจทย์ปัญหาระคน',
    teach: [{ t: '<b>สร้างโจทย์</b>จาก 85 + 13: เลือกเรื่อง (ปลา) จำนวน (85, 13) และคำที่บอกการบวก (ซื้อเพิ่ม)', s: 'สร้างโจทย์จาก แปดสิบห้าบวกสิบสาม เลือกเรื่อง จำนวน และคำที่บอกการบวก', v: el => el.append(h('div', { class: 'colstack' }, eqRow([85, '+', 13, '=', 98], { sm: true }), h('div', { class: 'storybox' }, 'มีปลา 85 ตัว ซื้อมาเพิ่ม 13 ตัว มีปลาทั้งหมดกี่ตัว'), eqRow([57, '−', 29, '=', 28], { sm: true }), h('div', { class: 'storybox' }, 'มีลูกอม 57 เม็ด กินไป 29 เม็ด เหลือลูกอมกี่เม็ด'))) },
      { t: 'ลองแก้โจทย์ที่สร้างขึ้น: กดดูประโยคสัญลักษณ์และคำตอบ', s: 'ลองแก้โจทย์ที่สร้างขึ้น', v: el => el.append(storySim(ST('มีลูกอม 57 เม็ด กินไป 29 เม็ด เหลือลูกอมกี่เม็ด', 57, 29, '-', 'เม็ด'))) }
    ],
    game: () => [...shuffle(WS14_MAKE).map(m => Q.storyFor(m)), ...SQ(pk([...WS14P.p1, ...WS14P.p3, ...WS14P.p4], 3))] }
];
const EXAM_CH14 = [
  { q: 'แนนมีเงิน 60 บาท โจมีเงิน 13 บาท สองคนมีเงินรวมกี่บาท', opts: ['73 บาท', '47 บาท', '63 บาท'], a: 0 },
  { q: 'โบ๊ทมีลูกแก้ว 17 ลูก เพื่อนให้อีก 6 ลูก เขียนประโยคสัญลักษณ์ได้อย่างไร', opts: ['17 + 6 = ☐', '17 − 6 = ☐', '6 − 17 = ☐'], a: 0 },
  { q: 'ยายมีไข่เป็ด 36 ฟอง ไข่ไก่ 48 ฟอง มีไข่รวมกี่ฟอง', opts: ['84 ฟอง', '12 ฟอง', '74 ฟอง'], a: 0 },
  { q: 'หมวกราคา 40 บาท รองเท้าแตะแพงกว่าหมวก 25 บาท รองเท้าแตะราคากี่บาท', opts: ['65 บาท', '15 บาท', '25 บาท'], a: 0 },
  { q: 'ร้านมีส้ม 84 ผล ขายไป 43 ผล เหลือกี่ผล', opts: ['41 ลูก', '127 ลูก', '43 ลูก'], a: 0 },
  { q: 'แพะ 48 ตัว แกะ 12 ตัว แพะมากกว่าแกะกี่ตัว', opts: ['36 ตัว', '60 ตัว', '12 ตัว'], a: 0 },
  { q: 'ร้านส้มตำมีมะนาว 47 ลูก ใช้ไป 38 ลูก เขียนประโยคสัญลักษณ์ได้อย่างไร', opts: ['47 − 38 = ☐', '47 + 38 = ☐', '38 − 47 = ☐'], a: 0 },
  { q: 'ต้นกล้วยสูง 90 ซม. น้องเล็กสูง 79 ซม. ต้นกล้วยสูงกว่ากี่เซนติเมตร', opts: ['11 เซนติเมตร', '21 เซนติเมตร', '169 เซนติเมตร'], a: 0 },
  { q: 'แพะหนัก 46 กก. แกะหนัก 36 กก. รวมกันหนักกี่กิโลกรัม', opts: ['82 กิโลกรัม', '10 กิโลกรัม', '72 กิโลกรัม'], a: 0 },
  { q: 'ก้องมีเงิน 54 บาท ซื้อหมวก 39 บาท เหลือเงินกี่บาท', opts: ['15 บาท', '25 บาท', '93 บาท'], a: 0 },
  { q: 'ร้านขายเสื้อไป 31 ตัว ยังเหลือ 45 ตัว ตอนแรกมีเสื้อกี่ตัว', opts: ['76 ตัว', '14 ตัว', '66 ตัว'], a: 0 },
  { q: 'ครูต้องใช้ปากกา 51 ด้าม ตอนนี้มี 43 ด้าม ต้องซื้อเพิ่มกี่ด้าม', opts: ['8 ด้าม', '94 ด้าม', '18 ด้าม'], a: 0 },
  { q: 'มีริบบิ้น 72 เส้น เป็นสีเหลือง 33 เส้น ที่เหลือเป็นสีม่วง มีริบบิ้นสีม่วงกี่เส้น', opts: ['39 เส้น', '105 เส้น', '41 เส้น'], a: 0 },
  { q: 'ตู้ปลามีปลา 43 ตัว ใส่เพิ่ม 28 ตัว มีปลาทั้งหมดกี่ตัว', opts: ['71 ตัว', '15 ตัว', '61 ตัว'], a: 0 },
  { q: 'โจทย์ข้อใดตรงกับ 57 − 29 = ☐', opts: ['มีลูกอม 57 เม็ด กินไป 29 เม็ด เหลือกี่เม็ด', 'มีลูกอม 57 เม็ด ซื้อเพิ่ม 29 เม็ด มีกี่เม็ด', 'มีลูกอม 29 เม็ด ซื้อเพิ่ม 57 เม็ด มีกี่เม็ด'], a: 0 }
];
LESSONS_CH14.push({ id: 349, boss: true, title: 'ด่านบอส: บทที่ 14 โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ', short: 'ด่านบอส · ข้อสอบ', tone: 'lilac',
  goal: 'ตอบคำถามท้ายบท 15 ข้อ ตอบถูกอย่างน้อย 8 ข้อเพื่อชนะบอส', exam: spread(EXAM_CH14), pass: 8, bossName: 'ราชาปีศาจโจทย์', bossPal: 'lilac', emblem: '?' });

/* =========================================================
   GRADE 1 · FINAL — every P1 boss merges into one giant boss (timed mixed exam)
   ========================================================= */
const MEGA_N = 20, MEGA_TIME = 15 * 60;
function megaExam(grade = 1, per = 1, N = MEGA_N) { // `per` questions from every chapter boss of the grade (items flagged q.off first — none now), the rest random, shuffled
  const bosses = CITIES.filter(c => c.grade === grade && !c.final).flatMap(c => c.lessons.filter(L => L.boss && L.bossKind !== 'mega'));
  const tag = (q, L) => ({ ...q, from: L.id });
  const picked = bosses.flatMap(L => { const off = shuffle(L.exam.filter(q => q.off)), rest = shuffle(L.exam.filter(q => !q.off)); return [...off, ...rest].slice(0, per).map(q => tag(q, L)); });
  const rest = shuffle(bosses.flatMap(L => L.exam.map(q => tag(q, L)))).filter(q => !picked.some(p => p.q === q.q && p.from === q.from));
  return shuffle([...picked, ...rest].slice(0, Math.max(N, picked.length)));
}
const LESSONS_MEGA = [{ id: 399, boss: true, title: 'ด่านบอสใหญ่: จอมราชาปีศาจรวมร่าง', short: 'บอสใหญ่ · จับเวลา', tone: 'red',
  goal: `บอสทุกตัวของ ป.1 รวมร่างกันแล้ว! ข้อสอบรวม ${MEGA_N} ข้อ สุ่มจากทุกบท ทำให้เสร็จภายใน ${MEGA_TIME / 60} นาที ตอบถูกอย่างน้อย 14 ข้อเพื่อชนะ`,
  get exam() { return this._ex || (this._ex = megaExam(1)); }, examGen: () => megaExam(1), pass: 14, megaGrade: 1, timeLimit: MEGA_TIME, bossName: 'จอมราชาปีศาจรวมร่าง', bossPal: 'night', emblem: 'ป.1', bossKind: 'mega',
  winLine: 'ชนะจอมราชาปีศาจรวมร่างแล้ว! เก่งที่สุดในชั้น ป.1', loseLine: 'จอมราชายังแข็งแกร่ง ฝึกด่านต่าง ๆ แล้วกลับมาสู้ใหม่นะ' }];
/* GRADE 2 · FINAL — every P2 octopus boss merges into the giant octopus king (timed, 2 questions from every chapter test) */
const MEGA2_N = 22, MEGA2_TIME = 20 * 60, MEGA2_PASS = 15, megaExam2 = () => megaExam(2, 2, MEGA2_N);
const LESSONS_MEGA2 = [{ id: 1099, boss: true, title: 'ด่านบอสใหญ่ ป.2: ราชาปลาหมึกยักษ์รวมร่าง', short: 'บอสใหญ่ · จับเวลา', tone: 'sky',
  goal: `ปีศาจปลาหมึกทุกตัวของ ป.2 รวมร่างเป็นราชาปลาหมึกยักษ์! ข้อสอบรวม ${MEGA2_N} ข้อ จากข้อสอบท้ายบททุกบท (บทละ 2 ข้อ) ทำให้เสร็จภายใน ${MEGA2_TIME / 60} นาที ตอบถูกอย่างน้อย ${MEGA2_PASS} ข้อเพื่อชนะ`,
  get exam() { return this._ex || (this._ex = megaExam2()); }, examGen: megaExam2, pass: MEGA2_PASS, timeLimit: MEGA2_TIME, bossName: 'ราชาปลาหมึกยักษ์รวมร่าง', bossPal: 'night', emblem: 'ป.2', bossKind: 'mega', megaGrade: 2,
  winLine: 'ชนะราชาปลาหมึกยักษ์แล้ว! เก่งที่สุดในชั้น ป.2', loseLine: 'ราชาปลาหมึกยักษ์ยังแข็งแกร่ง กลับไปทบทวนบทที่แนะนำแล้วมาสู้ใหม่นะ' }];

/* GRADES 3–6 · FINAL — every chapter boss of the grade merges into one giant boss: `per` items from every chapter test, in chapter order
   (built from the game's own chapter tests — no copied exam papers) */
function megaExamG(grade, per) { const C = CITIES.filter(c => c.grade === grade && !c.final);
  return C.flatMap(c => c.lessons.filter(L => L.boss && L.bossKind !== 'mega').flatMap(B => shuffle((B.examAll || B.exam).slice()).slice(0, per).map(q => ({ ...q, from: B.id }))
    .sort((a, b) => { const ix = q => q.lv ? c.lessons.findIndex(x => x.id === q.lv) : 99; return ix(a) - ix(b); }))); }
const megaLesson = (id, g, per, mins, pass, name, tone, line) => [{ id, boss: true, title: `ด่านบอสใหญ่ ป.${g}: ${name}`, short: 'บอสใหญ่ · จับเวลา', tone,
  get goal() { return `${line} ข้อสอบรวมจากทุกบท บทละ ${per} ข้อ (เรียงตามบท) ทำให้เสร็จภายใน ${mins} นาที ตอบถูกอย่างน้อย ${pass} ข้อเพื่อชนะ`; },
  get exam() { return this._ex || (this._ex = megaExamG(g, per)); }, examGen: () => megaExamG(g, per), pass, timeLimit: mins * 60, bossName: name, bossPal: 'night', emblem: `ป.${g}`, bossKind: 'mega', megaGrade: g,
  winLine: `ชนะ${name}แล้ว! เก่งที่สุดในชั้น ป.${g}`, loseLine: `${name}ยังแข็งแกร่ง กลับไปทบทวนบทที่แนะนำแล้วมาสู้ใหม่นะ` }];
const LESSONS_MEGA3 = megaLesson(1199, 3, 3, 60, 26, 'ราชางูยักษ์รวมร่าง', 'mint', 'งูยักษ์ทุกตัวของ ป.3 รวมร่างเป็นราชางูยักษ์!');
const LESSONS_MEGA4 = megaLesson(1599, 4, 4, 60, 26, 'จักรพรรดิแมงป่องรวมร่าง', 'orange', 'แมงป่องทุกตัวของ ป.4 รวมร่างเป็นจักรพรรดิแมงป่อง!');
const LESSONS_MEGA5 = megaLesson(1699, 5, 5, 60, 26, 'จอมราชาหมีรวมร่าง', 'lilac', 'ราชาหมีทุกตัวของ ป.5 รวมร่างเป็นจอมราชาหมี!');
const LESSONS_MEGA6 = megaLesson(899, 6, 4, 60, 26, 'จอมเยติรวมร่าง', 'sky', 'ราชาเยติทุกตัวของ ป.6 รวมร่างเป็นจอมเยติ!');

/* =========================================================
   GRADE 2 · CHAPTER 1 — จำนวนนับไม่เกิน 1,000 และ 0  (ชายหาด)
   ========================================================= */
function skipDemo(e, n, step) {
  const g = skipGroups(e, n, step); const boxes = [...g.children]; let k = 0;
  const big = bigNum(0, 'sm');
  const btn = h('button', { class: 'btn info ia', onclick: ev => { ev.stopPropagation(); if (k >= boxes.length) { k = 0; boxes.forEach(b => b.classList.remove('on')); big.textContent = 0; return; } boxes[k].classList.add('on'); k++; const v = Math.min(n, k * step); big.textContent = v; sfx.pop(k); say(thaiWords(v), true); if (k >= boxes.length) btn.lastChild.textContent = 'นับใหม่'; } }, icon('plus'), h('span', null, `นับทีละ ${step}`));
  return h('div', { class: 'rowstack' }, g, h('div', { class: 'colstack' }, big, btn));
}
function blocksMachine(start = 124, maxH = 9) { // place-value simulator
  let v = [Math.floor(start / 100), Math.floor(start / 10) % 10, start % 10];
  const vis = h('div'), out = h('div', { class: 'colstack', style: { gap: '4px' } });
  const draw = () => { const n = v[0] * 100 + v[1] * 10 + v[2]; vis.innerHTML = ''; vis.append(baseBlocks(n, { labels: true })); out.innerHTML = '';
    out.append(h('div', { class: 'bignum sm' }, n), h('div', { class: 'word', style: { fontSize: 'clamp(20px,2.6vw,30px)', color: 'var(--mint-2)' } }, thaiWords(n)), h('div', { class: 'word', style: { fontSize: 'clamp(22px,2.8vw,32px)', color: 'var(--sky-2)' } }, thai(n))); };
  const ctl = (lab, i, cls) => h('div', { class: 'colstack', style: { gap: '4px' } }, h('div', { class: 'cap' }, lab), h('div', { class: 'rowstack', style: { gap: '6px' } },
    h('button', { class: 'btn icon sm ia', onclick: ev => { ev.stopPropagation(); if (v[i] > 0) { v[i]--; draw(); sfx.pop(v[i]); say(thaiWords(v[0] * 100 + v[1] * 10 + v[2]), true); } } }, PM('-')),
    h('button', { class: 'btn icon sm ia ' + cls, onclick: ev => { ev.stopPropagation(); if (v[i] < (i === 0 ? maxH : 9)) { v[i]++; draw(); sfx.pop(v[i]); say(thaiWords(v[0] * 100 + v[1] * 10 + v[2]), true); } } }, PM('+'))));
  draw();
  return h('div', { class: 'colstack' }, h('div', { class: 'rowstack' }, vis, out), h('div', { class: 'rowstack' }, ctl('ร้อย', 0, 'accent'), ctl('สิบ', 1, 'info'), ctl('หน่วย', 2, 'danger')));
}
function placeTap(n) {
  const c = placeChart(n); const note = h('div', { class: 'word', style: { fontSize: 'clamp(20px,2.6vw,30px)' } }, 'แตะเลขโดดแต่ละตัว');
  c.querySelectorAll('.pc').forEach((pc, i) => { pc.classList.add('ia'); pc.style.cursor = 'pointer'; pc.onclick = ev => { ev.stopPropagation(); c.querySelectorAll('.pc').forEach(x => x.classList.remove('on')); pc.classList.add('on'); const d = +String(n).padStart(3, '0')[i], val = d * [100, 10, 1][i]; note.innerHTML = `${d} อยู่ใน<b>${['หลักร้อย', 'หลักสิบ', 'หลักหน่วย'][i]}</b> มีค่า <span class="hl">${val}</span>`; sfx.pop(i); say(`${WORD[d]} อยู่ใน${['หลักร้อย', 'หลักสิบ', 'หลักหน่วย'][i]} มีค่า ${thaiWords(val)}`, true); }; });
  return h('div', { class: 'colstack' }, c, note);
}
function evenPairs(n0 = 7) {
  let n = n0; const box = h('div'), lab = h('div', { class: 'word' });
  const draw = () => { box.innerHTML = ''; const w = h('div', { class: 'pairs-grid' }); for (let i = 0; i < n; i += 2) { const p = h('div', { class: 'pr' + (i + 1 >= n ? ' lone' : '') }, h('i', { class: 'dot' }), i + 1 < n ? h('i', { class: 'dot b' }) : null); w.append(p); } box.append(w); lab.innerHTML = `${n} เป็น<span class="${n % 2 ? 'hl' : 'hl3'}">${n % 2 ? 'จำนวนคี่' : 'จำนวนคู่'}</span>`; };
  const b = (lb, d, cls) => h('button', { class: 'btn icon ia ' + cls, onclick: ev => { ev.stopPropagation(); n = Math.max(1, Math.min(14, n + d)); draw(); sfx.pop(n); say(`${thaiWords(n)} เป็น${n % 2 ? 'จำนวนคี่' : 'จำนวนคู่'}`, true); } }, PM(lb));
  draw(); return h('div', { class: 'colstack' }, box, lab, h('div', { class: 'rowstack' }, b('-', -1, 'danger'), b('+', 1, 'primary')));
}
function hopStrip(start, step, count = 6) {
  const vals = range(0, count - 1).map(i => start + i * step); let k = 1;
  const strip = numStrip(vals, [], { step }); const cells = [...strip.querySelectorAll('.ns')];
  cells.forEach((c, i) => { if (i) c.style.visibility = 'hidden'; });
  const btn = h('button', { class: 'btn info ia', onclick: ev => { ev.stopPropagation(); if (k < count) { cells[k].style.visibility = ''; cells[k].style.animation = 'popIn .35s var(--spring)'; say(thaiWords(vals[k]), true); sfx.pop(k); k++; } if (k >= count) btn.remove(); } }, icon('right'), step > 0 ? `เพิ่มทีละ ${fmt(step)}` : `ลดทีละ ${fmt(-step)}`);
  return h('div', { class: 'colstack' }, strip, btn);
}
function orderLine(nums, max = 1000, min = 0) {
  const w = h('div', { class: 'oline' + (max >= 10000 ? ' big' : '') }); const bar = h('div', { class: 'olbar' }); w.append(bar); const span = max - min, pos = v => (v - min) / span * 100 + '%';
  for (let k = 0; k <= 10; k++) { const t = min + span * k / 10; bar.append(h('span', { class: 'olt', style: { left: pos(t) } }, h('i'), h('b', { class: 'num' }, max >= 10000 && k % 2 ? '' : fmt(t)))); }
  nums.forEach((n, i) => bar.append(h('span', { class: 'olm' + (i % 2 ? ' alt' : ''), style: { left: pos(n), animationDelay: i * .25 + 's' } }, h('b', { class: 'num' }, fmt(n)))));
  return w;
}
const B = (k = 3) => shuffle(range(100, 999)).slice(0, k);
const LESSONS_P2C1 = [
  { id: 41, place: 'หาดนับกระโดด', title: 'การนับทีละ 2 และทีละ 5', short: 'นับทีละ 2 ทีละ 5', tone: 'sky',
    goal: 'นับเพิ่มทีละ 2 และทีละ 5 เพื่อบอกจำนวนของสิ่งต่าง ๆ ได้อย่างรวดเร็ว',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>ชายหาด ป.2</b>! ด่านแรก <b>หาดนับกระโดด</b> มาฝึกนับทีละหลาย ๆ กัน', s: 'ยินดีต้อนรับสู่ชายหาด ป สอง ด่านแรก หาดนับกระโดด มาฝึกนับทีละหลาย ๆ กัน', v: el => el.append(mascot('wow', 'big')) },
      { t: 'จัดของเป็นกลุ่มละ 2 แล้ว<b>นับทีละ 2</b>: 2, 4, 6, 8, … <b>แตะปุ่ม</b>นับดูนะ', s: 'จัดของเป็นกลุ่มละสอง แล้วนับทีละสอง แตะปุ่มนับดูนะ', v: el => el.append(skipDemo('strawberry', 14, 2)) },
      { t: 'จัดเป็นกลุ่มละ 5 แล้ว<b>นับทีละ 5</b>: 5, 10, 15, 20, …', s: 'จัดเป็นกลุ่มละห้า แล้วนับทีละห้า', v: el => el.append(skipDemo('fish', 25, 5)) },
      { t: 'นับทีละ 2 ทีละ 5 เร็วกว่านับทีละ 1 เยอะเลย!', v: el => el.append(numStrip([2, 4, 6, 8, 10, 12], [], { step: 2 }), numStrip([5, 10, 15, 20, 25, 30], [], { step: 5 })) }
    ],
    game: () => [Q.skipCount({ step: 2, n: rnd(4, 9) * 2 }), Q.skipCount({ step: 5, n: rnd(3, 7) * 5 }), Q.pattern({ start: rnd(1, 10) * 2, step: 2 }), Q.skipCount({ step: 2, n: rnd(6, 10) * 2 - 1 }), Q.pattern({ start: rnd(1, 6) * 5, step: 5 }), Q.skipCount({ step: 5, n: rnd(5, 9) * 5 })] },
  { id: 42, place: 'หาดสองร้อย', title: 'จำนวนนับไม่เกิน 200', short: 'จำนวนไม่เกิน 200', tone: 'sky',
    goal: 'นับทีละ 10 และทีละ 100 บอกจำนวน อ่านและเขียนตัวเลขฮินดูอารบิก ตัวเลขไทย ตัวหนังสือ แสดงจำนวนไม่เกิน 200 ได้',
    teach: [
      { t: '<b>แท่งสิบ</b> 1 แท่ง = 10 หน่วย นับทีละ 10: 10, 20, 30, …', v: el => el.append(skipDemo('orange', 40, 10)) },
      { t: 'สิบ 10 แท่ง = <b>หนึ่งร้อย</b> (แผ่นร้อย 1 แผ่น) เขียน 100 ตัวเลขไทย ๑๐๐', v: el => el.append(baseBlocks(100, { labels: true }), triple100(100)) },
      { t: '<b>ลองกด + −</b> สร้างจำนวนด้วยแผ่นร้อย แท่งสิบ และก้อนหน่วย (ไม่เกิน 200)', s: 'ลองกดบวก ลบ สร้างจำนวนด้วยแผ่นร้อย แท่งสิบ และก้อนหน่วย', v: el => el.append(blocksMachine(135, 2)) },
      { t: 'เช่น 1 ร้อย 4 สิบ 6 หน่วย = <span class="hl">146</span> อ่านว่า “หนึ่งร้อยสี่สิบหก”', v: el => el.append(baseBlocks(146, { labels: true }), triple100(146)) }
    ],
    game: () => [Q.skipCount({ step: 10, n: rnd(4, 9) * 10, item: pick(ITEMS.fruits) }), Q.blocksRead({ n: rnd(101, 199) }), Q.wordToNum({ n: rnd(110, 200) }), Q.blocksRead({ n: rnd(120, 190), ask: 'thai' }), Q.numToWord({ n: rnd(101, 199) }), Q.match1000({ nums: shuffle(range(101, 200)).slice(0, 3) })] },
  { id: 43, place: 'หาดพันเม็ดทราย', title: 'จำนวนนับ 201 ถึง 1,000', short: 'จำนวน 201–1,000', tone: 'sky',
    goal: 'บอกจำนวน อ่านและเขียนตัวเลขฮินดูอารบิก ตัวเลขไทย ตัวหนังสือ แสดงจำนวน 201 ถึง 1,000 ได้',
    teach: [
      { t: 'นับ<b>ทีละ 100</b>: 100, 200, 300, … 900, 1,000', v: el => el.append(hopStrip(100, 100, 10)) },
      { t: 'ร้อย 10 แผ่น = <b>หนึ่งพัน</b> เขียน 1,000 ตัวเลขไทย ๑,๐๐๐', v: el => el.append(baseBlocks(1000, { labels: true }), h('div', { class: 'forms' }, h('div', { class: 'f a' }, h('div', { class: 'h' }, 'ฮินดูอารบิก'), h('div', { class: 'v' }, '1,000')), h('div', { class: 'f t' }, h('div', { class: 'h' }, 'ตัวเลขไทย'), h('div', { class: 'v' }, '๑,๐๐๐')), h('div', { class: 'f w' }, h('div', { class: 'h' }, 'ตัวหนังสือ'), h('div', { class: 'v' }, 'หนึ่งพัน')))) },
      { t: '<b>ลองสร้างจำนวน</b>ไม่เกิน 999 ด้วยกด + −', s: 'ลองสร้างจำนวนไม่เกินเก้าร้อยเก้าสิบเก้า', v: el => el.append(blocksMachine(468, 9)) },
      { t: 'ระวัง! หลักที่เป็น 0 ไม่ต้องอ่าน: 805 อ่านว่า “แปดร้อยห้า” และ 1 ในหลักหน่วยอ่านว่า “เอ็ด”: 901 = เก้าร้อยเอ็ด', v: el => el.append(triple100(805), triple100(901)) }
    ],
    game: () => [Q.blocksRead({ n: rnd(201, 999) }), Q.wordToNum({ n: rnd(201, 999) }), Q.numToWord({ n: rnd(201, 999), from: pick(['digit', 'thai']) }), Q.blocksRead({ n: rnd(201, 999), ask: 'word' }), Q.match1000({ nums: B() }), Q.wordToNum({ n: pick([305, 410, 701, 860, 999, 1000, 520]) })] },
  { id: 44, place: 'หาดสามหลัก', title: 'หลัก ค่าของเลขโดดในแต่ละหลัก ของจำนวนนับไม่เกิน 1,000', short: 'หลักและค่า', tone: 'mint',
    goal: 'บอกหลัก ค่าของเลขโดดในแต่ละหลัก และเขียนตัวเลขแสดงจำนวนในรูปกระจายได้',
    teach: [
      { t: 'จำนวนสามหลักมี <b>หลักร้อย หลักสิบ หลักหน่วย</b> — <b>แตะเลขโดด</b>ดูค่าของแต่ละตัว', s: 'จำนวนสามหลักมีหลักร้อย หลักสิบ หลักหน่วย แตะเลขโดดดูค่าของแต่ละตัว', v: el => el.append(placeTap(497)) },
      { t: 'เลขโดดเดียวกัน อยู่คนละหลัก ค่าไม่เท่ากัน: 777 = 700, 70, 7', v: el => el.append(placeChart(777, { values: true })) },
      { t: '<b>รูปกระจาย</b> = ค่าของแต่ละหลักบวกกัน: 497 = 400 + 90 + 7', v: el => el.append(baseBlocks(497, { labels: true }), eqRow([497, '=', 400, '+', 90, '+', 7], { sm: true })) },
      { t: 'ถ้ามี 0 เช่น 906 = 900 + 0 + 6 หรือเขียน 900 + 6 ก็ได้', v: el => el.append(placeChart(906, { values: true }), eqRow([906, '=', 900, '+', 6], { sm: true })) }
    ],
    game: () => [Q.placeValue({ n: rnd(111, 999) }), Q.whichPlace({ n: rnd(123, 987) }), Q.expanded({ n: rnd(111, 999) }), Q.placeValue({ n: rnd(111, 999), pos: 0 }), Q.pickExpanded({ n: rnd(211, 989) }), Q.expanded({ n: pick([408, 510, 209, 750, 906, 120]) })] },
  { id: 45, place: 'หาดคลื่นใหญ่เล็ก', title: 'การเปรียบเทียบจำนวน (1)', short: 'เปรียบเทียบ (1)', tone: 'coral',
    goal: 'เปรียบเทียบจำนวนที่มีจำนวนหลักต่างกัน และใช้เครื่องหมาย > < = ได้',
    teach: [
      { t: 'จำนวนที่มี<b>หลักมากกว่า</b> จะมีค่ามากกว่าเสมอ: 163 (สามหลัก) กับ 76 (สองหลัก)', v: el => el.append(h('div', { class: 'rowstack' }, baseBlocks(163, { sm: true }), baseBlocks(76, { sm: true })), eqRow([163, '>', 76])) },
      { t: '<span class="hl">&gt;</span> มากกว่า · <span class="hl2">&lt;</span> น้อยกว่า · ปากเครื่องหมายอ้าไปทางจำนวนที่มากกว่า', v: el => el.append(eqRow([588, '>', 99]), eqRow([34, '<', 203])) },
      { t: 'ใช้เส้นจำนวน: จำนวนที่อยู่ทางขวามีค่ามากกว่า', v: el => el.append(orderLine([76, 163, 588])) }
    ],
    game: () => [Q.compareSym({ a: rnd(100, 999), b: rnd(10, 99) }), Q.compareSym({ a: rnd(10, 99), b: rnd(100, 999), blocks: true }), Q.compareSym({ a: rnd(100, 999), b: rnd(10, 99) }), Q.extreme({ nums: [rnd(10, 99), rnd(100, 999), rnd(10, 99)], which: 'max' }), Q.compareSym({ a: rnd(10, 99), b: rnd(100, 999) }), Q.extreme({ nums: [rnd(100, 999), rnd(10, 99), rnd(100, 999)], which: 'min' })] },
  { id: 46, place: 'หาดเทียบทีละหลัก', title: 'การเปรียบเทียบจำนวน (2)', short: 'เปรียบเทียบ (2)', tone: 'coral',
    goal: 'เปรียบเทียบจำนวนสามหลักโดยเทียบเลขโดดทีละหลัก จากหลักร้อย หลักสิบ ถึงหลักหน่วย',
    teach: [
      { t: 'จำนวนหลักเท่ากัน ให้<b>เทียบหลักร้อยก่อน</b>: 624 กับ 504 → 6 ร้อย มากกว่า 5 ร้อย', v: el => el.append(h('div', { class: 'rowstack' }, placeChart(624, { hi: 0 }), placeChart(504, { hi: 0 })), eqRow([624, '>', 504])) },
      { t: 'หลักร้อยเท่ากัน → <b>เทียบหลักสิบ</b>: 712 กับ 720 → 1 สิบ น้อยกว่า 2 สิบ', v: el => el.append(h('div', { class: 'rowstack' }, placeChart(712, { hi: 1 }), placeChart(720, { hi: 1 })), eqRow([712, '<', 720])) },
      { t: 'หลักร้อยและหลักสิบเท่ากัน → <b>เทียบหลักหน่วย</b>: 481 กับ 480', v: el => el.append(h('div', { class: 'rowstack' }, placeChart(481, { hi: 2 }), placeChart(480, { hi: 2 })), eqRow([481, '>', 480])) }
    ],
    game: () => { const same = () => { const a = rnd(100, 999); let b = a; while (b === a) b = Math.floor(a / 100) * 100 + rnd(0, 99); return { a, b }; }; const sameT = () => { const a = rnd(100, 999); let b = a; while (b === a) b = Math.floor(a / 10) * 10 + rnd(0, 9); return { a, b }; };
      return [Q.compareSym({ a: rnd(100, 999), b: rnd(100, 999) }), Q.compareSym(same()), Q.compareSym(sameT()), Q.extreme({ nums: nearBig(rnd(300, 700), 4), which: 'max' }), Q.compareSym(same()), Q.extreme({ nums: nearBig(rnd(300, 700), 4), which: 'min' })]; } },
  { id: 47, place: 'หาดบันไดขึ้น', title: 'การเรียงลำดับจำนวน (1)', short: 'เรียงลำดับ (1)', tone: 'mint',
    goal: 'เรียงลำดับจำนวนนับไม่เกิน 1,000 จากน้อยไปมากได้',
    teach: [
      { t: 'เรียงจาก<b>น้อยไปมาก</b>: หาจำนวนที่น้อยที่สุดก่อน แล้วไล่ไปหามาก', v: el => el.append(orderLine([648, 760, 764, 798])) },
      { t: 'ตัวอย่าง 798 764 760 648 → <span class="hl">648 760 764 798</span>', v: el => el.append(numStrip([648, 760, 764, 798])) },
      { t: '<b>ลองเรียงเอง</b> จากน้อยไปมาก', s: 'ลองเรียงเอง จากน้อยไปมาก', v: el => el.append(orderDemo([456, 200, 490, 452], 'asc')) }
    ],
    game: () => [Q.order({ nums: B(3), dir: 'asc' }), Q.order({ nums: nearBig(rnd(300, 700), 4), dir: 'asc' }), Q.order({ nums: B(4), dir: 'asc' }), Q.extreme({ nums: B(4), which: 'min' }), Q.order({ nums: nearBig(rnd(200, 800), 4, 0, 999, [1, 10]), dir: 'asc' })] },
  { id: 48, place: 'หาดบันไดลง', title: 'การเรียงลำดับจำนวน (2)', short: 'เรียงลำดับ (2)', tone: 'mint',
    goal: 'เรียงลำดับจำนวนนับไม่เกิน 1,000 จากมากไปน้อยได้',
    teach: [
      { t: 'เรียงจาก<b>มากไปน้อย</b>: หาจำนวนที่มากที่สุดก่อน', v: el => el.append(orderLine([265, 674, 675, 768])) },
      { t: '265 675 674 768 → <span class="hl">768 675 674 265</span>', v: el => el.append(numStrip([768, 675, 674, 265])) },
      { t: '<b>ลองเรียงเอง</b> จากมากไปน้อย', s: 'ลองเรียงเอง จากมากไปน้อย', v: el => el.append(orderDemo([758, 765, 876, 478], 'desc')) }
    ],
    game: () => [Q.order({ nums: B(3), dir: 'desc' }), Q.order({ nums: nearBig(rnd(300, 700), 4), dir: 'desc' }), Q.order({ nums: B(4), dir: 'desc' }), Q.extreme({ nums: B(4), which: 'max' }), Q.order({ nums: nearBig(rnd(200, 800), 4, 0, 999, [1, 10]), dir: 'desc' })] },
  { id: 49, place: 'หาดคู่คี่', title: 'จำนวนคู่ จำนวนคี่', short: 'จำนวนคู่ คี่', tone: 'lilac',
    goal: 'บอกได้ว่าจำนวนใดเป็นจำนวนคู่หรือจำนวนคี่ โดยดูจากเลขโดดในหลักหน่วย',
    teach: [
      { t: 'จับคู่ทีละ 2 ถ้า<b>จับคู่ได้หมดพอดี</b> = <span class="hl3">จำนวนคู่</span> ถ้า<b>เหลือ 1</b> = <span class="hl">จำนวนคี่</span> ลองกด + −', s: 'จับคู่ทีละสอง ถ้าจับคู่ได้หมดพอดีเป็นจำนวนคู่ ถ้าเหลือหนึ่งเป็นจำนวนคี่', v: el => el.append(evenPairs(7)) },
      { t: 'ดูที่<b>หลักหน่วย</b>: 0 2 4 6 8 → จำนวนคู่ · 1 3 5 7 9 → จำนวนคี่', v: el => el.append(h('div', { class: 'chips' }, ...[0, 2, 4, 6, 8].map(d => h('span', { class: 'kchip' }, d))), h('div', { class: 'chips' }, ...[1, 3, 5, 7, 9].map(d => h('span', { class: 'kchip no', style: { textDecoration: 'none' } }, d)))) },
      { t: 'เช่น 298 (หลักหน่วย 8) เป็นจำนวนคู่ · 553 (หลักหน่วย 3) เป็นจำนวนคี่', v: el => el.append(placeChart(298, { hi: 2 }), placeChart(553, { hi: 2 })) }
    ],
    game: () => [Q.evenOdd({ n: rnd(10, 99) }), Q.evenOdd({ n: rnd(100, 999) }), Q.sortEvenOdd(), Q.evenOdd({ n: rnd(100, 999) }), Q.sortEvenOdd({ k: 8 })] },
  { id: 50, place: 'หาดรอยเท้าทีละ 2', title: 'แบบรูปของจำนวนที่เพิ่มขึ้นทีละ 2 และแบบรูปของจำนวนที่ลดลงทีละ 2', short: 'แบบรูป ทีละ 2', tone: 'orange',
    goal: 'บอกจำนวนที่หายไปในแบบรูปที่เพิ่มขึ้นหรือลดลงทีละ 2 ได้',
    teach: [
      { t: '<b>เพิ่มขึ้นทีละ 2</b>: 115, 117, 119, … กดดูทีละจำนวน', s: 'เพิ่มขึ้นทีละสอง กดดูทีละจำนวน', v: el => el.append(hopStrip(115, 2, 6)) },
      { t: '<b>ลดลงทีละ 2</b>: 67, 65, 63, …', v: el => el.append(hopStrip(67, -2, 6)) },
      { t: 'หาจำนวนที่หายไป: ดูว่าเพิ่มหรือลด แล้วนับต่อ', v: el => { const s = numStrip([540, 542, 544, 546, 548], [2]); el.append(s, revealBtn(eqRow([542, '+', 2, '=', '?'], { sm: true }), 544)); } }
    ],
    game: () => [Q.pattern({ start: rnd(100, 900), step: 2 }), Q.pattern({ start: rnd(100, 900), step: -2 }), Q.patternRule({ start: rnd(100, 900), step: pick([2, -2]) }), Q.pattern({ start: rnd(50, 990), step: pick([2, -2]), len: 6 }), Q.pattern({ start: rnd(100, 900), step: -2, blank: 4 })] },
  { id: 51, place: 'หาดคลื่นทีละ 5', title: 'แบบรูปของจำนวนที่เพิ่มขึ้นทีละ 5 และแบบรูปของจำนวนที่ลดลงทีละ 5', short: 'แบบรูป ทีละ 5', tone: 'orange',
    goal: 'บอกจำนวนที่หายไปในแบบรูปที่เพิ่มขึ้นหรือลดลงทีละ 5 ได้',
    teach: [
      { t: '<b>เพิ่มขึ้นทีละ 5</b>: 75, 80, 85, …', v: el => el.append(hopStrip(75, 5, 6)) },
      { t: '<b>ลดลงทีละ 5</b>: 991, 986, 981, …', v: el => el.append(hopStrip(991, -5, 6)) },
      { t: 'สังเกต: เพิ่มทีละ 5 หลักหน่วยจะสลับกันแค่ 2 แบบ เช่น 2 กับ 7', v: el => el.append(numStrip([132, 137, 142, 147, 152], [], { step: 5 })) }
    ],
    game: () => [Q.pattern({ start: rnd(20, 180) * 5, step: 5 }), Q.pattern({ start: rnd(100, 990), step: -5 }), Q.patternRule({ start: rnd(100, 900), step: pick([5, -5]) }), Q.pattern({ start: rnd(100, 900), step: 5 }), Q.pattern({ start: rnd(200, 990), step: -5, len: 6 })] },
  { id: 52, place: 'หาดก้าวละร้อย', title: 'แบบรูปของจำนวนที่เพิ่มขึ้นทีละ 100 และแบบรูปของจำนวนที่ลดลงทีละ 100', short: 'แบบรูป ทีละ 100', tone: 'orange',
    goal: 'บอกจำนวนที่หายไปในแบบรูปที่เพิ่มขึ้นหรือลดลงทีละ 100 ได้',
    teach: [
      { t: '<b>เพิ่มขึ้นทีละ 100</b>: เปลี่ยนแค่<b>หลักร้อย</b> 10, 110, 210, …', v: el => el.append(hopStrip(10, 100, 6)) },
      { t: '<b>ลดลงทีละ 100</b>: 951, 851, 751, …', v: el => el.append(hopStrip(951, -100, 6)) },
      { t: 'หลักสิบและหลักหน่วยเหมือนเดิมทุกจำนวน', v: el => el.append(numStrip([254, 354, 454, 554, 654], [], { step: 100 })) }
    ],
    game: () => [Q.pattern({ start: rnd(0, 4) * 100 + rnd(0, 99), step: 100 }), Q.pattern({ start: rnd(5, 9) * 100 + rnd(0, 99), step: -100 }), Q.patternRule({ start: rnd(5, 9) * 100 + rnd(0, 99), step: pick([100, -100, 10]) }), Q.pattern({ start: rnd(0, 4) * 100 + rnd(0, 99), step: 100, blank: 0 }), Q.patternRule({ start: rnd(1, 9) * 10 + 500, step: pick([5, -5, 100]) })] }
];
/* ---------- Grade 2 Chapter 1 boss: ข้อสอบท้ายหน่วย — แต่งใหม่ทั้งหมด ---------- */
const EXAM_P2C1 = xrot([
  { q: 'ข้อใดเป็นจำนวนเดียวกันทั้งหมด', opts: ['๕๓๔   534   ห้าร้อยสามสิบสี่', '๔๑๙   491   สี่ร้อยเก้าสิบเอ็ด', '628   ๖๘๒   หกร้อยยี่สิบแปด'], a: 0 },
  { q: '935 ตัวเลข 9 กับตัวเลข 5 มีค่าต่างกันเท่าไร', opts: ['4', '895', '904'], a: 1 },
  { q: 'จำนวนใดอยู่ระหว่าง 318 กับ 390 ทุกจำนวน', opts: ['325   347   389', '309   352   371', '334   366   394'], a: 0 },
  { q: 'จำนวนใดมีค่าน้อยกว่า 604 ทุกจำนวน', opts: ['599   611   587', '603   540   598', '640   602   600'], a: 1 },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['947 = 900 + 40 + 7', '508 = 500 + 80', '360 = 300 + 60'], a: 1 },
  { q: '418 &lt; ☐ &lt; 506 ควรเติมจำนวนใดลงใน ☐', opts: ['409', '473', '560'], a: 1, legend: true },
  { q: 'ตัวเลข 4 ในข้อใดมีค่าต่างจากข้ออื่น', opts: ['147', '645', '432'], a: 2 },
  { q: 'ข้อใดเรียงลำดับจำนวนจากน้อยไปมาก', opts: ['219   384   607', '530   305   503', '962   629   296'], a: 0 },
  { q: 'ข้อใดถูกต้อง', opts: ['406 > 400 + 6', '581 = 500 + 80 + 1', '730 < 700 + 3'], a: 1, legend: true },
  { q: '“บ้านต้นมีมะม่วง 408 ผล บ้านฝนมีมะม่วง 395 ผล” ข้อใดถูกต้อง', opts: ['บ้านฝนมีมะม่วงมากกว่าบ้านต้น', 'บ้านต้นมีมะม่วงมากกว่าบ้านฝน', 'ทั้งสองบ้านมีมะม่วงเท่ากัน'], a: 1 },
  { q: 'ข้อใดถูกต้อง', opts: ['618 > 681', '374 < 347', '829 > 828'], a: 2, legend: true },
  { q: 'ข้อใดควรใส่เครื่องหมาย &gt; ลงใน ☐', opts: ['267 ☐ 276', '590 ☐ 509', '314 ☐ 341'], a: 1, legend: true },
  { q: '630 น้อยกว่า 633 อยู่เท่าไร', opts: ['3', '30', '303'], a: 0 },
  { q: 'จำนวนในข้อใดมีค่ามากที่สุด', opts: ['489', '948', '894'], a: 1 },
  { q: 'ตัวเลข 3 ในข้อใดอยู่ในหลักร้อยทั้งหมด', opts: ['312   389   305', '231   634   738', '356   193   830'], a: 0 },
  { q: 'ข้อใดเป็นการนับเพิ่มทีละ 10', opts: ['415   420   425   430', '206   216   226   236', '580   680   780   880'], a: 1 },
  { q: 'ข้อใดเป็นการนับลดทีละ 100', opts: ['870   860   850   840', '533   531   529   527', '947   847   747   647'], a: 2 },
  { q: '540  545  550  555 ถ้านับต่อไปอีก จำนวนถัดไปคือข้อใด', opts: ['556', '560', '565'], a: 1 },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['1,000 เป็นจำนวนที่นับต่อจาก 999', '486 ตัวเลข 8 มีค่า 80', '๓๗๒ กับ 327 เป็นจำนวนเดียวกัน'], a: 2 },
  { q: 'ข้อใดถูกต้อง', opts: ['หกร้อยสี่ เขียนเป็นตัวเลขได้ 640', '815 ตัวเลข 1 อยู่ในหลักสิบ', '279 ตัวเลข 9 มีค่า 90'], a: 1 }
], 1);
LESSONS_P2C1.push({
  id: 59, boss: true, place: 'หาดพันจำนวน', title: 'ด่านบอส: ข้อสอบ ป.2 หน่วยที่ 1 จำนวนไม่เกิน 1,000', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'ทำข้อสอบท้ายหน่วยที่ 1 จำนวน 20 ข้อ ตอบถูกอย่างน้อย 10 ข้อเพื่อชนะบอส',
  exam: EXAM_P2C1, pass: 10, bossName: 'ปีศาจปลาหมึก', bossPal: 'magenta', emblem: '1000', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกแล้ว! มันว่ายหนีลงทะเลไปแล้ว', loseLine: 'ปีศาจปลาหมึกยังครองชายหาดอยู่ สู้ใหม่นะ!'
});
function triple100(n) { const f = (cls, head, v) => h('div', { class: 'f ' + cls }, h('div', { class: 'h' }, head), h('div', { class: 'v' }, v)); return h('div', { class: 'forms sm' }, f('a', 'ฮินดูอารบิก', fmt(n)), f('t', 'ตัวเลขไทย', thai(fmt(n))), f('w', 'ตัวหนังสือ', thaiWords(n))); }

/* =========================================================
   GRADE 3 · CHAPTER 1 — จำนวนนับไม่เกิน 100,000  (ป่าดิบชื้น)
   ========================================================= */
/* live abacus: tap a rod or press + − ; ten beads trade up to the next rod */
function abacusMachine(start = 3456, rods = 5, opts = {}) {
  const ds = String(start).padStart(rods, '0').split('').map(Number), names = ROD_NAMES.slice(-rods);
  const vis = h('div', { class: 'abacus big ia' }), inner = h('div', { class: 'colstack am-in' }), out = h('div', { class: 'colstack am-out' }, inner), note = h('div', { class: 'carry-note' });
  const val = () => +ds.join('');
  let prev = null;
  const draw = hi => {
    vis.innerHTML = abacusSVG(val(), { rods, hi, prev }); prev = ds.slice();
    vis.querySelectorAll('.rod').forEach(r => { r.style.cursor = 'pointer'; r.onclick = ev => { ev.stopPropagation(); add(+r.dataset.i, 1); }; });
    const n = val(); inner.innerHTML = '';
    inner.append(h('div', { class: 'bignum sm' }, fmt(n)), h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.3vw,28px)', color: 'var(--mint-2)' } }, thaiWords(n)), h('div', { class: 'word', style: { fontSize: 'clamp(22px,2.8vw,32px)', color: 'var(--sky-2)' } }, thai(fmt(n))));
    if (opts.expand) { const p = String(n).split('').map((d, i, a) => +d * 10 ** (a.length - 1 - i)).filter(Boolean).map(fmt); inner.append(h('div', { class: 'expline num' }, p.length > 1 ? `${fmt(n)} = ${p.join(' + ')}` : fmt(n))); }
    requestAnimationFrame(fitOut);
  };
  /* v121: ช่องคำอ่านสูงคงที่ (เท่าลูกคิด) — ถ้าคำอ่านยาวจนล้น ย่อตัวอักษรในช่องลงเอง ลูกคิดและปุ่มจึงไม่ขยับ */
  const fitOut = () => { if (!out.isConnected) return; inner.style.zoom = ''; const H = out.clientHeight, W = out.clientWidth; if (!H) return; const r = Math.min(1, H / (inner.scrollHeight || 1), W / (inner.scrollWidth || 1)); if (r < 1) inner.style.zoom = Math.max(.5, r * .98).toFixed(3); };
  if (window.ResizeObserver) new ResizeObserver(() => fitOut()).observe(out);
  const flash = t => { note.innerHTML = t; note.classList.remove('on'); void note.offsetWidth; note.classList.add('on'); };
  function add(i, d) {
    let j = i;
    if (d > 0) { while (j >= 0 && ds[j] === 9) j--; if (j < 0) { sfx.no(); flash('ลูกคิดเต็มทุกแกนแล้ว'); return; } for (let k = j + 1; k <= i; k++) ds[k] = 0; ds[j]++;
      if (j < i) { flash(j < i - 1 ? `ครบ 10 ลูกต่อกันหลายแกน → แลกขึ้นไปจนถึงหลัก<b>${names[j]}</b>` : `หลัก${names[i]}ครบ <b>10 ลูก</b> → แลกเป็น <b>1 ลูก</b>ในหลัก${names[j]}`); sfx.win(); } }
    else { while (j >= 0 && ds[j] === 0) j--; if (j < 0) { sfx.no(); return; } for (let k = j + 1; k <= i; k++) ds[k] = 9; ds[j]--;
      if (j < i) flash(`แลก <b>1 ลูก</b>ในหลัก${names[j]} เป็น <b>10 ลูก</b>ในหลัก${names[j + 1]} แล้วเอาออก 1 ลูก`); }
    draw(i); sfx.pop(ds[i]); say(thaiWords(val()), true);
  }
  const ctl = i => h('div', { class: 'am-ctl' }, h('div', { class: 'cap', style: { color: ROD_COL.slice(-rods)[i][1] } }, names[i]),
    h('button', { class: 'btn icon sm ia', 'aria-label': 'เพิ่ม' + names[i], onclick: ev => { ev.stopPropagation(); add(i, 1); } }, PM('+')),
    h('button', { class: 'btn icon sm ia', 'aria-label': 'ลด' + names[i], onclick: ev => { ev.stopPropagation(); add(i, -1); } }, PM('-')));
  draw();
  return h('div', { class: 'colstack am-wrap' }, h('div', { class: 'am-row' }, vis, out), h('div', { class: 'am-ctls' }, ...names.map((_, i) => ctl(i))), note); // v121 (ผู้ใช้ขอ): ลูกคิดอยู่ช่องของตัวเอง — คำอ่านยาว/สั้นไม่ทำให้ลูกคิดขยับ
}
/* tap each digit: its place, its value, and the expanded form builds up */
function placeTap5(n) {
  const s = String(n), c = placeChart(n), note = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.4vw,28px)' } }, 'แตะเลขโดดทีละตัว');
  const toks = [fmt(n), '=']; const bi = {}; let nb = 0;
  s.split('').forEach((d, i) => { if (+d) { if (nb) toks.push('+'); toks.push('?'); bi[i] = nb++; } });
  const e = eqRow(toks, { sm: true });
  c.querySelectorAll('.pc').forEach((pc, i) => { pc.classList.add('ia'); pc.style.cursor = 'pointer'; pc.onclick = ev => { ev.stopPropagation(); c.querySelectorAll('.pc').forEach(x => x.classList.remove('on')); pc.classList.add('on');
    const d = +s[i], v = valOf(n, i), pn = placeOf(n, i);
    note.innerHTML = d ? `${d} อยู่ใน<b>${pn}</b> มีค่า <span class="hl">${fmt(v)}</span>` : `0 อยู่ใน<b>${pn}</b> มีค่า 0 ไม่ต้องเขียนในรูปกระจาย`;
    if (d) e.fill(fmt(v), bi[i]); sfx.pop(i); say(d ? `${WORD[d]} อยู่ใน${pn} มีค่า ${thaiWords(v)}` : `ศูนย์ อยู่ใน${pn} มีค่าศูนย์`, true); }; });
  return h('div', { class: 'colstack' }, c, note, e);
}
/* step through the places from the left until the digits differ */
function compareStep(a, b) {
  const k = Math.max(String(a).length, String(b).length), A = placeChart(a, { places: k }), Bc = placeChart(b, { places: k });
  const note = h('div', { class: 'word', style: { fontSize: 'clamp(18px,2.4vw,28px)' } }, 'เริ่มเทียบจากหลักซ้ายสุด'), res = h('div');
  const sa = String(a).padStart(k, '0'), sb = String(b).padStart(k, '0'); let i = 0;
  const btn = h('button', { class: 'btn info ia', onclick: ev => { ev.stopPropagation();
    [A, Bc].forEach(c => c.querySelectorAll('.pc').forEach((pc, j) => pc.classList.toggle('on', j === i)));
    const pn = PLACE[6 - k + i];
    if (sa[i] === sb[i]) { note.innerHTML = `${pn} เท่ากัน (${sa[i]} กับ ${sb[i]}) → เทียบหลักถัดไป`; sfx.pop(i); }
    if (sa[i] !== sb[i] || i === k - 1) { const rel = a > b ? '>' : a < b ? '<' : '=';
      note.innerHTML = rel === '=' ? 'ทุกหลักเท่ากัน จำนวนทั้งสองเท่ากัน' : `${pn}: ${sa[i]} ${rel === '>' ? 'มากกว่า' : 'น้อยกว่า'} ${sb[i]} ดังนั้น`;
      res.append(eqRow([fmt(a), rel, fmt(b)])); btn.remove(); sfx.ok(); say(`${thaiWords(a)} ${rel === '>' ? 'มากกว่า' : rel === '<' ? 'น้อยกว่า' : 'เท่ากับ'} ${thaiWords(b)}`, true); return; }
    i++; } }, icon('right'), 'เทียบทีละหลัก');
  return h('div', { class: 'colstack' }, A, Bc, note, res, btn);
}
/* numbers with the difference between neighbours */
function diffStrip(vals) {
  const w = h('div', { class: 'nstrip diff' });
  vals.forEach((v, i) => { if (i) { const d = v - vals[i - 1]; w.append(h('span', { class: 'df num', style: { animationDelay: i * .3 + 's' } }, (d > 0 ? '+' : '−') + fmt(Math.abs(d)))); } w.append(h('div', { class: 'ns' }, fmt(v))); });
  return w;
}
const R5 = () => rnd(10000, 99999), R4 = () => rnd(1001, 9999), PK = (a, k) => shuffle(a).slice(0, k);
const TRUTHS = [
  { text: '50,948 อ่านว่า <b>ห้าหมื่นเก้าพันสี่สิบแปด</b>', ok: false, hint: '50,948 มี 9 อยู่ในหลักร้อย อ่านว่า ห้าหมื่นเก้าร้อยสี่สิบแปด' },
  { text: '97,857 เขียนเป็นตัวเลขไทย คือ <b class="thn">๙๗,๘๕๗</b>', ok: true, hint: 'แปลงทีละตัว: 9=๙ 7=๗ 8=๘ 5=๕ 7=๗' },
  { text: '<span class="thn">๒๐,๑๑๓</span> อ่านว่า <b>สองหมื่นหนึ่งร้อยสิบสาม</b>', ok: true, hint: '๒๐,๑๑๓ = 20,113' },
  { text: '<span class="thn">๔๒,๕๖๗</span> เขียนเป็นตัวเลขฮินดูอารบิก คือ <b>42,237</b>', ok: false, hint: '๔๒,๕๖๗ = 42,567' },
  { text: 'เก้าหมื่นหนึ่งพัน เขียนเป็นตัวเลขฮินดูอารบิก คือ <b>90,100</b>', ok: false, hint: 'เก้าหมื่นหนึ่งพัน = 91,000 ส่วน 90,100 อ่านว่า เก้าหมื่นหนึ่งร้อย' },
  { text: '<span class="thn">๓๖,๘๘๔</span> อ่านว่า <b>สามหมื่นหกพันแปดร้อยแปดสิบสี่</b>', ok: true, hint: '๓๖,๘๘๔ = 36,884' },
  { text: '59,091 เขียนเป็นตัวเลขไทย คือ <b class="thn">๕๙,๐๙๑</b>', ok: true, hint: 'แปลงทีละตัว 5 9 0 9 1' },
  { text: 'หกหมื่นสี่พันยี่สิบห้า เขียนเป็นตัวเลขฮินดูอารบิก คือ <b>64,025</b>', ok: true, hint: 'หกหมื่น สี่พัน ไม่มีร้อย ยี่สิบ ห้า = 64,025' }
];
const SEQS = [[463, 470, 477, 484, 491], [178, 175, 172, 169, 166], [897, 888, 879, 870, 861], [500, 506, 512, 518, 524], [481, 473, 465, 457, 449], [200, 215, 230, 245, 260], [562, 566, 570, 574, 578], [999, 996, 993, 990, 987], [138, 150, 162, 174, 186], [323, 348, 373, 398, 423], [749, 738, 727, 716, 705]];
const SEQ_NEXT = [[890, 896, 902, 908], [567, 597, 627, 657], [633, 655, 677, 699], [283, 274, 265, 256], [710, 706, 702, 698], [100, 200, 300, 400], [345, 381, 417, 453]];
const CMP_DIFF = [[50948, 5409], [97235, 9458], [7326, 43587], [27635, 1159], [2762, 78621], [3769, 37486], [44298, 22786], [63564, 3750]];
const CMP_SAME = [[87560, 87560], [62436, 36732], [34587, 58173], [50348, 55409], [69840, 69845], [34878, 37576], [40360, 40340], [61834, 74657], [98547, 98745], [27168, 27168], [54311, 54310], [73466, 34033], [37846, 37846], [29701, 29702], [48746, 48740], [59726, 97842], [34786, 60019], [50000, 60000], [10498, 10495]];
const CMP_EXP = [{ a: 50050, ea: '50,000 + 50', b: 44987 }, { a: 19875, b: 19075, eb: '10,000 + 9,000 + 70 + 5' }, { a: 78904, ea: '70,000 + 8,000 + 900 + 4', b: 79049 }, { a: 28946, b: 34000, eb: '30,000 + 4,000' }, { a: 61834, ea: '60,000 + 1,000 + 800 + 30 + 4', b: 71948 }, { a: 69509, b: 69500, eb: '60,000 + 9,000 + 500 + 0' }, { a: 88400, ea: '80,000 + 8,000 + 400', b: 88004, eb: '80,000 + 8,000 + 4' }];
const ORD_ASC = [[54762, 23765, 28674, 27653], [38587, 98763, 34722, 34872], [84364, 63463, 27542, 12000], [45623, 45328, 36532, 45622], [63541, 63530, 63550, 63540, 63555], [45868, 37804, 34675, 82854, 82403]];
const ORD_DESC = [[54987, 54985, 54981, 54990], [11386, 20000, 73264, 87063], [43786, 53642, 47652, 27352], [74027, 74029, 74023, 74020], [39208, 21326, 38632, 47652, 89237], [64700, 64704, 64730, 64788, 64787]];
const LESSONS_P3C1 = [
  { id: 101, place: 'ป่าหมื่นใบไม้', title: 'จำนวนนับไม่เกิน 10,000', short: 'จำนวนไม่เกิน 10,000', tone: 'mint',
    goal: 'บอกจำนวน อ่านและเขียนตัวเลขฮินดูอารบิก ตัวเลขไทย ตัวหนังสือ แสดงจำนวนนับไม่เกิน 10,000 ได้',
    teach: [
      { t: 'ยินดีต้อนรับสู่ <b>ป่าดิบชื้น ป.3</b>! ด่านแรก <b>ป่าหมื่นใบไม้</b> มารู้จักจำนวนที่ใหญ่ขึ้นกัน', s: 'ยินดีต้อนรับสู่ป่าดิบชื้น ป สาม ด่านแรก ป่าหมื่นใบไม้ มารู้จักจำนวนที่ใหญ่ขึ้นกัน', v: el => el.append(mascot('wow', 'big')) },
      { t: 'นับเพิ่ม<b>ทีละพัน</b>: 1,000 2,000 3,000 … กดดูทีละจำนวน', s: 'นับเพิ่มทีละพัน กดดูทีละจำนวน', v: el => el.append(hopStrip(1000, 1000, 10)) },
      { t: '<b>สิบพัน</b> เท่ากับ <span class="hl">หนึ่งหมื่น</span> เขียน 10,000 ตัวเลขไทย ๑๐,๐๐๐', s: 'สิบพัน เท่ากับหนึ่งหมื่น', v: el => el.append(abacus(10000, { rods: 5 }), triple100(10000)) },
      { t: 'เครื่องมือใหม่: <b>ลูกคิด</b> แต่ละแกนคือ 1 หลัก <b>แตะแกน</b>หรือกด + − สร้างจำนวนดูนะ', s: 'เครื่องมือใหม่ ลูกคิด แต่ละแกนคือหนึ่งหลัก แตะแกนหรือกดบวกลบ สร้างจำนวนดูนะ', v: el => el.append(abacusMachine(3456, 4)) },
      { t: 'ลูกคิดครบ <b>10 ลูก</b> ต้องแลกเป็น 1 ลูกในแกนทางซ้าย ลองกด <b>+ ที่หลักหน่วย</b> ดูว่า 9,999 เพิ่มอีก 1 เป็นเท่าไร', s: 'ลูกคิดครบสิบลูก ต้องแลกเป็นหนึ่งลูกในแกนทางซ้าย ลองกดบวกที่หลักหน่วย', v: el => el.append(abacusMachine(9999, 5)) },
      { t: 'หลักที่เป็น 0 ไม่ต้องอ่าน: 4,075 อ่านว่า “สี่พันเจ็ดสิบห้า” แต่ตอนเขียนต้องใส่ 0 ในหลักร้อย', s: 'หลักที่เป็นศูนย์ไม่ต้องอ่าน สี่พันเจ็ดสิบห้า', v: el => el.append(abacus(4075, { rods: 4 }), triple100(4075)) }
    ],
    game: () => [Q.abacusRead({ n: R4(), rods: 4 }), Q.writeDigits({ n: R4() }), Q.readWords({ n: R4() }), Q.abacusRead({ n: R4(), ask: 'thai', rods: 4 }), Q.writeDigits({ n: pick([2005, 4070, 6300, 8019, 10000, 7600]), from: pick(['word', 'thai']) }), Q.match5({ nums: PK(range(1001, 9999), 3) })] },
  { id: 102, place: 'ป่าแสนต้นไม้', title: 'จำนวนนับไม่เกิน 100,000', short: 'จำนวนไม่เกิน 100,000', tone: 'mint',
    goal: 'บอกจำนวน อ่านและเขียนตัวเลขฮินดูอารบิก ตัวเลขไทย ตัวหนังสือ แสดงจำนวนนับไม่เกิน 100,000 ได้',
    teach: [
      { t: 'นับเพิ่ม<b>ทีละหมื่น</b>: 10,000 20,000 30,000 … กดดูทีละจำนวน', s: 'นับเพิ่มทีละหมื่น กดดูทีละจำนวน', v: el => el.append(hopStrip(10000, 10000, 10)) },
      { t: '<b>สิบหมื่น</b> เท่ากับ <span class="hl">หนึ่งแสน</span> เขียน 100,000 เป็นจำนวนหกหลัก', s: 'สิบหมื่น เท่ากับหนึ่งแสน', v: el => el.append(abacus(100000, { rods: 6 }), triple100(100000)) },
      { t: 'ลูกคิด 5 แกน: <b>หมื่น พัน ร้อย สิบ หน่วย</b> ลองสร้างจำนวนห้าหลักดูนะ', s: 'ลูกคิดห้าแกน หมื่น พัน ร้อย สิบ หน่วย ลองสร้างจำนวนห้าหลักดูนะ', v: el => el.append(abacusMachine(64701, 5)) },
      { t: 'อ่านทีละส่วน: 64,701 = หกหมื่น · สี่พัน · เจ็ดร้อย · เอ็ด → “หกหมื่นสี่พันเจ็ดร้อยเอ็ด”', v: el => el.append(placeChart(64701), triple100(64701)) },
      { t: 'ระวัง 0: 90,211 อ่านว่า “เก้าหมื่นสองร้อยสิบเอ็ด” ไม่อ่านหลักพัน แต่เขียน 0 ไว้', v: el => el.append(placeChart(90211, { hi: 1 }), triple100(90211)) },
      { t: 'ตัวเลขไทย ๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙ เขียนแทนได้ทีละตัว: ๓๔,๒๓๗ = 34,237', v: el => el.append(h('div', { class: 'thmap' }, ...range(0, 9).map(d => h('span', null, h('b', { class: 'thn' }, TH_DIG[d]), h('i', { class: 'num' }, d)))), triple100(34237)) }
    ],
    game: () => [Q.abacusRead({ n: pick([48704, 51306, 49872, R5()]) }), Q.writeDigits({ n: pick([89122, 63970, 55228]) }), Q.writeDigits({ n: pick([34237, 90211, 77063, 70457, 51308]), from: 'thai' }), Q.readWords({ n: pick([67300, 23965, 16486, 83086, 30173]), from: pick(['digit', 'abacus']) }), Q.truth(pick(TRUTHS)), Q.toThai({ n: pick([48704, 10985, 89754, 40350]) }), Q.match5({ nums: PK([54908, 68597, 45814, 63770, 52769], 3) })] },
  { id: 103, place: 'ป่าห้าหลัก', title: 'หลักและค่าของเลขโดดในแต่ละหลักของจำนวนนับไม่เกิน 100,000', short: 'หลักและค่า', tone: 'sky',
    goal: 'บอกหลัก ค่าของเลขโดดในแต่ละหลัก และเขียนตัวเลขแสดงจำนวนในรูปกระจายได้',
    teach: [
      { t: 'จำนวนห้าหลักมี <b>หลักหมื่น หลักพัน หลักร้อย หลักสิบ หลักหน่วย</b> — <b>แตะเลขโดดทีละตัว</b>', s: 'จำนวนห้าหลักมีหลักหมื่น หลักพัน หลักร้อย หลักสิบ หลักหน่วย แตะเลขโดดทีละตัว', v: el => el.append(placeTap5(98753)) },
      { t: 'เลขโดดเดียวกัน อยู่ต่างหลัก <b>ค่าไม่เท่ากัน</b>: 77,777', v: el => el.append(placeChart(77777, { values: true })) },
      { t: '<b>รูปกระจาย</b> = ค่าของเลขโดดแต่ละหลักบวกกัน หลักที่เป็น 0 ไม่ต้องเขียน: 45,705 = 40,000 + 5,000 + 700 + 5', v: el => el.append(placeChart(45705, { values: true }), eqRow(['45,705', '=', '40,000', '+', '5,000', '+', 700, '+', 5], { sm: true })) },
      { t: '<b>ลองบนลูกคิด</b>: เพิ่ม ลด ลูกคิด แล้วดูรูปกระจายเปลี่ยนตาม', s: 'ลองบนลูกคิด เพิ่ม ลด ลูกคิด แล้วดูรูปกระจายเปลี่ยนตาม', v: el => el.append(abacusMachine(36119, 5, { expand: true })) }
    ],
    game: () => { const ws = [98753, 50172, 36119, 45705, 22930, 47861, 82134, 96083]; const ul = pick([[87490, 2], [97412, 4], [37098, 1], [38613, 0]]);
      return [Q.digitValue({ n: pick(ws) }), Q.digitPlace({ n: pick(ws) }), Q.digitValue({ n: ul[0], i: ul[1], underline: true }), Q.expanded5({ n: pick([49709, 90472, 32146, 10438, 64800]) }), Q.pickExpanded5({ n: pick([34586, 49506, 59800, 11028, 94597]) }), Q.fromExpanded({ n: pick([29547, 63711, 30598, 83755, 73082]) })]; } },
  { id: 104, place: 'ป่าเทียบจำนวน', title: 'การเปรียบเทียบจำนวน', short: 'เปรียบเทียบจำนวน', tone: 'coral',
    goal: 'เปรียบเทียบจำนวนนับไม่เกิน 100,000 และใช้เครื่องหมาย > < = ได้',
    teach: [
      { t: 'จำนวนที่มี<b>หลักมากกว่า</b>มีค่ามากกว่า: 50,948 (ห้าหลัก) กับ 5,409 (สี่หลัก)', v: el => el.append(placeChart(50948), placeChart(5409, { places: 5 }), eqRow(['50,948', '>', '5,409'])) },
      { t: 'จำนวนหลักเท่ากัน <b>เทียบจากหลักซ้ายสุด</b>ทีละหลัก — กดปุ่มดู', s: 'จำนวนหลักเท่ากัน เทียบจากหลักซ้ายสุดทีละหลัก กดปุ่มดู', v: el => el.append(compareStep(98547, 98745)) },
      { t: 'ลองอีกคู่: 54,311 กับ 54,310', v: el => el.append(compareStep(54311, 54310)) },
      { t: 'ถ้าเป็น<b>รูปกระจาย</b> ให้รวมเป็นจำนวนก่อน: 50,000 + 50 = 50,050 ซึ่งมากกว่า 44,987', v: el => el.append(eqRow(['50,000', '+', 50, '=', '50,050'], { sm: true }), eqRow(['50,050', '>', '44,987'])) }
    ],
    game: () => { const d = PK(CMP_DIFF, 2), sm = PK(CMP_SAME, 2), ex = pick(CMP_EXP);
      return [Q.compare5({ a: d[0][0], b: d[0][1] }), Q.compare5({ a: sm[0][0], b: sm[0][1] }), Q.compare5({ ...ex, eq: false }), Q.compare5({ a: sm[1][0], b: sm[1][1] }), Q.extreme({ nums: pick(ORD_ASC), which: pick(['max', 'min']) }), Q.compare5({ a: d[1][0], b: d[1][1] })]; } },
  { id: 105, place: 'ป่าเรียงแถว', title: 'การเรียงลำดับจำนวน', short: 'เรียงลำดับจำนวน', tone: 'lilac',
    goal: 'เรียงลำดับจำนวนนับไม่เกิน 100,000 จากน้อยไปมาก และจากมากไปน้อยได้',
    teach: [
      { t: 'เรียง<b>น้อยไปมาก</b>: หาจำนวนที่น้อยที่สุดก่อน — บนเส้นจำนวน จำนวนทางซ้ายน้อยกว่า', v: el => el.append(orderLine([23765, 27653, 28674, 54762], 60000, 20000), numStrip([23765, 27653, 28674, 54762])) },
      { t: 'เรียง<b>มากไปน้อย</b>: หาจำนวนที่มากที่สุดก่อน', v: el => el.append(numStrip([87063, 73264, 20000, 11386])) },
      { t: 'จำนวนใกล้กันมาก ให้เทียบทีละหลัก: ดูแค่<b>หลักหน่วย</b>ก็พอ', v: el => el.append(orderLine([54981, 54985, 54987, 54990], 54990, 54980)) },
      { t: '<b>ลองเรียงเอง</b> จากน้อยไปมาก', s: 'ลองเรียงเอง จากน้อยไปมาก', v: el => el.append(orderDemo([45623, 45328, 36532, 45622], 'asc')) }
    ],
    game: () => { const a = PK(ORD_ASC, 2), d = PK(ORD_DESC, 2);
      return [Q.order({ nums: a[0], dir: 'asc' }), Q.order({ nums: d[0], dir: 'desc' }), Q.between({ lo: pick([9675, 30000, 45021, 59216]), hi: pick([60765, 84355, 100000]) }), Q.order({ nums: a[1], dir: 'asc' }), Q.extreme({ nums: pick(ORD_DESC), which: pick(['max', 'min']) }), Q.order({ nums: d[1], dir: 'desc' })]; } },
  { id: 106, place: 'ป่าก้าวเท่ากัน', title: 'แบบรูปของจำนวนที่เพิ่มขึ้นหรือลดลงทีละเท่า ๆ กัน', short: 'แบบรูปของจำนวน', tone: 'orange',
    goal: 'บอกจำนวนที่หายไปในแบบรูปของจำนวนที่เพิ่มขึ้นหรือลดลงทีละเท่า ๆ กัน และบอกความสัมพันธ์ในแบบรูปได้',
    teach: [
      { t: '<b>เพิ่มขึ้นทีละเท่า ๆ กัน</b>: 463, 470, 477, … กดดูทีละจำนวน', s: 'เพิ่มขึ้นทีละเท่า ๆ กัน กดดูทีละจำนวน', v: el => el.append(hopStrip(463, 7, 6)) },
      { t: '<b>ลดลงทีละเท่า ๆ กัน</b>: 178, 175, 172, …', v: el => el.append(hopStrip(178, -3, 6)) },
      { t: 'วิธีหา: <b>ลบจำนวนที่อยู่ติดกัน</b> จะรู้ว่าเพิ่มหรือลดทีละเท่าไร', v: el => el.append(diffStrip([897, 888, 879, 870, 861])) },
      { t: 'จำนวนใหญ่ก็ใช้วิธีเดียวกัน: เพิ่มขึ้นทีละ 1,000', v: el => el.append(hopStrip(45000, 1000, 6)) },
      { t: 'หาจำนวนที่หายไป: 500, ?, 512, 518, 524 → เพิ่มขึ้นทีละ 6', v: el => el.append(numStrip([500, 506, 512, 518, 524], [1]), revealBtn(eqRow([500, '+', 6, '=', '?'], { sm: true }), 506)) }
    ],
    game: () => { const sq = PK(SEQS, 4), nx = pick(SEQ_NEXT);
      return [Q.seqFill({ vals: sq[0], blank: rnd(1, 4) }), Q.seqFill({ vals: sq[1], blank: rnd(1, 3) }), Q.seqRule({ vals: sq[2] }), Q.seqFill({ vals: [...nx, nx[3] + nx[1] - nx[0]], blank: 4 }), Q.seqFill({ vals: sq[3], blank: 0 }), Q.seqFill({ vals: (s => range(0, 4).map(i => s + i * 500))(rnd(20, 180) * 100), blank: rnd(1, 4) })]; } }
];
/* ---------- Grade 3 Chapter 1 boss: built from our own practice items ---------- */
const EXAM_P3C1 = [
  { q: 'ข้อใดเป็นจำนวนเดียวกันทั้งหมด', opts: ['48,704   ๔๘,๗๐๔   สี่หมื่นแปดพันเจ็ดร้อยสี่', '34,237   ๓๔,๒๗๓   สามหมื่นสี่พันสองร้อยสามสิบเจ็ด', '10,985   ๑๐,๙๘๕   หนึ่งหมื่นเก้าพันแปดสิบห้า'], a: 0 },
  { q: 'หกหมื่นสามพันเก้าร้อยเจ็ดสิบ เขียนเป็นตัวเลขฮินดูอารบิกได้อย่างไร', opts: ['63,907', '63,970', '60,397'], a: 1 },
  { q: '๗๗,๐๖๓ อ่านว่าอย่างไร', opts: ['เจ็ดหมื่นเจ็ดพันหกสิบสาม', 'เจ็ดหมื่นเจ็ดพันหกร้อยสาม', 'เจ็ดพันเจ็ดร้อยหกสิบสาม'], a: 0 },
  { q: 'หนึ่งแสน เขียนเป็นตัวเลขฮินดูอารบิกได้อย่างไร', opts: ['10,000', '100,000', '1,000,000'], a: 1 },
  { q: 'ข้อใด<b>ไม่ถูกต้อง</b>', opts: ['50,948 อ่านว่า ห้าหมื่นเก้าพันสี่สิบแปด', '97,857 เขียนเป็นตัวเลขไทย คือ ๙๗,๘๕๗', '59,091 เขียนเป็นตัวเลขไทย คือ ๕๙,๐๙๑'], a: 0 },
  { q: '87,490 ตัวเลข 4 อยู่ในหลักใด และมีค่าเท่าไร', opts: ['หลักร้อย มีค่า 400', 'หลักพัน มีค่า 4,000', 'หลักสิบ มีค่า 40'], a: 0 },
  { q: '97,412 ตัวเลข 2 มีค่าเท่าไร', opts: ['2', '20', '200'], a: 0 },
  { q: '37,098 ตัวเลข 7 มีค่าเท่าไร', opts: ['700', '7,000', '70,000'], a: 1 },
  { q: '38,614 ตัวเลข 3 มีค่าเท่าไร', opts: ['3,000', '30,000', '30'], a: 1 },
  { q: 'ข้อใดเป็นรูปกระจายของ 49,709', opts: ['40,000 + 9,000 + 700 + 9', '40,000 + 9,000 + 70 + 9', '4,000 + 900 + 70 + 9'], a: 0 },
  { q: '60,000 + 4,000 + 800 เท่ากับจำนวนใด', opts: ['64,080', '64,800', '60,480'], a: 1 },
  { q: 'ข้อใดถูกต้อง', opts: ['50,948 < 5,409', '7,326 < 43,587', '87,560 > 87,560'], a: 1, legend: true },
  { q: 'ข้อใดควรเติมเครื่องหมาย &gt; ลงใน ☐', opts: ['98,547 ☐ 98,745', '54,311 ☐ 54,310', '29,701 ☐ 29,702'], a: 1, legend: true },
  { q: '50,000 + 50 ☐ 44,987 ควรเติมเครื่องหมายใดลงใน ☐', opts: ['>', '<', '='], a: 0, legend: true },
  { q: 'จำนวนในข้อใดมีค่ามากที่สุด', opts: ['82,854', '82,403', '45,868'], a: 0 },
  { q: 'ข้อใดเรียงลำดับจำนวนจากน้อยไปมาก', opts: ['23,765   27,653   28,674   54,762', '34,872   34,722   38,587   98,763', '12,000   63,463   27,542   84,364'], a: 0 },
  { q: 'ข้อใดเรียงลำดับจำนวนจากมากไปน้อย', opts: ['74,020   74,023   74,027   74,029', '64,788   64,787   64,730   64,704', '89,237   39,208   47,652   38,632'], a: 1 },
  { q: '463   470   477   ☐   491  จำนวนใน ☐ คือข้อใด', opts: ['482', '484', '486'], a: 1 },
  { q: '178   175   172   169  เป็นแบบรูปของจำนวนที่เป็นอย่างไร', opts: ['เพิ่มขึ้นทีละ 3', 'ลดลงทีละ 3', 'ลดลงทีละ 4'], a: 1 },
  { q: '890   896   902  จำนวนถัดไปอีก 3 จำนวนคือข้อใด', opts: ['908   914   920', '906   910   914', '908   916   924'], a: 0 }
];
LESSONS_P3C1.push({
  id: 109, boss: true, place: 'ป่าแสนจำนวน', title: 'ด่านบอส: ป.3 บทที่ 1 จำนวนนับไม่เกิน 100,000', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'ตอบคำถามท้ายบท 20 ข้อ ตอบถูกอย่างน้อย 10 ข้อเพื่อชนะบอส',
  exam: spread(EXAM_P3C1), pass: 10, bossName: 'งูยักษ์ป่าดิบ', bossPal: 'jade', emblem: 'แสน', bossKind: 'snake',
  winLine: 'ชนะงูยักษ์แล้ว! มันเลื้อยหนีเข้าป่าลึกไปแล้ว', loseLine: 'งูยักษ์ยังขดตัวเฝ้าป่าดิบชื้นอยู่ สู้ใหม่นะ!'
});

/* ---------- cities ---------- */
const CITIES = [
  { id: 1, name: 'เมืองตัวเลข', chapter: 'บทที่ 1 จำนวนนับ 1 ถึง 10 และ 0', lessons: LESSONS_CH1,
    theme: { hills: ['#EAF5DC', '#E3F1E6', '#F2F0DC'], far: '#F3EEDD', edge: ['tree', 'house', 'pine', 'tree'], small: ['flowers', 'grass', 'bush', 'flowers', 'rock', 'grass'] } },
  { id: 2, name: 'เมืองบวกเลข', chapter: 'บทที่ 2 การบวกจำนวนสองจำนวนที่มีผลบวกไม่เกิน 10', lessons: LESSONS_CH2,
    theme: { hills: ['#FFE9DF', '#FDEFD9', '#F6EDE4'], far: '#FFF1E2', edge: ['palm', 'shop', 'palm', 'house'], small: ['flowers', 'rock', 'grass', 'flowers', 'bush', 'grass'] } },
  { id: 3, name: 'เมืองลบเลข', chapter: 'บทที่ 3 การลบจำนวนสองจำนวนที่ตัวตั้งไม่เกิน 10', lessons: LESSONS_CH3,
    theme: { hills: ['#E3EFFC', '#E6F3F4', '#EDEFFA'], far: '#EEF4FB', edge: ['pine', 'house', 'pine', 'tree'], small: ['rock', 'grass', 'flowers', 'rock', 'bush', 'grass'] } },
  { id: 6, grade: 1, name: 'เมืองนับถึงยี่สิบ', chapter: 'บทที่ 4 จำนวนนับ 11 ถึง 20', lessons: LESSONS_CH4,
    theme: { hills: ['#F3E9FB', '#FBEAF0', '#EEEAFB'], far: '#F7F0FC', edge: ['tree', 'shop', 'tree', 'house'], small: ['flowers', 'bush', 'grass', 'flowers', 'rock', 'bush'] } },
  { id: 7, grade: 1, name: 'เมืองบวกลบยี่สิบ', chapter: 'บทที่ 5 การบวก การลบ จำนวนนับไม่เกิน 20', lessons: LESSONS_CH5,
    theme: { hills: ['#E2F4EC', '#FFF0DE', '#E8F2E0'], far: '#F1F8EC', edge: ['pine', 'house', 'tree', 'shop'], small: ['bush', 'flowers', 'rock', 'grass', 'flowers', 'bush'] } },
  { id: 8, grade: 1, name: 'เมืองแผนภูมิ', chapter: 'บทที่ 6 แผนภูมิรูปภาพ', lessons: LESSONS_CH6,
    theme: { hills: ['#E4F0FB', '#FDEFE4', '#EAF6EE'], far: '#F2F6FB', edge: ['tree', 'shop', 'pine', 'house'], small: ['flowers', 'grass', 'bush', 'rock', 'flowers', 'grass'] } },
  { id: 9, grade: 1, name: 'เมืองตาชั่ง', chapter: 'บทที่ 7 การวัดน้ำหนัก', lessons: LESSONS_CH7,
    theme: { hills: ['#FFF3D6', '#FCEBD9', '#F3F0DA'], far: '#FFF8E6', edge: ['shop', 'tree', 'house', 'tree'], small: ['bush', 'flowers', 'rock', 'grass', 'flowers', 'bush'] } },
  { id: 10, grade: 1, term: 2, name: 'เมืองตำแหน่ง', chapter: 'บทที่ 8 การบอกตำแหน่งและอันดับที่', lessons: LESSONS_CH8,
    theme: { hills: ['#E2EEFC', '#E9F5EE', '#F1ECFB'], far: '#EEF4FC', edge: ['pine', 'house', 'tree', 'shop'], small: ['flowers', 'grass', 'rock', 'bush', 'grass', 'flowers'] } },
  { id: 11, grade: 1, term: 2, name: 'เมืองรูปทรง', chapter: 'บทที่ 9 รูปเรขาคณิต', lessons: LESSONS_CH9,
    theme: { hills: ['#F1ECFB', '#FCEBF1', '#EEF1FB'], far: '#F6F2FD', edge: ['house', 'tree', 'shop', 'pine'], small: ['flowers', 'rock', 'bush', 'flowers', 'grass', 'rock'] } },
  { id: 12, grade: 1, term: 2, name: 'เมืองร้อย', chapter: 'บทที่ 10 จำนวนนับ 21 ถึง 100', lessons: LESSONS_CH10,
    theme: { hills: ['#E3F6EC', '#EAF5DA', '#E4F1F8'], far: '#EEF8F1', edge: ['tree', 'pine', 'house', 'tree'], small: ['grass', 'flowers', 'bush', 'rock', 'grass', 'flowers'] } },
  { id: 13, grade: 1, term: 2, name: 'เมืองไม้บรรทัด', chapter: 'บทที่ 11 การวัดความยาว', lessons: LESSONS_CH11,
    theme: { hills: ['#FFF0DC', '#FDE9E4', '#F4F0DD'], far: '#FFF7EA', edge: ['house', 'tree', 'shop', 'pine'], small: ['flowers', 'grass', 'rock', 'bush', 'flowers', 'grass'] } },
  { id: 14, grade: 1, term: 2, name: 'เมืองบวกร้อย', chapter: 'บทที่ 12 การบวกที่ผลบวกไม่เกิน 100', lessons: LESSONS_CH12,
    theme: { hills: ['#FDE6E8', '#FBEFDA', '#EAF2FC'], far: '#FFF4F2', edge: ['tree', 'house', 'pine', 'shop'], small: ['bush', 'flowers', 'grass', 'rock', 'flowers', 'bush'] } },
  { id: 15, grade: 1, term: 2, name: 'เมืองลบร้อย', chapter: 'บทที่ 13 การลบจำนวนที่ตัวตั้งไม่เกิน 100', lessons: LESSONS_CH13,
    theme: { hills: ['#E4EFFC', '#EAF6EF', '#F3EEFB'], far: '#EEF5FD', edge: ['pine', 'tree', 'house', 'tree'], small: ['grass', 'rock', 'flowers', 'bush', 'grass', 'rock'] } },
  { id: 16, grade: 1, term: 2, name: 'เมืองโจทย์', chapter: 'บทที่ 14 โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ', lessons: LESSONS_CH14,
    theme: { hills: ['#F1EBFB', '#FBEFE0', '#E9F4EE'], far: '#F7F2FD', edge: ['shop', 'house', 'tree', 'pine'], small: ['flowers', 'bush', 'grass', 'rock', 'flowers', 'grass'] } },
  { id: 17, grade: 1, term: 2, name: 'ปราสาทราชาปีศาจ', chapter: 'ด่านสุดท้าย ป.1 · บอสใหญ่รวมร่าง', lessons: LESSONS_MEGA, final: true,
    theme: { hills: ['#E6E0F2', '#EFE6EE', '#E2E4F2'], far: '#EDE8F5', edge: ['pine', 'rock', 'pine', 'rock'], small: ['rock', 'grass', 'rock', 'bush', 'grass', 'rock'] } },
  { id: 4, grade: 2, name: 'ชายหาดจำนวนนับ', chapter: 'บทที่ 1 จำนวนนับไม่เกิน 1,000 และ 0', lessons: LESSONS_P2C1,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['palm', 'umbrella', 'palm', 'boat'], small: ['shell', 'starfish', 'crab', 'shell', 'lifebuoy', 'starfish'] } },
  { id: 40, grade: 2, name: 'ชายหาดบวกลบ', chapter: 'บทที่ 2 การบวกและการลบจำนวนนับไม่เกิน 1,000', lessons: LESSONS_P2C2,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['umbrella', 'palm', 'boat', 'palm'], small: ['crab', 'shell', 'starfish', 'lifebuoy', 'shell', 'crab'] } },
  { id: 41, grade: 2, name: 'ชายหาดวัดความยาว', chapter: 'บทที่ 3 การวัดความยาว', lessons: LESSONS_P2C3,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['palm', 'umbrella', 'palm', 'boat'], small: ['shell', 'starfish', 'crab', 'lifebuoy', 'crab', 'shell'] } },
  { id: 46, grade: 2, name: 'ชายหาดตาชั่ง', chapter: 'บทที่ 4 การวัดน้ำหนัก', lessons: LESSONS_P2C4,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['umbrella', 'palm', 'boat', 'palm'], small: ['crab', 'shell', 'starfish', 'lifebuoy', 'shell', 'crab'] } },
  { id: 47, grade: 2, name: 'ชายหาดสูตรคูณ', chapter: 'บทที่ 5 การคูณ', lessons: LESSONS_P2C5,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['palm', 'umbrella', 'palm', 'boat'], small: ['starfish', 'shell', 'crab', 'lifebuoy', 'starfish', 'shell'] } },
  { id: 48, grade: 2, term: 2, name: 'ชายหาดแบ่งเท่ากัน', chapter: 'บทที่ 6 การหาร', lessons: LESSONS_P2C6,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['umbrella', 'palm', 'boat', 'palm'], small: ['shell', 'crab', 'starfish', 'lifebuoy', 'crab', 'shell'] } },
  { id: 49, grade: 2, term: 2, name: 'ชายหาดนาฬิกา', chapter: 'บทที่ 7 เวลา', lessons: LESSONS_P2C7,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['palm', 'umbrella', 'palm', 'boat'], small: ['shell', 'starfish', 'crab', 'lifebuoy', 'shell', 'crab'] } },
  { id: 45, grade: 2, term: 2, name: 'ชายหาดตวงน้ำ', chapter: 'บทที่ 8 การวัดปริมาตร', lessons: LESSONS_P2C8,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['palm', 'boat', 'umbrella', 'palm'], small: ['shell', 'lifebuoy', 'starfish', 'crab', 'shell', 'lifebuoy'] } },
  { id: 42, grade: 2, term: 2, name: 'ชายหาดรูปเรขาคณิต', chapter: 'บทที่ 9 รูปเรขาคณิต', lessons: LESSONS_P2C9,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['umbrella', 'palm', 'boat', 'palm'], small: ['starfish', 'shell', 'lifebuoy', 'crab', 'shell', 'starfish'] } },
  { id: 43, grade: 2, term: 2, name: 'ชายหาดระคน', chapter: 'บทที่ 10 การบวก ลบ คูณ หารระคน', lessons: LESSONS_P2C10,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['palm', 'boat', 'umbrella', 'palm'], small: ['crab', 'lifebuoy', 'shell', 'starfish', 'crab', 'shell'] } },
  { id: 44, grade: 2, term: 2, name: 'ชายหาดแผนภูมิ', chapter: 'บทที่ 11 แผนภูมิรูปภาพ', lessons: LESSONS_P2C11,
    theme: { beach: true, hills: ['#FBEFD2', '#F9E7C3', '#FDF3DD'], far: '#FFF6E3', edge: ['umbrella', 'palm', 'palm', 'boat'], small: ['shell', 'crab', 'starfish', 'lifebuoy', 'shell', 'crab'] } },
  { id: 51, grade: 2, term: 2, name: 'อ่าวราชาปลาหมึกยักษ์', chapter: 'ด่านสุดท้าย ป.2 · บอสใหญ่รวมร่าง', lessons: LESSONS_MEGA2, final: true, secret: true,
    theme: { beach: true, hills: ['#DCE8F5', '#E6EEF7', '#D8E4F2'], far: '#E8F0FA', edge: ['palm', 'boat', 'palm', 'boat'], small: ['shell', 'crab', 'shell', 'starfish', 'crab', 'shell'] } },
  { id: 5, grade: 3, name: 'ป่าดิบชื้นจำนวนนับ', chapter: 'บทที่ 1 จำนวนนับไม่เกิน 100,000', lessons: LESSONS_P3C1,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'fern', 'bigtree', 'banana'], small: ['mushroom', 'fern', 'frog', 'heliconia', 'log', 'butterfly'] } },
  { id: 50, grade: 3, name: 'ป่าดิบชื้นบวกลบ', chapter: 'บทที่ 2 การบวกและการลบจำนวนนับไม่เกิน 100,000', lessons: LESSONS_P3C2,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'fern', 'bigtree', 'banana'], small: ['mushroom', 'fern', 'frog', 'heliconia', 'log', 'butterfly'] } },
  { id: 58, grade: 3, name: 'ป่าดิบชื้นนาฬิกา', chapter: 'บทที่ 3 เวลา', lessons: LESSONS_P3C3,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'banana', 'fern', 'bigtree'], small: ['butterfly', 'frog', 'heliconia', 'mushroom', 'log', 'fern'] } },
  { id: 59, grade: 3, name: 'ป่าดิบชื้นกระจกเงา', chapter: 'บทที่ 4 รูปเรขาคณิต', lessons: LESSONS_P3C4,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'banana', 'fern', 'bigtree'], small: ['butterfly', 'frog', 'heliconia', 'mushroom', 'log', 'fern'] } },
  { id: 60, grade: 3, name: 'ป่าดิบชื้นแผนภูมิ', chapter: 'บทที่ 5 แผนภูมิรูปภาพและตารางทางเดียว', lessons: LESSONS_P3C5,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'banana', 'fern', 'bigtree'], small: ['butterfly', 'frog', 'heliconia', 'mushroom', 'log', 'fern'] } },
  { id: 61, grade: 3, name: 'ป่าดิบชื้นเศษส่วน', chapter: 'บทที่ 6 เศษส่วน', lessons: LESSONS_P3C6,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'banana', 'fern', 'bigtree'], small: ['butterfly', 'frog', 'heliconia', 'mushroom', 'log', 'fern'] } },
  { id: 62, grade: 3, name: 'ป่าดิบชื้นทวีคูณ', chapter: 'บทที่ 7 การคูณ', lessons: LESSONS_P3C7,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'banana', 'fern', 'bigtree'], small: ['butterfly', 'frog', 'heliconia', 'mushroom', 'log', 'fern'] } },
  { id: 57, grade: 3, term: 2, name: 'ป่าดิบชื้นแบ่งเท่า', chapter: 'บทที่ 8 การหาร', lessons: LESSONS_P3C8,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'fern', 'bigtree', 'banana'], small: ['frog', 'mushroom', 'butterfly', 'heliconia', 'log', 'fern'] } },
  { id: 56, grade: 3, term: 2, name: 'ป่าดิบชื้นไม้บรรทัด', chapter: 'บทที่ 9 การวัดความยาว', lessons: LESSONS_P3C9,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'banana', 'bigtree', 'fern'], small: ['fern', 'butterfly', 'log', 'heliconia', 'mushroom', 'frog'] } },
  { id: 52, grade: 3, term: 2, name: 'ป่าดิบชื้นตาชั่ง', chapter: 'บทที่ 10 การวัดน้ำหนัก', lessons: LESSONS_P3C10,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'banana', 'bigtree', 'fern'], small: ['mushroom', 'frog', 'fern', 'log', 'heliconia', 'butterfly'] } },
  { id: 53, grade: 3, term: 2, name: 'ป่าดิบชื้นตวงน้ำ', chapter: 'บทที่ 11 การวัดปริมาตร', lessons: LESSONS_P3C11,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'fern', 'banana', 'bigtree'], small: ['frog', 'mushroom', 'heliconia', 'fern', 'log', 'butterfly'] } },
  { id: 54, grade: 3, term: 2, name: 'ป่าดิบชื้นตลาดนัด', chapter: 'บทที่ 12 เงินและบันทึกรายรับรายจ่าย', lessons: LESSONS_P3C12,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'banana', 'fern', 'bigtree'], small: ['mushroom', 'heliconia', 'frog', 'log', 'fern', 'butterfly'] } },
  { id: 55, grade: 3, term: 2, name: 'ป่าดิบชื้นวงเล็บ', chapter: 'บทที่ 13 การบวก ลบ คูณ หารระคน', lessons: LESSONS_P3C13,
    theme: { jungle: true, hills: ['#D6EBC8', '#CBE5C0', '#DFEFD0'], far: '#E4F1D8', edge: ['bigtree', 'fern', 'banana', 'bigtree'], small: ['heliconia', 'frog', 'mushroom', 'log', 'butterfly', 'fern'] } },
  { id: 72, grade: 3, term: 2, name: 'วิหารราชางูยักษ์', chapter: 'ด่านสุดท้าย ป.3 · บอสใหญ่รวมร่าง', lessons: LESSONS_MEGA3, final: true, secret: true,
    theme: { jungle: true, hills: ['#B9D9A8', '#AFD29E', '#C6E1B5'], far: '#D3EAC6', edge: ['bigtree', 'banana', 'bigtree', 'fern'], small: ['mushroom', 'fern', 'frog', 'heliconia', 'log', 'butterfly'] } },
  { id: 36, grade: 4, name: 'ทะเลทรายจำนวนนับ', chapter: 'บทที่ 1 จำนวนนับที่มากกว่า 100,000', lessons: LESSONS_P4C1,
    theme: { desert: true, hills: ['#F2C98A', '#EDBB78', '#F7D9A4'], far: '#FCE7BE', edge: ['oasis', 'pyramid', 'cactus', 'camel'], small: ['cactus', 'dunerock', 'tumble', 'camel', 'cactus', 'oasis'] } },
  { id: 37, grade: 4, name: 'ทะเลทรายบวกลบ', chapter: 'บทที่ 2 การบวกและการลบจำนวนนับที่มากกว่า 100,000', lessons: LESSONS_P4C2,
    theme: { desert: true, hills: ['#F2C98A', '#EDBB78', '#F7D9A4'], far: '#FCE7BE', edge: ['pyramid', 'camel', 'oasis', 'cactus'], small: ['tumble', 'cactus', 'camel', 'dunerock', 'oasis', 'cactus'] } },
  { id: 38, grade: 4, name: 'ทะเลทรายคูณหาร', chapter: 'บทที่ 3 การคูณและการหารจำนวนนับ', lessons: LESSONS_P4C3,
    theme: { desert: true, hills: ['#F2C98A', '#EDBB78', '#F7D9A4'], far: '#FCE7BE', edge: ['camel', 'oasis', 'pyramid', 'cactus'], small: ['cactus', 'dunerock', 'camel', 'tumble', 'oasis', 'cactus'] } },
  { id: 39, grade: 4, name: 'ทะเลทรายระคน', chapter: 'บทที่ 4 การบวก ลบ คูณ หารจำนวนนับ', lessons: LESSONS_P4C4,
    theme: { desert: true, hills: ['#F2C98A', '#EDBB78', '#F7D9A4'], far: '#FCE7BE', edge: ['oasis', 'cactus', 'camel', 'pyramid'], small: ['cactus', 'tumble', 'oasis', 'dunerock', 'camel', 'cactus'] } },
  { id: 63, grade: 4, name: 'ทะเลทรายนาฬิกา', chapter: 'บทที่ 5 เวลา', lessons: LESSONS_P4C5,
    theme: { desert: true, hills: ['#F2C98A', '#EDBB78', '#F7D9A4'], far: '#FCE7BE', edge: ['oasis', 'cactus', 'camel', 'pyramid'], small: ['cactus', 'tumble', 'oasis', 'dunerock', 'camel', 'cactus'] } },
  { id: 64, grade: 4, term: 2, name: 'ทะเลทรายเศษส่วน', chapter: 'บทที่ 6 เศษส่วน', lessons: LESSONS_P4C6,
    theme: { desert: true, hills: ['#F2C98A', '#EDBB78', '#F7D9A4'], far: '#FCE7BE', edge: ['oasis', 'cactus', 'camel', 'pyramid'], small: ['cactus', 'tumble', 'oasis', 'dunerock', 'camel', 'cactus'] } },
  { id: 65, grade: 4, term: 2, name: 'ทะเลทรายทศนิยม', chapter: 'บทที่ 7 ทศนิยม', lessons: LESSONS_P4C7,
    theme: { desert: true, hills: ['#F0D08F', '#E9C07E', '#F6DDA8'], far: '#FBEAC4', edge: ['pyramid', 'oasis', 'cactus', 'camel'], small: ['tumble', 'cactus', 'dunerock', 'oasis', 'cactus', 'camel'] } },
  { id: 66, grade: 4, term: 2, name: 'ทะเลทรายมุม', chapter: 'บทที่ 8 มุม', lessons: LESSONS_P4C8,
    theme: { desert: true, hills: ['#EFCB86', '#E6BA74', '#F5DAA0'], far: '#FAE6BC', edge: ['camel', 'pyramid', 'cactus', 'oasis'], small: ['dunerock', 'cactus', 'tumble', 'camel', 'oasis', 'cactus'] } },
  { id: 67, grade: 4, term: 2, name: 'ทะเลทรายสี่เหลี่ยม', chapter: 'บทที่ 9 รูปสี่เหลี่ยมมุมฉาก', lessons: LESSONS_P4C9,
    theme: { desert: true, hills: ['#F1CE8C', '#E8BE7A', '#F7DDA6'], far: '#FBE8C2', edge: ['oasis', 'camel', 'pyramid', 'cactus'], small: ['cactus', 'camel', 'dunerock', 'tumble', 'oasis', 'cactus'] } },
  { id: 68, grade: 4, term: 2, name: 'ทะเลทรายข้อมูล', chapter: 'บทที่ 10 การนำเสนอข้อมูล', lessons: LESSONS_P4C10,
    theme: { desert: true, hills: ['#EFD093', '#E5C07F', '#F6DFAC'], far: '#FAEAC8', edge: ['pyramid', 'cactus', 'oasis', 'camel'], small: ['tumble', 'cactus', 'oasis', 'dunerock', 'camel', 'cactus'] } },
  { id: 69, grade: 4, term: 2, name: 'รังจักรพรรดิแมงป่อง', chapter: 'ด่านสุดท้าย ป.4 · บอสใหญ่รวมร่าง', lessons: LESSONS_MEGA4, final: true, secret: true,
    theme: { desert: true, hills: ['#E2B97A', '#D8AC6C', '#EBC992'], far: '#F2D9AE', edge: ['pyramid', 'cactus', 'pyramid', 'camel'], small: ['dunerock', 'tumble', 'cactus', 'dunerock', 'camel', 'tumble'] } },
  { id: 18, grade: 5, name: 'ถ้ำเศษส่วน', chapter: 'บทที่ 1 เศษส่วน', lessons: LESSONS_P5C1,
    theme: { cave: true, hills: ['#3A3054', '#352B4E', '#40355E'], far: '#2E2547', edge: ['crystal', 'stalag', 'lantern', 'crystal'], small: ['glowshroom', 'rocks', 'crystal', 'stalag', 'glowshroom', 'honey'] } },
  { id: 19, grade: 5, name: 'ถ้ำทศนิยม', chapter: 'บทที่ 2 ทศนิยม', lessons: LESSONS_P5C2,
    theme: { cave: true, hills: ['#2F3A5C', '#2B3554', '#354166'], far: '#252E4A', edge: ['crystal', 'lantern', 'stalag', 'crystal'], small: ['crystal', 'glowshroom', 'rocks', 'bat', 'crystal', 'stalag'] } },
  { id: 20, grade: 5, name: 'ถ้ำแผนภูมิ', chapter: 'บทที่ 3 การนำเสนอข้อมูล', lessons: LESSONS_P5C3,
    theme: { cave: true, hills: ['#2E3F4F', '#2A3949', '#33475A'], far: '#233140', edge: ['lantern', 'crystal', 'stalag', 'lantern'], small: ['glowshroom', 'crystal', 'rocks', 'honey', 'bat', 'glowshroom'] } },
  { id: 21, grade: 5, term: 2, name: 'ถ้ำไตรยางศ์', chapter: 'บทที่ 4 บัญญัติไตรยางศ์', lessons: LESSONS_P5C4,
    theme: { cave: true, hills: ['#4A2F4F', '#43294A', '#52355A'], far: '#3A2440', edge: ['crystal', 'lantern', 'crystal', 'stalag'], small: ['honey', 'glowshroom', 'crystal', 'rocks', 'bat', 'crystal'] } },
  { id: 22, grade: 5, term: 2, name: 'ถ้ำร้อยละ', chapter: 'บทที่ 5 ร้อยละ', lessons: LESSONS_P5C5,
    theme: { cave: true, hills: ['#4F3A2A', '#47331F', '#574130'], far: '#3D2C1E', edge: ['lantern', 'crystal', 'stalag', 'lantern'], small: ['crystal', 'honey', 'glowshroom', 'rocks', 'crystal', 'bat'] } },
  { id: 23, grade: 5, term: 2, name: 'ถ้ำเส้นขนาน', chapter: 'บทที่ 6 เส้นขนาน', lessons: LESSONS_P5C6,
    theme: { cave: true, hills: ['#2A3F45', '#25383E', '#30484F'], far: '#1F3036', edge: ['crystal', 'stalag', 'lantern', 'crystal'], small: ['glowshroom', 'crystal', 'bat', 'rocks', 'honey', 'crystal'] } },
  { id: 34, grade: 5, term: 2, name: 'ถ้ำสี่เหลี่ยม', chapter: 'บทที่ 7 รูปสี่เหลี่ยม', lessons: LESSONS_P5C7,
    theme: { cave: true, hills: ['#3D2F4F', '#352946', '#463758'], far: '#2A2036', edge: ['crystal', 'lantern', 'stalag', 'crystal'], small: ['crystal', 'bat', 'glowshroom', 'honey', 'rocks', 'crystal'] } },
  { id: 35, grade: 5, term: 2, name: 'ถ้ำปริมาตร', chapter: 'บทที่ 8 ปริมาตรและความจุ', lessons: LESSONS_P5C8,
    theme: { cave: true, hills: ['#2F3F55', '#29374B', '#37485F'], far: '#1F2A3A', edge: ['lantern', 'crystal', 'stalag', 'lantern'], small: ['crystal', 'glowshroom', 'bat', 'honey', 'rocks', 'crystal'] } },
  { id: 70, grade: 5, term: 2, name: 'ถ้ำจอมราชาหมี', chapter: 'ด่านสุดท้าย ป.5 · บอสใหญ่รวมร่าง', lessons: LESSONS_MEGA5, final: true, secret: true,
    theme: { cave: true, hills: ['#2B2340', '#251E39', '#33294C'], far: '#1B1530', edge: ['crystal', 'stalag', 'lantern', 'crystal'], small: ['glowshroom', 'crystal', 'bat', 'rocks', 'glowshroom', 'bat'] } },
  { id: 24, grade: 6, name: 'ภูเขา ห.ร.ม. ค.ร.น.', chapter: 'บทที่ 1 ห.ร.ม. และ ค.ร.น.', lessons: LESSONS_P6C1,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['snowpine', 'tent', 'cairn', 'goat'], small: ['snowpine', 'rock', 'edelweiss', 'goat', 'pine', 'cairn'] } },
  { id: 25, grade: 6, name: 'ภูเขาเศษส่วน', chapter: 'บทที่ 2 เศษส่วน', lessons: LESSONS_P6C2,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['goat', 'snowpine', 'cairn', 'tent'], small: ['edelweiss', 'snowpine', 'rock', 'pine', 'goat', 'cairn'] } },
  { id: 26, grade: 6, name: 'ภูเขาทศนิยม', chapter: 'บทที่ 3 ทศนิยม', lessons: LESSONS_P6C3,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['tent', 'goat', 'snowpine', 'cairn'], small: ['snowpine', 'cairn', 'edelweiss', 'rock', 'goat', 'pine'] } },
  { id: 27, grade: 6, name: 'ภูเขาร้อยละ', chapter: 'บทที่ 4 ร้อยละและอัตราส่วน', lessons: LESSONS_P6C4,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['snowpine', 'tent', 'goat', 'cairn'], small: ['goat', 'edelweiss', 'snowpine', 'cairn', 'rock', 'pine'] } },
  { id: 28, grade: 6, name: 'ภูเขาแบบรูป', chapter: 'บทที่ 5 แบบรูป', lessons: LESSONS_P6C5,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['cairn', 'snowpine', 'tent', 'goat'], small: ['edelweiss', 'rock', 'snowpine', 'goat', 'cairn', 'pine'] } },
  { id: 29, grade: 6, term: 2, name: 'ภูเขาสามเหลี่ยม', chapter: 'บทที่ 6 รูปสามเหลี่ยม', lessons: LESSONS_P6C6,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['tent', 'cairn', 'goat', 'snowpine'], small: ['cairn', 'goat', 'edelweiss', 'tent', 'rock', 'pine'] } },
  { id: 30, grade: 6, term: 2, name: 'ภูเขาหลายเหลี่ยม', chapter: 'บทที่ 7 รูปหลายเหลี่ยม', lessons: LESSONS_P6C7,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['goat', 'tent', 'snowpine', 'cairn'], small: ['edelweiss', 'cairn', 'rock', 'goat', 'snowpine', 'pine'] } },
  { id: 31, grade: 6, term: 2, name: 'ภูเขาวงกลม', chapter: 'บทที่ 8 วงกลม', lessons: LESSONS_P6C8,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['snowpine', 'cairn', 'goat', 'tent'], small: ['rock', 'edelweiss', 'goat', 'pine', 'cairn', 'snowpine'] } },
  { id: 32, grade: 6, term: 2, name: 'ภูเขาสามมิติ', chapter: 'บทที่ 9 รูปเรขาคณิตสามมิติ', lessons: LESSONS_P6C9,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['tent', 'snowpine', 'cairn', 'goat'], small: ['cairn', 'rock', 'snowpine', 'edelweiss', 'goat', 'pine'] } },
  { id: 33, grade: 6, term: 2, name: 'ภูเขาข้อมูล', chapter: 'บทที่ 10 การนำเสนอข้อมูล', lessons: LESSONS_P6C10,
    theme: { mountain: true, hills: ['#9FD47A', '#86B862', '#B7CF8A'], far: '#C3D3EC', edge: ['goat', 'cairn', 'tent', 'snowpine'], small: ['edelweiss', 'goat', 'rock', 'cairn', 'pine', 'snowpine'] } },
  { id: 71, grade: 6, term: 2, name: 'ยอดเขาจอมเยติ', chapter: 'ด่านสุดท้าย ป.6 · บอสใหญ่รวมร่าง', lessons: LESSONS_MEGA6, final: true, secret: true,
    theme: { mountain: true, hills: ['#C9D6E6', '#BCCADC', '#D6E1EE'], far: '#E6EEF7', edge: ['snowpine', 'cairn', 'snowpine', 'sumflag'], small: ['edelweiss', 'goat', 'cairn', 'snowpine', 'edelweiss', 'goat'] } }
];
CITIES.forEach(c => { c.grade = c.grade || 1; });
const GRADES = [{ id: 1, name: 'ป.1', world: 'เมืองตัวเลข' }, { id: 2, name: 'ป.2', world: 'ชายหาด', cls: 'beach' }, { id: 3, name: 'ป.3', world: 'ป่าดิบชื้น', cls: 'jungle' }, { id: 4, name: 'ป.4', world: 'ทะเลทราย', cls: 'desert' }, { id: 5, name: 'ป.5', world: 'ถ้ำ', cls: 'cave' }, { id: 6, name: 'ป.6', world: 'ภูเขา', cls: 'mountain' }];
CITIES.forEach(c => c.lessons.forEach((L, k) => { L.city = c.id; if (L.no == null) L.no = L.boss || L.bonus ? null : k + 1; }));
const LESSONS = CITIES.flatMap(c => c.lessons);
Object.keys(SAVE.stars || {}).forEach(k => { if (!LESSONS.some(L => String(L.id) === k)) delete SAVE.stars[k]; });
