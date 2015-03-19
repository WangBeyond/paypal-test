var myUrl = "https://hidden-sierra-5365.herokuapp.com";

var express = require('express');
var router = express.Router();
var config = {};
var paypal = require('paypal-rest-sdk');

var test = true;

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
	console.log("21");
	console.log(req.param("amount"));
	var payment = {
	  "intent": "sale",
	  "payer": {
	    "payment_method": "paypal"
	  },
	  "redirect_urls": {
	    "return_url": myUrl + "/execute",
	    "cancel_url": myUrl + "/cancel"
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
	    // res.redirect(redirectUrl);
	    res.render('create', {paymentDetail: JSON.stringify(payment), redirectUrl: redirectUrl})
    }
    }   
  });
};

router.execute = function(req, res){
  var paymentId = req.session.paymentId;
  var payerId = req.param('PayerID');

  // paymentId = "PAY-6VW115572K7473016KUEZZMY";
  // payerId = "845SF6UBGGWL8";

  if(test){
  	console.log(paymentId);
  	console.log(payerId);
  }
 
  var details = { "payer_id": payerId };
  	console.log(0);

  paypal.payment.execute(paymentId, details, function (error, payment) {
  	console.log(1);
    if (error) {
    	// res.send(paymentId + " "+ payerId);
    	res.render('error', {
            message: err.message,
            error: err
        });
    } else {
  	console.log(2);

      res.render('execute', { paymentDetail: payment });
    }
  });
};

router.cancel = function(req, res){
  res.send("The payment got canceled");
};


module.exports = router;
