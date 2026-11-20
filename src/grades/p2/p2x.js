/* =========================================================
   GRADE 2 · CHAPTER 5 — การคูณ  (ชายหาด · ภาคเรียนที่ 1 · เมือง 47 · ด่าน 921–932 · ด่านพิเศษ 938 · บอส 939)
   equal groups · repeated addition · arrays · 1 and 0 · times tables (ท่อง → ปิดคำตอบ → ทดสอบไว, จำจริงด้วยระบบทบทวน) ·
   × 10, 20 … 90 · 2-digit × 1-digit in columns · unknowns · word problems
   convention: a × b = a groups of b (มี 7 ถุง ถุงละ 4 → 7 × 4)
   ========================================================= */
/* ---------- pictures ---------- */
const mtIco = (e, x, y, s) => e === 'bottle' ? `<svg x="${x}" y="${y}" width="${s}" height="${s * 1.25}" viewBox="0 0 64 80">${vCont('bottle', .85, { col: '#E5505E' }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`
  : `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 64 64">${ART[e] || ART.star}</svg>`;
/* g groups of s things — o.hl: first k groups lit · o.run: running total under each group · o.box: 'plate' | 'bag' */
function mtGroupsSVG(g, s, e = 'orange', o = {}) {
  const I = o.size || (s > 6 ? 15 : 18), cols = s <= 3 ? Math.max(s, 1) : s <= 6 ? 3 : s <= 9 ? 3 : 4, rows = Math.max(1, Math.ceil(s / cols)), bw = cols * I + 12, bh = rows * I * (e === 'bottle' ? 1.25 : 1) + 14;
  const per = Math.min(g, o.perRow || 5), W = per * (bw + 10) + 6, R = Math.ceil(g / per), H = R * (bh + (o.run ? 26 : 12)) + 4; let out = '';
  for (let i = 0; i < g; i++) { const gx = 6 + (i % per) * (bw + 10), gy = 4 + Math.floor(i / per) * (bh + (o.run ? 26 : 12)), lit = o.hl == null || i < o.hl;
    out += `<g opacity="${lit ? 1 : .28}"><rect x="${gx}" y="${gy}" width="${bw}" height="${bh}" rx="${o.box === 'bag' ? 12 : 9}" fill="${o.box === 'bag' ? '#FFF3DA' : '#F4FBFF'}" stroke="${lit && o.hl != null && i === o.hl - 1 ? '#E98A2E' : '#8C84A8'}" stroke-width="${lit && o.hl != null && i === o.hl - 1 ? 3 : 1.8}"/>`;
    for (let j = 0; j < s; j++) out += mtIco(e, gx + 6 + (j % cols) * I, gy + 7 + Math.floor(j / cols) * I * (e === 'bottle' ? 1.25 : 1), I - 1);
    if (o.run && lit) out += `<text x="${gx + bw / 2}" y="${gy + bh + 19}" text-anchor="middle" class="mt-run">${(i + 1) * s}</text>`; out += '</g>'; }
  return `<svg viewBox="0 0 ${W} ${H}" class="mtpic" style="max-width:${Math.min(W * 1.6, 560)}px" aria-hidden="true">${out}</svg>`;
}
/* r rows × c columns of dots · o.hl rows lit · o.run running totals */
function mtArraySVG(r, c, o = {}) {
  const D = 22, W = c * D + (o.run ? 46 : 10), H = r * D + 10; let s = '';
  for (let i = 0; i < r; i++) { const lit = o.hl == null || i < o.hl; for (let j = 0; j < c; j++) s += `<circle cx="${12 + j * D}" cy="${12 + i * D}" r="8" fill="${lit ? (o.col || '#7FC8F0') : '#E7E2F2'}" stroke="#2B2550" stroke-width="1.2"/>`;
    if (o.run && lit) s += `<text x="${c * D + 10}" y="${17 + i * D}" class="mt-run">${(i + 1) * c}</text>`; }
  return `<svg viewBox="0 0 ${W} ${H}" class="mtpic" style="max-width:${Math.min(W * 1.7, 520)}px" aria-hidden="true">${s}</svg>`;
}
/* number line hops: n each, k hops (o.upto shows only the first hops) */
function mtHopSVG(n, k, o = {}) {
  const max = n * k, W = 520, x = v => 20 + v / max * (W - 40), upto = o.upto ?? k; let s = `<line x1="16" x2="${W - 16}" y1="70" y2="70" stroke="#2B2550" stroke-width="2"/>`;
  for (let i = 0; i <= k; i++) s += `<line x1="${x(i * n)}" x2="${x(i * n)}" y1="64" y2="76" stroke="#2B2550" stroke-width="2"/><text x="${x(i * n)}" y="94" text-anchor="middle" class="mt-hn${i <= upto ? '' : ' q'}">${i <= upto ? i * n : '?'}</text>`;
  for (let i = 0; i < upto; i++) { const a = x(i * n), b = x((i + 1) * n); s += `<path d="M${a} 66 Q${(a + b) / 2} ${30} ${b} 66" fill="none" stroke="#E98A2E" stroke-width="2.4"/><text x="${(a + b) / 2}" y="40" text-anchor="middle" class="mt-hp">+${n}</text>`; }
  return `<svg viewBox="0 0 ${W} 104" class="mtpic hop" aria-hidden="true">${s}</svg>`;
}
/* base-ten picture: g groups of (t rods + u cubes) */
function mtRodsSVG(g, t, u, o = {}) {
  const gw = t * 9 + (u ? Math.ceil(u / 5) * 9 + 6 : 0) + 14, per = Math.min(g, o.perRow || 4), W = per * (gw + 8) + 4, H = Math.ceil(g / per) * 66 + 6; let s = '';
  for (let i = 0; i < g; i++) { const gx = 4 + (i % per) * (gw + 8), gy = 4 + Math.floor(i / per) * 66, lit = o.hl == null || i < o.hl;
    s += `<g opacity="${lit ? 1 : .3}"><rect x="${gx}" y="${gy}" width="${gw}" height="60" rx="8" fill="#FFFDF6" stroke="#C9B8FF" stroke-width="1.6"/>`;
    for (let k = 0; k < t; k++) s += `<rect x="${gx + 7 + k * 9}" y="${gy + 6}" width="7" height="48" rx="1.5" fill="#7FC8F0" stroke="#2F6FA0" stroke-width="1"/>`;
    for (let k = 0; k < u; k++) s += `<rect x="${gx + 9 + t * 9 + Math.floor(k / 5) * 9}" y="${gy + 8 + (k % 5) * 9.5}" width="7" height="7" rx="1.2" fill="#FFD45C" stroke="#B7791F" stroke-width="1"/>`;
    s += '</g>'; }
  return `<svg viewBox="0 0 ${W} ${H}" class="mtpic" style="max-width:${Math.min(W * 1.5, 560)}px" aria-hidden="true">${s}</svg>`;
}
/* column multiplication (tens | ones) — o.q hide the answer · o.ones show only the ones step · o.carry */
function mtColHTML(a, b, o = {}) {
  const p = a * b, A = String(a).padStart(2, ' '), P = String(p), c = Math.floor((a % 10) * b / 10), cells = s => s.split('').map(d => `<td>${d.trim()}</td>`).join('');
  const w = Math.max(3, P.length), pad = s => s.padStart(w, ' ');
  const res = o.q ? pad('?'.repeat(P.length)) : o.ones ? pad(String(p % 10)) : pad(P);
  return `<table class="mtcol"><tr class="cy">${cells(pad(o.carry && c ? String(c) + ' ' : ''))}</tr><tr>${cells(pad(A))}</tr><tr class="mul"><td class="op">×</td>${cells(pad(String(b)).slice(1))}</tr><tr class="res">${cells(res)}</tr></table>`;
}

/* hands: 5 fingers each (for แม่ 5) */
const mtHandSVG = n => `<svg viewBox="0 0 ${n * 62 + 6} 78" class="mtpic" style="max-width:${n * 80}px" aria-hidden="true">${range(0, n - 1).map(i => { const x = 6 + i * 62;
  return `<g transform="translate(${x} 0)"><rect x="10" y="38" width="38" height="34" rx="14" fill="#FFD9B8" stroke="#B7791F" stroke-width="1.6"/>${[[12, 22], [20, 10], [29, 6], [38, 10]].map(([fx, fy]) => `<rect x="${fx}" y="${fy}" width="8" height="${44 - fy}" rx="4" fill="#FFD9B8" stroke="#B7791F" stroke-width="1.4"/>`).join('')}<rect x="44" y="40" width="16" height="8" rx="4" transform="rotate(-30 44 44)" fill="#FFD9B8" stroke="#B7791F" stroke-width="1.4"/><text x="30" y="64" text-anchor="middle" class="mt-run">${(i + 1) * 5}</text></g>`; }).join('')}</svg>`;
/* ---------- memory: every fact answered moves up (right) or down (wrong) — weak facts come back more often ---------- */
const mtKey = (a, b) => `${Math.min(a, b)}x${Math.max(a, b)}`;
const mtBox = (a, b) => (SAVE.mt || {})[mtKey(a, b)] || 0;
function mtHit(a, b, ok) { SAVE.mt = SAVE.mt || {}; const k = mtKey(a, b), v = SAVE.mt[k] || 0; SAVE.mt[k] = ok ? Math.min(5, v + 1) : Math.max(0, v - 2); persist(); }
function mtFacts(tables, n, kMax = 12) {
  const all = []; tables.forEach(t => range(1, kMax).forEach(k => all.push([t, k])));
  const out = []; while (out.length < n && all.length) { const w = all.map(f => 6 - mtBox(f[0], f[1])), tot = w.reduce((a, b) => a + b, 0); let r = Math.random() * tot, i = 0; while ((r -= w[i]) > 0) i++; out.push(all.splice(Math.min(i, all.length - 1), 1)[0]); }
  return out.map(([t, k]) => Math.random() < .5 ? [t, k] : [k, t]);
}
const mtChantTxt = (a, b) => `${thaiWords(a)}${thaiWords(b)}${thaiWords(a * b)}`;
const mtNear = (a, b) => { const p = a * b, c = [p + b, p - b, p + a, p - a, (a + 1) * (b + 1), p + 1, p + 10].filter(x => x >= 0 && x !== p); return shuffle([...new Set(c)]).slice(0, 3); };

/* ---------- table tools: ท่องตาม (chant) and ปิดคำตอบ (cover & recall) ---------- */
function mtChant(n, kMax = 12) {
  const box = h('div', { class: 'colstack' }, h6wait()), tab = h('div', { class: 'mttab ia' }), heard = new Set(); let timer = null;
  const rows = range(1, kMax).map(k => { const r = h('button', { class: 'mtrow' }, h('span', { class: 'mtf', html: `${n} × ${k} = <b>${n * k}</b>` }), h('small', null, mtChantTxt(n, k)));
    r.onclick = e => { e.stopPropagation(); stop(); hl(k); say(mtChantTxt(n, k), true); }; tab.append(r); return r; });
  const hl = k => { rows.forEach((r, i) => r.classList.toggle('on', i === k - 1)); heard.add(k); rows[k - 1].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); if (heard.size >= kMax) teachDone(box); };
  const stop = () => { clearTimeout(timer); timer = null; play.replaceChildren(icon('play'), 'ท่องพร้อมกันทั้งแม่'); };
  const run = k => { if (k > kMax || !box.isConnected) { stop(); return; } hl(k); say(mtChantTxt(n, k), true); sfx.pop(k % 8); timer = setTimeout(() => run(k + 1), SET.mute ? 900 : 1700); };
  const play = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (timer) return stop(); play.replaceChildren(icon('close'), 'หยุด'); run(1); } }, icon('play'), 'ท่องพร้อมกันทั้งแม่');
  box.append(h('div', { class: 'cap' }, `แตะแต่ละบรรทัดเพื่อฟัง หรือกด “ท่องพร้อมกัน” แล้วออกเสียงตาม — ฟังให้ครบทั้ง ${kMax} บรรทัด`), play, tab); return box;
}
/* round 1: every other answer hidden · round 2: all hidden — tap a hidden answer, pick the product */
function mtCover(n, kMax = 12, o = {}) {
  const box = h('div', { class: 'colstack' }, h6wait()), tab = h('div', { class: 'mttab ia' }), pickBox = h('div', { class: 'rowstack mtpick' }), out = fNote(); let round = 1, hid = new Set(), cur = null;
  const rows = range(1, kMax).map(k => { const r = h('button', { class: 'mtrow' }); r.onclick = e => { e.stopPropagation(); if (!hid.has(k)) { say(mtChantTxt(n, k), true); return; } cur = k; draw(); ask(k); }; tab.append(r); return r; });
  const draw = () => rows.forEach((r, i) => { const k = i + 1; r.innerHTML = `<span class="mtf">${n} × ${k} = ${hid.has(k) ? '<i class="mtq">?</i>' : `<b>${n * k}</b>`}</span>`; r.classList.toggle('on', cur === k); r.classList.toggle('hid', hid.has(k)); });
  const ask = k => { pickBox.innerHTML = ''; out.innerHTML = `<b>${n} × ${k}</b> เท่ากับเท่าไร`;
    shuffle([n * k, ...mtNear(n, k).slice(0, 2)]).forEach(v => pickBox.append(h('button', { class: 'btn ia mtopt', onclick: e => { e.stopPropagation();
      if (v === n * k) { mtHit(n, k, true); hid.delete(k); cur = null; sfx.ok(); say(mtChantTxt(n, k), true); pickBox.innerHTML = ''; draw(); next(); }
      else { mtHit(n, k, false); sfx.no(); e.currentTarget.classList.add('bad'); out.innerHTML = `ยังไม่ใช่ — ลองนับเพิ่มทีละ ${n}: ${range(1, Math.min(k, 4)).map(i => n * i).join(', ')}${k > 4 ? ', …' : ''}`; } } }, String(v)))); };
  const start = () => { hid = new Set(range(1, kMax).filter(k => round === 2 || k % 2 === 0)); cur = null; draw(); pickBox.innerHTML = '';
    out.innerHTML = round === 1 ? 'รอบที่ 1: ปิดคำตอบไว้ครึ่งหนึ่ง — แตะ <b>?</b> แล้วเลือกคำตอบ' : 'รอบที่ 2: ปิดคำตอบ<b>ทั้งหมด</b> — ลองนึกให้ได้เอง!'; };
  const next = () => { if (hid.size) { out.innerHTML = `เหลืออีก ${hid.size} ข้อ`; return; } if (round === 1) { round = 2; sfx.win && sfx.win(); setTimeout(start, 700); return; }
    out.innerHTML = `เก่งมาก! จำแม่ ${n} ได้ครบทั้ง ${kMax} ข้อ 🎉`.replace(' 🎉', ''); teachDone(box); o.onDone && o.onDone(); };
  start(); box.append(out, pickBox, tab); return box;
}
/* mastery book — 2..12 × 1..12, colour = how well each fact is remembered */
function mtBook() {
  const g = h('div', { class: 'mtbook' }); let good = 0, all = 0;
  g.append(h('b', { class: 'mtb-h' }, '×'), ...range(1, 12).map(k => h('b', { class: 'mtb-h' }, k)));
  range(2, 12).forEach(n => { g.append(h('b', { class: 'mtb-h' }, n)); range(1, 12).forEach(k => { const v = mtBox(n, k); all++; if (v >= 3) good++; g.append(h('span', { class: 'mtb-c b' + Math.min(v, 5), title: `${n} × ${k} = ${n * k}` }, n * k)); }); });
  return h('div', { class: 'colstack' }, h('div', { class: 'cap', html: `สมุดสูตรคูณของฉัน: จำได้แม่นแล้ว <b>${good}</b> จาก ${all} ข้อ · <span class="mtb-c b0">ยังไม่ฝึก</span> <span class="mtb-c b2">กำลังจำ</span> <span class="mtb-c b4">จำได้แล้ว</span>` }), g);
}
/* trainer for the bonus level: pick a table, then ท่องตาม / ปิดคำตอบ */
function mtTrainer() {
  let n = 2; const box = h('div', { class: 'colstack' }), tabs = h('div', { class: 'rowstack mttabs ia' }), modes = h('div', { class: 'rowstack ia' }), pane = h('div', { class: 'colstack' });
  let mode = 'chant';
  const show = () => { tabs.querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.n === n)); modes.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.m === mode));
    pane.innerHTML = ''; pane.append(mode === 'chant' ? mtChant(n) : mode === 'cover' ? mtCover(n, 12, { onDone: () => teachDone(box) }) : mtBook()); };
  range(2, 12).forEach(k => tabs.append(h('button', { class: 'btn sm', 'data-n': k, onclick: e => { e.stopPropagation(); n = k; sfx.tap(); show(); } }, `แม่ ${k}`)));
  [['chant', 'ท่องตาม'], ['cover', 'ปิดคำตอบ'], ['book', 'สมุดสูตรคูณ']].forEach(([m, t]) => modes.append(h('button', { class: 'btn sm', 'data-m': m, onclick: e => { e.stopPropagation(); mode = m; sfx.tap(); show(); if (m === 'book') teachDone(box); } }, t)));
  box.append(tabs, modes, pane); show(); return box;
}

/* ---------- teaching sims ---------- */
function simMtGroups(e = 'strawberry') {
  let g = 3, s = 4; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set();
  const draw = () => { fig.innerHTML = mtGroupsSVG(g, s, e, { run: true }); out.innerHTML = `${g} กลุ่ม กลุ่มละ ${s}<br>${range(1, g).map(() => s).join(' + ')} = <b>${g * s}</b><br>เขียนเป็น <b>${g} × ${s} = ${g * s}</b>`; seen.add(g + ':' + s); if (seen.size >= 3) teachDone(box); };
  const st = (lab, get, set, max) => h('div', { class: 'rowstack' }, h('span', { class: 'cap' }, lab), h('button', { class: 'btn icon sm ia danger', onclick: e2 => { e2.stopPropagation(); if (get() > 1) { set(get() - 1); sfx.tap(); draw(); } } }, '−'), h('button', { class: 'btn icon sm ia primary', onclick: e2 => { e2.stopPropagation(); if (get() < max) { set(get() + 1); sfx.pop(get()); draw(); } } }, '+'));
  draw(); box.append(fig, h('div', { class: 'rowstack' }, st('จำนวนกลุ่ม', () => g, v => g = v, 6), st('กลุ่มละ', () => s, v => s = v, 6)), out); return box;
}
function simMtArray() {
  let r = 3, c = 5, turned = false; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote();
  const draw = () => { fig.innerHTML = mtArraySVG(r, c, { run: true }); out.innerHTML = `${r} แถว แถวละ ${c} → <b>${r} × ${c} = ${r * c}</b>` + (turned ? ` · หมุนแล้วจำนวนจุดยังเท่าเดิม: <b>${c} × ${r} = ${r * c}</b>` : ''); };
  const rot = h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); [r, c] = [c, r]; turned = true; sfx.pop(3); fig.firstChild?.classList.add('spin'); setTimeout(draw, 250); teachDone(box); } }, '↻ หมุนแผนภาพ');
  const st = (lab, d1) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); if (d1 === 'r') r = r % 6 + 1; else c = c % 6 + 1; sfx.tap(); draw(); } }, lab);
  draw(); box.append(fig, h('div', { class: 'rowstack' }, st('+ แถว', 'r'), st('+ จุดต่อแถว', 'c'), rot), out); return box;
}
function simMtZero() {
  let g = 3, s = 0; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set();
  const draw = () => { fig.innerHTML = mtGroupsSVG(g, s, 'apple'); out.innerHTML = `${g} จาน จานละ ${s} ผล → <b>${g} × ${s} = ${g * s}</b>` + (s === 0 ? ' · ไม่มีผลไม้สักผล ผลคูณจึงเป็น <b>0</b>' : s === 1 ? ' · จานละ 1 ผล ได้เท่ากับจำนวนจาน' : ''); seen.add(`${g}:${s}`); if (seen.size >= 4) teachDone(box); };
  const b = (t, f) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); f(); sfx.tap(); draw(); } }, t);
  draw(); box.append(fig, h('div', { class: 'rowstack' }, b('+ จาน', () => g = g % 6 + 1), b('จานละ 0', () => s = 0), b('จานละ 1', () => s = 1)), out); return box;
}
function simMtTens() {
  let a = 3, t = 2; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), out = fNote(), seen = new Set();
  const draw = () => { fig.innerHTML = mtRodsSVG(a, t, 0); out.innerHTML = `${a} กลุ่ม กลุ่มละ ${t} สิบ = <b>${a * t} สิบ</b> → <b>${a} × ${t * 10} = ${a * t * 10}</b>`; seen.add(a + ':' + t); if (seen.size >= 3) teachDone(box); };
  const b = (t2, f) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); f(); sfx.tap(); draw(); } }, t2);
  draw(); box.append(fig, h('div', { class: 'rowstack' }, b('+ กลุ่ม', () => a = a % 5 + 1), b('+ 1 สิบต่อกลุ่ม', () => t = t % 5 + 1)), out); return box;
}

/* ---------- question types ---------- */
const mtProxy = (ctx, onFirst, onMiss) => { let first = true; const p = Object.create(ctx); p.check = (ok, hint) => { if (first) { first = false; onFirst && onFirst(ok); } if (!ok && onMiss) onMiss(); ctx.check(ok, hint); }; return p; };
const mtTwoStep = (ctx, opts, right, hint1, then) => { const lab = h('div', { class: 'p4steplab', html: 'ขั้นที่ 1: เลือก<b>ประโยคสัญลักษณ์</b>' }), slot = h('div', { class: 'colstack' });
  const sub = { check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(4); lab.innerHTML = `<b>${right} = ?</b> ✓ · ขั้นที่ 2: หาคำตอบ`; slot.innerHTML = ''; slot.append(then()); ctx.say('ใช่แล้ว! หาคำตอบเลย'); } };
  slot.append(choices(sub, shuffle(opts).map(x => ({ value: x, label: x })), right, { hint: hint1 })); return h('div', { class: 'colstack' }, lab, slot); };
Object.assign(Q, {
  /* picture of groups → sentence → total */
  mtPic({ g, s, e, what, grp, unit }) { const q = `มี${what} ${g} ${grp} ${grp}ละ ${s} ${unit} มี${what}ทั้งหมดเท่าไร`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'p4-fig', html: mtGroupsSVG(g, s, e, { box: 'bag' }) }),
      mtTwoStep(ctx, [`${g} × ${s}`, `${g} + ${s}`, `${s} × ${s}`], `${g} × ${s}`, `มี ${g} ${grp} ${grp}ละเท่า ๆ กัน → ${g} กลุ่ม กลุ่มละ ${s}`, () => h('div', { class: 'rowstack' }, answerBox(ctx, String(g * s), { hint: `นับเพิ่มทีละ ${s} ไป ${g} ครั้ง` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit))))); } };
  },
  /* repeated addition → multiplication */
  mtRep({ n, k }) { const sum = range(1, k).map(() => n).join(' + '), q = `${sum} เขียนเป็นประโยคสัญลักษณ์การคูณได้อย่างไร`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 'colstack' }, h('div', { class: 'fbig mt-sum', html: sum }),
      mtTwoStep(ctx, [`${k} × ${n}`, `${n} × ${n}`, `${k} + ${n}`], `${k} × ${n}`, `บวก ${n} ซ้ำกัน ${k} ครั้ง → ${k} × ${n}`, () => h('div', { class: 'rowstack' }, answerBox(ctx, String(n * k), { hint: `${n} บวกกัน ${k} ครั้ง` })))));
    } };
  },
  /* array → total */
  mtArr({ r, c }) { const q = `จุดเรียงเป็น ${r} แถว แถวละ ${c} จุด มีทั้งหมดกี่จุด`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'p4-fig', html: mtArraySVG(r, c) }),
      mtTwoStep(ctx, [`${r} × ${c}`, `${r} + ${c}`, `${c} × ${c}`], `${r} × ${c}`, `${r} แถว แถวละ ${c}`, () => answerBox(ctx, String(r * c), { hint: `นับทีละแถว แถวละ ${c}` })))); } };
  },
  mtSwap({ a, b }) { const q = `${a} × ${b} = ${b} × □  □ คือจำนวนใด`;
    return { prompt: q, say: `${a} คูณ ${b} เท่ากับ ${b} คูณ อะไร`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: mtArraySVG(Math.min(a, b), Math.max(a, b)) }),
      h('div', { class: 'colstack' }, h('div', { class: 'fbig', html: `${a} × ${b} = ${b} × <span class="fsign">□</span>` }), answerBox(ctx, String(a), { hint: 'สลับที่ตัวคูณ ผลคูณเท่าเดิม (หมุนแผนภาพดู)' })))); } };
  },
  /* one fact — remembers the result; a wrong answer shows the picture as a hint */
  mtFact({ a, b, e }) { const q = `${a} × ${b} = ?`;
    return { prompt: q, say: `${a} คูณ ${b} เท่ากับเท่าไร`, mount(bd, ctx) { const hintFig = h('div', { class: 'p4-fig mt-hint' });
      const showHint = () => { hintFig.innerHTML = (a <= 6 && b <= 8) || (b <= 6 && a <= 8) ? (b === 0 || a === 0 ? mtGroupsSVG(Math.max(a, 1), b, e || 'apple') : mtGroupsSVG(a, b, e || pick(['orange', 'strawberry', 'apple', 'cookie']), { run: true })) : mtHopSVG(b, a); };
      const px = mtProxy(ctx, ok => mtHit(a, b, ok), showHint);
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'colstack' }, h('div', { class: 'fbig p4big mt-big', html: `${a} <span class="fop">×</span> ${b} <span class="fop">=</span> <span class="fsign">?</span>` }), hintFig),
        answerBox(px, String(a * b), { hint: `นับเพิ่มทีละ ${b} ไป ${a} ครั้ง (หรือท่องแม่ ${a})` }))); } };
  },
  /* fill the blanks of a table, one at a time */
  mtFill({ n, ks, blanks }) { const q = `เติมสูตรคูณแม่ ${n} ให้ครบ`;
    return { prompt: q, say: q, mount(bd, ctx) { let bi = 0; const tab = h('div', { class: 'mttab sm' }), slot = h('div');
      const draw = () => { tab.innerHTML = ks.map(k => `<div class="mtrow${blanks[bi] === k ? ' on' : ''}${blanks.includes(k) && blanks.indexOf(k) >= bi ? ' hid' : ''}"><span class="mtf">${n} × ${k} = ${blanks.includes(k) && blanks.indexOf(k) >= bi ? '<i class="mtq">?</i>' : `<b>${n * k}</b>`}</span></div>`).join(''); };
      const ask = () => { draw(); slot.innerHTML = ''; if (bi >= blanks.length) return ctx.check(true); const k = blanks[bi]; let first = true;
        slot.append(answerBox({ ...ctx, check: (ok, hn) => { if (first) { first = false; mtHit(n, k, ok); } if (!ok) return ctx.check(false, hn); sfx.pop(bi + 2); bi++; setTimeout(ask, 300); }, say: ctx.say }, String(n * k), { hint: `${n} × ${k - 1} = ${n * (k - 1)} แล้วเพิ่มอีก ${n}` })); };
      bd.append(h('div', { class: 't6-q p4-q p2q' }, tab, h('div', { class: 'colstack' }, slot))); ask(); } };
  },
  /* balloon round: 5 facts, tap the right balloon fast */
  mtPop({ facts }) { const q = 'แตะลูกโป่งที่เป็นคำตอบ ให้เร็วที่สุด!';
    return { prompt: q, say: q, mount(bd, ctx) { let r = 0, t0 = Date.now(), miss = 0; const head = h('div', { class: 'fbig p4big mt-big' }), sky = h('div', { class: 'mtsky ia' }), dots = h('div', { class: 'mtdots' });
      const round = () => { dots.innerHTML = facts.map((_, i) => `<i class="${i < r ? 'ok' : i === r ? 'cur' : ''}"></i>`).join('');
        if (r >= facts.length) { const sec = Math.round((Date.now() - t0) / 1000); head.innerHTML = `ครบ ${facts.length} ข้อใน <b>${sec}</b> วินาที!`; sky.innerHTML = ''; return ctx.check(true); }
        const [a, b] = facts[r], p = a * b; let first = true; head.innerHTML = `${a} <span class="fop">×</span> ${b} <span class="fop">=</span> <span class="fsign">?</span>`; sky.innerHTML = '';
        shuffle([p, ...mtNear(a, b)]).forEach((v, i) => { const bl = h('button', { class: 'mtball c' + i, style: { animationDelay: (i * .35) + 's' } }, h('span', null, String(v)));
          bl.onclick = e => { e.stopPropagation(); if (v === p) { if (first) mtHit(a, b, true); bl.classList.add('pop'); sfx.pop(r + 2); say(mtChantTxt(a, b), true); r++; setTimeout(round, 380); }
            else { if (first) { first = false; mtHit(a, b, false); } miss++; bl.classList.remove('bad'); void bl.offsetWidth; bl.classList.add('bad'); sfx.no(); ctx.say(`ยังไม่ใช่ ${a} × ${b} นับเพิ่มทีละ ${b} ไป ${a} ครั้ง`); } };
          sky.append(bl); }); };
      bd.append(h('div', { class: 'colstack' }, dots, head, sky)); round(); } };
  },
  /* skip counting on a number line */
  mtSkip({ n, k = 8, blanks }) { const q = `นับเพิ่มทีละ ${n} แล้วเติมจำนวนที่หายไป`;
    return { prompt: q, say: q, mount(bd, ctx) { let bi = 0; const seq = h('div', { class: 'mtseq' }), slot = h('div');
      const draw = () => { seq.innerHTML = range(1, k).map(i => blanks.includes(i) && blanks.indexOf(i) >= bi ? `<span class="${blanks[bi] === i ? 'on' : ''}">?</span>` : `<span>${n * i}</span>`).join('<i>→</i>'); };
      const ask = () => { draw(); slot.innerHTML = ''; if (bi >= blanks.length) return ctx.check(true); const i = blanks[bi];
        slot.append(answerBox({ ...ctx, check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(bi + 2); bi++; setTimeout(ask, 300); }, say: ctx.say }, String(n * i), { hint: `เพิ่มทีละ ${n}` })); };
      bd.append(h('div', { class: 'colstack' }, h('div', { class: 'p4-fig', html: mtHopSVG(n, k, { upto: 0 }) }), seq, slot)); ask(); } };
  },
  mtTens({ a, t }) { const q = `${a} × ${t} = ?`, x = t / 10;
    return { prompt: q, say: `${a} คูณ ${t} เท่ากับเท่าไร`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'colstack' }, h('div', { class: 'fbig p4big mt-big', html: `${a} <span class="fop">×</span> ${t} <span class="fop">=</span> <span class="fsign">?</span>` }), a * x <= 24 ? h('div', { class: 'p4-fig', html: mtRodsSVG(a, x, 0, { perRow: 5 }) }) : null),
      answerBox(ctx, String(a * t), { hint: `${a} × ${x} สิบ = ${a * x} สิบ` }))); } };
  },
  /* 2-digit × 1-digit in columns */
  mtCol({ a, b }) { // v111: the shared column board (colw.js)
    return Q.colW({ nums: [a, b], op: '×', prompt: `${a} × ${b} = ? <small>(ตั้งคูณ)</small>`, say: `${a} คูณ ${b} เท่ากับเท่าไร`, sig: `mtc ${a}x${b}` });
  },
  mtCmp({ l, r }) { const L = l[0] * l[1], R = r[0] * r[1], sym = L > R ? '>' : L < R ? '<' : '=';
    return { prompt: 'เติมเครื่องหมาย > < หรือ =', say: `${l[0]} คูณ ${l[1]} กับ ${r[0]} คูณ ${r[1]} เติมเครื่องหมาย`, mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?');
      bd.append(h('div', { class: 'colstack' }, h('div', { class: 'sentence' }, h('span', { class: 'lab', html: `${l[0]} × ${l[1]}` }), blank, h('span', { class: 'lab', html: `${r[0]} × ${r[1]}` })),
        wordChoices(ctx, sym, blank, l[0] === r[1] && l[1] === r[0] ? 'สลับที่ตัวคูณ ผลคูณเท่าเดิม' : l.includes(r[0]) || l.includes(r[1]) ? 'มีตัวคูณตัวหนึ่งเท่ากัน ดูอีกตัวว่าตัวไหนมากกว่า' : 'หาผลคูณทั้งสองก่อน แล้วเปรียบเทียบ', ['>', '<', '=']))); } };
  },
  /* a × □ = p  or  □ × b = p */
  mtUnk({ a, b, pos }) { const p = a * b, L = pos === 0 ? '□' : a, R = pos === 1 ? '□' : b, x = pos === 0 ? a : b, other = pos === 0 ? b : a;
    return { prompt: `${L} × ${R} = ${p}  □ คือจำนวนใด`, say: `${pos === 0 ? 'อะไร' : a} คูณ ${pos === 1 ? 'อะไร' : b} เท่ากับ ${p}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'colstack' }, h('div', { class: 'fbig p4big mt-big', html: `${L === '□' ? '<span class="fsign">□</span>' : L} <span class="fop">×</span> ${R === '□' ? '<span class="fsign">□</span>' : R} <span class="fop">=</span> ${p}` }),
        other <= 12 && x <= 12 ? h('div', { class: 'p4-fig', html: mtHopSVG(other, x, { upto: 0 }) }) : null), answerBox(ctx, String(x), { hint: `ท่องแม่ ${other}: ${other} × อะไรได้ ${p} (นับเพิ่มทีละ ${other} จนถึง ${p})` }))); } };
  },
  mtStory({ text, a, b, unit, fig }) {
    return { prompt: 'อ่านโจทย์ เลือกประโยคสัญลักษณ์ แล้วหาคำตอบ', say: text.replace(/<[^>]+>/g, ''), mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text }), fig ? h('div', { html: fig }) : null),
        mtTwoStep(ctx, [`${a} × ${b}`, `${a} + ${b}`, a > b ? `${a} − ${b}` : `${b} − ${a}`], `${a} × ${b}`, 'มีหลายกลุ่ม กลุ่มละเท่า ๆ กัน → คูณ', () => Math.max(a, b) > 12 && Math.min(a, b) < 10 ? (() => { const w = h('div', { class: 'k3stcol' }); Q.colW({ nums: a > b ? [a, b] : [b, a], op: '×' }).mount(w, ctx); return w; })() /* v172: ตั้งคูณเอง */ : h('div', { class: 'rowstack' }, answerBox(ctx, String(a * b), { hint: a > 12 || b > 12 ? 'ตั้งคูณ: หลักหน่วยก่อน แล้วหลักสิบ' : `ท่องแม่ ${a}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, unit))))); } };
  }
});
const mtMatchQ = facts => Q.ixMatch({ q: 'จับคู่สูตรคูณกับผลคูณ', pairs: facts.map(([a, b]) => [`${a} × ${b}`, String(a * b)]) });
/* unique products for matching */
const mtUniq = (tables, n) => { const out = [], seen = new Set(); for (const f of mtFacts(tables, 40)) { const p = f[0] * f[1]; if (!seen.has(p)) { seen.add(p); out.push(f); } if (out.length >= n) break; } return out; };
const mtTableGame = tabs => () => { const [t1, t2] = tabs, bl = (n) => shuffle(range(2, 11)).slice(0, 3).sort((x, y) => x - y);
  return [Q.mtFill({ n: t1, ks: range(1, 12), blanks: bl(t1) }), ...(t2 ? [Q.mtFill({ n: t2, ks: range(1, 12), blanks: bl(t2) })] : []),
    Q.mtPop({ facts: mtFacts(tabs, 5) }), ...mtFacts(tabs, 2).map(([a, b]) => Q.mtFact({ a, b })), mtMatchQ(mtUniq(tabs, 4)), Q.mtSkip({ n: pick(tabs), k: 8, blanks: shuffle(range(2, 8)).slice(0, 3).sort((x, y) => x - y) })]; };

/* ---------- data: practice ---------- */
const MTW_PIC = [{ g: 7, s: 4, e: 'orange', what: 'ส้ม', grp: 'ถุง', unit: 'ผล' }, { g: 6, s: 3, e: 'watermelon', what: 'แตงโม', grp: 'จาน', unit: 'ชิ้น' }, { g: 5, s: 2, e: 'flower', what: 'ดอกทานตะวัน', grp: 'ตะกร้า', unit: 'ดอก' },
  { g: 4, s: 5, e: 'apple', what: 'แอปเปิล', grp: 'ถุง', unit: 'ผล' }, { g: 3, s: 6, e: 'cookie', what: 'คุกกี้', grp: 'กล่อง', unit: 'ชิ้น' }]; // 
const MTW_REP = [[9, 4], [3, 7], [10, 5], [8, 9], [7, 6], [11, 10]]; // [จำนวน, จำนวนครั้ง]
const MTW_01 = [[8, 1], [1, 11], [1, 6], [0, 7], [0, 2], [9, 1], [0, 5], [1, 3], [4, 1], [5, 1], [10, 1], [6, 0], [4, 0], [9, 0], [0, 9]]; // 
const MTW_TENS = [[8, 20], [7, 30], [5, 50], [6, 20], [3, 60], [6, 90], [5, 70], [7, 40], [3, 30], [9, 40], [2, 20], [3, 90], [4, 60], [8, 80], [5, 80]]; // 
const MTW_COL0 = [[34, 2], [23, 3], [44, 2], [11, 5], [21, 3], [20, 4], [22, 2], [33, 3], [12, 4]]; // 
const MTW_COL1 = [[72, 6], [99, 5], [81, 7], [64, 3], [83, 3], [36, 9], [55, 4], [29, 8], [56, 6], [76, 5], [64, 8], [43, 6], [37, 3], [93, 4], [58, 9], [98, 4], [44, 5], [89, 2],
  [69, 4], [53, 5], [84, 3], [32, 7], [78, 8], [95, 2], [47, 3], [53, 9], [49, 8], [34, 4], [87, 5], [36, 7], [77, 6], [62, 8], [41, 8], [93, 9]]; // 
const MTW_CMP = [[[58, 4], [58, 9]], [[67, 8], [8, 40]], [[98, 5], [5, 98]], [[7, 43], [48, 7]], [[25, 3], [2, 25]], [[33, 9], [9, 29]], [[8, 45], [45, 8]], [[99, 6], [64, 7]], [[89, 3], [4, 91]], [[85, 4], [92, 7]],
  [[7, 13], [9, 13]], [[45, 5], [6, 20]], [[37, 3], [40, 3]], [[2, 76], [76, 2]], [[6, 34], [6, 34]], [[27, 8], [7, 46]], [[3, 77], [77, 5]], [[45, 5], [47, 2]], [[91, 8], [90, 5]], [[80, 6], [70, 6]]]; // 
const MTW_UNK = [[4, 5, 1], [9, 7, 0], [6, 10, 1], [6, 4, 1], [10, 12, 0], [7, 20, 1], [12, 11, 0], [50, 9, 0], [6, 80, 0], [70, 5, 1], [3, 4, 0], [8, 8, 0], [9, 10, 1], [6, 7, 0], [9, 8, 0], [8, 40, 1], [11, 11, 1], [30, 3, 0], [5, 40, 0], [70, 7, 1]]; // [a, b, ตำแหน่ง □]
const MTW_ST = [{ text: 'แม่ซื้อน้ำเต้าหู้ 3 ถุง ถุงละ 11 บาท ต้องจ่ายเงินกี่บาท', a: 3, b: 11, unit: 'บาท' }, { text: 'ครูให้นักเรียนยืนเป็นแถว 6 แถว แถวละ 4 คน มีนักเรียนกี่คน', a: 6, b: 4, unit: 'คน' },
  { text: 'นักปั่นจักรยานปั่นวันละ 31 กิโลเมตร ปั่นทุกวันติดกัน 4 วัน ปั่นได้รวมกี่กิโลเมตร', a: 4, b: 31, unit: 'กิโลเมตร' }, { text: 'สวนของป้ามีต้นส้ม 67 ต้น แต่ละต้นมีส้มสุก 3 ผล สวนนี้มีส้มสุกทั้งหมดกี่ผล', a: 67, b: 3, unit: 'ผล' },
  { text: 'ร้านน้ำปั่นขายได้วันละ 75 แก้ว เปิดขาย 4 วัน ขายน้ำปั่นได้ทั้งหมดกี่แก้ว', a: 4, b: 75, unit: 'แก้ว' }, { text: 'ห้องสมุดมีชั้นวางหนังสือ 36 ชั้น วางหนังสือชั้นละ 9 เล่ม มีหนังสือทั้งหมดกี่เล่ม', a: 36, b: 9, unit: 'เล่ม' },
  { text: 'มีขนม 7 ถุง ถุงละ 6 ชิ้น มีขนมทั้งหมดกี่ชิ้น', a: 7, b: 6, unit: 'ชิ้น', fig: () => mtGroupsSVG(7, 6, 'cookie', { box: 'bag' }) }, { text: 'มีมังคุด 8 จาน จานละ 5 ผล มีมังคุดทั้งหมดกี่ผล', a: 8, b: 5, unit: 'ผล', fig: () => mtGroupsSVG(8, 5, 'mangosteen') }]; // 

/* ---------- lessons ---------- */
const L2X = (no, place, title, short, goal, teach, game) => ({ id: 920 + no, no, place, title, short, tone: TONES5[(no + 5) % 6], goal, teach, game, learned: true });
const mtTablePages = (ns, first) => ns.flatMap((n, i) => learnStep(i === 0 ? first : `ต่อไป <b>แม่ ${n}</b>`, i === 0 ? first.replace(/<[^>]+>/g, '') : `ต่อไป แม่ ${n}`, MT_LEARN[n], MT_SUM[n]));
const MT_LEARN = {
  2: [{ fig: mtHopSVG(2, 6), name: 'แม่ 2 = นับเพิ่มทีละ 2', text: '2, 4, 6, 8, 10, 12 … เป็น<b>จำนวนคู่</b>ทั้งหมด' }, { fig: mtGroupsSVG(3, 2, 'cookie', { run: true }), name: '3 × 2 คือ 3 กลุ่ม กลุ่มละ 2', text: '2, 4, 6 → 3 × 2 = <b>6</b>' }],
  5: [{ fig: mtHopSVG(5, 6), name: 'แม่ 5 = นับเพิ่มทีละ 5', text: 'หลักหน่วยของผลคูณเป็น <b>0</b> กับ <b>5</b> สลับกันเสมอ' }, { fig: mtHandSVG(4), name: 'นิ้วมือ 1 ข้าง = 5', text: '4 มือ → 5, 10, 15, 20 → 4 × 5 = <b>20</b>' }],
  10: [{ fig: mtRodsSVG(4, 1, 0, { perRow: 4 }), name: 'แม่ 10 = นับเพิ่มทีละ 10', text: 'เติม <b>0</b> ต่อท้ายจำนวน: 4 × 10 = 40' }],
  3: [{ fig: mtHopSVG(3, 6), name: 'แม่ 3 = นับเพิ่มทีละ 3', text: '3, 6, 9, 12, 15, 18 …' }, { fig: mtArraySVG(4, 3, { run: true }), name: 'แถวละ 3', text: '4 แถว แถวละ 3 → 4 × 3 = <b>12</b>' }],
  4: [{ fig: mtHopSVG(4, 6), name: 'แม่ 4 = นับเพิ่มทีละ 4', text: '4, 8, 12, 16, 20, 24 …' }, { fig: lbig('แม่ 4 = แม่ 2 สองเท่า'), name: 'เคล็ดลับ', text: '2 × 3 = 6 → 4 × 3 = 6 + 6 = <b>12</b>' }],
  6: [{ fig: mtHopSVG(6, 6), name: 'แม่ 6 = นับเพิ่มทีละ 6', text: '6, 12, 18, 24, 30, 36 …' }, { fig: lbig('6 × 4 = 5 × 4 + 4'), name: 'เคล็ดลับ: แม่ 5 แล้วเพิ่มอีก 1 กลุ่ม', text: '20 + 4 = <b>24</b>' }],
  7: [{ fig: mtHopSVG(7, 6), name: 'แม่ 7 = นับเพิ่มทีละ 7', text: '7, 14, 21, 28, 35, 42 …' }, { fig: mtArraySVG(3, 7, { run: true }), name: 'สัปดาห์ละ 7 วัน', text: '3 สัปดาห์ → 3 × 7 = <b>21</b> วัน' }],
  8: [{ fig: mtHopSVG(8, 6), name: 'แม่ 8 = นับเพิ่มทีละ 8', text: '8, 16, 24, 32, 40, 48 …' }, { fig: lbig('แม่ 8 = แม่ 4 สองเท่า'), name: 'เคล็ดลับ', text: '4 × 6 = 24 → 8 × 6 = 24 + 24 = <b>48</b>' }],
  9: [{ fig: mtHopSVG(9, 6), name: 'แม่ 9 = นับเพิ่มทีละ 9', text: '9, 18, 27, 36, 45, 54 …' }, { fig: lbig('9 × 4 = 10 × 4 − 4 = 36'), name: 'เคล็ดลับ: แม่ 10 แล้วลบออก', text: 'และเลขโดดของผลคูณบวกกันได้ <b>9</b> เสมอ (3 + 6 = 9)' }]
};
const MT_SUM = { 2: 'แม่ 2 นับเพิ่มทีละ 2', 5: 'แม่ 5 ลงท้ายด้วย 0 หรือ 5', 10: 'แม่ 10 เติม 0 ต่อท้าย', 3: 'แม่ 3 นับเพิ่มทีละ 3', 4: 'แม่ 4 = แม่ 2 สองเท่า', 6: 'แม่ 6 = แม่ 5 + อีก 1 กลุ่ม', 7: 'แม่ 7 นับเพิ่มทีละ 7', 8: 'แม่ 8 = แม่ 4 สองเท่า', 9: 'แม่ 9 = แม่ 10 ลบออก' };
const mtBuildWalk = (n, e) => pexStep(`ตัวอย่างทีละขั้น: สร้างแม่ ${n} ด้วยภาพ`, 'ตัวอย่างทีละขั้น', range(1, 5).map(k => [`${n} × ${k}`, `${k} กลุ่ม กลุ่มละ ${n} → ${range(1, k).map(i => n * i).join(', ')} → <b>${n * k}</b>`, mtGroupsSVG(k, n, e, { run: true })]), `ท่องต่อไปเรื่อย ๆ: แต่ละบรรทัด<b>เพิ่มอีก ${n}</b>`);
const mtTryChant = n => T(`ลองท่องแม่ ${n}: ฟังแล้วออกเสียงตาม`, `ลองท่องแม่ ${n} ฟังแล้วออกเสียงตาม`, el => el.append(mtChant(n)));
const mtTryCover = n => T(`ลองปิดคำตอบแม่ ${n}: นึกให้ได้เอง`, `ลองปิดคำตอบแม่ ${n} นึกให้ได้เอง`, el => el.append(mtCover(n)));
const LESSONS_P2C5 = [
  L2X(1, 'หาดกลุ่มละเท่ากัน', 'ความหมายของการคูณ (1)', 'ความหมายการคูณ (1)', 'บอกความหมายของการคูณจากการรวมกลุ่มที่มีจำนวนเท่า ๆ กัน และเขียนประโยคสัญลักษณ์การคูณ',
    [...learnStep('ยินดีต้อนรับสู่ <b>ชายหาดสูตรคูณ</b>! รู้จัก<b>การคูณ</b>', 'ยินดีต้อนรับสู่ชายหาดสูตรคูณ รู้จักการคูณ', [
      { fig: mtGroupsSVG(3, 4, 'strawberry', { box: 'plate' }), name: 'กลุ่มละเท่า ๆ กัน', text: 'สตรอว์เบอร์รี 3 จาน จานละ <b>4</b> ผล ทุกจานมีเท่ากัน' },
      { fig: mtGroupsSVG(3, 4, 'strawberry', { run: true }), name: 'นับเพิ่มทีละ 4', text: '4 + 4 + 4 = <b>12</b> — บวกจำนวนเดิมซ้ำ ๆ' },
      { fig: lbig('3 × 4 = 12'), name: 'เขียนสั้น ๆ ด้วยการคูณ', text: '<b>3 กลุ่ม กลุ่มละ 4</b> เขียนว่า 3 × 4 อ่านว่า “สามคูณสี่” · เครื่องหมาย × อ่านว่า “คูณ”' }], 'กลุ่มละเท่า ๆ กัน → บวกซ้ำ → เขียนเป็นการคูณ'),
     pexStep('ตัวอย่างทีละขั้น: ไข่ในแผง', 'ตัวอย่างทีละขั้น', [['① ดูภาพ', 'มีไข่ 5 แผง แผงละ 2 ฟอง', mtGroupsSVG(5, 2, 'egg', { box: 'bag' })], ['② นับเพิ่มทีละ 2', '2, 4, 6, 8, 10', mtGroupsSVG(5, 2, 'egg', { box: 'bag', run: true })], ['③ ประโยคการบวก', '2 + 2 + 2 + 2 + 2 = 10', null], ['④ ประโยคการคูณ', '5 กลุ่ม กลุ่มละ 2 → <b>5 × 2 = 10</b>', null]], 'มีไข่ทั้งหมด <b>10</b> ฟอง'),
     T('ลองเอง: เปลี่ยนจำนวนกลุ่มและจำนวนในแต่ละกลุ่ม', 'ลองเอง เปลี่ยนจำนวนกลุ่มและจำนวนในแต่ละกลุ่ม', el => el.append(simMtGroups()))],
    () => [...pkF(MTW_PIC, 3).map(o => Q.mtPic(o)), ...pkF(MTW_REP, 2).map(([n, k]) => Q.mtRep({ n, k }))]),
  L2X(2, 'หาดแถวละเท่ากัน', 'ความหมายของการคูณ (2)', 'ความหมายการคูณ (2)', 'เขียนประโยคสัญลักษณ์การคูณจากแผนภาพแถว และรู้ว่าสลับที่ตัวคูณแล้วผลคูณเท่าเดิม',
    [...learnStep('รู้จัก<b>แผนภาพจัดแถว</b>', 'รู้จักแผนภาพจัดแถว', [
      { fig: mtArraySVG(3, 5), name: 'จัดของเป็นแถว แถวละเท่า ๆ กัน', text: '3 แถว แถวละ 5 จุด' },
      { fig: mtArraySVG(3, 5, { run: true }), name: 'นับทีละแถว', text: '5, 10, 15 → <b>3 × 5 = 15</b>' },
      { fig: lpair(mtArraySVG(3, 5), mtArraySVG(5, 3), '↻'), name: 'หมุนแผนภาพ จำนวนจุดเท่าเดิม', text: '<b>3 × 5 = 5 × 3 = 15</b> — สลับที่ตัวคูณได้' }], 'แถวละเท่ากัน → คูณ · สลับที่ตัวคูณ ผลคูณเท่าเดิม'),
     pexStep('ตัวอย่างทีละขั้น: ที่นั่งในห้องเรียน', 'ตัวอย่างทีละขั้น', [['① ดูภาพ', 'โต๊ะเรียน 4 แถว แถวละ 6 ตัว', mtArraySVG(4, 6, { col: '#FFD45C' })], ['② นับทีละแถว', '6, 12, 18, 24', mtArraySVG(4, 6, { col: '#FFD45C', run: true })], ['③ ประโยคการคูณ', '<b>4 × 6 = 24</b>', null], ['④ หมุนดู', '6 แถว แถวละ 4 ก็ได้ 24 → 6 × 4 = 24', mtArraySVG(6, 4, { col: '#FFD45C' })]], 'มีโต๊ะเรียนทั้งหมด <b>24</b> ตัว'),
     T('ลองเอง: เพิ่มแถว เพิ่มจุด แล้วหมุนแผนภาพ', 'ลองเอง เพิ่มแถว เพิ่มจุด แล้วหมุนแผนภาพ', el => el.append(simMtArray()))],
    () => { const A = shuffle([[2, 6], [3, 4], [4, 5], [5, 3], [2, 8], [3, 6]]); return [Q.mtArr({ r: A[0][0], c: A[0][1] }), Q.mtArr({ r: A[1][0], c: A[1][1] }), Q.mtSwap({ a: 4, b: 7 }), Q.mtSwap({ a: 8, b: 3 }),
      Q.ixMatch({ q: 'จับคู่แผนภาพกับประโยคการคูณ', pairs: A.slice(2, 5).map(([r, c]) => [`<div class="mtmini">${mtArraySVG(r, c)}</div>`, `${r} × ${c} = ${r * c}`]) })]; }),
  L2X(3, 'หาดหนึ่งศูนย์', 'หนึ่งและศูนย์กับการคูณ', 'หนึ่งและศูนย์', 'หาผลคูณของจำนวนใด ๆ กับ 1 และกับ 0',
    [...learnStep('รู้จัก<b>การคูณด้วย 1 และ 0</b>', 'รู้จักการคูณด้วยหนึ่งและศูนย์', [
      { fig: mtGroupsSVG(4, 1, 'apple'), name: 'คูณด้วย 1', text: '4 จาน จานละ 1 ผล → <b>4 × 1 = 4</b> ได้จำนวนเดิม' },
      { fig: mtGroupsSVG(1, 4, 'apple'), name: '1 คูณจำนวนใด', text: '1 จาน มี 4 ผล → <b>1 × 4 = 4</b>' },
      { fig: mtGroupsSVG(4, 0, 'apple'), name: 'คูณด้วย 0', text: '4 จาน ไม่มีผลไม้สักผล → <b>4 × 0 = 0</b>' },
      { fig: lbig('0 × 7 = 0'), name: '0 กลุ่ม ก็ไม่มีอะไรเลย', text: 'จำนวนใดคูณกับ 0 ได้ <b>0</b> เสมอ' }], 'คูณ 1 ได้จำนวนเดิม · คูณ 0 ได้ 0'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['① 6 × 1', '6 กลุ่ม กลุ่มละ 1 → 1, 2, 3, 4, 5, 6', mtGroupsSVG(6, 1, 'orange')], ['② ผล', '6 × 1 = <b>6</b>', null], ['③ 6 × 0', '6 กลุ่ม กลุ่มละ 0 → ไม่มีเลย', mtGroupsSVG(6, 0, 'orange')], ['④ ผล', '6 × 0 = <b>0</b>', null]], '6 × 1 = <b>6</b> · 6 × 0 = <b>0</b>'),
     T('ลองเอง: จานละ 0 จานละ 1', 'ลองเอง จานละศูนย์ จานละหนึ่ง', el => el.append(simMtZero()))],
    () => [...pkF(MTW_01, 3).map(([a, b]) => Q.mtFact({ a, b, e: 'apple' })), Q.mtPop({ facts: pkF(MTW_01, 5) }), Q.ixGroup({ q: 'แตะการ์ด แล้วแตะกล่องที่ใช่', bins: ['ผลคูณเป็น 0', 'ผลคูณเท่ากับจำนวนเดิม'], items: pkF(MTW_01, 6).map(([a, b]) => ({ label: `${a} × ${b}`, bin: a && b ? 1 : 0, why: a && b ? 'คูณด้วย 1 ได้จำนวนเดิม' : 'มี 0 เป็นตัวคูณ ผลคูณเป็น 0' })) })]),
  L2X(4, 'หาดแม่สองห้าสิบ', 'การคูณจำนวนหนึ่งหลักกับจำนวนหนึ่งหลัก (1)', 'แม่ 2 · 5 · 10', 'ท่องและใช้สูตรคูณแม่ 2 แม่ 5 และแม่ 10',
    [...mtTablePages([2, 5, 10], 'รู้จัก<b>สูตรคูณ</b> แม่ 2 แม่ 5 แม่ 10'), mtBuildWalk(2, 'cookie'), mtTryChant(2), mtTryCover(2), mtTryChant(5), mtTryCover(5)],
    mtTableGame([2, 5, 10])),
  L2X(5, 'หาดแม่สามสี่', 'การคูณจำนวนหนึ่งหลักกับจำนวนหนึ่งหลัก (2)', 'แม่ 3 · 4', 'ท่องและใช้สูตรคูณแม่ 3 และแม่ 4',
    [...mtTablePages([3, 4], 'รู้จัก<b>สูตรคูณ</b> แม่ 3 แม่ 4'), mtBuildWalk(3, 'strawberry'), mtTryChant(3), mtTryCover(3), mtTryChant(4), mtTryCover(4)], mtTableGame([3, 4])),
  L2X(6, 'หาดแม่หกเจ็ด', 'การคูณจำนวนหนึ่งหลักกับจำนวนหนึ่งหลัก (3)', 'แม่ 6 · 7', 'ท่องและใช้สูตรคูณแม่ 6 และแม่ 7',
    [...mtTablePages([6, 7], 'รู้จัก<b>สูตรคูณ</b> แม่ 6 แม่ 7'), mtBuildWalk(6, 'orange'), mtTryChant(6), mtTryCover(6), mtTryChant(7), mtTryCover(7)], mtTableGame([6, 7])),
  L2X(7, 'หาดแม่แปดเก้า', 'การคูณจำนวนหนึ่งหลักกับจำนวนหนึ่งหลัก (4)', 'แม่ 8 · 9', 'ท่องและใช้สูตรคูณแม่ 8 และแม่ 9 และทบทวนสูตรคูณทั้งหมด',
    [...mtTablePages([8, 9], 'รู้จัก<b>สูตรคูณ</b> แม่ 8 แม่ 9'), mtBuildWalk(9, 'apple'), mtTryChant(8), mtTryCover(8), mtTryChant(9), mtTryCover(9)], mtTableGame([8, 9])),
  L2X(8, 'หาดคูณสิบ', 'การคูณจำนวนหนึ่งหลักกับ 10 20 30 … 90', 'คูณ 10 20 … 90', 'หาผลคูณของจำนวนหนึ่งหลักกับ 10 20 30 … 90',
    [...learnStep('การคูณกับ <b>10 20 30 … 90</b>', 'การคูณกับสิบ ยี่สิบ สามสิบ ถึงเก้าสิบ', [
      { fig: mtRodsSVG(1, 2, 0), name: '20 คือ 2 สิบ', text: 'ไม้ 1 แท่ง = 1 สิบ · 20 = 2 แท่ง' },
      { fig: mtRodsSVG(3, 2, 0), name: '3 × 20 = 3 กลุ่ม กลุ่มละ 2 สิบ', text: 'รวมได้ 6 สิบ = <b>60</b>' },
      { fig: lbig('3 × 2 = 6 → 3 × 20 = 60'), name: 'วิธีลัด', text: 'คูณตัวหน้าด้วยสูตรคูณ แล้ว<b>เติม 0</b> ต่อท้าย' }], 'คูณเลขหน้า 0 ด้วยสูตรคูณ แล้วเติม 0'),
     pexStep('ตัวอย่างทีละขั้น: 4 × 30', 'ตัวอย่างทีละขั้น', [['① 30 คือ', '3 สิบ', mtRodsSVG(1, 3, 0)], ['② 4 กลุ่ม', '4 กลุ่ม กลุ่มละ 3 สิบ', mtRodsSVG(4, 3, 0)], ['③ สูตรคูณ', '4 × 3 = 12 → 12 สิบ', null], ['④ ตอบ', '12 สิบ = <b>120</b>', null]], '4 × 30 = <b>120</b>'),
     T('ลองเอง: เพิ่มกลุ่ม เพิ่มสิบ', 'ลองเอง เพิ่มกลุ่ม เพิ่มสิบ', el => el.append(simMtTens()))],
    () => pkF(MTW_TENS, 5).map(([a, t]) => Q.mtTens({ a, t }))),
  L2X(9, 'หาดตั้งคูณ', 'การคูณจำนวนหนึ่งหลักกับจำนวนสองหลัก โดยการตั้งคูณ (1)', 'ตั้งคูณ (1)', 'หาผลคูณของจำนวนหนึ่งหลักกับจำนวนสองหลักโดยการตั้งคูณ (ไม่มีการทด)',
    [...learnStep('การ<b>ตั้งคูณ</b>', 'การตั้งคูณ', [
      { fig: `<div class="mtcolwrap">${mtColHTML(23, 3, { q: 1 })}</div>`, name: 'ตั้งให้ตรงหลัก', text: 'ตัวคูณหนึ่งหลักอยู่ใต้หลักหน่วย' },
      { fig: mtRodsSVG(3, 2, 3), name: '23 × 3 = 3 กลุ่ม กลุ่มละ 23', text: 'แต่ละกลุ่มมี 2 สิบ กับ 3 หน่วย' },
      { fig: lbig('หลักหน่วย 3 × 3 = 9<br>หลักสิบ 2 × 3 = 6'), name: 'คูณหลักหน่วยก่อน แล้วหลักสิบ', text: 'ได้ 6 สิบ 9 หน่วย = <b>69</b>' }], 'ตั้งตรงหลัก → คูณหลักหน่วย → คูณหลักสิบ'),
     pexStep('ตัวอย่างทีละขั้น: 32 × 3', 'ตัวอย่างทีละขั้น', [['① ดูภาพ', '3 กลุ่ม กลุ่มละ 32 (3 สิบ 2 หน่วย)', mtRodsSVG(3, 3, 2)], ['② หลักหน่วย', '2 × 3 = 6 → เขียน 6', `<div class="mtcolwrap">${mtColHTML(32, 3, { ones: 1 })}</div>`], ['③ หลักสิบ', '3 × 3 = 9 → เขียน 9', `<div class="mtcolwrap">${mtColHTML(32, 3)}</div>`]], '32 × 3 = <b>96</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.mtCol({ a: 41, b: 2 }), 'ถูกต้อง!')))],
    () => pkF(MTW_COL0, 5).map(([a, b]) => Q.mtCol({ a, b }))),
  L2X(10, 'หาดตั้งคูณทด', 'การคูณจำนวนหนึ่งหลักกับจำนวนสองหลัก โดยการตั้งคูณ (2)', 'ตั้งคูณมีทด', 'หาผลคูณโดยการตั้งคูณที่มีการทด และเปรียบเทียบผลคูณ',
    [...learnStep('ตั้งคูณที่มี<b>การทด</b>', 'ตั้งคูณที่มีการทด', [
      { fig: mtRodsSVG(4, 2, 6, { perRow: 4 }), name: '26 × 4: หลักหน่วยได้มาก', text: '6 × 4 = 24 หน่วย → มากกว่า 9' },
      { fig: lbig('24 หน่วย = 2 สิบ 4 หน่วย'), name: 'เขียน 4 แล้ว<b>ทด 2</b> ไปหลักสิบ', text: '' },
      { fig: `<div class="mtcolwrap">${mtColHTML(26, 4, { carry: 1 })}</div>`, name: 'หลักสิบ: คูณแล้วบวกตัวทด', text: '2 × 4 = 8 บวกทด 2 = 10 → ได้ <b>104</b>' }], 'คูณหลักหน่วย → ทด → คูณหลักสิบแล้วบวกตัวทด'),
     pexStep('ตัวอย่างทีละขั้น: 47 × 3', 'ตัวอย่างทีละขั้น', [['① ดูภาพ', '3 กลุ่ม กลุ่มละ 47', mtRodsSVG(3, 4, 7)], ['② หลักหน่วย', '7 × 3 = 21 → เขียน 1 ทด 2', `<div class="mtcolwrap">${mtColHTML(47, 3, { ones: 1, carry: 1 })}</div>`], ['③ หลักสิบ', '4 × 3 = 12 บวกทด 2 = 14 → เขียน 14', `<div class="mtcolwrap">${mtColHTML(47, 3, { carry: 1 })}</div>`]], '47 × 3 = <b>141</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.mtCol({ a: 38, b: 4 }), 'ถูกต้อง!')))],
    () => [...pkF(MTW_COL1, 4).map(([a, b]) => Q.mtCol({ a, b })), ...pkF(MTW_CMP, 2).map(([l, r]) => Q.mtCmp({ l, r }))]),
  L2X(11, 'หาดตัวไม่ทราบค่า', 'การหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การคูณ', 'ตัวไม่ทราบค่า', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์การคูณ',
    [...learnStep('รู้จัก<b>ตัวไม่ทราบค่า</b> □', 'รู้จักตัวไม่ทราบค่า', [
      { fig: lbig('4 × □ = 20'), name: '□ แทนจำนวนที่ยังไม่รู้', text: '4 คูณอะไรได้ 20' },
      { fig: mtHopSVG(4, 5), name: 'นับเพิ่มทีละ 4 จนถึง 20', text: '4, 8, 12, 16, 20 → นับได้ 5 ครั้ง' },
      { fig: lbig('4 × 5 = 20 → □ = 5'), name: 'ตรวจคำตอบ', text: 'แทนค่า □ แล้วคูณดู ได้ 20 จริง ✓' }], 'ใช้สูตรคูณหรือนับเพิ่มจนถึงผลคูณ'),
     pexStep('ตัวอย่างทีละขั้น: □ × 6 = 42', 'ตัวอย่างทีละขั้น', [['① อ่าน', 'อะไรคูณ 6 ได้ 42', lbig('□ × 6 = 42')], ['② ท่องแม่ 6', '6, 12, 18, 24, 30, 36, 42', mtHopSVG(6, 7)], ['③ นับครั้ง', 'เพิ่ม 6 ไป 7 ครั้ง → □ = 7', null], ['④ ตรวจ', '7 × 6 = 42 ✓', mtGroupsSVG(7, 6, 'cookie')]], '□ = <b>7</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.mtUnk({ a: 3, b: 8, pos: 1 }), 'ถูกต้อง!')))],
    () => pkF(MTW_UNK, 5).map(([a, b, pos]) => Q.mtUnk({ a, b, pos }))),
  L2X(12, 'หาดโจทย์คูณ', 'โจทย์ปัญหาการคูณ', 'โจทย์ปัญหา', 'วิเคราะห์โจทย์ปัญหาการคูณ เขียนประโยคสัญลักษณ์ และหาคำตอบ',
    [...learnStep('ขั้นตอน<b>แก้โจทย์ปัญหาการคูณ</b>', 'ขั้นตอนแก้โจทย์ปัญหาการคูณ', [
      { fig: lbig('“…ละ …” เช่น กล่องละ 9 บาท'), name: '① หาคำว่า “ละ”', text: 'บอกว่าแต่ละกลุ่มมีเท่า ๆ กัน' },
      { fig: mtGroupsSVG(6, 3, 'milk', { box: 'bag' }), name: '② วาดภาพ', text: 'กี่กลุ่ม กลุ่มละเท่าไร' },
      { fig: lbig('6 × 9 = 54 · ตอบ 54 บาท'), name: '③ เขียนประโยคการคูณ แล้วตอบพร้อมหน่วย', text: '' }], 'มีหลายกลุ่ม กลุ่มละเท่ากัน → คูณ'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'แม่ซื้อไข่ 4 แผง แผงละ 6 ฟอง แม่ซื้อไข่กี่ฟอง', mtGroupsSVG(4, 6, 'egg', { box: 'bag' })], ['① ถามอะไร', 'ไข่ทั้งหมด', null], ['② กี่กลุ่ม กลุ่มละเท่าไร', '4 แผง แผงละ 6 ฟอง', mtGroupsSVG(4, 6, 'egg', { box: 'bag', run: true })], ['③ ประโยคสัญลักษณ์', '4 × 6 = □ → 24', null]], 'ตอบ <b>24 ฟอง</b>'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.mtStory({ text: 'มีดินสอ 5 กล่อง กล่องละ 8 แท่ง มีดินสอทั้งหมดกี่แท่ง', a: 5, b: 8, unit: 'แท่ง', fig: mtGroupsSVG(5, 8, 'pencil', { box: 'bag' }) }), 'ถูกต้อง!')))],
    () => pkF(MTW_ST, 5).map(s => Q.mtStory({ ...s, fig: s.fig ? s.fig() : null })))
];
/* ด่านพิเศษ: ลานท่องสูตรคูณ — practice any table any time; the quiz pulls the facts the child remembers least */
LESSONS_P2C5.splice(7, 0, { id: 938, bonus: true, place: 'ลานท่องสูตรคูณ', title: 'ด่านพิเศษ: ลานท่องสูตรคูณ', short: 'ท่องสูตรคูณ', tone: 'yellow', learned: true,
  goal: 'ฝึกท่องสูตรคูณแม่ 2 ถึงแม่ 12 ซ้ำได้ทุกวัน ข้อที่ยังจำไม่แม่นจะถูกถามบ่อยขึ้น จนจำได้ทุกข้อ',
  teach: [...learnStep('<b>ลานท่องสูตรคูณ</b> — ฝึกทุกวัน จำได้จริง', 'ลานท่องสูตรคูณ ฝึกทุกวัน จำได้จริง', [
      { fig: lbig('① ท่องตาม'), name: 'ฟังแล้วออกเสียงตาม', text: '“สองหนึ่งสอง สองสองสี่ …” ท่องทีละบรรทัดหรือทั้งแม่' },
      { fig: lbig('② ปิดคำตอบ'), name: 'ซ่อนคำตอบ แล้วนึกให้ได้เอง', text: 'รอบแรกซ่อนครึ่งหนึ่ง รอบสองซ่อนทั้งหมด' },
      { fig: lbig('③ เกมทดสอบไว'), name: 'ข้อที่ตอบผิดจะกลับมาถามอีก', text: 'ตอบถูกบ่อย ๆ ข้อนั้นจะกลายเป็น<b>สีเขียว</b>ในสมุดสูตรคูณ' }], 'ฝึกวันละนิด ทุกวัน แล้วดูสมุดสูตรคูณเป็นสีเขียวทั้งหมด'),
    T('เลือกแม่ที่จะฝึก แล้วเลือกวิธีฝึก', 'เลือกแม่ที่จะฝึก แล้วเลือกวิธีฝึก', el => el.append(mtTrainer()))],
  game: () => { const T2 = range(2, 12); return [Q.mtPop({ facts: mtFacts(T2, 5) }), ...mtFacts(T2, 4).map(([a, b]) => Q.mtFact({ a, b })), Q.mtPop({ facts: mtFacts(T2, 5) }), mtMatchQ(mtUniq(T2, 4)), Q.mtFill({ n: pick(range(3, 9)), ks: range(1, 12), blanks: shuffle(range(2, 12)).slice(0, 4).sort((x, y) => x - y) })]; } });

/* ---------- boss 939: ข้อสอบท้ายบทการคูณ — แต่งใหม่ทั้งหมด ---------- */
const MT_POST = [
  { q: 'จากรูป เขียนเป็นประโยคสัญลักษณ์แสดงการคูณได้อย่างไร', fig: `<div class="p4-fig">${mtGroupsSVG(5, 2, 'star', { box: 'bag' })}</div>`, opts: ['5 × 2 = □', '5 + 2 = □', '10 × 2 = □'], a: 0 },
  { q: '6 + 6 + 6 = □ ตรงกับเรื่องใด', opts: ['จัดดอกไม้แจกันละ 6 ดอก 3 แจกัน มีดอกไม้กี่ดอก', 'จัดดอกไม้แจกันละ 3 ดอก 3 แจกัน มีดอกไม้กี่ดอก', 'จัดดอกไม้แจกันละ 6 ดอก 6 แจกัน มีดอกไม้กี่ดอก'], a: 0 },
  { q: '4 × 7 เขียนให้อยู่ในรูปการบวกได้อย่างไร', opts: ['7 + 7 + 7 + 7', '4 + 7', '4 + 4 + 4 + 4 + 4 + 4 + 4'], a: 0 },
  { q: 'นับไข่ครั้งละ 6 ฟอง 4 ครั้ง จะนับไข่ได้กี่ฟอง', opts: ['10 ฟอง', '24 ฟอง', '28 ฟอง'], a: 1 },
  { q: 'นับดินสอครั้งละ 3 แท่ง ต้องนับกี่ครั้ง จึงจะได้ดินสอ 18 แท่ง', opts: ['5 ครั้ง', '6 ครั้ง', '7 ครั้ง'], a: 1 },
  { q: '2 + 2 + 2 + 2 + 2 = □ ตรงกับเรื่องใดมากที่สุด', opts: ['รถจักรยาน 5 คัน มีล้อทั้งหมดกี่ล้อ', 'รถจักรยาน 2 คัน มีล้อทั้งหมดกี่ล้อ', 'รถจักรยาน 5 คัน มีกระดิ่งกี่อัน'], a: 0 },
  { q: 'ปอนด์นับลูกอม 7 ครั้ง ได้ลูกอมทั้งหมด 35 เม็ด ปอนด์นับลูกอมครั้งละกี่เม็ด', opts: ['4 เม็ด', '5 เม็ด', '6 เม็ด'], a: 1 },
  { q: '5 × 3 เขียนให้อยู่ในรูปการบวกได้อย่างไร', opts: ['3 + 3 + 3 + 3 + 3', '5 × 5 × 5', '5 + 3'], a: 0 },
  { q: 'นับนกครั้งละ 4 ตัว 8 ครั้ง จะนับนกได้ทั้งหมดกี่ตัว', opts: ['28 ตัว', '32 ตัว', '36 ตัว'], a: 1 },
  { q: 'จากรูป เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร', fig: `<div class="p4-fig">${mtGroupsSVG(2, 4, 'bottle', { box: 'bag' })}</div>`, opts: ['2 + 4 = □', '2 × 4 = □', '4 + 4 + 4 = □'], a: 1 }
];
const mtX = (q, r, extra) => { const out = [r]; [...extra, r + 10, r - 1, r + 1].forEach(x => { if (out.length < 4 && x >= 0 && !out.includes(x)) out.push(x); }); return { q, opts: out.map(String), a: 0 }; };
const EXAM_P2C5 = [...MT_POST, ...d6spread([
  mtX('มีมะนาว 6 ถุง ถุงละ 5 ผล มีมะนาวทั้งหมดกี่ผล', 30, [11, 25]), mtX('0 × 8 = ?', 0, [8, 1]), mtX('6 × 6 = ?', 36, [32, 12]), mtX('8 × 7 = ?', 56, [54, 64]), mtX('9 × 3 = ?', 27, [24, 36]),
  mtX('6 × 30 = ?', 180, [36, 160]), mtX('38 × 2 = ?', 76, [66, 616]), mtX('□ × 6 = 48  □ คือจำนวนใด', 8, [7, 42]),
  { q: '63 × 5 … 63 × 7 ควรเติมเครื่องหมายใด', opts: ['<', '>', '='], a: 0 },
  mtX('แม่ซื้อขนม 8 ห่อ ราคาห่อละ 7 บาท แม่ต้องจ่ายเงินกี่บาท', 56, [15, 54])])];
LESSONS_P2C5.push({ id: 939, boss: true, place: 'อ่าวสูตรคูณ', title: 'ด่านบอส: บทที่ 5 การคูณ', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'ตอบคำถามเรื่องการคูณ 20 ข้อ ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P2C5, pass: 10, bossName: 'ปีศาจปลาหมึกสูตรคูณ', bossPal: 'mint', emblem: '×', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกสูตรคูณแล้ว! ท่องสูตรคูณคล่องมาก', loseLine: 'ปีศาจปลาหมึกยังท่องเร็วกว่า กลับไปฝึกที่ลานท่องสูตรคูณแล้วสู้ใหม่นะ!' });
[921, 921, 921, 921, 921, 921, 921, 921, 921, 921, 921, 923, 926, 927, 927, 928, 930, 931, 930, 932].forEach((lv, i) => { if (EXAM_P2C5[i]) EXAM_P2C5[i].lv = lv; });
