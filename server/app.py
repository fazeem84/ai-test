import flask
from flask import request, jsonify
# import sqlite3
import requests
from flask_cors import CORS
from werkzeug import Response

app = flask.Flask(__name__)
CORS(app)


# Create the database and table if they don't exist
# conn = sqlite3.connect('flaskr/message_history.db')
# c = conn.cursor()
# c.execute('''CREATE TABLE IF NOT EXISTS messages (
#                 id INTEGER PRIMARY KEY,
#                 user_id TEXT NOT NULL,
#                 message TEXT NOT NULL,
#                 timestamp TEXT NOT NULL
#             )''')
# conn.commit()

@app.route('/api/chat', methods=['POST'])
def send_message():
    data = request.get_json()
    # user_id = data['user_id']
    # message = data['message']

    # Send the message to Olamma's endpoint
    # resp = requests.post('http://host.docker.internal:11434/api/chat', json=data)
    resp = requests.post('http://localhost:11434/api/chat', json=data)

    response = Response(resp.content, resp.status_code)
    # Store the message in the database
    # conn.cursor().execute("INSERT INTO messages (user_id, message, timestamp) VALUES (?, ?, ?)",
    #                      (user_id, message, flask.time.get_now()))
    # conn.commit()

    return response


# @app.route('/api/get_history', methods=['GET'])
# def get_history():
#     # conn = sqlite3.connect('flaskr/message_history.db')
#     c = conn.cursor()
#     c.execute("SELECT * FROM messages")
#     rows = c.fetchall()
#
#     # Format the response
#     history = []
#     for row in rows:
#         message = {'user_id': row[1], 'message': row[2]}
#         history.append(message)
#
#     return jsonify(history)
@app.route('/api/health', methods=['GET'])
def health():
    return "ok"


if __name__ == '__main__':
    app.run(debug=True)
