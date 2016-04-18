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

module.exports =
{
    _id : '',
    dob : '',
    team_no : '',
    manager_name: '',
    password_hash: '',
    email: '',
    phone: '',
    status: 0, // 0 => users, 1 => round2, and so on. This will be incremented for shortlisted teams, as opposed to the usual method of aggregating separate collections
    squad: [],
    team: [],
    win: 0,
    loss: 0,
    tied: 0,
    played: 0,
    points: 0,
    ratio: 0.0,
    accuracy: 0.0,
    shots : 0,
    fouls : 0,
    passes : 0,
    goals_for : 0,
    goals_against: 0,
    goal_diff : 0,
    progression: [],
    authStrategy : '',
    form : 1,
    morale : 0.0,
    streak : 0,
    dominance : 0.0,
    possession :0.0,
    mean_goals_for : 0.0,
    mean_goals_against: 0.0,
    stats : {},
    surplus : 0
};