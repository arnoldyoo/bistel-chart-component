import { ChartBase } from './../../common/chart-base';
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-chart',
    templateUrl: 'chart.component.html',
    styles: [`
        #div_01 {
            border: 1px solid black;
        }
        path, line {
            fill: none;
            stroke: #ccc;
            shape-rendering: crispEdges;
        }
    `],
    encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit {
    baseChart: ChartBase;
    chartConfig: any;
    currentData: any;

    constructor() { }

    ngOnInit() {
        this._setChartJson();
        this.baseChart = new ChartBase(this.chartConfig);
        this.baseChart.updateDisplay(this.chartConfig.chart.size.width, this.chartConfig.chart.size.height);
        window.dispatchEvent(new Event('resize'));
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const elem = window.document.getElementById('div_01');
        this.baseChart.updateDisplay(elem.offsetWidth, elem.offsetHeight);
    }

    chartItemClick(event: any) {
        this.currentData = event.data;
        console.log('chartItemClick : ', this.currentData);
    }

    _setChartJson() {
        this.chartConfig = {
            chart: {
                selector: '#div_01',
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
                event: {
                    itemClick: this.chartItemClick
                }
            },
            axis: [
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
            ],
            series: [
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
                {
                    seriesClass: 'PieSeries',
                    xField: 'profit',
                    yField: 'profit',
                    visible: true,
                    displayName: 'Profit',
                    label: {
                      visible: true,
                      side: 'out'
                    }
                },

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
                // {
                //     seriesClass: 'ColumnSet',
                //     visible: true,
                //     type: 'group', // stacked
                //     series: [
                //         {
                //             seriesClass: 'ColumnSeries',
                //             xField: 'category',
                //             yField: 'profit',
                //             visible: true,
                //             displayName: 'Profit'
                //         },
                //         {
                //             seriesClass: 'ColumnSeries',
                //             xField: 'category',
                //             yField: 'revenue',
                //             visible: true,
                //             displayName: 'Revenue'
                //         },
                //         {
                //             seriesClass: 'ColumnSeries',
                //             xField: 'category',
                //             yField: 'ratio',
                //             visible: true,
                //             displayName: 'Ratio'
                //         }
                //     ]
                // },
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

            ]
        };
    }
}
