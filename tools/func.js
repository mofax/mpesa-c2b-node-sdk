'use strict';

let crypto = require('crypto');
let moment = require('moment');
let jxon = require('jxon');

let tools = {
    getMpesaCheckoutHeader(merchanID, passkey, date) {
        let timestamp = moment(date).format('YYYYMMDDHHmmss');
        let concat = merchanID.toString() + passkey + timestamp;
        let password = crypto.createHash('sha256')
            .update(concat)
            .digest()
            .toString('hex');

        return {
            'merchant_id': merchanID,
            'password': Buffer.from(password).toString('base64'),
            'timestamp': timestamp
        };
    },

    compileHeader(header) {
        let text = `<MERCHANT_ID>${header.merchant_id}</MERCHANT_ID><PASSWORD>${header.password}</PASSWORD><TIMESTAMP>${header.timestamp}</TIMESTAMP>`;

        return text;
    },

    compileBody(body) {
        let keys = Object.keys(body);
        let elems = keys.map(key => {
            return `<${key.toUpperCase()}>${body[key]}</${key.toUpperCase()}>`;
        });

        return elems.join('');
    },

    compileCheckoutRequest(headerString, bodyString) {
        let xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
        let text = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="tns:ns">
<soapenv:Header>
<tns:CheckOutHeader>
${headerString}
</tns:CheckOutHeader>
</soapenv:Header>
<soapenv:Body>
<tns:processCheckOutRequest>
${bodyString}
</tns:processCheckOutRequest>
</soapenv:Body>
</soapenv:Envelope>`;

        let _text = text.replace(/(\r\n|\n|\r)/gm, "");
        return _text;
    },

    compileConfirmCheckoutRequest(headerString, bodyString) {
        let text = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="tns:ns">
<soapenv:Header>
<tns:CheckOutHeader>
${headerString}
</tns:CheckOutHeader>
</soapenv:Header>
<soapenv:Body>
<tns:transactionConfirmRequest>
${bodyString}
</tns:transactionConfirmRequest>
</soapenv:Body>
</soapenv:Envelope>`;

        let _text = text.replace(/(\r\n|\n|\r)/gm, "");
        return _text;
    },

    unpackSafcomResponse(data) {

        let xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
        let _data = data.replace(xmlHeader, '');
        return jxon.stringToJs(_data)["SOAP-ENV:Envelope"]["SOAP-ENV:Body"];
    }
};

module.exports = tools;