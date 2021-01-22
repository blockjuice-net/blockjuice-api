var express         = require('express');
var router          = express.Router();
const log           = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

var auth, google;

router.use(function (req, res, next) {
    auth = req.app.locals.firebase.auth();
    google = req.app.locals.firebase.auth.GoogleAuthProvider;
    next();
});


router.post('/', (req, res, next) => {

  var idtoken = req.body.idtoken;
  // log('info', 'LogIn with provider Google with token \n' + idtoken);

  // Build Firebase credential with the Google ID token.
  var credential = google.credential(idtoken);
  // log('info', JSON.stringify(credential) + '\n');
  // Sign in with credential from the Google user.
  auth.signInWithCredential(credential).then(result => {
    // log('info', JSON.stringify(result)); 
    res.send(result.user.uid);
  }).catch(error => {
    res.jsonp(error);
  });

});

module.exports = router;
