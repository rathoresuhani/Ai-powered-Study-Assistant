from abc import ABC, abstractmethod
class VectorDBService(ABC):
    @abstractmethod
    def store_embeddings(self, embeddings, chunks, metadata):
        pass
    @abstractmethod
    def similarity_search(self, embedding, top_k=5):
        pass
    @abstractmethod
    def delete_document(self, document_id):
        pass