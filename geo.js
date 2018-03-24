const NodeGeocoder = require('node-geocoder');
const async = require('async');
const config = require('./config.json');
const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: config.mapquest_api_key,
};

const geocoder = NodeGeocoder(options);
geocoder.geocode('29 champs elysée paris')
    .then(function (res) {
        console.log(res);
    })
    .catch(function (err) {
        console.log(err);
    });

exports.geocodeEvents = function (hackathons) {
    return new Promise((resolve, reject) => {
        async.forEachOf(hackathons, (value, key, cb) => {
            if (hackathons[key].address) {
                geocoder.geocode(hackathons[key].address, function (err, res) {
                    hackathons[key].location = res[0];
                    cb();
                });
            } else {
                cb();
            }
        }, () => {
            resolve();
        });
    });
}
