var Alexa = require ('alexa-sdk');

const skillName = "Lyft or Uber";

const states = {
    STARTMODE: '_STARTMODE', // Prompt the user to start the skill.
    DESTINATIONMODE: '_DESTINATIONMODE', // User is trying to get the rate.
    SOURCEMODE: '_SOURCEMODE',
    FILTERBYMODE: '_FILTERBYMODE'
};

const newSessionHandlers = {
    "AMAZON.StopIntent": function () {
        this.emit(':tell', "Goodbye");
    },
 
    "AMAZON.CancelIntent": function () {
        this.emit(':tell', "Goodbye");
    },

    "AMAZON.HelpIntent" : function () {
        var speechText = "Here are somethings you can say: ";
        speechText += " Get Best rate for my trip.";
        speechText += " Check rate for my travel.";
        speechText += " Who offers good rate. Lyft or Uber ?";

        this.emit(':ask', speechText, speechText);
        
    },

    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
            this.attributes['source'] = "";
            this.attributes['destination'] = "";
            this.attributes['filterby'] = "";
        }
        this.handler.state = states.STARTMODE;
        this.emit(':ask', `Welcome to ${skillName}. Would you like to check the best offer for your destination ?`, 'Say yes to check or no to quit.');
    }
};

const startHandlers = Alexa.CreateStateHandler (states.STARTMODE, {
    'AMAZON.YesIntent': function() {
        this.handler.state = states.DESTINATIONMODE;
        this.emit(':ask', `Great. What's your destination address ?`);
    },

    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Ok, see you next time!');
    }    
})

const destinationHandlers = Alexa.CreateStateHandler (states.DESTINATIONMODE, {
    'DestinationIntent' : function () {
        this.attributes['destination'] = this.event.request.intent.slots.destination.value;
        console.log ("Destination Address " + this.attributes['destination']);

        this.handler.state = states.SOURCEMODE;
        this.emit(':ask', `Ok. What's your source address ?`);
    }
})

const sourceHandlers = Alexa.CreateStateHandler (states.SOURCEMODE, {
    'SourceIntent' : function () {
        this.attributes['source'] = this.event.request.intent.slots.source.value;
        console.log ("Source Address " + this.attributes['source']);

        this.handler.state = states.FILTERBYMODE;
        this.emit(':ask', `Ok. What kind of Car you would like ?. You can say - Standard, Intermediate, Car pool or Luxury`);
    }
})

const filterHandlers = Alexa.CreateStateHandler (states.FILTERBYMODE, {
    'filterIntent' : function () {
        this.attributes['filterby'] = this.event.request.intent.slots.filter.value;
        console.log ("Filter By Value" + this.attributes['filterby']);
        this.emitWithState("resultIntent");
    },

    'resultIntent' : function () {
        //this.handler.state = states.STARTMODE;

        this.emit(':tell', 'This will be the best choice for you');
    }
})


exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, 
        startHandlers, destinationHandlers, sourceHandlers, filterHandlers);
    alexa.execute();
};