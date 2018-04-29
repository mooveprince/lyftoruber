var Alexa = require ('alexa-sdk');
var utility = require('./utility');

const skillName = "Path Finder";

const states = {
    DESTINATIONMODE: '_DESTINATIONMODE', // User is trying to get the rate.
    SOURCEMODE: '_SOURCEMODE',
    FILTERBYMODE: '_FILTERBYMODE'
};

//First Handler that gets active when app got invoked
const newSessionHandlers = {
    "AMAZON.StopIntent": function () {
        this.emit(':tell', "Goodbye");
    },
 
    "AMAZON.CancelIntent": function () {
        this.emit(':tell', "Goodbye");
    },

    "AMAZON.HelpIntent" : function () {
        var speechText = "Here are somethings you can say: ";
        speechText += " Get Best rate for my ride.";
        speechText += " Check rate for my travel.";
        speechText += " Who offers good rate ?";

        this.emit(':ask', speechText, speechText);
        
    },

    "Unhandled" : function () {
        var speechText = `Sorry, I didn\'t get that`;
        var repromptText = `For instructions on what you can say, please say help me.`;

        this.emit(':ask', speechText, repromptText);

    },    

    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
            this.attributes['source'] = "";
            this.attributes['destination'] = "";
            this.attributes['filterby'] = "";
            this.attributes['endLatitude'] = "";
            this.attributes['endLongitude'] = "";
            this.attributes['startLatitude'] = "";
            this.attributes['startLongitude'] = "";
        }

        this.handler.state = states.DESTINATIONMODE;
        this.emit(':ask', `Welcome to ${skillName}. Let's check who offers best rate for you. Where are you heading to?`);
    }
};

//Second Handler after user mention his/her destination
const destinationHandlers = Alexa.CreateStateHandler (states.DESTINATIONMODE, {
    "AMAZON.StopIntent": function () {
        this.emit(':tell', "Goodbye");
    },
 
    "AMAZON.CancelIntent": function () {
        this.emit(':tell', "Goodbye");
    },

    "AMAZON.HelpIntent" : function () {
        var speechText = "Here are somethings you can say: ";
        speechText += " Get Best rate for my ride.";
        speechText += " Check rate for my travel.";
        speechText += " Who offers good rate ?";

        this.emit(':ask', speechText, speechText);
        
    },

    "Unhandled" : function () {
        var speechText = `Sorry, I didn\'t get that`;
        var repromptText = `For instructions on what you can say, please say help me.`;

        this.emit(':ask', speechText, repromptText);

    },    

    //Gets invoked once the users mention their address
    'DestinationIntent' : function () {
        var destinationAddress = this.event.request.intent.slots.destination.value;
        console.log ("Destination Address " + destinationAddress);
        this.attributes['destination'] = destinationAddress;

        this.emit(':ask', `is ${destinationAddress} your destination ?.`);
    },

    //After user confirms, getting the source of user by alexa's location 
    'AMAZON.YesIntent' : function () {
        this.handler.state = states.SOURCEMODE;

        //Getting the destination's latitude & longitude
        var destinationCode = utility.getGeometricCode (this.attributes['destination']);
        destinationCode.then(data => {
            console.log ("Call to get geo code for destination.." + JSON.stringify(data));
            if (data.results.length > 0) {
                console.log ("Before setting lat & long" + JSON.stringify(this.attributes));
                this.attributes['endLatitude'] = data.results[0].geometry.location.lat;
                this.attributes['endLongitude'] = data.results[0].geometry.location.lng;
                console.log ("After setting lat & long" + JSON.stringify(this.attributes));

                //Setting source
                console.log ("getting device Id & AccessToken")  
                var deviceLocation = utility.getAlexaDeviceLocation (this.event.context.System.device.deviceId, 
                    this.event.context.System.apiAccessToken);
                var sourceAddress = "";
                deviceLocation.then(data => {
                    if (data) {
                        console.log ("device is located at " + JSON.stringify(data));
                        sourceAddress = `${data.addressLine1}, ${data.city}, ${data.stateOrRegion}, ${data.postalCode}`;
                        this.attributes['source'] = sourceAddress;
                        this.emit(':ask', `Great. Is ${sourceAddress} your source Address ?`); 
                    } else {
                        speechText = "Not able to retrive your source address. You can say, my source address is ";
                        this.emit(':ask', speechText)
                    }
                }) 

            } else {
                console.log ("Not able to retrieve the address");
                this.emit(':tell', "There is problem in getting your destination details. Verify your address or Try later");
            }
        })   
        
    },

    //Destination Address captured by Alexa is not good
    'AMAZON.NoIntent' : function () {
        this.handler.state = states.DESTINATIONMODE;
        this.emit(':ask', `My bad. What's your destination address ?`);
    }
})

//To handle the events for source address
const sourceHandlers = Alexa.CreateStateHandler (states.SOURCEMODE, {
    "AMAZON.StopIntent": function () {
        this.emit(':tell', "Goodbye");
    },
 
    "AMAZON.CancelIntent": function () {
        this.emit(':tell', "Goodbye");
    },

    "AMAZON.HelpIntent" : function () {
        var speechText = "Here are somethings you can say: ";
        speechText += " Get Best rate for my ride.";
        speechText += " Check rate for my travel.";
        speechText += " Who offers good rate ?";

        this.emit(':ask', speechText, speechText);
        
    },

    "Unhandled" : function () {
        var speechText = `Sorry, I didn\'t get that`;
        var repromptText = `For instructions on what you can say, please say help me.`;

        this.emit(':ask', speechText, repromptText);

    },    

    'SourceIntent' : function () {
        var sourceAddress = this.event.request.intent.slots.source.value;
        //console.log ("Source Address " + sourceAddress);
        this.attributes['source'] = sourceAddress;

        this.emit(':ask', `Is ${sourceAddress} your point of origin ?`);
    },

    'AMAZON.YesIntent' : function () {
        this.handler.state = states.FILTERBYMODE;

        //Getting the source's latitude & longitude
        var sourceCode = utility.getGeometricCode (this.attributes['source']);
        sourceCode.then(data => {
            console.log ("Call to get geo code for source.." + JSON.stringify(data));
            if (data) {
                console.log ("Before setting lat & long" + JSON.stringify(this.attributes));
                this.attributes['startLatitude'] = data.results[0].geometry.location.lat;
                this.attributes['startLongitude'] = data.results[0].geometry.location.lng;
                console.log ("After setting lat & long" + JSON.stringify(this.attributes));

                this.emit(':ask', `Ok. What kind of Car you would like ? You can say - Standard, Intermediate, Car pool or Luxury`);
            } else {
                console.log ("Not able to retrieve the address");
                this.emit(':tell', "There is problem in getting your destination details. Verify your address or Try later");
            }
        })
    },

    'AMAZON.NoIntent' : function () {
        this.handler.state = states.SOURCEMODE;
        this.emit(':ask', `Ahh !!! What's your source address ? You can say, my source address is `);
    }

})

const filterHandlers = Alexa.CreateStateHandler (states.FILTERBYMODE, {
    "AMAZON.StopIntent": function () {
        this.emit(':tell', "Goodbye");
    },
 
    "AMAZON.CancelIntent": function () {
        this.emit(':tell', "Goodbye");
    },

    "AMAZON.HelpIntent" : function () {
        var speechText = "Here are somethings you can say: ";
        speechText += " Get Best rate for my ride.";
        speechText += " Check rate for my travel.";
        speechText += " Who offers good rate ?";

        this.emit(':ask', speechText, speechText);
        
    },

    "Unhandled" : function () {
        var speechText = `Sorry, I didn\'t get that. You can say - Standard, Intermediate, Car pool or Luxury`;
        var repromptText = `For instructions on what you can say, please say help me.`;

        this.emit(':ask', speechText, repromptText);

    },      

    'FilterIntent' : function () {
        this.attributes['filterby'] = this.event.request.intent.slots.filter.value.toUpperCase();
        console.log ("Filter By Value " + this.attributes['filterby']);
        this.emitWithState("ResultIntent");
    },

    'ResultIntent' : function () {
        console.log ("Final Object " + JSON.stringify(this.attributes));

        var providerList = utility.getProviderList (this.attributes);
        providerList.then(data => {
            if (data.length > 0) {
                console.log("JSON is.." + JSON.stringify(data)); 
                const rideProvider1 = data[0].rideName;
                const rideProvider2 = data[1].rideName;

                var estimate1 = data[0].estimate;
                var estimate2 = data[1].estimate;

                var estimateString1 = estimate1.indexOf("-") != -1 ? `between ${estimate1.split("-")[0]} and ${estimate1.split("-")[1]} dollars`:`of ${estimate1}`;
                var estimateString2 = estimate2.indexOf("-") != -1 ? `between ${estimate2.split("-")[0]} and ${estimate2.split("-")[1]} dollars`:`of ${estimate2}`;

                const forComparison1 = estimate1.indexOf("-") != -1 ? estimate1.split("-")[0].replace("$", "") : estimate1.replace("$", "");
                const forComparison2 = estimate2.indexOf("-") != -1 ? estimate2.split("-")[0].replace("$", "") : estimate2.replace("$", "");

                var bestProvider = "";

                console.log (`${rideProvider1}, provides the rate of ${forComparison1} `);
                console.log (`${rideProvider2}, provides the rate of ${forComparison2} `);

                if (parseInt(forComparison1) > parseInt(forComparison2)) {
                    bestProvider = `From comparison, ${rideProvider2} provides best rate over ${rideProvider1}` 
                } else {
                    bestProvider = `From comparison, ${rideProvider1} provides best rate over ${rideProvider2}`
                }

                console.log ("Best Provider -> " + bestProvider);

                var resultSummaryForSpeech = `For your ride, ${rideProvider1} provided an estimate ${estimateString1}. Whereas ${rideProvider2} provided an estimate ${estimateString2}`
                var finalResultForSpeech = `${resultSummaryForSpeech}. ${bestProvider}. To get the accurate price, please refer the actual application by service proviver.`;

                var resultSummaryForCard = `For your ride to ${this.attributes['destination']} ${rideProvider1} provided an estimate ${estimateString1}. Whereas ${rideProvider2} provided an estimate ${estimateString2}`
                var finalResultForCard = `${resultSummaryForCard}. ${bestProvider}. To get the accurate price, please refer the actual application by service proviver.`;

                console.log ("This is the final result " + finalResultForSpeech)
                this.emit(':tellWithCard', finalResultForSpeech, 'Ride Comparison', finalResultForCard);
            } else {
                console.log ("Not able to get summarized list of details from all providers");
                this.emit(':tell', 'Sorry, there is an error in getting the information')
            }
        }, error => {
            console.log ("Got error when tried to get the ride between given location");
            this.emit(':tell', 'We are not able to find the ride between these location. Please call any of your prefered service providers directly')
        })
    }
})


exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, 
        destinationHandlers, sourceHandlers, filterHandlers);
    alexa.execute();
};