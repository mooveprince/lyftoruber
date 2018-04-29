var expect = require('chai').expect;
var index = require('../index');
 
const context = require('aws-lambda-mock-context');
const ctx = context();

describe ("Testing a session with SourceIntent", function () {
    var speechResponse = null
    var speechError = null

    before (function (done) {
        index.handler ({
            "session": {
                "new": false,
                "sessionId": "1234",
                "attributes": {"source": '', "destination": '10 FedEx Parkway, Collierville, TN', "filterby": '', "STATE": '_SOURCEMODE' },
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
                    "name": "SourceIntent",
                    "slots": {
                        "source" : {
                            "name" : "source",
                            "value": "2491 Winchester Rd, Memphis, TN"
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
                    "deviceId": "amzn1.ask.device.AF4HZWK4NKW6XUWOPEZWBQL3PUEZBQLTVVZAQ4IMHO4M3IJW6FHOJR4GI4WYDAREAE7RUSFNZEP4BOU7VXAELMEEXYTNSNOEKSZDFKNWKPEOAOIGEUVA7YTVPN5AOWUKCND3CTA55U7J4PRWDVYY2NQOX5TQ",
				    "supportedInterfaces": {
					"AudioPlayer": {},
					"Display": {
						"templateVersion": "1.0",
						"markupVersion": "1.0"
					}
				}
                  },
                  "apiAccessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJodHRwczovL2FwaS5hbWF6b25hbGV4YS5jb20iLCJpc3MiOiJBbGV4YVNraWxsS2l0Iiwic3ViIjoiYW16bjEuYXNrLnNraWxsLjEzNTBhMzBmLTRjOGMtNDg4My1hMzI0LTc1NWM4NjhkZDNlYiIsImV4cCI6MTUxNzQ4NzY0MiwiaWF0IjoxNTE3NDg0MDQyLCJuYmYiOjE1MTc0ODQwNDIsInByaXZhdGVDbGFpbXMiOnsiY29uc2VudFRva2VuIjpudWxsLCJkZXZpY2VJZCI6ImFtem4xLmFzay5kZXZpY2UuQUY0SFpXSzROS1c2WFVXT1BFWldCUUwzUFVFWkJRTFRWVlpBUTRJTUhPNE0zSUpXNkZIT0pSNEdJNFdZREFSRUFFN1JVU0ZOWkVQNEJPVTdWWEFFTE1FRVhZVE5TTk9FS1NaREZLTldLUEVPQU9JR0VVVkE3WVRWUE41QU9XVUtDTkQzQ1RBNTVVN0o0UFJXRFZZWTJOUU9YNVRRIiwidXNlcklkIjoiYW16bjEuYXNrLmFjY291bnQuQUVRM1ZYVzVMQVpVQzRPTU5UWFRTWldHUVpJV0hDVElCQ05IN040QUJQQTdJSVY3R0FXTk41UTdRWFRVTzRPUVNHT1NZRVI3VDMzUURBSUw1SUhFS1VCREJZSVpIVU9DMlhYRktSSlRHNVNOWUJYN1pCS1FJNURPUFlHT1dTRTIzSUhYUVFONkdYM04yWkVKUFcyQUZNQkxUQlVXQlFIUDc2SEdVQ0IzUk9QNEhCN1FVWkM3WlJJWUIyTlFGTFJXV0lVWFpUQzY2T0Y1NTVRIn19.BmfZqv_BQbKOpy6BJ2Ht7DS3yhA60FvDSP4E69-IW2SuC_zEPSIxhbewNL6smtPQk5JbkrNdhQAwUULalZDHr7keLRr8uTM_MqVciK0YuSC502wmH-D67ZoSs3AprursAYmZxtFCC1W8QqYJEXMp54RgbVu2vzK2g-vKGcYecJVml1MsOXsADQss17UdIz6eRO8m-ZiaMPZHvOs7LqEc4o4VpKSYBLlzp_FNdNia3VuQ_Zd0ZCLQp7z7eF7ttcAH5oeCzmCu2CWOyndW-4tNXWYJRdE2URVgDWraOxYXy0bJtjdkXxHwYWFmX9wNiIH4WXZ9R5VbXs1coNTHvW6XJQ",
                  "application": {
                    "applicationId": "amzn1.ask.skill.[unique-value-here]"
                  },
                  "user": {
                    "userId": "amzn1.ask.account.AEQ3VXW5LAZUC4OMNTXTSZWGQZIWHCTIBCNH7N4ABPA7IIV7GAWNN5Q7QXTUO4OQSGOSYER7T33QDAIL5IHEKUBDBYIZHUOC2XXFKRJTG5SNYBX7ZBKQI5DOPYGOWSE23IHXQQN6GX3N2ZEJPW2AFMBLTBUWBQHP76HGUCB3ROP4HB7QUZC7ZRIYB2NQFLRWWIUXZTC66OF555Q"
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
          expect(speechResponse.response.shouldEndSession).to.be.false
      })

  })
}) 