from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

# ML + Utils
from backend.services.fraud_service import predict_fraud
from backend.utils.risk_engine import classify_risk
from backend.services.alert_service import generate_alert
from backend.services.behavior_service import detect_behavior_anomaly
from backend.utils.explainability import explain_prediction
from backend.utils.preprocessing import preprocess_transaction

# Graph + Stream
from backend.services.graph_service import (
    add_transaction,
    detect_suspicious_device,
    get_graph_data
)
from backend.services.stream_service import generate_transaction

router = APIRouter()

# =======================
# 📊 GRAPH API
# =======================
@router.get("/graph")
def graph():
    return get_graph_data()


# =======================
# 📦 REQUEST MODEL
# =======================
class Transaction(BaseModel):
    user_id: int
    device_id: str
    features: List[float]


# =======================
# 🤖 PREDICTION API
# =======================
@router.post("/predict")
def predict(transaction: Transaction):

    # ML prediction
    features = preprocess_transaction(transaction.features)
    result = predict_fraud(features)

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

    # explainability
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


# =======================
# 🔄 REAL-TIME TRANSACTIONS API
# =======================

transactions_store = []

@router.get("/transactions")
def get_transactions():
    global transactions_store

    # generate new transaction
    new_tx = generate_transaction()

    # ✅ ADD TO GRAPH (VERY IMPORTANT)
    device_id = f"device_{new_tx['user_id'] % 5}"
    add_transaction(new_tx["user_id"], device_id)

    # add to store
    transactions_store.insert(0, new_tx)

    # keep last 10
    transactions_store = transactions_store[:10]

    return transactions_store