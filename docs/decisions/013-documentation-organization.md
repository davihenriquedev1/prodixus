# ADR-013: Documentation Organization

## Status

Accepted

## Context

The project contains different types of documentation, including architectural decisions, diagrams, system architecture information, data modeling, API documentation, and other technical materials.

Keeping all of these documents in a single structure or mixing documentation with different purposes makes information harder to locate and can make documentation more difficult to maintain as the project grows.

At the same time, an excessively fragmented structure would add unnecessary complexity to the project.

## Decision

Project documentation will be kept separate from application code under the `docs/` directory.

The structure will be organized according to the purpose of each document:

```text
docs/
├── architecture/
├── decisions/
├── diagrams/
│   ├── erd/
│   ├── sequence-diagrams/
│   └── uml/
├── api/
└── README.md
```

The structure may evolve as new needs arise, but new categories should only be created when the amount or purpose of the documentation justifies separating it.

## Architecture

The `architecture/` directory contains documentation related to the architecture and structural organization of the system.

It may include documents such as:

- Architecture overview.
- Application organization.
- Layer organization.
- Architectural flows.
- Other structural information about the system.

Specific decisions explaining why an architectural choice was made should be recorded in `decisions/`.

## Decisions

The `decisions/` directory contains the project's **Architecture Decision Records (ADRs)**.

ADRs document important decisions made during development, including:

- The context of the decision.
- The adopted decision.
- The alternatives considered.
- The consequences of the decision.

ADRs should document relevant and long-lasting decisions rather than temporary implementation details.

## Diagrams

The `diagrams/` directory contains visual representations used to document the system.

Diagrams are organized according to their purpose:

```text
diagrams/
├── erd/
├── sequence-diagrams/
└── uml/
```

### ERD

ERD diagrams represent the database structure and its relationships.

### Sequence Diagrams

Sequence diagrams represent specific interaction flows between users, the frontend, API, services, repositories, and the database.

Diagrams are organized by domain or functionality, making it easier to locate flows related to each part of the system.

### UML

UML diagrams represent structural and behavioral aspects of the system, including class diagrams and use case diagrams.

## API

API documentation will be kept separate from other documentation to facilitate reference to the endpoints provided by the backend.

It may include:

- Endpoints.
- HTTP methods.
- Parameters.
- Request bodies.
- Responses.
- Status codes.
- Relevant usage rules.

API documentation should reflect the behavior actually implemented by the backend.

## README

The `docs/` directory will contain a `README.md` responsible for presenting the available documentation and providing links to its main sections.

The README serves as the entry point to the project's technical documentation.

## File Organization

File names should be descriptive and consistent.

Related documents should remain together within their respective category.

When a documentation section contains multiple related documents, a `README.md` may be used to explain the purpose of the section and provide links to the available files.

## Organization Principles

The documentation will follow these principles:

- Documentation should remain separate from application code.
- Each document should have a clear purpose.
- Related documents should be grouped together.
- Directory structures should not be created without a clear need.
- Diagrams should remain consistent with the current system.
- Outdated documentation should be reviewed or removed.
- Relevant architectural decisions should be recorded in ADRs.
- Documentation should reflect the actual state of the system whenever it describes implemented behavior or architecture.

## Rationale

The proposed organization makes it possible to quickly locate different types of information without creating an unnecessarily complex structure.

Separating `architecture`, `decisions`, `diagrams`, and `api` also prevents conceptual documentation, historical decisions, visual representations, and API references from being mixed together.

At the same time, the structure remains simple enough for the current project size and can evolve as new needs arise.

## Alternatives Considered

### Keeping all documentation in a single directory

Rejected because different types of documentation have different purposes and the number of files is expected to increase as the system evolves.

### Creating a directory for every small type of document

Rejected because it would introduce unnecessary fragmentation and complexity.

### Keeping documentation alongside each application's code

Rejected because it would make system-wide documentation harder to locate and would mix technical documentation with implementation code.

### Using an external documentation platform

Rejected at this stage because the existing `docs/` structure is sufficient for the current needs and keeps documentation versioned alongside the code.

## Consequences

### Positive

- Centralized documentation.
- Easy-to-navigate structure.
- Clear separation between different types of documentation.
- Documentation versioned alongside the code.
- Easier access to architectural decisions.
- Easier access to diagrams and API documentation.
- Simple structure proportional to the project's current scope.

### Negative

- Documentation must be maintained as the system evolves.
- Diagrams and documents can become outdated if they are not reviewed.
- The structure may need to be reorganized as the volume of documentation increases.

## Related Decisions

- [ADR-001: Technologies Chosen](./001-technologies-chosen.md)
- [ADR-003: Application Architectures](./003-application-architectures.md)
- [ADR-004: Data Modeling and Ownership](./004-data-modeling-and-ownership.md)
