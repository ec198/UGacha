import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db(); // Your DB name
    const collection = db.collection('UGachaCluster.trainingCards');
    const cards = await collection.find({}).toArray();
    return Response.json(cards);
  } finally {
    await client.close();
  }
}