var mongoose = require('mongoose');
var expressSession = require('express-session');
var MongoStore = require("connect-mongo")(expressSession);

var sessionStore = new MongoStore({
  host: '127.0.0.1',
  port: '27017',
  db: 'chat',
  url: 'mongodb://localhost:27017/chat'});

module.exports = sessionStore;