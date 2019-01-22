'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.addColumn('wallet', 'network', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn('wallet', 'network_id', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn('wallet', 'address', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn('wallet', 'network_label', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn('wallet', 'currency_name', {
                type: Sequelize.STRING,
                allowNull: false
            }),

            queryInterface.addColumn('wallet', 'createdAt', {
                type: Sequelize.TIME,
                defaultValue: Sequelize.NOW
            }),
            queryInterface.addColumn('wallet', 'updatedAt', {
                type: Sequelize.TIME,
                defaultValue: Sequelize.NOW
            })
        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('wallet', 'network'),
            queryInterface.removeColumn('wallet', 'network_id'),
            queryInterface.removeColumn('wallet', 'network_label'),
            queryInterface.removeColumn('wallet', 'createdAt'),
            queryInterface.removeColumn('wallet', 'updatedAt'),
            queryInterface.removeColumn('wallet', 'currency_name')
        ];
    }
};
