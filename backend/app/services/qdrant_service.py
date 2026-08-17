from uuid import uuid4

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue
)

from app.services.vector_db_service import VectorDBService


class QdrantService(VectorDBService):

    COLLECTION_NAME = "study_documents"

    def __init__(self):
        self.client = QdrantClient(
            host="localhost",
            port=6333
        )

        self._create_collection()

    def _create_collection(self):
        """Create the collection if it does not already exist."""

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

            print(
                f"Collection '{self.COLLECTION_NAME}' created."
            )

        else:
            print(
                f"Collection '{self.COLLECTION_NAME}' already exists."
            )

    def store_embeddings(
        self,
        embeddings,
        chunks,
        metadata=None
    ):
        """Store embeddings along with chunk and document metadata."""

        points = []

        for embedding, chunk in zip(embeddings, chunks):

            payload = {
                "text": chunk["text"],
                "page": chunk["page"]
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

        if points:
            self.client.upsert(
                collection_name=self.COLLECTION_NAME,
                points=points
            )

    def similarity_search(
        self,
        embedding,
        document_id,
        top_k=10,
        score_threshold=0.40
    ):
        """
        Search only inside the selected document.

        Results below the similarity threshold are ignored.
        """

        results = self.client.query_points(
            collection_name=self.COLLECTION_NAME,
            query=embedding,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchValue(
                            value=document_id
                        )
                    )
                ]
            ),
            limit=top_k,
            score_threshold=score_threshold
        ).points

        output = []

        for result in results:

            output.append({
                "text": result.payload["text"],
                "score": result.score,
                "metadata": result.payload
            })

        return output

    def get_document_chunks(self, document_id):
        """
        Retrieve all chunks belonging to one document.

        Used for features such as:
        - PDF summarization
        - Flashcard generation
        - Practice test generation
        """

        results = self.client.scroll(
            collection_name=self.COLLECTION_NAME,
            scroll_filter=Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchValue(
                            value=document_id
                        )
                    )
                ]
            ),
            limit=1000,
            with_payload=True,
            with_vectors=False
        )[0]

        chunks = []

        for result in results:

            chunks.append({
                "text": result.payload["text"],
                "page": result.payload["page"],
                "metadata": result.payload
            })

        # Keep PDF order
        chunks.sort(
            key=lambda item: item["page"]
        )

        return chunks

    def delete_document(self, document_id):
        """Delete all vectors belonging to a document."""

        self.client.delete(
            collection_name=self.COLLECTION_NAME,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchValue(
                            value=document_id
                        )
                    )
                ]
            )
        )

        return True