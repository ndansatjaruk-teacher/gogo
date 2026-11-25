# Notes for AI coding agents

Thai primary-school maths game (ป.1–ป.6) built into ONE HTML file from `src/`. Read README.md, CONTRIBUTING.md (rules every lesson must follow) and docs/ADDING-A-LESSON.md before changing lessons. Building a whole new grade: docs/ADDING-A-GRADE.md (what to ask the user first, what to build, checks).

- Edit only `src/`. Never edit or commit `ผจญภัยไปกับ The Ascent.html` — GitHub Actions rebuilds it after merge.
- All `src/**/*.js` files share one global scope, joined in `src/order.txt` order. New files must be added there; top-level names must be unique (use the file's prefix).
- Many functions are written on one long line: never insert a `//` comment mid-line (it silently comments out the rest) — use `/* */`.
- After every change: `python3 tools/build.py --check` then `python3 tests/smoke.py --grade <n>` (or `--lesson <id>`). For `src/grades/p5/p5q.js` also run `tests/construction/edge_cases.py` and `solve_all.py`. For ม.1 ลำน้ำเรขา (`src/grades/m1/geo/`, read its README.md first) also run `tests/geo_m1.py` (add `--touch` / `--legacy` for finger / Safari-like zoom). Changed a drag page in ม.ต้น: `tests/mt_interact.py` (also `--touch`, `--legacy`). ม.1 บทที่ 7 อัตราส่วน (`src/grades/m1/m1r*.js`): `tests/ratio_m1.py` (also `--touch`). ม.1 บทที่ 6 สมการ (`src/grades/m1/m1q*.js`): `tests/equation_m1.py` (also `--touch`). Changed a step-by-step example or `teachGate`: `tests/step_gate.py --grade <n>`. For the term exams (`src/grades/p1/p1e.js`, `p2/p2e.js`, `p3/p3e.js`, `p4/p4x.js`, `p5/p5x.js`, `p6/p6x.js`) also run `tests/term_exam.py`. Changed any boss exam: also `tests/boss_opts.py` (≥3 different choices; wrong choices must be common child mistakes, not obviously off-topic).
- Changed questions in ป.1–ป.3: also `python3 tests/range.py --grade <n>` (numbers above the grade's range, incl. step results).
- Look at the result at 1180×820 (iPad landscape): every screen must fit without scrolling.
- docs/QUESTION-TYPES.md lists every `Q.*` question type — reuse before writing new ones; regenerate with `python3 tools/catalog.py`.
- docs/ARCHITECTURE.md is long (per-version history); search it instead of reading it whole. Add a short section for notable changes.
- User-facing text in the game is Thai. Lesson ids must never change (progress is saved by id).
