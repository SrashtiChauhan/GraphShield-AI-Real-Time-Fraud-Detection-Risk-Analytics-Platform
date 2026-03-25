from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

# DB
from backend.database.db import get_db
from backend.models.models import Transaction as DBTransaction
from backend.models.models import Alert as DBAlert

# ML + Utils
from backend.services.fraud_service import predict_fraud
from backend.utils.risk_engine import classify_risk
from backend.services.alert_service import generate_alert
from backend.services.behavior_service import detect_behavior_anomaly
from backend.utils.explainability import explain_prediction
from backend.utils.preprocessing import preprocess_transaction

# Graph + Stream
from backend.services.graph_service import (
    add_transaction as graph_add_transaction,
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
# 🤖 PREDICTION API (ML + GRAPH + DB + ALERT)
# =======================
@router.post("/predict")
def predict(transaction: Transaction, db: Session = Depends(get_db)):

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
    graph_add_transaction(transaction.user_id, transaction.device_id)
    graph_result = detect_suspicious_device(transaction.device_id)

    # explainability
    explanation = explain_prediction(transaction.features)

    # ✅ STORE TRANSACTION IN DB
    new_tx = DBTransaction(
        user_id=transaction.user_id,
        device_id=transaction.device_id,
        amount=amount,
        location="India",
        fraud_probability=fraud_probability,
        risk_level=risk_level
    )

    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)

    # 🚨 STORE ALERT (ONLY HIGH RISK)
    if risk_level == "HIGH":
        new_alert = DBAlert(
            transaction_id=new_tx.id,
            risk_level=risk_level,
            reason=alert_info["message"]
        )

        db.add(new_alert)
        db.commit()

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
# 🔄 REAL-TIME TRANSACTIONS (STORE IN DB)
# =======================
@router.post("/transaction")
def create_transaction(db: Session = Depends(get_db)):

    tx = generate_transaction()

    # risk logic
    if tx["amount"] > 3000:
        risk = "HIGH"
    elif tx["amount"] > 1000:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    # graph update
    graph_add_transaction(tx["user_id"], tx["device_id"])

    # store in DB
    new_tx = DBTransaction(
        user_id=tx["user_id"],
        device_id=tx["device_id"],
        amount=tx["amount"],
        location=tx["location"],
        fraud_probability=0.5,
        risk_level=risk
    )

    db.add(new_tx)
    db.commit()

    return {"message": "Transaction stored"}


# =======================
# 📊 GET TRANSACTIONS
# =======================
@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):

    transactions = (
        db.query(DBTransaction)
        .order_by(DBTransaction.id.desc())
        .limit(10)
        .all()
    )

    return transactions


# =======================
# 🚨 GET ALERTS
# =======================
@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):

    alerts = (
        db.query(DBAlert)
        .order_by(DBAlert.id.desc())
        .limit(10)
        .all()
    )

    return alerts

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):

    transactions = db.query(DBTransaction).all()

    total = len(transactions)

    high = len([t for t in transactions if t.risk_level == "HIGH"])
    medium = len([t for t in transactions if t.risk_level == "MEDIUM"])
    low = len([t for t in transactions if t.risk_level == "LOW"])

    return {
        "total_transactions": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low
    }


# =======================
# =======================
# 🔍 GET SINGLE TRANSACTION
# =======================
@router.get("/transaction/{tx_id}")
def get_transaction(tx_id: int, db: Session = Depends(get_db)):

    tx = db.query(DBTransaction).filter(DBTransaction.id == tx_id).first()

    if not tx:
        return {"error": "Transaction not found"}

    return tx