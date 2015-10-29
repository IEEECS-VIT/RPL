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
var temp;
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
var match = process.env.MATCH;
var router = require('express').Router();
var mongoTeam = require(path.join(__dirname, '..', 'db', 'mongo-team'));
var mongoUsers = require(path.join(__dirname, '..', 'db', 'mongo-users'));
var mongoFeatures = require(path.join(__dirname, '..', 'db', 'mongo-features'));

if (process.env.LOGENTRIES_TOKEN)
{
    var logentries = require('node-logentries');
    log = logentries.logger({
        token: process.env.LOGENTRIES_TOKEN
    });
}

router.get('/', function (req, res) {
    if (req.signedCookies.name)
    {
        credentials =
        {
            '_id': req.signedCookies.name
        };

        var onFetch = function (err, doc)
        {
            if (err)
            {
                console.log(err.message);
                res.redirect('/home');
            }
            else if (doc)
            {
                if (doc.team.length == 0)
                {
                    res.redirect("/home/players");
                }
                else if(doc.squad.length == 0)
                {
                    res.redirect("/home/formation");
                }
                else
                {
                    fields =
                    {
                        _id: 1,
                        Name: 1,
                        Type: 1
                    };

                    var getDetails = function (id, callback)
                    {
                        mongoFeatures.getPlayer(id, fields, callback);
                    };

                    var onFinish = function (err, documents)
                    {
                        if (err)
                        {
                            console.log(err.message);
                            res.redirect('/home');
                        }
                        else
                        {
                            res.render('home', {results: {team : documents, user : doc}});
                        }
                    };

                    async.map(doc.team, getDetails, onFinish);
                }
            }
            else
            {
                res.clearCookie('name', { });
                res.redirect('/');
            }
        };

        mongoUsers.fetch(credentials, onFetch);
    }
    else
    {
        res.redirect('/');
    }
});

router.get('/leaderboard', function (req, res){ // Leaderboard/Standings
    if(req.signedCookies.name && req.signedCookies.lead && req.signedCookies.day == process.env.DAY)
    {
        res.render("leaderboard", {leaderboard: JSON.parse(req.signedCookies.lead)});
    }
    else if ((req.signedCookies.name && process.env.DAY >= '1') || !process.env.NODE_ENV)                         // if cookies exists then access the database
    {
        var onFetch = function (err, documents)
        {
            if (err)
            {
                console.log(err.message);
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
        res.redirect("/");
    }
});

router.get('/matches', function (req, res) {
    if ((req.signedCookies.name && process.env.DAY >= '1') || !process.env.NODE_ENV)
    {
        credentials =
        {
            '_id' : req.signedCookies.name
        };

        var onMap = function (err, num)
        {
            if (err)
            {
                console.log(err.message);
            }
            else
            {
                var onMatches = function (err, matches)
                {
                    if (err)
                    {
                        console.log(err.message);
                    }
                    else
                    {
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
        res.redirect('/');
    }
});

router.post('/getsquad', function (req, res) {
    if (req.signedCookies.name)
    {
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
    }
    else
    {
        res.redirect('/');
    }
});

router.post('/getTeam', function (req, res) {
    stats = {};
    players = [];
    fields =
    {
        _id: 1,
        Name: 1,
        Cost: 1,
        Type: 1
    };
    cost = 100000000;
    credentials =
    {
        _id: req.signedCookies.name
    };

    for (i = 2; i < 17; ++i)
    {
        players.push(req.body['p' + i]);
    }

    players.push(req.body.p1);

    var onUpdate = function (err)
    {
        if (err)
        {
            console.log(err.message);
        }
        else
        {
            res.redirect('/home/formation');
        }
    };

    var getCost = function (id, callback)
    {
        if (id < 'd')
        {
            stats[id]         = {};
            stats[id].MoM     = 0;
            stats[id].form    = 0;
            stats[id].morale  = 0;
            stats[id].points  = 0;
            stats[id].fatigue = 0;
            stats[id].matches = 0;
            stats[id].catches = 0;

            if (!(id > 'b' && id < 'c'))
            {
                stats[id].outs        = 0;
                stats[id].balls       = 0;
                stats[id].high        = -1;
                stats[id].fours       = 0;
                stats[id].sixes       = 0;
                stats[id].recent      = [];
                stats[id].notouts     = 0;
                stats[id].average     = 0.0;
                stats[id].runs_scored = 0;
                stats[id].strike_rate = 0.0;
                stats[id].low         = Number.MAX_VALUE;
            }
            if (id > 'b' && id < 'd')
            {
                stats[id].sr            = 0.0;
                stats[id].overs         = 0;
                stats[id].avg           = 0.0;
                stats[id].economy       = 0.0;
                stats[id].runs_given    = 0;
                stats[id].wickets_taken = 0;
            }
        }

        mongoFeatures.getPlayer(id, fields, callback)
    };

    var onFinish = function (err, documents)
    {
        if (err)
        {
            console.log(err.message);
            res.redirect('/home');
        }
        else
        {
            for (var i = 0; i < documents.length; ++i)
            {
                cost -= parseInt(documents[i].Cost);

                if (cost < 0)
                {
                    res.redirect('/home/players', {err: "Cost Exceeded"});
                }
            }

            mongoUsers.updateUserTeam(credentials, players, stats, cost, onUpdate);
        }
    };

    async.map(players, getCost, onFinish);
});

router.get(/\/prizes?/, function (req, res) {// page to view prizes
    res.render('prize');
});

router.get(/\/sponsors?/, function (req, res) {// sponsors page
    res.render('sponsors');
});

router.get('/players', function (req, res) {// page for all players, only available if no squad has been chosen
    if (req.signedCookies.name)
    {
        credentials =
        {
            "_id": req.signedCookies.name
        };

        var onFetchUser = function (err, document)
        {
            if (err)
            {
                console.log(err.message);
                res.redirect("/home");
            }
            else
            {
                if (document.team.length != 0)
                {
                    res.redirect("/home");
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
    }
    else
    {
        res.redirect("/");
    }
});

router.get('/team', function (req, res) {// view the assigned playing 11 with options to change the playing 11
    if (req.signedCookies.name)                           // if cookies exists then access the database
    {
        credentials =
        {
            '_id': req.signedCookies.name
        };

        var getTeam = function (err, documents)
        {
            if (err)
            {
                console.log(err.message);
                res.redirect('/home');
            }
            else
            {
                res.render('team', {Squad: documents, csrfToken : req.csrfToken()});
            }
        };

        mongoTeam.getTeam(credentials, getTeam);
    }
    else                                                        // if cookies does not exists , go to login page
    {
        res.redirect('/');
    }
});

router.get('/formation', function (req, res) {
    if (req.signedCookies.name)
    {
        credentials =
        {
            '_id': req.signedCookies.name
        };

        var onFetch = function (err, doc)
        {
            if (err)
            {
                console.log(err);
            }
            else if (doc)
            {
                if (doc.team.length == 0)
                {
                    res.redirect("/home/players")
                }

                fields =
                {
                    Name: 1,
                    Cost: 1,
                    Type: 1
                };

                var getDetails = function (id, callback)
                {
                    mongoFeatures.getPlayer(id, fields, callback)
                };

                var onFinish = function (err, documents)
                {
                    if (err)
                    {
                        console.log(err.message);
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
                res.redirect('/');
            }
        };

        mongoUsers.fetch(credentials, onFetch);
    }
    else
    {
        res.redirect('/');
    }
});

router.get(/\/developers?/, function (req, res) {// developers page
    res.render('developers');
});

router.get('/settings',function(req,res){
    res.render('settings', {csrfToken: req.csrfToken()});
});

router.get('/stats', function (req, res) {
    if (req.signedCookies.name && process.env.DAY >= '1')
    {
        var onGetStats = function (err, doc)
        {
            if (err)
            {
                console.log(err.message);
                res.redirect('/');
            }
            else
            {
                res.render('stats', {stats: doc});
            }
        };

        mongoFeatures.getStats(onGetStats);
    }
    else
    {
        res.redirect('/');
    }
});

router.get('/feature', function (req, res) {
    if (req.signedCookies.name)
    {
        res.render('feature', {csrfToken: req.csrfToken()});
    }
    else
    {
        res.redirect('/');
    }
});

router.post('/feature', function (req, res) {
    if (req.signedCookies.name)
    {
        var onInsert = function (err)
        {
            if (err)
            {
                console.log(err);
            }

            res.redirect('/home');
        };

        mongoUsers.insert('features', {user : req.signedCookies.name, features: req.body.feature}, onInsert);
    }
    else
    {
        res.redirect('/');
    }
});

router.get('/dashboard', function (req, res) {
    if(req.signedCookies.name && req.signedCookies.dash && req.signedCookies.day == process.env.DAY)
    {
        res.render("dashboard", {result: JSON.parse(req.signedCookies.dash)});
    }
    else if (req.signedCookies.name && process.env.DAY >= '1')
    {
        credentials =
        {
            _id: req.signedCookies.name
        };

        var onFind = function (err, doc)
        {
            if (err)
            {
                console.log(err.message);
                res.redirect('/home');
            }
            else
            {
                res.render('dashboard', {result: doc});
            }
        };

        mongoTeam.dashboard(credentials, onFind);
    }
    else
    {
        res.redirect('/');
    }
});

router.get('/stats', function(req, res){
    if(req.signedCookies.stats && req.signedCookies.day == process.env.DAY)
    {
        res.render('stats', {stats : JSON.parse(req.signedCookies.stats)});
    }
    else if (req.signedCookies.name && process.env.DAY >= '1')
    {
        var onGetStats = function (err, doc)
        {
            if (err)
            {
                console.log(err.message);
                res.redirect('/');
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
        res.redirect('/login');
    }
});

module.exports = router;