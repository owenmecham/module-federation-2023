import { Component, OnInit } from '@angular/core';
import { WalletLibService } from 'wallet-lib';
import { LookupService } from '../plugins/lookup.service';
import { PluginOptions } from '../plugins/plugin';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  balance = 0;
  plugins: PluginOptions[] = [];
  graphs: PluginOptions[] = [];
  constructor(private walletService: WalletLibService, private lookupService: LookupService) {
	this.balance = this.walletService.balance;
  }
  async ngOnInit(): Promise<void> {
	this.plugins = await this.lookupService.lookup();
  }
  handleClick(graph: PluginOptions): void {
	this.graphs.push(graph);
  }
}
