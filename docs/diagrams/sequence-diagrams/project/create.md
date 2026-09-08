# Project - Create

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant AuthMiddleware
    participant ProjectController
    participant ProjectService
    participant ProjectRepository
    participant Prisma
    participant PostgreSQL

    User->>Frontend: Enter project data
    Frontend->>API: POST /projects
    API->>AuthMiddleware: Authenticate request
    AuthMiddleware->>AuthMiddleware: Validate access token
    AuthMiddleware-->>API: userId

    API->>ProjectController: create(req, res)
    ProjectController->>ProjectController: Validate request data (Zod)
    ProjectController->>ProjectService: createProject(userId, data)
    ProjectService->>ProjectRepository: create(projectData)
    ProjectRepository->>Prisma: project.create()
    Prisma->>PostgreSQL: INSERT project
    PostgreSQL-->>Prisma: Created project
    Prisma-->>ProjectRepository: Project
    ProjectRepository-->>ProjectService: Project
    ProjectService-->>ProjectController: Project
    ProjectController-->>API: 201 Created
    API-->>Frontend: Project JSON
    Frontend-->>User: Display created project
```
