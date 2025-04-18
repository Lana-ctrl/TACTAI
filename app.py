from flask import Flask, jsonify, render_template
import pandas as pd

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/fatigue")
def fatigue():
    df = pd.read_csv("fatigue_dataset.csv")

    # Check column names and use what's available
    # For this example, assume the CSV has: name, fatigue, performance
    fatigue_data = df[["name", "fatigue", "performance"]].to_dict(orient="records")

    return jsonify({"fatigue_data": fatigue_data})

if __name__ == "__main__":
    app.run(debug=True)

