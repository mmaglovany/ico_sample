'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.createTable('ico_settings', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false
                },
                value: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                createdAt: {
                    type: Sequelize.TIME,
                    defaultValue: Sequelize.NOW
                },
                updatedAt: {
                    type: Sequelize.TIME,
                    defaultValue: Sequelize.NOW
                }
            })
        ]
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.dropTable('ico_settings')
        ]
    }
};
