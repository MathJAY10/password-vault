import clientPromise from "../lib/mongodb";

async function main() {
  try {
    const client = await clientPromise;
    const db = client.db("vault");
    const collections = await db.collections();
    console.log("Connected! Collections:", collections.map(c => c.collectionName));
    process.exit(0);
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
}

main();
