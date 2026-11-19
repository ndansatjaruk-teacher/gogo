/* =========================================================
   children DO the multiplication themselves:
     Q.k3Col  — ตั้งคูณทีละหลัก (เด็กใส่ผลคูณของแต่ละหลักรวมตัวทด เกมเขียนหลักและทดให้)
     Q.k3Long — สองหลัก × สองหลัก: ผลคูณย่อยหลักหน่วย → ผลคูณย่อยหลักสิบ → บวก
   sims: simK3Zero (เติม 0) · simMul1 / simMulLong of p4m · simK3Unk (ลองค่าแล้วตรวจ) · p4story
   ========================================================= */
const k3n = n => String(n).length;
const k3col = (rows, n, o) => `<div class="p4colwrap">${p4stackHTML(rows, n, o)}</div>`;
const k3mulFig = (a, m, res = '', car = '', hi = -1) => { const n = k3n(a * m) + (k3n(a * m) > k3n(a) ? 0 : 1); return k3col([{ t: car, cls: 'mk' }, { t: a }, { s: '×', t: m }, { line: true }, { t: res, cls: 'dg rs' }, { line: true, dbl: true }], Math.max(n, k3n(a) + 1), { hi }); };
/* groups of hundred flats / thousand cubes (picture for × 100…, × 1,000…) */
function k3FlatsSVG(g, m, z) { const per = Math.min(m, 9), gw = 112, W = Math.min(g, 4) * (gw + 10) + 10, cols = Math.min(g, 4), rows = Math.ceil(g / 4), sq = Math.min(22, (gw - 12) / 3.4), gh = Math.ceil(per / 3) * (sq + 4) + 26;
  let s = ''; for (let i = 0; i < g; i++) { const x0 = 10 + (i % cols) * (gw + 10), y0 = 6 + Math.floor(i / cols) * (gh + 10);
    s += `<rect x="${x0}" y="${y0}" width="${gw}" height="${gh}" rx="10" fill="#FFF8E1" stroke="#E3A21C" stroke-width="1.6"/>`;
    for (let j = 0; j < per; j++) { const x = x0 + 6 + (j % 3) * (sq + 4), y = y0 + 6 + Math.floor(j / 3) * (sq + 4);
      s += z === 3 ? `<path d="M${x} ${y + 5} l5 -5 h${sq - 5} v${sq - 5} l-5 5 Z" fill="#7FC8F0" stroke="#2F6FA0"/><rect x="${x}" y="${y + 5}" width="${sq - 5}" height="${sq - 5}" fill="#9AD6F5" stroke="#2F6FA0"/>` : `<rect x="${x}" y="${y}" width="${sq}" height="${sq}" fill="#FFD27A" stroke="#B7791F"/><path d="M${x + sq / 3} ${y}v${sq}M${x + 2 * sq / 3} ${y}v${sq}M${x} ${y + sq / 3}h${sq}M${x} ${y + 2 * sq / 3}h${sq}" stroke="#B7791F" stroke-width=".6"/>`; }
    s += `<text x="${x0 + gw / 2}" y="${y0 + gh - 7}" text-anchor="middle" class="k3-gt">${fmt(m * 10 ** z)}</text>`; }
  return `<svg viewBox="0 0 ${W} ${rows * (gh + 10) + 6}" class="k3-svg" aria-hidden="true">${s}</svg>`; }
const k3Eq = (a, b, r, zs = 0) => `<div class="k3-eq"><b class="num">${fmt(a)}</b> × <b class="num">${fmt(b)}</b> = <b class="num">${r == null ? '?' : zs ? fmt(r).replace(new RegExp(`(${'0,?'.repeat(zs).replace(/,\?$/, '')})$`), '<i class="k3-z">$1</i>') : fmt(r)}</b></div>`;

/* ---------- teaching sims ---------- */
function simK3Zero(mode) { // 'h' = 1 digit × m00 / m000 · 't' = 2 digits × t0
  let a = mode === 'h' ? 3 : 14, m = mode === 'h' ? 4 : 3, z = mode === 'h' ? 2 : 1, moves = 0; const box = h('div', { class: 'colstack' }, h6wait()), fig = h('div', { class: 'pw-fig' }), eqs = h('div', { class: 'k3-eqs' }), out = fNote();
  const paint = () => { const p = a * m, M = m * 10 ** z;
    fig.innerHTML = mode === 'h' ? k3FlatsSVG(a, m, z) : k3col([{ t: a }, { s: '×', t: M }, { line: true }, { t: a * M, cls: 'dg rs', z }, { line: true, dbl: true }], k3n(a * M) + 1);
    eqs.innerHTML = k3Eq(a, m, p) + k3Eq(a, M, a * M, z);
    out.innerHTML = `${fmt(M)} = ${m} × ${fmt(10 ** z)} มี 0 อยู่ <b>${z}</b> ตัว<br>คูณ ${fmt(a)} × ${m} = ${fmt(p)} แล้ว<b>เติม 0 อีก ${z} ตัว</b> = ${fmt(a * M)}`; if (++moves > 3) teachDone(box); };
  const st = (lab, get, set, lo, hi) => stepper(lab, get, set, () => lo, () => hi, paint);
  box.append(h('div', { class: 'rowstack' }, st(mode === 'h' ? 'จำนวนกลุ่ม' : 'ตัวตั้ง', () => a, v => a = v, mode === 'h' ? 1 : 11, mode === 'h' ? 9 : 99), st('ตัวเลขหน้า 0', () => m, v => m = v, 1, 9), mode === 'h' ? st('จำนวน 0', () => z, v => z = v, 2, 3) : null), fig, eqs, out);
  paint(); moves = 0; return box; }
function simK3Unk(list) { // guess □, multiply, compare with the product (P3 has not learned division yet)
  let idx = 0, x = 1; const box = h('div', { class: 'colstack' }, h6wait()), sen = h('div', { class: 'fbig p4big' }), bar = h('div', { class: 'k3-bar' }), out = fNote(); let done = 0;
  const paint = () => { const [k, p, pos] = list[idx], v = k * x, f = q => Math.min(100, q / (p * 1.3) * 100);
    sen.innerHTML = pos ? `<b class="num">${fmt(k)}</b> × <b class="num p4fill">${x}</b> = <b class="num">${fmt(p)}</b>` : `<b class="num p4fill">${x}</b> × <b class="num">${fmt(k)}</b> = <b class="num">${fmt(p)}</b>`;
    bar.innerHTML = `<i style="width:${f(v)}%" class="${v > p ? 'over' : v === p ? 'ok' : ''}"></i><b style="left:${f(p)}%"></b><span>ผลคูณที่ได้ ${fmt(v)}</span>`;
    out.innerHTML = v === p ? `<b>พอดี!</b> □ = ${x} เพราะ ${pos ? `${fmt(k)} × ${x}` : `${x} × ${fmt(k)}`} = ${fmt(p)}` : v < p ? `${fmt(v)} น้อยกว่า ${fmt(p)} → ลองจำนวนที่<b>มากขึ้น</b>` : `${fmt(v)} มากกว่า ${fmt(p)} → ลองจำนวนที่<b>น้อยลง</b>`;
    if (v === p) { sfx.ok(); if (++done >= 2) teachDone(box); } };
  const b = (d, t) => h('button', { class: 'btn sm ia', onclick: e => { e.stopPropagation(); x = Math.max(1, Math.min(99, x + d)); sfx.tap(); paint(); } }, t);
  box.append(sen, bar, h('div', { class: 'rowstack' }, b(-10, '−10'), b(-1, '−1'), b(1, '+1'), b(10, '+10')), out, p4more(() => { idx = (idx + 1) % list.length; x = 1; paint(); }, 'ข้อใหม่'));
  paint(); return box; }

/* ---------- question types ---------- */
Object.assign(Q, {
  k3Col({ a, m, flip }) { // v111: the shared column board (colw.js)
    return Q.colW({ nums: [a, m], op: '×', prompt: `หาผลคูณ ${flip ? `${m} × ${fmt(a)}` : `${fmt(a)} × ${m}`} โดยการตั้งคูณ`, say: `${flip ? `${m} คูณ ${thaiWords(a)}` : `${thaiWords(a)} คูณ ${m}`} ตั้งคูณ`, sig: `k3c ${a}x${m}` }); },
  k3Long({ a, b }) { // v111: the shared column board — partial products, then the sum
    return Q.colW({ nums: [a, b], op: '×', prompt: `หาผลคูณ ${a} × ${b} โดยการตั้งคูณ`, say: `${thaiWords(a)} คูณ ${thaiWords(b)} ตั้งคูณ`, sig: `k3l ${a}x${b}` }); },
  k3Zero({ a, b }) { const r = a * b, q = 'หาผลคูณ';
    return { prompt: q, say: `${thaiWords(a)} คูณ ${thaiWords(b)}`, __sig: `k3z ${a}x${b}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: p4big(`<b class="num">${fmt(a)} × ${fmt(b)}</b> <b class="fop">=</b> <span class="fsign">?</span>`) }),
        answerBox(ctx, String(r), { hint: 'คูณตัวเลขที่ไม่ใช่ 0 ก่อน แล้วเติม 0 ให้ครบตามจำนวน 0 ของตัวคูณ' }))); } }; },
  k3Groups({ g, m, z }) { const r = g * m * 10 ** z, q = `มี ${g} กลุ่ม กลุ่มละ ${fmt(m * 10 ** z)} รวมทั้งหมดเท่าไร`;
    return { prompt: q, say: q, __sig: `k3g ${g}x${m}e${z}`, mount(bd, ctx) { bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: k3FlatsSVG(g, m, z) }), answerBox(ctx, String(r), { hint: `${g} × ${fmt(m * 10 ** z)} → ${g} × ${m} แล้วเติม 0 อีก ${z} ตัว` }))); } }; },
  k3Cmp({ L, R }) { const vl = L[0] * L[1], vr = R[0] * R[1], right = vl > vr ? '>' : vl < vr ? '<' : '=', q = 'เติมเครื่องหมาย > < หรือ = (ไม่ต้องคูณจริงก็ได้)';
    return { prompt: q, say: `เปรียบเทียบ ${thaiWords(L[0])} คูณ ${thaiWords(L[1])} กับ ${thaiWords(R[0])} คูณ ${thaiWords(R[1])}`, __sig: `k3m ${L}|${R}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: `<div class="f3-eq"><b class="num">${fmt(L[0])} × ${fmt(L[1])}</b> <span class="blank">?</span> <b class="num">${fmt(R[0])} × ${fmt(R[1])}</b></div>` }),
        choices(ctx, ['>', '<', '='].map(v => ({ value: v, label: v })), right, { hint: 'สลับที่การคูณ ผลคูณเท่าเดิม · ถ้ามีจำนวนหนึ่งเท่ากัน ให้ดูอีกจำนวน' }))); } }; },
  k3Unk({ k, x, pos }) { const p = k * x, s = pos ? `${k} × □ = ${p}` : `□ × ${k} = ${p}`, q = 'หาจำนวนที่แทน □';
    return { prompt: q, say: `หาจำนวนที่แทนกรอบสี่เหลี่ยม ${pos ? `${thaiWords(k)} คูณ กรอบ` : `กรอบ คูณ ${thaiWords(k)}`} เท่ากับ ${thaiWords(p)}`, __sig: `k3u ${s}`, mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q' }, h('div', { class: 'p4-fig', html: `<div class="fbig p4big">${p4uHTML(s)}</div>` }), answerBox(ctx, String(x), { hint: 'นึกถึงสูตรคูณ: จำนวนใดคูณแล้วได้ผลคูณนี้ (ลองค่าแล้วคูณตรวจ)' }))); } }; },
  k3Story({ text, a, b, unit, wrong }) { const r = a * b, sent = `${fmt(a)} × ${fmt(b)} = □`;
    return { prompt: 'อ่านโจทย์ แล้วหาคำตอบ', say: text, __sig: 'k3s ' + text.slice(0, 40), mount(bd, ctx) {
      bd.append(h('div', { class: 't6-q p4-q p2q p2st f3-st' }, h('div', { class: 'p4-fig' }, h('div', { class: 'storybox', html: text })),
        tkTwoStep(ctx, '① เลือกประโยคสัญลักษณ์', shuffle([sent, ...(wrong || [`${fmt(a)} + ${fmt(b)} = □`, `${fmt(Math.max(a, b))} − ${fmt(Math.min(a, b))} = □`])]), sent, 'กลุ่มละเท่า ๆ กัน หลายกลุ่ม · ละ … จำนวน … → ใช้การคูณ', () => answerBox(ctx, String(r), { hint: `${fmt(a)} × ${fmt(b)}` }), `<b>${sent}</b> ✓ · ② หาคำตอบ (${unit})`))); } }; }
});
const k3MatchZ = (a, m) => ({ ...Q.ixMatch({ q: 'จับคู่การคูณกับผลคูณ', pairs: [[`${a} × ${m}`, fmt(a * m)], [`${a} × ${fmt(m * 100)}`, fmt(a * m * 100)], [`${a} × ${fmt(m * 1000)}`, fmt(a * m * 1000)]], wide: true, hint: 'นับจำนวน 0 ของตัวคูณ แล้วเติม 0 ให้ผลคูณเท่ากัน' }), __sig: `k3mz ${a}x${m}` });
const k3MatchT = (a, t) => ({ ...Q.ixMatch({ q: 'จับคู่การคูณกับผลคูณ', pairs: [[`${a} × ${t}`, fmt(a * t)], [`${a} × ${t * 10}`, fmt(a * t * 10)], [`${a} × 1`, String(a)], [`${a} × 10`, fmt(a * 10)]].filter((x, i, A) => A.findIndex(y => y[1] === x[1]) === i), wide: true }), __sig: `k3mt ${a}x${t}` });
const k3TF = (L) => ({ ...Q.ixGroup({ q: 'แตะการ์ด แล้วแตะกล่อง ถูก หรือ ผิด', bins: ['ถูก ✓', 'ผิด ✗'], items: L.map(([a, m, r]) => ({ label: `${fmt(a)} × ${m} = ${fmt(r)}`, bin: a * m === r ? 0 : 1, why: `${fmt(a)} × ${m} = ${fmt(a * m)}` })) }), __sig: 'k3tf ' + L.map(x => x.join('x')).join() });
const k3Wrong = (a, m) => { const r = a * m, opts = [r + 10 ** rnd(0, k3n(r) - 2) * pick([1, 2]), r - 10 ** rnd(1, k3n(r) - 2), Number(String(a) + '0') * m === r ? r + 100 : r - (r % 10) + ((r % 10 + 1) % 10)]; return pick(opts.filter(v => v > 0 && v !== r)) || r + 1; };

/* ---------- random data in each clip's range ---------- */
const k3Digits = (len, ok) => { for (let g = 0; g < 200; g++) { const v = rnd(10 ** (len - 1), 10 ** len - 1); if (!ok || ok(v)) return v; } return 10 ** (len - 1) + 1; };
const k3Carries = (a, m) => p4mul1Plan(a, m).filter(s => !s.last && s.carry).length;
const k3Easy3 = () => { const m = rnd(2, 4); return [k3Digits(3, v => k3Carries(v, m) <= 1 && v * m < 1000), m]; };
const k3Hard3 = () => { const m = rnd(4, 9); return [k3Digits(3, v => k3Carries(v, m) >= 2 || /0/.test(String(v).slice(1))), m]; };
const k3Four = () => { const m = rnd(2, 9); return [k3Digits(4, v => v * m < 100000), m]; };
const k3TwoTwo = hard => { for (let g = 0; g < 200; g++) { const a = rnd(hard ? 35 : 12, hard ? 99 : 59), b = rnd(hard ? 25 : 11, hard ? 99 : 34); if (b % 10 && a % 10) return [a, b]; } return [23, 14]; };
const k3Hund = () => [rnd(2, 9), rnd(1, 9) * 10 ** rnd(2, 3)];
const k3Tens = () => [rnd(11, 99), rnd(1, 9) * 10];
const k3Order = ([a, b]) => Math.random() < .5 ? { a, b } : { a: b, b: a };
const k3CmpData = () => { const t = rnd(0, 3);
  if (t === 0) { const a = k3Digits(3), m = rnd(2, 9); return { L: [a, m], R: [m, a] }; }
  if (t === 1) { const a = k3Digits(rnd(3, 4)), m = rnd(2, 8), n = rnd(m + 1, 9); return Math.random() < .5 ? { L: [n, a], R: [m, a] } : { L: [a, m], R: [n, a] }; }
  if (t === 2) { const a = rnd(21, 89), b = rnd(11, 30), c = a + rnd(1, 9); return Math.random() < .5 ? { L: [a, b], R: [c, b] } : { L: [c, b], R: [a, b] }; }
  const a = rnd(2, 9), x = rnd(1, 4) * 1000 + rnd(100, 999), y = rnd(6, 9) * 1000; return { L: [a, x], R: [y, a + rnd(1, 2)] }; };
const k3UnkData = () => { const t = rnd(0, 2); if (t === 0) return { k: rnd(2, 12), x: rnd(2, 12), pos: rnd(0, 1) }; if (t === 1) return { k: rnd(2, 9) * 100, x: rnd(2, 9), pos: rnd(0, 1) }; return { k: pick([12, 15, 20, 25, 30, 40, 50]), x: rnd(11, 19), pos: rnd(0, 1) }; };
const K3S = (text, a, b, unit) => ({ text, a, b, unit });
const K3_ST = [K3S('ร้านขายขนมจัดคุกกี้ใส่กล่อง 236 กล่อง กล่องละ 6 ชิ้น มีคุกกี้ทั้งหมดกี่ชิ้น', 236, 6, 'ชิ้น'),
  K3S('ฟาร์มไก่เก็บไข่ได้วันละ 1,245 ฟอง เป็นเวลา 7 วัน เก็บไข่ได้ทั้งหมดกี่ฟอง', 1245, 7, 'ฟอง'),
  K3S('โรงเรียนมีห้องเรียน 24 ห้อง แต่ละห้องมีโต๊ะ 35 ตัว มีโต๊ะทั้งหมดกี่ตัว', 24, 35, 'ตัว'),
  K3S('พ่อซื้อปุ๋ย 8 กระสอบ กระสอบละ 375 บาท พ่อต้องจ่ายเงินกี่บาท', 375, 8, 'บาท'),
  K3S('แปลงผักปลูกผักกาดแถวละ 27 ต้น จำนวน 43 แถว ปลูกผักกาดทั้งหมดกี่ต้น', 27, 43, 'ต้น'),
  K3S('รถบรรทุกขนแตงโมเที่ยวละ 650 ผล ขนไป 9 เที่ยว ขนแตงโมไปทั้งหมดกี่ผล', 650, 9, 'ผล'),
  K3S('ห้องสมุดมีตู้หนังสือ 17 ตู้ ตู้ละ 38 เล่ม ห้องสมุดมีหนังสือทั้งหมดกี่เล่ม', 38, 17, 'เล่ม'),
  K3S('นักวิ่งวิ่งรอบสนามวันละ 2,350 เมตร เป็นเวลา 4 วัน วิ่งได้ทั้งหมดกี่เมตร', 2350, 4, 'เมตร'),
  K3S('แม่ค้าขายส้มตำได้วันละ 58 จาน ขาย 12 วัน ขายส้มตำได้ทั้งหมดกี่จาน', 58, 12, 'จาน'),
  K3S('โรงงานผลิตตุ๊กตาได้ชั่วโมงละ 145 ตัว ทำงาน 8 ชั่วโมง ผลิตตุ๊กตาได้กี่ตัว', 145, 8, 'ตัว'),
  K3S('ค่ายลูกเสือมีเต็นท์ 33 หลัง หลังละ 6 คน มีลูกเสือพักในเต็นท์ทั้งหมดกี่คน', 33, 6, 'คน'),
  K3S('ชาวสวนเก็บมังคุดได้ต้นละ 86 ผล จาก 25 ต้น เก็บมังคุดได้ทั้งหมดกี่ผล', 86, 25, 'ผล'),
  K3S('กล่องดินสอสีมี 9 กล่อง กล่องละ 1,200 แท่ง มีดินสอสีทั้งหมดกี่แท่ง', 1200, 9, 'แท่ง'),
  K3S('สวนสัตว์ขายบัตรได้วันละ 3,048 ใบ เป็นเวลา 3 วัน ขายบัตรได้ทั้งหมดกี่ใบ', 3048, 3, 'ใบ')];

/* ---------- lessons ---------- */
const L3K = (no, place, title, short, goal, teach, game) => ({ id: 1380 + no, no, place, title, short, tone: TONES5[(no + 2) % 6], goal, teach, game, learned: true });
const k3N = (k, f) => Array.from({ length: k }, f);
const k3mulRows = (a, m) => p4mul1Plan(a, m).map((s, i, P) => { let res = '', car = ' '.repeat(Math.max(k3n(a * m), k3n(a) + 1));
  P.slice(0, i + 1).forEach(t => { res = (t.last ? String(t.s) : String(t.out)) + res; if (!t.last && t.carry) { const ca = car.split(''); ca[car.length - 2 - t.p] = String(t.carry); car = ca.join(''); } });
  return [`หลัก${P4_SN[8 - s.p]}`, `${s.d} × ${m}${s.c ? ` + ${s.c} (ที่ทดมา)` : ''} = ${s.s}` + (s.last ? ` → เขียน ${s.s}` : s.carry ? ` → เขียน ${s.out} ทด ${s.carry}` : ''), k3mulFig(a, m, res, car, s.p)]; });
const LESSONS_P3C7 = [
  L3K(1, 'ป่าเติมศูนย์', 'การหาผลคูณของจำนวนหนึ่งหลักกับ 100 200 … 900 และการหาผลคูณของจำนวนหนึ่งหลักกับ 1,000 2,000 … 9,000', '× หลักร้อย หลักพัน', 'หาผลคูณของจำนวนหนึ่งหลักกับ 100 … 900 และ 1,000 … 9,000 โดยคูณตัวเลขหน้า 0 แล้วเติม 0',
    [...learnStep('ยินดีต้อนรับสู่ <b>ป่าเติมศูนย์</b>! คูณด้วย <b>100, 200, … 900</b>', 'ยินดีต้อนรับสู่ป่าเติมศูนย์ คูณด้วยหนึ่งร้อย สองร้อย ถึงเก้าร้อย', [
      { fig: k3FlatsSVG(3, 2, 2), name: '3 กลุ่ม กลุ่มละ 200', text: 'แผ่นร้อย 2 แผ่นต่อกลุ่ม · 3 กลุ่มได้ 6 แผ่น = 600' },
      { fig: `<div class="k3-eqs">${k3Eq(3, 2, 6) + k3Eq(3, 200, 600, 2)}</div>`, name: 'คูณแล้วเติม 0', text: '3 × 2 = 6 → 3 × 200 = 600 (เติม 0 สองตัว)' },
      { fig: k3FlatsSVG(3, 2, 3), name: 'คูณด้วย 2,000', text: '3 × 2 = 6 → 3 × 2,000 = 6,000 (เติม 0 สามตัว)' }], 'คูณตัวเลขหน้า 0 แล้วเติม 0 ให้ครบตามตัวคูณ'),
     pexStep('ตัวอย่างทีละขั้น: 7 × 600', 'ตัวอย่างทีละขั้น เจ็ดคูณหกร้อย', [['① ดูตัวเลขหน้า 0', '600 = 6 ร้อย มี 0 สองตัว', k3FlatsSVG(7, 6, 2)], ['② คูณ', '7 × 6 = 42', k3Eq(7, 6, 42)], ['③ เติม 0 สองตัว', '42 → 4,200', k3Eq(7, 600, 4200, 2)]], '7 × 600 = <b>4,200</b>'),
     T('ลองเปลี่ยนจำนวนกลุ่ม ตัวเลข และจำนวน 0', 'ลองเปลี่ยนจำนวนกลุ่ม ตัวเลข และจำนวนศูนย์', el => el.append(simK3Zero('h')))],
    () => [...k3N(4, () => Q.k3Zero(k3Order(k3Hund()))), Q.k3Groups({ g: rnd(2, 6), m: rnd(2, 6), z: rnd(2, 3) }), k3MatchZ(rnd(2, 9), rnd(2, 9))]),
  L3K(2, 'ป่าตั้งคูณ', 'การหาผลคูณของจำนวนหนึ่งหลักกับจำนวนสามหลักโดยการตั้งคูณ (1)', 'ตั้งคูณ 3 หลัก (1)', 'ตั้งคูณจำนวนหนึ่งหลักกับจำนวนสามหลัก คูณทีละหลักจากหลักหน่วย (มีทดไม่เกิน 1 ครั้ง)',
    [...learnStep('<b>ตั้งคูณ</b> จำนวนสามหลัก', 'ตั้งคูณจำนวนสามหลัก', [
      { fig: k3mulFig(312, 3), name: 'ตั้งให้ตรงหลัก', text: 'ตัวคูณหนึ่งหลักวางตรงหลักหน่วย' },
      { fig: k3mulFig(312, 3, '6', '', 0), name: 'เริ่มที่หลักหน่วย', text: '2 × 3 = 6 เขียนในหลักหน่วย' },
      { fig: k3mulFig(312, 3, '936'), name: 'คูณทีละหลักไปทางซ้าย', text: '1 × 3 = 3 · 3 × 3 = 9 → 936' }], 'คูณจากหลักหน่วย → หลักสิบ → หลักร้อย'),
     pexStep('ตัวอย่างทีละขั้น: 214 × 4 (มีทด)', 'ตัวอย่างทีละขั้น สองร้อยสิบสี่คูณสี่', k3mulRows(214, 4), '214 × 4 = <b>856</b>'),
     T('ลองกดคูณทีละหลัก', 'ลองกดคูณทีละหลัก', el => el.append(simMul1([[132, 3], [241, 4], [305, 3]]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.k3Col({ a: 123, m: 4 }), 'ถูกต้อง!')))],
    () => [...k3N(4, () => { const [a, m] = k3Easy3(); return Q.k3Col({ a, m, flip: Math.random() < .3 }); }), k3TF(k3N(4, () => { const [a, m] = k3Easy3(); return [a, m, Math.random() < .5 ? a * m : k3Wrong(a, m)]; }))]),
  L3K(3, 'ป่าทดหลายครั้ง', 'การหาผลคูณของจำนวนหนึ่งหลักกับจำนวนสามหลักโดยการตั้งคูณ (2)', 'ตั้งคูณ 3 หลัก (2)', 'ตั้งคูณจำนวนหนึ่งหลักกับจำนวนสามหลักที่มีการทดหลายครั้ง และตัวตั้งที่มี 0',
    [...learnStep('<b>ทดหลายครั้ง</b>', 'ทดหลายครั้ง', [
      { fig: k3mulFig(486, 7, '2', '  4 ', 0), name: 'ทดไปหลักซ้าย', text: '6 × 7 = 42 → เขียน 2 ทด 4' },
      { fig: k3mulFig(486, 7, '02', ' 64 ', 1), name: 'บวกตัวทดหลังคูณ', text: '8 × 7 = 56 · 56 + 4 = 60 → เขียน 0 ทด 6' },
      { fig: k3mulFig(408, 5, '40', '  4 ', 1), name: 'หลักที่เป็น 0', text: '0 × 5 = 0 แล้วบวกตัวทด 4 → เขียน 4' }], 'คูณก่อน แล้วค่อยบวกตัวทด'),
     pexStep('ตัวอย่างทีละขั้น: 587 × 6', 'ตัวอย่างทีละขั้น ห้าร้อยแปดสิบเจ็ดคูณหก', k3mulRows(587, 6), '587 × 6 = <b>3,522</b>'),
     T('ลองกดคูณทีละหลัก', 'ลองกดคูณทีละหลัก', el => el.append(simMul1([[476, 8], [903, 7], [658, 9]]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.k3Col({ a: 736, m: 5 }), 'ถูกต้อง!')))],
    () => [...k3N(5, () => { const [a, m] = k3Hard3(); return Q.k3Col({ a, m, flip: Math.random() < .3 }); }), k3TF(k3N(4, () => { const [a, m] = k3Hard3(); return [a, m, Math.random() < .5 ? a * m : k3Wrong(a, m)]; }))]),
  L3K(4, 'ป่าสี่หลัก', 'การหาผลคูณของจำนวนหนึ่งหลักกับจำนวนสี่หลักโดยการตั้งคูณ', 'ตั้งคูณ 4 หลัก', 'ตั้งคูณจำนวนหนึ่งหลักกับจำนวนสี่หลัก',
    [...learnStep('ตั้งคูณ <b>จำนวนสี่หลัก</b>', 'ตั้งคูณจำนวนสี่หลัก', [
      { fig: k3mulFig(2134, 3), name: 'เพิ่มหลักพัน', text: 'ทำเหมือนสามหลัก แต่มีหลักพันอีก 1 หลัก' },
      { fig: k3mulFig(2134, 3, '6402'), name: 'ครบ 4 หลัก', text: '2,134 × 3 = 6,402' }], 'หน่วย → สิบ → ร้อย → พัน ทดเมื่อครบ 10'),
     pexStep('ตัวอย่างทีละขั้น: 3,568 × 4', 'ตัวอย่างทีละขั้น สามพันห้าร้อยหกสิบแปดคูณสี่', k3mulRows(3568, 4), '3,568 × 4 = <b>14,272</b>'),
     T('ลองกดคูณทีละหลัก', 'ลองกดคูณทีละหลัก', el => el.append(simMul1([[4127, 6], [2093, 8], [6754, 3]]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.k3Col({ a: 1625, m: 4 }), 'ถูกต้อง!')))],
    () => [...k3N(5, () => { const [a, m] = k3Four(); return Q.k3Col({ a, m, flip: Math.random() < .3 }); }), ...k3N(1, () => { const [a, m] = k3Four(); return Q.dPick({ q: `${fmt(a)} × ${m} ได้เท่าใด`, opts: shuffle([fmt(a * m), fmt(k3Wrong(a, m)), fmt(a * m + 1000)]), right: fmt(a * m), hint: 'ตั้งคูณทีละหลัก แล้วตรวจคำตอบ' }); })]),
  L3K(5, 'ป่าสิบเท่า', 'การหาผลคูณของจำนวนสองหลักกับ 10 20 30 … 90', '× 10 20 … 90', 'หาผลคูณของจำนวนสองหลักกับ 10, 20, 30, … 90 โดยคูณแล้วเติม 0 หนึ่งตัว',
    [...learnStep('คูณด้วย <b>10, 20, … 90</b>', 'คูณด้วยสิบ ยี่สิบ ถึงเก้าสิบ', [
      { fig: `<div class="k3-eqs">${k3Eq(23, 1, 23) + k3Eq(23, 10, 230, 1)}</div>`, name: 'คูณด้วย 10', text: 'จำนวนใดคูณ 10 → เติม 0 หนึ่งตัว' },
      { fig: `<div class="k3-eqs">${k3Eq(23, 3, 69) + k3Eq(23, 30, 690, 1)}</div>`, name: 'คูณด้วย 30', text: '30 = 3 สิบ → 23 × 3 = 69 แล้วเติม 0 → 690' }], 'คูณตัวเลขหน้า 0 แล้วเติม 0 หนึ่งตัว'),
     pexStep('ตัวอย่างทีละขั้น: 47 × 60', 'ตัวอย่างทีละขั้น สี่สิบเจ็ดคูณหกสิบ', [['① 60 = 6 สิบ', 'คูณ 6 ก่อน', k3Eq(47, 60, null)], ['② คูณ', '47 × 6 = 282', k3mulFig(47, 6, '282')], ['③ เติม 0', '282 → 2,820', k3Eq(47, 60, 2820, 1)]], '47 × 60 = <b>2,820</b>'),
     T('ลองเปลี่ยนตัวตั้งและตัวคูณ', 'ลองเปลี่ยนตัวตั้งและตัวคูณ', el => el.append(simK3Zero('t')))],
    () => [...k3N(5, () => Q.k3Zero(k3Order(k3Tens()))), k3MatchT(rnd(12, 49), rnd(2, 9))]),
  L3K(6, 'ป่าผลคูณย่อย', 'การหาผลคูณของจำนวนสองหลักกับจำนวนสองหลักโดยการตั้งคูณ (1)', 'สองหลัก × สองหลัก (1)', 'ตั้งคูณจำนวนสองหลักกับจำนวนสองหลัก: คูณหลักหน่วย คูณหลักสิบ แล้วบวกผลคูณย่อย',
    [...learnStep('สองหลัก <b>×</b> สองหลัก', 'สองหลักคูณสองหลัก', [
      { fig: k3col([{ t: 32 }, { s: '×', t: 14 }, { line: true }], 4), name: 'แยกตัวคูณ', text: '14 = 10 + 4' },
      { fig: k3col([{ t: 32 }, { s: '×', t: 14 }, { line: true }, { t: 128 }, { t: 320, z: 1 }], 4), name: 'ผลคูณย่อย 2 แถว', text: '32 × 4 = 128 · 32 × 10 = 320' },
      { fig: k3col([{ t: 32 }, { s: '×', t: 14 }, { line: true }, { t: 128 }, { s: '+', t: 320, z: 1 }, { line: true }, { t: 448, cls: 'dg rs' }, { line: true, dbl: true }], 4), name: 'บวกกัน', text: '128 + 320 = 448' }], 'คูณหลักหน่วย + คูณหลักสิบ = ผลคูณ'),
     pexStep('ตัวอย่างทีละขั้น: 26 × 13', 'ตัวอย่างทีละขั้น ยี่สิบหกคูณสิบสาม', [['① คูณหลักหน่วย', '26 × 3 = 78', k3col([{ t: 26 }, { s: '×', t: 13 }, { line: true }, { t: 78 }], 4)], ['② คูณหลักสิบ', '26 × 10 = 260', k3col([{ t: 26 }, { s: '×', t: 13 }, { line: true }, { t: 78 }, { t: 260, z: 1 }], 4)], ['③ บวก', '78 + 260 = 338', k3col([{ t: 26 }, { s: '×', t: 13 }, { line: true }, { t: 78 }, { s: '+', t: 260, z: 1 }, { line: true }, { t: 338, cls: 'dg rs' }, { line: true, dbl: true }], 4)]], '26 × 13 = <b>338</b>'),
     T('ลองกดทีละขั้น', 'ลองกดทีละขั้น', el => el.append(simMulLong([[34, 12], [41, 23], [27, 31]]))),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.k3Long({ a: 43, b: 12 }), 'ถูกต้อง!')))],
    () => k3N(5, () => { const [a, b] = k3TwoTwo(false); return Q.k3Long({ a, b }); })),
  L3K(7, 'ป่าคูณใหญ่', 'การหาผลคูณของจำนวนสองหลักกับจำนวนสองหลักโดยการตั้งคูณ (2)', 'สองหลัก × สองหลัก (2)', 'ตั้งคูณจำนวนสองหลักกับจำนวนสองหลักที่มีการทด และใช้ความรู้สึกเชิงจำนวนเปรียบเทียบผลคูณ',
    [...learnStep('ผลคูณย่อย <b>มีทด</b>', 'ผลคูณย่อยมีทด', [
      { fig: k3col([{ t: 78 }, { s: '×', t: 46 }, { line: true }, { t: 468 }], 5), name: 'คูณหลักหน่วยมีทด', text: '78 × 6 = 468' },
      { fig: k3col([{ t: 78 }, { s: '×', t: 46 }, { line: true }, { t: 468 }, { s: '+', t: 3120, z: 1 }, { line: true }, { t: 3588, cls: 'dg rs' }, { line: true, dbl: true }], 5), name: 'คูณหลักสิบแล้วบวก', text: '78 × 40 = 3,120 · 468 + 3,120 = 3,588' }], 'ทดในผลคูณย่อยแต่ละแถว แล้วบวกตามหลัก'),
     pexStep('ตัวอย่างทีละขั้น: 69 × 57', 'ตัวอย่างทีละขั้น หกสิบเก้าคูณห้าสิบเจ็ด', [['① หลักหน่วย', '69 × 7 = 483', k3col([{ t: 69 }, { s: '×', t: 57 }, { line: true }, { t: 483 }], 5)], ['② หลักสิบ', '69 × 50 = 3,450', k3col([{ t: 69 }, { s: '×', t: 57 }, { line: true }, { t: 483 }, { t: 3450, z: 1 }], 5)], ['③ บวก', '483 + 3,450 = 3,933', k3col([{ t: 69 }, { s: '×', t: 57 }, { line: true }, { t: 483 }, { s: '+', t: 3450, z: 1 }, { line: true }, { t: 3933, cls: 'dg rs' }, { line: true, dbl: true }], 5)]], '69 × 57 = <b>3,933</b>'),
     learnStep('เรื่องใหม่: <b>เปรียบเทียบผลคูณ</b>โดยไม่ต้องคูณ', 'เรื่องใหม่ เปรียบเทียบผลคูณโดยไม่ต้องคูณ', [
       { fig: `<div class="f3-eq">548 × 6 <b>=</b> 6 × 548</div>`, name: 'สลับที่', text: 'สลับตัวตั้งกับตัวคูณ ผลคูณเท่าเดิม' },
       { fig: `<div class="f3-eq">7 × 2,036 <b>&gt;</b> 5 × 2,036</div>`, name: 'จำนวนหนึ่งเท่ากัน', text: 'ดูอีกจำนวน: 7 มากกว่า 5 → ผลคูณมากกว่า' }], 'ดูก่อนว่ามีจำนวนใดเท่ากัน'),
     T('ลองทำเอง', 'ลองทำเอง', el => el.append(qSim(Q.k3Long({ a: 85, b: 37 }), 'ถูกต้อง!')))],
    () => [...k3N(4, () => { const [a, b] = k3TwoTwo(true); return Q.k3Long({ a, b }); }), ...k3N(2, () => Q.k3Cmp(k3CmpData()))]),
  L3K(8, 'ป่ากล่องปริศนา', 'การหาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์', 'ตัวไม่ทราบค่า', 'หาค่าของตัวไม่ทราบค่าในประโยคสัญลักษณ์แสดงการคูณ โดยใช้สูตรคูณและการลองแล้วตรวจ',
    [...learnStep('<b>ตัวไม่ทราบค่า</b> ในการคูณ', 'ตัวไม่ทราบค่าในการคูณ', [
      { fig: `<div class="fbig p4big">${p4uHTML('□ × 6 = 42')}</div>`, name: '□ แทนจำนวนที่ไม่รู้', text: 'จำนวนใดคูณ 6 แล้วได้ 42' },
      { fig: `<div class="fbig p4big">${p4uHTML('□ × 6 = 42', 7)}</div>`, name: 'นึกถึงสูตรคูณ', text: '7 × 6 = 42 → □ = 7' }], 'ได้คำตอบแล้ว คูณตรวจทุกครั้ง'),
     pexStep('ตัวอย่างทีละขั้น: 25 × □ = 300', 'ตัวอย่างทีละขั้น ยี่สิบห้าคูณกรอบเท่ากับสามร้อย', [['① ลอง 10', '25 × 10 = 250 ยังน้อยไป', `<div class="fbig p4big">${p4uHTML('25 × □ = 300')}</div>`], ['② ลอง 12', '25 × 12 = 300 พอดี', `<div class="fbig p4big">${p4uHTML('25 × □ = 300', 12)}</div>`]], '□ = <b>12</b>'),
     T('ลองเปลี่ยนค่า □ ให้ผลคูณพอดี', 'ลองเปลี่ยนค่ากรอบให้ผลคูณพอดี', el => el.append(simK3Unk([[8, 56, 0], [15, 180, 1], [400, 2800, 1]])))],
    () => k3N(6, () => Q.k3Unk(k3UnkData()))),
  L3K(9, 'ป่าโจทย์คูณ', 'โจทย์ปัญหาการคูณ', 'โจทย์ปัญหาการคูณ', 'วิเคราะห์โจทย์ปัญหาการคูณ เขียนประโยคสัญลักษณ์ และหาคำตอบ',
    [...learnStep('<b>โจทย์ปัญหาการคูณ</b>', 'โจทย์ปัญหาการคูณ', [
      { fig: mtGroupsSVG(4, 6, 'apple', { size: 16 }), name: 'กลุ่มละเท่า ๆ กัน', text: 'มีหลายกลุ่ม แต่ละกลุ่มเท่ากัน → ใช้การคูณ' },
      { fig: `<div class="f3-eq">… ละ … จำนวน …</div>`, name: 'คำที่บอกการคูณ', text: 'กล่องละ · วันละ · แถวละ · คนละ … จำนวน …' }], 'จำนวนต่อ 1 กลุ่ม × จำนวนกลุ่ม'),
     pexStep('ตัวอย่างทีละขั้น', 'ตัวอย่างทีละขั้น', [['โจทย์', 'ปลูกต้นไม้แถวละ 128 ต้น จำนวน 5 แถว ปลูกทั้งหมดกี่ต้น', mtGroupsSVG(5, 4, 'orange', { size: 14 })], ['① ประโยคสัญลักษณ์', '128 × 5 = □', null], ['② ตั้งคูณ', '128 × 5 = 640', k3mulFig(128, 5, '640')]], 'ปลูกทั้งหมด <b>640</b> ต้น'),
     T('ลองทำเอง', 'ลองทำเอง', p4story('ร้านขายน้ำผลไม้ได้วันละ 46 แก้ว เป็นเวลา 15 วัน ขายได้ทั้งหมดกี่แก้ว', mtGroupsSVG(3, 5, 'bottle', { size: 14 }), [{ q: 'เลือกประโยคสัญลักษณ์', opts: ['46 × 15', '46 + 15', '46 − 15'], right: '46 × 15', unit: 'แก้ว', why: 'วันละ … จำนวน … วัน → คูณ' }], 'ขายได้ทั้งหมด <b>690</b> แก้ว'))],
    () => [...pkF(K3_ST, 5).map(s => Q.k3Story(s)), Q.dPick({ q: 'ประโยคสัญลักษณ์ <b>34 × 8 = □</b> ตรงกับโจทย์ข้อใด', opts: shuffle(['มีกล่อง 8 กล่อง กล่องละ 34 ชิ้น มีกี่ชิ้น', 'มี 34 ชิ้น ซื้อเพิ่ม 8 ชิ้น มีกี่ชิ้น', 'มี 34 ชิ้น ให้เพื่อน 8 ชิ้น เหลือกี่ชิ้น']), right: 'มีกล่อง 8 กล่อง กล่องละ 34 ชิ้น มีกี่ชิ้น', hint: 'กลุ่มละเท่า ๆ กัน หลายกลุ่ม → คูณ' })])
];

/* ---------- boss ---------- */
const k3X = (q, opts, lv, fig) => ({ q, fig, opts, a: 0, lv });
const EXAM_P3C7 = d6spread([
  k3X('6 × 700 = ?', ['4,200', '420', '42,000', '4,270'], 1381),
  k3X('8,000 × 5 = ?', ['40,000', '4,000', '400,000', '8,005'], 1381),
  k3X('ข้อใดมีผลคูณเท่ากับ 2,700', ['9 × 300', '9 × 3,000', '3 × 90', '27 × 1,000'], 1381),
  k3X('231 × 3 = ?', ['693', '663', '963', '234'], 1382),
  k3X('ผลคูณของ 4 กับ 212 คือข้อใด', ['848', '842', '216', '884'], 1382),
  k3X('769 × 8 = ?', ['6,152', '5,652', '6,052', '6,252'], 1383),
  k3X('5 × 308 = ?', ['1,540', '1,500', '154', '1,580'], 1383),
  k3X('4,256 × 7 = ?', ['29,792', '28,792', '29,742', '29,392'], 1384),
  k3X('9 × 3,105 = ?', ['27,945', '27,905', '28,945', '2,795'], 1384),
  k3X('63 × 40 = ?', ['2,520', '252', '25,200', '2,430'], 1385),
  k3X('ข้อใดผลคูณ<b>มากที่สุด</b>', ['85 × 90', '85 × 80', '58 × 90', '80 × 85'], 1385),
  k3X('34 × 21 = ?', ['714', '704', '612', '734'], 1386),
  k3X('ผลคูณของ 52 กับ 13 คือข้อใด', ['676', '666', '520', '686'], 1386),
  k3X('87 × 64 = ?', ['5,568', '5,468', '5,578', '4,568'], 1387),
  k3X('เติมเครื่องหมาย: 7 × 4,836 ☐ 4,836 × 9', ['<', '>', '='], 1387),
  k3X('□ × 9 = 72 จำนวนที่แทน □ คือข้อใด', ['8', '7', '9', '63'], 1388),
  k3X('36 × □ = 540 จำนวนที่แทน □ คือข้อใด', ['15', '14', '16', '504'], 1388),
  k3X('แม่ซื้อไข่ 6 แผง แผงละ 30 ฟอง แม่ซื้อไข่ทั้งหมดกี่ฟอง', ['180 ฟอง', '36 ฟอง', '24 ฟอง', '150 ฟอง'], 1389),
  k3X('โรงเรียนจัดรถ 14 คัน คันละ 45 คน พานักเรียนไปได้ทั้งหมดกี่คน', ['630 คน', '59 คน', '520 คน', '610 คน'], 1389),
  k3X('ขายเสื้อตัวละ 265 บาท ได้ 9 ตัว ได้เงินทั้งหมดกี่บาท', ['2,385 บาท', '274 บาท', '1,855 บาท', '2,365 บาท'], 1389)]);
LESSONS_P3C7.push({ id: 1399, boss: true, place: 'ป่าคูณยักษ์', title: 'ด่านบอส: ป.3 บทที่ 7 การคูณ', short: 'ด่านบอส · ข้อสอบ', tone: 'orange',
  goal: 'คำถามท้ายบท 20 ข้อ (คูณด้วยหลักร้อย หลักพัน · ตั้งคูณ · สองหลักคูณสองหลัก · ตัวไม่ทราบค่า · โจทย์ปัญหา) ตอบถูก 10 ข้อขึ้นไปเพื่อชนะบอส',
  exam: EXAM_P3C7, pass: 10, bossName: 'งูยักษ์ทวีคูณ', bossPal: 'orange', emblem: '×', bossKind: 'snake',
  winLine: 'ชนะงูยักษ์ทวีคูณแล้ว! คูณเก่งมาก', loseLine: 'งูยักษ์ทวีคูณยังไม่ยอมแพ้ กลับไปทวนแล้วสู้ใหม่นะ!' });
