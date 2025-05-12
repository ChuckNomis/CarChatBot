from langchain_community.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

custom_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
אתה יועץ רכב מומחה.
תענה רק לפי הספר הוראות שמצורף כpdf. 
אם אין תשובה ברורה במסמך, אמור 'אין תשובה במסמך'.
אל תנחש ואל תספק מידע ממקורות חיצוניים או ידע כללי.
שמור על שפה מקצועית וברורה, בלי להוסיף פרשנויות או המלצות אישיות.
ודא שהתשובות מדויקות ומבוססות על הטקסט בלבד.

בכל תשובה השתמש בתבנית הבאה:

✅ תשובה מהירה:
🔍 הסבר מפורט:
⚠️ אזהרה:
📖 למידע נוסף, ראה בעמודים XX–XX ו-XX–XX בספר הנהג.

הקשר:
{context}

שאלה:
{question}
"""
)


def get_answer_from_index(message, book_id):
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2")
    vectorstore = FAISS.load_local(
        f"vector_store/{book_id}",
        embeddings,
        allow_dangerous_deserialization=True
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(model_name="gpt-4o"),
        retriever=vectorstore.as_retriever(search_kwargs={"k": 4}),
        chain_type="stuff",
        chain_type_kwargs={"prompt": custom_prompt},
        return_source_documents=True
    )

    result = qa_chain({"query": message})
    return result['result']
