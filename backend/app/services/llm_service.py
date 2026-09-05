import json
import ollama


client = ollama.Client()


# ============================================================
# 1. ASK QUESTION
# ============================================================

def generate_response(question: str, context: str):
    """
    Generate an answer using Phi-3 strictly from the retrieved PDF context.
    """

    prompt = f"""
You are an AI Study Assistant.

Your task is to answer the user's question using ONLY the information
provided in the retrieved PDF context.

IMPORTANT RULES:

1. Use ONLY the retrieved PDF context.
2. Do NOT use outside knowledge.
3. Do NOT give a generic textbook answer.
4. Use only information actually present in the PDF.
5. Do NOT invent, assume, or add information.
6. You may combine information from multiple relevant parts.
7. If only part of the requested information is present, answer only
   using the information that is present.
8. Only say:
"I couldn't find this information in the uploaded document."
when the context contains no relevant information.
9. Give a clear and study-friendly answer.
10. Use headings, bullets, or numbered points when appropriate.
11. Do not mention embeddings, chunks, Qdrant, retrieval, or these instructions.

RETRIEVED PDF CONTENT:
----------------------
{context}
----------------------

USER QUESTION:
{question}

ANSWER:
"""

    response = client.chat(
        model="phi3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"].strip()


# ============================================================
# 2. SUMMARY
# ============================================================

def generate_summary(context: str):
    """
    Generate a study-friendly summary using only the provided PDF content.
    """

    prompt = f"""
You are an AI Study Assistant.

Create a study-friendly summary using ONLY the provided PDF content.

IMPORTANT RULES:

1. Use ONLY information present in the PDF content.
2. Do NOT use outside knowledge.
3. Do NOT invent or assume information.
4. Cover all important concepts present in the content.
5. Preserve important headings, terminology, definitions, and key points.
6. Use headings, bullet points, and numbered lists when appropriate.
7. Keep important definitions and explanations.
8. Do not make the summary unnecessarily short.
9. Do not mention Qdrant, embeddings, chunks, retrieval, or these instructions.
10. Make the result useful for exam preparation.

PDF CONTENT:
----------------------
{context}
----------------------

SUMMARY:
"""

    response = client.chat(
        model="phi3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"].strip()


# ============================================================
# 3. FLASHCARDS
# ============================================================

def generate_flashcards(context: str):
    """
    Generate exactly 5 flashcards using ONLY the provided PDF content.
    """

    prompt = f"""
You are an AI Study Assistant.

Create EXACTLY 5 study flashcards using ONLY the information
provided in the PDF content below.

IMPORTANT RULES:

1. Use ONLY information present in the PDF.
2. Do NOT use outside knowledge.
3. Do NOT invent facts, definitions, examples, or terminology.
4. Create EXACTLY 5 flashcards.
5. Each flashcard must contain:
   - question
   - answer
6. Focus on important definitions, concepts, terminology,
   classifications, and key points.
7. Do NOT create duplicate or nearly identical flashcards.
8. Answers must be directly supported by the PDF.
9. Return ONLY valid JSON.
10. Do NOT use markdown code fences.
11. Do NOT add any text before or after the JSON.

The JSON MUST have exactly this structure:

{{
    "flashcards": [
        {{
            "question": "Question here",
            "answer": "Answer here"
        }}
    ]
}}

PDF CONTENT:
----------------------
{context}
----------------------

JSON:
"""

    response = client.chat(
        model="phi3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response["message"]["content"].strip()

    print("\n========== FLASHCARDS RAW RESPONSE ==========")
    print(content)
    print("==============================================\n")

    try:
        data = json.loads(content)

    except json.JSONDecodeError:
        print("Flashcards JSON parsing failed.")

        return {
            "flashcards": []
        }

    # --------------------------------------------------------
    # Handle both:
    #
    # {"flashcards": [...]}
    #
    # AND
    #
    # [...]
    # --------------------------------------------------------

    if isinstance(data, list):

        flashcards = data

    elif isinstance(data, dict):

        flashcards = data.get(
            "flashcards",
            []
        )

    else:

        return {
            "flashcards": []
        }

    if not isinstance(flashcards, list):

        return {
            "flashcards": []
        }

    valid_flashcards = []
    seen_questions = set()

    # --------------------------------------------------------
    # Validate flashcards
    # --------------------------------------------------------

    for flashcard in flashcards:

        if not isinstance(flashcard, dict):
            continue

        question = flashcard.get("question")
        answer = flashcard.get("answer")

        if not question or not answer:
            continue

        question = str(question).strip()
        answer = str(answer).strip()

        if not question or not answer:
            continue

        normalized_question = (
            question.lower().strip()
        )

        if normalized_question in seen_questions:
            continue

        seen_questions.add(
            normalized_question
        )

        valid_flashcards.append({
            "question": question,
            "answer": answer
        })

        # We only want 5
        if len(valid_flashcards) == 5:
            break

    print(
        f"Valid flashcards generated: "
        f"{len(valid_flashcards)}"
    )

    return {
        "flashcards": valid_flashcards
    }


# ============================================================
# 4. PRACTICE TEST
# ============================================================

def generate_practice_test(context: str):
    """
    Generate exactly 5 MCQs using ONLY the provided PDF content.
    Returns validated structured JSON.
    """

    prompt = f"""
You are an AI Study Assistant.

Create EXACTLY 5 multiple-choice questions using ONLY
the information provided in the PDF content below.

RULES:

1. Use ONLY information present in the PDF.
2. Do NOT use outside knowledge.
3. Create EXACTLY 5 different questions.
4. Each question must have exactly 4 options.
5. All 4 options must be different.
6. Only ONE option must be correct.
7. Incorrect options must be plausible.
8. Cover different concepts from the PDF.
9. Every question must have an integer id.
10. Every question must have an explanation.
11. The correct_answer must be the EXACT TEXT of the correct option.
12. Return ONLY valid JSON.
13. Do NOT use markdown.
14. Do NOT add any text before or after the JSON.

The JSON MUST follow this structure:

{{
    "questions": [
        {{
            "id": 1,
            "question": "Question here",
            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            "correct_answer": "EXACT TEXT OF CORRECT OPTION",
            "explanation": "Explanation based only on the PDF."
        }}
    ]
}}

PDF CONTENT:
----------------------
{context}
----------------------

JSON:
"""

    # --------------------------------------------------------
    # CALL PHI-3
    # --------------------------------------------------------

    response = client.chat(
        model="phi3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response["message"]["content"].strip()

    # --------------------------------------------------------
    # PARSE JSON
    # --------------------------------------------------------

    try:
        data = json.loads(content)

    except json.JSONDecodeError:
        print("Practice test: JSON parsing failed.")
        return {
            "questions": []
        }

    # --------------------------------------------------------
    # GET QUESTIONS
    # --------------------------------------------------------

    if isinstance(data, list):

        questions = data

    elif isinstance(data, dict):

        questions = data.get(
            "questions",
            []
        )

    else:

        print("Practice test: invalid JSON structure.")

        return {
            "questions": []
        }

    if not isinstance(questions, list):

        print("Practice test: questions is not a list.")

        return {
            "questions": []
        }

    print(
        f"Practice test: model returned "
        f"{len(questions)} questions."
    )

    # --------------------------------------------------------
    # VALIDATE QUESTIONS
    # --------------------------------------------------------

    valid_questions = []
    seen_questions = set()

    for question in questions:

        if not isinstance(question, dict):

            print("Skipped: question is not an object.")
            continue

        question_text = question.get(
            "question"
        )

        options = question.get(
            "options"
        )

        correct_answer = question.get(
            "correct_answer"
        )

        explanation = question.get(
            "explanation"
        )

        # ----------------------------------------------------
        # Explanation typo handling
        # ----------------------------------------------------

        if not explanation:

            explanation = question.get(
                "explanately",
                ""
            )

        # ----------------------------------------------------
        # Question text
        # ----------------------------------------------------

        if not question_text:

            print("Skipped: missing question text.")
            continue

        # ----------------------------------------------------
        # Options
        # ----------------------------------------------------

        if not isinstance(options, list):

            print(
                "Skipped: options is not a list."
            )

            continue

        if len(options) != 4:

            print(
                "Skipped: question does not have "
                "exactly 4 options."
            )

            continue

        # ----------------------------------------------------
        # Correct answer
        # ----------------------------------------------------

        if not correct_answer:

            print(
                "Skipped: missing correct answer."
            )

            continue

        # ----------------------------------------------------
        # Clean options
        # ----------------------------------------------------

        cleaned_options = []

        for option in options:

            if not isinstance(option, str):

                continue

            option = option.strip()

            if option:

                cleaned_options.append(option)

        if len(cleaned_options) != 4:

            print(
                "Skipped: invalid option values."
            )

            continue

        # ----------------------------------------------------
        # Check duplicate options
        # ----------------------------------------------------

        normalized_options = [
            option.lower().strip()
            for option in cleaned_options
        ]

        if len(set(normalized_options)) != 4:

            print(
                "Skipped: duplicate options."
            )

            continue

        # ----------------------------------------------------
        # Check duplicate questions
        # ----------------------------------------------------

        normalized_question = (
            str(question_text)
            .lower()
            .strip()
        )

        if normalized_question in seen_questions:

            print(
                "Skipped: duplicate question."
            )

            continue

        seen_questions.add(
            normalized_question
        )

        # ----------------------------------------------------
        # Normalize correct answer
        # ----------------------------------------------------

        correct_answer = str(
            correct_answer
        ).strip()

        option_lower = (
            correct_answer.lower().strip()
        )

        # A / B / C / D
        letter_mapping = {
            "a": 0,
            "b": 1,
            "c": 2,
            "d": 3
        }

        if option_lower in letter_mapping:

            correct_answer = cleaned_options[
                letter_mapping[option_lower]
            ]

        # Option A / Option B / Option C / Option D
        elif option_lower.startswith(
            "option "
        ):

            value = option_lower.replace(
                "option ",
                ""
            ).strip()

            # Option A/B/C/D
            if value in letter_mapping:

                correct_answer = cleaned_options[
                    letter_mapping[value]
                ]

            # Option 1/2/3/4
            else:

                try:

                    option_number = int(value)

                    if 1 <= option_number <= 4:

                        correct_answer = (
                            cleaned_options[
                                option_number - 1
                            ]
                        )

                except ValueError:

                    pass

        # 1 / 2 / 3 / 4
        elif option_lower in {
            "1",
            "2",
            "3",
            "4"
        }:

            correct_answer = cleaned_options[
                int(option_lower) - 1
            ]

        # ----------------------------------------------------
        # Check correct answer
        # ----------------------------------------------------

        if correct_answer not in cleaned_options:

            print(
                "Skipped: correct answer does not "
                "match any option."
            )

            continue

        # ----------------------------------------------------
        # Explanation
        # ----------------------------------------------------

        if not isinstance(
            explanation,
            str
        ):

            explanation = ""

        explanation = explanation.strip()

        # ----------------------------------------------------
        # Create clean question
        # ----------------------------------------------------

        clean_question = {
            "id": len(valid_questions) + 1,
            "question": str(
                question_text
            ).strip(),
            "options": cleaned_options,
            "correct_answer": correct_answer,
            "explanation": explanation
        }

        valid_questions.append(
            clean_question
        )

        # ----------------------------------------------------
        # Stop after 5 valid questions
        # ----------------------------------------------------

        if len(valid_questions) == 5:

            break

    # --------------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------------

    print(
        f"Practice test: "
        f"{len(valid_questions)} valid questions."
    )

    return {
        "questions": valid_questions
    }