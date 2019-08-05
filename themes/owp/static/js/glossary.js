/*
function loadDoc(url, cFunction, params) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cFunction(this);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}



function getTermListResult(current) {
    document.getElementById('glossary-links').innerHTML = current.responseText;
    //setprevious();
}
function getRandomList() {
    var jsonObj = {
        "termcnt": 5
    };
    var dbParam = JSON.stringify(jsonObj);

    loadDoc('update.php', getRandomLists, "action=getRandomLists&param=" + dbParam);
}
function getRandomLists(current) {

    document.getElementById('glossary-links').innerHTML = current.responseText;
}
*/

function getGlossaryIndex()
{ 
    $.when( getData('glossary/index') ).then(function( data, textStatus, jqXHR ) 
    {
        
        if(data.length > 0)
        {
            for(var i = 0; i < data.length; i++) 
            {
                var htmlcode = '<a onclick="getTermList(\'' + data[i] + '\')">' + data[i] + "</a>";
                document.getElementById('glossary-firstLetters').insertAdjacentHTML('beforeend', htmlcode);
            }
        }
        else
            console.log('Query failed to return a term. The database may be down. Please comeback at a later time.');
        
    }, function(response)
    {
        console.log(response);
    });
    
}

function getTermList(firstLetter)
{
    document.getElementById('glossary_title').innerHTML = 'Water and Wastewater Terms Beginning ' + firstLetter;
    
    $.when( getData('glossary/terms/'+firstLetter) ).then(function( data, textStatus, jqXHR ) 
    {
        if(data.length > 0)
        {
            var terms = '<ul id="glossary_terms">';
            for(var i = 0; i < data.length; i++) 
            {
                var htmlcode = '<li><dt><a >' + data[i].term + "</a></dt>";
                
                htmlcode += '<dd class="panel-closed" id=' + data[i].id + '></dd></li>';
                
                getTerm(data[i].id);
                
                terms += htmlcode;
            }
            terms += '</ul>';
            
            document.getElementById('glossary-links').innerHTML = terms;
            accordion('glossary_terms');
        }
        else
            console.log('Query failed to return a term. The database may be down. Please comeback at a later time.');

    }, function(response)
    {
        console.log(response);
    });
}

function getTerm(tid)
{    
    $.when( getData('glossary/term/'+tid) ).then(function( data, textStatus, jqXHR ) 
    {
        if(data)
        {
            document.getElementById(tid).innerHTML = data;
        }
        else
            console.log('Query failed to return a term. The database may be down. Please comeback at a later time.');

    }, function(response)
    {
        console.log(response);
    });
}