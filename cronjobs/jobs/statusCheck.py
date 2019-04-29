# -*- coding: utf-8 -*-
'''
    This job check the status from our Recommendation API and switches
    from socket-server-slave to socket-server-primary so we can always keep our model
    up to date with our database
'''
import config, logging, redis, requests, os

r = redis.StrictRedis(host=os.environ['REDIS_SERVICE_HOST'], port=int(os.environ['REDIS_SERVICE_PORT']), db=0)
recommendationAPIHost = config.RECOMMENDATION_HOST

# create logger
logger = logging.getLogger('closetinn')

def run():
    logger.info('==== JOB: statusCheck.py ====')
    # if we are pointing to slave and the primary is available again lets
    # update the slave and point back to primary that is up to date
    logger.debug('CURRENT_HOST: %s', r.get('CURRENT_HOST'))
    logger.debug('PRIMARY_STATUS: %s', r.get('PRIMARY_STATUS'))
    logger.debug('SLAVE_STATUS: %s', r.get('SLAVE_STATUS'))
    if r.get('CURRENT_HOST') == r.get('HOST_SLAVE') and r.get('PRIMARY_STATUS') == 'AVAILABLE':
        logger.debug('Updating ml-api to primary socket-server...')
        requests.put(recommendationAPIHost + '/updateToPrimaryHost')
