from fastapi import FastAPI
from backend.api.routes import router
from backend.api.auth_routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI(
    title="GraphShield AI Fraud Detection API",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include API routes
app.include_router(router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "GraphShield AI Backend Running"}