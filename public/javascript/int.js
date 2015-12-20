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

function valid()
{
    var i = 0;
    var display = "Error:\n";
    var name = document.int.name;
    var email = document.int.email;
    var mob = document.int.mob;

    if(!name.value.length)
    {
        name.style.backgroundColor = 'Yellow';
        display += ++i + ". Enter Name.\n";
    }

    if(!email.value.length)
    {
        email.style.backgroundColor = 'Yellow';
        display += ++i + ". Enter Email.\n";
    }
    if(mob.value.length < 10)
    {
        mob.style.backgroundColor = 'Yellow';
        display += ++i + ". Enter a valid mobile number.\n";
    }

    for(var z = 0; z < mob.value.length; ++z)
    {
        if(isNaN(mob.value[z]))
        {
            mob.style.backgroundColor = 'Yellow';
            display += ++i + ". Enter a valid mobile number.\n";
            break;
        }
    }

    if(display != "Error:\n")
    {
        confirm(display);
        return false;
    }
}