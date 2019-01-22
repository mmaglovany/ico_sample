'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.addColumn('wallet', 'balance_sync', {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }),
        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('wallet', 'balance_sync')
        ];
    }
};