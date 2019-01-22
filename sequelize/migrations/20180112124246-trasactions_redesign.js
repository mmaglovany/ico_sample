'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('transaction', 'currency_name'),
            queryInterface.addColumn('transaction', 'currency_from', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn('transaction', 'currency_to', {
                type: Sequelize.STRING,
                allowNull: false
            }),


        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('transaction', 'currency_too'),
            queryInterface.removeColumn('transaction', 'currency_from')
        ];
    }
};