# -*- coding: utf-8 -*-
import os

# Scrapy settings for scrapper project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#     http://scrapy.readthedocs.org/en/latest/topics/downloader-middleware.html
#     http://scrapy.readthedocs.org/en/latest/topics/spider-middleware.html

import os

# CATEGORY MAPPING SETTINGS
CATEGORY_MAPPING = {
  "dafiti": {
    # lets try to match with a deeper set of categories
    # "feminino-beleza feminina-perfumes":,
    "masculino-roupas masculinas-bermudas": ["masculino", "roupas", "bermudas e shorts"],
    "masculino-calcados masculinos-sandalias": ["masculino", "calcados", "sandalias e chinelos"],
    "feminino-calcados femininos-sandalias": ["feminino", "calcados", "sandalias e chinelos"],
    "feminino-calcados femininos-botas": ["feminino", "calcados", "botas"],
    "feminino-roupas femininas-saias": ["feminino", "roupas", "saias"],
    "masculino-roupas masculinas-camisetas": ["masculino", "roupas", "camisetas"],
    "feminino-bolsas e acessorios femininos-cintos": ["feminino", "acessorios", "cintos"],
    "masculino-calcados masculinos-chinelos": ["masculino", "calcados", "sandalias e chinelos"],
    "feminino-calcados femininos": ["feminino", "calcados"],
    "masculino-calcados masculinos-sapatenis": ["masculino", "calcados", "sapatos", "sapatenis"],
    "masculino-calcados masculinos-sapato casual": ["masculino", "calcados", "sapatos"],
    "feminino-calcados femininos-gladiadoras": ["feminino", "calcados", "rasteiras"],
    # "masculino-bolsas e acessorios masculinos-mochilas e malas": 2,
    "feminino-calcados femininos-calcados infantis": ["feminino", "calcados", "infantil"],
    "feminino-bolsas e acessorios femininos-relogios": ["feminino", "acessorios", "relogios"],
    "feminino-calcados femininos-sapatilhas": ["feminino", "calcados", "sapatilhas"],
    "feminino-roupas femininas-camisas": ["feminino", "roupas", "camisas"],
    "masculino-calcados masculinos": ["masculino", "calcados"],
    "feminino-calcados femininos-scarpin": ["feminino", "calcados", "salto alto", "scarpin"],
    "feminino-calcados femininos-peep toe": ["feminino", "calcados", "salto alto", "peep toe"],
    "masculino-roupas masculinas-moda praia": ["masculino", "roupas", "moda praia"],
    "feminino-roupas femininas-malhas e sueters": ["feminino", "roupas", "agasalhos e sueters"],
    "feminino-roupas femininas-blusas": ["feminino", "roupas", "blusas"],
    "feminino-bolsas e acessorios femininos-bijuterias": ["feminino", "acessorios", "bijuterias"],
    "feminino-calcados femininos-slippers": ["feminino", "calcados", "Slippers"],
    "masculino-roupas masculinas-malhas e sueters": ["masculino", "roupas", "agasalhos e sueters"],
    "feminino-roupas femininas-pijamas e camisolas": ["feminino", "roupas", "pijamas e camisolas"],
    "feminino-roupas femininas-calcas jeans": ["feminino", "roupas", "calcas", "calcas jeans"],
    "infantil-calcados infantis-sandalia": ["infantil", "calcados", "sandalias e chinelos"],
    # "feminino-roupas femininas-roupas masculinas": ,
    "feminino-calcados femininos-espadrille": ["feminino", "calcados", "salto alto", "espadrille"],
    "feminino-calcados femininos-rasteirinhas": ["feminino", "calcados", "rasteiras"],
    "masculino-bolsas e acessorios masculinos-carteiras": ["masculino", "acessorios", "carteiras"],
    # "campanha 18-campanha 21-campanha_crm": 2,
    "masculino-bolsas e acessorios masculinos-relogios": ["masculino", "acessorios", "relogios"],
    "feminino-bolsas e acessorios femininos-carteiras": ["feminino", "acessorios", "carteiras"],
    "feminino-bolsas e acessorios femininos-necessaires": ["masculino", "acessorios", "necessaires"],
    "feminino-calcados femininos-birken": ["feminino", "calcados", "rasteiras", "birken"],
    "feminino-roupas femininas-meias": ["feminino", "roupas", "meias"],
    # "feminino-beleza feminina-maquiagem": 135,
    "masculino-bolsas e acessorios masculinos-cintos": ["masculino", "acessorios", "cintos"],
    "masculino-calcados masculinos-botas": ["masculino", "calcados", "botas"],
    # "feminino-roupas femininas-plus size": 416,
    "masculino-roupas masculinas-camisas":  ["masculino", "roupas", "camisas"],
    # "feminino-bolsas e acessorios femininos-mochilas e malas": ["feminino", "acessorios", "camisas"],
    "feminino-roupas femininas": ["feminino", "roupas"],
    "feminino-calcados femininos-ankle boot": ["feminino", "calcados", "botas", "ankle boots"],
    "feminino-calcados femininos-tamanco": ["feminino", "calcados", "tamanco"],
    "masculino-roupas masculinas-moletons": ["masculino", "roupas", "agasalhos e sueters", "moletons"],
    # "feminino-beleza feminina": 1,
    "masculino-calcados masculinos-sapato social": ["masculino", "calcados", "sapatos", "social"],
    # "feminino-bolsas e acessorios femininos-lencos": 2,
    "masculino-calcados masculinos-alpargatas": ["masculino", "calcados", "sapatos", "alpargatas"],
    "masculino-roupas masculinas-polos": ["masculino", "roupas", "polos"],
    "feminino-calcados femininos-tenis": ["feminino", "calcados", "tenis"],
    # "masculino-roupas masculinas": 3,
    "feminino-calcados femininos-mocassim": ["feminino", "calcados", "mocassim"],
    "feminino-bolsas e acessorios femininos-bolsas": ["feminino", "acessorios", "bolsas"],
    "feminino-calcados femininos-chinelos": ["feminino", "calcados", "sandalias e chinelos"],
    "feminino-calcados femininos-oxford": ["infantil", "calcados", "oxford"],
    # "feminino-casa-decoracao": 1,
    "feminino-roupas femininas-casacos e jaquetas": ["infantil", "roupas", "casacos e jaquetas"],
    "masculino-calcados masculinos-tenis casual": ["masculino", "calcados", "tenis", "casual"],
    "feminino-bolsas e acessorios femininos-bones": ["feminino", "acessorios", "bones"],
    "feminino-roupas femininas-shorts e bermudas": ["feminino", "roupas", "bermudas e shorts"],
    # "feminino-esporte feminino-roupas": 2,
    # "feminino-beleza feminina-tratamento": 2,
    "feminino-roupas femininas-moda praia": ["feminino", "roupas", "moda praia"],
    # "feminino-campanhas 2-campanha 13": 1,
    "masculino-roupas masculinas-calcas casuais": ["masculino", "roupas", "calcas", "casual"],
    # "campanha 18-campanha_crm": 13,
    "feminino-calcados femininos-anabela": ["feminino", "calcados", "Anabela"],
    "masculino-roupas masculinas-calcas jeans": ["masculino", "roupas", "calcas", "calcas jeans"],
    # "masculino-calcados masculinos-calcados femininos": 9,
    "masculino-bolsas e acessorios masculinos-bones e chapeus": ["masculino", "acessorios", "bones e chapeus"],
    "masculino-roupas masculinas-meias": ["masculino", "roupas", "meias"],
    "feminino-roupas femininas-vestidos": ["feminino", "roupas", "vestidos"],
    "feminino-calcados femininos-tenis casual": ["feminino", "calcados", "tenis", "casual"],
    "infantil-calcados infantis-tenis": ["infantil", "calcados", "tenis"],
    "feminino-calcados femininos-sapatos": ["feminino", "calcados", "sapatos"],
    "feminino-bolsas e acessorios femininos-oculos": ["feminino", "acessorios", "oculos"],
    # "campanha 21-campanha_crm": 5,
    "masculino-calcados masculinos-mocassim": ["masculino", "calcados", "mocassim"],
    "feminino-roupas femininas-macaquinhos e macacoes": ["feminino", "roupas", "macaquinhos e macacoes"],
    "feminino-roupas femininas-calcas": ["feminino", "roupas", "calcas"],
    # "feminino-beleza feminina-acessorios": 1,
    "feminino-roupas femininas-lingerie": ["feminino", "roupas", "lingerie"],
    "feminino-roupas femininas-moletom": ["feminino", "roupas", "agasalhos e sueters", "moletom"],
    "masculino-roupas masculinas-casacos e jaquetas": ["masculino", "roupas", "casacos e jaquetas"],
    "masculino-calcados masculinos-tenis": ["masculino", "calcados", "tenis"],
    "feminino-calcados femininos-alpargatas": ["feminino", "calcados", "alpargatas"],
    "infantil-calcados infantis-calcados para bebe": ["infantil", "calcados", "bebe"],
    # simpler keys to match products
    "calcados femininos": ["feminino", "calcados"],
    "calcados masculinos": ["masculino", "calcados"],
    "calcados infantis": ["infantil", "calcados"],
    "esporte masculino": ["masculino", "esporte"],
    "esporte feminino": ["feminino", "esporte"],
    "roupas masculinas": ["masculino", "roupas"],
    "roupas femininas": ["feminino", "roupas"],
    "roupas infantis": ["infantil", "roupas"],
    "bolsas e acessorios masculinos": ["masculino", "acessorios"],
    "bolsas e acessorios femininos": ["feminino", "acessorios"],
    "bolsas e acessorios infantis": ["infantil", "acessorios"]
  },
  "kanui": {
    "unissex-cueca-cueca": ["masculino", "roupas", "intimas", "cuecas"],
    "masculino-meias-meias": ["masculino", "roupas", "meias"],
    "masculino-shorts-roupas": ["masculino", "roupas", "bermudas e shorts"],
    "roupas-bermudas": ["masculino", "roupas", "bermudas e shorts"],
    "masculino-carteiras-carteiras": ["masculino", "acessorios", "carteiras"],
    "masculino-roupas-polos": ["masculino", "roupas", "polos"],
    "feminino-tenis-calcados": ["feminino", "calcados", "tenis"],
    "masculino-calcas-calcas": ["masculino", "roupas", "calcas"],
    "masculino-roupas-camisetas": ["masculino", "roupas", "camisetas"],
    "masculino-cintos-cintos": ["masculino", "acessorios", "cintos"],
    "masculino-camisetas-camisetas": ["masculino", "roupas", "camisetas"],
    "masculino-roupas-shorts": ["masculino", "roupas", "bermudas e shorts"],
    "masculino-acessorios-carteiras": ["masculino", "acessorios", "carteiras"],
    "unissex-camisetas-roupas": ["unissex", "roupas", "camisetas"],
    "masculino-bermudas-bermudas": ["masculino", "roupas", "bermudas e shorts"],
    "masculino-sungas-roupas": ["masculino", "roupas", "moda praia", "sungas"],
    "masculino-bermudas-roupas": ["masculino", "roupas", "bermudas e shorts"],
    "feminino-jaquetas-roupas": ["masculino", "roupas", "casacos e jaquetas"],
    "unissex-moletons-roupas": ["unissex", "roupas", "agasalhos e sueters", "moletons"],
    "masculino-calcas-roupas": ["masculino", "roupas", "calcas"],
    "masculino-camisas-roupas": ["masculino", "roupas", "camisas"],
    "unissex-calcas-roupas": ["unissex", "roupas", "calcas"],
    "feminino-camisas-roupas": ["feminino", "roupas", "camisas"],
    "feminino-polos-polos": ["feminino", "roupas", "polos"],
    "feminino-camisetas-roupas": ["feminino", "roupas", "camisetas"],
    "feminino-carteiras-carteiras": ["feminino", "acessorios", "carteiras"],
    "masculino-jaquetas-roupas": ["masculino", "roupas", "casacos e jaquetas"],
    "masculino-sungas-sungas": ["masculino", "roupas", "moda praia", "sungas"],
    "masculino-roupas-blusas": ["masculino", "roupas", "blusas"],
    "masculino-polos-polos": ["masculino", "roupas", "polos"],
    "masculino-moletons-moletons": ["masculino", "roupas", "agasalhos e sueters", "moletons"],
    "masculino-roupas-meias": ["masculino", "roupas", "meias"],
    "masculino-cintos-acessorios": ["masculino", "acessorios", "cintos"],
    "masculino-botas": ["masculino", "calcados", "botas"],
    "masculino-roupas-camisas": ["masculino", "roupas", "camisas"],
    "masculino-roupas-moletons": ["masculino", "roupas", "agasalhos e sueters", "moletons"],
    "masculino-roupas-calcas": ["masculino", "roupas", "calcas"],
    "masculino-meias-roupas": ["masculino", "roupas", "meias"],
    "masculino-camisas-camisas": ["masculino", "roupas", "camisas"],
    "masculino-polos-roupas": ["masculino", "roupas", "polos"],
    "unissex-meias-meias": ["unissex", "roupas", "meias"],
    "masculino-roupas-sungas": ["masculino", "roupas", "moda praia", "sungas"],
    "masculino-cueca-cueca": ["masculino", "roupas", "intimas", "cuecas"],
    "feminino-camisetas-camisetas": ["feminino", "roupas", "camisetas"],
    "unissex-meias-roupas": ["unissex", "roupas", "meias"],
    "feminino-bodys-bodys": ["feminino", "roupas", "Bodys"],
    "masculino-roupas-bermudas": ["masculino", "roupas", "bermudas e shorts"],
    "masculino-coletes-roupas": ["masculino", "roupas", "coletes"],
    "masculino-cueca-roupas": ["masculino", "roupas", "intimas", "cuecas"],
    "feminino-cueca-roupas": ["masculino", "roupas", "intimas", "cuecas"],
    "masculino-blusas-blusas": ["masculino", "roupas", "blusas"],
    "unissex-bermudas-roupas": ["unissex", "roupas", "bermudas e shorts"],
    "masculino-carteiras-acessorios": ["masculino", "acessorios", "carteiras"],
    "masculino-roupas-jaquetas": ["masculino", "roupas", "casacos e jaquetas"],
    "masculino-moletons-roupas": ["masculino", "roupas", "agasalhos e sueters", "moletons"],
    "masculino-agasalhos-roupas": ["masculino", "roupas", "agasalhos e sueters"],
    "feminino-moletons-roupas": ["feminino", "roupas", "agasalhos e sueters", "moletons"],
    "feminino-bermudas-roupas": ["feminino", "roupas", "bermudas e shorts"],
    "feminino-botas-calcados": ["feminino", "calcados", "botas"],
    "feminino-calcas-roupas": ["feminino", "roupas", "calcas"],
    "masculino-jaquetas-jaquetas": ["masculino", "roupas", "casacos e jaquetas"],
    "masculino-camisetas-roupas":["masculino", "roupas", "camisetas"],
    "masculino-blusas-roupas": ["masculino", "roupas", "blusas"],
    # two levels categories
    "feminino-acessorios": ["feminino", "acessorios"],
    "feminino-agasalhos": ["feminino", "roupas"],
    "feminino-alpargatas": ["feminino", "calcados"],
    "feminino-bermudas": ["feminino", "roupas"],
    "feminino-bijouterias": ["feminino", "acessorios"],
    "feminino-biquinis": ["feminino", "roupas"],
    "feminino-blazers": ["feminino", "roupas"],
    "feminino-blusas": ["feminino", "roupas"],
    "feminino-bodys": ["feminino", "roupas"],
    "feminino-bolsas": ["feminino", "acessorios"],
    "feminino-bones": ["feminino", "acessorios"],
    "feminino-botas": ["feminino", "calcados"],
    "feminino-cachecois": ["feminino", "acessorios"],
    "feminino-calcados": ["feminino", "calcados"],
    "feminino-calcas": ["feminino", "roupas"],
    "feminino-calcinha": ["feminino", "roupas"],
    "feminino-camisas": ["feminino", "roupas"],
    "feminino-camisetas": ["feminino", "roupas"],
    "feminino-carteiras": ["feminino", "acessorios"],
    "feminino-casacos": ["feminino", "roupas"],
    "feminino-casuais": ["feminino", "roupas"],
    "feminino-chinelos": ["feminino", "calcados"],
    "feminino-chuteiras": ["feminino", "esporte"],
    "feminino-ciclismo": ["feminino", "esporte"],
    "feminino-cintos": ["feminino", "acessorios"],
    "feminino-coletes": ["feminino", "roupas"],
    "feminino-cueca": ["feminino", "roupas"],
    "feminino-docksides": ["feminino", "calcados"],
    "feminino-equipamentos": ["feminino", "esporte"],
    "feminino-gorros": ["feminino", "acessorios"],
    "feminino-jaquetas": ["feminino", "roupas"],
    "feminino-jardineiras": ["feminino", "roupas"],
    "feminino-kimonos": ["feminino", "esporte"],
    "feminino-lencos": ["feminino", "roupas"],
    "feminino-lingeries": ["feminino", "roupas"],
    "feminino-luvas": ["feminino", "acessorios"],
    "feminino-macacoes": ["feminino", "roupas"],
    "feminino-macaquinhos": ["feminino", "roupas"],
    "feminino-maios": ["feminino", "roupas"],
    "feminino-meias": ["feminino", "roupas"],
    "feminino-mocassins": ["feminino", "roupas"],
    "feminino-moletons": ["feminino", "roupas"],
    "feminino-oxfords": ["feminino", "calcados"],
    "feminino-polos": ["feminino", "roupas"],
    "feminino-protetores": ["feminino", "esporte"],
    "feminino-relogios": ["feminino", "acessorios"],
    "feminino-roupas": ["feminino", "roupas"],
    "feminino-saias": ["feminino", "roupas"],
    "feminino-sapatenis": ["feminino", "calcados"],
    "feminino-sapatilhas": ["feminino", "calcados"],
    "feminino-shorts": ["feminino", "roupas"],
    "feminino-slippers": ["feminino", "calcados"],
    "feminino-tenis": ["feminino", "calcados"],
    "feminino-tops": ["feminino", "roupas"],
    "feminino-tricots": ["feminino", "roupas"],
    "feminino-vestidos": ["feminino", "roupas"],
    "feminino-viseiras": ["feminino", "esporte"],
    "feminino-wetsuits": ["feminino", "esporte"],
    "masculino-acessorios": ["masculino", "acessorios"],
    "masculino-agasalhos": ["masculino", "roupas"],
    "masculino-alpargatas": ["masculino", "calcados"],
    "masculino-bermuda": ["masculino", "roupas"],
    "masculino-bermudas": ["masculino", "roupas"],
    "masculino-bijouterias": ["masculino", "acessorios"],
    "masculino-blusas": ["masculino", "roupas"],
    "masculino-bolsas": ["masculino", "acessorios"],
    "masculino-bones": ["masculino", "acessorios"],
    "masculino-botas": ["masculino", "calcados"],
    "masculino-cachecois": ["masculino", "acessorios"],
    "masculino-calcados": ["masculino", "calcados"],
    "masculino-calcas": ["masculino", "roupas"],
    "masculino-camisas": ["masculino", "roupas"],
    "masculino-camisetas": ["masculino", "roupas"],
    "masculino-carteiras": ["masculino", "acessorios"],
    "masculino-casacos": ["masculino", "roupas"],
    "masculino-chinelos": ["masculino", "calcados"],
    "masculino-chuteiras": ["masculino", "esporte"],
    "masculino-ciclismo": ["masculino", "esporte"],
    "masculino-cintos": ["masculino", "acessorios"],
    "masculino-coletes": ["masculino", "roupas"],
    "masculino-corrida": ["masculino", "esporte"],
    "masculino-cueca": ["masculino", "roupas"],
    "masculino-equipamentos": ["masculino", "esporte"],
    "masculino-gorros": ["masculino", "acessorios"],
    "masculino-jaquetas": ["masculino", "roupas"],
    "masculino-kimonos": ["masculino", "esporte"],
    "masculino-lingeries": ["masculino", "roupas"],
    "masculino-luvas": ["masculino", "acessorios"],
    "masculino-meias": ["masculino", "roupas"],
    "masculino-mocassins": ["masculino", "roupas"],
    "masculino-moletom": ["masculino", "roupas"],
    "masculino-moletons": ["masculino", "roupas"],
    "masculino-oculos": ["masculino", "acessorios"],
    "masculino-polos": ["masculino", "roupas"],
    "masculino-protetores": ["masculino", "esporte"],
    "masculino-relogios": ["masculino", "acessorios"],
    "masculino-roupas": ["masculino", "roupas"],
    "masculino-sacos": ["masculino", "esporte"],
    "masculino-saias": ["masculino", "roupas"],
    "masculino-sapatenis": ["masculino", "calcados"],
    "masculino-sapatilhas": ["masculino", "calcados"],
    "masculino-shorts": ["masculino", "roupas"],
    "masculino-sungas": ["masculino", "roupas"],
    "masculino-tenis": ["masculino", "calcados"],
    "masculino-vestidos": ["masculino", "roupas"],
    "masculino-wetsuits": ["masculino", "esporte"],
    "menina-acessorios": ["infantil", "acessorios"],
    "menina-bermudas": ["infantil", "roupas"],
    "menina-bijouterias": ["infantil", "acessorios"],
    "menina-blusas": ["infantil", "roupas"],
    "menina-bodys": ["infantil", "roupas"],
    "menina-bolsas": ["infantil", "acessorios"],
    "menina-botas": ["infantil", "calcados"],
    "menina-calcados": ["infantil", "calcados"],
    "menina-camisetas": ["infantil", "roupas"],
    "menina-chinelos": ["infantil", "calcados"],
    "menina-lingeries": ["infantil", "roupas"],
    "menina-macaquinhos": ["infantil", "roupas"],
    "menina-mochilas": ["infantil", "acessorios"],
    "menina-roupas": ["infantil", "roupas"],
    "menina-saias": ["infantil", "roupas"],
    "menina-sapatilhas": ["infantil", "calcados"],
    "menina-slippers": ["infantil", "calcados"],
    "menina-tenis": ["infantil", "calcados"],
    "menina-vestidos": ["infantil", "roupas"],
    "menino-acessorios": ["infantil", "acessorios"],
    "menino-bermudas": ["infantil", "roupas"],
    "menino-botas": ["infantil", "calcados"],
    "menino-calcados": ["infantil", "calcados"],
    "menino-calcas": ["infantil", "roupas"],
    "menino-camisetas": ["infantil", "roupas"],
    "menino-chinelos": ["infantil", "calcados"],
    "menino-cueca": ["infantil", "roupas"],
    "menino-jaquetas": ["infantil", "roupas"],
    "menino-mochilas": ["infantil", "acessorios"],
    "menino-polos": ["infantil", "roupas"],
    "menino-relogios": ["infantil", "acessorios"],
    "menino-roupas": ["infantil", "roupas"],
    "menino-sapatenis": ["infantil", "calcados"],
    "menino-sapatilhas": ["infantil", "calcados"],
    "menino-tenis": ["infantil", "calcados"],
    "unissex-acessorios": ["unissex", "acessorios"],
    "unissex-alpargatas": ["unissex", "roupas"],
    "unissex-bermudas": ["unissex", "roupas"],
    "unissex-bijouterias": ["unissex", "acessorios"],
    "unissex-blusas": ["unissex", "roupas"],
    "unissex-bodys": ["unissex", "roupas"],
    "unissex-bolsas": ["unissex", "acessorios"],
    "unissex-bones": ["unissex", "acessorios"],
    "unissex-botas": ["unissex", "roupas"],
    "unissex-cachecois": ["unissex", "roupas"],
    "unissex-calcados": ["unissex", "roupas"],
    "unissex-calcas": ["unissex", "roupas"],
    "unissex-camisas": ["unissex", "roupas"],
    "unissex-camisetas": ["unissex", "roupas"],
    "unissex-carteiras": ["unissex", "acessorios"],
    "unissex-chinelos": ["unissex", "roupas"],
    "unissex-ciclismo": ["unissex", "esporte"],
    "unissex-cintos": ["unissex", "acessorios"],
    "unissex-corrida": ["unissex", "esporte"],
    "unissex-cueca": ["unissex", "roupas"],
    "unissex-equipamentos": ["unissex", "esporte"],
    "unissex-jaquetas": ["unissex", "roupas"],
    "unissex-kimonos": ["unissex", "esporte"],
    "unissex-lingeries": ["unissex", "roupas"],
    "unissex-luvas": ["unissex", "roupas"],
    "unissex-meias": ["unissex", "roupas"],
    "unissex-mocassins": ["unissex", "roupas"],
    "unissex-mochilas": ["unissex", "roupas"],
    "unissex-moletons": ["unissex", "roupas"],
    "unissex-oculos": ["unissex", "acessorios"],
    "unissex-protetores": ["unissex", "esporte"],
    "unissex-relogios": ["unissex", "acessorios"],
    "unissex-roupas": ["unissex", "roupas"],
    "unissex-sapatenis": ["unissex", "roupas"],
    "unissex-sapatilhas": ["unissex", "roupas"],
    "unissex-shorts": ["unissex", "roupas"],
    "unissex-sungas": ["unissex", "roupas"],
    "unissex-tenis": ["unissex", "roupas"],
    "unissex-toucas": ["unissex", "acessorios"],
    "unissex-vestidos": ["unissex", "roupas"],
    "unissex-wetsuits": ["unissex", "esporte"]
  },
  # TODO need to figure it out why its not crawling for all categories
  "farfetch": {
    "kids-luxe-meninas - roupa infantil": ["infantil", "roupas"],
    "kids-luxe-roupa infantil": ["infantil", "roupas"],
    "kids-luxe-roupa para bebe": ["infantil", "roupas"],
    "kids-luxe-roupas para bebe menina": ["infantil", "roupas"],
    "men-luxe-acessorios": ["masculino", "acessorios"],
    "men-luxe-bijoux & joias": ["masculino", "acessorios"],
    "men-luxe-bolsas": ["masculino", "acessorios"],
    "men-luxe-fitness": ["masculino", "esporte"],
    "men-luxe-roupas": ["masculino", "roupas"],
    "men-luxe-sapatos": ["masculino", "calcados"],
    "unisex-luxe-acessorios": ["unissex", "acessorios"],
    "unisex-luxe-bijoux & joias": ["unissex", "acessorios"],
    "unisex-luxe-bolsas": ["unissex", "acessorios"],
    "unisex-luxe-fitness": ["unissex", "esporte"],
    "unisex-luxe-roupas": ["unissex", "roupas"],
    "unisex-luxe-sapatos": ["unissex", "calcados"],
    "women-luxe-acessorios": ["feminino", "acessorios"],
    "women-luxe-bijoux & joias": ["feminino", "acessorios"],
    "women-luxe-bolsas": ["feminino", "acessorios"],
    "women-luxe-fitness": ["feminino", "esporte"],
    "women-luxe-roupas": ["feminino", "roupas"],
    "women-luxe-sapatos": ["feminino", "calcados"]
  },
  "passarela": {
    "masculino-calcados-chuteiras": ["masculino", "calcados", "chuteiras"],
    "feminino-acessorios-carteiras": ["feminino", "acessorios", "carteiras"],
    "feminino-roupas-calcas e calcas jeans": ["feminino", "roupas", "calcas"],
    "infantil-roupas-saias": ["infantil", "roupas", "saias"],
    "masculino-roupas-camisetas": ["masculino", "roupas", "camisetas"],
    "feminino-roupas-agasalhos e conjuntos": ["feminino", "roupas", "agasalhos e sueters"],
    "masculino-roupas-casacos e jaquetas": ["masculino", "roupas", "casacos e jaquetas"],
    "infantil-calcados-sapatenis": ["infantil", "calcados", "sapatenis"],
    "masculino-calcados-sapatilhas": ["masculino", "calcados", "sapatilhas"],
    "masculino-roupas-coletes": ["masculino", "roupas", "coletes"],
    "masculino-roupas-calcas e calcas jeans": ["masculino", "roupas", "calcas"],
    "masculino-acessorios-carteiras": ["masculino", "acessorios", "carteiras"],
    "feminino-acessorios-bijuterias": ["feminino", "acessorios", "bijuterias"],
    "infantil-acessorios-bolsas": ["infantil", "acessorios", "bolsas"],
    "feminino-moda intima-lingeries": ["feminino", "roupas", "lingerie"],
    "infantil-roupas-camisas": ["infantil", "roupas", "camisas"],
    "infantil-calcados-chuteiras": ["feminino", "calcados", "chuteiras"],
    "masculino-calcados-sandalias": ["masculino", "calcados", "sandalias"],
    "feminino-acessorios-oculos": ["feminino", "acessorios", "oculos"],
    "feminino-calcados-espadrille": ["feminino", "calcados", "espadrille"],
    "infantil-roupas-casacos e jaquetas": ["infantil", "roupas", "casacos e jaquetas"],
    "feminino-calcados-peep toe": ["feminino", "calcados", "peep toe"],
    "infantil-acessorios-esportivos": ["infantil", "acessorios", "esportivos"],
    "masculino-roupas-agasalhos e conjuntos": ["masculino", "roupas", "agasalhos e sueters"],
    "infantil-roupas-macacoes e macaquinhos": ["infantil", "roupas", "macaquinhos e macacoes"],
    "masculino-moda intima-cuecas": ["masculino", "roupas", "intimas", "cuecas"],
    "masculino-roupas-blusas": ["masculino", "roupas", "blusas"],
    "masculino-roupas-moda praia": ["masculino", "roupas", "moda praia"],
    "masculino-calcados-sapatos": ["masculino", "calcados", "sapatos"],
    "masculino-calcados-tenis": ["masculino", "calcados", "tenis"],
    "masculino-calcados-espadrille": ["masculino", "calcados", "espadrille"],
    "infantil-calcados-tamancos": ["infantil", "calcados", "tamancos"],
    "unissex-calcados-chinelos": ["unissex", "calcados", "chinelos"],
    "masculino-roupas-camisas": ["masculino", "roupas", "camisas"],
    "infantil-roupas-calcas e calcas jeans": ["infantil", "roupas", "calcas"],
    "infantil-calcados-sapatos": ["infantil", "calcados", "sapatos"],
    "feminino-calcados-tamancos": ["feminino", "calcados", "sapatos"],
    "masculino-roupas-moletons": ["masculino", "roupas", "agasalhos e sueters", "moletons"],
    "feminino-acessorios-bolsas": ["feminino", "acessorios", "bolsas"],
    "infantil-roupas-moletons": ["infantil", "roupas", "agasalhos e sueters", "moletons"],
    "masculino-calcados-chinelos": ["masculino", "calcados", "chinelos"],
    "feminino-calcados-sandalias": ["feminino", "calcados", "sandalias"],
    "masculino-acessorios-cintos": ["masculino", "acessorios", "cintos"],
    "feminino-roupas-bermudas e shorts": ["feminino", "roupas", "bermudas e shorts"],
    "masculino-calcados-botas": ["masculino", "calcados", "botas"],
    "infantil-roupas-blusas": ["infantil", "roupas", "blusas"],
    "infantil-calcados-sapatilhas": ["infantil", "calcados", "sapatilhas"],
    "infantil-calcados-chinelos": ["infantil", "calcados", "chinelos"],
    "feminino-roupas-vestidos": ["feminino", "roupas", "vestidos"],
    "feminino-roupas-camisetas": ["feminino", "roupas", "camisetas"],
    "feminino-moda intima-meias": ["feminino", "roupas", "meias"],
    "infantil-roupas-agasalhos e conjuntos":  ["infantil", "roupas", "agasalhos e sueters"],
    "masculino-acessorios-bolsas": ["masculino", "acessorios", "bolsas"],
    "masculino-acessorios-chapeus e bones": ["masculino", "acessorios", "bones e chapeus"],
    "infantil-calcados-sandalias": ["infantil", "calcados", "sandalias"],
    "feminino-roupas-camisas": ["feminino", "roupas", "camisas"],
    "infantil-roupas-vestidos": ["infantil", "roupas", "vestidos"],
    "infantil-roupas-coletes": ["infantil", "roupas", "coletes"],
    "feminino-calcados-sapatos": ["feminino", "calcados", "sapatos"],
    "feminino-acessorios-cintos": ["feminino", "acessorios", "cintos"],
    "feminino-calcados-botas": ["feminino", "calcados", "botas"],
    "infantil-roupas-bodies": ["infantil", "roupas", "bodies"],
    "feminino-roupas-moletons": ["feminino", "roupas", "agasalhos e sueters", "moletons"],
    "infantil-roupas-camisetas": ["infantil", "roupas", "camisetas"],
    "infantil-roupas-bermudas e shorts": ["infantil", "roupas", "bermudas e shorts"],
    "infantil-moda intima-meias": ["infantil", "roupas", "meias"],
    "infantil-calcados-botas": ["infantil", "calcados", "botas"],
    "feminino-calcados-tenis": ["feminino", "calcados", "tenis"],
    "feminino-acessorios-mochilas": ["feminino", "acessorios", "mochilas"],
    "feminino-roupas-casacos e jaquetas": ["feminino", "roupas", "casacos e jaquetas"],
    "infantil-calcados-tenis": ["infantil", "calcados", "tenis"],
    "feminino-calcados-mules": ["feminino", "calcados", "mules"],
    "infantil-calcados-espadrille": ["infantil", "calcados", "mules"],
    "infantil-roupas-moda praia": ["infantil", "roupas", "moda praia"],
    "feminino-roupas-blusas": ["feminino", "roupas", "blusas"],
    "feminino-calcados-sapatilhas": ["feminino", "calcados", "sapatilhas"],
    "feminino-roupas-coletes": ["feminino", "roupas", "coletes"],
    "feminino-roupas-macacoes e macaquinhos": ["feminino", "roupas", "macaquinhos e macacoes"],
    "feminino-roupas-saias": ["feminino", "roupas", "saias"],
    "masculino-roupas-bermudas e shorts": ["masculino", "roupas", "bermudas e shorts"],
    "feminino-roupas-moda praia": ["feminino", "roupas", "moda praia"],
    "feminino-calcados-chinelos": ["feminino", "calcados", "chinelos"],
    "masculino-calcados-sapatenis": ["masculino", "calcados", "sapatenis"],
    "masculino-moda intima-meias": ["masculino", "roupas", "meias"],
    #two level categories
    "feminino-acessorios-lencos e echarpes": ["feminino", "acessorios"],
    "feminino-acessorios": ["feminino", "acessorios"],
    "feminino-calcados": ["feminino", "calcados"],
    "feminino-moda intima": ["feminino", "roupas"],
    "feminino-roupas": ["feminino", "roupas"],
    "infantil-acessorios": ["infantil", "acessorios"],
    "infantil-calcados": ["infantil", "calcados"],
    "infantil-moda intima": ["infantil", "roupas"],
    "infantil-roupas": ["infantil", "roupas"],
    "masculino-acessorios": ["masculino", "acessorios"],
    "masculino-calcados": ["masculino", "calcados"],
    "masculino-moda intima": ["masculino", "roupas"],
    "masculino-roupas": ["masculino", "roupas"],
    "unissex-acessorios": ["unissex", "acessorios"]
  }
}

BOT_NAME = 'scrapper'

SPIDER_MODULES = ['spiders']
NEWSPIDER_MODULE = 'spiders'

LOG_LEVEL='ERROR'


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'scrapper (+http://www.yourdomain.com)'

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# Configure maximum concurrent requests performed by Scrapy (default: 16)
#CONCURRENT_REQUESTS = 32

# Configure a delay for requests for the same website (default: 0)
# See http://scrapy.readthedocs.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
#DOWNLOAD_DELAY = 3
# The download delay setting will honor only one of:
#CONCURRENT_REQUESTS_PER_DOMAIN = 16
#CONCURRENT_REQUESTS_PER_IP = 16

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
#DEFAULT_REQUEST_HEADERS = {
#   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
#   'Accept-Language': 'en',
#}

# Enable or disable spider middlewares
# See http://scrapy.readthedocs.org/en/latest/topics/spider-middleware.html
# SPIDER_MIDDLEWARES = {
#     'scrapy_splash.SplashDeduplicateArgsMiddleware': 100,
# }

# Enable or disable downloader middlewares
# See http://scrapy.readthedocs.org/en/latest/topics/downloader-middleware.html
# DOWNLOADER_MIDDLEWARES = {
#     'scrapy_splash.SplashCookiesMiddleware': 723,
#     'scrapy_splash.SplashMiddleware': 725,
#     'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810,
# }

# Scrapy currently doesn’t provide a way to override request fingerprints calculation globally,
# so you will also have to set a custom DUPEFILTER_CLASS and a custom cache storage backend:
# DUPEFILTER_CLASS = 'scrapy_splash.SplashAwareDupeFilter'
# HTTPCACHE_STORAGE = 'scrapy_splash.SplashAwareFSCacheStorage'

# Enable or disable extensions
# See http://scrapy.readthedocs.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    'scrapy.extensions.telnet.TelnetConsole': None,
#}

# Configure item pipelines
# See http://scrapy.readthedocs.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
    # 'scrapy.pipelines.images.ImagesPipeline': 1,
    'pipelines.CleanPipeline': 100,
    'pipelines.MongoDBPipeline': 200
}

# IMAGE DIRECTORY
# IMAGES_STORE = os.path.abspath(os.path.dirname(__file__)) + '/spiders/images'

# ALLOW IMAGE REDIRECT
MEDIA_ALLOW_REDIRECTS = True

# SPLASH_URL = 'http://localhost:8050/'


# PROD DB
MONGODB_CONNECTION_STRING = os.environ['DB_HOST']
MONGODB_PORT = os.environ['DB_PORT']
MONGODB_DB = os.environ['DB_DATABASE']
MONGODB_COLLECTION = os.environ['COLLECTION_CLOTHES']
MONGODB_COLLECTION_PRICE_LOG = os.environ['COLLECTION_PRICE_HISTORY']

# Enable and configure the AutoThrottle extension (disabled by default)
# See http://doc.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See http://scrapy.readthedocs.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = 'httpcache'
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'
