/* รู้จักก่อน — learn-card kit (loaded early so every chapter file can build ① รู้จัก steps). Reorder of old lessons lives in learn.js */
const lsv = (inner, vb = '0 0 64 64', w = 76) => `<svg viewBox="${vb}" width="${w}" height="${w}" aria-hidden="true">${inner}</svg>`;
const lx = (e, cls = '') => `<div class="fbig lrn-x ${cls}">${e.split('=').map(x => /[+−×÷()]/.test(x) ? exprHTML(x.trim()) : `<b class="num">${x.trim()}</b>`).join('<span class="fop"> = </span>')}</div>`;
const lbig = (t, cls = '') => `<div class="lrn-big ${cls}">${t}</div>`;
const lrow = (...a) => `<div class="lrn-row">${a.join('')}</div>`;
const lcap = (fig, cap, ok) => `<span class="lrn-it${ok === true ? ' ok' : ok === false ? ' no' : ''}">${fig}<small>${cap}</small>${ok === true ? '<i>✓</i>' : ok === false ? '<i>✗</i>' : ''}</span>`;
const lpair = (a, b, arrow = '→') => `<div class="lrn-pair"><span>${a}</span><b class="lrn-arr">${arrow}</b><span class="lrn-drawn">${b}</span></div>`;
/* polygon with numbered sides (and corner dots) */
const lPoly = (pts, o = {}) => { const d = 'M' + pts.map(p => p.join(' ')).join(' L') + ' Z', n = pts.length;
  const sides = o.sides ? pts.map((p, i) => { const q = pts[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, cx = 32, cy = 33, k = 1.28; return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${i % 2 ? '#2F86C2' : '#E5505E'}" stroke-width="3.4" stroke-linecap="round"/><text x="${cx + (mx - cx) * k}" y="${cy + (my - cy) * k + 3}" text-anchor="middle" class="lrn-n">${i + 1}</text>`; }).join('') : '';
  const dots = o.dots ? pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.6" fill="#FFB534" stroke="#6E4A0E" stroke-width="1.2"/>`).join('') : '';
  return lsv(`<path d="${d}" fill="${o.fill || '#FFF6D6'}" stroke="#2B2550" stroke-width="2" stroke-linejoin="round" class="${o.draw ? 'lrn-dpath' : ''}"/>${sides}${dots}`, '-8 -6 80 78', o.w || 96); };
const lDots = (r, c, col = '#7FC8F0') => lsv(range(0, r - 1).map(i => range(0, c - 1).map(j => `<circle cx="${10 + j * 14}" cy="${10 + i * 14}" r="5" fill="${col}" stroke="#2B2550" stroke-width="1"/>`).join('')).join(''), `0 0 ${c * 14 + 6} ${r * 14 + 6}`, Math.min(130, c * 18 + 8));
/* short division ladder: rows [[divisor, [nums]]], last = [null, [nums]] · mark: 'L' (lcm) or 'col' (hcf) */
const lLadder = (rows, mark) => `<table class="lrn-div ${mark || ''}">${rows.map(([d, ns], i) => `<tr><td class="dv">${d ?? ''}</td>${ns.map(n => `<td class="${d == null ? 'last' : ''}">${n}</td>`).join('')}</tr>`).join('')}</table>`;
const lspoon = (big) => lsv(`<ellipse cx="${big ? 20 : 22}" cy="32" rx="${big ? 14 : 9}" ry="${big ? 10 : 6.5}" fill="#E8E4F6" stroke="#6E6290" stroke-width="2"/><rect x="${big ? 33 : 30}" y="${big ? 29.5 : 30.5}" width="${big ? 28 : 26}" height="${big ? 5 : 3.4}" rx="2" fill="#C9B8FF" stroke="#6E6290" stroke-width="1.4"/>`);

function learnCards(cards, sum) {
  const grid = h('div', { class: 'lrn' }), out = fNote(); let k = 0;
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); show(true); } });
  const show = speak => { const c = cards[k]; const fig = typeof c.fig === 'function' ? c.fig() : null;
    const card = h('div', { class: 'lrn-card' }, fig || h('div', { class: 'lrn-fig', html: c.fig || '' }), h('b', { class: 'lrn-name', html: FX(c.name) }), c.text ? h('p', { html: FX(c.text) }) : null);
    grid.append(card); sfx.pop(k); k++;
    if (speak) say(c.say || (c.name + ' ' + (c.text || '')).replace(/<[^>]+>/g, ''), true);
    if (k >= cards.length) { btn.remove(); if (sum) out.innerHTML = '<b>สรุป:</b> ' + FX(sum); } else btn.replaceChildren(icon('right'), `ดูต่อ (${k + 1}/${cards.length})`);
    if (speak) setTimeout(() => card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 60); };
  show(false); return h('div', { class: 'colstack' }, grid, btn, out);
}
/* ① รู้จัก = one PAGE per idea (not boxes on one page): the bubble carries the story, the page shows the picture big.
   returns an ARRAY of teach steps — lesson teach arrays are flattened in learn.js */
/* v107 (ผู้ใช้ขอ): a รู้จัก page whose figure is only text (an equation, a name…) keeps the picture of the page before it beside the text,
   so every page still shows what it is talking about. Opt out with carry: false on the card. */
const lrnVis = c => typeof c.fig === 'function' || /<(svg|img|canvas|table)\b|class="[^"]*\b(mtcol|w2col|ldiv|w3chain|lrn-it|lrn-row)\b/.test(String(c.fig || ''));
/* v116 (ผู้ใช้ขอ): หน้า “รู้จัก” หลายหน้าเรื่องเดียวกัน = กระดานเดียวที่เขียนต่อไปเรื่อย ๆ
   หน้าแรกแสดงรูป/โจทย์ของหน้าแรก · หน้าถัดไปยังเห็นของเดิมทั้งหมด (จางลงเล็กน้อย) แล้วเพิ่มบรรทัดใหม่ต่อท้าย
   และ “เน้น” ส่วนของบรรทัดก่อนหน้าที่หน้านี้กำลังพูดถึง (เช่น 2 × 5 ใน 10 + 2 × 5) อัตโนมัติจากการคำนวณ “a op b =” ในหน้านั้น
   card.hl = 'a op b' กำหนดเองได้ · card.carry === false = เริ่มกระดานใหม่ที่การ์ดนั้น · ใบที่รูปซ้ำกับใบก่อนไม่เขียนซ้ำ */
const lbPlain = x => String(x || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const lbNorm = x => String(x).replace(/[\s,]/g, '').replace(/[xX*]/g, '×').replace(/-/g, '−').replace(/\//g, '÷');
function lbFocus(c) { const src = [typeof c.fig === 'string' ? lbPlain(c.fig) : '', lbPlain(c.text)].join(' '), out = [];
  if (c.hl) [].concat(c.hl).forEach(x => out.push(lbNorm(x)));
  for (const m of src.matchAll(/(\d[\d,]*)\s*([+−×÷])\s*(\d[\d,]*)\s*=/g)) out.push(lbNorm(m[1] + m[2] + m[3]));
  return [...new Set(out)]; }
function lbMark(root, keys, bad) { let hit = false; if (!keys.length) return hit;
  root.querySelectorAll('.fexpr').forEach(fx => { const tk = [...fx.children], tx = tk.map(n => lbNorm(n.textContent));
    keys.forEach(key => { for (let i = 0; i + 2 < tk.length; i++) { let j = i, acc = ''; const mk = [];
      while (j < tk.length && acc.length < key.length) { if (tx[j] !== '(' && tx[j] !== ')') { acc += tx[j]; mk.push(tk[j]); } else if (acc) break; j++; }
      if (acc === key && mk.length >= 3 && !mk[0].closest('.lb-hl')) { const g = h('span', { class: 'lb-hl lb-grp' + (bad ? ' bad' : '') }); mk[0].before(g); tk.slice(tk.indexOf(mk[0]), tk.indexOf(mk[mk.length - 1]) + 1).forEach(n => g.append(n)); hit = true; break; } } }); });
  const W = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = []; while (W.nextNode()) if (!W.currentNode.parentElement.closest('.fexpr,.lb-hl,svg')) nodes.push(W.currentNode);
  keys.forEach(key => { for (const n of nodes) { if (!n.parentNode) continue; const t = n.nodeValue, re = new RegExp('(?<![\\d,])' + key.split('').map(ch => ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s,]*') + '(?![\\d])');
      const m = t.match(re); if (!m) continue; const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const mk = document.createElement('mark'); mk.className = 'lb-hl' + (bad ? ' bad' : ''); r.surroundContents(mk); hit = true; break; } });
  return hit; }
const LB_SOLO = /tkclk|tkdig|tkcal|t4-watch|t3line/; // v124 (ผู้ใช้ขอ): เรื่องเวลา (นาฬิกา · นาฬิกาตัวเลข · ปฏิทิน · เส้นเวลา) — แต่ละหน้ามีแค่รูปของหน้านั้น ไม่สะสมรูปหน้าก่อน
function lrnBoard(cards, k, figOf) {
  if (cards.some(d => typeof d.fig === 'string' && LB_SOLO.test(d.fig))) return figOf(cards[k]);
  let s0 = 0; for (let j = k; j > 0; j--) if (cards[j].carry === false) { s0 = j; break; }
  const key = d => typeof d.fig === 'function' ? null : String(d.fig || '').trim(), idx = [];
  for (let j = s0; j <= k; j++) { const d = cards[j]; if (!d.fig) continue; const kk = key(d); if (kk !== null && idx.some(i => key(cards[i]) === kk)) { if (j === k) { const at = idx.findIndex(i => key(cards[i]) === kk); idx.splice(at, 1); idx.push(j); } continue; } idx.push(j); }
  if (!idx.length) return figOf(cards[k]);
  if (idx.length === 1 && idx[0] === k && !lbFocus(cards[k]).length) return figOf(cards[k]);
  const board = h('div', { class: `lrn-board lb-n${Math.min(idx.length, 5)}` }), cur = cards[k], bad = /✗/.test(lbPlain(cur.fig)) || /ผิด/.test(lbPlain(cur.name));
  const items = idx.map((j, n) => { const d = cards[j], old = j !== k, vis = lrnVis(d);
    const it = h('div', { class: 'lb-item' + (old ? ' lb-old' : ' lb-cur') + (old && vis ? ' lb-thumb' : '') + (vis ? ' lb-vis' : '') }, figOf(d));
    if (old && vis) { let st = board.lastElementChild; if (!st || !st.classList.contains('lb-strip')) board.append(st = h('div', { class: 'lb-strip' })); st.append(it); } else board.append(it); return it; });
  const keys = lbFocus(cur), olds = items.filter(x => x.classList.contains('lb-old'));
  if (keys.length) { const tgt = olds.length ? olds : items; tgt.some(x => lbMark(x, keys, bad)); }
  return board; }
/* v134: รูปในหน้า “รู้จัก” ขยาย (zoom 1.8) แล้วกว้างเกินช่อง → ลด zoom ให้พอดี (เดิมตาชั่ง 2 อันของ ป.3 ถูกตัดขอบ) */
function lrnFitZoom(pf) { let n = 0; const fit = () => { if (!pf.isConnected) { if (n++ < 30) requestAnimationFrame(fit); return; } pf.style.zoom = ''; const z = parseFloat(getComputedStyle(pf).zoom) || 1, cw = pf.clientWidth, sw = Math.max(pf.scrollWidth, ...[...pf.querySelectorAll('.lrn-fig, .lrn-fig > *')].map(e => Math.max(e.scrollWidth, e.offsetWidth)));
    if (cw > 0 && sw > cw + 2) pf.style.zoom = String(Math.max(.6, Math.floor(z * cw / sw * 20) / 20)); };
  requestAnimationFrame(fit); try { new ResizeObserver(() => requestAnimationFrame(fit)).observe(pf); } catch (_) { } }
const learnStep = (t, s, cards, sum) => cards.map((c, k) => {
  let ci = -1; if (!lrnVis(c) && c.carry !== false && c.fig) for (let j = k - 1; j >= 0; j--) if (lrnVis(cards[j])) { ci = j; break; }
  const figOf = d => typeof d.fig === 'function' ? d.fig() : h('div', { class: 'lrn-fig', html: d.fig || '' });
  const first = k === 0, last = k === cards.length - 1, name = FX(c.name), plain = x => String(x || '').replace(/<[^>]+>/g, '');
  const bub = (first ? t + ' — ' : '') + `<b>${c.name}</b>`;
  const cs = c.sum != null ? c.sum : last ? sum : null;
  const say = (first ? plain(t) + ' ' : '') + (c.say || plain(c.name) + ' ' + plain(c.text)) + (cs ? ' สรุปว่า ' + plain(cs) : '');
  return Object.assign(T(bub, say, el => { const fig = lrnBoard(cards, k, figOf), pf = h('div', { class: 'lrn-pfig' }, fig); lrnFitZoom(pf);
    el.append(h('div', { class: 'lrn-page' }, h('div', { class: 'lrn-chip' }, `รู้จัก ${k + 1} / ${cards.length}`), pf,
      h('h3', { class: 'lrn-h', html: name }), c.text ? h('p', { class: 'lrn-p', html: FX(c.text) }) : null,
      cs ? h('div', { class: 'lrn-sum', html: '<b>สรุป:</b> ' + FX(cs) }) : null)); }), { lf: [c.name, String(c.text || '').split(/<br>|·/)[0]].map(x => plain(String(x || '').replace(/<span class="fq"><i>(\d+)<\/i><i>(\d+)<\/i><\/span>/g, '$1/$2').replace(/\[(\d+ )?(\d+)\/(\d+)\]/g, (_, w, n, d) => (w || '') + n + '/' + d)).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').trim()).filter(Boolean).join(' — ') });
});


/* ② ตัวอย่างทีละขั้น WITH PICTURES — every step can change the picture (ผู้ใช้ขอ: ตัวอย่างทีละขั้นต้องมีรูปประกอบ)
   rows: [[label, html, fig]] — fig = html string | () => node | null (keeps the previous picture) */
function picWalk(rows, finalHTML, sayEnd, fig0) {
  window.__lastWalk = rows.map(r => [r[0], r[1]]);
  const pane = h('div', { class: 'pw-fig' }), list = h('div', { class: 'colstack fstory pw-list' }), out = fNote(); let k = 0;
  const setFig = f => { if (!f) return; pane.innerHTML = ''; typeof f === 'function' ? pane.append(f()) : pane.innerHTML = f; pane.classList.remove('pw-in'); void pane.offsetWidth; pane.classList.add('pw-in'); };
  setFig(fig0 || rows[0][2]);
  const btn = h('button', { class: 'btn info ia', onclick: e => { e.stopPropagation(); const [lab, body, f] = rows[k]; if (k || fig0) setFig(f);
    list.querySelectorAll('.fst-row').forEach(r => r.classList.remove('cur'));
    list.append(h('div', { class: 'fst-row cur' }, h('b', { html: lab }), h('span', { html: FX(body) }))); sfx.pop(k); say((lab + ' ' + body).replace(/<[^>]+>/g, ''), true); k++;
    if (k >= rows.length) { btn.remove(); out.innerHTML = finalHTML || ''; sfx.ok(); if (sayEnd) setTimeout(() => say(sayEnd, true), 1600); } } }, icon('right'), 'ขั้นต่อไป');
  return h('div', { class: 'pwk' }, pane, h('div', { class: 'colstack pw-side' }, list, btn, out));
}
const pexStep = (t, s, rows, fin, sayEnd, fig0) => ({ ...T(t, s, el => el.append(picWalk(rows, fin, sayEnd, fig0))), rows: rows.map(r => [r[0], r[1]]) });
