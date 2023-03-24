# typescript-syncer

A simple implementation for syncing data from Supaglue's API to Postgres or AWS S3 (using Nodejs, Typescript, Express, Prisma, and Axios).

You can 1-click deploy to Railway or run locally.

## Run on Railway

1. 1-click deploy to Railway:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/IH6VTn?referralCode=_jOnzI)

2. Enter these environment variables:
   
- `API_HOST`: your Supaglue API host
- `API_KEY`: your Supaglue API key
- `PROVIDER_NAME`: the CRM you are operating against

(Optional) To write to AWS S3 instead of Postgres, enter these environment variables:
- `AWS_REGION`: the region of your AWS S3 bucket
- `AWS_S3_BUCKET`: the AWS S3 bucket to write to (you will need PUT object access)
- `AWS_ACCESS_KEY_ID`: your AWS IAM key
- `AWS_SECRET_ACCESS_KEY`: your AWS IAM secret

1. Once it's provisioned, grab your supaglue-syncer Railway domain using the steps below. This will be called by your Supaglue instance to start syncing records to S3.
   
![step-1](https://raw.githubusercontent.com/supaglue-labs/ts-etl-example/main/img/step1.png)

![step-2](https://raw.githubusercontent.com/supaglue-labs/ts-etl-example/main/img/step2.png)

4. Use the Supaglue [Management API's Webhook endpoints](https://docs.supaglue.com/api/mgmt#tag/Webhook/operation/createWebhook) to register a webhook with the URL: `https://{your typescript-syncer Railway domain from above}/supaglue_sync_webhook`

5. (Optional) You can also manually trigger a sync by making a POST request to your instance of typescript-syncer:

```shell
curl localhost:3030/supaglue_sync_webhook -H 'content-type: application/json' -d '{"type":"SYNC_SUCCESS", "customer_id": "<your_customer_id>"}'
```

Replace `<your_customer_id>` with the Supaglue customer you would like to sync.

## Run locally

1. Create an `.env` file from the provided sample:

```shell
cp .env.sample .env
```

2. Supply the missing environment variables:

- `API_HOST`: your Supaglue API host
- `API_KEY`: your Supaglue API key
- `PROVIDER_NAME`: the CRM you are operating against
- `PAGE_SIZE`: how many records to fetch per request 

By default this example app will write to Postgres. If you would like to write to S3 instead, fill in the environment variables below:

- `AWS_REGION`: the region of your AWS S3 bucket
- `AWS_S3_BUCKET`: the AWS S3 bucket to write to (you will need PUT object access)
- `AWS_ACCESS_KEY_ID`: your AWS IAM key
- `AWS_SECRET_ACCESS_KEY`: your AWS IAM secret

1. Run the service using Docker Compose:

```shell
yarn install
docker compose up
```

4. Trigger the webhook endpoint with a POST curl:

```shell
curl localhost:3030/supaglue_sync_webhook -H 'content-type: application/json' -d '{"type":"SYNC_SUCCESS", "customer_id": "<your_customer_id>"}'
```

Replace `<your_customer_id>` with the Supaglue customer you would like to sync.

5. Postgres: Inspect the synced data in Postgres (password: `postgres`):

```shell
psql -h localhost -U postgres supaglue
```

```sql
\c supaglue;
select * from crm_contacts;
```

6. (Alternative) AWS S3: If you supplied AWS environment variables in your `.env`, inspect the objects written to your S3 bucket under: `{AWS_S3_BUCKET}/{object type}/{sync epoch}`.
