from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Load model ---
model = load("saved_model.joblib")

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
        print(" Incoming request:", data)

        if not data or "responses" not in data:
            return jsonify({"success": False, "message": "Missing responses"}), 400

        responses = data["responses"]

        if len(responses) != 9:
            return jsonify({"success": False, "message": "Exactly 9 responses are required"}), 400

        # Convert to numeric
        try:
            numeric_responses = [option_mapping[r] for r in responses]
        except KeyError as e:
            return jsonify({"success": False, "message": f"Invalid option: {e}"}), 400

        # Prepare input
        X_new = pd.DataFrame([numeric_responses], columns=[f"Q{i}" for i in range(1, 10)])

        # Prediction
        prediction = model.predict(X_new)[0]

        # Score
        total_score = sum(numeric_responses)

        return jsonify({
            "success": True,
            "category": prediction,
            "total_score": total_score
        })

    except Exception as e:
        print(" Error:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Prediction API running (no DB)"})


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)