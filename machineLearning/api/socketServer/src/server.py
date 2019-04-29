from dotenv import load_dotenv
load_dotenv()

import SocketServer, json, logging, redis, os

for param in os.environ.keys():
    print "%20s %s" % (param,os.environ[param])

r = redis.StrictRedis(host=os.environ['REDIS_SERVICE_HOST'], port=int(os.environ['REDIS_SERVICE_PORT']), db=0)
r.set(os.environ.get('ALIAS'), 'PENDING')

'''
    Logging
'''
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

from VectorModel import VectorModel

'''
    Server
'''

logger.debug('Building the server...')
vModel = VectorModel()
vModel.buildCorpus()
vModel.train()

class MyTCPHandler(SocketServer.BaseRequestHandler):
    """
    The request handler class for our server.

    It is instantiated once per connection to the server, and must
    override the handle() method to implement communication to the
    client.
    """

    def handle(self):
        global vModel
        # self.request is the TCP socket connected to the client
        self.data = self.request.recv(1024).strip()
        logger.debug("{} wrote:".format(self.client_address[0]))
        logger.debug('DATA: %s', self.data)
        self.data = json.loads(self.data)

        results = []
        if 'updateDatabase' in self.data:
            # change status on redis to PENDING
            r.set(os.environ.get('ALIAS'), 'PENDING')
            vModel2 = VectorModel()
            vModel2.buildCorpus()
            vModel2.train()
            vModel = vModel2
            # change status on redis to AVAILABLE
            r.set(os.environ.get('ALIAS'), 'AVAILABLE')
        elif self.data["query"]:
            results = vModel.search(self.data["query"], None, 40)
        else:
            query = vModel.getProductText(self.data["product_id"])
            # product dont exist
            if not query:
                results = []
            else:
                results = vModel.search(query, self.data["product_id"], 10)
        self.request.sendall(json.dumps(results))

if __name__ == "__main__":
    HOST, PORT = '0.0.0.0', 5000

    # Create the server, binding to localhost on port 9999
    server = SocketServer.TCPServer((HOST, PORT), MyTCPHandler)
    r.set(os.environ.get('ALIAS'), 'AVAILABLE')

    # Activate the server; this will keep running until you
    # interrupt the program with Ctrl-C
    logger.debug('===== SERVER RUNNING ====')
    server.serve_forever()
