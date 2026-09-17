from flask import Flask, jsonify
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor

import pandas as pd

from src.recommender import (
    load_data,
    build_model,
    recommend,
    search_movies
)

from .tmdb_service import search_tmdb_movie


app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# Load data and build recommendation model
# --------------------------------------------------

df = load_data()

tfidf, similarity, movie_indices = build_model(df)


# --------------------------------------------------
# Home route
# --------------------------------------------------

@app.route("/")
def home():
    return "Movie Recommendation System API is running!"


# --------------------------------------------------
# Movie search route
# --------------------------------------------------

@app.route("/api/search")
def search():

    from flask import request

    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({
            "success": False,
            "error": "Search query is required."
        }), 400

    results = search_movies(
        query,
        df,
        8
    )

    return jsonify({
        "success": True,
        "query": query,
        "movies": results
    })

# --------------------------------------------------
# Recommendation route
# --------------------------------------------------

@app.route("/api/recommend/<path:movie_key>")
def get_recommendations(movie_key):

    results = recommend(
        movie_key,
        df,
        similarity,
        movie_indices,
        10
    )

    if isinstance(results, str):
        return jsonify({
            "success": False,
            "error": results
        }), 404

    # Add TMDB poster information
    for movie in results:

        tmdb_result = search_tmdb_movie(
            movie["movie_name"],
            movie["year"]
        )

        if tmdb_result:
            movie["tmdb_id"] = tmdb_result["tmdb_id"]
            movie["poster_url"] = tmdb_result["poster_url"]
        else:
            movie["tmdb_id"] = None
            movie["poster_url"] = None

    return jsonify({
        "success": True,
        "movie": movie_key,
        "recommendations": results
    })

@app.route("/api/featured")
def get_featured_movies():

    featured_names = [
        "Dangal",
        "Jawan",
        "3 Idiots",
        "Chhichhore",
        "Pathaan",
        "PK",
        "Sanju",
        "Taare Zameen Par"
    ]

    def fetch_featured_movie(movie_name):

        matches = df[
            df["movie_name"].str.lower() == movie_name.lower()
        ]

        if matches.empty:
            return None

        movie = matches.iloc[0]

        year = (
            int(movie["year"])
            if pd.notna(movie["year"])
            else None
        )

        tmdb_result = search_tmdb_movie(
            movie_name,
            year
        )

        if not tmdb_result:
            return None

        return {
            "movie_key": movie["movie_key"],
            "movie_name": movie["movie_name"],
            "year": year,
            "genre": movie["genre"],
            "poster_url": tmdb_result["poster_url"],
            "tmdb_id": tmdb_result["tmdb_id"]
        }

    # Run TMDB requests at the same time
    with ThreadPoolExecutor(max_workers=8) as executor:
        results = list(
            executor.map(fetch_featured_movie, featured_names)
        )

    movies = [
        movie for movie in results
        if movie is not None
    ]

    return jsonify({
        "success": True,
        "movies": movies
    })
# --------------------------------------------------
# Start Flask server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)