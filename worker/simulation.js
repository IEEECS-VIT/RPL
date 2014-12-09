// Created by Kunal Nagpal <kunagpal@gmail.com> on 10/8/14
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

var path = require('path');

var com = require(path.join(__dirname, 'commentary'));

exports.simulate = function (data, callback)
{
    if (data.team[0].ratings.length < 12 && data.team[1].ratings.length < 12)
    {
        console.log(data.team[0]._id + ' and ' + data.team[1]._id + ' forfeit the match');
        ++data.team[0].loss;
        ++data.team[1].loss;
    }
    else if (data.team[0].ratings.length < 12)
    {
        console.log(data.team[0]._id + ' forfeits the match, ' + data.team[1]._id + ' wins');
        ++data.team[1].win;
        data.team[1].points += 2;
        ++data.team[0].loss;
    }
    else if (data.team[1].ratings.length < 12)
    {
        console.log(data.team[1]._id + ' forfeits the match, ' + data.team[0]._id + ' wins');
        ++data.team[0].win;
        data.team[0].points += 2;
        ++data.team[1].loss;
    }
    else
    {
        console.log(data.team[0]._id + ' vs ' + data.team[1]._id + ' is now being simulated');
        var penalty_shootout = function()
        {

        };
        var rand = function ()
        {
            return parseInt(Math.random() * 1000000000000000);
        };
        var i;
        function Make(team)
        {
            this.strike_rating = [];
            this.strike_average = [];
            this.strike_strike_rate = [];
            this.keep_rating = [];
            this.keep_average = [];
            this.keep_strike_rate = [];
            this.def_rating = [];
            this.def_average = [];
            this.def_strike_rate = [];
            this.mid_rating = [];
            this.mid_average = [];
            this.mid_strike_rate = [];
            this.coach_rating = 0;
            this.formation = 0;
            this.type = [];
            this.stamina = [50,50,50,50,50,50,50,50,50,50,50];
            this.name = [];
            this.mean_rating = 0;
            this.average_strike_rating = 0;
            this.average_mid_rating = 0;
            this.average_keep_rating = 0;
            this.average_def_rating = 0;
            this.keep_count = 0;
            this.def_count = 0;
            this.strike_count = 0;
            this.mid_count = 0;
            for (i = 0; i < 11; ++i)
            {
                switch (team[i].Type)
                {
                    default:
                        this.name[i] = team[i]['Name'];
                    case 'strike':
                        this.strike_average[this.strike_count] = parseFloat(team[i]['Average']);
                        this.strike_strike_rate[this.strike_count] = parseFloat(team[i]['Strike Rate']);
                        this.strike_rating[this.strike_count] = parseInt(team[i]['Rating (900)']);
                        this.type.push('strike');
                        this.average_strike_rating += parseInt(team[i]['Rating (900)']);
                        ++this.strike_count;
                        break;
                    case 'keep':
                        this.keep_average[this.keep_count] = parseFloat(team[i]['Avg']);
                        this.keep_strike_rate[this.keep_count] = parseFloat(team[i]['SR']);
                        this.keep_rating[this.keep_count] = parseInt(team[i]['Rating (900)']);
                        this.type.push('keep');
                        ++this.keep_count;
                        this.average_keep_rating += parseInt(team[i]['Rating (900)']);
                        break;
                    case 'def':
                        this.def_average[this.def_count] = parseFloat(team[i]['Avg']);
                        this.def_strike_rate[this.def_count] = parseFloat(team[i]['SR']);
                        this.def_rating[this.def_count] = parseInt(team[i]['Bowl']);
                        this.type.push('def');
                        this.average_def_rating += parseInt(team[i]['Def']);
                        ++this.def_count;
                        break;
                    case 'mid': //serious adjustments needed here
                        this.mid_average[this.mid_count] = parseFloat(team[i]['Avg']);
                        this.mid_strike_rate[this.mid_count] = parseFloat(team[i]['SR']);
                        this.mid_rating[this.mid_count] = parseInt(team[i]['Bowl']);
                        this.type.push('mid');
                        this.average_mid_rating += parseInt(team[i]['Def']);
                        ++this.mid_count;
                        break;
                    case 'coach':
                        this.coach_rating = parseInt(team[i]['Rating (15)']);
                        break;
                }

            }
            if(!this.coach_rating)
            {
                this.coach_rating = -50;
            }
            this.mean_rating = (this.average_def_rating * this.def_count + this.average_mid_rating * this.mid_count + this.average_keep_rating * this.keep_count + this.average_strike_rating * this.strike_count)/11;
            this.average_def_rating = parseFloat (this.average_def_rating ) / this.def_count;
            this.average_mid_rating = parseFloat ( this.average_mid_rating ) / this.mid_count;
            this.average_strike_rating = parseFloat ( this.average_strike_rating ) / this.strike_count;
            this.average_keep_rating = parseFloat ( this.average_keep_rating ) / this.keep_count;
            for (i = 0; i < 11; ++i)
            {
                switch(this.type[i])
                {
                    case 'strike':
                        this.strike_rating[i] += parseFloat(this.strike_rating[i]) / (this.strike_count - 1) - parseFloat(this.average_strike_rating)/ ((this.strike_count - 1)*(this.strike_count - 2)) + parseInt(this.coach_rating);
                        this.strike_rating = (this.strike_rating < 0)? ((this.coach_rating < 0)? (0) : (this.coach_rating)):(this.strike_rating);
                        break;
                    case 'keep':
                        this.keep_rating[i] += parseFloat(this.keep_rating[i]) / (this.keep_count - 1) - parseFloat(this.average_keep_rating)/ ((this.keep_count - 1)*(this.keep_count - 2)) + parseInt(this.coach_rating);
                        this.keep_rating = (this.keep_rating < 0)? ((this.coach_rating < 0)? (0) : (this.coach_rating)):(this.keep_rating);
                        break;
                    case 'def':
                        this.def_rating[i] += parseFloat(this.def_rating[i]) / (this.def_count - 1) - parseFloat(average_def_rating)/ ((this.def_count - 1)*(this.def_count - 2)) + parseInt(this.coach_rating);
                        this.def_rating = (this.def_rating < 0)? ((this.coach_rating < 0)? (0) : (this.coach_rating)):(this.def_rating);
                        break;
                    case 'mid':
                        this.mid_rating[i] += parseFloat(this.mid_rating[i]) / (mid_count - 1) - parseFloat(this.average_mid_rating)/ ((this.mid_count - 1)*(this.mid_count - 2)) + parseInt(this.coach_rating);
                        this.mid_rating = (this.mid_rating < 0)? ((this.coach_rating < 0)? (0) : (this.coach_rating)):(this.mid_rating);
                        break;
                    default:
                        break;
                }
            }
        }
        var team_object = [];
        team_object[0] = new Make(data.team[0].ratings);
        team_object[1] = new Make(data.team[1].ratings);
        var Goals = [0,0];
        var winner;
        var temp = (data.team[0].form - data.team[1].form) / 2;
        var toss;
        var individual_goals = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        var passes = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        var fouls = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        var possession = [0,0];
        var shots = [];
        data.match.commentary = [];
        temp = (parseFloat((team_object[0].mean_rating * 100))/( team_object[0].mean_rating + team_object[1].mean_rating) + temp).toFixed(2);
        data.match.commentary.push('Winning chances: ' + data.team[0]._id + ' ' + temp +' %, ' + data.team[0]._id + (100 - temp) +' %');
        toss = rand()%2;
        data.match.commentary.push(' ' + data.team[+toss]._id + ' wins the toss, ');
        if (rand() % 2)
        {
            toss = !toss;
            data.match.commentary[data.match.commentary.length - 1] += data.team[+!toss]._id + ' shall kickoff.';
        }
        else
        {
            data.match.commentary[data.match.commentary.length - 1] += ' and chooses to kickoff.';
        }
        var async = require('async');
        // ------------------------last resort ---------------------------

        // ------------------------last resort ---------------------------

        // <main stream>

        for(i = 0;i < 45; ++i)
        {
           // do first half stuff here
           data.match.commentary.push((i + 1) + ':\n');
        }

        for(i = 45;i <= 90; ++i)
        {
            // do second half stuff here
            data.match.commentary.push(i + ':\n');
        }
        data.match.push(com.end[rand()%com.end.length]);
        //  </main stream>
        data.match.commentary.push(data.team[0]._id + ': ' + Goals[0] + ' - ' + data.team[1]._id + ': ',Goals[1]);
        if (Goals[0] == Goals[1])
        {
            data.match.commentary.push('Match drawn, proceeding to penalty shootout...');
            winner = penalty_shootout();
        }
        else
        {
            winner = +(Goals[1] > Goals[0]);
            data.match.commentary[data.match.commentary.length - 1] += ' ';
        }
        if (winner == -1)
        {
            ++data.team[0].tied;
            ++data.team[0].points;
            ++data.team[1].tied;
            ++data.team[1].points;
            data.team[0].goals_for += Goals[0];
            data.team[1].goals_for += Goals[1];
            data.team[0].goals_against += Goals[1];
            data.team[1].goals_against += Goals[0];
        }
        else
        {
            console.log(data.team[+winner]._id + ' wins! ');
            ++data.team[+!winner].loss;
            ++data.team[+winner].win;
            data.team[+winner].points += 3;
            data.team[+winner].goals_for += Goals[+winner];
            data.team[+!winner].goals_for += Goals[+!winner];
            data.team[+winner].goals_against += Goals[+!winner];
            data.team[+!winner].goals_against += Goals[+winner];
            data.team[+winner].goal_diff = data.team[+winner].goals_for  - data.team[+winner].goals_against;
            data.team[+!winner].goal_diff = data.team[+!winner].goals_for  - data.team[+!winner].goals_against;
        }
    }
    ++data.team[0].played;
    ++data.team[1].played;
    data.team[0].form += Goals[0] - Goals[1];
    data.team[1].form += Goals[1] - Goals[0];
    data.team[0].mean_goals_for = data.team[0].goals_for / data.team[0].played;
    data.team[1].mean_goals_for = data.team[1].goals_for / data.team[1].played;
    data.team[0].mean_goals_against = data.team[0].goals_against / data.team[0].played;
    data.team[1].mean_goals_against = data.team[1].goals_against / data.team[1].played;
    data.team[0].squad.pop();
    data.team[1].squad.pop();
    delete data.team[0].ratings;
    delete data.team[1].ratings;
    var newData =
    {
        team1: data.team[0],
        team2: data.team[1],
        match: data.match
    };
    callback(null, newData);
};
