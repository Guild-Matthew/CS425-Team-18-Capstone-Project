# Shane Petree
import os
import json
from HelloFlask import app

# writes the host IP and port number to a config file, for Angular to access
# DO NOT READ FROM THIS CONFIG FILE UNTIL FLASK IS RUNNING, the IP and Port are inaccurate until flask runs
# this config file could also be moved into AngularFrontend if it poses issues
def write_config(host, port):
    config = {'host': host, 'port': port}
    with open('./HelloFlask/flask-connection.config.json', 'w') as config_file:
            json.dump(config, config_file)

if __name__ == '__main__':
    
    HOST = os.environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(os.environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555

    # write the host address and port number to the config file
    write_config(HOST, PORT)

    app.run(HOST, PORT)

    # another way to get the host IP and Port number?
    """
    HOST = os.getenv('SERVER_HOST', '127.0.0.1')
    try:
        PORT = int(os.getenv('SERVER_PORT', 5555))
    except ValueError:
        PORT = 5555

    app.run(host=HOST, port=PORT)
    """
    # app.run(host ='localhost', port= 5000)
