# ผจญภัยไปกับ The Ascent

เกมคณิตศาสตร์ ป.1–ป.6 ของ The Ascent — เด็กเรียนโดยลงมือทำ (ลาก แตะ ปรับ ทดลอง) ไม่ใช่แค่อ่านแล้วตอบ
ทุกชั้นเป็น "โลก" ของตัวเอง (ป.1 เมืองตัวเลข · ป.2 ชายหาด · ป.3 ป่าดิบชื้น · ป.4 ทะเลทราย · ป.5 ถ้ำ · ป.6 ภูเขา)
แต่ละบทเป็น "เมือง" ที่มีหลายด่าน และแต่ละด่านมี **บทเรียน** (หน้าสอนทีละขั้น) ตามด้วย **เกมผ่านด่าน** (8 ข้อขึ้นไป)

ผลลัพธ์คือ **ไฟล์ HTML ไฟล์เดียว** [`ผจญภัยไปกับ The Ascent.html`](ผจญภัยไปกับ%20The%20Ascent.html) เปิดในเบราว์เซอร์ได้เลย ไม่ต้องมีเซิร์ฟเวอร์
(ออกแบบสำหรับไอแพดแนวนอน 1180×820 เป็นหลัก)

> **อย่าแก้ไฟล์ HTML ที่ root และไม่ต้อง commit มัน** — GitHub Actions สร้างใหม่จาก `src/` ให้อัตโนมัติทุกครั้งที่ merge เข้า `main`
> ตอนพัฒนาให้ build ไปที่ `dist/index.html` (ไม่ถูก commit)

## เริ่มต้น (Quick start)

ต้องมี Python 3.9+ และ Node.js 18+

```bash
git clone https://github.com/ndansatjaruk-teacher/gogo && cd gogo
python3 tools/build.py --check      # สร้าง dist/index.html + ตรวจ syntax ทุกไฟล์
open dist/index.html                # (Windows: start dist\index.html · Linux: xdg-open)
```

ทดสอบ (ครั้งแรกติดตั้ง Playwright ก่อน):

```bash
pip install playwright && python3 -m playwright install chromium
python3 tests/smoke.py --grade 5             # เปิดทุกหน้าบทเรียนและทุกข้อในเกมของ ป.5 — ต้องไม่มี error
python3 tests/smoke.py                       # ทุกชั้น (~4 นาที)
python3 tests/range.py --grade 2             # ตัวเลขในโจทย์เกินหลักสูตรของชั้นไหม (ป.1–ป.3)
python3 tests/construction/edge_cases.py     # กระดานสร้างรูป ป.5 (ไม้บรรทัด/โปรแทรกเตอร์/วงเวียน)
python3 tests/audit.py --grade 5             # เล่นจริงทุกข้อแบบนักเรียน: ตอบถูกได้ไหม · พอดีจอไหม · ปุ่ม “ถัดไป” ปลดล็อกได้ไหม · เกมครบ 8 ข้อไหม (ช้า ~25 นาที/ชั้น)
```

## โครงสร้าง

```
src/
  order.txt         ลำดับไฟล์ที่นำมาต่อกัน (ไฟล์ใหม่ต้องเพิ่มที่นี่)
  style.css         สไตล์ทั้งหมด
  engine/           ของกลางที่ทุกชั้นใช้: h(), เสียง, ภาพวาด, ส่วนประกอบหน้าจอ, ชนิดคำถาม Q.*
  grades/p2 … p6/   เนื้อหาแต่ละชั้น — 1 ไฟล์ ≈ 1 บท (เช่น grades/p5/p5q.js = ป.5 บทที่ 7 รูปสี่เหลี่ยม)
  app/              ด่าน ป.1 + ทะเบียนเมือง (lessons.js), หน้าจอหลัก/บทเรียน/เกม (app.js) ฯลฯ
tools/
  build.py          รวม src/ → dist/index.html  (--check = ตรวจ syntax ด้วย Node · --publish = ไฟล์ที่ root)
  catalog.py        สร้าง docs/QUESTION-TYPES.md ใหม่
tests/              smoke.py (ทุกด่าน ไม่มี error) · range.py (ตัวเลขเกินหลักสูตร ป.1–ป.3) · audit.py (เล่นจริงแบบนักเรียน) · construction/ (กระดานสร้างรูป ป.5)
docs/
  ADDING-A-LESSON.md  วิธีเพิ่มด่าน/บทใหม่ ← เริ่มอ่านที่นี่
  FILES.md            แผนที่ไฟล์ทุกไฟล์
  QUESTION-TYPES.md   ชนิดคำถามทั้งหมด (377 ชนิด) พร้อมพารามิเตอร์
  ARCHITECTURE.md     รายละเอียดเชิงลึกและประวัติการเปลี่ยนแปลงทุกเวอร์ชัน (ยาว — ใช้ค้นหา)
```

**สำคัญ:** ทุกไฟล์ใน `src/` ใช้ตัวแปร global ร่วมกัน (ไม่ใช้ import/export) ไฟล์หนึ่งใช้ของจากไฟล์ที่อยู่ **ก่อนหน้า** ใน `order.txt` ได้เท่านั้น
และห้ามประกาศชื่อ top-level ซ้ำกับไฟล์อื่น — `tools/build.py --check` จะบอกถ้าชน

## ร่วมพัฒนา

อ่าน [CONTRIBUTING.md](CONTRIBUTING.md) — ขั้นตอนทำงาน กฎการสอน/เนื้อหา/แบรนด์ที่ทุกด่านต้องทำตาม และข้อควรระวังในโค้ด
