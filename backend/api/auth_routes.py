from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = "graphshield_secret_key"
ALGORITHM = "HS256"


class UserLogin(BaseModel):
    username: str
    password: str


class UserSignup(BaseModel):
    username: str
    password: str


# simple in-memory user store
users_db = {}


@router.post("/signup")
def signup(user: UserSignup):

    if user.username in users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    users_db[user.username] = user.password

    return {"message": "User registered successfully"}


@router.post("/login")
def login(user: UserLogin):

    if user.username not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    if users_db[user.username] != user.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    token = jwt.encode(
        {
            "sub": user.username,
            "exp": datetime.utcnow() + timedelta(hours=2)
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {"access_token": token, "token_type": "bearer"}