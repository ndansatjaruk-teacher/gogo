'use strict';
/* =========================================================
   ZOOMFIX (v218): make getBoundingClientRect match the mouse on every browser.
   The game scales screens with CSS `zoom` (#stage, fitBody, colstack …).
   New Chrome/Edge (≥128) report rects in real screen px — same space as
   event.clientX/Y. Safari (Mac) and older Chrome use the old "legacy zoom":
   rects come back divided by the element's zoom, so every tap/drag that does
   (clientX − rect.left) / rect.width landed in the wrong place on a computer
   (iPad zoom ≈ 1, so it looked fine there).
   We measure once at start-up and, only on legacy engines, scale the rect back.
   ========================================================= */
/* product of CSS zoom from el up to <html> (each element's own zoom value) */
function zfChain(el) { let z = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const v = parseFloat(getComputedStyle(e).zoom); if (v > 0 && v !== 1) z *= v; } return z; }
/* v241: getScreenCTM must hand back a real SVGMatrix — svgPoint.matrixTransform(m.inverse()) throws on a DOMMatrix
   (Chrome / Safari), which silently killed every drag on engines where the patch below is active */
function zfMat(el, a, b, c, d, e, f) { const root = el.ownerSVGElement || el, M = root.createSVGMatrix ? root.createSVGMatrix() : null; if (!M) return new DOMMatrix([a, b, c, d, e, f]); M.a = a; M.b = b; M.c = c; M.d = d; M.e = e; M.f = f; return M; }
const ZF = (() => {
  const fx = { pos: false, size: false, ctm: false };
  try {
    const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:100px;top:100px;width:10px;height:10px;visibility:hidden;pointer-events:none';
    const z = document.createElement('div'); z.style.cssText = 'zoom:2;margin-left:50px;width:100px;height:50px';
    z.innerHTML = '<svg viewBox="0 0 100 50" width="100" height="50" style="display:block"></svg>'; host.append(z); document.documentElement.append(host);
    const r = z.getBoundingClientRect(), m = z.firstChild.getScreenCTM && z.firstChild.getScreenCTM(); host.remove();
    /* real screen: left = 100 + 50·2 = 200, width = 100·2 = 200, svg scale = 2 */
    fx.pos = Math.abs(r.left - 100) < 3 && Math.abs(r.left - 200) > 3; fx.size = Math.abs(r.width - 100) < 3; fx.ctm = !!m && Math.abs(m.a - 1) < .05;
  } catch (_) { }
  if (fx.pos || fx.size) { const g = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () { const r = g.call(this), k = zfChain(this); if (k === 1) return r; const p = fx.pos ? k : 1, s = fx.size ? k : 1; return new DOMRect(r.x * p, r.y * p, r.width * s, r.height * s); }; }
  if (fx.ctm && window.SVGGraphicsElement) { const g = SVGGraphicsElement.prototype.getScreenCTM;
    SVGGraphicsElement.prototype.getScreenCTM = function () { const m = g.call(this), k = m ? zfChain(this) : 1; if (!m || k === 1) return m; return zfMat(this, m.a * k, m.b * k, m.c * k, m.d * k, m.e * k, m.f * k); }; }
  return fx;
})();
/* screen px per CSS px inside el — use to turn a mouse distance (clientX change) into style px */
const zfScale = el => { const w = el.offsetWidth; return w ? (el.getBoundingClientRect().width / w || 1) : zfChain(el); };
/* v241: Safari (Mac) — getScreenCTM() of an <svg> under CSS zoom is not trustworthy in WebKit (zoom left out of the
   matrix, rect x/y divided by zoom …), so a drag could land far from the finger or not move at all.
   On legacy-zoom engines we calibrate the matrix with the browser's own hit test, which always agrees with
   event.clientX/Y: a transparent rect inside the svg is narrowed down (binary search) until it just covers the
   point, for two points → scale + offset. Cached until the svg moves or changes size (checked with its rect). */
let zfCache = new WeakMap();
addEventListener('resize', () => { zfCache = new WeakMap(); });
function zfHitCTM(svg) {
  const vb = svg.viewBox && svg.viewBox.baseVal; if (!vb || !vb.width || !vb.height || !document.elementsFromPoint || !svg.isConnected) return null;
  const R0 = svg.getBoundingClientRect(), key = [R0.left, R0.top, R0.width, R0.height, vb.x, vb.y, vb.width, vb.height].map(v => Math.round(v * 2)).join(','), c = zfCache.get(svg); if (c && c.key === key) return c.m; /* same place, same size → same matrix */
  const NS = 'http://www.w3.org/2000/svg', r = document.createElementNS(NS, 'rect'), pe = svg.style.pointerEvents, big = 1e5;
  r.setAttribute('fill', 'transparent'); r.style.pointerEvents = 'all'; svg.style.pointerEvents = 'auto'; svg.appendChild(r);
  const on = (sx, sy) => document.elementsFromPoint(sx, sy).includes(r);
  const set = (ax, a, b) => { if (ax) { r.setAttribute('x', a); r.setAttribute('width', b - a); r.setAttribute('y', -big); r.setAttribute('height', 2 * big); } else { r.setAttribute('y', a); r.setAttribute('height', b - a); r.setAttribute('x', -big); r.setAttribute('width', 2 * big); } };
  const solve = (sx, sy, ax) => { let lo = ax ? vb.x - vb.width : vb.y - vb.height, hi = ax ? vb.x + 2 * vb.width : vb.y + 2 * vb.height; set(ax, lo, hi); if (!on(sx, sy)) return null;
    for (let i = 0; i < 20; i++) { const mid = (lo + hi) / 2; set(ax, lo, mid); if (on(sx, sy)) hi = mid; else lo = mid; } return (lo + hi) / 2; };
  let m = null;
  try { const R = svg.getBoundingClientRect(), got = [];
    for (const [fx, fy] of [[.25, .25], [.75, .75], [.3, .7], [.7, .3], [.5, .5], [.15, .85], [.85, .15]]) { const sx = R.left + R.width * fx, sy = R.top + R.height * fy, ux = solve(sx, sy, 1), uy = ux == null ? null : solve(sx, sy, 0);
      if (ux != null && uy != null) got.push([sx, sy, ux, uy]); if (got.length === 2 && Math.abs(got[0][0] - got[1][0]) > 8 && Math.abs(got[0][1] - got[1][1]) > 8) break; if (got.length === 2) got.pop(); }
    if (got.length === 2) { const [p, q] = got, a = (q[0] - p[0]) / (q[2] - p[2]), d = (q[1] - p[1]) / (q[3] - p[3]); if (isFinite(a) && isFinite(d) && a > 0 && d > 0) m = zfMat(svg, a, 0, 0, d, p[0] - a * p[2], p[1] - d * p[3]); } } catch (_) { m = null; }
  r.remove(); svg.style.pointerEvents = pe;
  zfCache.set(svg, { m, key }); return m;
}
if ((ZF.pos || ZF.size || ZF.ctm || window.ZF_FORCE_HIT) && window.SVGSVGElement) { const g0 = SVGGraphicsElement.prototype.getScreenCTM;
  SVGSVGElement.prototype.getScreenCTM = function () { if (window.ZF_FORCE_HIT || zfChain(this) !== 1) { const m = zfHitCTM(this); if (m) return m; } return g0.call(this); }; }
