import os
import re
from PyPDF2 import PdfReader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
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

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2")
    vector_store = FAISS.from_documents(documents, embeddings)

    index_path = f"vector_store/{book_id}"
    os.makedirs("vector_store", exist_ok=True)
    vector_store.save_local(index_path)
    print(f"[SAVED FAISS INDEX] {index_path}")
