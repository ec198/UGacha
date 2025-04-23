import { MongoClient, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = "mongodb+srv://akb38117:63h7CtnHzKNBhQE7@ugachacluster.wqcbq.mongodb.net/?retryWrites=true&w=majority&appName=UGachaCluster";

//Making a new custom card
export async function POST(req: NextRequest) {
  const client = new MongoClient(uri);

  try {
    const body = await req.json();
    const { name, type, ability, power, description, latitude, longitude, imageUrl } = body;

    if (!name || !type || !ability || !power || !description || !latitude || !longitude || !imageUrl) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('UGachaCluster');
    const collection = db.collection('customcards');

    const result = await collection.insertOne({
      name,
      type,
      ability,
      power,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      imageUrl,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, cardId: result.insertedId });
  } catch (err) {
    console.error('MongoDB insert error:', err);
    return NextResponse.json({ error: 'Failed to create custom card' }, { status: 500 });
  } finally {
    await client.close();
  }
}

//Getting all the customcards from db
export async function GET(req: NextRequest) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('UGachaCluster');
    const collection = db.collection('customcards');
    const cards = await collection.find().toArray();
    return NextResponse.json(cards);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch custom cards' }, { status: 500 });
  } finally {
    await client.close();
  }
}


//Editing the kinds of customs
export async function PUT(req: NextRequest) {
    const client = new MongoClient(uri);
  
    try {
      const body = await req.json();
      const { _id, name, type, ability, power, description, imageUrl } = body;
  
      if (!_id || !name || !type || !ability || !power || !description || !imageUrl) {
        return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
      }
  
      await client.connect();
      const db = client.db('UGachaCluster');
      const collection = db.collection('customcards');
  
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            name,
            type,
            ability,
            power,
            description,
            imageUrl,
          },
        }
      );
  
      if (result.modifiedCount === 0) {
        return NextResponse.json({ error: 'Card not found or no changes made.' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('MongoDB update error:', err);
      return NextResponse.json({ error: 'Failed to update custom card' }, { status: 500 });
    } finally {
      await client.close();
    }
  }