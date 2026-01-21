from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel, EmailStr
from uuid import uuid4
import bcrypt

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Supabase
SUPABASE_URL = "https://vmvoomlhynwyimbakunz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdm9vbWxoeW53eWltYmFrdW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjE3MjEsImV4cCI6MjA4MzkzNzcyMX0.5Rw5ZxAX3phbuNvuzFzs5rC6eCUo-X7dcLE0Qud_uDE"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# ---------------------------
# Models
# ---------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


# ---------------------------
# Helpers
# ---------------------------
def build_full_name(first_name: str = "", last_name: str = "") -> str:
    return f"{first_name or ''} {last_name or ''}".strip()


# ---------------------------
# Routes
# ---------------------------
@app.post("/register")
async def register(request: RegisterRequest):
    existing = (
        supabase.table("users")
        .select("id")
        .eq("email", request.email)
        .execute()
    )
    if existing.data:
        raise HTTPException(status_code=409, detail="Email already registered")

    user_id = str(uuid4())

    password_hash = bcrypt.hashpw(
        request.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    full_name = build_full_name(request.first_name, request.last_name)

    user_insert = (
        supabase.table("users")
        .insert({
            "id": user_id,
            "email": request.email,
            "password_hash": password_hash,
            "full_name": full_name
        })
        .execute()
    )

    if not user_insert.data:
        raise HTTPException(status_code=500, detail="Failed to create user")

    # ✅ FIXED: profiles table has no full_name column
    profile_insert = (
        supabase.table("profiles")
        .insert({
            "user_id": user_id,
            "first_name": request.first_name,
            "last_name": request.last_name
        })
        .execute()
    )

    if not profile_insert.data:
        raise HTTPException(status_code=500, detail="Failed to create profile")

    return {
        "token": "mock_token",
        "user_id": user_id,
        "full_name": full_name if full_name else request.email,
        "user_type": "student"
    }

    if not user_insert.data:
        raise HTTPException(status_code=500, detail="Failed to create user")

    # 5) Insert profile
    profile_insert = (
        supabase.table("profiles")
        .insert({
            "user_id": user_id,
            "first_name": request.first_name,
            "last_name": request.last_name,
            "full_name": full_name
        })
        .execute()
    )

    if not profile_insert.data:
        raise HTTPException(status_code=500, detail="Failed to create profile")

    return {
        "token": "mock_token",
        "user_id": user_id,
        "full_name": full_name if full_name else request.email,
        "user_type": "student"
    }


@app.post("/login")
async def login(request: LoginRequest):
    # 1) Find user by email
    user_response = (
        supabase.table("users")
        .select("*")
        .eq("email", request.email)
        .execute()
    )

    if not user_response.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = user_response.data[0]

    # 2) Verify password
    stored_password_hash = user.get("password_hash")

    if not stored_password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # ✅ Detect bcrypt hash format
    is_bcrypt = str(stored_password_hash).startswith(("$2a$", "$2b$", "$2y$"))

    if is_bcrypt:
        # bcrypt check
        try:
            ok = bcrypt.checkpw(
                request.password.encode("utf-8"),
                str(stored_password_hash).encode("utf-8")
            )
        except ValueError:
            # corrupted bcrypt string
            ok = False
    else:
        # fallback: plain text (old DB)
        ok = (request.password == stored_password_hash)

        # auto-upgrade to bcrypt after successful login
        if ok:
            new_hash = bcrypt.hashpw(
                request.password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")
            supabase.table("users").update({"password_hash": new_hash}).eq("id", user["id"]).execute()

    if not ok:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 3) Load profile to get full name
    profile_response = (
        supabase.table("profiles")
        .select("*")
        .eq("user_id", user["id"])
        .execute()
    )

    full_name = ""
    if profile_response.data:
        profile = profile_response.data[0]
        full_name = profile.get("full_name", "") or build_full_name(
            profile.get("first_name", ""),
            profile.get("last_name", "")
        )

    if not full_name:
        full_name = user.get("full_name") or str(request.email)

    return {
        "token": "mock_token",
        "user_id": user["id"],
        "full_name": full_name,
        "user_type": "student"
    }


@app.get("/profile/{user_id}")
async def get_profile(user_id: str):
    # Try profiles first
    profile_response = (
        supabase.table("profiles")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    if profile_response.data:
        profile = profile_response.data[0]
    else:
        # fallback: read from users
        user_response = (
            supabase.table("users")
            .select("*")
            .eq("id", user_id)
            .execute()
        )
        if not user_response.data:
            raise HTTPException(status_code=404, detail="User not found")

        user = user_response.data[0]

        # create a basic profile row (only columns that exist)
        supabase.table("profiles").insert({
            "user_id": user_id
        }).execute()

        profile = {"user_id": user_id}

        # full name fallback from users
        profile["full_name"] = user.get("full_name") or user.get("email") or ""

    # Build full_name if not in table
    if not profile.get("full_name"):
        first_name = profile.get("first_name", "")
        last_name = profile.get("last_name", "")
        name = f"{first_name} {last_name}".strip()
        if name:
            profile["full_name"] = name

    # Defaults
    profile["user_type"] = profile.get("user_type", "student")
    if "student_id" not in profile and "lecturer_id" not in profile:
        profile["student_id"] = f"S{user_id[:8].upper()}"

    return profile
