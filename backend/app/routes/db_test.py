from fastapi import APIRouter
from app.db.database import engine

router = APIRouter()

@router.get("/db-test")
def db_test():
    try:
        conn = engine.connect()
        conn.close()
        return {"status": "success", "message": "Database connected 🚀"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}