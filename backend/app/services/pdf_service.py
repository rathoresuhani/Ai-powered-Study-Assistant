import os
from uuid import uuid4

import fitz


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_pdf(file):
    """
    Saves the uploaded PDF and returns its file path.
    """

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return file_path


def extract_text(file_path):
    """
    Extracts PDF text page-by-page.

    Returns:
    [
        {
            "page": 1,
            "text": "..."
        },
        ...
    ]
    """

    doc = fitz.open(file_path)

    pages = []

    for page_num, page in enumerate(doc, start=1):

        text = page.get_text().strip()

        if text:
            pages.append({
                "page": page_num,
                "text": text
            })

    doc.close()

    return pages


def generate_document_id():
    """
    Generates a unique ID for every uploaded PDF.
    """

    return str(uuid4())