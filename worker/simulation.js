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
        function rand(arg)
        {   if(!arg)
            {
                return Math.random();
            }
            else
            {
                return parseInt(Math.random() * 1000000000000000) % arg;
            }
        }
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
                    { x: 5.5, y: 34.5 },  // 0
                    { x: 36, y: 3 },      // 1
                    { x: 36, y: 24 },     // 2
                    { x: 36, y: 45 },     // 3
                    { x: 36, y: 66 },     // 4
                    { x: 70, y: 3 },      // 5
                    { x: 70, y: 24 },     // 6
                    { x: 70, y: 45 },     // 7
                    { x: 70, y: 66 },     // 8
                    { x: 111, y: 24 },    // 9
                    { x: 111, y: 45 },     // 10
                    '4 - 4 - 2'
                ],
                    // formation[1] ==> 4 - 3 - 3
                [
                    { x: 5.5, y: 34.5 },  // 0
                    { x: 36, y: 3 },      // 1
                    { x: 36, y: 24 },     // 2
                    { x: 36, y: 45 },     // 3
                    { x: 36, y: 66 },     // 4
                    { x: 74.5, y: 12.5 }, // 5
                    { x: 74.5, y: 34.5 }, // 6
                    { x: 74.5, y: 56.5 }, // 7
                    { x: 107.5, y: 12.5 },// 8
                    { x: 107.5, y: 56.5 },// 9
                    { x: 109.5, y: 34.5 }, // 10
                    '4 - 3 - 3'
                ],
                    // formation[2] ==> 3 - 5 - 2
                [
                    { x: 5.5, y: 34.5 },  // 0
                    { x: 36, y: 12 },     // 1
                    { x: 36, y: 34.5 },   // 2
                    { x: 36, y: 57 },     // 3
                    { x: 74.5, y: 6 },    // 4
                    { x: 74.5, y: 20 },   // 5
                    { x: 74.5, y: 34.5 }, // 6
                    { x: 74.5, y: 49 },   // 7
                    { x: 74.5, y: 63 },   // 8
                    { x: 111, y: 24 },    // 9
                    { x: 111, y: 45 },     // 10
                    '3 - 5 - 2'
                ],
                    // formation[3] ==> 4 - 5 - 1
                [
                    { x: 5.5, y: 34.5 },  // 0
                    { x: 36, y: 3 },      // 1
                    { x: 36, y: 24 },     // 2
                    { x: 36, y: 45 },     // 3
                    { x: 36, y: 66 },     // 4
                    { x: 74.5, y: 6 },    // 5
                    { x: 74.5, y: 20 },   // 6
                    { x: 74.5, y: 34.5 }, // 7
                    { x: 74.5, y: 49 },   // 8
                    { x: 74.5, y: 63 },   // 9
                    { x: 107.5, y: 34.5 }, // 10
                    '4 - 5 - 1'
                ],
                // formation[4] ==> 3 - 4 - 3
                [
                    { x: 5.5, y: 34.5 },  // 0
                    { x: 36, y: 12 },     // 1
                    { x: 36, y: 34.5 },   // 2
                    { x: 36, y: 57 },     // 3
                    { x: 70, y: 3 },      // 4
                    { x: 70, y: 24 },     // 5
                    { x: 70, y: 45 },     // 6
                    { x: 70, y: 66 },     // 7
                    { x: 107.5, y: 12.5 },// 8
                    { x: 107.5, y: 56.5 },// 9
                    { x: 109.5, y: 34.5 }, // 10
                    '3 - 4 - 3'
                ],
                    // formation[5] ==> 5 - 3 - 2
                [
                    { x: 5.5, y: 34.5 },  // 0
                    { x: 36, y: 6 },      // 1
                    { x: 36, y: 20 },     // 2
                    { x: 36, y: 34.5 },   // 3
                    { x: 36, y: 49 },     // 4
                    { x: 36, y: 63 },     // 5
                    { x: 74.5, y: 12.5 }, // 6
                    { x: 74.5, y: 34.5 }, // 7
                    { x: 74.5, y: 56.5 }, // 8
                    { x: 111, y: 24 },    // 9
                    { x: 111, y: 45},     // 10
                    '5 - 3 - 2'
                ],
                    // formation[6] ==> 3 - 3 - 4
                [
                    { x: 5.5, y: 34.5 },  // 0
                    { x: 36, y: 12 },     // 1
                    { x: 36, y: 34.5 },   // 2
                    { x: 36, y: 57 },     // 3
                    { x: 74.5, y: 12.5 }, // 4
                    { x: 74.5, y: 34.5 }, // 5
                    { x: 74.5, y: 56.5 }, // 6
                    { x: 111, y: 12 },    // 7
                    { x: 111, y: 24 },    // 8
                    { x: 111, y: 47 },    // 9
                    { x: 111, y: 57},     // 10
                    '3 - 3 - 4'
                ]
            ];
        var i;
        var j;
        var mean_rating = [];
        var Goals = [0,0];
        var pos;
        var dom = 0;
        var passes = [0, 0];
        var fouls = [0, 0];
        var winner = -1;
        var possession = [0,0];
        var last_five_pos = [];
        var last_five_dom = [];
        var goal;
        var kick;
        var strike;
        var x;
        var y;
        var k;
        var hold;
        var keeper_performance_index;
        var strike_performance_index;
        var ball =
        {
            x : 64.5,
            y : 34.5
        };
        var shots = [];
        var def_count;
        var keep_count;
        var strike_count;
        var mid_count;
        var average_strike_rating;
        var average_mid_rating;
        var average_keep_rating;
        var average_def_rating;
        function Make(team, arg)
        {
            average_strike_rating = average_mid_rating = average_keep_rating = average_def_rating = keep_count = def_count = strike_count = mid_count = 0;
            for (i = 0; i <= 11; ++i)
            {
                x = 129 * arg + Math.pow(-1, arg) * formation[data.team[arg].squad[11]][i].x;
                y = 69 * arg + Math.pow(-1, arg) * formation[data.team[arg].squad[11]][i].y;
                team[i].stamina = 50;
                team[i].position =
                {
                    x : x,
                    y : y
                };
                switch (team[i].Type)
                {
                    case 'strike':
                        average_strike_rating += parseInt(team[i].Overall);
                        ++strike_count;
                        break;
                    case 'keep':
                        ++keep_count;
                        average_keep_rating += parseInt(team[i].Overall);
                        break;
                    case 'def':
                        average_def_rating += parseInt(team[i].Overall);
                        ++def_count;
                        break;
                    case 'mid':
                        average_mid_rating += parseInt(team[i].Overall);
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
                        team[i].Overall += parseFloat(team[i].Overall) / (strike_count - 1) - parseFloat(average_strike_rating)/ (strike_count * (strike_count - 1));
                        team[i].Overall = (team[i].Overall < 0) ? 0 : (team[i].Overall);
                        break;
                    case 'keep':
                        team[i].Overall += parseFloat(team[i].Overall) / (keep_count - 1) - parseFloat(average_keep_rating)/ (keep_count * (keep_count - 1));
                        team[i].Overall = (team[i].Overall < 0) ? 0 :(team[i].Overall);
                        break;
                    case 'def':
                        team[i].Overall += parseFloat(team[i].Overall) / (def_count - 1) - parseFloat(average_def_rating)/ (def_count * (def_count - 1));
                        team[i].Overall = (team[i].Overall < 0) ? 0 :(team[i].Overall);
                        break;
                    case 'mid':
                        team[i].Overall += parseFloat(team[i].Overall) / (mid_count - 1) - parseFloat(average_mid_rating)/ (mid_count * (mid_count - 1));
                        team[i].Overall = (team[i].Overall < 0) ? 0 :(team.Overall);
                        break;
                    default:
                        break;
                }
            }
        }
        Make(data.team[0].ratings, 0);
        Make(data.team[1].ratings, 1);
        data.match.commentary = [];
        data.match.commentary.push(data.team[0]._id + ' VS ' + data.team[1]._id);
        data.match.commentary.push('Formations: ');
        data.match.commentary.push(data.team[0]._id + ': ' + formation[data.team[0].squad[11]][11] + ' | ' + formation[data.team[1].squad[11]][11] + ' :' + data.team[1]._id);
        if(data.team[0].played && data.team[1].played)
        {
            data.match.commentary.push('Form:');
            data.match.commentary.push(data.team[0]._id + ': ' + form[Math.floor(data.team[0].form * 100 / mean_rating[0])] + ' | ' + form[Math.floor(data.team[1].form * 100 / mean_rating[1])] + ' :' + data.team[1]._id);
        }
        var penalty_shootout = function()
        {
            var aggregate = Goals[0];
            var confidence = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
            //Goals = [0,0];
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
            var keeper = [];
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
                for (i = 0; i < 5; ++i)
                {
                    b = i;
                    for (j = i + 1; j < 11; ++j)
                    {
                        if(data.team[k].ratings[j]['strike'] > data.team[k].ratings[b]['strike'])
                        {
                            b = j;
                        }
                    }
                    if(b != i)
                    {
                        temp[k] = data.team[k].ratings[i];
                        data.team[k].ratings[i] = data.team[k].ratings[b];
                        data.team[k].ratings[b] = temp[k];
                    }
                }
            }
            data.match.commentary.push(com.penalty[rand(com.penalty.length)]);
            for(k = 0; k < 2; ++k)
            {
                temp = [0 , 0, 0, 0];
                flag = false;
                for(i = 0 ; i < 11 ; ++i)
                {
                    if(data.team[k].ratings[i].Type == 'keep')
                    {
                        if(flag)
                        {
                            temp =
                            [
                                +(data.team[k].ratings[i].Overall > keeper[k].Overall),
                                +(data.team[k].ratings[i].Reflexes > keeper[k].Reflexes),
                                +(data.team[k].ratings[i].Speed > keeper[k].Speed),
                                +(data.team[k].ratings[i].Diving > keeper[k].Diving)
                            ];
                            if(temp[0] + temp[1] + temp[2] + temp[3] > 2)
                            {
                                temp = [0, 0, 0, 0];
                                keeper[k] = data.team[k].ratings[i];
                            }
                        }
                        else
                        {
                            keeper[k] = data.team[k].ratings[i];
                            flag = true;
                        }
                    }
                }
            }
            for( i = 0 ; i < 5 ; ++i )
            {
                k = 0;
                for (b = 0; b < 2; ++b)
                {
                    flag = 0;
                    direction.x = Math.pow(-1, rand(2)) * rand(10);
                    direction.y = rand(4);
                    error = (Math.abs(direction.x * direction.y)) * rand() * Math.pow(-1, rand(2)) * rand(101 - data.team[k].ratings[i].Overall - confidence[k][i]) / 20;
                    spin.y = (rand(data.team[k].ratings[i].Overall + confidence[k][i] - Math.abs(3 - direction.y) + 1) * Math.pow(-1, rand(2))) / 5;
                    spin.x = (rand(data.team[k].ratings[i].Overall + confidence[k][i] - Math.abs(direction.x) + 1) * Math.pow(-1, rand(2))) / 5;
                    force.x = rand(data.team[k].ratings[i].Physical * (1 - (data.team[k].ratings[i].Overall + confidence[k][i]) / 100) + 1) + data.team[k].ratings[i].Physical * (data.team[k].ratings[i].Overall + confidence[k][i]) / 100 - Math.abs(spin.x) + error;
                    force.y = rand(data.team[k].ratings[i].Physical * (1 - (data.team[k].ratings[i].Overall + confidence[k][i]) / 100) + 1) + data.team[k].ratings[i].Physical * (data.team[k].ratings[i].Overall + confidence[k][i]) / 100 - Math.abs(spin.y) + error;
                    force.z = Math.pow(Math.pow(force.x, 2) + Math.pow(force.y, 2), 0.5);
                    distance = Math.pow((Math.pow(direction.x, 2) + Math.pow(direction.y, 2) + 36), 0.5);
                    time = distance / force.z;
                    reaction_time = (1 / keeper[+!k].Overall) * (1 / keeper[+!k].Reflexes) * (rand((force.z * (1 - data.team[k].ratings[i].Overall / 100) + 1) + Math.pow((Math.pow(force.x, 2) + Math.pow(force.y, 2)), 0.5) * confidence[+!k][5]));
                    x = 0.5 * force.x * time * time * Math.pow(-1, +(direction.x < 0));
                    y = 0.5 * force.y * time * time;
                    dive.dist = Math.pow((Math.pow(y, 2) + Math.pow(x, 2)), 0.5);
                    dive.speed = (rand(dive.dist * (1 - keeper[+!k].Overall / 100) + 1) + dive.dist * keeper[+!k].Diving / 100)/ reaction_time;
                    dive.x = dive.speed * time * direction.x / Math.pow(Math.pow(direction.y, 2) + Math.pow(direction.x, 2), 0.5);
                    dive.y = dive.speed * time * direction.y / Math.pow(Math.pow(direction.y, 2) + Math.pow(direction.x, 2), 0.5);
                    if ((y < 5) && (Math.abs(x) < 10))
                    {
                        if(((reaction_time - time) * (keeper[+!k].Overall + data.team[+k].ratings[i].Overall) / 2 <= (keeper[+!k].Overall - data.team[+k].ratings[i].Overall) / data.team[+k].ratings[i].Overall) || (Math.abs(x - dive.x) <= 1 || Math.abs(y - dive.y) <= 1))
                        {
                            data.match.commentary.push(com.block[rand(com.block.length)]);
                            flag = 0;
                        }
                        else
                        {
                            data.match.commentary.push(com.penalty[rand(com.penalty.length)]);
                            ++Goals[+k];
                            flag = 1;
                        }
                    }
                    else
                    {
                        data.match.commentary.push(com.miss[rand(com.miss.length)]);
                        flag = 0;
                    }
                    for (j = i + 1; j < 6; ++j)
                    {
                        confidence[+k][j] -= Math.pow(-1, flag) * keeper[+!k].Overall / data.team[+k].ratings.Overall;
                        confidence[+!k][j] += Math.pow(-1, flag) * keeper[+!k].Overall / data.team[+k].ratings.Overall;
                    }
                    k = +!k;
                }
                if((Goals[1] + 4 - i < Goals[0]) || (Goals[0] + 4 - i < Goals[1]))
                {
                    data.match.commentary.push(com.hopeless[rand(com.hopeless.length)]);
                }
            }
            data.match.commentary.push('Penalties: ' + data.team[0]._id + ': ' + (Goals[0] - aggregate) + ' | ' + (Goals[1] - aggregate) + ' :' + data.team[1]._id);
            if(Goals[0] == Goals[1])
            {
                data.match.commentary.push(com.tie[rand(com.tie.length)]);
                data.team[0].goals_for += Goals[0];
                data.team[1].goals_for += Goals[0];
                data.team[0].goals_against += Goals[0];
                data.team[1].goals_agaisnt += Goals[0];
                return -1;
            }
            return +(Goals[1] > Goals[0]);
        };
        kick = rand(2);
        var temp = (data.team[0].form - data.team[1].form) / 2;
        var friendly = [];
        var against = [];
        temp = (parseFloat(mean_rating[0] * 100)/(mean_rating[0] + mean_rating[1]) + temp).toFixed(2);
        data.match.commentary.push('Winning chances: ');
        data.match.commentary.push(data.team[0]._id + ': ' + temp +' % | % ' + (100 - temp) + ' :' + data.team[1]._id);
        data.match.commentary.push('Form: ');
        data.match.commentary.push(data.team[0]._id + ': ' + form[data.team[0].form * 100 / mean_rating[0]] + ' | ' + form[data.team[1].form * 100 / mean_rating[1]] + ' :' + data.team[1]._id);
        data.match.commentary[data.match.commentary.length - 1] += data.team[kick]._id + ' shall kickoff.';
        // ------------------------<last resort> ---------------------------
        //data.match.commentary.push('Final Score: ' + data.team[0]._id + ' ' + team_object[0].average_strike_rating * (team_object[1].def_count + team_object[1].mid_count + team_object[1].keep_count)  + ' - ' + team_object[1].average_strike_rating + ' ' + data.team[1]._id);
        // ------------------------</last resort> ---------------------------
        // <main stream>
        hold = false;
        for(i = 1 ; i < 46; ++i)
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
             else if(ball.y < 0)
            {
                ball.x = parseInt(64.5 + ((64.5 - ball.x) / (ball.y - 34.5)) * 34.5);
                ball.y = 0;
                kick = !kick;
                hold = true;
            }
            else if(ball.y > 70)
            {
                ball.x = parseInt(64.5 + (( ball.x - 64.5) / (ball.y - 34.5)) * 36.5);
                ball.y = 70;
                kick = !kick;
                hold = true;
            }
           data.match.commentary.push(i + ': ');
           if(!hold)
           {
               temp = Math.pow(Math.pow(data.team[0].ratings[1].position.x - ball.x, 2) + Math.pow(data.team[+kick].ratings[1].position.y - ball.x, 2), 0.5) * (51 - data.team[+kick].ratings[1].stamina); 
               temp  /= (500 - data.team[+kick].ratings[1].Pace - data.team[+kick].ratings[1].Overall - data.team[+kick].ratings[1].Speed - data.team[+kick].ratings[1].Positioning - data.team[+kick].ratings[1].Physical);
               for(y = 0; y < 2; ++y)
               {
                   for(j = 1; j < 11; ++j)
                   {
                       k = Math.pow(Math.pow(data.team[y].ratings[j].position.x - ball.x, 2) + Math.pow(data.team[y].ratings[1].position.y - ball.x, 2), 0.5) * (51 - data.team[y].ratings[1].stamina);
                       k  /= (500 - data.team[y].ratings[j].Pace - data.team[y].ratings[1].Overall - data.team[y].ratings[1].Speed - data.team[y].ratings[1].Positioning - data.team[y].ratings[1].Physical);
                       if(k < temp)
                       {
                           temp = k;
                           x = j;
                           kick = y;
                       }
                   }
               }
               hold = true;
               ball.x = data.team[kick].ratings[x].position.x;
               ball.y = data.team[kick].ratings[x].position.y;
           }
            for (j = 1; j < 12; ++j)
            {
                    if(((ball.x * Math.pow(-1, +kick)) > (data.team[+kick].ratings[j].position.x * Math.pow(-1, +kick))) && ((data.team[+kick].ratings[j].position.x * Math.pow(-1, +kick)) > (+kick * 118 + 5.5)*(Math.pow(-1, +kick))))
                    {
                        friendly.push(j);
                    }
                    if(((ball.x * Math.pow(-1, +!kick)) > (data.team[+!kick].ratings[j].position.x * Math.pow(-1, +!kick))) && ((data.team[+!kick].ratings[j].position.x * Math.pow(-1, +!kick)) > (+!kick * 118 + 5.5)*(Math.pow(-1, +!kick))))
                    {
                        against.push(j);
                    }
            }
           temp = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
           k = 0;
           for(x in data.team[+kick].ratings[j])
           {
               for(j in friendly)
               {
                    temp[0][k] += 1 / data.team[+kick].ratings[friendly[j]][x.toString()];
               }
               temp[0][k] = friendly.length / temp[0][k++];
           }
           k = 0;
            for(x in data.team[+!kick].ratings[j])
           {
               for(j in against)
               {
                    temp[1][k] += 1 / data.team[+!kick].ratings[against[j]][x.toString()];
               }
               temp[1][k] = against.length / temp[1][k++];
           }
           for(k = 0;k < 2; ++k)
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

           x = (Math.pow(-1, rand(2)) + (temp[0][1] - temp[1][0]) / 10) * temp[0][0] + temp[0][1];
           y = (Math.pow(-1, rand(2)) + (temp[1][1] - temp[0][0]) / 10) * temp[1][0] + temp[1][1];
           goal = x - y;
           temp = +(goal < 0);
           pos = Math.abs((temp) ? (1 / goal) : (1 - 1 / goal));
           goal = Math.abs(goal);
           if(!goal)
           {
               data.match.commentary.push(com.general[rand(com.general.length)]);
           }
           else if(goal > 0 && goal <= 1) // missed pass
           {
                data.match.commentary.push(com.miss[rand(com.miss.length)]);
           }
           else if(goal > 1 && goal <= 2) // pass
           {
               hold = true;
               ++passes[+kick];
               data.match.commentary.push(com.pass[rand(com.pass.length)]);
           }
           else if(goal > 2 && goal <= 3 ) // intercept
           {
               hold = true;
               data.match.commentary.push(com.intercept[rand(com.intercept.length)]);
               kick = !kick;
           }
           else if(goal > 3 && goal <= 4 ) // tackle
           {
               //kick = !kick;
               data.match.commentary.push(com.tackle[rand(com.tackle.length)]);
           }
           else if(goal > 4 && goal <= 5 ) // foul
           {
               hold = false;
               ++fouls[+!kick];
               data.match.commentary.push(com.foul[rand(com.foul.length)]);
           }
           else if(goal > 5 && goal <= 6 ) // offside
           {
               hold = false;
               data.match.commentary.push(com.offside[rand(com.offside.length)]);
           }
           else // goal opportunity
           {
               flag = false;
               ++shots;
               temp = [0, 0, 0, 0];
               for(j = 1; j < 11; ++j)
               {
                   if(data.team[k].ratings[i].Type == 'strike')
                   {
                       if(flag)
                       {
                           temp =
                               [
                                   +(data.team[k].ratings[i].Overall > data.team[k].ratings[strike].Overall),
                                   +(data.team[k].ratings[i].Pace > data.team[k].ratings[strike].Pace),
                                   +(data.team[k].ratings[i].Shot > data.team[k].ratings[strike].Shot),
                                   +(data.team[k].ratings[i].Positioning > data.team[k].ratings[strike].Positioning)
                               ];
                           if(temp[0] + temp[1] + temp[2] + temp[3] > 2)
                           {
                               temp = [0, 0, 0, 0];
                               strike = j;
                           }
                       }
                       else
                       {
                           strike = j;
                           flag = true;
                       }
                   }
               }
               strike_performance_index = ((Math.pow(-1, (rand(2))) + (data.team[+kick].ratings[strike].Overall - data.team[+!kick].ratings[0].Overall) / 10) * (rand(Math.pow((data.team[+kick].ratings[strike].Shot * data.team[+kick].ratings[strike].Pace)), 0.5)) + (data.team[+kick].ratings[strike].Pace + data.team[+kick].ratings[strike].Shot) / 2);
               keeper_performance_index = ((Math.pow(-1, (rand(2))) + (data.team[+!kick].ratings[0].Overall - data.team[+kick].ratings[strike].Overall) / 10) * (rand(Math.pow((data.team[+!kick].ratings[strike].Reflexes) * data.team[+!kick].ratings[strike].Positioning * data.team[+!kick].ratings[strike].Speed), 1/3)) + (data.team[+!kick].ratings[strike].Positioning + data.team[+!kick].ratings[strike].Reflexes + data.team[+!kick].ratings[strike].Speed) / 3);
               if(strike_performance_index > keeper_performance_index)
               {
                   data.match.commentary.push(com.goal[rand(com.goal.length)]);
                   ++Goals[kick];
                    kick = !kick;
               }
               else
               {
                   data.match.commentary.push(com.miss[rand(com.miss.length)]);
               }
               hold = false;
               ball =
               {
                   x : 64.5,
                   y : 34.5
               };
           }
            friendly = against = [];
            data.match.commentary.push('Possession: ');
            data.match.commentary.push(data.team[0]._id + ': ' + pos * 100 + ' % | % ' + (1 - pos) * 100 + ' :' + data.team[1]._id);
            last_five_pos.unshift(pos);
            if(i > 3)
            {
                temp = last_five_pos[0] + last_five_pos[1] + last_five_pos[2] + last_five_pos[3] + last_five_pos[4];
                data.match.commentary.push(' Possession during the last 5 minutes: ' + data.team[0]._id + ': ' + temp * 100 + '% - ' + (5 - temp) + ' :' + data.team[1]._id);
                last_five_pos.pop();
            }
            possession[0] = (possession[0] * (i - 1) + pos) / i;
            possession[1] = (possession[1] * (i - 1) + (1 - pos)) / i;
            data.match.commentary.push('Overall possession: ');
            data.match.commentary.push(data.team[0]._id + ': ' + possession[0] + '% | % ' + possession[1] + ' :' + data.team[1]._id);
            if(possession[0] != possession[1])
            {
                dom += +(possession[0] > possession[1]);
            }
            else
            {
                last_five_dom.unshift(+(possession[0] > possession[1]));
            }
            if(i > 3)
            {
                temp = last_five_dom[0] + last_five_dom[1] + last_five_dom[2] + last_five_dom[3] + last_five_dom[4];
                data.match.commentary.push(' Dominance during the last 5 minutes: ' + data.team[0]._id + ': ' + temp * 20 + '% - ' + (5 - temp) * 20 + ' :' + data.team[1]._id);
                last_five_dom.pop();
            }
            data.match.commentary.push('Dominance: ');
            temp = (dom * 100 / i).toFixed(2);
            data.match.commentary.push(data.team[0]._id + ': ' + temp + ' % | % ' + (100 - temp) + ' :' + data.team[1]._id);
        }
        data.match.commentary.push(com.half[rand(com.half.length)]);
        for(i = 0; i < 2; ++i)
        {
            for(j = 0; j < 12; ++j)
            {
                data.team[i].ratings[j].stamina += (50 - data.team[i].ratings[j].stamina) / (5 - (data.team[i].ratings[j].stamina / (100 - data.team[i].ratings[j].Overall)));
            }
        }
        for(i = 46;i < 91; ++i)
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
            else if(ball.y < 0)
            {
                ball.x = parseInt(64.5 + ((64.5 - ball.x) / (ball.y - 34.5)) * 34.5);
                ball.y = 0;
                kick = !kick;
                hold = true;
            }
            else if(ball.y > 70)
            {
                ball.x = parseInt(64.5 + (( ball.x - 64.5) / (ball.y - 34.5)) * 36.5);
                ball.y = 70;
                kick = !kick;
                hold = true;
            }
            data.match.commentary.push(i + ': ');
            if(!hold)
            {
                temp = Math.pow(Math.pow(data.team[0].ratings[1].position.x - ball.x, 2) + Math.pow(data.team[+kick].ratings[1].position.y - ball.x, 2), 0.5) * (51 - data.team[+kick].ratings[1].stamina);
                temp  /= (500 - data.team[+kick].ratings[1].Pace - data.team[+kick].ratings[1].Overall - data.team[+kick].ratings[1].Speed - data.team[+kick].ratings[1].Positioning - data.team[+kick].ratings[1].Physical);
                for(y = 0; y < 2; ++y)
                {
                    for(j = 1; j < 11; ++j)
                    {
                        k = Math.pow(Math.pow(data.team[y].ratings[j].position.x - ball.x, 2) + Math.pow(data.team[y].ratings[1].position.y - ball.x, 2), 0.5) * (51 - data.team[y].ratings[1].stamina);
                        k  /= (500 - data.team[y].ratings[j].Pace - data.team[y].ratings[1].Overall - data.team[y].ratings[1].Speed - data.team[y].ratings[1].Positioning - data.team[y].ratings[1].Physical);
                        if(k < temp)
                        {
                            temp = k;
                            x = j;
                            kick = y;
                        }
                    }
                }
                hold = true;
                ball.x = data.team[kick].ratings[x].position.x;
                ball.y = data.team[kick].ratings[x].position.y;
            }
            for (j = 1; j < 12; ++j)
            {
                if(((ball.x * Math.pow(-1, +kick)) > (data.team[+kick].ratings[j].position.x * Math.pow(-1, +kick))) && ((data.team[+kick].ratings[j].position.x * Math.pow(-1, +kick)) > (+kick * 118 + 5.5)*(Math.pow(-1, +kick))))
                {
                    friendly.push(j);
                }
                if(((ball.x * Math.pow(-1, +!kick)) > (data.team[+!kick].ratings[j].position.x * Math.pow(-1, +!kick))) && ((data.team[+!kick].ratings[j].position.x * Math.pow(-1, +!kick)) > (+!kick * 118 + 5.5)*(Math.pow(-1, +!kick))))
                {
                    against.push(j);
                }
            }
            temp = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
            k = 0;
            for(x in data.team[+kick].ratings[j])
            {
                for(j in friendly)
                {
                    temp[0][k] += 1 / data.team[+kick].ratings[friendly[j]][x.toString()];
                }
                temp[0][k] = friendly.length / temp[0][k++];
            }
            k = 0;
            for(x in data.team[+!kick].ratings[j])
            {
                for(j in against)
                {
                    temp[1][k] += 1 / data.team[+!kick].ratings[against[j]][x.toString()];
                }
                temp[1][k] = against.length / temp[1][k++];
            }
            for(k = 0;k < 2; ++k)
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

            x = (Math.pow(-1, rand(2)) + (temp[0][1] - temp[1][0]) / 10) * temp[0][0] + temp[0][1];
            y = (Math.pow(-1, rand(2)) + (temp[1][1] - temp[0][0]) / 10) * temp[1][0] + temp[1][1];
            goal = x - y;
            temp = +(goal < 0);
            pos = Math.abs((temp) ? (1 / goal) : (1 - 1 / goal));
            goal = Math.abs(goal);
            if(!goal)
            {
                data.match.commentary.push(com.general[rand(com.general.length)]);
            }
            else if(goal > 0 && goal <= 1) // missed pass
            {
                data.match.commentary.push(com.miss[rand(com.miss.length)]);
            }
            else if(goal > 1 && goal <= 2) // pass
            {
                hold = true;
                ++passes[kick];
                data.match.commentary.push(com.pass[rand(com.pass.length)]);
            }
            else if(goal > 2 && goal <= 3 ) // intercept
            {
                hold = true;
                data.match.commentary.push(com.intercept[rand(com.intercept.length)]);
                kick = !kick;
            }
            else if(goal > 3 && goal <= 4 ) // tackle
            {
                //kick = !kick;
                data.match.commentary.push(com.tackle[rand(com.tackle.length)]);
            }
            else if(goal > 4 && goal <= 5 ) // foul
            {
                hold = false;
                ++fouls[kick];
                data.match.commentary.push(com.foul[rand(com.foul.length)]);
            }
            else if(goal > 5 && goal <= 6 ) // offside
            {
                hold = false;
                data.match.commentary.push(com.offside[rand(com.offside.length)]);
            }
            else // goal opportunity
            {
                flag = false;
                ++shots;
                temp = [0, 0, 0, 0];
                for(j = 1; j < 11; ++j)
                {
                    if(data.team[k].ratings[i].Type == 'strike')
                    {
                        if(flag)
                        {
                            temp =
                                [
                                    +(data.team[k].ratings[i].Overall > data.team[k].ratings[strike].Overall),
                                    +(data.team[k].ratings[i].Pace > data.team[k].ratings[strike].Pace),
                                    +(data.team[k].ratings[i].Shot > data.team[k].ratings[strike].Shot),
                                    +(data.team[k].ratings[i].Positioning > data.team[k].ratings[strike].Positioning)
                                ];
                            if(temp[0] + temp[1] + temp[2] + temp[3] > 2)
                            {
                                temp = [0, 0, 0, 0];
                                strike = j;
                            }
                        }
                        else
                        {
                            strike = j;
                            flag = true;
                        }
                    }
                }
                strike_performance_index = ((Math.pow(-1, (rand(2))) + (data.team[+kick].ratings[strike].Overall - data.team[+!kick].ratings[0].Overall) / 10) * (rand(Math.pow((data.team[+kick].ratings[strike].Shot * data.team[+kick].ratings[strike].Pace)), 0.5)) + (data.team[+kick].ratings[strike].Pace + data.team[+kick].ratings[strike].Shot) / 2);
                keeper_performance_index = ((Math.pow(-1, (rand(2))) + (data.team[+!kick].ratings[0].Overall - data.team[+kick].ratings[strike].Overall) / 10) * (rand(Math.pow((data.team[+!kick].ratings[strike].Reflexes) * data.team[+!kick].ratings[strike].Positioning * data.team[+!kick].ratings[strike].Speed), 1/3)) + (data.team[+!kick].ratings[strike].Positioning + data.team[+!kick].ratings[strike].Reflexes + data.team[+!kick].ratings[strike].Speed) / 3);
                if(strike_performance_index > keeper_performance_index)
                {
                    data.match.commentary.push(com.goal[rand(com.goal.length)]);
                    ++Goals[kick];
                    kick = !kick;
                }
                else
                {
                    data.match.commentary.push(com.miss[rand(com.miss.length)]);
                }
                hold = false;
                ball =
                {
                    x : 64.5,
                    y : 34.5
                };
            }
            friendly = against = [];
            data.match.commentary.push('Possession: ');
            data.match.commentary.push(data.team[0]._id + ': ' + pos * 100 + ' % | % ' + (1 - pos) * 100 + ' :' + data.team[1]._id);
            last_five_pos.unshift(pos);
            if(i > 3)
            {
                temp = last_five_pos[0] + last_five_pos[1] + last_five_pos[2] + last_five_pos[3] + last_five_pos[4];
                data.match.commentary.push(' Possession during the last 5 minutes: ' + data.team[0]._id + ': ' + temp * 100 + '% - ' + (5 - temp) + ' :' + data.team[1]._id);
                last_five_pos.pop();
            }
            possession[0] = (possession[0] * (i - 1) + pos) / i;
            possession[1] = (possession[1] * (i - 1) + (1 - pos)) / i;
            data.match.commentary.push('Overall possession: ');
            data.match.commentary.push(data.team[0]._id + ': ' + possession[0] + '% | % ' + possession[1] + ' :' + data.team[1]._id);
            if(possession[0] != possession[1])
            {
                dom += +(possession[0] > possession[1]);
            }
            else
            {
                last_five_dom.unshift(+(possession[0] > possession[1]));
            }
            if(i > 3)
            {
                temp = last_five_dom[0] + last_five_dom[1] + last_five_dom[2] + last_five_dom[3] + last_five_dom[4];
                data.match.commentary.push(' Dominance during the last 5 minutes: ' + data.team[0]._id + ': ' + temp * 20 + '% - ' + (5 - temp) * 20 + ' :' + data.team[1]._id);
                last_five_dom.pop();
            }
            data.match.commentary.push('Dominance: ');
            temp = (dom * 100 / i).toFixed(2);
            data.match.commentary.push(data.team[0]._id + ': ' + temp + ' % | % ' + (100 - temp) + ' :' + data.team[1]._id);
        }
        if(Goals[0] == Goals[1])
        {
            data.match.commentary.push(com.shootout[rand(com.shootout.length)]);
            winner = penalty_shootout();
        }
        data.match.commentary.push(com.end[rand(com.end.length)]);
        data.match.commentary.push('Final score: ' + data.team[0]._id + ': ' + Goals[0] + ' | ' + Goals[1] + ' :' + data.team[1]._id);
    //  </main stream>
        if (parseInt(winner) != -1)
        {
            data.match.commentary.push(data.team[+winner]._id + ' wins against ' + data.team[+!winner]._id);
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
    if(!Goals[0])
    {
        Goals[0] = 1;
    }
    if(!Goals[1])
    {
        Goals[1] = 1;
    }
    ++data.team[0].played;
    ++data.team[1].played;
    data.team[0].shots += shots[0];
    data.team[1].shots += shots[1];
    data.team[0].fouls += fouls[0];
    data.team[1].fouls += fouls[1];
    data.team[0].ratio = data.team[0].win / data.team[0].loss;
    data.team[1].ratio = data.team[1].win / data.team[1].loss;
    data.team[0].accuracy = data.team[0].goals_for / data.team[0].shots;
    data.team[1].accuracy = data.team[1].goals_for / data.team[1].shots;
    data.team[0].mean_goals_for = data.team[0].goals_for / data.team[0].played;
    data.team[1].mean_goals_for = data.team[1].goals_for / data.team[1].played;
    data.team[0].mean_goals_against = data.team[0].goals_against / data.team[0].played;
    data.team[1].mean_goals_against = data.team[1].goals_against / data.team[1].played;
    data.team[0].form += possession[0] * mean_rating[1] / Goals[1] - possession[1] * mean_rating[0] / Goals[0];
    data.team[1].form += possession[1] * mean_rating[0] / Goals[0] - possession[0] * mean_rating[1] / Goals[1];
    data.team[0].morale += Math.pow(-1, +winner) * Goals[0] * mean_rating[1] / (Goals[1] * mean_rating[0]) * dom;
    data.team[1].morale -= Math.pow(-1, +winner) * Goals[1] * mean_rating[0] / (Goals[0] * mean_rating[1]) * (90 - dom);
    data.team[0].possession = (data.team[0].played - 1) * data.team[0].possession + possession[0] / data.team[0].played;
    data.team[1].possession = (data.team[1].played - 1) * data.team[1].possession + possession[1] / data.team[1].played;
    data.team[0].dominance += (data.team[0].dominance * (data.team[0].played - 1) + dom / 90) / data.team[0].played;
    data.team[1].dominance += (data.team[1].dominance * (data.team[1].played - 1) + (1 - dom / 90)) / data.team[1].played;
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
