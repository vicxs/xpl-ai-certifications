# -*- coding: utf-8 -*-
"""Builds assets/js/content-ccar-p.js and assets/js/questions-ccar-p.js."""
import html, json, random, re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from meta import DOMAIN_META, LEADS

OUT = os.path.join(HERE, "..", "..", "assets", "js")
SRC = json.load(open(os.path.join(HERE, "source.json")))

def clean(s):
    """Unescape the source's HTML entities. <b>, <i> and <code> survive as the
    only markup app.js turns into elements; everything else stays text."""
    s = html.unescape(s)
    assert "&lt;" not in s and "&amp;" not in s
    return s

def js(s):
    return json.dumps(clean(s), ensure_ascii=False)

# ---------------------------------------------------------------- items ---

def resolve(name, i, q):
    """Source item -> { dom, text, why } plus either opts/correct, or the
    classification item's cats/stmts/correct. A classification item asks for a
    category per statement, which is how the real paper asks them; 'correct' is
    then one category index per statement rather than an option index."""
    if q.get("t") == "cls":
        assert len(q["cats"]) >= 2 and len(q["s"]) >= 2, (name, i)
        for text, cat in q["s"]:
            assert 0 <= cat < len(q["cats"]), (name, i, text)
        return {"dom": q["d"], "text": q["q"], "type": "cls",
                "cats": list(q["cats"]), "stmts": [s[0] for s in q["s"]],
                "correct": [s[1] for s in q["s"]], "why": q["e"]}
    assert len(q["o"]) == 4 and 1 <= len(q["a"]) <= 2
    return {"dom": q["d"], "text": q["q"], "opts": list(q["o"]),
            "correct": sorted(q["a"]), "why": q["e"]}

SINGLE_SLOTS = [0, 1, 2, 3]
PAIR_SLOTS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]

def place(items, seed):
    """The source keeps its correct option in B almost throughout, because the
    site it came from shuffled at runtime and this wiki does not. Options are
    permuted here instead, so the answer lands in each position about a quarter
    of the time and position carries no signal."""
    rnd = random.Random(seed)
    n1 = n2 = 0
    for it in items:
        if it.get("type") == "cls":
            continue          # no options to place: the answer is a category per statement
        correct = it["correct"]
        if len(correct) == 1:
            slots = [SINGLE_SLOTS[n1 % 4]]; n1 += 1
        else:
            slots = list(PAIR_SLOTS[n2 % 6]); n2 += 1
        rest = [o for i, o in enumerate(it["opts"]) if i not in correct]
        rnd.shuffle(rest)
        out = [None] * 4
        for slot, ci in zip(slots, correct):
            out[slot] = it["opts"][ci]
        for slot in range(4):
            if out[slot] is None:
                out[slot] = rest.pop(0)
        it["opts"] = out
        it["correct"] = slots[0] if len(slots) == 1 else slots
    return items

def emit_q(it, indent, head):
    pad = " " * indent
    correct = json.dumps(it["correct"])
    if it.get("type") == "cls":
        lines = [pad + head,
                 pad + '  type: "cls",',
                 pad + "  text: " + js(it["text"]) + ",",
                 pad + "  cats: [" + ", ".join(js(c) for c in it["cats"]) + "],",
                 pad + "  stmts: ["]
        for stmt in it["stmts"]:
            lines.append(pad + "    " + js(stmt) + ",")
        lines[-1] = lines[-1][:-1]
        lines += [pad + "  ],",
                  pad + "  correct: " + correct + ",",
                  pad + "  why: " + js(it["why"]) + " }"]
        return "\n".join(lines)
    lines = [pad + head,
             pad + "  text: " + js(it["text"]) + ",",
             pad + "  opts: ["]
    for o in it["opts"]:
        lines.append(pad + "    " + js(o) + ",")
    lines[-1] = lines[-1][:-1]
    lines += [pad + "  ],",
              pad + "  correct: " + correct + ",",
              pad + "  why: " + js(it["why"]) + " }"]
    return "\n".join(lines)

# --------------------------------------------------------- study guide ---

quiz = {}
for i, q in enumerate(SRC["REVIEW"]):
    it = resolve("REVIEW", i, q)
    quiz.setdefault(it["dom"], []).append(it)
for d in quiz:
    place(quiz[d], 4100 + d)

CONTENT_HEAD = '''/* CCAR-P — Claude Certified Architect, Professional.
   Domain theory and end-of-domain quizzes, ported from the CCAR-P study guide
   and study site sources, whose domains, sub-skills and weights come from the
   official exam guide (7 domains / 38 sub-skills, 100% of the scored content).

   Shape, per domain — the same one CCAR-F and CCDV-F use, so the progress bar,
   the question bank and the mock papers read it without any special casing:

     concepts[]  one lesson per sub-skill: { ref, title, body, points[], exam[] }
     questions[] the end-of-domain quiz, either an option item
                 { text, opts[4], correct, why } or a classification item
                 { type: "cls", text, cats[], stmts[], correct, why }

   'correct' is an option index, or an array of them for a multiple-response
   item ("Select TWO"). On a classification item it is one category index per
   statement, in the order the statements are listed — every statement has to
   be placed, and the item scores only when all of them match.

   Body text may carry <b>, <i> and <code> markup; app.js renders those three
   tags as elements and everything else, angle brackets included, as plain text.

   Generated by tools/ccar-p/emit.py — do not hand-edit. Loaded before data.js. */

window.CCARP_DOMAINS = [
'''

parts = [CONTENT_HEAD]
for dom in SRC["DOMAINS"]:
    did = dom["id"]
    m = DOMAIN_META[did]
    parts.append("\n  /* ---------------------------------------------------------------- D%d --- */" % did)
    parts.append("  {")
    parts.append('    code: "D%d", name: %s, short: %s, weight: %s,'
                 % (did, js(dom["name"]), js(m["short"]), dom["w"]))
    parts.append("    summary: %s," % js(m["summary"]))
    parts.append("    intro: %s," % js(m["intro"]))
    parts.append("    concepts: [")
    for si, sk in enumerate(dom["skills"]):
        parts.append('      { ref: "%d.%d", title: %s,' % (did, si + 1, js(sk["name"])))
        parts.append("        body: %s," % js(LEADS[(did, si)]))
        parts.append("        points: [")
        for c in sk["concepts"]:
            parts.append("          " + js(c) + ",")
        parts[-1] = parts[-1][:-1]
        parts.append("        ],")
        parts.append("        exam: [")
        for t in sk["traps"]:
            parts.append("          " + js(t) + ",")
        parts[-1] = parts[-1][:-1]
        parts.append("        ] },")
        parts.append("")
    parts.pop()
    parts[-1] = parts[-1][:-1]
    parts.append("    ],")
    parts.append("    questions: [")
    for it in quiz[did]:
        parts.append(emit_q(it, 6, "{") + ",")
        parts.append("")
    parts.pop()
    parts[-1] = parts[-1][:-1]
    parts.append("    ]")
    parts.append("  },")
parts[-1] = parts[-1][:-1]
parts.append("];\n")
open(os.path.join(OUT, "content-ccar-p.js"), "w").write("\n".join(parts))

# ----------------------------------------------------------- questions ---

def build(name, diff, tag):
    items = [resolve(name, i, q) for i, q in enumerate(SRC[name])]
    place(items, 900 + ord(tag))
    seen = {}
    for it in items:
        d = it["dom"]
        seen[d] = seen.get(d, 0) + 1
        it["id"] = "ap%d%s%02d" % (d, tag, seen[d])
        it["diff"] = diff
    return items

std = build("MOCK_STD", "standard", "s")
chl = build("MOCK_CHL", "challenging", "c")

def order(items, seed):
    ids = [it["id"] for it in items]
    random.Random(seed).shuffle(ids)
    return ids

MOCKS = [
    ("ap-standard", "Mock exam · Standard", "Standard", std, 31,
     "A full-length paper at the level of the study guide's own check-yourself items: 63 questions in the official domain proportions, single and multiple response mixed as they are on the day. The one to sit first."),
    ("ap-challenge", "Mock exam · Challenge", "Challenging", chl, 47,
     "The same 63-question shape, deliberately harder: longer scenarios, more options that are defensible in isolation, and more items that turn on a single stated constraint. It shares no question with the standard paper, so the pair can be sat back to back."),
]

counts = {}
for it in std:
    counts[it["dom"]] = counts.get(it["dom"], 0) + 1
per_dom = ", ".join("D%d %d" % (d, counts[d]) for d in sorted(counts))

head = '''/* CCAR-P — question bank and mock exams.

   126 items: the two full-length papers of the CCAR-P study site source, each 63
   questions laid out at the official domain weights — the shape of the real
   paper (63 scored items, 120 minutes, pass at 720 of 1000).

     window.CCARP_BANK   { id, dom, diff, text, opts[4], correct, why }, or a
                         classification item { id, dom, diff, type: "cls", text,
                         cats[], stmts[], correct, why }
     window.CCARP_MOCKS  { id, label, diff, minutes, blurb, ids[63] }

   'correct' is an option index, or an array of them for a multiple-response
   item; on a classification item it is one category index per statement, in the
   order the statements are listed. 'dom' indexes window.CCARP_DOMAINS.

   The standard and the challenge paper partition the bank: every item appears in
   exactly one of the two, so the pair can be sat back to back without repetition.
   Within a paper the order is shuffled once, at build time, so that a run never
   walks through the syllabus domain by domain.

   Items per domain, of 63: %s.

   Generated by tools/ccar-p/emit.py — do not hand-edit. Loaded before app.js. */

window.CCARP_BANK = [
''' % per_dom

parts = [head]
for items in (std, chl):
    for it in items:
        parts.append(emit_q(it, 2, '{ id: "%s", dom: %d, diff: "%s",'
                            % (it["id"], it["dom"] - 1, it["diff"])) + ",")
        parts.append("")
    parts.append("")
parts.pop(); parts.pop()
parts[-1] = parts[-1][:-1]
parts.append("];\n")

parts.append("window.CCARP_MOCKS = [")
rows = []
for mid, label, diff, items, seed, blurb in MOCKS:
    ids = order(items, seed)
    lines = ['  { id: "%s", label: %s, diff: "%s", minutes: 120,' % (mid, js(label), diff),
             "    blurb: " + js(blurb) + ",",
             "    ids: ["]
    for i in range(0, len(ids), 8):
        chunk = ", ".join('"%s"' % x for x in ids[i:i + 8])
        lines.append("      " + chunk + ("," if i + 8 < len(ids) else ""))
    lines.append("    ] }")
    rows.append("\n".join(lines))
parts.append(",\n".join(rows))
parts.append("];\n")
open(os.path.join(OUT, "questions-ccar-p.js"), "w").write("\n".join(parts))

print("domains", len(SRC["DOMAINS"]),
      "| lessons", sum(len(d["skills"]) for d in SRC["DOMAINS"]),
      "| quiz", sum(len(v) for v in quiz.values()),
      "| bank", len(std) + len(chl))
