#!/usr/bin/env python3
"""Every step-by-step example must be watched to the end before “ถัดไป” opens (v242, ผู้ใช้ขอ — ทุกเกม).

For each teach page that has a step button (ขั้นต่อไป …): the next button must be locked at the start,
must stay locked while steps remain (also while the button is briefly disabled by an animation),
and must open after the last step.
  python3 tests/step_gate.py [--grade 7 8 9] [--lesson 2210]
"""
import argparse, os, pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser(); ap.add_argument('--grade', type=int, nargs='*'); ap.add_argument('--lesson', type=int, nargs='*'); A = ap.parse_args()
STEP = "/ขั้นต่อไป|ขั้นถัดไป|หลักต่อไป|ข้อต่อไป|รอบต่อไป|ภาพต่อไป|ด้านต่อไป|ประโยคถัดไป/"
FIND = f"(() => [...document.querySelectorAll('#stage .visual button')].find(b => {STEP}.test(b.textContent) && b.offsetParent !== null) || null)()"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox']); pg = b.new_page(viewport={'width': 1180, 'height': 820})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:150]))
    pg.goto((ROOT / 'dist' / 'index.html').as_uri()); pg.wait_for_timeout(800); pg.evaluate("SET.mute = true; window.say = () => {}; 0")
    ls = pg.evaluate("LESSONS.map((L, i) => ({ i, id: L.id, n: (L.teach || []).length, g: (CITIES.find(c => c.lessons.includes(L)) || {}).grade || 1 }))")
    ls = [L for L in ls if (not A.grade or L['g'] in A.grade) and (not A.lesson or L['id'] in A.lesson)]
    pages = bad = 0
    for L in ls:
        for t in range(L['n']):
            pg.evaluate(f"startTeach({L['i']}, {t})"); pg.wait_for_timeout(250)
            if not pg.evaluate(f"!!{FIND}"): continue
            pages += 1; locked = lambda: pg.evaluate("!!document.querySelector('.btn.primary.waiting')"); prob = []
            if not locked(): prob.append('not locked at start')
            for k in range(40):
                if not pg.evaluate(f"(() => {{ const b = {FIND}; if (!b) return false; b.click(); return true; }})()"): break
                pg.wait_for_timeout(120)
                still = pg.evaluate(f"!!{FIND}")
                if still and not locked() and not prob: prob.append(f'opens after step {k + 1} while steps remain')
                for _ in range(60):   # wait while an animation keeps the button disabled
                    if not pg.evaluate(f"(() => {{ const b = {FIND}; return !!b && b.disabled; }})()"): break
                    pg.wait_for_timeout(100)
            for _ in range(20):
                if not locked(): break
                pg.wait_for_timeout(100)
            if locked() and not pg.evaluate(f"!!{FIND}"):
                # other things on the page may still be required (cards to flip …) — report, a person decides
                prob.append('still locked after the last step (other task left?)')
            if prob: bad += 1; print(f"✗ {L['id']} teach {t}: " + '; '.join(prob), flush=True)
    print(f'{pages} step pages · {bad} with problems', errs[:3])
    sys.exit(1 if bad else 0)
