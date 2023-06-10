import { Component } from '@angular/core';

@Component({
  selector: 'app-cryptos-search',
  templateUrl: './cryptos-search.component.html',
})
export class CryptosSearchComponent {
  active = false;
  search(): void {
    this.active = true;
  }

  reset(): void {
    this.active = false;
  }

  purchase(): void {}
}
