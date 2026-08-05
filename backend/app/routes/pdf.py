from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import save_pdf, extract_text
from services.rag_service import RAGService
from services.vector_db_service import VectorDBService   # We'll replace this with the actual DB later
router = APIRouter(prefix="/pdf", tags=["PDF"])
@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a PDF file."
            )
        file_path = save_pdf(file)
        text = extract_text(file_path)

        return {
            "message": "PDF uploaded successfully!",
            "filename": file.filename,
            "characters": len(text)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )