from flask import Flask, jsonify, render_template
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
@app.route("/api/fatigue")
def fatigue():
    df = pd.read_csv("fatigue_dataset.csv")

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

    fatigue_data = df.to_dict(orient="records")
    return jsonify({"fatigue_data": fatigue_data})


if __name__ == "__main__":
    app.run(debug=True)


