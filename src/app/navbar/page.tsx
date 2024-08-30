// components/Navbar.tsx
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faTv, faFutbol, faFilm } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to the desired URL with the search query
      router.push(`https://vegamovies.li/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-gray-900 flex flex-col items-center justify-start pt-4 space-y-4 shadow-lg z-50">
      <div className="flex flex-col items-center w-full">
        <div className="w-full flex items-center justify-center px-2 py-2">
          <img src="/hotstar.png" alt="Logo" className="w-8 h-8" />
        </div>
        <NavItem icon={faHome} name="My Space" link="/home" />
        <NavItem icon={faSearch} name="Search" link="#" onClick={() => setIsSearchOpen(true)} />
        <NavItem icon={faTv} name="TV" link="/tv" />
        <NavItem icon={faFutbol} name="Sports" link="/sports" />
        <NavItem icon={faFilm} name="Movies" link="/movies" />
      </div>

      {/* Search Box */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search query"
                className="p-2 rounded-lg bg-gray-700 text-white"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface NavItemProps {
  icon: any;
  name: string;
  link: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, name, link, onClick }) => {
  return (
    <Link href={link} legacyBehavior>
      <a onClick={onClick} className="w-full flex items-center justify-center relative group px-2 py-2">
        <FontAwesomeIcon icon={icon} className="text-white w-6 h-6" />
        <span className="absolute left-16 opacity-0 group-hover:opacity-100 bg-gray-900 text-white p-2 rounded transition-opacity duration-300">
          {name}
        </span>
      </a>
    </Link>
  );
};

export default Navbar;
