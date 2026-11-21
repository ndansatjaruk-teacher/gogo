/* =========================================================
   INTERACTIVE KIT — shared hands-on question types used by every grade
   · Q.ixMatch   draw lines to match pairs (matchBoard)
   · Q.ixSort    tap cards into ordered slots (labels, podium slots)
   · Q.ixGroup   tap cards into the bin they belong to
   · ixDropBlank make the option chips of any “fill the blank” question draggable into the blank
   · qSim        mount any question type inside a teaching step (gate waits until it is solved)
   ========================================================= */
Object.assign(Q, {
  /* pairs: [[leftHTML, rightHTML]] — identical right labels share one key, so any of them is accepted */
  ixMatch({ q, say: sy, pairs, hint, wide }) {
    return { prompt: q, say: sy || speakText(q.replace(/<[^>]+>/g, '')), mount(bd, ctx) {
      const key = r => String(r).replace(/<[^>]+>/g, '');
      const m = matchBoard(ctx, shuffle(pairs.map(([l, r]) => ({ key: key(r), label: l }))), shuffle(pairs.map(([, r]) => ({ key: key(r), label: r }))), { hint: hint || 'ลากเส้นหรือแตะการ์ดซ้ายแล้วแตะการ์ดขวาที่เป็นคู่กัน' });
      m.classList.add('ixm'); if (wide) m.classList.add('ixw');
      bd.append(h('div', { class: 'colstack' }, m, h('div', { class: 'cap ixcap' }, 'ลากเส้นจับคู่ หรือแตะการ์ดซ้ายแล้วแตะการ์ดขวา'))); } };
  },
  /* items: [{ label (HTML), v (number to sort by) }] · dir 'asc' | 'desc' · k = only the first k places (podium) */
  ixSort({ q, say: sy, items, dir = 'asc', k, slotLabels, hint, fig, side }) { /* side (v181): ภาพซ้าย · ทางเดิน (แนวตั้ง) + การ์ดขวา — พอดีจอไม่ต้องเลื่อน */
    const n = k || items.length, sorted = [...items].sort((a, b) => dir === 'asc' ? a.v - b.v : b.v - a.v).slice(0, n);
    return { prompt: q, say: sy || speakText(q.replace(/<[^>]+>/g, '')), mount(bd, ctx) { // v119: เส้นทางคาราวาน (cvnBoard)
      const its = shuffle(items.slice()), board = cvnBoard({ cards: its.map(it => it.label), n, labels: slotLabels, ...(side ? { horiz: false } : {}), fits: (k, i) => its[k].v === sorted[i].v,
        onDone: ok => ok ? ctx.check(true) : ctx.check(false, hint || (dir === 'asc' ? 'หาสิ่งที่น้อยที่สุดที่ยังเหลือ วางก่อน' : 'หาสิ่งที่มากที่สุดที่ยังเหลือ วางก่อน')) });
      ctx.onRight = () => board.reveal();
      if (side && fig) { bd.append(h('div', { class: 'g4sd p2sd pp-sd' }, h('div', { class: 'p2sd-l', html: fig }), h('div', { class: 'g4sd-r colstack', style: { gap: '6px' } }, board, h('div', { class: 'cap ixcap' }, 'แตะการ์ดตามลำดับ — ' + cvnHint())))); return; }
      bd.append(h('div', { class: 'colstack' }, fig ? h('div', { class: 'p4-fig', html: fig }) : null, board, h('div', { class: 'cap ixcap' }, 'แตะการ์ดตามลำดับ — ' + cvnHint()))); } };
  },
  /* bins: ['คู่','คี่'] · items: [{ label, bin (index) }] — tap a card, then tap its bin (or tap the bin first) */
  /* true/false list: statements top-to-bottom, ✓ / ✗ buttons on the right of each row, then ตรวจ */
  ixTF({ q, say: sy, bins, items, hint }) {
    const lab = (bins || ['ถูก', 'ผิด']).map(b => String(b).replace(/[✓✗]/g, '').trim());
    return { prompt: q, say: sy || speakText(q.replace(/<[^>]+>/g, '')), mount(bd, ctx) {
      let done = false; const rows = shuffle(items).map(it => ({ it, v: null }));
      const list = h('div', { class: 'tfl rvl' }, h('div', { class: 'tfl-h' }, h('span'), h('b', { class: 'tfl-ht' }, lab[0]), h('b', { class: 'tfl-hf' }, lab[1])));
      const paint = r => { r.bt.classList.toggle('on', r.v === 0); r.bf.classList.toggle('on', r.v === 1); r.el.classList.toggle('set', r.v != null); };
      rows.forEach(r => { const pick2 = v => e => { e.stopPropagation(); if (done) return; r.v = r.v === v ? null : v; r.el.classList.remove('bad', 'good'); paint(r); sfx.tap(); chk.disabled = rows.some(x => x.v == null); };
        r.bt = h('button', { class: 'tfb t ia', 'aria-label': lab[0], onclick: pick2(0) }, '✓'); r.bf = h('button', { class: 'tfb f ia', 'aria-label': lab[1], onclick: pick2(1) }, '✗');
        r.el = h('div', { class: 'tfl-r' }, h('div', { class: 'tfl-t', html: r.it.label }), r.bt, r.bf); list.append(r.el); });
      const chk = h('button', { class: 'btn primary ia', disabled: true, onclick: e => { e.stopPropagation(); if (done) return; const bad = rows.filter(r => r.v !== r.it.bin);
        rows.forEach(r => { r.el.classList.toggle('bad', r.v !== r.it.bin); r.el.classList.toggle('good', r.v === r.it.bin); });
        if (!bad.length) { done = true; ctx.check(true); } else ctx.check(false, (bad.length > 1 ? `ยังไม่ถูก ${bad.length} ข้อ (กรอบสีแดง) · ` : '') + (bad[0].it.why || hint || 'อ่านข้อความทีละข้ออีกครั้ง')); } }, icon('check'), 'ตรวจ');
      list.reveal = () => { done = true; rows.forEach(r => { r.v = r.it.bin; paint(r); r.el.classList.remove('bad'); r.el.classList.add('good'); }); };
      bd.append(h('div', { class: 'colstack tfl-wrap' }, list, chk)); } };
  },
  ixGroup({ q, say: sy, bins, items, hint }) {
    if (bins && bins.length === 2 && /✓|^ถูก|^สมเหตุสมผล/.test(bins[0]) && /✗|^ผิด|^ไม่/.test(bins[1])) return Q.ixTF({ q: q.replace(/แตะ(การ์ด|ข้อความ) แล้วแตะกล่อง/, 'กด ✓ หรือ ✗ ให้ทุกข้อ:'), say: sy, bins, items, hint });
    return { prompt: q, say: sy || speakText(q.replace(/<[^>]+>/g, '')), mount(bd, ctx) {
      let sel = null, left = items.length; const pool = h('div', { class: 'cards lbl ia ixs rvl' });
      const B = bins.map((b, bi) => { const box = h('div', { class: 'ixbin ia' }, h('b', null, b), h('div', { class: 'ixin' }));
        box.onclick = e => { e.stopPropagation(); if (!sel) return; const it = sel.it;
          if (it.bin === bi) { sel.c.classList.remove('sel'); box.lastChild.append(h('span', { class: 'ixchip', html: it.label })); sel.c.classList.add('used'); sel = null; sfx.pop(items.length - --left); if (!left) ctx.check(true); }
          else { sel.c.classList.remove('wrong'); void sel.c.offsetWidth; sel.c.classList.add('wrong'); ctx.check(false, it.why || hint); } };
        return box; });
      pool.reveal = () => { pool.querySelectorAll('.ncard:not(.used)').forEach(c => { const it = c.__it; B[it.bin].lastChild.append(h('span', { class: 'ixchip reveal', html: it.label })); c.classList.add('used'); }); };
      shuffle(items).forEach(it => { const c = h('button', { class: 'ncard', html: it.label }); c.__it = it; c.onclick = e => { e.stopPropagation(); if (c.classList.contains('used')) return; sel && sel.c.classList.remove('sel'); sel = { it, c }; c.classList.add('sel'); sfx.tap(); }; pool.append(c); });
      bd.append(h('div', { class: 'colstack' }, pool, h('div', { class: 'ixbins' }, ...B), h('div', { class: 'cap ixcap' }, 'แตะการ์ด แล้วแตะกล่องที่ใช่'))); } };
  }
});

/* ---------- drag an option chip into the blank (taps keep working) ---------- */
function ixDropBlank(body) {
  const targets = [...body.querySelectorAll('.blank:not(.filled), .eq .eqb')].filter(t => t.textContent.trim() === '?');
  const opts = body.querySelector('.opts');
  if (targets.length !== 1 || !opts || opts.closest('.ans')) return;
  const btns = [...opts.querySelectorAll(':scope > .opt')]; if (btns.length < 2 || btns.length > 4) return;
  const T = targets[0]; T.classList.add('ix-dz'); opts.classList.add('ix-drag');
  opts.after(h('div', { class: 'cap ixcap' }, 'แตะคำตอบ หรือลากไปวางในช่องว่าง'));
  btns.forEach(b => {
    let st = null, ghost = null, swallow = false;
    b.addEventListener('pointerdown', e => { if (opts.dataset.done) return; st = { x: e.clientX, y: e.clientY, id: e.pointerId }; });
    b.addEventListener('pointermove', e => { if (!st || e.pointerId !== st.id) return;
      if (!ghost && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 9) { (() => { try { b.setPointerCapture(e.pointerId); } catch (_) {} })(); const r = b.getBoundingClientRect(); ghost = b.cloneNode(true); ghost.classList.add('ix-ghost'); Object.assign(ghost.style, { width: r.width + 'px', height: r.height + 'px' }); document.body.append(ghost); T.classList.add('ix-on'); }
      if (ghost) { e.preventDefault(); ghost.style.transform = `translate(${e.clientX - ghost.offsetWidth / 2}px, ${e.clientY - ghost.offsetHeight / 2}px)`; const r = T.getBoundingClientRect(), over = e.clientX > r.left - 24 && e.clientX < r.right + 24 && e.clientY > r.top - 24 && e.clientY < r.bottom + 24; T.classList.toggle('ix-hot', over); } });
    const end = e => { if (!st) return; const was = !!ghost; st = null; if (!was) return; ghost.remove(); ghost = null; swallow = true; T.classList.remove('ix-on');
      const hot = T.classList.contains('ix-hot'); T.classList.remove('ix-hot'); if (hot) { swallow = false; b.click(); } setTimeout(() => swallow = false, 60); };
    b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
    b.addEventListener('click', e => { if (swallow) { e.stopImmediatePropagation(); e.preventDefault(); swallow = false; } }, true);
  });
}

/* ---------- any question as a teaching example: solved → teachDone ---------- */
/* opt.bub (v109, ผู้ใช้ขอ: ข้อลองทำให้หน้าตาเหมือนในเกมจริง) = the page's chick bubble: the question and its feedback go there, and the
   question body is laid out exactly like the game card (.qbody + qLayout), instead of the practice box layout */
function qSim(q, done, opt = {}) {
  promptOnce(q); const G = opt.bub, box = h('div', { class: 'colstack qsim' + (G ? ' qs-game' : '') }), pr = h('div', { class: 'qsim-p', html: q.prompt }), fb = h('div', { class: 'qsim-fb' }), bub = h('div', { class: 'word fnote qsim-b' }, pr, fb), body = h('div', { class: 'qsim-body' + (G ? ' qbody' : '') });
  const setFb = G ? (html, cls) => G.set(q.prompt + (html ? `<div class="bsub">${html}</div>` : '<div class="bsub ph">&nbsp;</div>'), cls === 'ok' ? 'good' : cls === 'bad' ? 'bad' : null, cls === 'ok' ? 'wow' : 'think')
    : (html, cls) => { fb.innerHTML = html || ''; fb.className = 'qsim-fb' + (cls ? ' ' + cls : ''); };
  const ctx = { __n: 0, why: '', check(ok, hint) { if (box.dataset.done) return; if (ok) { box.dataset.done = 1; sfx.ok(); markAns(body, true); setFb('✓ ถูกต้อง! ' + (done || '') + (ctx.__n && ctx.why ? `<div class="whyx"><b>ทำไมคำตอบก่อนหน้านี้ผิด</b> ${ctx.why}</div>` : ''), 'ok'); box.querySelectorAll('.ans').forEach(a => a.classList.add('done')); try { ctx.onRight && ctx.onRight(); } catch (e) { console.warn('onRight', e); } teachDone(box); say(fb.textContent, true); }
      else { sfx.no(); markAns(body, false); { const pk = ctx.__pick; ctx.__pick = null; const hs = hint ? String(hint) : ''; if (hs || pk) ctx.why = (pk && pk.length < 60 ? `เลือก “${pk}” ซึ่งไม่ถูก` + (hs ? ' — ' : '') : '') + hs; } const r = tryStep(++ctx.__n, hint, body); if (r.reveal) { box.dataset.done = 1; revealAll(body, ctx, q); teachDone(box); } setFb(r.html, 'bad'); } },
    say(t) { setFb(t, ''); } };
  if (G) { box.append(h6wait(), body); setFb(''); trackPick(body); q.mount(body, ctx); ixDropBlank(body); calcZoom(body); qLayout(body); requestAnimationFrame(() => fitBody(body)); return box; }
  box.append(h6wait(), bub, body); trackPick(body); q.mount(body, ctx); calcZoom(body); qsArrange(box, bub, body); qLayout(body); return box;
}
/* v136/137 (ผู้ใช้ขอ: หน้าฝึกจัดองค์ประกอบเหมือนในเกม): ลูกเจี๊ยบถามในกรอบคำพูดด้านบน คำถามไม่ซ้ำในการ์ด — ใช้ใน T(title, say, qPlay(q, doneText, lead)) */
const qPlay = (q, done, lead) => el => { const Q2 = lead ? { ...q, prompt: `${lead} — ${q.prompt}` } : q; el.append(h('div', { class: 'colstack prac prac-game' }, qSim(Q2, done, { bub: window.__teachBub }))); };
/* v97 practice layout (ผู้ใช้ขอ — ทุกบท): a question with a picture → picture LEFT · question small top-right · answer bottom-right;
   no picture → question on top, answers in the middle-to-bottom (no giant question text) */
const QS_ANS = 'button, input, .keypad, .opts, .opt, .ans, .ans-slot, .slot, .ix-dz, [draggable], .seg, .fslots, .blank';
function qsFigure(body) {
  const ok = n => { if (n.closest('.opt, button, .keypad, .seg, .ans, .opts, .czbar, .icon, .ic') || (n.parentElement && n.parentElement.closest('svg, table'))) return false;
    if (n.matches('svg') && (n.classList.contains('icon') || n.classList.contains('ic'))) return false;
    if (n.matches('table') && n.querySelector('.slot, .ans-slot, input, .blank, td.in, .cell-in')) return false;
    const vb = n.viewBox && n.viewBox.baseVal; if (vb && vb.width) { if (vb.width < 40 || vb.height < 30) return false; if (vb.width / vb.height > 2.6) return false; }
    return true; };
  const c = [...body.querySelectorAll('svg, img, canvas, table')].find(ok); if (!c) return null;
  let b = c; while (b.parentElement && b.parentElement !== body && !b.parentElement.querySelector(QS_ANS)) b = b.parentElement;
  if (b.parentElement === body && b.querySelector(QS_ANS) && !b.matches('.ixtap, .ia')) return null; // the picture and the answers are one block
  return b;
}
function qsArrange(box, bub, body) {
  if (body.querySelector('.g4sd, .r4-bq, .r4-cutq')) { box.classList.add('qs-stack', 'qs-g4'); return; } // own layouts (answer area appears later) // ป.4 บท 10: question on top, then table LEFT · answer RIGHT
  const f = qsFigure(body);
  if (!f) { box.classList.add('qs-stack'); return; }
  /* v107: a picture that IS the answer (tap / drag / build on it) stays under the question like in the game (ผู้ใช้ขอ: ลองทำเองให้เหมือนเกม) */
  if (f.matches('.ia, .rvl, .ixtap') || f.querySelector('.ia, .rvl, .ixtap')) { box.classList.add('qs-stack'); return; }
  box.classList.add('qs-fig'); const L = h('div', { class: 'qs-l' }), R = h('div', { class: 'qs-r' });
  L.append(f); box.append(L, R); R.append(bub, body);
}

/* ---------- tap the right thing in a picture (instead of picking its name from a list) ---------- */
function ixTapFig(fig, sel, ctx, isRight, hint) {
  fig.classList.add('ia', 'ixtap');
  fig.querySelectorAll(sel).forEach((el, k) => { const i = el.dataset.i != null ? +el.dataset.i : k; el.classList.add('ixt');
    el.addEventListener('click', e => { e.stopPropagation(); if (fig.dataset.done) return; const ok = isRight(i);
      if (ok) { fig.dataset.done = 1; el.classList.add('ixt-ok'); } else { el.classList.remove('ixt-bad'); void el.offsetWidth; el.classList.add('ixt-bad'); }
      ctx.check(ok, hint); }); });
}

/* ---------- a game with 3+ short items of one kind (2+ true/false statements) — the game keeps at least 5 items → one hands-on item (match / sort into boxes) ---------- */
/* v130 (ผู้ใช้ขอ): ข้อความถูก/ผิด (และข้อย่อยอื่นที่รวมเป็นชุด) ห้ามซ้ำในเกมเดียวกัน แม้อยู่คนละข้อ — แต่ละข้อย่อยมี “อะตอม” ไว้ตรวจซ้ำ */
const mxKey = m => 'atom:' + m.k + ':' + String(m.text || m.r || m.kind || (m.n != null ? m.n : '')).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const qAtoms = q => q ? (q.__atoms || (q.mx ? [mxKey(q.mx)] : [])) : [];
function ixBundle(qs) {
  const groups = {}; qs.forEach((q, i) => { if (q && q.mx) (groups[q.mx.k] = groups[q.mx.k] || []).push(i); });
  const put = {}, drop = new Set(); let len = qs.length;
  Object.entries(groups).forEach(([k, idx]) => {
    const seen = new Set(), use = idx.filter(i => { const m = qs[i].mx, key = m.r || m.kind || m.text || m.n; if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, Math.min(4, len - 4));
    if (use.length < (k === 'tf' ? 2 : 3)) return; const M = use.map(i => qs[i].mx); let nq = null;
    if (k === 'tf') nq = Q.ixGroup({ q: 'แตะข้อความ แล้วแตะกล่อง <b>ถูกต้อง</b> หรือ <b>ไม่ถูกต้อง</b>', bins: ['✓ ถูกต้อง', '✗ ไม่ถูกต้อง'], items: M.map(m => ({ label: m.text, bin: m.ok ? 0 : 1, why: m.why })), hint: 'อ่านข้อความทีละข้อ แล้วตรวจว่าถูกหรือไม่' });
    else if (k === 'eo') nq = Q.ixGroup({ q: 'จัดจำนวนลงกล่อง <b>จำนวนคู่</b> หรือ <b>จำนวนคี่</b>', bins: ['จำนวนคู่', 'จำนวนคี่'], items: M.map(m => ({ label: fmt(m.n), bin: m.n % 2 })), hint: 'ดูเลขโดดในหลักหน่วย: 0 2 4 6 8 เป็นจำนวนคู่' });
    else if (k === 'nw' || k === 'nwth') nq = Q.ixMatch({ q: 'จับคู่จำนวนกับคำอ่าน', pairs: M.map(m => [m.l, m.r]), wide: true, hint: 'อ่านจำนวนทีละหลักจากซ้าย แล้วหาคำอ่านที่ตรงกัน' });
    else if (k === 'solid' || k === 'shape') nq = Q.ixMatch({ q: 'จับคู่รูปกับชื่อ', pairs: M.map(m => [m.pic, m.name]), hint: 'ดูลักษณะของรูป: จำนวนด้าน มุม หรือผิวโค้ง' });
    if (!nq) return; nq.__atoms = M.map(mxKey); put[use[0]] = nq; use.slice(1).forEach(i => drop.add(i)); len -= use.length - 1; });
  return qs.map((q, i) => put[i] || q).filter((q, i) => !drop.has(i));
}
