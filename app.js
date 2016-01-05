/*
 *  Riviera Premier League <rivierapremierleague@gmail.com>
 *  Copyright (C) 2014  IEEE Computer Society - VIT Student Chapter <ieeecs@vit.ac.in>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var express = require('express');
var app = express();
app.use(require('compression')());
if(!process.env.NODE_ENV)
{
    require('dotenv').load();
}
var log;
var error;
var status;
var newrelic;
var path = require('path');
var csurf = require('csurf')();
var bodyParser = require('body-parser');
var json = bodyParser.json();
var passport = require('passport').initialize();
var url = bodyParser.urlencoded({extended: true});
var stat = express.static(path.join(__dirname, 'public'));
var logger = require('morgan')(process.env.LOGGER_LEVEL || 'dev');
var favicon = require('serve-favicon')(path.join(__dirname, 'public', 'images', 'favicon.ico'));
var session = require('express-session')({ secret : 'session secret key', resave : '', saveUninitialized : ''});
var cookieParser = require('cookie-parser')(process.env.COOKIE_SECRET || 'randomsecretstring', {signed: true});
var home = require(path.join(__dirname, 'routes', 'home'));
var index = require(path.join(__dirname, 'routes', 'index'));
var social = require(path.join(__dirname, 'routes', 'social'));

if (process.env.NEWRELIC_APP_NAME && process.env.NEWRELIC_LICENSE)
{
    newrelic = require('newrelic');
}

if (process.env.LOGENTRIES_TOKEN)
{
    log = require('node-logentries').logger({token: process.env.LOGENTRIES_TOKEN});
}

if (newrelic)
{
    app.locals.newrelic = newrelic;
}

app.use(logger);
app.set('title', 'RPL');
app.use(stat);
app.use(favicon);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.use(json);
app.use(url);
app.use(cookieParser);
app.use(session);
app.use(passport);
app.use(csurf);
app.use('/', index);
app.use('/auth', social);
app.use('/home', home);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.redirect('/');
});

// error handler
app.use(function (err, req, res, next) {
    if (log)
    {
        log.log('debug', {Error: err, Message: err.message});
    }

    status = err.status || 500;

    res.status(status);

    if(err.code === 'EBADCSRFTOKEN')
    {
        res.redirect(req.headers.referer);
    }
    else
    {
        error =
        {
            status: status
        };

        if (process.env.NODE_ENV)
        {
            error.message = '';
            error.stack   = '';
        }
        else
        {
            error.message = err.message;
            error.stack   = err.stack;
        }

        res.render('error', error);
    }
});

module.exports = app;