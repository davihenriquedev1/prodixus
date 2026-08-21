# Application Layer Class Diagram

```mermaid
classDiagram

    class AuthController {
        +register(request)
        +login(request)
        +refreshToken(request)
        +logout(request)
    }

    class UserController {
        +getProfile(request)
        +updateProfile(request)
    }

    class ProjectController {
        +create(request)
        +findAll(request)
        +findById(request)
        +update(request)
        +delete(request)
    }

    class TaskController {
        +create(request)
        +findAll(request)
        +findById(request)
        +update(request)
        +delete(request)
    }

    class TagController {
        +create(request)
        +findAll(request)
        +update(request)
        +delete(request)
    }

    class FolderController {
        +create(request)
        +findAll(request)
        +update(request)
        +delete(request)
    }


    class AuthService {
        +registerUser(data)
        +login(credentials)
        +refreshToken(token)
        +logout(token)
    }

    class UserService {
        +getProfile(userId)
        +updateProfile(userId, data)
    }

    class ProjectService {
        +createProject(userId, data)
        +getProjects(userId)
        +getProjectById(userId, projectId)
        +updateProject(userId, projectId, data)
        +deleteProject(userId, projectId)
    }

    class TaskService {
        +createTask(userId, data)
        +getTasks(userId, projectId)
        +getTaskById(userId, taskId)
        +updateTask(userId, taskId, data)
        +deleteTask(userId, taskId)
    }

    class TagService {
        +createTag(userId, data)
        +getTags(userId)
        +updateTag(userId, tagId, data)
        +deleteTag(userId, tagId)
    }

    class FolderService {
        +createFolder(userId, data)
        +getFolders(userId)
        +updateFolder(userId, folderId, data)
        +deleteFolder(userId, folderId)
    }


    class UserRepository {
        +create(data)
        +findById(id)
        +findByEmail(email)
        +update(id, data)
    }

    class RefreshTokenRepository {
        +create(data)
        +findByTokenHash(tokenHash)
        +revoke(id)
        +deleteExpired()
    }

    class ProjectRepository {
        +create(data)
        +findAllByUserId(userId)
        +findById(id)
        +update(id, data)
        +delete(id)
    }

    class TaskRepository {
        +create(data)
        +findAllByProjectId(projectId)
        +findById(id)
        +update(id, data)
        +delete(id)
    }

    class TagRepository {
        +create(data)
        +findAllByUserId(userId)
        +findById(id)
        +update(id, data)
        +delete(id)
    }

    class FolderRepository {
        +create(data)
        +findAllByUserId(userId)
        +findById(id)
        +update(id, data)
        +delete(id)
    }


    AuthController --> AuthService
    UserController --> UserService
    ProjectController --> ProjectService
    TaskController --> TaskService
    TagController --> TagService
    FolderController --> FolderService

    AuthService --> UserRepository
    AuthService --> RefreshTokenRepository

    UserService --> UserRepository

    ProjectService --> ProjectRepository
    TaskService --> TaskRepository
    TagService --> TagRepository
    FolderService --> FolderRepository
```
