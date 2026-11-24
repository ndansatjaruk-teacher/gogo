/* =========================================================
   POLAR WORLD (ม.3) — "ขั้วโลกหิมะ": the level path is an icy trail across snow fields
   (igloos, icebergs, penguins, seals, ice-fishing holes, aurora sky). Pieces: scenery (64×64),
   the screen background, the life layer (sliding penguins, falling snow) and the polar-bear
   boss (bossSVG kind 'pbear'). Prefix pl.
   ========================================================= */
const PL_INK = '#2B2550';
/* a small penguin centred on (0,0), about 26 tall */
const PL_PENG = `<g class="pl-peng"><ellipse cx="0" cy="13" rx="8" ry="2" fill="${PL_INK}" opacity=".12"/><path d="M-5 11 l-4 2 h6 z M5 11 l4 2 h-6 z" fill="#FF9A3C"/><ellipse cx="0" cy="0" rx="8.5" ry="12" fill="#263248"/><ellipse cx="0" cy="3" rx="5.8" ry="8.6" fill="#fff"/><path d="M-8 -2 q-5 6 -3 11 q3 -2 4 -6 z M8 -2 q5 6 3 11 q-3 -2 -4 -6 z" fill="#263248"/><circle cx="-2.6" cy="-5.5" r="1.5" fill="#fff"/><circle cx="2.6" cy="-5.5" r="1.5" fill="#fff"/><circle cx="-2.4" cy="-5.3" r=".8" fill="${PL_INK}"/><circle cx="2.8" cy="-5.3" r=".8" fill="${PL_INK}"/><path d="M-2 -2.6 h4 l-2 3 z" fill="#FF9A3C"/><ellipse cx="-4.4" cy="-1.6" rx="1.4" ry=".9" fill="#FF9AA6" opacity=".8"/><ellipse cx="4.4" cy="-1.6" rx="1.4" ry=".9" fill="#FF9AA6" opacity=".8"/></g>`;
/* the same penguin sliding on its belly */
const PL_SLIDE = `<g transform="rotate(-78)"><g transform="scale(.9)">${PL_PENG}</g></g><path d="M-16 6 h-14 M-14 0 h-10" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>`;
const plFlake = (r = 4, c = '#fff') => `<g stroke="${c}" stroke-width="${r / 3.2}" stroke-linecap="round">${[0, 60, 120].map(a => `<path d="M0 ${-r} V${r}" transform="rotate(${a})"/>`).join('')}</g>`;
Object.assign(SCENERY, {
  igloo: `<ellipse cx="32" cy="58" rx="27" ry="4" fill="${PL_INK}" opacity=".1"/><path d="M6 58 A26 26 0 0 1 58 58 Z" fill="#F7FBFF" stroke="#9CCBEA" stroke-width="1.8"/><g stroke="#B9DCF2" stroke-width="1.3" fill="none"><path d="M9 48 H55 M14 38 H50 M22 29 H42"/><path d="M20 48 V58 M34 48 V58 M46 48 V58 M16 38 V48 M28 38 V48 M40 38 V48 M50 38 V47 M24 29 V38 M34 29 V38 M44 30 V38"/></g><path d="M38 58 V49 a8 8 0 0 1 16 0 V58 Z" fill="#E4F2FC" stroke="#9CCBEA" stroke-width="1.6"/><path d="M41 58 V50 a5 5 0 0 1 10 0 V58 Z" fill="#3D5A80"/>`,
  iceberg: `<path d="M2 54 H62" stroke="#8FC3E6" stroke-width="2" opacity=".7"/><path d="M8 54 L18 30 L26 36 L34 12 L44 30 L50 26 L58 54 Z" fill="#F4FAFF" stroke="#8FC3E6" stroke-width="1.8" stroke-linejoin="round"/><path d="M34 12 L30 54 M44 30 L40 54 M18 30 L22 54" stroke="#CDE7F7" stroke-width="2.4"/><path d="M8 54 L14 60 H52 L58 54 Z" fill="#BFE3F7" opacity=".7"/>`,
  plpeng: `<g transform="translate(32 34) scale(1.9)">${PL_PENG}</g>`,
  plpengs: `<g transform="translate(22 36) scale(1.6)">${PL_PENG}</g><g transform="translate(44 40) scale(1.25)">${PL_PENG}</g>`,
  snowman: `<ellipse cx="32" cy="61" rx="16" ry="2.6" fill="${PL_INK}" opacity=".1"/><circle cx="32" cy="48" r="13" fill="#fff" stroke="#B9DCF2" stroke-width="1.6"/><circle cx="32" cy="26" r="9.5" fill="#fff" stroke="#B9DCF2" stroke-width="1.6"/><path d="M23 34 q9 5 18 0 l1 4 q-10 4 -20 0 z M37 36 l3 10 l4 -1 l-3 -9 z" fill="#E36A8C"/><rect x="25" y="9" width="14" height="9" rx="2" fill="#3D5A80"/><rect x="21" y="16" width="22" height="3" rx="1.5" fill="#3D5A80"/><circle cx="29" cy="24" r="1.4" fill="${PL_INK}"/><circle cx="35" cy="24" r="1.4" fill="${PL_INK}"/><path d="M32 27 l7 2 l-7 1 z" fill="#FF9A3C"/><circle cx="32" cy="44" r="1.4" fill="${PL_INK}"/><circle cx="32" cy="50" r="1.4" fill="${PL_INK}"/><path d="M20 40 l-10 -6 M44 40 l10 -6" stroke="#8B5A2B" stroke-width="2" stroke-linecap="round"/>`,
  sled: `<ellipse cx="32" cy="58" rx="22" ry="2.4" fill="${PL_INK}" opacity=".1"/><path d="M8 54 H52 q8 0 8 -7" stroke="#B5462F" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M16 54 V46 M44 54 V46" stroke="#B5462F" stroke-width="2.6"/><rect x="10" y="40" width="42" height="7" rx="2.5" fill="#E0A35C" stroke="#A86A2A" stroke-width="1.4"/><path d="M20 40 V47 M30 40 V47 M40 40 V47" stroke="#A86A2A" stroke-width="1"/><rect x="18" y="30" width="18" height="10" rx="3" fill="#6EC3EC" stroke="#3D8FC2" stroke-width="1.2"/><rect x="34" y="33" width="12" height="7" rx="2" fill="#FFC34D" stroke="#D99A12" stroke-width="1.2"/>`,
  plflag: `<path d="M10 60 Q32 42 54 60 Z" fill="#fff" stroke="#B9DCF2" stroke-width="1.6"/><path d="M32 50 V10" stroke="#5A6A8A" stroke-width="2.6" stroke-linecap="round"/><path class="pl-flag" d="M33 11 h20 l-5 7 l5 7 h-20 z" fill="#E36A8C" stroke="#B5466A" stroke-width="1.2" stroke-linejoin="round"/>`,
  snowpile: `<path d="M4 58 Q14 40 26 50 Q34 36 46 48 Q54 42 60 58 Z" fill="#fff" stroke="#B9DCF2" stroke-width="1.6"/><circle cx="20" cy="50" r="1.6" fill="#CDE7F7"/><circle cx="40" cy="48" r="1.6" fill="#CDE7F7"/>`,
  icecrys: `<ellipse cx="32" cy="60" rx="16" ry="2.4" fill="${PL_INK}" opacity=".1"/>${[[22, 60, 10, 30, -14], [32, 60, 12, 40, 0], [42, 60, 9, 28, 14]].map(([x, y, w, hh, a]) => `<path d="M${x} ${y} l${-w / 2} -8 l${w / 2} ${-hh} l${w / 2} ${hh} z" transform="rotate(${a} ${x} ${y})" fill="#CDEBFB" stroke="#6FB4E0" stroke-width="1.4" stroke-linejoin="round"/><path d="M${x} ${y} V${y - hh - 8}" transform="rotate(${a} ${x} ${y})" stroke="#fff" stroke-width="1.6" opacity=".8"/>`).join('')}`,
  seal: `<ellipse cx="32" cy="56" rx="28" ry="6" fill="#DCEFFB" stroke="#9CCBEA" stroke-width="1.4"/><path d="M12 52 Q14 38 30 38 Q44 36 50 44 Q56 50 52 54 Q36 56 12 52 Z" fill="#C9CFDB" stroke="#8C93A8" stroke-width="1.4"/><path d="M12 52 l-6 -4 l1 6 z" fill="#A9B0C2"/><path d="M30 52 q4 -4 8 0" stroke="#8C93A8" stroke-width="1.4" fill="none"/><circle cx="46" cy="42" r="1.6" fill="${PL_INK}"/><circle cx="52" cy="46" r="1.4" fill="${PL_INK}"/><path d="M48 47 l8 -1 M48 48 l7 2" stroke="#8C93A8" stroke-width=".8"/>`,
  fishhole: `<ellipse cx="32" cy="50" rx="26" ry="10" fill="#F4FAFF" stroke="#B9DCF2" stroke-width="1.6"/><ellipse cx="32" cy="50" rx="13" ry="5.6" fill="#3D8FC2"/><ellipse cx="32" cy="49" rx="10" ry="3.6" fill="#5BB5E6"/><g class="pl-fish"><path d="M26 40 q6 -8 12 0 q-6 6 -12 0 z M38 40 l5 -4 v8 z" fill="#FFB534" stroke="#D98A12" stroke-width="1"/><circle cx="29" cy="39" r=".9" fill="${PL_INK}"/></g>`
});
/* small things placed between two levels on the ice trail */
const PL_PATH = ['fishhole', 'plpeng', 'icecrys', 'seal', 'plpengs'];

/* the screen background behind every ม.3 page: winter sky with a soft aurora, icebergs on a frozen sea, snow fields */
function plWorldBG() {
  let b = `<defs><linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0F7"/><stop offset=".55" stop-color="#E6F3FC"/><stop offset="1" stop-color="#F6FBFF"/></linearGradient>
    <linearGradient id="pl-au" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7FE3C4" stop-opacity="0"/><stop offset=".3" stop-color="#7FE3C4" stop-opacity=".55"/><stop offset=".65" stop-color="#B9A6FF" stop-opacity=".45"/><stop offset="1" stop-color="#FFB0D0" stop-opacity="0"/></linearGradient>
    <linearGradient id="pl-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CD3F2"/><stop offset="1" stop-color="#CDEBFB"/></linearGradient></defs>`;
  b += `<rect width="1600" height="1000" fill="url(#pl-sky)"/>`;
  b += `<g class="pl-aurora"><path d="M-40 170 Q300 60 640 160 T1300 120 T1660 150 L1660 230 Q1320 190 980 250 T300 230 T-40 260 Z" fill="url(#pl-au)"/><path d="M-40 250 Q360 170 760 250 T1660 220 L1660 270 Q1200 270 820 300 T-40 300 Z" fill="url(#pl-au)" opacity=".6"/></g>`;
  b += `<circle cx="1330" cy="140" r="56" fill="#FFF6D6" opacity=".9"/><circle cx="1330" cy="140" r="110" fill="#FFF6D6" opacity=".25"/>`;
  b += `<rect x="0" y="470" width="1600" height="120" fill="url(#pl-sea)"/>`;
  [[150, 420, 2.4], [560, 440, 1.6], [980, 425, 2.1], [1420, 438, 1.7]].forEach(([x, y, s]) => { b += `<g transform="translate(${x} ${y}) scale(${s})" opacity=".95">${SCENERY.iceberg}</g>`; });
  b += `<path d="M0 560 Q240 520 520 552 T1080 540 T1600 530 V1000 H0 Z" fill="#EEF7FD"/>`;
  b += `<path d="M0 660 Q360 610 760 650 T1340 630 T1600 640 V1000 H0 Z" fill="#F8FCFF"/>`;
  b += `<path d="M0 800 Q420 760 820 790 T1600 770 V1000 H0 Z" fill="#fff"/>`;
  b += `<g opacity=".7" stroke="#CDE7F7" stroke-width="3" fill="none" stroke-linecap="round"><path d="M120 720 q60 -10 120 0 M980 700 q70 -12 140 0 M560 860 q80 -14 160 0 M1300 880 q60 -10 120 0"/></g>`;
  b += `<g transform="translate(1170 520) scale(3.6)">${SCENERY.igloo}</g>`;
  [[180, 610, 'plpengs', 2.6], [420, 640, 'snowman', 2.2], [1460, 620, 'plflag', 2], [820, 600, 'seal', 2]].forEach(([x, y, k, s]) => { b += `<g transform="translate(${x} ${y}) scale(${s})">${SCENERY[k]}</g>`; });
  return b;
}

/* moving things for the polar world: penguins sliding along the snow, falling snowflakes */
function plLife(W, H, bg, R) {
  let o = '';
  /* v232 (ผู้ใช้ขอ): เพนกวินยืนตัวตรง ไถลไปมาบนน้ำแข็ง */
  const spots = bg ? [[260, 905, 2.4, 140], [760, 870, 2, -120], [1300, 930, 2.6, 150]] : [[W * .2, H * .32, 1.4, 60], [W * .78, H * .7, 1.4, -60]];
  spots.forEach(([x, y, k, d], i) => { o += `<g transform="translate(${x} ${y}) scale(${k})"><g class="pl-glide" style="--sd:${d / k}px;animation-duration:${R(i + 7, 5, 8)}s;animation-delay:-${R(i + 9, 0, 5)}s"><ellipse cx="0" cy="13" rx="14" ry="2.4" fill="#BFE3F7" opacity=".8"/>${PL_PENG}</g></g>`; });
  for (let i = 0; i < (bg ? 26 : 12); i++) { const x = R(i + 60, 10, W - 10), d = R(i + 70, 9, 18), dl = R(i + 80, 0, d), r = R(i + 90, 2.4, bg ? 6 : 4.5);
    o += `<g transform="translate(${x} 0)"><g class="pl-fall" style="--fh:${H + 40}px;animation-duration:${d}s;animation-delay:-${dl}s">${i % 3 ? `<circle r="${r * .6}" fill="#fff" opacity=".9"/>` : plFlake(r)}</g></g>`; }
  return o;
}

/* ---------- the polar-bear boss (bossSVG kind 'pbear') ---------- */
function plBearSVG(state, pal, emblem = 'Q') {
  const ink = PL_INK, f1 = '#FFFFFF', f2 = '#EAF2FA', f3 = '#B9CBE0', open = state === 'roar' || state === 'laugh' || state === 'flex';
  const eye = x => state === 'down' ? `<path d="M${x - 4} 42 l8 8 M${x + 4} 42 l-8 8" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`
    : state === 'sleepy' || state === 'hit' ? `<path d="M${x - 5} 47 q5 4 10 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="${x}" cy="46" rx="4.6" ry="5.4" fill="${ink}"/><circle cx="${x + 1.6}" cy="44" r="1.6" fill="#fff"/>`;
  const mouth = open ? `<path d="M52 61 q8 11 16 0 z" fill="#C2405A" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/><path d="M54 61 l2 3 l2 -3 M62 61 l2 3 l2 -3" fill="#fff"/>` : state === 'down' || state === 'hit' ? `<path d="M54 63 q6 -4 12 0" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : `<path d="M60 58 v3 M54 61 q6 5 12 0" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const brow = state === 'roar' || state === 'flex' ? `<path d="M44 36 l10 5 M76 36 l-10 5" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>` : '';
  const extra = state === 'down' ? '<g class="b-stars"><path d="M92 14 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z M104 30 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z" fill="#F5B52E"/></g>'
    : state === 'roar' ? `<g class="b-roar" stroke="#6FB4E0" stroke-width="3" stroke-linecap="round" opacity=".85"><path d="M100 50 l7 -3 M102 60 h7 M100 70 l7 3"/></g>`
      : state === 'sleepy' ? `<text x="92" y="30" font-family="Nunito,sans-serif" font-weight="900" font-size="14" fill="#6FB4E0">z</text><text x="102" y="18" font-family="Nunito,sans-serif" font-weight="900" font-size="10" fill="#6FB4E0">z</text>` : '';
  return `<svg viewBox="0 0 120 130" class="boss-svg pbear" aria-hidden="true">
  <defs><linearGradient id="pl-fur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f1}"/><stop offset="1" stop-color="${f2}"/></linearGradient></defs>
  <ellipse class="b-shadow" cx="60" cy="124" rx="40" ry="5" fill="${ink}" opacity=".14"/>
  <g class="b-body">
    ${state === 'flex' ? `<circle cx="60" cy="70" r="56" fill="url(#g-glow)" opacity=".7"/>` : ''}
    <path d="M34 108 q-2 14 12 14 h8 q4 -8 -2 -14 z M86 108 q2 14 -12 14 h-8 q-4 -8 2 -14 z" fill="url(#pl-fur)" stroke="${f3}" stroke-width="2"/>
    <ellipse cx="60" cy="90" rx="31" ry="27" fill="url(#pl-fur)" stroke="${f3}" stroke-width="2.2"/>
    <ellipse cx="60" cy="96" rx="19" ry="16" fill="#F7FBFF"/>
    <path class="b-arm" d="M32 80 q-14 4 -14 16 q8 4 15 -5 M88 80 q14 4 14 16 q-8 4 -15 -5" fill="url(#pl-fur)" stroke="${f3}" stroke-width="2" stroke-linejoin="round"/>
    <g class="pl-scarf"><path d="M38 66 Q60 76 82 66 L84 74 Q60 84 36 74 Z" fill="#6FB4E0" stroke="#3D8FC2" stroke-width="1.6"/><path d="M42 69 l4 7 M52 72 l3 7 M64 72 l-1 7 M74 70 l-3 7" stroke="#fff" stroke-width="1.6" opacity=".8"/><path class="pl-tail" d="M74 74 l4 18 l8 -2 l-4 -17 z" fill="#6FB4E0" stroke="#3D8FC2" stroke-width="1.4"/></g>
    <g class="pl-head">
      <circle cx="38" cy="28" r="9" fill="url(#pl-fur)" stroke="${f3}" stroke-width="2"/><circle cx="38" cy="28" r="4.4" fill="#F7C6D2"/>
      <circle cx="82" cy="28" r="9" fill="url(#pl-fur)" stroke="${f3}" stroke-width="2"/><circle cx="82" cy="28" r="4.4" fill="#F7C6D2"/>
      <ellipse cx="60" cy="48" rx="25" ry="22" fill="url(#pl-fur)" stroke="${f3}" stroke-width="2.2"/>
      <path d="M44 22 L48 12 L54 20 L60 8 L66 20 L72 12 L76 22 Z" fill="#CDEBFB" stroke="#6FB4E0" stroke-width="1.6" stroke-linejoin="round"/><circle cx="60" cy="15" r="2" fill="#B9A6FF"/>
      <ellipse cx="60" cy="58" rx="11" ry="8.5" fill="#F7FBFF" stroke="${f3}" stroke-width="1.4"/><ellipse cx="60" cy="54" rx="4.6" ry="3.2" fill="${ink}"/>
      <ellipse cx="43" cy="56" rx="4.2" ry="2.8" fill="#FF9AA6" opacity=".7"/><ellipse cx="77" cy="56" rx="4.2" ry="2.8" fill="#FF9AA6" opacity=".7"/>
      ${eye(50)}${eye(70)}${brow}${mouth}
    </g>
    <circle cx="60" cy="98" r="10" fill="#fff" stroke="#CDE7F7" stroke-width="1.6"/><text x="60" y="${String(emblem).length > 1 ? 102 : 103}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 1 ? 9 : 12}" fill="${ink}">${emblem}</text>
    ${state !== 'flex' ? extra : ''}
  </g>
</svg>`;
}
