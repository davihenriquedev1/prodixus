# ADR-011: Issue Management

## Status

Accepted

## Context

The system uses GitHub Issues as the primary unit of planned development work.

A consistent issue structure is necessary to ensure that each piece of work has a clear objective, scope, completion criteria, and relationship with the development workflow.

Issues must also integrate with branches, pull requests, milestones, labels, and sprints without duplicating information unnecessarily.

## Decision

Each meaningful unit of development work will be represented by a GitHub Issue.

Issues may represent:

- Features.
- Bug fixes.
- Refactoring.
- Documentation.
- Architectural decisions or changes.
- Technical improvements.
- Infrastructure or tooling work.

An issue should be created before implementation begins whenever the work is significant enough to require planning or tracking.

## Issue Structure

Issues should provide enough information for the work to be understood and implemented without requiring the entire context of the project to be reconstructed.

The standard structure should include:

### Objective

A concise explanation of what the issue intends to accomplish.

### Scope

The main work that is included in the issue.

### Acceptance Criteria

Conditions that must be satisfied for the issue to be considered complete.

### Notes

Additional technical or contextual information when necessary.

The level of detail should be proportional to the complexity of the work.

## Issue Titles

Issue titles should clearly describe the intended change.

Titles should use a consistent format appropriate to the type of work.

Examples:

```text id="ehv9l0"
feat(auth): add refresh token model
docs: add system diagrams
refactor(api): reorganize service layer
fix(auth): validate refresh token
```

The title should communicate the purpose of the issue without requiring the description to understand what is being changed.

## Labels

Issues should use appropriate labels to classify their type, area, and other relevant metadata.

Labels should not be used to represent sprint membership when the GitHub Project already provides that information.

## Milestones

Issues may be assigned to a milestone when they contribute to a larger release or project objective.

Milestones represent broader goals rather than individual development cycles.

## Sprints

Issues selected for a sprint are associated with that sprint through the project's planning workflow.

Sprint membership does not change the issue itself and should not be duplicated through unnecessary labels.

## Development Tracking

An issue should be connected to its implementation through GitHub's development features.

The normal relationship is:

```text id="6tqk4p"
Issue
  ↓
Branch
  ↓
Pull Request
  ↓
Merge
```

When a pull request completes an issue, the pull request should reference the issue using GitHub's closing syntax:

```text id="lnx9lm"
Closes #<issue-number>
```

The issue should also be linked through the pull request's **Development** section.

This allows GitHub to maintain the relationship between planned work and its implementation.

## Issue Lifecycle

The expected lifecycle is:

```text id="f8b8dc"
Backlog
   ↓
Planned
   ↓
In Progress
   ↓
In Review
   ↓
Done
```

The exact state displayed on the GitHub Project may vary, but the issue should remain traceable throughout its lifecycle.

## Scope Management

An issue should represent a coherent unit of work.

If an issue becomes too large or contains multiple independent objectives, it should be divided into smaller issues.

Conversely, trivial changes that do not provide meaningful tracking value may be handled without creating a separate issue when appropriate.

The goal is to maintain useful project visibility without turning every minor change into a separate tracked item.

## Rationale

A consistent issue structure makes planned work easier to understand, estimate, implement, review, and verify.

Using acceptance criteria provides an objective definition of completion and reduces ambiguity during implementation.

Connecting issues to branches and pull requests also provides traceability between planning and the resulting code or documentation changes.

## Alternatives Considered

### Using GitHub Issues only as a bug tracker

Rejected because the system requires tracking features, documentation, architecture, refactoring, infrastructure, and other development work.

### Creating an issue for every commit

Rejected because commits represent implementation steps, while issues represent meaningful units of work.

### Using labels to track issue state

Rejected because issue state is better represented by GitHub Projects and workflow fields.

## Consequences

### Positive

- Consistent planning structure.
- Clear acceptance criteria.
- Better traceability between planning and implementation.
- Easier integration with pull requests.
- Better visibility into project progress.
- Reduced ambiguity about when work is complete.

### Negative

- Requires maintaining issue conventions.
- Larger issues may require additional planning and decomposition.
- Poorly scoped issues can still lead to unclear or incomplete work.

## Related Decisions

- [ADR-005: Git and GitHub Workflow](./005-git-and-github-workflow.md)
- [ADR-010: GitHub Project Management Structure](./010-github-project-management-structure.md)
- [ADR-012: Sprint Management](./012-sprint-management.md)
