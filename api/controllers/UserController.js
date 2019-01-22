const User = require('../../sequelize/models').user;
const Referral = require('../../sequelize/models').referral;
const bcrypt = require('bcrypt');
const passwordGenerator = require('generate-password');
const mailer = require('express-mailer');
const jwt = require('jsonwebtoken');

const AWS = require('aws-sdk');
const ses = new AWS.SES();

exports.usersList = async function (limit, offset) {
    return await User.findAll();
};

exports.userById = async function (id) {
    return await User.findById(id);
};


exports.updateUser = async function (userData) {
    return await User.update(userData, {
        where: {id: userData.id}
    });
};

exports.registerCheckUserName = async function (req) {
    let response = {
        is_taken: false,
        errors: []
    };
    let userData = req.body;
    let user = await User.findOne({
        where: {
            user_name: userData.user_name,
        }
    });
    if (user) {
        response.is_taken = true;
        response.errors.push('User with this User Name already exist.')
    }
    return response

};

exports.registerUser = async function (req) {

    let response = {
        status: false,
        errors: []
    };
    let userData = req.body;

    let user = await User.findOne({
        where: {
            email: userData.email,
        }
    });
    if (user) {
        response.errors.push('User with this Email already exist.')
    }
    user = await User.findOne({
        where: {
            user_name: userData.user_name,
        }
    });
    if (user) {
        response.errors.push('User with this User Name already exist.')
    }
    if (response.errors.length == 0) {
        const saltRounds = 10;
        const confirmation_code = passwordGenerator.generate({
            length: 10,
            numbers: true,
            uppercase: true
        });
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const confirmation_code_hash = await bcrypt.hash(confirmation_code, saltRounds);
        let new_user = false;

        if(userData.email && userData.phone_number && userData.user_name){
            new_user = await User.create({
                email: userData.email,
                password: hashedPassword,
                phone_number: userData.phone_country + userData.phone_number,
                user_name: userData.user_name,
                is_active: false,
                is_tfa_active: false,
                confirmation_code: confirmation_code_hash,
                user_role_id: 1,
                referral_bonus: 0,
            });
        }

        if(new_user && userData.referral &&  userData.user_name && userData.referral != userData.user_name){

            let referrer = await User.findOne({
                where: {
                    user_name: userData.referral,
                }
            });

            if(referrer){
                let referral = await Referral.create({
                    referrer_id: referrer.id,
                    referral_id: new_user.id
                });
            }

        }

        if (new_user) {
            response.status = true;
            response.id = new_user.id;
            let confirmation_url = req.protocol + '://' + req.get('host') + '/auth/activate_email/' + encodeURIComponent(new_user.email) + '/' + encodeURIComponent(new_user.confirmation_code);
            sendConfirmationEmail(userData.email,  'BchConnect Coin Email Confirmation', confirmation_code, confirmation_url);

        }
    }
    return response;

};

exports.resendActivationEmail = async function (req) {
    let response = {
        status: false,
        errors: []
    };
    let userData = req.body;

    let user = await User.findOne({
        where: {
            email: userData.email,
        }
    });
    if (user) {
        const saltRounds = 10;
        const confirmation_code = passwordGenerator.generate({
            length: 10,
            numbers: true,
            uppercase: true
        });
        const confirmation_code_hash = await bcrypt.hash(confirmation_code, saltRounds);
        let updated_users = await User.update({confirmation_code: confirmation_code_hash}, {
            where: {id: user.id}
        });
        if (updated_users.length < 1) {
            return response;
        }
        let confirmation_url = req.protocol + '://' + req.get('host') + '/auth/activate_email/' + encodeURIComponent(user.email) + '/' + encodeURIComponent(user.confirmation_code);

        sendConfirmationEmail(userData.email,  'BchConnect Coin Email Confirmation', confirmation_code, confirmation_url);

        response.status = true;
    }
    return response;
};

exports.activateEmailByUrl = async function (params, res) {

    let response = {
        status: false,
        errors: []
    };
    if (params.email && params.hash) {
        let user = await User.update(
            {is_active: true},
            {
                where: {
                    email: decodeURIComponent(params.email),
                    confirmation_code: decodeURIComponent(params.hash)
                }
            });
        if (user.length > 0) {
            response.status = true;
        }
    }
    else {
        response.errors.push('Params error');
    }
    return response;
};

exports.activateEmailByCode = async function (params) {

    let response = {
        status: false,
        errors: []
    };
    if (params.confirmation_email && params.confirmation_code) {
        let user = await User.findOne({
            where: {
                email: params.confirmation_email,
            }
        });
        let isCodeEqual = user ? await bcrypt.compare(params.confirmation_code, user.confirmation_code) : false;
        if(isCodeEqual){
            user = await User.update(
                {is_active: true},
                {
                    where: {
                        email: params.confirmation_email
                    }
            });
            response.status = true;
        }
    }
    else {
        response.errors.push('Params error');
    }
    return response;

};

function sendConfirmationEmail (email, subject, confirmation_code, confirmation_url){
    const mail_data = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data:`
                    <div style="max-width: 100%; text-align: center;  font-family: 'Arial Black', Gadget, sans-serif">
                        <div style="border: 1px solid #666; max-width: 650px; margin: auto;">
                            <div style="max-width: 100%; padding: 20px;background: #202020; color: #ffffff;"><h1>BchConnect Coin</h1></div>
                            <img style="width: 250px; height: 250px; margin: 20px 0" src="https://s3.amazonaws.com/bchconnect.net/mail_image.png"/>                    
                            <h2>Welcome to BchConnect Coin</h2>
                            <p>You have just created account in BchConnect.</br>To use your account you only have to confirm you registration:</p>
                            <h3><a target="_blank"
                                   style="
                                    background-color: #337ab7;
                                    box-shadow: none;
                                    font-weight: 600;
                                    color: #fff!important;
                                    padding: .5rem 1rem;
                                    font-size: 1.25rem;
                                    line-height: 1.5;
                                    border-radius: .3rem;
                                    display: inline-block;
                                    text-align: center;
                                    white-space: nowrap;
                                    vertical-align: middle;
                                    user-select: none;
                                    border: 1px solid transparent #10707f;
                                    text-decoration: none;
                                    transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                    "
                                   href="`+confirmation_url+`">Confirm Registration</a></h3>
                            <p>OR code:</p>
                            <h2>`+confirmation_code+`</h2>
                            <p>By pressing the &laquo;Complete registration&raquo; button, you confirm that you are <b>18 years or older</b>, that you have read and accepted the terms of the <a>User Agreement</a>,
                            and have agreed to receive notifications and messages.</p>
                        </div>
                        <p>© 2018 BchConnect Coin</p>
                    </div>`
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: ''
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        ReturnPath: 'no-reply@bchconnect.net',
        Source: 'no-reply@bchconnect.net'
    }

    ses.sendEmail(mail_data, (err, data) => {
        if (err) console.log(err, err.stack)
        else console.log(data)
    })
}

exports.sendResetPassEmail = function (req, email,code){
    let confirmation_url = req.protocol + '://' + req.get('host') + '/auth/reset-password-url/' + encodeURIComponent(email) + '/' + encodeURIComponent(code);

    const mail_data = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data:`
                    <div style="max-width: 100%; text-align: center;  font-family: 'Arial Black', Gadget, sans-serif">
                        <div style="border: 1px solid #666; max-width: 650px; margin: auto;">
                            <div style="max-width: 100%; padding: 20px;background: #202020; color: #ffffff;"><h1>BchConnect Coin</h1></div>
                            <img style="width: 250px; height: 250px; margin: 20px 0" src="https://s3.amazonaws.com/bchconnect.net/reset_pass_imagee.png"/>                            <h2>Password reset</h2>
                            <p>Someone has requested a linc to change your password.</br>You can do this through the link below.</p>
                            <h3><a target="_blank"
                                   style="
                                    background-color: #337ab7;
                                    box-shadow: none;
                                    font-weight: 600;
                                    color: #fff!important;
                                    padding: .5rem 1rem;
                                    font-size: 1.25rem;
                                    line-height: 1.5;
                                    border-radius: .3rem;
                                    display: inline-block;
                                    text-align: center;
                                    white-space: nowrap;
                                    vertical-align: middle;
                                    user-select: none;
                                    border: 1px solid transparent #10707f;
                                    text-decoration: none;
                                    transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                    "
                                   href="`+confirmation_url+`">Reset password</a></h3>
                            <p>If you did not request this, please ignore this email.</br>You password will not change until you access the link above and create a new password.</p>
                        </div>
                        <p><i>© 2018 BchConnect Coin</i></p>
                    </div>`
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: ''
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'BchConnect Coin reset password'
            }
        },
        ReturnPath: 'no-reply@bchconnect.net',
        Source: 'no-reply@bchconnect.net'
    };

    ses.sendEmail(mail_data, (err, data) => {
        if (err) console.log(err, err.stack)
        else console.log(data)
    });
};

exports.getSettings = async function (req,res) {
    let user = req.user;

    let settings = {
        is_tfa_active: user. is_tfa_active
    };

    res.json({status: true, settings: settings});
};

