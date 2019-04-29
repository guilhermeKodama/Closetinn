# -*- coding: utf-8 -*-
import logging, pymongo
import scrapy, os, json, unidecode, re, requests
from scrapy.conf import settings
import utils.cleaner as cleaner
import utils.analytic as analytic
from scrapy.spiders import Spider, Rule
from scrapy.linkextractors import LinkExtractor
from items import ClothItem

# create logger
logger = logging.getLogger('closetinn')

# MongoDB
connection = pymongo.MongoClient(
    settings['MONGODB_CONNECTION_STRING']
)
db = connection[settings['MONGODB_DB']]
collection = db[settings['MONGODB_COLLECTION']]

missingDataClothes = []
clothes = collection.find({ 'image_medium_url': '', 'gender': 'masculino', 'disabled': False }, { '_id': 1, 'url': 1 })

for cloth in clothes:
    missingDataClothes.append(cloth['url'])

class DafitiSpider(Spider):
    name = 'dafiti'
    allowed_domains = ['dafiti.com.br']
    start_urls = [ 'https://www.dafiti.com.br/' ] + missingDataClothes

    def get_product_id(self, response):
        data = response.xpath('/html/body/script[1]').extract_first()
        if data:
            data = unidecode.unidecode(data)
            data = data.replace('\n','')
            data = data.replace('\r','')
            matches = re.findall(r'dataLayer\s\=\s\[(\{.+\})\]', data)
            if len(matches) > 0:
                matches[0] = matches[0].replace(' ','')
                prodIdMatch = re.findall(r'\'ProdId\':\'([\w\d]*)\'', matches[0])
                if len(prodIdMatch) > 0:
                    return prodIdMatch[0]
        return None

    def parse(self, response):
        category_mapping = self.settings['CATEGORY_MAPPING']['dafiti']
        # scrap item
        item = ClothItem()
        # item['title'] = response.xpath('//a[@class="product-brand-link"]/text()').extract_first()
        # item['productName'] = response.xpath('//h1[@class="product-name"]/text()').extract_first()
        # item['description'] = response.xpath('//p[@class="product-information-description"]/text()').extract_first()
        item['images_urls'] = response.xpath('//a[@class="gallery-thumb"]//@data-img-zoom').extract()
        item['image_medium_url'] =  response.xpath('//ul[@class="carousel-items row"]//a//@href').extract_first()
        # item['price'] = response.xpath('//span[@class="catalog-detail-price-value"]/text()').extract_first()
        # item['brand'] = response.xpath('//a[@class="product-brand-link"]/text()').extract_first()
        item['url'] = response.url
        item['last'] = True if item['url'] == self.start_urls[len(self.start_urls) - 1] else False
        # item['disabled'] = False
        # item['categories'] = None

        # get available sizes
        # product_id  = self.get_product_id(response)
        # if product_id is not None:
        #     r = requests.get('https://www.dafiti.com.br/product/list/?skus=' + product_id)
        #     r_json = r.json()
        #     if r_json[product_id]['sizes_available']:
        #         item['sizes'] = r_json[product_id]['sizes_available'].keys()
        #
        # categories = response.xpath('//span[@itemprop="title"]/text()').extract()
        # if len(categories) > 0:
        #     categories.pop(0)
        #
        # item['categoriesOrigin'] = cleaner.normalizeArrayOfText(categories)
        #
        # if len(item['categoriesOrigin']) >= 2:
        #     # lets try to match to a more deeper category
        #     deeperCategoryKey = cleaner.generateKeyFromValues(item['categoriesOrigin'])
        #     analytic.addCategoryKey('dafiti', deeperCategoryKey)
        #     # final try last match with a more broad category
        #     # categoryKey = item['categoriesOrigin'][1]
        #     if deeperCategoryKey in category_mapping.keys():
        #         item['categories'] = category_mapping[deeperCategoryKey]

        # mandatory fields to save an item
        if item['images_urls'] and item['image_medium_url'] and item['url'] :
            yield item
        # following links
        # //*[@id="wrapper"]/div[4]/div[2]/div[3]/div/div[3]/div[1]/ul/li[2]/a
        # for nextPage in response.xpath('//a[contains(@class, "product-box-link")]/@href').extract():
        #     nextPage = response.urljoin(nextPage)
        #     yield scrapy.Request(nextPage, callback=self.parse)
        # for nextPage in response.xpath('//li[@class="page "]/a/@href').extract():
        #     nextPage = response.urljoin(nextPage)
        #     yield scrapy.Request(nextPage, callback=self.parse)
        # for nextPage in response.xpath('//a[contains(@class, "menu-dropdown-link")]/@href').extract():
        #     nextPage = response.urljoin(nextPage)
        #     yield scrapy.Request(nextPage, callback=self.parse)
        # for nextPage in response.xpath('//a[contains(@class, "menu-link")]/@href').extract():
        #     nextPage = response.urljoin(nextPage)
        #     yield scrapy.Request(nextPage, callback=self.parse)
