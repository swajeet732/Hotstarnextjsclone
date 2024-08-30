'use client'
import React, { useState, useEffect } from 'react';
import usePopularTVShows from '@/hooks/usePopularTVShows';
import Navbar from '../navbar/page'; // Adjust the path if necessary
import { useRouter } from 'next/navigation';

const TVShowsPage: React.FC = () => {
  const { tvShows, loading, error, loadMore } = usePopularTVShows();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    router.push('https://vegamovies.li/tv-shows/web-series-hindi/');
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && !isLoadingMore) {
      setIsLoadingMore(true);
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoadingMore]);

  useEffect(() => {
    if (!loading) {
      setIsLoadingMore(false);
    }
  }, [loading]);

  if (loading && tvShows.length === 0) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12">{error}</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Popular TV Shows</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ml-14">
          {tvShows.map((show: any) => (
            <div
              key={show.id}
              onClick={handleCardClick}
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105 relative group"
              style={{ width: '250px', height: '400px' }} // Ensure same size for all cards
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
                style={{ height: '60%' }} // Adjust image height
              />
              <h3 className="text-lg font-semibold mb-2 truncate">{show.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{show.first_air_date}</p>
              <div className="flex items-center">
                <span className="text-sm text-gray-300">{show.vote_average}</span>
              </div>
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span
                  className="text-blue-400 text-lg font-bold hover:text-blue-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering
                    router.push('https://vegamovies.li/tv-shows/web-series-hindi/');
                  }}
                >
                  Watch Now
                </span>
              </div>
            </div>
          ))}
        </div>
        {isLoadingMore && <div className="text-center py-12">Loading more...</div>}
      </div>
    </div>
  );
};

export default TVShowsPage;
