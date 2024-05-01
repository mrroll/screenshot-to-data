# Prisma

## Migrations

1. npx prisma migrate dev --create-only
2. Review/edit migration
3. npx prisma migrate dev

## Rolling Back Changes

1. Manually run SQL to roll changes back

- https://www.prisma.io/docs/orm/prisma-migrate/workflows/generating-down-migrations could be useful

2. Delete row from `_prisma_migrations`

## Patching

- https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing
