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

function reg(x)
{
    document.getElementById('register').style.display = (x === 1) ? 'none' : 'block';
}

function log(x)
{
    document.getElementById('login_small').style.display = (x === 1) ? 'none' : 'block';
}

function login(x)
{
    if(x === 1)
    {
        document.getElementById('login_container').className = 'col-md-4';
        document.getElementById('log').className = 'col-md-4';
        document.getElementById('log').innerHTML = "<a href='#' onclick='login(2)'><div class='col-md-12' id='login'>>></div></a>";
        document.getElementById('login_box').style.display = 'block';
    }
    else
    {
        document.getElementById('log').className = 'col-md-12';
        document.getElementById('login_container').className = 'col-md-1';
        document.getElementById('log').innerHTML = "<a href='#' onclick='login(1)'><div class='col-md-12' id='login'>Login</div></a>";
        document.getElementById('login_box').style.display = 'none';
    }
}

function valid_reset()
{
    var x = document.getElementById('pass').value;
    var y = document.getElementById('cpass').value;
    if(!x.length)
    {
        alert('Please enter password.');
        return false;
    }
    else if(!y.length)
    {
        alert('Please confirm password.');
        return false;
    }
    else if(x.localeCompare(y))
    {
        alert('Password and Confirm password do not match!');
        return false;
    }
    else
    {
        document.reset.submit();
    }
}

function valid_change()
{
    var x = document.getElementById('pass').value;
    var y = document.getElementById('cpass').value;
    var z = document.getElementById('o_pass').value;
    if(!x.length)
    {
        alert('Please enter password.');
        return false;
    }
    else if(!y.length)
    {
        alert('Please confirm password.');
        return false;
    }
    else if(!z.length)
    {
        alert('Please enter your old password.')
    }
    else if(x.localeCompare(y))
    {
        alert('Password and Confirm password do not match!');
        return false;
    }
    else
    {
        document.reset.submit();
    }
}

function reg_valid()
{
    var i = 0;
    var display = "Error:\n";
    var team_name = document.signin.t_name;
    var pass = document.signin.rpass;
    var cpass = document.signin.rcpass;
    var email1 = document.signin.email;
    var mob1 = document.signin.pno;
    var manager1 = document.signin.m_name;

    if(!manager1.value.length)
    {
        manager1.style.backgroundColor = 'Yellow';
        display += ++i + ". Enter Manager name.\n";
    }
    if(!team_name.value.length)
    {
        team_name.style.backgroundColor = 'Yellow';
        display += ++i + ". Enter Team Name.\n";
    }
    else if(team_name.value.length > 25)
    {
        team_name.style.backgroundColor = 'Yellow';
        display += ++i + ". Team Name is too long. Maximum 25 Character.\n";
    }
    if(!pass.value.length)
    {
        pass.style.backgroundColor = 'Yellow';
        display += ++i + ". Enter Password.\n";
    }
    if(pass.value.length < 8 && pass.value.length)
    {
        display += ++i + ". Password too short. Minimum 8 characters.\n";
    }
    if(!cpass.value.length)
    {
        cpass.style.backgroundColor = 'Yellow';
        display += ++i + ". Enter Confirm Password.\n";
    }
    if(!mob1.value.length)
    {
        mob1.style.backgroundColor = 'Yellow';
        display += ++i + ". Please enter a phone number.\n";
    }
    if(!email1.value.length)
    {
        email1.style.backgroundColor = 'Yellow';
        display += ++i + ". Enter Email.\n";
    }
    if(pass.value != cpass.value)
    {
        pass.style.backgroundColor = 'Yellow';
        cpass.style.backgroundColor = 'Yellow';
        display += ++i + ". Password and confirm password do not match.\n";
    }

    for(var z = 0; z < mob1.value.length; ++z)
    {
        if(isNaN(mob1.value[z]))
        {
            mob1.style.backgroundColor = 'Yellow';
            display += ++i + ". Enter a valid mobile number.\n";
            break;
        }
    }

    if(display != "Error:\n")
    {
        confirm(display);
        return false;
    }
    else
    {
        document.getElementById("reg").action = "/register";
        document.getElementById("reg").method = "post";
        document.getElementById("reg").submit();
    }
}