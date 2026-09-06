# 🎬 Movie Recommendation System

A content-based movie recommendation system that recommends movies similar to a selected movie using **TF-IDF vectorization** and **Cosine Similarity**.

The project combines a **Python machine learning backend**, a **Flask REST API**, and a **React frontend** to provide an interactive movie recommendation experience.

---

## 📌 Project Overview

Finding a good movie to watch can be difficult when there are thousands of choices available.

This project solves that problem by recommending movies based on the characteristics of a movie selected by the user.

The recommendation engine analyzes information such as:

- 🎭 Genre
- 🎬 Director
- 👥 Cast
- 📝 Movie overview

These features are combined into a text representation and converted into numerical vectors using **TF-IDF**.

The similarity between movies is then calculated using **Cosine Similarity**.

The system returns the movies that are most similar to the selected movie.

---

## ✨ Features

- 🔎 Search for a movie by name and year
- 🎯 Get the top 10 similar movie recommendations
- 🤖 Content-based recommendation using machine learning
- 📊 TF-IDF feature extraction
- 📐 Cosine similarity for recommendation ranking
- 🧹 Data cleaning and preprocessing
- 🌐 Flask REST API
- ⚛️ React frontend
- 📱 Responsive user interface
- ⚠️ Error handling for invalid movie names
- 📈 Similarity scores displayed as percentages

---

## 🧠 How the Recommendation System Works

The recommendation pipeline consists of the following steps:

```text
Movie Dataset
      │
      ▼
Data Cleaning
      │
      ▼
Feature Preparation
      │
      ▼
Combine Genre + Director + Cast + Overview
      │
      ▼
TF-IDF Vectorization
      │
      ▼
Cosine Similarity
      │
      ▼
Rank Similar Movies
      │
      ▼
Top 10 Recommendations
