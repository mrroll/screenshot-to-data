- [ ] confirmed_at is not actually synced. We may need to update the migration to sync it the first time around

<!-- TODO -->
<!-- Actually write this -->

## Migrations

1. npx prisma migrate dev --create-only
2. Review/edit migration
3. npx prisma migrate dev

##

1. Roll changes back
   https://www.prisma.io/docs/orm/prisma-migrate/workflows/generating-down-migrations might help
2. Delete row for migration

##

https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing
