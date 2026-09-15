// Certification catalogue. The shell (sidebar, roadmap, applying) was transcribed
// from the Claude Design source (project 9eda2a04-784c-4de9-b46d-c9d2151dbd6e,
// file 'Cert Wiki Flow.dc.html').
//
// CCAR-F's domains live in content-ccar-f.js, written from the official exam
// guide — that file must load first. CCDV-F and CCAR-P still carry the design's
// placeholder outlines; they get the same treatment when their guides land.

const DATA = {
  order: ["CCAR-F", "CCDV-F", "CCAR-P"],
  certs: {
    "CCAR-F": {
      code: "CCAR-F", name: "Claude Certified Architect — Foundations", short: "Architect",
      blurb: "Agentic architecture, Claude Code and MCP integration for architects designing production Claude systems. The shared vocabulary everyone on the team should have.",
      items: "60", time: "120 min", fee: "$125", level: "Architect · Foundations",
      biggest: "Agent architecture (27%)",
      /* From the official exam guide. Shown on the study-guide page. */
      exam: {
        format: "Multiple choice, one correct answer of four",
        scoring: "100–1000 scale, pass at 720",
        penalty: "No guessing penalty — answer every question",
        scenarios: "4 of 8 possible scenarios, randomly selected",
        audience: "Solution architects with ~6 months of hands-on Claude experience",
        covers: ["Claude Agent SDK", "Claude Code", "Model Context Protocol", "Claude API"]
      },
      /* The eight scenarios the exam draws from. */
      scenarios: [
        "Customer support agent — returns, billing disputes and account issues over MCP tools, targeting 80%+ first-contact resolution with appropriate escalation.",
        "Code generation with Claude Code — generation, refactoring, debugging and documentation, with custom slash commands, CLAUDE.md and planning mode.",
        "Multi-agent research system — a coordinator delegating to web research, document analysis, synthesis and report-writing subagents, producing cited reports.",
        "Developer productivity tools — exploring unfamiliar codebases and automating routine work with built-in tools and MCP servers.",
        "Claude Code for continuous integration — automated review, test generation and pull request feedback, with prompts tuned to minimise false positives.",
        "Structured data extraction — pulling information out of unstructured documents, validated against JSON schemas, with edge cases handled correctly.",
        "Conversational AI architecture patterns — context window management, instruction persistence across turns, memory, safe tool design and ambiguous input.",
        "Agentic AI tools — reported by candidates but not yet documented in the public study guide."
      ],
      domains: window.CCARF_DOMAINS
    },
    "CCDV-F": {
      code: "CCDV-F", name: "Claude Certified Developer — Foundations", short: "Developer",
      blurb: "API and SDK integration, tool design and coding-CLI workflows for engineers shipping Claude-powered applications.",
      items: "53", time: "120 min", fee: "$125", level: "Developer · Foundations",
      biggest: "Applications & integration (33%)",
      domains: [
        { code: "D1", name: "Applications & Integration", short: "Applications", weight: 33,
          summary: "End-to-end integration: streaming, state, errors, latency, cost control.",
          intro: "The dominant domain. Scenario questions about wiring Claude into a real application: request shape, streaming, retries, idempotency, and where cost actually goes.",
          concepts: [
            { title: "Messages, not prompts", body: "Conversations are ordered turns. Server state is yours to manage — resend the history you need." },
            { title: "Streaming and perceived latency", body: "Stream to the user for long answers; buffer when a downstream parser needs the whole payload." },
            { title: "Retries and idempotency", body: "Retry with backoff on transient errors and make side-effecting tool calls idempotent so a retry is safe." },
            { title: "Where cost goes", body: "Input tokens usually dominate. Trim history, cache stable prefixes, and pick the smallest model that passes your evals." }
          ],
          questions: [
            { d: "standard", text: "A chat feature feels slow although total generation time is fine. Best first change?", opts: ["Switch to a larger model", "Stream the response so text appears as it is produced", "Increase max tokens", "Cache the answer after the fact"], correct: 1, why: "Perceived latency is a delivery problem: stream so time-to-first-token drops." },
            { d: "challenging", text: "A retried request causes a duplicate refund. The correct fix is:", opts: ["Stop retrying altogether", "Give the refund tool an idempotency key so repeats are no-ops", "Lower the temperature", "Move the retry to the client"], correct: 1, why: "Retries are necessary; safety comes from idempotent side effects." }
          ] },
        { code: "D2", name: "API & SDK Fundamentals", short: "API & SDK", weight: 22,
          summary: "Request shape, parameters, token accounting, rate limits, error codes.",
          intro: "The mechanical domain: what each parameter does, how tokens are counted and billed, which errors are retryable, and how rate limits present themselves.",
          concepts: [
            { title: "Parameters that matter", body: "Temperature for variance, stop sequences for boundaries, max tokens as a ceiling — not a target." },
            { title: "Token accounting", body: "Input and output tokens are billed separately; system prompts and tool definitions count every request." },
            { title: "Error taxonomy", body: "Distinguish client mistakes from rate limits and transient server errors — only the latter two deserve retries." }
          ],
          questions: [
            { d: "standard", text: "Which error should be retried with exponential backoff?", opts: ["Malformed request body", "Rate limit exceeded", "Invalid API key", "Unsupported parameter"], correct: 1, why: "Rate limits and transient server errors are retryable; client errors repeat identically." },
            { d: "challenging", text: "Output is being cut mid-sentence. Most likely cause:", opts: ["Temperature too low", "The max tokens ceiling is too small for the requested answer", "Missing system prompt", "Streaming enabled"], correct: 1, why: "Truncation points at the output ceiling — check the stop reason before anything else." }
          ] },
        { code: "D3", name: "Tool Use & Agent SDK", short: "Tools & agents", weight: 18,
          summary: "Tool schemas, the tool-use loop, agent loops, guardrails.",
          intro: "The tool-use loop end to end: definition, model request, your execution, result back in, and where to put the guardrails.",
          concepts: [
            { title: "The tool loop", body: "The model requests a call, your code executes it, the result returns as a tool result turn. Your code is always the executor." },
            { title: "Schemas are documentation", body: "Types, enums and required fields prevent malformed calls before validation has to." },
            { title: "Loop guardrails", body: "Cap iterations, detect no-progress states, and log every call for debugging." }
          ],
          questions: [
            { d: "standard", text: "In the tool-use loop, who executes the tool?", opts: ["The model, in a sandbox", "Your application code", "The SDK, automatically and invisibly", "The proctoring service"], correct: 1, why: "The model only requests; execution and its side effects are always yours." },
            { d: "challenging", text: "An agent repeats the same failing search forever. Best structural guardrail:", opts: ["Longer system prompt warning about loops", "Iteration cap plus no-progress detection that stops the run", "Higher temperature to vary the query", "Larger context window"], correct: 1, why: "Loop control is structural, not rhetorical." }
          ] },
        { code: "D4", name: "Prompt & Output Contracts", short: "Output contracts", weight: 15,
          summary: "Structured output, validation, versioning prompts alongside code.",
          intro: "Keeping model output safe to consume: schemas, validation at the boundary, and treating prompts as versioned artefacts.",
          concepts: [
            { title: "Validate at the boundary", body: "Parse and validate before anything downstream sees the output; reject and repair rather than trusting it." },
            { title: "Prompts are code", body: "Version them, review them, and test them — a prompt change is a deploy." },
            { title: "Repair loops", body: "On a schema violation, return the validation error to the model for one bounded repair attempt." }
          ],
          questions: [
            { d: "standard", text: "Schema validation fails on a response. The best next step is:", opts: ["Write the record anyway and log a warning", "Return the validation error to the model for one bounded repair attempt", "Retry the identical request indefinitely", "Disable validation for that field"], correct: 1, why: "A single bounded repair with the concrete error is the standard recovery." },
            { d: "challenging", text: "Output quality drops after a deploy that touched no model code. Most likely cause:", opts: ["The model changed on its own", "An unversioned prompt edit shipped with the deploy", "Token prices changed", "Rate limits tightened"], correct: 1, why: "Unversioned prompts are the usual culprit — hence prompts-as-code." }
          ] },
        { code: "D5", name: "Testing, Cost & Limits", short: "Testing & cost", weight: 12,
          summary: "Eval sets, regression testing, cost modelling, safe limits.",
          intro: "How you know a change is an improvement: small honest eval sets, regression runs on every prompt change, and a cost model you can defend.",
          concepts: [
            { title: "Small honest eval sets", body: "Twenty representative cases with known answers beat a thousand unlabelled ones." },
            { title: "Regression on prompt change", body: "Re-run the eval set on every prompt or model change; store scores over time." },
            { title: "Cost modelling", body: "Model cost per request from real token counts, then multiply by expected volume — not by vibes." }
          ],
          questions: [
            { d: "standard", text: "You changed a system prompt and accuracy feels better. Before shipping you should:", opts: ["Ship it — the change is qualitative", "Re-run the eval set and compare scores against the previous version", "Double the temperature to confirm robustness", "Ask the model to grade itself without a reference"], correct: 1, why: "Regression against a fixed set is the only way to distinguish improvement from impression." },
            { d: "challenging", text: "Cost per request is drifting upward with no code change. Most likely cause:", opts: ["The model got slower", "Conversation history is growing and is resent every turn", "Streaming is enabled", "Stop sequences are too short"], correct: 1, why: "Input tokens dominate; unbounded history growth is the usual cause of drift." }
          ] }
      ] },
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
