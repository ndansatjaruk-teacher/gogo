#!/usr/bin/env python3
"""Smoke test: open every lesson, every teach page and every game question; fail on any JS error.

    pip install playwright && python3 -m playwright install chromium
    python3 tests/smoke.py                   # all lessons
    python3 tests/smoke.py --grade 5         # only ป.5
    python3 tests/smoke.py --lesson 634 635  # only these lesson ids
    python3 tests/smoke.py --shots out/      # also save a screenshot of each teach page

Run `python3 tools/build.py` first — this test opens the built HTML file.
CHROME=/path/to/chrome uses that browser instead of Playwright's Chromium.
"""
import argparse, json, os, pathlib, sys, time
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'dist' / 'index.html'

# Runs inside the page: mounts each game question in a hidden box with a stub ctx, then reveals it.
MOUNT_ALL = r"""(li) => {
  const L = LESSONS[li], errs = [], warn = []; let n = 0;
  if (L.boss) return { n, errs, warn }; // boss levels use their own exam set
  const box = document.createElement('div'); box.style.cssText = 'position:fixed;left:-5000px;top:0;width:1100px;height:700px;container-type:inline-size;container-name:stage';
  document.body.append(box);
  let qs = []; try { qs = gameSet(L); } catch (e) { errs.push('gameSet: ' + e.message); }
  { const gm = typeof gameMin === 'function' ? gameMin(L) : 8; if (qs.length < gm) warn.push(`only ${qs.length} game questions (rule: at least ${gm})`); } /* ป.1: 10 (v209) */
  for (const q of qs) {
    n++; box.replaceChildren(); const bd = document.createElement('div'); box.append(bd);
    const ctx = { check() {}, say() {}, why() {}, progress() {}, onRight: null };
    try { q.mount(bd, ctx); } catch (e) { errs.push(`q${n} mount "${String(q.prompt || '').replace(/<[^>]+>/g, '').slice(0, 60)}": ${e.message}`); continue; }
    try { revealAll(bd, ctx, q); } catch (e) { errs.push(`q${n} reveal: ${e.message}`); }
  }
  box.remove(); return { n, errs, warn };
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--grade', type=int, nargs='*')
    ap.add_argument('--lesson', type=int, nargs='*')
    ap.add_argument('--viewport', default='1180x820', help='iPad landscape by default')
    ap.add_argument('--shots', help='folder for teach-page screenshots')
    ap.add_argument('--strict', action='store_true', help='also fail on warnings (e.g. a game with fewer than 8 questions)')
    a = ap.parse_args()
    if not HTML.exists():
        sys.exit('Build first: python3 tools/build.py')
    w, h = map(int, a.viewport.split('x'))
    fails, warns, t0 = [], [], time.time()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'])
        pg = b.new_page(viewport={'width': w, 'height': h})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=''))
        pg.route('https://fonts.gstatic.com/**', lambda r: r.abort())
        pg.goto(HTML.as_uri()); pg.wait_for_timeout(800)
        pg.evaluate('SET.mute = true; window.say = () => {}; 0')
        if errs:
            sys.exit('Error while loading the game:\n' + '\n'.join(errs))
        lessons = pg.evaluate('LESSONS.map((L, i) => ({ i, id: L.id, title: L.title, grade: (CITIES.find(c => c.lessons.includes(L)) || {}).grade || 1, pages: (L.teach || []).length, boss: !!L.boss }))')
        if a.grade:
            lessons = [L for L in lessons if L['grade'] in a.grade]
        if a.lesson:
            lessons = [L for L in lessons if L['id'] in a.lesson]
        nq = npg = 0
        for k, L in enumerate(lessons):
            tag = f"ป.{L['grade']} #{L['id']} {L['title'][:40]}"
            for i in range(L['pages']):
                errs.clear()
                try:
                    pg.evaluate(f"startTeach({L['i']}, {i})"); pg.wait_for_timeout(60)
                except Exception as e:
                    errs.append(str(e).splitlines()[0])
                npg += 1
                if a.shots:
                    pathlib.Path(a.shots).mkdir(parents=True, exist_ok=True)
                    pg.screenshot(path=f"{a.shots}/{L['id']}_{i}.png")
                for e in errs:
                    fails.append(f'{tag} · teach page {i + 1}: {e}')
            errs.clear()
            try:
                r = pg.evaluate(MOUNT_ALL, L['i'])
            except Exception as e:
                r = {'n': 0, 'errs': [str(e).splitlines()[0]], 'warn': []}
            nq += r['n']; warns += [f'{tag}: {w}' for w in r.get('warn', [])]
            for e in r['errs'] + errs:
                fails.append(f'{tag} · game: {e}')
            if (k + 1) % 50 == 0:
                print(f'  … {k + 1}/{len(lessons)} lessons', flush=True)
        b.close()
    print(f'{len(lessons)} lessons · {npg} teach pages · {nq} game questions · {time.time() - t0:.0f}s')
    if warns:
        print(f'\n{len(warns)} warning(s):'); print('\n'.join('  ! ' + w for w in warns))
    if a.strict:
        fails += warns
    if fails:
        print(f'\n{len(fails)} problem(s):'); print('\n'.join('  ✗ ' + f for f in fails)); sys.exit(1)
    print('all good ✓')


if __name__ == '__main__':
    main()
