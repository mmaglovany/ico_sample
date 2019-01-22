import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../sevises/authentication.service';

@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent implements OnInit {

    isAuthenticated: boolean;

    constructor(private authService: AuthenticationService) {
        this.isAuthenticated = authService.isAuthenticated();
        if (!this.isAuthenticated) {
            document.body.style.backgroundColor = '#476db2';
        } else {
            document.body.style.backgroundColor = '';
        }
    }

    ngOnInit() {
        this.authService.getIsLoggedIn().subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated;
            if (!this.isAuthenticated) {
                document.body.style.backgroundColor = '#476db2';
            } else {
                document.body.style.backgroundColor = '';
            }
        });
    }
}
