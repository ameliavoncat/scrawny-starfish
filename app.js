const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebars= require('express-handlebars')
const jquery = require('jquery');
const passport = require( './passport' );
const session = require( 'express-session')

const routes = require('./routes/index');
const users = require('./routes/users')
const protectRoute = require( './database/protectRoute' )

const app = express();

// view engine setup
app.engine('handlebars', handlebars({
  extname: 'handlebars',
  defaultLayout: 'layout',
  layoutsDir:__dirname + '/views'
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(session({
  secret: 'keyboard cat',
  cookie: {},
  resave: true,
  saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
