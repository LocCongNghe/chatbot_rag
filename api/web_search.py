import os
from langchain.schema import Document
from langchain_community.tools.tavily_search import TavilySearchResults

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

def web_search(question):
    documents = None
    try:
        search = TavilySearchResults(tavily_api_key=TAVILY_API_KEY, max_results=5)
        
        docs = search.invoke({"query": question})
        web_results = "\n".join([d["content"] for d in docs])
        web_results = Document(page_content=web_results)

        documents = web_results

    except Exception as error:
        print(error)

    return documents

if __name__ == "__main__":
    t = web_search("cách làm bánh mì thổ nhĩ kì")
    print(t)