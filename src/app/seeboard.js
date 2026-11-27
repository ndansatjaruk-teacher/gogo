/* =========================================================
   v271 (ผู้ใช้ขอ): หน้า "ดูภาพ" ทุกบท → กระดานแบบครูสอน (เหมือน ม.1 ลำน้ำทศนิยม v269–v270) · prefix sb
   หน้าดูภาพเดิม (a4dSee / g5dSee / r4dSee → r4vSee) ให้แตะรูปทีละรูปแล้วผ่านไปได้เลย เด็กไม่สนใจ
   ตอนนี้: รูปละ 1 หน้า (ประเด็นเดียวเต็มหน้า) เล่นบนกระดาน d1dBoardDo (m1dd.js): ปากกาวาดรูปตั้งต้น + บอกว่าจะดูอะไร
   → วาดส่วนที่เดิมขึ้นหลังแตะ (ส่วนต่างของ f(true) จาก f(false)) + คำอธิบายบรรทัดแรก → คำอธิบายบรรทัดถัด ๆ ไป → ★ สรุป
   เล่นเองทีละขั้น หรือแตะหน้าจอ / Space / → ไปทีละขั้นเองได้ · ครบแล้วปุ่มถัดไปจึงเปิด
   หน้าที่ถูกทำเครื่องหมายไว้ด้วย sbMark ถูกแตกเป็นหน้ากระดานหลังจากทุกบทสร้างหน้าสอนเสร็จ (LESSONS พร้อมแล้ว)
   ========================================================= */
function sbPages(sp) { const list = sp.list(), n = list.length, strip = t => String(t || '').replace(/<[^>]+>/g, '').trim();
  const capRest = String(sp.cap || '').replace(/^\s*<b>\s*แตะ[^<]*<\/b>\s*[—–-]?\s*/, '').replace(/^\s*แตะ\S*\s*[—–-]?\s*/, '').trim();
  return list.map((p, i) => { const title = n > 1 && strip(p.t) ? `${sp.title} — ${strip(p.t)}` : sp.title;
    return T(`<b>ดูภาพ</b> — ${title}`, `ดูภาพ ${r4dTxt(title)}`, el => { const W = p.W || 240, H = p.H || 170, b0 = p.f(false), b1 = p.f(true), lines = String(p.s || '').split(/<br\s*\/?>/).map(x => x.trim()).filter(Boolean);
      const intro = (strip(p.t) ? `<b>${p.t}</b>` : '') + (capRest ? (strip(p.t) ? ' — ' : '') + capRest : ''), beats = [{ ink: b0, t: intro || title }];
      if (b1.startsWith(b0)) { const ov = b1.slice(b0.length); beats.push(ov.trim() ? { ink: ov, t: lines[0] || '' } : { t: lines[0] || '' }); }
      else beats.push({ ink: b1, t: lines[0] || '', clear: 1 }); /* รูปหลังแตะวาดใหม่ทั้งรูป: ลบรูปเดิมออกก่อน */
      lines.slice(1).forEach(l => beats.push({ t: l }));
      el.append(d1dBoardDo({ W, H, fig: '', beats: beats.filter(b => b.ink || b.t), fin: lines.join(' ') })); }); }); }
LESSONS.forEach(L => { if (Array.isArray(L.teach) && L.teach.some(p => p && p.__see)) L.teach = L.teach.flatMap(p => p && p.__see ? sbPages(p.__see) : [p]); });
