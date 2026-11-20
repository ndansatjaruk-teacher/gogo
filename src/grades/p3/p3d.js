/* =========================================================
   GRADE 3 · CHAPTER 8 — การหาร  (ป่าดิบชื้น · ภาคเรียนที่ 2 · เมือง 57 · ด่าน 1301–1309 · บอส 1319)
   reuses: p4ldivPlan (p4m) · Q.dvRem / dvLeft / dvPicQ / duoInput (p2d) · Q.x3Make (p3x) · Q.p4Pick (p4n)
   v135: d3Work = กระดานหารยาว/หารสั้นที่เด็กทำเองทุกขั้น (แตะหลักเริ่ม → ผลหาร → คูณ → ลบ → แตะดึงลง) ใช้ทั้งหน้าฝึก เกม และขั้นที่ 2 ของโจทย์ปัญหา
   NEW: Q.d3Long — the child does the long division step by step (quotient digit → product shown → remainder → bring down)
        Q.d3Short — short division, one quotient digit at a time (remainders appear as small numbers)
   ========================================================= */
/* ---------- long-division board (state = position in the steps + phase) ---------- */
function d3Plan(D, k) { const P = p4ldivPlan(D, k), f = Math.max(0, P.steps.findIndex(s => !s.quiet)); return { ...P, f, S: P.steps.slice(f) }; }
function d3BoardHTML(D, k, pos, phase, o = {}) { // pos = index in S being asked (S.length = finished) · phase 'q' | 'r'
  const P = o.P || d3Plan(D, k), S = P.S, nd = P.digs.length; let cells = '', row = 3;
  const put = (r, c, t, cls = '') => { cells += `<span class="ld-c ${cls}" style="grid-row:${r};grid-column:${c}">${t}</span>`; };
  const ask = (r, c, cls = '') => put(r, c, '?', 'd3ask ' + cls);
  S.forEach((s, t) => { if (t < pos || (t === pos && phase === 'r')) put(1, 2 + s.i, s.q, 'q'); else if (t === pos && phase === 'q') ask(1, 2 + s.i, 'q'); });
  put(2, 1, fmt(k), 'dv'); const hiLead = pos === 0 && phase === 'q'; P.digs.forEach((d, i) => put(2, 2 + i, d, 'dd' + (hiLead && i <= S[0].i ? ' d3hi' : '')));
  S.forEach((s, t) => { if (s.quiet || t > pos || (t === pos && phase === 'q')) return;
    const ps = String(s.prod); put(row, 1, '−', 'sg'); [...ps].forEach((c, j) => put(row, 2 + s.i - ps.length + 1 + j, c, 'pr ul')); row++;
    if (t === pos) { const rs = String(s.rem); [...rs].forEach((c, j) => ask(row, 2 + s.i - rs.length + 1 + j)); row++; return; }
    let t2 = S.findIndex((x, j) => j > t && !x.quiet); if (t2 < 0) t2 = S.length; const p = Math.min(pos, t2);
    const v = p < S.length ? S[p].cur : P.rem, end = p < S.length ? S[p].i : nd - 1, vs = String(v), live = p === pos && phase === 'q' && p < S.length;
    [...vs].forEach((c, j) => put(row, 2 + end - vs.length + 1 + j, c, 'rm' + (p >= S.length ? ' last' : '') + (live ? ' d3hi' : ''))); row++; });
  const R = 2 + 2 * S.filter(x => !x.quiet).length; // rows when finished — the size stays the same while the child works
  return `<div class="ldiv d3b" style="--rows:${R};grid-template-columns:auto repeat(${nd},var(--ldw))">${cells}</div>`;
}
/* small keypad (class keypad → qLayout puts it bottom-right) */
/* ---------- v135 (ผู้ใช้ขอ: ให้เด็ก “หารยาวเองจริง ๆ” ทุกขั้น) — กระดานหารที่เด็กเขียนเองบนกระดาน ----------
   หารยาว: ① แตะตัวเลขที่จะเริ่มหาร ② ผลหาร (เขียนบนหลักนั้น) ③ คูณ (เขียนใต้) ④ ลบ ⑤ แตะตัวเลขถัดไปเพื่อดึงลง → ทำซ้ำ
   หารสั้น: ① แตะตัวเลขที่จะเริ่มหาร ② ผลหาร (ใต้เส้น) ③ เศษตัวเล็กหน้าหลักถัดไป → ทำซ้ำ ④ เศษสุดท้าย
   ผิดแต่ละขั้นบอกเหตุผลจริง (เช่น 7 × 6 = 42 มากกว่า 40) · เฉลย (ผิดครบ 3 ครั้ง) เติมกระดานให้ครบ · o.final === false → ไม่จบข้อเอง (ใช้ในโจทย์ปัญหา) */
const D3_PLACE = ['หลักหน่วย', 'หลักสิบ', 'หลักร้อย', 'หลักพัน', 'หลักหมื่น'];
function d3Work(D, k, ctx, o = {}) {
  const P = p4ldivPlan(D, k), nd = P.digs.length, f = Math.max(0, P.steps.findIndex(s => !s.quiet)), short = !!o.short, guide = !!o.guide, place = i => D3_PLACE[nd - 1 - i];
  /* ลำดับงานทั้งหมดของข้อนี้ */
  const tasks = [{ t: 'start' }];
  for (let i = f; i < nd; i++) { const s = P.steps[i];
    tasks.push({ t: 'q', i });
    if (short) { if (i < nd - 1 && s.rem > 0) tasks.push({ t: 'c', i }); }
    else { if (!s.quiet) tasks.push({ t: 'm', i }, { t: 's', i }); if (i < nd - 1) tasks.push({ t: 'b', i: i + 1 }); } }
  if (short && P.rem > 0) tasks.push({ t: 'r' });
  let at = 0, typed = '', fin = false, hadWrong = false, startPick = -1, busy = false, shown = false; const ok = new Set(); /* ok = งานที่เสร็จแล้ว (index) */
  const fig = h('div', { class: 'p4-fig d3fig d3wfig' }), lab = h('div', { class: 'p4steplab d3lab' }), tip = h('div', { class: 'd3tip' }), kp = h('div', { class: 'keypad' });
  const done = j => j < at || fin;
  /* ข้อมูลที่แสดงได้ตามความคืบหน้า */
  const qShown = i => tasks.some((x, j) => x.t === 'q' && x.i === i && done(j));
  /* แถวล่าสุดของหารยาวเมื่อมีผลหาร 0 คั่น: คำนวณตัวเลขที่อยู่ในแถวทำงานจากขั้นที่เสร็จ */
  const workRows = () => { const out = []; let cur = null; /* {v, end} */
    for (let i = f; i < nd; i++) { const s = P.steps[i], jm = tasks.findIndex(x => x.t === 'm' && x.i === i), js = tasks.findIndex(x => x.t === 's' && x.i === i), jb = tasks.findIndex(x => x.t === 'b' && x.i === i + 1);
      if (!s.quiet) { if (jm >= 0 && done(jm)) out.push({ k: 'p', v: s.prod, end: i }); else if (jm >= 0 && at === jm && !fin) { out.push({ k: 'ap', end: i, w: String(s.prod).length }); break; } else break;
        if (done(js)) { cur = { k: 'c', v: s.rem, end: i }; out.push(cur); } else if (at === js && !fin) { out.push({ k: 'as', end: i, w: String(s.rem).length }); break; } else break; }
      if (jb >= 0 && done(jb)) { if (cur) { cur.v = cur.v * 10 + P.digs[i + 1]; cur.end = i + 1; } }
      else if (jb >= 0) break; }
    if (fin || at >= tasks.length) { const last = out[out.length - 1]; if (last && last.k === 'c') last.last = true; }
    return out; };
  const longHTML2 = () => { let cells = ''; const put = (r, c, t, cls = '') => { cells += `<span class="ld-c ${cls}" style="grid-row:${r};grid-column:${c}">${t}</span>`; };
    const T = fin ? {} : (tasks[at] || {}), live = v => `<span class="d3typ">${v}</span>`;
    for (let i = f; i < nd; i++) { if (qShown(i)) put(1, 2 + i, P.steps[i].q, 'q'); else if (T.t === 'q' && T.i === i) put(1, 2 + i, typed ? live(typed) : '?', 'd3ask'); }
    put(2, 1, fmt(k), 'dv');
    const sel = done(0) ? f : startPick;
    P.digs.forEach((d, i) => { const used = tasks.some((x, j) => x.t === 'b' && x.i === i && done(j)), tap = (T.t === 'start') || (T.t === 'b' && !used && i > f);
      put(2, 2 + i, d, 'dd' + ((!done(0) && sel >= 0 && i <= sel) || (T.t === 'q' && T.i === f && i <= f) ? ' d3hi' : '') + (tap ? ' d3tap' : '') + (used ? ' d3used' : '') + `" data-i="${i}`); });
    let row = 3; workRows().forEach(r => { const box = (w, end, v, cls) => { const vs = v == null ? '' : String(v), W = Math.max(w, vs.length || 1); for (let j = 0; j < W; j++) { const c = 2 + end - W + 1 + j, ch = vs ? (j >= W - vs.length ? vs[j - (W - vs.length)] : '') : (j === W - 1 ? '?' : ''); put(row, c, ch, cls + (vs ? ' d3typ' : '')); } };
      if (r.k === 'p') { put(row, 1, '−', 'sg'); const vs = String(r.v); [...vs].forEach((c, j) => put(row, 2 + r.end - vs.length + 1 + j, c, 'pr ul')); }
      else if (r.k === 'ap') { put(row, 1, '−', 'sg'); box(r.w, r.end, typed, 'd3ask ul'); }
      else if (r.k === 'c') { const vs = String(r.v); [...vs].forEach((c, j) => put(row, 2 + r.end - vs.length + 1 + j, c, 'rm' + (r.last ? ' last' : ''))); }
      else if (r.k === 'as') box(r.w, r.end, typed, 'd3ask');
      row++; });
    const R = 2 + 2 * P.steps.slice(f).filter(x => !x.quiet).length;
    return `<div class="ldiv d3b d3w" style="--rows:${R};grid-template-columns:auto repeat(${nd},var(--ldw))">${cells}</div>`; };
  const shortHTML = () => { const T = fin ? {} : (tasks[at] || {}); let s = `<div class="p4sd d3sd" style="grid-template-columns:auto repeat(${nd},1.25em) auto"><span class="dv">${k} )</span>`;
    const sel = done(0) ? f : startPick;
    P.digs.forEach((d, i) => { const jc = tasks.findIndex(x => x.t === 'c' && x.i === i - 1); let sup = '';
      if (jc >= 0 && done(jc)) sup = `<sup>${P.steps[i - 1].rem}</sup>`; else if (jc >= 0 && T.t === 'c' && T.i === i - 1) sup = `<sup class="d3ask">${typed || '?'}</sup>`;
      s += `<span class="dd${(!done(0) && sel >= 0 && i <= sel) || ((T.t === 'q' || T.t === 'c') && (T.i === i || (T.i === f && i <= f))) ? ' d3hi' : ''}${T.t === 'start' ? ' d3tap' : ''}" data-i="${i}">${sup}${d}</span>`; });
    s += '<span></span><span></span>';
    P.digs.forEach((d, i) => { s += i < f ? '<span class="qq"></span>' : qShown(i) ? `<span class="qq">${P.steps[i].q}</span>` : T.t === 'q' && T.i === i ? `<span class="qq d3ask">${typed || '?'}</span>` : '<span class="qq"></span>'; });
    const jr = tasks.findIndex(x => x.t === 'r'); s += jr >= 0 && done(jr) ? `<span class="d3rem">เศษ ${P.rem}</span>` : T.t === 'r' ? `<span class="d3rem">เศษ <b class="d3ask">${typed || '?'}</b></span>` : '<span></span>';
    return s + '</div>'; };
  const say1 = t => { if (hadWrong && ctx.say) { ctx.say(t); hadWrong = false; } };
  const paint = () => { fig.innerHTML = short ? shortHTML() : longHTML2(); const T = tasks[at];
    fig.querySelectorAll('.d3tap').forEach(c => c.onclick = e => { e.stopPropagation(); tapDigit(+c.dataset.i); });
    kp.classList.toggle('d3off', fin || !T || T.t === 'start' || T.t === 'b');
    if (fin) { lab.innerHTML = `${fmt(D)} ÷ ${fmt(k)} = <b>${fmt(P.q)}</b>${P.rem ? ` เศษ <b>${fmt(P.rem)}</b>` : ''}${shown ? '' : ' ✓'}`; tip.textContent = ''; return; }
    const s = T.i != null ? P.steps[Math.min(T.i, nd - 1)] : null;
    if (T.t === 'start') { lab.innerHTML = 'เริ่มหารที่ตัวเลขไหน? <b>แตะตัวเลขของตัวตั้ง</b>'; tip.textContent = guide ? `ตัวเลขที่เริ่มหารต้องมีค่าไม่น้อยกว่า ${k} ถ้าหลักแรกน้อยกว่า ${k} ให้ใช้สองหลัก` : ''; }
    else if (T.t === 'q') { lab.innerHTML = `<b>${fmt(s.cur)} ÷ ${k}</b> ได้เท่าไร — เขียนผลหาร${short ? 'ใต้' : 'บน'}${place(T.i)}`; tip.textContent = guide ? (s.cur < k ? `${s.cur} น้อยกว่า ${k} หารไม่ได้ → ผลหารเป็น 0` : `ท่องแม่ ${k}: ${k} × อะไรได้ใกล้ ${s.cur} ที่สุดแต่ไม่เกิน`) : ''; }
    else if (T.t === 'm') { lab.innerHTML = `คูณ: <b>${s.q} × ${k}</b> = ? — เขียนผลคูณใต้ ${fmt(s.cur)}`; tip.textContent = guide ? 'ผลหารที่เพิ่งเขียน × ตัวหาร' : ''; }
    else if (T.t === 's') { lab.innerHTML = `ลบ: <b>${fmt(s.cur)} − ${fmt(s.prod)}</b> = ?`; tip.textContent = guide ? `ผลลบต้องน้อยกว่า ${k}` : ''; }
    else if (T.t === 'b') { lab.innerHTML = 'ดึงตัวเลขหลักถัดไปลงมา — <b>แตะตัวเลขนั้นที่ตัวตั้ง</b>'; tip.textContent = guide ? `ตัวถัดไปทางขวาคือ ${P.digs[T.i]} (${place(T.i)})` : ''; }
    else if (T.t === 'c') { lab.innerHTML = `${fmt(s.cur)} ÷ ${k} ได้ ${s.q} <b>เหลือเศษเท่าไร</b> — เขียนตัวเล็กหน้าเลขถัดไป`; tip.textContent = guide ? `${fmt(s.cur)} − ${s.q * k}` : ''; }
    else if (T.t === 'r') { lab.innerHTML = '<b>เหลือเศษเท่าไร</b>'; tip.textContent = guide ? `${fmt(P.steps[nd - 1].cur)} − ${P.steps[nd - 1].prod}` : ''; } };
  const wrong = why => { hadWrong = true; typed = ''; paint(); ctx.check(false, why); };
  const next = () => { typed = ''; at++; sfx.pop(Math.min(8, at % 8 + 1)); if (at >= tasks.length) { fin = true; paint(); if (o.final !== false) ctx.check(true); o.onDone && o.onDone(P); return; } say1('ถูกแล้ว ทำขั้นต่อไปได้เลย'); paint(); };
  function tapDigit(i) { const T = tasks[at]; if (fin || !T) return;
    if (T.t === 'start') { if (busy) return; startPick = i; const v = +P.digs.slice(0, i + 1).join('');
      if (i === f) { busy = true; paint(); return setTimeout(() => { busy = false; next(); }, 350); }
      if (v < k) return wrong(`${fmt(v)} น้อยกว่า ${k} หารไม่ได้ ต้องใช้ตัวเลขหลักถัดไปด้วย`);
      return wrong(`${+P.digs.slice(0, f + 1).join('')} ก็หารด้วย ${k} ได้แล้ว เริ่มหารที่ ${+P.digs.slice(0, f + 1).join('')} ได้เลย`); }
    if (T.t === 'b') { if (i === T.i) return next(); return wrong(i < T.i ? `ตัวเลข ${P.digs[i]} ใช้ไปแล้ว ต้องดึงตัวถัดไปทางขวา` : `ต้องดึงทีละหลักตามลำดับ — ตัวถัดไปคือ${place(T.i)}`); } }
  function enter(v) { const T = tasks[at]; if (fin || !T) return; const s = T.i != null ? P.steps[Math.min(T.i, nd - 1)] : null;
    if (T.t === 'q') { if (v === s.q) return next();
      return wrong(v * k > s.cur ? `${v} × ${k} = ${v * k} มากกว่า ${fmt(s.cur)} — ผลหารต้องน้อยกว่า ${v}` : `${v} × ${k} = ${v * k} เหลือ ${fmt(s.cur - v * k)} ซึ่งยังไม่น้อยกว่า ${k} แบ่งได้อีก — ผลหารต้องมากกว่า ${v}`); }
    if (T.t === 'm') { if (v === s.prod) return next(); return wrong(`${s.q} × ${k} ไม่เท่ากับ ${fmt(v)} — ลองท่องแม่ ${k} อีกครั้ง`); }
    if (T.t === 's') { if (v === s.rem) return next(); return wrong(`${fmt(s.cur)} − ${fmt(s.prod)} ไม่เท่ากับ ${fmt(v)}${v >= k ? ` (และเศษต้องน้อยกว่า ${k})` : ''}`); }
    if (T.t === 'c') { if (v === s.rem) return next(); return wrong(`${s.q} × ${k} = ${s.q * k} · ${fmt(s.cur)} − ${s.q * k} ไม่เท่ากับ ${v}`); }
    if (T.t === 'r') { if (v === P.rem) return next(); return wrong(`${fmt(P.steps[nd - 1].cur)} − ${P.steps[nd - 1].prod} ไม่เท่ากับ ${v}`); } }
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: e => { e.stopPropagation(); if (kp.classList.contains('d3off')) return; sfx.tap(); typed = (typed + d).slice(-6).replace(/^0+(\d)/, '$1'); paint(); } }, d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: e => { e.stopPropagation(); typed = typed.slice(0, -1); paint(); } }, icon('left')),
    h('button', { class: 'btn', onclick: e => { e.stopPropagation(); if (kp.classList.contains('d3off')) return; sfx.tap(); typed = (typed + '0').slice(-6).replace(/^0+(\d)/, '$1'); paint(); } }, '0'),
    h('button', { class: 'btn primary', 'aria-label': 'ตกลง', onclick: e => { e.stopPropagation(); if (typed === '') return; enter(+typed); } }, icon('check')));
  const panel = h('div', { class: 'ans ia d3ans' }, lab, tip, kp);
  panel.reveal = () => { if (fin) return; fin = true; shown = true; at = tasks.length; paint(); };
  paint(); const wrap = h('div', { class: 't6-q p4-q d3wq' + (short ? ' d3short' : '') }, fig, panel); wrap.panel = panel; return wrap;
}
Object.assign(Q, {
  /* v135: เด็กหารยาว/หารสั้นเองทุกขั้นบนกระดาน */
  d3Long({ D, k, guide }) { const q = `หารยาว ${fmt(D)} ÷ ${fmt(k)}`;
    return { prompt: q, say: `หารยาว ${thaiWords(D)} หารด้วย ${thaiWords(k)} ทำเองทีละขั้น`, mount(bd, ctx) { bd.append(d3Work(D, k, ctx, { guide })); } }; },
  d3Short({ D, k, guide }) { const q = `หารสั้น ${fmt(D)} ÷ ${fmt(k)}`;
    return { prompt: q, say: `หารสั้น ${thaiWords(D)} หารด้วย ${thaiWords(k)}`, mount(bd, ctx) { bd.append(d3Work(D, k, ctx, { short: true, guide })); } }; },
  /* โจทย์ปัญหา: ① เลือกประโยคสัญลักษณ์ ② หารยาวเอง ③ ตอบพร้อมหน่วย */
  d3Story({ text, n, d, unit, unit2 }) { const q = Math.floor(n / d), r = n % d;
    return { prompt: 'อ่านโจทย์ เลือกประโยคสัญลักษณ์ หารยาว แล้วตอบ', say: text, mount(bd, ctx) {
      const story = h('div', { class: 'storybox d3story', html: text }), slot = h('div', { class: 'colstack d3slot2' }), lab = h('div', { class: 'p4steplab', html: 'ขั้นที่ 1: เลือก<b>ประโยคสัญลักษณ์</b>' });
      const sub = { check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(4); lab.innerHTML = `<b>${fmt(n)} ÷ ${d} = □</b> ✓ · ขั้นที่ 2: <b>หารยาว</b>`; ctx.say && ctx.say('ใช่แล้ว! หารยาวหาคำตอบ');
        slot.innerHTML = ''; const W = d3Work(n, d, ctx, { final: false, onDone: () => { lab.innerHTML = `ขั้นที่ 3: <b>ตอบ</b>ให้ตรงคำถาม`; W.panel.innerHTML = '';
          W.panel.append(r ? (D2 => { const row = D2.querySelector('.mc-row'); row && row.children[3] && row.insertBefore(h('span', { class: 'mc-u' }, 'เหลือ'), row.children[3]); return D2; })(duoInput(ctx, [q, r], [unit, unit2 || unit], { pre: 'ได้', hint: `ผลหารคือสิ่งที่ “ได้” · เศษคือสิ่งที่ “เหลือ”` }))
            : h('div', { class: 'rowstack' }, h('span', { class: 'cap', style: { fontSize: '20px' } }, 'ตอบ'), answerBox(ctx, String(q), { hint: 'ผลหารที่ได้จากการหารยาว' }), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit))); } });
        slot.append(W); } };
      slot.append(choices(sub, shuffle([`${fmt(n)} ÷ ${d}`, `${fmt(n)} × ${d}`, `${fmt(n)} − ${d}`]).map(x => ({ value: x, label: x })), `${fmt(n)} ÷ ${d}`, { hint: 'แบ่งเท่า ๆ กัน / จัดกลุ่มละเท่า ๆ กัน → หาร' }));
      bd.append(h('div', { class: 'colstack d3stq' }, story, lab, slot)); } }; },
  /* ตัวไม่ทราบค่า: คิดด้วยการคูณ (ป.3 ตัวหารหนึ่งหลัก) */
  d3Unk({ a, b, c, pos }) { const x = pos === 0 ? a : b, L = pos === 0 ? '□' : fmt(a), R = pos === 1 ? '□' : b;
    return { prompt: `${L} ÷ ${R} = ${fmt(c)} — □ คือจำนวนใด`, say: `${pos === 0 ? 'อะไร' : thaiWords(a)} หารด้วย ${pos === 1 ? 'อะไร' : thaiWords(b)} เท่ากับ ${thaiWords(c)}`, mount(bd, ctx) {
      const hint = pos === 0 ? `ไม่รู้ตัวตั้ง → คูณ: ผลหาร × ตัวหาร = ${fmt(c)} × ${b}` : `ไม่รู้ตัวหาร → ${fmt(c)} × □ = ${fmt(a)} ลองคูณ ${fmt(c)} × 2, × 3, … จนได้ ${fmt(a)}`;
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'fbig p4big mt-big', html: `${L === '□' ? '<span class="fsign">□</span>' : L} <span class="fop">÷</span> ${R === '□' ? '<span class="fsign">□</span>' : R} <span class="fop">=</span> ${fmt(c)}` }), answerBox(ctx, String(x), { hint }))); } }; }
});

const d3chkQ = ([D, k]) => { const q = Math.floor(D / k), r = D % k, right = `${fmt(q)} × ${k}${r ? ` + ${r}` : ''} = ${fmt(D)}`;
  return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(D)} ÷ ${k} = ${fmt(q)}${r ? ` เศษ ${r}` : ''}</b>`), q: 'ข้อใดใช้ตรวจคำตอบนี้ได้ถูกต้อง', opts: [right, `${fmt(q)} + ${k} = ${fmt(q + k)}`, `${fmt(D)} × ${k} = ${fmt(D * k)}`], right, hint: 'ผลหาร × ตัวหาร + เศษ = ตัวตั้ง' }); };
const d3remQ = ([D, k]) => { const q = Math.floor(D / k), r = D % k, right = `${q} เศษ ${r}`, w = [`${q - 1} เศษ ${r + k}`, `${q + 1} เศษ ${r}`].filter(x => x !== right);
  return Q.p4Pick({ fig: p4big(`<b class="num">${D} ÷ ${k}</b>`), q: 'ข้อใดถูกต้อง <small>(เศษต้องน้อยกว่าตัวหาร)</small>', opts: [right, ...w], right, hint: `เศษต้องน้อยกว่า ${k} · ${k} × ${q} = ${k * q}` }); };
/* v135: คำถามสั้นให้เกมหลากหลายตรงกับที่สอน */
const D3_PARTS = ['ตัวตั้ง', 'ตัวหาร', 'ผลหาร'];
const d3partQ = ([D, k], w) => { const q = D / k, v = [D, k, q], ask = w ?? pick([0, 1, 2]); return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(D)} ÷ ${k} = ${fmt(q)}</b>`), q: `จำนวนใดเป็น<b>${D3_PARTS[ask]}</b>`, opts: v.map(fmt), right: fmt(v[ask]), hint: 'ตัวตั้ง ÷ ตัวหาร = ผลหาร' }); };
const d3startQ = ([D, k]) => { const P = p4ldivPlan(D, k), f = Math.max(0, P.steps.findIndex(s => !s.quiet)), pre = i => String(+P.digs.slice(0, i + 1).join('')), opts = [...new Set([0, 1, 2].map(i => pre(Math.min(i, P.digs.length - 1))))];
  return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(D)} ÷ ${k}</b>`), q: 'หารยาวข้อนี้ต้อง<b>เริ่มหาร</b>ที่จำนวนใด', opts, right: pre(f), hint: `เริ่มที่จำนวนแรกทางซ้ายที่ไม่น้อยกว่า ${k}` }); };
const d3digQ = ([D, k]) => { const n = String(Math.floor(D / k)).length, o = [...new Set([n - 1, n, n + 1].filter(x => x > 0))].map(x => `${x} หลัก`);
  return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(D)} ÷ ${k}</b>`), q: 'ผลหารของข้อนี้มี<b>กี่หลัก</b>', opts: o, right: `${n} หลัก`, hint: `ดูหลักแรกทางซ้าย: ${String(D)[0]} ${+String(D)[0] >= k ? 'หารด้วย ' + k + ' ได้ → ผลหารมีหลักเท่าตัวตั้ง' : 'น้อยกว่า ' + k + ' → ผลหารมีหลักน้อยกว่าตัวตั้ง 1 หลัก'}` }); };
const d3estQ = ([D, k]) => { const q = Math.floor(D / k), m = 10 ** (String(q).length - 1), a = Math.round(q / m) * m, o = [a, a * 10, Math.max(1, a / 10)].map(x => `ประมาณ ${fmt(x)}`);
  return Q.p4Pick({ fig: p4big(`<b class="num">${fmt(D)} ÷ ${k}</b>`), q: 'ผลหารของข้อนี้<b>ประมาณ</b>เท่าใด', opts: [...new Set(o)], right: o[0], hint: `ประมาณตัวตั้งให้เป็นจำนวนเต็มร้อยหรือเต็มพันที่หาร ${k} ง่าย ๆ แล้วหาร` }); };
const d3unkHowQ = ([a, b, c, pos]) => Q.p4Pick({ fig: p4big(`<b class="num">${pos === 0 ? '□' : fmt(a)} ÷ ${pos === 1 ? '□' : b} = ${fmt(c)}</b>`), q: 'หาค่า □ ด้วยวิธีใด',
  opts: pos === 0 ? [`${fmt(c)} × ${b}`, `${fmt(c)} ÷ ${b}`, `${fmt(c)} + ${b}`] : [`หาจำนวนที่ ${fmt(c)} × □ = ${fmt(a)}`, `${fmt(a)} × ${fmt(c)}`, `${fmt(a)} − ${fmt(c)}`], right: pos === 0 ? `${fmt(c)} × ${b}` : `หาจำนวนที่ ${fmt(c)} × □ = ${fmt(a)}`, hint: 'ตัวตั้ง = ผลหาร × ตัวหาร' });
const d3sentQ = s => Q.p4Pick({ fig: `<div class="storybox">${s.text}</div>`, q: 'ข้อใดเป็น<b>ประโยคสัญลักษณ์</b>ของโจทย์นี้', opts: [`${fmt(s.n)} ÷ ${s.d} = □`, `${fmt(s.n)} × ${s.d} = □`, `${fmt(s.n)} − ${s.d} = □`], right: `${fmt(s.n)} ÷ ${s.d} = □`, hint: 'แบ่งเท่า ๆ กัน / จัดกลุ่มละเท่า ๆ กัน → หาร' });
const d3leftQ = s => { const q = Math.floor(s.n / s.d), r = s.n % s.d, u2 = s.unit2 || s.unit; return Q.p4Pick({ fig: `<div class="storybox">${s.text}</div><div class="cap">${fmt(s.n)} ÷ ${s.d} = ${fmt(q)} เศษ ${r}</div>`, q: 'ข้อใดตอบ<b>สิ่งที่เหลือ</b>ได้ถูกต้อง', opts: [`เหลือ ${r} ${u2}`, `เหลือ ${fmt(q)} ${u2}`, `เหลือ ${s.d} ${u2}`], right: `เหลือ ${r} ${u2}`, hint: 'เศษคือสิ่งที่เหลือหลังจากแบ่งแล้ว' }); };
const D3_SHORTWHY = [Q.p4Pick({ q: 'หารสั้น เขียน<b>เศษ</b>ไว้ที่ใด', opts: ['ตัวเล็กหน้าตัวเลขหลักถัดไป', 'ใต้ผลหาร', 'ข้างตัวหาร'], right: 'ตัวเล็กหน้าตัวเลขหลักถัดไป', hint: 'เศษรวมกับหลักถัดไปเป็นจำนวนใหม่' }),
  Q.p4Pick({ q: 'หารสั้น<b>ต่าง</b>จากหารยาวอย่างไร', opts: ['หารสั้นคิดคูณและลบในใจ ไม่ต้องเขียนลงมา', 'หารสั้นใช้ได้เฉพาะตัวตั้งสองหลัก', 'หารสั้นหาเศษไม่ได้'], right: 'หารสั้นคิดคูณและลบในใจ ไม่ต้องเขียนลงมา' })];

/* ---------- data ---------- */
const DP = s => s.split(' ').map(x => x.split('÷').map(v => +v.replace(/,/g, '')));
const D3W_1 = DP('49÷7 12÷2 32÷4 15÷3 81÷9 40÷8 36÷4 24÷8 36÷6 56÷7 48÷8 45÷9 35÷5 20÷4 48÷6 64÷8 54÷9 25÷5 18÷6 16÷4 72÷8 42÷7 54÷6 28÷4 40÷5 30÷5 63÷7 21÷3 27÷9 28÷7 18÷3 30÷6 32÷8 24÷3 42÷7 18÷2 27÷9 21÷7 12÷3 72÷9 14÷7'); // PPT 2–4 + 1–3
const D3W_R1 = DP('28÷5 13÷2 69÷7 20÷3 45÷8 40÷6 17÷2 38÷4 52÷6 33÷5 89÷9 24÷7 29÷4 59÷8 47÷9 31÷6 26÷3 50÷7'); // 4–5 + แต่งเพิ่ม (ผลหาร 1 หลัก มีเศษ)
const D3W_2 = DP('48÷3 60÷5 96÷4 75÷5 69÷3 84÷7 91÷7 64÷2 36÷3 60÷4 96÷8 78÷3 76÷4 57÷3 90÷9 98÷7 30÷2 33÷3 78÷6 42÷2 72÷3 80÷4 55÷5 92÷4 70÷5'); // PPT 5–6 + 6–7
const D3W_2R = DP('62÷5 90÷8 89÷7 94÷5 73÷6 38÷3 81÷6 65÷6 83÷8 96÷7 74÷6 76÷5 37÷2 93÷4 41÷3 97÷9 92÷5 78÷4 29÷2 99÷5 75÷4 25÷2 47÷3 55÷4 79÷5 70÷6 59÷4 87÷5 65÷6 73÷3 47÷2 93÷7'); // PPT 7–9 + 8–9
const D3W_3 = DP('201÷3 125÷4 201÷5 364÷8 195÷2 408÷5 562÷6 470÷7 506÷6 206÷3 359÷4 654÷7 752÷8 109÷2 333÷5 567÷6 191÷2 365÷4 880÷9 185÷5 209÷4 401÷6 650÷7 145÷2 367÷5 205÷6 850÷8 444÷5 437÷5 411÷6 189÷2 465÷8 444÷7 503÷6 800÷9 461÷4 723÷8 620÷7 187÷2 266÷3 462÷7 111÷2 612÷6 630÷2 492÷4 555÷5 954÷9 651÷3 963÷9 624÷8 595÷5 759÷3 398÷2 552÷6 458÷4 305÷8 844÷6 742÷5 643÷7 343÷4'); // PPT 10–14 + 10–12
const D3W_4 = DP('1,997÷2 2,540÷8 1,752÷4 2,658÷5 4,821÷6 6,380÷7 4,158÷5 4,101÷6 1,580÷2 3,851÷5 2,628÷4 3,682÷7 4,850÷6 1,208÷5 5,201÷8 2,059÷3 5,621÷6 2,421÷5 2,855÷6 1,223÷2 2,380÷3 5,850÷7 8,501÷9 2,641÷8 1,452÷2 2,415÷5 2,335÷4 2,520÷5 1,890÷4 5,641÷6 4,050÷7 2,222÷3 4,182÷5 3,628÷8 4,185÷6 1,894÷4 5,672÷5 6,281÷6 3,585÷2 5,710÷3 9,525÷4 6,251÷8 8,254÷6 7,485÷5 6,524÷4 9,111÷8 3,201÷3 2,111÷2 8,050÷7 9,250÷6 6,435÷3 1,888÷8 8,415÷5 3,120÷2 5,584÷4 7,470÷6 4,502÷2 7,495÷5 9,873÷3 5,844÷4 7,404÷6 6,822÷9 1,395÷2 8,961÷6 1,454÷3 6,045÷4 7,939÷5 4,217÷9'); // PPT 15–23 + 13–15
const D3W_S = DP('505÷6 695÷4 251÷2 941÷9 584÷7 647÷8 682÷6 458÷7 850÷8 227÷2 415÷4 313÷3 462÷8 715÷7 223÷5 128÷5 921÷6 465÷2 745÷6 651÷4 642÷2 505÷5 844÷4 399÷3 468÷2 129÷3 497÷7 990÷9 418÷2 994÷7 843÷3 895÷5 500÷4 672÷8 975÷3 956÷4 746÷3 174÷8 357÷5 985÷6 515÷4 235÷2 993÷8 957÷7');  // PPT 24–26 + 16–18 (ตัวตั้ง 3 หลัก)
const D3W_S4 = DP('4,581÷2 4,128÷6 4,127÷5 3,281÷4 7,182÷7 1,289÷8 5,164÷9 2,395÷2 8,518÷3 4,682÷4 4,864÷5 9,213÷4 4,823÷6 5,251÷5 1,259÷2 6,600÷3 4,581÷7 2,648÷9 5,348÷4 6,715÷6 4,141÷2 5,258÷6 9,856÷5 4,452÷4 6,482÷7 9,125÷8 4,156÷2 7,641÷3 7,025÷5 9,944÷8 4,836÷4 3,321÷9 8,778÷7 9,925÷5 4,593÷2 7,295÷3 9,418÷4 9,999÷8 6,034÷5 9,390÷9 7,400÷6 8,135÷7'); // PPT 27–30 + 19–20
const D3W_UNK = [[62, 2, 31, 1], [90, 6, 15, 0], [145, 5, 29, 1], [738, 9, 82, 0], [384, 4, 96, 0], [400, 8, 50, 1], [258, 6, 43, 1], [360, 3, 120, 0], [84, 2, 42, 1], [168, 7, 24, 0],
  [352, 4, 88, 0], [666, 6, 111, 1], [684, 9, 76, 1], [200, 4, 50, 1], [328, 8, 41, 0], [192, 2, 96, 0], [243, 9, 27, 0], [175, 5, 35, 1]]; // 21–22 [ตัวตั้ง, ตัวหาร, ผลหาร, ตำแหน่ง □ (0 = ตัวตั้ง, 1 = ตัวหาร)]
const D3S = (text, n, d, unit, unit2) => ({ text, n, d, unit, unit2 });
const D3W_ST1 = [D3S('ครูมีลูกโป่ง 245 ลูก ผูกเป็นพวง พวงละ 7 ลูก ครูผูกลูกโป่งได้กี่พวง', 245, 7, 'พวง'), D3S('ร้านขายกระเป๋าไป 4 ใบ ราคาเท่ากันทุกใบ ได้เงิน 388 บาท กระเป๋าราคาใบละกี่บาท', 388, 4, 'บาท'),
  D3S('โรงเรียนมีนักเรียน 486 คน จัดแถวแถวละ 6 คน จัดได้กี่แถว', 486, 6, 'แถว'), D3S('ชาวสวนมีส้ม 1,248 ผล บรรจุถุงละ 8 ผล ได้ส้มกี่ถุง', 1248, 8, 'ถุง'),
  D3S('ครูมีดินสอ 720 แท่ง แบ่งให้ 5 ห้องเท่า ๆ กัน ได้ห้องละกี่แท่ง', 720, 5, 'แท่ง'), D3S('รถตู้ 1 คันนั่งได้ 9 คน มีคนไปเที่ยว 117 คน ต้องใช้รถตู้กี่คัน', 117, 9, 'คัน'),
  D3S('ร้านมีไข่ไก่ 2,736 ฟอง ใส่กล่องละ 6 ฟอง ได้ไข่ไก่กี่กล่อง', 2736, 6, 'กล่อง'), D3S('เชือกยาว 952 เมตร ตัดเป็นเส้น เส้นละ 7 เมตร ได้เชือกกี่เส้น', 952, 7, 'เส้น'),
  D3S('แม่ทำขนม 375 ชิ้น ใส่กล่องละ 5 ชิ้น ได้ขนมกี่กล่อง', 375, 5, 'กล่อง'), D3S('ปู่มีเงิน 4,500 บาท แบ่งให้หลาน 4 คนเท่า ๆ กัน หลานได้คนละกี่บาท', 4500, 4, 'บาท')]; // แต่งเพิ่ม
const D3W_ST2 = [D3S('ครูมีปากกา 197 ด้าม แจกนักเรียน 5 กลุ่ม กลุ่มละเท่า ๆ กัน ได้กลุ่มละกี่ด้าม และเหลือปากกากี่ด้าม', 197, 5, 'ด้าม'),
  D3S('ร้านมีริบบิ้นสีทองยาว 495 เมตร ตัดขายเส้นละ 8 เมตร ขายได้กี่เส้น และเหลือริบบิ้นยาวกี่เมตร', 495, 8, 'เส้น', 'เมตร'), D3S('มีส้ม 250 ผล ใส่ถุงละ 6 ผล ได้ส้มกี่ถุง และเหลือส้มกี่ผล', 250, 6, 'ถุง', 'ผล'),
  D3S('มีลูกปัด 1,000 เม็ด ร้อยสร้อยข้อมือเส้นละ 9 เม็ด ได้สร้อยข้อมือกี่เส้น และเหลือลูกปัดกี่เม็ด', 1000, 9, 'เส้น', 'เม็ด'), D3S('นักเรียน 130 คน นั่งโต๊ะละ 4 คน นั่งได้เต็มกี่โต๊ะ และเหลือนักเรียนกี่คน', 130, 4, 'โต๊ะ', 'คน'),
  D3S('มีไข่ 347 ฟอง ใส่กล่องละ 6 ฟอง ได้ไข่กี่กล่อง และเหลือไข่กี่ฟอง', 347, 6, 'กล่อง', 'ฟอง'), D3S('มีเงิน 950 บาท ซื้อปากกาด้ามละ 8 บาท ได้ปากกากี่ด้าม และเหลือเงินกี่บาท', 950, 8, 'ด้าม', 'บาท'),
  D3S('กระดาษ 2,500 แผ่น แบ่งให้ 3 ห้องเท่า ๆ กัน ได้ห้องละกี่แผ่น และเหลือกี่แผ่น', 2500, 3, 'แผ่น')]; // แต่งเพิ่ม
const D3W_MAKE = [{ s: '134 ÷ 2', parts: ['มีลูกอม 134 เม็ด', [['แบ่งให้ 2 คน คนละเท่า ๆ กัน', 'ซื้อเพิ่มอีก 2 เม็ด'], 'แบ่งให้ 2 คน คนละเท่า ๆ กัน', '÷ 2 คือแบ่งเป็น 2 ส่วนเท่า ๆ กัน'], [['ได้คนละกี่เม็ด', 'มีลูกอมทั้งหมดกี่เม็ด'], 'ได้คนละกี่เม็ด', 'ถามสิ่งที่ได้หลังแบ่ง']] },
  { s: '448 ÷ 8', parts: ['มีไข่ไก่ 448 ฟอง', [['ใส่กล่องละ 8 ฟอง', 'ใส่ 8 กล่อง กล่องละ 448 ฟอง'], 'ใส่กล่องละ 8 ฟอง', '÷ 8 คือจัดเป็นกลุ่มละ 8'], [['ได้ไข่ไก่กี่กล่อง', 'เหลือไข่กี่ฟอง'], 'ได้ไข่ไก่กี่กล่อง', '448 ÷ 8 หาร ลงตัว ถามจำนวนกล่อง']] },
  { s: '345 ÷ 6', parts: ['มีดินสอ 345 แท่ง', [['ใส่กล่องละ 6 แท่ง', 'ซื้อมาอีก 6 แท่ง'], 'ใส่กล่องละ 6 แท่ง', '÷ 6 คือจัดเป็นกลุ่มละ 6'], [['ได้ดินสอกี่กล่อง และเหลือกี่แท่ง', 'มีดินสอทั้งหมดกี่แท่ง'], 'ได้ดินสอกี่กล่อง และเหลือกี่แท่ง', '345 ÷ 6 มีเศษ จึงถามจำนวนที่เหลือด้วย']] }]; // 
const d3pick = (L, n, f = () => true) => pkF(L.filter(([D, k]) => f(D, k)), n);

/* ---------- lessons ---------- */
const L3D = (no, place, title, short, goal, teach, game) => ({ id: 1300 + no, no, place, title, short, tone: TONES5[(no + 3) % 6], goal, teach, game, learned: true });
const d3ex = (D, k) => { const P = d3Plan(D, k), rows = []; P.S.forEach((s, t) => { rows.push([s.quiet ? `${fmt(s.cur)} ÷ ${k}` : `${fmt(s.cur)} ÷ ${k}`, s.quiet ? `${fmt(s.cur)} น้อยกว่า ${k} → ผลหารหลักนี้ <b>0</b>` : `ได้ <b>${s.q}</b> (${s.q} × ${k} = ${fmt(s.prod)})`, d3BoardHTML(D, k, t, 'q', { P })]);
    if (!s.quiet) rows.push(['ลบ', `${fmt(s.cur)} − ${fmt(s.prod)} = <b>${fmt(s.rem)}</b>${t + 1 < P.S.length ? ' แล้วดึงหลักถัดไปลงมา' : ''}`, d3BoardHTML(D, k, t, 'r', { P })]); });
  rows.push(['เสร็จ', `${fmt(D)} ÷ ${k} = ${fmt(P.q)}${P.rem ? ` เศษ ${P.rem}` : ''}`, d3BoardHTML(D, k, P.S.length, 'q', { P })]); return rows; };
const LESSONS_P3C8 = [
  L3D(1, 'ป่าแบ่งเท่า', 'การหาผลหารและเศษที่ตัวตั้งสองหลัก ตัวหารและผลหารหนึ่งหลักโดยการหารยาว (1)', 'หารยาว (1)', 'หาผลหารโดยการหารยาว เมื่อตัวตั้งสองหลัก ตัวหารและผลหารหนึ่งหลัก',
    [...learnStep('ยินดีต้อนรับสู่ <b>ป่าแบ่งเท่า</b>! รู้จัก<b>การหารยาว</b>', 'ยินดีต้อนรับสู่ป่าแบ่งเท่า รู้จักการหารยาว', [
      { fig: mtGroupsSVG(4, 6, 'apple', { size: 16 }), name: 'หาร = แบ่งเท่า ๆ กัน', text: 'แอปเปิล 24 ผล แบ่ง 4 กลุ่ม ได้กลุ่มละ 6 ผล<br>24 ÷ 4 = 6' },
      { fig: lbig('ตัวตั้ง ÷ ตัวหาร = ผลหาร'), name: 'ชื่อของแต่ละส่วน', text: '24 = ตัวตั้ง · 4 = ตัวหาร · 6 = ผลหาร' },
      { fig: d3BoardHTML(24, 4, 1, 'q'), name: 'การหารยาว', text: 'ตัวหารอยู่ซ้าย ตัวตั้งอยู่ใต้เส้น ผลหารอยู่บนเส้น<br>ตรวจ: 6 × 4 = 24' }], 'ตัวตั้ง ÷ ตัวหาร = ผลหาร · ตรวจคำตอบด้วย ผลหาร × ตัวหาร'),
     pexStep('ตัวอย่างทีละขั้น: 56 ÷ 8', 'ตัวอย่างทีละขั้น', d3ex(56, 8), '56 ÷ 8 = <b>7</b> · ตรวจ 7 × 8 = 56'),
     T('ลองทำตามไปด้วยกัน — ทำเองทุกขั้น มีคำแนะนำ', 'ลองทำตามไปด้วยกัน ทำเองทุกขั้น', el => el.append(qSim(Q.d3Long({ D: 63, k: 9, guide: true }), 'ทำเองครบทุกขั้นแล้ว'))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.d3Long({ D: 42, k: 6 }), 'ถูกต้อง!')))],
    () => [...d3pick(D3W_1, 3).map(([D, k]) => Q.d3Long({ D, k })), d3chkQ(pick(D3W_1)), ...d3pick(D3W_1.filter(([D, k]) => D / k !== k), 2).map((x, j) => d3partQ(x, j ? 2 : pick([0, 1]))), dvPicQ(pick(DVW_GRP), 'group'), dvPicQ(pick(DVW_SHR), 'share')]), /* v135: หารยาว 3 · ตรวจคำตอบ · ชื่อส่วน 2 · ความหมายของการหาร 2 */
  L3D(2, 'ป่าเศษเหลือ', 'การหาผลหารและเศษที่ตัวตั้งสองหลัก ตัวหารและผลหารหนึ่งหลักโดยการหารยาว (2)', 'หารยาว มีเศษ', 'หาผลหารและเศษ เมื่อหารไม่ลงตัว',
    [...learnStep('<b>หารไม่ลงตัว มีเศษ</b>', 'หารไม่ลงตัว มีเศษ', [
      { fig: dvLeft(23, 5, 'cookie', { box: 'bag', size: 14 }), name: 'แบ่งแล้วเหลือ = เศษ', text: 'คุกกี้ 23 ชิ้น ใส่ถุงละ 5 ชิ้น ได้ 4 ถุง เหลือ 3 ชิ้น<br>23 ÷ 5 = 4 เศษ 3' },
      { fig: lbig('เศษ < ตัวหาร'), name: 'เศษต้องน้อยกว่าตัวหารเสมอ', text: 'ถ้าเศษ ≥ ตัวหาร แปลว่ายังแบ่งได้อีก' },
      { fig: lbig('4 × 5 + 3 = 23'), name: 'ตรวจคำตอบ', text: 'ผลหาร × ตัวหาร + เศษ = ตัวตั้ง' }], 'หารไม่ลงตัว → มีเศษ · เศษน้อยกว่าตัวหาร'),
     pexStep('ตัวอย่างทีละขั้น: 38 ÷ 7', 'ตัวอย่างทีละขั้น', d3ex(38, 7), '38 ÷ 7 = <b>5 เศษ 3</b> · ตรวจ 5 × 7 + 3 = 38'),
     T('ลองทำตามไปด้วยกัน — หารยาวที่มีเศษ', 'ลองทำตามไปด้วยกัน หารยาวที่มีเศษ', el => el.append(qSim(Q.d3Long({ D: 43, k: 6, guide: true }), 'ทำเองครบทุกขั้นแล้ว'))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.d3Long({ D: 34, k: 8 }), 'ถูกต้อง!')))],
    () => [...d3pick(D3W_R1, 3).map(([D, k]) => Q.d3Long({ D, k })), (([D, k]) => Q.dvRem({ n: D, d: k }))(pick(D3W_R1.filter(([D]) => D <= 40))), d3remQ(pick(D3W_R1)), d3chkQ(pick(D3W_R1))]),
  L3D(3, 'ป่าผลหารสองหลัก', 'การหาผลหารและเศษที่ตัวตั้งสองหลัก ตัวหารหนึ่งหลักและผลหารสองหลักโดยการหารยาว', 'ผลหาร 2 หลัก', 'หารยาวเมื่อผลหารมีสองหลัก',
    [...learnStep('<b>ผลหารสองหลัก</b>', 'ผลหารสองหลัก', [
      { fig: d3BoardHTML(72, 3, 0, 'q'), name: 'เริ่มหารที่หลักสิบ', text: '7 ÷ 3 ได้ 2 → เขียน 2 ไว้บนหลักสิบ' },
      { fig: d3BoardHTML(72, 3, 1, 'q'), name: 'ลบแล้วดึงหลักหน่วยลงมา', text: '7 − 6 = 1 ดึง 2 ลงมา ได้ 12' },
      { fig: d3BoardHTML(72, 3, 2, 'q'), name: 'หารต่อ', text: '12 ÷ 3 = 4 → 72 ÷ 3 = 24' }], 'หาร → คูณ → ลบ → ดึงลง ทำซ้ำจนครบทุกหลัก'),
     pexStep('ตัวอย่างทีละขั้น: 85 ÷ 6', 'ตัวอย่างทีละขั้น', d3ex(85, 6), '85 ÷ 6 = <b>14 เศษ 1</b>'),
     T('ลองทำตามไปด้วยกัน — ทำเองทุกขั้น มีคำแนะนำ', 'ลองทำตามไปด้วยกัน ทำเองทุกขั้น', el => el.append(qSim(Q.d3Long({ D: 68, k: 4, guide: true }), 'ทำเองครบทุกขั้นแล้ว'))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.d3Long({ D: 58, k: 4 }), 'ถูกต้อง!')))],
    () => [...d3pick(D3W_2, 2).map(([D, k]) => Q.d3Long({ D, k })), ...d3pick(D3W_2R, 2).map(([D, k]) => Q.d3Long({ D, k })), d3chkQ(pick(D3W_2R)), d3digQ(pick([...D3W_2, ...D3W_1])), d3remQ(pick(D3W_2R)), d3startQ(pick(D3W_2R))]),
  L3D(4, 'ป่าสามหลัก', 'การหาผลหารและเศษที่ตัวตั้งสามหลักและตัวหารหนึ่งหลักโดยการหารยาว', 'ตัวตั้ง 3 หลัก', 'หารยาวเมื่อตัวตั้งมีสามหลัก',
    [...learnStep('ตัวตั้ง<b>สามหลัก</b>', 'ตัวตั้งสามหลัก', [
      { fig: d3BoardHTML(612, 6, 0, 'q'), name: 'เริ่มที่หลักซ้ายสุดที่หารได้', text: '6 ÷ 6 = 1 · หลักร้อยหารได้' },
      { fig: d3BoardHTML(125, 4, 0, 'q'), name: 'หลักแรกน้อยกว่าตัวหาร → ใช้สองหลัก', text: '1 ÷ 4 ไม่ได้ → ใช้ 12 ÷ 4' },
      { fig: d3BoardHTML(612, 6, 1, 'q'), name: 'ดึงลงมาแล้วยังหารไม่ได้ → ใส่ 0', text: '1 ÷ 6 ไม่ได้ → ผลหารหลักนั้นเป็น 0' }], 'หลักไหนหารไม่ได้ ใส่ 0 ในผลหาร แล้วดึงหลักถัดไปลงมา'),
     pexStep('ตัวอย่างทีละขั้น: 428 ÷ 4', 'ตัวอย่างทีละขั้น', d3ex(428, 4), '428 ÷ 4 = <b>107</b>'),
     T('ลองทำตามไปด้วยกัน — ตัวตั้งสามหลัก', 'ลองทำตามไปด้วยกัน ตัวตั้งสามหลัก', el => el.append(qSim(Q.d3Long({ D: 254, k: 3, guide: true }), 'ทำเองครบทุกขั้นแล้ว'))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.d3Long({ D: 315, k: 5 }), 'ถูกต้อง!')))],
    () => [...d3pick(D3W_3, 4).map(([D, k]) => Q.d3Long({ D, k })), ...d3pick(D3W_3.filter(([D, k]) => +String(D)[0] < k), 1).map(d3startQ), d3startQ(pick(D3W_3.filter(([D, k]) => +String(D)[0] >= k))), d3digQ(pick(D3W_3)), d3chkQ(pick(D3W_3))]), /* v135: ไม่มีข้อพิมพ์คำตอบอย่างเดียวแล้ว */
  L3D(5, 'ป่าสี่หลัก', 'การหาผลหารและเศษที่ตัวตั้งสี่หลักและตัวหารหนึ่งหลักโดยการหารยาว', 'ตัวตั้ง 4 หลัก', 'หารยาวเมื่อตัวตั้งมีสี่หลัก',
    [...learnStep('ตัวตั้ง<b>สี่หลัก</b>', 'ตัวตั้งสี่หลัก', [
      { fig: d3BoardHTML(5184, 4, 0, 'q'), name: 'ทำเหมือนเดิม แต่หลายรอบขึ้น', text: 'หาร → คูณ → ลบ → ดึงลง' },
      { fig: lbig('ผลหารมี 3 หรือ 4 หลัก'), name: 'ประมาณผลหารก่อน', text: '5,184 ÷ 4 ≈ 5,000 ÷ 4 ≈ 1,000 กว่า' },
      { fig: lbig('1,296 × 4 = 5,184'), name: 'ตรวจคำตอบด้วยการคูณ', text: 'ผลหาร × ตัวหาร + เศษ = ตัวตั้ง' }], 'หลายหลักก็ทำทีละหลัก ประมาณก่อน ตรวจด้วยการคูณ'),
     pexStep('ตัวอย่างทีละขั้น: 2,947 ÷ 7', 'ตัวอย่างทีละขั้น', d3ex(2947, 7), '2,947 ÷ 7 = <b>421</b>'),
     T('ลองทำตามไปด้วยกัน — ตัวตั้งสี่หลัก', 'ลองทำตามไปด้วยกัน ตัวตั้งสี่หลัก', el => el.append(qSim(Q.d3Long({ D: 3804, k: 6, guide: true }), 'ทำเองครบทุกขั้นแล้ว'))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.d3Long({ D: 1736, k: 8 }), 'ถูกต้อง!')))],
    () => [...d3pick(D3W_4, 3).map(([D, k]) => Q.d3Long({ D, k })), ...d3pick(D3W_4, 2).map(d3estQ), d3digQ(pick(D3W_4)), d3chkQ(pick(D3W_4)), d3startQ(pick(D3W_4.filter(([D, k]) => +String(D)[0] < k)))]), /* v135: หาร 4 หลักแค่ 3 ข้อ + ประมาณ/จำนวนหลัก/ตรวจ */
  L3D(6, 'ป่าหารสั้น', 'การหาผลหารและเศษที่ตัวตั้งไม่เกินสี่หลักและตัวหารหนึ่งหลักโดยการหารสั้น', 'หารสั้น', 'หาผลหารและเศษโดยการหารสั้น',
    [...learnStep('<b>การหารสั้น</b>', 'การหารสั้น', [
      { fig: `<div class="p4colwrap">${p4sdivHTML(846, 3, -1)}</div>`, name: 'เขียนสั้นกว่าหารยาว', text: 'ตัวหารอยู่ซ้าย ผลหารเขียนใต้เส้น' },
      { fig: `<div class="p4colwrap">${p4sdivHTML(846, 3, 0)}</div>`, name: 'เศษเขียนตัวเล็กหน้าหลักถัดไป', text: '8 ÷ 3 = 2 เศษ 2 → เขียน 2 ตัวเล็กหน้า 4 อ่านเป็น 24' },
      { fig: `<div class="p4colwrap">${p4sdivHTML(846, 3, 2)}</div>`, name: 'หารต่อจนครบ', text: '24 ÷ 3 = 8 · 6 ÷ 3 = 2 → 282' }], 'หารสั้น = คิดในใจ เศษเขียนตัวเล็กหน้าหลักถัดไป'),
     pexStep('ตัวอย่างทีละขั้น: 715 ÷ 4', 'ตัวอย่างทีละขั้น', [['① 7 ÷ 4', 'ได้ 1 เศษ 3', `<div class="p4colwrap">${p4sdivHTML(715, 4, 0)}</div>`], ['② 31 ÷ 4', 'ได้ 7 เศษ 3', `<div class="p4colwrap">${p4sdivHTML(715, 4, 1)}</div>`], ['③ 35 ÷ 4', 'ได้ 8 เศษ 3', `<div class="p4colwrap">${p4sdivHTML(715, 4, 2)}</div>`]], '715 ÷ 4 = <b>178 เศษ 3</b>'),
     T('ลองทำตามไปด้วยกัน — หารสั้น', 'ลองทำตามไปด้วยกัน หารสั้น', el => el.append(qSim(Q.d3Short({ D: 924, k: 4, guide: true }), 'ทำเองครบทุกขั้นแล้ว'))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.d3Short({ D: 568, k: 4 }), 'ถูกต้อง!')))],
    () => [...d3pick(D3W_S, 3).map(([D, k]) => Q.d3Short({ D, k })), ...d3pick(D3W_S4, 2).map(([D, k]) => Q.d3Short({ D, k })), ...D3_SHORTWHY, d3remQ(pick(D3W_S))]),
  L3D(7, 'ป่าตัวไม่รู้ค่า', 'การหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การหาร', 'ตัวไม่ทราบค่า', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การหาร',
    [...learnStep('<b>ตัวไม่ทราบค่า</b>ในการหาร', 'ตัวไม่ทราบค่าในการหาร', [
      { fig: lbig('□ ÷ 4 = 12'), name: 'ไม่รู้ตัวตั้ง → คูณ', text: 'ตัวตั้ง = ผลหาร × ตัวหาร → 12 × 4 = 48' },
      { fig: lbig('36 ÷ □ = 9'), name: 'ไม่รู้ตัวหาร → หาร', text: 'ตัวหาร = ตัวตั้ง ÷ ผลหาร → 36 ÷ 9 = 4' },
      { fig: lbig('48 ÷ 4 = 12 ✓'), name: 'แทนค่าตรวจ', text: 'ใส่คำตอบใน □ แล้วคำนวณดูว่าเป็นจริง' }], 'ไม่รู้ตัวตั้ง → คูณ · ไม่รู้ตัวหาร → หาร'),
     pexStep('ตัวอย่างทีละขั้น: □ ÷ 7 = 35', 'ตัวอย่างทีละขั้น', [['① □ อยู่ตรงไหน', '□ คือตัวตั้ง', lbig('□ ÷ 7 = 35')], ['② ใช้การคูณ', '35 × 7 = 245', mtGroupsSVG(7, 1, 'coin', { box: 'plate', size: 20 })], ['③ ตรวจ', '245 ÷ 7 = 35 ✓', lbig('245 ÷ 7 = 35')]], '□ = <b>245</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.d3Unk({ a: 156, b: 4, c: 39, pos: 1 }), '39 × 4 = 156')))],
    () => [...pkF(D3W_UNK, 5).map(([a, b, c, pos]) => Q.d3Unk({ a, b, c, pos })), ...pkF(D3W_UNK, 2).map(d3unkHowQ), d3chkQ(pick(D3W_3))]),
  L3D(8, 'ป่าโจทย์หาร', 'โจทย์ปัญหาการหาร (1)', 'โจทย์ปัญหา (1)', 'แก้โจทย์ปัญหาการหารที่หารลงตัว',
    [...learnStep('ขั้นตอน<b>แก้โจทย์ปัญหาการหาร</b>', 'ขั้นตอนแก้โจทย์ปัญหาการหาร', [
      { fig: mtGroupsSVG(3, 5, 'apple', { size: 16 }), name: 'แบ่งเท่า ๆ กัน / จัดกลุ่มละเท่ากัน → หาร', text: 'ใส่ถุงละ… แบ่งให้…คนละเท่า ๆ กัน' },
      { fig: lbig('ประโยคสัญลักษณ์ → หารยาว'), name: 'เขียนประโยคสัญลักษณ์แล้วหาคำตอบ', text: '315 ÷ 7 = □' },
      { fig: lbig('ตอบพร้อมหน่วย'), name: 'ตอบให้ตรงคำถาม', text: 'กี่แจกัน · กี่บาท · กี่ถุง' }], 'อ่าน → หาร → ตอบพร้อมหน่วย'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'มีมะม่วง 156 ผล ใส่ตะกร้าละ 4 ผล ได้มะม่วงกี่ตะกร้า', mtGroupsSVG(4, 3, 'mango', { box: 'plate', size: 16 })], ['① ประโยคสัญลักษณ์', 'ตะกร้าละ 4 → 156 ÷ 4 = □', d3BoardHTML(156, 4, 0, 'q')], ['② หารยาว', '156 ÷ 4 = 39', d3BoardHTML(156, 4, 9, 'q')]], 'ตอบ <b>39 ตะกร้า</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.d3Story(D3S('มีลูกโป่ง 96 ลูก แบ่งให้เด็ก 8 คนเท่า ๆ กัน ได้คนละกี่ลูก', 96, 8, 'ลูก')), 'ทำเองครบทุกขั้นแล้ว')))],
    () => { const S = pkF(D3W_ST1, 8); return [...S.slice(0, 4).map(s => Q.d3Story(s)), ...S.slice(4, 6).map(d3sentQ), ...S.slice(6).map(x => d3chkQ([x.n, x.d]))]; }), /* v135: เลือกประโยค → หารยาว → ตอบ */
  L3D(9, 'ป่าโจทย์มีเศษ', 'โจทย์ปัญหาการหาร (2)', 'โจทย์ปัญหา (2)', 'แก้โจทย์ปัญหาการหารที่มีเศษ และสร้างโจทย์ปัญหาการหาร',
    [...learnStep('โจทย์ที่<b>มีเศษ</b>', 'โจทย์ที่มีเศษ', [
      { fig: dvLeft(26, 4, 'egg', { box: 'bag', size: 12 }), name: 'เศษ = สิ่งที่เหลือ', text: 'ไข่ 26 ฟอง ใส่กล่องละ 4 ฟอง ได้ 6 กล่อง เหลือ 2 ฟอง' },
      { fig: lbig('ตอบทั้งผลหารและเศษ'), name: 'ตอบให้ครบทั้งสองคำถาม', text: 'ได้กี่… และเหลือกี่…' },
      { fig: lbig('134 ÷ 2 → แต่งโจทย์'), name: 'สร้างโจทย์จากประโยคสัญลักษณ์', text: 'ตัวตั้ง = ของทั้งหมด · ตัวหาร = จำนวนคน/กลุ่ม' }], 'มีเศษ → ตอบทั้ง “ได้” และ “เหลือ”'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'มีขนม 125 ชิ้น ใส่กล่องละ 6 ชิ้น ได้กี่กล่อง เหลือกี่ชิ้น', dvLeft(20, 6, 'cookie', { box: 'bag', size: 12 })], ['① หาร', '125 ÷ 6', d3BoardHTML(125, 6, 0, 'q')], ['② ผลลัพธ์', '125 ÷ 6 = 20 เศษ 5', d3BoardHTML(125, 6, 9, 'q')]], 'ได้ <b>20 กล่อง</b> เหลือ <b>5 ชิ้น</b>'),
     T('ลองแต่งโจทย์', 'ลองแต่งโจทย์', el => el.append(qSim(Q.x3Make({ s: '96 ÷ 4', parts: ['มีดอกไม้ 96 ดอก', [['จัดใส่แจกันละ 4 ดอก', 'ซื้อมาเพิ่ม 4 ดอก'], 'จัดใส่แจกันละ 4 ดอก', '÷ 4 คือจัดกลุ่มละ 4'], [['ได้ดอกไม้กี่แจกัน', 'มีดอกไม้ทั้งหมดกี่ดอก'], 'ได้ดอกไม้กี่แจกัน', 'ถามจำนวนกลุ่ม']] }), 'ถูกต้อง!')))],
    () => { const S = pkF(D3W_ST2, 6); return [...S.slice(0, 3).map(s => Q.d3Story(s)), ...S.slice(3, 5).map(d3leftQ), d3sentQ(S[5]), ...pkF(D3W_MAKE, 2).map(o => Q.x3Make(o))]; })
];

/* ---------- boss: from the practice · d6spread · every item tagged lv ---------- */
const d3XD = (D, k, lv) => { const q = Math.floor(D / k), r = D % k, t = v => r ? `${fmt(v)} เศษ ${r}` : fmt(v); return { q: `${fmt(D)} ÷ ${k} = ?`, opts: [t(q), t(q + 1), t(q - 1), r ? `${fmt(q)} เศษ ${r + 1}` : fmt(q * 10)], a: 0, lv }; };
const EXAM_P3C8 = d6spread([
  d3XD(81, 9, 1301), d3XD(54, 6, 1301), { q: 'ตรวจคำตอบ 63 ÷ 7 = 9 ได้อย่างไร', opts: ['9 × 7 = 63', '9 + 7 = 16', '63 × 7 = 441', '63 − 9 = 54'], a: 0, lv: 1301 },
  d3XD(45, 8, 1302), { q: '29 ÷ 4 ข้อใดถูกต้อง', opts: ['7 เศษ 1', '6 เศษ 5', '5 เศษ 9', '8 เศษ 1'], a: 0, lv: 1302 },
  d3XD(78, 6, 1303), d3XD(97, 9, 1303),
  d3XD(492, 4, 1304), d3XD(305, 8, 1304),
  d3XD(6435, 3, 1305), d3XD(4217, 9, 1305),
  d3XD(746, 3, 1306), d3XD(9944, 8, 1306),
  { q: '62 ÷ □ = 31 จำนวนใน □ คือข้อใด', opts: ['2', '31', '93', '1,922'], a: 0, lv: 1307 }, { q: '□ ÷ 9 = 82 จำนวนใน □ คือข้อใด', opts: ['738', '91', '73', '9'], a: 0, lv: 1307 },
  { q: 'นุ้ยมีดอกไม้ 315 ดอก จัดใส่แจกันละ 7 ดอก นุ้ยจัดดอกไม้ได้กี่แจกัน', opts: ['45 แจกัน', '44 แจกัน', '308 แจกัน', '322 แจกัน'], a: 0, lv: 1308 },
  { q: 'จ๋าขายเสื้อ 4 ตัว ราคาเท่ากัน ได้เงิน 396 บาท เสื้อราคาตัวละกี่บาท', opts: ['99 บาท', '98 บาท', '392 บาท', '1,584 บาท'], a: 0, lv: 1308 },
  { q: 'ครูมีปากกา 182 ด้าม แจก 5 กลุ่มเท่า ๆ กัน ได้กลุ่มละกี่ด้าม เหลือกี่ด้าม', opts: ['กลุ่มละ 36 ด้าม เหลือ 2 ด้าม', 'กลุ่มละ 35 ด้าม เหลือ 7 ด้าม', 'กลุ่มละ 37 ด้าม เหลือ 0 ด้าม', 'กลุ่มละ 36 ด้าม เหลือ 5 ด้าม'], a: 0, lv: 1309 },
  { q: 'แม่ค้ามีโบว์ยาว 515 เมตร ตัดขายเส้นละ 8 เมตร ขายได้กี่เส้น เหลือกี่เมตร', opts: ['64 เส้น เหลือ 3 เมตร', '63 เส้น เหลือ 11 เมตร', '65 เส้น เหลือ 0 เมตร', '64 เส้น เหลือ 8 เมตร'], a: 0, lv: 1309 },
  { q: 'ประโยคสัญลักษณ์ 448 ÷ 8 = □ ตรงกับโจทย์ข้อใด', opts: ['มีไข่ 448 ฟอง ใส่กล่องละ 8 ฟอง ได้กี่กล่อง', 'มีไข่ 448 ฟอง ซื้อเพิ่ม 8 ฟอง มีไข่กี่ฟอง', 'มีไข่ 8 กล่อง กล่องละ 448 ฟอง มีไข่กี่ฟอง'], a: 0, lv: 1309 }]);
LESSONS_P3C8.push({ id: 1319, boss: true, place: 'ป่าหารยักษ์', title: 'ด่านบอส: ป.3 บทที่ 8 การหาร', short: 'ด่านบอส · ข้อสอบ', tone: 'yellow',
  goal: 'คำถามท้ายบท 20 ข้อ (หารยาว หารสั้น มีเศษ ตัวไม่ทราบค่า โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P3C8, pass: 10, bossName: 'งูยักษ์แบ่งเท่า', bossPal: 'sky', emblem: '÷', bossKind: 'snake',
  winLine: 'ชนะงูยักษ์แบ่งเท่าแล้ว! หารยาวได้คล่องมาก', loseLine: 'งูยักษ์แบ่งเท่ายังขดอยู่ กลับไปทวนแล้วสู้ใหม่นะ!' });
