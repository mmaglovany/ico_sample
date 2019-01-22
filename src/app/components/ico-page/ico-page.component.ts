import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthHttp} from 'angular2-jwt';
import {AuthenticationService} from '../../sevises/authentication.service';
import {Router} from '@angular/router';

let now = new Date();
let gmt = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
import BigNumber from 'bignumber.js/bignumber';
import {WalletService} from '../../sevises/wallet.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ico-modal-content',
  templateUrl: './ico-modal.component.html',
  encapsulation: ViewEncapsulation.None
})

export class IcoModalContent implements OnInit {
  @Input() units;
  @Input() total;
  @Input() coin_name;
  @Input() is_tfa_active;
  tfa = '';

  closeResult = false;
  error = false;
  success = false;
  errors = [];
  loading = false;
  tfa_auth_error = false;

  constructor(public activeModal: NgbActiveModal, private walletService: WalletService) {
    this.tfa = '';
    this.tfa_auth_error = false;
  }

  ngOnInit() {
    this.tfa = '';
    this.tfa_auth_error = false;
  }

  buyCoins() {
    this.error = false;
    this.loading = true;
    this.errors = [];
    this.success = false;
    if (this.is_tfa_active && this.tfa === '') {
      this.tfa_auth_error = true;
      this.loading = false;
    } else {
      this.walletService.buyABC(this.coin_name, this.total, this.units, this.tfa).subscribe((result: any) => {
        if (result.status) {
          this.success = true;
          this.closeResult = true;
        } else if (result === false) {
          this.error = true;
          this.errors = ['Payment failed.'];
          this.closeResult = false;
        } else {
          this.error = true;
          this.errors = result.errors;
          this.closeResult = false;
        }
        this.loading = false;
        this.tfa_auth_error = false;
      });
    }
  }


}

@Component({
  selector: 'app-ico-page',
  templateUrl: './ico-page.component.html',
  styleUrls: ['./ico-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IcoPageComponent implements OnInit {

  isAuthenticated: boolean;
  end: any;
  countdown = {
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0'
  };
  timer: any;

  buy_btc_loading = false;
  buy_ltc_loading = false;
  buy_btc_success = false;
  buy_ltc_success = false;
  btc_error = false;
  ltc_error = false;
  btc_errors = [];
  ltc_errors = [];
  ico_settings: any;
  coins: any;
  btc_tfa = '';
  ltc_tfa = '';
  ico_text = '';
  btc_auth: any;
  ltc_auth: any;

  constructor(private modalService: NgbModal, private authService: AuthenticationService, private router: Router, private authHttp: AuthHttp, private walletService: WalletService, private http: HttpClient) {

    this.coins = {
      BTC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        units: new BigNumber(0.00000000).toFixed(8),
        total: new BigNumber(0.00000000).toFixed(8),
        price: new BigNumber(0.00000000).toFixed(8),
        fee: new BigNumber(0.00000000).toFixed(8)
      },
      LTC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        units: new BigNumber(0.00000000).toFixed(8),
        total: new BigNumber(0.00000000).toFixed(8),
        price: new BigNumber(0.00000000).toFixed(8),
        fee: new BigNumber(0.00000000).toFixed(8)
      }
    };

    this.btc_tfa = '';
    this.ltc_tfa = '';
    this.ico_settings = {
      ico_enabled: false,
      ico_date: {year: 1, month: 1, day: 1},
      ico_time: {hour: 0, minute: 0},
      ico_max_coins_day: 0,
      ico_volume: 1000000,
      sold_coins: 0,
      delay_total: 0,
      is_tfa_active: false,
      ico_active: false,
      ico_max_user_coins_day: 0,
      ico_min_user_coins_day: 0
    };
    this.end = new Date('01/01/2018 0:0 AM');
    this.getIcoSetttings();
    this.isAuthenticated = authService.isAuthenticated();
    this.redirectIfNotAutentificated();
    this.countdown = {
      days: '0',
      hours: '0',
      minutes: '0',
      seconds: '0'
    };

    this.ico_text = '';
    this.setTimer();
  }

  ngOnInit() {
    this.ico_text = '';
    this.init();

  }

  setTimer() {
    this.timer = setInterval(() => {

      let _second = 1000;
      let _minute = _second * 60;
      let _hour = _minute * 60;
      let _day = _hour * 24;

      let now: any = new Date();
      let gmt: any = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
      let distance: any = this.end - gmt;

      if (gmt >= this.end && this.ico_settings.ico_enabled) {
        this.ico_settings.ico_active = true;
        this.ico_text = 'ICO is Live now. You can purchase coins';
      }
      if (distance < 0) {
        clearInterval(this.timer);
        return;
      }

      let days = Math.floor(distance / _day);
      let hours = Math.floor((distance % _day) / _hour);
      let minutes = Math.floor((distance % _hour) / _minute);
      let seconds = Math.floor((distance % _minute) / _second);

      if (days < 10) {
        this.countdown.days = '0' + days.toString();
      } else {
        this.countdown.days = days.toString();
      }
      if (hours < 10) {
        this.countdown.hours = '0' + hours.toString();
      } else {
        this.countdown.hours = hours.toString();
      }
      if (minutes < 10) {
        this.countdown.minutes = '0' + minutes.toString();
      } else {
        this.countdown.minutes = minutes.toString();
      }
      if (seconds < 10) {
        this.countdown.seconds = '0' + seconds.toString();
      } else {
        this.countdown.seconds = seconds.toString();
      }
    }, 1000);
  }

  init() {
    this.walletService.getWallets().subscribe((result: any) => {
      if (result) {
        this.coins = result;
        if (this.coins.BTC) {
          this.coins.BTC.available_balance = this.coins.BTC.available_balance;
          this.coins.BTC.pending_received_balance = this.coins.BTC.pending_received_balance;
        }
        if (this.coins.LTC) {
          this.coins.LTC.available_balance = this.coins.LTC.available_balance;
          this.coins.LTC.pending_received_balance = this.coins.LTC.pending_received_balance;
        }
        if (this.coins.ABC) {
          this.coins.ABC.available_balance = this.coins.ABC.available_balance;
          this.coins.ABC.pending_received_balance = this.coins.ABC.pending_received_balance;
        }

      }
      this.getIcoSetttings();
      this.setTimer();
    });
  }

  buyAll(coin) {
    this.coins[coin].total = this.coins[coin].available_balance;
    this.coins[coin].units = new BigNumber((this.coins[coin].total / this.coins[coin].price).toFixed(8)).toFixed(8);

  }

  toFormatUnits(coin) {
    let units = this.coins[coin].units;
    let price = this.coins[coin].price;
    this.coins[coin].total = new BigNumber((units * price).toFixed(8)).toFixed(8);
  }

  buyCoins(coin) {

    this.init();

    if (coin === 'BTC') {
      this.btc_errors = [];
      this.buy_btc_loading = true;
      this.btc_error = false;
      this.buy_btc_success = false;
    }
    if (coin === 'LTC') {
      this.ltc_errors = [];
      this.buy_ltc_loading = true;
      this.ltc_error = false;
      this.buy_ltc_success = false;
    }
    if (this.coins[coin].units > parseFloat(this.ico_settings.ico_max_user_coins_day)) {
      this[coin.toLowerCase() + '_errors'].push('Your daily limit ' + this.ico_settings.ico_max_user_coins_day + '.');
      if (coin === 'BTC') {
        this.buy_btc_loading = false;
        this.btc_error = true;
      }
      if (coin === 'LTC') {
        this.buy_ltc_loading = false;
        this.ltc_error = true;
      }
    } else if (parseFloat(this.coins[coin].available_balance) < this.coins[coin].total) {
      this[coin.toLowerCase() + '_errors'].push('Not enough ' + coin + '.');
    } else if (parseFloat(this.ico_settings.ico_volume) < this.ico_settings.sold_coins) {
      this[coin.toLowerCase() + '_errors'].push('Not enough offers.');
    } else if (parseFloat(this.ico_settings.ico_volume) < this.coins[coin].units) {
      this[coin.toLowerCase() + '_errors'].push('Not enough offers.');
    } else if (this[coin.toLowerCase() + '_errors'].length < 1 && this.coins[coin].total > 0) {


      let modalRef = this.modalService.open(IcoModalContent);
      modalRef.componentInstance.units = this.coins[coin].units;
      modalRef.componentInstance.total = this.coins[coin].total;
      modalRef.componentInstance.coin_name = coin;
      modalRef.componentInstance.is_tfa_active = this.ico_settings.is_tfa_active;
      modalRef.result.then((result) => {
        if (result) {
          this.coins[coin].total = new BigNumber(0.00000000).toFixed(8);
          this.coins[coin].units = new BigNumber(0.00000000).toFixed(8);
          if (coin === 'BTC') {
            this.buy_btc_success = true;
            this.buy_btc_loading = false;
          }
          if (coin === 'LTC') {
            this.buy_ltc_success = true;
            this.buy_ltc_loading = false;
          }
          setTimeout(() => {
            this.buy_btc_success = false;
            this.buy_ltc_success = false;
          }, 3000);
          this.init();
        } else {
          if (coin === 'BTC') {
            this.buy_btc_loading = false;
          }
          if (coin === 'LTC') {
            this.buy_ltc_loading = false;
          }
          this.init();
        }
      }, (reason) => {
        if (coin === 'BTC') {
          this.buy_btc_loading = false;
        }
        if (coin === 'LTC') {
          this.buy_ltc_loading = false;
        }
        this.init();
      });
    } else {
      if (coin === 'BTC') {
        this.buy_btc_loading = false;
      }
      if (coin === 'LTC') {
        this.buy_ltc_loading = false;
      }
    }
    if (this[coin.toLowerCase() + '_errors'].length > 0) {
      if (coin === 'BTC') {
        this.buy_btc_loading = false;
        this.btc_error = true;
      }
      if (coin === 'LTC') {
        this.buy_ltc_loading = false;
        this.ltc_error = true;
      }
    }
  }


  redirectIfNotAutentificated() {
    if (!this.isAuthenticated) {
      this.router.navigate(['login']);
    }
  }

  getIcoSetttings() {
    this.ico_settings.ico_date = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.authHttp.post('/ico/get-user-ico-settings', []).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if (data.status) {
        if (data.settings.ico_date !== 'undefined') {
          this.ico_settings.ico_date = JSON.parse(data.settings.ico_date);
        }
        if (data.settings.ico_time !== 'undefined') {
          this.ico_settings.ico_time = JSON.parse(data.settings.ico_time);
        }
        if (data.settings.ico_enabled !== 'undefined') {
          this.ico_settings.ico_enabled = data.settings.ico_enabled;
        }
        if (data.settings.ico_volume !== 'undefined') {
          this.ico_settings.ico_volume = data.settings.ico_volume;
        }
        if (data.settings.sold_coins !== 'undefined') {
          this.ico_settings.sold_coins = data.settings.sold_coins;
        }
        if (data.settings.ico_max_coins_day !== 'undefined') {
          this.ico_settings.ico_max_coins_day = data.settings.ico_max_coins_day;
        }
        if (data.settings.ico_max_user_coins_day !== 'undefined') {
          this.ico_settings.ico_max_user_coins_day = data.settings.ico_max_user_coins_day;
        }
        if (data.settings.ico_min_user_coins_day !== 'undefined') {
          this.ico_settings.ico_min_user_coins_day = data.settings.ico_min_user_coins_day;
        }
        if (data.settings.is_tfa_active !== 'undefined') {
          this.ico_settings.is_tfa_active = data.settings.is_tfa_active;
        }
        if (data.settings.delay_total !== 'undefined') {
          this.ico_settings.delay_total = data.settings.delay_total;
        }
        if (data.settings.btc_rate) {
          this.coins.BTC.price = new BigNumber(data.settings.btc_rate.toFixed(8)).toFixed(8);
        }
        if (data.settings.ltc_rate) {
          this.coins.LTC.price = new BigNumber(data.settings.ltc_rate.toFixed(8)).toFixed(8);
        }
      }

      this.end = new Date(this.ico_settings.ico_date.month +
        '/' + this.ico_settings.ico_date.day +
        '/' + this.ico_settings.ico_date.year +
        ' ' + this.ico_settings.ico_time.hour +
        ':' + this.ico_settings.ico_time.minute);

      if (gmt >= this.end && this.ico_settings.ico_enabled) {
        this.ico_text = 'ICO is Live now. You can purchase coins';
      } else {
        this.ico_text = 'ICO has been successfully completed, Please purchase in the next round';
      }
    });
  }

}
