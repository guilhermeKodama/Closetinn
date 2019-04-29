# -*- coding: utf-8 -*-
# collection.create_index([('url', pymongo.TEXT)], name='search_index')
'''
    Analise how categories are organized in different websites
'''
import pymongo, unicodedata, json, collections
connection_str = 'mongodb://localhost:27017/fashionbot'
connection = pymongo.MongoClient(connection_str)
db = connection['fashionbot']
collection = db['clothes']

clothes = collection.find({}, { 'categories': 1 })
def fetch(clothes):
    aux = []
    for cloth in clothes:
        aux.append(cloth)
    return aux

clothes = fetch(clothes)

'''
    RECURSIVE STRATEGY FOR BUILDING A TREE RELATIONSHIP BETWEEN A PARENT CATEGORY
'''

def get_child_categories(visited_nodes, parent, children = [], level = 0):
    # check if we already visit that key so we don't get into an infinity loop
    if parent in visited_nodes.keys():
        return children
    else:
        if isinstance(parent, dict) :
            visited_nodes[parent['child']] = 0
        else:
            visited_nodes[parent] = 0

    # keep going
    for cloth in clothes:
        categories = cloth['categories']
        for index, category in enumerate(categories):
            if category == parent:
                if not index == len(categories) - 1:
                    item = categories[index + 1]
                    if item not in children: children.append(item)
    # let's get keep getting the children untill we reach a leaf
    # print '=========================='
    # print 'PARENT', parent
    # print 'LEVEL: ', level
    # print 'CHILDREN_SIZE: ', len(children)
    # print '=========================='
    if len(children) != 0:
        for index, child in enumerate(children):
            grandsons = []
            if isinstance(child, dict):
                grandsons = get_child_categories(visited_nodes, child, [], (level + 1))
                children[index] = {'level': level, 'child': child['child'], 'children': grandsons}
            else:
                grandsons = get_child_categories(visited_nodes, child, [], (level + 1))
                children[index] = {'level': level, 'child': child, 'children': grandsons}

        return children
    else:
        return children

def categories_by_level():
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

    return indexLevels



def get_categories_from_taget(target):
    categories = {}
    clothes = collection.find({ '$text': { '$search': target } }, { 'categories': 1, 'productName': 1 })
    clothes = fetch(clothes)
    for cloth in clothes:
        if len(cloth['categories']) >= 2:
            key = '-'.join(cloth['categories'][0:2])
            key = key.lower()
            key = unicodedata.normalize('NFD', key).encode('ascii', 'ignore')
            categories[key] = cloth['categories']
        else:
            key = '-'.join(cloth['categories'][0])
            key = key.lower()
            key = unicodedata.normalize('NFD', key).encode('ascii', 'ignore')
            categories[key] = cloth['categories']
        # if key in categories.keys():
        #     count = categories[key]['count']
        #     categories[key] = { 'categories': cloth['categories'], 'count': count + 1 }
        # else:
        #     categories[key] = { 'categories': cloth['categories'], 'count': 1 }
    # sort
    categories = collections.OrderedDict(sorted(categories.items()))
    return categories


collection.create_index([('url', pymongo.TEXT)], name='search_index')
with open('./map_categories.json', 'w') as outfile:
    json.dump(get_categories_from_taget('passarela'), outfile)


# index_by_level = categories_by_level()
# with open('categories.json', 'w') as outfile:
#     json.dump(index_by_level['0'], outfile)
#
# # save category tree
# cloth = 'Feminino'
# with open('./categoriesTree/'+ cloth +'.json', 'w') as outfile:
#     json.dump(get_child_categories({}, cloth), outfile)
