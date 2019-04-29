# -*- coding: utf-8 -*-
import scrapy, os, unidecode, json, re, unicodedata
from scrapy.spiders import Spider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapper.items import ClothItem
from scrapy.conf import settings

categoryIndex = {}
class KanuiSpider(Spider):
    name = 'kanui'
    allowed_domains = ['kanui.com.br']
    start_urls = [ 'https://www.kanui.com.br/' ]

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
        category_mapping = settings['CATEGORY_MAPPING']['kanui']
        # scrap item
        item = ClothItem()
        item['title'] = response.xpath('//a[@class="product-brand-link"]/text()').extract_first()
        item['productName'] = response.xpath('//h1[@class="product-name"]/text()').extract_first()
        item['description'] = response.xpath('//p[@class="product-information-description"]/text()').extract_first()
        item['image_urls'] = response.xpath('//ul[@class="carousel-items row"]//a//@data-img-zoom').extract()
        item['url'] = response.url
        item['disabled'] = False
        item['categories'] = None

        categories = response.xpath('//span[@itemprop="title"]/text()').extract()
        if len(categories) > 0:
            categories.pop(0)

        item['categoriesOrigin'] = categories
        gender = self.getCategoryGender(response)
        subCategory = self.getSubCategory(response)
        if gender and subCategory:
            item['categoriesOrigin'] = [gender] + [subCategory] + categories

        # get normalized category
        if len(item['categoriesOrigin']) >= 2:
            key = '-'.join(item['categoriesOrigin'][0:2])
            key = key.lower()
            if key in category_mapping.keys():
                item['categories'] = category_mapping[key]

        if item['title'] and item['productName'] and item['description'] and item['categories'] and item['image_urls']:
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
