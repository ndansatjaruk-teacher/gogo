#!/usr/bin/env python3
"""Answer check for the term exams: ป.1 (term 1 = lesson 398 · term 2 = 397 · src/grades/p1/p1e.js), ป.2 (1098 · 1097 · src/grades/p2/p2e.js)
ป.3 (1198 · 1197 · src/grades/p3/p3e.js), ป.4 (1598 · 1597 · src/grades/p4/p4x.js), ป.5 (1698 · 1697 · src/grades/p5/p5x.js)
and ป.6 (898 · 897 · src/grades/p6/p6x.js).

    python3 tools/build.py && python3 tests/term_exam.py

The answer key below is worked out here in Python, separately from the game file, and every item is checked against it:
the option at `a` must equal the computed answer, and none of the other options may equal it.
Also checked: 40 items, 3 different options each, chapters 1–5 in order, every chapter present, `lv` is a lesson of
that chapter's city, `from` is that chapter's boss, the answer position is shuffled each attempt but stays right,
and no number in a question is above the grade's range (ป.1 term 1 ≤ 20 · ป.1 term 2 ≤ 100 · ป.2 ≤ 1,000 · ป.3 ≤ 100,000 · ป.4–6 no limit).
Figure answers are worked out from the figure's own data (pictures to count, blocks, balance, scale, chart, line-up, shelf, race, pattern, length board, column sums).
Pictograph answers are checked against the pictures actually drawn (icons × key), calendar answers with Python's own calendar. CHROME=/path/to/chrome uses that browser.
"""
import json, os, pathlib, re, sys
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
KEY1 = [
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
CHECK1 = {3: expanded_ok, 4: true_cmp, 5: order_desc}

import datetime
DAY = ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์', 'วันอาทิตย์']  # Python weekday()
oct26 = [datetime.date(2026, 10, d) for d in range(1, 32)]
def mixed_ok(opts):
    out = []
    for o in opts:
        l, r = o.split('=')
        if eval(l.replace('×', '*').replace('÷', '//').replace('−', '-')) == int(r): out.append(o)
    return out
KEY2 = [
    '18 ÷ 3 = ☐', str(42 // 6), f'54 ÷ 9 = {54 // 9}', None, f'{59 // 7} เศษ {59 % 7}', None, str(6 * 8),
    f'{75 // 8} กล่อง เหลือ {75 % 8} ฟอง',
    'สิงหาคม', DAY[datetime.date(2026, 10, 23).weekday()], f'{sum(d.weekday() == 5 for d in oct26)} วัน',
    '20 นาฬิกา 30 นาที', '10 นาฬิกา 25 นาที', '7 นาฬิกา 45 นาที', f'{(19 * 60 + 15) - (18 * 60 + 40)} นาที',
    f"{DAY[(0 + 10) % 7]}ที่ {12 + 10}",
    'ช้อนตวง', '6 แก้ว', f'ถังสีแดงมีน้ำมากกว่าถังสีฟ้า {12 - 9} ลิตร', f'{8 - 5} ลิตร', f'{6 * 5} ลิตร', f'{60 // 4} ครั้ง',
    'ทรงสี่เหลี่ยมมุมฉาก', 'ลูกปิงปอง', 'รูปห้าเหลี่ยม', 'วงรีไม่มีมุม', 'วงกลม', {'tri.sky': 'รูปสามเหลี่ยมสีฟ้า'}[['tri.sky', 'tri.sky', 'ci.coral'][7 % 3]],
    str((36 + 14) - 25), str(7 * (48 // 6)), str(90 - 8 * 9), None, f'{80 - 35 + 27} ผล', f'{96 // 8 * 15} บาท',
    'PP:max', 'PP:น้ำฝน', 'PP:ภูผา-ใบเตย', 'PP:ทุเรียน', 'PP:เงาะ+ส้ม', 'PP:all']
CHECK2 = {3: lambda o: [x for x in o if (lambda a, b: a % b == 0)(*map(int, x.split(' ÷ ')))], 5: lambda o: [max(o, key=lambda x: (lambda a, b: a // b)(*map(int, x.split(' ÷ '))))], 31: mixed_ok}
def pp_answer(tag, rows, unit):
    v = dict(rows)
    if tag == 'PP:max': return max(v, key=v.get)
    if tag == 'PP:all': n = sum(v.values())
    elif '-' in tag: a, b = tag[3:].split('-'); n = v[a] - v[b]
    elif '+' in tag: a, b = tag[3:].split('+'); n = v[a] + v[b]
    else: n = v[tag[3:]]
    return f'{n:g} {unit}'
EXAMS = [
    dict(name='ป.2 ภาค 1', grade=2, limit=1000, var='T1_EXAM', lesson=1098, city=73, key=KEY1, check=CHECK1,
         lv={1: range(41, 53), 2: range(61, 74), 3: range(81, 89), 4: range(901, 911), 5: list(range(921, 933)) + [938]},
         boss={1: 59, 2: 79, 3: 99, 4: 919, 5: 939}),
    dict(name='ป.2 ภาค 2', grade=2, limit=1000, var='T2_EXAM', lesson=1097, city=74, key=KEY2, check=CHECK2,
         lv={6: range(941, 953), 7: range(961, 970), 8: range(981, 990), 9: range(1001, 1006), 10: range(1021, 1026), 11: range(1041, 1044)},
         boss={6: 959, 7: 979, 8: 999, 9: 1019, 10: 1039, 11: 1059})]
# page side: every item with plain-text options (`say` for picture options) and, for pictographs, the drawn rows
# ---------- ป.1 ----------
TH_U = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
def th_word(n):
    if n < 10: return TH_U[n]
    t, u = divmod(n, 10)
    return ('' if t == 1 else 'ยี่' if t == 2 else TH_U[t]) + 'สิบ' + ('' if u == 0 else 'เอ็ด' if u == 1 else TH_U[u])
WORD = {th_word(n): n for n in range(100)}
TH_D = str.maketrans('๐๑๒๓๔๕๖๗๘๙', '0123456789')
def same_num(opts):  # "8   ๘   แปด": Arabic, Thai digits and word all the same number
    return [o for o in opts if (lambda a, t, w: w in WORD and int(a) == int(t.translate(TH_D)) == WORD[w])(*o.split())]
def ordered(desc):
    return lambda opts: [o for o in opts if (lambda v: v == sorted(v, reverse=desc))([int(x) for x in o.split()])]
def ev(x): return eval(x.replace('×', '*').replace('÷', '//').replace('−', '-'))
def true_eq(opts): return [o for o in opts if (lambda l, r: ev(l) == ev(r))(*o.split('='))]
def val_is(v): return lambda opts: [o for o in opts if ev(o) == v]
def val_max(opts): return [max(opts, key=ev)]
def chart_n(lab): return lambda d: next(x['n'] for x in d['chart']['data'] if x['label'] == lab)
SIDE = ['ข้างซ้าย', 'ตรงกลาง', 'ข้างขวา']
def shelf_of(e): return lambda d: next(f'ชั้นที่ {r + 1} {SIDE[c]}' for r, row in enumerate(d['shelf']) for c, x in enumerate(row) if x == e)
def seq_gap(d):  # the token the repeating unit puts at the gap
    s, b = d['seq']; per = next(k for k in range(1, len(s)) if all(s[i] == s[i % k] for i in range(len(s))))
    return json.dumps({'tok': s[b % per]}, separators=(',', ':'), ensure_ascii=False)
KEY3 = [
    lambda d: str(sum(n for _, n in d['pic'])), None, '0', None, None, str(10 - 4),
    lambda d: str(sum(n for _, n in d['pic'])), str(6 + 2), None, '9', str(9 - 5), f'{4 + 5} ลูก',
    str(8 - 3), f'{7 - 4} ตัว', None, str(6 + 2), None, f'{10 - 3 - 2} แท่ง',
    lambda d: str(d['blocks']), '17', '๑๔'.translate(TH_D), str(1 * 10 + 5), None, None,
    str(12 + 5), str(8 + 7), str(19 - 6), str(16 - 9), str(17 - 8), f'{13 + 6} ฟอง', f'{20 - 8 + 5} ก้อน',
    lambda d: f"{chart_n('ก้อง')(d)} ผล", lambda d: min(d['chart']['data'], key=lambda x: x['n'])['label'], lambda d: f"{chart_n('ฝน')(d) - chart_n('มิ้นท์')(d)} ผล", '{"tally":7}',
    lambda d: 'หนักกว่า' if d['bal'][2] > 0 else 'เบากว่า' if d['bal'][2] < 0 else 'หนักเท่ากับ', lambda d: f"{d['bal'][1][1]} ลูก" if d['bal'][2] == 0 else '?',
    lambda d: f"{d['scale'][0]} กิโลกรัม", 'ยางลบ 1 ก้อน', f'{9 - 6} กิโลกรัม']
CHECK3 = {1: same_num, 3: true_cmp, 4: ordered(False), 8: val_is(10), 14: true_eq, 16: val_is(4), 22: true_cmp, 23: ordered(True)}
KEY4 = [
    lambda d: d['line'][d['line'].index('มายด์') - 1], lambda d: d['line'][d['line'].index('มายด์') + 1] if d['line'].index('น้ำ') - d['line'].index('มายด์') == 2 else '?',
    lambda d: next(d['grid'][r - 1][c] for r, row in enumerate(d['grid']) for c, x in enumerate(row) if x == 'บีม'),
    lambda d: sorted(d['race'], key=lambda x: -x['pos'])[1]['name'], shelf_of('grape'), f'{4 - 1} คน',
    'ทรงกระบอก', 'หมวกวันเกิด', 'วงรี', 'รูปสามเหลี่ยม', 'รูปสี่เหลี่ยม', seq_gap,
    lambda d: str(d['blocks']), '47', None, 'หลักสิบ มีค่า 70', str(90 + 4), None, str(45 + 10),
    lambda d: min(d['lenb'][0], key=lambda x: x['len'])['name'], lambda d: f"{d['lenb'][0][0]['len']} หน่วย", lambda d: f"{d['lenb'][0][0]['len']} เซนติเมตร", 'เมตร', f'{52 - 35} เซนติเมตร',
    str(43 + 5), str(32 + 46), str(58 + 7), lambda d: str(sum(d['vert'])), None,
    str(68 - 5), lambda d: str(d['vsub'][0] - d['vsub'][1]), None, str(51 + 24), str(90 - 36),
    f'{26 + 13} ตัว', f'{85 - 42} เล่ม', '47 + ☐ = 60', f'{38 + 15} ดวง', f'{41 - 34} คน', f'{50 - 18 + 25} เม็ด']
CHECK4 = {14: same_num, 17: lambda o: [x for x in o if 58 < int(x) < 63], 28: val_max, 31: true_eq}
EXAMS = [
    dict(name='ป.1 ภาค 1', grade=1, limit=20, var='P1T1_EXAM', lesson=398, city=75, key=KEY3, check=CHECK3,
         lv={1: range(1, 14), 2: range(21, 28), 3: range(31, 39), 4: range(201, 209), 5: range(211, 220), 6: range(231, 234), 7: range(241, 248)},
         boss={1: 14, 2: 28, 3: 39, 4: 209, 5: 229, 6: 239, 7: 249}),
    dict(name='ป.1 ภาค 2', grade=1, limit=100, var='P1T2_EXAM', lesson=397, city=76, key=KEY4, check=CHECK4,
         lv={8: range(251, 255), 9: range(261, 269), 10: range(271, 281), 11: range(291, 299), 12: range(301, 306), 13: range(311, 320), 14: range(331, 340)},
         boss={8: 259, 9: 269, 10: 289, 11: 299, 12: 309, 13: 329, 14: 349})] + EXAMS

# ---------- ป.3 ----------
from fractions import Fraction
TH_POS = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น']
def th_big(n):  # Thai reading of 0 < n < 100,000
    s, d = '', str(n)
    for i, ch in enumerate(d):
        p, v = len(d) - 1 - i, int(ch)
        if v == 0: continue
        if p == 1: s += ('' if v == 1 else 'ยี่' if v == 2 else TH_U[v]) + 'สิบ'
        elif p == 0: s += 'เอ็ด' if v == 1 and n > 10 and d[-2] != '0' else TH_U[v]
        else: s += TH_U[v] + TH_POS[p]
    return s
def num(x): return int(x.replace(',', ''))
def ev2(x): return eval(x.replace(',', '').replace('×', '*').replace('÷', '/').replace('−', '-'))
def true_eq2(opts): return [o for o in opts if (lambda l, r: ev2(l) == ev2(r))(*o.split('='))]
def ordered2(desc): return lambda opts: [o for o in opts if (lambda v: v == sorted(v, reverse=desc))([num(x) for x in o.split()])]
def val_max2(opts): return [max(opts, key=ev2)]
UNITS = {'กิโลเมตร': 100000, 'เมตร': 100, 'เซนติเมตร': 1, 'มิลลิเมตร': .1, 'กิโลกรัม': 1000, 'ขีด': 100, 'กรัม': 1, 'ลิตร': 1000, 'มิลลิลิตร': 1,
         'บาท': 100, 'สตางค์': 1, 'ชั่วโมง': 60, 'นาที': 1}
UNIT_RE = re.compile(r'([\d,]+(?:\.\d+)?)\s*(' + '|'.join(sorted(UNITS, key=len, reverse=True)) + ')')
def qty(s): return round(sum(float(n.replace(',', '')) * UNITS[u] for n, u in UNIT_RE.findall(s)), 3)
def qty_max(opts): return [max(opts, key=qty)]
def frac_true(opts):
    out = []
    for o in opts:
        a, op, b = o.split(' '); A, B = Fraction(a), Fraction(b)
        if (op == '>' and A > B) or (op == '<' and A < B) or (op == '=' and A == B): out.append(o)
    return out
def hm(m): return f'{m // 60} ชั่วโมง {m % 60} นาที'
def two(big, small, B, b, base):  # 2300 → "2 กิโลกรัม 300 กรัม" (drop a zero part)
    x, y = divmod(base, b)
    return ' '.join(p for p in [f'{x:,} {big}' if x else '', f'{y:,} {small}' if y else ''] if p)
PLACE = ['หน่วย', 'สิบ', 'ร้อย', 'พัน', 'หมื่น']
def place_of(n, dgt): s = str(n); p = len(s) - 1 - s.index(str(dgt)); return f'หลัก{PLACE[p]} มีค่า {dgt * 10 ** p:,}'
KEY5 = [
    f'{63040:,}', th_big(47205), place_of(85316, 5), None, None, f'{4750 + 250:,}',
    f'{43215 + 32471:,}', f'{28647 + 39586:,}', f'{60003 - 27458:,}', f'{42300 - 15780:,}', f'{31207 + 8945:,}', f'{34560 * 2 + 8750:,} ขวด',
    '14 นาฬิกา 35 นาที', '9 นาฬิกา 50 นาที', f'{3 * 60} นาที', hm(10 * 60 + 15 - (7 * 60 + 40)), None, hm(17 * 60 + 45 - (9 * 60 + 30)),
    'รูปหัวใจ', 'พับรูปตามแกนสมมาตร แล้วสองข้างทับกันสนิท', '4 แกน', 'มีมากมายนับไม่ถ้วน',
    '23', 'PP:ป.3/3', 'PP:ป.3/1-ป.3/2', 'PP:all', f'{52 - 29} คน',
    '3/8', '2/7', None, None, str(Fraction(2, 9) + Fraction(5, 9)), str(1 - Fraction(3, 8)), f'{10 - 3 - 4}/10',
    f'{7 * 3000:,}', f'{846 * 7:,}', f'{68 * 40:,}', f'{57 * 36:,}', f'{7254 // 9:,}' if 7254 % 9 == 0 else '?', f'{48 * 12 * 7:,} บาท']
CHECK5 = {3: true_eq2, 4: ordered2(True), 16: qty_max, 29: frac_true, 30: frac_true}
KEY6 = [
    str(96 // 4), f'{79 // 6} เศษ {79 % 6}', str(735 // 5), str(4816 // 8), str(2457 // 7), f'{126 * 9:,}', f'{500 // 6} กล่อง เหลือ {500 % 6} ฟอง',
    two('เซนติเมตร', 'มิลลิเมตร', 0, 10, 86), f'{4 * 100 + 5} เซนติเมตร', two('กิโลเมตร', 'เมตร', 0, 1000, 6250), 'สายวัดตัว', None,
    two('กิโลเมตร', 'เมตร', 0, 1000, 15600 - 8850), two('เมตร', 'เซนติเมตร', 0, 100, 2500 - 6 * 350),
    two('กิโลกรัม', 'กรัม', 0, 1000, 2300), f'{5080:,} กรัม', two('กิโลกรัม', 'กรัม', 0, 1000, 3600), 'น้ำตาลทราย 1 ถุงใหญ่', None,
    two('กิโลกรัม', 'กรัม', 0, 1000, 12650 + 7480), two('กิโลกรัม', 'กรัม', 0, 1000, 3 * 1250 - 2800),
    '650 มิลลิลิตร', f'{2075:,} มิลลิลิตร', 'ช้อนชา', None, two('ลิตร', 'มิลลิลิตร', 0, 1000, 6 * 250), two('ลิตร', 'มิลลิลิตร', 0, 1000, 4500 // 3),
    two('บาท', 'สตางค์', 0, 100, 350), '45.75 บาท', f'{100 // 5} เหรียญ', None, f'{(2850 + 1375) / 100:.2f} บาท', f'{(10000 - 3 * 1250) / 100:.2f} บาท', f'{(3500 + 2750) / 100:.2f} บาท',
    f'{(4560 + 2340) // 6:,}', f'{9000 - 125 * 8:,}', None, '(8 × 15) + (6 × 12) = ☐', f'{(438 + 402) // 8} กลุ่ม', f'{9 * 24 * 35:,} บาท']
CHECK6 = {11: qty_max, 18: qty_max, 24: qty_max, 30: qty_max, 36: val_max2}
EXAMS = [
    dict(name='ป.3 ภาค 1', grade=3, limit=100000, var='P3T1_EXAM', lesson=1198, city=77, key=KEY5, check=CHECK5,
         lv={1: range(101, 107), 2: range(111, 119), 3: range(1201, 1212), 4: range(1221, 1225), 5: range(1341, 1346), 6: range(1361, 1371), 7: range(1381, 1390)},
         boss={1: 109, 2: 129, 3: 1219, 4: 1239, 5: 1359, 6: 1379, 7: 1399}),
    dict(name='ป.3 ภาค 2', grade=3, limit=100000, var='P3T2_EXAM', lesson=1197, city=78, key=KEY6, check=CHECK6,
         lv={8: range(1301, 1310), 9: range(1321, 1332), 10: range(1241, 1253), 11: range(1261, 1271), 12: range(1281, 1292), 13: range(1401, 1407)},
         boss={8: 1319, 9: 1339, 10: 1259, 11: 1279, 12: 1299, 13: 1419})] + EXAMS

# ---------- ป.4 ----------
from decimal import Decimal as D
TH_POS[:] = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
PLACE[:] = ['หน่วย', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
UNITS.update({'สัปดาห์': 10080, 'วัน': 1440, 'วินาที': 1 / 60})
UNIT_RE = re.compile(r'([\d,]+(?:\.\d+)?)\s*(' + '|'.join(sorted(UNITS, key=len, reverse=True)) + ')')
def rnd_to(n, k): return (n + k // 2) // k * k
def exact(a, b): assert a % b == 0, (a, b); return a // b
def ym(m): return f'{m // 12} ปี {m % 12} เดือน'
def FR(s): w, _, f = s.rpartition(' '); return int(w or 0) + Fraction(f)
def mixed(x): w, r = divmod(x.numerator, x.denominator); return f'{w} {r}/{x.denominator}' if w and r else str(x)
def ang_kind(a): return 'มุมแหลม' if a < 90 else 'มุมฉาก' if a == 90 else 'มุมป้าน' if a < 180 else 'มุมตรง' if a == 180 else 'มุมกลับ'
DEC_POS = ['', 'หนึ่ง', 'สอง', 'สาม']
def dec_place(x, dg): f = x.split('.')[1]; p = f.index(str(dg)) + 1; return f'ทศนิยมตำแหน่งที่{DEC_POS[p]} มีค่า {D(dg) / 10 ** p}'
P4_TW = {'เดิน': (34, 28), 'จักรยาน': (25, 17), 'รถโรงเรียน': (41, 53), 'รถผู้ปกครอง': (30, 36)}  # same data as P4T_TW
P4_BAR = dict(zip(['นิทาน', 'สารคดี', 'การ์ตูน', 'นวนิยาย'], [350, 200, 450, 150]))       # same data as P4T_BAR
KEY7 = [
    f'{3450206:,}', th_big(527038), place_of(8463215, 4), None, f'{rnd_to(4786, 10):,}', f'{rnd_to(62500, 1000):,}', f'{rnd_to(2849999, 100000):,}', None,
    f'{254739 + 418586:,}', f'{800000 - 356428:,}', f'{rnd_to(38690, 1000) + rnd_to(51230, 1000):,}', f'{502317 - 186450:,}', f'{128300 + 49875:,}',
    f'{245800 - 37650:,} ตัว', f'{1850000 - 1125500:,} บาท', f'{960000 - 425500 - 318750:,} บาท',
    f'{4325 * 6:,}', f'{738 * 46:,}', f'{3600 * 500:,}', f'{1207 * 35:,}', f'{exact(5184, 6):,}', f'{exact(7560, 40):,}', f'{9345 // 23} เศษ {9345 % 23}', f'{exact(87236, 452):,}',
    f'{36 * 245:,}', f'{exact(exact(9360, 24), 15)} กล่อง',
    f'{(12500 - 4750) * 8:,}', f'{45000 - 12800 + 6300:,}', f'{exact(840, 12) * 5:,}', f'{150 + 36 * 4:,}', f'{exact(48 + 72, 6) - 9}', f'{15 * 12 - 148} เล่ม',
    f'{exact(18 + 15 + 20 + 11, 4)} คะแนน', f'{exact(120 + 135 + 98 + 142 + 105, 5)} แก้ว',
    f'{5 * 60 + 20} วินาที', f'{3 * 24 + 6} ชั่วโมง', f'{2 * 12 + 5} เดือน', None, hm(24 * 60 + 6 * 60 + 20 - (21 * 60 + 45)), ym(42 * 12 + 3 - (9 * 12 + 8))]
CHECK7 = {3: ordered2(False), 7: lambda o: [x for x in o if rnd_to(num(x), 10000) == 350000], 37: qty_max}
KEY8 = [
    str(Fraction(3, 5)), None, str(3 * 5 + 2) + '/5', mixed(Fraction(23, 4)), str(exact(3 * 40, 8)), str(Fraction(18, 24)), None, str(Fraction(1, 4) + Fraction(3, 8)), mixed(FR('2 1/2') - FR('1 3/4')),
    'ศูนย์จุดเจ็ด', str(D(37) / 100), dec_place('6.452', 5), None, str(D('4.68') + D('2.75')), str(D(10) - D('3.45')), str(D('12.506') + D('3.85')),
    f"{D('5.4') - D('1.75')} เมตร", f"{D(500) - D('125.50') - D('48.75')} บาท",
    '1 จุด', 'จุด B', '180°', ang_kind(125), None, ang_kind(250), f'{360 - 75}°',
    'ด้านทั้งสี่ยาวเท่ากัน', '15 ซม.', f'{2 * (18 + 7)} ซม.', f'{3 * 10000:,} ตารางเซนติเมตร', f'{12 * 5} ตารางเมตร', f'{14 * 14} ตารางเมตร', f'{exact(130, 2) - 40} เมตร', f'{4 * 6 * 250:,} บาท',
    f"{P4_TW['รถโรงเรียน'][1]} คน", f'{sum(b for b, g in P4_TW.values())} คน', min(P4_TW, key=lambda k: sum(P4_TW[k])),
    f"{P4_BAR['การ์ตูน']} เล่ม", f"{P4_BAR['นิทาน'] - P4_BAR['นวนิยาย']} เล่ม", f'{sum(P4_BAR.values()):,} เล่ม', '500']
CHECK8 = {1: lambda o: [x for x in o if FR(x) > 1 and ' ' not in x], 6: frac_true, 12: lambda o: [x for x in o if (lambda v: v == sorted(v))([D(t) for t in x.split()])],
          22: lambda o: [x for x in o if all(int(t.rstrip('°')) < 90 for t in x.split())]}
EXAMS = [
    dict(name='ป.4 ภาค 1', grade=4, limit=10 ** 7, var='P4T1_EXAM', lesson=1598, city=79, key=KEY7, check=CHECK7,
         lv={1: range(401, 410), 2: range(421, 434), 3: range(441, 461), 4: range(471, 485), 5: range(491, 499)},
         boss={1: 419, 2: 439, 3: 469, 4: 489, 5: 499}),
    dict(name='ป.4 ภาค 2', grade=4, limit=10 ** 7, var='P4T2_EXAM', lesson=1597, city=80, key=KEY8, check=CHECK8,
         lv={6: range(1421, 1439), 7: range(1441, 1456), 8: range(1461, 1469), 9: range(1481, 1495), 10: range(1501, 1506)},
         boss={6: 1439, 7: 1459, 8: 1479, 9: 1499, 10: 1509})] + EXAMS

# ---------- ป.5 ----------
from decimal import ROUND_HALF_UP
def norm(x): s = format(D(x).normalize(), 'f'); return s
def qround(x, q): return str(D(x).quantize(D(q), rounding=ROUND_HALF_UP))
def gser(d, k): return d['gchart']['series'][k]['v']
def gcat(d): return d['gchart']['cats']
def side(p, q): return (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2
def quad_name(P):  # rhombus test straight from the vertices (all sides equal, corners not right angles)
    s = [side(P[i], P[(i + 1) % 4]) for i in range(4)]; dot = (P[1][0] - P[0][0]) * (P[3][0] - P[0][0]) + (P[1][1] - P[0][1]) * (P[3][1] - P[0][1])
    return ('รูปสี่เหลี่ยมจัตุรัส' if dot == 0 else 'รูปสี่เหลี่ยมขนมเปียกปูน') if len(set(s)) == 1 else '?'
KEY9 = [
    None, None, None, mixed(Fraction(17, 6)), str(Fraction(2, 3) + Fraction(1, 4)), str(Fraction(5, 6) - Fraction(3, 8)), mixed(FR('3 1/2') + FR('1 2/3')),
    str(Fraction(3, 4) * 36), str(Fraction(2, 5) * Fraction(3, 7)), mixed(FR('2 1/4') * 8), str(1 / FR('3 1/2')), str(6 / Fraction(3, 4)), str(Fraction(4, 9) / Fraction(2, 3)),
    str(Fraction(1, 2) * (Fraction(2, 3) + Fraction(1, 6))), mixed(FR('5 3/4') - FR('2 1/2')), f'{1200 - 1200 // 3 - 1200 // 4} บาท',
    norm(D(3) / 25), norm(D(7) / 8), qround('17.49', '1'), qround('8.396', '0.01'), norm(D('2.75') * 8), norm(D('0.047') * 1000), norm(D('3.6') * D('0.25')),
    norm(D('15.36') / 6), norm(D(7) / 4), norm(D('62.5') / 100), f"{norm(D('2.35') * 100)} เซนติเมตร", f'{norm(D(4350) / 1000)} กิโลกรัม', f"{int(D('1.25') * 1000):,} มิลลิลิตร",
    f"{norm(D('32.50') * D('3.2'))} บาท", f"{int(4 * D('1.85') / D('0.5'))} ขวด",
    'มีการย่นระยะของแกน', 'ส่วนสูงของต้นไม้ที่วัดทุกสัปดาห์',
    lambda d: next(c for c, a, b in zip(gcat(d), gser(d, 0), gser(d, 1)) if b > a) if sum(b > a for a, b in zip(gser(d, 0), gser(d, 1))) == 1 else '?',
    lambda d: f"{gser(d, 0)[gcat(d).index('กีฬา')] - gser(d, 1)[gcat(d).index('กีฬา')]} คน", lambda d: f"{gser(d, 0)[gcat(d).index('วิทยาศาสตร์')] + gser(d, 1)[gcat(d).index('วิทยาศาสตร์')]} คน",
    lambda d: max(zip(gser(d, 0), gcat(d)))[1], lambda d: f"{gser(d, 0)[1] - gser(d, 0)[3]} องศาเซลเซียส", lambda d: f"{norm(D(sum(gser(d, 0))) / len(gser(d, 0)))} องศาเซลเซียส",
    lambda d: f'{sum(gser(d, 0)) - sum(gser(d, 1))} คน']
CHECK9 = {0: lambda o: [x for x in o if FR(x) > Fraction(1, 2)], 1: frac_true, 2: lambda o: [x for x in o if (lambda v: v == sorted(v))([FR(t) for t in x.split(' , ')])]}
KEY10 = [
    f'{exact(35, 5)} บาท', f'{exact(72 * 7, 4)} บาท', 'ไข่ไก่ 10 ฟอง ราคา 45 บาท ไข่ไก่ 6 ฟองราคาเท่าไร', f'{exact(300 * 15, 180)} ลิตร', f'{exact(105 * 8, 3)} บาท',
    f'{exact(360 * 3, 45)} นาที', f'{int(200 / (D(39) / 6))} ขวด',
    f'ร้อยละ {Fraction(7, 20) * 100}', norm(D(45) / 100), f'ร้อยละ {Fraction(6, 40) * 100}', str(exact(360 * 25, 100)), f'{800 - exact(800 * 55, 100)} คน',
    str(exact(72 * 100, 30)), f'{450 - exact(450 * 20, 100)} บาท', f'{2700 - 2400} บาท', f'ร้อยละ {exact((600 - 500) * 100, 500)}', f'{1200 + exact(1200 * 15, 100):,} บาท',
    'เส้นตั้งฉาก', 'ระยะห่างระหว่างเส้นขนานเท่ากันตลอด', '8 มุม', f'{180 - 65}°', '48°', 'ขนานกัน' if 72 + 108 == 180 else 'ไม่ขนานกัน', f'{exact(180, 5)}°',
    quad_name([[0, 0], [5, 0], [8, 4], [3, 4]]), 'รูปสี่เหลี่ยมคางหมู', 'รูปสี่เหลี่ยมขนมเปียกปูน', f'{14 * 9} ตารางเซนติเมตร', f'{exact(12 * 16, 2)} ตารางเซนติเมตร',
    f'{exact((10 + 16) * 7, 2)} ตารางเซนติเมตร', f'{2 * (15 + 8)} ซม.', f'{exact(480, 24)} เมตร', f'{exact((30 + 50) * 20, 2) * 15:,} บาท',
    'ปริซึมห้าเหลี่ยม', f'{4 * 3 * 2} ลูกบาศก์หน่วย', f'{8 * 15 * 6} ลูกบาศก์เซนติเมตร', '1,000 ลูกบาศก์เซนติเมตร', f"{int(D('2.5') * 1000):,} ลิตร",
    f'{exact(30 * 50 * 40, 1000)} ลิตร', f"{int(1 * 2 * (D('1.5') - D('0.6')) * 1000):,} ลิตร"]
CHECK10 = {}
EXAMS = [
    dict(name='ป.5 ภาค 1', grade=5, limit=10 ** 7, var='P5T1_EXAM', lesson=1698, city=81, key=KEY9, check=CHECK9,
         lv={1: range(501, 531), 2: range(541, 563), 3: range(571, 583)}, boss={1: 539, 2: 569, 3: 589}),
    dict(name='ป.5 ภาค 2', grade=5, limit=10 ** 7, var='P5T2_EXAM', lesson=1697, city=82, key=KEY10, check=CHECK10,
         lv={4: range(591, 597), 5: range(601, 615), 6: range(621, 629), 7: range(631, 651), 8: range(661, 673)},
         boss={4: 599, 5: 619, 6: 629, 7: 659, 8: 679})] + EXAMS

# ---------- ป.6 ----------
from math import gcd, lcm
def is_prime(n): return n > 1 and all(n % k for k in range(2, int(n ** .5) + 1))
def frac_true2(opts):  # comparisons that may hold mixed numbers: "2 3/4 > 2 5/8"
    out = []
    for o in opts:
        op = next(x for x in (' > ', ' < ', ' = ') if x in o); a, b = o.split(op); A, B = FR(a), FR(b)
        if (op == ' > ' and A > B) or (op == ' < ' and A < B) or (op == ' = ' and A == B): out.append(o)
    return out
def ratio(a, b): f = Fraction(a, b); return f'{f.numerator} : {f.denominator}'
P6_PIE = {'ค่าอาหาร': 35, 'ค่าเล่าเรียน': 20, 'ค่าเดินทาง': 15, 'เงินออม': 10, 'อื่น ๆ': 20}  # same data as P6T_PIE (30,000 บาท)
assert sum(P6_PIE.values()) == 100
KEY11 = [
    None, None, None, str(gcd(48, 72)), str(lcm(12, 18)), str(gcd(36, 54, 90)), str(lcm(8, 12, 20)), f'{gcd(120, 84)} ซม.', f'{lcm(6, 8, 10)} วินาที',
    None, None, None, str(Fraction(5, 6) + Fraction(3, 4) - Fraction(2, 3)), mixed(FR('4 1/3') - FR('1 5/6')), str((Fraction(3, 4) + Fraction(1, 8)) * Fraction(4, 7)),
    str(Fraction(2, 3) + Fraction(1, 2) * Fraction(4, 9)), f'{1800 * (1 - Fraction(2, 5)) * (1 - Fraction(1, 3))} บาท', str(Fraction(3, 4) * (1 - Fraction(1, 3)) + Fraction(1, 6)),
    norm(D(13) / 20), norm(D('4.8') / D('0.6')), norm(D('0.36') / D('0.004')), norm(D('12.42') / D('2.7')), norm(D('7.5') / D('0.125')),
    f"{D('35.40') * 50:,.0f} บาท", f"{norm(D('6.75') / D('0.45'))} ขวด", f"{D(500) - D('3.5') * D('84.50'):.2f} บาท",
    str(exact(260 * 35, 100)), f'ร้อยละ {exact(180 * 100, 250)}', f'{1500 - exact(1500 * 15, 100) - 100:,} บาท', f'{exact(690 * 100, 115)} บาท', f'{8000 - exact(8000 * 12, 100):,} บาท',
    ratio(18, 24), None, f'{exact(750 * 2, 5)} กรัม', f"{norm(D('7.4') * 5)} กิโลเมตร",
    str(31 + 8), str(12 + 5), str(3 * 2 ** 6), str(4 + 19 * 5), f'{2 * 15 + 2} คน']
CHECK11 = {0: lambda o: [x for x in o if all(36 % int(t) == 0 for t in x.split())], 1: lambda o: [x for x in o if all(is_prime(int(t)) for t in x.split())],
           2: lambda o: [x for x in o if (lambda f: eval('*'.join(f)) == 84 and all(is_prime(int(t)) for t in f))(x.split(' × '))],
           9: frac_true, 10: frac_true2, 11: lambda o: [x for x in o if (lambda v: v == sorted(v, reverse=True))([FR(t) for t in x.split(' , ')])],
           32: lambda o: [x for x in o if Fraction(*map(int, x.split(' : '))) == Fraction(5, 8) and x != '5 : 8']}
KEY12 = [
    'รูปสามเหลี่ยมหน้าจั่ว', 'รูปสามเหลี่ยมมุมป้าน' if max(35, 45, 100) > 90 else '?', f'{180 // 3}°', f'{180 - 64 - 48}°', f'{exact(180 - 40, 2)}°', f'{exact(54, 3)} ซม.',
    f'{exact(16 * 9, 2)} ตารางเซนติเมตร', f'{exact(96 * 2, 12)} ซม.', f'{(30 + 40 + 50) * 120 + exact(30 * 40, 2) * 10:,} บาท',
    'รูปเจ็ดเหลี่ยม', f'{(6 - 2) * 180:,}°', f'{exact((5 - 2) * 180, 5)}°', f"{norm(D('6.5') * 8)} ซม.", f'{exact((8 + 14) * 6, 2)} ตารางเซนติเมตร',
    f'{exact(10 * 18, 2)} ตารางเซนติเมตร', f'{6 * 10 + exact(6 * 4, 2)} ตารางเซนติเมตร', f'{exact((25 + 35) * 18, 2) - 6 * 6:,} ตารางเมตร',
    'เส้นผ่านศูนย์กลาง', f'{9 * 2} ซม.', f'{Fraction(22, 7) * 35} ซม.', f'{Fraction(22, 7) * 14 * 14} ตารางเซนติเมตร', f'{2 * Fraction(22, 7) * 35} ซม.',
    f'{14 * 14 - Fraction(22, 7) * 7 * 7} ตารางเซนติเมตร', f'{88 / (2 * Fraction(22, 7))} เมตร', f'{int(Fraction(22, 7) * (28 ** 2 - 21 ** 2)):,} ตารางเมตร',
    'พีระมิดฐานสี่เหลี่ยม', 'ทรงกระบอก', f'{3 + 2} หน้า', 'ปริซึมสามเหลี่ยม', f'{4 * 5 * 6 + 3 * 3 * 10} ลูกบาศก์เซนติเมตร', f'{exact(50 * 80 * 60, 1000)} ลิตร',
    f'{exact(1200, 10 * 15)} ซม.', f'{exact(40 * 60 * 50 * 3, 4 * 1000)} ลิตร',
    f'{exact(25 * 360, 100)}°', max(P6_PIE, key=P6_PIE.get), f"{exact(30000 * P6_PIE['เงินออม'], 100):,} บาท", f"{exact(30000 * (P6_PIE['ค่าอาหาร'] - P6_PIE['ค่าเดินทาง']), 100):,} บาท",
    f"ร้อยละ {P6_PIE['ค่าเดินทาง'] + P6_PIE['เงินออม']}", f'{exact(240 * (100 - 30 - 25 - 15), 100)} คน', f"{exact(30000 * (P6_PIE['เงินออม'] + 5), 100):,} บาท"]
CHECK12 = {}
EXAMS = [
    dict(name='ป.6 ภาค 1', grade=6, limit=10 ** 7, var='P6T1_EXAM', lesson=898, city=83, key=KEY11, check=CHECK11,
         lv={1: range(701, 715), 2: range(731, 743), 3: range(751, 761), 4: range(771, 786), 5: range(791, 796)}, boss={1: 719, 2: 749, 3: 769, 4: 789, 5: 799}),
    dict(name='ป.6 ภาค 2', grade=6, limit=10 ** 7, var='P6T2_EXAM', lesson=897, city=84, key=KEY12, check=CHECK12,
         lv={6: range(801, 816), 7: range(821, 833), 8: range(841, 853), 9: range(861, 869), 10: range(871, 877)},
         boss={6: 819, 7: 839, 8: 859, 9: 869, 10: 879})] + EXAMS

ITEMS = r"""v => eval(v).map(q => { const o = { q: q.q, opts: q.opts.map(x => typeof x === 'string' ? x : x.v || x.say || JSON.stringify(x)), a: q.a, ch: q.ch, lv: q.lv, fig: !!(q.fig || q.pic || q.blocks != null || q.chart || q.bal || q.scale || q.line || q.grid || q.race || q.shelf || q.solid || q.shape || q.seq || q.lenb || q.vert || q.vsub || q.gchart),
    d: { pic: q.pic, blocks: q.blocks, chart: q.chart, bal: q.bal, scale: q.scale, line: q.line, grid: q.grid, race: q.race, shelf: q.shelf, seq: q.seq, lenb: q.lenb, vert: q.vert, vsub: q.vsub, gchart: q.gchart } };
  if (q.fig && /class="pp /.test(q.fig)) { const d = document.createElement('div'); d.innerHTML = q.fig; const k = +d.querySelector('.pp-key').textContent.match(/แทนจำนวน\D*(\d+)/)[1];
    o.pp = [...d.querySelectorAll('.pp-row')].map(r => [r.querySelector('.pp-lab').textContent, (r.querySelectorAll('.pp-i:not(.half)').length + r.querySelectorAll('.pp-i.half').length / 2) * k]); o.unit = q.opts[q.a].split(' ').pop(); }
  return o; })"""

def check(pg, E):
    errs, var = [], E['var']
    base = pg.evaluate(ITEMS, var)
    runs = pg.evaluate(f"Array.from({{ length: 30 }}, () => LESSONS.find(L => L.id === {E['lesson']}).examGen().map(q => ({{ opts: q.opts.map(x => typeof x === 'string' ? x : x.v || x.say || JSON.stringify(x)), a: q.a, from: q.from }})))")
    setup = pg.evaluate(f"(() => {{ const L = LESSONS.find(L => L.id === {E['lesson']}), c = cityOf(L); return {{ city: c.id, grade: c.grade, n: L.exam.length, pass: L.pass, mega: L.bossKind, story: !!c.story, bonus: !!L.bonus }} }})()")
    key, chk = E['key'], E['check']
    if len(base) != 40: errs.append(f'expected 40 items, got {len(base)}')
    if len(key) != len(base): errs.append(f'key has {len(key)} answers for {len(base)} items')
    chs = [q['ch'] for q in base]
    if chs != sorted(chs): errs.append('items are not in chapter order')
    if set(chs) != set(E['boss']): errs.append(f'chapters covered: {sorted(set(chs))}')
    if len({q['q'] + '|'.join(q['opts']) for q in base}) != len(base): errs.append('duplicate item')
    for i, q in enumerate(base):
        o, tag = q['opts'], f"ข้อ {i + 1} ({q['q'][:40]})"
        if len(o) != 3 or len(set(o)) != 3: errs.append(f'{tag}: needs 3 different options {o}')
        if not 0 <= q['a'] < len(o): errs.append(f'{tag}: bad a'); continue
        if q['lv'] not in E['lv'][q['ch']]: errs.append(f"{tag}: lv {q['lv']} is not a lesson of chapter {q['ch']}")
        want = key[i] if i < len(key) else None
        if callable(want): want = want(q['d'])
        if isinstance(want, str) and want.startswith('PP:'):
            if not q.get('pp'): errs.append(f'{tag}: no pictograph'); continue
            want = pp_answer(want, q['pp'], q['unit'])
        right = chk[i](o) if i in chk else [x for x in o if x == want]
        if right != [o[q['a']]]: errs.append(f"{tag}: marked {o[q['a']]!r}, computed {right or want!r}")
        for n in re.findall(r'\d[\d,]*', re.sub(r'<[^>]+>', ' ', q['q'])):
            if float(n.replace(',', '')) > E['limit']: errs.append(f'{tag}: number {n} above the range ({E["limit"]})')
    for r in runs:
        for i, q in enumerate(r):
            if q['opts'][q['a']] != base[i]['opts'][base[i]['a']]: errs.append(f'shuffled run: ข้อ {i + 1} answer moved wrong'); break
            if q['from'] != E['boss'][base[i]['ch']]: errs.append(f'ข้อ {i + 1}: from {q["from"]}'); break
    pos = {k: 0 for k in range(3)}
    for r in runs:
        for q in r: pos[q['a']] += 1
    if min(pos.values()) == 0: errs.append(f'answer position never shuffled: {pos}')
    if setup != {'city': E['city'], 'grade': E['grade'], 'n': 40, 'pass': 32, 'mega': 'mega', 'story': True, 'bonus': True}: errs.append(f'lesson setup: {setup}')
    print(f"{E['name']}: {len(base)} items · chapters " + ' '.join(f'{c}:{chs.count(c)}' for c in sorted(set(chs))) + f' · figures {sum(q["fig"] for q in base)} · answer positions over 30 runs {pos}')
    return [f"{E['name']}: {e}" for e in errs]

def main():
    errs = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None); pg = b.new_page(); pe = []
        pg.on('pageerror', lambda e: pe.append(str(e)))
        pg.goto(HTML.as_uri()); pg.wait_for_timeout(600)
        for E in EXAMS: errs += check(pg, E)
        b.close()
    if pe: errs.append(f'page errors: {pe}')
    if errs:
        print('\n'.join('FAIL ' + e for e in errs)); sys.exit(1)
    print('OK — every answer matches the computed key')

if __name__ == '__main__':
    main()
