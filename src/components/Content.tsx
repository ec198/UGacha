'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Welcome from '@/components/Welcome';
import bgarch from '@/assets/pink-background.jpg'; // Background image
import ugachaArt from '@/assets/UGacha-Art.png'; // Overlay image
import Items from '@/components/Items'; // Items component
import UGAitems from '@/components/UGAitems.json'; // Import the items

const Content = () => {
  const [view, setView] = useState<'home' | 'items'>('home'); // State to manage which view is displayed
  const itemsSectionRef = useRef<HTMLDivElement>(null); // Explicitly typing the ref to HTMLDivElement
  const [backgroundHeight, setBackgroundHeight] = useState(0); // State for background height

  // Update background height dynamically on mount and resize
  useEffect(() => {
    const updateBackgroundHeight = () => {
      const backgroundElement = document.getElementById('background');
      if (backgroundElement) {
        setBackgroundHeight(backgroundElement.clientHeight); // Get the height of the background image
      }
    };

    // Set the initial height and listen for window resize events
    updateBackgroundHeight();
    window.addEventListener('resize', updateBackgroundHeight);

    // Cleanup event listener
    return () => window.removeEventListener('resize', updateBackgroundHeight);
  }, []);

  const handleViewItems = () => {
    setView('items'); // Switch to items view
    setTimeout(() => {
      if (itemsSectionRef.current) {
        // Smooth scroll to the items section after a short delay
        itemsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Adding a slight delay to ensure the view switch happens first
  };

  const handleBackToHome = () => {
    setView('home'); // Switch back to home view
  };

  return (
    <div className="relative w-full">
      {/* Background Section */}
      <div
        id="background"
        className="relative w-full h-screen"
        style={{
          backgroundImage: `url(${bgarch.src})`, // Use the imported background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay Image (UGacha-Art.png) */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            src={ugachaArt}
            alt="UGacha Art"
            width={600} // Adjust size as needed
            height={600} // Maintain aspect ratio
          />
        </div>

        {/* Welcome Section with Button */}
        {view === 'home' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-black">
            <h1 className="text-4xl font-bold mb-4">Welcome to UGacha !</h1>
            <button
              onClick={handleViewItems}
              className="px-6 py-3 text-lg font-semibold bg-white text-black rounded-md hover:bg-gray-300 transition"
            >
              View Event Cards
            </button>
          </div>
        )}
      </div>

      {/* Items Section */}
      {view === 'items' && (
        <div ref={itemsSectionRef} className="py-8 bg-gray-100 mt-[0px]">
          <button
            onClick={handleBackToHome}
            className="absolute top-4 left-4 px-6 py-3 text-lg font-semibold bg-white text-black rounded-md hover:bg-gray-300 transition"
          >
            Back to Home
          </button>

          <Items items={UGAitems} /> {/* Show the Items component */}
        </div>
      )}
    </div>
  );
};

export default Content;
