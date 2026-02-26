from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from core.database import supabase
from core.security import get_current_user
from core.config import settings

router = APIRouter(prefix="/lectures", tags=["lectures"])

# Pydantic models for requests/responses
class LectureResponse(BaseModel):
    id: str
    title: str
    course_code: str
    lecturer_id: str
    lecturer_name: str
    date: str
    start_time: str
    end_time: str
    room: str
    batch_ids: List[str]
    status: str  # 'scheduled', 'cancelled', 'completed'
    cancellation_reason: Optional[str] = None
    cancelled_by: Optional[str] = None
    cancelled_at: Optional[str] = None

class CancelLectureRequest(BaseModel):
    lecture_id: str
    reason: str

class CancelLectureResponse(BaseModel):
    success: bool
    message: str
    lecture: Optional[LectureResponse] = None

@router.post("/cancel", response_model=CancelLectureResponse)
async def cancel_lecture(
    request: CancelLectureRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Cancel a lecture with reason
    Only lecturers can cancel their own lectures
    """
    try:
        # 1. Check if lecture exists
        lecture = supabase.table("lectures").select("*").eq("id", request.lecture_id).execute()
        
        if not lecture.data:
            raise HTTPException(status_code=404, detail="Lecture not found")
        
        lecture_data = lecture.data[0]
        
        # 2. Authorization check - only the assigned lecturer can cancel
        if lecture_data["lecturer_id"] != current_user["id"]:
            raise HTTPException(
                status_code=403, 
                detail="You can only cancel your own lectures"
            )
        
        # 3. Check if lecture can be cancelled (not already cancelled/completed)
        if lecture_data["status"] == "cancelled":
            raise HTTPException(
                status_code=400, 
                detail="Lecture is already cancelled"
            )
        
        if lecture_data["status"] == "completed":
            raise HTTPException(
                status_code=400, 
                detail="Cannot cancel completed lectures"
            )
        
        # 4. Check if lecture date is in the past
        lecture_date = datetime.fromisoformat(lecture_data["date"])
        if lecture_date.date() < datetime.now().date():
            raise HTTPException(
                status_code=400, 
                detail="Cannot cancel past lectures"
            )
        
        # 5. Update lecture status to cancelled
        update_data = {
            "status": "cancelled",
            "cancellation_reason": request.reason,
            "cancelled_by": current_user["id"],
            "cancelled_at": datetime.now().isoformat()
        }
        
        updated = supabase.table("lectures").update(update_data).eq("id", request.lecture_id).execute()
        
        if not updated.data:
            raise HTTPException(status_code=500, detail="Failed to cancel lecture")
        
        # 6. Log the cancellation for audit
        audit_data = {
            "lecture_id": request.lecture_id,
            "cancelled_by": current_user["id"],
            "reason": request.reason,
            "cancelled_at": datetime.now().isoformat()
        }
        supabase.table("lecture_cancellations").insert(audit_data).execute()
        
        # 7. Return success response with updated lecture
        cancelled_lecture = updated.data[0]
        
        return CancelLectureResponse(
            success=True,
            message="Lecture cancelled successfully",
            lecture=cancelled_lecture
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cancelling lecture: {str(e)}")

@router.get("/{lecture_id}/cancellation-status")
async def get_cancellation_status(
    lecture_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get cancellation details for a lecture"""
    try:
        # Check if lecture exists
        lecture = supabase.table("lectures").select("*").eq("id", lecture_id).execute()
        
        if not lecture.data:
            raise HTTPException(status_code=404, detail="Lecture not found")
        
        lecture_data = lecture.data[0]
        
        # If not cancelled, return simple status
        if lecture_data["status"] != "cancelled":
            return {
                "is_cancelled": False,
                "status": lecture_data["status"]
            }
        
        # Get cancellation details from audit table
        cancellation = supabase.table("lecture_cancellations")\
            .select("*")\
            .eq("lecture_id", lecture_id)\
            .order("cancelled_at", desc=True)\
            .limit(1)\
            .execute()
        
        cancellation_details = cancellation.data[0] if cancellation.data else {}
        
        # Get cancelled by user name
        cancelled_by_user = None
        if cancellation_details.get("cancelled_by"):
            user = supabase.table("profiles")\
                .select("full_name")\
                .eq("user_id", cancellation_details["cancelled_by"])\
                .execute()
            if user.data:
                cancelled_by_user = user.data[0].get("full_name")
        
        return {
            "is_cancelled": True,
            "status": "cancelled",
            "cancellation_reason": lecture_data.get("cancellation_reason"),
            "cancelled_at": lecture_data.get("cancelled_at"),
            "cancelled_by": cancelled_by_user,
            "cancelled_by_id": lecture_data.get("cancelled_by")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking cancellation: {str(e)}")
