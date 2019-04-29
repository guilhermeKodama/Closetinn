# -*- coding: utf-8 -*-
import pytest, sys, mock, pymongo, os
from mock import patch, Mock
from bson.objectid import ObjectId
import cronjobs.jobs.syncData as syncDataJob
import cronjobs.jobs.utils.map as map

dafitiCsvURL = "http://productdata.zanox.com/exportservice/v1/rest/44509136C245333048.csv?ticket=FF92BE1AFC70DC9E7A3839D153BA2788&productIndustryId=1&columnDelimiter=,&textQualifier=DoubleQuote&nullOutputFormat=NullValue&dateFormat=yyyy-MM-dd'T'HH:mm:ss:SSS&decimalSeparator=period&id=&pg=&nb=&na=&pp=&po=&cy=&du=&ds=&dl=&tm=&mc=&c1=&c2=&c3=&ia=&im=&il=&df=&dt=&lk=&ss=&sa=&af=&sp=&sv=&x1=&x2=&x3=&x4=&x5=&x6=&x7=&x8=&x9=&zi=&ea=&gt=&is=&td=&bp=&ba=&bt=&sh=&sn=&pc=&zs=&za=&mn=&mo=&co=&ma=&sz=&gn=&i1=&i2=&i3=&gZipCompress=yes"

# set env to test
os.environ['CLOSETINN_ENV'] = 'test'

# seed test base
connection = pymongo.MongoClient('mongodb://localhost:27017/fashionbot-test')
db = connection['fashionbot-test']
collectionClothes = db['clothes']

similarestMock = {
  "categoriesOrigin": ["masculino", "botas", " Calçados ", " Botas "],
  "description": "Bota Zoo York Ilhoses Preto",
  "title": "Zoo York",
  "url": "https://www.dafitisports.com.br/Tenis-Zoo-York-TextureC0464-Preto-2958984.html",
  "gender": "masclino",
  "brand": "zoo york",
  "sizes": ["39", "38", "40", "41"],
  "image_medium_url": "https://t-static.dafiti.com.br/B0_2H4BAhePLiHizi8clIf2vhJ8=/fit-in/430x623/dafitistatic-a.akamaihd.net%2fp%2fzoo-york-bota-zoo-york-ilhoses-preto-6792-0218003-1-zoom.jpg",
  "image_urls": ["https://dafitistatic-a.akamaihd.net/p/Zoo-York-Bota-Zoo-York-Ilhoses-Preto-6792-0218003-1-zoom.jpg", "https://dafitistatic-a.akamaihd.net/p/Zoo-York-Bota-Zoo-York-Ilhoses-Preto-6797-0218003-2-zoom.jpg", "https://dafitistatic-a.akamaihd.net/p/Zoo-York-Bota-Zoo-York-Ilhoses-Preto-6799-0218003-3-zoom.jpg", "https://dafitistatic-a.akamaihd.net/p/Zoo-York-Bota-Zoo-York-Ilhoses-Preto-6823-0218003-4-zoom.jpg"],
  "productName": "Bota Zoo York Ilhoses Preto",
  "disabled": False,
  "site": "kani",
  '_id': ObjectId("5a48c8f0f32c59c97e3547f7"),
  "price": 74.99,
  "categories": ["Masculino", "Calçados"]
}

mappedProductData = {
    'color': 'preto',
    'origin': 'zanox',
    'categories': ['masculino', 'calcados', 'tenis'],
    'description': 'Compre T\xc3\xaanis Zoo York TextureC0464 Preto por R$ 99.90',
    'title': 'Zoo York',
    'url': 'https://www.dafitisports.com.br/Tenis-Zoo-York-TextureC0464-Preto-2958984.html',
    'gender': 'masculino',
    'price': 99.90,
    'priceDiscount': 0.44469149527515284,
    'priceOld': 179.9,
    'sizes': ['40', '41'],
    'image_medium_url': '',
    'images_urls': ['https://dafitistatic-a.akamaihd.net/4898592/2-zoom.jpg', 'https://dafitistatic-a.akamaihd.net/4898592/3-zoom.jpg', ''],
    'productName': 'T\xc3\xaanis Zoo York TextureC0464 Preto',
    'disabled': False,
    'site': 'dafiti',
    'brand': 'zoo york',
    'trackingUrl': 'http://ad.zanox.com/ppc/?44509136C245333048&ULP=[[https://www.dafitisports.com.br/Tenis-Zoo-York-TextureC0464-Preto-2958984.html?utm_source=1294241759&utm_medium=af&utm_campaign=textlink&utm_content=tenis&utm_term=ZO802SHM15JFC]]'
    }

productData = {
    'MerchantProductThirdCategory': '',
    'ProductColor': 'preto',
    'DeliveryTime': '',
    'ZanoxCategoryIds': '',
    'ExtraTextNine': '',
    'ProductMaterial': '',
    'UpdateDate': '15/02/2018 21:05:00',
    'BasePrice': '',
    'ISBN': '',
    'ImageLargeURL': 'https://dafitistatic-a.akamaihd.net/4898592/1-zoom.jpg',
    'ValidFromDate': '',
    'MerchantProductMainCategory': 'tenis',
    'ProductGTIN': '',
    'TermsOfContract': '',
    'ProductPrice': '99.90',
    'ShippingAndHandling': '',
    'ExtraTextFour': '',
    'StockStatus': '',
    'SavingsPercent': '',
    'MerchantProductCategoryPath': 'calcados',
    'ProductPriceOld': '179.90',
    'SizeStockAmount': '',
    'ExtraTextSix': '',
    'ExtraTextTwo': '',
    'SavingsAbsolute': '',
    'ImageMediumURL': '',
    'BasePriceAmount': '',
    'MerchantProductSubCategory': '',
    'ImageSmallURL': '',
    'BasePriceText': '',
    'ProductManufacturerBrand': 'Zoo York',
    'ValidToDate': '',
    'ExtraTextEight': '',
    'ExtraTextThree': '',
    'AdditionalImage2': 'https://dafitistatic-a.akamaihd.net/4898592/3-zoom.jpg',
    'AdditionalImage3': '',
    'Gender': 'masculino',
    'AdditionalImage1': 'https://dafitistatic-a.akamaihd.net/4898592/2-zoom.jpg',
    'ShippingAndHandlingCosts': '',
    'ProductURL': 'https://www.dafitisports.com.br/Tenis-Zoo-York-TextureC0464-Preto-2958984.html',
    'ExtraTextOne': 'Parcela:3x de R$33,30',
    'ProductCondition': '',
    'ExtraTextSeven': '',
    'Zupid': 'cecc4a306d86d60428ea88425b85d356',
    'ZanoxProductLink': 'http://ad.zanox.com/ppc/?44509136C245333048&ULP=[[https://www.dafitisports.com.br/Tenis-Zoo-York-TextureC0464-Preto-2958984.html?utm_source=1294241759&utm_medium=af&utm_campaign=textlink&utm_content=tenis&utm_term=ZO802SHM15JFC]]',
    'MerchantProductNumber': 'S_ZO802SHM15JFC',
    'ProductModel': '',
    'ProductLongDescription': '',
    'StockAmount': '',
    'ProductShortDescription': 'Compre T\xc3\xaanis Zoo York TextureC0464 Preto por R$ 99.90',
    'ProductName': 'T\xc3\xaanis Zoo York TextureC0464 Preto',
    'CurrencySymbolOfPrice': 'BRL',
    'ProgramId': '10770',
    'SizeStockStatus': '',
    'AdditionalProductFeatures': '',
    'ProductEAN': '',
    'ExtraTextFive': '',
    'Size': '40, 41'
    }

@pytest.fixture(autouse=True)
def run_around_tests():
    # Code that will run before your test, for example:
    collectionClothes.delete_many({})
    collectionClothes.update(
        { '_id': ObjectId("5a48c8f0f32c59c97e3547f7") },
        similarestMock,
        upsert=True
    )
    results = collectionClothes.find({})
    for result in results:
        print 'DOC:', result['_id']
    # A test function will be run at this point
    yield
    # Code that will run after your test, for example:
    collectionClothes.delete_many({})

# This method will be used by the mock to replace requests.get
def mocked_requests_get(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    return MockResponse({
    'products': [
         {'id':'5a48c8f0f32c59c97e3547f7', 'distance': 0.95}
         ]
    }, 200)

# This method will be used by the mock to replace requests.get to fail
def mocked_requests_get_fail(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    return MockResponse({
    'products': [
         {'id':'5a48c8f0f32c59c97e3547f7', 'distance': 0.5} # low distance
         ]
    }, 200)

# This method will be used by the mock to replace requests.put
def mocked_requests_put(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    print 'URL:', args[0]
    return MockResponse({'resut': 'ok' }, 200)

def mocked_gziped_file(*args, **kwargs):
    class MockResponse:
        def read(self):
            return open('./zanox-dafiti.csv.gz', 'r').read()

    return MockResponse()

@patch('cronjobs.jobs.syncData.urllib2.urlopen', side_effect=mocked_gziped_file)
@patch('cronjobs.jobs.syncData.requests.get', side_effect=mocked_requests_get)
@patch('cronjobs.jobs.syncData.requests.put', side_effect=mocked_requests_put)
def test_download_right_file(mock_urlopen, mock_similarest, mock_update_model):

    with mock.patch.object(syncDataJob, 'updateProduct', wraps=syncDataJob.updateProduct) as monkey:
        syncDataJob.run(dafitiCsvURL, 'dafiti')

        assert len(monkey.call_args_list) == 10

@patch('cronjobs.jobs.syncData.urllib2.urlopen')
@patch('cronjobs.jobs.syncData.requests.get', side_effect=mocked_requests_get)
def test_map_product(mock_urlopen, mock_get):
    result = map.mapProductAttributes(productData)

    assert result == mappedProductData

@patch('cronjobs.jobs.syncData.urllib2.urlopen')
@patch('cronjobs.jobs.syncData.requests.get', side_effect=mocked_requests_get)
def test_categories_classification(mock_urlopen, mock_get):
    result = map.mapProductAttributes(productData)
    assert result == mappedProductData

    similarest = syncDataJob.getMostSimilarProduct(result)
    print 'SIMILARES:', similarest
    assert similarest['productName'] == 'Bota Zoo York Ilhoses Preto'

@patch('cronjobs.jobs.syncData.requests.get', side_effect=mocked_requests_get)
def test_update_with_similarest_found_and_found_in_db(mock_similarest):
    result = map.mapProductAttributes(productData)
    assert result == mappedProductData

    updatedProduct = syncDataJob.updateProduct(result)
    print updatedProduct

    # should just update the record we have in db
    # assert updatedProduct == {'updatedExisting': True, u'nModified': 1, u'ok': 1.0, u'n': 1}

@patch('cronjobs.jobs.syncData.requests.get', side_effect=mocked_requests_get_fail)
def test_update_with_similarest_not_found_and_not_found_in_db(mock_similarest):
    print mappedProductData
    # delete products from database so any one is found to update
    collectionClothes.delete_many({})

    result = map.mapProductAttributes(productData)
    assert result == mappedProductData

    updatedProduct = syncDataJob.updateProduct(result)
    print updatedProduct

    # should dump in unclassified collection
    assert updatedProduct == None
