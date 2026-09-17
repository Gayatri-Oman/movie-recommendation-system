import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_data():
    """
    Load the cleaned movie dataset.
    """

    base_dir = Path(__file__).resolve().parent.parent
    data_path = base_dir / "data" / "movies_cleaned.csv"

    df = pd.read_csv(data_path)

    return df


def build_model(df):
    """
    Build the TF-IDF model, similarity matrix,
    and movie lookup.
    """

    tfidf = TfidfVectorizer(
        stop_words='english'
    )

    tfidf_matrix = tfidf.fit_transform(
        df['weighted_tags']
    )

    similarity = cosine_similarity(
        tfidf_matrix
    )

    movie_indices = pd.Series(
        df.index,
        index=df['movie_key']
    )

    return tfidf, similarity, movie_indices


def recommend(movie_key, df, similarity, movie_indices, num_recommendations=10):
    if movie_key not in movie_indices:
        return f"Movie '{movie_key}' not found."

    movie_index = movie_indices[movie_key]

    # Get the movie that the user searched for
    selected_movie = df.iloc[movie_index]

    recommendations = []

    # Add the searched movie as the first card
    recommendations.append({
        "movie_key": selected_movie["movie_key"],
        "movie_name": selected_movie["movie_name"],
        "year": int(selected_movie["year"]) if pd.notna(selected_movie["year"]) else None,
        "genre": selected_movie["genre"],
        "director": selected_movie["director"],
        "cast": selected_movie["cast"],
        "similarity": 1.0,
        "is_selected": True
    })

    # Calculate similarity scores
    similarity_scores = list(enumerate(similarity[movie_index]))

    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    # Add similar movies
    for index, score in similarity_scores:

        # Skip the searched movie
        if index == movie_index:
            continue

        # Skip placeholder movies such as "Untitled..."
        if df.iloc[index]["is_placeholder"]:
            continue

        movie = df.iloc[index]

        recommendations.append({
            "movie_key": movie["movie_key"],
            "movie_name": movie["movie_name"],
            "year": int(movie["year"]) if pd.notna(movie["year"]) else None,
            "genre": movie["genre"],
            "director": movie["director"],
            "cast": movie["cast"],
            "similarity": float(round(score, 3)),
            "is_selected": False
        })

        # We want exactly 10 movies
        if len(recommendations) == num_recommendations:
            break

    return recommendations

def search_movies(query, df, limit=8):
    """
    Search movies by title.

    Ranking priority:
    1. Exact title match
    2. Title starts with query
    3. Title contains query

    Newer movies are preferred when the match type is the same.
    """

    query = query.strip().lower()

    if not query:
        return []

    movie_names = (
        df["movie_name"]
        .fillna("")
        .str.strip()
        .str.lower()
    )

    exact_match = movie_names == query

    starts_with = (
        movie_names.str.startswith(query)
        & ~exact_match
    )

    contains = (
        movie_names.str.contains(query, regex=False)
        & ~exact_match
        & ~starts_with
    )

    results = df[
        exact_match | starts_with | contains
    ].copy()

    if results.empty:
        return []

    # Assign search priority
    results["search_priority"] = 3

    results.loc[contains, "search_priority"] = 2
    results.loc[starts_with, "search_priority"] = 1
    results.loc[exact_match, "search_priority"] = 0

    # Newer movies first within the same search priority
    results = results.sort_values(
        by=["search_priority", "year"],
        ascending=[True, False],
        na_position="last"
    )

    search_results = []

    for _, movie in results.head(limit).iterrows():

        search_results.append({
            "movie_key": movie["movie_key"],
            "movie_name": movie["movie_name"],
            "year": (
                int(movie["year"])
                if pd.notna(movie["year"])
                else None
            ),
            "genre": movie["genre"]
        })

    return search_results

# --------------------------------------------------
# Test the recommendation engine directly
# --------------------------------------------------

if __name__ == "__main__":

    df = load_data()

    tfidf, similarity, movie_indices = build_model(df)

    print(f"Loaded {len(df)} movies.")
    print("TF-IDF model and similarity matrix created.")
    print("Movie lookup created.")

    results = recommend(
        "Dangal (2016)",
        df,
        similarity,
        movie_indices,
        5
    )

    print("\nRecommendations:")

    for i, movie in enumerate(results, start=1):
        print(
            f"{i}. {movie['movie_name']} "
            f"({movie['year']}) - "
            f"Similarity: {movie['similarity']}"
        )