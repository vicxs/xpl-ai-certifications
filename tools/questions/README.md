# CCAR-F question bank — source

`assets/js/questions-ccar-f.js` is generated from these files. Regenerate with:

```sh
cd tools/questions && python3 emit.py
```

- `d1.py` … `d5.py` — the items, one file per domain, written as
  `Q(id, domain, difficulty, scenario, stem, correct, [wrong, wrong, wrong], why)`.
  The correct answer is named rather than positioned, so position carries no
  information at authoring time. A trailing `pool="practical"` marks an item as
  belonging to the practical paper alone (ids `d1p01`, `d2p01`, …); everything
  else is core and is split between the standard and the challenge paper.
- `fixups.py` — distractors lengthened after measuring the bank, so the correct
  option is not systematically the longest. Wording only; the reasoning behind
  each distractor is unchanged.
- `emit.py` — assembles the three papers, places the correct option (31 or 32 per
  position overall, balanced inside each of the four quarters the core bank is
  laid out in), shuffles the distractors and the drill order with fixed seeds, and
  writes the JS. It asserts that the quarters partition the core bank and that
  every paper hits the blueprint — 60 items at 16/10/12/12/10 — without repeating
  an item, so a miscounted domain fails the build rather than shipping. The
  practical paper's 55 core slots are the hand-picked `E_CORE` list at the top of
  the file, and `spread()` sets the sitting order so no two neighbours come from
  the same domain.

Explanations never refer to an option by letter, which is what makes the
placement step safe.
