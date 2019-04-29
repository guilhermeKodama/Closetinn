# -*- coding: utf-8 -*-
'''
    Tool functions to cleanup texts
'''
import unidecode

def normalizeName(text):
    text = text.strip()
    return text

def normalizeText(text):
    text = text.strip()
    text = text.lower()
    text = unidecode.unidecode(text)
    text = text.replace('\n','')
    text = text.replace('\r','')
    return text


def normalizeArrayOfText(array):
    if not isinstance(array, list):
        return []
    normalizedArray = []
    for item in array:
        # item = unicode(item, 'utf-8')
        normalizedArray.append(normalizeText(item))
    return normalizedArray

def generateKeyFromValues(array):
    key = None
    # lets generate key only with 3 levels deep (easier to map)
    # if we want to we can go deeper
    if len(array) >= 3:
        array = array[0:3]

    for item in array:
        cleanItem = normalizeText(item)
        if key:
            key = key + '-' + cleanItem
        else:
            key = cleanItem
    return key
