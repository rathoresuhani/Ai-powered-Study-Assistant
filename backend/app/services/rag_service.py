from services.chunking_service import chunk_text
from services.embedding_service import generate_embedding, generate_embeddings
from services.llm_service import generate_response
class RAGService:
    def __init__(self, vector_db):
        self.vector_db = vector_db

    def index_document(self, text, metadata=None):
        chunks = chunk_text(text)
        embeddings = generate_embeddings(chunks)
        self.vector_db.store_embeddings(
            embeddings,
            chunks,
            metadata
        )
        return len(chunks)
    def ask(self, question):
        query_embedding = generate_embedding(question)
        results = self.vector_db.similarity_search(query_embedding)
        context = "\n\n".join(
            [item["text"] for item in results]
        )
        answer = generate_response(question, context)
        return answer