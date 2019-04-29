# -*- coding: utf-8 -*-
import os, datetime, pymongo, config, logging, requests
import pandas as pd
import utils.typeform as typeform
import utils.email as email_util

connection = pymongo.MongoClient(config.DATABASE_URI)
dbMongo = connection[config.DATABASE_NAME]
collectionUsers= dbMongo['users']
collectionLooks = dbMongo['looks']
collectionEmailSchedule = dbMongo['emailSchedule']

# create logger
logger = logging.getLogger('closetinn')

def checkLikedLooksCSV(row, user):
    for index, value in enumerate(row[2:32]):
        if index >= 0 and index <= 9 and value > 0:
            look = collectionLooks.find_one({ 'typeformId': 'casual' + str(index+1) })
            if look:
                user['likedLooks'].append(look['_id'])
        elif index >= 10 and index <= 19 and value > 0:
            look = collectionLooks.find_one({ 'typeformId': 'out' + str(index+1 - 10) })
            if look:
                user['likedLooks'].append(look['_id'])
        elif index >= 20 and index <= 29 and value > 0:
            look = collectionLooks.find_one({ 'typeformId': 'work' + str(index+1 - 20) })
            if look:
                user['likedLooks'].append(look['_id'])
    return user

def syncTypeFormCSV(files):
    dir = os.path.dirname(os.path.realpath('__file__'))
    for file in files:
        df = pd.read_csv(dir + file)
        print df.head(5)
        df = typeform.cleanRatings(df)
        for index, row in df.iterrows() :
            user = {
                'email': row['Escreva o seu email'],
                'name': row['Como quer ser chamado?'],
                'dob': row['Data de nascimento'],
                'subscribed': bool(row['Deseja receber promoções por email?']),
                'typeform': True,
                'typeformID': row['#'],
                'budget': row['Selecione o seu orçamento'].count('$') - 1,
                'networkID': row['Network ID'],
                'startedAt': row['Start Date (UTC)'],
                'submitedAt': row['Start Date (UTC)'],
                'createdAt': datetime.datetime.utcnow(),
                'updatedAt': None,
                'likedLooks': [],
                'likedProducts': [],
                'dislikedLooks': [],
                'dislikedProducts': []
            }
            result = collectionUsers.find_one({ 'email': user['email'] })
            # if not result:
            user = checkLikedLooksCSV(row, user)
            # new user irrul \o/
            if not result:
                collectionUsers.insert_one(user)
            else:
                del user['likedLooks']
                del user['likedProducts']
                del user['dislikedLooks']
                del user['dislikedProducts']
                collectionUsers.find_one_and_update({'_id': result['_id'] if '_id' in result else ''}, {'$set': user}, upsert=True)
            # print 'new user: %s', id

def checkLikedLooksAPI(answers, user):
    casual = answers[1].get('choices', None).get('labels', [])
    casual = [int(x) for x in casual]
    for choice in casual:
        look = collectionLooks.find_one({ 'typeformId': 'casual' + str(choice) })
        if look:
            user.get('likedLooks', []).append(look['_id'])
    out = answers[2].get('choices', None).get('labels', [])
    out = [int(x) for x in out]
    for choice in out:
        look = collectionLooks.find_one({ 'typeformId': 'out' + str(choice) })
        if look:
            user.get('likedLooks', []).append(look['_id'])
    work = answers[2].get('choices', None).get('labels', [])
    work = [int(x) for x in work]
    for choice in work:
        look = collectionLooks.find_one({ 'typeformId': 'work' + str(choice) })
        if look:
            user.get('likedLooks', []).append(look['_id'])
    return user

def syncTypeFormAPI():
    typeformID = 'xwuA0B'
    headers = {
        'Authorization': config.TYPEFORM_TOKEN
    }
    page = 1
    r = requests.get(config.API_TYPEFORM + '/forms/'+typeformID+'/responses?completed=true&page=' + str(page), headers=headers)
    result = r.json()
    page_count = result.get('page_count', 1)

    while page <= page_count:
        for item in result.get('items', []):
            answers = item.get('answers', None)
            if answers:
                user = {
                    'name': answers[0].get('text', None),
                    'budget': answers[4].get('choice', None).get('label', None).count('$') - 1,
                    'email': answers[5].get('text', None),
                    'subscribed': answers[6].get('boolean', None),
                    'dob': answers[7].get('date', None),
                    'startedAt': item.get('landed_at', None),
                    'submitedAt': item.get('submitted_at', None),
                    'createdAt': datetime.datetime.utcnow(),
                    'updatedAt': None,
                    'typeform': True,
                    'typeformID': typeformID,
                    'networkID': item.get('metadata', None).get('network_id', None),
                    'likedLooks': [],
                    'likedProducts': [],
                    'dislikedLooks': [],
                    'dislikedProducts': []
                }
                user = checkLikedLooksAPI(answers, user)
                result = collectionUsers.find_one({ 'email': user.get('email') })
                # new user irrul \o/
                if not result:
                    collectionUsers.insert_one(user)
                else:
                    del user['likedLooks']
                    del user['likedProducts']
                    del user['dislikedLooks']
                    del user['dislikedProducts']
                    collectionUsers.find_one_and_update({'_id': result['_id'] if '_id' in result else ''}, {'$set': user}, upsert=True)
        page = page + 1
        r = requests.get(config.API_TYPEFORM + '/forms/'+typeformID+'/responses?completed=true&page=' + str(page), headers=headers)
        result = r.json()

def run():
    # disable invalid emails
    try:
        email_util.disableInvalidEmails(collectionUsers)
    except Exception as e:
        logger.error('Error disabling invalid emails: %s', e)

    try:
        files = [
            '/jobs/typeform/1.csv',
            '/jobs/typeform/2.csv',
            '/jobs/typeform/3.csv',
            '/jobs/typeform/4.csv'
        ]
        syncTypeFormCSV(files)
    except Exception as e:
        logger.error('Error syncronizing from typeform CSV: %s', e)

    try:
        syncTypeFormAPI()
    except Exception as e:
        logger.error('Error syncronizing from typeform API: %s', e)

    try:
        # check this week is already scheduled
        schedule = email_util.getSchedule(collectionEmailSchedule)
        if schedule:
            logger.info('We already scheduled this week! See you next monday ;)')
            return
        # schedule emails for the next 2 weeks
        users = collectionUsers.find({ '$or': [{'disabed': { '$exists': False }}, {'disabled': False}]}, { '_id': 1 })
        users = list(users)
        chunkSize = len(users) / 7

        monday = [x.get('_id') for x in users[0: chunkSize]]
        tuesday = [x.get('_id') for x in users[chunkSize: chunkSize*2]]
        wednesday = [x.get('_id') for x in users[(chunkSize * 2): chunkSize*3]]
        thursday = [x.get('_id') for x in users[(chunkSize * 3): chunkSize*4]]
        friday = [x.get('_id') for x in users[(chunkSize * 4): chunkSize*5]]
        saturday = [x.get('_id') for x in users[(chunkSize * 5): chunkSize*6]]
        sunday = [x.get('_id') for x in users[(chunkSize * 6): chunkSize*7 + len(users) % 7]]

        # today is always monday in this case
        mondayDate = datetime.datetime.utcnow()
        tuesdayDate = mondayDate + datetime.timedelta(days=1)
        wednesdayDate = tuesdayDate + datetime.timedelta(days=1)
        thursdayDate = wednesdayDate + datetime.timedelta(days=1)
        fridayDate = thursdayDate + datetime.timedelta(days=1)
        saturdayDate = fridayDate + datetime.timedelta(days=1)
        sundayDate = saturdayDate + datetime.timedelta(days=1)

        schedules = [
            {
                'users': monday,
                'date': mondayDate,
                'type': 'promotions'
            },
            {
                'users': tuesday,
                'date': tuesdayDate,
                'type': 'promotions'
            },
            {
                'users': wednesday,
                'date': wednesdayDate,
                'type': 'promotions'
            },
            {
                'users': thursday,
                'date': thursdayDate,
                'type': 'promotions'
            },
            {
                'users': friday,
                'date': fridayDate,
                'type': 'promotions'
            },
            {
                'users': saturday,
                'date': saturdayDate,
                'type': 'promotions'
            },
            {
                'users': sunday,
                'date': sundayDate,
                'type': 'promotions'
            },
            {
                'users': monday,
                'date': mondayDate + datetime.timedelta(days=7),
                'type': 'recommendations'
            },
            {
                'users': tuesday,
                'date': tuesdayDate + datetime.timedelta(days=7),
                'type': 'recommendations'
            },
            {
                'users': wednesday,
                'date': wednesdayDate + datetime.timedelta(days=7),
                'type': 'recommendations'
            },
            {
                'users': thursday,
                'date': thursdayDate + datetime.timedelta(days=7),
                'type': 'recommendations'
            },
            {
                'users': friday,
                'date': fridayDate + datetime.timedelta(days=7),
                'type': 'recommendations'
            },
            {
                'users': saturday,
                'date': saturdayDate + datetime.timedelta(days=7),
                'type': 'recommendations'
            },
            {
                'users': sunday,
                'date': sundayDate + datetime.timedelta(days=7),
                'type': 'recommendations'
            }
        ]

        for schedule in schedules:
            collectionEmailSchedule.insert_one(schedule)
    except Exception as e:
        logger.error('Error scheduling emails: %s', e)

# if __name__ == '__main__':
#     run()
