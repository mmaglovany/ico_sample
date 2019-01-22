import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js/bignumber';
import * as $ from 'jquery';
import {WalletService} from '../../sevises/wallet.service';

@Component({
  selector: 'ngbd-modal-content',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="modal-body">
      <h1 *ngIf="text" class="modal-text">{{ text }}</h1>
      <p *ngIf="copyText" class="modal-text">{{ copyText }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary btn-raised" (click)="activeModal.close('Close click')">
        Close
      </button>
    </div>
  `
})

export class NgbdModalContent {
  @Input() text;
  @Input() copyText;

  constructor(public activeModal: NgbActiveModal) {
  }
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class TopBarComponent implements OnInit {
  user: any;
  share_url: any;
  copied = false;
  coins: any;

  constructor(private modalService: NgbModal, private walletService: WalletService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.share_url = window.location.origin + '/#/register/referral/' + this.user.user_name;
    this.coins = {
      BTC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        open: false
      },
      LTC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        open: false
      },
      USD: {
        available_balance: new BigNumber(0.00).toFixed(2),
        pending_received_balance: new BigNumber(0.00).toFixed(2),
        address: '',
        open: false
      },
      ABC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        open: false
      }
    };
    this.walletService.getWallets().subscribe(wallets => {
      if (wallets) {
        if (wallets.BTC) {
          this.coins.BTC.available_balance = wallets.BTC.available_balance;
          this.coins.BTC.pending_received_balance = wallets.BTC.pending_received_balance;
        }
        if (wallets.LTC) {
          this.coins.LTC.available_balance = wallets.LTC.available_balance;
          this.coins.LTC.pending_received_balance = wallets.LTC.pending_received_balance;
        }
        if (wallets.ABC) {
          this.coins.ABC.available_balance = wallets.ABC.available_balance;
          this.coins.ABC.pending_received_balance = wallets.ABC.pending_received_balance;
        }
      }
    });

  }

  ngOnInit() {
    this.walletService.getAllWallets().subscribe(wallets => {
      if (wallets) {
        if (wallets.BTC) {
          this.coins.BTC.available_balance = wallets.BTC.available_balance;
          this.coins.BTC.pending_received_balance = wallets.BTC.pending_received_balance;
        }
        if (wallets.LTC) {
          this.coins.LTC.available_balance = wallets.LTC.available_balance;
          this.coins.LTC.pending_received_balance = wallets.LTC.pending_received_balance;
        }
        if (wallets.ABC) {
          this.coins.ABC.available_balance = wallets.ABC.available_balance;
          this.coins.ABC.pending_received_balance = wallets.ABC.pending_received_balance;
        }
      }
    });
  }

  copyReferral() {
    $('#copied-text').fadeIn('slow', function () {
      $('#copied-text').fadeOut();
    }).css('display', 'inline-block');
  }

  openCopiedModal() {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.copyText = 'Copied : ' + this.share_url;
  }

  openNotAvaliableModal() {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.text = 'Feature is available after ICO';
  }
}
