/* Cert Wiki — hash-routed static port of the Claude Design source
   'Cert Wiki Flow.dc.html'. Live routes: the introduction, applying & booking,
   the study guides (#/ccar-f, #/ccdv-f, #/ccar-p and their #/<slug>/d1 … pages), the
   question bank (#/bank), the mock papers (#/mock, #/mock/ar-standard and
   #/mock/ar-standard/result) and the last result (#/result). Certifications
   without content keep the "soon" treatment in the sidebar. */

(function () {
  "use strict";

  var DATA = window.DATA;
  var STORE_KEY = "certwiki.flow.v1";

  /* The design's persisted shape, extended for the practice routes. Existing
     keys keep their meaning, so saved progress survives this release. */
  var DEFAULT_STATE = {
    route: "home",
    certId: "CCAR-F",
    domainIdx: 0,
    quizAnswers: {},   /* study-guide quizzes, keyed cert-domain-index */
    done: {},          /* lessons marked read */
    steps: {},         /* applying & booking checklist */
    bankCert: "CCAR-F",
    bankDomain: "all",
    bankDiff: "all",
    bankOnly: "all",   /* all | unanswered | wrong */
    bankAnswers: {},   /* question bank, keyed by question id */
    attempts: {},      /* mock id -> { answers, flags, idx, startedAt, deadline, submitted } */
    scores: {},        /* mock id -> { right, total, scaled, byDomain, at, seconds } */
    lastMock: null
  };

  var state = load();

  function load() {
    var s = Object.assign({}, DEFAULT_STATE);
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) Object.assign(s, JSON.parse(raw));
    } catch (e) { /* private mode or blocked storage — defaults are fine */ }
    return s;
  }

  function save(patch) {
    Object.assign(state, patch || {});
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore — the page works without persistence */ }
  }

  function cert(id) { return DATA.certs[id || state.certId]; }

  /* Certifications whose study guide is written. The others stay "soon" in the
     sidebar and on the roadmap until their content lands. */
  var GUIDES = { "CCAR-F": "#/ccar-f", "CCDV-F": "#/ccdv-f", "CCAR-P": "#/ccar-p" };

  function hasGuide(id) { return Object.prototype.hasOwnProperty.call(GUIDES, id); }

  /* Ported from the design: share of concepts read plus quiz questions answered
     correctly. Reads 0 until the study guides ship. */
  function certProgress(certId) {
    var c = cert(certId);
    var total = 0;
    var hit = 0;
    c.domains.forEach(function (d, di) {
      total += d.concepts.length + d.questions.length;
      d.concepts.forEach(function (x, ci) {
        if (state.done[certId + "-" + di + "-" + ci]) hit++;
      });
      d.questions.forEach(function (q, qi) {
        if (isRight(q, state.quizAnswers[certId + "-" + di + "-" + qi])) hit++;
      });
    });
    return total ? Math.round(hit / total * 100) : 0;
  }

  /* ---------- questions: single response, multiple response, classification ---------- */

  /* An item's `correct` is an option index, or an array of them when the exam
     asks for several ("Select TWO"). An answer is stored the same way, so a
     single-response answer saved by an earlier release still reads back.

     A classification item (`type: "cls"`) is the third kind the exam asks: a
     criterion, a list of statements and a box per statement — True or False,
     or which of several strategies each description matches. There `correct` is
     one category index per statement, in the order `stmts` lists them, and an
     answer is the same array with null where a row is still empty. It scores
     only when every row matches, exactly as multiple response does. */

  function isCls(q) { return !!q && q.type === "cls"; }

  function isMulti(q) { return !isCls(q) && Array.isArray(q.correct); }

  /* Complete enough to be scored. A half-classified item is not: it counts as
     unanswered until every statement has been placed. */
  function hasAnswer(a) {
    if (a === undefined || a === null) return false;
    if (!Array.isArray(a)) return true;
    return a.length > 0 && a.every(function (x) { return x !== null && x !== undefined; });
  }

  /* Anything the user has actually chosen, complete or not. An exam keeps a
     half-classified item so the picks survive a reload. */
  function hasPick(a) {
    if (a === undefined || a === null) return false;
    if (!Array.isArray(a)) return true;
    return a.some(function (x) { return x !== null && x !== undefined; });
  }

  function isRight(q, a) {
    if (!hasAnswer(a)) return false;
    if (isCls(q)) {
      if (!Array.isArray(a) || a.length !== q.correct.length) return false;
      return q.correct.every(function (c, i) { return a[i] === c; });
    }
    if (!isMulti(q)) return a === q.correct;
    if (!Array.isArray(a) || a.length !== q.correct.length) return false;
    return q.correct.every(function (i) { return a.indexOf(i) !== -1; });
  }

  function isPicked(a, oi) {
    return Array.isArray(a) ? a.indexOf(oi) !== -1 : a === oi;
  }

  /* Returns the answer after clicking option `oi`: a toggle in both modes, but a
     multiple-response answer keeps the other picks. */
  function togglePick(q, a, oi) {
    if (!isMulti(q)) return a === oi ? undefined : oi;
    var next = Array.isArray(a) ? a.slice() : [];
    var at = next.indexOf(oi);
    if (at === -1) next.push(oi); else next.splice(at, 1);
    return next.sort(function (x, y) { return x - y; });
  }

  var COUNT_WORDS = ["", "ONE", "TWO", "THREE", "FOUR"];

  function pickLabel(q) {
    if (isCls(q)) return "Classify all " + q.stmts.length;
    return "Select " + (COUNT_WORDS[q.correct.length] || q.correct.length);
  }

  function letters(q) {
    return (isMulti(q) ? q.correct : [q.correct])
      .map(function (i) { return "ABCD".charAt(i); })
      .join(" and ");
  }

  /* A classification item has no option letters to name, so its reasoning is
     introduced by the criterion instead. */
  function whyHead(q) {
    return isCls(q) ? "Why these categories: " : "Why " + letters(q) + ": ";
  }

  function missedHead(q) {
    return isCls(q)
      ? "Not answered · the categories marked below are the correct ones: "
      : "Not answered · correct answer " + letters(q) + ": ";
  }

  /* The picks of a classification item, padded to one entry per statement. */
  function clsPicks(q, a) {
    var picks = [];
    for (var i = 0; i < q.stmts.length; i++) {
      picks.push(Array.isArray(a) && a[i] !== undefined && a[i] !== null ? a[i] : null);
    }
    return picks;
  }

  /* One row per statement, with the categories as buttons beside it. `mode` is
     the caller's: "exam" commits every pick as it happens and never reveals,
     "review" always reveals, and the study guide and the bank hold the picks
     until the item is complete and then commit them with Check answer. */
  function clsBody(q, mode, answer, commit) {
    var exam = mode === "exam";
    /* An answer of the wrong length is one the bank kept from a release where
       this item asked something else: it is ignored rather than revealed. */
    var placed = Array.isArray(answer) && answer.length === q.stmts.length;
    var reveal = mode === "review" || (!exam && placed && hasAnswer(answer));
    var picks = clsPicks(q, answer);
    var wrap = el("div", "q__cls");
    var check = null;
    var buttons = [];

    function complete() {
      return picks.every(function (x) { return x !== null; });
    }

    q.stmts.forEach(function (text, si) {
      var row = el("div", "cls-row");
      /* A row left empty is not marked wrong — the right category is shown and
         the verdict on the item says the rest. */
      if (reveal && picks[si] !== null) {
        row.classList.add(picks[si] === q.correct[si] ? "is-right" : "is-wrong");
      }
      row.appendChild(elRich("div", "cls-row__text", text));

      var cats = el("div", "cls-row__cats");
      buttons[si] = [];
      q.cats.forEach(function (label, ci) {
        var b = el("button", "cls-cat");
        b.type = "button";
        b.appendChild(elRich("span", "cls-cat__text", label));
        if (reveal) {
          b.disabled = true;
          if (q.correct[si] === ci) b.classList.add("is-right");
          else if (picks[si] === ci) b.classList.add("is-wrong");
        } else {
          if (picks[si] === ci) b.classList.add("is-picked");
          b.addEventListener("click", function () {
            picks[si] = picks[si] === ci ? null : ci;
            buttons[si].forEach(function (other, oi) {
              other.classList.toggle("is-picked", picks[si] === oi);
            });
            if (exam) commit(picks.slice());
            else if (check) check.disabled = !complete();
          });
        }
        buttons[si].push(b);
        cats.appendChild(b);
      });
      row.appendChild(cats);
      wrap.appendChild(row);
    });

    if (!reveal && !exam) {
      var actions = el("div", "q__actions");
      check = el("button", "btn btn--ghost", "Check answer");
      check.type = "button";
      check.disabled = !complete();
      check.addEventListener("click", function () { commit(picks.slice()); });
      actions.appendChild(check);
      actions.appendChild(el("span", "q__hint", "place every statement to check"));
      wrap.appendChild(actions);
    }
    return wrap;
  }

  /* The four lettered options, in the same three modes. A multiple-response
     item is not committed one option at a time: outside an exam the picks are
     held here until there are as many as the item asks for, and Check answer
     commits them. In an exam every pick is saved as it happens — there is no
     feedback to withhold. */
  function optsBody(q, mode, answer, commit) {
    var answered = hasAnswer(answer);
    var wrap = document.createDocumentFragment();
    var pending = [];
    var check = null;

    var opts = el("div", "q__opts");
    q.opts.forEach(function (text, oi) {
      var b = el("button", "opt");
      b.type = "button";
      b.appendChild(el("span", "opt__letter", "ABCD".charAt(oi)));
      b.appendChild(elRich("span", "opt__text", text));
      if (mode === "exam") {
        if (isPicked(answer, oi)) b.classList.add("is-picked");
        b.addEventListener("click", function () { commit(togglePick(q, answer, oi)); });
      } else if (answered) {
        b.disabled = true;
        if (isPicked(q.correct, oi)) b.classList.add("is-right");
        else if (isPicked(answer, oi)) b.classList.add("is-wrong");
      } else if (isMulti(q)) {
        b.addEventListener("click", function () {
          pending = togglePick(q, pending, oi);
          b.classList.toggle("is-picked", isPicked(pending, oi));
          check.disabled = pending.length !== q.correct.length;
        });
      } else {
        b.addEventListener("click", function () { commit(oi); });
      }
      opts.appendChild(b);
    });
    wrap.appendChild(opts);

    if (!answered && isMulti(q) && mode !== "exam") {
      var row = el("div", "q__actions");
      check = el("button", "btn btn--ghost", "Check answer");
      check.type = "button";
      check.disabled = true;
      check.addEventListener("click", function () { commit(pending); });
      row.appendChild(check);
      row.appendChild(el("span", "q__hint", pickLabel(q).toLowerCase() + " to check"));
      wrap.appendChild(row);
    }
    return wrap;
  }

  function questionBody(q, mode, answer, commit) {
    return isCls(q) ? clsBody(q, mode, answer, commit)
                    : optsBody(q, mode, answer, commit);
  }

  /* ---------- inline markup ---------- */

  /* Lesson and question text may carry <b>, <i> and <code>. Those three become
     elements; any other angle bracket is text, so a literal <document> in a
     prompt example survives as written and content files cannot inject markup. */

  var INLINE = { b: "strong", i: "em", code: "code" };

  function rich(text) {
    var frag = document.createDocumentFragment();
    if (text === undefined || text === null) return frag;
    var stack = [frag];
    var re = /<(\/?)(b|i|code)>/g;
    var last = 0;
    var m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) {
        stack[stack.length - 1].appendChild(document.createTextNode(text.slice(last, m.index)));
      }
      last = re.lastIndex;
      if (m[1]) {
        if (stack.length > 1) stack.pop();
      } else {
        var node = document.createElement(INLINE[m[2]]);
        stack[stack.length - 1].appendChild(node);
        stack.push(node);
      }
    }
    if (last < text.length) {
      stack[stack.length - 1].appendChild(document.createTextNode(text.slice(last)));
    }
    return frag;
  }

  /* ---------- DOM helpers ---------- */

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  /* As el(), but the text is read as inline markup. */
  function elRich(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    n.appendChild(rich(text));
    return n;
  }

  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function soonTag() { return el("span", "soon-tag", "soon"); }

  function markSoon(node, label) {
    node.classList.add("is-soon");
    node.setAttribute("aria-disabled", "true");
    if (node.tagName === "BUTTON") node.disabled = true;
    if (label !== false) node.appendChild(soonTag());
    return node;
  }

  /* ---------- sidebar ---------- */

  var TOP_NAV = [
    { label: "Introduction", route: "home", href: "#/" },
    { label: "Applying & booking", route: "apply", href: "#/apply" }
  ];

  var PRACTICE_NAV = [
    { label: "Question bank", route: "bank", href: "#/bank" },
    { label: "Mock exams", route: "mock", href: "#/mock" },
    { label: "My last result", route: "result", href: "#/result" }
  ];

  function renderSidebar() {
    var top = document.getElementById("nav-top");
    top.textContent = "";
    TOP_NAV.forEach(function (n) {
      var a = el("a", "nav__item");
      a.href = n.href;
      a.appendChild(el("span", null, n.label));
      if (state.route === n.route) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
      top.appendChild(a);
    });

    var certs = document.getElementById("nav-certs");
    certs.textContent = "";
    DATA.order.forEach(function (id) {
      var label = id + " · " + cert(id).short;
      if (!hasGuide(id)) {
        var item = el("div", "nav__item");
        item.appendChild(el("span", null, label));
        certs.appendChild(markSoon(item));
        return;
      }
      var a = el("a", "nav__item");
      a.href = GUIDES[id];
      a.appendChild(el("span", null, label));
      if (state.route === "guide" && state.certId === id) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
      certs.appendChild(a);
    });

    var practice = document.getElementById("nav-practice");
    practice.textContent = "";
    PRACTICE_NAV.forEach(function (n) {
      var a = el("a", "nav__item");
      a.href = n.href;
      a.appendChild(el("span", null, n.label));
      if (state.route === n.route) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
      practice.appendChild(a);
    });

    var active = cert(state.certId);
    var pct = certProgress(state.certId);
    document.getElementById("track-name").textContent = active.short + " · " + active.code;
    document.getElementById("track-bar").style.width = pct + "%";
  }

  /* ---------- introduction ---------- */

  function renderIntro() {
    var page = el("div", "page page--intro");

    var hero = el("div", "hero");
    var copy = el("div", "hero__copy");
    copy.appendChild(el("div", "page__eyebrow", "Introduction"));
    copy.appendChild(el("h1", null, "Everything you need to pass, in one place."));
    copy.appendChild(el("p", null,
      "Three certifications, one path. Pick where you are on the roadmap, work through the study guide domain by domain, then prove it with the mock exams. Everything here is condensed from the official material — no searching required."));

    var actions = el("div", "hero__actions");
    var start = el("a", "btn btn--primary", "Start CCAR-F →");
    start.href = GUIDES["CCAR-F"] + "/d" + (state.domainIdx + 1);
    actions.appendChild(start);
    var apply = el("a", "btn btn--ghost", "How to apply");
    apply.href = "#/apply";
    actions.appendChild(apply);
    copy.appendChild(actions);
    hero.appendChild(copy);

    var howto = el("div", "howto");
    howto.appendChild(el("div", "howto__head", "How the wiki works"));
    var list = el("div", "howto__list");
    [
      ["01", "Read the domain notes", "Condensed to what the exam actually tests, one card per testable idea."],
      ["02", "Check yourself per domain", "A short quiz at the end of every domain, with the reasoning explained."],
      ["03", "Drill your weak spots", "The question bank filters by exam, domain and difficulty."],
      ["04", "Simulate the real thing", "Timed mocks, standard and challenging, scored per domain."]
    ].forEach(function (row) {
      var r = el("div", "howto__row");
      r.appendChild(el("div", "howto__n", row[0]));
      var body = el("div");
      body.appendChild(el("div", "howto__title", row[1]));
      body.appendChild(el("div", "howto__body", row[2]));
      r.appendChild(body);
      list.appendChild(r);
    });
    howto.appendChild(list);
    hero.appendChild(howto);
    page.appendChild(hero);

    var roadmapSection = el("div");

    var grid = el("div", "roadmap");
    DATA.order.forEach(function (id, i) {
      var c = cert(id);
      var pct = certProgress(id);
      var badge = pct >= 100 ? "COMPLETE" : pct > 0 ? "IN PROGRESS" : i === 0 ? "START HERE" : "";

      var card = el("div", "card");
      if (state.certId === id) card.classList.add("card--active");
      if (i === 2) card.classList.add("card--tinted");

      var top = el("div", "card__top");
      top.appendChild(el("div", "card__step", "STEP " + (i + 1) + " · " + c.code));
      if (badge) {
        var b = el("div", "card__badge", badge);
        if (pct > 0) b.style.background = "var(--ink)";
        top.appendChild(b);
      }
      card.appendChild(top);

      card.appendChild(el("div", "card__name", c.name.replace("Claude Certified ", "")));
      card.appendChild(el("div", "card__blurb", c.blurb.split(".")[0] + "."));
      card.appendChild(el("div", "card__meta",
        c.domains.length + " domains · " + c.items + " items · " + c.time));

      var domains = el("div", "card__domains");
      c.domains.forEach(function (d) {
        var row = el("div", "card__domain");
        row.appendChild(el("span", null, d.code + " · " + d.short));
        row.appendChild(el("span", null, d.weight + "%"));
        domains.appendChild(row);
      });
      card.appendChild(domains);

      if (hasGuide(id)) {
        var link = el("a", "card__foot", "Study guide →");
        link.href = GUIDES[id];
        card.appendChild(link);
      } else {
        var foot = el("div", "card__foot");
        foot.appendChild(el("span", null, "Study guide"));
        card.appendChild(markSoon(foot));
      }

      grid.appendChild(card);
    });
    roadmapSection.appendChild(grid);
    page.appendChild(roadmapSection);

    page.appendChild(el("div", "footnote",
      "All three pass at 720/1000 and stay valid 12 months. Fees are set by the certifying organisation — confirm current figures before you book."));

    return page;
  }

  /* ---------- applying & booking ---------- */

  var EXAM_DAY = [
    "Photo ID matching your registration name.",
    "Clear desk, no second screen, camera on the whole time.",
    "Arrive 15 minutes early for the proctor check.",
    "Result on screen immediately; certificate follows by email."
  ];

  function renderApply() {
    var page = el("div", "page");
    page.appendChild(el("div", "page__eyebrow", "Applying"));
    page.appendChild(el("h1", "page__title", "Steps to apply for the exam"));
    page.appendChild(el("p", "page__lead",
      "Same process for all three exams. Budget two weeks between requesting the voucher and your slot."));

    var steps = el("div", "steps");
    DATA.applySteps.forEach(function (s, i) {
      var row = el("div", "step");
      row.appendChild(el("div", "step__n", "0" + (i + 1)));

      var body = el("div", "step__body");
      var titleId = "step-" + i + "-title";
      var title = el("div", "step__title", s.title);
      title.id = titleId;
      body.appendChild(title);
      body.appendChild(el("div", "step__text", s.body));
      body.appendChild(el("div", "step__meta", s.meta));
      row.appendChild(body);

      var label = el("label", "tick");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !!state.steps[i];
      input.setAttribute("aria-labelledby", titleId);
      input.addEventListener("change", function () {
        var next = Object.assign({}, state.steps);
        next[i] = input.checked;
        save({ steps: next });
      });
      label.appendChild(input);
      label.appendChild(el("span", "tick__box"));
      row.appendChild(label);

      steps.appendChild(row);
    });
    page.appendChild(steps);

    var panel = el("div", "panel");
    panel.appendChild(el("div", "panel__head", "On exam day"));
    var grid = el("div", "panel__grid");
    EXAM_DAY.forEach(function (t) { grid.appendChild(el("div", null, t)); });
    panel.appendChild(grid);
    page.appendChild(panel);

    return page;
  }

  /* ---------- study guide ---------- */

  function domainProgress(certId, di) {
    var d = cert(certId).domains[di];
    var total = d.concepts.length + d.questions.length;
    var hit = 0;
    d.concepts.forEach(function (x, ci) {
      if (state.done[certId + "-" + di + "-" + ci]) hit++;
    });
    d.questions.forEach(function (q, qi) {
      if (isRight(q, state.quizAnswers[certId + "-" + di + "-" + qi])) hit++;
    });
    return total ? Math.round(hit / total * 100) : 0;
  }

  function quizScore(certId, di) {
    var d = cert(certId).domains[di];
    var answered = 0;
    var right = 0;
    d.questions.forEach(function (q, qi) {
      var a = state.quizAnswers[certId + "-" + di + "-" + qi];
      if (!hasAnswer(a)) return;
      answered++;
      if (isRight(q, a)) right++;
    });
    return { answered: answered, right: right, total: d.questions.length };
  }

  /* The domain switcher, shown on the overview and on every domain page. */
  function renderRail(certId, activeIdx) {
    var rail = el("nav", "rail");
    rail.setAttribute("aria-label", "Domains");
    cert(certId).domains.forEach(function (d, di) {
      var a = el("a", "rail__item");
      a.href = GUIDES[certId] + "/d" + (di + 1);
      if (di === activeIdx) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
      var top = el("div", "rail__top");
      top.appendChild(el("span", "rail__code", d.code));
      top.appendChild(el("span", "rail__weight", d.weight + "%"));
      a.appendChild(top);
      a.appendChild(el("div", "rail__name", d.short));
      var bar = el("div", "bar");
      var fill = el("span");
      fill.style.width = domainProgress(certId, di) + "%";
      bar.appendChild(fill);
      a.appendChild(bar);
      rail.appendChild(a);
    });
    return rail;
  }

  function renderGuideOverview(certId) {
    var c = cert(certId);
    var page = el("div", "page");
    page.appendChild(el("div", "page__eyebrow", c.code + " · Study guide"));
    page.appendChild(el("h1", "page__title", c.name));
    page.appendChild(el("p", "page__lead", c.blurb));

    if (c.exam) {
      var facts = el("div", "facts");
      c.exam.forEach(function (row) {
        var f = el("div", "facts__item");
        f.appendChild(el("div", "facts__key", row.k));
        f.appendChild(elRich("div", "facts__val", row.v));
        facts.appendChild(f);
      });
      page.appendChild(facts);
    }

    var head = el("div", "section__head");
    head.appendChild(el("div", "eyebrow", c.domains.length + " domains"));
    head.appendChild(el("div", "section__note", c.domainsNote ||
      "Weights are the share of the exam, not the share of the reading."));
    page.appendChild(head);

    var list = el("div", "domains");
    c.domains.forEach(function (d, di) {
      var a = el("a", "domain-card");
      a.href = GUIDES[certId] + "/d" + (di + 1);
      var top = el("div", "domain-card__top");
      top.appendChild(el("span", "domain-card__code", d.code + " · " + d.weight + "%"));
      top.appendChild(el("span", "domain-card__meta",
        plural(d.concepts.length, "lesson") + " · " + plural(d.questions.length, "question")));
      a.appendChild(top);
      a.appendChild(el("div", "domain-card__name", d.name));
      a.appendChild(el("div", "domain-card__summary", d.summary));
      var bar = el("div", "bar");
      var fill = el("span");
      fill.style.width = domainProgress(certId, di) + "%";
      bar.appendChild(fill);
      a.appendChild(bar);
      list.appendChild(a);
    });
    page.appendChild(list);

    if (c.panels) {
      var panels = el("div", "panels");
      c.panels.forEach(function (p) {
        var panel = el("div", "panel");
        panel.appendChild(el("div", "panel__head", p.head));
        var list = el(p.ordered ? "ol" : "ul", "scenarios");
        if (!p.ordered) list.classList.add("scenarios--plain");
        p.items.forEach(function (t) { list.appendChild(elRich("li", null, t)); });
        panel.appendChild(list);
        panels.appendChild(panel);
      });
      page.appendChild(panels);
    }

    page.appendChild(el("div", "footnote", c.footnote ||
      "Written from the official exam guide and the published course outline. Confirm the current fee, item count and duration with the certifying organisation before you book."));

    return page;
  }

  function renderLesson(certId, di, lesson, ci) {
    var node = el("article", "lesson");

    var top = el("div", "lesson__top");
    var heading = el("div", "lesson__heading");
    heading.appendChild(el("span", "lesson__ref", lesson.ref));
    var titleId = "lesson-" + di + "-" + ci;
    var title = el("h3", "lesson__title", lesson.title);
    title.id = titleId;
    heading.appendChild(title);
    if (lesson.weight) heading.appendChild(el("span", "lesson__weight", lesson.weight + "%"));
    top.appendChild(heading);

    var key = certId + "-" + di + "-" + ci;
    var label = el("label", "tick");
    label.title = "Mark as read";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!state.done[key];
    input.setAttribute("aria-labelledby", titleId);
    input.addEventListener("change", function () {
      var next = Object.assign({}, state.done);
      if (input.checked) next[key] = true; else delete next[key];
      save({ done: next });
      node.classList.toggle("is-read", input.checked);
      renderSidebar();
      refreshBars();
    });
    label.appendChild(input);
    label.appendChild(el("span", "tick__box"));
    top.appendChild(label);
    node.appendChild(top);
    if (input.checked) node.classList.add("is-read");

    node.appendChild(elRich("p", "lesson__body", lesson.body));

    if (lesson.points && lesson.points.length) {
      var ul = el("ul", "lesson__points");
      lesson.points.forEach(function (t) { ul.appendChild(elRich("li", null, t)); });
      node.appendChild(ul);
    }

    if (lesson.code) {
      var fig = el("figure", "code");
      fig.appendChild(el("figcaption", null, lesson.code.label));
      var pre = el("pre");
      pre.appendChild(el("code", null, lesson.code.text));
      fig.appendChild(pre);
      node.appendChild(fig);
    }

    /* `exam` is a paragraph of exam notes, or a list of the traps this lesson's
       distractors are built from. */
    if (lesson.exam) {
      var note = el("div", "lesson__exam");
      note.appendChild(el("div", "lesson__exam-head",
        Array.isArray(lesson.exam) ? "Traps" : "On the exam"));
      if (Array.isArray(lesson.exam)) {
        var traps = el("ul", "lesson__traps");
        lesson.exam.forEach(function (t) { traps.appendChild(elRich("li", null, t)); });
        note.appendChild(traps);
      } else {
        note.appendChild(elRich("div", null, lesson.exam));
      }
      node.appendChild(note);
    }

    return node;
  }

  function renderQuestion(certId, di, q, qi) {
    var key = certId + "-" + di + "-" + qi;
    var answer = state.quizAnswers[key];
    var answered = hasAnswer(answer);
    var right = isRight(q, answer);

    function commit(a) {
      var next = Object.assign({}, state.quizAnswers);
      next[key] = a;
      save({ quizAnswers: next });
      render();
    }

    var node = el("div", "q");
    if (answered) node.classList.add("is-answered");

    var top = el("div", "q__top");
    top.appendChild(el("span", "q__n", "Q" + (qi + 1)));
    if (q.d) top.appendChild(el("span", "q__diff", q.d === "challenging" ? "Challenging" : "Standard"));
    if (isMulti(q) || isCls(q)) top.appendChild(el("span", "q__diff is-multi", pickLabel(q)));
    if (answered) {
      top.appendChild(el("span", right ? "q__verdict is-right" : "q__verdict is-wrong",
        right ? "Correct" : "Incorrect"));
    }
    node.appendChild(top);
    node.appendChild(elRich("p", "q__text", q.text));
    node.appendChild(questionBody(q, "reveal", answer, commit));

    if (answered) {
      var why = el("div", "q__why");
      why.appendChild(el("span", "q__why-head", whyHead(q)));
      why.appendChild(rich(q.why));
      node.appendChild(why);
    }

    return node;
  }

  function renderDomain(certId, di) {
    var c = cert(certId);
    var d = c.domains[di];
    var page = el("div", "page");

    var crumb = el("div", "crumb");
    var back = el("a", null, "← " + c.code + " study guide");
    back.href = GUIDES[certId];
    crumb.appendChild(back);
    page.appendChild(crumb);
    page.appendChild(renderRail(certId, di));

    var head = el("header", "domain__head");
    head.appendChild(el("div", "page__eyebrow",
      "Domain " + (di + 1) + " of " + c.domains.length + " · " + d.weight + "% of the exam"));
    head.appendChild(el("h1", "page__title", d.name));
    head.appendChild(el("p", "page__lead", d.intro));
    page.appendChild(head);

    var lessons = el("div", "lessons");
    d.concepts.forEach(function (lesson, ci) {
      lessons.appendChild(renderLesson(certId, di, lesson, ci));
    });
    page.appendChild(lessons);

    /* ---- end-of-domain quiz ---- */
    var score = quizScore(certId, di);
    var quiz = el("section", "quiz");
    quiz.setAttribute("aria-label", "Domain quiz");

    var qhead = el("div", "quiz__head");
    var qtitle = el("div");
    qtitle.appendChild(el("div", "eyebrow", "Check yourself"));
    qtitle.appendChild(el("h2", "quiz__title", "Domain quiz"));
    qhead.appendChild(qtitle);

    var qmeta = el("div", "quiz__meta");
    qmeta.appendChild(el("div", "quiz__score",
      score.answered
        ? score.right + " / " + score.answered + " correct" +
          (score.answered < score.total ? " · " + (score.total - score.answered) + " left" : "")
        : score.total + " questions"));
    if (score.answered) {
      var reset = el("button", "quiz__reset", "Reset this quiz");
      reset.type = "button";
      reset.addEventListener("click", function () {
        var next = Object.assign({}, state.quizAnswers);
        d.questions.forEach(function (q, qi) { delete next[certId + "-" + di + "-" + qi]; });
        save({ quizAnswers: next });
        render();
      });
      qmeta.appendChild(reset);
    }
    qhead.appendChild(qmeta);
    quiz.appendChild(qhead);

    d.questions.forEach(function (q, qi) {
      quiz.appendChild(renderQuestion(certId, di, q, qi));
    });
    page.appendChild(quiz);

    /* ---- previous / next domain ---- */
    var nav = el("div", "guide-nav");
    if (di > 0) {
      var prev = el("a", "guide-nav__link");
      prev.href = GUIDES[certId] + "/d" + di;
      prev.appendChild(el("span", "guide-nav__dir", "Previous"));
      prev.appendChild(el("span", "guide-nav__name", c.domains[di - 1].name));
      nav.appendChild(prev);
    }
    if (di < c.domains.length - 1) {
      var next = el("a", "guide-nav__link guide-nav__link--next");
      next.href = GUIDES[certId] + "/d" + (di + 2);
      next.appendChild(el("span", "guide-nav__dir", "Next"));
      next.appendChild(el("span", "guide-nav__name", c.domains[di + 1].name));
      nav.appendChild(next);
    }
    page.appendChild(nav);

    return page;
  }

  /* Lesson ticks update in place rather than re-rendering, so the rail bars are
     refreshed by hand. */
  function refreshBars() {
    var items = document.querySelectorAll(".rail__item .bar > span");
    Array.prototype.forEach.call(items, function (fill, di) {
      fill.style.width = domainProgress(state.certId, di) + "%";
    });
  }

  /* ---------- practice: shared helpers ---------- */

  /* Every certification with a written bank. Items and papers are tagged with
     their certification as they are collected, so the bank, the papers and the
     results pages work the same whichever exam they belong to. */
  var PRACTICE = [
    { certId: "CCAR-F", bank: window.CCARF_BANK, mocks: window.CCARF_MOCKS },
    { certId: "CCDV-F", bank: window.CCDVF_BANK, mocks: window.CCDVF_MOCKS },
    { certId: "CCAR-P", bank: window.CCARP_BANK, mocks: window.CCARP_MOCKS }
  ].filter(function (p) { return p.bank && p.bank.length && p.mocks && p.mocks.length; });

  var BANK = [];
  var MOCKS = [];
  PRACTICE.forEach(function (p) {
    p.bank.forEach(function (q) { q.cert = p.certId; BANK.push(q); });
    p.mocks.forEach(function (m) { m.cert = p.certId; MOCKS.push(m); });
  });

  var PASS_MARK = 720;

  var BY_ID = {};
  BANK.forEach(function (q) { BY_ID[q.id] = q; });

  /* The bank shows one certification at a time. */
  function bankCert() {
    for (var i = 0; i < PRACTICE.length; i++) {
      if (PRACTICE[i].certId === state.bankCert) return state.bankCert;
    }
    return PRACTICE.length ? PRACTICE[0].certId : null;
  }

  function certItems(certId) {
    return BANK.filter(function (q) { return q.cert === certId; });
  }

  function domainOf(q) { return cert(q.cert).domains[q.dom]; }

  function diffLabel(d) { return d === "challenging" ? "Challenging" : "Standard"; }

  /* 100–1000, the exam's own scale: every item correct is 1000, none is 100. */
  function scaled(right, total) {
    return total ? Math.round(100 + (right / total) * 900) : 100;
  }

  function mock(id) {
    for (var i = 0; i < MOCKS.length; i++) if (MOCKS[i].id === id) return MOCKS[i];
    return null;
  }

  function attempt(id) { return state.attempts[id] || null; }

  /* Time on the results page: seconds while the run was short, minutes after. */
  function takenLabel(sec) {
    if (sec < 90) return sec + " s taken";
    return Math.round(sec / 60) + " min taken";
  }

  function mmss(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    var m = Math.floor(s / 60);
    return (m < 10 ? "0" : "") + m + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
  }

  /* One reusable question card. `mode` is "reveal" (bank: answer and see why),
     "exam" (mock in progress: pick, no feedback) or "review" (after submit). */
  function questionCard(q, n, mode, answer, onPick) {
    var node = el("div", "q");
    var answered = hasAnswer(answer);
    var right = isRight(q, answer);
    if (answered && mode !== "exam") node.classList.add("is-answered");

    var top = el("div", "q__top");
    top.appendChild(el("span", "q__n", "Q" + n));
    top.appendChild(el("span", "q__diff", domainOf(q).code + " · " + domainOf(q).short));
    top.appendChild(el("span", "q__diff", diffLabel(q.diff)));
    if (isMulti(q) || isCls(q)) top.appendChild(el("span", "q__diff is-multi", pickLabel(q)));
    if (answered && mode !== "exam") {
      top.appendChild(el("span", right ? "q__verdict is-right" : "q__verdict is-wrong",
        right ? "Correct" : "Incorrect"));
    }
    node.appendChild(top);

    if (q.scen) node.appendChild(el("div", "q__scen", q.scen));
    node.appendChild(elRich("p", "q__text", q.text));
    node.appendChild(questionBody(q, mode, answer, onPick));

    if (answered && mode !== "exam") {
      var why = el("div", "q__why");
      why.appendChild(el("span", "q__why-head", whyHead(q)));
      why.appendChild(rich(q.why));
      node.appendChild(why);
    }
    if (mode === "review" && !answered) {
      var skipped = el("div", "q__why");
      skipped.appendChild(el("span", "q__why-head", missedHead(q)));
      skipped.appendChild(rich(q.why));
      node.appendChild(skipped);
    }

    return node;
  }

  /* ---------- question bank ---------- */

  function bankFiltered() {
    return certItems(bankCert()).filter(function (q) {
      if (state.bankDomain !== "all" && q.dom !== Number(state.bankDomain)) return false;
      if (state.bankDiff !== "all" && q.diff !== state.bankDiff) return false;
      var a = state.bankAnswers[q.id];
      if (state.bankOnly === "unanswered" && hasAnswer(a)) return false;
      if (state.bankOnly === "wrong" && (!hasAnswer(a) || isRight(q, a))) return false;
      return true;
    });
  }

  function bankTally(list) {
    var answered = 0;
    var right = 0;
    list.forEach(function (q) {
      var a = state.bankAnswers[q.id];
      if (!hasAnswer(a)) return;
      answered++;
      if (isRight(q, a)) right++;
    });
    return { total: list.length, answered: answered, right: right };
  }

  function filterRow(label, options, current, onPick) {
    var row = el("div", "filters__row");
    row.appendChild(el("div", "filters__label", label));
    var chips = el("div", "filters__chips");
    options.forEach(function (o) {
      var b = el("button", "chip", o.label);
      b.type = "button";
      if (String(o.value) === String(current)) b.classList.add("is-on");
      b.addEventListener("click", function () { onPick(o.value); });
      chips.appendChild(b);
    });
    row.appendChild(chips);
    return row;
  }

  function renderBank() {
    var certId = bankCert();
    var c = cert(certId);
    var page = el("div", "page");
    page.appendChild(el("div", "page__eyebrow", "Practice · " + c.code));
    page.appendChild(el("h1", "page__title", "Question bank"));
    page.appendChild(el("p", "page__lead",
      "Every item from the mock papers, drillable one at a time with the reasoning shown as soon as you answer. Pick an exam, then filter down to a domain you are weak on, or to the questions you got wrong."));

    var domainOpts = [{ label: "All domains", value: "all" }];
    c.domains.forEach(function (d, di) { domainOpts.push({ label: d.code + " · " + d.short, value: di }); });

    var filters = el("div", "filters");
    if (PRACTICE.length > 1) {
      filters.appendChild(filterRow("Exam", PRACTICE.map(function (p) {
        return { label: p.certId + " · " + cert(p.certId).short, value: p.certId };
      }), certId, function (v) {
        /* Domain numbers mean different things in each exam, so the domain
           filter starts again when the exam changes. */
        save({ bankCert: v, bankDomain: "all" });
        render();
      }));
    }
    filters.appendChild(filterRow("Domain", domainOpts, state.bankDomain, function (v) {
      save({ bankDomain: v }); render();
    }));
    filters.appendChild(filterRow("Difficulty", [
      { label: "Both", value: "all" },
      { label: "Standard", value: "standard" },
      { label: "Challenging", value: "challenging" }
    ], state.bankDiff, function (v) { save({ bankDiff: v }); render(); }));
    filters.appendChild(filterRow("Show", [
      { label: "Everything", value: "all" },
      { label: "Unanswered", value: "unanswered" },
      { label: "Answered wrong", value: "wrong" }
    ], state.bankOnly, function (v) { save({ bankOnly: v }); render(); }));
    page.appendChild(filters);

    var items = certItems(certId);
    var list = bankFiltered();
    var all = bankTally(items);

    var head = el("div", "quiz__head");
    var left = el("div");
    left.appendChild(el("div", "eyebrow", "Showing " + list.length + " of " + items.length + " questions"));
    left.appendChild(el("h2", "quiz__title",
      all.answered ? all.right + " of " + all.answered + " correct so far" : "Nothing answered yet"));
    head.appendChild(left);

    var meta = el("div", "quiz__meta");
    meta.appendChild(el("div", "quiz__score",
      all.answered
        ? Math.round(all.right / all.answered * 100) + "% · " + (items.length - all.answered) + " left"
        : items.length + " questions"));
    if (all.answered) {
      var reset = el("button", "quiz__reset", "Reset the bank");
      reset.type = "button";
      reset.addEventListener("click", function () {
        /* Only this exam's answers — the other bank keeps its history. */
        var next = Object.assign({}, state.bankAnswers);
        items.forEach(function (q) { delete next[q.id]; });
        save({ bankAnswers: next });
        render();
      });
      meta.appendChild(reset);
    }
    head.appendChild(meta);
    page.appendChild(head);

    var quiz = el("section", "quiz quiz--bank");
    quiz.setAttribute("aria-label", "Question bank");
    if (!list.length) {
      quiz.appendChild(el("p", "empty", "No questions match these filters. Widen them, or reset the bank to start again."));
    }
    list.forEach(function (q, i) {
      var card = questionCard(q, i + 1, "reveal", state.bankAnswers[q.id], function (answer) {
        var next = Object.assign({}, state.bankAnswers);
        next[q.id] = answer;
        save({ bankAnswers: next });
        var fresh = questionCard(q, i + 1, "reveal", answer, function () {});
        quiz.replaceChild(fresh, card);
        card = fresh;
        refreshBankHead(head, items);
      });
      quiz.appendChild(card);
    });
    page.appendChild(quiz);

    return page;
  }

  /* The header counters move on every answer; the list itself does not. */
  function refreshBankHead(head, items) {
    var all = bankTally(items);
    var title = head.querySelector(".quiz__title");
    var score = head.querySelector(".quiz__score");
    if (title) title.textContent = all.answered
      ? all.right + " of " + all.answered + " correct so far"
      : "Nothing answered yet";
    if (score) score.textContent = all.answered
      ? Math.round(all.right / all.answered * 100) + "% · " + (items.length - all.answered) + " left"
      : items.length + " questions";
  }

  /* ---------- mock exams ---------- */

  function scoreAttempt(m, a) {
    var byDomain = cert(m.cert).domains.map(function () { return { right: 0, total: 0 }; });
    var right = 0;
    m.ids.forEach(function (qid) {
      var q = BY_ID[qid];
      byDomain[q.dom].total++;
      if (isRight(q, a.answers[qid])) { right++; byDomain[q.dom].right++; }
    });
    return {
      right: right, total: m.ids.length, scaled: scaled(right, m.ids.length),
      byDomain: byDomain, at: Date.now(),
      seconds: a.startedAt ? Math.round((Date.now() - a.startedAt) / 1000) : null
    };
  }

  function submitAttempt(m) {
    var a = attempt(m.id);
    if (!a) return;
    var scores = Object.assign({}, state.scores);
    scores[m.id] = scoreAttempt(m, a);
    var attempts = Object.assign({}, state.attempts);
    attempts[m.id] = Object.assign({}, a, { submitted: true });
    save({ scores: scores, attempts: attempts, lastMock: m.id });
    window.location.hash = "#/mock/" + m.id + "/result";
  }

  /* One line per certification, shown above its papers on the index. */
  var MOCK_NOTES = {
    "CCAR-F": "Three full-length papers: 60 questions in 120 minutes, the real exam's own length and domain proportions. The standard and the challenge paper partition the bank — they share no question, so the pair can be sat back to back — and the challenge paper is deliberately the harder of the two. The practical paper works the four production scenarios end to end, carries five situations the others never put to you, and is the only paper that revisits their questions.",
    "CCDV-F": "Two full-length papers: 53 questions in 120 minutes, the real exam's own length and domain proportions, with single and multiple-response items mixed as they are on the day. The standard paper sits at the level of the guide's sample items; the challenge paper is deliberately above it. They share no question, so the pair can be sat back to back.",
    "CCAR-P": "Two full-length papers: 63 standalone items in 120 minutes, the real exam's own length and domain proportions — Integration the largest block, prompting the smallest. Single response, multiple response and classification items are mixed as they are on the day. The standard paper sits at the level of the study guide's own check-yourself items; the challenge paper is deliberately above it, with longer scenarios and more options that are defensible in isolation. They share no question."
  };

  function renderMockIndex() {
    var page = el("div", "page");
    page.appendChild(el("div", "page__eyebrow", "Practice"));
    page.appendChild(el("h1", "page__title", "Mock exams"));
    page.appendChild(el("p", "page__lead",
      "Timed papers at the real domain weights, scored on the 100–1000 scale with the pass mark at 720. The clock survives a reload, you can move freely between questions, and nothing is revealed until you submit."));

    PRACTICE.forEach(function (p) {
      var head = el("div", "section__head");
      head.appendChild(el("div", "eyebrow", p.certId + " · " + cert(p.certId).short));
      head.appendChild(el("div", "section__note", MOCK_NOTES[p.certId] || ""));
      page.appendChild(head);

      var grid = el("div", "mocks");
      p.mocks.forEach(function (m) {
        var card = el("a", "mock-card");
        card.href = "#/mock/" + m.id;
        var a = attempt(m.id);
        var s = state.scores[m.id];

        var top = el("div", "mock-card__top");
        top.appendChild(el("span", "mock-card__code", m.label));
        top.appendChild(el("span", "q__diff", m.diff));
        card.appendChild(top);

        card.appendChild(el("div", "mock-card__blurb", m.blurb));
        card.appendChild(el("div", "mock-card__meta", m.ids.length + " questions · " + m.minutes + " min · pass at " + PASS_MARK));

        var foot = el("div", "mock-card__foot");
        if (s) {
          var badge = el("span", s.scaled >= PASS_MARK ? "verdict is-pass" : "verdict is-fail",
            s.scaled >= PASS_MARK ? "Passed" : "Not yet");
          foot.appendChild(badge);
          foot.appendChild(el("span", "mock-card__score", s.scaled + " / 1000 · " + s.right + " of " + s.total + " correct"));
        } else if (a && !a.submitted) {
          foot.appendChild(el("span", "mock-card__score", "In progress · " + Object.keys(a.answers).length + " of " + m.ids.length + " answered"));
        } else {
          foot.appendChild(el("span", "mock-card__score", "Not started"));
        }
        card.appendChild(foot);
        grid.appendChild(card);
      });
      page.appendChild(grid);
    });

    page.appendChild(el("div", "footnote",
      "Scores use the exam's own 100–1000 scale — every item right is 1000, none is 100 — with the pass mark at 720. That is a mapping of your raw score, not the certifying organisation's scoring model, so treat it as a guide rather than a prediction."));

    return page;
  }

  var EXAM_RULES = {
    "CCAR-F": [
      ["60 questions", "Full length, at the real paper's weights: 16 from D1, 10 from D2, 12 from D3, 12 from D4 and 10 from D5."],
      ["120 minutes", "The real exam's allowance — two minutes an item. The clock keeps running if you leave the page and comes back where it was."],
      ["No feedback until you submit", "You can move freely between questions and change any answer. Explanations appear on the results page."],
      ["No guessing penalty", "An unanswered question scores the same as a wrong one, so answer everything before the clock runs out."]
    ],
    "CCDV-F": [
      ["53 questions", "Full length, at the official weights: 8 from D1, 17 or 18 from D2, 2 from D3, 1 from D4, 9 from D5, 6 from D6, 4 from D7 and 5 or 6 from D8."],
      ["120 minutes", "The real exam's allowance — a little over two minutes an item. The clock keeps running if you leave the page and comes back where it was."],
      ["Single and multiple response", "Items that need more than one option say so. A multiple-response item scores only when every option matches."],
      ["No feedback until you submit", "Move freely between questions, flag what you want to revisit, and change any answer. Explanations appear on the results page."]
    ],
    "CCAR-P": [
      ["63 questions", "Full length, at the blueprint weights: 11 from D1, 8 from D2, 12 from D3, 10 from D4, 9 from D5, 9 from D6 and 4 from D7."],
      ["120 minutes", "The real exam's allowance — about 114 seconds an item. Answer decisively and flag rather than deliberate; the clock keeps running if you leave the page and comes back where it was."],
      ["Standalone items", "Single response, multiple response and classification, never linked into a shared scenario, so no single misread situation costs you several marks. Items that need more than one option say so, and score only when every option matches."],
      ["Classification items", "A criterion and five statements, each dropped into its own box — True or False, or which of several strategies the description matches. Every statement has to be placed and the item scores only when all five are right; a half-placed one is kept as you left it but counts as unanswered."],
      ["No feedback until you submit", "Move freely between questions, flag what you want to revisit, and change any answer. Explanations appear on the results page."]
    ]
  };

  function renderMockStart(m) {
    var page = el("div", "page");
    var crumb = el("div", "crumb");
    var back = el("a", null, "← Mock exams");
    back.href = "#/mock";
    crumb.appendChild(back);
    page.appendChild(crumb);

    page.appendChild(el("div", "page__eyebrow", m.diff + " paper · " + m.cert));
    page.appendChild(el("h1", "page__title", m.label));
    page.appendChild(el("p", "page__lead", m.blurb));

    var facts = el("div", "facts");
    (EXAM_RULES[m.cert] || []).forEach(function (row) {
      var f = el("div", "facts__item");
      f.appendChild(el("div", "facts__key", row[0]));
      f.appendChild(el("div", "facts__val", row[1]));
      facts.appendChild(f);
    });
    page.appendChild(facts);

    var s = state.scores[m.id];
    if (s) {
      var prev = el("div", "panel");
      prev.appendChild(el("div", "panel__head",
        "Last attempt: " + s.scaled + " / 1000 — " + (s.scaled >= PASS_MARK ? "passed" : "below the pass mark")));
      var grid = el("div", "panel__grid");
      grid.appendChild(el("div", s.right + " of " + s.total + " correct."));
      var link = el("div");
      var a = el("a", null, "Review that attempt →");
      a.href = "#/mock/" + m.id + "/result";
      link.appendChild(a);
      grid.appendChild(link);
      prev.appendChild(grid);
      page.appendChild(prev);
    }

    var actions = el("div", "hero__actions");
    var start = el("button", "btn btn--primary", s ? "Retake the paper →" : "Start the exam →");
    start.type = "button";
    start.addEventListener("click", function () {
      var attempts = Object.assign({}, state.attempts);
      attempts[m.id] = {
        answers: {}, flags: {}, idx: 0, submitted: false,
        startedAt: Date.now(), deadline: Date.now() + m.minutes * 60000
      };
      var scores = Object.assign({}, state.scores);
      delete scores[m.id];
      save({ attempts: attempts, scores: scores });
      render();
      window.scrollTo(0, 0);
    });
    actions.appendChild(start);
    page.appendChild(actions);

    return page;
  }

  var timerId = null;

  function stopTimer() {
    if (timerId) { window.clearInterval(timerId); timerId = null; }
  }

  function renderMockRun(m, a) {
    var page = el("div", "page page--exam");

    var idx = Math.min(a.idx || 0, m.ids.length - 1);
    var qid = m.ids[idx];
    var q = BY_ID[qid];

    var bar = el("div", "exam-bar");
    var left = el("div", "exam-bar__left");
    left.appendChild(el("div", "exam-bar__label", m.label + " · " + m.diff));
    left.appendChild(el("div", "exam-bar__pos", "Question " + (idx + 1) + " of " + m.ids.length));
    bar.appendChild(left);

    var clock = el("div", "exam-bar__clock", mmss(a.deadline - Date.now()));
    if (a.deadline - Date.now() < 5 * 60000) clock.classList.add("is-low");
    bar.appendChild(clock);
    page.appendChild(bar);

    /* A classification item is kept as soon as the first statement is placed, so
       the picks survive a reload, but it only counts as answered once every
       statement has been placed — it scores no other way. */
    var done = m.ids.filter(function (id) { return hasAnswer(a.answers[id]); }).length;

    var progress = el("div", "bar");
    var fill = el("span");
    fill.style.width = Math.round(done / m.ids.length * 100) + "%";
    progress.appendChild(fill);
    page.appendChild(progress);

    /* The card hands back the answer the click produces — an option index, the
       remaining picks of a multiple-response item, or a category per statement. */
    var card = questionCard(q, idx + 1, "exam", a.answers[qid], function (answer) {
      var answers = Object.assign({}, a.answers);
      if (hasPick(answer)) answers[qid] = answer; else delete answers[qid];
      var attempts = Object.assign({}, state.attempts);
      attempts[m.id] = Object.assign({}, a, { answers: answers });
      save({ attempts: attempts });
      render();
    });
    page.appendChild(card);

    var nav = el("div", "exam-nav");
    var prev = el("button", "btn btn--ghost", "← Previous");
    prev.type = "button";
    prev.disabled = idx === 0;
    prev.addEventListener("click", function () { goto(idx - 1); });
    nav.appendChild(prev);

    var flag = el("button", "btn btn--ghost", a.flags[qid] ? "Unflag" : "Flag for review");
    flag.type = "button";
    flag.addEventListener("click", function () {
      var flags = Object.assign({}, a.flags);
      if (flags[qid]) delete flags[qid]; else flags[qid] = true;
      var attempts = Object.assign({}, state.attempts);
      attempts[m.id] = Object.assign({}, a, { flags: flags });
      save({ attempts: attempts });
      render();
    });
    nav.appendChild(flag);

    var next = el("button", "btn btn--ghost", "Next →");
    next.type = "button";
    next.disabled = idx === m.ids.length - 1;
    next.addEventListener("click", function () { goto(idx + 1); });
    nav.appendChild(next);
    page.appendChild(nav);

    function goto(i) {
      var attempts = Object.assign({}, state.attempts);
      attempts[m.id] = Object.assign({}, a, { idx: i });
      save({ attempts: attempts });
      render();
      window.scrollTo(0, 0);
    }

    var grid = el("div", "exam-grid");
    grid.setAttribute("aria-label", "Jump to a question");
    m.ids.forEach(function (id, i) {
      var b = el("button", "exam-grid__n", String(i + 1));
      b.type = "button";
      if (hasAnswer(a.answers[id])) b.classList.add("is-done");
      else if (hasPick(a.answers[id])) b.classList.add("is-part");
      if (a.flags[id]) b.classList.add("is-flagged");
      if (i === idx) b.classList.add("is-current");
      b.addEventListener("click", function () { goto(i); });
      grid.appendChild(b);
    });
    page.appendChild(grid);

    var submitRow = el("div", "exam-submit");
    var left2 = el("div", "exam-submit__note",
      done + " of " + m.ids.length + " answered" +
      (Object.keys(a.flags).length ? " · " + Object.keys(a.flags).length + " flagged" : ""));
    submitRow.appendChild(left2);
    var submit = el("button", "btn btn--primary", "Submit and score");
    submit.type = "button";
    submit.addEventListener("click", function () {
      var missing = m.ids.length - done;
      if (missing && !window.confirm(missing + " question" + (missing > 1 ? "s are" : " is") +
        " still unanswered or incomplete. Those score as wrong. Submit anyway?")) return;
      stopTimer();
      submitAttempt(m);
    });
    submitRow.appendChild(submit);
    page.appendChild(submitRow);

    stopTimer();
    timerId = window.setInterval(function () {
      var left3 = a.deadline - Date.now();
      if (left3 <= 0) {
        clock.textContent = "00:00";
        stopTimer();
        submitAttempt(m);
        return;
      }
      clock.textContent = mmss(left3);
      clock.classList.toggle("is-low", left3 < 5 * 60000);
    }, 1000);

    return page;
  }

  function renderMockResult(m) {
    var s = state.scores[m.id];
    var page = el("div", "page");

    var crumb = el("div", "crumb");
    var back = el("a", null, "← Mock exams");
    back.href = "#/mock";
    crumb.appendChild(back);
    page.appendChild(crumb);

    if (!s) {
      page.appendChild(el("div", "page__eyebrow", "Result"));
      page.appendChild(el("h1", "page__title", m.label));
      page.appendChild(el("p", "page__lead", "You have not finished this paper yet."));
      var go = el("div", "hero__actions");
      var a0 = el("a", "btn btn--primary", "Open the paper →");
      a0.href = "#/mock/" + m.id;
      go.appendChild(a0);
      page.appendChild(go);
      return page;
    }

    var passed = s.scaled >= PASS_MARK;
    page.appendChild(el("div", "page__eyebrow", m.diff + " paper · result"));
    page.appendChild(el("h1", "page__title", m.label));

    var score = el("div", "score");
    var big = el("div", "score__main");
    big.appendChild(el("div", "score__value", String(s.scaled)));
    big.appendChild(el("div", "score__scale", "/ 1000 · pass at " + PASS_MARK));
    score.appendChild(big);
    var side = el("div", "score__side");
    side.appendChild(el("span", passed ? "verdict is-pass" : "verdict is-fail", passed ? "Passed" : "Below the pass mark"));
    side.appendChild(el("div", "score__raw", s.right + " of " + s.total + " correct" +
      (s.seconds ? " · " + takenLabel(s.seconds) : "")));
    score.appendChild(side);
    page.appendChild(score);

    var head = el("div", "section__head");
    head.appendChild(el("div", "eyebrow", "By domain"));
    head.appendChild(el("div", "section__note",
      "The real exam reports a scaled total, not a per-domain breakdown — but this is where your revision should go next."));
    page.appendChild(head);

    var table = el("div", "bydomain");
    cert(m.cert).domains.forEach(function (d, di) {
      var row = el(hasGuide(m.cert) ? "a" : "div", "bydomain__row");
      if (hasGuide(m.cert)) row.href = GUIDES[m.cert] + "/d" + (di + 1);
      var name = el("div", "bydomain__name");
      name.appendChild(el("span", "bydomain__code", d.code));
      name.appendChild(el("span", null, d.name));
      row.appendChild(name);
      var r = s.byDomain[di];
      var barw = r.total ? Math.round(r.right / r.total * 100) : 0;
      var bar = el("div", "bar");
      var fill = el("span");
      fill.style.width = barw + "%";
      if (barw < 60) fill.style.background = "var(--accent)";
      bar.appendChild(fill);
      row.appendChild(bar);
      row.appendChild(el("div", "bydomain__n", r.right + " / " + r.total));
      table.appendChild(row);
    });
    page.appendChild(table);

    var actions = el("div", "hero__actions");
    var retake = el("button", "btn btn--primary", "Retake this paper");
    retake.type = "button";
    retake.addEventListener("click", function () {
      var attempts = Object.assign({}, state.attempts);
      delete attempts[m.id];
      var scores = Object.assign({}, state.scores);
      delete scores[m.id];
      save({ attempts: attempts, scores: scores });
      window.location.hash = "#/mock/" + m.id;
    });
    actions.appendChild(retake);
    var bankLink = el("a", "btn btn--ghost", "Drill the question bank");
    bankLink.href = "#/bank";
    actions.appendChild(bankLink);
    page.appendChild(actions);

    var a = attempt(m.id) || { answers: {} };
    var review = el("section", "quiz");
    review.setAttribute("aria-label", "Review");
    var rhead = el("div", "quiz__head");
    var rtitle = el("div");
    rtitle.appendChild(el("div", "eyebrow", "Every question, with the reasoning"));
    rtitle.appendChild(el("h2", "quiz__title", "Review"));
    rhead.appendChild(rtitle);
    review.appendChild(rhead);
    m.ids.forEach(function (qid, i) {
      review.appendChild(questionCard(BY_ID[qid], i + 1, "review", a.answers[qid], function () {}));
    });
    page.appendChild(review);

    return page;
  }

  function renderResultShortcut() {
    var last = state.lastMock && state.scores[state.lastMock] && mock(state.lastMock)
      ? state.lastMock : null;
    if (!last) {
      MOCKS.forEach(function (m) { if (state.scores[m.id]) last = m.id; });
    }
    if (last) return renderMockResult(mock(last));

    var page = el("div", "page");
    page.appendChild(el("div", "page__eyebrow", "Practice"));
    page.appendChild(el("h1", "page__title", "My last result"));
    page.appendChild(el("p", "page__lead",
      "Nothing scored yet. Sit one of the papers and your result — total, pass verdict and a domain breakdown — shows up here."));
    var actions = el("div", "hero__actions");
    var a = el("a", "btn btn--primary", "Go to the mock exams →");
    a.href = "#/mock";
    actions.appendChild(a);
    var b = el("a", "btn btn--ghost", "Drill the question bank");
    b.href = "#/bank";
    actions.appendChild(b);
    page.appendChild(actions);
    return page;
  }

  /* ---------- router ---------- */

  var ROUTES = {
    "": "home", "#/": "home", "#/apply": "apply",
    "#/bank": "bank", "#/mock": "mock", "#/result": "result"
  };

  /* #/mock/ar-practical and #/mock/ar-practical/result. */
  var MOCK_HASH = /^#\/mock\/([a-z0-9-]+)(\/result)?$/;

  function matchMock(hash) {
    var m = MOCK_HASH.exec(hash);
    if (!m || !mock(m[1])) return null;
    return { mockId: m[1], result: !!m[2] };
  }

  /* #/ccar-f (guide overview) and #/ccar-f/d3 (one domain). The cert slug is the
     code lowercased, so every entry in GUIDES routes without extra wiring. */
  var GUIDE_HASH = /^#\/([a-z0-9-]+)(?:\/d([1-9][0-9]*))?$/;

  function matchGuide(hash) {
    var m = GUIDE_HASH.exec(hash);
    if (!m) return null;
    var certId = null;
    Object.keys(GUIDES).forEach(function (id) {
      if (GUIDES[id] === "#/" + m[1]) certId = id;
    });
    if (!certId) return null;
    if (m[2] === undefined) return { certId: certId, domainIdx: null };
    var idx = parseInt(m[2], 10) - 1;
    if (idx >= cert(certId).domains.length) return null;
    return { certId: certId, domainIdx: idx };
  }

  /* Resolved once per render: { route, certId?, domainIdx? }. */
  function currentView() {
    var hash = window.location.hash;
    if (hash in ROUTES) return { route: ROUTES[hash] };

    var paper = matchMock(hash);
    if (paper) return { route: "mock", mockId: paper.mockId, result: paper.result };

    var guide = matchGuide(hash);
    if (guide) return { route: "guide", certId: guide.certId, domainIdx: guide.domainIdx };

    /* Unknown hash: fall back to the introduction and keep the URL honest. */
    window.history.replaceState(null, "", window.location.pathname + "#/");
    return { route: "home" };
  }

  function render() {
    stopTimer();

    var view = currentView();
    var patch = { route: view.route };
    if (view.route === "guide") {
      patch.certId = view.certId;
      if (view.domainIdx !== null) patch.domainIdx = view.domainIdx;
    }
    save(patch);

    renderSidebar();

    var content = document.getElementById("content");
    var page;
    var title;
    if (view.route === "guide" && view.domainIdx !== null) {
      page = renderDomain(view.certId, view.domainIdx);
      title = cert(view.certId).domains[view.domainIdx].name + " · " + view.certId;
    } else if (view.route === "guide") {
      page = renderGuideOverview(view.certId);
      title = view.certId + " study guide";
    } else if (view.route === "apply") {
      page = renderApply();
      title = "Applying & booking";
    } else if (view.route === "bank") {
      page = renderBank();
      title = "Question bank";
    } else if (view.route === "mock" && view.mockId) {
      var m = mock(view.mockId);
      var a = attempt(m.id);
      if (view.result) {
        page = renderMockResult(m);
        title = m.label + " · result";
      } else if (a && !a.submitted) {
        page = renderMockRun(m, a);
        title = m.label + " · in progress";
      } else {
        page = renderMockStart(m);
        title = m.label;
      }
    } else if (view.route === "mock") {
      page = renderMockIndex();
      title = "Mock exams";
    } else if (view.route === "result") {
      page = renderResultShortcut();
      title = "My last result";
    } else {
      page = renderIntro();
      title = "Introduction";
    }
    content.textContent = "";
    content.appendChild(page);
    document.title = title + " · Certification Wiki";
  }

  document.getElementById("reset-progress").addEventListener("click", function () {
    save({
      quizAnswers: {}, done: {}, steps: {},
      bankAnswers: {}, attempts: {}, scores: {}, lastMock: null
    });
    render();
  });

  window.addEventListener("hashchange", function () {
    render();
    window.scrollTo(0, 0);
  });

  render();
})();
