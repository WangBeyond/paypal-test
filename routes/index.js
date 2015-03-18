var express = require('express');
var router = express.Router();
var config = {};
var paypal = require('paypal-rest-sdk');

/* GET home page. */

router.get('/confirm', function(req, res){
	res.render('confirm');
})

router.get('/cancel', function(req, res) {
	res.render('cancel');
})

router.get('/', function(req, res) {
  	res.render('index');
});


router.init = function(c){
	config = c;
  	paypal.configure(c.api);
};

router.create = function(req, res){
	console.log(req.param("amount"));
	var payment = {
	  "intent": "sale",
	  "payer": {
	    "payment_method": "paypal"
	  },
	  "redirect_urls": {
	    "return_url": "http://yoururl.com/execute",
	    "cancel_url": "http://yoururl.com/cancel"
	  },
	  "transactions": [{
	    "amount": {
	      "total": req.param("amount"),
	      "currency": "USD"
	    },
	    "description": "My awesome payment"
	  }]
	};

  paypal.payment.create(payment, function (error, payment) {
    if (error) {
      console.log(error);
    } else {
	    if(payment.payer.payment_method === 'paypal') {
	    req.session.paymentId = payment.id;
	    var redirectUrl;


	    for(var i=0; i < payment.links.length; i++) {
	      var link = payment.links[i];
	      if (link.method === 'REDIRECT') {
	        redirectUrl = link.href;
	      }
	    }
	    console.log(4);


	    var paymentDetails = JSON.stringify(payment, null, 2);
	    res.redirect(redirectUrl);
	    // res.render('create', {paymentDetail: paymentDetail, redirectUrl: redirectUrl})
    }
    }   
  });
};

router.execute = function(req, res){
  var paymentId = req.session.paymentId;
  var payerId = req.param('PayerID');
 
  var details = { "payer_id": payerId };
  paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      console.log(error);
    } else {
      res.render('execute', { 'payment': payment });
    }
  });
};

router.cancel = function(req, res){
  res.send("The payment got canceled");
};


module.exports = router;
