import pytest
from scrapper.pipelines import MongoDBPipeline

def test_init_mongodb_collection():
    pipe = MongoDBPipeline()
    assert pipe.collection != None
