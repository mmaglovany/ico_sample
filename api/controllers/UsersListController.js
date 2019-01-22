const User = require('../../sequelize/models').user;
const Wallet = require('../../sequelize/models').wallet;
const historyTransaction = require('../../sequelize/models').transaction;
require('dotenv').config();
let BlockIo = require('block_io');
let block_io_btc = new BlockIo(process.env.BLOCK_BTC_IO_API_KEY, process.env.BLOCK_BTC_IO_SECRET_PIN, process.env.BLOCK_BTC_IO_VERSION);
let block_io_ltc = new BlockIo(process.env.BLOCK_LTC_IO_API_KEY, process.env.BLOCK_LTC_IO_SECRET_PIN, process.env.BLOCK_LTC_IO_VERSION);

exports.usersList = async function (req) {

  let params = {
    size: 10,
    pageNumber: 0,
    totalElements: 0,
    sort_by: 'id',
    sort_order: 'asc',
  };

  if(req.body.pageNumber){
    params.pageNumber = req.body.pageNumber;
  }
  if(req.body.size){
    params.size = req.body.size;
  }
  if(req.body.sort_by){
    params.sort_by = req.body.sort_by;
  }
  if(req.body.sort_order){
    params.sort_order = req.body.sort_order;
  }

  let response = {
    users: [],
    totalElements: await User.count()
  };

  let users = await User.findAll({
    attributes: ['id', 'user_name'],
    include: {
      model: Wallet,
      attributes: ['currency_name', 'available_balance', 'balance_sync', 'address'],
      as: 'wallet'
    },
   /* order: [
      [params.sort_by, params.sort_order]
    ],
    offset: params.size * params.pageNumber,
    limit: params.size*/
  });
  for (var i = users.length - 1; i >= 0; i--) {
    if (users[i].wallet && users[i].wallet.length > 0) {
      for (var j = users[i].wallet.length - 1; j >= 0; j--) {
        if (users[i].wallet[j].currency_name != 'ABC'
          && !users[i].wallet[j].balance_sync
          && (users[i].wallet[j].available_balance == '0.00000000' || users[i].wallet[j].available_balance == 0)) {
          let balance = await getWalletBalance(users[i].wallet[j].currency_name, users[i].wallet[j].address);
          if (balance && balance.status == 'success') {
            await Wallet.update({
              available_balance: parseFloat(balance.data.available_balance).toFixed(8),
              balance_sync: true
            }, {
              where: {
                id: users[i].wallet[j].id
              }
            });
            users[i].wallet[j].available_balance = balance.data.available_balance;
          }
        }
        users[i].dataValues[users[i].wallet[j].currency_name] = users[i].wallet[j].available_balance;
      }
    }
  }
  response.users = users;
  return response;
};

exports.icoHistory = async function (req) {

  let transactions = await historyTransaction.findAll({
    attributes: ['id', 'initiator_id', 'currency_name', 'currency_from', 'amount', 'coins_received', 'wallet_key_from', 'createdAt'],
    where: {
      type: 'ico'
    },
    include: {
      model: User,
      attributes: ['id', 'user_name'],
      as: 'user'
    },
    order: [['createdAt', 'DESC']]
  });

  return transactions;
};

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
