/* player selection */
var team = [];
var forward = [];
var mid = [];
var def = [];
var goal = [];
var k = 0;
var cost = 100000000;

var cf = 0, cm = 0, cd = 0, cg = 0;
function subm() {

    if (k < 16) {

        alert("Team not full");


    }
    else if (ch() === -1) {
        alert("You need to choose atleast 1 player of each type.");
    }
    else {
        var id;
        for (var j = 1; j < 17; j++) {
            id = 't' + j;
            document.getElementById(id).value = team[j - 1];

        }

        document.getElementById('form').action = "/home/getTeam";
        document.getElementById('form').method = "post";

        document.getElementById('form').submit();

    }

}
function sel(id) {
    if (k == 16) {

        alert("Team limit Reached");
        return -1;
    }


    if (k < 17) {


        var c = 'cc' + String(id);
        var y = document.getElementById(c);
        if (cost - y.value < 0) {
            alert("Low Budget");
            return -1;
        }
        cost -= y.value;
        add(id);
        k++;
        app();
        document.getElementById("box" + id).style.visibility = 'hidden';
        count();
        disp();
    }


}

function disp() {


    if (k == 0) {
        document.getElementById("dis1").innerHTML = "";
        document.getElementById("dis2").innerHTML = "";
        document.getElementById("dis3").innerHTML = "";
        document.getElementById("dis4").innerHTML = "";
        count();
    }
    else {
        disp_for();
        disp_mid();
        disp_def();
        disp_goal();

    }
}
function disp_for() {
    var i;
    var di = [];
    for (i = 0; i < cf; i++) {

        var id = forward[i];
        var n = 'cn' + String(id);
        var p = 'cp' + String(id);
        var w = document.getElementById(n);
        var x = document.getElementById(p);


        di[i] = "<li><button data-toggle='tooltip'  data-placement='bottom' title='Click to remove player' onclick='rem(" + id + ")'>X</button><p>" + w.value + "</p><p>"+ " &euro; " + x.value + " Mil</p></li>";

    }

    document.getElementById("dis1").innerHTML = di.join(" ");
}
function disp_mid() {
    var i;
    var di = [];
    for (i = 0; i < cm; i++) {

        var id = mid[i];
        var n = 'cn' + String(id);
        var p = 'cp' + String(id);
        var w = document.getElementById(n);
        var x = document.getElementById(p);


        di[i] = "<li><button data-toggle='tooltip'  data-placement='bottom' title='Click to remove player' onclick='rem(" + id + ")'>X</button><p>" + w.value + "</p><p>"+ " &euro; " + x.value + " Mil</p></li>";

    }

    document.getElementById("dis2").innerHTML = di.join(" ");

}
function disp_def() {
    var i;
    var di = [];
    for (i = 0; i < cd; i++) {

        var id = def[i];
        var n = 'cn' + String(id);
        var p = 'cp' + String(id);
        var w = document.getElementById(n);
        var x = document.getElementById(p);


        di[i] = "<li><button data-toggle='tooltip'  data-placement='bottom' title='Click to remove player' onclick='rem(" + id + ")'>X</button><p>" + w.value + "</p><p>"+ " &euro; " + x.value + " Mil</p></li>";

    }

    document.getElementById("dis3").innerHTML = di.join(" ");

}
function disp_goal() {
    var i;
    var di = [];
    for (i = 0; i < cg; i++) {

        var id = goal[i];
        var n = 'cn' + String(id);
        var p = 'cp' + String(id);
        var w = document.getElementById(n);
        var x = document.getElementById(p);


        di[i] = "<li><button data-toggle='tooltip'  data-placement='bottom' title='Click to remove player' onclick='rem(" + id + ")'>X</button><p>" + w.value + "</p><p>" + " &euro; " + x.value + " Mil</p></li>";

    }

    document.getElementById("dis4").innerHTML = di.join(" ");

}
function rem(co) {
    document.getElementById("box" + co).style.visibility = 'visible';
    var i;
    var j;
    if (t_ch(co) == 1) {
        for (i = 0; i < cf; i++) {
            if (co == forward[i]) {
                for (j = i; j < cf - 1; j++) {

                    forward[j] = forward[j + 1];
                }
                break;
            }


        }
        cf--;
        k--;
    } else if (t_ch(co) == 2) {
        for (i = 0; i < cm; i++) {
            if (co == mid[i]) {
                for (j = i; j < cm - 1; j++) {

                    mid[j] = mid[j + 1];
                }
                break;
            }

        }
        cm--;
        k--;
    } else if (t_ch(co) == 3) {
        for (i = 0; i < cd; i++) {
            if (co == def[i]) {
                for (j = i; j < cd - 1; j++) {

                    def[j] = def[j + 1];
                }
                break;
            }

        }
        cd--;
        k--;
    } else if (t_ch(co) == 4) {
        for (i = 0; i < cg; i++) {
            if (co == goal[i]) {
                for (j = i; j < cg - 1; j++) {

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
function ch() {
    if (cf === 0 || cm === 0 || cd === 0 || cg === 0)
        return -1;
    else
        return 0;
}


function app() {
    var i = 0;
    var j;
    while (i != k) {

        for (j = 0; j < cf; j++) {
            team[i] = forward[j];
            i++;
        }
        for (j = 0; j < cm; j++) {
            team[i] = mid[j];
            i++;
        }
        for (j = 0; j < cd; j++) {
            team[i] = def[j];
            i++;
        }
        for (j = 0; j < cg; j++) {
            team[i] = goal[j];
            i++;
        }
    }
}
function t_ch(id) {
    if (id < 127) {
        return 1;
    } else if (id < 253) {
        return 2;
    } else if (id < 369) {
        return 3;
    } else {
        return 4;
    }

}
function add(id) {
    if (t_ch(id) == 1) {
        forward[cf] = id;
        cf++;
    } else if (t_ch(id) == 2) {
        mid[cm] = id;
        cm++;
    } else if (t_ch(id) == 3) {
        def[cd] = id;
        cd++;
    } else if (t_ch(id) == 4) {
        goal[cg] = id;
        cg++;
    }
}
function count() {
    ch_cost();
    block();
    var tot = cf + cm +cd + cg;
    document.getElementById('for').innerHTML = "Forwards : " + cf;
    document.getElementById('mid').innerHTML = "Midfielders : " + cm;
    document.getElementById('def').innerHTML = "Defenders : " + cd;
    document.getElementById('goal').innerHTML = "Goalkeepers : " + cg;
    document.getElementById('budget').innerHTML = "BUDGET : " + ch_cost() + "<br /> Selected : " + tot;


}
function ch_cost() {
    var b;
    cost = 100000000;
    for (b = 0; b < k; b++) {
        var c = 'cc' + String(team[b]);
        var y = document.getElementById(c);

        cost -= y.value;


    }
    var word_cost;
    var float_cost;
    float_cost = parseFloat(cost) / 1000000.000;

    word_cost = " &euro; "+float_cost + " Mil";
    return word_cost;

}
function block() {
    var i;
    var j;
    for (i = 1; i < 479; i++) {
        var c = 'cc' + String(i);
        var y = document.getElementById(c);
        console.log(y.value);
        if (cost - y.value < 0) {
            j = 'b' + i;
            document.getElementById(j).style.background = "rgba(250,50,50,1)";
        } else {
            j = 'b' + i;
            document.getElementById(j).style.background = "rgba(10,150,50,0.9)";

        }
    }
}