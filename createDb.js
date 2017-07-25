var mongoose = require('libs/mongoose');
mongoose.set('debug', true); // for beautiful debug (remove later)
var async = require('async');

async.series([
  open,
  dropDatabase,
  requireModels,
  createUsers
], function(err, results) {
  mongoose.disconnect();
});

function open(callback) {
  mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
}

function requireModels(callback) {
  require('models/user');

  async.each(Object.keys(mongoose.models), function(modelName, callback) {
    mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

function createUsers(callback) {
  var users = [
    new mongoose.models.User({username: 'Вася', password: 'supervasya'}),
    new mongoose.models.User({username: 'Петя', password: 'superpetya'}),
    new mongoose.models.User({username: 'Маша', password: 'supermasha'})
  ];

  async.each(users, function(user, callback) {
    user.save(function(err) {
      callback(err, user);
    });
  }, callback);
}
