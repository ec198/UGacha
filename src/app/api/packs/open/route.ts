// src/app/api/packs/open/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Your MongoDB connection file

const rarityWeights = [
  { rarity: "common", weight: 90 },
  { rarity: "rare", weight: 10 },
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
    const client = await clientPromise;
    const db = client.db('ugacha');
    const cardsCollection = db.collection('cards');

    const pack = [];

    // Fetch 3 cards with weighted rarity
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

    // Last card with better odds for rare
    const lastRarity = getRandomRarity(rarityWeights);
    const lastCard = await cardsCollection.aggregate([
      { $match: { rarity: lastRarity } },
      { $sample: { size: 1 } },
    ]).next();
    if (lastCard) pack.push(lastCard);

    if (pack.length !== 4) {
      return NextResponse.json({ error: 'Could not fetch 4 cards' }, { status: 500 });
    }

    return NextResponse.json({ pack });
  } catch (error) {
    console.error('Error opening pack:', error);
    return NextResponse.json({ error: 'Failed to open pack' }, { status: 500 });
  }
}
