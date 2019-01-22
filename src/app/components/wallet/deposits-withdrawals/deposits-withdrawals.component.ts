import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import * as QRCode from 'qrcode';
import {WalletService} from '../../../sevises/wallet.service';
import BigNumber from 'bignumber.js/bignumber';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbdModalContent} from '../../../shared/top-bar/top-bar.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'deposit-wallet-modal-content',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './deposit-wallet-modal.component.html',
})

export class WalletModalContent implements OnInit {
  @Input() text;
  @Input() copyText;

  step_too = false;
  coins: any;
  is_agree = false;
  is_agree_error = false;
  loading = false;
  error = false;
  address = '';
  is_coppied = false;
  step_too_comon: any;
  coin_name: any;

  constructor(public activeModal: NgbActiveModal, private authHttp: AuthHttp) {
    this.step_too = false;
    this.is_agree = false;
  }

  ngOnInit() {

    this.step_too = false;
    this.is_agree = false;
  }

  copyAddress() {
    this.is_coppied = true;
    setTimeout(() => {
      this.is_coppied = false;
    }, 3000);
  }

  getAddress(coin) {
    if (this.is_agree) {
      this.loading = true;
      if (coin === 'BHCH') {

      } else {
        this.authHttp.post('/wallet/create-wallet', {'coin': coin}).subscribe((data: any) => {
          data = JSON.parse(data._body);
          console.log(data);
          if (data.status) {
            this.address = data.wallet.address;
            QRCode.toDataURL(data.wallet.address, function (err, url) {
              document.getElementById('qr_code').setAttribute('src', url);
              document.getElementById('qr_code_old').setAttribute('src', url);
            });
            this.step_too = true;
            this.loading = false;
          } else {
            this.error = true;
          }
          this.loading = false;
        });
      }
    } else {
      this.is_agree_error = true;
    }
  }
}

@Component({
  selector: 'withdraw-wallet-modal-content',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './withdraw-wallet-modal.component.html',
})

export class WithdrawWalletModalContent implements OnInit {

  loading = false;
  error = false;
  errors = [];
  address = '';
  model: any;
  success = false;
  @Input() available_balance;
  @Input() coin_name;
  @Input() is_tfa_active;
  closeResult = false;

  constructor(public activeModal: NgbActiveModal, private authHttp: AuthHttp, private http: HttpClient) {
    this.available_balance = 0;
    this.model = {
      address: '',
      amount: new BigNumber(0.00000000).toFixed(8),
      tfa_auth: '',
      password: '',
      fee: 0
    };
  }

  ngOnInit() {
    this.success = false;
    this.closeResult = false;
    this.error = false;
    this.errors = [];
    this.model = {
      address: '',
      amount: new BigNumber(0.00000000).toFixed(8),
      tfa_auth: '',
      password: '',
      fee: 0
    };
  }

  withdrawAll() {
    this.model.amount = this.available_balance;
    this.getFee();
  }

  withdraw() {
    this.success = false;
    this.closeResult = false;
    this.loading = true;
    this.model.coin = this.coin_name;
    this.authHttp.post('/wallet/withdraw-coins', this.model).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if (data.status) {
        this.success = true;
        this.closeResult = true;
      } else {
        this.errors = data.errors;
        this.error = true;
      }
      this.loading = false;
    });
  }

  getFee() {
    if (this.model.address !== '' && this.model.amount !== 0) {
      this.authHttp.post('/wallet/get-fee', {
        coin: this.coin_name,
        amount: this.model.amount,
        address: this.model.address
      }).subscribe((data: any) => {
        data = JSON.parse(data._body);
        if (data.status && data.fee !== '') {
          console.log(data.fee);
          this.model.fee = data.fee;
        } else {
          this.model.fee = 0;
        }
      });
    }
  }
}

@Component({
  selector: 'app-deposits-withdrawals',
  templateUrl: './deposits-withdrawals.component.html',
  styleUrls: ['./deposits-withdrawals.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DepositsWithdrawalsComponent implements OnInit {

  coins: any;
  depo_btc_loading = false;
  depo_ltc_loading = false;
  btc_error = false;
  ltc_error = false;
  ico_settings: any;

  constructor(private authHttp: AuthHttp, private walletService: WalletService, private modalService: NgbModal) {
    this.ico_settings = {
      ico_enabled: false,
      withdraw_enable: false,
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

    this.coins = {
      BTC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        open: false
      },
      LTC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        open: false
      },
      USD: {
        available_balance: new BigNumber(0.00).toFixed(2),
        pending_received_balance: new BigNumber(0.00).toFixed(2),
        address: '',
        open: false
      },
      ABC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        open: false
      }
    };
  }

  ngOnInit() {
    this.init();

  }

  init() {
    this.getIcoSetttings();
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
    });
  }

  getWallet(coin) {
    if (coin === 'BHCH') {
      let modalRef = this.modalService.open(NgbdModalContent);
      modalRef.componentInstance.text = 'Wallet';
      modalRef.componentInstance.copyText = 'BHCH wallet will be available after ICO';
    } else {
      this.authHttp.post('/wallet/get-wallet', {'coin': coin}).subscribe((data: any) => {
        data = JSON.parse(data._body);
        if (data.status) {
          this.coins[coin].open = true;
          this.coins[coin].address = data.wallet.address;
          let modalRef = this.modalService.open(WalletModalContent);
          modalRef.componentInstance.coin_name = coin;
          modalRef.componentInstance.coins = this.coins;
          modalRef.componentInstance.step_too_comon = false;
          QRCode.toDataURL(this.coins[coin].address, function (err, url) {
            document.getElementById('qr_code').setAttribute('src', url);
            document.getElementById('qr_code_old').setAttribute('src', url);
          });
        } else {
          let modalRef = this.modalService.open(WalletModalContent);
          modalRef.componentInstance.coins = this.coins;
          modalRef.componentInstance.coin_name = coin;
          modalRef.componentInstance.step_too_comon = true;
        }
      });
    }
  }

  createWallet(coin) {
    if (coin === 'BTC') {
      this.depo_btc_loading = true;
    }
    if (coin === 'LTC') {
      this.depo_ltc_loading = true;
    }
    if (coin === 'BHCH') {

    } else {
      this.authHttp.post('/wallet/create-wallet', {'coin': coin}).subscribe((data: any) => {
        data = JSON.parse(data._body);
        if (data.status) {
          this.coins[coin].open = true;
          this.coins[coin].address = data.wallet.address;
          let modalRef = this.modalService.open(WalletModalContent);
          modalRef.componentInstance.coin_name = coin;
          modalRef.componentInstance.coins = this.coins;
          modalRef.componentInstance.step_too_comon = data.is_new;
          QRCode.toDataURL(this.coins[coin].address, function (err, url) {
            document.getElementById('qr_code').setAttribute('src', url);
            document.getElementById('qr_code_old').setAttribute('src', url);
          });
        } else {
          if (coin === 'BTC') {
            this.btc_error = true;
          }
          if (coin === 'LTC') {
            this.ltc_error = true;
          }
        }
        if (coin === 'BTC') {
          this.depo_btc_loading = false;
        }
        if (coin === 'LTC') {
          this.depo_ltc_loading = false;
        }
      });
    }

  }

  openWithdrawWalletModal(coin) {
    if (this.ico_settings.withdraw_enable) {
      let modalRef = this.modalService.open(WithdrawWalletModalContent);
      modalRef.componentInstance.coin_name = coin;
      modalRef.componentInstance.available_balance = this.coins[coin].available_balance;
      modalRef.componentInstance.is_tfa_active = this.ico_settings.is_tfa_active;
      modalRef.result.then((result) => {
        this.init();
      });
    } else {
      this.openNotAvaliableModal(coin);
    }

  }

  openNotAvaliableModal(coin) {
    let modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.text = 'Withdrawal';
    modalRef.componentInstance.copyText = coin + ' withdrawal will be available after ICO';
  }

  getIcoSetttings() {
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
        if (data.settings.withdraw_enable !== 'undefined') {
          this.ico_settings.withdraw_enable = data.settings.withdraw_enable;
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
    });
  }

}
