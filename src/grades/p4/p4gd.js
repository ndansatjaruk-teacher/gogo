/* =========================================================
   ป.4 บทที่ 10 ทะเลทรายข้อมูล — หน้าสอนและเกมเรียงใหม่ (v252 · ผู้ใช้ขอ) · prefix g5d
   เหมือนบทที่ 9 (p4rd.js): ประเด็นละหน้า ① ดูภาพ (r4vSee แตะแล้วรูปเปลี่ยน) → ② ทำให้ดู (r4dDo: ดินสอวงช่อง ขีดรอยขีด ลากเส้นจากปลายแท่ง
   เขียนบนกระดาษทด คำอธิบายสั้น ๆ ข้าง ๆ) → ③ ลองทำ (ข้อแบบเดียวกับในเกม) · เกม 10 ข้อ เรียงตามลำดับประเด็น ง่าย → ยาก
   ตาราง/แผนภูมิในหน้าดูภาพและหน้าทำให้ดูวาดเป็น SVG (g5dTab g5dBar) เพื่อให้ดินสอวาดทับได้ · วางหลัง p4rd.js ใน order.txt
   ========================================================= */
const G5D_C = { o: '#FFB84C', b: '#6FB3EA', g: '#7FCF9E', p: '#E5487A', ink: '#2B2550', bar: '#7C9BEA', bar2: '#F2A541' };
/* two-way table as svg: r = −1 header · 0..n−1 rows · n total row; c = −1 row names · 0..m−1 · m total column */
function g5dTab(T, o = {}) { const t = g4Tot(T), tot = T.total !== false && o.total !== false, n = T.rows.length, m = T.cols.length, cw0 = o.cw0 || 104, cw = o.cw || 72, rh = o.rh || 38, NC = m + (tot ? 1 : 0), NR = n + 1 + (tot ? 1 : 0), Wt = cw0 + cw * NC, Ht = rh * NR;
  const W = o.W || 360, H = o.H || 240, x0 = (W - Wt) / 2, y0 = (H - Ht) / 2 + (o.dy || 0), bl = o.blank || [];
  const cell = (r, c) => ({ x: c < 0 ? x0 : x0 + cw0 + c * cw, y: y0 + (r + 1) * rh, w: c < 0 ? cw0 : cw, h: rh }), mid = (r, c) => { const e = cell(r, c); return [e.x + e.w / 2, e.y + e.h / 2]; };
  const key = (r, c) => `${r === n ? 't' : r},${c === m ? 't' : c}`, val = (r, c) => r === n && c === m ? g4All(T) : r === n ? t.c[c] : c === m ? t.r[r] : T.rows[r][1][c];
  let s = `<rect x="${x0}" y="${y0}" width="${Wt}" height="${Ht}" fill="#fff"/><rect x="${x0}" y="${y0}" width="${Wt}" height="${rh}" fill="#EFE9FA"/><rect x="${x0}" y="${y0 + rh}" width="${cw0}" height="${Ht - rh}" fill="#FFF6E0"/>`;
  if (tot) s += `<rect x="${x0 + cw0 + m * cw}" y="${y0 + rh}" width="${cw}" height="${Ht - rh}" fill="#E3F4EA"/><rect x="${x0 + cw0}" y="${y0 + (n + 1) * rh}" width="${m * cw}" height="${rh}" fill="#E3F4EA"/>`;
  for (let j = 0; j <= NR; j++) s += `<path d="M${x0} ${y0 + j * rh} H${x0 + Wt}" stroke="#B9AFD6" stroke-width="1.3"/>`;
  [0, cw0, ...Array.from({ length: NC }, (_, k) => cw0 + (k + 1) * cw)].forEach(x => { s += `<path d="M${x0 + x} ${y0} V${y0 + Ht}" stroke="#B9AFD6" stroke-width="1.3"/>`; });
  const tx = (r, c, txt, cls = 'g5d-t') => { const [x, y] = mid(r, c); return `<text x="${a4n(x)}" y="${a4n(y + 5.5)}" class="${cls}" text-anchor="middle">${txt}</text>`; };
  s += tx(-1, -1, T.rowH, 'g5d-h') + T.cols.map((cn, c) => tx(-1, c, cn, 'g5d-h')).join('') + (tot ? tx(-1, m, 'รวม', 'g5d-h') + tx(n, -1, 'รวม', 'g5d-h') : '');
  T.rows.forEach(([nm], r) => { s += tx(r, -1, nm, 'g5d-h'); for (let c = 0; c < NC; c++) if (!bl.includes(key(r, c))) s += tx(r, c, fmt(val(r, c))); });
  if (tot) for (let c = 0; c <= m; c++) if (!bl.includes(key(n, c))) s += tx(n, c, fmt(val(n, c)));
  return { s, cell, mid, val, n, m, x0, y0, Wt, Ht, rh, cw }; }
/* bar chart as svg: X(i) bar centre · Y(v) height on the axis */
function g5dBar(C, o = {}) { const W = o.W || 360, x0 = o.x0 || 58, x1 = W - 14, yb = o.yb || 202, yt = o.yt || 34, n = C.cats.length, slot = (x1 - x0) / n, bw = slot * .52, k = (yb - yt) / C.max, Y = v => yb - v * k, X = i => x0 + slot * (i + .5);
  const v = o.vals || C.series[0].v; let s = '';
  if (o.grid !== false) for (let t = 0; t <= C.max; t += C.step) s += `<path d="M${x0} ${a4n(Y(t))} H${x1}" stroke="#E6E0F2" stroke-width="1.2"/>` + (o.nums !== false ? `<text x="${x0 - 7}" y="${a4n(Y(t) + 4.5)}" class="g5d-s" text-anchor="end">${fmt(t)}</text>` : '');
  if (o.bars !== false) v.forEach((val, i) => { if (val == null) return; s += `<rect x="${a4n(X(i) - bw / 2)}" y="${a4n(Y(val))}" width="${a4n(bw)}" height="${a4n(yb - Y(val))}" fill="${(o.cols || [])[i] || G5D_C.bar}" stroke="#4A5FB0" stroke-width="1.2"/>`; });
  if (o.axes !== false) s += `<path d="M${x0} ${yt - 10} V${yb} H${x1 + 4}" fill="none" stroke="${G5D_C.ink}" stroke-width="2.2"/>`;
  if (o.cats !== false) C.cats.forEach((c, i) => { s += `<text x="${a4n(X(i))}" y="${yb + 18}" class="g5d-s" text-anchor="middle">${c}</text>`; });
  if (o.names !== false) s += `<text x="${x0 - 50}" y="${yt - 16}" class="g5d-s" text-anchor="start">${C.yName}</text>`;
  if (o.title) s += `<text x="${(x0 + x1) / 2}" y="18" class="g5d-h" text-anchor="middle">${o.title}</text>`;
  return { s, X, Y, bw, x0, x1, yb, yt }; }
const g5dEll = (x, y, rx, ry, col = G5D_C.p) => `<ellipse cx="${a4n(x)}" cy="${a4n(y)}" rx="${a4n(rx)}" ry="${a4n(ry)}" fill="none" stroke="${col}" stroke-width="2.8"/>`;
const g5dCirc = (G, r, c, col) => { const e = G.cell(r, c); return g5dEll(e.x + e.w / 2, e.y + e.h / 2, e.w * .44, e.h * .44, col); };
const g5dRow = (G, r, col = G5D_C.o) => `<rect x="${G.x0}" y="${G.y0 + (r + 1) * G.rh}" width="${G.Wt}" height="${G.rh}" fill="${col}" fill-opacity=".38"/>`;
const g5dCol = (G, c, col = G5D_C.b) => { const e = G.cell(-1, c); return `<rect x="${e.x}" y="${G.y0}" width="${e.w}" height="${G.Ht}" fill="${col}" fill-opacity=".35"/>`; };
const g5dIn = (G, r, c, t, col = G5D_C.p) => { const [x, y] = G.mid(r, c); return r4dTx(x, y + 6, t, col); };
/* tally marks: one stroke at a time, every 5th crosses the group */
const g5dTally = (x, y, n, hh = 22) => { let s = ''; for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5, gx = x + g * 44;
  s += k < 4 ? `<path d="M${gx + k * 8} ${y} V${y + hh}" fill="none" stroke="${G5D_C.ink}" stroke-width="2.6" stroke-linecap="round"/>` : `<path d="M${gx - 4} ${y + hh - 3} L${gx + 28} ${y + 3}" fill="none" stroke="${G5D_C.p}" stroke-width="2.6" stroke-linecap="round"/>`; } return s; };
const g5dGuide = (B, i, v, col = G5D_C.p) => r4dArr([B.X(i) - B.bw / 2 - 2, B.Y(v)], [B.x0 + 6, B.Y(v)], col);

/* practice page: a question of the same kind as the game */
const g5dTry = (id, mk, title) => ({ t: `<b>ลองทำ</b> — ${title}`, s: `ลองทำ ${r4dTxt(title)}`, prac: 1,
  v(el) { const L = LESSONS.find(x => x.id === id); L.__prac = L.__prac || new Set(); let q = null; for (let t = 0; t < 8; t++) { let x = null; __EASY = true; try { x = mk(); } catch (_) { x = null; } finally { __EASY = false; } if (x && x.mount && !L.__prac.has(qSig(x))) { q = x; break; } }
    if (!q) { el.append(fNote('ทบทวนตัวอย่างอีกครั้ง แล้วไปต่อกัน')); return; } L.__prac.add(qSig(q)); qAtoms(q).forEach(a => L.__prac.add(a)); promptOnce(q);
    const sim = qSim(q, 'เก่งมาก! แบบเดียวกับในเกมเลย', { bub: window.__teachBub }), pr = h('div', { class: 'colstack prac prac-game' }, sim); pr.classList.toggle('qs-figp', !!sim.querySelector(':scope > .qs-r')); el.append(pr); } });
const g5dSee = (title, cap, list) => sbMark(title, cap, () => list.map(p => ({ W: 360, H: 240, ...p })), T(`<b>ดูภาพ</b> — ${title}`, `ดูภาพ ${r4dTxt(title)}`, el => el.append(r4vSee(cap, list.map(p => ({ W: 360, H: 240, ...p })), list.map(p => p.s.replace(/<br>/g, r4vSep)).join(r4vSep)))));
/* question makers used by both the practice pages and the games */
const g5dTwOk = T => new Set(g4Tot(T).r).size === T.rows.length && T.cols.every((_, c) => new Set(T.rows.map(([, v]) => v[c])).size === T.rows.length);
const g5dTw = () => { for (let t = 0; t < 30; t++) { const T = g4twRand(); if (g5dTwOk(T)) return T; } return g4twRand(); };
const g5dTap = k => { const T = g5dTw(); return Q.g4TwTap({ T, ask: { k, r: rnd(0, T.rows.length - 1), c: rnd(0, T.cols.length - 1) } }); };
const g5dBarR = o => g4barRand(null, o);
const g5dD = (q, d, k) => ({ ...q, __diff: d, __kind: 'g5d' + k });

/* =========================================================
   teaching data (same as before: ข้อมูลสมมติ)
   ========================================================= */
const G5D_ANS = ['ขนมครก', 'ทองหยิบ', 'ลอดช่อง', 'ขนมครก', 'ทองหยิบ', 'ขนมครก', 'ลอดช่อง', 'ทองหยิบ', 'ขนมครก', 'ทองหยิบ', 'ลอดช่อง', 'ขนมครก'], G5D_SN = ['ขนมครก', 'ทองหยิบ', 'ลอดช่อง'];
const g5dChip = i => ({ x: 22 + (i % 4) * 81, y: 10 + Math.floor(i / 4) * 30 });
const g5dChips = (cross = []) => G5D_ANS.map((a, i) => { const { x, y } = g5dChip(i); return `<rect x="${x}" y="${y}" width="74" height="24" rx="12" fill="#FFF1CC" stroke="#E0B45E" stroke-width="1.3"/><text x="${x + 37}" y="${y + 17}" class="g5d-s" text-anchor="middle">${a}</text>` + (cross.includes(a) ? `<path d="M${x + 6} ${y + 12} H${x + 68}" stroke="${G5D_C.p}" stroke-width="2.4"/>` : ''); }).join('');
const g5dStrike = nm => G5D_ANS.map((a, i) => { if (a !== nm) return ''; const { x, y } = g5dChip(i); return `<path d="M${x + 6} ${y + 12} H${x + 68}" fill="none" stroke="${G5D_C.p}" stroke-width="2.6" stroke-linecap="round"/>`; }).join('');
const G5D_TY = r => 116 + r * 36;
const g5dTallyBox = () => `<rect x="20" y="104" width="320" height="108" fill="#fff" stroke="#B9AFD6" stroke-width="1.3"/>` + [140, 176].map(y => `<path d="M20 ${y} H340" stroke="#B9AFD6" stroke-width="1.3"/>`).join('') + `<path d="M108 104 V212 M282 104 V212" stroke="#B9AFD6" stroke-width="1.3"/>` + G5D_SN.map((n, r) => `<text x="64" y="${G5D_TY(r) + 12}" class="g5d-h" text-anchor="middle">${n}</text>`).join('');
const G5D_PRICE = { title: 'ราคาเสื้อผ้า', rowH: 'สินค้า', cols: ['ขนาดเล็ก', 'ขนาดใหญ่'], unit: 'บาท', total: false, rows: [['เสื้อยืด', [120, 180]], ['กางเกง', [150, 220]], ['หมวก', [60, 90]]] };
const G5D_ONE = { title: '', rowH: 'ขนม', cols: ['จำนวน'], unit: 'คน', total: false, rows: [['ขนมครก', [6]], ['ทองหยิบ', [6]], ['ลอดช่อง', [3]]] };
const G5D_TWO = { title: '', rowH: 'ขนม', cols: ['ชาย', 'หญิง'], unit: 'คน', total: false, rows: [['ขนมครก', [4, 2]], ['ทองหยิบ', [1, 5]], ['ลอดช่อง', [2, 1]]] };

/* =========================================================
   the lessons
   ========================================================= */
const G5D_TEACH = {
  /* ด่าน 1: เก็บข้อมูล (รอยขีด) → ตาราง 2 ทาง (อ่านช่องที่ตัดกัน) → ช่องรวม */
  1501: (() => { const CL = g5dTab(G4_T_CLUB), CLb = g5dTab(G4_T_CLUB, { blank: ['0,t', 't,1', 't,t'] }), one = g5dTab(G5D_ONE), two = g5dTab(G5D_TWO, { cw: 80 });
    const cnt = nm => G5D_ANS.filter(a => a === nm).length;
    return [
      g5dSee('เก็บข้อมูลด้วยรอยขีด', '<b>แตะรูป</b> — คำตอบจากการสำรวจ นับด้วยรอยขีด', [
        { t: 'ผลสำรวจขนมที่ชอบ', f: on => g5dChips(on ? G5D_SN : []) + g5dTallyBox() + (on ? r4vH(G5D_SN.map((n, r) => g5dTally(126, G5D_TY(r), cnt(n)) + `<text x="311" y="${G5D_TY(r) + 16}" class="g5d-h" text-anchor="middle">${cnt(n)}</text>`).join('')) : ''), s: 'ขีดฆ่าคำตอบที่นับแล้ว<br>ขีด<b>รอยขีด</b> กลุ่มละ 5' }]),
      r4dShow('นับผลสำรวจด้วยรอยขีด', { fig: g5dChips() + g5dTallyBox(), q: 'นักเรียน 12 คน ชอบขนมอะไร — นับด้วยรอยขีด',
        steps: G5D_SN.map((nm, r) => ({ ink: g5dStrike(nm) + g5dTally(126, G5D_TY(r), cnt(nm)), w: `${nm} ${cnt(nm)} คน`, n: r === 0 ? 'ขีดฆ่าที่นับแล้ว กันนับซ้ำ' : cnt(nm) === 5 ? 'ครบ 5 ขีดทับ' : 'ยังไม่ครบ 5 ไม่ต้องขีดทับ' })).concat([
          { ink: G5D_SN.map((nm, r) => r4dTx(311, G5D_TY(r) + 17, String(cnt(nm)), G5D_C.p)).join(''), w: '5 + 4 + 3 = 12 ✓', n: 'ครบ 12 คำตอบ', ans: 1 }]),
        fin: 'ขีดฆ่าคำตอบ → ขีด<b>รอยขีด</b> → นับเป็นตัวเลข', say: 'ขีดฆ่าคำตอบที่นับแล้ว ขีดรอยขีด แล้วนับเป็นตัวเลข' }),
      g5dTry(1501, g4tallyQ, 'นับผลสำรวจ'),
      g5dSee('ตาราง 2 ทาง', '<b>แตะรูป</b> — จำแนกข้อมูลได้ 2 ลักษณะพร้อมกัน', [
        { t: 'ตารางทางเดียว → 2 ทาง', f: on => on ? r4vH(two.s) : one.s, s: 'แยก <b>ชาย</b> กับ <b>หญิง</b><br>= ตาราง 2 ทาง' },
        { t: 'แถวกับหลัก', f: on => CL.s + (on ? r4vH(g5dRow(CL, 1) + g5dCol(CL, 1) + g5dCirc(CL, 1, 1)) : ''), s: 'แถว (ซ้าย) × หลัก (บน)<br>→ <b>ช่องที่ตัดกัน</b>' }]),
      T('<b>ลองปรับเอง</b> — แตะคำตอบลงตาราง 2 ทาง', 'ลองแตะคำตอบลงตาราง 2 ทาง', el => el.append(simG4Survey(G4_T_SURV))),
      r4dShow('อ่านตาราง 2 ทาง', { fig: CL.s, q: 'ชมรมกีฬามีนักเรียนหญิงกี่คน',
        steps: [{ ink: g5dRow(CL, 1) + g5dEll(...CL.mid(1, -1), 44, 15), w: 'แถว: กีฬา', n: 'หาจากหัวแถวทางซ้าย' },
          { ink: g5dCol(CL, 1) + g5dEll(...CL.mid(-1, 1), 30, 15, '#2F7BC0'), w: 'หลัก: หญิง', n: 'หาจากหัวหลักด้านบน' },
          { ink: g5dCirc(CL, 1, 1), w: 'กีฬา หญิง = 11 คน', n: 'ช่องที่ตัดกัน', ans: 1 }],
        fin: 'หา<b>แถว</b> แล้วไปตาม<b>หลัก</b> → ช่องที่ตัดกัน', say: 'หาแถวก่อน แล้วไปตามหลัก ช่องที่ตัดกันคือคำตอบ' }),
      g5dTry(1501, () => g5dTap('cell'), 'แตะช่องในตาราง'),
      g5dSee('ช่องรวม', '<b>แตะรูป</b> — หลักรวมและแถวรวมมาจากไหน', [
        { t: 'รวมของแถวและหลัก', f: on => CL.s + (on ? r4vH(g5dCol(CL, CL.m, G5D_C.g) + g5dRow(CL, CL.n, G5D_C.g)) : ''), s: 'หลักขวา = <b>รวมในแถว</b><br>แถวล่าง = <b>รวมในหลัก</b>' }]),
      r4dShow('เติมช่องรวม', { fig: CLb.s, q: 'เติมช่องที่ว่างในตาราง 2 ทาง',
        steps: [{ ink: r4dArr([CLb.cell(0, 0).x + 8, CLb.mid(0, 0)[1] + 12], [CLb.cell(0, 2).x - 4, CLb.mid(0, 0)[1] + 12], G5D_C.o) + g5dIn(CLb, 0, 2, '32'), w: '14 + 18 = 32', n: 'รวมแถวดนตรี' },
          { ink: r4dArr([CLb.mid(0, 1)[0] + 24, CLb.cell(0, 1).y + 6], [CLb.mid(0, 1)[0] + 24, CLb.cell(3, 1).y - 2], G5D_C.b) + g5dIn(CLb, 3, 1, '45'), w: '18 + 11 + 16 = 45', n: 'รวมหลักหญิง' },
          { ink: g5dIn(CLb, 3, 2, '90'), w: '45 + 45 = 90', n: 'รวมชาย + รวมหญิง', ans: 1 }],
        fin: 'ช่องรวม = <b>บวก</b>ทุกช่องในแถวหรือหลักนั้น', say: 'ช่องรวม คือบวกทุกช่องในแถวหรือหลักนั้น' }),
      g5dTry(1501, g4fillQ, 'เติมช่องที่ว่าง')]; })(),

  /* ด่าน 2: โจทย์จากตาราง 2 ทาง: เปรียบเทียบ (ลบ) → มากที่สุด → ราคา */
  1502: (() => { const CL = g5dTab(G4_T_CLUB), PR = g5dTab(G5D_PRICE, { cw: 84 });
    return [
      g5dSee('หาข้อมูลที่ต้องใช้', '<b>แตะรูป</b> — อ่านโจทย์ แล้วหาช่องที่ต้องใช้', [
        { t: 'หญิง: ดนตรี กับ ศิลปะ', f: on => CL.s + (on ? r4vH(g5dCirc(CL, 0, 1) + g5dCirc(CL, 2, 1) + r4dTx(180, 232, '18 − 16 = 2', G5D_C.p, 'r4v-big')) : ''), s: 'วง<b>ช่องที่ต้องใช้</b><br>มากกว่ากี่คน → ลบ' }]),
      r4dShow('มากกว่ากี่คน', { fig: CL.s, q: 'นักเรียนหญิงชมรมดนตรี มากกว่าชมรมศิลปะกี่คน',
        steps: [{ ink: g5dCirc(CL, 0, 1), w: 'ดนตรี หญิง 18', n: 'แถวดนตรี หลักหญิง' }, { ink: g5dCirc(CL, 2, 1), w: 'ศิลปะ หญิง 16', n: 'แถวศิลปะ หลักหญิง' },
          { w: '18 − 16 = 2 คน', n: 'มากกว่ากี่คน → ลบ', ans: 1 }],
        fin: 'หาช่องที่ต้องใช้ → <b>เลือกวิธีคิด</b> → ตอบพร้อมหน่วย', say: 'หาช่องที่ต้องใช้ เลือกวิธีคิด แล้วตอบพร้อมหน่วย' }),
      g5dTry(1502, () => g4TwQ(g5dTw(), pick(['diffrow', 'diffcol'])), 'เปรียบเทียบจากตาราง'),
      T('<b>ลองปรับเอง</b> — แตะอ่านตาราง', 'ลองแตะอ่านตาราง', el => el.append(simG4Read(G4_T_CLUB))),
      g5dSee('มากที่สุด น้อยที่สุด', '<b>แตะรูป</b> — ดูที่หลักรวม', [
        { t: 'ชมรมที่มีสมาชิกมากที่สุด', f: on => CL.s + (on ? r4vH(g5dCol(CL, CL.m, G5D_C.g) + g5dCirc(CL, 1, CL.m) + g5dCirc(CL, 2, CL.m, '#2F7BC0')) : ''), s: 'มากที่สุด <b>33</b> (กีฬา)<br>น้อยที่สุด <b>25</b> (ศิลปะ)' }]),
      r4dShow('ชมรมใดมีสมาชิกมากที่สุด', { fig: CL.s, q: 'ชมรมใดมีสมาชิกมากที่สุด',
        steps: [{ ink: g5dCol(CL, CL.m, G5D_C.g), w: '32, 33, 25', n: 'ดูหลักรวม (ทั้งชายและหญิง)' },
          { ink: g5dCirc(CL, 1, CL.m) + g5dEll(...CL.mid(1, -1), 44, 15), w: 'ชมรมกีฬา 33 คน', n: '33 มากที่สุด', ans: 1 }],
        fin: 'ถามทั้งหมด → ดู<b>หลักรวม</b>', say: 'ถามจำนวนทั้งหมด ให้ดูหลักรวม' }),
      g5dTry(1502, () => g5dTap(pick(['maxcol', 'mintot'])), 'มากที่สุด น้อยที่สุด'),
      g5dSee('ตารางราคา', '<b>แตะรูป</b> — ซื้อหลายชิ้น ใช้คูณ', [
        { t: 'ราคาเสื้อผ้า (บาท)', f: on => PR.s + (on ? r4vH(g5dCirc(PR, 0, 0) + r4dTx(180, 226, '2 ตัว = 2 × 120', G5D_C.p, 'r4v-big')) : ''), s: 'หาราคา 1 ชิ้นในตาราง<br>ซื้อหลายชิ้น → <b>คูณ</b>' }]),
      r4dShow('ซื้อของจากตารางราคา', { fig: PR.s, q: 'ซื้อเสื้อยืดขนาดเล็ก 2 ตัว และหมวกขนาดเล็ก 1 ใบ จ่ายกี่บาท',
        steps: [{ ink: g5dCirc(PR, 0, 0), w: '2 × 120 = 240', n: 'เสื้อยืด 2 ตัว' }, { ink: g5dCirc(PR, 2, 0), w: '1 × 60 = 60', n: 'หมวก 1 ใบ' },
          { w: '240 + 60 = 300 บาท', n: 'รวมกัน', ans: 1 }],
        fin: 'ราคา × จำนวนชิ้น แล้ว<b>บวก</b>กัน', say: 'ราคาคูณจำนวนชิ้น แล้วบวกกัน' }),
      g5dTry(1502, g4priceStory, 'โจทย์ตารางราคา')]; })(),

  /* ด่าน 3: อ่านแผนภูมิแท่ง: ส่วนประกอบ → อ่านค่า (ครึ่งช่อง) → แนวนอน → เปรียบเทียบ/เรียง */
  1503: (() => { const B = g5dBar(G4_T_BAR), Bt = g5dBar(G4_T_BAR, { title: 'จำนวนนักเรียนที่มาโรงเรียนด้วยวิธีต่าง ๆ', yt: 62 }), v = G4_T_BAR.series[0].v;
    const H = (() => { const x0 = 96, x1 = 340, yt = 22, yb = 196, n = 4, slot = (yb - yt) / n, k = (x1 - x0) / 80, X = q => x0 + q * k, Yc = i => yt + slot * (i + .5); let s = '';
      for (let t = 0; t <= 80; t += 10) s += `<path d="M${a4n(X(t))} ${yt} V${yb}" stroke="#E6E0F2" stroke-width="1.2"/><text x="${a4n(X(t))}" y="${yb + 17}" class="g5d-s" text-anchor="middle">${t}</text>`;
      v.forEach((q, i) => { s += `<rect x="${x0}" y="${a4n(Yc(i) - slot * .27)}" width="${a4n(q * k)}" height="${a4n(slot * .54)}" fill="${G5D_C.bar}" stroke="#4A5FB0" stroke-width="1.2"/><text x="${x0 - 8}" y="${a4n(Yc(i) + 5)}" class="g5d-s" text-anchor="end">${G4_T_BAR.cats[i]}</text>`; });
      return { s: s + `<path d="M${x0} ${yt - 6} V${yb} H${x1 + 6}" fill="none" stroke="${G5D_C.ink}" stroke-width="2.2"/>`, X, Yc, slot, yb }; })();
    const order = v.map((q, i) => [q, i]).sort((a, b) => b[0] - a[0]);
    return [
      g5dSee('ส่วนประกอบของแผนภูมิแท่ง', '<b>แตะรูป</b> — ชื่อแผนภูมิ แกนตั้ง แกนนอน', [
        { t: 'แผนภูมิแท่ง', f: on => Bt.s + (on ? r4vH(`<rect x="36" y="2" width="308" height="24" rx="6" fill="none" stroke="${G5D_C.p}" stroke-width="2.6"/>` + `<path d="M${Bt.x0} ${Bt.yt - 10} V${Bt.yb}" stroke="${G5D_C.p}" stroke-width="5" opacity=".7"/><path d="M${Bt.x0} ${Bt.yb} H${Bt.x1 + 4}" stroke="#2F7BC0" stroke-width="5" opacity=".7"/>` + r4dTx(Bt.x0 + 40, Bt.yt - 2, 'แกนตั้ง', G5D_C.p, 'r4v-tx') + r4dTx(Bt.x1 - 28, Bt.yb + 35, 'แกนนอน', '#2F7BC0', 'r4v-tx')) : ''), s: '<b>ชื่อแผนภูมิ</b> อยู่บนสุด<br>แกนตั้ง = จำนวน แกนนอน = รายการ' }]),
      r4dShow('อ่านค่าแท่ง', { fig: B.s, q: 'มาโรงเรียนด้วยรถยนต์กี่คน',
        steps: [{ ink: g5dEll(B.X(3), B.yb + 13, 32, 12) + `<rect x="${a4n(B.X(3) - B.bw / 2 - 3)}" y="${a4n(B.Y(55) - 3)}" width="${a4n(B.bw + 6)}" height="${a4n(B.yb - B.Y(55) + 3)}" fill="none" stroke="${G5D_C.p}" stroke-width="2.4"/>`, n: 'หาแท่งรถยนต์', at: [B.X(3), B.Y(55) - 8] },
          { ink: g5dGuide(B, 3, 55), w: 'ระหว่าง 50 กับ 60', n: 'ลากเส้นจากปลายแท่งไปที่แกนตั้ง' },
          { ink: `<path d="M${B.x0 - 6} ${a4n(B.Y(55))} H${B.x0 + 6}" fill="none" stroke="${G5D_C.p}" stroke-width="3"/>` + r4dTx(B.x0 + 26, B.Y(55) - 6, '55', G5D_C.p), w: 'ครึ่งทาง = 55', n: 'ครึ่งช่องของ 10 คือ 5' },
          { w: 'รถยนต์ 55 คน', n: 'ตอบพร้อมหน่วย', ans: 1 }],
        fin: 'ลากเส้นจาก<b>ปลายแท่ง</b>ไปที่<b>แกนตั้ง</b> แล้วอ่านค่า', say: 'ลากเส้นจากปลายแท่งไปที่แกนตั้ง แล้วอ่านค่า' }),
      T('<b>ลองปรับเอง</b> — แตะแท่งอ่านค่า', 'ลองแตะแท่งอ่านค่า', el => el.append(simReadBar(G4_T_BAR))),
      g5dTry(1503, () => g4Read(g5dBarR({ nolab: true })), 'อ่านค่าแท่ง'),
      g5dSee('แผนภูมิแท่งแนวนอน', '<b>แตะรูป</b> — แท่งยาวไปทางขวา', [
        { t: 'แนวนอน', f: on => H.s + (on ? r4vH(r4dArr([H.X(55) + 2, H.Yc(3)], [H.X(55), H.yb - 6], G5D_C.p) + r4dTx(H.X(55), H.yb - 12, '55', G5D_C.p, 'r4v-tx')) : ''), s: 'ลากเส้น<b>ลง</b>ไปที่แกนนอน<br>รถยนต์ = 55 คน' }]),
      g5dTry(1503, () => g4Read(g5dBarR({ nolab: true, horiz: true })), 'อ่านแผนภูมิแนวนอน'),
      g5dSee('เปรียบเทียบแท่ง', '<b>แตะรูป</b> — แท่งสูงกว่า = มากกว่า', [
        { t: 'มากที่สุด น้อยที่สุด', f: on => B.s + (on ? r4vH(r4dTx(B.X(2), B.Y(70) - 10, '★ มากสุด', G5D_C.p, 'r4v-tx') + r4dTx(B.X(1), B.Y(30) - 10, 'น้อยสุด', '#2F7BC0', 'r4v-tx')) : ''), s: 'แท่ง<b>สูงที่สุด</b> = มากที่สุด<br>แท่งต่ำที่สุด = น้อยที่สุด' }]),
      r4dShow('เรียงจากมากไปน้อย', { fig: B.s, q: 'เรียงวิธีมาโรงเรียน จากมากไปน้อย',
        steps: order.map(([q, i], r) => ({ ink: `<rect x="${a4n(B.X(i) - B.bw / 2)}" y="${a4n(B.Y(q))}" width="${a4n(B.bw)}" height="${a4n(B.yb - B.Y(q))}" fill="${G5D_C.bar2}" fill-opacity=".85"/>` + r4dTx(B.X(i), B.Y(q) - 8, String(r + 1), G5D_C.p, 'r4d-big'),
          w: `${G4_T_BAR.cats[i]} ${q}`, n: r === 0 ? 'แท่งสูงที่สุด' : r === 3 ? 'แท่งต่ำที่สุด' : 'สูงรองลงมา', ans: r === 3 ? 1 : 0 })),
        fin: 'เรียงจากมากไปน้อย = เลือก<b>แท่งสูงที่สุด</b>ที่เหลือทีละแท่ง', say: 'เรียงจากมากไปน้อย เลือกแท่งที่สูงที่สุดที่เหลือทีละแท่ง' }),
      g5dTry(1503, () => Q.g4Rank({ C: g5dBarR({ n: 4 }), dir: pick(['asc', 'desc']) }), 'เรียงแท่ง')]; })(),

  /* ด่าน 4: โจทย์จากแผนภูมิแท่ง: ผลต่าง → รวม → แท่งที่หายไป */
  1504: (() => { const B = g5dBar(G4_T_BAR), v = G4_T_BAR.series[0].v, C2 = G4_T_BUILD, v2 = C2.series[0].v, B2 = g5dBar(C2, { vals: v2.map((q, i) => i === 2 ? null : q) }), tot2 = v2.reduce((a, b) => a + b, 0);
    return [
      g5dSee('โจทย์จากแผนภูมิ', '<b>แตะรูป</b> — อ่านค่า แล้วเลือกวิธีคิด', [
        { t: 'ต่างกันเท่าไร', f: on => B.s + (on ? r4vH(r4dDash([B.X(1) - 20, B.Y(30)], [B.X(2) + 24, B.Y(30)], G5D_C.p, 2.4) + r4dArr([B.X(2) + 30, B.Y(30)], [B.X(2) + 30, B.Y(70) + 2], G5D_C.p) + r4dTx(B.X(2) + 30, B.Y(50) + 30, '40', G5D_C.p, 'r4v-big')) : ''), s: 'ส่วนที่สูงกว่า = <b>ผลต่าง</b><br>70 − 30 = 40' }]),
      r4dShow('มากกว่ากันเท่าใด', { fig: B.s, q: 'มาด้วยรถโรงเรียนมากกว่าจักรยานกี่คน',
        steps: [{ ink: g5dGuide(B, 2, 70) + r4dTx(B.X(2), B.Y(70) - 8, '70', G5D_C.p), w: 'รถโรงเรียน 70', n: 'อ่านค่าแท่งแรก' },
          { ink: g5dGuide(B, 1, 30, '#2F7BC0') + r4dTx(B.X(1), B.Y(30) - 8, '30', '#2F7BC0'), w: 'จักรยาน 30', n: 'อ่านค่าแท่งที่สอง' },
          { ink: r4dDash([B.X(1) + B.bw / 2, B.Y(30)], [B.X(2) + B.bw / 2 + 12, B.Y(30)], G5D_C.p, 2.4), w: '70 − 30 = 40 คน', n: 'มากกว่ากี่คน → ลบ', ans: 1 }],
        fin: 'อ่านค่า 2 แท่ง แล้ว<b>ลบ</b>กัน', say: 'อ่านค่าสองแท่ง แล้วลบกัน' }),
      g5dTry(1504, () => g4BarQ(g5dBarR(), pick(['diff', 'more'])), 'ผลต่างจากแผนภูมิ'),
      r4dShow('รวมทั้งหมด', { fig: B.s, q: 'มาโรงเรียนทั้งหมดกี่คน',
        steps: [{ ink: v.map((q, i) => r4dTx(B.X(i), B.Y(q) - 8, String(q), G5D_C.p)).join(''), w: '45 + 30 + 70 + 55', n: 'อ่านค่าทุกแท่ง' }, { w: '= 200 คน', wa: 1, n: 'บวกกัน', ans: 1 }],
        fin: 'ถามทั้งหมด → <b>บวกทุกแท่ง</b>', say: 'ถามทั้งหมด ให้บวกค่าทุกแท่ง' }),
      g5dTry(1504, () => g4BarQ(g5dBarR(), pick(['sum', 'all'])), 'รวมจากแผนภูมิ'),
      g5dSee('แท่งที่หายไป', '<b>แตะรูป</b> — รู้ผลรวม หาแท่งที่ซ่อน', [
        { t: `รวมทั้งหมด ${tot2} เล่ม`, f: on => B2.s + r4dTx(B2.X(2), B2.yb - 16, '?', G5D_C.p, 'r4v-big') + (on ? r4vH(`<rect x="${a4n(B2.X(2) - B2.bw / 2)}" y="${a4n(B2.Y(40))}" width="${a4n(B2.bw)}" height="${a4n(B2.yb - B2.Y(40))}" fill="${G5D_C.bar2}" stroke="${G5D_C.p}" stroke-width="2" stroke-dasharray="5 4"/>`) : ''), s: `ผลรวม − แท่งที่เห็น<br>${tot2} − 220 = <b>40</b>` }]),
      r4dShow('แท่งที่หายไป', { fig: B2.s + r4dQ(B2.X(2), B2.yb - 14), q: `หนังสือบริจาครวม ${tot2} เล่ม เดือน ส.ค. ได้กี่เล่ม`,
        steps: [{ ink: [0, 1, 3].map(i => r4dTx(B2.X(i), B2.Y(v2[i]) - 8, String(v2[i]), G5D_C.p)).join(''), w: '60 + 85 + 75 = 220', n: 'รวมแท่งที่เห็น' },
          { w: `${tot2} − 220 = 40`, n: 'รวมทั้งหมด − ที่เห็น' },
          { off: ['.r4d-q0'], ink: `<rect x="${a4n(B2.X(2) - B2.bw / 2)}" y="${a4n(B2.Y(40))}" width="${a4n(B2.bw)}" height="${a4n(B2.yb - B2.Y(40))}" fill="none" stroke="${G5D_C.p}" stroke-width="2.6"/><rect data-pop="1" x="${a4n(B2.X(2) - B2.bw / 2)}" y="${a4n(B2.Y(40))}" width="${a4n(B2.bw)}" height="${a4n(B2.yb - B2.Y(40))}" fill="${G5D_C.bar2}" fill-opacity=".8"/>`, w: 'ส.ค. 40 เล่ม', n: 'วาดแท่งสูง 40 ตรวจดู', ans: 1 }],
        fin: 'แท่งที่หายไป = <b>ผลรวม − แท่งที่เห็น</b>', say: 'แท่งที่หายไป เท่ากับผลรวมลบแท่งที่เห็น' }),
      g5dTry(1504, () => { const C = g5dBarR(); return Q.g4Hidden({ C, i: rnd(0, C.cats.length - 1) }); }, 'แท่งที่หายไป')]; })(),

  /* ด่าน 5: เขียนแผนภูมิแท่ง: ขั้นตอน → มาตราส่วน → วาดแท่ง */
  1505: (() => { const C = G4_T_BUILD, v = C.series[0].v, B = g5dBar(C, { yt: 30 }), Bn = g5dBar(C, { bars: false, nums: false }), Bg = g5dBar(C, { bars: false });
    const part = k => { const P = g5dBar(C, { yt: 50, bars: k >= 3, nums: k >= 2, grid: k >= 2, cats: k >= 1, names: k >= 1, axes: k >= 1, title: 'หนังสือที่ได้รับบริจาค' }); return P.s; };
    const nums = Array.from({ length: 11 }, (_, j) => r4dTx(Bn.x0 - 9, Bn.Y(j * 10) + 5, String(j * 10), G5D_C.p, 'r4d-sm', 'end')).join('') + Array.from({ length: 11 }, (_, j) => `<path data-pop="1" d="M${Bn.x0} ${a4n(Bn.Y(j * 10))} H${Bn.x1}" stroke="#E6E0F2" stroke-width="1.2"/>`).join('');
    return [
      ...[[0, 1], [2, 3]].map(ks => g5dSee(ks[0] ? 'ขั้นตอนเขียนแผนภูมิแท่ง (ต่อ)' : 'ขั้นตอนเขียนแผนภูมิแท่ง', '<b>แตะรูปทีละขั้น</b> — เขียนแผนภูมิแท่งจากตาราง', ks.map(k => ({ t: ['① ชื่อแผนภูมิ', '② แกนและชื่อแกน', '③ มาตราส่วน', '④ วาดแท่ง'][k], f: on => on ? r4vH(part(k)) : k ? part(k - 1) : '', s: ['เขียน<b>ชื่อแผนภูมิ</b><br>บอกว่าเป็นข้อมูลเรื่องอะไร', 'แกนตั้ง แกนนอน<br>และ<b>ชื่อแกน</b>', '1 ช่องแทน<b>เท่ากัน</b><br>(ช่องละ 10 เล่ม)', 'แท่ง<b>กว้างเท่ากัน</b><br>ห่างเท่ากัน'][k] })))),
      g5dTry(1505, g4SeqQ, 'เรียงขั้นตอน'),
      r4dShow('เลือกมาตราส่วน', { fig: Bn.s, q: 'มิ.ย. 60 ก.ค. 85 ส.ค. 40 ก.ย. 75 เล่ม — 1 ช่องแทนกี่เล่ม',
        steps: [{ w: 'มากที่สุด 85', n: 'ดูค่ามากที่สุดก่อน' }, { w: 'ช่องละ 1 → 85 ช่อง ✗', n: 'ช่องเยอะเกินไป' }, { w: 'ช่องละ 50 → 2 ช่อง ✗', n: 'อ่านค่ายาก' },
          { ink: nums, w: 'ช่องละ 10 ✓', n: 'ถึง 100 ใน 10 ช่อง พอดี', ans: 1 }],
        fin: 'มาตราส่วน: ค่ามากที่สุด<b>อยู่บนแกนได้</b> ในไม่กี่ช่อง', say: 'เลือกมาตราส่วนให้ค่ามากที่สุดอยู่บนแกนได้ในไม่กี่ช่อง' }),
      g5dTry(1505, () => Q.g4Scale({ C: g5dBarR({ n: 4 }) }), 'เลือกมาตราส่วน'),
      r4dShow('วาดแท่ง', { fig: Bg.s, q: 'วาดแท่งตามตาราง: มิ.ย. 60 ก.ค. 85 ส.ค. 40 ก.ย. 75 เล่ม',
        steps: v.map((q, i) => ({ ink: `<rect x="${a4n(B.X(i) - B.bw / 2)}" y="${a4n(Bg.Y(q))}" width="${a4n(B.bw)}" height="${a4n(Bg.yb - Bg.Y(q))}" fill="none" stroke="#4A5FB0" stroke-width="2.4"/><rect data-pop="1" x="${a4n(B.X(i) - B.bw / 2)}" y="${a4n(Bg.Y(q))}" width="${a4n(B.bw)}" height="${a4n(Bg.yb - Bg.Y(q))}" fill="${G5D_C.bar}" fill-opacity=".9"/>`,
          w: `${C.cats[i]} ${q}`, n: q % 10 ? `ครึ่งทาง ${q - 5} กับ ${q + 5}` : `สูง ${q / 10} ช่อง`, ans: 0 })).concat([{ w: 'ครบ 4 แท่ง ✓', n: 'กว้างเท่ากัน ห่างเท่ากัน', ans: 1 }]),
        fin: 'แท่ง<b>สูงตามข้อมูล</b> กว้างเท่ากัน ห่างเท่ากัน', say: 'วาดแท่งให้สูงตามข้อมูล กว้างเท่ากัน และห่างเท่ากัน' }),
      T('<b>ลองปรับเอง</b> — ลากแท่งให้ตรงตาราง', 'ลองลากแท่งให้ตรงตาราง', el => el.append(simBuild(G4_T_BUILD, [['ชื่อแผนภูมิ', G4_T_BUILD.title], ['มาตราส่วน', 'ช่องละ 10 เล่ม']]))),
      g5dTry(1505, () => { const C2 = g5dBarR({ n: 4 }); return { ...Q.gBuild({ chart: C2 }), __sig: `g4u ${C2.title} ${C2.series[0].v}` }; }, 'เขียนแผนภูมิแท่ง')]; })()
};

/* =========================================================
   games: 10 questions in the order the ideas are taught, easy → hard
   ========================================================= */
const g5dBuild = () => { const C = g5dBarR({ n: 4 }); return { ...Q.gBuild({ chart: C }), __sig: `g4u ${C.title} ${C.series[0].v}` }; };
const g5dSpot = () => { const C = g5dBarR({ n: 4, full: true }), i = rnd(0, 3), v = C.series[0].v[i]; return Q.g4Spot({ C, i, wrong: v + (v + C.step <= C.max ? C.step : -C.step) }); };
const g5dMax = () => { const C = g5dBarR({ horiz: Math.random() < .5 }), v = C.series[0].v, mx = v.indexOf(Math.max(...v)); return { ...Q.gPick({ chart: C, q: 'ข้อใด<b>มากที่สุด</b>', opts: C.cats.slice(0, 4).concat(C.cats.length > 4 && mx >= 4 ? [C.cats[mx]] : []).filter((x, k, A) => A.indexOf(x) === k).slice(-4), right: g4cat(C, mx), hint: 'แท่งที่ยาวที่สุด' }), __sig: `g4p ${C.title} ${v}` }; };
const G5D_GAME = {
  1501: () => [g5dD(g4tallyQ(), 1, 'a'), g5dD(g5dTap('cell'), 2, 'b'), g5dD(g5dTap('cell'), 3, 'c'), g5dD(g4tallyQ(), 4, 'd'), g5dD(g5dTap('coltot'), 5, 'e'),
    g5dD(g4TwQ(g5dTw(), 'rowtot'), 6, 'f'), g5dD(g4TwQ(g5dTw(), 'coltot'), 7, 'g'), g5dD(g4fillQ(), 8, 'h'), g5dD(g4fillQ(), 9, 'i'), g5dD(g4TwQ(g5dTw(), 'all'), 10, 'j')],
  1502: () => [g5dD(g4TwQ(g5dTw(), 'diffrow'), 1, 'a'), g5dD(g4TwQ(g5dTw(), 'diffcol'), 2, 'b'), g5dD(g5dTap('maxcol'), 3, 'c'), g5dD(g5dTap('mintot'), 4, 'd'), g5dD(g4TwQ(g5dTw(), 'sum2'), 5, 'e'),
    g5dD(g4TwQ(g5dTw(), 'all'), 6, 'f'), g5dD(g4twStory(), 7, 'g'), g5dD(g4twStory(), 8, 'h'), g5dD(g4priceStory(), 9, 'i'), g5dD(g4priceStory(), 10, 'j')],
  1503: () => [g5dD(g4Read(g5dBarR({ nolab: true })), 1, 'a'), g5dD(g4Read(g5dBarR({ nolab: true })), 2, 'b'), g5dD(Q.g4TapBar((() => { const C = g5dBarR({ nolab: true }); return { C, want: pick(C.series[0].v) }; })()), 3, 'c'),
    g5dD(g4Read(g5dBarR({ nolab: true, horiz: true })), 4, 'd'), g5dD(g4Read(g5dBarR({ nolab: true, horiz: true })), 5, 'e'), g5dD(Q.g4TapBar({ C: g5dBarR({ nolab: true }), want: 'max' }), 6, 'f'), g5dD(Q.g4TapBar({ C: g5dBarR({ nolab: true }), want: 'min' }), 7, 'g'),
    g5dD(g5dMax(), 8, 'h'), g5dD(Q.g4Rank({ C: g5dBarR({ n: 4 }), dir: 'desc' }), 9, 'i'), g5dD(Q.g4Rank({ C: g5dBarR({ n: 5 }), dir: 'asc' }), 10, 'j')],
  1504: () => [g5dD(g4BarQ(g5dBarR(), 'diff'), 1, 'a'), g5dD(g4BarQ(g5dBarR(), 'more'), 2, 'b'), g5dD(g4BarQ(g5dBarR({ horiz: true }), 'diff'), 3, 'c'), g5dD(g4BarQ(g5dBarR(), 'sum'), 4, 'd'), g5dD(g4BarQ(g5dBarR(), 'all'), 5, 'e'),
    g5dD(g4BarQ(g5dBarR({ horiz: true }), 'all'), 6, 'f'), g5dD(g4BarQ(g4barRand(pick([1, 2, 4])), 'price'), 7, 'g'), g5dD((() => { const C = g5dBarR({ n: 4 }); return Q.g4Hidden({ C, i: rnd(0, 3) }); })(), 8, 'h'),
    g5dD((() => { const C = g5dBarR(); return Q.g4Hidden({ C, i: rnd(0, C.cats.length - 1) }); })(), 9, 'i'), g5dD(g4BarQ(g5dBarR({ horiz: true }), 'more'), 10, 'j')],
  1505: () => [g5dD(g4SeqQ(), 1, 'a'), g5dD(Q.g4Scale({ C: g5dBarR({ n: 4 }) }), 2, 'b'), g5dD(Q.g4Scale({ C: g5dBarR({ n: 5 }) }), 3, 'c'), g5dD(g5dSpot(), 4, 'd'), g5dD(g5dSpot(), 5, 'e'),
    g5dD(g5dBuild(), 6, 'f'), g5dD(g5dBuild(), 7, 'g'), g5dD(g4TF(), 8, 'h'), g5dD(g5dBuild(), 9, 'i'), g5dD((() => { const C = g5dBarR({ n: 5 }); return { ...Q.gBuild({ chart: C }), __sig: `g4u ${C.title} ${C.series[0].v}` }; })(), 10, 'j')]
};
LESSONS_P4C10.forEach(L => { if (G5D_TEACH[L.id]) { L.teach = G5D_TEACH[L.id]; L.__pracDone = 1; } if (G5D_GAME[L.id]) { L.game = G5D_GAME[L.id]; L.gameN = 10; } });
