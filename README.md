# Certification Wiki

Static study wiki for the Claude certifications (CCAR-F, CCDV-F, CCAR-P), deployed to
GitHub Pages: <https://vicxs.github.io/xpl-ai-certifications/>

Ported by hand from the Claude Design source `Cert Wiki Flow.dc.html`
(project `9eda2a04-784c-4de9-b46d-c9d2151dbd6e`). The design's own runtime
(`support.js`) needs React globals supplied by the design canvas, so it cannot
render standalone — this is plain HTML, CSS and vanilla JS with no build step.

## Live in this release

- **Introduction** — roadmap across the three certifications, how the wiki works.
- **Applying & booking** — the five application steps with per-step ticks, and the
  exam-day checklist.
- **CCAR-F study guide** — the full Architect Foundations theory: an overview with
  the exam format and the eight exam scenarios (`#/ccar-f`), then a page per domain
  (`#/ccar-f/d1` … `#/ccar-f/d5`) with 30 lessons and a six-question quiz at the end
  of each domain.
- **Question bank** (`#/bank`) — all 125 CCAR-F practice items, filterable by domain,
  by difficulty and by whether you have answered them (or got them wrong). The
  reasoning appears as soon as you pick an option.
- **Mock exams** (`#/mock`, `#/mock/a` … `#/mock/e`) — five timed 30-question papers
  at the real domain weights: A and B standard, C and D harder, E the practical
  paper. 60 minutes on a clock that survives a reload, free navigation between
  questions, flags, and no feedback until you submit.
- **Results** (`#/mock/a/result`, or `#/result` for the most recent) — scaled score
  with a pass verdict, a per-domain breakdown, and every question reviewed with its
  explanation.

CCDV-F and CCAR-P are shown in the navigation with a `soon` tag.

## Layout

```
index.html                    page shell: sidebar + <main>
assets/css/site.css           all styles; design tokens on :root
assets/js/content-ccar-f.js   CCAR-F domains: lessons and quiz questions
assets/js/questions-ccar-f.js CCAR-F question bank (125 items) and the five papers
assets/js/data.js             catalogue: certs, CCDV-F/CCAR-P outlines, apply steps
assets/js/app.js              hash router, rendering, localStorage progress
```

`content-ccar-f.js` must load before `data.js` — the catalogue reads
`window.CCARF_DOMAINS` when it is defined. `questions-ccar-f.js` only has to load
before `app.js`.

## CCAR-F content

Written from the official exam guide (5 domains, 30 lessons) and the published
course outline. Each domain carries:

```js
concepts[]   // one lesson: { ref, title, body, points[], code?, exam? }
questions[]  // the end-of-domain quiz: { d, text, opts[4], correct, why }
```

`concepts` and `questions` keep the names the rest of the app already used, so the
progress bar counts lessons read plus quiz questions answered correctly without
any extra wiring. Answers are revealed with their explanation as soon as an option
is picked; each quiz can be reset on its own.

Item count, duration and fee shown on the roadmap come from the design source, not
from the official guide — confirm them before booking.

## Question bank and mock exams

`assets/js/questions-ccar-f.js` holds 125 items: 120 written from the official
guide's practice set and its domain notes, plus five from the practical test that
those 120 do not already cover.

```js
window.CCARF_BANK  // { id, dom, diff, scen, text, opts[4], correct, why }
window.CCARF_MOCKS // { id, label, diff, minutes, blurb, ids[30] }
```

The bank is deliberately free of the usual multiple-choice tells. The correct
option sits in each of the four positions 31 or 32 times, and is the longest of
the four in 32 of the 125 items — chance, not a signal. Distractors are the
answers the guide's own explanations name as tempting (a prompt fix where code is
needed, an over-engineered classifier, a symptom filter), not filler.

Papers A–D partition the 120 core items: each appears in exactly one of them, at
the exam's domain weights (27/18/20/20/15) over 30 questions. A and B are the
standard pair, C and D the harder pair, so the two papers of a pair never repeat a
question.

Paper E is the practical paper. The practical test it comes from overlaps the
guide's practice set almost completely — only five of its 60 questions ask
something the core bank does not already ask — so E carries those five and fills
its remaining 25 slots, at the same domain weights, from the core items covering
the same four production scenarios. It is the one paper that repeats questions
A–D already ask, and `emit.py` asserts that it does not repeat one within itself.

Scoring maps the raw score onto the exam's 100–1000 scale — `100 + 900 × correct /
total`, pass at 720. That is a presentation of your raw score, not the certifying
organisation's scoring model.

The bank is generated. The authoring source is in `tools/questions/` (one Python
file per domain, plus the emitter that places the answers and builds the papers);
`questions-ccar-f.js` is its output and should not be hand-edited. See
`tools/questions/README.md`.

## Running locally

```sh
python3 -m http.server 8000
# http://localhost:8000
```

Progress is stored in `localStorage` under `certwiki.flow.v1`, in the shape the
design established: `done` and `quizAnswers` for the study guide, `steps` for the
application checklist, `bankAnswers` for the question bank, and `attempts` plus
`scores` for the mock papers. "Reset progress" in the sidebar clears all of it.

An exam in progress is persisted with an absolute `deadline`, so closing the tab
does not stop the clock — reopening the paper resumes it where it stood, and a
deadline that has passed submits and scores on the next tick.

## Adding a section

1. Add the route to `ROUTES` in `assets/js/app.js`.
2. Write a `renderX()` returning a `.page` element, and dispatch to it in `render()`.
3. Drop the `soon` treatment from its sidebar entry in `renderSidebar()`.

## Adding another study guide

1. Write the domains into `assets/js/content-<code>.js`, same shape as CCAR-F.
2. Point that certification's `domains` at it in `assets/js/data.js`, and load the
   file before `data.js` in `index.html`.
3. Add the certification to `GUIDES` in `assets/js/app.js` — the sidebar link, the
   roadmap card link and the `#/<slug>` routes follow from that one entry.

## Deployment

`.github/workflows/pages.yml` publishes the repository root on every push to `main`.
In repository **Settings → Pages**, set **Source** to **GitHub Actions**.
