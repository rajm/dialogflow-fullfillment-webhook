const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.post("/silly", function(req, res, next){

  // uncomment this to see what DialogFlow is sending us.
   console.log(req.body);

  //const result = req.body.result;
  //const parameters = result.parameters;

  //const sillyGreeting = `Your favourite color is ${parameters.color} and your number is ${parameters.number}`;

  const sillyGreeting = `hello welcome karthick`;

  res.json({
   // speech : sillyGreeting,
   //fulfillmentText : sillyGreeting
   fulfillmentMessages: [
    {
      "quickReplies": {
          "title": "What information do you want today?",
          "quickReplies": [
            "press meet",
			"events"
          ]
        },
        "platform": "FACEBOOK"
    }
  ]
  });

});

app.listen(PORT, function(){
    console.log("App started on port:", PORT);
});
