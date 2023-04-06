import {
  debugLogRequestEnd,
  debugLogRequestStart,
  debugLogWriteEnd,
  debugLogWriteStart,
} from "./debug";
import { Destination } from "./destinations";
import { getSupagluePage } from "./supaglue_client";
import { WatermarkManager } from "./watermark_manager";

export class SupagluePaginator {
  public readonly objectListName: string;
  public readonly customerId: string;
  public readonly providerName: string;
  private startingLastModifiedAt: Date;
  private destination: Destination;
  private incremental: boolean;
  private watermarkManager: WatermarkManager;

  constructor({
    objectListName,
    customerId,
    providerName,
    destination,
    incremental,
    watermarkManager,
  }: {
    objectListName: string;
    customerId: string;
    providerName: string;
    destination: Destination;
    incremental: boolean;
    watermarkManager: WatermarkManager;
  }) {
    this.objectListName = objectListName;
    this.customerId = customerId;
    this.providerName = providerName;
    this.destination = destination;
    this.incremental = incremental;
    this.watermarkManager = watermarkManager;
    this.startingLastModifiedAt = this.watermarkManager.get(
      this.objectListName,
      this.customerId,
      this.providerName
    );
  }

  async start() {
    await this.readAndWritePage(this.startingLastModifiedAt);
  }

  // Make a http request to the Supaglue API, transactionally write that to the database, update the watermark, then paginate if there are more pages.
  private async readAndWritePage(
    maxLastModifiedAtSoFar: Date,
    cursor?: string
  ) {
    const requestStartEpoch = debugLogRequestStart(this.objectListName, this.customerId, this.providerName);

    const response = await getSupagluePage(
      this.objectListName,
      this.customerId,
      this.providerName,
      this.startingLastModifiedAt,
      cursor
    );

    debugLogRequestEnd(
      this.objectListName,
      this.customerId,
      this.providerName,
      requestStartEpoch,
      response.data.results.length
    );

    const writeStartEpoch = debugLogWriteStart(this.objectListName, this.customerId, this.providerName);

    await this.destination.write(response.data.results);

    // Keep track of the running lastModifiedAt watermark for this sync to set at the end.
    response.data.results.forEach((result: any) => {
      if (
        Date.parse(result.last_modified_at) > maxLastModifiedAtSoFar.getTime()
      ) {
        maxLastModifiedAtSoFar = new Date(result.last_modified_at);
      }
    });

    debugLogWriteEnd(this.objectListName, this.customerId, this.providerName, writeStartEpoch);

    if (response.data.next) {
      await this.readAndWritePage(maxLastModifiedAtSoFar, response.data.next);
    } else {
      if (this.incremental) {
        // Supaglue list endpoints are ordered by id so we can only set a new watermark if we've paginated through all pages.
        this.watermarkManager.set(this.objectListName, this.customerId, this.providerName, maxLastModifiedAtSoFar);
      }
    }
  }
}
