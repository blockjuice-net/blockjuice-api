var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');
var moment    = require('moment');
var axios     = require('axios');
const path    = require('path');

var dotenv  = require('dotenv');
dotenv.config();

var database, purestack;

router.use(function (req, res, next) {  
  database = req.app.locals.firebase.database();
  purestack = req.app.locals.purestack;
  next();
});

router.get('/:uid', (req, res,next) => {

  var uid = req.params.uid;

  return database.ref('/users/' + uid).once('value').then((snapshot) => {
    var address = (snapshot.val() && snapshot.val().address) || '';
    log('info', 'address: ' + address);
    res.send(address);
  });

});

router.post('/add', (req, res, next) => {

  var uid = req.body.uid;
  var address = req.body.address;

  database.ref('users/' + uid).set({
    uid: uid,
    address: address,
    created_at: moment.utc().format(),
    update_at: moment.utc().format()
  }, error => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(200).send('Data saved successfully!');
    }
  });

});

router.post('/recovery', (req, res, next) => {
  
  var mnemonic = req.body.mnemonnic;

  purestack.recovery(mnemonic).then(address => {
    res.send(address)
  }).catch(e => {
    res.status(400).send(e)
  })

});

module.exports = router;