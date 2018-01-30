var Alexa = require ('alexa-sdk');

const skillName = "Lyft or Uber";

const states = {
    STARTMODE: '_STARTMODE', // Prompt the user to start the skill.
    DESTINATIONMODE: '_DESTINATIONMODE', // User is trying to get the rate.
    SOURCEMODE: '_SOURCEMODE',
    FILTERBYMODE: '_FILTERBYMODE'
};

const newSessionHandlers = {
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
            this.attributes['source'] = "";
            this.attributes['destination'] = "";
            this.attributes['filterby'] = "";
        }
        this.handler.state = states.STARTMODE;
        this.response.speak(`Welcome to ${skillName}. Would you like to check the rate for your destination ?`)
                    .listen('Say yes to check or no to quit.');
        this.emit(':responseReady');
    }
};

const startHandlers = Alexa.CreateStateHandler (states.STARTMODE, {
    'AMAZON.YesIntent': function() {
        this.handler.state = states.DESTINATIONMODE;
        this.response.speak(`Great. What's your destination address ?`);
        this.emit(':responseReady');
    },

    'AMAZON.NoIntent': function() {
        this.response.speak('Ok, see you next time!');
        this.emit(':responseReady');
    }    
})

const destinationHandlers = Alexa.CreateStateHandler (states.DESTINATIONMODE, {
    'DestinationIntent' : function () {
        this.attributes['destination'] = this.event.request.intent.slots.destination.value;
        console.log ("Destination Address " + this.attributes['destination']);

        this.handler.state = states.SOURCEMODE;
        this.response.speak(`Ok. What's your source address ?`);
        this.emit(':responseReady');
    }
})

const sourceHandlers = Alexa.CreateStateHandler (states.SOURCEMODE, {
    'SourceIntent' : function () {
        this.attributes['source'] = this.event.request.intent.slots.source.value;
        console.log ("Source Address " + this.attributes['source']);

        this.handler.state = states.FILTERBYMODE;
        this.response.speak(`Ok. What kind of Car you would like ?`);
        this.emit(':responseReady');
    }
})

const filterHandlers = Alexa.CreateStateHandler (states.FILTERBYMODE, {
    'filterIntent' : function () {
        this.attributes['filterby'] = this.event.request.intent.slots.filter.value;
        console.log ("Filter By Value" + this.attributes['filterby']);

        this.handler.state = states.FILTERBYMODE;
        this.emit (':tell', 'I found a best rate for you');
    }
})


exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, 
        startHandlers, destinationHandlers, sourceHandlers, filterHandlers);
    alexa.execute();
};