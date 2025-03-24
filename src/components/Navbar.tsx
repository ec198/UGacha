// app/components/Navbar.tsx
import Image from 'next/image';
import logo from '@/assets/UGAlogo_Arch_1in.png';

const Navbar = () => {
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
            {/* Logo */}
            <a className="flex flex-shrink-0 items-center" href="/">
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                UGacha
              </span>
            </a>
            {/* Desktop Menu */}
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

          {/* Right Side Menu */}
          <div className="hidden md:block md:ml-6">
            <div className="flex items-center space-x-2">
              {/* Login Button */}
              <a
                href="/signin"
                className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2"
              >
                Login
              </a>
              {/* Register Button */}
              <a
                href="/register"
                className="text-white bg-green-500 hover:bg-green-600 rounded-md px-4 py-2"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <a href="/" className="bg-black text-white block rounded-md px-3 py-2 text-base font-medium">
            Home
          </a>
          <a href="/library" className="text-white block rounded-md px-3 py-2 text-base font-medium">
            Library
          </a>
          <a href="/packs" className="text-white block rounded-md px-3 py-2 text-base font-medium">
            Packs
          </a>
          <a href="/about" className="text-white block rounded-md px-3 py-2 text-base font-medium">
            About
          </a>
          <div className="flex flex-col space-y-2">
            {/* Mobile Login Button */}
            <a
              href="/signin"
              className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2 block text-center"
            >
              Login
            </a>
            {/* Mobile Register Button */}
            <a
              href="/register"
              className="text-white bg-green-500 hover:bg-green-600 rounded-md px-4 py-2 block text-center"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
