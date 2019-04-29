# coding=utf-8
import numpy as np
import config, logging
from bson.objectid import ObjectId
import pymongo, re, string, unicodedata, os
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

logger = logging.getLogger('closetinn')

class VectorModel:

    def __init__(self):
        logger.debug('=+= AWESOME VECTOR MODEL =+=')
        self.collection = None
        self.model = None
        self.X_train = None
        self.corpus = []
        self.objectIds = []
        self.regex = re.compile('[%s]' % re.escape(string.punctuation))
        self.vectorizer = TfidfVectorizer(encoding='latin1', strip_accents='unicode', lowercase=True)

    def concatText(self, product):
        return product['productName']

    def normalize(self, text):
        text = self.regex.sub('', text)
        text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore')
        text = text.lower()
        return text

    def transformProductIntoDocument(self, product):
        text = self.concatText(product)
        normalizedText = self.normalize(text)
        return normalizedText

    def getMostSimilarProductIds(self, similarityMatrix, productId, objectIds, limit=5):
        # check if search is for recommendation and increase the limit to
        # remove the id itself from the results and keep returning the number of limit setted before
        if productId != None:
            limit = limit + 2
        else:
            limit = limit + 1
        results = []
        sortedIndexes = np.argsort(similarityMatrix, axis=0)
        for index in sortedIndexes[:-limit:-1]:
            # Only append ids different of itself in recommendation case
            if productId != objectIds[index[0]]:
                results.append({ 'id':objectIds[index[0]], 'distance': similarityMatrix[index[0]][0] })
        return results

    def buildCorpus(self):
        # make sure everything is clean
        self.corpus = []
        self.objectIds = []
        # connect to database
        logger.debug('DATABASE_URI: %s', config.DATABASE_URI)
        connection = pymongo.MongoClient(config.DATABASE_URI)
        db = connection['fashionbot']
        self.collection = db['clothes']
        cursor = self.collection.find({ 'disabled': False, 'site': 'dafiti', 'origin': 'zanox' }, { 'image_urls': 1, 'description': 1, 'title': 1, 'productName': 1, '_id': 1 })
        for index, product in enumerate(cursor):
            normalizedDocument = self.transformProductIntoDocument(product)
            self.objectIds.append(str(product['_id']))
            self.corpus.append(normalizedDocument)
        logger.debug('-- BUILD FINISHED -- %s %s', len(self.corpus), ' PRODUCTS')

    def train(self):
        logger.debug('-- START TRAINING --')
        self.model = self.vectorizer.fit(self.corpus)
        self.X_train = self.model.transform(self.corpus)
        self.applyKeywords()
        logger.debug('-- TRAINING FINISHED --')

    def getProductText(self, productId):
        product = self.collection.find_one({'_id': ObjectId(productId)})
        # product dont exist
        if not product:
            return None
        normalizedDocument = self.transformProductIntoDocument(product)
        return normalizedDocument

    def search(self, query, productId=None, limit=10):
        queryVector = self.model.transform([query])
        similarityMatrix = cosine_similarity(self.X_train, queryVector)
        results = self.getMostSimilarProductIds(similarityMatrix, productId, self.objectIds, limit)
        return results

    def printProducts(self, products):
        for product in products:
            pc = self.collection.find_one({'_id': ObjectId(product['id'])})
            logger.debug('PRODUCT: %s %s %s', pc['productName'], 'DISTANCE: ', product['distance'])

    def applyKeywords(self):
        keyword_list = [
            self.vectorizer.vocabulary_.get('calca'),
            self.vectorizer.vocabulary_.get('camisa'),
            self.vectorizer.vocabulary_.get('camiseta'),
            self.vectorizer.vocabulary_.get('biquini'),
            self.vectorizer.vocabulary_.get('sunga'),
            self.vectorizer.vocabulary_.get('maio'),
            self.vectorizer.vocabulary_.get('bermuda'),
            self.vectorizer.vocabulary_.get('short'),
            self.vectorizer.vocabulary_.get('jaqueta'),
            self.vectorizer.vocabulary_.get('colete'),
            self.vectorizer.vocabulary_.get('blazer'),
            self.vectorizer.vocabulary_.get('moletom'),
            self.vectorizer.vocabulary_.get('sueter'),
            self.vectorizer.vocabulary_.get('blusa'),
            self.vectorizer.vocabulary_.get('polo'),
            self.vectorizer.vocabulary_.get('body'),
            self.vectorizer.vocabulary_.get('regata'),
            self.vectorizer.vocabulary_.get('cropped'),
            self.vectorizer.vocabulary_.get('top'),
            self.vectorizer.vocabulary_.get('saia'),
            self.vectorizer.vocabulary_.get('short-saia'),
            self.vectorizer.vocabulary_.get('calcinha'),
            self.vectorizer.vocabulary_.get('cueca'),
            self.vectorizer.vocabulary_.get('macaquinho'),
            self.vectorizer.vocabulary_.get('macacao'),
            self.vectorizer.vocabulary_.get('cardigan'),
            self.vectorizer.vocabulary_.get('poncho'),
            self.vectorizer.vocabulary_.get('tenis'),
            self.vectorizer.vocabulary_.get('sapatenis'),
            self.vectorizer.vocabulary_.get('sapato'),
            self.vectorizer.vocabulary_.get('mocassim'),
            self.vectorizer.vocabulary_.get('sapatilha'),
            self.vectorizer.vocabulary_.get('mule'),
            self.vectorizer.vocabulary_.get('sandalia'),
            self.vectorizer.vocabulary_.get('chinelo'),
            self.vectorizer.vocabulary_.get('bota'),
            self.vectorizer.vocabulary_.get('botas'),
            self.vectorizer.vocabulary_.get('mocassim'),
            self.vectorizer.vocabulary_.get('coturno'),
            self.vectorizer.vocabulary_.get('chuteira'),
            self.vectorizer.vocabulary_.get('salto'),
            self.vectorizer.vocabulary_.get('slipper'),
            self.vectorizer.vocabulary_.get('rasteira'),
            self.vectorizer.vocabulary_.get('tamanco'),
            self.vectorizer.vocabulary_.get('alpagarta'),
            self.vectorizer.vocabulary_.get('scarpin'),
            self.vectorizer.vocabulary_.get('sapato'),
            self.vectorizer.vocabulary_.get('mule'),
            self.vectorizer.vocabulary_.get('anabela'),
            self.vectorizer.vocabulary_.get('carteira'),
            self.vectorizer.vocabulary_.get('relogio'),
            self.vectorizer.vocabulary_.get('bolsa'),
            self.vectorizer.vocabulary_.get('cinto'),
            self.vectorizer.vocabulary_.get('oculos'),
            self.vectorizer.vocabulary_.get('mochila'),
            self.vectorizer.vocabulary_.get('estojo'),
            self.vectorizer.vocabulary_.get('bone'),
            self.vectorizer.vocabulary_.get('mala'),
            self.vectorizer.vocabulary_.get('gorro'),
            self.vectorizer.vocabulary_.get('necessaire'),
            self.vectorizer.vocabulary_.get('cachecol'),
            self.vectorizer.vocabulary_.get('luva'),
            self.vectorizer.vocabulary_.get('pulseira')
        ]

        # item (i, j) can be accessed as data[indptr[i]+k], where k is position of j in indices[indptr[i]:indptr[i+1]]

        for i in range(0, len(self.objectIds)):
            for key in keyword_list:
                if key != None:
                    key = (int)(key)
                else:
                    continue
                k = -1
                row_columns_indices = self.X_train.indices[self.X_train.indptr[i]:self.X_train.indptr[i+1]]
                for j in range(0, len(row_columns_indices)):
                    if row_columns_indices[j] == key:
                        k = j
                if k >= 0:
                    self.X_train.data[self.X_train.indptr[i]+k] = self.X_train.data[self.X_train.indptr[i]+k] / 5


# if __name__ == '__main__':
#     '''
#         Logging
#     '''
    # create logger
    # logger = logging.getLogger('closetinn')
    # logger.setLevel(logging.DEBUG)

    # create console handler and set level to debug
    # ch = logging.StreamHandler()
    # ch.setLevel(logging.DEBUG)
    # create formatter
    # formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # add formatter to ch
    # ch.setFormatter(formatter)

    # add ch to logger
    # logger.addHandler(ch)
    #
    # vModel = VectorModel()
    # vModel.buildCorpus()
    # vModel.train()

    # query search
    # similarests = vModel.search('calça jogger', None, 10)
    # vModel.printProducts(similarests)

    # product id search
    # productId = '5a14a167f32c593ce553c99c'
    # query = vModel.getProductText(productId)
    # similarests = vModel.search(query, None, 10)
    # print similarests
    # vModel.printProducts(similarests)
