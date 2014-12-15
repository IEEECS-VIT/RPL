/**
 * Created by burnualive on 4/11/14.
 */
function reg(x) {
    if (x === 1) {
        document.getElementById('register').style.display = 'none';
        /* $( document.getElementById('red') ).click(function() {
         $( "#register" ).show( "fade" );
         });*/
    } else {
        /*$( document.getElementById('x') ).click(function() {
         $( "#register" ).hide( "fade" );
         });*/
        document.getElementById('register').style.display = 'block';
    }

}
function log(x) {
    if (x === 1) {
        document.getElementById('login_small').style.display = 'none';
        /* $( document.getElementById('red') ).click(function() {
         $( "#register" ).show( "fade" );
         });*/
    } else {
        /*$( document.getElementById('x') ).click(function() {
         $( "#register" ).hide( "fade" );
         });*/
        document.getElementById('login_small').style.display = 'block';
    }

}
function login(x) {
    if (x === 1) {

        document.getElementById('login_container').className = 'col-md-4';
        document.getElementById('log').className = 'col-md-4';
        document.getElementById('log').innerHTML = "<a href='#' onclick='login(2)'><div class='col-md-12' id='login'>>></div></a>";
        document.getElementById('login_box').style.display = 'block';

    } else {
        document.getElementById('log').className = 'col-md-12';
        document.getElementById('login_container').className = 'col-md-1';
        document.getElementById('log').innerHTML = "<a href='#' onclick='login(1)'><div class='col-md-12' id='login'>Login</div></a>";
        document.getElementById('login_box').style.display = 'none';
    }

}
function valid_reset(){
    var x = document.getElementById('pass').value;
    var y = document.getElementById('cpass').value;
   if(x.length==0){
     alert('Please enter password.');
       return false;
   }else if(y.length==0){
       alert('Please confirm password.');
       return false;
   }
    else if(x.localeCompare(y)!=0){
        alert('Password and Confirm password do not match!');
        return false;
    }
    else{
        document.reset.submit();
    }
}
function valid_change(){
    var x = document.getElementById('pass').value;
    var y = document.getElementById('cpass').value;
    var z = document.getElementById('o_pass').value;
    if(x.length==0){
        alert('Please enter password.');
        return false;
    }else if(y.length==0){
        alert('Please confirm password.');
        return false;
    }
    else if(z.length ==0){
        alert('Please enter your old password.')
    }
    else if(x.localeCompare(y)!=0){
        alert('Password and Confirm password do not match!');
        return false;
    }
    else{
        document.reset.submit();
    }
}

function reg_valid()
{
    var display = "Error:\n";
    var team_name = document.signin.t_name;
    var pass = document.signin.rpass;
    var cpass = document.signin.rcpass;
    var email1 = document.signin.email;
    var mob1 = document.signin.pno;
    var manager1 = document.signin.m_name;

    var i = 0;
    if (manager1.value.length == 0)
    {
        i++;
        manager1.style.backgroundColor = 'Yellow';
        display += i.toString() + ". Enter Manager name.\n";
    }
    if (team_name.value.length == 0)
    {
        i++;
        team_name.style.backgroundColor = 'Yellow';
        display += i.toString() + ". Enter Team Name.\n";
    } else if (team_name.value.length > 25) {
        i++;
        team_name.style.backgroundColor = 'Yellow';
        display += i.toString() + ". Team Name is too long. Maximum 25 Character.\n";
    }
    if (pass.value.length == 0)
    {
        i++;
        pass.style.backgroundColor = 'Yellow';
        display += i.toString() + ". Enter Password.\n";
    }
    if (pass.value.length < 8 && pass.value.length != 0)
    {
        i++;
        display += i.toString() + ". Password too short. Minimum 8 characters.\n";
    }
    if (cpass.value.length == 0)
    {
        i++;
        cpass.style.backgroundColor = 'Yellow';
        display += i.toString() + ". Enter Confirm Password.\n";
    }

    if (mob1.value.length == 0)
    {
        i++;
        mob1.style.backgroundColor = 'Yellow';
        display += i.toString() + ". Please enter a phone number.\n";
    }
    if (email1.value.length == 0)
    {
        i++;
        email1.style.backgroundColor = 'Yellow';
        display += i.toString() + ". Enter Email.\n";
    }

    if (pass.value != cpass.value)
    {
        i++;
        pass.style.backgroundColor = 'Yellow';
        cpass.style.backgroundColor = 'Yellow';
        display += i.toString() + ". Password and confirm password do not match.\n";
    }
    for (var z = 0; z < mob1.value.length; z++)
    {
        if (isNaN(mob1.value[z]))
        {
            i++;
            mob1.style.backgroundColor = 'Yellow';
            display += i.toString() + ". Enter a valid mobile number.\n";
            break;
        }
    }


    if (display != "Error:\n")
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
