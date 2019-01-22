const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const walletController = require('../controllers/WalletController');


router.post('/create-wallet',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await walletController.createWallet(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});
router.post('/withdraw-coins',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await walletController.withdrawCoins(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});
router.post('/get-wallet',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await walletController.getWallet(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});
router.post('/get-wallets',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await walletController.getWallets(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post('/get-balance',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = [];
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post('/buy-abccoin',  passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await walletController.buyABC(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post('/get-transactions-notification/:token', async function (req, res, next) {
    try {
        let result = await walletController.blockIoUpdateBalance(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});
router.post('/get-transactions-history', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await walletController.userWalletHistory(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post('/get-fee', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    try {
        let result = await walletController.getFee(req);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
