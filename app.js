var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);
var HttpError = require('error').HttpError;
var MongoStore = require('connect-mongo')(express);
var mongoose = require('libs/mongoose');

var app = express();
app.set('port', config.get('port'));

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

http.createServer(app).listen(app.get('port'), function(){
  log.info('Express server listening on port ' + app.get('port'));
});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
// app.use(express.bodyParser());

app.use(express.cookieParser());
app.use(express.session({ // after cookieParser();
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(function(req, res, next) {
  req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
  res.send("Visits: " + req.session.numberOfVisits);
});

app.use(require('middleware/sendHttpError'));
app.use(app.router);

require('routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  if (typeof err === 'number') {
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else if (app.get('env') === 'development') {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
    // app.use(express.errorHandler());
  } else {
    log.error(err);
    err = new HttpError(500);
    res.sendHttpError(err);
  }
});

