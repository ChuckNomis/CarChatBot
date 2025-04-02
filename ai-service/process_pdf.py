import os
import re
from pdfminer.high_level import extract_text
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS


def extract_text_from_pdf(file_stream):
    text = extract_text(file_stream)  # directly from memory
    text = re.sub(r'[ \t]+', ' ', text)  # clean spaces, keep newlines
    return text


def process_pdf_and_create_index(file_stream, book_id):
    text = extract_text_from_pdf(file_stream)
    print(f"[EXTRACTED TEXT SAMPLE]:\n{text[:1000]}")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=3000,  # or even 4000
        chunk_overlap=200,
        separators=["\f"]  # PDF page break
    )
    chunks = text_splitter.split_text(text)
    print(f"[DEBUG] Extracted {len(chunks)} chunks")

    for i, c in enumerate(chunks[:3]):
        print(f"\n--- CHUNK {i+1} ---\n{c[:300]}")

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    vector_store = FAISS.from_texts(chunks, embeddings)

    index_path = f"vector_store/{book_id}"
    os.makedirs("vector_store", exist_ok=True)
    vector_store.save_local(index_path)
    print(f"[SAVED FAISS INDEX] {index_path}")
