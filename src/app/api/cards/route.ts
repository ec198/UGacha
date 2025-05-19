import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

//Env Connection
const uri = process.env.MONGODB_URI!;

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
