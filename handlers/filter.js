var Alexa = require ('alexa-sdk');

var utility = require('../utility');
var CONSTANTS = require ('../constants');

const filterHandlers = Alexa.CreateStateHandler (CONSTANTS.STATES.FILTERBYMODE, {
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

module.exports = {
    handler : filterHandlers
}