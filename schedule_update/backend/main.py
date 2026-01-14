from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel

app = FastAPI()

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase
SUPABASE_URL = "https://vmvoomlhynwyimbakunz.supabase.co"
SUPABASE_KEY = "sb_secret_s-IfXDGV4_tjG6cGb3JMWA_or7Lc9T6"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class LoginRequest(BaseModel):
    email: str
    password: str

# FIXED LOGIN ENDPOINT
@app.post("/login")
async def login(request: LoginRequest):
    # Get user from users table
    user_response = supabase.table("users").select("*").eq("email", request.email).execute()
    
    if not user_response.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = user_response.data[0]
    
    # Check password
    stored_password = user.get("password_hash")
    if not stored_password or request.password != stored_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Get profile for full_name
    profile_response = supabase.table("profiles").select("*").eq("user_id", user["id"]).execute()
    full_name = ""
    
    if profile_response.data:
        profile = profile_response.data[0]
        full_name = f"{profile.get('first_name', '')} {profile.get('last_name', '')}".strip()
    
    if not full_name:
        full_name = user.get("full_name") or request.email
    
    return {
        "token": "mock_token",
        "user_id": user["id"],
        "full_name": full_name,
        "user_type": "student"  # Default to student
    }

# FIXED PROFILE ENDPOINT - SIMPLE AND WORKING
@app.get("/profile/{user_id}")
async def get_profile(user_id: str):
    # Get profile data
    profile_response = supabase.table("profiles").select("*").eq("user_id", user_id).execute()
    
    if not profile_response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile = profile_response.data[0]
    
    # Add full_name if not exists
    if "full_name" not in profile:
        first_name = profile.get("first_name", "")
        last_name = profile.get("last_name", "")
        profile["full_name"] = f"{first_name} {last_name}".strip()
    
    # Add user_type (default to student)
    profile["user_type"] = "student"
    
    # Add student_id/lecturer_id if available
    if "student_id" not in profile and "lecturer_id" not in profile:
        profile["student_id"] = f"S{user_id[:8].upper()}"
    
    return profile