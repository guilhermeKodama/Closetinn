# -*- coding: utf-8 -*-
import pymongo, config, pystache, datetime, requests, pprint, os, logging, json
from collections import OrderedDict
from bson.objectid import ObjectId
import pandas as pd
import numpy as np
from sparkpost import SparkPost
from sklearn.metrics.pairwise import euclidean_distances
from models.CollaborativeFiltering import CollaborativeFiltering
import utils.email as email_util
from operator import itemgetter

# create logger
logger = logging.getLogger('closetinn')

connection = pymongo.MongoClient(config.DATABASE_URI)
dbMongo = connection[config.DATABASE_NAME]
collectionLooks = dbMongo['looks']
collectionClothes = dbMongo['clothes']
collectionEmails= dbMongo['emails']
collectionUsers= dbMongo['users']
collectionEmailSchedule = dbMongo['emailSchedule']
collectionRecommendations= dbMongo['recommendationLooksHistory']
collectionPromotions= dbMongo['recommendationPromotionsHistory']
collectionEmailSchedule = dbMongo['emailSchedule']

collectionLooks.ensure_index('typeformId')

TOTAL_LOOKS = 30
TOP_N_NEIGHBOURS = 3
ADMIN_TOKEN = ''

def getLooksRatings(type):
    schedule = email_util.getSchedule(collectionEmailSchedule, type)
    if not schedule:
        raise Exception('No schedule found!')

    users = collectionUsers.find({ '_id': { '$in': schedule.get('users', []) }, 'likedLooks': { '$exists': True } }, {'email': 1, 'name': 1, 'likedLooks': 1}).sort([('submitedAt', pymongo.DESCENDING)])
    dfUsers = pd.DataFrame(list(users))
    looksIds = collectionLooks.find({}, {'_id': 1})
    dfLooks = pd.DataFrame(list(looksIds))
    data = pd.DataFrame(0, index=np.arange(len(dfUsers)), columns=[str(i) for i in dfLooks['_id']])
    unkown = {}
    for index, row in dfUsers.iterrows():
        likedLooks = dfUsers.iloc[[index]]['likedLooks'].values[0]
        for look in likedLooks:
            if str(look) in data.columns:
                data.iloc[index, data.columns.get_loc(str(look))] = 1
            else:
                unkown[str(look)] = 1
    # print '!CHECK THAT - unknown looks:', unkown
    # print (data == 1).astype(int).sum(axis=0)
    return (dfUsers, data)

def sendEmail(email, template, payload, type='promotions'):
    dir = os.path.dirname(os.path.realpath('__file__'))
    logger.debug('dir: %s', dir)
    # mail the shit out of them
    with open(dir + '/jobs/' + template, 'r') as myTemplate:

      data = myTemplate.read()
      html = pystache.render(data.decode('utf-8', 'ignore'), payload)
      response = email_util.send(
      'nao-responda@closetinn.com.br',
      email,
      'Confira as promoções baseadas nos looks que você gostou!',
      html)
      logger.debug('email-response-status: %s', response.status_code)
      collectionEmails.insert_one({
          'email': email,
          'html': html,
          'type': type,
          'created_at': datetime.datetime.now(),
          'response': response.status_code
      })

'''
 This function gets the looks ratings for our clients and generate get recommendations
 using Collaborative Filtering and sends emails with recommendations for everyone of them
'''
def setProducts(look, products):
    look['products'] = products
    return look

def sendRecommendations():
    dfUsers, data = getLooksRatings('recommendations')
    recommender = CollaborativeFiltering(data_items=data, N=10)
    recommender.build()
    tokens = getUsersTokens(dfUsers['email'])
    for i, user in dfUsers.iterrows():
        try:
            if config.ENV == 'development' and user.get('email') not in config.ADMIN_EMAILS:
                continue

            known_user_likes, score = recommender.predict(i, 3)

            # add 1 random look that is not on typeform
            known_looks = [[ObjectId(look) for look in known_user_likes], [ObjectId(key) for key in score.keys()]]
            random_unkown_looks = collectionLooks.find({'_id': { '$nin': known_looks}}).limit(1)

            looks = collectionLooks.find({'_id': { '$in': [ObjectId(key) for key in score.keys()]}})
            looks = list(looks)
            populateProducts = lambda look : list(collectionClothes.find({'_id': {'$in': look['products']}}))
            looks = [setProducts(look, populateProducts(look)) for look in looks]
            random_unkown_looks = [setProducts(look, populateProducts(look)) for look in random_unkown_looks]

            looks = looks + random_unkown_looks

            result = collectionRecommendations.insert_one({
                'user': user['_id'],
                'score': OrderedDict(score),
                'looks': [x['_id'] for x in looks],
                'createdAt': datetime.datetime.utcnow(),
                'updatedAt': None
            })

            logger.debug('email: %s', user['email'])
            logger.debug('hasToken: %s', user['email'] in tokens)
            if user['email'] in tokens:
                sendEmail(user['email'], 'looks.mst', {
                    'recommendation': looks[0],
                    'name': user['name'],
                    'products': looks[0]['products'],
                    'deepLink': 'https://www.closetinn.com.br/recommendations/'+str(result.inserted_id)+'/looks?token='+tokens[user['email']],
                    'deepLinkUnsubscribe': 'https://www.closetinn.com.br/unsubscribe?token='+tokens[user['email']]
                    },
                    'recommendations'
                )
        except:
            logger.error('Error sending looks recommendations for user: %s', user['email'])

def getSimilarProducts(id):
    if not isinstance(id, str):
        id = str(id)
    r = requests.get(config.API_HOST + '/api/recommendation/text/'+id)
    result = r.json()
    return result.get('products', [])

def unique(array, param, encode=False):
    uniqueItems = {}
    for item in array:
        if encode:
            uniqueItems[str(item.get(param).encode('utf-8'))] = item
        else:
            uniqueItems[str(item.get(param))] = item

    return [ value for key, value in uniqueItems.iteritems()]

def removeRepeatedProducts(products):
    products = unique(products, '_id', False)
    products = unique(products, 'productName', True)

    return products

def removeRepeatedRecommendations(user, products):
    history = collectionPromotions.find_one({ 'user': user['_id'] })
    ids = [product.get('_id') for product in products]

    for promotion in history.get('promotions'):
        try:
            index = ids.index(promotion)
            del products[index]
        except Exception as e:
            pass

    return products

'''
    This function gets the looks our clients liked and check for similar in discount
    to trigger emails of products in discount that they might like
'''
def sendRecommendationsDiscounts():
    dfUsers, data = getLooksRatings('promotions')
    recommender = CollaborativeFiltering(data_items=data, N=10)
    recommender.build()
    tokens = getUsersTokens(dfUsers['email'])
    for i, user in dfUsers.iterrows():
        try:
            if config.ENV == 'development' and user.get('email') not in config.ADMIN_EMAILS:
                continue

            known_user_likes, score = recommender.predict(i, 3)

            # add 1 random look that is not on typeform
            known_looks = [[ObjectId(look) for look in known_user_likes], [ObjectId(key) for key in score.keys()]]
            random_unkown_looks = collectionLooks.find({'_id': { '$nin': known_looks}}).limit(1)

            looks = collectionLooks.find({'_id': { '$in': [ObjectId(key) for key in score.keys()]}})
            looks = list(looks)
            populateProducts = lambda look : list(collectionClothes.find({'_id': {'$in': look['products']}}))
            looks = [setProducts(look, populateProducts(look)) for look in looks]
            random_unkown_looks = [setProducts(look, populateProducts(look)) for look in random_unkown_looks]

            looks = looks + random_unkown_looks

            logger.debug('EMAIL: %s', user['email'])

            # get similar products
            productsDiscountRecommendation = []
            for look in looks:
                for product in look.get('products', []):
                    similarWithDiscount = []
                    similars = getSimilarProducts(product['_id'])
                    for similar in similars:
                        if similar.get('priceDiscount', None):
                            similarWithDiscount.append(similar)
                    productsDiscountRecommendation = productsDiscountRecommendation + similarWithDiscount
                    if product.get('priceDiscount', None):
                        productsDiscountRecommendation.append(product)

            sortedRecommendation = sorted(productsDiscountRecommendation, key=itemgetter('priceDiscount'), reverse=True)

            # remove repeated products
            sortedRecommendation = removeRepeatedProducts(sortedRecommendation)
            # remove repeated recommendations
            sortedRecommendation = removeRepeatedRecommendations(user, sortedRecommendation)

            biggestDiscount = sortedRecommendation[0]

            result = collectionPromotions.insert_one({
                'user': user['_id'],
                'score': OrderedDict(score),
                'biggestDiscount': biggestDiscount,
                'promotions': [ObjectId(x['_id']) for x in sortedRecommendation[0:10]],
                'createdAt': datetime.datetime.utcnow(),
                'updatedAt': None
            })

            logger.debug('sortedRecommendation: %s', len(sortedRecommendation))
            logger.debug('email: %s', user['email'])
            logger.debug('hasToken: %s', user['email'] in tokens)
            if user['email'] in tokens and biggestDiscount and len(sortedRecommendation) >= 10:
                sendEmail(user['email'], 'promotions.mst', {
                    'biggestDiscount': {
                        'image': biggestDiscount.get('image_medium_url', biggestDiscount.get('images_urls', [''])[0]),
                        'discount': int(100 * biggestDiscount.get('priceDiscount'))
                    },
                    'name': user['name'],
                    'deepLink': 'https://www.closetinn.com.br/recommendations/'+str(result.inserted_id)+'/promotions?token='+tokens[user['email']],
                    'deepLinkUnsubscribe': 'https://www.closetinn.com.br/unsubscribe?token='+tokens[user['email']]
                    },
                    'promotions'
                )
        except Exception as e:
            logger.error('Error sending promotions recommendations for user: %s', user['email'])
            logger.error('ERROR: %s', e)


def getUsersTokens(emails):
    global ADMIN_TOKEN
    if isinstance(emails, pd.Series):
        emails = emails.tolist()
    headers = {
    'Content-Type': 'application/json',
    'Authorization': ADMIN_TOKEN
    }
    payload = json.dumps({
        'emails': emails
    })

    logger.debug('headers: %s', headers)
    logger.debug('payload: %s', payload)
    r = requests.post(config.API_HOST + '/api/auth/email', data=payload, headers=headers)
    result = r.json()
    logger.debug('token result: %s', result)
    return result['tokens']

def setAdminAuth():
    global ADMIN_TOKEN
    payload = {
        'email': 'guilherme.kodama+admin@gmail.com',
        'password': 'azzaropourhome2',
        'anonymousId': ''
    }
    r = requests.post(config.API_HOST + '/api/auth', data=payload)
    auth = r.json()
    logger.debug('admin auth: %s', auth)
    ADMIN_TOKEN = auth['token']




def run():
    logger.debug('===== START LOOK RECOMMENDATIONS ====')

    # disable invalid emails
    try:
        email_util.disableInvalidEmails(collectionUsers)
    except Exception as e:
        logger.error('Error disabling invalid emails: %s', e)

    try:
        setAdminAuth()
    except Exception as e:
        logger.error('Error getting admin auth: %s', e)

    try:
        sendRecommendations()
    except Exception as e:
        logger.error('Error sending looks recommendations emails: %s', e)

    try:
        sendRecommendationsDiscounts()
    except Exception as e:
        logger.error('Error sending promotions recommendations: %s', e)


# if __name__ == '__main__':
#     run()
