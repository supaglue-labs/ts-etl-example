import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import * as dotenv from "dotenv";

dotenv.config();

if (process.argv.length !== 4) {
  console.log(
    "Usage: npx ts-node scripts/query_playground/chroma.ts {common_object_plural_name} {query}"
  );
  process.exit(1);
}

const client = new ChromaClient();
const embedder = new OpenAIEmbeddingFunction(process.env.OPENAI_API_KEY!);

async function run() {
  const collection = await client.getCollection(process.argv[2], embedder);
  const results = await collection.query(
    undefined,
    3,
    undefined,
    process.argv[3] // user input
  );

  console.log("results", results);
}

run();
