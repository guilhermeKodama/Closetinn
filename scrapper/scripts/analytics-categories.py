# -*- coding: utf-8 -*-
'''
    Tool box to get insights from the scrapped categories
'''

import pymongo, unicodedata, json, collections, pprint
pp = pprint.PrettyPrinter(indent=4)
connection_str = 'mongodb://gkodama:azzaropourhome2@cluster0-shard-00-00-svs1p.mongodb.net:27017,cluster0-shard-00-01-svs1p.mongodb.net:27017,cluster0-shard-00-02-svs1p.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
connection = pymongo.MongoClient(connection_str)
db = connection['fashionbot']
collection = db['clothes']

roupasCategories = collection.find({ 'categories': 'Roupas' }, { 'categoriesOrigin': 1 })
calcadosCategories = collection.find({ 'categories': 'Calçados' }, { 'categoriesOrigin': 1 })
acessoriosCategories = collection.find({ 'categories': 'Acessórios' }, { 'categoriesOrigin': 1 })

def countCategories(categories):
    bag = {}
    for category in categories:
        for word in category['categoriesOrigin']:
            # normalize
            word = word.lower()
            word = word.strip()
            if word in bag:
                bag[word] = bag[word] + 1
            else:
                bag[word] = 1
    return bag

roupasCategoriesCount = countCategories(roupasCategories)
calcadosCategoriesCount = countCategories(calcadosCategories)
acessoriosCategoriesCount = countCategories(acessoriosCategories)

def sortCategories(categoriesCount):
    sortedCategoriesCount = sorted(categoriesCount.items(), key=lambda x: x[1], reverse=True)
    return sortedCategoriesCount

roupasSortedCategoriesCount = sortCategories(roupasCategoriesCount)
calcadosSortedCategoriesCount = sortCategories(calcadosCategoriesCount)
acessoriosSortedCategoriesCount = sortCategories(acessoriosCategoriesCount)

# Lets check what is a good threshould to get into our secondary category


def printStats(sortedCategoriesCount, limit):
    total = 0
    average = 0.0
    mostPopularCategory = sortedCategoriesCount[0]
    leastPopularCategory = sortedCategoriesCount[len(sortedCategoriesCount) - 1]
    print 'MOST POPULAR:', mostPopularCategory
    print 'LEAST POPULAR:', leastPopularCategory

    for category in sortedCategoriesCount:
        total = total + category[1]

    average = total / len(sortedCategoriesCount)
    print 'AVERAGE: ', average
    print 'MEDIAN: ', sortedCategoriesCount[len(sortedCategoriesCount) / 2]

    print 'TOP 30 MOST POPULARS: '
    pp.pprint(sortedCategoriesCount[0:limit])

print 'ROUPAS STATS:'
printStats(roupasSortedCategoriesCount, 50)
print '================================'
print 'CALCADOS STATS:'
# printStats(calcadosSortedCategoriesCount)
print '================================'
print 'ACESSORIOS STATS:'
# printStats(acessoriosSortedCategoriesCount)
print '================================'


'''
 Results 22/01/2018
 Categories to be added:
  Roupas:
  1 - Moletom e Agasalhos (agasalhos e conjuntos; moletom; moletom fechado)
  2 - Vestidos (vestidos; vestidos curtos)
  3 - Calças (calças; calças e calças jeans)
  4 - Blusas (blusas; blusas cropped)
  5 - Regata (regata)
  6 - Bermudas e Shorts (bermudas e shorts)
  7 - Macaquinhos e Macacões (macaquinhos; macaquinhos e macacões)
  8 - Intima (calcinha; sutiã; lingeries)
  9 - Meias
  10 - Camisas
  11 - Camisetas
  12 - Infatil

'''
