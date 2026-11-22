#!/usr/bin/env python3
"""Answer check for the term exams: ป.1 (term 1 = lesson 398 · term 2 = 397 · src/grades/p1/p1e.js) and ป.2 (term 1 = 1098 · term 2 = 1097 · src/grades/p2/p2e.js).

    python3 tools/build.py && python3 tests/term_exam.py

The answer key below is worked out here in Python, separately from the game file, and every item is checked against it:
the option at `a` must equal the computed answer, and none of the other options may equal it.
Also checked: 40 items, 3 different options each, chapters 1–5 in order, every chapter present, `lv` is a lesson of
that chapter's city, `from` is that chapter's boss, the answer position is shuffled each attempt but stays right,
and no number in a question is above the grade's range (ป.1 term 1 ≤ 20 · ป.1 term 2 ≤ 100 · ป.2 ≤ 1,000).
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

ITEMS = r"""v => eval(v).map(q => { const o = { q: q.q, opts: q.opts.map(x => typeof x === 'string' ? x : x.say || JSON.stringify(x)), a: q.a, ch: q.ch, lv: q.lv, fig: !!(q.fig || q.pic || q.blocks != null || q.chart || q.bal || q.scale || q.line || q.grid || q.race || q.shelf || q.solid || q.shape || q.seq || q.lenb || q.vert || q.vsub),
    d: { pic: q.pic, blocks: q.blocks, chart: q.chart, bal: q.bal, scale: q.scale, line: q.line, grid: q.grid, race: q.race, shelf: q.shelf, seq: q.seq, lenb: q.lenb, vert: q.vert, vsub: q.vsub } };
  if (q.fig && /class="pp /.test(q.fig)) { const d = document.createElement('div'); d.innerHTML = q.fig; const k = +d.querySelector('.pp-key').textContent.match(/แทนจำนวน\D*(\d+)/)[1];
    o.pp = [...d.querySelectorAll('.pp-row')].map(r => [r.querySelector('.pp-lab').textContent, (r.querySelectorAll('.pp-i:not(.half)').length + r.querySelectorAll('.pp-i.half').length / 2) * k]); o.unit = q.opts[q.a].split(' ').pop(); }
  return o; })"""

def check(pg, E):
    errs, var = [], E['var']
    base = pg.evaluate(ITEMS, var)
    runs = pg.evaluate(f"Array.from({{ length: 30 }}, () => LESSONS.find(L => L.id === {E['lesson']}).examGen().map(q => ({{ opts: q.opts.map(x => typeof x === 'string' ? x : x.say || JSON.stringify(x)), a: q.a, from: q.from }})))")
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
            if int(n.replace(',', '')) > E['limit']: errs.append(f'{tag}: number {n} above the range ({E["limit"]})')
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
