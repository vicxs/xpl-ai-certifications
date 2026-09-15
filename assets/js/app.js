/* Cert Wiki — hash-routed static port of the Claude Design source
   'Cert Wiki Flow.dc.html'. Live routes: the introduction, applying & booking,
   and the CCAR-F study guide (#/ccar-f, #/ccar-f/d1 … d5). The rest of the
   navigation is shown with the "soon" treatment. */

(function () {
  "use strict";

  var DATA = window.DATA;
  var STORE_KEY = "certwiki.flow.v1";

  /* The design's persisted shape, kept intact so the study-guide, question-bank
     and mock-exam routes inherit saved progress when they are ported. */
  var DEFAULT_STATE = {
    route: "home",
    certId: "CCAR-F",
    domainIdx: 0,
    quizAnswers: {},
    done: {},
    steps: {},
    bankCert: "CCAR-F",
    bankDomain: "all",
    bankDiff: "all",
    scores: {}
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
  var GUIDES = { "CCAR-F": "#/ccar-f" };

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
        if (state.quizAnswers[certId + "-" + di + "-" + qi] === q.correct) hit++;
      });
    });
    return total ? Math.round(hit / total * 100) : 0;
  }

  /* ---------- DOM helpers ---------- */

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

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
    { label: "Question bank" },
    { label: "Mock exams" },
    { label: "My last result" }
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
      var item = el("div", "nav__item");
      item.appendChild(el("span", null, n.label));
      practice.appendChild(markSoon(item));
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
    var head = el("div", "section__head");
    head.appendChild(el("div", "eyebrow", "The roadmap"));
    head.appendChild(el("div", "section__note",
      "Architect Foundations first for the shared vocabulary, Developer Foundations next if you write code, Architect Professional once you have production experience."));
    roadmapSection.appendChild(head);

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
      if (state.quizAnswers[certId + "-" + di + "-" + qi] === q.correct) hit++;
    });
    return total ? Math.round(hit / total * 100) : 0;
  }

  function quizScore(certId, di) {
    var d = cert(certId).domains[di];
    var answered = 0;
    var right = 0;
    d.questions.forEach(function (q, qi) {
      var a = state.quizAnswers[certId + "-" + di + "-" + qi];
      if (a === undefined) return;
      answered++;
      if (a === q.correct) right++;
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
      [
        ["Question type", c.exam.format],
        ["Scoring", c.exam.scoring],
        ["Guessing", c.exam.penalty],
        ["Scenarios", c.exam.scenarios],
        ["Target candidate", c.exam.audience],
        ["Technologies", c.exam.covers.join(" · ")]
      ].forEach(function (row) {
        var f = el("div", "facts__item");
        f.appendChild(el("div", "facts__key", row[0]));
        f.appendChild(el("div", "facts__val", row[1]));
        facts.appendChild(f);
      });
      page.appendChild(facts);
    }

    var head = el("div", "section__head");
    head.appendChild(el("div", "eyebrow", "Five domains"));
    head.appendChild(el("div", "section__note",
      "Weights are the share of the exam, not the share of the reading. Start with D1 — the other four keep referring back to it."));
    page.appendChild(head);

    var list = el("div", "domains");
    c.domains.forEach(function (d, di) {
      var a = el("a", "domain-card");
      a.href = GUIDES[certId] + "/d" + (di + 1);
      var top = el("div", "domain-card__top");
      top.appendChild(el("span", "domain-card__code", d.code + " · " + d.weight + "%"));
      top.appendChild(el("span", "domain-card__meta",
        d.concepts.length + " lessons · " + d.questions.length + " questions"));
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

    if (c.scenarios) {
      var panel = el("div", "panel");
      panel.appendChild(el("div", "panel__head", "The eight exam scenarios — four are drawn at random"));
      var ol = el("ol", "scenarios");
      c.scenarios.forEach(function (t) { ol.appendChild(el("li", null, t)); });
      panel.appendChild(ol);
      page.appendChild(panel);
    }

    page.appendChild(el("div", "footnote",
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

    node.appendChild(el("p", "lesson__body", lesson.body));

    if (lesson.points && lesson.points.length) {
      var ul = el("ul", "lesson__points");
      lesson.points.forEach(function (t) { ul.appendChild(el("li", null, t)); });
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

    if (lesson.exam) {
      var note = el("div", "lesson__exam");
      note.appendChild(el("div", "lesson__exam-head", "On the exam"));
      note.appendChild(el("div", null, lesson.exam));
      node.appendChild(note);
    }

    return node;
  }

  function renderQuestion(certId, di, q, qi) {
    var key = certId + "-" + di + "-" + qi;
    var answer = state.quizAnswers[key];
    var answered = answer !== undefined;

    var node = el("div", "q");
    if (answered) node.classList.add("is-answered");

    var top = el("div", "q__top");
    top.appendChild(el("span", "q__n", "Q" + (qi + 1)));
    top.appendChild(el("span", "q__diff", q.d === "challenging" ? "Challenging" : "Standard"));
    if (answered) {
      top.appendChild(el("span", answer === q.correct ? "q__verdict is-right" : "q__verdict is-wrong",
        answer === q.correct ? "Correct" : "Incorrect"));
    }
    node.appendChild(top);
    node.appendChild(el("p", "q__text", q.text));

    var opts = el("div", "q__opts");
    q.opts.forEach(function (text, oi) {
      var b = el("button", "opt");
      b.type = "button";
      b.appendChild(el("span", "opt__letter", "ABCD".charAt(oi)));
      b.appendChild(el("span", "opt__text", text));
      if (answered) {
        b.disabled = true;
        if (oi === q.correct) b.classList.add("is-right");
        else if (oi === answer) b.classList.add("is-wrong");
      } else {
        b.addEventListener("click", function () {
          var next = Object.assign({}, state.quizAnswers);
          next[key] = oi;
          save({ quizAnswers: next });
          render();
        });
      }
      opts.appendChild(b);
    });
    node.appendChild(opts);

    if (answered) {
      var why = el("div", "q__why");
      why.appendChild(el("span", "q__why-head", "Why " + "ABCD".charAt(q.correct) + ": "));
      why.appendChild(document.createTextNode(q.why));
      node.appendChild(why);
    }

    return node;
  }

  function renderDomain(certId, di) {
    var c = cert(certId);
    var d = c.domains[di];
    var page = el("div", "page page--guide");

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

  /* ---------- router ---------- */

  var ROUTES = { "": "home", "#/": "home", "#/apply": "apply" };

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

    var guide = matchGuide(hash);
    if (guide) return { route: "guide", certId: guide.certId, domainIdx: guide.domainIdx };

    /* Unknown hash: fall back to the introduction and keep the URL honest. */
    window.history.replaceState(null, "", window.location.pathname + "#/");
    return { route: "home" };
  }

  function render() {
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
    } else {
      page = renderIntro();
      title = "Introduction";
    }
    content.textContent = "";
    content.appendChild(page);
    document.title = title + " · Certification Wiki";
  }

  document.getElementById("reset-progress").addEventListener("click", function () {
    save({ quizAnswers: {}, done: {}, steps: {}, scores: {} });
    render();
  });

  window.addEventListener("hashchange", function () {
    render();
    window.scrollTo(0, 0);
  });

  render();
})();
