import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = "mongodb+srv://akb38117:63h7CtnHzKNBhQE7@ugachacluster.wqcbq.mongodb.net/?retryWrites=true&w=majority&appName=UGachaCluster";

export async function GET() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('UGachaCluster'); 
    const collection = db.collection('trainingCards'); 
    const cards = await collection.find({}).toArray();
    return NextResponse.json(cards);
  } catch (err) {
    console.error('MongoDB fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  } finally {
    await client.close();
  }
}
