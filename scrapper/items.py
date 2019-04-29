# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class ClothItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    productName = scrapy.Field()
    description = scrapy.Field()
    url = scrapy.Field()
    categories = scrapy.Field()
    categoriesOrigin = scrapy.Field()
    images_urls = scrapy.Field()
    image_medium_url = scrapy.Field()
    images = scrapy.Field()
    disabled = scrapy.Field()
    site = scrapy.Field()
    price = scrapy.Field()
    brand = scrapy.Field()
    gender = scrapy.Field()
    sizes = scrapy.Field()
    last = scrapy.Field()
