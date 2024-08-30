// hooks/useLatestMovies.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'a57e0299';
const BASE_URL = 'http://www.omdbapi.com/';

// Example movie titles to search for the latest movies
const SEARCH_QUERIES = [
  'Spider-Man',
  'Doctor Strange',
  'Black Panther',
  'Avatar',
  'Dune',
  'No Time to Die',
  'Jungle Cruise',
  'Eternals',
  'Shang-Chi',
  'The Batman',
  'Tenet',
  'Wonder Woman',
  'The French Dispatch',
  'Nomadland',
  'Soul',
  'Mulan',
  'Promising Young Woman',
  'The Trial of the Chicago 7',
  'One Night in Miami',
  'Sound of Metal',
  'Minari',
  'The Father',
  'Judas and the Black Messiah',
  'Ma Rainey\'s Black Bottom',
  'News of the World',
];

const useLatestMovies = () => {
  const [latestMovies, setLatestMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async (query: string) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          s: query,
          apikey: API_KEY,
        },
      });
      return response.data.Search;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const moviesPromises = SEARCH_QUERIES.map(query => fetchMovies(query));
        const results = await Promise.all(moviesPromises);
        const movies = results.flat(); // Flatten the array of arrays
        setLatestMovies(movies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching all movies:', error);
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  return { latestMovies, loading };
};

export default useLatestMovies;