"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import logo from '@/assets/UGAlogo_Arch_1in.png';

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user session from backend or local storage
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="bg-black-700 border-b-1 border-white">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
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

          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <a className="flex flex-shrink-0 items-center" href="/">
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                UGacha
              </span>
            </a>
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-2">
                <a href="/" className="text-white bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">
                  Home
                </a>
                <a href="/library" className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">
                  Library
                </a>
                <a href="/packs" className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">
                  Packs
                </a>
                <a href="/about" className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">
                  About
                </a>
              </div>
            </div>
          </div>

          <div className="hidden md:block md:ml-6">
            <div className="flex items-center space-x-2">
              {username ? (
                <span className="text-white">Welcome, {username}!</span>
              ) : (
                <>
                  <a href="/signin" className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2">
                    Login
                  </a>
                  <a href="/register" className="text-white bg-green-500 hover:bg-green-600 rounded-md px-4 py-2">
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
