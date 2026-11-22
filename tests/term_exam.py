#!/usr/bin/env python3
"""Answer check for the ป.2 term-1 exam (lesson 1098 · src/grades/p2/p2e.js).

    python3 tools/build.py && python3 tests/term_exam.py

The answer key below is worked out here in Python, separately from the game file, and every item is checked against it:
the option at `a` must equal the computed answer, and none of the other options may equal it.
Also checked: 40 items, 3 different options each, chapters 1–5 in order, every chapter present, `lv` is a lesson of
that chapter's city, `from` is that chapter's boss, the answer position is shuffled each attempt but stays right,
and no number in a question is above 1,000 (ป.2 range). CHROME=/path/to/chrome uses that browser.
"""
import os, pathlib, re, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'dist' / 'index.html'

def th(n):  # Thai digits
    return str(n).translate(str.maketrans('0123456789', '๐๑๒๓๔๕๖๗๘๙'))
def m_cm(cm): return f'{cm // 100} เมตร {cm % 100} เซนติเมตร'
def kg_kd(kd): return f'{kd // 10} กิโลกรัม {kd % 10} ขีด'
def even_max(ds):
    from itertools import permutations
    return max(int(''.join(map(str, p))) for p in permutations(ds) if p[-1] % 2 == 0)
def by100(seq_known, k):  # two numbers before 518 418 318 (step -100)
    return f'{seq_known + 2 * k}, {seq_known + k}'
def order_desc(opts):
    return [o for o in opts if (lambda v: v == sorted(v, reverse=True))([int(x) for x in o.split()])]
def true_cmp(opts):
    out = []
    for o in opts:
        s = o.translate(str.maketrans('๐๑๒๓๔๕๖๗๘๙', '0123456789')).replace('&lt;', '<').replace('&gt;', '>')
        a, op, b = re.match(r'(\d+) ([<>=]) (\d+)', s).groups(); a, b = int(a), int(b)
        if (op == '<' and a < b) or (op == '>' and a > b) or (op == '=' and a == b): out.append(o)
    return out
def expanded_ok(opts):
    return [o for o in opts if (lambda l, r: int(l) == sum(int(x) for x in r.split('+')))(*o.split('='))]

# expected answer of each item, in file order (computed, not copied from the file)
KEY = [
    'หกร้อยเจ็ด',                                   # ๖๐๗
    str(900 + 13),                                    # เก้าร้อยสิบสาม
    f'หลักสิบ มีค่า {2 * 10}',                       # 528
    None,                                             # expanded form → expanded_ok
    None,                                             # comparison → true_cmp
    None,                                             # order → order_desc
    by100(518, 100),                                  # ☐ ☐ 518 418 318
    str(even_max([4, 9, 2])),
    str(352 + 427), str(968 - 534), str(486 + 357), str(702 - 365),
    f'{583 + 216} − 216 = 583', str(375 + 248), '420 + ☐ = 735',
    f'{276 + 158} ต้น', f'{650 - 238 - 197} ฟอง',
    'ไม้เมตร หน่วยเป็นเมตร', f'{11 - 3} เซนติเมตร', f'{3 * 100 + 45} เซนติเมตร', '6 เมตร 8 เซนติเมตร',
    f'ฝนสูงกว่าต้น {135 - 128} เซนติเมตร', m_cm(465 + 250), m_cm(800 - 340), f'{350 + 275 - 540} เมตร',
    kg_kd(34), '650 กรัม', f'{5 * 10} ขีด', f'{7 * 100} กรัม',
    'ครึ่งกิโลกรัม เบากว่า 6 ขีด' if 500 < 600 else '', kg_kd(27 + 15), f'{1000 - 350} กรัม',
    f'4 × 6 = {4 * 6}', '7 × 1 = 7', str(8 * 6), str(9 * 7), str(40 * 6), str(76 * 4), str(72 // 8), f'{8 * 47} ต้น']
CHECKERS = {3: expanded_ok, 4: true_cmp, 5: order_desc}
LV = {1: range(41, 53), 2: range(61, 74), 3: range(81, 89), 4: range(901, 911), 5: list(range(921, 933)) + [938]}
BOSS = {1: 59, 2: 79, 3: 99, 4: 919, 5: 939}

def main():
    errs = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None); pg = b.new_page(); pe = []
        pg.on('pageerror', lambda e: pe.append(str(e)))
        pg.goto(HTML.as_uri()); pg.wait_for_timeout(600)
        base = pg.evaluate('T1_EXAM.map(q => ({ q: q.q, opts: q.opts, a: q.a, ch: q.ch, lv: q.lv, fig: !!q.fig }))')
        runs = pg.evaluate('Array.from({ length: 30 }, () => LESSONS.find(L => L.id === 1098).examGen().map(q => ({ q: q.q, opts: q.opts, a: q.a, from: q.from })))')
        city = pg.evaluate('(() => { const L = LESSONS.find(L => L.id === 1098), c = cityOf(L); return { city: c.id, grade: c.grade, n: L.exam.length, pass: L.pass, boss: L.boss, mega: L.bossKind } })()')
        b.close()
    if pe: errs.append(f'page errors: {pe}')
    if len(base) != 40: errs.append(f'expected 40 items, got {len(base)}')
    if len(KEY) != len(base): errs.append(f'key has {len(KEY)} answers for {len(base)} items')
    chs = [q['ch'] for q in base]
    if chs != sorted(chs): errs.append('items are not in chapter order')
    if set(chs) != {1, 2, 3, 4, 5}: errs.append(f'chapters covered: {sorted(set(chs))}')
    if len({q['q'] + '|'.join(q['opts']) for q in base}) != len(base): errs.append('duplicate item')
    for i, q in enumerate(base):
        o, tag = q['opts'], f"ข้อ {i + 1} ({q['q'][:40]})"
        if len(o) != 3 or len(set(o)) != 3: errs.append(f'{tag}: needs 3 different options {o}')
        if not 0 <= q['a'] < len(o): errs.append(f'{tag}: bad a'); continue
        if q['lv'] not in LV[q['ch']]: errs.append(f"{tag}: lv {q['lv']} is not a lesson of chapter {q['ch']}")
        right = CHECKERS[i](o) if i in CHECKERS else [x for x in o if x == KEY[i]]
        if right != [o[q['a']]]: errs.append(f"{tag}: marked {o[q['a']]!r}, computed {right or KEY[i]!r}")
        for n in re.findall(r'\d[\d,]*', re.sub(r'<[^>]+>', ' ', q['q'])):
            if int(n.replace(',', '')) > 1000: errs.append(f'{tag}: number {n} above ป.2 range')
    for r in runs:
        for i, q in enumerate(r):
            if q['opts'][q['a']] != base[i]['opts'][base[i]['a']]: errs.append(f'shuffled run: ข้อ {i + 1} answer moved wrong'); break
            if q['from'] != BOSS[base[i]['ch']]: errs.append(f'ข้อ {i + 1}: from {q["from"]}')
    pos = {k: 0 for k in range(3)}
    for r in runs:
        for q in r: pos[q['a']] += 1
    if min(pos.values()) == 0: errs.append(f'answer position never shuffled: {pos}')
    if city != {'city': 73, 'grade': 2, 'n': 40, 'pass': 32, 'boss': True, 'mega': 'mega'}: errs.append(f'lesson setup: {city}')
    print(f'ป.2 term-1 exam: {len(base)} items · chapters ' + ' '.join(f'{c}:{chs.count(c)}' for c in range(1, 6)) + f' · figures {sum(q["fig"] for q in base)} · answer positions over 30 runs {pos}')
    if errs:
        print('\n'.join('FAIL ' + e for e in errs)); sys.exit(1)
    print('OK — every answer matches the computed key')

if __name__ == '__main__':
    main()
