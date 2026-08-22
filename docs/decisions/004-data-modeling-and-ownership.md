# ADR-004: Data Modeling and Ownership Rules

## Status

Accepted

## Context

The system requires a relational data model capable of representing users, projects, tasks, tags, folders, authentication data, and their relationships.

Because most resources are user-owned, the data model must also define clear ownership rules to ensure that users can only access and manipulate resources that belong to them.

The model must support the current system requirements while maintaining referential integrity and avoiding unnecessary complexity.

## Decision

The system will use a relational data model based on PostgreSQL, with Prisma responsible for defining and accessing the application's persistence model.

Resources that belong to a user will maintain an explicit relationship with `User`.

The main entities are:

- `User`
- `UserSettings`
- `RefreshToken`
- `Project`
- `Task`
- `Tag`
- `TaskTag`
- `Folder`

## Ownership

User-owned resources must be associated with their owner through a `userId` relationship.

The following resources are directly owned by a user:

- `Project`
- `Tag`
- `Folder`
- `UserSettings`
- `RefreshToken`

Tasks are owned indirectly through their associated project.

A task must belong to a project, and the project must belong to a user.

Therefore, access to a task must be validated through the ownership of its project.

The ownership hierarchy is:

```text
User
├── Projects
│   └── Tasks
├── Tags
├── Folders
├── UserSettings
└── RefreshTokens
```

## Relationships

### User and Project

A user can own multiple projects.

```text
User 1 ──── 0..* Project
```

A project cannot exist without an owner.

### Project and Task

A project can contain multiple tasks.

```text
Project 1 ──── 0..* Task
```

Every task must belong to exactly one project.

Deleting a project will cascade to its tasks.

### User and Tag

A user can own multiple tags.

Tag names must be unique within the scope of the owning user rather than globally.

```text
User 1 ──── 0..* Tag
```

### Task and Tag

Tasks and tags have a many-to-many relationship represented by the `TaskTag` association entity.

```text
Task 1 ──── 0..* TaskTag 0..* ──── 1 Tag
```

The combination of `taskId` and `tagId` forms the composite primary key of `TaskTag`, preventing the same tag from being assigned to the same task more than once.

### User and Folder

A user can own multiple folders.

Folders can contain projects and can also form a hierarchical structure through self-referencing relationships.

```text
User 1 ──── 0..* Folder

Folder 0..1 ──── 0..* Folder
        parent     subfolders
```

### Project and Folder

A project can optionally belong to a folder.

Moving a project to another folder changes its folder relationship without changing its ownership.

Deleting a folder will not delete its projects. Projects are instead detached from the deleted folder.

### Task and Subtask

Tasks support a single level of subtasks through a self-referencing relationship.

A task may have a parent task:

```text
Task
├── Parent Task
└── Subtasks
```

Only one level of nesting is supported.

A task that has a `parentId` is itself a subtask and cannot have additional subtasks.

This prevents arbitrary recursive task hierarchies and keeps task management intentionally simple.

## Referential Integrity

Foreign key relationships will use appropriate deletion behavior according to the ownership and dependency rules.

### Cascade deletion

Cascade deletion is used when the dependent resource should not exist without its parent.

Examples include:

- User → Projects
- User → Tags
- User → Folders
- User → UserSettings
- User → RefreshTokens
- Project → Tasks
- Task → Subtasks
- Task → TaskTags
- Tag → TaskTags

### Set Null

`SetNull` is used when the relationship is optional and deleting the referenced resource should preserve the dependent resource.

For example:

```text
Folder deletion → Project.folderId becomes null
```

The project remains available after its folder is deleted.

## Rationale

Explicit ownership relationships provide a clear authorization boundary and make resource ownership easy to validate at the application level.

The relational model was chosen because the system contains several structured relationships, including one-to-many, many-to-many, and self-referencing relationships.

Limiting subtasks to a single level avoids unnecessary recursive complexity while providing the required task hierarchy.

Using association entities such as `TaskTag` makes the many-to-many relationship explicit and allows database-level constraints to guarantee relationship integrity.

## Access Control and Ownership

Users can only access, create, update, archive, complete, move, or delete resources that they own or that belong to resources they own.

Ownership must be validated by the backend for every operation involving user-owned resources.

The backend must never rely solely on identifiers provided by the client to determine whether a resource can be accessed.

For directly owned resources, ownership is validated through the resource's `userId`.

For indirectly owned resources, ownership is validated through the ownership chain.

For example:

```text
User → Project → Task
```

A user can access a task only if the task belongs to a project owned by that user.

The same principle applies to other relationships between resources.

This ownership rule is enforced at the application level and represents a fundamental authorization boundary of the system.

A resource identifier belonging to another user must be treated as inaccessible, even when the resource exists in the database.

## Alternatives Considered

### Global resource ownership without explicit user relationships

Rejected because it would make ownership validation more difficult and weaken the data model's ability to represent authorization boundaries.

### Arbitrarily nested subtasks

Rejected because recursive task hierarchies would introduce unnecessary complexity for the current system requirements.

### Globally unique tag names

Rejected because users should be able to create tags with the same name independently.

### Deleting dependent resources manually

Rejected where database-level cascading provides a clearer and more reliable representation of the relationship.

## Consequences

### Positive

- Clear ownership boundaries.
- Strong relational integrity.
- Explicit representation of many-to-many relationships.
- Controlled task hierarchy.
- Predictable deletion behavior.
- Easier authorization checks.
- User data remains isolated from other users.

### Negative

- Ownership must be validated when accessing indirectly owned resources such as tasks.
- The relational model requires explicit relationship management.
- Single-level subtasks limit future hierarchy depth unless the model is changed.
- Changes to ownership relationships may require coordinated database migrations and application changes.

## Related Decisions

- [ADR-001: Technologies Chosen](./001-technologies.md)
- [ADR-003: Application Architectures](./003-application-architectures.md)
