var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

const FIREBASE_EMAIL_VERIFY = 'http://localhost:' + process.env.PORT + '/auth/check';
const FIREBASE_RESET_PWD = 'http://localhost:' + process.env.PORT + '/signin';

var auth;

router.use(function (req, res, next) {  
  auth = req.app.locals.firebase.auth();
  next();
});

router.post('/resetpassword', (req, res, next) => {
 
  var emailAddress = req.body.email;

  var options = {
    url: FIREBASE_RESET_PWD,
    handleCodeInApp: true
  };

  auth.sendPasswordResetEmail(emailAddress, options).then(() => {

    log('success','Reset Password OK');
    res.status(200).send('Please check your email and click link to reset your password ...');

    /*
    res.render('checkemail', { 
      title: process.env.TITLE,
      message: 'Please check your email and click link to reset your password ...'
    });
    */

  }).catch(function(error) {
    res.status(400).send(error);
  });

});

// Check email link
router.get('/check', (req, res, next) => {
  
  var email = req.query.email;
  var account = req.body.account;
  var apiKey = req.query.apiKey;
  var oobCode = req.query.oobCode; 
  var mode = req.query.mode;
  var lang = req.query.lang

  var url = req.originalUrl;

  log('info', 'Parameters: ' + email + 
              '\nurl: ' + url +
              '\naccount: ' + account +
              '\napiKey' + apiKey +
              '\oobCode' + oobCode +
              '\omode' + mode + 
              '\olang' + lang);
  
  auth.signInWithEmailLink(email, url).then(result => {
    log('success', '/check OK');
    res.redirect('/user/dashboard/' + result.user.uid);
  }).catch(error => {
    res.status(400).send(error);
  });

});

// login with username and password 
router.post('/signin', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;

  log('info', 'LogIn by email: ' + email);

  auth.signInWithEmailAndPassword(email, password).then(result => {
    log('success', '/signin OK');
    res.redirect('/user/dashboard/' + result.user.uid);
  }).catch(error => {
    res.status(400).send(error);
  });

});

// registration new user with login and password
router.post('/signup', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;

  log('info', 'create user by email with ' + email);

  auth.createUserWithEmailAndPassword(email, password).then(result => {
    
    var options = {
      url: FIREBASE_EMAIL_VERIFY + '?email=' + email,
      handleCodeInApp: true
    };

    log('success', '/signup Ok.');
    log('info', 'email: ' + email);
  
    auth.sendSignInLinkToEmail(email, options).then(() => {
      log('success', '... send link to email OK');
      res.status(200).send('Please check your email and click link to verify your account ...');

      /*
      res.render('checkemail', { 
        title: process.env.TITLE,
        message: 'Please check your email and click link to verify your account ...'
      });
      */

    }).catch(error => {
      res.status(400).send(error);
    });

  }).catch(error => {
    res.status(400).send(error);
  });

});

router.post('/recaptcha', (req, res, next) => {

  var token = req.body.token;

  axios.post('https://www.google.com/recaptcha/api/siteverify', {
    secret: process.env.RECAPTCHA_KEY,  // The shared key between your site and reCAPTCHA
    response: token  // The user response token provided by the reCAPTCHA client-side integration on your site.
  }).then(response => {
      console.log(JSON.stringify(response.data));
      res.send(response.data.success);
  }).catch(error => {
    res.status(400).send(error);
  });

});

router.get('/recaptcha', (req, res, next) => {
  res.send(process.env.RECAPTCHA_KEY);
});

module.exports = router;
