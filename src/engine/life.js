/* =========================================================
   LIFE LAYER — things that move in every world's background and on every map
   city: cars on the road, birds, a balloon rising, twinkling windows
   beach: rolling waves, crabs walking, seagulls, a boat bobbing, sea sparkles
   jungle: hornbill, butterflies, falling leaves (elephant/tapir/fireflies come from jungle.js)
   cave: bats, water drops from stalactites, crystal glints
   desert: camel caravan, tumbleweed, lizard, sand gusts
   mountain: snowfall, eagle, mountain goat
   all CSS-animated (style.css .lf-*) · switched off by prefers-reduced-motion
   ========================================================= */
const LF = {
  car: c => `<g class="lf-car"><path d="M0 -10 q0 -14 14 -16 l10 -12 q4 -4 10 -4 h22 q6 0 10 4 l12 12 q16 2 16 16 v6 h-94 z" fill="${c}"/>
    <path d="M28 -36 h14 v12 h-22 z M48 -36 h10 l10 12 h-20 z" fill="#DDF1FF"/><rect x="80" y="-14" width="6" height="4" rx="2" fill="#FFE27A"/>
    <g class="lf-spin"><circle cx="20" cy="-4" r="9" fill="#2B2550"/><circle cx="20" cy="-4" r="4" fill="#C9C3E6"/><path d="M20 -12 v16" stroke="#8C84B8" stroke-width="2"/></g>
    <g class="lf-spin"><circle cx="72" cy="-4" r="9" fill="#2B2550"/><circle cx="72" cy="-4" r="4" fill="#C9C3E6"/><path d="M72 -12 v16" stroke="#8C84B8" stroke-width="2"/></g></g>`,
  bird: (c = '#2B2550') => `<g class="lf-flap"><path d="M-14 0 q7 -9 14 0 q7 -9 14 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/></g>`,
  gull: () => `<g class="lf-flap"><path d="M-18 0 q9 -12 18 0 q9 -12 18 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M-18 0 q9 -12 18 0 q9 -12 18 0" fill="none" stroke="#8FA3B8" stroke-width="1.4" stroke-linecap="round"/></g>`,
  balloon: c => `<g><path d="M0 0 q-22 -20 -22 -40 a22 22 0 0 1 44 0 q0 20 -22 40 z" fill="${c}"/><path d="M-8 -52 q4 -6 10 -4" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/><path d="M0 0 q-6 14 2 30" stroke="#8C84B8" stroke-width="1.5" fill="none"/></g>`,
  crab: `<g class="jg-legs"><path d="M-14 -4 l-10 6 M-12 0 l-8 8 M14 -4 l10 6 M12 0 l8 8" stroke="#D9473F" stroke-width="3" stroke-linecap="round"/></g>
    <ellipse cx="0" cy="-8" rx="18" ry="11" fill="#F0605A"/><path d="M-14 -14 q-12 -10 -6 -18 q4 4 2 8 q6 -2 6 4 z M14 -14 q12 -10 6 -18 q-4 4 -2 8 q-6 -2 -6 4 z" fill="#F0605A"/>
    <circle cx="-5" cy="-20" r="3.2" fill="#fff"/><circle cx="5" cy="-20" r="3.2" fill="#fff"/><circle cx="-5" cy="-20" r="1.6" fill="#2B2550"/><circle cx="5" cy="-20" r="1.6" fill="#2B2550"/><path d="M-4 -6 q4 3 8 0" stroke="#9E2F2A" stroke-width="1.6" fill="none"/>`,
  boat: `<g><path d="M-40 0 h80 l-12 16 h-56 z" fill="#E5505E"/><path d="M0 -4 v-56 l34 50 z" fill="#fff"/><path d="M-3 -4 v-46 l-26 40 z" fill="#FFE27A"/><path d="M-40 0 h80" stroke="#9E2F2A" stroke-width="2"/></g>`,
  star4: (c, r = 6) => `<path d="M0 ${-r} L${r * .25} ${-r * .25} L${r} 0 L${r * .25} ${r * .25} L0 ${r} L${-r * .25} ${r * .25} L${-r} 0 L${-r * .25} ${-r * .25} Z" fill="${c}"/>`,
  bat: `<g class="lf-batw"><path d="M0 0 q-10 -12 -26 -8 q6 4 4 10 q-6 -2 -10 4 q14 -4 32 -6 z" fill="#2B2140"/></g><g class="lf-batw r"><path d="M0 0 q10 -12 26 -8 q-6 4 -4 10 q6 -2 10 4 q-14 -4 -32 -6 z" fill="#2B2140"/></g>
    <ellipse cx="0" cy="0" rx="6" ry="8" fill="#3A2F58"/><path d="M-4 -7 l-2 -6 l4 3 z M4 -7 l2 -6 l-4 3 z" fill="#3A2F58"/><circle cx="-2" cy="-2" r="1.2" fill="#FFD45C"/><circle cx="2" cy="-2" r="1.2" fill="#FFD45C"/>`,
  camel: `<g class="jg-legs"><rect x="14" y="-34" width="7" height="34" rx="3" fill="#B97D45"/><rect x="50" y="-34" width="7" height="34" rx="3" fill="#B97D45"/></g>
    <path d="M6 -40 q2 -18 18 -20 q8 -16 18 0 q6 -14 16 -2 q10 2 10 22 z" fill="#D9A15C"/><g class="jg-legs b"><rect x="22" y="-34" width="7" height="34" rx="3" fill="#C88C4E"/><rect x="58" y="-34" width="7" height="34" rx="3" fill="#C88C4E"/></g>
    <path d="M66 -40 q10 -6 12 -26 q2 -10 12 -10 q8 0 8 6 q-6 4 -10 4 q-2 22 -14 30 z" fill="#D9A15C"/><circle cx="90" cy="-72" r="1.8" fill="#2B2550"/><path d="M8 -38 q-8 4 -6 16" stroke="#C88C4E" stroke-width="3" fill="none"/>
    <path d="M30 -58 q6 -6 14 0" stroke="#E5505E" stroke-width="4" fill="none"/>`,
  tumble: `<g class="lf-spin"><circle r="16" fill="none" stroke="#B9874E" stroke-width="2.5"/><path d="M-14 -6 q14 10 28 -2 M-10 10 q8 -18 20 -6 M-4 -15 q8 14 -2 30 M8 -14 q-10 12 4 28" fill="none" stroke="#A8763F" stroke-width="2"/></g>`,
  lizard: `<g class="jg-legs"><path d="M8 -2 l-4 6 M26 -2 l4 6" stroke="#4F9E35" stroke-width="3" stroke-linecap="round"/></g><path d="M-28 -2 q14 -6 30 -4 q14 -2 24 -2 q8 0 10 4 q-8 4 -14 2 q-12 4 -26 2 q-14 2 -24 2 z" fill="#6DBE45"/><circle cx="32" cy="-4" r="1.4" fill="#2B2550"/>`,
  eagle: `<g class="lf-flap slow"><path d="M0 0 q-22 -14 -46 -6 q16 2 22 8 q-12 0 -18 6 q24 -2 42 -8 z M0 0 q22 -14 46 -6 q-16 2 -22 8 q12 0 18 6 q-24 -2 -42 -8 z" fill="#6B4A2E"/></g>
    <ellipse cx="0" cy="2" rx="7" ry="10" fill="#7A5638"/><circle cx="0" cy="-10" r="5" fill="#fff"/><path d="M0 -8 l3 3 l-3 1 z" fill="#FFC23D"/>`,
  goat: `<g class="jg-legs"><rect x="8" y="-16" width="4" height="16" rx="2" fill="#8C8A9A"/><rect x="30" y="-16" width="4" height="16" rx="2" fill="#8C8A9A"/></g><ellipse cx="22" cy="-22" rx="18" ry="10" fill="#F2EFEA"/>
    <g class="jg-legs b"><rect x="13" y="-16" width="4" height="16" rx="2" fill="#B6B3C2"/><rect x="34" y="-16" width="4" height="16" rx="2" fill="#B6B3C2"/></g><circle cx="42" cy="-30" r="7" fill="#F2EFEA"/><path d="M40 -36 q-2 -10 6 -12 M44 -36 q2 -8 8 -8" stroke="#8C7A5A" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="45" cy="-31" r="1.2" fill="#2B2550"/><path d="M44 -24 q2 6 -2 8" stroke="#D8D4CC" stroke-width="2" fill="none"/>`,
  leaf: c => `<path d="M0 0 q8 -10 18 -6 q-6 10 -18 6 z" fill="${c}"/>`,
  hotair: c => `<g><path d="M0 -70 c-30 0 -40 26 -32 46 c6 14 20 24 24 34 h16 c4 -10 18 -20 24 -34 c8 -20 -2 -46 -32 -46 z" fill="${c}"/><path d="M0 -70 c-12 0 -16 26 -12 46 c3 14 8 24 10 34 h4 c2 -10 7 -20 10 -34 c4 -20 0 -46 -12 -46 z" fill="#fff" opacity=".45"/>
    <path d="M-8 10 l2 10 M8 10 l-2 10" stroke="#8C6A3E" stroke-width="1.6"/><rect x="-8" y="20" width="16" height="11" rx="2" fill="#B97D45"/></g>`,
  kite: c => `<g class="lf-sway"><path d="M0 -24 L16 0 L0 24 L-16 0 Z" fill="${c}"/><path d="M0 -24 V24 M-16 0 H16" stroke="#fff" stroke-width="1.6" opacity=".8"/><path d="M0 24 q-8 14 4 24 q-10 10 0 22" fill="none" stroke="#8C84B8" stroke-width="1.6"/></g>`,
  plane: `<g><path d="M-18 0 L18 -8 L4 2 Z" fill="#fff" stroke="#8C84B8" stroke-width="1.4" stroke-linejoin="round"/><path d="M4 2 L-2 10 L-6 1" fill="#E6E2F3" stroke="#8C84B8" stroke-width="1.2" stroke-linejoin="round"/></g>`,
  devil: `<g class="lf-whirl" opacity=".55"><path d="M-22 0 q22 -6 44 0 M-18 -12 q18 -5 36 0 M-13 -24 q13 -4 26 0 M-9 -36 q9 -3 18 0" fill="none" stroke="#D9A15C" stroke-width="3" stroke-linecap="round"/></g>`,
  cloud: (o = .85) => `<g fill="#fff" opacity="${o}"><ellipse cx="0" cy="0" rx="56" ry="18"/><ellipse cx="22" cy="-12" rx="30" ry="18"/><ellipse cx="-20" cy="-8" rx="24" ry="14"/></g>`,
  spore: c => `<circle r="4" fill="${c}" opacity=".9"/><circle r="9" fill="${c}" opacity=".25"/>`,
  flake: `<g stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M0 -6 V6 M-5 -3 L5 3 M-5 3 L5 -3"/></g>`
};
/* helpers: across = walker (uses jgWalk keyframes) · fly = across + gentle bob · fall = top→bottom · twinkle */
const lfFly = (art, y, W, dur, delay, scale = 1, rev) => `<g class="jg-walk${rev ? ' rev' : ''}" style="--W:${W + 160}px;animation-duration:${dur}s;animation-delay:${-delay}s"><g transform="translate(0 ${y}) scale(${rev ? -scale : scale} ${scale})"><g class="lf-bobfly">${art}</g></g></g>`;
const lfFall = (art, x, H, dur, delay, sc = 1, cls = 'lf-fall') => `<g transform="translate(${x} 0)"><g class="${cls}" style="--H:${H + 40}px;animation-duration:${dur}s;animation-delay:${-delay}s"><g class="lf-sway" style="animation-delay:${-delay * .7}s"><g transform="scale(${sc})">${art}</g></g></g></g>`;
const lfTw = (art, x, y, dur, delay) => `<g transform="translate(${x} ${y})"><g class="lf-tw" style="animation-duration:${dur}s;animation-delay:${-delay}s">${art}</g></g>`;
const lfRoll = (y, W, dur, delay, sc = 1) => `<g class="jg-walk" style="--W:${W + 160}px;animation-duration:${dur}s;animation-delay:${-delay}s"><g transform="translate(0 ${y}) scale(${sc})"><g class="lf-hop">${LF.tumble}</g></g></g>`;

/* where: 'bg' (1600×1000 world backdrop, only the edges show) | 'map' (the map scene W×H) */
function lifeLayer(w, W, H, where = 'bg') {
  const bg = where === 'bg'; let seed = 0; const R = (i, a, b) => { const v = Math.sin((i + 1) * 12.9898 + (++seed) * 78.233) * 43758.5453; return a + (v - Math.floor(v)) * (b - a); };
  let o = '';
  if (w === 'city') {
    if (bg) o += `<rect x="0" y="972" width="1600" height="28" fill="#B7B2CF" opacity=".55"/><path d="M0 986 H1600" stroke="#fff" stroke-width="3" stroke-dasharray="26 22" opacity=".8"/>`;
    const gy = bg ? 980 : H - 26, s = bg ? 1 : .55;
    o += jgWalk(LF.car('#FF7B86'), gy, W, bg ? 22 : 26, 4, s) + jgWalk(LF.car('#5BB5F0'), gy - (bg ? 6 : 4), W, bg ? 28 : 32, 17, s * .9, 1) + jgWalk(LF.car('#FFC23D'), gy, W, bg ? 34 : 40, 25, s * .85);
    for (let i = 0; i < (bg ? 4 : 3); i++) o += lfFly(LF.bird(), bg ? R(i, 60, 260) : R(i, 40, 110), W, R(i, 30, 46), R(i + 3, 0, 40), bg ? R(i, .8, 1.2) : .7);
    o += `<g transform="translate(${bg ? 1460 : W * .9} ${bg ? 1040 : H})"><g class="lf-rise" style="--rise:-${bg ? 1150 : H + 80}px">${LF.balloon('#FF9AA8')}</g></g>`;
    o += `<g transform="translate(${bg ? 140 : W * .08} ${bg ? 1060 : H + 30})"><g class="lf-rise" style="--rise:-${bg ? 1150 : H + 80}px;animation-delay:-24s">${LF.balloon('#9BE3B5')}</g></g>`;
    if (bg) for (let i = 0; i < 16; i++) o += lfTw(`<rect x="-5" y="-5" width="10" height="10" rx="2" fill="#FFE27A"/>`, R(i, 20, 1580), R(i + 9, 830, 960), R(i, 3, 7), R(i + 2, 0, 6));
  }
  if (w === 'beach') {
    if (bg) { // rolling waves on the sea band + foam on the shore
      for (let k = 0; k < 3; k++) { const y = 772 + k * 28; let d = `M-200 ${y}`; for (let x = -200; x < 1800; x += 100) d += ` q25 -10 50 0 t50 0`;
        o += `<path class="lf-wave" style="animation-duration:${6 + k * 2}s;animation-delay:${-k}s" d="${d}" fill="none" stroke="#fff" stroke-width="${4 - k}" opacity="${.75 - k * .15}"/>`; }
      o += `<path class="lf-foam" d="M0 878 Q200 862 400 878 T800 878 T1200 874 T1600 870" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".85"/>`;
      o += `<g transform="translate(0 740)"><g class="lf-drift" style="--dx:260px;animation-duration:38s">${`<g transform="translate(1100 0) scale(.9)"><g class="lf-bob">${LF.boat}</g></g>`}</g></g>`;
      for (let i = 0; i < 12; i++) o += lfTw(LF.star4('#fff', 7), R(i, 30, 1570), R(i + 4, 770, 860), R(i, 2.4, 4.4), R(i + 1, 0, 4));
    } else for (let i = 0; i < 8; i++) o += lfTw(LF.star4('#fff', 6), R(i, 20, W - 20), R(i + 4, 20, 120), R(i, 2.4, 4.4), R(i + 1, 0, 4));
    const gy = bg ? 958 : H - 30, s = bg ? 1.2 : .8;
    o += jgWalk(LF.crab, gy, W, bg ? 40 : 34, 6, s) + jgWalk(LF.crab, gy + (bg ? 22 : 8), W, bg ? 52 : 44, 30, s * .8, 1);
    for (let i = 0; i < 3; i++) o += lfFly(LF.gull(), bg ? R(i, 80, 320) : R(i, 24, 90), W, R(i, 26, 40), R(i + 5, 0, 30), bg ? R(i, .9, 1.4) : .8, i % 2);
  }
  if (w === 'jungle') {
    if (bg) o += `<g class="jg-fly2" style="--W:${W + 160}px;animation-duration:34s"><g transform="translate(0 230)">${JG.hornbill}</g></g>` + jgButterflies(W, H, 4);
    for (let i = 0; i < (bg ? 9 : 6); i++) o += lfFall(LF.leaf(['#4FA243', '#7FC85A', '#C9A13A'][i % 3]), R(i, 30, W - 30), H, R(i, 14, 24), R(i + 2, 0, 20), bg ? 1.4 : 1);
  }
  if (w === 'cave') {
    for (let i = 0; i < (bg ? 4 : 3); i++) o += lfFly(`<g transform="scale(${bg ? 1.5 : 1})">${LF.bat}</g>`, bg ? R(i, 150, 420) : R(i, 50, 140), W, R(i, 16, 26), R(i + 1, 0, 20), 1, i % 2);
    const drops = bg ? [[300, 120], [620, 140], [980, 110], [1260, 150]] : [.15, .42, .7, .9].map((f, i) => [W * f, 34 + (i % 2) * 10]);
    drops.forEach(([x, y], i) => { o += `<g transform="translate(${x} ${y})"><path class="lf-drip" style="--dy:${bg ? 260 : 120}px;animation-delay:${-i * 1.3}s" d="M0 0 q-4 6 0 9 q4 -3 0 -9 z" fill="#8FE3F4"/></g>`; });
    for (let i = 0; i < (bg ? 14 : 10); i++) o += lfTw(LF.star4(i % 2 ? '#C9A6FF' : '#8FE3F4', bg ? 9 : 6), R(i, 20, W - 20), bg ? R(i + 3, 700, 960) : R(i + 3, 60, H - 40), R(i, 2.2, 4.2), R(i + 7, 0, 4));
  }
  if (w === 'desert') {
    const gy = bg ? 968 : H - 28, s = bg ? 1.1 : .6;
    o += jgWalk(LF.camel, gy, W, bg ? 70 : 60, 8, s) + jgWalk(LF.camel, gy, W, bg ? 70 : 60, bg ? 2.6 : 2.4, s * .82);
    o += lfRoll(gy - (bg ? 22 : 12), W, bg ? 16 : 14, 5, bg ? 1.4 : .9) + jgWalk(LF.lizard, gy - (bg ? 70 : 0), W, bg ? 12 : 10, 3, bg ? 1.2 : .7, 1);
    for (let i = 0; i < 5; i++) o += `<g transform="translate(0 ${bg ? R(i, 560, 900) : R(i, 80, H - 60)})"><path class="lf-gust" style="--W:${W + 200}px;animation-duration:${R(i, 6, 10)}s;animation-delay:${-R(i + 2, 0, 8)}s" d="M0 0 q30 -8 60 0 t60 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/></g>`;
    for (let i = 0; i < (bg ? 6 : 4); i++) o += lfTw(LF.star4('#FFF3B0', 6), R(i, 40, W - 40), bg ? R(i + 2, 640, 960) : R(i + 2, 60, H - 40), R(i, 2.6, 4.6), R(i, 0, 4));
  }
  if (w === 'mountain') {
    for (let i = 0; i < (bg ? 34 : 22); i++) o += lfFall(LF.flake, R(i, 10, W - 10), H, R(i, 10, 20), R(i + 5, 0, 20), R(i, .6, 1.3), 'lf-snow');
    o += lfFly(LF.eagle, bg ? 260 : 90, W, bg ? 36 : 30, 10, bg ? 1.3 : .8) + lfFly(LF.bird('#4A4A5A'), bg ? 180 : 60, W, 44, 25, .9, 1);
    if (bg) o += jgWalk(LF.goat, 905, W, 60, 12, 1.4);
  }
  if (w === 'river') o += rvLife(W, H, bg, R); /* ม.1 (engine/river.js) */
  /* ---- the MIDDLE band: things crossing between the top and the bottom ---- */
  const y0 = bg ? 360 : H * .28, y1 = bg ? 720 : H * .72, my = i => R(i, y0, y1), sm = bg ? 1 : .7;
  const crossers = { // [art, duration, scale, reverse, bob?]
    city: [[LF.hotair('#FF9AA8'), 70, 1.2], [LF.bird(), 34, .9, 1], [LF.plane, 22, 1.1], [LF.bird('#5A527A'), 40, .8], [LF.cloud(.7), 90, 1.1, 1]],
    beach: [[LF.gull(), 30, 1.1, 1], [LF.kite('#FF7B86'), 60, 1, 0], [LF.gull(), 38, .9], [LF.cloud(.75), 80, 1.2, 1], [LF.hotair('#7FC8F0'), 85, 1]],
    jungle: [[JG.hornbill, 36, 1.1, 1], [JG.dragonfly, 20, 1.2], [JG.bfly('#FFB534'), 26, 1.3, 1], [JG.bfly('#5BB5F0'), 30, 1.2], [LF.bird('#2F6B2A'), 34, .9, 1]],
    cave: [[`<g transform="scale(1.3)">${LF.bat}</g>`, 18, 1, 1], [`<g transform="scale(1.1)">${LF.bat}</g>`, 24, 1], [LF.spore('#8FE3F4'), 40, 1.2], [LF.spore('#C9A6FF'), 48, 1.2, 1], [LF.spore('#FFE9A6'), 36, 1]],
    desert: [[LF.eagle, 40, .9, 1], [LF.devil, 26, 1.6], [LF.bird('#8C6A3E'), 32, .9], [LF.devil, 34, 1.2, 1], [LF.cloud(.5), 100, 1]],
    river: [[JG.dragonfly, 22, 1.3], [LF.bird('#2F7FB3'), 34, .9, 1], [JG.bfly('#FFB534'), 28, 1.2], [LF.cloud(.7), 85, 1.2, 1], [LF.bird('#5A527A'), 40, .8]],
    mountain: [[LF.eagle, 34, 1.1], [LF.cloud(.85), 70, 1.3, 1], [LF.bird('#4A4A5A'), 30, .9, 1], [LF.cloud(.7), 95, 1], [LF.hotair('#FFC23D'), 80, 1]]
  }[w] || [];
  crossers.forEach(([art, dur, k, rev], i) => { o += lfFly(art, my(i + 11), W, bg ? dur : dur * .8, R(i + 21, 0, dur), k * sm, rev); });
  /* a few sparkles / glows that live mid-screen at the edges (bg) or between rows (map) */
  const tw = { city: '#FFE27A', beach: '#fff', jungle: '#FFF7A8', cave: '#C9A6FF', desert: '#FFF3B0', mountain: '#fff', river: '#fff' }[w];
  if (tw) for (let i = 0; i < (bg ? 10 : 6); i++) o += lfTw(LF.star4(tw, bg ? 7 : 5), bg ? (i % 2 ? R(i + 31, 20, 260) : R(i + 31, 1340, 1580)) : R(i + 31, 20, W - 20), my(i + 41), R(i, 2.4, 4.4), R(i + 3, 0, 4));
  return o ? `<g class="lf-layer">${o}</g>` : '';
}
