import pymongo, logging, json

# create logger
logger = logging.getLogger('closetinn')

# logger.debug('DB_HOST: %s', config.DATABASE_URI)

connection = pymongo.MongoClient('mongodb://gkodama:azzaropourhome2@cluster0-shard-00-00-svs1p.mongodb.net:27017,cluster0-shard-00-01-svs1p.mongodb.net:27017,cluster0-shard-00-02-svs1p.mongodb.net:27017/fashionbot?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')
dbMongo = connection['fashionbot']

collectionClothes = dbMongo['clothes']

myquery = { 'gender': 'feminino' }

def run():
    logger.debug('===== CLEANING DATABASE ====')
    x = collectionClothes.delete_many(myquery)
    logger.debug('DELETED %s', x.deleted_count)
