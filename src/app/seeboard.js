/* =========================================================
   v271 (ผู้ใช้ขอ): หน้า "ดูภาพ" ทุกบท → กระดานแบบครูสอน (เหมือน ม.1 ลำน้ำทศนิยม v269–v270) · prefix sb
   หน้าดูภาพเดิม (a4dSee / g5dSee / r4dSee → r4vSee) ให้แตะรูปทีละรูปแล้วผ่านไปได้เลย เด็กไม่สนใจ
   ตอนนี้: รูปละ 1 หน้า (ประเด็นเดียวเต็มหน้า) เล่นบนกระดาน d1dBoardDo (m1dd.js): ปากกาวาดรูปตั้งต้น + บอกว่าจะดูอะไร
   → วาดส่วนที่เดิมขึ้นหลังแตะ (ส่วนต่างของ f(true) จาก f(false)) + คำอธิบายบรรทัดแรก → คำอธิบายบรรทัดถัด ๆ ไป → ★ สรุป
   เล่นเองทีละขั้น หรือแตะหน้าจอ / Space / → ไปทีละขั้นเองได้ · ครบแล้วปุ่มถัดไปจึงเปิด
   หน้าที่ถูกทำเครื่องหมายไว้ด้วย sbMark ถูกแตกเป็นหน้ากระดานหลังจากทุกบทสร้างหน้าสอนเสร็จ (LESSONS พร้อมแล้ว)
   ========================================================= */
/* v272 (ผู้ใช้ขอ: หน้าแรก → หน้าที่สองวาดรูปใหม่ทั้งรูป ไม่จำเป็น): เทียบรูปก่อน/หลังทีละชิ้น (ชิ้น = element ที่ไม่มีลูก หรือ text พร้อมกลุ่มที่ครอบอยู่)
   ชิ้นที่มีอยู่แล้วไม่วาดซ้ำ · ชิ้นใหม่วาดเพิ่ม (คงกลุ่ม/transform ที่ครอบไว้) · ชิ้นที่หายไปส่ง key ให้กระดานค่อย ๆ ซ่อน */
const SBNS = 'http://www.w3.org/2000/svg';
const sbParse = s => { const g = document.createElementNS(SBNS, 'g'); g.innerHTML = s; return g; };
const sbLeaf = e => e.tagName.toLowerCase() === 'text' || !e.children.length;
function sbKeys(root) { const out = [], walk = (e, path) => [...e.children].forEach(c => { if (sbLeaf(c)) out.push([c, path + '>' + c.outerHTML]); else walk(c, path + '<' + c.tagName + ' ' + [...c.attributes].map(a => a.name + '=' + a.value).sort().join(' ') + '>'); }); walk(root, ''); return out; }
function sbDiff(b0, b1) { const A = sbParse(b0), B = sbParse(b1), cnt = {}, isNew = new Set(), gone = [];
  sbKeys(A).forEach(([, k]) => { cnt[k] = (cnt[k] || 0) + 1; }); sbKeys(B).forEach(([e, k]) => { if (cnt[k] > 0) cnt[k]--; else isNew.add(e); });
  Object.entries(cnt).forEach(([k, n]) => { for (let i = 0; i < n; i++) gone.push(k); });
  const keep = e => { if (sbLeaf(e)) return isNew.has(e); let any = false; [...e.children].forEach(c => { if (keep(c)) any = true; else c.remove(); }); return any; };
  [...B.children].forEach(c => { if (!keep(c)) c.remove(); }); return { ink: B.innerHTML.trim(), gone }; }
function sbPages(sp) { const list = sp.list(), n = list.length, strip = t => String(t || '').replace(/<[^>]+>/g, '').trim();
  const capRest = String(sp.cap || '').replace(/^\s*<b>\s*แตะ[^<]*<\/b>\s*[—–-]?\s*/, '').replace(/^\s*แตะ\S*\s*[—–-]?\s*/, '').trim();
  return list.map((p, i) => { const title = n > 1 && strip(p.t) ? `${sp.title} — ${strip(p.t)}` : sp.title;
    return T(`<b>ดูภาพ</b> — ${title}`, `ดูภาพ ${r4dTxt(title)}`, el => { const W = p.W || 240, H = p.H || 170, b0 = p.f(false), b1 = p.f(true), lines = String(p.s || '').split(/<br\s*\/?>/).map(x => x.trim()).filter(Boolean);
      const intro = (strip(p.t) ? `<b>${p.t}</b>` : '') + (capRest ? (strip(p.t) ? ' — ' : '') + capRest : ''), beats = [{ ink: b0, t: intro || title }];
      const D = sbDiff(b0, b1); beats.push({ ink: D.ink, hide: D.gone, t: lines[0] || '' }); /* v272: ใช้รูปเดิมต่อ วาดเพิ่มเฉพาะส่วนใหม่ ส่วนที่ไม่มีแล้วค่อย ๆ หายไป */
      lines.slice(1).forEach(l => beats.push({ t: l }));
      el.append(d1dBoardDo({ W, H, fig: '', beats: beats.filter(b => b.ink || b.t), fin: lines.join(' ') })); }); }); }
LESSONS.forEach(L => { if (Array.isArray(L.teach) && L.teach.some(p => p && p.__see)) L.teach = L.teach.flatMap(p => p && p.__see ? sbPages(p.__see) : [p]); });
