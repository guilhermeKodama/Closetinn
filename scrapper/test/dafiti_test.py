# -*- coding: utf-8 -*-
import pytest
from scrapper.spiders.dafiti_spider import DafitiSpider
from utils import fake_response_from_file
from scrapper.items import ClothItem

def test_parse_product_profile():
    response = fake_response_from_file('dafiti_product_test.html', 'https://www.dafiti.com.br/')
    spider = DafitiSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    cloth = items[0]
    assert isinstance(cloth, ClothItem)
    assert isinstance(cloth['categories'], list)
    assert len(cloth['categories']) == 3
    assert isinstance(cloth['categoriesOrigin'], list)
    assert len(cloth['categoriesOrigin']) == 4
    assert isinstance(cloth['description'], unicode)
    assert cloth['disabled'] == False
    assert len(cloth['image_urls']) == 4
    assert isinstance(cloth['image_medium_url'], unicode)
    assert isinstance(cloth['productName'], unicode)
    assert cloth['productName'] == 'Bermuda Sarja Zebra Wahoo Azul'
    assert isinstance(cloth['title'], unicode)
    assert 'Zebra' in cloth['title']  # we clean this in the CleanPipeline
    print cloth['price']
    assert '\n                    R$ 59,99                ' == cloth['price']
    assert isinstance(cloth['brand'], basestring)
    assert isinstance(cloth['site'], basestring)
    assert isinstance(cloth['sizes'], list)

def test_parse_links_from_products_in_grid():
    response = fake_response_from_file('dafiti_category_grid_test.html', 'https://www.dafiti.com.br/')
    spider = DafitiSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)

    assert items[1].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Zebra-Wahoo-Azul-1873471.html'
    assert items[2].url == 'https://www.dafiti.com.br/Bermuda-Zebra-Gunnison-Cargo-Cinza-1873479.html'
    assert items[3].url == 'https://www.dafiti.com.br/Bermuda-Jeans-FiveBlu-Luiten-Azul-2405444.html'
    assert items[4].url == 'https://www.dafiti.com.br/Bermuda-Moletom-Gladiadores-Preto-3067980.html'
    assert items[5].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Volcom-Chino-Walk-Bege-2635278.html'
    assert items[6].url == 'https://www.dafiti.com.br/Short-Nike-Layup-2.0-Preto%2FBranco-2069819.html'
    assert items[7].url == 'https://www.dafiti.com.br/Bermuda-Jeans-Doc-Dog-Authentic-Azul-2451460.html'
    assert items[8].url == 'https://www.dafiti.com.br/Bermuda-Agua-Reef-Elastico-Blossoms-Preta-2117269.html'
    assert items[9].url == 'https://www.dafiti.com.br/Bermuda-adidas-Originals-SST-Azul-Marinho-2006071.html'
    assert items[10].url == 'https://www.dafiti.com.br/Bermuda-Colcci-Benjamin-Vermelha-2822103.html'
    assert items[11].url == 'https://www.dafiti.com.br/Bermuda-FiveBlu-Horizont-Azul%2FBranca%2FPreta-2871405.html'
    assert items[12].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Juice-It-Cilu-Azul-2459330.html'
    assert items[13].url == 'https://www.dafiti.com.br/Bermuda-Agua-Reef-Elastico-Tex-Azul-2117263.html'
    assert items[14].url == 'https://www.dafiti.com.br/Bermuda-Zebra-Patagonia-Cinza-1873475.html'
    assert items[15].url == 'https://www.dafiti.com.br/Bermuda-Jeans-Doc-Dog-Authentic-Azul-2451461.html'
    assert items[16].url == 'https://www.dafiti.com.br/Bermuda-Moletom-Gladiadores-Mescla-3067976.html'
    assert items[17].url == 'https://www.dafiti.com.br/Bermuda-Agua-Juice-it-Palm-Stripes-Verde-2272877.html'
    assert items[18].url == 'https://www.dafiti.com.br/Bermuda-Agua--RED-BULL-RBB-Bolt-Azul-2777490.html'
    assert items[19].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Oakley-Reta-Bege-2381240.html'
    assert items[20].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Hurley-Cos-O%26O-Chino-Vinho-2499028.html'
    assert items[21].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Hang-Loose-Salt-Chino-Azul-2634693.html'
    assert items[22].url == 'https://www.dafiti.com.br/Bermuda-Jeans-Fatal-Surf-Slim-Azul-3065630.html'
    assert items[23].url == 'https://www.dafiti.com.br/Bermuda-Jeans-Fatal-Surf-Slim-Azul-3065637.html'
    assert items[24].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Juice-It-Blue-Lines-Azul-2409700.html'
    assert items[25].url == 'https://www.dafiti.com.br/Bermuda-Jeans-Koenig-Sky-Beach-Azul-3289434.html'
    assert items[26].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Volcom-Chino-Walk-Caramelo-2635279.html'
    assert items[27].url == 'https://www.dafiti.com.br/Bermuda-Jeans-Fatal-Amassados-Azul-2497361.html'
    assert items[28].url == 'https://www.dafiti.com.br/Bermuda-Agua-Reef-Blossoms-Preta-2117477.html'
    assert items[29].url == 'https://www.dafiti.com.br/Bermuda-Agua-Reef-Elastico-Blossoms-Azul-2117265.html'
    assert items[30].url == 'https://www.dafiti.com.br/Bermuda--Arsenal-Sw-Listra-Golds-Branca-3287348.html'
    assert items[31].url == 'https://www.dafiti.com.br/Bermuda-Forum-Xadrez-Laranja-1780067.html'
    assert items[32].url == 'https://www.dafiti.com.br/Bermuda-Jeans-Mr-Kitsch-Essential-Azul-2459297.html'
    assert items[33].url == 'https://www.dafiti.com.br/Bermuda-HD-Walk-9505-Coral-Azul-2012195.html'
    assert items[34].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Volcom-Chino-Walk-Cinza-2635277.html'
    assert items[35].url == 'https://www.dafiti.com.br/Bermuda-Agua-FiveBlu-Waimea-Azul-2272776.html'
    assert items[36].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Grifle-Ancoras-Azul-Marinho-3015848.html'
    assert items[37].url == 'https://www.dafiti.com.br/Bermuda-RED-BULL-Logo-Cinza-2160420.html'
    assert items[38].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Hang-Loose-Salt-Chino-Bege-2634692.html'
    assert items[39].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Volcom-Chino-Walk-Preto-2635280.html'
    assert items[40].url == 'https://www.dafiti.com.br/Bermuda-Jeans-FiveBlu-Paris-Azul-2385797.html'
    assert items[41].url == 'https://www.dafiti.com.br/Bermuda-Khelf-Sarja-Bolso-Faca-Cinza-3259615.html'
    assert items[42].url == 'https://www.dafiti.com.br/Bermuda-Sarja-Oakley-Essential-5-Pockets-Cinza-2894964.html'
    assert items[43].url == 'https://www.dafiti.com.br/Short-Nike-Dry-Academy-K-Preta-2606955.html'
    assert items[44].url == 'https://www.dafiti.com.br/Short-Nike-Hbr-Vermelho-2069827.html'
    assert items[45].url == 'https://www.dafiti.com.br/Bermuda-Agua-FiveBlu-Estampada-Verde%2FBranca-2272817.html'
    assert items[46].url == 'https://www.dafiti.com.br/Bermuda-Agua-Hang-Loose-Stripe-Azul%2FMarrom-2116983.html'
    assert items[47].url == 'https://www.dafiti.com.br/Bermuda-Nike-NSW-JSY-Club-Preta-2189096.html'
    assert items[48].url == 'https://www.dafiti.com.br/Bermuda-Rusty-Moletom-Night-Azul-Marinho-2634802.html'

def test_parse_links_from_pages_in_grid_category_page():
    response = fake_response_from_file('dafiti_category_grid_test.html', 'https://www.dafiti.com.br/')
    spider = DafitiSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        items.append(item)
    assert items[49].url == 'https://www.dafiti.com.br/roupas-masculinas/bermudas/?page=2'
    assert items[50].url == 'https://www.dafiti.com.br/roupas-masculinas/bermudas/?page=3'
    assert items[51].url == 'https://www.dafiti.com.br/roupas-masculinas/bermudas/?page=59'

def test_parse_links_from_menu_categories():
    response = fake_response_from_file('dafiti_category_grid_test.html', 'https://www.dafiti.com.br/')
    spider = DafitiSpider()
    items = []
    for index, item in enumerate(spider.parse(response)):
        # print('INDEX:', index, 'ITEM:', item)
        items.append(item)
    assert items[417].url == 'https://www.dafiti.com.br/feminino/'
    assert items[418].url == 'https://www.dafiti.com.br/masculino/'
    assert items[419].url == 'https://www.dafiti.com.br/infantil/'
    assert items[52].url == 'https://www.dafiti.com.br/calcados-femininos/'
    assert items[64].url == 'https://www.dafiti.com.br/roupas-femininas/'
    assert items[76].url == 'https://www.dafiti.com.br/bolsas-e-acessorios-femininos/'
    assert items[321].url == 'https://www.dafiti.com.br/esporte-feminino/'
    assert items[122].url == 'https://www.dafiti.com.br/calcados-masculinos/'
    assert items[134].url == 'https://www.dafiti.com.br/roupas-masculinas/'
    assert items[146].url == 'https://www.dafiti.com.br/bolsas-e-acessorios-masculinos/'
    assert items[158].url == 'https://www.dafiti.com.br/esporte-masculino/'
    assert items[190].url == 'https://www.dafiti.com.br/calcados-infantis/'
    assert items[202].url == 'https://www.dafiti.com.br/roupas-infantis/'
    assert items[214].url == 'https://www.dafiti.com.br/bolsas-e-acessorios-infantis/'
