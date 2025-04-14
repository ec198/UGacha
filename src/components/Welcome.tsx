'use client';

import { useEffect, useState } from 'react';

interface WelcomeProps {
  onViewItems: () => void;
}

const Welcome = ({ onViewItems }: WelcomeProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const username = sessionStorage.getItem('username');
    setIsLoggedIn(!!username);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="text-center text-black">
      <h1 className="text-4xl font-bold mb-4">Welcome to UGacha!</h1>
      <p>This website implements a card collecting game. Using the map you can find the locations of new cards. Go to the location to collect it.</p>
      {isLoggedIn && (
        <button
          onClick={onViewItems}
          className="px-6 py-3 text-lg font-semibold bg-white text-black rounded-md hover:bg-gray-300 transition"
        >
          View Event Cards
        </button>
      )}
    </div>
  );
};

export default Welcome;
