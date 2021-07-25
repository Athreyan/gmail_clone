var out = new Map();
// Client ID and API key from the Developer Console
var CLIENT_ID = "your_client_id";
var API_KEY = "your_api_key";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/gmail.readonly";
var requs = "https://gmail.googleapis.com/gmail/v1/users/{userId}/messages";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
  //fetch('https://gmail.googleapis.com/gmail/v1/users/athreyan04@gmail.com/messages')
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    listLabels();
    getBody();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
  pre.appendChild(message);
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
function listLabels() {
  gapi.client.gmail.users.labels
    .list({
      userId: "me",
    })
    .then(function (response) {
      var labels = response.result.labels;
      appendPre();

      //  window.location.replace("http://localhost:5500/page2.html")

      if (labels && labels.length > 0) {
        for (i = 0; i < labels.length; i++) {
          var label = labels[i];
          appendPre(label.name);
        }
      } else {
        appendPre("No Labels found.");
      }
    });
}

function getBody() {
  var iterator = 0;

  gapi.client.gmail.users.messages.list({ userId: "me" }).then(
    function (response) {
      var body = response.result;

      // console.log(response.result);
      getPrimeMail();
      getSentMail();
      iterMsg(body);
      //  for(var i =0; i<= body.length; i++){

      //appendPre('list':response.result);
    },
    function (err) {
      console.error(err);
    }
  );
}

function getDraft() {
  gapi.client.gmail.users.drafts
    .list({
      userId: "me",
    })
    .then(function (response) {
      console.log(response.result);
      readMsg(response.result);
    });
}
function getSentMail() {
  gapi.client.gmail.users.labels
    .get({
      userId: "me",
      id: "SENT",
    })
    .then(function (response) {
      console.log(response.result);
      iterMsg(response.result);
    });
}
function getPrimeMail() {
  gapi.client.gmail.users.messages
    .list({
      userId: "me",
      lableIds: ["CATEGORY_UPDATES"],
    })
    .then(function (response) {
      //console.log(response.result);
      iterMsg(response.result);
    });
}
function iterMsg(body) {
  for (var i = 0; i <= body.messages.length; i++) {
    gapi.client.gmail.users.messages
      .get({
        userId: "me",
        id: body.messages[i].id,
      })
      .then(function (response) {
        //console.log(response.result)
        var msg = response.result;
        getFrom(msg);
      });
  }
}
function readMsg(body) {
  for (var i = 0; i <= body.length; i++) {
    gapi.client.gmail.users.draft
      .get({
        userId: "me",
        id: body.draft[i].id,
      })
      .then(function (response) {
        //console.log(response.result)
        var msg = response.result;
        getFrom(msg);
      });
  }
}
function getFrom(msg) {
  // console.log(msg);
  var from = msg.payload.headers;
  // console.log(from.length)
  for (var i = 0; i <= from.length; i++) {
    if (from[i].name == "From") {
      var sender = from[i].value;
      var content = msg.snippet;

      //   const getDiv=document.getElementById("emailtitle")
      //   const ele = document.createElement("div");
      //   const br = document.createElement("br")
      //   ele.innerHTML=sender;
      //   getDiv.append(ele)

      //   const getDiv1=document.getElementById("emailmsg")
      //   const ele1 = document.createElement("div");
      //   ele.innerHTML=content;
      //   getDiv1.append(ele1)

      var title = document.getElementById("emailtitle").value;
      var originalMsg = document.getElementById("emailmsg").value;
      var n = (document.getElementById("emailtitle").innerHTML = sender);
      var n = (document.getElementById("emailmsg").innerHTML = content);
    }
  }
}
