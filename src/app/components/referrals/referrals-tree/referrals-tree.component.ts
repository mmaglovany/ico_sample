import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthHttp} from "angular2-jwt";

import * as $ from 'jquery';

@Component({
    selector: 'app-referrals',
    templateUrl: './referrals-tree.component.html',
    styleUrls: ['./referrals-tree.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ReferralsTreeComponent implements OnInit, AfterViewInit {

    referrals: any;
    key = 'user_referrals';

    constructor(private http: HttpClient, private authHttp: AuthHttp) {
        this.referrals = [];
    }

    ngOnInit() {
        this.authHttp.post('/referrals/get-referrals-tree', []).subscribe((data: any) => {
            this.referrals = JSON.parse(data._body);
            $.getScript('./assets/js/app-tree.js');
        });
    }

    ngAfterViewInit() {
    }

}
