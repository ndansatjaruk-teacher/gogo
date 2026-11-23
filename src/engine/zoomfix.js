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
    SVGGraphicsElement.prototype.getScreenCTM = function () { const m = g.call(this), k = m ? zfChain(this) : 1; if (!m || k === 1) return m; return new DOMMatrix([m.a * k, m.b * k, m.c * k, m.d * k, m.e * k, m.f * k]); }; }
  return fx;
})();
/* screen px per CSS px inside el — use to turn a mouse distance (clientX change) into style px */
const zfScale = el => { const w = el.offsetWidth; return w ? (el.getBoundingClientRect().width / w || 1) : zfChain(el); };
