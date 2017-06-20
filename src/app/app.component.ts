import { Component, OnInit } from '@angular/core';
import { LegendConfiguration } from './model/legend.interface';
import { AppService } from './app.service';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app works!';
    currentType: string;
    chartinfo: any;
    axis: any;
    series: any;
    legendinfo: LegendConfiguration;
    data: Array<any>;
    chartTypeClick$: Subject<string> = new Subject();
    currentConfiguration: any;
    currentConfigurationString: string;
    responseStream: Observable<any>;

    constructor(
        private appS: AppService
    ) {
        this.responseStream = this.chartTypeClick$.flatMap((type: string) => {
            this.currentType = type;
            return this.appS.getChartConfiguration(type);
        });

        this.responseStream.subscribe(
            (res) => {

                this._setDefaultData();
                // const re = /(:{)/g;
                // const comma = /(,)/g;
                // this.currentConfigurationString = JSON.stringify(res).replace(re, ':\n\t{' ).replace(comma, ',\n');
                this._chartDrawSetting(res);
            },
            (err) => {
                console.log('Error : ', err);
            },
            () => {
                console.log('complete');
            }
        );

    }

    ngOnInit() {
        this.currentType = 'column';

        // default chart configuration setting

        this.chartinfo = {
            selector: '#div_01',
            uid: 'chart01_uid',
            size: {
                width: 800,
                height: 400
            },
            margin: {
                left: 50,
                right: 50,
                top: 50,
                bottom: 50
            },
            data: this.data
        };
        this.axis = [
            {
                axisClass: 'NumericAxis',
                type: 'y',
                field: 'profit,revenue,ratio',
                format: undefined,
                orient: 'left',
                visible: true,
                gridline: true,
                title: 'Profit',
                tickInfo : {
                    ticks: 5,
                    tickFormat: function(d) { return '$' + d3.format(',.0f')(d); }
                }
            },
            {
                axisClass: 'CategoryAxis',
                type: 'x',
                field: 'category',
                format: undefined,
                orient: 'bottom',
                visible: true,
                gridline: false,
                title: 'Category',
                tickInfo: {
                    rotate: false,
                    ticks: 5
                }
            },
            {
                axisClass: 'DateTimeAxis',
                type: 'x',
                field: 'date',
                format: undefined,
                orient: 'top',
                visible: true,
                gridline: false,
                title: 'date',
                tickInfo: {
                    ticks: 12
                }
            },
            {
                axisClass: 'NumericAxis',
                type: 'y',
                field: 'rate',
                format: undefined,
                orient: 'right',
                visible: true,
                gridline: false,
                title: 'Rate',
                tickInfo : {
                    ticks: 5,
                    tickFormat: function(d) { return d3.format(',.0f')(d) + '%'; }
                }
            }
        ];
        this.series = [
            {
                seriesClass: 'ColumnSeries',
                xField: 'category',
                yField: 'profit',
                visible: true,
                displayName: 'Profit'
            },
        ];
        this.legendinfo = {
            selector: '#div_02',
            orient: 'bottom',
            series: this.series
        };
    }

    rerun() {
        this._chartDrawSetting(JSON.parse(this.currentConfigurationString));
    }

    _setDefaultData() {
        this.data = [];
        for (let i = 0; i < 20; i++) {
            this.data.push( {  category: 'B' + i,
                           date: new Date(2017, 0, i).getTime(),
                           rate: Math.round( Math.random() * 10 ),
                           ratio: Math.round( Math.random() * 110  ),
                           revenue: Math.round( Math.random() * 120  ),
                           profit: Math.round( Math.random() * 100  ) } );
        }
    }

    _chartDrawSetting(data: any) {

        this.currentConfiguration = data;
        this.currentConfigurationString = JSON.stringify(data, undefined, 4);
        this.chartinfo = this.currentConfiguration.chart;
        this.series = this.currentConfiguration.series;
        this.axis = this.currentConfiguration.axis;

        this.legendinfo = {
            selector: '#div_02',
            orient: 'bottom',
            series: this.series
        };
    }
}
