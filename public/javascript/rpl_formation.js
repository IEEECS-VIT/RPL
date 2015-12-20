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
var sel = 0;
var act_id;
var team = [];
var ref =
{
    'a': 1,
    'b': 3,
    'c': 3,
    'd': 4,
    'e': 5,
    'f': 6,
    'g': 7
};

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

function rem(id)
{
    if(sel === 1)
    {
        document.getElementById("box" + id).style.display = 'none';
        if(act_id.length > 2)
        {
            set_team(act_id[1] + act_id[2], id);
        }
        else
        {
            set_team(act_id[1], id);
        }
        console.log(team);
        ++k;
        disp(id);
    }
    else
    {
        alert("Please select a position first.")
    }
}

function disp(id)
{
    var a, b;
    var radio = document.getElementById(act_id);
    var style = radio.style;
    var li = document.createElement('li');
    var name = document.getElementById("cn" + id).value;
    li.style.cssText = radio.style.cssText;
    li.style.width = "16%";

    if(li.style.marginTop.length === 0)
    {
        a = li.style.marginLeft;

        if(a.length > 2)
        {
            b = parseInt(a[0] + a[1]);
        }
        else
        {
            b = parseInt(a[0]);
        }

        b -= 15;
        a = b + '%';
        li.style.marginLeft = a;
    }
    else
    {
        a = li.style.marginTop;
        b = parseInt(a[0] + a[1]);

        if(b > 10)
        {
            b -= 10;
        }

        a = b + '%';
        li.style.marginTop = a;
    }

    li.innerHTML = "<a href='javascript:ret(" + id + "," + act_id + ");' id='set" + act_id[1] + "' style='float: right;color:rgba(0,0,0,0.7);z-index:1001;font-size:70%;width:100%;text-align:right;'>X</a>" + "<p>" + name + "</p>";
    li.id = act_id;
    radio.parentNode.replaceChild(li, radio);
    sel = 0;
}

function ret(id, li)
{
    rem_team(li.id[1]);
    --k;
    document.getElementById("box" + id).style.display = 'block';
    var a, b;
    var radio = document.createElement('input');
    radio.style.cssText = li.style.cssText;
    radio.style.width = "auto";

    if(radio.style.marginTop.length === 0)
    {
        a = radio.style.marginLeft;
        if(a.length > 2)
        {
            b = parseInt(a[0] + a[1]);
        }
        else
        {
            b = parseInt(a[0]);
        }

        b = b + 15;
        a = b + '%';
        radio.style.marginLeft = a;
    }
    else
    {
        a = radio.style.marginTop;
        b = parseInt(a[0] + a[1]);

        if(b != 10)
        {
            b += 10;
        }

        a = b + '%';
        radio.style.marginTop = a;
    }

    radio.name = "f";
    radio.type = 'radio';
    radio.id = li.id;
    radio.setAttribute('onClick', 'active(this.id)');
    li.parentNode.replaceChild(radio, li);
}

function active(act)
{
    sel = 1;
    act_id = act;
}

function form_check()
{
    return ref[act_id[0]];
}

function subm()
{
    if(k < 11)
    {
        alert("Team not full");
    }
    else
    {
        var id;

        for(var j = 1; j < 12; ++j)
        {
            document.getElementById('t' + j).value = team[j - 1];
        }

        var num = form_check();
        id = 't' + 12;
        document.getElementById(id).value = num;
        document.getElementById('form').action = "/home/getsquad";
        document.getElementById('form').method = "post";
    }
}

function clear_all()
{
    var id = "set";

    for(var i = 0; i < 11; ++i)
    {
        id = "set" + i;
        if(document.getElementById(id))
        {
            document.getElementById(id).click();
        }
    }
    k = 0;
}

function set_team(pos, id)
{
    team[pos] = id;
}

function rem_team(pos)
{
    team[pos] = 0;
}