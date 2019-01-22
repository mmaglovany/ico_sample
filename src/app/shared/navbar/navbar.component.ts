import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../sevises/authentication.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    isAuthenticated: boolean;

    courses: any;

    constructor(private authService: AuthenticationService, private router: Router, private http: HttpClient) {
        this.isAuthenticated = authService.isAuthenticated();
        this.courses = {
            BTC: 0,
            BCH: 0,
            ETH: 0,
            LTC: 0
        };
        this.http.get('https://api.coinbase.com/v2/exchange-rates?currency=LTC').subscribe((result: any) => {
            if (result.data && result.data.rates.USD) {
                this.courses.LTC = result.data.rates.USD;
            }
        });
        this.http.get('https://api.coinbase.com/v2/exchange-rates?currency=BTC').subscribe((result: any) => {
            if (result.data && result.data.rates.USD) {
                this.courses.BTC = result.data.rates.USD;
            }
        });
    }

    ngOnInit() {
        this.authService.getIsLoggedIn().subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated;
        });
    }

    logout() {
        this.authService.setIsLoggedIn(false);
        this.isAuthenticated = this.authService.isAuthenticated();
        this.router.navigate(['login']);
    }
}
