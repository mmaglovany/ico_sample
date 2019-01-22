import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthenticationService} from "../../../sevises/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {

    email_model: any;
    reset_model: any;
    loading: boolean;
    reset_loading: boolean;
    error: string;
    is_human = false;
    mailSent = false;
    resetPass = false;
    recapcha = '';

    constructor(private authenticationService: AuthenticationService, private router: Router, route: ActivatedRoute) {
        this.email_model = {
            email: ''
        };
        this.reset_model = {
            email: '',
            password: '',
            confirm_password: '',
            reset_pass_token: ''
        };
        this.mailSent = false;
        this.resetPass = false;
        if (route.snapshot.params.reset_pass_token) {
            this.resetPass = true;
            this.reset_model.reset_pass_token = route.snapshot.params.reset_pass_token;
            this.reset_model.email = route.snapshot.params.email;
        }
    }

    ngOnInit() {
    }

    sendEmail() {
        this.loading = true;
        if (this.is_human) {
            this.authenticationService.sendResetPassEmail(this.email_model.email)
                .subscribe((result: any) => {
                    this.error = '';
                    if (result.status) {
                        this.mailSent = true;
                    } else {
                        this.error = 'Email is incorrect.';
                        this.loading = false;
                    }
                });
          this.recapcha = '';
        } else {
            this.error = 'You must be at least a human.';
            this.loading = false;
        }

    }

    resetPasswords() {
        this.reset_loading = true;

        this.authenticationService.resetPass(this.reset_model)
            .subscribe((result: any) => {
                this.error = '';
                console.log(result);
                if (result.status) {
                    this.router.navigate(['login']);
                } else {
                    this.error = 'Reset password error.';
                    this.reset_loading = false;
                }
            });
    }


    resolved(captchaResponse: string) {
        this.is_human = true;
    }
}
