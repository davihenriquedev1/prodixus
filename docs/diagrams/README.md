# System Diagrams

This section contains the diagrams used to represent the system's structure, behavior, and data relationships.

Diagrams complement the written technical documentation by providing visual representations of the system and its components.

## Purpose

The purpose of this documentation is to provide a centralized reference for the system's technical diagrams.

Diagrams should remain consistent with the current system architecture and be updated when relevant structural or behavioral changes are introduced.

## Diagram Types

The documentation is organized into three categories:

```text
Diagrams

├── DER
├── UML
└── Sequence Diagrams
```

### DER

Entity-Relationship Diagrams represent the structure of the data model, including entities, attributes, relationships, and relevant constraints.

Use DER diagrams to document database structure and relationships between persistent data.

[View DER documentation](./der/README.md)

### UML

UML diagrams represent the structure and behavior of the application at a higher level.

They document concepts such as domain entities, application components, system actors, use cases, and relationships between application elements.

[View UML documentation](./uml/README.md)

### Sequence Diagrams

Sequence diagrams represent interactions between system components over time.

They document relevant application flows, such as authentication, data operations, and communication between the frontend, backend, and other system components.

[View Sequence Diagrams documentation](./sequence-diagrams/README.md)

## General Conventions

The following conventions apply to diagrams throughout the project:

- Diagrams should represent the current system structure, behavior, or data model.
- Diagram names should clearly describe their subject or flow.
- Diagrams should avoid unnecessary implementation details when documenting high-level architecture.
- Diagram changes should be reviewed when the corresponding system structure or behavior changes.
- Diagrams should use consistent terminology with the rest of the technical documentation.
- Generated or exported diagram files should be stored in the appropriate category directory.

Diagrams document the system visually; detailed explanations and architectural decisions should remain in their respective documentation sections.
