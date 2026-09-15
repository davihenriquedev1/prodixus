# Database Relationships

The database uses relational associations between users and their application resources.

## Relationship Overview

```text
User
├── UserSettings
├── Projects
├── Tags
├── Folders
└── RefreshTokens

Project
└── Tasks

Task
├── Parent Task
├── Subtasks
└── TaskTags

Tag
└── TaskTags

Folder
├── Parent Folder
├── Subfolders
└── Projects
```

## User Relationships

### User → UserSettings

One user can have one set of settings.

```text
User 1 ──── 0..1 UserSettings
```

`UserSettings.userId` is unique, enforcing the one-to-one relationship.

Deleting a user also deletes their settings.

### User → Project

A user can own multiple projects.

```text
User 1 ──── N Project
```

Each project belongs to exactly one user through `Project.userId`.

Deleting a user also deletes their projects.

### User → Tag

A user can own multiple tags.

```text
User 1 ──── N Tag
```

Each tag belongs to exactly one user through `Tag.userId`.

Deleting a user also deletes their tags.

### User → Folder

A user can own multiple folders.

```text
User 1 ──── N Folder
```

Each folder belongs to exactly one user through `Folder.userId`.

Deleting a user also deletes their folders.

### User → RefreshToken

A user can have multiple refresh tokens.

```text
User 1 ──── N RefreshToken
```

Each refresh token belongs to exactly one user through `RefreshToken.userId`.

Deleting a user also deletes their refresh tokens.

---

## Project Relationships

### Project → Task

A project can contain multiple tasks.

```text
Project 1 ──── N Task
```

Each task belongs to exactly one project through `Task.projectId`.

Deleting a project also deletes its tasks.

### Project → Folder

A project can optionally belong to a folder.

```text
Folder 1 ──── N Project
```

`Project.folderId` is optional.

Deleting a folder does not delete its projects. Instead, `folderId` is set to `NULL`.

---

## Task Relationships

### Task → Parent Task

A task can optionally have another task as its parent.

```text
Task 0..1 ──── N Task
```

The relationship uses `Task.parentId`.

This allows the creation of subtasks.

### Task → Subtasks

A task can contain multiple subtasks.

```text
Parent Task 1 ──── N Subtask
```

Deleting a parent task also deletes its subtasks.

### Task ↔ Tag

Tasks and tags have a many-to-many relationship.

```text
Task N ──── N Tag
       via TaskTag
```

`TaskTag` acts as the join table.

Its composite primary key is:

```text
taskId + tagId
```

The same task cannot be associated with the same tag more than once.

Deleting either the task or tag removes the corresponding `TaskTag` association.

---

## Folder Relationships

### Folder → Parent Folder

A folder can optionally have another folder as its parent.

```text
Folder 0..1 ──── N Folder
```

The relationship uses `Folder.parentId`.

### Folder → Subfolders

A folder can contain multiple subfolders.

```text
Parent Folder 1 ──── N Subfolder
```

The application prevents circular folder hierarchies when folders are updated.

### Folder → Project

A folder can contain multiple projects.

```text
Folder 1 ──── N Project
```

Projects can optionally reference a folder through `Project.folderId`.

---

## Cascade Behavior

The database defines `onDelete` behavior for relationships:

| Relationship         | Delete behavior          |
| -------------------- | ------------------------ |
| User → UserSettings  | Cascade                  |
| User → Projects      | Cascade                  |
| User → Tags          | Cascade                  |
| User → Folders       | Cascade                  |
| User → RefreshTokens | Cascade                  |
| Project → Tasks      | Cascade                  |
| Project → Folder     | Set `folderId` to `NULL` |
| Task → Subtasks      | Cascade                  |
| Task → TaskTag       | Cascade                  |
| Tag → TaskTag        | Cascade                  |
| Folder → Subfolders  | Cascade                  |

These rules define how related records are handled when a referenced record is deleted.
