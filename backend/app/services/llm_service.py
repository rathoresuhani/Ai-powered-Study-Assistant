import ollama
client = ollama.Client()
def generate_response(question: str, context: str):
    """
    Generate an answer using Phi3 based on the retrieved context.
    """
    prompt = f"""
You are an AI Study Assistant.

You must answer ONLY using the provided context.

Rules:
1. Do NOT use your own knowledge.
2. Do NOT make assumptions.
3. If the answer is not completely present in the context, reply exactly:
"I couldn't find this information in the uploaded document."
4. Keep the answer concise and accurate.
5. Do not add extra explanations beyond the context.

Context:
{context}

Question:
{question}

Answer:
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
    return response["message"]["content"]