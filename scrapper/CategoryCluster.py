# -*- coding: utf-8 -*-
'''
How to use:

vModel = Ca()
vModel.calculateTFIDF()
results = vModel.query(product_id = '595edcb1f32c5925eb69f86e')

for result in results:
    print result
'''

import pymongo, re, pprint, string, unicodedata, os, json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import AgglomerativeClustering
from bson.objectid import ObjectId
import numpy as np

with open(os.path.abspath(os.path.dirname(__file__)) +'/config.json') as json_data_file:
    config = json.load(json_data_file)

class CategoryCluster:
    def __init__(self, n_clusters = 14):
        self.regex = re.compile('[%s]' % re.escape(string.punctuation))
        self.connection = pymongo.MongoClient(config['mongodb']['connectionString'])
        self.db = self.connection[config['mongodb']['db']]
        self.collection = self.db[config['mongodb']['collection']]
        # stores all texts build by products description (in index order)
        self.corpus = []
        # stores all features calculated by self.corpus (in index order)
        self.X_train = []
        # index the MogoDB '_id' with the index used to retrieve from the arrays
        self.tableIndex = {}
        # stores the items indexed in the order that they are processed
        self.arrayIndex = []
        self.__buildCorpus()
        # model
        self.model = AgglomerativeClustering(n_clusters=n_clusters)

    def __buildCorpus(self):
        cursor = self.collection.find({}, { 'categories':1, 'description': 1, 'title': 1, 'productName': 1, '_id': 1 }).limit(10000)
        self.tableIndex = {}
        for index, item in enumerate(cursor):
            #transform id to string (easier to deal with)
            item['_id'] = str(item['_id'])
            #index items
            self.tableIndex[item['_id']] = index
            text = item['productName']
            text = self.regex.sub('', text)
            text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore')
            text = text.lower()
            self.arrayIndex.append(item['categories'])
            self.corpus.append(text)
        return (self.corpus, self.tableIndex)

    def calculateTFIDF(self):
        vectorizer = TfidfVectorizer(encoding='latin1')
        self.X_train = vectorizer.fit_transform(self.corpus)
        print("n_samples: %d, n_features: %d" % self.X_train.shape)
        return self.X_train

    def predict(self):
        indexByLabel = {}
        labels = self.model.fit_predict(self.X_train.toarray())
        for index, label in enumerate(labels):
            if label in indexByLabel.keys():
                indexByLabel[label].append(self.arrayIndex[index])
            else:
                indexByLabel[label] = []
                indexByLabel[label].append(self.arrayIndex[index])
        return indexByLabel


ccModel = CategoryCluster()
ccModel.calculateTFIDF()
results = ccModel.predict()

for i in xrange(10):
    print '=====================',i,'=================='
    print results[i][0:10]
