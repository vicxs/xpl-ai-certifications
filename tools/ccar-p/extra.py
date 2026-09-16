# -*- coding: utf-8 -*-
"""The wiki's own CCAR-P items — the only ones here that are not the port.

The ported source covers architecture, RAG, evaluation and governance well, but
it predates most of the current product surface: context editing, compaction,
the memory tool, the effort parameter, the Files API, eager tool streaming,
deferred tool loading, the model lifecycle, and the operational side of Claude
Code (telemetry, /mcp, session hygiene). Those are examinable and the bank had
nothing on them — zero occurrences of most of those terms.

These 16 items close that gap. Every factual claim is taken from the documents
cited in `src` on each item, read in September 2026; nothing here is copied from
another practice bank. That also makes them the items most likely to date: when
a cited page changes, re-read it and fix the item rather than trusting it.

Each entry is a source-shaped question — the same keys `source.json` uses, so
`emit.py` resolves and permutes it exactly like a ported one — plus:

    id        its bank id, 'ap<domain>x<n>'
    paper     's' (standard) or 'c' (challenge)
    replaces  the ported item whose slot it takes in that paper

A replacement is always within the same domain, so the papers keep their 63
items at the blueprint weights. The replaced item is not deleted: it stays in
the bank, drillable, just no longer on a paper.
"""

API = "https://platform.claude.com/docs/en/build-with-claude"
TOOLS = "https://platform.claude.com/docs/en/agents-and-tools"
DEPRECATIONS = "https://platform.claude.com/docs/en/about-claude/model-deprecations"
CC = "https://code.claude.com/docs/en"

EXTRA = [

# ---------------------------------------------------------------- standard ---

 dict(id="ap2x01", paper="s", replaces="ap2s06", d=2, src=API + "/context-editing",
   q="A team enables server-side compaction on a long-running agent. After a few dozen turns the agent starts contradicting decisions it made earlier in the same session, and its token usage climbs back to where it was before compaction was switched on. Their loop appends the assistant's text to the history on every turn. What is the most likely cause?",
   o=["The loop is dropping the compaction blocks the response returns — the next request replays them in place of the history they replaced, so appending only the text loses the compacted state",
      "Compaction only folds up tool results, so a conversation whose turns are mostly prose is never compacted at all",
      "The trigger threshold is set too high, so compaction has not run yet and the context is simply full",
      "Compaction needs the memory tool declared alongside it, because the summary has nowhere to persist otherwise"],
   a=[0],
   e="Compaction summarises earlier context and hands back blocks that the next request must carry: they stand in for the history they replaced. A loop that pulls the text out of the response and appends that string silently discards them, so the model loses what was summarised and the history grows again. Append the content blocks, not the text."),

 dict(id="ap2x02", paper="s", replaces="ap2s05", d=2, src=API + "/extended-thinking",
   q="A chat feature answers routine product questions at the model's default effort. The team must cut its cost without changing the model or rewriting the prompt. Which move is the right one to try first, and why?",
   o=["Lower the effort level on that route: effort governs how much the model thinks before answering, and routine chat rarely repays the default",
      "Set the sampling temperature to zero so the model stops exploring alternatives and emits fewer tokens",
      "Raise the output token limit so responses are never truncated and retried",
      "Move the route to the batch API, which halves the cost of every request"],
   a=[0],
   e="Effort runs from low to max and defaults to high. It is the first quality-trading lever after the free wins, and the workloads that repay a high setting are coding and long-horizon agent work — chat and classification usually hold their quality several steps down. Batch really is half price but only for work that can wait, a larger output limit does not reduce what is generated, and sampling parameters are rejected outright on current models."),

 dict(id="ap3x01", paper="s", replaces="ap3s09", d=3, src=TOOLS + "/tool-use/tool-search-tool",
   q="An agent carries 60 tools and their definitions dominate its context. The team marks every tool for deferred loading and adds a tool-search tool so that definitions load only when they are needed. The API rejects the request. Why?",
   o=["At least one tool has to stay loaded and the search tool itself must never be deferred — otherwise the model has no entry point to search from",
      "Deferred loading is capped at 32 tools, so the set has to be split across two servers",
      "Tool search runs inside the code-execution sandbox, which has to be declared alongside it",
      "Each deferred tool must name its permitted callers, which the team has not done"],
   a=[0],
   e="Deferring everything leaves nothing for the model to start from, and the API refuses it in as many words. The search tool stays loaded and at least one other tool must too; from there the model searches for what it needs. Search comes in regex and BM25 variants, neither of which involves the code-execution sandbox, and naming permitted callers belongs to programmatic tool calling."),

 dict(id="ap3x02", paper="s", replaces="ap3s03", d=3, src=API + "/tool-use/implement-tool-use",
   q="A streaming agent calls a tool whose input is an entire file, and users watch a multi-second pause after the model has finished thinking before anything happens. The team turns on eager input streaming for that tool. What has to change in the handler at the same time?",
   o=["The handler must validate the input itself: with eager streaming the API stops coercing and validating it, so a truncated or malformed payload can reach the tool",
      "Nothing — the SDK still guarantees the input matches the tool's schema before the handler is called",
      "The handler must buffer the partial input and ask for the tool call again once the stream closes, since partial input cannot be executed",
      "The tool must be redeclared as a server tool, because eager streaming is only available to Anthropic-hosted tools"],
   a=[0],
   e="Eager input streaming trades the API's validation for latency: parameters stream as they are generated instead of arriving in one burst after the server has buffered and checked them. From then on the client owns validation — guard the parse, check the parsed input against the schema, and treat a failure the way you would treat invalid JSON. It is a field on a client-side tool in a streaming request, not a beta and not a server-tool feature."),

 dict(id="ap4x01", paper="s", replaces="ap4s08", d=4, src=API + "/prompt-caching",
   q="A team adds prompt caching to a high-volume endpoint and expects a large saving. A week later the bill is unchanged. Which single check tells them whether caching is working at all?",
   o=["The cache-read token count on the responses: if it stays at zero across repeated requests, something inside the cached prefix is changing on every call",
      "The p95 latency before and after, since caching that works always shows up as a latency drop",
      "The token-counting endpoint before and after, since caching reduces the counted input tokens",
      "The number of cache breakpoints in the request, since caching only becomes active once all four available breakpoints are used"],
   a=[0],
   e="Every response reports how many input tokens it read from cache. Zero reads across repeated requests is the signal that a silent invalidator sits inside the prefix — a timestamp in the system prompt, an unsorted JSON blob, a tool list assembled in a different order — because caching matches an exact prefix and one changed byte invalidates everything after it. Counting tokens tells you nothing about cache state, latency is a consequence rather than the diagnostic, and a request caches from its first breakpoint — four is the ceiling, not a quota to fill."),

 dict(id="ap6x01", paper="s", replaces="ap6s07", d=6, t="cls", src=DEPRECATIONS,
   q="Classify each statement about Anthropic's model lifecycle by the state it describes.",
   cats=["Active", "Legacy", "Deprecated", "Retired"],
   s=[["Fully supported and the recommended choice for new work", 0],
      ["Still answering requests, but no longer recommended, with a published replacement and a retirement date", 2],
      ["Requests naming the model now fail", 3],
      ["Still supported but receiving no further updates, and a candidate for deprecation later", 1],
      ["The state a model is in when customers with active deployments are given their 60-day notice", 2]],
   e="The lifecycle runs Active, Legacy, Deprecated, Retired. Deprecation is the state where a replacement and a date exist and the model still answers; retirement is when requests start failing. Anthropic gives at least 60 days' notice to customers with active deployments of a publicly released model, and those dates cover the Anthropic-operated platforms — partner clouds publish their own schedules, so the same model can be retired on one and active on another."),

 dict(id="ap7x01", paper="s", replaces="ap7s02", d=7, src=CC + "/monitoring-usage",
   q="A platform engineer turns Claude Code telemetry on for every developer through managed settings. A week later the team's OTLP collector has received nothing, and no error has been reported anywhere. What is missing?",
   o=["An exporter and a destination: the enable flag only starts collection, and without an exporter per signal plus an OTLP endpoint and protocol nothing leaves the machine",
      "Credentials: Claude Code refuses to export until an authorization header is configured for the collector",
      "A scrape configuration: the push path is reserved for Enterprise plans, so collectors have to pull metrics instead",
      "Per-developer consent: telemetry cannot be enabled centrally, so each developer has to opt in from their own session"],
   a=[0],
   e="The enable flag is the one required variable and all it does is start collection. Export needs an exporter chosen for metrics, for logs, or for both, and — for OTLP — an endpoint and a protocol; a console exporter is the quick way to prove the pipeline before pointing it at a collector. Headers are optional authentication, a pull-based exporter is an alternative rather than the only path, and distributing exactly this set of variables is what managed settings are for."),

 dict(id="ap7x02", paper="s", replaces="ap7s03", d=7, src=CC + "/costs",
   q="A developer keeps one Claude Code session open all day, moving between unrelated tasks in it, and their usage climbs even in stretches where they barely type. What should they be told to do, and why?",
   o=["Clear the session when the work changes: the whole conversation is re-sent on every request, so stale context is paid for on each message",
      "Compact on every task switch: compacting is the cheap operation, where clearing forces the conversation to be reprocessed from scratch",
      "Leave it open: history is re-read at the cached rate, so a day-old session costs no more than a fresh one",
      "Lower the thinking budget, since thinking tokens are what accumulate across a long session"],
   a=[0],
   e="Claude Code sends the full conversation with every request, so a long session pays for its history on each message even at the cached rate — and the first message after the cache lifetime lapses reprocesses all of it. Clearing between unrelated tasks costs nothing. Compaction is the tool for continuity within one task, not for a task switch, and it is itself a large request because it reads the conversation it summarises."),

# --------------------------------------------------------------- challenge ---

 dict(id="ap2x03", paper="c", replaces="ap2c06", d=2, t="cls", src=API + "/context-editing",
   q="Classify each description by the context mechanism it describes.",
   cats=["Context editing", "Compaction", "Memory tool"],
   s=[["Removes old tool results from the conversation, leaving a placeholder where each one was", 0],
      ["Summarises earlier history as it approaches a token threshold, returning blocks the next request has to carry", 1],
      ["Lets the model store facts and read them back in a separate conversation days later", 2],
      ["Can also drop the thinking blocks of earlier turns", 0],
      ["Is a tool the model calls, declared in the request like any other", 2]],
   e="The three are routinely confused and they do different work. Editing clears — tool results, optionally the tool inputs too, or thinking blocks — leaving a placeholder that tells Claude something was removed. Compaction summarises, and the blocks it returns have to be replayed or the state is lost. Memory is a tool the model calls, and the only one of the three whose effect outlives the conversation."),

 dict(id="ap2x04", paper="c", replaces="ap2c01", d=2, src=DEPRECATIONS,
   q="A classifier is moved from an older model to a current one. Its request sets a sampling temperature of zero, which the team describes as the setting that makes the classifier deterministic. What happens, and what should they do?",
   o=["The request is rejected: sampling parameters return an error on current models when set to a non-default value, so the output shape has to be constrained by structured output and prompting instead",
      "Nothing changes: the parameter is ignored on current models and the request is served as before",
      "The request succeeds but is billed as a thinking request, since a temperature of zero forces the model to reason before answering",
      "It works as they expect, and a temperature of zero does guarantee byte-identical output for identical input"],
   a=[0],
   e="Temperature and the other sampling parameters are deprecated and return an error on current models when set to a non-default value; the Python SDK removed them outright, so the call fails before it is even sent. They were never the determinism guarantee they are remembered as either — a temperature of zero lowers variance, it does not remove it. Where the output shape matters, constrain it and let the prompt carry the rest."),

 dict(id="ap3x03", paper="c", replaces="ap3c11", d=3, src=API + "/tool-use/web-search-tool",
   q="A service gives Claude the web search tool. Its monitoring counts thrown exceptions to detect failures and has never recorded one, yet users report answers that plainly ignored the search. What did the team get wrong?",
   o=["A server-tool failure comes back as an ordinary success response with an error object inside the tool-result block, so nothing is ever raised for their monitoring to catch",
      "Search failures are reported asynchronously through the batch results endpoint, which they are not polling",
      "The tool falls back silently to the model's own knowledge, which is indistinguishable from a successful search",
      "An exception is raised only when the use limit is exceeded; every other failure is retried by the SDK until it succeeds"],
   a=[0],
   e="Server tools run on Anthropic's side and report their own failures in the response body: the result block's content carries an error object instead of the usual list of results, and the HTTP call succeeds. Monitoring that counts exceptions sees nothing. Inspect the result blocks — and branch on their shape before indexing, because a success is a list where a failure is a single object."),

 dict(id="ap3x04", paper="c", replaces="ap3c09", d=3, src=API + "/files",
   q="An assistant answers questions about the same 80-page policy document for thousands of users a day, base64-encoding the PDF into every request. Uploads are slow and the team is close to the request size limit. Which change addresses the root problem?",
   o=["Upload the document once and reference it by its file id in each request, so its bytes do not travel on every call",
      "Split the document into 500-token chunks and paste the three most relevant into each request, since a document cannot be reused across requests",
      "Move the traffic to the batch API, which deduplicates identical attachments within a batch",
      "Raise the workspace's request size limit so the encoded document stops being the bottleneck"],
   a=[0],
   e="The Files API exists for this: upload once, then point at the file from a document block in every later request. Note what it does and does not fix — it removes the payload, not the tokens, since the document is still processed on each request, and prompt caching is the lever for that. Retrieval is a reasonable architecture but a different one, and the limit is a symptom rather than the constraint to raise."),

 dict(id="ap4x02", paper="c", replaces="ap4c06", d=4, src=API + "/prompt-caching",
   q="A team is asked to cut the running cost of a production feature without giving up quality. Which TWO moves should come first? (Select TWO)",
   o=["Make the request prefix stable, cache it, and confirm from the responses that the reads are actually happening",
      "Establish cost per completed task, rather than per request, before changing anything",
      "Cascade to a cheaper model for the easy cases, keeping the current model as the fallback",
      "Lower the effort level across every route to the lowest one the hardest route can tolerate"],
   a=[0, 1],
   e="Caching is a free win: it changes what the same output costs rather than trading anything away, and it is only real once the responses show cache reads. The denominator matters as much — a cheaper request that needs more turns or retries is not cheaper. Effort is the next lever but it is tuned per route, not clamped globally to the hardest one, and a multi-model cascade should be measured against the simpler alternative first: the same model at lower effort, which also keeps one cache namespace instead of splitting it."),

 dict(id="ap6x02", paper="c", replaces="ap6c07", d=6, src=DEPRECATIONS,
   q="An email announces that a model your production system depends on will retire in 90 days. The same system also runs on a partner cloud. What does the architect do first?",
   o=["Export the usage report to find every key and service still calling the model, and check the partner cloud's schedule separately, because it publishes its own dates",
      "Nothing yet: a deprecated model keeps serving requests, and retirement dates are extended on request for customers with active deployments",
      "Cut every environment over to the replacement this week, since requests to a deprecated model already fail intermittently",
      "Pin the model to a dated snapshot, which is exempt from retirement once it is already running in production"],
   a=[0],
   e="The first move is finding out where the model is actually called: the console's usage export breaks usage down by API key and by model, which is what turns a vendor email into a work list. The second is remembering that partner-operated platforms set their own lifecycle dates, so one environment can be past its deadline while another is not. A deprecated model answers normally until its date, the notice is at least 60 days for a publicly released model — time to test the replacement rather than swap blind — and no snapshot is exempt."),

 dict(id="ap7x03", paper="c", replaces="ap7c01", d=7, src=CC + "/monitoring-usage",
   q="Telemetry is configured centrally through managed settings. A developer sets a per-signal endpoint variable on their own machine to send Claude Code metrics to a collector of their own. What happens, and why is that the designed behaviour?",
   o=["It is ignored: a managed OTLP endpoint or header removes the conflicting developer variables, so telemetry cannot be redirected and the organisation's credentials cannot be carried somewhere else",
      "It takes effect: a per-signal variable always overrides a generic one, which is why managed settings should set the per-signal variables instead",
      "It is ignored, but only because per-signal endpoints are unsupported — the generic endpoint is the only one that is ever read",
      "Both collectors receive the data, since the exporter fans out to every configured endpoint"],
   a=[0],
   e="For telemetry, managed settings are deliberately more than a default. Setting the endpoint removes the per-signal endpoints, and setting the headers removes per-signal headers and endpoints as well, so a credential issued for the organisation's collector cannot be pointed at another one. Per-signal variables do override generic ones — but only among the settings a developer is still allowed to set."),

 dict(id="ap7x04", paper="c", replaces="ap7c03", d=7, src=CC + "/mcp",
   q="An internal ticket server shows as connected in Claude Code with its tools listed, but Claude never calls them. Which TWO checks address the likeliest causes? (Select TWO)",
   o=["Whether the permission rules name each tool in its full prefixed form — a server provided by a plugin carries a longer name that the rule has to match exactly",
      "Whether the same server name is configured in more than one scope, so the definition in use is not the one being edited",
      "Whether the server's results exceed the output limit, which withdraws its tools from the model until the limit is raised",
      "Whether the server speaks over standard input rather than HTTP, since only an HTTP server can be used from a project scope"],
   a=[0, 1],
   e="A server can be connected and its tools still unusable. The two usual causes are a permission rule that does not match the tool's full name — plugin-provided servers prefix it with the plugin as well as the server — and the same name defined in two scopes, so the file being edited is not the definition that loaded. Oversized results are written to a file rather than hiding the tools, and the transport has nothing to do with which scope a server can live in."),

]
