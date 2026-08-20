# System Diagrams

This section contains the diagrams used to represent the system's structure, behavior, and data relationships.

Diagrams complement the written technical documentation by providing visual representations of the system and its components.

## Purpose

The purpose of this documentation is to provide a centralized reference for the system's technical diagrams.

Diagrams should be kept consistent with the current system architecture and updated when relevant structural or behavioral changes are introduced.

## Diagram Types

The documentation is organized into three main categories:

```text
Diagrams
├── DER
├── UML
└── Sequence Diagrams
```

### DER

Entity-Relationship Diagrams represent the structure of the data model, including entities, attributes, relationships, and relevant constraints.

Use DER diagrams when documenting database structure and relationships between persistent data.

[View DER documentation](./der/README.md)

### UML

UML diagrams represent the structure and behavior of the application at a higher level.

They can be used to document concepts such as classes, system actors, use cases, and relationships between application elements.

[View UML documentation](./uml/README.md)

### Sequence Diagrams

Sequence diagrams represent interactions between system components over time.

They are used to document application flows such as authentication, data operations, and communication between the frontend, backend, and other relevant components.

[View Sequence Diagrams documentation](./sequence-diagrams/README.md)

## General Conventions

The following conventions apply to diagrams throughout the project:

- Diagrams should represent the current or explicitly planned system structure.
- Diagram names should clearly describe their subject or flow.
- Diagrams should avoid unnecessary implementation details when documenting high-level architecture.
- Diagram changes should be reviewed when the corresponding system structure or behavior changes.
- Diagrams should use consistent terminology with the rest of the technical documentation.
- Generated or exported diagram files should be stored in the appropriate category directory.

Diagrams document the system visually; detailed explanations and architectural decisions should remain in their respective documentation sections.
