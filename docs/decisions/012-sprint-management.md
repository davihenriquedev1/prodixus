# ADR-012: Sprint Management

## Status

Accepted

## Context

The system uses time-boxed development cycles to organize planned work and maintain a predictable development cadence.

Sprints provide a defined period in which a selected set of issues is prioritized for implementation.

The sprint process must provide structure without turning the project into an unnecessarily rigid planning system.

## Decision

The system will use **time-boxed sprints** to organize development work.

Each sprint will have:

- A defined start date.
- A defined end date.
- A set of selected issues.
- A clear development objective.

Sprints will be managed through the project's GitHub Project rather than through labels.

Sprint membership will therefore not be represented by labels such as `sprint-01` or `sprint-02`.

## Sprint Planning

Before a sprint begins, issues will be selected according to their priority, dependencies, scope, and relevance to the sprint objective.

The selected issues represent the work that is intended to be completed during that sprint.

The sprint should have a clear objective rather than being simply a collection of unrelated issues.

## Sprint Workflow

The general workflow is:

```text
Backlog
   ↓
Sprint Planning
   ↓
Sprint
   ↓
Implementation
   ↓
Review
   ↓
Done
```

Issues that are not completed remain available for future planning.

## Incomplete Work

A sprint has a fixed time period and should not normally be extended simply because some issues were not completed.

When the sprint ends, incomplete issues should be evaluated and handled according to their current state.

Depending on the situation, an incomplete issue may be:

- Moved to the next sprint.
- Returned to the backlog.
- Reprioritized.
- Decomposed into smaller issues.
- Closed if the work is no longer relevant.

The decision should be based on the reason the work was not completed rather than automatically extending the sprint.

## Scope Changes

New issues should not be continuously added to an active sprint without consideration.

If an urgent or high-priority issue appears during a sprint, it may be added when necessary, but the impact on the existing sprint scope should be considered.

The objective is to preserve the usefulness of the sprint as a planning commitment without preventing necessary adjustments.

## Sprint Completion

At the end of a sprint, completed and incomplete work should be reviewed.

The purpose of this review is to identify:

- What was completed.
- What remains unfinished.
- Why planned work was not completed.
- Whether priorities should change.
- Whether future sprint planning should be adjusted.

The sprint should then be closed according to the project's established GitHub Project workflow.

## Rationale

Time-boxed sprints provide a predictable development rhythm and make it possible to evaluate progress within defined periods.

Keeping sprint duration fixed prevents the development cycle from becoming open-ended and provides useful feedback when planned work consistently exceeds available capacity.

Allowing incomplete issues to move to a future sprint also avoids artificially extending the current cycle and preserves historical visibility of what was originally planned.

Using GitHub Project functionality instead of labels keeps sprint membership separate from issue classification and workflow status.

## Alternatives Considered

### Extending the sprint until all issues are completed

Rejected because this removes the time-boxed nature of the sprint and makes it difficult to measure planning accuracy and development capacity.

### Using labels to identify sprints

Rejected because sprint membership is planning metadata rather than an issue classification and is better represented by the GitHub Project.

### Fixed scope with no changes allowed during a sprint

Rejected because unexpected bugs, dependencies, or high-priority work may require adjustments during development.

### No sprint structure

Rejected because time-boxed planning provides useful visibility and helps organize development priorities.

## Consequences

### Positive

- Predictable development cycles.
- Clear planning periods.
- Better visibility into completed and incomplete work.
- Historical record of sprint objectives.
- Ability to evaluate planning accuracy.
- No need for sprint-specific labels.
- Flexibility to handle unexpected work when necessary.

### Negative

- Incomplete work may need to be replanned.
- Sprint planning requires periodic review.
- Frequent scope changes can reduce the usefulness of a sprint.
- Poor estimation can result in consistently unfinished work.

## Related Decisions

- [ADR-005: Git and GitHub Workflow](./005-git-and-github-workflow.md)
- [ADR-010: GitHub Project Management Structure](./010-github-project-management-structure.md)
- [ADR-011: Issue Management](./011-issue-management.md)
