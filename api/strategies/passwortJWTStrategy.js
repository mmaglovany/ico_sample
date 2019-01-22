let passportJWT = require("passport-jwt");

let User = require('../../sequelize/models').user;


let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = new JwtStrategy(
    jwtOptions,
    async function (jwt_payload, next) {
        let user = await User.findById(jwt_payload.id);
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });