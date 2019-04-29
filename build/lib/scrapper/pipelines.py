# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
from scrapy.conf import settings
from scrapy.exceptions import DropItem
from scrapy import log

class CleanPipeline(object):
    def process_item(self, item, spider):
        item['title'] = item['title'].strip()
        item['productName'] = item['productName'].strip()
        item['description'] = item['description'].strip()
        cleanCategories = []
        for category in item['categories']:
            cleanCategories.append(category.strip())
        item['categories'] = cleanCategories
        log.msg('Cleaning: ' + item['productName'], leve=log.DEBUG, spider=spider)
        return item

class MongoDBPipeline(object):
    def __init__(self):
        connection = pymongo.MongoClient(
            settings['MONGODB_CONNECTION_STRING']
        )
        db = connection[settings['MONGODB_DB']]
        self.collection = db[settings['MONGODB_COLLECTION']]

    def process_item(self, item, spider):
        self.collection.insert(dict(item))
        log.msg('Add do MongoDB: ' + item['productName'], leve=log.DEBUG, spider=spider)
        return item
