# Shane Petree, Guilherme Cassiano

import os
from HelloFlask import app    # Imports the code from HelloFlask/__init__.py

if __name__ == '__main__':
    
    HOST = os.environ.get('SERVER_HOST', 'localhost')
    
    try:
        # 5555 is a default if SERVER_PORT fails, the SERVER_PORT is set to 52363 in the VS project properties
        PORT = int(os.environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555

    app.run(HOST, PORT)