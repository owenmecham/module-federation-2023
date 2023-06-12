import { Component } from '@angular/core';
import { WalletLibService } from 'wallet-lib';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  balance = 0;
  constructor(private walletService: WalletLibService) {
	this.balance = this.walletService.balance;
  }
}
