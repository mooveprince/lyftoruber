var Alexa = require ('alexa-sdk');

var utility = require('../utility');
var CONSTANTS = require ('../constants');

//To handle the events for source address
const sourceHandlers = Alexa.CreateStateHandler (CONSTANTS.STATES.SOURCEMODE, {
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
        this.handler.state = CONSTANTS.STATES.FILTERBYMODE;

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
        this.handler.state = CONSTANTS.STATES.SOURCEMODE;
        this.emit(':ask', `Ahh !!! What's your source address ? You can say, my source address is `);
    }

})

module.exports = {
    handler : sourceHandlers
}

