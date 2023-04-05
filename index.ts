import express from "express";
import { PrismaDestination } from "./lib/destinations/prisma";
import { S3Destination } from "./lib/destinations/s3";
import { SupagluePaginator } from "./lib/supaglue_paginator";
import { WatermarkManager } from "./lib/watermark_manager";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3030;
const { SYNC_PARALLELISM = "1", AWS_S3_BUCKET: isS3Destination } = process.env;

// Persist this for the duration that the server is running.
const watermarkManager = new WatermarkManager();

app.post("/supaglue_sync_webhook", async (req, res) => {
  if (
    req.body.type !== "SYNC_SUCCESS" ||
    !req.body?.payload?.customer_id ||
    !req.body?.payload?.provider_name
  ) {
    return res
      .status(400)
      .send("not a sync success event or no customer_id/provider_name");
  }

  const objectsToSync = [
    "users",
    "accounts",
    "leads",
    "opportunities",
    "contacts",
  ];

  const syncStartTime = new Date();

  // Paginate and write by object type using SYNC_PARALLELISM concurrency
  while (objectsToSync.length) {
    const objectListNames = objectsToSync.splice(
      -1 * parseInt(SYNC_PARALLELISM, 10)
    );

    await Promise.all(
      objectListNames.map((objectListName) => {
        const supagluePaginator = new SupagluePaginator({
          objectListName,
          customerId: req.body.payload.customer_id,
          providerName: req.body.payload.provider_name,
          destination: isS3Destination
            ? new S3Destination(objectListName, syncStartTime)
            : new PrismaDestination(objectListName, syncStartTime),
          incremental: isS3Destination ? false : true,
          watermarkManager,
        });

        return supagluePaginator.start();
      })
    );
  }

  return res.send("ok");
});

app.get("/healthz", (req, res) => {
  return res.send("ok");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
