def cleanRatings(ratings):
    # clean NaNs
    ratings.fillna(0, inplace=True)
    ratings = ratings.replace(1.0, 1)
    ratings = ratings.replace(2.0, 1)
    ratings = ratings.replace(3.0, 1)
    ratings = ratings.replace(4.0, 1)
    ratings = ratings.replace(5.0, 1)
    ratings = ratings.replace(6.0, 1)
    ratings = ratings.replace(7.0, 1)
    ratings = ratings.replace(8.0, 1)
    ratings = ratings.replace(9.0, 1)
    ratings = ratings.replace(10.0, 1)
    return ratings
