# -*- coding: utf-8 -*-
import json, os, random
import common, d1, d2, d3, d4, d5, fixups
fixups.apply()
B = {q["id"]: q for q in common.BANK}

SPEC = [
    ("a", "Mock exam A", "Standard",
     "A full-length standard paper: the same domain weights as the real exam, drawn from the core of each domain.",
     "standard", 0),
    ("b", "Mock exam B", "Standard",
     "A second standard paper. No question is shared with Mock A, so the two together cover every standard item in the bank.",
     "standard", 1),
    ("c", "Mock exam C", "Challenging",
     "Harder scenarios: multi-constraint situations where two answers look defensible and one principle separates them.",
     "challenging", 0),
    ("d", "Mock exam D", "Challenging",
     "The hardest paper. Longer scenarios, quantified trade-offs, and distractors written to be the answer most candidates reach for first.",
     "challenging", 1),
]
PER_DOMAIN = [8, 5, 6, 6, 5]        # D1..D5 per paper — the blueprint at 30 items
POSN = {"a": [8, 8, 7, 7], "b": [7, 8, 8, 7], "c": [7, 7, 8, 8], "d": [8, 7, 7, 8]}

mocks = []
for mid, label, diff, blurb, dkey, half in SPEC:
    ids = []
    for dom in range(5):
        pool = sorted(q["id"] for q in common.BANK if q["dom"] == dom and q["diff"] == dkey)
        n = PER_DOMAIN[dom]
        ids += pool[half * n:(half + 1) * n]
    assert len(ids) == 30, (mid, len(ids))
    random.Random("order-" + mid).shuffle(ids)
    mocks.append(dict(id=mid, label=label, diff=diff, blurb=blurb, ids=ids))

# every bank question belongs to exactly one paper
used = [i for m in mocks for i in m["ids"]]
assert sorted(used) == sorted(B), "mock coverage is not a partition of the bank"

# correct-answer positions: balanced inside each paper and 30/30/30/30 overall
placed = {}
for m in mocks:
    slots = []
    for p, n in enumerate(POSN[m["id"]]):
        slots += [p] * n
    random.Random("pos-" + m["id"]).shuffle(slots)
    for qid, pos in zip(m["ids"], slots):
        placed[qid] = pos

# Drill order: a fixed shuffle, so an unfiltered bank mixes domains and
# difficulties the way a real paper does rather than marching through D1 first.
order = sorted(B)
random.Random("bank-order").shuffle(order)

out = []
for qid in order:
    q = B[qid]
    rnd = random.Random("opts-" + qid)
    wrong = list(q["wrong"])
    rnd.shuffle(wrong)
    pos = placed[qid]
    opts = wrong[:pos] + [q["correct"]] + wrong[pos:]
    assert opts[pos] == q["correct"]
    out.append(dict(id=qid, dom=q["dom"], diff=q["diff"], scen=q["scen"],
                    text=q["text"], opts=opts, correct=pos, why=q["why"]))

def js(s): return json.dumps(s, ensure_ascii=False)

HEAD = """/* CCAR-F — question bank and mock exams.
   120 items written from the official exam guide's practice set and its domain
   notes, re-worked so the bank can be drilled and the papers sat cold:

     · every item is tagged with its domain and its difficulty;
     · the correct option sits in each of the four positions exactly 30 times,
       and is the longest option in 30 of the 120 items — chance, not a tell;
     · distractors are the answers the guide's explanations call out as the
       tempting ones, not filler.

   The four papers partition the bank: each of the 120 items appears in exactly
   one of them, at the real exam's domain weights (27/18/20/20/15) over 30 items.
   A and B are the standard pair, C and D the harder pair.

   Loaded before data.js, alongside content-ccar-f.js. */

window.CCARF_BANK = [
"""

lines = [HEAD]
for i, q in enumerate(out):
    lines.append("  { id: %s, dom: %d, diff: %s, scen: %s,\n" % (js(q["id"]), q["dom"], js(q["diff"]), js(q["scen"])))
    lines.append("    text: %s,\n" % js(q["text"]))
    lines.append("    opts: [\n")
    for o in q["opts"]:
        lines.append("      %s,\n" % js(o))
    lines[-1] = lines[-1].rstrip(",\n") + "\n"
    lines.append("    ],\n")
    lines.append("    correct: %d,\n" % q["correct"])
    lines.append("    why: %s }%s\n\n" % (js(q["why"]), "," if i < len(out) - 1 else ""))
lines.append("];\n\n/* The four papers. 30 items each, 60 minutes, scored on the exam's own\n   100–1000 scale with the pass mark at 720. */\n\nwindow.CCARF_MOCKS = [\n")
for i, m in enumerate(mocks):
    lines.append("  { id: %s, label: %s, diff: %s, minutes: 60,\n" % (js(m["id"]), js(m["label"]), js(m["diff"])))
    lines.append("    blurb: %s,\n" % js(m["blurb"]))
    lines.append("    ids: [%s] }%s\n\n" % (", ".join(js(x) for x in m["ids"]), "," if i < len(mocks) - 1 else ""))
lines.append("];\n")

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "..", "..", "assets", "js", "questions-ccar-f.js")
open(OUT, "w").write("".join(lines))

from collections import Counter
print("items:", len(out))
print("positions:", sorted(Counter(q["correct"] for q in out).items()))
for m in mocks:
    print(m["id"], sorted(Counter(placed[i] for i in m["ids"]).items()),
          "domains", sorted(Counter(B[i]["dom"] for i in m["ids"]).items()))
print("longest-is-correct:", sum(1 for q in out if len(q["opts"][q["correct"]]) > max(len(o) for o in q["opts"])))
