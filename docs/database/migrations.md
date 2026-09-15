# Database Migrations

Database structure changes are managed using Prisma migrations.

Migration files are stored in:

```text
backend/prisma/migrations/
```

## Migration Workflow

### Create a Migration

After changing the Prisma schema, create a migration with:

```bash
npx prisma migrate dev --name <migration-name>
```

Run the command from the `backend` directory.

Example:

```bash
npx prisma migrate dev --name add_project_fields
```

This command:

- Creates a new migration.
- Applies the migration to the development database.
- Updates the Prisma Client.

### Apply Existing Migrations

To apply existing migrations in an environment:

```bash
npx prisma migrate deploy
```

This applies pending migrations without creating new ones.

### Check Migration Status

To check the current migration state:

```bash
npx prisma migrate status
```

## Migration Files

Each migration is stored in its own directory:

```text
backend/prisma/migrations/
└── <timestamp>_<migration-name>/
    └── migration.sql
```

Migration files should be committed to version control so the database structure can be reproduced across environments.

## Development Workflow

When changing the database schema:

1. Update `backend/prisma/schema.prisma`.
2. Create a migration with `prisma migrate dev`.
3. Review the generated SQL.
4. Verify the migration locally.
5. Commit the schema and migration files together.
6. Apply the migration to other environments with `prisma migrate deploy`.

## Production

Production environments should use existing migrations rather than generating new migrations directly.

```bash
npx prisma migrate deploy
```

New migrations should be created and reviewed during development before being applied to production.

## Database Consistency

The Prisma schema and migration history should remain synchronized.

Do not manually modify migration files that have already been applied to shared or production databases.

Changes to the database structure should be made through Prisma migrations.
