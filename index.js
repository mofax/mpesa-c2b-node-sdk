let client = require('./tools/client');
let func = require('./tools/func');

module.exports = (function () {
    let conf = null;

    return {
        setUp(mpesaEndpoint, merchantId, passkey) {
            let settings = {
                mpesaEndpoint,
                merchantId,
                passkey
            };

            conf = settings;
        },

        checkoutRequest(body) {
            if (conf === null) {
                throw new Error('call setUp first to provied merchantID and passkey');
            }

            let header = func.getMpesaCheckoutHeader(conf.merchantId, conf.passkey, new Date());
            let headerString = func.compileHeader(header);

            // the header generator also generate the timestamp
            body.timestamp = header.timestamp;

            let bodyString = func.compileBody(body);

            let rq = func.compileCheckoutRequest(headerString, bodyString);

            return client.doPost(conf.mpesaEndpoint, rq)
                .then(data => {
                    let unpack = func.unpackSafcomResponse(data);
                    return { data: unpack };
                });
        },

        confirmCheckout(body) {
            if (conf === null) {
                throw new Error('call setUp first to provied merchantID and passkey');
            }

            let header = func.getMpesaCheckoutHeader(conf.merchantID, conf.passkey, new Date());
            let headerString = func.compileHeader(header);


            body.timestamp = header.timestamp;
            let bodyString = func.compileBody(body);

            let rq = func.compileConfirmCheckoutRequest(headerString, bodyString);

            client.doPost(conf.mpesaEndpoint, rq)
                .then(data => {
                    let unpack = func.unpackSafcomResponse(data);
                    return { data: unpack };
                });
        }
    };

})();
