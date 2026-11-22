/* =========================================================
   GRADE 2 · CHAPTER 8 — การวัดปริมาตร  (ชายหาด · ภาคเรียนที่ 2 · เมือง 45 · ด่าน 981–989 · บอส 999)
   pour a container into cups (non-standard units) · scoop dry goods · fill a tank litre by litre ·
   estimate (more / less than 1 litre) · teaspoon, tablespoon, measuring cup · volume vs capacity
   ========================================================= */
let vUid = 0;
/* container drawn in a 64 × 80 box; lvl 0..1 · o: { col, dry, marks (capacity in litres), label } */
const V_BODY = {
  glass: 'M18 16 L46 16 L42 76 L22 76 Z', jug: 'M14 14 L48 14 L50 76 L12 76 Z', tank: 'M8 16 L56 16 L51 76 L13 76 Z',
  bottle: 'M27 4 L37 4 L37 16 Q48 22 48 34 L48 74 Q48 77 45 77 L19 77 Q16 77 16 74 L16 34 Q16 22 27 16 Z', jar: 'M20 12 L44 12 Q62 30 55 58 Q50 77 32 77 Q14 77 9 58 Q2 30 20 12 Z',
  basin: 'M2 40 L62 40 L54 72 L10 72 Z', carton: 'M16 18 L32 6 L48 18 L48 77 L16 77 Z', bowl: 'M6 44 L58 44 Q56 72 32 74 Q8 72 6 44 Z',
  sack: 'M14 14 Q32 8 50 14 Q60 44 54 72 Q32 80 10 72 Q4 44 14 14 Z', cup: 'M20 34 L44 34 L42 74 L22 74 Z', scoop: 'M8 46 L46 46 L44 64 Q28 74 10 64 Z' };
const V_TOP = { glass: 16, jug: 14, tank: 16, bottle: 20, jar: 14, basin: 40, carton: 18, bowl: 44, sack: 16, cup: 34, scoop: 46 }, V_BOT = { glass: 76, jug: 76, tank: 76, bottle: 77, jar: 77, basin: 72, carton: 77, bowl: 74, sack: 74, cup: 74, scoop: 70 };
const V_EDGE = { scoop: [8, 46], bowl: [6, 58], cup: [20, 44], glass: [18, 46], jug: [14, 48], tank: [8, 56], basin: [2, 62], jar: [20, 44], bottle: [27, 37] };
function vCont(kind, lvl = 0, o = {}) {
  const id = 'vc' + (++vUid), top = V_TOP[kind], bot = V_BOT[kind], y = bot - (bot - top) * Math.max(0, Math.min(1, lvl)), col = o.col || '#7FC8F0';
  const extra = kind === 'jug' ? '<path d="M48 24 q12 2 10 18 q-2 12 -9 14" fill="none" stroke="#8C84A8" stroke-width="3"/><path d="M14 14 L6 8 L16 12" fill="#E8F6FF" stroke="#8C84A8" stroke-width="1.6"/>'
    : kind === 'tank' ? '<path d="M14 16 Q32 -6 50 16" fill="none" stroke="#8C84A8" stroke-width="2.4"/>' : kind === 'bottle' ? '<rect x="25" y="1" width="14" height="6" rx="2" fill="#E5505E"/>'
    : kind === 'scoop' ? '<rect x="44" y="50" width="18" height="6" rx="3" fill="#C9B8FF" stroke="#8C84A8"/>' : kind === 'sack' ? '<path d="M18 16 Q32 22 46 16" fill="none" stroke="#B88A4A" stroke-width="2.4"/>' : '';
  const dots = o.dry ? `<g opacity=".45">${range(0, 40).map(i => `<circle cx="${(i * 37) % 60 + 2}" cy="${y + ((i * 23) % 70)}" r="1.4" fill="#7A5A2E"/>`).join('')}</g>` : '';
  const marks = o.marks ? range(1, o.marks).map(k => { const my = bot - (bot - top) * k / o.marks; return `<line x1="${kind === 'tank' ? 50 : 42}" x2="${kind === 'tank' ? 56 : 48}" y1="${my}" y2="${my}" stroke="#2B2550" stroke-width="1.2"/>${o.marks <= 6 || k % 2 === 0 ? `<text x="${kind === 'tank' ? 49 : 41}" y="${my + 2.4}" text-anchor="end" class="v-mk">${k}</text>` : ''}`; }).join('') : '';
  return `<svg viewBox="0 0 64 80" class="vcont ${kind}" aria-hidden="true"><defs><clipPath id="${id}"><path d="${V_BODY[kind]}"/></clipPath></defs>
    <path d="${V_BODY[kind]}" fill="${kind === 'sack' ? '#F3E3C2' : kind === 'carton' ? '#FFF3DA' : '#F4FBFF'}" stroke="#8C84A8" stroke-width="2"/>
    <g clip-path="url(#${id})"><rect x="0" y="${y}" width="64" height="${80 - y}" fill="${col}" class="v-liq"/>${dots}</g>
    <path d="${V_BODY[kind]}" fill="none" stroke="#6E6290" stroke-width="2.2" stroke-linejoin="round"/>${o.heap && V_EDGE[kind] ? `<path d="M${V_EDGE[kind][0]} ${top} Q32 ${top - 15} ${V_EDGE[kind][1]} ${top} Z" fill="${col}" stroke="#8C84A8" stroke-width="1.4"/>` : ''}${o.spill ? `<g fill="${col}" stroke="#5AA7D6" stroke-width=".8"><path d="M${(V_EDGE[kind] || [10, 54])[0] - 3} ${top + 6} q-4 7 0 9 q4 -2 0 -9z"/><path d="M${(V_EDGE[kind] || [10, 54])[1] + 3} ${top + 12} q-4 7 0 9 q4 -2 0 -9z"/><ellipse cx="32" cy="${bot + 2}" rx="30" ry="2.6"/></g>` : ''}${extra}${marks}${o.label ? `<text x="32" y="${(top + bot) / 2 + 4}" text-anchor="middle" class="v-lab">${o.label}</text>` : ''}</svg>`;
}
const V_DRY = { rice: '#FFF6E0', sugar: '#EFE4CC', chili: '#E5505E', coffee: '#6B4426', flour: '#EBE0CB', bean: '#B33A3A', seed: '#8C6B3E', salt: '#E3E6EE' };
const vLiq = { juice: '#FFB534', water: '#7FC8F0', milk: '#EDE8DA', coffee: '#7A4B2A', tea: '#E07B3C', apple: '#E5505E', neem: '#7BC67E', oil: '#F2D16B', cola: '#4A2A1A', honey: '#E3A21C', syrup: '#C47A2C', sauce: '#5A3A22' };
/* pour picture: source → n cups */
const vPourFig = (src, n, cup, o = {}) => `<div class="vpour"><span class="vsrc">${vCont(src, o.lvl ?? .9, { col: o.col, dry: o.dry, label: o.label })}<small>${o.srcName || ''}</small></span><span class="varr">→</span><span class="vcups">${range(1, n).map(i => `<span class="vcup" data-i="${i}">${vCont(cup, 1, { col: o.col, dry: o.dry })}</span>`).join('')}</span></div>`;

const vShow = el => setTimeout(() => { try { el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (_) {} }, 60);
/* ---------- teaching sims (understand first: predict → try → see the rule) ---------- */
/* pour a full container into cups — cfg.level: dry goods must be levelled (ปาด) before the next scoop · cfg.done(text) final note */
function simPour(cfg) {
  const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'vpour ia' }), out = fNote(), done = new Set(), res = []; let ci = 0, left, n, heap = false;
  const bar = h('div', { class: 'rowstack ia' });
  const reset = () => { left = cfg.total; n = 0; heap = false; draw(); out.innerHTML = `กด<b>${cfg.dry ? 'ตัก' : 'เท'}</b>ทีละ${cfg.cups[ci].name}`; };
  const draw = () => { const C = cfg.cups[ci]; fig.innerHTML = `<span class="vsrc">${vCont(cfg.src, left / cfg.total * .9, { col: cfg.col, dry: cfg.dry })}<small>${cfg.srcName}</small></span><span class="varr">→</span><span class="vcups">${range(1, n).map(i => `<span class="vcup ${C.big ? 'big' : ''}">${vCont(C.kind, 1, { col: cfg.col, dry: cfg.dry, heap: heap && i === n })}</span>`).join('')}</span>`;
    flat.style.display = cfg.level && heap ? '' : 'none'; pour.style.opacity = cfg.level && heap ? .45 : 1; };
  const finish = C => { done.add(ci); res[ci] = `${n} ${C.name}`; out.innerHTML = `${cfg.srcName} ตวงได้ <b>${n} ${C.name}</b>` + (done.size === cfg.cups.length ? '<br>' + (cfg.done ? cfg.done(res) : `ภาชนะที่ใช้ตวง<b>ใหญ่กว่า</b> ได้จำนวนครั้ง<b>น้อยกว่า</b> — จึงต้องบอกว่าตวงด้วยอะไร`) : ` — ลองเปลี่ยนภาชนะดูสิ`); say(out.textContent, true); vShow(out); if (done.size === cfg.cups.length) teachDone(box); };
  const pour = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); const C = cfg.cups[ci]; if (left <= 0) return; if (heap) { sfx.no(); out.innerHTML = 'ของพูนเกินขอบ — กด<b>ปาดให้เรียบ</b>ก่อน ไม่งั้นแต่ละครั้งได้ไม่เท่ากัน'; return; }
    left -= C.size; n++; sfx.pop(Math.min(n, 9)); heap = !!cfg.level; draw(); if (heap) { out.innerHTML = `ตักได้ ${n} ครั้ง แต่ของ<b>พูน</b>อยู่ — ปาดก่อน`; return; } if (left <= 0) finish(C); else out.innerHTML = `เทแล้ว ${n} ${C.name}`; } }, cfg.dry ? 'ตัก 1 ครั้ง' : 'เท 1 ครั้ง');
  const flat = h('button', { class: 'btn sm ia vflat', onclick: e => { e.stopPropagation(); if (!heap) return; heap = false; sfx.tap(); draw(); const C = cfg.cups[ci]; if (left <= 0) finish(C); else out.innerHTML = `ปาดเรียบแล้ว ได้ ${n} ${C.name} เต็มพอดี`; } }, 'ปาดให้เรียบ');
  cfg.cups.forEach((C, i) => bar.append(h('button', { class: 'btn sm ia vsel' + (i ? '' : ' on'), onclick: e => { e.stopPropagation(); ci = i; bar.querySelectorAll('.vsel').forEach((b, j) => b.classList.toggle('on', j === i)); sfx.tap(); reset(); } }, C.name)));
  reset(); box.append(h('div', { class: 'cap' }, cfg.cap || 'เลือกภาชนะที่ใช้ตวง แล้วกด “เท 1 ครั้ง” จนหมด'), bar, fig, h('div', { class: 'rowstack' }, pour, flat), out); return box;
}
/* fill a container unit by unit — volume now, capacity when it is full (also: teaspoons into a tablespoon) */
function simLiter(cfg) {
  const U = cfg.unit || 'ลิตร'; let v = cfg.start || 0; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'vfill' }), out = fNote();
  const draw = () => { fig.innerHTML = `<span class="vsrc">${vCont(cfg.srcKind || 'jug', .85, { col: cfg.col, label: cfg.srcLabel ?? '1 ลิตร' })}<small>${cfg.srcName || 'เหยือก 1 ลิตร'}</small></span><span class="varr">→</span><span class="vbig">${vCont(cfg.kind, v / cfg.cap, { col: cfg.col, marks: cfg.cap, dry: cfg.dry })}<small>${cfg.name}</small></span>`;
    out.innerHTML = v >= cfg.cap ? (cfg.full ? cfg.full(v) : `เต็มแล้ว! ${cfg.name}มีน้ำ (ปริมาตร) <b>${v} ลิตร</b> · ${cfg.name}<b>มีความจุ ${cfg.cap} ลิตร</b> — ความจุ คือปริมาตรมากที่สุดที่ภาชนะใส่ได้`) : `${cfg.now || `ปริมาตรน้ำใน${cfg.name}`} <b>${v} ${U}</b>`; };
  const btn = (t, d) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); const nv = v + d; if (nv < 0) return; if (nv > cfg.cap) { sfx.no(); out.innerHTML = 'เต็มแล้ว เทเพิ่มไม่ได้ — จะล้น!'; return; } v = nv; sfx.pop(v || 1); draw(); if (v >= cfg.cap) { teachDone(box); say(out.textContent, true); vShow(out); } } }, t);
  draw(); box.append(fig, h('div', { class: 'rowstack' }, btn(cfg.add || 'เทน้ำ 1 ลิตร', 1), btn(cfg.sub || 'ตักออก 1 ลิตร', -1)), out); return box;
}
/* predict by eye, then measure with the same glass: a tall bottle can hold less than a wide basin */
function simWhy(cfg) {
  const box = h('div', { class: 'colstack' }, h6wait()), out = fNote(), row = h('div', { class: 'vwhy' }), bar = h('div', { class: 'rowstack' }), done = new Set(); let guess = null;
  const draw = () => { row.innerHTML = ''; cfg.items.forEach((it, i) => { const c = h('div', { class: 'vwcol' + (guess === i ? ' on' : '') + (guess == null ? ' ia' : ''), html: `<span class="vbig">${vCont(it.kind, done.has(i) ? 0 : it.lvl, { col: it.col })}<small>${it.name}</small></span><span class="vcups">${done.has(i) ? range(1, it.n).map(() => `<span class="vcup">${vCont(cfg.cup, 1, { col: it.col })}</span>`).join('') : ''}</span>${done.has(i) ? `<b class="vcnt">${it.n} ${cfg.cupName}</b>` : ''}` });
    if (guess == null) c.onclick = e => { e.stopPropagation(); guess = i; sfx.tap(); out.innerHTML = `ทายว่า <b>${it.name}</b> มีน้ำมากกว่า — กดปุ่ม <b>ตวง</b> เพื่อพิสูจน์`; draw(); btns(); }; row.append(c); }); };
  const btns = () => { bar.innerHTML = ''; cfg.items.forEach((it, i) => { if (!done.has(i)) bar.append(h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); done.add(i); sfx.pop(it.n); draw(); btns();
    if (done.size === cfg.items.length) { const [a, b] = cfg.items, m = a.n > b.n ? a : b; out.innerHTML = `${a.name}ได้ <b>${a.n} ${cfg.cupName}</b> · ${b.name}ได้ <b>${b.n} ${cfg.cupName}</b> → <b>${m.name}มีปริมาตรมากกว่า</b>${guess === cfg.items.indexOf(m) ? ' ทายถูก!' : ' — ดูด้วยตาอาจผิดได้!'}<br><b>ปริมาตร</b> คือปริมาณของสิ่งที่อยู่ในภาชนะ · จะรู้ว่ามากหรือน้อย ต้อง<b>ตวงด้วยภาชนะเดียวกัน แล้วนับ</b>`; say(out.textContent, true); vShow(out); teachDone(box); } else out.innerHTML = `${it.name}ตวงได้ ${it.n} ${cfg.cupName} — ตวงอีกใบ`; } }, `ตวง${it.name}`)); }); };
  out.innerHTML = 'ดูด้วยตา แล้ว<b>แตะ</b>ภาชนะที่คิดว่ามีน้ำมากกว่า'; draw(); box.append(row, bar, out); return box;
}
/* pour a full 1-litre bottle into a container: spills → less than 1 litre · not full → more than 1 litre */
function simEst1L(list) {
  const box = h('div', { class: 'colstack' }, h6wait()), out = fNote(), fig = h('div', { class: 'vpour' }), sel = h('div', { class: 'rowstack ia' }), tried = new Set(); let cur = null, st = 0;
  const draw = () => { const it = list[cur]; fig.innerHTML = `<span class="vsrc">${vCont('bottle', st ? 0 : .9, { col: vLiq.water, label: '1 ลิตร' })}<small>ขวด 1 ลิตร</small></span><span class="varr">→</span>` + (it ? `<span class="vbig">${vCont(it.kind, st ? Math.min(1, 1 / it.cap) : 0, { col: vLiq.water, spill: st && it.cap < 1 })}<small>${it.name}</small></span>` : '<span class="vbig cap">เลือกภาชนะ</span>'); };
  list.forEach((it, i) => sel.append(h('button', { class: 'btn sm ia vsel', onclick: e => { e.stopPropagation(); cur = i; st = 0; sel.querySelectorAll('.vsel').forEach((b, j) => b.classList.toggle('on', j === i)); sfx.tap(); draw(); out.innerHTML = `ทายก่อน: ${it.name}จะ<b>ล้น</b>หรือ<b>ไม่เต็ม</b>? แล้วกด “เทขวด 1 ลิตร”`; } }, it.name)));
  const pour = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (cur == null) { out.innerHTML = 'เลือกภาชนะก่อน'; return; } if (st) return; st = 1; const it = list[cur]; tried.add(cur); draw(); sfx.pop(3);
    out.innerHTML = it.cap < 1 ? `น้ำ<b>ล้น</b>! ${it.name}ใส่ได้<b>น้อยกว่า 1 ลิตร</b>` : `ยัง<b>ไม่เต็ม</b> ${it.name}ใส่ได้<b>มากกว่า 1 ลิตร</b>`;
    if (tried.size === list.length) { out.innerHTML += '<br><b>คาดคะเน</b> = นึกถึงขวด 1 ลิตร แล้วเทียบว่าภาชนะใส่ได้มากกว่าหรือน้อยกว่า'; teachDone(box); } else out.innerHTML += ' — ลองภาชนะอื่น'; say(out.textContent, true); vShow(out); } }, 'เทขวด 1 ลิตร');
  out.innerHTML = 'เลือกภาชนะ แล้วเทน้ำจากขวด 1 ลิตรลงไป'; draw(); box.append(sel, fig, pour, out); return box;
}
/* compare capacity without numbers: fill A, pour into empty B — spills → A holds more */
function simPourCmp(pairs) {
  let k = 0, st = 0; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'vpour' }), out = fNote(), log = h('div', { class: 'colstack fstory' });
  const btn = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (st) return; st = 1; const [A, B] = pairs[k]; draw(); sfx.pop(4);
    const t = A.cap > B.cap ? `น้ำ<b>ล้น</b> → ${A.name}<b>จุมากกว่า</b>${B.name}` : `${B.name}<b>ยังไม่เต็ม</b> → ${A.name}<b>จุน้อยกว่า</b>${B.name}`; out.innerHTML = t; log.append(h('div', { class: 'fst-row', html: t })); say(out.textContent, true); vShow(out);
    setTimeout(() => { if (k < pairs.length - 1) { k++; st = 0; draw(); out.innerHTML = 'ทายก่อน แล้วลองคู่ต่อไป'; } else { out.innerHTML = 'ไม่ต้องรู้ตัวเลข ก็เปรียบเทียบความจุได้ด้วย<b>การเทจากภาชนะหนึ่งใส่อีกภาชนะหนึ่ง</b> · ถ้ารู้ความจุเป็นลิตร ก็เทียบตัวเลขได้เลย'; vShow(out); teachDone(box); } }, 1300); } });
  const draw = () => { const [A, B] = pairs[k]; fig.innerHTML = `<span class="vbig">${vCont(A.kind, st ? 0 : .95, { col: vLiq.water })}<small>${A.name} ${st ? '(เทแล้ว)' : '(น้ำเต็ม)'}</small></span><span class="varr">→</span><span class="vbig">${vCont(B.kind, st ? Math.min(1, A.cap / B.cap) : 0, { col: vLiq.water, spill: st && A.cap > B.cap })}<small>${B.name} (ว่าง)</small></span>`; btn.textContent = `เทน้ำจาก${A.name}ลงใน${B.name}`; };
  draw(); out.innerHTML = 'ทายก่อนว่าน้ำจะล้นไหม แล้วกดเท'; box.append(fig, btn, out, log); return box;
}
/* same-size tanks: tap two, the higher water has more litres; the gap is the difference */
function simCmpTanks(L, cap) {
  const out = fNote(); let sel = [];
  const g = h('div', { class: 'p2cards ia' }, ...L.map((x, i) => { const c = h('button', { class: 'g2cell', html: `<div class="p2card vcard">${vCont('tank', x[1] / cap, { col: x[2], marks: cap })}<b>${x[0]}</b><span>${x[1]} ลิตร</span></div>` });
    c.onclick = e => { e.stopPropagation(); sel = [...sel.filter(j => j !== i), i].slice(-2); g.querySelectorAll('.g2cell').forEach((b, j) => b.classList.toggle('on', sel.includes(j))); sfx.tap();
      if (sel.length === 2) { const [A, B] = sel.map(j => L[j]), d = Math.abs(A[1] - B[1]); out.innerHTML = d ? `${A[0]} ${A[1]} ลิตร <b>${A[1] > B[1] ? 'มากกว่า' : 'น้อยกว่า'}</b> ${B[0]} ${B[1]} ลิตร อยู่ <b>${A[1] > B[1] ? A[1] : B[1]} − ${A[1] > B[1] ? B[1] : A[1]} = ${d} ลิตร</b><br>ถังขนาดเท่ากัน น้ำสูงกว่า = ปริมาตรมากกว่า · ใช้หน่วยลิตรเหมือนกัน จึงเทียบ<b>ตัวเลข</b>ได้เลย` : 'เท่ากัน'; say(out.textContent, true); vShow(out); teachDone(g); } }; return c; }));
  out.innerHTML = 'แตะถัง 2 ใบเพื่อเปรียบเทียบ'; return h('div', { class: 'colstack' }, g, out);
}

/* ---------- question types ---------- */
Object.assign(Q, {
  vPour({ src, srcName, n, cup, cupName, col, dry }) {
    const q = `${srcName} ตวงได้กี่${cupName}`;
    return { prompt: q + ' <small>(แตะภาชนะทำเครื่องหมายขณะนับได้)</small>', say: q, mount(bd, ctx) { const f = h('div', { class: 'vwrap', html: vPourFig(src, n, cup, { col, dry, srcName }) }); f.classList.add('ia');
      f.querySelectorAll('.vcup').forEach(c => c.addEventListener('click', e => { e.stopPropagation(); c.classList.toggle('mk'); sfx.tap(); }));
      bd.append(h('div', { class: 't6-q p4-q p2q' }, f, h('div', { class: 'rowstack' }, answerBox(ctx, String(n), { hint: `นับ${cupName}ที่ตวงได้ทีละใบ` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, cupName)))); } };
  },
  vRead({ kind, cap, v, name, col }) {
    const q = `${name}มีปริมาตรกี่ลิตร`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'vwrap one', html: vCont(kind, v / cap, { col, marks: cap }) }), h('div', { class: 'rowstack' }, answerBox(ctx, String(v), { hint: 'ดูระดับน้ำ แล้วอ่านตัวเลขที่ขีดตรงกับผิวน้ำ' }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'ลิตร')))); } };
  },
  /* fill to a target with + / − 1 litre */
  vFill({ kind, cap, target, name, col }) {
    const q = `เติมน้ำใน${name}ให้มีปริมาตร <span class="hl">${target} ลิตร</span>`;
    return { prompt: q, say: `เติมน้ำใน${name}ให้มีปริมาตร ${target} ลิตร`, mount(bd, ctx) { let v = 0; const f = h('div', { class: 'vwrap one' }), lab = h('div', { class: 'fbig' });
      const draw = () => { f.innerHTML = vCont(kind, v / cap, { col, marks: cap }); lab.innerHTML = `<b class="num">${v}</b> ลิตร`; };
      const b = (t, d) => h('button', { class: 'btn ia', onclick: e => { e.stopPropagation(); v = Math.max(0, Math.min(cap, v + d)); sfx.tap(); draw(); } }, t);
      draw(); bd.append(h('div', { class: 'rowstack vfq' }, f, h('div', { class: 'colstack' }, lab, h('div', { class: 'rowstack' }, b('ตักออก 1 ลิตร', -1), b('เทน้ำ 1 ลิตร', 1)), checkButton('ตรวจคำตอบ', () => ctx.check(v === target, v > target ? `มากเกินไป ${v - target} ลิตร` : `ยังขาดอีก ${target - v} ลิตร`))))); } };
  },
  /* volume or capacity? */
  vWord({ text, right, fig }) {
    return { prompt: 'เติมคำว่า ปริมาตร หรือ ความจุ', say: text.replace('___', 'ช่องว่าง'), mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?'), [a, b] = text.split('___');
      bd.append(h('div', { class: 'colstack' }, fig ? h('div', { class: 'vwrap one', html: fig }) : null, h('div', { class: 'sentence' }, h('span', { class: 'lab' }, a), blank, h('span', { class: 'lab' }, b)), wordChoices(ctx, right, blank, 'ปริมาตร = ของที่อยู่ข้างใน · ความจุ = ปริมาตรมากที่สุดที่ภาชนะใส่ได้', ['ปริมาตร', 'ความจุ']))); } };
  }
});
const vNum = o => { const q = Q.p4Num(o), m = q.mount; q.mount = (bd, ctx) => { m(bd, ctx); if (o.fig) bd.querySelector('.t6-q')?.classList.add('p2q'); }; return q; };
const vEstQ = items => Q.ixGroup({ q: 'คาดคะเน: แตะสิ่งของ แล้วแตะกล่องที่ใช่', bins: ['น้อยกว่า 1 ลิตร', 'มากกว่า 1 ลิตร'], items: items.map(([art, name, more]) => ({ label: `<span class="vest">${V_EST_ART(art)}<small>${name}</small></span>`, bin: more ? 1 : 0, why: `เทียบกับขวดน้ำ 1 ลิตร: ${name}${more ? 'ใส่ได้มากกว่า' : 'ใส่ได้น้อยกว่า'}` })), hint: 'เทียบกับขวดน้ำขนาด 1 ลิตร' });
const V_EST_ART = a => V_BODY[a] ? vCont(a, .7) : `<svg viewBox="0 0 64 64">${ART[a] || SCENERY[a] || ART.star}</svg>`;
const V_TOOL = { spoon: ['ช้อนตวง', '<g fill="#C9B8FF" stroke="#6E6290" stroke-width="1.6"><ellipse cx="18" cy="22" rx="10" ry="7"/><ellipse cx="30" cy="34" rx="8" ry="5.5"/><ellipse cx="40" cy="44" rx="6" ry="4"/></g><path d="M28 22 H58 M38 34 H58 M46 44 H58" stroke="#6E6290" stroke-width="3"/>'],
  cup: ['ถ้วยตวง', '<path d="M14 14 L46 14 L44 58 L16 58 Z" fill="#E8F6FF" stroke="#6E6290" stroke-width="2"/><path d="M46 22 q12 2 10 16 q-2 10 -10 10" fill="none" stroke="#6E6290" stroke-width="3"/><path d="M16 26 h8 M16 36 h8 M16 46 h8" stroke="#2F86C2" stroke-width="1.6"/><rect x="16" y="40" width="28" height="18" fill="#7FC8F0" opacity=".6"/>'],
  cyl: ['กระบอกตวง', '<path d="M24 4 L40 4 L40 54 L24 54 Z" fill="#E8F6FF" stroke="#6E6290" stroke-width="2"/><rect x="16" y="54" width="32" height="6" rx="2" fill="#6E6290"/><path d="M24 14 h7 M24 22 h5 M24 30 h7 M24 38 h5 M24 46 h7" stroke="#2F86C2" stroke-width="1.4"/><rect x="25" y="30" width="14" height="24" fill="#9BE3B5" opacity=".7"/>'],
  oil: ['ลิตรตวงน้ำมัน', '<path d="M18 22 L46 22 L48 60 L16 60 Z" fill="#D9DDE6" stroke="#6E6290" stroke-width="2"/><path d="M46 28 L60 12" stroke="#6E6290" stroke-width="4"/><path d="M18 22 q14 -14 28 0" fill="none" stroke="#6E6290" stroke-width="2.4"/>'] };
const vToolLab = k => `<span class="p2tl"><svg viewBox="0 0 64 64" width="52" height="52">${V_TOOL[k][1]}</svg><b>${V_TOOL[k][0]}</b></span>`;
const vStory = (text, expr, unit, wrong) => D6S(text, expr, wrong || [expr.includes('+') ? expr.replace('+', '−').replace(/^(\d+) − (\d+)$/, (m, a, b) => +a >= +b ? `${a} − ${b}` : `${b} − ${a}`) : expr.replace('−', '+')], unit);

/* ---------- data: teaching (not used in the games) ---------- */
const VT_POUR = { src: 'jug', srcName: 'น้ำมะพร้าวในเหยือก', col: '#CBE8E0', total: 8, cups: [{ kind: 'glass', size: 1, name: 'แก้วเล็ก' }, { kind: 'jug', size: 2, name: 'เหยือกเล็ก', big: 1 }] };
const VT_DRY = { src: 'sack', srcName: 'ทรายในถุง', col: '#F2D9A0', dry: 1, total: 6, cups: [{ kind: 'scoop', size: 1, name: 'ที่ตัก' }, { kind: 'bowl', size: 2, name: 'ชาม', big: 1 }] };
const VT_EST = [['bottle', 'ขวดน้ำดื่มเล็ก', 0], ['tank', 'ถังน้ำ', 1], ['mug', 'แก้วกาแฟ', 0], ['jar', 'โอ่งน้ำ', 1]];
/* ---------- data: practice ---------- */
const VW_TOOL = [['ตวงน้ำยาเคมี 50 มิลลิลิตร', 'cyl'], ['ตวงน้ำมันเบนซิน', 'oil'], ['ตวงนมสด 1 ลิตร', 'cup'], ['ตวงเกลือป่น', 'spoon']]; // 
const VW_POUR = [['carton', 'น้ำส้มในกล่อง', 3, 'glass', 'แก้ว', vLiq.juice], ['bottle', 'น้ำสะเดาในขวด', 2, 'bowl', 'ถ้วย', vLiq.neem], ['carton', 'น้ำแอปเปิลในกล่อง', 7, 'bottle', 'ขวด', vLiq.apple], ['jar', 'กาแฟในโถ', 4, 'cup', 'ถ้วย', vLiq.coffee]]; // 
const VW_DRY = [['sack', 'น้ำตาลในกระสอบ', 4, 'bottle', 'ขวด', V_DRY.sugar], ['sack', 'ข้าวสารในกระสอบ', 3, 'bowl', 'ถ้วย', V_DRY.rice], ['jar', 'พริกป่นในขวดใหญ่', 5, 'bottle', 'ขวดเล็ก', V_DRY.chili], ['sack', 'เมล็ดกาแฟในกระสอบ', 6, 'scoop', 'ช้อน', V_DRY.coffee]]; // 
const VW_LIT = [['sack', 'ข้าวสารในถุง', 5, V_DRY.rice, 1], ['tank', 'น้ำมันในถัง', 4, vLiq.oil], ['sack', 'น้ำตาลในกระสอบ', 2, V_DRY.sugar, 1], ['jug', 'นมในเหยือก', 3, vLiq.milk]]; // 
const VW_READ = [['bottle', 'น้ำในขวด', 10, vLiq.water], ['jug', 'น้ำส้มในเหยือก', 6, vLiq.juice], ['tank', 'น้ำในถัง', 7, vLiq.water], ['jar', 'น้ำในโอ่ง', 9, vLiq.water]]; // (ภาชนะมีขีดบอกลิตร)
const VW_EST = [['scoop', 'ช้อน', 0], ['jug', 'เหยือกน้ำ', 1], ['milk', 'กล่องนม', 0], ['basin', 'กะละมัง', 1], ['bowl', 'ถ้วยขนม', 0], ['can', 'กระป๋องน้ำอัดลม', 0]]; // 
const VW_CMPW = [[['น้ำมะนาว', '4 ลิตร', 4], ['น้ำองุ่น', '5 ลิตร', 5]], [['ถั่วงอก', '7 ลิตร', 7], ['ถั่วเขียว', '7 ลิตร', 7]], [['เกลือ', '8 ลิตร', 8], ['พริกป่น', '3 ลิตร', 3]], [['น้ำปลาร้า', '10 ลิตร', 10], ['น้ำปลา', '8 ลิตร', 8]], [['น้ำมันพืช', '3 ลิตร', 3], ['น้ำมันหอย', '8 ลิตร', 8]],
  [['ข้าวสาร', '6 ลิตร', 6], ['แป้งข้าวเหนียว', '4 ลิตร', 4]], [['ซอสปรุงรส', '9 ลิตร', 9], ['ซอสหอยนางรม', '20 ลิตร', 20]], [['น้ำตาล', '34 ลิตร', 34], ['พริกไทย', '30 ลิตร', 30]], [['งาดำ', '56 ลิตร', 56], ['เม็ดแมงลัก', '56 ลิตร', 56]]]; // 
const VW_SET10 = [['น้ำมะเขือเทศ', 5, 'jar', vLiq.apple], ['น้ำส้ม', 1, 'bottle', vLiq.juice], ['น้ำชาไทย', 2, 'jug', vLiq.tea]]; // 
const VW_SET11 = [['นม', 1, 'carton', vLiq.milk], ['กาแฟ', 2, 'jar', vLiq.coffee], ['น้ำ', 6, 'basin', vLiq.water], ['เมล็ดผัก', 4, 'sack', V_DRY.seed]]; // 
const VW_SPOON = [['เกลือในขวด', 10, 'ช้อนชา'], ['น้ำตาลในขวด', 12, 'ช้อนชา'], ['พริกป่นในขวด', 11, 'ช้อนโต๊ะ'], ['ผงกาแฟในขวด', 7, 'ช้อนโต๊ะ'], ['น้ำส้มในกล่อง', 4, 'ถ้วยตวง'], ['นมในกล่อง', 3, 'ถ้วยตวง'], ['โค้กในขวด', 6, 'ถ้วยตวง'], ['ชาในขวด', 10, 'ถ้วยตวง']]; // 
const VW_CMPS = [[2, 3, 'ช้อนชา'], [5, 4, 'ช้อนชา'], [6, 6, 'ช้อนชา'], [10, 14, 'ช้อนชา'], [11, 9, 'ช้อนโต๊ะ'], [21, 20, 'ช้อนโต๊ะ'], [13, 13, 'ช้อนโต๊ะ'], [9, 15, 'ถ้วยตวง'], [18, 20, 'ถ้วยตวง'], [34, 31, 'ถ้วยตวง']]; // 
const VW_CAPW = [['น้ำผึ้ง', 6, 'bottle', vLiq.honey], ['คาราเมล', 4, 'bottle', vLiq.syrup], ['ซอสหอยนางรม', 8, 'bottle', vLiq.sauce]]; // 
const VW_CAPQ = [['น้ำมะนาวตวงได้ 2 ลิตรพอดีเต็มขวด ขวดนี้มีความจุกี่ลิตร', 2], ['ตักน้ำใส่โอ่งได้ 5 ลิตรก็เต็มพอดี โอ่งใบนี้จุน้ำได้กี่ลิตร', 5], ['เทถั่วเขียวถุงละ 2 ลิตร ใส่โถ 4 ถุงก็เต็มพอดี โถใบนี้จุได้กี่ลิตร', 8], ['กาน้ำมีน้ำครึ่งกา เทออกมาได้ 5 ลิตร กาใบนี้จุน้ำได้กี่ลิตร', 10], ['ใช้กระบวยตักน้ำครั้งละ 1 ลิตร ตัก 7 ครั้งก็เต็มกะละมังพอดี กะละมังใบนี้จุน้ำได้กี่ลิตร', 7]]; // 
const VW_CAP17 = [['ถังน้ำ', 5, 'tank'], ['แก้วน้ำ', 1, 'glass'], ['โอ่ง', 9, 'jar'], ['กะละมัง', 4, 'basin']]; // (แก้ว = 9 − 8, กะละมัง = 5 − 1)
const VW_ST = [ // 
  vStory('ร้านแรกมีน้ำมะพร้าว 40 ลิตร ร้านที่สองมีมากกว่าร้านแรก 3 ลิตร ร้านที่สองมีน้ำมะพร้าวกี่ลิตร', '40 + 3', 'ลิตร'),
  vStory('ถังมีถั่วลิสงอยู่ 29 ลิตร เทเพิ่มอีก 8 ลิตรก็เต็มถังพอดี ถังใบนี้จุได้กี่ลิตร', '29 + 8', 'ลิตร'),
  vStory('ร้านของนิดมีน้ำเขียว 50 ลิตร ร้านของน้อยมี 25 ลิตร ร้านของนิดมีน้ำเขียวมากกว่ากี่ลิตร', '50 − 25', 'ลิตร'),
  vStory('ร้านมีน้ำมันพืช 88 ลิตร ทำหกไป 40 ลิตร ร้านเหลือน้ำมันพืชกี่ลิตร', '88 − 40', 'ลิตร'),
  vStory('วันนี้ร้านขายน้ำเต้าหู้ได้ 25 ลิตร ขายน้ำมะพร้าวได้ 16 ลิตร ขายรวมกี่ลิตร', '25 + 16', 'ลิตร'),
  vStory('โอ่งจุน้ำได้ 60 ลิตร ตอนนี้มีน้ำ 45 ลิตร ต้องเติมน้ำอีกกี่ลิตรจึงจะเต็มพอดี', '60 − 45', 'ลิตร'),
  vStory('ปี๊บใบที่หนึ่งมีความจุ 54 ลิตร ปี๊บใบที่สองมีความจุน้อยกว่าปี๊บใบที่หนึ่ง 18 ลิตร ปี๊บใบที่สองมีความจุกี่ลิตร', '54 − 18', 'ลิตร'),
  vStory('ยายปรุงแกงใช้น้ำปลา 21 ช้อนโต๊ะ ใช้น้ำตาล 2 ช้อนโต๊ะ ใช้เครื่องปรุงสองอย่างรวมกี่ช้อนโต๊ะ', '21 + 2', 'ช้อนโต๊ะ'),
  vStory('โอ่งมีน้ำ 90 ลิตร ยายตักไปรดผัก 15 ลิตร โอ่งเหลือน้ำกี่ลิตร', '90 − 15', 'ลิตร'),
  vStory('วันจันทร์ร้านขายถั่วเขียวได้ 20 ลิตร วันอังคารขายได้มากกว่าวันจันทร์ 18 ลิตร วันอังคารขายได้กี่ลิตร', '20 + 18', 'ลิตร'),
  vStory('ยายขายงาคั่วไป 39 ช้อนโต๊ะ ยังเหลืองาคั่ว 30 ช้อนโต๊ะ ตอนแรกยายมีงาคั่วกี่ช้อนโต๊ะ', '39 + 30', 'ช้อนโต๊ะ'),
  vStory('แกลลอนน้ำมันของลุงจุ 58 ลิตร ตอนนี้เติมไปแล้ว 57 ลิตร ต้องเติมอีกกี่ลิตรจึงจะเต็ม', '58 − 57', 'ลิตร')];

/* ---------- lessons ---------- */
/* v183 (ผู้ใช้ขอ): ด่าน 1 ต้อง "สอน" การเลือกเครื่องมือตวงก่อนให้ฝึก — หน้าละ 1 เครื่องมือ (หน้าตา → ใช้ตวงอะไร → วิธีใช้/ข้อควรรู้)
   แล้วหน้าสรุปเลือกให้เหมาะ · ภาพเปลี่ยนตามขั้น (picWalk) */
const vTBig = (k, w = 120) => `<span class="lrn-it vtl-t"><svg viewBox="0 0 64 64" width="${w}" height="${w}" aria-hidden="true">${V_TOOL[k][1]}</svg><small>${V_TOOL[k][0]}</small></span>`;
const vTEx = (svg, cap) => lcap(svg, cap);
const vTI = { /* ตัวอย่างสิ่งที่ตวง */
  sugar: () => vTEx(vCont('bowl', .75, { dry: 1, col: V_DRY.sugar }), 'น้ำตาล'), salt: () => vTEx(vCont('bowl', .7, { dry: 1, col: V_DRY.salt }), 'เกลือ'),
  sauce: () => vTEx(vCont('bottle', .7, { col: vLiq.sauce }), 'น้ำปลา'), milk: () => vTEx(vCont('carton', .8, { col: vLiq.milk }), 'นม'),
  flour: () => vTEx(vCont('sack', .8, { dry: 1, col: V_DRY.flour }), 'แป้ง'), water: () => vTEx(vCont('jug', .7, { col: vLiq.water }), 'น้ำ'),
  chem: () => vTEx(vCont('bottle', .5, { col: '#B79CFF' }), 'น้ำยาทดลอง'), med: () => vTEx(vCont('bottle', .6, { col: '#F49AB0' }), 'ยาน้ำ'),
  oil: () => vTEx(vCont('tank', .75, { col: vLiq.oil }), 'น้ำมัน'), glass: () => vTEx(vCont('glass', .6, { col: vLiq.water }), 'แก้ว'),
  bowl: () => vTEx(vCont('bowl', .6, { col: vLiq.water }), 'ขัน'), basin: () => vTEx(vCont('basin', .6, { col: vLiq.water }), 'กะละมัง') };
const vtlRow = (...a) => `<div class="vtl">${lrow(...a)}</div>`; /* ภาพใหญ่ขึ้นในกรอบภาพ */
const vToolTeach = (k, intro, sayIntro, rows, fin) => T(intro, sayIntro, el => el.append(picWalk(rows.map(([lab, txt, ex]) => [lab, txt, vtlRow(vTBig(k), ...(ex || []).map(f => vTI[f]()))]), fin)));
const VT_TOOL_PAGES = [
  vToolTeach('spoon', 'เครื่องมือตวง ① <b>ช้อนตวง</b> — ใช้ตวงของที่ใช้<b>ทีละนิด</b>', 'เครื่องมือตวง ช้อนตวง ใช้ตวงของที่ใช้ทีละนิด', [
    ['หน้าตา', 'ช้อนตวงมาเป็น<b>ชุด</b> หลายขนาด เช่น <b>1 ช้อนโต๊ะ</b> (ใหญ่) และ <b>1 ช้อนชา</b> (เล็ก)'],
    ['ใช้ตวงอะไร', 'ของที่ใส่<b>ทีละนิด</b> ในอาหารและขนม เช่น น้ำตาล เกลือ น้ำปลา', ['sugar', 'salt', 'sauce']],
    ['วิธีตวง', 'ตักให้<b>เต็มช้อน</b> ของแห้งปาดให้เรียบ แล้วนับเป็น "ช้อน" เช่น น้ำตาล 2 ช้อนชา', ['sugar']]], 'ของ<b>น้อย ๆ</b> → <b>ช้อนตวง</b>'),
  vToolTeach('cup', 'เครื่องมือตวง ② <b>ถ้วยตวง</b> — ใช้ตวงของทำอาหาร ขนม ที่ใช้<b>มากกว่าช้อน</b>', 'เครื่องมือตวง ถ้วยตวง ใช้ตวงของทำอาหาร ขนม ที่ใช้มากกว่าช้อน', [
    ['หน้าตา', 'มี<b>หูจับ</b> และมี<b>ขีดบอกปริมาตร</b>อยู่ข้างถ้วย'],
    ['ใช้ตวงอะไร', 'ของที่ใช้ทำอาหารและขนม<b>ทีละหลายช้อน</b> เช่น นม น้ำ แป้ง', ['milk', 'water', 'flour']],
    ['วิธีอ่าน', 'วางถ้วยบนพื้นเรียบ แล้วก้มดูระดับน้ำ<b>ตรงกับขีด</b>', ['water']]], 'ทำอาหาร ทำขนม → <b>ถ้วยตวง</b>'),
  vToolTeach('cyl', 'เครื่องมือตวง ③ <b>กระบอกตวง</b> — ใช้เมื่อต้องการตวง<b>ให้ถูกต้องมาก ๆ</b>', 'เครื่องมือตวง กระบอกตวง ใช้เมื่อต้องการตวงให้ถูกต้องมาก ๆ', [
    ['หน้าตา', 'ทรง<b>สูงและแคบ</b> มีขีดบอกปริมาตร<b>ละเอียด</b>หลายขีด'],
    ['ใช้ตวงอะไร', '<b>ของเหลว</b>ที่ต้องการความถูกต้อง เช่น น้ำยาในการทดลองวิทยาศาสตร์ ยาน้ำ', ['chem', 'med']],
    ['ข้อควรรู้', 'ใช้ตวง<b>ของเหลวเท่านั้น</b> ไม่ใช้ตวงของแห้งอย่างแป้งหรือน้ำตาล', ['chem']]], 'ตวงให้<b>แม่นยำ</b> (ทดลอง) → <b>กระบอกตวง</b>'),
  vToolTeach('oil', 'เครื่องมือตวง ④ <b>ลิตรตวงน้ำมัน</b> — ใช้ตวงน้ำมัน<b>ปริมาณมาก</b>', 'เครื่องมือตวง ลิตรตวงน้ำมัน ใช้ตวงน้ำมันปริมาณมาก', [
    ['หน้าตา', 'ทำด้วย<b>โลหะ</b> มี<b>ปากเท</b>และด้ามจับ'],
    ['ใช้ตวงอะไร', 'ของเหลวปริมาณมาก เช่น น้ำมันเติมเครื่องยนต์ เครื่องตัดหญ้า น้ำมันที่ขายแบ่ง', ['oil']],
    ['หน่วย', 'ตวงแล้วบอกเป็น <b>ลิตร</b> เช่น น้ำมัน 2 ลิตร', ['oil']]], 'น้ำมัน<b>มาก ๆ</b> → <b>ลิตรตวงน้ำมัน</b>'),
  T('ถ้า<b>ไม่มีเครื่องมือตวง</b> ใช้ภาชนะในบ้านตวงแทนได้ — เป็น<b>หน่วยที่ไม่ใช่หน่วยมาตรฐาน</b>', 'ถ้าไม่มีเครื่องมือตวง ใช้ภาชนะในบ้านตวงแทนได้ เป็นหน่วยที่ไม่ใช่หน่วยมาตรฐาน', el => el.append(picWalk([
    ['ใช้แทนได้', 'แก้ว ขัน กะละมัง ถัง — เทให้เต็มแล้ว<b>นับ</b> เช่น น้ำ 5 แก้ว', vtlRow(vTI.glass(), vTI.bowl(), vTI.basin())],
    ['ข้อควรรู้', 'แก้ว ขัน ของแต่ละบ้าน<b>ขนาดไม่เท่ากัน</b> ตวงน้ำเท่ากันอาจนับได้ไม่เท่ากัน → ต้อง<b>บอกชื่อภาชนะ</b>ที่ใช้ตวงเสมอ', vtlRow(lcap(vCont('glass', .6, { col: vLiq.water }), 'แก้วบ้านต้น'), lcap(vCont('jug', .6, { col: vLiq.water }), 'แก้วบ้านฝน (ใบใหญ่)'))]],
    'เครื่องมือตวง (ช้อนตวง ถ้วยตวง กระบอกตวง ลิตร) ได้ผล<b>เท่ากันทุกที่</b>'))),
  T('สรุป: <b>เลือกเครื่องมือให้เหมาะ</b> กับสิ่งที่จะตวง', 'สรุป เลือกเครื่องมือให้เหมาะกับสิ่งที่จะตวง', el => el.append(picWalk([
    ['ของน้อย ๆ', 'น้ำตาล เกลือ น้ำปลา → <b>ช้อนตวง</b>', vtlRow(vTI.sugar(), vTI.salt(), vTBig('spoon', 96))],
    ['ทำอาหาร ขนม', 'นม น้ำ แป้ง → <b>ถ้วยตวง</b>', vtlRow(vTI.milk(), vTI.flour(), vTBig('cup', 96))],
    ['ต้องแม่นยำ', 'น้ำยาทดลอง ยาน้ำ → <b>กระบอกตวง</b>', vtlRow(vTI.chem(), vTI.med(), vTBig('cyl', 96))],
    ['ปริมาณมาก', 'น้ำมันเติมเครื่อง → <b>ลิตรตวงน้ำมัน</b>', vtlRow(vTI.oil(), vTBig('oil', 96))]], 'ดูว่า<b>ตวงอะไร</b> และ<b>มากหรือน้อย</b> แล้วเลือกเครื่องมือ')))];
const L2V = (no, place, title, short, goal, teach, game) => ({ id: 980 + no, place, title, short, tone: TONES5[(no + 3) % 6], goal, teach, game });
const VCW = ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'];
const vCard = ([n, v, k, c], unit = 'ลิตร') => `<div class="p2card vcard">${vCont(k, .75, { col: c })}<b>${n}</b><span>${v} ${unit}</span></div>`;
const LESSONS_P2C8 = [
  L2V(1, 'หาดเทแก้ว', 'การวัดและเปรียบเทียบปริมาตรของของเหลวโดยใช้หน่วยที่ไม่ใช่หน่วยมาตรฐาน', 'ของเหลว · หน่วยไม่มาตรฐาน', 'ตวงและเปรียบเทียบปริมาตรของของเหลวโดยใช้แก้ว ถ้วย ขวด เป็นหน่วย และรู้จักเครื่องมือตวง',
    [T('ยินดีต้อนรับสู่ <b>ชายหาดตวงน้ำ</b>! ขวดสูงกับกะละมังกว้าง ใบไหนมีน้ำ<b>มากกว่า</b>? ทายก่อน แล้วตวงพิสูจน์', 'ยินดีต้อนรับสู่ชายหาดตวงน้ำ ขวดสูงกับกะละมังกว้าง ใบไหนมีน้ำมากกว่า ทายก่อน แล้วตวงพิสูจน์', el => el.append(simWhy({ cup: 'glass', cupName: 'แก้ว', items: [{ kind: 'bottle', name: 'ขวดสูง', lvl: .92, n: 4, col: '#CBE8E0' }, { kind: 'basin', name: 'กะละมัง', lvl: .8, n: 6, col: '#CBE8E0' }] }))),
     T('ตวงน้ำมะพร้าวเหยือกเดียวกัน ด้วย<b>ภาชนะต่างขนาด</b> — จำนวนที่นับได้เท่ากันไหม?', 'ตวงน้ำมะพร้าวเหยือกเดียวกัน ด้วยภาชนะต่างขนาด จำนวนที่นับได้เท่ากันไหม', el => el.append(simPour(VT_POUR))),
     ...VT_TOOL_PAGES, /* v183: สอนเลือกเครื่องมือตวงทีละชนิดก่อนลองจับคู่ */
     T('ลองทำเอง: <b>จับคู่</b>ของที่จะตวงกับเครื่องมือ', 'เครื่องมือตวง จับคู่ของที่จะตวงกับเครื่องมือ', el => el.append(qSim(Q.ixMatch({ q: 'จับคู่ของที่จะตวงกับเครื่องมือ', pairs: [['ตวงน้ำตาลใส่ขนม 1 ช้อน', vToolLab('spoon')], ['ตวงน้ำ 1 ถ้วยทำแกง', vToolLab('cup')], ['ตวงน้ำยาทดลองเล็กน้อย', vToolLab('cyl')], ['ตวงน้ำมันเติมเครื่องตัดหญ้า', vToolLab('oil')]] }), 'จับคู่ครบแล้ว!'))),
     T('ตัวอย่างทีละขั้น: ตวงด้วยแก้ว', 'ตัวอย่างทีละขั้น', p4ex([['① ตวง', 'เทน้ำมะพร้าวจากเหยือกใส่แก้วจนเต็มทีละใบ'], ['② นับ', 'ได้ 8 แก้ว'], ['③ สรุป', 'น้ำมะพร้าวมีปริมาตร 8 แก้ว'], ['④ ถ้าใช้เหยือกเล็ก', 'ได้ 4 เหยือกเล็ก — ภาชนะใหญ่กว่า นับได้น้อยกว่า']], 'ปริมาตร = <b>จำนวนภาชนะที่ตวงได้</b>', '', () => h('div', { class: 'vwrap', html: vPourFig('jug', 8, 'glass', { srcName: 'น้ำมะพร้าว', col: '#CBE8E0' }) })))],
    () => [Q.ixMatch({ q: 'จับคู่สิ่งที่จะตวงกับเครื่องมือที่เหมาะสม', pairs: VW_TOOL.map(([t, k]) => [t, vToolLab(k)]) }), ...pkF([...VW_POUR, ['jug', 'นมในเหยือก', 5, 'glass', 'แก้ว', vLiq.milk]], 5).map(([src, srcName, n, cup, cupName, col]) => Q.vPour({ src, srcName, n, cup, cupName, col })), /* v134: ≥ 8 ข้อ */
      Q.p4Pick({ fig: vPourFig('jar', 4, 'cup', { srcName: 'กาแฟ', col: vLiq.coffee }) + vPourFig('bottle', 2, 'cup', { srcName: 'นมสด', col: vLiq.milk }), q: 'ของเหลวใดมีปริมาตรน้อยกว่า (ตวงด้วยถ้วยขนาดเดียวกัน)', opts: ['นมสด', 'กาแฟ'], right: 'นมสด', hint: 'ตวงได้น้อยถ้วยกว่า → ปริมาตรน้อยกว่า' }),
      Q.p4Pick({ q: 'ตวงน้ำในขวดเดียวกันด้วยแก้วใบเล็กและแก้วใบใหญ่ ใช้แก้วใบใดตวงแล้วได้<span class="hl">จำนวนแก้วมากกว่า</span>', opts: ['แก้วใบเล็ก', 'แก้วใบใหญ่', 'ได้เท่ากัน'], right: 'แก้วใบเล็ก', hint: 'แก้วเล็กจุได้น้อย จึงต้องตวงหลายครั้งกว่า' }),
      Q.p4Pick({ fig: vPourFig('carton', 3, 'glass', { srcName: 'น้ำส้ม', col: vLiq.juice }) + vPourFig('bottle', 2, 'glass', { srcName: 'น้ำสะเดา', col: vLiq.neem }), q: 'ของเหลวใดมีปริมาตรมากกว่า (ตวงด้วยแก้วขนาดเดียวกัน)', opts: ['น้ำส้ม', 'น้ำสะเดา'], right: 'น้ำส้ม', hint: 'ตวงด้วยแก้วขนาดเดียวกัน ตวงได้กี่แก้ว — ได้มากกว่าคือปริมาตรมากกว่า' })]),
  L2V(2, 'หาดตักทราย', 'การวัดและเปรียบเทียบปริมาตรของของแห้งโดยใช้หน่วยที่ไม่ใช่หน่วยมาตรฐาน', 'ของแห้ง · หน่วยไม่มาตรฐาน', 'ตวงและเปรียบเทียบปริมาตรของของแห้งโดยใช้ช้อน ถ้วย ขวด เป็นหน่วย (ตวงแล้วปาดให้เรียบ)',
    [T('<b>ของแห้ง</b> เช่น ทราย ข้าวสาร ก็มีปริมาตร — ตักแล้วของ<b>พูน</b> ต้อง<b>ปาดให้เรียบ</b>ก่อน ทุกครั้งจึงเท่ากัน', 'ของแห้ง เช่น ทราย ข้าวสาร ก็มีปริมาตร ตักแล้วของพูน ต้องปาดให้เรียบก่อน ทุกครั้งจึงเท่ากัน', el => el.append(simPour({ ...VT_DRY, level: 1, cap: 'เลือกที่ตวง กด “ตัก 1 ครั้ง” แล้ว “ปาดให้เรียบ” จนทรายหมดถุง' }))),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['① ตัก', 'ตักทรายด้วยที่ตักจนเต็ม'], ['② ปาด', 'ปาดส่วนที่พูนออกให้เรียบเสมอขอบ'], ['③ นับ', 'ตักได้ 6 ครั้ง → ทรายมีปริมาตร 6 ที่ตัก'], ['④ เปรียบเทียบ', 'ถ้าใช้ชามตัก ได้ 3 ชาม']], 'ทรายในถุงมีปริมาตร <b>6 ที่ตัก</b> หรือ <b>3 ชาม</b>'))],
    () => [...pkF([...VW_DRY, ['sack', 'แป้งในกระสอบ', 5, 'bowl', 'ถ้วย', V_DRY.flour], ['jar', 'ถั่วแดงในโถ', 3, 'scoop', 'ช้อน', V_DRY.bean]], 6).map(([src, srcName, n, cup, cupName, col]) => Q.vPour({ src, srcName, n, cup, cupName, col, dry: 1 })), /* v134: ≥ 8 ข้อ */
      Q.p4Pick({ q: 'ตวงข้าวสารด้วยถ้วย ถ้าตักพูนบ้าง ไม่เต็มบ้าง ผลการตวงจะเป็นอย่างไร', opts: ['ไม่แม่นยำ เพราะแต่ละถ้วยได้ไม่เท่ากัน', 'แม่นยำกว่าการปาดให้เรียบ', 'ได้ผลเหมือนกันทุกครั้ง'], right: 'ไม่แม่นยำ เพราะแต่ละถ้วยได้ไม่เท่ากัน', hint: 'ตวงของแห้งต้องเต็มพอดีแล้วปาดให้เรียบทุกครั้ง' }),
      Q.p4Pick({ q: 'ตวงน้ำตาลด้วยช้อน ต้องทำอย่างไรจึงจะถูกต้อง', opts: ['ตักให้เต็มแล้วปาดให้เรียบ', 'ตักให้พูนมากที่สุด', 'ตักครึ่งช้อนก็ได้'], right: 'ตักให้เต็มแล้วปาดให้เรียบ', hint: 'ตวงของแห้งต้องเต็มพอดี เท่ากันทุกครั้ง' }),
      Q.p4Pick({ fig: vPourFig('sack', 4, 'bottle', { srcName: 'น้ำตาล', col: V_DRY.sugar, dry: 1 }) + vPourFig('sack', 6, 'bottle', { srcName: 'ข้าวสาร', col: V_DRY.rice, dry: 1 }), q: 'สิ่งใดมีปริมาตรน้อยกว่า (ตวงด้วยขวดขนาดเดียวกัน)', opts: ['น้ำตาล', 'ข้าวสาร'], right: 'น้ำตาล', hint: 'นับขวดที่ตวงได้ของแต่ละอย่าง' })]),
  L2V(3, 'หาดลิตร', 'การวัดปริมาตรเป็นลิตร', 'ปริมาตรเป็นลิตร', 'ตวงและบอกปริมาตรเป็นลิตร',
    [T('พี่กับน้องตวงน้ำส้มเหยือกเดียวกัน แต่ใช้<b>แก้วคนละใบ</b> — ได้ตัวเลขเท่ากันไหม?', 'พี่กับน้องตวงน้ำส้มเหยือกเดียวกัน แต่ใช้แก้วคนละใบ ได้ตัวเลขเท่ากันไหม', el => el.append(simPour({ src: 'jug', srcName: 'น้ำส้มในเหยือก', col: vLiq.juice, total: 8, cap: 'เลือกแก้วของพี่หรือของน้อง แล้วกด “เท 1 ครั้ง” จนหมด', cups: [{ kind: 'glass', size: 2, name: 'แก้วของพี่', big: 1 }, { kind: 'glass', size: 1, name: 'แก้วของน้อง' }], done: r => `น้ำเท่ากัน แต่ได้ ${r[0]} กับ ${r[1]} — ถ้าใช้แก้วคนละใบ ตัวเลขไม่ตรงกัน จึงต้องใช้<b>หน่วยมาตรฐาน</b>ที่ทุกคนใช้เหมือนกัน คือ <b>ลิตร</b>` }))),
     T('<b>เหยือก 1 ลิตร</b> ทุกใบใส่น้ำได้เท่ากัน — เทใส่ถังทีละลิตร ถังมีขีดบอกจำนวนลิตร', 'เหยือกหนึ่งลิตรทุกใบใส่น้ำได้เท่ากัน เทใส่ถังทีละลิตร ถังมีขีดบอกจำนวนลิตร', el => el.append(simLiter({ kind: 'tank', cap: 6, name: 'ถัง', col: vLiq.water, full: v => `เทได้ ${v} เหยือก → น้ำในถังมีปริมาตร <b>${v} ลิตร</b> · ใครตวงด้วยเหยือก 1 ลิตรก็ได้ ${v} ลิตรเท่ากัน` }))),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['① ตวง', 'เทน้ำแตงโมจากโถใส่เหยือก 1 ลิตร'], ['② นับ', 'เทได้ 5 เหยือกพอดี'], ['③ สรุป', 'น้ำแตงโมมีปริมาตร 5 ลิตร']], 'ปริมาตรน้ำแตงโม <b>5 ลิตร</b>', '', () => h('div', { class: 'vwrap', html: vPourFig('jar', 5, 'jug', { srcName: 'น้ำแตงโม', col: '#FF7B86' }) })))],
    () => [...pkF(VW_LIT, 2).map(([src, srcName, n, col, dry]) => Q.vPour({ src, srcName, n, cup: 'jug', cupName: 'ลิตร', col, dry })), ...pkF(VW_READ, 2).map(([kind, name, v, col]) => Q.vRead({ kind, cap: v > 7 ? 10 : 8, v, name, col })),
      Q.vFill({ kind: 'tank', cap: 10, target: rnd(4, 9), name: 'ถัง', col: vLiq.water })]),
  L2V(4, 'หาดกะปริมาตร', 'การคาดคะเนปริมาตรเป็นลิตร', 'คาดคะเนเป็นลิตร', 'คาดคะเนปริมาตรว่ามากกว่าหรือน้อยกว่า 1 ลิตร โดยเทียบกับขวด 1 ลิตร',
    [T('<b>1 ลิตร</b> มากแค่ไหน? เทน้ำจาก<b>ขวด 1 ลิตร</b>ลงภาชนะต่าง ๆ — ล้น หรือ ไม่เต็ม?', 'หนึ่งลิตรมากแค่ไหน เทน้ำจากขวดหนึ่งลิตรลงภาชนะต่าง ๆ ล้น หรือ ไม่เต็ม', el => el.append(simEst1L([{ kind: 'glass', name: 'แก้วน้ำ', cap: .3 }, { kind: 'tank', name: 'ถังน้ำ', cap: 8 }, { kind: 'cup', name: 'ถ้วยเล็ก', cap: .2 }, { kind: 'jar', name: 'โอ่ง', cap: 30 }]))),
     T('คาดคะเนโดย<b>ไม่ต้องเท</b> — นึกถึงขวด 1 ลิตร แล้วแตะของ แตะกล่อง', 'คาดคะเนโดยไม่ต้องเท นึกถึงขวดหนึ่งลิตร แล้วแตะของ แตะกล่อง', el => { el.append(h('div', { class: 'vref', html: `${vCont('bottle', .9, { label: '1 ลิตร' })}<b>ขวดน้ำ 1 ลิตร</b>` })); el.append(qSim(vEstQ(VT_EST), 'คาดคะเนได้ดีมาก')); }),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['① นึกถึงขวด 1 ลิตร', 'ขวดน้ำดื่มขนาดใหญ่ 1 ลิตร'], ['② เทียบ', 'ถังน้ำใส่น้ำได้หลายขวด → มากกว่า 1 ลิตร'], ['③ เทียบ', 'แก้วกาแฟใส่ได้ไม่ถึงขวด → น้อยกว่า 1 ลิตร'], ['④ ตรวจ', 'ตวงจริงด้วยเหยือก 1 ลิตร']], 'คาดคะเน แล้ว<b>ตวงจริง</b>เพื่อตรวจ'))],
    () => [vEstQ(shuffle(VW_EST).slice(0, 4)), ...pkF(VW_EST, 3).map(([a, n, more]) => Q.p4Pick({ fig: `<div class="g2big">${V_EST_ART(a)}</div>`, q: `${n}ใส่น้ำได้มากกว่าหรือน้อยกว่า 1 ลิตร`, opts: ['มากกว่า 1 ลิตร', 'น้อยกว่า 1 ลิตร'], right: more ? 'มากกว่า 1 ลิตร' : 'น้อยกว่า 1 ลิตร', hint: 'เทียบกับขวดน้ำดื่ม 1 ลิตร' })),
      Q.p4Pick({ q: 'สิ่งใดน่าจะมีความจุ<b>มากกว่า</b> 1 ลิตร', opts: ['ถังน้ำ', 'ช้อน', 'แก้วน้ำ'], right: 'ถังน้ำ', hint: 'ถังน้ำใส่น้ำได้หลายขวด' })]),
  L2V(5, 'หาดเทียบลิตร', 'การเปรียบเทียบปริมาตรเป็นลิตร', 'เปรียบเทียบลิตร', 'เปรียบเทียบปริมาตรเป็นลิตร ใช้คำว่า มากกว่า น้อยกว่า เท่ากับ และหาผลต่าง',
    [T('ถังขนาดเท่ากัน มีขีดบอก<b>ลิตร</b> — แตะ 2 ถัง ดูว่าน้ำใน<b>ถังไหนมากกว่า และมากกว่ากี่ลิตร</b>', 'ถังขนาดเท่ากัน มีขีดบอกลิตร แตะสองถัง ดูว่าน้ำในถังไหนมากกว่า และมากกว่ากี่ลิตร', el => el.append(h('div', { class: 'colstack' }, h6wait(), simCmpTanks([['น้ำมะพร้าว', 7, '#CBE8E0'], ['น้ำแตงโม', 3, '#FF7B86'], ['น้ำมะนาว', 5, '#D8F27A']], 8)))),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['① อ่านปริมาตร', 'น้ำมะพร้าว 7 ลิตร · น้ำแตงโม 3 ลิตร'], ['② เปรียบเทียบ', '7 > 3 → น้ำมะพร้าวมากกว่า'], ['③ ผลต่าง', '7 − 3 = 4 ลิตร']], 'น้ำมะพร้าวมากกว่าน้ำแตงโม <b>4 ลิตร</b>'))],
    () => { const S = VW_SET11; return [...pkF(VW_CMPW, 3).map(([a, b]) => Q.p2cmpWord({ a, b, words: VCW, hint: 'ดูตัวเลขของทั้งสองอย่าง (หน่วยเดียวกัน) แล้วเปรียบเทียบ' })),
      Q.p4Pick({ fig: `<div class="p2cards">${VW_SET10.map(x => vCard(x)).join('')}</div>`, q: 'ชนิดน้ำใดมีปริมาตร<span class="hl">มากที่สุด</span>', opts: VW_SET10.map(x => x[0]), right: 'น้ำมะเขือเทศ', hint: 'ดูจำนวนลิตรของแต่ละอย่าง' }),
      vNum({ fig: `<div class="p2cards">${S.map(x => vCard(x)).join('')}</div>`, q: 'น้ำมีปริมาตรมากกว่ากาแฟอยู่กี่ลิตร', a: 4, unit: 'ลิตร', hint: 'น้ำ 6 ลิตร กาแฟ 2 ลิตร → 6 − 2' }),
      Q.ixSort({ q: 'เรียงปริมาตรจาก<span class="hl">มากไปน้อย</span>', fig: `<div class="p2cards">${S.map(x => vCard(x)).join('')}</div>`, items: S.map(x => ({ label: x[0], v: x[1] })), dir: 'desc', slotLabels: ['มากที่สุด', '', '', 'น้อยที่สุด'] })]; }),
  L2V(6, 'หาดช้อนตวง', 'การวัดและเปรียบเทียบปริมาตรเป็นช้อนชา ช้อนโต๊ะ ถ้วยตวง', 'ช้อนชา ช้อนโต๊ะ ถ้วยตวง', 'ตวงและเปรียบเทียบปริมาตรเป็นช้อนชา ช้อนโต๊ะ และถ้วยตวง',
    [T('<b>ช้อนโต๊ะ</b> ใหญ่กว่า<b>ช้อนชา</b>แค่ไหน? เทน้ำเชื่อมทีละช้อนชาลงในช้อนโต๊ะจนเต็ม', 'ช้อนโต๊ะ ใหญ่กว่าช้อนชาแค่ไหน เทน้ำเชื่อมทีละช้อนชาลงในช้อนโต๊ะจนเต็ม', el => el.append(simLiter({ kind: 'scoop', cap: 3, name: 'ช้อนโต๊ะ', col: vLiq.honey, unit: 'ช้อนชา', srcKind: 'scoop', srcLabel: '', srcName: 'ช้อนชา', add: 'เท 1 ช้อนชา', sub: 'เทออก 1 ช้อนชา', now: 'ในช้อนโต๊ะมี', full: v => `เต็มแล้ว! <b>${v} ช้อนชา = 1 ช้อนโต๊ะ</b> · ของน้อย ๆ ใช้ช้อนชา ช้อนโต๊ะ · ของมากขึ้นใช้<b>ถ้วยตวง</b>` }))),
     T('ช้อนชา < ช้อนโต๊ะ < ถ้วยตวง — เลือกเครื่องตวง แล้ว<b>ตักน้ำตาลจนหมดโถ</b>', 'ช้อนชา เล็กกว่า ช้อนโต๊ะ เล็กกว่า ถ้วยตวง เลือกเครื่องตวง แล้วตักน้ำตาลจนหมดโถ', el => el.append(simPour({ src: 'jar', srcName: 'น้ำตาลในโถ', col: V_DRY.sugar, dry: 1, level: 1, total: 12, cap: 'เลือกเครื่องตวง กด “ตัก 1 ครั้ง” แล้ว “ปาดให้เรียบ” จนหมดโถ', cups: [{ kind: 'scoop', size: 1, name: 'ช้อนชา' }, { kind: 'scoop', size: 3, name: 'ช้อนโต๊ะ', big: 1 }, { kind: 'cup', size: 12, name: 'ถ้วยตวง', big: 1 }], done: r => `น้ำตาลเท่าเดิม = ${r.join(' = ')} · เครื่องตวง<b>ใหญ่กว่า</b> ตวงได้จำนวน<b>น้อยกว่า</b>` }))),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['① ตวงด้วยช้อนชา', 'ได้ 12 ช้อนชา'], ['② ตวงด้วยช้อนโต๊ะ', 'ได้ 4 ช้อนโต๊ะ'], ['③ ตวงด้วยถ้วยตวง', 'ได้ 1 ถ้วยตวง'], ['④ สรุป', 'เครื่องตวงใหญ่กว่า → ตวงได้จำนวนน้อยกว่า']], 'น้ำตาลในโถ = 12 ช้อนชา = 4 ช้อนโต๊ะ = <b>1 ถ้วยตวง</b>'))],
    () => [...pkF(VW_SPOON, 3).map(([n, v, u]) => Q.p4Num({ q: `ตวง${n}ได้ ${v} ${u} ดังนั้น${n.replace(/ใน.*/, '')}มีปริมาตรกี่${u}`, a: v, unit: u, hint: 'ตวงได้เท่าไร ปริมาตรก็เท่านั้น' })),
      ...pkF(VW_CMPS, 3).map(([a, b, u]) => Q.p2cmpWord({ a: ['ปริมาตรแรก', `${a} ${u}`, a], b: ['ปริมาตรที่สอง', `${b} ${u}`, b], words: VCW, hint: 'ดูตัวเลขของทั้งสองอย่าง (หน่วยเดียวกัน) แล้วเปรียบเทียบ' })),
      Q.ixSort({ q: 'เรียงเครื่องตวงจาก<span class="hl">เล็กไปใหญ่</span>', items: [{ label: 'ช้อนชา', v: 1 }, { label: 'ช้อนโต๊ะ', v: 3 }, { label: 'ถ้วยตวง', v: 16 }], dir: 'asc', slotLabels: ['เล็กที่สุด', '', 'ใหญ่ที่สุด'] })]),
  L2V(7, 'หาดความจุ', 'ความจุของภาชนะเป็นลิตร', 'ความจุ', 'บอกความจุของภาชนะเป็นลิตร และบอกความแตกต่างระหว่างปริมาตรกับความจุ',
    [T('เทน้ำทีละลิตรจน<b>เต็ม</b> — ระหว่างเท ตัวเลขคือ<b>ปริมาตร</b> · ตอนเต็ม คือ<b>ความจุ</b>', 'เทน้ำทีละลิตรจนเต็ม ระหว่างเท ตัวเลขคือปริมาตร ตอนเต็ม คือความจุ', el => el.append(simLiter({ kind: 'jar', cap: 8, name: 'โอ่ง', col: vLiq.water }))),
     T('ตรวจความเข้าใจ: โอ่ง 3 ใบ<b>เหมือนกันทุกอย่าง</b> แต่มีน้ำไม่เท่ากัน', 'ตรวจความเข้าใจ โอ่งสามใบเหมือนกันทุกอย่าง แต่มีน้ำไม่เท่ากัน', el => el.append(qSim(Q.p4Pick({ fig: `<div class="p2cards">${[.3, .6, 1].map((l, i) => `<div class="p2card vcard">${vCont('jar', l, { col: vLiq.water })}<b>ใบที่ ${i + 1}</b></div>`).join('')}</div>`, q: 'โอ่งใบใดมี<b>ความจุ</b>มากที่สุด', opts: ['ใบที่ 1', 'ใบที่ 3', 'เท่ากันทุกใบ'], right: 'เท่ากันทุกใบ', keep: 1, hint: 'น้ำในโอ่ง = ปริมาตร (ต่างกันได้) · ความจุ = ใส่ได้มากที่สุดเมื่อเต็ม — โอ่งเหมือนกันจึงจุเท่ากัน' }), 'ถูกต้อง! ปริมาตรน้ำต่างกัน แต่โอ่งเหมือนกันจึงมีความจุเท่ากัน'))),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['① ถังมีน้ำอยู่ครึ่งถัง', 'เทออกได้ 3 ลิตร → น้ำมีปริมาตร 3 ลิตร'], ['② เต็มถัง', 'ครึ่งถัง 3 ลิตร สองครึ่งเป็น 3 + 3 = 6 ลิตร'], ['③ สรุป', 'ถังนี้มีความจุ 6 ลิตร']], '<b>ปริมาตร</b> = ของที่อยู่ข้างใน · <b>ความจุ</b> = ใส่ได้มากที่สุด'))],
    () => { const C = pick(VW_CAPW); return [Q.vWord({ text: `${C[0]}เต็มขวด ตวงได้ ${C[1]} ลิตร ขวดนี้มี___ ${C[1]} ลิตร`, right: 'ความจุ', fig: vCont(C[2], .95, { col: C[3] }) }), Q.vWord({ text: `${C[0]}มี___ ${C[1]} ลิตร`, right: 'ปริมาตร', fig: vCont(C[2], .95, { col: C[3] }) }),
      ...pkF(VW_CAPQ, 3).map(([q, a]) => Q.p4Num({ q, a, unit: 'ลิตร', hint: 'ความจุ = ปริมาตรเมื่อเต็มภาชนะพอดี' })), Q.vFill({ kind: 'jar', cap: 9, target: 9, name: 'โอ่ง (เติมให้เต็มเพื่อหาความจุ)', col: vLiq.water })]; }),
  L2V(8, 'หาดเทียบความจุ', 'การเปรียบเทียบความจุของภาชนะ', 'เปรียบเทียบความจุ', 'เปรียบเทียบความจุของภาชนะ และหาผลต่างของความจุ',
    [T('ไม่มีตัวเลขบอก จะรู้ได้อย่างไรว่าภาชนะไหน<b>จุมากกว่า</b>? เทน้ำเต็มใบหนึ่งลงอีกใบ', 'ไม่มีตัวเลขบอก จะรู้ได้อย่างไรว่าภาชนะไหนจุมากกว่า เทน้ำเต็มใบหนึ่งลงอีกใบ', el => el.append(simPourCmp([[{ kind: 'jug', name: 'เหยือก', cap: 2 }, { kind: 'basin', name: 'กะละมัง', cap: 6 }], [{ kind: 'tank', name: 'ถังใหญ่', cap: 12 }, { kind: 'basin', name: 'กะละมัง', cap: 6 }]]))),
     T('รู้ความจุเป็นลิตรแล้ว — แตะเรียงภาชนะจาก<b>ความจุมากไปน้อย</b>', 'รู้ความจุเป็นลิตรแล้ว แตะเรียงภาชนะจากความจุมากไปน้อย', el => el.append(qSim(Q.ixSort({ q: 'เรียงจากความจุมากไปน้อย', fig: `<div class="p2cards">${[['ถังใหญ่', 12, 'tank', vLiq.water], ['เหยือก', 2, 'jug', vLiq.water], ['กะละมัง', 6, 'basin', vLiq.water]].map(x => vCard(x)).join('')}</div>`, items: [{ label: 'ถังใหญ่', v: 12 }, { label: 'เหยือก', v: 2 }, { label: 'กะละมัง', v: 6 }], dir: 'desc', slotLabels: ['มากที่สุด', '', 'น้อยที่สุด'] }), 'ถังใหญ่จุมากที่สุด เหมือนที่เทแล้วล้น'))),
     T('ตัวอย่างทีละขั้น: หาความจุจากเงื่อนไข', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'ถังจุ 12 ลิตร กะละมังจุน้อยกว่าถัง 6 ลิตร'], ['① ความจุกะละมัง', '12 − 6 = 6 ลิตร'], ['② เปรียบเทียบ', 'ถังจุมากกว่ากะละมัง 6 ลิตร']], 'กะละมังมีความจุ <b>6 ลิตร</b>'))],
    () => { const S = VW_CAP17, F = `<div class="p2cards">${S.map(x => vCard([x[0], x[1], x[2], vLiq.water])).join('')}</div>`; return [
      vNum({ fig: `<div class="p2cards">${vCard(['โอ่ง', 9, 'jar', vLiq.water])}<div class="p2card vcard">${vCont('glass', .7)}<b>แก้วน้ำ</b><span>? ลิตร</span></div></div>`, q: 'แก้วน้ำมีความจุน้อยกว่าโอ่ง 8 ลิตร แก้วน้ำมีความจุกี่ลิตร', a: 1, unit: 'ลิตร', hint: '9 − 8' }),
      vNum({ fig: `<div class="p2cards">${vCard(['ถังน้ำ', 5, 'tank', vLiq.water])}<div class="p2card vcard">${vCont('basin', .7)}<b>กะละมัง</b><span>? ลิตร</span></div></div>`, q: 'ถังน้ำมีความจุมากกว่ากะละมัง 1 ลิตร กะละมังมีความจุกี่ลิตร', a: 4, unit: 'ลิตร', hint: 'ถังน้ำจุมากกว่า → กะละมัง = 5 − 1' }),
      Q.p4Pick({ fig: F, q: 'ภาชนะใดมีความจุ<span class="hl">มากที่สุด</span>', opts: S.map(x => x[0]), right: 'โอ่ง', hint: 'ดูจำนวนลิตร' }),
      Q.p2cmpWord({ a: ['แก้วน้ำ', '1 ลิตร', 1], b: ['กะละมัง', '4 ลิตร', 4], words: VCW, pre: 'ความจุของ', hint: 'ดูตัวเลขของทั้งสองอย่าง (หน่วยเดียวกัน) แล้วเปรียบเทียบ' }),
      vNum({ fig: F, q: 'โอ่งมีความจุมากกว่าแก้วน้ำอยู่กี่ลิตร', a: 8, unit: 'ลิตร', hint: '9 − 1' }),
      vNum({ fig: F, q: 'โอ่งมีความจุมากกว่าถังน้ำอยู่กี่ลิตร', a: 4, unit: 'ลิตร', hint: '9 − 5' }), vNum({ fig: F, q: 'ถังน้ำและกะละมังมีความจุรวมกันกี่ลิตร', a: 9, unit: 'ลิตร', hint: '5 + 4' }), /* v134: ≥ 8 ข้อ */
      Q.p4Pick({ fig: F, q: 'ภาชนะใดมีความจุ<span class="hl">น้อยที่สุด</span>', opts: S.map(x => x[0]), right: 'แก้วน้ำ', hint: 'ดูจำนวนลิตร' }), Q.ixSort({ q: 'เรียงความจุจาก<span class="hl">น้อยไปมาก</span>', fig: F, items: S.map(x => ({ label: x[0], v: x[1] })), dir: 'asc', slotLabels: ['น้อยที่สุด', '', '', 'มากที่สุด'] })]; }),
  L2V(9, 'หาดโจทย์ตวง', 'โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ', 'โจทย์ปัญหา', 'วิเคราะห์โจทย์ปัญหาการบวกและการลบเกี่ยวกับปริมาตรและความจุ เขียนประโยคสัญลักษณ์และหาคำตอบ',
    [T('ก่อนคิดเลข ต้อง<b>เข้าใจเรื่อง</b>: ปริมาตร<b>รวมกัน/เพิ่มขึ้น</b> → บวก · <b>เหลือ/ต่างกัน/ขาดอีก</b> → ลบ', 'ก่อนคิดเลข ต้องเข้าใจเรื่อง ปริมาตรรวมกันหรือเพิ่มขึ้น บวก เหลือ ต่างกัน หรือขาดอีก ลบ', el => el.append(qSim(Q.ixGroup({ q: 'แตะเรื่อง แล้วแตะกล่อง บวก หรือ ลบ', bins: ['บวก', 'ลบ'], items: [{ label: 'มีน้ำ 20 ลิตร เติมอีก 5 ลิตร', bin: 0, why: 'เติม = เพิ่มขึ้น → บวก' }, { label: 'มีนม 30 ลิตร ขายไป 12 ลิตร', bin: 1, why: 'ขายไป → เหลือ → ลบ' }, { label: 'ถังจุ 50 ลิตร มีน้ำ 35 ลิตร ขาดอีกเท่าไร', bin: 1, why: 'ขาดอีก = ความจุ − ที่มี → ลบ' }, { label: 'ขวด 7 ลิตร กับ 9 ลิตร รวมกัน', bin: 0, why: 'รวมกัน → บวก' }], hint: 'อ่านว่าปริมาตรเพิ่มขึ้นหรือลดลง' }), 'แยกได้ถูกต้อง! ต่อไปใช้แผนภาพช่วยคิด'))),
     T('อ่านโจทย์ ดูแผนภาพ แล้ว<b>เลือกประโยคสัญลักษณ์</b>', 'อ่านโจทย์ ดูแผนภาพ แล้วเลือกประโยคสัญลักษณ์', p4story('ร้านน้ำมะพร้าวมีน้ำมะพร้าว <b>45</b> ลิตร ขายไป <b>28</b> ลิตร เหลือน้ำมะพร้าวกี่ลิตร', p4pwSVG({ w: 45, p1: 28, p2: 17, unk: '2', lw: 'มีทั้งหมด', l1: 'ขายไป', l2: 'เหลือ' }),
       [{ q: 'โจทย์ถามน้ำมะพร้าวที่เหลือ เลือกประโยคสัญลักษณ์', opts: ['45 − 28', '45 + 28'], right: '45 − 28', lab: 'เหลือ', unit: 'ลิตร', why: 'ขายไป → เหลือ → ลบ' }], 'ตอบ <b>17 ลิตร</b>')),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'โอ่งจุ 60 ลิตร มีน้ำอยู่ 35 ลิตร ต้องเติมอีกกี่ลิตรจึงจะเต็ม'], ['① ถามอะไร', 'น้ำที่ต้องเติม (ส่วนที่ขาด)'], ['② ประโยคสัญลักษณ์', '60 − 35 = □'], ['③ คำนวณ', '= 25 · ตรวจ 35 + 25 = 60 ✓']], 'ตอบ <b>25 ลิตร</b>'))],
    () => pkF(VW_ST, 6).map(s => Q.b3Story(s))) /* v173: ขั้น ② ตั้งบวก/ลบเอง */
];

/* ---------- boss: built from our own practice items (no official test supplied) — d6spread ---------- */
const vX = (q, r, extra, unit = 'ลิตร', fig) => { const out = [r], n = fig ? 3 : 4; [...extra, r - 1, r + 1, r + 10].forEach(x => { if (out.length < n && x > 0 && !out.includes(x)) out.push(x); }); return { q, fig, opts: out.map(v => `${v} ${unit}`), a: 0 }; };
const EXAM_P2C8 = d6spread([
  { q: 'ตวงน้ำยาเคมี 50 มิลลิลิตร ควรใช้เครื่องมือใด', opts: ['กระบอกตวง', 'ลิตรตวงน้ำมัน', 'ช้อนตวง', 'ถ้วยตวง'], a: 0 },
  { q: 'ตวงเกลือป่นใส่อาหาร ควรใช้เครื่องมือใด', opts: ['ช้อนตวง', 'กระบอกตวง', 'ลิตรตวงน้ำมัน', 'ถ้วยตวง'], a: 0 },
  vX('จากภาพ น้ำส้มในกล่องตวงได้กี่แก้ว', 3, [2, 4], 'แก้ว', `<div class="vwrap">${vPourFig('carton', 3, 'glass', { srcName: 'น้ำส้ม', col: vLiq.juice })}</div>`),
  vX('จากภาพ น้ำแอปเปิลในกล่องตวงได้กี่ขวด', 7, [6, 8], 'ขวด', `<div class="vwrap">${vPourFig('carton', 7, 'bottle', { srcName: 'น้ำแอปเปิล', col: vLiq.apple })}</div>`),
  vX('จากภาพ เมล็ดกาแฟในกระสอบตวงได้กี่ช้อน', 6, [5, 7], 'ช้อน', `<div class="vwrap">${vPourFig('sack', 6, 'scoop', { srcName: 'เมล็ดกาแฟ', col: V_DRY.coffee, dry: 1 })}</div>`),
  { q: 'ตวงของแห้งด้วยช้อน ข้อใดถูกต้อง', opts: ['ตักให้เต็มแล้วปาดให้เรียบ', 'ตักให้พูนที่สุด', 'ตักครึ่งช้อน', 'ตักกี่ครั้งก็ได้ไม่ต้องนับ'], a: 0 },
  vX('ตวงข้าวสารในกระสอบได้ 10 ลิตร ข้าวสารในกระสอบมีปริมาตรกี่ลิตร', 10, [1, 5]),
  vX('จากภาพ น้ำในถังมีปริมาตรกี่ลิตร', 7, [6, 8], 'ลิตร', `<div class="vwrap one">${vCont('tank', 7 / 10, { col: vLiq.water, marks: 10 })}</div>`),
  { q: 'สิ่งใดมีปริมาตร<b>น้อยกว่า</b> 1 ลิตร', opts: ['กระป๋องน้ำอัดลม', 'ถังน้ำ', 'โอ่งน้ำ', 'กะละมังซักผ้า'], a: 0 },
  { q: 'สิ่งใดมีความจุ<b>มากกว่า</b> 1 ลิตร', opts: ['กะละมัง', 'ช้อน', 'กล่องนม', 'ถ้วยขนม'], a: 0 },
  { q: 'น้ำตาล 34 ลิตร … พริกไทย 30 ลิตร ควรเติมคำใด', opts: ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'], a: 0 },
  { q: 'งาดำ 56 ลิตร … เม็ดแมงลัก 56 ลิตร ควรเติมคำใด', opts: ['เท่ากับ', 'มากกว่า', 'น้อยกว่า'], a: 0 },
  vX('น้ำมะเขือเทศ 5 ลิตร น้ำส้ม 1 ลิตร น้ำมะเขือเทศมีปริมาตรมากกว่าน้ำส้มกี่ลิตร', 4, [6, 5]),
  { q: 'นม 1 ลิตร กาแฟ 2 ลิตร น้ำ 6 ลิตร เมล็ดผัก 4 ลิตร สิ่งใดมีปริมาตรมากกว่า 3 ลิตร', opts: ['น้ำ และเมล็ดผัก', 'นม และกาแฟ', 'กาแฟ และน้ำ', 'นม และเมล็ดผัก'], a: 0 },
  { q: '11 ช้อนโต๊ะ … 9 ช้อนโต๊ะ ควรเติมคำใด', opts: ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'], a: 0 },
  { q: 'น้ำผึ้งเต็มขวด ตวงได้ 6 ลิตร ข้อใดถูกต้อง', opts: ['ขวดนี้มีความจุ 6 ลิตร', 'ขวดนี้มีความจุ 3 ลิตร', 'น้ำผึ้งมีปริมาตร 12 ลิตร', 'ขวดนี้มีความจุ 1 ลิตร'], a: 0 },
  vX('กาน้ำมีน้ำครึ่งกา เทออกมาได้ 5 ลิตร กาใบนี้จุน้ำได้กี่ลิตร', 10, [5, 15]),
  vX('ถังน้ำมีความจุ 5 ลิตร มากกว่ากะละมัง 1 ลิตร กะละมังมีความจุกี่ลิตร', 4, [6, 5]),
  vX('โอ่งจุน้ำได้ 80 ลิตร ตอนนี้มีน้ำ 49 ลิตร ต้องเติมน้ำอีกกี่ลิตรจึงจะเต็มพอดี', 31, [129, 41]),
  vX('วันจันทร์ร้านขายถั่วเขียวได้ 15 ลิตร วันอังคารขายได้มากกว่าวันจันทร์ 26 ลิตร วันอังคารร้านขายถั่วเขียวได้กี่ลิตร', 41, [11, 31])]);
LESSONS_P2C8.push({ id: 999, boss: true, place: 'อ่าวตวงน้ำ', title: 'ด่านบอส: บทที่ 8 การวัดปริมาตร', short: 'ด่านบอส · ข้อสอบ', tone: 'sky',
  goal: 'คำถามท้ายบท 20 ข้อ (ตวงด้วยหน่วยที่ไม่ใช่มาตรฐาน ลิตร ช้อนชา ช้อนโต๊ะ ถ้วยตวง ความจุ และโจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P2C8, pass: 10, bossName: 'ปีศาจปลาหมึกตวงน้ำ', bossPal: 'sky', emblem: 'ล.', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกตวงน้ำแล้ว! ตวงอะไรก็แม่นยำ', loseLine: 'ปีศาจปลาหมึกยังตวงเก่งกว่า สู้ใหม่นะ!' });
[981, 981, 981, 981, 982, 982, 983, 983, 984, 984, 985, 985, 985, 985, 986, 987, 987, 988, 989, 989].forEach((lv, i) => { if (EXAM_P2C8[i]) EXAM_P2C8[i].lv = lv; }); // topic of each boss item (ผลการประเมิน)
