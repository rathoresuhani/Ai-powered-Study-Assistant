from langchain_text_splitters import RecursiveCharacterTextSplitter
def chunk_text(text: str):
    """
    Splits text into smaller overlapping chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        length_function=len
    )
    chunks = text_splitter.split_text(text)

    return chunks