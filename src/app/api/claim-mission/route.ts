import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';

//Env Connection
const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const username = decoded.username;

    const result = await usersCollection.updateOne(
      { username },
      { $inc: { packCount: 2 } }
    );

    return NextResponse.json({ success: true, updated: result.modifiedCount > 0 });
  } catch (error) {
    console.error('Error claiming mission:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
