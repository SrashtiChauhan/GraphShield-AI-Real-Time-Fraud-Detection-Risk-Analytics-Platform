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
from backend.utils.preprocessing import preprocess_transaction, create_features

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
    amount: float
    location: str


# =======================
# 🤖 PREDICT API
# =======================
@router.post("/predict")
def predict(transaction: Transaction, db: Session = Depends(get_db)):

    # feature engineering
    features = create_features(transaction.dict())
    features = preprocess_transaction(features)

    # ML
    result = predict_fraud(features)
    fraud_probability = result["fraud_probability"]
    prediction = result["prediction"]

    # risk
    risk_level = classify_risk(fraud_probability)

    # alert logic
    alert_info = generate_alert(fraud_probability, risk_level)

    # behavior
    amount = transaction.amount
    behavior = detect_behavior_anomaly(amount, 200)

    # graph
    graph_add_transaction(transaction.user_id, transaction.device_id)
    graph_result = detect_suspicious_device(transaction.device_id)

    # explainability
    explanation = explain_prediction(features)

    # save transaction
    new_tx = DBTransaction(
        user_id=transaction.user_id,
        device_id=transaction.device_id,
        amount=amount,
        location=transaction.location,
        fraud_probability=fraud_probability,
        risk_level=risk_level
    )

    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)

    # =======================
    # 🚨 FIXED ALERT LOGIC
    # =======================
    if alert_info["alert"] or risk_level == "HIGH":
        new_alert = DBAlert(
            transaction_id=new_tx.id,
            risk_level=risk_level,
            reason=alert_info["message"] or "High risk transaction detected"
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
# 🔄 REAL-TIME TRANSACTIONS
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

    # graph
    graph_add_transaction(tx["user_id"], tx["device_id"])

    # store transaction
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
    db.refresh(new_tx)

    # =======================
    # 🚨 ADD ALERT HERE ALSO
    # =======================
    if risk == "HIGH":
        new_alert = DBAlert(
            transaction_id=new_tx.id,
            risk_level=risk,
            reason="High risk transaction detected"
        )
        db.add(new_alert)
        db.commit()

    return {"message": "Transaction stored"}


# =======================
# 📊 GET TRANSACTIONS
# =======================
@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):

    return (
        db.query(DBTransaction)
        .order_by(DBTransaction.id.desc())
        .limit(10)
        .all()
    )


# =======================
# 🚨 GET ALERTS
# =======================
@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):

    return (
        db.query(DBAlert)
        .order_by(DBAlert.id.desc())
        .limit(10)
        .all()
    )


# =======================
# 📊 ANALYTICS
# =======================
@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):

    transactions = db.query(DBTransaction).all()

    return {
        "total_transactions": len(transactions),
        "high_risk": len([t for t in transactions if t.risk_level == "HIGH"]),
        "medium_risk": len([t for t in transactions if t.risk_level == "MEDIUM"]),
        "low_risk": len([t for t in transactions if t.risk_level == "LOW"]),
    }


# =======================
# 🔍 GET SINGLE TX
# =======================
@router.get("/transaction/{tx_id}")
def get_transaction(tx_id: int, db: Session = Depends(get_db)):

    tx = db.query(DBTransaction).filter(DBTransaction.id == tx_id).first()

    if not tx:
        return {"error": "Transaction not found"}

    return tx