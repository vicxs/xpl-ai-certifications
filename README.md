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

CCDV-F, CCAR-P, the question bank, mock exams and results are shown in the
navigation with a `soon` tag.

## Layout

```
index.html                    page shell: sidebar + <main>
assets/css/site.css           all styles; design tokens on :root
assets/js/content-ccar-f.js   CCAR-F domains: lessons and quiz questions
assets/js/data.js             catalogue: certs, CCDV-F/CCAR-P outlines, apply steps
assets/js/app.js              hash router, rendering, localStorage progress
```

`content-ccar-f.js` must load before `data.js` — the catalogue reads
`window.CCARF_DOMAINS` when it is defined.

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

## Running locally

```sh
python3 -m http.server 8000
# http://localhost:8000
```

Progress is stored in `localStorage` under `certwiki.flow.v1`, in the same shape as
the design, so the remaining routes inherit it when they ship. "Reset progress" in
the sidebar clears it.

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
