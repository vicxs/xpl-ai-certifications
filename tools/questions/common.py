# -*- coding: utf-8 -*-
BANK = []

def Q(qid, dom, diff, scen, text, correct, wrong, why):
    assert len(wrong) == 3, qid
    BANK.append(dict(id=qid, dom=dom, diff=diff, scen=scen, text=text,
                     correct=correct, wrong=wrong, why=why))
    return BANK[-1]
