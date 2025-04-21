import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const uri = "mongodb+srv://akb38117:63h7CtnHzKNBhQE7@ugachacluster.wqcbq.mongodb.net/?retryWrites=true&w=majority&appName=UGachaCluster";

interface CardInventoryItem {
  _id: ObjectId;
  count: number;
}

interface User {
  username: string;
  password: string;
  cardInventory: CardInventoryItem[];
  packCount: number;
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

await client.connect();
const db = client.db("UGachaCluster");
const usersCollection = db.collection<User>('users');


const rarityWeights = [
  { rarity: "common", weight: 89 },
  { rarity: "rare", weight: 10 },
  { rarity: "ultraRare", weight: 1000 }
];

function getRandomRarity(weights: typeof rarityWeights) {
  const total = weights.reduce((sum, r) => sum + r.weight, 0);
  const rand = Math.random() * total;
  let running = 0;
  for (const r of weights) {
    running += r.weight;
    if (rand < running) return r.rarity;
  }
}

const SECRET_KEY = 'your_secret_key';

export async function GET(req: Request) {
  try {
    const db = await connectDB();
    if (!db || typeof db.collection !== 'function') {
      throw new Error('Database connection failed or is invalid.');
    }

    const cardsCollection = db.collection('trainingCards');
    const usersCollection = db.collection('users');

    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split('; ').find(c => c.startsWith('token='))?.split('=')[1];
    if (!token) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const user = await usersCollection.findOne({ username: decoded.username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 🎴 Generate a 4-card pack
    const pack = [];
    for (let i = 0; i < 3; i++) {
      const rarity = getRandomRarity([
        { rarity: "common", weight: 85 },
        { rarity: "rare", weight: 15 },
      ]);
      const card = await cardsCollection.aggregate([
        { $match: { rarity } },
        { $sample: { size: 1 } },
      ]).next();
      if (card) pack.push(card);
    }

    const lastRarity = getRandomRarity(rarityWeights);
    const lastCard = await cardsCollection.aggregate([
      { $match: { rarity: lastRarity } },
      { $sample: { size: 1 } },
    ]).next();
    if (lastCard) pack.push(lastCard);

    if (pack.length !== 4) {
      return NextResponse.json({ error: 'Could not fetch 4 cards' }, { status: 500 });
    }

    //Update the cardID into db
    for (const card of pack) {
      const cardId = card._id; // use directly
    
      // Try to increment count if card already in inventory
      const updateResult = await usersCollection.updateOne(
        {
          username: decoded.username,
          "cardInventory._id": cardId,
        },
        {
          $inc: { "cardInventory.$.count": 1 },
        }
      );
    
      // If the card wasn't found, push it with count 1
      if (updateResult.modifiedCount === 0) {
        await usersCollection.updateOne(
          { username: decoded.username },
          {
            $push: {
              cardInventory: {
                _id: cardId,
                count: 1,
              },
            },
          }
        );
      }
    }
    

    return NextResponse.json({ pack });
  } catch (error) {
    console.error('❌ Error opening pack:', error);
    return NextResponse.json(
      { error: 'Failed to open pack', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
