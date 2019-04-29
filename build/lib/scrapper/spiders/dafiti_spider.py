# -*- coding: utf-8 -*-
import scrapy, os, json, unidecode
from scrapy.spiders import Spider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapper.items import ClothItem
from scrapy.conf import settings

class DafitiSpider(Spider):
    name = 'dafiti'
    allowed_domains = ['dafiti.com.br']
    start_urls = [ 'https://www.dafiti.com.br/' ]

    def parse(self, response):
        category_mapping = settings['CATEGORY_MAPPING']['dafiti']
        # scrap item
        item = ClothItem()
        item['title'] = response.xpath('//a[@class="product-brand-link"]/text()').extract_first()
        item['productName'] = response.xpath('//h1[@class="product-name"]/text()').extract_first()
        item['description'] = response.xpath('//p[@class="product-information-description"]/text()').extract_first()
        item['image_urls'] = response.xpath('//a[@class="gallery-thumb"]//@data-img-zoom').extract()
        item['url'] = response.url
        item['disabled'] = False
        item['categories'] = None

        categories = response.xpath('//span[@itemprop="title"]/text()').extract()
        if len(categories) > 0:
            categories.pop(0)

        item['categoriesOrigin'] = categories

        if len(item['categoriesOrigin']) >= 2:
            categoryKey = item['categoriesOrigin'][1]
            categoryKey = categoryKey.lower()
            categoryKey = unidecode.unidecode(categoryKey)
            categoryKey = categoryKey.strip()
            if categoryKey in category_mapping.keys():
                item['categories'] = category_mapping[categoryKey]

        if item['title'] and item['productName'] and item['description'] and item['categories'] and item['image_urls']:
            yield item
        # following links
        # //*[@id="wrapper"]/div[4]/div[2]/div[3]/div/div[3]/div[1]/ul/li[2]/a
        for nextPage in response.xpath('//a[contains(@class, "product-box-link")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//li[@class="page "]/a/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//a[contains(@class, "menu-dropdown-link")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//a[contains(@class, "menu-link")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
