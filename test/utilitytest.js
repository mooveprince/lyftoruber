var expect = require( 'chai' ).expect;
var utility = require('../utility');

describe ('geocodeapi', function () {
    it ('should return geo API', function () {
        return utility.getGeometricCode("10 FedEx Parkway, Collierville, TN").then(function (data) {
            expect( data.results[0].geometry.location.lat).to.be.equal(35.03224060000001);
            expect( data.results[0].geometry.location.lng).to.be.equal(-89.7222456);
        });
        
    })
})

describe ('getlyftrate', function () {
    it ('should return rate for Lyft', function () {
        var address = {
            "startLatitude": 28.0819002,
            "destination": "Tampa airport",
            "endLongitude": -82.5370781,
            "STATE": "_FILTERBYMODE",
            "source": "14620 Grenadine Dr, Tampa, FL, 33613",
            "filterby": "INTERMEDIATE",
            "startLongitude": -82.4106486,
            "endLatitude": 27.9834776 
        }
        return utility.getLyftRate(address).then(function (data) {
            console.log (JSON.stringify(data));
            expect( data.rideName).to.be.equal('Lyft Plus');
            expect( data.rideName).not.to.be.null;
        });
        
    })
})

describe ('getuberrate', function () {
    it ('should return rate for Uber', function () {
        var address = {
            "startLatitude": 28.0819002,
            "destination": "Tampa airport",
            "endLongitude": -82.5370781,
            "STATE": "_FILTERBYMODE",
            "source": "14620 Grenadine Dr, Tampa, FL, 33613",
            "filterby": "STANDARD",
            "startLongitude": -82.4106486,
            "endLatitude": 27.9834776 
        }
        return utility.getUberRate(address).then(function (data) {
            console.log (JSON.stringify(data));
            expect( data.rideName).to.be.equal('uberX');
            expect( data.rideName).not.to.be.null;
        });
        
    })
   
})

describe('listOfproviders', function () {
    it ('should return array of values', function () {
        var address = {
            "startLatitude": 28.0819002,
            "destination": "Tampa airport",
            "endLongitude": -82.5370781,
            "STATE": "_FILTERBYMODE",
            "source": "14620 Grenadine Dr, Tampa, FL, 33613",
            "filterby": "STANDARD",
            "startLongitude": -82.4106486,
            "endLatitude": 27.9834776 
        }

        return utility.getProviderList(address).then(function(data) {
            console.log (JSON.stringify(data));
            expect( data).not.to.be.null;
            expect( data.length).to.be.equal(2);
        })
    })

    it ('should return Service not offered', function () {
        var address = {
            "startLatitude": 47.4502499,
            "startLongitude": -122.3088165,
            "destination": "Tampa airport",
            "STATE": "_FILTERBYMODE",
            "source": "14620 Grenadine Dr, Tampa, FL, 33613",
            "filterby": "STANDARD",
            "endLongitude": -82.5370781,
            "endLatitude": 27.9834776 
        }
        return utility.getProviderList(address).then(function (data) {
            console.log ("Data " + JSON.stringify(data));
        }, function (error) {
            expect(error).not.to.be.null;
        });
        
    })

})



