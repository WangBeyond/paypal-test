
var username = '928744478-facilitator_api1.qq.com'
var password = '5F3NN6K94FV5S9WP';
var signature = 'AAJzrrFvoJr7KLRdY8sSfVyW9UXhAY4inorVEME4GfSJEx22ubPN6z6p';
var returnUrl = 'https://localhost:8000/confirm';
var cancelUrl = 'https://localhost:8000/cancel';
var paypal = require('paypal-express-checkout').init(username, password, signature, 'return url', 'cancel url');

// debug = optional, default false
// paypal.pay('Invoice nubmer', amout, 'description', 'currency', callback);
// checkout

paypal.pay('20130001', 123.23, 'iPad', 'EUR', function(err, url) {

    if (err) {
        console.log(err);
        return;
    }

    // redirect to paypal webpage
    response.redirect(url);
});

// result in GET method
// paypal.detail('token', 'PayerID', callback);
// or
// paypal.detail(partialjs.controller, callback);

paypal.detail('EC-788441863R616634K', '9TM892TKTDWCE', function(err, data, invoiceNumber, price) {

    if (err) {
        console.log(err);
        return;
    }

    /*
    data (object) =
    { TOKEN: 'EC-35S39602J3144082X',
      TIMESTAMP: '2013-01-27T08:47:50Z',
      CORRELATIONID: 'e51b76c4b3dc1',
      ACK: 'Success',
      VERSION: '52.0',
      BUILD: '4181146',
      TRANSACTIONID: '87S10228Y4778651P',
      TRANSACTIONTYPE: 'expresscheckout',
      PAYMENTTYPE: 'instant',
      ORDERTIME: '2013-01-27T08:47:49Z',
      AMT: '10.00',
      TAXAMT: '0.00',
      CURRENCYCODE: 'EUR',
      PAYMENTSTATUS: 'Pending',
      PENDINGREASON: 'multicurrency',
      REASONCODE: 'None' };
    */
});