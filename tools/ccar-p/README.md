# CCAR-P study guide and question bank — source

`assets/js/content-ccar-p.js` and `assets/js/questions-ccar-p.js` are both
generated from these files. Regenerate with:

```sh
cd tools/ccar-p && python3 emit.py
```

- `source.json` — the port itself: the 7 domains with their 38 sub-skills
  (bullet points and traps), the 47 check-yourself questions, and the two
  63-item papers, extracted verbatim from the CCAR-P study-site source. Not
  hand-edited; anything wrong in it is wrong upstream. Its 21 classification
  items carry `t: "cls"`, the categories and one category per statement.
- `meta.py` — the writing that is ours: each domain's `short` name, card
  summary and lead paragraph, and one lead sentence per sub-skill, drawn from
  the CCAR-P study guide's prose (its decision rules and exam traps).
- `extra.py` — the 16 items written for this wiki, in the same shape as a
  source question plus the paper slot each one takes. The only questions here
  that are not the port; every fact in them cites the Anthropic documentation
  page it came from.
- `emit.py` — resolves the items, places the correct option, splices ours into
  the papers, and writes both JS files.

## The three item types

Option items resolve to `{ text, opts[4], correct, why }`, where `correct` is an
option index or a pair of them. The source's 21 "classify these five statements"
exercises resolve to `{ type: "cls", text, cats[], stmts[], correct, why }`
instead, `correct` being one category index per statement: the real paper asks
them that way — a criterion, a list of statements and a box per statement — and
the site now renders them that way. They are not permuted (position carries no
signal when the answer is a category) and they score all or nothing, exactly as
a multiple-response item does.

## Where our own items go

Each entry in `extra.py` names the ported item whose paper slot it takes. The
replacement is always within the same domain, so both papers keep 63 questions
at the blueprint weights; `emit.py` asserts that, and that no slot is claimed
twice. The displaced item is not deleted — it stays in the bank with its own id,
drillable, on no paper.

## Why placement matters

The site the items came from shuffled options at runtime, so its source keeps
the correct answer in position B in about 90% of items. This wiki does not
shuffle, so `emit.py` permutes instead: single-answer items cycle through the
four positions and two-answer items through the six pairs, leaving the answer in
each position about a quarter of the time. None of the explanations refer to an
option by letter, which is what makes the permutation safe.
