require('dotenv').config();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportJWTStrategy = require('./api/strategies/passwortJWTStrategy');
var front_router = require('./routes/front_router');
var auth = require('./api/routes/auth');
var admin = require('./api/routes/admin');
var referrals = require('./api/routes/referrals');
var ico = require('./api/routes/ico');
var wallet = require('./api/routes/wallet');
var app = express();

passport.use(passportJWTStrategy);

//miler
var mailer = require('express-mailer');

mailer.extend(app, {
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'abc.mailernode@gmail.com',
        pass: '123456Mailer'
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());

app.use('/auth', auth);
app.use('/referrals', [referrals]);
app.use('/admin', [admin]);
app.use('/ico', [ico]);
app.use('/wallet', [wallet]);
app.use('/', express.static(path.join(__dirname, 'dist')));
app.use('/', front_router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
