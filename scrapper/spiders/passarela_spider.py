import scrapy, os, json, unicodedata, logging
import utils.cleaner as cleaner
import utils.analytic as analytic
from scrapy.spiders import Spider, Rule
from scrapy.linkextractors import LinkExtractor
from items import ClothItem

# create logger
logger = logging.getLogger('closetinn')

class PassarelaSpider(Spider):
    name = 'passarela'
    allowed_domains = ['passarela.com.br']
    start_urls = [ 'http://www.passarela.com.br/']

    def get_price(self, response):
        prices = response.xpath('//span[@itemprop="price"]/b/text()').extract()
        if prices is not None:
            if len(prices) > 1:
                return prices[1]
            elif len(prices) > 0:
                return prices[0]
        return None

    def get_sizes(self, response):
        sizes = response.xpath('//ul[@id="tamanhos"]//li/a/text()').extract()
        return sizes
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
        category_mapping = self.settings['CATEGORY_MAPPING']['passarela']
        # scrap item
        item = ClothItem()
        item['title'] = response.xpath('//h1[@id="nome-detalhe-produto"]/text()').extract_first()
        item['brand'] = None
        item['productName'] = response.xpath('//h1[@id="nome-detalhe-produto"]/text()').extract_first()
        item['description'] = ''.join(response.xpath('//div[@id="detalheProduto"]//dl//dd//text()').extract())
        item['images_urls'] = response.xpath('//div[@id="elevateZoomGallery"]//a//@data-zoom-image').extract()
        item['image_medium_url'] = response.xpath('//div[@id="elevateZoomGallery"]//a//@data-image').extract_first()
        item['price'] = self.get_price(response)
        item['url'] = response.url
        item['disabled'] = False
        item['categories'] = None
        item['sizes'] = self.get_sizes(response)

        categories = response.xpath('//div[@class="area-breadcrumb"]//a/text()').extract()
        if len(categories) > 0:
            categories.pop(0)

        item['categoriesOrigin'] = categories
        gender = self.getCategoryGender(response)
        if gender:
            item['categoriesOrigin'] = [gender] + categories

        item['categoriesOrigin'] = cleaner.normalizeArrayOfText(item['categoriesOrigin'])

        # get normalized category
        if len(item['categoriesOrigin']) >= 2:
            deeperCategoryKey = cleaner.generateKeyFromValues(item['categoriesOrigin'])
            analytic.addCategoryKey('passarela', deeperCategoryKey)
            if deeperCategoryKey in category_mapping.keys():
                item['categories'] = category_mapping[deeperCategoryKey]

        if item['title'] and item['productName'] and item['categories'] and item['images_urls'] and item['brand'] and item['brand'] != '':
            item['site'] = 'passarela'
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
