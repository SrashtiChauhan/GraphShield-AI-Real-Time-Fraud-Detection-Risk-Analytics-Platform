def generate_alert(fraud_probability, risk_level):

    if risk_level == "HIGH":
        return {
            "alert": True,
            "message": "⚠ High Risk Fraud Alert",
            "fraud_probability": fraud_probability
        }

    return {
        "alert": False,
        "message": "Transaction appears normal",
        "fraud_probability": fraud_probability
    }