#!/usr/bin/env python3
"""Build the game into ONE self-contained HTML file.

    python3 tools/build.py            # build → dist/index.html  (open it in a browser)
    python3 tools/build.py --check    # build, then syntax-check the JavaScript with Node
    python3 tools/build.py --publish  # build → ผจญภัยไปกับ The Ascent.html (GitHub Actions does this after merge)

How it works: every file listed in src/order.txt is joined (in that order) into one
<script>, and src/style.css goes into one <style>. All files share one global scope,
so a file may only use names defined in files listed ABOVE it.
"""
import argparse, pathlib, re, shutil, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
OUT = ROOT / 'dist' / 'index.html'  # local build (git-ignored) · GitHub Actions publishes the root HTML after merge
PUBLISHED = ROOT / 'ผจญภัยไปกับ The Ascent.html'


def order():
    lines = (SRC / 'order.txt').read_text(encoding='utf-8').splitlines()
    files = [l.strip() for l in lines if l.strip() and not l.lstrip().startswith('#')]
    missing = [f for f in files if not (SRC / f).is_file()]
    if missing:
        sys.exit('order.txt lists missing files: ' + ', '.join(missing))
    listed = {str(pathlib.Path(f)) for f in files}
    unlisted = sorted(str(p.relative_to(SRC)) for p in SRC.rglob('*.js') if str(p.relative_to(SRC)) not in listed)
    if unlisted:
        sys.exit('JS files not listed in src/order.txt (add them or delete them): ' + ', '.join(unlisted))
    return files


def build():
    css = (SRC / 'style.css').read_text(encoding='utf-8')
    js = '\n'.join((SRC / f).read_text(encoding='utf-8') for f in order())
    return f'''<!DOCTYPE html>
<html lang="th"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="theme-color" content="#FBF6EC">
<title>ผจญภัยไปกับ The Ascent</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600;700&family=Nunito:wght@700;800;900&family=Mali:wght@500&display=swap" rel="stylesheet">
<style>{css}</style></head>
<body><div id="app"></div>
<script>{js}</script></body></html>''', js


def check(js):
    node = shutil.which('node')
    if not node:
        sys.exit('--check needs Node.js (https://nodejs.org) on PATH')
    bad = []
    for f in order():  # each file alone first: the error then names the real file and line
        r = subprocess.run([node, '--check', str(SRC / f)], capture_output=True, text=True)
        if r.returncode:
            bad.append(r.stderr.strip())
    if bad:
        sys.exit('Syntax errors:\n\n' + '\n\n'.join(bad))
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as t:
        t.write(js)
    r = subprocess.run([node, '--check', t.name], capture_output=True, text=True)
    pathlib.Path(t.name).unlink()
    if r.returncode:  # e.g. the same top-level name declared in two files
        msg = r.stderr.strip()
        m = re.search(r"Identifier '([^']+)' has already been declared", msg)
        if m:
            name = m.group(1)
            hits = [f for f in order() if re.search(rf'^(?:const|let|class|function)\s+{re.escape(name)}\b', (SRC / f).read_text(encoding='utf-8'), re.M)]
            msg += f"\n\nTop-level '{name}' is declared in: {', '.join(hits) or '(search the files)'} — rename one."
        sys.exit('Combined script fails:\n' + msg)
    print('syntax OK')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true', help='syntax-check with Node after building')
    ap.add_argument('--out', default=str(OUT), help='output file (default: %(default)s)')
    ap.add_argument('--publish', action='store_true', help='write the published file at the repo root instead')
    a = ap.parse_args()
    if a.publish:
        a.out = str(PUBLISHED)
    html, js = build()
    if a.check:
        check(js)
    pathlib.Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    pathlib.Path(a.out).write_text(html, encoding='utf-8')
    print(f'built {a.out} ({len(html.encode()) / 1e6:.1f} MB)')
