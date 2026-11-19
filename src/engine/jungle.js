/* =========================================================
   ป่าดิบชื้น (ป.3) — rainforest pieces: giant buttress trees, vines, a river, walking / flying animals, insects
   used by showMap (map svg) and worldSVG('jungle') (page background)
   ========================================================= */
/* giant rainforest tree: tall trunk with buttress roots, moss and lianas — origin = foot centre, height ~ h */
const jgTree = (x, y, h = 360, o = {}) => { const w = h * .13, top = y - h, c = o.dark ? ['#3A2A1C', '#2A1E14', '#1F4A26', '#2C6A33'] : ['#7A5233', '#5C3D25', '#3E8F3A', '#5FAE48'];
  return `<g class="jg-tree">
    <path d="M${x - w * 2.4} ${y} Q${x - w * .9} ${y - h * .08} ${x - w * .55} ${y - h * .22} L${x - w * .42} ${top + h * .12} L${x + w * .42} ${top + h * .12} L${x + w * .55} ${y - h * .22} Q${x + w * .9} ${y - h * .08} ${x + w * 2.4} ${y} Q${x + w} ${y - h * .03} ${x + w * .3} ${y - h * .06} Q${x} ${y - h * .02} ${x - w * .3} ${y - h * .06} Q${x - w} ${y - h * .03} ${x - w * 2.4} ${y} Z" fill="${c[0]}"/>
    <path d="M${x + w * .1} ${top + h * .14} L${x + w * .42} ${top + h * .14} L${x + w * .55} ${y - h * .22} Q${x + w * .9} ${y - h * .08} ${x + w * 2.4} ${y} Q${x + w} ${y - h * .04} ${x + w * .2} ${y - h * .06} Z" fill="${c[1]}" opacity=".6"/>
    ${[.3, .5, .7].map(f => `<path d="M${x - w * .4} ${y - h * f} q${w * .4} ${-h * .03} ${w * .8} 0" fill="none" stroke="${c[1]}" stroke-width="2" opacity=".6"/>`).join('')}
    <path d="M${x - w * .3} ${top + h * .2} q${-w * 1.4} ${h * .25} ${-w * .6} ${h * .55}" fill="none" stroke="#4F9E35" stroke-width="3.5" opacity=".9"/>
    ${[[-1.6, .05, 1.25], [0, -.04, 1.5], [1.6, .06, 1.2], [-.8, -.1, 1], [.9, -.1, 1]].map(([dx, dy, s], i) => `<ellipse cx="${x + dx * w * 1.6}" cy="${top + h * (.1 + dy)}" rx="${w * 2.1 * s}" ry="${w * 1.3 * s}" fill="${i % 2 ? c[2] : c[3]}"/>`).join('')}
  </g>`; };
/* animals (drawn facing right, ~100 wide, feet at y = 0) */
const JG = {
  elephant: `<g class="jg-legs"><rect x="18" y="-26" width="12" height="26" rx="4" fill="#7F7B93"/><rect x="58" y="-26" width="12" height="26" rx="4" fill="#7F7B93"/></g>
    <ellipse cx="44" cy="-40" rx="38" ry="24" fill="#9C98B0"/><g class="jg-legs b"><rect x="26" y="-26" width="12" height="26" rx="4" fill="#8E8AA2"/><rect x="66" y="-26" width="12" height="26" rx="4" fill="#8E8AA2"/></g>
    <circle cx="86" cy="-50" r="18" fill="#9C98B0"/><path d="M98 -46 q14 10 6 34 q-2 6 -7 2 q6 -18 -6 -28 z" fill="#9C98B0"/><ellipse cx="76" cy="-50" rx="12" ry="16" fill="#8E8AA2"/>
    <circle cx="92" cy="-56" r="2.4" fill="#2B2550"/><path d="M96 -40 q8 2 10 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M7 -44 q-8 6 -4 16" stroke="#8E8AA2" stroke-width="3" fill="none"/>`,
  tapir: `<g class="jg-legs"><rect x="14" y="-18" width="8" height="18" rx="3" fill="#2B2B33"/><rect x="50" y="-18" width="8" height="18" rx="3" fill="#2B2B33"/></g>
    <ellipse cx="38" cy="-26" rx="30" ry="15" fill="#2E2E38"/><path d="M22 -38 Q38 -42 52 -38 L52 -14 Q38 -10 22 -14 Z" fill="#F2EEE6"/><g class="jg-legs b"><rect x="22" y="-18" width="8" height="18" rx="3" fill="#3A3A46"/><rect x="58" y="-18" width="8" height="18" rx="3" fill="#3A3A46"/></g>
    <circle cx="70" cy="-30" r="11" fill="#2E2E38"/><path d="M78 -30 q10 2 10 8 q-6 0 -10 -2 z" fill="#2E2E38"/><circle cx="73" cy="-33" r="1.8" fill="#fff"/><ellipse cx="64" cy="-40" rx="3" ry="5" fill="#2E2E38"/>`,
  hornbill: `<g class="jg-wing"><path d="M30 -10 q-24 -26 -40 -10 q20 2 40 14 z" fill="#1F1F28"/><path d="M-6 -16 q8 2 12 6" stroke="#fff" stroke-width="3"/></g>
    <ellipse cx="34" cy="-6" rx="20" ry="9" fill="#24242E"/><path d="M14 -6 l-14 6 l14 0 z" fill="#fff"/><circle cx="54" cy="-10" r="8" fill="#24242E"/>
    <path d="M60 -12 q16 -2 26 8 q-14 0 -26 -2 z" fill="#FFC23D"/><path d="M58 -18 q12 -8 22 2 q-10 -2 -20 2 z" fill="#E5505E"/><circle cx="56" cy="-12" r="1.6" fill="#fff"/>`,
  monkey: `<path d="M0 0 q-4 -16 4 -26" stroke="#7A4A2A" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="6" cy="10" r="11" fill="#9A6236"/><circle cx="6" cy="10" r="7" fill="#E8C49A"/>
    <circle cx="3" cy="8" r="1.4" fill="#2B2550"/><circle cx="9" cy="8" r="1.4" fill="#2B2550"/><path d="M4 13 q2 2 4 0" stroke="#2B2550" stroke-width="1.2" fill="none"/>
    <ellipse cx="6" cy="30" rx="10" ry="13" fill="#9A6236"/><path d="M14 38 q14 4 10 -10 q-2 -6 -6 -2" stroke="#9A6236" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M-2 40 q-2 8 2 10 M12 40 q2 8 -2 10" stroke="#9A6236" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  dragonfly: `<g class="jg-dwing"><ellipse cx="-4" cy="-6" rx="11" ry="4" fill="#BDE8FF" opacity=".75" transform="rotate(-20 -4 -6)"/><ellipse cx="-4" cy="6" rx="11" ry="4" fill="#BDE8FF" opacity=".75" transform="rotate(20 -4 6)"/>
    <ellipse cx="6" cy="-6" rx="10" ry="3.5" fill="#BDE8FF" opacity=".75" transform="rotate(20 6 -6)"/><ellipse cx="6" cy="6" rx="10" ry="3.5" fill="#BDE8FF" opacity=".75" transform="rotate(-20 6 6)"/></g>
    <path d="M-22 0 H10" stroke="#2F86C2" stroke-width="3" stroke-linecap="round"/><circle cx="13" cy="0" r="3.4" fill="#2F86C2"/>`,
  bfly: c => `<g class="jg-bw"><path d="M0 0 q-14 -16 -18 -4 q-2 8 18 4 z" fill="${c}"/><path d="M0 0 q-12 6 -10 14 q4 2 10 -14 z" fill="${c}" opacity=".8"/></g><g class="jg-bw r"><path d="M0 0 q14 -16 18 -4 q2 8 -18 4 z" fill="${c}"/><path d="M0 0 q12 6 10 14 q-4 2 -10 -14 z" fill="${c}" opacity=".8"/></g><path d="M0 -6 V8" stroke="#2B2550" stroke-width="2" stroke-linecap="round"/>`,
  croc: `<path d="M0 0 q20 -8 60 -6 q20 0 30 6 q-30 4 -90 0 z" fill="#4E7A3A"/><circle cx="74" cy="-6" r="3" fill="#E9F27A"/><circle cx="74" cy="-6" r="1.2" fill="#2B2550"/>${[10, 22, 34, 46].map(x => `<path d="M${x} -5 l3 -4 l3 4" fill="#3B5E2C"/>`).join('')}`
};
/* river band across the full width: ys = water top line */
const jgRiver = (W, ys, hgt = 64) => { let top = `M0 ${ys}`; for (let x = 0; x <= W; x += 80) top += ` Q${x + 40} ${ys + (x / 80 % 2 ? 10 : -10)} ${x + 80} ${ys}`;
  const flow = range(0, 3).map(i => `<path class="jg-flow" style="animation-delay:${-i * 1.4}s" d="M0 ${ys + 18 + i * 14} ${range(0, Math.ceil(W / 60)).map(k => `q15 -5 30 0 t30 0`).join(' ')}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="18 26" opacity=".7"/>`).join('');
  const pads = [.14, .47, .8].map((f, i) => `<g transform="translate(${W * f} ${ys + 26 + (i % 2) * 14})"><ellipse rx="16" ry="6" fill="#5FAE48"/><path d="M0 0 L14 -2" stroke="#2F8F55" stroke-width="2"/>${i === 1 ? '<circle cx="-4" cy="-6" r="5" fill="#FF9AA8"/><circle cx="-4" cy="-6" r="2" fill="#FFE27A"/>' : ''}</g>`).join('');
  return `<path d="${top} V${ys + hgt} H0 Z" fill="url(#jgRiverG)"/><path d="${top}" fill="none" stroke="#7A5233" stroke-width="5" opacity=".55"/><path d="M0 ${ys + hgt} H${W}" stroke="#7A5233" stroke-width="5" opacity=".5"/>${flow}${pads}`; };
/* walker / flyer helpers (CSS keyframes in style.css) */
const jgWalk = (art, y, W, dur, delay = 0, scale = 1, rev) => `<g class="jg-walk${rev ? ' rev' : ''}" style="--W:${W + 160}px;animation-duration:${dur}s;animation-delay:${-delay}s"><g transform="translate(0 ${y}) scale(${rev ? -scale : scale} ${scale})"><g class="jg-bob">${art}</g></g></g>`;
const jgFlies = (W, H, n = 14) => range(0, n - 1).map(i => `<circle class="jg-fly" cx="${(i * 173) % W}" cy="${90 + (i * 251) % Math.max(120, H - 200)}" r="${1.8 + i % 2}" fill="#FFF7A8" style="animation-delay:${-(i % 7) * .7}s"/>`).join('');
const jgButterflies = (W, H, n = 3) => range(0, n - 1).map(i => { const x0 = W * (.15 + i * .3), y0 = 120 + (i * 137) % Math.max(100, H - 260), c = ['#FFB534', '#5BB5F0', '#FF7B86'][i % 3];
  return `<g><animateMotion dur="${14 + i * 3}s" repeatCount="indefinite" path="M${x0} ${y0} q80 -60 160 0 t-60 90 t-120 -40 z"/>${JG.bfly(c)}</g>`; }).join('');
SCENERY.bigtree = jgTree(32, 63, 60);
