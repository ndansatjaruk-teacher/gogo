/* =========================================================
   ม.1 บทที่ 7 อัตราส่วน สัดส่วน และร้อยละ (v244) — prefix rp<span class="rp-sep"></span>ตัวช่วย รูป ชนิดคำถาม และหน้าลงมือทำ
   บทเรียนอยู่ใน m1rl.js (ด่าน 1–10) และ m1rl2.js (ด่าน 11–20 + บอส)
   ใช้ tgScene / tgDrag / tgMission / tgLeft จาก m3t.js (หน้าลาก + ภารกิจ) จึงวางหลัง m3tl.js ใน order.txt
   ทุกหน้าสอน: เด็กลาก/แตะเอง ภาพ ตัวเลข และอัตราส่วนเปลี่ยนพร้อมกัน<span class="rp-sep"></span>ไม่มีปุ่มเพิ่ม/ลด (stepper) หรือ slider
   ========================================================= */
const rpR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const rpPick = a => a[Math.floor(Math.random() * a.length)];
const rpGcd = (a, b) => b ? rpGcd(b, a % b) : Math.abs(a);
const rpLcm = (a, b) => a / rpGcd(a, b) * b;
const rpN = (x, d = 2) => { const v = Math.round(x * 10 ** d) / 10 ** d; return (Object.is(v, -0) ? 0 : v).toLocaleString('en-US', { maximumFractionDigits: d }); };
const rpRat = (...a) => `<span class="num rp-r">${a.map(x => typeof x === 'number' ? rpN(x) : x).join(' : ')}</span>`; /* "3 : 5" */
const rpRT = (...a) => a.map(x => typeof x === 'number' ? rpN(x) : x).join(' : '); /* plain text (choices, boss) */
const rpFq = (n, d) => fqHTML(n, d);
const rpFrac = (n, d) => { const g = rpGcd(n, d), a = n / g, b = d / g; return b === 1 ? String(a) : fqHTML(a, b); }; /* simplified n/d as html */
const rpFracT = (n, d) => { const g = rpGcd(n, d), a = n / g, b = d / g; return b === 1 ? String(a) : `${a}/${b}`; };
const rpSimp = (...a) => { const g = a.reduce((x, y) => rpGcd(x, y)); return a.map(x => x / g); };
const rpNm = (k = 1) => shuffle(MI_NM).slice(0, k);
const rpSay = t => miSay(String(t).replace(/<span class="fq"><i>([^<]*)<\/i><i>([^<]*)<\/i><\/span>/g, ' เศษ $1 ส่วน $2 ').replace(/<[^>]+>/g, ' ').replace(/(\d)\s*:\s*(?=\d)/g, '$1 ต่อ ').replace(/%/g, ' เปอร์เซ็นต์ ').replace(/(\d)\/(\d)/g, '$1 ส่วน $2'));
const rpTF = (text, ok, why) => Q.hTF({ text, ok: !!ok, why });
const RP_C = { o: '#F08A24', b: '#2F8FDB', p: '#E5487A', g: '#2FAF7C', v: '#7C5CE0', y: '#F3C548', ink: '#2B2550' };

/* ---------- icons (svg) ---------- */
const rpIcon = (k, x, y, s = 30, c = RP_C.o) => {
  if (k === 'fish') return `<g transform="translate(${x} ${y}) scale(${s / 30})"><path d="M-13 0 Q-2 -10 9 0 Q-2 10 -13 0 Z" fill="${c}"/><path d="M8 0 L15 -7 L15 7 Z" fill="${c}"/><circle cx="-7" cy="-2" r="1.8" fill="#2B2550"/></g>`;
  if (k === 'fruit') return `<g transform="translate(${x} ${y}) scale(${s / 30})"><circle r="11" cy="2" fill="${c}"/><path d="M0 -9 q5 -6 10 -4 q-4 5 -10 4z" fill="#4CAF50"/><path d="M0 -9 v-4" stroke="#6B4A2B" stroke-width="2"/></g>`;
  if (k === 'box') return `<g transform="translate(${x} ${y}) scale(${s / 30})"><rect x="-12" y="-11" width="24" height="22" rx="3" fill="${c}"/><path d="M-12 -3 h24 M-4 -11 v8" stroke="#fff" stroke-opacity=".6" stroke-width="2"/></g>`;
  if (k === 'cup') return `<g transform="translate(${x} ${y}) scale(${s / 30})"><path d="M-10 -11 h20 l-3 22 h-14 z" fill="${c}"/><path d="M-10 -11 h20" stroke="#fff" stroke-opacity=".7" stroke-width="2"/></g>`;
  if (k === 'pen') return `<g transform="translate(${x} ${y}) scale(${s / 30}) rotate(-35)"><rect x="-3.5" y="-13" width="7" height="21" rx="1.5" fill="${c}"/><path d="M-3.5 8 L0 15 L3.5 8 Z" fill="#F6D7A7"/><path d="M-1 13 L0 15 L1 13 Z" fill="#2B2550"/></g>`;
  if (k === 'book') return `<g transform="translate(${x} ${y}) scale(${s / 30})"><rect x="-10" y="-12" width="20" height="24" rx="2" fill="${c}"/><rect x="-7" y="-12" width="3" height="24" fill="#fff" fill-opacity=".45"/></g>`;
  if (k === 'person') return `<g transform="translate(${x} ${y}) scale(${s / 30})"><circle cy="-7" r="6" fill="${c}"/><path d="M-10 13 q0 -13 10 -13 q10 0 10 13 z" fill="${c}"/></g>`;
  return `<circle cx="${x}" cy="${y}" r="${s * .36}" fill="${c}"/>`; };
/* rows of icons: groups = [{ n, k, c, lab }] (lab on the left, black numbers are not shown — counting is part of the task) */
const rpPic = (groups, o = {}) => { const per = o.per || 10, S = o.s || 32, L = o.lab === false ? 10 : 96; let y = 26, s = '';
  groups.forEach(g => { const rows = Math.ceil(g.n / per); if (o.lab !== false) s += `<text x="8" y="${y + 6 + (rows - 1) * S / 2}" class="rp-lab">${g.lab || ''}</text>`;
    for (let i = 0; i < g.n; i++) s += rpIcon(g.k, L + (i % per) * (S + 4) + S / 2, y + Math.floor(i / per) * (S + 4), S, g.c); y += rows * (S + 4) + 10; });
  return `<svg viewBox="0 0 ${L + per * (S + 4) + 6} ${y}" class="rp-pic" aria-hidden="true">${s}</svg>`; };
/* 10×10 grid with n squares shaded (row by row) */
const rpGrid = (n, c = RP_C.b, sz = 270) => { let s = ''; for (let i = 0; i < 100; i++) s += `<rect x="${(i % 10) * 20 + 1}" y="${Math.floor(i / 10) * 20 + 1}" width="18" height="18" rx="2" fill="${i < n ? c : '#F1EEF8'}"/>`;
  return `<svg viewBox="0 0 202 202" class="rp-grid" style="max-width:${sz}px" aria-hidden="true">${s}</svg>`; };
/* simple html table for game figures: head = [..], rows = [[..], ..] (teach pages avoid <tr>: teachGate treats rows as explore items) */
const rpTbl = (head, rows, o = {}) => `<table class="rp-tb${o.tr ? ' tr' : ''}">${head ? `<tr>${head.map(x => `<th>${x}</th>`).join('')}</tr>` : ''}${rows.map(r => `<tr>${r.map((x, i) => i === 0 && o.th ? `<th>${x}</th>` : `<td>${typeof x === 'number' ? rpN(x) : x}</td>`).join('')}</tr>`).join('')}</table>`;
/* transposed table (x row / y row) for direct / inverse proportion */
const rpXY = (xl, yl, xs, ys) => rpTbl(null, [[xl, ...xs], [yl, ...ys]], { th: true, tr: true });

/* ---------- answer pad for ratios "a : b" or "a : b : c" ----------
   want = [a, b(, c)]<span class="rp-sep"></span>mode 'eq' = any equal ratio is right<span class="rp-sep"></span>'low' = must be in lowest terms<span class="rp-sep"></span>'exact' = these numbers exactly */
function rpAns(ctx, want, o = {}) {
  const mode = o.mode || 'exact', n = want.length; let val = '';
  const slot = h('div', { class: 'ans-slot num rp-slot' }, '?'), msg = h('div', { class: 'pad-msg' });
  const show = () => { slot.textContent = val === '' ? '?' : val.replace(/:/g, ' : '); slot.classList.toggle('filled', val !== ''); };
  const put = k => { msg.textContent = '';
    if (k === ':') { if (!/\d$/.test(val) || (val.match(/:/g) || []).length >= n - 1) { msg.textContent = n === 3 ? 'ใส่ตัวเลข แล้วกด : คั่น (สามจำนวน)' : 'ใส่จำนวนแรก กด : แล้วใส่จำนวนหลัง'; return; } val += ':'; }
    else if (k === '.') { const part = val.split(':').pop(); if (!/\d$/.test(val) || part.includes('.')) { msg.textContent = 'ใส่ . หลังตัวเลข'; return; } val += '.'; }
    else { if (val.replace(/\D/g, '').length >= 9) return; val += k; }
    sfx.tap(); show(); };
  const submit = () => { if (wrap.classList.contains('done')) return; const p = val.split(':');
    if (p.length !== n || p.some(x => !/^\d+(\.\d+)?$/.test(x))) { msg.textContent = n === 3 ? 'ตอบให้ครบสามจำนวน เช่น 2 : 3 : 5' : 'ตอบให้ครบสองจำนวน เช่น 2 : 3'; return; }
    const v = p.map(Number), prop = v.every((x, i) => Math.abs(x * want[0] - want[i] * v[0]) < 1e-9) && v.every(x => x > 0), lowest = v.every(Number.isInteger) && v.reduce((a, b) => rpGcd(a, b)) === 1;
    const ok = mode === 'eq' ? prop : mode === 'low' ? prop && lowest : v.every((x, i) => Math.abs(x - want[i]) < 1e-9);
    const rev = !ok && n === 2 && want[0] !== want[1] && Math.abs(v[0] * want[0] - v[1] * want[1]) < 1e-9; /* ตอบกลับลำดับ (b : a) */
    const why = rev ? `<b>ลำดับสลับกัน</b> — จำนวนแรกคือสิ่งที่พูดถึงก่อนคำว่า "ต่อ"${o.hint ? '<span class="rp-sep"></span>' + o.hint : ''}` : !ok && prop && mode === 'low' ? `เท่ากันแล้ว แต่<b>ยังไม่เป็นอัตราส่วนอย่างต่ำ</b> — หารต่อได้อีก` : !ok && prop && mode === 'exact' ? `อัตราส่วนเท่ากันแล้ว แต่โจทย์ถามจำนวนตามที่กำหนด${o.hint ? '<span class="rp-sep"></span>' + o.hint : ''}` : o.hint;
    if (ok) wrap.classList.add('done'); msg.textContent = ''; ctx.check(ok, why); if (!ok && !wrap.classList.contains('revealed')) { val = ''; show(); } };
  const key = (lab, k, cls = '') => h('button', { class: 'btn ' + cls, 'aria-label': k === ':' ? 'ต่อ' : k === '.' ? 'จุดทศนิยม' : String(lab), onclick: e => { e.stopPropagation(); put(k); } }, lab);
  const kp = h('div', { class: 'keypad mi-kp rp-kp' }, key(1, '1'), key(2, '2'), key(3, '3'), h('button', { class: 'btn', 'aria-label': 'ลบตัวเลข', onclick: e => { e.stopPropagation(); sfx.tap(); val = val.slice(0, -1); msg.textContent = ''; show(); } }, icon('left')),
    key(4, '4'), key(5, '5'), key(6, '6'), key(':', ':', 'sym'), key(7, '7'), key(8, '8'), key(9, '9'), key('.', '.', 'sym'), key(0, '0'), h('button', { class: 'btn primary ok2', 'aria-label': 'ส่งคำตอบ', onclick: e => { e.stopPropagation(); submit(); } }, icon('check')));
  const wrap = h('div', { class: 'ans ia mi-ans rp-ans' }, h('div', { class: 'mi-ansrow' }, o.pre ? h('span', { class: 'cap rp-pre', html: o.pre }) : null, slot), kp, msg);
  wrap.reveal = () => { val = want.map(x => rpN(x)).join(':').replace(/,/g, ''); show(); wrap.classList.add('done', 'revealed'); };
  wrap.ansText = rpRT(...want); return wrap;
}

/* ---------- question types (story + picture on the left, answer on the right — like tgOpt/tgNum) ---------- */
const rpSaySt = (story, q) => rpSay((story ? story + ' ' : '') + q);
const rpMeta = (pre, { sig, q, base, cap, diff }) => ({ __sig: pre + ' ' + (sig || q), ...(base ? { __base: base, __baseCap: cap || 2 } : {}), ...(diff != null ? { __diff: diff } : {}) });
Q.rpOpt = ({ story, q, fig, opts, right, hint, sig, base, cap, diff }) => ({ prompt: q, say: rpSaySt(story, q), ...rpMeta('rpo', { sig: sig || q + right, q, base, cap, diff }),
  mount(bd, ctx) { const ch = choices(ctx, shuffle(opts.map(o => ({ value: String(o), label: String(o) }))), String(right), { hint }); ch.classList.add('tg-opts', 'rp-opts'); if (opts.some(o => String(o).replace(/<[^>]+>/g, '').length > 9)) ch.querySelectorAll('.opt').forEach(x => x.classList.add('txt'));
    bd.append(h('div', { class: fig || story ? 'tg-qrow' : 'colstack' }, tgLeft(story, fig), ch)); } });
Q.rpNum = ({ story, q, fig, a, unit, hint, sig, base, cap, diff }) => ({ prompt: q, say: rpSaySt(story, q), ...rpMeta('rpn', { sig, q, base, cap, diff }),
  mount(bd, ctx) { bd.append(h('div', { class: fig || story ? 'tg-qrow' : 'colstack' }, tgLeft(story, fig), miAns(ctx, a, { unit, hint }))); } });
Q.rpRat = ({ story, q, fig, a, mode, pre, hint, sig, base, cap, diff }) => ({ prompt: q, say: rpSaySt(story, q), ...rpMeta('rpr', { sig, q, base, cap, diff }),
  mount(bd, ctx) { bd.append(h('div', { class: fig || story ? 'tg-qrow' : 'colstack' }, tgLeft(story, fig), rpAns(ctx, a, { mode, pre, hint }))); } });
/* wrong choices for a number answer: the usual slips, never equal to the answer */
const rpWrong = (a, cands, k = 3) => { const out = []; cands.forEach(c => { const v = Math.round(c * 100) / 100; if (v > 0 && Math.abs(v - a) > 1e-9 && !out.some(o => Math.abs(o - v) < 1e-9)) out.push(v); }); let d = 1; while (out.length < k) { const v = a + d * (out.length % 2 ? -1 : 1) * Math.max(1, Math.round(a / 10)); if (v > 0 && !out.includes(v) && v !== a) out.push(v); d++; } return out.slice(0, k); };
const rpNumOpts = (a, cands, unit = '') => [a, ...rpWrong(a, cands)].map(v => rpN(v) + unit);

/* =========================================================
   หน้าลงมือทำ (teach)
   ========================================================= */
/* 1 · compare two stacks: subtract (more by) vs divide (times) */
function rpSimCmp(a = 4) {
  const W = 560, H = 330, B = 300, U = 22;
  const stack = (x, n, c, lab) => { let s = ''; for (let i = 0; i < n; i++) s += rpIcon('box', x, B - U / 2 - i * U, 24, c); return s + `<text x="${x}" y="${B + 22}" class="rp-sv" text-anchor="middle">${lab}</text>`; };
  return tgScene({ W, H, st: { b: 6 }, cap: '<b>ลากกองลังสีส้มขึ้น–ลง</b> แล้วเทียบกับกองสีฟ้า 2 แบบ: <b>ลบ</b> (มากกว่ากี่ลัง) กับ <b>หาร</b> (เป็นกี่เท่า)',
    missions: [['ส้มมากกว่าฟ้า 4 ลัง', s => s.b === a + 4], ['ส้มเป็น 3 เท่าของฟ้า', s => s.b === a * 3], ['ส้มเป็นครึ่งหนึ่งของฟ้า', s => s.b * 2 === a]],
    svg: s => `<rect x="20" y="${B}" width="${W - 40}" height="4" rx="2" fill="#CFC7E6"/>${stack(170, a, RP_C.b, `ฟ้า ${a} ลัง`)}${stack(390, s.b, RP_C.o, `ส้ม ${s.b} ลัง`)}${tgHandle(390, B - s.b * U - 6, RP_C.o)}`,
    drag: p => ({ b: Math.max(1, Math.min(12, Math.round((B - p[1]) / U))) }),
    info: s => { const d = s.b - a; return `ลบ: ${d === 0 ? 'เท่ากันพอดี' : d > 0 ? `ส้ม<b>มากกว่า</b>ฟ้า <b class="num">${d}</b> ลัง` : `ส้ม<b>น้อยกว่า</b>ฟ้า <b class="num">${-d}</b> ลัง`}<span class="rp-sep"></span>หาร: ส้มเป็น <b class="num">${rpFrac(s.b, a)}</b> เท่าของฟ้า`; } });
}
/* 2 · tap fish to colour them: order of a ratio + part : whole */
function rpSimFish() {
  const N = 12, wrap = tgWrap(), fig = h('div', { class: 'tg-board rp-tap ia' }), out = fNote2(), col = Array.from({ length: N }, (_, i) => i < 6);
  const mis = tgMission([['ส้ม : ฟ้า = 5 : 7', s => s.a === 5], ['ฟ้า : ส้ม = 3 : 9', s => s.a === 9], ['ส้ม : ทั้งหมด = 4 : 12', s => s.a === 4]], wrap);
  const draw = () => { const a = col.filter(Boolean).length; let s = ''; col.forEach((o, i) => { s += `<g class="rp-hit" data-i="${i}"><rect x="${(i % 4) * 120 + 8}" y="${Math.floor(i / 4) * 70 + 6}" width="112" height="62" rx="14" fill="${o ? '#FFF1E2' : '#E6F2FD'}"/>${rpIcon('fish', (i % 4) * 120 + 64, Math.floor(i / 4) * 70 + 37, 56, o ? RP_C.o : RP_C.b)}</g>`; });
    fig.innerHTML = `<svg viewBox="0 0 488 220" class="tg-scene rp-fish" aria-hidden="true">${s}</svg>`;
    fig.querySelectorAll('.rp-hit').forEach(g => g.onclick = e => { e.stopPropagation(); col[+g.dataset.i] = !col[+g.dataset.i]; sfx.pop(2); draw(); });
    out.innerHTML = `ส้ม : ฟ้า = ${rpRat(a, N - a)} <span class="rp-sep"></span> ฟ้า : ส้ม = ${rpRat(N - a, a)} <span class="rp-sep"></span> ส้ม : ทั้งหมด = ${rpRat(a, N)}`; mis.check({ a }); };
  draw(); wrap.append(h('div', { class: 'cap', html: '<b>แตะปลาเพื่อเปลี่ยนสี</b> (ส้ม ↔ ฟ้า) — สังเกตว่าอัตราส่วนเปลี่ยนตามลำดับที่พูด' }), mis.el, fig, out); return wrap;
}
/* 3 · build a ratio by tapping the first quantity, then the second (rounds) */
function rpSimPick(rounds) {
  const wrap = tgWrap(), cap = h('div', { class: 'cap rp-pcap' }), box = h('div', { class: 'rp-grps' }), out = fNote2(), dots = h('div', { class: 'tg-mis' }, ...rounds.map((_, i) => h('span', { class: 'tg-mi' }, 'ข้อ ' + (i + 1)))); let r = 0, first = null;
  const show = () => { const R = rounds[r]; first = null; cap.innerHTML = `แตะ<b>จำนวนแรก</b> แล้วแตะ<b>จำนวนหลัง</b>: ${R.q}`; box.innerHTML = ''; out.innerHTML = `${rpRat('?', '?')}`;
    R.g.forEach((g, i) => { const b = h('button', { class: 'rp-grp ia', html: (g.pic || `<b class="num rp-big">${rpN(g.n)}</b>`) + `<span>${g.lab}</span>` });
      b.onclick = e => { e.stopPropagation(); if (box.classList.contains('busy')) return;
        if (first == null) { if (i !== R.a) { sfx.no(); out.innerHTML = `ยังไม่ใช่ — จำนวนแรกคือสิ่งที่อยู่<b>ก่อนคำว่า "ต่อ"</b>`; return; } first = i; b.classList.add('on1'); sfx.pop(2); out.innerHTML = `${rpRat(R.g[i].n, '?')}`; return; }
        if (i !== R.b) { sfx.no(); out.innerHTML = `${rpRat(R.g[first].n, '?')} — จำนวนหลังคือสิ่งที่อยู่<b>หลังคำว่า "ต่อ"</b>`; return; }
        b.classList.add('on2'); sfx.ok(); dots.children[r].classList.add('ok'); out.innerHTML = `${R.say || ''} ${rpRat(R.g[R.a].n, R.g[R.b].n)}${R.note ? '<span class="rp-sep"></span>' + R.note : ''}`; box.classList.add('busy');
        setTimeout(() => { box.classList.remove('busy'); r++; if (r < rounds.length) show(); else { cap.innerHTML = '<b>ครบทุกข้อแล้ว</b> — อัตราส่วนเขียนตามลำดับที่โจทย์พูดเสมอ'; teachDone(wrap); } }, 1500); };
      box.append(b); }); };
  show(); wrap.append(cap, dots, box, out); return wrap;
}
/* 4 · drink recipe: drag the syrup column and the water column — equal ratios give the same colour */
function rpSimMix(a = 2, b = 3) {
  const W = 600, H = 360, B = 330, U = 25, mix = (s, w) => { const f = s / (s + w), c1 = [229, 72, 122], c0 = [207, 239, 255]; return `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * Math.min(1, f * 1.6))).join(',')})`; };
  const col = (x, n, c, lab) => { let s = ''; for (let i = 0; i < n; i++) s += rpIcon('cup', x, B - U / 2 - i * U, 30, c); return s + `<text x="${x}" y="${B + 24}" class="rp-sv" text-anchor="middle">${lab}</text>`; };
  const jug = (x, c, lab) => `<path d="M${x - 46} 150 h92 l-8 150 h-76 z" fill="${c}" stroke="#2B2550" stroke-width="3"/><path d="M${x + 46} 170 q22 0 22 30 q0 30 -26 32" fill="none" stroke="#2B2550" stroke-width="3"/><text x="${x}" y="${B + 24}" class="rp-sv" text-anchor="middle">${lab}</text>`;
  return tgScene({ W, H, st: { s: a, w: b }, cap: `สูตรน้ำหวาน <b>น้ำหวาน : น้ำ = ${a} : ${b}</b> — <b>ลากกองแก้วสีชมพู</b> (น้ำหวาน) และ <b>กองแก้วสีฟ้า</b> (น้ำ) ขึ้น–ลง แล้วดูสีในเหยือก`,
    missions: [[`ผสม ${2 * a} : ${2 * b}`, s => s.s === 2 * a && s.w === 2 * b], [`ผสม ${3 * a} : ${3 * b}`, s => s.s === 3 * a && s.w === 3 * b], [`ผสม ${4 * a} : ${4 * b}`, s => s.s === 4 * a && s.w === 4 * b]],
    svg: s => `<rect x="10" y="${B}" width="${W - 20}" height="4" rx="2" fill="#CFC7E6"/>${col(70, s.s, RP_C.p, 'น้ำหวาน')}${col(170, s.w, '#7FC4F5', 'น้ำ')}${tgHandle(70, B - s.s * U - 8, RP_C.p)}${tgHandle(170, B - s.w * U - 8, RP_C.b)}${jug(330, mix(a, b), `สูตร ${a} : ${b}`)}${jug(500, mix(s.s, s.w), 'ของเรา')}`,
    drag: (p, s) => { const n = Math.max(1, Math.min(12, Math.round((B - p[1]) / U))); return p[0] < 120 ? { ...s, s: Math.min(n, 8) } : p[0] < 240 ? { ...s, w: n } : null; },
    info: s => { const eq = s.s * b === s.w * a; return `น้ำหวาน : น้ำ = ${rpRat(s.s, s.w)} ${eq ? `= ${rpRat(a, b)} ✓ <b>สีเท่าสูตรเดิม</b> (คูณ/หารทั้งสองจำนวนด้วย ${rpFrac(s.s, a)} เท่ากัน)` : `≠ ${rpRat(a, b)} → สี<b>${s.s * b > s.w * a ? 'เข้มกว่า' : 'อ่อนกว่า'}</b>สูตรเดิม`}`; } });
}
/* 5 · lowest terms: tap how many equal groups — the most groups gives the lowest terms */
function rpSimGroup(a = 12, b = 18) {
  const wrap = tgWrap(), box = h('div', { class: 'rp-gbox' }), out = fNote2(), st = { k: 1, bad: false };
  const mis = tgMission([['ลองแบ่ง 4 กลุ่ม', s => s.bad], ['แบ่งได้ 2 กลุ่ม', s => s.two], ['แบ่งได้มากที่สุด', s => s.k === rpGcd(a, b)]], wrap);
  const draw = k => { box.innerHTML = ''; for (let g = 0; g < k; g++) { const ra = a / k, rb = b / k, per = Math.min(6, Math.max(ra, rb)); let s = ''; for (let i = 0; i < ra; i++) s += `<circle cx="${10 + (i % per) * 16}" cy="${10 + Math.floor(i / per) * 16}" r="6.5" fill="${RP_C.p}"/>`;
      const off = Math.ceil(ra / per) * 16 + 4; for (let i = 0; i < rb; i++) s += `<circle cx="${10 + (i % per) * 16}" cy="${off + 10 + Math.floor(i / per) * 16}" r="6.5" fill="${RP_C.b}"/>`;
      box.append(h('div', { class: 'rp-gp', html: `<svg viewBox="0 0 ${per * 16 + 4} ${off + Math.ceil(rb / per) * 16 + 4}" aria-hidden="true">${s}</svg>` })); } };
  const chips = h('div', { class: 'rp-chips' }, ...[2, 3, 4, 5, 6].map(k => h('button', { class: 'btn sm rp-chip', onclick: e => { e.stopPropagation(); chips.querySelectorAll('.rp-chip').forEach(c => c.classList.toggle('on', c === e.currentTarget));
    if (a % k || b % k) { st.bad = true; sfx.no(); out.innerHTML = `แบ่ง ${k} กลุ่มเท่า ๆ กันไม่ได้ — ${a % k ? a : b} ÷ ${k} ไม่ลงตัว`; mis.check(st); return; }
    st.k = k; if (k === 2) st.two = true; draw(k); sfx.pop(k); out.innerHTML = `${rpRat(a, b)} = ${rpRat(`${a} ÷ ${k}`, `${b} ÷ ${k}`)} = ${rpRat(a / k, b / k)}${k === rpGcd(a, b) ? ` ← <b>อัตราส่วนอย่างต่ำ</b> (${k} คือ ห.ร.ม. ของ ${a} กับ ${b})` : '<span class="rp-sep"></span>ยังแบ่งต่อได้อีกไหม?'}`; mis.check(st); } }, `${k} กลุ่ม`)));
  draw(1); out.innerHTML = `ลูกปัดชมพู : ลูกปัดฟ้า = ${rpRat(a, b)}`;
  wrap.append(h('div', { class: 'cap', html: `<b>แตะจำนวนกลุ่ม</b> เพื่อแบ่งลูกปัดเป็นกลุ่มที่เหมือนกันทุกกลุ่ม — หนึ่งกลุ่มคืออัตราส่วนที่เท่ากัน` }), mis.el, chips, box, out); return wrap;
}
/* 6 · two ratios a:b and b:c — drag each b-bar until the b's match → a : b : c */
function rpSimChain(r1 = [2, 3], r2 = [4, 5]) {
  const W = 600, H = 290, X0 = 40, U = 17, Y1 = 66, Y2 = 196, M = 8, M2 = Math.floor((W - X0 - 40) / (Math.max(...r2) * U));
  const bar = (y, n, c, lab, hd) => `<text x="${X0 - 12}" y="${y + 15}" class="rp-sv" text-anchor="end">${lab}</text><rect x="${X0}" y="${y}" width="${n * U}" height="22" rx="5" fill="${c}"/>${Array.from({ length: n - 1 }, (_, i) => `<path d="M${X0 + (i + 1) * U} ${y} v22" stroke="#fff" stroke-opacity=".55"/>`).join('')}<text x="${X0 + n * U + 10}" y="${y + 16}" class="rp-sv">${n}</text>${hd ? tgHandle(X0 + n * U, y + 11, c) : ''}`;
  return tgScene({ W, H, st: { k1: 1, k2: 1 }, cap: `${rpRat('a', 'b')} = ${rpRat(...r1)} และ ${rpRat('b', 'c')} = ${rpRat(...r2)} — <b>ลากปลายแถบ b ของแต่ละแถว</b> (คูณทั้งคู่ด้วยจำนวนเดียวกัน) ให้ b ยาวเท่ากัน`,
    missions: [[`b เท่ากันเป็น ${rpLcm(r1[1], r2[0])}`, s => s.k1 * r1[1] === rpLcm(r1[1], r2[0]) && s.k2 * r2[0] === rpLcm(r1[1], r2[0])], [`b เท่ากันเป็น ${2 * rpLcm(r1[1], r2[0])}`, s => s.k1 * r1[1] === 2 * rpLcm(r1[1], r2[0]) && s.k2 * r2[0] === 2 * rpLcm(r1[1], r2[0])]],
    svg: s => `${bar(Y1 - 30, s.k1 * r1[0], RP_C.p, 'a')}${bar(Y1, s.k1 * r1[1], RP_C.b, 'b', 1)}${bar(Y2, s.k2 * r2[0], RP_C.b, 'b', 1)}${bar(Y2 + 30, s.k2 * r2[1], RP_C.g, 'c')}<text x="${X0}" y="${Y1 + 52}" class="rp-sm">แถวที่ 1 คูณด้วย ${s.k1}</text><text x="${X0}" y="${Y2 - 12}" class="rp-sm">แถวที่ 2 คูณด้วย ${s.k2}</text>${s.k1 * r1[1] === s.k2 * r2[0] ? `<path d="M${X0 + s.k1 * r1[1] * U} ${Y1 + 26} V${Y2 - 4}" stroke="${RP_C.g}" stroke-width="3" stroke-dasharray="6 5"/>` : ''}`,
    drag: (p, s) => p[1] < (Y1 + Y2) / 2 + 10 ? { ...s, k1: Math.max(1, Math.min(M, Math.round((p[0] - X0) / (r1[1] * U)))) } : { ...s, k2: Math.max(1, Math.min(M2, Math.round((p[0] - X0) / (r2[0] * U)))) },
    info: s => { const A = [s.k1 * r1[0], s.k1 * r1[1]], C = [s.k2 * r2[0], s.k2 * r2[1]]; return A[1] === C[0] ? `b เท่ากันแล้ว → a : b : c = ${rpRat(A[0], A[1], C[1])}${rpGcd(rpGcd(A[0], A[1]), C[1]) > 1 ? ` = ${rpRat(...rpSimp(A[0], A[1], C[1]))}` : ''}` : `a : b = ${rpRat(...A)}<span class="rp-sep"></span>b : c = ${rpRat(...C)} → b ยังไม่เท่ากัน (${A[1]} กับ ${C[0]})`; } });
}
/* 7 · dealing by a ratio: each round gives a to one side and b to the other */
function rpSimDeal(total = 35, a = 3, b = 4, la = 'พี่', lb = 'น้อง') {
  const wrap = tgWrap(), out = fNote2(), pool = h('div', { class: 'rp-pool' }), A = h('div', { class: 'rp-bin' }), B2 = h('div', { class: 'rp-bin' }); let r = 0;
  const dots = (n, c) => `<svg viewBox="0 0 ${Math.min(n, 10) * 18 + 4} ${Math.max(1, Math.ceil(n / 10)) * 18 + 4}" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<circle cx="${11 + (i % 10) * 18}" cy="${11 + Math.floor(i / 10) * 18}" r="7.5" fill="${c}"/>`).join('')}</svg>`;
  const draw = () => { const left = total - r * (a + b); pool.innerHTML = `<b>ขนมที่เหลือ ${left} ชิ้น</b>${left ? dots(left, RP_C.y) : ''}`; A.innerHTML = `<b>${la} ${a * r} ชิ้น</b>${r ? dots(a * r, RP_C.o) : ''}`; B2.innerHTML = `<b>${lb} ${b * r} ชิ้น</b>${r ? dots(b * r, RP_C.b) : ''}`; };
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); r++; draw(); sfx.pop(r); out.innerHTML = `รอบที่ ${r}: ${la} ${a} ชิ้น ${lb} ${b} ชิ้น (รอบละ ${a + b} ชิ้น)`;
    if (total - r * (a + b) <= 0) { btn.remove(); sfx.ok(); out.innerHTML = `แจก <b>${r} รอบ</b> รอบละ ${a} + ${b} = ${a + b} ชิ้น → ${total} ÷ ${a + b} = ${r}<span class="rp-sep"></span>${la} ${a} × ${r} = <b>${a * r}</b><span class="rp-sep"></span>${lb} ${b} × ${r} = <b>${b * r}</b>`; teachDone(wrap); } } }, icon('right'), 'แจกรอบต่อไป');
  draw(); out.innerHTML = `แบ่งขนม ${total} ชิ้น ให้ ${la} : ${lb} = ${rpRat(a, b)}`;
  wrap.append(h('div', { class: 'cap', html: `แจกทีละรอบ: ทุกรอบ ${la}ได้ <b>${a}</b> ชิ้น ${lb}ได้ <b>${b}</b> ชิ้น — อัตราส่วนจึงเป็น ${a} : ${b} ตลอด` }), h('div', { class: 'rp-deal' }, A, pool, B2), btn, out); return wrap;
}
/* 8 · proportion balance: drag d on the number strip until a/b = c/d (cross products equal) */
function rpSimBalance(rounds = [[3, 4, 6], [2, 5, 6], [4, 6, 10]]) {
  const wrap = tgWrap(), fig = h('div', { class: 'tg-board ia' }), out = fNote2(), W = 620, H = 330, X0 = 50, SX = 26, LY = 300; let r = 0, d = 3;
  const mis = tgMission(rounds.map(([a, b, c], i) => [`${a} : ${b} = ${c} : ?`, s => s.ok > i]), wrap); let okN = 0;
  const next = h('button', { class: 'btn sm rp-next', style: { visibility: 'hidden' }, onclick: e => { e.stopPropagation(); if (r < rounds.length - 1) { r++; d = 3; next.style.visibility = 'hidden'; draw(); } } }, 'ข้อต่อไป');
  const draw = () => { const [a, b, c] = rounds[r], L = a / b, R = c / d, t = Math.max(-14, Math.min(14, (R - L) * 30)), cx = 310, cy = 120, dx = 160 * Math.cos(t * Math.PI / 180), dy = 160 * Math.sin(t * Math.PI / 180);
    const pan = (x, y, n, m) => `<path d="M${x - 62} ${y + 12} h124 l-14 26 h-96 z" fill="#FFF6D6" stroke="#2B2550" stroke-width="2.5"/><text x="${x}" y="${y - 30}" class="rp-fr" text-anchor="middle">${n}</text><path d="M${x - 22} ${y - 22} h44" stroke="#2B2550" stroke-width="3"/><text x="${x}" y="${y}" class="rp-fr" text-anchor="middle">${m}</text>`;
    let s = `<path d="M${cx} ${cy + 6} L${cx - 26} 250 h52 z" fill="#CFC7E6"/><path d="M${cx - dx} ${cy - dy} L${cx + dx} ${cy + dy}" stroke="#2B2550" stroke-width="6" stroke-linecap="round"/>${pan(cx - dx, cy - dy + 40, a, b)}${pan(cx + dx, cy + dy + 40, c, d)}`;
    s += `<path d="M${X0} ${LY} h${SX * 20}" stroke="#2B2550" stroke-width="2"/>`; for (let i = 1; i <= 20; i++) s += `<path d="M${X0 + i * SX} ${LY - 6} v12" stroke="#2B2550" stroke-width="1.5"/>${i % 2 === 0 || i === 1 ? `<text x="${X0 + i * SX}" y="${LY + 24}" class="rp-sm" text-anchor="middle">${i}</text>` : ''}`;
    s += tgHandle(X0 + d * SX, LY, RP_C.o); fig.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="tg-scene" aria-hidden="true">${s}</svg>`;
    const ok = a * d === b * c; out.innerHTML = `คูณไขว้: ${a} × ${d} = <b class="num">${a * d}</b> ${ok ? '=' : '≠'} ${b} × ${c} = <b class="num">${b * c}</b> → ${ok ? `<b>สมดุล!</b> ${rpRat(a, b)} = ${rpRat(c, d)} เป็นสัดส่วน` : `ยังไม่เป็นสัดส่วน (ตาชั่งเอียง)`}`;
    if (ok && okN <= r) { okN = r + 1; sfx.ok(); mis.check({ ok: okN }); if (r < rounds.length - 1) next.style.visibility = 'visible'; } };
  tgDrag(fig, p => { const n = Math.max(1, Math.min(20, Math.round((p[0] - X0) / SX))); if (n !== d) { d = n; draw(); } });
  draw(); wrap.append(h('div', { class: 'cap', html: '<b>ลากจุดสีส้มบนเส้นจำนวน</b> เพื่อเลือกตัวส่วนของจานขวา — ตาชั่งจะสมดุลเมื่ออัตราส่วนทั้งสองเท่ากัน' }), mis.el, h('div', { class: 'tg-row' }, fig, next), out); return wrap;
}
/* 9 · cross multiplication: tap the two numbers on each diagonal */
function rpSimCross(a = 'x', b = 12, c = 5, d = 4) {
  const wrap = tgWrap(), out = fNote2(), eq = h('div', { class: 'rp-eqs' }), vals = [a, b, c, d], pairs = [[0, 3], [1, 2]], got = new Set(); let sel = null;
  const tiles = vals.map((v, i) => h('button', { class: 'rp-tile ia' + (v === 'x' ? ' x' : ''), html: `<b class="num">${v}</b>` }));
  const fr = (i, j) => h('div', { class: 'rp-frc' }, tiles[i], h('i'), tiles[j]);
  tiles.forEach((t, i) => t.onclick = e => { e.stopPropagation(); if (got.size === 2) return; if (sel == null) { sel = i; t.classList.add('sel'); sfx.tap(); return; }
    const p = [sel, i].sort(), k = pairs.findIndex(q => q[0] === p[0] && q[1] === p[1]); tiles[sel].classList.remove('sel');
    if (k < 0) { sfx.no(); out.innerHTML = sel === i ? 'แตะอีกตัวหนึ่ง' : 'ยังไม่ใช่ — คูณ<b>ไขว้</b> คือคูณตัวเลขที่อยู่<b>แนวทแยง</b> (ตัวเศษข้างหนึ่ง กับตัวส่วนอีกข้างหนึ่ง)'; sel = null; return; }
    sel = null; if (got.has(k)) return; got.add(k); p.forEach(j => tiles[j].classList.add('d' + k)); sfx.pop(got.size + 2);
    out.innerHTML = `ทแยงที่ ${got.size}: ${vals[pairs[k][0]]} × ${vals[pairs[k][1]]}`;
    if (got.size === 2) { const L = `${d} × x`, R = `${b} × ${c}`; eq.innerHTML = `<div>${L} = ${R}</div><div>${d}x = ${b * c}</div><div>x = ${b * c} ÷ ${d} = <b>${b * c / d}</b></div>`; out.innerHTML = `ผลคูณไขว้เท่ากันเสมอในสัดส่วน → แก้สมการได้ <b>x = ${b * c / d}</b><span class="rp-sep"></span>ตรวจ: ${rpRat(b * c / d, b)} = ${rpRat(c, d)} ✓`; sfx.ok(); teachDone(wrap); } });
  out.innerHTML = 'แตะตัวเลขสองตัวที่อยู่<b>แนวทแยง</b>เดียวกัน';
  wrap.append(h('div', { class: 'cap', html: `สัดส่วน ${fqHTML('x', b)} = ${fqHTML(c, d)} — <b>แตะเป็นคู่ตามแนวทแยง</b> ทั้งสองแนว` }), h('div', { class: 'tg-row rp-crow' }, fr(0, 1), h('b', { class: 'rp-eqs-op' }, '='), fr(2, 3), eq), out); return wrap;
}
/* 10 · direct proportion: drag the number of pens — table and straight-line graph build together */
function rpSimDirect(k = 12) {
  const W = 620, H = 330, X0 = 60, Y0 = 290, SX = 27, SY = 2.1;
  return tgScene({ W, H, st: { n: 1, seen: [1] }, cap: `ปากกาด้ามละ ${k} บาท — <b>ลากจุดบนกราฟ</b> ไปทางซ้าย–ขวา เพื่อเปลี่ยนจำนวนปากกา`,
    missions: [['ซื้อ 3 ด้าม', s => s.seen.includes(3)], ['ซื้อเพิ่มเป็น 2 เท่า (6 ด้าม)', s => s.seen.includes(3) && s.seen.includes(6)], ['ซื้อ 10 ด้าม', s => s.seen.includes(10)]],
    svg: s => { let g = `<path d="M${X0} ${Y0} h${SX * 10 + 20} M${X0} ${Y0} v-${k * 10 * SY + 20}" stroke="#2B2550" stroke-width="2"/>`;
      for (let i = 1; i <= 10; i++) g += `<text x="${X0 + i * SX}" y="${Y0 + 20}" class="rp-sm" text-anchor="middle">${i}</text>`; for (let v = 20; v <= k * 10; v += 20) g += `<text x="${X0 - 8}" y="${Y0 - v * SY + 5}" class="rp-sm" text-anchor="end">${v}</text><path d="M${X0} ${Y0 - v * SY} h${SX * 10}" stroke="#E8E2F3"/>`;
      g += `<path d="M${X0} ${Y0} L${X0 + SX * 10} ${Y0 - k * 10 * SY}" stroke="${RP_C.g}" stroke-width="2.5" stroke-dasharray="7 6"/><text x="${X0 + SX * 10 + 14}" y="${Y0 + 6}" class="rp-sm">ด้าม</text><text x="${X0}" y="${Y0 - k * 10 * SY - 26}" class="rp-sm" text-anchor="middle">บาท</text>`;
      s.seen.forEach(n => { g += `<circle cx="${X0 + n * SX}" cy="${Y0 - n * k * SY}" r="5" fill="${RP_C.b}"/>`; }); g += tgHandle(X0 + s.n * SX, Y0 - s.n * k * SY, RP_C.o);
      const rows = [...s.seen].sort((a, b) => a - b).slice(-6); g += `<g transform="translate(400 30)"><rect width="200" height="${28 + rows.length * 26}" rx="10" fill="#fff" stroke="#E2DCF0"/><text x="50" y="20" class="rp-sm" text-anchor="middle">ด้าม</text><text x="140" y="20" class="rp-sm" text-anchor="middle">บาท</text>${rows.map((n, i) => `<text x="50" y="${46 + i * 26}" class="rp-sv" text-anchor="middle">${n}</text><text x="140" y="${46 + i * 26}" class="rp-sv" text-anchor="middle">${n * k}</text>`).join('')}</g>`; return g; },
    drag: (p, s) => { const n = Math.max(1, Math.min(10, Math.round((p[0] - X0) / SX))); return { n, seen: s.seen.includes(n) ? s.seen : [...s.seen, n] }; },
    info: s => `${s.n} ด้าม ราคา ${s.n * k} บาท<span class="rp-sep"></span><b>ราคา ÷ จำนวน = ${s.n * k} ÷ ${s.n} = ${k}</b> เท่าเดิมเสมอ → เป็น<b>สัดส่วนตรง</b> กราฟเป็นเส้นตรงผ่านจุด (0, 0)` });
}
/* 11 · inverse proportion: drag the corner of the work rectangle (คน × วัน = คงที่) */
function rpSimInverse(P = 24) {
  const W = 620, H = 330, X0 = 60, Y0 = 290, SX = 24, SY = 10.5, ok = [1, 2, 3, 4, 6, 8, 12].filter(x => P % x === 0);
  return tgScene({ W, H, st: { n: 2, seen: [2] }, cap: `งานหนึ่งใช้แรงงานทั้งหมด ${P} คน·วัน — <b>ลากมุมของสี่เหลี่ยม</b> เพื่อเปลี่ยนจำนวนคน แล้วดูจำนวนวัน`,
    missions: [['ใช้ 3 คน', s => s.seen.includes(3)], ['เพิ่มคนเป็น 2 เท่า (6 คน)', s => s.seen.includes(3) && s.seen.includes(6)], ['ใช้ 12 คน', s => s.seen.includes(12)]],
    svg: s => { const d = P / s.n; let g = `<rect x="${X0}" y="${Y0 - d * SY}" width="${s.n * SX}" height="${d * SY}" fill="${RP_C.b}" fill-opacity=".18" stroke="${RP_C.b}" stroke-width="2"/>`;
      g += `<path d="M${X0} ${Y0} h${SX * 12 + 16} M${X0} ${Y0} v-${P * SY + 10}" stroke="#2B2550" stroke-width="2"/>`; for (let i = 2; i <= 12; i += 2) g += `<text x="${X0 + i * SX}" y="${Y0 + 20}" class="rp-sm" text-anchor="middle">${i}</text>`; for (let v = 4; v <= P; v += 4) g += `<text x="${X0 - 8}" y="${Y0 - v * SY + 5}" class="rp-sm" text-anchor="end">${v}</text>`;
      let c = ''; for (let x = P / 24; x <= 12; x += .25) c += `${c ? 'L' : 'M'}${X0 + x * SX} ${Y0 - Math.min(P, P / x) * SY} `; g += `<path d="${c}" fill="none" stroke="${RP_C.g}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
      s.seen.forEach(n => { g += `<circle cx="${X0 + n * SX}" cy="${Y0 - P / n * SY}" r="5" fill="${RP_C.b}"/>`; }); g += tgHandle(X0 + s.n * SX, Y0 - d * SY, RP_C.o) + `<text x="${X0 + SX * 12 + 20}" y="${Y0 + 6}" class="rp-sm">คน</text><text x="${X0}" y="${Y0 - P * SY - 18}" class="rp-sm" text-anchor="middle">วัน</text>`;
      const rows = [...s.seen].sort((a, b) => a - b).slice(-6); g += `<g transform="translate(400 30)"><rect width="200" height="${28 + rows.length * 26}" rx="10" fill="#fff" stroke="#E2DCF0"/><text x="50" y="20" class="rp-sm" text-anchor="middle">คน</text><text x="140" y="20" class="rp-sm" text-anchor="middle">วัน</text>${rows.map((n, i) => `<text x="50" y="${46 + i * 26}" class="rp-sv" text-anchor="middle">${n}</text><text x="140" y="${46 + i * 26}" class="rp-sv" text-anchor="middle">${P / n}</text>`).join('')}</g>`; return g; },
    drag: (p, s) => { const x = (p[0] - X0) / SX, n = ok.reduce((m, v) => Math.abs(v - x) < Math.abs(m - x) ? v : m, ok[0]); return { n, seen: s.seen.includes(n) ? s.seen : [...s.seen, n] }; },
    info: s => `${s.n} คน ใช้ ${P / s.n} วัน<span class="rp-sep"></span><b>คน × วัน = ${s.n} × ${P / s.n} = ${P}</b> เท่าเดิมเสมอ → เป็น<b>สัดส่วนผกผัน</b> (คนเพิ่มกี่เท่า วันลดลงเท่านั้น)` });
}
/* 12 · sort cards into bins (tap a card, then tap a bin) */
function rpSort(cards, bins, cap, fin) { /* fin = ข้อความสรุปเมื่อจัดครบ (v245) */
  const wrap = tgWrap(), out = fNote2(), deck = h('div', { class: 'rp-deck' }), binEls = bins.map(b => h('button', { class: 'rp-binx ia', html: `<b>${b}</b><span class="rp-in"></span>` })); let sel = null, left = cards.length;
  cards.forEach(c => { const el = h('button', { class: 'rp-card ia', html: c.t }); el.onclick = e => { e.stopPropagation(); if (el.classList.contains('in')) return; deck.querySelectorAll('.rp-card').forEach(x => x.classList.toggle('sel', x === el)); sel = { el, c }; sfx.tap(); out.innerHTML = 'แตะกล่องที่ใช่'; }; deck.append(el); });
  binEls.forEach((b, i) => b.onclick = e => { e.stopPropagation(); if (!sel) { out.innerHTML = 'แตะการ์ดก่อน แล้วค่อยแตะกล่อง'; return; }
    if (sel.c.bin !== i) { sfx.no(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); out.innerHTML = '🤔 ' + (sel.c.why || 'ลองคิดใหม่'); return; }
    sfx.pop(3); sel.el.classList.remove('sel'); sel.el.classList.add('in'); b.querySelector('.rp-in').append(h('span', { class: 'rp-mini', html: sel.c.s || sel.c.t })); sel.el.remove(); out.innerHTML = '✓ ' + (sel.c.ok || 'ถูกต้อง'); sel = null; left--;
    if (!left) { sfx.ok(); out.innerHTML = fin || '<b>จัดครบทุกใบแล้ว</b> 🎉'; teachDone(wrap); } });
  wrap.append(h('div', { class: 'cap', html: cap }), deck, h('div', { class: 'rp-bins', 'data-n': bins.length }, ...binEls), out); return wrap;
}
/* 13 · percent grid: drag across the 10×10 grid to shade squares */
function rpSimGrid() {
  const C = 26, X0 = 20, Y0 = 20;
  return tgScene({ W: 300, H: 300, st: { n: 12 }, cap: '<b>ลากบนตาราง 100 ช่อง</b> เพื่อระบายสี — 1 ช่อง = 1 ใน 100 = 1%',
    missions: [['ระบาย 30%', s => s.n === 30], ['ระบาย 75%', s => s.n === 75], ['ระบาย 5%', s => s.n === 5]],
    svg: s => { let g = ''; for (let i = 0; i < 100; i++) g += `<rect x="${X0 + (i % 10) * C + 1}" y="${Y0 + Math.floor(i / 10) * C + 1}" width="${C - 2}" height="${C - 2}" rx="3" fill="${i < s.n ? RP_C.b : '#F1EEF8'}"/>`; return g; },
    drag: p => { const c = Math.max(0, Math.min(9, Math.floor((p[0] - X0) / C))), r = Math.max(0, Math.min(9, Math.floor((p[1] - Y0) / C))); return { n: r * 10 + c + 1 }; },
    info: s => `ระบาย ${s.n} ช่องจาก 100 ช่อง = ${fqHTML(s.n, 100)} = <b>${s.n}%</b> = <b class="num">${rpN(s.n / 100)}</b><span class="rp-sep"></span>อัตราส่วน ${rpRat(s.n, 100)}` });
}
/* 14 · one point, three names: fraction · decimal · percent on a 0–1 line */
function rpSimConv() {
  const W = 620, H = 220, X0 = 50, L = 520, Y = 120;
  return tgScene({ W, H, st: { v: 10 }, cap: '<b>ลากจุดบนเส้น 0 ถึง 1</b> — ตำแหน่งเดียวกันเขียนได้ทั้ง<b>เศษส่วน ทศนิยม และร้อยละ</b>',
    missions: [[`ไปที่ ${'1/4'}`, s => s.v === 5], ['ไปที่ 0.6', s => s.v === 12], ['ไปที่ 90%', s => s.v === 18]],
    svg: s => { let g = `<rect x="${X0}" y="${Y - 30}" width="${L}" height="26" rx="6" fill="#F1EEF8"/><rect x="${X0}" y="${Y - 30}" width="${s.v / 20 * L}" height="26" rx="6" fill="${RP_C.b}" fill-opacity=".75"/><path d="M${X0} ${Y} h${L}" stroke="#2B2550" stroke-width="2"/>`;
      for (let i = 0; i <= 20; i++) g += `<path d="M${X0 + i * L / 20} ${Y - (i % 2 ? 5 : 9)} v${i % 2 ? 10 : 18}" stroke="#2B2550" stroke-width="1.5"/>`; g += `<text x="${X0}" y="${Y + 30}" class="rp-sm" text-anchor="middle">0</text><text x="${X0 + L}" y="${Y + 30}" class="rp-sm" text-anchor="middle">1</text>`;
      return g + tgHandle(X0 + s.v * L / 20, Y, RP_C.o); },
    drag: p => ({ v: Math.max(0, Math.min(20, Math.round((p[0] - X0) / (L / 20)))) }),
    info: s => `เศษส่วน <b>${s.v === 0 ? '0' : s.v === 20 ? '1' : rpFrac(s.v, 20)}</b> &nbsp;=&nbsp; ทศนิยม <b class="num">${rpN(s.v / 20)}</b> &nbsp;=&nbsp; ร้อยละ <b>${s.v * 5}%</b>` });
}
/* 15 · double number line: percent on top, amount below */
function rpSimDNL(N = 80, unit = 'บาท') {
  const W = 620, H = 220, X0 = 40, L = 540, Y1 = 70, Y2 = 150;
  return tgScene({ W, H, st: { p: 50 }, cap: `เงินทั้งหมด ${N} ${unit} = 100% — <b>ลากเส้นสีส้ม</b> แล้วอ่านค่าบนเส้นล่าง`,
    missions: [['10%', s => s.p === 10], ['25%', s => s.p === 25], ['75%', s => s.p === 75]],
    svg: s => { const x = X0 + s.p / 100 * L; let g = `<path d="M${X0} ${Y1} h${L} M${X0} ${Y2} h${L}" stroke="#2B2550" stroke-width="2"/>`;
      for (let p = 0; p <= 100; p += 10) g += `<path d="M${X0 + p / 100 * L} ${Y1 - 6} v12 M${X0 + p / 100 * L} ${Y2 - 6} v12" stroke="#2B2550" stroke-width="1.5"/>`;
      g += `<text x="${X0}" y="${Y1 - 14}" class="rp-sm" text-anchor="middle">0%</text><text x="${X0 + L}" y="${Y1 - 14}" class="rp-sm" text-anchor="middle">100%</text><text x="${X0}" y="${Y2 + 26}" class="rp-sm" text-anchor="middle">0</text><text x="${X0 + L}" y="${Y2 + 26}" class="rp-sm" text-anchor="middle">${N}</text>`;
      g += `<rect x="${X0}" y="${Y1 + 8}" width="${x - X0}" height="${Y2 - Y1 - 16}" fill="${RP_C.o}" fill-opacity=".12"/><path d="M${x} ${Y1 - 10} V${Y2 + 10}" stroke="${RP_C.o}" stroke-width="3"/><text x="${x}" y="${Y1 - 30}" class="rp-sv" text-anchor="middle" style="fill:${RP_C.o}">${s.p}%</text><text x="${x}" y="${Y2 + 46}" class="rp-sv" text-anchor="middle" style="fill:${RP_C.o}">${rpN(s.p / 100 * N)}</text>`;
      return g + tgHandle(x, (Y1 + Y2) / 2, RP_C.o); },
    drag: p => ({ p: Math.max(0, Math.min(100, Math.round((p[0] - X0) / L * 20) * 5)) }),
    info: s => `${s.p}% ของ ${N} = ${fqHTML(s.p, 100)} × ${N} = <b class="num">${rpN(s.p / 100 * N)}</b> ${unit}` });
}
/* 16 · percent change: drag the new bar against the old one (old = 100%) */
function rpSimChange(old = 80) {
  const W = 620, H = 230, X0 = 70, U = 3.2, Y1 = 50, Y2 = 130;
  return tgScene({ W, H, st: { p: 100 }, cap: `ราคาเดิม ${old} บาท = 100% — <b>ลากปลายแถบราคาใหม่</b> (สีส้ม) ให้ยาวขึ้นหรือสั้นลง`,
    missions: [['เพิ่มขึ้น 25%', s => s.p === 125], ['ลดลง 20%', s => s.p === 80], ['เพิ่มขึ้น 50%', s => s.p === 150]],
    svg: s => { let g = `<text x="${X0 - 10}" y="${Y1 + 24}" class="rp-sv" text-anchor="end">เดิม</text><rect x="${X0}" y="${Y1}" width="${100 * U}" height="36" rx="6" fill="${RP_C.b}" fill-opacity=".8"/><text x="${X0 + 100 * U - 8}" y="${Y1 + 24}" class="rp-sv" text-anchor="end" style="fill:#fff">${old}</text>`;
      g += `<text x="${X0 - 10}" y="${Y2 + 24}" class="rp-sv" text-anchor="end">ใหม่</text><rect x="${X0}" y="${Y2}" width="${s.p * U}" height="36" rx="6" fill="${RP_C.o}" fill-opacity=".85"/><path d="M${X0 + 100 * U} ${Y1 - 8} V${Y2 + 50}" stroke="#2B2550" stroke-dasharray="5 5"/>`;
      for (let p = 0; p <= 150; p += 25) g += `<text x="${X0 + p * U}" y="${Y2 + 70}" class="rp-sm" text-anchor="middle">${p}%</text>`; return g + tgHandle(X0 + s.p * U, Y2 + 18, RP_C.o); },
    drag: p => ({ p: Math.max(50, Math.min(150, Math.round((p[0] - X0) / U / 5) * 5)) }),
    info: s => { const d = s.p - 100, nw = old * s.p / 100; return d === 0 ? `ราคาใหม่ ${old} บาท เท่าเดิม` : `${d > 0 ? 'เพิ่มขึ้น' : 'ลดลง'} ${Math.abs(d)}% ของ ${old} = ${rpN(Math.abs(d) / 100 * old)} บาท → ราคาใหม่ = <b>${s.p}%</b> ของ ${old} = <b class="num">${rpN(nw)}</b> บาท`; } });
}
/* 17 · profit / loss: drag the selling price against the cost (cost = 100%) */
function rpSimProfit(cost = 300) {
  const W = 620, H = 230, X0 = 80, U = 1.1, Y1 = 50, Y2 = 130;
  return tgScene({ W, H, st: { s: cost }, cap: `ราคาทุน ${cost} บาท — <b>ลากปลายแถบราคาขาย</b> แล้วดูว่ากำไรหรือขาดทุนกี่เปอร์เซ็นต์<b>ของทุน</b>`,
    missions: [['กำไร 20%', s => s.s === cost * 1.2], ['ขาดทุน 10%', s => s.s === cost * .9], ['กำไร 50%', s => s.s === cost * 1.5]],
    svg: s => { let g = `<text x="${X0 - 10}" y="${Y1 + 24}" class="rp-sv" text-anchor="end">ทุน</text><rect x="${X0}" y="${Y1}" width="${cost * U}" height="36" rx="6" fill="${RP_C.b}" fill-opacity=".8"/><text x="${X0 + cost * U - 8}" y="${Y1 + 24}" class="rp-sv" text-anchor="end" style="fill:#fff">${cost}</text>`;
      g += `<text x="${X0 - 10}" y="${Y2 + 24}" class="rp-sv" text-anchor="end">ขาย</text><rect x="${X0}" y="${Y2}" width="${s.s * U}" height="36" rx="6" fill="${s.s >= cost ? RP_C.g : RP_C.p}" fill-opacity=".85"/><text x="${X0 + s.s * U - 8}" y="${Y2 + 24}" class="rp-sv" text-anchor="end" style="fill:#fff">${s.s}</text><path d="M${X0 + cost * U} ${Y1 - 8} V${Y2 + 48}" stroke="#2B2550" stroke-dasharray="5 5"/>`;
      return g + tgHandle(X0 + s.s * U, Y2 + 18, RP_C.o); },
    drag: p => ({ s: Math.max(cost * .5, Math.min(cost * 1.6, Math.round((p[0] - X0) / U / (cost * .05)) * cost * .05)) }),
    info: s => { const d = s.s - cost; return d === 0 ? 'ขายเท่าทุน — ไม่กำไร ไม่ขาดทุน' : `${d > 0 ? 'กำไร' : 'ขาดทุน'} ${Math.abs(d)} บาท = ${fqHTML(Math.abs(d), cost)} × 100 = <b>${rpN(Math.abs(d) / cost * 100)}%</b> ของทุน`; } });
}
