'use strict';
/* =========================================================
   ART LIBRARY — one consistent asset style for the whole game
   Rules: light from top-left · colour-matched outlines (never
   black) · soft radial gradient fill · white rim highlight ·
   soft contact shadow. All assets use viewBox 0 0 64 64.
   To swap in final art later, replace the entry in ART only.
   ========================================================= */
const PAL = {
  //        light      base       shade      line
  yellow: ['#FFF3B0', '#FFD45C', '#F2AE2E', '#D18E1C'],
  coral: ['#FFC2C6', '#FF7B86', '#E5505E', '#C23C4B'],
  pink: ['#FFE0E7', '#FFB3C4', '#F08AA3', '#D16A86'],
  sky: ['#CFE6FF', '#6FB2F5', '#3F8BDB', '#2B6FBA'],
  mint: ['#C9F3E1', '#4FD1A1', '#26A97B', '#1B8862'],
  green: ['#D8F2B5', '#8CCB52', '#5FA336', '#4A8529'],
  orange: ['#FFD9AE', '#FFA24C', '#EC7F1E', '#C96512'],
  tan: ['#F8E0C2', '#E7B57F', '#C98E55', '#A87140'],
  lilac: ['#ECE8FF', '#C9BEFF', '#9F8FF0', '#7E6ED6'],
  white: ['#FFFFFF', '#F6F3FB', '#DCD6EA', '#B7AFCD'],
  red: ['#FFB2A8', '#F2584A', '#D23B2E', '#AE2E23'],
  cookie: ['#F9DEB4', '#E2A963', '#C4853D', '#A2692C'],
  grey: ['#F1EFF7', '#D7D3E4', '#B6B0CC', '#9790B0'],
  jade: ['#D4F5C4', '#6CCB6A', '#3E9F4A', '#2D7A38'],
  leaf: ['#E2F6C9', '#7FC756', '#4F9E35', '#3B7D27'],
  magenta: ['#F8CDEF', '#DC72CC', '#B0469F', '#8A2F7E'],
  night: ['#9B8BD9', '#5A45A6', '#33246E', '#1E1447']
};
const ART_DEFS_ID = 'art-defs';
function ensureArtDefs() {
  if (document.getElementById(ART_DEFS_ID)) return;
  let g = '';
  for (const [k, [l, b, s]] of Object.entries(PAL)) {
    g += `<radialGradient id="g-${k}" cx="34%" cy="28%" r="78%"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${b}"/><stop offset="1" stop-color="${s}"/></radialGradient>`;
    g += `<linearGradient id="h-${k}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${b}"/><stop offset=".3" stop-color="${l}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${s}"/></linearGradient>`;
    g += `<linearGradient id="l-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${s}"/></linearGradient>`;
  }
  g += `<radialGradient id="g-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFE9A6" stop-opacity=".9"/><stop offset="1" stop-color="#FFE9A6" stop-opacity="0"/></radialGradient>`;
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('id', ART_DEFS_ID); s.setAttribute('width', 0); s.setAttribute('height', 0); s.style.position = 'absolute';
  s.innerHTML = `<defs>${g}</defs>`; document.body.prepend(s);
}
const F = k => `fill="url(#g-${k})" stroke="${PAL[k][3]}" stroke-width="1.6"`;
const SH = (rx = 18, y = 58) => `<ellipse cx="32" cy="${y}" rx="${rx}" ry="3.2" fill="#2B2550" opacity=".12"/>`;
const HI = (x, y, rx = 6, ry = 3.5, r = -30) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="#fff" opacity=".55"/>`;
const EYES = (y = 34, dx = 7, c = '#2B2550') => `<circle cx="${32 - dx}" cy="${y}" r="2.6" fill="${c}"/><circle cx="${32 + dx}" cy="${y}" r="2.6" fill="${c}"/><circle cx="${31 - dx}" cy="${y - 1}" r=".9" fill="#fff"/><circle cx="${31 + dx}" cy="${y - 1}" r=".9" fill="#fff"/>`;
const CHEEKS = (y = 40, dx = 12) => `<ellipse cx="${32 - dx}" cy="${y}" rx="3.2" ry="2" fill="#FF8FA3" opacity=".55"/><ellipse cx="${32 + dx}" cy="${y}" rx="3.2" ry="2" fill="#FF8FA3" opacity=".55"/>`;
const SMILE = (y = 41) => `<path d="M29 ${y} q3 3 6 0" fill="none" stroke="#2B2550" stroke-width="1.6" stroke-linecap="round"/>`;

const ART = {
  /* ---------- animals (round-critter family) ---------- */
  chick: `${SH()}<path d="M30 12 q2-6 5-1 q2-4 4 1" fill="none" stroke="${PAL.yellow[3]}" stroke-width="1.8" stroke-linecap="round"/><circle cx="32" cy="35" r="21" ${F('yellow')}/>${HI(24, 24)}<path d="M12 38 q-5 3 -2 8 q5 -1 6 -5" ${F('yellow')}/><path d="M52 38 q5 3 2 8 q-5 -1 -6 -5" ${F('yellow')}/>${EYES(32)}${CHEEKS(38)}<path d="M28.5 37 l3.5 -2 l3.5 2 l-3.5 4 z" fill="#FF9F43" stroke="#D97A1F" stroke-width="1.1" stroke-linejoin="round"/>`,
  pig: `${SH()}<path d="M15 20 l-1 -9 l9 5 z M49 20 l1 -9 l-9 5 z" ${F('pink')} stroke-linejoin="round"/><circle cx="32" cy="35" r="21" ${F('pink')}/>${HI(24, 24)}${EYES(31, 8)}<ellipse cx="32" cy="40" rx="7.5" ry="5.5" fill="#FF9DB5" stroke="${PAL.pink[3]}" stroke-width="1.3"/><ellipse cx="29.5" cy="40" rx="1.3" ry="1.9" fill="${PAL.pink[3]}"/><ellipse cx="34.5" cy="40" rx="1.3" ry="1.9" fill="${PAL.pink[3]}"/>${CHEEKS(41, 14)}`,
  dog: `${SH()}<circle cx="32" cy="35" r="20" ${F('tan')}/><path d="M13 22 q-6 10 -1 20 q6 -2 7 -12 z M51 22 q6 10 1 20 q-6 -2 -7 -12 z" fill="${PAL.cookie[2]}" stroke="${PAL.cookie[3]}" stroke-width="1.5" stroke-linejoin="round"/>${HI(25, 24)}<ellipse cx="38" cy="27" rx="6" ry="5" fill="${PAL.cookie[1]}" opacity=".7"/>${EYES(33)}<ellipse cx="32" cy="40" rx="3.6" ry="2.6" fill="#2B2550"/>${SMILE(43)}${CHEEKS(41, 13)}`,
  cat: `${SH()}<path d="M15 24 l1 -13 l10 7 z M49 24 l-1 -13 l-10 7 z" ${F('orange')} stroke-linejoin="round"/><path d="M17.5 21 l.6 -6 l4.5 3.5 z M46.5 21 l-.6 -6 l-4.5 3.5 z" fill="#FFC9B0"/><circle cx="32" cy="36" r="20" ${F('orange')}/>${HI(24, 25)}<path d="M28 20 q4 3 8 0" fill="none" stroke="${PAL.orange[3]}" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>${EYES(34)}<path d="M30.5 39 h3 l-1.5 1.8 z" fill="#FF8FA3"/><path d="M29 42 q1.5 1.5 3 0 q1.5 1.5 3 0" fill="none" stroke="#2B2550" stroke-width="1.3" stroke-linecap="round"/><path d="M14 38 h7 M14 42 l7 -1.5 M50 38 h-7 M50 42 l-7 -1.5" stroke="${PAL.orange[3]}" stroke-width="1.1" stroke-linecap="round"/>`,
  rabbit: `${SH()}<ellipse cx="24" cy="15" rx="5" ry="12" ${F('white')}/><ellipse cx="40" cy="15" rx="5" ry="12" ${F('white')}/><ellipse cx="24" cy="16" rx="2.2" ry="8" fill="#FFC7D3"/><ellipse cx="40" cy="16" rx="2.2" ry="8" fill="#FFC7D3"/><circle cx="32" cy="38" r="19" ${F('white')}/>${HI(25, 29)}${EYES(36)}<path d="M30.5 41 h3 l-1.5 1.6 z" fill="#FF8FA3"/>${SMILE(43.5)}${CHEEKS(43, 12)}`,
  frog: `${SH()}<circle cx="22" cy="22" r="8" ${F('green')}/><circle cx="42" cy="22" r="8" ${F('green')}/><ellipse cx="32" cy="38" rx="22" ry="18" ${F('green')}/>${HI(22, 32)}<circle cx="22" cy="21" r="4.6" fill="#fff"/><circle cx="42" cy="21" r="4.6" fill="#fff"/><circle cx="23" cy="21.5" r="2.4" fill="#2B2550"/><circle cx="41" cy="21.5" r="2.4" fill="#2B2550"/><path d="M22 40 q10 8 20 0" fill="none" stroke="${PAL.green[3]}" stroke-width="2" stroke-linecap="round"/>${CHEEKS(38, 15)}`,
  panda: `${SH()}<circle cx="16" cy="19" r="6.5" fill="#3A3458"/><circle cx="48" cy="19" r="6.5" fill="#3A3458"/><circle cx="32" cy="36" r="20" ${F('white')}/>${HI(24, 25)}<ellipse cx="24.5" cy="34" rx="5" ry="6.2" transform="rotate(-25 24.5 34)" fill="#3A3458"/><ellipse cx="39.5" cy="34" rx="5" ry="6.2" transform="rotate(25 39.5 34)" fill="#3A3458"/><circle cx="25" cy="33.5" r="1.9" fill="#fff"/><circle cx="39" cy="33.5" r="1.9" fill="#fff"/><ellipse cx="32" cy="41" rx="3" ry="2" fill="#3A3458"/>${SMILE(44)}`,
  fish: `${SH(20)}<path d="M50 34 l10 -10 q-2 10 0 20 z" ${F('sky')} stroke-linejoin="round"/><ellipse cx="30" cy="34" rx="22" ry="15" ${F('sky')}/>${HI(22, 26, 7, 3.5)}<path d="M30 20 q6 -6 12 1" ${F('sky')}/><path d="M36 28 q-3 6 0 12" fill="none" stroke="${PAL.sky[3]}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/><circle cx="17" cy="31" r="3" fill="#2B2550"/><circle cx="16" cy="30" r="1" fill="#fff"/><path d="M10 38 q3 2 5 0" fill="none" stroke="#2B2550" stroke-width="1.4" stroke-linecap="round"/>`,
  ladybug: `${SH(19)}<circle cx="32" cy="18" r="8" fill="#3A3458"/><circle cx="29" cy="16.5" r="1.6" fill="#fff"/><circle cx="35" cy="16.5" r="1.6" fill="#fff"/><path d="M12 40 a20 20 0 0 1 40 0 a20 15 0 0 1 -40 0 z" ${F('red')}/>${HI(22, 30)}<path d="M32 22 v32" stroke="${PAL.red[3]}" stroke-width="1.6"/><circle cx="23" cy="36" r="3.4" fill="#3A3458"/><circle cx="41" cy="36" r="3.4" fill="#3A3458"/><circle cx="25" cy="46" r="2.8" fill="#3A3458"/><circle cx="39" cy="46" r="2.8" fill="#3A3458"/>`,
  turtle: `${SH(22)}<circle cx="52" cy="38" r="6" ${F('green')}/><circle cx="54" cy="36.5" r="1.4" fill="#2B2550"/><ellipse cx="18" cy="50" rx="5" ry="3.5" ${F('green')}/><ellipse cx="42" cy="50" rx="5" ry="3.5" ${F('green')}/><path d="M8 46 a22 22 0 0 1 44 0 z" ${F('mint')}/>${HI(20, 32, 7, 3.5)}<path d="M30 26 l6 4 v7 l-6 4 l-6 -4 v-7 z" fill="none" stroke="${PAL.mint[3]}" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 40 l6 -3 M46 40 l-6 -3 M30 41 v5" stroke="${PAL.mint[3]}" stroke-width="1.4" stroke-linecap="round"/>`,
  crab: `${SH(22)}<path d="M10 26 q-2 -10 6 -10 q-1 5 3 7 z M54 26 q2 -10 -6 -10 q1 5 -3 7 z" ${F('coral')} stroke-linejoin="round"/><path d="M14 30 l5 6 M50 30 l-5 6 M14 50 l6 -4 M50 50 l-6 -4" stroke="${PAL.coral[3]}" stroke-width="2.4" stroke-linecap="round"/><path d="M26 22 v-6 M38 22 v-6" stroke="${PAL.coral[3]}" stroke-width="1.8"/><circle cx="26" cy="15" r="3.6" fill="#fff" stroke="${PAL.coral[3]}" stroke-width="1.2"/><circle cx="38" cy="15" r="3.6" fill="#fff" stroke="${PAL.coral[3]}" stroke-width="1.2"/><circle cx="26.5" cy="15.5" r="1.8" fill="#2B2550"/><circle cx="37.5" cy="15.5" r="1.8" fill="#2B2550"/><ellipse cx="32" cy="38" rx="17" ry="13" ${F('coral')}/>${HI(25, 31)}${SMILE(40)}`,
  /* ---------- fruits ---------- */
  apple: `${SH(17)}<path d="M32 18 q-2 -7 2 -10" fill="none" stroke="#8A5A33" stroke-width="2.4" stroke-linecap="round"/><path d="M34 13 q8 -6 12 0 q-6 5 -12 0 z" ${F('green')}/><path d="M32 19 c-8 -6 -22 -3 -22 13 c0 14 10 24 16 22 c3 -1 4 -1 6 0 c2 1 3 1 6 0 c6 -2 16 -8 16 -22 c0 -16 -14 -19 -22 -13 z" ${F('red')}/>${HI(21, 27, 5, 7, 20)}`,
  orange: `${SH(18)}<circle cx="32" cy="35" r="20" ${F('orange')}/>${HI(24, 26)}<g fill="${PAL.orange[2]}" opacity=".35"><circle cx="38" cy="40" r=".9"/><circle cx="42" cy="34" r=".9"/><circle cx="35" cy="47" r=".9"/><circle cx="27" cy="44" r=".9"/></g><path d="M32 15 l-2 -4" stroke="#8A5A33" stroke-width="2.2" stroke-linecap="round"/><path d="M32 15 q6 -6 11 -2 q-5 5 -11 2 z" ${F('green')}/>`,
  strawberry: `${SH(15)}<path d="M32 56 c-12 -6 -19 -18 -17 -28 c2 -7 9 -9 17 -7 c8 -2 15 0 17 7 c2 10 -5 22 -17 28 z" ${F('red')}/>${HI(23, 29, 4, 6, 15)}<g fill="#FFE7A3"><ellipse cx="25" cy="34" rx="1" ry="1.5"/><ellipse cx="32" cy="31" rx="1" ry="1.5"/><ellipse cx="39" cy="34" rx="1" ry="1.5"/><ellipse cx="28" cy="42" rx="1" ry="1.5"/><ellipse cx="36" cy="42" rx="1" ry="1.5"/><ellipse cx="32" cy="49" rx="1" ry="1.5"/></g><path d="M20 22 q6 -1 8 -6 q2 4 4 3 q2 1 4 -3 q2 5 8 6 q-8 4 -12 2 q-4 2 -12 -2 z" ${F('green')} stroke-linejoin="round"/>`,
  mango: `${SH(16)}<path d="M40 14 c10 6 14 22 6 34 c-6 9 -20 10 -26 3 c-6 -7 -4 -16 3 -22 c5 -4 6 -10 6 -14 c3 -2 8 -3 11 -1 z" fill="url(#g-orange)" stroke="${PAL.orange[3]}" stroke-width="1.6"/><path d="M40 14 c8 6 11 18 8 28 c-4 -12 -10 -20 -8 -28 z" fill="#FFD45C" opacity=".55"/>${HI(30, 30, 4, 7, 25)}<path d="M38 14 q-1 -5 2 -7" fill="none" stroke="#8A5A33" stroke-width="2.2" stroke-linecap="round"/>`,
  banana: `${SH(20)}<path d="M10 22 c4 22 22 32 44 22 c2 -1 2 -4 -1 -4 c-18 6 -32 -4 -37 -20 c-1 -3 -6 -2 -6 2 z" ${F('yellow')}/><path d="M14 26 c6 14 18 20 34 17" fill="none" stroke="${PAL.yellow[2]}" stroke-width="1.4" stroke-linecap="round" opacity=".8"/><path d="M10 22 l-1 -4 l4 1" fill="#7A5A2E" stroke="#7A5A2E" stroke-width="2" stroke-linejoin="round"/>${HI(20, 30, 3, 6, -40)}`,
  watermelon: `${SH(22)}<path d="M8 28 a24 24 0 0 0 48 0 z" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1.6"/><path d="M12 28 a20 20 0 0 0 40 0 z" fill="#FFF6E8"/><path d="M14 28 a18 18 0 0 0 36 0 z" fill="url(#g-coral)"/><g fill="#3A3458"><ellipse cx="24" cy="35" rx="1.2" ry="2"/><ellipse cx="32" cy="38" rx="1.2" ry="2"/><ellipse cx="40" cy="35" rx="1.2" ry="2"/><ellipse cx="28" cy="31" rx="1.2" ry="2"/><ellipse cx="36" cy="31" rx="1.2" ry="2"/></g>`,
  pear: `${SH(16)}<path d="M32 14 c-6 0 -8 6 -8 12 c0 4 -10 8 -10 18 c0 8 8 12 18 12 c10 0 18 -4 18 -12 c0 -10 -10 -14 -10 -18 c0 -6 -2 -12 -8 -12 z" ${F('green')}/>${HI(23, 38, 4, 7, 20)}<path d="M32 14 q1 -5 3 -7" fill="none" stroke="#8A5A33" stroke-width="2.2" stroke-linecap="round"/><path d="M34 11 q6 -5 10 -1 q-5 4 -10 1 z" ${F('mint')}/>`,
  lemon: `${SH(18)}<path d="M10 34 c0 -10 10 -18 22 -18 c12 0 22 8 22 18 c0 10 -10 18 -22 18 c-12 0 -22 -8 -22 -18 z" ${F('yellow')}/><path d="M8 34 l3 -1 M56 34 l-3 1" stroke="${PAL.yellow[3]}" stroke-width="3" stroke-linecap="round"/>${HI(22, 27)}`,
  /* ---------- things ---------- */
  star: `${SH(15)}<path d="M32 7 l7.4 15.2 l16.6 2.4 l-12 11.8 l2.8 16.6 l-14.8 -7.8 l-14.8 7.8 l2.8 -16.6 l-12 -11.8 l16.6 -2.4 z" ${F('yellow')} stroke-linejoin="round"/>${HI(26, 22, 4, 2.5)}`,
  balloon: `<path d="M32 46 q-4 6 2 10 q4 3 0 6" fill="none" stroke="#9A95B5" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="32" cy="26" rx="16" ry="19" ${F('coral')}/><path d="M29 45 h6 l-3 -3 z" fill="${PAL.coral[2]}" stroke="${PAL.coral[3]}" stroke-width="1.2" stroke-linejoin="round"/>${HI(25, 17, 4, 6, 25)}`,
  ball: `${SH(17)}<circle cx="32" cy="34" r="20" ${F('white')}/><path d="M32 14 a20 20 0 0 1 17 10 q-9 6 -17 0 q-8 6 -17 0 a20 20 0 0 1 17 -10 z" fill="url(#g-coral)"/><path d="M15 44 q8 -6 17 0 q9 -6 17 0 a20 20 0 0 1 -34 0 z" fill="url(#g-sky)"/><circle cx="32" cy="34" r="20" fill="none" stroke="${PAL.white[3]}" stroke-width="1.6"/>${HI(24, 24)}`,
  cookie: `${SH(19)}<circle cx="32" cy="34" r="20" ${F('cookie')}/>${HI(24, 25, 5, 3)}<g fill="#6B4223"><ellipse cx="25" cy="30" rx="2.6" ry="2"/><ellipse cx="37" cy="27" rx="2.2" ry="1.8"/><ellipse cx="40" cy="38" rx="2.6" ry="2"/><ellipse cx="29" cy="41" rx="2.2" ry="1.8"/><ellipse cx="33" cy="34" rx="1.5" ry="1.2"/></g>`,
  cupcake: `${SH(15)}<path d="M18 36 h28 l-4 20 h-20 z" fill="url(#l-sky)" stroke="${PAL.sky[3]}" stroke-width="1.6" stroke-linejoin="round"/><path d="M24 38 l2 17 M32 38 v17 M40 38 l-2 17" stroke="${PAL.sky[3]}" stroke-width="1.2" opacity=".6"/><path d="M16 37 c-3 -8 4 -12 8 -11 c0 -8 16 -8 16 0 c4 -1 11 3 8 11 z" ${F('pink')}/>${HI(24, 28, 4, 2.5)}<circle cx="32" cy="16" r="4" ${F('red')}/>`,
  flower: `${SH(14)}<path d="M32 40 v16" stroke="#5FA336" stroke-width="2.6" stroke-linecap="round"/><path d="M32 50 q-8 -6 -12 0 q6 4 12 0 z" ${F('green')}/><g ${F('pink')}><circle cx="32" cy="15" r="7"/><circle cx="43" cy="23" r="7"/><circle cx="39" cy="36" r="7"/><circle cx="25" cy="36" r="7"/><circle cx="21" cy="23" r="7"/></g><circle cx="32" cy="27" r="6" ${F('yellow')}/>`,
  pencil: `${SH(18)}<g transform="rotate(-35 32 32)"><rect x="25" y="8" width="14" height="38" rx="2" fill="url(#l-yellow)" stroke="${PAL.yellow[3]}" stroke-width="1.6"/><rect x="25" y="6" width="14" height="6" rx="2" fill="#FF9DB5" stroke="${PAL.pink[3]}" stroke-width="1.4"/><path d="M25 46 h14 l-7 12 z" fill="#F8E0C2" stroke="${PAL.tan[3]}" stroke-width="1.4" stroke-linejoin="round"/><path d="M30 54 h4 l-2 4 z" fill="#3A3458"/><path d="M32 12 v34" stroke="${PAL.yellow[2]}" stroke-width="1.2"/></g>`,
  book: `${SH(20)}<path d="M12 16 h18 q2 0 2 2 v36 q0 -2 -2 -2 h-18 z" fill="url(#l-sky)" stroke="${PAL.sky[3]}" stroke-width="1.6" stroke-linejoin="round"/><path d="M52 16 h-18 q-2 0 -2 2 v36 q0 -2 2 -2 h18 z" fill="url(#l-coral)" stroke="${PAL.coral[3]}" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 24 h11 M16 30 h11 M37 24 h11 M37 30 h11" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
  milk: `${SH(14)}<path d="M20 22 l6 -10 h12 l6 10 v32 h-24 z" fill="url(#l-white)" stroke="${PAL.white[3]}" stroke-width="1.6" stroke-linejoin="round"/><path d="M20 22 h24" stroke="${PAL.white[3]}" stroke-width="1.6"/><rect x="20" y="30" width="24" height="16" fill="url(#l-sky)"/><path d="M26 38 q3 -4 6 0 q3 4 6 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><rect x="28" y="8" width="8" height="4" rx="1" fill="${PAL.coral[1]}"/>`,
  car: `${SH(22, 56)}<path d="M8 44 v-8 q0 -4 4 -5 l8 -2 l6 -9 q2 -2 5 -2 h10 q3 0 5 3 l5 8 l4 1 q3 1 3 5 v9 z" ${F('coral')} stroke-linejoin="round"/><path d="M28 21 h12 l5 8 h-21 z" fill="#CFE6FF" stroke="${PAL.coral[3]}" stroke-width="1.3" stroke-linejoin="round"/><circle cx="20" cy="46" r="6" fill="#3A3458"/><circle cx="20" cy="46" r="2.4" fill="#D7D3E4"/><circle cx="46" cy="46" r="6" fill="#3A3458"/><circle cx="46" cy="46" r="2.4" fill="#D7D3E4"/>${HI(16, 34, 4, 2)}`,
  heart: `${SH(15)}<path d="M32 54 C16 42 8 34 8 24 A11 11 0 0 1 32 18 A11 11 0 0 1 56 24 C56 34 48 42 32 54 Z" ${F('coral')}/>${HI(19, 22, 4, 2.5)}`,
  triangle: `${SH(17)}<path d="M32 10 L56 52 H8 Z" ${F('lilac')} stroke-linejoin="round"/>${HI(26, 30, 3, 6, 30)}`,
  circle: `${SH(15)}<circle cx="32" cy="33" r="19" ${F('sky')}/>${HI(25, 25)}`,
  egg: `${SH(13)}<ellipse cx="32" cy="35" rx="14" ry="18" ${F('white')}/>${HI(27, 26, 3, 5, 20)}`,
  shirt: `${SH(18)}<path d="M22 12 l-12 8 l5 10 l6 -3 v25 h22 v-25 l6 3 l5 -10 l-12 -8 q-4 6 -10 6 q-6 0 -10 -6 z" ${F('sky')} stroke-linejoin="round"/>${HI(27, 30, 3, 6, 0)}`,
  coin: `${SH(14)}<circle cx="32" cy="33" r="17" ${F('yellow')}/><circle cx="32" cy="33" r="12" fill="none" stroke="${PAL.yellow[3]}" stroke-width="1.4" opacity=".7"/><text x="32" y="38.5" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="15" fill="${PAL.yellow[3]}">฿</text>`,
  /* ---------- chapter 6 (picture graphs) ---------- */
  carrot: `${SH(10)}<path d="M28 18 q-6 -8 -2 -12 q3 4 4 10 q1 -8 6 -10 q1 6 -4 12 q6 -4 10 -2 q-4 5 -12 4 z" ${F('green')}/><path d="M24 20 q8 -4 16 0 q-2 16 -8 36 q-6 -20 -8 -36 z" ${F('orange')}/><path d="M27 28 h4 M28 36 h5 M30 44 h3" stroke="${PAL.orange[3]}" stroke-width="1.4" stroke-linecap="round"/>${HI(28, 25, 2.5, 5, 10)}`,
  tomato: `${SH(17)}<circle cx="32" cy="37" r="19" ${F('red')}/><path d="M32 22 l-9 -3 l6 5 l-7 4 l9 -2 l1 7 l1 -7 l9 2 l-7 -4 l6 -5 z" ${F('green')} stroke-linejoin="round"/><path d="M32 20 v-6" stroke="#5FA336" stroke-width="2.4" stroke-linecap="round"/>${HI(22, 31, 4, 6, 25)}`,
  broccoli: `${SH(14)}<path d="M26 56 l2 -20 h8 l2 20 z" fill="url(#l-green)" stroke="${PAL.green[3]}" stroke-width="1.5" stroke-linejoin="round"/><g ${F('mint')}><circle cx="20" cy="30" r="9"/><circle cx="44" cy="30" r="9"/><circle cx="32" cy="20" r="11"/><circle cx="32" cy="33" r="9"/></g>${HI(27, 15, 4, 2.5)}`,
  pumpkin: `${SH(19)}<path d="M32 18 q0 -8 5 -10" fill="none" stroke="#5FA336" stroke-width="3" stroke-linecap="round"/><g ${F('orange')}><ellipse cx="22" cy="37" rx="11" ry="17"/><ellipse cx="42" cy="37" rx="11" ry="17"/><ellipse cx="32" cy="37" rx="10" ry="18"/></g>${HI(26, 27, 3, 6, 10)}`,
  squid: `${SH(12)}<path d="M32 6 q14 10 12 26 h-24 q-2 -16 12 -26 z" ${F('lilac')}/><path d="M22 32 q-4 10 -8 14 M27 32 q-2 12 -5 18 M32 32 v20 M37 32 q2 12 5 18 M42 32 q4 10 8 14" fill="none" stroke="${PAL.lilac[2]}" stroke-width="3.4" stroke-linecap="round"/>${EYES(25, 5)}${HI(27, 14, 3, 5, 20)}`,
  starfishA: `${SH(16)}<path d="M32 8 l7 15 l16 2 l-12 11 l4 16 l-15 -8 l-15 8 l4 -16 l-12 -11 l16 -2 z" ${F('orange')} stroke-linejoin="round"/>${EYES(31, 5)}${SMILE(36)}`,
  seahorse: `${SH(10)}<path d="M38 10 q10 2 8 12 l-6 2 q4 6 2 14 q-2 10 -10 14 q-6 3 -8 -2 q-1 -4 4 -4 q4 0 6 -6 q2 -8 -4 -12 q-6 -4 -2 -12 q3 -6 10 -6 z" ${F('yellow')} stroke-linejoin="round"/><path d="M30 18 l-6 -2 M30 26 l-6 0 M32 34 l-6 2" stroke="${PAL.yellow[3]}" stroke-width="2.2" stroke-linecap="round"/><circle cx="40" cy="16" r="2.3" fill="#2B2550"/>`,
  puffer: `${SH(17)}<g stroke="${PAL.sky[3]}" stroke-width="2.2" stroke-linecap="round"><path d="M32 12 v-5 M18 17 l-4 -4 M46 17 l4 -4 M12 32 h-5 M52 32 h5 M18 47 l-4 4 M46 47 l4 4"/></g><circle cx="32" cy="32" r="19" ${F('sky')}/><path d="M50 26 l9 -5 v22 l-9 -5 z" ${F('sky')} stroke-linejoin="round"/>${EYES(29, 7)}<ellipse cx="32" cy="40" rx="3" ry="2.4" fill="#2B2550"/>${HI(24, 22)}`,
  lily: `${SH(12)}<path d="M32 40 v16" stroke="#5FA336" stroke-width="2.6" stroke-linecap="round"/><g ${F('white')} stroke-linejoin="round"><path d="M32 36 q-16 -2 -20 -16 q12 0 20 16 z"/><path d="M32 36 q16 -2 20 -16 q-12 0 -20 16 z"/><path d="M32 36 q-6 -14 0 -28 q6 14 0 28 z"/></g><g fill="#F08AA3"><circle cx="28" cy="26" r="1.2"/><circle cx="36" cy="26" r="1.2"/><circle cx="32" cy="22" r="1.2"/></g><path d="M32 36 v-10 M32 36 l-4 -9 M32 36 l4 -9" stroke="#E2A963" stroke-width="1.3"/>`,
  rose: `${SH(10)}<path d="M32 36 v20" stroke="#5FA336" stroke-width="2.6" stroke-linecap="round"/><path d="M32 46 q-9 -2 -12 4 q8 2 12 -4 z" ${F('green')}/><path d="M20 22 q0 16 12 16 q12 0 12 -16 q-6 4 -12 -6 q-6 10 -12 6 z" ${F('red')} stroke-linejoin="round"/><path d="M28 24 q4 -4 8 0 q-2 6 -6 4" fill="none" stroke="${PAL.red[3]}" stroke-width="1.4" stroke-linecap="round"/>`,
  lotus: `${SH(18)}<g stroke-linejoin="round"><path d="M32 48 q-24 0 -26 -14 q14 -2 26 14 z" ${F('pink')}/><path d="M32 48 q24 0 26 -14 q-14 -2 -26 14 z" ${F('pink')}/><path d="M32 48 q-14 -10 -10 -28 q10 10 10 28 z" ${F('pink')}/><path d="M32 48 q14 -10 10 -28 q-10 10 -10 28 z" ${F('pink')}/><path d="M32 48 q-6 -18 0 -34 q6 16 0 34 z" ${F('pink')}/></g><path d="M14 52 q18 6 36 0" fill="none" stroke="#5FA336" stroke-width="3" stroke-linecap="round"/>`,
  jasmine: `${SH(14)}<g ${F('white')}>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="32" cy="18" rx="7" ry="11" transform="rotate(${a} 32 31)"/>`).join('')}</g><circle cx="32" cy="31" r="5" ${F('yellow')}/>`,
  sunflower: `${SH(15)}<path d="M32 44 v14" stroke="#5FA336" stroke-width="2.8" stroke-linecap="round"/><g ${F('yellow')}>${range(0, 11).map(i => `<ellipse cx="32" cy="12" rx="4.5" ry="9" transform="rotate(${i * 30} 32 28)"/>`).join('')}</g><circle cx="32" cy="28" r="9" fill="#8A5A33" stroke="#6B4223" stroke-width="1.4"/><g fill="#C98E55"><circle cx="29" cy="26" r="1.2"/><circle cx="35" cy="26" r="1.2"/><circle cx="32" cy="31" r="1.2"/></g>`,
  orchid: `${SH(10)}<path d="M20 58 q4 -24 18 -44" fill="none" stroke="#5FA336" stroke-width="2.4" stroke-linecap="round"/>${[[36, 16], [26, 30], [38, 38], [24, 48]].map(([x, y]) => `<g ${F('lilac')}><circle cx="${x - 5}" cy="${y}" r="4.5"/><circle cx="${x + 5}" cy="${y}" r="4.5"/><circle cx="${x}" cy="${y - 5}" r="4.5"/><circle cx="${x}" cy="${y + 4}" r="4"/></g><circle cx="${x}" cy="${y}" r="2" fill="#FFD45C"/>`).join('')}`,
  lollipop: `${SH(8)}<path d="M32 36 v22" stroke="#E6D3AC" stroke-width="3.4" stroke-linecap="round"/><circle cx="32" cy="22" r="15" ${F('pink')}/><path d="M32 22 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6 a2 2 0 1 1 2 2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`,
  donut: `${SH(18)}<circle cx="32" cy="34" r="20" ${F('cookie')}/><path d="M14 30 q2 -16 18 -16 q16 0 18 16 q-2 6 -6 4 q-4 6 -8 2 q-4 4 -8 0 q-4 4 -8 -2 q-4 2 -6 -4 z" ${F('pink')}/><circle cx="32" cy="34" r="6" fill="#FFFDF6" stroke="${PAL.cookie[3]}" stroke-width="1.5"/><g stroke-linecap="round" stroke-width="2"><path d="M22 22 l3 2" stroke="#4C9BF0"/><path d="M40 20 l-2 3" stroke="#FFD45C"/><path d="M44 28 l-3 1" stroke="#2FBF8C"/><path d="M26 30 l-2 2" stroke="#FFD45C"/></g>`,
  croissant: `${SH(19)}<path d="M8 40 q2 -20 24 -22 q22 2 24 22 q-6 4 -10 -2 q-4 6 -8 0 q-6 6 -12 0 q-4 6 -8 0 q-4 6 -10 2 z" ${F('cookie')} stroke-linejoin="round"/><path d="M22 22 q4 8 2 16 M32 18 v18 M42 22 q-4 8 -2 16" fill="none" stroke="${PAL.cookie[3]}" stroke-width="1.5" stroke-linecap="round"/>${HI(26, 24, 4, 2.5)}`,
  sandwich: `${SH(18)}<path d="M8 46 L32 14 L56 46 z" fill="#FFF3DF" stroke="#E2C493" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 42 q10 -4 20 2 q10 -6 20 -2" fill="none" stroke="#5FA336" stroke-width="3.4" stroke-linecap="round"/><path d="M14 46 h36" stroke="#FF6F7D" stroke-width="3" stroke-linecap="round"/><path d="M8 48 L32 16 L56 48 z" fill="none" stroke="#C98E55" stroke-width="2.6" stroke-linejoin="round"/>`,
  cake: `${SH(18)}<path d="M10 34 l22 -14 l22 14 v18 h-44 z" fill="#FFF3DF" stroke="#E2C493" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 34 l22 -14 l22 14 z" ${F('pink')} stroke-linejoin="round"/><path d="M10 43 h44" stroke="#FF9DB5" stroke-width="3"/><circle cx="32" cy="18" r="4" ${F('red')}/>`,
  medal: `${SH(11)}<path d="M22 6 h8 l4 18 h-8 z M42 6 h-8 l-4 18 h8 z" fill="url(#l-sky)" stroke="${PAL.sky[3]}" stroke-width="1.3" stroke-linejoin="round"/><circle cx="32" cy="38" r="14" ${F('yellow')}/><circle cx="32" cy="38" r="9" fill="none" stroke="${PAL.yellow[3]}" stroke-width="1.4"/><path d="M32 32 l2 4 4.5 .6 -3.3 3 .8 4.4 -4 -2.2 -4 2.2 .8 -4.4 -3.3 -3 4.5 -.6 z" fill="#fff" opacity=".8"/>`,
  grape: `${SH(13)}<path d="M32 12 q2 -6 8 -6" fill="none" stroke="#8A5A33" stroke-width="2.2" stroke-linecap="round"/><path d="M34 10 q8 -4 12 2 q-6 4 -12 -2 z" ${F('green')}/><g ${F('lilac')}>${[[24, 18], [32, 18], [40, 18], [20, 27], [28, 27], [36, 27], [44, 27], [24, 36], [32, 36], [40, 36], [28, 45], [36, 45], [32, 53]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>`,
  girl: `${SH(16)}<path d="M12 40 q-4 -26 20 -28 q24 2 20 28 q-4 10 -8 4 v-10 h-24 v10 q-4 6 -8 -4 z" fill="#8A5A33" stroke="#6B4223" stroke-width="1.4"/><circle cx="32" cy="34" r="15" fill="#FFE3CC" stroke="#E2B48E" stroke-width="1.4"/><path d="M17 30 q6 -12 15 -12 q9 0 15 12 q-8 -5 -15 -4 q-7 -1 -15 4 z" fill="#8A5A33"/><circle cx="16" cy="18" r="5" ${F('pink')}/><circle cx="48" cy="18" r="5" ${F('pink')}/>${EYES(35, 5.5)}${CHEEKS(40, 9)}${SMILE(41)}`,
  teddy: `${SH(16)}<circle cx="18" cy="16" r="7" ${F('tan')}/><circle cx="46" cy="16" r="7" ${F('tan')}/><circle cx="32" cy="30" r="17" ${F('tan')}/><ellipse cx="32" cy="35" rx="7" ry="5" fill="#F8E0C2"/><ellipse cx="32" cy="33" rx="2.6" ry="2" fill="#2B2550"/>${EYES(27, 7)}<path d="M18 46 q14 10 28 0 v8 h-28 z" ${F('tan')}/>`,
  blocks: `${SH(18)}<rect x="10" y="32" width="22" height="22" rx="3" ${F('sky')}/><rect x="32" y="32" width="22" height="22" rx="3" ${F('coral')}/><rect x="21" y="10" width="22" height="22" rx="3" ${F('yellow')}/><path d="M32 16 l6 10 h-12 z" fill="none" stroke="${PAL.yellow[3]}" stroke-width="1.8" stroke-linejoin="round"/><circle cx="21" cy="43" r="5" fill="none" stroke="${PAL.sky[3]}" stroke-width="1.8"/><path d="M43 37 l4 6 -4 6 -4 -6 z" fill="none" stroke="${PAL.coral[3]}" stroke-width="1.8" stroke-linejoin="round"/>`,
  pen: `${SH(12)}<path d="M44 8 l12 12 l-30 30 l-14 4 l4 -14 z" ${F('sky')} stroke-linejoin="round"/><path d="M38 14 l12 12" stroke="${PAL.sky[3]}" stroke-width="1.6"/><path d="M16 40 l8 8 l-10 4 z" fill="#FFF3DF" stroke="#E2C493" stroke-width="1.2" stroke-linejoin="round"/><path d="M14 50 l2 -2" stroke="#2B2550" stroke-width="2.4" stroke-linecap="round"/>`,
  sprout: `${SH(16)}<path d="M14 46 h36 l-4 12 h-28 z" fill="url(#l-cookie)" stroke="${PAL.cookie[3]}" stroke-width="1.5" stroke-linejoin="round"/><path d="M32 46 v-20" stroke="#5FA336" stroke-width="3" stroke-linecap="round"/><path d="M32 30 q-14 -2 -16 -14 q14 0 16 14 z M32 26 q14 -4 16 -16 q-14 0 -16 16 z" ${F('green')}/>`,
  bowl: `${SH(19)}<path d="M18 26 q4 -10 14 -10 q10 0 14 10" fill="#FFFDF6" stroke="#E6D3AC" stroke-width="1.5"/><g fill="#FFFDF6" stroke="#E6D3AC" stroke-width="1.2"><circle cx="24" cy="24" r="5"/><circle cx="32" cy="20" r="6"/><circle cx="40" cy="24" r="5"/></g><path d="M8 28 h48 q-2 24 -24 24 q-22 0 -24 -24 z" ${F('coral')}/>${HI(18, 36, 3, 5, 20)}`,
  trash: `${SH(16)}<path d="M18 22 h28 l-3 32 h-22 z" ${F('mint')} stroke-linejoin="round"/><rect x="14" y="16" width="36" height="7" rx="3" ${F('mint')}/><path d="M28 12 h8" stroke="${PAL.mint[3]}" stroke-width="3" stroke-linecap="round"/><path d="M26 28 l1 20 M32 28 v20 M38 28 l-1 20" stroke="${PAL.mint[3]}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`,
  palette: `${SH(19)}<path d="M32 10 c-14 0 -24 10 -24 22 c0 12 10 20 20 20 c4 0 4 -4 2 -6 c-2 -3 0 -6 4 -6 h6 c8 0 14 -4 14 -12 c0 -10 -10 -18 -22 -18 z" fill="#FFF3DF" stroke="#E2C493" stroke-width="1.6"/><circle cx="20" cy="30" r="4" fill="#FF6F7D"/><circle cx="26" cy="20" r="4" fill="#FFD45C"/><circle cx="38" cy="18" r="4" fill="#4C9BF0"/><circle cx="46" cy="28" r="4" fill="#2FBF8C"/>`,
  vase: `${SH(14)}<path d="M24 10 h16 v6 q10 8 10 22 q0 16 -18 18 q-18 -2 -18 -18 q0 -14 10 -22 z" ${F('cookie')} stroke-linejoin="round"/><path d="M16 34 h32" stroke="${PAL.cookie[3]}" stroke-width="2"/><path d="M20 42 q12 4 24 0" fill="none" stroke="${PAL.cookie[3]}" stroke-width="1.6"/>${HI(22, 24, 3, 6, 15)}`,
  camera: `${SH(19)}<path d="M22 16 h20 l4 6 h8 q4 0 4 4 v24 q0 4 -4 4 h-44 q-4 0 -4 -4 v-24 q0 -4 4 -4 h8 z" ${F('grey')} stroke-linejoin="round"/><circle cx="32" cy="37" r="11" fill="#2B2550"/><circle cx="32" cy="37" r="7" fill="#4C6FA8"/>${HI(29, 34, 2.5, 2)}<rect x="46" y="26" width="5" height="3" rx="1.5" fill="#FF6F7D"/>`,
  /* ---------- chapter 7 (weight) ---------- */
  durian: `${SH(17)}<path d="M32 10 q-2 -4 1 -6" fill="none" stroke="#6B4223" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="32" cy="36" rx="20" ry="22" ${F('green')}/>${[[22, 22], [32, 18], [42, 22], [18, 34], [28, 30], [38, 30], [46, 34], [22, 46], [32, 42], [42, 46], [28, 54], [36, 54]].map(([x, y]) => `<path d="M${x} ${y - 4} l3 4 -3 4 -3 -4 z" fill="${PAL.green[2]}" opacity=".85"/>`).join('')}${HI(24, 22, 4, 2.5)}`,
  corn: `${SH(12)}<path d="M32 6 q12 6 10 30 q-2 18 -10 22 q-8 -4 -10 -22 q-2 -24 10 -30 z" ${F('yellow')}/>${[14, 22, 30, 38, 46].map(y => `<path d="M24 ${y} h16" stroke="${PAL.yellow[3]}" stroke-width="1.2" opacity=".6"/>`).join('')}<path d="M27 8 v48 M32 6 v52 M37 8 v48" stroke="${PAL.yellow[3]}" stroke-width="1" opacity=".5"/><path d="M32 58 q-16 -6 -18 -26 q8 8 18 14 z M32 58 q16 -6 18 -26 q-8 8 -18 14 z" ${F('green')}/>`,
  pineapple: `${SH(14)}<g ${F('green')}><path d="M32 22 q-10 -6 -12 -16 q8 4 12 12 z"/><path d="M32 22 q10 -6 12 -16 q-8 4 -12 12 z"/><path d="M32 22 q-2 -10 0 -18 q2 8 0 18 z"/></g><ellipse cx="32" cy="40" rx="15" ry="18" ${F('yellow')}/><path d="M20 30 l24 22 M20 44 l18 -16 M24 54 l20 -18 M18 38 l10 -10 M36 56 l10 -10" stroke="${PAL.yellow[3]}" stroke-width="1.3" opacity=".7"/>${HI(25, 31, 3, 5, 20)}`,
  mangosteen: `${SH(17)}<circle cx="32" cy="38" r="18" ${F('lilac')}/><path d="M32 22 l-8 -4 5 6 -7 2 9 1 1 6 1 -6 9 -1 -7 -2 5 -6 z" ${F('green')} stroke-linejoin="round"/>${HI(24, 32, 4, 6, 25)}`,
  rambutan: `${SH(16)}<g stroke="#2FA55A" stroke-width="2.2" stroke-linecap="round">${range(0, 13).map(i => { const a = i / 14 * Math.PI * 2, x = 32 + Math.cos(a) * 17, y = 36 + Math.sin(a) * 17; return `<path d="M${x} ${y} q${Math.cos(a) * 5} ${Math.sin(a) * 5 - 2} ${Math.cos(a + .6) * 7} ${Math.sin(a + .6) * 7}"/>`; }).join('')}</g><circle cx="32" cy="36" r="16" ${F('red')}/>${HI(25, 30, 4, 5, 25)}`,
  shrimp: `${SH(16)}<path d="M50 22 q4 18 -12 26 q-14 6 -22 -4 q8 2 14 -2 q10 -6 8 -20 z" ${F('coral')} stroke-linejoin="round"/><path d="M44 30 q-4 6 -10 8 M40 38 q-4 4 -10 4 M46 22 q-2 6 -6 10" fill="none" stroke="${PAL.coral[3]}" stroke-width="1.4"/><path d="M16 44 l-6 -4 m6 4 l-5 4" stroke="${PAL.coral[3]}" stroke-width="2" stroke-linecap="round"/><path d="M50 22 q6 -10 10 -12 M48 22 q2 -12 -2 -16" fill="none" stroke="${PAL.coral[3]}" stroke-width="1.4" stroke-linecap="round"/><circle cx="48" cy="26" r="2" fill="#2B2550"/>`,
  chicken: `${SH(17)}<path d="M14 40 q-2 -22 20 -24 q20 0 18 20 q-2 14 -18 16 q-18 0 -20 -12 z" ${F('cookie')}/><path d="M44 46 l8 6" stroke="#FFF3DF" stroke-width="5" stroke-linecap="round"/><circle cx="54" cy="52" r="3.4" fill="#FFF3DF"/><circle cx="55" cy="49" r="3" fill="#FFF3DF"/>${HI(24, 26, 5, 3)}`,
  salmon: `${SH(18)}<path d="M8 42 q4 -18 24 -20 q20 0 24 18 q-22 10 -48 2 z" ${F('coral')}/><path d="M16 36 q6 6 4 12 M26 30 q6 8 4 16 M38 30 q4 8 2 16 M48 34 q2 6 0 12" fill="none" stroke="#fff" stroke-width="2.2" opacity=".8"/>`,
  pork: `${SH(18)}<path d="M8 40 q2 -16 24 -18 q22 2 24 16 q-2 10 -24 12 q-22 0 -24 -10 z" ${F('pink')}/><path d="M12 34 q20 -6 40 0" fill="none" stroke="#fff" stroke-width="3.4" opacity=".85"/><path d="M14 44 q18 4 36 0" fill="none" stroke="#fff" stroke-width="2.4" opacity=".7"/>`,
  mushroom: `${SH(14)}<path d="M26 56 q-2 -12 2 -20 h8 q4 8 2 20 z" fill="#FFF3DF" stroke="#E6CFA8" stroke-width="1.2"/><path d="M8 36 q2 -24 24 -24 q22 0 24 24 q-24 6 -48 0 z" ${F('red')}/><g fill="#fff"><circle cx="22" cy="24" r="3.4"/><circle cx="36" cy="20" r="3"/><circle cx="44" cy="30" r="2.6"/><circle cx="18" cy="32" r="2"/></g>`,
  potato: `${SH(18)}<path d="M10 36 q0 -18 22 -18 q22 0 22 16 q0 16 -22 18 q-22 0 -22 -16 z" ${F('cookie')}/><g fill="${PAL.cookie[3]}" opacity=".5"><circle cx="22" cy="30" r="1.4"/><circle cx="38" cy="26" r="1.4"/><circle cx="44" cy="40" r="1.4"/><circle cx="28" cy="42" r="1.4"/></g>${HI(22, 26, 5, 3)}`,
  cabbage: `${SH(18)}<circle cx="32" cy="36" r="20" ${F('mint')}/><path d="M32 16 q-10 10 -8 24 q2 10 8 16 M32 16 q10 10 8 24 q-2 10 -8 16 M14 30 q8 0 12 8 M50 30 q-8 0 -12 8" fill="none" stroke="${PAL.mint[3]}" stroke-width="1.6" opacity=".7"/>${HI(22, 26, 5, 3)}`,
  chili: `${SH(12)}<path d="M18 16 q-4 -6 2 -8 q4 2 2 8" fill="${PAL.green[1]}" stroke="${PAL.green[3]}" stroke-width="1.4"/><path d="M16 18 q8 -6 16 2 q8 10 10 22 q2 12 10 16 q-16 2 -24 -12 q-8 -12 -12 -28 z" ${F('red')}/>${HI(22, 22, 3, 5, -30)}`,
  coconut: `${SH(18)}<circle cx="32" cy="36" r="20" fill="#8A5A33" stroke="#6B4223" stroke-width="1.6"/><path d="M18 26 q4 6 2 12 M30 18 q-2 8 2 14 M44 22 q-4 8 0 14 M24 46 q8 2 14 -2" fill="none" stroke="#B9834F" stroke-width="2" stroke-linecap="round"/><g fill="#5A3D1A"><circle cx="27" cy="30" r="2.2"/><circle cx="37" cy="30" r="2.2"/><circle cx="32" cy="37" r="2.2"/></g>`,
  eggplant: `${SH(14)}<path d="M40 14 q12 4 8 22 q-4 18 -20 22 q-14 2 -14 -10 q0 -10 10 -18 q8 -8 6 -14 q4 -4 10 -2 z" ${F('lilac')}/><path d="M38 12 q-6 2 -6 8 q6 -2 8 2 q2 -4 8 -4 q-4 -6 -10 -6 z" ${F('green')}/>${HI(24, 44, 3, 6, 40)}`,
  guava: `${SH(17)}<circle cx="32" cy="37" r="18" ${F('green')}/><path d="M32 20 v-6" stroke="#6B4223" stroke-width="2.4" stroke-linecap="round"/><path d="M33 16 q8 -6 12 0 q-6 4 -12 0 z" ${F('mint')}/>${HI(24, 31, 4, 6, 25)}`,
  pomelo: `${SH(19)}<ellipse cx="32" cy="38" rx="21" ry="19" ${F('mint')}/><path d="M32 20 q-4 -6 0 -10 q4 4 0 10" ${F('green')}/>${HI(22, 30, 5, 7, 25)}`,
  chompoo: `${SH(14)}<path d="M32 12 q14 2 16 22 q2 20 -16 24 q-18 -4 -16 -24 q2 -20 16 -22 z" ${F('pink')}/><path d="M32 12 v-4" stroke="#6B4223" stroke-width="2.2" stroke-linecap="round"/>${HI(24, 28, 3, 7, 15)}`,
  marble: `${SH(12, 52)}<circle cx="32" cy="34" r="16" fill="url(#g-sky)" stroke="${PAL.sky[3]}" stroke-width="1.6"/><path d="M22 38 q8 -14 20 -8 q-6 12 -20 8 z" fill="#2FBF8C" opacity=".6"/>${HI(26, 27, 5, 3.5)}`,
  kg1: `${SH(18)}<path d="M18 26 h28 l6 28 h-40 z" fill="url(#g-grey)" stroke="${PAL.grey[3]}" stroke-width="1.6" stroke-linejoin="round"/><path d="M26 26 q0 -12 6 -12 q6 0 6 12" fill="none" stroke="${PAL.grey[3]}" stroke-width="3.6"/><text x="32" y="46" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="12" fill="#5B5577">1kg</text>`,
  dotA: `${SH(14)}<circle cx="32" cy="33" r="18" ${F('coral')}/>${HI(25, 25)}`,
  dotB: `${SH(14)}<circle cx="32" cy="33" r="18" ${F('sky')}/>${HI(25, 25)}`
};
/* chapter 8: little kids with varied hair, skin and shirt colours (kid0 … kid11) */
const KID_LOOKS = [['#3B2A20', '#FF8FA3', 'g', '#FFE3CC'], ['#5A3D1A', '#4C9BF0', 'b', '#F8D7B8'], ['#2B2550', '#FFD45C', 'g', '#FFE3CC'], ['#8A5A33', '#2FBF8C', 'b', '#FFE7D2'], ['#3B2A20', '#B9A6F5', 'g', '#F3CDAA'], ['#6B4223', '#FF9D52', 'b', '#FFE3CC'],
  ['#2B2550', '#FF6F7D', 'b', '#F8D7B8'], ['#A0602E', '#57C27A', 'g', '#FFE7D2'], ['#3B2A20', '#7FC7F5', 'g', '#F3CDAA'], ['#5A3D1A', '#F5C64E', 'b', '#FFE3CC'], ['#2B2550', '#E77FB8', 'g', '#FFE7D2'], ['#6B4223', '#9C8BF0', 'b', '#F8D7B8']];
KID_LOOKS.forEach(([hair, shirt, sex, skin], i) => {
  const girl = sex === 'g';
  ART['kid' + i] = `${SH(16, 61)}<path d="M20 62 v-14 q0 -6 12 -6 q12 0 12 6 v14 z" fill="${shirt}"/><path d="M26 42 l6 6 6 -6" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>` +
    (girl ? `<path d="M13 34 q-4 -22 19 -24 q23 2 19 24 q-1 8 -5 10 v-12 h-28 v12 q-4 -2 -5 -10 z" fill="${hair}"/>` : '') +
    `<circle cx="32" cy="27" r="14" fill="${skin}" stroke="#E2B48E" stroke-width="1.2"/>` +
    (girl ? `<path d="M18 24 q5 -12 14 -12 q9 0 14 12 q-8 -5 -14 -4 q-6 -1 -14 4 z" fill="${hair}"/><circle cx="46" cy="15" r="3.4" fill="${shirt}"/>`
          : `<path d="M17 24 q1 -13 15 -13 q14 0 15 13 q-4 -4 -9 -4 q-2 3 -6 3 q-4 0 -6 -3 q-5 0 -9 4 z" fill="${hair}"/>`) +
    `<circle cx="27" cy="28" r="2" fill="#2B2550"/><circle cx="37" cy="28" r="2" fill="#2B2550"/><ellipse cx="23" cy="33" rx="2.4" ry="1.5" fill="#FF8FA3" opacity=".55"/><ellipse cx="41" cy="33" rx="2.4" ry="1.5" fill="#FF8FA3" opacity=".55"/><path d="M29.5 33.5 q2.5 2.4 5 0" fill="none" stroke="#2B2550" stroke-width="1.4" stroke-linecap="round"/>`;
});
/* =========================================================
   GRADE 1 · CHAPTER 9 — 3D solids, 2D shapes, everyday objects
   ทรงกลม mint · ทรงกระบอก coral · กรวย sky
   ========================================================= */
const SOLID_COL = { box: 'yellow', ball: 'mint', cyl: 'coral', cone: 'sky' };
const SOLID_NAME = { box: 'ทรงสี่เหลี่ยมมุมฉาก', ball: 'ทรงกลม', cyl: 'ทรงกระบอก', cone: 'กรวย' };
const SOLID_KIND = v => v.startsWith('cone') ? 'cone' : v.startsWith('cyl') || v === 'disk' ? 'cyl' : v === 'sphere' ? 'ball' : 'box';
function cuboidSVG(w, hh, d, p) {
  const [l, b, sh, ln] = PAL[p], dx = d * .72, dy = d * .5, x0 = 32 - (w + dx) / 2;
  const y0 = Math.min(58, (64 + hh + dy) / 2 + 1), yt = y0 - hh;
  return `<ellipse cx="${32 + dx / 4}" cy="${y0 + 1.5}" rx="${(w + dx) / 2 + 2}" ry="2.6" fill="#2B2550" opacity=".12"/>` +
    `<path d="M${x0} ${yt} L${x0 + dx} ${yt - dy} H${x0 + w + dx} L${x0 + w} ${yt} Z" fill="${l}" stroke="${ln}" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<path d="M${x0 + w} ${yt} L${x0 + w + dx} ${yt - dy} V${y0 - dy} L${x0 + w} ${y0} Z" fill="${sh}" stroke="${ln}" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<rect x="${x0}" y="${yt}" width="${w}" height="${hh}" fill="url(#l-${p})" stroke="${ln}" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<path d="M${x0 + 3} ${yt + 3} h${Math.min(10, w * .35)}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
}
function cylSVG(rx, ry, top, bot, p) {
  const [l, , , ln] = PAL[p];
  return `<path d="M${32 - rx} ${top} V${bot} A${rx} ${ry} 0 0 0 ${32 + rx} ${bot} V${top} Z" fill="url(#h-${p})" stroke="${ln}" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<ellipse cx="32" cy="${top}" rx="${rx}" ry="${ry}" fill="${l}" stroke="${ln}" stroke-width="1.5"/><ellipse cx="${32 - rx * .3}" cy="${top - ry * .2}" rx="${rx * .35}" ry="${ry * .35}" fill="#fff" opacity=".5"/>`;
}
const MIX_COLS = ['yellow', 'pink', 'coral', 'orange', 'sky', 'mint', 'lilac', 'green'];
const mixCol = () => MIX_COLS[Math.floor(Math.random() * MIX_COLS.length)];
function solidSVG(v, p) {
  p = p || mixCol(); /* colour never tells the kind */ const [l, b, sh, ln] = PAL[p];
  switch (v) {
    case 'cube': return cuboidSVG(26, 26, 16, p);
    case 'slab': return cuboidSVG(36, 10, 26, p);
    case 'tower': return cuboidSVG(18, 40, 12, p);
    case 'box': return cuboidSVG(32, 22, 16, p);
    case 'sphere': return `${SH(17, 58)}<circle cx="32" cy="34" r="21" fill="url(#g-${p})" stroke="${ln}" stroke-width="1.5"/><path d="M11 35 q21 9 42 0" fill="none" stroke="${ln}" stroke-width="1.1" opacity=".35"/>${HI(24, 24, 7, 4)}`;
    case 'cyl': return `${SH(16, 58)}${cylSVG(14, 5, 13, 52, p)}`;
    case 'disk': return `${SH(20, 50)}${cylSVG(19, 6.5, 32, 42, p)}`;
    case 'cylLie': return `<ellipse cx="32" cy="50" rx="24" ry="3" fill="#2B2550" opacity=".12"/><g transform="rotate(90 32 33) translate(0 1)">${cylSVG(13, 4.6, 12, 52, p)}</g>`;
    case 'cone': return `${SH(17, 57)}<path d="M32 8 L16 50 A16 5.2 0 0 0 48 50 Z" fill="url(#h-${p})" stroke="${ln}" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 50 A16 5.2 0 0 1 48 50" fill="none" stroke="${ln}" stroke-width="1.1" stroke-dasharray="2.5 2.5" opacity=".55"/><path d="M29 15 L22 38" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>`;
    case 'coneDown': return `<ellipse cx="32" cy="60" rx="6" ry="2" fill="#2B2550" opacity=".12"/><path d="M16 14 A16 5.2 0 0 0 48 14 L32 56 Z" fill="url(#h-${p})" stroke="${ln}" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="32" cy="14" rx="16" ry="5.2" fill="${l}" stroke="${ln}" stroke-width="1.5"/>`;
  }
  return '';
}
const SOLIDS = ['box', 'cube', 'slab', 'tower', 'sphere', 'cyl', 'disk', 'cylLie', 'cone', 'coneDown'];
SOLIDS.forEach(v => { ART['s_' + v] = solidSVG(v, SOLID_COL[SOLID_KIND(v)]); });
/* 2D shapes: tri (pointy-top), rtri (right angle), rect, square, circle, ellipse — rot in degrees */
const SHAPE_COL = { tri: 'yellow', quad: 'pink', circle: 'coral', ellipse: 'orange' };
const SHAPE_NAME = { tri: 'รูปสามเหลี่ยม', quad: 'รูปสี่เหลี่ยม', circle: 'วงกลม', ellipse: 'วงรี' };
const SHAPE_KIND = v => /tri/.test(v) ? 'tri' : /rect|square|kite|para|book/.test(v) ? 'quad' : v === 'circle' ? 'circle' : 'ellipse';
const SHAPE_PTS = { tri: [[32, 9], [56, 52], [8, 52]], rtri: [[12, 10], [12, 52], [54, 52]], stri: [[10, 14], [56, 26], [20, 54]], rect: [[6, 18], [58, 18], [58, 46], [6, 46]], square: [[11, 11], [53, 11], [53, 53], [11, 53]], tallrect: [[19, 6], [45, 6], [45, 58], [19, 58]], kite: [[32, 6], [54, 30], [32, 58], [10, 30]], book: [[10, 6], [54, 6], [54, 58], [10, 58]], para: [[16, 14], [58, 14], [48, 50], [6, 50]] };
function shapeOutline(v) { // path data in the 64 box (used for drawing + tracing)
  if (v === 'circle') return 'M32 8 A24 24 0 1 1 31.99 8 Z';
  if (v === 'ellipse') return 'M32 6 A17 26 0 1 1 31.99 6 Z';
  if (v === 'wellipse') return 'M6 32 A26 16 0 1 1 6 32.01 Z';
  const P = SHAPE_PTS[v]; return 'M' + P.map(p => p.join(' ')).join(' L') + ' Z';
}
function shapePoints(v, n = 48) { // evenly spaced points around the outline
  if (v === 'circle' || v === 'ellipse' || v === 'wellipse') { const [rx, ry] = v === 'circle' ? [24, 24] : v === 'ellipse' ? [17, 26] : [26, 16]; return range(0, n - 1).map(i => { const a = i / n * Math.PI * 2; return [32 + rx * Math.cos(a), 32 + ry * Math.sin(a)]; }); }
  const P = SHAPE_PTS[v], seg = P.map((p, i) => [p, P[(i + 1) % P.length]]), L = seg.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])), tot = L.reduce((a, b) => a + b, 0), out = [];
  for (let k = 0; k < n; k++) { let d = k / n * tot, i = 0; while (d > L[i]) { d -= L[i]; i++; } const [a, b] = seg[i], t = d / L[i]; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  return out;
}
function shapeSVG(v, p, o = {}) {
  p = p || mixCol(); const [l, b, sh, ln] = PAL[p];
  const face = o.face ? `<circle cx="27" cy="${v.includes('tri') && v !== 'stri' ? 40 : 31}" r="2" fill="#2B2550"/><circle cx="37" cy="${v.includes('tri') && v !== 'stri' ? 40 : 31}" r="2" fill="#2B2550"/><path d="M29.5 ${v.includes('tri') && v !== 'stri' ? 44 : 35} q2.5 2.4 5 0" fill="none" stroke="#2B2550" stroke-width="1.6" stroke-linecap="round"/>` : '';
  const fill = o.outline ? 'fill="#fff"' : `fill="url(#g-${p})"`;
  return `<g transform="rotate(${o.rot || 0} 32 32)"><path d="${shapeOutline(v)}" ${fill} stroke="${o.outline ? '#2B2550' : ln}" stroke-width="${o.outline ? 1.8 : 2}" stroke-linejoin="round"/>${face}</g>`;
}
['tri', 'rtri', 'stri', 'rect', 'square', 'tallrect', 'kite', 'para', 'circle', 'ellipse', 'wellipse'].forEach(v => { ART['f_' + v] = shapeSVG(v, SHAPE_COL[SHAPE_KIND(v)]); });
/* everyday objects that look like the solids */
Object.assign(ART, {
  giftbox: cuboidSVG(30, 22, 16, 'coral') + `<path d="M25 35 V57 M14 46 h22" stroke="${PAL.yellow[1]}" stroke-width="3.5"/><path d="M25 35 l8 -6 h22" fill="none" stroke="${PAL.yellow[1]}" stroke-width="3"/><path d="M33 29 q-6 -10 -1 -10 q4 0 1 10 q4 -9 8 -7 q3 3 -8 7" fill="${PAL.yellow[1]}" stroke="${PAL.yellow[3]}" stroke-width="1.2"/>`,
  dice: cuboidSVG(26, 26, 16, 'white') + `<circle cx="17" cy="38" r="2.2" fill="#2B2550"/><circle cx="27" cy="48" r="2.2" fill="#2B2550"/><circle cx="22" cy="43" r="2.2" fill="#2B2550"/><circle cx="33" cy="25" r="1.6" fill="#2B2550"/><circle cx="41" cy="22" r="1.6" fill="#2B2550"/><circle cx="45" cy="38" r="1.6" fill="#2B2550"/>`,
  carton: cuboidSVG(18, 30, 12, 'sky') + `<path d="M19 27 l4 -7 h18 l-4 7" fill="${PAL.white[0]}" stroke="${PAL.sky[3]}" stroke-width="1.4"/><rect x="21" y="37" width="14" height="8" rx="2" fill="#fff"/><text x="28" y="43.5" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="5.5" fill="${PAL.sky[3]}">MILK</text>`,
  brick: cuboidSVG(36, 14, 18, 'orange') + `<path d="M12 50 h36" stroke="${PAL.orange[3]}" stroke-width="1" opacity=".5"/>`,
  tissue: cuboidSVG(34, 18, 20, 'mint') + `<ellipse cx="38" cy="33" rx="9" ry="3" fill="${PAL.mint[3]}" opacity=".5"/><path d="M34 33 q2 -10 6 -12 q2 6 2 12" fill="#fff" stroke="${PAL.white[3]}" stroke-width="1.2"/>`,
  globe: `${SH(14, 61)}<path d="M24 60 h16 l-3 -5 h-10 z" fill="${PAL.tan[1]}" stroke="${PAL.tan[3]}" stroke-width="1.4"/><path d="M32 55 v-4" stroke="${PAL.tan[3]}" stroke-width="2.5"/><circle cx="32" cy="29" r="21" fill="url(#g-sky)" stroke="${PAL.sky[3]}" stroke-width="1.5"/><path d="M20 18 q6 -3 9 2 q-2 6 3 8 q4 4 -1 9 q-4 2 -6 -2 q-3 -5 -7 -6 q-2 -6 2 -11 z M38 12 q6 2 9 9 q-4 3 -8 0 q-4 -4 -1 -9 z M40 36 q5 -2 7 3 q-3 6 -8 7 q-2 -5 1 -10 z" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1"/>${HI(24, 18, 6, 3)}`,
  basketball: `${SH(17, 58)}<circle cx="32" cy="34" r="21" fill="url(#g-orange)" stroke="${PAL.orange[3]}" stroke-width="1.5"/><path d="M11 34 h42 M32 13 v42 M17 19 q10 15 0 30 M47 19 q-10 15 0 30" fill="none" stroke="#7A3E12" stroke-width="1.6" opacity=".75"/>${HI(24, 24, 6, 3.5)}`,
  can: `${SH(15, 59)}${cylSVG(13, 4.6, 14, 53, 'red')}<rect x="19" y="28" width="26" height="12" fill="#fff" opacity=".85"/><path d="M23 34 h18" stroke="${PAL.red[2]}" stroke-width="2.4" stroke-linecap="round"/>`,
  drum: `${SH(19, 59)}${cylSVG(18, 6, 24, 50, 'coral')}<path d="M14 26 l9 22 l9 -22 l9 22 l9 -22" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" opacity=".9"/><path d="M40 8 l-8 14 M48 10 l-12 12" stroke="${PAL.tan[3]}" stroke-width="2.6" stroke-linecap="round"/>`,
  candle: `${SH(9, 60)}${cylSVG(8, 3, 22, 56, 'yellow')}<path d="M32 19 v-5" stroke="#5A4A3A" stroke-width="1.4"/><path d="M32 4 q5 6 0 11 q-5 -5 0 -11 z" fill="url(#g-orange)" stroke="${PAL.orange[3]}" stroke-width="1"/>`,
  mug: `${SH(16, 59)}<path d="M44 30 q10 0 10 9 q0 9 -10 9" fill="none" stroke="${PAL.lilac[3]}" stroke-width="4"/>${cylSVG(14, 4.6, 22, 53, 'lilac')}<path d="M22 22 q3 -6 0 -10 M30 20 q3 -6 0 -11" fill="none" stroke="#B7AFCD" stroke-width="1.8" stroke-linecap="round"/>`,
  partyhat: `<ellipse cx="32" cy="55" rx="16" ry="2.6" fill="#2B2550" opacity=".12"/><path d="M32 8 L17 51 A15 4.6 0 0 0 47 51 Z" fill="url(#h-magenta)" stroke="${PAL.magenta[3]}" stroke-width="1.5" stroke-linejoin="round"/><path d="M27 22 l10 4 M23 33 l15 6 M20 44 l20 7" stroke="#FFE38A" stroke-width="2.4" stroke-linecap="round"/><circle cx="32" cy="7" r="4" fill="url(#g-yellow)" stroke="${PAL.yellow[3]}" stroke-width="1.2"/>`,
  icecream: `<path d="M20 30 L32 60 L44 30 Z" fill="url(#h-cookie)" stroke="${PAL.cookie[3]}" stroke-width="1.5" stroke-linejoin="round"/><path d="M24 34 l12 12 M30 32 l9 9 M36 32 l-10 14 M41 34 l-12 17" stroke="${PAL.cookie[3]}" stroke-width="1" opacity=".6"/><circle cx="32" cy="22" r="13" fill="url(#g-pink)" stroke="${PAL.pink[3]}" stroke-width="1.5"/><path d="M19 27 q4 5 8 1 q5 5 9 0 q5 4 9 -1" fill="url(#g-pink)" stroke="${PAL.pink[3]}" stroke-width="1.4"/><circle cx="32" cy="8" r="3.4" fill="url(#g-red)"/>${HI(26, 15, 4, 2)}`,
  trafficcone: `<rect x="12" y="52" width="40" height="6" rx="2" fill="${PAL.orange[2]}" stroke="${PAL.orange[3]}" stroke-width="1.4"/><path d="M28 8 h8 L46 52 H18 Z" fill="url(#h-orange)" stroke="${PAL.orange[3]}" stroke-width="1.5" stroke-linejoin="round"/><path d="M25 22 h14 l2 8 H23 z M21 38 h22 l2 7 H19 z" fill="#fff"/>`,
  pot: `${SH(20, 59)}<path d="M8 28 h6 M50 28 h6" stroke="#9790B0" stroke-width="4" stroke-linecap="round"/>${cylSVG(18, 5.5, 26, 52, 'grey')}<path d="M24 20 h16" stroke="#9790B0" stroke-width="3" stroke-linecap="round"/><ellipse cx="32" cy="26" rx="18" ry="5.5" fill="${PAL.grey[0]}" stroke="#9790B0" stroke-width="1.5"/>`,
  setsquare: `<path d="M10 54 V10 L54 54 Z M18 46 V28 L36 46 Z" fill="url(#g-sky)" fill-rule="evenodd" stroke="${PAL.sky[3]}" stroke-width="1.6" stroke-linejoin="round" opacity=".92"/><path d="M10 20 h4 M10 30 h4 M10 40 h4 M20 54 v-4 M30 54 v-4 M40 54 v-4" stroke="${PAL.sky[3]}" stroke-width="1.2"/>`,
  plate: `<ellipse cx="32" cy="34" rx="27" ry="18" fill="url(#g-white)" stroke="#B7AFCD" stroke-width="1.6"/><ellipse cx="32" cy="34" rx="18" ry="11.5" fill="none" stroke="#B7AFCD" stroke-width="1.2" opacity=".7"/>`,
  clock: `${SH(16, 60)}<circle cx="32" cy="32" r="24" fill="url(#g-mint)" stroke="${PAL.mint[3]}" stroke-width="1.6"/><circle cx="32" cy="32" r="18" fill="#FFFBEA" stroke="${PAL.mint[3]}" stroke-width="1.2"/><path d="M32 32 V20 M32 32 l8 4" stroke="#2B2550" stroke-width="2.4" stroke-linecap="round"/><circle cx="32" cy="32" r="2" fill="${PAL.red[1]}"/>`,
  cardbook: `<rect x="12" y="8" width="40" height="48" rx="3" fill="url(#l-sky)" stroke="${PAL.sky[3]}" stroke-width="1.6"/><rect x="12" y="8" width="7" height="48" fill="${PAL.sky[2]}"/><rect x="24" y="16" width="22" height="9" rx="2" fill="#fff" opacity=".85"/>`,
  mirror: `<path d="M32 50 v8 M24 59 h16" stroke="${PAL.tan[3]}" stroke-width="3" stroke-linecap="round"/><ellipse cx="32" cy="27" rx="16" ry="23" fill="url(#g-tan)" stroke="${PAL.tan[3]}" stroke-width="1.6"/><ellipse cx="32" cy="27" rx="11.5" ry="18" fill="url(#g-sky)" stroke="${PAL.sky[3]}" stroke-width="1"/><path d="M26 18 q2 -6 6 -7" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
  sandwichT: `<path d="M8 50 L32 10 L56 50 Z" fill="url(#g-cookie)" stroke="${PAL.cookie[3]}" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 46 L32 16 L50 46 Z" fill="#FFF3D9"/><path d="M16 44 q8 -4 16 0 q8 4 16 0" fill="none" stroke="${PAL.leaf[2]}" stroke-width="2.4"/>`,
  pizza: `<path d="M8 14 Q32 4 56 14 L32 58 Z" fill="url(#g-yellow)" stroke="${PAL.orange[3]}" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 14 Q32 4 56 14 l-2 4 Q32 9 10 18 Z" fill="${PAL.cookie[2]}"/><circle cx="28" cy="24" r="3.6" fill="${PAL.red[1]}"/><circle cx="38" cy="30" r="3.2" fill="${PAL.red[1]}"/><circle cx="31" cy="40" r="2.8" fill="${PAL.red[1]}"/>`,
  popsicleP: `<rect x="29" y="44" width="6" height="16" rx="3" fill="${PAL.tan[0]}" stroke="${PAL.tan[3]}" stroke-width="1.2"/><path d="M18 18 q0 -12 14 -12 q14 0 14 12 v28 h-28 z" fill="url(#l-magenta)" stroke="${PAL.magenta[3]}" stroke-width="1.5"/><path d="M26 18 v20 M32 18 v20 M38 18 v20" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>`,
  popsicleB: `<rect x="29" y="44" width="6" height="16" rx="3" fill="${PAL.tan[0]}" stroke="${PAL.tan[3]}" stroke-width="1.2"/><path d="M18 18 q0 -12 14 -12 q14 0 14 12 v28 h-28 z" fill="url(#l-cookie)" stroke="${PAL.cookie[3]}" stroke-width="1.5"/><path d="M26 18 v20 M32 18 v20 M38 18 v20" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".45"/>`,
  leafG: `<path d="M32 60 q0 -10 0 -14" stroke="${PAL.leaf[3]}" stroke-width="2.4" stroke-linecap="round"/><path d="M32 48 q-20 -14 0 -44 q20 30 0 44 z" fill="url(#g-leaf)" stroke="${PAL.leaf[3]}" stroke-width="1.5"/><path d="M32 46 q-2 -18 0 -38" stroke="${PAL.leaf[3]}" stroke-width="1.3" fill="none"/>`,
  mangoG: `${SH(16, 57)}<path d="M14 34 q2 -18 22 -18 q16 2 16 18 q-2 16 -20 18 q-20 0 -18 -18 z" fill="url(#g-leaf)" stroke="${PAL.leaf[3]}" stroke-width="1.5"/><path d="M38 16 q4 -8 12 -8 q-2 8 -12 8 z" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1.2"/>${HI(24, 26, 6, 3)}`,
  mangoY: `${SH(16, 57)}<path d="M14 34 q2 -18 22 -18 q16 2 16 18 q-2 16 -20 18 q-20 0 -18 -18 z" fill="url(#g-yellow)" stroke="${PAL.yellow[3]}" stroke-width="1.5"/><path d="M38 16 q4 -8 12 -8 q-2 8 -12 8 z" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1.2"/>${HI(24, 26, 6, 3)}`,
  plum: `${SH(15, 57)}<circle cx="32" cy="36" r="18" fill="url(#g-lilac)" stroke="${PAL.lilac[3]}" stroke-width="1.5"/><path d="M32 18 q2 -6 6 -8" stroke="${PAL.leaf[3]}" stroke-width="2" fill="none" stroke-linecap="round"/>${HI(25, 28, 5, 3)}`
});
/* robot picture practicestyle) — every part is a basic shape: tri ×7 · quad ×4 · circle ×6 · ellipse ×2 */
const ROBOT_PARTS = [
  ['tri', 'M52 30 L64 8 L76 30 Z'], ['tri', 'M84 30 L96 8 L108 30 Z'], ['ellipse', 'M36 44 a8 14 0 1 1 -0.01 0 Z'], ['ellipse', 'M124 44 a8 14 0 1 1 -0.01 0 Z'],
  ['quad', 'M44 30 H116 V86 H44 Z'], ['circle', 'M64 42 a8 8 0 1 1 -0.01 0 Z'], ['circle', 'M96 42 a8 8 0 1 1 -0.01 0 Z'], ['tri', 'M68 66 H92 L80 78 Z'],
  ['quad', 'M70 86 H90 V96 H70 Z'], ['tri', 'M40 100 V136 H16 Z'], ['tri', 'M120 100 V136 H144 Z'], ['quad', 'M40 96 H120 V162 H40 Z'], ['quad', 'M58 106 H102 V132 H58 Z'],
  ['circle', 'M70 140 a6 6 0 1 1 -0.01 0 Z'], ['circle', 'M90 140 a6 6 0 1 1 -0.01 0 Z'], ['circle', 'M18 140 a8 8 0 1 1 -0.01 0 Z'], ['circle', 'M142 140 a8 8 0 1 1 -0.01 0 Z'],
  ['tri', 'M50 162 H74 L62 190 Z'], ['tri', 'M86 162 H110 L98 190 Z']
];
const ROBOT_FILL = { tri: 'mint', quad: 'coral', circle: 'yellow', ellipse: 'sky' };
function robotSVG(colored = []) { // colored: kinds drawn in colour (others white outline)
  return `<svg viewBox="0 0 160 200" class="robot" aria-hidden="true">` + ROBOT_PARTS.map(([k, d], i) => { const on = colored === true || colored.includes(k), c = PAL[ROBOT_FILL[k]];
    return `<path class="rp" data-k="${k}" data-i="${i}" d="${d}" fill="${on ? c[1] : '#fff'}" stroke="${on ? c[3] : '#2B2550'}" stroke-width="2" stroke-linejoin="round"/>`; }).join('') + '</svg>';
}
function art(key, cls = '') {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 64 64'); s.setAttribute('class', 'art ' + cls); s.setAttribute('aria-hidden', 'true');
  s.innerHTML = ART[key] || ART.star; return s;
}
const artHTML = key => `<svg viewBox="0 0 64 64" class="art" aria-hidden="true">${ART[key] || ART.star}</svg>`;

/* ---------- line icon set (24px grid, 2px rounded stroke) ---------- */
const ICON_PATHS = {
  map: '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  pencil: '<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M13.5 7l3 3"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  undo: '<path d="M9 7H5V3"/><path d="M5.5 7.5A8 8 0 1 1 4.5 14"/>',
  eraser: '<path d="M8.5 19.5h11"/><path d="M4.6 14.6l9-9a2 2 0 0 1 2.8 0l2.5 2.5a2 2 0 0 1 0 2.8l-7.4 7.4a4 4 0 0 1-5.6 0l-1.3-1.3a1.7 1.7 0 0 1 0-2.4z"/><path d="M9.5 9.7l5.3 5.3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5V20"/>',
  game: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r=".6" fill="currentColor"/><circle cx="17.5" cy="13.8" r=".6" fill="currentColor"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10.5l5-3v9l-5-3z"/>',
  replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 20h7M10 17h4"/>',
  keypad: '<rect x="4" y="3.5" width="4" height="4" rx="1"/><rect x="10" y="3.5" width="4" height="4" rx="1"/><rect x="16" y="3.5" width="4" height="4" rx="1"/><rect x="4" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="16" y="10" width="4" height="4" rx="1"/><rect x="10" y="16.5" width="4" height="4" rx="1"/>',
  write: '<path d="M3.5 18c3-1 4-6 6.5-6s1 5 3.5 5 3-4 4.5-4"/><path d="M14.5 4.5l3 3L11 14l-3.5.5.5-3.5z"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill="currentColor"/>',
  tap: '<path d="M9 11V5.5a1.6 1.6 0 0 1 3.2 0V11"/><path d="M12.2 10V8.8a1.6 1.6 0 0 1 3.2 0V11M15.4 10.5a1.6 1.6 0 0 1 3.2 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 15a1.6 1.6 0 0 1 2.6-1.8L9 15"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  crown: '<path d="M3.5 8l4 4 4.5-7 4.5 7 4-4-1.8 11H5.3z"/><path d="M5.5 19h13"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  zoom: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20.5 20.5M7.5 10.5h6M10.5 7.5v6"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" fill="currentColor"/>'
};
function icon(name, size) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'ic'); s.setAttribute('aria-hidden', 'true');
  if (size) { s.style.width = size; s.style.height = size; }
  s.innerHTML = ICON_PATHS[name] || ''; return s;
}
const iconHTML = name => `<svg viewBox="0 0 24 24" class="ic" aria-hidden="true">${ICON_PATHS[name]}</svg>`;

/* ---------- star (reward) ---------- */
function starArt(on, cls = '') {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 64 64'); s.setAttribute('class', 'rstar ' + (on ? 'on ' : '') + cls);
  s.innerHTML = on
    ? `<path d="M32 6 l7.6 15.6 l17.2 2.5 l-12.4 12.1 l2.9 17.1 l-15.3 -8.1 l-15.3 8.1 l2.9 -17.1 l-12.4 -12.1 l17.2 -2.5 z" fill="url(#g-yellow)" stroke="#E0A21F" stroke-width="2" stroke-linejoin="round"/><path d="M24 22 l5 -1" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`
    : `<path d="M32 6 l7.6 15.6 l17.2 2.5 l-12.4 12.1 l2.9 17.1 l-15.3 -8.1 l-15.3 8.1 l2.9 -17.1 l-12.4 -12.1 l17.2 -2.5 z" fill="#E9E5F2" stroke="#D5CFE5" stroke-width="2" stroke-linejoin="round"/>`;
  return s;
}

/* ---------- mascot: น้องเจี๊ยบ (moods: happy · wow · sad · think) ---------- */
function mascotSVG(mood = 'happy') {
  const eyes = {
    happy: '<g class="m-eyes"><ellipse cx="47" cy="56" rx="4.2" ry="5.4" fill="#2B2550"/><ellipse cx="73" cy="56" rx="4.2" ry="5.4" fill="#2B2550"/><circle cx="45.6" cy="53.8" r="1.6" fill="#fff"/><circle cx="71.6" cy="53.8" r="1.6" fill="#fff"/></g>',
    wow: '<g class="m-eyes"><ellipse cx="47" cy="55" rx="5.2" ry="6.6" fill="#2B2550"/><ellipse cx="73" cy="55" rx="5.2" ry="6.6" fill="#2B2550"/><circle cx="45" cy="52.3" r="2.2" fill="#fff"/><circle cx="71" cy="52.3" r="2.2" fill="#fff"/><circle cx="49" cy="58" r="1" fill="#fff"/><circle cx="75" cy="58" r="1" fill="#fff"/></g>',
    sad: '<g class="m-eyes"><ellipse cx="47" cy="58" rx="4" ry="4.6" fill="#2B2550"/><ellipse cx="73" cy="58" rx="4" ry="4.6" fill="#2B2550"/><circle cx="45.8" cy="56.4" r="1.4" fill="#fff"/><circle cx="71.8" cy="56.4" r="1.4" fill="#fff"/></g><path d="M40 48 q6 -3 11 0 M69 48 q5 -3 11 0" stroke="#B9822A" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
    think: '<g class="m-eyes"><path d="M42 57 q5 -5 10 0 M68 57 q5 -5 10 0" stroke="#2B2550" stroke-width="3" fill="none" stroke-linecap="round"/></g>'
  }[mood] || '';
  const beak = mood === 'wow' ? '<ellipse cx="60" cy="68" rx="6" ry="6.5" fill="#E8742A"/><path d="M53 66 q7 -6 14 0" fill="#FFA14A"/>'
    : mood === 'sad' ? '<path d="M54 68 l6 -3 l6 3 l-6 4 z" fill="#FFA14A" stroke="#D9732A" stroke-width="1.4" stroke-linejoin="round"/>'
      : '<path d="M53 64 l7 -3 l7 3 l-7 8 z" fill="#FFA14A" stroke="#D9732A" stroke-width="1.4" stroke-linejoin="round"/>';
  const wings = mood === 'wow'
    ? '<path class="m-wl" d="M22 66 q-14 -10 -14 -24 q12 4 18 16 z" fill="url(#g-yellow)" stroke="#D18E1C" stroke-width="1.8" stroke-linejoin="round"/><path class="m-wr" d="M98 66 q14 -10 14 -24 q-12 4 -18 16 z" fill="url(#g-yellow)" stroke="#D18E1C" stroke-width="1.8" stroke-linejoin="round"/>'
    : '<path class="m-wl" d="M22 64 q-12 6 -9 18 q10 -2 14 -10 z" fill="url(#g-yellow)" stroke="#D18E1C" stroke-width="1.8" stroke-linejoin="round"/><path class="m-wr" d="M98 64 q12 6 9 18 q-10 -2 -14 -10 z" fill="url(#g-yellow)" stroke="#D18E1C" stroke-width="1.8" stroke-linejoin="round"/>';
  return `<svg viewBox="0 0 120 120" class="m-svg" aria-hidden="true">
  <ellipse class="m-shadow" cx="60" cy="113" rx="30" ry="4.5" fill="#2B2550" opacity=".12"/>
  <g class="m-body">
    <path d="M53 18 q4 -12 10 -3 q5 -9 9 1" fill="none" stroke="#D18E1C" stroke-width="2.6" stroke-linecap="round"/>
    ${wings}
    <path d="M60 18 C 88 18 101 42 101 66 C 101 92 83 106 60 106 C 37 106 19 92 19 66 C 19 42 32 18 60 18 Z" fill="url(#g-yellow)" stroke="#D18E1C" stroke-width="2"/>
    <ellipse cx="42" cy="36" rx="12" ry="7" transform="rotate(-28 42 36)" fill="#fff" opacity=".5"/>
    <ellipse cx="60" cy="88" rx="22" ry="13" fill="#FFF6D2" opacity=".75"/>
    ${eyes}
    <ellipse cx="36" cy="69" rx="6" ry="3.6" fill="#FF8FA3" opacity=".6"/><ellipse cx="84" cy="69" rx="6" ry="3.6" fill="#FF8FA3" opacity=".6"/>
    ${beak}
    <path d="M49 106 v6 m-5 0 h10 M71 106 v6 m-5 0 h10" stroke="#F08A2E" stroke-width="3" stroke-linecap="round"/>
  </g></svg>`;
}

/* ---------- map scenery ---------- */
const SCENERY = {
  crystal: `<ellipse cx="32" cy="60" rx="18" ry="3" fill="#000" opacity=".25"/><path d="M20 60 L24 30 L30 22 L34 34 L32 60 Z" fill="#B9A6F5" stroke="#7E6ED6" stroke-width="1.2"/><path d="M30 60 L36 14 L42 6 L48 18 L44 60 Z" fill="#8FE3F4" stroke="#3CB4D2" stroke-width="1.2"/><path d="M42 60 L48 36 L54 32 L56 44 L52 60 Z" fill="#F7A8D8" stroke="#D16A9E" stroke-width="1.2"/><path d="M38 14 L40 46" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/><circle cx="36" cy="30" r="20" fill="url(#g-glow)" opacity=".35"/>`,
  stalag: `<ellipse cx="32" cy="60" rx="16" ry="3" fill="#000" opacity=".25"/><path d="M14 60 Q22 30 26 10 Q30 30 34 60 Z M30 60 Q38 38 42 22 Q46 40 52 60 Z" fill="#7B6E8F" stroke="#4F4563" stroke-width="1.4"/><path d="M24 22 Q22 40 20 56" stroke="#A89DBC" stroke-width="2" fill="none" opacity=".7"/>`,
  lantern: `<path d="M32 4 V14" stroke="#4F4563" stroke-width="2"/><circle cx="32" cy="34" r="22" fill="url(#g-glow)" opacity=".7"/><rect x="22" y="14" width="20" height="6" rx="2" fill="#4F4563"/><rect x="24" y="20" width="16" height="24" rx="4" fill="#FFD45C" stroke="#C99A1E" stroke-width="1.4"/><path d="M29 26 q3 -6 6 0 q0 8 -3 10 q-3 -2 -3 -10 z" fill="#FF8A3D"/><rect x="22" y="44" width="20" height="5" rx="2" fill="#4F4563"/><path d="M32 49 V60" stroke="#4F4563" stroke-width="3"/>`,
  glowshroom: `<ellipse cx="32" cy="60" rx="16" ry="3" fill="#000" opacity=".25"/><circle cx="26" cy="40" r="18" fill="url(#g-glow)" opacity=".45"/><path d="M24 58 v-14 h6 v14 z M40 58 v-8 h4 v8 z" fill="#E9E1F7"/><path d="M12 46 q2 -16 15 -16 q13 0 15 16 z" fill="#7FE0D0" stroke="#2FA797" stroke-width="1.4"/><path d="M34 52 q1 -9 8 -9 q7 0 8 9 z" fill="#C9A6FF" stroke="#8E6ED6" stroke-width="1.2"/><circle cx="20" cy="40" r="2" fill="#fff"/><circle cx="29" cy="36" r="2.4" fill="#fff"/><circle cx="36" cy="42" r="1.8" fill="#fff"/>`,
  rocks: `<ellipse cx="32" cy="58" rx="22" ry="3" fill="#000" opacity=".25"/><path d="M8 58 q2 -14 14 -16 q8 -8 16 0 q12 0 14 16 z" fill="#8C7FA3" stroke="#4F4563" stroke-width="1.4"/><path d="M36 58 q2 -10 10 -10 q8 2 8 10 z" fill="#6E6385" stroke="#4F4563" stroke-width="1.2"/><path d="M16 48 q6 -4 10 -2" stroke="#B3A8C6" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  bat: `<path d="M32 30 q-8 -10 -22 -6 q6 4 6 10 q6 -4 10 2 q2 -6 6 -6 z M32 30 q8 -10 22 -6 q-6 4 -6 10 q-6 -4 -10 2 q-2 -6 -6 -6 z" fill="#4F4563"/><ellipse cx="32" cy="32" rx="5" ry="6" fill="#4F4563"/><path d="M29 27 l1 -4 2 3 2 -3 1 4" fill="#4F4563"/><circle cx="30.5" cy="31" r="1" fill="#FFD45C"/><circle cx="33.5" cy="31" r="1" fill="#FFD45C"/>`,
  honey: `<ellipse cx="32" cy="60" rx="14" ry="3" fill="#000" opacity=".25"/><path d="M18 30 q0 -8 14 -8 q14 0 14 8 v20 q0 10 -14 10 q-14 0 -14 -10 z" fill="url(#g-yellow)" stroke="#C99A1E" stroke-width="1.4"/><rect x="20" y="18" width="24" height="6" rx="3" fill="#E7B57F" stroke="#A87140" stroke-width="1.2"/><text x="32" y="46" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="9" fill="#A2692C">HONEY</text>`,
  tree: `<ellipse cx="32" cy="60" rx="16" ry="3" fill="#2B2550" opacity=".1"/><rect x="29" y="40" width="6" height="20" rx="3" fill="#B58256"/><circle cx="32" cy="28" r="18" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1.4"/><circle cx="22" cy="36" r="10" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1.4"/><circle cx="43" cy="35" r="10" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1.4"/><ellipse cx="26" cy="20" rx="6" ry="3.5" transform="rotate(-30 26 20)" fill="#fff" opacity=".35"/>`,
  snowpine: `<ellipse cx="32" cy="60" rx="13" ry="2.6" fill="#2B2550" opacity=".12"/><rect x="29.5" y="49" width="5" height="11" rx="2" fill="#9C6B43"/><path d="M32 4 L47 26 H40 L51 42 H44 L55 52 H9 L20 42 H13 L24 26 H17 Z" fill="#2F7D5B" stroke="#1F5C42" stroke-width="1.4" stroke-linejoin="round"/><path d="M32 4 L40 16 Q36 19 32 15 Q28 19 24 16 Z M20 40 Q26 44 32 40 Q38 44 44 40 L40 34 Q32 38 24 34 Z M14 51 Q22 55 32 50 Q42 55 50 51 L46 46 Q32 50 18 46 Z" fill="#fff" opacity=".92"/>`,
  goat: `<ellipse cx="32" cy="60" rx="18" ry="3" fill="#2B2550" opacity=".12"/><path d="M18 44 q-2 14 0 16 M24 46 v14 M40 46 v14 M46 44 q2 14 0 16" stroke="#6E6290" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="32" cy="40" rx="17" ry="10" fill="url(#g-white)" stroke="#9790B0" stroke-width="1.4"/><path d="M44 34 q4 -10 10 -10 q4 2 2 10 q-2 6 -8 6 z" fill="url(#g-white)" stroke="#9790B0" stroke-width="1.4"/><path d="M50 25 q-4 -10 -12 -10 M54 24 q2 -10 -4 -14" fill="none" stroke="#8C7FA3" stroke-width="2.4" stroke-linecap="round"/><circle cx="52.5" cy="29" r="1.6" fill="#2B2550"/><path d="M55 37 q2 6 -2 9" stroke="#DCD6EA" stroke-width="3" stroke-linecap="round" fill="none"/>`,
  tent: `<ellipse cx="32" cy="58" rx="24" ry="3" fill="#2B2550" opacity=".12"/><path d="M8 56 L32 14 L56 56 Z" fill="url(#g-orange)" stroke="#C96512" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 14 L24 56 H40 Z" fill="#7A3D0E" opacity=".75"/><path d="M32 14 V8" stroke="#6E6290" stroke-width="2"/><path d="M32 8 l8 3 -8 3 z" fill="#FF6F7D"/>`,
  cairn: `<ellipse cx="32" cy="59" rx="16" ry="3" fill="#2B2550" opacity=".12"/><ellipse cx="32" cy="52" rx="15" ry="7" fill="url(#g-grey)" stroke="#9790B0" stroke-width="1.4"/><ellipse cx="31" cy="40" rx="11" ry="6" fill="url(#g-grey)" stroke="#9790B0" stroke-width="1.4"/><ellipse cx="33" cy="30" rx="8" ry="4.6" fill="url(#g-grey)" stroke="#9790B0" stroke-width="1.4"/><ellipse cx="32" cy="22" rx="5" ry="3.4" fill="url(#g-grey)" stroke="#9790B0" stroke-width="1.4"/>`,
  edelweiss: `<path d="M22 58 v-12 M34 58 v-16 M44 58 v-10" stroke="#5FA336" stroke-width="2" stroke-linecap="round"/>${[[22, 44], [34, 39], [44, 46]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-4" rx="2.2" ry="4.4" fill="#fff" stroke="#DCD6EA" stroke-width=".8" transform="rotate(${r})"/>`).join('')}<circle r="2.2" fill="#FFD45C"/></g>`).join('')}`,
  cactus: `<ellipse cx="32" cy="61" rx="15" ry="2.6" fill="#2B2550" opacity=".12"/><path d="M27 61 V18 Q27 9 32 9 Q37 9 37 18 V61 Z" fill="#5DBB63" stroke="#2E7D3A" stroke-width="1.6"/><path d="M27 38 H19 Q14 38 14 32 V24 Q14 20 17.5 20 Q21 20 21 24 V31 H27 M37 32 H44 V22 Q44 18 47.5 18 Q51 18 51 22 V32 Q51 39 45 39 H37" fill="#5DBB63" stroke="#2E7D3A" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 14 V58 M18 24 V32 M48 22 V32" stroke="#8FD98F" stroke-width="1.4" opacity=".8"/><circle cx="32" cy="9" r="3.4" fill="url(#g-pink)"/>`,
  camel: `<ellipse cx="32" cy="61" rx="22" ry="2.6" fill="#2B2550" opacity=".12"/><path d="M16 44 v16 M22 46 v14 M40 46 v14 M46 44 v16" stroke="#B9834F" stroke-width="3.4" stroke-linecap="round"/><path d="M12 44 Q12 30 20 30 Q24 20 30 30 Q35 22 40 30 Q46 30 48 38 Q48 46 40 47 H18 Q12 47 12 44 Z" fill="#E2B57F" stroke="#B9834F" stroke-width="1.5" stroke-linejoin="round"/><path d="M45 36 Q50 22 52 16 Q54 12 58 13 Q61 15 59 18 L55 20 Q52 30 49 38 Z" fill="#E2B57F" stroke="#B9834F" stroke-width="1.5" stroke-linejoin="round"/><circle cx="56" cy="15.5" r="1.3" fill="#2B2550"/><path d="M12 36 q-4 4 -2 10" stroke="#B9834F" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M24 30 q4 -6 8 0" fill="#E85D75" opacity=".85"/>`,
  oasis: `<ellipse cx="32" cy="56" rx="26" ry="7" fill="#6FC3E8" stroke="#3E9CCB" stroke-width="1.4"/><ellipse cx="28" cy="54" rx="10" ry="2" fill="#fff" opacity=".6"/><path d="M40 55 Q38 34 44 14" stroke="#B9834F" stroke-width="3.4" fill="none" stroke-linecap="round"/><g fill="#4FAE5A" stroke="#2E7D3A" stroke-width="1.2" stroke-linejoin="round"><path d="M44 14 Q34 8 24 14 Q34 12 44 16 Z"/><path d="M44 14 Q54 6 62 12 Q52 12 44 16 Z"/><path d="M44 14 Q38 22 34 32 Q42 22 45 16 Z"/><path d="M44 14 Q52 20 56 30 Q48 22 43 16 Z"/><path d="M44 14 Q44 4 50 2 Q46 8 45 14 Z"/></g>`,
  pyramid: `<ellipse cx="32" cy="60" rx="26" ry="2.6" fill="#2B2550" opacity=".1"/><path d="M4 58 L30 14 L60 58 Z" fill="#F2C873" stroke="#C98A3E" stroke-width="1.5" stroke-linejoin="round"/><path d="M30 14 L60 58 H38 Z" fill="#D9A653"/><path d="M14 42 H46 M20 32 H40 M10 50 H52 M24 24 H36" stroke="#C98A3E" stroke-width="1" opacity=".6"/>`,
  dunerock: `<ellipse cx="32" cy="58" rx="22" ry="3" fill="#2B2550" opacity=".1"/><path d="M8 58 Q12 38 24 36 Q30 26 40 32 Q54 34 56 58 Z" fill="#D69A5A" stroke="#A86B34" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 46 q8 -4 14 0 M36 40 q6 -2 10 2" stroke="#A86B34" stroke-width="1.2" fill="none" opacity=".7"/>`,
  tumble: `<ellipse cx="32" cy="60" rx="13" ry="2.4" fill="#2B2550" opacity=".1"/><g fill="none" stroke="#B98654" stroke-width="1.5" stroke-linecap="round"><circle cx="32" cy="45" r="13"/><path d="M20 40 q12 6 24 -4 M22 52 q10 -10 22 0 M26 34 q6 12 0 22 M38 34 q-8 10 2 22 M19 46 q12 -2 26 4"/></g>`,
  desertflag: `<path d="M20 60 V6" stroke="#8B6A3E" stroke-width="3" stroke-linecap="round"/><path class="flagw" d="M21 7 q12 -4 24 2 q-2 7 0 14 q-12 -6 -24 -2 z" fill="url(#g-orange)" stroke="#C96512" stroke-width="1.2" stroke-linejoin="round"/><circle cx="33" cy="15" r="3.6" fill="#FFF3B0"/>`,
  sumflag: `<path d="M20 60 V6" stroke="#6E6290" stroke-width="3" stroke-linecap="round"/><path class="flagw" d="M21 7 q12 -4 24 2 q-2 7 0 14 q-12 -6 -24 -2 z" fill="url(#g-coral)" stroke="#C23C4B" stroke-width="1.2" stroke-linejoin="round"/><circle cx="33" cy="15" r="3.6" fill="#FFD45C"/>`,
  pine: `<ellipse cx="32" cy="60" rx="12" ry="2.6" fill="#2B2550" opacity=".1"/><rect x="29.5" y="48" width="5" height="12" rx="2" fill="#B58256"/><path d="M32 6 L48 30 H40 L52 50 H12 L24 30 H16 Z" fill="url(#g-mint)" stroke="${PAL.mint[3]}" stroke-width="1.4" stroke-linejoin="round"/>`,
  bush: `<ellipse cx="32" cy="56" rx="20" ry="3" fill="#2B2550" opacity=".1"/><path d="M12 54 q-4 -12 8 -14 q2 -10 12 -8 q10 -4 14 6 q10 2 6 16 z" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1.4"/><circle cx="24" cy="44" r="2" fill="#FF8FA3"/><circle cx="38" cy="40" r="2" fill="#FFD45C"/><circle cx="44" cy="49" r="2" fill="#FF8FA3"/>`,
  flowers: `<path d="M20 58 v-10 M32 58 v-14 M44 58 v-9" stroke="#5FA336" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="46" r="4" fill="url(#g-pink)"/><circle cx="32" cy="42" r="4.5" fill="url(#g-yellow)"/><circle cx="44" cy="47" r="4" fill="url(#g-lilac)"/>`,
  rock: `<ellipse cx="32" cy="56" rx="18" ry="3" fill="#2B2550" opacity=".1"/><path d="M14 56 q-2 -12 10 -16 q8 -6 16 0 q12 2 10 16 z" fill="url(#g-grey)" stroke="${PAL.grey[3]}" stroke-width="1.4"/>`,
  house: `<ellipse cx="32" cy="60" rx="22" ry="3" fill="#2B2550" opacity=".1"/><rect x="14" y="32" width="36" height="28" rx="3" fill="url(#l-white)" stroke="${PAL.white[3]}" stroke-width="1.4"/><path d="M8 34 L32 12 L56 34 Z" fill="url(#g-coral)" stroke="${PAL.coral[3]}" stroke-width="1.4" stroke-linejoin="round"/><rect x="27" y="44" width="10" height="16" rx="2" fill="#C98E55"/><rect x="17" y="40" width="7" height="7" rx="1.5" fill="#CFE6FF"/><rect x="40" y="40" width="7" height="7" rx="1.5" fill="#CFE6FF"/>`,
  sign: `<ellipse cx="32" cy="60" rx="10" ry="2" fill="#2B2550" opacity=".1"/><rect x="30" y="30" width="4" height="30" rx="2" fill="#B58256"/><rect x="14" y="18" width="36" height="16" rx="4" fill="url(#l-tan)" stroke="${PAL.tan[3]}" stroke-width="1.4"/><text x="32" y="30" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="11" fill="#6B4223">123</text>`,
  palm: `<ellipse cx="32" cy="61" rx="12" ry="2.4" fill="#2B2550" opacity=".1"/><path d="M33 61 q-4 -20 2 -38" fill="none" stroke="#B58256" stroke-width="5" stroke-linecap="round"/><path d="M35 22 q-14 -10 -26 0 q12 -2 26 2 z M35 22 q14 -10 26 0 q-12 -2 -26 2 z M35 22 q-6 -14 -18 -16 q10 6 16 18 z M35 22 q8 -14 20 -14 q-12 6 -18 16 z" fill="url(#g-green)" stroke="${PAL.green[3]}" stroke-width="1.2" stroke-linejoin="round"/>`,
  shop: `<ellipse cx="32" cy="61" rx="24" ry="2.6" fill="#2B2550" opacity=".1"/><rect x="12" y="30" width="40" height="30" rx="3" fill="url(#l-white)" stroke="${PAL.white[3]}" stroke-width="1.4"/><path d="M8 30 h48 l-4 -14 h-40 z" fill="url(#l-coral)" stroke="${PAL.coral[3]}" stroke-width="1.4" stroke-linejoin="round"/><path d="M18 16 l-2 14 M26 16 l-1 14 M38 16 l1 14 M46 16 l2 14" stroke="#fff" stroke-width="3" opacity=".75"/><rect x="18" y="40" width="28" height="10" rx="2" fill="#FFE6A3"/><circle cx="24" cy="45" r="3" fill="url(#g-orange)"/><circle cx="32" cy="45" r="3" fill="url(#g-red)"/><circle cx="40" cy="45" r="3" fill="url(#g-green)"/>`,
  umbrella: `<ellipse cx="32" cy="61" rx="18" ry="2.6" fill="#2B2550" opacity=".1"/><path d="M32 22 L36 61" stroke="#B58256" stroke-width="2.6" stroke-linecap="round"/><path d="M6 26 Q32 -2 58 26 Q51 21 45 26 Q38 20 32 26 Q26 20 19 26 Q13 21 6 26 Z" fill="url(#g-coral)" stroke="${PAL.coral[3]}" stroke-width="1.4" stroke-linejoin="round"/><path d="M19 26 Q24 10 32 4 M45 26 Q40 10 32 4" fill="none" stroke="#fff" stroke-width="2.4" opacity=".8"/>`,
  starfish: `<ellipse cx="32" cy="58" rx="16" ry="2.6" fill="#2B2550" opacity=".1"/><path d="M32 22 l5 12 13 1 -10 8 4 13 -12 -7 -12 7 4 -13 -10 -8 13 -1 z" fill="url(#g-orange)" stroke="${PAL.orange[3]}" stroke-width="1.4" stroke-linejoin="round"/><g fill="#FFF3B0"><circle cx="32" cy="32" r="1.3"/><circle cx="32" cy="42" r="1.3"/><circle cx="26" cy="44" r="1.1"/><circle cx="38" cy="44" r="1.1"/></g>`,
  shell: `<ellipse cx="32" cy="58" rx="14" ry="2.4" fill="#2B2550" opacity=".1"/><path d="M14 52 Q12 26 32 22 Q52 26 50 52 Q32 60 14 52 Z" fill="url(#g-pink)" stroke="${PAL.pink[3]}" stroke-width="1.4"/><path d="M32 22 V56 M23 25 L26 55 M41 25 L38 55 M17 32 L21 53 M47 32 L43 53" stroke="${PAL.pink[3]}" stroke-width="1.2" opacity=".7"/>`,
  boat: `<path d="M8 46 h48 l-8 12 h-32 z" fill="url(#l-coral)" stroke="${PAL.coral[3]}" stroke-width="1.4" stroke-linejoin="round"/><path d="M32 8 V46" stroke="#B58256" stroke-width="2.4"/><path d="M34 10 L54 42 H34 Z" fill="url(#l-white)" stroke="${PAL.white[3]}" stroke-width="1.2"/><path d="M30 16 L14 42 H30 Z" fill="url(#l-sky)" stroke="${PAL.sky[3]}" stroke-width="1.2"/>`,
  lifebuoy: `<circle cx="32" cy="36" r="18" fill="none" stroke="#fff" stroke-width="10"/><circle cx="32" cy="36" r="18" fill="none" stroke="${PAL.coral[1]}" stroke-width="10" stroke-dasharray="14.1 14.1"/><circle cx="32" cy="36" r="23" fill="none" stroke="${PAL.coral[3]}" stroke-width="1.2"/><circle cx="32" cy="36" r="13" fill="none" stroke="${PAL.coral[3]}" stroke-width="1.2"/>`,
  crab: ART.crab,
  jtree: `<ellipse cx="32" cy="61" rx="20" ry="3" fill="#2B2550" opacity=".1"/><path d="M27 61 q-6 0 -9 2 q4 -6 7 -8 l1 -22 h12 l1 22 q3 2 7 8 q-3 -2 -9 -2 z" fill="#A9764A"/><path d="M30 34 v26 M35 36 v22" stroke="#8C5E36" stroke-width="1.2" opacity=".6"/><path d="M32 40 q-10 4 -14 14" fill="none" stroke="#5FA336" stroke-width="1.6" stroke-linecap="round"/><g fill="url(#g-leaf)" stroke="${PAL.leaf[3]}" stroke-width="1.3"><ellipse cx="18" cy="30" rx="14" ry="10"/><ellipse cx="46" cy="30" rx="14" ry="10"/><ellipse cx="32" cy="18" rx="17" ry="12"/><ellipse cx="32" cy="32" rx="12" ry="8"/></g><g fill="#fff" opacity=".35"><ellipse cx="26" cy="13" rx="6" ry="3"/><ellipse cx="12" cy="26" rx="4" ry="2"/></g><circle cx="44" cy="24" r="2.2" fill="#FF6F7D"/><circle cx="21" cy="34" r="2" fill="#FFD45C"/>`,
  fern: `<ellipse cx="32" cy="59" rx="18" ry="2.6" fill="#2B2550" opacity=".1"/><g fill="url(#g-jade)" stroke="${PAL.jade[3]}" stroke-width="1.1" stroke-linejoin="round"><path d="M32 58 q-6 -14 -22 -18 q10 8 20 18 z"/><path d="M32 58 q6 -14 22 -18 q-10 8 -20 18 z"/><path d="M32 58 q-10 -20 -8 -36 q6 16 9 36 z"/><path d="M32 58 q10 -20 8 -36 q-6 16 -9 36 z"/><path d="M32 58 q0 -24 0 -40 q3 18 1 40 z"/></g><path d="M30 56 q-4 -14 -6 -30 M34 56 q4 -14 6 -30" fill="none" stroke="#fff" stroke-width="1" opacity=".5"/>`,
  banana: `<ellipse cx="32" cy="61" rx="14" ry="2.6" fill="#2B2550" opacity=".1"/><path d="M31 61 q-2 -16 1 -30 h4 q2 14 0 30 z" fill="#9BC46A"/><g fill="url(#g-leaf)" stroke="${PAL.leaf[3]}" stroke-width="1.2" stroke-linejoin="round"><path d="M33 31 q-10 -14 -28 -12 q14 10 28 16 z"/><path d="M33 31 q12 -16 28 -10 q-14 6 -28 14 z"/><path d="M33 31 q-4 -18 4 -28 q2 14 -2 28 z"/><path d="M33 33 q-16 -2 -24 10 q14 -4 24 -6 z"/></g><path d="M8 20 q12 4 25 11 M60 22 q-14 2 -27 10" fill="none" stroke="#fff" stroke-width="1" opacity=".55"/><g fill="url(#g-yellow)" stroke="#D18E1C" stroke-width=".9"><path d="M36 36 q6 2 7 8 q-5 -2 -7 -5 z"/><path d="M35 39 q7 3 6 9 q-4 -3 -6 -6 z"/></g>`,
  mushroom: `<ellipse cx="32" cy="58" rx="14" ry="2.4" fill="#2B2550" opacity=".1"/><path d="M28 58 q-1 -8 1 -14 h6 q2 6 1 14 z" fill="#FFF3DF" stroke="#E6CFA8" stroke-width="1"/><path d="M14 46 q2 -16 18 -16 q16 0 18 16 q-18 4 -36 0 z" fill="url(#g-coral)" stroke="${PAL.coral[3]}" stroke-width="1.3"/><g fill="#fff"><circle cx="24" cy="39" r="2.6"/><circle cx="35" cy="35" r="2.2"/><circle cx="42" cy="42" r="2"/></g><path d="M44 58 q0 -5 1 -8 h3 q1 3 0 8 z" fill="#FFF3DF"/><path d="M40 51 q1 -7 6.5 -7 q5.5 0 6.5 7 q-6.5 1.6 -13 0 z" fill="url(#g-orange)" stroke="${PAL.orange[3]}" stroke-width="1"/>`,
  frog: `<ellipse cx="32" cy="58" rx="15" ry="2.4" fill="#2B2550" opacity=".1"/><path d="M16 56 q-2 -14 16 -16 q18 2 16 16 q-16 4 -32 0 z" fill="url(#g-jade)" stroke="${PAL.jade[3]}" stroke-width="1.3"/><circle cx="24" cy="40" r="6" fill="url(#g-jade)" stroke="${PAL.jade[3]}" stroke-width="1.3"/><circle cx="40" cy="40" r="6" fill="url(#g-jade)" stroke="${PAL.jade[3]}" stroke-width="1.3"/><circle cx="24" cy="40" r="3.2" fill="#fff"/><circle cx="40" cy="40" r="3.2" fill="#fff"/><circle cx="24.6" cy="40.6" r="1.8" fill="#2B2550"/><circle cx="40.6" cy="40.6" r="1.8" fill="#2B2550"/><path d="M26 50 q6 4 12 0" fill="none" stroke="#2B2550" stroke-width="1.5" stroke-linecap="round"/><circle cx="21" cy="49" r="2" fill="#FF8FA3" opacity=".7"/><circle cx="43" cy="49" r="2" fill="#FF8FA3" opacity=".7"/><path d="M14 57 q-3 1 -4 0 M50 57 q3 1 4 0" stroke="${PAL.jade[3]}" stroke-width="2" stroke-linecap="round"/>`,
  heliconia: `<path d="M32 60 V22" stroke="#5FA336" stroke-width="2.4" stroke-linecap="round"/><g stroke-linejoin="round" stroke-width="1.1"><path d="M32 26 l-12 -4 q2 6 12 8 z" fill="url(#g-red)" stroke="${PAL.red[3]}"/><path d="M32 34 l12 -4 q-2 6 -12 8 z" fill="url(#g-red)" stroke="${PAL.red[3]}"/><path d="M32 42 l-12 -4 q2 6 12 8 z" fill="url(#g-red)" stroke="${PAL.red[3]}"/><path d="M32 50 l11 -3 q-2 5 -11 7 z" fill="url(#g-red)" stroke="${PAL.red[3]}"/></g><g fill="#FFD45C"><path d="M20 22 l-2 -1 1 2z"/><circle cx="20.5" cy="22.5" r="1.6"/><circle cx="43.5" cy="30.5" r="1.6"/><circle cx="20.5" cy="38.5" r="1.6"/><circle cx="42.5" cy="47" r="1.5"/></g><path d="M32 60 q-12 -4 -14 -14 q10 2 14 14 z" fill="url(#g-leaf)" stroke="${PAL.leaf[3]}" stroke-width="1"/>`,
  log: `<ellipse cx="32" cy="58" rx="22" ry="2.6" fill="#2B2550" opacity=".1"/><rect x="10" y="44" width="40" height="13" rx="6.5" fill="#B9834F"/><path d="M14 48 h20 M20 53 h22" stroke="#8C5E36" stroke-width="1.2" stroke-linecap="round" opacity=".6"/><ellipse cx="50" cy="50.5" rx="5" ry="6.5" fill="#E8C391"/><ellipse cx="50" cy="50.5" rx="2.6" ry="3.6" fill="none" stroke="#B9834F" stroke-width="1"/><path d="M18 44 q2 -6 6 -4 q-2 2 -2 4 z M28 44 q1 -5 5 -5 q-2 3 -1 5 z" fill="url(#g-jade)"/><circle cx="40" cy="42" r="3" fill="url(#g-coral)"/><path d="M38.5 41 h3" stroke="#fff" stroke-width=".9"/>`,
  butterfly: `<g class="bfly"><path d="M32 40 q-14 -16 -18 -4 q-2 8 18 6 z" fill="url(#g-sky)" stroke="${PAL.sky[3]}" stroke-width="1.1"/><path d="M32 40 q14 -16 18 -4 q2 8 -18 6 z" fill="url(#g-sky)" stroke="${PAL.sky[3]}" stroke-width="1.1"/><path d="M32 42 q-10 4 -11 11 q8 0 11 -9 z M32 42 q10 4 11 11 q-8 0 -11 -9 z" fill="url(#g-orange)" stroke="${PAL.orange[3]}" stroke-width="1"/><rect x="31" y="34" width="2" height="16" rx="1" fill="#2B2550"/><path d="M32 34 q-3 -5 -6 -6 M32 34 q3 -5 6 -6" fill="none" stroke="#2B2550" stroke-width="1" stroke-linecap="round"/><circle cx="21" cy="35" r="2.2" fill="#fff" opacity=".7"/><circle cx="43" cy="35" r="2.2" fill="#fff" opacity=".7"/></g>`,
  fishjump: `<path d="M10 50 q22 -10 44 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/><g transform="rotate(-28 32 30) translate(4 -6) scale(.85)">${ART.fish}</g><circle cx="14" cy="44" r="2.4" fill="#fff" opacity=".8"/><circle cx="50" cy="42" r="1.8" fill="#fff" opacity=".8"/>`,
  grass: `<path d="M24 58 q2 -8 4 -10 M30 58 q0 -10 2 -12 M36 58 q-1 -8 -4 -10 M40 58 q1 -6 4 -8" stroke="#8CCB52" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
};
const sceneryHTML = k => `<svg viewBox="0 0 64 64" aria-hidden="true">${SCENERY[k]}</svg>`;

/* ---------- boss: original "ราชาปีศาจตัวเลข" rig, recoloured per city ---------- */
function bossSVG(state = 'idle', pal = 'lilac', emblem = '?', kind = 'blob') {
  if (kind === 'mega') return megaBossSVG(state, emblem);
  const [l, b, d, line] = PAL[pal];
  const ink = '#2B2550';
  const openEyes = (brow) => `<ellipse cx="45" cy="56" rx="6" ry="7" fill="#fff"/><ellipse cx="75" cy="56" rx="6" ry="7" fill="#fff"/><circle cx="46" cy="57" r="3.6" fill="${ink}"/><circle cx="74" cy="57" r="3.6" fill="${ink}"/>${brow}`;
  const eyes = {
    down: `<path d="M40 52 l8 8 M48 52 l-8 8 M72 52 l8 8 M80 52 l-8 8" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>`,
    hit: `<path d="M38 56 q6 -6 12 0 M70 56 q6 -6 12 0" stroke="${ink}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
    roar: openEyes(`<path d="M34 42 l16 8 M86 42 l-16 8" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`),
    flex: `<path d="M39 58 q6 -7 12 0 M69 58 q6 -7 12 0" stroke="${ink}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M36 46 l12 3 M84 46 l-12 3" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`,
    sleepy: `<path d="M39 57 q6 4 12 0 M69 57 q6 4 12 0" stroke="${ink}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
    wink: `<ellipse cx="45" cy="56" rx="6" ry="7" fill="#fff"/><circle cx="46" cy="57" r="3.6" fill="${ink}"/><path d="M69 57 q6 -6 12 0" stroke="${ink}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M36 44 l14 5" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>`,
    ink: `<path d="M38 54 l10 4 l-10 4 M82 54 l-10 4 l10 4" stroke="${ink}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  }[state] || openEyes(`<path d="M36 44 l14 5 M84 44 l-14 5" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>`);
  const mouth = {
    down: `<path d="M50 78 q10 -6 20 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    laugh: `<path d="M46 72 q14 16 28 0 z" fill="${ink}"/><path d="M52 75 l3 4 l3 -4 M62 75 l3 4 l3 -4" fill="#fff"/>`,
    roar: `<ellipse cx="60" cy="80" rx="15" ry="13" fill="${ink}"/><ellipse cx="60" cy="86" rx="8" ry="5" fill="#FF7B86"/><path d="M47 72 l4 6 l4 -6 M65 72 l4 6 l4 -6 M50 90 l3 -5 l3 5 M64 90 l3 -5 l3 5" fill="#fff"/>`,
    flex: `<path d="M46 72 q14 12 28 0" fill="#fff" stroke="${ink}" stroke-width="2.6" stroke-linejoin="round"/><path d="M53 72 v6 M60 73 v7 M67 72 v6" stroke="${ink}" stroke-width="1.4"/>`,
    sleepy: `<ellipse cx="60" cy="78" rx="5" ry="6" fill="${ink}"/>`,
    wink: `<path d="M48 74 q12 10 24 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M62 77 q4 9 9 2" fill="#FF7B86" stroke="${ink}" stroke-width="1.6"/>`,
    ink: `<ellipse cx="44" cy="72" rx="8" ry="6" fill="#fff" opacity=".35"/><ellipse cx="76" cy="72" rx="8" ry="6" fill="#fff" opacity=".35"/><circle cx="60" cy="76" r="5.5" fill="${ink}"/><circle cx="60" cy="76" r="2.2" fill="#3A2F5C"/>`
  }[state] || `<path d="M48 74 q12 8 24 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M53 75 l3 4 l3 -3 M61 75 l3 3 l3 -4" fill="#fff" stroke="${ink}" stroke-width="1"/>`;
  const armsUp = state === 'roar' || state === 'flex';
  const arms = armsUp
    ? `<path class="b-arm" d="M18 70 q-16 -8 -12 -26 q10 0 14 12 M102 70 q16 -8 12 -26 q-10 0 -14 12" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/>`
    : `<path class="b-arm" d="M14 82 q-12 2 -10 14 q8 2 14 -6 M106 82 q12 2 10 14 q-8 2 -14 -6" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/>`;
  const extra = state === 'down' ? '<g class="b-stars"><path d="M30 20 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z M86 14 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z" fill="#F5B52E"/></g>'
    : state === 'sleepy' ? `<g class="b-z" font-family="Nunito,sans-serif" font-weight="900" fill="${line}"><text x="92" y="30" font-size="14">z</text><text x="100" y="18" font-size="18">Z</text></g>`
      : state === 'roar' ? `<g class="b-roar" stroke="${line}" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M4 60 l-4 -3 M2 72 h-4 M4 84 l-4 3 M116 60 l4 -3 M118 72 h4 M116 84 l4 3"/></g>`
        : state === 'flex' ? `<circle cx="60" cy="70" r="56" fill="url(#g-glow)" opacity=".7"/>` : '';
  if (kind === 'octo') {
    const up = state === 'roar' || state === 'flex';
    const tent = (x, d, i) => `<path class="o-t o-t${i}" d="M${x - 8} 80 Q${x - 10 + d * 4} 102 ${x + d * 12} 118 Q${x + d * 18 + 4} 126 ${x + d * 16 + 8} 118 Q${x + d * 8 + 4} 112 ${x + 2 + d * 3} 98 Q${x + 6} 88 ${x + 8} 80 Z"/>`;
    const suck = (x, d) => [[x - 1 + d * 2, 92], [x + d * 5, 102], [x + d * 10, 110]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.9"/>`).join('');
    const front = [[34, -1], [50, -.4], [70, .4], [86, 1]];
    const backT = up
      ? `<path class="o-arm" d="M22 66 Q2 50 6 24 Q12 18 16 26 Q14 44 30 58 Z M98 66 Q118 50 114 24 Q108 18 104 26 Q106 44 90 58 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/>`
      : `<path class="o-arm" d="M24 72 Q4 84 6 108 Q8 116 14 110 Q14 92 32 82 Z M96 72 Q116 84 114 108 Q112 116 106 110 Q106 92 88 82 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/>`;
    return `<svg viewBox="0 0 120 130" class="boss-svg octo" aria-hidden="true">
  <ellipse class="b-shadow" cx="60" cy="124" rx="40" ry="5" fill="#2B2550" opacity=".14"/>
  <g class="b-body">
    ${state === 'flex' ? extra : ''}
    ${backT}
    <g class="o-front" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round">${front.map(([x, d], i) => tent(x, d, i)).join('')}</g>
    <g fill="${l}" opacity=".9">${front.map(([x, d]) => suck(x, d)).join('')}</g>
    <path d="M36 20 q-12 -4 -12 -17 q7 7 17 9 z M84 20 q12 -4 12 -17 q-7 7 -17 9 z" fill="${line}" stroke="${line}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M60 8 C93 8 106 32 104 57 C102 78 89 90 60 90 C31 90 18 78 16 57 C14 32 27 8 60 8 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
    <g fill="${l}" opacity=".55"><circle cx="78" cy="22" r="4"/><circle cx="90" cy="36" r="3"/><circle cx="30" cy="40" r="2.6"/><circle cx="85" cy="50" r="2.2"/></g>
    <ellipse cx="40" cy="26" rx="12" ry="7" transform="rotate(-28 40 26)" fill="#fff" opacity=".45"/>
    <circle cx="60" cy="31" r="9.5" fill="#fff" opacity=".9"/><text x="60" y="${String(emblem).length > 2 ? 34 : 36}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 2 ? 8.5 : 14}" fill="${line}">${emblem}</text>
    ${eyes}${mouth}
    ${state !== 'flex' ? extra : ''}
  </g></svg>`;
  }
  if (kind === 'snake') {
    const up = state === 'roar' || state === 'flex', tongue = ['idle', 'roar', 'laugh', 'wink'].includes(state);
    const coil = (cy, rx, ry, cls) => `<g class="${cls}"><ellipse cx="60" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2"/><path d="M${60 - rx * .78} ${cy + ry * .2} Q60 ${cy + ry * 1.25} ${60 + rx * .78} ${cy + ry * .2}" fill="none" stroke="${l}" stroke-width="${ry * .7}" stroke-linecap="round" opacity=".75"/><g fill="${d}" opacity=".55">${[-.55, -.18, .2, .56].map(k => `<path d="M${60 + rx * k} ${cy - ry * .55} l4 3 -4 3 -4 -3 z"/>`).join('')}</g></g>`;
    return `<svg viewBox="0 0 120 130" class="boss-svg snake" aria-hidden="true">
  <ellipse class="b-shadow" cx="60" cy="125" rx="46" ry="5" fill="#2B2550" opacity=".14"/>
  <g class="b-body">
    ${state === 'flex' ? extra : ''}
    <path class="s-tail" d="M96 118 Q114 112 112 94 Q111 84 104 80 Q108 90 104 100 Q99 110 88 112 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/>
    <g class="s-rattle" fill="#F5C64E" stroke="#C99A1E" stroke-width="1.2"><ellipse cx="104.5" cy="79" rx="3.6" ry="2.6"/><ellipse cx="103" cy="74.5" rx="3" ry="2.2"/></g>
    ${coil(113, 47, 11, 's-coil s-c1')}
    ${coil(100, 39, 10, 's-coil s-c2')}
    <g class="s-head${up ? ' up' : ''}">
      <path d="M36 22 q-8 -12 -2 -18 q6 6 10 14 z M84 22 q8 -12 2 -18 q-6 6 -10 14 z" fill="url(#g-leaf)" stroke="${PAL.leaf[3]}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M60 14 C94 14 106 38 104 58 C102 80 86 92 60 92 C34 92 18 80 16 58 C14 38 26 14 60 14 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
      <path d="M30 76 Q60 98 90 76 Q84 90 60 91 Q36 90 30 76 Z" fill="${l}" opacity=".8"/>
      <g fill="${d}" opacity=".5"><path d="M44 22 l4 3 -4 3 -4 -3z"/><path d="M76 22 l4 3 -4 3 -4 -3z"/><path d="M26 44 l3 2.5 -3 2.5 -3 -2.5z"/><path d="M94 44 l3 2.5 -3 2.5 -3 -2.5z"/></g>
      <ellipse cx="40" cy="28" rx="11" ry="6" transform="rotate(-24 40 28)" fill="#fff" opacity=".42"/>
      <circle cx="60" cy="32" r="10.5" fill="#fff" opacity=".92"/><text x="60" y="35.6" text-anchor="middle" font-family="'IBM Plex Sans Thai Looped',Nunito,sans-serif" font-weight="700" font-size="${String(emblem).length > 2 ? 9 : 13}" fill="${line}">${emblem}</text>
      <ellipse cx="34" cy="68" rx="5" ry="3.2" fill="#FF8FA3" opacity=".45"/><ellipse cx="86" cy="68" rx="5" ry="3.2" fill="#FF8FA3" opacity=".45"/>
      ${eyes}${mouth}
      ${tongue ? `<path class="s-tongue" d="M60 ${state === 'roar' ? 90 : 81} v12 l-4 6 M60 ${state === 'roar' ? 102 : 93} l4 6" fill="none" stroke="#F2584A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
    </g>
    ${state !== 'flex' ? extra : ''}
  </g></svg>`;
  }
  if (kind === 'scorp') { // P4 desert boss: a cartoon scorpion king
    const up = state === 'roar' || state === 'flex';
    const claw = (x, flip) => `<g transform="translate(${x} ${up ? 34 : 52}) scale(${flip ? -1 : 1} 1)"><path d="M0 26 Q-6 10 -18 6" stroke="${line}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M0 26 Q-6 10 -18 6" stroke="url(#g-${pal})" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M-18 6 Q-34 4 -34 -10 Q-26 -16 -20 -8 Q-24 -2 -16 0 Q-10 -12 -2 -10 Q2 0 -18 6 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2" stroke-linejoin="round"/></g>`;
    let tail = '', seg = [[86, 92, 11], [98, 80, 10], [104, 64, 9], [102, 48, 8.5], [94, 36, 8]]; seg.forEach(([x, y, r]) => tail += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#g-${pal})" stroke="${line}" stroke-width="2"/>`);
    tail += `<path d="M88 32 Q80 20 86 12 Q90 22 96 26 Z" fill="#F2584A" stroke="${line}" stroke-width="1.8" stroke-linejoin="round"/>`;
    const legs = [36, 48, 72, 84].map((x, i) => `<path d="M${x} 104 q${i < 2 ? -10 : 10} 6 ${i < 2 ? -14 : 14} 16" stroke="${line}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
    return `<svg viewBox="0 0 120 130" class="boss-svg scorp" aria-hidden="true">
  <ellipse class="b-shadow" cx="60" cy="124" rx="46" ry="5" fill="#2B2550" opacity=".16"/>
  <g class="b-body">
    ${state === 'flex' ? extra : ''}
    <g class="b-tail">${tail}</g>
    ${legs}
    <ellipse cx="60" cy="98" rx="34" ry="18" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
    <path d="M34 96 q26 8 52 0 M38 104 q22 6 44 0" stroke="${line}" stroke-width="1.4" fill="none" opacity=".5"/>
    <g class="b-arm">${claw(30, false)}${claw(90, true)}</g>
    <circle cx="60" cy="60" r="30" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
    <path d="M40 32 L44 20 L52 28 L60 16 L68 28 L76 20 L80 32 Z" fill="#FFD45C" stroke="#C98612" stroke-width="1.8" stroke-linejoin="round"/>
    <ellipse cx="46" cy="44" rx="8" ry="4.6" transform="rotate(-28 46 44)" fill="#fff" opacity=".45"/>
    ${eyes}
    <g transform="translate(0 2)">${mouth}</g>
    <circle cx="60" cy="98" r="10" fill="#fff" opacity=".95"/><text x="60" y="${String(emblem).length > 2 ? 101.5 : 103}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 2 ? 8 : 13}" fill="${line}">${emblem}</text>
    ${state !== 'flex' ? extra : ''}
  </g></svg>`;
  }
  if (kind === 'yeti') { // P6 mountain boss: a shaggy snow yeti
    const up = state === 'roar' || state === 'flex', tuft = (x, y, s = 1) => `<path d="M${x - 8 * s} ${y} l${3 * s} ${-7 * s} l${3 * s} ${5 * s} l${3 * s} ${-8 * s} l${3 * s} ${7 * s} l${3 * s} ${-5 * s} l${2 * s} ${8 * s} z" fill="url(#g-${pal})" stroke="${line}" stroke-width="1.6" stroke-linejoin="round"/>`;
    const arms = up
      ? `<g class="b-arm"><path d="M26 80 Q6 60 14 30 Q24 24 30 34 Q26 56 38 72 Z M94 80 Q114 60 106 30 Q96 24 90 34 Q94 56 82 72 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="20" cy="30" r="7" fill="#8FD3F4" stroke="#3F8BDB" stroke-width="1.4"/><circle cx="100" cy="30" r="7" fill="#8FD3F4" stroke="#3F8BDB" stroke-width="1.4"/></g>`
      : `<g class="b-arm"><path d="M24 76 Q4 88 10 110 Q20 116 26 106 Q22 92 36 84 Z M96 76 Q116 88 110 110 Q100 116 94 106 Q98 92 84 84 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/></g>`;
    return `<svg viewBox="0 0 120 130" class="boss-svg yeti" aria-hidden="true">
  <ellipse class="b-shadow" cx="60" cy="124" rx="44" ry="5" fill="#2B2550" opacity=".16"/>
  <g class="b-body">
    ${state === 'flex' ? extra : ''}
    <path d="M22 100 Q18 70 34 62 H86 Q102 70 98 100 Q98 120 84 122 H36 Q22 120 22 100 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
    ${tuft(36, 122)}${tuft(60, 123)}${tuft(84, 122)}
    <ellipse cx="60" cy="100" rx="22" ry="15" fill="#DDEBFA" opacity=".9"/>
    ${arms}
    <path d="M30 30 Q18 14 26 4 Q30 16 40 22 Z M90 30 Q102 14 94 4 Q90 16 80 22 Z" fill="#E9DFC8" stroke="#A89A7A" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="60" cy="52" r="34" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
    ${tuft(46, 22, 1.1)}${tuft(66, 20, 1.2)}
    <path d="M36 50 Q36 36 60 36 Q84 36 84 50 Q84 80 60 82 Q36 80 36 50 Z" fill="#B8D6F2" stroke="${line}" stroke-width="1.6"/>
    <ellipse cx="44" cy="34" rx="9" ry="5" transform="rotate(-28 44 34)" fill="#fff" opacity=".45"/>
    ${eyes}
    <ellipse cx="60" cy="66" rx="5.5" ry="3.6" fill="${ink}"/>
    <g transform="translate(0 6)">${mouth}</g>
    <circle cx="60" cy="104" r="10" fill="#fff" opacity=".95"/><text x="60" y="${String(emblem).length > 2 ? 107.5 : 109}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 2 ? 8 : 13}" fill="${line}">${emblem}</text>
    ${state !== 'flex' ? extra : ''}
  </g></svg>`;
  }
  if (kind === 'bear') { // P5 cave boss: a big brown bear
    const up = state === 'roar' || state === 'flex', claws = (x, y, d) => `<path d="M${x - 5} ${y + 4} l${d * 2} 5 M${x} ${y + 6} v5 M${x + 5} ${y + 4} l${-d * 2} 5" stroke="#FFF3D9" stroke-width="2" stroke-linecap="round"/>`;
    const paws = up
      ? `<g class="b-arm"><path d="M24 78 Q6 60 12 34 Q20 28 26 36 Q24 56 36 70 Z M96 78 Q114 60 108 34 Q100 28 94 36 Q96 56 84 70 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/>${claws(18, 28, 1)}${claws(102, 28, -1)}</g>`
      : `<g class="b-arm"><path d="M22 76 Q6 86 10 106 Q18 112 24 104 Q22 92 34 84 Z M98 76 Q114 86 110 106 Q102 112 96 104 Q98 92 86 84 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/>${claws(16, 104, 1)}${claws(104, 104, -1)}</g>`;
    return `<svg viewBox="0 0 120 130" class="boss-svg bear" aria-hidden="true">
  <ellipse class="b-shadow" cx="60" cy="124" rx="42" ry="5" fill="#2B2550" opacity=".16"/>
  <g class="b-body">
    ${state === 'flex' ? extra : ''}
    <ellipse cx="60" cy="96" rx="40" ry="28" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
    <ellipse cx="40" cy="120" rx="13" ry="7" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2"/><ellipse cx="80" cy="120" rx="13" ry="7" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2"/>
    <ellipse cx="60" cy="100" rx="23" ry="17" fill="${l}" opacity=".85"/>
    ${paws}
    <circle cx="30" cy="26" r="12" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2"/><circle cx="30" cy="26" r="6" fill="${l}"/>
    <circle cx="90" cy="26" r="12" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2"/><circle cx="90" cy="26" r="6" fill="${l}"/>
    <circle cx="60" cy="54" r="34" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
    <path d="M44 22 l5 -12 l6 9 l5 -11 l5 11 l6 -9 l5 12 z" fill="url(#g-yellow)" stroke="#D18E1C" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="42" cy="36" rx="10" ry="5.5" transform="rotate(-28 42 36)" fill="#fff" opacity=".35"/>
    <ellipse cx="60" cy="74" rx="17" ry="13" fill="${l}"/>
    ${eyes}
    <ellipse cx="60" cy="66" rx="6.5" ry="4.2" fill="${ink}"/><ellipse cx="58" cy="64.6" rx="2" ry="1.1" fill="#fff" opacity=".6"/>
    <g transform="translate(0 6)">${mouth}</g>
    <circle cx="60" cy="107" r="10" fill="#fff" opacity=".92"/><text x="60" y="${String(emblem).length > 2 ? 110.5 : 112}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 2 ? 9 : 14}" fill="${line}">${emblem}</text>
    ${state !== 'flex' ? extra : ''}
  </g></svg>`;
  }
  return `<svg viewBox="0 0 120 130" class="boss-svg" aria-hidden="true">
  <ellipse class="b-shadow" cx="60" cy="124" rx="38" ry="5" fill="#2B2550" opacity=".14"/>
  <g class="b-body">
    ${state === 'flex' ? extra : ''}
    ${kind === 'octo' ? '' : `<path d="M30 34 l-10 -22 l22 12 z M90 34 l10 -22 l-22 12 z" fill="${line}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>`}
    <path d="M42 22 l6 -14 l6 10 l6 -12 l6 12 l6 -10 l6 14 z" fill="url(#g-yellow)" stroke="#D18E1C" stroke-width="2" stroke-linejoin="round"/>
    <path d="M60 22 C92 22 106 46 106 74 C106 104 88 120 60 120 C32 120 14 104 14 74 C14 46 28 22 60 22 Z" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.4"/>
    <ellipse cx="40" cy="40" rx="12" ry="7" transform="rotate(-28 40 40)" fill="#fff" opacity=".45"/>
    ${kind === 'octo' ? `<g class="b-tent" fill="url(#g-${pal})" stroke="${line}" stroke-width="2.2" stroke-linejoin="round">${[[26, -1], [43, -.5], [60, 0], [77, .5], [94, 1]].map(([x, d]) => `<path d="M${x - 8} 100 Q${x - 9 + d * 6} 116 ${x + d * 10} 126 Q${x + 6 + d * 12} 128 ${x + 4 + d * 8} 121 Q${x + 5} 112 ${x + 8} 100 Z"/>`).join('')}<g fill="#fff" stroke="none" opacity=".75">${[26, 43, 60, 77, 94].map(x => `<circle cx="${x}" cy="108" r="1.8"/><circle cx="${x + 1}" cy="115" r="1.5"/>`).join('')}</g></g>` : ''}
    ${arms}
    ${eyes}${mouth}
    <circle cx="60" cy="${kind === 'octo' ? 88 : 100}" r="11" fill="#fff" opacity=".9"/><text x="60" y="${(kind === 'octo' ? -12 : 0) + (String(emblem).length > 2 ? 104.5 : 106)}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${String(emblem).length > 2 ? 10 : 16}" fill="${line}">${emblem}</text>
    ${state !== 'flex' ? extra : ''}
  </g></svg>`;
}
/* chapter 11 — extra objects (length practice) */
['tree', 'house', 'boat', 'palm', 'shop'].forEach(k => { if (!ART[k] && SCENERY[k]) ART[k] = SCENERY[k]; });
Object.assign(ART, {
  rope: `<path d="M8 50 q8 -18 18 -6 q10 12 18 -4 q6 -14 14 -10" fill="none" stroke="${PAL.cookie[3]}" stroke-width="6" stroke-linecap="round"/><path d="M8 50 q8 -18 18 -6 q10 12 18 -4 q6 -14 14 -10" fill="none" stroke="${PAL.cookie[1]}" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="3 3"/>`,
  flag: `<path d="M14 58 V8" stroke="${PAL.tan[3]}" stroke-width="3" stroke-linecap="round"/><path d="M15 10 q12 -4 22 2 q10 6 20 0 v22 q-10 6 -20 0 q-10 -6 -22 -2 z" fill="url(#l-red)" stroke="${PAL.red[3]}" stroke-width="1.4"/><path d="M15 18 q12 -4 22 2 q10 6 20 0 v6 q-10 6 -20 0 q-10 -6 -22 -2 z" fill="#fff"/>`,
  broom: `<path d="M44 6 L26 40" stroke="${PAL.tan[3]}" stroke-width="3.4" stroke-linecap="round"/><path d="M22 36 l10 6 l-6 18 q-8 0 -16 -8 z" fill="url(#g-yellow)" stroke="${PAL.yellow[3]}" stroke-width="1.4" stroke-linejoin="round"/><path d="M18 46 l-4 6 M22 48 l-4 8 M26 49 l-3 9" stroke="${PAL.yellow[3]}" stroke-width="1.2"/>`,
  cloth: `<path d="M10 14 q22 -8 44 0 v34 q-22 8 -44 0 z" fill="url(#l-pink)" stroke="${PAL.pink[3]}" stroke-width="1.5"/><circle cx="22" cy="24" r="3" fill="#fff" opacity=".8"/><circle cx="38" cy="30" r="3" fill="#fff" opacity=".8"/><circle cx="28" cy="40" r="3" fill="#fff" opacity=".8"/><circle cx="46" cy="20" r="2.4" fill="#fff" opacity=".8"/>`,
  glassOJ: `${SH(13, 60)}<path d="M18 14 H46 L42 58 H22 Z" fill="#EAF6FF" stroke="#9FC6E8" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 28 H44 L42 56 H22 Z" fill="url(#l-orange)" opacity=".9"/><rect x="34" y="6" width="3" height="26" rx="1.5" fill="${PAL.coral[1]}" transform="rotate(14 35 18)"/>`,
  school: `<ellipse cx="32" cy="61" rx="26" ry="2.6" fill="#2B2550" opacity=".1"/><rect x="8" y="28" width="48" height="32" rx="2" fill="url(#l-yellow)" stroke="${PAL.yellow[3]}" stroke-width="1.4"/><path d="M4 30 L32 14 L60 30 Z" fill="url(#g-coral)" stroke="${PAL.coral[3]}" stroke-width="1.4" stroke-linejoin="round"/><path d="M32 14 V2" stroke="#6B6488" stroke-width="1.6"/><path d="M33 3 h10 l-3 3 l3 3 h-10 z" fill="${PAL.sky[1]}"/><rect x="27" y="44" width="10" height="16" fill="${PAL.cookie[2]}"/>${[13, 43].map(x => `<rect x="${x}" y="36" width="8" height="8" rx="1.5" fill="#CFE6FF"/>`).join('')}`,
  bank: `<ellipse cx="32" cy="61" rx="24" ry="2.6" fill="#2B2550" opacity=".1"/><path d="M8 24 L32 10 L56 24 Z" fill="url(#g-grey)" stroke="${PAL.grey[3]}" stroke-width="1.4" stroke-linejoin="round"/><rect x="10" y="24" width="44" height="5" fill="${PAL.grey[2]}"/>${[14, 24, 34, 44].map(x => `<rect x="${x}" y="30" width="6" height="24" fill="#fff" stroke="${PAL.grey[3]}" stroke-width="1.2"/>`).join('')}<rect x="8" y="54" width="48" height="6" rx="1.5" fill="${PAL.grey[2]}"/>`,
  postoffice: `<ellipse cx="32" cy="61" rx="24" ry="2.6" fill="#2B2550" opacity=".1"/><rect x="10" y="22" width="44" height="38" rx="2" fill="url(#l-red)" stroke="${PAL.red[3]}" stroke-width="1.4"/><rect x="8" y="16" width="48" height="8" rx="2" fill="${PAL.red[2]}"/><rect x="18" y="30" width="28" height="14" rx="2" fill="#fff"/><path d="M18 30 l14 9 l14 -9" fill="none" stroke="${PAL.red[2]}" stroke-width="1.6"/><rect x="27" y="48" width="10" height="12" fill="${PAL.cookie[2]}"/>`,
  shopB: `<ellipse cx="32" cy="61" rx="24" ry="2.6" fill="#2B2550" opacity=".1"/><rect x="10" y="26" width="44" height="34" rx="2" fill="url(#l-white)" stroke="${PAL.white[3]}" stroke-width="1.4"/><path d="M8 18 H56 V28 q-4 4 -8 0 q-4 4 -8 0 q-4 4 -8 0 q-4 4 -8 0 q-4 4 -8 0 q-4 4 -8 0 Z" fill="url(#l-mint)" stroke="${PAL.mint[3]}" stroke-width="1.2"/><rect x="16" y="36" width="14" height="12" rx="1.5" fill="#CFE6FF"/><rect x="36" y="38" width="10" height="22" fill="${PAL.cookie[2]}"/>`,
  door: `<rect x="14" y="4" width="36" height="56" rx="3" fill="url(#l-cookie)" stroke="${PAL.cookie[3]}" stroke-width="1.6"/><rect x="19" y="10" width="26" height="18" rx="2" fill="none" stroke="${PAL.cookie[3]}" stroke-width="1.2"/><rect x="19" y="33" width="26" height="20" rx="2" fill="none" stroke="${PAL.cookie[3]}" stroke-width="1.2"/><circle cx="43" cy="32" r="2.4" fill="${PAL.yellow[2]}"/>`,
  eraser: `${SH(14, 50)}<path d="M12 30 l20 -12 l20 12 l-20 12 z" fill="${PAL.pink[0]}" stroke="${PAL.pink[3]}" stroke-width="1.4"/><path d="M12 30 v8 l20 12 v-8 z" fill="${PAL.pink[1]}" stroke="${PAL.pink[3]}" stroke-width="1.4"/><path d="M32 42 v8 l20 -12 v-8 z" fill="${PAL.sky[1]}" stroke="${PAL.sky[3]}" stroke-width="1.4"/>`,
  bed: `<ellipse cx="32" cy="58" rx="28" ry="2.6" fill="#2B2550" opacity=".1"/><rect x="6" y="20" width="6" height="36" rx="2" fill="${PAL.cookie[2]}"/><rect x="52" y="32" width="6" height="24" rx="2" fill="${PAL.cookie[2]}"/><rect x="10" y="36" width="46" height="12" rx="3" fill="url(#l-sky)" stroke="${PAL.sky[3]}" stroke-width="1.4"/><rect x="13" y="30" width="14" height="8" rx="4" fill="#fff" stroke="${PAL.white[3]}" stroke-width="1.2"/>`
});

/* final P1 boss: all chapter bosses merged — the minis orbit the giant body */
const innerSVG = svg => svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
function megaMinis(grade = 1) { return typeof CITIES === 'undefined' ? [] : CITIES.filter(c => c.grade === grade && !c.final).flatMap(c => c.lessons.filter(L => L.boss && L.bossKind !== 'mega')).map(L => [L.bossPal, L.emblem, L.bossKind || 'blob']); }
/* v192: บอสรวมร่างของข้อสอบปลายภาค — emblem → { grade, bosses: [id บอสท้ายบทที่มารวมร่าง] } (ไฟล์ของแต่ละชั้นลงทะเบียนเอง เช่น MEGA_SET['ภ.1'] ใน p2e.js) */
const MEGA_SET = {};
function megaMinisOf(ids) { return typeof CITIES === 'undefined' ? [] : ids.map(id => CITIES.flatMap(c => c.lessons).find(L => L.id === id)).filter(Boolean).map(L => [L.bossPal, L.emblem, L.bossKind || 'blob']); }
function megaBossSVG(state = 'idle', emblem = 'ป.1') {
  const S = MEGA_SET[emblem], grade = S ? S.grade : emblem === 'ป.2' ? 2 : emblem === 'ป.3' ? 3 : emblem === 'ป.4' ? 4 : emblem === 'ป.5' ? 5 : emblem === 'ป.6' ? 6 : 1, minis = S ? megaMinisOf(S.bosses) : megaMinis(grade), n = minis.length, ring = minis.map(([pal, em, kind], i) => { const a = Math.PI * .92 + (i / Math.max(1, n - 1)) * Math.PI * 1.16, x = 60 + Math.cos(a) * 70 - 16, y = 74 + Math.sin(a) * 62 - 17;
    return `<g class="mega-mini" style="animation-delay:${(i * .12).toFixed(2)}s"><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(.27)">${innerSVG(bossSVG(state === 'down' ? 'down' : i % 3 ? 'idle' : 'roar', pal, em, kind))}</g></g>`; }).join('');
  const core = innerSVG(bossSVG(state, 'night', emblem, grade === 2 ? 'octo' : grade === 3 ? 'snake' : grade === 4 ? 'scorp' : grade === 5 ? 'bear' : grade === 6 ? 'yeti' : 'blob'));
  return `<svg viewBox="-34 -6 188 150" class="boss-svg mega" aria-hidden="true">
    <defs><radialGradient id="megaAura" cx="50%" cy="55%" r="55%"><stop offset="0" stop-color="#FF5A6A" stop-opacity=".55"/><stop offset=".55" stop-color="#7E3FD6" stop-opacity=".28"/><stop offset="1" stop-color="#2B2550" stop-opacity="0"/></radialGradient></defs>
    <ellipse class="mega-aura" cx="60" cy="72" rx="92" ry="76" fill="url(#megaAura)"/>
    <path class="mega-bolt" d="M-24 96 l14 10 l-6 4 l16 14 M144 92 l-14 12 l6 4 l-16 14" fill="none" stroke="#FFD45C" stroke-width="2.4" stroke-linejoin="round" opacity=".8"/>
    ${ring}
    <g class="mega-corewrap"><g class="mega-core" transform="translate(-8 -6) scale(1.13)">
      ${grade === 1 ? `<path d="M22 40 l-16 -30 l28 18 z M98 40 l16 -30 l-28 18 z M44 26 l-6 -24 l16 18 z M76 26 l6 -24 l-16 18 z" fill="#1E1447" stroke="#FF5A6A" stroke-width="1.6" stroke-linejoin="round"/>` : ''}
      ${core}
      <path d="M40 18 l6 -14 l6 10 l8 -14 l8 14 l6 -10 l6 14" fill="url(#g-red)" stroke="#AE2E23" stroke-width="1.6" stroke-linejoin="round"/>
    </g></g>
  </svg>`;
}

/* =========================================================
   v182 (ผู้ใช้ขอ: รูปสิ่งของในชายหาดรูปเรขาคณิตต้องดูสมจริง) — สิ่งของทรงสี่เหลี่ยมมุมฉาก / ทรงกลม วาดใหม่
   art3Box: กล่องมุมมองเฉียง ทุกลวดลายวาดในพิกัดของแต่ละหน้า (0–1) แล้วแปลงด้วย matrix → จุดลูกเต๋า ริบบิ้น ช่องทิชชู
   อยู่บนหน้ากล่องจริง และเอียงตามหน้า · ไล่เฉดแสง (บนสว่าง หน้าปกติ ข้างมืด) + เงาพื้นนุ่ม
   ========================================================= */
function art3Box(o) { /* o: { id, w, hh, dx, dy, x0, y0, top, front, side, line, fTop, fFront, fSide, over } — สีเป็น [สว่าง, เข้ม] */
  const { id, w, hh, dx, dy, line } = o, x0 = o.x0 ?? (64 - w - dx) / 2, y0 = o.y0 ?? (64 + hh + dy) / 2 + 2 - hh, yb = y0 + hh;
  const M = { front: `matrix(${w} 0 0 ${hh} ${x0} ${y0})`, top: `matrix(${w} 0 ${dx} ${-dy} ${x0} ${y0})`, side: `matrix(${dx} ${-dy} 0 ${hh} ${x0 + w} ${y0})` };
  const g = (k, c, dir) => `<linearGradient id="${id}-${k}" x1="0" y1="0" x2="${dir ? 1 : 0}" y2="${dir ? 0 : 1}"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`;
  const face = (k, pts, deco) => `<path d="M${pts.map(p => p.join(' ')).join(' L')} Z" fill="url(#${id}-${k})" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/>${deco ? `<g transform="${M[k]}">${deco}</g>` : ''}`;
  return `<defs>${g('t', o.top)}${g('f', o.front)}${g('s', o.side, 1)}</defs>`
    + `<ellipse cx="${x0 + (w + dx) / 2 + 2}" cy="${yb + 1.2}" rx="${(w + dx) / 2 + 3}" ry="3" fill="#2B2550" opacity=".14"/>`
    + face('s', [[x0 + w, y0], [x0 + w + dx, y0 - dy], [x0 + w + dx, yb - dy], [x0 + w, yb]], o.fSide).replace(`<g transform="${M.s}">`, `<g transform="${M.side}">`)
    + face('t', [[x0, y0], [x0 + w, y0], [x0 + w + dx, y0 - dy], [x0 + dx, y0 - dy]], o.fTop).replace(`<g transform="${M.t}">`, `<g transform="${M.top}">`)
    + face('f', [[x0, y0], [x0 + w, y0], [x0 + w, yb], [x0, yb]], o.fFront).replace(`<g transform="${M.f}">`, `<g transform="${M.front}">`)
    + `<path d="M${x0 + 1.5} ${y0 + 1.2} H${x0 + w - 1.5}" stroke="#fff" stroke-width="1.2" opacity=".7" stroke-linecap="round"/>` + (o.over ? o.over({ x0, y0, w, hh, dx, dy, yb }) : ''); }
/* faces' decorations are drawn in 0–1 units — keep strokes at screen width */
const a3dot = (x, y, r, c) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r}" fill="${c}"/>`;
Object.assign(ART, {
  /* ลูกเต๋า: หน้าบน 1 (แดง) · หน้า 5 · ข้าง 3 — ด้านตรงข้ามรวมกันได้ 7 เหมือนลูกเต๋าจริง */
  dice: art3Box({ id: 'a3dc', w: 27, hh: 27, dx: 14, dy: 12, line: '#9C94B5', top: ['#FFFFFF', '#F4F1FA'], front: ['#FFFFFF', '#ECE8F3'], side: ['#DCD6E8', '#C9C1DA'],
    fTop: a3dot(.5, .5, .19, '#E0313F'),
    fFront: [[.24, .24], [.76, .24], [.5, .5], [.24, .76], [.76, .76]].map(([x, y]) => a3dot(x, y, .085, '#2B2550')).join(''),
    fSide: [[.25, .24], [.5, .5], [.75, .76]].map(([x, y]) => a3dot(x, y, .1, '#2B2550')).join('') }),
  /* กล่องกระดาษทิชชู: กล่องแบน ลายจุด ช่องรีด้านบน มีกระดาษทิชชูโผล่ */
  tissue: art3Box({ id: 'a3ts', w: 40, hh: 17, dx: 14, dy: 10, line: '#3E8FB0', top: ['#D9F3FF', '#BDE7FA'], front: ['#AEE2F7', '#86CDEB'], side: ['#6FBAD9', '#5BA8C8'],
    fFront: [[.12, .3], [.3, .7], [.5, .3], [.7, .7], [.88, .3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".07" fill="#fff" opacity=".85"/>`).join('') + '<rect x="0" y=".86" width="1" height=".06" fill="#fff" opacity=".7"/>',
    fSide: [[.3, .35], [.7, .7]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".1" fill="#fff" opacity=".6"/>`).join(''),
    fTop: '<ellipse cx=".5" cy=".5" rx=".3" ry=".22" fill="#4E7F96"/><ellipse cx=".5" cy=".52" rx=".26" ry=".16" fill="#3B6578"/>',
    over: ({ x0, y0, w, dx, dy }) => { const cx = x0 + w / 2 + dx / 2, cy = y0 - dy / 2;
      return `<path d="M${cx - 8} ${cy + 1} q1 -7 4 -10 q2 3 3 1 q1 -6 5 -8 q1 5 3 4 q2 4 0 13 z" fill="#fff" stroke="#C9C2DD" stroke-width="1" stroke-linejoin="round"/><path d="M${cx - 3} ${cy - 7} q2 3 1 7 M${cx + 3} ${cy - 11} q1 5 0 11" fill="none" stroke="#DCD6E8" stroke-width=".9"/>`; } }),
  /* กล่องของขวัญ: ริบบิ้นพาดรอบกล่องจริง (หน้า บน ข้าง) + โบว์ตรงกลางฝา */
  giftbox: art3Box({ id: 'a3gb', w: 30, hh: 22, dx: 15, dy: 12, line: '#B23A4C', top: ['#FF9AA6', '#FF7E8D'], front: ['#FF6F7D', '#E24D5F'], side: ['#C93C50', '#B23347'],
    fFront: '<rect x=".42" y="0" width=".16" height="1" fill="#FFD45C"/><rect x=".42" y="0" width=".05" height="1" fill="#FFE9A3"/>',
    fTop: '<rect x=".42" y="0" width=".16" height="1" fill="#FFE07A"/><rect x="0" y=".42" width="1" height=".16" fill="#FFE07A"/>',
    fSide: '<rect x=".42" y="0" width=".16" height="1" fill="#E8B23A"/>',
    over: ({ x0, y0, w, dx, dy }) => { const cx = x0 + w / 2 + dx / 2, cy = y0 - dy / 2;
      return `<path d="M${cx} ${cy} q-9 -9 -10 -3 q0 5 10 3 z M${cx} ${cy} q9 -9 10 -3 q0 5 -10 3 z" fill="#FFD45C" stroke="#C9961F" stroke-width="1" stroke-linejoin="round"/><path d="M${cx - 1} ${cy + 1} l-4 6 M${cx + 1} ${cy + 1} l4 6" stroke="#E8B23A" stroke-width="2" stroke-linecap="round"/><ellipse cx="${cx}" cy="${cy}" rx="2.4" ry="2" fill="#F2BE3A" stroke="#C9961F" stroke-width=".9"/>`; } }),
  /* อิฐ: ผิวขรุขระเล็กน้อย (ไม่มีเส้นเกิน) */
  brick: art3Box({ id: 'a3bk', w: 38, hh: 14, dx: 14, dy: 9, line: '#9B4A2A', top: ['#E38A5E', '#D27447'], front: ['#C8623A', '#B25230'], side: ['#9C4528', '#873A21'],
    fFront: [[.15, .35], [.4, .6], [.62, .3], [.85, .65], [.3, .78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".035" fill="#7A3418" opacity=".45"/>`).join(''),
    fTop: '<ellipse cx=".33" cy=".5" rx=".1" ry=".22" fill="#9B4A2A" opacity=".35"/><ellipse cx=".67" cy=".5" rx=".1" ry=".22" fill="#9B4A2A" opacity=".35"/>' }),
  /* กล่องนม: ทรงหลังคาจั่ว มีแถบสีและรูปแก้วนม */
  carton: (() => { const id = 'a3mk', w = 20, hh = 30, dx = 12, dy = 8, x0 = 14, y0 = 24, yb = y0 + hh, pk = 9, line = '#3F7FB8';
    return `<defs><linearGradient id="${id}-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EEF3FA"/></linearGradient><linearGradient id="${id}-s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D6E2F2"/><stop offset="1" stop-color="#C2D3EA"/></linearGradient><linearGradient id="${id}-r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7FAFF"/><stop offset="1" stop-color="#DCE7F5"/></linearGradient></defs>`
      + `<ellipse cx="${x0 + (w + dx) / 2 + 2}" cy="${yb + 1.2}" rx="${(w + dx) / 2 + 3}" ry="3" fill="#2B2550" opacity=".14"/>`
      + `<path d="M${x0 + w} ${y0} L${x0 + w + dx} ${y0 - dy} V${yb - dy} L${x0 + w} ${yb} Z" fill="url(#${id}-s)" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/>`
      + `<path d="M${x0 + w / 2} ${y0 - pk} L${x0 + w} ${y0} L${x0 + w + dx} ${y0 - dy} L${x0 + w / 2 + dx} ${y0 - pk - dy} Z" fill="url(#${id}-r)" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/>`
      + `<path d="M${x0 + w / 2} ${y0 - pk} l0 -2.6 l${dx} ${-dy} l0 2.6 z" fill="#E9F0FA" stroke="${line}" stroke-width="1.1" stroke-linejoin="round"/>`
      + `<path d="M${x0} ${y0} L${x0 + w / 2} ${y0 - pk} L${x0 + w} ${y0} V${yb} H${x0} Z" fill="url(#${id}-f)" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/>`
      + `<rect x="${x0}" y="${y0 + 4}" width="${w}" height="7" fill="#4C9BF0"/><path d="M${x0 + w} ${y0 + 4} l${dx} ${-dy} v7 l${-dx} ${dy} z" fill="#3A84D6"/>`
      + `<text x="${x0 + w / 2}" y="${y0 + 9.6}" text-anchor="middle" font-family="IBM Plex Sans Thai Looped,Nunito,sans-serif" font-weight="800" font-size="5" fill="#fff">นมสด</text>`
      + `<path d="M${x0 + 6} ${y0 + 15} h8 l-1.2 11 h-5.6 z" fill="#fff" stroke="#9DB8D8" stroke-width=".9"/><path d="M${x0 + 6.4} ${y0 + 18} h7.2 l-.9 7.6 h-5.4 z" fill="#F4F8FF"/>`
      + `<path d="M${x0 + 1.5} ${y0 + 1.5} L${x0 + w / 2} ${y0 - pk + 2}" stroke="#fff" stroke-width="1.2" opacity=".8" stroke-linecap="round"/>`; })(),
  /* ลูกบอลชายหาด: แถบสีโค้งตามผิวลูกบอล + ฝาขาวด้านบน + แสงเงาทรงกลม */
  ball: (() => { const R = 20, cx = 32, cy = 33, id = 'a3bb', arc = k => `M${cx} ${cy - R} A${R * k} ${R} 0 0 ${k < 0 ? 0 : 1} ${cx} ${cy + R}`;
    const gore = (k1, k2, c) => `<path d="M${cx} ${cy - R} A${Math.abs(R * k1)} ${R} 0 0 ${k1 < 0 ? 0 : 1} ${cx} ${cy + R} A${Math.abs(R * k2)} ${R} 0 0 ${k2 < 0 ? 1 : 0} ${cx} ${cy - R} Z" fill="${c}"/>`;
    return `<defs><clipPath id="${id}-c"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><radialGradient id="${id}-g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1B1640" stop-opacity=".35"/></radialGradient></defs>`
      + `<ellipse cx="${cx + 2}" cy="${cy + R + 3}" rx="${R * .85}" ry="3.2" fill="#2B2550" opacity=".14"/>`
      + `<g clip-path="url(#${id}-c)"><rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" fill="#FFFFFF"/>`
      + gore(-1, -.55, '#FF5A6B') + gore(-.55, -.1, '#FFFFFF') + gore(-.1, .35, '#FFC83D') + gore(.35, .8, '#FFFFFF') + gore(.8, 1.05, '#3FA6F2') + gore(-1.05, -1, '#3FA6F2')
      + `<ellipse cx="${cx}" cy="${cy - R + 1.5}" rx="5.5" ry="2.6" fill="#fff" stroke="#D9D3E6" stroke-width=".8"/></g>`
      + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id}-g)" stroke="#8E86A8" stroke-width="1.3"/>${HI(24, 24, 6, 3.4)}`; })()
});

/* v201 — story pictures for ป.1 บทที่ 14 (โจทย์ปัญหา): animals and things that the word problems name */
Object.assign(ART, {
  hen: `${SH(17)}<path d="M26 14 q2 -6 5 -2 q2 -5 5 0 q3 -3 4 2 q-7 3 -14 0 z" ${F('red')} stroke-linejoin="round"/><ellipse cx="33" cy="36" rx="19" ry="18" ${F('white')}/><path d="M44 38 q8 -2 9 6 q-6 4 -12 -1 z" ${F('white')}/>${HI(26, 26)}<path d="M17 33 l-7 3 l7 3 z" fill="#FFB938" stroke="#D18E1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M20 40 q-3 4 0 7 q3 -2 2 -6 z" ${F('red')}/><circle cx="24" cy="31" r="2.4" fill="#2B2550"/><circle cx="23.3" cy="30.2" r=".8" fill="#fff"/><path d="M30 44 q6 5 12 -1" fill="none" stroke="${PAL.white[3]}" stroke-width="1.4" stroke-linecap="round"/>`,
  duck: `${SH(18)}<ellipse cx="35" cy="42" rx="20" ry="12" ${F('white')}/><circle cx="24" cy="26" r="11" ${F('white')}/>${HI(20, 21, 4, 2.5)}<path d="M13 27 q-8 0 -8 3 q2 3 9 2 z" fill="#FF9F43" stroke="#D97A1F" stroke-width="1.2" stroke-linejoin="round"/><circle cx="22" cy="24" r="2.2" fill="#2B2550"/><circle cx="21.4" cy="23.3" r=".7" fill="#fff"/><path d="M34 40 q8 -6 16 0 q-8 5 -16 0 z" fill="${PAL.white[2]}" opacity=".8"/><path d="M53 38 l5 -4 l-1 7 z" ${F('white')} stroke-linejoin="round"/>`,
  goat: `${SH(16)}<path d="M20 18 q-6 -10 -2 -12 q3 6 8 9 z M44 18 q6 -10 2 -12 q-3 6 -8 9 z" ${F('tan')} stroke-linejoin="round"/><path d="M14 26 q-8 -2 -8 3 q4 4 10 2 z M50 26 q8 -2 8 3 q-4 4 -10 2 z" ${F('white')}/><path d="M18 24 q14 -10 28 0 q2 16 -6 24 q-8 6 -16 0 q-8 -8 -6 -24 z" ${F('white')}/>${HI(25, 25)}${EYES(31, 7)}<ellipse cx="32" cy="42" rx="6" ry="4" fill="#FFD3DC" stroke="${PAL.pink[3]}" stroke-width="1.1"/><path d="M28 49 q4 10 8 0" ${F('white')}/>`,
  sheep: `${SH(19)}<path d="M14 30 a7 7 0 0 1 6 -12 a8 8 0 0 1 12 -4 a8 8 0 0 1 12 4 a7 7 0 0 1 6 12 a7 7 0 0 1 -4 12 a8 8 0 0 1 -10 6 h-8 a8 8 0 0 1 -10 -6 a7 7 0 0 1 -4 -12 z" ${F('white')}/><ellipse cx="32" cy="35" rx="10" ry="12" fill="#5B4A6B" stroke="#3F3150" stroke-width="1.3"/><path d="M21 30 q-7 -1 -8 3 q4 3 9 0 z M43 30 q7 -1 8 3 q-4 3 -9 0 z" fill="#5B4A6B"/>${EYES(32, 4.5, '#fff')}<circle cx="27.5" cy="32" r="1.3" fill="#2B2550"/><circle cx="36.5" cy="32" r="1.3" fill="#2B2550"/><path d="M30 41 q2 2 4 0" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>${HI(22, 20, 4, 2.5)}`,
  cow: `${SH(17)}<path d="M17 20 q-6 -6 -4 -10 q4 4 9 6 z M47 20 q6 -6 4 -10 q-4 4 -9 6 z" fill="#FFF3D6" stroke="#D9B98A" stroke-width="1.3"/><path d="M10 24 q-6 0 -5 5 q5 3 10 -1 z M54 24 q6 0 5 5 q-5 3 -10 -1 z" ${F('white')}/><path d="M16 22 q16 -10 32 0 q2 14 -2 22 h-28 q-4 -8 -2 -22 z" ${F('white')}/><path d="M18 22 q6 -4 10 0 q-2 6 -8 6 q-3 -2 -2 -6 z M40 26 q6 -2 6 4 q-4 2 -6 -4 z" fill="#3F3150" opacity=".85"/>${HI(26, 26, 4, 2.5)}${EYES(31, 7)}<rect x="19" y="38" width="26" height="14" rx="7" fill="#FFC2CE" stroke="${PAL.pink[3]}" stroke-width="1.3"/><ellipse cx="27" cy="45" rx="1.6" ry="2.2" fill="${PAL.pink[3]}"/><ellipse cx="37" cy="45" rx="1.6" ry="2.2" fill="${PAL.pink[3]}"/>`,
  buffalo: `${SH(18)}<path d="M18 22 q-14 -2 -12 -14 q4 8 14 8 z M46 22 q14 -2 12 -14 q-4 8 -14 8 z" fill="#E9E1D2" stroke="#B9AD96" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 27 q-6 0 -5 5 q5 3 10 -1 z M54 27 q6 0 5 5 q-5 3 -10 -1 z" ${F('grey')}/><path d="M16 22 q16 -8 32 0 q2 14 -2 22 h-28 q-4 -8 -2 -22 z" fill="#6E6680" stroke="#4E4760" stroke-width="1.5"/>${HI(26, 26, 4, 2.5)}${EYES(31, 7, '#1E1447')}<circle cx="25" cy="31" r="3.4" fill="none" stroke="#fff" stroke-width=".8" opacity=".5"/><circle cx="39" cy="31" r="3.4" fill="none" stroke="#fff" stroke-width=".8" opacity=".5"/><rect x="20" y="38" width="24" height="13" rx="6.5" fill="#8C84A0" stroke="#4E4760" stroke-width="1.3"/><ellipse cx="27" cy="44.5" rx="1.6" ry="2.2" fill="#3F3150"/><ellipse cx="37" cy="44.5" rx="1.6" ry="2.2" fill="#3F3150"/>`,
  crane: `${SH(18)}<path d="M8 40 l14 -4 l10 -18 l4 18 z" ${F('coral')} stroke-linejoin="round"/><path d="M32 18 l4 18 l20 -22 z" ${F('pink')} stroke-linejoin="round"/><path d="M22 36 l14 0 l6 14 l-24 0 z" ${F('coral')} stroke-linejoin="round"/><path d="M42 50 l6 -26 l6 -6 l-2 8 z" ${F('pink')} stroke-linejoin="round"/><path d="M36 36 l6 14" stroke="${PAL.coral[3]}" stroke-width="1.1"/>`,
  shell: `${SH(17)}<path d="M32 52 l-6 -4 q-16 -8 -16 -22 q4 -14 22 -16 q18 2 22 16 q0 14 -16 22 z" fill="url(#g-pink)" stroke="${PAL.pink[3]}" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 50 l-14 -34 M32 50 l-6 -38 M32 50 v-39 M32 50 l6 -38 M32 50 l14 -34" stroke="${PAL.pink[3]}" stroke-width="1.3" opacity=".7"/><path d="M24 50 h16 l-3 5 h-10 z" ${F('pink')}/>${HI(24, 22, 5, 2.6)}`,
  ribbon: `${SH(18)}<path d="M32 30 q-14 -18 -22 -10 q-4 10 6 14 q8 2 16 -4 z M32 30 q14 -18 22 -10 q4 10 -6 14 q-8 2 -16 -4 z" ${F('coral')} stroke-linejoin="round"/><path d="M29 32 l-8 22 l6 -3 l3 5 l4 -22 z M35 32 l8 22 l-6 -3 l-3 5 l-4 -22 z" ${F('coral')} stroke-linejoin="round"/><circle cx="32" cy="30" r="5" ${F('red')}/>${HI(18, 21, 3.5, 2)}`,
  paper: `${SH(16)}<path d="M16 10 h24 l10 10 v34 h-34 z" ${F('lilac')} stroke-linejoin="round"/><path d="M40 10 v10 h10" fill="#fff" opacity=".7" stroke="${PAL.lilac[3]}" stroke-width="1.4" stroke-linejoin="round"/>${HI(22, 18, 4, 2.4)}`,
  chair: `${SH(15)}<rect x="19" y="8" width="26" height="22" rx="4" ${F('cookie')}/><rect x="15" y="30" width="34" height="8" rx="3" ${F('cookie')}/><path d="M18 38 v18 M46 38 v18 M22 38 v12 M42 38 v12" stroke="${PAL.cookie[3]}" stroke-width="4" stroke-linecap="round"/><path d="M24 15 h16 M24 22 h16" stroke="${PAL.cookie[3]}" stroke-width="1.6" opacity=".6"/>${HI(24, 13, 4, 2)}`,
  radish: `${SH(10)}<path d="M28 20 q-8 -10 -3 -14 q4 4 5 12 q1 -10 7 -12 q2 8 -4 14 q7 -5 11 -2 q-5 6 -14 4 z" ${F('green')}/><path d="M22 22 q10 -4 20 0 q0 18 -10 34 q-10 -16 -10 -34 z" ${F('white')}/><path d="M26 30 h4 M27 38 h5 M30 46 h3" stroke="${PAL.white[3]}" stroke-width="1.3" stroke-linecap="round"/>${HI(27, 28, 2.5, 6, 10)}`,
  papaya: `${SH(15)}<path d="M32 8 q16 4 16 26 q0 20 -16 22 q-16 -2 -16 -22 q0 -22 16 -26 z" fill="url(#g-orange)" stroke="${PAL.orange[3]}" stroke-width="1.6"/><path d="M32 8 q10 6 12 18 q-8 -6 -12 -18 z" fill="${PAL.green[1]}" opacity=".75"/><path d="M32 8 v-4" stroke="#8A5A33" stroke-width="2.4" stroke-linecap="round"/>${HI(25, 24, 3.5, 8, 10)}`,
  starfruit: `${SH(15)}<path d="M32 9 q4 0 6 10 q10 -2 12 2 q2 4 -8 10 q6 10 2 13 q-4 3 -12 -6 q-8 9 -12 6 q-4 -3 2 -13 q-10 -6 -8 -10 q2 -4 12 -2 q2 -10 6 -10 z" fill="url(#g-yellow)" stroke="#B8A21C" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 30 v-17 M32 30 l15 -6 M32 30 l10 12 M32 30 l-10 12 M32 30 l-15 -6" stroke="#B8A21C" stroke-width="1.1" opacity=".6"/><circle cx="32" cy="30" r="2.4" fill="#8CCB52"/>${HI(27, 18, 2.6, 1.6)}`,
  building: `${SH(16)}<rect x="18" y="6" width="28" height="50" rx="2" ${F('grey')}/><path d="M23 12 h6 v6 h-6 z M35 12 h6 v6 h-6 z M23 23 h6 v6 h-6 z M35 23 h6 v6 h-6 z M23 34 h6 v6 h-6 z M35 34 h6 v6 h-6 z" fill="#CFE6FF" stroke="${PAL.sky[3]}" stroke-width=".9"/><rect x="28" y="45" width="8" height="11" fill="${PAL.cookie[2]}" stroke="${PAL.cookie[3]}" stroke-width="1"/>`
});
