module.exports = {
    apps : [{
        name        : "worker",
        script      : "./bin/www",
        watch       : true,
        env: {
            "PORT": "3000",
            "NODE_ENV": "production",
            'env': 'production'
        },
    }]
};