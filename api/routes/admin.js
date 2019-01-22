const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const icoSettingsController = require('../controllers/IcoSettingsController');
const usersListController = require('../controllers/UsersListController');


router.post('/get-ico-settings',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        if(req.user.user_role_id == 2){
            let result = await icoSettingsController.getIcoSettings();
            res.json(result);
        }else{
            res.json({
                status: false,
                errors: ['User not admin']
            });
        }
    } catch (e) {
        next(e);
    }
});

router.post('/update-ico-settings',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        if(req.user.user_role_id == 2){
        let result = await icoSettingsController.updateIcoSettings(req);
        res.json(result);
        }else{
            res.json({
                status: false,
                errors: ['User not admin']
            });
        }
    } catch (e) {
        next(e);
    }
});
router.post('/user-list',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        if(req.user.user_role_id == 2){
            let result = await usersListController.usersList(req);
            res.json(result);
        }else{
            res.json({
                status: false,
                errors: ['User not admin']
            });
        }
    } catch (e) {
        next(e);
    }
});

router.post('/ico-transactions-list',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        if(req.user.user_role_id == 2){
            let result = await usersListController.icoHistory(req);
            res.json(result);
        }else{
            res.json({
                status: false,
                errors: ['User not admin']
            });
        }
    } catch (e) {
        next(e);
    }
});

router.post('/reset-transaction-notifications', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await icoSettingsController.resetTransactionNotifications(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
