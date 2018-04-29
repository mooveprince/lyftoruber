var rp = require ('request-promise');

var getAlexaDeviceLocation = function (deviceId, accessToken) {

    console.log ("Getting alexa location for Device " + deviceId)
    console.log ("Getting alexa location for Access Token " + deviceId)

    const alexaLocationReqObj = {
        url : `https://api.amazonalexa.com/v1/devices/${deviceId}/settings/address`,
        headers :  {
            "Authorization" : `Bearer ${accessToken}`
        }
    }

    return rp (alexaLocationReqObj)
    .then (function (deviceLocation) {
        return JSON.parse(deviceLocation);
    })
    .catch (err => {console.log ("Error in calling the servie " + err); return false});

}

var getGeometricCode = function (address) {
    const geoKey = process.env.GEO_KEY;
    const baseUrl = process.env.GEO_BASE_URL;
    const geoCodeRequestObj = {
        url:`${baseUrl}${address}&key=${geoKey}`
    }

    return rp (geoCodeRequestObj)
    .then (function (geoResponse) {
        return JSON.parse(geoResponse);
    })
    .catch (err => {console.log ("Error in calling the service + err"); return false})
}

var getUberRate = function (addressDetails) {
    const baseUrl = process.env.UBER_BASE_URL;

    const uberRateRequestObj = {
        url:`${baseUrl}&start_latitude=${addressDetails.startLatitude}&start_longitude=${addressDetails.startLongitude}&end_latitude=${addressDetails.endLatitude}&end_longitude=${addressDetails.endLongitude}&filter_by=${addressDetails.filterby}`
    }

    return rp (uberRateRequestObj)
    .then(function (uberResponse) {
        return JSON.parse(uberResponse)
    }, function (error) {
        console.log ("Error in getting uber rate " +error)
        throw new Error (error)
    })
    //.catch (err => {console.log ("Error in calling Uber service " + err); return false})
}

var getLyftRate = function (addressDetails) {
    const baseUrl = process.env.LYFT_BASE_URL;

    const lyftRateRequestObj = {
        url:`${baseUrl}&start_latitude=${addressDetails.startLatitude}&start_longitude=${addressDetails.startLongitude}&end_latitude=${addressDetails.endLatitude}&end_longitude=${addressDetails.endLongitude}&filter_by=${addressDetails.filterby}`
    }

    console.log ("Final URL is " + lyftRateRequestObj.url)

    return rp (lyftRateRequestObj)
    .then(function (lyftResponse) {
        return JSON.parse(lyftResponse)
    })
    .catch (err => {console.log ("Error in calling Lyft service " + err); return false})
}

var getProviderList = function (addressDetails) {

    return new Promise (function (resolve, reject) {
        var providerList = []; 
        //Getting Uber   
         getUberRate(addressDetails).then(function (uberResponse) {
            if (uberResponse.errorDescription) {
                console.log ("Not got response from Uber");
                //Under assumption, if UBER doesnt returns the data, then Lyft won't too
                reject (Error("We are not able to find the ride between these location. Please call any of the service providers directly"));    
            } else {
                providerList.push(uberResponse);
            } 
            //Getting Lyft
            getLyftRate(addressDetails).then(function (lyftResponse) {
                providerList.push(lyftResponse);
    
                if (providerList.length > 0) {
                    resolve(providerList);
                } else {
                    reject (Error("We are not able to find the ride between these location. Please call any of the service providers directly"));   
                }            
            })            
        }, function (errorResponse) {
            console.log ("Error in getting provider list " + errorResponse);
            reject (Error("We are not able to find the ride between these location. Please call any of the service providers directly"));   
        })


    });

    return providerList;
    
}

module.exports = {
    getAlexaDeviceLocation : getAlexaDeviceLocation,
    getGeometricCode : getGeometricCode,
    getUberRate : getUberRate,
    getLyftRate : getLyftRate,
    getProviderList: getProviderList
};