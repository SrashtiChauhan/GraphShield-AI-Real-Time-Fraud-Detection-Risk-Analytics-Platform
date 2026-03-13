from fastapi import FastAPI
from backend.api.routes import router
from backend.api.auth_routes import router as auth_router

app = FastAPI(
    title="GraphShield AI Fraud Detection API",
    version="1.0"
)

# include API routes
app.include_router(router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "GraphShield AI Backend Running"}