const User = require('../../sequelize/models').user;
const Wallet = require('../../sequelize/models').wallet;
const IcoSettings = require('../../sequelize/models').ico_settings;
const historyTransaction = require('../../sequelize/models').transaction;
const Rates = require('../../sequelize/models').rates;
const bcrypt = require('bcrypt');
require('dotenv').config();
let BlockIo = require('block_io');
let block_io_btc = new BlockIo(process.env.BLOCK_BTC_IO_API_KEY, process.env.BLOCK_BTC_IO_SECRET_PIN, process.env.BLOCK_BTC_IO_VERSION);
let block_io_ltc = new BlockIo(process.env.BLOCK_LTC_IO_API_KEY, process.env.BLOCK_LTC_IO_SECRET_PIN, process.env.BLOCK_LTC_IO_VERSION);

const speakeasy = require('speakeasy');

exports.blockIoUpdateBalance = async function (req) {

    let response = {
        status: true,
        token_verification: false,
        wallet_updated: false,
        transaction_created: false
    };
    let token = await IcoSettings.findOne({
        where: {
            name: 'notification_endpoint_key',
        }
    });

    if (req.body.data && req.body.data.txid && token && req.params.token && decodeURIComponent(req.params.token) === token.value) {
        let coin = '';
        if (req.body.data.network === 'LTCTEST' || req.body.data.network === 'LTC') {
            coin = 'LTC';
        }
        if (req.body.data.network === 'BTCTEST' || req.body.data.network === 'BTC') {
            coin = 'BTC';
        }
        if (req.body.data.network === 'DOGETEST' || req.body.data.network === 'DOGE') {
            coin = 'DOGE';
        }
        let wallet = await Wallet.findOne({
            where: {
                currency_name: coin,
                address: req.body.data.address
            }
        });
        let old_transaction = await historyTransaction.findOne({
            where: {
                initiator_id: wallet.owner_id,
                txid: req.body.data.txid
            }
        });
        if (old_transaction && (old_transaction.wallet_key_from === req.body.data.address || old_transaction.wallet_key_to === req.body.data.address)) {
            response.old_transaction = old_transaction;
            return response;
        }
        response.wallet = wallet;
        if (wallet) {
            if (req.body.data.balance_change) {
                let balance_change = parseFloat(req.body.data.balance_change);
                let wu = await Wallet.update({available_balance: (wallet.available_balance + balance_change).toFixed(8)}, {
                    where: {
                        id: wallet.id
                    }
                });
                response.wallet_updated = true;

                if (balance_change < 0) {
                    try {
                        let th = await historyTransaction.create({
                            initiator_id: wallet.owner_id,
                            txid: req.body.data.txid,
                            currency_name: coin,
                            currency_from: coin,
                            currency_to: coin,
                            type: 'withdraw',
                            coins_received: 0,
                            wallet_key_from: req.body.data.address,
                            wallet_key_to: '',
                            amount: balance_change,
                            fee: 0
                        });
                        response.transaction_created = true;
                    } catch (e) {
                        console.log(e);
                    }

                }
                if (balance_change >= 0) {
                    try {
                        let th = await historyTransaction.create({
                            initiator_id: wallet.owner_id,
                            txid: req.body.data.txid,
                            currency_name: coin,
                            currency_from: coin,
                            currency_to: coin,
                            type: 'deposit',
                            coins_received: 0,
                            wallet_key_from: '',
                            wallet_key_to: req.body.data.address,
                            amount: balance_change,
                            fee: 0
                        });
                        response.transaction_created = true;
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }
    return response;
};

exports.getWallet = async function (req) {
    let user = req.user;
    let response = {
        status: false,
        wallet: null,
        errors: []
    };
    let wallet = null;
    if (req.body.coin !== 'undefined') {

        wallet = await
            Wallet.findOne({
                where: {
                    owner_id: user.id,
                    currency_name: req.body.coin
                }
            });
        if (wallet) {
            response.status = true;
            response.wallet = wallet;
        }
    }
    return response;
};

exports.createWallet = async function (req) {
    let user = req.user;
    let response = {
        status: false,
        is_new: true,
        wallet: null,
        errors: []
    };
    let wallet = null;
    if (req.body.coin !== 'undefined') {

        wallet = await Wallet.findOne({
            where: {
                owner_id: user.id,
                currency_name: req.body.coin
            }
        });

        if (wallet) {
            response.status = true;
            response.wallet = wallet;
        }
        else if (wallet = await createWallet(user, req.body.coin, req)) {
            response.status = true;
            response.is_new = false;
            response.wallet = wallet;
        }
        else {
            response.errors = ['Fail to create wallet'];
        }
    }
    return response;
};


exports.getWallets = async function (req) {

    let user = req.user;
    let response = {
        status: false,
        wallets: {},
        errors: []
    };

    let wallets = await Wallet.findAll({
        where: {
            owner_id: user.id
        }
    });

    for (var i = wallets.length - 1; i >= 0; i--) {
        response.wallets[wallets[i].currency_name] = {};
        response.wallets[wallets[i].currency_name].currency_name = wallets[i].currency_name;
        response.wallets[wallets[i].currency_name].address = wallets[i].address;
        response.wallets[wallets[i].currency_name].balance = {
            available_balance: (wallets[i].available_balance).toFixed(8),
            pending_received_balance: '0.00000000'
        };
        if (wallets[i].currency_name != 'ABC' && !response.wallets[wallets[i].currency_name].balance_sync && (wallets[i].available_balance == '0.00000000' || wallets[i].available_balance == 0)) {
            let balance = await getWalletBalance(wallets[i].currency_name, wallets[i].address);
            if (balance && balance.status == 'success') {
                await Wallet.update({
                    available_balance: parseFloat(balance.data.available_balance).toFixed(8),
                    balance_sync: true
                }, {
                    where: {
                        id: wallets[i].id
                    }
                })
                response.wallets[wallets[i].currency_name].balance.available_balance = balance.data.available_balance;
                response.wallets[wallets[i].currency_name].balance.pending_received_balance = balance.data.pending_received_balance;
            }
        }
        else {
            response.wallets[wallets[i].currency_name].balance.available_balance = wallets[i].available_balance;
            response.wallets[wallets[i].currency_name].balance.pending_received_balance = wallets[i].pending_received_balance;
        }


    }

    response.status = true;
    return response;
};

exports.buyABC = async function (req) {

    let user = req.user;
    let response = {
        status: false,
        transaction: {},
        errors: []
    };
    try {
        if (user.is_active && req.body.coin && req.body.abc_volume) {

            if (req.user && req.body.tfa) {
                let verified = speakeasy.totp.verify({
                    secret: user.auth_token_tfa,
                    encoding: 'base32',
                    token: req.body.tfa
                });
                if (!verified) {
                    response.errors.push('2FA failed.');
                    return response;
                }
            }

            let source_wallet = await Wallet.findOne({
                where: {
                    owner_id: user.id,
                    currency_name: req.body.coin
                }
            });

            if (source_wallet) {
                let abc_wallet = await Wallet.findOne({
                    where: {
                        owner_id: user.id,
                        currency_name: 'ABC'
                    }
                });

                if (!abc_wallet) {
                    let data = {
                        status: 'success',
                        data: {
                            network: 'ABCCoin',
                            user_id: '',
                            address: '',
                            label: user.id + '_ABC_' + user.email
                        }
                    };
                    abc_wallet = await saveNewWallet('', data, user, 'ABC', req);
                }

                let settings = await IcoSettings.findAll();

                let settings_object = {};
                settings.forEach(function (setting) {
                    settings_object[setting.name] = setting.value;
                });
                settings_object['sold_coins'] = 0;

                if (!settings_object['abc_rate']) {
                    settings_object['abc_rate'] = 0.1;
                }

                let ltc_rate = await Rates.findOne({
                    where: {
                        coin: 'LTC',
                        currency: 'USD',
                    }
                });
                if (ltc_rate) {
                    settings_object['ltc_rate'] = (1 / ltc_rate.price) * settings_object['abc_rate'];
                } else {
                    settings_object['ltc_rate'] = 0.00000000;
                }

                let btc_rate = await Rates.findOne({
                    where: {
                        coin: 'BTC',
                        currency: 'USD',
                    }
                });
                if (btc_rate) {
                    settings_object['btc_rate'] = (1 / btc_rate.price) * settings_object['abc_rate'];
                }
                else {
                    settings_object['btc_rate'] = 0.00000000;
                }

                let total_currency = (req.body.abc_volume * settings_object[req.body.coin.toLowerCase() + '_rate']).toFixed(8);

                let start = new Date();
                start.setHours(0, 0, 0, 0);
                let end = new Date();
                end.setHours(23, 59, 59, 999);
                let delay_user_transaction_total = await historyTransaction.findOne({
                    attributes: [[historyTransaction.sequelize.fn('sum', historyTransaction.sequelize.col('coins_received')), 'total']],
                    where: {
                        initiator_id: user.id,
                        type: 'ico',
                        createdAt: {
                            $between: [start, end]
                        }
                    }
                });
                let user_delay_total = 0;
                if (delay_user_transaction_total && delay_user_transaction_total.dataValues.total != null) {
                    user_delay_total = delay_user_transaction_total.dataValues.total;
                }

                let all_time_transaction_total = await historyTransaction.findOne({
                    attributes: [[historyTransaction.sequelize.fn('sum', historyTransaction.sequelize.col('coins_received')), 'total']],
                    where: {
                        type: 'ico',
                    }
                });
                if (all_time_transaction_total) {
                    settings_object['sold_coins'] = all_time_transaction_total.dataValues.total;
                }
                let delay_transaction_total = await historyTransaction.findOne({
                    attributes: [[historyTransaction.sequelize.fn('sum', historyTransaction.sequelize.col('coins_received')), 'total']],
                    where: {
                        type: 'ico',
                        createdAt: {
                            $between: [start, end]
                        }
                    }
                });
                let delay_total = 0;
                if (delay_transaction_total) {
                    delay_total = delay_transaction_total.dataValues.total;
                }

                let delay_awaliable = settings_object.ico_max_coins_day - delay_total;
                let uer_delay_avaliable = settings_object.ico_max_user_coins_day - user_delay_total;

                let ico_date = JSON.parse(settings_object.ico_date);
                let ico_time = JSON.parse(settings_object.ico_time);
                let start_date = new Date(ico_date.month +
                    '/' + ico_date.day +
                    '/' + ico_date.year +
                    ' ' + ico_time.hour +
                    ':' + ico_time.minute);
                response.start_date = start_date;

                let now = new Date();
                let gmt = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
                if (gmt < start_date) {
                    response.errors.push('ICO has been successfully completed, Please purchase in the next round.');
                }
                if (!settings_object['ico_enabled'] || settings_object['ico_enabled'] === '0') {
                    response.errors.push('ICO has been successfully completed, Please purchase in the next round.');
                }

                if (total_currency > source_wallet.available_balance) {
                    response.errors.push('Not enough funds.');
                }

                if (settings_object.ico_volume <= settings_object.sold_coins && settings_object.ico_volume < req.body.abc_volume) {
                    response.errors.push('Not enough offers.');
                }

                if (req.body.abc_volume > delay_awaliable || delay_awaliable <= 0) {
                    response.errors.push('Not enough offers for today.');
                }

                if (req.body.abc_volume > uer_delay_avaliable) {
                    response.errors.push('Your daily limit ' + settings_object.ico_max_user_coins_day + '. You\'ve already bought ' + user_delay_total + '.');
                }

                if ((req.body.abc_volume + user_delay_total) < settings_object.ico_min_user_coins_day) {
                    response.errors.push('Your minimum daily limit ' + settings_object.ico_min_user_coins_day + '.');
                }

                if (response.errors.length < 1) {

                    let th = await historyTransaction.create({
                        initiator_id: user.id,
                        txid: '',
                        currency_name: req.body.coin,
                        currency_from: req.body.coin,
                        currency_to: 'BHCH',
                        type: 'ico',
                        coins_received: req.body.abc_volume,
                        wallet_key_from: source_wallet.address,
                        wallet_key_to: process.env.BLOCK_LTC_IO_ADDRESS,
                        amount: parseFloat(total_currency).toFixed(8),
                        fee: 0
                    });

                    let new_abc_balance = parseFloat(abc_wallet.available_balance) + parseFloat(req.body.abc_volume);
                    await Wallet.update({available_balance: new_abc_balance.toFixed(8)}, {
                        where: {id: abc_wallet.id}
                    });

                    let new_source_balance = source_wallet.available_balance - total_currency;
                    await Wallet.update({available_balance: new_source_balance.toFixed(8)}, {
                        where: {id: source_wallet.id}
                    });

                    response.status = true;
                    response.transaction = {};
                }
            }
        }
    } catch (e) {
        response.errors.push('Payment failed.');
    }
    return response;
};


function createWallet(user, coin, req) {
    return new Promise(function (resolve, reject) {
            if (coin == 'BTC') {
                block_io_btc.get_new_address({'label': user.id + '_BTC_' + user.email}, (message, data) => {
                    wallet = saveNewWallet(message, data, user, coin, req);
                    resolve(wallet);
                });
            }
            else if (coin == 'LTC') {
                block_io_ltc.get_new_address({'label': user.id + '_LTC_' + user.email}, (message, data) => {
                    wallet = saveNewWallet(message, data, user, coin, req);
                    resolve(wallet);
                });
            }
            else if (coin == 'ABC') {
                let data = {
                    status: 'success',
                    data: {

                        network: 'ABCCoin',
                        user_id: '',
                        address: '',
                        label: user.id + '_ABC_' + user.email
                    }
                };
                wallet = saveNewWallet('', data, user, coin, req);
                resolve(wallet);
            }
            else {
                resolve(null);
            }
        }
    )
}

function createTransaction(coin, address_from, address_to, amount) {
    return new Promise(function (resolve, reject) {
        if (coin === 'BTC') {
            block_io_btc.withdraw_from_addresses({
                'amounts': amount,
                'from_addresses': address_from,
                'to_addresses': address_to
            }, (message, data) => {
                resolve(data);
            });
        }
        else if (coin === 'LTC') {
            block_io_ltc.withdraw_from_addresses({
                'amounts': amount,
                'from_addresses': address_from,
                'to_addresses': address_to
            }, (message, data) => {
                resolve(data);
            });
        }
        else {
            resolve(null);
        }
    })
}

function getWalletBalance(coin, address) {
    return new Promise(function (resolve, reject) {
        if (coin == 'BTC') {
            block_io_btc.get_address_balance({'address': address}, (message, data) => {
                resolve(data);
            });
        }
        else if (coin == 'LTC') {
            block_io_ltc.get_address_balance({'address': address}, (message, data) => {
                resolve(data);
            });
        }
        else {
            resolve(null);
        }
    })
}

async function saveNewWallet(message, data, user, coin, req) {
    let wallet = null;
    if (data.status == 'success') {
        wallet = await Wallet.create({
            owner_id: user.id,
            name: '',
            network: data.data.network,
            network_id: data.data.user_id,
            address: data.data.address,
            network_label: data.data.label,
            description: '',
            currency_name: coin,
            available_balance: 0.00000000,
            pending_received_balance: 0.00000000,
            balance_sync: false
        });
    }
    return wallet;
}

exports.userWalletHistory = async function (req) {
    let user = req.user;
    let transactions = [];
    if (user && req.body.type && req.body.coin) {
        transactions = await historyTransaction.findAll({
            where: [
                {
                    initiator_id: user.id,
                    $or: [{
                        currency_to: req.body.coin,
                    }, {
                        currency_from: req.body.coin
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

    }
    return transactions;
};

exports.withdrawCoins = async function (req) {
    let user = req.user;
    let response = {
        status: false,
        transaction: {},
        errors: []
    };
    try {
        let password = req.body.password;
        let isPassEqual = user ? await bcrypt.compare(password, user.password) : false;
        if (!isPassEqual || !user.is_active) {
            response.errors.push('Password incorrect.');
            return response;
        }
        if (req.user && req.user.is_tfa_active) {
            try{
                let verified = speakeasy.totp.verify({
                    secret: user.auth_token_tfa,
                    encoding: 'base32',
                    token: req.body.tfa_auth
                });
                if (!verified) {
                    response.errors.push('2FA failed.');
                    return response;
                }
            }catch (e) {
                response.errors.push('2FA failed.');
                return response;
            }
        }
        let source_wallet = await Wallet.findOne({
            where: {
                owner_id: user.id,
                currency_name: req.body.coin
            }
        });
        if(source_wallet.available_balance >= parseFloat(req.body.amount)){
          let result = await createTransaction(req.body.coin, source_wallet.address, req.body.address, req.body.amount);
          if(result.status === 'success'){
            let old_transaction = await historyTransaction.findOne({
              where: {
                initiator_id: user.id,
                txid:  result.data.txid
              }
            });
            if(!old_transaction){
              let wu = await Wallet.update({available_balance: (source_wallet.available_balance - parseFloat(result.data.amount_withdrawn)).toFixed(8)}, {
                where: {
                  id: source_wallet.id
                }
              });
              let th = await historyTransaction.create({
                initiator_id: user.id,
                txid:  result.data.txid,
                currency_name: req.body.coin,
                currency_from: req.body.coin,
                currency_to: req.body.coin,
                type: 'withdraw',
                coins_received: 0,
                wallet_key_from: source_wallet.address,
                wallet_key_to: req.body.address,
                amount: result.data.amount_sent,
                fee: parseFloat(result.data.network_fee) + parseFloat(result.data.blockio_fee)
              });
              response.status = true;
            }

          }else{
            response.errors.push('Transaction failed');
          }
        }else{
          response.errors.push('Not enough founds.');
        }


    } catch (e) {

    }

    return response;
};
exports.getFee = async function (req) {
    let response = {
        status: false,
        transaction: {},
        errors: []
    };
    try {
        response.fee = await estimateFee(req);
        response.status = true;
    } catch (e) {
        response.fee = 0;
        response.status = false;
    }
    return response;
};

function estimateFee(req) {
    return new Promise(function (resolve, reject) {
            if (req.body.coin === 'BTC') {
                block_io_btc.get_network_fee_estimate({
                    'amounts': req.body.amount,
                    'to_addresses': req.body.address
                }, (message, data) => {
                    if(data.data.estimated_network_fee){
                        resolve(data.data.estimated_network_fee);
                    }else{
                        resolve(0);
                    }
                });
            }
            else if (req.body.coin === 'LTC') {
                block_io_ltc.get_network_fee_estimate({
                    'amounts': req.body.amount,
                    'to_addresses': req.body.address
                }, (message, data) => {
                    if(data.data.estimated_network_fee){
                        resolve(data.data.estimated_network_fee);
                    }else{
                        resolve(0);
                    }
                });
            }
            else {
                resolve(null);
            }
        }
    )
}
