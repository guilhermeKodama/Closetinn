import os

env = os.getenv('CLOSETINN_ENV', 'development')
print 'ENV:', env

if env == 'test':
    from test import *
elif env == 'development':
    from development import *
elif env == 'production':
    from production import *
