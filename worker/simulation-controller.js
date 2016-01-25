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
var match;
var path = require('path');
var async = require('async');
var days = [1, 2, 3, 4, 5, 6, 7];
var email = require(path.join(__dirname, '..', 'utils', 'email'));
var simulator = require(path.join(__dirname, 'simulation'));

if(!process.env.NODE_ENV)
{
    require('dotenv').load({path : path.join(__dirname, '..', '.env')});
}

if (process.env.LOGENTRIES_TOKEN)
{
    log = require('node-logentries').logger({token: process.env.LOGENTRIES_TOKEN});
}

match = process.env.MATCH;

exports.initSimulation = function (day, masterCallback)
{
    var forEachMatch = function (matchDoc, callback)
    {
        var parallelTasks =
        {
            team1: function (asyncCallback)
            {
                getTeamDetails({team_no: matchDoc.Team_1}, asyncCallback);
            },
            team2: function (asyncCallback)
            {
                getTeamDetails({team_no: matchDoc.Team_2}, asyncCallback);
            }
        };

        var getTeamDetails = function (query, asyncCallback)
        {
            var getRating = function (err, userDoc)
            {
                var getEachRating = function (elt, subCallback)
                {
                    db('players').find({_id: elt}).limit(1).next(subCallback);
                };

                var onGetRating = function (err, results)
                {
                    userDoc.ratings = results;
                    asyncCallback(err, userDoc);
                };

                if(userDoc)
                {
                    if(userDoc.squad.length < 11)
                    {
                        userDoc.ratings = [];
                        asyncCallback(err, userDoc);
                    }
                    else
                    {
                        async.map(userDoc.squad, getEachRating, onGetRating);
                    }
                }
                else
                {
                    console.log(userDoc);
                }
            };

            db(match).find(query).limit(1).next(getRating);
        };

        var updateData = function (err, newData)
        {
            var updateUser = function (newUserDoc, asyncCallback)
            {
                db(match).updateOne({_id: newUserDoc._id}, newUserDoc, asyncCallback);
            };

            var updateMatch = function (newMatchDoc, asyncCallback)
            {
                db('matchday' + day).updateOne({_id: newMatchDoc._id}, newMatchDoc, asyncCallback);
            };

            var parallelTasks2 =
            [
                function (asyncCallback)
                {
                    updateUser(newData.team1, asyncCallback);
                },
                function (asyncCallback)
                {
                    updateUser(newData.team2, asyncCallback);
                },
                function (asyncCallback)
                {
                    updateMatch(newData.match, asyncCallback);
                }
            ];
            console.log('Teams ' + newData.team1._id + ' and ' + newData.team2._id + ', and Match ' + newData.match._id + ' are now being updated');
            async.parallel(parallelTasks2, callback)
        };

        var onTeamDetails = function (err, results)
        {
            var data =
            {
                team:
                [
                    results.team1,
                    results.team2
                ],
                match: matchDoc
            };

            simulator.simulate(data, updateData);
        };

        async.parallel(parallelTasks, onTeamDetails);
    };

    var onFinish = function (err, results)
    {
        if (err)
        {
            console.log(err.message);

            if (log)
            {
                log.log('debug', {Error: err.message});
            }

            throw err;
        }
        else
        {
            masterCallback(err, results);
        }
    };

    var getAllMatches = function (err, callback)
    {
        var collection;
        switch (days.indexOf(day))
        {
            case -1:
                throw 'Invalid day!';
                break;
            default:
                collection = 'matchday' + day;
                break;
        }

        db(collection).find().toArray(callback)
    };

    var ForAllMatches = function (err, docs)
    {
        if (err)
        {
            console.log(err.message);
            if (log)
            {
                log.log('debug', {Error: err.message});
            }

            throw err;
        }
        else
        {
            async.map(docs, forEachMatch, onFinish);
        }
    };

    getAllMatches(err, ForAllMatches);
};