# CCAR-P study guide and question bank — source

`assets/js/content-ccar-p.js` and `assets/js/questions-ccar-p.js` are both
generated from these files. Regenerate with:

```sh
cd tools/ccar-p && python3 emit.py
```

- `source.json` — the port itself: the 7 domains with their 38 sub-skills
  (bullet points and traps), the 47 check-yourself questions, and the two
  63-item papers, extracted verbatim from the CCAR-P study-site source. Not
  hand-edited; anything wrong in it is wrong upstream.
- `meta.py` — the writing that is ours: each domain's `short` name, card
  summary and lead paragraph, and one lead sentence per sub-skill, drawn from
  the CCAR-P study guide's prose (its decision rules and exam traps).
- `cls.py` — the source's 21 "classify these five statements" exercises,
  rewritten as four-option multiple-response items. The real paper is 63
  standalone multiple-choice and multiple-response items, so each exercise
  becomes an item asking for the two statements that belong to one category.
  The statements and the reasoning are the source's; the stem and the option
  set are the rewrite.
- `emit.py` — resolves the items, places the correct option, and writes both JS
  files.

## Why placement matters

The site the items came from shuffled options at runtime, so its source keeps
the correct answer in position B in about 90% of items. This wiki does not
shuffle, so `emit.py` permutes instead: single-answer items cycle through the
four positions and two-answer items through the six pairs, leaving the answer in
each position about a quarter of the time. None of the explanations refer to an
option by letter, which is what makes the permutation safe.
