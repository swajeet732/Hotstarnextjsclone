'use client'
import React from 'react';
import useLatestMovies from '@/hooks/useLatestMovies';
import { FaStar } from 'react-icons/fa';
import Navbar from '../navbar/page'; // Adjust the path if necessary
import { useRouter } from 'next/navigation';

const MoviesPage: React.FC = () => {
  const { latestMovies, loading } = useLatestMovies();
  const router = useRouter();

  const handleCardClick = () => {
    router.push('https://vegamovies.li/');
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center"> Shows / Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ml-16" style={{ marginRight: '-32px' }}>
          {latestMovies.map((movie: any) => (
            <div
              key={movie.imdbID}
              onClick={handleCardClick}
              className="bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer relative group"
            >
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
                alt={movie.Title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2 text-center truncate">{movie.Title}</h3>
                <p className="text-sm text-gray-400 mb-2 text-center truncate">{movie.Year}</p>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-300">{movie.imdbRating || 'N/A'}</span>
                </div>
              </div>
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span
                  className="text-blue-400 text-lg font-bold hover:text-blue-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering
                    router.push('https://vegamovies.li/');
                  }}
                >
                  Watch Now
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
