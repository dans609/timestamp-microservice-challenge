// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", function(req, res) {
  const reqDateOrUnix = req.params.date;
  let date;

  const testDate = new Date(reqDateOrUnix);
  console.log(testDate);
  console.log(reqDateOrUnix);
  console.log(`is the params undefined?: ${reqDateOrUnix == undefined}`);
  console.log(`is the params contain (-)?: ${reqDateOrUnix.includes('-')}`);

  // check whether the params are set or not, if not set logic goes to [if] statement
  // check whether the params is contains '-' or not, if included: [else-if] will handle the logic
  // if the param string does not meet the criteria, all logic will go to the [else] statemet  
  if(reqDateOrUnix == undefined) {
    date = new Date();
    const currentUnixTimestamp = date.getTime();
    const currentUTC = date.toUTCString();

    res.json({ unix: currentUnixTimestamp, utc: currentUTC });
  } else if(reqDateOrUnix.includes('-')) {
    const [year, month, day] = reqDateOrUnix.split('-');
    
    const isLengthError = (year.length !== 4) ||
      (month === undefined || month.length < 1 || month.length > 2) ||
      (day === undefined || day.length < 1 || day.length > 2)

    date = new Date(reqDateOrUnix);
    const unix = date.getTime();
    const utc = date.toUTCString();
    
    if(isLengthError || isNaN(unix) || unix == null)
      return res.json({ error: utc });
          
    res.json({ unix, utc });
  } else {
    // initialize date value
    // convert the string to number with '+' which a shorthand of valueOf() method
    date = new Date(+reqDateOrUnix);

    // reference: https://nesin.io/blog/javascript-date-to-unix-timestamp
    // get THE unix timestamp of a date with @getTime
    const unix = date.getTime();
  
    // reference: https://www.geeksforgeeks.org/how-to-convert-a-javascript-date-to-utc/
    // convert the default date string (browser's time zone: IST) to Universal Time with @toUTCString
    const utc = date.toUTCString();
  
    // check whether the unix value is NaN | null,
    // if true, the statement below will handle the logic and return json object contain [error] property.
    if(isNaN(unix) || unix == null)
      return res.json({ error: utc });
    
    // send a json object as response from user HTTP request with valid params.
    // the json object contain [unix] and [utc] property
    res.json({ unix, utc });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
