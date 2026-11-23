'use strict';
/* =========================================================
   APP: map, lesson intro, teach runner, game runner, results
   (game state, scoring, unlock rules and save format are
    unchanged from v1 — only presentation was redesigned)
   ========================================================= */
const app = $('#app');
let cleanup = [];
/* hardware / browser back = step back through the content (never leaves the game) */
let backHandler = null;
(function initBack() { try { history.replaceState({ nl: 1 }, ''); history.pushState({ nl: 2 }, ''); } catch (_) {}
  addEventListener('popstate', () => { try { history.pushState({ nl: 2 }, ''); } catch (_) {} if ($('.modal-bg')) { $('.modal-bg').remove(); return; } if (backHandler) backHandler(); }); })();
/* world backdrop: every screen (map, lesson, game, boss) sits in the world of its grade */
const WORLD_OF = c => c ? (c.theme && c.theme.meadow ? 'meadow' : c.theme && c.theme.river ? 'river' : c.theme && c.theme.desert ? 'desert' : c.theme && c.theme.mountain ? 'mountain' : c.theme && c.theme.cave ? 'cave' : c.theme && c.theme.jungle ? 'jungle' : c.theme && c.theme.beach ? 'beach' : 'city') : 'city';
function setWorld(w) {
  if (document.body.dataset.world === w) return; document.body.dataset.world = w;
  let el = document.getElementById('world'); if (!el) { el = h('div', { id: 'world', 'aria-hidden': 'true' }); document.body.prepend(el); }
  el.innerHTML = worldSVG(w);
}
function worldSVG(w) {
  const sv = (b, vb = '0 0 1600 1000') => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice">${b}${lifeLayer(w, 1600, 1000, 'bg')}</svg>`;
  if (w === 'river') return sv(rvWorldBG()); /* ม.1 (engine/river.js) */
  if (w === 'meadow') return sv(mdWorldBG()); /* ม.3 (engine/meadow.js) */
  if (w === 'desert') { let b = `<defs><radialGradient id="wd-sun"><stop offset="0" stop-color="#FFF3B0"/><stop offset=".6" stop-color="#FFD45C"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient></defs>`;
    b += `<circle cx="1300" cy="170" r="200" fill="url(#wd-sun)" opacity=".7"/><circle cx="1300" cy="170" r="70" fill="#FFE27A"/>`;
    const dune = (y, a, c, op) => `<path d="M0 1000 V${y} Q${200 + a} ${y - 70} 420 ${y - 10} T860 ${y - 20} T1260 ${y - 6} T1600 ${y - 30} V1000 Z" fill="${c}" opacity="${op}"/>`;
    b += dune(640, 40, '#F2C98A', .55) + dune(740, -60, '#EBB46C', .6) + dune(860, 80, '#E3A257', .65);
    b += `<g opacity=".55"><path d="M240 640 L330 500 L420 640 Z" fill="#E7B66F"/><path d="M330 500 L420 640 H370 Z" fill="#D39A50"/><path d="M380 650 L440 560 L500 650 Z" fill="#E7B66F"/></g>`;
    [[110, 960, 1.4], [1500, 950, 1.5], [1420, 985, 1]].forEach(([x, y, k]) => b += `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-8 0 V-80 Q-8 -94 0 -94 Q8 -94 8 -80 V0 Z M-8 -44 H-22 Q-28 -44 -28 -52 V-64 Q-28 -70 -23 -70 Q-18 -70 -18 -64 V-54 H-8 M8 -52 H20 V-66 Q20 -72 25 -72 Q30 -72 30 -66 V-52 Q30 -42 22 -42 H8" fill="#5DBB63" opacity=".85"/></g>`);
    for (let k = 0; k < 14; k++) b += `<path d="M${(k * 211) % 1600} ${300 + (k * 97) % 500} q20 -6 40 0 t40 0" fill="none" stroke="#fff" stroke-width="2" opacity=".35"><animate attributeName="opacity" values=".1;.45;.1" dur="${5 + k % 4}s" repeatCount="indefinite"/></path>`;
    return sv(b); }
  if (w === 'mountain') { let b = `<defs><linearGradient id="wm-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E3EEFA"/></linearGradient></defs>`;
    b += `<circle cx="1330" cy="150" r="64" fill="#FFE27A" opacity=".75"/><circle cx="1330" cy="150" r="110" fill="#FFE27A" opacity=".18"/>`;
    const range2 = (pts, fill, op) => `<path d="M0 1000 ${pts.map(([x, y]) => `L${x} ${y}`).join(' ')} L1600 1000 Z" fill="${fill}" opacity="${op}"/>`;
    const far = [[0, 560], [160, 420], [300, 520], [470, 300], [640, 470], [800, 380], [960, 500], [1130, 280], [1300, 450], [1460, 360], [1600, 470]];
    b += range2(far, '#B9CBE6', .7);
    far.filter((p, i) => i && i < far.length - 1 && p[1] < 430).forEach(([x, y]) => { b += `<path d="M${x - 62} ${y + 70} L${x} ${y} L${x + 62} ${y + 70} L${x + 34} ${y + 58} L${x + 14} ${y + 74} L${x - 8} ${y + 56} L${x - 30} ${y + 72} Z" fill="url(#wm-snow)" opacity=".95"/>`; });
    // terraced steps at the bottom: stacked layers, each a step lower and wider
    const steps = [['#8CC56A', '#6E9F4F', 760], ['#7AB65A', '#5E8F44', 830], ['#69A64C', '#4F7F38', 900]];
    steps.forEach(([top, face, y], k) => { const ins = 260 - k * 120;
      b += `<path d="M${ins} ${y} Q800 ${y - 26} ${1600 - ins} ${y} L1600 ${y + 40} L1600 1000 L0 1000 L0 ${y + 40} Z" fill="${top}" opacity=".7"/><path d="M${ins} ${y} Q800 ${y - 26} ${1600 - ins} ${y} L${1600 - ins} ${y + 22} Q800 ${y - 4} ${ins} ${y + 22} Z" fill="${face}" opacity=".55"/>`; });
    [[200, 120, 1], [620, 200, .8], [980, 110, .9]].forEach(([x, y, k], i) => b += `<g fill="#fff" opacity=".85"><ellipse cx="${x}" cy="${y}" rx="${80 * k}" ry="${24 * k}"><animate attributeName="cx" values="${x};${x + 60};${x}" dur="${30 + i * 8}s" repeatCount="indefinite"/></ellipse><ellipse cx="${x + 40 * k}" cy="${y - 16 * k}" rx="${46 * k}" ry="${26 * k}"><animate attributeName="cx" values="${x + 40 * k};${x + 40 * k + 60};${x + 40 * k}" dur="${30 + i * 8}s" repeatCount="indefinite"/></ellipse></g>`);
    [[110, 930, 1.3], [1500, 920, 1.4], [1420, 960, 1]].forEach(([x, y, k]) => b += `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 -110 L34 -50 H18 L44 0 H-44 L-18 -50 H-34 Z" fill="#2F7D5B" opacity=".85"/><path d="M0 -110 L16 -82 Q8 -76 0 -84 Q-8 -76 -16 -82 Z" fill="#fff" opacity=".9"/></g>`);
    return sv(b); }
  if (w === 'cave') { let b = `<defs><radialGradient id="wg1"><stop offset="0" stop-color="#7FD3E6" stop-opacity=".35"/><stop offset="1" stop-color="#7FD3E6" stop-opacity="0"/></radialGradient><radialGradient id="wg2"><stop offset="0" stop-color="#C9BEFF" stop-opacity=".35"/><stop offset="1" stop-color="#C9BEFF" stop-opacity="0"/></radialGradient></defs>`;
    b += `<circle cx="180" cy="780" r="320" fill="url(#wg1)"/><circle cx="1420" cy="300" r="360" fill="url(#wg2)"/><circle cx="900" cy="980" r="300" fill="url(#wg2)"/>`;
    let d = 'M0 0 H1600 V40'; for (let x = 1600; x >= 0; x -= 80) { const hh = 40 + ((x * 37) % 110); d += ` L${x - 20} 40 L${x - 40} ${hh} L${x - 60} 40`; } b += `<path d="${d} V0 Z" fill="#1C1533" opacity=".9"/>`;
    b += `<path d="M0 1000 V900 Q120 860 220 905 T460 900 T720 915 T980 895 T1240 910 T1600 890 V1000 Z" fill="#1C1533" opacity=".85"/>`;
    [[70, 930, 1], [130, 950, .7], [1490, 920, 1.1], [1540, 945, .7], [820, 960, .6]].forEach(([x, y, k]) => { b += `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 L-16 -60 L0 -96 L16 -60 Z" fill="#7FD3E6" opacity=".8"/><path d="M0 -96 L16 -60 L0 0 Z" fill="#4FB8D1" opacity=".8"/><path d="M-26 6 L-38 -34 L-26 -56 L-14 -34 Z" fill="#B9A6F5" opacity=".75"/></g>`; });
    for (let k = 0; k < 26; k++) b += `<circle cx="${(k * 613) % 1600}" cy="${120 + (k * 271) % 760}" r="${1.5 + (k % 3)}" fill="#FFF3B0" opacity="${.25 + (k % 4) * .1}"><animate attributeName="opacity" values=".1;.6;.1" dur="${4 + k % 5}s" repeatCount="indefinite"/></circle>`;
    return sv(b); }
  if (w === 'jungle') { let b = `<rect width="1600" height="1000" fill="url(#jgBg)"/><defs><linearGradient id="jgBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E7E3A"/><stop offset=".55" stop-color="#5E9E4E"/><stop offset="1" stop-color="#7FB862"/></linearGradient><linearGradient id="jgRiverG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB0D9"/><stop offset="1" stop-color="#2F7FB0"/></linearGradient></defs>`;
    b += `<g opacity=".5">${[180, 470, 800, 1130, 1420].map((x, i) => jgTree(x, 900, 520 + (i % 2) * 120, { dark: 1 })).join('')}</g>`;
    b += jgTree(70, 940, 860) + jgTree(1540, 950, 900);
    const leaf = (x, y, r, s2, c) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s2})"><path d="M0 0 C40 -30 120 -30 170 0 C120 30 40 30 0 0 Z" fill="${c}"/><path d="M0 0 H165" stroke="#2F6B2A" stroke-width="3" opacity=".5"/></g>`;
    for (let x = -40, i = 0; x < 1640; x += 90, i++) b += leaf(x, (i * 23) % 40, 60 + (i * 37) % 60, .9 + (i % 3) * .2, ['#2F7A32', '#3E8F3A', '#4FA243'][i % 3]);
    [260, 640, 1010, 1330].forEach((x, i) => { b += `<path d="M${x} 0 Q${x + (i % 2 ? 30 : -30)} 200 ${x} ${330 + i * 40}" stroke="#4F9E35" stroke-width="7" fill="none" opacity=".85"/>`; for (let y = 40; y < 320 + i * 40; y += 46) b += `<ellipse cx="${x + (y % 92 ? 12 : -12)}" cy="${y}" rx="13" ry="6" fill="#6CCB6A" transform="rotate(${y % 92 ? 30 : -30} ${x} ${y})"/>`; });
    b += jgRiver(1600, 905, 95);
    [[90, 960], [1480, 950], [760, 990]].forEach(([x, y]) => { for (let k = -2; k <= 2; k++) b += leaf(x, y, -90 + k * 22, .55, k % 2 ? '#2F7A32' : '#4FA243'); });
    b += jgWalk(JG.elephant, 905, 1600, 70, 10, 1.3) + jgFlies(1600, 900, 18);
    return sv(b); }
  if (w === 'beach') { let b = `<path d="M0 760 Q400 730 800 760 T1600 750 V1000 H0 Z" fill="#6FB2F5" opacity=".35"/><path d="M0 800 Q400 770 800 800 T1600 790" stroke="#fff" stroke-width="6" fill="none" opacity=".6"><animate attributeName="d" values="M0 800 Q400 770 800 800 T1600 790;M0 805 Q400 820 800 795 T1600 805;M0 800 Q400 770 800 800 T1600 790" dur="6s" repeatCount="indefinite"/></path>`;
    b += `<path d="M0 1000 V880 Q400 850 800 880 T1600 870 V1000 Z" fill="#F6DFA8" opacity=".85"/>`;
    const palm = (x, s, f) => `<g transform="translate(${x} 900) scale(${f * s} ${s})"><path d="M0 0 Q20 -160 60 -290" stroke="#A87140" stroke-width="18" fill="none" stroke-linecap="round"/>${[-150, -110, -60, -20, 25].map(r => `<path d="M60 -290 q${Math.cos(r * Math.PI / 180) * 70} ${Math.sin(r * Math.PI / 180) * 70 - 20} ${Math.cos(r * Math.PI / 180) * 150} ${Math.sin(r * Math.PI / 180) * 150 + 40}" stroke="#4FA85C" stroke-width="22" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
    b += palm(70, 1, 1) + palm(1530, 1.1, -1) + `<circle cx="1380" cy="140" r="70" fill="#FFD45C" opacity=".55"/>`;
    [[300, 150], [900, 90], [1150, 200]].forEach(([x, y]) => b += `<g fill="#fff" opacity=".8"><ellipse cx="${x}" cy="${y}" rx="70" ry="24"/><ellipse cx="${x + 40}" cy="${y - 16}" rx="44" ry="26"/></g>`);
    return sv(b); }
  let b = '';  // P1 city: soft skyline + clouds
  [[260, 140], [880, 80], [1300, 170]].forEach(([x, y]) => b += `<g fill="#fff" opacity=".9"><ellipse cx="${x}" cy="${y}" rx="80" ry="26"/><ellipse cx="${x + 46}" cy="${y - 18}" rx="50" ry="30"/></g>`);
  let x = 0, k = 0; while (x < 1600) { const w2 = 70 + (k * 53) % 90, hh = 90 + (k * 97) % 190; b += `<rect x="${x}" y="${1000 - hh}" width="${w2}" height="${hh}" rx="8" fill="${['#CFE6FF', '#FFE0E7', '#D8F2B5', '#FFF3B0', '#ECE8FF'][k % 5]}" opacity=".75"/>`; for (let wy = 1000 - hh + 20; wy < 980; wy += 34) for (let wx = x + 14; wx < x + w2 - 18; wx += 26) b += `<rect x="${wx}" y="${wy}" width="12" height="16" rx="3" fill="#fff" opacity=".7"/>`; x += w2 + 8; k++; }
  return sv(b);
}
function shell({ top, bottom, lesson, world }) {
  cleanup.forEach(f => f()); cleanup = []; hush(); backHandler = null; Scratch.clear(); // writing never carries over to another page
  setWorld(world || 'city');
  $('.sheet')?.remove(); $('.modal-bg')?.remove(); $('.zoompop')?.remove();
  app.innerHTML = ''; app.style.gridTemplateRows = '';
  const stage = h('main', { id: 'stage', class: lesson ? 'lesson' : 'scroll' });
  app.append(h('header', { class: 'topbar' }, top || ''), stage, h('footer', { class: 'bottombar' }, bottom || ''));
  Scratch.setEnabled(!!lesson);
  return stage;
}
/* unlock chain: each lesson needs the previous non-bonus lesson passed (across cities, so a city opens after the previous boss) */
const unlocked = i => { if (SET.unlockAll || i === 0) return true; const Li = LESSONS[i], Lp = LESSONS[i - 1], gOf = L => CITIES.find(c => c.id === L.city).grade; if (Li.city !== Lp.city && gOf(Li) !== gOf(Lp)) return true; let j = i - 1; if (!LESSONS[i].bonus) while (j > 0 && LESSONS[j].bonus) j--; return (SAVE.stars[LESSONS[j].id] || 0) > 0; };
const cityOf = L => CITIES.find(c => c.id === L.city);
/* a grade's grand boss (city.secret) stays hidden until every chapter boss of that grade is beaten — or the teacher switch in settings is on */
const finalReady = c => CITIES.filter(x => x.grade === c.grade && !x.final).every(x => x.lessons.filter(L => L.boss && !L.bonus).every(L => SAVE.stars[L.id])); /* v192: บอสสอบปลายภาค (bonus) ไม่บังคับ */
const cityShown = c => !c.secret || finalReady(c) || SET.showFinal || SET.unlockAll;
const nextShownCity = c => CITIES.slice(CITIES.indexOf(c) + 1).find(cityShown);
const cityOpen = c => c.secret ? cityShown(c) : unlocked(LESSONS.indexOf(c.lessons[0]));
const kindLabel = L => (L.boss ? 'ด่านบอส' : L.bonus ? 'ด่านพิเศษ' : `ด่านที่ ${L.no}`) + (L.place ? ` · ${L.place}` : '');
const gradeOf = c => GRADES.find(g => g.id === c.grade);
const toneOf = L => PAL[L.tone] || PAL.yellow;
const toneVars = L => { const t = toneOf(L); return { '--acc': t[1], '--acc-l': t[0], '--acc-d': t[2], '--acc-fg': ['yellow', 'orange'].includes(L.tone) ? '#6B4A00' : '#fff' }; };


/* level token (used on the map and in the intro sheet) */
function levelToken(L, i, state, opts = {}) {
  const st = SAVE.stars[L.id] || 0;
  const tok = h('div', { class: 'token' }, state === 'locked' ? icon('lock') : L.boss ? icon('crown') : L.bonus ? icon('star') : h('span', { class: 'n' }, L.no));
  const stand = h('div', { class: 'stand' }, h('div', { class: 'ground' }), tok, state === 'done' ? h('span', { class: 'tag' }, icon('check')) : null);
  const el = h(opts.static ? 'div' : 'button', { class: `lvl ${state}${L.bonus ? ' bonus' : ''}${L.boss ? ' boss' : ''}`, style: { ...toneVars(L), '--fd': (i % 4) * .5 + 's' }, 'aria-label': `${kindLabel(L)} ${L.short}` },
    state === 'current' && !opts.static ? h('div', { class: 'pin' }, mascot('happy')) : null,
    stand,
    opts.static ? null : h('div', { class: 'stars' }, [0, 1, 2].map(k => starArt(k < st))),
    opts.static ? null : h('div', { class: 'name' + (L.place ? ' place' : '') }, L.place ? [h('b', null, L.place), h('small', null, L.short)] : L.short));
  return el;
}

/* ---------------- CLOUD TRANSITION between cities ---------------- */
const CLOUD_SVG = (w, tint) => `<svg viewBox="0 0 200 120" width="${w}" aria-hidden="true"><defs><linearGradient id="cg${tint}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${tint}"/></linearGradient></defs>
  <path d="M42 108 a34 34 0 0 1 -6 -67 a44 44 0 0 1 82 -16 a34 34 0 0 1 54 26 a29 29 0 0 1 -10 57 z" fill="url(#cg${tint})"/><path d="M48 100 a26 26 0 0 1 2 -50" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>`;
function cloudTransition(cb, title, sub) {
  if (REDUCED()) { cb(); return; }
  const mk = side => { const b = h('div', { class: 'bank ' + side });
    [[62, 8, 60, '#E9EEF8'], [48, 30, 6, '#F1F3FA'], [70, 52, 40, '#E4EAF6'], [56, 74, 2, '#EEF1F9'], [66, -6, 18, '#F3F5FB'], [52, 90, 30, '#E7ECF7']].forEach(([w, top, x, tint], i) => {
      const c = h('div', { class: 'cl', html: CLOUD_SVG('100%', tint), style: { width: w + 'vmax', top: top + '%', [side === 'l' ? 'right' : 'left']: x * .4 - 6 + 'vmax', animationDelay: i * .12 + 's' } }); b.append(c); });
    return b; };
  const lbl = h('div', { class: 'cloud-title' }, h('small', null, sub || ''), h('b', null, title || ''));
  const ov = h('div', { class: 'clouds' }, mk('l'), mk('r'), lbl);
  document.body.append(ov); try { tone(220, 0, .6, 'sine', .04); tone(330, .1, .6, 'sine', .03); } catch (e) { }
  requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('in')));
  setTimeout(() => { cb(); }, 760);
  setTimeout(() => { ov.classList.remove('in'); ov.classList.add('out'); }, 1650);
  setTimeout(() => ov.remove(), 2500);
}
function goCity(id) {
  const c = CITIES.find(x => x.id === id);
  if (c.final || c.story) { finalStory(c); return; } /* v192: เมืองสอบปลายภาค (story) = เรื่องเล่าแล้วเข้าสอบเลย เหมือนบอสใหญ่ */
  cloudTransition(() => showMap(id), c.name, `${gradeOf(c).name}${c.term ? ' · ภาคเรียนที่ ' + c.term : ''} · ${c.chapter}`);
}

/* ---------------- FINAL CASTLE: a short story that flows straight into the timed exam ---------------- */
function finalStory(city) {
  const L = city.lessons[0], li = LESSONS.indexOf(L), G = city.grade, gName = gradeOf(city).name, SL = city.story, minis = SL ? megaMinisOf(SL.bosses) : megaMinis(G), mini = (m, st = 'idle') => bossSVG(st, m[0], m[1], m[2]);
  const ov = h('div', { class: 'story-ov' }), stage = h('div', { class: 'story-stage' }), cap = h('div', { class: 'story-cap' }), skip = h('button', { class: 'btn sm story-skip' }, 'ข้าม', icon('right'));
  ov.append(h('div', { class: 'story-sky' }, h('i', { class: 'st-moon' }), ...range(1, 26).map(k => h('i', { class: 'st-star', style: { left: (k * 37) % 100 + '%', top: (k * 23) % 55 + '%', animationDelay: (k % 7) * .3 + 's' } }))), stage, cap, skip);
  document.body.append(ov); hush(); let done = false, T = [];
  const at = (ms, fn) => T.push(setTimeout(() => !done && fn(), ms));
  const line = (t, big) => { cap.innerHTML = ''; cap.append(h(big ? 'b' : 'span', null, t)); cap.classList.remove('on'); void cap.offsetWidth; cap.classList.add('on'); say(t, true); };
  const go = () => { if (done) return; done = true; T.forEach(clearTimeout); ov.classList.add('out'); setTimeout(() => ov.remove(), 500); startBoss(li, { fromStory: true }); };
  skip.onclick = go;
  const castleP1 = h('div', { class: 'st-castle', html: `<svg viewBox="0 0 200 140" aria-hidden="true"><path d="M20 140 V70 h14 v-14 h10 v14 h12 V40 h12 V20 l8 -14 l8 14 v20 h12 v-20 l8 -14 l8 14 v20 h12 v30 h12 v-14 h10 v14 h14 V140 Z" fill="#1E1447"/><path d="M92 140 v-30 q8 -12 16 0 v30 Z" fill="#FF5A6A" opacity=".75"/>${[[60, 64], [132, 64], [76, 40], [116, 40]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="12" rx="4" fill="#FFD45C" class="st-win"/>`).join('')}</svg>` });
  if (L.examGen) L._ex = L.examGen();
  const desert = h('div', { class: 'st-castle st-desert', html: `<svg viewBox="0 0 200 140" aria-hidden="true"><path d="M58 122 L100 52 L142 122 Z" fill="#4A3C8F"/><path d="M100 52 L142 122 H118 Z" fill="#33286E"/><path d="M128 122 L152 84 L176 122 Z" fill="#3A2E7A"/><path d="M93 122 v-14 q7 -9 14 0 v14 Z" fill="#FF5A6A" opacity=".75"/><rect x="96" y="80" width="8" height="10" rx="4" fill="#FFD45C" class="st-win"/><path d="M0 120 q30 -14 64 -2 t70 -4 t66 2 V140 H0 Z" fill="#B9803E"/><path d="M0 128 q40 -10 84 0 t116 -2 V140 H0 Z" fill="#8E5A2A"/><path d="M30 120 v-16 m0 6 h-6 v-6 m6 4 h6 v-8" stroke="#2E6B3A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>` });
  const cave = h('div', { class: 'st-castle st-cave', html: `<svg viewBox="0 0 200 140" aria-hidden="true"><path d="M10 140 V96 q20 -70 90 -78 q70 8 90 78 V140 Z" fill="#3A2E6E"/><path d="M58 140 V108 q10 -40 42 -44 q32 4 42 44 V140 Z" fill="#120C26"/><path d="M40 52 l6 16 l5 -14 M150 50 l5 18 l6 -16 M96 20 l4 14 l4 -14" fill="#5A4A9A"/><path d="M78 92 l6 -12 l6 12 z M116 88 l5 -10 l5 10 z" fill="#7FD6FF" opacity=".8" class="st-win"/><circle cx="100" cy="112" r="5" fill="#FF5A6A" opacity=".8"/><path d="M0 132 H200 V140 H0 Z" fill="#2B2350"/></svg>` });
  const peak = h('div', { class: 'st-castle st-peak', html: `<svg viewBox="0 0 200 140" aria-hidden="true"><path d="M0 140 L60 60 L90 92 L120 30 L200 140 Z" fill="#3A3F7A"/><path d="M120 30 L104 52 L114 50 L120 60 L128 50 L138 54 Z M60 60 L50 74 L60 70 L68 76 Z" fill="#E8F1FF"/><path d="M120 30 V14 l14 5 l-14 5" fill="#FF5A6A" stroke="#E8F1FF" stroke-width="1.4"/><path d="M84 140 v-14 q8 -10 16 0 v14 Z" fill="#FF5A6A" opacity=".75"/><rect x="88" y="108" width="8" height="10" rx="4" fill="#FFD45C" class="st-win"/><path d="M0 128 q50 -10 100 0 t100 0 V140 H0 Z" fill="#DDE8F7"/></svg>` });
  const temple = h('div', { class: 'st-castle st-temple', html: `<svg viewBox="0 0 200 140" aria-hidden="true"><path d="M52 132 V78 h96 V132 Z M60 78 V62 h80 V78 Z M70 62 V48 h60 V62 Z M84 48 V34 h32 V48 Z" fill="#2E4A3A"/><path d="M92 132 v-22 q8 -12 16 0 v22 Z" fill="#FF5A6A" opacity=".75"/><rect x="96" y="38" width="8" height="8" rx="4" fill="#FFD45C" class="st-win"/><path d="M0 140 V96 q20 -30 40 -6 q14 -34 30 -10 V140 Z M200 140 V92 q-18 -30 -38 -4 q-16 -30 -30 -6 V140 Z" fill="#1F5A3A"/><path d="M0 132 H200 V140 H0 Z" fill="#163F2A"/></svg>` });
  const castle = G === 3 ? temple : G === 6 ? peak : G === 5 ? cave : G === 4 ? desert : G === 2 ? h('div', { class: 'st-castle st-sea', html: `<svg viewBox="0 0 200 140" aria-hidden="true"><path d="M70 140 V112 q10 -22 30 -26 q22 4 32 26 V140 Z" fill="#1E1447"/><rect x="94" y="52" width="14" height="40" fill="#2B2E5C"/><path d="M92 52 h18 l-3 -10 h-12 z" fill="#2B2E5C"/><circle cx="101" cy="46" r="5" fill="#FFE27A"/><path class="st-beam" d="M101 46 L200 26 L200 66 Z" fill="#FFE27A" opacity=".25"/><path d="M0 118 q25 -12 50 0 t50 0 t50 0 t50 0 V140 H0 Z" fill="#2F6FA0"/><path d="M0 126 q25 -10 50 0 t50 0 t50 0 t50 0 V140 H0 Z" fill="#1F4F7A"/></svg>` }) : castleP1;
  if (REDUCED()) { stage.append(castle); line(SL ? SL.reduced : G === 3 ? 'งูยักษ์ทุกตัวของ ป.3 รวมร่างเป็นราชางูยักษ์!' : G === 6 ? 'ราชาเยติทุกตัวของ ป.6 รวมร่างเป็นจอมเยติ!' : G === 5 ? 'ราชาหมีทุกตัวของ ป.5 รวมร่างเป็นจอมราชาหมี!' : G === 4 ? 'แมงป่องทุกตัวของ ป.4 รวมร่างเป็นจักรพรรดิแมงป่อง!' : G === 2 ? 'ปีศาจปลาหมึกทุกตัวของ ป.2 รวมร่างเป็นราชาปลาหมึกยักษ์!' : 'บอสทุกตัวของ ป.1 รวมร่างเป็นจอมราชาปีศาจ!', true); at(1800, go); return; }
  stage.append(castle); line(SL ? SL.intro : G === 3 ? 'คืนฝนตก… ณ วิหารโบราณกลางป่าดิบชื้นของ ป.3' : G === 6 ? 'คืนพายุหิมะ… บนยอดเขาที่สูงที่สุดของ ป.6' : G === 5 ? 'ณ ถ้ำที่ลึกที่สุดของ ป.5… คริสตัลเริ่มส่องแสงวูบวาบ' : G === 4 ? 'คืนเดือนหงาย… ณ ใจกลางทะเลทรายของ ป.4' : G === 2 ? 'คืนพระจันทร์เต็มดวง… ณ อ่าวลึกสุดของชายหาด ป.2' : 'ณ ปราสาทราชาปีศาจ… บนยอดเขาสุดท้ายของ ป.1');
  at(2600, () => { castle.classList.add('shake'); sfx.roar(); line(SL ? SL.shake : G === 3 ? 'ต้นไม้ไหวทั้งป่า… มีเสียงขู่ฟ่อดังมาจากในวิหาร!' : G === 6 ? 'หิมะถล่มลงมา… มีเงายักษ์ปรากฏบนยอดเขา!' : G === 5 ? 'ผนังถ้ำสั่นสะเทือน… มีเสียงคำรามดังมาจากความมืด!' : G === 4 ? 'ผืนทรายสั่นสะเทือน… มีอะไรบางอย่างมุดขึ้นมาจากใต้ทราย!' : G === 2 ? 'ทะเลปั่นป่วน… มีอะไรบางอย่างโผล่ขึ้นมาจากใต้น้ำ!' : '“ใครกล้าบุกเข้ามาในปราสาทของพวกเรา!”'); });
  const ring = h('div', { class: 'st-ring' }); at(3200, () => stage.append(ring));
  const step = SL ? 1500 : 260, chOf = id => { const B = LESSONS.find(x => x.id === id), c = B && cityOf(B); return c ? c.chapter : ''; }; /* v192: เรื่องเล่าสอบปลายภาค — บอสแต่ละบทโผล่ทีละตัว พร้อมบอกว่าเป็นบทอะไร (ทวนว่าภาคนี้เรียนอะไรมา) */
  minis.forEach((m, i) => at(4200 + i * step, () => { const a = Math.PI + (i / Math.max(1, minis.length - 1)) * Math.PI, el = h('span', { class: 'st-mini', html: mini(m, i % 2 ? 'laugh' : 'roar'), style: { left: 50 + Math.cos(a) * 38 + '%', top: 54 + Math.sin(a) * 34 + '%' } });
    if (SL) { const ch = chOf(SL.bosses[i]); el.append(h('small', { class: 'st-mlab num' }, (ch.match(/^บทที่ \d+/) || [''])[0])); cap.innerHTML = ''; cap.append(h('span', null, ch)); cap.classList.remove('on'); void cap.offsetWidth; cap.classList.add('on'); }
    ring.append(el); sfx.pop(i % 8); }));
  const t1 = 4200 + minis.length * step + 400;
  at(t1, () => line(SL ? SL.back(minis.length) : G === 3 ? `งูยักษ์ทั้ง ${minis.length} ตัวที่เธอเคยชนะ เลื้อยกลับมาแล้ว!` : G === 6 ? `ราชาเยติทั้ง ${minis.length} ตัวที่เธอเคยชนะ ปีนขึ้นมาบนยอดเขาแล้ว!` : G === 5 ? `ราชาหมีทั้ง ${minis.length} ตัวที่เธอเคยชนะ เดินออกมาจากถ้ำแล้ว!` : G === 4 ? `แมงป่องทั้ง ${minis.length} ตัวที่เธอเคยชนะ คลานกลับมาแล้ว!` : G === 2 ? `ปีศาจปลาหมึกทั้ง ${minis.length} ตัวที่เธอเคยชนะ ว่ายกลับมาแล้ว!` : `ราชาปีศาจทั้ง ${minis.length} ตัวที่เธอเคยชนะ กลับมาแล้ว!`));
  at(t1 + 2400, () => { line('“พวกเรา… รวมร่าง!!!”', true); ring.classList.add('merge'); castle.classList.add('dim'); });
  at(t1 + 3600, () => { const flash = h('i', { class: 'st-flash' }); stage.append(flash); sfx.win(); ring.remove();
    stage.append(h('div', { class: 'st-mega', html: bossSVG('roar', 'night', SL ? L.emblem : gName, 'mega') })); });
  at(t1 + 4400, () => { sfx.roar(); line(`ข้าคือ ${L.bossName}! ตอบให้ถูก ${L.pass} จาก ${L.exam.length} ข้อ ภายใน ${L.timeLimit / 60} นาที ถ้าทำได้!`, true); });
  const cnt = h('div', { class: 'st-count num' });
  [3, 2, 1].forEach((k, j) => at(t1 + 8200 + j * 900, () => { if (!cnt.isConnected) stage.append(cnt); cnt.textContent = k; cnt.classList.remove('pop'); void cnt.offsetWidth; cnt.classList.add('pop'); sfx.tap(); }));
  at(t1 + 8200 + 2700, () => { cnt.textContent = 'สู้!'; cnt.classList.remove('pop'); void cnt.offsetWidth; cnt.classList.add('pop'); sfx.ok(); });
  at(t1 + 8200 + 3400, go);
}

/* ---------------- MAP ---------------- */
function catmull(P) { // smooth path through points
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function defaultCity() {
  if (SAVE.city && CITIES.some(c => c.id === SAVE.city && cityOpen(c))) return SAVE.city;
  const k = LESSONS.findIndex((L, i) => unlocked(i) && !SAVE.stars[L.id]); return k >= 0 ? LESSONS[k].city : CITIES[CITIES.length - 1].id;
}
function showMap(cityId) {
  const stage = shell({});
  app.querySelector('.topbar').style.display = 'none'; app.querySelector('.bottombar').style.display = 'none'; app.style.gridTemplateRows = '1fr';
  let city = CITIES.find(c => c.id === (cityId || defaultCity())) || CITIES[0];
  if (city.final || city.story) { const g = CITIES.slice(0, CITIES.indexOf(city)).filter(c => c.grade === city.grade && !c.final && !c.story); city = g[g.length - 1] || city; } /* the castle (and the term-exam bays, v192) have no map: a story straight into the exam → show the city before it */
  SAVE.city = city.id; persist(); setWorld(WORLD_OF(city));
  backHandler = () => { const cs = CITIES.filter(c => c.grade === city.grade && !c.final && !c.story), k = cs.indexOf(city); if (k > 0) goCity(cs[k - 1].id); };
  const items = LESSONS.map((L, i) => ({ L, i })).filter(x => x.L.city === city.id), n = items.length;
  const total = Object.values(SAVE.stars).reduce((a, b) => a + b, 0), max = LESSONS.length * 3;
  const starCount = h('b', { class: 'num' }, total, h('small', null, ' / ' + max));
  const gradeTabs = h('div', { class: 'gradebar' }, GRADES.map(g => h('button', { class: 'gtab' + (g.id === city.grade ? ' on' : '') + (g.cls ? ' ' + g.cls : ''), onclick: () => { if (g.id === city.grade) return; sfx.page(); const c0 = CITIES.filter(c => c.grade === g.id); const target = c0.find(c => c.id === SAVE['lastCity' + g.id]) || c0[0]; goCity(target.id); } }, h('b', null, g.name))));
  const tabs = h('div', { class: 'citybar' }, CITIES.filter(c => c.grade === city.grade && cityShown(c)).flatMap((c, ci, arr) => { const open = cityOpen(c);
    const sep = (c.term || 1) !== ((arr[ci - 1] && arr[ci - 1].term) || 1) ? [h('span', { class: 'termsep' }, `ภาคเรียนที่ ${c.term}`)] : [];
    return [...sep, h('button', { class: 'ctab' + (c.id === city.id ? ' on' : '') + (open ? '' : ' locked'), onclick: () => { if (!open) { sfx.no(); say('ชนะด่านบอสของเมืองก่อนหน้าก่อนนะ', true); return; } if (c.id !== city.id) { sfx.page(); goCity(c.id); } } },
      h('span', { class: 'cn num' }, (c.chapter.match(/^บทที่ (\d+)/) || [])[1] || '★'), h('span', { class: 'ct' }, h('b', null, c.name), h('small', null, c.chapter.replace(/^บทที่ \d+ /, ''))), open ? null : icon('lock'))]; }));
  const head = h('div', { class: 'maphead' },
    h('div', { class: 'brand' }, mascot('happy'), h('div', { style: { minWidth: 0 } }, h('h1', null, 'ผจญภัยเมืองตัวเลข'), h('p', null, `คณิตศาสตร์ ${gradeOf(city).name} · ${city.chapter} · ตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน`))),
    h('div', { class: 'progress-card', title: 'ดาวที่สะสม' }, starArt(true), h('div', { class: 'meta' }, starCount, h('div', { class: 'pbar' }, h('b', { style: { width: total / max * 100 + '%' } })))),
    zoomBtn(), h('button', { class: 'ibtn', 'aria-label': 'ตั้งค่า', onclick: showSettings }, icon('gear')));
  const wrap = h('div', { class: 'mapwrap' }); stage.append(head, h('div', { class: 'citywrap' }, gradeTabs, tabs), wrap, h('div', { class: 'discl' }, 'เกมฝึกคณิตที่จัดทำขึ้นเอง · ไม่ใช่สื่อทางการของ สสวท.')); SAVE['lastCity' + city.grade] = city.id;
  requestAnimationFrame(() => { const on = tabs.querySelector('.ctab.on'); if (on && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = on.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2; });
  stage.classList.toggle('beach', !!city.theme.beach); stage.classList.toggle('jungle', !!city.theme.jungle); stage.classList.toggle('cave', !!city.theme.cave); stage.classList.toggle('mountain', !!city.theme.mountain); stage.classList.toggle('desert', !!city.theme.desert); stage.classList.toggle('meadow', !!city.theme.meadow); stage.classList.toggle('river', !!city.theme.river);
  const W = Math.min(1040, stage.clientWidth) - 32;
  const MTN = !!city.theme.mountain; // mountain: climb from the bottom terrace up to the summit
  /* ป.6 mountains: the boss stands right on the summit (ผู้ใช้ขอ: ด่านบอสอยู่บนยอดเขาพอดี) — the other levels climb the terraces */
  const SUMMIT = MTN && n > 1 && items[n - 1].L.boss, nR = SUMMIT ? n - 1 : n;
  const perRow = W < 560 ? 2 : W < 860 ? 3 : 4, rows = Math.ceil(nR / perRow), ROWH = W < 560 ? 200 : 190;
  const padX = W < 560 ? 70 : W >= 860 ? 140 : 104, top0 = MTN ? (SUMMIT ? 330 : 250) : city.theme.beach || city.theme.jungle || city.theme.cave || city.theme.desert || city.theme.river || city.theme.meadow ? 150 : 120;
  const H = MTN ? top0 + (rows - 1) * ROWH + 150 : rows * ROWH + 170 + (city.theme.jungle ? 110 : 0), rowY = r => top0 + (MTN ? rows - 1 - r : r) * ROWH, dY = MTN ? -1 : 1;
  const pts = items.map((x, k) => { if (SUMMIT && k === n - 1) return [W / 2, Math.max(40, rowY(rows - 1) - 210) + 40]; const r = Math.floor(k / perRow), c0 = k % perRow, c = r % 2 ? perRow - 1 - c0 : c0; return [padX + (perRow > 1 ? c / (perRow - 1) : .5) * (W - padX * 2), rowY(r)]; });
  const way = []; const idxOf = [];
  pts.forEach((p, k) => {
    idxOf[k] = way.length; way.push(p);
    if ((k + 1) % perRow === 0 && k < nR - 1) { const right = Math.floor(k / perRow) % 2 === 0; way.push([right ? Math.min(W - 18, p[0] + padX * .75) : Math.max(18, p[0] - padX * .75), p[1] + dY * ROWH / 2]); }
  });
  const curK = items.findIndex(x => unlocked(x.i) && !SAVE.stars[x.L.id]);
  const lastDone = curK === -1 ? n - 1 : curK;
  const dAll = catmull(way), dDone = idxOf[lastDone] > 0 && cityOpen(city) ? catmull(way.slice(0, idxOf[lastDone] + 1)) : '';
  const th = city.theme; let hills = '';
  for (let r = 0; r < rows; r++) {
    const y = top0 + r * ROWH, left = r % 2 === 0;
    hills += `<ellipse cx="${left ? W * .12 : W * .88}" cy="${y + ROWH * .52}" rx="${W * .34}" ry="${ROWH * .5}" fill="${th.hills[r % 3]}" opacity=".85"/>`;
    hills += `<ellipse cx="${left ? W * .8 : W * .2}" cy="${y - ROWH * .15}" rx="${W * .26}" ry="${ROWH * .34}" fill="${th.far}" opacity=".8"/>`;
  }
  const beach = !!th.beach, waterN = beach ? (th.waterCount ?? 4) : 0;
  /* shoreline: water covers the first `waterN` levels, sand holds the rest */
  let shoreD = '', seaD = '', landD = '', shoreAt = () => -1;
  if (beach) {
    const cw = perRow > 1 ? (W - padX * 2) / (perRow - 1) : W, wl = pts.slice(0, waterN), base = Math.min(...wl.map(p => p[1])) + 80;
    const raw = x => Math.max(base, ...wl.filter(p => Math.abs(x - p[0]) < cw * .62).map(p => p[1] + 80));
    const xs = range(0, Math.ceil(W / 16)).map(i => Math.min(W, i * 16)), ys = xs.map(raw);
    const sm = ys.map((y, i) => { let t = 0, c = 0; for (let j = i - 4; j <= i + 4; j++) if (ys[j] != null) { t += ys[j]; c++; } return t / c; });
    shoreAt = x => sm[Math.max(0, Math.min(xs.length - 1, Math.round(x / 16)))];
    const sp = xs.map((x, i) => [x, sm[i] + Math.sin(i * .9) * 3]);
    shoreD = catmull(sp);
    seaD = `M0 22 Q0 0 22 0 H${W - 22} Q${W} 0 ${W} 22 V${sp[sp.length - 1][1]} ` + catmull([...sp].reverse()).replace(/^M[^C]+/, '') + ' Z';
    landD = `M0 ${sp[0][1]} ` + catmull(sp).replace(/^M[^C]+/, '') + ` V${H} H0 Z`;
    const waves = range(0, 7).map(i => { const x = (i * 137) % (W - 60) + 20, y = 24 + (i * 53) % Math.max(30, base - 70); return `M${x} ${y} q12 -6 24 0`; }).join(' ');
    hills += `<path d="${seaD}" fill="url(#seaG)"/>
      <path d="${landD}" fill="#F3DDB0" opacity=".55" transform="translate(0 6)"/>
      <path d="${shoreD}" fill="none" stroke="#E9D2A4" stroke-width="16" stroke-linecap="round" transform="translate(0 6)"/>
      <path class="foam" d="${shoreD}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>
      <path class="foam f2" d="${shoreD}" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".55" transform="translate(0 -10)"/>
      <path class="wave" d="${waves}" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`;
  }
  const jungle = !!th.jungle;
  if (jungle) { // leafy canopy along the top, hanging vines, light shafts and mist
    const leaf = (x, len, rot, fill) => `<path d="M${x} -6 q${-len * .32} ${len * .5} 0 ${len} q${len * .32} ${-len * .5} 0 ${-len} z" transform="rotate(${rot} ${x} -6)" fill="${fill}"/>`;
    let leaves = `<path d="M0 22 Q0 0 22 0 H${W - 22} Q${W} 0 ${W} 22 V12 H0 Z" fill="#3E8F3A"/>`;
    for (let x = -10, i = 0; x < W + 20; x += 15, i++) leaves += leaf(x, 40 + (i * 13) % 26, ((i * 37) % 60) - 30, '#3E8F3A');
    for (let x = 0, i = 0; x < W + 20; x += 19, i++) leaves += leaf(x + 6, 30 + (i * 17) % 24, ((i * 53) % 70) - 35, i % 3 ? 'url(#l-leaf)' : 'url(#l-jade)');
    for (let x = 4, i = 0; x < W + 20; x += 31, i++) leaves += leaf(x, 18 + (i * 7) % 12, ((i * 41) % 50) - 25, '#A8DD7C');
    const vines = [.07, .31, .58, .86].map((f, i) => { const x = W * f, L = 70 + (i * 37) % 50; let lv = ''; for (let y = 22; y < L; y += 16) lv += `<ellipse cx="${x + (y % 32 ? 6 : -6)}" cy="${y}" rx="6" ry="3.2" transform="rotate(${y % 32 ? 30 : -30} ${x + (y % 32 ? 6 : -6)} ${y})"/>`;
      return `<g class="vine" style="animation-delay:${-i * 1.3}s"><path d="M${x} 10 q${i % 2 ? 8 : -8} ${L / 2} 0 ${L}" fill="none" stroke="#4F9E35" stroke-width="2.6" stroke-linecap="round"/><g fill="url(#g-leaf)">${lv}</g>${i % 2 ? '' : `<circle cx="${x}" cy="${L + 4}" r="4.5" fill="url(#g-coral)"/>`}</g>`; }).join('');
    const rays = [.18, .5, .78].map(f => `<path d="M${W * f} 0 l60 0 l${-90 + W * .02} ${H * .55} l-60 0 z" fill="url(#rayG)"/>`).join('');
    const mist = range(0, rows).map(r => `<ellipse cx="${r % 2 ? W * .3 : W * .7}" cy="${top0 + r * ROWH + ROWH * .5}" rx="${W * .3}" ry="26" fill="#E8F7D0" opacity=".16"/>`).join('');
    const spots = range(0, rows * 3).map(i => `<ellipse cx="${(i * 211) % W}" cy="${top0 - 40 + (i * 97) % Math.max(100, rows * ROWH)}" rx="${50 + i % 4 * 18}" ry="${16 + i % 3 * 6}" fill="#E9F7B8" opacity=".14"/>`).join('');
    const trunks = [.04, .2, .37, .63, .8, .96].map((f, i) => jgTree(W * f, H - 120, 170 + (i * 47) % 90, { dark: 1 })).join('');
    const ry = H - 104, river = jgRiver(W, ry);
    const crit = jgWalk(JG.elephant, ry - 2, W, 46, 0, .9) + jgWalk(JG.tapir, ry - 4, W, 38, 20, .85, 1) + `<g transform="translate(${W * .58} ${ry + 30})"><g class="jg-bob">${JG.croc}</g></g>`
      + `<g class="jg-fly2" style="--W:${W + 160}px"><g transform="translate(0 70)">${JG.hornbill}</g></g>` + `<g transform="translate(${W * .44} ${ry + 18})"><g class="jg-hover">${JG.dragonfly}</g></g>`;
    hills = `<rect x="0" y="0" width="${W}" height="${H - 20}" rx="22" fill="url(#floorG)"/>` + `<g opacity=".55">${trunks}</g>` + spots + hills + rays + mist + river + crit + jgFlies(W, H) + jgButterflies(W, H);
    var canopy = `<g class="canopy">${leaves}</g>${vines}<g class="vine jg-monkey"><path d="M${W * .45} 10 V96" stroke="#4F9E35" stroke-width="3"/><g transform="translate(${W * .45 - 6} 96)">${JG.monkey}</g></g><g transform="translate(${W * .12} 150) scale(.7)">${JG.hornbill}</g>`;
  }
  const cave = !!th.cave;
  if (cave) { // dark cavern: rock floor, stalactites along the top, glowing crystals and drifting dust
    let stal = `<path d="M0 22 Q0 0 22 0 H${W - 22} Q${W} 0 ${W} 22 V14 H0 Z" fill="#2A2140"/>`;
    for (let x = 6, i = 0; x < W; x += 22, i++) { const L = 22 + (i * 17) % 40, w = 9 + (i * 5) % 8; stal += `<path d="M${x - w} 10 Q${x - 2} ${L * .6} ${x} ${L} Q${x + 2} ${L * .6} ${x + w} 10 Z" fill="${i % 3 ? '#3A2F58' : '#4A3E6B'}"/>`; if (i % 4 === 1) stal += `<circle class="drip" cx="${x}" cy="${L + 6}" r="2.4" fill="#8FE3F4" style="animation-delay:${-(i % 5) * .7}s"/>`; }
    const glow = range(0, rows).map(r => `<ellipse cx="${r % 2 ? W * .22 : W * .78}" cy="${top0 + r * ROWH + ROWH * .45}" rx="${W * .26}" ry="60" fill="url(#caveGlow${r % 2})" opacity=".55"/>`).join('');
    const dust = range(0, 18).map(i => `<circle class="dust" cx="${(i * 97) % W}" cy="${60 + (i * 131) % Math.max(100, H - 120)}" r="${1.2 + (i % 3) * .6}" fill="#FFE9A6" style="animation-delay:${-(i % 6)}s"/>`).join('');
    hills = `<rect x="0" y="0" width="${W}" height="${H - 20}" rx="22" fill="url(#caveG)"/>` + glow + range(0, rows).map(r => `<ellipse cx="${r % 2 ? W * .75 : W * .25}" cy="${top0 + r * ROWH + ROWH * .5}" rx="${W * .34}" ry="${ROWH * .42}" fill="#3A3054" opacity=".55"/>`).join('') + dust;
    var caveTop = `<g class="stal">${stal}</g>`;
  }
  const desert = !!th.desert;
  if (desert) { // sandy dunes under a hot sun, rippled sand and a distant oasis
    let t = `<rect x="0" y="0" width="${W}" height="${H - 20}" rx="22" fill="url(#sandG)"/>`;
    t += `<circle cx="${W * .52}" cy="50" r="52" fill="#FFE27A" opacity=".25"/><circle cx="${W * .52}" cy="50" r="26" fill="#FFE27A" opacity=".9"/>`;
    for (let r = 0; r < rows; r++) { const y = top0 + r * ROWH, left = r % 2 === 0;
      t += `<path d="M${left ? -20 : W * .35} ${y + ROWH * .62} Q${left ? W * .22 : W * .7} ${y - ROWH * .1} ${left ? W * .62 : W + 20} ${y + ROWH * .62} Z" fill="${['#EDBB78', '#F2C98A', '#E7AE66'][r % 3]}" opacity=".75"/>`;
      t += `<path d="M${left ? W * .52 : -10} ${y + ROWH * .1} Q${left ? W * .8 : W * .22} ${y - ROWH * .38} ${left ? W + 10 : W * .5} ${y + ROWH * .1} Z" fill="#F7D9A4" opacity=".7"/>`;
      for (let k = 0; k < 4; k++) t += `<path d="M${(k * 173 + r * 61) % (W - 80) + 20} ${y + 30 + k * 14} q14 -5 28 0 t28 0" fill="none" stroke="#C98A4A" stroke-width="1.6" opacity=".35"/>`; }
    const heat = range(0, 6).map(i => `<path class="heat" d="M${(i * 157) % W} ${80 + (i * 211) % Math.max(100, H - 160)} q10 -6 20 0 t20 0 t20 0" fill="none" stroke="#fff" stroke-width="2" opacity=".5" style="animation-delay:${-i}s"/>`).join('');
    hills = t + heat;
  }
  const mountain = MTN;
  if (mountain) { // terraced mountain: stepped ledges (ขั้น ๆ ชั้น ๆ) narrowing toward a snowy summit
    const ALT = [['#9FD47A', '#7DB85A', '#8E6A4A', '#6F5138'], ['#A9D27E', '#86B862', '#8B6E52', '#6B5440'], ['#B7CF8A', '#93AE6C', '#86735E', '#66574A'], ['#C3C9B2', '#A2AA92', '#837A70', '#625B55'], ['#DCE3EA', '#BFC9D4', '#8C8A94', '#6B6973']];
    const alt = d => ALT[Math.min(ALT.length - 1, Math.round((rows - 1 - d) / Math.max(1, rows - 1) * (ALT.length - 1)))];
    let t = `<rect x="0" y="0" width="${W}" height="${H - 20}" rx="22" fill="url(#skyG)"/>`;
    t += `<circle cx="${W * .84}" cy="70" r="34" fill="#FFE27A" opacity=".85"/><circle cx="${W * .84}" cy="70" r="58" fill="#FFE27A" opacity=".2"/>`;
    // distant ranges with snowcaps
    const peaks = [[0, .62], [.12, .34], [.28, .55], [.42, .3], [.6, .5], [.76, .28], [.92, .5], [1, .4]].map(([x, y]) => [x * W, 60 + y * (top0 + 40)]);
    t += `<path d="M0 ${H} L0 ${peaks[0][1]} ${peaks.map(([x, y]) => `L${x} ${y}`).join(' ')} L${W} ${H} Z" fill="#C3D3EC"/>`;
    peaks.slice(1, -1).forEach(([x, y]) => { if (y < top0 * .55 + 60) t += `<path d="M${x - 34} ${y + 36} L${x} ${y} L${x + 34} ${y + 36} L${x + 18} ${y + 30} L${x + 6} ${y + 40} L${x - 6} ${y + 29} L${x - 20} ${y + 38} Z" fill="#fff" opacity=".95"/>`; });
    // the summit peak above the top terrace
    const sy = rowY(rows - 1), sx = W / 2, pk = Math.max(40, sy - 210);
    t += `<path d="M${sx - W * .34} ${sy - 30} L${sx - 40} ${pk + 30} L${sx} ${pk} L${sx + 46} ${pk + 36} L${sx + W * .34} ${sy - 30} Z" fill="#8C8A94"/><path d="M${sx} ${pk} L${sx + 46} ${pk + 36} L${sx + W * .34} ${sy - 30} L${sx + 30} ${sy - 30} Z" fill="#6B6973" opacity=".55"/>`;
    t += `<path d="M${sx - 40} ${pk + 30} L${sx} ${pk} L${sx + 46} ${pk + 36} L${sx + 30} ${pk + 48} L${sx + 12} ${pk + 36} L${sx - 4} ${pk + 52} L${sx - 22} ${pk + 40} Z" fill="#fff"/>`;
    // terraces, drawn top (summit) to bottom so lower steps overlap the cliff of the one above
    for (let d = 0; d < rows; d++) {
      const y = top0 + d * ROWH, ins = Math.max(6, (padX - 46) * (1 - d / Math.max(1, rows - 1))), [g1, g2, f1, f2] = alt(d);
      const x0 = ins, x1 = W - ins, yt = y - 78, yb = y + 92, wob = i => Math.sin(i * 1.7 + d) * 4;
      let top = `M${x0} ${yt + 14} Q${x0} ${yt} ${x0 + 18} ${yt}`; for (let i = 1; i < 8; i++) top += ` L${x0 + 18 + (x1 - x0 - 36) * i / 8} ${yt + wob(i)}`; top += ` L${x1 - 18} ${yt} Q${x1} ${yt} ${x1} ${yt + 14}`;
      t += `<path d="${top} L${x1} ${yb} L${x0} ${yb} Z" fill="url(#ter${d})"/>`;
      t += `<path d="M${x0} ${yb} L${x1} ${yb} L${x1 - 4} ${yb + 34} Q${W / 2} ${yb + 40} ${x0 + 4} ${yb + 34} Z" fill="${f1}"/>`;
      for (let k = 0; k < 3; k++) t += `<path d="M${x0 + 8} ${yb + 9 + k * 9} Q${W * .3} ${yb + 6 + k * 9 + (k % 2 ? 3 : -2)} ${W / 2} ${yb + 9 + k * 9} T${x1 - 8} ${yb + 9 + k * 9}" fill="none" stroke="${f2}" stroke-width="2" opacity=".55"/>`;
      t += `<path d="M${x0 + 4} ${yb} H${x1 - 4}" stroke="${g2}" stroke-width="5" stroke-linecap="round"/><path d="${top}" fill="none" stroke="#fff" stroke-width="3" stroke-opacity=".55"/>`;
      if (d === 0) t += `<path d="M${x0 + 20} ${yt + 4} Q${W / 2} ${yt - 10} ${x1 - 20} ${yt + 4} L${x1 - 40} ${yt + 18} Q${W / 2} ${yt + 6} ${x0 + 40} ${yt + 18} Z" fill="#fff" opacity=".9"/>`;
      var terDefs = (terDefs || '') + `<linearGradient id="ter${d}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/></linearGradient>`;
    }
    const clouds = [[.18, 130], [.62, 60], [.4, 200]].map(([f, y], i) => `<g class="mcloud" style="animation-delay:${-i * 7}s" fill="#fff" opacity=".9"><ellipse cx="${W * f}" cy="${y}" rx="46" ry="15"/><ellipse cx="${W * f + 24}" cy="${y - 10}" rx="28" ry="16"/></g>`).join('');
    hills = t; var mtnTop = clouds;
  }
  const river = !!th.river;
  if (river) { /* v214 ม.1: แผ่นดิน (ทุ่ง นาข้าว เนิน) — เส้นทางด่านเป็นแม่น้ำที่ไหลผ่าน */
    let t = `<rect x="0" y="0" width="${W}" height="${H - 20}" rx="22" fill="url(#rvLandG)"/>`;
    for (let r = 0; r < rows; r++) { const y = top0 + r * ROWH, left = r % 2 === 0;
      t += `<ellipse cx="${left ? W * .14 : W * .86}" cy="${y + ROWH * .5}" rx="${W * .3}" ry="${ROWH * .46}" fill="${th.hills[r % 3]}" opacity=".8"/>`;
      const px = left ? W * .58 : W * .1, py = y + ROWH * .3, pw = W * .3;
      t += `<g opacity=".55"><path d="M${px} ${py} h${pw} l-18 44 h-${pw} z" fill="#A6D77E"/>${[0, 1, 2].map(k => `<path d="M${px - k * 6} ${py + 12 + k * 12} h${pw}" stroke="#7FB85A" stroke-width="2"/>`).join('')}</g>`; }
    hills = t;
  }
  const meadow = !!th.meadow;
  if (meadow) { /* v228 ม.3: ทุ่งดอกไม้ — แถบดอกทิวลิปสลับสี เส้นทางด่านเป็นทางเดินในสวน */
    let t = `<rect x="0" y="0" width="${W}" height="${H - 20}" rx="22" fill="url(#mdLandG)"/>`; const FC = ['#FF8A9A', '#FFC34D', '#C9A0FF', '#FFFFFF'];
    for (let r = 0; r < rows; r++) { const y = top0 + r * ROWH + ROWH * .5, left = r % 2 === 0;
      t += `<ellipse cx="${left ? W * .16 : W * .84}" cy="${y}" rx="${W * .3}" ry="${ROWH * .42}" fill="${th.hills[r % 3]}" opacity=".8"/>`;
      for (let k = 0; k < 2; k++) { const yy = y + ROWH * .1 + k * 14, x0 = left ? W * .56 : W * .08, x1 = x0 + W * .3, c = FC[(r + k) % 4]; t += `<path d="M${x0} ${yy} Q${(x0 + x1) / 2} ${yy - 8} ${x1} ${yy}" stroke="${c}" stroke-width="9" stroke-linecap="round" fill="none" opacity=".75"/>`; for (let x = x0 + 6; x < x1; x += 18) t += `<circle cx="${x}" cy="${yy - 2 - Math.sin((x - x0) / (x1 - x0) * Math.PI) * 4}" r="3.4" fill="${c}" stroke="#fff" stroke-width="1"/>`; } }
    hills = t;
  }
  const road = meadow ? { shadow: '#5A4020', edge: '#C9A06A', surf: '#F2DEB0', dots: true } : river ? { shadow: '#1E5A7A', edge: '#E3CF98', surf: '#6EC3EC' } : desert ? { shadow: '#6B3F14', edge: '#B97A3A', surf: '#F4D49A', dots: true } : mountain ? { shadow: '#3B2A1A', edge: '#A98A66', surf: '#E8D2AC', dots: true } : cave ? { shadow: '#000', edge: '#5B4F78', surf: '#8D80A8', seam: '#6E6290', dots: true } : beach ? { shadow: '#5A3D1A', edge: '#B98654', surf: '#E2B57F', seam: '#C69361', dots: false } : jungle ? { shadow: '#2E4A1F', edge: '#B08455', surf: '#DDB985', dots: true } : { shadow: '#2B2550', edge: '#E6D3AC', surf: '#F8ECD2', dots: true };
  const roadSvg = river ? `
    <path d="${dAll}" fill="none" stroke="${road.shadow}" stroke-opacity=".14" stroke-width="66" stroke-linecap="round" transform="translate(0 6)" filter="url(#roadBlur)"/>
    <path d="${dAll}" fill="none" stroke="#C9B47C" stroke-width="64" stroke-linecap="round"/>
    <path d="${dAll}" fill="none" stroke="${road.edge}" stroke-width="58" stroke-linecap="round"/>
    <path d="${dAll}" fill="none" stroke="#3E97CF" stroke-width="46" stroke-linecap="round"/>
    <path d="${dAll}" fill="none" stroke="url(#rvWaterG)" stroke-width="40" stroke-linecap="round"/>
    ${dDone ? `<path d="${dDone}" fill="none" stroke="#A8E6F8" stroke-width="22" stroke-linecap="round" opacity=".75"/>` : ''}
    <path class="rv-flow" d="${dAll}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="18 34" opacity=".75" transform="translate(0 -8)"/>
    <path class="rv-flow f2" d="${dAll}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-dasharray="10 46" opacity=".55" transform="translate(0 9)"/>
    ${dDone ? `<path d="${dDone}" fill="none" stroke="#F5B52E" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 24"/>` : ''}` : beach ? `
    <g clip-path="url(#landClip)">
      <path d="${dAll}" fill="none" stroke="${road.shadow}" stroke-opacity=".12" stroke-width="46" transform="translate(0 7)" filter="url(#roadBlur)"/>
      <path d="${dAll}" fill="none" stroke="${road.edge}" stroke-width="42"/>
      <path d="${dAll}" fill="none" stroke="${road.surf}" stroke-width="34"/>
      ${dDone ? `<path d="${dDone}" fill="none" stroke="#F3CF8E" stroke-width="34"/>` : ''}
      <path d="${dAll}" fill="none" stroke="${road.seam}" stroke-width="34" stroke-dasharray="2.5 11"/>
    </g>
    <g clip-path="url(#seaClip)">
      <path d="${dAll}" fill="none" stroke="#2B6FBA" stroke-opacity=".18" stroke-width="10" transform="translate(0 4)"/>
      <path d="${dAll}" fill="none" stroke="#FFF7E6" stroke-width="3.5" stroke-dasharray="7 5"/>
      <path class="buoys" d="${dAll}" fill="none" stroke="#FF6F7D" stroke-width="13" stroke-linecap="round" stroke-dasharray="0 46"/>
      <path d="${dAll}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 46"/>
      ${dDone ? `<path d="${dDone}" fill="none" stroke="#F5B52E" stroke-width="13" stroke-linecap="round" stroke-dasharray="0 46" stroke-dashoffset="23"/>` : ''}
    </g>` : `
    <path d="${dAll}" fill="none" stroke="${road.shadow}" stroke-opacity=".12" stroke-width="46" stroke-linecap="round" transform="translate(0 7)" filter="url(#roadBlur)"/>
    <path d="${dAll}" fill="none" stroke="${road.edge}" stroke-width="42" stroke-linecap="round"/>
    <path d="${dAll}" fill="none" stroke="${road.surf}" stroke-width="34" stroke-linecap="round"/>
    ${dDone ? `<path class="road-done" d="${dDone}" fill="none" stroke="${cave ? '#C9A85A' : jungle ? '#F0CF8E' : desert ? '#FFE08A' : meadow ? '#FFE9A8' : '#FFE7A3'}" stroke-width="34" stroke-linecap="round"/>` : ''}
     <path d="${dAll}" fill="none" stroke="${cave ? '#FFD45C' : jungle ? '#F3E2C2' : '#fff'}" stroke-opacity="${cave ? .55 : .85}" stroke-width="${jungle ? 10 : 6}" stroke-linecap="round" stroke-dasharray="0 24"/>
    ${dDone ? `<path d="${dDone}" fill="none" stroke="#F5B52E" stroke-width="6" stroke-linecap="round" stroke-dasharray="0 24"/>` : ''}`;
  const land = `<svg class="land" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <defs><filter id="roadBlur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F6B35"/><stop offset=".45" stop-color="#4A8C44"/><stop offset="1" stop-color="#5E9E52"/></linearGradient><linearGradient id="jgRiverG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB0D9"/><stop offset="1" stop-color="#2F7FB0"/></linearGradient>
      <linearGradient id="rayG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8D6" stop-opacity=".55"/><stop offset="1" stop-color="#FFF8D6" stop-opacity="0"/></linearGradient>
      <linearGradient id="caveG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2547"/><stop offset=".5" stop-color="#3B3159"/><stop offset="1" stop-color="#4A3F6A" stop-opacity=".85"/></linearGradient>
      <radialGradient id="caveGlow0"><stop offset="0" stop-color="#8FE3F4" stop-opacity=".55"/><stop offset="1" stop-color="#8FE3F4" stop-opacity="0"/></radialGradient>
      <radialGradient id="caveGlow1"><stop offset="0" stop-color="#C9A6FF" stop-opacity=".5"/><stop offset="1" stop-color="#C9A6FF" stop-opacity="0"/></radialGradient>
      <linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE7BE"/><stop offset=".55" stop-color="#F6D7A0"/><stop offset="1" stop-color="#EFC783" stop-opacity=".9"/></linearGradient>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD0F5"/><stop offset=".6" stop-color="#D6ECFB"/><stop offset="1" stop-color="#EAF5FC"/></linearGradient>${mountain ? terDefs : ''}
      <linearGradient id="mdLandG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3F3CC"/><stop offset=".6" stop-color="#CFEAB2"/><stop offset="1" stop-color="#BFE29C"/></linearGradient><linearGradient id="rvLandG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9EFC2"/><stop offset=".6" stop-color="#C8E7AA"/><stop offset="1" stop-color="#B9DE98"/></linearGradient><linearGradient id="rvWaterG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8BD5F2"/><stop offset="1" stop-color="#5BB5E6"/></linearGradient>
      <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5DB8E8"/><stop offset=".55" stop-color="#8FD0F0"/><stop offset="1" stop-color="#C4EAF7"/></linearGradient>
      ${beach ? `<clipPath id="seaClip"><path d="${seaD}"/></clipPath><clipPath id="landClip"><path d="${landD}"/></clipPath>` : ''}</defs>
    ${hills}
    ${lifeLayer(meadow ? 'meadow' : river ? 'river' : beach ? 'beach' : jungle ? 'jungle' : cave ? 'cave' : desert ? 'desert' : mountain ? 'mountain' : 'city', W, H, 'map')}
    ${roadSvg}
    ${jungle ? canopy : ''}
    ${cave ? caveTop : ''}
    ${mountain ? mtnTop : ''}
  </svg>`;
  const map = h('div', { class: 'map', style: { height: H + 'px', width: W + 'px', margin: '0 auto' }, html: land });
  const deco = (k, x, y, sz, sway) => map.append(h('div', { class: 'scenery' + (sway ? ' sway' : ''), style: { left: x + 'px', top: y + 'px', '--sz': sz + 'px' }, html: sceneryHTML(k) }));
  const inSea = (x, y) => beach && y < shoreAt(x) - 6;
  for (let k = 0; k < n - 1; k++) { const a = pts[k], b = pts[k + 1]; if (a[1] !== b[1]) continue; const x = (a[0] + b[0]) / 2, y = a[1] - 34;
    if (meadow) { const wk = MD_PATH[k % MD_PATH.length]; deco(wk, x, y + 50, wk === 'mdbee' ? 34 : 40, false); deco(th.small[k % th.small.length], x, y - 14, 46, false); continue; }
    if (river) { const wk = RV_WATER[k % RV_WATER.length]; deco(wk, x, y + 52, wk === 'kayak' || wk === 'croc' ? 50 : 40, false); deco(th.small[k % th.small.length], x, y - 14, 44, false); continue; }
    if (inSea(x, y)) deco(['fishjump', 'lifebuoy', 'boat'][k % 3], x, y + (k % 3 === 2 ? 4 : 10), k % 3 === 2 ? 56 : 44, false); else deco(th.small[k % th.small.length], x, y, (k % 3 === 2 ? 52 : 40) + (jungle || cave || mountain || desert ? 12 : 0), false); }
  if (padX >= 120) for (let r = 0; r < rows; r++) {
    const turnRight = r % 2 === 0, y = rowY(r) + dY * ROWH * .52, x = turnRight ? 34 : W - 34;
    if (r === rows - 1 && nR % perRow) continue;
    if (inSea(x, y)) { deco(r % 2 ? 'boat' : 'fishjump', x, y, 58, false); continue; }
    const k = th.edge[r % 4] === 'boat' ? 'umbrella' : th.edge[r % 4]; deco(k, x, y, k === 'house' || k === 'shop' ? 62 : k === 'jtree' ? 84 : k === 'bigtree' ? 128 : 66, !['house', 'shop', 'umbrella', 'tent', 'cairn', 'pyramid', 'dunerock', 'oasis', 'stilthouse', 'ricebarn', 'pier', 'windmill', 'beehive', 'fence', 'haybale'].includes(k));
    deco(meadow ? (r % 2 ? 'daisy' : 'tulips') : river ? (r % 2 ? 'reeds' : 'flowers') : beach ? (r % 2 ? 'starfish' : 'shell') : jungle ? (r % 2 ? 'mushroom' : 'heliconia') : cave ? (r % 2 ? 'glowshroom' : 'rocks') : mountain ? (r % 2 ? 'edelweiss' : 'rock') : desert ? (r % 2 ? 'tumble' : 'dunerock') : (r % 2 ? 'flowers' : 'bush'), x + (turnRight ? 30 : -30), y + 16, beach ? 30 : 40, false);
  }
  const newly = [];
  items.forEach(({ L, i }, k) => {
    const st = SAVE.stars[L.id] || 0, open = unlocked(i);
    const state = !open ? 'locked' : k === curK ? 'current' : st ? 'done' : 'available';
    const node = levelToken(L, i, state); if (k < waterN || river) node.classList.add('in-water');
    node.style.left = pts[k][0] + 'px'; node.style.top = pts[k][1] + 'px';
    if (open && !SAVE.seen.includes(L.id)) { node.classList.add('unlocking'); newly.push(L.id); setTimeout(() => burst(node), 350); }
    node.onclick = () => { if (!open) { sfx.no(); node.querySelector('.token').animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 300 }); say(L.boss ? 'ผ่านทุกด่านในเมืองก่อน แล้วค่อยมาสู้บอสนะ' : 'ผ่านด่านก่อนหน้าก่อนนะ', true); return; } sfx.tap(); showIntro(i); };
    map.append(node);
  });
  if (MTN && !SUMMIT) { const sy = rowY(rows - 1); deco('sumflag', W / 2 + 2, Math.max(40, sy - 210) + 6, 58, true); }
  // gate to the next city
  const nextCity = nextShownCity(city);
  if (nextCity) {
    const last = pts[n - 1], open = cityOpen(nextCity), gx = SUMMIT ? Math.min(W - 110, W / 2 + 200) : Math.min(W - 110, Math.max(110, last[0]));
    map.append(h('button', { class: 'gate' + (open ? ' open' : ''), style: { left: gx + 'px', top: last[1] + (SUMMIT ? -10 : MTN ? -150 : 122) + 'px' }, onclick: () => { if (!open) { sfx.no(); say('ชนะด่านบอสก่อน แล้วจะไปเมืองต่อไปได้', true); return; } sfx.page(); goCity(nextCity.id); } },
      h('span', { class: 'gi' }, icon(open ? 'flag' : 'lock')), h('span', null, h('small', null, 'เมืองถัดไป'), h('b', null, nextCity.name)), open ? icon('right') : null));
  }
  if (newly.length) { SAVE.seen.push(...newly); persist(); setTimeout(() => sfx.win(), 300); }
  wrap.append(map);
  if (SAVE.lastEarned) {
    const k = items.findIndex(x => x.L.id === SAVE.lastEarned.id), nd = map.querySelectorAll('.lvl')[k];
    nd && nd.querySelectorAll('.stars .rstar.on').forEach((s, j) => s.animate([{ transform: 'scale(0) rotate(-40deg)' }, { transform: 'scale(1.4)' }, { transform: (j === 1 ? 'translateY(-5px)' : 'none') }], { duration: 600, delay: 250 + j * 160, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' }));
    if (k >= 0) { delete SAVE.lastEarned; persist(); }
  }
  const onR = () => { clearTimeout(onR.t); onR.t = setTimeout(() => { if ($('.map')) showMap(city.id); }, 200); };
  addEventListener('resize', onR); cleanup.push(() => removeEventListener('resize', onR));
  const focus = curK === -1 ? n - 1 : curK;
  setTimeout(() => { if (pts[focus][1] > innerHeight * .5) stage.scrollTo({ top: pts[focus][1] - innerHeight * .35, behavior: REDUCED() ? 'auto' : 'smooth' }); }, 250);
}
function burst(node) {
  if (REDUCED()) return;
  const st = node.querySelector('.stand'); const cols = ['#F5B52E', '#FF6F7D', '#4C9BF0', '#2FBF8C'];
  for (let i = 0; i < 12; i++) {
    const b = h('span', { class: 'burst', style: { background: cols[i % 4] } }); st.append(b);
    const a = i / 12 * Math.PI * 2, r = 60 + Math.random() * 20;
    b.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * r - 4}px,${Math.sin(a) * r - 4}px) scale(.4)`, opacity: 0 }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => b.remove();
  }
}

/* ---------------- MODALS ---------------- */
function modal(content) {
  const bg = h('div', { class: 'modal-bg', onclick: e => { if (e.target === bg) bg.remove(); } }, h('div', { class: 'modal', role: 'dialog' }, content));
  document.body.append(bg); return bg;
}
function showIntro(i) {
  const L = LESSONS[i]; sfx.page();
  const st = SAVE.stars[L.id] || 0;
  const m = modal([
    h('div', { class: 'intro-head' }, levelToken(L, i, st ? 'done' : 'available', { static: true }),
      h('div', { style: { minWidth: 0 } }, h('div', { class: 'overline' }, cityOf(L).name, ' · ', kindLabel(L), st ? ` · ได้ ${st} ดาว` : ''), h('h2', null, L.title))),
    h('div', { class: 'goal' }, h('div', { class: 'k' }, icon('sparkle', '16px'), 'จุดประสงค์การเรียนรู้'), L.goal),
    L.boss ? h('ul', { class: 'feat' },
      h('li', null, h('span', { class: 'fi', style: { background: 'var(--lilac-soft)', color: 'var(--lilac)' } }, icon('flag')), h('span', null, h('b', null, `${L.exam.length} ข้อ`), ' — ตอบได้ข้อละ 1 ครั้ง ไม่มีคำใบ้ เหมือนสอบจริง')),
      h('li', null, h('span', { class: 'fi', style: { background: 'var(--coral-soft)', color: 'var(--coral-2)' } }, icon('sparkle')), h('span', null, h('b', null, 'ตอบถูก'), ` — โจมตี${L.bossName} 1 ครั้ง`)),
      h('li', null, h('span', { class: 'fi', style: { background: 'var(--gold-soft)', color: '#8A6200' } }, icon('crown')), h('span', null, h('b', null, `ถูก ${L.pass} ข้อขึ้นไป`), ' — ชนะบอส ' + (CITIES[CITIES.indexOf(cityOf(L)) + 1] ? 'และเปิดเมืองถัดไป' : '')))) :
    h('ul', { class: 'feat' },
      L.noTeach ? null : h('li', null, h('span', { class: 'fi', style: { background: 'var(--sky-soft)', color: 'var(--sky-2)' } }, icon('book')), h('span', null, h('b', null, 'เรียน'), ' — แตะตรงไหนก็ได้เพื่อไปทีละขั้น')),
      h('li', null, h('span', { class: 'fi', style: { background: 'var(--gold-soft)', color: '#8A6200' } }, icon('game')), h('span', null, h('b', null, 'เล่น'), ' — ตอบด้วยการกดตัวเลข หรือเขียนด้วยนิ้ว/ปากกา')),
      h('li', null, h('span', { class: 'fi', style: { background: 'var(--mint-soft)', color: 'var(--mint-2)' } }, icon('pencil')), h('span', null, h('b', null, 'ทด'), ' — เปิดกระดาษทดได้ทั้งจอ Apple Pencil เขียนบนที่ว่างได้ทันที'))),
    null, // IPST clip links removed (ผู้ใช้ขอ)
    L.boss ? h('div', { class: 'actions' }, h('button', { class: 'btn danger lg', onclick: () => { m.remove(); startBoss(i); } }, icon('flag'), 'เริ่มสอบ · สู้บอส')) :
    h('div', { class: 'actions' },
      L.noTeach ? null : h('button', { class: 'btn primary lg', onclick: () => { m.remove(); startTeach(i); } }, icon('book'), 'เริ่มเรียน'), /* v190: ด่านทดสอบไม่มีการสอน */
      h('button', { class: 'btn accent lg', onclick: () => { m.remove(); startGame(i); } }, icon('game'), 'เล่นเกมเลย'))
  ]);
  say(L.title);
}
function showSettings() {
  const sw = (key, label, onChange) => { const s = h('button', { class: 'toggle' + (SET[key] ? ' on' : ''), role: 'switch', 'aria-label': label }); s.onclick = () => { SET[key] = !SET[key]; s.classList.toggle('on', SET[key]); persist(); onChange && onChange(); }; return h('div', { class: 'setrow' }, h('span', null, label), s); };
  const m = modal([h('div', { class: 'overline' }, 'ตั้งค่า'), h('h2', { style: { marginBottom: '8px' } }, 'การเล่นและเสียง'),
    sw('mute', 'ปิดเสียงทั้งหมด', () => setMute(SET.mute)),
    sw('speak', 'อ่านออกเสียงคำสั่ง (ภาษาไทย)'),
    sw('sfx', 'เสียงเอฟเฟกต์'),
    sw('penAnywhere', 'Apple Pencil เขียนทดบนที่ว่างได้ทุกที่'),
    sw('askNudge', 'ไก่น้อยถาม “มีอะไรถามมั้ย” ทุก 30 วินาที ระหว่างเล่นเกม'),
    sw('unlockAll', 'ปลดล็อกทุกด่าน (สำหรับครู)', () => { m.remove(); showMap(); }),
    sw('showFinal', 'แสดงด่านบอสใหญ่ประจำชั้นเสมอ (ปกติจะปรากฏเมื่อชนะบอสครบทุกบท)', () => { m.remove(); showMap(); }),
    h('div', { class: 'setrow' }, h('span', null, 'ขนาดหน้าจอ (ซูม) · ใช้สองนิ้วถ่าง/หุบได้'), zoomCtl()),
    h('div', { class: 'actions' },
      h('button', { class: 'btn', onclick: e => { const bt = e.currentTarget; if (bt.dataset.c) { SAVE.stars = {}; SAVE.seen = [LESSONS[0].id]; SAVE.city = 1; persist(); m.remove(); showMap(); return; } bt.dataset.c = 1; bt.classList.add('danger'); bt.lastChild.textContent = 'กดอีกครั้งเพื่อยืนยัน'; } }, icon('trash'), h('span', null, 'เริ่มใหม่ทั้งหมด')),
      h('button', { class: 'btn primary', onclick: () => m.remove() }, icon('check'), 'เสร็จ'))]);
}

/* ---------------- zoom: buttons · pinch (two fingers) · ctrl/⌘ + wheel or trackpad pinch · ctrl/⌘ + = − 0 ---------------- */
const ZOOM_MIN = .8, ZOOM_MAX = 2;
let zoomSave = 0;
const zoomNow = () => SET.zoom || 1;
/* effective zoom: never so large that the play area gets narrower than ~360 css px (phones) */
const zoomEff = () => Math.max(ZOOM_MIN, Math.min(zoomNow(), Math.max(1, innerWidth / 360)));
const applyZoom = () => { document.documentElement.style.setProperty('--zoom', zoomEff()); dispatchEvent(new Event('layoutzoom')); };
/* writing pads measure themselves on screen — re-measure after any zoom change */
const padsResize = (root = document) => requestAnimationFrame(() => root.querySelectorAll('canvas').forEach(c => c.__pad && c.__pad.resize()));
addEventListener('resize', () => { applyZoom(); padsResize(); });
function setZoom(z, toast = true) {
  z = Math.round(Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z)) * 100) / 100; if (z === zoomNow()) return;
  SET.zoom = z; applyZoom(); padsResize(); document.querySelectorAll('.zoomval').forEach(e => e.textContent = Math.round(z * 100) + '%');
  clearTimeout(zoomSave); zoomSave = setTimeout(persist, 400); if (toast) zoomToast(z);
}
function zoomToast(z) { let t = $('.zoomtoast'); if (!t) { t = h('div', { class: 'zoomtoast', 'aria-live': 'polite' }); document.body.append(t); }
  t.innerHTML = iconHTML('zoom') + `<span>${Math.round(z * 100)}%</span>`; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 900); }
const zoomCtl = () => h('div', { class: 'zoomctl', role: 'group', 'aria-label': 'ซูม' },
  h('button', { class: 'ibtn', 'aria-label': 'ซูมออก', onclick: e => { e.stopPropagation(); sfx.tap(); setZoom(zoomNow() - .1, false); } }, PM_('-')),
  h('button', { class: 'zoomval', 'aria-label': 'กลับเป็นขนาดปกติ', title: 'กดเพื่อกลับเป็น 100%', onclick: e => { e.stopPropagation(); sfx.tap(); setZoom(1, false); } }, Math.round(zoomNow() * 100) + '%'),
  h('button', { class: 'ibtn', 'aria-label': 'ซูมเข้า', onclick: e => { e.stopPropagation(); sfx.tap(); setZoom(zoomNow() + .1, false); } }, PM_('+')));
function zoomBtn() {
  const b = h('button', { class: 'ibtn zoombtn', 'aria-label': 'ซูมเข้า/ออก', 'aria-expanded': 'false' }, icon('zoom'));
  b.onclick = e => { e.stopPropagation(); sfx.tap(); let p = $('.zoompop'); if (p) { p.remove(); b.setAttribute('aria-expanded', 'false'); return; }
    const r = b.getBoundingClientRect(); p = h('div', { class: 'zoompop' }, zoomCtl()); p.style.top = r.bottom + 8 + 'px'; p.style.right = Math.max(8, innerWidth - r.right) + 'px';
    document.body.append(p); b.setAttribute('aria-expanded', 'true');
    const off = ev => { if (!p.isConnected) return removeEventListener('pointerdown', off, true); if (!p.contains(ev.target) && !b.contains(ev.target)) { p.remove(); b.setAttribute('aria-expanded', 'false'); removeEventListener('pointerdown', off, true); } };
    addEventListener('pointerdown', off, true); };
  return b;
}
(() => {
  let pz = null, fz = null; const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY), mid = t => [(t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2], touch = 'ontouchstart' in window;
  /* pinch ON a picture zooms only that picture (ผู้ใช้ขอ); pinch anywhere else zooms the whole game as before */
  const figAt = (x, y) => { for (const el of document.elementsFromPoint(x, y)) { if (el.closest('.keypad, button, .opts, .ans, .tguide, .zoompop, #scratch, .maphead, .topbar, .bottombar')) return null;
      const f = el.closest('.t6-board, .p4-fig, .pw-fig, .lrn-pfig, .gch, .zfig'); if (f) return f;
      const sv = el.closest('svg:not(.icon):not(.ic), img'); if (sv && !sv.closest('.map, .lvl, .speech, .bubble, .mascot')) { const r = sv.getBoundingClientRect(); if (r.width > 120 && r.height > 80) return sv; } }
    return null; };
  const figSet = (f, z) => { f.__fz = z; f.style.transformOrigin = '0 0'; f.style.transform = z.s > 1.001 ? `translate(${z.tx}px, ${z.ty}px) scale(${z.s})` : ''; f.classList.toggle('fz-on', z.s > 1.001);
    let rb = document.querySelector('.fz-reset'); const any = [...document.querySelectorAll('.fz-on')].some(n => n.isConnected);
    if (any && !rb) { rb = h('button', { class: 'btn sm fz-reset', onclick: e => { e.stopPropagation(); sfx.tap(); document.querySelectorAll('.fz-on').forEach(n => figSet(n, { s: 1, tx: 0, ty: 0 })); } }, icon('replay'), h('span', null, 'รูปขนาดเดิม')); document.body.append(rb); }
    else if (!any && rb) rb.remove(); };
  addEventListener('pointerdown', () => { const rb = document.querySelector('.fz-reset'); if (rb && ![...document.querySelectorAll('.fz-on')].some(n => n.isConnected)) rb.remove(); }, true);
  addEventListener('touchstart', e => { if (e.touches.length === 2 && !Scratch.on) { const m = mid(e.touches), f = figAt(m[0], m[1]);
      if (f) { const z = f.__fz || { s: 1, tx: 0, ty: 0 }, r = f.getBoundingClientRect(), k = r.width / ((f.offsetWidth || f.clientWidth || r.width) * z.s) || 1, B = [r.left - z.tx * k, r.top - z.ty * k];
        fz = { f, k, B, d0: dist(e.touches) || 1, s0: z.s, p: [((m[0] - B[0]) / k - z.tx) / z.s, ((m[1] - B[1]) / k - z.ty) / z.s] }; pz = null; }
      else { fz = null; pz = { d0: dist(e.touches) || 1, z0: zoomNow() }; } }
    else if (e.touches.length !== 2) { pz = null; fz = null; } }, { passive: true });
  addEventListener('touchmove', e => { if (e.touches.length !== 2) return;
    if (fz) { if (e.cancelable) e.preventDefault(); const m = mid(e.touches), s = Math.max(1, Math.min(4, fz.s0 * dist(e.touches) / fz.d0));
      figSet(fz.f, s <= 1.02 ? { s: 1, tx: 0, ty: 0 } : { s, tx: (m[0] - fz.B[0]) / fz.k - s * fz.p[0], ty: (m[1] - fz.B[1]) / fz.k - s * fz.p[1] }); return; }
    if (pz) { if (e.cancelable) e.preventDefault(); setZoom(pz.z0 * dist(e.touches) / pz.d0); } }, { passive: false });
  addEventListener('touchend', e => { if (e.touches.length < 2) { pz = null; if (fz && fz.f.__fz && fz.f.__fz.s < 1.05) figSet(fz.f, { s: 1, tx: 0, ty: 0 }); fz = null; } }, { passive: true });
  addEventListener('wheel', e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); setZoom(zoomNow() * Math.exp(-e.deltaY * .0025)); }, { passive: false });
  let gz = 1; // Safari: block page zoom; desktop trackpad pinch → app zoom
  addEventListener('gesturestart', e => { e.preventDefault(); gz = zoomNow(); });
  addEventListener('gesturechange', e => { e.preventDefault(); if (!touch) setZoom(gz * e.scale); });
  /* v129 (ผู้ใช้ขอ): กด Spacebar = ไปขั้นถัดไป ทุกเกม — ลำดับ: ① ปุ่ม “ข้อต่อไป / ดูผล” หลังตอบ ② ปุ่มขั้นในหน้า (ขั้นต่อไป · ขั้นที่ n) ③ ปุ่ม “ถัดไป” ของหน้าเรียน (ถ้าไม่ล็อก) */
  addEventListener('keydown', e => { if (e.key !== ' ' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return; if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable]')) return;
    const vis = b => b.isConnected && !b.disabled && b.offsetParent !== null && getComputedStyle(b).visibility !== 'hidden' && !b.closest('[hidden],.ia-off');
    const btns = [...document.querySelectorAll('button')].filter(vis), txt = b => b.textContent.replace(/\s+/g, ' ').trim();
    const go = btns.find(b => /^(ข้อต่อไป|ดูผล)/.test(txt(b)))
      || btns.find(b => b.classList.contains('info') && !b.classList.contains('h6-wait') && !b.dataset.done && /ขั้น|ต่อไป|ดูต่อ/.test(txt(b)) && !/ใหม่/.test(txt(b)))
      || (() => { const g = window.__gate, b = g && !g.isDone() && g.next && g.next(); return b && vis(b) && document.querySelector('.screen.teach') && !/ตรวจ|ส่ง|ตอบ/.test(txt(b)) && !b.closest('.keypad, .opts, .ans') ? b : null; })() /* ไม่กด “ตรวจคำตอบ” แทนเด็ก (เคยทำให้ข้อฝึกถูกนับว่าผิดจนเฉลย) */ /* v134: ปุ่มลำดับขั้นของตัวอย่างทุกแบบ (เช่น “ดูแถวต่อไป” “เพิ่มทีละ 100,000”) */
      || btns.find(b => b.closest('.bottombar') && /ถัดไป|เล่นเกม|เริ่มเกม|ไปเล่น/.test(txt(b)) && !b.classList.contains('waiting'));
    e.preventDefault(); if (go) go.click(); }, true);
  addEventListener('keydown', e => { if (!(e.ctrlKey || e.metaKey) || e.altKey) return; const k = e.key;
    if (k === '=' || k === '+') { e.preventDefault(); setZoom(zoomNow() + .1); } else if (k === '-' || k === '_') { e.preventDefault(); setZoom(zoomNow() - .1); } else if (k === '0') { e.preventDefault(); setZoom(1); } });
  applyZoom();
})();

/* ---------------- lesson chrome ---------------- */
function lessonTop(L, phase) {
  const snd = h('button', { class: 'ibtn sndbtn' + (SET.mute ? ' muted' : ''), 'aria-label': SET.mute ? 'เปิดเสียง' : 'ปิดเสียงทั้งหมด', 'aria-pressed': SET.mute ? 'true' : 'false' }, icon(SET.mute ? 'mute' : 'sound'));
  snd.onclick = () => { setMute(!SET.mute); document.querySelectorAll('.sndbtn').forEach(b => { b.classList.toggle('muted', SET.mute); b.setAttribute('aria-pressed', SET.mute); b.setAttribute('aria-label', SET.mute ? 'เปิดเสียง' : 'ปิดเสียงทั้งหมด'); b.innerHTML = ''; b.append(icon(SET.mute ? 'mute' : 'sound')); }); if (!SET.mute) sfx.tap(); };
  return [
    h('button', { class: 'ibtn', 'aria-label': 'กลับแผนที่', onclick: () => { sfx.tap(); showMap(L.city); } }, icon('map')),
    h('div', { class: 'title' }, h('span', { class: 'overline' }, cityOf(L).name + ' · ' + kindLabel(L) + ' · ' + phase), h('h1', null, L.title)),
    h('button', { id: 'btnScratch', class: 'ibtn wide', onclick: () => { sfx.tap(); Scratch.toggle(); } }, icon('pencil'), h('span', { class: 'lbl' }, 'ทด')),
    zoomBtn(), snd
  ];
}

/* ---------------- TEACH ---------------- */
/* teaching gate: an interactive example must be worked through before moving on.
   Sequence buttons (info / accent / primary, not steppers) are finished when they disappear, get a “…ใหม่” label,
   or a sim calls teachDone(el). Free-exploration examples need a couple of taps. */
const teachDone = el => el && el.dispatchEvent(new CustomEvent('teachdone', { bubbles: true }));
const SEQ_BTN = b => b.matches('button.btn') && /\b(info|accent|primary)\b/.test(b.className) && !b.classList.contains('icon') && !b.classList.contains('sm') && !b.closest('.fstep,.keypad,.palette,.fnav,.restart');
/* v211 (ผู้ใช้ขอ: หน้าที่ให้แตะ ต้องแตะครบทุกอัน — ทุกชั้น): แถวแผนภูมิรูปภาพ การ์ดสูตรคูณ/การ์ดเดือน ของบนเครื่องชั่ง แถวตาราง รูปทรงในฉาก เลขโดด ฯลฯ — EXP_SEL2 นับแม้ไม่ได้ใช้ onclick */
const EXP_SEL2 = '.mi-card.fc, .pc-row.tapr, .mtcard, .tkmc, .tray-it, .tapscene .sc-it, .scene.room .sc-it, .k7-cards:not(.s9-netpick) .k7-card, .p4c .p4d, .g2fl, .s9o-card, .w2cvc, .pzhs, .p4seg button';
const EXP_SEL = '.lu-kid, .sh-cell, .hb-col, .palb, .objcard, .solidbtn, .flipcard, .g2cell, tr, ' + EXP_SEL2; /* v206 (ผู้ใช้เจอ: แตะ 2 อันก็ไปต่อได้) — การ์ดสิ่งของ รูปทรง การ์ดพลิก การ์ดของ */ /* v205: things to explore one by one (not take-away rows, where only some are tapped) */
const ONCE_RE = /เพิ่มอีก|ขีดเพิ่ม|ใส่ลูกแก้ว|เพิ่มไม้|หมุน|ไล่ลง|หาสูงที่สุด|ดูวิธีวาด|ลองวาด/;
function teachGate(vis, onDone) {
  let done = false, taps = 0; const seq = new Set([...vis.querySelectorAll('button')].filter(SEQ_BTN));
  const fin = b => !b.isConnected || /ใหม่/.test(b.textContent) || b.dataset.done || (b.dataset.clicked && (b.disabled || ONCE_RE.test(b.textContent)));
  const interactive = vis.querySelector('.ia, button, canvas, .tappable, [draggable]');
  const finish = () => { if (done) return; done = true; mo.disconnect(); onDone(); };
  /* v205 (ผู้ใช้ขอ: ทุกบทเรียน กดให้ครบก่อนจึงไปต่อ) — things the child taps to explore (each child in a line, each shelf cell, each figure…) must ALL be tapped */
  const hit = new Set(), hk = (e, k) => k + '|' + (e.textContent || '').replace(/\s+/g, '').slice(0, 30), isT = (e, k) => !!e.dataset.tapped || hit.has(hk(e, k)); /* v211: ภาพที่วาดใหม่หลังแตะ (ตาราง) จำด้วยตำแหน่ง+ข้อความ */
  const vis_ = e => e.offsetParent !== null || (e instanceof SVGElement && e.getBoundingClientRect().width > 0);
  const exp = () => [...vis.querySelectorAll(EXP_SEL)].filter(e => (e.onclick || e.matches(EXP_SEL2)) && vis_(e) && !e.closest('.opts, .keypad, .prac, .qsim'));
  /* v208: รูปที่แตะนับได้ (นับปลา ฯลฯ) ต้องนับให้ครบทุกตัว — เดิมแตะ 2 ครั้งก็ผ่าน */
  const cnt = () => [...vis.querySelectorAll('.obj.cnt')].filter(e => e.offsetParent !== null && !e.closest('.opts, .keypad, .qsim, .prac'));
  const expOK = () => { const x = exp(), c = cnt(); return (!x.length || x.length > 16 || x.every(isT)) && (!c.length || c.length > 16 || c.every(e => e.dataset.c)); };
  const check = () => { if (done) return; vis.querySelectorAll('button').forEach(b => { if (SEQ_BTN(b) && !seq.has(b) && b.offsetParent !== null) seq.add(b); });
    if (seq.size) { if ([...seq].every(fin) && expOK()) finish(); }
    else if ((exp().length && exp().length <= 16) || (cnt().length && cnt().length <= 16)) { if (expOK()) finish(); }
    else if (taps >= 2) finish(); };
  const mo = new MutationObserver(() => requestAnimationFrame(check)); mo.observe(vis, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['style', 'disabled'] });
  vis.addEventListener('click', e => { if (e.target.closest('.restart')) return; const xe = e.target.closest(EXP_SEL); if (xe) { const k = exp().indexOf(xe); if (k >= 0) hit.add(hk(xe, k)); xe.dataset.tapped = 1; } /* v211: จำตำแหน่งด้วย — บางภาพวาดใหม่ทั้งตารางหลังแตะ */ const sb = e.target.closest('button'); if (sb && seq.has(sb)) sb.dataset.clicked = 1; if (e.target.closest('.ia, button, canvas, .tappable, .sc-it, .hc, .rp, .lu-kid, .sh-cell')) { taps++; requestAnimationFrame(check); } }, true);
  vis.addEventListener('pointerdown', e => { if (e.target.closest('canvas, .piece, .drag, .lb-knob')) { taps++; requestAnimationFrame(check); } }, true);
  vis.addEventListener('teachdone', finish);
  if (!interactive) requestAnimationFrame(() => requestAnimationFrame(() => { if (vis.querySelector('.stg-next')) check(); else finish(); })); else requestAnimationFrame(check); // explanation steps the child opens one by one (v98)
  return { isDone: () => done, next: () => [...seq].find(b => b.isConnected && b.offsetParent !== null && !b.disabled && !fin(b)) || exp().find((e, k) => !isT(e, k)) || (cnt().length <= 16 ? cnt().find(e => !e.dataset.c) : null), left: () => exp().filter((e, k) => !isT(e, k)).length || (cnt().length <= 16 ? cnt().filter(e => !e.dataset.c).length : 0) };
}
/* a sim with a “new numbers” button (.nxp): the clone page clicks it c times before it is shown, then the button is removed */
const quietly = fn => { const m = SET.mute; SET.mute = true; try { return fn(); } finally { SET.mute = m; } };
const ADJ_CLONES = 0; // extra example pages after a stepper/slider/“new numbers” page (v96: 2 · v101: 1 · v102: 0 — ผู้ใช้ขอหน้าเดียว)
function nxpCount(s) { // how many distinct pages (incl. the first) the button gives, up to 1 + ADJ_CLONES
  return quietly(() => { const off = h('div'); try { s.v(off); } catch (_) { return 1; } const seenT = [off.textContent], b = () => off.querySelector('.nxp'); let n = 1;
    for (let c = 1; c <= ADJ_CLONES && b(); c++) { b().click(); const t = off.textContent; if (seenT.includes(t)) break; seenT.push(t); n++; } return n; });
}
function nxpAdvance(el, c) { quietly(() => { for (let k = 0; k < c; k++) { const b = el.querySelector('.nxp'); if (!b) break; b.click(); } }); }
/* the result line of an example that the child has just finished → a highlighted result card (ผู้ใช้ขอ: ไม่ให้เป็นตัวอักษรดำธรรมดาที่มองข้าม) */
function markResult(vis) {
  if (!vis.querySelector('.ia, button, canvas, .tappable, [draggable]')) return;
  const notes = [...vis.querySelectorAll('.fnote')].filter(n => !n.closest('.qsim') && n.textContent.trim() && n.offsetParent !== null);
  const last = notes.filter(n => /=|คือ|ได้|ดังนั้น|สรุป/.test(n.textContent)).pop() || notes.pop();
  if (last && !last.classList.contains('fres')) { last.classList.add('fres'); last.animate([{ transform: 'scale(.96)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' }); }
}
/* every lesson ends with two guided tries (ผู้ใช้ขอ): items from the lesson’s own game, step-by-step thinking guide from its worked example;
   the items tried here are kept out of that lesson’s game (L.__prac) */
function teachPractice(L) {
  if (L.__pracDone || L.boss || L.bonus || !L.game || !L.teach) return; L.__pracDone = 1; L.__prac = L.__prac || new Set();
  const guide = (L.teach.find(s => s.rows && s.rows.length > 1) || {}).rows;
  /* practice = the easiest questions of the lesson, with round numbers where the story allows (ผู้ใช้ขอ) */
  const pickQ = () => { if (L.pracQ) { try { const q = L.pracQ(); if (q) return q; } catch (_) { } } /* v223: บทเรียนกำหนดข้อลองทำเองเองได้ (ผู้ใช้ขอ: ม.1 ด่าน 8 ข้อแบบปกติก่อน) */
    let K = []; try { K = bossKeys(L); } catch (_) { } const pool = [];
    for (let t = 0; t < 4; t++) { let qs = []; __EASY = true; try { qs = L.game(); } catch (_) { qs = []; } finally { __EASY = false; } qs.forEach(q => { if (q && q.mount && !bossLike(q, K) && !teachDup(L, q) && !L.__prac.has(qSig(q)) && !pool.some(p => qSig(p) === qSig(q))) pool.push(q); }); }
    pool.sort((a, b) => qDiff(a) - qDiff(b)); return pool[0] || null; };
  /* ONE practice question before the game (ผู้ใช้ขอ: เหลือข้อเดียว; เดิม 2 ข้อ) */
  [1].forEach(n => L.teach.push({ t: `<b>ลองทำเอง 1 ข้อ</b> — อ่านโจทย์ แล้วตอบ`, s: `ลองทำเองหนึ่งข้อ อ่านโจทย์แล้วตอบ`, prac: n,
    v(el) { const q = pickQ(); if (!q) { el.append(fNote('ทบทวนตัวอย่างอีกครั้ง แล้วไปเล่นเกมกันเลย')); return; } L.__prac.add(qSig(q)); if (q.__dup) L.__prac.add(q.__dup); qAtoms(q).forEach(a => L.__prac.add(a));
      promptOnce(q); this.t = q.prompt; this.s = q.say || q.prompt; // v109: the chick asks the question, like in the game
      const sim = qSim(q, 'เก่งมาก!', { bub: window.__teachBub }) /* v200: the last page says “ไปเล่นเกม” — say it once only */, tg = null /* ตัวช่วยคิด removed (ผู้ใช้ขอ) — thinkGuide kept for later */, pr = h('div', { class: 'colstack prac' }, tg, sim);
      /* picture LEFT · question top-right · thinking helper under it · answer bottom-right (qsArrange), fixed places so nothing moves after answering */
      const R = sim.querySelector(':scope > .qs-r') || (sim.classList.contains('qs-stack') ? sim : null); if (R && tg) R.insertBefore(tg, R.querySelector(':scope > .qsim-body')); pr.classList.toggle('qs-figp', !!R);
      pr.classList.add('prac-game'); el.append(pr); } }));
}
function thinkGuide(rows) { // tap to open the next thinking step of the worked example
  const plain = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\[(\d+ )?(\d+)\/(\d+)\]/g, (_, w, n, d) => `${w || ''}${n}/${d}`).replace(/\s+/g, ' ').trim();
  const line = r => { const [a, b] = Array.isArray(r) ? r : [r, '']; const la = plain(a).replace(/[:：]$/, '').replace(/^[\u2460-\u2473]\s*/, ''); return /^(ขั้นที่\s*\d+|ขั้น\s*\d+|\d+[.)]?)$/.test(la) || la.length < 6 ? `${la}${b ? ' — ' + plain(b) : ''}` : la; };
  let k = 0; const list = h('div', { class: 'tg-list' }), btn = h('button', { class: 'btn sm ia tg-btn', onclick: e => { e.stopPropagation(); if (k >= rows.length) return; sfx.pop(k);
    list.append(h('span', { class: 'tg-step' }, h('b', null, String(k + 1)), line(rows[k]))); k++; if (k >= rows.length) btn.remove(); else btn.lastChild.textContent = 'ขั้นต่อไป'; } }, icon('sparkle'), h('span', null, 'ตัวช่วยคิด: ขั้นแรก'));
  return h('div', { class: 'tguide' }, h('div', { class: 'tg-h' }, 'ตัวช่วยคิด — ทำทีละขั้นเหมือนในตัวอย่าง'), list, btn);
}
let TEACH_LID = 0; // lesson id of the teaching pages on screen (practice questions use it)
/* v208 (ผู้ใช้ขอ) ? ในหน้าเรียน = ขั้นนี้ต้องทำอะไรต่อ (คิดจากหน้าจอจริงตอนกด) และกระพริบสิ่งที่ต้องกด */
function teachHelp(vis, s, G) {
  if (vis.querySelector('.prac') && document.querySelector('.qh')) return; // a ‘try it’ question brings its own ?
  let tgt = null; const lab = b => (b.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
  const guide = () => { const g = G(), out = [], inter = vis.querySelector('.ia, button, canvas, .tappable, [draggable]'); tgt = null; if (s.help) out.push(s.help);
    if (g && g.isDone && g.isDone()) { out.push(inter ? 'ทำครบแล้ว! จะลองกดเล่นต่อก็ได้ หรือกด <b>ถัดไป</b> (มุมขวาล่าง)' : 'ฟังไก่น้อยอ่าน ดูภาพ แล้วกด <b>ถัดไป</b> (มุมขวาล่าง) หรือแตะตรงไหนก็ได้'); return out; }
    const nb = g && g.next && g.next();
    if (nb && nb.matches && nb.matches('.obj.cnt')) { tgt = nb; out.push(`<b>แตะทีละตัว</b>เพื่อนับ 1, 2, 3, … ให้ครบทุกตัว (ตัวที่กระพริบ) — เหลืออีก <b>${g.left()}</b> ตัว`); }
    else if (nb && nb.matches && nb.matches(EXP_SEL)) { tgt = nb; out.push(`แตะ<b>ทุกอัน</b>ในภาพทีละอัน — เหลืออีก <b>${g.left ? g.left() : ''}</b> อัน`); }
    else if (nb) { tgt = nb; out.push(`กดปุ่ม <b>“${lab(nb)}”</b> (ปุ่มที่กระพริบ)`); }
    const gg = qGuide(vis).filter(t => !(tgt && tgt.matches('.obj.cnt') && /เพื่อนับ/.test(t))); out.push(...gg.filter(t => !out.includes(t)));
    if (!nb && !gg.length) { const tip = vis.querySelector('.blab-tip, .cap, .tm-note'); tgt = vis.querySelector('.ia:not(.restart), .tappable'); out.push(tip && tip.textContent.trim() ? `ทำตามนี้: ${tip.textContent.trim().slice(0, 80)}` : 'ลอง<b>แตะ</b>หรือ<b>ลาก</b>สิ่งของในภาพ แล้วดูว่าเกิดอะไรขึ้น'); }
    out.push('ทำครบแล้วปุ่ม <b>ถัดไป</b> จะเปลี่ยนเป็นสีเขียว'); return out; };
  qHelp(vis, null, () => false, { teach: 1, guide, onOpen: () => { if (tgt && tgt.isConnected) { tgt.classList.remove('qh-target'); void tgt.offsetWidth; tgt.classList.add('qh-target'); setTimeout(() => tgt && tgt.classList.remove('qh-target'), 2000); } } });
}
function startTeach(li, at = 0, seen = false) {
  GAME_LID = 0;
  const L = LESSONS[li]; TEACH_LID = L.id; teachPractice(L); let i = at, dir = 1, gate = null; const doneSteps = new Set(seen ? L.teach.map((_, k) => k) : []);
  const back = h('button', { class: 'btn icon', 'aria-label': 'ย้อนกลับ' }, icon('left'));
  const next = h('button', { class: 'btn primary' }, h('span', null, 'ถัดไป'), icon('right'));
  const steps = h('div', { class: 'steps' }), cap = h('div');
  const stage = shell({ lesson: true, world: WORLD_OF(cityOf(L)), top: lessonTop(L, 'บทเรียน'), bottom: [back, h('div', { class: 'mid' }, steps, cap), next] });
  let total = L.teach.length + 1, bub = null, hint = null, vis = null;
  const setLock = locked => { next.classList.toggle('waiting', locked); if (hint) { hint.lastChild.textContent = locked ? 'ทำตัวอย่างให้ครบก่อน แล้วจึงไปต่อได้ · งงไหม? กดปุ่ม ? ด้านบน' : 'แตะตรงไหนก็ได้เพื่อไปต่อ'; hint.classList.toggle('lock', locked); } };
  function mountStep(s) {
    vis.innerHTML = ''; window.__lastWalk = null; s.v(vis); if (window.__lastWalk && !s.prac && !L.__guide) L.__guide = window.__lastWalk; if (s.nxClone) nxpAdvance(vis, s.nxClone);
    if (s.adjClone) adjAdvance(vis, s.adjClone);
    const hadAdj = !s.prac && adjCtl(vis).length > 0;
    const xpl = (hadAdj || noStepper(L)) && xplStep(vis, s); if (xpl && s.__t2) bub.set(s.adjClone ? s.t + `<div class="bsub">ตัวอย่างที่ ${s.adjClone + 1} — ค่าเปลี่ยนไป</div>` : s.t, null, 'happy');
    if (hadAdj) vis.querySelectorAll('.h6-wait').forEach(b => { b.dataset.done = 1; });
    /* every +/− stepper and slider is gone (ผู้ใช้ขอ: ทุกบท) — no extra example pages any more (ผู้ใช้ขอ: หน้าแรกหน้าเดียว); ADJ_CLONES = how many value-changed copies to add */
    if (hadAdj && !s.adjClone && !s.adjDone && !s.nxClone && !vis.querySelector('.nxp')) { s.adjDone = 1; const clones = range(1, ADJ_CLONES).map(c => ({ ...s, adjClone: c, adjDone: 1 }));
      L.teach.splice(i + 1, 0, ...clones); total = L.teach.length + 1;
      const sh = [...doneSteps].map(k => k > i ? k + clones.length : k); doneSteps.clear(); sh.forEach(k => doneSteps.add(k)); if (seen) clones.forEach((_, c) => doneSteps.add(i + 1 + c)); dots(); }
    fitBody(vis, { noJump: true, side: true, xpl });
    if (!s.nxClone && !s.nxDone && vis.querySelector('.nxp')) { // “new numbers” button → removed; ADJ_CLONES more pages with new numbers (now 0: หน้าแรกหน้าเดียว)
      s.nxDone = 1; const n = ADJ_CLONES ? nxpCount(s) : 1; const clones = range(1, n - 1).map(c => ({ ...s, nxClone: c, t: `${s.t}<div class="bsub">ตัวอย่างที่ ${c + 1} — จำนวนใหม่</div>` }));
      if (clones.length) { L.teach.splice(i + 1, 0, ...clones); total = L.teach.length + 1;
        const sh = [...doneSteps].map(k => k > i ? k + clones.length : k); doneSteps.clear(); sh.forEach(k => doneSteps.add(k)); if (seen) clones.forEach((_, c) => doneSteps.add(i + 1 + c)); dots(); } }
    vis.querySelectorAll('.nxp').forEach(b => b.remove());
    if (doneSteps.has(i)) { window.__gate = gate = { isDone: () => true, next: () => null }; setLock(false); teachHelp(vis, s, () => gate); return; }
    const k = i; window.__gate = gate = teachGate(vis, () => { doneSteps.add(k); if (k === i) { setLock(false); next.classList.add('ready'); setTimeout(() => next.classList.remove('ready'), 1200); markResult(vis); } });
    setLock(!gate.isDone()); teachHelp(vis, s, () => gate);
  }
  function dots() { steps.innerHTML = ''; for (let k = 0; k < total; k++) steps.append(h('i', { class: k < i ? 'done' : k === i ? 'on' : '' })); cap.textContent = `ขั้นที่ ${i + 1} จาก ${total}`; }
  function render() {
    Scratch.clear();
    dots();
    back.disabled = i === 0;
    stage.innerHTML = '';
    bub = bubbleRow(''); vis = h('div', { class: 'visual step-in' }); hint = h('div', { class: 'tap-hint' }, icon('tap'), h('span', null, 'แตะตรงไหนก็ได้เพื่อไปต่อ'));
    bub.classList.add('in-card'); /* v187 (ผู้ใช้ขอ): ไก่น้อยพูดอยู่ในกรอบเนื้อหา ด้านบนสุด ไม่มีกรอบคำพูดแยก ตัวอักษรใหญ่ขึ้น */
    const card = h('div', { class: 'card stage-card teach-card', style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } }, bub, vis);
    stage.append(h('div', { class: 'screen teach' + (dir < 0 ? ' back' : '') }, card, hint));
    if (i < L.teach.length) {
      const s = L.teach[i]; bub.set(s.t, null, 'happy'); window.__teachBub = bub; mountStep(s); say(s.s || s.t);
      if (vis.querySelector('.ia, button, canvas, .tappable')) bub.querySelector('.speech').insertBefore(h('button', { class: 'btn sm restart ia', 'aria-label': 'เริ่มใหม่', onclick: e => { e.stopPropagation(); sfx.page(); mountStep(s); vis.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 300 }); } }, icon('replay'), 'เริ่มใหม่'), bub.querySelector('.spk'));
      next.firstChild.textContent = 'ถัดไป';
    } else {
      gate = null; setLock(false);
      bub.set('เก่งมาก! เรียนครบแล้ว ไปเล่นเกมผ่านด่านกันเลย', 'good', 'wow'); say('เก่งมาก เรียนครบแล้ว ไปเล่นเกมผ่านด่านกันเลย');
      vis.append(h('div', { class: 'colstack' }, mascot('wow', 'big'), h('button', { class: 'btn accent lg ia', onclick: e => { e.stopPropagation(); startGame(li); } }, icon('game'), 'เริ่มเกม')));
      hint.style.visibility = 'hidden';
      next.firstChild.textContent = 'เริ่มเกม';
    }
  }
  const blocked = () => { if (!gate || gate.isDone()) return false;
    sfx.no(); const nb = gate.next(), nl = gate.left ? gate.left() : 0; bub.set('ลองทำตัวอย่างให้ครบก่อนนะ' + (nb && nb.matches && nb.matches('.obj.cnt') ? ` — แตะนับให้ครบทุกตัว (เหลืออีก ${nl})` : nb && nb.matches && nb.matches(EXP_SEL) ? ` — แตะให้ครบทุกอัน (เหลืออีก ${nl})` : nb ? ` — กดปุ่ม “${nb.textContent.trim()}”` : ' — ลองแตะหรือปรับในภาพดู'), 'bad', 'think'); say('ลองทำตัวอย่างให้ครบก่อนนะ', true); if (nb && nb.isConnected) { nb.classList.remove('qh-target'); void nb.offsetWidth; nb.classList.add('qh-target'); setTimeout(() => nb.classList.remove('qh-target'), 2000); }
    const k0 = i; setTimeout(() => { if (k0 === i && i < L.teach.length && bub.isConnected) bub.set(L.teach[i].t, null, 'think'); }, 2800);
    if (nb) { nb.classList.remove('nudge'); void nb.offsetWidth; nb.classList.add('nudge'); nb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    next.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 280 });
    return true; };
  const go = d => { const j = i + d; if (j < 0) return; if (d > 0 && blocked()) return; if (j >= total) return startGame(li); dir = d; i = j; sfx.page(); render(); };
  next.onclick = () => go(1); back.onclick = () => go(-1);
  backHandler = () => { if (i > 0) go(-1); else { sfx.page(); showMap(L.city); } };
  stage.addEventListener('click', e => {
    if (Scratch.on) return;
    if (e.target.closest('.ia,button,a,canvas,.pad,.mi,.pi,.counter,.opt,.ncard,.slot,.tappable')) return;
    go(1);
  });
  const key = e => { if (e.target.closest && e.target.closest('input,textarea')) return; if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); go(1); } /* Space: ตัวจัดการกลาง (ขั้นในหน้าก่อน แล้วค่อยหน้าถัดไป) */ if (e.key === 'ArrowLeft') go(-1); };
  addEventListener('keydown', key); cleanup.push(() => removeEventListener('keydown', key));
  render();
}

/* ---------------- GAME ---------------- */
/* question body: centred when it fits; when it is taller than the card it turns into a scroll area
   (top-aligned, so nothing is cut off) and gently shows the answer controls */
/* everything on one screen (ผู้ใช้ขอ: คำถาม คำตอบ ตัวเลือก แป้น ต้องอยู่ในหน้าเดียวโดยไม่ต้องเลื่อน):
   when the content is taller/wider than its box, zoom all children down by the same factor (binary search 1 → FIT_MIN).
   Below FIT_MIN text gets too small → keep FIT_MIN and let the box scroll. Works for lessons, games and the boss exam. */
const FIT_MIN = .45;
function fitShrink(body) {
  const over = () => body.scrollHeight > body.clientHeight + 2 || body.scrollWidth > body.clientWidth + 2;
  const top = [...body.children].filter(c => c.nodeType === 1 && !c.classList.contains('czbar-float'));
  const zset = (kids, z) => kids.forEach(c => { c.style.zoom = z === 1 ? (c.dataset.gz || '') : String(+(z * (+c.dataset.gz || 1)).toFixed(3)); });
  const reset = () => body.querySelectorAll('[data-gz]').forEach(c => { c.style.zoom = c.dataset.gz || ''; });
  if (!body.classList.contains('shrunk')) top.forEach(c => { c.dataset.gz = c.style.zoom || ''; });
  body.classList.remove('shrunk'); reset(); if (!body.clientHeight || !over()) return;
  if (body.classList.contains('grown')) { top.forEach(c => { c.dataset.gz = ''; c.style.zoom = ''; }); body.classList.remove('grown'); body.querySelectorAll('.p4-fig').forEach(f => f.style.zoom = ''); if (!over()) return; }
  /* zoom the body's children; if one of them grows with the box (shrinking it does not help), zoom one level deeper */
  const tryKids = kids => { let lo = FIT_MIN, hi = 1; zset(kids, lo); if (over()) { zset(kids, 1); return false; }
    for (let k = 0; k < 7; k++) { const m = (lo + hi) / 2; zset(kids, m); if (over()) hi = m; else lo = m; } zset(kids, lo); return true; };
  let ok = tryKids(top);
  if (!ok && top.length === 1) { const inner = [...top[0].children].filter(c => c.nodeType === 1); if (inner.length) { inner.forEach(c => { if (c.dataset.gz === undefined) c.dataset.gz = c.style.zoom || ''; }); ok = tryKids(inner); } }
  if (!ok) return; body.classList.add('shrunk'); padsResize(body); dispatchEvent(new Event('layoutzoom')); }
/* ---------- v84: chapters where the +/− steppers are removed (ผู้ใช้เลือก: เศษส่วน-ทศนิยม) → the space explains the example step by step ---------- */
const NOSTEP_CH = new Set(['4:6', '4:7', '5:1', '5:2', '6:2', '6:3']);
const noStepper = L => { const c = cityOf(L); if (!c) return false; const m = /^บทที่ (\d+)/.exec(c.chapter || ''); return !!m && NOSTEP_CH.has(c.grade + ':' + m[1]); };
const XPL_TRY = /(ลอง|ปรับ|เปลี่ยน|เลื่อน|เพิ่ม\/ลด|กด\s*[+−])/;
/* adjustable controls = the shared +/− stepper and range sliders (not inside a practice question) */
const adjCtl = el => [...el.querySelectorAll('.fstep, input[type=range]')].filter(n => !n.closest('.qsim, .prac'));
/* the clone page sets the controls to other values before they are removed: +2 (or −2 at the top); sliders → 30% (ผู้ใช้ขอ: รวม 2 หน้า) */
function adjAdvance(el, c) { quietly(() => { const K = c === 1 ? 2 : -1, F = c === 1 ? .3 : .75;
  adjCtl(el).forEach((n, j) => { if (n.matches('input[type=range]')) { const lo = +n.min || 0, hi = n.max === '' ? 100 : +n.max, st = +n.step || 1, q = [10, 5, 2, 1].map(m => m * st).find(m => (hi - lo) / m >= 4) || st; n.value = String(Math.round(Math.min(hi, Math.max(lo, lo + Math.round((hi - lo) * F / q) * q)) * 1e6) / 1e6);
      n.dispatchEvent(new Event('input', { bubbles: true })); n.dispatchEvent(new Event('change', { bubbles: true })); return; }
    const val = () => (n.querySelector('.num') || n).textContent, btn = d => n.querySelector(d > 0 ? '.btn.primary' : '.btn.danger'), sg = (j % 2 ? -1 : 1) * Math.sign(K), k = Math.abs(K), v0 = val();
    for (let t = 0; t < k; t++) { const b = btn(sg); if (b) b.click(); } if (val() === v0) for (let t = 0; t < k; t++) { const b = btn(-sg); if (b) b.click(); } }); }); }
function xplStep(vis, s) {
  const fs = adjCtl(vis); if (!fs.length && !vis.querySelector('.fstep')) return false;
  fs.forEach(f => { let p = f.parentElement; f.remove(); while (p && p !== vis && !p.children.length && !p.textContent.trim()) { const q = p.parentElement; p.remove(); p = q; } });
  vis.querySelectorAll('.fnote').forEach(n => { if (n.closest('.qsim')) return; n.classList.add('xpl'); n.innerHTML = n.innerHTML.replace(/\s→\s/g, ' · → '); });
  if (!s.__t2) { s.__t2 = 1; const clean = t => { const parts = String(t || '').split(/\s+—\s+/).filter(p => !XPL_TRY.test(p.replace(/<[^>]+>/g, ''))); return parts.join(' — '); };
    const t = clean(s.t); s.t = t.trim() ? t : 'ดูตัวอย่าง แล้วอ่าน<b>คำอธิบายทีละขั้น</b>'; const sp = clean(s.s); s.s = sp.trim() ? sp : 'ดูตัวอย่าง แล้วอ่านคำอธิบายทีละขั้น'; }
  return true;
}
/* ---------- v84: put the explanation notes BESIDE the picture on wide screens (ไม่ต้องเลื่อนลงไปอ่าน) ---------- */
function sideNotes(body, force, tall) {
  if (body.clientWidth < 820 || body.querySelector('.sidelay')) return false;
  const notes = [...body.querySelectorAll('.fnote')].filter(n => !n.closest('.qsim, .pwk, .pzs, .pzp-col, .lrn, .lrn-grid, .sidecol, .no-side') && n.textContent.trim() && n.offsetParent !== null);
  if (!notes.length) return false;
  const host = notes[0].parentElement; if (!host || host === body || !notes.every(n => n.parentElement === host)) return false;
  const others = [...host.children].filter(c => !notes.includes(c) && c.offsetParent !== null); if (!others.length) return false;
  const oh = others.reduce((a, c) => a + c.getBoundingClientRect().height, 0), ow = Math.max(...others.map(c => c.getBoundingClientRect().width));
  if (!force && !tall && !(oh > body.clientHeight * .45 && ow < body.clientWidth * .62)) return false;
  const Lc = h('div', { class: 'sidel' }), Rc = h('div', { class: 'sidecol' });
  [...host.children].filter(c => !notes.includes(c)).forEach(c => Lc.append(c)); notes.forEach(n => Rc.append(n));
  host.classList.add('sidelay'); host.append(Lc, Rc); return true;
}
/* ---------- v84: colour the child's answer (the yellow cards / answer box) green or red — the instruction itself keeps its colour (ผู้ใช้ขอ) ---------- */
function markAns(root, ok) {
  const els = [...root.querySelectorAll('.slot.filled, .ans-slot, .ix-dz, .blank.filled, .fslots .slot.filled')];
  if (root.__lastPick && root.__lastPick.isConnected && !els.includes(root.__lastPick)) els.push(root.__lastPick);
  els.forEach(e => { e.classList.remove('mk-ok', 'mk-bad'); void e.offsetWidth; e.classList.add(ok ? 'mk-ok' : 'mk-bad'); if (!ok) setTimeout(() => e.classList.remove('mk-bad'), 1400); });
}
function trackPick(root) { root.addEventListener('pointerdown', e => { const t = e.target.closest('.ncard, .ixchip, .ixt, .tchip'); if (t) root.__lastPick = t; }, true); }
function fitBody(body, opts = {}) {
  let first = !opts.noJump, raf = 0;
  const fit = () => { raf = 0; if (!body.isConnected) { ro.disconnect(); mo.disconnect(); return; }
    const st0 = body.scrollTop; // keep the child's place: a refit after a key press must not jump back to the top (ผู้ใช้ขอ)
    body.classList.remove('tall'); fitShrink(body); let tall = body.scrollHeight > body.clientHeight + 4 || body.scrollWidth > body.clientWidth + 4;
    if (opts.side && sideNotes(body, opts.xpl, tall)) { fitShrink(body); tall = body.scrollHeight > body.clientHeight + 4 || body.scrollWidth > body.clientWidth + 4; }
    body.classList.toggle('tall', tall); if (tall && st0 && !first) body.scrollTop = st0;
    if (tall && first) { first = false; const a = body.querySelector('.ans .keypad, .ans'); if (a && a.getBoundingClientRect().bottom > body.getBoundingClientRect().bottom) setTimeout(() => { const f = body.querySelector('.p2q > :first-child, .p4-q > .p4-fig:first-child'), ft = f ? f.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 6 : 1e9;
      body.scrollTo({ top: Math.min(body.scrollHeight, a.offsetTop + a.offsetHeight - body.clientHeight + 16, Math.max(0, ft)), behavior: 'smooth' }); }, 350); } };
  const req = () => { if (!raf) raf = requestAnimationFrame(fit); };
  const ro = new ResizeObserver(req); ro.observe(body); [...body.children].forEach(c => ro.observe(c));
  const mo = new MutationObserver(muts => { muts.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && n.parentNode === body && ro.observe(n))); req(); });
  mo.observe(body, { childList: true, subtree: true });
  req(); setTimeout(req, 500);
  fitFigs(body);
}
/* grow small question pictures to use the space on big screens — re-measured whenever the play area changes (zoom, rotate, resize) */
/* reading order for questions with a keypad (ผู้ใช้ขอ): TOP = the problem (story / picture / sum), BOTTOM-LEFT = what the child is
   filling in (step label, answer slots, messages), BOTTOM-RIGHT = the keypad. Done with a CSS grid + display:contents on the
   wrappers, so no element moves in the DOM (components still find their own keypad). Re-runs when a step swaps the answer area. */
function qLayout(body) {
  let raf = 0; const CL = ['ql-top', 'ql-left', 'ql-right'];
  const reset = () => { body.querySelectorAll('.ql-flat').forEach(n => n.classList.remove('ql-flat')); body.querySelectorAll('.ql-grid').forEach(n => n.classList.remove('ql-grid', 'ql-side'));
    body.querySelectorAll('.ql-top,.ql-left,.ql-right').forEach(n => { n.classList.remove(...CL); n.style.gridRow = ''; }); };
  const run = () => { const st0 = body.scrollTop; run0(); if (st0 && body.scrollTop !== st0) body.scrollTop = st0; }; // re-layout must not move the scroll (ผู้ใช้ขอ)
  const run0 = () => { raf = 0; if (!body.isConnected) { mo.disconnect(); return; }
    if (body.querySelector('.g4sd')) { if (body.querySelector('.ql-grid')) reset(); return; } // ป.4 บท 10: own side-by-side grid (table/chart left · answer right)
    if (body.closest('.pzprac')) { if (body.querySelector('.ql-grid')) reset(); return; }
    if (body.querySelector('.feq-row')) { if (body.querySelector('.ql-grid')) reset(); return; } // ป.5: own row (fraction with the ? box left · keys right) // own fixed grid (pie-chart practice)
    body.querySelectorAll('.rowstack > .ans + .cap').forEach(cap => { const an = cap.previousElementSibling, sl = an.querySelector(':scope > .ans-slot'); if (!sl) return; // keep the unit beside its answer slot
      const row = h('div', { class: 'ans-urow' }); sl.replaceWith(row); row.append(sl, cap); });
    const kp = [...body.querySelectorAll('.keypad, canvas.pad')].find(k => k.offsetParent !== null), root = body.firstElementChild;
    if (!kp || !root || !root.contains(kp)) { if (body.querySelector('.ql-grid')) reset(); return; }
    const ans = kp.closest('.ans, .mc-ans') || kp.parentElement, P = kp.parentElement;
    const H = P && P !== ans && !P.querySelector('.ans-slot, .mc-row, .mc-slot, .p4steplab') ? P : kp; // answerBox: the div that swaps keypad ↔ writing pad
    const chain = []; for (let n = H.parentElement; n && n !== root; n = n.parentElement) chain.unshift(n);
    const A0 = chain[0] || H, tops = [...root.children].filter(c => c !== A0 && A0.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_PRECEDING);
    if (!tops.length || !tops.some(t => t.textContent.trim() || t.querySelector('svg,img,table'))) { if (body.querySelector('.ql-grid')) reset(); return; }
    mo.disconnect(); reset(); root.classList.add('ql-grid'); chain.forEach(n => n.classList.add('ql-flat')); [...body.children].forEach(c => c.style.zoom = ''); body.classList.remove('grown'); root.querySelectorAll(':scope > .p4-fig').forEach(f => f.style.zoom = '');
    const items = [], walk = n => [...n.children].forEach(c => c.classList.contains('ql-flat') ? walk(c) : items.push(c)); walk(root);
    const left = items.filter(c => !tops.includes(c) && c !== H && getComputedStyle(c).display !== 'none');
    /* layout fits the question (ผู้ใช้ขอ): a tall / squarish picture on a wide screen → picture LEFT, answer top-right, keypad bottom-right;
       wide strips, stories and text stay on top (problem → answer → keypad) */
    const figAsp = c => { const all = [...c.querySelectorAll('svg:not(.icon):not(.ic), img, canvas, table')].filter(n => !n.parentElement.closest('svg, table')), sv = c.querySelector('.w3w, svg:not(.icon):not(.ic), img, canvas, table, .p4col, .ldiv, .d3sd'); if (!sv) return 0; if (all.length > 1 && !sv.matches('.p4col, .ldiv, .d3sd, .w3w') && !c.querySelector('.p4col, .ldiv, .d3sd, .w3w')) return -1; if (sv.matches('.p4col, .ldiv, .d3sd, .w3w')) return 1; /* v136: กระดานหารสั้นของ ป.3 วางซ้ายเหมือนหารยาว */ const vb = sv.viewBox && sv.viewBox.baseVal;
      if (vb && vb.width) return vb.height / vb.width; const r = sv.getBoundingClientRect(); return r.width ? r.height / r.width : 0; };
    const textLen = c => [...c.querySelectorAll('.storybox, p, .word')].reduce((a, n) => a + n.textContent.trim().length, 0);
    const side = body.clientWidth >= 700 && body.clientWidth > body.clientHeight * 1.12 && tops.length <= 2 && tops.every(c => figAsp(c) >= .45 || (figAsp(c) === 0 && c.textContent.trim().length < 40 && tops.some(t => figAsp(t) >= .45))) && tops.reduce((a, c) => a + textLen(c), 0) < 120 && !root.querySelector('.p2st') && (!root.querySelector('.p4steplab') || tops.some(t => t.querySelector('.p4col, .ldiv, .d3sd, .w3w')) || root.classList.contains('ql-pref-side'));
    if (side) { root.classList.add('ql-side'); const n = left.length + 1;
      tops.forEach((c, i) => { c.classList.add('ql-top'); c.style.gridRow = tops.length === 1 ? `1 / span ${n}` : i ? `2 / span ${n - 1}` : '1'; });
      left.forEach((c, i) => { c.classList.add('ql-left'); c.style.gridRow = String(1 + i); });
      H.classList.add('ql-right'); H.style.gridRow = String(n); }
    else {
    tops.forEach((c, i) => { c.classList.add('ql-top'); c.style.gridRow = String(i + 1); });
    left.forEach((c, i) => { c.classList.add('ql-left'); c.style.gridRow = String(tops.length + 1 + i); });
    H.classList.add('ql-right'); H.style.gridRow = `${tops.length + 1} / span ${Math.max(1, left.length)}`; }
    mo.observe(body, { childList: true, subtree: true }); };
  const mo = new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(run); });
  run(); mo.observe(body, { childList: true, subtree: true }); body.addEventListener('click', () => { if (!raf) raf = requestAnimationFrame(run); }, true);
}
/* − / + magnifier on column calculations (ตั้งบวก ลบ คูณ) so children can zoom just the working area and write over it with ทด */
let CALCZ = 2; const CALCZ_L = [.5, .75, 1, 1.25, 1.5, 1.75, 2]; // v108 (ผู้ใช้ขอ): 50 – 200 %
function calcZoom(body) {
  const SEL = 'table.w2col:not(.w3w), .p4col, table.mtcol, .p2mc', t0 = body.querySelector(SEL); /* v137: ตารางที่เด็กเติมเอง (.w3w) ใหญ่อยู่แล้ว ไม่ต้องมีปุ่มย่อขยาย */ if (!t0 || t0.closest('.czhost')) return; const host = t0.parentElement; host.classList.add('czhost');
  const lab = h('span', { class: 'cz-l' }), bar = h('div', { class: 'czbar ia' }, h('button', { class: 'cz-b', 'aria-label': 'ย่อ', onclick: e => { e.stopPropagation(); CALCZ = Math.max(0, CALCZ - 1); sfx.tap(); apply(); } }, '−'), lab,
    h('button', { class: 'cz-b', 'aria-label': 'ขยาย', onclick: e => { e.stopPropagation(); CALCZ = Math.min(CALCZ_L.length - 1, CALCZ + 1); sfx.tap(); apply(); } }, '+'));
  const apply = () => { const t = host.querySelector(SEL); if (t) t.style.zoom = CALCZ_L[CALCZ]; if (!bar.isConnected) host.prepend(bar); lab.replaceChildren(icon('zoom'), h('b', null, `${Math.round(CALCZ_L[CALCZ] * 100)}%`)); padsResize(body); dispatchEvent(new Event('layoutzoom')); };
  new MutationObserver(() => { const t = host.querySelector(SEL); if (t && t.style.zoom != CALCZ_L[CALCZ]) apply(); if (!bar.isConnected) host.prepend(bar); }).observe(host, { childList: true });
  host.prepend(bar); apply();
}
function fitFigs(body) {
  let raf = 0, lastW = 0, lastH = 0;
  const fit = () => { raf = 0; if (!body.isConnected) { ro.disconnect(); return; }
    const W = body.clientWidth, H = body.clientHeight; if (!W || !H || (Math.abs(W - lastW) < 2 && Math.abs(H - lastH) < Math.max(2, lastH * .18))) return; lastW = W; lastH = H; // small height changes (feedback line) must not re-zoom the question — that looked like shaking
    body.querySelectorAll('.t6-q.p4-q:not(.p2q):not(.ql-grid) > .p4-fig').forEach(f => {
      f.style.zoom = ''; const r = f.getBoundingClientRect(), z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom')) || 1;
      const w = r.width / z, ht = r.height / z; if (!w || !ht) return;
      const s = Math.min(1.6, W * .82 / w, H * .5 / ht); if (s > 1.08) f.style.zoom = s.toFixed(2); });
    /* then grow the whole question block when it uses only a small part of the play area */
    const one = body.children.length === 1, tg = [...body.children].filter(c => c.offsetParent !== null);
    if (tg.length && !body.querySelector('.tracebox, canvas.demo, .ql-grid, .qs-fig, .qs-stack, .qs-game')) { tg.forEach(c => c.style.zoom = ''); body.classList.remove('grown');
      const z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom')) || 1, kids = (one ? [...tg[0].children] : tg).filter(c => c.offsetParent !== null);
      if (kids.length) { const rs = kids.map(c => c.getBoundingClientRect()), cw = (Math.max(...rs.map(r => r.right)) - Math.min(...rs.map(r => r.left))) / z, ch = (Math.max(...rs.map(r => r.bottom)) - Math.min(...rs.map(r => r.top))) / z;
        const s = Math.min(1.45, W * .92 / cw, H * .88 / ch); if (s > 1.1) { tg.forEach(c => c.style.zoom = s.toFixed(2)); body.classList.add('grown'); } } }
    padsResize(body); dispatchEvent(new Event('layoutzoom'));
    requestAnimationFrame(() => body.dispatchEvent(new Event('scroll'))); };
  const ro = new ResizeObserver(() => { if (!raf) raf = requestAnimationFrame(fit); }); ro.observe(body);
  setTimeout(() => { lastW = 0; fit(); }, 60);
}
/* every game has about GAME_N questions (ผู้ใช้ขอ ~10 ข้อ): draw more rounds from the lesson's own generator.
   Questions are compared by CONTENT (rendered off-screen with sound and timers muted), so the same item is not asked twice
   unless the lesson's data pool is too small — then repeats are spread out, never back to back. */
const GAME_N = 8, GAME_MIN = 8; // v108 (ผู้ใช้ขอ): อย่างน้อย 8 ข้อทุกด่าน
/* v209 (ผู้ใช้ขอ): ป.1 อย่างน้อย 10 ข้อทุกเกม */
const gameMin = L => { const g = (cityOf(L) || {}).grade; return g === 1 || g >= 7 ? 10 : GAME_MIN; }; /* ป.1 (v209) และ ม.ต้น (v222) อย่างน้อย 10 ข้อ */
/* text of a mounted question with a space between every text node — option buttons used to run together ("5 ซม.ลูกบาศก์ปริซึม…"),
   so the same question with shuffled options looked new and was asked again (ผู้ใช้เจอโจทย์ซ้ำ) */
const qText = d => { const w = document.createTreeWalker(d, NodeFilter.SHOW_TEXT), a = []; let n; while ((n = w.nextNode())) { const t = n.nodeValue.trim(); if (t) a.push(t); } return a.join(' '); };
/* the question text already printed in the card → the bubble only says what to do (ผู้ใช้เจอโจทย์ 2 ครั้งในหน้าเดียว) */
function promptOnce(q) { if (!q || q.__p1) return q; q.__p1 = 1; try { qSig(q); const p = String(q.prompt || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); if (p.length <= 25) return q;
    const tx = String(q.__txt || '').slice(String(q.prompt || '').length + String(q.say || '').length + 2).replace(/\s+/g, ' ');
    if (tx.includes(p.slice(0, 25)) && tx.includes(p.slice(-12))) { q.say = q.say || p; q.prompt = 'อ่านโจทย์ แล้วตอบ'; } } catch (_) { } return q; } /* v155: ต้องเจอทั้งต้นและท้ายโจทย์ในการ์ด (เดิมดูแค่ 25 ตัวแรก — ชื่อแผนภูมิตรงกับต้นโจทย์ ทำให้โจทย์หาย) */
function qSig(q) {
  /* v108: a preset __sig still gets its text read once (the duplicate-wording test needs the numbers) */
  if (q.__sig && q.__txt != null) return q.__sig; const W = window, keep = { say: W.say, st: W.setTimeout, si: W.setInterval, raf: W.requestAnimationFrame }, fx = {};
  Object.keys(sfx).forEach(k => { if (typeof sfx[k] === 'function') { fx[k] = sfx[k]; sfx[k] = () => {}; } });
  W.say = () => {}; W.setTimeout = () => 0; W.setInterval = () => 0; W.requestAnimationFrame = () => 0;
  let t = `${q.prompt || ''} ${q.say || ''}`;
  try { const d = document.createElement('div'); q.mount(d, { check() {}, say() {} }); d.querySelectorAll('.keypad, .seg, .czbar, .pad-tools, .h6-prow, .qsig-skip').forEach(n => n.remove());
    const tx = qText(d), geo = [...d.querySelectorAll('svg')].map(v => v.innerHTML.replace(/\s(?:id|class|style|data-[\w-]+)="[^"]*"/g, '').replace(/url\(#[^)]*\)/g, '')).sort().join('|'); let hsh = 0; for (let i = 0; i < geo.length; i++) hsh = (hsh * 31 + geo.charCodeAt(i)) | 0;
    t += ' ' + tx + ' #' + d.querySelectorAll('svg,img').length + ' ~' + hsh.toString(36); q.__txt = `${q.prompt || ''} ${q.say || ''} ${tx}`; q.__geo = qGeo(d.innerHTML);
    /* v110 (ผู้ใช้ย้ำ: ในเกมหนึ่งห้ามมีโจทย์ซ้ำ) — what the child SEES as the question: the prompt + the stem without the answer choices / cards
       (the same sum with other wrong options counts as the same question) */
    const dd = d.cloneNode(true); dd.querySelectorAll('.opts, .opt, .ans, .pad-msg').forEach(n => n.remove()); // the answer choices are not the question (cards to sort ARE)
    const g2 = [...dd.querySelectorAll('svg')].map(v => v.innerHTML.replace(/\s(?:id|class|style|data-[\w-]+)="[^"]*"/g, '').replace(/url\(#[^)]*\)/g, '')).sort().join('|'); let h2 = 0; for (let i = 0; i < g2.length; i++) h2 = (h2 * 31 + g2.charCodeAt(i)) | 0;
    q.__dup = String(q.prompt || '').replace(/<[^>]+>/g, '').replace(/\s+/g, '') + '|' + qText(dd).replace(/\s+/g, '') + '|' + h2.toString(36); } catch (_) { t += ' ' + Math.random(); }
  finally { Object.assign(W, { say: keep.say, setTimeout: keep.st, setInterval: keep.si, requestAnimationFrame: keep.raf }); Object.assign(sfx, fx); }
  if (q.__txt == null) q.__txt = ''; return (q.__sig = q.__sig || t.replace(/\s+/g, ' ').trim().split(' ').sort().join(' '));
}
/* practice must not be the boss test (ผู้ใช้ขอ): a game question that contains every number of a boss item of the same city
   (or, for items without numbers, the same wording) is kept out of the game */
const qNums = t => (String(t).replace(/<[^>]+>/g, ' ').match(/\d[\d,]*(?:\.\d+)?/g) || []).map(x => x.replace(/,/g, '')).filter(x => x !== '0');
const qNorm = t => String(t).replace(/<[^>]+>/g, ' ').replace(/[\s.,?…:!()]/g, '');
const BOSSKEY = new Map();
/* game questions must never be the boss's questions (ผู้ใช้ย้ำ) — three tests per boss item:
   ① same numbers in the same order (≥ 3 numbers or one ≥ 10) · ② same wording (items without numbers)
   ③ NEW: question text ≥ 72 % alike (character trigrams) AND every number of the boss item (text + its picture) also appears in the game question */
const qGeo = html => new Set((String(html).match(/\b(?:d|points|cx|cy|x1|y1|x2|y2|x|y|r|transform)="[^"]*"/g) || []).join(' ').match(/-?\d+(?:\.\d+)?/g) || []); // picture coordinates
const qTri = t => { t = String(t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ''); const S = new Set(); for (let i = 0; i + 3 <= t.length; i++) S.add(t.slice(i, i + 3)); return S; };
const qJac = (A, B) => { if (!A.size || !B.size) return 0; let c = 0; A.forEach(x => B.has(x) && c++); return c / (A.size + B.size - c); };
function bossKeys(L) { const C = cityOf(L); if (!C) return []; if (BOSSKEY.has(C.id)) return BOSSKEY.get(C.id);
  const K = []; C.lessons.filter(x => x.boss && Array.isArray(x.examAll || x.exam)).forEach(B => (B.examAll || B.exam).forEach(it => { const t = it.q || ''; const n = qNums(t);
    if (n.length >= 2 && (n.length >= 3 || n.some(x => +x >= 10))) K.push({ n }); else if (n.length < 2 && Object.keys(it).every(k => ['q', 'opts', 'a', 'lv', 'legend', 'off', 'from'].includes(k))) K.push({ w: qNorm(t) });
    const figTxt = it.fig ? String(it.fig).replace(/<[^>]+>/g, ' ') : ''; K.push({ tg: qTri(t), all: qNums(t + ' ' + figTxt), geo: it.fig ? qGeo(it.fig) : null }); }));
  BOSSKEY.set(C.id, K); return K; }
function bossLike(q, K) { if (!K.length) return false; qSig(q); const txt = q.__txt || '', N = qNums(txt), w = qNorm(txt), tg = qTri(String(q.prompt || '') + ' ' + String(q.say || '')), NS = new Set(N);
  return K.some(k => { if (k.tg) return qJac(k.tg, tg) >= .72 && (k.all.length ? k.all.every(x => NS.has(x)) : !k.geo || k.geo.size < 6 || qJac(k.geo, q.__geo || new Set()) >= .5); // no numbers → same picture?
    if (k.w) return k.w.length >= 14 && w.includes(k.w); // same numbers, same order, side by side
    for (let i = 0; i + k.n.length <= N.length; i++) if (k.n.every((x, j) => N[i + j] === x)) return true; return false; }); }

/* ---------- number variants for word problems (ผู้ใช้เจอโจทย์ซ้ำ) ----------
   When a lesson has only a few fixed word problems, gameSet asks the lesson for more rounds with __VARY on:
   dStory / fStory / story20 then return the same story with new numbers (same digit count and roundness);
   the expression is re-evaluated, so the answer and the wrong choices always follow the new numbers. */
let __VARY = false, __EASY = false;
const VARY_OK = new Set([1, 2, 10, 100, 1000, 60]);
const vNumRe = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;
const vVal = t => +String(t).replace(/,/g, '');
const vFmt = (v, like) => { const dp = (String(like).split('.')[1] || '').length; let s = dp ? v.toFixed(dp) : String(Math.round(v)); if (/,/.test(like)) { const [a, b] = s.split('.'); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? '.' + b : ''); } return s; };
const vEval = e => { const s = String(e).replace(/,/g, '').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/'); if (!/^[\d.\s+\-*/()]+$/.test(s)) return NaN; try { return Function('return (' + s + ')')(); } catch (_) { return NaN; } };
const vNew = (v, like) => { const dp = (String(like).split('.')[1] || '').length, q = 10 ** dp, n = Math.round(v * q); let z = 0; while (z < String(n).length - 1 && n % 10 ** (z + 1) === 0) z++;
  const step = 10 ** z, lo = Math.max(step, Math.round(n * .6 / step) * step), hi = Math.max(lo + step, Math.round(n * 1.45 / step) * step), dig = String(n).length;
  for (let g = 0; g < 20; g++) { const m = lo + Math.floor(Math.random() * ((hi - lo) / step + 1)) * step; if (m !== n && String(m).length === dig && (z === 0 || m % (step * 10) !== 0 || n % (step * 10) === 0) && !(dp && n % 10 !== 0 && m % 10 === 0)) return m / q; } return v; };
const V_FIXED = [[12, /โหล/], [7, /สัปดาห์/], [24, /ชั่วโมง|วัน/], [60, /นาที|วินาที|ชั่วโมง/], [52, /สัปดาห์/], [365, /วัน|ปี/], [366, /วัน|ปี/], [100, /เซนติเมตร|ซม\.|เมตร|สตางค์|ร้อยละ|%/], [1000, /กรัม|กิโลกรัม|มิลลิลิตร|ลิตร|เมตร|กิโลเมตร/], [10, /มิลลิเมตร|มม\./]];
const V_GEOM = /สามเหลี่ยม|วงกลม|ครึ่งวงกลม|รัศมี|เส้นผ่านศูนย์กลาง|มุม|ขนาน|ทแยง|:|\d,\s+\d|น้ำ[^\s]{0,8}สูง|ระดับน้ำ|ต่ำกว่าขอบ|หนา|ขั้น|ครึ่ง|อายุ|เท่าของ/; // stories whose numbers are tied by facts the expression does not show
/* rounder numbers for the 'try it yourself' examples: 7,840 → 8,000 · 357 → 400 (then 360) · 4.6 → 5 (ผู้ใช้ขอ: ตัวเลขไม่ต้องคิดเยอะ) */
const vEasy = (v, sig) => { if (v <= 10) return v; const e = Math.floor(Math.log10(v)), p = 10 ** Math.max(0, e - sig + 1); let m = Math.round(v / p) * p; if (String(Math.floor(m)).length !== String(Math.floor(v)).length) m = Math.floor(v / p) * p; return m > 0 ? m : v; };
function varyStory(o, easy) { const text = String(o.text || ''); if (!o.expr || /\[|π|พ\.ศ\.|เวลา|น\.|\([^)]*\d/.test(text) || V_GEOM.test(text) || /\//.test(o.expr)) return o;
  const tt = text.replace(/<[^>]+>/g, ' '), toks = tt.match(vNumRe) || [], tv = toks.map(vVal); if (!toks.length) return o;
  const exprs = [o.expr, ...(o.wrong || [])], leaves = exprs.flatMap(e => (String(e).match(vNumRe) || []).map(vVal));
  if (leaves.some(v => !tv.includes(v) && !VARY_OK.has(v))) return o; // hidden constants → keep the original
  const r0 = vEval(o.expr); if (!isFinite(r0) || r0 <= 0) return o; const rInt = Math.abs(r0 - Math.round(r0)) < 1e-9, rDp = rInt ? 0 : (String(+r0.toFixed(4)).split('.')[1] || '').length;
  const fixed = v => V_FIXED.some(([n, re]) => n === v && re.test(text)), dig = x => String(Math.floor(Math.abs(x))).length;
  for (let g = 0; g < (easy ? 3 : 40); g++) { const mp = new Map(); tv.forEach((v, i) => { if (mp.has(v) || v <= 2 || !leaves.includes(v) || fixed(v)) return; const e = easy ? vEasy(v, g + 1) : vNew(v, toks[i]); if (e !== v) mp.set(v, e); });
    if (!mp.size) return o; const vals = [...mp.values()], lmax = Math.max(...leaves); if ((lmax <= 20 && vals.some(x => x > 20)) || (lmax <= 100 && vals.some(x => x > 100))) continue; if (new Set(vals).size !== vals.length || vals.some(x => tv.includes(x) && !mp.has(x))) continue;
    const sub = (str, keepFmt) => String(str).replace(vNumRe, t => { const v = vVal(t); return mp.has(v) ? vFmt(mp.get(v), keepFmt ? t : t.replace(/,/g, '')) : t; });
    const ne = sub(o.expr, true), nw = (o.wrong || []).map(w => sub(w, true)), r = vEval(ne);
    if (!isFinite(r) || r <= 0 || dig(r) !== dig(r0) || (r0 <= 20 && r > 20) || (r0 <= 100 && r > 100)) continue; if (rInt && Math.abs(r - Math.round(r)) > 1e-9) continue; if (!rInt && (String(+r.toFixed(6)).split('.')[1] || '').length > Math.max(rDp, 2)) continue;
    if (vals.includes(r)) continue; const wv = nw.map(vEval); if (wv.some(x => Math.abs(x - r) < 1e-9) || new Set(nw).size !== nw.length) continue;
    // keep relations stated in words (มากกว่า/น้อยกว่า): every subtraction in the expression must stay positive
    if (/−/.test(ne) && String(ne).split('−').length > 1 && !(r > 0)) continue;
    const nt = text.replace(/(<[^>]+>)|(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)/g, (m, tag, num) => tag ? tag : (mp.has(vVal(num)) ? vFmt(mp.get(vVal(num)), num) : num));
    const lw = (re, t) => { const m = t.match(re); return m ? [vVal(m[1]), vVal(m[2])] : null; }, ord = t => { let p = lw(/ยาว\s*([\d,.]+)[^\d]{0,24}?กว้าง\s*([\d,.]+)/, t); if (p) return p[0] >= p[1]; p = lw(/กว้าง\s*([\d,.]+)[^\d]{0,24}?ยาว\s*([\d,.]+)/, t); return p ? p[1] >= p[0] : true; };
    if (ord(tt) && !ord(nt.replace(/<[^>]+>/g, ' '))) continue; // a field stays longer than it is wide
    return { ...o, text: nt, expr: ne, wrong: nw }; }
  return o; }
function varyS20(o) { if (!o || typeof o.a !== 'number') return o; for (let g = 0; g < 30; g++) { const a = vNew(o.a, String(o.a)), b = vNew(o.b, String(o.b)); const r0 = o.op === '+' ? o.a + o.b : o.a - o.b, r = o.op === '+' ? a + b : a - b; if (a === b || r <= 0 || (r0 <= 20 && r > 20) || (r0 <= 100 && r > 100) || String(r).length !== String(r0).length) continue;
    const t = String(o.text).replace(new RegExp(`(^|[^\\d])${o.a}(?!\\d)`), `$1${a}`).replace(new RegExp(`(^|[^\\d])${o.b}(?!\\d)`), `$1${b}`); if (o.a === o.b) return o; return { ...o, text: t, a, b }; } return o; }
(() => { const D = Q.dStory, F = Q.fStory, S = Q.story20;
  const tag = (fn, vary) => o => { const v = __EASY ? vary(o, true) : __VARY && Math.random() < .8 ? vary(o) : o, q = fn.call(Q, v); if (q && o && o.text) { q.__base = String(o.text); if (v !== o) q.__var = 1; } return q; };
  if (D) Q.dStory = tag(D, varyStory); if (F) Q.fStory = tag(F, varyStory); if (S) Q.story20 = tag(S, varyS20); })();
/* rough difficulty of a question: bigger numbers, more numbers, decimals/fractions, longer text → harder (ผู้ใช้ขอ: ง่าย → ยาก) */
function qDiff(q) { if (q.__diff != null) return q.__diff; qSig(q); const t = String(q.__txt || q.prompt || '').replace(/<[^>]+>/g, ' '), nums = t.match(/\d[\d,]*(?:\.\d+)?/g) || [];
  const big = nums.reduce((m, x) => Math.max(m, +x.replace(/,/g, '')), 0), dec = nums.filter(x => /\./.test(x)).length, ops = (t.match(/[×÷]/g) || []).length;
  return (q.__diff = (q.__tier || 0) * 100 /* v202: a lesson can order its kinds (ขั้นช่วยคิด → บล็อก → ตอบเลย) */ + 4 * Math.log10(big + 1) + Math.min(nums.length, 12) * .8 + dec * 2 + ops * 1.2 + Math.min(t.length, 400) / 60); }
/* v108 (ผู้ใช้ขอ): every topic of the lesson gets about 2–3 questions, at least 8 per game —
   kind of a question = its own __sig tag (first word) or its prompt pattern; N = clamp(2.5 × kinds, 8, 15) unless the lesson sets gameN */
const qKind0 = q => { if (q.__kind) return q.__kind; if (q.__sig) return (q.__kind = String(q.__sig).split(' ')[0]); // no tag → the question's own code (same constructor = same kind)
  const c = String(q.mount || ''); let hs = 0; for (let i = 0; i < c.length; i++) hs = (hs * 31 + c.charCodeAt(i)) | 0; return (q.__kind = 'm:' + hs.toString(36)); };
function qBalance(list, N, extra = []) { if (list.length <= N && !extra.length) return list; const pick = list.slice(0, N), rest = list.slice(N).concat(extra), cnt = {}; pick.forEach(q => cnt[q.__kind] = (cnt[q.__kind] || 0) + 1);
  /* v206 (ผู้ใช้ขอ: เกมที่มีหลายแบบ ให้ทำแต่ละแบบพอ ๆ กัน) — swap until no kind has 2+ more questions than another kind that still has questions left */
  rest.forEach(q => { if (!(q.__kind in cnt)) cnt[q.__kind] = 0; });
  for (let g = 0; g < 80; g++) { const avail = Object.keys(cnt).filter(k => rest.some(q => q.__kind === k)); if (!avail.length) break;
    const low = avail.sort((x, y) => cnt[x] - cnt[y])[0], top = Object.keys(cnt).sort((x, y) => cnt[y] - cnt[x])[0]; if (cnt[top] - cnt[low] <= 1) break;
    let at = -1; for (let i = pick.length - 1; i >= 0; i--) if (pick[i].__kind === top) { at = i; break; } const ri = rest.findIndex(q => q.__kind === low); if (at < 0 || ri < 0) break;
    const out = pick[at]; pick[at] = rest[ri]; rest.splice(ri, 1); rest.push(out); cnt[top]--; cnt[low]++; }
  return pick; }
/* v205 (ผู้ใช้ขอ): a question already shown as an example on the lesson's teaching pages is not asked again in the game —
   unless something in it is different. Each teaching page is rendered once off-screen (sound and timers off) and its text kept;
   a game question is the same example when ① its question text (with numbers) appears word for word on a page, or
   ② its numbers appear in the same order on one page together with the same operation sign (the same sum / the same story numbers). */
const TNORM = t => String(t || '').replace(/<[^>]+>/g, ' ').replace(/[\s.,?!:;()“”"'·…—–\-]/g, '').replace(/□/g, '?');
const TNUMS = t => (String(t || '').replace(/<[^>]+>/g, ' ').match(/\d[\d,]*(?:\.\d+)?/g) || []).map(x => x.replace(/,/g, ''));
const TOPS = t => new Set((String(t || '').replace(/<[^>]+>/g, ' ').match(/[+−×÷]/g) || []));
function teachKeys(L) {
  if (L.__tk) return L.__tk; const out = [], W = window, keep = { say: W.say, st: W.setTimeout, si: W.setInterval, raf: W.requestAnimationFrame }, fx = {};
  Object.keys(sfx).forEach(k => { if (typeof sfx[k] === 'function') { fx[k] = sfx[k]; sfx[k] = () => {}; } }); W.say = () => {}; W.setTimeout = () => 0; W.setInterval = () => 0; W.requestAnimationFrame = () => 0;
  try { (L.teach || []).forEach(s => { if (!s || s.prac || typeof s.v !== 'function') return; let tx = `${s.t || ''} ${s.s || ''}`; if (/qPlay|qSim|prac/.test(String(s.v))) { out.push({ norm: TNORM(tx), nums: TNUMS(tx), ops: TOPS(tx) }); return; } /* a ‘try it’ question page is not rendered here (its widgets wait for layout) */
      try { const d = document.createElement('div'); s.v(d); d.querySelectorAll('.keypad, button.btn.sm, .restart').forEach(n => n.remove()); tx += ' ' + qText(d); } catch (_) { }
      out.push({ norm: TNORM(tx), nums: TNUMS(tx), ops: TOPS(tx) }); }); }
  finally { Object.assign(W, { say: keep.say, setTimeout: keep.st, setInterval: keep.si, requestAnimationFrame: keep.raf }); Object.assign(sfx, fx); }
  return (L.__tk = out); }
function teachDup(L, q) {
  if (!L.teach || !L.teach.length || q.__tdup != null) return !!q.__tdup; const K = teachKeys(L); if (!K.length) return (q.__tdup = false);
  const core = `${q.prompt || ''} ${q.story || q.text || ''}`.replace(/π\s*[=≈]\s*(22\/7|3\.14)/g, 'π') /* ค่าคงที่ไม่ใช่ตัวเลขของโจทย์ */, cn = TNORM(core), nums = TNUMS(core).filter(x => x !== '0'), ops = TOPS(core);
  const seq = (a, b) => { for (let i = 0; i + b.length <= a.length; i++) if (b.every((x, j) => a[i + j] === x)) return true; return false; };
  const hit = K.some(k => (/\d/.test(cn) && cn.length >= 12 && k.norm.includes(cn)) || (nums.length >= 2 && seq(k.nums, nums) && (!ops.size || [...ops].every(o => k.ops.has(o))) && (ops.size || nums.length >= 3 || nums.some(x => +x >= 10))));
  return (q.__tdup = hit); }
function gameSet(L, N0) {
  const K = L.bonus ? [] : bossKeys(L), out = [], seen = new Set(), spare = [], boss = [];
  const first = ixBundle(L.game()); first.forEach(qKind0);
  const GM = gameMin(L), N = N0 || Math.max(GM, L.gameN || Math.min(15, Math.max(GAME_N, Math.ceil(2.5 * new Set(first.map(q => q.__kind)).size)))), NC = Math.max(N, Math.min(30, N * 2)); /* v190: เกม 40 ข้อ */
  const base = {}; // the same story with new numbers at most twice per game
  /* the same wording with only another picture reads as the same question (ผู้ใช้เจอข้อซ้ำ) — one per game, a second only when the pool is short */
  const look = {}, lk = q => { qSig(q); const p = String(q.story || q.prompt || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); return p + '|' + (String(q.__txt || '').match(/\d+(?:[.,]\d+)*/g) || []).join(','); };
  const atomSeen = new Set(), atomHit = q => qAtoms(q).some(a => atomSeen.has(a) || (L.__prac && L.__prac.has(a))), regA = q => qAtoms(q).forEach(a => atomSeen.add(a)); // v130: ข้อย่อยถูก/ผิดไม่ซ้ำในเกม
  const dupSeen = new Set(), dupOf = q => (qSig(q), q.__dup || q.__sig), isDup = q => dupSeen.has(dupOf(q)) || !!(L.__prac && L.__prac.has(dupOf(q))) || atomHit(q) || teachDup(L, q);
  const add = q => { const k = qSig(q); if (isDup(q)) return false; dupSeen.add(dupOf(q)); regA(q); seen.add(k); out.push(q); const l = lk(q); look[l] = (look[l] || 0) + 1; if (q.__base) base[q.__base] = (base[q.__base] || 0) + 1; };
  const take = q => { qKind0(q); if (out.length >= NC) return; if (bossLike(q, K)) { boss.push(q); return; } const k = qSig(q); if (isDup(q)) return; if (seen.has(k) || (L.__prac && L.__prac.has(k)) || (q.__base && (base[q.__base] || 0) >= (q.__baseCap || 2)) || look[lk(q)]) spare.push(q); else add(q); };
  first.forEach(take); if (L.bonus) return out.length ? out : ixBundle(L.game());
  for (let t = 0; t < 14 && out.length < NC; t++) { let more; __VARY = t >= 3; try { more = ixBundle(L.game()); } catch (_) { __VARY = false; break; } __VARY = false; more.forEach(take); }
  { const exD = new Set(), exA = new Set(), ex = out.length >= N ? spare.filter(q => { if (!q || (q.__baseHard && (base[q.__base] || 0) >= q.__baseCap) || seen.has(qSig(q)) || isDup(q) || exD.has(dupOf(q)) || qAtoms(q).some(a => exA.has(a)) || (L.__prac && L.__prac.has(qSig(q))) || (look[lk(q)] || 0) >= 2) return false; exD.add(dupOf(q)); qAtoms(q).forEach(a => exA.add(a)); return true; }) : [], B = qBalance(out, N, ex).slice();
    B.filter(q => !out.includes(q)).forEach(q => { seen.add(qSig(q)); dupSeen.add(dupOf(q)); const l = lk(q); look[l] = (look[l] || 0) + 1; spare[spare.indexOf(q)] = null; }); out.length = 0; out.push(...B); atomSeen.clear(); B.forEach(regA); }
  /* a small question pool gives a shorter game instead of asking the same question again (ผู้ใช้เจอโจทย์ซ้ำ) — repeats only to reach GAME_MIN */
  for (let j = 0; j < spare.length && out.length < N; j++) { const q = spare[j]; if (!q) continue; const k = qSig(q); if (seen.has(k) || (L.__prac && L.__prac.has(k)) || (q.__base && (base[q.__base] || 0) >= (q.__baseCap || 2)) || (look[lk(q)] || 0) >= 2) continue; add(q); spare[j] = null; }
  const NF = Math.min(N, GM);
  /* v96: a question already in this game or tried on the practice page is not asked again (ผู้ใช้เจอข้อซ้ำ) — only a very small pool (< 3) may repeat */
  for (let j = 0; j < spare.length && out.length < NF; j++) { const q = spare[j]; if (!q) continue; const k = qSig(q); if (seen.has(k) || (q.__baseHard && (base[q.__base] || 0) >= q.__baseCap) || (L.__prac && L.__prac.has(k))) continue; add(q); spare[j] = null; }
  for (let j = 0; j < spare.length && out.length < 3; j++) { const q = spare[j]; if (!q || isDup(q) || (q.__baseHard && (base[q.__base] || 0) >= q.__baseCap)) continue; out.push(q); dupSeen.add(dupOf(q)); regA(q); seen.add(qSig(q)); spare[j] = null; } // v110: never the same question twice, even in a tiny pool
  // boss-like questions are never used, even when the lesson runs short (ผู้ใช้ย้ำ)
  const srt = out.map((q, i) => ({ q, i, d: qDiff(q) })).sort((a, b) => a.d - b.d || a.i - b.i).map(o => o.q); // easy → hard
  if (srt.some(q => q.__tier != null)) return srt; // the lesson set its own order (ขั้นช่วยคิด → บล็อก → ตอบเลย)
  /* v206 (ผู้ใช้ขอ): spread the kinds through the game — round by round, the easiest left of each kind */
  const byK = new Map(); srt.forEach(q => { const k = qKind0(q); if (!byK.has(k)) byK.set(k, []); byK.get(k).push(q); });
  if (byK.size < 2) return srt; const mix = []; while (mix.length < srt.length) for (const L2 of byK.values()) if (L2.length) mix.push(L2.shift());
  return mix;
}
/* wrong-answer rule (ผู้ใช้ขอ): 1st wrong = try again · 2nd = hint (never one that gives the answer away) · 3rd = show the answer */
const TRY_REVEAL = 3;
const ansTexts = root => [...root.querySelectorAll('.ans, .opts, .rvl')].flatMap(a => [].concat(a.ansText ?? [])).map(x => String(x).trim()).filter(Boolean);
function hintLeaks(hint, root) { if (!hint) return false; const t = String(hint).replace(/<[^>]+>/g, ' ').replace(/(\d),(?=\d{3})/g, '$1');
  return ansTexts(root).some(a => { a = a.replace(/,/g, ''); if (/^\d+(\.\d+)?$/.test(a)) return a.length >= 2 ? new RegExp(`(^|[^\\d.])${a.replace('.', '\\.')}(?![\\d])`).test(t) : new RegExp(`(=|คือ|ได้|เท่ากับ)\\s*${a}(?![\\d])`).test(t);
    return a.length >= 4 && t.includes(a); }); }
function tryStep(n, hint, root) {
  const clean = hint ? String(hint) : '';
  if (n >= TRY_REVEAL) return { reveal: true, html: `<b>เฉลย</b> — ดูคำตอบที่ถูกบนจอ${clean ? `<br><small>${clean}</small>` : ''}`, say: 'ดูเฉลยนะ ' + clean.replace(/<[^>]+>/g, '') };
  if (n === 1) return { html: 'ยังไม่ถูก ลองคิดอีกครั้งนะ', say: 'ยังไม่ถูก ลองคิดอีกครั้งนะ', hint: '' };
  const hn = !clean || hintLeaks(clean, root) ? 'อ่านโจทย์อีกครั้ง แล้วคิดทีละขั้นนะ' : clean;
  return { html: 'คำใบ้: ' + hn + ' <small>(ผิดอีกครั้งจะเฉลย)</small>', say: 'คำใบ้ ' + hn.replace(/<[^>]+>/g, ''), hint: hn }; }
function revealAll(root, ctx, q) { root.querySelectorAll('.ans, .opts, .rvl').forEach(a => { try { a.reveal && a.reveal(); } catch (_) {} });
  try { q && q.reveal && q.reveal(root); } catch (_) {} try { ctx && ctx.onRight && ctx.onRight(); } catch (_) {}
  root.querySelectorAll('.ans, .opts, .rvl').forEach(a => a.classList.add('ia-off')); }
let GAME_LID = 0; // lesson id of the running game (0 = teaching / practice)
function startGame(li) {
  if (LESSONS[li].boss) return startBoss(li);
  const L = LESSONS[li]; GAME_LID = L.id; const qs = gameSet(L); let i = 0, firstTry = 0; const missed = [];
  const pbar = h('div', { class: 'pbar' }, h('b', { style: { width: '0%' } })), cnt = h('div');
  const review = h('button', { class: 'btn', 'aria-label': 'ทบทวนบทเรียน' }, icon('book'), h('span', { class: 'lbl-r' }, 'ทบทวน'));
  review.onclick = () => startTeach(li, 0, true); if (L.noTeach) review.style.visibility = 'hidden';
  const stage = shell({ lesson: true, world: WORLD_OF(cityOf(L)), top: lessonTop(L, 'เกมผ่านด่าน'), bottom: [review, h('div', { class: 'mid' }, pbar, cnt), h('div', { class: 'bar-spacer', 'aria-hidden': 'true' })] });
  let awaiting = false;
  function show() {
    Scratch.clear();
    $('.sheet')?.remove(); awaiting = false;
    const q = qs[i]; pbar.firstChild.style.width = (i / qs.length * 100) + '%'; cnt.textContent = `ข้อ ${i + 1} จาก ${qs.length}`;
    stage.innerHTML = '';
    promptOnce(q);
    const bub = bubbleRow(q.prompt + '<div class="bsub ph">&nbsp;</div>', { speak: q.say || q.prompt }), body = h('div', { class: 'qbody' });
    bub.classList.add('in-card');
    const card = h('div', { class: 'card stage-card', style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } }, bub, body);
    stage.append(h('div', { class: 'screen qwrap' }, card));
    let attempts = 0, done = false, extra = '', lastWhy = '', qh = null;
    const PH = '<div class="bsub ph">&nbsp;</div>'; // reserve the feedback line so the screen does not jump when feedback appears
    const withPrompt = () => q.prompt + (extra && extra !== q.prompt ? `<div class="bsub">${extra}</div>` : PH);
    const ctx = {
      check(ok, hint) {
        if (done) return;
        if (ok) {
          done = true; qh && qh.done(); markAns(body, true); if (!attempts) firstTry++; else missed.push(q.say || q.prompt);
          sfx.ok(); const praise = pick(['ถูกต้อง! เก่งมาก', 'เยี่ยมไปเลย!', 'สุดยอด!', 'ถูกต้องแล้ว เก่งจัง']);
          const why = attempts && lastWhy ? `<div class="whyx"><b>ทำไมคำตอบก่อนหน้านี้ผิด</b> ${lastWhy}</div>` : ''; // wrong first, right later → still explain the mistake (ผู้ใช้ขอ)
          bub.set(q.prompt + `<div class="bsub">${attempts ? 'ถูกต้องแล้ว! แก้ได้เก่งมาก' : praise}${why}</div>`, 'good', 'wow'); say(attempts ? 'ถูกต้องแล้ว ' + String(lastWhy || '').replace(/<[^>]+>/g, '') : praise);
          try { ctx.onRight && ctx.onRight(); } catch (e) { console.warn('onRight', e); } // a failing after-effect must never block “ข้อต่อไป”
          card.querySelectorAll('.ans').forEach(a => a.reveal && a.classList.add('done'));
          awaiting = true;
          pbar.firstChild.style.width = ((i + 1) / qs.length * 100) + '%';
          const sh = h('div', { class: 'sheet' }, h('span', { class: 'ok' }, icon('check')), h('span', { class: 't' }, attempts ? 'ถูกต้อง!' : 'ถูกต้องตั้งแต่ครั้งแรก!'),
            h('button', { class: 'btn primary', onclick: e => { e.stopPropagation(); advance(); } }, h('span', null, i + 1 < qs.length ? 'ข้อต่อไป' : 'ดูผล'), icon(i + 1 < qs.length ? 'right' : 'trophy')));
          document.body.append(sh);
          if (attempts === 0 && i % 3 === 2) confetti(18);
        } else {
          attempts++; { const pk = ctx.__pick; ctx.__pick = null; const hs = hint ? String(hint) : ''; if (hs || pk) lastWhy = (pk && pk.length < 60 ? `เลือก “${pk}” ซึ่งไม่ถูก` + (hs ? ' — ' : '') : '') + hs; } sfx.no(); markAns(body, false); const r = tryStep(attempts, hint, body); if (qh && qh.hint && hint && !hintLeaks(String(hint), body)) qh.hint(hint); /* v208: ? บอกคำใบ้หลังตอบผิด */
          if (r.reveal) { // 3rd wrong try: show the answer, then move on
            done = true; qh && qh.done(); missed.push(q.say || q.prompt); revealAll(body, ctx, q); awaiting = true;
            bub.set(q.prompt + `<div class="bsub">${r.html}</div>`, 'bad', 'think'); say(r.say);
            pbar.firstChild.style.width = ((i + 1) / qs.length * 100) + '%';
            document.body.append(h('div', { class: 'sheet rv-sheet' }, h('span', { class: 'ok' }, icon('eye')), h('span', { class: 't' }, 'ดูเฉลยแล้ว จำไว้นะ'),
              h('button', { class: 'btn primary', onclick: e => { e.stopPropagation(); advance(); } }, h('span', null, i + 1 < qs.length ? 'ข้อต่อไป' : 'ดูผล'), icon(i + 1 < qs.length ? 'right' : 'trophy'))));
          } else { bub.set(q.prompt + `<div class="bsub">${r.html}</div>`, 'bad', 'sad'); say(r.say);
            setTimeout(() => { if (!done) bub.set(r.hint ? q.prompt + `<div class="bsub"><small>คำใบ้: ${r.hint}</small></div>` : withPrompt(), null, 'think'); }, 2600); }
        }
      },
      say(t) { extra = t; bub.set(withPrompt(), null, 'happy'); say(t); }
    };
    trackPick(body); q.mount(body, ctx); qh = qHelp(body, q, () => done); ixDropBlank(body); calcZoom(body); qLayout(body); fitBody(body);
    backHandler = () => { sfx.page(); L.teach && L.teach.length ? startTeach(li, L.teach.length - 1, true) : showMap(L.city); };
    window.__dbg = { ctx, advance, q, i };
    say(q.say || q.prompt);
  }
  function advance() { if (!awaiting) return; sfx.page(); i++; if (i < qs.length) show(); else finish(); }
  stage.addEventListener('click', e => { if (awaiting && !Scratch.on && !e.target.closest('.ia,button,canvas')) advance(); });
  function finish() {
    $('.sheet')?.remove();
    const ratio = firstTry / qs.length, stars = ratio >= .85 ? 3 : ratio >= .55 ? 2 : 1;
    const prev = SAVE.stars[L.id] || 0; SAVE.stars[L.id] = Math.max(prev, stars);
    if (stars > prev) SAVE.lastEarned = { id: L.id, stars };
    persist();
    stage.innerHTML = ''; sfx.win(); confetti(56);
    let nextIdx = li + 1 < LESSONS.length ? li + 1 : -1; while (nextIdx >= 0 && !cityShown(cityOf(LESSONS[nextIdx]))) nextIdx = nextIdx + 1 < LESSONS.length ? nextIdx + 1 : -1;
    const msg = stars === 3 ? 'ยอดเยี่ยม! ผ่านด่านแบบเต็มดาว' : stars === 2 ? 'เก่งมาก! ผ่านด่านแล้ว' : 'ผ่านด่านแล้ว!';
    say(msg + (stars < 3 ? ' ลองเล่นอีกครั้งเพื่อเก็บดาวเพิ่มนะ' : ''));
    stage.append(h('div', { class: 'screen result' },
      h('div', { class: 'halo' }, mascot('wow', 'big react-hop')),
      h('div', { class: 'bigstars' }, [0, 1, 2].map(k => { const s = starArt(k < stars); s.style.animationDelay = 300 + k * 220 + 'ms'; return s; })),
      h('h2', null, msg),
      h('div', { class: 'sub' }, `ตอบถูกตั้งแต่ครั้งแรก ${firstTry} จาก ${qs.length} ข้อ`, stars < 3 ? ' · เล่นอีกครั้งเพื่อเก็บดาวเพิ่มได้' : ''),
      h('div', { class: 'actions' },
        h('button', { class: 'btn lg', onclick: () => startGame(li) }, icon('replay'), 'เล่นอีกครั้ง'),
        h('button', { class: 'btn lg info', onclick: () => showMap(L.city) }, icon('map'), 'แผนที่'),
        nextIdx >= 0 ? h('button', { class: 'btn lg primary', onclick: () => { const NC = cityOf(LESSONS[nextIdx]); if (NC.story || NC.final) goCity(NC.id); else if (LESSONS[nextIdx].city !== L.city) { goCity(LESSONS[nextIdx].city); setTimeout(() => showIntro(nextIdx), 2300); } else { showMap(L.city); setTimeout(() => showIntro(nextIdx), 500); } } }, h('span', null, LESSONS[nextIdx].boss ? 'ไปสู้บอส' : 'ด่านต่อไป'), icon('right')) : null)));
    [0, 1, 2].forEach(k => k < stars && setTimeout(() => sfx.pop(k * 3 + 4), 320 + k * 220));
    cnt.textContent = 'จบด่าน'; pbar.firstChild.style.width = '100%';
  }
  show();
}

/* ---------------- ผลการประเมิน: พลาดเรื่องไหน · ควรกลับไปทวนด่านไหน ---------------- */
const plainT = t => String(t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
function gameReport(li, missed, n) {
  const L = LESSONS[li];
  if (!missed.length) return h('div', { class: 'evalbox good' }, h('b', null, 'ผลการประเมิน'), h('div', null, 'ตอบถูกตั้งแต่ครั้งแรกทุกข้อ เข้าใจเรื่องนี้แล้ว!'));
  return h('div', { class: 'evalbox' }, h('b', null, `ผลการประเมิน · ยังพลาด ${missed.length} จาก ${n} ข้อ`),
    h('ul', null, ...missed.slice(0, 4).map(m => h('li', null, plainT(m).slice(0, 70)))),
    h('div', { class: 'evtip' }, missed.length * 2 >= n ? 'ควรกลับไปดูบทเรียนของด่านนี้อีกครั้ง แล้วค่อยเล่นใหม่' : 'ลองดูบทเรียนช่วงที่เกี่ยวข้อง แล้วเล่นอีกครั้งเพื่อเก็บดาว'),
    h('button', { class: 'btn info', onclick: () => startTeach(li, 0, true) }, icon('book'), `ทบทวนบทเรียน: ${L.place || L.short || L.title}`));
}
const tri = t => { const s = plainT(t).replace(/[0-9๐-๙,.:;!?()\[\]+\-−×÷=<>□?“”"'·/…]/g, '').replace(/\s+/g, ''), out = new Set(); for (let i = 0; i + 3 <= s.length; i++) out.add(s.slice(i, i + 3)); return out; };
const lessonCorpus = L => { if (L._tri) return L._tri; let txt = [L.title, L.short, L.goal, L.place].join(' ');
  try { (L.game ? L.game() : []).forEach(q => { txt += ' ' + plainT(q.prompt) + ' ' + plainT(q.say); }); } catch (e) { }
  return (L._tri = tri(txt)); };
function examTopic(q, cand) {
  if (q.lv) return cand.find(L => L.id === q.lv) || null;
  const t = tri(q.q + ' ' + (q.opts || []).map(o => typeof o === 'string' ? o : o.say || '').join(' ')); let best = null, bs = 0;
  cand.forEach(L => { const c = lessonCorpus(L); let k = 0; t.forEach(g => { if (c.has(g)) k++; }); const sc = k / Math.pow(c.size + 20, .25); if (sc > bs) { bs = sc; best = L; } });
  return bs > .3 ? best : null;
}
function bossReport(L, ex, answers) {
  const city = cityOf(L), cand = (L.final ? LESSONS.filter(x => cityOf(x).grade === city.grade) : city.lessons).filter(x => !x.boss && !x.bonus);
  const miss = new Map(); let unk = 0;
  ex.forEach((q, k) => { if (answers[k] === q.a) return; const T = examTopic(q, cand); if (!T) { unk++; return; } miss.set(T, (miss.get(T) || 0) + 1); });
  if (!miss.size && !unk) return h('div', { class: 'evalbox good' }, h('b', null, 'ผลการประเมิน'), h('div', null, 'ตอบถูกทุกข้อ เข้าใจครบทุกเรื่องในบทนี้!'));
  const rows = [...miss.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return h('div', { class: 'evalbox' }, h('b', null, 'ผลการประเมิน · เรื่องที่ยังพลาด และด่านที่ควรกลับไปทวน'),
    ...rows.map(([T, c]) => { const i = LESSONS.indexOf(T);
      return h('div', { class: 'evrow' }, h('span', { class: 'evn num' }, `${c} ข้อ`), h('span', { class: 'evt' }, h('b', null, `ด่านที่ ${T.no}${T.place ? ' · ' + T.place : ''}`), h('small', null, T.title)),
        h('button', { class: 'btn sm info', onclick: () => startTeach(i, 0, true) }, icon('book'), 'ทวนบทเรียน'), h('button', { class: 'btn sm', onclick: () => startGame(i) }, icon('play'), 'เล่นเกม')); }),
    unk ? h('div', { class: 'evtip' }, `อีก ${unk} ข้อเป็นเรื่องรวมหลายด่าน — ดูเฉลยทีละข้อด้านล่าง`) : null);
}

/* grand-boss evaluation: which CHAPTER to go back to (questions carry `from` = the chapter boss they came from) */
function megaReport(L, ex, answers) {
  const by = new Map();
  ex.forEach((q, k) => { const B = LESSONS.find(x => x.id === q.from), c = B ? cityOf(B) : null; if (!c) return; const r = by.get(c) || { c, n: 0, miss: 0, topics: new Map() }; r.n++;
    if (answers[k] !== q.a) { r.miss++; const T = q.lv ? LESSONS.find(x => x.id === q.lv) : examTopic(q, c.lessons.filter(x => !x.boss && !x.bonus)); if (T) r.topics.set(T, (r.topics.get(T) || 0) + 1); } by.set(c, r); });
  const rows = [...by.values()].filter(r => r.miss).sort((a, b) => b.miss / b.n - a.miss / a.n || b.miss - a.miss);
  if (!rows.length) return h('div', { class: 'evalbox good' }, h('b', null, 'ผลการประเมิน'), h('div', null, 'ตอบถูกทุกข้อ เข้าใจครบทุกบท!'));
  return h('div', { class: 'evalbox' }, h('b', null, 'ผลการประเมิน · บทที่ควรกลับไปทบทวน (เรียงจากบทที่พลาดมากที่สุด)'),
    ...rows.slice(0, rows.length > 5 ? 2 : 3).map(r => { const ch = (r.c.chapter.match(/^บทที่ (\d+)/) || [])[1], T = [...r.topics.entries()].sort((a, b) => b[1] - a[1])[0], ti = T ? LESSONS.indexOf(T[0]) : -1;
      return h('div', { class: 'evrow' }, h('span', { class: 'evn num' }, `${r.miss}/${r.n}`), h('span', { class: 'evt' }, h('b', null, r.c.chapter), h('small', null, T ? `ทบทวนด่าน ${T[0].no} · ${T[0].title}` : r.c.name)),
        ti >= 0 ? h('button', { class: 'btn sm info', onclick: () => startTeach(ti, 0, true) }, icon('book'), 'ทวนด่านนี้') : null,
        h('button', { class: 'btn sm', onclick: () => goCity(r.c.id) }, icon('map'), ch ? `ไปบทที่ ${ch}` : 'ไปบทนี้')); }),
    /* v192: แสดงเต็มแค่ 3 บทที่พลาดมากที่สุด (v194: พลาดเกิน 5 บท → แสดงเต็ม 2 บท) (หน้าผลต้องพอดีจอ) — บทที่เหลือย่อเป็นบรรทัดเดียว กดไปบทนั้นได้ */
    rows.length > 3 ? h('div', { class: 'evmore' }, h('span', null, 'บทอื่นที่ยังพลาด:'), ...rows.slice(rows.length > 5 ? 2 : 3).map(r => { const ch = (r.c.chapter.match(/^บทที่ (\d+)/) || [])[1];
      return h('button', { class: 'chip', onclick: () => goCity(r.c.id) }, `${ch ? 'บท ' + ch : r.c.name} ผิด ${r.miss}/${r.n}`); })) : null);
}
/* the grand boss appears only after every chapter boss of the grade is beaten: announce it once */
function finalReveal(grade) {
  const F = CITIES.find(c => c.grade === grade && c.final && c.secret); if (!F || !finalReady(F)) return;
  SAVE.revealed = SAVE.revealed || {}; if (SAVE.revealed[grade]) return; SAVE.revealed[grade] = 1; persist();
  setTimeout(() => { if ($('.modal-bg')) return; const g = gradeOf(F).name, close = () => { sfx.tap(); m.remove(); };
    const m = h('div', { class: 'modal-bg reveal-bg' }, h('div', { class: 'modal reveal' },
      h('div', { class: 'reveal-fig', html: bossSVG('roar', 'night', g, 'mega') }),
      h('h2', null, `ด่านบอสใหญ่ ${g} ปรากฏตัวแล้ว!`),
      h('p', null, `เธอชนะบอสครบทุกบทของ ${g} แล้ว · ${F.lessons[0].bossName}กำลังรออยู่ที่${F.name}`),
      h('div', { class: 'actions' }, h('button', { class: 'btn lg', onclick: close }, 'ไว้ทีหลัง'), h('button', { class: 'btn lg primary', onclick: () => { m.remove(); goCity(F.id); } }, h('span', null, 'ไปสู้เลย!'), icon('right')))));
    document.body.append(m); sfx.roar(); say(`ด่านบอสใหญ่ ${g} ปรากฏตัวแล้ว!`, true); }, 1600);
}

/* ---------------- BOSS (exam) ---------------- */
const LETTERS = ['ก', 'ข', 'ค', 'ง'];
function examOpt(o) {
  if (typeof o === 'string') return h('span', { class: 'xt' + (/^[\d\s<>=≠๐-๙]+$/.test(o) ? ' num' : '') }, o);
  if (o.pic) return objRow(o.pic[0], o.pic[1], { size: 'clamp(28px,3.6vw,42px)', max: '340px' });
  if (o.frames != null) return twoFrames(o.frames, { w: 'clamp(120px,14vw,160px)' });
  if (o.tally != null) return tally(o.tally, { scale: 1.1 });
  if (o.html != null) return h('span', { class: 'xt fx', html: o.html });
  if (o.solid) return solidEl(o.solid);
  if (o.shape) return shapeEl(o.shape);
  if (o.tok) return tokEl(o.tok);
  if (o.boxes) return h('div', { class: 'xboxes' }, o.boxes.map(b => h('span', null, b ? objRow(b[0], b[1], { size: 'clamp(18px,2.2vw,24px)', max: '80px' }) : null)));
}
const optSpeech = o => o && o.say ? o.say : o && o.html != null ? speakText(o.html) : typeof o === 'string' ? o.replace(/>/g, ' มากกว่า ').replace(/</g, ' น้อยกว่า ').replace(/≠/g, ' ไม่เท่ากับ ').replace(/=/g, ' เท่ากับ ').replace(/\+/g, ' บวก ').replace(/☐/g, ' ช่องว่าง ') : 'ภาพ';
/* end-of-chapter test order (ผู้ใช้ขอ): items of the same kind (same lesson) together, in lesson order, easy → hard inside a kind */
function examOrder(L, ex) {
  const C = cityOf(L), cand = C ? C.lessons.filter(x => !x.boss && !x.bonus) : [], pos = new Map(cand.map((x, i) => [x.id, i]));
  const txt = v => typeof v === 'string' ? v : v && (v.say || v.html || '') || '';
  const plain = s => String(s || '').replace(/<[^>]+>/g, ' ');
  const score = q => { const t = plain(q.q), nums = (t.match(/\d[\d,.]*/g) || []); return t.length + nums.join('').length * 3 + (q.fig || q.gchart || q.chart ? 25 : 0) + q.opts.reduce((s, o) => s + plain(txt(o)).length, 0) / 6 + (/พิจารณา|ข้อใดถูกต้อง|ข้อใดไม่ถูกต้อง/.test(t) ? 20 : 0); };
  const key = ex.map((q, i) => { let T = q.lv ? cand.find(x => x.id === q.lv) : null; if (!T) { try { T = examTopic(q, cand); } catch (_) { T = null; } }
    return { q, i, k: T && pos.has(T.id) ? pos.get(T.id) : 999, d: score(q) }; });
  return key.sort((a, b) => a.k - b.k || a.d - b.d || a.i - b.i).map(o => o.q);
}
function startBoss(li, opt = {}) {
  GAME_LID = LESSONS[li].id;
  const L = LESSONS[li]; if (L.examGen && !(opt.fromStory && L._ex)) L._ex = L.examGen(); const ex = L.bossKind === 'mega' ? L.exam : examOrder(L, L.exam), N = ex.length; let i = 0, score = 0; const answers = [];
  const mega = L.bossKind === 'mega', T0 = Date.now(); let left = L.timeLimit || 0, tick = null, timedOut = false;
  const pbar = h('div', { class: 'pbar' }, h('b', { style: { width: '0%' } })), cnt = h('div');
  const quit = h('button', { class: 'btn', onclick: () => showMap(L.city) }, icon('map'), h('span', { class: 'lbl-r' }, 'ออก'));
  const stage = shell({ lesson: true, world: WORLD_OF(cityOf(L)), top: lessonTop(L, 'ข้อสอบ'), bottom: [quit, h('div', { class: 'mid' }, pbar, cnt), h('div', { class: 'bar-spacer', 'aria-hidden': 'true' })] });
  backHandler = () => showMap(L.city);
  const fig = h('div', { class: 'boss-fig', html: bossSVG('idle', L.bossPal, L.emblem, L.bossKind) });
  const hp = h('div', { class: 'hp' }, h('b', { style: { width: '100%' } }), h('i', { class: 'mark', style: { left: (1 - L.pass / N) * 100 + '%' }, title: 'ผ่าน' }));
  const bubble = h('div', { class: 'boss-say' });
  const clock = L.timeLimit ? h('div', { class: 'btimer num' }, icon('play'), h('b', null, '')) : null;
  const bossCard = h('div', { class: 'boss-card' + (mega ? ' mega' : '') }, clock, h('div', { class: 'boss-figw' }, bubble, fig), h('div', { class: 'bname' }, L.bossName), hp, h('div', { class: 'hpl' }, h('span', null, 'พลังบอส'), h('span', { class: 'num' }, `${N}/${N}`)));
  const mmss = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  if (clock) { const upd = () => { clock.lastChild.textContent = mmss(left); clock.classList.toggle('low', left <= 60); }; upd();
    tick = setInterval(() => { if (over) return clearInterval(tick); left--; upd(); if (left === 60) { say('เหลือเวลาอีกหนึ่งนาที', true); quip('เหลืออีก 1 นาที! ฮ่า ๆ'); } if (left <= 0) { clearInterval(tick); timedOut = true; say('หมดเวลา', true); finish(); } }, 1000); cleanup.push(() => clearInterval(tick)); }
  const setBoss = st => { fig.innerHTML = bossSVG(st, L.bossPal, L.emblem, L.bossKind); };
  let awaiting = false, busy = 0, mv = 0, over = false;
  /* idle performance: every 10 s the boss does a different move, cycling */
  const octo = L.bossKind === 'octo', snake = L.bossKind === 'snake', bear = L.bossKind === 'bear', yeti = L.bossKind === 'yeti', scorp = L.bossKind === 'scorp';
  const MOVES = scorp ? [
    { cls: 'mv-roar', st: 'roar', say: 'ฉึก ฉึก!!! ทะเลทรายนี้เป็นของข้า!', snd: 'roar', ms: 1500 },
    { cls: 'mv-hop', st: 'flex', say: 'หนีบ! หนีบ! ก้ามข้าคมนะ!', snd: 'boing', fx: 'sand', ms: 1400 },
    { cls: 'mv-strut', st: 'wink', say: 'เม็ดทรายมีเป็นล้าน ๆ เม็ด… นับไหวไหม~', ms: 2000 },
    { cls: 'mv-power', st: 'flex', say: 'พลังจำนวนหลักล้าน!', snd: 'win', ms: 1600 },
    { cls: 'mv-spin', st: 'roar', say: 'พายุทรายหมุนติ้ว!', snd: 'boing', fx: 'sand', ms: 1500 },
    { cls: 'mv-sleep', st: 'sleepy', say: 'ร้อนจัง… ขอมุดทรายงีบแป๊บ zZ', ms: 2200 }
  ] : yeti ? [
    { cls: 'mv-roar', st: 'roar', say: 'อูวววว!!! ยอดเขานี้เป็นของข้า!', snd: 'roar', ms: 1500 },
    { cls: 'mv-hop', st: 'flex', say: 'ตึง! หิมะถล่ม!', snd: 'boing', fx: 'snow', ms: 1500 },
    { cls: 'mv-strut', st: 'wink', say: 'ปั้นก้อนหิมะ 12 ก้อน 18 ก้อน… แบ่งกองเท่า ๆ กัน~', ms: 2000 },
    { cls: 'mv-power', st: 'flex', say: 'พลัง ห.ร.ม. ค.ร.น.!', snd: 'win', ms: 1600 },
    { cls: 'mv-spin', st: 'roar', say: 'พายุหิมะหมุนติ้ว!', snd: 'boing', fx: 'snow', ms: 1500 },
    { cls: 'mv-sleep', st: 'sleepy', say: 'หนาวจัง… ขอนอนในถ้ำน้ำแข็งแป๊บ zZ', ms: 2200 }
  ] : bear ? [
    { cls: 'mv-roar', st: 'roar', say: 'โฮกกก!!! ถ้ำนี้เป็นของข้า!', snd: 'roar', ms: 1500 },
    { cls: 'mv-hop', st: 'flex', say: 'ตึง! ตึง! กระทืบพื้นถ้ำ!', snd: 'boing', ms: 1300 },
    { cls: 'mv-strut', st: 'wink', say: 'น้ำผึ้งแบ่งเป็นเศษส่วน… อร่อยทุกส่วน~', ms: 1900 },
    { cls: 'mv-power', st: 'flex', say: 'พลังเศษส่วนกลับหัว!', snd: 'win', ms: 1600 },
    { cls: 'mv-spin', st: 'roar', say: 'ตะปบ!', snd: 'boing', ms: 1200 },
    { cls: 'mv-sleep', st: 'sleepy', say: 'ง่วงจัง… ขอจำศีลแป๊บ zZ', ms: 2200 }
  ] : snake ? [
    { cls: 'mv-hiss', st: 'roar', say: 'ฟ่อ~ ฟ่อ~ ระวังเขี้ยวข้า!', snd: 'roar', ms: 1500 },
    { cls: 'mv-sway', st: 'wink', say: 'มองตาข้าสิ… เคลิ้มไหม~', fx: 'spiral', ms: 2100 },
    { cls: 'mv-strike', st: 'roar', say: 'ฉก!!', snd: 'boing', ms: 1200 },
    { cls: 'mv-rattle', st: 'laugh', say: 'กรุ๊งกริ๊ง~ หางข้าสั่นได้ด้วย!', ms: 1700 },
    { cls: 'mv-coil', st: 'flex', say: 'ขดตัวรัดแน่น พลังแสน!', snd: 'win', ms: 1700 },
    { cls: 'mv-shed', st: 'wink', say: 'ลอกคราบใหม่ สวยไหม?', fx: 'leaves', ms: 2000 },
    { cls: 'mv-sleep', st: 'sleepy', say: 'ขดตัวงีบใต้ใบไม้… zZ', ms: 2200 }
  ] : octo ? [
    { cls: 'mv-ink', st: 'ink', say: 'พ่นหมึกใส่ซะเลย! ฟู่ว~', snd: 'roar', fx: 'ink', ms: 1600 },
    { cls: 'mv-tent', st: 'laugh', say: 'ดูหนวดแปดเส้นของข้าสิ!', snd: 'boing', ms: 1700 },
    { cls: 'mv-bubble', st: 'wink', say: 'บุ๋ง บุ๋ง บุ๋ง~', fx: 'bubbles', ms: 1900 },
    { cls: 'mv-surf', st: 'flex', say: 'โต้คลื่นซะหน่อย! ซู่ว~', fx: 'wave', ms: 1900 },
    { cls: 'mv-camo', st: 'wink', say: 'เปลี่ยนสีพรางตัว! หาข้าเจอไหม?', ms: 2000 },
    { cls: 'mv-roar', st: 'roar', say: 'ฮ่า ๆ ทะเลนี้เป็นของข้า!', snd: 'roar', ms: 1500 },
    { cls: 'mv-sleep', st: 'sleepy', say: 'งีบบนผืนทรายแป๊บ… zZ', ms: 2200 }
  ] : [
    { cls: 'mv-roar', st: 'roar', say: 'แฮ่!!!', snd: 'roar', ms: 1400 },
    { cls: 'mv-hop', st: 'laugh', say: 'ฮึบ! ฮึบ!', snd: 'boing', ms: 1300 },
    { cls: 'mv-strut', st: 'wink', say: 'ตอบไม่ได้หรอก~', ms: 1800 },
    { cls: 'mv-power', st: 'flex', say: 'พลังตัวเลข!', snd: 'win', ms: 1600 },
    { cls: 'mv-spin', st: 'idle', say: 'หมุนติ้ว!', snd: 'boing', ms: 1200 },
    { cls: 'mv-sleep', st: 'sleepy', say: 'หาววว… คิดนานจัง', ms: 2200 }
  ];
  const LINES = snake ? { hit: ['โอ๊ย! หางข้า!', 'ฟ่อ… เจ็บนะ!', 'เกล็ดข้าหลุดหมดแล้ว!', 'ข้าจะไม่ยอมแพ้!'], miss: ['ฮ่า ๆ หลงป่าแล้วล่ะ!', 'ผิดแล้ว! ฟ่อ~', 'ฮิ ๆ ติดเถาวัลย์ซะแล้ว~'] }
    : octo ? { hit: ['โอ๊ย! หนวดข้า!', 'หมึกหกหมดแล้ว!', 'อุ๊ย! โดนเข้าเต็มหัวเลย', 'ข้าจะไม่ยอมแพ้!'], miss: ['ฮ่า ๆ คลื่นซัดผิดแล้ว!', 'ผิดแล้ว! ข้าจะพ่นหมึกใส่!', 'ฮิ ๆ ตกลงทะเลไปเลย~'] }
    : scorp ? { hit: ['โอ๊ย! ก้ามข้า!', 'อุ๊ย! หางข้างอ!', 'ฉึก… เก่งเหมือนกันนี่', 'ข้ายังไม่ยอมแพ้!'], miss: ['ฮ่า ๆ หลงทะเลทรายแล้ว!', 'ผิดแล้ว! จมทรายดูดไปเลย!', 'ฉึก ฉึก! พลาดแล้ว~'] }
    : yeti ? { hit: ['โอ๊ย! ขนข้าปลิว!', 'อุ๊ย! เขาข้าบิ่น!', 'อูว… เก่งเหมือนกันนี่', 'ข้ายังไม่ยอมแพ้!'], miss: ['ฮ่า ๆ ลื่นหิมะแล้ว!', 'ผิดแล้ว! ไถลลงเขาไปเลย!', 'อูวว! พลาดแล้ว!'] }
    : bear ? { hit: ['โอ๊ย! อุ้งเท้าข้า!', 'อุ๊ย! ขนข้าร่วง!', 'แฮ่… เก่งเหมือนกันนี่', 'ข้ายังไม่ยอมแพ้!'], miss: ['ฮ่า ๆ ผิดแล้ว ไปจำศีลซะ!', 'เศษส่วนไม่ง่ายหรอก!', 'โฮก! พลาดแล้ว!'] }
    : mega ? { hit: ['โอ๊ย! ร่างข้าสั่นคลอน!', 'บอสลูกน้องข้าหลุดไปตัวหนึ่ง!', 'เก่งนัก… แต่ยังไม่พอ!', 'อ๊าก! พลังรวมร่างลดลง!'], miss: ['ฮ่า ๆ ๆ ข้าคือจอมราชา!', 'ผิดแล้ว! พลังข้าเพิ่มขึ้น!', 'เจ้ายังอ่อนหัดนัก!'] }
    : { hit: ['โอ๊ย!', 'เจ็บนะ!', 'อุ๊ย!'], miss: ['ฮ่า ๆ ผิดแล้ว!', 'ยังไม่ถูกหรอก~'] };
  /* the boss talks about ITS OWN chapter (ผู้ใช้ขอ): random lesson titles and facts from the chapter's "รู้จัก" cards */
  const CH = (() => { const C = cityOf(L), facts = [], titles = []; (C ? C.lessons : []).filter(x => !x.boss).forEach(x => { titles.push(x.short || x.title); (x.teach || []).forEach(t => t.lf && t.lf.length > 6 && t.lf.length < 90 && facts.push(t.lf)); });
    const ttl = () => pick(titles) || 'บทนี้', fct = () => pick(facts) || ttl();
    return { idle: () => pick([`เรื่อง “${ttl()}” ข้าเก่งที่สุดที่นี่!`, `รู้ไหม… ${fct()} — แต่เจ้าจะจำได้หรือ?`, `ข้าจะถามเรื่อง “${ttl()}” จนเจ้ามึน!`, `ฮึ ๆ ${fct()} ใช่ไหมล่ะ?`, `ใครไม่ทบทวนเรื่อง “${ttl()}” แพ้ข้าแน่!`]),
      hit: () => pick([`โอ๊ย! เจ้ารู้เรื่อง “${ttl()}” จริง ๆ`, `เจ็บนะ! เจ้าจำได้ว่า ${fct()}`, 'ไม่จริง! ตอบถูกอีกแล้ว!']), miss: () => pick([`ฮ่า ๆ ลืมแล้วหรือว่า ${fct()}`, `กลับไปทวนเรื่อง “${ttl()}” ซะ!`]) }; })();
  const quip = t => { bubble.textContent = t; bubble.classList.remove('on'); void bubble.offsetWidth; bubble.classList.add('on'); clearTimeout(quip.t); quip.t = setTimeout(() => bubble.classList.remove('on'), Math.max(1500, t.length * 55)); };
  function fx(kind) {
    if (REDUCED()) return;
    const layer = h('div', { class: 'fx' }); bossCard.append(layer); setTimeout(() => layer.remove(), 2200);
    if (kind === 'ink') for (let i = 0; i < 9; i++) { const d = h('span', { class: 'ink', style: { top: (fig.offsetTop + fig.offsetHeight * .6) + 'px' } }); layer.append(d); const a = (Math.PI * .15) + Math.random() * Math.PI * .7, r = 50 + Math.random() * 60;
      d.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: .95 }, { transform: `translate(${Math.cos(a) * r - 10}px,${Math.sin(a) * r - 10}px) scale(${1 + Math.random()})`, opacity: 0 }], { duration: 1100 + Math.random() * 400, delay: 150 + i * 30, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }); }
    if (kind === 'bubbles') for (let i = 0; i < 10; i++) { const d = h('span', { class: 'bub', style: { left: 20 + Math.random() * 60 + '%', top: (fig.offsetTop + fig.offsetHeight * (.45 + Math.random() * .3)) + 'px', bottom: 'auto', width: 8 + Math.random() * 12 + 'px' } }); layer.append(d);
      d.animate([{ transform: 'translate(0,0)', opacity: 0 }, { opacity: .9, offset: .15 }, { transform: `translate(${Math.random() * 30 - 15}px,-170px)`, opacity: 0 }], { duration: 1500 + Math.random() * 500, delay: i * 90, easing: 'ease-out', fill: 'both' }); }
    if (kind === 'sand') for (let i = 0; i < 16; i++) { const d = h('span', { class: 'sandf', style: { left: (Math.random() < .5 ? 0 : 90) + Math.random() * 10 + '%', top: (fig.offsetTop + fig.offsetHeight * (.3 + Math.random() * .6)) + 'px' } }); layer.append(d);
      d.animate([{ transform: 'translate(0,0)', opacity: 0 }, { opacity: .9, offset: .15 }, { transform: `translate(${(d.style.left.startsWith('9') ? -1 : 1) * (120 + Math.random() * 120)}px,${Math.random() * 40 - 20}px)`, opacity: 0 }], { duration: 1300 + Math.random() * 500, delay: i * 60, easing: 'ease-out', fill: 'both' }); }
    if (kind === 'snow') for (let i = 0; i < 14; i++) { const d = h('span', { class: 'snowf', style: { left: 5 + Math.random() * 90 + '%', top: (fig.offsetTop - 10) + 'px' } }); layer.append(d);
      d.animate([{ transform: 'translate(0,0)', opacity: 0 }, { opacity: 1, offset: .15 }, { transform: `translate(${Math.random() * 50 - 25}px,${fig.offsetHeight * .95}px)`, opacity: 0 }], { duration: 1500 + Math.random() * 600, delay: i * 70, easing: 'linear', fill: 'both' }); }
    if (kind === 'leaves') for (let i = 0; i < 9; i++) { const d = h('span', { class: 'leaf', style: { left: 10 + Math.random() * 80 + '%', top: (fig.offsetTop - 10) + 'px' } }); layer.append(d);
      d.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 0 }, { opacity: 1, offset: .15 }, { transform: `translate(${Math.random() * 60 - 30}px,${fig.offsetHeight * .9}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }], { duration: 1600 + Math.random() * 500, delay: i * 110, easing: 'ease-in', fill: 'both' }); }
    if (kind === 'spiral') for (let i = 0; i < 4; i++) { const d = h('span', { class: 'ring', style: { top: (fig.offsetTop + fig.offsetHeight * .38) + 'px' } }); layer.append(d);
      d.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: .9 }, { transform: 'translate(-50%,-50%) scale(1.6)', opacity: 0 }], { duration: 1300, delay: i * 280, easing: 'ease-out', fill: 'both' }); }
    if (kind === 'wave') { const w = h('div', { class: 'wavefx', style: { top: (fig.offsetTop + fig.offsetHeight * .72) + 'px', bottom: 'auto' }, html: '<svg viewBox="0 0 240 60" preserveAspectRatio="none"><path d="M0 40 Q30 10 60 34 T120 34 T180 34 T240 34 V60 H0 Z" fill="#8FD3F4"/><path d="M0 40 Q30 10 60 34 T120 34 T180 34 T240 34" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>' }); layer.append(w); }
  }
  function perform() {
    if (over || !fig.isConnected || REDUCED()) return;
    if (Date.now() < busy) { setTimeout(perform, 1500); return; }
    const m = MOVES[mv++ % MOVES.length]; busy = Date.now() + m.ms;
    setBoss(m.st); fig.classList.remove(...MOVES.map(x => x.cls)); void fig.offsetWidth; fig.classList.add(m.cls);
    bubble.textContent = Math.random() < .65 ? CH.idle() : m.say; bubble.classList.remove('on'); void bubble.offsetWidth; bubble.classList.add('on');
    m.snd && sfx[m.snd] && (m.snd === 'win' ? tone(392, 0, .18, 'triangle', .08) : sfx[m.snd]()); m.fx && fx(m.fx);
    setTimeout(() => { if (over) return; fig.classList.remove(m.cls); bubble.classList.remove('on'); setBoss('idle'); }, m.ms);
  }
  window.__bossPerform = perform;
  if (mega && !REDUCED() && !opt.fromStory) { fig.classList.add('intro'); busy = Date.now() + 4200; setTimeout(() => quip('พวกเรา… รวมร่าง!!!'), 300); setTimeout(() => { sfx.roar(); quip('ข้าคือ' + L.bossName + '!'); }, 2600); setTimeout(() => fig.classList.remove('intro'), 4200); }
  const timer = setInterval(perform, 10000); cleanup.push(() => { over = true; clearInterval(timer); });
  function show() {
    Scratch.clear(); $('.sheet')?.remove(); awaiting = false;
    const q = ex[i]; pbar.firstChild.style.width = (i / N * 100) + '%'; cnt.textContent = `ข้อ ${i + 1} จาก ${N} · ถูก ${score} ข้อ`;
    stage.innerHTML = ''; setBoss('idle');
    const opts = h('div', { class: 'xopts ia' });
    const card = h('div', { class: 'card stage-card exam-card' },
      h('div', { class: 'xq' }, h('span', { class: 'xn num' }, i + 1), h('div', { class: 'xqt', html: q.q }), h('button', { class: 'spk ia', 'aria-label': 'ฟังอีกครั้ง', onclick: e => { e.stopPropagation(); readQ('listen'); } }, icon('sound'))),
      q.legend ? h('div', { class: 'legend' }, h('span', null, h('b', null, '>'), ' มากกว่า'), h('span', null, h('b', null, '<'), ' น้อยกว่า'), h('span', null, h('b', null, '='), ' เท่ากับ'), h('span', null, h('b', null, '≠'), ' ไม่เท่ากับ')) : null,
      q.pic ? h('div', { class: 'story' }, ...q.pic.map(p => groupBox(p[0], p[1]))) : null,
      q.chart ? h('div', { class: 'xchart' }, chartNode(q.chart, { sm: true, anim: false })) : null,
      q.gchart ? h('div', { class: 'xchart' }, dataChart(q.gchart, { sm: true })) : null,
      q.fig ? h('div', { class: 'xchart g6x', html: q.fig }) : null,
      q.bal ? h('div', { class: 'xchart' }, balance({ e: q.bal[0][0], n: Math.min(q.bal[0][1], 3) }, { e: q.bal[1][0], n: q.bal[1][1] }, { sm: true, wl: q.bal[2] > 0 ? 2 : q.bal[2] < 0 ? 0 : 1, wr: 1 })) : null,
      q.scale ? h('div', { class: 'xchart' }, springScale({ v: q.scale[0], unit: q.scale[1], e: q.scale[2], n: 2, sm: true, col: 'mint' })) : null,
      q.line ? h('div', { class: 'xchart' }, lineup(q.line, { sm: true })) : null,
      q.grid ? h('div', { class: 'xchart' }, kidGrid(q.grid)) : null,
      q.race ? h('div', { class: 'xchart' }, raceTrack(q.race, { sm: true })) : null,
      q.bus ? h('div', { class: 'xchart busq' }, lineup(q.bus, { sm: true }), h('span', { class: 'bus', html: BUS_SVG })) : null,
      q.shelf ? h('div', { class: 'xchart' }, shelf(q.shelf)) : null,
      q.solid ? h('div', { class: 'xchart' }, solidEl(q.solid, 'big')) : null,
      q.obj ? h('div', { class: 'xchart' }, h('span', { class: 'solid big' }, art(q.obj))) : null,
      q.shape ? h('div', { class: 'xchart' }, shapeEl(q.shape[0], { rot: q.shape[1], cls: 'big' })) : null,
      q.seq ? h('div', { class: 'xchart' }, patStrip(q.seq[0], { blank: [q.seq[1]], sm: true })) : null,
      q.blocks != null ? h('div', { class: 'xchart' }, tensOnes(q.blocks, { sm: true })) : null,
      q.hund ? h('div', { class: 'xchart' }, hundredPiece(...q.hund)) : null,
      q.lenb ? h('div', { class: 'xchart' }, lenBoard(q.lenb[0], { max: q.lenb[1], unit: q.lenb[2], sm: true })) : null,
      q.hgtb ? h('div', { class: 'xchart' }, heightBoard(q.hgtb[0], { max: q.hgtb[1] || undefined, unit: q.hgtb[2] || 'none', guides: !!q.hgtb[2] })) : null,
      q.vert ? h('div', { class: 'xchart' }, vertLayout(q.vert[0], q.vert[1], {})) : null,
      q.vsub ? h('div', { class: 'xchart' }, vertSubLayout(q.vsub[0], q.vsub[1], {})) : null,
      opts);
    if (q.opts.length >= 3 && q.opts.every(o => (typeof o === 'string' ? o : o.html ? (o.html.includes('<svg') ? '' : o.html) : '').replace(/<[^>]+>/g, '').length <= 16)) opts.classList.add('two');
    q.opts.forEach((o, k) => {
      const b = h('button', { class: 'xopt' }, h('span', { class: 'xl' }, LETTERS[k]), h('span', { class: 'xc' }, examOpt(o)));
      b.onclick = e => { e.stopPropagation(); if (opts.dataset.done) return; opts.dataset.done = 1; answer(k, b, opts); };
      opts.append(b);
    });
    if (q.fig && /class="pp [hv]|class="tkcal/.test(q.fig)) card.classList.add('xside'); /* v181 (ผู้ใช้ขอ): แผนภูมิรูปภาพ → ภาพซ้าย ตัวเลือกขวา */
    stage.append(h('div', { class: 'screen arena' }, bossCard, card)); fitBody(card, { noJump: true });
    const readQ = force => say(`ข้อ ${i + 1} ${speakText(q.q)} ` + q.opts.map((o, k) => `${LETTERS[k]} ${optSpeech(o)}`).join(' '), force);
    readQ();
  }
  function answer(k, b, opts) {
    const q = ex[i], ok = k === q.a; answers[i] = k;
    busy = Date.now() + 1500; fig.classList.remove(...MOVES.map(x => x.cls)); bubble.classList.remove('on');
    opts.children[q.a].classList.add('right'); if (!ok) b.classList.add('wrong');
    if (ok) {
      score++; sfx.ok(); setBoss('hit'); quip(Math.random() < .6 ? CH.hit() : pick(LINES.hit)); fig.classList.remove('shake'); void fig.offsetWidth; fig.classList.add('shake');
      const left = N - score; hp.firstChild.style.width = left / N * 100 + '%'; bossCard.querySelector('.hpl .num').textContent = `${left}/${N}`;
      const dmg = h('span', { class: 'dmg num' }, '−1'); bossCard.append(dmg); setTimeout(() => dmg.remove(), 900);
      setTimeout(() => setBoss('idle'), 700);
    } else { sfx.no(); setBoss('laugh'); quip(Math.random() < .6 ? CH.miss() : pick(LINES.miss)); if (octo) fx('ink'); if (snake) { fig.classList.remove('mv-hiss'); void fig.offsetWidth; fig.classList.add('mv-hiss'); setTimeout(() => fig.classList.remove('mv-hiss'), 1200); } setTimeout(() => setBoss('idle'), 1200); }
    say(ok ? 'ถูกต้อง โจมตีบอสได้' : `คำตอบที่ถูกคือ ข้อ ${LETTERS[q.a]}`);
    awaiting = true; cnt.textContent = `ข้อ ${i + 1} จาก ${N} · ถูก ${score} ข้อ`;
    document.body.append(h('div', { class: 'sheet' + (ok ? '' : ' miss') }, h('span', { class: 'ok' }, icon(ok ? 'check' : 'close')), h('span', { class: 't' }, ok ? 'ถูกต้อง! โจมตีบอส' : `เฉลย: ข้อ ${LETTERS[q.a]}`),
      h('button', { class: 'btn primary', onclick: e => { e.stopPropagation(); advance(); } }, h('span', null, i + 1 < N ? 'ข้อต่อไป' : 'ดูผลสอบ'), icon(i + 1 < N ? 'right' : 'trophy'))));
  }
  function advance() { if (!awaiting) return; sfx.page(); i++; if (i < N) show(); else finish(); }
  stage.addEventListener('click', e => { if (awaiting && !Scratch.on && !e.target.closest('.ia,button,canvas')) advance(); });
  function finish() {
    if (over && !timedOut) return; $('.sheet')?.remove(); over = true; clearInterval(timer); clearInterval(tick); const used = Math.round((Date.now() - T0) / 1000);
    const pass = score >= L.pass, s2 = Math.min(N, Math.max(L.pass + 1, Math.ceil(N * .9 - 1e-9))), s3 = Math.min(N, Math.max(s2 + 1, N - 1)), stars = !pass ? 0 : score >= s3 ? 3 : score >= s2 ? 2 : 1; /* v186: ผ่าน 80% = 1 ดาว · ≥90% = 2 ดาว · เกือบเต็ม/เต็ม = 3 ดาว */
    const prev = SAVE.stars[L.id] || 0;
    if (pass) { SAVE.stars[L.id] = Math.max(prev, stars); if (stars > prev) SAVE.lastEarned = { id: L.id, stars }; persist(); }
    stage.innerHTML = ''; pbar.firstChild.style.width = '100%'; cnt.textContent = `ได้ ${score} จาก ${N} ข้อ`;
    const nc0 = nextShownCity(cityOf(L)), nextCity = nc0 && nc0.grade === cityOf(L).grade ? nc0 : null;
    const msg = pass ? (L.winLine || `ชนะ${L.bossName}แล้ว!`) : (L.loseLine || 'ยังไม่ผ่าน สู้ใหม่อีกครั้งนะ');
    if (pass) { sfx.win(); confetti(70); } else sfx.no();
    say(`${msg} ได้ ${score} จาก ${N} ข้อ` + (pass && nextCity ? ` เปิด${nextCity.name}แล้ว` : pass ? '' : ` ต้องได้อย่างน้อย ${L.pass} ข้อ`));
    const review = h('div', { class: 'review' }, ex.map((q, k) => h('div', { class: 'rv' + (answers[k] === q.a ? ' ok' : ' no') }, h('span', { class: 'rn num' }, k + 1), h('span', { class: 'rq', html: q.q }),
      h('span', { class: 'ra' }, answers[k] === q.a ? h('span', null, icon('check'), ` ${LETTERS[q.a]}`) : h('span', null, `ตอบ ${LETTERS[answers[k]] ?? '-'} · เฉลย ${LETTERS[q.a]}`)))));
    stage.append(h('div', { class: 'screen result boss-result' },
      h('div', { class: 'boss-end ' + (pass ? 'win' : 'lose') + (octo ? ' octo' : snake ? ' snake' : bear ? ' bear' : yeti ? ' yeti' : scorp ? ' scorp' : ''), html: bossSVG(pass ? 'down' : 'laugh', L.bossPal, L.emblem, L.bossKind) }),
      pass ? h('div', { class: 'bigstars' }, [0, 1, 2].map(k => { const s = starArt(k < stars); s.style.animationDelay = 300 + k * 220 + 'ms'; return s; })) : null,
      h('h2', null, msg),
      h('div', { class: 'sub' }, h('b', { class: 'num' }, `${score}/${N}`), ` ข้อ · เกณฑ์ผ่าน ${L.pass} ข้อ`, L.timeLimit ? ` · ใช้เวลา ${mmss(Math.min(used, L.timeLimit))}${timedOut ? ' (หมดเวลา)' : ''}` : '', pass && nextCity && !L.timeLimit ? ` · ปลดล็อก${nextCity.name}แล้ว!` : ''),
      mega ? megaReport(L, ex, answers) : bossReport(L, ex, answers),
      h('details', { class: 'review-wrap' }, h('summary', null, 'ดูคำตอบทีละข้อ'), review),
      h('div', { class: 'actions' },
        h('button', { class: 'btn lg', onclick: () => startBoss(li) }, icon('replay'), pass ? 'สอบอีกครั้ง' : 'สู้ใหม่'),
        !pass ? h('button', { class: 'btn lg info', onclick: () => showMap(L.city) }, icon('book'), 'กลับไปทบทวน') : null,
        pass && nextCity ? h('button', { class: 'btn lg primary', onclick: () => goCity(nextCity.id) }, h('span', null, `ไป${nextCity.name}`), icon('right')) : pass ? h('button', { class: 'btn lg primary', onclick: () => showMap(L.city) }, icon('map'), 'แผนที่') : null)));    if (pass && !mega) finalReveal(cityOf(L).grade);
  }
  show();
}

/* ---------------- boot ---------------- */
ensureArtDefs();
Scratch.init();
if (!SAVE.seen) { SAVE.seen = LESSONS.filter((L, i) => unlocked(i)).map(L => L.id); persist(); }
(document.fonts && document.fonts.load ? Promise.race([Promise.all([document.fonts.load("500 40px 'IBM Plex Sans Thai Looped'"), document.fonts.load("700 40px 'IBM Plex Sans Thai Looped'"), document.fonts.load('900 40px Nunito')]), sleep(2500)]).catch(() => { }) : Promise.resolve())
  .then(() => { const hsh = location.hash.match(/^#lesson-(\d+)(-game)?$/); if (hsh) { const k = LESSONS.findIndex(L => L.id === +hsh[1]); if (k >= 0) return hsh[2] || LESSONS[k].boss ? startGame(k) : startTeach(k); } showMap(); });

/* ---------- explanations appear one line at a time (ผู้ใช้ขอ: ไม่ให้ข้อความยาวต่อกัน) ----------
   any .fnote whose text has several statements (separated by <br> or “ · ”) is split into lines that pop in one after another */
(function staggerNotes() {
  const SPLIT = /<br\s*\/?>|\s·\s|\s*<i class="dsep"[^>]*><\/i>\s*/;
  const FB_OK = /^\s*(✓|ถูกต้อง|เยี่ยม|ใช่แล้ว|เก่งมาก)/, FB_BAD = /^\s*(✗|ยังไม่|ไม่ใช่|ไม่ถูก|ผิด|ลองใหม่|ลองอีก)/;
  const tone = () => {}; // v84: instruction/notes keep their colour — only the child's answer turns green/red (markAns)
  const run = el => { if (!el || el.dataset.stgBusy) return; tone(el); const html = el.innerHTML; if (el.dataset.stg === html) return;
    const parts = html.split(SPLIT).map(x => x.trim()).filter(x => x && x !== '<b></b>');
    if (!parts.length || /<(div|button|svg|table|ul|ol)/i.test(html) || el.closest('.qsim, .speech, .bubble')) { el.dataset.stg = html; return; }
    // live notes (updated while dragging / sliding): animate once, then update in place without replaying
    const now = Date.now(), live = el.dataset.stgN == parts.length && now - (+el.dataset.stgT || 0) < 60000; el.dataset.stgN = parts.length; el.dataset.stgT = now;
    /* "<b>label</b> text" lines become two-column rows (label | text) — easier to read than one dense block (ผู้ใช้ขอ) */
    const kv = p => { const m = p.match(/^<b([^>]*)>([^<]{1,22})<\/b>\s*(?:[:：]\s*)?([\s\S]+)$/); return m && /^[^=+×÷−\d]/.test(m[3].replace(/<[^>]+>/g, '').trim()) ? `<b${m[1]} class="kvl">${m[2]}</b><span class="kvv">${m[3]}</span>` : null; };
    const rows = parts.map(kv), isKv = rows.filter(Boolean).length >= 2;
    /* v98: explanation steps on teaching pages open one at a time — the child taps “ขั้นต่อไป” (ผู้ใช้ขอ: ให้เด็กกดเอง ทีละอัน) */
    const tap = parts.length >= 2 && el.closest('.visual') && !el.closest('.qsim, .prac, .speech, .bubble, .lrn-page');
    const shown = tap ? Math.min(parts.length, live ? Math.max(1, +el.dataset.stgShow || 1) : 1) : parts.length; if (tap) el.dataset.stgShow = shown;
    el.dataset.stgBusy = 1; el.innerHTML = parts.map((p, i) => { const body = isKv && rows[i] ? rows[i] : p, cls = 'stg-line' + (isKv && rows[i] ? ' kv' : '') + (live ? ' now' : ''); return live ? `<span class="${cls}">${body}</span>` : `<span class="${cls}" style="animation-delay:${i * .6}s">${body}</span>`; }).join(''); el.classList.add('stg'); el.classList.toggle('stg-kv', isKv);
    if (tap) { [...el.querySelectorAll(':scope > .stg-line')].forEach((ln, k) => { ln.style.animationDelay = '0s'; if (k >= shown) ln.classList.add('stg-hid'); });
      if (shown < parts.length) el.append(h('button', { class: 'btn info stg-next ia', type: 'button' }, icon('right'), h('span', null, `ขั้นต่อไป (${shown}/${parts.length})`))); }
    el.dataset.stg = el.innerHTML; delete el.dataset.stgBusy; };
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('.stg-next'); if (!b) return; e.stopPropagation(); e.preventDefault();
    const el = b.closest('.fnote'), all = [...el.querySelectorAll(':scope > .stg-line')], hid = all.find(n => n.classList.contains('stg-hid')); if (!hid) { b.remove(); return; }
    hid.classList.remove('stg-hid'); hid.style.animation = 'none'; void hid.offsetWidth; hid.style.animation = ''; hid.style.animationDelay = '0s';
    const n = all.length - all.filter(x => x.classList.contains('stg-hid')).length; el.dataset.stgShow = n; sfx.pop(n); say(hid.textContent, true);
    if (n >= all.length) b.remove(); else b.lastChild.textContent = `ขั้นต่อไป (${n}/${all.length})`;
    el.dataset.stg = el.innerHTML; }, true);
  new MutationObserver(ms => { const seen = new Set(); ms.forEach(m => { const t = m.target.nodeType === 1 ? m.target : m.target.parentElement; const el = t && t.closest && t.closest('.fnote'); if (el && !seen.has(el)) { seen.add(el); run(el); } }); })
    .observe(document.body, { childList: true, subtree: true, characterData: true });
})();

/* ---------- “·” between joined items → a short line floating in the middle (ผู้ใช้ขอ: เห็นชัดกว่าจุด) ---------- */
(function sepDots() {
  const SKIP = 'script,style,textarea,input,.dsep';
  const fix = root => { if (!root || root.nodeType !== 1 && root.nodeType !== 3) return; const base = root.nodeType === 3 ? root.parentNode : root; if (!base || !base.isConnected) return; const tw = document.createTreeWalker(base, NodeFilter.SHOW_TEXT); const todo = [];
    for (let n = tw.nextNode(); n; n = tw.nextNode()) if (n.nodeValue.includes('·') && !(n.parentElement && n.parentElement.closest(SKIP))) todo.push(n);
    todo.forEach(n => { const P = n.parentElement; if (!P) return;
      if (P.closest('svg')) { n.nodeValue = n.nodeValue.replace(/\s*·\s*/g, ' – '); return; }
      const parts = n.nodeValue.split(/\s*·\s*/), frag = document.createDocumentFragment();
      parts.forEach((t, k) => { if (k) frag.append(h('i', { class: 'dsep', 'aria-hidden': 'true' })); if (t) frag.append(document.createTextNode(t)); }); n.replaceWith(frag); }); };
  new MutationObserver(ms => ms.forEach(m => { m.addedNodes.forEach(fix); if (m.type === 'characterData') fix(m.target); })).observe(document.body, { childList: true, subtree: true, characterData: true });
  fix(document.body);
})();
