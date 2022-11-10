from cumulio.cumulio import Cumulio
from dotenv import load_dotenv
from flask import Flask
from flask import jsonify
from flask import request
import os
import jwt
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

SECRET_KEY = 'randomSecretKey'


load_dotenv()

client = Cumulio(os.getenv("CUMUL_KEY"), os.getenv("CUMUL_TOKEN"), os.getenv("API_URL"))

properties = {}
properties["integration_id"] = os.getenv("INTEGRATION_ID")
properties["type"] = "sso"
properties["expiry"] = "24 hours"
properties["inactivity_interval"] = "10 minutes"
properties["username"] = os.getenv("USER_USERNAME")
properties["name"] = os.getenv("USER_NAME")
properties["email"] = os.getenv("USER_EMAIL")
properties["suborganization"] = "< user suborganization >"
properties["role"] = "viewer"

metadata = {}

users = {
  'brad@mars-boots.com': {
    'username': 'brad',
    'email': 'brad@mars-boots.com',
    'password': 'brad',
    'brand': 'Mars Boots'
  },
  'angelina@earthly-shoes.com': {
    'username': 'angelina',
    'email': 'angelina@earthly-shoes.com',
    'password': 'angelina',
    'brand': 'Earthly Shoes'
  }
}


@app.route("/login", methods = ['POST'])
def login():
  data = request.get_json()
  print(data['email'])
  if (data['email']):
    return jsonify({
      'token': jwt.encode(users[data['email']], SECRET_KEY, algorithm='HS256')
    })
  return jsonify({})

@app.route("/")
def hello_world():
  token = request.headers.get('authorization').split(' ')[1]
  payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
  properties["username"] = payload["username"] or os.getenv("USER_USERNAME")
  properties["name"] = payload["username"] or os.getenv("USER_NAME")
  properties["email"] = payload["email"] or os.getenv("USER_EMAIL")
  properties["suborganization"] = payload["username"] or properties["suborganization"]
  metadata["brand"] = payload["brand"]
  properties["metadata"] = metadata
  # Use the token to fill in information.
  authorization = client.create("authorization", properties)
  authResponse = {}
  authResponse["status"] = "success"
  authResponse["key"] = authorization["id"]
  authResponse["token"] = authorization["token"]

  return jsonify(authResponse)

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=4001)