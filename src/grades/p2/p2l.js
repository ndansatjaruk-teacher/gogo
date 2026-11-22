/* =========================================================
   GRADE 2 · CHAPTER 3 — การวัดความยาว  (ชายหาด · เมือง 41 · ด่าน 81–88 · บอส 99)
   hands-on tools: height wall with a sliding head-plate · ruler you can slide things along ·
   metre-stick builder · unit-converting comparison cards · route map with tappable roads ·
   metre|centimetre columns with carrying 100 cm = 1 m · two-step story problems
   ========================================================= */
const mcM = cm => Math.floor(cm / 100), mcC = cm => cm % 100;
const mcTxt = (cm, s) => { const m = mcM(cm), c = mcC(cm), [U1, U2] = s ? ['ม.', 'ซม.'] : ['เมตร', 'เซนติเมตร']; return m && c ? `${fmt(m)} ${U1} ${c} ${U2}` : m ? `${fmt(m)} ${U1}` : `${c} ${U2}`; };

/* ---------- art (tight viewBoxes: feet on the bottom edge, top of the head on the top edge) ---------- */
const P2_Y = PAL.yellow, P2_G = PAL.grey, P2_O = PAL.orange;
const P2ART = {
  giraffe: `<g stroke="${P2_Y[3]}" stroke-width="1.4"><path d="M15 72 v34 h6 v-34 M23 74 v32 h6 v-32 M37 74 v32 h6 v-32 M45 72 v34 h6 v-34" fill="${P2_Y[1]}"/><path d="M15 103 h6 v4 h-6z M23 103 h6 v4 h-6z M37 103 h6 v4 h-6z M45 103 h6 v4 h-6z" fill="#7A5A2E"/>
    <ellipse cx="33" cy="66" rx="21" ry="12" fill="url(#g-yellow)"/><path d="M38 60 L43 18 L52 19 L50 62 Z" fill="url(#g-yellow)"/><path d="M12 64 q-6 6 -5 16" fill="none" stroke-width="2"/><ellipse cx="50" cy="13" rx="9" ry="7" fill="url(#g-yellow)"/>
    <path d="M45 7 L44 2 M50 6 L50 1.6" fill="none" stroke-width="2"/><circle cx="44" cy="2" r="1.8" fill="#7A5A2E"/><circle cx="50" cy="1.8" r="1.8" fill="#7A5A2E"/></g>
    <g fill="${P2_O[2]}" opacity=".75"><circle cx="24" cy="62" r="3.5"/><circle cx="34" cy="70" r="3"/><circle cx="42" cy="61" r="3"/><circle cx="46" cy="40" r="2.6"/><circle cx="45" cy="28" r="2.2"/><circle cx="27" cy="72" r="2.4"/></g>
    <circle cx="53" cy="11" r="1.6" fill="#2B2550"/><ellipse cx="57" cy="15" rx="2" ry="1.4" fill="#FF8FA3" opacity=".6"/>`,
  elephant: `<g stroke="${P2_G[3]}" stroke-width="1.5"><path d="M24 38 v18 h9 v-18 M48 38 v18 h9 v-18" fill="${P2_G[1]}"/><ellipse cx="42" cy="30" rx="20" ry="17" fill="url(#g-grey)"/><path d="M30 44 v12 h9 v-12 M52 42 v14 h9 v-14" fill="url(#g-grey)"/>
    <circle cx="20" cy="22" r="15" fill="url(#g-grey)"/><ellipse cx="28" cy="22" rx="8" ry="11" fill="${PAL.pink[0]}"/><path d="M9 26 q-4 14 2 24 q3 3 5 -1 q-4 -9 1 -19" fill="url(#g-grey)"/><path d="M61 28 q4 4 2 10" fill="none" stroke-width="2"/></g>
    <circle cx="14" cy="18" r="1.8" fill="#2B2550"/><path d="M12 30 l-4 4" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  ostrich: `<g stroke="#4A4560" stroke-width="1.4"><path d="M21 56 L19 96 M31 56 L33 96" fill="none" stroke="${PAL.pink[2]}" stroke-width="3.6" stroke-linecap="round"/><path d="M14 96 h9 M29 96 h9" stroke="${PAL.pink[3]}" stroke-width="3"/>
    <ellipse cx="26" cy="50" rx="19" ry="12" fill="#4A4560"/><path d="M7 46 q-6 -4 -2 -10 q4 4 6 4 M44 46 q6 -2 4 -8" fill="#fff"/><path d="M34 42 Q36 22 37 10" fill="none" stroke="${PAL.pink[1]}" stroke-width="5" stroke-linecap="round"/><ellipse cx="39" cy="6" rx="6" ry="5" fill="${PAL.pink[1]}"/><path d="M44 6 l6 2 l-6 2z" fill="${P2_Y[2]}"/></g>
    <circle cx="40" cy="5" r="1.4" fill="#2B2550"/>`,
  lion: `<g stroke="${P2_O[3]}" stroke-width="1.4"><path d="M30 40 v14 h7 v-14 M48 40 v14 h7 v-14" fill="${P2_Y[1]}"/><ellipse cx="44" cy="34" rx="18" ry="11" fill="url(#g-yellow)"/><path d="M36 42 v12 h7 v-12 M54 40 v14 h7 v-14" fill="url(#g-yellow)"/><path d="M62 30 q8 -2 8 -10" fill="none" stroke-width="2"/><circle cx="70" cy="19" r="2.6" fill="${P2_O[2]}"/>
    <circle cx="20" cy="22" r="18" fill="url(#g-orange)"/><circle cx="20" cy="23" r="11" fill="url(#g-yellow)"/></g>${EYES(21, 4).replace(/cx="(\d+(?:\.\d+)?)"/g, (m, x) => `cx="${+x - 12}"`)}<path d="M18 27 h4 l-2 2z" fill="#7A3E1E"/>`,
  tv: `<rect x="2" y="30" width="48" height="20" rx="3" fill="url(#g-cookie)" stroke="${PAL.cookie[3]}" stroke-width="1.4"/><path d="M8 50 v-6 M44 50 v-6" stroke="${PAL.cookie[3]}" stroke-width="3"/><rect x="6" y="34" width="40" height="7" rx="2" fill="#fff" opacity=".5"/>
    <path d="M18 8 L12 0 M34 8 L40 0" stroke="#4A4560" stroke-width="1.6"/><rect x="5" y="7" width="42" height="23" rx="4" fill="#4A4560"/><rect x="9" y="10" width="34" height="17" rx="2" fill="url(#g-sky)"/>`,
  sofa: `<rect x="8" y="2" width="64" height="26" rx="8" fill="url(#g-mint)" stroke="${PAL.mint[3]}" stroke-width="1.5"/><rect x="2" y="16" width="16" height="24" rx="6" fill="url(#g-mint)" stroke="${PAL.mint[3]}" stroke-width="1.5"/><rect x="62" y="16" width="16" height="24" rx="6" fill="url(#g-mint)" stroke="${PAL.mint[3]}" stroke-width="1.5"/>
    <rect x="16" y="22" width="48" height="14" rx="5" fill="${PAL.mint[0]}" stroke="${PAL.mint[3]}" stroke-width="1.4"/><path d="M8 40 v4 M72 40 v4" stroke="#7A5A2E" stroke-width="3"/>`,
  lamp: `<path d="M6 2 h18 l5 22 h-28 z" fill="url(#g-yellow)" stroke="${P2_Y[3]}" stroke-width="1.4"/><path d="M15 24 v60" stroke="#8C84A8" stroke-width="2.6"/><ellipse cx="15" cy="86" rx="11" ry="3.4" fill="#8C84A8"/>`,
  fridge: `<rect x="1" y="1" width="34" height="78" rx="5" fill="url(#g-sky)" stroke="${PAL.sky[3]}" stroke-width="1.5"/><path d="M1 28 h34" stroke="${PAL.sky[3]}" stroke-width="1.5"/><path d="M28 10 v12 M28 36 v20" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  hospital: `<rect x="8" y="20" width="48" height="40" rx="3" fill="url(#g-white)" stroke="#8C84A8" stroke-width="1.4"/><rect x="22" y="8" width="20" height="14" rx="2" fill="url(#g-white)" stroke="#8C84A8" stroke-width="1.4"/><path d="M32 10 v10 M27 15 h10" stroke="#E5505E" stroke-width="3.2"/>
    <g fill="${PAL.sky[1]}"><rect x="13" y="27" width="8" height="7" rx="1"/><rect x="28" y="27" width="8" height="7" rx="1"/><rect x="43" y="27" width="8" height="7" rx="1"/><rect x="13" y="39" width="8" height="7" rx="1"/><rect x="43" y="39" width="8" height="7" rx="1"/></g><rect x="27" y="44" width="10" height="16" fill="#8C84A8"/>`,
  tower: `<path d="M10 16 L18 2 L26 16 z" fill="url(#g-coral)" stroke="${PAL.coral[3]}" stroke-width="1.4"/><rect x="11" y="16" width="14" height="52" fill="url(#g-cookie)" stroke="${PAL.cookie[3]}" stroke-width="1.4"/><circle cx="18" cy="26" r="5" fill="#fff" stroke="#4A4560" stroke-width="1.2"/><path d="M18 23 v3 h2" stroke="#4A4560" stroke-width="1.2" fill="none"/><path d="M15 40 h6 M15 50 h6" stroke="${PAL.cookie[3]}" stroke-width="2"/>`,
  park: `<ellipse cx="32" cy="52" rx="28" ry="9" fill="url(#g-green)"/><path d="M20 44 v-14 M44 44 v-12" stroke="#7A5A2E" stroke-width="3"/><circle cx="20" cy="24" r="10" fill="url(#g-leaf)"/><circle cx="44" cy="26" r="9" fill="url(#g-leaf)"/><ellipse cx="32" cy="50" rx="7" ry="3" fill="${PAL.sky[1]}"/>`,
  t_ruler: `<rect x="2" y="22" width="60" height="18" rx="2" fill="url(#l-yellow)" stroke="${P2_Y[3]}" stroke-width="1.4"/><path d="M8 22 v6 M14 22 v4 M20 22 v6 M26 22 v4 M32 22 v6 M38 22 v4 M44 22 v6 M50 22 v4 M56 22 v6" stroke="#4A4560" stroke-width="1"/>`,
  t_meter: `<rect x="1" y="27" width="62" height="10" fill="#fff" stroke="#4A4560" stroke-width="1.2"/><path d="M1 27 h10 v10 h-10z M21 27 h10 v10 h-10z M41 27 h10 v10 h-10z M61 27 h2 v10 h-2z" fill="${PAL.coral[1]}"/>`,
  t_tape: `<path d="M8 40 q10 -24 26 -14 q12 8 24 -4" fill="none" stroke="${P2_Y[1]}" stroke-width="7" stroke-linecap="round"/><path d="M8 40 q10 -24 26 -14 q12 8 24 -4" fill="none" stroke="#4A4560" stroke-width="7" stroke-dasharray="1 4" opacity=".5"/><circle cx="20" cy="44" r="9" fill="url(#g-yellow)" stroke="${P2_Y[3]}" stroke-width="1.2"/><circle cx="20" cy="44" r="4" fill="#fff"/>`,
  t_reel: `<rect x="6" y="18" width="30" height="30" rx="8" fill="url(#g-sky)" stroke="${PAL.sky[3]}" stroke-width="1.4"/><circle cx="21" cy="33" r="7" fill="#fff" stroke="${PAL.sky[3]}"/><rect x="34" y="40" width="26" height="6" fill="url(#l-yellow)" stroke="${P2_Y[3]}" stroke-width="1"/><path d="M60 38 v10" stroke="#4A4560" stroke-width="2.4"/>`
};
const P2VB = { giraffe: [6.9,0,52.1,107], elephant: [5,7,58.7,49], ostrich: [3.4,1,46.6,95], lion: [2,4,70.6,50], tv: [2,0,48,50], sofa: [2,2,76,42], lamp: [1,2,28,87.4], fridge: [1,1,34,78], hospital: [8,8,48,52], tower: [10,2,16,66], park: [4,14,56,47], t_ruler: [2,22,60,18], t_meter: [1,27,62,10], t_tape: [8,22,50,31], t_reel: [6,18,54,30], school: [4,2,56,61.6], shop: [8,16,48,47.6], house: [8,12,48,51], palm: [9,6,52,57.4], kid0: [12.4,10,39.2,54.2], kid1: [16,11,32,53.2], kid2: [12.4,10,39.2,54.2], kid3: [16,11,32,53.2], kid4: [12.4,10,39.2,54.2], girl: [11,12,42,49.2], teddy: [11,9,42,52.2], dog: [9.7,15,44.5,46.2], cat: [12,11,40,50.2], rabbit: [13,3,38,58.2], chick: [8.9,8.7,46.3,52.5], camel: [9.3,12.8,50.5,50.8], goat: [14,10,42.7,53] };
const p2art = k => P2ART[k] || ART[k] || SCENERY[k] || '';
const p2vb = k => P2VB[k] || [0, 0, 64, 64];
const p2ico = (k, w = 46) => `<svg viewBox="${p2vb(k).join(' ')}" width="${w}" height="${w}" aria-hidden="true">${p2art(k)}</svg>`;

/* ---------- metre + centimetre answer: two slots, one keypad ---------- */
function mcInput(ctx, cm, o = {}) {
  const val = ['', '']; let cur = 0, done = false;
  const slots = [0, 1].map(i => h('button', { class: 'mc-slot', onclick: e => { e.stopPropagation(); if (!done) { cur = i; paint(); } } }, '?'));
  const msg = h('div', { class: 'pad-msg' });
  const paint = () => slots.forEach((s, i) => { s.textContent = val[i] === '' ? '?' : fmt(+val[i]); s.classList.toggle('on', i === cur && !done); s.classList.toggle('filled', val[i] !== ''); });
  const type = d => { if (done) return; sfx.tap(); msg.textContent = ''; val[cur] = (val[cur] + d).slice(-(cur ? 2 : 7)).replace(/^0+(\d)/, '$1'); paint(); };
  const ok = () => { if (done) return;
    if (val[cur] === '') { msg.textContent = cur ? 'กดจำนวนเซนติเมตร (ถ้าไม่มีให้กด 0)' : 'กดจำนวนเมตร (ถ้าไม่มีให้กด 0)'; return; }
    const other = 1 - cur; if (val[other] === '') { cur = other; paint(); msg.textContent = cur ? 'ต่อไปกดจำนวนเซนติเมตร (ถ้าไม่มีให้กด 0)' : 'กดจำนวนเมตรด้วยนะ (ถ้าไม่มีให้กด 0)'; return; }
    const good = +val[0] === mcM(cm) && +val[1] === mcC(cm);
    if (good) { done = true; wrap.classList.add('done'); }
    ctx.check(good, o.hint || (+val[1] >= 100 ? 'เซนติเมตรครบ 100 ต้องเปลี่ยนเป็น 1 เมตร' : undefined));
    if (!good && !done) { val[0] = val[1] = ''; cur = 0; paint(); } }; /* v188: ครั้งที่ 3 เฉลยแล้ว อย่าล้าง */
  const kp = h('div', { class: 'keypad' });
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(d => kp.append(h('button', { class: 'btn', onclick: () => type(d) }, d)));
  kp.append(h('button', { class: 'btn', 'aria-label': 'ลบ', onclick: () => { sfx.tap(); val[cur] = val[cur].slice(0, -1); paint(); } }, icon('left')), h('button', { class: 'btn', onclick: () => type(0) }, '0'), h('button', { class: 'btn primary', 'aria-label': 'ส่งคำตอบ', onclick: ok }, icon('check')));
  const wrap = h('div', { class: 'ans mc-ans ia' }, h('div', { class: 'mc-row' }, slots[0], h('span', { class: 'mc-u' }, 'เมตร'), slots[1], h('span', { class: 'mc-u' }, 'เซนติเมตร')), kp, msg);
  wrap.reveal = () => { val[0] = String(mcM(cm)); val[1] = String(mcC(cm)); done = true; paint(); wrap.classList.add('done', 'revealed'); }; wrap.ansText = [String(mcM(cm)), String(mcC(cm)), String(cm)];
  paint(); return wrap;
}

/* ---------- height wall: a cm scale + things standing on the floor ---------- */
function p2wg(items, o) {
  const max = o.max, H = o.H || 300, top = o.plate === false ? 12 : 22, base = H - 36, k = (base - top) / max, ws = items.map(it => { const v = p2vb(it.e); return Math.max(64, it.cm * k * v[2] / v[3] + 16); });
  const W = Math.max(520, 84 + ws.reduce((a, b) => a + b, 0)), pad = (W - 84 - ws.reduce((a, b) => a + b, 0)) / items.length, cx = []; let x = 80;
  ws.forEach(w => { cx.push(x + (w + pad) / 2); x += w + pad; });
  return { max, H, W, top, base, k, y: v => base - v * k, ws: ws.map(w => w + pad), cx, tick: o.tick || (max > 120 ? 10 : 5), step: o.step || (max > 120 ? 20 : 10) };
}
function p2wallSVG(items, o = {}) {
  const G = p2wg(items, o), { y, base } = G;
  let s = `<rect x="44" y="${y(G.max) - 8}" width="24" height="${base - y(G.max) + 8}" rx="4" fill="#FFF6DD" stroke="#D9B66B" stroke-width="1.5"/>`;
  for (let v = 0; v <= G.max; v += G.tick) s += `<line x1="${v % G.step ? 58 : 48}" x2="68" y1="${y(v)}" y2="${y(v)}" stroke="#8B6A3E" stroke-width="${v % G.step ? 1 : 1.8}"/>`;
  for (let v = 0; v <= G.max; v += G.step) s += `<text x="40" y="${y(v) + 5}" text-anchor="end" class="p2w-n">${v}</text>`;
  s += `<text x="56" y="${base + 24}" text-anchor="middle" class="p2w-u">ซม.</text><line x1="44" x2="${G.W - 6}" y1="${base}" y2="${base}" stroke="#B9A27A" stroke-width="2.4"/>`;
  items.forEach((it, i) => { const cx = G.cx[i], hp = it.cm * G.k, v = p2vb(it.e), wp = hp * v[2] / v[3];
    if (o.guides) s += `<line x1="68" x2="${cx + wp / 2}" y1="${y(it.cm)}" y2="${y(it.cm)}" class="p2w-g"/>`;
    s += `<g class="p2w-it" data-i="${i}"><rect x="${cx - G.ws[i] / 2 + 3}" y="${G.top - 14}" width="${G.ws[i] - 6}" height="${base - G.top + 44}" rx="10" class="p2w-hit"/><svg x="${cx - wp / 2}" y="${base - hp}" width="${wp}" height="${hp}" viewBox="${v.join(' ')}" preserveAspectRatio="xMidYMax meet">${p2art(it.e)}</svg><text x="${cx}" y="${base + 26}" text-anchor="middle" class="p2w-name">${it.name}</text>${o.vals ? `<text x="${cx}" y="${y(it.cm) - 7}" text-anchor="middle" class="p2w-v">${o.vals === 'mc' ? mcTxt(it.cm, 1) : it.cm + ' ซม.'}</text>` : ''}</g>`; });
  return `<svg viewBox="0 0 ${G.W} ${G.H}" class="p2wall" aria-hidden="true">${s}<g class="p2w-top"></g></svg>`;
}
const p2svgPt = (svg, e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
/* teaching: slide the red head-plate down onto each head (measure) — or tap two to compare (cmp) */
function simWall(items, o = {}) {
  const G = p2wg(items, o), wrap = h('div', { class: 'p2wwrap ia', html: p2wallSVG(items, o) }), svg = wrap.firstChild, topG = svg.querySelector('.p2w-top'), out = fNote(), got = new Set(), snap = o.snap || 1;
  const tell = v => o.mc ? `${v} ซม. = ${mcTxt(v)}` : `${v} เซนติเมตร`;
  if (o.mode === 'cmp') {
    let pick = [];
    out.innerHTML = 'แตะ <b>2 ตัว</b> เพื่อเปรียบเทียบความสูง';
    svg.querySelectorAll('.p2w-it').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); const i = +g.dataset.i; if (pick.includes(i)) return; pick.push(i); if (pick.length > 2) pick = [i]; sfx.tap();
      svg.querySelectorAll('.p2w-it').forEach(x => x.classList.toggle('on', pick.includes(+x.dataset.i)));
      topG.innerHTML = pick.map(j => `<line x1="68" x2="${G.cx[j]}" y1="${G.y(items[j].cm)}" y2="${G.y(items[j].cm)}" class="p2w-g on"/><text x="${G.cx[j]}" y="${G.y(items[j].cm) - 8}" text-anchor="middle" class="p2w-v">${o.mc ? mcTxt(items[j].cm, 1) : items[j].cm + ' ซม.'}</text>`).join('');
      if (pick.length === 2) { const [A, B] = pick.map(j => items[j]), hi = A.cm >= B.cm ? A : B, lo = hi === A ? B : A, d = hi.cm - lo.cm;
        const bx = G.W - 18; topG.innerHTML += d ? `<path d="M${bx - 8} ${G.y(hi.cm)} h8 v${d * G.k} h-8" fill="none" stroke="#E5505E" stroke-width="2.4"/><text x="${bx - 12}" y="${G.y(hi.cm) + d * G.k / 2 + 5}" text-anchor="end" class="p2w-d">${d} ซม.</text>` : '';
        out.innerHTML = d ? `${hi.name}สูง ${o.mc ? mcTxt(hi.cm) : hi.cm + ' ซม.'} · ${lo.name}สูง ${o.mc ? mcTxt(lo.cm) : lo.cm + ' ซม.'}<br><b>${hi.name}สูงกว่า${lo.name} ${d} เซนติเมตร</b>${o.mc ? ` (${hi.cm} − ${lo.cm})` : ` (${hi.cm} − ${lo.cm})`}` : `<b>${A.name}สูงเท่ากับ${B.name}</b>`;
        say(out.textContent, true); teachDone(wrap); } })); }
  else {
    let v = o.start ?? G.max;
    const plate = document.createElementNS(SVGNS, 'g'); plate.setAttribute('class', 'p2w-plate'); topG.after(plate);
    const draw = () => { const Y = G.y(v); plate.innerHTML = `<line x1="44" x2="${G.W - 30}" y1="${Y}" y2="${Y}"/><rect x="${G.W - 34}" y="${Y - 17}" width="30" height="34" rx="9"/><path d="M${G.W - 19} ${Y - 11} l-5 6 h10 z M${G.W - 19} ${Y + 11} l-5 -6 h10 z"/><text x="${G.W - 40}" y="${Y - 6}" text-anchor="end">${v} ซม.</text>`;
      const hit = items.findIndex(it => it.cm === v);
      if (hit >= 0) { const it = items[hit]; if (!got.has(hit)) { got.add(hit); sfx.pop(got.size + 2); topG.innerHTML += `<text x="${G.cx[hit]}" y="${G.y(it.cm) - 8}" text-anchor="middle" class="p2w-v">${o.mc ? mcTxt(it.cm, 1) : it.cm + ' ซม.'}</text>`; svg.querySelector(`.p2w-it[data-i="${hit}"]`).classList.add('on'); }
        out.innerHTML = `ไม้วัดแตะยอดของ<b>${it.name}</b> พอดี → สูง <b>${tell(v)}</b>`; }
      else out.innerHTML = `ไม้วัดอยู่ที่ <b>${v} ซม.</b> — เลื่อนลงให้แตะยอดพอดี (วัดแล้ว ${got.size} จาก ${items.length})`;
      if (got.size === items.length && !wrap.dataset.done) { wrap.dataset.done = 1; const s = [...items].sort((a, b) => b.cm - a.cm); out.innerHTML = `วัดครบแล้ว! <b>${s[0].name}</b>สูงที่สุด · <b>${s[s.length - 1].name}</b>เตี้ยที่สุด`; sfx.ok(); say(out.textContent, true); teachDone(wrap); } };
    const setY = e => { const p = p2svgPt(svg, e); v = Math.max(0, Math.min(G.max, Math.round((G.base - p.y) / G.k / snap) * snap)); draw(); };
    plate.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); (() => { try { plate.setPointerCapture(e.pointerId); } catch (_) {} })(); const mv = ev => { const ov = v; setY(ev); if (v !== ov) sfx.tap(); }, up = () => { plate.removeEventListener('pointermove', mv); plate.removeEventListener('pointerup', up); }; plate.addEventListener('pointermove', mv); plate.addEventListener('pointerup', up); });
    svg.addEventListener('click', e => { e.stopPropagation(); if (e.target.closest('.p2w-plate')) return; setY(e); sfx.tap(); });
    const nudge = d => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); v = Math.max(0, Math.min(G.max, v + d)); sfx.tap(); draw(); } }, d > 0 ? `ขึ้น ${d}` : `ลง ${-d}`);
    draw(); return h('div', { class: 'colstack' }, wrap, h('div', { class: 'rowstack' }, nudge(-10), nudge(-1), nudge(1), nudge(10)), h('div', { class: 'cap' }, 'ลากแถบสีแดง (หรือแตะผนัง) ให้แตะยอดศีรษะของแต่ละตัว'), out);
  }
  return h('div', { class: 'colstack' }, wrap, out);
}

/* ---------- a ruler with things lying on it (start not always at 0) ---------- */
function p2obj(kind, w, hh, col) {
  if (kind === 'eraser') return `<svg width="${w}" height="${hh}" viewBox="0 0 60 30" preserveAspectRatio="none"><rect x="1" y="5" width="58" height="21" rx="5" fill="${PAL.pink[1]}" stroke="${PAL.pink[3]}" stroke-width="1.4"/><rect x="1" y="5" width="24" height="21" rx="4" fill="${PAL.sky[1]}" stroke="${PAL.sky[3]}" stroke-width="1.4"/></svg>`;
  if (kind === 'sharpener') return `<svg width="${w}" height="${hh}" viewBox="0 0 40 30" preserveAspectRatio="none"><rect x="1" y="4" width="38" height="23" rx="4" fill="url(#g-lilac)" stroke="${PAL.lilac[3]}" stroke-width="1.4"/><circle cx="12" cy="15" r="5" fill="#4A4560"/><rect x="22" y="9" width="12" height="4" fill="#C9C4DA"/></svg>`;
  return longSVG(kind, Math.max(1, Math.round(w / 26)), col).replace('<svg ', `<svg width="${w}" height="${hh}" `);
}
function p2rg(items, o) { const max = o.max || 20, W = 560, x0 = 24, u = (W - 48) / max, rowH = 40, top = 8, ry = top + items.length * rowH + 10; return { max, W, x0, u, X: v => x0 + v * u, rowH, top, ry, H: ry + 56 }; }
function p2rulerSVG(items, o = {}) {
  const G = p2rg(items, o); let s = '';
  items.forEach((it, i) => { const yy = G.top + i * G.rowH;
    s += `<g class="p2r-it" data-i="${i}"><g class="p2r-ob" transform="translate(${G.X(it.a)} ${yy})">${p2obj(it.k, (it.b - it.a) * G.u, 30, it.col)}</g>`;
    if (o.guides !== false) s += `<line x1="${G.X(it.a)}" x2="${G.X(it.a)}" y1="${yy + 30}" y2="${G.ry}" class="p2r-g a"/><line x1="${G.X(it.b)}" x2="${G.X(it.b)}" y1="${yy + 15}" y2="${G.ry}" class="p2r-g b"/>`;
    if (o.names) s += `<text x="${it.b > G.max - 4 ? G.X(it.a) - 6 : G.X(it.b) + 8}" y="${yy + 21}" text-anchor="${it.b > G.max - 4 ? 'end' : 'start'}" class="p2r-name">${it.name}</text>`;
    s += '</g>'; });
  s += `<rect x="${G.x0 - 14}" y="${G.ry}" width="${G.X(G.max) - G.x0 + 28}" height="50" rx="4" fill="#FFF3B0" stroke="${P2_Y[3]}" stroke-width="1.5"/>`;
  for (let v = 0; v <= G.max; v++) s += `<line x1="${G.X(v)}" x2="${G.X(v)}" y1="${G.ry}" y2="${G.ry + 15}" stroke="#4A4560" stroke-width="1.4"/><text x="${G.X(v)}" y="${G.ry + 33}" text-anchor="middle" class="p2r-n">${v}</text>` + (v < G.max ? `<line x1="${G.X(v + .5)}" x2="${G.X(v + .5)}" y1="${G.ry}" y2="${G.ry + 8}" stroke="#4A4560" stroke-width="1"/>` : '');
  s += `<text x="${G.X(G.max) + 8}" y="${G.ry + 47}" text-anchor="end" class="p2r-u">เซนติเมตร</text>`;
  return `<svg viewBox="0 0 ${G.W} ${G.H}" class="p2ruler" aria-hidden="true">${s}</svg>`;
}
/* teaching: slide the object anywhere — the length never changes */
function simRulerDrag(it, o = {}) {
  const G = p2rg([it], o), L = it.b - it.a, wrap = h('div', { class: 'p2rwrap ia', html: p2rulerSVG([it], o) }), svg = wrap.firstChild, out = fNote(); let a = it.a, moves = 0;
  const ob = svg.querySelector('.p2r-ob'), ga = svg.querySelector('.p2r-g.a'), gb = svg.querySelector('.p2r-g.b');
  const draw = () => { ob.setAttribute('transform', `translate(${G.X(a)} ${G.top})`); ga.setAttribute('x1', G.X(a)); ga.setAttribute('x2', G.X(a)); gb.setAttribute('x1', G.X(a + L)); gb.setAttribute('x2', G.X(a + L));
    out.innerHTML = a === 0 ? `เริ่มที่ <b>0</b> ปลายอยู่ที่ <b>${L}</b> → ${it.name}ยาว <b>${L} เซนติเมตร</b>` : `เริ่มที่ <b>${a}</b> ปลายอยู่ที่ <b>${a + L}</b> → ยาว ${a + L} − ${a} = <b>${L} เซนติเมตร</b>`; };
  ob.parentNode.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); const g = ob.parentNode; (() => { try { g.setPointerCapture(e.pointerId); } catch (_) {} })(); const x0 = p2svgPt(svg, e).x, a0 = a;
    const mv = ev => { const v = Math.max(0, Math.min(G.max - L, Math.round(a0 + (p2svgPt(svg, ev).x - x0) / G.u))); if (v !== a) { a = v; draw(); sfx.tap(); } };
    const up = () => { g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); if (a !== a0 && ++moves >= 2) teachDone(wrap); if (!o.quiet) say(out.textContent, true); }; g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); });
  draw(); return h('div', { class: 'colstack' }, h6wait(), wrap, h('div', { class: 'cap' }, `ลาก${it.name}ไปวางที่ไหนก็ได้บนไม้บรรทัด (ลองอย่างน้อย 2 ครั้ง)`), out);
}

/* ---------- metre sticks + centimetres you build with buttons ---------- */
function p2meter(o = {}) {
  let m = o.m || 0, c = o.c || 0; const vis = h('div', { class: 'p2mb' }), read = h('div', { class: 'fbig p2mb-read' }), note = fNote();
  const draw = flash => { vis.innerHTML = ''; for (let i = 0; i < m; i++) vis.append(h('span', { class: 'p2mb-m' + (flash && i === m - 1 ? ' new' : '') }, '1 ม.'));
    vis.append(h('span', { class: 'p2mb-c', style: { width: `calc(var(--mw) * ${c / 100})` } }, c ? `${c}` : ''));
    read.innerHTML = `<b class="num">${m}</b> เมตร <b class="num">${c}</b> เซนติเมตร` + (o.total ? ` <span class="p2mb-eq">= <b class="num">${m * 100 + c}</b> เซนติเมตร</span>` : '');
    o.onChange && o.onChange(m * 100 + c); };
  const add = d => { let t = m * 100 + c + d; if (t < 0 || t > 999) { sfx.no(); return; } const om = m; m = mcM(t); c = mcC(t); sfx.tap();
    note.innerHTML = m > om && d < 100 ? '<b>ครบ 100 เซนติเมตร → เปลี่ยนเป็น 1 เมตร!</b>' : m < om && d > -100 ? '<b>เซนติเมตรไม่พอ → แบ่ง 1 เมตร เป็น 100 เซนติเมตร</b>' : ''; draw(m > om); };
  const bt = (d, t) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); add(d); } }, t);
  draw(); const el = h('div', { class: 'colstack' }, vis, read, h('div', { class: 'p2mb-btns' }, h('div', null, bt(-100, '− 1 ม.'), bt(100, '+ 1 ม.')), h('div', null, bt(-10, '− 10 ซม.'), bt(10, '+ 10 ซม.')), h('div', null, bt(-1, '− 1 ซม.'), bt(1, '+ 1 ซม.'))), note);
  el.val = () => m * 100 + c; return el;
}
function simMeterBuild(tasks) {
  let k = 0; const goal = h('div', { class: 'cap p2goal' }), box = h('div', { class: 'colstack' }, h6wait());
  const mb = p2meter({ total: true, onChange: v => { if (k < tasks.length && v === tasks[k]) { sfx.ok(); k++; setTimeout(show, 350); } } });
  const show = () => { if (k >= tasks.length) { goal.innerHTML = '✓ สร้างครบแล้ว! <b>1 เมตร = 100 เซนติเมตร</b>'; teachDone(box); say('สร้างครบแล้ว หนึ่งเมตร เท่ากับ หนึ่งร้อยเซนติเมตร', true); return; }
    goal.innerHTML = `ภารกิจ ${k + 1}/${tasks.length}: สร้างความยาว <b>${k % 2 ? tasks[k] + ' เซนติเมตร' : mcTxt(tasks[k])}</b>`; };
  show(); box.append(goal, mb); return box;
}

/* ---------- compare two lengths written in different units ---------- */
function simCmpUnits(pairs, words = ['ยาวกว่า', 'สั้นกว่า', 'ยาวเท่ากับ']) {
  let idx = 0; const box = h('div', { class: 'colstack' }, h6wait()), stage = h('div', { class: 'colstack' }); box.append(stage);
  const draw = () => { const P = pairs[idx], shown = [false, false], out = fNote(); stage.innerHTML = '';
    const bars = h('div', { class: 'p2cu-bars' }), signs = h('div', { class: 'rowstack', style: { display: 'none' } });
    const card = (p, i) => { const v = h('span', { class: 'p2cu-cm' }), b = h('button', { class: 'btn sm info ia' }, 'เปลี่ยนเป็นเซนติเมตร');
      b.onclick = e => { e.stopPropagation(); b.remove(); shown[i] = true; v.innerHTML = p[1].includes('ม.') ? `= ${mcM(p[2])} × 100 + ${mcC(p[2])} = <b>${p[2]} ซม.</b>` : `= <b>${p[2]} ซม.</b> (หน่วยเดียวกันแล้ว)`; sfx.pop(i + 3);
        if (shown[0] && shown[1]) { const mx = Math.max(P[0][2], P[1][2]); bars.innerHTML = P.map(q => `<div class="p2cu-row"><b>${q[0]}</b><span style="width:${q[2] / mx * 100}%"></span><i>${q[2]}</i></div>`).join(''); signs.style.display = ''; out.innerHTML = `แล้ว${P[0][0]} … ${P[1][0]}?`; } };
      return h('div', { class: 'p2cu-card' }, h('b', null, p[0]), h('span', { class: 'p2cu-lab' }, p[1]), v, b); };
    const rel = P[0][2] > P[1][2] ? 0 : P[0][2] < P[1][2] ? 1 : 2;
    words.forEach((w, wi) => signs.append(h('button', { class: 'btn sm ia d6-pick', onclick: e => { e.stopPropagation(); if (wi === rel) { sfx.ok(); out.innerHTML = `✓ <b>${P[0][0]}${w}${P[1][0]}</b> (${P[0][2]} ซม. ${['>', '<', '='][wi]} ${P[1][2]} ซม.)`; signs.remove(); teachDone(box); say(out.textContent, true); if (pairs.length > 1) stage.append(p4more(() => { idx = (idx + 1) % pairs.length; draw(); }, 'คู่ต่อไป')); } else { sfx.no(); out.innerHTML = 'ยังไม่ใช่ — ดูแถบว่าแถบไหนยาวกว่า'; } } }, w)));
    stage.append(h('div', { class: 'p2cu' }, card(P[0], 0), card(P[1], 1)), bars, signs, out); };
  draw(); return box;
}

/* ---------- distance track (long jump / javelin) ---------- */
function p2trackSVG(items, o = {}) {
  const lo = o.lo, hi = o.hi, st = o.st, W = 560, x0 = 120, X = v => x0 + (v - lo) / (hi - lo) * (W - x0 - 20), rh = 34, H = items.length * rh + 46;
  let s = `<rect x="${x0}" y="4" width="${W - x0 - 20}" height="${items.length * rh + 4}" rx="6" fill="${o.sand ? '#FBE7B5' : '#DDF2C8'}"/>`;
  for (let v = lo; v <= hi; v += st) s += `<line x1="${X(v)}" x2="${X(v)}" y1="4" y2="${items.length * rh + 12}" stroke="#fff" stroke-width="1.6"/><text x="${X(v)}" y="${items.length * rh + 30}" text-anchor="middle" class="p2t-n">${o.lab ? o.lab(v) : v}</text>`;
  items.forEach((it, i) => { const yy = 8 + i * rh + rh / 2; s += `<text x="${x0 - 10}" y="${yy + 5}" text-anchor="end" class="p2t-name">${it.name}</text><line x1="${x0}" x2="${X(it.cm)}" y1="${yy}" y2="${yy}" stroke="#8C84A8" stroke-width="2" stroke-dasharray="4 4"/><circle cx="${X(it.cm)}" cy="${yy}" r="7" fill="${PAL.coral[1]}" stroke="#fff" stroke-width="2"/><text x="${X(it.cm) + (X(it.cm) > W - 120 ? -12 : 12)}" y="${yy + 5}" text-anchor="${X(it.cm) > W - 120 ? 'end' : 'start'}" class="p2t-v">${mcTxt(it.cm, 1)}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" class="p2track" aria-hidden="true">${s}</svg>`;
}

/* ---------- route map: roads you can tap ---------- */
function p2mapSVG(M, o = {}) {
  const hl = o.hl || [], N = M.nodes; let s = '';
  M.edges.forEach((e, i) => { const [a, b, len, dx = 0, dy = 0, bend = 0] = e, A = N[a], B = N[b], mx = (A[0] + B[0]) / 2 + dx, my = (A[1] + B[1]) / 2 + dy;
    const cx = (A[0] + B[0]) / 2 + bend * (B[1] - A[1]) / 6, cy = (A[1] + B[1]) / 2 - bend * (B[0] - A[0]) / 6, d = `M${A[0]} ${A[1]} Q${cx} ${cy} ${B[0]} ${B[1]}`;
    s += `<g class="p2m-e${hl.includes(i) ? ' on' : ''}${e[6] ? ' thin' : ''}" data-i="${i}"><path d="${d}" class="hit"/><path d="${d}" class="road"/><g class="lab"><rect x="${mx - 38}" y="${my - 13}" width="76" height="24" rx="12"/><text x="${mx}" y="${my + 5}" text-anchor="middle">${fmt(len)} ${o.u || 'ม.'}</text></g></g>`; });
  Object.entries(N).forEach(([k, [x, y, name, ic, ly = 1]]) => { s += `<g class="p2m-n"><svg x="${x - 23}" y="${y - 27}" width="46" height="46" viewBox="${p2vb(ic).join(' ')}">${p2art(ic)}</svg><text x="${x}" y="${y + (ly > 0 ? 34 : -32)}" text-anchor="middle" class="p2m-name">${name}</text></g>`; });
  return `<svg viewBox="0 0 ${M.W} ${M.H}" class="p2map" aria-hidden="true">${s}</svg>`;
}
function p2mapTap(el, onTap) { el.querySelectorAll('.p2m-e').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); g.classList.toggle('on'); sfx.tap(); onTap && onTap(); })); }
function simRoute(M, tasks) {
  let k = 0; const box = h('div', { class: 'colstack' }, h6wait()), wrap = h('div', { class: 'p2mwrap ia', html: p2mapSVG(M) }), goal = h('div', { class: 'cap p2goal' }), out = fNote(), done = [];
  const sel = () => [...wrap.querySelectorAll('.p2m-e.on')].map(g => +g.dataset.i).sort((a, b) => a - b);
  const upd = () => { const S = sel(), sum = S.reduce((a, i) => a + M.edges[i][2], 0); out.innerHTML = S.length ? `ถนนที่เลือก: ${S.map(i => fmt(M.edges[i][2])).join(' + ')} = <b>${fmt(sum)} เมตร</b>` : 'แตะถนนทีละเส้นตามเส้นทาง';
    const T = tasks[k]; if (T && S.join() === [...T.e].sort((a, b) => a - b).join()) { sfx.ok(); done.push(`${T.q}: <b>${fmt(sum)} เมตร</b>`); k++; setTimeout(show, 700); } };
  const show = () => { wrap.querySelectorAll('.p2m-e.on').forEach(g => g.classList.remove('on'));
    if (k >= tasks.length) { goal.innerHTML = done.join('<br>') + (tasks.length > 1 ? `<br>→ ${o2(tasks)}` : ''); out.innerHTML = ''; teachDone(box); say('เปรียบเทียบระยะทางแล้ว เส้นทางที่ระยะทางน้อยกว่า ใกล้กว่า', true); return; }
    goal.innerHTML = `ภารกิจ ${k + 1}/${tasks.length}: แตะถนน<b>${tasks[k].q}</b>`; upd(); };
  const o2 = T => { const v = T.map(t => t.e.reduce((a, i) => a + M.edges[i][2], 0)), j = v[0] <= v[1] ? 0 : 1; return `<b>${T[j].q}</b> ใกล้กว่า ${fmt(Math.abs(v[0] - v[1]))} เมตร`; };
  p2mapTap(wrap, upd); show();
  box.append(goal, wrap, out, h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); wrap.querySelectorAll('.p2m-e.on').forEach(g => g.classList.remove('on')); upd(); } }, icon('undo'), 'ล้างถนน')); return box;
}

/* ---------- metre | centimetre columns ---------- */
function p2mcColHTML(a, b, op, st = {}) {
  const A = [mcM(a), mcC(a)], B = [mcM(b), mcC(b)], add = op === '+', r = add ? a + b : a - b, R = [mcM(r), mcC(r)], carry = add && A[1] + B[1] >= 100, borrow = !add && A[1] < B[1];
  const c = (v, cls = '') => `<span class="${cls}">${v}</span>`;
  let g = c('') + c('เมตร', 'hd') + c('เซนติเมตร', 'hd');
  g += c('') + c(st.x && carry ? '1' : st.x && borrow ? A[0] - 1 : '', 'cy') + c(st.x && borrow ? A[1] + 100 : '', 'cy');
  g += c('') + c(A[0], 'dg' + (st.x && borrow ? ' x' : '')) + c(A[1], 'dg' + (st.x && borrow ? ' x' : ''));
  g += c(op, 'op') + c(B[0], 'dg') + c(B[1], 'dg');
  g += `<i class="ln"></i>` + c('') + c(st.m ? R[0] : st.q ? '?' : '', 'dg rs') + c(st.c ? R[1] : st.q ? '?' : '', 'dg rs');
  return `<div class="p2mc">${g}</div>`;
}
function simMcCol(list, op) {
  let idx = 0; const box = h('div', { class: 'colstack' });
  const draw = () => { const [a, b] = list[idx], A = [mcM(a), mcC(a)], B = [mcM(b), mcC(b)], add = op === '+', r = add ? a + b : a - b; box.innerHTML = '';
    const fig = h('div', { class: 'p4colwrap' }), note = fNote(), fin = h('div', { class: 'fbig p4est' }), st = {}; const paint = () => fig.innerHTML = p2mcColHTML(a, b, op, st);
    const steps = add ? [() => { const s = A[1] + B[1]; st.c = 1; if (s >= 100) st.x = 1; note.innerHTML = `บวก<b>เซนติเมตร</b>: ${A[1]} + ${B[1]} = ${s}` + (s >= 100 ? ` → ครบ 100 ซม. = 1 ม. <b>ทด 1 ไปหลักเมตร</b> เหลือ ${s - 100} ซม.` : ''); },
                         () => { st.m = 1; note.innerHTML = `บวก<b>เมตร</b>: ${A[0]} + ${B[0]}${A[1] + B[1] >= 100 ? ' + 1 (ที่ทดมา)' : ''} = ${mcM(r)}`; }]
      : [...(A[1] < B[1] ? [() => { st.x = 1; note.innerHTML = `${A[1]} ซม. ลบ ${B[1]} ซม. ไม่ได้ → <b>กระจาย 1 เมตร = 100 เซนติเมตร</b>: ${A[1]} + 100 = ${A[1] + 100}`; }] : []),
         () => { st.c = 1; const ca = A[1] < B[1] ? A[1] + 100 : A[1]; note.innerHTML = `ลบ<b>เซนติเมตร</b>: ${ca} − ${B[1]} = ${ca - B[1]}`; },
         () => { st.m = 1; const ma = A[1] < B[1] ? A[0] - 1 : A[0]; note.innerHTML = `ลบ<b>เมตร</b>: ${ma} − ${B[0]} = ${ma - B[0]}`; }];
    let k = 0; note.innerHTML = `${mcTxt(a)} ${op} ${mcTxt(b)} — เริ่มที่<b>หลักเซนติเมตร</b>ก่อน`;
    const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); steps[k++](); sfx.pop(k + 2); paint(); if (k >= steps.length) { btn.remove(); fin.innerHTML = `${mcTxt(a, 1)} ${op} ${mcTxt(b, 1)} = <b>${mcTxt(r, 1)}</b>`; sfx.ok(); say(`ได้ ${mcTxt(r)}`, true); } } }, icon('right'), 'ทำหลักต่อไป');
    paint(); box.append(fig, note, btn, fin, list.length > 1 ? p4more(() => { idx = (idx + 1) % list.length; draw(); }, 'โจทย์ใหม่') : ''); };
  draw(); return box;
}

/* v188 (ผู้ใช้ขอ — เหมือนชายหาดตาชั่ง): บวก ลบ เมตร|เซนติเมตร บนกระดานทดแบบบทบวกลบ ตอบจากขวาไปซ้าย มีช่องทด มีการกระจาย
   ตัวเลขเป็นเซนติเมตร (3 ม. 52 ซม. = 352) → หลักสิบของเซนติเมตรครบ 10 (= 100 ซม.) ทดไปหลักหน่วยของเมตร */
const MC_PV = ['หน่วย', 'สิบ', 'ร้อย', 'พัน'];
function mcCwO(a, b, op) { const R = op === '+' ? a + b : a - b;
  return { nums: [a, b], op, split: 2, eq: `${mcTxt(a)} ${op} ${mcTxt(b)}`, ans: mcTxt(R), pv: i => i < 2 ? MC_PV[i] : MC_PV[i - 2], grp: N => [[N - 2 > 1 ? 'เมตร' : 'ม.', N - 2], ['เซนติเมตร', 2, 'u']],
    nm: i => i < 2 ? `หลัก${MC_PV[i]}ของเซนติเมตร` : `หลัก${MC_PV[i - 2]}ของเมตร`,
    info: 'กดตัวเลขทีละหลัก <b>จากขวาไปซ้าย</b> แล้วกด ✓<br>' + (op === '+' ? '<b>100 เซนติเมตร = 1 เมตร</b> → หลักสิบของเซนติเมตรครบ 10 ทดไปเมตร<br>ทด: แตะช่องเล็กเหนือหลัก' : 'เซนติเมตรไม่พอ → แตะตัวเลขเมตรด้านบน เพื่อกระจาย (<b>1 เมตร = 100 เซนติเมตร</b>)'),
    hint: op === '+' ? 'บวกจากขวาไปซ้าย หลักสิบของเซนติเมตรครบ 10 (= 100 เซนติเมตร) ทด 1 ไปหลักหน่วยของเมตร' : 'ลบจากขวาไปซ้าย เซนติเมตรไม่พอ แตะตัวเลขเมตรด้านบนเพื่อกระจาย 1 เมตร = 100 เซนติเมตร' }; }
const mcCwMount = (el, ctx, a, b, op, lab) => cwMount(el, ctx, mcCwO(a, b, op), lab);
const mcWalkT = (a, b, op) => { const o = mcCwO(a, b, op); return T(`ตัวอย่างทีละขั้น: ตั้ง${op === '+' ? 'บวก' : 'ลบ'} <b>${o.eq}</b>`, `ตัวอย่างทีละขั้น ตั้ง${op === '+' ? 'บวก' : 'ลบ'} ${o.eq}`, el => el.append(h('div', { class: 'w2cw w2walk' }, colWalk(o.nums, op, o)))); };
/* v188: เครื่องมือวัด 4 แบบ หน้าเดียว เปิดทีละภาพ */
const P2_TOOLS_INFO = [['ruler', 'ตัวเลขบอก<b>เซนติเมตร</b> วางปลายของให้ตรงกับ 0', ['วัดของสั้น ๆ เช่น ดินสอ ยางลบ', 'วัดความยาวสมุด หนังสือ']],
  ['tape', '<b>นิ่ม โค้งได้</b> พันรอบสิ่งของได้', ['วัดรอบเอว รอบศีรษะ รอบแขน', 'ช่างตัดเสื้อใช้วัดตัว']],
  ['meter', 'ยาว <b>1 เมตร</b> เท่ากับ 100 เซนติเมตร', ['วัดของยาวประมาณ 1 เมตร', 'เช่น โต๊ะ ประตู ผืนผ้า']],
  ['reel', 'ดึงออกมาได้<b>ยาวมาก</b> แล้วม้วนเก็บได้', ['วัดระยะยาว ๆ เช่น ห้อง สนาม', 'วัดความสูงของบ้าน ประตู']]];
const simP2Tools = () => toolReveal(P2_TOOLS_INFO.map(([k, how, uses]) => [p2ico(P2_TOOLS[k][1], 150), P2_TOOLS[k][0], how, uses]), 'เลือกเครื่องมือวัดให้<b>เหมาะกับสิ่งที่จะวัด</b> ✓');

/* v189: เลือกตอบ — ข้อมูลที่กำหนด (การ์ด) ทางซ้าย ตัวใหญ่ · ตัวเลือกทางขวา */
const p2PickSide = o => Object.assign(Q.p4Pick(o), { mount(bd, ctx) { const ch = choices(ctx, shuffle(o.opts.slice()).map(v => ({ value: v, label: v })), o.right, { hint: o.hint }); ch.classList.add('pp-opts'); ch.querySelectorAll('.opt').forEach(x => x.classList.add('fopt', 'txt'));
  bd.append(h('div', { class: 't6-q p4-q' }, ppSide(h('div', { class: 'p2pkfig', html: o.fig }), ch))); } });

/* ---------- question types (prefix p2) ---------- */
const P2_TOOLS = { ruler: ['ไม้บรรทัด', 't_ruler'], meter: ['ไม้เมตร', 't_meter'], tape: ['สายวัดตัว', 't_tape'], reel: ['สายวัดชนิดตลับ', 't_reel'] };
const p2toolLab = k => `<span class="p2tl">${p2ico(P2_TOOLS[k][1], 40)}<b>${P2_TOOLS[k][0]}</b></span>`;
const p2card = (name, lab, k) => `<div class="p2card">${k ? p2ico(k, 70) : ''}<b>${name}</b><span>${lab}</span></div>`, p2cards = L => `<div class="p2cards">${L.map(([n, l, k]) => p2card(n, l, k)).join('')}</div>`;
Object.assign(Q, {
  p2tool({ task, ok, opts }) {
    const q = `${task} ควรใช้เครื่องมือใดเหมาะสมที่สุด`;
    return { prompt: q, say: q, mount(bd, ctx) { bd.append(choices(ctx, shuffle(opts).map(k => ({ value: k, label: p2toolLab(k) })), ok, { hint: 'ของสั้น ๆ ใช้ไม้บรรทัด · รอบตัวหรือรอบแขนใช้สายวัดตัว (โค้งได้) · ของยาวประมาณ 1 เมตรใช้ไม้เมตร · ระยะยาว ๆ ใช้สายวัดชนิดตลับ' })); bd.querySelector('.opts').classList.add('p2tools'); } };
  },
  p2rulLen({ it }) {
    const q = `${it.name}ยาวกี่เซนติเมตร`;
    return { prompt: q + ' <small>(ลากเลื่อนบนไม้บรรทัดได้)</small>', say: q, mount(bd, ctx) { const el = simRulerDrag(it, { quiet: true }); el.querySelector('.h6-wait')?.remove(); el.querySelector('.cap').textContent = 'ลากเลื่อนได้ หรือคิดจาก ปลาย − จุดเริ่ม'; el.lastChild.remove();
      bd.append(h('div', { class: 't6-q p4-q p2q' }, el, h('div', { class: 'rowstack' }, answerBox(ctx, String(it.b - it.a), { hint: `ปลายข้างหนึ่งอยู่ที่ ${it.a} อีกข้างอยู่ที่ ${it.b} → ${it.b} − ${it.a}` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'เซนติเมตร')))); } };
  },
  p2rulCmp({ a, b }) {
    const d = Math.abs((a.b - a.a) - (b.b - b.a)), w = (a.b - a.a) > (b.b - b.a) ? 'ยาวกว่า' : 'สั้นกว่า', q = `${a.name} … ${b.name} อยู่กี่เซนติเมตร`;
    return { prompt: `เติมคำ แล้วหาว่าต่างกันกี่เซนติเมตร`, say: `${a.name} ยาวกว่าหรือสั้นกว่า ${b.name} อยู่กี่เซนติเมตร`, mount(bd, ctx) {
      const blank = h('span', { class: 'blank' }, '?'), step2 = h('div', { class: 'rowstack', style: { display: 'none' } }, answerBox(ctx, String(d), { hint: `${a.name}ยาว ${a.b - a.a} ซม. ${b.name}ยาว ${b.b - b.a} ซม. → ลบกัน` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'เซนติเมตร'));
      const ch = wordChoices({ check: (ok, hn) => { if (ok) { ch.style.display = 'none'; step2.style.display = ''; sfx.pop(4); ctx.say(`ใช่แล้ว! ${a.name}${w}${b.name} อยู่กี่เซนติเมตร`); } else ctx.check(false, hn); } }, w, blank, 'หาความยาวของแต่ละอย่างก่อน (ปลาย − จุดเริ่ม)', ['ยาวกว่า', 'สั้นกว่า']);
      bd.append(h('div', { class: 'colstack' }, h('div', { class: 'p2rwrap', html: p2rulerSVG([a, b], { names: true }) }), h('div', { class: 'sentence' }, h('span', { class: 'lab' }, a.name), blank, h('span', { class: 'lab' }, b.name), h('span', { class: 'lab' }, 'อยู่ ? เซนติเมตร')), ch, step2)); } };
  },
  /* height wall: ask 'h' (read) | 'diff' | 'word' */
  p2wall({ items, o, i, j, ask = 'h', words }) {
    const A = items[i], B = items[j ?? 0], mc = o.mc, d = A && B ? Math.abs(A.cm - B.cm) : 0;
    const q = ask === 'h' ? `${A.name}สูง${mc && A.cm >= 100 ? 'กี่เมตร กี่เซนติเมตร' : 'กี่เซนติเมตร'}` : ask === 'diff' ? `${A.name}${A.cm > B.cm ? 'สูงกว่า' : 'เตี้ยกว่า'}${B.name}อยู่กี่เซนติเมตร` : `${A.name} … ${B.name}`;
    return { prompt: ask === 'word' ? 'เลือกคำเติมในช่องว่าง' : q, say: ask === 'word' ? `${A.name} สูงกว่า หรือเตี้ยกว่า ${B.name}` : q, mount(bd, ctx) {
      const fig = h('div', { class: 'p2wwrap', html: p2wallSVG(items, { ...o, guides: true, plate: false }) });
      if (ask === 'word') { const blank = h('span', { class: 'blank' }, '?'), W = words || ['สูงกว่า', 'เตี้ยกว่า'], r = A.cm > B.cm ? W[0] : A.cm < B.cm ? W[1] : W[2];
        bd.append(ppSide(fig, h('div', { class: 'colstack' }, h('div', { class: 'sentence p2wsen' }, h('span', { class: 'lab' }, A.name), blank, h('span', { class: 'lab' }, B.name)), wordChoices(ctx, r, blank, 'ดูเส้นประที่ยอดของทั้งสองตัว แล้วอ่านตัวเลขบนไม้วัด', W)))); bd.classList.add('p2wsd'); return; } /* v189: รูปซ้าย ตอบขวา */
      const hint = ask === 'h' ? `ดูเส้นประจากยอด${A.name}ไปที่ไม้วัด อ่านตัวเลข${mc ? ' แล้วเปลี่ยน 100 เซนติเมตร เป็น 1 เมตร' : ''}` : `${A.name}สูง ${A.cm} ซม. ${B.name}สูง ${B.cm} ซม. → ลบกัน`;
      bd.append(ppSide(fig, ask === 'h' && mc && A.cm >= 100 ? mcInput(ctx, A.cm, { hint }) : ppAns(ctx, ask === 'h' ? A.cm : d, hint, 'เซนติเมตร'))); bd.classList.add('p2wsd'); } };
  },
  /* tap the tallest / shortest one right on the wall */
  p2wallTap({ items, o, ask }) {
    const t = items.reduce((b, it, i) => (ask === 'tall' ? it.cm > items[b].cm : it.cm < items[b].cm) ? i : b, 0), q = `แตะที่ภาพ: ตัวใด<span class="hl">${ask === 'tall' ? 'สูงที่สุด' : 'เตี้ยที่สุด'}</span>`;
    return { prompt: q, say: `แตะที่ภาพ ตัวใด${ask === 'tall' ? 'สูงที่สุด' : 'เตี้ยที่สุด'}`, mount(bd, ctx) {
      const fig = h('div', { class: 'p2wwrap ia tap', html: p2wallSVG(items, { ...o, guides: true }) });
      fig.querySelectorAll('.p2w-it').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); if (fig.dataset.done) return; const ok = +g.dataset.i === t;
        if (ok) { fig.dataset.done = 1; g.classList.add('on'); } else { g.classList.remove('bad'); void g.getBBox(); g.classList.add('bad'); }
        ctx.check(ok, ask === 'tall' ? 'ดูว่ายอดของใครอยู่สูงที่สุดบนไม้วัด' : 'ดูว่ายอดของใครอยู่ต่ำที่สุดบนไม้วัด'); }));
      bd.append(h('div', { class: 'colstack p2wtap' }, fig, h('div', { class: 'cap ixcap' }, 'แตะที่ตัวในภาพได้เลย'))); } };
  },
  /* build a length out of metre sticks and centimetres */
  p2build({ cm }) {
    const q = `สร้างความยาว <span class="hl">${fmt(cm)} เซนติเมตร</span> ด้วยไม้เมตรและเซนติเมตร`;
    return { prompt: q, say: `สร้างความยาว ${cm} เซนติเมตร ด้วยไม้เมตรและเซนติเมตร`, mount(bd, ctx) { const mb = p2meter();
      bd.append(h('div', { class: 'colstack' }, mb, checkButton('ตรวจคำตอบ', () => { const v = mb.val(); ctx.check(v === cm, v > cm ? `ยาวเกินไป — ${fmt(cm)} เซนติเมตร = ${mcTxt(cm)}` : `ยังสั้นไป — 100 เซนติเมตร = 1 เมตร ดังนั้น ${fmt(cm)} เซนติเมตร มีกี่เมตร?`); }))); } };
  },
  /* convert: 'mc' (cm → m cm) | 'cm' (m cm → cm) */
  p2conv({ cm, to }) {
    const q = to === 'mc' ? `${fmt(cm)} เซนติเมตร เท่ากับกี่เมตร กี่เซนติเมตร` : `${mcTxt(cm)} เท่ากับกี่เซนติเมตร`;
    return { prompt: q, say: q, mount(bd, ctx) { const big = h('div', { class: 'fbig p4big' }, h('b', { class: 'num' }, to === 'mc' ? `${fmt(cm)} ซม.` : mcTxt(cm, 1)), h('span', { class: 'fop' }, ' = '), h('span', { class: 'fsign' }, '?'));
      bd.append(h('div', { class: 'colstack' }, big, to === 'mc' ? mcInput(ctx, cm, { hint: `100 เซนติเมตร = 1 เมตร → ${fmt(cm)} = ${fmt(mcM(cm) * 100)} + ${mcC(cm)}` }) : h('div', { class: 'rowstack' }, answerBox(ctx, String(cm), { hint: `${mcM(cm)} เมตร = ${fmt(mcM(cm) * 100)} เซนติเมตร แล้วบวก ${mcC(cm)} เซนติเมตร` }), h('span', { class: 'cap', style: { fontSize: '20px' } }, 'เซนติเมตร')))); ctx.onRight = () => { const f = bd.querySelector('.fsign'); if (f) { f.textContent = to === 'mc' ? mcTxt(cm) : `${fmt(cm)} เซนติเมตร`; f.classList.add('w2done'); } }; } };
  },
  /* sentence comparison with mixed units: a, b = [name, label, cm, art?] — v187: art = ภาพประกอบ (ไม่บอกคำตอบ) */
  p2cmpWord({ a, b, words, pre = '', hint }) {
    const r = a[2] > b[2] ? words[0] : a[2] < b[2] ? words[1] : words[2];
    return { prompt: 'เลือกคำเติมในช่องว่าง', say: `${pre}${a[0]} กับ ${pre}${b[0]} เลือกคำเติมในช่องว่าง`, mount(bd, ctx) { const blank = h('span', { class: 'blank' }, '?');
      bd.append(h('div', { class: 'colstack' }, h('div', { class: 'sentence cmp2' }, h('span', { class: 'lab' + (a[3] ? ' cmp-l' : ''), html: (a[3] ? `<span class="cmp-pic">${p2ico(a[3], 110)}</span>` : '') + `<span>${pre}${a[0]} <b class="cv">${a[1]}</b></span>` }), blank, h('span', { class: 'lab' + (b[3] ? ' cmp-l' : ''), html: (b[3] ? `<span class="cmp-pic">${p2ico(b[3], 110)}</span>` : '') + `<span>${pre}${b[0]} <b class="cv">${b[1]}</b></span>` })),
        wordChoices(ctx, r, blank, hint || 'เปลี่ยนให้เป็นเซนติเมตรทั้งคู่ก่อน (1 เมตร = 100 เซนติเมตร) แล้วเปรียบเทียบ', words))); } };
  },
  /* distance on the map: tap roads to mark the route, then pick the distance */
  p2mapQ({ M, q, a, opts }) {
    return { prompt: q + ' <small>(แตะถนนเพื่อทำเครื่องหมายได้)</small>', say: q, mount(bd, ctx) { const fig = h('div', { class: 'p2mwrap ia', html: p2mapSVG(M) }); p2mapTap(fig);
      bd.append(h('div', { class: 't6-q p4-q p2q' }, fig, choices(ctx, shuffle(opts).map(v => ({ value: v, label: fmt(v) + ' เมตร' })), a, { hint: 'แตะถนนที่ผ่านทีละเส้น แล้วบวกระยะทางของถนนเหล่านั้น' }))); bd.querySelectorAll('.opt').forEach(o => o.classList.add('fopt', 'txt')); } };
  },
  /* metre | centimetre column sum or difference */
  p2mcCol({ a, b, op, text }) { const q = text || `${mcTxt(a)} ${op === '+' ? 'รวมกับ' : 'ลบด้วย'} ${mcTxt(b)} เท่ากับเท่าไร`;
    return { prompt: q, say: q, __sig: `mcc ${a}${op}${b}`, mount(bd, ctx) { const w = h('div', { class: 'w2cwq' }); bd.append(w); mcCwMount(w, ctx, a, b, op); } }; /* v188: กระดานทดแบบบทบวกลบ */
  },
  /* story: ① pick the number sentence ② answer in metres + centimetres (or centimetres) */
  p2mcStory({ text, a, b, op, fig, why }) { /* v188: คำสั่งตัวเล็ก · โจทย์ใหญ่อยู่บน เน้นคำถาม · ขั้น 1 แผนภาพซ้าย เลือกประโยคขวา · ขั้น 2 กระดานทดใหญ่ทางซ้าย */
    const S = (x, p, y) => `${mcTxt(x, 1)} ${p} ${mcTxt(y, 1)}`, right = S(a, op, b), wrong = op === '+' ? (a >= b ? S(a, '−', b) : S(b, '−', a)) : S(a, '+', b);
    return { prompt: '<span class="w2pr">อ่านโจทย์ → ดูแผนภาพ เลือกประโยคสัญลักษณ์ → ตั้งหาคำตอบ</span>', say: text.replace(/<[^>]+>/g, ''), __sig: 'mcs ' + text, mount(bd, ctx) {
      const lab = h('div', { class: 'p4steplab w2stlab', html: 'ขั้นที่ 1: เลือก<b>ประโยคสัญลักษณ์</b>' }), slot = h('div', { class: 'colstack w2stslot' });
      const sub = { check: (ok, hn) => { if (!ok) return ctx.check(false, hn); sfx.pop(4); lab.innerHTML = `<b>${right} = ?</b> ✓ · ขั้นที่ 2: ตั้ง${op === '+' ? 'บวก' : 'ลบ'}หาคำตอบ`; slot.innerHTML = ''; mcCwMount(slot, ctx, a, b, op, lab); ctx.say('ใช่แล้ว! ตั้งให้ตรงหลัก แล้วหาคำตอบจากขวาไปซ้าย'); } };
      const ch = choices(sub, shuffle([right, wrong]).map(x => ({ value: x, label: x })), right, { hint: why || (op === '+' ? 'โจทย์ถามความยาวรวม หรือสิ่งที่ยาวกว่า → บวก' : 'โจทย์ถามส่วนที่เหลือ ผลต่าง หรือสิ่งที่สั้นกว่า → ลบ') });
      slot.append(fig ? h('div', { class: 'g4sd p2sd pp-sd mcst1' }, h('div', { class: 'p2sd-l', html: fig }), h('div', { class: 'g4sd-r' }, lab, ch)) : h('div', { class: 'colstack' }, lab, ch));
      bd.append(h('div', { class: 'colstack w2st' }, h('div', { class: 'storybox w2stq', html: text.replace(/\s(\S*เท่า(?:ไร|ใด))$/, ' <b class="w2qhl">$1</b>') }), slot)); } };
  }
});

/* ---------- data: teaching (not used in the games) ---------- */
const P2L_T_WALL = [{ e: 'kid0', name: 'ต้นข้าว', cm: 120 }, { e: 'kid3', name: 'ใบเตย', cm: 110 }, { e: 'teddy', name: 'ตุ๊กตาหมี', cm: 60 }, { e: 'dog', name: 'ถุงทอง', cm: 40 }]; /* v189: ทุกค่าตรงขีด อ่านได้ไม่ต้องกะ */
const P2L_T_WALL2 = [{ e: 'camel', name: 'อูฐ', cm: 160 }, { e: 'lion', name: 'สิงโต', cm: 110 }, { e: 'ostrich', name: 'นกกระจอกเทศ', cm: 130 }, { e: 'kid4', name: 'น้องฟ้า', cm: 120 }];
const P2L_T_JUMP = [{ name: 'ต้นกล้า', cm: 345 }, { name: 'ปุยฝ้าย', cm: 308 }, { name: 'ภูผา', cm: 362 }, { name: 'ใบบัว', cm: 297 }];
const P2L_T_MAP = { W: 560, H: 330, nodes: { home: [70, 250, 'บ้านต้นกล้า', 'house'], shop: [250, 60, 'ร้านไอศกรีม', 'shop', -1], school: [490, 230, 'โรงเรียน', 'school'], palm: [280, 290, 'สวนมะพร้าว', 'palm'] },
  edges: [['home', 'shop', 315, -36, 0], ['shop', 'school', 480, 36, -4], ['home', 'palm', 260, 0, 18], ['palm', 'school', 590, 0, 20]] };
/* ---------- data: practice — pictures are redrawn, values read or set to fit them ---------- */
const P2W_TOOL = [['วัดความยาวดินสอ', 'ruler', ['ruler', 'tape', 'reel']], ['วัดรอบเอวเพื่อทำชุดนักเรียน', 'tape', ['tape', 'ruler', 'meter']], ['วัดความสูงของประตูบ้าน', 'reel', ['reel', 'ruler', 'tape']],
  ['วัดความยาวรอบต้นแขน', 'tape', ['tape', 'ruler', 'meter']], ['วัดความยาวโต๊ะเรียนในห้อง', 'meter', ['meter', 'tape', 'ruler']], ['วัดความยาวสมุด', 'ruler', ['ruler', 'reel', 'meter']], ['วัดระยะจากหน้าบ้านไปโรงรถ', 'reel', ['reel', 'ruler', 'tape']]];
const P2W_RUL = [{ k: 'brush', name: 'พู่กัน', a: 2, b: 12, col: 'yellow' }, { k: 'pencil', name: 'ดินสอ', a: 3, b: 17, col: 'mint' }, { k: 'eraser', name: 'ยางลบ', a: 13, b: 16 }, { k: 'pen', name: 'ปากกา', a: 5, b: 18 }, { k: 'sharpener', name: 'กบเหลาดินสอ', a: 7, b: 9 }];
const P2W_WALL2 = { items: [{ e: 'kid1', name: 'สมหญิง', cm: 60 }, { e: 'kid2', name: 'สมรัก', cm: 75 }, { e: 'cat', name: 'โกโก้', cm: 35 }, { e: 'teddy', name: 'หมี', cm: 70 }], o: { max: 80 } };
const P2W_WALL4 = { items: [{ e: 'girl', name: 'ผู้หญิง', cm: 95 }, { e: 'dog', name: 'สุนัข', cm: 50 }, { e: 'rabbit', name: 'กระต่าย', cm: 35 }, { e: 'cat', name: 'แมว', cm: 30 }], o: { max: 100 } };
const P2W_WALL5 = { items: [{ e: 'tv', name: 'โทรทัศน์', cm: 60 }, { e: 'sofa', name: 'โซฟา', cm: 80 }, { e: 'lamp', name: 'โคมไฟ', cm: 110 }, { e: 'fridge', name: 'ตู้เย็น', cm: 140 }], o: { max: 150 } };
const P2W_WALL6 = { items: [{ e: 'ostrich', name: 'นกกระจอกเทศ', cm: 150 }, { e: 'giraffe', name: 'ยีราฟ', cm: 190 }, { e: 'elephant', name: 'ช้าง', cm: 130 }, { e: 'goat', name: 'แพะ', cm: 110 }], o: { max: 200, mc: true } };
const P2W_WALL10 = { items: [{ e: 'elephant', name: 'ช้าง', cm: 140 }, { e: 'giraffe', name: 'ยีราฟ', cm: 180 }, { e: 'lion', name: 'สิงโต', cm: 90 }, { e: 'chick', name: 'ไก่', cm: 50 }], o: { max: 200, mc: true } };
const P2W_C2M = [374, 412, 850, 902, 600, 801, 2000, 3436, 4013, 6598, 49555, 80167, 45609, 79720];
const P2W_M2C = [300, 711, 124, 210, 601, 506, 5932, 2149, 4304, 9019, 48677, 61498, 90036, 48530, 80158];
const P2W_EST = [['door', 'ความสูงของประตู', true], ['car', 'ความยาวของรถยนต์', true], ['bed', 'ความยาวของเตียงนอน', true], ['pencil', 'ความยาวของดินสอ', false], ['book', 'ความยาวของหนังสือ', false]];
const P2W_JAV = [{ name: 'สมชาย', cm: 5112 }, { name: 'สมใจ', cm: 5232 }, { name: 'สมปอง', cm: 5273 }, { name: 'สมรัก', cm: 5199 }];
const P2W_ANI = [['แพะ', '90 ซม.', 90, 'goat'], ['สิงโต', '1 ม. 20 ซม.', 120, 'lion'], ['อูฐ', '210 ซม.', 210, 'camel'], ['ช้าง', '2 ม. 20 ซม.', 220, 'elephant'], ['นกกระจอกเทศ', '1 ม. 80 ซม.', 180, 'ostrich'], ['หมีแพนด้า', '105 ซม.', 105, 'panda']]; /* v188: มีภาพประกอบทุกตัว */
const P2W_LONG = [['เชือก', '8 ม. 80 ซม.', 880, 'rope'], ['ผืนธง', '345 ซม.', 345, 'flag'], ['ท่อนซุง', '515 ซม.', 515, 'log'], ['ไม้เมตร', '1 ม.', 100, 't_meter'], ['เรือ', '880 ซม.', 880, 'boat'], ['ไม้กวาด', '1 ม. 5 ซม.', 105, 'broom']];
const P2W_LONGQ = [[3, 1], [4, 2], [5, 0], [2, 1], [3, 5], [0, 4], [3, 2], [4, 1]];
const P2W_TALL = [['อาคารสำนักงาน', '221 ม. 90 ซม.', 22190], ['เสาธง', '450 ซม.', 450], ['อนุสาวรีย์', '25 ม. 44 ซม.', 2544], ['บ้าน', '4 ม. 50 ซม.', 450], ['ภูเขา', '900 ม. 73 ซม.', 90073], ['อะพาร์ตเมนต์', '205 ซม.', 205]];
const P2W_MAP = { W: 560, H: 360, nodes: { hosp: [70, 70, 'โรงพยาบาล', 'hospital', -1], school: [360, 52, 'โรงเรียน', 'school', -1], park: [220, 175, 'สวนสาธารณะ', 'park'], shop: [490, 280, 'ร้านค้า', 'shop'], home: [140, 300, 'บ้านพิมพา', 'house'] },
  edges: [['hosp', 'school', 370, 0, -14], ['hosp', 'park', 226, 6, -14], ['hosp', 'home', 542, -40, 0], ['home', 'park', 321, 26, 8], ['park', 'school', 384, -20, 12], ['school', 'shop', 595, 32, -6], ['park', 'shop', 650, 4, 16], ['home', 'shop', 945, 0, 16]] }; /* v174: ระยะทางไม่เกิน 1,000 (ป.2) */
const P2W_MAPQ = [['พิมพาเดินทางจากบ้านไปร้านค้า (ถนนเส้นตรง) เป็นระยะทางกี่เมตร', 945, [650, 845, 954]], ['พิมพาเดินทางจากร้านค้าไปสวนสาธารณะ (ถนนเส้นตรง) เป็นระยะทางกี่เมตร', 650, [595, 384, 945]], ['พิมพาเดินทางจากบ้านไปโรงเรียนผ่านทางโรงพยาบาล เป็นระยะทางกี่เมตร', 912, [370, 812, 705]],
  ['พิมพาเดินทางจากบ้านไปโรงเรียนผ่านสวนสาธารณะ เป็นระยะทางกี่เมตร', 705, [912, 805, 384]], ['พิมพาเดินทางจากโรงเรียนไปร้านค้า (ถนนเส้นตรง) เป็นระยะทางกี่เมตร', 595, [650, 370, 695]]];
const P2W_TRIP = [['วัด', '10 ม. 25 ซม.', 1025], ['ตลาด', '1,025 ซม.', 1025, 'shop'], ['โรงพยาบาล', '1,008 ซม.', 1008, 'hospital'], ['สนามกีฬา', '11 ม. 50 ซม.', 1150, 'park']];
const P2W_COL = [[352, 615, '+', '3 เมตร 52 เซนติเมตร บวกกับ 6 เมตร 15 เซนติเมตร ได้ผลลัพธ์เท่าใด'], [1479, 236, '−', '14 เมตร 79 เซนติเมตร ยาวกว่า 2 เมตร 36 เซนติเมตร อยู่เท่าใด'], [495, 766, '+', '495 เซนติเมตร บวกกับ 7 เมตร 66 เซนติเมตร ได้ผลลัพธ์เท่าใด'], [571, 423, '−', '423 เซนติเมตร สั้นกว่า 5 เมตร 71 เซนติเมตร อยู่เท่าใด'],
  [6735, 2278, '+', '67 เมตร 35 เซนติเมตร บวกกับ 22 เมตร 78 เซนติเมตร ได้ผลลัพธ์เท่าใด'], [4707, 3199, '+', '47 เมตร 7 เซนติเมตร รวมกับ 31 เมตร 99 เซนติเมตร เท่ากับเท่าไร'], [7390, 5418, '−', '54 เมตร 18 เซนติเมตร น้อยกว่า 73 เมตร 90 เซนติเมตร อยู่เท่าไร'], [8205, 4467, '−', '82 เมตร 5 เซนติเมตร มากกว่า 44 เมตร 67 เซนติเมตร อยู่เท่าไร'],
  [268, 321, '+', '2 เมตร 68 เซนติเมตร รวมกับ 3 เมตร 21 เซนติเมตร เท่ากับเท่าไร'], [905, 378, '−', '9 เมตร 5 เซนติเมตร ลบด้วย 3 เมตร 78 เซนติเมตร เหลือเท่าไร']];
const p2pw = (a, b, l1, l2, lw = 'รวม') => p4pwSVG({ w: a + b, p1: a, p2: b, unk: 'w', lw, l1, l2, fv: v => mcTxt(v, 1) });
const p2cmp = (big, small, nb, ns, unk) => p4cmpSVG({ big, small, nb, ns, unk, fv: v => mcTxt(v, 1) });
const S2L = (text, a, b, op, fig) => ({ text, a, b, op, fig });
const p2pwT = (w, p1, l1, l2) => p4pwSVG({ w, p1, p2: w - p1, unk: '2', lw: 'ทั้งหมด', l1, l2, fv: v => mcTxt(v, 1) });
const P2W_ST1 = [
  S2L('ชั้นวางของตัวแรกสูง 215 เซนติเมตร ตัวที่สองสูง 3 เมตร 28 เซนติเมตร ถ้านำมาวางซ้อนกันจะสูงรวมเท่าไร', 215, 328, '+', p2pw(215, 328, 'ชั้นแรก', 'ชั้นที่สอง', 'สูงรวม')),
  S2L('ยีราฟตัวลูกสูง 4 เมตร 24 เซนติเมตร ม้าเตี้ยกว่ายีราฟตัวลูก 98 เซนติเมตร ม้าสูงเท่าใด', 424, 98, '−', p2cmp(424, 326, 'ยีราฟ', 'ม้า', 'small')),
  S2L('เรือพายยาว 3 เมตร 40 เซนติเมตร เรือคายักยาว 275 เซนติเมตร เรือพายยาวกว่าเรือคายักเท่าไร', 340, 275, '−', p2cmp(340, 275, 'เรือพาย', 'เรือคายัก', 'diff')),
  S2L('ฟ้าเดินจากบ้านไปตลาด 19 เมตร 41 เซนติเมตร แล้วเดินกลับทางเดิม ฟ้าเดินทั้งไปและกลับรวมกี่เมตร กี่เซนติเมตร', 1941, 1941, '+', p2pw(1941, 1941, 'ขาไป', 'ขากลับ', 'ไปกลับ')),
  S2L('ช่างตัดผ้าใช้ผ้าลายดอก 25 เมตร 48 เซนติเมตร และผ้าสีพื้น 3 เมตร 11 เซนติเมตร ใช้ผ้ารวมทั้งหมดเท่าไร', 2548, 311, '+', p2pw(2548, 311, 'ผ้าลายดอก', 'ผ้าสีพื้น', 'ทั้งหมด')),
  S2L('เสาสัญญาณสูง 11 เมตร 97 เซนติเมตร บ้านหลังหนึ่งเตี้ยกว่าเสาสัญญาณ 9 เมตร 98 เซนติเมตร บ้านหลังนี้สูงเท่าไร', 1197, 998, '−', p2cmp(1197, 199, 'เสาสัญญาณ', 'บ้าน', 'small')),
  S2L('ริบบิ้นยาว 6 เมตร 10 เซนติเมตร แม่ตัดไปผูกของขวัญ 1 เมตร 45 เซนติเมตร เหลือริบบิ้นยาวเท่าไร', 610, 145, '−', p2pwT(610, 145, 'ตัดไป', 'เหลือ')),
  S2L('ลู่วิ่งยาว 9 เมตร 50 เซนติเมตร ต้นวิ่งไปแล้ว 3 เมตร 75 เซนติเมตร ต้องวิ่งอีกเท่าไรจึงจะถึงปลายลู่', 950, 375, '−', p2pwT(950, 375, 'วิ่งไปแล้ว', 'ต้องวิ่งอีก')),
  S2L('ท่อน้ำท่อนแรกยาว 3 เมตร 65 เซนติเมตร ท่อนที่สองยาว 245 เซนติเมตร นำมาต่อกันจะยาวเท่าไร', 365, 245, '+', p2pw(365, 245, 'ท่อนแรก', 'ท่อนที่สอง', 'ต่อกัน'))];
const P2W_ST2 = [
  S2L('จิงโจ้กระโดดได้สูง 3 เมตร 56 เซนติเมตร ซึ่งสูงกว่าแมว 40 เซนติเมตร แมวกระโดดได้สูงเท่าไร', 356, 40, '−', p2cmp(356, 316, 'จิงโจ้', 'แมว', 'small')),
  S2L('ทางจากตลาดไปสวนสัตว์ยาว 765 เมตร 65 เซนติเมตร ซึ่งไกลกว่าทางจากตลาดไปห้องสมุด 275 เมตร 97 เซนติเมตร ทางจากตลาดไปห้องสมุดยาวเท่าใด', 76565, 27597, '−', p2cmp(76565, 48968, 'ไปสวนสัตว์', 'ไปห้องสมุด', 'small')),
  S2L('วันจันทร์เบลล์ปั่นจักรยานได้ 390 เมตร 25 เซนติเมตร วันอังคารปั่นได้มากกว่าวันจันทร์ 155 เมตร 98 เซนติเมตร วันอังคารเบลล์ปั่นได้ระยะทางเท่าไร', 39025, 15598, '+', p2cmp(54623, 39025, 'วันอังคาร', 'วันจันทร์', 'big')),
  S2L('บ้านของโมอยู่ห่างตลาด 691 เมตร บ้านของปุ๊กอยู่ห่างตลาด 551 เมตร 98 เซนติเมตร บ้านของโมอยู่ไกลกว่าบ้านของปุ๊กเท่าไร', 69100, 55198, '−', p2cmp(69100, 55198, 'บ้านโม', 'บ้านปุ๊ก', 'diff')),
  S2L('สะพานไม้ยาว 18 เมตร 25 เซนติเมตร ซึ่ง<b>สั้นกว่า</b>สะพานหิน 6 เมตร 90 เซนติเมตร สะพานหินยาวเท่าไร', 1825, 690, '+', p2cmp(2515, 1825, 'สะพานหิน', 'สะพานไม้', 'big')),
  S2L('ว่าวของพลอยลอยสูง 35 เมตร 40 เซนติเมตร ว่าวของฟ้าลอยสูงกว่าว่าวของพลอย 12 เมตร 75 เซนติเมตร ว่าวของฟ้าลอยสูงเท่าไร', 3540, 1275, '+', p2cmp(4815, 3540, 'ว่าวของฟ้า', 'ว่าวของพลอย', 'big')),
  S2L('ต้นกล้วยสูง 2 เมตร 85 เซนติเมตร ต้นมะละกอสูงกว่าต้นกล้วย 1 เมตร 40 เซนติเมตร ต้นมะละกอสูงเท่าไร', 285, 140, '+', p2cmp(425, 285, 'ต้นมะละกอ', 'ต้นกล้วย', 'big')),
  S2L('สายไฟสีแดงยาว 8 เมตร 20 เซนติเมตร สายไฟสีดำสั้นกว่าสายไฟสีแดง 2 เมตร 65 เซนติเมตร สายไฟสีดำยาวเท่าไร', 820, 265, '−', p2cmp(820, 555, 'สีแดง', 'สีดำ', 'small')),
  S2L('ราวตากผ้าบ้านนิดยาว 5 เมตร 30 เซนติเมตร ราวตากผ้าบ้านหน่อยยาว 3 เมตร 75 เซนติเมตร ราวบ้านนิดยาวกว่าเท่าไร', 530, 375, '−', p2cmp(530, 375, 'บ้านนิด', 'บ้านหน่อย', 'diff')),
  S2L('บ้านแก้วอยู่ห่างโรงเรียน 450 เมตร 60 เซนติเมตร ซึ่งใกล้กว่าบ้านกล้า 125 เมตร 75 เซนติเมตร บ้านกล้าอยู่ห่างโรงเรียนเท่าไร', 45060, 12575, '+', p2cmp(57635, 45060, 'บ้านกล้า', 'บ้านแก้ว', 'big'))];

/* ---------- lessons ---------- */
const L2L = (no, place, title, short, goal, teach, game) => ({ id: 80 + no, place, title, short, tone: TONES5[(no + 3) % 6], goal, teach, game, gameN: 10 }); /* v188: เกมละ 10 ข้อ */
const P2W_CMPH = ['สูงกว่า', 'เตี้ยกว่า', 'สูงเท่ากับ'], P2W_CMPL = ['ยาวกว่า', 'สั้นกว่า', 'ยาวเท่ากับ'], P2W_CMPD = ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'];
const p2wq = (W, x) => Q.p2wall({ items: reshuffle(W.items), o: W.o, ...x });
const p2wallSort = (W, dir) => Q.ixSort({ side: 'v', q: `เรียงชื่อตามความสูงจาก<span class="hl">${dir === 'asc' ? 'เตี้ยที่สุดไปสูงที่สุด' : 'สูงที่สุดไปเตี้ยที่สุด'}</span>`, fig: p2wallSVG(W.items, { ...W.o, guides: true }), items: W.items.map(it => ({ label: it.name, v: it.cm })), dir, slotLabels: dir === 'asc' ? ['เตี้ยที่สุด', '', '', 'สูงที่สุด'] : ['สูงที่สุด', '', '', 'เตี้ยที่สุด'] });
const LESSONS_P2C3 = [
  L2L(1, 'หาดไม้บรรทัด', 'การวัดความยาวเป็นเมตรและเซนติเมตร', 'วัดเป็น ม. และ ซม.', 'เลือกเครื่องมือวัดให้เหมาะสม วัดความยาวที่ไม่ได้เริ่มที่ 0 และวัดความสูงเป็นเซนติเมตร เมตรและเซนติเมตร',
    [T('ยินดีต้อนรับสู่ <b>ชายหาดวัดความยาว</b>! รู้จัก<b>เครื่องมือวัด</b>แบบต่าง ๆ — กดเปิดทีละภาพ', 'ยินดีต้อนรับสู่ชายหาดวัดความยาว รู้จักเครื่องมือวัดแบบต่าง ๆ กดเปิดทีละภาพ', el => el.append(simP2Tools())),
     T('หน่วย <b>เซนติเมตร เมตร</b> และการ<b>อ่านไม้บรรทัด</b>', 'หน่วยเซนติเมตร เมตร และการอ่านไม้บรรทัด', el => el.append(picWalk([
       ['หน่วยความยาว', '<b>เซนติเมตร</b> ใช้กับของสั้น ๆ · <b>เมตร</b> ใช้กับของยาว ๆ', `<div class="p2rwrap">${p2rulerSVG([{ k: 'pencil', name: 'ดินสอ', a: 0, b: 12, col: 'mint' }])}</div>`],
       ['1 เมตร = 100 เซนติเมตร', 'ไม้เมตร 1 อัน ยาวเท่ากับ <b>100 เซนติเมตร</b>', lrow(p2ico('t_meter', 300), lbig('1 เมตร = 100 เซนติเมตร'))],
       ['ตัวเลขบนไม้บรรทัด', 'จากเลขหนึ่งไปเลขถัดไปยาว <b>1 เซนติเมตร</b>', `<div class="p2rwrap">${p2rulerSVG([{ k: 'pencil', name: 'ดินสอ', a: 0, b: 12, col: 'mint' }])}</div>`],
       ['วัดจาก 0', 'วางปลายดินสอให้ตรงกับ <b>0</b> แล้วอ่านเลขที่ปลายอีกข้าง → ดินสอยาว <b>12 เซนติเมตร</b>', `<div class="p2rwrap">${p2rulerSVG([{ k: 'pencil', name: 'ดินสอ', a: 0, b: 12, col: 'mint' }])}</div>`],
       ['ไม่เริ่มที่ 0 ก็วัดได้', 'ดินสอเริ่มที่ 3 ปลายอยู่ที่ 9 → ยาว 9 − 3 = <b>6 เซนติเมตร</b>', `<div class="p2rwrap">${p2rulerSVG([{ k: 'pencil', name: 'ดินสอ', a: 3, b: 9, col: 'coral' }])}</div>`]],
       'ความยาว = <b>ปลาย − จุดเริ่ม</b> · 1 เมตร = 100 เซนติเมตร'))),
     T('ลองจับคู่: สิ่งที่จะวัดกับเครื่องมือ', 'ลองจับคู่ สิ่งที่จะวัดกับเครื่องมือ',
       qPlay(Q.ixMatch({ rows: 1, q: 'จับคู่สิ่งที่จะวัดกับเครื่องมือ', pairs: [['ความยาวยางลบ', p2toolLab('ruler')], ['รอบศีรษะ', p2toolLab('tape')], ['ความสูงโต๊ะครู', p2toolLab('meter')], ['ความยาวสนามเด็กเล่น', p2toolLab('reel')]] }), 'สายวัดตัวโค้งได้ ใช้วัดรอบตัว')),
     T('ไม่ต้องเริ่มที่ 0 ก็วัดได้! <b>ลากดินสอ</b>ไปวางตรงไหนก็ได้ ความยาว = ปลาย − จุดเริ่ม', 'ไม่ต้องเริ่มที่ศูนย์ก็วัดได้ ลากดินสอไปวางตรงไหนก็ได้ ความยาว เท่ากับ ปลาย ลบ จุดเริ่ม', el => el.append(simRulerDrag({ k: 'pencil', name: 'ดินสอ', a: 4, b: 13, col: 'coral' }))),
     T('ตัวอย่างทีละขั้น: ปากกาวางเริ่มที่ 6', 'ตัวอย่างทีละขั้น', p4ex([['① จุดเริ่ม', 'ปลายข้างหนึ่งตรงกับเลข 6'], ['② ปลายอีกข้าง', 'ตรงกับเลข 18'], ['③ ลบกัน', '18 − 6 = 12']], 'ปากกายาว <b>12 เซนติเมตร</b>', '', () => h('div', { class: 'p2rwrap', html: p2rulerSVG([{ k: 'pen', name: 'ปากกา', a: 6, b: 18 }]) }))),
     T('วัด<b>ความสูง</b>: เลื่อน<b>แถบสีแดง</b>ลงมาแตะยอดศีรษะของแต่ละคน', 'วัดความสูง เลื่อนแถบสีแดงลงมาแตะยอดศีรษะของแต่ละคน', el => el.append(simWall(P2L_T_WALL, { max: 140, snap: 10 }))),
     T('ตัวอย่างทีละขั้น: ใครสูงกว่า สูงกว่ากี่เซนติเมตร', 'ตัวอย่างทีละขั้น', p4ex([['① อ่านค่า', 'ต้นข้าวสูง 120 ซม. · ใบเตยสูง 110 ซม.'], ['② เปรียบเทียบ', '120 > 110 → ต้นข้าวสูงกว่า'], ['③ ผลต่าง', '120 − 110 = 10']], 'ต้นข้าว<b>สูงกว่า</b>ใบเตย <b>10 เซนติเมตร</b>'))],
    () => { const r = shuffle(P2W_RUL); return [...pkF(P2W_TOOL, 2).map(([task, ok, opts]) => Q.p2tool({ task, ok, opts })), Q.p2rulLen({ it: r[0] }), Q.p2rulCmp({ a: r[1], b: r[2] }),
      p2wq(P2W_WALL2, { i: rnd(0, 3) }), Q.p2wallTap({ ...pick([P2W_WALL4, P2W_WALL5]), ask: pick(['tall', 'short']) }), p2wq(P2W_WALL6, { i: rnd(0, 3) })]; }),
  L2L(2, 'หาดร้อยเซนติ', 'ความสัมพันธ์ระหว่างเมตรกับเซนติเมตร', 'เมตร ↔ เซนติเมตร', 'บอกความสัมพันธ์ 1 เมตร = 100 เซนติเมตร เปลี่ยนหน่วยความยาว และคาดคะเนความยาวเป็นเมตร',
    [T('กดสร้างความยาวด้วย<b>ไม้เมตร</b>และ<b>เซนติเมตร</b> — ครบ 100 เซนติเมตร จะกลายเป็น 1 เมตร!', 'กดสร้างความยาวด้วยไม้เมตรและเซนติเมตร ครบหนึ่งร้อยเซนติเมตร จะกลายเป็นหนึ่งเมตร', el => el.append(simMeterBuild([125, 230, 307]))),
     T('ตัวอย่างทีละขั้น: 527 เซนติเมตร = ? เมตร ? เซนติเมตร', 'ตัวอย่างทีละขั้น', p4ex([['① แยก', '527 = 500 + 27'], ['② 100 ซม. = 1 ม.', '500 เซนติเมตร = 5 เมตร'], ['③ รวม', '5 เมตร 27 เซนติเมตร']], '527 ซม. = <b>5 ม. 27 ซม.</b>')),
     T('ตัวอย่างทีละขั้น: 8 เมตร 3 เซนติเมตร = ? เซนติเมตร', 'ตัวอย่างทีละขั้น', p4ex([['① เมตร → เซนติเมตร', '8 เมตร = 800 เซนติเมตร'], ['② บวกเซนติเมตร', '800 + 3 = 803'], ['ระวัง!', 'ไม่ใช่ 83 — 3 เซนติเมตร อยู่หลักหน่วย']], '8 ม. 3 ซม. = <b>803 ซม.</b>'))],
    () => { const c = shuffle(P2W_C2M), m = shuffle(P2W_M2C.filter(x => x > 999)); return [Q.p2build({ cm: c.find(x => x < 1000) }), Q.p2build({ cm: c.filter(x => x < 1000)[1] }), Q.p2conv({ cm: c.find(x => x > 999), to: 'mc' }),
      Q.p2conv({ cm: m[0], to: 'cm' }), Q.ixMatch({ q: 'จับคู่ความยาวที่เท่ากัน', pairs: pkF(P2W_M2C.filter(x => x < 1000), 4).map(v => [mcTxt(v, 1), `${fmt(v)} ซม.`]) }),
      ...pkF(P2W_EST, 2).map(([e, name, more]) => Q.meterJudge({ e, name, more }))]; }),
  L2L(3, 'หาดพุ่งแหลน', 'การเปรียบเทียบความยาว (1)', 'เปรียบเทียบความยาว (1)', 'เปรียบเทียบความยาวและความสูงที่เป็นเมตรและเซนติเมตร เรียงลำดับ และหาผลต่าง',
    [T('แตะ <b>2 ตัว</b> เพื่อเปรียบเทียบความสูง — ต่างกันกี่เซนติเมตร', 'แตะสองตัว เพื่อเปรียบเทียบความสูง ต่างกันกี่เซนติเมตร', el => el.append(simWall(P2L_T_WALL2, { max: 180, mc: true, mode: 'cmp' }))),
     T('ผลกระโดดไกล — <b>แตะเรียงอันดับ</b> 1 2 3', 'ผลกระโดดไกล แตะเรียงอันดับ หนึ่ง สอง สาม', qPlay(Q.ixSort({ side: 'v', q: 'ใครได้อันดับ 1 2 3', items: P2L_T_JUMP.map(x => ({ label: x.name, v: x.cm })), dir: 'desc', k: 3, slotLabels: ['อันดับ 1', 'อันดับ 2', 'อันดับ 3'], fig: p2trackSVG(P2L_T_JUMP, { lo: 280, hi: 380, st: 20, sand: true, lab: v => mcTxt(v, 1) }) }), 'ไกลที่สุดได้อันดับ 1')),
     T('ตัวอย่างทีละขั้น: 3 ม. 45 ซม. กับ 3 ม. 8 ซม.', 'ตัวอย่างทีละขั้น', p4ex([['① เทียบเมตร', '3 เมตร = 3 เมตร (เท่ากัน)'], ['② เทียบเซนติเมตร', '45 > 8'], ['สรุป', '3 ม. 45 ซม. ยาวกว่า 3 ม. 8 ซม. อยู่ 45 − 8 = 37 ซม.']], 'ต้นกล้ากระโดด<b>ไกลกว่า</b>ปุยฝ้าย <b>37 เซนติเมตร</b>'))],
    () => { const W = P2W_WALL10, I = W.items; return [p2wq(W, { i: 0 }), p2wq(W, { i: 1, j: 2, ask: 'word' }), Q.p2wallTap({ ...W, ask: pick(['tall', 'short']) }), p2wq(W, { i: 2, j: 3, ask: 'diff' }), p2wallSort(W, 'asc'),
      Q.ixSort({ q: 'ผลการแข่งขันพุ่งแหลน: ใครได้<span class="hl">เหรียญทอง เงิน ทองแดง</span>', items: P2W_JAV.map(x => ({ label: x.name, v: x.cm })), dir: 'desc', k: 3, slotLabels: ['เหรียญทอง', 'เหรียญเงิน', 'เหรียญทองแดง'], fig: p2trackSVG(P2W_JAV, { lo: 5100, hi: 5300, st: 50, lab: v => mcTxt(v, 1) }) }),
      p2PickSide({ fig: p2cards(P2W_JAV.map(x => [x.name, mcTxt(x.cm, 1)])), q: 'ใครพุ่งแหลนได้ระยะทาง<span class="hl">ใกล้ที่สุด</span>', opts: P2W_JAV.map(x => x.name), right: 'สมชาย', hint: 'เทียบเมตรก่อน 51 ม. น้อยกว่า 52 ม. แล้วเทียบเซนติเมตร' })]; }),
  L2L(4, 'หาดเทียบหน่วย', 'การเปรียบเทียบความยาว (2)', 'เปรียบเทียบความยาว (2)', 'เปรียบเทียบความยาวที่เขียนต่างหน่วยกัน โดยเปลี่ยนเป็นเซนติเมตรก่อน',
    [T('ความยาวเขียน<b>ต่างหน่วย</b> — กด<b>เปลี่ยนเป็นเซนติเมตร</b>ทั้งคู่ แล้วเปรียบเทียบ', 'ความยาวเขียนต่างหน่วย กดเปลี่ยนเป็นเซนติเมตรทั้งคู่ แล้วเปรียบเทียบ', el => el.append(simCmpUnits([[['ไม้ไผ่', '3 ม. 5 ซม.', 305], ['เชือก', '350 ซม.', 350]], [['ท่อน้ำ', '2 ม. 40 ซม.', 240], ['ราวตากผ้า', '240 ซม.', 240]], [['เรือคายัก', '4 ม. 12 ซม.', 412], ['กระดานโต้คลื่น', '298 ซม.', 298]]]))),
     T('ตัวอย่างทีละขั้น: เรียงความยาว 3 อย่าง', 'ตัวอย่างทีละขั้น', p4ex([['① เปลี่ยนหน่วย', 'ตาข่าย 2 ม. 75 ซม. = 275 ซม. · เชือก 312 ซม. · ไม้พาย 1 ม. 90 ซม. = 190 ซม.'], ['② เทียบ', '312 > 275 > 190'], ['③ เรียงจากยาวไปสั้น', 'เชือก → ตาข่าย → ไม้พาย']], '<b>เชือก</b>ยาวที่สุด · <b>ไม้พาย</b>สั้นที่สุด'))],
    () => { const A = P2W_ANI, L = P2W_LONG, T_ = P2W_TALL, pr = pkF(P2W_LONGQ, 2), ap = pkF([[0, 1], [3, 2], [4, 5], [0, 3], [4, 1], [0, 4], [5, 2], [1, 5]], 2);
      return [Q.p4Pick({ fig: p2cards(A), q: `สัตว์ชนิดใด<span class="hl">สูงที่สุด</span>`, opts: ['กวาง', 'อูฐ', ...pkF(['ม้า', 'วัว', 'แรด', 'ฮิปโปโปเตมัส'], 2)], right: 'กวาง', hint: 'เปลี่ยนเป็นเซนติเมตรทั้งหมดก่อน แล้วหาค่าที่มากที่สุด' }),
        ...ap.map(([i, j]) => Q.p2cmpWord({ a: A[i], b: A[j], words: P2W_CMPH.slice(0, 2) })), ...pr.map(([i, j]) => Q.p2cmpWord({ a: L[i], b: L[j], words: P2W_CMPL })),
        Q.p2cmpWord({ a: T_[3], b: T_[1], words: P2W_CMPH }), Q.ixSort({ side: 'v', q: 'เรียงสถานที่ตามความสูงจาก<span class="hl">สูงที่สุดไปเตี้ยที่สุด</span>', fig: p2cards(T_), items: T_.filter(x => x[0] !== 'บ้าน').map(x => ({ label: x[0], v: x[2] })), dir: 'desc', slotLabels: ['สูงที่สุด', '', '', '', 'เตี้ยที่สุด'] })]; }),
  L2L(5, 'หาดแผนที่', 'การวัดและเปรียบเทียบระยะทาง', 'ระยะทาง', 'หาระยะทางจากแผนที่ เปรียบเทียบระยะทาง และใช้หน่วยเมตร เซนติเมตร',
    [T('<b>แตะถนน</b>ทีละเส้นตามเส้นทาง — ระยะทางจะบวกให้ดู แล้วเทียบว่าทางไหนใกล้กว่า', 'แตะถนนทีละเส้นตามเส้นทาง ระยะทางจะบวกให้ดู แล้วเทียบว่าทางไหนใกล้กว่า', el => el.append(simRoute(P2L_T_MAP, [{ q: 'จากบ้านไปโรงเรียน ผ่านร้านไอศกรีม', e: [0, 1] }, { q: 'จากบ้านไปโรงเรียน ผ่านสวนมะพร้าว', e: [2, 3] }]))),
     T('ตัวอย่างทีละขั้น: เส้นทางไหนใกล้กว่า', 'ตัวอย่างทีละขั้น', p4ex([['① ผ่านร้านไอศกรีม', '315 + 480 = 795 เมตร'], ['② ผ่านสวนมะพร้าว', '260 + 590 = 850 เมตร'], ['③ เทียบ', '795 < 850 → ต่างกัน 850 − 795 = 55 เมตร']], 'ทางผ่าน<b>ร้านไอศกรีม</b>ใกล้กว่า <b>55 เมตร</b>'))],
    () => { const T_ = P2W_TRIP, far = Math.random() < .5; return [...pkF(P2W_MAPQ, 3).map(([q, a, w]) => Q.p2mapQ({ M: P2W_MAP, q, a, opts: [a, ...w] })),
      Q.p4Pick({ fig: p2cards(T_.map(x => ['ไป' + x[0], x[1]])), q: `จากโรงเรียนไปที่ใด<span class="hl">${far ? 'ไกลที่สุด' : 'ใกล้ที่สุด'}</span>`, opts: T_.map(x => x[0]), right: far ? 'สนามกีฬา' : 'โรงพยาบาล', hint: 'เปลี่ยนเป็นเซนติเมตรทั้งหมดก่อน แล้วเปรียบเทียบ' }),
      Q.p2conv({ cm: 1008, to: 'mc' }), Q.p2cmpWord({ a: T_[3], b: T_[2], words: P2W_CMPD, pre: 'ระยะทางไป' })]; }),
  L2L(6, 'หาดตั้งเมตร', 'การบวกและการลบเกี่ยวกับความยาว', 'บวก ลบ ความยาว', 'หาผลบวกและผลลบของความยาวที่เป็นเมตรและเซนติเมตร โดยตั้งหลักเมตรและเซนติเมตร',
    [learnStep('บวก ลบ ความยาวเป็น<b>เมตรและเซนติเมตร</b>', 'บวก ลบ ความยาวเป็นเมตรและเซนติเมตร', [
      { fig: `<div class="p4colwrap w2solo">${p2mcColHTML(245, 368, '+', {})}</div>`, name: 'ตั้งให้ตรงหลัก', text: 'เมตรตรงเมตร · เซนติเมตรตรงเซนติเมตร แล้วทำ<b>จากขวาไปซ้าย</b>' },
      { fig: `<div class="w2solo">${lbig('45 + 68 = 113 เซนติเมตร<br>= 1 เมตร 13 เซนติเมตร')}</div>`, name: 'บวก: เซนติเมตรครบ 100 ทด 1 เมตร', text: '' },
      { fig: `<div class="w2solo">${lbig('30 − 75 ไม่พอ<br>กระจาย 1 เมตร = 100 เซนติเมตร<br>130 − 75 = 55 เซนติเมตร')}</div>`, name: 'ลบ: เซนติเมตรไม่พอ กระจาย 1 เมตร', text: '' }], 'ทำจากขวาไปซ้าย · ครบ 100 เซนติเมตรทด · ไม่พอกระจาย'),
     mcWalkT(245, 368, '+'), mcWalkT(530, 275, '−'),
     T('ตัวอย่างทีละขั้น: 385 เซนติเมตร รวมกับ 2 เมตร 47 เซนติเมตร', 'ตัวอย่างทีละขั้น', p4ex([['① เปลี่ยนหน่วย', '385 ซม. = 3 ม. 85 ซม.'], ['② เซนติเมตร', '85 + 47 = 132 → 1 ม. 32 ซม. (ทด 1)'], ['③ เมตร', '3 + 2 + 1 = 6']], 'ได้ <b>6 เมตร 32 เซนติเมตร</b>', '', () => h('div', { class: 'p4colwrap', html: p2mcColHTML(385, 247, '+', { m: 1, c: 1, x: 1 }) }))),
     T('ลองทำเอง', 'ลองทำเอง', qPlay(Q.p2mcCol({ a: 356, b: 278, op: '+' }), 'ถูกต้อง!'))],
    () => { const P = P2W_COL; return [...pkF(P.slice(0, 4), 3), ...pkF(P.slice(4), 3)].map(([a, b, op, text]) => Q.p2mcCol({ a, b, op, text })); }),
  L2L(7, 'หาดโจทย์ยาว', 'โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ (1)', 'โจทย์ปัญหา (1)', 'วิเคราะห์โจทย์ปัญหาความยาว เขียนประโยคสัญลักษณ์ และหาคำตอบเป็นเมตรและเซนติเมตร',
    [T('อ่านโจทย์ ดูแผนภาพ <b>เลือกประโยคสัญลักษณ์</b> แล้วหาคำตอบ', 'อ่านโจทย์ ดูแผนภาพ เลือกประโยคสัญลักษณ์ แล้วหาคำตอบ', qPlay(Q.p2mcStory(S2L('ไม้กระดานแผ่นแรกยาว 1 เมตร 65 เซนติเมตร แผ่นที่สองยาว 2 เมตร 50 เซนติเมตร นำมาต่อกันจะยาวเท่าไร', 165, 250, '+', p2pw(165, 250, 'แผ่นแรก', 'แผ่นที่สอง', 'ต่อกัน'))), 'ต่อกัน → บวก')),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'ผ้าใบยาว 5 เมตร 20 เซนติเมตร ตัดไปทำร่ม 2 เมตร 75 เซนติเมตร เหลือผ้าใบยาวเท่าไร'], ['① ถามอะไร', 'ผ้าใบที่เหลือ → ลบ'], ['② ประโยคสัญลักษณ์', '5 ม. 20 ซม. − 2 ม. 75 ซม. = □'], ['③ เซนติเมตร', '20 ลบ 75 ไม่ได้ → กระจาย 1 ม.: 120 − 75 = 45'], ['④ เมตร', '4 − 2 = 2']], 'ตอบ <b>2 เมตร 45 เซนติเมตร</b>'))],
    () => shuffle(P2W_ST1).map(s => Q.p2mcStory(s))),
  L2L(8, 'หาดโจทย์ไกล', 'โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ (2)', 'โจทย์ปัญหา (2)', 'แก้โจทย์ปัญหาการเปรียบเทียบความยาวและระยะทาง (มากกว่า น้อยกว่า สูงกว่า สั้นกว่า)',
    [T('คำว่า “สูงกว่า สั้นกว่า” ไม่ได้บอกเสมอว่าบวกหรือลบ — <b>ดูแผนภาพว่าไม่รู้ส่วนไหน</b>', 'คำว่าสูงกว่า สั้นกว่า ไม่ได้บอกเสมอว่าบวกหรือลบ ดูแผนภาพว่าไม่รู้ส่วนไหน', qPlay(Q.p2mcStory(S2L('ต้นมะพร้าวสูง 6 เมตร 40 เซนติเมตร ต้นมะม่วงเตี้ยกว่าต้นมะพร้าว 1 เมตร 85 เซนติเมตร ต้นมะม่วงสูงเท่าไร', 640, 185, '−', p2cmp(640, 455, 'มะพร้าว', 'มะม่วง', 'small'))), 'ไม่รู้ความสูงของต้นที่เตี้ยกว่า → ลบ')),
     T('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', p4ex([['โจทย์', 'เรือพายยาว 3 เมตร 60 เซนติเมตร ซึ่งสั้นกว่าเรือใบ 4 เมตร 55 เซนติเมตร เรือใบยาวเท่าไร'], ['① แผนภาพ', 'เรือใบยาวกว่า → ไม่รู้ค่าที่<b>มาก</b>'], ['② ประโยคสัญลักษณ์', '3 ม. 60 ซม. + 4 ม. 55 ซม. = □'], ['③ คำนวณ', '60 + 55 = 115 → ทด 1 ม. เหลือ 15 ซม. · 3 + 4 + 1 = 8']], 'ตอบ <b>8 เมตร 15 เซนติเมตร</b> — มีคำว่า “สั้นกว่า” แต่ใช้<b>การบวก</b>'))],
    () => shuffle(P2W_ST2).map(s => Q.p2mcStory(s)))
];

/* v188: ด่าน 81 สอนก่อนลองทำ — เครื่องมือ → หน่วย/ไม้บรรทัด → ตัวอย่าง → ลองวัด → ลองจับคู่ · ด่าน 86 มีรู้จักในตัว (ไม่ใช้ LRN ใน learn.js) */
{ const L = LESSONS_P2C3[0], t = L.teach; L.teach = [0, 1, 4, 6, 3, 5, 2].map(i => t[i]); L.learned = true; LESSONS_P2C3[5].learned = true; }
/* v188 (ผู้ใช้ขอ — เหมือนชายหาดตาชั่ง): ทุกเกม 10 ข้อ เรียงง่าย → ยาก · เปรียบเทียบมีภาพ · เรียงลำดับ ภาพซ้าย ทางเดินแนวนอนขวา */
const mcCalcLv = ([a, b, op]) => (op === '+' ? (a % 100 + b % 100 >= 100) : (a % 100 < b % 100)) * 10 + (op === '−') + (a > 999 || b > 999) * 2;
LESSONS_P2C3[0].game = () => { const r = shuffle(P2W_RUL);
  return [...pkF(P2W_TOOL, 2).map(([task, ok, opts]) => Q.p2tool({ task, ok, opts })), Q.p2rulLen({ it: r[0] }), Q.p2rulLen({ it: r[3] }), Q.p2rulCmp({ a: r[1], b: r[2] }),
    p2wq(P2W_WALL2, { i: rnd(0, 3) }), p2wq(P2W_WALL4, { i: rnd(0, 3) }), Q.p2wallTap({ ...P2W_WALL4, ask: 'tall' }), Q.p2wallTap({ ...P2W_WALL5, ask: 'short' }), p2wq(P2W_WALL6, { i: rnd(0, 3) })]; };
LESSONS_P2C3[1].game = () => { const c = shuffle(P2W_C2M), m = shuffle(P2W_M2C.filter(x => x > 999)), s = c.filter(x => x < 1000), l = c.filter(x => x > 999);
  return [Q.p2build({ cm: s[0] }), Q.p2build({ cm: s[1] }), Q.ixMatch({ q: 'จับคู่ความยาวที่เท่ากัน', pairs: pkF(P2W_M2C.filter(x => x < 1000), 4).map(v => [mcTxt(v, 1), `${fmt(v)} ซม.`]) }),
    Q.p2conv({ cm: s[2], to: 'mc' }), Q.p2conv({ cm: l[0], to: 'mc' }), Q.p2conv({ cm: m[0], to: 'cm' }), Q.p2conv({ cm: m[1], to: 'cm' }),
    ...pkF(P2W_EST, 3).map(([e, name, more]) => Q.meterJudge({ e, name, more }))]; };
LESSONS_P2C3[2].game = () => { const W = P2W_WALL10;
  return [p2wq(W, { i: 0 }), p2wq(W, { i: 3 }), Q.p2wallTap({ ...W, ask: 'tall' }), p2wq(W, { i: 1, j: 2, ask: 'word' }), p2wq(W, { i: 0, j: 3, ask: 'word' }), p2wq(W, { i: 2, j: 3, ask: 'diff' }), p2wq(W, { i: 1, j: 0, ask: 'diff' }), p2wallSort(W, 'asc'),
    Q.ixSort({ side: 'v', q: 'ผลการแข่งขันพุ่งแหลน: ใครได้<span class="hl">เหรียญทอง เงิน ทองแดง</span>', items: P2W_JAV.map(x => ({ label: x.name, v: x.cm })), dir: 'desc', k: 3, slotLabels: ['เหรียญทอง', 'เหรียญเงิน', 'เหรียญทองแดง'], fig: p2trackSVG(P2W_JAV, { lo: 5100, hi: 5300, st: 50, lab: v => mcTxt(v, 1) }) }),
    p2PickSide({ fig: p2cards(P2W_JAV.map(x => [x.name, mcTxt(x.cm, 1)])), q: 'ใครพุ่งแหลนได้ระยะทาง<span class="hl">ใกล้ที่สุด</span>', opts: P2W_JAV.map(x => x.name), right: 'สมชาย', hint: 'เทียบเมตรก่อน 51 ม. น้อยกว่า 52 ม. แล้วเทียบเซนติเมตร' })]; };
LESSONS_P2C3[3].game = () => { const A = P2W_ANI, L = P2W_LONG, T_ = P2W_TALL, pr = pkF(P2W_LONGQ, 3), ap = pkF([[0, 1], [3, 2], [4, 5], [0, 3], [4, 1], [0, 4], [5, 2], [1, 5]], 3);
  return [...ap.map(([i, j]) => Q.p2cmpWord({ a: A[i], b: A[j], words: P2W_CMPH.slice(0, 2) })), ...pr.map(([i, j]) => Q.p2cmpWord({ a: L[i], b: L[j], words: P2W_CMPL })),
    Q.p2cmpWord({ a: [...T_[3], 'house'], b: [...T_[1], 'flag'], words: P2W_CMPH }),
    p2PickSide({ fig: p2cards(A.map(([n, t, v, k]) => [n, t, k])), q: `สัตว์ชนิดใด<span class="hl">สูงที่สุด</span>`, opts: ['ช้าง', 'อูฐ', ...pkF(['แพะ', 'สิงโต', 'นกกระจอกเทศ', 'หมีแพนด้า'], 2)], right: 'ช้าง', hint: 'เปลี่ยนเป็นเซนติเมตรทั้งหมดก่อน แล้วหาค่าที่มากที่สุด' }),
    Q.ixSort({ side: 'v', q: 'เรียงความยาวจาก<span class="hl">ยาวที่สุดไปสั้นที่สุด</span>', fig: `<div class="w2srt">${[L[1], L[2], L[5]].map(([n, t, v, k]) => `<div class="w2sc">${p2ico(k, 96)}<b>${n}</b><span>${t}</span></div>`).join('')}</div>`, items: [L[1], L[2], L[5]].map(x => ({ label: x[0], v: x[2] })), dir: 'desc', slotLabels: ['ยาวที่สุด', '', 'สั้นที่สุด'] }),
    Q.ixSort({ side: 'v', q: 'เรียงสถานที่ตามความสูงจาก<span class="hl">สูงที่สุดไปเตี้ยที่สุด</span>', fig: p2cards(T_), items: T_.filter(x => x[0] !== 'บ้าน').map(x => ({ label: x[0], v: x[2] })), dir: 'desc', slotLabels: ['สูงที่สุด', '', '', '', 'เตี้ยที่สุด'] })]; };
LESSONS_P2C3[4].game = () => { const T_ = P2W_TRIP, far = Math.random() < .5;
  return [Q.p2conv({ cm: 1008, to: 'mc' }), Q.p2conv({ cm: 1150, to: 'mc' }), Q.p2cmpWord({ a: T_[3], b: T_[2], words: P2W_CMPD, pre: 'ระยะทางไป' }), Q.p2cmpWord({ a: T_[1], b: T_[2], words: P2W_CMPD, pre: 'ระยะทางไป' }),
    Q.p4Pick({ fig: p2cards(T_.map(x => ['ไป' + x[0], x[1]])), q: `จากโรงเรียนไปที่ใด<span class="hl">${far ? 'ไกลที่สุด' : 'ใกล้ที่สุด'}</span>`, opts: T_.map(x => x[0]), right: far ? 'สนามกีฬา' : 'โรงพยาบาล', hint: 'เปลี่ยนเป็นเซนติเมตรทั้งหมดก่อน แล้วเปรียบเทียบ' }),
    ...shuffle(P2W_MAPQ).map(([q, a, w]) => Q.p2mapQ({ M: P2W_MAP, q, a, opts: [a, ...w] }))]; };
LESSONS_P2C3[5].game = () => [...pkF(P2W_COL.filter(x => x[2] === '+'), 5), ...pkF(P2W_COL.filter(x => x[2] === '−'), 5)].sort((x, y) => mcCalcLv(x) - mcCalcLv(y)).map(([a, b, op, text]) => Q.p2mcCol({ a, b, op, text }));
LESSONS_P2C3[6].game = () => pkF(P2W_ST1, 10).map(s => Q.p2mcStory(s));
LESSONS_P2C3[7].game = () => pkF(P2W_ST2, 10).map(s => Q.p2mcStory(s));

/* ---------- boss 99: ข้อสอบท้ายบทที่ 3 — แต่งใหม่ทั้งหมด (original items) ---------- */
const P2X_MAP = { W: 560, H: 330, nodes: { home: [100, 285, 'บ้านต้นข้าว', 'house'], lib: [90, 70, 'ห้องสมุด', 'school', -1], field: [455, 60, 'สนามกีฬา', 'park', -1], shop: [465, 285, 'ร้านขนม', 'shop'] },
  edges: [['home', 'lib', 285, -34, 0, .6], ['lib', 'field', 415, 0, -16, .4], ['field', 'shop', 360, 40, 0], ['home', 'shop', 390, 0, 18, -.3], ['home', 'field', 640, 20, -10, 0, 1]] };
const EXAM_P2C3 = d6spread([
  { q: 'ถ้าต้องการวัดความยาวรอบเอวของตนเอง ควรใช้เครื่องมือใด', opts: ['ไม้บรรทัด', 'สายวัดตัว', 'ไม้เมตร', 'สายวัดชนิดตลับ'], a: 1 },
  { q: 'จากภาพ ถนนเส้นตรงจากบ้านต้นข้าวไปสนามกีฬายาวกี่เมตร', fig: p2mapSVG(P2X_MAP), opts: ['390 เมตร', '640 เมตร', '700 เมตร', '750 เมตร'], a: 1 },
  { q: 'จากภาพ ถ้าเดินจากบ้านต้นข้าวไปสนามกีฬาโดยผ่านร้านขนม จะเดินเป็นระยะทางเท่าไร', fig: p2mapSVG(P2X_MAP), opts: ['640 เมตร', '700 เมตร', '750 เมตร', '775 เมตร'], a: 2 },
  { q: 'จากภาพ ทางที่ผ่านห้องสมุดกับทางที่ผ่านร้านขนม ทางใดสั้นกว่า และสั้นกว่ากี่เมตร', fig: p2mapSVG(P2X_MAP), opts: ['ผ่านห้องสมุด สั้นกว่า 50 เมตร', 'ผ่านร้านขนม สั้นกว่า 50 เมตร', 'ผ่านห้องสมุด สั้นกว่า 60 เมตร', 'ยาวเท่ากัน'], a: 0 },
  { q: 'ฝนใช้ไม้เมตรวัดความยาวของโต๊ะยาวได้ 2 ครั้งพอดี แล้ววัดต่อได้อีก 38 เซนติเมตร โต๊ะยาวเท่าไร', opts: ['2 เมตร 38 เซนติเมตร', '3 เมตร 38 เซนติเมตร', '238 เมตร', '2 เมตร 83 เซนติเมตร'], a: 0 },
  { q: 'วางยางลบให้ปลายข้างหนึ่งตรงกับขีด 4 เซนติเมตร อีกปลายหนึ่งตรงกับขีด 11 เซนติเมตร ยางลบยาวกี่เซนติเมตร', opts: ['4 เซนติเมตร', '7 เซนติเมตร', '11 เซนติเมตร', '15 เซนติเมตร'], a: 1 },
  { q: 'ไม้ 4 ท่อนยาว 3 เมตร 5 เซนติเมตร · 350 เซนติเมตร · 3 เมตร 50 เซนติเมตร · 305 เซนติเมตร ตามลำดับ ข้อใดถูกต้อง', opts: ['ท่อนที่ 1 ยาวเท่ากับท่อนที่ 4', 'ท่อนที่ 1 ยาวเท่ากับท่อนที่ 2', 'ท่อนที่ 3 ยาวกว่าท่อนที่ 2', 'ท่อนที่ 4 ยาวที่สุด'], a: 0 },
  { q: '468 เซนติเมตร รวมกับ 3 เมตร 47 เซนติเมตร เท่ากับเท่าไร', opts: ['7 เมตร 15 เซนติเมตร', '8 เมตร 15 เซนติเมตร', '8 เมตร 5 เซนติเมตร', '7 เมตร 85 เซนติเมตร'], a: 1 },
  { q: 'สระน้ำบ้านบีมยาว 18 เมตร ยาวกว่าสระน้ำบ้านแป้ง 4 เมตร 60 เซนติเมตร สระน้ำบ้านแป้งยาวเท่าไร', opts: ['22 เมตร 60 เซนติเมตร', '14 เมตร 60 เซนติเมตร', '13 เมตร 40 เซนติเมตร', '14 เมตร 40 เซนติเมตร'], a: 2 },
  { q: 'ต้นมะพร้าวสูง 4 เมตร 15 เซนติเมตร บันไดยาว 285 เซนติเมตร ต้นมะพร้าวสูงกว่าบันไดเท่าไร', opts: ['1 เมตร 30 เซนติเมตร', '1 เมตร 70 เซนติเมตร', '2 เมตร 30 เซนติเมตร', '7 เมตร'], a: 0 },
  { q: 'จากภาพ ปากกายาวกี่เซนติเมตร', fig: p2rulerSVG([{ k: 'pen', name: 'ปากกา', a: 2, b: 15 }]), opts: ['13 เซนติเมตร', '15 เซนติเมตร', '2 เซนติเมตร', '17 เซนติเมตร'], a: 0 },
  { q: 'สิ่งใดควรวัดด้วยไม้บรรทัด', opts: ['ความยาวของสนามฟุตบอล', 'ความกว้างของยางลบ', 'ความสูงของเสาไฟฟ้า', 'ความยาวของห้องประชุม'], a: 1 },
  { q: '608 เซนติเมตร เท่ากับเท่าใด', opts: ['6 เมตร 8 เซนติเมตร', '60 เมตร 8 เซนติเมตร', '6 เมตร 80 เซนติเมตร', '608 เมตร'], a: 0 },
  { q: '9 เมตร 4 เซนติเมตร เท่ากับกี่เซนติเมตร', opts: ['94 เซนติเมตร', '940 เซนติเมตร', '904 เซนติเมตร', '9,004 เซนติเมตร'], a: 2 },
  { q: 'ผลการกระโดดไกล: ภูมิ 3 ม. 48 ซม. · ปาล์ม 3 ม. 84 ซม. · ใบเตย 3 ม. 9 ซม. · แก้ม 3 ม. 80 ซม. ใครกระโดดได้ไกลที่สุด', opts: ['ภูมิ', 'ปาล์ม', 'ใบเตย', 'แก้ม'], a: 1 },
  { q: 'ตู้เสื้อผ้าสูง 195 เซนติเมตร ประตูห้องสูง 2 เมตร 5 เซนติเมตร ข้อใดถูกต้อง', opts: ['ตู้เสื้อผ้าสูงกว่าประตู', 'ประตูสูงกว่าตู้เสื้อผ้า', 'ตู้เสื้อผ้ากับประตูสูงเท่ากัน', 'เปรียบเทียบไม่ได้'], a: 1 },
  { q: 'ผ้าม่านยาว 2 เมตร 70 เซนติเมตร หน้าต่างกว้าง 270 เซนติเมตร ข้อใดถูกต้อง', opts: ['ผ้าม่านยาวกว่าความกว้างของหน้าต่าง', 'ผ้าม่านยาวเท่ากับความกว้างของหน้าต่าง', 'หน้าต่างกว้างกว่าความยาวของผ้าม่าน', 'เปรียบเทียบไม่ได้'], a: 1 },
  { q: 'จากภาพ ถ้าเดินจากบ้านต้นข้าวไปสนามกีฬาโดยผ่านห้องสมุด จะเดินเป็นระยะทางกี่เมตร', fig: p2mapSVG(P2X_MAP), opts: ['640 เมตร', '700 เมตร', '750 เมตร', '415 เมตร'], a: 1 },
  { q: '5 เมตร 26 เซนติเมตร รวมกับ 2 เมตร 43 เซนติเมตร เท่ากับเท่าไร', opts: ['7 เมตร 69 เซนติเมตร', '7 เมตร 83 เซนติเมตร', '3 เมตร 83 เซนติเมตร', '8 เมตร 69 เซนติเมตร'], a: 0 },
  { q: 'เสาธงสูง 12 เมตร 65 เซนติเมตร ต้นมะม่วงเตี้ยกว่าเสาธง 7 เมตร 30 เซนติเมตร ต้นมะม่วงสูงเท่าไร', opts: ['5 เมตร 35 เซนติเมตร', '19 เมตร 95 เซนติเมตร', '5 เมตร 95 เซนติเมตร', '6 เมตร 35 เซนติเมตร'], a: 0 }
]);
LESSONS_P2C3.push({ id: 99, boss: true, place: 'อ่าวไม้เมตร', title: 'ด่านบอส: บทที่ 3 การวัดความยาว', short: 'ด่านบอส · ข้อสอบ', tone: 'mint',
  goal: 'ตอบคำถามเรื่องการวัดความยาว 20 ข้อ ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P2C3, pass: 10, bossName: 'ปีศาจปลาหมึกไม้เมตร', bossPal: 'mint', emblem: 'ม.', bossKind: 'octo',
  winLine: 'ชนะปีศาจปลาหมึกไม้เมตรแล้ว! วัดอะไรก็แม่นยำ', loseLine: 'ปีศาจปลาหมึกยังวัดเก่งกว่า สู้ใหม่นะ!' });
