/**
 * Created by burnualive on 10/12/14.
 */
var sel = 0;
var act_id;
var  k = 0;
var team=[];
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
function rem(id) {
   if(sel===1) {
       document.getElementById("box" + id).style.display = 'none';
    if(act_id.length>2)
        set_team(act_id[1]+act_id[2],id);
       else
        set_team(act_id[1],id);
     console.log(team);
       k++;
        disp(id);
   }else{
       alert("Please select a position first.")
   }

}
function disp(id){
    var a,b;
    var radio = document.getElementById(act_id);
    var style = radio.style;
    var div = document.createElement('li');

    var name = document.getElementById("cn"+id).value;

    div.style.cssText = radio.style.cssText;

    div.style.width = "16%";
    if(div.style.marginTop.length==0) {
        a = div.style.marginLeft;

        if (a.length > 2)
            b = parseInt(a[0] + a[1]);
        else
            b = parseInt(a[0]);

            b = b - 15;
            a = b + '%';


        div.style.marginLeft = a;
    }
    else{
        a = div.style.marginTop;


            b = parseInt(a[0] + a[1]);
        if(b>10)
            b = b - 10;



            a = b + '%';

        div.style.marginTop =a;
    }
    div.innerHTML ="<a href='javascript:ret("+id+","+act_id+");' id='set"+act_id[1]+"' style='float: right;color:rgba(0,0,0,0.7);z-index:1001;font-size:70%;width:100%;text-align:right;'>X</a>"+ "<p>"+name+"</p>" ;
    div.id = act_id;
    radio.parentNode.replaceChild(div,radio);

    sel =0;
}
function ret(id,div){
 //   alert(div.id[1]);
    rem_team(div.id[1]);
    k--;
    document.getElementById("box" + id).style.display = 'block';
    var a,b;



    var radio = document.createElement('input');

    radio.style.cssText = div.style.cssText;

    radio.style.width = "auto";
    if(radio.style.marginTop.length==0) {
        a = radio.style.marginLeft;

        if (a.length > 2)
            b = parseInt(a[0] + a[1]);
        else
            b = parseInt(a[0]);

            b = b + 15;
            a = b + '%';

        radio.style.marginLeft = a;
    }
    else{
        a = radio.style.marginTop;


        b = parseInt(a[0] + a[1]);
        if(b!=10)
            b = b + 10;



        a = b + '%';

        radio.style.marginTop =a;
    }

    radio.name = "f";
    radio.type = 'radio';
    radio.id = div.id;
    radio.setAttribute('onClick', 'active(this.id)');
    div.parentNode.replaceChild(radio,div);

}
function active(act){
    sel = 1;

   act_id = act;

}
function form_check(){
    if(act_id[0] ==='a')
        return 1;
    else if(act_id[0] ==='b')
        return 2;
    else if(act_id[0] ==='c')
        return 3;
    else if(act_id[0] ==='d')
        return 4;
    else if(act_id[0] ==='e')
        return 5;
    else if(act_id[0] ==='f')
        return 6;
    else if(act_id[0] ==='g')
        return 7;
}
function subm() {

    if (k < 11) {

        alert("Team not full");


    }
    else {
        var id;
        for (var j = 1; j < 12; j++) {
            id = 't' + j;
            document.getElementById(id).value = team[j - 1];

        }
        var num = form_check();
        id = 't' + 12;
        document.getElementById(id).value =num;

        document.getElementById('form').action = "/home/getsquad";
        document.getElementById('form').method = "post";
        alert();
        //document.getElementById('form').submit();

    }

}
function clear_all(){
    var id = "set";
    for(var i=0;i<11;i++){
        id = "set"+i;
        if(document.getElementById(id))
            document.getElementById(id).click();
    }
    k=0;
   // document.getElementsByClassName('set').fireEvent('onClick');


}
function set_team(pos,id){
    team[pos]=id;
}
function rem_team(pos){
    team[pos] = 0;
}