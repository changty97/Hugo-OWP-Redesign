var currPage = getPagePath();
var userIP      = getIP();
var checkuser   = getCookies();
$(document).ready(function () {
    var notification = false;//true for notification
        $(document).foundation();
        $(function () {
            $('body').removeClass('fade-out');
        });
        if (document.body.clientWidth < 912)
        {
            if(document.getElementById("example-menu"))
                document.getElementById("example-menu").style.display = "none";
            if(document.getElementById("stromwater-menu"))
                document.getElementById("stromwater-menu").className += ' vertical';
        } else {
            $("#stromwater-menu").removeClass(' vertical');
        }

        if(document.getElementById('notification-update-panel') != null){
            if(notification){
                document.getElementById('notification-update-panel').innerHTML="<div class='callout alert  radius' data-closable><h5>Campus Closure Update</h5>" +
                    "<p>Sac state campus continues to be closed tomorrow. OWP will be closed as well.</p>" +
                    "<button class='close-button' aria-label='Dismiss alert' type='button' data-close style='color: #8a8a8a;'><span aria-hidden='true'>&times;</span></button></div>";
            }
        }
        checkSignedIn();
        if(document.getElementById("learning_objective"))
            accordion('learning_objective');
        if(document.getElementById("glossary-links"))
        {
            accordion('glossary_terms');
            getGlossaryIndex();
        }
    }
);
$(document).on('close.fndtn.alert', function(event) {
    console.info('An alert box has been closed!');
});
function toggle_function(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';

}
function checkOffset() {
    if ($('#side-nav').offset().top + $('#side-nav').height() >= $('footer').offset().top) {
        $('footer').css('z-index', '11');
        var displayFooterHeight = $(window).height() - ($('footer').offset().top - $(window).scrollTop());
        var heightOfNav = $(window).height() - displayFooterHeight ;//- 60;
        $('#side-nav').css('height', heightOfNav);
    } else {
        $('#side-nav').css('height', 'calc(100vh)');
    } // restore when you scroll up}
}
$(document).scroll(function () {
    checkOffset();
});
function openNav() {
    var width = document.body.clientWidth;
    if (width > 1960) {//1690
        var move = (250 - (width - 1960));
        if (move > 0) {
            document.getElementById("side-nav").style.width = "250px";
           // document.getElementById("main").style.marginLeft = move + 'px';
            document.getElementById("m1").style.width = "224px";
        } else {
            document.getElementById("side-nav").style.width = "250px";
          //  document.getElementById("main").style.marginLeft = "0px";
            document.getElementById("m1").style.width = "224px";
        }
    } else {
        document.getElementById("side-nav").style.width = "250px";
        //document.getElementById("main").style.marginLeft = "250px";
        document.getElementById("m1").style.width = "224px";
    }
}

function closeNav() {
    document.getElementById("side-nav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("m1").style.width = "0";
}

function openDropDown(id) {
    document.getElementById(id).className = "show";
}

function add_array(id) {
    document.getElementById(id).style.visibility = "hidden";
    document.getElementById(id).className = "hide";
}

$(window).scroll(function () {
    if ($(window).scrollTop() >= 69) {
//        $('#water-program').addClass('fixed-water-programs');
        $('#side-nav').addClass('fixed-side-nav');
    }
    else {
        //      $('#water-program').removeClass('fixed-water-programs');
        $('#side-nav').removeClass('fixed-side-nav');
    }
});

function slideorbit() {
    $('#s1').addClass('is-active');
}

function openPage(link) {
    $("showmain").replaceWith(document.getElementById("hide"));
    $("hide").show();
    window.location.href = link;
}
function pushHistory(urlPath) {
    var ob1 = {str: "panel2"};
    window.history.pushState(ob1, "Panel 2", urlPath);
}

function dropdownVisibility(id) {
    if (document.getElementById(id).style.visibility == 'visible') {
        document.getElementById(id).style.visibility = 'hidden';
    } else {
        document.getElementById(id).style.visibility = 'visible';
    }
}
function opendiv(id, curr, panel_class = 'none') {
    var element = document.getElementsByClassName('lid');
    var header = document.getElementsByClassName('lid-sub-header');
    for (var i = 0; i < header.length; i++) {
        header[i].style.color = "white";
        header[i].style.background = "rgba(0, 46, 35, 0.5)";
    }
    for (var i = 0; i < element.length; i++) {
        element[i].style.visibility = "hidden";
        element[i].style.height = 0;
        element[i].style.overflow = "hidden";
    }
    document.getElementById(id).style.visibility = "visible";
    document.getElementById(id).style.height = "unset";
    document.getElementById(id).style.overflow = "unset";
    document.getElementById('featured-EFC2').style.display = "none";
    curr.style.color = 'rgba(0, 46, 35, 0.5)';
    curr.style.background = 'white';
    if (id == 'lid-Regional-Conference') {
        document.getElementById("Sponsor-title").setAttribute("aria-selected", "true");
        document.getElementById("Sponsors").classList.add("is-active");
        document.getElementById("Sponsors").style.display = 'block';
        //   document.getElementById('Sponsors').style.display = 'block';
    }
    if (panel_class == 'strm-panel') {
        element = document.getElementsByClassName(panel_class);
        curr.style.background = 'unset';
        for(var i = 0; i < element.length;i++){
            element[i].style.visibility = "hidden";
            element[i].style.height = 0;
            element[i].style.overflow = "hidden";
        }

    }

}
function checkSignedIn()
{
    var loggedIn = checkuser['loggedon'];
    
    if(checkuser['cartqty'] == undefined)
    {
        checkuser['cartqty'] = 0;
    }
    if(currPage == "/login/" && !loggedIn)
    {//user is on the login page
        $( '#userLogin' ).css('margin-top','25px');
        $( '#userLogin' ).html( '<a href="https://www.owp.csus.edu/join.php">Create Account</a>' );
        setCart(checkuser['cartqty']);
    }
    else if(loggedIn)
    {//user is logged in
        //console.log('signed in');
        $( '#userLogin' ).css('margin-top','15px');
        $( '#userLogin' ).html( 'Hello, ' + checkuser['namefirst'] + '<br><span id="logout" onclick="logout()">Log Out</span>');
        //$( '#userLogin' ).html( '<a href="/login/"><i class="fa fa-user-circle-o" aria-hidden="true"></i></a>' );
        setCart(checkuser['cartqty']);              
    }
    else
    {//user is not logged in
        $( '#userLogin' ).css('margin-top','15px');
        $( '#userLogin' ).html( '<a href="/login/">Sign In</a><br/><a href="https://www.owp.csus.edu/join.php">Create Account</a>' );
        setCart(checkuser['cartqty']);
    }
}
function setCart(count)
{
    if(count > 9)
    {
        $( '#cart' ).css('background-image','url(/svg/icons/cart-number-wht.svg)');
        $( '#cart' ).html( '<a href="https://www.owp.csus.edu/cart/"> 9 + </a>' );
        $( '#cart a' ).css('margin-left','13px');
    }
    else if(count > 0)
    {
        $( '#cart' ).css('background-image','url(/svg/icons/cart-number-wht.svg)');
        $( '#cart' ).html( '<a href="https://www.owp.csus.edu/cart/">' + count + '</a>' );
        $( '#cart a' ).css('margin-left','20px');
    }
    else
    {
        $( '#cart' ).css('background-image','url(/svg/icons/cart-empty-wht.svg)');
    }
}
function getPagePath()
{
    return window.location.pathname;
}
function getIP()
{
    var findIP = new Promise(r=>{var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}})
    
    findIP.then(function(ip)
    {
        userIP = ip;
    }).catch(e => console.error(e));
}


/**
 * Set cookie function
 */
function setCookie(name, val, expiration, unit)
{
    var multiplier;
    
    if(!unit)
        multiplier = 60 * 60 * 24 * 1000; //default is a day
    else
        unit       = unit.toLowerCase();
    
    if(/second/.test(unit))
        multiplier  = 1 * 1000;
    else if(/minute/.test(unit))
        multiplier  = 60 * 1000;
    else if(/hour/.test(unit))
        multiplier  = 60 * 60 * 1000;
    else if(/day/.test(unit))
        multiplier  = 60 * 60 * 24 * 1000;// 86400 * 1000 = 1 day
    else if(/week/.test(unit))
        multiplier  = 60 * 60 * 24 * 7 * 1000;
    else if(/month/.test(unit))
        multiplier  = 60 * 60 * 24 * 30 * 1000;
    else if(/year/.test(unit))
        multiplier  = 60 * 60 * 24 * 365 * 1000;
    
    if(expiration)
    {
        var exp_date= new Date();
        exp_date.setTime(exp_date.getTime()+(expiration * multiplier));
        var expires = "; expires="+exp_date.toGMTString();
    }
    else 
        var expires = "";
    
    document.cookie = name + "=" + val + expires + ";path=/";
}

function getCookies(){
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i=0; i<pairs.length; i++)
    {
        var pair = pairs[i].split("=");
        cookies[(pair[0]+'').trim()] = unescape(pair[1]);
    }
    return cookies;
}                

function accordion(id)
{
    var allPanels = $('#' + id + ' li dd').hide();
    
    $('#' + id + ' dt').click(function()
    {
        //console.log($(this).parent());
        
        var accOpen = $(this).next().hasClass('panel-open');
        
        $('#' + id + ' dd').removeClass('panel-open');
        
        allPanels.slideUp({ duration: 200 });
        
        if($(this).next().hasClass('panel-open'))
        {
            $(this).next().slideUp({ duration: 200 }).removeClass('panel-open');
            return false;
        }
        else
        {
            if(!accOpen)
            {
                $(this).next().slideDown({ duration: 200 }).addClass('panel-open');
                return false;
            }
        }
    });
}

var p='https://';
if(window.location.hostname == 'localhost' || window.location.hostname == 'local.owp.com') var d='local.api.owp.csus.edu'; else var d='local.api.owp.csus.edu';
var v='/api/v1/';
var k='Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMjMsImVtYWlsIjoiamFzb24ubGF1QG93cC5jc3VzLmVkdSJ9.zJgCZTVH4DfXcaP6sICUt-wT-02X04FP6hl_FDVXLCo';

function getData(f, x) 
{
	if(!x) var u=p+d+v+f; else var u=p+d+v+f+'/'+x;
	return $.ajax(
	{
        type: "GET",
        async: true,
        url: u,
        dataType: "json",
		headers: { 'Authorization': k },
        error: function (jqXHR, textStatus, errorThrown)
		{
            console.log("get session failed: " + errorThrown);
        }
    });
}
function postData(a, f, x) 
{	
	if(!x) var u=p+d+v+f; else var u=p+d+v+f+'/'+ x;
	return $.ajax(
	{
        type: "POST",
        async: true,
        url: u,
		headers: { 'Authorization': k },
        contentType : 'application/x-www-form-urlencoded',
        data:a
    });
}