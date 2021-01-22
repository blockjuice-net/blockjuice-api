var express = require('express');
var router  = express.Router();
const log   = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

// -------------------------------------------------------------------------------
var passwordValidator = require('password-validator');
// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                                  // Minimum length 8
.is().max(20)                                                 // Maximum length 100
.has().uppercase()                                            // Must have uppercase letters
.has().lowercase()                                            // Must have lowercase letters
.has().digits(2)                                              // Must have at least 2 digits
.has().symbols(1)                                              // Must have simbols
.has().not().spaces()                                         // Should not have spaces
.is().not().oneOf([
  'Passw0rd', 
  'Password123', 
  'Password!'
]);  // Blacklist these values
// -------------------------------------------------------------------------------

router.post('/check', (req, res, next) => {
    var pwd = req.body.password;
    log('info', 'Password receveid to check: ' + pwd);
    var isValid = schema.validate(pwd);
    log('info', 'Password receveid valid: ' + isValid);
    res.send(isValid);
});


module.exports = router;
