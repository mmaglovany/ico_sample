'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.addColumn('wallet', 'available_balance', {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0.00000000
            }),
            queryInterface.addColumn('wallet', 'pending_received_balance', {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0.00000000
            }),
        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('wallet', 'available_balance'),
            queryInterface.removeColumn('wallet', 'pending_received_balance')
        ];
    }
};