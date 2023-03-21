import axios from "axios";
import querystring from "querystring";
import {
  debugLogRequestEnd,
  debugLogRequestStart,
  debugLogWriteEnd,
  debugLogWriteStart,
} from "./debug";
import prisma, { getPrismaDelegate } from "./prisma_client";
import { watermarkManager } from "./watermark_manager";

function getAxiosConfig(
  objectListName: string,
  startingUpdatedAt: Date,
  cursor?: string
) {
  const { API_HOST, API_KEY, CUSTOMER_ID, PROVIDER_NAME } = process.env;

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_HOST}/crm/v1/${objectListName}?${querystring.stringify({
      page_size: 5000,
      updated_after: startingUpdatedAt.toISOString(),
      ...{
        ...(cursor && {
          cursor,
        }),
      },
    })}`,
    headers: {
      "x-customer-id": CUSTOMER_ID,
      "x-provider-name": PROVIDER_NAME,
      "x-api-key": API_KEY,
    },
  };

  return config;
}

// Make a http request to the Supaglue API, transactionally write that to the database, update the watermark, then paginate if there are more pages.
export async function readAndWritePage(
  objectListName: string,
  startingUpdatedAt: Date,
  latestUpdatedAtSoFar: Date,
  cursor?: string
) {
  const requestStartEpoch = debugLogRequestStart(objectListName);

  const response = await axios.request(
    getAxiosConfig(objectListName, startingUpdatedAt, cursor)
  );

  debugLogRequestEnd(
    objectListName,
    requestStartEpoch,
    response.data.results.length
  );

  const writeStartEpoch = debugLogWriteStart(objectListName);

  await prisma.$transaction(
    async (tx) => {
      for (const result of response.data.results) {
        const delegate = getPrismaDelegate(tx, objectListName);

        await delegate.upsert({
          where: {
            id: result.id,
          },
          create: {
            id: result.id,
            blob: { ...result },
          },
          update: {
            id: result.id,
            blob: { ...result },
          },
        });

        if (Date.parse(result.updated_at) > latestUpdatedAtSoFar.getTime()) {
          latestUpdatedAtSoFar = new Date(result.updated_at);
        }
      }
    },
    {
      timeout: 10000,
    }
  );

  debugLogWriteEnd(objectListName, writeStartEpoch);

  if (response.data.next) {
    await readAndWritePage(
      objectListName,
      startingUpdatedAt,
      latestUpdatedAtSoFar,
      response.data.next
    );
  } else {
    // Supaglue list endpoints are ordered by id so we can only set a new watermark if we've paginated through all pages.
    watermarkManager.set(objectListName, latestUpdatedAtSoFar);
  }
}
