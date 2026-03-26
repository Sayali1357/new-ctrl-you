from flask import Flask, request, jsonify
from flask_cors import CORS

# ---- Initialize Flask ----
app = Flask(__name__)
CORS(app)  # allows React frontend to access Flask API

# ---- Dummy functions (replace later with real Gemini + emotion model) ----
def detect_emotion(text):
    # simple rule-based emotion detector
    if any(w in text.lower() for w in ["sad", "depressed", "unhappy"]):
        return "sad"
    elif any(w in text.lower() for w in ["angry", "mad", "irritated"]):
        return "angry"
    elif any(w in text.lower() for w in ["happy", "excited", "great"]):
        return "happy"
    else:
        return "neutral"

def gen_gemini_cbt_reply(text, emotion, history=None):
    # simple bot reply for testing (replace with Gemini API later)
    return f"I see that you're feeling {emotion}. Let's talk more about that."

def gen_gemini_timetable(play_period, free_periods, target):
    # generate a simple fake timetable
    return {
        "Play Period": play_period,
        "Free Periods": free_periods,
        "Target Hours": target,
        "Suggestion": "Try to balance gaming with rest and outdoor activity."
    }

# ---- Memory store (simple, not persistent) ----
chat_history = {}

# ---- Routes ----
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    uid = data.get("uid", "anon")
    text = data.get("message", "")

    emotion = detect_emotion(text)
    history = chat_history.get(uid, [])

    reply = gen_gemini_cbt_reply(text, emotion, history)
    history.append({"from": "user", "text": text})
    history.append({"from": "bot", "text": reply})
    chat_history[uid] = history[-50:]  # keep last 50 messages

    return jsonify({"emotion": emotion, "reply": reply})

@app.route("/plan", methods=["POST"])
def plan():
    data = request.json
    uid = data.get("uid", "anon")
    play_period = data.get("play_period")
    free_periods = data.get("free_periods")
    target = data.get("target_hours")

    timetable = gen_gemini_timetable(play_period, free_periods, target)
    return jsonify({"timetable": timetable})

# ---- Run the Flask app ----
if __name__ == "__main__":
    app.run(port=5000, debug=True)
