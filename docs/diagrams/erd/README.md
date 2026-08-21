# Entity-Relationship Diagram

This section documents the Entity-Relationship Diagram (ERD) used to represent the system's data model.

## Purpose

The ERD provides a visual representation of the main data entities, their attributes, and the relationships between them.

It serves as a reference for understanding the structure and organization of persistent data.

## Current Diagram

The current diagram represents the overall data model:

[See the Entity Relationship Diagram](./erd.md)

## Entities and Relationships

The diagram represents the main entities defined for the system and the relationships between them.

It focuses on the logical structure of the data rather than implementation-specific database details.

As the data model evolves, the diagram should be updated to remain consistent with the current database structure.

## Relationship with the Database

The ERD represents the intended relational model of the application's PostgreSQL database.

The actual database schema is managed through Prisma and its migrations. The diagram should therefore remain consistent with the models and relationships defined in the Prisma schema.

The ERD is a visual documentation artifact and does not replace the database schema or migration history.

## Conventions

The following conventions are used:

- Entities represent persistent data concepts.
- Attributes represent relevant properties of entities.
- Relationships represent associations between entities.
- Primary keys and foreign keys are identified according to the diagram notation.
- Relationship cardinality is represented where relevant.

## Related Documentation

- [Database Documentation](../database/README.md)
- [Architecture Documentation](../architecture/README.md)
