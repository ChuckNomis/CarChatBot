import os
import re
from PyPDF2 import PdfReader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter


def extract_text_from_page(page):
    try:
        text = page.extract_text()
        return re.sub(r'[ \t]+', ' ', text) if text else ""
    except:
        return ""


def process_pdf_and_create_index(pdf_path, book_id):
    reader = PdfReader(pdf_path)
    text = ""

    for page in reader.pages:
        page_text = extract_text_from_page(page)
        text += page_text + "\n"

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = splitter.split_text(text)

    documents = [
        Document(page_content=chunk, metadata={"source": f"chunk-{i}"})
        for i, chunk in enumerate(chunks)
    ]

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    vector_store = FAISS.from_documents(documents, embeddings)

    index_path = f"vector_store/{book_id}"
    os.makedirs("vector_store", exist_ok=True)
    vector_store.save_local(index_path)
    print(f"[SAVED FAISS INDEX] {index_path}")
