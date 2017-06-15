import { Component, OnInit } from '@angular/core';
import {LegendConfiguration} from "./model/legend.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    title = 'app works!';
    chartinfo: any;
    axis: any;
    series: any;
    legendinfo: LegendConfiguration;

    consturctor() {

    }
    ngOnInit() {
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
            }
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
            // {
            //     seriesClass: 'PieSet',
            //     visible: true,
            //     type: 'group', // stacked
            //     series: [
            //         {
            //             seriesClass: 'PieSeries',
            //             xField: 'profit',
            //             yField: 'profit',
            //             visible: true,
            //             displayName: 'Profit',
            //             label: true
            //         },
            //         {
            //             seriesClass: 'PieSeries',
            //             xField: 'revenue',
            //             yField: 'revenue',
            //             visible: true,
            //             displayName: 'Revenue',
            //             label: true
            //         }
            //     ]
            // },
            // {
            //     seriesClass: 'PieSeries',
            //     xField: 'profit',
            //     yField: 'profit',
            //     visible: true,
            //     displayName: 'Profit',
            //     label: {
            //       visible: true,
            //       side: 'out'
            //     }
            // },

            // {
            //     seriesClass: 'ColumnSeries',
            //     xField: 'category',
            //     yField: 'profit',
            //     visible: true,
            //     displayName: 'Profit'
            // },
            // {
            //     seriesClass: 'LineSeries',
            //     xField: 'category',
            //     yField: 'profit',
            //     visible: true,
            //     displayName: 'Profit'
            // }
            {
                seriesClass: 'ColumnSet',
                visible: true,
                type: 'group', // stacked
                series: [
                    {
                        seriesClass: 'ColumnSeries',
                        xField: 'category',
                        yField: 'profit',
                        visible: true,
                        displayName: 'Profit'
                    },
                    {
                        seriesClass: 'ColumnSeries',
                        xField: 'category',
                        yField: 'revenue',
                        visible: true,
                        displayName: 'Revenue'
                    },
                    {
                        seriesClass: 'ColumnSeries',
                        xField: 'category',
                        yField: 'ratio',
                        visible: true,
                        displayName: 'Ratio'
                    }
                ]
            },
            // {
            //     seriesClass: 'LineSeries',
            //     xField: 'category',
            //     yField: 'rate',
            //     visible: true,
            //     displayName: 'Rate'
            // }
            // {
            //     seriesClass: 'BarSeries',
            //     xField: 'revenue',
            //     yField: 'category',
            //     visible: true,
            //     displayName: 'Category'
            // }
            // {
            //     seriesClass: 'BarSet',
            //     visible: true,
            //     type: 'group', // stacked
            //     series: [
            //         {
            //             seriesClass: 'BarSeries',
            //             xField: 'profit',
            //             yField: 'category',
            //             visible: true,
            //             displayName: 'Profit'
            //         },
            //         {
            //             seriesClass: 'BarSeries',
            //             xField: 'revenue',
            //             yField: 'category',
            //             visible: true,
            //             displayName: 'Revenue'
            //         },
            //         {
            //             seriesClass: 'BarSeries',
            //             xField: 'ratio',
            //             yField: 'category',
            //             visible: true,
            //             displayName: 'Ratio'
            //         }
            //     ]
            // }

        ];
        this.legendinfo = {
            selector: '#div_02',
            orient: 'bottom',
            series: this.series
        };
    }
}
