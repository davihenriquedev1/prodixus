# User - Get Profile

```mermaid
sequenceDiagram
    actor User
    participant API
    participant AuthMiddleware
    participant UserController
    participant UserService
    participant UserRepository
    participant Prisma
    participant PostgreSQL

    User->>API: GET /api/users/me
    API->>AuthMiddleware: Authenticate request
    AuthMiddleware->>AuthMiddleware: Verify access token
    AuthMiddleware->>AuthMiddleware: Extract userId
    AuthMiddleware->>UserController: next()

    UserController->>UserService: me(userId)
    UserService->>UserRepository: findById(userId)
    UserRepository->>Prisma: findUnique(id)
    Prisma->>PostgreSQL: SELECT user
    PostgreSQL-->>Prisma: User data
    Prisma-->>UserRepository: User
    UserRepository-->>UserService: User

    UserService->>UserService: Build safe user profile
    UserService-->>UserController: User profile
    UserController-->>API: 200 OK
    API-->>User: User profile
```
