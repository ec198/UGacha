import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

//Env Connection
const uri = process.env.MONGODB_URI!;

export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('UGachaCluster');
    const collection = db.collection('packlocation');

    // Randomly pick 2 unique location cards to pin pack onto map
    const locations = await collection.aggregate([
      { $sample: { size: 2 } },
      { $project: { _id: 0, name: 1, latitude: 1, longitude: 1 } }
    ]).toArray();

    return NextResponse.json(locations);
  } catch (err) {
    console.error('MongoDB fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch location cards' }, { status: 500 });
  } finally {
    await client.close();
  }
}
