from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from backend.services.fraud_service import predict_fraud
from backend.utils.risk_engine import classify_risk
from backend.services.alert_service import generate_alert
from backend.services.behavior_service import detect_behavior_anomaly

router = APIRouter()


class Transaction(BaseModel):
    features: List[float]


@router.post("/predict")
def predict(transaction: Transaction):

    result = predict_fraud(transaction.features)

    fraud_probability = result["fraud_probability"]
    prediction = result["prediction"]

    # risk classification
    risk_level = classify_risk(fraud_probability)

    # alert generation
    alert_info = generate_alert(fraud_probability, risk_level)

    # behavior detection
    amount = transaction.features[-1]  # last feature is Amount
    avg_amount = 200  # simulated average spending

    behavior = detect_behavior_anomaly(amount, avg_amount)

    return {
        "fraud_probability": fraud_probability,
        "prediction": prediction,
        "risk_level": risk_level,
        "alert": alert_info["alert"],
        "message": alert_info["message"],
        "behavior_flag": behavior["behavior_flag"],
        "behavior_reason": behavior["reason"]
    }