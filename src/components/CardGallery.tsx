'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';

type Card = {
  _id: string;
  name: string;
  imageUrl: string;
  rarity: string;
  type?: string;
};

const CardGallery: FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cards')
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {cards.map((card) => (
        <div key={card._id} className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
          <Image
            src={card.imageUrl}
            alt={card.name}
            width={200}
            height={300}
            className="rounded-xl"
          />
          <h2 className="text-xl font-bold mt-2">{card.name}</h2>
          <span className="text-xs font-semibold text-indigo-600">{card.rarity}</span>
        </div>
      ))}
    </div>
  );
};

export default CardGallery;