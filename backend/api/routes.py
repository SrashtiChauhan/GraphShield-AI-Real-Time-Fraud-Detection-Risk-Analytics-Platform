from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from backend.services.fraud_service import predict_fraud
from backend.utils.risk_engine import classify_risk

router = APIRouter()


class Transaction(BaseModel):
    features: List[float]


@router.post("/predict")
def predict(transaction: Transaction):

    result = predict_fraud(transaction.features)

    fraud_probability = result["fraud_probability"]
    prediction = result["prediction"]

    risk_level = classify_risk(fraud_probability)

    return {
        "fraud_probability": fraud_probability,
        "prediction": prediction,
        "risk_level": risk_level
    }