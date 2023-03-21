import express from "express";
import { readAndWritePage } from "./lib/supaglue";
import { watermarkManager } from "./lib/watermark_manager";

const app = express();
app.use(express.json());
const port = 3030;
const { SYNC_PARALLELISM = "1" } = process.env;

app.post("/supaglue_sync_webhook", async (req, res) => {
  if (req.body.type !== "SYNC_SUCCESS") {
    return res.status(400).send("not a sync success event");
  }

  const objectsToSync = [
    "users",
    "accounts",
    "leads",
    "opportunities",
    "contacts",
  ];

  // Paginate and write by object type using SYNC_PARALLELISM concurrency
  while (objectsToSync.length) {
    const objectListNames = objectsToSync.splice(
      -1 * parseInt(SYNC_PARALLELISM, 10)
    );
    await Promise.all(
      objectListNames.map((objectListName) =>
        readAndWritePage(
          objectListName,
          watermarkManager.get(objectListName),
          watermarkManager.get(objectListName)
        )
      )
    );
  }

  return res.send("ok");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
