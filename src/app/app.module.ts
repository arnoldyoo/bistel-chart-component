import { MIChartComponent } from './component/mi-chart.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChartComponent } from './component/chart/chart.component';
import { LegendComponent } from './component/legend/legend.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
      AppComponent,
      ChartComponent,
      LegendComponent,
      MIChartComponent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpModule
  ],
  exports: [
      ChartComponent,
      LegendComponent
  ],
  providers: [ AppService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
