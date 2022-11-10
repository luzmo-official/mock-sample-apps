const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const jwtDecode = require('jwt-decode');
const Cumulio = require('cumulio');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 

dotenv.config()

const data = {
  "integration_id": process.env.INTEGRATION_ID,
  "type": "sso",
  "expiry": "24 hours",
  "inactivity_interval": "1 year",
  "username": process.env.USER_USERNAME,
  "name": process.env.USER_NAME,
  "email": process.env.USER_EMAIL,
  "suborganization": process.env.USER_SUBORGANIZATION,
  "role": "viewer"
};

const cumulClient = new Cumulio({
  api_key: process.env.CUMUL_KEY,
  api_token: process.env.CUMUL_TOKEN,
  host: process.env.API_URL || 'https://api.cumul.io'
});


const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors()); // for CORS issues
const port = 4001;


// Temporary users.
const users = {
  'brad@mars-boots.com': {
    username: 'brad',
    email: 'brad@mars-boots.com',
    password: 'brad',
    brand: 'Mars Boots'
  },
  'angelina@earthly-shoes.com': {
    username: 'angelina',
    email: 'angelina@earthly-shoes.com',
    password: 'angelina',
    brand: 'Earthly Shoes'
  }
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('body', req.body, email, password);
  if (users[email]) {
    return jwt.sign({
      username: users[email].username,
      email: users[email].email,
      brand: users[email].brand
    }, 'randomSecretKey', (err, signedToken) => {
      res.json({
        token: signedToken 
      });
    })

  }
  res.end(400);
});

//Verify Token
function verifyToken(req,res,next){
  //Auth header value = > send token into header

  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if(typeof bearerHeader !== 'undefined'){

      //split the space at the bearer
      const bearer = bearerHeader.split(' ');
      //Get token from string
      const bearerToken = bearer[1];

      //set the token
      req.token = bearerToken;

      //next middleweare
      next();

  }else{
      //Fobidden
      res.sendStatus(403);
  }

}

app.get('/', verifyToken, (req, res) => {
  const token = req.token;
  jwt.verify(token, 'randomSecretKey', (err, authData) => {
    data.metadata = {
      brand: authData.brand
    };
    data.username = authData.username || data.username;
    data.name = authData.username || data.name;
    data.email = authData.email || data.email;
    data.suborganization = authData.username || data.suborganization;
    cumulClient.create('authorization', data).then(function (response) {
      const resp = {
        status: 'success',
        key: response.id,
        token: response.token
      };
      res.json(resp);
    })
    .catch(function (error) {
      const resp = {
        status: 'failed',
        error
      };
      res.json(resp);
    });
  });

});

app.listen(port, () => {
  console.log(`CUMUL Server app listening on port ${port}`)
});
