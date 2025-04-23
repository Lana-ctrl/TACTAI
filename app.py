from flask import Flask, jsonify, render_template
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import random
import time

app = Flask(__name__)

@app.route("/")
def index():
    player = get_random_player()
    return render_template("index.html", player=player)

# Load dataset
df = pd.read_csv("fatigue_dataset.csv")

# Preprocess data for fatigue analysis
features = ["HR (bpm)", "Speed (km/h)", "Breathing (/min)", "Temp (°C)"]
X = df[features]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
df["Fatigue Cluster"] = kmeans.fit_predict(X_scaled)

cluster_hr_means = df.groupby("Fatigue Cluster")["HR (bpm)"].mean().sort_values()
cluster_map = {
    cluster_hr_means.index[0]: "Green",
    cluster_hr_means.index[1]: "Yellow",
    cluster_hr_means.index[2]: "Red"
}
df["Fatigue Level"] = df["Fatigue Cluster"].map(cluster_map)

# Cache for player data
last_player_update = 0
current_player = None

def get_random_player():
    global last_player_update, current_player
    current_time = time.time()
    
    # Update player every 30 seconds
    if current_time - last_player_update > 30 or current_player is None:
        current_player = random.choice(df.to_dict(orient="records"))
        last_player_update = current_time
    
    return current_player


@app.route("/api/player")
def get_player():
    player = get_random_player()
    return jsonify(player)

@app.route("/api/fatigue")
def fatigue():
    fatigue_data = df.to_dict(orient="records")
    return jsonify({"fatigue_data": fatigue_data})

@app.route("/api/substitute/<player_name>")
def suggest_sub(player_name):
    bench_df = pd.read_csv("Full_Bench_Players_Dataset.csv")
    on_field_df = pd.read_csv("fatigue_dataset.csv")
    subs = get_best_substitutes(player_name, on_field_df, bench_df, top_n=2)
    return subs.to_json(orient="records")


def get_best_substitutes(player_name, on_field_df, bench_df, top_n=2):
    player_row = on_field_df[on_field_df['Player Name'] == player_name]
    if player_row.empty:
        return []

    player = player_row.iloc[0]
    position = player['Position']
    speed = player['Speed (km/h)']

    available_bench = bench_df[
        (bench_df['Position'] == position) &
        (bench_df['Available'] == 1)
    ].copy()

    available_bench['Speed_Diff'] = abs(available_bench['Speed (km/h)'] - speed)
    best_matches = available_bench.nsmallest(top_n, 'Speed_Diff')

    return best_matches[['Name', 'Position', 'Speed (km/h)', 'Fatigue Score', 'Speed_Diff']]


if __name__ == "__main__":
    app.run(debug=True)

