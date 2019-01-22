'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('user', 'reset_pass_token', {
            type: Sequelize.TEXT,
            allowNull: true
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('user', 'reset_pass_token');
    }
};
