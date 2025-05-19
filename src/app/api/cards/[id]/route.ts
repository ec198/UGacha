import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

//Env Connection
const uri = process.env.MONGODB_URI!;

function isValidObjectId(id: string) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('UGachaCluster');
    const collection = db.collection('trainingCards');

    const card = await collection.findOne({ _id: new ObjectId(id) });

    if (!card) {
      return NextResponse.json({ message: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (err) {
    console.error('MongoDB single fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  } finally {
    await client.close();
  }
}
