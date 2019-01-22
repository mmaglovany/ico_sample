import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../sevises/authentication.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    model: any;
    loading: boolean;
    verify_loading: boolean;
    error: string;
    is_human = false;
    secret: any;
    tooFA = false;
    auth_code: string;
    recapcha = '';

    constructor(private authenticationService: AuthenticationService, private router: Router) {
        this.authenticationService.setIsLoggedIn(false);
        this.authenticationService.logout();
        this.model = {
            email: '',
            password: ''
        };
        this.loading = false;
        this.verify_loading = false;
        this.error = '';
        this.auth_code = '';
    }

    ngOnInit() {
        this.authenticationService.setIsLoggedIn(false);
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        if (this.is_human) {
            this.authenticationService.login(this.model.email, this.model.password)
                .subscribe((result: any) => {
                    this.error = '';
                    if (result.status) {
                        if (this.authenticationService.isAuthenticated()) {
                            this.authenticationService.setIsLoggedIn(true);
                            this.router.navigate(['/']);
                        } else {
                            this.tooFA = true;
                            this.auth_code = '';
                            this.loading = false;
                        }
                    } else {
                        let error_str = '';
                        result.errors.forEach(function (error) {
                            error_str += '<p>' + error + '</p>';
                        });
                        this.error = error_str;
                        this.loading = false;
                    }
                });
          this.recapcha = '';
        } else {
            this.error = 'You must be at least a human.';
            this.loading = false;
        }

    }

    goBack() {
        this.model = {
            email: '',
            password: ''
        };
        this.tooFA = false;
    }

    verifyCode() {
        this.verify_loading = true;
        this.authenticationService.loginVerifyCode(this.auth_code, this.model.email)
            .subscribe((result: any) => {
                this.error = '';
                if (result.status) {
                    this.authenticationService.setIsLoggedIn(true);
                    this.router.navigate(['/']);
                } else {
                    this.error = 'Code is incorrect.';
                    this.verify_loading = false;
                }
            });
    }

    resolved(captchaResponse: string) {
        this.is_human = true;
    }

}
