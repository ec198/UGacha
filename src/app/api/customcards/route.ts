import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = "mongodb+srv://akb38117:63h7CtnHzKNBhQE7@ugachacluster.wqcbq.mongodb.net/?retryWrites=true&w=majority&appName=UGachaCluster";

export async function POST(req: NextRequest) {
  const client = new MongoClient(uri);

  try {
    const body = await req.json();
    const { name, type, ability, power, description, latitude, longitude, imageUrl } = body;

    // Ensure all required fields are present
    if (!name || !type || !ability || !power || !description || !latitude || !longitude || !imageUrl) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('UGachaCluster');
    const collection = db.collection('customcards');

    // Insert the new custom card into the "customcards" collection
    const result = await collection.insertOne({
      name,
      type,
      ability,
      power,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      imageUrl,
      createdAt: new Date(), // Optionally track when the card was created
    });

    return NextResponse.json({ success: true, cardId: result.insertedId });
  } catch (err) {
    console.error('MongoDB insert error:', err);
    return NextResponse.json({ error: 'Failed to create custom card' }, { status: 500 });
  } finally {
    await client.close();
  }
}
