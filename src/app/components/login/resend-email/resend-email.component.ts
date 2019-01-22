import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthenticationService} from "../../../sevises/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-resend-email',
    templateUrl: './resend-email.component.html',
    styleUrls: ['./resend-email.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ResendEmailComponent implements OnInit {

    email_model: any;
    loading: boolean;
    error: string;
    is_human = false;
    mailSent = false;
    recapcha = '';

    constructor(private authenticationService: AuthenticationService, private router: Router, route: ActivatedRoute) {
        this.email_model = {
            email: ''
        };
        this.mailSent = false;
    }

    ngOnInit() {
    }

    sendEmail() {
        this.loading = true;
        if (this.is_human) {
            this.authenticationService.sendEmailConfirmation(this.email_model.email)
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

    resolved(captchaResponse: string) {
        this.is_human = true;
    }
}
