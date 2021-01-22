// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase  = require('firebase/app');
const firebase_admin = require('firebase-admin');

const firebase_config = require("./firebase-config.js");
const firebase_serviceKey = require('./serviceAccountKey.json')

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

// -----------------------------------------------------------
// FIREBASE Initialization

let init = () => {

  firebase.initializeApp(firebase_config);

  firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(firebase_serviceKey),
    databaseURL: firebase_config.databaseURL
  });  

};

module.exports = {
  init,
  firebase,
  firebase_admin,
  firebase_config
};

