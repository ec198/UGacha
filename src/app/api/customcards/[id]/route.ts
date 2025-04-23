import { MongoClient, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = "mongodb+srv://akb38117:63h7CtnHzKNBhQE7@ugachacluster.wqcbq.mongodb.net/?retryWrites=true&w=majority&appName=UGachaCluster";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('UGachaCluster');
    const collection = db.collection('customcards');

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('MongoDB delete error:', err);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  } finally {
    await client.close();
  }
}
