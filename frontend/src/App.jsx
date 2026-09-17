import { useEffect, useRef, useState } from "react";

import {
  getRecommendations,
  searchMovies,
  getFeaturedMovies
} from "./services/api";

import AnimatedBackground from "./AnimatedBackground";

import "./App.css";


function App() {

  const [movie, setMovie] = useState("");
  const [selectedMovieKey, setSelectedMovieKey] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const recommendationsRef = useRef(null);


  // --------------------------------------------------
  // LOAD FEATURED MOVIES WHEN WEBSITE STARTS
  // --------------------------------------------------

  useEffect(() => {

    const loadFeaturedMovies = async () => {

      try {

        const data = await getFeaturedMovies();

        setFeaturedMovies(
          data.movies || []
        );

      } catch (err) {

        console.error(
          "Featured movies error:",
          err
        );

      }

    };

    loadFeaturedMovies();

  }, []);


  // --------------------------------------------------
  // SEARCH WHILE USER TYPES
  // --------------------------------------------------

  useEffect(() => {

    const query = movie.trim();

    if (!query) {

      setSuggestions([]);

      return;
    }

    if (selectedMovieKey) {

      setSuggestions([]);

      return;
    }


    const timer = setTimeout(
      async () => {

        try {

          setSearching(true);

          const data =
            await searchMovies(query);

          setSuggestions(
            data.movies || []
          );

        } catch (err) {

          setSuggestions([]);

        } finally {

          setSearching(false);

        }

      },
      300
    );


    return () => clearTimeout(timer);

  }, [movie, selectedMovieKey]);


  // --------------------------------------------------
  // SCROLL TO RESULTS
  // --------------------------------------------------

  useEffect(() => {

    if (recommendations.length > 0) {

      setTimeout(() => {

        recommendationsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }, 100);

    }

  }, [recommendations]);


  // --------------------------------------------------
  // SEARCH MOVIE
  // --------------------------------------------------

  const handleSearch = async () => {

    if (!movie.trim()) {

      setError(
        "Please enter a movie name."
      );

      return;
    }


    setLoading(true);
    setError("");
    setSuggestions([]);
    setRecommendations([]);


    try {

      let movieKey =
        selectedMovieKey;


      // If user typed a movie name
      // instead of selecting suggestion

      if (!movieKey) {

        let searchQuery =
          movie.trim();


        // Remove year if user typed:
        // Dangal (2016)

        searchQuery =
          searchQuery
            .replace(
              /\s*\(\d{4}\)\s*$/,
              ""
            )
            .trim();


        const searchData =
          await searchMovies(
            searchQuery
          );


        const movies =
          searchData.movies || [];


        if (movies.length === 0) {

          throw new Error(
            `No movie found for "${movie.trim()}".`
          );

        }


        movieKey =
          movies[0].movie_key;


        setMovie(movieKey);

        setSelectedMovieKey(
          movieKey
        );

      }


      const data =
        await getRecommendations(
          movieKey
        );


      setRecommendations(
        data.recommendations || []
      );


    } catch (err) {

      setError(
        err.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }

  };


  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleMovieChange = (
    event
  ) => {

    setMovie(
      event.target.value
    );

    setSelectedMovieKey("");

    setError("");

    setRecommendations([]);

  };


  // --------------------------------------------------
  // SELECT SEARCH SUGGESTION
  // --------------------------------------------------

  const handleSuggestionClick = (
    selectedMovie
  ) => {

    const movieKey =
      selectedMovie.movie_key;


    setMovie(movieKey);

    setSelectedMovieKey(
      movieKey
    );

    setSuggestions([]);

    setError("");

    setRecommendations([]);

  };


  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------

  const handleKeyDown = (
    event
  ) => {

    if (event.key === "Enter") {

      handleSearch();

    }

  };


  // --------------------------------------------------
  // EXAMPLE BUTTON
  // --------------------------------------------------

  const handleExampleClick =
    async (movieKey) => {

      setMovie(movieKey);

      setSelectedMovieKey(
        movieKey
      );

      setSuggestions([]);

      setError("");

      setLoading(true);

      setRecommendations([]);


      try {

        const data =
          await getRecommendations(
            movieKey
          );


        setRecommendations(
          data.recommendations || []
        );

      } catch (err) {

        setError(
          err.message ||
          "Unable to get recommendations."
        );

      } finally {

        setLoading(false);

      }

    };


  // --------------------------------------------------
  // MOVIES TO SHOW IN BACKGROUND
  // --------------------------------------------------

  const backgroundMovies =
    recommendations.length > 0
      ? recommendations
      : featuredMovies;


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="app">

      {/* CINEMATIC BACKGROUND */}

      <AnimatedBackground
        movies={backgroundMovies}
      />


      {/* TOP NAVIGATION */}

      <header className="top-navbar">

        <div className="brand">

          <div className="brand-icon">
            🎬
          </div>

          <div className="brand-text">
            MOVIE{" "}
            <span>
              RECOMMENDATION
            </span>{" "}
            SYSTEM
          </div>

        </div>


        <button className="about-button">

          <span className="about-icon">
            ⓘ
          </span>

          About Project

        </button>

      </header>


      {/* HERO */}

      <main className="hero">

        <div className="hero-content">

          <p className="eyebrow">
            MOVIE RECOMMENDATION SYSTEM
          </p>


          <h1>

            Find Your Next

            <span>
              Favorite Movie
            </span>

          </h1>


          <p className="subtitle">

            Get AI-powered movie recommendations
            <br />

            based on the movie you love.

          </p>


          {/* SEARCH */}

          <div className="search-wrapper">

            <div className="search-container">

              <div className="search-icon">
                🔍
              </div>


              <input
                type="text"
                value={movie}
                onChange={
                  handleMovieChange
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Search for a movie (year is optional)..."
                autoComplete="off"
              />


              <button
                className="recommend-button"
                onClick={
                  handleSearch
                }
                disabled={loading}
              >

                {loading
                  ? "Finding..."
                  : "Get Recommendations"}

              </button>

            </div>


            {/* AUTOCOMPLETE */}

            {suggestions.length > 0 && (

              <div className="suggestions">

                {suggestions.map(
                  (suggestion) => (

                    <button
                      className="suggestion-item"
                      key={
                        suggestion.movie_key
                      }
                      onClick={() =>
                        handleSuggestionClick(
                          suggestion
                        )
                      }
                    >

                      <div className="suggestion-icon">
                        🎬
                      </div>


                      <div className="suggestion-info">

                        <strong>
                          {
                            suggestion.movie_name
                          }
                        </strong>

                        <span>

                          {suggestion.year ||
                            "Year unavailable"}

                          {" • "}

                          {suggestion.genre}

                        </span>

                      </div>

                    </button>

                  )
                )}

              </div>

            )}


            {searching &&
              movie.trim() &&
              !selectedMovieKey && (

                <div className="searching-message">

                  Searching movies...

                </div>

              )}

          </div>


          {/* EXAMPLES */}

          <div className="hero-examples">

            <span>
              Try an example:
            </span>


            <button
              onClick={() =>
                handleExampleClick(
                  "Dangal (2016)"
                )
              }
            >
              Dangal (2016)
            </button>


            <button
              onClick={() =>
                handleExampleClick(
                  "Jawan (2023)"
                )
              }
            >
              Jawan (2023)
            </button>


            <button
              onClick={() =>
                handleExampleClick(
                  "3 Idiots (2009)"
                )
              }
            >
              3 Idiots (2009)
            </button>


            <button
              onClick={() =>
                handleExampleClick(
                  "Don (2006)"
                )
              }
            >
              Don (2006)
            </button>

          </div>

        </div>

      </main>


      {/* ERROR */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* RECOMMENDATIONS */}

      <section
        className="recommendations"
        ref={recommendationsRef}
      >

        <div className="recommendations-header">

          <div className="section-title">

            <span className="section-icon">
              🎬
            </span>

            <h2>
              {recommendations.length > 0
                ? "Recommended Movies"
                : "Featured Movies"}
            </h2>

          </div>


          <p>

            {recommendations.length > 0
              ? "Movies selected based on similarity to your search."
              : "Explore some popular movies to get started."}

          </p>

        </div>


        <div className="movie-grid">

          {(recommendations.length > 0
            ? recommendations
            : featuredMovies
          )
            .slice(0, 10)
            .map((movie, index) => (

              <div
                className={
                  index === 0 &&
                  recommendations.length > 0
                    ? "movie-card selected-card"
                    : "movie-card"
                }
                key={
                  movie.movie_key
                }
              >

                {/* POSTER */}

                <div className="movie-poster">

                  {movie.poster_url ? (

                    <img
                      src={
                        movie.poster_url
                      }
                      alt={
                        `${movie.movie_name} poster`
                      }
                    />

                  ) : (

                    <div className="poster-placeholder">
                      🎬
                    </div>

                  )}


                  {/* RANK */}

                  <div className="movie-rank">

                    {index + 1}

                  </div>

                </div>


                {/* MOVIE DETAILS */}

                <div className="movie-info">

                  <h3>
                    {movie.movie_name}
                  </h3>


                  <p className="movie-year">

                    ({movie.year ||
                      "Year unavailable"})

                  </p>


                  <p className="movie-genre">

                    {movie.genre}

                  </p>


                  {recommendations.length > 0 ? (

                    index === 0 ? (

                      <div className="searched-label">

                        ★ Your Search

                      </div>

                    ) : (

                      <div className="similarity">

                        {(movie.similarity *
                          100).toFixed(1)}
                        %

                      </div>

                    )

                  ) : (

                    <div className="featured-label">

                      Featured

                    </div>

                  )}

                </div>

              </div>

            ))}

        </div>

      </section>


      {/* TIP */}

      <section className="tip-section">

        <div className="tip-icon">
          💡
        </div>

        <div>

          <strong>
            Tip:
          </strong>

          <span>
            You can search using just the
            movie name. Year is optional!
          </span>

        </div>

      </section>


      {/* TMDB ATTRIBUTION */}

      <footer className="tmdb-attribution">

        This product uses the TMDB API but is
        not endorsed or certified by TMDB.

      </footer>

    </div>

  );

}


export default App;