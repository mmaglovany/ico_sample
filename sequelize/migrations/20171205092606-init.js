'use strict';

const
    USER = 'user',
    USER_ROLE = 'user_role',
    WALLET = 'wallet',
    REFERRAL = 'referral',
    CURRENCY = 'currency',
    TRANSACTION = 'transaction'
;

module.exports = {
    up: (queryInterface, Sequelize) => {

        return [
            queryInterface.createTable(USER_ROLE, {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false
                }
            }),
            queryInterface.createTable(USER, {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                email: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false
                },
                password: Sequelize.STRING,
                phone_number: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                user_name: {
                    type: Sequelize.STRING,
                    unique: true
                },
                is_active: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                },
                confirmation_code: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                user_role_id: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                is_tfa_active: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                },
                auth_token_tfa: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                otpauth_url_tfa: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                referral_bonus: {
                    type: Sequelize.FLOAT,
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
            }),
            queryInterface.createTable(REFERRAL, {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                referrer_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                referral_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.TIME,
                    defaultValue: Sequelize.NOW
                },
                updatedAt: {
                    type: Sequelize.TIME,
                    defaultValue: Sequelize.NOW
                }
            }),
            queryInterface.createTable(CURRENCY, {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false
                }
            }),
            queryInterface.createTable(WALLET, {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                owner_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            }),
            queryInterface.createTable(TRANSACTION, {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                initiator_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                wallet_key_from: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                wallet_key_to: {
                    type: Sequelize.STRING,
                    unique: false,
                    allowNull: false
                },
                transaction_key: {
                    type: Sequelize.STRING,
                    unique: false,
                    allowNull: false
                },
                amount: {
                    type: Sequelize.FLOAT,
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
        ];
    },

    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.dropTable(TRANSACTION),
            queryInterface.dropTable(WALLET),
            queryInterface.dropTable(CURRENCY),
            queryInterface.dropTable(REFERRAL),
            queryInterface.dropTable(USER),
            queryInterface.dropTable(USER_ROLE)
        ];
    }
};
