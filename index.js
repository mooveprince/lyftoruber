var Alexa = require ('alexa-sdk');

var utility = require('./utility');

var newSession = require('./handlers/newsession');
var destination = require('./handlers/destination');
var source = require('./handlers/source');
var filter = require('./handlers/filter');


exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSession.handler, 
        destination.handler, source.handler, filter.handler);
    alexa.execute();
};