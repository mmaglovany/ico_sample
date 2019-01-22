'use strict';

const RATES = 'rates';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.createTable(RATES, {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                coin: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                currency: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                price: {
                    type: Sequelize.FLOAT,
                    allowNull: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW
                }
            }),

        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.dropTable( RATES )
        ];
    }
};