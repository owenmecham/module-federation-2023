import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Chart1Component } from './chart1/chart1.component';
import { Chart2Component } from './chart2/chart2.component';
import { Chart3Component } from './chart3/chart3.component';
import { Chart4Component } from './chart4/chart4.component';

@NgModule({
  declarations: [
    AppComponent,
    Chart1Component,
    Chart2Component,
    Chart3Component,
    Chart4Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
