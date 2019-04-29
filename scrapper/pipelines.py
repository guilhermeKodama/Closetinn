# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import re, logging, pymongo
from pytz import timezone
from datetime import datetime
from scrapy.conf import settings
from scrapy.exceptions import DropItem
from pymongo import InsertOne, UpdateOne

# create logger
logger = logging.getLogger('closetinn')

class CleanPipeline(object):
    def process_item(self, item, spider):
        # item['title'] = item['title'].strip()
        # item['productName'] = item['productName'].strip()
        # item['description'] = item['description'].strip()
        # if item['brand'] is not None:
        #     item['brand'] = item['brand'].strip().lower()
        # if item['price'] is not None and isinstance(item['price'], basestring):
        #     item['price'] = item['price'].strip().replace(',', '.')
        #     price = re.findall("\d+\.\d+", item['price'])
        #     if len(price) > 0:
        #         item['price'] = float(price[0])
        #
        # cleanCategories = []
        # for category in item['categories']:
        #     cleanCategories.append(category.strip())
        # item['categories'] = cleanCategories
        #
        # # gender is always our higher category
        # item['gender'] = item['categories'][0].lower()
        # logger.info('Cleaning: %s', item['productName'])
        return item

class MongoDBPipeline(object):
    def __init__(self):
        connection = pymongo.MongoClient(
            settings['MONGODB_CONNECTION_STRING']
        )
        db = connection[settings['MONGODB_DB']]
        self.collection = db[settings['MONGODB_COLLECTION']]
        self.data = []

    def get_current_date_time_with_time_zone(self):
        # define date format
        fmt = '%Y-%m-%d %H:%M:%S %Z%z'
        # define eastern timezone
        eastern = timezone('US/Eastern')
        # naive datetime
        # naive_dt = datetime.now()
        # localized datetime
        loc_dt = datetime.now(eastern)
        # print(naive_dt.strftime(fmt))
        # 2015-12-31 19:21:00
        # print(loc_dt.strftime(fmt))
        # 2015-12-31 19:21:00 EST-0500
        return loc_dt.strftime(fmt)


    def process_item(self, item, spider):
        _id = None
        # price log
        # priceLog = { 'price': item['price'], 'datetime': self.get_current_date_time_with_time_zone() }
        # Check if item already exist
        doc = self.collection.find_one({'url': item['url']}, { '_id': 1, 'productName': 1  })
        # If exist update price
        if doc is not None:
            _id = doc['_id']
            self.data.append(
                UpdateOne(
                    {'_id': doc['_id']},
                    {'$set': { 'images_urls': item['images_urls'], 'image_medium_url': item['image_medium_url'] } },
                    upsert=False
                )
            )
            logger.info('Update in MongoDB: %s %s %s', doc['productName'], item['images_urls'], item['image_medium_url'])
        logger.info('last: %s', item['last'])
        if len(self.data) > 5000 or item['last']:
            self.collection.bulk_write(self.data)
            self.data = []
        return item
