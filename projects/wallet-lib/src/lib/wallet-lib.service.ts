import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root',
})
export class WalletLibService {
  private balanceAmount = 1000;
  public get balance(): number {
	return this.balanceAmount;
  }
  constructor() {}
  public purchase(purchaseAmount: number): void {
	this.balanceAmount = this.balanceAmount - purchaseAmount;
  }
}
