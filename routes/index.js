/*
 *  Riviera Premier League
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

var bcrypt;
try{
    bcrypt = require('bcrypt');
}
catch(err)
{
    bcrypt = require('bcryptjs');
}
var express = require('express');
var path = require('path');
var router = express.Router();
var crypto = require('crypto');
var email = require('nodemailer').createTransport({
    service: 'Gmail',
    auth: {
        user: 'rivierapremierleague@gmail.com',
        pass: process.env.PASSWORD
    }
});
var mongoInterest = require(path.join(__dirname, '..', 'db', 'mongo-interest'));
var mongoUsers = require(path.join(__dirname, '..', 'db', 'mongo-users'));
var mongoPlayers = require(path.join(__dirname, '..', 'db', 'mongo-players'));
var log;

if (process.env.LOGENTRIES_TOKEN)
{
    var logentries = require('node-logentries');
    log = logentries.logger({
                                token: process.env.LOGENTRIES_TOKEN
                            });
}

router.get('/', function (req, res)
{
    if (req.signedCookies.name)
    {
        if (log)
        {
            log.log(req.signedCookies.name + "logged in");
        }
        res.redirect('/home');
    }
    else
    {
        res.render('index', {response: "" });
    }
});

router.post('/login', function (req, res)
{
    var teamName = req.body.team_name;
    var password = req.body.password;
    if (req.signedCookies.name) res.clearCookie('name', { });
    if (log)
    {
        log.log(teamName + " " + password + "recieved");
    }

    var credentials = {
        '_id': teamName
    };
    var onFetch = function (err, doc)
    {
        if (err)
        {
            console.log(err.message);
            res.render('index', {response: "Incorrect Username"});
        }
        else if (doc)
        {
            console.log(password);
            if (bcrypt.compareSync(password, doc['password_hash']))
            {
                console.log("Login Successful" + teamName);
                res.cookie('name', doc['_id'], {maxAge: 86400000, signed: true});
                res.redirect('/home');
            }
            else
            {
                console.log('Incorrect Credentials');
                res.render('index', {response: "Incorrect Password"});
            }
        }
        else
        {
            console.log('No user exists');
            res.render('index', {response: "Incorrect Username"});
        }
    };
    mongoUsers.fetch(credentials, onFetch);
});

router.post('/forgot', function (req, res)
{
    var onFetch = function(err, doc){
        if(err)
        {
            console.log(err.message);
        }
        else if(doc)
        {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                var options = {
                    from: 'rivierapremierleague@gmail.com',
                    to: req.body.email,
                    subject: 'Time to get back in the game',
                    text: 'Please click on http://' + req.headers.host + '/reset/' + token + ' in order to reset your password.\n '
                    + 'In the event that this password reset was not requested by you,'
                    + ' please ignore this message and your password shall remain intact.\n\nRegards, \nTeam R.P.L.'
                };

                email.sendMail(options, function(err) {
                    if(err)
                    {
                        console.log(err.message);
                    }
                    else
                    {
                        res.redirect('/login');
                    }
                });
            });
        }
        else
        {
            console.log('Invalid credentials!');
            res.redirect('/forgot');
        }
    };
    mongoUsers.forgotPassword(doc, onFetch);
});

router.get('/register', function (req, res)
{
    if (req.signedCookies.name)
    {
        res.redirect('/home');
    }
    else
    {
        res.render('register', { response: "" , csrfToken : req.csrfToken()});
    }
});

router.post('/register', function (req, res)
{
    var onGetCount = function (err, number)
    {
        if (err)
        {
            console.log(err.message);
        }
        else
        {
            var team_no = parseInt(number) + 1;
            var teamName = req.body.t_name;
            var password = req.body.rpass;
            var confirmPassword = req.body.rcpass;
            var managerName = req.body.m_name;
            var email = req.body.email;
            var phone = req.body.pno;
            console.log("Reached");

            if (password === confirmPassword)
            {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(password, salt);
                var newUser = {

                    _id: teamName,
                    team_no : team_no,
                    dob : new Date(),
                    password_hash : hashedPassword,
                    name : managerName,
                    email : email,
                    phone : phone,
                    squad : [],
                    team : [],
                    win : 0,
                    loss : 0,
                    tied : 0,
                    played : 0,
                    points: 0,
                    accuracy: 0.0,
                    shots : 0,
                    fouls : 0,
                    ratio : 0.0,
                    goals_for : 0,
                    goals_against: 0,
                    goal_diff : 0,
                    form : 1,
                    streak : 0,
                    morale : 0.0,
                    dominance : 0.0,
                    possession : 0.0,
                    mean_goals_for : 0.0,
                    mean_goals_against : 0.0,
                    passes : 0
                };
                var onInsert = function (err, docs)
                {
                    if (err)
                    {
                        console.log(err.message);
                        res.render('index', {response: "Team Name Already Exists"});
                    }
                    else
                    {
                        var name = docs[0]['_id'];
                        res.cookie('name', name, {maxAge: 86400000, signed: true});
                        res.redirect('/home/players');
                    }
                };
                mongoUsers.insert(newUser, onInsert);
            }
            else
            {
                console.log("Incorrect Password");
                res.render('register', {response: "Passwords do not match"});
            }
        }
    };
    mongoUsers.getCount(onGetCount);
});

router.get('/logout', function (req, res)
{
    if (req.signedCookies.name)
    {
        res.clearCookie('name', { });
        res.redirect('/');
    }
    else
    {
        res.redirect('/');
    }
});

router.get('/interest', function (req, res)
{
    res.redirect('/');
});

router.post('/interest', function (req, res) // interest form
{
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var newUser = {
        name: name,
        email: email,
        phone: phone
    };
    var onInsert = function (err, docs)
    {
        if (err)
        {
            console.log(err.message);
        }
        else
        {
            res.redirect('/interest');
            console.log(docs);
        }

    };
    mongoInterest.insert(newUser, onInsert);
});

router.get('/developer', function (req, res) // developers page
{
    var session;
    if (req.signedCookies.name)
    {
        session = 1;
        if (log)
        {
            log.log(req.signedCookies.name + "logged in");
        }
        res.redirect('/home/developers');
    }
    else
    {
        session = 0;
    }
    res.render('developer', {results: session });
});

router.get('/countdown', function (req, res) // page for countdown
{
    res.render('countdown', {Session: (req.signedCookies.name ? true : false)});
});

router.get('/prizes', function (req, res) // page to view prizes
{
    var session;
    if (req.signedCookies.name)
    {
        session = true;
        if (log)
        {
            log.log(req.signedCookies.name + "logged in");
        }
        res.redirect('/home/prize');
    }
    else
    {
        session = false;
    }
    res.render('prizes', {Session: session });
});

router.post('/reset/:token', function(req, res) {
    var query = {token : req.params.token, expire : {$gt: Date.now()}};
    var op = {$set : {password_hash : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))}, $unset : {token : '', expire : ''}};
    var onReset = function(err, doc)
    {
        if(err)
        {
            console.log(err.message);
        }
        else if(!doc)
        {
            console.log('No matches found!');
            res.redirect('/forgot');
        }
        else
        {
            var options = {
                to : doc.email,
                subject : 'Password change successful !',
                text : 'Hey there, ' + doc.email.split('@')[0] + ' we\'re just writing in to let you know that the recent password change was successful.' +
                '\nRegards,\nTeam R.P.L'
            };
            email.sendMail(options, function(err, doc) {
                if(err)
                {
                    console.log(err.message);
                }
                else
                {
                    console.log(doc, 'Updated successfully!');
                    res.redirect('/login');
                }
            });
        }
    };
    mongoUsers.resetPassword(query, op, onReset);
});

router.get('/rule', function (req, res)
{
    res.render('rule', {results: (req.signedCookies.name ? 1 : 0)});
});

router.get('/sponsor', function (req, res) // sponsors page
{
    res.render('sponsor', {results: (req.signedCookies.name ? 1 : 0)});
});

router.get('/trail', function (req, res) // trailer page
{
    res.render('trail', {results: (req.signedCookies.name ? 1 : 0)});
});

router.get('/schedule', function (req, res) // schedule page
{
    res.render('schedule', {results: (req.signedCookies.name ? 1 : 0)});
});

router.get('/players', function (req, res) // page for all players, only available if no squad has been chosen
{
                var onFetch = function (err, documents)
                {
                    if (err)
                    {
                        res.render('players', {
                            Players: documents
                        });
                    }
                    else
                    {
                        res.render('players', {
                            Players: documents
                        });
                    }

                };
                mongoPlayers.fetchPlayers(onFetch);
});

module.exports = router;
