from flask import Flask, request, jsonify
from process_file import process_file_and_create_index
from chat_rag import get_answer_from_index
from dotenv import load_dotenv
import os
import tempfile
load_dotenv(dotenv_path='../.env')

app = Flask(__name__)


@app.route('/process', methods=['POST'])
def process():
    file = request.files['file']
    book_id = request.form['bookId']

    try:
        # Save to temporary file for processing (preserve extension)
        ext = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        # Pass path to processor
        process_file_and_create_index(tmp_path, book_id)

        # Optionally delete the temp file manually after
        os.remove(tmp_path)

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
