# -*- coding: utf-8 -*-
import pytest
from scrapper.spiders.passarela_spider import PassarelaSpider
from utils import fake_response_from_file
from scrapper.items import ClothItem

def test_parse_product_profile():
    response = fake_response_from_file('passarela_product_test.html', 'http://www.passarela.com.br/produto/sapatenis-masculino-polo-royal-sp-marinho-7020957010-0')
    spider = PassarelaSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    cloth = items[0]
    print cloth
    assert isinstance(cloth, ClothItem)
    assert isinstance(cloth['categories'], list)
    assert len(cloth['categories']) == 3
    assert isinstance(cloth['categoriesOrigin'], list)
    assert len(cloth['categoriesOrigin']) == 3
    assert isinstance(cloth['description'], str)
    assert cloth['disabled'] == False
    assert len(cloth['image_urls']) == 6
    assert isinstance(cloth['image_medium_url'], unicode)
    assert isinstance(cloth['productName'], unicode)
    assert cloth['productName'] == u'Sapat\xeanis Masculino Polo Royal Sp - Marinho'
    assert isinstance(cloth['title'], unicode)
    assert cloth['title'] == u'Sapat\xeanis Masculino Polo Royal Sp - Marinho'
    assert 'Por: R$ 189,99' == cloth['price']
    assert cloth['brand'] == None
    assert isinstance(cloth['site'], basestring)
    assert isinstance(cloth['sizes'], list)

def test_parse_links_from_products_in_grid():
    response = fake_response_from_file('passarela_category_grid_test.html', 'http://www.passarela.com.br/vitrine/calcados/masculino/N-26vtZ1z13doy')
    spider = PassarelaSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    assert items[0].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-polo-royal-sp-marinho-7020957010-0'
    assert items[1].url == 'http://www.passarela.com.br/produto/tenis-jogging-masculino-polo-royal-marinho-7240193810-0'
    assert items[2].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-polo-royal-sp-taupe-7020957044-0'
    assert items[3].url == 'http://www.passarela.com.br/produto/tenis-jogging-masculino-polo-royal-grafite-7240193875-0'
    assert items[4].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-polo-royal-sp-preto-7020957012-0'
    assert items[5].url == 'http://www.passarela.com.br/produto/tenis-jogging-masculino-polo-royal-pto-vrm-7240193826-0'
    assert items[6].url == 'http://www.passarela.com.br/produto/chuteira-futsal-masculina-dray-azul-5490179502-0'
    assert items[7].url == 'http://www.passarela.com.br/produto/chuteira-futsal-masculina-dray-preto-5490179512-0'
    assert items[8].url == 'http://www.passarela.com.br/produto/chuteira-society-masculina-dray-azul-5600073002-0'
    assert items[9].url == 'http://www.passarela.com.br/produto/chuteira-masculina-society-dray-preto-5600073012-0'
    assert items[10].url == 'http://www.passarela.com.br/produto/sandalia-masculina-pegada-cafe-7070061011-0'
    assert items[11].url == 'http://www.passarela.com.br/produto/chuteira-society-dray-pto-bco-5600072447-0'
    assert items[12].url == 'http://www.passarela.com.br/produto/chuteira-society-masculina-adidas-ace-17-azu-bco-5600067949-0'
    assert items[13].url == 'http://www.passarela.com.br/produto/tenis-casual-masculino-adidas-lite-racer-marinho-7240187110-0'
    assert items[14].url == 'http://www.passarela.com.br/produto/tenis-casual-masculino-adidas-pace-vs-bco-pto-7240143029-0'
    assert items[15].url == 'http://www.passarela.com.br/produto/tenis-casual-masculino-adidas-cf-racer-tr-verde-7240187415-0'
    assert items[16].url == 'http://www.passarela.com.br/produto/tenis-training-masculino-adidas-duramo-lite-m-preto-7210497212-0'
    assert items[17].url == 'http://www.passarela.com.br/produto/tenis-training-masculino-adidas-cosmic-2-m-preto-7210497512-0'
    assert items[18].url == 'http://www.passarela.com.br/produto/sapato-casual-masculino-pegada-preto-7020864112-0'
    assert items[19].url == 'http://www.passarela.com.br/produto/tenis-casual-uniko-marinho-7240197910-0'
    assert items[20].url == 'http://www.passarela.com.br/produto/tenis-casual-uniko-branco-7240197903-0'
    assert items[21].url == 'http://www.passarela.com.br/produto/tenis-casual-uniko-preto-7240197912-0'
    assert items[22].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-gelo-7020934467-0'
    assert items[23].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-gelo-7020952467-0'
    assert items[24].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-preto-7020952212-0'
    assert items[25].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-preto-7020952312-0'
    assert items[26].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-preto-7020934412-0'
    assert items[27].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-marrom-7020952320-0'
    assert items[28].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-caramelo-7020952283-0'
    assert items[29].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-preto-7020952412-0'
    assert items[30].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-marinho-7020952210-0'
    assert items[31].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-pegada-marinho-7020945210-0'
    assert items[32].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-west-coast-gelo-7020946367-0'
    assert items[33].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-pegada-branco-7020945203-0'
    assert items[34].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-pegada-taupe-7020945244-0'
    assert items[35].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-grafite-7020952475-0'
    assert items[36].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-west-coast-cafe-7020946311-0'
    assert items[37].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-pegada-marinho-7020945110-0'
    assert items[38].url == 'http://www.passarela.com.br/produto/slip-on-masculino-anatomic-gel-caramelo-7020949683-0'
    assert items[39].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-pegada-preto-7020945212-0'
    assert items[40].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-pegada-preto-7020945112-0'
    assert items[41].url == 'http://www.passarela.com.br/produto/chinelo-slide-masculino-cartago-firenze-gaspea-marrom-7080122120-0'
    assert items[42].url == 'http://www.passarela.com.br/produto/tenis-casual-masculino-adidas-pace-vs-pto-azu-7240143024-0'
    assert items[43].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-marinho-7020934510-0'
    assert items[44].url == 'http://www.passarela.com.br/produto/bota-coturno-masculina-urbano-conhaque-7010195618-0'
    assert items[45].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-cafe-7020934411-0'
    assert items[46].url == 'http://www.passarela.com.br/produto/tenis-training-masculino-adidas-cosmic-2-m-marinho-7210497510-0'
    assert items[47].url == 'http://www.passarela.com.br/produto/bota-coturno-masculina-urbano-preto-7010203212-0'
    assert items[48].url == 'http://www.passarela.com.br/produto/sapatenis-masculino-urbano-cafe-7020934511-0'
    assert items[49].url == 'http://www.passarela.com.br/produto/bota-coturno-masculina-urbano-caramelo-7010203283-0'
    assert items[50].url == 'http://www.passarela.com.br/produto/chinelo-slide-masculino-cartago-firenze-gaspea-marinho-7080122110-0'
    assert items[51].url == 'http://www.passarela.com.br/produto/sandalia-masculina-pegada-castanho-7070061093-0'
    assert items[52].url == 'http://www.passarela.com.br/produto/bota-coturno-masculina-urbano-preto-7010195612-0'
    assert items[53].url == 'http://www.passarela.com.br/produto/sandalia-masculina-pegada-taupe-7070059044-0'
    assert items[54].url == 'http://www.passarela.com.br/produto/sandalia-masculina-pegada-preto-7070059012-0'
    assert items[55].url == 'http://www.passarela.com.br/produto/sandalia-masculina-pegada-marrom-7070059020-0'
    assert items[56].url == 'http://www.passarela.com.br/produto/bota-coturno-masculina-urbano-marrom-7010195620-0'
    assert items[57].url == 'http://www.passarela.com.br/produto/bota-coturno-masculina-urbano-preto-7010203312-0'
    assert items[58].url == 'http://www.passarela.com.br/produto/sandalia-masculina-pegada-preto-7070061012-0'
    assert items[59].url == 'http://www.passarela.com.br/produto/bota-coturno-masculina-urbano-marrom-7010203320-0'


def test_parse_links_from_pages_in_grid_category_page():
    response = fake_response_from_file('passarela_category_grid_test.html', 'http://www.passarela.com.br/vitrine/calcados/masculino/N-26vtZ1z13doy')
    spider = PassarelaSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    assert items[103].url == 'http://www.passarela.com.br/vitrine/calcados/masculino/N-26vtZ1z13doy?No=60'
    assert items[104].url == 'http://www.passarela.com.br/vitrine/calcados/masculino/N-26vtZ1z13doy?No=120'
    assert items[105].url == 'http://www.passarela.com.br/vitrine/calcados/masculino/N-26vtZ1z13doy?No=180'
    assert items[106].url == 'http://www.passarela.com.br/vitrine/calcados/masculino/N-26vtZ1z13doy?No=240'

def test_parse_links_from_menu_categories():
    response = fake_response_from_file('passarela_category_grid_test.html', 'http://www.passarela.com.br/vitrine/calcados/masculino/N-26vtZ1z13doy')
    spider = PassarelaSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    assert items[67].url == 'http://www.passarela.com.br/vitrine/calcados/feminino/N-26vtZ1z13eau'
    assert items[68].url == 'http://www.passarela.com.br/vitrine/roupas/feminino/N-26y5Z1z13eau'
    assert items[69].url == 'http://www.passarela.com.br/vitrine/acessorios/feminino/N-26wqZ1z13eau'
    assert items[71].url == 'http://www.passarela.com.br/vitrine/calcados/masculino/N-26vtZ1z13doy'
    assert items[72].url == 'http://www.passarela.com.br/vitrine/roupas/masculino/N-26y5Z1z13doy'
    assert items[73].url == 'http://www.passarela.com.br/vitrine/acessorios/masculino/N-26wqZ1z13doy'
