import scrapy
import os
import re
import json
from scrapy.spiders import Spider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapper.items import ClothItem
from scrapy_splash import SplashRequest
from scrapy.conf import settings

'''
This website fetchs the JSON response inside the HTML, and you can grab every information with a regex.
The JSON looks like this:
{
  "id": "11818883",
  "storeId": 10327,
  "name": "Bangle dourado e preto",
  "description": "Bangle dourado e preto , Versace. Possui estrutura curvada.",
  "designerName": "Versace",
  "manufacturerId": 6803,
  "manufacturer": "Versace",
  "categoryId": 135977,
  "category": "Bijoux & Joias",
  "subcategoryId": 136053,
  "subCategoryId": 136053,
  "subcategory": "Pulseiras",
  "subCategory": "Pulseiras",
  "skuCode": "11818883",
  "sku_code": "11818883",
  "unitPrice": 3980.00,
  "unit_price": 3980.00,
  "unitSalePrice": 3980.00,
  "unit_sale_price": 3980.00,
  "currencyCode": "BRL",
  "CurrencyCode": "BRL",
  "currency": "BRL",
  "imageUrl": "https://cdn-images.farfetch-contents.com/11/81/88/83/11818883_8801291_240.jpg",
  "image_url": "https://cdn-images.farfetch-contents.com/11/81/88/83/11818883_8801291_240.jpg",
  "url": "/br/shopping/women/versace-bangle-dourado-e-preto-item-11818883.aspx?storeid=10327",
  "hasStock": true,
  "totalStock": 1,
  "stock": 1,
  "color": "",
  "department": "Luxe",
  "gender": "Women",
  "designerStyleId": "DG0F748DJMS"
}
'''

class FarfetchSpider(Spider):
    name = 'farfetch'
    allowed_domains = ['farfetch.com']
    start_urls = [ 'https://www.farfetch.com' ]

    # Splash hibernated code
    # def start_requests(self):
    #     print '#### START URL: ',self.start_urls
    #     for url in self.start_urls:
    #         yield SplashRequest(url, self.parse,
    #         endpoint='render.html',
    #         args={'wait': 10},
    #         )

    def parse(self, response):
        category_mapping = settings['CATEGORY_MAPPING']['farfetch']
        # scrap item
        item = ClothItem()
        m = re.search(r"(?s)window.universal_variable.product\s*=\s*(\{.*?\});", response.body)
        if m:
            # scrap item
            data = json.loads(m.group(1))
            item['title'] = data['manufacturer']
            item['productName'] = data['name']
            item['description'] = data['description']
            item['url'] = response.url
            categories = []
            categories.append(data['gender'])
            categories.append(data['department'])
            categories.append(data['category'])
            categories.append(data['subCategory'])
            item['disabled'] = False
            item['categoriesOrigin'] = categories
            item['categories'] = None
            item['image_urls'] = response.xpath('//a[@class="sliderProduct-link js-rollover"]/img//@data-fullsrc').extract()

        # get normalized category
        if m and len(item['categoriesOrigin']) >= 3:
            key = '-'.join(item['categoriesOrigin'][0:3])
            key = key.lower()
            if key in category_mapping.keys():
                item['categories'] = category_mapping[key]

        if m and item['title'] and item['productName'] and item['description'] and item['categories'] and item['image_urls']:
            yield item
        # following links
        for nextPage in response.xpath('//a[contains(@class, "blankLink")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//a[contains(@class, "ff-nav-a")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
        for nextPage in response.xpath('//a[contains(@class, "listing-item-content")]/@href').extract():
            nextPage = response.urljoin(nextPage)
            yield scrapy.Request(nextPage, callback=self.parse)
