from app.services.chunking_service import chunk_text

from app.services.embedding_service import (
    generate_embedding,
    generate_embeddings
)

from app.services.llm_service import (
    generate_response,
    generate_summary,
    generate_flashcards,
    generate_practice_test
)


class RAGService:

    # Temporary storage for generated practice tests.
    # Later this can be moved to PostgreSQL.
    practice_tests = {}

    def __init__(self, vector_db):
        self.vector_db = vector_db

    # --------------------------------------------------
    # INDEX PDF
    # --------------------------------------------------

    def index_document(self, pages, metadata=None):

        chunks = chunk_text(pages)

        chunk_texts = [
            chunk["text"]
            for chunk in chunks
        ]

        embeddings = generate_embeddings(chunk_texts)

        self.vector_db.store_embeddings(
            embeddings=embeddings,
            chunks=chunks,
            metadata=metadata
        )

        return len(chunks)

    # --------------------------------------------------
    # ASK QUESTION
    # --------------------------------------------------

    def ask(self, question, document_id):

        query_embedding = generate_embedding(question)

        results = self.vector_db.similarity_search(
            query_embedding,
            document_id=document_id,
            top_k=5,
            score_threshold=0.40
        )

        if not results:
            return (
                "I couldn't find this information "
                "in the uploaded document."
            )

        context = "\n\n".join(
            [item["text"] for item in results]
        )

        answer = generate_response(
            question,
            context
        )

        return answer

    # --------------------------------------------------
    # SUMMARY
    # --------------------------------------------------

    def summarize_document(self, document_id):

        chunks = self.vector_db.get_document_chunks(
            document_id
        )

        if not chunks:
            return "I couldn't find this document."

        context = "\n\n".join(
            [chunk["text"] for chunk in chunks]
        )

        summary = generate_summary(
            context
        )

        return summary

    # --------------------------------------------------
    # FLASHCARDS
    # --------------------------------------------------

    def generate_flashcards_for_document(
        self,
        document_id
    ):

        chunks = self.vector_db.get_document_chunks(
            document_id
        )

        if not chunks:
            return {
                "flashcards": []
            }

        context = "\n\n".join(
            [chunk["text"] for chunk in chunks]
        )

        flashcards = generate_flashcards(
            context
        )

        return flashcards

    # --------------------------------------------------
    # PRACTICE TEST - GENERATE
    # --------------------------------------------------

    def generate_practice_test_for_document(
        self,
        document_id
    ):

        chunks = self.vector_db.get_document_chunks(
            document_id
        )

        if not chunks:
            return {
                "questions": []
            }

        context = "\n\n".join(
            [chunk["text"] for chunk in chunks]
        )

        practice_test = generate_practice_test(
            context
        )

        # Store the generated test so that we can
        # check the exact same questions later.
        self.practice_tests[document_id] = practice_test

        # Do NOT send correct answers to the frontend
        # before the student submits.
        questions_for_user = []

        for question in practice_test.get(
            "questions",
            []
        ):
            questions_for_user.append({
                "id": question["id"],
                "question": question["question"],
                "options": question["options"]
            })

        return {
            "questions": questions_for_user
        }

    # --------------------------------------------------
    # PRACTICE TEST - SUBMIT
    # --------------------------------------------------

    def submit_practice_test(
    self,
    document_id,
    answers
        ):
            practice_test = self.practice_tests.get(
                    document_id
                )

            if not practice_test:
                return {
                    "error": (
                        "No practice test found for this document. "
                        "Please generate a practice test first."
                    )
                }

            questions = practice_test.get(
                "questions",
                []
            )

            if not questions:
                return {
                    "error": "Practice test contains no questions."
                }

            results = []
            score = 0

            for question in questions:

                question_id = str(question["id"])

                options = question["options"]
                correct_answer = question["correct_answer"]
                explanation = question.get(
                    "explanation",
                    ""
                )

                # Student sends A/B/C/D
                user_option = answers.get(question_id)

                # Convert A/B/C/D -> actual option text
                option_index = {
                    "A": 0,
                    "B": 1,
                    "C": 2,
                    "D": 3
                }

                user_answer = None

                if user_option:
                    user_option = user_option.upper()

                    if user_option in option_index:
                        user_answer = options[
                            option_index[user_option]
                        ]

                is_correct = (
                    user_answer is not None
                    and user_answer == correct_answer
                )

                if is_correct:
                    score += 1

                results.append({
                    "id": question["id"],
                    "question": question["question"],
                    "options": options,
                    "selected_option": user_option,
                    "user_answer": user_answer,
                    "correct_answer": correct_answer,
                    "is_correct": is_correct,
                    "explanation": explanation
                })

            return {
                "document_id": document_id,
                "score": score,
                "total": len(questions),
                "results": results
            }