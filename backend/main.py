from fastapi import FastAPI
from backend.api.routes import router
from backend.api.auth_routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

from backend.database.db import engine, SessionLocal
from backend.models.models import Base, Transaction, Alert
import backend.models.models

# streaming imports
import threading
import time
from backend.services.stream_service import generate_transaction
from backend.services.graph_service import add_transaction


# =========================
# 🔥 CREATE TABLES
# =========================
Base.metadata.create_all(bind=engine)


# =========================
# 🚀 FASTAPI APP
# =========================
app = FastAPI(
    title="GraphShield AI Fraud Detection API",
    version="1.0"
)


# =========================
# 🌐 CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# 🔄 REAL-TIME STREAM FUNCTION
# =========================
def background_transaction_stream():
    db = SessionLocal()

    while True:
        tx = generate_transaction()

        # =========================
        # 🧠 RISK LOGIC
        # =========================
        if tx["amount"] > 3000:
            risk = "HIGH"
        elif tx["amount"] > 1000:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        # =========================
        # 💳 STORE TRANSACTION
        # =========================
        new_tx = Transaction(
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

        # =========================
        # 🚨 CREATE ALERT (FIX)
        # =========================
        if risk == "HIGH":
            new_alert = Alert(
                transaction_id=new_tx.id,
                risk_level=risk,
                reason="High risk transaction detected"
            )
            db.add(new_alert)
            db.commit()

        # =========================
        # 🌐 GRAPH UPDATE
        # =========================
        add_transaction(tx["user_id"], tx["device_id"])

        print("STREAM TX:", tx)

        time.sleep(3)  # every 3 seconds


# =========================
# ▶️ START STREAM ON SERVER START
# =========================
@app.on_event("startup")
def start_stream():
    thread = threading.Thread(
        target=background_transaction_stream,
        daemon=True
    )
    thread.start()


# =========================
# 📡 ROUTES
# =========================
app.include_router(router)
app.include_router(auth_router)


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
def home():
    return {"message": "GraphShield AI Backend Running"}