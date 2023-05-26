import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { Destination } from ".";

dotenv.config();
const uri = process.env.MONGODB_URI!;
const db = process.env.MONGODB_DB!;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export class MongoDbDestination implements Destination {
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

  async dropExistingRecordsIfNecessary() {}

  async write(results: Record<string, any>[]): Promise<void> {
    const database = client.db(db);

    try {
      await database.createCollection(this.objectListName);
    } catch (err) {
      console.log("collection already exists");
    }

    const objectsCollection = database.collection(this.objectListName);
    await objectsCollection.insertMany(results);

    console.log("wrote to mongodb", this.objectListName, results.length);
  }
}
