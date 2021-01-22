var express     = require('express');
var router      = express.Router();
const log       = require('logbootstrap');
const providers = require('../providers');

var dotenv  = require('dotenv');
dotenv.config();

router.use(function (req, res, next) {
  next();
});

router.get('/', (req, res, next) => {
  res.render('index', { 
    title: process.env.TITLE
  });
});

/*
router.get('/', (req, res, next) => {
  res.redirect('/signin')
});

router.get('/signin', (req, res, next) => {

  res.render('signin', { 
    title: process.env.TITLE,
    typeform: 'Sign In',
    error: '',
    message: '',
    client : providers()
  });

});

router.get('/signup', (req, res, next) => {

  res.render('signup', { 
    title: process.env.TITLE,
    typeform: 'Sign Up',
    error: '',
    message: '',
    client : providers()
  });

});

router.get('/forgotpassword', (req, res, next) => {
 
  res.render('forgotpassword', { 
    title: process.env.TITLE,
    typeform: 'Reset Password',
    error: '',
    message: '',
    client : providers()
  });
  
});

router.get('/logout', (req, res, next) => {

  auth.signOut().then(() => {
    // Sign-out successful.
    res.redirect('/signin');
  }).catch(error => {
    // An error happened.
    log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);
    res.redirect('/');
  });

});
*/

module.exports = router;
