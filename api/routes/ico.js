const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const icoSettingsController = require('../controllers/IcoSettingsController');


router.post('/get-ico-settings',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await icoSettingsController.getIcoSettings(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post('/get-user-ico-settings',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await icoSettingsController.getUserIcoSettings(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.get('/update-rates', async function (req, res, next) {
    try {
        let result = await icoSettingsController.updateAllRates();
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.get('/status', async function (req, res, next) {
    try {
        let result = await icoSettingsController.getStatus();
        res.json(result);
    } catch (e) {
        next(e);
    }
});



module.exports = router;
