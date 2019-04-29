from skimage import io, transform, img_as_float
from skimage.color import rgb2gray
from skimage.feature import canny
from matplotlib import pyplot as plt
from sklearn.neighbors import NearestNeighbors
from sklearn.decomposition import PCA
import os
import numpy as np
import pandas as pd
import pymongo

MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017/fashionbot'
MONGODB_SERVER = 'ds155411.mlab.com:55411/fashionbot'
MONGODB_USER = 'admin'
MONGODB_PASSWORD = 'azzaropourhome2'
MONGODB_PORT = 27017
MONGODB_DB = 'fashionbot'
MONGODB_COLLECTION = 'clothes'

LOCAL_PATH = '/Users/guilherme/Documents/Documents/Projects/Machine Learning/FashionBot/scrapper/spiders/images/'
IMAGE_SIZE = (100, 100)

connection = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
db = connection[MONGODB_DB]
collection = db[MONGODB_COLLECTION]

## cut white background
def cut_white_background(path):
    image = img_as_float(io.imread(path))

    # Select all pixels almost equal to white
    # (almost, because there are some edge effects in jpegs
    # so the boundaries may not be exactly white)
    white = np.array([1, 1, 1])
    mask = np.abs(image - white).sum(axis=2) < 0.05

    # Find the bounding box of those pixels
    coords = np.array(np.nonzero(~mask))
    top_left = np.min(coords, axis=1)
    bottom_right = np.max(coords, axis=1)

    out = image[top_left[0]:bottom_right[0],
                top_left[1]:bottom_right[1]]
    return out
    # plt.imshow(out)
    # plt.show()

def apply_PCA(data):
    '''
    DeprecationWarning: Passing 1d arrays as data is deprecated in 0.17 and willraise ValueError in 0.19.
    Reshape your data either using X.reshape(-1, 1) if your data has a single feature or X.reshape(1, -1) if it contains a
    single sample.
    '''
    # Create a regular PCA model
    pca = PCA(n_components=2)

    # Fit and transform the data to the model
    reduced_data_pca = pca.fit_transform(data)

    # Inspect the shape
    reduced_data_pca.shape

    # Print out the data
    # print(data)
    # print(reduced_data_pca)
    return reduced_data_pca



shoes = collection.find({}).limit(200)

i = 0
clothIndexing = {}
dataset = []
for shoe in shoes :
    for image in shoe['images']:
        originImage = image
        path = LOCAL_PATH + image['path']
        image = cut_white_background(path)
        image = transform.resize(image, IMAGE_SIZE)
        '''Split the target image into its red, green and blue channels.
            image - a numpy array of shape (rows, columns, 3).
            output - three numpy arrays of shape (rows, columns) and dtype same as
            image, containing the corresponding channels.
        '''
        red = image[:,:,2]
        green = image[:,:,1]
        blue = image[:,:,0]
        red_mean = np.mean(red)
        red_std = np.std(red)
        green_mean = np.mean(green)
        green_std = np.std(green)
        blue_mean = np.mean(blue)
        blue_std = np.std(blue)
        features = [red_mean,red_std,green_mean,green_std,blue_mean,blue_std]
        # edges feature
        # image = rgb2gray(image)
        # edges = canny(image)
        # image_array = edges.reshape((1, edges.shape[0] * edges.shape[1]))[0]
        # features = np.append([red_mean,red_std,green_mean,green_std,blue_mean,blue_std], image_array.astype(int))
        dataset.append(features)
        clothIndexing[i] = {'shoe': shoe, 'image': originImage}
        i+=1
        print 'I: ',i


neigh = NearestNeighbors(2, 0.4)
neigh.fit(dataset)
kneighbors = neigh.kneighbors(dataset[0], 10)
print 'Distances: ', kneighbors[0]

for index in np.nditer(kneighbors[1]):
    print clothIndexing[int(index)]['image']
    i+=1
