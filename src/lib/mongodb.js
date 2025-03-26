import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("❌ MONGO_URI is not defined in the environment variables");
}

const client = new MongoClient(mongoUri, {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
    return client.db("UGachaCluster");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message || err);
    if (err instanceof Error) {
      console.error("Detailed Error:", err);
    }
    process.exit(1); // Exit the process if the connection fails
  }
}

export default connectDB;
