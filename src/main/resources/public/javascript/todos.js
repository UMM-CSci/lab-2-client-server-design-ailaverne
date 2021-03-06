/**
 * We use this to make sure we're not trying to do stuff with the
 * elements on the page before the page is even loaded.
 *
 * The use of window.onload is slightly controversial these days, so
 * feel free to google around and replace this with a more
 * up-to-date solution if you think that would be interesting.
 */
window.onload = function() {
    console.log("The page is loaded now!");

    var element = document.getElementById('getAll');
    element.addEventListener("click", getAllToDos, true);
};

var checkBoxToQueryString = function (checkbox) {
    if (checkbox.checked) {
        return "&" + checkbox.id + "=" + checkbox.nextElementSibling.value;
    }
    else {
        return "";
    }
};

var completeQuery = function() {
    var queryString = "?";

    queryString += checkBoxToQueryString(document.getElementById("owner"));
    queryString += checkBoxToQueryString(document.getElementById("status"));
    queryString += checkBoxToQueryString(document.getElementById("contains"));
    queryString += checkBoxToQueryString(document.getElementById("category"));
    queryString += checkBoxToQueryString(document.getElementById("orderBy"));
    queryString += checkBoxToQueryString(document.getElementById("limit"));

    getToDos(queryString);
};


/**
 * Function to get all the to-dos!
 */
var getAllToDos = function() {
    getToDos("");
};

/**
 * Function to fetch a single to-do by ID
 */
var fetchToDoByID = function() {
    var id = document.getElementById("idBox").value;
    getToDos("/" + id);
};

var getToDos = function(query) {
    var HttpThingy = new HttpClient();
    HttpThingy.get("/api/todos" + query, function(returned_json){
        document.getElementById('jsonDump').innerHTML = returned_json;
    });
};

/**
 * Wrapper to make generating http requests easier. Should maybe be moved
 * somewhere else in the future!.
 *
 * Based on: http://stackoverflow.com/a/22076667
 * Now with more comments!
 */
function HttpClient() {
    // We'll take a URL string, and a callback function.
    this.get = function(aUrl, aCallback){
        var anHttpRequest = new XMLHttpRequest();

        // Set a callback to be called when the ready state of our request changes.
        anHttpRequest.onreadystatechange = function(){

            /**
             * Only call our 'aCallback' function if the ready state is 'DONE' and
             * the request status is 200 ('OK')
             *
             * See https://httpstatuses.com/ for HTTP status codes
             * See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
             *  for XMLHttpRequest ready state documentation.
             *
             */
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        };
        
        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}