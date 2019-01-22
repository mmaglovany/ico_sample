'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('rates', 'price', {
                type: Sequelize.DOUBLE,
                allowNull: false
            }),
            queryInterface.changeColumn('referral', 'createdAt', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }),
            queryInterface.changeColumn('referral', 'updatedAt', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }),
            queryInterface.changeColumn('transaction', 'coins_received', {
                type: Sequelize.DOUBLE,
                allowNull: false
            }),
            queryInterface.changeColumn('transaction', 'amount', {
                type: Sequelize.DOUBLE,
                allowNull: false
            }),
            queryInterface.changeColumn('transaction', 'fee', {
                type: Sequelize.DOUBLE,
                allowNull: false
            }),
            queryInterface.changeColumn('user', 'referral_bonus', {
                type: Sequelize.DOUBLE,
                allowNull: false
            }),
            queryInterface.changeColumn('user', 'createdAt', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }),
            queryInterface.changeColumn('user', 'updatedAt', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }),
            queryInterface.changeColumn('wallet', 'available_balance', {
                type: Sequelize.DOUBLE,
                allowNull: false
            }),
            queryInterface.changeColumn('wallet', 'pending_received_balance', {
                type: Sequelize.DOUBLE,
                allowNull: false
            }),
            queryInterface.changeColumn('wallet', 'createdAt', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }),
            queryInterface.changeColumn('wallet', 'updatedAt', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }),
        ];
    },

    down: (queryInterface, Sequelize) => {
        return [

        ];
    }
};