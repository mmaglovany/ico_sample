module.exports = {

    development: {
        username: 'root',
        password: 'root',
        database: 'abc_coins',
        host: 'localhost',
        dialect: 'mysql'
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },
    production: {
        username: 'root',
        password: 'root',
        database: 'abc_coins',
        host: 'localhost',
        dialect: 'mysql'
    }
};
