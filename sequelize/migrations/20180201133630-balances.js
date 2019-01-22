'use strict';
const historyTransaction = require('../models').transaction;
const Wallet = require('../../sequelize/models').wallet;

module.exports = {
  up: async (queryInterface, Sequelize) => {

      let transactions = await historyTransaction.findAll({
        where: {
          type:'withdraw'
        }
      });


      for (let i = transactions.length - 1; i >= 0; i--) {
        let wallet =  await Wallet.findOne({
          where: {
            address:transactions[i].wallet_key_from
          }
        });

        await Wallet.update({available_balance: (wallet.available_balance + transactions[i].amount*-1).toFixed(8)}, {
          where: {
            id: wallet.id
          }
        });
        await historyTransaction.destroy({
          where: {
            id: transactions[i].id
          }
        });
      }


    return [];
  },

  down: (queryInterface, Sequelize) => {
    return [];
  }
};
