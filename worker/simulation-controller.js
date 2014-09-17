/*
 *  GraVITas Premier League
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

var async = require('async');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

var log;
if (process.env.LOGENTRIES_TOKEN)
{
    var logentries = require('node-logentries');
    log = logentries.logger({
                                token: process.env.LOGENTRIES_TOKEN
                            });
}

var simulator = require(path.join(__dirname, 'simulation'));

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/GPL';
var databaseOptions = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        },
        auto_reconnect: true,
        poolSize: 100
    }
};
var database;

exports.initSimulation = function (masterCallback)
{
    var getAllMatches = function (err, callback)
    {
        var collectionName;
        var day = today.getDate();
        switch (day)
        {
            case 0:
                collectionName = 'matchday4';
                break;
            case 1:
                collectionName = 'matchday5';
                break;
            case 2:
                collectionName = 'matchday6';
                break;
            case 3:
                collectionName = 'matchday7';
                break;
            case 4:
                collectionName = 'matchday1';
                break;
            case 5:
                collectionName = 'matchday2';
                break;
            case 6:
                collectionName = 'matchday3';
                break;
            default :
                break;
        }
        collectionName = 'matchday1';

        var collection = database.collection(collectionName);
        collection.find().toArray(callback)
    };

    var ForAllMatches = function (err, docs)
    {
        if (err)
        {
            console.log(err.message);
            if (log) log.log('debug', {Error: err.message});
            throw err;
        }
        else
        {
            async.map(docs, forEachMatch, onFinish);
        }
    };

    var forEachMatch = function (doc, callback)
    {
        var parallelTasks = {
            team1: function (asyncCallback)
            {
                getTeamDetails({team_no: parseInt(doc.Team_1)}, asyncCallback);
            },
            team2: function (asyncCallback)
            {
                getTeamDetails({team_no: parseInt(doc.Team_1)}, asyncCallback);
            }
        };

        var getTeamDetails = function (query, asyncCallback)
        {

        };

        var updateData = function (err, newData)
        {
            // callback()
        };

        var onTeamDetails = function (err, results)
        {
            var data = {
                team1: results.team1,
                team2: results.team2,
                match: doc
            };
            simulator.simulate(data, updateData);
        };

        async.parallel(parallelTasks, onTeamDetails);
    };

    var onFinish = function (err, results)
    {
        database.close();
        masterCallback(err, results);
    };

    var onConnect = function (err, db)
    {
        if (err)
        {
            console.log(err.message);
            if (log) log.log('debug', {Error: err.message});
            throw err;
        }
        else
        {
            database = db;
            getAllMatches(err, ForAllMatches);
        }
    };

    MongoClient.connect(mongoUri, databaseOptions, onConnect);
};