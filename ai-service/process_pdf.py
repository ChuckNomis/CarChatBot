import os
import re
from pdfminer.high_level import extract_text
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS

def extract_text_from_pdf(pdf_path):
    return extract_text(pdf_path)

def process_pdf_and_create_index(pdf_path, book_id):
    text = extract_text_from_pdf(pdf_path)
    text = re.sub(r'[ \t]+', ' ', text)  
    print(f"[EXTRACTED TEXT SAMPLE]:\n{text[:1000]}")
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=800,
        chunk_overlap=300
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
