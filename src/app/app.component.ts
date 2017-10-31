import { MIChartComponent } from './component/mi-chart.component';
import { Component, OnInit, ViewChild } from '@angular/core';
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
    @ViewChild('michart') michart: MIChartComponent;
    title = 'app works!';
    currentType: string;
    chartConfig: any;
    data: Array<any>;
    chartTypeClick$: Subject<any> = new Subject();
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
        this._setDefaultData();

        this.chartConfig = {
            chart: {
                selector: '',
                uid: '',
                size: {
                    width: 100,
                    height: 100
                },
                margin: {
                    left: 50,
                    right: 50,
                    top: 10,
                    bottom: 100
                },
                data: this.data,
            },
            axis: [
                {
                    axisClass: 'NumericAxis',
                    type: 'y',
                    field: 'profit,rate',
                    format: null,
                    orient: 'left',
                    visible: true,
                    gridline: true,
                    title: 'Profit',
                    tickInfo: {
                        ticks: 5
                    },
                    domain: [0, 100]
                },

                {
                    axisClass: 'DateTimeAxis',
                    type: 'x',
                    field: 'date',
                    format: null,
                    orient: 'bottom',
                    visible: true,
                    gridline: false,
                    title: 'date',
                    tickInfo: {
                        ticks: 10,
                        rotate: 65,
                        format: '%Y-%m-%d'
                    },
                    domain: [new Date(2017, 0, 0) ,new Date(2017, 0, 19)]
                }
            ],
            series: [
                // {
                //     seriesClass: 'LineSeries',
                //     xField: 'date',
                //     yField: 'profit',
                //     visible: true,
                //     displayName: 'profit',
                //     circle: {
                //         fill: {
                //             start: 1483282800000,
                //             end: 1483974000000,
                //             base: 'date'
                //         }
                //     }
                // },
                // {
                //     seriesClass: 'LineSeries',
                //     xField: 'date',
                //     yField: 'rate',
                //     visible: true,
                //     displayName: 'rate',
                //     circle: {
                //         fill: {
                //             start: 1483282800000,
                //             end: 1483974000000,
                //             base: 'date'
                //         }
                //     }
                // }
                {
                    seriesClass: 'ImageSeries',
                    xField: 'date',
                    yField: 'profit',
                    visible: true,
                    displayName: 'profit'
                },
            ],
            plugin: [
                {
                    pluginClass: 'MultiBrushPlugin',
                    direction: 'x',
                    orient: 'bottom',
                    callback: this.multiCallback,
                    disable: true
                },
                {
                    pluginClass: 'DragBase',
                    direction: 'both',
                    disable: false,
                    callback: this.dragCallback
                },
                // {
                //     pluginClass: 'SpecLinePlugin',
                //     value: 45,
                //     color: 'yellow',
                //     orient: 'left',
                //     direction: 'horizontal',
                //     axisKinds: 'numeric',
                //     displayName: 'warning'
                // },
                // {
                //     pluginClass: 'SpecLinePlugin',
                //     value: 85,
                //     color: 'red',
                //     orient: 'left',
                //     direction: 'horizontal',
                //     axisKinds: 'numeric',
                //     displayName: 'alarm'
                // }
            ],
            legend: {
                selector: '#div_02',
                orient: 'bottom',
                series: undefined
            }
        };

        // this.chartConfig = {
        //     chart: {
        //         selector: '',
        //         uid: '',
        //         size: {
        //             width: 100,
        //             height: 100
        //         },
        //         margin: {
        //             left: 50,
        //             right: 50,
        //             top: 50,
        //             bottom: 50
        //         },
        //         data: this.data,
        //         event: {
        //
        //         }
        //     },
        //     axis: [
        //         {
        //             axisClass: 'NumericAxis',
        //             type: 'y',
        //             field: 'profit,revenue,ratio',
        //             format: undefined,
        //             orient: 'left',
        //             visible: true,
        //             gridline: true,
        //             title: 'Profit',
        //             tickInfo : {
        //                 ticks: 5,
        //                 tickFormat: function(d: any) { return '$' + d3.format(',.0f')(d); }
        //             }
        //         },
        //         {
        //             axisClass: 'CategoryAxis',
        //             type: 'x',
        //             field: 'category',
        //             format: undefined,
        //             orient: 'bottom',
        //             visible: true,
        //             gridline: false,
        //             title: 'Category',
        //             tickInfo: {
        //                 rotate: false,
        //                 ticks: 5
        //             }
        //         },
        //         {
        //             axisClass: 'DateTimeAxis',
        //             type: 'x',
        //             field: 'date',
        //             format: undefined,
        //             orient: 'top',
        //             visible: true,
        //             gridline: false,
        //             title: 'date',
        //             tickInfo: {
        //                 ticks: 12
        //             }
        //         },
        //         {
        //             axisClass: 'NumericAxis',
        //             type: 'y',
        //             field: 'rate',
        //             format: undefined,
        //             orient: 'right',
        //             visible: true,
        //             gridline: false,
        //             title: 'Rate',
        //             tickInfo : {
        //                 ticks: 5,
        //                 tickFormat: function(d: any) { return d3.format(',.0f')(d) + '%'; }
        //             }
        //         }
        //     ],
        //     series: [
        //         {
        //             seriesClass: 'ColumnSeries',
        //             xField: 'category',
        //             yField: 'profit',
        //             visible: true,
        //             displayName: 'Profit',
        //             textLabel: {
        //                 show: true
        //                 // format: function(d) {return d+'%';}
        //             }
        //         },
        //     ],
        //     plugin: [
        //         {
        //             pluginClass: 'DragBase',
        //             direction: 'both'
        //         }
        //     ],
        //     legend: {
        //         selector: '#div_02',
        //         orient: 'bottom',
        //         series: undefined
        //     }
        // };
    }

    dragCallback = (data: any, event: any) => {
        console.log(data);
        console.log(event);
    }

    multiCallback = (dates: Array<any>, event: any, uid: any) => {
        console.log(event);
        // this.michart.chart.baseChart.zoomXAxis(dates);
    }

    rerun() {
        this._chartDrawSetting(JSON.parse(this.currentConfigurationString));
    }

    brushDisable() {
        this.michart.chart.baseChart.disabledPlugin('MultiBrushPlugin');
    }

    brushEnable() {
        this.michart.chart.baseChart.enabledPlugin('MultiBrushPlugin');
    }

    dragDisable() {
        this.michart.chart.baseChart.disabledPlugin('DragBase');
    }

    dragEnable() {
        this.michart.chart.baseChart.enabledPlugin('DragBase');
    }

    _setDefaultData() {
        this.data = [];
        for (let i = 0; i < 20; i++) {
            // if (i === 5) {
            //     this.data.push( {  category: 'A' + i,
            //         date: new Date(2017, 0, i).getTime(),
            //         rate: null,
            //         ratio: null,
            //         revenue: null,
            //         profit: null
            //     });
            // } else {
            //     this.data.push( {  category: 'A' + i,
            //         date: new Date(2017, 0, i).getTime(),
            //         rate: Math.round( Math.random() * 10 ),
            //         ratio: Math.round( Math.random() * 110  ),
            //         revenue: Math.round( Math.random() * 120  ),
            //         profit: Math.round( Math.random() * 100  ) } );
            // }

            this.data.push( {  category: 'A' + i,
                date: new Date(2017, 0, i).getTime(),
                rate: Math.round( Math.random() * 10 ),
                ratio: Math.round( Math.random() * 110  ),
                revenue: Math.round( Math.random() * 120  ),
                profit: Math.round( Math.random() * 100  ) } );
        }
        console.log(this.data);
    }

    _chartDrawSetting(data: any) {
        this.currentConfiguration = data;
        this.currentConfigurationString = JSON.stringify(data, undefined, 4);
        this.chartConfig = {
            chart: this.currentConfiguration.chart,
            axis: this.currentConfiguration.axis,
            series: this.currentConfiguration.series,
            plugin: this.currentConfiguration.plugin,
            legend: {
                selector: '#div_02',
                orient: 'bottom',
                series: undefined
            }
        };
    }
}
