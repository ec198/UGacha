'use client';

import { useState } from 'react';
import Image from 'next/image';
import pinkBackground from '@/assets/pink-background.jpg';

type Card = {
  _id: string;
  name: string;
  rarity: string;
  type: string;
  imageUrl: string;
  move: string;
  power: number;
  description: string;
};

const Packs = () => {
  const [pack, setPack] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpenPack = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/packs/open');
      if (!res.ok) throw new Error(`Failed to open pack: ${res.statusText}`);
      const data = await res.json();
      if (!data.pack || data.pack.length === 0) throw new Error('No cards returned.');
      setPack(data.pack);
    } catch (error: any) {
      console.error('Error opening pack:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <Image
        src={pinkBackground}
        alt="Pink Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen py-16 px-4 md:px-8">
        {/* Open Pack Button */}
        <button
          onClick={handleOpenPack}
          className="bg-white text-pink-600 px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-pink-100 transition mb-8"
        >
          {loading ? 'Opening...' : 'Open Pack'}
        </button>

        {/* Display the Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center w-full max-w-6xl">
          {pack.map((card, index) => (
            <div
              key={`${card._id}-${index}`} // Fallback to ensure unique keys
              className={`p-6 rounded-2xl shadow-lg text-center bg-white/80 backdrop-blur-sm text-black ${
                card.rarity === 'ultraRare'
                  ? 'border-4 border-yellow-500'
                  : card.rarity === 'rare'
                  ? 'border-4 border-blue-400'
                  : 'border'
              }`}
            >
              <Image
                src={card.imageUrl}
                alt={card.name}
                width={160}
                height={160}
                className="mx-auto mb-3 rounded-xl"
              />
              <h2 className="text-xl font-bold">{card.name}</h2>
              <p className="text-base capitalize">{card.type}</p>
              <p
                className={`mt-1 text-sm italic ${
                  card.rarity === 'common'
                    ? 'text-gray-400'
                    : card.rarity === 'rare'
                    ? 'text-blue-500'
                    : card.rarity === 'ultraRare'
                    ? 'text-yellow-600'
                    : ''
                }`}
              >
                {card.rarity === 'ultraRare' ? 'ultra rare' : card.rarity}
              </p>
              <p className="mt-2 text-sm px-2">{card.description}</p>
              <div className="mt-2 text-base font-medium">Power: {card.power}</div>
              <div className="text-sm text-gray-600">Move: {card.move}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packs;
