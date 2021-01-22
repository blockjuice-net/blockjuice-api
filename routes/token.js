var express = require('express');
var router  = express.Router();
const log   = require('logbootstrap');

var nJwt = require('njwt');
var secureRandom = require('secure-random');

var dotenv  = require('dotenv');
dotenv.config();

router.post('/create', (req, res, next) => {

  var payload = req.body.payload;
  var token = getToken(payload);
  log('info', 'Token: ' + JSON.stringify(payload))
  res.json(token);
  
});

// ---------------------------------------------------------------------------
// Create Key Store for Token

// create token
let getToken = (data) => {
  var signingKey = secureRandom(256, {type: 'Buffer'});
  var jwt = nJwt.create(data, signingKey);

  return {
    token: jwt,
    auth: jwt.compact()   
  };

};


module.exports = router;
