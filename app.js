var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swagger_node_express = require("swagger-node-express");
var paramTypes = swagger_node_express.paramTypes;
var errors = swagger_node_express.errors;

var app = express();


// Database------------------------------------------------->
var liveConfig = { "USER"    : "Gav",                  
                   "PASS"    : "pass",       
                   "HOST"    : "52.11.254.37",         
                   "PORT"    : "27017",        
                   "DATABASE" : "nodeApp"     };

var localConfig = { "USER" : "Gav",
                    "PASS" : "pass",
                    "HOST" : "localhost",
                    "PORT" : "27017",
                    "DATABASE" : "nodeApp"
                };
                
var dbPath  = "mongodb://"+localConfig.USER + ":"+     localConfig.PASS + "@"+     localConfig.HOST + ":"+    localConfig.PORT + "/"+     localConfig.DATABASE; 


           
var mongo = require('mongoskin');
var db = mongo.db(dbPath, {native_parser:true});

var routes = require('./routes/index');
var users = require('./routes/users');
var time = require('./routes/time')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router--------------------->
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/time', time);


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

app.listen(3000); 
console.log('Waiting for you at 3000...');
