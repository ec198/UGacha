'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ugacha from '@/assets/UGacha.png';

const Navbar = () => {
  const [username, setUsername] = useState<string | null | undefined>(undefined);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu visibility
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const cachedUser = sessionStorage.getItem('username');
      if (cachedUser) {
        setUsername(cachedUser);
        return;
      }

      const res = await fetch('/api/auth/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.username || null;
        sessionStorage.setItem('username', user);
        setUsername(user);
      } else {
        setUsername(null);
        sessionStorage.removeItem('username');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUsername(null);
      sessionStorage.removeItem('username');
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        sessionStorage.removeItem('username');
        setUsername(null);
        router.push('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black-700 border-b-1 border-white">
      <div className="mx-auto max-w-10xl px-2 sm:px-6 lg:px-8">
        {/* Left side - Logo */}
        <div className="absolute left-0 flex items-center pl-14 mt-5">
          <a className="flex-shrink-0" href="/">
            <Image
              src={ugacha}
              alt="UGacha Logo"
              width={120}
              height={40}
              priority
            />
          </a>
        </div>

        {/* Navbar container */}
        <div className="relative flex items-center justify-between h-20">
          {/* Centered menu items */}
          <div className="flex-1 flex justify-center space-x-4 hidden md:flex">
            <a
              href="/"
              className="text-white bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
            >
              Home
            </a>
            <a
              href="/library"
              className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
            >
              Library
            </a>
            <a
              href="/packs"
              className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
            >
              Packs
            </a>
            <a
              href="/about"
              className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
            >
              About
            </a>
          </div>

          {/* Right side - User Authentication */}
          <div className="hidden md:flex items-center space-x-2">
            {username === undefined ? (
              <span className="text-white"></span>
            ) : username === null ? (
              <>
                <a
                  href="/signin"
                  className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="text-white bg-green-500 hover:bg-green-600 rounded-md px-4 py-2"
                >
                  Register
                </a>
              </>
            ) : (
              <>
                <span className="text-white">Welcome, {username}!</span>
                <button
                  onClick={handleSignOut}
                  className="text-white bg-red-500 hover:bg-red-600 rounded-md px-4 py-2"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? 'true' : 'false'}
              onClick={toggleMenu} // Toggle menu when clicked
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Show or hide based on state */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="flex flex-col items-center space-y-4">
            {username === undefined ? (
              <span className="text-white"></span>
            ) : username === null ? (
              <>
                <a
                  href="/signin"
                  className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="text-white bg-green-500 hover:bg-green-600 rounded-md px-4 py-2"
                >
                  Register
                </a>
              </>
            ) : (
              <>
                <span className="text-white">Welcome, {username}!</span>
                <button
                  onClick={handleSignOut}
                  className="text-white bg-red-500 hover:bg-red-600 rounded-md px-4 py-2"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        <div className="flex flex-col items-center space-y-4 py-4">
          <a
            href="/"
            className="text-white bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
          >
            Home
          </a>
          <a
            href="/library"
            className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
          >
            Library
          </a>
          <a
            href="/packs"
            className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
          >
            Packs
          </a>
          <a
            href="/about"
            className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
          >
            About
          </a>
          {/* Right side - User Authentication for mobile */}
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
