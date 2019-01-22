import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthHttp} from "angular2-jwt";
import {DatatableComponent} from "@swimlane/ngx-datatable";

@Component({
    selector: 'app-referrals-members',
    templateUrl: './referrals-members.component.html',
    styleUrls: ['./referrals-members.component.css'],
        encapsulation: ViewEncapsulation.None
})
export class ReferralsMembersComponent implements OnInit {

    referrals = [];
    temp = [];
    levels = [];
    loadingIndicator = true;
    @ViewChild(DatatableComponent) table: DatatableComponent;

    columns = [
        {prop: 'user_name', name: 'User name'},
        {prop: 'level', name: 'Level'}
    ];

    constructor(private http: HttpClient, private authHttp: AuthHttp) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.loadingIndicator = false;
        }, 1500);
        this.authHttp.post('/referrals/get-referrals-list', []).subscribe((data: any) => {
            this.referrals = JSON.parse(data._body);
            this.temp = [...JSON.parse(data._body)];
            for (let i = 0; i < this.referrals.length; i++ ) {
                if (this.levels.indexOf(this.referrals[i].level) < 0) {
                    this.levels.push(this.referrals[i].level);
                }
            }
        });
    }

    updateFilter(event) {
        let val = event.target.value.toLowerCase();

        // filter our data
        let temp = this.temp.filter(function (d) {
            return d.user_name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.referrals = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    updateLevel(event) {

        let val = event.target.value;

        // filter our data
        let temp = this.temp.filter(function (d) {
            return d.level == val || val == 'Level';
        });

        // update the rows
        this.referrals = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }
}
