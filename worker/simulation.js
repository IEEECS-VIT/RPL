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
        function rand()
        {
            return parseInt(Math.random() * 1000000000000000);
        }
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
        var temp;
        var toss;
        var individual_goals = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        var passes = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        var fouls = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        var winner_index = -1;
        var possession = [0,0];
        var shots = [];
        data.match.commentary = [];
        data.match.commentary.push('Winning chances: ' + data.team[0]._id + (parseFloat((team_object[0].mean_rating * 100))/( team_object[0].mean_rating + team_object[1].mean_rating)).toFixed(2) +' %, ' + data.team[0]._id + ((parseFloat((team_object[1].mean_rating * 100))/( team_object[0].mean_rating + team_object[1].mean_rating)).toFixed(2)) +'%');
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
        data.match.commentary.push('Final Score: ' + data.team[0]._id + ' ' + team_object[0].average_strike_rating * (team_object[1].def_count + team_object[1].mid_count + team_object[1].keep_count)  + ' - ' + team_object[1].average_strike_rating + ' ' + data.team[1]._id);

        // ------------------------last resort ---------------------------

        // <main stream>

        for(i=0;i<45;++i)
        {
           // do first half stuff here
           data.match.commentary.push((i+1) + ':\n');
        }

        for(i=45;i<=90;++i)
        {
            // do second half stuff here
            data.match.commentary.push(i + ':\n');
        }
        data.match.push(com.end[rand()%com.end.length]);
        //  </main stream>
        /*
        var delivery_score;
        var batsman_performance_index;
        var current_bowler;
        var bowler_performance_index;
        var previous_bowler;
        var toss;
        var i;
        var j;
        var strike_index;
        var continuous_maximums;
        var fall_of_wicket;
        var winner_index = -1;
        var dismissed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var five_wicket_haul = [0, 0, 0, 0, 0, 0];
        var free_hit = 0;
        var previous_partnership_index = -1;
        var current_partnership_index = 0;
        var partnership_balls = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var partnership_runs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var continuous_wickets = [0, 0, 0, 0, 0, 0];
        var milestone = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var previous_dismissal = -1;
        var extras = 0;
        var maidens = [0, 0, 0, 0, 0, 0];
        var previous_batsman = -1;
        var score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var balls = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var fours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var maximums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var strike = [0, 1];
        var deliveries = [0, 0, 0, 0, 0, 0];
        var runs_conceded = [0, 0, 0, 0, 0, 0];
        var wickets_taken = [0, 0, 0, 0, 0, 0];
        var Total = [0, 0];
        var previous_over = 0;
        var wickets = [0, 0];
        var Overs = [0, 0];
        var defenders = [1200, 1200, 1200]; // increase to strengthen bowling
        var midfielders = [1100, 1100];    // decrease to strengthen batting
        var dot;
        wickets[0] = wickets[1] = strike_index = previous_bowler = 0;
        for (i = 1; i < 6; ++i)
        {
            if (team_object[+toss].bowler_rating[i] > team_object[+toss].bowler_rating[previous_bowler])
            {
                previous_bowler = i;
            }
        }
        current_bowler = previous_bowler;
        data.match.commentary.push(team_object[+toss].bowl_name[previous_bowler] + ' to start proceedings from the pavillion end.....  ');
        dot = 0;
        for (i = 0; i < 20 && wickets[0] < 10; ++i)
        {
            previous_over = continuous_maximums = 0;
            if (deliveries[current_bowler] == 18)
            {
                data.match.commentary.push('So the captain has chosen to defenders ' + team_object[+toss].bowl_name[current_bowler] + ' out. ');
            }
            if ((score[strike[+strike_index]] >= 44 && score[strike[+strike_index]] < 50))
            {
                data.match.commentary.push(team_object[+!toss].bat_name[strike[+strike_index]] + ' one hit away from a well deserving fifty. Will he make it ?  ');
            }
            else if ((score[strike[+strike_index]] >= 94 && score[strike[+strike_index]] < 100))
            {
                data.match.commentary.push(team_object[+!toss].bat_name[strike[+strike_index]] + ' knows there is a hundred for the taking if he can knuckle this one down....  ');
            }
            for (j = 1; j <= 6; ++j)
            {
                delivery_score = team_object[+!toss].bat_rating[strike[+strike_index]] - team_object[+toss].bowler_rating[current_bowler];
                bowler_performance_index = (team_object[+toss].bowler_rating[current_bowler]) / ((rand() % (team_object[+toss].bowl_average[strike[+strike_index]] * team_object[+toss].bowler_rating[current_bowler] / defenders[0] + 1) + team_object[+toss].bowl_average[current_bowler] * team_object[+toss].bowler_rating[current_bowler] / 1000) * (rand() % (team_object[+toss].bowl_strike_rate[current_bowler] * team_object[+toss].bowler_rating[current_bowler] / defenders[1] + 1) + team_object[+toss].bowl_strike_rate[current_bowler] * team_object[+toss].bowler_rating[current_bowler] / 1000) * (rand() % (team_object[+toss].economy[current_bowler] * team_object[+toss].bowler_rating[current_bowler] / defenders[2] + 1) + team_object[+toss].economy[current_bowler] * team_object[+toss].bowler_rating[current_bowler] / 1000));
                batsman_performance_index = (rand() % (team_object[+!toss].bat_average[strike[+strike_index]] * team_object[+!toss].bat_rating[strike[+strike_index]] / midfielders[0] + 1) + team_object[+!toss].bat_average[strike[+strike_index]] * (1000 - team_object[+!toss].bat_rating[strike[+strike_index]]) / 1000) * (rand() % (team_object[+!toss].bat_strike_rate[strike[+strike_index]] * team_object[+!toss].bat_rating[strike[+strike_index]] / midfielders[1] + 1) + team_object[+!toss].bat_strike_rate[strike[+strike_index]] * (1000 - team_object[+!toss].bat_rating[strike[+strike_index]]) / 1000) / team_object[+toss].bowler_rating[current_bowler];
                if (!delivery_score) delivery_score = 1;
                delivery_score += 1;
                if (batsman_performance_index > bowler_performance_index)
                {
                    batsman_performance_index += (rand() % delivery_score) / 100;
                }
                else
                {
                    batsman_performance_index -= (rand() % delivery_score) / 100;
                }
                ++balls[strike[+strike_index]];
                ++deliveries[current_bowler];
                ++partnership_balls[current_partnership_index];
                if (free_hit)
                {
                    data.match.commentary.push(' Free Hit: ');
                }//console.log(" Free Hit: ");
                else
                {
                    data.match.commentary.push(i + '.' + j + ' ' + team_object[+toss].bowl_name[current_bowler] + ' to ' + team_object[+!toss].bat_name[strike[+strike_index]] + ', ');
                }
                if (batsman_performance_index <= 0 && !free_hit)
                {
                    previous_batsman = strike[+strike_index];
                    dismissed[strike[+strike_index]] = 1;
                    data.match.commentary.push('OUT ');//console.log("OUT ");
                    previous_dismissal = current_bowler;
                    ++continuous_wickets[current_bowler];
                    previous_partnership_index = current_partnership_index;
                    ++wickets_taken[current_bowler];
                    if (batsman_performance_index <= 0 && batsman_performance_index > -0.5)
                    {
                        data.match.commentary.push(com.caught[rand() % com.caught.length]);
                    }
                    else if (batsman_performance_index <= -0.5 && batsman_performance_index > -1)
                    {
                        data.match.commentary.push(com.bowled[rand() % com.bowled.length]);
                    }
                    else if (batsman_performance_index <= -1 && batsman_performance_index > -1.5)
                    {
                        data.match.commentary.push(com.lbw[rand() % com.lbw.length]);
                    }
                    else if (batsman_performance_index <= -1.5 && batsman_performance_index > -2)
                    {
                        data.match.commentary.push(com.stumped[rand() % com.stumped.length]);
                    }
                    else
                    {
                        delivery_score = rand() % 3;
                        if (delivery_score)
                        {
                            data.match.commentary.push('  ' + delivery_score + ' run(s), ');
                            partnership_runs[current_partnership_index] += delivery_score;
                            score[strike[+strike_index]] += delivery_score;
                            previous_over += delivery_score;
                            Total[0] += delivery_score;

                        }
                        if (rand() % 2)
                        {
                            strike_index = !strike_index;
                        }
                        data.match.commentary.push(com.runout[rand() % com.runout.length]);
                        previous_dismissal = -1;
                        continuous_wickets[current_bowler] = 0;
                        --wickets_taken[current_bowler];
                    }
                    if (balls[strike[+strike_index]] == 1)data.match.commentary[data.match.commentary.length - 1] += ' first ball ';
                    if (!score[strike[+strike_index]])data.match.commentary[data.match.commentary.length - 1] += ' for a duck ! ';
                    if (wickets_taken[current_bowler] == 5 && !five_wicket_haul[current_bowler])
                    {
                        five_wicket_haul[current_bowler] = 1;
                        data.match.commentary.push(', that brings up his five wicket haul, yet another tick in a list of accomplishments.');
                    }
                    if (score[strike[+strike_index]] >= 45 && score[strike[+strike_index]] < 50)
                    {
                        data.match.commentary.push(' looks like there won\'t be any fifty for ' + team_object[+!toss].bat_name[strike[+strike_index]] + ', he came so close, and was yet so far. ');
                    }
                    else if (score[strike[+strike_index]] >= 90 && score[strike[+strike_index]] < 100) data.match.commentary.push(' He\'ll be gutted, no doubt. But it was a fantastic innings nevertheless. He has definitely done a job for his team. ');//console.log(" He'll be gutted, no doubt. But it was a fantastic innings nevertheless. He has definitely done a job for his team. ");
                    if (continuous_wickets[current_bowler] == 3)
                    {
                        data.match.commentary.push(' And that is also a hattrick for bowler ' + team_object[+!toss].bowl_name[current_bowler] + '! Fantastic bowling in the time of need.');
                        continuous_wickets[current_bowler] = 0;
                    }
                    data.match.commentary.push('  ' + team_object[+!toss].bat_name[strike[+strike_index]]);
                    if (previous_dismissal > -1)
                    {
                        data.match.commentary.push(', ' + team_object[+toss].bowl_name[current_bowler]);
                    }
                    else
                    {
                        data.match.commentary[data.match.commentary.length - 1] += ' runout';
                    }
                    data.match.commentary[data.match.commentary.length - 1] += ' ' + score[strike[+strike_index]] + ' (' + balls[strike[+strike_index]] + ' balls' + ' ' + fours[strike[+strike_index]] + 'X4\'s ' + maximums[strike[+strike_index]] + 'X6\'s) SR: ' + (score[strike[+strike_index]] * 100 / balls[strike[+strike_index]]).toFixed(2) + ' Partnership: ' + partnership_runs[current_partnership_index] + '(' + partnership_balls[current_partnership_index] + ')' + ', Runrate: ' + (partnership_runs[current_partnership_index] * 6 / partnership_balls[current_partnership_index]).toFixed(2);
                    ++current_partnership_index;
                    strike[+strike_index] = (strike[+strike_index] > strike[+!strike_index] ? strike[+strike_index] : strike[+!strike_index]) + 1;
                    if (batsman_performance_index <= -0 && batsman_performance_index >= -0.5 && rand() % 2)
                    {
                        strike_index = !strike_index;
                        data.match.commentary.push(' The two batsmen crossed over while the catch was being taken.');
                    }
                    if (wickets[0]++ == 9)
                    {
                        Overs[0] = 6 * i + j;
                        data.match.commentary.push(' And that wraps up the innings. ');
                        break;
                    }
                    batsman_performance_index = i;
                    if (j == 6)
                    {
                        temp = 0;
                        ++batsman_performance_index;
                    }
                    fall_of_wicket = Total[0] + ' / ' + wickets[0] + ', ' + batsman_performance_index + '.' + temp;
                }
                else
                {
                    delivery_score = parseInt(batsman_performance_index);
                    if (delivery_score < 0) delivery_score = 0;
                    continuous_wickets[current_bowler] = 0;
                    if (delivery_score > 6)
                    {
                        if (rand() % 2)
                        {
                            data.match.commentary.push(' wide, ' + com.wide[rand() % com.wide.length]);
                        }
                        else
                        {
                            data.match.commentary.push(com.freehit[rand() % com.freehit.length]);
                            free_hit = 1;
                        }
                        --j;
                        ++extras;
                        --partnership_balls[current_partnership_index];
                        ++partnership_runs[current_partnership_index];
                        --balls[strike[+strike_index]];
                        --deliveries[current_bowler];
                        ++Total[0];
                        delivery_score = 0;
                    }
                    else
                    {
                        if (free_hit) free_hit = 0;
                        switch (delivery_score)
                        {
                            case 0:
                                data.match.commentary.push('No run, ' + com.dot[rand() % com.dot.length]);

                                ++dot;
                                break;
                            case 5:
                                delivery_score -= 1;
                            case 4:
                                data.match.commentary.push('FOUR, ' + com.four[rand() % com.four.length]);

                                ++fours[strike[+strike_index]];
                                break;
                            case 6:
                                data.match.commentary.push('SIX, ' + com.six[rand() % com.six.length]);
                                ++maximums[strike[+strike_index]];
                                ++continuous_maximums;
                                break;
                            case 1:
                                data.match.commentary.push('1 run, ' + com.one[rand() % com.one.length]);
                                break;
                            case 2:
                                data.match.commentary.push('2 runs, ' + com.two[rand() % com.two.length]);
                                break;
                            case 3:
                                data.match.commentary.push('3 runs, ' + com.three[rand() % com.three.length]);
                                break;
                            default:
                                break;
                        }
                        if (delivery_score != 6) continuous_maximums = 0;
                        previous_over += delivery_score;
                        score[strike[+strike_index]] += delivery_score;
                        Total[0] += delivery_score;
                        partnership_runs[current_partnership_index] += delivery_score;

                    }
                    if (!milestone[strike[+strike_index]] && score[strike[+strike_index]] >= 50)
                    {
                        ++milestone[strike[+strike_index]];
                        data.match.commentary.push(' And that brings up his half century - a well timed innings indeed.');
                    }
                    else if (milestone[strike[+strike_index]] == 1 && score[strike[+strike_index]] >= 100)
                    {
                        ++milestone[strike[+strike_index]];
                        data.match.commentary.push(' What a wonderful way to bring up his century.');
                    }
                    if (delivery_score % 2) strike_index = !strike_index;
                }
            }
            if (continuous_maximums == 6) data.match.commentary.push(' Six G.P.L maximums in the previous over ! What an effort by ' + team_object[+!toss].bat_name[strike[+strike_index]] + '. The crowd is ecstatic, ' + team_object[+toss].bowl_name[current_bowler] + ' is absolutely flabbergasted. ');//console.log(" Six G.P.L maximums in the previous over ! What an effort by Batsman.", strike[+strike_index], ". The crowd is ecstatic, Bowler ", current_bowler, " is absolutely flabbergasted. ");
            runs_conceded[current_bowler] += previous_over;
            strike_index = !strike_index;
            data.match.commentary.push(' Last over: ');
            if (previous_over)
            {
                data.match.commentary[data.match.commentary.length - 1] += previous_over + ' run(s)';
            }
            else
            {
                if (j == 7)data.match.commentary[data.match.commentary.length - 1] = ' maiden';
                maidens[current_bowler] += 1;
            }
            data.match.commentary.push('  Current score: ' + Total[0] + ' / ' + wickets[0] + '  Runrate: ' + (Total[0] / (i + 1)).toFixed(2));
            if (strike[+strike_index] < 11) data.match.commentary.push(' ' + team_object[+!toss].bat_name[strike[+strike_index]] + ' : ' + score[strike[+strike_index]] + ' (' + balls[strike[+strike_index]] + ') ');
            if (strike[+!strike_index] < 11) data.match.commentary.push(' ' + team_object[+!toss].bat_name[strike[+!strike_index]] + ' : ' + score[strike[+!strike_index]] + ' (' + balls[strike[+!strike_index]] + ') Partnership: ' + partnership_runs[current_partnership_index] + '(' + partnership_balls[current_partnership_index] + ') runrate: ' + (partnership_runs[current_partnership_index] * 6 / partnership_balls[current_partnership_index])).toFixed(2);
            if (previous_batsman > -1)
            {
                data.match.commentary.push(' Previous Wicket: ' + team_object[+!toss].bat_name[previous_batsman] + ': ' + score[previous_batsman] + '(' + balls[previous_batsman] + ')');
                if (previous_dismissal > -1)
                {
                    data.match.commentary.push(', Dismissed by: ' + team_object[+toss].bowl_name[previous_dismissal]);
                }
                else
                {
                    data.match.commentary[data.match.commentary.length - 1] += '(runout)';
                }
                data.match.commentary.push(' Partnership: ' + partnership_runs[previous_partnership_index] + '(' + partnership_balls[previous_partnership_index] + '), runrate: ' + (partnership_runs[previous_partnership_index] * 6 / partnership_balls[previous_partnership_index]).toFixed(2) + ' Fall of wicket: ' + fall_of_wicket);
            }
            data.match.commentary.push('  ' + team_object[+toss].bowl_name[current_bowler] + ': ' + deliveries[current_bowler] / 6 + '.' + deliveries[current_bowler] % 6 + '-' + maidens[current_bowler] + '-' + wickets_taken[current_bowler] + '-' + (runs_conceded[current_bowler] * 6 / deliveries[current_bowler]).toFixed(2) + '  ');
            if (deliveries[current_bowler] == 24) data.match.commentary.push('And that brings an end to Bowler ' + team_object[+toss].bowl_name[current_bowler] + '\'s spell.  ');
            for (j = 0; j < 6; ++j)
            {
                if (deliveries[j] <= 18 && j != previous_bowler)
                {
                    delivery_score = j;
                    break;
                }
            }
            current_bowler = delivery_score;
            for (j = delivery_score + 1; j < 6; ++j)
            {
                if (deliveries[j] <= 18 && team_object[+!toss].bowler_rating[j] > team_object[+!toss].bowler_rating[current_bowler] && j != previous_bowler) current_bowler = j;
            }
            previous_bowler = current_bowler;
        }
        strike = [0, 1];
        data.match.commentary.push(' Scorecard: ');
        data.match.commentary.push('Runs Balls Strike Rate Fours Sixes');
        for (i = 0; i < 11; ++i)
        {
            if (!balls[i])
            {
                data.match.commentary.push(team_object[+!toss].bat_name[i] + '  DNB ');
            }
            else
            {
                data.match.commentary.push(team_object[+!toss].bat_name[i] + ' ' + score[i] + ' ' + balls[i] + ' ' + (score[i] * 100 / balls[i]).toFixed(2) + ' ' + fours[i] + ' ' + maximums[i]);
                if (!dismissed[i]) data.match.commentary.push('  (not out)');
            }
            if (i < 10)
            {
                partnership_runs[i] = partnership_balls[i] = 0;
            }
            balls[i] = fours[i] = maximums[i] = dismissed[i] = milestone[i] = score[i] = balls[i] = fours[i] = maximums[i] = 0;
        }
        data.match.commentary.push('Total: ' + Total[0] + ' / ' + wickets[0] + ' (' + parseInt(Overs[0] / 6) + '.' + Overs[0] % 6 + ' overs)  Runrate: ' + (Total[0] * 6 / Overs[0]).toFixed(2) + ' Extras: ' + extras);
        data.match.commentary.push(' Bowling Statistics:');
        data.match.commentary.push('  Bowler Overs Maidens Wickets Runs conceded Economy  ');
        for (i = 0; i < 6; i++)
        {
            data.match.commentary.push(team_object[+toss].bowl_name[i] + ' ' + parseInt(deliveries[i] / 6) + '.' + deliveries[i] % 6 + ' ' + maidens[i] + ' ' + wickets_taken[i] + ' ' + runs_conceded[i] + ' ' + (runs_conceded[i] * 6 / deliveries[i]).toFixed(2));
            five_wicket_haul[i] = continuous_wickets[i] = deliveries[i] = maidens[i] = runs_conceded[i] = wickets_taken[i] = 0;
        }
        data.match.commentary.push('Dot ball percentage: ' + (dot * 100 / Overs[0]).toFixed(2) + ' %');
        extras = strike_index = free_hit = current_partnership_index = dot = previous_bowler = 0;
        previous_batsman = previous_partnership_index = -1;
        data.match.commentary.push('   ');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        for (i = 1; i < 6; i++)
        {
            if (team_object[+!toss].bowler_rating[i] > team_object[+!toss].bowler_rating[previous_bowler])
            {
                previous_bowler = i;
            }
        }
        current_bowler = previous_bowler;
        data.match.commentary.push('  ' + team_object[+!toss].bowl_name[previous_bowler] + ' to start proceedings from the pavillion end.....  ');
        for (i = 0; i < 20 && (wickets[1] < 10 && Total[1] <= Total[0]); ++i)
        {
            previous_over = continuous_maximums = 0;
            if (deliveries[current_bowler] == 18)
            {
                data.match.commentary.push(' So the captain has chosen to defenders ' + team_object[+!toss].bowl_name[current_bowler] + ' out. ');
            }
            if ((score[strike[+strike_index]] >= 44 && score[strike[+strike_index]] < 50))
            {
                data.match.commentary.push('  ' + team_object[+toss].bat_name[strike[+strike_index]] + ' one hit away from a well deserving fifty. Will he make it ?  ');
            }
            else if ((score[strike[+strike_index]] >= 94 && score[strike[+strike_index]] < 100))
            {
                data.match.commentary.push('  ' + team_object[+toss].bat_name[strike[+strike_index]] + ' knows there is a hundred for the taking if he can knuckle this one down....  ');
            }
            for (j = 1; j <= 6; ++j)
            {
                delivery_score = team_object[+toss].bat_rating[strike[+strike_index]] - team_object[+!toss].bowler_rating[current_bowler];
                bowler_performance_index = (team_object[+!toss].bowler_rating[current_bowler]) / ((rand() % (team_object[+!toss].bowl_average[strike[+strike_index]] * team_object[+!toss].bowler_rating[current_bowler] / defenders[0] + 1) + team_object[+!toss].bowl_average[current_bowler] * team_object[+!toss].bowler_rating[current_bowler] / 1000) * (rand() % (team_object[+!toss].bowl_strike_rate[current_bowler] * team_object[+!toss].bowler_rating[current_bowler] / defenders[1] + 1) + team_object[+!toss].bowl_strike_rate[current_bowler] * team_object[+!toss].bowler_rating[current_bowler] / 1000) * (rand() % (team_object[+!toss].economy[current_bowler] * team_object[+!toss].bowler_rating[current_bowler] / defenders[2] + 1) + team_object[+!toss].economy[current_bowler] * team_object[+!toss].bowler_rating[current_bowler] / 1000));
                batsman_performance_index = (rand() % (team_object[+toss].bat_average[strike[+strike_index]] * team_object[+toss].bat_rating[strike[+strike_index]] / midfielders[0] + 1) + team_object[+toss].bat_average[strike[+strike_index]] * (1000 - team_object[+toss].bat_rating[strike[+strike_index]]) / 1000) * (rand() % (team_object[+toss].bat_strike_rate[strike[+strike_index]] * team_object[+toss].bat_rating[strike[+strike_index]] / midfielders[1] + 1) + team_object[+toss].bat_strike_rate[strike[+strike_index]] * (1000 - team_object[+toss].bat_rating[strike[+strike_index]]) / 1000) / team_object[+!toss].bowler_rating[current_bowler];
                if (!delivery_score) delivery_score = 1;
                delivery_score += 1;
                if (batsman_performance_index > bowler_performance_index)
                {
                    batsman_performance_index += (rand() % delivery_score) / 100;
                }
                else
                {
                    batsman_performance_index -= (rand() % delivery_score) / 100;
                }
                ++balls[strike[+strike_index]];
                ++deliveries[current_bowler];
                ++partnership_balls[current_partnership_index];
                if (free_hit)
                {
                    data.match.commentary.push(' Free Hit: ');
                }
                else
                {
                    data.match.commentary.push(i + '.' + j + ' ' + team_object[+!toss].bowl_name[current_bowler] + ' to ' + team_object[+toss].bat_name[strike[+strike_index]] + ', ');
                }
                if (batsman_performance_index <= 0 && !free_hit)
                {
                    previous_batsman = strike[+strike_index];
                    dismissed[strike[+strike_index]] = 1;
                    data.match.commentary[data.match.commentary.length - 1] += 'OUT ';
                    previous_dismissal = current_bowler;
                    ++continuous_wickets[current_bowler];
                    previous_partnership_index = current_partnership_index;
                    ++wickets_taken[current_bowler];
                    if (batsman_performance_index <= 0 && batsman_performance_index > -0.5)
                    {
                        data.match.commentary.push(com.caught[rand() % com.caught.length]);
                    }
                    else if (batsman_performance_index <= -0.5 && batsman_performance_index > -1)
                    {
                        data.match.commentary.push(com.bowled[rand() % com.bowled.length]);
                    }
                    else if (batsman_performance_index <= -1 && batsman_performance_index > -1.5)
                    {
                        data.match.commentary.push(com.lbw[rand() % com.lbw.length]);
                    }
                    else if (batsman_performance_index <= -1.5 && batsman_performance_index > -2)
                    {
                        data.match.commentary.push(com.stumped[rand() % com.stumped.length]);
                    }
                    else
                    {
                        delivery_score = rand() % 3;
                        if (delivery_score)
                        {
                            data.match.commentary.push('  ' + delivery_score + '   run(s), ');
                            partnership_runs[current_partnership_index] += delivery_score;
                            score[strike[+strike_index]] += delivery_score;
                            previous_over += delivery_score;
                            Total[1] += delivery_score;
                        }
                        if (rand() % 2)
                        {
                            strike_index = !strike_index;
                        }
                        data.match.commentary.push(com.runout[rand() % com.runout.length]);
                        previous_dismissal = -1;
                        continuous_wickets[current_bowler] = 0;
                        --wickets_taken[current_bowler];
                        if (Total[1] > Total[0])
                        {
                            data.match.commentary.push(' What an emphatic victory ! ');
                            break;
                        }
                        else if (Total[1] == Total[0]) data.match.commentary.push('Scores are level...');
                    }
                    if (balls[strike[+strike_index]] == 1)data.match.commentary[data.match.commentary.length - 1] += ' first ball ';
                    if (!score[strike[+strike_index]])data.match.commentary[data.match.commentary.length - 1] += 'for a duck !';
                    if (wickets_taken[current_bowler] == 5 && !five_wicket_haul[current_bowler])
                    {
                        five_wicket_haul[current_bowler] = 1;
                        data.match.commentary.push(', that brings up his five wicket haul, yet another tick in a list of accomplishments.');
                    }
                    if (score[strike[+strike_index]] >= 45 && score[strike[+strike_index]] < 50)
                    {
                        data.match.commentary.push(' looks like there won\'t be any fifty for ' + team_object[+toss].bat_name[strike[+strike_index]] + ', he came so close, and was yet so far. ');
                    }
                    else if (score[strike[+strike_index]] >= 90 && score[strike[+strike_index]] < 100) data.match.commentary.push(' He\'ll be gutted, no doubt. But it was a fantastic innings nevertheless. He has definitely done a job for his team. ');
                    if (continuous_wickets[current_bowler] == 3)
                    {
                        data.match.commentary.push(' And that is also a hattrick for ' + team_object[+!toss].bowl_name[current_bowler] + '! Fantastic bowling in the time of need.');
                        continuous_wickets[current_bowler] = 0;
                    }
                    data.match.commentary.push('  ' + team_object[+toss].bat_name[strike[+strike_index]]);
                    if (previous_dismissal > -1)
                    {
                        data.match.commentary[data.match.commentary.length - 1] += ', ' + team_object[+!toss].bowl_name[current_bowler];
                    }
                    else
                    {
                        data.match.commentary[data.match.commentary.length - 1] += ' runout';
                    }
                    data.match.commentary.push(' ' + score[strike[+strike_index]] + ' (' + balls[strike[+strike_index]] + ' balls' + ' ' + fours[strike[+strike_index]] + 'X4\'s ' + maximums[strike[+strike_index]] + 'X6\'s) SR: ' + (score[strike[+strike_index]] * 100 / balls[strike[+strike_index]]).toFixed(2) + ' Partnership: ' + partnership_runs[current_partnership_index] + '(' + partnership_balls[current_partnership_index] + ')' + ', Runrate: ' + (partnership_runs[current_partnership_index] * 6 / partnership_balls[current_partnership_index])).toFixed(2);
                    ++current_partnership_index;
                    strike[+strike_index] = (strike[+strike_index] > strike[+!strike_index] ? strike[+strike_index] : strike[+!strike_index]) + 1;
                    if (batsman_performance_index <= -0 && batsman_performance_index >= -0.5 && rand() % 2)
                    {
                        strike_index = !strike_index;
                        data.match.commentary.push(' The two batsmen crossed over while the catch was being taken.');
                    }
                    if (wickets[1]++ == 9)
                    {
                        Overs[1] = 6 * i + j;
                        data.match.commentary.push(' And that wraps up the innings. ');
                        break;
                    }
                    batsman_performance_index = i;
                    if (j == 6)
                    {
                        temp = 0;
                        ++batsman_performance_index;

                    }
                    fall_of_wicket = Total[1] + ' / ' + wickets[1] + ', ' + batsman_performance_index + '.' + temp;
                }
                else
                {
                    delivery_score = parseInt(batsman_performance_index);
                    if (delivery_score < 0) delivery_score = 0;
                    continuous_wickets[current_bowler] = 0;
                    if (delivery_score > 6)
                    {
                        if (rand() % 2)
                        {
                            data.match.commentary.push(' wide, ' + com.wide[rand() % com.wide.length]);
                        }
                        else
                        {
                            data.match.commentary.push(com.freehit[rand() % com.freehit.length]);
                            free_hit = 1;
                        }
                        --j;
                        ++extras;
                        --partnership_balls[current_partnership_index];
                        ++partnership_runs[current_partnership_index];
                        --balls[strike[+strike_index]];
                        --deliveries[current_bowler];
                        ++Total[1];
                        delivery_score = 0;
                    }
                    else
                    {
                        if (free_hit) free_hit = 0;
                        switch (delivery_score)
                        {
                            case 0:
                                data.match.commentary.push('No run, ' + com.dot[rand() % com.dot.length]);
                                ++dot;
                                break;
                            case 5:
                                delivery_score -= 1;
                            case 4:
                                data.match.commentary.push('FOUR, ' + com.four[rand() % com.four.length]);
                                ++fours[strike[+strike_index]];
                                break;
                            case 6:
                                data.match.commentary.push('SIX, ' + com.six[rand() % com.six.length]);
                                ++maximums[strike[+strike_index]];
                                ++continuous_maximums;
                                break;
                            case 1:
                                data.match.commentary.push('1 run, ' + com.one[rand() % com.one.length]);
                                break;
                            case 2:
                                data.match.commentary.push('2 runs, ' + com.two[rand() % com.two.length]);
                                break;
                            case 3:
                                data.match.commentary.push('3 runs, ' + com.three[rand() % com.three.length]);
                                break;
                            default:
                                break;
                        }
                        if (delivery_score != 6) continuous_maximums = 0;
                        previous_over += delivery_score;
                        score[strike[+strike_index]] += delivery_score;
                        Total[1] += delivery_score;
                        partnership_runs[current_partnership_index] += delivery_score;

                    }
                    if (Total[1] == Total[0])
                    {
                        data.match.commentary.push(' Scores are level now... ');
                    }
                    else if (Total[1] > Total[0])
                    {
                        data.match.commentary.push(' And they have done it! What an emphatic victory ! ');
                        Overs[1] = 6 * i + j;
                        break;
                    }
                    if (!milestone[strike[+strike_index]] && score[strike[+strike_index]] >= 50)
                    {
                        ++milestone[strike[+strike_index]];
                        data.match.commentary.push(' And that brings up his half century - a well timed innings indeed.');
                    }
                    else if (milestone[strike[+strike_index]] == 1 && score[strike[+strike_index]] >= 100)
                    {
                        ++milestone[strike[+strike_index]];
                        data.match.commentary.push(' what a wonderful way to bring up his century.');
                    }
                    if (delivery_score % 2) strike_index = !strike_index;
                }
            }

            if (continuous_maximums == 6) data.match.commentary.push(' Six G.P.L maximums in the previous over ! What an effort by ' + team_object[+toss].bat_name[strike[+strike_index]] + '. The crowd is ecstatic, ' + team_object[+!toss].bowl_name[current_bowler] + ' is absolutely flabbergasted. ');
            runs_conceded[current_bowler] += previous_over;
            strike_index = !strike_index;
            data.match.commentary.push(' Last Over: ');
            if (previous_over)
            {
                data.match.commentary[data.match.commentary.length - 1] += previous_over + ' run(s)';
            }
            else
            {
                if (j == 7)data.match.commentary[data.match.commentary.length - 1] += 'maiden';
                maidens[current_bowler] += 1;
            }
            data.match.commentary.push('  Current score: ' + Total[1] + ' / ' + wickets[1] + '  Runrate: ' + (Total[1] / (i + 1)).toFixed(2));
            if (Total[1] > Total[0]) break;
            data.match.commentary.push(', RRR: ' + parseFloat(((Total[0] + 1 - Total[1]) / (19 - i))).toFixed(2) + '  Equation: ' + parseInt(Total[0] + 1 - Total[1]) + ' runs needed from ' + parseInt(114 - 6 * i) + ' balls. ');
            if (strike[+strike_index] < 11) data.match.commentary.push(' ' + team_object[+toss].bat_name[strike[+strike_index]] + ' : ' + score[strike[+strike_index]] + ' (' + balls[strike[+strike_index]] + ') ');
            if (strike[+!strike_index] < 11) data.match.commentary.push(' ' + team_object[+toss].bat_name[strike[+!strike_index]] + ' : ' + score[strike[+!strike_index]] + ' (' + balls[strike[+!strike_index]] + ') Partnership: ' + partnership_runs[current_partnership_index] + '(' + partnership_balls[current_partnership_index] + '), runrate: ' + (partnership_runs[current_partnership_index] * 6 / partnership_balls[current_partnership_index])).toFixed(2);
            if (previous_batsman > -1)
            {
                data.match.commentary.push(' Previous Wicket: ' + team_object[+toss].bat_name[previous_batsman] + ': ' + score[previous_batsman] + '(' + balls[previous_batsman] + ')');//console.log(" Previous Wicket: Batsman ", previous_batsman + 1, ": ", score[previous_batsman], "(", balls[previous_batsman], ")");
                if (previous_dismissal > -1)
                {
                    data.match.commentary.push(', Dismissed by: ' + team_object[+!toss].bowl_name[previous_dismissal]);
                }
                else
                {
                    data.match.commentary[data.match.commentary.length - 1] += '(runout)';
                }
                data.match.commentary.push(' Partnership: ' + partnership_runs[previous_partnership_index] + '(' + partnership_balls[previous_partnership_index] + '), runrate: ' + (partnership_runs[previous_partnership_index] * 6 / partnership_balls[previous_partnership_index]).toFixed(2) + ' Fall of wicket: ' + fall_of_wicket);
            }
            data.match.commentary.push('  ' + team_object[+!toss].bowl_name[current_bowler] + ': ' + parseInt(deliveries[current_bowler] / 6) + '.' + deliveries[current_bowler] % 6 + '-' + maidens[current_bowler] + '-' + wickets_taken[current_bowler] + '-' + runs_conceded[current_bowler] + '-' + (runs_conceded[current_bowler] * 6 / deliveries[current_bowler]).toFixed(2) + '  ');
            if (i < 19 && (Total[0] + 1 - Total[1]) / (19 - i) > 36) data.match.commentary.push('The team might as well hop onto the team bus now.... ');
            if (deliveries[current_bowler] == 24) data.match.commentary.push('And that brings an end to Bowler ' + team_object[+!toss].bowl_name[current_bowler] + '\'s spell.  ');
            for (j = 0; j < 6; ++j)
            {
                if (deliveries[j] <= 18 && j != previous_bowler)
                {
                    delivery_score = j;
                    break;
                }
            }
            current_bowler = delivery_score;
            for (j = delivery_score + 1; j < 6; ++j)
            {
                if (deliveries[j] <= 18 && team_object[+!toss].bowler_rating[j] > team_object[+!toss].bowler_rating[current_bowler] && j != previous_bowler) current_bowler = j;
            }
            previous_bowler = current_bowler;
        }

        data.match.commentary.push(' Scorecard:');
        data.match.commentary.push('Runs   Balls Strike Rate Fours Sixes  ');
        for (i = 0; i < 11; ++i)
        {
            if (!balls[i])
            {
                data.match.commentary.push(team_object[+toss].bat_name[i] + ' DNB ');
            }//console.log("  DNB ");
            else
            {
                data.match.commentary.push(team_object[+toss].bat_name[i] + ' ' + score[i] + ' ' + balls[i] + ' ' + (score[i] * 100 / balls[i]).toFixed(2) + ' ' + fours[i] + ' ' + maximums[i]);
                if (!dismissed[i]) data.match.commentary.push('  (not out)');//console.log("  (not out)");
            }
            if (i < 10)
            {
                partnership_runs[i] = partnership_balls[i] = 0;
            }
            balls[i] = fours[i] = maximums[i] = dismissed[i] = milestone[i] = score[i] = balls[i] = fours[i] = maximums[i] = 0;
        }
        data.match.commentary.push('Total: ' + Total[1] + ' / ' + wickets[1] + ' (' + parseInt(Overs[1] / 6) + '.' + Overs[1] % 6 + ' overs)  Runrate: ' + (Total[1] * 6 / Overs[1]).toFixed(2) + ' Extras: ' + extras);
        data.match.commentary.push(' Bowling Statistics:  ');
        data.match.commentary.push('Bowler Overs Maidens Wickets Runs conceded Economy  ');
        for (i = 0; i < 6; i++)
        {
            data.match.commentary.push(team_object[+!toss].bowl_name[i] + ' ' + parseInt(deliveries[i] / 6) + '.' + deliveries[i] % 6 + ' ' + maidens[i] + ' ' + wickets_taken[i] + ' ' + runs_conceded[i] + ' ' + (runs_conceded[i] * 6 / deliveries[i]).toFixed(2));
            five_wicket_haul[i] = continuous_wickets[i] = deliveries[i] = maidens[i] = runs_conceded[i] = wickets_taken[i] = 0;
        }
        data.match.commentary.push('Dot ball percentage: ' + (dot * 100 / Overs[1]).toFixed(2) + ' %');
        data.match.commentary.push('   ');

        if (!(Total[0] - Total[1]))
        {
            if (!(wickets[0] - wickets[1]))
            {
                if (!(Overs[0] - Overs[1]))
                {
                    data.match.commentary.push('TIE ! ');
                    ++data.team[0].tied;
                    ++data.team[0].points;
                    ++data.team[1].tied;
                    ++data.team[1].points;
                    data.team[0].balls_for += Overs[0];
                    data.team[1].balls_for += Overs[1];
                    data.team[0].runs_for += Total[0];
                    data.team[1].runs_for += Total[1];
                    data.team[0].balls_against += Overs[1];
                    data.team[1].balls_against += Overs[0];
                    data.team[0].runs_against += Total[1];
                    data.team[1].runs_against += Total[0];
                    winner_index = -1;
                }
                else
                {

                    if (Overs[1] > Overs[0])
                    {
                        winner_index = +!toss;
                        winner = 0;
                    }
                    else
                    {
                        winner_index = +toss;
                        winner = 1;
                    }
                    data.match.commentary[data.match.commentary.length - 1] += data.team[+winner_index]._id + ' wins! (higher run rate)  ';
                }
            }
            else
            {

                if (wickets[0] > wickets[1])
                {
                    winner_index = +toss;
                    winner = 1;
                }
                else
                {
                    winner_index = +!toss;
                    winner = 0;
                }
                data.match.commentary[data.match.commentary.length - 1] += data.team[+winner_index]._id + ' wins! (fewer wickets lost)  ';
            }
        }
        else
        {
            if (Total[0] < Total[1])
            {
                data.match.commentary.push(data.team[+toss]._id + ' wins by ');
                data.match.commentary[data.match.commentary.length - 1] += (10 - wickets[1]) + ' wicket(s) !';
                winner_index = +toss;
                winner = 1;
            }
            else
            {
                data.match.commentary.push(data.team[+!toss]._id + ' wins by ');
                data.match.commentary[data.match.commentary.length - 1] += (Total[0] - Total[1]) + ' runs!';
                winner_index = +!toss;
                winner = 0;
            }
            data.match.commentary[data.match.commentary.length - 1] += ' ';
        }
        */
        if (parseInt(winner_index) != -1)
        {
            console.log(data.team[+winner_index]._id + ' wins against ' + data.team[+!winner_index]._id);
            ++data.team[+!winner_index].loss;
            ++data.team[+winner_index].win;
            data.team[+winner_index].points += 3;
            data.team[+winner_index].goals_for += Goals[+winner];
            data.team[+!winner_index].goals_for += Goals[+!winner];
            data.team[+winner_index].goals_against += Goals[+!winner];
            data.team[+!winner_index].goals_against += Goals[+winner];
            data.team[+winner_index].goal_diff = data.team[+winner_index].goals_for  - data.team[+winner_index].goals_against;
            data.team[+!winner_index].goal_diff = data.team[+!winner_index].goals_for  - data.team[+!winner_index].goals_against;
        }
    }
    ++data.team[0].played;
    ++data.team[1].played;
    data.team[0].squad.pop();
    data.team[1].squad.pop();
    delete data.team[0].ratings;
    delete data.team[1].ratings;
    var newData = {
        team1: data.team[0],
        team2: data.team[1],
        match: data.match
    };
    callback(null, newData);
};
