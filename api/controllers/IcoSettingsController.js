const IcoSettings = require('../../sequelize/models').ico_settings;
const historyTransaction = require('../../sequelize/models').transaction;
const Rates = require('../../sequelize/models').rates;
const curl = require('curlrequest');
const passwordGenerator = require('generate-password');
const bcrypt = require('bcrypt');
require('dotenv').config();
let BlockIo = require('block_io');
let block_io_btc = new BlockIo(process.env.BLOCK_BTC_IO_API_KEY, process.env.BLOCK_BTC_IO_SECRET_PIN, process.env.BLOCK_BTC_IO_VERSION);
let block_io_ltc = new BlockIo(process.env.BLOCK_LTC_IO_API_KEY, process.env.BLOCK_LTC_IO_SECRET_PIN, process.env.BLOCK_LTC_IO_VERSION);


exports.getStatus = async function () {

}
exports.updateAllRates = async function () {

  upadateRate('BTC', 'USD');
  upadateRate('LTC', 'USD');

  return {
    status: true,
    errors: [],
    settings: []
  };
};

exports.resetTransactionNotifications = async function (req) {

  let result = {
    status: true,
    errors: [],
    settings: []
  };
  const saltRounds = 10;
  const code = passwordGenerator.generate({
    length: 10,
    numbers: true,
    uppercase: true
  });
  const endpoint_key = await bcrypt.hash(code, saltRounds);

  let url = 'https://bchconnect.net/wallet/get-transactions-notification/' + encodeURIComponent(endpoint_key);
  await setSetting('notification_endpoint_key', endpoint_key);

  block_io_btc.create_notification({
    'type': 'account',
    'url': encodeURI(url)
  }, async (error, response) => {
    if (response.data && response.data.notification_id) {
      await setSetting('btc_transactions_notification_id', response.data.notification_id);
    }

  });

  block_io_ltc.create_notification({
    'type': 'account',
    'url': encodeURI(url)
  }, async (error, response) => {
    if (response.data && response.data.notification_id) {
      await setSetting('ltc_transactions_notification_id', response.data.notification_id);
    }
  });

  return result;

};


function upadateRate(coin, currency) {
  curl.request({
    url: 'https://api.coinbase.com/v2/exchange-rates?currency=' + coin
  }, async (err, result) => {
    result = JSON.parse(result);
    if (result.data && result.data.rates.USD) {
      let rate = await Rates.findOne({
        where: {
          coin: coin,
          currency: currency,
        }
      });
      if (rate) {
        console.log(parseFloat(result.data.rates[currency]));
        await Rates.update({price: parseFloat(result.data.rates[currency])}, {
          where: {
            coin: coin,
            currency: currency,
          }
        });
      } else {
        await Rates.create({
          coin: coin,
          currency: currency,
          price: parseFloat(result.data.rates[currency])
        });
      }
    }
  });
}

exports.getIcoSettings = async function () {
  let response = {
    status: false,
    errors: [],
    settings: []
  };

  let settings = await icoSettings();

  let settings_object = {};
  settings.forEach(function (setting) {
    settings_object[setting.name] = setting.value;
  });

    settings_object['sold_coins'] = 0;
    settings_object['version'] = await getCommit();

  if (settings.length > 0) {
    response.settings = settings_object;
    response.status = true;
  }

  return response;
};

function getCommit() {
  return new Promise(function (resolve, reject) {
      require('child_process').exec('git rev-parse HEAD', (err, stdout) => {
        resolve(stdout);
      });
    }
  )
}

exports.getUserIcoSettings = async function (req) {

  let response = {
    status: false,
    errors: [],
    settings: []
  };
  let user = req.user;
  let settings = await icoSettings();

  let settings_object = {};
  settings.forEach(function (setting) {
    settings_object[setting.name] = setting.value;
  });

  settings_object['sold_coins'] = 0;
  let all_time_transaction_total = await historyTransaction.findOne({
    attributes: [[historyTransaction.sequelize.fn('sum', historyTransaction.sequelize.col('coins_received')), 'total']],
    where: {
      type: 'ico',
    }
  });
  if (all_time_transaction_total.dataValues.total) {
    settings_object['sold_coins'] = all_time_transaction_total.dataValues.total;
  }
  let day = JSON.parse(settings_object.ico_date);
  let time = JSON.parse(settings_object.ico_time);
  let start_date = new Date(day.month +
    '/' + day.day +
    '/' + day.year +
    ' ' + time.hour +
    ':' + time.minute);

  settings_object['is_tfa_active'] = user.is_tfa_active;
  settings_object['ico_enabled'] = settings_object['ico_enabled'] === '1';
  settings_object['withdraw_enable'] = settings_object['withdraw_enable'] === '1';

  if (!settings_object['abc_rate']) {
    settings_object['abc_rate'] = 1;
  }
  let ltc_rate = await Rates.findOne({
    where: {
      coin: 'LTC',
      currency: 'USD',
    }
  });
  if (ltc_rate) {
    settings_object['ltc_rate'] = (1 / ltc_rate.price) * settings_object['abc_rate'];
  } else {
    settings_object['ltc_rate'] = 0.00000000;
  }

  let btc_rate = await Rates.findOne({
    where: {
      coin: 'BTC',
      currency: 'USD',
    }
  });
  if (btc_rate) {
    settings_object['btc_rate'] = (1 / btc_rate.price) * settings_object['abc_rate'];
  }
  else {
    settings_object['btc_rate'] = 0.00000000;
  }


  let start = new Date();
  start.setHours(0, 0, 0, 0);

  let end = new Date();
  end.setHours(23, 59, 59, 999);
  let delay_transaction_total = await historyTransaction.findOne({
    attributes: [[historyTransaction.sequelize.fn('sum', historyTransaction.sequelize.col('coins_received')), 'total']],
    where: {
      initiator_id: user.id,
      type: 'ico',
      createdAt: {
        $between: [start, end]
      }
    }
  });

  if (delay_transaction_total) {
    settings_object['delay_total'] = delay_transaction_total.dataValues.total;
  }

  if (settings.length > 0) {
    response.settings = settings_object;
    response.status = true;
  }

  return response;
};

exports.updateIcoSettings = async function (req) {

  let response = {
    status: false,
    errors: [],
    settings: []
  };

  if (req.body.ico_enabled !== 'undefined') {
    await setSetting('ico_enabled', req.body.ico_enabled);
  }
  if (req.body.ico_date !== 'undefined') {
    await setSetting('ico_date', JSON.stringify(req.body.ico_date));
  }
  if (req.body.ico_time !== 'undefined') {
    await setSetting('ico_time', JSON.stringify(req.body.ico_time));
  }
  if (req.body.ico_max_coins_day !== 'undefined') {
    await setSetting('ico_max_coins_day', req.body.ico_max_coins_day);
  }
  if (req.body.ico_volume !== 'undefined') {
    await setSetting('ico_volume', req.body.ico_volume);
  }
  if (req.body.ico_max_user_coins_day !== 'undefined') {
    await setSetting('ico_max_user_coins_day', req.body.ico_max_user_coins_day);
  }
  if (req.body.ico_min_user_coins_day !== 'undefined') {
    await setSetting('ico_min_user_coins_day', req.body.ico_min_user_coins_day);
  }
  if (req.body.abc_rate !== 'undefined') {
    await setSetting('abc_rate', req.body.abc_rate);
  }
  if (req.body.withdraw_enable !== 'undefined') {
    await setSetting('withdraw_enable', req.body.withdraw_enable);
  }

  response.status = true;

  return response;
};


async function icoSettings() {
  return await IcoSettings.findAll();
}

async function setSetting(name, value) {
  let setting = await IcoSettings.findOne({
    where: {
      name: name
    }
  });

  if (setting) {
    setting = await IcoSettings.update({'value': value}, {
      where: {
        name: name
      }
    });
  } else {
    setting = await IcoSettings.create({
      'name': name,
      'value': value
    });
  }
  return setting;

}

function getSetting(name) {
  return IcoSettings.findOne({
    where: {
      name: name,
    }
  });
}
