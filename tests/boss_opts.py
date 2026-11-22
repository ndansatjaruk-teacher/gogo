#!/usr/bin/env python3
"""Choice check for every boss exam (chapter bosses, term exams, grand bosses).

    python3 tools/build.py && python3 tests/boss_opts.py

Fails when an item has fewer than 3 choices, two identical choices, or an answer index outside the choices.
Also lists (as a warning, not a failure) wrong choices that belong to another kind of measure than the question
and its answer — e.g. a weight unit in a length question — because a child can rule those out without thinking.
Wrong choices should come from mistakes children really make (v199). CHROME=/path/to/chrome uses that browser.
"""
import os, pathlib, re, sys
from playwright.sync_api import sync_playwright

HTML = pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html'
DOM = {'ความยาว': r'เมตร|เซนติเมตร|มิลลิเมตร|กิโลเมตร|ซม\.|ไม้บรรทัด|ไม้เมตร|สายวัด',
       'น้ำหนัก': r'กิโลกรัม|กรัม|ขีด|ตาชั่ง|เครื่องชั่ง',
       'ปริมาตร': r'ลิตร|มิลลิลิตร|ถ้วยตวง|ช้อนตวง|กระบอกตวง'}
# a different measure is the point of these questions (wrong unit on purpose, or a story about sport / money)
ALLOW = ('ถ้าได้เหรียญจากว่ายน้ำ', 'กีฬาที่ได้รับเหรียญรางวัล', 'ขันใส่น้ำได้เต็มที่', '“ป้าซื้อปลา 4 ตัว', 'โจทย์ข้อใดใช้บัญญัติไตรยางศ์', 'นม 1 กล่อง ควรวัดปริมาตร')

def doms(s): return {k for k, p in DOM.items() if re.search(p, s)}

def main():
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None); pg = b.new_page()
        pg.goto(HTML.as_uri()); pg.wait_for_timeout(600)
        data = pg.evaluate("""(() => { const T = o => typeof o === 'string' ? o : (o.v || o.say || '') + (o.html ? ' #' + o.html.length + ':' + o.html.slice(-60) : o.v || o.say ? '' : JSON.stringify(o)); const strip = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim();
          return LESSONS.filter(L => L.boss).map(L => { const ex = L.examGen ? [...(L.examAll || L.exam), ...L.examGen()] : (L.examAll || L.exam);
            return { id: L.id, items: ex.map(q => ({ q: strip(q.q), opts: q.opts.map(T), a: q.a })) }; }); })()""")
        b.close()
    errs, warns, n = [], [], 0
    for L in data:
        for i, q in enumerate(L['items']):
            n += 1; o, tag = q['opts'], f"บอส {L['id']} ข้อ {i + 1} ({q['q'][:40]})"
            if len(o) < 3: errs.append(f'{tag}: มีตัวเลือกแค่ {len(o)} ตัว')
            if len(set(o)) != len(o): errs.append(f'{tag}: ตัวเลือกซ้ำ {o}')
            if not 0 <= q['a'] < len(o): errs.append(f'{tag}: a ผิด'); continue
            if q['q'].startswith(ALLOW): continue
            base = doms(q['q']) | doms(o[q['a']])
            for k, x in enumerate(o):
                extra = doms(x) - base
                if k != q['a'] and extra and base: warns.append(f'{tag}: ตัวเลือก “{x}” เป็นเรื่อง{"/".join(sorted(extra))} ซึ่งโจทย์ไม่ได้ถาม')
    print(f'{len(data)} boss lessons · {n} items checked')
    for w in sorted(set(warns)): print('WARN', w)
    if errs:
        print('\n'.join('FAIL ' + e for e in errs)); sys.exit(1)
    print('OK — every boss item has at least 3 different choices')

if __name__ == '__main__':
    main()
