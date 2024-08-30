import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'a57e0299';
const BASE_URL = 'http://www.omdbapi.com/';

// Map of movie IDs to trailer URLs
const MOVIE_TRAILERS: { [key: string]: string } = {
  'tt3896198': 'https://www.youtube.com/watch?v=dW1BIid8Osg', // Guardians of the Galaxy Vol. 2
  'tt0468569': 'https://www.youtube.com/watch?v=EXeTwQWrcwY', // The Dark Knight
  'tt0076759': 'https://www.youtube.com/watch?v=vZ734NWnAHA', // Star Wars: Episode IV - A New Hope
  'tt0111161': 'https://www.youtube.com/watch?v=PLl99DlL6b4', // The Shawshank Redemption
  'tt0133093': 'https://www.youtube.com/watch?v=vKQi3bBA1y8', // The Matrix
};

const useMovies = () => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async (id: string) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          i: id,
          apikey: API_KEY,
        },
      });

      setMovie({
        ...response.data,
        Trailer: MOVIE_TRAILERS[id] || '', // Set trailer URL based on movie ID
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let currentIndex = 0;

    const changeMovie = () => {
      fetchMovie(Object.keys(MOVIE_TRAILERS)[currentIndex]);
      currentIndex = (currentIndex + 1) % Object.keys(MOVIE_TRAILERS).length; // Cycle through movie IDs
    };

    changeMovie(); // Fetch the initial movie
    const intervalId = setInterval(changeMovie, 10000); // Change movie every 5 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  return { movie, loading };
};

export default useMovies;
