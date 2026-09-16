# -*- coding: utf-8 -*-
import collections, json, os, random
import common, d1, d2, d3, d4, d5, fixups
fixups.apply()
B = {q["id"]: q for q in common.BANK}
CORE = {i: q for i, q in B.items() if q["pool"] == "core"}
PRACTICAL = {i: q for i, q in B.items() if q["pool"] == "practical"}

# The core bank is placed in four balanced quarters — two standard, two
# challenging. The quarters are not papers any more; they are what keeps the
# correct option evenly spread across the four positions. The emitted papers are
# built from them below.
BLOCKS = [("a", "standard", 0), ("b", "standard", 1),
          ("c", "challenging", 0), ("d", "challenging", 1)]
PER_DOMAIN = [8, 5, 6, 6, 5]        # D1..D5 per quarter — the blueprint at 30 items
PAPER_DOMAIN = [16, 10, 12, 12, 10] # D1..D5 per paper — the blueprint at 60 items
POSN = {"a": [8, 8, 7, 7], "b": [7, 8, 8, 7], "c": [7, 7, 8, 8], "d": [8, 7, 7, 8]}

# The practical paper. The five practical items are all it can draw from that
# pool, so the remaining 55 slots come from the core items covering the same four
# scenarios the practical test works through — which means the practical paper,
# and only it, repeats questions the other two already ask.
E_CORE = [
    "d1c01", "d1c03", "d1c06", "d1c07", "d1c08", "d1c10", "d1c11", "d1c15",
    "d1s01", "d1s04", "d1s06", "d1s08", "d1s09", "d1s10", "d1s14",            # D1 — 15 + d1p01
    "d2c02", "d2c06", "d2c08", "d2c09", "d2c10",
    "d2s01", "d2s04", "d2s05", "d2s10",                                      # D2 — 9 + d2p01
    "d3c02", "d3c05", "d3c09", "d3c10", "d3c11",
    "d3s03", "d3s04", "d3s05", "d3s08", "d3s09", "d3s11",                    # D3 — 11 + d3p01
    "d4c03", "d4c05", "d4c06", "d4c07", "d4c08", "d4c09",
    "d4s01", "d4s02", "d4s05", "d4s08", "d4s10", "d4s11",                    # D4 — 12
    "d5c01", "d5c02", "d5c07", "d5c08",
    "d5s02", "d5s03", "d5s06", "d5s09",                                      # D5 — 8 + d5p01, d5p02
]

PAPERS = [
    ("ar-standard", "Mock exam \u00b7 Standard", "Standard",
     "A full-length standard paper: every standard item in the bank, at the real "
     "exam's domain proportions. The one to sit first."),
    ("ar-challenge", "Mock exam \u00b7 Challenge", "Challenging",
     "The harder paper: multi-constraint scenarios, quantified trade-offs, and "
     "distractors written to be the answer most candidates reach for first. It "
     "shares no question with the standard paper, so the two can be sat back to "
     "back."),
    ("ar-practical", "Mock exam \u00b7 Practical", "Practical",
     "The practical paper: the four production scenarios of the practical test "
     "\u2014 CI, multi-agent research, customer support and code generation \u2014 "
     "worked end to end, including the five items the other papers never put to "
     "you. Standard and challenging items are mixed, and this is the one paper "
     "that revisits questions from the other two."),
]


def spread(ids, seed):
    """Sitting order: no two neighbours from the same domain, and a scenario
    repeated back to back only when nothing else is left. A plain shuffle of 60
    items marches through four D1s in a row often enough to read as a pattern."""
    rnd = random.Random(seed)
    left = list(ids)
    rnd.shuffle(left)
    out = []
    while left:
        prev = B[out[-1]] if out else None
        remaining = collections.Counter(B[i]["dom"] for i in left)
        def key(i):
            q = B[i]
            cost = (prev is not None and q["dom"] == prev["dom"]) * 2 \
                 + (prev is not None and q["scen"] == prev["scen"])
            return (cost, -remaining[q["dom"]], left.index(i))
        pick = min(left, key=key)
        out.append(pick)
        left.remove(pick)
    return out


# The quarters, used for placement and to prove the core bank is fully covered.
blocks = {}
for bid, dkey, half in BLOCKS:
    ids = []
    for dom in range(5):
        pool = sorted(q["id"] for q in CORE.values() if q["dom"] == dom and q["diff"] == dkey)
        n = PER_DOMAIN[dom]
        ids += pool[half * n:(half + 1) * n]
    assert len(ids) == 30, (bid, len(ids))
    random.Random("order-" + bid).shuffle(ids)   # the order the placement pairs against
    blocks[bid] = ids

assert sorted(i for ids in blocks.values() for i in ids) == sorted(CORE), \
    "the quarters are not a partition of the core bank"

e_ids = E_CORE + sorted(PRACTICAL)
paper_ids = {
    "ar-standard": blocks["a"] + blocks["b"],
    "ar-challenge": blocks["c"] + blocks["d"],
    "ar-practical": e_ids,
}
for pid, ids in paper_ids.items():
    assert sorted(ids) == sorted(set(ids)), ("paper repeats a question within itself", pid)
    assert len(ids) == 60, (pid, len(ids))
    for dom in range(5):
        n = sum(1 for i in ids if B[i]["dom"] == dom)
        assert n == PAPER_DOMAIN[dom], ("paper off blueprint", pid, dom, n)

mocks = []
for pid, label, diff, blurb in PAPERS:
    mocks.append(dict(id=pid, label=label, diff=diff, blurb=blurb,
                      ids=spread(paper_ids[pid], "order-" + pid)))

# correct-answer positions: balanced inside each quarter, and 30/30/30/30 across
# the core bank. The practical paper inherits the positions its core items already
# carry, so the five practical items take whichever positions leave the bank most
# even, the practical paper breaking the tie.
placed = {}
for bid, ids in blocks.items():
    slots = []
    for p, n in enumerate(POSN[bid]):
        slots += [p] * n
    random.Random("pos-" + bid).shuffle(slots)
    for qid, pos in zip(ids, slots):
        placed[qid] = pos

bank_counts = [sum(1 for i in placed if placed[i] == p) for p in range(4)]
e_counts = [sum(1 for i in E_CORE if placed[i] == p) for p in range(4)]
for qid in sorted(PRACTICAL):
    pos = min(range(4), key=lambda p: (bank_counts[p], e_counts[p], p))
    placed[qid] = pos
    bank_counts[pos] += 1
    e_counts[pos] += 1

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
   125 items written from the official exam guide's practice set, its domain
   notes and the practical test, re-worked so the bank can be drilled and the
   papers sat cold:

     · every item is tagged with its domain and its difficulty;
     · the correct option sits in each of the four positions 31 or 32 times, and
       is the longest of the four in 32 of the 125 items — chance, not a tell;
     · distractors are the answers the guide's explanations call out as the
       tempting ones, not filler.

   Three full-length papers, 60 items each at the real exam's domain weights
   (27/18/20/20/15, so 16/10/12/12/10). The standard and the challenge paper
   partition the 120 core items — every item sits in exactly one of the two, so
   the pair can be sat back to back. The practical paper carries the five items
   from the practical test that the core bank does not cover and fills its other
   55 slots from the same four scenarios (CI, multi-agent research, customer
   support, code generation), standard and challenging mixed, so it is the one
   paper that repeats questions the other two already ask.

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
lines.append("];\n\n/* The three papers. 60 items each, 120 minutes — the real exam's own length and\n   domain weights (27/18/20/20/15, so 16/10/12/12/10 items) — scored on the\n   exam's 100-1000 scale with the pass mark at 720. */\n\nwindow.CCARF_MOCKS = [\n")
for i, m in enumerate(mocks):
    lines.append("  { id: %s, label: %s, diff: %s, minutes: 120,\n" % (js(m["id"]), js(m["label"]), js(m["diff"])))
    lines.append("    blurb: %s,\n" % js(m["blurb"]))
    lines.append("    ids: [%s] }%s\n\n" % (", ".join(js(x) for x in m["ids"]), "," if i < len(mocks) - 1 else ""))
lines.append("];\n")

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "..", "..", "assets", "js", "questions-ccar-f.js")
open(OUT, "w").write("".join(lines))

from collections import Counter
print("items:", len(out), "(core %d + practical %d)" % (len(CORE), len(PRACTICAL)))
print("positions:", sorted(Counter(q["correct"] for q in out).items()))
for m in mocks:
    print(m["id"], len(m["ids"]), "items",
          sorted(Counter(placed[i] for i in m["ids"]).items()),
          "domains", sorted(Counter(B[i]["dom"] for i in m["ids"]).items()))
print("longest-is-correct:", sum(1 for q in out
      if all(len(q["opts"][q["correct"]]) > len(o)
             for j, o in enumerate(q["opts"]) if j != q["correct"])))
