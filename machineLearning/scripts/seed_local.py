import pymongo

connectionStringProduction = 'mongodb://gkodama:azzaropourhome2@cluster0-shard-00-00-svs1p.mongodb.net:27017,cluster0-shard-00-01-svs1p.mongodb.net:27017,cluster0-shard-00-02-svs1p.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
connectionStringLocal = 'mongodb://localhost:27017/fashionbot'

# PROD
connectionProd = pymongo.MongoClient(connectionStringProduction)
dbProd = connectionProd['fashionbot']
collectionProd = dbProd['clothes']

# LOCAL
connectionLocal = pymongo.MongoClient(connectionStringLocal)
dbLocal = connectionLocal['fashionbot']
collectionLocal = dbLocal['clothes']


cursorProd = collectionProd.find({})
collectionLocal.insert_many([item for item in cursorProd])
