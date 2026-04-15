from fastapi import APIRouter, HTTPException
from app.core.database import supabase

router = APIRouter(tags=["Profile"])

@router.get("/profile/{user_id}")
async def get_profile(user_id: str):
    # 1. Try profiles table
    profile_response = (
        supabase.table("profiles")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    if profile_response.data:
        profile = profile_response.data[0]
    else:
        # 2. Fallback to users table
        user_response = (
            supabase.table("users")
            .select("*")
            .eq("id", user_id)
            .execute()
        )
        if not user_response.data:
            raise HTTPException(status_code=404, detail="User not found")

        user = user_response.data[0]

        # Create basic profile row
        supabase.table("profiles").insert({
            "user_id": user_id
        }).execute()

        profile = {"user_id": user_id}
        profile["full_name"] = user.get("full_name") or user.get("email") or ""

    # 3. Build full_name if missing
    if not profile.get("full_name"):
        first_name = profile.get("first_name", "")
        last_name = profile.get("last_name", "")
        name = f"{first_name} {last_name}".strip()
        if name:
            profile["full_name"] = name

    # 4. Defaults
    profile["user_type"] = profile.get("user_type", "student")
    if "student_id" not in profile and "lecturer_id" not in profile:
        profile["student_id"] = f"S{user_id[:8].upper()}"

    return profile