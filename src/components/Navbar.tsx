'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import ugacha from '@/assets/UGacha.png';

const Navbar = () => {
  const [username, setUsername] = useState<string | null | undefined>(undefined);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkClass = (href: string) =>
    `px-3 py-2 rounded-md text-white hover:bg-gray-900 ${
      pathname === href ? 'border-b-2 border-white' : ''
    }`;

  return (
    <nav className="bg-black border-b-1 border-white">
      <div className="mx-auto max-w-10xl px-2 sm:px-6 lg:px-8">
        <div className="absolute left-0 flex items-center pl-10 mt-5">
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

        <div className="relative flex items-center justify-between h-20">
          {/* Center nav - always takes up space, only renders links if logged in */}
          <div className="flex-1 hidden md:flex justify-center">
            {username && (
              <div className="flex space-x-4">
                <a href="/" className={navLinkClass('/')}>Home</a>
                <a href="/library" className={navLinkClass('/library')}>Library</a>
                <a href="/packs" className={navLinkClass('/packs')}>Packs</a>
                <a href="/about" className={navLinkClass('/about')}>About</a>
                <a href="/events" className={navLinkClass('/events')}>Events</a>
              </div>
            )}
          </div>

          {/* Right nav - desktop only */}
          <div className="hidden md:flex items-center space-x-2">
            {username === undefined ? (
              <span className="text-white"></span>
            ) : username === null ? (
              <>
                <a href="/signin" className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2">Login</a>
                <a href="/register" className="text-white bg-green-500 hover:bg-green-600 rounded-md px-4 py-2">Register</a>
              </>
            ) : (
              <>
                <span className="text-white"><b>Welcome, {username}!</b></span>
                <button
                  onClick={handleSignOut}
                  className="text-white bg-red-500 hover:bg-red-600 rounded-md px-4 py-2"
                >
                  Sign Out
                </button>
                <div className="relative">
                  <button
                    className="text-white bg-gray-700 hover:bg-gray-600 rounded-md px-4 py-2"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  >
                    Settings
                  </button>
                  {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <a href="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Change Password
                      </a>
                      <a href="/delete-account" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                        Delete Account
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger button - only if logged in */}
          {username && (
            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
                onClick={toggleMenu}
              >
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          )}

          {/* Mobile right-side buttons */}
          <div className="absolute right-4 top-5 md:hidden flex space-x-2 z-50">
            {username === null && (
              <>
                <a href="/signin" className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-3 py-2 text-sm">Login</a>
                <a href="/register" className="text-white bg-green-500 hover:bg-green-600 rounded-md px-3 py-2 text-sm">Register</a>
              </>
            )}
            {username && (
              <>
                <button
                  onClick={handleSignOut}
                  className="text-white bg-red-500 hover:bg-red-600 rounded-md px-3 py-2 text-sm"
                >
                  Sign Out
                </button>
                <div className="relative">
                  <button
                    className="text-white bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-2 text-sm"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  >
                    Settings
                  </button>
                  {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <a href="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Change Password
                      </a>
                      <a href="/delete-account" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                        Delete Account
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {username && (
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
          <div className="flex flex-col items-center space-y-4 py-4">
            <span className="text-white"><b>Welcome, {username}!</b></span>
            <a href="/" className={navLinkClass('/')}>Home</a>
            <a href="/library" className={navLinkClass('/library')}>Library</a>
            <a href="/packs" className={navLinkClass('/packs')}>Packs</a>
            <a href="/about" className={navLinkClass('/about')}>About</a>
            <a href="/events" className={navLinkClass('/events')}>Events</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
