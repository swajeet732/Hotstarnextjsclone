import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '8913e8623785681b027fa8218e8f930a';
const BASE_URL = 'https://api.themoviedb.org/3/tv/popular';

const usePopularTVShows = () => {
  const [tvShows, setTVShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchTVShows = async (page: number) => {
    setLoading(true); // Ensure loading state is true before fetching data
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          api_key: API_KEY,
          page: page,
        },
      });

      if (response.status === 200) {
        // Check if there are results before updating state
        if (response.data.results.length > 0) {
          setTVShows((prevShows) => [...prevShows, ...response.data.results]);
        }
      } else {
        // Handle non-200 status codes
        setError('Failed to fetch TV shows.');
      }
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      setError('Failed to fetch TV shows.');
    } finally {
      setLoading(false); // Set loading to false after fetch is done
    }
  };

  useEffect(() => {
    fetchTVShows(page);
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return { tvShows, loading, error, loadMore };
};

export default usePopularTVShows;
