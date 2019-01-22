import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../sevises/authentication.service';
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})

export class AdminLayoutComponent implements OnInit {

    isAuthenticated: boolean;
    isAdmin: boolean;

    constructor(private authService: AuthenticationService) {
        this.isAuthenticated = this.authService.isAuthenticated();
        this.isAdmin = !!this.authService.isAdmin();
        if (!this.isAdmin) {
            document.body.style.backgroundColor = '#476db2';
        } else {
            document.body.style.backgroundColor = '';
        }
    }

    ngOnInit() {

        this.authService.getIsLoggedIn().subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated;
            this.isAdmin = !!this.authService.isAdmin();
            if (!this.isAuthenticated) {
                document.body.style.backgroundColor = '#476db2';
            } else {
                document.body.style.backgroundColor = '';
            }
        });
    }
}
