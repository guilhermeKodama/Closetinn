'''
 Here we need to map the ProductData from Zanox to our own schema.
 Our Schema:
 {
    categoriesOrigin: Array,
    description: String,
    title: String,
    url: String,
    gender: String,
    price: Float,
    sizes: Array,
    image_medium_url: String,
    images_urls: Array,
    productName: String,
    disabled: Boolean,
    site: String,
    brand: String,
    categories: Array,
    trackingUrl: String
 }

 ProductData Schema:
 {
    -- Important attributes --
    MerchantProductMainCategory: String,
    ProductPrice: String,
    ProductPriceOld: String,
    ImageLargeURL: String,
    ImageMediumURL: String,
    ImageSmallURL: String,
    ProductManufacturerBrand: String,
    Gender: String,
    AdditionalImage1: String,
    AdditionalImage2: String,
    AdditionalImage3: String,
    ProductURL: String,
    ZanoxProductLink: String,
    ProductShortDescription: String,
    ProductName: String,
    CurrencySymbolOfPrice: String,
    Size: String (ex: "M0, M1, M2")

    -- Non used attributes --
    MerchantProductThirdCategory: String,
    ProductColor: String,
    DeliveryTime: String,
    ZanoxCategoryIds: String,
    ExtraTextNine: String,
    ProductMaterial: String,
    UpdateDate: String,
    BasePrice: String,
    ISBN: String,
    ValidFromDate: String,
    ProductGTIN: String,
    TermsOfContract: String,
    ShippingAndHandling: String,
    ExtraTextFour: String,
    StockStatus: String,
    SavingsPercent: String,
    MerchantProductCategoryPath: String,
    SizeStockAmount: String,
    ExtraTextSix: String,
    ExtraTextTwo: String,
    SavingsAbsolute: String,
    BasePriceAmount: String,
    MerchantProductSubCategory: String,
    BasePriceText: String,
    ValidToDate: String,
    ExtraTextEight: String,
    ExtraTextThree: String,
    ShippingAndHandlingCosts: String,
    ExtraTextOne: String,
    ProductCondition: String,
    ExtraTextSeven: String,
    Zupid: String,
    MerchantProductNumber: String,
    ProductModel: String,
    ProductLongDescription: String,
    StockAmount: String,
    ProgramId: String,
    SizeStockStatus: String,
    AdditionalProductFeatures: String,
    ProductEAN: String,
    ExtraTextFive: String
 }
'''
def cleanGender(product, doc):
    if not doc['Gender']:
        if product['gender'] == '' and 'masculino' in doc['MerchantProductCategoryPath']:
            product['gender'] = 'masculino'
        else:
            product['gender'] = 'feminino'
    else:
        product['gender'] = doc['Gender']
    return product

def cleanCategories(product, doc):
    if doc['Gender']:
        product['categories'] = [
            product['gender'],
            doc['MerchantProductCategoryPath'],
            doc['MerchantProductMainCategory']
        ]
    else:
        product['categories'] = []
        categories = doc['MerchantProductCategoryPath'].split('/')
        if len(categories) == 3:
            product['categories'] = [
                categories[2].strip(),
                categories[0].strip() if categories[0].strip() != 'vestuarios' else 'roupas',
                categories[1].strip()
            ]
        else:
            product['categories'] = None
    return product


def mapProductAttributes(doc):
    product = {}
    product['origin'] = 'zanox'
    product['description'] = doc['ProductShortDescription']
    product['title'] = doc['ProductManufacturerBrand']
    product['url'] = doc['ProductURL']
    product['gender'] = doc['Gender']
    product['color'] = doc['ProductColor']
    product['price'] = float(doc['ProductPrice'])
    if doc['ProductPriceOld']:
        product['priceOld'] = float(doc['ProductPriceOld'])
        product['priceDiscount'] = 1 - float(product['price'] / product['priceOld'])
    product['sizes'] = doc['Size'].replace(' ', '').split(',')
    product['image_medium_url'] = doc['ImageMediumURL']
    product['images_urls'] = [doc['AdditionalImage1'], doc['AdditionalImage2'], doc['AdditionalImage3']]
    product['productName'] = doc['ProductName']
    product['disabled'] = False
    product['site'] = 'dafiti'
    product['brand'] = doc['ProductManufacturerBrand'].lower()
    product['trackingUrl'] = doc['ZanoxProductLink']

    product = cleanGender(product, doc)
    product = cleanCategories(product, doc)

    return product

def mapKanuiProductAttributes(doc):
    product = {}
    product['origin'] = 'zanox'
    product['description'] = doc['ProductShortDescription']
    product['title'] = doc['ProductManufacturerBrand']
    product['url'] = 'https://www.kanui.com.br' + doc['ProductURL']
    product['gender'] = doc['Gender']
    product['color'] = doc['ProductColor']
    product['price'] = float(doc['ProductPrice'])
    if doc['ProductPriceOld']:
        product['priceOld'] = float(doc['ProductPriceOld'])
        product['priceDiscount'] = 1 - float(product['price'] / product['priceOld'])
    product['sizes'] = doc['Size'].replace(' ', '').split(',')
    product['image_medium_url'] = doc['ImageMediumURL']
    product['images_urls'] = [doc['AdditionalImage1'], doc['AdditionalImage2'], doc['AdditionalImage3']]
    product['productName'] = doc['ProductName']
    product['disabled'] = False
    product['site'] = 'kanui'
    product['brand'] = doc['ProductManufacturerBrand']
    product['trackingUrl'] = doc['ZanoxProductLink']

    product = cleanGender(product, doc)
    product = cleanCategories(product, doc)

    return product
