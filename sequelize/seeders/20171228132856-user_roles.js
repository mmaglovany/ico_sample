'use strict';

const
    USER_ROLE = 'user_role'
;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(USER_ROLE, [
            {
                name: 'user'
            },
            {
                name: 'admin'
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(USER_ROLE, null, {});
    }
