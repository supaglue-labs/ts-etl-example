import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import * as dotenv from "dotenv";
import { Destination } from ".";

dotenv.config();

const client = new ChromaClient();
const embedder = new OpenAIEmbeddingFunction(process.env.OPENAI_API_KEY!);

export class ChromaDestination implements Destination {
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

  async dropExistingRecordsIfNecessary() {
    console.log("dropping collection", this.objectListName);
    await client.deleteCollection(this.objectListName);
  }

  async write(results: Record<string, any>[]): Promise<void> {
    let collection: Collection | null = null;
    try {
      collection = await client.createCollection(
        this.objectListName,
        {},
        embedder
      );
    } catch (e) {
      collection = await client.getCollection(this.objectListName, embedder);
    }

    const ids = results.map((r) => r.id);
    const metadata = Array(results.length).fill({ source: this.providerName });
    const documents = results.map((r) => r.email_addresses[0]?.email_address); // TODO: insert sane documents

    await collection.add(ids, undefined, metadata, documents);

    console.log(
      "wrote to chroma collection",
      this.objectListName,
      results.length
    );
  }
}
