module.exports = function (sequelize, Sequelize) {
    let IcoSettings = sequelize.define('ico_settings', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        value: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.TIME,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.TIME,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: 'ico_settings'
    });

    return IcoSettings;
};
