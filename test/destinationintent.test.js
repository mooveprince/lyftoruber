var expect = require('chai').expect;
var index = require('../index');
 
const context = require('aws-lambda-mock-context');
const ctx = context();

describe ("Testing a session with DestinationIntent", function () {
    var speechResponse = null
    var speechError = null

    before (function (done) {
        index.handler ({
            "session": {
                "new": false,
                "sessionId": "1234",
                "attributes": {"source": '', "destination": '', "filterby": '', "STATE": '_DESTINATIONMODE' },
                "user": {
                  "userId": "amzn1.ask.account.[unique-value-here]"
                },
                "application": {
                  "applicationId": "amzn1.ask.skill.[unique-value-here]"
                }
              },
              "version": "1.0",
              "request": {
                "locale": "en-US",
                "timestamp": "2016-10-27T18:21:44Z",
                "type": "IntentRequest",
                "requestId": "amzn1.echo-api.request.[unique-value-here]",
                "intent": {
                    "name": "DestinationIntent",
                    "slots": {
                        "destination" : {
                            "name" : "destination",
                            "value": "10 FedEx Parkway, Collierville, TN"
                        }
                    }
                }
              },
              "context": {
                "AudioPlayer": {
                  "playerActivity": "IDLE"
                },
                "System": {
                  "device": {
                    "supportedInterfaces": {
                      "AudioPlayer": {}
                    }
                  },
                  "application": {
                    "applicationId": "amzn1.ask.skill.[unique-value-here]"
                  },
                  "user": {
                    "userId": "amzn1.ask.account.[unique-value-here]"
                  }
                }
              }
        }, ctx);
        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("Destination mode triggered", function() {
        it('should have a speechlet response', function() {
            expect(speechResponse.response).not.to.be.null
            console.log (speechResponse);
        })
    })
}) 