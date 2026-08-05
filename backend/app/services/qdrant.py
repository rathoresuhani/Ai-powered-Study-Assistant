from uuid import uuid4

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)
from services.vector_db_service import VectorDBService
class QdrantService(VectorDBService):

    COLLECTION_NAME = "study_documents"

    def __init__(self):
        self.client = QdrantClient(
            host="localhost",
            port=6333
        )

        self._create_collection()

    def _create_collection(self):
        """
        Creates the collection if it does not already exist.
        """

        collections = self.client.get_collections().collections
        collection_names = [c.name for c in collections]

        if self.COLLECTION_NAME not in collection_names:

            self.client.create_collection(
                collection_name=self.COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=768,
                    distance=Distance.COSINE
                )
            )

            print(f"Collection '{self.COLLECTION_NAME}' created.")

        else:
            print(f"Collection '{self.COLLECTION_NAME}' already exists.")

    def store_embeddings(self, embeddings, chunks, metadata=None):
        """
        Store embeddings with their corresponding text.
        """

        points = []

        for embedding, chunk in zip(embeddings, chunks):

            payload = {
                "text": chunk
            }

            if metadata:
                payload.update(metadata)

            points.append(
                PointStruct(
                    id=str(uuid4()),
                    vector=embedding,
                    payload=payload
                )
            )

        self.client.upsert(
            collection_name=self.COLLECTION_NAME,
            points=points
        )

    def similarity_search(self, embedding, top_k=5):
        """
        Search for the most similar chunks.
        """

        results = self.client.search(
            collection_name=self.COLLECTION_NAME,
            query_vector=embedding,
            limit=top_k
        )

        output = []

        for result in results:

            output.append({
                "text": result.payload["text"],
                "score": result.score,
                "metadata": result.payload
            })

        return output

    def delete_document(self, document_id):
        """
        Placeholder.
        Will implement later when we support deleting PDFs.
        """
        pass