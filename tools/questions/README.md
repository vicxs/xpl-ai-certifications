# CCAR-F question bank — source

`assets/js/questions-ccar-f.js` is generated from these files. Regenerate with:

```sh
cd tools/questions && python3 emit.py
```

- `d1.py` … `d5.py` — the items, one file per domain, written as
  `Q(id, domain, difficulty, scenario, stem, correct, [wrong, wrong, wrong], why)`.
  The correct answer is named rather than positioned, so position carries no
  information at authoring time.
- `fixups.py` — distractors lengthened after measuring the bank, so the correct
  option is not systematically the longest. Wording only; the reasoning behind
  each distractor is unchanged.
- `emit.py` — assembles the four papers, places the correct option (30 per
  position overall, balanced inside each paper), shuffles the distractors and the
  drill order with fixed seeds, and writes the JS. It asserts that the papers
  partition the bank, so a miscounted domain fails the build rather than shipping.

Explanations never refer to an option by letter, which is what makes the
placement step safe.
