'''
 CONFIG FILE - SET IMPORTANT ENV VARAIBLES HERE
'''
import os

ENV = os.getenv('CLOSETINN_ENV', 'production')
ADMIN_EMAILS = os.getenv('ADMIN_EMAILS', 'guilherme.kodama@gmail.com,kayron.scabral@gmail.com').split(',')
DATABASE_URI = os.environ['DB_HOST']
DATABASE_NAME = os.environ['DB_DATABASE']
RECOMMENDATION_HOST = 'http://' + os.environ['MLAPI_SERVICE_HOST'] + ':' + os.environ['MLAPI_SERVICE_PORT']
API_HOST = 'http://' + os.environ['BACKEND_SERVICE_HOST'] + ':' + os.environ['BACKEND_SERVICE_PORT']
API_TYPEFORM = os.environ['TYPEFORM_API']
TYPEFORM_TOKEN = os.environ['TYPEFORM_TOKEN']
