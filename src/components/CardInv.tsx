'use client';

import { useState } from 'react';
import Image from 'next/image';

type Card = {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  rarity: 'common' | 'rare' | 'ultraRare';
  count: number;
};

// Tailwind classes mapped to rarity
const rarityColors: Record<Card['rarity'], string> = {
  common: 'text-gray-400',
  rare: 'text-red-500',
  ultraRare: 'text-yellow-500',
};

// Display labels mapped to rarity
const rarityLabels: Record<Card['rarity'], string> = {
  common: 'Common',
  rare: 'Rare',
  ultraRare: 'Ultra Rare',
};

// Border classes by rarity
const rarityBorders: Record<Card['rarity'], string> = {
  common: 'border border-black',
  rare: 'border-4 border-red-500',
  ultraRare: 'border-4 border-yellow-400',
};

const CardInv = ({ cards }: { cards: Card[] }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  if (!cards || cards.length === 0) {
    return <p className="text-white text-center">No cards in inventory.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 p-6">
        {cards.map((card) => (
          <button
            key={card._id}
            onClick={() => setSelectedCard(card)}
            className={`bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-lg hover:scale-[1.02] transition cursor-pointer ${rarityBorders[card.rarity]}`}
          >
            <Image
              src={card.imageUrl}
              alt={card.name}
              width={200}
              height={300}
              className="rounded-xl pointer-events-none"
            />
            <h2 className="text-xl font-bold mt-2 text-black">{card.name}</h2>
            <span className={`mt-1 text-xs font-semibold ${rarityColors[card.rarity]}`}>
              {rarityLabels[card.rarity]}
            </span>
            <p className="text-sm text-gray-600 text-center">{card.description}</p>
            <p className="text-sm text-black mt-1 font-semibold">x{card.count}</p>
          </button>
        ))}
      </div>

      {selectedCard && (
        <div
        className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      >      
            <div
            className={`w-[90vw] max-w-md bg-white rounded-xl shadow-xl p-6 relative ${rarityBorders[selectedCard.rarity]}`}
            >
            <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-2 right-2 bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300 cursor-pointer"
            >
                ✕
            </button>

            <h2 className="text-black text-2xl font-bold mb-4 text-center">{selectedCard.name}</h2>
            <Image
                src={selectedCard.imageUrl}
                alt={selectedCard.name}
                width={300}
                height={450}
                className="mx-auto rounded-xl"
            />
            <p className="text-black mt-4 text-center">{selectedCard.description}</p>
            <p className="text-black font-semibold mt-2 text-center">
                Rarity:{' '}
                <span className={rarityColors[selectedCard.rarity]}>
                {rarityLabels[selectedCard.rarity]}
                </span>
            </p>
            <p className="text-black font-semibold mt-1 text-center">
                You own: x{selectedCard.count}
            </p>
            </div>
        </div>
        )}


    </>
  );
};

export default CardInv;
