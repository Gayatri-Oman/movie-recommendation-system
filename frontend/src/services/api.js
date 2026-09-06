const API_BASE_URL = "http://127.0.0.1:5000";

export async function getRecommendations(movieKey) {
  const encodedMovieKey = encodeURIComponent(movieKey);

  const response = await fetch(
    `${API_BASE_URL}/api/recommend/${encodedMovieKey}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}