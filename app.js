var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var session = require('express-session');

var routes = require('./routes/index');
var checkout = require('./routes/checkout');

var app = express();

try {
  var configJSON = fs.readFileSync("./config.json");
  var config = JSON.parse(configJSON.toString());
} catch (e) {
  console.error("File config.json not found or is invalid: " + e.message);
  process.exit(1);
}

routes.init(config);

app.set('port', process.env.PORT || 8000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'keyboard'}));

app.use('/', routes);
app.post('/create', routes.create);
app.post('/execute', routes.execute);
app.get('/cancel', routes.cancel);
app.get('/execute', function(req, res){
    var payment_detail = JSON.stringify(payment, null, 2);
    res.render('execute', {payment_detail: payment_detail});
});


// app.get('/execute', function()res.render('confirm'));
// app.use('/checkout', checkout);s

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(app.get('port'), function(){
    process.setMaxListeners(0);
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
