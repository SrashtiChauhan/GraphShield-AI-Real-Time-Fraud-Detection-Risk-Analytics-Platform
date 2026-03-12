def classify_risk(fraud_probability):

    if fraud_probability < 0.3:
        return "LOW"

    elif fraud_probability < 0.7:
        return "MEDIUM"

    else:
        return "HIGH"