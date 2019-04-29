# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np

from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse

'''
    A Machine Learning model that implement several techniques to do Collaborative Filtering
    Based on: https://medium.com/radon-dev/item-item-collaborative-filtering-with-binary-or-unary-data-e8f0b465b2c3
'''

class CollaborativeFiltering:
    def __init__(self, data_items, N):
        self.data_items = data_items
        self.N = N
        self.similarities_matrix = None
        self.data_neighbours = None

    '''
    In user-user collaborative filtering we look at the similarity between users
    and find the users who are most similar to any given user and then recommend
    items based on their preferences.
    '''
    #TODO
    '''
    For item-item collaborative filtering take a slightly different approach and
    start with the items. Here we first compute the similarities between different
    items (using ratings) and then make item recommendations based on the items any
    given user has liked or consumed.

    Item-item summary:
        Normalize user vectors to unit vectors.
        Construct a new item by item matrix.
        Compute the cosine similarity between all items in the matrix.
    '''
    #------------------------
    # ITEM-ITEM CALCULATIONS
    #------------------------
    def build(self):
        self.normalize()
        self.calculate_similarity()
        self.buildKNNMatrix()

    '''
    Normalize user vectors to unit vectors

    We normalize the user vectors so that a user with many ratings contributes less to any individual
    rating. This is to say that a like from a user who has only liked 10 items is more valuable to us
    than a like from someone who likes everything she comes across.

    We do this by first calculating the magnitude of all the users ratings by taking the square root of
    the sum of the squares of all the users ratings.
    '''
    def normalize(self):
        # magnitude = sqrt(x2 + y2 + z2 + ...)
        magnitude = np.sqrt(np.square(self.data_items).sum(axis=1))
        # unitvector = (x / magnitude, y / magnitude, z / magnitude, ...)
        self.data_items = self.data_items.divide(magnitude, axis='index')

    '''
    Our final goal here is to construct a new item by item matrix containing the weights
    (relationships) between each of our songs where a perfect correlation equals 1 and no
    correlation at all equals 0.
    To get this relationship between items we calculate the cosine similarity between the
    items
    This gives us the centered cosine similarity which expands to be the same as the Person correlation.
    Basically what it means is that we take the dot-product of our different item-vectors and divide it
    by the product of the normalized vectors.
    A normalized vector is the euclidean distance (or L2-norm) of that vector which means the square root
    of the sum of the absolute values squared

    Ex:
    # Build the similarity matrix
    data_matrix = calculate_similarity(data_items)

    # Lets get the top 11 similar artists for Beyonce
    print data_matrix.loc['beyonce'].nlargest(11)
    '''
    def calculate_similarity(self):
        # Calculate the column-wise cosine similarity for a sparse
        # matrix. Return a new dataframe matrix with similarities.
        columns = self.data_items.columns
        data_sparse = sparse.csr_matrix(self.data_items)
        similarities = cosine_similarity(data_sparse.transpose())
        sim = pd.DataFrame(data=similarities, index= columns, columns= columns)
        self.similarities_matrix = sim
        return sim


    '''
    User-Item calculations

    Now that we have our similarity matrix it’s time to make some user recommendations.
    To do this we look at the users known likes and their similarities. Basically we want
    to create a score for each item in our dataset for that user and then we can simply choose
    the n items with the highest score.
    '''
    #------------------------
    # USER-ITEM CALCULATIONS
    #------------------------

    def buildKNNMatrix(self):
        # Construct a new dataframe with the 10 closest neighbours (most similar)
        # for each artist/product/look.
        columns = self.similarities_matrix.columns
        self.data_neighbours = pd.DataFrame(index=columns, columns=range(1, self.N + 1))
        for i in xrange(0, len(columns)):
            self.data_neighbours.ix[i,:self.N] = self.similarities_matrix.ix[0:,i].sort_values(ascending=False)[:self.N].index

    def predict(self, user_index, N):
        # Get the artists the user has played.
        known_user_likes = self.data_items.ix[user_index]
        known_user_likes = known_user_likes[known_user_likes >0].index.values

        # Construct the neighbourhood from the most similar items to the
        # ones our user has already liked.
        most_similar_to_likes = self.data_neighbours.ix[known_user_likes]
        similar_list = most_similar_to_likes.values.tolist()
        similar_list = list(set([item for sublist in similar_list for item in sublist]))
        neighbourhood = self.similarities_matrix[similar_list].ix[similar_list]

        # A user vector containing only the neighbourhood items and
        # the known user likes.
        user_vector = self.data_items.ix[user_index].ix[similar_list]

        # Calculate the score.
        score = neighbourhood.dot(user_vector).div(neighbourhood.sum(axis=1))

        # Drop the known likes.
        score = score.drop(known_user_likes)

        return (known_user_likes, score.nlargest(N))
