import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv("../data/movies_cleaned.csv")

print(f"Loaded {len(df)} movies.")

tfidf = TfidfVectorizer(
    stop_words='english'
)

tfidf_matrix = tfidf.fit_transform(
    df['weighted_tags']
)

print("TF-IDF matrix shape:", tfidf_matrix.shape)

TfidfVectorizer(stop_words='english')

tfidf.fit_transform(df['weighted_tags'])

tfidf_matrix.shape

similarity = cosine_similarity(tfidf_matrix)

print("Similarity matrix shape:", similarity.shape)

movie_indices = pd.Series(
    df.index,
    index=df['movie_key']
)

print("Movie lookup created.")

def recommend(movie_key, num_recommendations=10):
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
        if index == movie_index:
            continue

        if df.iloc[index]['is_placeholder']:
            continue

        recommendations.append(
            (
                df.iloc[index]['movie_key'],
                float(round(score, 3))
            )
        )

        if len(recommendations) == num_recommendations:
            break

    return recommendations

