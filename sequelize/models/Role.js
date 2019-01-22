module.exports = function (sequelize, Sequelize) {
    let UserRole = sequelize.define('user_role', {
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
    }, {
        tableName: 'user_role'
    });

    return UserRole;
};
