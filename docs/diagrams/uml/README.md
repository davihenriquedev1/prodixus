# UML Diagrams

This section contains the UML diagrams used to represent the system's structure and interactions.

UML diagrams provide visual representations of application components, their relationships, and system functionality.

## Class Diagram

The Class Diagram represents the main domain entities and their relationships within the system.

It provides a structural view of the entities represented by the application's data model.

[See the Domain Model Class Diagram](./domain-layer-class-diagram.md)

## Application Layer Class Diagram

The Application Layer Class Diagram represents the main application components and their dependencies.

It illustrates the relationships between controllers, services, and repositories used by the backend.

[See the Application Layer Class Diagram](./application-layer-class-diagram.md)

## Infrastructure Layer Class Diagram

The Infrastructure Layer Class Diagram represents the components responsible for data persistence.

It illustrates the repositories and their dependency on the Prisma Client used to access the PostgreSQL database.

[See the Infrastructure Layer Class Diagram](./infrastructure-layer-class-diagram.md)

## Use Case Diagram

The Use Case Diagram represents the main interactions between system actors and the application's functionality.

It provides a high-level view of the functionality available to users.

[See the Use Case Diagram](./use-case-diagram.md)

## Conventions

- Diagrams should use standard UML notation where applicable.
- Diagram names should clearly identify the represented concept or architectural concern.
- Diagrams should remain consistent with the current system design.
- The Domain Model Class Diagram focuses on domain entities and their relationships.
- The Application Layer Class Diagram focuses on controllers, services, repositories, and their dependencies.
- The Infrastructure Layer Class Diagram focuses on persistence components and their dependencies.
- Detailed implementation decisions should be documented separately.

Additional UML diagrams may be added as the system evolves when they provide meaningful architectural or behavioral information.
