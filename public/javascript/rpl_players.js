/* player selection */
var team = [];
var k = 0;
var r;
var cost = 10000000;
var che;
var cb = 7, cbo = 6, ca = 2, cc = 1;
function subm()
{

    if (k < 15)
    {

        alert("Team not full");


    }
    else
    {
        var id;
        for (var j = 1; j < 17; j++)
        {
            id = 't' + j;
            document.getElementById(id).value = team[j - 1];

        }

        document.getElementById('form').action = "/home/getTeam";
        document.getElementById('form').method = "post";

        document.getElementById('form').submit();

    }

}
function sel(r)
{
    if (k == 16)
    {

        alert("Team limit Reached");
        return -1;
    }

    che = ch(r);

    if (che != -1)
    {
        if (k < 17)
        {


            var c = 'cc' + String(r);
            var y = document.getElementById(c);
            if (cost - y.value < 0)
            {
                alert("Low Budget");
                return -1;
            }
            cost -= y.value;

            team[k] = r;
            k++;
            document.getElementById("box" + r).style.visibility = 'hidden';
            ch(0);
            disp();


        }


        ch(0);
    }
}
var count;
var di = [];
function disp()
{


    if (k == 0)
    {
        document.getElementById("squad").innerHTML = "";
        cost = 10000000;
        document.getElementById('budget').innerHTML = "Selected Players <b style='font-size: 60%'>Budget:" + cost + "<br />" + "Batsmen : " + cb + "<br />" + "Bowlers : " + cbo + "<br />" + "All Rounders : " + ca + "<br />" + "Coach : " + cc + "<br />" + "</b>";
    }
    else
    {
        for (count = 0; count < k; count++)
        {

            var cut = team[count];
            var n = 'cn' + String(cut);
            var p = 'cp' + String(cut);

            var t = 'ct' + String(cut);

            var w = document.getElementById(n);
            var x = document.getElementById(p);

            var z = document.getElementById(t);
            document.getElementById('budget').innerHTML = "Selected Players <b style='font-size: 60%'>Budget:" + cost + "<br />" + "Batsmen : " + cb + "<br />" + "Bowlers : " + cbo + "<br />" + "All Rounders : " + ca + "<br />" + "Coach : " + cc + "<br />" + "</b>";
            di[count] = "<div style='border-radius: 5px;background-color: rgba(0,0,0,0.2);margin-top: 1%;'>" + "<p align='center' style='color: white;padding: 1%;' >" + w.value + "<br />" + x.value + "<br />" + z.value + "</p>" + "<button class='button [tiny small large]' style='height: auto;width:auto;margin-left:75%;padding:1%;margin-bottom:1%;text-align: center;font-weight: bolder;border: 2px solid red;background-color:rgba(255,255,255,0.1);color: red;border-radius: 5px;' onclick='rem(" + cut + ")'>" + " Remove</div></button>" + "</div>";

        }

        document.getElementById("squad").innerHTML = di.join(" ");
    }
}
function rem(co)
{
    document.getElementById("box" + co).style.visibility = 'visible';

    for (var b = 0; b < k; b++)
    {
        if (team[b] == co)
        {
            var a = b;
            while (a < k)
            {

                team[a] = team[a + 1];

                a++;

            }

            k -= 1;
            di[k] = "";

            break;

        }
    }
    cost = 10000000;
    for (b = 0; b < k; b++)
    {
        var c = 'cc' + String(team[b]);
        var y = document.getElementById(c);

        cost -= y.value;


    }
    ch(0);
    disp();

}
function ch(r)
{

    var t, z;

    var b = 0;
    var bo = 0;
    var al = 0;
    var c = 0;


    if (r != 0)
    {
        var asd = 'ct' + String(r);
        var y = document.getElementById(asd);
        if (cb == 0 && y.value.localeCompare('midfielders') == 0)
        {
            alert("Maximum number of Batsmen reached");
            return -1;
        }
        if (cbo == 0 && y.value.localeCompare('defenders') == 0)
        {
            alert("Maximum number of Bowlers reached");
            return -1;
        }
        if (ca == 0 && y.value.localeCompare('strikers') == 0)
        {
            alert("Maximum number of All Rounders reached");
            return -1;

        }
        if (cc == 0 && y.value.localeCompare('coach') == 0)
        {
            alert("Maximum number of Coaches reached");
            return -1;

        }
    }
    for (var a = 0; a < k; a++)
    {


        t = 'ct' + String(team[a]);
        z = document.getElementById(t);
        if (z.value.localeCompare('midfielders') == 0)
        {
            b++;
        }
        else if (z.value.localeCompare('defenders') == 0)
        {
            bo++;
        }
        else if (z.value.localeCompare('strikers') == 0)
        {
            al++;
        }
        else if (z.value.localeCompare('coach') == 0)
        {
            c++;
        }

    }


    cb = 7 - b;
    cbo = 6 - bo;
    ca = 2 - al;
    cc = 1 - c;


}


