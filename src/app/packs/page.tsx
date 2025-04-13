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

  // Function to open the pack
  const handleOpenPack = async () => {
    try {
      console.log("📦 Opening a new pack... cp-1");
      setLoading(true); // Show loading indicator
      console.log("📦 Opening a new pack... cp1");
      const res = await fetch('/api/packs/open'); // API request to fetch the pack
      console.log('API Response:', res);  // Log the raw response to check for errors
      console.log("📦 Opening a new pack...cp2");
      if (!res.ok) throw new Error(`Failed to open pack: ${res.statusText}`);  // Check if the response is okay
      const data = await res.json();  // Parse the response as JSON
      console.log('Data received from API:', data);  // Log the parsed data for debugging

      // Ensure pack data is available and set state
      if (!data.pack || data.pack.length === 0) throw new Error('No cards returned.');
      setPack(data.pack); // Set the cards from the pack
    } catch (error: any) {
      console.error('Error opening pack:', error);
      alert(`Error: ${error.message}`);  // Show error message if something went wrong
    } finally {
      setLoading(false); // Hide loading indicator after the process completes
    }
  };

  return (
    <div className="w-full h-screen relative">
      <Image
        src={pinkBackground}
        alt="Pink Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
        {/* Open Pack Button */}
        <button
          onClick={handleOpenPack}
          className="bg-white text-pink-600 px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-pink-100 transition"
        >
          {loading ? 'Opening...' : 'Open Pack'}
        </button>

        {/* Display the Cards in the Pack */}
        <div className="flex flex-wrap justify-center mt-6 gap-4">
          {pack.map((card) => (
            <div
              key={card._id}
              className={`p-4 rounded-xl shadow-lg text-center w-48 h-60 bg-white/80 backdrop-blur-sm ${
                card.rarity === 'legendary'
                  ? 'border-4 border-yellow-400'
                  : card.rarity === 'epic'
                  ? 'border-4 border-purple-500'
                  : card.rarity === 'rare'
                  ? 'border-4 border-blue-400'
                  : 'border'
              }`}
            >
              <Image
                src={card.imageUrl}
                alt={card.name}
                width={100}
                height={100}
                className="mx-auto mb-2 rounded-lg"
              />
              <h2 className="text-lg font-bold">{card.name}</h2>
              <p className="text-sm capitalize">{card.type}</p>
              <p className="mt-2 text-xs italic">{card.rarity}</p>
              <p className="mt-2 text-sm">{card.description}</p>
              <div className="mt-2 text-sm">Power: {card.power}</div>
              <div className="text-xs text-gray-500">Move: {card.move}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packs;
