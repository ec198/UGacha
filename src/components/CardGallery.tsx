'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Card = {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  rarity: string;
};

const CardGallery = () => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    fetch('/api/cards')
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Failed to fetch cards');
        }
        return res.json();
      })
      .then((data) => setCards(data))
      .catch((error) => {
        console.error('Fetch error:', error);
        // Add your error state handling here
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {cards.map((card) => (
        <Link
          key={card._id}
          href={`/items/${card._id}`}
          className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition"
        >
          {card.imageUrl && (
            <Image
              src={card.imageUrl}
              alt={card.name}
              width={200}
              height={300}
              className="rounded-xl"
            />
          )}
          <h2 className="text-xl font-bold mt-2">{card.name}</h2>
          <p className="text-sm text-gray-600">{card.description}</p>
          <span className="mt-1 text-xs font-semibold text-indigo-600">{card.rarity}</span>
        </Link>
      ))}
    </div>
  );
};

export default CardGallery;
