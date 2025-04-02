from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings


def get_answer_from_index(message, book_id):
    print(f"[RAG] Getting index for: {book_id}")

    vectorstore = FAISS.load_local(
        f"vector_store/{book_id}",
        OpenAIEmbeddings(model="text-embedding-3-large"),
        allow_dangerous_deserialization=True
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 8})

    # Prompt template for Hebrew structured answers
    prompt_template = PromptTemplate.from_template("""
אתה יועץ רכב מומחה. ענה על השאלה אך ורק לפי המידע שמופיע בקטעים למטה.
אם אין תשובה מדויקת, כתוב: "לא מצאתי תשובה במסמך המצורף".

🔎 השאלה: {question}
=========
📖 קטעים רלוונטיים מהמסמך:
{context}
=========
🛠 תשובה מפורטת בעברית:
""")

    chain = ConversationalRetrievalChain.from_llm(
        llm=ChatOpenAI(model_name="gpt-4o", temperature=0.2),
        retriever=retriever,
        return_source_documents=True,
        combine_docs_chain_kwargs={"prompt": prompt_template}
    )

    try:
        result = chain({"question": message, "chat_history": []})
        answer = result["answer"]
        sources = result["source_documents"]

        # Get unique page numbers
        pages = sorted({doc.metadata.get("page")
                       for doc in sources if doc.metadata.get("page")})
        page_info = f"\n\n📄 מקור: עמודים {', '.join(map(str, pages))}" if pages else ""

        return answer + page_info

    except Exception as e:
        print(f"[GPT ERROR]: {e}")
        return "❌ GPT נכשל בלספק תשובה"
