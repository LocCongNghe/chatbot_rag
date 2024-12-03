import os
from flask import render_template, stream_with_context, current_app
from langchain_elasticsearch import ElasticsearchStore
from elasticsearch_client import (
    elasticsearch_client,
    get_elasticsearch_chat_message_history,
)
from llm_integrations import get_llm
from grade_documents import is_document_relevant
from web_search import web_search

INDEX = os.getenv("ES_INDEX", "workplace-app-docs")
INDEX_CHAT_HISTORY = os.getenv(
    "ES_INDEX_CHAT_HISTORY", "workplace-app-docs-chat-history"
)
ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2")
SESSION_ID_TAG = "[SESSION_ID]"
SOURCE_TAG = "[SOURCE]"
DONE_TAG = "[DONE]"
ENABLE_WEB_SEARCH = True



store = ElasticsearchStore(
    es_connection=elasticsearch_client,
    index_name=INDEX,
    strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(model_id=ELSER_MODEL),
)


@stream_with_context
def ask_question(question, session_id):
    yield f"data: {SESSION_ID_TAG} {session_id}\n\n"
    current_app.logger.debug("Chat session ID: %s", session_id)

    chat_history = get_elasticsearch_chat_message_history(
        INDEX_CHAT_HISTORY, session_id
    )

    # In toàn bộ chat_history vào cmd
    # current_app.logger.debug("Chat history: %s", chat_history.messages)


    if len(chat_history.messages) > 0:
        # create a condensed question
        condense_question_prompt = render_template(
            "condense_question_prompt.txt",
            question=question,
            chat_history=chat_history.messages,
        )
        condensed_question = get_llm().invoke(condense_question_prompt).content
    else:
        condensed_question = question

    current_app.logger.debug("Condensed question: %s", condensed_question)
    current_app.logger.debug("Question: %s", question)

    docs = store.as_retriever().invoke(condensed_question)
    
    current_app.logger.debug("%s", docs)


    # danh gia docs o day:
    is_relevant = is_document_relevant(question=question, docs=docs, chat_history=chat_history.messages)
    current_app.logger.debug("/n/n")
    current_app.logger.debug("danh gia: %s", is_relevant)
    current_app.logger.debug("/n/n")

    ##############

    if is_relevant:
        prompt_file = "rag_prompt.txt"
        yield f"data: ***Sử dụng dữ liệu trong kho dữ liệu*** <br><br>"
    else:
        docs = web_search(question)
        current_app.logger.debug("internet: %s", docs)
        prompt_file = "rag_prompt2.txt"
        yield f"data: ***Tra cứu dữ liệu trên internet*** <br><br>"




    qa_prompt = render_template(
        prompt_file,
        question=question,
        docs=docs,
        chat_history=chat_history.messages,
    )

    current_app.logger.debug("/n/n")
    current_app.logger.debug("prompt: %s", qa_prompt)
    current_app.logger.debug("/n/n")

    answer = ""
    for chunk in get_llm().stream(qa_prompt):
        content = chunk.content.replace(
            "\n", " "
        )  # the stream can get messed up with newlines
        yield f"data: {content}\n\n"
        answer += chunk.content

    yield f"data: {DONE_TAG}\n\n"
    current_app.logger.debug("Answer: %s", answer)

    chat_history.add_user_message(question)
    chat_history.add_ai_message(answer)
