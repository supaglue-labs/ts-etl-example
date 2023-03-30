import {
  debugLogRequestEnd,
  debugLogRequestStart,
  debugLogWriteEnd,
  debugLogWriteStart
} from "./debug";
import { Destination } from "./destinations";
import { getSupagluePage } from "./supaglue_client";
import { WatermarkManager } from "./watermark_manager";

const { AWS_S3_BUCKET } = process.env;

export class SupagluePaginator {
  private objectListName: string;
  private customerId: string;
  private startingLastModifiedAt: Date;
  private destination: Destination;
  private incremental: boolean;
  private watermarkManager: WatermarkManager;

  constructor({
    objectListName,
    customerId,
    destination,
    incremental,
    watermarkManager,
  }: {
    objectListName: string;
    customerId: string;
    destination: Destination;
    incremental: boolean;
    watermarkManager: WatermarkManager;
  }) {
    this.objectListName = objectListName;
    this.customerId = customerId;
    this.destination = destination;
    this.incremental = incremental;
    this.watermarkManager = watermarkManager;
    this.startingLastModifiedAt = this.watermarkManager.get(this.objectListName);
  }

  async start() {
    await this.readAndWritePage(this.watermarkManager.get(this.objectListName));
  }

  // Make a http request to the Supaglue API, transactionally write that to the database, update the watermark, then paginate if there are more pages.
  private async readAndWritePage(maxLastModifiedAtSoFar: Date, cursor?: string) {
    const requestStartEpoch = debugLogRequestStart(this.objectListName);

    const response = await getSupagluePage(
      this.objectListName,
      this.customerId,
      this.startingLastModifiedAt,
      cursor
    );

    debugLogRequestEnd(
      this.objectListName,
      requestStartEpoch,
      response.data.results.length
    );

    const writeStartEpoch = debugLogWriteStart(this.objectListName);

    await this.destination.write(response.data.results);

    // Keep track of the running lastModifiedAt watermark for this sync to set at the end.
    response.data.results.forEach((result: any) => {
      if (Date.parse(result.last_modified_at) > maxLastModifiedAtSoFar.getTime()) {
        maxLastModifiedAtSoFar = new Date(result.last_modified_at);
      }
    });

    debugLogWriteEnd(this.objectListName, writeStartEpoch);

    if (response.data.next) {
      await this.readAndWritePage(maxLastModifiedAtSoFar, response.data.next);
    } else {
      if (this.incremental) {
        // Supaglue list endpoints are ordered by id so we can only set a new watermark if we've paginated through all pages.
        this.watermarkManager.set(this.objectListName, maxLastModifiedAtSoFar);
      }
    }
  }
}
