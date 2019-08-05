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
    setCookie('loggedon', 'true');//setting for the session
    setCookie('namefirst', data[1]);
    setCookie('namelast', data[2]);
    setCookie('cartqty', data['cartqty']);
}

function logout(){
    console.log('logout click');
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.reload(false);
}