import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {AuthHttp} from 'angular2-jwt';
import BigNumber from 'bignumber.js/bignumber';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserListComponent implements OnInit {

  users = [];
  temp = [];
  loadingIndicator = true;

  page: any;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  columns = [
    {prop: 'user_name', name: 'User name'},
    {prop: 'BTC', name: 'BTC Balance'},
    {prop: 'LTC', name: 'LTC Balance'},
    {prop: 'ABC', name: 'BHCH Balance'},
  ];

  constructor(private authHttp: AuthHttp) {
    this.page = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      pageNumber: 0,
      offset: 0,
      sort_by: 'id',
      sort_order: 'asc',
    };
  }

  ngOnInit() {
    this.authHttp.post('/admin/user-list', []).subscribe((response: any) => {
      let data = JSON.parse(response._body);
      console.log(data);
      this.users = this.convertData(data.users);
      this.temp = [...this.users];
      this.page.totalElements = data.totalElements;
      this.page.totalPages = data.totalElements / this.page.size;

    });
  }

  convertData(data) {
    let temp = data.filter(function (d) {
      if (d.BTC) {
        d.BTC = (new BigNumber(parseFloat(d.BTC).toFixed(8)).toFixed(8)).toString();
      }
      if (d.LTC) {
        d.LTC = (new BigNumber(parseFloat(d.LTC).toFixed(8)).toFixed(8)).toString();
      }
      if (d.ABC) {
        d.ABC = (new BigNumber(parseFloat(d.ABC).toFixed(8)).toFixed(8)).toString();
      }
      return d;
    });
    return temp;
  }

  onSort(event) {
    console.log(event);
    this.page.sort_by = event.column.prop;
    this.page.sort_order = event.column.newValue;
    this.authHttp.post('/admin/user-list', this.page).subscribe((response: any) => {
      let data = JSON.parse(response._body);
      this.users = this.convertData(data.users);
      this.temp = [...this.users];
      this.page.totalElements = data.totalElements;
      this.page.totalPages = data.totalElements / this.page.size;

    });
  }

  updateFilter(event) {
    let val = event.target.value.toLowerCase();
    // filter our data
    let temp = this.temp.filter(function (d) {
      return d.user_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    console.log(this.page.pageNumber);
    this.authHttp.post('/admin/user-list', this.page).subscribe((response: any) => {
      let data = JSON.parse(response._body);
      this.users = this.convertData(data.users);
      this.temp = [...this.users];
      this.page.totalElements = data.totalElements;
      this.page.totalPages = data.totalElements / this.page.size;

    });
  }
}
