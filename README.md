## Mpesa C2B SDK
Provides and SDK wrapper over the mpesa online checkout api

## Installation
```bash
npm install --save mpesa-c2b
```

## Usage
import the library, run setup, and just call the methods

```javascript
let c2b = require('mpesa-c2b');

// before you can make any api calls, you have to call setUp
// with the endpoint, merchantid, and passkey

let setup = {
    endpoint: 'https://safaricom.co.ke/mpesa_online/lnmo_checkout_server.php?wsdl',
    merchantid: 898876, // paybill provided by safaricom
    passkey: '1d4e1d065acb7d540872e3868412c35058d539a0' // passkey provided by safaricom
}

// call c2b.setUp with the set up information
c2b.setUp(setup.endpoint, setup.merchantid, setup.passkey);

// to use the online checkout api
// you need to make two calls
//
// `c2b.checkoutRequest` set's up the request, and returns a transactionId
// `c2b.confirmCheckout` takes the transactionId, and completes the request

// For Example
let rq = {
    merchant_transaction_id: "1099348873",
    reference_id: "XGDBHHNJSK",
    amount: "10.00",
    msisdn: "254711509060",
    call_back_method: "get",
    call_back_url:"http://ewvdbjymjd.localtunnel.me/oc/ipn"
};

c2b.checkoutRequest(rq).then(r => {
    let trx_id = r.data.response.trx_id;
    // to something with the trxid... like saving to db
    
    // confirm checkout to complete the request
    return c2b.confirmCheckout({ trx_id }).then(r => {
        // logTodb(r, 'transaction complete')
    });
}).catch(err => {
    console.error(err);
})

```

And that's it, so easy to use...!!! *BUT* 
** Remember to have a working callback url **