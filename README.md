# ts-etl-example

A simple implementation for syncing data from Supaglue's API to a mock application using Nodejs, Typescript, Express, Prisma, and Axios.

## Running

```shell
cp .env.sample .env
```

Fill out your `API_HOST`, `API_KEY`, `PROVIDER_NAME`, AND `CUSTOMER_ID` in `.env`.

```shell
yarn install
docker compose up
```

Then, trigger the webhook endpoint:

```shell
curl localhost:3030/supaglue_sync_webhook -H 'content-type: application/json' -d '{"type":"SYNC_SUCCEEDED"}'
```

Inspect the synced data in Postgres (password: `postgres`):

```shell
psql -h localhost -U postgres supaglue
```

```sql
\c supaglue;
select * from crm_contacts;
```