import os
from pathlib import Path

import requests
from dotenv import load_dotenv


# Project root
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env from project root
load_dotenv(BASE_DIR / ".env")


TMDB_API_KEY = os.getenv("TMDB_API_KEY")

TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"


def search_tmdb_movie(movie_name, year=None):

    if not TMDB_API_KEY:
        print("❌ TMDB API key not found.")
        return None

    print("🔑 TMDB API key found.")
    print(f"🔎 Searching TMDB for: {movie_name}")

    url = f"{TMDB_BASE_URL}/search/movie"

    params = {
        "api_key": TMDB_API_KEY,
        "query": movie_name,
        "language": "en-US",
        "include_adult": False
    }

    if year:
        params["year"] = year

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        print(f"📡 TMDB response status: {response.status_code}")

        response.raise_for_status()

        data = response.json()

        results = data.get("results", [])

        print(f"🎬 Movies found: {len(results)}")

        if not results:
            print("❌ No movie found.")
            return None

        for movie in results:

            if movie.get("poster_path"):

                result = {
                    "tmdb_id": movie.get("id"),
                    "title": movie.get("title"),
                    "poster_url": (
                        f"{TMDB_IMAGE_BASE_URL}"
                        f"{movie['poster_path']}"
                    )
                }

                print("✅ Movie found!")
                print(result)

                return result

        print("⚠️ Movie found, but no poster was available.")

        return None

    except requests.RequestException as error:

        print("❌ TMDB request failed:")
        print(error)

        return None


if __name__ == "__main__":

    print("\n==============================")
    print("TMDB CONNECTION TEST")
    print("==============================\n")

    result = search_tmdb_movie("Chhichhore", 2019)

    print("\n==============================")
    print("TEST RESULT")
    print("==============================")

    print(result)