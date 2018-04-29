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
                "attributes": {
                    "destination": "10 FedEx parkway",
                    "STATE": "_DESTINATIONMODE",
                    "source": "",
                    "filterby": ""
                },
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
                    "name": "AMAZON.YesIntent"
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
                  "application": {
                    "applicationId": "amzn1.ask.skill.[unique-value-here]"
                  },
                  "user": {
                    "userId": "amzn1.ask.account.[unique-value-here]"
                  },
                  "apiEndpoint": "https://api.amazonalexa.com",
			      "apiAccessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJodHRwczovL2FwaS5hbWF6b25hbGV4YS5jb20iLCJpc3MiOiJBbGV4YVNraWxsS2l0Iiwic3ViIjoiYW16bjEuYXNrLnNraWxsLjEzNTBhMzBmLTRjOGMtNDg4My1hMzI0LTc1NWM4NjhkZDNlYiIsImV4cCI6MTUxNzU3NTYyMiwiaWF0IjoxNTE3NTcyMDIyLCJuYmYiOjE1MTc1NzIwMjIsInByaXZhdGVDbGFpbXMiOnsiY29uc2VudFRva2VuIjoiQXR6YXxJd0VCSVB6d0l4WHVDdVJFRlgwaVZqTVZON1F5djRwcUpTWUhodWF5YnM3c3VNT0xrTEJsSWkyRjgwTC1wYUFRWEdwTUVxLVp1RDhJclBOTFM4MlJCWkZQY2h1YmhnMGlDOUExZVRXTU5sNEZfRnRJSzcxMV9ieUdJMHh0emU3RndENkVIM09qTUtfZVcyM1BNeEhjMWxFOEI4MXU0aVJoNnZ0eUNOUEpmZnJkRXQwbmRYeXR3QmRTQWFfS0NpZVYyUmRERVgyWFVJbjF1c2ZoWURDeksxUnBPbDBUS0MwbFd5OC12MTgyOVFRMHE3MnBGMTJwTW5QTzdXaU1FSFBjYUVBRjk1MUpQeko2LTBHU3BVVmxZbXh6dzZ4RFRMdHI3OEstdzY4eTFYek9MbWpBSlRmeWpPYkJZTHJjN2R3QjNUYm1pQUlQODcyUERFeEZMazZTTk96akVORExoRWtmTDhBMDZYNS1zSUNTaTkwTWJXNzlCZ0ViRkxrdF90cXZLM254VllGQXRDUlUzR2lyWHJDS2JmMVJOa2NFYkdMUFdJUTBLWmlTRDhKc2JaSVFlX2VxcXhHd2tJRFBtXzQzNk5IVERxWUgwQUhaY3hYTm5jMVl3cDg4bDZrRm55OE41blU5U1RWc2ZjOGtxM2w2TlEiLCJkZXZpY2VJZCI6ImFtem4xLmFzay5kZXZpY2UuQUY0SFpXSzROS1c2WFVXT1BFWldCUUwzUFVFWkJRTFRWVlpBUTRJTUhPNE0zSUpXNkZIT0pSNEdJNFdZREFSRUFFN1JVU0ZOWkVQNEJPVTdWWEFFTE1FRVhZVE5TTk9FS1NaREZLTldLUEVPQU9JR0VVVkE3WVRWUE41QU9XVUtDTkQzQ1RBNTVVN0o0UFJXRFZZWTJOUU9YNVRRIiwidXNlcklkIjoiYW16bjEuYXNrLmFjY291bnQuQUVRM1ZYVzVMQVpVQzRPTU5UWFRTWldHUVpJV0hDVElCQ05IN040QUJQQTdJSVY3R0FXTk41UTdRWFRVTzRPUVNHT1NZRVI3VDMzUURBSUw1SUhFS1VCREJZSVpIVU9DMlhYRktSSlRHNVNOWUJYN1pCS1FJNURPUFlHT1dTRTIzSUhYUVFONkdYM04yWkVKUFcyQUZNQkxUQlVXQlFIUDc2SEdVQ0IzUk9QNEhCN1FVWkM3WlJJWUIyTlFGTFJXV0lVWFpUQzY2T0Y1NTVRIn19.AIogMazgxFsv_4iCQ_TShyKJ_4DMhH8wjfx7sV3wpDM4tQ5Mn5Rcuef15-TIVJCCMP6iVdpu5UNNAOUUJJ78-SRo-hZY12VYR1RDs94k3K8BjG8o0my2oNP05hYoLiv3gNFASE_jAm8RJyVs8jz_DE2UDw8AenpZ9J9ZtjBU0BvYXJoXBhfzDqPGJQq7B2bHHuBIMkYRHRYbg6N75V3qtsD6wgAjrOwG9_TC2zESxYsR3LFQHzi6m1Sn-PZv21VZeu-PkZNUORIwlCaq0F-zuDD7g-zXhJKHidjJR2eMia0xdRUmjdhPubV6B-fMiwSvJq5uLN9YV2lfcoz6lDl5ww"
                }
              }
        }, ctx);
        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("Yes intent under Destination mode triggered", function() {
        it('should have a speechlet response', function() {
            expect(speechResponse.response).not.to.be.null
            console.log (speechResponse);
        })
    })
}) 