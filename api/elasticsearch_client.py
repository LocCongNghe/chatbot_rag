from elasticsearch import Elasticsearch
from langchain_elasticsearch import ElasticsearchChatMessageHistory

import os

ELASTIC_CLOUD_ID = os.getenv("ELASTIC_CLOUD_ID")
ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL")
ELASTIC_API_KEY = os.getenv("ELASTIC_API_KEY")

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


def get_elasticsearch_chat_message_history(index, session_id):
    return ElasticsearchChatMessageHistory(
        es_connection=elasticsearch_client, index=index, session_id=session_id
    )
