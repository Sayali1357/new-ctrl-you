# Cell 2 — dataset generation
import json, random, csv
from pathlib import Path
Path("data").mkdir(exist_ok=True)

contexts = [
 "Stayed up late gaming before an exam.",
 "Felt lonely and played online all night.",
 "Argued with parents about screen time.",
 "Skipped meals while gaming for long hours.",
 "Ignored friends’ messages to finish a quest.",
 "Lost match and felt worthless, kept playing to feel better."
]

automatic_thoughts = [
 "If I stop, I’ll lose everything.",
 "No one likes me offline.",
 "Gaming is the only thing I’m good at.",
 "I can’t relax without gaming.",
 "Everyone else plays more than me.",
 "I’m a failure if I don’t win."
]

distortions = [
 "All-or-nothing thinking","Overgeneralization",
 "Emotional reasoning","Catastrophizing","Personalization","Labeling"
]

emotions = ["anxiety","guilt","shame","sadness","frustration","compulsion"]
coping = ["avoidance","withdrawal","distraction","rumination","problem-solving"]
resilience = ["supportive_friend","goal_oriented","good_communication","exercise_habit","structured_routine"]
game_types = ["MMORPG","FPS","MOBA","Mobile","Indie"]

def make_record(i):
    ctx = random.choice(contexts)
    thought = random.choice(automatic_thoughts)
    emotion = random.choice(emotions)
    return {
        "id": f"GAD{i:04d}",
        "context": ctx,
        "game_type": random.choice(game_types),
        "automatic_thought": thought,
        "emotion": emotion,
        "intensity": random.randint(1,5),
        "cognitive_distortion": random.choice(distortions),
        "coping_strategy": random.choice(coping),
        "resilience_factor": random.choice(resilience),
        "behavior": "Played longer than planned",
        "consequence": random.choice(["Missed class","Felt guilty","Lost sleep","Relationship tension"]),
        "cbt_intervention": f"What evidence supports '{thought}'? Could you test it?",
        "alternative_thought": "There are other ways to feel good besides gaming.",
        "risk_level": random.choice(["Low","Moderate","High"]),
        "session_type": random.choice(["CBT Dialogue","Coping Session","Resilience Reflection"]),
        "therapist_reply": "It sounds like gaming helps you manage feelings; let's try a small change."
    }

dataset = [make_record(i) for i in range(1,1001)]

# save JSON and CSV
with open("data/cbt_gameaddiction_1000.json","w",encoding="utf8") as f:
    json.dump(dataset,f,indent=2,ensure_ascii=False)

import pandas as pd
pd.DataFrame(dataset).to_csv("data/cbt_gameaddiction_1000.csv", index=False)
print("Saved dataset (1000 entries) to data/")
