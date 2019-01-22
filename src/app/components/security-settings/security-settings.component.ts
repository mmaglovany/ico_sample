import {Component, OnInit} from '@angular/core';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import {isUndefined} from "ngx-bootstrap/bs-moment/utils/type-checks";
import {AuthenticationService} from "../../sevises/authentication.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-security-settings',
    templateUrl: './security-settings.component.html',
    styleUrls: ['./security-settings.component.css']
})
export class SecuritySettingsComponent implements OnInit {

    model: any;
    loading: boolean;
    verify_loading: boolean;
    error: string;
    is_human = false;
    secret: any;
    verified: boolean;
    is_tfa_active = false;
    auth_code: string;
    tooFA = false;
    secret_code = '';
    switcher_button: string;


    constructor(private authenticationService: AuthenticationService, private router: Router) {

        this.model = {
            password: ''
        };
        this.loading = false;
        this.verify_loading = false;
        this.error = '';
        this.auth_code = '';
        this.switcher_button = 'Enable 2FA';
        this.verified = false;

        this.authenticationService.getSettings(this.model.password, '2fa-create-reset')
            .subscribe((result: any) => {
                if (result.settings) {
                    this.is_tfa_active = result.settings.is_tfa_active;
                    if (this.is_tfa_active) {
                        this.switcher_button = 'Reset 2FA';
                    }
                }
            });
    }

    ngOnInit() {
    }

    enableTFA() {
        this.loading = true;

        this.authenticationService.passConfirmTFA(this.model.password, '2fa-create-reset')
            .subscribe((result: any) => {
                this.error = '';
                if (result.status) {
                    this.tooFA = true;
                    this.auth_code = '';
                    this.secret_code = result.secret.base32;
                    console.log(result.secret.otpauth_url);
                    QRCode.toDataURL(result.secret.otpauth_url, function (err, url) {
                        if (!isUndefined(url)) {
                            document.getElementById('qr_code').setAttribute('src', url);
                        }
                    });
                    this.loading = false;
                } else {
                    this.error = 'Password is incorrect.';
                    this.loading = false;
                }
            });

    }

    disableTFA() {
        this.loading = true;
        this.authenticationService.passConfirmTFA(this.model.password, '2fa-disable')
            .subscribe((result: any) => {
                this.error = '';
                if (result.status) {
                    this.switcher_button = 'Enable 2FA';
                    this.is_tfa_active = false;
                    this.loading = false;
                } else {
                    this.error = 'Password is incorrect.';
                    this.loading = false;
                }
            });

    }

    resolved(captchaResponse: string) {
        this.is_human = true;
    }

    verifyCode() {
        this.verify_loading = true;
        this.authenticationService.verifyCode(this.auth_code, '2fa-create-reset')
            .subscribe((result: any) => {
                this.error = '';
                if (result.status) {
                    this.tooFA = false;
                    this.auth_code = '';
                    this.secret_code = '';
                    this.switcher_button = 'Reset 2FA';
                    this.is_tfa_active = true;
                    this.verify_loading = false;
                } else {
                    this.error = 'Code is incorrect.';
                    this.verify_loading = false;
                }
            });
    }

}
