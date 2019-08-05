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


function getTermList(firstLetter) {

    document.getElementById('glossary_title').innerHTML = 'Water and Wastewater Terms Beginning ' + firstLetter;
    var jsonObj = {
        "firstLetter": firstLetter
    };
    var dbParam = JSON.stringify(jsonObj);

    loadDoc('update.php', getTermListResult, "action=getTermLists&param=" + dbParam);
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

