from fastapi import FastAPI
from backend.api.routes import router
from backend.api.auth_routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

from backend.database.db import engine, SessionLocal
from backend.models.models import Base, Transaction
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

        # store in DB
        new_tx = Transaction(
            user_id=tx["user_id"],
            device_id=tx["device_id"],
            amount=tx["amount"],
            location=tx["location"],
            fraud_probability=0.5,
            risk_level=tx["risk_level"]
        )

        db.add(new_tx)
        db.commit()

        # update graph
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