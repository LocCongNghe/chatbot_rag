from elasticsearch import Elasticsearch, NotFoundError
from langchain_elasticsearch import ElasticsearchStore
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os
import time

load_dotenv()

# Global variables
# Modify these if you want to use a different file, index or model
INDEX = os.getenv("ES_INDEX", "workplace-app-docs")
BOOKS = os.path.join(os.path.dirname(__file__), "books")
ELASTIC_CLOUD_ID = os.getenv("ELASTIC_CLOUD_ID")
ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL")
ELASTIC_API_KEY = os.getenv("ELASTIC_API_KEY")
ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2")
ELASTICSEARCH_USERNAME = os.getenv('ELASTICSEARCH_USERNAME')
ELASTICSEARCH_PASSWORD = os.getenv('ELASTICSEARCH_PASSWORD')

if ELASTICSEARCH_URL:
    elasticsearch_client = Elasticsearch(
        hosts=[ELASTICSEARCH_URL],
        http_auth=(ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD)
    )
elif ELASTIC_CLOUD_ID:
    elasticsearch_client = Elasticsearch(
        cloud_id=ELASTIC_CLOUD_ID, api_key=ELASTIC_API_KEY
    )
else:
    raise ValueError(
        "Please provide either ELASTICSEARCH_URL or ELASTIC_CLOUD_ID and ELASTIC_API_KEY"
    )


def install_elser():
    try:
        elasticsearch_client.ml.get_trained_models(model_id=ELSER_MODEL)
        print(f'"{ELSER_MODEL}" model is available')
    except NotFoundError:
        print(f'"{ELSER_MODEL}" model not available, downloading it now')
        elasticsearch_client.ml.put_trained_model(
            model_id=ELSER_MODEL, input={"field_names": ["text_field"]}
        )
        while True:
            status = elasticsearch_client.ml.get_trained_models(
                model_id=ELSER_MODEL, include="definition_status"
            )
            if status["trained_model_configs"][0]["fully_defined"]:
                # model is ready
                break
            time.sleep(1)

        print("Model downloaded, starting deployment")
        elasticsearch_client.ml.start_trained_model_deployment(
            model_id=ELSER_MODEL, wait_for="fully_allocated"
        )


def main():
    install_elser()

    print(f"Loading data from ${BOOKS}")

    workplace_docs = []

    pdf_files = [f for f in os.listdir(BOOKS) if f.endswith(".pdf")]
    for pdf_file in pdf_files:
        file_path = os.path.join(BOOKS, pdf_file)
        print(f"Đang đọc tệp: {file_path}")
        loader = PyPDFLoader(file_path)
        workplace_docs.append(loader.load_and_split())

    print(f"Loaded {len(workplace_docs)} documents")

    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=2000,
        chunk_overlap=200)

    docs = []
    for item in workplace_docs:
        docs.extend(text_splitter.split_documents(item))

    print(f"Split {len(workplace_docs)} documents into {len(docs)} chunks")

    print(
        f"Creating Elasticsearch sparse vector store in Elastic Cloud: {ELASTIC_CLOUD_ID}"
    )

    elasticsearch_client.indices.delete(index=INDEX, ignore_unavailable=True)

    ElasticsearchStore.from_documents(
        docs,
        es_connection=elasticsearch_client,
        index_name=INDEX,
        strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(model_id=ELSER_MODEL),
        bulk_kwargs={
            "request_timeout": 120,
        },
    )


if __name__ == "__main__":
    main()
