const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authController = require('../controllers/AuthController');
const usersController = require('../controllers/UserController');
const User = require('../../sequelize/models').user;
const speakeasy = require('speakeasy');
const passwordGenerator = require('generate-password');


router.post('/login', async function (req, res, next) {

    try {
        let result = await authController.login(req, res);
        res.json(result);
    } catch (e) {
        res.status(401).json({message: "no such user found"});
    }
});
router.post('/admin-login', async function (req, res, next) {

    try {
        let result = await authController.login(req, res);
        if(result.is_admin){
            res.json(result);
        }else{
            res.json({
                status: false,
                errors: ['User or password is incorrect.']
            });
        }

    } catch (e) {
        res.status(401).json({message: "no such user found"});
    }
});

router.post('/pass-confirm', passport.authenticate('jwt', {session: false}), async function (req, res, next) {

    if (req.user && req.body.password && req.body.action) {
        let password = req.body.password;
        let user = req.user;

        let isPassEqual = user ? await bcrypt.compare(password, user.password) : false;

        if (isPassEqual && user.is_active) {
            if(req.body.action == '2fa-create-reset'){
                let secret = speakeasy.generateSecret({length: 20, name: 'BchConnect coin ' + user.email});
                await User.update({ auth_token_tfa: secret.base32, otpauth_url: secret.otpauth_url}, {
                    where: {id: user.id}
                });
                res.json({status: true, secret: secret});
            }
            else if (req.body.action == '2fa-disable'){
                await User.update({ is_tfa_active: false }, {
                    where: {id: user.id}
                });
                res.json({status: true});
            }else{
                res.json({status: false});
            }
        } else {
            res.status(401).json({message: "no such user found"});
        }
    } else {
        res.status(401).json({message: "passwords did not match"});
    }

});

router.post('/get-settings', passport.authenticate('jwt', {session: false}), async function (req, res, next) {

    if (req.user) {
        let user = req.user;

        let settings = {
            is_tfa_active: user. is_tfa_active
        };

        res.json({status: true, settings: settings});

    } else {
        res.status(401).json({message: "app error"});
    }

});

router.post('/send-reset-pass-email', async function (req, res, next) {

    if (req.body.email) {
        let user = await User.findOne({where: {email: req.body.email}});
        const saltRounds = 10;
        let reset_pass_token = passwordGenerator.generate({
            length: 10,
            numbers: true,
            uppercase: true
        });
        reset_pass_token = await bcrypt.hash(reset_pass_token, saltRounds);
        await User.update({ reset_pass_token: reset_pass_token }, {
            where: {id: user.id}
        });
        usersController.sendResetPassEmail(req, user.email, reset_pass_token);

        res.json({status: true});

    } else {
        res.status(401).json({message: "app error"});
    }

});

router.post('/send-email-confirmation', async function (req, res, next) {

    if (req.body.email) {
        let user = await User.findOne({where: {email: req.body.email}});

        usersController.resendActivationEmail(req, user.email);

        res.json({status: true});

    } else {
        res.status(401).json({message: "app error"});
    }

});
router.post('/reset-pass', async function (req, res, next) {

    if (req.body.email && req.body.reset_pass_token && req.body.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        let user = await User.update({ password: hashedPassword, reset_pass_token: '' }, {
            where: {
                email: decodeURIComponent(req.body.email),
                reset_pass_token: decodeURIComponent( req.body.reset_pass_token)
        }
        });
        if (user.length > 0) {
            res.json({status: true});
        }else{
            res.json({status: false});
        }

    } else {
        res.status(401).json({message: "app error"});
    }

});

router.post('/login/verify-code', async function (req, res, next) {

    if (req.body.auth_code && req.body.email) {

        let user = await User.findOne({where: {email: req.body.email}});

        if (user.is_active) {
            let verified = speakeasy.totp.verify({
                secret: user.auth_token_tfa,
                encoding: 'base32',
                token: req.body.auth_code
            });
            let payload = {id: user.id};
            let token = jwt.sign(payload, process.env.JWT_SECRET);
            if (verified) {
                res.json({status: true, token: token, username: user.user_name, email: user.email});
            } else {
                res.status(401).json({message: "token invalid"});
            }
        } else {
            res.status(401).json({message: "no such user found"});
        }
    } else {
        res.status(401).json({message: "data error"});
    }

});
router.post('/verify-code', passport.authenticate('jwt', {session: false}), async function (req, res, next) {

    if (req.user && req.body.auth_code && req.body.action) {
        let user = req.user;
        if (user.is_active) {
            let verified = speakeasy.totp.verify({
                secret: user.auth_token_tfa,
                encoding: 'base32',
                token: req.body.auth_code
            });
            if (verified) {
                if(req.body.action == '2fa-create-reset'){
                    await User.update({ is_tfa_active: true }, {
                        where: {id: user.id}
                    });
                }
                res.json({status: true});
            } else {
                res.status(401).json({message: "token invalid"});
            }
        } else {
            res.status(401).json({message: "no such user found"});
        }
    } else {
        res.status(401).json({message: "data error"});
    }
});
router.post('/too-fa-verify-code', passport.authenticate('jwt', {session: false}), async function (req, res, next) {

    if (req.user && req.body.auth_code && req.body.action) {
        let user = req.user;
        if (user.is_active) {
            let verified = speakeasy.totp.verify({
                secret: user.auth_token_tfa,
                encoding: 'base32',
                token: req.body.auth_code
            });
            if (verified) {
                res.json({status: true});
            } else {
                res.json({status: false});
            }
        } else {
            res.json({status: false});
        }
    } else {
        res.status(401).json({message: "data error"});
    }
});
router.post('/register', async function (req, res, next) {
    try {
        let result = await usersController.registerUser(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});
router.post('/register/check-name', async function (req, res, next) {
    try {
        let result = await usersController.registerCheckUserName(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.get('/activate_email/:email/:hash', async function (req, res, next) {
    try {
        let result = await usersController.activateEmailByUrl(req.params, res);

        let url = req.protocol + '://' + req.get('host') + '/#/register/email-confirmation/' + result.status;
        await res.redirect(url);
    } catch (e) {
        next(e);
    }
});

router.get('/reset-password-url/:email/:hash', async function (req, res, next) {
    try {
        let result = await authController.resetPasswordByUrl(req.params, res);
        let url = req.protocol + '://' + req.get('host') + '/#/login/reset-password/';
        if(result.status){
            url += encodeURIComponent(result.email) +'/'+ encodeURIComponent(result.reset_token);
        }
        await res.redirect(url);
    } catch (e) {
        next(e);
    }
});

router.post('/activate_email', async function (req, res, next) {
    try {
        let result = await usersController.activateEmailByCode(req.body, req.app);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post('/resend_email', async function (req, res, next) {
    try {
        let result = await usersController.resendActivationEmail(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.get('/is-admin', passport.authenticate('jwt', {session: false}), async function (req, res, next) {
    let is_admin = false;
    if(req.user.user_role_id == 2) {
        is_admin = true;
    }
    res.json({is_admin: is_admin});
});

module.exports = router;
