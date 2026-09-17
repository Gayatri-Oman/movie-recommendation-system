const API_BASE_URL = "http://127.0.0.1:5000";


// Search movies
export async function searchMovies(query) {

  const encodedQuery = encodeURIComponent(query);

  const response = await fetch(
    `${API_BASE_URL}/api/search?q=${encodedQuery}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to search movies."
    );
  }

  return data;
}


// Get recommendations
export async function getRecommendations(movieKey) {

  const encodedMovieKey =
    encodeURIComponent(movieKey);

  const response = await fetch(
    `${API_BASE_URL}/api/recommend/${encodedMovieKey}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Something went wrong."
    );
  }

  return data;
}


// Get featured movies for the first screen
export async function getFeaturedMovies() {

  const response = await fetch(
    `${API_BASE_URL}/api/featured`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to load featured movies."
    );
  }

  return data;
}