# -*- coding: utf-8 -*-
'''
    Check promotions in the database by category and update the promotions collection
'''
import pymongo, logging, config, json

# create logger
logger = logging.getLogger('closetinn')

connection = pymongo.MongoClient(config.DATABASE_URI)
db = connection[config.DATABASE_NAME]
collectionClothes = db['clothes']
collectionPromotions = db['promotions']
collectionPromotions.ensure_index('category', unique=True)

def run():
    logger.debug('--- UPDATING PROMOTIONS ---')
    data = {}
    products = collectionClothes.find({
        'origin': 'zanox',
        'site': 'dafiti',
        'priceDiscount': { '$nin': [ None ] },
        'sizes': { '$nin':[''] },
        'sizes.0': { '$exists': True },
        'disabled': False
    },
    {
        '_id': 1,
        'price':1,
        'categories': 1,
        'priceDiscount': 1
    })

    for product in products:
        print product
        if len(product['categories']) == 3  and product['priceDiscount'] and product['price'] and product['categories'][2]:
            if product['categories'][2] in data:
                data[product['categories'][2]]['clothes'].append(product['_id'])
                if data[product['categories'][2]]['biggestDiscount'] < product['priceDiscount']:
                    data[product['categories'][2]]['biggestDiscount'] = product['priceDiscount']
                    data[product['categories'][2]]['biggestDiscountCloth'] = product['_id']

                if data[product['categories'][2]]['lowestPrice'] > product['price']:
                    data[product['categories'][2]]['lowestPrice'] = product['price']
                    data[product['categories'][2]]['lowestPriceCloth'] = product['_id']
            else:
                data[product['categories'][2]] = {
                    'category': product['categories'][2],
                    'biggestDiscount': product['priceDiscount'],
                    'biggestDiscountCloth': product['_id'],
                    'lowestPrice': product['price'],
                    'lowestPriceCloth': product['_id'],
                    'clothes': [ product['_id'] ]
                }
    for key in data:
        promotion = collectionPromotions.find_one({ 'category': data[key]['category'] })
        if promotion:
            collectionPromotions.update_one({
                'category': data[key]['category']
                },
                {
                '$set': {
                    'lowestPrice': data[key]['lowestPrice'],
                    'lowestPriceCloth': data[key]['lowestPriceCloth'],
                    'biggestDiscount': data[key]['biggestDiscount'],
                    'biggestDiscountCloth': data[key]['biggestDiscountCloth'],
                    'clothes': data[key]['clothes']
                }
            })
        else:
            collectionPromotions.insert(data[key])

    logger.debug('--- UPDATING PROMOTIONS FINISHED ---  COUNT: %s', len(data))

# if __name__ == '__main__':
#     run()
