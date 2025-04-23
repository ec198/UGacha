'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import pinkBackground from '@/assets/pink-background.jpg';
import CardInv from '../../components/CardInv';
import CustomCardGallery from '@/components/CustomCardGallery';


type Card = {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  rarity: 'common' | 'rare' | 'ultraRare';
};

type InventoryItem = {
  _id: string;
  count: number;
};

const Library = () => {
  const [cardInventory, setCardInventory] = useState<(Card & { count: number })[]>([]);

  useEffect(() => {
    const fetchInventoryAndCards = async () => {
      try {
        // Step 1: Get user info from token
        const userRes = await fetch('/api/auth/user');
        const userData = await userRes.json();

        if (!userRes.ok) {
          throw new Error(userData.message || 'Failed to fetch user');
        }

        // Step 2: Use username to get inventory + cards
        const [invRes, cardsRes] = await Promise.all([
          fetch('/api/auth/user', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch('/api/cards'),
        ]);

        const invData: { cardInventory: InventoryItem[] } = await invRes.json();
        const cardData: Card[] = await cardsRes.json();

        if (!invRes.ok || !cardsRes.ok) {
          throw new Error(invData.cardInventory ? 'Inventory fetch error' : 'Card fetch error');
        }

        // Step 3: Match card details with counts
        const combined = invData.cardInventory
          .map((item: InventoryItem) => {
            const card = cardData.find((c: Card) => c._id === item._id);
            return card ? { ...card, count: item.count } : null;
          })
          .filter((card): card is Card & { count: number } => card !== null);

        setCardInventory(combined);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchInventoryAndCards();
  }, []);

  return (
    <div className="w-full min-h-screen relative">
      <Image
        src={pinkBackground}
        alt="Pink Background"
        fill
        className="absolute inset-0 object-cover"
      />
      <div className="relative z-10 p-6">
        <h1 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
          Library
        </h1>
        <CardInv cards={cardInventory} />
        <CustomCardGallery />
      </div>
    </div>
  );
};

export default Library;
