import ollama
client = ollama.Client()
def generate_response(question: str, context: str):
    """
    Generate an answer using Phi3 based on the retrieved context.
    """
    prompt = f"""
You are an AI Study Assistant.
Answer ONLY from the given context.
If the answer is not present in the context, reply:
"I couldn't find this information in the uploaded document."
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