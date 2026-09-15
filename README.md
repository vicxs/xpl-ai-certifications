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

Everything else (study guides, question bank, mock exams, results) is shown in the
navigation with a `soon` tag. Their content already lives in
`assets/js/data.js`, so each remaining section is a render function plus a route.

## Layout

```
index.html              page shell: sidebar + <main>
assets/css/site.css     all styles; design tokens on :root
assets/js/data.js       certifications, domains, concepts, questions, apply steps
assets/js/app.js        hash router, rendering, localStorage progress
```

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

## Deployment

`.github/workflows/pages.yml` publishes the repository root on every push to `main`.
In repository **Settings → Pages**, set **Source** to **GitHub Actions**.
