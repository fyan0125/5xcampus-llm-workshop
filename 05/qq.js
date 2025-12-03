import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_CLINET_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const result = await client.createCollection("qq", {
  vectors: {
    size: 768,
    distance: "Cosine",
  },
});

console.log(result);
