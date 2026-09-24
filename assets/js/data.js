// Certification catalogue. The shell (sidebar, roadmap, applying) was transcribed
// from the Claude Design source (project 9eda2a04-784c-4de9-b46d-c9d2151dbd6e,
// file 'Cert Wiki Flow.dc.html').
//
// Each certification's domains live in its own content-<code>.js, written from
// the official exam guides — those files must load first.

const DATA = {
  order: ["CCAR-F", "CCDV-F", "CCAR-P"],
  certs: {
    "CCAR-F": {
      code: "CCAR-F", name: "Claude Certified Architect — Foundations", short: "Architect",
      blurb: "Agentic architecture, Claude Code and MCP integration for architects designing production Claude systems. The shared vocabulary everyone on the team should have.",
      items: "60", time: "120 min", fee: "$125", level: "Architect · Foundations",
      biggest: "Agent architecture (27%)",
      domainsNote: "Weights are the share of the exam, not the share of the reading. Start with D1 — the other four keep referring back to it.",
      /* From the official exam guide. Shown on the study-guide page. */
      exam: [
        { k: "Question type", v: "Multiple choice, one correct answer of four" },
        { k: "Scoring", v: "100–1000 scale, pass at 720" },
        { k: "Guessing", v: "No guessing penalty — answer every question" },
        { k: "Scenarios", v: "4 of 8 possible scenarios, randomly selected" },
        { k: "Target candidate", v: "Solution architects with ~6 months of hands-on Claude experience" },
        { k: "Technologies", v: "Claude Agent SDK · Claude Code · Model Context Protocol · Claude API" }
      ],
      /* The eight scenarios the exam draws from. */
      panels: [
        { head: "The eight exam scenarios — four are drawn at random", ordered: true, items: [
          "Customer support agent — returns, billing disputes and account issues over MCP tools, targeting 80%+ first-contact resolution with appropriate escalation.",
          "Code generation with Claude Code — generation, refactoring, debugging and documentation, with custom slash commands, CLAUDE.md and planning mode.",
          "Multi-agent research system — a coordinator delegating to web research, document analysis, synthesis and report-writing subagents, producing cited reports.",
          "Developer productivity tools — exploring unfamiliar codebases and automating routine work with built-in tools and MCP servers.",
          "Claude Code for continuous integration — automated review, test generation and pull request feedback, with prompts tuned to minimise false positives.",
          "Structured data extraction — pulling information out of unstructured documents, validated against JSON schemas, with edge cases handled correctly.",
          "Conversational AI architecture patterns — context window management, instruction persistence across turns, memory, safe tool design and ambiguous input.",
          "Agentic AI tools — reported by candidates but not yet documented in the public study guide."
        ] }
      ],
      domains: window.CCARF_DOMAINS
    },
    "CCDV-F": {
      code: "CCDV-F", name: "Claude Certified Developer — Foundations", short: "Developer",
      blurb: "API and SDK integration, agent construction, tool and MCP design, and the model and cost decisions behind an application that ships. Written for engineers building with Claude rather than specifying it.",
      items: "53", time: "120 min", fee: "$125", level: "Developer · Foundations",
      biggest: "Applications & integration (33.1%)",
      domainsNote: "Eight domains, weighted to one decimal in the official guide. D2, D5 and D1 are two thirds of the paper between them — give them two thirds of the reading.",
      /* From the CCDV-F exam guide v1.0 and the certification page. */
      exam: [
        { k: "Question type", v: "Multiple choice and multiple response — each item says how many options to select" },
        { k: "Length", v: "53 scored questions in 120 minutes, about two minutes an item" },
        { k: "Scoring", v: "100–1000 scale, pass at 720; criterion-referenced, so you clear a fixed standard rather than a curve" },
        { k: "Score report", v: "Pass or fail, the scaled score, and your percentage per domain — the last is informational" },
        { k: "Target candidate", v: "1–5 years of software engineering and at least 6 months building with Claude or another LLM" },
        { k: "Technologies", v: "Claude API · Claude Agent SDK · Claude Code · Model Context Protocol" }
      ],
      panels: [
        { head: "How the questions work", items: [
          "Scenarios, not recall: a team needs something, and four approaches are offered. You are asked for the <b>best</b> one, not for one that would work.",
          "Multiple-response items state the count (\"Select TWO\"). Partial credit is not on offer — every option has to match.",
          "No essays, no labs, nothing to run. Code appears only as something to read.",
          "Many wrong options are defensible in isolation; what rules them out is the constraint the scenario put first.",
          "Criterion-referenced: you pass by clearing a fixed standard, not by beating other candidates."
        ] },
        { head: "Reading a scenario question", ordered: true, items: [
          "Find the dominant constraint — cost, latency, security, reuse or determinism. The right option optimises for that one.",
          "Rule out options that put a prompt instruction where a programmatic control belongs. Money, security and destructive actions need hooks, gates or permissions.",
          "Rule out options that \"fix\" the problem by changing model or temperature without touching the cause.",
          "If Claude is choosing the wrong tool, the first move is almost always better tool descriptions — not merging tools or adding a router.",
          "Map the sharing scope to the mechanism: reusable across apps and separately maintained is an MCP server; only your machine is <code>~/.claude/</code>; the whole team is <code><project>/.claude/</code> in version control."
        ] },
        { head: "Registration, retakes and renewal", items: [
          "Register through the Anthropic Partner Academy (it needs an email from a Claude Partner Network organisation), check out, create a Pearson VUE account, then pick a date and a mode: online proctored or a test centre.",
          "Cancel or reschedule up to 24 hours before; inside that window the fee is forfeited. 125 USD an attempt, with partner-tier discounts.",
          "Government photo ID, with the name matching the registration exactly. You sign an NDA at the start and cannot share exam content.",
          "Retakes: 14 days after a first fail, 30 after a second, 90 after a third. At most four attempts in 12 months, each paid.",
          "The credential is valid for 12 months. Renew on time with a free, non-proctored assessment in the Partner Academy; if it lapses you sit the full exam again."
        ] },
        { head: "Where to put your hours", items: [
          "Domains 2, 5 and 1 are almost two thirds of the exam. Domains 3 and 4 are two or three questions you get for free if you have used Claude Code and debugged a real integration.",
          "Build at least one small application that calls the API, uses a tool and runs a hook. Most scenario questions get easier once you have felt the failure modes yourself."
        ] }
      ],
      footnote: "Written from the CCDV-F exam guide v1.0, the certification page and the platform, Claude Code and MCP documentation. Questions here are original: the real bank is under NDA, and prices used in cost questions are illustrative. Confirm the current fee, item count and duration with the certifying organisation before you book.",
      domains: window.CCDVF_DOMAINS
    },
    "CCAR-P": {
      code: "CCAR-P", name: "Claude Certified Architect — Professional", short: "Architect Pro",
      blurb: "Advanced solution design, integration, governance, evaluation and stakeholder work for senior architects delivering production Claude systems. The credential describes an architect who has operated a system, not one who has drawn one.",
      items: "63", time: "120 min", fee: "$175", level: "Architect · Professional",
      biggest: "Integration (19%)",
      domainsNote: "Seven domains, weights straight from the blueprint. Integration is the largest — bigger than solution design — and governance, stakeholder work and enablement are 35% between them, which is where an engineering background usually has its gap.",
      /* From the CCAR-P exam guide and the certification pages. */
      exam: [
        { k: "Question type", v: "Multiple choice, multiple response and classification — standalone items, each saying how many options to select, or giving a box per statement" },
        { k: "Length", v: "63 scored items in 120 minutes, a shade under two minutes each; allow about 135 minutes of seat time" },
        { k: "Scoring", v: "100–1000 scale, pass at 720; criterion-referenced, so you clear a fixed standard rather than a curve. Domain percentages appear on the report but do not decide the result" },
        { k: "Eligibility", v: "Claude Partner Network members, registering with a partner email on a recognised company domain. No certification prerequisite — Foundations is recommended, not required" },
        { k: "Target candidate", v: "3+ years in systems architecture or platform engineering, and 6+ months with Claude or a comparable LLM system in production" },
        { k: "Technologies", v: "Claude API · Claude Agent SDK · Claude Code · Model Context Protocol · retrieval and evaluation tooling" }
      ],
      panels: [
        { head: "How the questions behave", items: [
          "Standalone items, not linked scenarios: each question stands alone, so you never lose several marks to one misread situation.",
          "Most items open with two or three sentences of context — an industry, a constraint, a symptom. <b>Read for the constraint, not the technology</b>: it usually eliminates two options on its own.",
          "Multiple-response items state how many to select. Treat \"select two\" as one compound answer and check the pair is internally consistent — one option enforcing a control in code and another enforcing the same control in the prompt cannot both be right.",
          "Classification items give a criterion and about five statements, each placed in its own box: True or False, pre-processing or post-processing, which chunking strategy a description matches. They score as one compound answer too — <b>every statement has to be right</b> — so place the obvious ones first and spend what is left on the one you are unsure of.",
          "Nearly every item comes down to one of three judgements: is this the simplest thing that meets the requirement, is this control where it can actually be enforced, and was anything measured before it was changed."
        ] },
        { head: "Eliminating distractors", ordered: true, items: [
          "<b>Simplest sufficient wins.</b> Between a workflow and an agent, a single call and a chain, one model and an ensemble — take the simpler one unless the scenario names a constraint it cannot meet.",
          "<b>Enforcement beats instruction.</b> Where the requirement is a guarantee, the answer is a mechanism: a validator, a permission filter, a hard limit, a gate. Never prompt wording.",
          "<b>Measure before you change.</b> When a scenario describes a problem, the right first step is usually diagnostic — inspect the retrieved chunks, read the traces, run the eval set — not a fix applied blind.",
          "<b>Absolutes are usually wrong.</b> Options containing \"eliminates\", \"guarantees\", \"never\" or \"always\" rarely survive, because this field does not offer those.",
          "On pacing: about 114 seconds an item. Answer decisively and flag rather than deliberate — two questions you never reached cost more than one you answered on instinct."
        ] },
        { head: "Booking, retakes and renewal", items: [
          "Register through the Partner Academy with a partner email, then schedule through Pearson VUE: online proctored or a test centre. Registration stays valid for five years once purchased, so you can book when you are ready.",
          "$175 USD an attempt. Free to reschedule up to 24 hours before; inside that window the fee is forfeited.",
          "Government photo ID at check-in, with the name matching your Pearson profile exactly — submit corrections at least 24 hours ahead.",
          "Retakes: 14 days after a first failure, 30 after a second, 90 after a third, up to four attempts per rolling 12 months, full fee each time.",
          "Score on screen at the end, badge by email. The credential is valid for 12 months and renews with a free, non-proctored assessment; let it lapse and the full paid exam is required again."
        ] },
        { head: "Where to put your hours", items: [
          "Integration (19%) and solution design (17%) are a third of the paper, but governance, stakeholder work and enablement are 35% between them and are the cheapest marks to gain, because the material is learnable rather than experiential.",
          "Prompting is only 13%. It is the most familiar topic and the one candidates over-prepare; spend that time on domains 5 and 6 instead.",
          "Build and operate one end-to-end solution with retrieval, evaluation and observability. The objectives are written in the language of someone who has run a system, and reading alone tends not to get people over the line."
        ] }
      ],
      footnote: "Written from the CCAR-P exam guide, the certification pages and the Claude platform, Claude Code and MCP documentation. Questions here are original: the real bank is under NDA, and prices used in cost questions are illustrative. Policies change — confirm the current fee, item count, eligibility and duration with the certifying organisation before you book.",
      domains: window.CCARP_DOMAINS
    }
  },
  applySteps: [
    { title: "Confirm you meet the prerequisites", body: "No exam has another certification as a prerequisite — Architect Professional recommends Foundations without requiring it. All three do require a Claude Partner Network membership and a partner email on a recognised company domain; personal addresses are rejected.", meta: "5 min" },
    { title: "Create your account on the certification platform", body: "Use your work email and make sure the name on the account matches your photo ID exactly — mismatches are the most common cause of a cancelled session.", meta: "10 min" },
    { title: "Request the voucher internally", body: "Open a request with your manager and the L&D channel. Include the exam code and your target window; vouchers take a few working days.", meta: "2–5 working days" },
    { title: "Book the slot and run the system check", body: "Book at least a week out, then run the proctor's system check on the machine and network you will actually use.", meta: "15 min" },
    { title: "Sit the exam and log the result", body: "You get your result on screen. Record it in the team tracker either way, and add your retake date if you need one.", meta: "120 min" }
  ]
};

/* The long-form "Go deeper" explanation of each lesson lives in its own
   deep-<code>.js, keyed by lesson ref, so the lesson files stay scannable (and
   CCAR-P's, which is generated, stays untouched). Attach each one to its lesson. */
[["CCAR-F", window.CCARF_DEEP], ["CCDV-F", window.CCDVF_DEEP], ["CCAR-P", window.CCARP_DEEP]]
  .forEach(function (pair) {
    var deep = pair[1];
    if (!deep) return;
    DATA.certs[pair[0]].domains.forEach(function (d) {
      d.concepts.forEach(function (lesson) {
        if (deep[lesson.ref]) lesson.more = deep[lesson.ref];
      });
    });
  });

window.DATA = DATA;
