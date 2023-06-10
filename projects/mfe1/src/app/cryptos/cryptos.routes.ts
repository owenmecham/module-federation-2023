import { Routes } from '@angular/router';
import { CryptosSearchComponent } from './cryptos-search/cryptos-search.component';
export const CRYPTOS_ROUTES: Routes = [
  {
    path: '',
    component: CryptosSearchComponent,
    pathMatch: 'full',
  },
  {
    path: 'cryptos-search',
    component: CryptosSearchComponent,
  },
];
