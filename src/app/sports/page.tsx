'use client';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import Navbar from '../navbar/page';

type Match = {
  id: string;
  homeTeam: { name: string; logo: string | null };
  awayTeam: { name: string; logo: string | null };
  score: {
    fullTime: { home: number; away: number };
  };
  utcDate: string;
  competition: { name: string };
};

const placeholderImages = {
  soccer: 'https://via.placeholder.com/300x200/000000/ffffff?text=Soccer',
};

// Dummy FIFA page URL, replace with actual URLs if available
const getMatchUrl = (matchId: string) => `https://www.fifa.com/worldcup/matches/${matchId}`;

const SportsPage: FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('/api/proxy');
      setMatches(response.data.matches);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching World Cup matches:', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return <div className="text-white text-center p-4">Loading...</div>;
  }

  if (!matches.length) {
    return <div className="text-white text-center p-4">No matches found with images</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen p-6 pt-20">
        <h1 className="text-white text-3xl font-bold text-center mb-6">World Cup Matches</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ml-16">
          {matches.map((match) => (
            <div
              key={match.id}
              className="relative border border-gray-600 p-4 rounded-lg bg-gray-800 text-white transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">
                {match.homeTeam.name} vs {match.awayTeam.name}
              </h3>
              <p className="mb-2">Date: {new Date(match.utcDate).toLocaleDateString()}</p>
              <p className="mb-4">Competition: {match.competition.name}</p>
              <div className="flex items-center mb-2">
                <img
                  src={match.homeTeam.logo || placeholderImages.soccer}
                  alt={`${match.homeTeam.name} Logo`}
                  className="w-16 h-auto object-cover mr-2"
                />
                <p>{match.homeTeam.name}</p>
              </div>
              <div className="flex items-center">
                <img
                  src={match.awayTeam.logo || placeholderImages.soccer}
                  alt={`${match.awayTeam.name} Logo`}
                  className="w-16 h-auto object-cover mr-2"
                />
                <p>{match.awayTeam.name}</p>
              </div>
              <div className="mt-4">
                <p>
                  Score: {match.score.fullTime.home} - {match.score.fullTime.away}
                </p>
              </div>
              <a
                href={getMatchUrl(match.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex justify-center items-center bg-blue-500 bg-opacity-90 text-white font-bold text-lg rounded-lg opacity-0 hover:opacity-100 transition-opacity"
              >
                Watch Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SportsPage;
