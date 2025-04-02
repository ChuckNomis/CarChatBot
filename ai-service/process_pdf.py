from langchain.schema import Document
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from PyPDF2 import PdfReader
from PIL import Image
import os
import re
import io
import fitz  # PyMuPDF
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def extract_text_from_page(page):
    """Try to extract readable text using PyPDF2."""
    try:
        text = page.extract_text()
        return re.sub(r'[ \t]+', ' ', text) if text else ""
    except:
        return ""


def ocr_pdf_page(pdf_path, page_number):
    """Fallback: Render PDF page to image using fitz and OCR it."""
    doc = fitz.open(pdf_path)
    page = doc.load_page(page_number - 1)  # 0-based index
    pix = page.get_pixmap(dpi=300)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    return pytesseract.image_to_string(img, lang='heb')


def process_pdf_and_create_index(pdf_path, book_id):
    """Extract, clean, and index text (with OCR fallback) from PDF."""
    reader = PdfReader(pdf_path)
    pages = []

    for i, page in enumerate(reader.pages):
        page_number = i + 1
        text = extract_text_from_page(page)

        if not text or len(text.strip()) < 30:
            print(f"[OCR] Falling back to OCR for page {page_number}")
            text = ocr_pdf_page(pdf_path, page_number)

        if text:
            pages.append(Document(
                page_content=text,
                metadata={"page": page_number}
            ))

        # Debug specific page (optional)
        if page_number == 271:
            print(f"\n--- PAGE 271 (raw text): ---\n{text[:1000]}\n")

    print(f"[DEBUG] Extracted {len(pages)} pages (including OCR)")

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    vector_store = FAISS.from_documents(pages, embeddings)

    index_path = f"vector_store/{book_id}"
    os.makedirs("vector_store", exist_ok=True)
    vector_store.save_local(index_path)
    print(f"[SAVED FAISS INDEX] {index_path}")
