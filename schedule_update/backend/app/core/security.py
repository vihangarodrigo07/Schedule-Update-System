from fastapi import HTTPException, Header
from app.core.database import supabase
from typing import Optional

async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Token")

    token = authorization.replace("Bearer ", "")

    try:
        # Ask Supabase to verify the user from the token
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            raise Exception("User not found")
            
        return user_response.user.id

    except Exception as e:
        # Supabase throws an error if the token is expired
        print(f"Auth Error: {e}") # Debugging
        raise HTTPException(
            status_code=401, 
            detail="Session Expired", # Frontend listens for this
            headers={"WWW-Authenticate": "Bearer"},
        )