from flask import Flask, request, jsonify
from process_pdf import process_pdf_and_create_index
from chat_rag import get_answer_from_index
from dotenv import load_dotenv

load_dotenv(dotenv_path='../.env')

app = Flask(__name__)


@app.route('/process', methods=['POST'])
def process():
    file = request.files['file']
    book_id = request.form['bookId']

    try:
        # ✅ Send the in-memory file stream
        process_pdf_and_create_index(file.stream, book_id)
        return jsonify({"message": "Book processed and indexed"}), 200
    except Exception as e:
        print(f"[ERROR in processing]: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/rag', methods=['POST'])
def rag():
    data = request.get_json()
    message = data['message']
    book_id = data['bookId']
    try:
        answer = get_answer_from_index(message, book_id)
        return jsonify({"response": answer}), 200
    except Exception as e:
        print(f"[ERROR in RAG]: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5001)
