var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);
var logger = require('morgan');
var HttpError = require('./error').HttpError;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var errorHandler = require('express-error-handler');
var app = express();
var mongoose = require('./libs/mongoose');
var expressSession = require('express-session');
//var MongoStore = require("connect-mongo")(expressSession);
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

if (app.get('env') == 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var sessionStore = require('./libs/sessionStore');

app.use(expressSession({
  secret: config.get('session:secret'), // ABCDE242342342314123421.SHA256
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: sessionStore
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

require('./routes')(app);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  console.log(err);
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});


var server = http.createServer(app);

server.listen(config.get('port'), function(){

  log.info('Express server listening on port ' + config.get('port'));

});

var io = require('./socket')(server);

app.set('io', io);