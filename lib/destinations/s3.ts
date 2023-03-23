import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
  private syncStartTime: Date;

  constructor(objectListName: string, syncStartTime: Date) {
    this.syncStartTime = syncStartTime;
    this.objectListName = objectListName;
  }

  async write(results: any[]): Promise<void> {
    if (results.length) {
      const ndjson = results
        .map((result) => `${JSON.stringify(result)}`)
        .join("\n");

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `${this.syncStartTime.toISOString()}/${
          this.objectListName
        }/${Date.now()}`,
        Body: ndjson,
      });

      await client.send(command);
    }
  }
}
