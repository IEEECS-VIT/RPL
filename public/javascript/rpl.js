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

        document.getElementById('login_container').style.right = '0';
        document.getElementById('log').innerHTML = "<a href='#' onclick='login(2)'><div class='col-md-12' id='login'>>></div></a>";

    } else {
        document.getElementById('login_container').style.right = '-22.5%';
        document.getElementById('log').innerHTML = "<a href='#' onclick='login(1)'><div class='col-md-12' id='login'>Login</div></a>";
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

function front(){
    setInterval(function () {change()},100);
}
var i=0;
var f=1;
var o =1;
var t;
function change(){

   var x = document.getElementById('front');
    if(i==0){
        o= o - 0.1;

    }
    else
    {
        o= o + 0.1;
        o.toString();
        x.style.opacity = t;


    }

    if(o<0){

        f = f+1;
        if(f==5){
            f=1;
        }
        x.src= '/images/front'+ f.toString()+'.jpg';
        i=1;

            $( "#front" ).fadeIn( "slow", function() {
// Animation complete
            });


    }else if(o>1)
        {
            i=0;
        }

}