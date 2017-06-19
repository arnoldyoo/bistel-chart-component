import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChartComponent } from './component/chart/chart.component';
import { LegendComponent } from './component/legend/legend.component';
import { ChartConfigurationService } from './component/chart/chart.configuration.service';
import { ChartService } from './app.service';

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
  providers: [ChartConfigurationService, ChartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
