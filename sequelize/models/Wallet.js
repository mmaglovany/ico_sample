module.exports = function (sequelize, Sequelize) {
    let Wallet = sequelize.define('wallet', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        owner_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        network:{
            type: Sequelize.STRING,
            allowNull: false
        },
        network_id:{
            type: Sequelize.STRING,
            allowNull: false
        },
        address:{
            type: Sequelize.STRING,
            allowNull: false
        },
        network_label:{
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        currency_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        available_balance: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.00000000
        },
        pending_received_balance: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.00000000
        },
        balance_sync: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'wallet'
    });


    return Wallet;
};
