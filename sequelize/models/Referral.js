module.exports = function (sequelize, Sequelize) {
    let Referral = sequelize.define('referral', {
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
        createdAt:{
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: 'referral'
    });

    return Referral;
};
