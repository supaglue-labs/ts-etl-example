#!/bin/bash

# Example usage: ./post_webhook.sh hubspot-customer-id hubspot contact

if [ "$#" -ne 3 ]; then
    echo "Usage: ./post_webhook.sh <customer_id> <provider_name> <common_model>"
    exit 1
fi

curl -XPOST http://localhost:3030/supaglue_sync_webhook \
        -H 'content-type: application/json' \
        -d "{\"type\": \"SYNC_SUCCESS\", \"payload\": { \"customer_id\": \"$1\", \"provider_name\": \"$2\", \"common_model\": \"$3\" } }"