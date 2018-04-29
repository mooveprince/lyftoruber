var Alexa = require ('alexa-sdk');

var utility = require('../utility');
var CONSTANTS = require ('../constants');

//Handler after user mention his/her destination
const destinationHandlers = Alexa.CreateStateHandler (CONSTANTS.STATES.DESTINATIONMODE, {
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
        this.handler.state = CONSTANTS.STATES.SOURCEMODE;

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
        this.handler.state = CONSTANTS.STATES.DESTINATIONMODE;
        this.emit(':ask', `My bad. What's your destination address ?`);
    }
})

module.exports = {
    handler : destinationHandlers
}