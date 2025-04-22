'use client';

import { useEffect, useState } from 'react';
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
  const [isOpened, setIsOpened] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [packCount, setPackCount] = useState<number>(0);

  useEffect(() => {
    const fetchPackCount = async () => {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        const data = await res.json();
        setPackCount(data.packCount ?? 0);
      }
    };

    fetchPackCount();
  }, []);

  const handleOpenPack = async () => {
    try {
      setLoading(true);
      setIsOpened(false);
      setShowCards(false);

      requestAnimationFrame(() => {
        const top = document.querySelector('.pack-top') as HTMLElement | null;
        if (top) void top.offsetWidth;
        setIsOpened(true);
      });

      const res = await fetch('/api/packs/open');
      if (!res.ok) throw new Error(`Failed to open pack: ${res.statusText}`);
      const data = await res.json();
      if (!data.pack || data.pack.length === 0) throw new Error('No cards returned.');
      setPack(data.pack);
      setPackCount((prev) => Math.max(prev - 1, 0));

      setTimeout(() => {
        setShowCards(true);
      }, 2000);

      setTimeout(() => {
        setIsOpened(false);
      }, 5000);
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
                    : card.rarity === 'ultra rare'
                    ? 'text-red-500'
                    : ''
                }`}
              >
                {card.rarity}
              </p>
              <p className="mt-2 text-sm px-2">{card.description}</p>
              <div className="mt-2 text-base font-medium">Power: {card.power}</div>
              <div className="text-sm text-gray-600">Move: {card.move}</div>
            </div>
          ))}
        </div>

        {!isOpened && packCount > 0 && (
          <button onClick={handleOpenPack} className="open-btn text-black">
            {loading ? 'Opening...' : 'Open Pack'}
          </button>
        )}
      </div>


      <style jsx>{`
        .packs-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: pink;
          overflow: visible;
        }

        .pack-wrapper {
          position: relative;
          width: 300px;
          height: 420px;
          overflow: visible;
        }

        .pack-bottom,
        .pack-top {
          height: 150px;
        }

        .pack-bottom {
          z-index: 5;
        }

        .pack-top {
          z-index: 10;
          pointer-events: auto;
          transition: transform 0.3s ease;
        }

        .pack-top.animate-top-off {
          animation: ripTopOff 2s ease-out forwards;
          transform-origin: center top;
          pointer-events: none;
          position: absolute;
          top: 0;
        }

        @keyframes ripTopOff {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          40% {
            transform: translateY(-100px) rotate(-10deg) scale(1.05);
          }
          70% {
            transform: translateY(-200px) rotate(-15deg) scale(1.1);
          }
          100% {
            transform: translateY(-350px) rotate(-30deg) scale(1.2);
            opacity: 0;
          }
        }

        .pack-top-wrapper,
        .pack-bottom-wrapper {
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
        }

        .pack-bottom-wrapper {
          z-index: 5;
        }

        .pack-top-wrapper {
          z-index: 10;
        }

        .cards {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 11;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .reveal-cards {
          opacity: 1;
        }

        .card-wrapper {
          width: 140px;
          height: 210px;
          perspective: 1000px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
        }

        .reveal-cards .card-wrapper {
          opacity: 1;
        }

        .card-inner {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .reveal-cards .card-1 .card-inner {
          animation: fanLeftFarFlip 1s ease 1.5s forwards;
        }

        .reveal-cards .card-2 .card-inner {
          animation: fanLeftFlip 1.5s ease 2s forwards;
        }

        .reveal-cards .card-3 .card-inner {
          animation: fanRightFlip 2s ease 2.5s forwards;
        }

        .reveal-cards .card-4 .card-inner {
          animation: fanRightFarFlip 3s ease 4s forwards;
        }

        @keyframes fanLeftFarFlip {
          0% {
            transform: rotateY(0deg) translateX(0) rotate(0deg);
          }
          100% {
            transform: rotateY(180deg) translateX(-500px) rotate(-15deg) translateY(20px);
          }
        }

        @keyframes fanLeftFlip {
          0% {
            transform: rotateY(0deg) translateX(0) rotate(0deg);
          }
          100% {
            transform: rotateY(180deg) translateX(-210px) rotate(-5deg) translateY(-50px);
          }
        }

        @keyframes fanRightFlip {
          0% {
            transform: rotateY(0deg) translateX(0) rotate(0deg);
          }
          100% {
            transform: rotateY(180deg) translateX(80px) rotate(5deg) translateY(-60px);
          }
        }

        @keyframes fanRightFarFlip {
          0% {
            transform: rotateY(0deg) translateX(0) rotate(0deg);
          }
          100% {
            transform: rotateY(180deg) translateX(370px) rotate(15deg) translateY(-20px);
          }
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 200%;
          height: 200%;
          backface-visibility: hidden;
          border-radius: 30px;
          background: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-front {
          background: gray;
        }

        .card-back {
          transform: rotateY(180deg);
        }

        .open-btn {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;
          background: white;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Packs;
