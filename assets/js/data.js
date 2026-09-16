// Certification catalogue. The shell (sidebar, roadmap, applying) was transcribed
// from the Claude Design source (project 9eda2a04-784c-4de9-b46d-c9d2151dbd6e,
// file 'Cert Wiki Flow.dc.html').
//
// CCAR-F's domains live in content-ccar-f.js and CCDV-F's in content-ccdv-f.js,
// both written from the official exam guides — those files must load first.
// CCAR-P still carries the design's placeholder outline; it gets the same
// treatment when its guide lands.

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
      blurb: "Advanced solution design, integration, governance and evaluation for senior architects delivering production systems. Requires the Architect Foundations certification.",
      items: "63", time: "120 min", fee: "$175", level: "Architect · Professional",
      biggest: "Integration (19%)",
      domains: [
        { code: "D1", name: "Integration at Scale", short: "Integration", weight: 19,
          summary: "Enterprise systems, identity, data boundaries, throughput.",
          intro: "Integration questions with real constraints: identity propagation, data residency, throughput ceilings and what you do when a downstream system is the bottleneck.",
          concepts: [
            { title: "Identity propagation", body: "The agent acts on behalf of a user; permissions must be evaluated with that user's identity, not the service account's." },
            { title: "Throughput planning", body: "Design for the slowest downstream dependency and queue rather than dropping work." }
          ],
          questions: [
            { d: "challenging", text: "An agent can read any record because it uses a service account. Correct architecture:", opts: ["Keep the service account and filter results in the prompt", "Evaluate permissions with the requesting user's identity before returning data", "Ask the model not to reveal unauthorised records", "Log access and review it monthly"], correct: 1, why: "Authorisation belongs in the data layer with the real identity — never in prompt instructions." }
          ] },
        { code: "D2", name: "Solution Design", short: "Solution design", weight: 18,
          summary: "Requirements to architecture, trade-off documentation, build vs. buy.",
          intro: "Given a business problem and constraints, choose an architecture and defend the trade-off in writing.",
          concepts: [
            { title: "Constraints first", body: "Latency, cost ceiling, accuracy floor and data boundaries narrow the design space before any pattern is chosen." },
            { title: "Documented trade-offs", body: "Every choice records what was given up; that record is what reviews actually assess." }
          ],
          questions: [
            { d: "standard", text: "A client needs sub-second answers with a hard accuracy floor. Your first move is to:", opts: ["Pick the largest model available", "Quantify both constraints and test whether they can be met simultaneously", "Add a multi-agent debate for accuracy", "Cache everything"], correct: 1, why: "Professional-level questions reward quantifying constraints before selecting a pattern." }
          ] },
        { code: "D3", name: "Governance & Compliance", short: "Governance", weight: 17,
          summary: "Policy, auditability, data handling, human oversight.",
          intro: "What an auditor asks for: what was sent, what came back, who approved it, and how that is retained.",
          concepts: [
            { title: "Auditable by construction", body: "Log inputs, outputs, tool calls and approvals with correlation ids from day one." },
            { title: "Human oversight of record", body: "Name who is accountable for automated decisions and how a decision is appealed." }
          ],
          questions: [
            { d: "challenging", text: "An auditor asks why a specific automated decision was made six months ago. You need:", opts: ["The current system prompt", "Retained per-request logs of inputs, outputs, tool calls and the prompt version in force", "A screenshot of the dashboard", "The model provider's documentation"], correct: 1, why: "Reconstruction requires versioned, per-request records — not the present configuration." }
          ] },
        { code: "D4", name: "Evaluation & Observability", short: "Evaluation", weight: 16,
          summary: "Production evals, drift detection, dashboards that matter.",
          intro: "Measuring a live system: which signals to watch, how to detect drift early, and how to keep an eval set honest over time.",
          concepts: [
            { title: "Online plus offline", body: "Offline evals catch regressions before release; online signals catch drift after it." },
            { title: "Guard the eval set", body: "Keep a holdout that never informs prompt edits, or your scores stop meaning anything." }
          ],
          questions: [
            { d: "standard", text: "Offline scores are flat but user complaints rise. Most likely explanation:", opts: ["The model degraded silently", "Real traffic has drifted away from the eval set's distribution", "Token prices changed", "The dashboard is broken"], correct: 1, why: "Distribution drift is the classic gap between stable offline scores and worsening real-world experience." }
          ] },
        { code: "D5", name: "Multi-agent Orchestration", short: "Orchestration", weight: 16,
          summary: "Coordination, shared state, cost containment, deadlock avoidance.",
          intro: "Advanced orchestration: who owns state, how agents hand off, and how you keep a multi-agent system from costing ten times its value.",
          concepts: [
            { title: "One owner per piece of state", body: "Shared mutable state across agents is the main source of incoherent behaviour." },
            { title: "Cost containment", body: "Budget tokens per run and abort early; multi-agent cost grows multiplicatively." }
          ],
          questions: [
            { d: "challenging", text: "A three-agent pipeline produces contradictory outputs on the same input. Most likely cause:", opts: ["Temperature is too low", "Two agents mutate the same state with no clear owner", "The context window is too large", "Streaming is disabled"], correct: 1, why: "Unowned shared state is the standard root cause of incoherence in orchestration questions." }
          ] },
        { code: "D6", name: "Migration & Operations", short: "Migration & ops", weight: 14,
          summary: "Model upgrades, rollout strategy, incident response, runbooks.",
          intro: "Operating the system over time: how a model upgrade is rolled out, what a rollback looks like, and what the on-call runbook says.",
          concepts: [
            { title: "Shadow then shift", body: "Run the new model in shadow against real traffic, compare on evals, then shift a percentage at a time." },
            { title: "Rollback path", body: "Pin model and prompt versions together so a rollback restores a known-good pair." }
          ],
          questions: [
            { d: "standard", text: "Safest way to adopt a new model version in production:", opts: ["Switch everything at once and watch the dashboard", "Shadow real traffic, compare on the eval set, then ramp by percentage", "Let users opt in manually", "Wait for the next release"], correct: 1, why: "Shadow, compare, ramp — with a pinned rollback pair — is the expected operational answer." }
          ] }
      ] }
  },
  mocks: [
    { id: "A", diff: "Standard" }, { id: "B", diff: "Standard" },
    { id: "C", diff: "Challenging" }, { id: "D", diff: "Challenging" }
  ],
  applySteps: [
    { title: "Confirm you meet the prerequisites", body: "Foundations exams are open to anyone. Architect Professional requires a valid Architect Foundations certification on the same account.", meta: "5 min" },
    { title: "Create your account on the certification platform", body: "Use your work email and make sure the name on the account matches your photo ID exactly — mismatches are the most common cause of a cancelled session.", meta: "10 min" },
    { title: "Request the voucher internally", body: "Open a request with your manager and the L&D channel. Include the exam code and your target window; vouchers take a few working days.", meta: "2–5 working days" },
    { title: "Book the slot and run the system check", body: "Book at least a week out, then run the proctor's system check on the machine and network you will actually use.", meta: "15 min" },
    { title: "Sit the exam and log the result", body: "You get your result on screen. Record it in the team tracker either way, and add your retake date if you need one.", meta: "120 min" }
  ]
};

window.DATA = DATA;
