from flask import render_template
from llm_integrations import get_llm

AMBIGUOUS = "ambiguous"
YES = "yes"
NO = "no"

def document_relevant(question, docs, chat_history):
    """ Return YES or NO or AMBIGUOUS"""
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

        if YES in answer.lower():    
            return YES
        elif AMBIGUOUS in answer.lower():
            return AMBIGUOUS
        else:
            return NO
        
    except Exception as error:
        print(error)
    
    return YES