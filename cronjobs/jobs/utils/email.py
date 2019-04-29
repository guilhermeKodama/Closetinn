# -*- coding: utf-8 -*-
# https://sendgrid.com/docs/API_Reference/api_v3.html
import requests, json, logging, datetime

# create logger
logger = logging.getLogger('closetinn')

host = "https://api.sendgrid.com"
version = 3  # we could also use client.version(3)

api_key = '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'
headers = {
    'Authorization': 'Bearer ' + api_key,
    'Content-Type': 'application/json'
}

def send(email, to, subject, body):
    payload = json.dumps({
       'personalizations': [
        {
          'to': [
            {
              'email': to
            }
          ],
          'subject': subject
        }
      ],
      'from': {
        'email': email
      },
      'content': [
        {
          "type": "text/html",
          "value": body
        }
      ]
    })
    r = requests.post(host + '/v3/mail/send', data=payload, headers=headers)
    return r

def getInvalidEmails():
    r = requests.get(host + '/v3/suppression/invalid_emails', headers=headers)
    return r

def disableInvalidEmails(collectionUsers):
    r = getInvalidEmails()
    emails = r.json()
    for email in emails:
        collectionUsers.find_one_and_update({ 'email': email.get('email') },{'$set': {'disabled': True}})

def getSchedule(collectionEmailSchedule, type=None):
    today = datetime.datetime.utcnow().date()
    start = datetime.datetime(today.year, today.month, today.day, 0, 0, 0)
    end = datetime.datetime(today.year, today.month, today.day, 23, 59, 59)

    if type:
        return collectionEmailSchedule.find_one( {'type': type, 'date': {'$gte': start, '$lt': end}})

    return collectionEmailSchedule.find_one( {'date': {'$gte': start, '$lt': end}})
