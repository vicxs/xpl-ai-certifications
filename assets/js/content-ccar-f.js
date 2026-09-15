/* CCAR-F — Claude Certified Architect, Foundations.
   Domain theory and end-of-domain quizzes, transcribed from the official exam
   guide (5 domains / 30 lessons) and the published course outline. Domain codes,
   names, weights and the lesson order follow the official blueprint.

   Shape, per domain:
     concepts[]  one lesson: { ref, title, body, points[], code?, exam? }
     questions[] the end-of-domain quiz: { d, text, opts[4], correct, why }

   'concepts' and 'questions' keep the names used by the rest of the app, so the
   progress bar and the (unported) question bank read this without changes. */

window.CCARF_DOMAINS = [

  /* ---------------------------------------------------------------- D1 --- */
  {
    code: "D1", name: "Agent Architecture & Orchestration", short: "Agentic architecture", weight: 27,
    summary: "Agentic loops, coordinator–subagent systems, context passing, enforcement, hooks, decomposition and sessions.",
    intro: "The heaviest domain, and the one the other four lean on. Expect scenarios where an agent misbehaves and you pick the structural fix: a loop that stops on the wrong signal, a coordinator that decomposed too narrowly, a subagent starved of context, or a business rule that was written into a prompt when it needed to be written into code.",
    concepts: [
      { ref: "1.1", title: "Designing agentic loops",
        body: "An agentic loop is deterministic control flow that you write in code around the Messages API. Claude decides which tool to call next; your loop decides when the work is finished — and it decides that from one field.",
        points: [
          "Lifecycle: send the request with tool definitions, read stop_reason, execute any requested tool, append the result to the history, send again.",
          "stop_reason = \"tool_use\" means continue; \"end_turn\" means the task is done. Also possible: \"max_tokens\" (truncated output) and \"stop_sequence\".",
          "Tool results return as a user-role message containing a tool_result block. There is no \"tool\" role.",
          "The API is stateless: every request must carry the full conversation history, or the model loses coherence.",
          "Model-driven selection — Claude picks the next tool from context and prior results — is preferred over a hard-coded decision tree, except where business logic needs a deterministic order."
        ],
        code: { label: "The loop, in full", text:
"messages = [{\"role\": \"user\", \"content\": task}]\nwhile True:\n    response = client.messages.create(\n        model=\"claude-sonnet-4-6\", system=SYSTEM,\n        messages=messages, tools=TOOLS,\n    )\n    messages.append({\"role\": \"assistant\", \"content\": response.content})\n\n    if response.stop_reason == \"end_turn\":\n        return response          # done — the only reliable signal\n\n    if response.stop_reason == \"tool_use\":\n        results = [run(block) for block in tool_use_blocks(response)]\n        messages.append({\"role\": \"user\", \"content\": results})" },
        exam: "Three anti-patterns are tested directly: parsing the assistant's text for \"task complete\", using an iteration cap (max_iterations=5) as the primary stop condition, and checking content[0].type == \"text\" — Claude can return text and a tool_use block in the same response. A cap is a safety net, never the signal." },

      { ref: "1.2", title: "Orchestrating multi-agent systems (coordinator–subagent)",
        body: "Multi-agent systems are built hub-and-spoke: one coordinator at the centre, specialised subagents on the spokes. The coordinator owns everything that crosses a boundary.",
        points: [
          "Coordinator responsibilities: decompose the task, choose which subagents are needed, delegate, aggregate and validate results, handle errors and retries, report to the user.",
          "All inter-agent communication routes through the coordinator — that is what makes the system observable and its errors recoverable.",
          "Subagents run with isolated context. They do not inherit the coordinator's history and share no memory between calls.",
          "Split coverage explicitly between subagents so two of them do not research the same ground.",
          "Iterative refinement: the coordinator evaluates the synthesis for gaps and re-routes work rather than shipping the first pass."
        ],
        exam: "The signature failure is a coordinator that decomposed too narrowly — \"AI in creative industries\" split into digital art, graphic design and photography, so music and literature never appear in the report. The subagents did their jobs perfectly; the assignment was wrong. Look at what was delegated before you blame the workers." },

      { ref: "1.3", title: "Subagent invocation and context passing",
        body: "Subagents are spawned with the Task tool and start with an empty context. Anything they need has to be in the prompt you send them.",
        points: [
          "The coordinator's allowedTools must include \"Task\", or it cannot spawn anything.",
          "Pass the full output of prior agents explicitly; use a structured format so data is separable from metadata.",
          "Several Task calls in a single coordinator turn run in parallel.",
          "AgentDefinition configures a subagent: name, description, system_prompt and allowed_tools (least privilege).",
          "Write coordinator prompts as goals and quality criteria, not step-by-step instructions — the coordinator adapts, the pipeline does not.",
          "fork_session branches from shared context when you want to explore two approaches side by side."
        ],
        code: { label: "Context passing", text:
"# Bad — the subagent has none of the context\nTask: \"Analyze the document\"\n\n# Good — everything it needs is in the prompt\nTask: \"\"\"Analyze the following document.\n<document>[full text]</document>\n<prior_findings>[web search results]</prior_findings>\n<output_schema>[schema]</output_schema>\"\"\"\n\ncoordinator = AgentDefinition(\n    name=\"coordinator\",\n    allowed_tools=[\"Task\", \"get_customer\"],\n)" } },

      { ref: "1.4", title: "Workflow enforcement and handoff patterns",
        body: "Prompts buy you probabilistic compliance. Code buys you a guarantee. The exam repeatedly asks which one a given requirement deserves.",
        points: [
          "A programmatic precondition blocks a downstream tool until its prerequisite has run — process_refund stays unavailable until get_customer has returned a verified ID.",
          "Where failure has financial, legal or safety consequences, prompt guidance is not an acceptable control.",
          "Prompt guidance remains the right tool for preferences, tone and formatting.",
          "Decompose a multi-aspect customer request into separate tracked items so none of them is silently dropped.",
          "Escalation carries a structured handoff: customer ID, issue summary, order ID, root cause, actions already taken, recommended action, escalation reason."
        ],
        exam: "The human operator on the other side of an escalation does not get the conversation transcript — only your summary object. It has to be complete and self-contained." },

      { ref: "1.5", title: "Agent SDK hooks",
        body: "Hooks intercept the agent lifecycle at fixed points, so you can transform what the model sees or block what it is about to do.",
        points: [
          "PostToolUse fires on a tool result before the model consumes it — the place to normalise formats (Unix timestamps and \"Mar 5, 2025\" alike into ISO 8601) across different MCP servers.",
          "The same hook trims a 40-field payload down to the 5 fields the task needs, which protects the context window.",
          "A pre-call interception hook blocks a policy-violating action — a refund above $500 — and redirects it to escalation.",
          "Hooks are deterministic; prompt instructions are probabilistic. Choose hooks for business rules that must hold every time."
        ],
        code: { label: "Normalise, then enforce", text:
"@hook(\"PostToolUse\")\ndef normalize_dates(tool_result):\n    # Unix timestamp or \"Mar 5, 2025\" -> \"2025-03-05\"\n    return normalized(tool_result)\n\n@hook(\"PreToolUse\")\ndef enforce_refund_limit(tool_call):\n    if tool_call.name == \"process_refund\" and tool_call.args.amount > 500:\n        return redirect_to_escalation(tool_call)" } },

      { ref: "1.6", title: "Task decomposition strategies",
        body: "Two shapes, and the exam wants you to pick between them on the predictability of the work.",
        points: [
          "Fixed pipeline (prompt chaining): every step is known up front — document, then metadata extraction, then data extraction, then validation, then enrichment. Use it for repeatable work where you want stable, reproducible output.",
          "Dynamic adaptive decomposition: subtasks are generated from intermediate results — map the structure, find three untested modules, prioritise payments, then discover an external dependency and add a mock before writing tests.",
          "Chaining also defends against attention dilution: analysing 14 files in one pass produces deep comments on some and shallow ones on others.",
          "Standard split for a large review: one local pass per file, then a separate cross-file integration pass."
        ] },

      { ref: "1.7", title: "Session state, resuming and forking",
        body: "Long investigations outlive a single session. Two mechanisms carry them, and both have a failure mode.",
        points: [
          "claude --resume <session-name> continues a named session with its saved context.",
          "fork_session branches an independent line of work from shared context — compare a Redux and a Context API approach from the same investigation.",
          "Resuming is risky when files have changed since: the saved tool results are stale, and the agent does not know it.",
          "Starting fresh with a structured summary of what you found is often more reliable than resuming onto stale data."
        ] }
    ],
    questions: [
      { d: "standard", text: "You are writing the control loop for an agent built on the Messages API. Which condition correctly determines that the agent has finished its task?",
        opts: [
          "The assistant's text no longer contains a phrase like \"I'll now\" or \"next I will\"",
          "response.stop_reason == \"end_turn\"",
          "response.content[0].type == \"text\"",
          "The loop has reached its configured max_iterations value"
        ], correct: 1,
        why: "stop_reason is deterministic and unambiguous — it is the only reliable completion signal. Parsing text is guesswork, content[0] can be text while a tool_use block follows it in the same response, and an iteration cap is a safety net that either truncates real work or burns turns." },

      { d: "challenging", text: "Telemetry shows that in 12% of conversations the support agent skips get_customer and calls lookup_order with only the customer's name, which has produced incorrect refunds. Which change is most effective?",
        opts: [
          "Rewrite the system prompt to stress that get_customer must always run first",
          "Add few-shot examples showing the correct tool order",
          "Add a programmatic precondition that blocks lookup_order and process_refund until get_customer has returned a verified ID",
          "Add a routing classifier that decides which tool the request needs"
        ], correct: 2,
        why: "When critical business logic depends on a specific tool sequence, only code gives a deterministic guarantee. Prompt wording and few-shot examples raise compliance but never to 100%, and a classifier addresses tool availability, not ordering." },

      { d: "challenging", text: "A research system is asked to report on \"the impact of AI on the creative industries\". The reports only ever cover visual art. The logs show the coordinator decomposed the topic into \"AI in digital art\", \"AI in graphic design\" and \"AI in photography\", and each subagent returned thorough results. What is the cause?",
        opts: [
          "The synthesis agent does not detect coverage gaps",
          "The coordinator decomposed the task too narrowly",
          "The web-search subagent is not searching thoroughly enough",
          "The document-analysis subagent filters out non-visual sources"
        ], correct: 1,
        why: "All three subtopics are visual; music, literature and film were never assigned. The subagents executed their instructions correctly — the defect is in what the coordinator delegated. Decomposition quality is the coordinator's responsibility." },

      { d: "standard", text: "A coordinator spawns a document-analysis subagent to work on results the web-search subagent produced earlier. The subagent replies that it has nothing to analyse. What is wrong?",
        opts: [
          "Subagents cannot read results produced by other subagents under any circumstances",
          "The search results were not included in the subagent's prompt — subagents do not inherit the coordinator's context",
          "The coordinator needs to raise the subagent's max_tokens so it can receive the history",
          "The two subagents must share a session so memory carries across"
        ], correct: 1,
        why: "Subagent context is isolated: it starts empty and inherits nothing from the coordinator's history. Everything the subagent needs — prior outputs, the document, the output schema — has to be passed explicitly in the Task prompt." },

      { d: "challenging", text: "Compliance requires that no refund over $500 is ever issued without a human. Which implementation satisfies the requirement?",
        opts: [
          "A line in the system prompt instructing the agent never to refund more than $500 autonomously",
          "A few-shot example showing a $700 refund being escalated",
          "A pre-call hook that intercepts process_refund and redirects any amount above $500 to escalation",
          "A post-hoc audit report listing refunds above $500 for weekly review"
        ], correct: 2,
        why: "Hooks are deterministic; prompt instructions are probabilistic and \"above 90%\" is not a compliance control. An audit detects the breach after the money has moved. Financial, legal and safety rules belong in code." },

      { d: "standard", text: "You resume a named session from last week to continue debugging, but three of the files involved have since been refactored by a teammate. What is the best course of action?",
        opts: [
          "Resume the session as-is — saved context is always preferable to starting over",
          "Resume, but tell the agent which files changed so it re-reads them instead of trusting stale tool results",
          "Fork the old session so both versions of the codebase stay available",
          "Raise the context window so both the old and new file contents fit"
        ], correct: 1,
        why: "Resumed sessions carry tool results captured before the change, and the agent has no way to know they are stale. Either flag the changes so they are re-read, or start a new session seeded with a structured summary of the findings." }
    ]
  },

  /* ---------------------------------------------------------------- D2 --- */
  {
    code: "D2", name: "Tool Design & MCP Integration", short: "Tools & MCP", weight: 18,
    summary: "Tool descriptions, structured errors, tool allocation and tool_choice, MCP servers and resources, built-in tools.",
    intro: "Tool ergonomics seen from the model's side. Most questions here start with a model choosing the wrong tool or recovering badly from a failure, and the fix is almost always in the description, the error shape or the size of the toolset — not in the model.",
    concepts: [
      { ref: "2.1", title: "Designing tool interfaces with clear descriptions",
        body: "The description is the primary mechanism by which the model selects a tool. A minimal description is the root cause behind most misrouting.",
        points: [
          "State what the tool does and returns, the input formats with example values, edge cases and constraints, and when to use it rather than the similar tool next to it.",
          "Near-identical descriptions on analyze_content and analyze_document guarantee confusion — rename to remove functional overlap (analyze_content becomes extract_web_results).",
          "Split an overloaded general-purpose tool into specialised tools with clear input/output contracts.",
          "System prompt wording creates unintended associations: \"always verify the customer\" makes the model over-call get_customer even when it is unnecessary.",
          "Agents lean towards built-in tools (Read, Grep) over MCP tools that look similar — strengthen the MCP description with the concrete data or context the built-in cannot provide."
        ],
        code: { label: "A description that actually selects", text:
"{\n  \"name\": \"get_customer\",\n  \"description\": \"Finds a customer by email or ID. Returns the customer\n    profile including name, email, order history and account status.\n    Use this BEFORE lookup_order to verify identity. Accepts an email\n    (user@domain.com) or a numeric customer_id.\",\n  \"input_schema\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"email\": {\"type\": \"string\", \"description\": \"Customer email\"},\n      \"customer_id\": {\"type\": \"integer\", \"description\": \"Numeric ID\"}\n    },\n    \"required\": []\n  }\n}" } },

      { ref: "2.2", title: "Structured error responses for MCP tools",
        body: "An MCP tool signals failure with isError: true. What it puts beside that flag decides whether the agent can recover.",
        points: [
          "Transient (timeout, 503, network) — retryable, back off and retry.",
          "Validation (bad input, missing required field) — not retryable as-is; fix the input and retry.",
          "Business (policy violation, threshold exceeded) — not retryable; explain it and offer an alternative.",
          "Permission (access denied) — not retryable; escalate.",
          "Return errorCategory, isRetryable, a human-readable message, the attempted query and any partial results. \"Operation failed\" gives the agent nothing to decide on.",
          "Distinguish an access failure from a valid empty result — \"no matches\" and \"the search broke\" demand opposite responses.",
          "Recover locally inside the subagent for transient failures (one or two retries), then propagate what you could not resolve."
        ],
        code: { label: "Structured vs generic", text:
"// Good\n{\n  \"isError\": true,\n  \"content\": {\n    \"errorCategory\": \"transient\",\n    \"isRetryable\": true,\n    \"message\": \"Timeout calling the orders API.\",\n    \"attempted_query\": \"order_id=12345\",\n    \"partial_results\": null\n  }\n}\n\n// Anti-pattern\n{ \"isError\": true, \"content\": \"Operation failed\" }" } },

      { ref: "2.3", title: "Allocating tools across agents and tool_choice",
        body: "Tool selection reliability falls as the toolset grows. Scoping the toolset per role is a design decision, not housekeeping.",
        points: [
          "Eighteen tools on one agent selects far worse than four or five. Give each subagent the tools for its role plus a small set of shared utilities.",
          "An agent holding tools outside its specialisation will eventually misuse them.",
          "Replace a broad tool with a constrained one where you can — fetch_url becomes load_document.",
          "tool_choice: {\"type\": \"auto\"} lets the model answer in text or call a tool — the default.",
          "tool_choice: {\"type\": \"any\"} forces some tool call, which is how you guarantee structured output when several schemas are in play.",
          "tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"} forces one specific tool — use it to guarantee a first step or an execution order."
        ],
        exam: "Least privilege shows up as a distractor pair: when a synthesis agent needs simple fact checks, give it one narrow verify_fact tool rather than the whole web-search toolset, and keep the complex path routed through the coordinator." },

      { ref: "2.4", title: "Integrating MCP servers",
        body: "MCP is the open protocol for connecting external systems to Claude. It exposes three things: tools (actions), resources (readable context) and prompts (templates).",
        points: [
          "Project scope, .mcp.json at the repository root, is version-controlled and shared with every contributor — the right place for team servers.",
          "User scope, ~/.claude.json, is personal and not shared — the right place for experiments.",
          "Secrets use environment variable substitution (${GITHUB_TOKEN}); the token itself is never committed.",
          "All tools from all connected servers are discovered on connection and are available simultaneously.",
          "Resources are a content catalog — a task list, a database schema, an API reference — that hands the agent an immediate map instead of forcing exploratory tool calls.",
          "For standard integrations (GitHub, Jira, Slack) prefer an existing community server; build your own only for workflows that are genuinely specific to your team."
        ],
        code: { label: ".mcp.json", text:
"{\n  \"mcpServers\": {\n    \"github\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@modelcontextprotocol/server-github\"],\n      \"env\": { \"GITHUB_TOKEN\": \"${GITHUB_TOKEN}\" }\n    }\n  }\n}" } },

      { ref: "2.5", title: "Selecting and applying built-in tools",
        body: "Read, Write, Edit, Bash, Grep and Glob each have one job, and the exam tests the boundaries between them.",
        points: [
          "Glob finds files by name or extension pattern: **/*.test.tsx, src/components/**/*.ts.",
          "Grep searches inside file contents: a function name, an error message, an import.",
          "Read loads a file in full; Write creates or replaces one; Edit makes a precise change by matching unique text.",
          "When Edit fails because the target text is not unique, fall back to Read, modify the content, then Write.",
          "Investigate incrementally: Grep for entry points, Read what you found, Grep for usages, Read the consumers — do not load every file up front."
        ] }
    ],
    questions: [
      { d: "standard", text: "A support agent frequently calls get_customer for order-status questions that should go to lookup_order. Both tools have short, similar descriptions. What is the first thing to fix?",
        opts: [
          "Add few-shot examples of correct tool selection to the system prompt",
          "Expand each tool's description with input formats, example queries and explicit applicability boundaries",
          "Add a routing layer that classifies the request before the model sees the tools",
          "Merge the two tools into one with a mode parameter"
        ], correct: 1,
        why: "Descriptions are the model's primary selection mechanism, so improving them is the lowest-effort, highest-impact fix and addresses the root cause. Few-shot examples add tokens without fixing the ambiguity, a routing layer is overengineering, and merging costs more effort than the problem warrants." },

      { d: "challenging", text: "An MCP tool times out calling the orders API. Which response body best enables the agent to recover intelligently?",
        opts: [
          "{ \"isError\": true, \"content\": \"Operation failed\" }",
          "{ \"isError\": false, \"content\": [] } so the workflow continues uninterrupted",
          "{ \"isError\": true, \"content\": { \"errorCategory\": \"transient\", \"isRetryable\": true, \"message\": \"Timeout calling the orders API.\", \"attempted_query\": \"order_id=12345\" } }",
          "A raised exception carrying the full stack trace of the HTTP client"
        ], correct: 2,
        why: "The category and the retryable flag tell the agent whether to back off and retry, change the query or escalate, and the attempted query lets it vary the next attempt. A generic string carries no decision information, an empty success masks a failure as \"no matches\", and a stack trace is noise the model cannot act on." },

      { d: "standard", text: "Your extraction pipeline defines three extraction tools and must never return prose. Which configuration guarantees structured output while letting the model pick the right schema?",
        opts: [
          "tool_choice: {\"type\": \"auto\"}",
          "tool_choice: {\"type\": \"any\"}",
          "tool_choice: {\"type\": \"tool\", \"name\": \"extract_invoice\"}",
          "No tool_choice, with an instruction in the system prompt to always call a tool"
        ], correct: 1,
        why: "\"any\" obliges the model to call some tool while leaving the choice of which one to it — exactly the case of several candidate schemas. \"auto\" permits a text answer, forcing a named tool removes the model's judgement, and a prompt instruction is not a guarantee." },

      { d: "standard", text: "Your team wants everyone who clones the repository to get the same GitHub and Jira MCP servers, without committing any tokens. What do you do?",
        opts: [
          "Configure both servers in ~/.claude.json and ask each engineer to copy the file",
          "Configure both servers in the project's .mcp.json using ${GITHUB_TOKEN} and ${JIRA_TOKEN} environment variable substitution",
          "Commit .mcp.json with the tokens inline and rotate them monthly",
          "Write the server definitions into CLAUDE.md so Claude Code starts them on demand"
        ], correct: 1,
        why: ".mcp.json is the project-scoped, version-controlled configuration shared by every contributor, and environment variable substitution keeps the secrets out of the repository. ~/.claude.json is the personal scope, inline tokens are a leak, and CLAUDE.md holds instructions, not server definitions." },

      { d: "challenging", text: "A research subagent is given 18 tools spanning search, document analysis, reporting and account administration. Its tool selection has become unreliable. What is the correct remedy?",
        opts: [
          "Keep the toolset and add a system prompt section describing when to use each tool",
          "Restrict the subagent to the four or five tools its role needs, plus a small set of shared utilities",
          "Raise the model tier so the larger toolset fits comfortably",
          "Set tool_choice: \"any\" so the model always commits to a tool"
        ], correct: 1,
        why: "Selection reliability degrades as the toolset grows, and tools outside an agent's specialisation invite misuse. Scoping by role is the structural fix; documentation, a bigger model and forcing a call all leave the crowded decision space intact." },

      { d: "standard", text: "Edit fails on a file because the snippet you targeted appears three times. What is the correct fallback?",
        opts: [
          "Re-run Edit with a longer timeout",
          "Use Bash with sed to perform the replacement",
          "Read the full file, modify the content, then Write the updated version",
          "Use Grep to delete the duplicate occurrences first"
        ], correct: 2,
        why: "Edit requires a unique text match. When there is no unique anchor, the documented fallback is Read to load the whole file, modify it programmatically, and Write it back." }
    ]
  }
,

  /* ---------------------------------------------------------------- D3 --- */
  {
    code: "D3", name: "Claude Code Configuration & Workflows", short: "Claude Code", weight: 20,
    summary: "CLAUDE.md hierarchy, slash commands and skills, path-scoped rules, plan mode, iterative refinement, CI/CD.",
    intro: "Configuration questions with a team behind them: why one engineer gets different behaviour from the same repository, where a shared command belongs, which conventions load for which files, and how Claude Code runs unattended in a pipeline.",
    concepts: [
      { ref: "3.1", title: "CLAUDE.md hierarchy, scope and modular organisation",
        body: "CLAUDE.md is the always-loaded instruction file, and it exists at three levels. Which level you choose decides who gets the instructions.",
        points: [
          "User level, ~/.claude/CLAUDE.md — personal preferences and working style, never shared through version control.",
          "Project level, .claude/CLAUDE.md or a root CLAUDE.md — coding and testing standards, architectural decisions, shared with every contributor.",
          "Directory level, a CLAUDE.md inside a subdirectory — conventions for that part of the codebase only.",
          "@path imports keep it modular: @./standards/coding-style.md. No space after the @, relative paths resolve against the file containing the import, and imports nest at most five deep.",
          "The .claude/rules/ directory is the alternative to one monolithic file: testing.md, api-conventions.md, deployment.md.",
          "/memory opens CLAUDE.md for editing so notes and conventions persist between sessions."
        ],
        exam: "The recurring scenario: a new team member does not get the project's instructions because the conventions were written into ~/.claude/CLAUDE.md instead of the project file. User level is invisible to everyone else." },

      { ref: "3.2", title: "Custom slash commands and skills",
        body: "Slash commands are reusable prompt templates invoked as /name. Their location decides who has them; their frontmatter decides how they run.",
        points: [
          "Project commands live in .claude/commands/ (or .claude/skills/) and arrive with the repository — the whole team gets /review by cloning.",
          "User commands live in ~/.claude/commands/ or ~/.claude/skills/ and stay personal.",
          "A skill is a directory with SKILL.md and frontmatter: context: fork, allowed-tools, argument-hint.",
          "context: fork runs the skill in an isolated subagent so its verbose output never pollutes the main session.",
          "allowed-tools restricts what the skill may touch; argument-hint prompts for a required parameter when it is invoked bare.",
          "Use a skill for on-demand work (review, analysis, generation) and CLAUDE.md for standards that should always be loaded.",
          "Personal variants of a team skill belong in ~/.claude/skills/ under a different name, so teammates are unaffected."
        ],
        code: { label: "SKILL.md frontmatter", text:
"---\ncontext: fork\nallowed-tools: [\"Read\", \"Grep\", \"Glob\"]\nargument-hint: \"Path to the directory to analyze\"\n---\n\nAnalyze the code structure in the specified directory.\nReport dependencies and architectural patterns." } },

      { ref: "3.3", title: "Path-specific rules for conditional convention loading",
        body: "A rule file in .claude/rules/ can declare which files it applies to, and it only loads when one of them is being edited.",
        points: [
          "YAML frontmatter carries a paths array of glob patterns: paths: [\"src/api/**/*\"].",
          "The rule loads only when Claude Code touches a matching file, which saves context and tokens on every other task.",
          "Glob patterns apply a convention by file type regardless of location — **/*.test.tsx reaches tests co-located throughout the codebase.",
          "Prefer path-scoped rules over directory-level CLAUDE.md when a convention spans many directories; prefer directory-level CLAUDE.md when it is genuinely local to one."
        ],
        code: { label: "A path-scoped rule", text:
"---\npaths: [\"**/*.test.tsx\", \"**/*.test.ts\"]\n---\n\nTests must use describe/it blocks.\nUse data factories instead of hardcoded fixtures.\nDo not mock the database — use the test database." } },

      { ref: "3.4", title: "Plan mode vs direct execution",
        body: "Plan mode investigates and proposes; it does not change anything until you approve. Direct execution goes straight at the change.",
        points: [
          "Plan mode reads with Read, Grep and Glob, then produces an implementation plan for approval — safe exploration with no side effects.",
          "Use it for large changes, several plausible approaches, architectural decisions, an unfamiliar codebase, or a migration touching dozens of files.",
          "Use direct execution for a single-file fix with a clear stack trace, or one well-understood addition such as a validation check.",
          "The combined pattern is the common answer: plan for discovery, approve, then execute the approved plan.",
          "The Explore subagent isolates verbose discovery output and returns a summary, which prevents context exhaustion in multi-phase work."
        ] },

      { ref: "3.5", title: "Iterative refinement",
        body: "Getting to the right output is a conversation. What you feed back, and how you group it, decides how fast it converges.",
        points: [
          "Two or three concrete input/output examples communicate a transformation better than any amount of description.",
          "Test-driven iteration: write the test set — expected behaviour, edge cases, performance requirements — before the implementation, then iterate on failures.",
          "The interview pattern: have Claude ask clarifying questions first, which surfaces non-obvious design decisions (cache invalidation strategy, behaviour when the cache is down, per-user or global).",
          "Group interdependent issues into a single message; send independent ones sequentially."
        ] },

      { ref: "3.6", title: "Integrating Claude Code into CI/CD",
        body: "In a pipeline nobody is at the keyboard, so the invocation, the output format and the reviewing instance all have to change.",
        points: [
          "-p (or --print) is non-interactive mode: it processes the prompt, prints to stdout and exits. Without it the job hangs waiting for input.",
          "--output-format json with --json-schema gives a parseable result you can turn into inline PR comments.",
          "CLAUDE.md supplies the CI run with the project's testing standards, review criteria and available fixtures — which is why test generation quality depends on it.",
          "Session context isolation: the session that wrote the code is a poor reviewer of it, because it keeps its own reasoning and rarely challenges its decisions. Review from an independent instance.",
          "On a re-review after new commits, include the previous review results and ask for only new or unresolved issues, so the PR is not flooded with duplicates.",
          "Include existing test files in context when generating tests, to avoid duplication and keep style consistent."
        ],
        code: { label: "In the pipeline", text:
"claude -p \"Review this pull request for security issues\" \\\n  --output-format json \\\n  --json-schema '{\"type\":\"object\", ...}'" } }
    ],
    questions: [
      { d: "standard", text: "You want a /review command for your team's standard code review, available to everyone who clones the repository. Where does the command file go?",
        opts: [
          ".claude/commands/ in the project repository",
          "~/.claude/commands/",
          "A section in the root CLAUDE.md",
          ".claude/config.json"
        ], correct: 0,
        why: "Project commands in .claude/commands/ are version-controlled and available to everyone on clone. The home directory is the personal scope, CLAUDE.md holds instructions rather than command definitions, and .claude/config.json is not a thing." },

      { d: "challenging", text: "You need to restructure a monolith into microservices: dozens of files, and the service boundaries are still an open question. What approach fits?",
        opts: [
          "Plan mode — explore the codebase, map dependencies and design an approach for approval before any change",
          "Direct execution, working incrementally one file at a time",
          "Direct execution with a very detailed up-front instruction describing the target structure",
          "Direct execution, switching to plan mode if it turns out to be harder than expected"
        ], correct: 0,
        why: "Plan mode exists for exactly this shape: large changes, several viable approaches and architectural decisions. Incremental direct execution risks expensive rework, a detailed instruction assumes you already know the structure you are trying to discover, and switching only once it hurts is reactive." },

      { d: "challenging", text: "A codebase mixes React, API and database conventions, and tests are co-located next to the code they cover. You want the right conventions applied automatically as files are edited. What do you configure?",
        opts: [
          "One root CLAUDE.md describing all three sets of conventions",
          ".claude/rules/ files with YAML frontmatter paths globs such as [\"**/*.test.tsx\"]",
          "A skill per convention in .claude/skills/",
          "A directory-level CLAUDE.md in every directory"
        ], correct: 1,
        why: "Path-scoped rules load only when a matching file is edited, so conventions follow file type regardless of location — the right fit for tests scattered through the tree. A root file relies on the model inferring which section applies, skills are on-demand rather than automatic, and per-directory files do not scale when the relevant files are everywhere." },

      { d: "standard", text: "A CI job runs `claude \"Analyze this pull request for security issues\"` and hangs until the runner times out. What is the fix?",
        opts: [
          "Set CLAUDE_HEADLESS=true in the job environment",
          "Redirect stdin from /dev/null",
          "Use the -p flag: claude -p \"Analyze this pull request for security issues\"",
          "Add the --batch flag so the run is queued rather than interactive"
        ], correct: 2,
        why: "-p (--print) is the documented non-interactive mode: it processes the prompt, writes to stdout and exits. The environment variable and --batch do not exist, and redirecting stdin is a shell workaround for a flag that already exists." },

      { d: "standard", text: "A new engineer reports that Claude Code ignores the team's testing conventions, while everyone else's setup follows them. The conventions were written months ago by the tech lead. What is the most likely cause?",
        opts: [
          "The conventions are in the tech lead's ~/.claude/CLAUDE.md instead of the project's CLAUDE.md",
          "The new engineer is running an older version of Claude Code",
          "The conventions exceed the context window and are being truncated",
          "The new engineer needs to run /memory before the project file loads"
        ], correct: 0,
        why: "User-level CLAUDE.md applies to one machine and is never shared through version control, so instructions written there travel with their author rather than the repository. Team conventions belong in .claude/CLAUDE.md or a root CLAUDE.md." },

      { d: "challenging", text: "In your CI pipeline, the same Claude Code session generates a feature and then reviews its own diff. Reviews are consistently shallow and rarely challenge the design. What change addresses the cause?",
        opts: [
          "Ask for the review a second time in the same session to encourage a deeper pass",
          "Run the review from an independent Claude Code instance that has no generation context",
          "Raise the model tier only for the review step",
          "Lower the temperature for the review request"
        ], correct: 1,
        why: "A session that produced the code retains its own reasoning and is unlikely to challenge its decisions. An independent instance reviews the diff on its merits — the same reason multi-pass review architectures separate the generator from the reviewer." }
    ]
  },

  /* ---------------------------------------------------------------- D4 --- */
  {
    code: "D4", name: "Prompt Engineering & Structured Output", short: "Prompting & output", weight: 20,
    summary: "Explicit criteria, few-shot prompting, JSON schemas via tool_use, validation and retries, batching, multi-pass review.",
    intro: "Making output reliable enough for a machine to consume. The recurring move is to replace a vague instruction with something concrete: explicit criteria instead of \"be conservative\", examples instead of adjectives, a schema instead of a request for JSON.",
    concepts: [
      { ref: "4.1", title: "Prompts with explicit criteria",
        body: "Vague guidance is interpreted differently on every call. Explicit criteria, ideally with examples, produce the same decision every time.",
        points: [
          "\"Check comments for accuracy\" is vague. \"Flag a comment only if it contradicts the code, references a function or variable that does not exist, or is a TODO for a bug already fixed\" is a criterion.",
          "Say what not to report as well: stylistically outdated wording, minor inaccuracies, missing comments.",
          "\"Be more conservative\" performs worse than concrete categorical rules.",
          "Define severity with an example per level — CRITICAL: a runtime failure for users; HIGH: a security vulnerability; MEDIUM: a logic bug without immediate impact; LOW: code quality.",
          "False positives are contagious: a category with a high false-positive rate undermines trust in the categories that are accurate. Disabling that category temporarily is a legitimate answer."
        ] },

      { ref: "4.2", title: "Few-shot prompting",
        body: "Two to four input/output examples are the most effective way to get consistent, actionable output — more effective than describing the behaviour you want.",
        points: [
          "An instruction like \"be more precise\" admits many readings; an example shows the format and the decision logic unambiguously.",
          "The model generalises the pattern to new cases rather than merely repeating the examples.",
          "Use examples for ambiguous decisions, with the rationale attached: \"get me a manager\" means escalate immediately; \"my order is broken\" means verify the customer, then look up the order.",
          "Use examples to fix the output shape: location, issue, severity, suggested fix.",
          "Use examples to separate acceptable code from real problems, and to show extraction from documents with different structures (inline citation vs bibliography reference).",
          "Few-shot is unusually effective on informal or non-standard units — \"about two handfuls of rice\" becomes an approximate amount with the original text preserved — and it reduces hallucination in extraction."
        ] },

      { ref: "4.3", title: "Structured output with tool_use and JSON schemas",
        body: "Defining the output as a tool with a JSON schema is the most reliable way to get schema-conformant output. It eliminates one class of error and leaves the other untouched.",
        points: [
          "A schema guarantees syntactically valid JSON and the presence of required fields. It does not guarantee the values are right.",
          "Mark a field required only when the information is always present — a required field pushes the model to fabricate a value when the source is silent.",
          "Use \"type\": [\"string\", \"null\"] for anything that may legitimately be absent, so the model can return null instead of inventing.",
          "Give enums an \"other\" member plus a detail string so data outside your categories is not lost, and an \"unclear\" member so the model can be honest instead of wrong.",
          "Pair the schema with normalisation rules in the prompt: ISO 8601 dates, numeric amount plus currency code, percentages as decimal fractions."
        ],
        code: { label: "Schema design", text:
"{\n  \"type\": \"object\",\n  \"properties\": {\n    \"category\": { \"type\": \"string\",\n      \"enum\": [\"bug\", \"feature\", \"docs\", \"unclear\", \"other\"] },\n    \"category_detail\": { \"type\": [\"string\", \"null\"] },\n    \"severity\": { \"type\": \"string\",\n      \"enum\": [\"critical\", \"high\", \"medium\", \"low\"] },\n    \"confidence\": { \"type\": \"number\", \"minimum\": 0, \"maximum\": 1 }\n  },\n  \"required\": [\"category\", \"severity\"]\n}" },
        exam: "Know the split cold: syntax errors are solved by tool_use with a schema; semantic errors — a total that does not reconcile, a value in the wrong field — are solved by validation, retry with feedback and self-correction." },

      { ref: "4.4", title: "Validation, retries and feedback loops",
        body: "Validate everything the model returns before anything downstream sees it, and when validation fails, retry with the specific error rather than the same prompt.",
        points: [
          "The retry prompt carries three things: the original document, the previous incorrect extraction, and the concrete validation error (\"total = 150 but the line items sum to 145\").",
          "Retry works on format errors, misplaced fields and arithmetic inconsistencies the model can re-check.",
          "Retry does not work when the information is simply absent from the source, or lives in a document that was never provided — no number of attempts creates missing data.",
          "Validate structurally (types, required fields, enums) and semantically (custom rules: items sum to the total, start_date before end_date). Pydantic models can generate the JSON Schema for tool_use, keeping one source of truth.",
          "Self-correction: have the model extract both stated_total and calculated_total and set conflict_detected when they disagree.",
          "Record the detected_pattern that triggered each finding, so false positives can be analysed by pattern rather than case by case."
        ] },

      { ref: "4.5", title: "Batch processing strategies",
        body: "The Message Batches API trades latency for cost. Whether that trade is allowed depends entirely on whether anyone is waiting.",
        points: [
          "50% cheaper than synchronous calls, a processing window of up to 24 hours, and no latency SLA.",
          "Multi-turn tool calling is not supported within a batch request — one request, one response.",
          "custom_id correlates a response with its request, so a partial failure is resubmitted for just the failed items.",
          "Synchronous for anything blocking: a pre-merge check, an interactive review. Batch for overnight reports, weekly audits and bulk document processing.",
          "SLA arithmetic is tested: a 30-hour deadline against a 24-hour window leaves a 6-hour submission window; for frequent work, submit on a 4-hour cadence.",
          "Iterate on the prompt against a sample before committing a large batch."
        ] },

      { ref: "4.6", title: "Multi-instance and multi-pass review",
        body: "Two structural limits on review quality: a model reviewing its own work, and a model reviewing too much at once.",
        points: [
          "Self-review is weak because the model retains its reasoning context and is unlikely to challenge its own decisions — use a second, independent instance with no generation context.",
          "Attention dilutes across a large single pass: deep comments on some files, shallow on others, and the same pattern flagged in one file and approved in another.",
          "The fix is per-file local passes plus a separate cross-file integration pass for dataflow, type consistency and circular dependencies.",
          "A larger context window does not fix attention quality — that is a distractor, not a solution.",
          "A verification pass with self-rated confidence can route reviews, as long as the confidence is calibrated rather than trusted raw."
        ] }
    ],
    questions: [
      { d: "challenging", text: "A manager proposes moving two workflows to the Message Batches API for the 50% saving: a blocking pre-merge check developers wait on, and an overnight tech-debt report read each morning. How do you evaluate it?",
        opts: [
          "Move both and poll for completion",
          "Use batch only for the tech-debt report; keep the pre-merge check synchronous",
          "Keep both synchronous to avoid ordering problems in batch results",
          "Move both, with an automatic fallback to synchronous when a batch runs long"
        ], correct: 1,
        why: "Batch processing can take up to 24 hours with no latency guarantee, which is disqualifying for a check a developer is waiting on and ideal for an overnight report. The saving is real but it is paid for in latency, and a fallback does not help a developer already blocked." },

      { d: "challenging", text: "A pull request touching 14 files gets a single-pass review with inconsistent depth, missed obvious bugs, and the same pattern flagged in one file but approved in another. How should the review be restructured?",
        opts: [
          "Analyse each file individually for local issues, then run a separate integration pass for cross-file data flows",
          "Require developers to split large pull requests into batches of three or four files",
          "Move to a model with a larger context window so all 14 files fit comfortably in one pass",
          "Run three independent full-PR passes and report only issues found in at least two of them"
        ], correct: 0,
        why: "The root cause is attention dilution across too much material at once. Per-file passes give consistent depth and the integration pass catches what only appears between files. Splitting the PR moves the burden to developers, a larger window does not improve attention quality, and consensus voting suppresses real bugs found once." },

      { d: "standard", text: "An extraction pipeline keeps breaking on malformed JSON: missing braces, trailing commas, an occasional friendly preamble. What is the most reliable fix?",
        opts: [
          "Instruct the model in the system prompt to return JSON only",
          "Define the output as a tool with a JSON schema and read the result from the tool_use block",
          "Post-process the response with a regular expression that extracts the JSON substring",
          "Lower the temperature to zero"
        ], correct: 1,
        why: "tool_use with a JSON schema eliminates syntax errors at the source and enforces the structure. An instruction is not a guarantee, regex repair treats the symptom, and temperature does not govern output format. Note that the schema still does not guarantee the values are semantically correct." },

      { d: "challenging", text: "An extraction schema marks every field required. In production the model fabricates plausible values for fields that are genuinely absent from the source documents. What is the correct schema change?",
        opts: [
          "Keep the fields required and add a prompt instruction never to guess",
          "Make the fields that may be absent nullable — \"type\": [\"string\", \"null\"] — and require only what is always present",
          "Remove the schema and parse the model's prose answer instead",
          "Add a confidence score to each field and discard anything below a threshold"
        ], correct: 1,
        why: "A required field pushes the model to produce something rather than violate the schema. Nullable types give it a legitimate way to report absence. A confidence score is useful for routing but does not stop the fabrication, and dropping the schema loses the syntactic guarantee." },

      { d: "standard", text: "Validation fails because an invoice's stated total does not match the sum of its line items. In which situation will a retry with error feedback NOT help?",
        opts: [
          "The date was extracted as 03/04/2024 instead of ISO 8601",
          "A value was placed in the wrong field of the schema",
          "The figure needed to reconcile the total is in a separate appendix document that was never provided",
          "The line items were summed incorrectly by the model"
        ], correct: 2,
        why: "Retry with concrete feedback fixes format errors, misplaced fields and arithmetic the model can re-check. It cannot create information that is not in the source — when the required context lives in a document that was never supplied, the pipeline needs that document, not another attempt." },

      { d: "standard", text: "An automated review flags stylistically outdated comments alongside genuine contradictions, and developers have started ignoring the tool. Which change most improves trust?",
        opts: [
          "Add \"be conservative and report only high-confidence findings\" to the prompt",
          "Replace the vague instruction with explicit criteria stating exactly what to flag and what to ignore",
          "Reduce the number of files reviewed per run",
          "Ask the model to rate its own confidence and suppress anything below 8/10"
        ], correct: 1,
        why: "Concrete categorical criteria — flag a comment only when it contradicts the code, references something non-existent, or is a TODO for a fixed bug; do not flag stylistic staleness — outperform conservatism adjectives. High false positives in one category erode trust in every category, so the fix has to be at the criteria." }
    ]
  },

  /* ---------------------------------------------------------------- D5 --- */
  {
    code: "D5", name: "Context Management & Reliability", short: "Context & reliability", weight: 15,
    summary: "Conversation context, escalation, error propagation, large-codebase investigation, confidence calibration, provenance.",
    intro: "The smallest domain and the one that decides whether a system survives contact with production: what survives summarisation, when a human is pulled in, what a failing subagent tells the coordinator, and whether a claim can still be traced to its source at the end of the pipeline.",
    concepts: [
      { ref: "5.1", title: "Managing conversation context",
        body: "Everything competes for the same window — the system prompt, the full history, tool definitions and every tool result — and what degrades first is exactly what you need.",
        points: [
          "Progressive summarisation condenses numbers, percentages and dates into \"about\" and \"roughly\". Transactional facts must not live only in the summarised history.",
          "Keep a case-facts block — customer ID, order ID, date, amount, issue, request, status — rebuilt into every prompt regardless of how the history was compressed.",
          "Lost in the middle: the start and end of a long input are processed reliably, the middle is not. Put key findings at the top and action items at the end.",
          "Tool results accumulate out of proportion to their value — a tool returning 40 fields when 5 matter wastes most of the window. Trim them, ideally in a PostToolUse hook.",
          "Require subagents to return metadata (dates, sources) inside structured output, rather than hoping it survives the prose."
        ] },

      { ref: "5.2", title: "Escalation patterns and ambiguity resolution",
        body: "Escalation needs explicit criteria. The tempting proxies for \"this case is hard\" are the ones the exam marks wrong.",
        points: [
          "Escalate immediately, with no further investigation, when the customer explicitly asks for a human.",
          "Escalate when policy is silent or ambiguous for the request — competitor price matching when the policy only covers your own site.",
          "Escalate after a reasonable number of attempts when the agent cannot make progress, and above a financial threshold (enforced by a hook, not a prompt).",
          "Multiple customer matches means asking for another identifier — never guessing heuristically.",
          "Unreliable triggers: sentiment analysis (mood is not complexity), the model's self-rated confidence (it can be confidently wrong), and a trained classifier (overengineering, and it needs data you may not have).",
          "The nuanced pattern: acknowledge the frustration, offer a concrete resolution, and escalate only if the customer reiterates. A first expression of dissatisfaction is not a request for a manager."
        ] },

      { ref: "5.3", title: "Error propagation in multi-agent systems",
        body: "What a failing subagent reports determines whether the coordinator can recover or is left guessing.",
        points: [
          "Return structured error context: failure type, the query attempted, any partial results, alternative approaches, and the coverage impact.",
          "Distinguish an access failure from a valid empty result — a timeout needs a retry decision, \"no matches\" does not.",
          "Anti-patterns: a generic \"search unavailable\" status, silent suppression that returns an empty result as success, aborting the whole workflow on one failure, and infinite retries inside a subagent.",
          "Recover locally for transient failures (one or two attempts), then propagate what remains along with the partial results.",
          "Annotate coverage in the final synthesis — mark a section FULL COVERAGE or PARTIAL COVERAGE with the reason — instead of presenting a gap as a complete answer."
        ],
        code: { label: "A subagent error the coordinator can act on", text:
"{\n  \"status\": \"partial_failure\",\n  \"failure_type\": \"timeout\",\n  \"attempted_query\": \"AI impact on music industry 2024\",\n  \"partial_results\": [\n    {\"title\": \"AI Music Generation Report\", \"relevance\": 0.8}\n  ],\n  \"alternative_approaches\": [\n    \"Narrower query: 'AI music composition tools'\",\n    \"Use an alternative data source\"\n  ],\n  \"coverage_impact\": \"Not covered: AI in music production\"\n}" } },

      { ref: "5.4", title: "Context in large codebase exploration",
        body: "Long investigations degrade in a recognisable way: the agent starts answering about typical patterns instead of your specific classes.",
        points: [
          "Delegate discovery to a subagent: it reads fifteen files and returns one line, and the main agent keeps its window for coordination.",
          "Give each subagent a constrained context budget — the specific task, the necessary data, a restricted allowedTools set — and require structured results rather than raw dumps.",
          "Write key findings to a scratchpad file so they survive a context boundary or a new session.",
          "Summarise before spawning the next phase, so the next subagent starts from conclusions rather than transcripts.",
          "/compact compresses the history when the window fills, at the cost of exact figures and dates — the same risk as any summarisation.",
          "Persist structured state per agent, with a manifest of what completed, so a crashed run resumes instead of restarting."
        ] },

      { ref: "5.5", title: "Human oversight and confidence calibration",
        body: "An aggregate accuracy number is the easiest metric to report and the easiest one to be misled by.",
        points: [
          "97% overall accuracy can hide 40% error on one document type or one field. Analyse by document type and by field, not only in aggregate.",
          "Stratified random sampling audits even high-confidence extractions, which is how new error patterns are found before they scale.",
          "Field-level confidence scores are only useful once calibrated against a labelled validation set.",
          "Route low-confidence extractions and ambiguous sources to human review; automate only where accuracy has been shown to be stable for that segment."
        ] },

      { ref: "5.6", title: "Provenance and multi-source synthesis",
        body: "Summarisation is where the link between a claim and its source is lost, and it is lost silently.",
        points: [
          "Require subagents to emit claim → source mappings: the claim, source URL, source name, publication date and confidence.",
          "Preserve those mappings through aggregation — that is the step that usually drops them.",
          "When two credible sources disagree, keep both values with attribution and annotate the conflict. Do not pick one, and do not bury it in a footnote.",
          "Reconciliation is the coordinator's decision, not the analysis agent's — the analysis agent completes its work and passes the conflict up.",
          "Include dates, or a year-on-year change reads as a contradiction: \"source A (2023) 10%, source B (2024) 15%\" is growth, not a dispute.",
          "Render by content type: financial data as tables, news and analysis as prose, technical findings as structured lists, time series in chronological order."
        ] }
    ],
    questions: [
      { d: "challenging", text: "A document-analysis subagent finds two credible sources with directly contradictory figures for a key metric: a government report says 40% growth, an industry analysis says 12%. What should it do?",
        opts: [
          "Apply credibility heuristics, continue with the more likely figure and add a footnote about the discrepancy",
          "Include both figures in the output without marking them as conflicting, and let the synthesis agent decide",
          "Stop and escalate to the coordinator to decide which source is authoritative before continuing",
          "Complete the analysis with both values, explicitly annotate the conflict with source attribution, and let the coordinator reconcile before synthesis"
        ], correct: 3,
        why: "This preserves the separation of responsibilities: the analysis agent finishes its own work without blocking, keeps both values with clear attribution, and passes reconciliation to the coordinator, which has the broader context. Picking a value discards evidence, unmarked values invite a silent wrong choice, and blocking stalls the pipeline." },

      { d: "challenging", text: "A web-search subagent times out on a complex topic. Which error-propagation design best enables the coordinator to recover?",
        opts: [
          "Return structured context: failure type, the attempted query, partial results, and alternative approaches",
          "Retry with exponential backoff inside the subagent, then return a generic \"search unavailable\" status",
          "Catch the timeout and return an empty result set marked as a success",
          "Propagate the exception to a top-level handler that terminates the workflow"
        ], correct: 0,
        why: "Structured context lets the coordinator choose between retrying with a modified query, delegating elsewhere and continuing with partial results plus a coverage annotation. A generic status hides everything useful, an empty success is silent suppression, and terminating the workflow discards every other subagent's work." },

      { d: "standard", text: "In a long support conversation, the agent starts referring to the refund amount as \"approximately ninety dollars\" and loses the order date. Summarisation is compressing the history. What is the correct fix?",
        opts: [
          "Disable summarisation and send the entire raw history every turn",
          "Maintain a case-facts block with the exact IDs, dates and amounts, and include it in every prompt regardless of how the history is summarised",
          "Ask the model at the start of each turn to recall the exact figures",
          "Move the conversation to a model with a larger context window"
        ], correct: 1,
        why: "Progressive summarisation is precisely where numbers and dates turn vague. Extracting transactional facts into a structured block that is re-sent every turn makes them immune to compression. A bigger window postpones the problem rather than solving it." },

      { d: "standard", text: "A customer writes: \"This is the third time I've contacted you. Get me a manager.\" What should the agent do?",
        opts: [
          "Attempt to resolve the issue first, escalating only if the attempt fails",
          "Run sentiment analysis to gauge how upset the customer is before deciding",
          "Call escalate_to_human immediately, with a structured handoff summary",
          "Ask a clarifying question about the underlying issue to give the manager more context"
        ], correct: 2,
        why: "An explicit request for a human is an immediate-escalation trigger — no further investigation. The handoff carries the structured summary, since the human sees that rather than the transcript. Sentiment analysis is an unreliable proxy and further questions delay a request the customer has already made three times." },

      { d: "challenging", text: "An extraction system reports 97% overall accuracy, but the finance team keeps finding wrong values in scanned invoices specifically. How do you validate performance before automating further?",
        opts: [
          "Raise the overall accuracy target to 99% and retrain the prompt until it is met",
          "Analyse accuracy by document type and by field, and use stratified random sampling to audit high-confidence extractions",
          "Route every extraction below 97% confidence to human review",
          "Increase the sample size of the existing aggregate evaluation"
        ], correct: 1,
        why: "An aggregate figure can hide a severe error rate on one document type or field — which is exactly what the finance team is seeing. Segmenting by type and field surfaces it, and stratified sampling catches new error patterns even inside the high-confidence band. Uncalibrated confidence thresholds and a larger aggregate sample both keep the same blind spot." },

      { d: "standard", text: "An agent investigating a large unfamiliar codebase starts giving vague answers about \"typical patterns\" instead of the project's actual classes. What is the most effective response?",
        opts: [
          "Delegate discovery to subagents that return summaries, and record key findings in a scratchpad file the main agent can consult",
          "Ask the agent to re-read every file it has already read",
          "Increase max_tokens so answers can be longer and more detailed",
          "Raise the temperature so the agent explores more of the codebase"
        ], correct: 0,
        why: "Vague, generic answers are the signature of context degradation. Delegating verbose discovery to subagents keeps fifteen files' worth of output out of the main window, and a scratchpad preserves findings across context boundaries and sessions. Longer answers and more randomness do not restore the lost specifics." }
    ]
  }
];
