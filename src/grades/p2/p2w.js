/* =========================================================
   GRADE 2 · CHAPTER 4 — การวัดน้ำหนัก  (ชายหาด · ภาคเรียนที่ 1 · เมือง 46 · ด่าน 901–910 · บอส 919)
   scales (spring, balance, bathroom, hanging) · kg & ขีด · grams · kg & g · unit relations ·
   comparing weights · adding / subtracting weights · word problems
   all weights are kept in GRAMS internally (1 ขีด = 100 g, 1 kg = 1,000 g)
   ========================================================= */
let w2Uid = 0;
const w2kg = g => Math.floor(g / 1000), w2kd = g => Math.round(g % 1000 / 100), w2gr = g => g % 1000;
/* text: 'kd' → 2 กิโลกรัม 3 ขีด · 'kg' → 2 กิโลกรัม 300 กรัม · 'g' → 2,300 กรัม · 'd' → 23 ขีด */
const w2t = (g, m = 'kd', short) => { const K = short ? 'กก.' : 'กิโลกรัม', D = 'ขีด', G = short ? 'ก.' : 'กรัม';
  if (m === 'g') return `${fmt(g)} ${G}`; if (m === 'd') return `${fmt(g / 100)} ${D}`;
  const k = w2kg(g), r = m === 'kd' ? w2kd(g) : w2gr(g), u = m === 'kd' ? D : G;
  return k && r ? `${fmt(k)} ${K} ${fmt(r)} ${u}` : k ? `${fmt(k)} ${K}` : `${fmt(r)} ${u}`; };
/* ---------- dial: 'kd' / 'kg' = 8 kg per turn (tick 100 g) · 'g' = 1 kg per turn (tick 50 g) ---------- */
const W2D = { kd: { max: 8000, minor: 100, major: 1000, lab: v => v / 1000, unit: 'กิโลกรัม' }, kg: { max: 8000, minor: 100, major: 1000, lab: v => v / 1000, unit: 'กิโลกรัม' },
  g: { max: 1000, minor: 50, major: 100, lab: v => v, unit: 'กรัม' } };
function w2DialSVG(g, kind = 'kd', o = {}) {
  const C = W2D[kind], cx = 80, cy = 112, R = 58, col = PAL[o.col || 'sky'];
  let t = ''; for (let v = 0; v < C.max; v += C.minor) { const a = v / C.max * Math.PI * 2 - Math.PI / 2, maj = v % C.major === 0, mid = !maj && v % (C.major / 2) === 0, r1 = R - (maj ? 9 : mid ? 6.5 : 4);
    t += `<line x1="${(cx + Math.cos(a) * r1).toFixed(2)}" y1="${(cy + Math.sin(a) * r1).toFixed(2)}" x2="${(cx + Math.cos(a) * (R - 1)).toFixed(2)}" y2="${(cy + Math.sin(a) * (R - 1)).toFixed(2)}" stroke="#2B2550" stroke-width="${maj ? 1.8 : mid ? 1.3 : .8}"/>`;
    if (maj) t += `<text x="${cx + Math.cos(a) * (R - (kind === 'g' ? 19 : 17))}" y="${cy + Math.sin(a) * (R - (kind === 'g' ? 19 : 17)) + 3.6}" text-anchor="middle" class="w2-n${kind === 'g' ? ' sm' : ''}">${C.lab(v)}</text>`; }
  const ang = (g % C.max) / C.max * 360;
  const items = o.items ? `<g transform="translate(${80 - o.items.length * 13} 4)">${o.items.map((e, i) => `<svg x="${i * 26 - 3}" y="0" width="32" height="32" viewBox="0 0 64 64">${ART[e] || ''}</svg>`).join('')}</g>` : '';
  return `<svg viewBox="0 0 160 190" class="w2dial ${o.cls || ''}" aria-hidden="true">${items}
    <ellipse cx="80" cy="36" rx="46" ry="7" fill="${col[1]}" stroke="${col[3]}" stroke-width="2"/><rect x="74" y="38" width="12" height="12" fill="${col[2]}" stroke="${col[3]}" stroke-width="1.5"/>
    <path d="M24 64 Q24 50 40 50 H120 Q136 50 136 64 V172 Q136 184 124 184 H36 Q24 184 24 172 Z" fill="${col[1]}" stroke="${col[3]}" stroke-width="2.4"/>
    <circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="#fff" stroke="${col[3]}" stroke-width="2.4"/>${t}
    <text x="${cx}" y="${cy + 26}" text-anchor="middle" class="w2-u">${C.unit}</text>
    <g class="w2-needle" transform="rotate(${ang} ${cx} ${cy})"><line x1="${cx}" y1="${cy + 8}" x2="${cx}" y2="${cy - R + 6}" stroke="#E5505E" stroke-width="2.6" stroke-linecap="round"/></g>
    <circle cx="${cx}" cy="${cy}" r="4" fill="#2B2550"/></svg>`;
}
/* interactive dial: drag / tap the face to move the needle (snaps to the small ticks) */
function w2Dial(g, kind, o = {}) {
  const C = W2D[kind], wrap = h('div', { class: 'w2dwrap' + (o.ia ? ' ia' : ''), html: w2DialSVG(g, kind, o) }); let cur = g;
  const needle = () => wrap.querySelector('.w2-needle');
  wrap.set = (v, anim = true) => { const a0 = (cur % C.max) / C.max * 360; cur = v; needleTo(needle(), a0, (v % C.max) / C.max * 360, 80, 112, anim ? 600 : 0); };
  wrap.value = () => cur;
  if (o.ia) { const svg = wrap.firstChild; let down = false; svg.style.touchAction = 'none'; svg.style.cursor = 'pointer';
    const pick = e => { const r = svg.getBoundingClientRect(), s = r.width / 160, x = (e.clientX - r.left) / s - 80, y = (e.clientY - r.top) / s - 112;
      let a = Math.atan2(y, x) + Math.PI / 2; if (a < 0) a += Math.PI * 2; const v = Math.round(a / (Math.PI * 2) * C.max / C.minor) * C.minor % C.max;
      if (v !== cur) { wrap.set(v, false); sfx.tap(); o.onSet && o.onSet(v); } };
    svg.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); down = true; try { svg.setPointerCapture(e.pointerId); } catch (_) {} pick(e); });
    svg.addEventListener('pointermove', e => { if (down) pick(e); });
    svg.addEventListener('pointerup', () => { down = false; }); svg.addEventListener('pointercancel', () => { down = false; }); }
  return wrap;
}
/* bathroom scale with a digital read-out ('32.4' = 32 กิโลกรัม 4 ขีด) */
const w2BodySVG = (txt, col = 'lilac') => { const c = PAL[col]; return `<svg viewBox="0 0 120 120" class="w2body" aria-hidden="true"><rect x="8" y="8" width="104" height="104" rx="22" fill="${c[1]}" stroke="${c[3]}" stroke-width="2.6"/>
  <rect x="30" y="18" width="60" height="24" rx="5" fill="#EAF7EE" stroke="#2B2550" stroke-width="1.6"/><text x="60" y="36" text-anchor="middle" class="w2-lcd">${txt}</text><text x="86" y="40" class="w2-kgs">kg</text>
  <path d="M34 58 q6 -6 12 0 v34 q-6 8 -12 0 z M74 58 q6 -6 12 0 v34 q-6 8 -12 0 z" fill="${c[0]}" stroke="${c[3]}" stroke-width="1.6"/></svg>`; };
/* the four kinds of scales */
const W2_TOOL = {
  spring: ['เครื่องชั่งสปริง', `<rect x="12" y="22" width="40" height="38" rx="6" fill="#BFE6FF" stroke="#2F6FA0" stroke-width="2"/><circle cx="32" cy="41" r="13" fill="#fff" stroke="#2F6FA0" stroke-width="1.6"/><path d="M32 41 L38 33" stroke="#E5505E" stroke-width="2"/><ellipse cx="32" cy="12" rx="22" ry="5" fill="#BFE6FF" stroke="#2F6FA0" stroke-width="2"/><rect x="29" y="14" width="6" height="8" fill="#2F6FA0"/>`],
  balance: ['เครื่องชั่งสองแขน', `<path d="M32 14 V54 M18 56 H46" stroke="#6E6290" stroke-width="3"/><path d="M8 20 H56" stroke="#6E6290" stroke-width="3"/><path d="M8 20 L2 34 H16 Z M56 20 L50 34 H64 Z" fill="#FFE08A" stroke="#B7791F" stroke-width="1.6"/><circle cx="32" cy="14" r="3" fill="#6E6290"/>`],
  body: ['เครื่องชั่งน้ำหนักตัว', `<rect x="8" y="10" width="48" height="46" rx="10" fill="#E8D9FF" stroke="#6E4FB0" stroke-width="2"/><rect x="20" y="15" width="24" height="10" rx="2" fill="#EAF7EE" stroke="#2B2550"/><path d="M18 32 q4 -3 7 0 v16 q-3 4 -7 0 z M39 32 q4 -3 7 0 v16 q-3 4 -7 0 z" fill="#C9B8FF"/>`],
  hang: ['เครื่องชั่งแบบแขวน', `<path d="M32 2 V10" stroke="#6E6290" stroke-width="3"/><circle cx="32" cy="26" r="15" fill="#FFF3C4" stroke="#B7791F" stroke-width="2"/><path d="M32 26 L40 20" stroke="#E5505E" stroke-width="2"/><path d="M32 41 V48 q0 6 -6 6 q-6 0 -6 -6" fill="none" stroke="#6E6290" stroke-width="3"/>`] };
const w2ToolLab = k => `<span class="p2tl"><svg viewBox="0 0 64 64" width="56" height="56">${W2_TOOL[k][1]}</svg><b>${W2_TOOL[k][0]}</b></span>`;

/* two-slot answer (kg | ขีด or kg | กรัม) */
function w2Duo(ctx, g, m = 'kd', o = {}) {
  const want = [w2kg(g), m === 'kd' ? w2kd(g) : w2gr(g)], U = ['กิโลกรัม', m === 'kd' ? 'ขีด' : 'กรัม'], len = [7, m === 'kd' ? 1 : 3];
  const val = ['', '']; let cur = 0, done = false;
  const slots = [0, 1].map(i => h('button', { class: 'mc-slot', onclick: e => { e.stopPropagation(); if (!done) { cur = i; paint(); } } }, '?'));
  const msg = h('div', { class: 'pad-msg' });
  const paint = () => slots.forEach((s, i) => { s.textContent = val[i] === '' ? '?' : fmt(+val[i]); s.classList.toggle('on', i === cur && !done); s.classList.toggle('filled', val[i] !== ''); });
  const type = d => { if (done) return; sfx.tap(); msg.textContent = ''; val[cur] = (val[cur] + d).slice(-len[cur]).replace(/^0+(\d)/, '$1'); paint(); };
  const ok = () => { if (done) return;
    if (val[cur] === '') { msg.textContent = `กดจำนวน${U[cur]} (ถ้าไม่มีให้กด 0)`; return; }
    const other = 1 - cur; if (val[other] === '') { cur = other; paint(); msg.textContent = `ต่อไปกดจำนวน${U[cur]} (ถ้าไม่มีให้กด 0)`; return; }
    const good = +val[0] === want[0] && +val[1] === want[1];
    if (good) { done = true; wrap.classList.add('done'); }
    ctx.check(good, o.hint || (m === 'kd' && +val[1] >= 10 ? '10 ขีด ต้องเปลี่ยนเป็น 1 กิโลกรัม' : undefined));
    if (!good) { val[0] = val[1] = ''; cur = 0; paint(); } };
  const kp = h('div', { class: 'keypad' });
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: () => type(d) }, d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: () => { sfx.tap(); val[cur] = val[cur].slice(0, -1); paint(); } }, icon('left')), h('button', { class: 'btn', onclick: () => type(0) }, '0'), h('button', { class: 'btn primary', 'aria-label': 'ส่งคำตอบ', onclick: ok }, icon('check')));
  const wrap = h('div', { class: 'ans mc-ans ia' }, h('div', { class: 'mc-row' }, slots[0], h('span', { class: 'mc-u' }, U[0]), slots[1], h('span', { class: 'mc-u' }, U[1])), kp, msg);
  wrap.reveal = () => { val[0] = String(want[0]); val[1] = String(want[1]); done = true; paint(); wrap.classList.add('done', 'revealed'); }; wrap.ansText = want.map(String);
  paint(); return wrap;
}
/* column layout kg | ขีด (or กรัม) for + and − */
function w2ColHTML(a, b, op, m = 'kd', o = {}) {
  const sp = g => [w2kg(g), m === 'kd' ? w2kd(g) : w2gr(g)], A = sp(a), B = sp(b), R = sp(op === '+' ? a + b : a - b);
  const cell = v => `<td>${v === '' ? '' : fmt(v)}</td>`;
  return `<table class="w2col"><tr class="hd"><td></td><td>กิโลกรัม</td><td>${m === 'kd' ? 'ขีด' : 'กรัม'}</td></tr>
    <tr><td></td>${cell(A[0])}${cell(A[1])}</tr><tr><td class="op">${op}</td>${cell(B[0])}${cell(B[1])}</tr>
    <tr class="res"><td></td>${o.q ? '<td>?</td><td>?</td>' : cell(R[0]) + cell(R[1])}</tr></table>`;
}

/* ---------- teaching sims ---------- */
/* put things on the pan: the needle moves, the reading is written out */
function simW2Weigh(items, kind = 'kd') {
  const m = kind === 'g' ? 'g' : kind, box = h('div', { class: 'colstack' }, h6wait()), out = fNote(), on = new Set(), seen = new Set();
  const dial = w2Dial(0, kind, { col: 'mint' }), shelf = h('div', { class: 'w2shelf ia' });
  const total = () => [...on].reduce((s, i) => s + items[i][2], 0);
  items.forEach(([e, n, g], i) => { const b = h('button', { class: 'g2cell w2it', html: `${artHTML(e)}<small>${n}</small>` });
    b.onclick = ev => { ev.stopPropagation(); on.has(i) ? on.delete(i) : on.add(i); b.classList.toggle('on', on.has(i)); const t = total(); dial.set(t); sfx.pop(on.size || 1);
      const pan = dial.querySelector('.w2pan'); if (pan) pan.innerHTML = [...on].map(j => artHTML(items[j][0])).join('');
      out.innerHTML = on.size ? `บนตาชั่ง: ${[...on].map(j => items[j][1]).join(' + ')} → เข็มชี้ <b>${w2t(t, m === 'g' ? 'g' : m)}</b>` : 'แตะของเพื่อวางบนตาชั่ง';
      if (on.size) seen.add(t); if (seen.size >= 3) teachDone(box); }; shelf.append(b); });
  dial.prepend(h('div', { class: 'w2pan' }));
  out.innerHTML = 'แตะของเพื่อวางบนตาชั่ง (วางได้หลายอย่าง) — ลองอย่างน้อย 3 แบบ';
  box.append(h('div', { class: 'rowstack w2sim' }, dial, shelf), out); return box;
}
/* 1 kg = 10 ขีด = 1,000 กรัม — change the number of ขีด blocks and read all three units */
function simW2Units() {
  let d = 13; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'w2bars' }), out = fNote(), seen = new Set();
  const draw = () => { const k = Math.floor(d / 10), r = d % 10;
    fig.innerHTML = range(1, k).map(() => `<span class="w2kgbar">${range(1, 10).map(() => '<i></i>').join('')}<b>1 กก.</b></span>`).join('') + (r ? `<span class="w2kgbar part">${range(1, r).map(() => '<i></i>').join('')}</span>` : '');
    out.innerHTML = `<b>${d} ขีด</b> = <b>${w2t(d * 100, 'kd')}</b> = <b>${fmt(d * 100)} กรัม</b>`; seen.add(d); if (seen.size >= 4) teachDone(box); };
  const b = (t, v) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); const n = d + v; if (n < 1 || n > 40) { sfx.no(); return; } d = n; sfx.pop(d % 10 || 10); draw(); } }, t);
  draw(); box.append(h('div', { class: 'cap' }, 'แท่งเล็ก 1 ชิ้น = 1 ขีด = 100 กรัม · 10 ชิ้นต่อกัน = 1 กิโลกรัม'), fig, h('div', { class: 'rowstack' }, b('− 1 ขีด', -1), b('+ 1 ขีด', 1), b('+ 1 กิโลกรัม', 10)), out); return box;
}
/* tap two scales to compare */
function simW2Cmp(L, kind = 'kd') {
  const m = kind, out = fNote(); let sel = [];
  const g = h('div', { class: 'w2row ia' }, ...L.map(([e, n, v], i) => { const c = h('button', { class: 'g2cell w2card', html: `${w2DialSVG(v, kind, { items: [e], col: ['coral', 'mint', 'sky'][i % 3] })}<b>${n}</b>` });
    c.onclick = ev => { ev.stopPropagation(); sel = [...sel.filter(j => j !== i), i].slice(-2); g.querySelectorAll('.w2card').forEach((b, j) => b.classList.toggle('on', sel.includes(j))); sfx.tap();
      if (sel.length === 2) { const [A, B] = sel.map(j => L[j]); out.innerHTML = `${A[1]} ${w2t(A[2], m)} <b>${A[2] > B[2] ? 'หนักกว่า' : A[2] < B[2] ? 'เบากว่า' : 'หนักเท่ากับ'}</b> ${B[1]} ${w2t(B[2], m)}`; say(out.textContent, true); teachDone(g); } }; return c; }));
  out.innerHTML = 'แตะตาชั่ง 2 เครื่อง เพื่อเปรียบเทียบ'; return h('div', { class: 'colstack' }, g, out);
}
/* different units: change both to the same unit, then compare */
function simW2Conv(pairs) {
  const box = h('div', { class: 'colstack' }, h6wait()), out = fNote(); let k = 0;
  const show = () => { box.querySelectorAll('.w2cv').forEach(x => x.remove()); if (k >= pairs.length) { out.innerHTML = 'เปลี่ยนให้เป็น<b>หน่วยเดียวกัน</b>ก่อน แล้วจึงเปรียบเทียบ ✓'; teachDone(box); return; }
    const [a, b, u] = pairs[k], conv = [false, false], row = h('div', { class: 'rowstack w2cv' });
    const card = (x, i) => { const c = h('button', { class: 'p2card w2cvc ia', html: `<b>${x[0]}</b><span>${x[1]}</span>` }); c.onclick = e => { e.stopPropagation(); if (conv[i]) return; conv[i] = true; sfx.pop(i + 2);
        c.innerHTML = `<b>${x[0]}</b><span>${x[1]}</span><span class="w2to">= ${w2t(x[2], u)}</span>`; c.classList.add('on');
        if (conv[0] && conv[1]) { const w = a[2] > b[2] ? 'หนักกว่า' : a[2] < b[2] ? 'เบากว่า' : 'หนักเท่ากับ'; out.innerHTML = `${w2t(a[2], u)} กับ ${w2t(b[2], u)} → ${a[0]} <b>${w}</b> ${b[0]}`; say(out.textContent, true); k++; setTimeout(show, 1600); } }; return c; };
    row.append(card(a, 0), h('span', { class: 'fsign' }, '?'), card(b, 1)); out.before(row); out.innerHTML = `แตะการ์ดเพื่อเปลี่ยนเป็น<b>${u === 'g' ? 'กรัม' : 'ขีด'}</b>ทั้งคู่`; };
  box.append(out); show(); return box;
}

/* ---------- question types ---------- */
Object.assign(Q, {
  /* read a dial: m 'kd' → kg | ขีด · 'g' → grams · 'kg' → kg | กรัม */
  w2Read({ e, name, g, kind = 'kd', m }) { m = m || kind; const q = `${name}หนักเท่าไร`;
    return { prompt: q + ' <small>(อ่านเข็มบนหน้าปัด)</small>', say: q, mount(bd, ctx) { const hint = kind === 'g' ? 'ตัวเลขใหญ่ทีละ 100 กรัม ขีดเล็ก 1 ขีด = 50 กรัม' : `ตัวเลขใหญ่ = กิโลกรัม · ขีดเล็ก 1 ช่อง = ${m === 'kd' ? '1 ขีด' : '100 กรัม'}`;
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'w2fig', html: w2DialSVG(g, kind, { items: [e, e], col: pick(['coral', 'mint', 'sky', 'yellow', 'lilac']) }) }),
        m === 'g' ? h('div', { class: 'rowstack' }, answerBox(ctx, String(g), { hint }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'กรัม')) : w2Duo(ctx, g, m, { hint }))); } };
  },
  /* drag the needle to a weight */
  w2Set({ e, name, g, kind = 'kd', m }) { m = m || kind; const q = `ลากเข็มให้ชี้ <span class="hl">${w2t(g, m)}</span> (${name})`;
    return { prompt: q, say: `ลากเข็มให้ชี้ ${w2t(g, m)}`, mount(bd, ctx) { const lab = h('div', { class: 'p4steplab', html: `ให้เข็มชี้ <b>${w2t(g, m)}</b>` }), d = w2Dial(0, kind, { ia: 1, items: [e], col: 'sky' }); /* v138: ไม่บอกค่าขณะลาก — เด็กต้องอ่านหน้าปัดเอง */
      bd.append(h('div', { class: 't6-q p4-q p2q' }, d, h('div', { class: 'colstack' }, lab, h('div', { class: 'cap' }, 'แตะหรือลากบนหน้าปัด'), checkButton('ตรวจคำตอบ', () => { const v = d.value(); if (v === g) lab.innerHTML = `เข็มชี้ <b>${w2t(v, m)}</b> ✓`; ctx.check(v === g, `ตอนนี้เข็มชี้ ${w2t(v, m)} — ${v > g ? 'เกินไป' : 'ยังขาดอีก'} ${w2t(Math.abs(v - g), m)}`); })))); } };
  },
  w2Body({ txt }) { const g = Math.round(parseFloat(txt) * 1000), q = 'เครื่องชั่งน้ำหนักตัวบอกน้ำหนักเท่าไร';
    return { prompt: q + ' <small>(ตัวเลขหลังจุด = ขีด)</small>', say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'w2fig', html: w2BodySVG(txt, pick(['lilac', 'sky', 'coral'])) }), w2Duo(ctx, g, 'kd', { hint: `${txt} → ตัวเลขหน้าจุดเป็นกิโลกรัม หลังจุดเป็นขีด` }))); } };
  },
  /* unit conversion: from (grams) shown as `fromM`, answer in `to` ('g' | 'd' | 'kd' | 'kg') */
  w2Conv({ g, from, to, name }) { const q = `${name ? name + 'หนัก ' : ''}${w2t(g, from)} เท่ากับ${{ g: 'กี่กรัม', d: 'กี่ขีด', kd: 'กี่กิโลกรัม กี่ขีด', kg: 'กี่กิโลกรัม กี่กรัม' }[to]}`;
    return { prompt: q, say: q, mount(bd, ctx) { const hint = '1 กิโลกรัม = 10 ขีด = 1,000 กรัม · 1 ขีด = 100 กรัม';
      bd.append(h('div', { class: 'colstack' }, h('div', { class: 'fbig p4big', html: `<b class="num">${w2t(g, from)}</b> <span class="fop">=</span> <span class="fsign">?</span>` }),
        to === 'kd' || to === 'kg' ? w2Duo(ctx, g, to, { hint }) : h('div', { class: 'rowstack' }, answerBox(ctx, String(to === 'g' ? g : g / 100), { hint }), h('span', { class: 'cap', style: { fontSize: '20px' } }, to === 'g' ? 'กรัม' : 'ขีด')))); } };
  },
  /* + / − in columns */
  w2Calc({ a, b, op, m = 'kd', text }) { const r = op === '+' ? a + b : a - b, q = text || `${w2t(a, m)} ${op === '+' ? 'รวมกับ' : 'มากกว่า'} ${w2t(b, m)} ${op === '+' ? 'เป็นเท่าไร' : 'อยู่เท่าไร'}`;
    return { prompt: q, say: q, mount(bd, ctx) { const hint = op === '+' ? (m === 'kd' ? 'บวกขีดก่อน ครบ 10 ขีด ทด 1 กิโลกรัม' : 'บวกกรัมก่อน ครบ 1,000 กรัม ทด 1 กิโลกรัม') : (m === 'kd' ? 'ลบขีดก่อน ไม่พอให้กระจาย 1 กิโลกรัม = 10 ขีด' : 'ลบกรัมก่อน ไม่พอให้กระจาย 1 กิโลกรัม = 1,000 กรัม');
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'w2colwrap', html: w2ColHTML(op === '+' ? a : a, b, op, m, { q: true }) }), w2Duo(ctx, r, m, { hint }))); ctx.onRight = () => { const w = bd.querySelector('.w2colwrap'); if (w) w.innerHTML = w2ColHTML(a, b, op, m); }; } };
  },
  /* story: ① choose + or − ② answer */
  w2Story({ text, a, b, op, m = 'kd', why }) {
    const r = op === '+' ? a + b : a - b, S = (x, p, y) => `${w2t(x, m, 1)} ${p} ${w2t(y, m, 1)}`, right = S(a, op, b), wrong = op === '+' ? (a >= b ? S(a, '−', b) : S(b, '−', a)) : S(a, '+', b);
    return { prompt: 'อ่านโจทย์ เลือกประโยคสัญลักษณ์ แล้วหาคำตอบ', say: text.replace(/<[^>]+>/g, ''), mount(bd, ctx) {
      const lab = h('div', { class: 'p4steplab', html: 'ขั้นที่ 1: เลือก<b>ประโยคสัญลักษณ์</b>' }), slot = h('div', { class: 'colstack' });
      const hint = op === '+' ? (m === 'kd' ? 'บวกขีดก่อน ครบ 10 ขีด ทด 1 กิโลกรัม' : 'บวกกรัมก่อน ครบ 1,000 กรัม ทด 1 กิโลกรัม') : (m === 'kd' ? 'ลบขีดก่อน ไม่พอให้กระจาย 1 กิโลกรัม = 10 ขีด' : 'ลบกรัมก่อน ไม่พอให้กระจาย 1 กิโลกรัม = 1,000 กรัม');
      const sub = { check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(4); lab.innerHTML = `<b>${right} = ?</b> ✓ · ขั้นที่ 2: หาคำตอบ`; slot.innerHTML = ''; slot.append(w2Duo(ctx, r, m, { hint })); ctx.say('ใช่แล้ว! หาคำตอบเลย'); } };
      slot.append(choices(sub, shuffle([right, wrong]).map(x => ({ value: x, label: x })), right, { hint: why || (op === '+' ? 'รวมกัน เพิ่มขึ้น หรือถามสิ่งที่หนักกว่า → บวก' : 'เหลือ ผลต่าง หรือถามสิ่งที่เบากว่า → ลบ') }));
      bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text })), h('div', { class: 'colstack' }, lab, slot))); } };
  }
});
const W2W = ['หนักกว่า', 'เบากว่า', 'หนักเท่ากับ'];
const w2Cmp = (a, b, pre = '') => Q.p2cmpWord({ a: [a[0], a[1], a[2]], b: [b[0], b[1], b[2]], words: W2W, pre, hint: 'เปลี่ยนเป็นหน่วยเดียวกันก่อน (1 กิโลกรัม = 10 ขีด = 1,000 กรัม) แล้วเปรียบเทียบ' });
/* weights written in the practice: parse '2 กิโลกรัม 5 ขีด' / '1,300 กรัม' / '24 ขีด' / '2 กิโลกรัมครึ่ง' */
const w2p = s => { let g = 0; s.replace(/([\d,]+)\s*กิโลกรัม(ครึ่ง)?/, (m, k, half) => { g += +k.replace(/,/g, '') * 1000 + (half ? 500 : 0); });
  s.replace(/([\d,]+)\s*ขีด/, (m, d) => { g += +d.replace(/,/g, '') * 100; }); s.replace(/([\d,]+)\s*กรัม/, (m, x) => { g += +x.replace(/,/g, ''); }); return g; };
const w2pair = (A, B) => { const a = A.split('|'), b = B.split('|'); return [[a[0], a[1], w2p(a[1])], [b[0], b[1], w2p(b[1])]]; };

/* ---------- data: teaching (not used in the games) ---------- */
const W2T_ITEMS = [['watermelon', 'แตงโม', 2300], ['pumpkin', 'ฟักทอง', 1600], ['banana', 'กล้วย', 700], ['cabbage', 'กะหล่ำ', 1200]];
const W2T_GITEMS = [['lemon', 'มะนาว', 100], ['egg', 'ไข่', 50], ['pear', 'สาลี่', 250], ['carrot', 'แครอท', 150]];
const W2T_CMP = [['pineapple', 'สับปะรด', 1500], ['coconut', 'มะพร้าว', 2100], ['eggplant', 'มะเขือ', 1500]];
/* ---------- data: practice ---------- */
const W2W_TOOL = [['ชั่งน้ำหนักนักเรียน', 'body'], ['ชั่งยาจีนทีละนิด', 'balance'], ['ชั่งแอปเปิล 1 ถุงที่ร้านผลไม้', 'spring'], ['ชั่งเนื้อหมูที่แขวนในตลาด', 'hang']]; // 
const W2W_KD = [['durian', 'ทุเรียน', 1200], ['banana', 'กล้วย', 3800], ['orange', 'ส้ม', 3600], ['apple', 'แอปเปิล', 4700], ['tomato', 'มะเขือเทศ', 6000], ['chompoo', 'ชมพู่', 2000],
  ['pumpkin', 'ฟักทอง', 1800], ['potato', 'เผือก', 6100], ['watermelon', 'แตงโม', 5800], ['mushroom', 'เห็ด', 3500], ['guava', 'ฝรั่ง', 2300], ['coconut', 'มะพร้าว', 6400]]; // 
const W2W_SET = [['mangoY', 'มะม่วง', 2200], ['cabbage', 'ผักกาดขาว', 6500], ['pineapple', 'สับปะรด', 2700], ['potato', 'มันฝรั่ง', 1100], ['corn', 'ข้าวโพด', 4400], ['grape', 'องุ่น', 800]]; // 
const W2W_BODY = ['32.4', '47.2', '36.5', '50.6', '25.8', '33.2', '50.9', '45.4', '19.5', '64.3']; 
const W2W_G = [['orange', 'ส้ม', 250], ['crab', 'ปู', 400], ['pineapple', 'สับปะรด', 900], ['mangosteen', 'มังคุด', 150], ['shrimp', 'กุ้ง', 350], ['rambutan', 'เงาะ', 500],
  ['chicken', 'เนื้อไก่', 750], ['shrimp', 'กุ้ง', 450], ['squid', 'หมึก', 600], ['fish', 'ปลา', 850], ['salmon', 'แซลมอน', 300], ['pork', 'เนื้อหมู', 550]]; // 
const W2W_LET = [4400, 3900, 2200, 1500, 2700, 1300]; // 
const W2W_KG = [['rambutan', 'เงาะ', 1700], ['orange', 'ส้ม', 2600], ['mangosteen', 'มังคุด', 3300], ['pineapple', 'สับปะรด', 4500], ['apple', 'แอปเปิล', 2300], ['mangoY', 'มะม่วง', 1600],
  ['chili', 'พริก', 900], ['carrot', 'แครอท', 3800], ['broccoli', 'บรอกโคลี', 4200]]; // 
const W2W_KGSET = [['grape', 'องุ่น', 4900], ['pork', 'เนื้อหมู', 2400], ['corn', 'ข้าวโพด', 5100], ['chicken', 'เนื้อไก่', 1300], ['potato', 'มันฝรั่ง', 6500], ['salmon', 'เนื้อปลา', 3700]]; // 
const W2W_CONV = [[200, 'd', 'g'], [900, 'd', 'g'], [2300, 'd', 'g'], [5500, 'd', 'g'], [700, 'g', 'd'], [800, 'g', 'd'], [6100, 'g', 'd'], [7500, 'g', 'd'], [9800, 'g', 'kg'], [4200, 'g', 'kd'], [2600, 'd', 'kd'], [6700, 'd', 'kg'],
  [8200, 'd', 'g', 'เนื้อหมู'], [1600, 'd', 'kg', 'มะไฟ'], [1400, 'g', 'd', 'ลูกตาล'], [6500, 'g', 'kd', 'เห็ด'], [6100, 'd', 'kd', 'สมใจ'], [4400, 'g', 'd', 'เกลือ'], [8900, 'g', 'kg', 'แตงไทย'], [10300, 'kg', 'd', 'มะนาว'], [4900, 'kg', 'kd', 'ไก่'],
  [2000, 'kd', 'd'], [4300, 'd', 'kd'], [500, 'g', 'd'], [2500, 'kd', 'd'], [5300, 'd', 'kd'], [1800, 'kg', 'd'], [9700, 'd', 'kg'], [3400, 'd', 'kg']]; //
const W2W_DIALCMP = [[['rambutan', 'เงาะ', 1500], ['durian', 'ทุเรียน', 2300], 'kd'], [['pork', 'เนื้อหมู', 3600], ['chicken', 'เนื้อไก่', 1700], 'kd'], [['mangoY', 'มะม่วง', 2400], ['orange', 'ส้ม', 2400], 'kg']]; // 
const W2W_CMP = [['มะม่วง|4 ขีด', 'มะพร้าว|5 ขีด'], ['แตงไทย|900 กรัม', 'แตงกวา|600 กรัม'], ['ข้าว|2 กิโลกรัม 8 ขีด', 'แป้ง|3 กิโลกรัม 2 ขีด'], ['ส้มโอ|3 กิโลกรัม 5 ขีด', 'มะละกอ|2 กิโลกรัม 9 ขีด'],
  ['ชาม|4 กิโลกรัม 6 ขีด', 'จาน|4 กิโลกรัม 6 ขีด'], ['แตงโม|3 กิโลกรัม 700 กรัม', 'มะเขือเทศ|4 กิโลกรัม 500 กรัม'], ['ทุเรียน|9 กิโลกรัม 3 ขีด', 'มังคุด|7 กิโลกรัม'], ['ถั่วลิสง|2 กิโลกรัม 5 ขีด', 'มันฝรั่ง|2 กิโลกรัม 2 ขีด'],
  ['ฟักทอง|4 กิโลกรัม 1 ขีด', 'พริก|5 กิโลกรัม 1 ขีด'], ['ส้ม|2 กิโลกรัม 600 กรัม', 'ฝรั่ง|2 กิโลกรัม 200 กรัม']].map(([a, b]) => w2pair(a, b)); // (หน่วยเดียวกัน)
const W2W_CMPX = [['น้อยหน่า|1,300 กรัม', 'มะเฟือง|1 กิโลกรัม 800 กรัม'], ['กะหล่ำปลี|5 กิโลกรัม 5 ขีด', 'กะหล่ำดอก|5 กิโลกรัม 500 กรัม'], ['ข้าวโพด|700 กรัม', 'ข้าวสาลี|1 กิโลกรัม 3 ขีด'], ['ถั่วแดง|18 ขีด', 'ถั่วเขียว|1 กิโลกรัม 200 กรัม'],
  ['ผักกาด|800 กรัม', 'บรอกโคลี|8 ขีด'], ['กระเทียม|10 ขีด', 'หัวไชเท้า|1 กิโลกรัม 2 ขีด'], ['ขิง|1 กิโลกรัม 5 ขีด', 'ข่า|15 ขีด'], ['มะละกอ|1 กิโลกรัม 2 ขีด', 'มะเขือเทศ|1 กิโลกรัม 200 กรัม'],
  ['มันฝรั่ง|1 กิโลกรัม 6 ขีด', 'มะเขือ|1 กิโลกรัม 900 กรัม'], ['ผักบุ้ง|900 กรัม', 'หอมหัวใหญ่|700 กรัม'],
  ['ถุงแดง|2 กิโลกรัมครึ่ง', 'ถุงเขียว|2 กิโลกรัม 500 กรัม'], ['ถุงฟ้า|7 กิโลกรัม 100 กรัม', 'ถุงชมพู|7 กิโลกรัมครึ่ง'], ['กล่องแดง|2 กิโลกรัม 3 ขีด', 'กล่องเขียว|24 ขีด'], ['กล่องฟ้า|800 กรัม', 'กล่องเหลือง|10 ขีด'],
  ['ลังส้ม|59 ขีด', 'ลังมะม่วง|4 กิโลกรัม 4 ขีด'], ['ลังมังคุด|5 กิโลกรัม 800 กรัม', 'ลังเงาะ|5 กิโลกรัม 7 ขีด'], ['ถุงข้าว|8 กิโลกรัม 300 กรัม', 'ถุงแป้ง|5 กิโลกรัม 1 ขีด'], ['ถุงถั่ว|4 กิโลกรัม 3 ขีด', 'ถุงงา|5 กิโลกรัม 100 กรัม']].map(([a, b]) => w2pair(a, b)); //
const W2W_KDCALC = [[3400, 200, '+'], [4600, 3200, '+'], [2200, 100, '−'], [7500, 3200, '−'], [9400, 6800, '+'], [12700, 5300, '−'], [7500, 3900, '+'], [9000, 5300, '−'],
  [5700, 6400, '+'], [4700, 2500, '+'], [9400, 8900, '+'], [5400, 3800, '−'], [15300, 8900, '−'], [12200, 5600, '−']]; //
const W2W_KGCALC = [[3200, 1800, '+'], [200, 1300, '+'], [5500, 2300, '−'], [2000, 1500, '−'], [5600, 1800, '−'], [3100, 1200, '−'], [8200, 1000, '−'], [4600, 3500, '+'], [5300, 2700, '−'], [7900, 3250, '−'], [6400, 4800, '+'],
  [5500, 4500, '+'], [7700, 3400, '+'], [8900, 9300, '+'], [2600, 1800, '−'], [16300, 12900, '−'], [11300, 5400, '−']]; //
const w2S = (text, a, b, op, m) => ({ text, a, b, op, m });
const W2W_ST1 = [ //
  w2S('แตงโมลูกแรกหนัก 4 กิโลกรัม 900 กรัม ลูกที่สองหนัก 7 กิโลกรัม 400 กรัม แตงโมสองลูกหนักรวมกันเท่าไร', 4900, 7400, '+', 'kg'),
  w2S('ร้านอาหารมีเนื้อไก่ 8 กิโลกรัม 200 กรัม ใช้ทำแกงไป 400 กรัม ร้านเหลือเนื้อไก่เท่าไร', 8200, 400, '−', 'kg'),
  w2S('ฟักทองหนัก 5 กิโลกรัม 4 ขีด ขนุนหนัก 4 กิโลกรัม 3 ขีด ฟักทองและขนุนหนักรวมกันเท่าไร', 5400, 4300, '+', 'kd'),
  w2S('ป้าซื้อปลาทูหนัก 9 กิโลกรัม 2 ขีด ซื้อปลาดุกหนัก 5 กิโลกรัม 6 ขีด ป้าซื้อปลารวมหนักเท่าไร', 9200, 5600, '+', 'kd'),
  w2S('แม่ค้ามีส้ม 9 กิโลกรัม 8 ขีด ขายไปแล้ว 3 กิโลกรัม 3 ขีด แม่ค้าจะเหลือส้มเท่าไร', 9800, 3300, '−', 'kd'),
  w2S('ข้าวสารถุงสีแดงหนัก 5 กิโลกรัม 700 กรัม ถุงสีเขียวหนัก 6 กิโลกรัม 600 กรัม ถุงสีเขียวหนักกว่าเท่าไร', 6600, 5700, '−', 'kg'),
  w2S('ขนุนหนัก 11 กิโลกรัม 100 กรัม สับปะรดหนัก 7 กิโลกรัม 100 กรัม ขนุนหนักกว่าสับปะรดเท่าไร', 11100, 7100, '−', 'kg')];
const W2W_ST2 = [ //
  w2S('ป้าซื้อเงาะ 2 กิโลกรัม 7 ขีด ร้านแถมให้อีก 3 กิโลกรัม 3 ขีด ป้าได้เงาะรวมเท่าไร', 2700, 3300, '+', 'kd'),
  w2S('ฟักทองหนัก 5 กิโลกรัม 3 ขีด แตงกวาหนัก 2 กิโลกรัม 4 ขีด ฟักทองหนักกว่าแตงกวาเท่าไร', 5300, 2400, '−', 'kd'),
  w2S('ก้อยหนัก 28 กิโลกรัม 500 กรัม ก้านหนักกว่าก้อย 3 กิโลกรัม 800 กรัม ก้านหนักเท่าไร', 28500, 3800, '+', 'kg'),
  w2S('น้องหนัก 9 กิโลกรัม 800 กรัม พี่หนักกว่าน้อง 6 กิโลกรัม 300 กรัม พี่หนักเท่าไร', 9800, 6300, '+', 'kg'),
  w2S('แม่ค้าจะทำขนมโดยใช้น้ำตาล 9 กิโลกรัม 800 กรัม มีน้ำตาลอยู่แล้ว 3 กิโลกรัม 900 กรัม ต้องซื้อน้ำตาลอีกเท่าไร', 9800, 3900, '−', 'kg'),
  w2S('ซื้อแตงโมมา 5 กิโลกรัม 800 กรัม ซื้อองุ่นมา 3 กิโลกรัม 400 กรัม ซื้อแตงโมมากกว่าองุ่นเท่าไร', 5800, 3400, '−', 'kg'),
  w2S('พี่หนัก 16 กิโลกรัม 300 กรัม น้องเบากว่าพี่ 6 กิโลกรัม น้องหนักเท่าไร', 16300, 6000, '−', 'kg'),
  w2S('ลุงเก็บมะนาวได้ 3 กิโลกรัม 6 ขีด เก็บส้มได้ 8 กิโลกรัม 4 ขีด ลุงเก็บมะนาวได้น้อยกว่าส้มเท่าไร', 8400, 3600, '−', 'kd')];

/* ---------- lessons (① รู้จัก → ② ตัวอย่าง → ③ ลองทำ) ---------- */
const L2W = (no, place, title, short, goal, teach, game) => ({ id: 900 + no, place, title, short, tone: TONES5[(no + 4) % 6], goal, teach, game, learned: true });
const w2fig = (g, kind, e, col = 'sky') => `<div class="w2fig">${w2DialSVG(g, kind, { items: e ? [e] : null, col })}</div>`;
const LESSONS_P2C4 = [
  L2W(1, 'หาดตาชั่ง', 'การวัดน้ำหนักเป็นกิโลกรัมและขีด', 'กิโลกรัม · ขีด', 'เลือกเครื่องชั่งให้เหมาะสม อ่านน้ำหนักเป็นกิโลกรัมและขีดจากเครื่องชั่งสปริงและเครื่องชั่งน้ำหนักตัว',
    [learnStep('ยินดีต้อนรับสู่ <b>ชายหาดตาชั่ง</b>! รู้จัก<b>เครื่องชั่ง</b> และหน่วย<b>กิโลกรัม ขีด</b>', 'ยินดีต้อนรับสู่ชายหาดตาชั่ง รู้จักเครื่องชั่ง และหน่วยกิโลกรัม ขีด', [
      { fig: lrow(w2ToolLab('spring'), w2ToolLab('hang')), name: 'เครื่องชั่งสปริง · แบบแขวน', text: 'วางหรือแขวนของ เข็มจะหมุนบอกน้ำหนัก ใช้ชั่งผลไม้ เนื้อสัตว์' },
      { fig: lrow(w2ToolLab('body'), w2ToolLab('balance')), name: 'เครื่องชั่งน้ำหนักตัว · สองแขน', text: 'ยืนบนเครื่องชั่งเพื่อชั่งน้ำหนักตัว · สองแขนใช้ชั่งของเบา ๆ ทีละนิด' },
      { fig: lbig('1 กิโลกรัม = 10 ขีด'), name: 'หน่วยน้ำหนัก', text: '<b>กิโลกรัม</b> ใช้กับของหนัก · <b>ขีด</b> เล็กกว่า 10 ขีดรวมเป็น 1 กิโลกรัม' },
      { fig: w2fig(2300, 'kd', null, 'mint'), name: 'อ่านหน้าปัด', text: 'ตัวเลขใหญ่ = <b>กิโลกรัม</b> · ช่องเล็กระหว่างตัวเลขมี 10 ช่อง ช่องละ <b>1 ขีด</b> → 2 กิโลกรัม 3 ขีด' },
      { fig: w2BodySVG('32.4'), name: 'เครื่องชั่งน้ำหนักตัวแบบตัวเลข', text: '32.4 → หน้าจุด <b>32 กิโลกรัม</b> หลังจุด <b>4 ขีด</b>' }], 'อ่านกิโลกรัมจากตัวเลขใหญ่ แล้วนับช่องเล็กเป็นขีด'),
     T('ตัวอย่างทีละขั้น: แตงโมหนักเท่าไร', 'ตัวอย่างทีละขั้น', p4ex([['① ดูตัวเลขที่เข็มผ่านมาแล้ว', 'เข็มเลยเลข 3 แต่ยังไม่ถึง 4 → <b>3 กิโลกรัม</b>'], ['② นับช่องเล็กต่อจาก 3', 'นับได้ 6 ช่อง → <b>6 ขีด</b>'], ['③ อ่านรวม', 'แตงโมหนัก 3 กิโลกรัม 6 ขีด']], 'แตงโมหนัก <b>3 กิโลกรัม 6 ขีด</b>', '', () => h('div', { html: w2fig(3600, 'kd', 'watermelon', 'coral') }))),
     T('ลองชั่งเอง: แตะของวางบนตาชั่ง แล้วดูเข็ม', 'ลองชั่งเอง แตะของวางบนตาชั่ง แล้วดูเข็ม', el => el.append(simW2Weigh(W2T_ITEMS, 'kd'))),
     T('ลองตั้งเข็มเอง', 'ลองตั้งเข็มเอง', el => el.append(qSim(Q.w2Set({ e: 'pumpkin', name: 'ฟักทอง', g: 1600 }), 'ตั้งเข็มถูกต้อง!')))],
    () => [Q.ixMatch({ q: 'จับคู่งานกับเครื่องชั่งที่เหมาะสม', pairs: W2W_TOOL.map(([t, k]) => [t, w2ToolLab(k)]) }), ...pkF(W2W_KD, 2).map(([e, name, g]) => Q.w2Read({ e, name, g })),
      ...pkF(W2W_SET, 1).map(([e, name, g]) => Q.w2Set({ e, name, g })), Q.w2Body({ txt: pick(W2W_BODY) })]),
  L2W(2, 'หาดกรัม', 'การวัดน้ำหนักเป็นกรัม', 'กรัม', 'อ่านและบอกน้ำหนักเป็นกรัม',
    [learnStep('รู้จักหน่วย <b>กรัม</b>', 'รู้จักหน่วยกรัม', [
      { fig: lrow(lcap(artHTML('egg'), 'ไข่ ประมาณ 50 กรัม'), lcap(artHTML('lemon'), 'มะนาว ประมาณ 100 กรัม')), name: 'กรัม — หน่วยเล็กมาก', text: 'ใช้บอกน้ำหนักของ<b>เบา ๆ</b>' },
      { fig: lbig('1 กิโลกรัม = 1,000 กรัม'), name: '1,000 กรัม รวมกันเป็น 1 กิโลกรัม', text: '' },
      { fig: w2fig(350, 'g', null, 'sky'), name: 'หน้าปัดกรัม', text: 'ตัวเลขเพิ่มทีละ <b>100 กรัม</b> · ขีดเล็กตรงกลางคือ <b>50 กรัม</b> → อ่านได้ 350 กรัม' }], 'ของเบาบอกน้ำหนักเป็นกรัม · 1,000 กรัม = 1 กิโลกรัม'),
     T('ตัวอย่างทีละขั้น: สาลี่หนักเท่าไร', 'ตัวอย่างทีละขั้น', p4ex([['① ตัวเลขที่เข็มผ่านมาแล้ว', 'เข็มเลย 200 → <b>200 กรัม</b>'], ['② ขีดเล็กครึ่งทาง', 'เข็มชี้ขีดกลางระหว่าง 200 กับ 300 → เพิ่มอีก <b>50 กรัม</b>'], ['③ รวม', '200 + 50 = 250 กรัม']], 'สาลี่หนัก <b>250 กรัม</b>', '', () => h('div', { html: w2fig(250, 'g', 'pear', 'mint') }))),
     T('ลองชั่งของเบา ๆ', 'ลองชั่งของเบา ๆ', el => el.append(simW2Weigh(W2T_GITEMS, 'g'))),
     T('ลองตั้งเข็มเอง', 'ลองตั้งเข็มเอง', el => el.append(qSim(Q.w2Set({ e: 'carrot', name: 'แครอท', g: 650, kind: 'g' }), 'ตั้งเข็มถูกต้อง!')))],
    () => [...pkF(W2W_G, 4).map(([e, name, g]) => Q.w2Read({ e, name, g, kind: 'g' })), ...pkF(W2W_G, 1).map(([e, name, g]) => Q.w2Set({ e, name, g, kind: 'g' })),
      Q.p4Pick({ q: 'สิ่งใดควรบอกน้ำหนักเป็น<b>กรัม</b>', opts: ['ไข่ 1 ฟอง', 'กระสอบข้าวสาร', 'นักเรียน 1 คน'], right: 'ไข่ 1 ฟอง', hint: 'กรัมใช้กับของเบา ๆ' })]),
  L2W(3, 'หาดกิโลกรัม', 'การวัดน้ำหนักเป็นกิโลกรัมและกรัม', 'กิโลกรัม · กรัม', 'อ่านและบอกน้ำหนักเป็นกิโลกรัมและกรัม',
    [learnStep('อ่านน้ำหนักเป็น <b>กิโลกรัมและกรัม</b>', 'อ่านน้ำหนักเป็นกิโลกรัมและกรัม', [
      { fig: w2fig(1700, 'kg', null, 'mint'), name: 'หน้าปัดเดิม อ่านเป็นกรัมก็ได้', text: 'ตัวเลขใหญ่ = กิโลกรัม · ช่องเล็ก 1 ช่อง = <b>100 กรัม</b>' },
      { fig: lbig('1 กิโลกรัม 700 กรัม'), name: 'เข็มเลย 1 ไป 7 ช่อง', text: '1 กิโลกรัม กับ 7 × 100 = 700 กรัม' },
      { fig: lbig('1 กิโลกรัม 700 กรัม = 1,700 กรัม'), name: 'เขียนเป็นกรัมอย่างเดียวก็ได้', text: '1,000 + 700 = 1,700' }], 'กิโลกรัมจากตัวเลขใหญ่ · ช่องเล็กช่องละ 100 กรัม'),
     T('ตัวอย่างทีละขั้น: มะพร้าวหนักเท่าไร', 'ตัวอย่างทีละขั้น', p4ex([['① กิโลกรัม', 'เข็มเลยเลข 2 → <b>2 กิโลกรัม</b>'], ['② กรัม', 'นับช่องเล็กต่อจาก 2 ได้ 4 ช่อง → 4 × 100 = <b>400 กรัม</b>'], ['③ อ่านรวม', '2 กิโลกรัม 400 กรัม หรือ 2,400 กรัม']], 'มะพร้าวหนัก <b>2 กิโลกรัม 400 กรัม</b>', '', () => h('div', { html: w2fig(2400, 'kg', 'coconut', 'coral') }))),
     T('ลองชั่งเอง: อ่านเป็นกิโลกรัมและกรัม', 'ลองชั่งเอง อ่านเป็นกิโลกรัมและกรัม', el => el.append(simW2Weigh(W2T_ITEMS, 'kg'))),
     T('ลองจับคู่: หน้าปัดกับน้ำหนัก', 'ลองจับคู่ หน้าปัดกับน้ำหนัก', el => el.append(qSim(Q.ixMatch({ q: 'จับคู่หน้าปัดกับน้ำหนัก', pairs: [3100, 1800, 5600].map(g => [`<div class="w2mini">${w2DialSVG(g, 'kg', { col: 'sky' })}</div>`, w2t(g, 'g')]) }), 'จับคู่ครบแล้ว!')))],
    () => [...pkF(W2W_KG, 3).map(([e, name, g]) => Q.w2Read({ e, name, g, kind: 'kg' })), ...pkF(W2W_KGSET, 1).map(([e, name, g]) => Q.w2Set({ e, name, g, kind: 'kg' })),
      Q.ixMatch({ q: 'จับคู่หน้าปัดกับน้ำหนัก', pairs: pkF(W2W_LET, 3).map(g => [`<div class="w2mini">${w2DialSVG(g, 'kg', { col: pick(['coral', 'mint', 'yellow']) })}</div>`, w2t(g, 'g')]) })]),
  L2W(4, 'หาดเปลี่ยนหน่วย', 'ความสัมพันธ์ของหน่วยน้ำหนัก', 'ความสัมพันธ์ของหน่วย', 'บอกความสัมพันธ์ 1 กิโลกรัม = 10 ขีด = 1,000 กรัม และ 1 ขีด = 100 กรัม และเปลี่ยนหน่วยน้ำหนัก',
    [learnStep('<b>ความสัมพันธ์</b>ของหน่วยน้ำหนัก', 'ความสัมพันธ์ของหน่วยน้ำหนัก', [
      { fig: lbig('1 กิโลกรัม = 10 ขีด = 1,000 กรัม'), name: 'จำให้ขึ้นใจ', text: '' },
      { fig: lbig('1 ขีด = 100 กรัม'), name: 'ขีดกับกรัม', text: 'ขีดละ 100 กรัม' },
      { fig: lbig('23 ขีด = 2,300 กรัม'), name: 'ขีด → กรัม: คูณ 100', text: 'เติม 0 สองตัวท้าย' },
      { fig: lbig('4,200 กรัม = 42 ขีด = 4 กิโลกรัม 2 ขีด'), name: 'กรัม → ขีด: ทีละ 100', text: 'แล้วรวม 10 ขีดเป็น 1 กิโลกรัม' }], '1 กิโลกรัม = 10 ขีด = 1,000 กรัม · 1 ขีด = 100 กรัม'),
     T('ตัวอย่างทีละขั้น: 37 ขีด = ? กิโลกรัม ? กรัม', 'ตัวอย่างทีละขั้น', p4ex([['① แยกขีดทีละ 10', '37 ขีด = 30 ขีด + 7 ขีด'], ['② 30 ขีด', '= 3 กิโลกรัม'], ['③ 7 ขีด', '= 7 × 100 = 700 กรัม'], ['④ รวม', '3 กิโลกรัม 700 กรัม']], '37 ขีด = <b>3 กิโลกรัม 700 กรัม</b>')),
     T('ลองเพิ่มลดแท่งขีด แล้วดูหน่วยทั้งสาม', 'ลองเพิ่มลดแท่งขีด แล้วดูหน่วยทั้งสาม', el => el.append(simW2Units()))],
    () => [...pkF(W2W_CONV, 5).map(([g, from, to, name]) => Q.w2Conv({ g, from, to, name })),
      Q.ixMatch({ q: 'จับคู่น้ำหนักที่เท่ากัน', pairs: pkF([2500, 4100, 3800, 6200], 3).map(g => [w2t(g, 'kd'), w2t(g, 'g')]) })]),
  L2W(5, 'หาดเทียบตาชั่ง', 'การเปรียบเทียบน้ำหนัก (1)', 'เปรียบเทียบ (1)', 'อ่านน้ำหนักจากเครื่องชั่งแล้วเปรียบเทียบ ใช้คำว่า หนักกว่า เบากว่า หนักเท่ากับ',
    [learnStep('คำที่ใช้<b>เปรียบเทียบน้ำหนัก</b>', 'คำที่ใช้เปรียบเทียบน้ำหนัก', [
      { fig: lbig('หนักกว่า · เบากว่า · หนักเท่ากับ'), name: 'สามคำนี้ใช้เปรียบเทียบ', text: '' },
      { fig: lrow(lcap(w2DialSVG(3200, 'kd', { col: 'coral', cls: 'sm' }), 'ฟัก 3 กก. 2 ขีด'), lcap(w2DialSVG(1500, 'kd', { col: 'mint', cls: 'sm' }), 'มะละกอ 1 กก. 5 ขีด')), name: 'อ่านทั้งสองก่อน แล้วเทียบกิโลกรัม', text: '3 กิโลกรัม มากกว่า 1 กิโลกรัม → ฟัก<b>หนักกว่า</b>มะละกอ' },
      { fig: lbig('2 กก. 4 ขีด <span class="hl">&lt;</span> 2 กก. 7 ขีด'), name: 'กิโลกรัมเท่ากัน → เทียบขีด', text: '4 ขีด น้อยกว่า 7 ขีด จึง<b>เบากว่า</b>' }], 'อ่านน้ำหนัก → เทียบกิโลกรัม → ถ้าเท่ากันเทียบขีด (หรือกรัม)'),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['① อ่านตาชั่งแรก', 'สับปะรด 1 กิโลกรัม 5 ขีด'], ['② อ่านตาชั่งที่สอง', 'มะพร้าว 2 กิโลกรัม 1 ขีด'], ['③ เทียบกิโลกรัม', '1 &lt; 2 → สับปะรด<b>เบากว่า</b>มะพร้าว']], 'สับปะรด<b>เบากว่า</b>มะพร้าว')),
     T('ลองเอง: แตะตาชั่ง 2 เครื่อง', 'ลองเอง แตะตาชั่งสองเครื่อง', el => el.append(simW2Cmp(W2T_CMP)))],
    () => []),
  L2W(6, 'หาดเทียบหน่วย', 'การเปรียบเทียบน้ำหนัก (2)', 'เปรียบเทียบ (2)', 'เปรียบเทียบน้ำหนักที่เขียนต่างหน่วย โดยเปลี่ยนให้เป็นหน่วยเดียวกันก่อน',
    [learnStep('น้ำหนัก<b>ต่างหน่วย</b> เปรียบเทียบอย่างไร', 'น้ำหนักต่างหน่วย เปรียบเทียบอย่างไร', [
      { fig: lbig('18 ขีด ? 1 กิโลกรัม 200 กรัม'), name: 'หน่วยต่างกัน เทียบตัวเลขตรง ๆ ไม่ได้', text: '' },
      { fig: lbig('18 ขีด = 1,800 กรัม<br>1 กิโลกรัม 200 กรัม = 1,200 กรัม'), name: 'เปลี่ยนเป็นหน่วยเดียวกัน', text: 'เปลี่ยนเป็นกรัมทั้งคู่ (หรือขีดทั้งคู่)' },
      { fig: lbig('1,800 <span class="hl">&gt;</span> 1,200'), name: 'แล้วจึงเปรียบเทียบ', text: '18 ขีด <b>หนักกว่า</b> 1 กิโลกรัม 200 กรัม' },
      { fig: lbig('2 กิโลกรัมครึ่ง = 2 กิโลกรัม 500 กรัม'), name: 'ครึ่งกิโลกรัม = 500 กรัม = 5 ขีด', text: '' }], 'ทำให้เป็นหน่วยเดียวกันก่อน แล้วจึงเปรียบเทียบ'),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'กระเทียม 10 ขีด กับ หัวไชเท้า 1 กิโลกรัม 2 ขีด'], ['① เปลี่ยนเป็นขีด', '1 กิโลกรัม 2 ขีด = 10 + 2 = 12 ขีด'], ['② เปรียบเทียบ', '10 ขีด &lt; 12 ขีด'], ['③ สรุป', 'กระเทียม<b>เบากว่า</b>หัวไชเท้า']], 'กระเทียม<b>เบากว่า</b>หัวไชเท้า')),
     T('ลองเปลี่ยนหน่วยเอง: แตะการ์ดทั้งสองใบ', 'ลองเปลี่ยนหน่วยเอง แตะการ์ดทั้งสองใบ', el => el.append(simW2Conv([[['ถุงส้ม', '25 ขีด', 2500], ['ถุงฝรั่ง', '2 กิโลกรัม 300 กรัม', 2300], 'g'], [['ถุงถั่ว', '1 กิโลกรัม 6 ขีด', 1600], ['ถุงงา', '16 ขีด', 1600], 'd']])))],
    () => pkF(W2W_CMPX, 6).map(([a, b]) => w2Cmp(a, b))),
  L2W(7, 'หาดบวกขีด', 'การบวกและการลบเกี่ยวกับน้ำหนัก (1)', 'บวก ลบ กิโลกรัม ขีด', 'หาผลบวกและผลลบของน้ำหนักที่เป็นกิโลกรัมและขีด',
    [learnStep('บวก ลบ น้ำหนักเป็น<b>กิโลกรัมและขีด</b>', 'บวก ลบ น้ำหนักเป็นกิโลกรัมและขีด', [
      { fig: `<div class="w2colwrap">${w2ColHTML(3400, 2200, '+', 'kd')}</div>`, name: 'ตั้งให้ตรงหลัก', text: 'กิโลกรัมตรงกิโลกรัม · ขีดตรงขีด แล้วทำ<b>ขีดก่อน</b>' },
      { fig: lbig('8 ขีด + 5 ขีด = 13 ขีด = 1 กก. 3 ขีด'), name: 'บวก: ครบ 10 ขีด ทด 1 กิโลกรัม', text: '' },
      { fig: lbig('2 ขีด − 6 ขีด ไม่พอ<br>กระจาย 1 กก. = 10 ขีด → 12 − 6 = 6 ขีด'), name: 'ลบ: ขีดไม่พอ กระจาย 1 กิโลกรัม', text: '' }], 'ขีดก่อน แล้วกิโลกรัม · ครบ 10 ขีดทด · ไม่พอกระจาย'),
     T('ตัวอย่างทีละขั้น: 9 กก. 4 ขีด + 6 กก. 8 ขีด', 'ตัวอย่างทีละขั้น', p4ex([['① ขีด', '4 + 8 = 12 ขีด = 1 กิโลกรัม 2 ขีด → เขียน 2 ขีด ทด 1 กิโลกรัม'], ['② กิโลกรัม', '9 + 6 + 1 (ที่ทด) = 16 กิโลกรัม'], ['③ ตอบ', '16 กิโลกรัม 2 ขีด']], '= <b>16 กิโลกรัม 2 ขีด</b>', '', () => h('div', { class: 'w2colwrap', html: w2ColHTML(9400, 6800, '+', 'kd', { q: 1 }) }))),
     T('ตัวอย่างทีละขั้น: 12 กก. 2 ขีด − 5 กก. 6 ขีด', 'ตัวอย่างทีละขั้น', p4ex([['① ขีด', '2 ขีด ลบ 6 ขีดไม่พอ → กระจาย 1 กิโลกรัม เป็น 10 ขีด: 12 − 6 = 6 ขีด'], ['② กิโลกรัม', 'เหลือ 11 กิโลกรัม: 11 − 5 = 6 กิโลกรัม'], ['③ ตอบ', '6 กิโลกรัม 6 ขีด']], '= <b>6 กิโลกรัม 6 ขีด</b>', '', () => h('div', { class: 'w2colwrap', html: w2ColHTML(12200, 5600, '−', 'kd', { q: 1 }) }))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.w2Calc({ a: 6700, b: 2500, op: '+', m: 'kd' }), 'ถูกต้อง!')))],
    () => pkF(W2W_KDCALC, 5).map(([a, b, op]) => Q.w2Calc({ a, b, op, m: 'kd' }))),
  L2W(8, 'หาดบวกกรัม', 'การบวกและการลบเกี่ยวกับน้ำหนัก (2)', 'บวก ลบ กิโลกรัม กรัม', 'หาผลบวกและผลลบของน้ำหนักที่เป็นกิโลกรัมและกรัม',
    [learnStep('บวก ลบ น้ำหนักเป็น<b>กิโลกรัมและกรัม</b>', 'บวก ลบ น้ำหนักเป็นกิโลกรัมและกรัม', [
      { fig: `<div class="w2colwrap">${w2ColHTML(3200, 1500, '+', 'kg')}</div>`, name: 'ตั้งให้ตรงหลัก', text: 'กิโลกรัมตรงกิโลกรัม · กรัมตรงกรัม ทำ<b>กรัมก่อน</b>' },
      { fig: lbig('700 + 500 = 1,200 กรัม = 1 กก. 200 กรัม'), name: 'บวก: ครบ 1,000 กรัม ทด 1 กิโลกรัม', text: '' },
      { fig: lbig('300 − 700 ไม่พอ<br>กระจาย 1 กก. = 1,000 กรัม → 1,300 − 700 = 600'), name: 'ลบ: กรัมไม่พอ กระจาย 1 กิโลกรัม', text: '' }], 'กรัมก่อน แล้วกิโลกรัม · ครบ 1,000 กรัมทด · ไม่พอกระจาย'),
     T('ตัวอย่างทีละขั้น: 4 กก. 600 ก. + 3 กก. 500 ก.', 'ตัวอย่างทีละขั้น', p4ex([['① กรัม', '600 + 500 = 1,100 กรัม = 1 กิโลกรัม 100 กรัม → เขียน 100 ทด 1'], ['② กิโลกรัม', '4 + 3 + 1 = 8 กิโลกรัม'], ['③ ตอบ', '8 กิโลกรัม 100 กรัม']], '= <b>8 กิโลกรัม 100 กรัม</b>', '', () => h('div', { class: 'w2colwrap', html: w2ColHTML(4600, 3500, '+', 'kg', { q: 1 }) }))),
     T('ตัวอย่างทีละขั้น: 5 กก. 300 ก. − 2 กก. 700 ก.', 'ตัวอย่างทีละขั้น', p4ex([['① กรัม', '300 − 700 ไม่พอ → กระจาย 1 กิโลกรัม: 1,300 − 700 = 600 กรัม'], ['② กิโลกรัม', 'เหลือ 4 กิโลกรัม: 4 − 2 = 2 กิโลกรัม'], ['③ ตอบ', '2 กิโลกรัม 600 กรัม']], '= <b>2 กิโลกรัม 600 กรัม</b>', '', () => h('div', { class: 'w2colwrap', html: w2ColHTML(5300, 2700, '−', 'kg', { q: 1 }) }))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.w2Calc({ a: 6800, b: 2600, op: '−', m: 'kg' }), 'ถูกต้อง!')))],
    () => pkF(W2W_KGCALC, 5).map(([a, b, op]) => Q.w2Calc({ a, b, op, m: 'kg' }))),
  L2W(9, 'หาดโจทย์ชั่ง', 'โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ (1)', 'โจทย์ปัญหา (1)', 'วิเคราะห์โจทย์ปัญหาน้ำหนัก บอกสิ่งที่โจทย์ถาม สิ่งที่โจทย์บอก เขียนประโยคสัญลักษณ์และหาคำตอบ',
    [learnStep('ขั้นตอน<b>แก้โจทย์ปัญหา</b>น้ำหนัก', 'ขั้นตอนแก้โจทย์ปัญหาน้ำหนัก', [
      { fig: lbig('โจทย์ถาม · โจทย์บอก'), name: '① อ่านโจทย์', text: 'หาว่าโจทย์ถามอะไร และบอกอะไรมาบ้าง' },
      { fig: lrow(lcap(lbig('+', 'sm'), 'รวมกัน ได้เพิ่ม'), lcap(lbig('−', 'sm'), 'เหลือ ใช้ไป ต่างกัน')), name: '② เลือกบวกหรือลบ', text: 'เขียนประโยคสัญลักษณ์' },
      { fig: lbig('ตอบ 10 กิโลกรัม 300 กรัม'), name: '③ คำนวณ แล้วตอบพร้อมหน่วย', text: '' }], 'โจทย์ถาม → โจทย์บอก → ประโยคสัญลักษณ์ → คำนวณ → ตอบ'),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'ยายมีข้าวสาร 7 กิโลกรัม 400 กรัม หุงไป 900 กรัม ยายเหลือข้าวสารเท่าไร'], ['① โจทย์ถาม', 'ข้าวสารที่เหลือ'], ['② โจทย์บอก', 'มี 7 กก. 400 ก. หุงไป 900 ก.'], ['③ ประโยคสัญลักษณ์', '7 กก. 400 ก. − 900 ก. = □'], ['④ คำนวณ', 'กรัมไม่พอ กระจาย: 1,400 − 900 = 500 ก. · 6 − 0 = 6 กก.']], 'ตอบ <b>6 กิโลกรัม 500 กรัม</b>')),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.w2Story(w2S('พ่อจับปลาได้ 3 กิโลกรัม 6 ขีด ลุงจับปลาได้ 4 กิโลกรัม 7 ขีด จับปลาได้รวมกันเท่าไร', 3600, 4700, '+', 'kd')), 'ถูกต้อง!')))],
    () => pkF(W2W_ST1, 5).map(s => Q.w2Story(s))),
  L2W(10, 'หาดโจทย์เทียบ', 'โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ (2)', 'โจทย์ปัญหา (2)', 'แก้โจทย์ปัญหาการเปรียบเทียบน้ำหนัก (หนักกว่า เบากว่า มากกว่า น้อยกว่า)',
    [learnStep('คำว่า <b>หนักกว่า เบากว่า</b> ในโจทย์', 'คำว่า หนักกว่า เบากว่า ในโจทย์', [
      { fig: lbig('“หนักกว่า” ≠ บวกเสมอ'), name: 'ดูว่าโจทย์ถามสิ่งไหน', text: '' },
      { fig: lbig('พี่หนักกว่าน้อง 6 กก.<br>น้อง 20 กก. → พี่ = 20 + 6'), name: 'ถามสิ่งที่หนักกว่า → บวก', text: '' },
      { fig: lbig('น้องเบากว่าพี่ 6 กก.<br>พี่ 26 กก. → น้อง = 26 − 6'), name: 'ถามสิ่งที่เบากว่า → ลบ', text: '' },
      { fig: lbig('หนักกว่ากันเท่าไร → ลบ'), name: 'ถามผลต่าง → ลบ', text: 'เอาสิ่งที่หนักกว่าลบสิ่งที่เบากว่า' }], 'วาดแผนภาพเปรียบเทียบ ดูว่าไม่รู้ส่วนไหน'),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'กล่องแดงหนัก 4 กิโลกรัม 5 ขีด กล่องฟ้าเบากว่ากล่องแดง 1 กิโลกรัม 8 ขีด กล่องฟ้าหนักเท่าไร'], ['① ถามอะไร', 'กล่องฟ้า ซึ่ง<b>เบากว่า</b>'], ['② ประโยคสัญลักษณ์', '4 กก. 5 ขีด − 1 กก. 8 ขีด = □'], ['③ คำนวณ', 'ขีดไม่พอ กระจาย: 15 − 8 = 7 ขีด · 3 − 1 = 2 กก.']], 'ตอบ <b>2 กิโลกรัม 7 ขีด</b>')),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.w2Story(w2S('แตงโมหนัก 4 กิโลกรัม 200 กรัม ฟักทองหนักกว่าแตงโม 1 กิโลกรัม 500 กรัม ฟักทองหนักเท่าไร', 4200, 1500, '+', 'kg')), 'ถูกต้อง!')))],
    () => pkF(W2W_ST2, 5).map(s => Q.w2Story(s)))
];
/* lesson 5 game: replace the empty sort with a real one built from the drawn scales */
LESSONS_P2C4[4].game = () => { const D = pick(W2W_DIALCMP), S = pkF(W2W_KD, 3);
  return [Q.p2cmpWord({ a: [D[0][1], w2t(D[0][2], D[2]), D[0][2]], b: [D[1][1], w2t(D[1][2], D[2]), D[1][2]], words: W2W, hint: 'อ่านหน้าปัดทั้งสอง แล้วเทียบกิโลกรัมก่อน' }),
    ...pkF(W2W_CMP, 3).map(([a, b]) => w2Cmp(a, b)),
    Q.ixSort({ q: 'เรียงจาก<span class="hl">หนักไปเบา</span>', fig: `<div class="w2row">${S.map(([e, n, g]) => `<div class="w2mini"><b>${n}</b>${w2DialSVG(g, 'kd', { items: [e], col: 'sky' })}</div>`).join('')}</div>`, items: S.map(([e, n, g]) => ({ label: n, v: g })), dir: 'desc', slotLabels: ['หนักที่สุด', '', 'เบาที่สุด'] })]; };

/* ---------- boss: built from our own practice items (no official test supplied) — d6spread ---------- */
const w2X = (q, g, m, extra, fig) => { const out = [g]; [...extra, g + (m === 'kd' ? 100 : 100), g - 100, g + 1000].forEach(x => { if (out.length < (fig ? 3 : 4) && x > 0 && !out.includes(x)) out.push(x); }); return { q, fig, opts: out.map(v => w2t(v, m)), a: 0 }; };
const EXAM_P2C4 = d6spread([
  { q: 'ชั่งน้ำหนักนักเรียน ควรใช้เครื่องชั่งแบบใด', opts: ['เครื่องชั่งน้ำหนักตัว', 'เครื่องชั่งสองแขน', 'เครื่องชั่งแบบแขวน', 'เครื่องชั่งสปริงขนาดเล็ก'], a: 0 },
  w2X('จากภาพ ทุเรียนหนักเท่าไร', 1200, 'kd', [2100, 1300], `<div class="w2fig">${w2DialSVG(1200, 'kd', { items: ['durian'], col: 'mint' })}</div>`),
  w2X('จากภาพ แตงโมหนักเท่าไร', 5800, 'kd', [5700, 6800], `<div class="w2fig">${w2DialSVG(5800, 'kd', { items: ['watermelon'], col: 'coral' })}</div>`),
  { q: 'เครื่องชั่งน้ำหนักตัวแสดง 47.2 น้ำหนักเท่ากับเท่าไร', opts: ['47 กิโลกรัม 2 ขีด', '4 กิโลกรัม 72 ขีด', '472 กิโลกรัม', '47 กิโลกรัม 20 ขีด'], a: 0 },
  { q: 'จากภาพ ปูหนักเท่าไร', fig: `<div class="w2fig">${w2DialSVG(400, 'g', { items: ['crab'], col: 'sky' })}</div>`, opts: ['400 กรัม', '450 กรัม', '4 กรัม'], a: 0 },
  { q: 'จากภาพ ปลาหนักเท่าไร', fig: `<div class="w2fig">${w2DialSVG(850, 'g', { items: ['fish'], col: 'yellow' })}</div>`, opts: ['850 กรัม', '800 กรัม', '900 กรัม'], a: 0 },
  w2X('จากภาพ มังคุดหนักเท่าไร', 3300, 'kg', [3030, 2300], `<div class="w2fig">${w2DialSVG(3300, 'kg', { items: ['mangosteen'], col: 'lilac' })}</div>`),
  { q: '1 กิโลกรัม เท่ากับกี่กรัม', opts: ['1,000 กรัม', '100 กรัม', '10 กรัม', '10,000 กรัม'], a: 0 },
  { q: '23 ขีด เท่ากับกี่กรัม', opts: ['2,300 กรัม', '230 กรัม', '23 กรัม', '23,000 กรัม'], a: 0 },
  { q: '4,200 กรัม เท่ากับเท่าไร', opts: ['4 กิโลกรัม 2 ขีด', '42 กิโลกรัม', '4 กิโลกรัม 20 ขีด', '420 ขีด'], a: 0 },
  { q: 'เนื้อหมูหนัก 82 ขีด เท่ากับกี่กรัม', opts: ['8,200 กรัม', '820 กรัม', '82 กรัม', '8,020 กรัม'], a: 0 },
  { q: 'ข้าวหนัก 2 กิโลกรัม 8 ขีด … แป้งหนัก 3 กิโลกรัม 2 ขีด ควรเติมคำใด', opts: ['เบากว่า', 'หนักกว่า', 'หนักเท่ากับ'], a: 0 },
  { q: 'ถั่วแดงหนัก 18 ขีด … ถั่วเขียวหนัก 1 กิโลกรัม 200 กรัม ควรเติมคำใด', opts: ['หนักกว่า', 'เบากว่า', 'หนักเท่ากับ'], a: 0 },
  { q: 'ขิงหนัก 1 กิโลกรัม 5 ขีด … ข่าหนัก 15 ขีด ควรเติมคำใด', opts: ['หนักเท่ากับ', 'หนักกว่า', 'เบากว่า'], a: 0 },
  w2X('9 กิโลกรัม 4 ขีด บวกกับ 6 กิโลกรัม 8 ขีด ได้ผลลัพธ์เท่าใด', 16200, 'kd', [15200, 16100]),
  w2X('12 กิโลกรัม 7 ขีด หนักกว่า 5 กิโลกรัม 3 ขีด อยู่เท่าใด', 7400, 'kd', [17000, 7300]),
  w2X('4 กิโลกรัม 600 กรัม บวกกับ 3 กิโลกรัม 500 กรัม ได้ผลลัพธ์เท่าใด', 8100, 'kg', [7100, 7110]),
  w2X('5 กิโลกรัม 300 กรัม หนักกว่า 2 กิโลกรัม 700 กรัม อยู่เท่าใด', 2600, 'kg', [3400, 3600]),
  w2X('แม่ซื้อลำไย 4 กิโลกรัม 6 ขีด แม่ค้าแถมให้ 2 กิโลกรัม 5 ขีด แม่มีลำไยทั้งหมดเท่าไร', 7100, 'kd', [6100, 2100]),
  w2X('ร้านอาหารมีเนื้อไก่ 6 กิโลกรัม 400 กรัม ใช้ทำแกงไป 500 กรัม เหลือเนื้อไก่เท่าไร', 5900, 'kg', [6900, 1400])]);
LESSONS_P2C4.push({ id: 919, boss: true, place: 'อ่าวตาชั่ง', title: 'ด่านบอส: บทที่ 4 การวัดน้ำหนัก', short: 'ด่านบอส · ข้อสอบ', tone: 'coral',
  goal: 'คำถามท้ายบท 20 ข้อ (อ่านเครื่องชั่ง กิโลกรัม ขีด กรัม ความสัมพันธ์ของหน่วย เปรียบเทียบ บวก ลบ และโจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P2C4, pass: 10, bossName: 'ปีศาจปลาหมึกตาชั่ง', bossPal: 'coral', emblem: 'กก.', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกตาชั่งแล้ว! ชั่งอะไรก็แม่นยำ', loseLine: 'ปีศาจปลาหมึกยังชั่งเก่งกว่า สู้ใหม่นะ!' });
[901, 901, 901, 901, 902, 902, 903, 904, 904, 904, 904, 905, 906, 906, 907, 907, 908, 908, 909, 909].forEach((lv, i) => { if (EXAM_P2C4[i]) EXAM_P2C4[i].lv = lv; });
