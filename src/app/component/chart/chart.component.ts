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
    constructor() { }
    ngOnInit() {
        this._setChartJson();
        this.baseChart = new ChartBase(this.chartConfig);
        this.baseChart.generateConfiguration();
        this.baseChart.updateDisplay(this.chartConfig.chart.size.width, this.chartConfig.chart.size.height);
        window.dispatchEvent(new Event('resize'));
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const elem = window.document.getElementById('div_01');
        this.baseChart.updateDisplay(elem.offsetWidth, elem.offsetHeight);
    }
    _setChartJson(): void {
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
                }
            },
            axis: [
                {
                    axisClass: 'NumericAxis',
                    type: 'y',
                    field: 'profit',
                    format: 't',
                    orient: 'left',
                    visible: true,
                    title: 'Profit'
                },
                {
                    axisClass: 'CategoryAxis',
                    type: 'x',
                    field: 'category',
                    format: undefined,
                    orient: 'bottom',
                    visible: true,
                    title: 'Category'
                },
                {
                    axisClass: 'DateTimeAxis',
                    type: 'x',
                    field: 'date',
                    format: undefined,
                    orient: 'top',
                    visible: true,
                    title: 'date'
                }
            ]
        }
    }
}
