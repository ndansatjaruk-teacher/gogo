/* =========================================================
   MEADOW WORLD (ม.3) — "ทุ่งดอกไม้": the level path is a garden path through flower fields
   (tulip rows, sunflowers, lavender, a windmill, beehives). Pieces: scenery (64×64), the screen
   background, the life layer (bees and butterflies) and the queen-bee boss (bossSVG kind 'bee'). Prefix md.
   ========================================================= */
const MD_BEE = `<g class="md-bee"><ellipse cx="-3" cy="-7" rx="6" ry="4.5" fill="#fff" opacity=".85" class="md-wing"/><ellipse cx="4" cy="-7" rx="6" ry="4.5" fill="#fff" opacity=".75" class="md-wing w2"/><ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#FFC928" stroke="#2B2550" stroke-width="1.4"/><path d="M-3 -6 v12 M2.5 -6 v12" stroke="#2B2550" stroke-width="2.4"/><circle cx="8" cy="-1" r="3.6" fill="#2B2550"/><path d="M-9 0 l-4 1" stroke="#2B2550" stroke-width="1.6" stroke-linecap="round"/></g>`;
Object.assign(SCENERY, {
  sunflower: `<ellipse cx="32" cy="61" rx="12" ry="2.4" fill="#2B2550" opacity=".1"/><path d="M32 61 V30" stroke="#4C9A3A" stroke-width="3.4" stroke-linecap="round"/><path d="M32 48 q-12 -8 -16 -2 q6 6 16 2 z M32 42 q12 -8 16 -2 q-6 6 -16 2 z" fill="#5DB246" stroke="#3E8A32" stroke-width="1"/><g fill="#FFC928" stroke="#E09A12" stroke-width="1">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => `<ellipse cx="32" cy="14" rx="4.2" ry="8" transform="rotate(${a} 32 24)"/>`).join('')}</g><circle cx="32" cy="24" r="7.5" fill="#7A4A22"/><g fill="#5A3416">${[[-3, -2], [2, -3], [3, 2], [-2, 3], [0, 0]].map(([x, y]) => `<circle cx="${32 + x}" cy="${24 + y}" r="1.1"/>`).join('')}</g>`,
  tulips: `<ellipse cx="32" cy="61" rx="18" ry="2.4" fill="#2B2550" opacity=".1"/>${[[18, '#FF6F7D', '#D94A5E'], [32, '#FFB534', '#E0901A'], [46, '#C084FC', '#9B5DE5']].map(([x, c, d], i) => `<path d="M${x} 61 V${34 - i % 2 * 6}" stroke="#4C9A3A" stroke-width="2.6"/><path d="M${x} 52 q-8 -6 -9 -14 q6 2 9 10" fill="#5DB246"/><path d="M${x - 7} ${26 - i % 2 * 6} q0 12 7 12 q7 0 7 -12 l-3.5 4 l-3.5 -6 l-3.5 6 z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/>`).join('')}`,
  beehive: `<ellipse cx="32" cy="61" rx="16" ry="2.6" fill="#2B2550" opacity=".12"/><path d="M32 6 V12" stroke="#6B4423" stroke-width="3"/><path d="M10 6 H54" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>${[[14, 18, 20], [18, 26, 30], [20, 36, 34], [18, 46, 30], [14, 54, 22]].map(([w, y, ww]) => `<rect x="${32 - ww / 2}" y="${y - 5}" width="${ww}" height="10" rx="5" fill="#F7C548" stroke="#C98612" stroke-width="1.4"/>`).join('')}<path d="M28 50 a4 4 0 0 1 8 0 v4 h-8 z" fill="#5A3416"/>`,
  windmill: `<ellipse cx="32" cy="62" rx="18" ry="2.4" fill="#2B2550" opacity=".12"/><path d="M22 62 L26 26 H38 L42 62 Z" fill="#F4E7D3" stroke="#9C7B5A" stroke-width="1.6" stroke-linejoin="round"/><path d="M24 26 L32 16 L40 26 Z" fill="#D9534F" stroke="#A33B37" stroke-width="1.4" stroke-linejoin="round"/><rect x="29" y="48" width="6" height="14" rx="3" fill="#8B5A2B"/><g class="md-blades" style="transform-origin:32px 24px">${[0, 90, 180, 270].map(a => `<path d="M32 24 L33 4 L39 6 L35 24 Z" fill="#fff" stroke="#9C7B5A" stroke-width="1.2" transform="rotate(${a} 32 24)"/>`).join('')}<circle cx="32" cy="24" r="2.6" fill="#6B4423"/></g>`,
  fence: `<g stroke="#B98654" stroke-width="1.4" fill="#E8C496"><path d="M8 58 V34 l3 -4 l3 4 V58 Z M26 58 V34 l3 -4 l3 4 V58 Z M44 58 V34 l3 -4 l3 4 V58 Z"/><rect x="4" y="38" width="54" height="5" rx="2"/><rect x="4" y="49" width="54" height="5" rx="2"/></g>`,
  lavender: `<ellipse cx="32" cy="61" rx="16" ry="2.4" fill="#2B2550" opacity=".1"/>${[16, 24, 32, 40, 48].map((x, i) => `<path d="M32 61 Q${x} 44 ${x + (x - 32) * .4} ${24 + Math.abs(i - 2) * 4}" stroke="#6FA84A" stroke-width="1.6" fill="none"/>${[0, 1, 2, 3].map(k => `<ellipse cx="${x + (x - 32) * .4 - (x - 32) * .05 * k}" cy="${24 + Math.abs(i - 2) * 4 + k * 4}" rx="2.4" ry="3" fill="${k % 2 ? '#A78BFA' : '#8B5CF6'}"/>`).join('')}`).join('')}`,
  daisy: `<ellipse cx="32" cy="58" rx="16" ry="2.4" fill="#2B2550" opacity=".1"/>${[[22, 40, 1], [42, 36, .9], [32, 46, .8]].map(([x, y, s]) => `<path d="M${x} 58 V${y}" stroke="#5DB246" stroke-width="2"/><g transform="translate(${x} ${y}) scale(${s})"><g fill="#fff" stroke="#E2DCEB" stroke-width=".8">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="0" cy="-6.5" rx="2.8" ry="5.2" transform="rotate(${a})"/>`).join('')}</g><circle r="3.4" fill="#FFC928"/></g>`).join('')}`,
  mdbee: `<g transform="translate(32 34) scale(2.2)">${MD_BEE}</g>`,
  haybale: `<ellipse cx="32" cy="60" rx="20" ry="2.6" fill="#2B2550" opacity=".12"/><rect x="10" y="34" width="44" height="26" rx="6" fill="#F0CF6E" stroke="#C99A2E" stroke-width="1.6"/><path d="M10 44 H54 M10 52 H54" stroke="#C99A2E" stroke-width="1.2"/><g stroke="#B5852A" stroke-width="1" opacity=".7"><path d="M16 38 l3 4 M26 37 l2 5 M38 38 l3 4 M46 37 l2 5"/></g>`
});
/* small things placed between two levels on the garden path */
const MD_PATH = ['daisy', 'mdbee', 'tulips', 'daisy', 'lavender'];

/* the screen background behind every ม.3 page: sky, rolling hills and striped flower fields */
function mdWorldBG() {
  let b = `<circle cx="1320" cy="150" r="64" fill="#FFE27A" opacity=".85"/><circle cx="1320" cy="150" r="118" fill="#FFE27A" opacity=".18"/>`;
  b += `<path d="M0 520 Q260 430 560 480 T1100 460 T1600 440 V1000 H0 Z" fill="#CDEBB3" opacity=".85"/>`;
  b += `<path d="M0 600 Q320 540 700 580 T1300 560 T1600 560 V1000 H0 Z" fill="#B7E09B"/>`;
  /* tulip stripes in perspective */
  const C = ['#FF8A9A', '#FFC34D', '#C9A0FF', '#FF8A9A', '#FFFFFF', '#FFB534'];
  for (let k = 0; k < 6; k++) { const y = 650 + k * 52, sk = 30 + k * 26; b += `<path d="M-40 ${y} Q800 ${y - 30 - k * 4} 1640 ${y} L1640 ${y + 26 + k * 4} Q800 ${y - 4 - k * 2} -40 ${y + 26 + k * 4} Z" fill="${C[k]}" opacity="${.5 + k * .06}"/>`;
    for (let x = -20; x < 1640; x += sk) b += `<circle cx="${x + (k % 2) * sk / 2}" cy="${y + 8 + k * 2 - Math.sin(x / 260) * 6}" r="${3 + k * .9}" fill="${C[k]}" stroke="#fff" stroke-width="${k > 3 ? 1.2 : 0}" opacity=".9"/>`; }
  b += `<g transform="translate(1180 360) scale(3)" opacity=".92">${SCENERY.windmill}</g>`;
  [[200, 520, 'sunflower', 2.2], [470, 560, 'beehive', 1.6], [1480, 540, 'sunflower', 2]].forEach(([x, y, k, s]) => { b += `<g transform="translate(${x} ${y}) scale(${s})">${SCENERY[k]}</g>`; });
  return b;
}

/* moving things for the meadow world: bees zig-zagging, butterflies, a cloud */
function mdLife(W, H, bg, R) {
  let o = '';
  for (let i = 0; i < (bg ? 5 : 3); i++) o += lfFly(`<g class="md-zig" style="animation-delay:${-i * .7}s">${MD_BEE}</g>`, bg ? R(i, 380, 900) : R(i, 50, H - 70), W, R(i, 18, 30), R(i + 3, 0, 30), bg ? R(i, 1.6, 2.2) : 1.3, i % 2);
  return o;
}

/* ---------- the queen-bee boss (bossSVG kind 'bee') ---------- */
function mdBeeSVG(state, pal, emblem = 'Q') {
  const ink = '#2B2550', y1 = '#FFE27A', y2 = '#FFC928', y3 = '#E09A12', open = state === 'roar' || state === 'laugh' || state === 'flex';
  const eye = x => state === 'down' ? `<path d="M${x - 4} 40 l8 8 M${x + 4} 40 l-8 8" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`
    : state === 'sleepy' || state === 'hit' ? `<path d="M${x - 5} 45 q5 4 10 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="${x}" cy="44" rx="5.6" ry="6.6" fill="${ink}"/><circle cx="${x + 1.8}" cy="41.6" r="1.9" fill="#fff"/>`;
  const mouth = open ? `<path d="M52 56 q8 9 16 0 z" fill="#C2405A" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>` : state === 'down' || state === 'hit' ? `<path d="M54 58 q6 -4 12 0" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : `<path d="M54 55 q6 5 12 0" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const brow = state === 'roar' || state === 'flex' ? `<path d="M44 33 l10 4 M76 33 l-10 4" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>` : '';
  const extra = state === 'down' ? '<g class="b-stars"><path d="M92 14 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z M104 30 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z" fill="#F5B52E"/></g>'
    : state === 'roar' ? `<g class="b-roar" stroke="${y3}" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M100 50 l6 -3 M102 60 h6 M100 70 l6 3"/></g>` : '';
  return `<svg viewBox="0 0 120 130" class="boss-svg bee" aria-hidden="true">
  <defs><linearGradient id="md-by" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${y1}"/><stop offset="1" stop-color="${y2}"/></linearGradient><linearGradient id="md-wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset="1" stop-color="#BFE6FF" stop-opacity=".7"/></linearGradient></defs>
  <ellipse class="b-shadow" cx="60" cy="124" rx="36" ry="5" fill="${ink}" opacity=".14"/>
  <g class="b-body">
    ${state === 'flex' ? `<circle cx="60" cy="70" r="56" fill="url(#g-glow)" opacity=".7"/>` : ''}
    <g class="md-bwing l"><ellipse cx="30" cy="58" rx="22" ry="14" transform="rotate(-25 30 58)" fill="url(#md-wg)" stroke="#8EC5EA" stroke-width="1.6"/><ellipse cx="32" cy="76" rx="15" ry="9" transform="rotate(-10 32 76)" fill="url(#md-wg)" stroke="#8EC5EA" stroke-width="1.4"/></g>
    <g class="md-bwing r"><ellipse cx="90" cy="58" rx="22" ry="14" transform="rotate(25 90 58)" fill="url(#md-wg)" stroke="#8EC5EA" stroke-width="1.6"/><ellipse cx="88" cy="76" rx="15" ry="9" transform="rotate(10 88 76)" fill="url(#md-wg)" stroke="#8EC5EA" stroke-width="1.4"/></g>
    <path d="M60 116 l-5 -8 h10 z" fill="${ink}"/>
    <ellipse cx="60" cy="88" rx="27" ry="24" fill="url(#md-by)" stroke="${y3}" stroke-width="2.2"/>
    <path d="M35 80 Q60 86 85 80 L86 88 Q60 94 34 88 Z M37 98 Q60 104 83 98 L80 105 Q60 111 40 105 Z" fill="${ink}"/>
    <circle cx="60" cy="92" r="0" fill="none"/>
    <path class="b-arm" d="M36 74 q-12 0 -14 10 q6 3 12 -3 M84 74 q12 0 14 10 q-6 3 -12 -3" fill="url(#md-by)" stroke="${y3}" stroke-width="2" stroke-linejoin="round"/>
    <g class="md-head">
      <path d="M50 28 Q44 12 36 10 M70 28 Q76 12 84 10" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="36" cy="10" r="4" fill="${ink}"/><circle cx="84" cy="10" r="4" fill="${ink}"/>
      <circle cx="60" cy="47" r="22" fill="url(#md-by)" stroke="${y3}" stroke-width="2.2"/>
      <path d="M46 26 L50 16 L56 24 L60 13 L64 24 L70 16 L74 26 Z" fill="#FFD84D" stroke="#C98612" stroke-width="1.6" stroke-linejoin="round"/><circle cx="60" cy="19" r="2" fill="#FF6F7D"/>
      <ellipse cx="45" cy="53" rx="4.5" ry="3" fill="#FF9AA6" opacity=".7"/><ellipse cx="75" cy="53" rx="4.5" ry="3" fill="#FF9AA6" opacity=".7"/>
      ${eye(51)}${eye(69)}${brow}${mouth}
    </g>
    <circle cx="60" cy="93" r="9.5" fill="#fff" opacity=".92"/><text x="60" y="${String(emblem).length > 1 ? 97 : 98}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 1 ? 9 : 12}" fill="${ink}">${emblem}</text>
    ${state !== 'flex' ? extra : ''}
  </g>
</svg>`;
}
