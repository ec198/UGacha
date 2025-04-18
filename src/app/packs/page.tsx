'use client';

import { useState } from 'react';
import Image from 'next/image';
import backOfCardImg from '@/assets/BackOfCard.png';
import packTopImg from '@/assets/Pack Top.png';
import packBottomImg from '@/assets/Pack bottm.png';

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

  const handleOpenPack = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/packs/open');
      if (!res.ok) throw new Error(`Failed to open pack: ${res.statusText}`);
      const data = await res.json();
      if (!data.pack || data.pack.length === 0) throw new Error('No cards returned.');

      setPack(data.pack);
      setIsOpened(true);

      setTimeout(() => {
        setShowCards(true);
      }, 2000);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setTimeout(() => setLoading(false), 2500);
    }
  };

  return (
    <div className="packs-container">
      <div className="pack-wrapper">
        <Image src={packBottomImg} alt="Pack Bottom" className="pack-bottom" />
        <Image
          src={packTopImg}
          alt="Pack Top"
          className={`pack-top ${isOpened ? 'animate-top-off' : ''}`}
        />

        <div className={`cards ${showCards ? 'reveal-cards' : ''}`}>
          {pack.map((card, index) => (
            <div key={card._id} className={`card-wrapper card-${index + 1}`}>
              <div className="card-inner">
                <div className="card-front">
                  <Image src={backOfCardImg} alt="Card Back" width={280} height={420} />
                </div>
                <div className="card-back">
                  <Image src={card.imageUrl} alt={card.name} width={280} height={420} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isOpened && (
          <button onClick={handleOpenPack} className="open-btn">
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
          overflow: visible; /* ✅ allow animation to overflow screen */
        }

        .pack-wrapper {
          position: relative;
          width: 300px;
          height: 420px;
          overflow: visible; /* ✅ ensure packTop can escape */
        }

        .pack-bottom,
        .pack-top {
          top: 0;
          left: 0;
          width: 100%;
          position: absolute;
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
          transform-origin: center top; /* ✅ more natural peeling effect */
          pointer-events: none; /* ✅ avoid clicks during animation */
        }

        @keyframes ripTopOff {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) rotate(-20deg);
            opacity: 0;
          }
        }

        .cards {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
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
          animation: fanLeftFarFlip 1s ease 0.3s forwards;
        }

        .reveal-cards .card-2 .card-inner {
          animation: fanLeftFlip 1s ease 0.6s forwards;
        }

        .reveal-cards .card-3 .card-inner {
          animation: fanRightFlip 1s ease 0.9s forwards;
        }

        .reveal-cards .card-4 .card-inner {
          animation: fanRightFarFlip 1s ease 1.2s forwards;
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
