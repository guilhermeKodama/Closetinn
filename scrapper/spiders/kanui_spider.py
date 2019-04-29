# -*- coding: utf-8 -*-
import scrapy, os, unidecode, json, re, unicodedata, requests, logging
import utils.cleaner as cleaner
import utils.analytic as analytic
from scrapy.spiders import Spider, Rule
from scrapy.linkextractors import LinkExtractor
from items import ClothItem

# create logger
logger = logging.getLogger('closetinn')

categoryIndex = {}
class KanuiSpider(Spider):
    name = 'kanui'
    allowed_domains = ['kanui.com.br']
    start_urls = [ 'https://www.kanui.com.br/' ]

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
    def getCategoryGender(self, response):
        data = response.xpath('/html/body/script[1]').extract_first()
        if data:
            data = unidecode.unidecode(data)
            data = data.replace('\n','')
            data = data.replace('\r','')
            matches = re.findall(r'dataLayer\s\=\s\[(\{.+\})\]', data)
            if len(matches) > 0:
                matches[0] = matches[0].replace(' ','')
                genderMatch = re.findall(r'\'gender\':\'([a-z]*)\'', matches[0])
                if len(genderMatch) > 0:
                    return genderMatch[0]
        return None

    def getSubCategory(self, response):
        data = response.xpath('/html/body/script[1]').extract_first()
        if data:
            data = unidecode.unidecode(data)
            data = data.replace('\n','')
            data = data.replace('\r','')
            matches = re.findall(r'dataLayer\s\=\s\[(\{.+\})\]', data)
            if len(matches) > 0:
                matches[0] = matches[0].replace(' ','')
                genderMatch = re.findall(r'\'subCategory\':\'([a-z]*)\'', matches[0])
                if len(genderMatch) > 0:
                    return genderMatch[0]
        return None

    def parse(self, response):
        category_mapping = self.settings['CATEGORY_MAPPING']['kanui']
        # scrap item
        item = ClothItem()
        item['title'] = response.xpath('//a[@class="product-brand-link"]/text()').extract_first()
        item['brand'] = response.xpath('//a[@class="product-brand-link"]/text()').extract_first()
        item['productName'] = response.xpath('//h1[@class="product-name"]/text()').extract_first()
        item['description'] = response.xpath('//p[@class="product-information-description"]/text()').extract_first()
        item['images_urls'] = response.xpath('//ul[@class="carousel-items row"]//a//@data-img-zoom').extract()
        item['image_medium_url'] = response.xpath('//ul[@class="carousel-items row"]//a//@href').extract_first()
        item['price'] = response.xpath('//span[@class="catalog-detail-price-value"]/text()').extract_first()
        item['url'] = response.url
        item['disabled'] = False
        item['categories'] = None

        # get available sizes
        product_id  = self.get_product_id(response)
        if product_id is not None:
            r = requests.get('https://www.kanui.com.br/product/list/?skus=' + product_id)
            try:
                r_json = r.json()
                sizes_available = r_json[product_id]['sizes_available']
                if isinstance(sizes_available, dict):
                    item['sizes'] = r_json[product_id]['sizes_available'].keys()
                else:
                    item['sizes'] = []
            except ValueError:
                item['sizes'] = []

        categories = response.xpath('//span[@itemprop="title"]/text()').extract()
        if len(categories) > 0:
            categories.pop(0)

        item['categoriesOrigin'] = categories
        gender = self.getCategoryGender(response)
        subCategory = self.getSubCategory(response)
        if gender and subCategory:
            item['categoriesOrigin'] = [gender] + [subCategory] + categories

        item['categoriesOrigin'] = cleaner.normalizeArrayOfText(item['categoriesOrigin'])

        # get normalized category
        if len(item['categoriesOrigin']) >= 2:
            deeperCategoryKey = cleaner.generateKeyFromValues(item['categoriesOrigin'])
            analytic.addCategoryKey('kanui', deeperCategoryKey)
            if deeperCategoryKey in category_mapping.keys():
                item['categories'] = category_mapping[deeperCategoryKey]

        if item['title'] and item['productName'] and item['description'] and item['categories'] and item['images_urls'] and item['brand'] and item['brand'] != '':
            item['site'] = 'kanui'
            yield item
        # walk through categories
        for nextPage in response.xpath('//a[contains(@class, "btn_ga_click title-tertiary cms-title-tertiary title-small title-strong l-row-mini")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        # walk through the pages
        for nextPage in response.xpath('//li[@class="page "]/a/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        # walk through product profile pages
        for nextPage in response.xpath('//a[contains(@class, "product-box-link")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
