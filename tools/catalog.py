#!/usr/bin/env python3
"""Write docs/QUESTION-TYPES.md: every question type Q.<name> with its parameters and the file it lives in.

    python3 tools/catalog.py

Question types are added with  Object.assign(Q, { name({ params }) { … } })  or  Q.name = (…) => …
Run this after adding or renaming a question type so the catalogue stays current.
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
files = [l.strip() for l in (SRC / 'order.txt').read_text(encoding='utf-8').splitlines() if l.strip() and not l.startswith('#')]
rows, seen = [], set()
for f in files:
    lines = (SRC / f).read_text(encoding='utf-8').splitlines()
    depth, in_assign = 0, False
    for n, line in enumerate(lines, 1):
        if re.match(r'\s*Object\.assign\(Q,\s*\{', line):
            in_assign, depth = True, 0
        if in_assign:
            m = re.match(r'^  ([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{', line)  # method at the object's top level
            if m:
                name, params = m.group(1), m.group(2).strip()
                if name not in seen:
                    seen.add(name); rows.append((name, params, f, n))
            depth += line.count('{') - line.count('}')
            if depth <= 0 and '});' in line:
                in_assign = False
        m = re.match(r'^Q\.([A-Za-z_$][\w$]*)\s*=\s*(?:function\s*)?\(?([^)=]*)\)?\s*=?>?', line)
        if m and m.group(1) not in seen:
            seen.add(m.group(1)); rows.append((m.group(1), m.group(2).strip(), f, n))
rows.sort(key=lambda r: r[0].lower())
out = ['# ชนิดคำถาม (Question types)', '',
       'สร้างอัตโนมัติด้วย `python3 tools/catalog.py` — อย่าแก้ไฟล์นี้ด้วยมือ (generated; do not edit by hand).', '',
       'ทุกชนิดคืนค่าเป็น object คำถาม `{ prompt, say, mount(bd, ctx) … }` ใช้ในฟังก์ชัน `game` ของด่าน · ก่อนสร้างชนิดใหม่ ให้หาในตารางนี้ก่อนว่ามีของเดิมใช้ได้ไหม', '',
       f'{len(rows)} types', '', '| ชนิด | พารามิเตอร์ | ไฟล์ |', '|---|---|---|']
for name, params, f, n in rows:
    p = re.sub(r'\s+', ' ', params).replace('|', '\\|')
    out.append(f'| `Q.{name}` | `{p[:110]}` | [`{f}:{n}`](../src/{f}#L{n}) |' if p else f'| `Q.{name}` | | [`{f}:{n}`](../src/{f}#L{n}) |')
(ROOT / 'docs' / 'QUESTION-TYPES.md').write_text('\n'.join(out) + '\n', encoding='utf-8')
print(f'{len(rows)} question types → docs/QUESTION-TYPES.md')
