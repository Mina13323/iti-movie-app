import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'e38eaaf2beb627681749c1bbf383ff33';
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/popular`, {
          params: {
            api_key: API_KEY,
            language: 'ar',
          },
        });
        
        // التعديل هنا: أضفنا .data قبل .results
        setMovies(response.data.results); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data from TMDB:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>جاري التحميل...</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>
      {/* استخدمنا ?.map للحماية الإضافية */}
      {movies?.map((movie) => (
        <div key={movie.id} style={{ width: '200px', textAlign: 'center' }}>
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          />
          <h3 style={{ fontSize: '1rem', marginTop: '10px' }}>{movie.title}</h3>
          <p>التقييم: ⭐{movie.vote_average}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieList;