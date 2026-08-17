from pydantic import BaseModel


class QuestionRequest(BaseModel):
    question: str
    document_id: str


class SummaryRequest(BaseModel):
    document_id: str


class FlashcardsRequest(BaseModel):
    document_id: str


class PracticeTestSubmitRequest(BaseModel):
    document_id: str
    answers: dict[str, str]