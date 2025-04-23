'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import bgarch from '@/assets/pink-background.jpg'; 
import ugachaArt from '@/assets/UGacha-Art.png'; 
import CardGallery from "@/components/CardGallery";

const Content = () => {
  const [view, setView] = useState<'home' | 'items'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const itemsSectionRef = useRef<HTMLDivElement>(null);
  const [backgroundHeight, setBackgroundHeight] = useState(0);

  // Check if user is logged in
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    setIsLoggedIn(!!username);
  }, []);

  // Update background height dynamically on mount and resize
  useEffect(() => {
    const updateBackgroundHeight = () => {
      const backgroundElement = document.getElementById('background');
      if (backgroundElement) {
        setBackgroundHeight(backgroundElement.clientHeight);
      }
    };

    updateBackgroundHeight();
    window.addEventListener('resize', updateBackgroundHeight);
    return () => window.removeEventListener('resize', updateBackgroundHeight);
  }, []);

  const handleViewItems = () => {
    setView('items');
    setTimeout(() => {
      if (itemsSectionRef.current) {
        itemsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBackToHome = () => {
    setView('home');
  };

  return (
    <div className="relative w-full">
      {/* Background Section */}
      <div
        id="background"
        className="relative w-full h-screen"
        style={{
          backgroundImage: `url(${bgarch.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Welcome Section with Logo and Text */}
        {view === 'home' && (
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-black px-4">
            <Image
              src={ugachaArt}
              alt="UGacha Art"
              width={300}
              height={300}
              className="mb-6 w-auto h-auto max-w-[80%]"
            />
            <h1 className="text-4xl font-bold mb-4">Welcome to UGacha!</h1>
            <p className="max-w-md">
              This website implements a card collecting game. Using the map you can find the locations of new cards. Go to the location to collect it.
            </p>
            {isLoggedIn && (
              <button
                onClick={handleViewItems}
                className="mt-6 px-6 py-3 text-lg font-semibold bg-white text-black rounded-md hover:bg-gray-300 transition"
              >
                Preview Cards
              </button>
            )}
          </div>
        )}
      </div>

      {/* Items Section */}
      {view === 'items' && (
        <div ref={itemsSectionRef} className="py-8 bg-gray-100 relative" style={{ minHeight: '200vh' }}>
          <button
            onClick={handleBackToHome}
            className="fixed top-4 left-4 px-6 py-3 text-lg font-semibold bg-white text-black rounded-md hover:bg-gray-300 transition z-50"
          >
            Close ×
          </button>
          <CardGallery />
        </div>
      )}
    </div>
  );
};

export default Content;
