# -*- coding: utf-8 -*-
'''
    Download product data from market places and sync with our database.
    Zanox - Dafiti: http://productdata.zanox.com/exportservice/v1/rest/44509136C245333048.xml
'''
import json
import os
import config
import psutil
import logging
from bson.objectid import ObjectId
import csv, gzip, re, urllib2, StringIO, json, pymongo, datetime, requests
import utils.map as map
from pymongo import InsertOne, UpdateOne

pid = os.getpid()
ps = psutil.Process(pid)

# create logger
logger = logging.getLogger('closetinn')

recommendationAPIHost = config.RECOMMENDATION_HOST

connection = pymongo.MongoClient(config.DATABASE_URI)
db = connection[config.DATABASE_NAME]
collectionClothes = db['clothes']
collectionUnclassifiedClothes = db['unclassifiedClothes']
collectionUnclassifiedClothes.ensure_index('url', unique=True)
collectionClothes.ensure_index('url', unique=True)

changes = []

def logUsage():
    memoryUse = ps.memory_info()[0] >> 20  # memory use in MB...I think
    logger.debug('CPU_PERCENT: %s', ps.cpu_percent(interval=1))
    logger.debug('MEMORY: %s MB', memoryUse)


def getProductURL(paidLink):
    match = re.match(r"^.*\[\[(.*)\?.*\]\].*$", paidLink)
    return match.group(1)

def getMostSimilarProduct(productMapped):
    r = requests.get(recommendationAPIHost + '/search?query=' + productMapped['productName'] + ' ' + productMapped['description'])
    json = r.json()
    products = json['products']
    distance = float(products[0]['distance'])
    logger.debug('DISTANCE: %s', distance)

    # if we have more than 90% of similarity we continue the classification
    if distance >= 0.95:
        similarest = collectionClothes.find_one({ '_id': ObjectId(products[0]['id']) })
        return similarest
    else:
        return None
def bulkSave():
    global changes
    collectionClothes.bulk_write(changes)
    changes = []

def updateProduct(product):
    global changes
    # check if we have that product in the database
    productFind = collectionClothes.find_one({ 'url': product['url'] })
    logger.debug('TRYING TO UPDATE: %s', product['productName'])

    # if product exist lets just update the zanox link for now
    if productFind:
        logger.debug('UPDATING DOCUMENT')
        changes.append(
            UpdateOne(
            { 'url': product['url'] },
            { '$set': {
                'origin': product['origin'],
                'description': product['description'],
                'title': product['title'],
                'url': product['url'],
                'gender': product['gender'],
                'color': product['color'],
                'price': product['price'],
                'priceOld': product['priceOld'] if 'priceOld' in product else None,
                'priceDiscount': product['priceDiscount'] if 'priceDiscount' in product else None,
                'sizes': product['sizes'],
                # 'image_medium_url': product['image_medium_url'],
                # 'images_urls': product['images_urls'],
                'productName': product['productName'],
                'site': product['site'],
                'brand': product['brand'],
                'trackingUrl': product['trackingUrl'],
                'categories': product['categories'],
                'disabled': False if len(product['sizes']) > 0 and product['sizes'][0] else True
                }
            },
            upsert=False)
        )
    else:
        logger.debug('PRODUCT DOESNT EXIST, LETS ADD IT')
        # if product does not exist lets insert it
        changes.append(InsertOne(product))
    if len(changes) >= 5000:
        bulkSave()

def run(URL, program = 'dafiti'):
    global changes
    logger.info('==== JOB: syncData.py ====')

    logger.debug('DATABASE_URI: %s', config.DATABASE_URI)

    logger.info('Program: %s', program)
    logger.info('Downloading: %s', URL)
    response = urllib2.urlopen(URL)

    # downdload the compressed file (gzip) and the compress on memory
    compressedFile = StringIO.StringIO(response.read())
    logger.info('Decompressing gzip...')
    decompressedFile = gzip.GzipFile(fileobj=compressedFile)

    logger.info('Reading CSV file...')
    reader = csv.DictReader(decompressedFile, delimiter=',')
    logUsage()

    for row in reader:
        # weird characters from Dafiti csv compressed ('\xef\xbb\xbf"Zupid"',)
        row['Zupid'] = row.pop('\xef\xbb\xbf"Zupid"')
        logger.debug('---')
        logger.debug('Name: %s', row['ProductName'])
        row['ProductURL'] = getProductURL(row['ZanoxProductLink'])
        logger.debug('url: %s', row['ProductURL'])
        mappedProduct = None
        if program == 'dafiti':
            mappedProduct = map.mapProductAttributes(row)
        else:
            mappedProduct = map.mapKanuiProductAttributes(row)

        updateResult = None
        if mappedProduct and mappedProduct['categories'] and mappedProduct['gender'] == 'masculino':
            updateResult = updateProduct(mappedProduct)
        logger.debug('update link: %s', updateResult)
        logger.debug('---')
    logUsage()
    if len(changes) > 0:
        bulkSave()
    requests.put(recommendationAPIHost + '/updateDatabase')


# if __name__ == '__main__':
#     run()
