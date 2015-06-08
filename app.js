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
var config = {       "USER"    : "Gav",                  
           "PASS"    : "pass",       
           "HOST"    : "52.11.254.37",         
           "PORT"    : "27017",        
           "DATABASE" : "nodeApp"     };

var dbPath  = "mongodb://"+config.USER + ":"+     config.PASS + "@"+     config.HOST + ":"+    config.PORT + "/"+     config.DATABASE; 


           
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

/*
.createNew(app);
//var userResources = require("./resources.js");

var swe = swagger.errors;
var params = swagger.paramTypes;

var findById = {
  'spec': {
    description : "Find users by ID",  
    path : "/users/viewuser?id={userId}",
    method: "GET",
    summary : "Find users by ID",
    notes : "Returns a user based on ID",
    type : "User",
    nickname : "getUserById",
    produces : ["application/json"],
    parameters : [
                  {
                      "paramType":"query",
                      "name":"userId",
                      "type":"string",
                      "required":true,
                      "description":"The user's ID"
                  }
                ],
    responseMessages : [swe.invalid('id'), swe.notFound('user')]
  },
  "get": {
      "description": "Returns all pets from the system that the user has access to",
      "produces": [
        "application/json"
      ],
      "responses": {
        "200": {
          "description": "A list of pets.",
          "schema": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/pet"
            }
          }
        }
      }
    },
  "action": function (req,res) {
    if (!req.query.id) {
      throw swe.invalid('id'); }
    var id = parseInt(req.query.id);
    var user = userData.getUserById(id);

    if(user) res.send(JSON.stringify(user));
    else throw swe.notFound('user', res);
  }
};

swagger.setApiInfo({
  title: "Timely App",
  description: "This is a sample employee time tracker app. You can find out more about Swagger at <a href=\"http://swagger.wordnik.com\">http://swagger.wordnik.com</a> or on irc.freenode.net, #swagger.  For this sample, you can use the api key \"special-key\" to test the authorization filters",
  termsOfServiceUrl: "http://helloreverb.com/terms/",
  contact: "apiteam@wordnik.com",
  license: "Apache 2.0",
  licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});
// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT  methods, 
// the header api_key OR query param api_key must be equal to the string literal 
// special-key.  All other HTTP ops are A-OK 

swagger.addValidator(
  function validate(req, path, httpMethod) {
    //  example, only allow POST for api_key="special-key"
    if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
      var apiKey = req.headers["api_key"];
      if (!apiKey) {
        apiKey = url.parse(req.url,true).query["api_key"];
      }
      if ("special-key" == apiKey) {
        return true; 
      }
      return false;
    }
    return true;
  }
);*/

//var models = require("./models.js");


//swagger.addModels(models).addGet(findById);

var apiInfo = {
            title: "Swagger Hellow Worls App",
            description: "This is simple hello world",
            termsOfServiceUrl: "http://localhost/terms/",
            contact: "abc@name.com",
            license: "Apache 2.0",
            licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
          }

var swagger = swagger_node_express.createNew(app)

swagger.setApiInfo(apiInfo)
swagger.configureSwaggerPaths("", "api-docs", "")
swagger.configure("http://localhost:3000", "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/node_modules/swagger-node-express/swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});

app.swagger = swagger;
module.exports = app;

app.listen(3000); 
console.log('Waiting for you at 3000...');
