import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


let now = new Date();
let gmt = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);

@Component({
  selector: 'app-ico-settings',
  templateUrl: './ico-settings.component.html',
  styleUrls: ['./ico-settings.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IcoSettingsComponent implements OnInit {

  model: NgbDateStruct;

  loading = false;
  loading_notification = false;
  error = false;
  settings: any = {
    ico_enabled: false,
    withdraw_enable: false,
    ico_date: '',
    btc_transactions_notification_id: '',
    ltc_transactions_notification_id: '',
    ico_time: {hour: 0, minute: 0},
    ico_max_coins_day: 0,
    ico_volume: 1000000,
    sold_coins: 0,
    ico_max_user_coins_day: 0,
    ico_min_user_coins_day: 0,
    abc_rate: 0.1,
    version: ''
  };

  constructor(private authHttp: AuthHttp) {
  }

  ngOnInit() {
    this.getIcoSetttings();
  }

  saveSettings() {
    this.loading = true;
    this.authHttp.post('/admin/update-ico-settings', this.settings).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if (data.starus) {
      }
      this.loading = false;
      this.getIcoSetttings();
    });
  }

  resetNotification() {
    this.loading_notification = true;
    this.authHttp.post('/admin/reset-transaction-notifications', this.settings).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if (data.status) {
      }
      this.loading_notification = false;
      this.getIcoSetttings();
    });
  }

  stopIco() {
    this.settings.ico_enabled = 0;
    this.saveSettings();
  }

  getIcoSetttings() {
    this.settings.ico_date = {year: gmt.getFullYear(), month: gmt.getMonth() + 1, day: gmt.getDate()};
    this.authHttp.post('/admin/get-ico-settings', []).subscribe((data: any) => {
      data = JSON.parse(data._body);
      if (data.status) {
        if (data.settings.ico_enabled !== 'undefined') {
          this.settings.ico_enabled = data.settings.ico_enabled === '1';
        }
        if (data.settings.withdraw_enable !== 'undefined') {
          this.settings.withdraw_enable = data.settings.withdraw_enable === '1';
        }
        if (data.settings.btc_transactions_notification_id !== 'undefined') {
          this.settings.btc_transactions_notification_id = data.settings.btc_transactions_notification_id;
        }
        if (data.settings.ltc_transactions_notification_id !== 'undefined') {
          this.settings.ltc_transactions_notification_id = data.settings.ltc_transactions_notification_id;
        }
        if (data.settings.ico_date !== 'undefined') {
          this.settings.ico_date = JSON.parse(data.settings.ico_date);
        }
        if (data.settings.ico_time !== 'undefined') {
          this.settings.ico_time = JSON.parse(data.settings.ico_time);
        }
        if (data.settings.ico_volume !== 'undefined') {
          this.settings.ico_volume = data.settings.ico_volume;
        }
        if (data.settings.sold_coins !== 'undefined') {
          this.settings.sold_coins = data.settings.sold_coins;
        }
        if (data.settings.ico_max_coins_day !== 'undefined') {
          this.settings.ico_max_coins_day = data.settings.ico_max_coins_day;
        }
        if (data.settings.ico_max_user_coins_day !== 'undefined') {
          this.settings.ico_max_user_coins_day = data.settings.ico_max_user_coins_day;
        }
        if (data.settings.ico_min_user_coins_day !== 'undefined') {
          this.settings.ico_min_user_coins_day = data.settings.ico_min_user_coins_day;
        }
        if (data.settings.abc_rate !== 'undefined') {
          this.settings.abc_rate = data.settings.abc_rate;
        }if (data.settings.version !== 'undefined') {
          this.settings.version = data.settings.version;
        }
      }
    });
  }
}
