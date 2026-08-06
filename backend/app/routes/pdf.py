from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.question import QuestionRequest
from app.services.pdf_service import save_pdf, extract_text
from app.services.rag_service import RAGService
from app.services.qdrant_service import QdrantService

router = APIRouter(prefix="/pdf", tags=["PDF"])


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a PDF file."
            )

        # Save PDF
        file_path = save_pdf(file)

        # Extract text
        text = extract_text(file_path)

        # Initialize Qdrant and RAG
        vector_db = QdrantService()
        rag = RAGService(vector_db)

        # Index the document
        total_chunks = rag.index_document(
            text,
            metadata={
                "filename": file.filename
            }
        )

        return {
            "message": "PDF indexed successfully!",
            "filename": file.filename,
            "characters": len(text),
            "chunks": total_chunks
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        vector_db = QdrantService()
        rag = RAGService(vector_db)

        answer = rag.ask(request.question)

        return {
            "question": request.question,
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )