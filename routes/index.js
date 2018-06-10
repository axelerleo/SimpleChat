var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var checkAuth = require('../middleware/checkAuth');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app) {
  app.get('/',require("./frontpage").get);
  app.get('/login',require("./login").get);

  app.post('/login', require('./login').post);
  app.post('/logout', require('./logout').post);

  app.get('/chat', checkAuth, require('./chat').get);
  
};