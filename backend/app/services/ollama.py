import os
import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL")
MODEL_NAME = os.getenv("OLLAMA_MODEL")


def get_ai_response(prompt: str) -> str:
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()

        data = response.json()
        return data["response"]

    except requests.exceptions.ConnectionError:
        raise Exception("Ollama server is not running. Start it using 'ollama serve'.")

    except requests.exceptions.Timeout:
        raise Exception("Ollama took too long to respond.")

    except requests.exceptions.HTTPError as e:
        raise Exception(f"Ollama HTTP Error: {e}")

    except Exception as e:
        raise Exception(f"Unexpected Ollama Error: {e}")