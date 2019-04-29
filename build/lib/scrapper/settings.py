# -*- coding: utf-8 -*-

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
    "calcados femininos": ["Feminino", "Calçados"],
    "calcados masculinos": ["Masculino", "Calçados"],
    "calcados infantis": ["Infantil", "Calçados"],
    "esporte masculino": ["Masculino", "Esporte"],
    "esporte feminino": ["Feminino", "Esporte"],
    "roupas masculinas": ["Masculino", "Roupas"],
    "roupas femininas": ["Feminino", "Roupas"],
    "roupas infantis": ["Infantil", "Roupas"],
    "bolsas e acessorios masculinos": ["Masculino", "Acessórios"],
    "bolsas e acessorios femininos": ["Feminino", "Acessórios"],
    "bolsas e acessorios infantis": ["Infantil", "Acessórios"]
  },
  "kanui": {
    "feminino-acessorios": ["Feminino", "Acessórios"],
    "feminino-agasalhos": ["Feminino", "Roupas"],
    "feminino-alpargatas": ["Feminino", "Calçados"],
    "feminino-bermudas": ["Feminino", "Roupas"],
    "feminino-bijouterias": ["Feminino", "Acessórios"],
    "feminino-biquinis": ["Feminino", "Roupas"],
    "feminino-blazers": ["Feminino", "Roupas"],
    "feminino-blusas": ["Feminino", "Roupas"],
    "feminino-bodys": ["Feminino", "Roupas"],
    "feminino-bolsas": ["Feminino", "Acessórios"],
    "feminino-bones": ["Feminino", "Acessórios"],
    "feminino-botas": ["Feminino", "Calçados"],
    "feminino-cachecois": ["Feminino", "Acessórios"],
    "feminino-calcados": ["Feminino", "Calçados"],
    "feminino-calcas": ["Feminino", "Roupas"],
    "feminino-calcinha": ["Feminino", "Roupas"],
    "feminino-camisas": ["Feminino", "Roupas"],
    "feminino-camisetas": ["Feminino", "Roupas"],
    "feminino-carteiras": ["Feminino", "Acessórios"],
    "feminino-casacos": ["Feminino", "Roupas"],
    "feminino-casuais": ["Feminino", "Roupas"],
    "feminino-chinelos": ["Feminino", "Calçados"],
    "feminino-chuteiras": ["Feminino", "Esporte"],
    "feminino-ciclismo": ["Feminino", "Esporte"],
    "feminino-cintos": ["Feminino", "Acessórios"],
    "feminino-coletes": ["Feminino", "Roupas"],
    "feminino-cueca": ["Feminino", "Roupas"],
    "feminino-docksides": ["Feminino", "Calçados"],
    "feminino-equipamentos": ["Feminino", "Esporte"],
    "feminino-gorros": ["Feminino", "Acessórios"],
    "feminino-jaquetas": ["Feminino", "Roupas"],
    "feminino-jardineiras": ["Feminino", "Roupas"],
    "feminino-kimonos": ["Feminino", "Esporte"],
    "feminino-lencos": ["Feminino", "Roupas"],
    "feminino-lingeries": ["Feminino", "Roupas"],
    "feminino-luvas": ["Feminino", "Acessórios"],
    "feminino-macacoes": ["Feminino", "Roupas"],
    "feminino-macaquinhos": ["Feminino", "Roupas"],
    "feminino-maios": ["Feminino", "Roupas"],
    "feminino-meias": ["Feminino", "Roupas"],
    "feminino-mocassins": ["Feminino", "Roupas"],
    "feminino-moletons": ["Feminino", "Roupas"],
    "feminino-oxfords": ["Feminino", "Calçados"],
    "feminino-polos": ["Feminino", "Roupas"],
    "feminino-protetores": ["Feminino", "Esporte"],
    "feminino-relogios": ["Feminino", "Acessórios"],
    "feminino-roupas": ["Feminino", "Roupas"],
    "feminino-saias": ["Feminino", "Roupas"],
    "feminino-sapatenis": ["Feminino", "Calçados"],
    "feminino-sapatilhas": ["Feminino", "Calçados"],
    "feminino-shorts": ["Feminino", "Roupas"],
    "feminino-slippers": ["Feminino", "Calçados"],
    "feminino-tenis": ["Feminino", "Calçados"],
    "feminino-tops": ["Feminino", "Roupas"],
    "feminino-tricots": ["Feminino", "Roupas"],
    "feminino-vestidos": ["Feminino", "Roupas"],
    "feminino-viseiras": ["Feminino", "Esporte"],
    "feminino-wetsuits": ["Feminino", "Esporte"],
    "masculino-acessorios": ["Masculino", "Acessórios"],
    "masculino-agasalhos": ["Masculino", "Roupas"],
    "masculino-alpargatas": ["Masculino", "Calçados"],
    "masculino-bermuda": ["Masculino", "Roupas"],
    "masculino-bermudas": ["Masculino", "Roupas"],
    "masculino-bijouterias": ["Masculino", "Acessórios"],
    "masculino-blusas": ["Masculino", "Roupas"],
    "masculino-bolsas": ["Masculino", "Acessórios"],
    "masculino-bones": ["Masculino", "Acessórios"],
    "masculino-botas": ["Masculino", "Calçados"],
    "masculino-cachecois": ["Masculino", "Acessórios"],
    "masculino-calcados": ["Masculino", "Calçados"],
    "masculino-calcas": ["Masculino", "Roupas"],
    "masculino-camisas": ["Masculino", "Roupas"],
    "masculino-camisetas": ["Masculino", "Roupas"],
    "masculino-carteiras": ["Masculino", "Acessórios"],
    "masculino-casacos": ["Masculino", "Roupas"],
    "masculino-chinelos": ["Masculino", "Calçados"],
    "masculino-chuteiras": ["Masculino", "Esporte"],
    "masculino-ciclismo": ["Masculino", "Esporte"],
    "masculino-cintos": ["Masculino", "Acessórios"],
    "masculino-coletes": ["Masculino", "Roupas"],
    "masculino-corrida": ["Masculino", "Esporte"],
    "masculino-cueca": ["Masculino", "Roupas"],
    "masculino-equipamentos": ["Masculino", "Esporte"],
    "masculino-gorros": ["Masculino", "Acessórios"],
    "masculino-jaquetas": ["Masculino", "Roupas"],
    "masculino-kimonos": ["Masculino", "Esporte"],
    "masculino-lingeries": ["Masculino", "Roupas"],
    "masculino-luvas": ["Masculino", "Acessórios"],
    "masculino-meias": ["Masculino", "Roupas"],
    "masculino-mocassins": ["Masculino", "Roupas"],
    "masculino-moletom": ["Masculino", "Roupas"],
    "masculino-moletons": ["Masculino", "Roupas"],
    "masculino-oculos": ["Masculino", "Acessórios"],
    "masculino-polos": ["Masculino", "Roupas"],
    "masculino-protetores": ["Masculino", "Esporte"],
    "masculino-relogios": ["Masculino", "Acessórios"],
    "masculino-roupas": ["Masculino", "Roupas"],
    "masculino-sacos": ["Masculino", "Esporte"],
    "masculino-saias": ["Masculino", "Roupas"],
    "masculino-sapatenis": ["Masculino", "Calçados"],
    "masculino-sapatilhas": ["Masculino", "Calçados"],
    "masculino-shorts": ["Masculino", "Roupas"],
    "masculino-sungas": ["Masculino", "Roupas"],
    "masculino-tenis": ["Masculino", "Calçados"],
    "masculino-vestidos": ["Masculino", "Roupas"],
    "masculino-wetsuits": ["Masculino", "Esporte"],
    "menina-acessorios": ["Infantil", "Acessórios"],
    "menina-bermudas": ["Infantil", "Roupas"],
    "menina-bijouterias": ["Infantil", "Acessórios"],
    "menina-blusas": ["Infantil", "Roupas"],
    "menina-bodys": ["Infantil", "Roupas"],
    "menina-bolsas": ["Infantil", "Acessórios"],
    "menina-botas": ["Infantil", "Calçados"],
    "menina-calcados": ["Infantil", "Calçados"],
    "menina-camisetas": ["Infantil", "Roupas"],
    "menina-chinelos": ["Infantil", "Calçados"],
    "menina-lingeries": ["Infantil", "Roupas"],
    "menina-macaquinhos": ["Infantil", "Roupas"],
    "menina-mochilas": ["Infantil", "Acessórios"],
    "menina-roupas": ["Infantil", "Roupas"],
    "menina-saias": ["Infantil", "Roupas"],
    "menina-sapatilhas": ["Infantil", "Calçados"],
    "menina-slippers": ["Infantil", "Calçados"],
    "menina-tenis": ["Infantil", "Calçados"],
    "menina-vestidos": ["Infantil", "Roupas"],
    "menino-acessorios": ["Infantil", "Acessórios"],
    "menino-bermudas": ["Infantil", "Roupas"],
    "menino-botas": ["Infantil", "Calçados"],
    "menino-calcados": ["Infantil", "Calçados"],
    "menino-calcas": ["Infantil", "Roupas"],
    "menino-camisetas": ["Infantil", "Roupas"],
    "menino-chinelos": ["Infantil", "Calçados"],
    "menino-cueca": ["Infantil", "Roupas"],
    "menino-jaquetas": ["Infantil", "Roupas"],
    "menino-mochilas": ["Infantil", "Acessórios"],
    "menino-polos": ["Infantil", "Roupas"],
    "menino-relogios": ["Infantil", "Acessórios"],
    "menino-roupas": ["Infantil", "Roupas"],
    "menino-sapatenis": ["Infantil", "Calçados"],
    "menino-sapatilhas": ["Infantil", "Calçados"],
    "menino-tenis": ["Infantil", "Calçados"],
    "unissex-acessorios": ["Unissex", "Acessórios"],
    "unissex-alpargatas": ["Unissex", "Roupas"],
    "unissex-bermudas": ["Unissex", "Roupas"],
    "unissex-bijouterias": ["Unissex", "Acessórios"],
    "unissex-blusas": ["Unissex", "Roupas"],
    "unissex-bodys": ["Unissex", "Roupas"],
    "unissex-bolsas": ["Unissex", "Acessórios"],
    "unissex-bones": ["Unissex", "Acessórios"],
    "unissex-botas": ["Unissex", "Roupas"],
    "unissex-cachecois": ["Unissex", "Roupas"],
    "unissex-calcados": ["Unissex", "Roupas"],
    "unissex-calcas": ["Unissex", "Roupas"],
    "unissex-camisas": ["Unissex", "Roupas"],
    "unissex-camisetas": ["Unissex", "Roupas"],
    "unissex-carteiras": ["Unissex", "Acessórios"],
    "unissex-chinelos": ["Unissex", "Roupas"],
    "unissex-ciclismo": ["Unissex", "Esporte"],
    "unissex-cintos": ["Unissex", "Acessórios"],
    "unissex-corrida": ["Unissex", "Esporte"],
    "unissex-cueca": ["Unissex", "Roupas"],
    "unissex-equipamentos": ["Unissex", "Esporte"],
    "unissex-jaquetas": ["Unissex", "Roupas"],
    "unissex-kimonos": ["Unissex", "Esporte"],
    "unissex-lingeries": ["Unissex", "Roupas"],
    "unissex-luvas": ["Unissex", "Roupas"],
    "unissex-meias": ["Unissex", "Roupas"],
    "unissex-mocassins": ["Unissex", "Roupas"],
    "unissex-mochilas": ["Unissex", "Roupas"],
    "unissex-moletons": ["Unissex", "Roupas"],
    "unissex-oculos": ["Unissex", "Acessórios"],
    "unissex-protetores": ["Unissex", "Esporte"],
    "unissex-relogios": ["Unissex", "Acessórios"],
    "unissex-roupas": ["Unissex", "Roupas"],
    "unissex-sapatenis": ["Unissex", "Roupas"],
    "unissex-sapatilhas": ["Unissex", "Roupas"],
    "unissex-shorts": ["Unissex", "Roupas"],
    "unissex-sungas": ["Unissex", "Roupas"],
    "unissex-tenis": ["Unissex", "Roupas"],
    "unissex-toucas": ["Unissex", "Acessórios"],
    "unissex-vestidos": ["Unissex", "Roupas"],
    "unissex-wetsuits": ["Unissex", "Esporte"]
  },
  "farfetch": {
    "kids-luxe-meninas - roupa infantil": ["Infantil", "Roupas"],
    "kids-luxe-roupa infantil": ["Infantil", "Roupas"],
    "kids-luxe-roupa para bebe": ["Infantil", "Roupas"],
    "kids-luxe-roupas para bebe menina": ["Infantil", "Roupas"],
    "men-luxe-acessorios": ["Masculino", "Acessórios"],
    "men-luxe-bijoux & joias": ["Masculino", "Acessórios"],
    "men-luxe-bolsas": ["Masculino", "Acessórios"],
    "men-luxe-fitness": ["Masculino", "Esporte"],
    "men-luxe-roupas": ["Masculino", "Roupas"],
    "men-luxe-sapatos": ["Masculino", "Calçados"],
    "unisex-luxe-acessorios": ["Unissex", "Acessórios"],
    "unisex-luxe-bijoux & joias": ["Unissex", "Acessórios"],
    "unisex-luxe-bolsas": ["Unissex", "Acessórios"],
    "unisex-luxe-fitness": ["Unissex", "Esporte"],
    "unisex-luxe-roupas": ["Unissex", "Roupas"],
    "unisex-luxe-sapatos": ["Unissex", "Calçados"],
    "women-luxe-acessorios": ["Feminino", "Acessórios"],
    "women-luxe-bijoux & joias": ["Feminino", "Acessórios"],
    "women-luxe-bolsas": ["Feminino", "Acessórios"],
    "women-luxe-fitness": ["Feminino", "Esporte"],
    "women-luxe-roupas": ["Feminino", "Roupas"],
    "women-luxe-sapatos": ["Feminino", "Calçados"]
  },
  "passarela": {
    "feminino-acessorios": ["Feminino", "Acessórios"],
    "feminino-calcados": ["Feminino", "Calçados"],
    "feminino-moda intima": ["Feminino", "Roupas"],
    "feminino-roupas": ["Feminino", "Roupas"],
    "infantil-acessorios": ["Infantil", "Acessórios"],
    "infantil-calcados": ["Infantil", "Calçados"],
    "infantil-moda intima": ["Infantil", "Roupas"],
    "infantil-roupas": ["Infantil", "Roupas"],
    "masculino-acessorios": ["Masculino", "Acessórios"],
    "masculino-calcados": ["Masculino", "Calçados"],
    "masculino-moda intima": ["Masculino", "Roupas"],
    "masculino-roupas": ["Masculino", "Roupas"],
    "unissex-acessorios": ["Unissex", "Acessórios"]
  }
}

BOT_NAME = 'scrapper'

SPIDER_MODULES = ['scrapper.spiders']
NEWSPIDER_MODULE = 'scrapper.spiders'

LOG_LEVEL='INFO'


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
    'scrapper.pipelines.CleanPipeline': 100,
    'scrapper.pipelines.MongoDBPipeline': 200
}

# IMAGE DIRECTORY
# IMAGES_STORE = os.path.abspath(os.path.dirname(__file__)) + '/spiders/images'

# ALLOW IMAGE REDIRECT
MEDIA_ALLOW_REDIRECTS = True

# SPLASH_URL = 'http://localhost:8050/'


# PROD DB
MONGODB_CONNECTION_STRING = 'mongodb://admin:azzaropourhome2@ds155411.mlab.com:55411/fashionbot'
# LOCAL DEV
# MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017/fashionbot'
MONGODB_SERVER = 'ds155411.mlab.com:55411/fashionbot'
MONGODB_USER = 'admin'
MONGODB_PASSWORD = 'azzaropourhome2'
MONGODB_PORT = 27017
MONGODB_DB = 'fashionbot'
MONGODB_COLLECTION = 'clothes'

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
