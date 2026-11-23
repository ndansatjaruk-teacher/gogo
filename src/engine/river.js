/* =========================================================
   RIVER WORLD (ม.1) — "แม่น้ำข้ามแผ่นดิน": the level path is a river, the land around it is fields,
   stilt houses, reeds and trees. Pieces: scenery (64×64), the screen background, the life layer,
   and the crocodile boss (bossSVG kind 'croc'). Prefix rv.
   ========================================================= */
Object.assign(SCENERY, {
  reeds: `<ellipse cx="32" cy="60" rx="16" ry="2.6" fill="#2B2550" opacity=".1"/><g stroke-linecap="round" fill="none"><path d="M22 60 q-2 -22 -8 -36" stroke="#5FA336" stroke-width="2.6"/><path d="M28 60 q0 -26 2 -44" stroke="#6DB43E" stroke-width="2.6"/><path d="M36 60 q2 -20 10 -32" stroke="#5FA336" stroke-width="2.6"/><path d="M42 60 q4 -14 14 -20" stroke="#7CC24A" stroke-width="2.4"/><path d="M18 60 q-6 -10 -12 -12" stroke="#7CC24A" stroke-width="2.4"/></g><rect x="27.5" y="12" width="5" height="13" rx="2.5" fill="#8B5A2B"/><rect x="11.5" y="20" width="4.5" height="11" rx="2.2" fill="#9C6634" transform="rotate(-18 14 25)"/><rect x="43" y="25" width="4.5" height="10" rx="2.2" fill="#8B5A2B" transform="rotate(28 45 30)"/>`,
  lotus: `<ellipse cx="32" cy="46" rx="24" ry="9" fill="#4FA65A" stroke="#2F7D3E" stroke-width="1.4"/><path d="M32 46 L52 40" stroke="#2F7D3E" stroke-width="1.4"/><ellipse cx="30" cy="44" rx="10" ry="3" fill="#7FCB78" opacity=".6"/><g stroke="#C94F7C" stroke-width="1.2" stroke-linejoin="round"><path d="M32 42 q-10 -4 -12 -16 q8 2 12 12 z" fill="#FF9EC0"/><path d="M32 42 q10 -4 12 -16 q-8 2 -12 12 z" fill="#FF9EC0"/><path d="M32 42 q-5 -10 0 -24 q5 14 0 24 z" fill="#FFC2D6"/></g><circle cx="32" cy="38" r="2.6" fill="#FFD45C"/>`,
  duck: `<ellipse cx="32" cy="54" rx="20" ry="4" fill="#fff" opacity=".55"/><path d="M14 46 q2 -14 18 -12 q4 -12 14 -8 q6 4 2 12 q10 0 12 -4 q2 14 -16 18 q-24 4 -30 -6 z" fill="url(#g-yellow)" stroke="#D18E1C" stroke-width="1.4" stroke-linejoin="round"/><path d="M50 34 l8 2 l-8 3 z" fill="#FF8A3D" stroke="#C9631E" stroke-width="1"/><circle cx="44" cy="31" r="2" fill="#2B2550"/><path d="M22 44 q8 -6 16 0" fill="none" stroke="#D18E1C" stroke-width="1.6" stroke-linecap="round"/>`,
  stilthouse: `<ellipse cx="32" cy="61" rx="24" ry="2.6" fill="#2B2550" opacity=".12"/><g stroke="#6B4423" stroke-width="2.6" stroke-linecap="round"><path d="M16 60 V38 M28 60 V38 M38 60 V38 M50 60 V38"/></g><path d="M12 38 H54 V40 H12 Z" fill="#8B5A2B"/><rect x="14" y="24" width="38" height="15" rx="1.5" fill="#C98E55" stroke="#8B5A2B" stroke-width="1.4"/><g stroke="#A8743F" stroke-width="1"><path d="M18 24 V39 M23 24 V39 M28 24 V39 M38 24 V39 M43 24 V39 M48 24 V39"/></g><rect x="30" y="28" width="7" height="11" rx="1" fill="#6B4423"/><path d="M6 26 L18 10 H48 L60 26 Z" fill="#C0392B" stroke="#8E2A20" stroke-width="1.4" stroke-linejoin="round"/><path d="M18 10 L13 4 M48 10 L53 4" stroke="#8E2A20" stroke-width="2" stroke-linecap="round"/><path d="M50 50 l8 10" stroke="#6B4423" stroke-width="2.2" stroke-linecap="round"/>`,
  paddy: `<path d="M4 50 L14 34 H58 L60 50 Z" fill="#9FD27A" stroke="#6FA84A" stroke-width="1.2"/><g stroke="#5E9E3A" stroke-width="1.6" stroke-linecap="round">${[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4, 5].map(c => `<path d="M${12 + c * 8 + r * -2} ${38 + r * 3.6} v-4 M${12 + c * 8 + r * -2} ${38 + r * 3.6} l-2 -3 M${12 + c * 8 + r * -2} ${38 + r * 3.6} l2 -3"/>`).join('')).join('')}</g><path d="M4 50 H60" stroke="#7DBFE3" stroke-width="2"/>`,
  kayak: `<ellipse cx="32" cy="50" rx="26" ry="4" fill="#fff" opacity=".5"/><path d="M6 44 q26 12 52 0 q-4 6 -26 7 q-22 -1 -26 -7 z" fill="#B0703A" stroke="#7A4A22" stroke-width="1.4" stroke-linejoin="round"/><circle cx="32" cy="30" r="5" fill="#FFD9B3" stroke="#C9956A" stroke-width="1"/><path d="M27 29 q5 -7 10 0" fill="#2B2550"/><path d="M28 44 q0 -9 4 -10 q4 1 4 10 z" fill="url(#g-sky)"/><path d="M14 24 L50 50" stroke="#7A4A22" stroke-width="2.2" stroke-linecap="round"/><path d="M48 46 l6 8 l3 -3 z" fill="#7A4A22"/>`,
  pier: `<ellipse cx="32" cy="58" rx="24" ry="3" fill="#fff" opacity=".45"/><g stroke="#6B4423" stroke-width="3" stroke-linecap="round"><path d="M14 58 V36 M30 58 V36 M46 58 V36"/></g><path d="M6 34 H58 V40 H6 Z" fill="#B0703A" stroke="#7A4A22" stroke-width="1.2"/><g stroke="#8B5A2B" stroke-width="1"><path d="M16 34 V40 M26 34 V40 M36 34 V40 M46 34 V40"/></g><path d="M52 34 V18" stroke="#6B4423" stroke-width="2.4"/><path d="M52 18 q8 2 10 8 l-10 -2 z" fill="#FF7B86"/>`,
  croc: `<ellipse cx="32" cy="50" rx="26" ry="4" fill="#fff" opacity=".45"/><path d="M4 44 q12 -8 30 -8 q14 0 26 6 q-10 6 -26 6 q-18 0 -30 -4 z" fill="#5E9E4A" stroke="#3E7432" stroke-width="1.4"/><g fill="#3E7432">${[16, 24, 32, 40].map(x => `<path d="M${x} 37 l3 -5 l3 5 z"/>`).join('')}</g><circle cx="48" cy="38" r="3.4" fill="#E9F27A" stroke="#3E7432" stroke-width="1"/><ellipse cx="48" cy="38" rx="1" ry="2.4" fill="#2B2550"/><path d="M50 44 l3 3 l2 -3 l3 3" fill="none" stroke="#fff" stroke-width="1.2"/>`,
  ricebarn: `<ellipse cx="32" cy="60" rx="18" ry="2.6" fill="#2B2550" opacity=".1"/><path d="M18 60 V40 M46 60 V40" stroke="#6B4423" stroke-width="2.6"/><rect x="16" y="30" width="32" height="14" rx="2" fill="#D9A65E" stroke="#8B5A2B" stroke-width="1.2"/><path d="M10 32 L32 14 L54 32 Z" fill="#E8C46A" stroke="#B08A33" stroke-width="1.4" stroke-linejoin="round"/><g stroke="#B08A33" stroke-width="1"><path d="M18 28 L32 17 L46 28"/></g>`
});
/* level-path pieces placed on the water between two levels */
const RV_WATER = ['lotus', 'duck', 'kayak', 'lotus', 'croc'];

/* the screen background behind every ม.1 page: land, fields and a winding river across it */
function rvWorldBG() {
  let b = `<defs><linearGradient id="rv-w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FCCEE"/><stop offset="1" stop-color="#4AA3D8"/></linearGradient></defs>`;
  b += `<circle cx="1320" cy="150" r="64" fill="#FFE27A" opacity=".8"/><circle cx="1320" cy="150" r="110" fill="#FFE27A" opacity=".18"/>`;
  b += `<path d="M0 560 Q240 470 520 520 T1060 500 T1600 470 V1000 H0 Z" fill="#CBE8AE" opacity=".8"/>`;
  b += `<path d="M0 640 Q300 580 640 620 T1240 600 T1600 590 V1000 H0 Z" fill="#B5DC97" opacity=".85"/>`;
  /* rice paddies: thin stripes */
  [[120, 700, 300], [1180, 690, 320], [520, 860, 260]].forEach(([x, y, w]) => { b += `<g opacity=".5"><path d="M${x} ${y} h${w} l-30 60 h-${w} z" fill="#A6D77E"/>${[0, 1, 2, 3].map(k => `<path d="M${x - k * 7} ${y + 12 + k * 13} h${w}" stroke="#7FB85A" stroke-width="2"/>`).join('')}</g>`; });
  /* the river: a wide band winding from the left edge to the bottom right */
  const RD = 'M-60 690 C 260 640 420 780 700 760 S 1100 640 1320 760 S 1560 960 1700 940';
  b += `<path d="${RD}" fill="none" stroke="#E6D3A0" stroke-width="150" stroke-linecap="round" opacity=".9"/><path d="${RD}" fill="none" stroke="url(#rv-w)" stroke-width="118" stroke-linecap="round"/>`;
  for (let k = 0; k < 3; k++) b += `<path class="rv-flow" style="animation-duration:${9 + k * 3}s" d="${RD}" fill="none" stroke="#fff" stroke-width="${3 - k * .6}" stroke-dasharray="${26 + k * 8} ${60 + k * 30}" opacity="${.65 - k * .15}" transform="translate(0 ${-30 + k * 30})"/>`;
  [[180, 590], [880, 600], [1460, 640]].forEach(([x, y], i) => { b += `<g transform="translate(${x} ${y}) scale(2)" opacity=".85">${SCENERY[i === 1 ? 'stilthouse' : 'tree']}</g>`; });
  [[330, 760], [1010, 740], [1250, 820]].forEach(([x, y], i) => { b += `<g transform="translate(${x} ${y}) scale(1.4)">${SCENERY[i % 2 ? 'lotus' : 'duck']}</g>`; });
  return b;
}

/* moving things for the river world: boats drifting downstream, birds and dragonflies */
function rvLife(W, H, bg, R) {
  let o = '';
  const gy = bg ? 772 : H - 30, s = bg ? 1.2 : .6;
  o += jgWalk(`<g transform="translate(-32 -50)">${SCENERY.kayak}</g>`, gy, W, bg ? 60 : 50, 6, s) + jgWalk(`<g transform="translate(-32 -50)">${SCENERY.duck}</g>`, gy + (bg ? 30 : 6), W, bg ? 80 : 70, 30, s * .8, 1);
  for (let i = 0; i < (bg ? 4 : 3); i++) o += lfFly(LF.bird(i % 2 ? '#2F7FB3' : '#5A527A'), bg ? R(i, 220, 420) : R(i, 40, 120), W, R(i, 28, 44), R(i + 3, 0, 40), bg ? R(i, .8, 1.2) : .7, i % 2);
  return o;
}

/* ---------- the crocodile boss (bossSVG kind 'croc') ---------- */
function rvCrocSVG(state, pal, emblem = '±') {
  const [l, b, d, line] = PAL[pal] || PAL.jade, ink = '#2B2550', open = state === 'roar' || state === 'laugh' || state === 'flex';
  const eye = (x) => state === 'down' ? `<path d="M${x - 4} 14 l8 8 M${x + 4} 14 l-8 8" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`
    : state === 'sleepy' || state === 'hit' ? `<path d="M${x - 5} 19 q5 4 10 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="${x}" cy="18" rx="6" ry="6.5" fill="#F3F7A8"/><ellipse cx="${x - 1}" cy="18.5" rx="1.8" ry="4.6" fill="${ink}"/>`;
  const brow = state === 'roar' || state === 'flex' ? `<path d="M48 8 l14 6 M86 8 l-14 6" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>` : '';
  const teethU = [16, 23, 30, 37].map(x => `<path d="M${x} 41 l3 6 l3 -6 z"/>`).join('');
  const jaw = open
    ? `<path d="M44 46 L18 62 Q10 66 13 71 Q24 72 48 56 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2" stroke-linejoin="round"/><path d="M44 44 L18 61 L16 44 Z" fill="#C2405A"/><path d="M30 52 q6 2 10 -2" stroke="#FF8FA3" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#fff">${[20, 27, 34].map(x => `<path d="M${x} ${66 - (x - 20) * .5} l3 -6 l3 6 z"/>`).join('')}</g>`
    : `<path d="M44 42 L16 42 Q8 44 10 50 Q20 54 46 50 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2" stroke-linejoin="round"/><g fill="#fff">${[19, 26, 33].map(x => `<path d="M${x} 43 l3 -4 l3 4 z"/>`).join('')}</g>`;
  const arms = `<path class="b-arm" d="M32 84 q-14 4 -12 16 q8 2 14 -6 M88 84 q14 4 12 16 q-8 2 -14 -6" fill="url(#g-${pal})" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>`;
  const extra = state === 'down' ? '<g class="b-stars"><path d="M92 6 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z M104 22 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z" fill="#F5B52E"/></g>'
    : state === 'roar' ? `<g class="b-roar" stroke="${line}" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M4 50 l-4 -3 M2 62 h-4 M4 74 l-4 3"/></g>`
      : state === 'flex' ? `<circle cx="60" cy="70" r="56" fill="url(#g-glow)" opacity=".7"/>` : '';
  return `<svg viewBox="0 0 120 130" class="boss-svg croc" aria-hidden="true">
  <ellipse class="b-shadow" cx="62" cy="124" rx="44" ry="5" fill="#2B2550" opacity=".14"/>
  <g class="b-body">
    ${state === 'flex' ? extra : ''}
    <path class="c-tail" d="M84 108 Q116 112 114 86 Q113 74 104 74 Q108 90 96 96 Q90 100 82 98 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <g fill="${d}">${[[103, 80], [108, 90], [104, 100]].map(([x, y]) => `<path d="M${x} ${y} l5 -2 l-2 5 z"/>`).join('')}</g>
    <path d="M62 44 C88 44 96 70 94 92 C92 112 80 120 62 120 C44 120 32 112 30 92 C28 70 36 44 62 44 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2"/>
    <path d="M62 60 C76 60 80 78 78 94 C76 108 70 113 62 113 C54 113 48 108 46 94 C44 78 48 60 62 60 Z" fill="${l}" opacity=".9"/>
    <g stroke="${b}" stroke-width="1.4" opacity=".8"><path d="M50 74 H74 M48 84 H76 M48 102 H76 M51 110 H73"/></g>
    <g fill="${d}" opacity=".7">${[[90, 58], [93, 70], [94, 82]].map(([x, y]) => `<path d="M${x} ${y} l6 -3 l-2 7 z"/>`).join('')}</g>
    <path d="M44 118 q-6 4 -2 6 h12 q2 -4 -2 -6 z M80 118 q6 4 2 6 h-12 q-2 -4 2 -6 z" fill="url(#g-${pal})" stroke="${line}" stroke-width="1.8" stroke-linejoin="round"/>
    ${arms}
    <g class="c-head">
      <ellipse cx="64" cy="34" rx="28" ry="18" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2"/>
      ${jaw}
      <path d="M46 28 Q20 24 10 32 Q6 40 16 43 L46 44 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
      <g fill="#fff">${teethU}</g>
      <circle cx="13" cy="33" r="2.2" fill="${line}"/>
      <circle cx="58" cy="20" r="9" fill="url(#g-${pal})" stroke="${line}" stroke-width="2"/><circle cx="76" cy="20" r="9" fill="url(#g-${pal})" stroke="${line}" stroke-width="2"/>
      ${eye(58)}${eye(76)}${brow}
      <ellipse cx="74" cy="34" rx="8" ry="4" fill="#fff" opacity=".3"/>
    </g>
    <circle cx="62" cy="92" r="10.5" fill="#fff" opacity=".92"/><text x="62" y="${String(emblem).length > 2 ? 95 : 97}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 2 ? 8.5 : 14}" fill="${line}">${emblem}</text>
    ${state !== 'flex' ? extra : ''}
  </g></svg>`;
}
