# -*- coding: utf-8 -*-
import pytest
from scrapper.spiders.kanui_spider import KanuiSpider
from utils import fake_response_from_file
from scrapper.items import ClothItem

def test_parse_product_profile():
    response = fake_response_from_file('kanui_product_test.html', 'https://www.kanui.com.br/')
    spider = KanuiSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    cloth = items[0]
    print cloth
    assert isinstance(cloth, ClothItem)
    assert isinstance(cloth['categories'], list)
    assert len(cloth['categories']) == 3
    assert isinstance(cloth['categoriesOrigin'], list)
    assert len(cloth['categoriesOrigin']) == 5
    assert isinstance(cloth['description'], unicode)
    assert cloth['disabled'] == False
    assert len(cloth['image_urls']) == 5
    assert isinstance(cloth['image_medium_url'], unicode)
    assert isinstance(cloth['productName'], unicode)
    assert cloth['productName'] == u'Bermuda Água FiveBlu Jatir 8 Cinza/Verde'
    assert isinstance(cloth['title'], unicode)
    assert 'FiveBlu' in cloth['title']  # we clean this in the CleanPipeline
    print cloth['price']
    assert '\n                    R$ 99,90                ' == cloth['price']
    assert isinstance(cloth['brand'], basestring)
    assert isinstance(cloth['site'], basestring)
    assert isinstance(cloth['sizes'], list)

def test_parse_links_from_products_in_grid():
    response = fake_response_from_file('kanui_category_grid_test.html', 'https://www.kanui.com.br/')
    spider = KanuiSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    assert items[22].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-Jatir-8-Cinza%2FVerde-3042666.html'
    assert items[23].url == 'https://www.kanui.com.br/Bermuda-Agua-Urgh-Bosch-Verde%2FAmarela-3032177.html'
    assert items[24].url == 'https://www.kanui.com.br/Bermuda-Zoo-York-Nebula-Cinza-2775319.html'
    assert items[25].url == 'https://www.kanui.com.br/Bermuda-Agua-Reef-Elastico-Tex-Azul-2117263.html'
    assert items[26].url == 'https://www.kanui.com.br/Bermuda-Agua-Urgh-Skull-Cinza-3032174.html'
    assert items[27].url == 'https://www.kanui.com.br/Bermuda-Zoo-York-Stripes-Azul-marinho-2775318.html'
    assert items[28].url == 'https://www.kanui.com.br/Bermuda-Arsenal-Mest-Estampado-2161836.html'
    assert items[29].url == 'https://www.kanui.com.br/Bermuda-Rusty-Borders-Cinza-2634805.html'
    assert items[30].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-Clouds-Branca%2FAzul-2871400.html'
    assert items[31].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-Apuana-23-Preta%2FVermelha-3042664.html'
    assert items[32].url == 'https://www.kanui.com.br/Bermuda-Zoo-York-Stripes-Cinza-Claro-2775338.html'
    assert items[33].url == 'https://www.kanui.com.br/Bermuda-Agua-Hang-Loose-Classic-Preto-2845831.html'
    assert items[34].url == 'https://www.kanui.com.br/Bermuda-Diezo-Geometrica-Off-White-3311287.html'
    assert items[35].url == 'https://www.kanui.com.br/Bermuda-Diezo-Com-Bolsos-Azul-Bebe-3311296.html'
    assert items[36].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-On-Tone-Palms-Vermelha-2272867.html'
    assert items[37].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Military-Army-Camufled-Preto-3142731.html'
    assert items[38].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Basic-Preto-3142712.html'
    assert items[39].url == 'https://www.kanui.com.br/Bermuda-Agua-Reef-Elastico-Blossoms-Preta-2117269.html'
    assert items[40].url == 'https://www.kanui.com.br/Bermuda-Jeans-Polo-Wear-Comfort-Azul-3227557.html'
    assert items[41].url == 'https://www.kanui.com.br/Bermuda-Sarja-Grifle-Reta-Azul-3015852.html'
    assert items[42].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-Estampada-Coral-2272772.html'
    assert items[43].url == 'https://www.kanui.com.br/Bermuda-Sarja-Coca-Cola-Jeans-Fit-Vinho-3142927.html'
    assert items[44].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-The-Snow-Estampado-3165563.html'
    assert items[45].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-Estampada-Preta%2FCinza-2272815.html'
    assert items[46].url == 'https://www.kanui.com.br/Calca-Redley-Elastico-Azul-3139346.html'
    assert items[47].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Snow-Forest-Estampado-3165560.html'
    assert items[48].url == 'https://www.kanui.com.br/Bermuda-6am-Demim-Azul-3256553.html'
    assert items[49].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-Jupi-17-Azul%2FPreta-3042665.html'
    assert items[50].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-Poti6-Azul-3043340.html'
    assert items[51].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Nascer-do-Sol-Estampado-3165592.html'
    assert items[52].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Colorful-Sand-Preto-3142703.html'
    assert items[53].url == 'https://www.kanui.com.br/Bermuda-Redley-Tag-Cinza-3083526.html'
    assert items[54].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Basic-Preto-3142714.html'
    assert items[55].url == 'https://www.kanui.com.br/Bermuda-Moletom-Imperial-Rosa-3286810.html'
    assert items[56].url == 'https://www.kanui.com.br/Bermuda-Off-Wear-Jeans-3306558.html'
    assert items[57].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Basic-Camufled-Preto-3142718.html'
    assert items[58].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Aqua-Azul-3165579.html'
    assert items[59].url == 'https://www.kanui.com.br/Bermuda-Dri-Fit-Chess-Clothing-Cinza-Mescla-3264833.html'
    assert items[60].url == 'https://www.kanui.com.br/Bermuda-Dri-Fit-Chess-Clothing-Cinza-Mescla-Escuro-3264827.html'
    assert items[61].url == 'https://www.kanui.com.br/Bermuda-Agua-MASH-Slim-Cinza-3079725.html'
    assert items[62].url == 'https://www.kanui.com.br/Bermuda-Sarja-Vans-Mavcovinash-Azul-Marinho-2952302.html'
    assert items[63].url == 'https://www.kanui.com.br/Bermuda-Globe-Active-Preta-2822379.html'
    assert items[64].url == 'https://www.kanui.com.br/Bermuda-Black-Trunks-Boardshort-Synergy--Branco-3142701.html'
    assert items[65].url == 'https://www.kanui.com.br/Bermuda-Broken-Rules-Chino-Bege-3207614.html'
    assert items[66].url == 'https://www.kanui.com.br/Bermuda-Khelf-Sarja-Bolso-Faca-Azul-Marinho-3259834.html'
    assert items[67].url == 'https://www.kanui.com.br/Bermuda-Agua-MASH-Estampada-Cinza-3079730.html'
    assert items[68].url == 'https://www.kanui.com.br/Bermuda-Broken-Rules-Chino-Preta%2FAzul-3207618.html'
    assert items[69].url == 'https://www.kanui.com.br/Bermuda-Agua-FiveBlu-On-Tone-Palms-Verde-2272781.html'

def test_parse_links_from_pages_in_grid_category_page():
    response = fake_response_from_file('kanui_category_grid_test.html', 'https://www.kanui.com.br/')
    spider = KanuiSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    assert items[18].url == 'https://www.kanui.com.br/roupas-masculinas/bermudas/?page=2'
    assert items[19].url == 'https://www.kanui.com.br/roupas-masculinas/bermudas/?page=3'
    assert items[20].url == 'https://www.kanui.com.br/roupas-masculinas/bermudas/?page=58'

def test_parse_links_from_menu_categories():
    response = fake_response_from_file('kanui_category_grid_test.html', 'https://www.kanui.com.br/')
    spider = KanuiSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    assert items[0].url == 'https://www.kanui.com.br/roupas-masculinas/'
    assert items[1].url == 'https://www.kanui.com.br/calcados-masculinos/'
    assert items[2].url == 'https://www.kanui.com.br/acessorios-masculinos/'
    assert items[3].url == 'https://www.kanui.com.br/roupas-femininas/'
    assert items[4].url == 'https://www.kanui.com.br/calcados-femininos/'
    assert items[5].url == 'https://www.kanui.com.br/acessorios-femininos/'
