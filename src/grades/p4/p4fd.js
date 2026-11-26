/* =========================================================
   ป.4 บทที่ 6 ทะเลทรายเศษส่วน — หน้าสอนและเกมเรียงใหม่ (v255 · ผู้ใช้ขอ) · prefix f4d
   เหมือนบทที่ 7–10: ประเด็นละหน้า ① ดูภาพ (r4vSee) → (บางประเด็น) ลองปรับเอง → ② ทำให้ดู (r4dDo: ดินสอนับส่วน ระบาย ตัดส่วนให้เล็กลง
   ขีดฆ่าส่วนที่เอาออก เขียนบนกระดาษทด คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อแบบเดียวกับในเกม)
   ไม่มี stepper ในหน้าสอน: หน้าปรับเองใหม่ f4dPaint (ลากระบายส่วน) f4dGroups (แตะกลุ่ม) f4dCut (ลากตัดแต่ละส่วนให้เล็กลง) แทน simF4Set simF4Whole simF4Imp simF4Eq
   เกมด่าน 1–12 เรียงตามลำดับประเด็น 10 ข้อ (f4dGame ห่อเกมเดิม) · วางหลัง p4ed.js ใน order.txt
   ========================================================= */
const F4DC = { on: '#FFB84C', on2: '#6FB2F5', ink: '#2B2550', p: '#E5487A', b: '#2F7BC0', g: '#1B8862', o: '#EC7F1E', fade: '#B7AED3' };
/* fraction bars as svg: one bar per whole, d parts each · piece(i) = [x, y, w, h] */
function f4dBars(n, d, o = {}) { const wholes = Math.max(o.min || 1, Math.ceil(n / d)), BW = o.bw || 280, BH = o.bh || 38, gap = o.gap || 16, W = o.W || 360, H = o.H || 240, x0 = o.x0 != null ? o.x0 : (W - BW) / 2, y0 = o.y0 != null ? o.y0 : (H - (wholes * BH + (wholes - 1) * gap)) / 2;
  const y = k => y0 + k * (BH + gap), piece = i => { const k = Math.floor(i / d), j = i % d; return [x0 + j * BW / d, y(k), BW / d, BH]; };
  let s = ''; for (let k = 0; k < wholes; k++) { const whole = (o.solid || []).includes(k); for (let j = 0; j < d; j++) { const i = k * d + j, [x, yy, w] = piece(i), on = i < n; if (!whole) s += `<rect x="${a4n(x)}" y="${a4n(yy)}" width="${a4n(w)}" height="${BH}" fill="${on ? (o.col ? o.col(i) : F4DC.on) : '#fff'}" stroke="#8F86B3" stroke-width="1.2"/>`; }
    if (whole) s += `<rect x="${x0}" y="${a4n(y(k))}" width="${BW}" height="${BH}" fill="${F4DC.on}"/>`; s += `<rect x="${x0}" y="${a4n(y(k))}" width="${BW}" height="${BH}" fill="none" stroke="${F4DC.ink}" stroke-width="2.2"/>`; }
  return { s, piece, y, x0, BW, BH, wholes }; }
/* a written fraction (numerator over denominator), optional whole number */
const f4dFr = (x, y, n, d, col = F4DC.ink, w, cls = 'f4d-n') => { const L = Math.max(String(n).length, String(d).length) * 9 + 10; return (w ? `<text x="${a4n(x - L / 2 - 6)}" y="${a4n(y + 9)}" class="${cls}" text-anchor="end" style="fill:${col}">${w}</text>` : '') + `<text x="${a4n(x)}" y="${a4n(y - 6)}" class="${cls}" text-anchor="middle" style="fill:${col}">${n}</text><path d="M${a4n(x - L / 2)} ${a4n(y)} H${a4n(x + L / 2)}" fill="none" stroke="${col}" stroke-width="2.4"/><text x="${a4n(x)}" y="${a4n(y + 22)}" class="${cls}" text-anchor="middle" style="fill:${col}">${d}</text>`; };
const f4dNums = (B, from, to, col = F4DC.ink, dy = 0, start = 1) => Array.from({ length: to - from }, (_, k) => { const [x, y, w, hh] = B.piece(from + k); return r4dTx(x + w / 2, y + hh / 2 + 6 + dy, String(start + k), col, 'r4d-sm'); }).join('');
const f4dCutL = (B, k0, parts, sub, col = F4DC.p) => { let s = ''; for (let j = 0; j < parts; j++) { const [x, y, w, hh] = B.piece(k0 * parts + j); for (let t = 1; t < sub; t++) s += `<path d="M${a4n(x + w * t / sub)} ${a4n(y + 2)} V${a4n(y + hh - 2)}" fill="none" stroke="${col}" stroke-width="1.8"/>`; } return s; };
const f4dX = (B, i, col = F4DC.p) => { const [x, y, w, hh] = B.piece(i); return `<path d="M${a4n(x + 4)} ${a4n(y + 4)} L${a4n(x + w - 4)} ${a4n(y + hh - 4)} M${a4n(x + w - 4)} ${a4n(y + 4)} L${a4n(x + 4)} ${a4n(y + hh - 4)}" fill="none" stroke="${col}" stroke-width="2.6"/>`; };
const f4dShade = (B, from, to, col = F4DC.on) => Array.from({ length: to - from }, (_, k) => { const [x, y, w, hh] = B.piece(from + k); return `<rect x="${a4n(x + 1)}" y="${a4n(y + 1)}" width="${a4n(w - 2)}" height="${a4n(hh - 2)}" fill="${col}"/>`; }).join('');
const f4dRing = (B, k, col = F4DC.p) => `<rect x="${a4n(B.x0 - 5)}" y="${a4n(B.y(k) - 5)}" width="${a4n(B.BW + 10)}" height="${a4n(B.BH + 10)}" rx="8" fill="none" stroke="${col}" stroke-width="2.6"/>`;
const f4dW = (n, d, w) => FX(w ? `[${w} ${n}/${d}]` : `[${n}/${d}]`);

/* hands-on (no steppers) */
function f4dPaint(d, wholes, missions, cap) { const o = { min: wholes, bw: 420, bh: 44, gap: 20, W: 560, H: 250 }, B0 = f4dBars(0, d, o), tot = wholes * d;
  return tgScene({ W: 560, H: 250, st: { n: 0 }, cap: cap || `<b>ลากนิ้ว</b>ไปบนแถบเพื่อระบาย — แถบละ ${d} ส่วน`, missions: missions.map(([t, n]) => [t, s => s.n === n]),
    svg: s => f4dBars(s.n, d, o).s, drag: (pt, s) => { for (let i = 0; i < tot; i++) { const [x, y, w, hh] = B0.piece(i); if (pt[0] >= x && pt[0] <= x + w + .5 && pt[1] >= y && pt[1] <= y + hh) { if (i + 1 === s.n) return null; sfx.tap(); return { n: i + 1 }; } } return null; },
    info: s => { const w = Math.floor(s.n / d), r = s.n % d; return `ระบาย ${s.n} ส่วน จากแถบละ ${d} ส่วน = <b>${f4dW(s.n, d)}</b>` + (s.n >= d ? `${r4vSep}= ${r ? `<b>${f4dW(r, d, w)}</b> (จำนวนคละ)` : `<b>${w}</b> รูปเต็ม`}` : `${r4vSep}${s.n === d ? '' : 'เศษส่วนแท้ (น้อยกว่า 1)'}`); } }); }
function f4dGroups(G, per, missions) { const gw = 104, gh = 84, gap = 18, x0 = (560 - (G * gw + (G - 1) * gap)) / 2, y0 = 70, gx = i => x0 + i * (gw + gap);
  return tgScene({ W: 560, H: 250, st: { n: 0 }, cap: `<b>แตะกลุ่ม</b>เพื่อระบาย — ของ ${G * per} ชิ้น แบ่งเป็น ${G} กลุ่มเท่า ๆ กัน`, missions: missions.map(([t, n]) => [t, s => s.n === n]),
    svg: s => Array.from({ length: G }, (_, i) => `<rect x="${gx(i)}" y="${y0}" width="${gw}" height="${gh}" rx="14" fill="${i < s.n ? '#FFE2B0' : '#fff'}" stroke="${i < s.n ? F4DC.o : '#B9AFD6'}" stroke-width="2.4"/>` + Array.from({ length: per }, (_, k) => `<circle cx="${a4n(gx(i) + gw / (per + 1) * (k + 1))}" cy="${y0 + gh / 2}" r="13" fill="${i < s.n ? '#E5505E' : '#F3C4C9'}" stroke="#8A2F3A" stroke-width="1.4"/>`).join('')).join(''),
    drag: (pt, s) => { const i = Array.from({ length: G }, (_, k) => k).find(k => pt[0] >= gx(k) && pt[0] <= gx(k) + gw && pt[1] >= y0 - 10 && pt[1] <= y0 + gh + 10); if (i == null || i + 1 === s.n) return null; sfx.tap(); return { n: i + 1 }; },
    info: s => `ระบาย ${s.n} กลุ่ม จาก ${G} กลุ่ม = <b>${f4dW(s.n, G)}</b> ของทั้งหมด${r4vSep}(${s.n * per} ชิ้น จาก ${G * per} ชิ้น)` }); }
function f4dCut(n, d, missions, k0 = 1, cap) { const o = { bw: 420, bh: 50, W: 560, H: 250, y0: 60 }, tx = k => 90 + (k - 1) * 95;
  return tgScene({ W: 560, H: 250, st: { k: k0, seen: [k0] }, cap: cap || `<b>ลากจุดสีชมพู</b> — ตัดทุกส่วนให้เล็กลงเท่า ๆ กัน ส่วนที่ระบายยังเท่าเดิม`, missions: missions.map(([t, f]) => [t, f]),
    svg: s => { const B = f4dBars(n * s.k, d * s.k, o); let t = B.s; for (let j = 1; j < d; j++) t += `<path d="M${a4n(B.x0 + B.BW * j / d)} ${o.y0} V${o.y0 + o.bh}" stroke="${F4DC.ink}" stroke-width="3"/>`;
      t += `<path d="M${tx(1)} 200 H${tx(5)}" stroke="#D9D2EC" stroke-width="6" stroke-linecap="round"/>` + [1, 2, 3, 4, 5].map(k => `<text x="${tx(k)}" y="232" class="r4d-tx" text-anchor="middle" style="fill:${F4DC.ink}">×${k}</text>`).join('');
      return t + tgHandle(tx(s.k), 200, F4DC.p); },
    drag: (pt, s) => { const k = Math.max(1, Math.min(5, Math.round((pt[0] - 90) / 95) + 1)); if (k === s.k) return null; sfx.tap(); return { k, seen: s.seen.includes(k) ? s.seen : [...s.seen, k] }; },
    info: s => `${f4dW(n, d)} = ${f4dW(n * s.k, d * s.k)}${r4vSep}ตัวเศษ × ${s.k} ตัวส่วน × ${s.k} — ระบายเท่าเดิม` }); }

const f4dSee = (title, cap, list) => a4dSee(title, cap, list);
/* the lessons' old games → twice, interleaved, so the game follows the order the ideas are taught (easy → hard) */
const f4dGame = g0 => () => { const A = g0(), B = g0(); return [...A.map((q, j) => ({ ...q, __diff: j * 2 + 1, __kind: 'f4d' + j + 'a' })), ...B.map((q, j) => ({ ...q, __diff: j * 2 + 2, __kind: 'f4d' + j + 'b' }))]; };

/* =========================================================
   the lessons
   ========================================================= */
const F4D_TEACH = {
  /* ด่าน 1 ความหมาย: เศษส่วนของรูป → ของกลุ่ม → อ่าน */
  1421: (() => { const B = f4dBars(3, 5, { y0: 80 }), gw = 66, gx = i => 34 + i * 76, grp = on => Array.from({ length: 4 }, (_, i) => `<rect x="${gx(i)}" y="70" width="${gw}" height="64" rx="12" fill="${i < on ? '#FFE2B0' : '#fff'}" stroke="${i < on ? F4DC.o : '#B9AFD6'}" stroke-width="2.2"/>` + [0, 1, 2].map(k => `<circle cx="${gx(i) + 16 + k * 17}" cy="102" r="7.5" fill="${i < on ? '#E5505E' : '#F3C4C9'}" stroke="#8A2F3A" stroke-width="1"/>`).join('')).join('');
    return [
      f4dSee('เศษส่วนของรูป', '<b>แตะรูป</b> — แบ่งเป็นส่วนเท่า ๆ กัน แล้วระบาย', [
        { t: 'แถบแบ่ง 5 ส่วนเท่ากัน', f: on => f4dBars(on ? 3 : 0, 5, { y0: 60 }).s + (on ? r4vH(f4dFr(180, 160, 3, 5, F4DC.p, null, 'f4d-n')) : ''), s: 'ระบาย 3 ส่วน จาก 5 ส่วน<br>= <b>เศษสามส่วนห้า</b>' }]),
      r4dShow('เขียนเศษส่วนจากรูป', { fig: B.s, q: 'ส่วนที่ระบายสีเป็นเศษส่วนเท่าใด',
        steps: [{ ink: f4dNums(B, 0, 5, F4DC.b, 40), w: 'แบ่ง 5 ส่วนเท่ากัน', n: 'ตัวส่วน = 5 (ส่วนทั้งหมด)' },
          { ink: Array.from({ length: 3 }, (_, k) => { const [x, y, w] = B.piece(k); return `<circle cx="${a4n(x + w / 2)}" cy="${a4n(y + 19)}" r="13" fill="none" stroke="${F4DC.p}" stroke-width="2.4"/>`; }).join(''), w: 'ระบาย 3 ส่วน', n: 'ตัวเศษ = 3 (ส่วนที่ระบาย)' },
          { ink: f4dFr(180, 190, 3, 5, F4DC.p), w: `เขียน ${f4dW(3, 5)}`, n: 'อ่านว่า เศษสามส่วนห้า', ans: 1 }],
        fin: `ตัวส่วน = <b>ส่วนทั้งหมด</b>${r4vSep}ตัวเศษ = <b>ส่วนที่ระบาย</b>`, say: 'ตัวส่วนคือจำนวนส่วนทั้งหมด ตัวเศษคือส่วนที่ระบาย' }),
      a4dTry(1421, () => { const [n, d] = f4pp(); return Q.f4Pic({ n, d }); }, 'เศษส่วนจากรูป'),
      r4dPlay('ระบายแถบ', 'ลากระบายแถบ', () => f4dPaint(6, 1, [['ระบาย 1/6', 1], ['ระบาย 4/6', 4], ['ระบาย 5/6', 5]])),
      f4dSee('เศษส่วนของกลุ่ม', '<b>แตะรูป</b> — นับเป็นกลุ่ม', [
        { t: 'ผลไม้ 12 ผล แบ่ง 4 กลุ่ม', f: on => grp(on ? 3 : 0) + (on ? r4vH(f4dFr(180, 186, 3, 4, F4DC.p)) : ''), s: 'ระบาย 3 กลุ่ม จาก 4 กลุ่ม<br>= <b>3/4</b> ของทั้งหมด' }]),
      r4dShow('เศษส่วนของกลุ่ม', { fig: grp(3), q: 'ส่วนที่ระบายสีเป็นเศษส่วนเท่าใดของทั้งหมด',
        steps: [{ ink: [0, 1, 2, 3].map(i => r4dTx(gx(i) + gw / 2, 60, String(i + 1), F4DC.b)).join(''), w: 'แบ่ง 4 กลุ่มเท่ากัน', n: 'ตัวส่วน = จำนวนกลุ่ม' },
          { ink: [0, 1, 2].map(i => `<path d="M${gx(i) + 22} 150 l10 10 l18 -20" fill="none" stroke="${F4DC.g}" stroke-width="3"/>`).join(''), w: 'ระบาย 3 กลุ่ม', n: 'ตัวเศษ = กลุ่มที่ระบาย' },
          { ink: f4dFr(180, 196, 3, 4, F4DC.p), w: `${f4dW(3, 4)} ของทั้งหมด`, n: 'นับเป็นกลุ่ม ไม่ใช่นับเป็นผล', ans: 1 }],
        fin: 'เศษส่วนของกลุ่ม: นับ<b>กลุ่ม</b> ไม่ใช่นับชิ้น', say: 'เศษส่วนของกลุ่ม นับเป็นกลุ่ม ไม่ใช่นับเป็นชิ้น' }),
      r4dPlay('แตะกลุ่ม', 'แตะกลุ่มเพื่อระบาย', () => f4dGroups(4, 3, [['ระบาย 1/4 ของทั้งหมด', 1], ['ระบาย 3/4 ของทั้งหมด', 3], ['ระบาย 2/4 ของทั้งหมด', 2]])),
      a4dTry(1421, () => { const d = rnd(3, 6); return Q.f4Set({ d, per: rnd(2, 4), n: rnd(1, d - 1) }); }, 'เศษส่วนของกลุ่ม'),
      a4dTry(1421, () => f4ReadQ(0, ...f4pp()), 'อ่านเศษส่วน')]; })(),

  /* ด่าน 2 เศษส่วนที่เท่ากับ 1 */
  1422: (() => { const B = f4dBars(0, 6, { y0: 70 });
    return [
      f4dSee('เศษส่วนที่เท่ากับ 1', '<b>แตะรูป</b> — ระบายครบทุกส่วน', [
        { t: 'ระบายครบ', f: on => f4dBars(on ? 4 : 3, 4, { y0: 60 }).s + (on ? r4vH(f4dFr(150, 160, 4, 4, F4DC.p) + r4dTx(200, 168, '= 1', F4DC.p, 'r4v-big')) : ''), s: 'ระบายครบ 4 ส่วน<br><b>4/4 = 1</b>' }]),
      r4dShow('เศษส่วนใดเท่ากับ 1', { fig: B.s, q: 'แถบแบ่ง 6 ส่วน ระบายกี่ส่วนจึงเท่ากับ 1',
        steps: [{ ink: f4dShade(B, 0, 6) + f4dNums(B, 0, 6), w: 'ระบาย 6 ส่วน จาก 6 ส่วน', n: 'ครบทุกส่วน = 1 รูปเต็ม' }, { ink: f4dFr(150, 170, 6, 6, F4DC.p) + r4dTx(200, 178, '= 1', F4DC.p, 'r4d-big'), w: `${f4dW(6, 6)} = 1`, n: 'ตัวเศษ = ตัวส่วน', ans: 1 }],
        fin: 'ตัวเศษ<b>เท่ากับ</b>ตัวส่วน → เท่ากับ 1', say: 'ตัวเศษเท่ากับตัวส่วน เศษส่วนนั้นเท่ากับหนึ่ง' }),
      r4dPlay('ระบายให้เต็ม', 'ลากระบายแถบให้เต็ม', () => f4dPaint(8, 1, [['ระบาย 5/8', 5], ['ระบายให้เท่ากับ 1', 8]])),
      a4dTry(1422, () => { const d = rnd(3, 15); return Math.random() < .5 ? Q.f4Fill({ tpl: `[□/${d}] = 1`, ans: d, hint: 'ตัวเศษต้องเท่ากับตัวส่วน' }) : Q.f4Fill({ tpl: `[${d}/□] = 1`, ans: d, hint: 'ตัวส่วนต้องเท่ากับตัวเศษ' }); }, 'เท่ากับ 1')]; })(),

  /* ด่าน 3 เศษส่วนที่เท่ากับจำนวนนับ */
  1423: (() => { const B = f4dBars(0, 4, { min: 3, bh: 34, gap: 14, y0: 30 });
    return [
      f4dSee('เท่ากับจำนวนนับ', '<b>แตะรูป</b> — นับรูปเต็ม', [
        { t: '12/4', f: on => f4dBars(12, 4, { bh: 32, gap: 12, y0: 40 }).s + (on ? r4vH([0, 1, 2].map(k => r4dTx(338, 40 + k * 44 + 22, String(k + 1), F4DC.p, 'r4v-tx')).join('') + r4dTx(180, 200, '12/4 = 3', F4DC.p, 'r4v-big')) : ''), s: '12 ส่วน รูปละ 4 ส่วน<br>= <b>3 รูปเต็ม</b>' }]),
      r4dShow('[12/4] เท่ากับเท่าไร', { fig: B.s, q: `${f4dW(12, 4)} เท่ากับจำนวนนับใด`,
        steps: [{ ink: f4dShade(B, 0, 12) + f4dNums(B, 0, 12), w: 'ระบาย 12 ส่วน', n: 'แถบละ 4 ส่วน' },
          { ink: [0, 1, 2].map(k => f4dRing(B, k) + r4dTx(B.x0 + B.BW + 20, B.y(k) + 24, String(k + 1), F4DC.p, 'r4d-tx')).join(''), w: 'ได้ 3 รูปเต็ม', n: '12 ÷ 4 = 3' },
          { w: `${f4dW(12, 4)} = 3`, n: 'ตัวเศษ ÷ ตัวส่วน', ans: 1 }],
        fin: 'ตัวเศษหารด้วยตัวส่วน<b>ลงตัว</b> → เป็นจำนวนนับ', say: 'ตัวเศษหารด้วยตัวส่วนลงตัว เศษส่วนนั้นเป็นจำนวนนับ' }),
      r4dPlay('ระบายเป็นรูปเต็ม', 'ลากระบายให้เป็นรูปเต็ม', () => f4dPaint(4, 3, [['ระบาย 8/4 = 2 รูปเต็ม', 8], ['ระบาย 12/4 = 3 รูปเต็ม', 12], ['ระบาย 4/4 = 1 รูปเต็ม', 4]])),
      a4dTry(1423, () => { const d = rnd(2, 12), k = rnd(2, 9), t = rnd(0, 2); return t === 0 ? Q.f4Fill({ tpl: `[${k * d}/${d}] = □`, ans: k, hint: `${k * d} ÷ ${d}` }) : t === 1 ? Q.f4Fill({ tpl: `${k} = [□/${d}]`, ans: k * d, hint: `${k} × ${d}` }) : Q.f4Fill({ tpl: `[${k * d}/□] = ${k}`, ans: d, hint: `${k} × □ = ${k * d}` }); }, 'เท่ากับจำนวนนับ')]; })(),

  /* ด่าน 4 เศษส่วนแท้ เศษเกิน */
  1424: (() => { const B = f4dBars(0, 5, { min: 2, y0: 60 });
    return [
      f4dSee('เศษส่วนแท้ กับ เศษเกิน', '<b>แตะรูป</b> — น้อยกว่า 1 หรือเกิน 1', [
        { t: 'เศษส่วนแท้', f: on => f4dBars(3, 5, { min: 2, y0: 50 }).s + (on ? r4vH(f4dFr(180, 186, 3, 5, F4DC.g)) : ''), s: 'ตัวเศษ<b>น้อยกว่า</b>ตัวส่วน<br>น้อยกว่า 1' },
        { t: 'เศษเกิน', f: on => f4dBars(7, 5, { min: 2, y0: 50 }).s + (on ? r4vH(f4dFr(180, 186, 7, 5, F4DC.p)) : ''), s: 'ตัวเศษ<b>มากกว่าหรือเท่ากับ</b>ตัวส่วน<br>ตั้งแต่ 1 ขึ้นไป' }]),
      r4dShow('เป็นเศษส่วนชนิดใด', { fig: B.s, q: `${f4dW(7, 5)} เป็นเศษส่วนแท้หรือเศษเกิน`,
        steps: [{ ink: f4dShade(B, 0, 7) + f4dNums(B, 0, 7), w: 'ระบาย 7 ส่วน', n: 'แถบละ 5 ส่วน' },
          { ink: f4dRing(B, 0, F4DC.b) + r4dTx(B.x0 + B.BW + 20, B.y(0) + 26, '1', F4DC.b, 'r4d-tx'), w: 'เกิน 1 รูป', n: 'ตัวเศษ 7 > ตัวส่วน 5' },
          { w: `${f4dW(7, 5)} เป็นเศษเกิน`, n: 'ตัวเศษ ≥ ตัวส่วน', ans: 1 }],
        fin: `แท้: ตัวเศษ <b>&lt;</b> ตัวส่วน${r4vSep}เศษเกิน: ตัวเศษ <b>≥</b> ตัวส่วน`, say: 'เศษส่วนแท้ ตัวเศษน้อยกว่าตัวส่วน เศษเกิน ตัวเศษมากกว่าหรือเท่ากับตัวส่วน' }),
      r4dPlay('ระบายเกิน 1', 'ลากระบายแถบ', () => f4dPaint(5, 2, [['เศษส่วนแท้ 4/5', 4], ['เศษเกิน 7/5', 7], ['พอดี 5/5', 5]])),
      a4dTry(1424, () => f4Kind(f4N(6, (_, i) => i % 2 ? f4imp() : f4pp())), 'แท้หรือเกิน'),
      a4dTry(1424, () => { const [n, d] = f4imp(); return Q.f4Pic({ n, d }); }, 'เศษเกินจากรูป')]; })(),

  /* ด่าน 5 จำนวนคละ */
  1425: (() => { const B = f4dBars(13, 5, { min: 3, bh: 34, gap: 14, y0: 30, solid: [0, 1] });
    return [
      f4dSee('จำนวนคละ', '<b>แตะรูป</b> — จำนวนนับกับเศษส่วนแท้', [
        { t: 'สองเศษสามส่วนห้า', f: on => f4dBars(13, 5, { min: 3, bh: 32, gap: 12, y0: 30, solid: [0, 1] }).s + (on ? r4vH(f4dFr(196, 196, 3, 5, F4DC.p, 2)) : ''), s: '2 รูปเต็ม กับ 3/5<br>= <b>จำนวนคละ</b>' }]),
      r4dShow('เขียนจำนวนคละจากรูป', { fig: B.s, q: 'เขียนจำนวนคละแสดงส่วนที่ระบายสี',
        steps: [{ ink: [0, 1].map(k => f4dRing(B, k) + r4dTx(B.x0 + B.BW / 2, B.y(k) + 24, String(k + 1), '#fff', 'r4d-big')).join(''), w: '2 รูปเต็ม', n: 'นับรูปเต็มก่อน' },
          { ink: f4dNums(B, 10, 13, F4DC.p), w: `อีก ${f4dW(3, 5)}`, n: 'ส่วนที่เหลือ แถบละ 5 ส่วน' },
          { w: `${f4dW(3, 5, 2)}`, n: 'อ่านว่า สองเศษสามส่วนห้า', ans: 1 }],
        fin: 'จำนวนคละ = <b>จำนวนนับ</b> กับ <b>เศษส่วนแท้</b>', say: 'จำนวนคละ คือจำนวนนับกับเศษส่วนแท้' }),
      a4dTry(1425, () => { const [w, n, d] = f4mix(); return Q.f4MixPic({ w, n, d }); }, 'จำนวนคละจากรูป'),
      a4dTry(1425, () => f4ReadQ(...f4mix()), 'อ่านจำนวนคละ')]; })(),

  /* ด่าน 6 จำนวนคละ ↔ เศษเกิน */
  1426: (() => { const B = f4dBars(13, 5, { min: 3, bh: 34, gap: 14, y0: 30, solid: [0, 1] }), C = f4dBars(17, 5, { min: 4, bh: 30, gap: 12, y0: 18 });
    return [
      f4dSee('จำนวนคละ → เศษเกิน', '<b>แตะรูป</b> — ตัดรูปเต็มให้เป็นส่วนเท่ากัน', [
        { t: '2 3/5 = 13/5', f: on => f4dBars(13, 5, { min: 3, bh: 32, gap: 12, y0: 30, solid: on ? [] : [0, 1] }).s + (on ? r4vH(r4dTx(180, 210, '5 + 5 + 3 = 13 ส่วน', F4DC.p, 'r4v-tx')) : ''), s: '2 รูปเต็ม = 10 ส่วน<br>10 + 3 = <b>13/5</b>' }]),
      r4dShow('จำนวนคละเป็นเศษเกิน', { fig: B.s, q: `เขียน ${f4dW(3, 5, 2)} ในรูปเศษเกิน`,
        steps: [{ ink: [0, 1].map(k => [1, 2, 3, 4].map(j => `<path d="M${a4n(B.x0 + B.BW * j / 5)} ${a4n(B.y(k) + 2)} V${a4n(B.y(k) + B.BH - 2)}" fill="none" stroke="${F4DC.p}" stroke-width="2"/>`).join('')).join(''), w: '1 รูปเต็ม = 5 ส่วน', n: 'ตัดรูปเต็มเป็นส่วนละ 1/5' },
          { ink: f4dNums(B, 0, 10), w: '2 × 5 = 10', n: '2 รูปเต็ม' }, { ink: f4dNums(B, 10, 13, F4DC.p, 0, 11), w: '10 + 3 = 13', n: 'บวกส่วนที่เหลือ' },
          { w: `${f4dW(3, 5, 2)} = ${f4dW(13, 5)}`, n: 'ตัวส่วนเท่าเดิม', ans: 1 }],
        fin: 'จำนวนคละ → เศษเกิน: <b>จำนวนนับ × ตัวส่วน + ตัวเศษ</b>', say: 'จำนวนนับคูณตัวส่วน แล้วบวกตัวเศษ' }),
      a4dTry(1426, () => { const [w, n, d] = f4mix(); return Q.f4ToImp({ w: w + rnd(0, 6), n, d }); }, 'เขียนเป็นเศษเกิน'),
      r4dShow('เศษเกินเป็นจำนวนคละ', { fig: C.s, q: `เขียน ${f4dW(17, 5)} ในรูปจำนวนคละ`,
        steps: [{ ink: [0, 1, 2].map(k => f4dRing(C, k) + r4dTx(C.x0 + C.BW + 20, C.y(k) + 22, String(k + 1), F4DC.p, 'r4d-tx')).join(''), w: '17 ÷ 5 = 3 เศษ 2', n: 'จัดเป็นรูปเต็ม รูปละ 5 ส่วน' },
          { ink: f4dNums(C, 15, 17, F4DC.p), w: `3 รูปเต็ม เหลือ ${f4dW(2, 5)}`, n: 'เศษ 2 เป็นตัวเศษ' }, { w: `${f4dW(17, 5)} = ${f4dW(2, 5, 3)}`, n: 'ตัวส่วนเท่าเดิม', ans: 1 }],
        fin: 'เศษเกิน → จำนวนคละ: <b>ตัวเศษ ÷ ตัวส่วน</b> ผลหาร = จำนวนนับ เศษ = ตัวเศษ', say: 'ตัวเศษหารด้วยตัวส่วน ผลหารเป็นจำนวนนับ เศษเป็นตัวเศษ' }),
      r4dPlay('ระบายแล้วดูจำนวนคละ', 'ลากระบายแล้วดูจำนวนคละ', () => f4dPaint(4, 3, [['ระบาย 9/4', 9], ['ระบาย 2 3/4', 11], ['ระบาย 6/4', 6]])),
      a4dTry(1426, () => { const [w, n, d] = f4mix(); return Q.f4ToMix({ n: (w + rnd(0, 6)) * d + n, d }); }, 'เขียนเป็นจำนวนคละ')]; })(),

  /* ด่าน 7 ทำเศษส่วนให้เท่ากันด้วยการคูณ */
  1427: (() => { const B = f4dBars(2, 3, { y0: 70, bh: 50 });
    return [
      f4dSee('ตัดให้เล็กลง ระบายเท่าเดิม', '<b>แตะรูป</b> — 1/2 = 2/4 = 4/8', [
        { t: '1/2', f: on => [2, 4, 8].map((d, k) => f4dBars(d / 2, on ? d : 2, { y0: 24 + k * 62, bh: 40 }).s + (on ? r4vH(r4dTx(340, 24 + k * 62 + 27, `${d / 2}/${d}`, F4DC.p, 'r4v-tx')) : '')).join(''), s: 'ระบายเท่ากันทุกแถบ<br><b>1/2 = 2/4 = 4/8</b>' }]),
      r4dShow('[2/3] = [□/12]', { fig: B.s, q: `${f4dW(2, 3)} = ${FX('[□/12]')} — □ คือเท่าไร`,
        steps: [{ w: '3 × 4 = 12', n: 'ตัวส่วน 3 → 12 ต้องคูณ 4' }, { ink: f4dCutL(B, 0, 3, 4), w: 'ตัดทุกส่วนเป็น 4 ชิ้น', n: 'จำนวนส่วน × 4' },
          { ink: Array.from({ length: 8 }, (_, k) => { const [x, y, w] = B.piece(0), sw = w / 4; return r4dTx(x + sw * (k + .5), y + 31, String(k + 1), F4DC.ink, 'r4d-sm'); }).join(''), w: '2 × 4 = 8', n: 'ตัวเศษ × 4 ด้วย' },
          { w: `${f4dW(2, 3)} = ${f4dW(8, 12)}`, n: 'ระบายเท่าเดิม', ans: 1 }],
        fin: 'คูณ<b>ทั้งตัวเศษและตัวส่วน</b>ด้วยจำนวนเดียวกัน', say: 'คูณทั้งตัวเศษและตัวส่วนด้วยจำนวนเดียวกัน' }),
      r4dPlay('ตัดส่วนให้เล็กลง', 'ลากตัดส่วนให้เล็กลง', () => f4dCut(2, 3, [['ทำให้เป็น 4/6', s => s.k === 2], ['ทำให้เป็น 8/12', s => s.k === 4], ['ทำให้เป็น 10/15', s => s.k === 5]])),
      a4dTry(1427, () => { const d = rnd(2, 9), n = f4cop(d); return Q.f4Eq({ n, d, k: rnd(2, 6), mode: 'mul', ask: pick(['num', 'den']) }); }, 'เศษส่วนที่เท่ากัน (คูณ)'),
      a4dTry(1427, () => { const d = rnd(3, 7); return f4EqPick(f4cop(d), d); }, 'เลือกเศษส่วนที่เท่ากัน')]; })(),

  /* ด่าน 8 ทำเศษส่วนให้เท่ากันด้วยการหาร */
  1428: (() => { const B = f4dBars(8, 12, { y0: 70, bh: 50 });
    return [
      f4dSee('รวมส่วนให้ใหญ่ขึ้น', '<b>แตะรูป</b> — 8/12 = 2/3', [
        { t: '8/12', f: on => f4dBars(8, 12, { y0: 60, bh: 50 }).s + (on ? r4vH([1, 2].map(j => `<path d="M${a4n(40 + 280 * j / 3)} 56 V114" stroke="${F4DC.p}" stroke-width="4"/>`).join('') + r4dTx(180, 170, '8/12 = 2/3', F4DC.p, 'r4v-big')) : ''), s: 'รวมทีละ 4 ส่วน<br><b>8/12 = 2/3</b>' }]),
      r4dShow('[8/12] = [□/3]', { fig: B.s, q: `${f4dW(8, 12)} = ${FX('[□/3]')} — □ คือเท่าไร`,
        steps: [{ w: '12 ÷ 4 = 3', n: 'ตัวส่วน 12 → 3 ต้องหาร 4' }, { ink: [1, 2].map(j => `<path d="M${a4n(B.x0 + B.BW * j / 3)} ${B.y(0) - 6} V${B.y(0) + B.BH + 6}" fill="none" stroke="${F4DC.p}" stroke-width="4"/>`).join(''), w: 'รวมทีละ 4 ส่วน', n: 'จำนวนส่วน ÷ 4' },
          { ink: [0, 1].map(j => r4dTx(B.x0 + B.BW * (j + .5) / 3, B.y(0) + B.BH + 30, String(j + 1), F4DC.p, 'r4d-big')).join(''), w: '8 ÷ 4 = 2', n: 'ตัวเศษ ÷ 4 ด้วย' },
          { w: `${f4dW(8, 12)} = ${f4dW(2, 3)}`, n: 'ระบายเท่าเดิม', ans: 1 }],
        fin: 'หาร<b>ทั้งตัวเศษและตัวส่วน</b>ด้วยจำนวนเดียวกัน', say: 'หารทั้งตัวเศษและตัวส่วนด้วยจำนวนเดียวกัน' }),
      r4dPlay('รวมส่วนให้ใหญ่ขึ้น', 'ลากรวมส่วนให้ใหญ่ขึ้น', () => f4dCut(2, 3, [['เริ่มจาก 8/12 แล้วลากกลับเป็น 2/3', s => s.k === 1 && s.seen.includes(4)], ['ทำให้เป็น 6/9', s => s.k === 3]], 4, '<b>ลากจุดสีชมพู</b>ไปทางซ้าย — รวมส่วนเล็ก ๆ ให้ใหญ่ขึ้น ส่วนที่ระบายยังเท่าเดิม')),
      a4dTry(1428, () => { const d = rnd(2, 9), n = f4cop(d), k = rnd(2, 8); return Q.f4Eq({ n: n * k, d: d * k, k, mode: 'div', ask: pick(['num', 'den']) }); }, 'เศษส่วนที่เท่ากัน (หาร)')]; })(),

  /* ด่าน 9 เศษส่วนอย่างต่ำ */
  1429: [
    f4dSee('เศษส่วนอย่างต่ำ', '<b>แตะรูป</b> — หารต่อจนหารไม่ได้', [
      { t: '12/18', f: on => f4dFr(90, 110, 12, 18) + (on ? r4vH(r4dArr([120, 104], [150, 104], F4DC.p) + f4dFr(180, 110, 6, 9, F4DC.b) + r4dArr([206, 104], [236, 104], F4DC.p) + f4dFr(266, 110, 2, 3, F4DC.g) + r4dTx(266, 172, 'อย่างต่ำ', F4DC.g, 'r4v-tx')) : ''), s: 'หาร 2 แล้วหาร 3<br>= <b>2/3</b> อย่างต่ำ' }]),
    r4dShow('ทำให้เป็นเศษส่วนอย่างต่ำ', { fig: f4dFr(70, 120, 12, 18, F4DC.ink, null, 'f4d-big'), q: `เขียน ${f4dW(12, 18)} ให้เป็นเศษส่วนอย่างต่ำ`,
      steps: [{ ink: r4dTx(130, 80, '÷2', F4DC.p, 'r4d-sm') + r4dTx(130, 172, '÷2', F4DC.p, 'r4d-sm') + r4dArr([108, 112], [152, 112], F4DC.p) + f4dFr(190, 120, 6, 9, F4DC.b, null, 'f4d-big'), w: `${f4dW(12, 18)} = ${f4dW(6, 9)}`, n: '2 หารทั้งคู่ลงตัว' },
        { ink: r4dTx(250, 80, '÷3', F4DC.p, 'r4d-sm') + r4dTx(250, 172, '÷3', F4DC.p, 'r4d-sm') + r4dArr([228, 112], [272, 112], F4DC.p) + f4dFr(306, 120, 2, 3, F4DC.g, null, 'f4d-big'), w: `${f4dW(6, 9)} = ${f4dW(2, 3)}`, n: '3 หารทั้งคู่ลงตัว' },
        { ink: `<circle cx="306" cy="120" r="34" fill="none" stroke="${F4DC.g}" stroke-width="2.6"/>`, w: `${f4dW(2, 3)} อย่างต่ำแล้ว`, n: 'ไม่มีจำนวนใด (นอกจาก 1) หาร 2 และ 3 ลงตัว', ans: 1 }],
      fin: 'หารด้วยจำนวนที่หาร<b>ทั้งคู่ลงตัว</b> จนหารต่อไม่ได้', say: 'หารด้วยจำนวนที่หารทั้งตัวเศษและตัวส่วนลงตัว จนหารต่อไม่ได้' }),
    T('<b>ลองปรับเอง</b> — ทำให้เป็นอย่างต่ำ', 'ลองทำให้เป็นอย่างต่ำ', el => el.append(simF4Simp())),
    a4dTry(1429, () => { const d = rnd(2, 11), n = f4cop(d), k = pick([2, 3, 4, 5, 6, 8, 9, 10]); return Q.f4Simp({ n: n * k, d: d * k }); }, 'เศษส่วนอย่างต่ำ'),
    a4dTry(1429, () => f4SimpKind(f4N(5, (_, i) => { const d = rnd(3, 10), n = f4cop(d), k = i % 2 ? rnd(2, 6) : 1; return [n * k, d * k]; })), 'อย่างต่ำแล้วหรือยัง')],

  /* ด่าน 10 เปรียบเทียบเศษส่วน */
  1430: (() => { const A = f4dBars(5, 6, { y0: 50 }), Bb = f4dBars(7, 12, { y0: 130, col: () => F4DC.on2 });
    return [
      f4dSee('ทำตัวส่วนให้เท่ากันก่อน', '<b>แตะรูป</b> — ชิ้นเท่ากันจึงนับเทียบได้', [
        { t: '3/4 กับ 5/8', f: on => f4dBars(3, on ? 8 : 4, { y0: 40, col: on ? (i => i < 6 ? F4DC.on : '#fff') : null }).s.replace(/fill="#FFB84C"/g, 'fill="#FFB84C"') + (on ? '' : '') + f4dBars(5, 8, { y0: 120, col: () => F4DC.on2 }).s + (on ? r4vH(f4dShade(f4dBars(0, 8, { y0: 40 }), 0, 6) + r4dTx(180, 210, '6/8 > 5/8', F4DC.p, 'r4v-big')) : ''), s: '3/4 = <b>6/8</b><br>6/8 &gt; 5/8' }]),
      r4dShow('[5/6] กับ [7/12]', { fig: A.s + Bb.s, q: `${f4dW(5, 6)} ☐ ${f4dW(7, 12)} ควรเติม > < หรือ =`,
        steps: [{ ink: f4dCutL(A, 0, 6, 2), w: `${f4dW(5, 6)} = ${f4dW(10, 12)}`, n: 'ตัดเป็น 12 ส่วนเท่ากัน (× 2)' }, { w: '10 > 7', n: 'ตัวส่วนเท่ากัน เทียบตัวเศษ' },
          { w: `${f4dW(5, 6)} > ${f4dW(7, 12)}`, n: 'แถบบนระบายมากกว่า', ans: 1 }],
        fin: 'ทำ<b>ตัวส่วนให้เท่ากัน</b> แล้วเทียบตัวเศษ', say: 'ทำตัวส่วนให้เท่ากัน แล้วเทียบตัวเศษ' }),
      T('<b>ลองปรับเอง</b> — แบ่งให้ชิ้นเท่ากัน', 'ลองแบ่งให้ชิ้นเท่ากัน', el => el.append(simCommon('5/6', '7/12'))),
      a4dTry(1430, () => f4Cmp(...f4pair(), true), 'เปรียบเทียบเศษส่วน')]; })(),

  /* ด่าน 11 เปรียบเทียบเศษส่วนกับจำนวนคละ */
  1431: [
    f4dSee('จำนวนคละกับเศษเกิน', '<b>แตะรูป</b> — เขียนให้เป็นแบบเดียวกันก่อน', [
      { t: '23/4 กับ 5 7/8', f: on => f4dFr(90, 110, 23, 4, F4DC.ink, null, 'f4d-big') + f4dFr(270, 110, 7, 8, F4DC.ink, 5, 'f4d-big') + (on ? r4vH(r4dTx(90, 196, '= 5 3/4', F4DC.p, 'r4v-big')) : ''), s: '23/4 = <b>5 3/4</b><br>แล้วจึงเทียบ' }]),
    r4dShow('[23/4] กับ [5 7/8]', { fig: f4dFr(90, 100, 23, 4, F4DC.ink, null, 'f4d-big') + f4dFr(280, 100, 7, 8, F4DC.ink, 5, 'f4d-big') + r4dTx(180, 108, '☐', F4DC.fade, 'r4d-big'), q: `${f4dW(23, 4)} ☐ ${f4dW(7, 8, 5)}`,
      steps: [{ ink: r4dArr([90, 136], [90, 160], F4DC.p) + f4dFr(104, 190, 3, 4, F4DC.p, 5, 'f4d-n'), w: `${f4dW(23, 4)} = ${f4dW(3, 4, 5)}`, n: '23 ÷ 4 = 5 เศษ 3' },
        { w: '5 = 5', n: 'เทียบจำนวนนับก่อน' }, { w: `${f4dW(3, 4)} = ${f4dW(6, 8)} < ${f4dW(7, 8)}`, n: 'จำนวนนับเท่ากัน เทียบเศษส่วน' },
        { ink: r4dTx(180, 108, '<', F4DC.p, 'r4d-big'), w: `${f4dW(23, 4)} < ${f4dW(7, 8, 5)}`, n: 'คำตอบ', ans: 1 }],
      dense: true, fin: 'ทำให้<b>เป็นแบบเดียวกัน</b> เทียบจำนวนนับก่อน แล้วเทียบเศษส่วน', say: 'ทำให้เป็นแบบเดียวกัน เทียบจำนวนนับก่อน แล้วเทียบเศษส่วน' }),
    a4dTry(1431, () => f4Cmp(...f4pairMix()), 'เทียบเศษส่วนกับจำนวนคละ')],

  /* ด่าน 12 เรียงลำดับ */
  1432: (() => { const o = { bw: 240, bh: 34, x0: 90 }, R = [f4dBars(5, 6, { ...o, y0: 30 }), f4dBars(1, 3, { ...o, y0: 100 }), f4dBars(7, 12, { ...o, y0: 170 })];
    return [
      f4dSee('เรียงลำดับเศษส่วน', '<b>แตะรูป</b> — ทำตัวส่วนให้เท่ากันก่อน', [
        { t: '1/2 , 1/4 , 3/8', f: on => [[1, 2], [1, 4], [3, 8]].map(([n, d], k) => f4dBars(on ? n * 8 / d : n, on ? 8 : d, { ...o, y0: 30 + k * 70 }).s + r4dTx(60, 30 + k * 70 + 24, on ? `${n * 8 / d}/8` : `${n}/${d}`, F4DC.ink, 'r4v-tx')).join(''), s: '4/8 , 2/8 , 3/8<br>เทียบตัวเศษ' }]),
      r4dShow('เรียงจากน้อยไปมาก', { fig: R.map(B => B.s).join('') + ['5/6', '1/3', '7/12'].map((t, k) => r4dTx(50, 30 + k * 70 + 24, t, F4DC.ink, 'r4d-tx')).join(''), q: `เรียง ${f4dW(5, 6)} , ${f4dW(1, 3)} , ${f4dW(7, 12)} จากน้อยไปมาก`,
        steps: [{ ink: f4dCutL(R[0], 0, 6, 2) + f4dCutL(R[1], 0, 3, 4), w: `${f4dW(10, 12)} , ${f4dW(4, 12)} , ${f4dW(7, 12)}`, n: 'ทำตัวส่วนเป็น 12' },
          { ink: [[1, '1'], [2, '2'], [0, '3']].map(([k, t]) => r4dTx(350, 30 + k * 70 + 26, t, F4DC.p, 'r4d-big')).join(''), w: '4 < 7 < 10', n: 'เทียบตัวเศษ' },
          { w: `${f4dW(1, 3)} , ${f4dW(7, 12)} , ${f4dW(5, 6)}`, n: 'น้อยไปมาก', ans: 1 }],
        fin: 'ทำ<b>ตัวส่วนให้เท่ากัน</b> แล้วเรียงตามตัวเศษ', say: 'ทำตัวส่วนให้เท่ากัน แล้วเรียงตามตัวเศษ' }),
      a4dTry(1432, () => f4Ord(f4list(false), pick(['asc', 'desc'])), 'เรียงลำดับ')]; })(),

  /* ด่าน 13 บวกเศษส่วน (ตัวส่วนเป็นพหุคูณ) */
  1433: (() => { const A = f4dBars(3, 10, { y0: 26, bh: 34 }), Bb = f4dBars(2, 5, { y0: 90, bh: 34, col: () => F4DC.on2 }), Cc = f4dBars(0, 10, { y0: 166, bh: 34 });
    return [
      f4dSee('ตัวส่วนไม่เท่ากัน', '<b>แตะรูป</b> — ทำชิ้นให้เท่ากันก่อนบวก', [
        { t: '1/2 + 1/4', f: on => f4dBars(on ? 2 : 1, on ? 4 : 2, { y0: 40, bh: 34 }).s + f4dBars(1, 4, { y0: 100, bh: 34, col: () => F4DC.on2 }).s + (on ? r4vH(r4dTx(180, 190, '2/4 + 1/4 = 3/4', F4DC.p, 'r4v-big')) : ''), s: '1/2 = <b>2/4</b><br>2/4 + 1/4 = 3/4' }]),
      r4dShow('[3/10] + [2/5]', { fig: A.s + Bb.s + Cc.s, q: `${f4dW(3, 10)} + ${f4dW(2, 5)} = ?`,
        steps: [{ ink: f4dCutL(Bb, 0, 5, 2), w: `${f4dW(2, 5)} = ${f4dW(4, 10)}`, n: 'ทำตัวส่วนเป็น 10 (× 2)' },
          { ink: f4dShade(Cc, 0, 3) + f4dShade(Cc, 3, 7, F4DC.on2), w: `${f4dW(3, 10)} + ${f4dW(4, 10)} = ${f4dW(7, 10)}`, n: 'บวกตัวเศษ ตัวส่วนเท่าเดิม', ans: 1 }],
        fin: 'ทำ<b>ตัวส่วนให้เท่ากัน</b> แล้วบวกตัวเศษ', say: 'ทำตัวส่วนให้เท่ากัน แล้วบวกตัวเศษ' }),
      T('<b>ลองปรับเอง</b> — ทำตัวส่วนให้เท่ากันแล้วบวก', 'ลองทำตัวส่วนให้เท่ากันแล้วบวก', el => el.append(simAddBars('3/10', '2/5', '+'))),
      a4dTry(1433, () => Q.f4Calc2({ expr: f4addPair('+'), bars: true }), 'บวกเศษส่วน')]; })(),

  /* ด่าน 14 ลบเศษส่วน */
  1434: (() => { const A = f4dBars(7, 8, { y0: 50, bh: 40 }), Bb = f4dBars(1, 4, { y0: 130, bh: 40, col: () => F4DC.on2 });
    return [
      f4dSee('ลบเศษส่วน', '<b>แตะรูป</b> — ทำชิ้นให้เท่ากัน แล้วเอาออก', [
        { t: '3/4 − 1/2', f: on => f4dBars(3, 4, { y0: 60, bh: 40 }).s + (on ? r4vH(f4dX(f4dBars(0, 4, { y0: 60, bh: 40 }), 1) + f4dX(f4dBars(0, 4, { y0: 60, bh: 40 }), 2) + r4dTx(180, 170, '3/4 − 2/4 = 1/4', F4DC.p, 'r4v-big')) : ''), s: '1/2 = <b>2/4</b><br>ขีดออก 2 ส่วน เหลือ 1/4' }]),
      r4dShow('[7/8] − [1/4]', { fig: A.s + Bb.s, q: `${f4dW(7, 8)} − ${f4dW(1, 4)} = ?`,
        steps: [{ ink: f4dCutL(Bb, 0, 4, 2), w: `${f4dW(1, 4)} = ${f4dW(2, 8)}`, n: 'ทำตัวส่วนเป็น 8 (× 2)' }, { ink: f4dX(A, 6) + f4dX(A, 5), w: `${f4dW(7, 8)} − ${f4dW(2, 8)} = ${f4dW(5, 8)}`, n: 'ขีดออก 2 ส่วน ลบตัวเศษ', ans: 1 }],
        fin: 'ทำ<b>ตัวส่วนให้เท่ากัน</b> แล้วลบตัวเศษ', say: 'ทำตัวส่วนให้เท่ากัน แล้วลบตัวเศษ' }),
      T('<b>ลองปรับเอง</b> — ทำตัวส่วนให้เท่ากันแล้วลบ', 'ลองทำตัวส่วนให้เท่ากันแล้วลบ', el => el.append(simAddBars('7/8', '1/4', '−'))),
      a4dTry(1434, () => Q.f4Calc2({ expr: f4addPair('−'), bars: true }), 'ลบเศษส่วน')]; })(),

  /* ด่าน 15 บวก ลบ จำนวนคละ */
  1435: (() => { const S = (x, y, on) => `<rect x="${x}" y="${y}" width="40" height="40" fill="${on ? F4DC.on : '#fff'}" stroke="${F4DC.ink}" stroke-width="2"/>`, A = f4dBars(1, 4, { x0: 150, bw: 180, y0: 50, bh: 40 }), Bb = f4dBars(5, 8, { x0: 150, bw: 180, y0: 140, bh: 40, col: () => F4DC.on2 });
    const fig = S(30, 50, 1) + S(80, 50, 1) + A.s + S(30, 140, 1).replace(F4DC.on, F4DC.on2) + Bb.s;
    return [
      f4dSee('จำนวนคละบวกกัน', '<b>แตะรูป</b> — จำนวนนับรวมกัน เศษส่วนรวมกัน', [
        { t: '2 1/4 + 1 5/8', f: on => fig + (on ? r4vH(r4dTx(180, 222, 'นับ 2 + 1 · เศษ 2/8 + 5/8', F4DC.p, 'r4v-tx')) : ''), s: 'จำนวนนับ 2 + 1 = 3<br>เศษส่วน 2/8 + 5/8 = 7/8' }]),
      r4dShow('[2 1/4] + [1 5/8]', { fig, q: `${f4dW(1, 4, 2)} + ${f4dW(5, 8, 1)} = ?`,
        steps: [{ ink: `<rect x="22" y="42" width="106" height="56" rx="8" fill="none" stroke="${F4DC.p}" stroke-width="2.6"/><rect x="22" y="132" width="56" height="56" rx="8" fill="none" stroke="${F4DC.p}" stroke-width="2.6"/>`, w: 'จำนวนนับ 2 + 1 = 3', n: 'รวมรูปเต็ม' },
          { ink: f4dCutL(A, 0, 4, 2), w: `${f4dW(1, 4)} = ${f4dW(2, 8)}`, n: 'ทำตัวส่วนเป็น 8' }, { w: `${f4dW(2, 8)} + ${f4dW(5, 8)} = ${f4dW(7, 8)}`, n: 'บวกเศษส่วน' },
          { w: `= ${f4dW(7, 8, 3)}`, n: 'รวมจำนวนนับกับเศษส่วน', ans: 1 }],
        dense: true, fin: 'จำนวนนับ<b>รวมกัน</b> เศษส่วน<b>รวมกัน</b>', say: 'จำนวนนับรวมกัน เศษส่วนรวมกัน' }),
      T('<b>ลองปรับเอง</b> — บวกจำนวนคละ', 'ลองบวกจำนวนคละ', el => el.append(simMixed('2 1/4', '1 5/8', '+'))),
      a4dTry(1435, () => Q.f4Calc2({ expr: f4mixPair() }), 'บวก ลบ จำนวนคละ')]; })(),

  /* ด่าน 16–18 โจทย์ปัญหา */
  1436: (() => { const B = f4dBars(5, 9, { y0: 80, bh: 46 });
    return [
      f4dSee('โจทย์ตัวส่วนเท่ากัน', '<b>แตะรูป</b> — ใช้ไป เหลือ → ลบ', [
        { t: 'น้ำปลา 5/9 ขวด ใช้ 2/9 ขวด', f: on => f4dBars(5, 9, { y0: 70, bh: 46 }).s + (on ? r4vH(f4dX(f4dBars(0, 9, { y0: 70, bh: 46 }), 4) + f4dX(f4dBars(0, 9, { y0: 70, bh: 46 }), 3) + r4dTx(180, 180, 'เหลือ 3/9', F4DC.p, 'r4v-big')) : ''), s: 'ขีดออก 2 ส่วน<br>เหลือ <b>3/9 = 1/3</b>' }]),
      r4dShow('น้ำปลาเหลือเท่าไร', { fig: B.s, q: FX('แม่มีน้ำปลา [5/9] ขวด ใช้ทำอาหาร [2/9] ขวด เหลือน้ำปลากี่ขวด'),
        steps: [{ w: `${f4dW(5, 9)} − ${f4dW(2, 9)} = □`, n: 'ใช้ไป เหลือ → ลบ' }, { ink: f4dX(B, 4) + f4dX(B, 3), w: `= ${f4dW(3, 9)}`, n: 'ขีดออก 2 ส่วน' }, { w: `${f4dW(3, 9)} = ${f4dW(1, 3)} ขวด`, n: 'ทำเป็นอย่างต่ำ', ans: 1 }],
        dense: true, fin: 'อ่านโจทย์ → เลือก<b>บวกหรือลบ</b> → ตอบพร้อมหน่วย', say: 'อ่านโจทย์ เลือกบวกหรือลบ แล้วตอบพร้อมหน่วย' }),
      a4dTry(1436, () => Q.f4Story2(pick(F4_ST1)), 'โจทย์ปัญหา')]; })(),
  1437: (() => { const B = f4dBars(3, 4, { y0: 80, bh: 46 });
    return [
      r4dShow('น้ำผลไม้เหลือเท่าไร', { fig: B.s, q: FX('น้ำผลไม้มี [3/4] ลิตร ดื่มไป [3/8] ลิตร เหลือน้ำผลไม้กี่ลิตร'),
        steps: [{ w: `${f4dW(3, 4)} − ${f4dW(3, 8)} = □`, n: 'ดื่มไป เหลือ → ลบ' }, { ink: f4dCutL(B, 0, 4, 2), w: `${f4dW(3, 4)} = ${f4dW(6, 8)}`, n: 'ทำตัวส่วนเป็น 8' },
          { ink: (() => { const C = f4dBars(0, 8, { y0: 80, bh: 46 }); return f4dX(C, 5) + f4dX(C, 4) + f4dX(C, 3); })(), w: `${f4dW(6, 8)} − ${f4dW(3, 8)} = ${f4dW(3, 8)} ลิตร`, n: 'ขีดออก 3 ส่วน', ans: 1 }],
        dense: true, fin: 'ตัวส่วนไม่เท่ากัน: <b>ทำให้เท่ากันก่อน</b>', say: 'ตัวส่วนไม่เท่ากัน ทำให้เท่ากันก่อน' }),
      a4dTry(1437, () => Q.f4Story2(pick(F4_ST2)), 'โจทย์ปัญหา')]; })(),
  1438: (() => { const S = (x, y, on) => `<rect x="${x}" y="${y}" width="44" height="44" fill="${on ? F4DC.on : '#fff'}" stroke="${F4DC.ink}" stroke-width="2"/>`, A = f4dBars(3, 4, { x0: 270, bw: 76, y0: 90, bh: 44 });
    const fig = [0, 1, 2, 3, 4].map(k => S(20 + k * 50, 90, 1)).join('') + A.s;
    return [
      r4dShow('น้ำเหลือเท่าไร', { fig, q: FX('ถังน้ำมี [5 3/4] ลิตร ใช้ล้างรถ [2 1/8] ลิตร เหลือน้ำกี่ลิตร'),
        steps: [{ w: `${f4dW(3, 4, 5)} − ${f4dW(1, 8, 2)} = □`, n: 'ใช้ไป เหลือ → ลบ' }, { ink: [3, 4].map(k => `<path d="M${24 + k * 50} 94 L${60 + k * 50} 130 M${60 + k * 50} 94 L${24 + k * 50} 130" fill="none" stroke="${F4DC.p}" stroke-width="2.6"/>`).join(''), w: 'จำนวนนับ 5 − 2 = 3', n: 'ขีดออก 2 รูปเต็ม' },
          { ink: f4dCutL(A, 0, 4, 2) + (() => { const C = f4dBars(0, 8, { x0: 270, bw: 76, y0: 90, bh: 44 }); return f4dX(C, 5); })(), w: `${f4dW(6, 8)} − ${f4dW(1, 8)} = ${f4dW(5, 8)}`, n: '3/4 = 6/8 แล้วลบ' }, { w: `ตอบ ${f4dW(5, 8, 3)} ลิตร`, n: 'รวมจำนวนนับกับเศษส่วน', ans: 1 }],
        dense: true, fin: 'จำนวนคละ: ลบ<b>จำนวนนับ</b> ลบ<b>เศษส่วน</b> แล้วรวมกัน', say: 'จำนวนคละ ลบจำนวนนับ ลบเศษส่วน แล้วรวมกัน' }),
      a4dTry(1438, () => Q.f4Story2(pick(F4_ST3)), 'โจทย์ปัญหาจำนวนคละ')]; })()
};
LESSONS_P4C6.forEach(L => { if (F4D_TEACH[L.id]) { L.teach = F4D_TEACH[L.id]; L.__pracDone = 1; } if (L.id >= 1421 && L.id <= 1432 && L.game) { L.game = f4dGame(L.game); L.gameN = 10; } });
