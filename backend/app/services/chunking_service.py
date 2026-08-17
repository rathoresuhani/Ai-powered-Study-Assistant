from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_text(pages):
    """
    Splits each page into smaller overlapping chunks
    while preserving page numbers.
    """

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        length_function=len
    )

    chunks = []

    for page_data in pages:

        page_number = page_data["page"]
        page_text = page_data["text"]

        split_chunks = text_splitter.split_text(page_text)

        for chunk in split_chunks:

            chunks.append({
                "text": chunk,
                "page": page_number
            })

    return chunks