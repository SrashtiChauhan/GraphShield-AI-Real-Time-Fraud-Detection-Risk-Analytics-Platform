from fastapi import FastAPI

app = FastAPI(
    title="GraphShield AI Fraud Detection API",
    version="1.0"
)

@app.get("/")
def home():
    return {"message": "GraphShield AI Backend Running"}