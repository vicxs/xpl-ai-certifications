// Certification data, transcribed from the Claude Design source
// (project 9eda2a04-784c-4de9-b46d-c9d2151dbd6e, file 'Cert Wiki Flow.dc.html').
// Only the Introduction and Applying & booking pages read this today; the
// domain/concept/question content is here so the remaining sections need no
// data work when they land.

const DATA = {
  order: ["CCAR-F", "CCDV-F", "CCAR-P"],
  certs: {
    "CCAR-F": {
      code: "CCAR-F", name: "Claude Certified Architect — Foundations", short: "Architect",
      blurb: "Agentic architecture, the coding CLI and MCP integration for architects designing production Claude systems. The shared vocabulary everyone on the team should have.",
      items: "60", time: "120 min", fee: "$125", level: "Architect · Foundations",
      biggest: "Agentic architecture (27%)",
      domains: [
        { code: "D1", name: "Agentic Architecture & Orchestration", short: "Agentic architecture", weight: 27,
          summary: "Single vs. multi-agent, orchestrator patterns, handoffs, failure containment.",
          intro: "The heaviest domain. Expect scenarios where you choose between a single agent with tools, an orchestrator with subagents, and a plain prompt chain — then justify it on latency, cost and blast radius.",
          concepts: [
            { title: "When a single agent is enough", body: "One agent plus tools handles most tasks. Reach for multi-agent only when subtasks need genuinely different context or run in parallel." },
            { title: "Orchestrator–worker pattern", body: "An orchestrator decomposes, workers execute with narrow tool scopes, the orchestrator recomposes. Know what each layer may and may not see." },
            { title: "Failure containment", body: "Bound loops and retries, make tool calls idempotent, and stop an agent that cannot make progress rather than letting it burn context." },
            { title: "Human checkpoints", body: "Insert approval steps where actions are irreversible — payments, deletions, outbound messages." }
          ],
          questions: [
            { d: "standard", text: "A workflow summarises 400 documents overnight; each summary is independent. Which architecture fits best?", opts: ["One agent looping over all 400 documents in a single conversation", "Parallel worker agents, one document each, with an orchestrator collecting results", "A multi-agent debate for each document", "A prompt chain with all 400 documents in one context window"], correct: 1, why: "Independent subtasks parallelise cleanly. Fan-out workers with a collecting orchestrator keeps each context small and lets you retry a single failure." },
            { d: "challenging", text: "An agent with delete permissions occasionally removes the wrong records. The cheapest structural fix is to:", opts: ["Raise the model's temperature so it varies its approach", "Add a longer system prompt telling it to be careful", "Require a human approval step before any irreversible tool call", "Retry the task three times and take the majority result"], correct: 2, why: "Irreversible actions need a checkpoint, not better wording. Approval gates are the standard containment answer in this domain." }
          ] },
        { code: "D2", name: "Agentic CLI Configuration & Workflows", short: "CLI & workflows", weight: 20,
          summary: "Project configuration, permissions, custom commands, repeatable team setups.",
          intro: "Tests whether you can set up the coding CLI for a team: what belongs in project configuration, how permissions are scoped, and how repeatable workflows are shared rather than re-typed.",
          concepts: [
            { title: "Project vs. user configuration", body: "Project-level config is committed and shared; user-level config is personal. Team conventions belong in the repo." },
            { title: "Permission scoping", body: "Grant the narrowest tool and path permissions that let the job finish; escalate explicitly rather than globally." },
            { title: "Repeatable commands", body: "Encode recurring work as saved commands so behaviour is consistent across the team." }
          ],
          questions: [
            { d: "standard", text: "Two engineers get different agent behaviour in the same repository. The most likely cause is:", opts: ["Different model versions in the cloud", "Conventions live in personal user config instead of committed project config", "Network latency", "Different terminal emulators"], correct: 1, why: "Shared behaviour requires shared, committed configuration. Personal config drifts per machine." },
            { d: "challenging", text: "Best practice for a task that needs one-off write access outside the project directory:", opts: ["Permanently widen the project's allowed paths", "Disable permission prompts for the session", "Grant the specific path for that task, then revoke it", "Run the agent as an administrator"], correct: 2, why: "Least privilege, granted narrowly and temporarily — the recurring principle across this domain." }
          ] },
        { code: "D3", name: "Prompt Engineering & Structured Output", short: "Prompting & output", weight: 20,
          summary: "System prompt anatomy, XML structure, schemas, prefill, few-shot selection.",
          intro: "Scenario questions on making output reliable enough for a downstream system: where instructions live, how inputs are delimited, and how a schema plus prefill beats polite asking.",
          concepts: [
            { title: "System prompt anatomy", body: "Role, task, constraints, output contract — in that order. Instructions in the system turn, data in the user turn." },
            { title: "XML delimiting", body: "Tags separate instructions from data and make outputs parseable. Name them semantically and keep them consistent." },
            { title: "Schema + prefill", body: "Declare the output schema, then prefill the opening token to remove preamble and lock the shape." },
            { title: "Few-shot selection", body: "Three to five diverse examples, including the edge cases you care about, beat twenty near-duplicates." }
          ],
          questions: [
            { d: "standard", text: "A parser consumes the model's JSON and breaks on a friendly preamble. Most reliable fix?", opts: ["Ask politely for JSON only in the user turn", "Declare the schema in the system prompt and prefill the opening brace", "Raise temperature so the model explores formats", "Post-process with a regular expression"], correct: 1, why: "Schema plus prefill constrains the shape and removes preamble at the source; regex patching treats the symptom." },
            { d: "challenging", text: "A long document is pasted in the user turn and the model starts ignoring the instructions. Best correction?", opts: ["Repeat the instructions after the document as well as in the system turn, with the document XML-tagged", "Shorten the document arbitrarily", "Move everything into the system prompt", "Lower max tokens"], correct: 0, why: "Tag the data and restate the task close to it — instruction position relative to long inputs is a classic tested detail." }
          ] },
        { code: "D4", name: "Tool Design & MCP Integration", short: "Tools & MCP", weight: 18,
          summary: "Tool schemas, descriptions, error returns, MCP servers and transports.",
          intro: "Tests tool ergonomics from the model's point of view: names, descriptions, argument shapes, what an error should return, and where MCP fits versus a bespoke integration.",
          concepts: [
            { title: "Tools are an interface for a model", body: "Clear names, one job per tool, descriptions that state when to use it and when not to." },
            { title: "Error returns", body: "Return a structured, actionable error the model can recover from instead of throwing an opaque failure." },
            { title: "MCP's role", body: "MCP standardises how tools and context are exposed, so one server serves many clients instead of per-app glue." }
          ],
          questions: [
            { d: "standard", text: "A model keeps calling the wrong one of two similar tools. First thing to fix:", opts: ["Merge both tools into one with a mode flag", "Sharpen the descriptions so each states when to use it and when not to", "Remove one tool entirely", "Increase the context window"], correct: 1, why: "Selection is driven by descriptions. Disambiguating them is the cheapest and most effective fix." },
            { d: "challenging", text: "A tool fails because a required argument was missing. It should return:", opts: ["A generic 500 error", "A structured error naming the missing argument and the expected type", "An empty result", "The full stack trace"], correct: 1, why: "Actionable structured errors let the agent self-correct in the next turn; opaque failures cause loops." }
          ] },
        { code: "D5", name: "Context Management & Reliability", short: "Context & reliability", weight: 15,
          summary: "Context budgets, retrieval vs. long context, caching, degradation, evaluation hooks.",
          intro: "How to keep long-running systems stable: what to keep in context, what to retrieve, what to cache, and how to degrade gracefully under rate limits.",
          concepts: [
            { title: "Retrieval vs. long context", body: "Long context is simpler; retrieval wins when the corpus is large, changes often, or cost and latency matter." },
            { title: "Caching", body: "Cache the stable prefix — system prompt, tool definitions, reference material — and keep volatile content last." },
            { title: "Graceful degradation", body: "Back off on rate limits, fall back to a smaller model or cached answer, and surface partial results rather than failing hard." }
          ],
          questions: [
            { d: "standard", text: "A support assistant answers from a 400-page manual updated weekly. Best default?", opts: ["Paste the whole manual into every request", "Retrieve the relevant sections per question", "Fine-tune on the manual monthly", "Summarise the manual once and use only the summary"], correct: 1, why: "Large, frequently changing corpus plus per-request cost is the canonical retrieval case." },
            { d: "challenging", text: "To maximise cache hits across requests you should:", opts: ["Put the user's question first, then the reference material", "Keep the stable system prompt and tool definitions at the start and volatile content at the end", "Randomise the prompt order to spread load", "Disable caching for accuracy"], correct: 1, why: "Caching works on stable prefixes — keep everything variable at the tail." }
          ] }
      ] },
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
