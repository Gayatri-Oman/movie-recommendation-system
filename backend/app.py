from flask import Flask, jsonify

from src.recommender import (
    load_data,
    build_model,
    recommend
)


app = Flask(__name__)


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

    return jsonify({
        "success": True,
        "movie": movie_key,
        "recommendations": results
    })

# --------------------------------------------------
# Start Flask server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)