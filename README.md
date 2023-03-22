# ts-etl-example

A simple implementation for syncing data from Supaglue's API to Postgres or AWS S3 (using Nodejs, Typescript, Express, Prisma, and Axios).

## Run locally

1. Create an `.env` file from the provided sample:

```shell
cp .env.sample .env
```

2. Supply the missing environment variables:

- `API_HOST`: your Supaglue API host
- `API_KEY`: your Supaglue API key
- `PROVIDER_NAME`: the CRM you are operating against
- `CUSTOMER_ID`: the id of the customer created in Supaglue
- `PAGE_SIZE`: how many records to fetch per request 

By default this example app will write to Postgres. If you would like to write to S3 instead, fill in the environment variables below:

- `AWS_REGION`: the region of your AWS S3 bucket
- `AWS_S3_BUCKET`: the AWS S3 bucket to write to (you will need PUT object access)
- `AWS_ACCESS_KEY_ID`: your AWS IAM key
- `AWS_SECRET_ACCESS_KEY`: your AWS IAM secret

3. Run the service using Docker Compose:

```shell
yarn install
docker compose up
```

4. Trigger the webhook endpoint with a POST curl:

```shell
curl localhost:3030/supaglue_sync_webhook -H 'content-type: application/json' -d '{"type":"SYNC_SUCCESS"}'
```

5. Postgres: Inspect the synced data in Postgres (password: `postgres`):

```shell
psql -h localhost -U postgres supaglue
```

```sql
\c supaglue;
select * from crm_contacts;
```

6. (Alternative) AWS S3: If you supplied AWS environment variables in your `.env`, inspect the objects written to your S3 bucket under: `{AWS_S3_BUCKET}/{object type}/{sync epoch}`.