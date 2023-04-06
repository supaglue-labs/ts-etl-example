# typescript-syncer

A simple implementation for syncing your customers' CRM data from Supaglue's API to Postgres or AWS S3 (using Nodejs, Typescript, Express, Prisma, and Axios).

You can 1-click deploy to a cloud hosting platform or run it locally.

## Cloud

1. 1-click deploy:

    [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/IH6VTn?referralCode=_jOnzI)

    [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/supaglue-labs/typescript-syncer)

1. Enter these environment variables:

    - `API_HOST`: your Supaglue API host.
    - `API_KEY`: your Supaglue API key.

    (Optional) To write to AWS S3 instead of Postgres, enter these environment variables:
    - `AWS_REGION`: the region of your AWS S3 bucket.
    - `AWS_S3_BUCKET`: the AWS S3 bucket to write to (you will need PUT object access).
    - `AWS_ACCESS_KEY_ID`: your AWS IAM key.
    - `AWS_SECRET_ACCESS_KEY`: your AWS IAM secret.

    Use `yarn start_for_s3` or `yarn start_for_postgres` to target different destinations.

1. Trigger a sync to Postgres or S3 by making a POST request to your instance of typescript-syncer:

    ```shell
    curl -XPOST https://{HOSTED-TYPESCRIPT-SYNCER-URL}/supaglue_sync_webhook \
        -H 'content-type: application/json' \
        -d '{"type":"SYNC_SUCCESS", "payload": { "customer_id": "{YOUR_SUPAGLUE_CUSTOMER_ID}", "provider_name": "{YOUR_CUSTOMERS_CRM_PROVIDER}" } }'
    ```

    Replace:

    - `{HOSTED-TYPESCRIPT-SYNCER-URL}`: the URL your typescript-syncer is hosted at.
    - `{YOUR_SUPAGLUE_CUSTOMER_ID}`: with the Supaglue customer you would like to sync.
    - `{YOUR_CUSTOMERS_CRM_PROVIDER}`: the CRM your customer is using.

1. (Optional) Use the Supaglue [Management API's Webhook endpoints](https://docs.supaglue.com/api/mgmt#tag/Webhook/operation/createWebhook) or Supaglue Management Portal to register the typescript-syncer's webhook so it syncs automatically:

    `https://{HOSTED-TYPESCRIPT-SYNCER-URL}/supaglue_sync_webhook`

## Run locally (sync to Postgres)

1. Create an `.env` file from the provided sample:

    ```shell
    cp .env.sample .env
    ```

1. Supply the missing environment variables:

    - `API_HOST`: your Supaglue API host
    - `API_KEY`: your Supaglue API key
    - `PAGE_SIZE`: how many records to fetch per request

    By default this example app will write to Postgres. If you would like to write to S3 instead, fill in the environment variables below:

    - `AWS_REGION`: the region of your AWS S3 bucket
    - `AWS_S3_BUCKET`: the AWS S3 bucket to write to (you will need PUT object access)
    - `AWS_ACCESS_KEY_ID`: your AWS IAM key
    - `AWS_SECRET_ACCESS_KEY`: your AWS IAM secret

    And change `yarn start` to `yarn start_for_s3`.

1. Run the service using Docker Compose:

    ```shell
    yarn install
    docker compose up
    ```

1. Trigger the webhook endpoint with a POST curl:

    ```shell
    curl -XPOST localhost:3030/supaglue_sync_webhook \
        -H 'content-type: application/json' \
        -d '{"type":"SYNC_SUCCESS", "payload": { "customer_id": "{YOUR_SUPAGLUE_CUSTOMER_ID}", "provider_name": "{YOUR_CUSTOMERS_CRM_PROVIDER}", "common_model": "{COMMON_MODEL}" } }'
    ```

    Replace:

    - `{YOUR_SUPAGLUE_CUSTOMER_ID}`: with the Supaglue customer you would like to sync.
    - `{YOUR_CUSTOMERS_CRM_PROVIDER}`: the CRM your customer is using.
    - `{COMMON_MODEL}`: the common model that you would like to sync.

1. Postgres: Inspect the synced data in Postgres (password: `postgres`):

    ```shell
    psql -h localhost -U postgres supaglue
    ```

    ```sql
    \c supaglue;
    select * from crm_contacts;
    ```

1. (Alternative) AWS S3: If you supplied AWS environment variables in your `.env`, inspect the objects written to your S3 bucket under: `{AWS_S3_BUCKET}/{object type}/{sync epoch}`.
