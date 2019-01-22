'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.addColumn('transaction', 'createdAt', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }),
            queryInterface.addColumn('transaction', 'updatedAt', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }),


        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('transaction', 'createdAt'),
            queryInterface.removeColumn('transaction', 'updatedAt')
        ];
    }
};