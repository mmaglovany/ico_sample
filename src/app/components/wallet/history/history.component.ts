import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {WalletService} from "../../../sevises/wallet.service";
import {HttpClient} from "@angular/common/http";
import BigNumber from "bignumber.js/bignumber";
import {DatatableComponent} from "@swimlane/ngx-datatable";


@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {

    @ViewChild(DatatableComponent) table: DatatableComponent;
    /*columns = [
        {prop: 'createdAt', name: 'Date time', width: '200'},
        {prop: 'type', name: 'Action'},
        {prop: 'amount', name: 'Amount'}
    ];*/
    transactions: any;
    temp: any;

    constructor(private authHttp: AuthHttp, private walletService: WalletService, private http: HttpClient) {
        this.transactions = [];
    }

    ngOnInit() {
        this.getHistory('BHCH', 'all');
    }

    convertDate(data) {
        return data;
    }

    serchFilter(event) {
        let val = event.target.value.toLowerCase();
        let temp = this.temp.filter(function (d) {
            let search_str = (d.type === 'ico' ? 'Buy ' + d.currency_to : '') +
                (d.type === 'deposit' ? 'Deposit ' + d.currency_to : '') +
                (d.type === 'withdraw' ? 'Withdraw' + d.currency_from : '') +
                'UNITS TOTAL ' + (d.type === 'ico' ? d.currency_to + ': ' + d.coins_received + ', PRICE ' + d.amount : '') +
                (d.type === 'deposit' ? d.currency_to + ': ' + d.amount : '') +
                (d.type === 'withdraw' ? d.currency_from + ': ' + d.amount : '');
            return search_str.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.transactions = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    updateFilter(event) {
        let val = event.target.value.toLowerCase();
        let type = 'sent';
        this.getHistory(val, type);
    }

    getHistory(coin, type) {
        this.authHttp.post('/wallet/get-transactions-history',
            {
                coin: coin,
                type: type
            }).subscribe((data: any) => {
            this.transactions = this.convertData(JSON.parse(data._body));
            this.temp = [...this.transactions];
        });
    }

    convertData(data) {
        let temp = data.filter(function (d) {
            d.amount = (new BigNumber(d.amount.toFixed(8)).toFixed(8)).toString();
            if (d.coins_received) {
                d.coins_received = (new BigNumber(d.coins_received.toFixed(8)).toFixed(8)).toString();
            }

            d.createdAt = new Date(d.createdAt);
            return d;
        });
        return temp;
    }

    selectTab(coin) {
        this.getHistory(coin, 'all');
    }
}
