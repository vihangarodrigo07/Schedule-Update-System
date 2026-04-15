from fastapi import APIRouter, HTTPException
from app.core.database import supabase
from app.schemas.user import RegisterRequest, LoginRequest
from app.utils.helpers import build_full_name

router = APIRouter(tags=["Auth"])

@router.post("/register")
async def register(request: RegisterRequest):
    # 1. Register user in Supabase Auth (Handles Hashing & JWT)
    try:
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })
    except Exception as e:
        # Catch errors like "User already registered"
        raise HTTPException(status_code=400, detail=str(e))

    if not auth_response.user:
        raise HTTPException(status_code=500, detail="Registration failed")

    user_id = auth_response.user.id
    full_name = build_full_name(request.first_name, request.last_name)

    # 2. Add extra details to your public 'profiles' table
    # (Since auth.users is hidden, we store names here)
    profile_insert = (
        supabase.table("profiles")
        .insert({
            "user_id": user_id,
            "first_name": request.first_name,
            "last_name": request.last_name,
            # "full_name": full_name  <-- Add this column to DB if you haven't yet
        })
        .execute()
    )
    
    # Return the session provided by Supabase
    return {
        "access_token": auth_response.session.access_token,
        "token_type": "bearer",
        "user_id": user_id,
        "user_type": "student"
    }

@router.post("/login")
async def login(request: LoginRequest):
    try:
        # 1. Supabase checks email/password & returns a valid JWT
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not auth_response.session:
        raise HTTPException(status_code=401, detail="Login failed")

    # 2. Get profile info (Optional, just for frontend convenience)
    user_id = auth_response.user.id
    
    # Return the real Supabase JWT
    return {
        "access_token": auth_response.session.access_token,
        "refresh_token": auth_response.session.refresh_token, # Send this too!
        "token_type": "bearer",
        "user_id": user_id,
        "expires_in": auth_response.session.expires_in # Seconds until expiry
    }