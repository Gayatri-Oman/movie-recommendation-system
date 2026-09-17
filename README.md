<<<<<<< HEAD
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
=======
# 🎬 Bollywood Movie Recommendation System

A Data Science-based Bollywood movie recommendation system that uses **NLP, TF-IDF, and cosine similarity** to recommend movies similar to a selected movie.

The project includes a **React frontend**, **Flask backend**, and **TMDB API integration** for movie posters.

## ✨ Features

- 🔎 Movie search with suggestions
- 🎬 Content-based movie recommendations
- 🤖 TF-IDF and cosine similarity
- 🖼️ Movie posters using TMDB API
- ⚡ React frontend
- 🔗 Flask REST API
- 🎨 Cinematic movie-themed UI

## 🛠️ Technologies Used

**Frontend:** React, JavaScript, HTML, CSS, Vite

**Backend:** Python, Flask, Flask-CORS

**Data Science:** Pandas, Scikit-learn, TF-IDF, Cosine Similarity

**API:** TMDB API

## 📂 Project Structure

movie-recommendation-system/
├── backend/
├── data/
├── frontend/
├── notebooks/
├── src/
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md

🚀 How to Run
Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m backend.app
Frontend
cd frontend
npm install
npm run dev

Add your TMDB API key to a .env file:

TMDB_API_KEY=your_tmdb_api_key_here
🧠 Recommendation Approach

The system combines movie genre, overview, director, and cast information and converts the text into TF-IDF vectors. Cosine similarity is then used to find movies with similar characteristics.

👩‍💻 Author

Gayatri Oman

MCA Student | PES Modern College of Engineering, Pune

GitHub: https://github.com/Gayatri-Oman
>>>>>>> 78645c9 (Complete movie recommendation web application)
