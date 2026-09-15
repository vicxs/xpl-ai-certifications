/* Cert Wiki — hash-routed static port of the Claude Design source
   'Cert Wiki Flow.dc.html'. Two routes are live in this release; the rest of
   the navigation is shown with the "soon" treatment. */

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
      var item = el("div", "nav__item");
      item.appendChild(el("span", null, id + " · " + cert(id).short));
      certs.appendChild(markSoon(item));
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

    /* "Continue where I left off" needs the study guides, so until they ship the
       working route carries the primary weight and the disabled one is muted. */
    var actions = el("div", "hero__actions");
    var apply = el("a", "btn btn--primary", "How to apply →");
    apply.href = "#/apply";
    actions.appendChild(apply);
    var cont = el("button", "btn btn--ghost", "Continue where I left off");
    cont.type = "button";
    actions.appendChild(markSoon(cont));
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

      var foot = el("div", "card__foot");
      foot.appendChild(el("span", null, "Study guide"));
      card.appendChild(markSoon(foot));

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

  /* ---------- router ---------- */

  var ROUTES = { "": "home", "#/": "home", "#/apply": "apply" };

  function currentRoute() {
    var hash = window.location.hash;
    if (hash && !(hash in ROUTES)) {
      /* Unknown hash: fall back to the introduction and keep the URL honest. */
      window.history.replaceState(null, "", window.location.pathname + "#/");
      return "home";
    }
    return ROUTES[hash] || "home";
  }

  function render() {
    state.route = currentRoute();
    renderSidebar();
    var content = document.getElementById("content");
    content.textContent = "";
    content.appendChild(state.route === "apply" ? renderApply() : renderIntro());
    document.title = (state.route === "apply" ? "Applying & booking" : "Introduction") + " · Certification Wiki";
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
