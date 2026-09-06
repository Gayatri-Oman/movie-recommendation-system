import { useState } from "react";
import { getRecommendations } from "./services/api";
import "./App.css";


function App() {

  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSearch = async () => {

    if (!movie.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {

      const data = await getRecommendations(movie);

      setRecommendations(data.recommendations);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };


  const handleExampleClick = (movieName) => {

    setMovie(movieName);
    setError("");
    setRecommendations([]);

  };


  return (
    <div className="app">

      {/* Hero Section */}

      <header className="hero">

        <p className="eyebrow">
          MOVIE RECOMMENDATION SYSTEM
        </p>

        <h1>
          Find your next
          <span> favorite movie.</span>
        </h1>

        <p className="subtitle">
          Discover movies similar to the ones you already love,
          powered by machine learning.
        </p>


        {/* Search */}

        <div className="search-container">

          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            placeholder="Enter a movie name..."
          />

          <button onClick={handleSearch}>
            {loading ? "Finding..." : "Get Recommendations"}
          </button>

        </div>

      </header>


      {/* Example Movies */}

      <section className="examples">

        <h2>Try an example</h2>

        <div className="example-buttons">

          <button onClick={() => handleExampleClick("Dangal (2016)")}>
            Dangal (2016)
          </button>

          <button onClick={() => handleExampleClick("Jawan (2023)")}>
            Jawan (2023)
          </button>

          <button onClick={() => handleExampleClick("3 Idiots (2009)")}>
            3 Idiots (2009)
          </button>

          <button onClick={() => handleExampleClick("Don (2006)")}>
            Don (2006)
          </button>

        </div>

      </section>


      {/* Error Message */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* Recommendations */}

      {recommendations.length > 0 && (

        <section className="recommendations">

          <h2>
            Recommended Movies
          </h2>

          <div className="movie-grid">

            {recommendations.map((movie, index) => (

              <div
                className="movie-card"
                key={movie.movie_key}
              >

                <div className="movie-rank">
                  #{index + 1}
                </div>

                <h3>
                  {movie.movie_name}
                </h3>

                <p>
                  {movie.year || "Year unavailable"}
                </p>

                <p>
                  {movie.genre}
                </p>

                <p>
                  Director: {movie.director}
                </p>

               <div className="similarity">
                  Similarity: {(movie.similarity * 100).toFixed(1)}%
              </div>

              </div>

            ))}

          </div>

        </section>

      )}

    </div>
  );
}


export default App;