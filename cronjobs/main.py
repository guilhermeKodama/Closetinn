# -*- coding: utf-8 -*-
from dotenv import load_dotenv
load_dotenv()

import time
import logging
import schedule
import jobs.syncData as syncDataJob
import jobs.statusCheck as statusCheckJob
import jobs.syncPromotions as syncPromotions
import jobs.recommendations as recommendations
import jobs.syncTypeForm as syncTypeForm

dafitiCsvURL = "http://productdata.zanox.com/exportservice/v1/rest/44931399C117511412.csv?ticket=5AC31E28EAE208859910F989A27C736F&productIndustryId=1&columnDelimiter=,&textQualifier=DoubleQuote&nullOutputFormat=NullValue&dateFormat=yyyy-MM-dd'T'HH:mm:ss:SSS&decimalSeparator=period&id=&pg=&nb=&na=&pp=&po=&cy=&du=&ds=&dl=&tm=&mc=&c1=&c2=&c3=&ia=&im=&il=&df=&dt=&lk=&ss=&sa=&af=&sp=&sv=&x1=&x2=&x3=&x4=&x5=&x6=&x7=&x8=&x9=&zi=&ea=&gt=&is=&td=&bp=&ba=&bt=&sh=&sn=&pc=&zs=&za=&mn=&mo=&co=&ma=&sz=&gn=&i1=&i2=&i3=&gZipCompress=yes"

kanuiCsvURL = "http://productdata.zanox.com/exportservice/v1/rest/44972176C983712874.csv?ticket=5AC31E28EAE208859910F989A27C736F&productIndustryId=1&columnDelimiter=,&textQualifier=DoubleQuote&nullOutputFormat=NullValue&dateFormat=yyyy-MM-dd'T'HH:mm:ss:SSS&decimalSeparator=period&id=&pg=&nb=&na=&pp=&po=&cy=&du=&ds=&dl=&tm=&mc=&c1=&c2=&c3=&ia=&im=&il=&df=&dt=&lk=&ss=&sa=&af=&sp=&sv=&x1=&x2=&x3=&x4=&x5=&x6=&x7=&x8=&x9=&zi=&ea=&gt=&is=&td=&bp=&ba=&bt=&sh=&sn=&pc=&zs=&za=&mn=&mo=&co=&ma=&sz=&gn=&i1=&i2=&i3=&gZipCompress=yes"

# create logger
logger = logging.getLogger('closetinn')
logger.setLevel(logging.DEBUG)

# create console handler and set level to debug
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

# create formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# add formatter to ch
ch.setFormatter(formatter)

# add ch to logger
logger.addHandler(ch)

logger.info('Scheduled jobs: %s', schedule.jobs)

logger.info('Scheduling jobs...')
schedule.every().minute.do(statusCheckJob.run)
schedule.every().day.at('00:00').do(syncDataJob.run, kanuiCsvURL, 'kanui')
schedule.every().day.at('04:00').do(syncDataJob.run, dafitiCsvURL, 'dafiti')
schedule.every().monday.at('14:00').do(syncTypeForm.run)
schedule.every().day.at('21:00').do(recommendations.run)

# TODO do we still need this?
# schedule.every().day.at('5:00').do(syncPromotions.run)

while True:
    schedule.run_pending()
    time.sleep(1)
