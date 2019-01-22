import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';


@Component({
    selector: 'app-referral-tree',
    templateUrl: './referral-tree.component.html',
    styleUrls: ['./referral-tree.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ReferralTreeComponent implements OnInit {

    @Input('data') items: Array<Object>;
    @Input('key') key: string;


    constructor() {
    }

    ngOnInit() {
    }

}
