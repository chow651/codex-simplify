---
name: simplify
description: Use when running the simplify cleanup protocol on task-related code changes during code-task closure.
---

<SUBAGENT-STOP>
If you were dispatched as a read-only reviewer, advisor, or analyst without code ownership for the current task, skip this skill.
</SUBAGENT-STOP>

# Simplify

## Overview

Simplify is a finish-line discipline for code tasks.

Its job is to reduce future maintenance debt before you treat the current task as finished.

This skill is the execution protocol that runs after `using-simplify`, a user request, or a standing instruction has already decided simplify should happen.

## Protocol Version

Current protocol version: `0.2.1`

Keep `simplify` aligned with the same-version `using-simplify` router and any installed gate text that mirrors this protocol.

## Modes

Simplify runs in one of three modes:

- `Lite`
- `Standard`
- `Strict`

`using-simplify` must choose the mode before this skill starts.

If the caller did not provide a mode, stop and return to `using-simplify`. Do not re-decide mode here.

## When To Use

Run `simplify` when the current task has already been routed into simplify and all of these are true:

- the current task is code work, refactor work, bug-fix work, debugging follow-up, testing implementation, architecture implementation, or engineering implementation
- you are wrapping up the task, preparing to stop, or preparing to claim completion
- task-related code changes still exist
- the main implementation is already done

Do not run `simplify` at the start of a task.

Do not run it while you are still discovering requirements, debugging root cause, or deciding architecture.

## Skip Conditions

You may skip `simplify` only when at least one of these is true:

- there is no meaningful task-related code diff
- the task is non-code work
- you are acting as a read-only reviewer or advisor without implementation responsibility
- the user explicitly told you to stop before cleanup

If you skip, say so explicitly and give the reason.

If you are thinking "the diff is probably fine" or "I already looked once", that is not a skip condition. Continue into the protocol.

## Meaningful Diff

A meaningful diff means task-related changes to behavior-affecting files such as:

- source code
- tests
- scripts
- build or runtime configuration
- agent behavior configuration
- manifest files that change tool or runtime behavior
- prompts or instructions that change agent behavior

It does not mean:

- docs-only edits
- comments-only edits
- formatting-only edits
- unrelated generated churn
- unrelated metadata changes with no behavior impact

## No Cleanup Needed

`No cleanup needed` is a valid end state.

Use it when all of these are true:

- the change stays local
- it follows existing repository patterns
- it does not add unnecessary abstraction, state, or duplication
- the affected path is already adequately verified

If you conclude `no cleanup needed`, still report:

- why no cleanup was needed
- what verification already covers the change

## The Rule

Before claiming completion:

1. classify the task
2. confirm the mode
3. choose the review tracks
4. review the current task scope
5. merge findings locally
6. either conclude `no cleanup needed` or fix the worthwhile findings
7. rerun the right level of verification
8. report the outcome

If you did not complete these steps, you did not finish simplify.

## Step 1: Classify The Task

Choose exactly one closure type:

- `feature`: adds new behavior or expands existing behavior
- `refactor`: improves structure while preserving behavior
- `bugfix`: corrects existing incorrect behavior with minimal intended scope change

If the task began as debugging, testing, or architecture implementation, map it to one of those three closure types before continuing.

## Step 2: Confirm The Mode

Read the chosen mode and execute the corresponding branch.

### Lite

Lite focuses on only three questions:

- did this change introduce obvious extra complexity
- did this change introduce obvious new risk
- what is the smallest meaningful verification to rerun

Lite output should stay short.

### Standard

Standard is the default branch for ordinary feature, bugfix, and refactor closure.

### Strict

Strict means:

- full track discipline
- stronger evidence thresholds
- broader verification than Lite or Standard

## Step 3: Choose Review Tracks

For `feature`:

- `repo_fit`
- `quality`
- `reuse`

For `refactor`:

- `quality`
- `repo_fit`
- `reuse`

For `bugfix`:

- `blast_radius`
- `repo_fit`
- `quality`

Add `efficiency` only when the diff shows at least one objective signal such as:

- new or modified function calls inside a loop body
- a changed helper or utility used from multiple call sites
- new I/O or network calls
- changed rendering work in code that runs repeatedly
- repeated data transformation added inside an already repeated path

## Track Meanings

### `repo_fit`

Look for:

- repository pattern drift
- naming drift
- boundary violations
- special-case logic that will spread
- new abstractions that should have reused existing ones

### `quality`

Look for:

- redundant state
- parameter sprawl
- copy-paste variants
- leaky abstractions
- stringly-typed branching
- unnecessary wrappers
- control-flow noise

### `reuse`

Look for:

- duplicated helpers
- hand-rolled utilities
- repeated transformations
- missed internal abstractions

### `blast_radius`

Look for:

- fixes that change too much surface area
- patch layering that increases fragility
- narrow fixes that add long-term branching or state

### `efficiency`

Look for:

- redundant work
- hot-path bloat
- recurring no-op updates
- missed concurrency
- unnecessary repeated checks
- avoidable memory growth

## Step 4: Review The Current Task Scope

Inspect only the current task scope:

- use `git diff`
- use `git diff --cached` if the staged diff is the intended target
- if the diff is empty, use the explicitly named edited files for the task

Do not expand this into a broad architecture review.

## Step 5: Review Mode

Prefer one read-only reviewer per selected track when subagents are available.

If subagents are unavailable, run the tracks sequentially yourself and keep the same review contract.

Reviewer rules:

- reviewers do not implement fixes
- reviewers stay within the assigned track
- reviewers return at most 3 findings each
- reviewers cite concrete files and lines when possible
- reviewers do not recommend speculative changes outside the current task scope

## Finding Contract

Keep the finding count proportional to the mode:

- `Lite`: at most 2 findings total
- `Standard`: at most 5 findings total
- `Strict`: at most 8 findings total

Status semantics:

- `no_issues`: the reviewer inspected the assigned scope and found nothing worth carrying forward
- `ok`: the reviewer inspected the assigned scope and is returning one or more findings
- `blocked`: the reviewer could not complete the assigned review and must say why

Lite merge rule:

- merge all reviewer findings first
- discard Lite findings below `P1`
- if more than 2 findings remain, sort by `severity` first and `fix_cost` second
- keep the top 2 only

Use this structure for findings:

```yaml
status: ok | no_issues | blocked
task_type: feature | refactor | bugfix
track: repo_fit | quality | reuse | blast_radius | efficiency
inspected_files:
  - path/to/file
findings:
  - severity: P0 | P1 | P2 | P3
    confidence: high | medium | low
    file: path/to/file
    line: 123
    problem: short problem statement
    why_it_matters: concrete maintenance or correctness impact
    maintenance_impact: low | medium | high
    fix_cost: low | medium | high
    recommended_action: concrete suggested action
```

## Severity Rules

- `P0`: correctness risk, regression risk, broken constraints, or a newly introduced hazard
- `P1`: clear repository drift, duplicated logic, structural debt, or rising maintenance cost
- `P2`: worthwhile cleanup with limited scope and clear payoff
- `P3`: optional observation for the record only

## Step 6: Merge Findings Locally

The main agent is the decision-maker.

Never rank findings by which reviewer produced them.

Sort findings using this order:

1. task-goal violation
2. repository-pattern violation
3. maintenance impact
4. fix cost relative to the current task

Bucket findings into:

- `must_fix`
- `fix_if_cheap`
- `note_only`

Default policy:

- `P0` -> `must_fix`
- `P1` -> `must_fix` if it increases maintenance debt in the current task
- `P2` -> `fix_if_cheap`
- `P3` -> `note_only`

## Step 7: Fix Only Worthwhile Things

Fix:

- all real `must_fix` findings
- `fix_if_cheap` findings that stay within the task boundary

If no finding survives triage, conclude `no cleanup needed` and state why.

If you are thinking "there should probably be at least one finding", that is not a triage rule. `No cleanup needed` is allowed when the evidence supports it.

Do not:

- broaden the task
- start unrelated refactors
- accept speculative architecture advice without repository evidence
- chase low-confidence findings without concrete support

## Step 8: Rerun Verification

Choose the smallest verification that still proves the cleanup is safe.

Verification order:

1. affected-path verification
2. task-level verification
3. broader verification only when the change or cleanup widened risk

After cleanup changes:

- rerun the normal task verification
- confirm no new failures were introduced
- confirm simplify did not expand scope unexpectedly

## Step 9: Report Outcome

Report:

- mode
- task type
- selected tracks
- no-cleanup-needed or cleanup-applied
- no-cleanup-needed evidence when that is the outcome
- fixed findings
- kept findings
- reasons for kept findings
- verification run after cleanup

Before reporting:

- [ ] task was classified as feature, refactor, or bugfix
- [ ] mode was confirmed from the caller
- [ ] tracks were selected and run
- [ ] findings were merged and triaged
- [ ] must-fix findings were addressed or explicitly absent
- [ ] verification was rerun after cleanup or explicitly justified as unnecessary

## Red Flags

If you catch yourself thinking any of these, stop and run simplify correctly:

- "the code works, that's enough"
- "tests passed so I can stop"
- "the review comments are optional, I'll skip all of them"
- "this diff is probably fine"
- "I already looked once"
- "I do not need to classify the task"
- "I can review every track every time"
- "I will just say done now"

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "The implementation already works" | Working code still accumulates maintenance debt. |
| "Tests passed, so cleanup can wait" | Passing tests do not remove duplication, drift, or structural noise. |
| "This is too small for simplify" | Small tasks are exactly where silent debt slips through. |
| "I'll use the full protocol every time to be safe" | Over-review creates noise and encourages formalism. Pick the right mode. |
| "I'll just run every track" | Wrong track choice adds noise and hides real issues. |
| "I'll accept every suggestion" | Simplify is triage, not blind compliance. |
| "I can skip verification after cleanup" | Cleanup can still break behavior. Re-verify. |
| "A reviewer mentioned ideas, so I should refactor broadly" | Stay inside the current task boundary. |

## Common Failure Modes

- treating simplify like a start-of-task skill
- forgetting to classify the task
- running too broad a review scope
- allowing reviewers to decide what must be fixed
- treating all findings as mandatory
- skipping the post-cleanup verification step
