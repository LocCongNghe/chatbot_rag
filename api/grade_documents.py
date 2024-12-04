from flask import render_template
from llm_integrations import get_llm

def is_document_relevant(question, docs, chat_history):
    is_relevant = True
    try:
        prompt = render_template(
            "grade_documents_prompt.txt",
            question=question,
            docs=docs,
            chat_history=chat_history,
        )

        answer = ""
        for chunk in get_llm().stream(prompt):
            answer += chunk.content

        is_relevant = ("yes" in answer) or ("Yes" in answer)
    
    except Exception as error:
        print(error)
    
    return is_relevant