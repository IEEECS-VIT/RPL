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

var k = 0;
var cf = 0;
var cm = 0;
var cd = 0;
var cg = 0;
var mid = [];
var def = [];
var goal = [];
var team = [];
var forward = [];
var cost = 100000000;

function subm()
{
    if(k < 16)
    {
        alert("Team not full");
    }
    else
    {
        for(var j = 1; j < 17; ++j)
        {
            document.getElementById('t' + j).value = team[j - 1];
        }

        document.getElementById('form').action = "/home/getTeam";
        document.getElementById('form').method = "post";
        document.getElementById('form').submit();
    }
}

function sel(id)
{
    if(k === 16)
    {
        alert("Team limit Reached");
        return -1;
    }

    if(k < 17)
    {
        var c = 'cc' + String(id);
        var y = document.getElementById(c);
        if(cost - y.value < 0)
        {
            alert("Low Budget");
            return -1;
        }
        cost -= y.value;
        add(id);
        ++k;
        app();
        document.getElementById("box" + id).style.visibility = 'hidden';
        count();
        disp();
    }
}

function disp()
{
    if(k === 0)
    {
        document.getElementById("dis1").innerHTML = "";
        document.getElementById("dis2").innerHTML = "";
        document.getElementById("dis3").innerHTML = "";
        document.getElementById("dis4").innerHTML = "";
        count();
    }
    else
    {
        disp_for();
        disp_mid();
        disp_def();
        disp_goal();
    }
}

function disp_for()
{
    var i;
    var di = [];

    for(i = 0; i < cf; ++i)
    {
        var id = forward[i];
        var n = 'cn' + String(id);
        var p = 'cp' + String(id);
        var w = document.getElementById(n);
        var x = document.getElementById(p);
        di[i] = "<li><button data-toggle='tooltip'  data-placement='bottom' title='Click to remove player' onclick='rem(" + id + ")'>X</button><p>" + w.value + "</p><p>" + " &euro; " + x.value + " Mil</p></li>";
    }

    document.getElementById("dis1").innerHTML = di.join(" ");
}
function disp_mid()
{
    var i;
    var di = [];

    for(i = 0; i < cm; ++i)
    {
        var id = mid[i];
        var n = 'cn' + String(id);
        var p = 'cp' + String(id);
        var w = document.getElementById(n);
        var x = document.getElementById(p);
        di[i] = "<li><button data-toggle='tooltip'  data-placement='bottom' title='Click to remove player' onclick='rem(" + id + ")'>X</button><p>" + w.value + "</p><p>" + " &euro; " + x.value + " Mil</p></li>";
    }

    document.getElementById("dis2").innerHTML = di.join(" ");
}
function disp_def()
{
    var i;
    var di = [];

    for(i = 0; i < cd; ++i)
    {
        var id = def[i];
        var n = 'cn' + String(id);
        var p = 'cp' + String(id);
        var w = document.getElementById(n);
        var x = document.getElementById(p);
        di[i] = "<li><button data-toggle='tooltip'  data-placement='bottom' title='Click to remove player' onclick='rem(" + id + ")'>X</button><p>" + w.value + "</p><p>" + " &euro; " + x.value + " Mil</p></li>";
    }

    document.getElementById("dis3").innerHTML = di.join(" ");
}
function disp_goal()
{
    var i;
    var di = [];

    for(i = 0; i < cg; ++i)
    {
        var id = goal[i];
        var n = 'cn' + String(id);
        var p = 'cp' + String(id);
        var w = document.getElementById(n);
        var x = document.getElementById(p);
        di[i] = "<li><button data-toggle='tooltip'  data-placement='bottom' title='Click to remove player' onclick='rem(" + id + ")'>X</button><p>" + w.value + "</p><p>" + " &euro; " + x.value + " Mil</p></li>";
    }

    document.getElementById("dis4").innerHTML = di.join(" ");
}
function rem(co)
{
    document.getElementById("box" + co).style.visibility = 'visible';
    var i;
    var j;

    if(t_ch(co) === 1)
    {
        for(i = 0; i < cf; ++i)
        {
            if(co == forward[i])
            {
                for(j = i; j < cf - 1; ++j)
                {
                    forward[j] = forward[j + 1];
                }
                break;
            }
        }
        --cf;
        --k;
    }
    else if(t_ch(co) === 2)
    {
        for(i = 0; i < cm; ++i)
        {
            if(co == mid[i])
            {
                for(j = i; j < cm - 1; ++j)
                {
                    mid[j] = mid[j + 1];
                }
                break;
            }
        }
        --cm;
        --k;
    }
    else if(t_ch(co) === 3)
    {
        for(i = 0; i < cd; ++i)
        {
            if(co == def[i])
            {
                for(j = i; j < cd - 1; j++)
                {
                    def[j] = def[j + 1];
                }
                break;
            }
        }
        --cd;
        --k;
    }
    else if(t_ch(co) === 4)
    {
        for(i = 0; i < cg; ++i)
        {
            if(co == goal[i])
            {
                for(j = i; j < cg - 1; ++j)
                {
                    goal[j] = goal[j + 1];
                }
                break;
            }
        }
        cg--;
        k--;
    }
    app();
    count();
    disp();
}

function ch()
{
    if(cf === 0 || cm === 0 || cd === 0 || cg === 0)
    {
        return -1;
    }
    else
    {
        return 0;
    }
}

function app()
{
    var i = 0;
    var j;
    while(i != k)
    {
        for(j = 0; j < cf; ++j)
        {
            team[i++] = forward[j];
        }

        for(j = 0; j < cm; ++j)
        {
            team[i++] = mid[j];
        }

        for(j = 0; j < cd; ++j)
        {
            team[i++] = def[j];
        }

        for(j = 0; j < cg; ++j)
        {
            team[i++] = goal[j];
        }
    }
}
function t_ch(id)
{
    if(id < 127)
    {
        return 1;
    }
    else if(id < 253)
    {
        return 2;
    }
    else if(id < 369)
    {
        return 3;
    }
    else
    {
        return 4;
    }
}

function add(id)
{
    if(t_ch(id) === 1)
    {
        forward[cf++] = id;
    }
    else if(t_ch(id) === 2)
    {
        mid[cm++] = id;
    }
    else if(t_ch(id) === 3)
    {
        def[cd++] = id;
    }
    else if(t_ch(id) === 4)
    {
        goal[cg++] = id;
    }
}

function count()
{
    ch_cost();
    block();
    var tot = cf + cm + cd + cg;
    document.getElementById('for').innerHTML = "Forwards : " + cf;
    document.getElementById('mid').innerHTML = "Midfielders : " + cm;
    document.getElementById('def').innerHTML = "Defenders : " + cd;
    document.getElementById('goal').innerHTML = "Goalkeepers : " + cg;
    document.getElementById('budget').innerHTML = "BUDGET : " + ch_cost() + "<br /> Selected : " + tot;
}

function ch_cost()
{
    var b;
    cost = 100000000;
    for(b = 0; b < k; ++b)
    {
        var c = 'cc' + String(team[b]);
        var y = document.getElementById(c);
        cost -= y.value;
    }

    return " &euro; " + parseFloat(cost) / 1000000 + " Mil";
}

function block()
{
    var i;
    var j;
    for(i = 1; i < 479; ++i)
    {
        var c = 'cc' + String(i);
        var y = document.getElementById(c);
        console.log(y.value);
        if(cost - y.value < 0)
        {
            j = 'b' + i;
            document.getElementById(j).style.background = "rgba(250,50,50,1)";
        }
        else
        {
            j = 'b' + i;
            document.getElementById(j).style.background = "rgba(10,150,50,0.9)";
        }
    }
}