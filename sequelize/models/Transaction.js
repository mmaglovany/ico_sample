module.exports = function (sequelize, Sequelize) {
    let Transaction = sequelize.define('transaction', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        initiator_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        txid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        currency_from: {
            type: Sequelize.STRING,
            allowNull: false
        },
        currency_name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''

        },
        currency_to: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        coins_received: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        fee: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        wallet_key_from: {
            type: Sequelize.STRING,
            allowNull: true
        },
        wallet_key_to: {
            type: Sequelize.STRING,
            unique: false,
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
    }, {
        tableName: 'transaction'
    });

    Transaction.associate = function (models) {
        Transaction.belongsTo(models.user, {
            as: 'user',
            foreignKey: 'initiator_id'
        });
    };

    return Transaction;
};
