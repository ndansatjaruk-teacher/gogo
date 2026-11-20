#!/usr/bin/env python3
"""Range check: flag numbers in game questions (and boss exams) that are above what the grade has learned.

    python3 tests/range.py                 # ป.1–ป.3 (the grades with a number limit)
    python3 tests/range.py --grade 2       # only ป.2
    python3 tests/range.py --rounds 5      # build each game 5 times (more random variants)

Limits: ป.1 ≤ 100 · ป.2 ≤ 1,000 · ป.3 ≤ 100,000. Checked: every number the child reads in the question card,
and the result of every "a op b" the card shows (also inside brackets), so a step result above the limit is caught too.
Answer choices are skipped (a wrong choice may be out of range on purpose).
Numbers right before a small unit (กรัม มิลลิลิตร มิลลิเมตร เซนติเมตร) and Buddhist years (พ.ศ.) are listed apart:
unit conversions may legitimately go higher (e.g. ป.2 8,900 กรัม). This is a report for a teacher to read, not a pass/fail gate,
unless --strict (then any plain-number hit fails).
Run `python3 tools/build.py` first. CHROME=/path/to/chrome uses that browser.
"""
import argparse, os, pathlib, re, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'dist' / 'index.html'
LIMIT = {1: 100, 2: 1000, 3: 100000}

# page side: for one lesson, build the game `rounds` times and return the text of every question card
TEXTS = r"""([li, rounds]) => {
  const L = LESSONS[li], out = [], W = window, keep = { say: W.say, st: W.setTimeout, si: W.setInterval, raf: W.requestAnimationFrame };
  const strip = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  /* what the child reads as the question: prompt + the card, without answer choices, keypads and hint text */
  const card = q => { const d = document.createElement('div'); W.say = () => {}; W.setTimeout = () => 0; W.setInterval = () => 0; W.requestAnimationFrame = () => 0;
    try { q.mount(d, { check() {}, say() {}, why() {}, progress() {} }); } catch (_) { } finally { Object.assign(W, { say: keep.say, setTimeout: keep.st, setInterval: keep.si, requestAnimationFrame: keep.raf }); }
    d.querySelectorAll('.opts, .opt, .ans, .pad-msg, .keypad, .seg, .pad-tools, .qsig-skip, .ixs, .cards, .bins').forEach(n => n.remove()); return strip(`${q.prompt || ''} ${qText(d)}`); };
  for (let r = 0; r < rounds; r++) {
    let qs = []; try { qs = L.boss ? (typeof L.exam === 'function' ? L.exam() : (L.exam || [])) : gameSet(L); } catch (_) { }
    (qs || []).forEach(q => { if (!q || typeof q !== 'object') return; out.push(q.mount ? card(q) : strip(q.q || q.text)); });
  }
  return [...new Set(out.filter(Boolean))];
}"""

NUM = r'\d{1,3}(?:,\d{3})+|\d+'
UNIT = re.compile(r'^\s*(กรัม|ก\.|มิลลิลิตร|มล\.|มิลลิเมตร|มม\.|เซนติเมตร|ซม\.|วินาที|ขีด)')
OPS = {'+': lambda a, b: a + b, '−': lambda a, b: a - b, '-': lambda a, b: a - b, '×': lambda a, b: a * b, '÷': lambda a, b: a / b if b else 0}
PAIR = re.compile(rf'({NUM})\s*([+−×÷])\s*({NUM})')


def scan(text, limit):
    plain, unit = [], []
    for m in re.finditer(NUM, text):
        v = int(m.group().replace(',', ''))
        if v <= limit: continue
        before, after = text[max(0, m.start() - 6):m.start()], text[m.end():m.end() + 12]
        if 2400 <= v <= 2700 and ('พ.ศ' in before or before.rstrip().endswith('.')): continue  # a Buddhist year (พ.ศ. 2561 · 01 ส.ค. 2561)
        (unit if UNIT.match(after) else plain).append(m.group())
    for m in PAIR.finditer(text):
        a, op, b = int(m.group(1).replace(',', '')), m.group(2), int(m.group(3).replace(',', ''))
        r = OPS[op](a, b)
        if r > limit and a <= limit and b <= limit:
            (unit if UNIT.match(text[m.end():m.end() + 12]) else plain).append(f'{m.group()} = {r:g}')
    return plain, unit


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--grade', type=int, nargs='*', default=[1, 2, 3])
    ap.add_argument('--rounds', type=int, default=3)
    ap.add_argument('--strict', action='store_true')
    a = ap.parse_args()
    if not HTML.exists(): sys.exit('Build first: python3 tools/build.py')
    hits = 0
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'])
        pg = b.new_page(viewport={'width': 1180, 'height': 820})
        pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=''))
        pg.route('https://fonts.gstatic.com/**', lambda r: r.abort())
        pg.goto(HTML.as_uri()); pg.wait_for_timeout(800)
        pg.evaluate('SET.mute = true; window.say = () => {}; 0')
        lessons = pg.evaluate('LESSONS.map((L, i) => ({ i, id: L.id, title: L.title, grade: (CITIES.find(c => c.lessons.includes(L)) || {}).grade || 1 }))')
        for L in lessons:
            g = L['grade']
            if g not in a.grade or g not in LIMIT: continue
            plain, unit = {}, {}
            for t in pg.evaluate(TEXTS, [L['i'], a.rounds]):
                p_, u_ = scan(t, LIMIT[g])
                for x in p_: plain.setdefault(x, t[:110])
                for x in u_: unit.setdefault(x, t[:110])
            if plain or unit:
                print(f"ป.{g} #{L['id']} {L['title']}")
                for x, t in plain.items(): print(f'   ! {x}   ← {t}'); hits += 1
                for x, t in unit.items(): print(f'   · (หน่วยวัด) {x}   ← {t}')
        b.close()
    print(f'\n{hits} plain-number hit(s) above the grade limit' if hits else '\nno plain-number hits ✓')
    if a.strict and hits: sys.exit(1)


if __name__ == '__main__':
    main()
