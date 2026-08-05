from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, index=True)
    message = Column(Text)
    response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, index=True)
    file_url = Column(String)
    title = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, index=True)
    question = Column(Text)
    answer = Column(Text)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, index=True)
    topic = Column(String)  # e.g. "DBMS", "React", "Photosynthesis"
    questions = Column(Text)  # store JSON string of MCQs
    score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)