# -*- coding: utf-8 -*-
'''
This model uses build deep features learned from the trained model known as Inception-V3 that was trained
in the ImageNet competition.
You can find the model here: https://github.com/tensorflow/models/tree/master/tutorials/image/imagenet

How to use:

model = CBIRWithDeepFeatures()
# only do this when you want to recalculate the feature matrix for ALL the images
#model.buildFeatures()
# when you instantiate the model it will load the trained most recent trained matrix so you can
# query right away

# now you are query the K=10 most similar images with the first image in the features matrix
results = model.query(model.features[0], 10)
print results
'''
import matplotlib.image as mpimg
import re, os, json, pymongo, sys
import tensorflow as tf
import tensorflow.python.platform
from tensorflow.python.platform import gfile
import numpy as np
import pandas as pd
import pickle
from sklearn.neighbors import NearestNeighbors

with open(os.path.abspath(os.path.dirname(__file__)) +'/config.json') as json_data_file:
    config = json.load(json_data_file)

class CBIRWithDeepFeatures:

    def __init__(self, featuresFileName = './trained/features', labelsFileName = './trained/labels'):
        self.features = pickle.load(open(featuresFileName))
        self.labels = pickle.load(open(labelsFileName))
        self.neigh = NearestNeighbors(2, 0.4)
        self.neigh.fit(self.features)
        self.imageIndex = {}
        self.listImages = []
        # MongoDB connnection
        self.connection = pymongo.MongoClient(config['mongodb']['connectionString'])
        self.db = self.connection[config['mongodb']['db']]
        self.collection = self.db[config['mongodb']['collection']]
        # image index to retrieve produts objects
        self.buildImageIndex()

    def buildImageIndex(self):
        cursor = self.collection.find({}, { 'description': 1, 'title': 1, 'productName': 1, '_id': 1, 'images': 1 }).sort('url', 1)
        index = 0
        for item in cursor:
            for image in item['images']:
                self.imageIndex[index] = { '_id': item['_id'], 'imagePath': './preprocessedImages/' + image['path'].replace('full/', '') }
                self.listImages.append(self.imageIndex[index]['imagePath'])
                index += 1
        # pickle.dump(self.listImages, open('listImages', 'wb'))

    def buildFeatures(self, imagesDir='./preprocessedImages/', modelDir='./'):
        features, labels = self._extractFeatures(self.listImages, modelDir)
        return features, labels

    def _createGraph(self, modelDir):
        with gfile.FastGFile(os.path.join(modelDir, 'classify_image_graph_def.pb'), 'rb') as f:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(f.read())
            _ = tf.import_graph_def(graph_def, name='')

    def _extractFeatures(self, list_images, modelDir):
        nb_features = 2048
        features = np.empty((len(list_images),nb_features))
        labels = []

        self._createGraph(modelDir)
        with tf.Session() as sess:
            next_to_last_tensor = sess.graph.get_tensor_by_name('pool_3:0')

        for ind, image in enumerate(list_images):
            if (ind%100 == 0):
                print('Processing %s...' % (image))
            if not gfile.Exists(image):
                tf.logging.fatal('File does not exist %s', image)
            try:
                image_data = gfile.FastGFile(image, 'rb').read()
                predictions = sess.run(next_to_last_tensor,
                {'DecodeJpeg/contents:0': image_data})
                features[ind,:] = np.squeeze(predictions)
                labels.append(re.split('_\d+',image.split('/')[1])[0])
            except:
                print 'Error occurred, move on...'
        return features, labels


    def query(self, y, K=10):
        images = []
        kneighbors = self.neigh.kneighbors(y, K*3)
        productIndex = {}
        products = []
        similarImages = []
        i, j = 0
        for index in kneighbors[1]:
            productIndex[self.imageIndex[index]['_id']] = ''
            j += 1
            if(j <= K): similarImages.append(self.imageIndex[index])
        for key in productIndex:
            products.append(self.collection.find({ '_id': key }, { 'description': 1, 'title': 1, 'productName': 1, '_id': 1, 'images': 1 }))
            i += 1
            if(i == K): break
        return products, similarImages
