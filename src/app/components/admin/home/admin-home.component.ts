import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";

import * as $ from 'jquery';
import {AuthenticationService} from "../../../sevises/authentication.service";
import {AuthHttp} from "angular2-jwt";
import BigNumber from "bignumber.js/bignumber";

let now = new Date();
let gmt = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AdminHomeComponent implements OnInit {

    isAuthenticated: boolean;
    end: any;
    countdown = {
        days: '0',
        hours: '0',
        minutes: '0',
        seconds: '0'
    };
    coins: any;
    timer: any;
    ico_settings: any;

    constructor(private authService: AuthenticationService, private router: Router, private authHttp: AuthHttp) {
        this.ico_settings = {
            ico_enabled: false,
            ico_date: {year: 1, month: 1, day: 1},
            ico_time: {hour: 0, minute: 0},
            ico_max_coins_day: 0,
            ico_volume: 1000000,
            sold_coins: 0,
            delay_total: 0,
            is_tfa_active: false,
            ico_max_user_coins_day: 0,
            ico_min_user_coins_day: 0
        };
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

        this.timer = setInterval(() => {

            let _second = 1000;
            let _minute = _second * 60;
            let _hour = _minute * 60;
            let _day = _hour * 24;

            let now: any = new Date();
            let gmt: any = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
            let distance: any = this.end - gmt;

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

    ngOnInit() {
        this.getIcoSetttings();
    }

    redirectIfNotAutentificated() {
        if (!this.isAuthenticated) {
            this.router.navigate(['login']);
        }
    }

    getIcoSetttings() {
        this.ico_settings.ico_date = {year: gmt.getFullYear(), month: gmt.getMonth() + 1, day: gmt.getDate()};
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
                    this.ico_settings.sold_coins = data.settings.sold_coins.toFixed(8);
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
        });
    }
}
