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

var log;
var team;
var cost;
var squad;
var stats;
var fields;
var players;
var ref =
{
    'users' : 1,
    'round2' : 2,
    'round3' : 3
};
var credentials;
var path = require('path');
var async = require('async');
var router = require('express').Router();
var mongoTeam = require(path.join(__dirname, '..', 'database', 'mongoTeam'));
var mongoUsers = require(path.join(__dirname, '..', 'database', 'mongoUsers'));
var mongoFeatures = require(path.join(__dirname, '..', 'database', 'mongoFeatures'));

var authenticated = function(req, res, next)
{
    if(req.signedCookies.name || req.signedCookies.admin)
    {
        return next();
    }

	res.redirect('/');
};

if (process.env.LOGENTRIES_TOKEN)
{
    log = require('node-logentries').logger({token: process.env.LOGENTRIES_TOKEN});
}

router.get('/', authenticated, function (req, res) {
    credentials =
    {
        '_id': req.signedCookies.name
    };

    var onFetch = function (err, doc)
    {
        if (err)
        {
            res.redirect('/home');
        }
        else if (doc)
        {
            if (!doc.team.length)
            {
                res.redirect("/home/players");
            }
            else if(!doc.squad.length)
            {
                res.redirect("/home/formation");
            }
            else
            {
                var onFinish = function (err, documents)
                {
                    if (err)
                    {
                        res.redirect('/home');
                    }
                    else
                    {
                        res.render('home', {results: {team : documents, user : doc}});
                    }
                };

                async.map(doc.team, mongoFeatures.getPlayer, onFinish);
            }
        }
        else
        {
            res.clearCookie('name', {});
            res.redirect('/home');
        }
    };

    mongoUsers.fetchUser(credentials, onFetch);
});

router.get('/leaderboard', authenticated, function (req, res){ // Leaderboard/Standings
    if(req.signedCookies.lead && req.signedCookies.day == process.env.DAY)
    {
        res.render("leaderboard", {leaderboard: JSON.parse(req.signedCookies.lead)});
    }
    else if (process.env.DAY >= '1' || !process.env.NODE_ENV)                         // if cookies exists then access the database
    {
        var onFetch = function (err, documents)
        {
            if (err)
            {
                res.redirect("/home");
            }
            else
            {
                res.cookie('day', process.env.DAY, {signed : true, maxAge : 86400000});
                res.cookie('lead', JSON.stringify(documents), {signed : true, maxAge : 86400000});
                res.render("leaderboard", {leaderboard: documents});
            }
        };

        mongoUsers.getLeader(req.signedCookies.name, onFetch);
    }
    else
    {
        res.redirect("/home");
    }
});

router.get('/matches', authenticated, function (req, res) {
    if (process.env.DAY >= '1')
    {
        credentials =
        {
            '_id' : req.signedCookies.name
        };

        var onMap = function (err, num)
        {
            if (err)
            {
                res.redirect('/home');
            }
            else
            {
                var onMatches = function (err, matches)
                {
                    if (err)
                    {
                        res.redirect('/home');
                    }
                    else
                    {
                        res.cookie('day', process.env.DAY, {signed : true, maxAge : 86400000});
                        res.render('matches', {match: matches, day : (process.env.DAY - 1) || 0, round : ref[process.env.MATCH]});
                    }
                };

                mongoTeam.fetchMatches(num, onMatches);
            }
        };

        mongoTeam.map(credentials, onMap);
    }
    else
    {
        res.redirect('/home');
    }
});

router.get('/match/:day', authenticated, function(req, res){
    if(process.env.DAY >= '0' && req.params.day >= '1' && req.params.day <= '7')
    {
        credentials =
        {
            '_id' : req.signedCookies.name
        };

        var onMap = function (err, num)
        {
            if (err)
            {
                res.redirect('/home');
            }
            else
            {
                var onMatch = function (err, match)
                {
                    if (err)
                    {
                        res.redirect('/home');
                    }
                    else
                    {
                        res.cookie('day', process.env.DAY, {signed : true, maxAge : 86400000});
                        res.render('match', {match: match || {}, day : (process.env.DAY - 1) || 0, round : ref[process.env.MATCH]});
                    }
                };

                mongoFeatures.match(req.params.day, num, onMatch);
            }
        };

        mongoTeam.map(credentials, onMap);
    }
    else
    {
        res.redirect('/home');
    }
});

router.post('/getsquad', authenticated, function (req, res) {
    credentials =
    {
        '_id': req.signedCookies.name
    };
    squad = [];

    for (i = 1; i < 12; ++i)
    {
        squad.push(req.body['p' + i]);
    }

    var onFetch = function (err)
    {
        if (err)
        {
            console.log(err.message);
        }

        res.redirect('/home');
    };

    mongoUsers.updateUserSquad(credentials, squad, onFetch);
});

router.post('/players', authenticated, function (req, res) {
    stats = {};
    players = [];
    fields =
    {
        Cost: 1
    };
    cost = 100000000;
    credentials =
    {
        _id: req.signedCookies.name
    };

    for (i = 1; i < 17; ++i)
    {
        players.push(req.body['p' + i]);
    }

    var onUpdate = function (err)
    {
        if (err)
        {
            res.redirect('/home/players');
        }
        else
        {
            res.redirect('/home/formation');
        }
    };

    var getCost = function (id, callback)
    {
        stats[id] = {};
        stats[id].MoM     = 0;
        stats[id].form    = 0;
        stats[id].morale  = 0;
        stats[id].points  = 0;
        stats[id].fatigue = 0;
        stats[id].matches = 0;

        switch(id[0])
        {
            case 'a': //def
                break;
            case 'b': //keep
                break;
            case 'c': //mid
                break;
            case 'd': //str
                break;
        }

        mongoFeatures.getPlayer(id, fields, callback)
    };

    var onFinish = function (err, documents)
    {
        if (err)
        {
            res.redirect('/home');
        }
        else
        {
            var reduction = function(arg, callback)
            {
                cost -= parseInt(arg.Cost);
                callback();
            };
            var onReduce = function(err)
            {
                if(err)
                {
                    req.flash('An unexpected error has occurred. Please re-try.');
                    res.redirect('/players');
                }
                else if(cost < 0)
                {
                    req.flash('Cost Exceeded!');
                    res.redirect('/players');
                }
                else
                {
                    mongoUsers.updateUserTeam(credentials, players, stats, cost, onUpdate);
                }
            };

            async.each(documents, reduction, onReduce);
        }
    };

    async.map(players, getCost, onFinish);
});

router.get('/players', authenticated, function (req, res) {// page for all players, only available if no squad has been chosen
    credentials =
    {
        "_id": req.signedCookies.name
    };

    var onFetchUser = function (err, document)
    {
        if (err)
        {
            res.redirect("/home");
        }
        else
        {
            if (document.team.length)
            {
                if (!document.squad.length)
                {
                    res.redirect("/home/team");
                }
                else
                {
                    res.redirect('/home');
                }
            }
            else
            {
                var onFetch = function (err, documents)
                {
                    if (err)
                    {
                        res.redirect('/home');
                    }
                    else
                    {
                        res.render('players', {Players: documents, csrfToken : req.csrfToken()});
                    }
                };

                mongoPlayers.fetchPlayers(onFetch);
            }
        }
    };

    mongoUsers.fetchUser(credentials, onFetchUser);
});

router.get('/team', authenticated, function (req, res) {// view the assigned playing 11 with options to change the playing 11
    credentials =
    {
        '_id': req.signedCookies.name
    };

    var getTeam = function (err, documents)
    {
        if (err)
        {
            res.redirect('/home');
        }
        else
        {
            res.render('team', {Squad: documents, csrfToken : req.csrfToken()});
        }
    };

    mongoTeam.getTeam(credentials, getTeam);
});

router.get('/formation', authenticated, function (req, res) {
    credentials =
    {
        '_id': req.signedCookies.name
    };
    fields =
    {
        Cost: 1
    };

    var onFetch = function (err, doc)
    {
        if (err)
        {
            res.redirect('/home');
        }
        else if (doc)
        {
            if (!doc.team.length)
            {
                res.redirect("/home/players");
            }
            else if(!doc.squad.length)
            {
                res.redirect('/home/team');
            }

            var getDetails = function (id, callback)
            {
                mongoFeatures.getPlayer(id, fields, callback)
            };

            var onFinish = function (err, documents)
            {
                if (err)
                {
                    res.redirect('/home');
                }
                else
                {
                    res.render('formation', {results: {user : doc, team : documents}, csrfToken: req.csrfToken()});
                }
            };

            async.map(doc.team, getDetails, onFinish);
        }
        else
        {
            res.clearCookie('name', {});
            res.redirect('/login');
        }
    };

    mongoUsers.fetch(credentials, onFetch);
});

router.get('/settings', authenticated, function(req,res){
    res.render('settings', {csrfToken: req.csrfToken()});
});

router.get('/stats', authenticated, function (req, res) {
    if(req.signedCookies.stats && req.signedCookies.day === process.env.DAY)
    {
        res.render('stats', {stats : JSON.parse(req.signedCookies.stats)});
    }
    else if (process.env.DAY >= '1')
    {
        var onGetStats = function (err, doc)
        {
            if (err)
            {
                res.redirect('/home');
            }
            else
            {
                res.cookie('day', process.env.DAY, {signed : true, maxAge : 86400000});
                res.cookie('stats', JSON.stringify(doc), {signed : true, maxAge : 86400000});
                res.render('stats', {stats: doc});
            }
        };

        mongoFeatures.getStats(onGetStats);
    }
    else
    {
        res.redirect('/home');
    }
});

router.get('/feature', authenticated, function (req, res) {
    res.render('feature', {csrfToken: req.csrfToken()});
});

router.post('/feature', authenticated, function (req, res) {
    var onInsert = function (err)
    {
        if (err)
        {
            console.log(err.message);
        }

        res.redirect('/home');
    };

    mongoUsers.insert('features', {user : req.signedCookies.name, features: req.body.feature}, onInsert);
});

router.get('/dashboard', authenticated, function (req, res) {
    if(req.signedCookies.dash && req.signedCookies.day === process.env.DAY)
    {
        res.render("dashboard", {result: JSON.parse(req.signedCookies.dash)});
    }
    else if (process.env.DAY >= '1' || !process.env.NODE_ENV)
    {
        credentials =
        {
            _id: req.signedCookies.name
        };

        var onFind = function (err, doc)
        {
            if (err)
            {
                res.redirect('/home');
            }
            else
            {
                res.cookie('day', process.env.DAY, {signed: true, maxAge: 86400000});
                res.cookie('dash', JSON.stringify(doc), {signed: true, maxAge: 86400000});
                res.render('dashboard', {result: doc});
            }
        };

        mongoTeam.dashboard(credentials, onFind);
    }
    else
    {
        res.redirect('/home');
    }
});

module.exports = router;