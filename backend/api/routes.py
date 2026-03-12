from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from backend.services.fraud_service import predict_fraud
from backend.utils.risk_engine import classify_risk
from backend.services.alert_service import generate_alert
from backend.services.behavior_service import detect_behavior_anomaly
from backend.services.graph_service import add_transaction, detect_suspicious_device
from backend.utils.explainability import explain_prediction

router = APIRouter()


class Transaction(BaseModel):
    user_id: int
    device_id: str
    features: List[float]


@router.post("/predict")
def predict(transaction: Transaction):

    # ML prediction
    result = predict_fraud(transaction.features)

    fraud_probability = result["fraud_probability"]
    prediction = result["prediction"]

    # risk classification
    risk_level = classify_risk(fraud_probability)

    # alert generation
    alert_info = generate_alert(fraud_probability, risk_level)

    # behavior analysis
    amount = transaction.features[-1]
    avg_amount = 200
    behavior = detect_behavior_anomaly(amount, avg_amount)

    # graph fraud detection
    add_transaction(transaction.user_id, transaction.device_id)
    graph_result = detect_suspicious_device(transaction.device_id)

    # explainable AI
    explanation = explain_prediction(transaction.features)


    return {
        "fraud_probability": fraud_probability,
        "prediction": prediction,
        "risk_level": risk_level,
        "alert": alert_info["alert"],
        "message": alert_info["message"],
        "behavior_flag": behavior["behavior_flag"],
        "behavior_reason": behavior["reason"],
        "graph_flag": graph_result["graph_flag"],
        "graph_reason": graph_result["reason"],
        "explanation": explanation["top_contributions"]
    }