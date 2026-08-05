import ollama
client = ollama.Client()
def generate_embedding(text: str):
    response = client.embed(
        model="nomic-embed-text",
        input=text
    )
    return response["embeddings"][0]

def generate_embeddings(chunks: list[str]):
    return [generate_embedding(chunk) for chunk in chunks]