'use strict';

let request = require('request');

let client = {
    /**
     * doPost - Makes a http POST request over the network
     * 
     * @param url {string} - the url to which we are making the request
     * @param data {{}} - the object to be sent as JSON body
     * 
     * @returns requestPromise {Promise} - A promise that resolves on success
     */
    doPost(url, data) {
        let options = {
            "rejectUnauthorized": false,
            headers: {
                'content-type': 'application/xml; charset=utf-8',
            },
            url: url,
            method: 'POST',
            body: data
        };

        return new Promise((resolve, reject) => {
            request(options, function (err, response, body) {
                if (err) { reject(err); return; }

                resolve(body);
            });
        });

    }
};

module.exports = client;