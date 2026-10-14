# Remove Tag from Task

```mermaid
sequenceDiagram

    actor User
    participant Frontend
    participant API
    participant TaskController
    participant TaskService
    participant ProjectRepository
    participant TaskRepository
    participant TagRepository
    participant TaskTagRepository
    participant Prisma
    participant PostgreSQL

    User->>Frontend: Remove tag from task

    Frontend->>API: DELETE /projects/:projectId/tasks/:taskId/tags/:tagId
    API->>TaskController: removeTag(request)

    TaskController->>TaskService: removeTag(userId, projectId, taskId, tagId)

    TaskService->>ProjectRepository: findFirstByUserId(userId, projectId)
    ProjectRepository->>Prisma: project.findFirst()
    Prisma->>PostgreSQL: SELECT project
    PostgreSQL-->>Prisma: Project
    Prisma-->>ProjectRepository: Project
    ProjectRepository-->>TaskService: Project

    TaskService->>TaskRepository: findFirstByProjectId(projectId, taskId)
    TaskRepository->>Prisma: task.findFirst()
    Prisma->>PostgreSQL: SELECT task
    PostgreSQL-->>Prisma: Task
    Prisma-->>TaskRepository: Task
    TaskRepository-->>TaskService: Task

    TaskService->>TagRepository: findFirstByUserId(userId, tagId)
    TagRepository->>Prisma: tag.findFirst()
    Prisma->>PostgreSQL: SELECT tag
    PostgreSQL-->>Prisma: Tag
    Prisma-->>TagRepository: Tag
    TagRepository-->>TaskService: Tag

    TaskService->>TaskTagRepository: findByTaskIdAndTagId(taskId, tagId)
    TaskTagRepository->>Prisma: taskTag.findUnique()
    Prisma->>PostgreSQL: SELECT task_tag
    PostgreSQL-->>Prisma: TaskTag / null
    Prisma-->>TaskTagRepository: TaskTag / null
    TaskTagRepository-->>TaskService: TaskTag / null

    TaskService->>TaskTagRepository: delete(taskId, tagId)
    TaskTagRepository->>Prisma: taskTag.delete()
    Prisma->>PostgreSQL: DELETE task_tag
    PostgreSQL-->>Prisma: TaskTag deleted
    Prisma-->>TaskTagRepository: TaskTag
    TaskTagRepository-->>TaskService: Deletion completed

    TaskService-->>TaskController: Deletion completed
    TaskController-->>API: 204 No Content
    API-->>Frontend: Remove successful
    Frontend-->>User: Remove tag from task
```
