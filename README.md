🚀 TACTAI Dashboard: AI-Powered Football Analytics
Dashboard Preview
A real-time football analytics dashboard with fatigue prediction and tactical recommendations.

🔍 Overview
TACTAI is a real-time football coaching dashboard that:

Predicts player fatigue using K-Means clustering on physiological data.

Visualizes match stats, player performance, and opponent weaknesses.

Provides AI-driven substitution recommendations and tactical tips.

Tech Stack:

Frontend: HTML5, CSS3, JavaScript, Chart.js

AI Model: Python, scikit-learn (KMeans, StandardScaler)

Data: CSV-based player metrics (HR, Speed, Breathing, Temp)
--- How the AI Model Works
Fatigue Prediction Pipeline
Input Data: Physiological metrics (HR (bpm), Speed (km/h), etc.).

Preprocessing:

Standardized using StandardScaler().

Clustering:

KMeans(n_clusters=3) groups players into:

🟢 Green: Low fatigue (HR ≤ mean).

🟡 Yellow: Moderate fatigue.

🔴 Red: High fatigue (HR ≥ mean).

Output:

fatigue_clustered.csv with predicted fatigue levels.

Clustering Logic


TACTAI-Dashboard/
├── frontend/
│   ├── index.html          # Dashboard UI
│   ├── style.css           # Styling
│   └── script.js           # Charts & logic
├── model/
│   ├── fatigue_predictor.py # AI clustering script
│   └── fatigue_dataset.csv  # Sample data
└── README.md
