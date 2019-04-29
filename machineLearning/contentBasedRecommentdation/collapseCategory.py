import pymongo

MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017/fashionbot'
MONGODB_SERVER = 'ds155411.mlab.com:55411/fashionbot'
MONGODB_USER = 'admin'
MONGODB_PASSWORD = 'azzaropourhome2'
MONGODB_PORT = 27017
MONGODB_DB = 'fashionbot'
MONGODB_COLLECTION = 'clothes'

connection = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
db = connection[MONGODB_DB]
collection = db[MONGODB_COLLECTION]

clothes = collection.find({}).limit(200)

collapse = {}

for cloth in clothes:
    index = 0
    for category in cloth['categories']:
        collapse[category] = index
        index += 1

indexLevels = {}

for key in collapse.keys():
    index = str(collapse[key])
    if index not in indexLevels.keys(): indexLevels[str(index)] = []
    indexLevels[index].append(key)

import json
with open('./categories.json', 'w') as outfile:
    json.dump(indexLevels, outfile)
