# Sequence Diagram - Complete Project

```mermaid
sequenceDiagram

    actor User

    participant Frontend

    participant API

    participant ProjectController

    participant ProjectService

    participant ProjectRepository

    participant Prisma

    participant PostgreSQL

    User->>Frontend: Complete project

    Frontend->>API: PATCH /projects/:id/complete

    API->>ProjectController: complete(request)

    ProjectController->>ProjectService: completeProject(userId, projectId)

    ProjectService->>ProjectRepository: findById(projectId)

    ProjectRepository->>Prisma: project.findUnique()

    Prisma->>PostgreSQL: SELECT project

    PostgreSQL-->>Prisma: Project

    Prisma-->>ProjectRepository: Project

    ProjectRepository-->>ProjectService: Project

    ProjectService->>ProjectService: Validate ownership

    ProjectService->>ProjectService: Mark project as completed

    ProjectService->>ProjectRepository: updateCompleted(projectId, true)

    ProjectRepository->>Prisma: project.update()

    Prisma->>PostgreSQL: UPDATE project SET completed = true

    PostgreSQL-->>Prisma: Updated project

    Prisma-->>ProjectRepository: Project

    ProjectRepository-->>ProjectService: Project

    ProjectService-->>ProjectController: Project

    ProjectController-->>API: 200 OK

    API-->>Frontend: Completed project

    Frontend-->>User: Display completed project
```
