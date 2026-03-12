def detect_behavior_anomaly(amount, avg_amount):

    # detect spending spike
    if amount > avg_amount * 5:
        return {
            "behavior_flag": True,
            "reason": "Unusual spending spike detected"
        }

    return {
        "behavior_flag": False,
        "reason": "Normal spending behavior"
    }