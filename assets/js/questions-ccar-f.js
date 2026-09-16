/* CCAR-F — question bank and mock exams.
   125 items written from the official exam guide's practice set, its domain
   notes and the practical test, re-worked so the bank can be drilled and the
   papers sat cold:

     · every item is tagged with its domain and its difficulty;
     · the correct option sits in each of the four positions 31 or 32 times, and
       is the longest of the four in 32 of the 125 items — chance, not a tell;
     · distractors are the answers the guide's explanations call out as the
       tempting ones, not filler.

   Papers A–D partition the 120 core items: each appears in exactly one of them,
   at the real exam's domain weights (27/18/20/20/15) over 30 items. A and B are
   the standard pair, C and D the harder pair. Paper E is the practical paper —
   it carries the five items from the practical test that the core bank does not
   cover, and fills its remaining 25 slots from the same four scenarios, so it
   is the one paper that repeats questions A–D already ask.

   Loaded before data.js, alongside content-ccar-f.js. */

window.CCARF_BANK = [
  { id: "d4c04", dom: 3, diff: "challenging", scen: "Structured data extraction",
    text: "Your extraction tool is defined and the schema is right, but the model sometimes answers in prose instead of calling the tool. Which change makes the structured path deterministic?",
    opts: [
      "Prefill the assistant turn with the opening of a tool_use block so the model has to continue it.",
      "Add an instruction to the system prompt requiring the extraction tool to be called on every document.",
      "Set tool_choice so the extraction tool must be used, instead of leaving the decision to the model.",
      "Remove every other tool from the request so extraction is the only option available to the model."
    ],
    correct: 2,
    why: "tool_choice is the parameter that forces a tool call rather than suggesting one. Leaving a single tool available still permits a text answer, an instruction is probabilistic, and prefilling does not apply to structured tool blocks." },

  { id: "d5p02", dom: 4, diff: "challenging", scen: "Customer support agent",
    text: "First-contact resolution sits at 55% against a target of 80%. Logs show the agent escalating standard replacements for damaged goods with photo evidence, while handling policy exceptions on its own. What improves the calibration most effectively?",
    opts: [
      "Run sentiment analysis on the customer's messages and escalate automatically once frustration passes a threshold.",
      "Explicit escalation criteria in the system prompt, with few-shot examples of what to escalate and what to resolve.",
      "Have the agent rate its own confidence from one to ten before each reply, routing anything below a threshold to a human.",
      "Train a separate classifier on historical tickets to predict which requests need a human before the agent starts work."
    ],
    correct: 1,
    why: "The agent has no stated boundary between the cases it owns and the cases it does not, so it draws one itself and gets it wrong in both directions. Criteria with worked examples supply that boundary. A self-rated score, a trained classifier and a sentiment threshold all build machinery around the decision without ever stating what the decision is." },

  { id: "d1c02", dom: 0, diff: "challenging", scen: "Multi-agent research system",
    text: "The synthesis agent frequently needs to verify a claim. Today it hands control back to the coordinator, which calls the web-search agent and re-invokes synthesis — two to three extra round trips and 40% more latency. Analysis shows 85% of those checks are simple facts (dates, names, figures) and 15% need real investigation.",
    opts: [
      "Have the web-search agent cache extra context around every source during the initial research, anticipating what synthesis will need.",
      "Give synthesis a narrow verify_fact tool for the simple checks, and keep complex verification routed through the coordinator.",
      "Let the synthesis agent accumulate its verification needs and return them to the coordinator as one batch at the end.",
      "Give the synthesis agent the full web-search toolset so it can resolve any verification itself without a round trip."
    ],
    correct: 1,
    why: "Least privilege applied to the 85% case: a narrow tool removes most of the round trips while the coordinator still mediates anything genuinely complex. Full access dissolves the separation of responsibilities, batching creates blocking dependencies between facts, and speculative caching cannot predict what will be questioned." },

  { id: "d3c12", dom: 2, diff: "challenging", scen: "Claude Code for CI",
    text: "Review-generated test suggestions are useful but roughly 60% duplicate scenarios the existing suite already covers. What most effectively reduces the duplicates?",
    opts: [
      "Put the existing test file in context so Claude can see which scenarios are already covered.",
      "Ask for five suggestions instead of ten, on the basis that the most valuable cases come first.",
      "Post-process the suggestions, dropping any whose description overlaps an existing test name.",
      "Instruct it to propose only edge cases and error conditions rather than success paths."
    ],
    correct: 0,
    why: "Claude cannot avoid duplicating tests it has never seen. Fewer suggestions just means fewer of both kinds, restricting it to edge cases discards valid new coverage, and name overlap is a poor proxy for scenario overlap." },

  { id: "d2s06", dom: 1, diff: "standard", scen: "Agentic AI tools",
    text: "A search tool fails because the query syntax is invalid. What should it return to the agent?",
    opts: [
      "An empty result set, so the agent treats the search as having found nothing and moves on.",
      "A raised exception, so that the failure surfaces in your own logs with a full stack trace attached to it.",
      "A generic \"search unavailable\" string, keeping failure handling uniform across every tool.",
      "A structured error naming the category, whether a retry could help, and what about the input was wrong."
    ],
    correct: 3,
    why: "The agent can only recover from what it can read. A category, a retryable flag and the specific problem let it fix the query; an empty result is a lie, and a generic string or an exception discards the information needed to act." },

  { id: "d2c03", dom: 1, diff: "challenging", scen: "Structured data extraction",
    text: "Your extraction tool's JSON Schema is correct, but around 6% of responses still include a field with the wrong type. You already retry on validation failure. How should the retry be constructed?",
    opts: [
      "Send back the document, the invalid extraction and the specific validation error, and ask for a corrected result.",
      "Re-send the original request unchanged, since the failure is sampling variance and a second attempt usually succeeds.",
      "Re-send with a lower temperature and a stricter instruction to follow the schema exactly this time.",
      "Re-send with the schema repeated in the user turn as well as in the tool definition, to reinforce the contract."
    ],
    correct: 0,
    why: "A repair attempt needs to know what went wrong; the validation error is the whole point. An identical retry relies on luck, and reinforcing the schema addresses a misunderstanding the model did not have." },

  { id: "d5c10", dom: 4, diff: "challenging", scen: "Customer support agent",
    text: "Your team wants to add crash recovery so a long-running agent task can resume after a process restart. What has to be persisted for that to work?",
    opts: [
      "Structured state — the task, what has been completed, and the findings so far — rather than the raw conversation.",
      "The session identifier, so the provider can restore the conversation from its own stored copy.",
      "The full messages array exactly as sent, so the conversation can be replayed from the beginning.",
      "The last assistant response, from which the agent can infer where it had reached and continue."
    ],
    correct: 0,
    why: "Recovery needs a record of progress, not a transcript to replay: replaying re-executes side effects and re-pays for tokens. There is no provider-side copy to restore, and one response does not describe what has already been done." },

  { id: "d4s12", dom: 3, diff: "standard", scen: "Structured data extraction",
    text: "Where should the extraction instructions live relative to the document being extracted from?",
    opts: [
      "Both in the system turn, so the model treats the document with the same authority as the task.",
      "Instructions in the system turn, the document in the user turn, delimited so the two cannot be confused.",
      "Both in the user turn, with the instructions placed immediately after the document so that the model reads them last of all.",
      "Instructions in the system turn and the document prefilled into the assistant turn as context."
    ],
    correct: 1,
    why: "Instructions are configuration and belong in the system turn; the document is data and belongs in the user turn. Delimiting keeps content inside the document from being read as an instruction." },

  { id: "d2c02", dom: 1, diff: "challenging", scen: "Customer support agent",
    text: "get_customer returns every match when searching by name. When there are several, Claude currently picks the one with the most recent order — which is the wrong account 15% of the time. How should you address this?",
    opts: [
      "Score the agent's confidence and let it act above 85%, asking for clarification only below that threshold.",
      "Add few-shot examples showing correct reasoning and tool sequencing when a name lookup returns several accounts.",
      "Have Claude ask for a second identifier — email, phone or order number — before taking any action on an ambiguous match.",
      "Change get_customer to rank the matches internally and return only the single most likely one, so the ambiguity never reaches the model at all."
    ],
    correct: 2,
    why: "The customer knows which account is theirs, and one extra turn is cheap next to a 15% misidentification rate. Ranking inside the tool hides the ambiguity rather than resolving it, and self-rated confidence is unreliable exactly where the accounts look alike." },

  { id: "d2c09", dom: 1, diff: "challenging", scen: "Code generation with Claude Code",
    text: "Your project .mcp.json is committed and correct, but one developer's Claude Code keeps connecting to a stale local instance of the same server. What explains it, and what is the right response?",
    opts: [
      "Server entries are merged by transport rather than by name, so two entries for one server both stay active.",
      "Project configuration needs an explicit priority field to take precedence over a developer's local entry.",
      "The committed project file is only read at first launch, so the developer needs to restart Claude Code before that entry takes effect.",
      "A personal configuration is overriding the project entry for that server; they should remove or repoint their own override."
    ],
    correct: 3,
    why: "Personal configuration takes precedence over project configuration for the same server name — which is the point, since it is what lets a developer point at a local build. Here that override has simply outlived its purpose." },

  { id: "d4c06", dom: 3, diff: "challenging", scen: "Claude Code for CI",
    text: "Severity ratings are inconsistent — a null-pointer risk is \"critical\" in one PR and \"medium\" in another, on comparable code. The prompt asks the model to \"assign an appropriate severity\". What is the most effective change?",
    opts: [
      "Ask the model to justify each rating in prose, so inconsistency becomes visible in review.",
      "Drop severity entirely and report findings as a flat list for developers to prioritise.",
      "Define each severity level by observable criteria and give a worked example of each.",
      "Have every finding rated twice in separate calls and take the higher of the two ratings."
    ],
    correct: 2,
    why: "\"Appropriate\" leaves the scale undefined, so it is re-invented per call. Criteria plus a worked example per level make the ratings reproducible; double-rating measures the inconsistency without removing it, and dropping severity discards useful signal." },

  { id: "d1c09", dom: 0, diff: "challenging", scen: "Customer support agent",
    text: "On complex billing disputes and multi-order returns, satisfaction runs 15% below simple cases even when the resolution is technically right. The agent explains itself inconsistently — sometimes missing policy detail, sometimes timelines, sometimes next steps — and the gap differs case by case. No extra human review is available.",
    opts: [
      "Add a closing confirmation step that asks the customer whether the reply fully resolved their issue.",
      "Route complex cases to a larger model, using a defined complexity metric to decide which ones qualify.",
      "Add few-shot examples showing complete explanations for five common complex cases, with policy context, timelines and next steps.",
      "Add a self-critique stage where the agent checks its draft against explicit completeness criteria before sending it."
    ],
    correct: 3,
    why: "The gaps vary per case, so nothing fixed can enumerate them; an evaluator–optimizer pass checks each draft against the criteria instead. Examples cover the cases you thought of, a bigger model does not make completeness systematic, and asking the customer moves the work onto them." },

  { id: "d5c05", dom: 4, diff: "challenging", scen: "Conversational AI architecture",
    text: "After three months of weekly sessions the history is around 85,000 tokens. A user asks \"what did we conclude about the theme of isolation?\" and gets a generic answer instead of a reference to the earlier discussion. What is the most effective approach?",
    opts: [
      "Index the exchanges as embeddings and retrieve the relevant ones on demand.",
      "A rolling window that keeps the most recent sessions in full and discards the older ones.",
      "Progressive summarisation that captures the key conclusions from each session as it ends.",
      "Structured tags marking conclusions in the history so they can be located when needed."
    ],
    correct: 0,
    why: "At three months of accumulated discussion, retrieval is the only approach that can still surface a specific exchange on demand. Summarisation abstracts away the particular conclusion being asked for, a rolling window has already discarded it, and tagging requires restructuring everything that came before." },

  { id: "d1c08", dom: 0, diff: "challenging", scen: "Multi-agent research system",
    text: "A document analysis subagent fails regularly on PDFs: corrupted sections raise parse exceptions, some files are password-protected, and the parser occasionally hangs on very large ones. Today any exception ends the subagent and returns an error, so the coordinator is constantly deciding whether to retry, skip or fail. What is the right architectural change?",
    opts: [
      "Validate every document in the coordinator before delegation and reject the ones likely to fail parsing.",
      "Have the subagent always return a success status together with partial results, putting the error detail in metadata for the coordinator to inspect afterwards.",
      "Add a dedicated error-handling agent that watches a shared failure queue and sends restart instructions to subagents.",
      "Recover locally in the subagent for transient failures, and escalate only what it cannot resolve, with the steps attempted and any partial results."
    ],
    correct: 3,
    why: "Handle a failure at the lowest level that can actually resolve it, and escalate the rest with enough context to decide. Reporting failure as success hides it, a separate error agent adds a second coordination path, and pre-validating means predicting parser behaviour without parsing." },

  { id: "d3s10", dom: 2, diff: "standard", scen: "Developer productivity tools",
    text: "You are adding wrappers around external API calls across 120 files. Phase one discovers every call site, phase two designs the approach with you, phase three implements it. Phase one alone floods the context window with call sites before discovery finishes. What do you do?",
    opts: [
      "Run everything in the main conversation and use /compact periodically as the context fills up.",
      "Define the pattern in CLAUDE.md and work through the files in batches across several sessions.",
      "Run phase one in an Explore subagent so the verbose discovery stays isolated and only a summary comes back.",
      "Switch to headless mode with --continue, passing an explicit context summary between each of the batched calls in turn."
    ],
    correct: 2,
    why: "Delegating discovery keeps the verbose output out of the main window, which is where the design and implementation phases need their context. Compaction pays for the tokens first, and both batching options fragment the collaborative phase." },

  { id: "d1c14", dom: 0, diff: "challenging", scen: "Agentic AI tools",
    text: "Your agent loop appends the assistant message, then inspects stop_reason. In production it occasionally stops mid-investigation with no error and an incomplete answer. Logs show stop_reason was \"max_tokens\". How should the loop handle that?",
    opts: [
      "Abort the run and surface an error to the caller, on the basis that a truncated turn leaves the conversation in an unusable state.",
      "Retry the identical request unchanged, because max_tokens is a transient condition on the server side.",
      "Treat it like end_turn, since the model produced everything the token budget allowed for that answer.",
      "Treat it as truncation, not completion: the turn was cut off, so continue rather than returning it as a result."
    ],
    correct: 3,
    why: "Only end_turn means the work is finished. max_tokens says the output was cut short, so the loop must handle the truncation — usually by continuing — instead of presenting a partial answer as the result." },

  { id: "d4s03", dom: 3, diff: "standard", scen: "Conversational AI architecture",
    text: "An assistant has to keep an enthusiastic tone, explain its reasoning and ask clarifying questions. Where do those behavioural guidelines belong?",
    opts: [
      "In environment variables read by the application before each request is assembled.",
      "Prepended to every user message, so they stay close to whatever the user just asked.",
      "In the system prompt.",
      "In the first assistant message, so the model has already demonstrated the behaviour once."
    ],
    correct: 2,
    why: "The system prompt is the place for persistent behavioural constraints across a conversation. Repeating them on every user turn is redundant overhead, the model will happily drift from its own earlier message, and environment variables never reach the model at all." },

  { id: "d1s11", dom: 0, diff: "standard", scen: "Customer support agent",
    text: "Company policy says refunds above $500 always need a human. The agent occasionally processes a $700 refund anyway. Which control actually enforces the rule?",
    opts: [
      "A post-hoc audit job that flags refunds above $500 so they can be reversed the following day.",
      "Few-shot examples in the prompt showing large refunds being escalated rather than processed.",
      "A policy section in the system prompt stating the $500 limit and requiring escalation above it.",
      "A pre-call hook that inspects process_refund arguments and redirects anything above the threshold to escalation."
    ],
    correct: 3,
    why: "Financial limits are business rules, and business rules belong in code. Prompt instructions and examples are probabilistic; an audit that reverses the payment afterwards is not prevention." },

  { id: "d5s04", dom: 4, diff: "standard", scen: "Conversational AI architecture",
    text: "A 40-minute cooking session has reached 78,000 tokens, covering allergies, recipe scaling, clarified terminology and general chat. You must cut tokens without losing what matters. What is the best approach?",
    opts: [
      "Summarise the entire conversation history into a single compact narrative.",
      "Keep the most recent 20,000 tokens verbatim and discard everything before them.",
      "Extract the critical facts into a structured block, summarise the general discussion, and keep recent turns verbatim.",
      "Store the full conversation externally and retrieve relevant parts by semantic search."
    ],
    correct: 2,
    why: "The hybrid keeps precision where it is critical, compression where it is not, and verbatim recency for coherence. Whole-conversation summarisation and a rolling window both risk losing an allergy, and external retrieval is heavy machinery for one session." },

  { id: "d2c07", dom: 1, diff: "challenging", scen: "Structured data extraction",
    text: "Extraction must classify a document's sentiment, but some documents genuinely give no basis for a judgement. Today the model picks a category anyway. Which schema change best reflects reality?",
    opts: [
      "Add a confidence score alongside the category and have downstream code discard any classification that falls below a threshold.",
      "Make the field nullable, so the model returns null whenever it cannot classify the document.",
      "Split the field into positive, negative and neutral booleans, so the model can leave all three false.",
      "Add an \"unclear\" enum member so the model can report honestly that the document does not support a classification."
    ],
    correct: 3,
    why: "An explicit \"unclear\" value gives the model a correct answer to choose, which is what stops it guessing. Null conflates \"absent\" with \"undeterminable\", and both the score and the booleans still ask for a judgement first and filter afterwards." },

  { id: "d1c07", dom: 0, diff: "challenging", scen: "Customer support agent",
    text: "When a customer's message contains the word \"account\", the agent calls get_customer first 78% of the time. Phrased without that word, the same request goes to lookup_order first 93% of the time. The tool descriptions are clear and unambiguous. What is the most likely cause?",
    opts: [
      "The model has seen too few multi-concept messages and needs fine-tuning on examples that mix account and order language.",
      "Tool descriptions need explicit negative examples saying when each tool should not be used, to counter the keyword pull.",
      "Keyword-sensitive routing instructions in the system prompt are steering tool choice on the presence of the word.",
      "The model's pretraining associates account vocabulary with customer records strongly enough to override tool descriptions."
    ],
    correct: 2,
    why: "A split that sharp and that systematic is a rule firing, not a tendency. With descriptions already clear, the remaining place a keyword can be wired to a tool is the prompt itself." },

  { id: "d1p01", dom: 0, diff: "standard", scen: "Multi-agent research system",
    text: "The document analysis subagent reaches a PDF it cannot parse. You are designing how that failure is handled. What should the subagent do with it?",
    opts: [
      "Skip the corrupted document silently and carry on with the rest, so the workflow is never interrupted.",
      "Return an error to the coordinator with the context around it, and let the coordinator decide how to proceed.",
      "Retry the parse three times with exponential backoff before reporting the failure upstream at all.",
      "Raise an exception that terminates the whole research workflow, since the input set is incomplete."
    ],
    correct: 1,
    why: "The coordinator is the only part of the system placed to choose between skipping the file, trying another parser and telling the user, and it can only choose if it is told. Silence hides a gap in the evidence, backoff cannot repair a corrupt file, and ending the run throws away everything that succeeded." },

  { id: "d1s02", dom: 0, diff: "standard", scen: "Agentic AI tools",
    text: "Claude has returned a tool_use block, your code has executed the tool, and you now have the result. How is that result added to the conversation before the next request?",
    opts: [
      "As a user-role message whose content is a tool_result block carrying the matching tool_use_id.",
      "As a message with the dedicated \"tool\" role, which the API reserves for tool output.",
      "As an assistant-role message containing a tool_result block, since the tool acted on Claude's behalf.",
      "As an extra field on the original assistant message, so the request and its result stay together."
    ],
    correct: 0,
    why: "The Messages API has only user and assistant roles. Tool output comes back as a user-role message containing tool_result blocks, each referencing the tool_use_id it answers." },

  { id: "d1s12", dom: 0, diff: "standard", scen: "Structured data extraction",
    text: "An invoice pipeline runs the same five steps on every document: parse, extract metadata, extract line items, validate, enrich. Output must be reproducible across runs. Which decomposition strategy fits?",
    opts: [
      "A coordinator that picks a subset of the five steps per document based on its first impression.",
      "A fixed pipeline, where each step is defined up front and always runs in the same order.",
      "A single prompt containing all five instructions, letting the model order the work itself.",
      "Dynamic decomposition, so the agent can generate the steps each document actually needs."
    ],
    correct: 1,
    why: "When the steps are known in advance and reproducibility is the point, a fixed chain is the right shape. Adaptive decomposition earns its unpredictability only when the work genuinely varies." },

  { id: "d3c03", dom: 2, diff: "challenging", scen: "Code generation with Claude Code",
    text: "Two or three full endpoint implementations in context noticeably improve consistency when generating new endpoints — but that context is useless when debugging or reviewing in the same directory. Which configuration is most effective?",
    opts: [
      "Referencing the examples by hand in each generation request, pasting the code into the prompt.",
      "Path-specific rules under .claude/rules/api/ that include the examples whenever work happens in the API directory.",
      "A skill that references the examples and the pattern instructions, invoked on demand through its slash command.",
      "The examples and pattern documentation in the project CLAUDE.md so they are always available when needed."
    ],
    correct: 2,
    why: "The distinction here is the task, not the path: the same directory hosts generation, debugging and review. A skill loads when you ask for it; path rules would load the examples for all three, and CLAUDE.md for every session." },

  { id: "d5c03", dom: 4, diff: "challenging", scen: "Multi-agent research system",
    text: "The web-search subagent covers only three of five requested source categories — competitor sites and industry reports succeed, news archives and social feeds time out. Document analysis processed everything it was given. Synthesis must now produce a summary from uneven inputs. Which propagation strategy is best?",
    opts: [
      "Have synthesis return an error to the coordinator so the task is retried or failed on incomplete data.",
      "Have synthesis ask the coordinator to retry the timed-out sources with a longer timeout before it begins.",
      "Proceed with the successful sources and produce a clean summary without noting what was unavailable.",
      "Have synthesis annotate its coverage, marking which conclusions are well supported and where gaps remain because sources were unavailable."
    ],
    correct: 3,
    why: "Graceful degradation with transparency preserves the value of completed work while carrying the uncertainty forward, so whoever reads the report knows what it rests on. Failing the task discards good work, blocking on a retry stalls it, and silence misrepresents partial coverage as complete." },

  { id: "d2s05", dom: 1, diff: "standard", scen: "Code generation with Claude Code",
    text: "Six developers each have their own GitHub token. You want one shared MCP server configuration in the repository without committing any credential. What do you do?",
    opts: [
      "Commit the server with a placeholder token and tell developers to override it in their local configuration.",
      "Have each developer add the server themselves with claude mcp add --scope user and their own token.",
      "Add the server to the project .mcp.json using environment variable substitution for the token, and document the variable.",
      "Write a wrapper MCP server that reads the tokens from a .env file and proxies the GitHub API, then commit that wrapper to the repository."
    ],
    correct: 2,
    why: "A project .mcp.json with ${GITHUB_TOKEN} is one version-controlled source of truth while the secret stays in each developer's environment. Per-user setup drifts, a placeholder is a committed value waiting to be used, and a proxy is a component to maintain for nothing." },

  { id: "d5c06", dom: 4, diff: "challenging", scen: "Structured data extraction",
    text: "Field-level confidence scores are available. How should the human review threshold be set?",
    opts: [
      "Set it at a round number such as 0.9 and then adjust it over time as corrections come back from users downstream.",
      "Calibrate it against a labelled validation set, so the chosen score corresponds to a measured error rate.",
      "Set it where the review queue matches the capacity of the team available to work it.",
      "Set it per document type at the mean confidence the model reports for that type."
    ],
    correct: 1,
    why: "A confidence score is only meaningful once you know what it predicts, which is what a labelled set establishes. Sizing the queue to the team picks a threshold from staffing rather than risk, a round number is arbitrary, and a mean sends half of every type to review by construction." },

  { id: "d1s15", dom: 0, diff: "standard", scen: "Developer productivity tools",
    text: "You have spent an hour with an agent mapping how a legacy billing module works, and now want to compare a Redux and a Context API rewrite without losing that investigation. What do you use?",
    opts: [
      "/compact, followed by asking both questions in the same session, which keeps the whole comparison together in one place.",
      "Two fresh sessions, each given the same summary of the investigation as its opening prompt.",
      "fork_session, which branches two independent lines of work from the shared investigation context.",
      "--resume on the same session twice, so both explorations continue from the saved context."
    ],
    correct: 2,
    why: "fork_session exists precisely for branching from shared context. Resuming the same session twice gives you one interleaved thread, and starting fresh throws the investigation away." },

  { id: "d4s10", dom: 3, diff: "standard", scen: "Customer support agent",
    text: "You want to add few-shot examples to improve tool selection on ambiguous requests like \"I need help with my recent purchase\". Which set of examples helps most?",
    opts: [
      "\"Use when\" and \"do not use when\" notes added to each tool description rather than examples.",
      "Four to six examples drawn from the ambiguous cases, each stating why one tool was chosen over the plausible alternative.",
      "Ten to fifteen examples of clear, unambiguous requests showing correct selection for each tool.",
      "Examples grouped by tool — every get_customer case first, then every lookup_order case."
    ],
    correct: 1,
    why: "Examples should target where the model is uncertain, and the comparison — why this tool and not that one — is what teaches the boundary. Unambiguous cases demonstrate a decision it already makes correctly." },

  { id: "d4s09", dom: 3, diff: "standard", scen: "Structured data extraction",
    text: "A long source document is pasted into the user turn and the model starts drifting from the extraction instructions. What is the standard correction?",
    opts: [
      "Reduce max_tokens so the model has less room to wander away from the instructions.",
      "Move the document into the system prompt so the instructions and the data live together.",
      "Wrap the document in XML tags and restate the task after it as well as in the system turn.",
      "Cut the document down until the model stops drifting, then process the remainder separately."
    ],
    correct: 2,
    why: "Delimiting separates data from instruction, and restating the task after a long input puts it back in a reliably attended position. Instructions belong in the system turn and data in the user turn, not the other way round." },

  { id: "d5c08", dom: 4, diff: "challenging", scen: "Multi-agent research system",
    text: "Two sources report different figures for the same metric, and it turns out one was collected in 2023 and the other in 2025. Your reports have been presenting this as a contradiction. What should change?",
    opts: [
      "Report the range between the two figures, which covers both values without adjudicating between them.",
      "Prefer the most recent source whenever two figures conflict, and drop the older value from the report.",
      "Treat conflicting figures as unreliable and exclude both of them unless some third source agrees with one of the two.",
      "Require collection or publication dates alongside every figure, so a change over time is not read as a disagreement."
    ],
    correct: 3,
    why: "Without dates, a trend is indistinguishable from a contradiction. Dropping the older value discards the trend, excluding both discards the finding, and a range presents movement over time as measurement uncertainty." },

  { id: "d1c10", dom: 0, diff: "challenging", scen: "Claude Code for CI",
    text: "Non-obvious problems in generated code — optimisations that break edge cases, cleanups that change behaviour — are only caught when a human reviews the PR. Claude's own reasoning shows it considered those cases and concluded its approach was fine. What addresses the root cause?",
    opts: [
      "Run a second, independent Claude Code instance over the diff with no access to the generator's reasoning.",
      "Put the full test files and module documentation in context so generation understands the expected behaviour better.",
      "Enable extended thinking during generation so the model deliberates more thoroughly before committing to an approach.",
      "Add self-review instructions to the generation prompt, asking Claude to critique its suggestions before finalising."
    ],
    correct: 0,
    why: "The failure is confirmation bias: the generator already rationalised these cases and will rationalise them again. Only a reviewer that cannot see the reasoning gets the fresh-eyes effect that human peer review provides." },

  { id: "d4s05", dom: 3, diff: "standard", scen: "Structured data extraction",
    text: "You need reliably parseable JSON out of an extraction step, matching a fixed schema. What is the standard mechanism?",
    opts: [
      "Describe the JSON in the system prompt and instruct the model to reply with nothing else.",
      "Define a tool whose input schema is the target JSON Schema and let the model populate it through tool_use.",
      "Request Markdown with one fenced JSON block and extract the block with a regular expression.",
      "Ask for JSON and repair whatever comes back with a tolerant parser before validating it."
    ],
    correct: 1,
    why: "Using tool_use with a JSON Schema constrains the shape at generation time, which is why it is the documented route to structured output. Everything else asks politely and then cleans up." },

  { id: "d3s03", dom: 2, diff: "standard", scen: "Code generation with Claude Code",
    text: "Conventions differ across your codebase — React components, API handlers, database models — and test files sit next to the code they test rather than in one directory. You want the right conventions applied automatically. What do you use?",
    opts: [
      "Rule files under .claude/rules/ with YAML frontmatter declaring glob patterns for the paths each rule covers.",
      "One root CLAUDE.md with a section per area, relying on Claude to infer which section applies.",
      "A skill per code type under .claude/skills/, each embedding the conventions for that type.",
      "A CLAUDE.md in every subdirectory, each holding the conventions for the code beneath it."
    ],
    correct: 0,
    why: "Path-scoped rules match on the file being touched, which is exactly what you need when the relevant files are scattered. Nested CLAUDE.md files do not help when tests sit beside dozens of different areas, inference is unreliable, and skills load on demand rather than automatically." },

  { id: "d2s04", dom: 1, diff: "standard", scen: "Agentic AI tools",
    text: "Which of these is a Model Context Protocol resource rather than a tool?",
    opts: [
      "A database schema the agent can read for context.",
      "A hook that fires after a tool returns and rewrites its output.",
      "A saved prompt template for a recurring analysis task.",
      "A function that inserts a row into that database."
    ],
    correct: 0,
    why: "MCP exposes tools (functions the agent calls to act), resources (data it reads for context) and prompts (reusable templates). A schema is data to read, so it is a resource; hooks belong to the Agent SDK, not MCP." },

  { id: "d3c04", dom: 2, diff: "challenging", scen: "Code generation with Claude Code",
    text: "An /explore-alternatives skill helps the team weigh implementation options. Developers report that afterwards Claude keeps referring back to rejected approaches and carrying exploration context into the actual implementation. How do you configure it?",
    opts: [
      "Add context: fork to the skill's frontmatter.",
      "Split it into /explore-start and /explore-end to mark where exploration context should be discarded.",
      "Use the shell prefix inside the skill so the exploration runs as a subprocess outside the conversation.",
      "Move the skill to ~/.claude/skills/ so its context is kept separate from the project session."
    ],
    correct: 0,
    why: "context: fork runs the skill in an isolated context, so the brainstorming never enters the main conversation history. Boundary markers do not remove what has already been added, and where a skill lives has no bearing on which context it uses." },

  { id: "d3c11", dom: 2, diff: "challenging", scen: "Claude Code for CI",
    text: "The first review round posts 12 findings. A developer pushes fixes, the review re-runs and posts 8 — five of which repeat comments on code that has since been fixed. How do you remove the redundancy without weakening the review?",
    opts: [
      "Add a post-processing filter that drops any finding matching an earlier one by file path and issue description before it is posted.",
      "Review only at PR creation and immediately before merge, skipping the intermediate commits.",
      "Put the previous findings in context and instruct Claude to report only new or still-unresolved issues.",
      "Limit the review to files changed in the most recent push, leaving earlier commits out of scope."
    ],
    correct: 2,
    why: "Deciding whether a finding still applies is a judgement about the current code, which is what Claude is for — but only if it can see what was already reported. String matching cannot tell a fixed issue from a recurring one, and both scope reductions trade thoroughness for quiet." },

  { id: "d2s07", dom: 1, diff: "standard", scen: "Structured data extraction",
    text: "An extraction schema marks customer_email as required. Many source documents genuinely have no email address. What happens, and what should you do?",
    opts: [
      "The field comes back as an empty string; add post-processing that converts empty strings to null.",
      "The model invents plausible addresses to satisfy the schema; mark the field optional or nullable instead.",
      "Extraction fails validation on exactly those documents; add a retry loop that re-runs them with a longer and more explicit prompt.",
      "The document is skipped entirely; add a pre-filter that routes documents without an email elsewhere."
    ],
    correct: 1,
    why: "Marking a field required tells the model the value is always present, so it supplies one. Required is for information that genuinely always exists; anything else is optional, or typed to allow null." },

  { id: "d4s01", dom: 3, diff: "standard", scen: "Claude Code for CI",
    text: "Your review prompt says \"check that comments are accurate and up to date\". Findings flag harmless TODO markers and plain descriptions, while missing comments that describe behaviour the code no longer has. What addresses the root cause?",
    opts: [
      "Replace the vague instruction with explicit criteria: flag a comment only where its claim contradicts what the code does.",
      "Strip TODO, FIXME and purely descriptive comments before analysis to cut the noise at source.",
      "Add few-shot examples of misleading comments so the model recognises the same shape elsewhere.",
      "Supply git blame data so the model can spot comments that predate the code around them."
    ],
    correct: 0,
    why: "\"Accurate and up to date\" is not a definition, so the model supplies its own and it drifts. A precise criterion fixes both failure directions at once; examples and pre-filtering work around a specification you have not written." },

  { id: "d4c08", dom: 3, diff: "challenging", scen: "Structured data extraction",
    text: "Informal quantities appear across your documents — \"a couple of boxes\", \"half a pallet\", \"approx. 3 tonnes\". The schema wants a number and a unit. Extraction currently guesses or leaves the field blank inconsistently. What is the best approach?",
    opts: [
      "Extract the raw phrase into a string field and parse it into a number in downstream code.",
      "Add an instruction to convert informal quantities into their most likely numeric equivalent.",
      "Add examples covering the informal forms, and extend the schema with a field recording that the value was approximate.",
      "Mark the quantity field nullable and drop anything not expressed as an explicit number."
    ],
    correct: 2,
    why: "Examples teach the conversion and the extra field keeps the fact that it was a conversion, so downstream code can treat it differently. Instructing a guess loses that provenance, dropping the values loses data, and parsing prose downstream moves the ambiguity rather than resolving it." },

  { id: "d3c01", dom: 2, diff: "challenging", scen: "Code generation with Claude Code",
    text: "CLAUDE.md has grown past 400 lines: coding standards, testing conventions, a PR review checklist, deployment instructions and migration procedures. Standards and testing conventions must always apply; the other three only during those tasks. How do you restructure it?",
    opts: [
      "Keep the universal standards in CLAUDE.md and move review, deployment and migrations into skills with trigger keywords.",
      "Move everything into skills organised by workflow, leaving CLAUDE.md as a short project description.",
      "Keep everything in CLAUDE.md but use import syntax to split it into separately maintained files by category.",
      "Split the whole file into .claude/rules/ entries with glob patterns, so that each part loads only for the file types it actually covers."
    ],
    correct: 0,
    why: "CLAUDE.md loads every session, which is what \"always applies\" requires; skills load when their trigger appears, which is what the other three need. Path globs key off files rather than tasks, moving everything out loses the always-on guarantee, and imports reorganise the file without changing when it loads." },

  { id: "d3s09", dom: 2, diff: "standard", scen: "Claude Code for CI",
    text: "CI reviews are substantive, but findings come back as prose paragraphs that somebody has to copy into pull request comments by hand. You want each finding posted inline, which needs a file path, line number, severity and suggested fix. What is the most effective approach?",
    opts: [
      "Run the CLI with --output-format json and --json-schema, then parse the result and post the comments through the API.",
      "Keep the prose review and add a second call that turns it into a JSON summary of the findings.",
      "Add an output-format section to CLAUDE.md with examples of the structured findings you expect.",
      "Put a parseable template in the review prompt, such as [FILE:path] [LINE:n] [SEVERITY:level]."
    ],
    correct: 0,
    why: "The CLI has flags for exactly this, and they constrain the output rather than requesting it. Project context and prompt templates produce mostly-valid output, and a second summarisation pass adds a call and a new place to lose detail." },

  { id: "d2c06", dom: 1, diff: "challenging", scen: "Customer support agent",
    text: "process_refund currently takes (customer_id, order_id, amount, reason, notify_customer, refund_method, partial, currency, approver_id, idempotency_key). Agents frequently supply wrong or contradictory combinations. What is the best redesign?",
    opts: [
      "Mark most of the parameters optional with documented defaults, so that a typical call only needs customer_id, order_id and amount.",
      "Add a validation layer that rejects invalid combinations and returns an error explaining the correct usage.",
      "Split it into the few narrow operations the workflow actually performs, each with the minimum arguments that operation needs.",
      "Keep the signature and add an extensive description explaining every valid combination of parameters."
    ],
    correct: 2,
    why: "One tool per job with a small argument list is the principle; ten parameters means several jobs wearing one name. Optional parameters and documentation leave the combinatorics in place, and validation only reports the confusion after the fact." },

  { id: "d4s11", dom: 3, diff: "standard", scen: "Claude Code for CI",
    text: "You need an automated reviewer to distinguish acceptable patterns from genuine problems in code it has never seen. Which prompting approach is most effective?",
    opts: [
      "Examples of problematic code only, so the model learns the shape of a real finding.",
      "Examples of both: code that looks suspicious but is acceptable, next to code that is genuinely problematic.",
      "A severity scale, so the model can rate everything and you filter the low scores out.",
      "A rule list describing the problematic patterns in prose, kept current as new ones appear."
    ],
    correct: 1,
    why: "A boundary needs both sides. Showing only violations teaches the model what a problem looks like but not where acceptable practice ends, which is where the false positives come from." },

  { id: "d5c04", dom: 4, diff: "challenging", scen: "Multi-agent research system",
    text: "A subagent queries three source categories: academic databases return 15 papers, industry reports return \"0 results\", patent databases return \"Connection timeout\". Which error-propagation design supports the best recovery decisions?",
    opts: [
      "Report both the timeout and the zero results as failures needing a coordinator decision.",
      "Report the access failure and the empty result as distinct outcomes, since only one of them warrants a retry.",
      "Retry transient failures inside the subagent and report only errors that persist after retries.",
      "Aggregate the three outcomes into a single coverage percentage, with the detailed per-source logs available on request."
    ],
    correct: 1,
    why: "\"No patents exist\" is a finding; \"we could not reach the patent database\" is an outage. Collapsing them either sends the coordinator chasing a result that is already complete or hides a failure inside a percentage." },

  { id: "d3s05", dom: 2, diff: "standard", scen: "Code generation with Claude Code",
    text: "Three developers report that Claude follows the guidance \"always include comprehensive error handling\". A fourth, who joined last week, says it does not. All four work in the same repository with current code. What is the cause and the fix?",
    opts: [
      "Claude Code adapts to each developer over time; the new joiner needs to restate the requirement until it holds.",
      "The guidance is in the original developers' user-level CLAUDE.md files; move it to the project-level file.",
      "CLAUDE.md is cached after first read and the original developers are on a stale copy; everyone should clear the cache.",
      "The new developer's user-level CLAUDE.md contains a conflicting instruction; they should remove that section."
    ],
    correct: 1,
    why: "Guidance that only some team members receive was never committed. Project-level configuration is what makes a convention shared, and it reaches every current and future member of the team automatically." },

  { id: "d3p01", dom: 2, diff: "challenging", scen: "Claude Code for CI",
    text: "Two workflows run on synchronous calls: a pre-merge check that blocks the merge until it finishes, and a technical-debt report generated overnight and read the next morning. Your manager proposes moving both to the Message Batches API for the 50% saving. How do you answer?",
    opts: [
      "Move both, and fall back to a synchronous call whenever a batch is taking longer than the pipeline can wait.",
      "Keep both synchronous, because batch results come back in an order the pipeline cannot rely on.",
      "Move both, and poll for batch status so the pipeline knows exactly when each set of results is ready.",
      "Move the technical-debt report to the Batches API and keep the pre-merge check synchronous."
    ],
    correct: 3,
    why: "The Batches API carries no latency guarantee and can take up to 24 hours, which an overnight report absorbs and a developer waiting on a merge does not. A mid-run fallback pays for the same work twice, polling does not shorten the wait, and result ordering is not what rules batching out." },

  { id: "d3s06", dom: 2, diff: "standard", scen: "Code generation with Claude Code",
    text: "A /analyze-codebase skill runs a deep analysis — dependency scanning, coverage counts, quality metrics. Afterwards the session becomes sluggish and Claude loses track of the original task. What do you change, keeping the analysis intact?",
    opts: [
      "Instruct the skill to compress its results into a short summary before it displays anything.",
      "Split it into three smaller skills so each one returns a more manageable amount of output.",
      "Add model: haiku to the frontmatter so the analysis runs on a faster, cheaper model.",
      "Add context: fork to the skill's frontmatter so it runs in an isolated subagent context."
    ],
    correct: 3,
    why: "The analysis output is filling the main context window. context: fork runs it elsewhere and returns only the result, so the main session keeps the task it started with; the other options shrink the output without moving it." },

  { id: "d3s07", dom: 2, diff: "standard", scen: "Code generation with Claude Code",
    text: "The team has a /commit skill at .claude/skills/commit/SKILL.md. One developer wants their own message format and extra checks without affecting anyone else. What do you recommend?",
    opts: [
      "Create ~/.claude/skills/commit/SKILL.md with the same name, which takes precedence for that developer.",
      "Set override: true in the personal skill's frontmatter so it outranks the project version.",
      "Add conditional logic to the project skill's frontmatter that branches on the developer's username.",
      "Create a personal skill under a different name such as /my-commit, leaving the team's shared project skill entirely untouched."
    ],
    correct: 0,
    why: "Personal skills take precedence over project skills with the same name, so the override is the mechanism and the familiar command name survives. A second name works but costs the muscle memory, there is no override flag, and branching on usernames puts personal preferences in the shared repository." },

  { id: "d5s05", dom: 4, diff: "standard", scen: "Conversational AI architecture",
    text: "An assistant keeps only the last 25 message pairs, and users report it losing earlier topics and preferences. What is the most effective solution?",
    opts: [
      "Raise the window to 50 message pairs so more history survives before anything is dropped.",
      "Summarise the dropped messages every turn and prepend the running summary to the request.",
      "Run a vector similarity search over the full history and inject the closest matches each turn.",
      "Summarise the older messages and keep the recent ones verbatim."
    ],
    correct: 3,
    why: "Recent turns need exact text for coherence, and older ones only need their substance retained. Enlarging the window postpones the same loss, similarity search misses context that is relevant without being similar, and re-summarising every turn accumulates its own errors." },

  { id: "d2c08", dom: 1, diff: "challenging", scen: "Agentic AI tools",
    text: "A tool that queries three source categories reports \"0 results\" from industry databases and \"Connection timeout\" from the patent database. What must the tool's return distinguish, and why?",
    opts: [
      "A transient from a permanent failure, so only the transient ones are retried automatically inside the tool.",
      "An access failure from a valid empty result — one needs a retry decision, the other is a finding.",
      "A query error from a data error, so the coordinator knows whether to fix the query or accept the answer.",
      "A partial success from a total failure, so the coordinator knows whether any category returned data at all."
    ],
    correct: 1,
    why: "\"No patents exist\" and \"we could not reach the patent database\" are different facts about the world. Collapsing them either discards a real finding or hides an outage behind an empty list." },

  { id: "d1c03", dom: 0, diff: "challenging", scen: "Multi-agent research system",
    text: "On broad topics the web-search agent and the document analysis agent keep investigating the same subtopics. Token use nearly doubles with no gain in breadth or depth. What addresses this most effectively?",
    opts: [
      "Introduce shared state where each agent logs its current focus so the others can steer around it as they work.",
      "Let both agents run in parallel exactly as they do now, and have the coordinator deduplicate the overlapping results before synthesis.",
      "Serialise the two agents so document analysis runs after web search and can use its output to avoid repeats.",
      "Have the coordinator partition the research space before delegating, giving each agent distinct subtopics or source types."
    ],
    correct: 3,
    why: "The root cause is undefined boundaries, and boundaries are set at delegation time. Deduplicating afterwards has already paid for the wasted tokens, shared state adds coordination the hub topology deliberately avoids, and serialising sacrifices the parallelism." },

  { id: "d3s08", dom: 2, diff: "standard", scen: "Code generation with Claude Code",
    text: "Your CLAUDE.md has passed 500 lines, mixing TypeScript conventions, testing guidance, API patterns and deployment steps. Developers struggle to find and update the right section. What does Claude Code support for this?",
    opts: [
      "README.md files placed in the relevant subdirectories, which Claude loads automatically as instructions for the code in that area.",
      "Several CLAUDE.md files down the directory tree, each one replacing its parent's instructions.",
      "Separate Markdown files under .claude/rules/, one per topic, such as testing.md and api-conventions.md.",
      "A .claude/config.yaml that maps file patterns onto named sections within the existing CLAUDE.md."
    ],
    correct: 2,
    why: "A .claude/rules/ directory is the supported way to break a large instruction set into focused modules. There is no section-mapping config file, README.md is not an instruction source, and nested CLAUDE.md files compose rather than override." },

  { id: "d4c05", dom: 3, diff: "challenging", scen: "Structured data extraction",
    text: "An extraction pipeline has a validation-and-retry loop. On a repeat failure for the same document, what should the second retry contain?",
    opts: [
      "A simplified schema with the failing field removed, so at least the rest of the record is captured.",
      "Nothing further — cap the repairs and route the document to human review with both failed attempts attached.",
      "Exactly the same repair request again, on the basis that the model frequently succeeds on a third attempt with identical input.",
      "The document alone with no schema, so the model extracts freely and you map the fields afterwards."
    ],
    correct: 1,
    why: "Bounded repair is the pattern: one informed retry, then a human. Unbounded retries burn budget on a document the model cannot handle, and quietly dropping or unstructuring the field ships an incomplete record as if it were complete." },

  { id: "d2c10", dom: 1, diff: "challenging", scen: "Multi-agent research system",
    text: "You are designing tools for a synthesis agent that must attribute every claim. Which tool contract best supports that?",
    opts: [
      "Retrieval tools that return the quote, the source URL and the publication date alongside the extracted claim.",
      "Retrieval tools that return clean prose summaries, with the source list appended once at the end of the response.",
      "Retrieval tools that return the claim plus a numeric relevance score the report can cite as a confidence level.",
      "A single tool that returns the full source document, leaving the synthesis agent to quote and attribute from it."
    ],
    correct: 0,
    why: "Attribution is lost during summarisation unless the claim-to-source mapping travels with the claim. Dates matter too — without them a temporal difference reads as a contradiction. Appended source lists and relevance scores do not tell you which claim came from where." },

  { id: "d1c05", dom: 0, diff: "challenging", scen: "Customer support agent",
    text: "Metrics show the agent averaging more than four API round trips per resolution. Analysis shows it requests get_customer and lookup_order in separate consecutive turns even when it clearly needs both. What reduces the loop count most effectively?",
    opts: [
      "Instruct Claude to request all the tools it needs in a single turn and return every result together before the next call.",
      "Raise max_tokens so Claude has room to plan the whole investigation and combine its requests naturally.",
      "Speculatively execute the tools it is likely to need alongside whatever it requests and return all results.",
      "Add composite tools such as get_customer_with_orders, bundling each of the common lookup combinations into a single call of its own."
    ],
    correct: 0,
    why: "Claude can already emit several tool_use blocks in one turn; the prompt simply has not asked it to. Composite tools multiply the surface for every new combination, max_tokens does not govern batching, and speculative execution runs side effects nobody requested." },

  { id: "d2s10", dom: 1, diff: "standard", scen: "Multi-agent research system",
    text: "The document analysis agent was given a general-purpose fetch_url tool so it could download documents. Logs show it now fetches search engine result pages to do ad-hoc web searching, which belongs to another agent. What is the most effective fix?",
    opts: [
      "Add a filter that blocks fetch_url calls to known search engine domains and allows the rest.",
      "Remove fetch_url and route every URL retrieval through the coordinator to the web-search agent.",
      "Add a line to the agent's prompt stating that fetch_url is for document URLs and not for searching.",
      "Replace fetch_url with a load_document tool that validates the URL points at a document format."
    ],
    correct: 3,
    why: "Constrain the capability at the interface and the unwanted behaviour stops being possible. A domain blocklist chases hostnames forever, routing everything through the coordinator removes a capability the agent legitimately needs, and prompt wording only discourages." },

  { id: "d5c09", dom: 4, diff: "challenging", scen: "Developer productivity tools",
    text: "An agent investigating a large codebase spends most of its context on verbose discovery output before it reaches the question you actually asked. Which combination handles this best?",
    opts: [
      "Split the investigation across several sessions, each resuming the previous one with --resume.",
      "Delegate discovery to subagents, write the findings to a scratchpad, and summarise before starting the next phase.",
      "Raise the context window and run /compact whenever usage approaches the new limit.",
      "Reduce what each tool returns and instruct the agent to re-read files whenever it needs them again."
    ],
    correct: 1,
    why: "Discovery is verbose by nature, so it belongs somewhere other than the main context, with a durable record of what it found. Compaction still pays for the output first, resuming carries stale results forward, and re-reading trades context for repeated tool calls." },

  { id: "d5s01", dom: 4, diff: "standard", scen: "Conversational AI architecture",
    text: "Users report that latency and cost both climb once a conversation passes about 50 turns. What is the primary cause?",
    opts: [
      "Database reads of the stored history slow down as the number of rows per conversation grows.",
      "Responses get progressively longer as the model has more material to refer back to.",
      "Every request carries the whole conversation history, so each call is larger than the last.",
      "The model builds an internal profile of the user, and maintaining it costs more as it grows."
    ],
    correct: 2,
    why: "The API is stateless, so the growing history is resent in full on every call and is billed and processed every time. There is no server-side profile, and response length is not tied to conversation length." },

  { id: "d3s11", dom: 2, diff: "standard", scen: "Code generation with Claude Code",
    text: "Which statement about the CLAUDE.md hierarchy is correct?",
    opts: [
      "Only the project-level file is loaded automatically; the user-level and directory-level files have to be imported explicitly.",
      "The user-level file wins over the project file, so personal conventions always override team ones.",
      "User, project and directory-level files all apply, with the more specific file layering on top of the broader ones.",
      "Only the most specific CLAUDE.md applies; a directory-level file replaces the project file entirely."
    ],
    correct: 2,
    why: "The levels compose rather than compete: user-level for personal defaults, project-level for shared conventions, directory-level for local specifics. That is why a convention only the team should share has to be committed at project level." },

  { id: "d5s06", dom: 4, diff: "standard", scen: "Customer support agent",
    text: "The agent has called get_customer and lookup_order and has every fact the system holds. Which situation most clearly justifies calling escalate_to_human?",
    opts: [
      "A customer's message contains both a billing question and a return, and needs coordinating.",
      "A customer says a parcel never arrived, but tracking shows it delivered and signed for three days ago.",
      "A customer wants to cancel an order that shipped yesterday and is due to arrive tomorrow.",
      "A customer asks for competitor price matching; policy covers price drops on your own site but is silent on competitors."
    ],
    correct: 3,
    why: "Escalation is for a genuine policy gap, where answering would mean inventing policy. The others are awkward but decidable: the agent can present tracking evidence, apply the cancellation rules and handle two issues in one conversation." },

  { id: "d3s04", dom: 2, diff: "standard", scen: "Claude Code for CI",
    text: "Your pipeline runs claude \"Analyze this pull request for security issues\" and the job hangs. Logs show it waiting for interactive input. What is the correct invocation?",
    opts: [
      "claude -p \"Analyze this pull request for security issues\"",
      "CLAUDE_HEADLESS=true claude \"Analyze this pull request for security issues\"",
      "claude \"Analyze this pull request for security issues\" < /dev/null",
      "claude --batch \"Analyze this pull request for security issues\""
    ],
    correct: 0,
    why: "-p (or --print) is the documented non-interactive mode: it processes the prompt, writes to stdout and exits. The others are either a Unix workaround for a problem the flag solves properly, or flags and variables that do not exist." },

  { id: "d1s04", dom: 0, diff: "standard", scen: "Multi-agent research system",
    text: "A colleague proposes that the document analysis agent send its results straight to the synthesis agent instead of going back through the coordinator. What is the main argument for keeping the coordinator as the central hub?",
    opts: [
      "The coordinator sees every interaction, so errors are handled uniformly and it controls what each subagent receives.",
      "Routing through the coordinator is what makes automatic retries possible; direct calls cannot be retried.",
      "Only the coordinator is able to serialise messages between agents, because the subagents each run in an isolated memory space.",
      "The coordinator batches subagent requests together, which cuts the number of API calls and total latency."
    ],
    correct: 0,
    why: "Hub-and-spoke exists for observability and control: one place sees every exchange, applies the same error handling, and decides what information each subagent is given. Retries and serialisation are not what the topology buys you." },

  { id: "d5s03", dom: 4, diff: "standard", scen: "Multi-agent research system",
    text: "Given that positional pattern, how should the aggregated input be restructured?",
    opts: [
      "Put a key-findings summary at the start and organise the rest under explicit section headings.",
      "Summarise everything down to under 20K tokens so the whole input sits in the reliable range.",
      "Stream the results in incrementally, completing the web-search set before the document analysis set.",
      "Alternate which subagent's results appear first from run to run, so each gets the top position over time."
    ],
    correct: 0,
    why: "A summary at the front uses the position that is read most reliably, and headings give the model a way to navigate the middle. Compressing to 20K throws away detail, rotation shares the problem out rather than solving it, and incremental streaming just reproduces the ordering in time." },

  { id: "d3c09", dom: 2, diff: "challenging", scen: "Claude Code for CI",
    text: "Automated reviews average 15 findings per PR with a 40% false-positive rate. Developers say the bottleneck is investigation: each finding must be opened to read the reasoning before deciding. CLAUDE.md already documents acceptable patterns, and stakeholders have ruled out filtering findings before developers see them.",
    opts: [
      "Add a post-processor that suppresses findings matching historical false-positive signatures automatically.",
      "Split findings into blocking issues and suggestions, with different review requirements for each level.",
      "Require each finding to carry its rationale and a confidence estimate inline, so developers can triage without opening it.",
      "Configure the reviewer to surface only high-confidence findings and hold the uncertain ones back."
    ],
    correct: 2,
    why: "The constraint rules out anything that removes findings from view, so the only lever left is making each one faster to judge. Two of the alternatives filter, which is excluded; categorising by severity does not tell a developer whether a given finding is real." },

  { id: "d5s08", dom: 4, diff: "standard", scen: "Structured data extraction",
    text: "You want to know how often the pipeline's high-confidence extractions are actually wrong. Which method gives you that?",
    opts: [
      "Stratified random sampling within the high-confidence band, reviewed against ground truth.",
      "Reviewing every extraction the model marked low-confidence and extrapolating the error rate upward.",
      "Comparing the model's confidence scores against its own second-pass re-extraction of the same documents.",
      "Tracking how many high-confidence extractions are later corrected by downstream users."
    ],
    correct: 0,
    why: "You can only measure the error rate inside a band by sampling that band and checking it against truth. Low-confidence items say nothing about high-confidence ones, self-comparison inherits the same bias, and downstream corrections only catch what somebody happened to notice." },

  { id: "d1c15", dom: 0, diff: "challenging", scen: "Multi-agent research system",
    text: "You are writing the AgentDefinition for a synthesis subagent that merges findings and writes the report. Which allowed_tools list is right?",
    opts: [
      "No tools at all, since a synthesis agent works purely from the text the coordinator passes it.",
      "The same tools as the coordinator, so it can fetch anything a gap in the findings turns out to require.",
      "Only what synthesis needs — the report-writing tool and a narrow fact-check tool — with everything else left out.",
      "Every read-only tool in the system, on the basis that reading causes no side effects and widens what the agent is able to verify."
    ],
    correct: 2,
    why: "Least privilege: give a subagent the narrow set its job needs. Coordinator-level access breaks the separation of responsibilities, read-only access still lets it wander into work that belongs to other agents, and a fact-check need is real enough that no tools at all is too tight." },

  { id: "d1c11", dom: 0, diff: "challenging", scen: "Multi-agent research system",
    text: "You are writing the coordinator's system prompt for a research system whose topics vary widely from run to run. Which style produces the most reliable behaviour?",
    opts: [
      "List the subagents available and the exact conditions under which each one must be invoked.",
      "State the goal and the quality criteria the final report must meet, and leave the decomposition to the coordinator.",
      "Give one worked example of a complete run and instruct the coordinator to follow its structure each time.",
      "Enumerate the steps in the order they should run — search, analyse, synthesise, write — so that every run follows the same known-good path."
    ],
    correct: 1,
    why: "A coordinator earns its cost by adapting the decomposition to the topic. Fixing the steps, the example or the invocation conditions turns it back into a pipeline, which is the cheaper pattern you would have chosen deliberately." },

  { id: "d4s04", dom: 3, diff: "standard", scen: "Conversational AI architecture",
    text: "Users complain that replies keep opening with \"Certainly!\" and \"I'd be happy to help!\". What removes the pattern most reliably?",
    opts: [
      "Strip greetings from the response in post-processing before it reaches the user.",
      "Add a system prompt instruction listing the phrases to avoid at the start of a response.",
      "Prefill the start of the assistant turn with the opening of a direct answer.",
      "Lower the temperature so the model stops reaching for its most probable opening."
    ],
    correct: 2,
    why: "Prefilling decides the first tokens rather than asking for them, so the pattern cannot appear. Instructions catch the phrases you listed and not their variants, temperature governs randomness rather than a specific habit, and post-processing is a fragile patch." },

  { id: "d2s09", dom: 1, diff: "standard", scen: "Developer productivity tools",
    text: "An agent has both the built-in Read and Grep tools and an MCP server exposing similar file-search tools. It keeps using the built-in ones and ignoring the MCP server. What does this tell you?",
    opts: [
      "Agents tend to reach for built-in tools over MCP tools with overlapping purpose, so the MCP descriptions must state what only they can do.",
      "MCP tools are only consulted once the built-in tools have failed, which is the documented precedence order.",
      "The MCP server is misconfigured; correctly registered tools are ranked ahead of built-ins.",
      "Built-in tools are cheaper to call, so the model's selection is optimising for token cost."
    ],
    correct: 0,
    why: "There is no precedence rule to fix here. Where two tools plausibly answer the same request, the familiar built-in wins unless the description makes the MCP tool's distinct value explicit." },

  { id: "d1c01", dom: 0, diff: "challenging", scen: "Multi-agent research system",
    text: "Running the system on \"AI impact on the creative industries\", every subagent succeeds: searches return relevant articles, summaries are accurate, synthesis is coherent. Yet reports only ever cover visual art. Coordinator logs show three subtasks: \"AI in digital art\", \"AI in graphic design\", \"AI in photography\". What is the root cause?",
    opts: [
      "The coordinator's decomposition was too narrow, so whole areas of the topic were never assigned to anyone.",
      "The synthesis agent has no instruction to check the assembled findings for coverage gaps.",
      "The web-search agent's queries are not broad enough and should be widened across more sectors.",
      "The document analysis agent's relevance criteria are too strict, and they filter the non-visual sources out of its results."
    ],
    correct: 0,
    why: "Music, literature and film were never delegated, so no subagent could have found them. When every worker performs correctly, look at what was assigned before blaming execution." },

  { id: "d5c07", dom: 4, diff: "challenging", scen: "Multi-agent research system",
    text: "Your final reports read well but nobody can tell which source supports which claim. Subagents currently return polished prose summaries. What is the minimum change that restores attribution?",
    opts: [
      "Have the report-writing agent add a bibliography of every document the subagents consulted.",
      "Require subagents to emit claim-to-source mappings — the quote, the document or URL, and the date — and preserve them through aggregation.",
      "Have the coordinator attach each subagent's full output as an appendix to the report.",
      "Have synthesis re-check each claim against the sources and cite the ones it can confirm."
    ],
    correct: 1,
    why: "Attribution is lost during summarisation unless the mapping is produced with the claim and carried through aggregation. A bibliography says what was read, an appendix makes the reader do the work, and re-checking pays for the same research twice." },

  { id: "d4c02", dom: 3, diff: "challenging", scen: "Conversational AI architecture",
    text: "During QA, Claude follows the system prompt for the first ten to fifteen turns and then deviates. The conversation is still well inside the token limit. What is the best solution?",
    opts: [
      "Validate each response after generation and regenerate the ones that break the guidelines.",
      "Move the behavioural guidelines into the first user message so they sit inside the conversation itself.",
      "Start a fresh conversation every twenty turns to keep the system prompt proportionally dominant.",
      "Insert user-role messages that restate the guidelines at natural breakpoints in the conversation."
    ],
    correct: 3,
    why: "Periodic reinforcement counteracts drift as accumulated history dilutes the system prompt's influence. Moving guidelines into the first user message reduces their authority, restarting destroys context, and post-hoc validation corrects rather than prevents, at the cost of a second call." },

  { id: "d1s01", dom: 0, diff: "standard", scen: "Customer support agent",
    text: "You are writing the agent loop for a support agent on the Messages API. After every call you must decide whether to run the requested tools and call Claude again, or stop and present the answer to the customer. What determines that decision?",
    opts: [
      "Search the response text for closing phrases such as \"I'm done\" or \"anything else?\", which signal completion.",
      "Check whether the response contains assistant text — if Claude has produced an explanation for the customer, the work is finished.",
      "Read response.stop_reason: \"tool_use\" means run the tools and call again, \"end_turn\" means the turn is finished.",
      "Set a maximum iteration count of around ten calls and stop there, whatever Claude indicates."
    ],
    correct: 2,
    why: "stop_reason is the explicit structured control signal. Text parsing is guesswork, a response can contain both text and a tool_use block, and an iteration cap is a safety net that either truncates real work or burns turns." },

  { id: "d1s16", dom: 0, diff: "standard", scen: "Developer productivity tools",
    text: "You resume a three-day-old session with claude --resume audit-session. Several of the files it examined have been refactored since. What is the risk?",
    opts: [
      "The saved tool results describe the old code, and the agent has no way to know they are stale.",
      "Resuming re-reads every file it touched, so the context immediately exceeds the window.",
      "Resuming replays every tool call from the original session, so the refactor will be undone.",
      "The session cannot be resumed at all once the working tree has changed underneath it, and will start again from an empty context."
    ],
    correct: 0,
    why: "A resumed session carries its saved tool results forward as if they were current. Where files have moved on, a fresh start from a written summary of the findings is usually more reliable." },

  { id: "d3c05", dom: 2, diff: "challenging", scen: "Claude Code for CI",
    text: "Your CI runs three Claude analyses: fast style checks that block merges, weekly full-codebase security audits, and nightly test generation for changed modules. The Message Batches API is 50% cheaper but can take up to 24 hours. Which mapping is correct?",
    opts: [
      "The Batches API for all three, with the pipeline polling for completion before it reports results.",
      "Synchronous calls for the blocking style checks and for the nightly test generation; the Batches API only for the weekly security audits.",
      "Synchronous calls for the blocking style checks; the Batches API for the weekly audits and the nightly test generation.",
      "Synchronous calls for all three, relying on prompt caching to bring the cost down instead."
    ],
    correct: 2,
    why: "The deciding factor is whether anyone is waiting. Style checks block a merge, so they need a synchronous response; a weekly audit and an overnight job both tolerate a 24-hour window comfortably, and leaving the nightly run synchronous forfeits half its cost for nothing." },

  { id: "d3s01", dom: 2, diff: "standard", scen: "Code generation with Claude Code",
    text: "You want a custom /review command running your team's review checklist, available to every developer as soon as they clone the repository. Where does the command file go?",
    opts: [
      "In .claude/config.json, as an entry in the array of project command definitions.",
      "In .claude/commands/ inside the project repository.",
      "In ~/.claude/commands/ on each developer's machine, kept in sync by the onboarding script.",
      "In the root CLAUDE.md, as a section describing the review checklist and its trigger."
    ],
    correct: 1,
    why: "Project commands live in .claude/commands/, so they are version-controlled and arrive with the clone. The home directory is for personal commands, CLAUDE.md holds instructions rather than command definitions, and there is no commands array in a config file." },

  { id: "d4c01", dom: 3, diff: "challenging", scen: "Conversational AI architecture",
    text: "An AI tutor has a 2,800-token system prompt of teaching methodology and adaptation rules. After around twelve turns it stops adapting to proficiency level. The conversation is well within limits. What is the most effective fix?",
    opts: [
      "Evaluate each response and regenerate it whenever the difficulty level does not match the learner.",
      "Replace the verbose declarative rules with few-shot examples demonstrating adaptation at each proficiency level.",
      "Move the critical rules to the end of the system prompt, where they are attended to more reliably.",
      "Inject a reminder of the rules every four or five turns to re-establish them as the history grows."
    ],
    correct: 1,
    why: "Abstract rules have to be re-reasoned on every turn, which is what degrades as history accumulates; demonstrated behaviour is matched rather than derived. Reminders treat the symptom, repositioning helps early and not at turn twelve, and regeneration is expensive correction after the fact." },

  { id: "d1c16", dom: 0, diff: "challenging", scen: "Developer productivity tools",
    text: "A team proposes replacing a working single agent with a coordinator and four subagents, because \"multi-agent is more scalable\". The task is a linear document-processing job whose five steps always run in the same order. What is the strongest argument against?",
    opts: [
      "The work has no independent subtasks and no need for isolated context, so the coordination overhead buys nothing.",
      "Multi-agent systems cannot guarantee ordering, so the five steps might execute out of sequence.",
      "Subagents cannot share the document between them, so each one would have to re-read it from disk.",
      "The coordinator would become a single point of failure that the current single-agent design avoids."
    ],
    correct: 0,
    why: "Multi-agent pays for itself when subtasks are genuinely independent or need separate context. A fixed linear sequence has neither, so you take the latency and token cost of delegation for nothing." },

  { id: "d4c11", dom: 3, diff: "challenging", scen: "Conversational AI architecture",
    text: "Over several turns a user has said \"I have a very low risk tolerance\" and later \"I want to maximise my returns\". They now ask what to invest in. What should the assistant do?",
    opts: [
      "Recommend a balanced portfolio that partly satisfies both without raising the conflict.",
      "Point out that the two stated priorities conflict and ask which one should govern the recommendation.",
      "Act on the most recently stated preference, since it reflects the user's current thinking.",
      "Give two separate recommendations, one for each of the stated priorities, and let the user choose between them."
    ],
    correct: 1,
    why: "The two goals are genuinely incompatible, so any answer encodes a decision the user has not made. Surfacing the conflict is the only route that does not guess; recency is not intent, and a balanced answer buries the choice inside a recommendation." },

  { id: "d2p01", dom: 1, diff: "challenging", scen: "Multi-agent research system",
    text: "Requests like \"analyze the uploaded quarterly report\" reach the web-search agent 45% of the time. That agent owns analyze_content, \"analyzes content and extracts key information\"; the document analysis agent owns analyze_document, \"analyzes documents and extracts key information\". How do you fix the misrouting?",
    opts: [
      "Add a pre-routing classifier that decides whether a request concerns an uploaded file or web content before the coordinator delegates it.",
      "Extend the document analysis description with usage examples — uploaded PDFs, Word documents, spreadsheets — and leave the web-search tool as it stands.",
      "Rename the web-search tool to extract_web_results and describe it as processing information retrieved from web search and URLs.",
      "Give the coordinator few-shot examples of correct routing: an uploaded quarterly report to document analysis, a web page to web search."
    ],
    correct: 2,
    why: "Both names and both descriptions say the same thing, so nothing in the definitions separates the tools. Renaming the web-search tool and rewriting its description around web search and URLs removes that overlap itself. A classifier and few-shot routing both leave the ambiguity in place and steer around it, and widening one description still leaves the other claiming the same ground." },

  { id: "d4c07", dom: 3, diff: "challenging", scen: "Customer support agent",
    text: "Single-issue requests are handled with 94% accuracy. When a customer raises two issues in one message — a refund on one order and an address change on another — accuracy falls to 58%, with one issue dropped or parameters mixed between them. What improves reliability most?",
    opts: [
      "Few-shot examples demonstrating the reasoning and tool sequencing for multi-issue requests, with parameters kept separate.",
      "Fewer, broader tools, so there are fewer parameters to confuse between the two issues.",
      "A preprocessing model call that splits multi-issue messages into separate requests, handled independently and merged after.",
      "Response validation that detects an incomplete answer and automatically reprompts to cover the missed issue."
    ],
    correct: 0,
    why: "The agent already performs well per issue; what it lacks is the pattern for handling two at once. Examples supply that directly, where a preprocessing stage adds a call and a component for something the model can do, and validation only catches the failure afterwards." },

  { id: "d1s05", dom: 0, diff: "standard", scen: "Multi-agent research system",
    text: "The web-search and document-analysis agents have both finished and returned their results to the coordinator. What happens next in a coordinator–subagent research system?",
    opts: [
      "Each agent forwards its own results to the report-writing agent so synthesis can start sooner.",
      "The coordinator concatenates the two raw outputs and returns them as the finished report.",
      "The document analysis agent pulls in the web-search results and merges them internally before reporting.",
      "The coordinator hands both result sets to the synthesis agent for a single integrated pass."
    ],
    correct: 3,
    why: "Integration is the synthesis agent's job, and the coordinator is what feeds it. Concatenation is not synthesis, and any path that skips the coordinator gives up the control the pattern exists to provide." },

  { id: "d1s13", dom: 0, diff: "standard", scen: "Customer support agent",
    text: "The agent has decided to escalate a billing dispute to a human operator. What does the handoff have to contain?",
    opts: [
      "A self-contained summary: customer id, issue, order id, root cause, what has already been done and what is recommended.",
      "The full message history verbatim, so nothing the agent observed is lost in summarisation.",
      "The customer's last message plus the agent's confidence score, keeping the handoff short to read.",
      "A link to the live conversation so the operator can read the transcript and form their own view."
    ],
    correct: 0,
    why: "The operator works from the handoff object, not from your transcript. It has to stand alone: who, what, why, what was tried and what you recommend." },

  { id: "d4c12", dom: 3, diff: "challenging", scen: "Conversational AI architecture",
    text: "Vague requests like \"Can you help with the report?\" produce several clarifying questions — which report, what kind of help, by when — and 40% of users abandon. What is the best solution?",
    opts: [
      "Make reasonable assumptions, state them in the reply and offer to adjust.",
      "Allow at most one clarifying question per turn, so the exchange never feels like an interrogation.",
      "Classify the ambiguity with a smaller, cheaper model first and only ask when it is genuinely unresolvable.",
      "Use predefined interpretations for common request shapes without spelling them out to the user."
    ],
    correct: 0,
    why: "Stated assumptions remove the back-and-forth while keeping the user informed and able to correct. Silent interpretations leave them confused when the answer misses, one question per turn still spends turns, and a classifier adds infrastructure without changing the experience." },

  { id: "d2c05", dom: 1, diff: "challenging", scen: "Developer productivity tools",
    text: "You are adding an MCP server that exposes 30 tools covering an entire ticketing platform. After connecting it, the agent's tool selection accuracy on its original tasks drops noticeably. What is the most likely explanation?",
    opts: [
      "The server's tools are being cached between requests, so the model sees a stale definition list.",
      "MCP tools are evaluated after built-in tools, so adding them re-orders and destabilises the existing selection.",
      "Thirty tool definitions exceed the per-request tool limit, so some are silently dropped from the request.",
      "Thirty extra definitions crowd the selection space and overlap the existing tools, making every choice harder."
    ],
    correct: 3,
    why: "Every tool definition is context the model weighs on every request. A large, partly overlapping surface degrades selection, which is why you expose the tools an agent actually needs rather than the whole platform." },

  { id: "d2c01", dom: 1, diff: "challenging", scen: "Conversational AI architecture",
    text: "search_catalog fails 12% of the time: 8% are network timeouts that succeed on retry, 4% are query syntax errors that never will. Both come back identically today, so the agent retries everything. How should the tool's error handling change?",
    opts: [
      "Add few-shot examples to the system prompt teaching the agent to tell network errors from syntax errors.",
      "Retry transient timeouts inside the tool with backoff, and return syntax errors immediately with the validation detail.",
      "Apply exponential backoff uniformly to every failure, so that the transient errors recover and the remaining ones simply fail more slowly.",
      "Return every error with a retryable boolean and a type field, leaving the retry decision to the agent."
    ],
    correct: 1,
    why: "The tool is the only component that knows which failure it hit, so it is the right place to retry. Handing the agent a flag makes a deterministic decision probabilistic, uniform backoff wastes time on errors that cannot succeed, and prompt examples ask the model to infer what the tool already knows." },

  { id: "d1c04", dom: 0, diff: "challenging", scen: "Agentic AI tools",
    text: "Your remove_team_member tool takes a dry_run boolean so impact can be previewed first. Monitoring shows the agent calling it with dry_run=false directly. Every removal must be preceded by a preview the user explicitly confirms. What is the most reliable design?",
    opts: [
      "Split it into preview_remove_member, which returns the impact plus a single-use confirmation token, and execute_remove_member, which requires that token.",
      "Mark the tool as requiring confirmation and have the orchestration layer prompt the user before forwarding calls to it.",
      "Add server-side validation that accepts dry_run=false only if an identical dry_run=true call arrived within the last 60 seconds.",
      "Expand the tool description with instructions and examples requiring a dry_run=true call and a user confirmation first."
    ],
    correct: 0,
    why: "Token binding makes the unsafe path unrepresentable: execution cannot happen without an artefact only the preview produces. A time window is a heuristic that a replayed call satisfies, an orchestration prompt depends on infrastructure outside the tool, and description text is an instruction, not a control." },

  { id: "d3c02", dom: 2, diff: "challenging", scen: "Code generation with Claude Code",
    text: "A /migration skill takes a name through $ARGUMENTS. In production: developers often run it with no argument and get badly named files; it sometimes reuses schema details from unrelated earlier conversations; and one developer triggered a destructive cleanup because the skill had broad tool access. Which configuration fixes all three?",
    opts: [
      "Positional $1 and $2 parameters, explicit schema file references for context, and a frontmatter warning about destructive operations.",
      "argument-hint in the frontmatter, context: fork for isolation, and allowed-tools narrowed to file writes.",
      "Validation instructions for the argument, a prompt line telling it to ignore earlier conversation, and a list of prohibited operations.",
      "A split into /migration-create and /migration-apply, a prompt for the name when missing, and different tool scopes per skill."
    ],
    correct: 1,
    why: "Three problems, three configuration features: argument-hint prompts for the input, context: fork keeps earlier conversation out, and allowed-tools makes the destructive call impossible. The alternatives solve at least one of them with instructions, which is exactly what failed." },

  { id: "d4s07", dom: 3, diff: "standard", scen: "Structured data extraction",
    text: "Processing 5,000 archived documents overnight through an extraction prompt, with results needed by morning. Which API approach fits, and why?",
    opts: [
      "The Message Batches API with a synchronous fallback — batches often exceed their window and need rescuing.",
      "Synchronous calls in parallel — batch results are returned unordered, which breaks per-document mapping.",
      "Synchronous calls in sequence — batch processing does not accept JSON schemas for structured extraction.",
      "The Message Batches API — it halves the cost, and its window is far inside the time available."
    ],
    correct: 3,
    why: "Nobody is waiting, so a 24-hour window costs nothing and saves half the spend. Ordering is handled by custom_id, schemas work normally in a batch, and building a fallback for a deadline you are nowhere near is wasted work." },

  { id: "d4s08", dom: 3, diff: "standard", scen: "Code generation with Claude Code",
    text: "You asked for a function transforming API responses into an internal format. Two iterations later the nesting is still wrong and timestamps are formatted differently each time. The requirements were written as prose. What works best next?",
    opts: [
      "Write a JSON Schema for the output and validate each iteration against it.",
      "Rewrite the requirements more precisely, specifying field mappings, nesting rules and format strings.",
      "Give two or three concrete input–output examples showing the exact transformation you expect.",
      "Ask Claude to explain its current understanding so you can find where the interpretations diverge."
    ],
    correct: 2,
    why: "Prose about structure is exactly what is being reinterpreted; an input–output pair leaves nothing to interpret. A schema catches a wrong result after the fact, and more precise prose is more of what already failed twice." },

  { id: "d2s02", dom: 1, diff: "standard", scen: "Agentic AI tools",
    text: "You are writing the description for a tool that cancels a subscription. Which content belongs in it?",
    opts: [
      "A short label only — long descriptions consume context on every request without improving selection.",
      "What the tool does, when to use it, when not to, the expected input format and a worked example.",
      "The implementation notes and the downstream service it calls, so the model can reason about failures.",
      "A precise description of the return payload, since that is what the model has to parse afterwards."
    ],
    correct: 1,
    why: "The description is documentation written for a model deciding whether to call this tool. Purpose, boundaries, input shape and an example are what that decision needs; implementation detail is not, and brevity here costs accuracy." },

  { id: "d1s08", dom: 0, diff: "standard", scen: "Multi-agent research system",
    text: "A coordinator needs four independent literature searches. Each takes about 40 seconds, and the run currently takes almost three minutes. How do you cut wall-clock time without changing what is researched?",
    opts: [
      "Give the coordinator a larger model so it works through the four delegations faster.",
      "Cache each subagent's result so repeated runs of the same search return immediately.",
      "Merge the four searches into one subagent prompt so a single agent covers all four areas in one pass.",
      "Issue the four Task calls in a single coordinator turn so the subagents run in parallel."
    ],
    correct: 3,
    why: "Several Task calls emitted in one coordinator turn run concurrently. Merging them back into one agent removes the parallelism, a bigger model does not make sequential delegation concurrent, and caching only helps on a repeat run." },

  { id: "d2s03", dom: 1, diff: "standard", scen: "Agentic AI tools",
    text: "Two MCP servers are connected. One exposes analyze_content described as \"analyzes content and extracts key information\", the other analyze_document described as \"analyzes documents and extracts key information\". Requests are misrouted about 45% of the time. What is wrong?",
    opts: [
      "The model always prefers the tool listed first when several plausibly match the request.",
      "The two descriptions overlap semantically, so nothing in them distinguishes the tools from each other.",
      "Content analysis and document analysis need a routing classifier, because descriptions alone never disambiguate.",
      "Two MCP servers cannot expose tools with similar names without a namespace prefix to separate them."
    ],
    correct: 1,
    why: "Selection is made from the descriptions, and these two say the same thing. Rename and rewrite them so each states what it is for and what it is not for; the ambiguity is the bug." },

  { id: "d1c06", dom: 0, diff: "challenging", scen: "Customer support agent",
    text: "Simple requests resolve in three or four tool calls with 91% success. Requests like \"I was billed twice, my discount didn't apply and I want to cancel\" average twelve or more calls at 54% success, working through the issues one at a time and re-fetching the same customer data for each. What change helps most?",
    opts: [
      "Add few-shot examples showing ideal tool-call sequences for a range of multi-part billing scenarios.",
      "Decompose the request into separate issues and investigate them in parallel against one shared customer context, then synthesise a single resolution.",
      "Add verification checkpoints between stages so the agent records progress on each issue before starting the next one.",
      "Collapse get_customer, lookup_order and the billing tools into one investigate_issue tool to shorten the chain."
    ],
    correct: 1,
    why: "Both symptoms — the call count and the redundant fetches — come from sequential handling with no shared context. Checkpoints formalise the sequence rather than removing it, examples do not change the shape of the work, and one god-tool hides the problem behind a coarser interface." },

  { id: "d3c06", dom: 2, diff: "challenging", scen: "Claude Code for CI",
    text: "Your review component is iterative: Claude analyses the changed file and may call a tool to request related files — imports, base classes, tests — before giving feedback. You are considering the Message Batches API to cut cost. What is the primary technical obstacle?",
    opts: [
      "Batch requests do not accept tool definitions in their parameters, so the tool could not be offered at all.",
      "Batch results carry no correlation identifier, so outputs cannot be matched back to the requests that produced them.",
      "The 24-hour turnaround is too slow for pull request feedback, though the workflow would otherwise work as it does now.",
      "A batch request cannot pause mid-flight to execute a tool and feed the result back, so the loop cannot run."
    ],
    correct: 3,
    why: "The Batches API is fire-and-forget: there is no point at which your code intercepts a tool call and returns a result. Latency is a real constraint too, but the workflow would not function at any latency, and custom_id exists precisely for correlation." },

  { id: "d1s14", dom: 0, diff: "standard", scen: "Code generation with Claude Code",
    text: "A pull request touches 14 files. Reviewing them all in one pass gives detailed comments on some files and superficial ones on others, misses obvious bugs, and flags a pattern in one file while approving identical code in another. How should the review be restructured?",
    opts: [
      "Review each file in its own focused pass, then run a separate pass for cross-file data flows.",
      "Move to a model with a larger context window so all 14 files fit comfortably in one attentive pass.",
      "Require developers to break large pull requests into submissions of three or four files each.",
      "Run three independent full-PR passes and report only findings that appear in at least two of them."
    ],
    correct: 0,
    why: "The symptom is attention dilution across a wide input. Per-file passes restore consistent depth and an integration pass covers what they miss; a bigger window does not improve attention quality, and consensus voting suppresses real findings." },

  { id: "d5s09", dom: 4, diff: "standard", scen: "Multi-agent research system",
    text: "Two credible sources disagree on a key metric: a government report says 40% growth, an industry analysis says 12%. How should the document analysis agent handle it?",
    opts: [
      "Include both figures without marking them as conflicting and let synthesis decide from wider context.",
      "Finish the analysis carrying both figures, annotate the conflict with its attribution, and let the coordinator reconcile it.",
      "Apply credibility heuristics to choose the more likely figure and footnote the discrepancy.",
      "Stop and escalate to the coordinator immediately to decide which source is authoritative before continuing."
    ],
    correct: 1,
    why: "The analysis agent's job is to report faithfully, not to adjudicate; reconciliation belongs to the coordinator, which has the broader view. Picking a value quietly loses the disagreement, stopping blocks work that could continue, and unmarked figures let the conflict slip through unnoticed." },

  { id: "d1c13", dom: 0, diff: "challenging", scen: "Agentic AI tools",
    text: "Your agent runs against several MCP servers. Some return 40-field payloads where the task needs five fields, and the context window fills after a handful of calls. What is the cleanest structural fix?",
    opts: [
      "Instructions in the system prompt telling the model to read only the relevant fields and ignore the rest of each payload.",
      "A /compact pass whenever the context approaches its limit, summarising the accumulated tool output.",
      "A larger-context model, so the verbose payloads stop exhausting the window during a normal run.",
      "A PostToolUse hook that projects each tool result down to the fields the task actually uses before the model sees it."
    ],
    correct: 3,
    why: "The tokens are spent the moment the payload enters the context, so the fix has to happen before that. Telling the model to ignore fields does not stop them being counted, a larger window postpones the same problem, and compaction pays the cost first and then compresses it." },

  { id: "d1c12", dom: 0, diff: "challenging", scen: "Structured data extraction",
    text: "An agent maps an unfamiliar repository, then generates tests for whichever modules turn out to be untested. Halfway through it discovers an external payment dependency and adds a mocking step nobody specified. Which decomposition strategy does this describe, and is it appropriate?",
    opts: [
      "Dynamic adaptive decomposition — inappropriate here, because test generation is repeatable work that should be reproducible.",
      "Prompt chaining with a validation loop — appropriate, since each step validates the previous one before continuing.",
      "A fixed pipeline with an error branch — appropriate, since the mocking step is just recovery from an unexpected dependency.",
      "Dynamic adaptive decomposition — appropriate, because the subtasks only become knowable from intermediate results."
    ],
    correct: 3,
    why: "Nobody could have listed \"mock the payment provider\" before the discovery pass ran, which is exactly when adaptive decomposition is the right choice. A fixed pipeline is for work whose steps you can name in advance." },

  { id: "d2s08", dom: 1, diff: "standard", scen: "Structured data extraction",
    text: "Your document_type enum lists invoice, receipt, contract and purchase_order. Production documents include delivery notes and credit memos, which the model forces into the nearest category. What is the standard fix?",
    opts: [
      "Add a confidence score to the field so downstream code can discard low-confidence classifications.",
      "Drop the enum and let the field be free text, since the closed set is what is causing the loss.",
      "Add an \"other\" member paired with a free-text detail field so the real type survives.",
      "Extend the enum with every document type seen so far and redeploy whenever a new one appears."
    ],
    correct: 2,
    why: "An enum plus \"other\" with a detail string keeps the categories useful while letting data outside them come through intact. Free text loses the structure, and chasing the list keeps you one document behind." },

  { id: "d4s06", dom: 3, diff: "standard", scen: "Structured data extraction",
    text: "A contract-extraction prompt handles standard agreements well, but on amendments and addenda it puts the wrong dates in the wrong fields. What is the most effective addition?",
    opts: [
      "A longer description of each field in the schema, spelling out which date belongs where.",
      "More examples of standard agreements, so the correct field mapping is reinforced overall.",
      "A separate extraction pass per document type, each with its own prompt and schema.",
      "Few-shot examples covering the document structures it gets wrong, not more examples of the ones it handles."
    ],
    correct: 3,
    why: "Examples earn their tokens where the model is actually uncertain. Reinforcing the cases it already handles changes nothing, and field descriptions restate a mapping it is misapplying to an unfamiliar structure." },

  { id: "d2c04", dom: 1, diff: "challenging", scen: "Agentic AI tools",
    text: "A tool returns isError: true with the message \"Request failed\". The agent retries it eleven times before giving up, burning the token budget. What is the underlying design problem?",
    opts: [
      "Retries belong in the agent loop rather than in the model's hands, so the tool result is the wrong place to signal failure.",
      "isError is being used for a condition that is not an error, and the tool should return a normal result instead.",
      "The agent is missing an iteration cap, which is what should have terminated the retry sequence.",
      "The error carries no category and no retryable signal, so the agent cannot tell a permanent failure from a transient one."
    ],
    correct: 3,
    why: "An error the model cannot classify is one it will keep probing. Category, retryability and a concrete description are what turn a failure into a decision; an iteration cap would only have hidden the same defect sooner." },

  { id: "d5p01", dom: 4, diff: "standard", scen: "Multi-agent research system",
    text: "The web-search subagent times out partway through a complex topic. What does it have to hand back to the coordinator for intelligent recovery to be possible?",
    opts: [
      "Structured error context: the failure type, the query it ran, any partial results and the alternatives worth trying.",
      "A generic \"search unavailable\" status, returned once its own exponential-backoff retries are exhausted.",
      "The timeout exception itself, propagated to the top-level handler so the research workflow stops there.",
      "An empty result set marked as successful, with the timeout caught and dealt with inside the subagent."
    ],
    correct: 0,
    why: "The coordinator chooses between retrying with a narrower query, proceeding on what came back and reporting a gap — and it can only choose if the failure tells it which of those are open. A success marker hides the gap, a generic status discards the query and the partial results, and an exception that ends the run discards the work that succeeded." },

  { id: "d4c09", dom: 3, diff: "challenging", scen: "Claude Code for CI",
    text: "You are designing a review prompt for large pull requests. Which structure produces the most consistent findings?",
    opts: [
      "One prompt run three times at a higher temperature, with the findings merged afterwards.",
      "Sequential focused passes, each with its own narrow criteria, feeding a final integration pass.",
      "One comprehensive prompt listing every review criterion, so nothing is missed in a single reading.",
      "One prompt per severity level, run in parallel across the full diff each time."
    ],
    correct: 1,
    why: "Chaining focused passes is what keeps depth consistent when a single pass would dilute attention across too many concerns. A single comprehensive prompt is the shape that produces the inconsistency, and repeated whole-diff runs multiply cost without narrowing what each pass attends to." },

  { id: "d1s07", dom: 0, diff: "standard", scen: "Multi-agent research system",
    text: "Your coordinator agent is defined with allowed_tools set to [\"get_customer\", \"lookup_order\"], and it never delegates anything. Subagent definitions look correct. What is wrong?",
    opts: [
      "Delegation requires the subagents to be started first; a coordinator cannot create them on demand.",
      "\"Task\" is missing from the coordinator's allowed tools, so it has no way to spawn a subagent.",
      "A coordinator can only delegate when its system prompt names each subagent and the order to call them in.",
      "Subagent definitions have to be listed in the coordinator's allowed_tools by name before they can be invoked."
    ],
    correct: 1,
    why: "Spawning a subagent is a tool call like any other. Without \"Task\" in its allowed tools the coordinator simply cannot delegate, however well the subagents are defined." },

  { id: "d3s02", dom: 2, diff: "standard", scen: "Code generation with Claude Code",
    text: "You have to break a monolith into microservices: dozens of files, and real decisions about service boundaries and module dependencies. How should you approach it?",
    opts: [
      "Execute directly and incrementally, letting the natural service boundaries emerge from the refactor as it goes.",
      "Execute directly with detailed up-front instructions specifying the structure of each service you want.",
      "Execute directly and switch into planning mode at the point where the complexity becomes hard to manage.",
      "Use planning mode to explore the codebase and the dependencies and design the approach before editing anything."
    ],
    correct: 3,
    why: "Planning mode is built for large changes with several viable approaches and architectural consequences. Direct execution risks expensive rework, detailed instructions assume you already know the structure you are trying to discover, and switching late means the rework has already happened." },

  { id: "d1s09", dom: 0, diff: "standard", scen: "Customer support agent",
    text: "Logs show that in 12% of conversations the agent skips get_customer and calls lookup_order with only the name the customer typed, which has produced refunds on the wrong account. What fixes this most effectively?",
    opts: [
      "A routing classifier that inspects each request and exposes only the subset of tools appropriate to it.",
      "A strengthened system prompt stating that customer verification through get_customer is mandatory before any order operation whatsoever.",
      "Few-shot examples showing the agent calling get_customer first even when the customer volunteers order details.",
      "A programmatic precondition that blocks lookup_order and process_refund until get_customer has returned a verified customer id."
    ],
    correct: 3,
    why: "Where a tool sequence carries financial consequences, only code gives a deterministic guarantee. Prompt wording and examples raise compliance without ever reaching certainty, and a classifier controls availability rather than ordering." },

  { id: "d4s02", dom: 3, diff: "standard", scen: "Claude Code for CI",
    text: "Findings are real but not actionable — \"complex ticket routing logic\", \"potential null pointer\", with nothing to change. Adding \"always include a concrete fix suggestion\" produced output that is sometimes detailed and sometimes still vague. Which technique reliably fixes the format?",
    opts: [
      "Refine the instruction further still, specifying each required part of the finding format separately and in more detail.",
      "Split it into two passes, one that identifies issues and one that generates fixes for them.",
      "Widen the context to include more of the surrounding codebase so concrete fixes are possible.",
      "Add three or four few-shot examples showing exactly the required shape: issue, location, concrete fix."
    ],
    correct: 3,
    why: "When instructions alone give variable output, examples are the reliable next step: they show the shape instead of describing it. More instruction text is more of what already failed, and neither splitting the work nor adding context makes the format consistent." },

  { id: "d1s06", dom: 0, diff: "standard", scen: "Multi-agent research system",
    text: "A coordinator spawns a document analysis subagent with the Task tool. The subagent keeps producing shallow output that ignores what earlier agents already found. What does the coordinator have to change?",
    opts: [
      "Give the subagent a longer system prompt so it knows to consult the coordinator's earlier conversation.",
      "Put everything the subagent needs into the Task prompt itself — the document, prior findings and the expected output shape.",
      "Have the subagent call back to the coordinator for context whenever its own prompt is insufficient.",
      "Raise the subagent's max_tokens so it has room to reason over the coordinator's accumulated history."
    ],
    correct: 1,
    why: "Subagents start with an empty context and inherit none of the coordinator's history. Anything they need has to be passed explicitly in the prompt; no setting makes context leak across the boundary." },

  { id: "d5c01", dom: 4, diff: "challenging", scen: "Customer support agent",
    text: "Customers refer to figures they mentioned earlier — \"the 15% discount I was offered\" — and the agent replies with the wrong number. Those details were stated more than twenty turns ago and have since been condensed into \"promotional pricing was discussed\". What fixes this?",
    opts: [
      "Rewrite the summarisation prompt to preserve all numbers, percentages, dates and stated expectations verbatim.",
      "Raise the summarisation threshold from 70% to 85% so conversations run longer before anything is compressed.",
      "Extract transactional facts — amounts, dates, order numbers — into a case-facts block sent with every prompt, outside the summarised history.",
      "Store the full history externally and retrieve from it whenever the customer says \"as I mentioned\"."
    ],
    correct: 2,
    why: "Summarisation loses precision by design, so the values have to live somewhere summarisation does not reach. A better summarisation prompt degrades more slowly, a higher threshold delays the same loss, and retrieval triggered by a phrase misses every reference that is worded differently." },

  { id: "d3s12", dom: 2, diff: "standard", scen: "Developer productivity tools",
    text: "A long investigation session is approaching its context limit but the work is not finished. Which built-in mechanism reduces context usage without abandoning the session?",
    opts: [
      "--resume, which reloads the session from its last saved checkpoint with a smaller context.",
      "fork_session, which starts a branch carrying only the most recent exchanges.",
      "/compact, which condenses the accumulated history so the session can continue.",
      "context: fork, which moves the existing history into an isolated subagent."
    ],
    correct: 2,
    why: "/compact is the in-session compression mechanism. --resume reopens a session later, fork_session branches a line of work from shared context, and context: fork is skill frontmatter rather than something you invoke mid-session." },

  { id: "d5s02", dom: 4, diff: "standard", scen: "Multi-agent research system",
    text: "Aggregated subagent output runs to about 75K tokens. The synthesis agent reliably cites the first 15K and the last 10K, but keeps missing findings in the middle 50K even when they answer the research question directly. What does this describe?",
    opts: [
      "The lost-in-the-middle effect — long inputs are processed most reliably at their start and end.",
      "Tool result accumulation — the middle is tool output the model treats as lower priority than text.",
      "Context window overflow — the middle section is silently truncated before the model sees it.",
      "Progressive summarisation loss — the middle was compressed when the context was compacted."
    ],
    correct: 0,
    why: "Nothing is missing from the input; it is being attended to unevenly. That positional pattern is the lost-in-the-middle effect, and it is why long inputs need structure rather than just more room." },

  { id: "d1s03", dom: 0, diff: "standard", scen: "Conversational AI architecture",
    text: "Users refine their playlist preferences over several turns. Two messages after a user said \"I love jazz\", Claude asks \"What genres do you enjoy?\". What is the most likely cause?",
    opts: [
      "The Messages API needs a session_id parameter to associate requests with the same conversation.",
      "The conversation has exceeded the model's context window and the earliest turns were dropped.",
      "Your application is not including the earlier messages in the messages array of each request.",
      "Server-side memory requires a vector store to be attached before earlier turns can be recalled."
    ],
    correct: 2,
    why: "The API is stateless: every request must carry the history you want Claude to see. Two messages cannot overflow a context window, and neither session identifiers nor vector stores are part of how the API keeps state." },

  { id: "d5s07", dom: 4, diff: "standard", scen: "Structured data extraction",
    text: "An extraction pipeline reports 97% overall accuracy, and the team proposes removing human review entirely. What is the most important objection?",
    opts: [
      "97% is below the 99% threshold at which automated extraction is normally considered safe.",
      "Accuracy measured on a validation set does not transfer to production without recalibration.",
      "Without human review there is no labelled data left, so accuracy can never be measured again.",
      "An aggregate can hide a document type or field that performs far worse than the average."
    ],
    correct: 3,
    why: "Aggregate metrics mask segments. Before automating you validate accuracy by document type and by field, because a single poorly-performing combination can be responsible for most of the real-world damage." },

  { id: "d4c03", dom: 3, diff: "challenging", scen: "Conversational AI architecture",
    text: "An assistant with a contractor-persona system prompt follows it early on, but by turn seven gives generic advice. The whole conversation is only 2,500 tokens. What is the most likely cause?",
    opts: [
      "System prompts set initial behaviour only, and sustained behaviour needs reinforcement in the user turns.",
      "The system prompt is sent only on the first request, so later turns run without it.",
      "Accumulated assistant turns increasingly dominate the visible pattern, so the model matches its own recent output rather than the persona.",
      "Attention weakens as the number of turns grows, independently of how many tokens they contain."
    ],
    correct: 2,
    why: "At 2,500 tokens nothing is being lost to length. What changes is the proportion: several assistant turns of generic prose become the strongest pattern in view. The system prompt is sent every request, so its absence cannot be the explanation." },

  { id: "d3c10", dom: 2, diff: "challenging", scen: "Claude Code for CI",
    text: "False-positive rates by category: security and correctness 8%, performance 18%, style and naming 52%, documentation 48%. Surveys show developers dismissing findings unread because \"half are wrong\", and the noisy categories are eroding trust in the accurate ones. What best restores trust?",
    opts: [
      "Leave every category on but show a confidence score with each finding so developers can decide what to look at.",
      "Reduce strictness uniformly across all categories to bring the overall false-positive rate down.",
      "Leave every category on and add few-shot examples over the coming weeks to lift accuracy in the weak ones.",
      "Turn off the high-false-positive categories for now, keep the precise ones running, and improve their prompts before re-enabling."
    ],
    correct: 3,
    why: "Trust is being destroyed faster than accuracy can be improved, so the noise has to stop now while the precise categories keep delivering. The other options all leave the 52% category in front of developers while you work." },

  { id: "d5c02", dom: 4, diff: "challenging", scen: "Multi-agent research system",
    text: "Combined output from the web-search agent (85K tokens of page content) and the document analysis agent (70K tokens including reasoning traces) reaches 155K tokens, but synthesis performs best under 50K. Which solution is most effective?",
    opts: [
      "Have synthesis process the findings in sequential batches, carrying state between the calls.",
      "Insert an intermediate summarisation agent that condenses the findings before they reach synthesis.",
      "Store the findings in a vector database and give synthesis search tools to query during its work.",
      "Change the upstream agents to return structured findings — key facts, quotes, relevance — instead of raw content and reasoning."
    ],
    correct: 3,
    why: "Fix it at the source: most of those 155K tokens are page content and reasoning traces that synthesis never needed. Every other option pays to transport, compress or index material that should not have been produced in that form." },

  { id: "d4c10", dom: 3, diff: "challenging", scen: "Conversational AI architecture",
    text: "Requests like \"Book a venue for the party\" trigger four or more clarifying questions, and 35% of users abandon the conversation. What best improves the trade-off?",
    opts: [
      "Proceed on sensible defaults without mentioning them, and adjust if the user objects to the result.",
      "Replace the questions with a short structured intake form covering the required details.",
      "State the assumptions being made explicitly, proceed on them, and invite corrections.",
      "Ask all the clarifying questions at once in a single compound message instead of one at a time."
    ],
    correct: 2,
    why: "Stating assumptions gives an immediate useful answer while leaving the user in control. A compound question still demands the same effort up front, silent defaults leave the user unable to spot a wrong one, and a form adds friction in a flow that is already losing people to friction." },

  { id: "d1s10", dom: 0, diff: "standard", scen: "Customer support agent",
    text: "Your agent misreads tool output: get_customer returns Unix timestamps, lookup_order returns ISO 8601 dates, and a third-party MCP server you cannot modify returns numeric status codes. What is the most maintainable way to normalise this?",
    opts: [
      "Detailed documentation of each tool's conventions in the system prompt so the agent converts as it reads.",
      "A PostToolUse hook that rewrites tool output into consistent formats before the agent ever sees it.",
      "Wrappers around the tools you own plus format fixes inside them, leaving third-party output as it is.",
      "A normalize_data tool that the agent is instructed to call after every retrieval to convert the values."
    ],
    correct: 1,
    why: "A PostToolUse hook is one deterministic place that covers every tool, third-party servers included. The alternatives either depend on the model remembering to convert, or leave the servers you do not control untouched." },

  { id: "d3c07", dom: 2, diff: "challenging", scen: "Code generation with Claude Code",
    text: "You need Slack added as a notification channel. Email, SMS and push already follow an established pattern, but Slack offers incoming webhooks (simple, one-way), bot tokens (delivery confirmation and programmatic control) or a Slack App (two-way events, needs workspace approval). The ticket says \"add Slack support\" and nothing else. How do you start?",
    opts: [
      "Execute directly with incoming webhooks, matching the one-way pattern the existing channels already use.",
      "Execute directly by scaffolding a Slack channel class from the existing pattern and deciding the mechanism later.",
      "Enter planning mode, explore the three integration options and their implications, and agree an approach before implementing.",
      "Execute directly with bot tokens, on the grounds that it is the only option which leaves delivery confirmation available later on."
    ],
    correct: 2,
    why: "Several valid approaches with materially different architecture, and requirements that do not choose between them, is the definition of a planning-mode task. Each direct-execution option silently commits you to an answer the ticket never gave." },

  { id: "d3c08", dom: 2, diff: "challenging", scen: "Developer productivity tools",
    text: "A teammate argues that everything in .claude/rules/ could live in CLAUDE.md, since Claude will work out what is relevant. What is the strongest technical counter-argument?",
    opts: [
      "Rules with path globs apply deterministically to the files being touched, instead of relying on the model to infer relevance.",
      "Rules files are loaded lazily, so they keep the session's initial context smaller than one large CLAUDE.md.",
      "Rules can be overridden per developer, whereas CLAUDE.md applies identically to everyone on the team.",
      "CLAUDE.md is capped in size, so guidance beyond that limit has to live in rules files anyway."
    ],
    correct: 0,
    why: "The argument is about determinism: a glob either matches the file or it does not, while a section in a long file depends on the model noticing it applies. Claude Code does not enforce a size cap, and both mechanisms have the same personal-override story." },

  { id: "d2s01", dom: 1, diff: "standard", scen: "Customer support agent",
    text: "Logs show the agent calling get_customer when users ask about orders. Both tools carry minimal descriptions — \"Gets customer information\" and \"Gets order details\" — and accept similar-looking identifiers. What is the most effective first step?",
    opts: [
      "Add a routing layer that inspects the message and preselects a tool from keywords and id patterns.",
      "Expand each description with input formats, example queries, edge cases and the boundary against the similar tool.",
      "Add five to eight few-shot examples to the system prompt routing order questions to lookup_order.",
      "Merge them into one lookup_entity tool that takes any identifier and picks the backend internally."
    ],
    correct: 1,
    why: "The description is the model's primary selection mechanism, so a thin description is the root cause and the cheapest thing to fix. Examples, merging and routing layers all add machinery around a gap you have not closed." },

  { id: "d5s10", dom: 4, diff: "standard", scen: "Developer productivity tools",
    text: "During a long codebase investigation, the agent's answers become vaguer and it starts describing \"typical patterns\" instead of the actual classes it read earlier. What is happening and what helps?",
    opts: [
      "The session has hit a turn limit and is running in a reduced mode; start a new session to reset it.",
      "Context degradation over a long session; write key findings to a scratchpad file and refer back to them.",
      "Tool results have been silently dropped from the history; re-run the tool calls to restore them.",
      "The model has switched to its training priors because the repository is unusual; provide more examples from it."
    ],
    correct: 1,
    why: "Generic answers late in a long session are the classic sign of context degradation. A scratchpad carries specific findings across context boundaries so they survive whatever happens to the conversation history." }

];

/* The five papers. 30 items each, 60 minutes, scored on the exam's own
   100–1000 scale with the pass mark at 720. */

window.CCARF_MOCKS = [
  { id: "a", label: "Mock exam A", diff: "Standard", minutes: 60,
    blurb: "A full-length standard paper: the same domain weights as the real exam, drawn from the core of each domain.",
    ids: ["d1s06", "d1s03", "d4s05", "d5s04", "d1s05", "d3s01", "d2s04", "d1s04", "d2s02", "d2s05", "d1s08", "d1s02", "d5s03", "d3s05", "d5s02", "d5s01", "d3s06", "d5s05", "d3s04", "d2s03", "d4s03", "d1s07", "d4s02", "d4s04", "d4s06", "d4s01", "d1s01", "d2s01", "d3s02", "d3s03"] },

  { id: "b", label: "Mock exam B", diff: "Standard", minutes: 60,
    blurb: "A second standard paper. No question is shared with Mock A, so the two together cover every standard item in the bank.",
    ids: ["d1s12", "d1s14", "d4s11", "d3s08", "d2s06", "d4s08", "d1s11", "d2s09", "d3s09", "d3s12", "d4s12", "d1s10", "d5s08", "d2s08", "d1s15", "d3s07", "d3s10", "d2s10", "d1s13", "d4s07", "d5s07", "d5s06", "d4s10", "d5s10", "d5s09", "d1s16", "d4s09", "d1s09", "d2s07", "d3s11"] },

  { id: "c", label: "Mock exam C", diff: "Challenging", minutes: 60,
    blurb: "Harder scenarios: multi-constraint situations where two answers look defensible and one principle separates them.",
    ids: ["d1c01", "d5c03", "d3c05", "d2c02", "d1c05", "d3c04", "d5c05", "d2c03", "d4c06", "d1c04", "d5c01", "d5c04", "d1c07", "d1c06", "d2c04", "d3c01", "d4c05", "d3c03", "d3c06", "d1c08", "d4c02", "d5c02", "d2c05", "d1c02", "d4c01", "d3c02", "d4c04", "d4c03", "d2c01", "d1c03"] },

  { id: "d", label: "Mock exam D", diff: "Challenging", minutes: 60,
    blurb: "The hardest paper. Longer scenarios, quantified trade-offs, and distractors written to be the answer most candidates reach for first.",
    ids: ["d1c11", "d3c08", "d2c10", "d4c10", "d3c07", "d4c08", "d5c06", "d2c06", "d4c11", "d3c09", "d4c07", "d5c07", "d5c10", "d1c09", "d3c11", "d1c15", "d4c09", "d4c12", "d5c09", "d1c12", "d3c12", "d1c14", "d2c08", "d5c08", "d1c16", "d2c07", "d1c10", "d3c10", "d1c13", "d2c09"] },

  { id: "e", label: "Mock exam E", diff: "Practical", minutes: 60,
    blurb: "The practical paper: four production scenarios worked end to end, including five situations the other papers never put to you. The only paper that revisits questions from A–D.",
    ids: ["d3p01", "d5c02", "d2p01", "d1c03", "d4s01", "d4s02", "d5c01", "d2s05", "d5p01", "d3c11", "d5s09", "d5p02", "d1c08", "d1c10", "d1c01", "d4s10", "d4s08", "d3c09", "d3s04", "d3s09", "d2s01", "d2c02", "d3c02", "d1s09", "d4c09", "d2s10", "d4c07", "d1c06", "d1p01", "d1s14"] }

];
