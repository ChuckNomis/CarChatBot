from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate


def get_answer_from_index(message, book_id):
    try:
        index_path = f"vector_store/{book_id}"
        embeddings = OpenAIEmbeddings()
        vector_store = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

        retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        custom_prompt = PromptTemplate.from_template("""
        אתה יועץ רכב מומחה. ענה על השאלה של המשתמש אך ורק על סמך המידע שנמצא בספר הרכב המצורף.
        אם אין מידע רלוונטי, אמור שאתה לא יודע.
        שאלה: {question}
        """)

        chain = ConversationalRetrievalChain.from_llm(
            llm=ChatOpenAI(model_name="gpt-4o", temperature=0.2),
            retriever=retriever,
            condense_question_prompt=custom_prompt  
        )

        docs = retriever.get_relevant_documents(message)
        for i, doc in enumerate(docs):
            print(f"\n--- MATCH {i+1} ---\n{doc.page_content[:300]}")

        response = chain.run({"question": message, "chat_history": []})
        return response

    except Exception as e:
        print(f"[RAG ERROR]: {e}")
        raise
