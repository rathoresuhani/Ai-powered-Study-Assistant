# 🤖 AI Study Assistant

An AI-powered study companion that helps students learn from their own study material. Upload a PDF, ask questions about its content, generate summaries, create flashcards, and practice with AI-generated tests.

The project combines **Retrieval-Augmented Generation (RAG)** with a modern React frontend and FastAPI backend.

---

## ✨ Features

### 📄 PDF Upload & Processing

* Upload study material in PDF format.
* Extract text from uploaded documents.
* Split documents into smaller chunks for efficient retrieval.
* Generate vector embeddings for document chunks.

### 💬 Ask Questions from Your PDF

* Ask questions based on the uploaded document.
* Uses semantic similarity search to retrieve relevant content.
* Generates answers using the retrieved context.
* Answers are grounded in the uploaded study material.

### 📝 AI Summarization

* Generate concise summaries from uploaded study material.
* Helps students quickly revise lengthy documents.

### 🃏 AI Flashcards

* Generate flashcards from uploaded study material.
* Useful for active recall and revision.

### 🧠 Practice Tests

* Generate AI-powered practice questions.
* Submit answers and receive a score.
* Helps students test their understanding before exams.

### 💭 AI Chat

* General AI chat functionality.
* Chat history is stored for authenticated users.

### 🔐 Authentication

* User authentication is implemented using Clerk.
* User-specific chat history is maintained.

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │   Vite + Tailwind    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐   ┌──────────┐   ┌──────────┐
          │   PDF    │   │  Qdrant  │   │PostgreSQL│
          │Processing│   │ Vector DB│   │ Database │
          └────┬─────┘   └────▲─────┘   └──────────┘
               │              │
               ▼              │
        ┌──────────────┐      │
        │   Ollama     │──────┘
        │ LLM + Embed  │
        └──────────────┘
```

---

## 🔄 RAG Pipeline

The PDF question-answering system follows a Retrieval-Augmented Generation pipeline:

```text
PDF Upload
    ↓
Text Extraction
    ↓
Text Chunking
    ↓
Generate Embeddings
    ↓
Store Vectors in Qdrant
    ↓
User Question
    ↓
Generate Question Embedding
    ↓
Similarity Search
    ↓
Retrieve Relevant Chunks
    ↓
Build Context
    ↓
Ollama LLM
    ↓
Answer
```

This allows the system to retrieve the most relevant parts of a document before generating an answer.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* shadcn/ui
* JavaScript

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic

### AI / GenAI

* Ollama
* Phi-3
* Nomic Embed Text
* Retrieval-Augmented Generation (RAG)

### Vector Database

* Qdrant

### Database

* PostgreSQL
* Neon

### Authentication

* Clerk

### Deployment

* Vercel
* Render
* Docker

---

## 📁 Project Structure

```text
smart-study-assistant/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── db/
│   │   └── ...
│   │
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rathoresuhani/smart-study-assistant.git

cd smart-study-assistant
```

---

# ⚙️ Backend Setup

### 2. Create a Virtual Environment

```bash
cd backend

python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

```env
DATABASE_URL=your_postgresql_connection_string

QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key

OLLAMA_URL=your_ollama_endpoint
OLLAMA_MODEL=phi3

CLERK_SECRET_KEY=your_clerk_secret_key
```

> Never commit your `.env` file or expose API keys and secret credentials publicly.

---

### 5. Install and Run Ollama

Install Ollama and make sure the required models are available.

```bash
ollama pull phi3
ollama pull nomic-embed-text
```

Start the Ollama server:

```bash
ollama serve
```

---

### 6. Start the FastAPI Backend

From the `backend` directory:

```bash
uvicorn main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🎨 Frontend Setup

### 7. Install Dependencies

Open a new terminal:

```bash
cd frontend

npm install
```

---

### 8. Configure Frontend Environment Variables

Create:

```text
frontend/.env
```

Add your Clerk publishable key and backend URL:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://127.0.0.1:8000
```

---

### 9. Start the Frontend

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 🧪 API Endpoints

The backend provides APIs for:

| Feature         | Endpoint                          |
| --------------- | --------------------------------- |
| General AI Chat | `POST /chat`                      |
| Chat History    | `GET /chat/history/{clerk_id}`    |
| PDF Upload      | `POST /pdf/upload`                |
| Ask Question    | RAG question endpoint             |
| Summary         | Document summary endpoint         |
| Flashcards      | Flashcard generation endpoint     |
| Practice Test   | Practice test generation endpoint |
| Submit Test     | Practice test submission endpoint |

For the complete API specification, run the backend and open:

```text
/docs
```

---

## 🔐 Security

* Environment variables are used for secrets and credentials.
* API keys are not stored directly in the source code.
* `.env` files should not be committed to Git.
* Authentication is handled through Clerk.

---

## 🌐 Deployment

### Frontend

The React frontend is deployed using Vercel.

### Backend

The FastAPI backend is containerized using Docker and deployed using Render.

### Vector Database

Qdrant Cloud is used for vector storage.

### AI Models

Ollama is used for local LLM inference and embeddings.

> The AI inference layer is designed around Ollama and is intended to run in an environment where the Ollama server is accessible to the backend.

---

## 🎯 Learning Goals

This project was built to gain practical experience with:

* Generative AI
* Retrieval-Augmented Generation (RAG)
* Vector databases
* Semantic search
* Embeddings
* LLM integration
* FastAPI
* React
* PostgreSQL
* Authentication
* Docker
* Cloud deployment
* API integration

---

## 🔮 Future Improvements

* Streaming AI responses
* Better document management
* Multiple-document RAG
* Improved citation/source display
* More customizable practice tests
* Conversation-aware RAG
* Production-ready remote LLM inference
* Improved evaluation of generated answers

---

## 👩‍💻 Author

**Suhani Rathore**

B.Tech Information Technology

GitHub:
https://github.com/rathoresuhani

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.
