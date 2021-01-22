var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
const log         = require('logbootstrap');
var cors          = require('cors');

var dotenv        = require('dotenv');
dotenv.config();

// Routes
var indexRouter   = require('./routes/index');
var authRouter    = require('./routes/auth');
var tokenRouter   = require('./routes/token');
var pwdRouter     = require('./routes/password');
var userRouter    = require('./routes/user');
var googleRouter  = require('./routes/google');
var addressRouter = require('./routes/address');

var app = express();

// -----------------------------------------------------------
// FIREBASE Configuration

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase  = require('./firebase');

firebase.init();

app.locals.firebase = firebase.firebase;
app.locals.firebase_admin = firebase.firebase_admin;

// -----------------------------------------------------------
// PURESTACK Configuration
const purestack = require('./purestack');

if (purestack.connect('test')) {
  log('success', 'Connected successfully to Algorand Blockchain Test Network.');
} else {
  log('danger', 'Not connected to Algorand Blockchain Test Network.');
};

app.locals.purestack = purestack;

// ------------------------------------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ 
  extended: false 
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// ------------------------------------------------------------------------
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use('/moment', express.static(__dirname + '/node_modules/moment'));
app.use('/lodash', express.static(__dirname + '/node_modules/lodash'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'));
app.use('/vue', express.static(__dirname + '/node_modules/vue/dist'));

// ------------------------------------------------------------------------
// API Routing
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/token', tokenRouter);
app.use('/pwd', pwdRouter);
app.use('/user', userRouter);
app.use('/google', googleRouter);
app.use('/address', addressRouter);

// ATTENZIONE !!!! Utilizzare CORS per proteggere questo ENDPOINT
app.get('/firebase', (req, res, next) => {
  res.send(firebase.firebase_config);
});

// ------------------------------------------------------------------------
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { 
    title: process.env.TITLE
  });
});

module.exports = app;
