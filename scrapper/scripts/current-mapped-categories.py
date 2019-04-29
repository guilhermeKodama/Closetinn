# -*- coding: utf-8 -*-
from scrapy.conf import settings
import scrapper.utils.cleaner as cleaner
import collections
import json

category_mapping = settings['CATEGORY_MAPPING']

distinct_categories = {}


kanui = category_mapping['kanui']

for key in kanui.keys():
    unique_mapped_key = cleaner.normalizeArrayOfText(kanui[key])
    unique_mapped_key = cleaner.generateKeyFromValues(unique_mapped_key)
    distinct_categories[unique_mapped_key] = kanui[key]

dafiti = category_mapping['dafiti']

for key in dafiti.keys():
    unique_mapped_key = cleaner.normalizeArrayOfText(dafiti[key])
    unique_mapped_key = cleaner.generateKeyFromValues(unique_mapped_key)
    distinct_categories[unique_mapped_key] = dafiti[key]

passarela = category_mapping['passarela']

for key in passarela.keys():
    unique_mapped_key = cleaner.normalizeArrayOfText(passarela[key])
    unique_mapped_key = cleaner.generateKeyFromValues(unique_mapped_key)
    distinct_categories[unique_mapped_key] = passarela[key]

distinct_categories = collections.OrderedDict(sorted(distinct_categories.items()))

print(json.dumps(distinct_categories))
