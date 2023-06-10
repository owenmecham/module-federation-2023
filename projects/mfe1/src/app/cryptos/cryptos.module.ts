import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CryptosSearchComponent } from './cryptos-search/cryptos-search.component';
import { CRYPTOS_ROUTES } from './cryptos.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CRYPTOS_ROUTES),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
  declarations: [CryptosSearchComponent],
})
export class CryptosModule {}
