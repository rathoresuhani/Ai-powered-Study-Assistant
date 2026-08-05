from fastapi import FastAPI
from app.routes.health import router as health_router
from app.db.database import Base, engine
from app.db import models
from app.routes.db_test import router as db_router
from app.routes.chat import router as chat_router
from app.routes.pdf import router as pdf_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
app.include_router(db_router)
app.include_router(chat_router)
app.include_router(pdf_router)
#@app.include_router(health_router)
@app.get("/")
def root():
  return {"message": "AI Study Assistant Backend Running 🚀"}