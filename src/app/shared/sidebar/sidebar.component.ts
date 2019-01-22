import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ROUTES} from './sidebar-routes.config';
import {Router, ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../sevises/authentication.service";

declare var $: any;

@Component({
    // moduleId: module.id,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    isAuthenticated: boolean;
    user: any;

    constructor(private router: Router, private route: ActivatedRoute, private authService: AuthenticationService) {
        this.isAuthenticated = authService.isAuthenticated();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        $.getScript('./assets/js/app-sidebar.js');
        this.menuItems = ROUTES.filter(menuItem => menuItem);

        this.authService.getIsLoggedIn().subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated;
        });
    }

    logout() {
        this.authService.setIsLoggedIn(false);
        this.authService.logout();
        this.isAuthenticated = this.authService.isAuthenticated();
        this.router.navigate(['login']);
    }

    /*//NGX Wizard - skip url change
    ngxWizardFunction(path: string) {
        if (path.indexOf('forms/ngx') !== -1) {
            this.router.navigate(['forms/ngx/wizard'], {skipLocationChange: false});
        }
    }*/
}
