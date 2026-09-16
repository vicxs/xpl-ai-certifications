# -*- coding: utf-8 -*-
BANK = []

def Q(qid, dom, diff, scen, text, correct, wrong, why, pool="core"):
    """One bank item. `pool` says which papers may draw it:

      "core"      — the 120 items papers A–D partition between them;
      "practical" — items added from the practical test, which only paper E draws.
    """
    assert len(wrong) == 3, qid
    assert pool in ("core", "practical"), qid
    BANK.append(dict(id=qid, dom=dom, diff=diff, scen=scen, text=text,
                     correct=correct, wrong=wrong, why=why, pool=pool))
    return BANK[-1]
