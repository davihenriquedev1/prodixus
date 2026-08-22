# ADR-010: GitHub Project Management Structure

## Status

Accepted

## Context

The system uses GitHub not only for source code management, but also for organizing development work.

As the project grows, different mechanisms are required to classify work, group related deliverables, organize development cycles, and provide visibility into project progress.

GitHub provides several mechanisms for this purpose, but each serves a different role. The system therefore requires clear conventions for their usage.

## Decision

The system will use the following GitHub mechanisms for project management:

- **Issues** — represent individual units of work.
- **Labels** — classify and provide metadata about issues.
- **Milestones** — group issues around a larger objective or release.
- **GitHub Projects** — provide a higher-level view of project work and workflow.
- **Sprints** — represent time-boxed development cycles within the project's planning process.

Each mechanism will have a distinct responsibility and should not be used interchangeably.

## Issues

Issues are the primary representation of actionable work.

Examples include:

- Features.
- Bug fixes.
- Refactoring.
- Documentation.
- Architectural work.
- Technical improvements.

Issues provide the connection between planned work and implementation through branches and pull requests.

Detailed issue management conventions are documented in:

- [ADR-011: Issue Management](./011-issue-management.md)

## Labels

Labels are used to classify issues according to attributes such as:

- Type of work.
- Area of the system.
- Priority.
- Other relevant project metadata.

Labels should provide useful classification without creating unnecessary combinations or excessive granularity.

Labels describe **what an issue is or how it should be classified**, rather than representing a development cycle.

## Milestones

Milestones represent larger objectives, releases, or meaningful project targets.

They group related issues that contribute toward a common goal.

A milestone is therefore used to answer:

> "What larger objective are these issues contributing toward?"

Milestones are not used to represent individual tasks or short-term development cycles.

## GitHub Projects

GitHub Projects provide a higher-level management view of the work represented by issues.

The project board is used to visualize and organize the workflow of issues, providing information such as:

```text
Backlog → Ready → In Progress → In Review → Done
```

The exact workflow may evolve as the project grows, but the board should remain focused on the current state of work.

## Sprints

Sprints represent time-boxed development periods used to organize planned work.

A sprint defines a limited period during which a selected set of issues is intended to be completed.

Sprint management is documented separately in:

- [ADR-012: Sprint Management](./012-sprint-management.md)

## Relationship Between the Mechanisms

The project management structure can be represented as:

```text
Milestone
    │
    ├── Sprint
    │     │
    │     ├── Issue
    │     ├── Issue
    │     └── Issue
    │
    └── Issue
```

Labels provide classification across these elements rather than representing hierarchy.

GitHub Projects provide the operational view of the work and its current state.

## Rationale

Separating these responsibilities prevents GitHub's project management mechanisms from being used inconsistently.

Issues represent work, labels classify that work, milestones represent larger objectives, sprints define development periods, and Projects provide visibility into the workflow.

This structure provides sufficient organization without requiring an unnecessarily complex project management system.

## Alternatives Considered

### Using labels to represent sprints

Rejected because labels are classification metadata and do not represent time-boxed development cycles.

### Using milestones for every sprint

Rejected because milestones are better suited to larger objectives or releases, while sprints represent short, recurring development cycles.

### Managing all work exclusively through GitHub Projects

Rejected because issues provide the actual unit of work and integrate directly with branches, pull requests, and development tracking.

### Using an external project management platform

Rejected because GitHub already provides sufficient functionality for the current project's scope and keeps planning closely integrated with source control.

## Consequences

### Positive

- Clear separation of project management responsibilities.
- Better visibility into development progress.
- Strong integration between planning and implementation.
- Consistent classification of issues.
- Reduced ambiguity when organizing project work.
- No additional project management platform is required.

### Negative

- Requires maintaining conventions across several GitHub features.
- Poorly configured labels or project fields can create unnecessary complexity.
- Larger projects may eventually require more advanced project management practices.

## Related Decisions

- [ADR-005: Git and GitHub Workflow](./005-git-and-github-workflow.md)
- [ADR-011: Issue Management](./011-issue-management.md)
- [ADR-012: Sprint Management](./012-sprint-management.md)
