import json, re, os, scrapy, requests, logging
import utils.cleaner as cleaner
import utils.analytic as analytic
from scrapy.spiders import Spider, Rule
from scrapy.linkextractors import LinkExtractor
from items import ClothItem
from scrapy_splash import SplashRequest
from scrapy.conf import settings

# create logger
logger = logging.getLogger('closetinn')

# create logger
logger = logging.getLogger('closetinn')

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
        category_mapping = self.settings['CATEGORY_MAPPING']['farfetch']
        # scrap item
        item = ClothItem()
        m = re.search(r"(?s)window.universal_variable.product\s*=\s*(\{.*?\});", response.body)
        if m:
            # scrap item
            data = json.loads(m.group(1))
            item['title'] = data['manufacturer']
            item['brand'] = data['manufacturer']
            item['price'] = data['unitSalePrice']
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
            item['categoriesOrigin'] = cleaner.normalizeArrayOfText(item['categoriesOrigin'])
            item['categories'] = None
            item['images_urls'] = response.xpath('//a[@class="sliderProduct-link js-rollover"]/img//@data-fullsrc').extract()
            item['image_medium_url'] = response.xpath('//a[@class="sliderProduct-link js-rollover"]/img//@data-medium').extract_first()

            product_id = data['id']
            store_id = data['storeId']
            category_id = data['categoryId']
            designer_id = data['manufacturerId']

            if product_id is not None and store_id is not None:
                url = 'https://www.farfetch.com/br/product/GetDetailState?productId='+product_id+'&storeId='+str(store_id)+'&sizeId=&categoryId='+str(category_id)+'&designerId='+str(designer_id)
                r = requests.get(url)
                try:
                    r_json = r.json()
                    item['sizes'] = []
                    available_sizes = r_json['SizesInformationViewModel']['AvailableSizes']
                    for size  in available_sizes:
                        item['sizes'].append(size['Description'])
                except ValueError:
                    print '[ERROR] NO JSON FOUND WHEN TRYING TO GET AVAILABLE SIZES: ', data

        # get normalized category
        if m and len(item['categoriesOrigin']) > 0:
            deeperCategoryKey = cleaner.generateKeyFromValues(item['categoriesOrigin'])
            analytic.addCategoryKey('farfetch', deeperCategoryKey)
            print 'CATEGORIES:', deeperCategoryKey
            if deeperCategoryKey in category_mapping.keys():
                item['categories'] = category_mapping[deeperCategoryKey]

        if m and item['title'] and item['productName'] and item['description'] and item['categories'] and item['images_urls'] and item['brand'] and item['brand'] != '':
            item['site'] = 'farfetch'
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
