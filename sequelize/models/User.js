module.exports = function (sequelize, Sequelize) {
    let User = sequelize.define('user', {
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
            references: {
                model: 'user_role',
                key: 'id'
            }
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
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        reset_pass_token: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    }, {
        tableName: 'user'
    });

    User.associate = function (models) {
        User.belongsToMany(models.user, {
            as: 'user_referrer',
            through: 'referral',
            foreignKey: 'referral_id'
        });
        User.belongsToMany(models.user, {
            as: 'user_referrals',
            through: 'referral',
            foreignKey: 'referrer_id'
        });

        User.hasMany(models.wallet, {
            as: 'wallet',
            foreignKey: 'owner_id',
            sourceKey: 'id',
        });
    };

    return User;
};
