import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChartComponent } from './component/chart/mi-chart.component';
import { LegendComponent } from './component/legend/mi-legend.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
      AppComponent,
      ChartComponent,
      LegendComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ AppService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
