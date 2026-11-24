'use strict';
/* =========================================================
   DRAGKEEP (v239): keep the element under the finger alive while dragging.
   Almost every drag widget redraws its picture with `el.innerHTML = …` on each pointermove.
   That deletes the very element the finger pressed (a handle, a dot…). Desktop browsers and
   Chrome carry on, but iPad Safari stops sending the drag once that element is gone — so the
   dot "doesn't move" (ผู้ใช้เจอ: ลากจุดในแผนภาพกล่องไม่ได้).
   Fix for every widget at once: while a pointer is down, an innerHTML assignment on an element
   that contains the pressed element is applied as an in-place update (same tags → attributes
   and text are patched, nodes are kept); only parts whose structure changed are replaced.
   Outside a drag, innerHTML works exactly as before. Prefix dk.
   ========================================================= */
let DK_T = null;
/* only presses inside a drawn picture (svg) — buttons and lists keep the old behaviour */
addEventListener('pointerdown', e => { const t = e.target; DK_T = t && t.nodeType === 1 && t.closest && t.closest('svg') ? t : null; }, true);
['pointerup', 'pointercancel'].forEach(k => addEventListener(k, () => { DK_T = null; }, true));
/* patch a's children to look like b's (b's nodes are moved into a where new) */
/* keyed by tag + class: a node that only moved (because an arc or label before it came or went) is kept, never rebuilt */
const dkC = e => (e.getAttribute('class') || '').trim().split(/\s+/)[0]; /* first class only: 'r4-peg on' while held is still the same peg */
const dkSame = (x, y) => x.nodeType === y.nodeType && x.nodeName === y.nodeName && (x.nodeType !== 1 || dkC(x) === dkC(y));
function dkPatch(x, y) {
  if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
  for (const at of [...x.attributes]) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
  for (const at of [...y.attributes]) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
  dkKids(x, y); }
function dkKids(a, b) { const A = [...a.childNodes], B = [...b.childNodes]; let j = 0;
  for (const y of B) { let m = -1;
    for (let k = j; k < A.length; k++) { if (dkSame(A[k], y)) { m = k; break; } if (DK_T && A[k].contains && A[k].contains(DK_T)) break; }
    if (m < 0) { a.insertBefore(y, j < A.length ? A[j] : null); continue; }
    for (let k = j; k < m; k++) a.removeChild(A[k]);
    dkPatch(A[m], y); j = m + 1; }
  for (let k = A.length - 1; k >= j; k--) if (A[k].parentNode === a) a.removeChild(A[k]); }
const dkMorph = (el, html, set) => { const t = el.namespaceURI && el.namespaceURI !== 'http://www.w3.org/1999/xhtml' ? document.createElementNS(el.namespaceURI, el.localName) : document.createElement(el.localName); set.call(t, html); dkKids(el, t); };
(() => {
  const d = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML'); if (!d || !d.set) return;
  Object.defineProperty(Element.prototype, 'innerHTML', { configurable: true, enumerable: d.enumerable, get: d.get,
    set(v) { const t = DK_T; if (t && t !== this && t.isConnected && this.contains(t)) { try { dkMorph(this, String(v), d.set); return; } catch (_) { } } d.set.call(this, v); } });
})();
