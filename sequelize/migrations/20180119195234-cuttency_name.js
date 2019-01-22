'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.addColumn('transaction', 'currency_name', {
                type: Sequelize.STRING,
                allowNull: false
            }),
        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('transaction', 'currency_name')
        ];
    }
};