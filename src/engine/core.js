'use strict';
/* =========================================================
   CORE: utilities, storage, sound, speech
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') { for (const [sk, sv] of Object.entries(v)) { if (sv == null) continue; if (sk.startsWith('--')) el.style.setProperty(sk, sv); else el.style[sk] = sv; } }
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TH_DIG = '๐๑๒๓๔๕๖๗๘๙';
const thai = n => String(n).replace(/\d/g, d => TH_DIG[d]);
const WORD = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า', 'สิบ'];
/* Thai number words 0..999,999 (แสน หมื่น พัน ร้อย สิบ · ยี่ · เอ็ด) */
function thaiWords(n) {
  n = +n; if (n <= 10) return WORD[n];
  if (n >= 1e6) { const m = Math.floor(n / 1e6), r = n % 1e6; return thaiWords(m) + 'ล้าน' + (r ? thaiWords(r) : ''); }
  const D = String(n).split('').map(Number), L = D.length, P = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];
  return D.map((d, i) => { const p = L - 1 - i; if (!d) return '';
    if (p === 1) return (d === 1 ? '' : d === 2 ? 'ยี่' : WORD[d]) + 'สิบ';
    if (p === 0) return d === 1 ? 'เอ็ด' : WORD[d];
    return WORD[d] + P[p]; }).join('');
}
for (let i = 11; i <= 100; i++) WORD[i] = thaiWords(i);
const fmt = n => n >= 1000 ? n.toLocaleString('en-US') : String(n);
/* distinct numbers near n inside [lo,hi] */
function near(n, k, lo, hi) {
  const pool = shuffle(range(lo, hi).filter(x => x !== n)).sort((a, b) => Math.abs(a - n) - Math.abs(b - n));
  return shuffle([n, ...pool.slice(0, k - 1)]);
}

/* Objects with Thai names + classifiers. `e` is an ART key (see art.js). */
const ITEMS = {
  animals: [
    { e: 'dog', n: 'สุนัข', c: 'ตัว' }, { e: 'cat', n: 'แมว', c: 'ตัว' }, { e: 'rabbit', n: 'กระต่าย', c: 'ตัว' },
    { e: 'pig', n: 'หมู', c: 'ตัว' }, { e: 'frog', n: 'กบ', c: 'ตัว' }, { e: 'chick', n: 'ลูกเจี๊ยบ', c: 'ตัว' },
    { e: 'fish', n: 'ปลา', c: 'ตัว' }, { e: 'ladybug', n: 'เต่าทอง', c: 'ตัว' }, { e: 'turtle', n: 'เต่า', c: 'ตัว' },
    { e: 'panda', n: 'แพนด้า', c: 'ตัว' }, { e: 'crab', n: 'ปู', c: 'ตัว' }],
  fruits: [
    { e: 'apple', n: 'แอปเปิล', c: 'ผล' }, { e: 'orange', n: 'ส้ม', c: 'ผล' }, { e: 'strawberry', n: 'สตรอว์เบอร์รี', c: 'ผล' },
    { e: 'mango', n: 'มะม่วง', c: 'ผล' }, { e: 'banana', n: 'กล้วย', c: 'ผล' }, { e: 'watermelon', n: 'แตงโม', c: 'ชิ้น' },
    { e: 'pear', n: 'ลูกแพร์', c: 'ผล' }, { e: 'lemon', n: 'มะนาว', c: 'ผล' }],
  things: [
    { e: 'star', n: 'ดาว', c: 'ดวง' }, { e: 'balloon', n: 'ลูกโป่ง', c: 'ลูก' }, { e: 'car', n: 'รถ', c: 'คัน' },
    { e: 'ball', n: 'ลูกบอล', c: 'ลูก' }, { e: 'cookie', n: 'คุกกี้', c: 'ชิ้น' }, { e: 'cupcake', n: 'คัพเค้ก', c: 'ชิ้น' },
    { e: 'flower', n: 'ดอกไม้', c: 'ดอก' }, { e: 'pencil', n: 'ดินสอ', c: 'แท่ง' }, { e: 'book', n: 'หนังสือ', c: 'เล่ม' }, { e: 'milk', n: 'นม', c: 'กล่อง' }]
};
const ALL_ITEMS = [...ITEMS.animals, ...ITEMS.fruits, ...ITEMS.things];
const anyItem = () => pick(ALL_ITEMS);
const itemOf = e => ALL_ITEMS.find(i => i.e === e) || { e, n: '', c: 'ชิ้น' };
const twoItems = () => { const [a, b] = shuffle(ALL_ITEMS); return [a, b]; };

/* ---------- storage ---------- */
const STORE_KEY = 'ipst-p1-ch1-numberland-v1';
const SAVE = (() => {
  let d = {};
  try { d = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { }
  d.stars = d.stars || {};
  if (d.settings && !('mute' in d.settings) && d.settings.speak === false) { d.settings.mute = true; d.settings.speak = true; } // old top button only toggled speech
  d.settings = Object.assign({ speak: true, sfx: true, mute: false, input: 'keypad', penAnywhere: true, autoClear: true, unlockAll: false, askNudge: true }, d.settings || {});
  return d;
})();
function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify(SAVE)); } catch (e) { } }
const SET = SAVE.settings;

/* ---------- sound effects (WebAudio) ---------- */
let AC = null;
function audio() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } }
  if (AC && AC.state === 'suspended' && !SET.mute) AC.resume().catch(() => { });
  return AC;
}
function tone(f, t0, dur, type = 'sine', vol = .14) {
  if (SET.mute || !SET.sfx) return; const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0;
  o.type = type; o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + .05);
}
const sfx = {
  tap() { tone(900, 0, .06, 'sine', .07); },
  pop(i = 0) { tone(500 + i * 70, 0, .1, 'triangle', .1); },
  ok() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * .08, .2, 'triangle', .12)); },
  no() { tone(240, 0, .16, 'square', .05); tone(190, .14, .22, 'square', .05); },
  win() { [523, 659, 784, 659, 784, 1046].forEach((f, i) => tone(f, i * .12, .25, 'triangle', .12)); },
  roar() {
    if (SET.mute || !SET.sfx) return; const a = audio(); if (!a) return;
    const t = a.currentTime, o = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
    o.type = 'sawtooth'; o2.type = 'square'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(70, t + .7);
    o2.frequency.setValueAtTime(152, t); o2.frequency.exponentialRampToValueAtTime(68, t + .7);
    f.type = 'lowpass'; f.frequency.value = 700; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09, t + .06); g.gain.exponentialRampToValueAtTime(.001, t + .8);
    o.connect(f); o2.connect(f); f.connect(g).connect(a.destination); o.start(t); o2.start(t); o.stop(t + .85); o2.stop(t + .85);
  },
  boing() { tone(300, 0, .12, 'triangle', .08); tone(450, .1, .14, 'triangle', .07); },
  page() { tone(660, 0, .07, 'sine', .06); tone(880, .05, .08, 'sine', .05); }
};
document.addEventListener('pointerdown', () => audio(), { once: true, capture: true });

/* ---------- Thai speech ---------- */
let TH_VOICE = null;
function pickVoice() {
  try { const vs = speechSynthesis.getVoices(); TH_VOICE = vs.find(v => /^th/i.test(v.lang)) || null; } catch (e) { }
}
if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speakText(html) {
  const d = document.createElement('div'); d.innerHTML = html;
  d.querySelectorAll('.fq').forEach(f => { const [n, dd] = [...f.children].map(x => x.textContent); f.replaceWith(` เศษ ${n} ส่วน ${dd} `); });
  d.querySelectorAll('.fop').forEach(o => { o.textContent = ' ' + ({ '×': 'คูณ', '÷': 'หาร', '−': 'ลบ', '+': 'บวก', '=': 'เท่ากับ', '(': '', ')': '' }[o.textContent] ?? o.textContent) + ' '; });
  return d.textContent.replace(/ห\.ร\.ม\./g, ' หอรอมอ ').replace(/ค\.ร\.น\./g, ' คอรอนอ ').replace(/²/g, ' ยกกำลังสอง ').replace(/³/g, ' ยกกำลังสาม ').replace(/⁴/g, ' ยกกำลังสี่ ').replace(/×/g, ' คูณ ').replace(/÷/g, ' หาร ').replace(/\p{Extended_Pictographic}|️/gu, ' ').replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim();
}
/* force: true = speak even if instruction reading is off (feedback on a tap);
   'listen' = the explicit "ฟังอีกครั้ง" button, which speaks even when muted. Master mute (SET.mute) silences everything else. */
function say(text, force) {
  if (!window.speechSynthesis || !text) return;
  if (SET.mute && force !== 'listen') return;
  if (!SET.speak && !force) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speakText(text));
    u.lang = 'th-TH'; if (TH_VOICE) u.voice = TH_VOICE; u.rate = .88; u.pitch = 1.1;
    speechSynthesis.speak(u);
  } catch (e) { }
}
function hush() { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { } }
function setMute(m) {
  SET.mute = !!m; persist();
  if (SET.mute) { hush(); try { AC && AC.state === 'running' && AC.suspend(); } catch (e) { } }
  else { try { AC && AC.resume(); } catch (e) { } }
}

/* ---------- confetti (palette shapes, respects reduced motion) ---------- */
const REDUCED = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function confetti(n = 40) {
  if (REDUCED()) return;
  const cols = ['#F5B52E', '#FF6F7D', '#4C9BF0', '#2FBF8C', '#8E7CF0', '#FFD76A'];
  for (let i = 0; i < n; i++) {
    const k = i % 3, c = pick(cols);
    const s = h('div', { class: 'confetti' });
    s.style.left = Math.random() * 100 + 'vw';
    s.style.background = k === 2 ? 'none' : c;
    s.style.borderRadius = k === 1 ? '50%' : '3px';
    if (k === 0) { s.style.width = '8px'; s.style.height = '14px'; }
    if (k === 2) s.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2l2.6 6.6L21 9.5l-5 4.4 1.5 6.6L12 17l-5.5 3.5L8 13.9l-5-4.4 6.4-.9z" fill="${c}"/></svg>`;
    document.body.append(s);
    const dur = 1800 + Math.random() * 1400, x = rnd(-80, 80);
    s.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${x}px,${innerHeight + 60}px) rotate(${rnd(-540, 540)}deg)`, opacity: .9 }],
      { duration: dur, delay: Math.random() * 300, easing: 'cubic-bezier(.25,.6,.5,1)' }).onfinish = () => s.remove();
  }
}
/* rotate answer positions of an authored exam (answer key varies) */
const xrot = (ex, k = 0) => ex.map((q, i) => { const n = q.opts.length, r = (i * 7 + k) % n; return r ? { ...q, opts: [...q.opts.slice(r), ...q.opts.slice(0, r)], a: (q.a - r + n) % n } : q; });
