# ts-etl-example

A simple implementation for syncing data from Supaglue's API to a mock application using Nodejs, Typescript, Express, Prisma, and Axios.

## Running

```shell
cp .env.sample .env
```

Fill out `.env`:

- `API_HOST`: your Supaglue API host
- `API_KEY`: your Supaglue API key
- `PROVIDER_NAME`: the CRM you are operating against
- `CUSTOMER_ID`: the id of the customer created in Supaglue
- `PAGE_SIZE`: how many records to fetch per request 

By default this example app will write to Postgres incrementally using Prisma using a {ID, JSONB} table per object type.

If you would like to write to S3 instead, fill in the values:

- `AWS_REGION`: the region of your AWS S3 bucket
- `AWS_S3_BUCKET`: the AWS S3 bucket to write to (you will need PUT object access)
- `AWS_ACCESS_KEY_ID`: your AWS IAM key
- `AWS_SECRET_ACCESS_KEY`: your AWS IAM secret

This example app will performa full sync and write to {AWS_S3_BUCKET}/{sync start iso string}/{object type}/{epoch} on each sync.

```shell
yarn install
docker compose up
```

Then, trigger the webhook endpoint:

```shell
curl localhost:3030/supaglue_sync_webhook -H 'content-type: application/json' -d '{"type":"SYNC_SUCCESS"}'
```

Inspect the synced data in Postgres (password: `postgres`):

```shell
psql -h localhost -U postgres supaglue
```

```sql
\c supaglue;
select * from crm_contacts;
```