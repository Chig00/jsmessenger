import time
import collections
import flask

MAX_MESSAGES = 25

INDEX_PAGE = "/"
INDEX_SOURCE = "index.html"
SEND_PAGE = "/push"
RECEIVE_PAGE = "/pull"

SUCCESS = {"status": "success"}
FAILURE = {"status": "fail"}
NAME = "name"
MESSAGE = "message"
TIME = "timestamp"
MESSAGES = "messages"

app = flask.Flask(__name__)
messages = collections.deque()

@app.route(INDEX_PAGE)
def index():
    return flask.render_template(INDEX_SOURCE)

@app.post(SEND_PAGE)
def push():
    json = flask.request.get_json()
    name = json.get(NAME)
    message = json.get(MESSAGE)
    
    if name and message:
        messages.appendleft((
            time.asctime(),
            name,
            message
        ))
        
        if len(messages) > MAX_MESSAGES:
            messages.pop()
            
        return SUCCESS
    
    return FAILURE

@app.post(RECEIVE_PAGE)
def pull():
    timestamp = flask.request.get_json().get(TIME)
    
    return {
        MESSAGES: [] if messages and timestamp == messages[0][0] else list(messages)
    }