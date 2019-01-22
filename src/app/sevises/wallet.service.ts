import {Injectable} from '@angular/core';
import {HttpResponse, HttpClient} from '@angular/common/http';
import {Response} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import BigNumber from 'bignumber.js/bignumber';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class WalletService {

  coins: any;
  private wallets = new ReplaySubject<any>();

  constructor(private http: HttpClient, public authHttp: AuthHttp, private router: Router) {
    this.coins = {
      BTC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        units: new BigNumber(0.00000000).toFixed(8),
        total: new BigNumber(0.00000000).toFixed(8),
        price: new BigNumber(0.00000000).toFixed(8),
        fee: new BigNumber(0.00000000).toFixed(8),
        open: false
      },
      LTC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        units: new BigNumber(0.00000000).toFixed(8),
        total: new BigNumber(0.00000000).toFixed(8),
        price: new BigNumber(0.00000000).toFixed(8),
        fee: new BigNumber(0.00000000).toFixed(8),
        open: false
      },
      USD: {
        available_balance: new BigNumber(0.00).toFixed(2),
        pending_received_balance: new BigNumber(0.00).toFixed(2),
        address: '',
        units: new BigNumber(0.00000000).toFixed(8),
        total: new BigNumber(0.00000000).toFixed(8),
        price: new BigNumber(0.00000000).toFixed(8),
        fee: new BigNumber(0.00000000).toFixed(8),
        open: false
      },
      ABC: {
        available_balance: new BigNumber(0.00000000).toFixed(8),
        pending_received_balance: new BigNumber(0.00000000).toFixed(8),
        address: '',
        units: new BigNumber(0.00000000).toFixed(8),
        total: new BigNumber(0.00000000).toFixed(8),
        price: new BigNumber(0.00000000).toFixed(8),
        fee: new BigNumber(0.00000000).toFixed(8),
        open: false
      }
    };
  }

  getBalance(coin) {
    return this.authHttp.post('/wallet/get-balance', {'coin': coin})
      .map((response: Response) => {
        return response.json();
      })
      .catch(err => {
        return Observable.of(false);
      });
  }

  setAllWallets(value) {
    this.wallets.next(value);
  }

  getAllWallets(): Observable<any> {
    return this.wallets.asObservable();
  }

  getWallets() {
    return this.authHttp.post('/wallet/get-wallets', [])
      .map((response: Response) => {
        let result: any = response.json();
        if (response.status) {
          if (result.wallets.BTC) {
            this.coins.BTC.available_balance = new BigNumber(result.wallets.BTC.balance.available_balance).toFixed(8);
            this.coins.BTC.pending_received_balance = new BigNumber(result.wallets.BTC.balance.pending_received_balance).toFixed(8);
          }
          if (result.wallets.LTC) {
            this.coins.LTC.available_balance = new BigNumber(result.wallets.LTC.balance.available_balance).toFixed(8);
            this.coins.LTC.pending_received_balance = new BigNumber(result.wallets.LTC.balance.pending_received_balance).toFixed(8);
          }
          if (result.wallets.ABC) {
            this.coins.ABC.available_balance = new BigNumber(result.wallets.ABC.balance.available_balance).toFixed(8);
            this.coins.ABC.pending_received_balance = new BigNumber(result.wallets.ABC.balance.pending_received_balance).toFixed(8);
          }
        }
        this.setAllWallets(this.coins);
        return this.coins;
      })
      .catch(err => {
        return Observable.of(false);
      });
  }

  buyABC(coin, coin_volume, abc_volume, tfa) {
    return this.authHttp.post('/wallet/buy-abccoin', {
      coin: coin,
      coin_volume: coin_volume,
      abc_volume: abc_volume,
      tfa: tfa
    })
      .map((response: Response) => {
        return response.json();
      })
      .catch(err => {
        return Observable.of(false);
      });
  }
}
