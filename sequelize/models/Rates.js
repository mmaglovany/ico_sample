module.exports = function (sequelize, Sequelize) {
    let Rates = sequelize.define('rates', {
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
            type: Sequelize.DOUBLE,
            allowNull: false
        }
    }, {
        tableName: 'rates'
    });

    return Rates;
};
