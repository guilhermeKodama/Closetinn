import os

if os.getenv('CLOSETINN_ENV', 'development') == 'development':
    from development import *
elif os.getenv('CLOSETINN_ENV') == 'production':
    print 'PRODUCTION'
    from production import *
