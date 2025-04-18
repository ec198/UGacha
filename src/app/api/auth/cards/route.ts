// src/app/api/cards/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Adjust path as needed

export async function GET() {
  try {
    const db = await connectDB();
    const cards = await db.collection('trainingCard').find({}).toArray();
    
    return NextResponse.json(
      cards.map(card => ({
        ...card,
        _id: card._id.toString(), // Convert MongoDB ObjectId to string
      }))
    );
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}