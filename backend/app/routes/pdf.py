from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas.question import QuestionRequest
from app.schemas.question import SummaryRequest
from app.schemas.question import FlashcardsRequest

from app.services.pdf_service import save_pdf, extract_text
from app.services.rag_service import RAGService
from app.services.qdrant_service import QdrantService
from app.schemas.question import PracticeTestSubmitRequest


router = APIRouter(
    prefix="/pdf",
    tags=["PDF"]
)


# ============================================================
# 1. UPLOAD PDF
# ============================================================

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    try:

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a PDF file."
            )

        file_path = save_pdf(file)

        pages = extract_text(file_path)

        if not pages:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from this PDF."
            )

        document_id = str(uuid4())

        metadata = {
            "document_id": document_id,
            "filename": file.filename
        }

        vector_db = QdrantService()
        rag = RAGService(vector_db)

        total_chunks = rag.index_document(
            pages,
            metadata=metadata
        )

        total_characters = sum(
            len(page["text"])
            for page in pages
        )

        return {
            "message": "PDF indexed successfully!",
            "document_id": document_id,
            "filename": file.filename,
            "pages": len(pages),
            "characters": total_characters,
            "chunks": total_chunks
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# 2. ASK QUESTION
# ============================================================

@router.post("/ask")
async def ask_question(request: QuestionRequest):

    try:

        vector_db = QdrantService()
        rag = RAGService(vector_db)

        answer = rag.ask(
            request.question,
            request.document_id
        )

        return {
            "question": request.question,
            "document_id": request.document_id,
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# 3. SUMMARY
# ============================================================

@router.post("/summary")
async def summarize_pdf(request: SummaryRequest):

    try:

        vector_db = QdrantService()
        rag = RAGService(vector_db)

        summary = rag.summarize_document(
            request.document_id
        )

        return {
            "document_id": request.document_id,
            "summary": summary
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# 4. FLASHCARDS
# ============================================================

@router.post("/flashcards")
async def generate_flashcards(request: FlashcardsRequest):

    try:

        vector_db = QdrantService()
        rag = RAGService(vector_db)

        flashcards = rag.generate_flashcards_for_document(
            request.document_id
        )

        return {
            "document_id": request.document_id,
            "flashcards": flashcards
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# 5. PRACTICE TEST
# ============================================================

@router.post("/practice-test")
async def generate_practice_test(request: SummaryRequest):

    try:

        vector_db = QdrantService()
        rag = RAGService(vector_db)

        practice_test = rag.generate_practice_test_for_document(
            request.document_id
        )

        return {
            "document_id": request.document_id,
            "practice_test": practice_test
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ============================================================
# 6. SUBMIT PRACTICE TEST
# ============================================================

@router.post("/practice-test/submit")
async def submit_practice_test(
    request: PracticeTestSubmitRequest
):

    try:

        vector_db = QdrantService()
        rag = RAGService(vector_db)

        result = rag.submit_practice_test(
            document_id=request.document_id,
            answers=request.answers
        )

        if "error" in result:
            raise HTTPException(
                status_code=404,
                detail=result["error"]
            )

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )