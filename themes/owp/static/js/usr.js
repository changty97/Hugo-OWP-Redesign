function getSes()
{
    var sid     = checkuser['sid'];
    var cartqty = checkuser['cartqty'];
    
    if(sid == undefined)
        sid     = 'empty';
    if(cartqty == '')
        cartqty = 0;
    
    var param   = 'user/session';
    
    if(sid)
        param = param + '/' + sid  + '/' + cartqty;
        
    $.when( getData(param) ).then(function( data, textStatus, jqXHR ) 
    {
        if(data)
        {
            console.log(data);
            setCookie('sid', data['id'], '2', 'minutes');
            setCookie('cartqty', data['cartqty'], '2', 'minutes');
        }
        else
            console.log('No session data');

    }, function(response)
    {
        console.log(response);
    });
}
function login()
{
    var fdata = $("#aboutUs").serializeArray();
    fdata.push({name: 'ip', value: userIP});
    
    $.when( postData(fdata, 'user/login') ).then(function( data, textStatus, jqXHR ) 
    {
        if(data['id'])
        {
            $( '#login_error' ).text( '' );
            setUser(data);
            window.location.replace("/");
        }
        else
            $( '#login_error' ).text( 'The system is unable to match your log on credentials.' );
    }, function(response)
    {
        console.log(response);
    });
}

function setUser(data)
{
    console.log(data);
    setCookie('loggedon', 'true', '2', 'minutes');//setting for the session
    setCookie('namefirst', data[1], '2', 'minutes');
    setCookie('cartqty', data['cartqty'], '2', 'minutes');
}

function logout(){
    console.log('logout click');
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.reload(false);
}

function inactivityTime() 
{
    window.onload           = resetTimer;
    // DOM Events
    document.onmousemove    = resetTimer;
    document.onkeypress     = resetTimer;
}

function resetTimer() 
{
    var time;
    clearTimeout(time);
    time = setTimeout(logout, 3000000);    // 1000 milliseconds = 1 second, set for 5 minutes

    var usrSession = {
       loggedon: checkuser['loggedon'],
       1: checkuser['namefirst'],
       cartqty:checkuser['cartqty'],
       sid:checkuser['sid']
    }
    
    if(checkuser['loggedon'] && checkuser['namefirst'] && checkuser['cartqty'])
        setUser(usrSession);
}