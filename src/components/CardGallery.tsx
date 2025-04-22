'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Card = {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  rarity: 'common' | 'rare' | 'ultraRare';
  latitude?: number;
  longitude?: number;
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

const CardGallery = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [loadingCard, setLoadingCard] = useState(false);

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
      });
  }, []);

  const openCardModal = async (id: string) => {
    setLoadingCard(true);
    try {
      const res = await fetch(`/api/cards/${id}`);
      if (!res.ok) throw new Error('Card not found');
      const data = await res.json();
      setSelectedCard(data);
    } catch (error) {
      console.error(error);
      setSelectedCard(null);
    } finally {
      setLoadingCard(false);
    }
  };

  const closeModal = () => setSelectedCard(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {cards.map((card) => (
          <button
            key={card._id}
            onClick={() => openCardModal(card._id)}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-lg hover:scale-[1.02] transition border border-black cursor-pointer"
          >
            {card.imageUrl && (
              <Image
                src={card.imageUrl}
                alt={card.name}
                width={200}
                height={300}
                className="rounded-xl pointer-events-none"
              />
            )}
            <h2 className="text-xl font-bold mt-2 text-black">{card.name}</h2>
            <span className={`mt-1 text-xs font-semibold ${rarityColors[card.rarity]}`}>
              {rarityLabels[card.rarity]}
            </span>
            <p className="text-sm text-gray-600 text-center">{card.description}</p>
          </button>
        ))}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
          <div className="w-[90vw] max-w-md bg-white border border-gray-300 rounded-xl shadow-xl p-6 relative pointer-events-auto">
            <button
              onClick={closeModal}
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
          </div>
        </div>
      )}
    </>
  );
};

export default CardGallery;
