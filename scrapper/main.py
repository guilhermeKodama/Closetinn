# -*- coding: utf-8 -*-
from dotenv import load_dotenv
load_dotenv()

import scrapy, schedule, time, logging, requests
from scrapy.crawler import CrawlerProcess
from spiders.kanui_spider import KanuiSpider
from spiders.dafiti_spider import DafitiSpider
from spiders.farfetch_spider import FarfetchSpider
from spiders.passarela_spider import PassarelaSpider
from scrapy.conf import settings

recommendationAPIHost = 'http://closetinn-ml-api'

'''
    Logging
'''
# create logger
logger = logging.getLogger('closetinn')
logger.setLevel(logging.INFO)

'''
    Scrapy
'''

process = CrawlerProcess(settings)

# process.crawl(KanuiSpider)
process.crawl(DafitiSpider)
# process.crawl(FarfetchSpider)
# process.crawl(PassarelaSpider)

def run():
    process.start() # the script will block here until the crawling is finished
    requests.put(recommendationAPIHost + '/updateDatabase')

logger.info('---Scheduling Spiders---')
schedule.every().day.at('6:00').do(run)

while True:
    schedule.run_pending()
    time.sleep(1)
