# Postgres

Ensure the following `.env` variables are set:

# postgres connection string
DESTINATION=postgres
DATABASE_URL=

Migrate using Prisma to ensure the destination table schemas exist before starting server:

`yarn migrate`