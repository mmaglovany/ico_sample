'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('transaction', 'transaction_key'),
            queryInterface.removeColumn('transaction', 'createdAt'),
            queryInterface.removeColumn('transaction', 'updatedAt'),
            queryInterface.addColumn('transaction', 'txid', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn('transaction', 'currency_name', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn('transaction', 'type', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn('transaction', 'coins_received', {
                type: Sequelize.DOUBLE,
                allowNull: false,
                defaultValue: 0.00000000
            }),
            queryInterface.addColumn('transaction', 'fee', {
                type: Sequelize.DOUBLE,
                allowNull: false,
                defaultValue: 0.00000000
            })
        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('transaction', 'txid'),
            queryInterface.removeColumn('transaction', 'currency_name'),
            queryInterface.removeColumn('transaction', 'type'),
            queryInterface.removeColumn('transaction', 'coins_received'),
            queryInterface.removeColumn('transaction', 'fee')
        ];
    }
};