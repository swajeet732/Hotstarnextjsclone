//app/home//page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/page'; // Adjust path as needed
import useMovies from '@/hooks/useMovies';
import useLatestMovies from '@/hooks/useLatestMovies';
import usePopularMovies from '@/hooks/usePopularMovies';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
const YOUTUBE_API_KEY = 'AIzaSyDM_OqwDKx1G04poakmciajITTNF6yNhJY'; // Replace with your actual YouTube API key
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
import axios from 'axios';

const Home: React.FC = () => {
    const { movie, loading: loadingMovie } = useMovies();
    const { latestMovies, loading: loadingLatest } = useLatestMovies();
    const { popularMovies, loading: loadingPopular } = usePopularMovies();
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        if (movie?.Trailer) {
            const videoId = getVideoIdFromUrl(movie.Trailer);
            setVideoSrc(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0`); // Customize URL for clean embed

            // Change video every 30 seconds
            const timer = setTimeout(() => {
                setVideoSrc(''); // Clear video source after 30 seconds
                // Fetch the next movie
                fetchNextMovie();
            }, 30000); // 30 seconds

            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [movie]);


    useEffect(() => {
        const fetchTrailer = async (title: string) => {
            try {
                const response = await axios.get(YOUTUBE_SEARCH_URL, {
                    params: {
                        q: `${title} official trailer`,
                        key: YOUTUBE_API_KEY,
                        part: 'snippet',
                        maxResults: 1,
                        type: 'video',
                    },
                });
                const videoId = response.data.items[0]?.id?.videoId;
                if (videoId) {
                    setTrailerUrl(`https://www.youtube.com/embed/${videoId}`);
                } else {
                    setTrailerUrl(null);
                }
            } catch (error) {
                console.error('Error fetching trailer:', error);
                setTrailerUrl(null);
            }
        };

        if (latestMovies.length > 0) {
            fetchTrailer(latestMovies[0].Title); // Example: fetch trailer for the first movie
        }
    }, [latestMovies]);

    const fetchNextMovie = () => {
        // Logic to fetch and set the next movie
        // This depends on how you manage your movie fetching logic
        // For example, you could call a function from your `useMovies` hook
    };

    const getVideoIdFromUrl = (url: string) => {
        const match = url.match(/v=([^&]+)/);
        return match ? match[1] : '';
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 flex flex-col items-center bg-black text-white p-4 ml-16 md:pt-16 pt-20">
                {loadingMovie ? (
                    <h1 className="text-xl">Loading...</h1>
                ) : (
                    movie && movie.Title ? (
                        <div className="flex flex-col max-w-6xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mt-2 md:mt-0">
                            {/* Full-width video card */}
                            <div className="w-full mb-6">
                                {videoSrc && (
                                    <iframe
                                        id="youtube-player"
                                        width="100%"
                                        height="315"
                                        src={videoSrc}
                                        className="rounded-lg"
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        title={movie.Title}
                                    ></iframe>
                                )}
                            </div>
                            {/* Movie details below the video */}
                            <div className="flex flex-col items-center">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">{movie.Title}</h1>
                                <p className="text-base md:text-lg mb-4">{movie.Plot}</p>
                                {/* Buttons below the movie details */}
                                <div className="flex space-x-4 mt-4">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                        onClick={() => window.open(movie.Trailer, '_blank')}
                                    >
                                        Watch Now
                                    </button>
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
                                        onClick={() => alert('Added to Watchlist')}
                                    >
                                        <span className="mr-2">+</span> Add to Watchlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xl">No movie data available.</p>
                    )
                )}
                {/* Latest Releases Section */}
                <div className="w-full max-w-6xl mx-auto mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center text-white-900">Latest Releases</h2>
                    {loadingLatest ? (
                        <h1 className="text-xl text-center text-gray-500">Loading Latest Releases...</h1>
                    ) : (
                        <div
                            style={{
                                overflowX: 'auto',
                                whiteSpace: 'nowrap',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                            className="hide-scrollbar"
                        >
                            <div className="inline-flex space-x-4">
                                {latestMovies.length > 0 ? (
                                    latestMovies.map((movie, index) => (
                                        <a
                                            key={index}
                                            href="https://dotmovies.cab/32805-spider-man-no-way-home-2021-hindi-720p.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-gray-700 group"
                                        >
                                            <img
                                                src={movie.Poster}
                                                alt={movie.Title}
                                                className="w-full h-40 object-cover rounded-lg mb-4"
                                            />
                                            <h3 className="text-lg font-semibold mb-2 text-white truncate">{movie.Title}</h3>
                                            <p className="text-sm text-gray-400 text-center truncate">{movie.Plot}</p>

                                            {/* Watch Now Button */}
                                            <button className="absolute inset-0 bg-black bg-opacity-60 text-white text-lg font-bold rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                Watch Now
                                            </button>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-xl text-center text-gray-500">No latest releases available.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>




                <div className="w-full max-w-6xl mx-auto mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center">Most Popular Movies</h2>
                    {loadingPopular ? (
                        <h1 className="text-xl text-center">Loading Popular Movies...</h1>
                    ) : (
                        <div
                            style={{
                                overflowX: 'auto',
                                whiteSpace: 'nowrap',
                                scrollbarWidth: 'none', // For Firefox
                                msOverflowStyle: 'none', // For Internet Explorer and Edge
                            }}
                            className="hide-scrollbar"
                        >
                            <div className="inline-flex space-x-4">
                                {popularMovies.length > 0 ? (
                                    popularMovies.map((movie, index) => (
                                        <a
                                            key={index}
                                            href="https://hdmovie2.vg/2331-interstellar-2014-hindi.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-gray-700 group"
                                        >
                                            <img
                                                src={movie.Poster}
                                                alt={movie.Title}
                                                className="w-full h-40 object-cover rounded-lg mb-4"
                                            />
                                            <h3 className="text-lg font-semibold mb-2 text-white truncate">{movie.Title}</h3>
                                            <p className="text-sm text-gray-400 text-center truncate">{movie.Plot}</p>

                                            {/* Watch Now Button */}
                                            <button className="absolute inset-0 bg-black bg-opacity-60 text-white text-lg font-bold rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                Watch Now
                                            </button>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-xl text-center">No popular movies available.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full max-w-6xl mx-auto mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center">Entertainment</h2>
                    <div
                        style={{
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            scrollbarWidth: 'none', // For Firefox
                            msOverflowStyle: 'none', // For Internet Explorer and Edge
                        }}
                        className="hide-scrollbar"
                    >
                        <div className="inline-flex space-x-4">
                            {/* Disney Card */}
                            <a
                                href="https://dotmovies.cab/6350-doraemon-chronicle-of-the-moon-2019-hindi-dual-audio-hdrip-720p-480p.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 hover:shadow-xl group"
                            >
                                <div className="w-full h-48 relative">
                                    <img
                                        src="/disney.png"
                                        alt="Disney"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-2">Disney</h3>
                                <button className="absolute inset-0 bg-black bg-opacity-60 text-white text-lg font-bold rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    Watch Now
                                </button>
                            </a>

                            {/* Pixar Card */}
                            <a
                                href="https://m.vegamovies.nu/download-toy-story-4-2019-hindi-dubbed-english-full-movie-480p-720p-1080p/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 hover:shadow-xl group"
                            >
                                <div className="w-full h-48 relative">
                                    <img
                                        src="/pixar.jpg"
                                        alt="Pixar"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-2">Pixar</h3>
                                <button className="absolute inset-0 bg-black bg-opacity-60 text-white text-lg font-bold rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    Watch Now
                                </button>
                            </a>

                            {/* Marvel Card */}
                            <a
                                href="https://m.vegamovies.nu/download-avengers-endgame-2019-3d-movie-hindi-dubbed/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 hover:shadow-xl group"
                            >
                                <div className="w-full h-48 relative">
                                    <img
                                        src="/marvel.jpg"
                                        alt="Marvel"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-2">Marvel</h3>
                                <button className="absolute inset-0 bg-black bg-opacity-60 text-white text-lg font-bold rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    Watch Now
                                </button>
                            </a>

                            {/* Star Wars Card */}
                            <a
                                href="https://m.vegamovies.nu/download-star-wars-rebels-the-siege-of-lothal-2015-dual-audio-hindi-bluray-480p-720p-1080p/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 hover:shadow-xl group"
                            >
                                <div className="w-full h-48 relative">
                                    <img
                                        src="/starwars.png"
                                        alt="Star Wars"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-2">Star Wars</h3>
                                <button className="absolute inset-0 bg-black bg-opacity-60 text-white text-lg font-bold rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    Watch Now
                                </button>
                            </a>

                            {/* National Geographic Card */}
                            <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 hover:shadow-xl group">
                                <div className="w-full h-48 relative">
                                    <img
                                        src="/nationalgeographic.webp"
                                        alt="National Geographic"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-2">National Geographic</h3>
                                <button className="absolute inset-0 bg-black bg-opacity-60 text-white text-lg font-bold rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    Watch Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="w-full max-w-6xl mx-auto mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">Popular Languages</h2>
                    <div
                        style={{
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            scrollbarWidth: 'none', // For Firefox
                            msOverflowStyle: 'none', // For Internet Explorer and Edge
                        }}
                        className="hide-scrollbar"
                    >
                        <div className="inline-flex space-x-4">
                            <a
                                href="https://www.2filmywap.com/category/2024-latest-marathi-movies.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/arya.jpg" alt="Marathi" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Marathi</h3>
                            </a>

                            <a
                                href="https://dotmovies.cab/hollywood-movies/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/scarlett.webp" alt="English" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">English</h3>
                            </a>

                            <a
                                href="https://dotmovies.cab/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/ranbeer.webp" alt="Hindi" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Hindi</h3>
                            </a>

                            <a
                                href="https://dotmovies.cab/tamil-movies/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/yash.jpg" alt="Kannada" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Kannada</h3>
                            </a>

                            <a
                                href="https://dotmovies.cab/telugu-movies-free-download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/telegu.webp" alt="Telugu" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Telugu</h3>
                            </a>
                        </div>
                    </div>
                </div>




                <div className="w-full max-w-6xl mx-auto mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">Sports</h2>
                    <div
                        style={{
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            scrollbarWidth: 'none', // For Firefox
                            msOverflowStyle: 'none', // For Internet Explorer and Edge
                        }}
                        className="hide-scrollbar"
                    >
                        <div className="inline-flex space-x-4">
                            <a
                                href="https://www.youtube.com/results?search_query=cricket+match"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/cricket.jpg" alt="Cricket" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Cricket</h3>
                            </a>

                            <a
                                href="https://www.youtube.com/results?search_query=football+match"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/football.webp" alt="Football" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Football</h3>
                            </a>

                            <a
                                href="https://www.youtube.com/results?search_query=hockey+match"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/hockey.jpg" alt="Hockey" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Hockey</h3>
                            </a>

                            <a
                                href="https://www.youtube.com/results?search_query=kabaddi+match"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/kabddi.jpg" alt="Kabaddi" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Kabaddi</h3>
                            </a>

                            <a
                                href="https://www.youtube.com/results?search_query=hockey+swimming"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                    <img src="/swimming.webp" alt="Swimming" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-lg font-bold">Watch Now</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 hover:text-gray-400">Swimming</h3>
                            </a>
                        </div>
                    </div>
                </div>



                <div className="w-full max-w-6xl mx-auto mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">Popular Genres</h2>
                    <div
                        style={{
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            scrollbarWidth: 'none', // For Firefox
                            msOverflowStyle: 'none', // For Internet Explorer and Edge
                        }}
                        className="hide-scrollbar"
                    >
                        <div className="inline-flex space-x-4">
                            {/* Action */}
                            <a href="https://vegamovies.li/action/" target="_blank" rel="noopener noreferrer">
                                <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group">
                                    <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                        <img
                                            src="/hpmelander.webp"
                                            alt="Action"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 group-hover:text-gray-400">Action</h3>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold">Watch Now</span>
                                    </div>
                                </div>
                            </a>
                            {/* Drama */}
                            <a href="https://vegamovies.li/drama/" target="_blank" rel="noopener noreferrer">
                                <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group">
                                    <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                        <img
                                            src="/alia.avif"
                                            alt="Drama"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 group-hover:text-gray-400">Drama</h3>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold">Watch Now</span>
                                    </div>
                                </div>
                            </a>
                            {/* Romance */}
                            <a href="https://vegamovies.li/romance/" target="_blank" rel="noopener noreferrer">
                                <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group">
                                    <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                        <img
                                            src="/dakota.jpg"
                                            alt="Romance"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 group-hover:text-gray-400">Romance</h3>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold">Watch Now</span>
                                    </div>
                                </div>
                            </a>
                            {/* Thriller */}
                            <a href="https://vegamovies.li/thriller/" target="_blank" rel="noopener noreferrer">
                                <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group">
                                    <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                        <img
                                            src="/stranger.webp"
                                            alt="Thriller"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 group-hover:text-gray-400">Thriller</h3>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold">Watch Now</span>
                                    </div>
                                </div>
                            </a>
                            {/* Family */}
                            <a href="https://vegamovies.li/family/" target="_blank" rel="noopener noreferrer">
                                <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-64 flex-none transition-transform transform hover:scale-105 relative group">
                                    <div className="w-full h-48 relative overflow-hidden rounded-lg">
                                        <img
                                            src="/family.jpg"
                                            alt="Family"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-center mt-4 text-gray-200 group-hover:text-gray-400">Family</h3>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold">Watch Now</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>





                <footer className="bg-black text-white py-8 mt-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:space-x-8 mb-6">
                            {/* Contact Us */}
                            <div className="flex-1 mb-6 md:mb-0">
                                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                                <p className="mb-2">Email: support@example.com</p>
                                <p>Phone: (123) 456-7890</p>
                            </div>
                            {/* Connect with Us */}
                            <div className="flex-1 mb-6 md:mb-0">
                                <h2 className="text-2xl font-bold mb-4">Connect with Us</h2>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-white hover:text-gray-400">
                                        <FaFacebook size={24} />
                                    </a>
                                    <a href="#" className="text-white hover:text-gray-400">
                                        <FaInstagram size={24} />
                                    </a>
                                    <a href="#" className="text-white hover:text-gray-400">
                                        <FaTwitter size={24} />
                                    </a>
                                    <a href="#" className="text-white hover:text-gray-400">
                                        <FaLinkedin size={24} />
                                    </a>
                                </div>
                            </div>
                            {/* Company */}
                            <div className="flex-1 mb-6 md:mb-0">
                                <h2 className="text-2xl font-bold mb-4">Company</h2>
                                <ul>
                                    <li className="mb-2">
                                        <a href="#" className="text-white hover:text-gray-400">About Us</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white hover:text-gray-400">Careers</a>
                                    </li>
                                </ul>
                            </div>
                            {/* Hotstar Subscription */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-4">Subscribe to Hotstar</h2>
                                <form className="flex flex-col space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Enter email"
                                        className="px-4 py-2 rounded-lg text-black focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 pt-4">
                            <p className="text-center text-sm">
                                2024© 2022 STAR. All Rights Reserved. HBO, Home Box Office and all related channel and programming logos are service marks of, and all related programming visuals and elements are the property of, Home Box Office, Inc. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>





            </div>
        </div>
    );
};

export default Home;
