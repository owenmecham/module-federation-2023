import { Component } from '@angular/core';
import { WalletLibService } from 'wallet-lib';

@Component({
  selector: 'app-cryptos-search',
  templateUrl: './cryptos-search.component.html',
})
export class CryptosSearchComponent {
  active = false;
  balance: number;
  constructor(private walletService: WalletLibService) {
    this.balance = this.walletService.balance;
  }
  search(): void {
    this.active = true;
  }
  reset(): void {
    this.active = false;
  }
  purchase(): void {
    this.walletService.purchase(100);
    this.balance = this.walletService.balance;

}
}

