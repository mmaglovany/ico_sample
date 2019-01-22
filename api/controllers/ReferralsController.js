const User = require('../../sequelize/models').user;


exports.setReferral = async function (user, referral) {
    return await User.findAll();
};
exports.getReferralsTree = async function (user,depth) {
    let include =  {
        model: User,
        attributes: ['user_name'],
        as: 'user_referrals',
        nested: true,
    };

    include = addInclude(include,depth-1);

    let user_refs = await User.find({
        include: {
            model: User,
            attributes: ['user_name'],
            as: 'user_referrals',
            nested: true,
            include: include
        },
        where: {
            id: user.id,
        }
    });

    return await user_refs.user_referrals;
};

exports.getReferralsList = async function (user,depth) {
    let include =  {
        model: User,
        attributes: ['user_name'],
        as: 'user_referrals',
        nested: true,
    };

    include = addInclude(include,depth-1);

    let user_refs = await User.find({
        attributes: ['user_name'],
        include: {
            model: User,
            attributes: ['user_name'],
            as: 'user_referrals',
            nested: true,
            include: include
        },
        where: {
            id: user.id,
        }
    });

    let referals = await convertTreeToList(user_refs,[],0);

    return await referals;
};


addInclude = function (include, depth) {
    if(!include.include){
        include.include = {
            model: User,
            attributes: ['user_name'],
            as: 'user_referrals',
            nested: true,
        };
        depth = --depth;
        if(depth > 0){
            include.include =  addInclude( include.include, depth);
            return include;
        }
    }
    return include;
};


exports.getUserReferrals = async function (user) {
    let user_refs = await User.findOne({
        include: {
            model: User,
            as: 'user_referrals',
        },
        where: {
            id: user.id,
        }
    });
    return await user_refs.user_referrals;
};


function convertTreeToList(referals, array, level) {
    level = ++level;
    if(!array){
        array = [];
    }
    for(var i = referals.user_referrals.length - 1; i >= 0; i--) {
        if(referals.user_referrals[i].user_referrals){
            referals.user_referrals[i].dataValues.level = level;
            array.push(referals.user_referrals[i])
            let sublist = convertTreeToList(referals.user_referrals[i],array, level);
            array.concat(sublist);
        }
    }
    return array;
}