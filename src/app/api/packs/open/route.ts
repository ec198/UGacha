import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

const rarityWeights = [
  { rarity: "common", weight: 89 },
  { rarity: "rare", weight: 10 },
  { rarity: "ultraRare", weight: 1 }
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

export async function GET() {
  try {
    const db = await connectDB();

    // ✅ Safety check
    if (!db || typeof db.collection !== 'function') {
      throw new Error('Database connection failed or is invalid.');
    }

    const cardsCollection = db.collection('trainingCards');

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
      console.error('❌ Not enough cards found:', pack.length);
      return NextResponse.json({ error: 'Could not fetch 4 cards' }, { status: 500 });
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
