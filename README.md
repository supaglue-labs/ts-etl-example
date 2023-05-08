# typescript-syncer

A simple implementation of a syncer to move your customers' CRM data from Supaglue's API to various destinations (below) using Nodejs/Typescript/Express.

You can 1-click deploy to a cloud hosting platform or run it locally.

## Reference destinations

Set `DESTINATION` to one of the following:
- `postgres`
- `s3`
- `chroma`

See [destination reference docs](/docs/destinations) for more details on using those destinations.

## Cloud

1. 1-click deploy:

    [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/IH6VTn?referralCode=_jOnzI)

    [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/supaglue-labs/typescript-syncer)

2. Fill in the required environment variables:

    - `API_HOST`: your Supaglue API host.
    - `API_KEY`: your Supaglue API key.

    And any relevant ones depending on your destination.

    Start the server using `yarn start`.

3. Trigger a sync by making a POST request to your typescript-syncer instance's `/supaglue_sync_webhook` endpoint:

    ```shell
    curl -XPOST https://{TYPESCRIPT_SYNCER_URL}/supaglue_sync_webhook \
        -H 'content-type: application/json' \
        -d '{"type":"SYNC_SUCCESS", "payload": { "customer_id": "{YOUR_SUPAGLUE_CUSTOMER_ID}", "provider_name": "{YOUR_CUSTOMERS_CRM_PROVIDER}", "common_model": "{SUPAGLUE_COMMON_MODEL}" } }'
    ```

    Replace:

    - `{TYPESCRIPT_SYNCER_URL}`: the URL your typescript-syncer is hosted at.
    - `{YOUR_SUPAGLUE_CUSTOMER_ID}`: with the Supaglue customer you would like to sync.
    - `{YOUR_CUSTOMERS_CRM_PROVIDER}`: the CRM your customer is using.
    - `{SUPAGLUE_COMMON_MODEL}`: the CRM your customer is using.

## Locally (docker compose)

1. Copy the the sample env file and fill in the required environment variables:

    - `API_HOST`: your Supaglue API host.
    - `API_KEY`: your Supaglue API key.

    And any relevant ones depending on your destination.

    Start the server using `yarn start`.

2. Run the service using Docker Compose:

    ```shell
    yarn install
    docker compose up
    ```

3. Trigger the webhook endpoint with a POST curl:

    ```shell
    ./scripts/post_webhook.sh {YOUR_SUPAGLUE_CUSTOMER_ID} {YOUR_CUSTOMERS_CRM_PROVIDER} {COMMON_MODEL}
    ```

    Replace:

    - `{YOUR_SUPAGLUE_CUSTOMER_ID}`: with the Supaglue customer you would like to sync.
    - `{YOUR_CUSTOMERS_CRM_PROVIDER}`: the CRM your customer is using.
    - `{COMMON_MODEL}`: the common model that you would like to sync.

