var express     = require('express');
var router      = express.Router();
const log       = require('logbootstrap');
const providers = require('../providers');
const _         = require('lodash');

var dotenv  = require('dotenv');
dotenv.config();

var admin, database;

router.use(function (req, res, next) {
  admin = req.app.locals.firebase_admin.auth();
  database = req.app.locals.firebase.database();
  next();
});

// ---------------------------------------------
// POST /check/displayName
// ---------------------------------------------
router.post('/check/displayName', (req, res, next) => {
  var name = req.body.displayName;
  res.send(checkDuplicateName(name));
});

// ---------------------------------------------
// POST /check/phoneNumber
// ---------------------------------------------
router.post('/check/phoneNumber', (req, res, next) => {
  var phoneNumber = req.body.phoneNumber;
  res.send(checkDuplicatePhoneNumber(phoneNumber));
});

// ---------------------------------------------
// POST /update
// ---------------------------------------------
router.post('/update', (req, res, next) => {
  
  var displayName = req.body.displayName;
  var phoneNumber = req.body.phoneNumber;
  var uid = req.body.uid;

  var data = {
      displayName: displayName,
      phoneNumber: phoneNumber
  };

  admin.updateUser(uid, data).then(user => {
    log('success','UPDATED User: ' + JSON.stringify(user.toJSON()));
    res.redirect('/user/info/' + uid);
  }).catch(error => {
    res.status(400).send(error);
  });
  
});

// ---------------------------------------------
// GET /info/:uid
// ---------------------------------------------

/*

  {
    "uid":"....................",
    "email":"giuseppe.zileni@gmail.com",
    "emailVerified":true,
    "displayName":"Giuseppe Zileni",
    "photoURL":"https://...............",
    "disabled":false,
    "metadata":{
      "lastSignInTime":"Tue, 05 Jan 2021 11:56:42 GMT",
      "creationTime":"Tue, 05 Jan 2021 11:19:29 GMT"
    },
    "tokensValidAfterTime":"Tue, 05 Jan 2021 11:19:29 GMT",
    "providerData":[
      {
        "uid":"9999999999999999999",
        "displayName":"Giuseppe Zileni",
        "email":"giuseppe.zileni@gmail.com",
        "photoURL":"https://...........",
        "providerId":"google.com"
      }
    ]
  }

*/

router.get('/info/:uid', (req, res, next) => {

  var uid = req.params.uid;

  getUser(uid, (error, user) => {

    if (error != null) {
      res.status(400).json(error);
    } else {
      res.jsonp(user);
    }

  });

});

router.get('/provider/:uid/:provider', (req, res, next) => {

  var uid = req.params.uid;
  var provider = req.params.provider;

  getUser(uid, (error, user) => {

    if (error == null) {

      var p;    

      var result = _.find(user.providerData, o => { 
        if (provider == 'google') {
          p = "google.com"
        };
        return o.providerId == p 
      });

      res.status(200).send(result);
    } else {
      res.status(400).send(error);
    }

  });

});


// =================================================
// Functions 

let getUser = (uid, callback) => {

  admin.getUser(uid).then(user => {
    callback(null, user)
  }).catch(error => {
    callback(error, null);
  });

};

const checkDuplicateName = (name, nextPageToken) => {
  // List batch of users, 1000 at a time.

  admin.listUsers(1000, nextPageToken).then((listUsersResult) => {
      
    listUsersResult.users.forEach((userRecord) => {
        log('info', 'check if ' + userRecord.toJSON().displayName + ' == ' + name);
        if (userRecord.toJSON().displayName == name) {
          log('info', 'user found');
          return true;
        }
      });

      if (listUsersResult.pageToken) {
        // List next batch of users.
        checkDuplicateName(name, listUsersResult.pageToken);
      } else {
        return false
      }

    }).catch((error) => {
      console.log('Error listing users:', error);
    });
};

const checkDuplicatePhoneNumber = (phoneNumber) => {

  admin.getUserByPhoneNumber(phoneNumber).then((userRecord) => {
    return true;
  }).catch((error) => {
    console.log('Error fetching user data:', error);
    return false;
  });

}

module.exports = router;
