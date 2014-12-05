/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */

<<<<<<< HEAD
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var newrelic;
if (process.env.NEWRELIC_APP_NAME && process.env.NEWRELIC_LICENSE)
{
    newrelic = require('newrelic');
}

var log;
if (process.env.LOGENTRIES_TOKEN)
{
    var logentries = require('node-logentries');
    log = logentries.logger({
                                token: process.env.LOGENTRIES_TOKEN
                            });
}

var index = require(path.join(__dirname, 'routes', 'web', 'index'));
var home = require(path.join(__dirname, 'routes', 'web', 'home'));

var app = express();

if (newrelic)
{
    app.locals.newrelic = newrelic;
}

var loggerLevel = process.env.LOGGER_LEVEL || 'dev';
app.use(logger(loggerLevel));

app.set('title', 'RPL');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.enable('trust proxy');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var cookieSecret = process.env.COOKIE_SECRET || 'randomsecretstring';
app.use(cookieParser(cookieSecret, {signed: true}));

app.use('/', index);
app.use('/home', home);

// catch 404 and forward to error handler
app.use(function (req, res, next)
        {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

// error handlers
// development error handler, will print stacktrace
if (app.get('env') === 'development')
{
    app.use(function (err, req, res, next)
            {
                if (log)
                {
                    log.log('debug', {Error: err, Message: err.message});
                }
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    status: err.status,
                    stack: err.stack
                });
            });
}

// production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next)
        {
            if (log)
            {
                log.log('debug', {Error: err, Message: err.message});
            }
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                status: err.status,
                stack: ''
            });
        });

module.exports = app;
=======
// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname);

// Ensure a "sails" can be located:
(function() {
  var sails;
  try {
    sails = require('sails');
  } catch (e) {
    console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
    console.error('To do that, run `npm install sails`');
    console.error('');
    console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
    console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
    console.error('but if it doesn\'t, the app will run with the global sails instead!');
    return;
  }

  // Try to get `rc` dependency
  var rc;
  try {
    rc = require('rc');
  } catch (e0) {
    try {
      rc = require('sails/node_modules/rc');
    } catch (e1) {
      console.error('Could not find dependency: `rc`.');
      console.error('Your `.sailsrc` file(s) will be ignored.');
      console.error('To resolve this, run:');
      console.error('npm install rc --save');
      rc = function () { return {}; };
    }
  }


  // Start server
  sails.lift(rc('sails'));
})();
>>>>>>> e519b0220b94cb2b56e010cdbed5ee38316e7cf6
