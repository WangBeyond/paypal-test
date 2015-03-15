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
  var payment = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "redirect_urls": {
    "return_url": "https://localhost:8000/confirm",
    "cancel_url": "https://localhost:8000/cancel"
  },
  "transactions": [{
    "amount": {
      "total": "1.00",
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
	    res.redirect(redirectUrl);
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
      res.send("Hell yeah!");
    }
  });
};

router.cancel = function(req, res){
  res.send("The payment got canceled");
};


module.exports = router;
