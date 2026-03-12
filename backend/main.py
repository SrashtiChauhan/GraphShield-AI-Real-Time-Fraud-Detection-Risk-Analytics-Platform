from fastapi import FastAPI
from backend.api.routes import router

app = FastAPI(
    title="GraphShield AI Fraud Detection API",
    version="1.0"
)

# include API routes
app.include_router(router)


@app.get("/")
def home():
    return {"message": "GraphShield AI Backend Running"}