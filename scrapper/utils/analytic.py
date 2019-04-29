'''
    Tools to centralize analysis on running spiders
'''
import json

uniqueCategoryCount = {
    'dafiti':{},
    'kanui': {},
    'farfetch': {},
    'passarela': {}
}

def addCategoryKey(spiderName, key):
    if key in uniqueCategoryCount[spiderName]:
        uniqueCategoryCount[spiderName][key] = uniqueCategoryCount[spiderName][key] + 1
    else:
        uniqueCategoryCount[spiderName][key] = 1
    with open('analytic.json', 'w') as outfile:
        json.dump(uniqueCategoryCount, outfile)
