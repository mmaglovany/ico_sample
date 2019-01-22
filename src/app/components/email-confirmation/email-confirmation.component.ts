import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../sevises/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-email-confirmation',
    templateUrl: './email-confirmation.component.html',
    styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {

    confirmed: boolean;
    error: string;
    user_email: string;
    loading: boolean;
    is_human = false;
    confirmation = false;
    recapcha = '';

    constructor(private authenticationService: AuthenticationService, private router: Router, route: ActivatedRoute) {
        this.user_email = '';
        if (route.snapshot.params.status) {
            this.confirmed = route.snapshot.params.status;
        }
    }

    ngOnInit() {
    }

    resend_email() {
        this.loading = true;
        if (this.is_human) {
            this.authenticationService.resendEmail(this.user_email)
                .subscribe((result: any) => {
                    this.error = '';
                    if (!result) {
                        console.log('app error');
                        this.loading = false;
                    }
                    if (result.status === true) {
                        this.confirmation = true;
                        this.loading = false;
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
            console.log(this.error);
            this.loading = false;
        }
    }

    resolved(captchaResponse: string) {
        this.is_human = true;
    }

}
