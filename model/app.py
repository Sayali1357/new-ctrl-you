from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from joblib import load
from flask_cors import CORS
from pymongo import MongoClient
import datetime
import os   

app = Flask(__name__)
CORS(app)

# --- Load model ---
model = load("saved_model.joblib")

# --- MongoDB Atlas (secure) ---
MONGO_URI = os.environ.get("MONGO_URI")   
client = MongoClient(MONGO_URI)

db = client["ctrlyou"]
collection = db["questionair"]

# --- Mapping ---
option_mapping = {
    "Never": 1,
    "Rarely": 2,
    "Sometimes": 3,
    "Often": 4,
    "Very Often": 5,
}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("📥 Incoming request:", data)

        if not data or "responses" not in data or "uid" not in data:
            return jsonify({"success": False, "message": "Missing responses or uid"}), 400

        responses = data["responses"]
        uid = data["uid"]

        if len(responses) != 9:
            return jsonify({"success": False, "message": "Exactly 9 responses are required"}), 400

        try:
            numeric_responses = [option_mapping[r] for r in responses]
        except KeyError as e:
            return jsonify({"success": False, "message": f"Invalid option: {e}"}), 400

        X_new = pd.DataFrame([numeric_responses], columns=[f"Q{i}" for i in range(1, 10)])

        prediction = model.predict(X_new)[0]
        total_score = sum(numeric_responses)

        doc = {
            "uid": uid,
            "responses": responses,
            "numeric_responses": numeric_responses,
            "total_score": total_score,
            "prediction": prediction,
            "created_at": datetime.datetime.utcnow()
        }

        collection.insert_one(doc)

        return jsonify({
            "success": True,
            "category": prediction,
            "total_score": total_score
        })

    except Exception as e:
        print(" Error in /predict:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Gaming Addiction Prediction API is running!"})


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))   # ✅ for Render
    app.run(host="0.0.0.0", port=port, debug=False)