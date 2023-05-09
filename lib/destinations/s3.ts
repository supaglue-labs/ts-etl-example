import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";
import { Destination } from ".";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

export class S3Destination implements Destination {
  private objectListName: string;
  private customerId: string;
  private providerName: string;
  private syncStartTime: Date;

  constructor(
    objectListName: string,
    customerId: string,
    providerName: string,
    syncStartTime: Date
  ) {
    this.objectListName = objectListName;
    this.customerId = customerId;
    this.providerName = providerName;
    this.syncStartTime = syncStartTime;
  }

  getKeyPrefix() {
    return `${this.objectListName}/${this.customerId}/${this.providerName}`;
  }

  async dropExistingRecordsIfNecessary() {
    console.log("Dropping existing S3 records...", {
      objectListName: this.objectListName,
      customerId: this.customerId,
      providerName: this.providerName,
    });
    const paginator = paginateListObjectsV2(
      {
        client,
        pageSize: 1000,
      },
      {
        Bucket: process.env.AWS_S3_BUCKET!,
        Prefix: this.getKeyPrefix(),
      }
    );

    for await (const page of paginator) {
      const keys = page.Contents?.flatMap((content) => content.Key ?? []) ?? [];
      console.log("Dropping S3 objects by keys:", JSON.stringify(keys), {
        objectListName: this.objectListName,
        customerId: this.customerId,
        providerName: this.providerName,
      });
      if (!keys.length) {
        continue;
      }
      const command = new DeleteObjectsCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      });
      await client.send(command);
    }
  }

  async write(results: Record<string, any>[]): Promise<void> {
    console.log("Writing S3 objects", {
      objectListName: this.objectListName,
      customerId: this.customerId,
      providerName: this.providerName,
    });
    if (results.length) {
      const ndjson = results
        .map((result) =>
          JSON.stringify({
            ...result,
            customer_id: this.customerId,
            provider_name: this.providerName,
          })
        )
        .join("\n");

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `${this.getKeyPrefix()}/${Date.now()}`,
        Body: ndjson,
      });

      await client.send(command);
    }
  }
}
