/* =========================================================
   DETECTIVE CITY (ม.2) — "เมืองนักสืบข้อมูล": an old town at dusk. The level path is a cobblestone
   street with footprints; street lamps, brick houses, the detective office, evidence boards with
   pinned charts. Pieces: scenery (64×64), the screen background, the life layer (a detective dog
   walking with a magnifier, floating "?" clues, glowing lamps) and the owl-thief boss
   (bossSVG kind 'owlthief'). Prefix dt.
   ========================================================= */
const DT_INK = '#2B2550';
/* the detective dog (beagle with a deerstalker cap and a magnifier) centred on (0,0), about 30 tall */
const DT_DOG = `<g class="dt-dog"><ellipse cx="0" cy="15" rx="11" ry="2.2" fill="${DT_INK}" opacity=".14"/>
  <path d="M-7 8 v6 M-2 9 v6 M4 9 v6 M8 8 v6" stroke="#8A5A2E" stroke-width="2.6" stroke-linecap="round"/>
  <ellipse cx="0" cy="5" rx="10" ry="6.5" fill="#E8B878" stroke="#8A5A2E" stroke-width="1.2"/><ellipse cx="1" cy="6.5" rx="6" ry="3.6" fill="#FFF3DF"/>
  <path d="M-10 3 q-6 -2 -6 -7" stroke="#E8B878" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="7" cy="-5" rx="6.6" ry="6" fill="#E8B878" stroke="#8A5A2E" stroke-width="1.2"/><ellipse cx="11.4" cy="-3.4" rx="3.4" ry="2.6" fill="#FFF3DF"/><circle cx="13.6" cy="-4.2" r="1.3" fill="${DT_INK}"/>
  <path d="M2 -7 q-4 3 -2 9 q3 -1 4 -6 z" fill="#8A5A2E"/><circle cx="8.6" cy="-6.6" r="1.1" fill="${DT_INK}"/>
  <path d="M1 -9.5 q6 -7 13 -1 q-6 -1.6 -13 1 z" fill="#7A5C3E" stroke="#5A3E26" stroke-width=".8"/><path d="M2 -10 q5 -4 10 -0.6" stroke="#C9A06A" stroke-width="1" fill="none"/>
  <g class="dt-mag"><circle cx="17" cy="4" r="4" fill="#CDEBFB" fill-opacity=".7" stroke="#5A3E26" stroke-width="1.6"/><path d="M14 7 l-4 4" stroke="#5A3E26" stroke-width="2" stroke-linecap="round"/></g></g>`;
const dtQ = (r = 8, c = '#FFC34D') => `<g><circle r="${r}" fill="#fff" stroke="${c}" stroke-width="${r / 4}"/><text y="${r * .42}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${r * 1.25}" fill="${c}">?</text></g>`;
Object.assign(SCENERY, {
  dtlamp: `<ellipse cx="32" cy="61" rx="10" ry="2" fill="${DT_INK}" opacity=".14"/><circle class="dt-glow" cx="32" cy="14" r="14" fill="#FFE27A" opacity=".35"/><path d="M32 60 V18" stroke="#3B3A55" stroke-width="3.2"/><path d="M26 60 h12" stroke="#3B3A55" stroke-width="3" stroke-linecap="round"/><path d="M24 20 h16 l-3 -10 h-10 z" fill="#FFE9A6" stroke="#3B3A55" stroke-width="2" stroke-linejoin="round"/><path d="M26 10 h12 l-6 -5 z" fill="#3B3A55"/><path d="M32 28 q6 0 8 5" stroke="#3B3A55" stroke-width="2" fill="none"/>`,
  dthouse: `<ellipse cx="32" cy="61" rx="26" ry="2.6" fill="${DT_INK}" opacity=".12"/><rect x="10" y="22" width="44" height="38" fill="#C96A4E" stroke="#8E4632" stroke-width="1.6"/><g stroke="#B0573E" stroke-width="1"><path d="M10 30 H54 M10 38 H54 M10 46 H54 M10 54 H54"/><path d="M20 22 V30 M36 22 V30 M28 30 V38 M44 30 V38 M20 38 V46 M36 38 V46 M28 46 V54 M44 46 V54"/></g><path d="M6 24 L32 6 L58 24 Z" fill="#4A4470" stroke="#2F2A55" stroke-width="1.6" stroke-linejoin="round"/><rect x="40" y="8" width="6" height="10" fill="#4A4470"/><rect x="15" y="32" width="10" height="10" rx="1.5" fill="#FFE27A" stroke="#5A3E26" stroke-width="1.4"/><rect x="39" y="32" width="10" height="10" rx="1.5" fill="#FFE27A" stroke="#5A3E26" stroke-width="1.4"/><path d="M20 32 V42 M15 37 H25 M44 32 V42 M39 37 H49" stroke="#5A3E26" stroke-width="1"/><rect x="27" y="44" width="10" height="16" rx="1.5" fill="#5A3E26"/><circle cx="35" cy="52" r="1" fill="#FFE27A"/>`,
  dtoffice: `<ellipse cx="32" cy="61" rx="27" ry="2.6" fill="${DT_INK}" opacity=".12"/><rect x="8" y="18" width="48" height="42" fill="#7A8CB8" stroke="#4A5A88" stroke-width="1.6"/><path d="M5 18 H59 L54 10 H10 Z" fill="#4A4470" stroke="#2F2A55" stroke-width="1.6" stroke-linejoin="round"/><rect x="14" y="22" width="36" height="10" rx="2" fill="#FFF6D6" stroke="#4A5A88" stroke-width="1.2"/><text x="32" y="30" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="8" fill="${DT_INK}">DATA ?</text><rect x="13" y="36" width="11" height="10" rx="1.5" fill="#FFE27A" stroke="#4A5A88" stroke-width="1.2"/><rect x="40" y="36" width="11" height="10" rx="1.5" fill="#FFE27A" stroke="#4A5A88" stroke-width="1.2"/><rect x="26" y="40" width="12" height="20" rx="2" fill="#4A3A5E"/><circle cx="35" cy="50" r="1.1" fill="#FFE27A"/>`,
  dtboard: `<ellipse cx="32" cy="61" rx="20" ry="2.2" fill="${DT_INK}" opacity=".12"/><path d="M18 60 l4 -16 M46 60 l-4 -16" stroke="#8A5A2E" stroke-width="2.6" stroke-linecap="round"/><rect x="8" y="10" width="48" height="36" rx="3" fill="#D9A866" stroke="#8A5A2E" stroke-width="2"/><rect x="13" y="15" width="17" height="14" fill="#fff" stroke="#C9B48A" stroke-width=".8" transform="rotate(-4 21 22)"/><g transform="rotate(-4 21 22)" fill="#5BB5E6"><rect x="15" y="22" width="3" height="5"/><rect x="19" y="19" width="3" height="8"/><rect x="23" y="21" width="3" height="6"/></g><rect x="34" y="14" width="17" height="13" fill="#fff" stroke="#C9B48A" stroke-width=".8" transform="rotate(5 42 20)"/><g transform="rotate(5 42 20)" fill="#E36A8C"><circle cx="37" cy="23" r="1.4"/><circle cx="41" cy="23" r="1.4"/><circle cx="41" cy="20" r="1.4"/><circle cx="45" cy="23" r="1.4"/></g><rect x="22" y="31" width="20" height="12" fill="#FFF6D6" stroke="#C9B48A" stroke-width=".8"/><path d="M25 35 h14 M25 38 h10" stroke="#9A93C4" stroke-width="1.2"/><path d="M21 17 L42 18 L32 33" stroke="#E0445A" stroke-width="1" fill="none"/><circle cx="21" cy="17" r="1.6" fill="#E0445A"/><circle cx="42" cy="18" r="1.6" fill="#E0445A"/><circle cx="32" cy="33" r="1.6" fill="#E0445A"/>`,
  dtdog: `<g transform="translate(30 34) scale(1.7)">${DT_DOG}</g>`,
  dtprints: `${[[14, 54, -20], [24, 44, -10], [34, 52, -20], [44, 40, -10], [52, 48, -20]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})" fill="#8A7A9A" opacity=".55"><ellipse cx="0" cy="0" rx="2.6" ry="3.4"/><circle cx="-2.6" cy="-4.4" r="1"/><circle cx="0" cy="-5.2" r="1"/><circle cx="2.6" cy="-4.4" r="1"/></g>`).join('')}`,
  dtmagnify: `<ellipse cx="32" cy="58" rx="18" ry="2.6" fill="${DT_INK}" opacity=".12"/><path d="M40 40 L54 54" stroke="#5A3E26" stroke-width="6" stroke-linecap="round"/><circle cx="30" cy="30" r="14" fill="#CDEBFB" fill-opacity=".75" stroke="#B5862E" stroke-width="4"/><path d="M22 24 q4 -6 10 -6" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  dtbox: `<ellipse cx="32" cy="60" rx="20" ry="2.4" fill="${DT_INK}" opacity=".12"/><path d="M12 30 L32 22 L52 30 V54 L32 62 L12 54 Z" fill="#D9A866" stroke="#8A5A2E" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 30 L32 38 L52 30 M32 38 V62" stroke="#8A5A2E" stroke-width="1.4" fill="none"/><g transform="translate(22 46) rotate(-6)">${dtQ(6, '#E36A8C')}</g>`,
  dtbook: `<ellipse cx="32" cy="58" rx="20" ry="2.4" fill="${DT_INK}" opacity=".12"/><rect x="12" y="40" width="40" height="8" rx="1.5" fill="#5BB5E6" stroke="#2F7FB0" stroke-width="1.2"/><rect x="15" y="31" width="36" height="9" rx="1.5" fill="#E36A8C" stroke="#B5466A" stroke-width="1.2"/><rect x="10" y="48" width="44" height="9" rx="1.5" fill="#FFC34D" stroke="#D99A12" stroke-width="1.2"/><path d="M18 35 h24 M16 44 h28 M14 52 h32" stroke="#fff" stroke-width="1.2" opacity=".7"/><g transform="translate(46 22)">${dtQ(7)}</g>`,
  dthydrant: `<ellipse cx="32" cy="60" rx="12" ry="2.2" fill="${DT_INK}" opacity=".14"/><rect x="24" y="26" width="16" height="32" rx="3" fill="#E0445A" stroke="#A82A3E" stroke-width="1.6"/><path d="M22 26 h20 v-4 q-10 -10 -20 0 z" fill="#E0445A" stroke="#A82A3E" stroke-width="1.6"/><rect x="18" y="34" width="6" height="7" rx="1.5" fill="#C23A50"/><rect x="40" y="34" width="6" height="7" rx="1.5" fill="#C23A50"/><rect x="22" y="54" width="20" height="5" rx="1.5" fill="#A82A3E"/><path d="M28 30 v20" stroke="#fff" stroke-width="2" opacity=".35"/>`,
  dtclock: `<ellipse cx="32" cy="61" rx="18" ry="2.4" fill="${DT_INK}" opacity=".12"/><rect x="20" y="18" width="24" height="42" fill="#B8A47E" stroke="#7A6A4A" stroke-width="1.6"/><path d="M17 18 L32 2 L47 18 Z" fill="#4A4470" stroke="#2F2A55" stroke-width="1.6" stroke-linejoin="round"/><circle cx="32" cy="28" r="8" fill="#FFF6D6" stroke="#7A6A4A" stroke-width="1.6"/><path d="M32 28 V23 M32 28 h4" stroke="${DT_INK}" stroke-width="1.6" stroke-linecap="round"/><rect x="27" y="44" width="10" height="16" rx="5" fill="#5A4A3A"/>`,
  dtbench: `<ellipse cx="32" cy="60" rx="24" ry="2.2" fill="${DT_INK}" opacity=".12"/><rect x="10" y="34" width="44" height="5" rx="1.5" fill="#C98A4E" stroke="#8A5A2E" stroke-width="1.2"/><rect x="10" y="26" width="44" height="5" rx="1.5" fill="#C98A4E" stroke="#8A5A2E" stroke-width="1.2"/><path d="M14 39 v19 M50 39 v19 M14 26 v13 M50 26 v13" stroke="#3B3A55" stroke-width="2.6" stroke-linecap="round"/><g transform="translate(36 30) scale(.7)">${dtQ(7, '#7C5CE0')}</g>`
});
/* small things placed between two levels on the cobblestone street */
const DT_PATH = ['dtprints', 'dtmagnify', 'dtbox', 'dtdog', 'dtprints', 'dthydrant'];

/* the screen background behind every ม.2 page: dusk sky with a moon, an old-town skyline with lit windows, a lamp-lit street */
function dtWorldBG() {
  let b = `<defs><linearGradient id="dt-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E86D8"/><stop offset=".45" stop-color="#C9B6EC"/><stop offset=".8" stop-color="#FFD6B8"/><stop offset="1" stop-color="#FFE9C9"/></linearGradient>
    <radialGradient id="dt-lampG"><stop offset="0" stop-color="#FFE27A" stop-opacity=".7"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient></defs>`;
  b += `<rect width="1600" height="1000" fill="url(#dt-sky)"/>`;
  b += `<circle cx="1320" cy="150" r="58" fill="#FFF6D6"/><circle cx="1342" cy="138" r="54" fill="#C9B6EC" opacity=".55"/><circle cx="1320" cy="150" r="120" fill="#FFF6D6" opacity=".18"/>`;
  for (let i = 0; i < 16; i++) b += `<circle class="dt-twk" style="animation-delay:-${(i * .7) % 4}s" cx="${(i * 97 + 40) % 1600}" cy="${30 + (i * 53) % 220}" r="${1.4 + i % 3}" fill="#fff" opacity=".8"/>`;
  /* far skyline */
  let s = ''; for (let x = -20, i = 0; x < 1620; i++) { const w = 70 + (i * 37) % 60, hh = 120 + (i * 53) % 140; s += `<rect x="${x}" y="${520 - hh}" width="${w}" height="${hh + 30}" fill="#7468B0"/>`; if (i % 3 === 0) s += `<path d="M${x} ${520 - hh} l${w / 2} -30 l${w / 2} 30 z" fill="#7468B0"/>`; for (let r = 0; r < hh / 34 - 1; r++) for (let c = 0; c < w / 26 - 1; c++) if ((i + r * 3 + c) % 3) s += `<rect x="${x + 10 + c * 24}" y="${520 - hh + 16 + r * 32}" width="10" height="14" rx="1.5" fill="#FFE27A" opacity="${.5 + ((i + r + c) % 3) * .15}"/>`; x += w + 4; }
  b += `<g opacity=".8">${s}</g>`;
  b += `<g transform="translate(700 250) scale(4)">${SCENERY.dtclock}</g>`;
  /* near street */
  b += `<rect x="0" y="540" width="1600" height="460" fill="#B8A47E"/><rect x="0" y="540" width="1600" height="26" fill="#8E7C5A"/>`;
  let cob = ''; for (let r = 0; r < 9; r++) for (let c = 0; c < 22; c++) { const x = c * 76 + (r % 2) * 38 - 20, y = 580 + r * 46; cob += `<rect x="${x}" y="${y}" width="68" height="38" rx="12" fill="${(r + c) % 3 ? '#C9B590' : '#D6C49E'}" stroke="#A8946E" stroke-width="2"/>`; }
  b += `<g opacity=".9">${cob}</g>`;
  [[140, 470, 'dthouse', 3.2], [1440, 470, 'dthouse', 3], [380, 520, 'dtoffice', 2.6], [1080, 520, 'dtboard', 2.4]].forEach(([x, y, k, sc]) => { b += `<g transform="translate(${x - 32 * sc} ${y - 60 * sc}) scale(${sc})">${SCENERY[k]}</g>`; });
  [[60, 600], [560, 600], [960, 600], [1530, 600]].forEach(([x, y]) => { b += `<circle cx="${x}" cy="${y - 150}" r="90" fill="url(#dt-lampG)"/><g transform="translate(${x - 64} ${y - 200}) scale(2)">${SCENERY.dtlamp}</g>`; });
  [[820, 880, 'dtprints', 2.4], [1240, 800, 'dtbox', 2], [300, 860, 'dtbench', 2.2]].forEach(([x, y, k, sc]) => { b += `<g transform="translate(${x - 32 * sc} ${y - 32 * sc}) scale(${sc})">${SCENERY[k]}</g>`; });
  return b;
}

/* moving things: the detective dog sniffing back and forth along the street, floating "?" clues, lamp glow */
function dtLife(W, H, bg, R) {
  let o = '';
  const spots = bg ? [[300, 930, 2.6, 160], [1180, 960, 2.2, -140]] : [[W * .22, H * .3, 1.5, 60], [W * .76, H * .68, 1.5, -60]];
  spots.forEach(([x, y, k, d], i) => { o += `<g transform="translate(${x} ${y}) scale(${k})"><g class="dt-walk" style="--sd:${d / k}px;animation-duration:${R(i + 7, 7, 10)}s;animation-delay:-${R(i + 9, 0, 6)}s">${DT_DOG}</g></g>`; });
  for (let i = 0; i < (bg ? 9 : 5); i++) { const x = R(i + 60, 30, W - 30), y = bg ? R(i + 70, 300, 700) : R(i + 70, 40, H - 40), d = R(i + 80, 5, 9);
    o += `<g transform="translate(${x} ${y})"><g class="dt-float" style="animation-duration:${d}s;animation-delay:-${R(i + 90, 0, d)}s;opacity:.75">${dtQ(bg ? R(i + 5, 8, 13) : 7, ['#FFC34D', '#E36A8C', '#7C5CE0', '#2FB5A3'][i % 4])}</g></g>`; }
  return o;
}

/* ---------- the owl-thief boss (bossSVG kind 'owlthief'): an owl in a black eye mask and a striped shirt, holding a sack of stolen data ---------- */
function dtOwlSVG(state, pal, emblem = '?') {
  const ink = DT_INK, f1 = '#9A7BC8', f2 = '#7A5CA8', f3 = '#4E3A78', open = state === 'roar' || state === 'laugh' || state === 'flex';
  const eye = x => state === 'down' ? `<path d="M${x - 5} 38 l10 10 M${x + 5} 38 l-10 10" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`
    : state === 'sleepy' || state === 'hit' ? `<path d="M${x - 6} 44 q6 4 12 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<circle cx="${x}" cy="43" r="7.5" fill="#FFF6D6"/><circle cx="${x + 1}" cy="43" r="4" fill="${ink}"/><circle cx="${x + 2.4}" cy="41.4" r="1.4" fill="#fff"/>`;
  const beak = open ? `<path d="M55 53 l5 12 l5 -12 z" fill="#FFB534" stroke="#C9801A" stroke-width="1.4" stroke-linejoin="round"/><path d="M56.5 56 l3.5 6 l3.5 -6 z" fill="#C2405A"/>` : `<path d="M55 52 l5 9 l5 -9 z" fill="#FFB534" stroke="#C9801A" stroke-width="1.4" stroke-linejoin="round"/>`;
  const brow = state === 'roar' || state === 'flex' ? `<path d="M40 30 l12 6 M80 30 l-12 6" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>` : '';
  const extra = state === 'down' ? '<g class="b-stars"><path d="M92 14 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z M104 30 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z" fill="#F5B52E"/></g>'
    : state === 'roar' ? `<g class="b-roar" stroke="#7C5CE0" stroke-width="3" stroke-linecap="round" opacity=".85"><path d="M100 46 l7 -3 M102 56 h7 M100 66 l7 3"/></g>`
      : state === 'sleepy' ? `<text x="92" y="28" font-family="Nunito,sans-serif" font-weight="900" font-size="14" fill="#7C5CE0">z</text><text x="102" y="16" font-family="Nunito,sans-serif" font-weight="900" font-size="10" fill="#7C5CE0">z</text>` : '';
  return `<svg viewBox="0 0 120 130" class="boss-svg owlthief" aria-hidden="true">
  <defs><linearGradient id="dt-fea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f1}"/><stop offset="1" stop-color="${f2}"/></linearGradient></defs>
  <ellipse class="b-shadow" cx="60" cy="124" rx="38" ry="5" fill="${ink}" opacity=".14"/>
  <g class="b-body">
    ${state === 'flex' ? `<circle cx="60" cy="70" r="56" fill="url(#g-glow)" opacity=".7"/>` : ''}
    <g class="dt-sack"><path d="M86 84 q16 -4 22 14 q4 18 -12 22 q-18 2 -20 -14 q-2 -14 10 -22 z" fill="#C9A06A" stroke="#8A5A2E" stroke-width="2"/><path d="M88 84 q6 -6 12 -2" stroke="#8A5A2E" stroke-width="2.4" fill="none"/><text x="97" y="110" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="11" fill="#5A3E26">123</text></g>
    <path d="M44 114 l-6 8 h10 z M76 114 l6 8 h-10 z" fill="#FFB534" stroke="#C9801A" stroke-width="1.4" stroke-linejoin="round"/>
    <ellipse cx="60" cy="86" rx="30" ry="30" fill="url(#dt-fea)" stroke="${f3}" stroke-width="2.2"/>
    <g clip-path="url(#dt-belly)"><ellipse cx="60" cy="94" rx="19" ry="20" fill="#fff"/><path d="M40 82 H80 M40 90 H80 M40 98 H80 M40 106 H80" stroke="#2B2550" stroke-width="3.4"/></g>
    <clipPath id="dt-belly"><ellipse cx="60" cy="94" rx="19" ry="20"/></clipPath>
    <path class="b-arm" d="M31 78 q-12 10 -8 24 q8 0 12 -10 M89 78 q10 4 4 14" fill="url(#dt-fea)" stroke="${f3}" stroke-width="2" stroke-linejoin="round"/>
    <g class="dt-head">
      <path d="M34 26 L30 8 L46 20 Z M86 26 L90 8 L74 20 Z" fill="url(#dt-fea)" stroke="${f3}" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="60" cy="42" rx="30" ry="25" fill="url(#dt-fea)" stroke="${f3}" stroke-width="2.2"/>
      <path d="M36 36 q24 -10 48 0 q2 10 -4 14 q-10 -4 -20 0 q-10 -4 -20 0 q-6 -4 -4 -14 z" fill="#2B2550"/>
      <path d="M33 38 l-8 -4 M87 38 l8 -4" stroke="#2B2550" stroke-width="3" stroke-linecap="round"/>
      ${eye(48)}${eye(72)}${brow}${beak}
      <path d="M38 22 q22 -14 44 0 l-2 4 q-20 -10 -40 0 z" fill="#4A4470" stroke="#2F2A55" stroke-width="1.4"/>
    </g>
    <circle cx="60" cy="72" r="9" fill="#FFF6D6" stroke="#C9B48A" stroke-width="1.6"/><text x="60" y="${String(emblem).length > 1 ? 75 : 76.5}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 1 ? 8 : 11}" fill="${ink}">${emblem}</text>
    ${state !== 'flex' ? extra : ''}
  </g>
</svg>`;
}
