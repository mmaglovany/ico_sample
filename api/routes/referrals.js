const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const referralsController = require('../controllers/ReferralsController');


router.post('/get-referrals-tree',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await referralsController.getReferralsTree(req.user,9);
        res.json(result);
    } catch (e) {
        next(e);
    }
});
router.post('/get-referrals-list',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await referralsController.getReferralsList(req.user,9);
        res.json(result);
    } catch (e) {
        next(e);
    }
});


module.exports = router;
