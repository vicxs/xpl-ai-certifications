# -*- coding: utf-8 -*-
# Distractors lengthened so the correct answer is not systematically the longest
# option. Only wording changes; the reasoning behind each distractor is unchanged.
import common

FIX = {
 "d1c11": (0, "Enumerate the steps in the order they should run — search, analyse, synthesise, write — so that every run follows the same known-good path."),
 "d1s16": (1, "The session cannot be resumed at all once the working tree has changed underneath it, and will start again from an empty context."),
 "d2s07": (0, "Extraction fails validation on exactly those documents; add a retry loop that re-runs them with a longer and more explicit prompt."),
 "d3s07": (0, "Create a personal skill under a different name such as /my-commit, leaving the team's shared project skill entirely untouched."),
 "d2c02": (0, "Change get_customer to rank the matches internally and return only the single most likely one, so the ambiguity never reaches the model at all."),
 "d1s01": (0, "Check whether the response contains assistant text — if Claude has produced an explanation for the customer, the work is finished."),
 "d3c11": (0, "Add a post-processing filter that drops any finding matching an earlier one by file path and issue description before it is posted."),
 "d1s15": (2, "/compact, followed by asking both questions in the same session, which keeps the whole comparison together in one place."),
 "d3c01": (0, "Split the whole file into .claude/rules/ entries with glob patterns, so that each part loads only for the file types it actually covers."),
 "d3c05": (0, "Synchronous calls for the blocking style checks and for the nightly test generation; the Batches API only for the weekly security audits."),
 "d3s08": (1, "README.md files placed in the relevant subdirectories, which Claude loads automatically as instructions for the code in that area."),
 "d4c05": (0, "Exactly the same repair request again, on the basis that the model frequently succeeds on a third attempt with identical input."),
 "d4s12": (0, "Both in the user turn, with the instructions placed immediately after the document so that the model reads them last of all."),
 "d1c14": (2, "Abort the run and surface an error to the caller, on the basis that a truncated turn leaves the conversation in an unusable state."),
 "d1c15": (2, "Every read-only tool in the system, on the basis that reading causes no side effects and widens what the agent is able to verify."),
 "d4s02": (0, "Refine the instruction further still, specifying each required part of the finding format separately and in more detail."),
 "d5c06": (1, "Set it at a round number such as 0.9 and then adjust it over time as corrections come back from users downstream."),
 "d1c01": (0, "The document analysis agent's relevance criteria are too strict, and they filter the non-visual sources out of its results."),
 "d2c06": (0, "Mark most of the parameters optional with documented defaults, so that a typical call only needs customer_id, order_id and amount."),
 "d1c03": (0, "Let both agents run in parallel exactly as they do now, and have the coordinator deduplicate the overlapping results before synthesis."),
 "d2c09": (0, "The committed project file is only read at first launch, so the developer needs to restart Claude Code before that entry takes effect."),
 "d3s10": (2, "Switch to headless mode with --continue, passing an explicit context summary between each of the batched calls in turn."),
 "d3s11": (1, "Only the project-level file is loaded automatically; the user-level and directory-level files have to be imported explicitly."),
 "d4c11": (1, "Give two separate recommendations, one for each of the stated priorities, and let the user choose between them."),
 "d1c05": (0, "Add composite tools such as get_customer_with_orders, bundling each of the common lookup combinations into a single call of its own."),
 "d1s04": (0, "Only the coordinator is able to serialise messages between agents, because the subagents each run in an isolated memory space."),
 "d1s09": (0, "A strengthened system prompt stating that customer verification through get_customer is mandatory before any order operation whatsoever."),
 "d2c07": (1, "Add a confidence score alongside the category and have downstream code discard any classification that falls below a threshold."),
 "d3c07": (1, "Execute directly with bot tokens, on the grounds that it is the only option which leaves delivery confirmation available later on."),
 "d1c08": (0, "Have the subagent always return a success status together with partial results, putting the error detail in metadata for the coordinator to inspect afterwards."),
 "d2s05": (2, "Write a wrapper MCP server that reads the tokens from a .env file and proxies the GitHub API, then commit that wrapper to the repository."),
 "d5c04": (2, "Aggregate the three outcomes into a single coverage percentage, with the detailed per-source logs available on request."),
 "d2c01": (1, "Apply exponential backoff uniformly to every failure, so that the transient errors recover and the remaining ones simply fail more slowly."),
 "d2s06": (1, "A raised exception, so that the failure surfaces in your own logs with a full stack trace attached to it."),
 "d5c08": (1, "Treat conflicting figures as unreliable and exclude both of them unless some third source agrees with one of the two."),
}

def apply():
    by_id = {q["id"]: q for q in common.BANK}
    for qid, (idx, text) in FIX.items():
        by_id[qid]["wrong"][idx] = text
