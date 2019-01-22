const _sodium = require('libsodium-wrappers');
const bcrypt = require('bcrypt');
const passwordGenerator = require('generate-password');
const User = require('../../sequelize/models').user;
const jwt = require('jsonwebtoken');


let sodium = null;

function decryptMessage(publicKey, sign, nonce) {
    const signMessageBuffer = Buffer.from(sign, 'hex');
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');
    const privateKeyBuffer = Buffer.from(process.env.PRIVATE_KEY, 'hex');
    const nonceBuffer = Buffer.from(nonce, 'hex');

    const encryptedMessage = sodium.crypto_box_open_easy(signMessageBuffer,
        nonceBuffer, publicKeyBuffer, privateKeyBuffer);

    return Buffer(encryptedMessage).toString('utf-8');
}

function encryptMessage(publicKey, message) {
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const clientPublicKeyBuffer = sodium.from_hex(publicKey);
    const privateKeyBuffer = Buffer.from(process.env.PRIVATE_KEY, 'hex');
    const boxedPassword = sodium.crypto_box_easy(message, nonce, clientPublicKeyBuffer, privateKeyBuffer);

    return {
        msg: sodium.to_hex(boxedPassword),
        nonce: sodium.to_hex(nonce),
        public_key: process.env.PUBLIC_KEY
    }
}

exports.login = async function (req, res) {
    let response = {
        status: false,
        errors: []
    };
    if (req.body.password && req.body.email) {
        let password = req.body.password;
        let email = req.body.email;
        let user = await User.findOne({where: {email: email}});
        let isPassEqual = user ? await bcrypt.compare(password, user.password) : false;
        if (isPassEqual && user.is_active) {
            if (user.is_tfa_active) {
                response.status = true;
            } else {
                let payload = {id: user.id};
                let token = jwt.sign(payload, process.env.JWT_SECRET);
                let admin = user.user_role_id == 2;
                response = {
                    status: true,
                    token: token,
                    username: user.user_name,
                    email: user.email,
                    is_admin: admin,
                    errors: []
                };
            }
        } else if(isPassEqual && !user.is_active) {
            response = {
                status: false,
                errors: ['Your account is not activated yet. please check your email for activation mail and verify. Do not forget to check the spam folder.']
            };
        }
        else {
            response = {
                status: false,
                errors: ['User or password is incorrect.']
            };
        }
    } else {
        response = {
            status: false,
            errors: ['User or password is incorrect.']
        };
    }
    return response;
};

exports.resetPasswordByUrl = async function (params, res) {

    let response = {
        status: false,
        errors: []
    };
    if (params.email && params.hash) {
        let user = await User.findOne(
            {
                where: {
                    email: decodeURIComponent(params.email),
                    reset_pass_token: decodeURIComponent(params.hash)
                }
            });
        if(user){
            response = {
                status: true,
                reset_token: user.reset_pass_token,
                email: user.email
            };
        }

        return response;
    }
    else {
        response.errors.push('Params error');
    }
    return response;
};
