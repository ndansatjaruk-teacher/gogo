# แผนที่ไฟล์ (File map)

ไฟล์ทั้งหมดถูกต่อกันตามลำดับใน [`src/order.txt`](../src/order.txt) แล้วใส่ใน `<script>` เดียว — ทุกไฟล์ใช้ global scope ร่วมกัน
(All files are concatenated in `src/order.txt` order into one script and share one global scope.)

| ไฟล์ | ขนาด | เนื้อหา |
|---|---|---|
| `src/engine/zoomfix.js` | 3 KB | (v218) ไฟล์แรกที่โหลด: ตรวจว่าเบราว์เซอร์คืน getBoundingClientRect/getScreenCTM ใต้ CSS zoom แบบเก่า (Safari Mac, Chrome เก่า) ไหม ถ้าใช่ ปรับค่าให้ตรงเมาส์ · `zfScale(el)` แปลงระยะเมาส์ → px ของ style |
| `src/engine/core.js` | 11 KB | ตัวช่วยพื้นฐาน: h() สร้าง element, เสียง say()/sfx, SET/SAVE (ค่าตั้ง/ความคืบหน้า) |
| `src/engine/art.js` | 107 KB | ภาพวาด SVG ตัวละคร สิ่งของ ฉาก |
| `src/engine/jungle.js` | 7 KB | ป่าดิบชื้น (ป.3) — rainforest pieces: giant buttress trees, vines, a river, walking / flying animals, insects |
| `src/engine/life.js` | 15 KB | LIFE LAYER — things that move in every world's background and on every map |
| `src/engine/river.js` | 12 KB | โลกแม่น้ำ (ม.1): scenery ริมน้ำ ฉากหลัง สิ่งเคลื่อนไหว บอสจระเข้ |
| `src/engine/ink.js` | 28 KB | กระดานเขียนด้วยนิ้ว/ปากกา |
| `src/engine/components.js` | 101 KB | ส่วนประกอบหน้าจอที่ใช้ซ้ำ: แป้นตัวเลข กระดาน การ์ด ฯลฯ |
| `src/engine/questions.js` | 165 KB | ชนิดคำถามพื้นฐาน Q.* ที่ทุกชั้นใช้ |
| `src/engine/colw.js` | 23 KB | v111 (ผู้ใช้ขอ): ทุกเรื่องที่ "ตั้งบวก ตั้งลบ ตั้งคูณ" ใช้กระดานเดียวกับ ป.4 ทศนิยม ด่าน 7 |
| `src/engine/ix.js` | 17 KB | INTERACTIVE KIT — shared hands-on question types used by every grade |
| `src/grades/p5/p5.js` | 118 KB | GRADE 5 · CHAPTER 1 — เศษส่วน (ถ้ำ · บอสหมี) |
| `src/grades/p5/p5d.js` | 108 KB | ป.5 บทที่ 2 ทศนิยม — decimal helpers, answer pad, question types (d…), |
| `src/engine/learnkit.js` | 12 KB | รู้จักก่อน — learn-card kit (loaded early so every chapter file can build ① รู้จัก steps). Reorder of old less |
| `src/grades/p5/p5c.js` | 88 KB | ป.5 บทที่ 3 การนำเสนอข้อมูล — bar charts (with broken scale), double bar charts, line graphs: |
| `src/grades/p5/p5r.js` | 59 KB | ป.5 บทที่ 4 บัญญัติไตรยางศ์ (ภาคเรียนที่ 2) — interactive rate sims, |
| `src/grades/p5/p5p.js` | 66 KB | ป.5 บทที่ 5 ร้อยละ (ภาคเรียนที่ 2) — percent sims (hundred grid, percent-of bar, |
| `src/grades/p5/p5g.js` | 64 KB | ป.5 บทที่ 6 เส้นขนาน (ภาคเรียนที่ 2) — geometry figure engine (lines, transversal, 8 angles), |
| `src/grades/p6/p6h.js` | 97 KB | ป.6 บทที่ 1 ห.ร.ม. และ ค.ร.น. — number engine (factors, primes, HCF/LCM), |
| `src/grades/p6/p6f.js` | 55 KB | ป.6 บทที่ 2 เศษส่วน — compare / order with the LCM, + − of fractions and mixed numbers, |
| `src/grades/p6/p6d.js` | 48 KB | ป.6 บทที่ 3 ทศนิยม — fraction → decimal, decimal ÷ decimal (fraction relationship and |
| `src/grades/p6/p6p.js` | 70 KB | ป.6 บทที่ 4 ร้อยละและอัตราส่วน — percent (fraction / rule of three / buying-selling / 3-step), |
| `src/grades/p6/p6s.js` | 33 KB | ป.6 บทที่ 5 แบบรูป — number sequences (+, −, varying differences, × ÷), picture patterns, |
| `src/grades/p6/p6t.js` | 89 KB | ป.6 บทที่ 6 รูปสามเหลี่ยม (ภาคเรียนที่ 2) — triangle engine (draggable, angles, sides, heights), |
| `src/grades/p6/p6k.js` | 85 KB | ป.6 บทที่ 7 รูปหลายเหลี่ยม (ภาคเรียนที่ 2) — polygon engine (draggable, interior angles incl. reflex), |
| `src/grades/p6/p6o.js` | 74 KB | ป.6 บทที่ 8 วงกลม (ภาคเรียนที่ 2) — circle parts, naming, compass construction, π (rolling wheel), |
| `src/grades/p6/p6m.js` | 111 KB | ป.6 บทที่ 9 รูปเรขาคณิตสามมิติ (ภาคเรียนที่ 2) — tiny 3D engine (rotate by dragging), solids, |
| `src/grades/p6/p6q.js` | 53 KB | ป.6 บทที่ 10 การนำเสนอข้อมูล (แผนภูมิรูปวงกลม) — pie engine, drag-to-build pie, parts, reading %, |
| `src/grades/p5/p5q.js` | 184 KB | ป.5 บทที่ 7 รูปสี่เหลี่ยม (ภาคเรียนที่ 2) — quadrilateral classifier (drag the corners), diagonals, |
| `src/grades/p5/p5v.js` | 67 KB | ป.5 บทที่ 8 ปริมาตรและความจุ (ภาคเรียนที่ 2) — 2D vs 3D, prisms, cuboids (rotate), isometric drawing, |
| `src/grades/p4/p4n.js` | 58 KB | GRADE 4 · CHAPTER 1 — จำนวนนับที่มากกว่า 100,000 (ทะเลทราย) |
| `src/grades/p4/p4b.js` | 78 KB | GRADE 4 · CHAPTER 2 — การบวกและการลบจำนวนนับที่มากกว่า 100,000 (ทะเลทราย) |
| `src/grades/p4/p4m.js` | 81 KB | GRADE 4 · CHAPTER 3 — การคูณและการหารจำนวนนับ (ทะเลทราย) |
| `src/grades/p4/p4o.js` | 61 KB | GRADE 4 · CHAPTER 4 — การบวก ลบ คูณ หารจำนวนนับ (ระคน · โจทย์ 2 ขั้นตอน · ค่าเฉลี่ย) (ทะเลทราย) |
| `src/grades/p2/p2b.js` | 41 KB | GRADE 2 · CHAPTER 2 — การบวกและการลบจำนวนนับไม่เกิน 1,000 (ชายหาด) |
| `src/grades/p2/p2l.js` | 93 KB | GRADE 2 · CHAPTER 3 — การวัดความยาว (ชายหาด · เมือง 41 · ด่าน 81–88 · บอส 99) |
| `src/grades/p2/p2g.js` | 46 KB | GRADE 2 · CHAPTER 9 — รูปเรขาคณิต (ชายหาด · ภาคเรียนที่ 2 · เมือง 42 · ด่าน 1001–1005 · บอส 1019) |
| `src/grades/p2/p2m.js` | 32 KB | GRADE 2 · CHAPTER 10 — การบวก ลบ คูณ หารระคน (ชายหาด · ภาคเรียนที่ 2 · เมือง 43 · ด่าน 1021–1025 · บอส 1039) |
| `src/grades/p2/p2c.js` | 28 KB | GRADE 2 · CHAPTER 11 — แผนภูมิรูปภาพ (ชายหาด · ภาคเรียนที่ 2 · เมือง 44 · ด่าน 1041–1043 · บอส 1059) |
| `src/grades/p2/p2v.js` | 72 KB | GRADE 2 · CHAPTER 8 — การวัดปริมาตร (ชายหาด · ภาคเรียนที่ 2 · เมือง 45 · ด่าน 981–989 · บอส 999) |
| `src/grades/p2/p2w.js` | 71 KB | GRADE 2 · CHAPTER 4 — การวัดน้ำหนัก (ชายหาด · ภาคเรียนที่ 1 · เมือง 46 · ด่าน 901–910 · บอส 919) |
| `src/grades/p2/p2x.js` | 66 KB | GRADE 2 · CHAPTER 5 — การคูณ (ชายหาด · ภาคเรียนที่ 1 · เมือง 47 · ด่าน 921–932 · ด่านพิเศษ 938 · บอส 939) |
| `src/grades/p2/p2d.js` | 61 KB | GRADE 2 · CHAPTER 6 — การหาร (ชายหาด · ภาคเรียนที่ 2 · เมือง 48 · ด่าน 941–952 · บอส 959) |
| `src/grades/p2/p2t.js` | 70 KB | GRADE 2 · CHAPTER 7 — เวลา (ชายหาด · ภาคเรียนที่ 2 · เมือง 49 · ด่าน 961–969 · บอส 979) |
| `src/grades/p3/p3b.js` | 30 KB | GRADE 3 · CHAPTER 2 — การบวกและการลบจำนวนนับไม่เกิน 100,000 (ป่าดิบชื้น · เมือง 50 · ด่าน 111–118 · บอส 129) |
| `src/grades/p3/p3w.js` | 61 KB | GRADE 3 · CHAPTER 10 — การวัดน้ำหนัก (ป่าดิบชื้น · ภาคเรียนที่ 2 · เมือง 52 · ด่าน 1241–1252 · บอส 1259) |
| `src/grades/p3/p3v.js` | 59 KB | GRADE 3 · CHAPTER 11 — การวัดปริมาตร (ป่าดิบชื้น · ภาคเรียนที่ 2 · เมือง 53 · ด่าน 1261–1270 · บอส 1279) |
| `src/grades/p3/p3m.js` | 55 KB | GRADE 3 · CHAPTER 12 — เงินและบันทึกรายรับรายจ่าย (ป่าดิบชื้น · ภาคเรียนที่ 2 · เมือง 54 · ด่าน 1281–1291 · บอ |
| `src/grades/p3/p3x.js` | 43 KB | GRADE 3 · CHAPTER 13 — การบวก ลบ คูณ หารระคน (ป่าดิบชื้น · ภาคเรียนที่ 2 · เมือง 55 · ด่าน 1401–1406 · บอส 141 |
| `src/grades/p3/p3l.js` | 66 KB | GRADE 3 · CHAPTER 9 — การวัดความยาว (ป่าดิบชื้น · ภาคเรียนที่ 2 · เมือง 56 · ด่าน 1321–1331 · บอส 1339) |
| `src/grades/p3/p3d.js` | 40 KB | GRADE 3 · CHAPTER 8 — การหาร (ป่าดิบชื้น · ภาคเรียนที่ 2 · เมือง 57 · ด่าน 1301–1309 · บอส 1319) |
| `src/grades/p3/p3t.js` | 63 KB | GRADE 3 · CHAPTER 3 — เวลา (ป่าดิบชื้น · ภาคเรียนที่ 1 · เมือง 58 · ด่าน 1201–1211 · บอส 1219) |
| `src/grades/p3/p3s.js` | 64 KB | GRADE 3 · CHAPTER 4 — รูปเรขาคณิต (แกนสมมาตร) (ป่าดิบชื้น · ภาคเรียนที่ 1 · เมือง 59 · ด่าน 1221–1224 · บอส 12 |
| `src/grades/p3/p3c.js` | 52 KB | GRADE 3 · CHAPTER 5 — แผนภูมิรูปภาพและตารางทางเดียว (ป่าดิบชื้น · ภาคเรียนที่ 1 · เมือง 60 · ด่าน 1341–1345 ·  |
| `src/grades/p3/p3f.js` | 55 KB | GRADE 3 · CHAPTER 6 — เศษส่วน (ป่าดิบชื้น · ภาคเรียนที่ 1 · เมือง 61 · ด่าน 1361–1370 · บอส 1379) |
| `src/grades/p3/p3k.js` | 40 KB | children DO the multiplication themselves: |
| `src/grades/p4/p4t.js` | 64 KB | units live in FAMILIES so every conversion is exact (P4 conventions: 1 เดือน = 30 วัน · 1 ปี = 12 เดือน = 52 ส |
| `src/grades/p4/p4f.js` | 67 KB | reuses: P3 fraction pictures (p3f: f3Fig f3ShadeEl f3Input f3W f3T) and the P5 fraction kit (p5: FR Rr fracBar |
| `src/grades/p4/p4e.js` | 73 KB | reuses the P5 decimal kit (p5d: decSquares pvChart decAnswer simDecGrid Q.dCmp/dCalc/dStory · exprEval exact)  |
| `src/grades/p4/p4a.js` | 102 KB | prefix a4 · angles in degrees, counter-clockwise from → (screen y goes down, so a4P flips sin) |
| `src/grades/p4/p4r.js` | 132 KB | prefix r4 · ผู้ใช้ขอ "ให้เกมสนุก เพิ่มเกมใหม่ ๆ" → mini-games that are played, not just answered: |
| `src/grades/p4/p4g.js` | 55 KB | prefix g4 · reuses the P5 chart kit (p5c: chartSVG/dataChart/chartBuilder/gTable/simReadBar/simBuild/gWalk · Q |
| `src/grades/m1/m1i.js` | 40 KB | ม.1 บทที่ 1 จำนวนเต็ม (โลกแม่น้ำ · เมือง 90 · ด่าน 2001–2015 · บอส 2019) — ชุดเครื่องมือจำนวนเต็ม (แป้นมีเครื่องหมายลบ เส้นจำนวน ชิปคู่ศูนย์) |
| `src/app/lessons.js` | 477 KB | ด่าน ป.1 + ทะเบียนเมืองทั้งหมด (CITIES, GRADES, LESSONS) |
| `src/app/learn.js` | 50 KB | หน้า “รู้จักก่อน” |
| `src/app/wpic.js` | 9 KB | รูปประกอบตัวอย่างทีละขั้น |
| `src/app/xteach.js` | 21 KB | แยกหัวข้อย่อยออกเป็นหน้าใหม่ |
| `src/app/xtra.js` | 85 KB | โจทย์เกมเพิ่มเติมท้ายแต่ละเรื่อง |
| `src/app/app.js` | 171 KB | หน้าจอหลัก แผนที่ หน้าบทเรียน (startTeach) หน้าเกม (startGame, gameSet) ด่านบอส |
| `src/style.css` | 318 KB | สไตล์ทั้งหมด (design tokens อยู่ต้นไฟล์ · ส่วนท้ายเป็นบล็อกที่เพิ่มตามเวอร์ชัน) |

ไฟล์ของแต่ละชั้นตั้งชื่อ `p<ชั้น><ตัวอักษรเรื่อง>.js` เช่น `p5q.js` = ป.5 รูปสี่เหลี่ยม · ชื่อฟังก์ชัน/ค่าคงที่ในไฟล์มักขึ้นต้นด้วย prefix ของไฟล์ (เช่น `q5…`, `cns…`) เพื่อไม่ให้ชนกับไฟล์อื่น
