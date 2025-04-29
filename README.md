🚗 CarChatBot

An AI-powered chatbot that lets users upload car manuals (PDFs) and ask questions about them in Hebrew or English. The bot uses GPT + vector search (FAISS) to answer questions based on the actual manual content — not guesses.

📁 Project Structure

CARCHATBOT/
├── ai-service/ # Python service: PDF vectorization + RAG
│ ├── app.py
│ ├── chat_rag.py
│ ├── process_pdf.py
│ └── vector_store/
│
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── App.js
│ ├── api.js
│ └── components/
│
├── server/ # Node.js backend (API + MongoDB)
│ ├── app.js
│ ├── config/
│ ├── controllers/
│ ├── models/
│ └── routes/
│
├── .env # Shared environment file
└── .gitignore

⚙️ .env Format

Create a `.env` file in the root of the project:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
OPENAI_API_KEY=sk-...

🔒 Keep your `.env` file secret and never commit it to Git.

🚀 Getting Started

1. Clone the repo

git clone https://github.com/yourusername/CarChatBot.git
cd CarChatBot

2. Install & Run Servers

▶️ Node.js API (MongoDB + manual upload endpoints)
cd server
npm install
node app.js

Runs on: http://localhost:5000

🧠 Python AI Service (LangChain + FAISS + GPT)
cd ai-service
pip install -r requirements.txt # or install manually
python app.py

Runs on: http://localhost:5001

⚛️ React Frontend
cd client
npm install
npm start

Runs on: http://localhost:3000

💬 How It Works

1. Upload a car manual (PDF) via the UI
2. The file is saved to the backend
3. The AI service:
   - Extracts the text
   - Splits it into chunks
   - Converts it to vectors using OpenAI
   - Saves a FAISS index
4. You can now ask questions — and get real answers based on your file only.

📦 Technologies Used

- Frontend: React + Axios
- Backend API: Node.js + Express + MongoDB
- AI Service: Python + FastAPI/Flask, LangChain, FAISS, OpenAI API
- Vector Search: FAISS
- PDF Parsing: PyMuPDF, Tesseract (for OCR)
- Chat: GPT-4o via OpenAI
- Languages: Hebrew 🇮🇱 + English 🇬🇧

📄 License

MIT — use this freely, just give credit if it helps!

🙋‍♂️ Author

Made by Nadav Simon
