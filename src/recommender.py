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


def recommend(
    movie_key,
    df,
    similarity,
    movie_indices,
    num_recommendations=10
):
    """
    Recommend movies similar to the selected movie.
    """

    if movie_key not in movie_indices:
        return f"Movie '{movie_key}' not found."

    movie_index = movie_indices[movie_key]

    similarity_scores = list(
        enumerate(similarity[movie_index])
    )

    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    recommendations = []

    for index, score in similarity_scores:

        # Skip the selected movie itself
        if index == movie_index:
            continue

        # Skip placeholder movies
        if df.iloc[index]['is_placeholder']:
            continue

        movie = df.iloc[index]

        recommendations.append({
            "movie_key": movie["movie_key"],
            "movie_name": movie["movie_name"],
            "year": (
                int(movie["year"])
                if pd.notna(movie["year"])
                else None
            ),
            "genre": movie["genre"],
            "director": movie["director"],
            "cast": movie["cast"],
            "similarity": float(round(score, 3))
        })

        if len(recommendations) == num_recommendations:
            break

    return recommendations


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