/* CCDV-F — question bank and mock exams.

   106 items: the two full-length papers of the CCDV-F study guide 1.1 source,
   each 53 questions laid out at the official domain weights — the same shape as
   the real paper (53 scored items, 120 minutes, pass at 720 of 1000).

     window.CCDVF_BANK   { id, dom, diff, text, opts[4], correct, why }
     window.CCDVF_MOCKS  { id, label, diff, minutes, blurb, ids[53] }

   'correct' is an option index, or an array of them for a multiple-response
   item. 'dom' indexes window.CCDVF_DOMAINS.

   The standard and the challenge paper partition the bank: every item appears in
   exactly one of the two, so the pair can be sat back to back without repetition.
   Within a paper the order is shuffled once, at build time, so that a run never
   walks through the syllabus domain by domain.

   Items per domain, of 53: D1 8, D2 17/18, D3 2, D4 1, D5 9, D6 6, D7 4, D8 6/5 (standard/challenge where they differ).

   Loaded before app.js. */

window.CCDVF_BANK = [

  { id: "dv1s01", dom: 0, diff: "standard",
    text: "A support automation must: (1) classify the ticket, (2) if billing, look up the account, (3) draft a reply, (4) have a human approve before sending. The team wants the lowest cost and easiest debugging. Which architecture is most appropriate?",
    opts: [
      "A single autonomous agent with all tools and a long system prompt",
      "A routing workflow: a Haiku classification step, then a fixed chain per category, with a human approval gate before the send step",
      "A manager agent that spawns a subagent per ticket and lets each decide when to send",
      "An evaluator-optimizer loop with no human step"
    ],
    correct: 1,
    why: "Known steps, a need for auditability and low cost: a workflow (routing plus chaining) with a programmatic human gate. Autonomy adds nothing here and complicates debugging." },

  { id: "dv1s02", dom: 0, diff: "standard",
    text: "Which scenario genuinely justifies an agent rather than a workflow?",
    opts: [
      "Translating product descriptions into 5 languages",
      "Investigating an open-ended production incident where the number and order of diagnostic steps depends on what each step reveals",
      "Converting CSV rows to JSON",
      "Summarizing a fixed set of ten documents"
    ],
    correct: 1,
    why: "An agent is justified when the steps are unpredictable and depend on intermediate results. The other tasks have fixed paths." },

  { id: "dv1s03", dom: 0, diff: "standard",
    text: "In a manager/supervisor hierarchy, what is the primary benefit of delegating research subtasks to subagents?",
    opts: [
      "Subagents automatically share the manager's full memory",
      "Each subagent works in an isolated context and returns a condensed result, keeping the manager's context small and enabling parallelism",
      "Subagents are billed at a discount",
      "Subagents remove the need for tool descriptions"
    ],
    correct: 1,
    why: "Context isolation, parallelism and a condensed result for the coordinator. There is no discount and no automatic memory inheritance." },

  { id: "dv1s04", dom: 0, diff: "standard",
    text: "Which two options are valid ways to give an Agent SDK agent a deterministic guardrail? (Select TWO)",
    opts: [
      "Configure a PreToolUse hook that inspects Bash commands and blocks dangerous ones",
      "Restrict allowedTools to the minimum set the task needs",
      "Write \"be careful\" in the prompt",
      "Increase maxTurns"
    ],
    correct: [0,1],
    why: "Hooks and a tool allowlist are deterministic controls. Advice in the prompt is not; maxTurns bounds duration, not actions." },

  { id: "dv1s05", dom: 0, diff: "standard",
    text: "When writing a custom agent loop with the Messages API, which sequence is correct after the model returns stop_reason \"tool_use\"?",
    opts: [
      "Discard the assistant message and send the user's next question",
      "Execute the tool, append the assistant message (with the tool_use block) and a user message containing a tool_result with the matching tool_use_id, then call the API again",
      "Send only the tool result as a system message",
      "Stop the loop; tool_use means the conversation ended"
    ],
    correct: 1,
    why: "The history must contain the assistant turn with the tool_use block and then a user turn with the tool_result (same id). Then repeat until end_turn." },

  { id: "dv1s06", dom: 0, diff: "standard",
    text: "Which framework emphasizes typed, validated agent outputs and dependency injection using Pydantic models?",
    opts: [
      "LangGraph",
      "Strands Agents",
      "PydanticAI",
      "Claude Code"
    ],
    correct: 2,
    why: "PydanticAI is distinguished by typed validation with Pydantic. LangGraph is state graphs; Strands is AWS's model-driven framework." },

  { id: "dv1s07", dom: 0, diff: "standard",
    text: "An agent has been running a refactoring task for 3 hours and keeps re-reading the same files. Which pattern most directly addresses this?",
    opts: [
      "Enable fast mode",
      "Add a memory/notes file where the agent records progress and decisions, and compact the context periodically",
      "Switch from Haiku to Opus mid-task",
      "Disable tool use"
    ],
    correct: 1,
    why: "External memory plus compaction are the context-management patterns for long tasks. Fast mode and changing models do not fix lost state." },

  { id: "dv1s08", dom: 0, diff: "standard",
    text: "Anthropic's guidance on agentic frameworks recommends that developers should…",
    opts: [
      "always start with a framework to avoid writing loops",
      "start with direct API calls and add abstraction only when it clearly helps, because layers can hide prompts and complicate debugging",
      "never use frameworks in production",
      "use exactly one framework per programming language"
    ],
    correct: 1,
    why: "\"Building Effective Agents\": start simple, understand what the framework does underneath, add abstraction only when it earns its place." },

  { id: "dv2s01", dom: 1, diff: "standard",
    text: "Which field is required in every Messages API request?",
    opts: [
      "temperature",
      "max_tokens",
      "system",
      "tools"
    ],
    correct: 1,
    why: "model, max_tokens and messages are required; system, temperature and tools are optional." },

  { id: "dv2s02", dom: 1, diff: "standard",
    text: "A request returns stop_reason \"pause_turn\". What happened and what should the client do?",
    opts: [
      "The user paused the chat; wait for input",
      "A long-running server-side tool turn was paused; send the conversation back as-is to let the model continue",
      "The API key expired",
      "Prompt caching timed out"
    ],
    correct: 1,
    why: "pause_turn appears with server-side tools in long turns; the client resends the conversation so the model can continue." },

  { id: "dv2s03", dom: 1, diff: "standard",
    text: "Which two statements about the Message Batches API are correct? (Select TWO)",
    opts: [
      "Results are guaranteed within 24 hours, and most batches finish much sooner",
      "Batch requests cost 50% less than the equivalent synchronous requests",
      "Batches return results in real time via streaming",
      "Each batch is limited to 100 requests"
    ],
    correct: [0,1],
    why: "Asynchronous, up to 100,000 requests or 256 MB per batch, 50% discount, 24-hour window. No real-time streaming." },

  { id: "dv2s04", dom: 1, diff: "standard",
    text: "Where in the request order can cacheable prefixes be defined, from first to last?",
    opts: [
      "messages → system → tools",
      "tools → system → messages",
      "system → messages → tools",
      "Any order, cached independently"
    ],
    correct: 1,
    why: "The prefix is evaluated in the order tools, system, messages; a change anywhere earlier invalidates everything after it." },

  { id: "dv2s05", dom: 1, diff: "standard",
    text: "Your system prompt is 600 tokens and you add cache_control to it, but usage shows no cache_read tokens across repeated calls. What is the most likely reason?",
    opts: [
      "The prefix is below the minimum cacheable length for the model",
      "cache_control only works on images",
      "The API version header is missing",
      "You must also enable the Batch API"
    ],
    correct: 0,
    why: "There is a minimum cacheable length (around 1024 tokens on Sonnet and Opus, higher on Haiku); shorter prefixes are not cached." },

  { id: "dv2s06", dom: 1, diff: "standard",
    text: "Which HTTP status indicates the request exceeded the maximum allowed size?",
    opts: [
      "400",
      "413",
      "429",
      "529"
    ],
    correct: 1,
    why: "413 request_too_large. 400 is an invalid request, 429 a rate limit, 529 overload." },

  { id: "dv2s07", dom: 1, diff: "standard",
    text: "Which retry policy is correct for the Anthropic API?",
    opts: [
      "Retry 400 errors with backoff",
      "Retry 429, 500 and 529 with exponential backoff and jitter; do not retry 400/401/403",
      "Retry 401 by regenerating the API key automatically",
      "Never retry anything"
    ],
    correct: 1,
    why: "Only transient errors are retried. Validation and authentication 4xx errors require fixing the request or the credentials." },

  { id: "dv2s08", dom: 1, diff: "standard",
    text: "How should a PDF be provided to Claude for analysis in a single request?",
    opts: [
      "As a document content block (base64 or via the Files API file_id) in the user message",
      "Only by pasting extracted text; PDFs are not supported",
      "As a system prompt attachment",
      "Through the model field"
    ],
    correct: 0,
    why: "PDFs go in document blocks (base64, URL or a Files API file_id); images in image blocks." },

  { id: "dv2s09", dom: 1, diff: "standard",
    text: "Extended thinking is enabled with budget_tokens: 8000. How are thinking tokens billed?",
    opts: [
      "They are free",
      "As output tokens",
      "As input tokens",
      "Only when the response is streamed"
    ],
    correct: 1,
    why: "Thinking tokens count as output, the most expensive kind, which is why the budget and effort matter for cost." },

  { id: "dv2s10", dom: 1, diff: "standard",
    text: "A single-page web app needs live token-by-token responses and the ability to send user events mid-stream. Which architecture is sound?",
    opts: [
      "Call the Anthropic API directly from the browser with the API key in JavaScript",
      "A backend service calls the Messages API with streaming and relays events to the browser over WebSockets (or SSE), keeping the key server-side",
      "Use the Batch API from the browser",
      "Poll the API every second"
    ],
    correct: 1,
    why: "The key never goes to the client; the backend streams and relays. WebSockets fit when the client also sends events." },

  { id: "dv2s11", dom: 1, diff: "standard",
    text: "Which practice belongs to good SDLC integration for a Claude application?",
    opts: [
      "Editing production prompts directly in the console without version control",
      "Storing prompts, tool schemas and CLAUDE.md in git, reviewing changes in PRs, and running evals in CI before deployment",
      "Keeping the API key in the repository for convenience",
      "Disabling tests because model output is non-deterministic"
    ],
    correct: 1,
    why: "Prompts and schemas are code: versioned, reviewed, with evals as regression tests." },

  { id: "dv2s12", dom: 1, diff: "standard",
    text: "Which content-boundary practice most reduces the chance that instructions hidden in a retrieved document are followed?",
    opts: [
      "Concatenate the document into the system prompt",
      "Place the document in the user turn inside clearly labeled tags (e.g., <document>) and state that its content is data to be analyzed, not instructions",
      "Lowercase the document",
      "Increase max_tokens"
    ],
    correct: 1,
    why: "Separating instructions from data with explicit delimiters and roles is the foundation of injection defence and of clear app design." },

  { id: "dv2s13", dom: 1, diff: "standard",
    text: "A user's earlier request in a long Claude Code session produced tool results that are now stale after a git pull. What is the best session hygiene move?",
    opts: [
      "Keep the same session and hope Claude notices",
      "Start a fresh session (or /clear) and inject a short summary of the relevant state",
      "Increase the context window",
      "Disable hooks"
    ],
    correct: 1,
    why: "When tool results are stale, a clean context with a summary is more reliable than dragging contradictory information along." },

  { id: "dv2s14", dom: 1, diff: "standard",
    text: "Which file is the right place for a developer's personal, machine-specific instructions for one project that must not be committed?",
    opts: [
      "<repo>/CLAUDE.md",
      "<repo>/CLAUDE.local.md",
      "~/.claude/settings.json",
      "<repo>/.mcp.json"
    ],
    correct: 1,
    why: "CLAUDE.local.md is personal per project and ignored by git. The repo's CLAUDE.md belongs to the team." },

  { id: "dv2s15", dom: 1, diff: "standard",
    text: "How should a team share MCP server configuration so every member of a repository gets the same servers?",
    opts: [
      "Each developer runs claude mcp add manually",
      "Commit a .mcp.json at the project root (project scope)",
      "Put the config in ~/.claude.json",
      "Send the JSON over chat"
    ],
    correct: 1,
    why: ".mcp.json at the repo root is project scope, versioned and shared. ~/.claude.json is personal." },

  { id: "dv2s16", dom: 1, diff: "standard",
    text: "Which two items belong in a Claude system's configuration management plan? (Select TWO)",
    opts: [
      "Pinning dated model IDs and defining a migration procedure",
      "Versioning prompts with a changelog and associated evals",
      "Sharing one API key across all environments",
      "Storing secrets in CLAUDE.md"
    ],
    correct: [0,1],
    why: "Model pinning and prompt versioning are explicit Configuration Management objectives; sharing keys or storing them in CLAUDE.md are anti-patterns." },

  { id: "dv2s17", dom: 1, diff: "standard",
    text: "A business requirement says: \"Agents must answer with our brand voice and never invent SKUs.\" Which translation into technical requirements is best?",
    opts: [
      "Functional: a system prompt with voice guidance and a product-lookup tool; validation that every SKU in the output exists in the catalog. Infrastructure: catalog access with read-only credentials",
      "Buy the largest model available",
      "Ask users to verify SKUs themselves",
      "Increase temperature for creativity"
    ],
    correct: 0,
    why: "Translating into functional requirements (prompt, tool, validation) and infrastructure (access, credentials) is exactly what \"Understanding Requirements\" assesses." },

  { id: "dv3s01", dom: 2, diff: "standard",
    text: "A developer wants a reusable prompt they trigger manually with /deploy-check and that accepts the environment name as an argument. Which Claude Code component fits?",
    opts: [
      "A Skill in .claude/skills/deploy-check/SKILL.md",
      "A custom slash command in .claude/commands/deploy-check.md using $ARGUMENTS",
      "A hook on the Stop event",
      "A subagent with model: haiku"
    ],
    correct: 1,
    why: "Explicit invocation with /name and arguments means a custom command. Skills are invoked automatically by Claude based on their description." },

  { id: "dv3s02", dom: 2, diff: "standard",
    text: "Which Claude Code feature runs a specialized prompt in an isolated context with its own restricted tool set, and is defined in .claude/agents/*.md?",
    opts: [
      "Rules",
      "Plugins",
      "Subagents (custom agents)",
      "Headless mode"
    ],
    correct: 2,
    why: "Subagents are defined with frontmatter (name, description, tools, model) and work in an isolated context. Rules scope instructions by path; plugins package components." },

  { id: "dv4s01", dom: 3, diff: "standard",
    text: "A JSON-extraction step returns syntactically valid JSON, but the \"total\" field is often the subtotal. Which fix targets the actual failure mode?",
    opts: [
      "Retry the request until it parses",
      "Add few-shot examples that distinguish total vs subtotal, tighten the field description in the schema, and add a semantic validator (total ≥ subtotal) with human review on mismatch",
      "Increase max_tokens",
      "Switch to the Batch API"
    ],
    correct: 1,
    why: "A semantic error in model output, not syntax or integration: fix with prompt, schema and examples plus semantic validation." },

  { id: "dv5s01", dom: 4, diff: "standard",
    text: "Roughly how many tokens does 1,000 words of English text represent?",
    opts: [
      "About 100",
      "About 1,300–1,400",
      "About 10,000",
      "Exactly 1,000"
    ],
    correct: 1,
    why: "About 0.75 words per token in English (more tokens in other languages and code). Counting words underestimates cost." },

  { id: "dv5s02", dom: 4, diff: "standard",
    text: "What does the context window limit include?",
    opts: [
      "Only the system prompt",
      "Input tokens, output tokens and thinking tokens of the request together",
      "Only output tokens",
      "Only the tool definitions"
    ],
    correct: 1,
    why: "It is a total limit per request: everything in and everything out, thinking included, has to fit." },

  { id: "dv5s03", dom: 4, diff: "standard",
    text: "Which combination of model tiers implements a cost-efficient escalation pattern?",
    opts: [
      "Opus for classification, Haiku for complex reasoning",
      "Haiku to triage and filter, Sonnet for standard resolution, Opus only for hard cases",
      "Opus everywhere to be safe",
      "Haiku everywhere regardless of task"
    ],
    correct: 1,
    why: "Small for the simple and high-volume, large only for the hard, each tier validated with evals." },

  { id: "dv5s04", dom: 4, diff: "standard",
    text: "What is adaptive thinking?",
    opts: [
      "A fixed budget of 1,024 thinking tokens",
      "A mode where the model decides when and how much to reason based on the task, rather than a fixed budget",
      "Automatic switching between Opus and Haiku",
      "Caching of previous reasoning"
    ],
    correct: 1,
    why: "Adaptive thinking lets the model regulate its reasoning; effort modulates the investment; classic extended thinking uses budget_tokens." },

  { id: "dv5s05", dom: 4, diff: "standard",
    text: "Which two facts about fast mode are correct? (Select TWO)",
    opts: [
      "It reduces latency (higher tokens per second)",
      "It is priced higher per token than standard mode",
      "It increases the model's accuracy",
      "It only works with the Batch API"
    ],
    correct: [0,1],
    why: "Fast mode prioritises speed at a higher price; it does not improve quality and is an option of the synchronous API." },

  { id: "dv5s06", dom: 4, diff: "standard",
    text: "Which usage fields would you sum to compute the cost of a cached request? (Select TWO)",
    opts: [
      "cache_read_input_tokens and cache_creation_input_tokens (at their own rates)",
      "input_tokens and output_tokens",
      "stop_reason",
      "model"
    ],
    correct: [0,1],
    why: "The usage object breaks down regular input and output tokens and cache creation and read tokens, each at its own rate." },

  { id: "dv5s07", dom: 4, diff: "standard",
    text: "An analytics job sends the same 50-page contract with 200 different questions over 10 minutes. Which strategy minimizes cost?",
    opts: [
      "Send the contract in each request without caching",
      "Cache the contract with a cache_control breakpoint (1-hour TTL if the job may exceed 5 minutes of inactivity) and send only the question as the variable suffix",
      "Use Opus with extended thinking for each question",
      "Split the contract into 200 separate documents"
    ],
    correct: 1,
    why: "Stable prefix (the contract) cached plus a variable suffix (the question). The 1-hour TTL avoids rewrites if there are pauses." },

  { id: "dv5s08", dom: 4, diff: "standard",
    text: "Which statement about top_p and temperature is recommended practice?",
    opts: [
      "Always set both to their maximum",
      "Adjust one of them, not both, unless you have a specific reason",
      "top_p controls the number of tools",
      "temperature must equal top_p"
    ],
    correct: 1,
    why: "Both control sampling; the documentation recommends adjusting one or the other, not both." },

  { id: "dv5s09", dom: 4, diff: "standard",
    text: "Which model characteristic most affects perceived responsiveness in a chat UI?",
    opts: [
      "Time to first token and streaming",
      "Number of stop sequences",
      "Cache TTL",
      "Length of the model ID"
    ],
    correct: 0,
    why: "Time to first token and streaming determine the feeling of speed; that is why interactive apps stream." },

  { id: "dv6s01", dom: 5, diff: "standard",
    text: "Which technique prevents context bloat from large tool results in a long agent run?",
    opts: [
      "Keep every tool result verbatim forever",
      "Prune or summarize tool outputs once consumed and store references (paths, IDs) for just-in-time retrieval",
      "Send tool outputs as images",
      "Disable tools after 10 turns"
    ],
    correct: 1,
    why: "Pruning or summarising tool outputs and on-demand retrieval are the techniques the guide names against bloat." },

  { id: "dv6s02", dom: 5, diff: "standard",
    text: "What is the purpose of XML-style tags such as <instructions> and <data> in a prompt?",
    opts: [
      "They are required by the API",
      "They create clear structure so the model distinguishes sections and does not confuse data with instructions",
      "They enable prompt caching",
      "They increase the context window"
    ],
    correct: 1,
    why: "Tags delimit sections: clearer parsing for the model and a defence against injection." },

  { id: "dv6s03", dom: 5, diff: "standard",
    text: "A prompt says \"Be VERY VERY careful and ALWAYS follow the format!!!\" but outputs still vary. Which change is most likely to help?",
    opts: [
      "Add more exclamation marks",
      "Replace intensifiers with an explicit format specification and 2–3 examples, and validate the output against a schema",
      "Switch to Haiku",
      "Remove the system prompt"
    ],
    correct: 1,
    why: "Structure and examples beat intensifiers; external validation closes the loop." },

  { id: "dv6s04", dom: 5, diff: "standard",
    text: "Which is a valid way to obtain structured JSON while preventing extra prose?",
    opts: [
      "Prefill the assistant turn with \"{\" (when not using extended thinking) or use structured outputs/forced tool use",
      "Ask twice",
      "Set temperature to 2",
      "Use the Batch API"
    ],
    correct: 0,
    why: "Prefill and structured outputs or a forced tool are output-constraint techniques; prefill is not compatible with extended thinking." },

  { id: "dv6s05", dom: 5, diff: "standard",
    text: "Which claim about iterative prompt refinement is correct?",
    opts: [
      "Change many things at once to move faster",
      "Change one variable at a time and measure with an eval set so you know what caused the improvement",
      "Only iterate on the model version",
      "Prompt changes never need re-testing"
    ],
    correct: 1,
    why: "Controlled iteration plus evals: the scientific method applied to prompts." },

  { id: "dv6s06", dom: 5, diff: "standard",
    text: "A summarizer must handle documents that occasionally exceed the context window. Which approach is appropriate?",
    opts: [
      "Truncate silently and hope the ending was unimportant",
      "Chunk the document, summarize each chunk, then summarize the summaries (map-reduce), or use a multi-step workflow with isolated contexts",
      "Increase max_tokens",
      "Send the document twice"
    ],
    correct: 1,
    why: "Multi-step workflows with isolated contexts (map-reduce) are the context-engineering technique for inputs that do not fit." },

  { id: "dv7s01", dom: 6, diff: "standard",
    text: "Which single change most reduces the blast radius if a prompt injection succeeds against a browsing agent?",
    opts: [
      "A longer system prompt",
      "Giving the agent only read-only tools and requiring human approval for any write/send action (least privilege)",
      "Using a model with a larger context window",
      "Logging more"
    ],
    correct: 1,
    why: "Least privilege bounds what a successful injection can do; it is the highest-impact mitigation." },

  { id: "dv7s02", dom: 6, diff: "standard",
    text: "Which two practices belong to identity and key management for a Claude application? (Select TWO)",
    opts: [
      "Separate API keys per environment with spend limits via Workspaces",
      "Rotate keys periodically and revoke immediately if leaked",
      "Embed the key in the mobile app",
      "Reuse the same key for CI, dev and production"
    ],
    correct: [0,1],
    why: "Segregation by environment and Workspace, rotation and revocation are basic practice; embedding or reusing keys are serious failures." },

  { id: "dv7s03", dom: 6, diff: "standard",
    text: "In Claude Code, a hook script exits with code 2 during PreToolUse. What happens?",
    opts: [
      "The tool runs anyway",
      "The tool call is blocked and the script's stderr is fed back to Claude as feedback",
      "Claude Code shuts down",
      "The hook is ignored on the next run"
    ],
    correct: 1,
    why: "Exit 2 means block with feedback to the model. It is the canonical deterministic guardrail." },

  { id: "dv7s04", dom: 6, diff: "standard",
    text: "Which deployment practice reflects secure-by-design principles for an agent that executes generated code?",
    opts: [
      "Run the code with the developer's admin credentials on the host",
      "Execute in an isolated sandbox with least-privilege credentials, network restrictions, and audit logging",
      "Trust the model to avoid dangerous commands",
      "Run it only at night"
    ],
    correct: 1,
    why: "Sandbox, least privilege and auditing: executing generated code is an attack surface that needs isolation." },

  { id: "dv8s01", dom: 7, diff: "standard",
    text: "Which element of a tool definition most influences whether Claude uses the tool correctly?",
    opts: [
      "The order of tools in the array",
      "A precise description explaining what the tool does, when to use it, its parameters and limitations",
      "The length of the tool name",
      "The temperature setting"
    ],
    correct: 1,
    why: "Anthropic recommends extremely clear descriptions (three or four sentences or more): they are the main signal for selection and use." },

  { id: "dv8s02", dom: 7, diff: "standard",
    text: "How does a tool_result indicate to Claude that the tool failed?",
    opts: [
      "By omitting the content field",
      "By setting is_error: true with a helpful message describing the failure",
      "By returning HTTP 500 to the model",
      "By ending the conversation"
    ],
    correct: 1,
    why: "is_error: true plus an actionable message lets the model recover or report correctly." },

  { id: "dv8s03", dom: 7, diff: "standard",
    text: "Which is a server-side (Anthropic-executed) tool rather than a client-side one?",
    opts: [
      "A tool that queries your PostgreSQL database",
      "A tool that reads a file on your server",
      "The web search tool",
      "A tool that calls your internal billing API"
    ],
    correct: 2,
    why: "Web search, web fetch, code execution and similar run on Anthropic's side; tools that touch your systems run in your code (client-side)." },

  { id: "dv8s04", dom: 7, diff: "standard",
    text: "Which MCP transport is appropriate for a server that several teams must reach over the network with authentication?",
    opts: [
      "stdio",
      "Streamable HTTP",
      "A shared USB drive",
      "Email"
    ],
    correct: 1,
    why: "stdio is local (a child process of the client); Streamable HTTP is the remote transport with OAuth, successor to SSE." },

  { id: "dv8s05", dom: 7, diff: "standard",
    text: "In MCP, who decides to invoke a tool during a conversation, and who executes it?",
    opts: [
      "The server decides and the model executes",
      "The model (via the client/host) decides; the MCP server executes and returns the result",
      "The user must type the tool name",
      "Anthropic's servers execute all MCP tools"
    ],
    correct: 1,
    why: "The model picks the tool; the client or host sends it to the MCP server, which executes it. The server never talks to the model directly." },

  { id: "dv8s06", dom: 7, diff: "standard",
    text: "Match the need to the customization: \"our code-review standards, applied whenever Claude reviews a PR\" versus \"read tickets from our Jira instance from any of our five apps\".",
    opts: [
      "Skill for the standards; MCP server for Jira",
      "MCP server for both",
      "Skill for both",
      "Custom tool in each app for the standards; Skill for Jira"
    ],
    correct: 0,
    why: "A reusable procedure or criterion is a skill. A capability to reach a system, shared across apps, is an MCP server." },

  { id: "dv1c01", dom: 0, diff: "challenging",
    text: "In a hand-written agent loop, the API returns stop_reason \"tool_use\". Put these steps in the correct order: (1) call the API again (2) append a user message containing tool_result blocks (3) append the assistant message containing the tool_use blocks (4) execute the requested tools",
    opts: [
      "3, 4, 2, 1",
      "4, 2, 1, 3",
      "4, 2, 3, 1",
      "2, 3, 4, 1"
    ],
    correct: 0,
    why: "The assistant turn with its tool_use blocks must be in the history before the user turn that answers them, and the tool_result blocks must reference those ids. Any order that appends results before the assistant message produces a validation error." },

  { id: "dv1c02", dom: 0, diff: "challenging",
    text: "A compliance team requires that every pipeline run follows a reproducible, auditable sequence of steps. Which pattern is the least suitable fit for this requirement?",
    opts: [
      "Prompt chaining, with code-enforced validation gates between each step of the sequence",
      "Routing a classifier's verdict to one of several fixed, separately maintained sub-pipelines",
      "Orchestrator-workers, where the orchestrator decides the decomposition per input",
      "Parallel sectioning of the input, followed by a code-defined merge of the partial results"
    ],
    correct: 2,
    why: "Orchestrator-workers is the one pattern here where the step structure is decided at run time by the model, so two runs on similar input may take different paths. The other three are workflows: the model fills in steps, code fixes the sequence." },

  { id: "dv1c03", dom: 0, diff: "challenging",
    text: "Which statement about subagents is false?",
    opts: [
      "A subagent can be limited to a subset of the parent's tools, declared in its own definition",
      "A subagent's context begins with its own system prompt and task, not the parent's history",
      "A subagent's full transcript is appended to the parent's context when it finishes",
      "A subagent can run on a different model from the parent, for example Haiku for lookups"
    ],
    correct: 2,
    why: "Only the subagent's result is returned to the parent; that is the point of using one, since it keeps the parent's context small. The transcript stays with the subagent. The other three statements are correct." },

  { id: "dv1c04", dom: 0, diff: "challenging",
    text: "Which two features are characteristic of LangGraph rather than the Claude Agent SDK? (Select TWO)",
    opts: [
      "An explicit state graph with conditional edges between nodes",
      "Checkpointing of graph state so a run can be resumed or replayed",
      "Built-in Read, Edit and Bash tools identical to Claude Code's",
      "A query() function that runs the complete agentic loop"
    ],
    correct: [0,1],
    why: "LangGraph's identity is the explicit graph and its persistence. Claude Code's tool set and query() belong to the Agent SDK." },

  { id: "dv1c05", dom: 0, diff: "challenging",
    text: "An engineer needs to migrate 200 customer records tonight, once, and will watch the run. The steps needed vary with what each record contains. What is the appropriate level of engineering?",
    opts: [
      "A production workflow with an eval suite, canary rollout and dashboards before the first run",
      "An agent loop with a turn cap, run interactively with approval required on every write",
      "An orchestrator that spawns a parallel subagent per record to finish quickly",
      "A LangGraph graph with checkpoints so the migration can resume after a crash"
    ],
    correct: 1,
    why: "Variable steps favour an agent; a one-off, supervised run does not justify production scaffolding, and parallel subagents on writes trade an observable sequence for speed nobody asked for. A human gate on writes is the proportionate control." },

  { id: "dv1c06", dom: 0, diff: "challenging",
    text: "Which requirement most strongly favours self-hosting the Agent SDK over Anthropic-hosted managed agents?",
    opts: [
      "The agent needs several custom tools that call internal services over HTTP",
      "Sessions must be resumable across several days without losing state",
      "Execution must stay inside the company's network with its own egress controls",
      "The team wants to use subagents for parallel research and synthesis"
    ],
    correct: 2,
    why: "Tools, persistence and subagents are available either way. Control over where the loop physically runs and what it can reach is what managed hosting gives up." },

  { id: "dv1c07", dom: 0, diff: "challenging",
    text: "A coding agent has maxTurns: 40. On an open-ended task whose step count varies by codebase, it regularly hits the cap with changes half applied. Which change addresses the root problem?",
    opts: [
      "Raise maxTurns until the task fits in one run, then monitor the cost per run and alert on outliers",
      "Persist progress and decisions to a file each turn so the cap becomes a resumable checkpoint",
      "Split the task into fixed subtasks and run each as a workflow step with its own turn cap",
      "Move to a model with a larger context window so the task completes in fewer turns overall"
    ],
    correct: 1,
    why: "The cap is doing its job; the flaw is that hitting it destroys state. External memory turns the cap into a checkpoint. Fixed subtasks would be right if the steps were predictable, which the scenario rules out." },

  { id: "dv1c08", dom: 0, diff: "challenging",
    text: "A team added an evaluator-optimizer loop. Quality improved, but cost tripled and latency has no ceiling. Which fix is most direct?",
    opts: [
      "Stop iterating once the evaluator's score passes a threshold or stops improving, with a cap on rounds",
      "Use the same model for the evaluator as for the generator so both prompts share a cache and cost halves",
      "Replace the loop with parallel voting across several independent drafts and keep the majority answer",
      "Remove the evaluator entirely and move the generator to a stronger model to get quality in one pass"
    ],
    correct: 0,
    why: "The pattern needs a termination rule; without one it is an unbounded loop by design. The other options change the pattern or the model without addressing the missing stop condition." },

  { id: "dv2c01", dom: 1, diff: "challenging",
    text: "Which statement about the Messages API is false?",
    opts: [
      "max_tokens is required on every request, even when streaming",
      "The system parameter is optional and may be a string or an array of blocks",
      "The first message in messages must have the user role",
      "Conversation state is stored between calls, keyed by request id"
    ],
    correct: 3,
    why: "The API is stateless: each request must carry the full history. The other three statements are correct." },

  { id: "dv2c02", dom: 1, diff: "challenging",
    text: "Which stop_reason means the client should resend the conversation unchanged so the model can continue?",
    opts: [
      "max_tokens",
      "pause_turn",
      "tool_use",
      "end_turn"
    ],
    correct: 1,
    why: "pause_turn appears when a long server-tool turn is paused; resending lets it continue. max_tokens needs a continuation request, tool_use needs tool_result blocks added, end_turn needs nothing." },

  { id: "dv2c03", dom: 1, diff: "challenging",
    text: "Which event sequence is correct for a streamed text response?",
    opts: [
      "message_start, content_block_start, content_block_delta, content_block_stop, message_delta, message_stop",
      "message_start, message_delta, content_block_start, content_block_delta, content_block_stop, message_stop",
      "content_block_start, message_start, content_block_delta, content_block_stop, message_delta, message_stop",
      "message_start, content_block_start, content_block_delta, message_delta, content_block_stop, message_stop"
    ],
    correct: 0,
    why: "message_delta, which carries stop_reason and final usage, comes after all content blocks have closed and just before message_stop." },

  { id: "dv2c04", dom: 1, diff: "challenging",
    text: "A request has one cache breakpoint at the end of the system prompt. Which change does not invalidate that cache?",
    opts: [
      "Reordering two tool definitions in the tools array",
      "Editing one word anywhere in the system prompt",
      "Changing the text of the final user message",
      "Switching the request to a different model snapshot"
    ],
    correct: 2,
    why: "Only content at or before the breakpoint matters: tools precede system in the prefix, so reordering them misses; the system text is the prefix itself; caches are per model. The final user message is after the breakpoint." },

  { id: "dv2c05", dom: 1, diff: "challenging",
    text: "A 5,000-token prefix is reused by requests arriving every 20 minutes for 6 hours (18 requests). Using the standard multipliers, which configuration costs least for that prefix?",
    opts: [
      "5-minute TTL: 18 cache writes at 1.25× the base price",
      "1-hour TTL: 1 write at 2×, then 17 reads at 0.1×",
      "No caching at all: 18 requests billed at the base price",
      "5-minute TTL with two breakpoints on the same prefix"
    ],
    correct: 1,
    why: "Twenty minutes exceeds a 5-minute TTL, so every request rewrites (18 × 1.25 = 22.5 units, worse than no caching at 18). The 1-hour TTL is refreshed by each read: 2 + 1.7 = 3.7 units. Breakpoints do not change TTL." },

  { id: "dv2c06", dom: 1, diff: "challenging",
    text: "Which statement about the Message Batches API is false?",
    opts: [
      "Each request's result can be fetched as soon as it finishes",
      "Batch requests are discounted 50% on both input and output tokens",
      "Prompt caching can be combined with batch requests to stack the savings",
      "A single batch can contain up to 100,000 requests or 256 MB"
    ],
    correct: 0,
    why: "Results become available when the whole batch has finished processing, not per request. That is why batches suit latency-tolerant work only." },

  { id: "dv2c07", dom: 1, diff: "challenging",
    text: "Which two HTTP statuses should be retried automatically with backoff? (Select TWO)",
    opts: [
      "429",
      "400",
      "529",
      "401"
    ],
    correct: [0,2],
    why: "429 and 529 are transient. 400 is a malformed request and 401 a credential problem: both will fail identically on retry and need a fix, not a wait." },

  { id: "dv2c08", dom: 1, diff: "challenging",
    text: "A team migrates from the direct Anthropic API to Vertex AI. Which element stays the same?",
    opts: [
      "The model identifier strings used in requests",
      "The authentication mechanism and credentials",
      "The request structure: roles, content blocks, tools",
      "The endpoint hostnames and regional routing"
    ],
    correct: 2,
    why: "Vertex and Bedrock serve the same Messages API shape through platform-specific clients. Identifiers, auth and hosts are the cloud provider's." },

  { id: "dv2c09", dom: 1, diff: "challenging",
    text: "Which statement about extended thinking is false?",
    opts: [
      "Thinking tokens are billed as output tokens, at the output rate",
      "budget_tokens must be smaller than max_tokens or the request is rejected",
      "Earlier turns' thinking blocks are resent and billed as input on every later request",
      "Prefilling the assistant turn is not supported while thinking is enabled"
    ],
    correct: 2,
    why: "Earlier turns' thinking blocks are stripped from the context and not counted as input, so long conversations do not accumulate thinking cost. The other three are correct." },

  { id: "dv2c10", dom: 1, diff: "challenging",
    text: "A startup with one engineer has two weeks to let waitlist customers try document question-answering. Volume is tiny and errors are tolerable. Which is the right starting point?",
    opts: [
      "Direct Messages API calls with the document in the prompt, streaming, and manual spot checks",
      "A retrieval pipeline with a vector store, a reranker and an eval harness in place before launch",
      "An agent with MCP connectors into each customer's own document management system",
      "A Bedrock deployment behind a VPC endpoint, so data residency is settled from day one"
    ],
    correct: 0,
    why: "The constraints are time, headcount and tolerance for error. The simplest design that meets the requirement wins; the others solve problems the scenario does not have yet." },

  { id: "dv2c11", dom: 1, diff: "challenging",
    text: "A public-sector customer requires that data never leaves the EU and that access is governed by their existing Google Cloud IAM roles. Which path fits?",
    opts: [
      "The direct Anthropic API with EU-region processing",
      "Claude on Vertex AI in an EU region",
      "Claude on Amazon Bedrock in eu-central-1",
      "Claude through Microsoft Foundry"
    ],
    correct: 1,
    why: "Two constraints, both must hold. Bedrock satisfies the region but not the IAM system named; only Vertex satisfies both." },

  { id: "dv2c12", dom: 1, diff: "challenging",
    text: "Order these Claude Code settings sources from highest to lowest precedence: (1) ~/.claude/settings.json (2) .claude/settings.local.json (3) managed policy settings (4) .claude/settings.json",
    opts: [
      "3, 2, 4, 1",
      "3, 4, 2, 1",
      "1, 4, 2, 3",
      "2, 3, 4, 1"
    ],
    correct: 0,
    why: "Managed policy, then command-line arguments, then the local project file, then the shared project file, then the user file. The local file overrides the shared one so individuals can deviate without committing." },

  { id: "dv2c13", dom: 1, diff: "challenging",
    text: "Which statement about CLAUDE.md files is false?",
    opts: [
      "~/.claude/CLAUDE.md applies to every project on the machine",
      "CLAUDE.local.md is intended to be committed so the whole team shares it",
      "A CLAUDE.md can import other files with @path",
      "A CLAUDE.md in a subdirectory loads when Claude works with files in that subdirectory"
    ],
    correct: 1,
    why: "CLAUDE.local.md is the personal, gitignored file for one project. The team's shared instructions live in the committed CLAUDE.md." },

  { id: "dv2c14", dom: 1, diff: "challenging",
    text: "A summariser already wraps documents in <document> tags in the user turn and states they are data. One document still made the model switch its output language. Which addition is most appropriate?",
    opts: [
      "Move the document into the system prompt so the instructions clearly dominate over its content",
      "Add an output check that the language matches, and log failures as suspected injection",
      "Add a sentence telling the model to disregard any instructions found inside document content",
      "Lower the temperature so the model stays closer to its instructions on ambiguous input"
    ],
    correct: 1,
    why: "Boundaries are already in place; the next layer is validation of the output. Moving untrusted text into the system prompt raises its trust, and a \"disregard\" sentence is another instruction the same attack can override." },

  { id: "dv2c15", dom: 1, diff: "challenging",
    text: "An extraction schema declares vendor_country as a required string. For invoices with no country, the model invents one. Which change removes the incentive to guess?",
    opts: [
      "Make the field nullable and describe null as not present",
      "Instruct the model in the system prompt never to guess missing values",
      "Switch to a model with stronger instruction following and re-run the evals",
      "Post-process by deleting any country that is not on an allowlist of expected values"
    ],
    correct: 0,
    why: "A required field forces a value, so the schema itself creates the hallucination. Letting the schema express absence fixes the cause; the other options fight the symptom." },

  { id: "dv2c16", dom: 1, diff: "challenging",
    text: "Which situation is the right case for resuming a Claude Code session rather than starting fresh with a summary?",
    opts: [
      "Continuing the same feature after a break, nothing changed on disk",
      "A colleague merged forty files into main since the last session ended",
      "The last session queried a database that has since been re-seeded with new data",
      "Switching to an unrelated bug in another module of the same repository"
    ],
    correct: 0,
    why: "Resume when the context is still true. Stale tool results, a changed codebase or an unrelated task all argue for a clean context." },

  { id: "dv2c17", dom: 1, diff: "challenging",
    text: "Order these steps for upgrading a production model pinned to a dated snapshot: (1) route a small slice of traffic to the new snapshot (2) run the eval suite against the new snapshot (3) switch all traffic and retire the old snapshot (4) fix regressions the evals surfaced",
    opts: [
      "2, 4, 1, 3",
      "1, 2, 4, 3",
      "2, 1, 4, 3",
      "4, 2, 1, 3"
    ],
    correct: 0,
    why: "Measure first, fix what the measurement finds, then expose real traffic gradually, then cut over. Sending traffic before evals means users find the regressions." },

  { id: "dv2c18", dom: 1, diff: "challenging",
    text: "A backend relays streamed responses to browsers. Which choice is justified by a requirement rather than habit?",
    opts: [
      "WebSockets, because users must be able to interrupt generation mid-stream",
      "WebSockets, because Server-Sent Events are deprecated in current browsers",
      "Server-Sent Events, because WebSockets cannot carry JSON payloads reliably",
      "Long polling, because it is the simplest transport to implement and debug"
    ],
    correct: 0,
    why: "Bidirectional traffic is the real reason to pick WebSockets over SSE. The other justifications are false or irrelevant." },

  { id: "dv3c01", dom: 2, diff: "challenging",
    text: "Which statement about Claude Code hooks is false?",
    opts: [
      "A hook receives the event details as JSON on stdin",
      "Exit code 2 blocks the action and returns stderr to Claude",
      "Hooks can be declared in CLAUDE.md",
      "A matcher restricts a hook to specific tools"
    ],
    correct: 2,
    why: "Hooks live in settings.json (or SDK options). CLAUDE.md is instructions for the model and cannot register code." },

  { id: "dv3c02", dom: 2, diff: "challenging",
    text: "A CI job runs claude -p and must let Claude read the repository and write a patch file, but never run shell commands. Which invocation is correct?",
    opts: [
      "--allowedTools \"Read,Grep,Glob,Edit\" --max-turns 20",
      "--permission-mode bypassPermissions --max-turns 20",
      "--permission-mode plan --output-format json --max-turns 20",
      "--output-format stream-json --max-turns 20 --verbose"
    ],
    correct: 0,
    why: "An explicit allowlist without Bash is the control. bypassPermissions removes controls; plan mode forbids edits, so the patch could not be written; the output format does not restrict tools." },

  { id: "dv4c01", dom: 3, diff: "challenging",
    text: "After a prompt change the eval suite moves from 94% to 98%. Which check matters most before shipping?",
    opts: [
      "Confirm no previously passing case now fails, not just that the aggregate rose",
      "Run the suite three times and average the results to rule out sampling variance",
      "Add the remaining failing 2% of cases to the suite as new regression tests",
      "Compare token cost per case against the previous prompt to confirm it is not more expensive"
    ],
    correct: 0,
    why: "An aggregate can rise while a segment breaks. Regression by case is the check that protects existing behaviour; the others are useful but do not answer whether anything got worse." },

  { id: "dv5c01", dom: 4, diff: "challenging",
    text: "Which statement about tokens and billing is false?",
    opts: [
      "Code typically produces more tokens per character than English prose",
      "count_tokens lets you measure a request before sending it",
      "Output tokens are billed at the same rate as input tokens",
      "The usage object reports input and output tokens for each response"
    ],
    correct: 2,
    why: "Output tokens cost several times more than input tokens, which is why bounding output length is a stronger cost lever than trimming prompts." },

  { id: "dv5c02", dom: 4, diff: "challenging",
    text: "On a model with a 200K context window: input is 150K tokens, thinking budget_tokens is 30K, and max_tokens is 60K. What happens?",
    opts: [
      "The request fails validation: 150K plus 60K exceeds the window",
      "The request runs; thinking tokens are not counted against the context window",
      "The request runs; max_tokens is a ceiling rather than a reservation of space",
      "The request fails because the thinking budget of 30K exceeds what max_tokens allows"
    ],
    correct: 0,
    why: "Input plus max_tokens must fit in the window, and thinking is inside max_tokens. The budget (30K) is below max_tokens (60K), so that is not the error." },

  { id: "dv5c03", dom: 4, diff: "challenging",
    text: "A nightly job refactors 200 modules with cross-file dependencies. Budget is generous, latency is irrelevant, and mistakes are expensive to detect. Which model tier?",
    opts: [
      "Haiku, with more turns allowed",
      "Sonnet, the production default",
      "Opus",
      "Haiku with extended thinking"
    ],
    correct: 2,
    why: "Every constraint that usually argues against Opus is absent here, and the one that argues for it (hard, interdependent reasoning with costly errors) is present. \"Don't default to Opus\" is not \"never choose Opus\"." },

  { id: "dv5c04", dom: 4, diff: "challenging",
    text: "Which setting reduces both cost and latency at the expense of quality on the same model?",
    opts: [
      "effort set to low",
      "Fast mode",
      "Extended thinking with a larger budget",
      "A 1-hour cache TTL"
    ],
    correct: 0,
    why: "Effort trades reasoning depth for speed and tokens. Fast mode buys speed with a higher price and unchanged quality; a larger budget costs more; TTL affects cache economics only." },

  { id: "dv5c05", dom: 4, diff: "challenging",
    text: "100,000 requests a day share a 10,000-token cached prefix. With illustrative prices of 3 USD per million input tokens and 0.30 USD per million cache-read tokens, how much does caching save on the prefix per day, ignoring the single write?",
    opts: [
      "2,700 USD",
      "300 USD",
      "3,000 USD",
      "270 USD"
    ],
    correct: 0,
    why: "One billion prefix tokens a day: 3,000 USD uncached versus 300 USD as cache reads, a saving of 2,700 USD." },

  { id: "dv5c06", dom: 4, diff: "challenging",
    text: "Which is not a legitimate reason to pin a dated model snapshot?",
    opts: [
      "Keeping behaviour stable while the eval suite catches up",
      "Guaranteeing the model will never be deprecated",
      "Reproducing a production incident with the exact model that served it",
      "Rolling a new version out gradually"
    ],
    correct: 1,
    why: "Snapshots are retired on a published schedule; pinning gives you control over when you move, not whether." },

  { id: "dv5c07", dom: 4, diff: "challenging",
    text: "Which statement about sampling is true?",
    opts: [
      "temperature 0 removes randomness entirely, so identical inputs give identical outputs",
      "temperature and top_p should normally be tuned together for the best results",
      "The default temperature is 1.0; lowering it makes outputs more deterministic",
      "top_k must be set whenever tools are used, or tool calls become unreliable"
    ],
    correct: 2,
    why: "Determinism at 0 is not absolute, tuning both samplers together is discouraged, and top_k has nothing to do with tools." },

  { id: "dv5c08", dom: 4, diff: "challenging",
    text: "A response reports input_tokens: 800, cache_read_input_tokens: 9,000, cache_creation_input_tokens: 0, output_tokens: 300. Which reading is correct?",
    opts: [
      "9,800 input tokens were billed at the full input price, since reads count as input",
      "9,000 tokens were read from cache at the reduced rate; 800 were billed at base input",
      "Nothing was cached on this request, because cache_creation_input_tokens is zero",
      "The cache was written on this request and will be read on the next one"
    ],
    correct: 1,
    why: "Zero creation with a non-zero read means the prefix was already cached by an earlier request. input_tokens counts only the uncached remainder." },

  { id: "dv5c09", dom: 4, diff: "challenging",
    text: "Which two workloads are reasonable fits for Haiku? (Select TWO)",
    opts: [
      "Normalising and deduplicating addresses across five million records",
      "A first-pass triage that decides which requests need a larger model",
      "A single long-horizon agent refactoring a monorepo",
      "Drafting legal contracts from precedents"
    ],
    correct: [0,1],
    why: "High volume with simple per-item judgement, and cheap routing ahead of stronger models, are Haiku's territory. Long agentic reasoning and high-stakes drafting are not." },

  { id: "dv6c01", dom: 5, diff: "challenging",
    text: "Which statement about context is false?",
    opts: [
      "Once within the window, additional relevant material has no downside",
      "Compaction summarises history while preserving decisions and state",
      "Just-in-time retrieval keeps references and loads content when needed",
      "Subagents isolate context and return a condensed result"
    ],
    correct: 0,
    why: "Context has diminishing returns even when it fits: more tokens dilute attention and raise cost. The goal is the smallest high-signal set." },

  { id: "dv6c02", dom: 5, diff: "challenging",
    text: "For a long document followed by a question, which placement is recommended?",
    opts: [
      "Once within the window, additional relevant material has no downside",
      "Compaction summarises the history while preserving decisions and current state",
      "Just-in-time retrieval keeps references in context and loads content when needed",
      "Subagents isolate their own context and return a condensed result to the parent"
    ],
    correct: 0,
    why: "Long inputs go before the query; the request at the end keeps the task close to where generation begins." },

  { id: "dv6c03", dom: 5, diff: "challenging",
    text: "A classifier with eight labels confuses two of them. Which few-shot set helps most?",
    opts: [
      "One canonical example per label, eight in total, so every label has coverage",
      "A few examples focused on the two confusable labels, including borderline cases",
      "Twenty examples from the most frequent label, to anchor the output format firmly",
      "No examples at all; a precise written definition of each label instead of samples"
    ],
    correct: 1,
    why: "Examples buy the most where the decision boundary is hardest. Even coverage spends them where the model already succeeds; definitions alone rarely resolve borderline cases." },

  { id: "dv6c04", dom: 5, diff: "challenging",
    text: "Which content belongs in the user turn rather than the system prompt?",
    opts: [
      "Output format rules",
      "Retrieved documents",
      "The assistant's role",
      "Policy on when to use tools"
    ],
    correct: 1,
    why: "Data goes in the user turn; role, invariant rules and policy go in system. Placing documents in system both weakens the trust boundary and breaks the cacheable prefix." },

  { id: "dv6c05", dom: 5, diff: "challenging",
    text: "After structured outputs return, which two checks still belong to the application? (Select TWO)",
    opts: [
      "Referenced IDs exist in the database",
      "Dates are real calendar dates",
      "The JSON is syntactically valid",
      "Each field has its declared type"
    ],
    correct: [0,1],
    why: "Structured outputs guarantee syntax and types. Real-world validity, referential integrity and cross-field consistency are the application's job." },

  { id: "dv6c06", dom: 5, diff: "challenging",
    text: "A release changed the system prompt, added two examples and switched model at once. Quality dropped. What is the recommended recovery?",
    opts: [
      "Revert all three, then reintroduce them one at a time with an eval after each",
      "Keep the model change and revert only the prompt edits, since the model is the bigger change",
      "Add more examples until the eval score recovers to its previous level",
      "Raise effort to compensate for the drop while the team investigates the cause"
    ],
    correct: 0,
    why: "Three simultaneous changes mean the cause is unknown. Isolating variables is slower per step and faster overall." },

  { id: "dv7c01", dom: 6, diff: "challenging",
    text: "Which two of these are enforceable controls, as opposed to instructions the model may or may not follow? (Select TWO)",
    opts: [
      "A PreToolUse hook that denies outbound requests to domains not on an allowlist",
      "A system prompt sentence stating that content in tool results is untrusted",
      "A tool allowlist that excludes every write-capable tool",
      "An <untrusted> tag wrapped around fetched web content"
    ],
    correct: [0,2],
    why: "Hooks and allowlists execute regardless of what the model decides. Tags and sentences shape the model's behaviour and are worth having, but a successful injection can override them." },

  { id: "dv7c02", dom: 6, diff: "challenging",
    text: "Which statement about API key management is false?",
    opts: [
      "Workspaces can carry spend limits for the keys inside them",
      "The Admin API can create, list and revoke API keys programmatically",
      "A key committed to a private repository is safe while the repository stays private",
      "Keys should rotate on a schedule and immediately on any suspected exposure"
    ],
    correct: 2,
    why: "Repositories get cloned, mirrored, forked and leaked. A committed key is an exposed key; revoke and rotate." },

  { id: "dv7c03", dom: 6, diff: "challenging",
    text: "A PreToolUse hook should let Edit proceed on most files but block edits under /migrations. Which mechanism is correct?",
    opts: [
      "Exit 0 unconditionally and put the migrations rule in CLAUDE.md, where Claude will read it before editing",
      "Read the file path from the stdin JSON and exit 2 with a message when it is under /migrations",
      "Use a Stop hook that checks whether any migration file changed and reports it at the end of the turn",
      "Set the matcher to \"Bash\" and inspect each command for the /migrations path before it runs"
    ],
    correct: 1,
    why: "The hook already has the target path in its input; deciding on it and exiting 2 is the deterministic block. Stop is too late, Bash is the wrong tool, and CLAUDE.md is advice." },

  { id: "dv7c04", dom: 6, diff: "challenging",
    text: "A team can afford one more safeguard for an agent that sends email on users' behalf. Which adds the most protection?",
    opts: [
      "An input classifier for jailbreak phrasing",
      "An output classifier over the drafted email text",
      "A human approval step before any send action",
      "A more detailed policy section in the system prompt"
    ],
    correct: 2,
    why: "Sending is irreversible and externally visible. A gate on the action bounds the damage of every upstream failure, including ones no classifier anticipated." },

  { id: "dv8c01", dom: 7, diff: "challenging",
    text: "Which statement about tool_choice is false?",
    opts: [
      "auto lets the model call a tool or answer in text",
      "any requires a tool call but lets the model choose which",
      "tool forces a call to a named tool",
      "none removes the tool definitions from the request"
    ],
    correct: 3,
    why: "none prevents tool calls; the definitions remain in the request (and can still be cached). Removing tools is a different change." },

  { id: "dv8c02", dom: 7, diff: "challenging",
    text: "Which two MCP primitives are typically invoked or attached by the user or the application, rather than chosen by the model? (Select TWO)",
    opts: [
      "Tools",
      "Resources",
      "Prompts",
      "Sampling"
    ],
    correct: [1,2],
    why: "Resources are attached to context by the app or user; prompts are templates the user triggers. Tools are model-invoked; sampling is a server asking the client for a completion." },

  { id: "dv8c03", dom: 7, diff: "challenging",
    text: "Which statement about MCP transports is false?",
    opts: [
      "stdio runs the server as a child process launched by the client",
      "Streamable HTTP supports OAuth-based authorization for remote clients",
      "A stdio server can be shared over the network by several remote clients",
      "Messages between client and server follow JSON-RPC 2.0"
    ],
    correct: 2,
    why: "stdio is a local pipe between one client and one process. Network sharing is what Streamable HTTP is for." },

  { id: "dv8c04", dom: 7, diff: "challenging",
    text: "A tool fails because the upstream API returned 503. Which tool_result serves the agent best?",
    opts: [
      "is_error: true with \"upstream temporarily unavailable, retryable\"",
      "is_error: true with the raw exception message and the full stack trace for context",
      "is_error: false with an empty result so the model moves on to the next step",
      "Abort the agent loop and return the error directly to the user for a decision"
    ],
    correct: 0,
    why: "A transient error should be described as transient so the model can decide to retry or work around it. The stack trace adds noise, the empty result misinforms, and aborting throws away a recoverable turn." },

  { id: "dv8c05", dom: 7, diff: "challenging",
    text: "Which situation is a case for a custom tool inside the application rather than an MCP server?",
    opts: [
      "The logic is specific to this one application and shared with nothing else",
      "Three internal applications need the same capability with a single owner",
      "A separate platform team will own and maintain the integration going forward",
      "Claude Desktop users need the capability available to them as a connector"
    ],
    correct: 0,
    why: "Sharing across apps, separate ownership and connector distribution all point to MCP. Single-app, single-owner logic is simpler as a tool in the code." }

];

/* The two papers. 53 items each, 120 minutes, scored on the exam's 100–1000
   scale with the pass mark at 720. */

window.CCDVF_MOCKS = [
  { id: "dv-standard", label: "Mock exam · Standard", diff: "Standard", minutes: 120,
    blurb: "A full-length paper at the level of the exam guide's own sample items: 53 questions in the official domain proportions, a mix of single and multiple response. The one to sit first.",
    ids: ["dv2s13", "dv2s07", "dv7s04", "dv2s12", "dv5s07", "dv8s06", "dv2s16", "dv5s02",
          "dv6s05", "dv1s07", "dv2s05", "dv1s06", "dv8s05", "dv8s01", "dv2s02", "dv2s04",
          "dv3s02", "dv7s02", "dv3s01", "dv4s01", "dv6s01", "dv6s02", "dv1s02", "dv2s08",
          "dv1s05", "dv6s03", "dv2s06", "dv8s03", "dv1s08", "dv5s01", "dv5s05", "dv5s08",
          "dv8s02", "dv2s09", "dv2s15", "dv2s03", "dv6s04", "dv1s01", "dv1s04", "dv2s11",
          "dv5s03", "dv5s04", "dv8s04", "dv2s17", "dv2s10", "dv2s14", "dv5s06", "dv2s01",
          "dv1s03", "dv7s03", "dv7s01", "dv6s06", "dv5s09"] },

  { id: "dv-challenge", label: "Mock exam · Challenge", diff: "Challenging", minutes: 120,
    blurb: "Same domains and the same weights, built to resist guessing: every option is defensible, and several scenarios are ones where the usual best practice is the wrong answer. Above the real exam's average difficulty.",
    ids: ["dv2c07", "dv1c02", "dv6c01", "dv1c08", "dv2c10", "dv6c04", "dv7c04", "dv5c09",
          "dv3c02", "dv1c03", "dv2c01", "dv1c07", "dv2c15", "dv7c03", "dv2c12", "dv7c02",
          "dv5c01", "dv8c03", "dv3c01", "dv5c06", "dv2c08", "dv2c05", "dv5c02", "dv8c04",
          "dv8c05", "dv2c16", "dv2c03", "dv6c03", "dv2c18", "dv5c03", "dv2c04", "dv2c14",
          "dv6c05", "dv5c05", "dv4c01", "dv2c17", "dv5c08", "dv8c02", "dv1c01", "dv8c01",
          "dv6c06", "dv1c04", "dv5c04", "dv2c13", "dv6c02", "dv2c06", "dv1c06", "dv7c01",
          "dv2c11", "dv2c02", "dv5c07", "dv2c09", "dv1c05"] }

];
