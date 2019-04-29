import scrapy, os, json, unicodedata
from scrapy.spiders import Spider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapper.items import ClothItem
from scrapy.conf import settings

class PassarelaSpider(Spider):
    name = 'passarela'
    allowed_domains = ['passarela.com.br']
    start_urls = [ 'http://www.passarela.com.br/']

    def getCategoryGender(self, response):
        url = response.url
        if 'masculino' in url or 'masculina' in url:
            return 'masculino'
        elif 'feminino' in url or 'feminina' in url:
            return 'feminino'
        elif 'infantil' in url:
            return 'infantil'
        elif 'unissex' in url:
            return 'unissex'
        else:
            return None

    def parse(self, response):
        category_mapping = settings['CATEGORY_MAPPING']['passarela']
        # scrap item
        item = ClothItem()
        item['title'] = response.xpath('//h1[@id="nome-detalhe-produto"]/text()').extract_first()
        item['productName'] = response.xpath('//h1[@id="nome-detalhe-produto"]/text()').extract_first()
        item['description'] = ''.join(response.xpath('//div[@id="detalheProduto"]//dl//dd//text()').extract())
        item['image_urls'] = response.xpath('//div[@id="elevateZoomGallery"]//a//@data-zoom-image').extract()
        item['url'] = response.url
        item['disabled'] = False
        item['categories'] = None

        categories = response.xpath('//div[@class="area-breadcrumb"]//a/text()').extract()
        if len(categories) > 0:
            categories.pop(0)

        item['categoriesOrigin'] = categories
        gender = self.getCategoryGender(response)
        if gender:
            item['categoriesOrigin'] = [gender] + categories

        # get normalized category
        if len(item['categoriesOrigin']) >= 2:
            key = '-'.join(item['categoriesOrigin'][0:2])
            key = key.lower()
            key = unicodedata.normalize('NFD', key).encode('ascii', 'ignore')
            if key in category_mapping.keys():
                item['categories'] = category_mapping[key]

        if item['title'] and item['productName'] and item['categories'] and item['image_urls']:
            yield item
        # following links
        for nextPage in response.xpath('//a[contains(@class, "linkProdutoEndeca")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//a[contains(@class, "rrProductLink")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//a[contains(@class, "submenu")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//li[@class="ver-mais"]//a/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//div[@class="conteudo"]//a/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//a[@class="page-link"]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
