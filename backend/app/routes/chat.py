from fastapi import APIRouter
from pydantic import BaseModel
from app.db.database import SessionLocal
from app.db.models import Chat
from app.services.ollama import get_ai_response

router = APIRouter()
class ChatRequest(BaseModel):
    message: str
    clerk_id: str
@router.post("/chat")
def chat(req: ChatRequest):
    db = SessionLocal()
    try:
        ai_response = get_ai_response(req.message)
        chat_entry = Chat(
            clerk_id=req.clerk_id,
            message=req.message,
            response=ai_response
        )
        db.add(chat_entry)
        db.commit()
        chats = (
            db.query(Chat)
            .filter(Chat.clerk_id == req.clerk_id)
            .order_by(Chat.created_at.asc())
            .all()
        )
        if len(chats) > 7:
            db.delete(chats[0])
            db.commit()
        return {
            "user_message": req.message,
            "ai_response": ai_response
        }
    except Exception as e:
        print("ERROR:", e)
        raise e
    finally:
        db.close()
@router.get("/chat/history/{clerk_id}")
def get_chat_history(clerk_id: str):
    db = SessionLocal()
    try:
        chats = (
            db.query(Chat)
            .filter(Chat.clerk_id == clerk_id)
            .order_by(Chat.created_at.desc())
            .limit(7)
            .all()
        )

        return chats[::-1]

    except Exception as e:
        print("ERROR:", e)
        raise e

    finally:
        db.close()