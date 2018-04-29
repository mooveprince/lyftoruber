var expect = require('chai').expect;
var index = require('../index');
 
const context = require('aws-lambda-mock-context');
const ctx = context();

describe ("Testing a session with FilterIntent", function () {
    var speechResponse = null
    var speechError = null

    before (function (done) {
        index.handler ({
            "session": {
                "new": false,
                "sessionId": "1234",
                "attributes": {
                    "source": '2491 Winchester Rd, Memphis, TN', 
                    "startLatitude" : '28.0819002',
                    "startLongitude" : "-82.4106486",
                    "destination": '10 FedEx Parkway, Collierville, TN', 
                    "endLongitude" : '-82.5370781',
                    "endLatitude" : '27.9834776',
                    "filterby": '', "STATE": '_FILTERBYMODE' },
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
                    "name": "FilterIntent",
                    "slots": {
                        "filter" : {
                            "name" : "filter",
                            "value": "STANDARD"
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

    describe("The response is structurally correct for Alexa Speech Services", function() {

      it('should not have errored',function() {
          expect(speechError).to.be.null
      })

      it('should have a version', function() {
          expect(speechResponse.version).not.to.be.null
      })

      it('should have a speechlet response', function() {
          expect(speechResponse.response).not.to.be.null
          console.log (speechResponse);
      })

      it('should have session attributes', function() {
          expect(speechResponse.response.sessionAttributes).not.to.be.null
      })          

      it("should have a spoken response", () => {
          expect(speechResponse.response.outputSpeech).not.to.be.null
      })

      it("should have session remain open", function() {
          expect(speechResponse.response.shouldEndSession).not.to.be.null
          expect(speechResponse.response.shouldEndSession).to.be.true
      })

  })
}) 