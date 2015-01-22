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
        var rand = function(arg)
        {
            if(!arg)
            {
                return Math.random();
            }
            else
            {
                return parseInt(Math.random() * 1000000000000000) % arg;
            }
        };
        var Make = function(team, arg)
        {
            average_strike_rating = average_mid_rating = average_keep_rating = average_def_rating = keep_count = def_count = strike_count = mid_count = 0;
            for (i = 0; i <= 11; ++i)
            {
                x = formation[data.team[arg].squad[11]][i].x + 2 * arg * Math.pow(-1, +(formation[data.team[arg].squad[11]][i].x > 64.5)) * Math.abs(formation[data.team[arg].squad[11]][i].x - 64.5);
                y = formation[data.team[arg].squad[11]][i].y;
                team[i].stamina = 50;
                team[i].position =
                {
                    x : x,
                    y : y
                };
                if(i)
                {
                    if(team[i].position.x == (36 + 57 * +!arg))
                    {
                        defender[arg].push(team[i].Name);
                    }
                    else if(team[i].position.x * Math.pow(-1, arg) <= (22 + 85 * +!arg) * Math.pow(-1, arg))
                    {
                        striker[arg].push(team[i].Name);
                    }
                    else
                    {
                        midfielder[arg].push(team[i].Name);
                    }
                }
                switch (team[i].Type)
                {
                    case 'strike':
                        average_strike_rating += team[i].Overall;
                        ++strike_count;
                        break;
                    case 'keep':
                        ++keep_count;
                        average_keep_rating += team[i].Overall;
                        break;
                    case 'def':
                        average_def_rating += team[i].Overall;
                        ++def_count;
                        break;
                    case 'mid':
                        average_mid_rating += team[i].Overall;
                        ++mid_count;
                        break;
                    default :
                        break;
                }
            }
            mean_rating[arg] = (average_def_rating + average_mid_rating + average_keep_rating + average_strike_rating) / 11;
            average_def_rating /= def_count;
            average_mid_rating /= mid_count;
            average_strike_rating /= strike_count;
            average_keep_rating /= keep_count;
            for (i = 0; i <= 11; ++i)
            {
                switch(team[i].Type)
                {
                    case 'strike':
                        team[i].Overall += team[i].Overall / (strike_count - 1) - (average_strike_rating)/ (strike_count * (strike_count - 1));
                        team[i].Overall = (team[i].Overall < 0) ? 0 : (team[i].Overall);
                        break;
                    case 'def':
                        team[i].Overall += team[i].Overall / (def_count - 1) - (average_def_rating)/ (def_count * (def_count - 1));
                        team[i].Overall = (team[i].Overall < 0) ? 0 :(team[i].Overall);
                        break;
                    case 'mid':
                        team[i].Overall += team[i].Overall / (mid_count - 1) - (average_mid_rating)/ (mid_count * (mid_count - 1));
                        team[i].Overall = (team[i].Overall < 0) ? 0 :(team[i].Overall);
                        break;
                    default:
                        break;
                }
            }
        };
        var penalty_shootout = function()
        {
            var aggregate = Goals[0];
            var confidence = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
            var b;
            var time = 0;
            var force =
            {
                x : 0,
                y : 0,
                z : 0
            };
            var direction =
            {
                x : 0,
                y : 0,
                z : 0
            };
            var spin =
            {
                x : 0,
                y : 0
            };
            striker = [];
            var keeper = [data.team[0].ratings[0], data.team[1].ratings[0]];
            var error;
            var distance;
            var dive =
            {
                dist : 0,
                speed : 0,
                x : 0,
                y : 0
            };
            var flag;
            var reaction_time = 0;
            for(k = 0; k < 2; ++k)
            {
                striker[k] = data.team[k].ratings.sort( function(a, b) {
                    return ((b.Type == 'strike') || (b.Overall >= a.Overall) && (b.Shot >= a.Shot));
                }).slice(0, 5);
            }
            data.match.commentary.push(penalty[rand(penalty.length)]);
            for( i = 0 ; i < 5 ; ++i )
            {
                k = 0;
                for (b = 0; b < 2; ++b)
                {
                    data.match.commentary.push(striker[+k][i].Name);
                    flag = 0;
                    direction.x = Math.pow(-1, rand(2)) * rand(10);
                    direction.y = rand(4);
                    error = (Math.abs(direction.x * direction.y)) * rand() * Math.pow(-1, rand(2)) * rand(101 - striker[+k][i].Overall - confidence[+k][i]) / 20;
                    spin.y = (rand(striker[+k][i].Overall + confidence[+k][i] - direction.y) + 1) * Math.pow(-1, rand(2)) / (error ? error : 1);
                    spin.x = (rand(striker[+k][i].Overall + confidence[+k][i] - Math.abs(direction.x) + 1) * Math.pow(-1, rand(2))) / (error ? error : 1);
                    force.x = rand(striker[+k][i].Shot * (1 - (striker[+k][i].Overall + confidence[+k][i]) / 100) + 1) + striker[+k][i].Shot * (striker[+k][i].Overall + confidence[+k][i]) / 100 - Math.abs(spin.x) + error;
                    force.y = rand(striker[+k][i].Shot * (1 - (striker[+k][i].Overall + confidence[+k][i]) / 100) + 1) + striker[+k][i].Shot * (striker[+k][i].Overall + confidence[+k][i]) / 100 - Math.abs(spin.y) + error;
                    force.z = Math.pow(Math.pow(force.x, 2) + Math.pow(force.y, 2), 0.5);
                    distance = Math.pow((Math.pow(direction.x, 2) + Math.pow(direction.y, 2) + 36), 0.5);
                    time = distance / force.z;
                    reaction_time = (1 / keeper[+!k].Overall) * (1 / keeper[+!k].Reflexes) * (rand((force.z * (1 - striker[+k][i].Overall / 100) + 1) + Math.pow((Math.pow(force.x, 2) + Math.pow(force.y, 2)), 0.5) * confidence[+!k][5]));
                    x = 5 * force.x * time * time * Math.pow(-1, +(direction.x < 0));
                    y = 5 * force.y * time * time;
                    dive.dist = Math.pow((Math.pow(y, 2) + Math.pow(x, 2)), 0.5) * 10;
                    dive.speed = (rand(dive.dist * (1 - keeper[+!k].Overall / 100) + 1) + dive.dist * keeper[+!k].Diving / 100) / reaction_time;
                    dive.x = dive.speed * time * direction.x / (Math.pow(Math.pow(direction.y, 2) + Math.pow(direction.x, 2), 0.5));
                    dive.y = dive.speed * time * direction.y / (Math.pow(Math.pow(direction.y, 2) + Math.pow(direction.x, 2), 0.5));
                    if ((y < 5) && (Math.abs(x) < 10))
                    {
                        if(((reaction_time - time) * (keeper[+!k].Overall + striker[+k][i].Overall) / 2 <= (keeper[+!k].Overall - striker[+k][i].Overall)) || (Math.abs(x - dive.x) <= 1 || Math.abs(y - dive.y) <= 1))
                        {
                            temp = block[rand(block.length)];
                            temp = temp.replace('/K', keeper[+!k].Name);
                            temp = temp.replace('/f', striker[+k][i].Name);
                            data.match.commentary.push(temp);
                            flag = 0;
                        }
                        else
                        {
                            temp = penalty[rand(penalty.length)];
                            temp = temp.replace('/K', keeper[+!k].Name);
                            temp = temp.replace('/f', striker[+k][i].Name);
                            data.match.commentary.push(temp);
                            ++Goals[+k];
                            flag = 1;
                        }
                    }
                    else
                    {
                        temp = miss[rand(miss.length)];
                        temp = temp.replace('/K', keeper[+!k].Name);
                        temp = temp.replace('/f', striker[+k][i].Name);
                        data.match.commentary.push(temp);
                        flag = 0;
                    }
                    data.team[+k].ratings[strike].stamina -= 2;
                    data.team[+!k].ratings[0].stamina -= 2;
                    k = +!k;
                }
                for (j = i + 1; j < 6; ++j)
                {
                    confidence[+k][j] -= Math.pow(-1, flag) * keeper[+!k].Overall / striker[+k][i].Overall;
                    confidence[+!k][j] += Math.pow(-1, flag) * keeper[+!k].Overall / striker[+k][i].Overall;
                }
                --data.team[+k].ratings[i].stamina;
                --keeper[+!k].stamina;
                if((Goals[1] + 4 - i < Goals[0]) || (Goals[0] + 4 - i < Goals[1]))
                {
                    data.match.commentary.push(hopeless[rand(hopeless.length)]);
                }
            }
            data.match.commentary.push('Penalties: ' + data.team[0]._id + ': ' + (Goals[0] - aggregate) + ' | ' + (Goals[1] - aggregate) + ' :' + data.team[1]._id);
            if(Goals[0] == Goals[1])
            {
                ++data.team[0].points;
                ++data.team[1].points;
                data.team[0].goals_for += Goals[0];
                data.team[1].goals_for += Goals[0];
                data.team[0].goals_against += Goals[0];
                data.team[1].goals_agaisnt += Goals[0];
                data.match.commentary.push(tie[rand(tie.length)]);
                return -1;
            }
            return +(Goals[1] > Goals[0]);
        };
        var com = function(arg)
        {
            temp = arg[rand(arg.length)];
            temp = temp.replace('/t', data.team[+kick]._id);
            temp = temp.replace('/T', data.team[+!kick]._id);
            temp = temp.replace('/k', data.team[+kick].ratings[0].Name);
            temp = temp.replace('/K', data.team[+!kick].ratings[0].Name);
            temp = temp.replace('/f', striker[+kick][rand(striker[+kick].length)]);
            temp = temp.replace('/F', striker[+!kick][rand(striker[+!kick].length)]);
            temp = temp.replace('/d', defender[+kick][rand(defender[+kick].length)]);
            temp = temp.replace('/D', defender[+!kick][rand(defender[+!kick].length)]);
            temp = temp.replace('/m', midfielder[+kick][rand(midfielder[+kick].length)]);
            temp = temp.replace('/M', midfielder[+!kick][rand(midfielder[+!kick].length)]);
            data.match.commentary.push(temp);
        };
        var path = require('path');
        var tie = require(path.join(__dirname, 'commentary' , 'tie'));
        var end = require(path.join(__dirname, 'commentary' , 'end'));
        var foul = require(path.join(__dirname, 'commentary' , 'foul'));
        var half = require(path.join(__dirname, 'commentary' , 'half'));
        var pass = require(path.join(__dirname, 'commentary' , 'pass'));
        var miss = require(path.join(__dirname, 'commentary' , 'miss'));
        var intro = require(path.join(__dirname, 'commentary' , 'intro'));
        var score = require(path.join(__dirname, 'commentary' , 'score'));
        var block = require(path.join(__dirname, 'commentary' , 'block'));
        var tackle = require(path.join(__dirname, 'commentary' , 'tackle'));
        var offside = require(path.join(__dirname, 'commentary' , 'offside'));
        var penalty = require(path.join(__dirname, 'commentary' , 'penalty'));
        var general = require(path.join(__dirname, 'commentary' , 'general'));
        var shootout = require(path.join(__dirname, 'commentary' , 'shootout'));
        var hopeless = require(path.join(__dirname, 'commentary' , 'hopeless'));
        var intercept = require(path.join(__dirname, 'commentary' , 'intercept'));
        var ball =
        {
            x : 64.5,
            y : 34.5
        };
        var against = [];
        var friendly = [];
        var Goals = [0,0];
        var shots = [0, 0];
        var fouls = [0, 0];
        var passes = [0, 0];
        var mean_rating = [];
        var possession = [0,0];
        var last_five_pos = [];
        var last_five_dom = [];
        var striker = [[], []];
        var defender = [[], []];
        var midfielder = [[], []];
        var form = ['poor', 'average', 'good', 'excellent'];
        var formation =   // To be used as a constant reference.
        [
            /*
            The playing field size is 130 X 70 yards. In the following entities, the standard computer graphical
            representation standards are followed to the letter. Hence, x represents the downward distance of the
            player's position from the top side of the playing field. Similarly, y represents the rightward
            distance of the player's position from the left side of the playing field. Both distances are in
            yards only.
            */
            // formation[0] ==> 4 - 4 - 2
            [
                { x : 5.5, y : 34.5 },  // 0
                { x : 36, y : 3 },      // 1
                { x : 36, y : 24 },     // 2
                { x : 36, y : 45 },     // 3
                { x : 36, y : 66 },     // 4
                { x : 70, y : 3 },      // 5
                { x : 70, y : 24 },     // 6
                { x : 70, y : 45 },     // 7
                { x : 70, y : 66 },     // 8
                { x : 111, y : 24 },    // 9
                { x : 111, y : 45 },     // 10
                '4 - 4 - 2'
            ],
            // formation[1] ==> 4 - 3 - 3
            [
                { x : 5.5, y : 34.5 },  // 0
                { x : 36, y : 3 },      // 1
                { x : 36, y : 24 },     // 2
                { x : 36, y : 45 },     // 3
                { x : 36, y : 66 },     // 4
                { x : 74.5, y : 12.5 }, // 5
                { x : 74.5, y : 34.5 }, // 6
                { x : 74.5, y : 56.5 }, // 7
                { x : 107.5, y : 12.5 },// 8
                { x : 107.5, y : 56.5 },// 9
                { x : 109.5, y : 34.5 }, // 10
                '4 - 3 - 3'
            ],
            // formation[2] ==> 3 - 5 - 2
            [
                { x : 5.5, y : 34.5 },  // 0
                { x : 36, y : 12 },     // 1
                { x : 36, y : 34.5 },   // 2
                { x : 36, y : 57 },     // 3
                { x : 74.5, y : 6 },    // 4
                { x : 74.5, y : 20 },   // 5
                { x : 74.5, y : 34.5 }, // 6
                { x : 74.5, y : 49 },   // 7
                { x : 74.5, y : 63 },   // 8
                { x : 111, y : 24 },    // 9
                { x : 111, y : 45 },     // 10
                '3 - 5 - 2'
            ],
            // formation[3] ==> 4 - 5 - 1
            [
                { x : 5.5, y : 34.5 },  // 0
                { x : 36, y : 3 },      // 1
                { x : 36, y : 24 },     // 2
                { x : 36, y : 45 },     // 3
                { x : 36, y : 66 },     // 4
                { x : 74.5, y : 6 },    // 5
                { x : 74.5, y : 20 },   // 6
                { x : 74.5, y : 34.5 }, // 7
                { x : 74.5, y : 49 },   // 8
                { x : 74.5, y : 63 },   // 9
                { x : 107.5, y : 34.5 }, // 10
                '4 - 5 - 1'
            ],
            // formation[4] ==> 3 - 4 - 3
            [
                { x : 5.5, y : 34.5 },  // 0
                { x : 36, y : 12 },     // 1
                {x : 36, y : 34.5 },   // 2
                { x : 36, y : 57 },     // 3
                { x : 70, y : 3 },      // 4
                { x : 70, y : 24 },     // 5
                { x : 70, y : 45 },     // 6
                { x : 70, y : 66 },     // 7
                { x : 107.5, y : 12.5 },// 8
                { x : 107.5, y : 56.5 },// 9
                { x : 109.5, y : 34.5 }, // 10
                '3 - 4 - 3'
            ],
            // formation[5] ==> 5 - 3 - 2
            [
                { x : 5.5, y : 34.5 },  // 0
                { x : 36, y : 6 },      // 1
                { x : 36, y : 20 },     // 2
                { x : 36, y : 34.5 },   // 3
                { x : 36, y : 49 },     // 4
                { x : 36, y : 63 },     // 5
                { x : 74.5, y : 12.5 }, // 6
                { x : 74.5, y : 34.5 }, // 7
                { x : 74.5, y : 56.5 }, // 8
                { x : 111, y : 24 },    // 9
                { x : 111, y : 45},     // 10
                '5 - 3 - 2'
            ],
            // formation[6] ==> 3 - 3 - 4
            [
                { x : 5.5, y : 34.5 },  // 0
                { x : 36, y : 12 },     // 1
                { x : 36, y : 34.5 },   // 2
                { x : 36, y : 57 },     // 3
                { x : 74.5, y : 12.5 }, // 4
                { x : 74.5, y : 34.5 }, // 5
                { x : 74.5, y : 56.5 }, // 6
                { x : 111, y : 12 },    // 7
                { x : 111, y : 24 },    // 8
                { x : 111, y : 47 },    // 9
                { x : 111, y : 57},     // 10
                '3 - 3 - 4'
            ]
        ];
        var i;
        var j;
        var x;
        var y;
        var k;
        var pos;
        var flag;
        var goal;
        var loop;
        var index;
        var strike;
        var winner;
        var dom = 0;
        var mid_count;
        var def_count;
        var keep_count;
        var hold = false;
        var strike_count;
        var kick = rand(2);
        var average_mid_rating;
        var average_def_rating;
        var average_keep_rating;
        var average_strike_rating;
        var keeper_performance_index;
        var strike_performance_index;
        var temp = (data.team[0].form - data.team[1].form) / 2;
        data.match.commentary = [];
        Make(data.team[0].ratings, 0);
        Make(data.team[1].ratings, 1);
        data.match.commentary.push(data.team[0]._id + ' VS ' + data.team[1]._id);
        data.match.commentary.push('Formations: ');
        data.match.commentary.push(data.team[0]._id + ': ' + formation[data.team[0].squad[11]][11] + ' | ' + formation[data.team[1].squad[11]][11] + ' :' + data.team[1]._id);
        if(data.team[0].played && data.team[1].played)
        {
            data.match.commentary.push('Form:');
            data.match.commentary.push(data.team[0]._id + ': ' + form[Math.floor(data.team[0].form * 100 / mean_rating[0])] + ' | ' + form[Math.floor(data.team[1].form * 100 / mean_rating[1])] + ' :' + data.team[1]._id);
        }
        data.match.commentary.push('Playing XI\'s:');
        data.match.commentary.push(data.team[0]._id + ' | ' + data.team[1]._id);
        for(i = 0; i < 11; ++i)
        {
            data.match.commentary.push(data.team[0].ratings[i].Name + '(' + data.team[0].ratings[i].Type + ') | (' + data.team[1].ratings[i].Name + (data.team[1].ratings[i].Type) + ')');
        }
        temp = (parseFloat(mean_rating[0] * 100)/(mean_rating[0] + mean_rating[1]) + temp).toFixed(2);
        data.match.commentary.push('Winning chances: ');
        data.match.commentary.push(data.team[0]._id + ': ' + temp + ' % | % ' + (100 - temp) + ' :' + data.team[1]._id);
        data.match.commentary.push('Form: ');
        data.match.commentary.push(data.team[0]._id + ': ' + form[data.team[0].form * 100 / mean_rating[0]] + ' | ' + form[data.team[1].form * 100 / mean_rating[1]] + ' :' + data.team[1]._id);
        data.match.commentary.push(data.team[+kick]._id + ' shall kickoff.');
        index = kick;
        for(loop = 0; loop < 2; ++loop)
        {
            for(i = 1; i < 46; ++i)
            {
                    if (ball.x < 0)
                    {
                        ball.x = 5.5;
                        ball.y = 34.5;
                        kick = 0;
                        hold = true;
                    }
                    else if (ball.x > 130)
                    {
                        ball.x = 123.5;
                        ball.y = 34.5;
                        kick = 1;
                        hold = true;
                    }
                    else
                    {
                        kick = !kick;
                        hold = true;
                        if(ball.y < 0)
                        {
                            ball.x = parseInt(64.5 + ((64.5 - ball.x) / (ball.y - 34.5)) * 34.5);
                            ball.y = 0;
                        }
                        else if(ball.y > 70)
                        {
                            ball.x = parseInt(64.5 + (( ball.x - 64.5) / (ball.y - 34.5)) * 36.5);
                            ball.y = 70;
                        }
                    }
                    data.match.commentary.push((i + loop * 45) + ': ');
                    if(!hold)
                    {
                        temp =(Math.pow(data.team[0].ratings[1].position.x - ball.x, 2) + Math.pow(data.team[+kick].ratings[1].position.y - ball.x, 2)) * (rand(50 - data.team[+kick].ratings[1].stamina) + 1);
                        temp /= (400 - data.team[+kick].ratings[1].Pace - data.team[+kick].ratings[1].Overall - data.team[+kick].ratings[1].Positioning - data.team[+kick].ratings[1].Physical);
                        for(y = 0; y < 2; ++y)
                        {
                            for(j = 1; j < 11; ++j)
                            {
                                k = (Math.pow(data.team[y].ratings[j].position.x - ball.x, 2) + Math.pow(data.team[y].ratings[1].position.y - ball.x, 2)) * (rand(50 - data.team[y].ratings[1].stamina) + 1);
                                k /= (400 - data.team[y].ratings[j].Pace - data.team[y].ratings[1].Overall - data.team[y].ratings[1].Positioning - data.team[y].ratings[1].Physical);
                                if(k < temp)
                                {
                                    temp = k;
                                    x = j;
                                    kick = y;
                                }
                            }
                        }
                        hold = true;
                        ball.x = data.team[+kick].ratings[x].position.x;
                        ball.y = data.team[+kick].ratings[x].position.y;
                    }
                    friendly = [];
                    against  = [];
                    for (j = 1; j < 12; ++j)
                    {
                        if(((ball.x * Math.pow(-1, +kick)) < (data.team[+kick].ratings[j].position.x * Math.pow(-1, +kick))) && (((data.team[+kick].ratings[j].position.x * Math.pow(-1, +kick))) < (+!kick * 118 + 5.5) * (Math.pow(-1, +kick))))
                        {
                            friendly.push(j);
                            --data.team[+kick].ratings[j].stamina;
                        }
                        if(((ball.x * Math.pow(-1, +kick)) < (data.team[+!kick].ratings[j].position.x * Math.pow(-1, +kick))) && ((data.team[+!kick].ratings[j].position.x * Math.pow(-1, +kick)) < (+!kick * 118 + 5.5)*(Math.pow(-1, +kick))))
                        {
                            against.push(j);
                            --data.team[+!kick].ratings[j].stamina;
                        }
                    }
                    temp = [];
                    k = 0;
                    temp = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
                    if(friendly.length)
                    {
                        for(x in data.team[+kick].ratings[0])
                        {
                            if(x == 'Price')
                            {
                                break;
                            }
                            else if(x == '_id' || x == 'Name')
                            {
                                continue;
                            }
                            for(j in friendly)
                            {
                                temp[0][k] += 1 / data.team[+kick].ratings[friendly[j]][x];
                            }
                            temp[0][k] = friendly.length / temp[0][k++];
                        }
                    }
                    k = 0;
                    if(against.length)
                    {
                        for(x in data.team[+!kick].ratings[0])
                        {
                            if(x == 'Price')
                            {
                                break;
                            }
                            else if(x == '_id' || x == 'Name')
                            {
                                continue;
                            }
                            for(j in against)
                            {
                                temp[1][k] += 1 / data.team[+!kick].ratings[against[j]][x];
                            }
                            temp[1][k] = against.length / temp[1][k++];
                        }
                    }
                    for(k = 0; k < 2; ++k)
                    {
                        x = 1;
                        y = 0;
                        for (j = 0; j < 13; ++j)
                        {
                            x *= temp[k][j];
                            y += temp[k][j];
                        }
                        x = Math.pow(x, 1 / 13);
                        y /= 13;
                        temp[k] = [x, y];
                    }
                    x = (Math.pow(-1, rand(2)) + (temp[0][1] - temp[1][0]) / 10) * rand(temp[0][0]) + temp[0][1];
                    y = (Math.pow(-1, rand(2)) + (temp[1][1] - temp[0][0]) / 10) * rand(temp[1][0]) + temp[1][1];
                    goal = (x - y) / 10;
                    temp = +(goal < 0);
                    goal = Math.abs(goal);
                    pos = Math.abs((temp) ? (1 / goal) : (1 - 1 / goal));
                    pos = (pos > 1) ? 1 : pos;
                    kick = temp ? !kick : kick;
                    // limits to be rearranged based on test results
                    if(!goal)
                    {
                        com(general);
                    }
                    else if(goal > 0 && goal <= 1) // missed pass
                    {
                        hold = false;
                        j = parseInt(rand(friendly.length));
                        ball.x = rand(ball.x - data.team[+kick].ratings[j].position.x) + Math.min(ball.x, data.team[+kick].ratings[j].position.x);
                        ball.y = rand(ball.y - data.team[+kick].ratings[j].position.y) + Math.min(ball.y, data.team[+kick].ratings[j].position.y);
                        com(intercept);
                    }
                    else if(goal > 1 && goal <= 2) // pass
                    {
                        hold = true;
                        ++passes[+kick];
                        temp = Math.pow((data.team[+kick].ratings[friendly[0]].position.x - ball.x), 2) + Math.pow((data.team[+kick].ratings[friendly[0]].position.y - ball.y), 2);
                        y = friendly[0];
                        for(j in friendly)
                        {
                            k = Math.pow((data.team[+kick].ratings[friendly[0]].position.x - ball.x), 2) + Math.pow((data.team[+kick].ratings[friendly[0]].position.y - ball.y), 2);
                            if(k < temp)
                            {
                                temp = k;
                                y = friendly[j];
                            }
                        }
                        com(pass);
                        ball.x = data.team[+kick].ratings[y].position.x;
                        ball.y = data.team[+kick].ratings[y].position.y;
                    }
                    else if(goal > 2 && goal <= 3) // intercept
                    {
                        hold = false;
                        x = rand(ball.x - data.team[+kick].ratings[1].position.x) + Math.min(ball.x, data.team[+kick].ratings[1].position.x);
                        y = rand(ball.y - data.team[+kick].ratings[1].position.y) + Math.min(ball.y, data.team[+kick].ratings[1].position.y);
                        k = Math.pow(x - data.team[+kick].ratings[0].position.x , 2) + Math.pow(y - data.team[+kick].ratings[0].position.y, 2);
                        temp = 0;
                        for(j in friendly)
                        {
                            if(Math.pow(x - data.team[+kick].ratings[j].position.x , 2) + Math.pow(y - data.team[+kick].ratings[j].position.y, 2) < k)
                            {
                                k = Math.pow(x - data.team[+kick].ratings[j].position.x , 2) + Math.pow(y - data.team[+kick].ratings[j].position.y, 2);
                                temp = j;
                            }
                        }
                        if(rand(2))
                        {
                            ball.x = data.team[+kick].ratings[temp].position.x;
                            ball.y = data.team[+kick].ratings[temp].position.y;
                            hold = true;
                        }
                        --data.team[+kick].ratings[temp].stamina;
                        com(intercept);
                    }
                    else if(goal > 3 && goal <= 4) // tackle
                    {
                        temp = [];
                        temp[0] = Math.pow(ball.x - data.team[+kick].ratings[1].position.x, 2) + Math.pow(ball.y - data.team[+kick].ratings[1].position.y, 2);
                        temp[1] = Math.pow(ball.x - data.team[+!kick].ratings[1].position.x, 2) + Math.pow(ball.y - data.team[+!kick].ratings[1].position.y, 2);
                        x = 1;
                        y = 1;
                        for(j in data.team[0].ratings)
                        {
                            if(Math.pow(ball.x - data.team[+!kick].ratings[j].position.x, 2) + Math.pow(ball.y - data.team[+kick].ratings[j].position.y, 2) < temp[0])
                            {
                                temp[0] = Math.pow(ball.x - data.team[+kick].ratings[j].position.x, 2) + Math.pow(ball.y - data.team[+kick].ratings[j].position.y, 2);
                                x = j;
                            }
                            if(Math.pow(ball.x - data.team[+!kick].ratings[1].position.x, 2) + Math.pow(ball.y - data.team[+!kick].ratings[1].position.y, 2) < temp[1])
                            {
                                temp[1] = Math.pow(ball.x - data.team[+!kick].ratings[1].position.x, 2) + Math.pow(ball.y - data.team[+!kick].ratings[1].position.y, 2);
                                y = j;
                            }
                        }
                        temp[0] = data.team[+kick].ratings[x]. Physical * (1 + 10 / (100 - data.team[+kick].ratings[x].Overall) - data.team[+kick].ratings[x].Overall / 100);
                        temp[1] = data.team[+!kick].ratings[y]. Physical * (1 + 10 / (100 - data.team[+!kick].ratings[y].Overall) - data.team[+!kick].ratings[y].Overall / 100);
                        temp[0] = rand(temp[0]) + data.team[+kick].ratings[x].Physical * data.team[+kick].ratings[x].Overall / 100;
                        temp[1] = rand(temp[1]) + data.team[+!kick].ratings[y].Physical * data.team[+!kick].ratings[y].Overall / 100;
                        if(temp[1] > temp[0])
                        {
                            kick = !kick;
                        }
                        com(tackle);
                    }
                    else if(goal > 4 && goal <= 5) // foul
                    {
                        kick = !kick;
                        hold = false;
                        ++fouls[+kick];
                        com(foul);
                        if(ball.x * Math.pow(-1, +kick) <= (23 + 83 * +kick) * Math.pow(-1, +kick))
                        {
                            strike = 10 - rand(striker[+kick].length);
                            strike_performance_index = ((Math.pow(-1, (rand(2))) + (data.team[+kick].ratings[strike].Overall - data.team[+!kick].ratings[0].Overall) / 10) * (rand(Math.pow((data.team[+kick].ratings[strike].Shot * data.team[+kick].ratings[strike].Pace)), 0.5)) + (data.team[+kick].ratings[strike].Pace + data.team[+kick].ratings[strike].Shot) / 2);
                            keeper_performance_index = ((Math.pow(-1, (rand(2))) + (data.team[+!kick].ratings[0].Overall - data.team[+kick].ratings[strike].Overall) / 10) * (rand(Math.pow((data.team[+!kick].ratings[strike].Reflexes) * data.team[+!kick].ratings[strike].Positioning * data.team[+!kick].ratings[strike].Speed), 1 / 2)) + (data.team[+!kick].ratings[strike].Positioning + data.team[+!kick].ratings[strike].Reflexes + data.team[+!kick].ratings[strike].Speed) / 2);
                            if (strike_performance_index > keeper_performance_index)
                            {
                                ++Goals[+kick];
                                com(score);
                                data.match.commentary.push(data.team[0]._id + ': ' + Goals[0] + ' | ' + Goals[1] + ' :' + data.team[1]._id);
                                kick = !kick;
                                ball.x = 64.5;
                            }
                            else
                            {
                                ball.x = 5.5 + 118 * +!kick;
                                com(miss);
                            }
                            ball.y = 34.5;
                            data.team[+kick].ratings[strike].stamina -= 2;
                            data.team[+!kick].ratings[0].stamina -= 2;
                        }
                        else
                        {
                            ball.x = rand(ball.x - (5.5 + 118 * +kick)) + Math.min(ball.x, (5.5 + 118 * +kick));
                            ball.y = rand(ball.y - 34.5) + Math.min(ball.y, 34.5);
                        }
                        hold = true;
                    }
                    else if(goal > 5 && goal <= 6) // offside
                    {
                        ball.x = 5.5 + 118 * (+!kick);
                        ball.y = 34.5;
                        hold = true;
                        com(offside);
                    }
                    else // goal opportunity
                    {
                         flag = false;
                         ++shots[+kick];
                         temp = [0, 0, 0, 0];
                         for (j = 1; j < 11; ++j)
                         {
                            if (friendly.indexOf(j) > -1)
                            {
                                if (!flag)
                                {
                                    strike = j;
                                    flag = true;
                                }
                                else
                                {
                                    temp =
                                    [
                                        +(data.team[+kick].ratings[j].Overall > data.team[+kick].ratings[strike].Overall),
                                        +(data.team[+kick].ratings[j].Pace > data.team[+kick].ratings[strike].Pace),
                                        +(data.team[+kick].ratings[j].Shot > data.team[+kick].ratings[strike].Shot),
                                        +(data.team[+kick].ratings[j].Positioning > data.team[+kick].ratings[strike].Positioning)
                                    ];
                                    if (temp[0] + temp[1] + temp[2] + temp[3] > 2)
                                    {
                                        temp = [0, 0, 0, 0];
                                        strike = j;
                                    }
                                }
                            }
                         }
                         strike_performance_index = ((Math.pow(-1, (rand(2))) + (data.team[+kick].ratings[strike].Overall - data.team[+!kick].ratings[0].Overall) / 10) * (rand(Math.pow((data.team[+kick].ratings[strike].Shot * data.team[+kick].ratings[strike].Pace)), 0.5)) + (data.team[+kick].ratings[strike].Pace + data.team[+kick].ratings[strike].Shot) / 2);
                         keeper_performance_index = ((Math.pow(-1, (rand(2))) + (data.team[+!kick].ratings[0].Overall - data.team[+kick].ratings[strike].Overall) / 10) * (rand(Math.pow((data.team[+!kick].ratings[strike].Reflexes) * data.team[+!kick].ratings[strike].Positioning * data.team[+!kick].ratings[strike].Speed), 1 / 2)) + (data.team[+!kick].ratings[strike].Positioning + data.team[+!kick].ratings[strike].Reflexes + data.team[+!kick].ratings[strike].Speed) / 2);
                         if (strike_performance_index > keeper_performance_index)
                         {
                            com(score);
                            data.match.commentary.push(data.team[0]._id + ': ' + Goals[0] + ' | ' + Goals[1] + ' :' + data.team[1]._id);
                            ++Goals[+kick];
                            kick = !kick;
                            ball.x = 64.5;
                        }
                        else
                        {
                            com(miss);
                            ball.x = 5.5 + 118 * +!kick;
                            hold = true;
                        }
                        ball.y = 34.5;
                        data.team[+kick].ratings[strike].stamina -= 2;
                        data.team[+!kick].ratings[0].stamina -= 2;
                    }
                    data.match.commentary.push('Possession: ');
                    data.match.commentary.push(data.team[0]._id + ': ' + (pos * 100).toFixed(2) + ' % | % ' + ((1 - pos) * 100).toFixed(2) + ' :' + data.team[1]._id);
                    last_five_pos.unshift(pos);
                    if(i > 3)
                    {
                        temp = last_five_pos[0] + last_five_pos[1] + last_five_pos[2] + last_five_pos[3] + last_five_pos[4];
                        data.match.commentary.push(' Possession during the last 5 minutes: ' + data.team[0]._id + ': ' + (temp * 20).toFixed(2) + ' % | % ' + ((5 - temp) * 20).toFixed(2) + ' :' + data.team[1]._id);
                        last_five_pos.pop();
                    }
                    possession[0] = (possession[0] * (i + 45 * +loop - 1) + pos) / (i + 45 * +loop);
                    possession[1] = (possession[1] * (i + 45 * +loop - 1) + (1 - pos)) / (i + 45 * +loop);
                    data.match.commentary.push('Overall possession: ');
                    data.match.commentary.push(data.team[0]._id + ': ' + (possession[0] * 100).toFixed(2) + ' % | % ' + (possession[1] * 100).toFixed(2) + ' :' + data.team[1]._id);
                    dom += +(possession[0] > possession[1]);
                    last_five_dom.unshift(+(possession[0] > possession[1]));
                    if(i > 3)
                    {
                        temp = last_five_dom[0] + last_five_dom[1] + last_five_dom[2] + last_five_dom[3] + last_five_dom[4];
                        data.match.commentary.push(' Dominance during the last 5 minutes: ' + data.team[0]._id + ': ' + (temp * 20).toFixed(2) + ' % | % ' + ((5 - temp) * 20).toFixed(2) + ' :' + data.team[1]._id);
                        last_five_dom.pop();
                    }
                    data.match.commentary.push('Dominance: ');
                    temp = (dom * 100 / (i + 45 * +loop) ).toFixed(2);
                    data.match.commentary.push(data.team[0]._id + ': ' + temp + ' % | % ' + (100 - temp) + ' :' + data.team[1]._id);
            }
            data.match.commentary.push(half[rand(half.length)]);
            if(loop)
            {
                data.match.commentary.push('Half time: ');
                data.match.commentary.push(half[rand(half.length)]);
                for(i = 0; i < 2; ++i)
                {
                    for(j = 0; j < 12; ++j)
                    {
                        data.team[i].ratings[j].stamina += (50 - data.team[i].ratings[j].stamina) / (5 - (data.team[i].ratings[j].stamina / (100 - data.team[i].ratings[j].Overall)));
                    }
                }
                ball.x = 64.5;
                ball.y = 34.5;
                kick = !index;
            }
            else
            {
                data.match.commentary.push('Final Score');
                data.match.commentary.push(end[rand(end.length)]);
            }
            data.match.commentary.push(data.team[0]._id + ': ' + Goals[0] + ' | ' + Goals[1] + ' :' + data.team[1]._id);
        }
        winner = +(Goals[1] > Goals[0]);
        if(Goals[0] == Goals[1])
        {
            data.match.commentary.push(shootout[rand(shootout.length)]);
            winner = penalty_shootout();
        }
        if (parseInt(+winner) != -1)
        {
            data.match.commentary.push(data.team[+winner]._id + ' wins against ' + data.team[+!winner]._id);
            ++data.team[+winner].win;
            ++data.team[+!winner].loss;
            data.team[+winner].points += 3;
            data.team[+winner].goals_for += Goals[+winner];
            data.team[+!winner].goals_for += Goals[+!winner];
            data.team[+!winner].goals_against += Goals[+winner];
            data.team[+winner].goals_against += Goals[+!winner];
            data.team[+winner].goal_diff = data.team[+winner].goals_for  - data.team[+winner].goals_against;
            data.team[+!winner].goal_diff = data.team[+!winner].goals_for  - data.team[+!winner].goals_against;
            data.team[+winner].streak = (data.team[+winner].streak < 0) ? (1) : (data.team[+winner].streak + 1);
            data.team[+!winner].streak = (data.team[+!winner].streak > 0) ? (0) : (data.team[+!winner].streak - 1);
            data.team[+winner].ratio = (data.team[+winner].win / (data.team[+winner].loss ? data.team[+winner].loss : 1)).toFixed(2);
            data.team[+!winner].ratio = (data.team[+!winner].win / (data.team[+!winner].loss ? data.team[+!winner].loss : 1)).toFixed(2);
        }
    }
    Goals[0] = Goals[0] ? Goals[0] : 1;
    Goals[1] = Goals[1] ? Goals[1] : 1;
    ++data.team[0].played;
    ++data.team[1].played;
    delete data.team[0].ratings;
    delete data.team[1].ratings;
    data.team[0].shots += shots[0];
    data.team[1].shots += shots[1];
    data.team[0].fouls += fouls[0];
    data.team[1].fouls += fouls[1];
    data.team[0].passes += passes[0];
    data.team[1].passes += passes[1];
    data.team[0].accuracy = (data.team[0].goals_for * 100 / data.team[0].shots).toFixed(2);
    data.team[1].accuracy = (data.team[1].goals_for * 100 / data.team[1].shots).toFixed(2);
    data.team[0].mean_goals_for = (data.team[0].goals_for / data.team[0].played).toFixed(2);
    data.team[1].mean_goals_for = (data.team[1].goals_for / data.team[1].played).toFixed(2);
    data.team[0].mean_goals_against = (data.team[0].goals_against / data.team[0].played).toFixed(2);
    data.team[1].mean_goals_against = (data.team[1].goals_against / data.team[1].played).toFixed(2);
    data.team[0].possession = (((data.team[0].played - 1) * data.team[0].possession + possession[0]) / data.team[0].played).toFixed(2);
    data.team[1].possession = (((data.team[1].played - 1) * data.team[1].possession + possession[1]) / data.team[1].played).toFixed(2);
    data.team[0].dominance = parseFloat(((data.team[0].dominance * (data.team[0].played - 1) + dom / 90) / data.team[0].played).toFixed(2));
    data.team[1].dominance = parseFloat(((data.team[1].dominance * (data.team[1].played - 1) + (1 - dom / 90)) / data.team[1].played).toFixed(2));
    data.team[0].form += parseFloat(((possession[0] * mean_rating[1] / Goals[1] - possession[1] * mean_rating[0] / Goals[0]) / 1000).toFixed(2));
    data.team[1].form += parseFloat(((possession[1] * mean_rating[0] / Goals[0] - possession[0] * mean_rating[1] / Goals[1] ) / 1000).toFixed(2));
    data.team[0].morale += parseFloat(((Math.pow(-1, +winner) * Goals[0] * mean_rating[1] / (Goals[1] * mean_rating[0]) * dom) / 100).toFixed(2));
    data.team[1].morale -= parseFloat(((Math.pow(-1, +winner) * Goals[1] * mean_rating[0] / (Goals[0] * mean_rating[1]) * (90 - dom)) / 100).toFixed(2));
    var newData =
    {
        team1: data.team[0],
        team2: data.team[1],
        match: data.match
    };
    callback(null, newData);
};