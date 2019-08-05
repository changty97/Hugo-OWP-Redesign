var currPage = getPagePath();
$(document).ready(function () {
    var notification = false;//true for notification
        $(document).foundation();
        $(function () {
            $('body').removeClass('fade-out');
        });
        if (document.body.clientWidth < 912) {
            document.getElementById("example-menu").style.display = "none";
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
    var loggedIn = (Math.random()>0.5)? 1 : 0;
    
    if(currPage == "/login/")
    {//user is on the login page
        $( '#userLogin' ).css('margin-top','25px');
        $( '#userLogin' ).html( '<a href="https://www.owp.csus.edu/join.php">Create Account</a>' );
        $( '#cart' ).html( '' );
    }
    else if(loggedIn)
    {//user is logged in
        console.log('signed in');
        $( '#userLogin' ).css('margin-top','25px');
        $( '#userLogin' ).html( 'Hello, Joe Hornet' );
        //$( '#userLogin' ).html( '<a href="/login/"><i class="fa fa-user-circle-o" aria-hidden="true"></i></a>' );
        //$( '#cart' ).html( '<a href="https://www.owp.csus.edu/cart/"><img src="/svg/icons/cart.svg" width="35" height="35"></a>' );
    }
    else
    {//user is not logged in
        $( '#userLogin' ).css('margin-top','25px');
        $( '#userLogin' ).html( '<a href="/login/">Sign In</a> or <a href="https://www.owp.csus.edu/join.php">Create Account</a>' );
        $( '#cart' ).html( '' );
    }
}

function getPagePath()
{
    console.log(window.location.pathname);
    return window.location.pathname;
}
