var User = require('models/user.js');
var HttpError = require('error').HttpError;
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.render('index', {});
  });

  /********GET ALL USERS******/

  app.get('/users', function(req, res, next) {
    User.find({}, function(err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });

  /******GET USER BY ID*********/

  app.get('/user/:id', function(req, res, next) {
    try {
      var id = new ObjectID(req.params.id);
    } catch (e) {
      next(404);
      return;
    }

    User.findById(id, function(err, user) {
      if (err) return next(err);
      if (!user) {
        next(new HttpError(404, "User not found"));
      } else {
        res.json(user);
      }
    });
  });
};
