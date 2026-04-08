---
name: using-simplify
description: Use when a code task is being wrapped up or the agent is about to claim completion while task-related code changes still exist.
---

<SUBAGENT-STOP>
If you were dispatched as a read-only reviewer, advisor, or analyst without code ownership for the current task, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If a code task is being wrapped up and task-related code changes still exist, you MUST invoke `simplify` before claiming completion, or explicitly state the skip reason.

You do not have the option to silently skip this.
</EXTREMELY-IMPORTANT>

# Using Simplify

## Overview

`using-simplify` is the finish-line router for `simplify`.

It does not perform the cleanup protocol itself. Its job is to detect closure conditions, decide whether simplify is required, and route into the full `simplify` skill.

## When To Use

Use this skill when all of these are true:

- the current task is code work
- you are wrapping up the task, preparing to stop, or preparing to claim completion
- task-related code changes still exist

Do not use it at task start.

Do not use it while requirements, root cause, or architecture are still unsettled.

## Skip Conditions

You may skip `simplify` only when at least one of these is true:

- there is no meaningful task-related code diff
- the task is non-code work
- you are acting as a read-only reviewer or advisor without implementation responsibility
- the user explicitly told you to stop before cleanup

If you skip, say so explicitly and give the reason.

## Meaningful Diff

A meaningful diff means task-related changes to behavior-affecting files such as:

- source code
- tests
- scripts
- build or runtime configuration
- hook configuration
- plugin manifest
- prompts or instructions that change agent behavior

It does not mean:

- docs-only edits
- comments-only edits
- formatting-only edits
- unrelated generated churn
- unrelated metadata changes with no behavior impact

## The Rule

If the closure conditions are true:

1. decide whether a valid skip condition exists
2. if no valid skip condition exists, invoke `simplify`
3. follow `simplify` exactly
4. only then claim completion

This skill routes. `simplify` executes.

## Red Flags

If you catch yourself thinking any of these, stop and invoke `simplify`:

- "the task is basically done"
- "tests passed, so I can stop"
- "the diff is probably fine"
- "this is too small for cleanup"
- "I already looked once"
- "I can just say done now"

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "The implementation works already" | Working code can still accumulate maintenance debt. |
| "This task is too small for simplify" | Small tasks are where silent debt often slips through. |
| "I already reviewed the diff mentally" | Informal review is not the simplify protocol. |
| "I do not need to reroute into simplify" | This skill is only the router. `simplify` is the protocol. |
