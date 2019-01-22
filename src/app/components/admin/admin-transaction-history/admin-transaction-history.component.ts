import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {HttpClient} from '@angular/common/http';
import {AuthHttp} from 'angular2-jwt';
import BigNumber from 'bignumber.js/bignumber';
import {defaultLongDateFormat} from 'ngx-bootstrap/bs-moment/locale/locale.class';

@Component({
  selector: 'admin-transaction-history',
  templateUrl: './admin-transaction-history.component.html',
  styleUrls: ['./admin-transaction-history.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminTransactionHistoryComponent implements OnInit {


  history = [];
  temp = [];
  loadingIndicator = true;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  columns = [
    {prop: 'user.user_name', name: 'User name'},
    {prop: 'currency_from', name: 'Currency'},
    {prop: 'wallet_key_from', name: 'Wallet'},
    {prop: 'amount', name: 'Amount'},
    {prop: 'coins_received', name: 'Coins purchased'},
    {prop: 'createdAt', name: 'Date time'},
  ];


  constructor(private http: HttpClient, private authHttp: AuthHttp) {

  }

  ngOnInit() {
    this.authHttp.post('/admin/ico-transactions-list', []).subscribe((data: any) => {
      this.history = this.convertData(JSON.parse(data._body));
      this.temp = [...this.history];
    });
  }

  convertData(data) {
    let temp = data.filter(function (d) {
      d.amount = (new BigNumber(d.amount.toFixed(8)).toFixed(8)).toString();
      d.coins_received = (new BigNumber(d.coins_received.toFixed(8)).toFixed(8)).toString();
      let date = new Date(d.createdAt);
      let gmt = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
      d.createdAt = gmt.toDateString() + ' ' + gmt.getHours() + ':' + gmt.getMinutes() + ':' + gmt.getSeconds();

      return d;
    });
    return temp;
  }

  updateFilter(event) {
    let val = event.target.value.toLowerCase();

    // filter our data
    let temp = this.temp.filter(function (d) {
      return d.user.user_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.history = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
