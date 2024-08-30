// hooks/usePopularMovies.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'a57e0299';
const BASE_URL = 'http://www.omdbapi.com/';

// Example popular movie titles
const POPULAR_QUERIES = [
  'Inception',
  'The Godfather',
  'Pulp Fiction',
  'The Shawshank Redemption',
  'The Dark Knight',
  'Forrest Gump',
  'Fight Club',
  'The Matrix',
  'Gladiator',
  'Interstellar',
  'The Lord of the Rings',
  'Avatar',
  'The Avengers',
  'Jurassic Park',
  'The Lion King',
  'Titanic',
  'Star Wars',
  'Terminator 2',
  'The Departed',
  'Inglourious Basterds',
];

const usePopularMovies = () => {
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
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
        const moviesPromises = POPULAR_QUERIES.map(query => fetchMovies(query));
        const results = await Promise.all(moviesPromises);
        const movies = results.flat(); // Flatten the array of arrays

        // Shuffle movies array
        for (let i = movies.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [movies[i], movies[j]] = [movies[j], movies[i]];
        }

        setPopularMovies(movies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching all movies:', error);
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  return { popularMovies, loading };
};

export default usePopularMovies;
