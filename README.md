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
- **CCDV-F study guide** — the Developer Foundations theory: an overview with the
  exam format, how to read a scenario question and the booking rules (`#/ccdv-f`),
  then a page per domain (`#/ccdv-f/d1` … `#/ccdv-f/d8`) with one lesson per
  official sub-skill — 25 of them, each with its own weight and the traps its
  distractors are built from — and a quiz of three to eight questions per domain.
- **CCAR-P study guide** — the Architect Professional theory: an overview with the
  exam format, how the items behave, the four distractor heuristics and the booking
  rules (`#/ccar-p`), then a page per domain (`#/ccar-p/d1` … `#/ccar-p/d7`) with
  one lesson per blueprint sub-skill — 38 of them, each with its bullet points and
  the traps its distractors are built from — and a quiz of three to ten questions
  per domain.
- **Go deeper** — under the key points of every lesson in all three guides, a
  folded long-form explanation: the mechanism behind the points, the decision rule
  between the options, how the exam frames the topic and one worked exam-style
  scenario. About 60,000 words over the 93 lessons; each domain page has one switch
  to expand or collapse them all.
- **Question bank** (`#/bank`) — 125 CCAR-F items, 106 CCDV-F items and 142 CCAR-P
  items, one exam at a time, filterable by domain, by difficulty and by whether you have answered them
  (or got them wrong). The reasoning appears as soon as you answer. Single
  response, multiple response and — on CCAR-P — classification items, the ones
  that hand you a criterion and a box per statement.
- **Mock exams** (`#/mock`) — CCAR-F's three full-length papers
  (`#/mock/ar-standard`, `#/mock/ar-challenge`, `#/mock/ar-practical`): 60 questions
  in 120 minutes at the real domain weights, the standard and the challenge paper
  sharing no question and the practical paper working the four production
  scenarios end to end. CCDV-F's two full-length papers
  (`#/mock/dv-standard`, `#/mock/dv-challenge`): 53 questions in 120 minutes, the
  real exam's own length and proportions. CCAR-P's two full-length papers
  (`#/mock/ap-standard`, `#/mock/ap-challenge`): 63 standalone items in 120 minutes
  at the blueprint weights, classification items included. On every paper the clock survives a
  reload, navigation is free, questions can be flagged, and nothing is revealed
  until you submit.
- **Results** (`#/mock/ar-standard/result`, or `#/result` for the most recent) — scaled score
  with a pass verdict, a per-domain breakdown, and every question reviewed with its
  explanation. The review can be narrowed to only the questions you missed (answered
  wrong or left blank); the choice is remembered across papers.

## Layout

```
index.html                    page shell: sidebar + <main>
assets/css/site.css           all styles; design tokens on :root
assets/js/content-ccar-f.js   CCAR-F domains: lessons and quiz questions
assets/js/questions-ccar-f.js CCAR-F question bank (125 items) and the three papers
assets/js/content-ccdv-f.js   CCDV-F domains: lessons and quiz questions
assets/js/questions-ccdv-f.js CCDV-F question bank (106 items) and the two papers
assets/js/content-ccar-p.js   CCAR-P domains: lessons and quiz questions
assets/js/questions-ccar-p.js CCAR-P question bank (142 items) and the two papers
assets/js/deep-ccar-f.js      the Go-deeper explanation of each lesson, one file per
assets/js/deep-ccdv-f.js      certification, keyed by lesson ref
assets/js/deep-ccar-p.js
assets/js/data.js             catalogue: certs, exam facts, apply steps
assets/js/app.js              hash router, rendering, localStorage progress
```

Every `content-*.js` file must load before `data.js` — the catalogue reads
`window.CCARF_DOMAINS`, `window.CCDVF_DOMAINS` and `window.CCARP_DOMAINS` when
they are defined. The `questions-*.js` files only have to load before `app.js`.

## Go deeper

Each lesson can fold a long-form explanation under its key points. The prose
lives apart from the lessons, in `assets/js/deep-<code>.js`, keyed by lesson ref:

```js
window.CCDVF_DEEP = {
  "2.3": [
    { h: "Subheading" },
    "A paragraph — <b>, <i> and <code> as in the lesson files.",
    { example: "A worked scenario, reasoned to the right answer." },
    { code: "…", label: "Optional caption" }
  ]
};
```

`data.js` attaches each entry to its lesson as `more`, so the files must load
before it; a lesson with no entry simply has no dropdown. Keeping them apart
leaves the lesson files scannable, and leaves CCAR-P's generated
`content-ccar-p.js` untouched. They are hand-edited — no generator — and were
written from the same sources as their guides: the CCAR-F study guide based on the
official exam guide, the CCDV-F Developer's Study Guide and 1.1 source, and the
CCAR-P study site. Which panels are open is kept for the session only, so a quiz
answer re-rendering the page does not fold them back up.

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

## CCDV-F content

Ported from the CCDV-F study guide 1.1 source document, whose domains, sub-skills
and weights come from the official exam guide v1.0: 8 domains, 25 sub-skills,
weights to one decimal. One lesson per sub-skill, in the same shape as CCAR-F plus
two extensions:

```js
concepts[]   // { ref, title, weight, body, points[], exam[] }
questions[]  // the end-of-domain quiz: { text, opts[4], correct, why }
```

- `exam` as an array renders as **Traps** — the wrong answers that tend to look
  right — rather than as a paragraph of exam notes.
- `weight` is the sub-skill's own share of the exam, shown beside its number.

Lesson and question text may carry `<b>`, `<i>` and `<code>`. `rich()` in `app.js`
turns exactly those three into elements and leaves every other angle bracket as
text, so a literal `<document>` in a prompt example survives as written and content
files cannot inject markup.

### Multiple response

CCDV-F asks both multiple-choice and multiple-response items, so `correct` is an
option index *or* an array of them, and an answer is stored the same way. A
multiple-response item is only scored when every option matches — there is no
partial credit, as on the real exam. In the study guide and the bank the picks are
held until the item is complete and then committed with **Check answer**; in a
paper each pick is saved as it happens, since there is no feedback to withhold.
Single-response answers saved by an earlier release still read back unchanged.

## CCAR-P content

Ported from the CCAR-P study guide and study-site sources, whose domains,
sub-skills and weights come from the official exam guide: 7 domains, 38
sub-skills, weights 17 / 13 / 19 / 16 / 14 / 14 / 7. One lesson per sub-skill, in
the same shape as CCDV-F minus `weight` — the CCAR-P blueprint publishes weights
per domain only, not per sub-skill:

```js
concepts[]   // { ref, title, body, points[], exam[] }
questions[]  // the end-of-domain quiz: { text, opts[4], correct, why }, or a
             // classification item (below): { type: "cls", text, cats[], stmts[], correct, why }
```

Both files are generated; the authoring source is in `tools/ccar-p/`. The domain
framing and the lead sentence on each lesson are written from the study guide's
own prose (its decision rules and exam traps); everything else — bullet points,
traps, questions and reasoning — is the port. See `tools/ccar-p/README.md`.

### Classification

The CCAR-P paper asks a third kind of item: a criterion, a handful of statements
and a box per statement — True or False, pre-processing or post-processing, which
chunking strategy each description matches. Those carry `type: "cls"`, list their
`cats` and their `stmts`, and their `correct` is one category index per statement,
in the order the statements are listed:

```js
{ type: "cls",
  text: "Classify each RAG activity as Pre-processing or Post-processing.",
  cats: ["Pre-processing", "Post-processing"],
  stmts: ["Chunking documents at section boundaries with overlap", /* … */],
  correct: [0, 1, 0, 1, 0],
  why: "…" }
```

An answer is stored the same way, with `null` where a row is still empty, and the
item is scored all or nothing: every statement has to match, as with multiple
response. In the study guide and the bank the placements are held until every row
is filled and then committed with **Check answer**; in a paper each placement is
saved as it happens, so a half-placed item survives a reload — it is kept as you
left it, shown with a dashed square in the question grid, and counts as
unanswered until it is complete.

Only CCAR-P has these items today. Nothing is CCAR-P-specific in the renderer, so
any `questions-*.js` or `content-*.js` file can use the same shape.

Note two facts that differ from the placeholder outline this release replaces:
CCAR-P has **no certification prerequisite** (Foundations is recommended, not
required) and the paper is **63 items**, not the 60 the design source showed.
Eligibility is the Claude Partner Network membership, not a prior exam.

## Question bank and mock exams

`assets/js/questions-ccar-f.js` holds 125 items: 120 written from the official
guide's practice set and its domain notes, plus five from the practical test that
those 120 do not already cover.

```js
window.CCARF_BANK  // { id, dom, diff, scen, text, opts[4], correct, why }
window.CCARF_MOCKS // { id, label, diff, minutes, blurb, ids[60] }
```

The bank is deliberately free of the usual multiple-choice tells. The correct
option sits in each of the four positions 31 or 32 times, and is the longest of
the four in 32 of the 125 items — chance, not a signal. Distractors are the
answers the guide's own explanations name as tempting (a prompt fix where code is
needed, an over-engineered classifier, a symptom filter), not filler.

The standard and the challenge paper partition the 120 core items: each item
appears in exactly one of the two, 60 questions a paper at the exam's domain
weights (27/18/20/20/15, so 16/10/12/12/10). They never repeat a question, so the
pair can be sat back to back — the same length, the same shape and the same
allowance as the real exam.

The third is the practical paper. The practical test it comes from overlaps the
guide's practice set almost completely — only five of its 60 questions ask
something the core bank does not already ask — so it carries those five and fills
its remaining 55 slots, at the same domain weights, from the core items covering
the same four production scenarios, standard and challenging mixed. It is the one
paper that repeats questions the other two already ask, and `emit.py` asserts that
it does not repeat one within itself.

Scoring maps the raw score onto the exam's 100–1000 scale — `100 + 900 × correct /
total`, pass at 720. That is a presentation of your raw score, not the certifying
organisation's scoring model.

The bank is generated. The authoring source is in `tools/questions/` (one Python
file per domain, plus the emitter that places the answers and builds the papers);
`questions-ccar-f.js` is its output and should not be hand-edited. See
`tools/questions/README.md`.

`assets/js/questions-ccdv-f.js` holds CCDV-F's 106 items — the two full-length
papers of the study guide 1.1 source — in the same shape, minus `scen` (the
CCDV-F items are not tied to named production scenarios):

```js
window.CCDVF_BANK  // { id, dom, diff, text, opts[4], correct, why }
window.CCDVF_MOCKS // { id, label, diff, minutes, blurb, ids[53] }
```

The standard and the challenge paper partition the bank: every item is in exactly
one of the two, at the official weights over 53 questions (8 / 17–18 / 2 / 1 / 9 /
6 / 4 / 5–6), so the pair can be sat back to back without repetition. Within a
paper the order was shuffled once, at porting time, so a run does not walk the
syllabus domain by domain. Unlike CCAR-F's, this file is not generated from a
`tools/` source: it is the port itself, and is edited directly.

`assets/js/questions-ccar-p.js` holds CCAR-P's 142 items — the 126 of the
study-site source's two full-length papers, plus 16 written for this wiki — in
the same shape, plus the classification items described below:

```js
window.CCARP_BANK  // { id, dom, diff, text, opts[4], correct, why }
window.CCARP_MOCKS // { id, label, diff, minutes, blurb, ids[63] }
```

Again no item is on both papers, at the blueprint weights over 63 questions
(11 / 8 / 12 / 10 / 9 / 9 / 4), and the order within a paper is shuffled once at
build time. The source it came from shuffled options at runtime and so
kept its correct answer in position B in about 90% of items; `emit.py` permutes
instead, leaving the answer in each of the four positions about a quarter of the
time (32 / 31 / 31 / 30 of the 124 picks) and the longest option among the
correct ones in a third of the items — chance, not a signal: a two-answer item
has two chances of holding the longest of the four.

### The wiki's own items

The port stops where its source stopped. It has nothing on context editing,
compaction, the memory tool, the effort parameter, the Files API, eager tool
streaming, deferred tool loading, the model lifecycle, or the operational side
of Claude Code — telemetry, `/mcp`, session hygiene — all of which the blueprint
covers under D2, D3, D6 and D7. Sixteen items in `tools/ccar-p/extra.py` close
that gap. They are ours, not a port of anyone's bank: each cites the Anthropic
documentation page its facts come from, read in September 2026.

Each takes the paper slot of a ported item in the same domain, so both papers
stay at 63 questions and the blueprint weights, and the item that steps aside
stays in the bank on no paper — 16 of the 142 are bank-only for that reason.
Because those 16 describe a product surface that moves, they are the items most
likely to go stale: when a cited page changes, re-read it and fix the item.

Twenty-one of the items are classification items rather than option items — the
five in the study guide's quizzes and sixteen across the two papers, where each
takes one of the 63 slots and leaves the domain weights untouched:

```js
{ id, dom, diff, type: "cls", text, cats[], stmts[], correct, why }
```

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
   file before `data.js` in `index.html`. `exam` (the fact cards) and `panels` (the
   lists below the domains) on that entry are optional and render as given.
3. Add the certification to `GUIDES` in `assets/js/app.js` — the sidebar link, the
   roadmap card link and the `#/<slug>` routes follow from that one entry.

To give it practice as well, write `assets/js/questions-<code>.js` in the shape
above, load it before `app.js`, and add one row to `PRACTICE` in `app.js`. Items
and papers are tagged with their certification as they are collected, so the bank
filter, the paper index and the results pages pick them up. A paper's rules on its
start page come from `EXAM_RULES[<code>]`, and the line above its cards from
`MOCK_NOTES[<code>]`.

## Deployment

`.github/workflows/pages.yml` publishes the repository root on every push to `main`.
In repository **Settings → Pages**, set **Source** to **GitHub Actions**.
