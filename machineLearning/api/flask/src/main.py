from dotenv import load_dotenv
load_dotenv()

import socket, redis, os
from flask import Flask
from flask import json
from flask import request

app = Flask(__name__)

for param in os.environ.keys():
    print "%20s %s" % (param,os.environ[param])

r = redis.StrictRedis(host=os.environ['REDIS_SERVICE_HOST'], port=int(os.environ['REDIS_SERVICE_PORT']), db=0)

# ML server socket host and port
r.set('HOST_PRIMARY', os.environ['SS_PRIMARY_SERVICE_HOST'])
r.set('PORT_PRIMARY', int(os.environ['SS_PRIMARY_SERVICE_PORT']))
r.set('HOST_SLAVE', os.environ['SS_SLAVE_SERVICE_HOST'])
r.set('PORT_SLAVE', int(os.environ['SS_SLAVE_SERVICE_PORT']))

r.set('CURRENT_HOST', r.get('HOST_PRIMARY'))
r.set('CURRENT_PORT', r.get('PORT_PRIMARY'))

# Iterate over socket recv to mount entire data
def recvall(socket):
    BUFF_SIZE = 4096
    data = ''
    while True:
        part = socket.recv(BUFF_SIZE)
        data += part
        if not part:
            break
    return data

@app.route('/')
def healthcheck():
    return json.jsonify({ 'response': 'Welcome to FashionBot ML API', 'currentContainer': {'host': r.get('CURRENT_HOST'), 'port': int(r.get('CURRENT_PORT'))}})

@app.route('/recommendation/text/<string:product_id>')
def get_text_based_recommendation(product_id):
    # Create a socket (SOCK_STREAM means a TCP socket)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Connect to server and send data
        sock.connect((r.get('CURRENT_HOST'), int(r.get('CURRENT_PORT'))))
        data = json.dumps({ "product_id": product_id, "query": "" })
        sock.sendall(data + "\n")

        # Receive data from the server and shut down
        received = recvall(sock)
        return json.jsonify({ "products": json.loads(received) })
    finally:
        sock.close()

@app.route('/search')
def get_search_based_products():
    # Create a socket (SOCK_STREAM means a TCP socket)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Connect to server and send data
        sock.connect((r.get('CURRENT_HOST'), int(r.get('CURRENT_PORT'))))
        data = json.dumps({ "query": request.args.get("query"), "product_id": "" })
        sock.sendall(data + "\n")

        # Receive data from the server and shut down
        received = recvall(sock)
        return json.jsonify({ "products": json.loads(received) })
    finally:
        sock.close()

@app.route('/updateDatabase', methods=['PUT'])
def update_vector_model():
    # Create a socket (SOCK_STREAM means a TCP socket)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Connect to server and send data
        sock.connect((r.get('CURRENT_HOST'), int(r.get('CURRENT_PORT'))))
        data = json.dumps({ 'updateDatabase': True })
        sock.sendall(data + "\n")
        # Change to slave container
        r.set('CURRENT_HOST', r.get('HOST_SLAVE'))
        r.set('CURRENT_PORT', r.get('PORT_SLAVE'))
        return json.jsonify({ 'status': 'ok' })
    finally:
        sock.close()

@app.route('/updateToPrimaryHost', methods=['PUT'])
def update_current_host():
    # Create a socket (SOCK_STREAM means a TCP socket)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Connect to server and send data
        sock.connect((r.get('CURRENT_HOST'), int(r.get('CURRENT_PORT'))))
        data = json.dumps({ 'updateDatabase': True })
        sock.sendall(data + "\n")
        # Change to primary container
        r.set('CURRENT_HOST', r.get('HOST_PRIMARY'))
        r.set('CURRENT_PORT', r.get('PORT_PRIMARY'))
        return json.jsonify({ 'status': 'ok' })
    finally:
        sock.close()

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)
