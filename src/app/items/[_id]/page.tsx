'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import bgarch from '@/assets/pink-background.jpg';

interface Card {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  rarity: string;
}

const ItemPage = () => {
  const { _id } = useParams();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (_id) {
      fetch(`/api/cards/${_id}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error('Card not found');
          }
          return res.json();
        })
        .then((data) => setCard(data))
        .catch((err) => {
          console.error(err);
          setCard(null);
        })
        .finally(() => setLoading(false));
    }
  }, [_id]);

  if (loading) {
    return <div className="text-center p-10 text-white">Loading...</div>;
  }

  if (!card) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgarch.src})` }}
      >
        <div className="text-red-600 font-semibold bg-white bg-opacity-90 px-4 py-2 rounded shadow">
          Item not found
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgarch.src})` }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="w-3/4 h-auto mx-auto p-6 rounded-lg bg-white bg-opacity-90">
          <h2 className="text-black text-3xl font-bold mb-4">{card.name}</h2>
          <img src={card.imageUrl} alt={card.name} className="w-auto h-3/4 mx-auto" />
          <p className="text-black mt-4">{card.description}</p>
          <p className="text-black font-semibold mt-2">Rarity: {card.rarity}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
