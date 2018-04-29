var CONSTANTS = require ('../constants');

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

        this.handler.state = CONSTANTS.STATES.DESTINATIONMODE;
        
        this.emit(':ask', `Welcome to ${CONSTANTS.SKILL_NAME}. Let's check who offers best rate for you. Where are you heading to?`);
    }
};

module.exports = {
    handler : newSessionHandlers
}