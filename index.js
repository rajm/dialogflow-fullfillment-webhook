const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.all("/silly", function(req, res, next){
  
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


function rsvTokenSnd(res, err, response) {
  if (err) {
      console.log("The API returned an error: " + err);
      return;
  }
  var events = response.data.items; // JSON format output !!
  if (events.length == 0) { // in case searching events not found
      console.log("No events found. ");
      res.send("No events found. ");
  } else {
      console.log("Events List");
      //console.log(events); 
      // print JSON format Output !!
      //var printEvents = JSON.stringify(events); // convert to String object to print in ejs page
      var responseText = [];
      events.forEach(event => {
        responseText.push( event.start.dateTime || event.start.dateTime);
        responseText.push( event.summary);
        responseText.push(  event.location);
        responseText.push(  event.description);
        responseText.push( "---------------------");

      });
      //res.json(responseText);
      res.json(
        {
          "fulfillmentText": "Text response",
          "fulfillmentMessages": [
            {
              "text": {
                "text": responseText
              }
            }
          ],
          "source": "webhook"
        });
        
  }
}



/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  myevents = [];
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: '<Your Calendar ID>',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, response) => {
    rsvTokenSnd(res,err,response);

   
  });
}
//console.log(myevents);

 // const result = req.body.result;
 // const para = result.parameters;
 //console.log(result);
 //console.log(para);

  //const sillyGreeting = `Your favourite color is ${parameters.color} and your number is ${parameters.number}`;

  const sillyGreeting = `hello welcome karthick`;
 
 // res.json('test');

});

app.listen(PORT, function(){
    console.log("App started on port:", PORT);
});
